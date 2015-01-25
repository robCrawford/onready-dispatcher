
var _event = new ReadyDispatcher();

describe("Event tests", function(){

	it("Should run pending on() callbacks when event is triggered", function(done){

		var callbacksCount = 0,
			triggerCount = 0;

		_event.on("testEvent1", function(count){
			callbacksCount++;
		});
		_event.on("testEvent1", function(count){
			callbacksCount++;
		});
		_event.on("testEvent1", function(count){
			expect(callbacksCount).toBe(2);
			expect(triggerCount).toBe(1);
			done();
		});
		_event.trigger("testEvent1", triggerCount++);

	});

	it("Should run on() callbacks each time event is triggered, with new data", function(done){

		var callbacksCount = 0;

		_event.on("testEvent2", function(count){
			callbacksCount++;
			expect(callbacksCount).toEqual(count);
		});

		_event.trigger("testEvent2", 1);
		_event.trigger("testEvent2", 2);
		_event.trigger("testEvent2", 3);
		done();

	});

	it("Should run pending ready() callbacks when event is triggered", function(done){

		var callbacksCount = 0,
			triggerCount = 0;

		_event.onready("testEvent3", function(count){
			callbacksCount++;
		});
		_event.onready("testEvent3", function(count){
			callbacksCount++;
		});
		_event.onready("testEvent3", function(count){
			expect(callbacksCount).toBe(2);
			expect(triggerCount).toBe(1);
			done();
		});
		_event.trigger("testEvent3", triggerCount++);

	});

	it("Should only run ready() callbacks first time event is triggered", function(done){

		var callbacksCount = 0;

		_event.onready("testEvent4", function(count){
			callbacksCount++;
		});

		_event.trigger("testEvent4", 1);
		_event.trigger("testEvent4", 2);
		_event.trigger("testEvent4", 3);

		expect(callbacksCount).toEqual(1);
		done();

	});

	it("Should then run ready() callbacks immediately, with cached data", function(done){

		var callbacksCount = 0;

		_event.onready("testEvent5", function(count){
			callbacksCount++;
			expect(count).toEqual(1);
		});

		_event.trigger("testEvent5", 1);

		_event.onready("testEvent5", function(count){
			callbacksCount++;
			expect(count).toEqual(1);
		});

		_event.trigger("testEvent5", 7); //Should update response

		_event.onready("testEvent5", function(count){
			callbacksCount++;
			expect(count).toEqual(7); //Should still be cached data
		});

		expect(callbacksCount).toEqual(3);
		done();

	});

});
