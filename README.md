# onready-dispatcher
=======================

Event dispatcher with `onready()`, similar to `$.ready()`.

**onready behaviour:**  
- Before event: register callback (same as `event.once()`).  
- On event: run all pending callbacks.  
- After event: run callback immediately with cached arguments.  

NOTE:  
Arguments supplied to trigger() are cached and supplied to subsequent callbacks.  
Calling trigger() again will just update the arguments for any future callbacks.  
