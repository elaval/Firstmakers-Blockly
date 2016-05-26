'use strict';
/* jshint undef: true, unused: true */
/* global angular */

/**
 * @ngdoc service
 * @description
 * 
 * Manages detection of available serialports
 *
 */
angular.module('tideApp')
.service('SerialService',[ '$rootScope','$q', 'd3', '_', '$http',function( $rootScope, $q, d3,_, $http) {
  var myself = this;

  var rport = /usb|acm|^com/i;
    
var Serial = {
  locked: {}, // Marks ports that should not be displayed as available
  descriptor: {}, // Stores port descriptor
  
  lock: function(port) {
    this.locked[port] = true;
  },
  
  unlock: function(port) {
    this.locked[port] = false;
  },
  
  detect: function(callback) {

    var serialport;

    if (parseFloat(process.versions.nw) >= 0.13) {
      serialport = require("browser-serialport");
    } else {
      serialport = require("serialport");
    }

    // Request a list of available ports, from
    // the result set, filter for valid paths
    // via known path pattern match.
    serialport.list(function(err, result) {

      // serialport.list() will never result in an error.
      // On failure, an empty array is returned. (#768)
      var ports = result.filter(function(val) {
        var available = true;

        // Match only ports that Arduino cares about
        // ttyUSB#, cu.usbmodem#, COM#
        if (!rport.test(val.comName)) {
          available = false;
        }

        // Don't allow already used/encountered usb device paths
        if (Serial.locked[val.comName]) {
          available = false;
        }

        return available;
      })
      .map(function(val) {
        return val.comName;
      });
      

      // If no ports are detected...
      if (!ports.length) {

        // Retry Serial connection
        Serial.detect.call(this, callback);
        return;
      }

      // Get the list of detected ports

      callback.call(this, ports);
    }.bind(this));
  },

};


  this.Serial = Serial;

}])




