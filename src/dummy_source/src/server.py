import os
import requests

PUBLISH_IP = os.getenv('PUBLISH_IP', '127.0.0.1')
PUBLISH_PORT = os.getenv('PUBLISH_PORT', '8000')
LISTEN_PORT = os.getenv('LISTEN_PORT', '80')

print(f"PUBLISH_PORT: {PUBLISH_PORT}")
print(f"LISTEN_PORT: {LISTEN_PORT}")

# Create a HTTP server that Posts data to the PUBLISH_IP:PUBLISH_PORT
# and listens on LISTEN_PORT


url = 'http://'+PUBLISH_IP+':'+PUBLISH_PORT+'/'
myobj = {'somekey': 'somevalue'}

x = requests.post(url, json = myobj)

print(x.text)

exit()