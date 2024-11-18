import serial
import requests
import pynmea2
import lib.PyCCMDV2.PyCCMDV2 as PyCCMDV2

comPort = 'COM64'
comSpeed = 19200

serverUrl = 'http://serverurl'
serverPort = '5055'




radioSerial = serial.Serial(comPort, comSpeed, timeout = 2)






def sendtraccar(radioid, lat, lon): #Sends a POST request to the server with the ID and the coordinates
    try:
        requests.post(serverUrl+':'+serverPort, data = {'id' : radioid, 'lat': lat, 'lon': lon})
        print('Coordinates sent to server')
    except requests.exceptions.Timeout:
        print('Socket error: timeout')
    except requests.exceptions.TooManyRedirects:
        print('Socket error: Too Many Redirects')
    except requests.exceptions.RequestException as e:
        print('Socket error: general failure')
