/* © 2014 Aleph-labs.com
 * @author Phuong VO
 */
// namespace
var page = page || {};
page.investment = page.investment || {};
var pos = pos || {};
var data = data || {};

(function(investment, $) {
	'use strict';

	/**
	 * InvestmentGoal component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function InvestmentGoal(element, options) {
		this.$el  = $(element);
		this.el = this.$el[0];
		this.options   = $.extend({}, InvestmentGoal.DEFAULTS, options);

		if (this.options.isStandalone) {
			this.initialize(new data.EmotionalFactFindingData());
		}
	}

	InvestmentGoal.VERSION  = '3.3.1';

	InvestmentGoal.DEFAULTS = {
		// no defaults for now
		index: 0,
		isStandalone : false
	};


	InvestmentGoal.prototype = {
		constructor: InvestmentGoal,

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
		investmentGoalData: null,

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
					self.addCharacter(self.investmentGoalData);

				};
				var changeMaritalOfCustomerHandler = function() {
					console.log("==changeMaritalOfCustomerHandler");
					self.addMarital(self.investmentGoalData);
				};
				var changeDependentOfCustomerHandler = function () {
					console.log("==changeDependentOfCustomerHandler");
					self.addDependents(self.investmentGoalData);
				};
				var changeHouseOfCustomerHandler = function () {
					console.log("==changeHouseOfCustomerHandler");
					self.addHousing(self.investmentGoalData);
				};
				this.topicList.push(this.investmentGoalData.subscribe(data.GettingToKnowYouData.EVENT_CHANGE_CUSTOMER, changeCustomerHandler));
				this.topicList.push(this.investmentGoalData.subscribe(data.GettingToKnowYouData.EVENT_CHANGE_MARITAL, changeMaritalOfCustomerHandler));
				this.topicList.push(this.investmentGoalData.subscribe(data.GettingToKnowYouData.EVENT_CHANGE_DEPENDENT, changeDependentOfCustomerHandler));
				this.topicList.push(this.investmentGoalData.subscribe(data.GettingToKnowYouData.EVENT_CHANGE_HOUSE, changeHouseOfCustomerHandler));
				*/
			} else {
				this.pageManagement.$el.on(pos.PageManagement.EVENT_NEW_PAGE_ADDED);

				for (var i = 0; i < this.topicList.lenght; i++) {
					var topic = this.topicList[i];
					this.investmentGoalData.unsubscribe(topic);
				}
			}
		},

		//emotionalData is EmotionalFactFindingData
		initialize: function(emotionalData) {
			this.emotionalFactFindingData = emotionalData;
			this.investmentGoalData = this.emotionalFactFindingData.getInvestmentGoalData();

			this.initComponent();
			this.bindEvents(true);

			this.startApp();
		},

		initComponent: function() {
			var pageManagementHTML = this.$el.find(".ebp-content-container .page-management")[0];
			this.pageManagement = new pos.PageManagement(pageManagementHTML, {});

			this.initPageList();

			this.topicList = [];

			this.currentPage = -1;
			this.indexPage = this.options.index;
		},

		initPageList: function() {
			this.pageList = [
				investment.InvestmentIncomeAsset
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
	investment.InvestmentGoal = InvestmentGoal;
}(page.investment, jQuery));