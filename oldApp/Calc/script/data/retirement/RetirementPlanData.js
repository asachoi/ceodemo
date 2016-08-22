/* © 2014 Aleph-labs.com
 * @author Phuong Vo
 */
// namespace
var data = data || {};
data.retirement = data.retirement || {};

(function(retirement, $) {
	'use strict';

	function RetirementPlanData() {
		this._parentClass = data.SubscribeItem;
		//this._parentClass.call(this);
		this.initialize();

		window.test = this;
	}

	RetirementPlanData.VERSION  = '3.3.1';

	RetirementPlanData.DEFAULTS = {

	};

	RetirementPlanData.EVENT_CHANGE_INCOME_ASSETS = "event_change_income_assets";
	RetirementPlanData.EVENT_CHANGE_EXPENSES_LIABILITIES = "event_change_expenses_liabilities";
	RetirementPlanData.EVENT_CHANGE_LIFE_STYLE = "event_change_life_style";

	RetirementPlanData.prototype = {
		constructor: RetirementPlanData,

		_incomeAssets: null,	//income/assets
		_expensesLiabilities: null,	//expenses/liability
		_lifeStyle: null,

		_parentClass: null,

		_callParentMethod: function(method, params) {
			//check if parent class have method or not
			if (this._parentClass) {
				if (method in this._parentClass.prototype) {
					this._parentClass.prototype[method].call(this, params);
				}
			}
		},

		initialize: function() {
			this._incomeAssets = [];
			this._expensesLiabilities = [];
			this._lifeStyle = new retirement.RetirementLifeStyleData();

			this._callParentMethod("initialize");
		},

		//property get/set
		getIncomeAssets: function() {
			return this._incomeAssets;
		},

		setIncomeAssets: function(incomeAssetsList) {
			this._incomeAssets = incomeAssetsList;
		},

		getExpensesLiabilities: function() {
			return this._expensesLiabilities;
		},

		setExpensesLiabilities: function(expensesList) {
			this._expensesLiabilities = expensesList;
		},

		getLifeStyle: function() {
			return this._lifeStyle;
		},

		setLifeStyle: function(lifeStyleValue) {
			this._lifeStyle = lifeStyleValue;
		},

		//add item into list
		addIncomeAssetItem: function(incomeItem) {
			if (incomeItem instanceof retirement.RetirementIncomeAssetsData) {
				this._incomeAssets.push(incomeItem);
			} else {
				console.log("==can not add income item");
			}
		},

		removeIncomeAssetsByType: function(incomeAssetType) {
			for (var i = 0; i < this._incomeAssets.length; i++) {
				var incomeAssetItem = this._incomeAssets[i];
				if (incomeAssetItem.getType() === incomeAssetType) {
					this._incomeAssets.splice(i, 1);
					return true;
				}
			}

			return false;
		},

		getIncomeAssetByType: function(incomeAssetType) {
			for (var i = 0; i < this._incomeAssets.length; i++) {
				var incomeAssetItem = this._incomeAssets[i];
				if (incomeAssetItem.getType() === incomeAssetType) {
					return incomeAssetItem;
				}
			}

			return null;
		},

		addExpensesLiabilityItem: function(expenseLiabilityItem) {
			if (expenseLiabilityItem instanceof retirement.RetirementIncomeAssetsData) {
				this._expensesLiabilities.push(expenseLiabilityItem);
			} else {
				console.log("==can not add expense litem");
			}
		},

		removeExpensesLiabilitiesByType: function(expenseLiabilityType) {
			for (var i = 0; i < this._expensesLiabilities.length; i++) {
				var expenseLiabilityItem = this._expensesLiabilities[i];
				if (expenseLiabilityItem.getType() === expenseLiabilityType) {
					this._expensesLiabilities.splice(i, 1);
					return true;
				}
			}

			return false;
		},

		getExpenseLiabilityByType: function(expenseLiabilityType) {
			for (var i = 0; i < this._expensesLiabilities.length; i++) {
				var expenseLiabilityItem = this._expensesLiabilities[i];
				if (expenseLiabilityItem.getType() === expenseLiabilityType) {
					return expenseLiabilityItem;
				}
			}

			return null;
		}
	};

	//extends
	var temporaryObj = RetirementPlanData.prototype;
	RetirementPlanData.prototype = Object.create(data.SubscribeItem.prototype);
	$.extend(RetirementPlanData.prototype, temporaryObj);

	// exports
	retirement.RetirementPlanData = RetirementPlanData;

}(data.retirement, jQuery));