(function() {
'use strict';
/* jshint undef: true, unused: true */
/* global angular */

/**
 * @ngdoc controller
 *
 */
angular.module('tideApp').controller('SaveController', ['$rootScope', '$uibModalInstance','dataService','sketch', SaveController]);

function SaveController($rootScope, $uibModalInstance, dataService, sketch) {
  var myself = this;
  this.updateSketch = false;
  this.sketch = sketch;

  var originalTitle = sketch && sketch.title ? sketch.title : null;

  /**
   * open
   */
  this.save = function (sketch) {
    myself.updateSketch = false;

    if (sketch && sketch.id && (sketch.title == originalTitle)) {
      dataService.updateSketch(sketch)
      .then(function() {
        $uibModalInstance.close(sketch);
      })
      .catch(function(err) {
          myself.message = "Error, could not save the sketch"
      })
    } else {
      dataService.createSketch(sketch)
      .then(function(data) {
        $uibModalInstance.close(data.sketch);
      })
      .catch(function(err) {
        if (err && err.message.match("title already exists")) {
          myself.message = "There is already a saved with that title";
          sketch.id = err.sketch.id;
          myself.updateSketch = true;
        } else {
          myself.message = "Error, could not save the sketch"
        }
          
      })
    }

  };


  /**
   * Cancel
   */
  this.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}


})()