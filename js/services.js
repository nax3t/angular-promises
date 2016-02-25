app.service('SWService', ['$http', '$q', '$timeout', function($http, $q, $timeout) {

	// example of asynchronous code using $timeout
	this.async = function() {
		console.log('before timeout');
		$timeout(function() {
			console.log('timed out function');
		}, 2000);
		console.log('after timeout');
	};

	// simple API request using $http and the omdb API
	this.getMovie = function() {
		// return the $http request because $http gives us a promise by default
		// notice that there's no need for deferred.resolve(), or using $q.defer() at all
		return $http({method: 'GET', url: 'http://www.omdbapi.com/?s=frozen'}).then(function(response){
			return response.data.Search;
		});
	};

	// create a getFilms function
	this.getFilms = function() {
		// set baseUrl for API
		// create empty array to store films in
		// create promise using $q
		var baseUrl = 'http://swapi.co/api/',
				skywalkerFilms = [],
				deferred = $q.defer();

		// make get request to baseUrl and add 'people/' to the url then return resut as people
		$http.get(baseUrl+'people/').then(function(people){
			// set skywalker to first item in people.data.results array
			var skywalker = people.data.results[0];
			// loop through skywalker's films
			skywalker.films.forEach(function(film) {
			// make a get request to each film's url
			$http.get(film)
				.then(function(filmResult) {
					// when film result is returned, push it into the skywalkerFilms array
					skywalkerFilms.push(filmResult.data);
				});
			});
			// when loops completes, set skywalker.films to skywalkerFilms array
			skywalker.films = skywalkerFilms;
			// resolve the promise with skywalker.films (this is what gets returned in the controller)
			deferred.resolve(skywalker.films);
		}).catch(function (error) {
			// catch any errors and invoke callback to return the error
			error.message = "Sorry, your request failed";
			// use .reject() to send the error to the controller
			return deferred.reject(error);
		});
		// return the promise
		return deferred.promise;
	};

	this.itunes = function(name) {
		return $http.jsonp('https://itunes.apple.com/search?term='+name+'&callback=JSON_CALLBACK').then(function(results){
			// debugger
		});
	};

}]);