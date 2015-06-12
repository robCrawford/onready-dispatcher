onready-dispatcher
==================
*(No dependencies, 1kB minified)*  

Event dispatcher with `on()`, `off()`, `trigger()`, and `onready()`.  

- `on` and `off` have standard pub/sub behaviour.  
- `onready` is useful when you want the same resolution *any time* a listener is created.  
For example, to delay an API callback until some data is ready, or respond immediately any time after.  

***onready*** **behaviour:**  
- Before event: register callback.  
- On event: run all pending callbacks.  
- After event: run callback immediately with cached arguments.  

`alias()` is also available for multiple event names (for example, when supporting a legacy event name).  


**EXAMPLE:**

```javascript
var event = new ReadyDispatcher();

// This will run when the event fires
event.onready("init", function(timestamp) {
	console.log(timestamp);
});

setTimeout(function() {
	event.trigger('init', Date.now());
}, 1000);

setTimeout(function() {

	// This will run immediately with cached arguments
	event.onready("init", function(timestamp) {
		console.log(timestamp);
	});

}, 2000);
```
