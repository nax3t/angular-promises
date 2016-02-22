app.service('swService', ['$http', '$q', function($http, $q) {
	this.getFilms = function() {
		// set base url for API call to a variable
		// and create a promise using $q and set it to deferred variable
		var baseUrl = 'http://swapi.co/api/',
				deferred = $q.defer();
		// make http GET request to base url + people/ and do something
		// with the result
		$http({
			method: 'GET',
			url: baseUrl + 'people/'
		}).then(function(peopleData){
			// set people to peopleData.data.results
			// and set skywalker to first item in people
			var people = peopleData.data.results,
					skywalker = people[0];
					skyWalkerFilms = [],
					filmCount = 0;
			// iterate over films array and make an http call for each
			// film then assign its results to the original film item
			// from the array
			skywalker.films.forEach(function(film) {
				$http.get(film)
					.then(function(filmResult) {
						skyWalkerFilms.push(filmResult.data);
					})
					.then(function() {
						// when loop finishes, set skywalker.films to skyWalkerFilms
						skywalker.films = skyWalkerFilms;
						// resolve the promise with skywalker (this is what gets returned in the controller)
						deferred.resolve(skywalker);
					});
			});

		}, function (error) {
			error.message = "Sorry, your request failed";
			return deferred.reject(error);
		});

		return deferred.promise;
	};
}]);