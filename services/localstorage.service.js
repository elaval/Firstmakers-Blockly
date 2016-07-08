angular.module('tideApp')
.factory('localstorageService', ['$window', '$log','$q', function($window, $log, $q) {

    return {

        set: function(key, value) {
            $window.localStorage[key] = value;
        },

        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },

        remove: function(key) {
            return $window.localStorage.removeItem(key);
        },

        setObject: function(key, value) {

            try {
                 $window.localStorage[key] = JSON.stringify(value);
                //$window.localStorage[key] = LZString.compressToUTF16(angular.toJson(value));
            }
            catch (e) {
                $log.error(e);
                $log.error("Could not store ", key);  
            }

        },

        getObject: function(key) {
            //console.log('decompress!');
            if (this.hasObject(key)) {
                var value = null;

                try {
                    value = JSON.parse($window.localStorage[key]);
                }
                catch (e) {
                    $log.error("Error parsing value for "+key+" in localstorage. Evidence of corrupt compressed data.");
                }

                return value;
            } else {
                return null;
            }
        },

        hasObject: function(key) {
            return $window.localStorage.hasOwnProperty(key);
        },

        clear: function() {
            $window.localStorage.clear();
        }
    };
}]);