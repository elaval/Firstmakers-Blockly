
"use strict";
/* jshint undef: true, unused: true */
/* global angular */


/**
 * @ngdoc directive
 * @description
 *
 * Generates 
 *
 */
angular.module("tideApp")
.directive("blockly",["$compile", function ($compile) {
 return {
  restrict: "E",
      template: '<div style="height:80vh"; width: 100%; resize:both; class="ng-blockly"></div>',
      scope: {
        options:"=options",    // Blockly options definition (input)
        workspace:"=workspace", // Blockly workspace (output)
        onInjected: "=onInjected" // Function called after Blockly injection
      },
      link: function (scope, element, attrs) {
        var verticalMargin = 200;
        
        function render(options) {
          if (options) {
            // Remove exiting blockly elements
            element.children().children().remove();
            
            // Inject new blockly ui
            scope.workspace = Blockly.inject(element.children()[0], options);
            if (scope.onInjected) scope.onInjected(scope.workspace);
          }
        }
 
        var onresize = function(e) {
          // Compute the absolute coordinates and dimensions of blocklyArea.
          var myelement = element.children()[0];
          myelement.style.height = (window.innerHeight-verticalMargin) + 'px';

        };
        window.addEventListener('resize', onresize, false);
        onresize();
        
        scope.$watch('options', function(o,n) {
          render(scope.options);
        })
        
      }

    };
  }]);

