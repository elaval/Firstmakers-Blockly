
"use strict";
/* jshint undef: true, unused: true */
/* global angular */


/**
 * @ngdoc directive
 * @description
 *
 */
angular.module("tideApp")
.directive("virtualFirstmakers",["$compile","$log","_", "d3", function ($compile,$log,_, d3) {
 return {
  restrict: "A",
      templateUrl:"./templates/firstmakers.svg",
      scope: {
        board: "=board"
      },
      
      link: function (scope, element, attrs) {
        var width = scope.width ? scope.width : 80;
        var height = scope.height ?  scope.height : 160;
        var margin = {};
        margin.left = scope.options && scope.options.margin && scope.options.margin.left ? scope.options.margin.left : 5;
        margin.right = 5;
        margin.top = 5;
        margin.bottom = 5;
        
        var beep = new Audio('media/beep.wav');
        beep.loop = true;


        var svgMainContainer = d3.select("svg.firstmakers")
          .attr("width", width+margin.left+margin.right)
          .attr("height", height+margin.top+margin.bottom)

        var svgContainer = svgMainContainer.select("g")
                       
        var whiteLight = svgContainer.select(".white.light")
          
        render(scope.board);

        /*
        * render
        */
        function render(board) {
          
          
          
          svgContainer.select(".white.light")
           .attr("fill", board && board.pins[13].value ? "white" : "grey");
          
          svgContainer.select(".red.light")
           .attr("fill", board && board.pins[7].value ? "red" : "grey");

          svgContainer.select(".yellow.light")
           .attr("fill", board && board.pins[5].value ? "yellow" : "grey");

          svgContainer.select(".green.light")
           .attr("fill", board && board.pins[4].value ? "green" : "grey");
           
          if (board.pins[6].value) {
            var p = beep.play();
            if (p && (typeof Promise !== 'undefined') && (p instanceof Promise)) {
              p.catch(function(e) {
                $log.error(e);
              });
            }
          } else {
            var p = beep.pause();
          }

        }

        
        // Check for changes in data and re-render
        scope.$watch("board", function () {
          render(scope.board);
        }, true);     
  
      }
      
      
    };
  }]);

