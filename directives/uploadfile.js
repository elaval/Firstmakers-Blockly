
"use strict";
/* jshint undef: true, unused: true */
/* global angular */


/**
 * @ngdoc directive
 * @description
 *
 * Triggers click in a sibling #upload element (usefl for custom input fiel buttons) 
 * http://stackoverflow.com/questions/24628410/how-can-i-trigger-the-click-event-of-another-element-in-ng-click-using-angularjs
 */
angular.module("tideApp")
.directive('uploadfile', function () {
    return {
      restrict: 'A',
      link: function(scope, element) {

        element.bind('click', function(e) {
            angular.element(e.currentTarget).siblings('#upload').trigger('click');
        });
      }
    };
});


angular.module("tideApp")
.directive('fileInput', function ($parse) {
    return {
        restrict: "EA",
        template: "<input type='file' />",
        replace: true,          
        link: function (scope, element, attrs) {
 
            var modelGet = $parse(attrs.fileInput);
            var modelSet = modelGet.assign;
            var onChange = $parse(attrs.onChange);
 
            var updateModel = function () {
                scope.$apply(function () {
                    modelSet(scope, element[0].files[0]);
                    onChange(scope);
                });                    
            };
             
            element.bind('change', updateModel);
        }
    };
});