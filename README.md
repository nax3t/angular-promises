# Promises

A promise is an object that represents an asynchronous function that is currently being executed.
This basically means that until the function is done doing whatever it needs to do (*or getting whatever it needs to get in the case of $http.get()*) we can still be doing other stuff. Our code isn't being blocked by a function that it's waiting on to finish.

This is useful because when we make a GET request to a third-party API, we don't know how long it will take for the data we requested to get returned to us.

Promises also allow us to easily handle errors in the event that the async code didn't work (*e.g., a bad request to an API or a server timeout, etc.*)

Angular gives us the **$q** library which allows us to make promises from scratch and handle their resolution or rejection.

## How to make a promise with $q

```
var deferred = $q;
```
Simple right? Now we have 

# Resources
- [Using promises with $q to handle async calls](http://chariotsolutions.com/blog/post/angularjs-corner-using-promises-q-handle-asynchronous-calls/)
- [$q library example](https://www.youtube.com/watch?v=wA0gZnBI8i4)
- [Callback Hell](http://callbackhell.com/)
