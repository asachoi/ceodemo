/* © 2015 Aleph-labs.com
 * @author Ernesto Pile
 */
// namespace
var mixin = mixin || {};

(function(mixin, $) {
	'use strict';

	/**
	 * Swipable Mixin. Gives components ability to be swiped
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function Swipable() {
		this.initDefault();
	}

	Swipable.VERSION  = '0.0.1';

	Swipable.DEFAULTS = {
		threshold: 10,
		maxTimeThreshold: 200,
		allowedSwipeDirection:null
	};

	Swipable.EVENT_START_DRAG = "swipable_event_start_drag";
	Swipable.EVENT_DRAGING = "swipable_event_dragged";
	Swipable.EVENT_END_DRAG = "swipable_end_drag";

	Swipable.EVENT_SWIPE = "swipable_event_swipe";

	//constant for long press detection
	Swipable.LONG_PRESS_MAX_TIME = 250;
	Swipable.LONG_PRESS_MAX_DISTANCE = 100000;	//mean we dont care about the max distance

	//
	//declare methods to be mixed to the receiving class
	//
	Swipable.prototype = {

		/**
		* initialize ability to swipe. This must be activated in the receiving class
		*/	
		initSwipe:function(options){
			var self = this;
			var options = $.extend({}, Swipable.DEFAULTS, options);

			if(this.$el){
				
				//NOTE:We need jquery swipe touch for this element
				this.$el.swipe({
					//Generic swipe handler for all directions
					swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
						
						//console.log("Swipable:swipe:", self.options.allowedSwipeDirection, direction);					
						//restrict swipe vertical directions only
						if( $.isArray(self.options.allowedSwipeDirection) && ($.inArray(direction,self.options.allowedSwipeDirection) == -1)){
							return false;
						}

						self.$el.trigger(Swipable.EVENT_SWIPE, [self]);
					},
					threshold:  options.threshold,
					maxTimeThreshold: options.maxTimeThreshold
				});

				this.enableSwipe();
			}
			else{
				throw new Error('Swipable: element not existing yet when swipe event is initialized.');
			}
		},

		enableSwipe:function(){
			this.$el.swipe("enable");
		},

		disableSwipe:function(){
			this.$el.swipe("disable");
		}

	}

	
	// exports
	mixin.Swipable = Swipable;
}(mixin, jQuery));