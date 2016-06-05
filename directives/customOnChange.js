
"use strict";
/* jshint undef: true, unused: true */
/* global angular */


/**
 * @ngdoc directive
 * @description
 *
 * Adds onChange for file inputs 
 * Based on https://solidfoundationwebdev.com/blog/posts/angularjs-directive-to-listen-for-file-input-changes
 */
angular.module("tideApp")
.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeFunc = function() {
        scope.$eval(attrs.customOnChange);
      }
      element.bind('change', onChangeFunc);
    }
  };
});
