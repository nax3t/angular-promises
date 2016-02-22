app.controller('swCtrl', ['$scope', 'swService', function($scope, swService) {
	// put films array on scope and set it equal to the response from
	// our getFilms method on the swService
	// handle errors with a second callback argument to the .then function
	$scope.films = swService.getFilms().then(function(skywalker) {
		$scope.films = skywalker.films;
	}, function (error) {
		$scope.films = [{error: error.message}];
	});
}]);