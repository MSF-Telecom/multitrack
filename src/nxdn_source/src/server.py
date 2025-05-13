import os
import requests
import json
import time
import random
import threading
import PyCCMDV2.PyCCMDV2 as pyccmd
import serial
import pynmea2

PUBLISH_IP = os.getenv('PUBLISH_IP', '127.0.0.1')
PUBLISH_PORT = os.getenv('PUBLISH_PORT', '8081')
LISTEN_PORT = os.getenv('LISTEN_PORT', '80')

print(f"PUBLISH_PORT: {PUBLISH_PORT}")
print(f"LISTEN_PORT: {LISTEN_PORT}")

# Create a HTTP server that Posts data to the PUBLISH_IP:PUBLISH_PORT
# and listens on LISTEN_PORT

url = 'http://'+PUBLISH_IP+':'+PUBLISH_PORT+'/'
myobj = {}


radioSerial = serial.Serial('/dev/tty.PL2303-USBtoUART21130', 9600, timeout = 2)

ownID = 65501
talkgroupID = 1
otherID = 1634
msg = 'Hello World'
radio = pyccmd.Transceiver(radioSerial, ownID, verbose=True, mode = False)
txFlag = False
rxFlag = False

print(radio.getChannel())
print(radio.getESN())
print(radio.getVolume())
print(radio.getCloneComment(linenr=1))
print(radio.getCloneComment(linenr=2))
print(radio.getFreq())
radio.setRadioID(ownID,talkgroupID)
print(radio.getRadioID())
radio.setUItext(msg)


def post_identify_plugin():
    # The posted data should look like this :
    # {
    #     "type": "identify_plugin",
    #     "main_ID": <main_ID>,
    #     "actions": [<actions>],
    #     "text": <true/false>,
    #     "position": <true/false>,
    #     "status": <true/false>
    # }
    myobj = {
        "type": "identify_plugin",
        "main_ID": "nxdn_source",
        "actions": ["stun", "kill", "revive", "get position"],
        "text": True,
        "position": True,
        "status": True,
        "listen_port": LISTEN_PORT
    }
    x = requests.post(url+"subscribe", json = myobj)
    print(x.text)
    time.sleep(2)

    myobj = {
        "type": "device",
        "main_ID": "nxdn_source",
        "model": "portable",
        "serial": "376602001634",
        "last_updated": int(time.time()),
        "position": {
            "timestamp": int(time.time()),
            "latitude": 50,
            "longitude": 5
        }
    }

    x = requests.post(url+"data", json = myobj)
    print(x.text)

def post_data():
    #print(radio.sendStatus(24, otherID=otherID, verbose=True))
    r= radio.receiveMessage(timeout = 2, verbose=True)
    if r.messageType=='GPS':        
        print('[RADIO] Got a position frame from:', r.senderID)
        print(r.messageContents)
        rawPosition = r.messageContents #"$GNRMC,071146.00,A,5050.0254,N,00421.8703,E,0.0,90.0,130525,,,A*74"
        nmeaData = pynmea2.parse(rawPosition)
        print("NMEA : ", nmeaData.latitude, nmeaData.longitude)

        myobj = {
                "type": "device",
                "main_ID": "nxdn_source",
                "model": "portable",
                "serial": "376602001634",
                "last_updated": int(time.time()),
                "position": {
                    "timestamp": int(time.time()),
                    "latitude": nmeaData.latitude,
                    "longitude": nmeaData.longitude
                }
            }
        x = requests.post(url+"data", json = myobj)
        print(x.text)
    elif r.messageType=='CH':
        print('[RADIO] Channel changed! Resetting sender ID')
        radio.setRadioID(ownID,talkgroupID)


# create flask server that listens on LISTEN_PORT
from flask import Flask, request
app = Flask(__name__)

@app.route('/', methods=['POST'])
def data():
    # print the data received
    print(request.json)
    return 'OK', 200

@app.route('/text', methods=['POST'])
def text():
    # print the data received
    print(request.json)
    return 'OK', 200

@app.route('/action', methods=['POST'])
def action():
    # print the data received
    print(request.json)

    main_ID = request.json["main_ID"]
    serial = request.json["serial"]
    action = request.json["action"]

    if main_ID == "dummy_source":
        if action == "stun":
            print(f"Stunning {serial}")
        elif action == "kill":
            print(f"Killing {serial}")
        elif action == "revive":
            print(f"Reviving {serial}")
        else:
            print(f"Unknown action {action} for {serial}")

    return 'OK', 200

@app.route('/', methods=['GET'])
def main():
    # print the data received
    print(request.json)
    return 'OK', 200


def create_flask_app():
    app.run(host='0.0.0.0', port=LISTEN_PORT)

def send_data():
    #post_identify_plugin()
    post_data()


if __name__ == '__main__':
    # start flask app in background thread
    threading.Thread(target=create_flask_app).start()

    # keep the main thread alive
    while True:
        #time.sleep(1)
        send_data()