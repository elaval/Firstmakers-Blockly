'use strict';
/* jshint undef: true, unused: true */
/* global angular */

/**
 * @ngdoc service
 * @name simceApp.MyDataService
 * @requires $q
 * @requires d3
 * @requires _
 * @requires $http
 *
 * @description
 * Demo
 *
 */
angular.module('external_module_wrapper', [])
.factory('_', function($window) {
    // Get a local handle on the global lodash reference.
    var _ = $window._;

    // Delete the global reference to make sure
    // that no one on the team gets lazy and tried to reference the library
    // without injecting it. It's an easy mistake to make, and one that won't
    // throw an error (since the core library is globally accessible).
    delete( $window._ );

    // Return the [formerly global] reference so that it can be injected
    // into other aspects of the AngularJS application.
    return( _ );
})
.factory('d3', function($window) {
    // Get a local handle on the global lodash reference.
    var d3 = $window.d3;

    // Delete the global reference to make sure
    // that no one on the team gets lazy and tried to reference the library
    // without injecting it. It's an easy mistake to make, and one that won't
    // throw an error (since the core library is globally accessible).
    delete( $window.d3 );

    // Return the [formerly global] reference so that it can be injected
    // into other aspects of the AngularJS application.
    return( d3 );
})
.factory('crossfilter', function($window) {
    // Get a local handle on the global lodash reference.
    var crossfilter = $window.crossfilter;

    // Delete the global reference to make sure
    // that no one on the team gets lazy and tried to reference the library
    // without injecting it. It's an easy mistake to make, and one that won't
    // throw an error (since the core library is globally accessible).
    delete( $window.crossfilter );

    // Return the [formerly global] reference so that it can be injected
    // into other aspects of the AngularJS application.
    return( crossfilter );
})
.factory('moment', function($window) {
    // Get a local handle on the global lodash reference.
    var moment = $window.moment;

    // Delete the global reference to make sure
    // that no one on the team gets lazy and tried to reference the library
    // without injecting it. It's an easy mistake to make, and one that won't
    // throw an error (since the core library is globally accessible).
    delete( $window.moment );

    // Return the [formerly global] reference so that it can be injected
    // into other aspects of the AngularJS application.
    return( moment );
})

