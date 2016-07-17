(function() {
'use strict';
/* jshint undef: true, unused: true */
/* global angular */

/**
 * @ngdoc controller
 *
 */
angular.module('tideApp').controller('LoginController', ['$rootScope', '$uibModalInstance','$translate', 'authService', LoginController]);

function LoginController($rootScope, $uibModalInstance,$translate, authService) {
  var myself = this;
  myself.registrationMode = registrationMode;
  myself.forgotPasswordMode = forgotPasswordMode;


  this.newRegistration = false;
  this.message= null;
  
  /**
   * SignIn
   * Error codes:
   * ERROR_SIGNIN_INVALID_EMAIL
   * ERROR_SIGNIN_INVALID_PASSWORD
   * ERROR_SIGNIN_SAVE_TOKEN
   * ERROR_SIGNIN_NO_EMAIL_PASSWORD
   *    
   **/
  this.signIn = function () {
    myself.message = null;
    authService.signIn(myself.email, myself.password)
    .then(function(username) {
      $rootScope.$broadcast("signIn", username);
      $uibModalInstance.close({registration: false, email:myself.email, password:myself.password});
    })
    .catch(function(err) {
      $translate(err ? err : "ERROR_SIGNIN")
      .then(function(msg) {
        myself.message = msg;
      })
      .catch(function(err) {
        myself.message = "Error";
      })
      
    })
  };

  /**
   * SignUp
   * Error codes:
   * 
   * ERROR_SIGNUP
   * ERROR_SIGNUP_EMAIL_EXISTS
   * ERROR_SIGNUP_USERNAME_EXISTS
   * ERROR_SIGNUP_USER_VALIDATION_FAILED
   * ERROR_SIGNUP_USER_SAVE_ERROR
   * ERROR_SIGNUP_LACK_EMAIL_USERNAME_PASSWORD
   * ERROR_SIGNUP_FAILED_ACTIVATION_EMAIL
   */
  this.signUp = function () {
    myself.message = null;
    
    var language= $translate.use() ? $translate.use() : 'en';
    authService.signUp(myself.email, myself.password, myself.username, language)
    .then(function() {
      myself.message = "Sign Up succesfull";
      myself.signIn();
      myself.newRegistration = false;
    })
    .catch(function(err) {
      $translate(err ? err : "ERROR_SIGNUP")
      .then(function(msg) {
        myself.message = msg;
      })
      .catch(function(err) {
        myself.message = "Error";
      })
    })


    //$uibModalInstance.close({registration: true, email:myself.email, password:myself.password, username:myself.username});
  };

  /**
   * ResetPassword
   */
  this.resetPassword = function () {
    myself.emailSent = false;
    myself.emailError = false;
    myself.message = null;
    var language= $translate.use() ? $translate.use() : 'en';
    authService.forgotPassword(myself.email, language)
    .then(function() {
      //myself.message = "Email sent to "+myself.email+" to change password";
      myself.forgotPassword = false;
      myself.emailSent = true;
    })
    .catch(function(err) {

      $translate(err ? err : "ERROR_FORGOT_PASSWORD_REQUEST")
      .then(function(msg) {
        myself.message = msg;
      })
      .catch(function(err) {
        myself.message = "Error";
      })
    })
  };

  function registrationMode() {
    myself.forgotPassword=false;
    myself.message=false;
  }


  function forgotPasswordMode() {
    myself.newRegistration=false;
    myself.message=false;
  }

  /**
   * Cancel
   */
  this.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}


})()