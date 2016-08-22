/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
/*global data*/
// namespace
var page = page || {};
var pos = pos || {};

(function(page, $, Templates, I18nHelper) {
	'use strict';

	/**
	 * GettingToKnowYou component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 *      The container view for gettingtoknowyou section.It contains 4 small section inside
	 *      Each small section is created dynamically, so try to avoid leak memory issue with this
	 *      Alway make sure after small section is destroyed(onDestroy method will be callled before it is destroyed)
	 *      we must remove all the events inside it, and when repairing change the view, we must remove
	 *      the event that it has in GettingToKnowYou(pageCompleteAddedHandler method)
	 *
	 */
	function GettingToKnowYou(element, options) {
		this.$el  = $(element);
		this.el = this.$el[0];
		// store this instance to data object so that I can retrieve it later
		this.$el.data('getting_to_know_you', this);
		//
		this.options   = $.extend({}, GettingToKnowYou.DEFAULTS, options);

		if (this.options.isStandalone) {
			this.initialize(new data.GettingToKnowYouData());
		}
	}

	GettingToKnowYou.VERSION  = '3.3.1';
	GettingToKnowYou.EVENT_NEXT = "event_next";
	GettingToKnowYou.EVENT_PREVIOUS = "event_previous";

	GettingToKnowYou.DEFAULTS = {
		// no defaults for now
		index: 0,
		isStandalone : false
	};


	GettingToKnowYou.prototype = {
		constructor: GettingToKnowYou,

		$el: null,
		el: null,

		indexPage: null,

		gettingToKnowYouData: null,
		topicList: null,

		//management for each small screen
		pageManagement: null,
		pageList: null,
		pageListProps: null,

		rightPanel: null,

		//handle currentPage
		currentPage: null,

		bindEvents: function(isActiveEvent) {
			if (isActiveEvent) {
				var self = this;
				this.pageManagement.$el.on(pos.PageManagement.EVENT_COMPLETE_ANIMATION, function() {

				});

				this.pageManagement.$el.on(pos.PageManagement.EVENT_NEW_PAGE_ADDED, function(events, pageAdded) {
					//place page is added
					self.pageCompleteAddedHandler(true, pageAdded);

					//set data
					pageAdded.setData(self.gettingToKnowYouData);

					//dispatch an event to the shell that the it was loaded and sould
					self.$el.trigger("page_update_language");

				});



				//event for data change
				var changeCustomerHandler = function() {
					console.log("==changeCustomerHandler");
					// get gender
					self.addCharacter(self.gettingToKnowYouData);

				};
				var changeMaritalOfCustomerHandler = function() {
					console.log("==changeMaritalOfCustomerHandler");
					self.addMarital(self.gettingToKnowYouData);
				};
				var changeDependentOfCustomerHandler = function () {
					console.log("==changeDependentOfCustomerHandler");
					self.addDependents(self.gettingToKnowYouData);
				};

				var changeChildrenOfCustomerHandler = function() {
					self.updateChildrens(self.gettingToKnowYouData);
				};

				var changeHouseOfCustomerHandler = function () {
					console.log("==changeHouseOfCustomerHandler");
					self.addHousing(self.gettingToKnowYouData);
				};
				var changeOccupationOfCustomerHandler = function() {
					console.log("==changeOccupationOfCustomerHandler");
					self.addOccupation(self.gettingToKnowYouData.getOccupation());
				};

				var changeDreamHandler = function() {
					self.updateDream(self.gettingToKnowYouData);
				};


				this.topicList.push(this.gettingToKnowYouData.subscribe(data.GettingToKnowYouData.EVENT_CHANGE_CUSTOMER, changeCustomerHandler));
				this.topicList.push(this.gettingToKnowYouData.subscribe(data.GettingToKnowYouData.EVENT_CHANGE_MARITAL, changeMaritalOfCustomerHandler));
				this.topicList.push(this.gettingToKnowYouData.subscribe(data.GettingToKnowYouData.EVENT_CHANGE_DEPENDENT, changeDependentOfCustomerHandler));
				this.topicList.push(this.gettingToKnowYouData.subscribe(data.GettingToKnowYouData.EVENT_CHANGE_CHILDREN, changeChildrenOfCustomerHandler));
				this.topicList.push(this.gettingToKnowYouData.subscribe(data.GettingToKnowYouData.EVENT_CHANGE_HOUSE, changeHouseOfCustomerHandler));
				this.topicList.push(this.gettingToKnowYouData.subscribe(data.GettingToKnowYouData.EVENT_CHANGE_OCCUPATION, changeOccupationOfCustomerHandler));
				this.topicList.push(this.gettingToKnowYouData.subscribe(data.GettingToKnowYouData.EVENT_CHANGE_DREAM, changeDreamHandler));
			} else {
				this.pageManagement.$el.off(pos.PageManagement.EVENT_COMPLETE_ANIMATION);
				this.pageManagement.$el.on(pos.PageManagement.EVENT_NEW_PAGE_ADDED);

				for (var i = 0; i < this.topicList.lenght; i++) {
					var topic = this.topicList[i];
					this.gettingToKnowYouData.unsubscribe(topic);
				}
			}
		},

		initComponent: function() {
			var rightPanelHTML = this.$el.find(".ebp-right-container .right-panel-know-you");
			this.rightPanel = new pos.RightPanelKnowYou(rightPanelHTML, {});

			var pageManagementHTML = this.$el.find(".ebp-content-container .page-management")[0];
			this.pageManagement = new pos.PageManagement(pageManagementHTML, {});

			this.initPageList();

			this.currentPage = -1;
			this.indexPage = this.options.index;

			this.topicList = [];

			//this.resetCharacterList();
		},

		initPageList: function() {
			this.pageList = [
				//page.UserLandingScreen
				//page.UserHousing,
				//page.UserOccupation,
				page.AboutYouPage,
				page.ChildrenChoosingPage,
				page.UserDependent,				
				page.UserHousing,
				page.YourDreamPage,
				page.LifeStageNeedPage,
				page.YourConcernPage,
				page.GTKYSummaryPage  
			];

			//properties associated with the page
			this.pageListProps =[
				{
					fullWidth:false,
					hideHeader:false
				},
				{
					fullWidth:false,
					hideHeader:false
				},
				{
					fullWidth:false,
					hideHeader:false
				},
				{
					fullWidth:false,
					hideHeader:false
				},
				{
					fullWidth:false,
					hideHeader:false
				},
				{
					fullWidth:false,
					hideHeader:true
				},
				{
					fullWidth:false,
					hideHeader:false
				},
				{
					fullWidth:true,
					hideHeader:true
				}
			]
		},

		initialize: function(data) {
			this.gettingToKnowYouData = data;

			this.initComponent();
			this.bindEvents(true);

			this.startApp();
		},

		//>>>>>>>>>>>>>>>>event handler >>>>>>>>>>>>
		pageCompleteAddedHandler: function(isAddEvent, pageAdded) {
			var self = this;
			//var pageObj = this.pageManagement.getCurrentPageInstance();
			var pageObj = pageAdded;
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

			this.updateLayoutByPageIndex(this.currentPage+1);


			if (this.pageManagement.isCurrentlyAnimating()) {
				return;
			}

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
			if (this.pageManagement.isCurrentlyAnimating()) {
				return;
			}

			if (this.pageManagement.canBack()) {

				this.updateLayoutByPageIndex(this.currentPage-1);

				//remove event for current page
				var currentPage = this.pageManagement.getCurrentPageInstance();
				this.pageCompleteAddedHandler(false, currentPage);

				this.currentPage = this.currentPage - 1;
				this.pageManagement.back();

				this.showPagination(this.currentPage);
			} else {
				//cancel page
				this.resetPage();
				this.cancelPage();
			}
		},


		/**
		 * update the shell layout based on the next or prev page
		 * @param pageIndex - the index of the next or prev page
		 */
		updateLayoutByPageIndex:function(pageIndex){


			//for summay page we hide the right  navigation
			var pageProp = this.pageListProps[pageIndex] || {};
			var fullWidth = pageProp.fullWidth;
			var hideHeader = pageProp.hideHeader;

			if (fullWidth) {
				//invisible the
				this.$el.find(".ebp-left-container").addClass("full-width");
				this.$el.find(".ebp-right-container").hide();
			}
			else{
				this.$el.find(".ebp-left-container").removeClass("full-width");
				this.$el.find(".ebp-right-container").show();
			}

			if (hideHeader) {
				this.$el.find(".ebp-background-header").hide();
				this.$el.find(".ebp-content-container").addClass("no-padding");
			}
			else{
				this.$el.find(".ebp-background-header").show();
				this.$el.find(".ebp-content-container").removeClass("no-padding");
			}

		},

		completePage: function() {
			/*
			if (!this.options.isStandalone) {
				var currentPage = this.pageManagement.getCurrentPageInstance();
				this.pageCompleteAddedHandler(false, currentPage);
			}
			*/
			this.$el.trigger("page_complete", [this.indexPage]);
		},

		cancelPage: function() {
			/*
			if (!this.options.isStandalone) {
				var currentPage = this.pageManagement.getCurrentPageInstance();
				this.pageCompleteAddedHandler(false, currentPage);
			}
			*/
			this.$el.trigger("page_cancel", [this.indexPage]);
		},

		startShowPage: function() {
			var firstClass = this.pageList[this.currentPage];
			console.log("==this.currentPage " + this.currentPage);
			this.pageManagement.nextPage(firstClass);

			// show Pagination
			this.showPagination(this.currentPage);
		},

		startApp: function() {
			this.currentPage = 0;
			this.startShowPage();
		},


		/**
		 * Add character only
		 * @param {[type]} character [description]
		 * @param {[type]} options   [description]
		 */
		addCharacter: function(character, options) {
			var opt = options || {};
			var marital = opt.marital || '';

			//sometimes the marital status is in the character
			if(!marital){
				marital = character.getMaritalStatus();
			}


			this.rightPanel.updateCharacter(character, marital);

		},

		/**
		 * Add Marital
		 */
		addMarital: function(chracter) {
			var maritalGender = this.getMaritalGender(chracter.getGender());
			// if Marital status is married
			var isMarried = data.ConfigData.isMarried(chracter.getMaritalStatus());

			this.rightPanel.updateCharacter(chracter, isMarried);

		},

		/**
		 * get marital gender
		 * @param  {[type]} gender [description]
		 * @return {[type]}        [description]
		 */
		getMaritalGender: function(gender) {
			var maritalGender = '';
			if (gender === data.CharacterData.MALE) {
				maritalGender = data.CharacterData.FEMALE;
			} else if (gender === data.CharacterData.FEMALE) {
				maritalGender = data.CharacterData.MALE;
			}

			return maritalGender;
		},

		addOccupation: function(occupationData) {

			/*
			var occupationTitle = data.ConfigData.getTitleByOccupationData(occupationData);
			var occupationClass = data.ConfigData.getOccupationClassByOccupationData(occupationData);
			console.log("==occupationData >> " + occupationData + " occupationTitle " + occupationTitle + "/occupationClass  " + occupationClass);
			var $objContainer = this.$el.find('.object-container');
			//empty the occupation container
			var $occupationContainer = $objContainer.find(".occupation-container");
			if ($occupationContainer.length > 0) {
				$occupationContainer.remove();
			}

			$occupationContainer = $("<div class='occupation-container'/>");
			var $childItem = $("<div class='obj-item' style='display:block;'>" +
				"<span class='icon-occupation " + occupationClass + "'/>" +
				"<p class='character-list-name'>" + occupationTitle + "</p>");

			$occupationContainer.append($childItem);
			$objContainer.append($occupationContainer);
			*/

			//
			//we must update the character display here based on the occupation
			//
		},

		updateDream: function(gettingToKnowYouData) {
			var dreamList = gettingToKnowYouData.getDreamList();

			this.rightPanel.updateDream(dreamList);
		},


		/**
		 * Add dependent to right panel list
		 * @param {[type]} character [description]
		 */
		addDependents: function(gettingToKnowYouData) {
			// dependents list
			var dependents = gettingToKnowYouData.getDependents();

			console.log("GettingToKnowYou::addDependents:", dependents);
			this.rightPanel.updateDependents(dependents, true);
		},

		updateChildrens: function(gettingToKnowYouData) {
			// dependents list
			var childrens = gettingToKnowYouData.getChildrens();

			console.log("GettingToKnowYou::addDependents:", childrens);
			this.rightPanel.updateDependents(childrens, false);
		},


		getClassNameByHouseType: function(houseType) {
			if (houseType === pos.SVGHousingItem.HOUSE_MORTGAGE) {

			}
		},

		/**
		 * add house
		 * @param {[type]} dataObj [description]
		 */
		addHousing: function(gettingToKnowYouData) {
			var housingData = gettingToKnowYouData.getHousing();
			this.rightPanel.updateHousing(housingData);

		},



		/**
		 * reset character list
		 * @return {[type]} [description]
		 */
		 /*
		resetCharacterList: function() {
			var $listCh = this.$el.find('.object-container');
			$listCh.empty();

		},*/

		resetPage: function(){
			//alert("resetPage");
			this.gettingToKnowYouData.resetData();
			this.rightPanel.reset();
			this.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_RESET);

			this.pageManagement.reset();
			this.currentPage = 0;
			this.startShowPage();
		},

		/**
		 * show Pagination
		 * @param  {[type]} index [description]
		 * @return {[type]}       [description]
		 */
		showPagination: function(index) {
			var $pag = this.$el.find('.pagination li');

			//
			$pag.removeClass('active').eq(index).addClass('active');

			//TODO: move this logic to rightPanel
			var count = this.pageList.length;
			this.rightPanel.progressBar.setMax(count - 2);
			this.rightPanel.progressBar.setValue(index);
			//alert("GettingToKnowYou::showPagination:"+index);
		},

		setData: function(gettingToKnowYouData) {
			this.gettingToKnowYouData = gettingToKnowYouData;
		}

	};

	// exports
	page.GettingToKnowYou = GettingToKnowYou;
}(page, jQuery, app.Templates, app.I18nHelper));