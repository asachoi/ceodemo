/* © 2014 Aleph-labs.com
 * @author Phuong Vo
 */
// namespace
var data = data || {};
data.investment = data.investment || {};
(function(investment) {
	'use strict';

	/**
	 * InvestmentGoalData component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 *
	 *  All operation on this class must use the method that provide
	 *  It will be easy to change and observe
	 */
	function InvestmentGoalData() {
		this._parentClass = data.SubscribeItem;
		this.initialize();
	}

	InvestmentGoalData.VERSION  = '3.3.1';

	InvestmentGoalData.DEFAULTS = {

	};

	InvestmentGoalData.prototype = {
		constructor: InvestmentGoalData,
		_parentClass: null,


		_incomeAssets: null,

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

			this._callParentMethod("initialize");
		},

		//property get/set
		getIncomeAssets: function() {
			return this._incomeAssets;
		},

		setIncomeAssets: function(incomeAssetsList) {
			this._incomeAssets = incomeAssetsList;
		}

	};

	//extends
	var temporaryObj = InvestmentGoalData.prototype;
	InvestmentGoalData.prototype = Object.create(data.SubscribeItem.prototype);
	$.extend(InvestmentGoalData.prototype, temporaryObj);

	// exports
	investment.InvestmentGoalData = InvestmentGoalData;
}(data.investment));