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
  
  Blockly.HSV_SATURATION = 0.8;
  Blockly.HSV_VALUE = 0.8;

}]);



