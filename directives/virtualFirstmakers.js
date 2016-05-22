
"use strict";
/* jshint undef: true, unused: true */
/* global angular */


/**
 * @ngdoc directive
 * @description
 *
 */
angular.module("tideApp")
.directive("virtualFirstmakers",["$compile","_", "d3", function ($compile,_, d3) {
 return {
  restrict: "A",
      scope: {
        state: "=state"
      },
      
      link: function (scope, element, attrs) {
        var width = scope.width ? scope.width : 80;
        var height = scope.height ?  scope.height : 160;
        var margin = {};
        margin.left = scope.options && scope.options.margin && scope.options.margin.left ? scope.options.margin.left : 5;
        margin.right = 5;
        margin.top = 5;
        margin.bottom = 5;

        var svgMainContainer = d3.select(element[0])
          .append("svg")
          .attr("width", width+margin.left+margin.right)
          .attr("height", height+margin.top+margin.bottom)

        var svgContainer = svgMainContainer
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top+ ")");
          
        svgContainer.append("image")
        .attr("xlink:href", "./images/firstmakers_board.png")
        .attr("width", width)
        .attr("height", height);
               
        var whiteLight = svgContainer.append("circle")
          .attr("class", "light white")
          .attr("r", 3)
          .attr("cx", 53)
          .attr("cy", 45)
          .attr("fill", "grey")
          .attr("stroke", "black")
          .attr("stroke-width",1)
          
        render(scope.state);

        /*
        * render
        */
        function render(state) {
          
          whiteLight
          .attr("fill", state && state.whiteLight ? "yellow" : "grey");

        }

        // Check for changes in data and re-render
        scope.$watch("state", function () {
          render(scope.state);
        }, true);      
  
      }
      
      
    };
  }]);

