import pynmea2
import re
import serial
import requests
import configparser

ServerUrl = 'http://serverurl'
ServerPort = '5055'

ComPort = 'COM9'
ComSpeed = 19200


def sendtraccar(radioid, lat, lon): #Sends a POST request to the server with the ID and the coordinates
    try:
        requests.post(ServerUrl+':'+ServerPort, data = {'id' : radioid, 'lat': lat, 'lon': lon})
        print('Coordinates sent to server')
    except requests.exceptions.Timeout:
        print('Socket error: timeout')
    except requests.exceptions.TooManyRedirects:
        print('Socket error: Too Many Redirects')
    except requests.exceptions.RequestException as e:
        print('Socket error: general failure')


def decoder(frame):#Decodes the string into something more understandable
    try:
        if(frame[0]=='*NTF'):
            if(frame[1]=='CTRL'):
                print('Control frame:', str(frame[2:]))
            elif(frame[1]=='UI'):
                print('UI frame', str(frame[2:]))
            elif(frame[1]=='MCH'):
                print('Channel control frame', str(frame[2:]))
            elif(frame[1]=='DPMR'):
                print('dPMR frame', str(frame[2:]))
            elif(frame[1]=='IDAS'):
                print('IDAS frame', str(frame[2:]))
            else:
                print('This frame has still to be documented')
                print(frame)
        else:
            print('This is not a valid PC-CMDv2 frame!')
    except IndexError:
        print('Invalid frame')



ser=serial.Serial(ComPort, ComSpeed, timeout = 2)
eol = b'\x03'



while True:
    response = b'' 
    byteread = b'' 
    while not (byteread==eol): #While we haven't received eol
       byteread = ser.read() #Read one byte, stuff it in a temp variable
       response += byteread #Add it to the read string
    datain = str(response.decode('utf-8')) #Convert it  and copy everything into a string    

    datain = datain.strip('\x03')#Remove those stx and etx chars...
    datain = datain.strip('\x02')
    rxframe=re.split(''',(?=(?:[^'"]|'[^']*'|"[^"]*")*$)''', datain)#Split the comma-separated string into a nice list
    decoder(rxframe)
    try: #Do we even have a 9th field? If not, don't even bother to read the list...
        nmeastring = rxframe[9].strip('"')
        try: #OK, we have something, but is it an NMEA field?
            msg = pynmea2.parse(nmeastring)
            print('GPS position from ID:'+str(rxframe[5]))
            print('latitude:'+str(msg.latitude))
            print('longitude:'+str(msg.longitude))
            sendtraccar(str(rxframe[5]), msg.latitude, msg.longitude)
        except pynmea2.ParseError as e:
            print('Parse error: {}'.format(e))
            print('No usable frame in in'+str(rxframe))
    except IndexError:
        #print('No NMEA field index in'+str(rxframe))
        nmeastring=''

