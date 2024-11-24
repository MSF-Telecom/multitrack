import serial
import requests
import pynmea2
import lib.PyCCMDV2.PyCCMDV2 as pyccmd
import configparser
import sys



verboseGlobal = True
verboseIface = False


def serialInit():
    global radioSerial, radio
    try:
        radioSerial = serial.Serial(comPort, comSpeed, timeout = 2)
        radio = pyccmd.Transceiver(radioSerial, ownID, verbose=verboseIface, mode = False)
        return 
    except serial.SerialException as e:
        print('[RADIO] Connection to radio failed. Error contents: ', repr(e))
        print('Check your serial port number, disconnect/reconnect the adapter and retry')
        input('Press any key to exit')
        sys.exit()
    


def readConfig():
    configFile = 'config.ini'
    config = configparser.ConfigParser()
    config.read(configFile)

    global comPort, comSpeed, ownID, talkgroupID
    comPort = config['RADIO']['port']
    comSpeed = int(config['RADIO']['speed'])
    ownID = int(config['RADIO']['ownID'])
    talkgroupID = int(config['RADIO']['talkgroupID'])

    global serverUrl, serverPort
    serverUrl = config['TRACCAR']['serverURL']
    serverPort = config['TRACCAR']['serverPort']
    
    

def radioHandler():
    messageBuffer = radio.receiveMessage(verbose=verboseIface)
    if messageBuffer.messageType=='GPS':        
        if verboseGlobal : print('[RADIO] Got a position frame from:', messageBuffer.senderID)
        #We return the message's contents and the ID of radio
        return (messageBuffer.messageContents, int(messageBuffer.senderID))

    #This is necessairy to make sure the radio always has the correct ID for reception, otherwise it'll just ignore the GPS positions...
    elif messageBuffer.messageType=='CH':
        if verboseGlobal : print('[RADIO] Channel changed! Resetting sender ID')
        radio.setRadioID(ownID,talkgroupID)
    return False


def radioInit():
    if verboseGlobal: print('[RADIO] Connecting to transceiver...')
    radioESN = radio.getESN()
    if radioESN == 'TIMEOUT_ERROR' or radioESN == 'CMD_UNICODE_ERROR':
        print('[RADIO] Error: ', radioESN)
        return radioESN
    if verboseGlobal: print('[RADIO] Connected! Serial number is:', str(radioESN))
    radio.setRadioID(ownID,talkgroupID)
    return radioESN
    


def sendTraccar(radioID, lat, lon): #Sends a POST request to the server with the ID and the coordinates
    if nmeaData.latitude == 0.0000 or nmeaData.longitude == 0.0000:
        print('[TRACCAR] Default (non-acquired) coordinates received, not sending to server')
        return
    try:
        requests.post(serverUrl+':'+serverPort, data = {'id' : radioID, 'lat': lat, 'lon': lon})
        print('[TRACCAR] Coordinates sent to server')
    except requests.exceptions.Timeout:
        print('[TRACCAR] Socket error: timeout')
    except requests.exceptions.TooManyRedirects:
        print('[TRACCAR] Socket error: Too Many Redirects')
    except requests.exceptions.RequestException as e:
        print('[TRACCAR] Socket error: general failure')


if __name__ == "__main__":
    readConfig()
    serialInit()
    radioInit()
    try:
        while True:
            rawPosition = radioHandler()
            if rawPosition:
                nmeaData = pynmea2.parse(rawPosition[0])
                sendTraccar(rawPosition[1], nmeaData.latitude, nmeaData.longitude)
    except KeyboardInterrupt:
        radioSerial.close()
        print('Program terminated by user')
        input('Press any key to exit')
    except serial.SerialException as e:
        print('[RADIO] Connection to radio failed. Error contents: ', repr(e))
        print('Check your serial port number, disconnect/reconnect the adapter and retry')
        input('Press any key to exit')
            
