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
  
  this.createDevice = createDevice
  
  function createDevice(_board) {
    var board = _board;
    var device = {}

    device.light = function(on) {
        board.digitalWrite(13, on ? board.HIGH : board.LOW);
    }
      
    device.buzzer = function(on) {
        board.digitalWrite(6, on ? board.HIGH : board.LOW);
    }
    
    device.potentiometer = function() {
      var deferred = $q.defer();
      
      board.analogRead(5, function(value) {
        deferred.resolve(value);
      })
      return deferred.promise;
    }
    
      
    return device;
  }
  
}])




