# Firstmakers-Blockly
First makers is an initiative aimed at making easy the adventure of programming our physical environment and allowing ordinary people to build the Internet of things.

First makers includes hardware (e.g. a shield that can be placed on top of Arduino boards with built-in sensors and plugs to connect external sensors/actuators), software (Block based software to program electronic boards) and cloud services (save and share your data).

This repository contains the base code for Firstmakers "Blockly version", based on Google's blockly software (https://developers.google.com/blockly/).

![screenshot](images/screenshot.png)


Software overview
-------
Firstmakers-blockly is an html/javascript application that runs embedded in a Desktop app using nwjs (formerly node-webkit).  It combines the power of traditional javascript libraries (such as blockly) with nodejs modules (which allow communication through usb/serial ports).

We have added some additional blocks to the standard Blocly blocks (particularly in the Firstmakers category) which allows the user to visually create a program that interacts wih Arduino boards and the Firstmakers shield.  For example the user can turn on the while light, read the values of the temperature sensor or write into a digital pin.
[TO DO: ADD IMAGES].

The interface provides an onscreen version of a Firstmakers shield which allows to try some code without a physical board connected to the computer.
[TO DO: ADD IMAGE].
If a physical board is connected to a USB port, the board will be automatically recognised and connected. The software uses teh firmata protocol to send commands to the board over the seriual port (and the board needs to have the firmata skecth already loaded to recognise commands).

For additional information on the software architecture, instructions to add/modify blocks and technical background, please go to our technical documentation.



Relocate in the Wiki:
The code is structured using AngularJS 1.5 and has the following main dependencies:

  - AngularJS (Javascript framework)
  - Blockly (Javascript library)
  - Bootstrap (js/css library)
  - UnderscoreJS (Javascript library)
  - Angular-Translate (Javascript library to manage multi language)
  - Firmata (nodejs module)
  - Serialport (nodejs module)
  


  


 
