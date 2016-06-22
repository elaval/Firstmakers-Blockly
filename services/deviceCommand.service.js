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
.service('DeviceCommandService',['$rootScope','$q','$templateRequest', 'd3', '_', '$http', '$timeout', 'SerialService', 'BoardService','VirtualBoardService', function($rootScope, $q, $templateRequest, d3,_, $http, $timeout ,  SerialService, BoardService, VirtualBoardService) {
  var myself = this;
 
  // Public functions
  myself.setVirtualDevice = setVirtualDevice;
  myself.setPhysicalDevice = setPhysicalDevice; 
  myself.light = light;
  myself.buzzer = buzzer;
  myself.potentiometer = potentiometer;
  myself.temperatureSensor = temperatureSensor;
  myself.lightSensor = lightSensor;
  myself.audioSensor = audioSensor;
  myself.humiditySensor = humiditySensor;
  myself.infraredSensor = infraredSensor;
  myself.button = button;
  myself.digitalWrite = digitalWrite;
  myself.digitalRead = digitalRead;
  myself.analogRead = analogRead;
  myself.servo = servo;
  myself.motorConfig = motorConfig;
  myself.motorSpeed = motorSpeed;
  myself.motorDirection = motorDirection;
  myself.analogWrite = analogWrite;

  
  // Local variables
  var physicalDevice = null;
  var virtualDevice = null;
  
  // Implementation of public functions (this.myfunction ...)
  // =========================================================
  
  /**
   * Sets the virtualDevice that will be used while executing code functions
   */
  function setVirtualDevice(_virtualDevice) {
    virtualDevice = _virtualDevice;
  };

  /**
   * Sets the physicalDevice that will be used while executing code functions
   */
  function setPhysicalDevice(_physicalDevice) {
    physicalDevice = _physicalDevice;
  };

  /**
   * Implementations of "external" functions
   */
  
  // digitalWrite
  function digitalWrite(pin,value) {
    if (virtualDevice) {
      virtualDevice.digitalWrite(pin,value);
    }
    
    if (physicalDevice) {
      physicalDevice.digitalWrite(pin,value);
    }
    
  }

  // analogWrite
  function analogWrite(pin,value) {
    if (virtualDevice) {
      virtualDevice.analogWrite(pin,value);
    }
    
    if (physicalDevice) {
      physicalDevice.analogWrite(pin,value);
    } 
  }
  
  // digitalRead
  function digitalRead(pin) {
    var deferred = $q.defer();
    
    if (physicalDevice) {
      physicalDevice.digitalRead(pin)
      .then(function(value) {
        deferred.resolve(value);
      })
      .catch(function(err) {
        deferred.reject(err);
      })
    } else if (virtualDevice) {
      virtualDevice.digitalRead(pin)
      .then(function(value) {
        deferred.resolve(value);
      })
      .catch(function(err) {
        deferred.reject(err);
      })
    } else {
      deferred.reject("No board");
    }
  
    return deferred.promise;
  }
  
  // analogRead
  function analogRead(pin) {
    var deferred = $q.defer();
    
    if (physicalDevice) {
      physicalDevice.analogRead(pin)
      .then(function(value) {
        deferred.resolve(value);
      })
      .catch(function(err) {
        deferred.reject(err);
      })
    } else if (virtualDevice) {
      virtualDevice.analogRead(pin)
      .then(function(value) {
        deferred.resolve(value);
      })
      .catch(function(err) {
        deferred.reject(err);
      })
    } else {
      deferred.reject("No board");
    }
  
    return deferred.promise;
  }
  
  
  
  
        
  function light(state) {
    if (virtualDevice) {
      virtualDevice.light(state);
    }
    
    if (physicalDevice) {
      physicalDevice.light(state);
    }
    
  }

        
  function buzzer(state) {
    if (virtualDevice) {
      virtualDevice.buzzer(state);
    }
    
    if (physicalDevice) {
      physicalDevice.buzzer(state);
    }
    
  }
  
  function temperatureSensor() {
    if (physicalDevice) {
      return physicalDevice.temperatureSensor()
    } else if (virtualDevice) {
      return 0;
    } else {
      deferred.reject("No board");
    }
  }  
  
  function lightSensor() {
    if (physicalDevice) {
      return physicalDevice.lightSensor()
    } else if (virtualDevice) {
      return 0;
    } else {
      deferred.reject("No board");
    }
  }  
    
  function audioSensor() {
    if (physicalDevice) {
      return physicalDevice.audioSensor()
    } else if (virtualDevice) {
      return 0;
    } else {
      deferred.reject("No board");
    }
  }  
  
  function humiditySensor() {
    if (physicalDevice) {
      return physicalDevice.humiditySensor()
    } else if (virtualDevice) {
      return 0;
    } else {
      deferred.reject("No board");
    }
  }
    
  function infraredSensor() {
    if (physicalDevice) {
      return physicalDevice.infraredSensor()
    } else if (virtualDevice) {
      return 0;
    } else {
      deferred.reject("No board");
    }
  }
  
  function potentiometer() {
    var deferred = $q.defer();
    
    if (physicalDevice) {
      physicalDevice.potentiometer()
      .then(function(value) {
        deferred.resolve(value);
      })
      .catch(function(err) {
        deferred.reject(err);
      })
    } else if (virtualDevice) {
      //virtualDevice.buzzer(state);
      deferred.resolve(0);
    } else {
      deferred.reject("No board");
    }
  
    return deferred.promise;
  }
  
  function button() {
    var deferred = $q.defer();
    
    if (physicalDevice) {
      physicalDevice.button()
      .then(function(value) {
        deferred.resolve(value);
      })
      .catch(function(err) {
        deferred.reject(err);
      })
    } else if (virtualDevice) {
      //virtualDevice.buzzer(state);
      deferred.resolve(false);
    } else {
      deferred.reject("No board");
    }
  
    return deferred.promise;
  }

  // servo
  function servo(pin,angle) {
    if (virtualDevice) {
      virtualDevice.servoWrite(pin,angle);
    }
    
    if (physicalDevice) {
      physicalDevice.servoWrite(pin,angle);
    }
    
  }

  // motorConfig
  function motorConfig(id,powerPin,dirPin) {
    if (virtualDevice) {
      virtualDevice.motorConfig(id,powerPin,dirPin);
    }
    
    if (physicalDevice) {
      physicalDevice.motorConfig(id,powerPin,dirPin);
    }
    
  }
  
  // motorSpeed
  function motorSpeed(id,speed) {
    if (virtualDevice) {
      virtualDevice.motorSpeed(id,speed);
    }
    
    if (physicalDevice) {
      physicalDevice.motorSpeed(id,speed);
    }
    
  }

  // motorDirection
  function motorDirection(id,dir) {
    if (virtualDevice) {
      virtualDevice.motorDirection(id,dir);
    }
    
    if (physicalDevice) {
      physicalDevice.motorDirection(id,dir);
    }
    
  }

}])




