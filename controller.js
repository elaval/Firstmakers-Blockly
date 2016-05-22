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
.controller('AppController', ['$scope','$http','$timeout','$interval','_','d3', 'DataService', 'FirstmakersService', 'BoardService',function ($scope,$http,$timeout,$interval,_,d3, dataService, FirstmakersService, BoardService) {
	var myself = this;
    this.loading = false;
    this.data = [];
    this.categories = [];
    this.statusMessageText;
    this.state = {whiteLight: false}
   
    myself.runCode = FirstmakersService.runCode;
    myself.arduino = BoardService.getBoardState();
    myself.connect = BoardService.connect;
    myself.disconnect = function() {
        BoardService.disconnect(true);
    };
    myself.softReset = softReset;
    
    BoardService.detectPort();
    FirstmakersService.init();

    function statusMessage() {
        var msg = "";
        
        if (myself.arduino.connected) {
            msg = "Tarjeta conectada";
        } else if (!myself.arduino.connected && myself.arduino.connecting) {
            msg = "Conectando tarjeta";
        } else {
            msg = "Tarjeta no conectada";
        }
        
        return msg;
    }
    
    function softReset() {
        window.location.reload();
    }
    

    $scope.$on("virtualFirstmakersChange", function(e,pins){
        $timeout(0).then(function() {myself.state.whiteLight = pins[13];})
        
    });
    
    $scope.$watch(statusMessage,
        function handleStatusChange( newValue, oldValue ) {
            myself.statusMessageText = newValue;
            console.log( "statusMessage", newValue );
        }
    );
                
                
}]);
