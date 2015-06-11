
var _event = new ReadyDispatcher();

describe("Event tests", function(){

	it("Should run pending on() callbacks when event is triggered", function(done){

		var callbacksCount = 0,
			triggerCount = 0;

		_event.on("testEvent1", function(){
			callbacksCount++;
		});
		_event.on("testEvent1", function(){
			callbacksCount++;
		});
		_event.on("testEvent1", function(){
			expect(callbacksCount).toBe(2);
			expect(triggerCount).toBe(1);
			done();
		});
		_event.trigger("testEvent1", triggerCount++);

	});

	it("Should run on() callbacks each time event is triggered, with new data", function(done){

		var callbacksCount = 0;

		// Ensure no affect from onready()
		_event.onready("testEvent2", function(){});

		//Test alias
		_event.alias({"testEvent2": "eventAlias"});

		_event.on("testEvent2", function(num){
			callbacksCount++;
			expect(callbacksCount).toEqual(num);
		});

		_event.trigger("testEvent2", 1);
		_event.trigger("eventAlias", 2);
		_event.trigger("testEvent2", 3);
		done();

	});

	it("Should run pending onready() callbacks when event is triggered", function(done){

		var callbacksCount = 0,
			triggerCount = 0;

		// Ensure no affect from on()
		_event.on("testEvent3", function(){});

		_event.onready("testEvent3", function(){
			callbacksCount++;
		});
		_event.onready("testEvent3", function(){
			callbacksCount++;
		});
		_event.onready("testEvent3", function(){
			expect(callbacksCount).toBe(2);
			expect(triggerCount).toBe(1);
			done();
		});
		_event.trigger("testEvent3", triggerCount++);

	});

	it("Should only run onready() callbacks first time event is triggered", function(done){

		var callbacksCount = 0;

		_event.onready("testEvent4", function(){
			callbacksCount++;
		});

		_event.trigger("testEvent4");
		_event.trigger("testEvent4");
		_event.trigger("testEvent4");

		expect(callbacksCount).toEqual(1);
		done();

	});

	it("Should then run onready() callbacks immediately, with cached data", function(done){

		var callbacksCount = 0;

		_event.onready("testEvent5", function(num){
			callbacksCount++;
			expect(num).toEqual(1);
		});

		_event.trigger("testEvent5", 1);

		_event.onready("testEvent5", function(num){
			callbacksCount++;
			expect(num).toEqual(1); // Should still be cached data
		});

		_event.trigger("testEvent5", 7); // Should update response

		_event.onready("testEvent5", function(num){
			callbacksCount++;
			expect(num).toEqual(7); 
		});

		expect(callbacksCount).toEqual(3);
		done();

	});

});
