/* © 2014 Aleph-labs.com
 * @author Phuong Vo
 */
// namespace
var data = data || {};

(function(data) {
	'use strict';

	/**
	 * EmotionalFactFindingData component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 *
	 *  All operation on this class must use the method that provide
	 *  It will be easy to change and observe
	 */
	function EmotionalFactFindingData() {
		this.initDefault();
	}

	EmotionalFactFindingData.VERSION  = '3.3.1';

	EmotionalFactFindingData.DEFAULTS = {

	};

	EmotionalFactFindingData.prototype = {
		constructor: EmotionalFactFindingData,

		_gettingToKnowYouData: null,
		_retirementPlanData: null,
		_insurancePlanData: null,
		_investmentGoalData:null,

		initDefault: function() {
			this._gettingToKnowYouData = new data.GettingToKnowYouData();
			this._retirementPlanData = new data.retirement.RetirementPlanData();
			this._insurancePlanData = new data.insurance.InsurancePlanData();
			this._investmentGoalData = new data.investment.InvestmentGoalData();
		},

		getGettingToKnowYouData: function() {
			return this._gettingToKnowYouData;
		},

		setGettingToKnowYouData: function(gettingToKnowYouData) {
			this._gettingToKnowYouData = gettingToKnowYouData;
		},

		getRetirementPlanData : function() {
			return this._retirementPlanData;
		},

		setRetirementPlanData : function(retirementPlanData ) {
			this._retirementPlanData  = retirementPlanData;
		},

		getInsurancePlanData: function() {
			return this._insurancePlanData;
		},

		setInsurancePlanData: function(insurancePlanData) {
			this._insurancePlanData = insurancePlanData;
		},

		getInvestmentGoalData: function() {
			return this._investmentGoalData;
		},

		seInvestmentGoalData: function(investmentGoalData) {
			this._investmentGoalData = investmentGoalData;
		},

		//for suscribe and publish
		topics: {},
		// An topic identifier
	    	subUid : -1,

		// Publish or broadcast events of interest
		// with a specific topic name and arguments
		// such as the data to pass along
		publish : function( topic, args ) {
			if ( !this.topics[topic] ) {
				return false;
			}

			var subscribers = this.topics[topic],
			len = subscribers ? subscribers.length : 0;

			while (len--) {
				subscribers[len].func( topic, args );
			}

			return this;
		},

		// Subscribe to events of interest
		// with a specific topic name and a
		// callback function, to be executed
		// when the topic/event is observed
		subscribe : function( topic, func ) {
			if (!this.topics[topic]) {
				this.topics[topic] = [];
			}

			var token = ( ++this.subUid ).toString();
			this.topics[topic].push({
				token: token,
				func: func
			});
			return token;
		},

		// Unsubscribe from a specific
		// topic, based on a tokenized reference
		// to the subscription
		unsubscribe : function( token ) {
			for ( var m in this.topics ) {
				if ( this.topics[m] ) {
					for ( var i = 0, j = this.topics[m].length; i < j; i++ ) {
						if ( this.topics[m][i].token === token ) {
							this.topics[m].splice( i, 1 );
							return token;
						}
					}
				}
			}
			return this;
		}
	};

	// exports
	data.EmotionalFactFindingData = EmotionalFactFindingData;
}(data));