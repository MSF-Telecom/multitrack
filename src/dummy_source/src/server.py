import os
import requests
import json
import time
import random

PUBLISH_IP = os.getenv('PUBLISH_IP', '127.0.0.1')
PUBLISH_PORT = os.getenv('PUBLISH_PORT', '8081')
LISTEN_PORT = os.getenv('LISTEN_PORT', '80')

print(f"PUBLISH_PORT: {PUBLISH_PORT}")
print(f"LISTEN_PORT: {LISTEN_PORT}")

# Create a HTTP server that Posts data to the PUBLISH_IP:PUBLISH_PORT
# and listens on LISTEN_PORT

url = 'http://'+PUBLISH_IP+':'+PUBLISH_PORT+'/'
myobj = {}

with open("datasource.json", "r") as f:
    raw = f.read()
    # convert raw to json object
    dataSource = json.loads(raw)

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
        "main_ID": "dummy",
        "actions": ["stun", "kill", "revive"],
        "text": True,
        "position": True,
        "status": True
    }
    x = requests.post(url+"subscribe", json = myobj)
    print(x.text)

def post_data():
    for key in dataSource:
        # The posted data should look like this for a new position :
        # {
        #     "type": "device",
        #     "main_ID": <main_ID>,
        #     "model": <model>,
        #     "serial": <serial>,
        #     "last_updated": <last_updated>,
        #     "position": {
        #         "timestamp": <timestamp>,
        #         "latitude": <latitude>,
        #         "longitude": <longitude>
        #     }
        # }
        #
        # And this for a new text message :
        # {
        #     "type": "device",
        #     "main_ID": <main_ID>,
        #     "model": <model>,
        #     "serial": <serial>,
        #     "last_updated": <last_updated>,
        #     "text": <text>
        # }
        #
        # And this for a new status :
        # {
        #     "type": "device",
        #     "main_ID": <main_ID>,
        #     "model": <model>,
        #     "serial": <serial>,
        #     "status": <status>,
        #     "last_updated": <last_updated>
        # }
        print(key)
        for position in dataSource[key]["positions"]:
            myobj = {
                "type": "device",
                "main_ID": key,
                "model": dataSource[key]["model"],
                "serial": dataSource[key]["serial"],
                "last_updated": int(time.time()),
                "position": {
                    "timestamp": int(time.time()),
                    "latitude": position["latitude"],
                    "longitude": position["longitude"]
                }
            }
            x = requests.post(url+"data", json = myobj)
            print(x.text)
            time.sleep(2)
        for text in dataSource[key]["texts"]:
            myobj = {
                "type": "device",
                "main_ID": key,
                "model": dataSource[key]["model"],
                "serial": dataSource[key]["serial"],
                "last_updated": int(time.time()),
                "text": text
            }
            x = requests.post(url+"data", json = myobj)
            print(x.text)
            time.sleep(2)
        for status in dataSource[key]["statuses"]:
            myobj = {
                "type": "device",
                "main_ID": key,
                "model": dataSource[key]["model"],
                "serial": dataSource[key]["serial"],
                "status": status,
                "last_updated": int(time.time())
            }
            x = requests.post(url+"data", json = myobj)
            print(x.text)
            time.sleep(2)

if __name__ == '__main__':
    post_identify_plugin()
    while(1):
        post_data()