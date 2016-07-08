(function() {
'use strict';
/* jshint undef: true, unused: true */
/* global angular */

/**
 * @ngdoc service
 * @description
 *
 */
angular.module('tideApp')
.service('authService',['$rootScope','$http','$q','d3','localstorageService','jwtHelper', 
function($rootScope, $http, $q, d3, localstorage, jwtHelper) {
  var myself = this;

  // Public methods
  this.signIn = signIn;
  this.signUp = signUp;
  this.signOut = signOut;
  this.signInWithToken = signInWithToken;
  this.getAccessToken = getAccessToken;

  /**
   * signIn
   */
  function signIn(email, password) {
    var deferred = $q.defer();

    $http.post("https://api.firstmakers.com/api/auth/signin",{
      'email':email,
      'password':password
    },{
      skipAuthorization: true // Prevents from automatically inserting an access_token (which is not available yet)
    })
    .then(function(res,err) {
      var data = res.data;
      if (data.success) {
        localstorage.set("username", data.username);
        localstorage.set("access_token", data.access_token);
        localstorage.set("refresh_token", data.refresh_token);

        //$rootScope.$broadcast("signIn", data.username);

        deferred.resolve(data.username);
      } else {
        deferred.reject("Unsuccesful login");
      }
    }, function(res) {
      deferred.reject("Error conecting to auth service");
    });

    return deferred.promise;
  }


  /**
   * signUp
   */
  function signUp(email, password, username) {
    var deferred = $q.defer();

    $http.post("https://api.firstmakers.com/api/auth/signup",{
      'email':email,
      'password':password,
      'username':username
    },{
      skipAuthorization: true // Prevents from automatically inserting an access_token (which is not available yet)
    })
    .then(function(res,err) {
      var data = res.data;
      if (data.success) {
        deferred.resolve(data.username);
      } else {
        deferred.reject(data.message);
      }
    }, function(res) {
      deferred.reject("Error conecting to auth service");
    });

    return deferred.promise;
  }


  /**
   * signInWithToken
   */
  function signInWithToken() {
    getAccessToken()
    .then(function(token){ 
        var payload = jwtHelper.decodeToken(token);
        var username = payload.username;

        $rootScope.$broadcast("signIn", username);
    })
    .catch(function(err) {
      // We don´t have access to a valid access token
      // We will omit the sign in via token
    })
  }  
  
 
  /**
   * signOut
   */
  function signOut() {
    localstorage.remove('access_token');    
    localstorage.remove('username');
    localstorage.remove('resfresh_token');
    $rootScope.$broadcast("signOut");
  }

  /**
   * Gets a new access token using the refresh token
   */
  function renewToken() {
    var deferred = $q.defer();

    var refreshToken = localstorage.get('refresh_token');

    $http.post("https://api.firstmakers.com/api/auth/token?refresh_token="+refreshToken,
    {},
    {
      skipAuthorization: true // Prevents from automatically inserting an access_token (which is not available yet)
    })
    .then(function(res,err) {
      var data = res.data;
      if (data.success) {
        deferred.resolve(data.access_token);
      } else {
        deferred.reject("Unsuccesful token renewal");
      }
    }, function(res) {
      deferred.reject("Error conecting to auth service");
    });
    
    return deferred.promise;
  }

  /**
   * getAccessToken
   */
  function getAccessToken() {
   var deferred = $q.defer();

    var accessToken = localstorage.get('access_token');
    var refreshToken = localstorage.get('refresh_token');

    // Check if access token exist (otherwise isTokenExpired generates en errror)
    if (accessToken) {

      try {
        if (jwtHelper.isTokenExpired(accessToken)) {
          // Current access token has expired
          // Let´s try to renew it if we have a valid the refresh_token
          renewToken()
          .then(function(newAccessToken) {
            // We should have already stored the username associated to the token,
            // But to avoid inconistencies, we will obtain it again from the token
            var payload = jwtHelper.decodeToken(newAccessToken);
            var username = payload.username;

            localstorage.set('access_token', newAccessToken);
            localstorage.set('username', username);

            deferred.resolve(newAccessToken)
          })
          .catch(function(err) {
            deferred.reject(err);
          })
        } else {
          deferred.resolve(accessToken)
        }
      }
      catch(err) {
          deferred.reject(err);
      }

    } else {
      deferred.resolve(null)
    }


    return deferred.promise;
  }

}])


})()


