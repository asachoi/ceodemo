/* © 2014 Aleph-labs.com
 * @author Thang Kieu
 *
 */
// namespace
var pos = pos || {};

(function(pos, $) {
	'use strict';

	/**
	 * SwiperCarousel component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function SwiperCarousel(element, options) {
		this.$el  = $(element);
		this.el = this.$el[0];
		// this.$swipe = this.$e
		this.swipeInstance = this.$el.find('.swipe-panel');
		this.$items = this.$el.find('.swiper-slide');
		this.$activeBar = this.$el.find('.active-panel');
		this.length = this.$items.length;

		// store this instance to data object so that I can retrieve it later
		this.$el.data('swipePanel', this);
		//
		this.options   = $.extend({}, SwiperCarousel.DEFAULTS, options);

		this.init();
		this.bindEvents();
	}

	SwiperCarousel.DEFAULTS = {
		// no defaults for now
		showBarInLast: false,
		invisibleArrow: false,
		isSwipe: true
	};


	SwiperCarousel.prototype = {
		constructor: SwiperCarousel,

		$el: null,
		el: null,
		$checkbox: null,

		init: function() {
			var self = this;
			var onlyExternal = this.options.onlyExternal || false;

			this.swipeInstance = this.$el.swiper({
	            //Your options here:
	        	slidesPerView: 'auto',
	        	loop: false,
	        	onlyExternal: onlyExternal,
	        	onTouchEnd: function(swiper) {
	                self.slideTouchEnd(swiper.activeIndex);
	            },
	            onSlideChangeEnd: function(swiper) {
	                self.slideTouchEnd(swiper.activeIndex);
	            }
	        });
		},

		bindEvents: function() {
			var self = this;

			// make use of the checkbox toggle state
			this.$el.on('click', '.icon-switch-right', function() {
				// var action = self.getAction(this);

				// self.doAction(action);
				self.swipeInstance.swipeNext();
			});

			// show footer menu
			this.$el.on('click', '.icon-switch-left', function() {
				//
				self.swipeInstance.swipePrev();
			});
		},

		slideTouchEnd: function(index) {
			var firstVisibleIndex = index; // this.swipeInstance.activeIndex;
			var lastVisibleIndex = firstVisibleIndex + this.swipeInstance.visibleSlides.length;
			// first item
			if (firstVisibleIndex === 0) {
				this.$el.find('.icon-switch-left').addClass('hidden');
			} else if (lastVisibleIndex === this.length) {
				this.$el.find('.icon-switch-right').addClass('hidden');
			} else {
				this.$el.find('.icon-switch').removeClass('hidden');
			}
		}
	};

	// exports
	pos.SwiperCarousel = SwiperCarousel;
}(pos, jQuery));