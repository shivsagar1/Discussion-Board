 var app = angular.module('postIt', ['ngRoute', 'ngResource']).run(function($rootScope, $http){
 	$rootScope.authenticated = false;
 	$rootScope.current_user = "";
 	$rootScope.signout = function(){
 	$http.get('/auth/signout');
 	$rootScope.authenticated = false;
 	$rootScope.current_user = "";
 	}
 });

app.config(function($routeProvider){
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/signin', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/signup', {
			templateUrl: 'register.html',
			controller: 'authController'
		});
});

app.factory('postService', function($resource){
		return $resource('/api/posts/:id');

	// var factory = {};
	// factory.getAll=function(){
	// 	return $http.get('/api/posts')
	// }
	// return factory;
});

app.controller('mainController', function($rootScope, $scope,postService){
	$scope.posts = postService.query();
	$scope.newPost = {created_by: '', text: '', created_at: ''};
	
	// postService.getAll().success(function(data){
	// 	$scope.posts = data;
	// });

	$scope.post = function(){
$scope.newPost.created_by = $rootScope.current_user;
$scope.newPost.created_at = Date.now();
		postService.save($scope.newPost, function(){
		$scope.posts = postService.query();
	$scope.newPost = {created_by: '', text: '', created_at: ''};	
		});
	};
});

app.controller('authController', function($scope, $rootScope, $http, $location){
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';

	$scope.login = function(){
		 $http.post('/auth/signin', $scope.user).success(function(data){
		 	$rootScope.authenticated = true;
		 	$rootScope.current_user = data.user.username;
		 	$location.path('/');
		 })
		
	};

	$scope.register = function(){
		$http.post('/auth/signup', $scope.user).success(function(data){
		 	$rootScope.authenticated = true;
		 	$rootScope.current_user = data.user.username;
		 	$location.path('/');
		 })
};

});

app.directive("codeLogic", function() {
    return {
        restrict : "E",
        templateUrl : "logic.html"
    };
});
