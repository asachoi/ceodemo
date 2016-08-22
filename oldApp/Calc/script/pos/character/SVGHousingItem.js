/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var pos = pos || {};
var data = data || {};

(function(pos, $, Templates) {
	'use strict';
	/**
	 * SVGHousingItem component
	 *  This class controll the changing svg item and pausing svg animation or have one static image when user moving
	 */
	function SVGHousingItem(element, options) {
		this.initElemen(element, options);
	}

	SVGHousingItem.VERSION  = '3.3.1';

	SVGHousingItem.DEFAULTS = {
		// no defaults for now
		isDebug: true,
		isMobileWebSimulator: false
	};

	SVGHousingItem.HOUSE_MORTGAGE_CLASS  = "svg-housing-mortgage";
	SVGHousingItem.HOUSE_FULLY_OWNED_CLASS = "svg-housing-fully-owned";
	SVGHousingItem.HOUSE_RENTED_CLASS = "svg-housing-rented";
	SVGHousingItem.HOUSE_LIVING_WITH_FAMILY_CLASS = "svg-housing-living-with-family";

	SVGHousingItem.HOUSE_MORTGAGE_CLASS_TEMPLATE  = "housing-mortage";
	SVGHousingItem.HOUSE_FULLY_OWNED_CLASS_TEMPLATE = "housing-fully-owned";
	SVGHousingItem.HOUSE_RENTED_CLASS_TEMPLATE = "housing-rented";
	SVGHousingItem.HOUSE_LIVING_WITH_FAMILY_CLASS_TEMPLATE = "housing-living-with-family";


	SVGHousingItem.getTemplateNameByHouseType = function (houseType) {
		var resultTemplate = "";
		switch(houseType) {
			case data.HousingData.HOUSE_MORTGAGE:
				resultTemplate = SVGHousingItem.HOUSE_MORTGAGE_CLASS_TEMPLATE;
				break;
			case data.HousingData.HOUSE_FULLY_OWNED:
				resultTemplate = SVGHousingItem.HOUSE_FULLY_OWNED_CLASS_TEMPLATE;
				break;
			case data.HousingData.HOUSE_RENTED:
				resultTemplate = SVGHousingItem.HOUSE_RENTED_CLASS_TEMPLATE;
				break;
			case data.HousingData.HOUSE_LIVING_WITH_FAMILY:
				resultTemplate = SVGHousingItem.HOUSE_LIVING_WITH_FAMILY_CLASS_TEMPLATE;
				break;
		}
		return resultTemplate;
	};



	SVGHousingItem.prototype = {
		constructor: SVGHousingItem,

		houseType: null,

		//this method must call after $el is added into DOM
		initialize: function (houseType) {
			this.houseType = houseType;
			this._addClassByHouseType();

			pos.SVGItem.prototype.initialize.call(this);
		},

		_addClassByHouseType: function() {
			var className = data.HousingData.HOUSE_MORTGAGE_CLASS;
			switch(this.houseType) {
				case data.HousingData.HOUSE_MORTGAGE:
					className = SVGHousingItem.HOUSE_MORTGAGE_CLASS;
					break;
				case data.HousingData.HOUSE_FULLY_OWNED:
					className = SVGHousingItem.HOUSE_FULLY_OWNED_CLASS;
					break;
				case data.HousingData.HOUSE_RENTED:
					className = SVGHousingItem.HOUSE_RENTED_CLASS;
					break;
				case data.HousingData.HOUSE_LIVING_WITH_FAMILY:
					className = SVGHousingItem.HOUSE_LIVING_WITH_FAMILY_CLASS;
					break;
			}

			this.$el.addClass(className);
		},

		_getSVGTemplate: function() {
			//return data.SVGDataConfig.getSVGTemplateForHouse(this.houseType);
			console.log("==this.houseType " + this.houseType);
			var houseSVGTemplate = SVGHousingItem.getTemplateNameByHouseType(this.houseType);
			console.log("==houseSVGTemplate " + houseSVGTemplate);
			if (houseSVGTemplate !== "") {
				return Templates.getTemplate(houseSVGTemplate);
			}

			return "";
		},

		getHouseType : function() {
			return this.houseType;
		}

	};

	var temporaryObj = SVGHousingItem.prototype;
	SVGHousingItem.prototype = Object.create(pos.SVGItem.prototype);
	$.extend(SVGHousingItem.prototype, temporaryObj);

	// exports
	pos.SVGHousingItem = SVGHousingItem;

}(pos, jQuery, app.Templates));