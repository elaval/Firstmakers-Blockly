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
    },
        
    infrared : function(rawValue) {
      var value = rawValue < 800;

      return value
    },
      
    battery :function(rawValue){
        var value = (12400*5*rawValue)/(1024*10000);
        return Math.round(10*value)/10;
    }  
  }
  
  function createDevice(_board) {
    var board = _board;
    //console.log(board.analogPins.length);
    var device = {};
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
    };
    var motors = {};
    
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
            sensorValues.infrared = valueConverter.infrared(value);

        }) 
        board.analogRead(5, function(value) {
            board.pins[board.analogPins[5]].value = value;
            sensorValues.potentiometer = valueConverter.potentiometer(value);
        })
        if(board.analogPins.length > 6){
            board.analogRead(6, function(value) {
                board.pins[board.analogPins[6]].value = value;
                sensorValues.battery = valueConverter.battery(value);
            }); 
        }

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
       // $timeout(20)
        //.then(function() {
            var d = new Date();
            console.log('digital write '+ pin +' '+ value+' '+   d.getTime());
            board.pinMode(pin, board.MODES.OUTPUT);
            board.digitalWrite(pin, value ? board.HIGH : board.LOW);
        //});
        //board.pinMode(pin, board.MODES.OUTPUT);
        //board.digitalWrite(pin, value ? board.HIGH : board.LOW);
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

    device.analogWrite = function(pin,value) {
      // Make sure value is between 0 and 100
      value = value > 100 ? 100 : value;
      value = value < 0 ? 0 : value;

      // Transform into a value betwen 0 and 255
      var transformedValue = Math.floor(255*value/100);

      board.pinMode(pin, board.MODES.PWM);
      board.analogWrite(pin,transformedValue)
    }

    device.servoWrite = function(pin,angle) {
        board.pinMode(pin, board.MODES.SERVO);
        board.servoWrite(pin, angle);
    }

    device.motorConfig = function(id,powerPin,dirPin) {
      if (!motors[id]) {
        motors[id] = {};
      }
      motors[id].powerPin = powerPin;
      motors[id].dirPin = dirPin;
    }

    device.motorSpeed = function(id,speed) {
      var powerPin = 3;  // Default value
      if (motors[id] && motors[id].powerPin) {
        powerPin = motors[id].powerPin;
      }

      // Speed is expected to be a number between 0 and 100
      // Need to convert it to integer between 0 and 255

      speed = speed > 100 ? 100 : speed;
      speed = speed < 0 ? 0 : speed;

      var value = Math.floor(255*speed/100);

      board.pinMode(powerPin, board.MODES.PWM);
      board.analogWrite(powerPin,value)

    }

    device.motorDirection = function(id,dir) {
      var dirPin = 8;  // Default value
      if (motors[id] && motors[id].dirPin) {
        dirPin = motors[id].dirPin;
      }

      // dir is expected to be 0 or 1
      var value = dir !== 0 ? board.HIGH : board.LOW

      board.pinMode(dirPin, board.MODES.OUTPUT);
      board.digitalWrite(dirPin,value)

    }


    device.light = function(on) {
        board.pinMode(13, board.MODES.OUTPUT);
        board.digitalWrite(13, on ? board.HIGH : board.LOW);
    }
      
    device.buzzer = function(on) {
        board.pinMode(6, board.MODES.OUTPUT);
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
      
    device.infraredSensor = function() {
      return sensorValues.infrared;
    }
    
    device.button = function() {
      var deferred = $q.defer(); 
      
      board.digitalRead(2, function(value) {
        deferred.resolve(value == board.HIGH);
      })
      return deferred.promise;
    }
    
    device.batteryLevel = function(){
      return sensorValues.battery;
    }
    
    return device;
  }
  

  
}])




