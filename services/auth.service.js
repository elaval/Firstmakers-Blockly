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
  this.forgotPassword = forgotPassword;
  this.signInWithToken = signInWithToken;
  this.getAccessToken = getAccessToken;

  /**
   * signIn
   * Error codes
   * ERROR_SIGNIN
   * ERROR_SIGNIN_INVALID_EMAIL
   * ERROR_SIGNIN_INVALID_PASSWORD
   * ERROR_SIGNIN_SAVE_TOKEN
   * ERROR_SIGNIN_NO_EMAIL_PASSWORD
   */
  function signIn(email, password) {
    var deferred = $q.defer();

    $http.post("https://api.firstmakers.com/api/auth/signin",{
      'email':email,
      'password':password
    },{
      skipAuthorization: true // Prevents from automatically inserting an access_token (which is not available yet)
    })
    .then(function(res) {
      var data = res.data;
      if (data.success) {
        localstorage.set("username", data.username);
        localstorage.set("access_token", data.access_token);
        localstorage.set("refresh_token", data.refresh_token);

        deferred.resolve(data.username);
      } else {

        deferred.reject(data.message_code ? data.message_code : "ERROR_SIGNIN");
      }
    }, function(res) {
      deferred.reject("ERROR_SIGNIN");
    });

    return deferred.promise;
  }


  /**
   * signUp
   * Error codes:
   * ERROR_SIGNUP
   * ERROR_SIGNUP_EMAIL_EXISTS
   * ERROR_SIGNUP_USERNAME_EXISTS
   * ERROR_SIGNUP_USER_VALIDATION_FAILED
   * ERROR_SIGNUP_USER_SAVE_ERROR
   * ERROR_SIGNUP_LACK_EMAIL_USERNAME_PASSWORD
   * ERROR_SIGNUP_FAILED_ACTIVATION_EMAIL
   */
  function signUp(email, password, username, language) {
    var deferred = $q.defer();

    $http.post("https://api.firstmakers.com/api/auth/signup?lang="+language,{
    //$http.post("http://localhost.firstmakers.com:8080/api/auth/signup",{
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
        deferred.reject(data.message_code ? data.message_code : "ERROR_SIGNUP");
      }
    }, function(res) {
      deferred.reject("ERROR_SIGNUP");
    });

    return deferred.promise;
  }

 /**
   * forgotPassword
   * error message_codes:
   * ERROR_FORGOT_PASSWORD_REQUEST
   * ERROR_FORGOT_PASSWORD_CHECKING
   * ERROR_FORGOT_PASSWORD_NON_USER
   * ERROR_FORGOT_PASSWORD_NO_EMAIL
   */
  function forgotPassword(email, language) {
    var deferred = $q.defer();

    $http.post("https://api.firstmakers.com/api/auth/forgotpassword?lang="+language,{
      'email':email
    },{
      skipAuthorization: true // Prevents from automatically inserting an access_token (which is not available yet)
    })
    .then(function(res,err) {
      var data = res.data;
      if (data.success) {
        deferred.resolve(data);
      } else {
        deferred.reject(data.message_code ? data.message_code : "ERROR_FORGOT_PASSWORD_REQUEST");
      }
    }, function(res) {
      deferred.reject("ERROR_FORGOT_PASSWORD_REQUEST");
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


