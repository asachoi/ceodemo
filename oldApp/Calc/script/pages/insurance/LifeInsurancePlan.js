/* © 2014 Aleph-labs.com
 * @author Phuong VO
 */
// namespace
var page = page || {};
page.insurance = page.insurance || {};
var pos = pos || {};
var data = data || {};

(function(insurance, $) {
	'use strict';

	/**
	 * LifeInsurancePlan component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function LifeInsurancePlan(element, options) {
		this.$el  = $(element);
		this.el = this.$el[0];
		// store this instance to data object so that I can retrieve it later
		this.$el.data('retirement_plan', this);
		//
		this.options   = $.extend({}, LifeInsurancePlan.DEFAULTS, options);

		if (this.options.isStandalone) {
			this.initialize(new data.EmotionalFactFindingData());
		}
	}

	LifeInsurancePlan.VERSION  = '3.3.1';

	LifeInsurancePlan.DEFAULTS = {
		// no defaults for now
		index: 0,
		isStandalone : false
	};


	LifeInsurancePlan.prototype = {
		constructor: LifeInsurancePlan,

		$el: null,
		el: null,

		indexPage: null,

		//management for each small screen
		pageManagement: null,
		pageList: null,

		//handle currentPage
		currentPage: null,

		topicList: null,

		emotionalFactFindingData: null,
		lifeInsurancePlanData: null,

		bindEvents: function(isActiveEvent) {
			if (isActiveEvent) {
				var self = this;
				this.pageManagement.$el.on(pos.PageManagement.EVENT_NEW_PAGE_ADDED, function(events, pageAdded) {
					//place page is added
					self.pageCompleteAddedHandler(true, pageAdded);

					//set data
					pageAdded.setData(self.emotionalFactFindingData);
				});
				/*
				//event for data change
				var changeCustomerHandler = function() {
					console.log("==changeCustomerHandler");
					// get gender
					self.addCharacter(self.LifeInsurancePlanData);

				};
				var changeMaritalOfCustomerHandler = function() {
					console.log("==changeMaritalOfCustomerHandler");
					self.addMarital(self.LifeInsurancePlanData);
				};
				var changeDependentOfCustomerHandler = function () {
					console.log("==changeDependentOfCustomerHandler");
					self.addDependents(self.LifeInsurancePlanData);
				};
				var changeHouseOfCustomerHandler = function () {
					console.log("==changeHouseOfCustomerHandler");
					self.addHousing(self.LifeInsurancePlanData);
				};
				this.topicList.push(this.LifeInsurancePlanData.subscribe(data.GettingToKnowYouData.EVENT_CHANGE_CUSTOMER, changeCustomerHandler));
				this.topicList.push(this.LifeInsurancePlanData.subscribe(data.GettingToKnowYouData.EVENT_CHANGE_MARITAL, changeMaritalOfCustomerHandler));
				this.topicList.push(this.LifeInsurancePlanData.subscribe(data.GettingToKnowYouData.EVENT_CHANGE_DEPENDENT, changeDependentOfCustomerHandler));
				this.topicList.push(this.LifeInsurancePlanData.subscribe(data.GettingToKnowYouData.EVENT_CHANGE_HOUSE, changeHouseOfCustomerHandler));
				*/
			} else {
				this.pageManagement.$el.on(pos.PageManagement.EVENT_NEW_PAGE_ADDED);

				for (var i = 0; i < this.topicList.lenght; i++) {
					var topic = this.topicList[i];
					this.lifeInsurancePlanData.unsubscribe(topic);
				}
			}
		},

		//emotionalData is EmotionalFactFindingData
		initialize: function(emotionalData) {
			this.emotionalFactFindingData = emotionalData;
			this.lifeInsurancePlanData = this.emotionalFactFindingData.getInsurancePlanData();

			this.initComponent();
			this.bindEvents(true);

			this.startApp();
		},

		initComponent: function() {
			var pageManagementHTML = this.$el.find(".ebp-content-container .page-management")[0];
			console.log("==pageManagementHTML " + pageManagementHTML);
			this.pageManagement = new pos.PageManagement(pageManagementHTML, {});

			this.initPageList();

			this.topicList = [];

			this.currentPage = -1;
			this.indexPage = this.options.index;
		},

		initPageList: function() {
			this.pageList = [
				insurance.LifeInsuranceIncomeAsset
			];
		},

		//>>>>>>>>>>>>>>>>event handler >>>>>>>>>>>>
		pageCompleteAddedHandler: function(isAddEvent, pageAdded) {
			var self = this;
			//var pageObj = this.pageManagement.getCurrentPageInstance();
			var pageObj = pageAdded;
			console.log("pageObj " + pageObj);
			if (isAddEvent) {
				pageObj.$el.on("event_next", function() {
					self.nextPage();
				});

				pageObj.$el.on("event_previous", function() {
					self.previousPage();
				});
			} else {
				pageObj.$el.off("event_next");
				pageObj.$el.off("event_previous");
			}
		},

		nextPage: function() {
			console.log("==nextPage");
			if (this.currentPage < this.pageList.length - 1) {
				//remove event for current page
				var currentPage = this.pageManagement.getCurrentPageInstance();
				this.pageCompleteAddedHandler(false, currentPage);

				this.currentPage = this.currentPage + 1;
				this.startShowPage();
			} else {
				//complete page
				this.completePage();
			}
		},

		previousPage: function() {
			if (this.pageManagement.canBack()) {
				//remove event for current page
				var currentPage = this.pageManagement.getCurrentPageInstance();
				this.pageCompleteAddedHandler(false, currentPage);

				this.currentPage = this.currentPage - 1;
				this.pageManagement.back();
			} else {
				//complete page
				this.cancelPage();
			}
		},

		completePage: function() {
			if (!this.options.isStandalone) {
				var currentPage = this.pageManagement.getCurrentPageInstance();
				this.pageCompleteAddedHandler(false, currentPage);
			}

			this.$el.trigger("page_complete", [this.indexPage]);
		},

		cancelPage: function() {
			if (!this.options.isStandalone) {
				var currentPage = this.pageManagement.getCurrentPageInstance();
				this.pageCompleteAddedHandler(false, currentPage);
			}

			this.$el.trigger("page_cancel", [this.indexPage]);
		},

		startShowPage: function() {
			var firstClass = this.pageList[this.currentPage];
			console.log("==this.currentPage " + this.currentPage);
			this.pageManagement.nextPage(firstClass);
		},

		startApp: function() {
			this.currentPage = 0;
			this.startShowPage();
		}

	};

	// exports
	insurance.LifeInsurancePlan = LifeInsurancePlan;
}(page.insurance, jQuery));