/*
  Event dispatcher with onready(), similar to `$.ready()`.

  onready behaviour:
    Prior to event, callbacks are queued
    On event, queued callbacks run in order
    After event, new callbacks run immediately
  
  NOTE:
  Arguments supplied to trigger() are cached and supplied to subsequent callbacks.
  Calling trigger() again will just update the arguments for any future callbacks.
*/
window.ReadyDispatcher = (function(){
    
    function ReadyDispatcher(){
        //Caches
        this.callbacks = {}; //Pending callbacks, format: {eventLabel: [ function(){}, ... ]}
        this.isReady = {}; //Label state for callbacks registered via onready(), format: {eventLabel: true}
        this.responses = {}; //Cached responses, format: {eventLabel: { ["arg0", ...], ... }}
        this.aliases = null; //Any aliases from one label to another, format: {"aliased label": "destination label"}
    }

    ReadyDispatcher.prototype = {

        on: function(label, callback){
        //Register a callback for an event label
            label = this.getLabel(label);
            (this.callbacks[label] || (this.callbacks[label] = [])).push(callback);
        },

        onready: function(label, callback){
        //Register an onready callback for an event label
        //NOTE: if event has passed, callback will run immediately with cached data
            label = this.getLabel(label);

            //If event has passed, run callback immediately with cached data
            if(this.isReady[label]){
                callback.apply(null, this.responses[label]);
            }
            //Event pending - store callback
            else{
                this.isReady[label] = false; //Create entry in isReady
                this.on(label, callback);
            }
        },

        trigger: function(label /*, arguments */){
        //Trigger callbacks for an "on" event label
        //All arguments after first are passed into callbacks
            label = this.getLabel(label);
            var queue = this.callbacks[label],
                responseArgs = [].slice.call(arguments, 1);

            //Run callbacks
            if(queue){
                for(var i=0,len=queue.length;i<len;i++){
                    var fn = queue[i];
                    if(typeof fn === "function"){
                        fn.apply(null, responseArgs);
                    }
                }
            }

            //If entry from onready() for label
            if(label in this.isReady){
                this.isReady[label] = true; //Flag as triggered
                this.responses[label] = responseArgs; //Cache response
                delete this.callbacks[label]; //Remove callbacks
            }
        },

        alias: function(map){
        //Alias one label to another
        //`map` is format: {aliased label: destination label, ...}
            for(var p in map){
                if(map.hasOwnProperty(p)){
                    (this.aliases || (this.aliases={}))[p] = map[p];
                }
            }
        },

        getLabel: function(label){
        //Converts any aliased labels
            return (this.aliases && this.aliases[label]) || label;
        }
    }

    return ReadyDispatcher;

})();
