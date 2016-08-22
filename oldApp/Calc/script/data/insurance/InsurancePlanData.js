/* © 2014 Aleph-labs.com
 * @author Phuong Vo
 */
// namespace
var data = data || {};
data.insurance = data.insurance || {};

(function(insurance) {
	'use strict';

	/**
	 * InsurancePlanData component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 *
	 *  All operation on this class must use the method that provide
	 *  It will be easy to change and observe
	 */
	function InsurancePlanData() {
		this._parentClass = data.SubscribeItem;
		this.initialize();
	}

	InsurancePlanData.VERSION  = '3.3.1';

	InsurancePlanData.DEFAULTS = {

	};

	InsurancePlanData.prototype = {
		constructor: InsurancePlanData,

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
	var temporaryObj = InsurancePlanData.prototype;
	InsurancePlanData.prototype = Object.create(data.SubscribeItem.prototype);
	$.extend(InsurancePlanData.prototype, temporaryObj);

	// exports
	insurance.InsurancePlanData = InsurancePlanData;
}(data.insurance));