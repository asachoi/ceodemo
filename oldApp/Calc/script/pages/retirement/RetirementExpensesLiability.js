/* © 2014 Aleph-labs.com
 * @author Thang Kieu
 */
// namespace
var page = page || {};
page.retirement = page.retirement || {};
var pos = pos || {};
var data = data || {};

(function(retirement, $) {
	'use strict';

	/**
	 * RetirementExpensesLiability component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function RetirementExpensesLiability(element, options) {
		retirement.RetirementIncomeAsset.call(this, element, options);
	}

	RetirementExpensesLiability.VERSION  = '3.3.1';


	RetirementExpensesLiability.DEFAULTS = {
		// no defaults for now
		isDebug:true,
		isStandalone: false,
		isMobileWebSimulator: false
	};


	RetirementExpensesLiability.prototype = {
		constructor: RetirementExpensesLiability,

		//override method
		addIncomeData: function(newItem) {
			console.log("==addIncomeData RetirementExpensesLiability ");
			this.retirementPlanData.addExpensesLiabilityItem(newItem);
			this.retirementPlanData.publish(data.retirement.RetirementPlanData.EVENT_CHANGE_EXPENSES_LIABILITIES);
		},

		removeIncomeData: function(incomeType) {
			console.log("==removeIncomeData RetirementExpensesLiability ");
			this.retirementPlanData.removeExpensesLiabilitiesByType(incomeType);
			this.retirementPlanData.publish(data.retirement.RetirementPlanData.EVENT_CHANGE_EXPENSES_LIABILITIES);
		},

		onValueChangeInRetirementComponent: function(targetIncome, targetIncomeValue) {
			console.log("==onValueChangeInRetirementComponent onValueChangeInRetirementComponent ");
			var expenseLiabilityData = this.retirementPlanData.getExpenseLiabilityByType(targetIncome.getIncomeAssetType());
			expenseLiabilityData.setValue(targetIncomeValue);
			this.retirementPlanData.publish(data.retirement.RetirementPlanData.EVENT_CHANGE_EXPENSES_LIABILITIES);
		},

		getDocumentHTML : function() {
			// jshint multistr:true
			return	"<div class='retirement-income-asset'> \
					<div class='left-container'> \
						<div class='header'> \
							<div class='container'> \
								<div class='characters-list'> \
									<div class='inner'> \
									<div class='character-icon icon-income-current-assets'></div> \
									<p class='title'>CURRENT ASSETS</p> \
									</div> \
								</div> \
								<div class='characters-list'> \
									<div class='inner'> \
									<div class='character-icon icon-income-monthly-MPF'></div> \
									<p class='title'>MONTHLY MPF</p> \
									</div> \
								</div> \
								<div class='characters-list'> \
									<div class='inner'> \
									<div class='character-icon icon-income-current-monthly'></div> \
									<p class='title'>CURRENT MONTHLY<br> INCOME</p> \
									</div> \
								</div> \
								<div class='characters-list'> \
									<div class='inner'> \
									<div class='character-icon icon-income-existing-MPF-balance'></div> \
									<p class='title'>EXISTING MPF<br>BALANCE</p> \
									</div> \
								</div> \
								<div class='characters-list'> \
									<div class='inner'> \
									<div class='character-icon icon-income-saving-and-investments'></div> \
									<p class='title'>SAVINGS & INVESTMENTS<br>(EXCLUDING PROPERTY)</p> \
									</div> \
								</div> \
							</div> \
						</div> \
						<div class='middle'> \
							<div class='overlay'> \
								<div class='container'> \
									<div class='age-container'> \
										<p class='age-title'>Value</p> \
										<p class='age-num'>100 years</p> \
									</div> \
								</div> \
							</div> \
							<p class='title'>EXPENSES/LIABILITIES</p> \
							<div class='content-container'> \
							</div> \
							<div class='control-container'> \
								<p class='previous'>PREVIOUS</p> \
								<p class='next'>NEXT</p> \
							</div> \
						</div> \
					</div> \
				</div>";
		}
	};

	// exports
	var temporaryObj = RetirementExpensesLiability.prototype;
	RetirementExpensesLiability.prototype = Object.create(retirement.RetirementIncomeAsset.prototype);
	$.extend(RetirementExpensesLiability.prototype, temporaryObj);

	// exports
	retirement.RetirementExpensesLiability = RetirementExpensesLiability;
}(page.retirement, jQuery));