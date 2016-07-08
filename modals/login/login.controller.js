(function() {
'use strict';
/* jshint undef: true, unused: true */
/* global angular */

/**
 * @ngdoc controller
 *
 */
angular.module('tideApp').controller('LoginController', ['$rootScope', '$uibModalInstance','authService', LoginController]);

function LoginController($rootScope, $uibModalInstance, authService) {
  var myself = this;
  this.newRegistration = false;

  /**
   * SignIn
   */
  this.signIn = function () {
    myself.message = null;
    authService.signIn(myself.email, myself.password)
    .then(function(username) {
      $rootScope.$broadcast("signIn", username);
      $uibModalInstance.close({registration: false, email:myself.email, password:myself.password});
    })
    .catch(function(err) {
      myself.message = "Error in email/password combination";
    })
  };

  /**
   * SignUp
   */
  this.signUp = function () {
    myself.message = null;
    authService.signUp(myself.email, myself.password, myself.username)
    .then(function() {
      myself.message = "Sign Up succesfull";
      myself.signIn();
      myself.newRegistration = false;
    })
    .catch(function(err) {
      myself.message = "Error in Sign Up :"+err;
    })


    //$uibModalInstance.close({registration: true, email:myself.email, password:myself.password, username:myself.username});
  };

  /**
   * Cancel
   */
  this.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}


})()