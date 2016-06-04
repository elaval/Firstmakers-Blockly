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
      
    },
    
    light : function(rawValue) {
      var value = Math.floor(100*rawValue/1023);

      return value
    }, 
        
    audio : function(rawValue) {
      var value = Math.floor(100*rawValue/1023);

      return value
    }, 
    
    humidity : function(rawValue) {
      var value = Math.floor(100*rawValue/1023);

      return value
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
      'infrared': 0,
      'button':false,
      'pins' : board.pins,
      'analogPins' : board.analogPins      
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
            sensorValues.light = valueConverter.light(value);
        })          
        board.analogRead(2, function(value) {
            board.pins[board.analogPins[2]].value = value;
            sensorValues.audio = valueConverter.audio(value);

        })          
        board.analogRead(3, function(value) {
            board.pins[board.analogPins[3]].value = value;
            sensorValues.humidity = valueConverter.humidity(value);
        })          
        board.analogRead(4, function(value) {
            board.pins[board.analogPins[4]].value = value;
        }) 
        board.analogRead(5, function(value) {
            board.pins[board.analogPins[5]].value = value;
            sensorValues.potentiometer = valueConverter.potentiometer(value);
        })    
        
        board.pinMode(2, board.MODES.INPUT);     
        board.digitalRead(2, function(value) {
            sensorValues.button = value === board.HIGH; 
        })
 
        board.pinMode(3, board.MODES.INPUT);     
        board.digitalRead(3, function(value) {
            sensorValues.pins[3].value = value; 
        })
        
        board.pinMode(4, board.MODES.INPUT);     
        board.digitalRead(4, function(value) {
            sensorValues.pins[4].value = value; 
        })
        
        board.pinMode(5, board.MODES.INPUT);     
        board.digitalRead(5, function(value) {
            sensorValues.pins[5].value = value; 
        })
        
        board.pinMode(6, board.MODES.INPUT);     
        board.digitalRead(6, function(value) {
            sensorValues.pins[6].value = value; 
        })
        
        board.pinMode(7, board.MODES.INPUT);     
        board.digitalRead(7, function(value) {
            sensorValues.pins[7].value = value; 
        })
        
        board.pinMode(8, board.MODES.INPUT);     
        board.digitalRead(8, function(value) {
            sensorValues.pins[8].value = value; 
        })
        
        board.pinMode(9, board.MODES.INPUT);     
        board.digitalRead(9, function(value) {
            sensorValues.pins[9].value = value; 
        })        
        
        board.pinMode(10, board.MODES.INPUT);     
        board.digitalRead(10, function(value) {
            sensorValues.pins[10].value = value; 
        })  
              
        board.pinMode(11, board.MODES.INPUT);     
        board.digitalRead(11, function(value) {
            sensorValues.pins[11].value = value; 
        })  
              
        board.pinMode(12, board.MODES.INPUT);     
        board.digitalRead(12, function(value) {
            sensorValues.pins[12].value = value; 
        })        

        board.pinMode(13, board.MODES.INPUT);     
        board.digitalRead(13, function(value) {
            sensorValues.pins[13].value = value; 
        })
 
      }


    }

    
    device.digitalWrite = function(pin,value) {
        board.pinMode(pin, board.MODES.OUTPUT);
        board.digitalWrite(pin, value ? board.HIGH : board.LOW);
    }
    
    device.digitalRead = function(pin) {
      var deferred = $q.defer(); 
      
      //board.pinMode(pin, board.MODES.INPUT);
      deferred.resolve(board.pins[pin].value == board.HIGH);

      return deferred.promise;
    }    
    
    device.analogRead = function(pin) {
      return $q(function(resolve, reject) {
        var analogPin = board.analogPins[pin];
        resolve(board.pins[analogPin].value);
      });
    }
    
    device.light = function(on) {
        board.pinMode(13, board.MODES.OUTPUT);
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
    
    device.temperatureSensor = function() {
      return sensorValues.temperature;
    }
       
    device.lightSensor = function() {
      return sensorValues.light;
    }  
           
    device.audioSensor = function() {
      return sensorValues.audio;
    }      
     
    device.humiditySensor = function() {
      return sensorValues.humidity;
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




