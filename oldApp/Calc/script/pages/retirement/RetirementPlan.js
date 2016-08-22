/* © 2014 Aleph-labs.com
 * @author Phuong VO
 */
// namespace
var page = page || {};
page.retirement = page.retirement || {};
var pos = pos || {};
var data = data || {};

(function(retirement, $) {
	'use strict';

	/**
	 * RetirementPlan component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function RetirementPlan(element, options) {
		this.$el  = $(element);
		this.el = this.$el[0];
		// store this instance to data object so that I can retrieve it later
		this.options   = $.extend({}, RetirementPlan.DEFAULTS, options);

		if (this.options.isStandalone) {
			this.initialize(new data.EmotionalFactFindingData());
		}
	}

	RetirementPlan.VERSION  = '3.3.1';

	RetirementPlan.DEFAULTS = {
		// no defaults for now
		index: 0,
		isStandalone : false
	};


	RetirementPlan.prototype = {
		constructor: RetirementPlan,

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
		retirementPlanData: null,

		bindEvents: function(isActiveEvent) {
			if (isActiveEvent) {
				var self = this;
				this.pageManagement.$el.on(pos.PageManagement.EVENT_NEW_PAGE_ADDED, function(events, pageAdded) {
					//place page is added
					self.pageCompleteAddedHandler(true, pageAdded);

					//set data
					pageAdded.setData(self.emotionalFactFindingData);
				});

				//event for data change
				var changeIncomeAssetHandler = function() {
					console.log("==changeIncomeAssetHandler");
					// get gender
					self.addIncomeAsstet(self.retirementPlanData);

				};
				var changeExpensesLiabilitiesHanfdler = function() {
					console.log("==changeExpensesLiabilitiesHanfdler");
					self.addExpensesLiabilities(self.retirementPlanData);
				};
				var changeLifeStyleHandler = function () {
					console.log("==changeLifeStyleHandler");
					self.addLifeStyle(self.retirementPlanData);
				};

				this.topicList.push(this.retirementPlanData.subscribe(data.retirement.RetirementPlanData.EVENT_CHANGE_INCOME_ASSETS, changeIncomeAssetHandler));
				this.topicList.push(this.retirementPlanData.subscribe(data.retirement.RetirementPlanData.EVENT_CHANGE_EXPENSES_LIABILITIES, changeExpensesLiabilitiesHanfdler));
				this.topicList.push(this.retirementPlanData.subscribe(data.retirement.RetirementPlanData.EVENT_CHANGE_LIFE_STYLE, changeLifeStyleHandler));

			} else {
				this.pageManagement.$el.on(pos.PageManagement.EVENT_NEW_PAGE_ADDED);

				for (var i = 0; i < this.topicList.lenght; i++) {
					var topic = this.topicList[i];
					this.retirementPlanData.unsubscribe(topic);
				}
			}
		},

		//emotionalData is EmotionalFactFindingData
		initialize: function(emotionalData) {

			this.emotionalFactFindingData = emotionalData;
			this.retirementPlanData = this.emotionalFactFindingData.getRetirementPlanData();
			/*
			this.emotionalFactFindingData.getGettingToKnowYouData().setGender(data.CharacterData.MALE);
			this.emotionalFactFindingData.getGettingToKnowYouData().setAge(data.CharacterData.AGE_DEFAULT_MAN);
			this.emotionalFactFindingData.getGettingToKnowYouData().setMaritalStatus(data.ConfigData.MARITAL_MARRIED.toString());
			*/

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
				retirement.RetirementIncomeAsset,
				retirement.RetirementExpensesLiability,
				retirement.RetirementLifeStyle,
				retirement.RetirementAnalysis
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
			//check if current page is lifestyle
			if (this.currentPage === this.pageList.length - 2) {
				//invisible the
				this.$el.find(".ebp-left-container").css({
					'width' : '100%'
				});

				this.$el.find(".ebp-right-container").hide();
				this.$el.find(".ebp-background-header").hide();
				this.$el.find(".ebp-content-container").css({
					'padding' : 0
				});
			}

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
			if (this.currentPage === this.pageList.length - 1) {
				//invisible the
				this.$el.find(".ebp-left-container").css({
					'width' : '67%'
				});

				this.$el.find(".ebp-right-container").show();
				this.$el.find(".ebp-background-header").show();

				this.$el.find(".ebp-content-container").css({
					'padding' : 14
				});
			}
			console.log("=previousPage");
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
			this.$el.trigger("page_complete", [this.indexPage]);
		},


		cancelPage: function() {
			console.log("==cancelPage>>>");
			this.$el.trigger("page_cancel", [this.indexPage]);
		},

		startShowPage: function() {
			var firstClass = this.pageList[this.currentPage];
			console.log("==this.currentPage " + this.currentPage);
			this.pageManagement.nextPage(firstClass);

			this.showPagination(this.currentPage);
		},

		startApp: function() {
			this.currentPage = 0;
			this.startShowPage();

			this.showPagination(this.currentPage);
		},

		//for right panel
		showPagination: function(index) {
			var $pag = this.$el.find('.pagination li');
			$pag.removeClass('active').eq(index).addClass('active');
		},

		_createItemHTML : function(title, classContainer) {
			return "<div class='item " + classContainer + "'>" +
					"<div class='header-container'>" +
						"<p class='title'>" + title + "</p>" +
					"</div>" +
				"</div>";
		},

		//for event handler
		addIncomeAsstet: function(retirementData) {
			//clear the income-assets first
			this.$el.find(".income-assets.item").remove();

			var incomeAssets = retirementData.getIncomeAssets();
			if (incomeAssets.length === 0) {
				return;
			}

			var $content = $(this._createItemHTML("INCOME/ASSETS", "income-assets"));

			for (var i = 0; i < incomeAssets.length; i++) {
				var incomeAssetsItem = incomeAssets[i];	//retirementIncomeAssetsData object
				var value = Math.round(incomeAssetsItem.getValue());
				var title = data.retirement.RetirementIncomeAssetsData.getTitleForType(incomeAssetsItem.getType());
				title = title + "<br>" + value;
				var className = data.retirement.RetirementIncomeAssetsData.getClassForType(incomeAssetsItem.getType());
				var $item = $("<div class='obj-item'>" +
						"<span class='character-icon " + className +"''></span>" +
						"<p class='character-list-name'>" + title + "</p>" +
					"</div>");
				$content.append($item);
			}

			this.$el.find(".item-container").append($content);
		},

		addExpensesLiabilities: function(retirementData) {
			this.$el.find(".expenses-liabilities.item").remove();
			var expenseLiability = retirementData.getExpensesLiabilities();
			if (expenseLiability.length === 0) {
				return;
			}

			var $content = $(this._createItemHTML("EXPENSES/LIABILITIES", "expenses-liabilities"));
			for (var i = 0; i < expenseLiability.length; i++) {
				var expenseLiabilityItem = expenseLiability[i];	//retirementIncomeAssetsData object
				var value = Math.round(expenseLiabilityItem.getValue());
				var title = data.retirement.RetirementIncomeAssetsData.getTitleForType(expenseLiabilityItem.getType());
				title = title + "<br>" + value;
				var className = data.retirement.RetirementIncomeAssetsData.getClassForType(expenseLiabilityItem.getType());
				var $item = $("<div class='obj-item'>" +
						"<span class='character-icon " + className +"''></span>" +
						"<p class='character-list-name'>" + title + "</p>" +
					"</div>");
				$content.append($item);
			}

			this.$el.find(".item-container").append($content);
		},

		addLifeStyle: function(retirementData) {
			console.log("==change life style");
			this.$el.find(".life-style.item").remove();

			var $content = $(this._createItemHTML("LIFE STYLE", "life-style"));
			var className = data.retirement.RetirementLifeStyleData.getClassByLifeStyleType(retirementData.getLifeStyle().getType());
			var title = data.retirement.RetirementLifeStyleData.getTitleByLifeStyleType(retirementData.getLifeStyle().getType());
			var $item = $("<div class='obj-item'>" +
					"<span class='character-icon " + className +"''></span>" +
					"<p class='character-list-name'>" + title + "</p>" +
				"</div>");
			$content.append($item);
			this.$el.find(".item-container").append($content);
		}

	};

	// exports
	retirement.RetirementPlan = RetirementPlan;
}(page.retirement, jQuery));