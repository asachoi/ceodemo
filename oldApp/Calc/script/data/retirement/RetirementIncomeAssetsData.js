/* © 2014 Aleph-labs.com
 * @author Phuong Vo
 */
// namespace
var data = data || {};
data.retirement = data.retirement || {};

(function(retirement) {
	'use strict';

	function RetirementIncomeAssetsData() {
		this.initialize();
	}

	RetirementIncomeAssetsData.VERSION  = '3.3.1';

	RetirementIncomeAssetsData.DEFAULTS = {

	};

	//income assets type
	RetirementIncomeAssetsData.UNIDENTIFY = "unidentify";
	RetirementIncomeAssetsData.TYPE_CURRENT_ASSETS = "current_asset";
	RetirementIncomeAssetsData.TYPE_MONTHLY_MPF = "monthly_mpf";
	RetirementIncomeAssetsData.TYPE_CURRENT_MONTHLY_INCOME = "current_monthly_income";
	RetirementIncomeAssetsData.TYPE_MPF_BALANCE = "mpf_balance";
	RetirementIncomeAssetsData.TYPE_SAVING_INVESTMENT = "saving_investment";

	RetirementIncomeAssetsData.getAvailableTypeList = function() {
		return [
			RetirementIncomeAssetsData.TYPE_CURRENT_ASSETS,
			RetirementIncomeAssetsData.TYPE_MONTHLY_MPF,
			RetirementIncomeAssetsData.TYPE_CURRENT_MONTHLY_INCOME,
			RetirementIncomeAssetsData.TYPE_MPF_BALANCE,
			RetirementIncomeAssetsData.TYPE_SAVING_INVESTMENT
		];
	};

	RetirementIncomeAssetsData.getTitleForType = function(type) {
		var result = "NoTitle";
		switch(type) {
			case RetirementIncomeAssetsData.TYPE_CURRENT_ASSETS:
				result = "CURRENT ASSETS";
				break;
			case RetirementIncomeAssetsData.TYPE_MONTHLY_MPF:
				result = "MONTHLY MPF";
				break;
			case RetirementIncomeAssetsData.TYPE_CURRENT_MONTHLY_INCOME:
				result = "CURRENT MONTHLY INCOME";
				break;
			case RetirementIncomeAssetsData.TYPE_MPF_BALANCE:
				result = "EXISTING MPF BALANCE";
				break;
			case RetirementIncomeAssetsData.TYPE_SAVING_INVESTMENT:
				result = "SAVINGS & INVESTMENTS<br>(EXCLUDING PROPERTY)";
				break;
		}

		return result;
	};

	RetirementIncomeAssetsData.getSmallTitleForType = function(type) {
		var result = "NoTitle";
		switch(type) {
			case RetirementIncomeAssetsData.TYPE_CURRENT_ASSETS:
				result = "CURRENT ASSETS";
				break;
			case RetirementIncomeAssetsData.TYPE_MONTHLY_MPF:
				result = "MONTHLY MPF";
				break;
			case RetirementIncomeAssetsData.TYPE_CURRENT_MONTHLY_INCOME:
				result = "CURRENT MONTHLY<br> INCOME";
				break;
			case RetirementIncomeAssetsData.TYPE_MPF_BALANCE:
				result = "EXISTING MPF BALANCE";
				break;
			case RetirementIncomeAssetsData.TYPE_SAVING_INVESTMENT:
				result = "SAVINGS &<br>INVESTMENTS";
				break;
		}

		return result;
	};

	RetirementIncomeAssetsData.getClassForType = function(type) {
		var result = "NoTitle";
		switch(type) {
			case RetirementIncomeAssetsData.TYPE_CURRENT_ASSETS:
				result = "icon-income-current-assets";
				break;
			case RetirementIncomeAssetsData.TYPE_MONTHLY_MPF:
				result = "icon-income-monthly-MPF";
				break;
			case RetirementIncomeAssetsData.TYPE_CURRENT_MONTHLY_INCOME:
				result = "icon-income-current-monthly";
				break;
			case RetirementIncomeAssetsData.TYPE_MPF_BALANCE:
				result = "icon-income-existing-MPF-balance";
				break;
			case RetirementIncomeAssetsData.TYPE_SAVING_INVESTMENT:
				result = "icon-income-saving-and-investments";
				break;
		}

		return result;
	};


	RetirementIncomeAssetsData.prototype = {
		constructor: RetirementIncomeAssetsData,

		_type: null,
		_value : null,

		initialize: function() {
			this._type = RetirementIncomeAssetsData.UNIDENTIFY;
			this._value = -1;
		},

		_getValidType: function(type) {
			var validType = type === RetirementIncomeAssetsData.TYPE_CURRENT_ASSETS ||
				type === RetirementIncomeAssetsData.TYPE_MONTHLY_MPF ||
				type === RetirementIncomeAssetsData.TYPE_CURRENT_MONTHLY_INCOME ||
				type === RetirementIncomeAssetsData.TYPE_MPF_BALANCE ||
				type === RetirementIncomeAssetsData.TYPE_SAVING_INVESTMENT ? type : RetirementIncomeAssetsData.UNIDENTIFY;
			return validType;
		},

		getType: function() {
			return this._type;
		},

		setType: function(newType) {
			var validType = this._getValidType(newType);
			this._type = validType;
		},

		getValue: function() {
			return this._value;
		},

		setValue: function(newValue) {
			this._value = newValue;
		}
	};

	// exports
	retirement.RetirementIncomeAssetsData = RetirementIncomeAssetsData;

}(data.retirement, jQuery));