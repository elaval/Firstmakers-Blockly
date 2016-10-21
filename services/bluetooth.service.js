'use strict';
/* jshint undef: true, unused: true */
/* global angular */

/**
 * @ngdoc service
 * @description
 * 
 * Manages detection of available bluetooth
 *
 */
angular.module('tideApp')
.service('BluetoothService',[ '$rootScope','$q', 'd3', '_', '$http','$timeout', function( $rootScope, $q, d3,_, $http, $timeout) {
	

	var Bluetooth = {
        myself : this,
        socket : '',
        connected : false,
        
		list : function(callback){
			chrome.bluetooth.getDevices(function(devices){
				var compatibleDevices =  _.filter(devices, function(d){
					return d.name.startsWith("FIRSTMAKERS"); 
				});
				callback(compatibleDevices);
			});
		},
        
        connect : function(device, callback){
            chrome.bluetoothSocket.create(function(createInfo) {
                chrome.bluetoothSocket.connect(createInfo.socketId,
                    device.address, device.uuids[0], function(socket){
                        callback(socket);
                });
            });
            

        },
        
        write: function(socketId, arrayBuffer){
            chrome.bluetoothSocket.send(socketId, arrayBuffer, function(bytes_sent) {
              if (chrome.runtime.lastError) {
                console.log("Send failed: " + chrome.runtime.lastError.message);
              } else {
                console.log("Sent " + bytes_sent + " bytes")
              }
            });
        },
        
        disconnect: function(socketId){

            chrome.bluetoothSocket.disconnect(socketId);
        },
        
	}
	this.Bluetooth = Bluetooth;

}]);