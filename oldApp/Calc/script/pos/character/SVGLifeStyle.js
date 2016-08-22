/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var pos = pos || {};
var data = data || {};

(function(pos, $) {
	'use strict';
	/**
	 * SVGLifeStyle component
	 *  This class controll the changing svg item and pausing svg animation or have one static image when user moving
	 */
	function SVGLifeStyle(element, options) {
		this.initElemen(element, options);
	}

	SVGLifeStyle.VERSION  = '3.3.1';

	SVGLifeStyle.DEFAULTS = {
		// no defaults for now
		isDebug: true,
		isMobileWebSimulator: false
	};

	SVGLifeStyle.BASIC_CLASS  = "svg-retirement-life-style-basic";
	SVGLifeStyle.MODERATE_CLASS = "svg-retirement-life-style-moderate";
	SVGLifeStyle.CARE_FREE_CLASS = "svg-retirement-life-style-care-free";
	SVGLifeStyle.LUXURY_CLASS = "svg-retirement-life-style-luxury";

	SVGLifeStyle.prototype = {
		constructor: SVGLifeStyle,

		lifeType: null,

		//this method must call after $el is added into DOM
		initialize: function (lifeType) {
			this.lifeType = lifeType;
			this._addClassByHouseType();

			pos.SVGItem.prototype.initialize.call(this);
		},

		_addClassByHouseType: function() {
			var className = data.HousingData.HOUSE_MORTGAGE_CLASS;
			switch(this.lifeType) {
				case data.retirement.RetirementLifeStyleData.TYPE_BASIC:
					className = SVGLifeStyle.BASIC_CLASS;
					break;
				case data.retirement.RetirementLifeStyleData.TYPE_MODERATE:
					className = SVGLifeStyle.MODERATE_CLASS;
					break;
				case data.retirement.RetirementLifeStyleData.TYPE_CARE_FREE:
					className = SVGLifeStyle.CARE_FREE_CLASS;
					break;
				case data.retirement.RetirementLifeStyleData.TYPE_LUXURY:
					className = SVGLifeStyle.LUXURY_CLASS;
					break;
			}

			this.$el.addClass(className);
		},

		getLifeType : function() {
			return this.lifeType;
		}

	};

	var temporaryObj = SVGLifeStyle.prototype;
	SVGLifeStyle.prototype = Object.create(pos.SVGItem.prototype);
	$.extend(SVGLifeStyle.prototype, temporaryObj);

	// exports
	pos.SVGLifeStyle = SVGLifeStyle;

}(pos, jQuery));