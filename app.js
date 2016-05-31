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
  
  Blockly.WorkspaceSvg.prototype.preloadAudio_ = function() {
    console.log("Sounds : ", JSON.stringify(this.SOUNDS_)); 
    /*
    for (var name in this.SOUNDS_) {
      var sound = this.SOUNDS_[name];
      sound.volume = .01;
      sound.play();
      sound.pause();
      // iOS can only process one sound at a time.  Trying to load more than one
      // corrupts the earlier ones.  Just load one and leave the others uncached.
      if (goog.userAgent.IPAD || goog.userAgent.IPHONE) {
        break;
      }
      
    }*/
  };

}]);



