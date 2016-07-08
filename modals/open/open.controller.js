(function() {
'use strict';
/* jshint undef: true, unused: true */
/* global angular */

/**
 * @ngdoc controller
 *
 */
angular.module('tideApp').controller('OpenController', ['$rootScope', '$uibModalInstance','dataService','sketches', OpenController]);

function OpenController($rootScope, $uibModalInstance, dataService, sketches) {
  var myself = this;
  this.newRegistration = false;
  this.sketches = sketches;

  /**
   * open
   */
  this.open = function (sketch) {

    dataService.getSketch(sketch.id)
    .then(function(sketch) {
      $uibModalInstance.close(sketch);
    })
    .catch(function() {

    })
  };


  /**
   * open
   */
  this.delete = function (sketch) {

    dataService.deleteSketch(sketch)
    .then(function(sketch) {
      $uibModalInstance.close(sketch);
    })
    .catch(function() {

    })
  };

  /**
   * Cancel
   */
  this.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}


})()