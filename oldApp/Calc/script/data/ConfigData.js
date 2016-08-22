/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var data = data || {};

(function(data) {
	'use strict';

	/**
	 * ConfigData component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 *
	 *  All operation on this class must use the method that provide
	 *  It will be easy to change and observe
	 */
	function ConfigData() {
		this.initDefault();
	}

	ConfigData.VERSION  = '3.3.1';

	ConfigData.DEFAULTS = {

	};

	ConfigData.MARITAL_SINGLE = 0;
	ConfigData.MARITAL_MARRIED = 1;
	ConfigData.MARITAL_DIVORCED = 2;
	ConfigData.MARITAL_WIDOWED = 3;

	ConfigData.OCCUPATION_PROFESSIONAL = 0;
	ConfigData.OCCUPATION_CIVIL_SERVANT = 1;
	ConfigData.OCCUPATION_EXECUTIVE = 2;
	ConfigData.OCCUPATION_SUPERVISOR_MANAGER = 3;
	ConfigData.OCCUPATION_INTERMEDIATE_STAFF = 4;
	ConfigData.OCCUPATION_CAREER_STARTER = 5;
	ConfigData.OCCUPATION_SELF_EMPLOYED = 6;

	ConfigData.OCCUPATION_PROFESSIONAL_CLASS = "occupation-professional";
	ConfigData.OCCUPATION_CIVIL_SERVANT_CLASS = "occupation-civil-servant";
	ConfigData.OCCUPATION_EXECUTIVE_CLASS = "occupation-executive";
	ConfigData.OCCUPATION_SUPERVISOR_MANAGER_CLASS = "occupation-supervisor-manager";
	ConfigData.OCCUPATION_INTERMEDIATE_STAFF_CLASS = "occupation-intermediate-staff";
	ConfigData.OCCUPATION_CAREER_STARTER_CLASS = "occupation-career-starter";
	ConfigData.OCCUPATION_SELF_EMPLOYED_CLASS = "occupation-self-employed";


	ConfigData.prototype = {
		constructor: ConfigData
	};


	ConfigData.isMarried = function(value) {
		return value === ConfigData.MARITAL_MARRIED || value.toString() === ConfigData.MARITAL_MARRIED.toString();
	};

	ConfigData.getTitleByOccupationData = function(occupationData) {
		var resultTitle = "PROFESSIONAL";
		switch (occupationData) {
			case ConfigData.OCCUPATION_PROFESSIONAL:
				resultTitle = "PROFESSIONAL";
				break;
			case ConfigData.OCCUPATION_CIVIL_SERVANT:
				resultTitle = "CIVIL SERVANT";
				break;
			case ConfigData.OCCUPATION_EXECUTIVE:
				resultTitle = "EXECUTIVE";
				break;
			case ConfigData.OCCUPATION_SUPERVISOR_MANAGER:
				resultTitle = "SUPERVISOR MANAGER";
				break;
			case ConfigData.OCCUPATION_INTERMEDIATE_STAFF:
				resultTitle = "INTERMEDIATE STAFF";
				break;
			case ConfigData.OCCUPATION_CAREER_STARTER:
				resultTitle = "CAREER STARTER";
				break;
			case ConfigData.OCCUPATION_SELF_EMPLOYED:
				resultTitle = "SELF EMPLOYED";
				break;
		}

		return resultTitle;
	};

	ConfigData.getOccupationClassByOccupationData = function(occupationData) {
			var occupationClass = ConfigData.OCCUPATION_PROFESSIONAL_CLASS;
			switch (occupationData) {
				case ConfigData.OCCUPATION_PROFESSIONAL:
					occupationClass = ConfigData.OCCUPATION_PROFESSIONAL_CLASS;
					break;
				case ConfigData.OCCUPATION_CIVIL_SERVANT:
					occupationClass = ConfigData.OCCUPATION_CIVIL_SERVANT_CLASS;
					break;
				case ConfigData.OCCUPATION_EXECUTIVE:
					occupationClass = ConfigData.OCCUPATION_EXECUTIVE_CLASS;
					break;
				case ConfigData.OCCUPATION_SUPERVISOR_MANAGER:
					occupationClass = ConfigData.OCCUPATION_SUPERVISOR_MANAGER_CLASS;
					break;
				case ConfigData.OCCUPATION_INTERMEDIATE_STAFF:
					occupationClass = ConfigData.OCCUPATION_INTERMEDIATE_STAFF_CLASS;
					break;
				case ConfigData.OCCUPATION_CAREER_STARTER:
					occupationClass = ConfigData.OCCUPATION_CAREER_STARTER_CLASS;
					break;
				case ConfigData.OCCUPATION_SELF_EMPLOYED:
					occupationClass = ConfigData.OCCUPATION_SELF_EMPLOYED_CLASS;
					break;
		}
		return occupationClass;
	};


	// exports
	data.ConfigData = ConfigData;
}(data));