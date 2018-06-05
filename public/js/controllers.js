'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

.controller('AdminPhotoGalleryCtrl', ['$scope', 'photoFactory', function($scope, photoFactory){
  photoFactory.getPhotos().then(
    function(response){
      $scope.allPhotos = response.data;
    },
    function(err){
      $log.error(err);
    });
  }])

  .controller('fileuploadCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){
    $scope.uploadFile = function(){
      var file = $scope.myFile;
      var uploadUrl = "/api/profile";
      fileUpload.uploadFileToUrl(file, uploadUrl);
    };
  }])

  .controller('AppCtrl', ['$scope','AuthService','flashMessageService','$location',function($scope,AuthService,flashMessageService,$location) {
    $scope.site = {
      logo: "Logo",
      footer: "Copyright 2014 Angular CMS"
    };

    $scope.logout = function() {
      AuthService.logout().then(
        function() {
          $location.path('/admin/login');
          flashMessageService.setMessage("Successfully logged out");
        }, function(err) {
          console.log('there was an error tying to logout');
        });
      };
    }
  ])

  .controller('AddEditPageCtrl', ['$scope', '$log', 'pagesFactory', '$routeParams', '$location', 'flashMessageService', '$filter', function($scope, $log, pagesFactory, $routeParams, $location, flashMessageService, $filter) {
    $scope.pageContent = {};
    $scope.pageContent._id = $routeParams.id;
    $scope.heading = "Add a New Page";

    $scope.updateURL=function(){
      $scope.pageContent.url=$filter('formatURL')($scope.pageContent.title);
    }

    if ($scope.pageContent._id != 0) {
      $scope.heading = "Update Page";
      pagesFactory.getAdminPageContent($scope.pageContent._id).then(
        function(response) {
          $scope.pageContent = response.data;
          $log.info($scope.pageContent);
        },
        function(err) {
          $log.error(err);
        });
      }

      $scope.savePage = function() {
        pagesFactory.savePage($scope.pageContent).then(
          function() {
            flashMessageService.setMessage("Page Saved Successfully");
            $location.path('/admin/pages');
          },
          function() {
            $log.error('error saving data');
          }
        );
      };
    }
  ])

  .controller('AdminPagesCtrl', ['$scope', '$log', 'pagesFactory', 'AuthService', function($scope, $log, pagesFactory, AuthService) {
    pagesFactory.getPages().then(
      function(response){
        $scope.allPages = response.data;
      },
      function(err){
        $log.error(err);
      });

      $scope.deletePage = function(id) {
        pagesFactory.deletePage(id);
      };

      $scope.logout = function() {
        AuthService.logout().then(
          function() {
            $location.path('/admin/login');
          }, function(err) {
            console.log('there was an error tying to logout');
          });
        };
      }])
      .controller('AdminLoginCtrl', ['$scope', '$location', '$cookies', 'AuthService', 'flashMessageService',
      function($scope, $location, $cookies, AuthService, flashMessageService) {
        $scope.credentials = {
          username: '',
          password: ''
        };
        $scope.login = function(credentials) {
          AuthService.login(credentials).then(
            function(res, err) {
              $cookies.loggedInUser = res.data;
              $location.path('/admin/pages');
            },
            function(err) {
              flashMessageService.setMessage(err.data);
            });
          };
        }
      ]);
