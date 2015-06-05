onready-dispatcher
==================

Event dispatcher with `on()`, `trigger()`, and `onready()`.  

***onready*** **behaviour:**  
- Before event: register callback.  
- On event: run all pending callbacks.  
- After event: run callback immediately with cached arguments.  

`alias()` is also available for multiple event names (for example, when supporting a legacy event name).  


**EXAMPLE:**

```javascript
var event = new ReadyDispatcher();

// This will run when the event fires
event.onready("init", function(){
	console.log('initialised!');
});

setTimeout(function(){
	event.trigger('init');
}, 1000);

setTimeout(function(){

	// This will run immediately
	event.onready("init", function(){
		console.log('initialised!');
	});

}, 2000);
```

**NOTE:**  
Arguments supplied to trigger() are cached and supplied to subsequent callbacks.  
Calling trigger() again will just update the arguments for any future callbacks.  
