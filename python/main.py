import serial
import requests
import pynmea2
import lib.PyCCMDV2.PyCCMDV2 as pyccmd

comPort = 'COM64'
comSpeed = 19200

serverUrl = 'http://localhost'
serverPort = '5055'

ownID = 65519
talkgroupID = 9900

verboseGlobal = True
verboseIface = False


radioSerial = serial.Serial(comPort, comSpeed, timeout = 2)
radio = pyccmd.Transceiver(radioSerial, ownID, verbose=verboseIface, mode = False)


def radioHandler():
    messageBuffer = radio.receiveMessage(verbose=verboseIface)
    if not messageBuffer[2]=='TIMEOUT_ERROR' and messageBuffer[3]:
        if verboseGlobal : print('[RADIO] Got a position frame from:', messageBuffer[1])
        return (messageBuffer[2], int(messageBuffer[1]))
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
    radioInit()
    while True:
        rawPosition = radioHandler()
        if rawPosition:
            nmeaData = pynmea2.parse(rawPosition[0])
            sendTraccar(rawPosition[1], nmeaData.latitude, nmeaData.longitude)
            
