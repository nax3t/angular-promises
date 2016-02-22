app.controller('swCtrl', ['$scope', 'swService', function($scope, swService) {
	// call getFilms function from swService and set $scope.films to result
	// handle errors with a second callback argument to the .then function
	swService.getFilms().then(function(skywalker) {
		$scope.films = skywalker.films;
	}, function (error) {
		$scope.films = [{error: error.message}];
	});
}]);