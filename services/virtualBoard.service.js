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
  
  function digitalWrite(pin, value) {
      pins[pin] = value;  
      $rootScope.$broadcast("virtualFirstmakersChange", pins);
  }

  $rootScope.$broadcast("virtualFirstmakersChange", pins)


}])




