# multitrack

## Overview
Multitrack is an open-source interfacing software that passes commands/messages from radios (via and RS232 interface) to tracking/dispatching sytems. 


## Features
The Proof of Concept is currently able to parse messages from ICOM Radios and send them to Traccar.


## Requirements and setup
- Python 3
- Python libraries: pyserial, pynmea2
- Traccar

Install Traccar on your favorite OS via the installer, set it up (accounts, password, etc). Create a device with the ID of the radio you want to track, and check if your firewall opened the port correctly. 
On the python side, edit the main.py to adjust the port and address of your traccar instance, set up the COM port and speed, and you're off to the races! 


## Roadmap
- Implement GPS messages and send them to Traccar
- Implement message/SDS handling 
