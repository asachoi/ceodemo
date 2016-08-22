/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var pos = pos || {};
var data = data || {};

(function(pos, $) {
	'use strict';
	/**
	 * 
SVGDreamItem component
	 *  This class controll the changing svg item and pausing svg animation or have one static image when user moving
	 */
	function 
SVGDreamItem(element, options) {
		this.initElemen(element, options);
	}

	
SVGDreamItem.VERSION  = '3.3.1';

	
SVGDreamItem.DEFAULTS = {
		// no defaults for now
		isDebug: true,
		isMobileWebSimulator: false
	};

	
SVGDreamItem.SVG_DREAM_BUYING_A_HOUSE_CLASS  = "svg-dream-buying-a-house";
	
SVGDreamItem.SVG_DREAM_GETTING_MARRIED_CLASS = "svg-dream-getting-married";
	
SVGDreamItem.SVG_DREAM_HAVING_A_BABY_CLASS = "svg-dream-having-a-baby";
	
SVGDreamItem.SVG_DREAM_PLAN_FOR_EDUCATION_CLASS = "svg-dream-plan-for-education";

SVGDreamItem.SVG_DREAM_BUYING_A_NEW_CAR_CLASS = "svg-dream-buying-a-car";

SVGDreamItem.SVG_DREAM_PLAN_FOR_VACATION_CLASS = "svg-dream-going-on-holiday";

SVGDreamItem.SVG_DREAM_EARLY_RETIREMENT_CLASS = "svg-dream-early-retirement";
	
SVGDreamItem.prototype = {
		constructor: SVGDreamItem,

		dreamType: null,

		//this method must call after $el is added into DOM
		initialize: function (dreamType) {
			
			this.dreamType = dreamType;
			this._addClassByDreamType();

			pos.SVGItem.prototype.initialize.call(this);
		},		

		_addClassByDreamType: function() {
			var className = '';
			switch(this.dreamType) {
				case data.DreamData.DREAM_BUYING_A_HOUSE:
					className = SVGDreamItem.SVG_DREAM_BUYING_A_HOUSE_CLASS;
					break;
				case data.DreamData.DREAM_GETTING_MARRIED:
					className = SVGDreamItem.SVG_DREAM_GETTING_MARRIED_CLASS;
					break;
				case data.DreamData.DREAM_HAVING_A_BABY:
					className = SVGDreamItem.SVG_DREAM_HAVING_A_BABY_CLASS;
					break;
				case data.DreamData.DREAM_PLAN_FOR_EDUCATION:
					className = SVGDreamItem.SVG_DREAM_PLAN_FOR_EDUCATION_CLASS;
					break;
				case data.DreamData.DREAM_BUYING_A_NEW_CAR:
					className = SVGDreamItem.SVG_DREAM_BUYING_A_NEW_CAR_CLASS;
					break;
				case data.DreamData.DREAM_PLAN_FOR_VACATION:
					className = SVGDreamItem.SVG_DREAM_PLAN_FOR_VACATION_CLASS;
					break;
				case data.DreamData.DREAM_EARLY_RETIREMENT:
					className = SVGDreamItem.SVG_DREAM_EARLY_RETIREMENT_CLASS;
					break;	
			}

			this.$el.addClass(className);
		},


		_getSVGTemplate: function() {
			return data.SVGDataConfig.getSVGTemplateForHouse(this.dreamType);
		},

		getHouseType : function() {
			return this.dreamType;
		}

	};

	var temporaryObj = SVGDreamItem.prototype;
	
	SVGDreamItem.prototype = Object.create(pos.SVGItem.prototype);
	$.extend(SVGDreamItem.prototype, temporaryObj);

	// exports
	pos.SVGDreamItem = SVGDreamItem;

}(pos, jQuery));