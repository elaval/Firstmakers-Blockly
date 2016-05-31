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
.service('BoardService',['$rootScope','$q','$templateRequest', 'd3', '_', '$http', '$timeout', 'SerialService', function($rootScope, $q, $templateRequest, d3,_, $http, $timeout ,  SerialService) {
  var myself = this;
  
  myself.getBoardState = getBoardState;
  myself.connect = connect;
  myself.disconnect = disconnect;
  myself.detectPort = detectPort;
  myself.detectPorts = detectPorts;
  myself.analogRead = analogRead;
  myself.light = light;
  myself.buzzer = buzzer;
  myself.isBoardReady = isBoardReady;
  
  var Board = require("firmata");
  var five = require("johnny-five");

  var arduino = {
    board : undefined,	// Reference to arduino board - to be created by new firmata.Board()
    connecting : false,	// Flag to avoid multiple attempts to connect
    disconnecting : false,  // Flag to avoid serialport communication when it is being closed
    justConnected: false,	// Flag to avoid double attempts
    keepAliveIntervalID: null,
    connected: false
  }
  

  function isBoardReady() {
      return arduino.isBoardReady();
  }

  
  function getBoardState() {
    return arduino;
  }
                   
  function light(state) {
    var value = arduino.board.pins[13].value;
    arduino.board.digitalWrite(13, state ? 1 : 0);
  }
  
  function buzzer(state) {
    var value = arduino.board.pins[6].value;
    arduino.board.digitalWrite(6, state ? 1 : 0);
  }
  
  function analogRead(pin) {
      var deferred = $q.defer();
      
      arduino.board.analogRead(pin, function(value) {
          deferred.resolve(value);
      });
      
      return deferred.promise;
  }
  
  function detectPorts() {
    var deferred = $q.defer();
    
    SerialService.Serial.detect(function(ports) {
      deferred.resolve(ports)        
    });
    
    return deferred.promise
  }
  
  function detectPort() {
    SerialService.Serial.detect(function(port) {
      arduino.connect(port);        
    });
  }
  
  function disconnect(silent) {
    arduino.disconnect(silent);
  }
  
  function connect(port) {
      return arduino.connect(port);
  }

  /**
   * Attempts a connection to an arduino board
   * Returns a promise with the connected board or a rejection
   */
  arduino.connect = function(port) {
    var deferred = $q.defer();
      
    $timeout(0) 
    .then(function() {arduino.connecting = true;});

    // Artificial delay to deal with strange behaviour when board is connected once
    // the program is opened for the first time
    $timeout(1000)
    .then(function() {

      arduino.board = new Board(port, function(err) { 
          if (!err) { 

              // Clear timeout to avoid problems if connection is closed before timeout is completed
              clearTimeout(arduino.connectionTimeout); 

              // Start the keepAlive interval
              //myself.arduino.keepAliveIntervalID = setInterval(myself.arduino.keepAlive, 5000);

              arduino.board.sp.on('disconnect', arduino.disconnectHandler);
              arduino.board.sp.on('close', arduino.closeHandler);
              arduino.board.sp.on('error', arduino.errorHandler);

              $timeout(0).then(function() {
                arduino.port = arduino.board.sp.path;
                arduino.connecting = false;
                arduino.justConnected = true;
                arduino.connected = true; 
                arduino.disconnected = false;
                
                deferred.resolve(arduino.board);      
              })

          } else {
              clearTimeout(arduino.connectionTimeout);
              arduino.disconnect(true);
              deferred.reject(err);
          }
      });

      // Set timeout to check if device does not speak firmata (in such case new Board callback was never called, but board object exists) 
      arduino.connectionTimeout = setTimeout(function() {
          // If !board.versionReceived, the board has not established a firmata connection
          if (arduino.board && !arduino.board.versionReceived) {
              var port = arduino.board.sp.path;


              // silently closing the connection attempt
              arduino.disconnect(true); 
              deferred.reject('Could not talk to Arduino in port\n'+ port + '\n\n' + 'Check if firmata is loaded.');

          } else {
              deferred.reject('Could not talk to Arduino in port\n'+ '' + '\n\n' + 'Check if firmata is loaded.');

          }

      }, 10000);

    })

    


    return deferred.promise;
  };
  
  arduino.disconnect = function(silent) {

      if (arduino.isBoardReady()) {
          // Prevent disconnection attempts before board is actually connected
          arduino.connected = false;
          arduino.disconnecting = true;
          arduino.board.sp.close();
          arduino.closeHandler(silent);
      } else if (!arduino.board) {
          // Don't send info message if the board has been connected
          if (!silent) {
              alert('Board is not connected');
          }
      } 
  }
    
  arduino.isBoardReady = function() {
      return ((arduino.board !== undefined) 
              && (arduino.board.pins.length>0) 
              && (!arduino.disconnecting));
  };
    
  arduino.closeHandler = function (silent) {

      var portName =  "unknown";

      if (arduino.board) {
          portName = arduino.board.sp.path;
          
          arduino.board.sp.removeListener('disconnect', arduino.disconnectHandler);
          arduino.board.sp.removeListener('close', arduino.closeHandler);
          arduino.board.sp.removeListener('error', arduino.errorHandler);

          arduino.board = undefined;
      };

      //clearInterval(arduino.keepAliveIntervalID);

      //world.Arduino.unlockPort(thisArduino.port);
      $timeout(0).then(function() {
        arduino.connecting = false;
        arduino.disconnecting = false;
        arduino.connected = false;
      });
      

      $rootScope.$broadcast("board.closed", {'port':portName, 'disconnected':arduino.disconnected, 'silent':silent});
      arduino.disconnected = false;
      /*
      if (arduino.disconnected & !silent) {
          
          alert('Board was disconnected from port' + portName + ' It seems that someone pulled the cable!')
          $timeout(0).then(function() {
            arduino.disconnected = false;
          });
      } else if (!silent) {
          alert('Board was disconnected from port\n' + portName);
      }
      */
  };

  arduino.disconnectHandler = function () {
      // This fires up when the cable is unplugged
      $timeout(0).then(function() {
        arduino.disconnected = true;
        arduino.connected = false;
      });
  };

  arduino.errorHandler = function (err) {
      //alert(err)
  };



}])




