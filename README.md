# Multitrack

## Overview

Multitrack is an open-source software that passes commands/messages from radios (via and RS232 interface) to tracking/dispatching sytems.

## Features

This initial version is able to connect to an ICOM radio (IDAS/NXDN or dPMR), parse the GPS positions received and send them to a web interface. Text messaging, positions requests, and Stun/Revive commands are also supported.

## User setup

### Requirements

- Docker & Docker-Compose

### Getting Multitrack Core running

A Docker-Compose file with Multitrack core, a dummy source, and an NXDN source is available in the src folder.

### Getting the maptiles server running

A Docker container is available in the src folder (maptiles_server). There is a docker-compose file to run it.  
You'll also need to poiint to a folder where a `map.pmtiles` file is available.

### Getting the sources running

The instructions for each plugin is available in their respective folders/repos.

## Troubleshooting

Most common errors are either a wrong COM port, bad radio configuration or absent traccar entry for the radio you wish to track. Most of them can be narrowed down by looking in the logfiles.

### Multitrack Core and Sources

No logfiles are implemented yet. However, the console's output will help in narrowing down the reason.

## Dev notes

This initial version has been developed on macOS with docker, and a demo server on an ubuntu VM on, proxmox, as well as docker on a Raspberry Pi CM4.

Tools used:

- Python 3.10-12 with pip
- git
- Python libraries: pyserial, pynmea2, configparser
- NodeJS/NPM
- ExpressJS
- Docker & Docker-Compose

Some makefiles are available to help with the setup and testing of individual container builds.

## Roadmap

- Implement an easy-to-use GUI
- Implement message/SDS handling
- Implement automatic map GUI updates with new messages

## Acknowledgements

Made with ❤️, lots of ☕️, and lack of 🛌  
Published under GNU GPLv3 license.

[![License: GPL v3](https://www.gnu.org/graphics/gplv3-127x51.png)](https://www.gnu.org/licenses/gpl-3.0.en.html)  
[GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html)
