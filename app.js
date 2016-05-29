'use strict';
/**
* @ngdoc object
* @name ngAnimate
* @description
*/
angular
  .module('tideApp', [
    'ui.bootstrap',
    'external_module_wrapper',
    'pascalprecht.translate',
    'ngCookies'
  ]);

angular.module('tideApp')
.config(['$translateProvider', function ($translateProvider) {
  
  $translateProvider.useStaticFilesLoader({
    prefix: 'translations/pageui/',
    suffix: '.json'
  });
  
  $translateProvider
  .determinePreferredLanguage()
  .preferredLanguage('es')
  .fallbackLanguage(['en', 'es'])
  .useLocalStorage();

}]);

angular.module('tideApp')
.config(['$windowProvider','$translateProvider',function($windowProvider, $translateProvider) {
  
   
  var $window = $windowProvider.$get();

  var langKey = $window.localStorage[$translateProvider.storageKey()];
  
  if (!langKey) langKey = "es";

  // Load the language strings.

  // Load Blockly's language strings.
  //$('body').append('<script type="application/javascript" src="./bower_components/google-blockly/msg/js/'+langKey+'.js"></script>');
  //$('body').append('<script type="application/javascript" src="./msg/'+langKey+'.js"></script>');

}])


