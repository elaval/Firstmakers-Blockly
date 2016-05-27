
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
.directive("blockly2",["$compile","_", "d3", "FirstmakersService", function ($compile,_, d3, FirstmakersService) {
 return {
  restrict: "E",
      template: '<div style="height:80vh"; width: 100%; resize:both; class="ng-blockly"></div>',
      scope: {
        options:"=options",
        workspace:"=workspace"
      },
      link: function (scope, element, attrs) {
        var verticalMargin = 200;
        
        FirstmakersService.getOptions()
        .then(function(options) {
          var workspace = Blockly.inject(element.children()[0], options);
          FirstmakersService.setWorkSpace(workspace); 
        })
        
        
        function render(options) {
          if (options) {
            scope.workspace = Blockly.inject(element.children()[0], options);
          }
        }
        
        
        var onresize = function(e) {
          // Compute the absolute coordinates and dimensions of blocklyArea.
          var myelement = element.children()[0];
          myelement.style.height = (window.innerHeight-verticalMargin) + 'px';

        };
        window.addEventListener('resize', onresize, false);
        onresize();
        
        /*
        scope.$watch('options', function(o,n) {
          render(scope.options);
        })
        */
        
      }

    };
  }]);

