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
  myself.temperature = temperature;
  myself.button = button;
  
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
  
  function temperature() {
    if (physicalDevice) {
      return physicalDevice.temperature()
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

}])




