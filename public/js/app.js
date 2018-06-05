'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ngCookies',
  'message.flash'
])
.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider.when('/admin/login', {
    templateUrl: 'partials/admin/login.html',
    controller: 'AdminLoginCtrl'
  });
  $routeProvider.when('/admin/pages', {
    templateUrl: 'partials/admin/pages.html',
    controller: 'AdminPagesCtrl'
  });
  $routeProvider.when('/admin/add-edit-page/:id', {
    templateUrl: 'partials/admin/add-edit-page.html',
    controller: 'AddEditPageCtrl'
  });

  $routeProvider.when('/admin/photo_gallery', {
    templateUrl: 'partials/admin/photo_gallery.html',
    controller: 'AdminPhotoGalleryCtrl'
  });


  $routeProvider.when('/file_upload', {
    templateUrl: 'partials/file_upload.html',
    controller: 'fileuploadCtrl'
  });
  $routeProvider.otherwise({
    redirectTo: '/'
  });
  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push('myHttpInterceptor');
}]);
