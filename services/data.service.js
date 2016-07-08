'use strict';
/* jshint undef: true, unused: true */
/* global angular */

/**
 * @ngdoc service
 * @description
 *
 */
angular.module('tideApp')
.service('dataService',['$http','$q','d3','authService', function($http, $q, d3, authService) {
  var myself = this;
  var dataUrl = "./data/sample_data.txt";

  myself.getRemoteData = getRemoteData;
  myself.getLocalData = getLocalData;
  myself.getDevices = getDevices;
  myself.getSketches = getSketches;
  myself.getSketch = getSketch;
  myself.updateSketch = updateSketch;
  myself.createSketch = createSketch;
  myself.deleteSketch = deleteSketch;


  var localData, remoteData;

  function getLocalData() {
    // deferred - use of promises to deal with async results
    var deferred = $q.defer();

    if (localData) {
      deferred.resolve(localData)
    } else {
      d3.csv(dataUrl, function(err,_data) {
        if (err) {
          deferred.reject(err)
        } else {
          localData = _data;
          deferred.resolve(localData)
        }
      })      
    }
    return deferred.promise;
  }


  function getRemoteData() {
    var deferred = $q.defer();

    if (remoteData) {
      deferred.resolve(remoteData)
    } else {
      $http.jsonp("http://api.worldbank.org/countries?format=jsonP&prefix=JSON_CALLBACK")
      .then(function(res) {
        remoteData = res.data[1];
        deferred.resolve(remoteData)
      })    
    }

    return deferred.promise;
  }

  /**
   * getDevices
   */
  function getDevices() {
    var deferred = $q.defer();

    $http.get("https://api.firstmakers.com/api/devices")
    .then(function(res) {
      deferred.resolve(res.data);
    })    

    return deferred.promise;
  }

  /**
   * getSketch
   */
  function getSketch(sketchId) {
    var deferred = $q.defer();

    $http.get("https://api.firstmakers.com/api/sketches/"+sketchId)
    .then(function(res) {
      deferred.resolve(res.data);
    }, 
    function(res) {
      deferred.reject();
    }
    )    

    return deferred.promise;
  }

  /**
   * getSketches
   */
  function getSketches() {
    var deferred = $q.defer();

    $http.get("https://api.firstmakers.com/api/sketches")
    .then(function(res) {
      deferred.resolve(res.data);
    })    

    return deferred.promise;
  }

  /**
   * updateSketch
   */
  function updateSketch(sketch) {
    var deferred = $q.defer();

    var id = sketch && sketch.id ?  sketch.id : null;

    $http.put("https://api.firstmakers.com/api/sketches/"+id, 
    sketch)
    .then(
      function(res) {
        if (res.data.success) {
          deferred.resolve(res.data);
        } else {
          deferred.reject(res.data.message);
        } 
      }, function(res) {
        deferred.reject();
      }
    )
    return deferred.promise;
  }

  /**
   * createSketch
   */
  function createSketch(sketch) {
    var deferred = $q.defer();

    $http.post("https://api.firstmakers.com/api/sketches", 
    sketch)
    .then(
      function(res) {
        if (res.data.success) {
          deferred.resolve(res.data);
        } else {
          deferred.reject(res.data);
        } 
      }, function(res) {
        deferred.reject();
      }
    )
    return deferred.promise;
  }

  /**
   * deleteSketch
   */
  function deleteSketch(sketch) {
    var deferred = $q.defer();

    var id = sketch.id;

    $http.delete("https://api.firstmakers.com/api/sketches/"+id, 
    sketch)
    .then(
      function(res) {
        if (res.data.success) {
          deferred.resolve(res.data);
        } else {
          deferred.reject(res.data.message);
        } 
      }, function(res) {
        deferred.reject();
      }
    )
    return deferred.promise;
  }

}])




