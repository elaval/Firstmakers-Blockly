'use strict';
/**
* @ngdoc object
* @description
*/
angular.module('tideApp')
.config(function Config($httpProvider, jwtInterceptorProvider) {
  // Please note we're annotating the function so that the $injector works when the file is minified
  jwtInterceptorProvider.tokenGetter = ['authService', 'config', function(authService, config) {
    
    // Skip authentication for any requests ending in .html (templates)
    if (config.url.substr(config.url.length - 5) == '.html') {
      return null;
    } 
    
    // Skip authentication for local template svg templates
    else if (config.url.substr(config.url.length - 5) == '.svg') {
      return null;
    } 
    
    // Skip authentication for loading translation json files
    else if (config.url.match("translations/pageui")) {
      return null;
    }

    // Return promise to the access token 
    // If current one has expired, we will try to renew it
    return authService.getAccessToken();
  }];

  $httpProvider.interceptors.push('jwtInterceptor');
});