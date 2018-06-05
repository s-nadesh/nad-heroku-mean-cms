'use strict';

/* Filters */

angular.module('myApp.filters', []).
filter('interpolate', ['version', function(version) {
  return function(text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  };
}]).
filter('formatURL', [
  function(){
    return function(input) {
      // var url = input.replace(/[`~!@#$%^&*()_|+-=?;:'",.<>{}[]/]/gi, '');
      var url = input.replace(/[s+]/g, '-');
      return url.toLowerCase();
    };
  }
]);
