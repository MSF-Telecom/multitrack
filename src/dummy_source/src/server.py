import os
import requests
import json
import time
import random

PUBLISH_IP = os.getenv('PUBLISH_IP', '127.0.0.1')
PUBLISH_PORT = os.getenv('PUBLISH_PORT', '8000')
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

def post_data():
    for key in dataSource:
        print(key)
        for position in dataSource[key]["positions"]:
            myobj = {
                "main_ID": key,
                "model": dataSource[key]["model"],
                "serial": dataSource[key]["serial"],
                "status": dataSource[key]["status"],
                "last_updated": dataSource[key]["last_updated"],
                "timestamp": position["timestamp"],
                "latitude": position["latitude"],
                "longitude": position["longitude"],
                "text": dataSource[key]["texts"][random.randint(0, 4)]
            }
            x = requests.post(url, json = myobj)
            print(x.text)
            time.sleep(2)

if __name__ == '__main__':
    while(1):
        post_data()