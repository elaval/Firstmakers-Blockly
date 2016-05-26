'use strict';
/* jshint undef: true, unused: true */
/* global angular */




/**
 * @ngdoc controller
 * @name chilecompraApp.controller:CarrerasController
 * @requires $scope
 * @requires chilecompraApp.CarrerasDataService
 *
 * @property {array} colorOptions Array with options for colorAttributes
 * @property {string} colorAttribute Selected color attribute
 * @property {array} data Array with student data for the selected career & semester
 * @property {int} n Number of students in the selected data array
 * @property {int} maxCarreras Maximum number of carreras to be displayed when filtraTopCarreras is true
 * @property {array} semestres Array with the semesters options to be chosen
 * @property {string} selectedSemestre Selected semester for data selection
 * @property {string} psuValido Flag to select only data values with a valid psu score (prom_paa>0)
 * @property {string} loading Flag to show a "loading" message when its value is true
 * @description
 *
 * Controller for Carreras explorer
 *
 */
angular.module('tideApp')
.controller('AppController', ['$scope','$http','$timeout','$interval','$uibModal','_','d3', 'DataService', 'FirstmakersService', 'BoardService','SerialService',function ($scope,$http,$timeout,$interval,$uibModal,_,d3, dataService, FirstmakersService, BoardService,SerialService) {
	var myself = this;
    
    // Public functions (accesible from the view)
    myself.runCode = runCode
    myself.disconnectBoard = disconnectBoard
    myself.scanPorts = scanPorts;
    myself.softReset = softReset;

    // Public properties (accesible from the view)
    this.statusMessageText; // Message to be displyes to the user
    this.state = {whiteLight: false} // state of virtual board
    this.boardState = {
        connected: false,
        connecting: false
    }
    this.state = {whiteLight: false}
    
    // Local variables/properties
    var physicalBoard = undefined;
   
    // Init controller
    activate()
    
    // Controler's 'constructor'
    function activate() {
        FirstmakersService.init();
    }
 
    // Implementation of public methods
    // ==================================
    
    /**
     * Runs the Blockly code
     */
    function runCode() {
        FirstmakersService.runCode();
    }
    
    /**
     * Disconnects a physicla board
     */
    function disconnectBoard() {
        BoardService.disconnect(true);
    }
    
    /**
     * Resets the program 
     */
    function softReset() {
        window.location.reload();
    }
    
    /**
     * Scans for available ports and if found, attempts to open a new board
     */
    function scanPorts() {
        SerialService.Serial.detect(function(ports) {
            connectBoard(ports);
        });
    }


    // Implementation of private methods
    // ==================================

    function statusMessage() {
        var msg = "";
        
        if (myself.boardState.connected) {
            msg = "Tarjeta conectada";
        } else if (!myself.boardState.connected && myself.boardState.connecting) {
            msg = "Conectando tarjeta";
        } else {
            msg = "Tarjeta no conectada";
        }
        
        return msg;
    }
    
    
    /**
     * Attempts to connect available ports
     */
    function connectBoard(ports) {
        var firstPort = ports[0];
        myself.boardState.connecting = true;
        
        BoardService.connect(firstPort)
        .then(function(board) {
            physicalBoard = board;
            myself.boardState.connecting = false;
            myself.boardState.connected = true;
            console.log(board);
        })
        .catch(function(err) {
            myself.boardState.connecting = false;
            myself.boardState.connected = false;
            
            // TODO: Check if error seems to correspond to a non-firmata valid board or a "hanged" port and send a message
            SerialService.Serial.lock(firstPort);
            if (ports.length > 1) {  
                ports = _.rest(ports);
                connectBoard(ports);
            } else {
                scanPorts();
            }
            console.log(err);
        });
    }
    

    /**
     * Handles board.closed event 
     * Triggered when board is disconnected (cable pulled)
     * or when the board is automatically closed (for example due to an errror)
     */
    $scope.$on("board.closed", function(e,a) {
        myself.boardState.connected = false;
        scanPorts();
        console.log(a);
    })
    

    $scope.$on("virtualFirstmakersChange", function(e,pins){
        $timeout(0).then(function() {myself.state.whiteLight = pins[13];})
        
    });
    
    /**
     * Modal window (for future use)
     */
    var open = function (size, ports) {

        var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/modal.html',
        controller: 'ModalInstanceCtrl',
        size: size ? size : 'sm',
        resolve: {
            items: function () {
                return ports;
            }
        }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    
    
    $scope.$watch(statusMessage,
        function handleStatusChange( newValue, oldValue ) {
            myself.statusMessageText = newValue;
            console.log( "statusMessage", newValue );
        }
    );
    
    
    
                
                
}]);

angular.module('tideApp')
.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
