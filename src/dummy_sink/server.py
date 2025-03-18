# Listen to port 8000 for POST requests
from flask import Flask, request

app = Flask(__name__)

@app.route('/', methods=['POST'])
def result():
    print(request.data)  # raw data
    print(request.json)  # json (if content-type of application/json is sent with the request)
    print(request.get_json(force=True))  # json (if content-type of application/json is not sent)
    return 'OK'

if __name__ == '__main__':
    app.run(port=8000, host='127.0.0.1')
