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
.service('DeviceService',['$rootScope','$q','$templateRequest', 'd3', '_', '$http', '$timeout', 'SerialService', function($rootScope, $q, $templateRequest, d3,_, $http, $timeout ,  SerialService) {
  var myself = this;
  
  this.createDevice = createDevice;
  
  var valueConverter = {
    potentiometer : function(rawValue) {
      var value = Math.floor(100*rawValue/1023);
      
      return value; 
    },
    
    temperature : function(rawValue) {
      
      var millivolts = rawValue*5000.0/1023.0,
          celsius = millivolts/29;

      // return rouded to 1 decimal
      return Math.round(10*celsius)/10;
      
    }
  }
  
  function createDevice(_board) {
    var board = _board;
    var device = {}
    var sensorValues = {
      'potentiometer': 0,
      'temperature' : 0,
      'light': 0,
      'audio': 0,
      'humidity': 0,
      'infrared': 0      
    }
    
    device.sensorValues = function() {
      return sensorValues;
    }
    
    device.activatePinMonitor = function() {
      var myself = this;
      
      if (board && board.pins) {
        board.analogRead(0, function(value) {
            board.pins[board.analogPins[0]].value = value;
            sensorValues.temperature = valueConverter.temperature(value);

        })   
        board.analogRead(1, function(value) {
            board.pins[board.analogPins[1]].value = value;
        })          
        board.analogRead(2, function(value) {
            board.pins[board.analogPins[2]].value = value;
        })          
        board.analogRead(3, function(value) {
            board.pins[board.analogPins[3]].value = value;
        })          
        board.analogRead(4, function(value) {
            board.pins[board.analogPins[4]].value = value;
        }) 
        board.analogRead(5, function(value) {
            board.pins[board.analogPins[5]].value = value;
            sensorValues.potentiometer = valueConverter.potentiometer(value);
        })    
        
        board.pinMode(2, board.MODES.INPUT);
        /*
        board.digitalRead(2, function(value) {
          $log.debug(value);
        })
        */
 
      }


    }

    
    device.digitalWrite = function(pin,value) {
        board.digitalWrite(pin, value ? board.HIGH : board.LOW);
    }
    
    device.light = function(on) {
        board.digitalWrite(13, on ? board.HIGH : board.LOW);
    }
      
    device.buzzer = function(on) {
        board.digitalWrite(6, on ? board.HIGH : board.LOW);
    }
    
    device.potentiometer = function() {
      var deferred = $q.defer(); 
      deferred.resolve(valueConverter.potentiometer(board.pins[19].value));

      return deferred.promise;
    }
    
    device.temperature = function() {
      return sensorValues.temperature;
    }
    
    device.button = function() {
      var deferred = $q.defer(); 
      
      board.digitalRead(2, function(value) {
        deferred.resolve(value == board.HIGH);
      })
      
      return deferred.promise;
    }
    
      
    return device;
  }
  

  
}])




