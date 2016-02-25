# APIs
API stands for Application Program Interface. It's a pretty broad term, but we'll be dealing specifically with third-party web API's that return JSON, and eventually even building our own APIs with Express.

An API (in this instance) is simply a server/website that has **end points** (urls) that return data to us in the form of JSON.

Usually (hopefully) an API's end points follow RESTful architecture. That would look something like this:

```
http://api.example.com/resources/14
```

The resource name is pluralized, then the resource itself can be accessed by its ID.

Once we get that data back we can do whatever we want with it. In today's example we'll be using the Star Wars API to view all of the Star Wars films that Luke Skywalker is in.

We'll be using Angular's $http service, which returns a promise, so let's talk a little about what promises are and how they are going to help us in today's app.

# Promises

A promise is an object that represents an asynchronous function that is currently being executed.
This basically means that until the function is done doing whatever it needs to do (*or getting whatever it needs to get in the case of $http.get()*) we can still be doing other stuff. Our code isn't being blocked by a function that it's waiting on to finish. Once the async function is completed, **then** it returns something, or in the event of an error, we **catch** the error and return that instead.

This is useful because when we make a GET request to a third-party API, we don't know how long it will take for the data we requested to get returned. So while the request is being made, we can be running other code in our app and not waiting around for the response.

Angular gives us the **$q** library which allows us to make promises from scratch and handle their resolution or rejection, in other words, tell the code what to do in the event of an error or success.

## How to make a promise with $q

```
var deferred = $q.defer();
```
Simple right? Now we have a deferred object with a promise key and we can return that promise after we're done dealing with the async code.

Still confused? Let's look at some service code that deals with making a couple nested $http calls to the Star Wars API:

```
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

```

Notice how at the very bottom of the **getFilms** function we return **deferred.promise**?
This is how we get the promise back to the controller that will be invoking this service's **getFilms()** function. The other thing to take note of is where we used **deferred.resolve()** to pass in the data that we want returned to the controller whenever **getFilms** is invoked. That data is available to us as the result of the callback function that gets passed into the **.then** method that we call on our promise in the controller.

```
SWService.getFilms()
	.then(function(films) {
		$scope.films = films;
	}).catch(function (error) {
		$scope.error = error.message;
	});
```
So, because we returned **deferred.promise** at the end of our **getFilms** function, that means **getFilms** returns a promise (**makes sense, right?**)

So if **getFilms** returns a promise, then we are able to call the **.then** and **.catch** methods on it.

**.then** allows us to invoke a callback that takes the returned data as an argument and **.catch** allows us to invoke a separate callback that takes the error as an argument. Only one of these two will be called, because if **.then** is called then there are now errors and **.catch** won't be needed, and vice versa.

## Why is this useful? 

Aside from the obvious of letting us run other code instead of waiting around for a function to finish executing, it's nice to have the **.then** and **.catch** methods because we can **chain** them together which makes our code a lot neater and helps us control program flow.

An example of this would be:

```
$http.get('someUrlHere')
  .then(someCallback)
  .then(anotherCallback)
  .then(andAnotherCallback)
  .catch(errorCallback)
```

That's a lot neater than your typical pyramid of callbacks that you see when someone is trying to write some asynchronous code.
Here's an example of what developers like to call "callback hell":

```
asyncCall(function(err, data1){
    if(err) return callback(err);       
    anotherAsyncCall(function(err2, data2){
        if(err2) return calllback(err2);
        oneMoreAsyncCall(function(err3, data3){
            if(err3) return callback(err3);
            // are we done yet?
        });
    });
});
```

And that's not even that bad, it can get way worse. See [callback hell](http://callbackhell.com/) for more on callback hell and how to avoid it (*using promises is just one way and it works especially well when dealing with $http*).

# CORS (Cross-origin resource sharing)

A resource makes a **cross-origin HTTP request** when it requests a resource from a different domain than the one which the first resource itself serves. In some cases you won't be allowed  to get resources from a certain server because the server isn't setup to allow access from all origins. When this happens you'll see an error like this one in your browser console:

```
XMLHttpRequest cannot load https://itunes.apple.com/search?term=bob%20marley. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://127.0.0.1:8080' is therefore not allowed access.
```

We can use [JSONP](https://en.wikipedia.org/wiki/JSONP) to get around CORS restrictions. JSONP (JSON with Padding) is a technique used by web developers to overcome the cross-domain restrictions imposed by browsers to allow data to be retrieved from systems other than the one the page was served by.

To do this we simply change our **$http** request from a **.get** to a **.jsonp** and add **&callback=JSON_CALLBACK** to the end of our request url. Like so:

```
return $http.jsonp('yourApiUrlHere'+searchTerm+'&callback=JSON_CALLBACK')
```

Checkout the source code from today's app to see this in action with iTunes.

# UI-Grid

Angular has a sweet grid system for displaying data easily. You'll be using it in your iTunes app this evening, so checkout the docs and run through the tutorial to get up and running.

*Note: this is the new and improved version of NG-Grid*

[Angular UI-Grid Tutorial](http://ui-grid.info/docs/#/tutorial/101_intro)

### CDN assets: 

- **CSS**: https://cdn.rawgit.com/angular-ui/bower-ui-grid/master/ui-grid.min.css
- **JS**: https://cdn.rawgit.com/angular-ui/bower-ui-grid/master/ui-grid.min.js



# Resources
- [Using promises with $q to handle async calls](http://chariotsolutions.com/blog/post/angularjs-corner-using-promises-q-handle-asynchronous-calls/)
- [$q library example](https://www.youtube.com/watch?v=wA0gZnBI8i4)
- [Callback Hell](http://callbackhell.com/)
- [REST](https://en.wikipedia.org/wiki/Representational_state_transfer)
- [JSONP](https://en.wikipedia.org/wiki/JSONP)
