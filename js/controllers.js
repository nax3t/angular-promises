app.controller('swCtrl', ['$scope', 'SWService', function($scope, SWService) {

	// example of asynchronous code
	SWService.async();

	// example of a simple http call to omdb api
	SWService.getMovie().then(function(results) {
		$scope.movies = results;
	});

	// call getFilms function from SWService and set $scope.films to result
	// handle errors with a second callback argument to the .then function
	SWService.getFilms()
		.then(function(films) {
			$scope.films = films;
		}).catch(function (error) {
			$scope.error = error.message;
		});

}]);