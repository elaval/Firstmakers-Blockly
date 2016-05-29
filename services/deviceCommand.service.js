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


}])




