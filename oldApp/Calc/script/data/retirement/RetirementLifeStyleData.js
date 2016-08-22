/* © 2014 Aleph-labs.com
 * @author Phuong Vo
 */
// namespace
var data = data || {};
data.retirement = data.retirement || {};

(function(retirement) {
	'use strict';

	function RetirementLifeStyleData() {
		this.initialize();
	}

	RetirementLifeStyleData.VERSION  = '3.3.1';

	RetirementLifeStyleData.DEFAULTS = {

	};

	//type
	RetirementLifeStyleData.UNIDENTIFY = "unidentify";
	RetirementLifeStyleData.TYPE_BASIC = "basic";
	RetirementLifeStyleData.TYPE_MODERATE = "moderate";
	RetirementLifeStyleData.TYPE_CARE_FREE = "care_free";
	RetirementLifeStyleData.TYPE_LUXURY = "luxury";



	RetirementLifeStyleData.getTitleByLifeStyleType = function(type) {
		var result = "unidentify";
		switch(type) {
			case RetirementLifeStyleData.TYPE_BASIC:
				result= "BASIC";
				break;
			case RetirementLifeStyleData.TYPE_MODERATE:
				result= "MODERATE";
				break;
			case RetirementLifeStyleData.TYPE_CARE_FREE:
				result= "CARE-FREE";
				break;
			case RetirementLifeStyleData.TYPE_LUXURY:
				result= "LUXURY";
				break;
		}

		return result;
	};

	RetirementLifeStyleData.getClassByLifeStyleType = function(type) {
		var result = "";
		switch(type) {
			case RetirementLifeStyleData.TYPE_BASIC:
				result= "icon-retirement-life-style-basic";
				break;
			case RetirementLifeStyleData.TYPE_MODERATE:
				result= "icon-retirement-life-style-moderate";
				break;
			case RetirementLifeStyleData.TYPE_CARE_FREE:
				result= "icon-retirement-life-style-care-free";
				break;
			case RetirementLifeStyleData.TYPE_LUXURY:
				result= "icon-retirement-life-style-luxury";
				break;
		}

		return result;
	};

	RetirementLifeStyleData.prototype = {
		constructor: RetirementLifeStyleData,

		_type: null,
		_retirementAge : null,

		initialize: function() {
			this._type = RetirementLifeStyleData.UNIDENTIFY;
			this._retirementAge = -1;
		},

		_getValidType: function(type) {
			var validType = type === RetirementLifeStyleData.TYPE_BASIC ||
				type === RetirementLifeStyleData.TYPE_MODERATE ||
				type === RetirementLifeStyleData.TYPE_CARE_FREE ||
				type === RetirementLifeStyleData.TYPE_LUXURY  ? type : RetirementLifeStyleData.UNIDENTIFY;
			return validType;
		},

		getType: function() {
			return this._type;
		},

		setType: function(newType) {
			var validType = this._getValidType(newType);
			this._type = validType;
		},

		getRetirementAge: function() {
			return this._retirementAge;
		},

		setRetirementAge: function(age) {
			this._retirementAge = age;
		}
	};

	// exports
	retirement.RetirementLifeStyleData = RetirementLifeStyleData;

}(data.retirement, jQuery));