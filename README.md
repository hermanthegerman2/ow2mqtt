# OW2MQTT Gateway

This is a simple gateway to translate an OWFS directory structure to MQTT.

The gateway is based on node.js and uses web access to configure devices.

The module ow2mqtt.js is the gateway program
The module ow2mqtt-web is the webserver for configuration of deviceses and topics


## Requirements

- OWFS installed (owserver & owhttpd) - check that the owfs data directory (on Raspberry Pi: '/mnt/1wire') exists and show data from the connected owfs devices.
- Node.js installed
- forever installed (run: 'npm install -g forever')

## Installation

- Copy the folder server to root ('/server')
- Copy the folder etc to root ('/etc')
- give execute rights (755) to '/etc/init.d/ow2mqtt'
- give execute rights (755) to '/etc/init.d/ow2mqtt-web'
- register for auto start on boot: 'update-rc-d owfs2mqtt defaults'
- register for auto start on boot: 'update-rc-d owfs2mqtt defaults'
- reboot

## Configuration

to be completed		
