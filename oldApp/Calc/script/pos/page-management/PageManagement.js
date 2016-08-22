/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var pos = pos || {};

(function(pos, $) {
	'use strict';

	/**
	 * PageManagement component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function PageManagement(element, options) {
		this.$el  = $(element);
		this.el = this.$el[0];
		// store this instance to data object so that I can retrieve it later
		this.$el.data('page_management', this);
		//
		this.options   = $.extend({}, PageManagement.DEFAULTS, options);

		this._initComponent();
		this._bindEvents();
	}

	PageManagement.VERSION  = '3.3.1';

	PageManagement.DEFAULTS = {
		isDebug : true
	};

	PageManagement.BASE_PAGE = pos.PageElement;

	PageManagement.POSITION_NEXT = 1;
	PageManagement.POSITION_PREVIOUS = -1;
	PageManagement.POSITION_CURRENT = 0;

	PageManagement.MOVE_NEXT = 10;
	PageManagement.MOVE_BACK = 11;
	PageManagement.MOVE_STAND = 12;

	PageManagement.EVENT_COMPLETE_ANIMATION = "event_complete_animation";
	PageManagement.EVENT_NEW_PAGE_ADDED = "event_new_page_added";

	PageManagement.prototype = {
		constructor: PageManagement,

		$el: null,
		el: null,

		//container
		$pageContainer: null,

		//history
		pageClassListHistory: null,
		pageDataHistory: null,

		//current and next item
		nextPageInstance: null,
		nextPageClass: null,
		currentPageClass: null,
		currentPageInstance: null,

		isAnimating: false,


		_bindEvents: function() {

		},

		_initComponent: function() {
			this.pageClassListHistory = [];
			this.pageDataHistory = [];

			this.$pageContainer = this.$el.find(".page-container");

			this.isAnimating = false;
		},

		reset: function() {
			this.pageClassListHistory = [];
			this.pageDataHistory = [];
			this.isAnimating = false;

			if (this.currentPageInstance) {
				this.currentPageInstance.onDestroy();
				this.currentPageInstance.$el.stop();
				this.currentPageInstance.$el.remove();
			}

			this.currentPageInstance = null;
			this.currentPageClass = null;

			//reset next item
			this.nextPageClass = null;
			this.nextPageInstance = null;
		},


		//>>>>>>>>>> render method >>>>>>
		_createNextElement: function() {
			this.log("_createNextElement");
			if (this.nextPageClass) {
				var PageClass = this.nextPageClass;
				//if (PageClass && PageClass  === PageManagement.BASE_PAGE) {
				if (PageClass) {
					var pageInstance = new PageClass(null, {});

					//disable the page first
					this.nextPageInstance = pageInstance;
				} else {
					this.log("=next page is not instance of base class");
				}
			} else {
				this.log("out of range in rendering next element");
			}
		},

		/**
		 * [_performAnimaton description]
		 * @param  {[type]} moveType [description]
		 * @return {[type]}          [description]
		 * Step :
		 * 		1/If Next
		 * 			+ render next item
		 * 			+ save state of current item
		 * 			+perform animation on next item
		 * 			+ when complete =>remove the old one, push pageClass into classList
		 * 			+notify the onStart event
		 */
		_performAnimaton: function(moveType) {
			if (!this.nextPageInstance) {
				return;
			}

			this.isAnimating = true;

			var self = this;
			if (!this.currentPageInstance) { //for the first time
				this.log("==at the first time");
				//render the next instance
				this._renderElementAtPosition(PageManagement.POSITION_CURRENT);

				//store data and update history
				this.completeAnimationHandler(PageManagement.MOVE_STAND);

			} else {
				var targetPositionType = PageManagement.POSITION_NEXT;
				if (moveType === PageManagement.MOVE_BACK) {
					targetPositionType = PageManagement.POSITION_PREVIOUS;
				}

				//render the next one
				this._renderElementAtPosition(targetPositionType);


				//store next data or restore previous data base on moveType
				if (moveType === PageManagement.MOVE_NEXT) {
					//store current item data
					var dataObjForCurrent = this.currentPageInstance.onSavingState();
					this.pageDataHistory.push(dataObjForCurrent);
				} else if (moveType === PageManagement.MOVE_BACK)  {
					//prepare to update data when back
					this.nextPageInstance.onRestoreState(this.pageDataHistory[this.pageDataHistory.length - 1]);
					this.pageDataHistory.pop();
				}

				//perform animation
				//this.doSlideAnimation();
				//this.doSlideFadeInAnimation(moveType);
				this.doFadInFadInAnimation(moveType);
			}
		},

		//kind of animation here
		doSlideAnimation: function(moveType) {
			this.nextPageInstance.$el.animate({
				"left" : "0px",
				"top": "0px"
			}, 1000, "swing", function() {
				// self.completeAnimationHandler(moveType);
			});
		},

		doSlideFadeInAnimation: function(moveType) {
			var self = this;
			var targetXPos = moveType === PageManagement.MOVE_BACK ? this.currentPageInstance.$el.width() + 100 : -(this.currentPageInstance.$el.width() + 100);

			this.currentPageInstance.$el.stop();
			this.currentPageInstance.$el.animate({
				"left" : targetXPos
			},  {
				duration: 500,
				specialEasing: {
					opacity: "easeInQuad"
				},
				complete: function() {
					console.log("=complete move the current page");
					self.completeAnimationHandler(moveType);
				}
			});

			/*
			this._animateCurrentPage(moveType);
			this._animateNextPage();
			*/

			//setTimeout(function() {
				self.nextPageInstance.$el.css({
					"opacity": 0,
					"left" : "0px",
					"top": "0px"
				});

				self.nextPageInstance.$el.animate({
					"opacity" : 1
				},  {
					duration: 2000,
					specialEasing: {
						opacity: "easeInQuad"
					},
					complete: function() {
						//place the method here to make sure the nextPageInstance is only destroyed after
						//animation is completed
						//self.completeAnimationHandler(moveType);
					}
				});
			//}, 200);
		},

		doFadInFadInAnimation: function(moveType) {
			var self = this;
			var targetXPos = moveType === PageManagement.MOVE_BACK ? this.currentPageInstance.$el.width() + 100 : -(this.currentPageInstance.$el.width() + 100);

			this.currentPageInstance.$el.stop();
			this.currentPageInstance.$el.animate({
				"opacity" : 0
			},  {
				duration: 500,
				specialEasing: {
					opacity: "easeOutQuint"
				},
				complete: function() {
					console.log("=complete move the current page");
					self.completeAnimationHandler(moveType);
				}
			});

			/*
			this._animateCurrentPage(moveType);
			this._animateNextPage();
			*/

			//setTimeout(function() {
				self.nextPageInstance.$el.css({
					"opacity": 0,
					"left" : "0px",
					"top": "0px"
				});

				self.nextPageInstance.$el.animate({
					"opacity" : 1
				},  {
					duration: 2000,
					specialEasing: {
						opacity: "easeInQuad"
					},
					complete: function() {
						//place the method here to make sure the nextPageInstance is only destroyed after
						//animation is completed
						//self.completeAnimationHandler(moveType);
					}
				});
			//}, 200);
		},

		_animateCurrentPage:function(moveType){
			var self = this;
			var targetXPos = moveType ===PageManagement.MOVE_BACK ? this.currentPageInstance.$el.width() + 100 : -(this.currentPageInstance.$el.width() + 100);
			this.currentPageInstance.$el.stop();
			this.currentPageInstance.$el.animate({
				"left" : targetXPos
			},  {
				duration: 500,
				specialEasing: {
					opacity: "easeOutQuint"
				},
				complete: function() {
					self.completeAnimationHandler(moveType);
				}
			});
		},


		_animateNextPage:function(){
			var self = this;

			//Ernie - 20150422
			//We need to check if the next page is trully loaded before we do the transition
			//if not we need to wait more
			clearTimeout(this.animateNextPageTimeoutId);
			if(self.nextPageInstance.$el !== undefined && self.nextPageInstance.$el !== null){
				self._doAnimateNextPage();
			}
			else{
				this.animateNextPageTimeoutId = setTimeout(function() {
					self._animateNextPage();
				}, 200);
			}

		},

		_doAnimateNextPage:function(){
			var self = this;
			self.nextPageInstance.$el.css({
				"opacity": 0,
				"left" : "0px",
				"top": "0px"
			});

			self.nextPageInstance.$el.animate({
				"opacity" : 1
			},  {
				duration: 2000,
				specialEasing: {
					opacity: "easeOutQuint"
				},
				complete: function() {
					console.log("==complete transition");
					//self.completeAnimationHandler(moveType);
				}
			});
		},


		_renderElementAtPosition: function(position) {
			var leftPosition = PageManagement.POSITION_CURRENT;
			var widthContainer = this.$pageContainer.width();
			switch(position) {
				case PageManagement.POSITION_NEXT:
					leftPosition = 1;
					break;
				case PageManagement.POSITION_PREVIOUS:
					leftPosition = -1;
					break;
				case PageManagement.POSITION_CURRENT:
					leftPosition = 0;
					break;
			}

			var targetXPosition = leftPosition * widthContainer;

			//update the position
			if (!this.nextPageInstance.$el.hasClass("page-element")) {
				this.nextPageInstance.$el.addClass("page-element");
			}
			this.$pageContainer.append(this.nextPageInstance.$el);
			this.nextPageInstance.$el.css({
				"left": targetXPosition + "px",
				"top": "0px"
			});

			//notify the event to page
			this.nextPageInstance.onRender();

			//permit
			this.$el.trigger(PageManagement.EVENT_NEW_PAGE_ADDED, [this.nextPageInstance]);
		},


		//>>>>>>>log >>>>>>>>>>>>>>>
		log: function(msg) {
			if (this.options.isDebug) {
				console.log(msg);
			}
		},

		//>>>>>>>event handler >>>>>>>>>
		completeAnimationHandler: function(moveType) {
			this.log("completeAnimationHandler = " + moveType);
			//remove current page instance from list
			if (this.currentPageInstance) {
				this.currentPageInstance.onDestroy();
				this.currentPageInstance.$el.stop();
				this.currentPageInstance.$el.remove();
			}

			//store the new one, and clear the next item
			if (moveType === PageManagement.MOVE_NEXT) {
				//this.pageClassListHistory.push(this.nextPageClass);
				this.pageClassListHistory.push(this.currentPageClass);
			} else if (moveType === PageManagement.MOVE_BACK) {
				//TODO : pay attention of the back to class method
				this.pageClassListHistory.pop();
			}

			this.currentPageInstance = this.nextPageInstance;
			this.currentPageClass = this.nextPageClass;

			//reset next item
			this.nextPageClass = null;
			this.nextPageInstance = null;

			this.currentPageInstance.onStart();

			this.isAnimating = false;

			this.$el.trigger(PageManagement.EVENT_COMPLETE_ANIMATION);
		},

		//>>>>>>>> public method >>>>>>>
		nextPage: function(nextPageClass) {
			if (this.isAnimating) {
				return;
			}

			this.nextPageClass = nextPageClass;

			this._createNextElement();
			this._performAnimaton(PageManagement.MOVE_NEXT);
		},

		previousPage: function(previousPageClass) {

		},

		getCurrentPageInstance: function() {
			return this.currentPageInstance;
		},

		//nextPageInstance maybe null,it is only available when nextPage is created
		//then it is will be null after transition
		getNextPageInstance: function() {
			return this.nextPageInstance;
		},

		//back one step
		back: function() {
			if (this.isAnimating) {
				return;
			}

			if (this.pageClassListHistory.length > 0) {
				this.nextPageClass = this.pageClassListHistory[this.pageClassListHistory.length - 1];

				this._createNextElement();
				this._performAnimaton(PageManagement.MOVE_BACK);
			}
		},

		canBack: function() {
			return this.pageClassListHistory.length > 0;
		},

		isCurrentlyAnimating: function() {
			return this.isAnimating;
		}

	};
	// exports
	pos.PageManagement = PageManagement;
}(pos, jQuery));