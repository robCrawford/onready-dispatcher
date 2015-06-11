/**
 * Event dispatcher with onready().
 * @namespace ReadyDispatcher
 * @constructor
 */
window.ReadyDispatcher = (function() {

    /** 
     * @constructor
     */
    function ReadyDispatcher() {

        // Pending callbacks
        // format: {eventLabel: [ function(){}, ... ]}
        this.callbacks = {
            on: {},
            onready: {}
        };

        // Label state for callbacks registered via onready()
        // format: {eventLabel: true}
        this.isReady = {};

        // Cached responses
        // format: {eventLabel: {["arg0", ...], ... }}
        this.responses = {};

        // Any aliases from one label to another
        // format: {"aliased label": "destination label"}
        this.aliases = {};
    }

    ReadyDispatcher.prototype = {

        /** 
         * Register a callback for an event label.
         * @memberof! ReadyDispatcher
         * @param {string} label - Name of the event
         * @param {function} callback - Called when the event is triggered
         */
        on: function(label, callback) {
            label = this.getLabel(label);
            (this.callbacks.on[label] || (this.callbacks.on[label] = [])).push(callback);
        },

        /**
         * Register an onready callback for an event label.
         * NOTE: if event has passed, callback will run immediately with cached data.
         * @memberof! ReadyDispatcher
         * @param {string} label - Name of the event
         * @param {function} callback - Called when the event is triggered
         */
        onready: function(label, callback) {
            label = this.getLabel(label);

            // If event has passed, run callback immediately with cached data
            if (this.isReady[label]) {
                callback.apply(null, this.responses[label]);
            }
            // Event pending - store callback
            else {
                this.isReady[label] = false; // Create entry in isReady
                (this.callbacks.onready[label] || (this.callbacks.onready[label] = [])).push(callback);
            }
        },

        /**
         * Trigger callbacks for an "on" event label.
         * @memberof! ReadyDispatcher
         * @param {string} label - Name of the event
         * @param {*} arguments - Arguments passed into callbacks
         */
        trigger: function(label /*, arguments */ ) {
            label = this.getLabel(label);
            var queue = (this.callbacks.on[label] || []).concat(this.callbacks.onready[label]),
                responseArgs = [].slice.call(arguments, 1);

            // Run callbacks
            for (var i = 0, len = queue.length; i < len; i++) {
                var fn = queue[i];
                if (typeof fn === "function") {
                    fn.apply(null, responseArgs);
                }
            }

            // If entry from onready() for label
            if (label in this.isReady) {
                this.isReady[label] = true; // Flag as triggered
                this.responses[label] = responseArgs; // Cache response
                delete this.callbacks.onready[label]; // Remove callbacks
            }
        },

        /**
         * Alias one label to another.
         * @memberof! ReadyDispatcher
         * @param {object} map - {aliased label: destination label, ...}
         */
        alias: function(map) {
            for (var p in map) {
                if (map.hasOwnProperty(p)) {
                    this.aliases[p] = map[p];
                }
            }
        },

        /**
         * Converts any aliased labels.
         * @memberof! ReadyDispatcher
         * @param {string} label - Name of the event
         */
        getLabel: function(label) {
            return this.aliases[label] || label;
        }

    }

    return ReadyDispatcher;

})();
