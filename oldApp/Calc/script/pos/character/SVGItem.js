/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var pos = pos || {};
var data = data || {};
var mixin=  mixin || {};

(function(pos, $, Swipable) {
	'use strict';
	/**
	 * SVGItem component
	 *  This class controll the changing svg item and pausing svg animation or have one static image when user moving
	 */
	function SVGItem(element, options) {
		this.initElemen(element, options);
	}

	SVGItem.VERSION  = '3.3.1';

	//constant for long press detection
    SVGItem.LONG_PRESS_MAX_TIME = 250;
    SVGItem.LONG_PRESS_MAX_DISTANCE = 100000;  //mean we dont care about the max distance


	SVGItem.DEFAULTS = {
		// no defaults for now
		isDebug: true,
		isMobileWebSimulator: false,
		allowedSwipeDirection: ["up","down"]
	};

	SVGItem.STATIC_IMAGE = "static_image";
	SVGItem.SVG_IMAGE = "svg_image";

	SVGItem.prototype = {
		constructor: SVGItem,

		$el: null,
		el: null,

		currentStatus: null,

		initElemen: function(element, options) {
			if (element) {
				this.$el  = $(element);
			} else {
				this.$el = $(SVGItem.htmlTemplate);
			}

			this.el = this.$el[0];

			this.options   = $.extend({}, SVGItem.DEFAULTS, options);
			
			//initialize swipe	
			this.initSwipe(this.options);
		},

		//this method must call after $el is added into DOM
		initialize: function () {
			this._initStaticImage();
			this._initSVGItem();

			this.updateLayout(SVGItem.STATIC_IMAGE);
		},

		_initStaticImage: function() {

		},

		_initSVGItem: function() {
			var svgContainer = this.$el.find(".svg-image");
			var svgItem = this._getSVGTemplate();
			if (svgItem !== "" || svgItem !== null) {
				svgContainer.append(svgItem);
			}
		},

		_getSVGTemplate: function() {
			return "";
		},

		_invisibleAll: function() {
			var imageItem = this.$el.find(".static-image");
			var svgContainer = this.$el.find(".svg-image");

			imageItem.hide();
			svgContainer.hide();
		},

		updateLayout: function(status) {
			var imageItem = this.$el.find(".static-image");
			var svgContainer = this.$el.find(".svg-image");
			switch(status) {
				case SVGItem.STATIC_IMAGE:
					this._invisibleAll();
					imageItem.show();

					this.currentStatus = status;
					break;
				case SVGItem.SVG_IMAGE:
					if (this.$el.find("svg").length > 0) {
						this._invisibleAll();
						svgContainer.show();
					}

					this.currentStatus = status;
					break;
			}
		},

		pauseSVGAnimation: function() {
			if (this.currentStatus === SVGItem.SVG_IMAGE) {
				var svgItem = this.$el.find("svg")[0];
				svgItem.pauseAnimations();
			}
		},

		resumeSVGAnimation: function() {
			if (this.currentStatus === SVGItem.SVG_IMAGE) {
				var svgItem = this.$el.find("svg")[0];
				svgItem.unpauseAnimations();
			}
		},

		log: function(msg) {
			if (this.options.isDebug) {
				console.log(msg);
			}
		}

	};

	SVGItem.htmlTemplate = "<div class='svg-item'>" +
						"<div class='static-image'>" +
						"</div>" +
						"<div class='svg-image'>"+
						"</div>" +
					"</div>";

	// exports
	pos.SVGItem = SVGItem;

	//mixin initialization
	mixin.Mixin.addMixin(pos.SVGItem, mixin.Swipable);


}(pos, jQuery, mixin));