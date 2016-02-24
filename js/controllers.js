app.controller('swCtrl', ['$scope', 'SWService', function($scope, SWService) {
	// call getFilms function from SWService and set $scope.films to result
	// handle errors with a second callback argument to the .then function
	SWService.getFilms()
		.then(function(films) {
			$scope.films = films;
		}).catch(function (error) {
			$scope.error = error.message;
		});

	SWService.getMovie().then(function(results) {
		$scope.movies = results.data.Search;
	});
}]);