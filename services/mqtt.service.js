'use strict';
/* jshint undef: true, unused: true */
/* global angular */

/**
 * @ngdoc service
 * @description
 * Demo
 *
 */
angular.module('tideApp')
.service('mqttService',['$rootScope','$q', 'd3', '_', '$http', '$timeout','authService','$log', function($rootScope, $q, d3,_, $http, $timeout, authService, $log) {
  var myself = this;  

  myself.connectMqttClient = connectMqttClient;
  myself.notifySignin = notifySignin;
  myself.publishPinValues = publishPinValues;

  var mqttUrl = "ws://api.firstmakers.com:3000";
  var mqttClient = null;
  var oldPinValues = {};
  var connecting = false;



  // Initiates an mqttconnection to a Firstmakers MQTT Server
  // Athentication is done with usermane = "jwt" and password a valid accesstoken for the user
  function connectMqttClient() {
    var deferred = $q.defer();

    authService.getAccessToken()
    .then(function(token) {
        mqttClient = mqtt.connect(mqttUrl, {username:"jwt", password:token});

        mqttClient.on('close', function(evt,err) {
          $rootScope.$broadcast("mqtt.close")
          $log.debug("closed mqtt connection");
        } )  ;      
        
        mqttClient.on('error', function(err) {
          $rootScope.$broadcast("mqtt.error")
          $log.error("mqtt error", err.message);
        })
        
        mqttClient.on('connect', function () {
          deferred.resolve(mqttClient);
        }); 
    })
    .catch(function(err) {
      deferred.reject(err);
    })

    return deferred.promise;
  }


  // Promise to existing mqttClient
  // If not connected, attempts a new connection
  function getMqttClient() {
    var deferred = $q.defer();

    if (mqttClient && mqttClient.connected) {
      deferred.resolve(mqttClient)
    } else if (!connecting) {
      connecting = true;
      connectMqttClient()
      .then(function(mqttClient) {
        connecting = false;
        deferred.resolve(mqttClient);
      })
      .catch(function(err) {
        connecting = false;
        deferred.reject(err);
      })
    }

    return deferred.promise;
  }


  /**
   * publishes to mqtt service a notification in username/presence/connected topic
   * with the connection time
   */
  function notifySignin() {
    getMqttClient()
    .then(function(mqttClient) {
      var username = authService.getUsername();
      mqttClient.publish(username+'/presence/signin', (new Date()).toString());
    })
  }


  function publishPinValues(deviceName,newPinValues) {
    // Check if pins have changed
    _.each(newPinValues, function(pinRecord,i) {
      if (oldPinValues[i] ==pinRecord.value) {
        // Value has not changed from previous one
        // We do nothing
      } else {
        // Value has changed ... we publish and save it
        getMqttClient()
        .then(function(mqttClient) {
          var username = authService.getUsername();
          mqttClient.publish(username+'/device/'+deviceName+'/'+i, JSON.stringify(pinRecord.value));
          oldPinValues[i] = pinRecord.value;
        })
      }

    })
  }
  
              /*
            if (mqttClient) {
                _.each(newValue.pins, function(pin,i) {
                    if (pin.value !== oldValue.pins[i].value) {
                        mqttClient.publish(myself.username+'/'+myself.deviceName+'/'+i, JSON.stringify(pin.value));
                    }
                })
                
            }*/
}])




