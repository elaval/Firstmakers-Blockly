'use strict';
/* jshint undef: true, unused: true */
/* global angular */

/**
 * @ngdoc service
 * @name simceApp.MyDataService
 * @requires $q
 * @requires d3
 * @requires _
 * @requires $http
 *
 * @description
 * Demo
 *
 */
angular.module('tideApp')
.service('VirtualBoardService',['$rootScope','$q','$templateRequest', 'd3', '_', '$http', '$timeout', function($rootScope, $q, $templateRequest, d3,_, $http, $timeout) {
  var myself = this;
  
  var pins = {};
  
  myself.digitalWrite = digitalWrite
  myself.digitalRead = digitalRead
  
  function digitalWrite(pin, value) {
      pins[pin] = value;  
      $rootScope.$broadcast("virtualFirstmakersChange", pins);
  }
  
  function digitalRead(pin, callback) {
      callback(pins[pin]);  
  }

  $rootScope.$broadcast("virtualFirstmakersChange", pins)

  this.createVirtualBoard = function() {
    
    var board = {};
    board.pins = [];
    board.analogPins = [];
    board.HIGH = 1;
    board.LOW = 0;
    board.MODES = {
      INPUT: 0x00,
      OUTPUT: 0x01,
      ANALOG: 0x02,
      PWM: 0x03,
      SERVO: 0x04,
      SHIFT: 0x05,
      I2C: 0x06,
      ONEWIRE: 0x07,
      STEPPER: 0x08,
      SERIAL: 0x0A,
      IGNORE: 0x7F,
      UNKOWN: 0x10
    }
    
    var constructor = function() {
      // populate pin objects
      for (var pin = 0; pin < 20; pin++) {
        board.pins[pin] = {
            mode: null, // Current mode of pin which is on the the board.MODES. 
            value: 0, // Current value of the pin. when pin is digital and set to output it will be Board.HIGH or Board.LOW. If the pin is an analog pin it will be an numeric value between 0 and 1023. 
            supportedModes: [ ], // Array of modes from board.MODES that are supported on this pin. 
            analogChannel: 127, // Will be 127 for digital pins and the pin number for analog pins. 
            state: 0 // For output pins this is the value of the pin on the board, for digital input it's the status of the pullup resistor (1 = pullup enabled, 0 = pullup disabled) 
        }
      }
      
      // Map analogPins (0 to 5) -> (14 to 19)
      for (var apin = 0; apin < 6; apin++) {
        board.analogPins[apin] = 14 + apin;
        
        // Set abalogChannel
        board.pins[board.analogPins[apin]].analogChannel = apin;
      }
 
    }
    
    constructor();
    
    
    // Set a mode for a pin. pin is the number of the pin and the mode is one of the Board.MODES values.
    board.pinMode = function(pin,mode) {
      board.pins[pin].mode = mode;
    }

    // Write an output to a digital pin. pin is the number of the pin and the value is either board.HGH or board.LOW.
    board.digitalWrite = function(pin,value) {
      board.pins[pin].value = value;
    }

    // Read a digital value from the pin. Evertime there is data for the pin the callback will be fired with a value argument.
    board.digitalRead = function(pin,callback) {
      callback(board.pins[pin].value);
    }
    
    // Write an output to an analog pin. pin is the number of the pin and the value is between 0 and 255.
    board.analogWrite = function(pin,value) {
      board.pins[board.analogPins[pin]].value = value;
    }

    // Read an input for an analog pin. Every time there is data on the pin the callback will be fired with a value argument.
    board.analogRead = function(pin,callback) {
      callback(board.pins[board.analogPins[pin]].value);
    }

    return board;
    
  }

}])




