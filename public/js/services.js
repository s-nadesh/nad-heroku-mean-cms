'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
.service('fileUpload', ['$http', function ($http) {
  this.uploadFileToUrl = function(file, uploadUrl){
    var fd = new FormData();
    fd.append('profileImage', file);

    $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    })
    .success(function(){
    })
    .error(function(){
    });
  }
}])
.factory('myHttpInterceptor', ['$q', '$location', function($q, $location) {
  return {
    response: function(response) {
      return response;
    },
    responseError: function(response) {
      if (response.status === 401) {
        $location.path('/admin/login');
        return $q.reject(response);
      }
      return $q.reject(response);
    }
  };
}])
.factory('AuthService', ['$http', function($http) {
  return {
    login: function(credentials) {
      return $http.post('/api/login', credentials);
    },
    logout: function() {
      return $http.get('/api/logout');
    }
  };
}])
.factory('photoFactory', ['$http', function($htpp){
  return {
    getPhotos: function() {
      return $htpp.get('api/photos');
    }
  }
}])
.factory('pagesFactory', ['$http', function($http){
  return {
    getPages: function(){
      return $http.get('/api/pages');
    },
    savePage: function(pageData){
      var id = pageData._id;
      if(id == 0){
        return $http.post('/api/pages/add', pageData);
      } else {
        return $http.post('/api/pages/update', pageData);
      }
    },
    deletePage: function(id){
      return $http.get('api/pages/delete/' + id);
    },
    getAdminPageContent: function(id) {
      return $http.get('/api/pages/view/' + id);
    },
    getPageContent: function(url) {
      return $http.get('/api/pages/details/' + url);
    },
  };

}]);
