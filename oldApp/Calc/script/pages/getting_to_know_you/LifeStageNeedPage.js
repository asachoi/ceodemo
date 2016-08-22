/* © 2014 Aleph-labs.com
 * @author Thang Kieu, Phuong Vo
 */
// namespace
var page = page || {};
var pos = pos || {};
var data = data || {};

(function(page, $, Templates, I18nHelper, FormUtils, LifeStageData) {
	'use strict';

	/**
	 * LifeStageNeedPage component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function LifeStageNeedPage(element, options) {
		this.initialize(element, options);
		this.render();
	}

	LifeStageNeedPage.VERSION  = '3.3.1';


	LifeStageNeedPage.EVENT_NEXT = "event_next";
	LifeStageNeedPage.EVENT_PREVIOUS = "event_previous";

	LifeStageNeedPage.STATE_ANIMATING = "state_animating";
	LifeStageNeedPage.STATE_START_CHOOSE_HOUSE = "state_start_choose_house";

	LifeStageNeedPage.INIT_CUSTOMER_X_RIGHT = -140;
	LifeStageNeedPage.INIT_CUSTOMER_Y_BOTTOM = 70;

	LifeStageNeedPage.DEFAULTS = {
		// no defaults for now
		isDebug:true,
		isStandalone: false,
		isMobileWebSimulator : false
	};


	LifeStageNeedPage.prototype = {
		constructor: LifeStageNeedPage,

		$el: null,
		el: null,

		isDisabledEvent: true,

		customerCharacter: null,
		coupleCharacter: null,

		// middle section
		$middleSection: null,

		customer: null,

		currentHouse: null,
		dragHouse: null,

		pageState: null,

		gettingToKnowYouData: null,

		$nextSwipeBtn: null,
		$prevSwipeBtn: null,
		swipeInstance: null,
		formFields: null,

		protectionCB: null,
		investingSavingCB: null,
		retirementCB: null,
		otherPlanCB: null,

		lifeStyleData: null,

		initialize: function(element, options) {
			if (element) {
				this.$el  = $(element);
			} else {
				this.$el = $(this.getDocumentHTML());
			}

			this.el = this.$el[0];
			this.options   = $.extend({}, LifeStageNeedPage.DEFAULTS, options);
		},

		render: function() {
			this.gettingToKnowYouData = new data.GettingToKnowYouData();

			/*
			this.gettingToKnowYouData.setGender(data.CharacterData.MALE);
			this.gettingToKnowYouData.setAge(data.CharacterData.AGE_DEFAULT_MAN);
			this.gettingToKnowYouData.setMaritalStatus(data.ConfigData.MARITAL_MARRIED.toString());
			*/


			if (this.options.isStandalone) {
				this.initComponent();
				this.bindEvents(true);

				this.setData(this.gettingToKnowYouData);
			}
		},


		initComponent: function() {
			var self = this;
			this.$middleSection = this.$el.find(".middle");
			this.pageState = LifeStageNeedPage.STATE_START_CHOOSE_HOUSE;

			this.initSwipper();
			this.formFields = FormUtils.createInputWrappers(this.$el, []);

			this.protectionCB = this.formFields.protection;
			this.investingSavingCB = this.formFields.investing_and_saving;
			this.retirementCB = this.formFields.retirement;
			this.otherPlanCB = this.formFields.other_planning;
			this.otherPlanCB.$el.hide();
		},


		initSwipper:function(){
			var self = this;
			this.$nextSwipeBtn = this.$el.find(".icon-arrow-next");
			this.$prevSwipeBtn = this.$el.find(".icon-arrow-prev");
			this.swipeInstance = this.$el.find(".swiper-container").swiper({
				//Your options here:
				slidesPerView: 'auto',
				loop: false,
				onSlideChangeStart: function(swiper) {
					console.log("==onSlideChangeStart");
					//only apply the event after setData method
					if (!self.isDisabledEvent) {
						self.onSlideChanged(swiper.activeIndex, true);
					}

				}
			});
			this.$prevSwipeBtn.on("click", function(){
				if(!$(this).hasClass("disabled")){
					self.swipeInstance.swipePrev();
				}
			});
			this.$nextSwipeBtn.on("click", function(){
				if(!$(this).hasClass("disabled")){
					self.swipeInstance.swipeNext();
				}
			});

			//show the first label
			//this.onSlideChanged(0);
			//default value
		},

		convertIndexSwipeToLifeStyle: function(index) {
			var lifeStageType = data.LifeStageData.LIFE_STAGE_NOT_INDENTIFY;
			if (index === 0 || index === "0") {
				lifeStageType = data.LifeStageData.LIFE_STAGE_CAREER_STARTER;
			}

			if (index === 1 || index === "1") {
				lifeStageType = data.LifeStageData.LIFE_STAGE_GETTING_MARRIED;
			}

			if (index === 2 || index === "2") {
				lifeStageType = data.LifeStageData.LIFE_STAGE_STARTING_FAMILY;
			}

			if (index === 3 || index === "3") {
				lifeStageType = data.LifeStageData.LIFE_STAGE_RETIRING;
			}

			return lifeStageType;
		},

		convertLifeStageTypeToIndexOfSwipe: function(lifeStyle) {
			var index = -1;
			switch(lifeStyle) {
				case LifeStageData.LIFE_STAGE_CAREER_STARTER:
					index = 0;
				break;
				case LifeStageData.LIFE_STAGE_GETTING_MARRIED:
					index = 1;
				break;
				case LifeStageData.LIFE_STAGE_STARTING_FAMILY:
					index = 2;
				break;
				case LifeStageData.LIFE_STAGE_RETIRING:
					index = 3;
				break;
			}

			return index;
		},

		onSlideChanged:function(index, isNeedNotifyEvent){
			var lifeStyleType = this.convertIndexSwipeToLifeStyle(index);
			this.lifeStyleData.setLifeStyleType(lifeStyleType);

			//we must show the appropiate label
			var $labels = this.$el.find(".slide-label");
			var $selectedLabel = this.$el.find(".slide-label:eq("+index+")");
			$labels.hide();
			$selectedLabel.removeClass("hidden");
			$selectedLabel.show();

			var $descriptions = this.$el.find(".slide-description");
			var $selectedDescription = this.$el.find(".slide-description:eq("+index+")");
			$descriptions.hide();
			$selectedDescription.removeClass("hidden");
			$selectedDescription.show();

			this.updateSlideNavigation();

			console.log("===onSlideChanged");

			this.investingSavingCB.setCheck(true, isNeedNotifyEvent);
			this.retirementCB.setCheck(true, isNeedNotifyEvent);
			this.protectionCB.setCheck(true, isNeedNotifyEvent);
		},


		updateSlideNavigation: function() {
            var slideCount  = this.swipeInstance.slides.length;
            var activeIndex = this.swipeInstance.activeIndex;

           	console.log("slideCount:"+slideCount+",activeIndex:"+activeIndex);

            if(activeIndex === 0){
                this.$prevSwipeBtn.addClass('disabled');
                this.$nextSwipeBtn.removeClass('disabled');
            }
            else if(activeIndex === slideCount-1){
                this.$prevSwipeBtn.removeClass('disabled');
                this.$nextSwipeBtn.addClass('disabled');
            }
            else{
            	this.$prevSwipeBtn.removeClass('disabled');
                this.$nextSwipeBtn.removeClass('disabled');
            }
        },


		/**
		 * bind event
		 * @param  {Boolean} isActiveEvent [description]
		 * @return {[type]}                [description]
		 */
		bindEvents: function(isActiveEvent) {
			var self = this;
			console.log("===isActiveEvent " + isActiveEvent);
			if (isActiveEvent) {

				//for next-previous button
				this.$el.find(".control-container .next").on("click", function() {
					//console.log("this.lifeStyleData ", self.lifeStyleData);
					self.navigationPage(true);
				});
				this.$el.find(".control-container .previous").on("click", function() {
					self.navigationPage(false);
				});

				// housing list
				this.$el.off().on('mousedown touchstart', '.character-icon', function(events) {
					events.stopPropagation();
					events.preventDefault();
					self.startClickCharacter(events);
				});

				this.protectionCB.$el.on(pos.CssCheckBox.CHANGE, function(event, isCheck) {
					self.lifeStyleData.setIsProtection(isCheck);
					self.publishData();
				});

				this.investingSavingCB.$el.on(pos.CssCheckBox.CHANGE, function(event, isCheck) {
					self.lifeStyleData.setIsInvestmentSaving(isCheck);
					self.publishData();
				});

				this.retirementCB.$el.on(pos.CssCheckBox.CHANGE, function(event, isCheck) {
					self.lifeStyleData.setIsRetirement(isCheck);
					self.publishData();
				});

				this.otherPlanCB.$el.on(pos.CssCheckBox.CHANGE, function(event, isCheck) {
					self.lifeStyleData.setIsOtherPlan(isCheck);
					self.publishData();
				});


				//update the layout of the container when window resizes
                $(window).resize(function(){
                    self.updateLayout();
                });
                this.updateLayout();

			} else {
				this.$el.find(".control-container .next").off("click");
				this.$el.find(".control-container .previous").off("click");

				this.$el.find('.character-icon').each(function() {
					self.$el.off('mousedown touchstart');
				});
			}
		},


		navigationPage: function(isNext) {
			var self = this;
			setTimeout(function() {
				if (isNext) {
					self.$el.trigger(LifeStageNeedPage.EVENT_NEXT);
				} else {
					self.$el.trigger(LifeStageNeedPage.EVENT_PREVIOUS);
				}
			}, 200);

		},


		showContent: function(){
			var self = this;
			this.$el.find(".content-container").animate({
                'opacity': 1
            },
            {
                duration: 1000,
                specialEasing: {
                    opacity: 'linear'
                }
            });
		},

		log: function(msg) {
			if (this.options.isDebug) {
				console.log(msg);
			}
		},


		//>>>>>>>>>>>>>>for pageElement event >>>>>>>>>>>>
		getDocumentHTML : function() {
			var template = Templates.getTemplate('user-life-stage');
			var model = {
				items:LifeStageData.LIFE_STAGE_RANGE
			};
			return template(model);
		},

		onRender: function() {
			this.log("==LifeStageNeedPage onRender " );
			this.initComponent();
			this.bindEvents(true);
			this._initialized = true;
		},

		onDestroy: function() {
			this.log("==LifeStageNeedPage onDestroy ");
			this.bindEvents(false);
		},


		publishData: function(){
			console.log("YourLifeStageNeedPage::publishData:", this.lifeStyleData);
			if (this.lifeStyleData) {
				this.gettingToKnowYouData.setLifeStage(this.lifeStyleData);
			}
			this.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_LIFESTAGE);
		},


		setData: function(dataObj) {
			this.isDisabledEvent = true;
			console.log("==setData " + dataObj.getGender());
			this.gettingToKnowYouData = dataObj;

			//set the lifeStageType
			this.lifeStyleData = this.gettingToKnowYouData.getLifeStage();
			if (this.lifeStyleData === null) {
				//we use default here
				this.lifeStyleData = data.LifeStageData.GetDefaultInstance();
				this.gettingToKnowYouData.setLifeStage(this.lifeStyleData);
			}

			//update the swipe
			var indexOfSwipe = this.convertLifeStageTypeToIndexOfSwipe(this.lifeStyleData.getLifeStyleType());
			this.swipeInstance.swipeTo(indexOfSwipe);
			this.onSlideChanged(indexOfSwipe, false);

			//update checkbox
			var isProtection = this.lifeStyleData.getIsProtection();

			this.protectionCB.setCheck(isProtection, false);

			var isInvestSaving = this.lifeStyleData.getIsInvestmentSaving();
			this.investingSavingCB.setCheck(isInvestSaving, false);

			var isRetirement = this.lifeStyleData.getIsRetirement();
			this.retirementCB.setCheck(isRetirement, false);

			var isOtherPlan = this.lifeStyleData.getIsOtherPlan();
			this.otherPlanCB.setCheck(isOtherPlan, false);

			console.log("====isProtection " + isProtection + " / " + isInvestSaving + " / " + isOtherPlan);

			this.updateLayout();

			this.isDisabledEvent = false;
		},

		onStart: function() {
			this.showContent();
		},


		/**
        * update the position of the container when the window resizes
        */
        updateLayout: function(){
            var $container =  this.$el.find(".content-container");
            var $parent = this.$el.find(".middle-wrapper");
            var containerHeight = $container.height();

            if(containerHeight < 520){
            	containerHeight = 520; //this is needed to avoid cropping of longest description
            }

            var pHeight = $parent.height();

            var pTop = $parent.find(">.title").height();

            var pBottom = $parent.find(".next").height();

            var parentAvaibleHeight =    pHeight  - pTop - pBottom;
            var offset = 0; //arbitrary
            var toT = (parentAvaibleHeight - containerHeight)/2 + pTop - offset;
            var titleBottom = 70;
            if(toT  < titleBottom){
            	toT = titleBottom;
            }

            $container.css("top", toT+"px");

			console.log("LifeStageNeedPage::updateLayout:",titleBottom, toT);


        }

	};


	var temporaryObj = LifeStageNeedPage.prototype;
	LifeStageNeedPage.prototype = Object.create(pos.PageElement.prototype);
	$.extend(LifeStageNeedPage.prototype, temporaryObj);

	// exports
	page.LifeStageNeedPage = LifeStageNeedPage;
}(page, jQuery, app.Templates, app.I18nHelper, app.FormUtils, data.LifeStageData));