/* © 2014 Aleph-labs.com
 * @author Phuong Vo
 */
// namespace
var page = page || {};
page.retirement = page.retirement || {};
var pos = pos || {};
var data = data || {};

(function(retirement, $) {
	'use strict';

	/**
	 * RetirementLifeStyle component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function RetirementLifeStyle(element, options) {
		page.UserHousing.call(this, element, options);
	}

	RetirementLifeStyle.VERSION  = '3.3.1';
	RetirementLifeStyle.STATE_RETIREMENT_EDUCATION = "retirement_education";

	RetirementLifeStyle.DETAIL_X_POS = -150;
	RetirementLifeStyle.DEFAULTS = {
		// no defaults for now
		isDebug:true,
		isStandalone: false,
		isMobileWebSimulator : false
	};

	RetirementLifeStyle.prototype = {
		constructor: RetirementLifeStyle,
		retirementEducation: null,

		retirementPlanData: null,

		initialize: function(element, options) {
			if (element) {
				this.$el  = $(element);
			} else {
				this.$el = $(this.getDocumentHTML());
			}

			this.el = this.$el[0];
			this.options   = $.extend({}, RetirementLifeStyle.DEFAULTS, options);
		},

		render: function() {
			console.log("===render " + this.options.isStandalone);
			var emotionalFundData = new data.EmotionalFactFindingData();
			emotionalFundData.getGettingToKnowYouData().setGender(data.CharacterData.MALE);
			emotionalFundData.getGettingToKnowYouData().setAge(data.CharacterData.AGE_DEFAULT_MAN);
			emotionalFundData.getGettingToKnowYouData().setMaritalStatus(data.ConfigData.MARITAL_MARRIED.toString());

			if (this.options.isStandalone) {
				this.initComponent();
				this.bindEvents(true);

				this.setData(emotionalFundData);
			}
		},

		//override UserHousing for set it's own data
		publishData: function() {
			var lifeTypeData = new data.retirement.RetirementLifeStyleData();
			lifeTypeData.setType(this.currentHouse.getLifeType());
			lifeTypeData.setRetirementAge(30);

			this.retirementPlanData.setLifeStyle(lifeTypeData);
			this.retirementPlanData.publish(data.retirement.RetirementPlanData.EVENT_CHANGE_LIFE_STYLE);
		},

		initComponent: function() {
			page.UserHousing.prototype.initComponent.call(this);

			this.retirementEducation = new pos.NewSlider(this.$el.find('.retirement-education'), {
				value: 20,
				minValue: 0,
				maxValue: 100000
			});
			this.retirementEducation.$el.hide();
		},

		createHouseForAnimation: function(event) {
			var $el = $(event.target);
			var id = $el.closest('.characters-list').index();

			var houseType = "";
			if (id === "0" || id === 0) {
				houseType = data.retirement.RetirementLifeStyleData.TYPE_BASIC;
			}
			if (id === "1" || id === 1) {
				houseType = data.retirement.RetirementLifeStyleData.TYPE_MODERATE;
			}
			if (id === "2" || id === 2) {
				houseType = data.retirement.RetirementLifeStyleData.TYPE_CARE_FREE;
			}
			if (id === "3" || id === 3) {
				houseType = data.retirement.RetirementLifeStyleData.TYPE_LUXURY;
			}

			if (this.currentHouse) {
				this.currentHouse.updateLayout(pos.SVGItem.STATIC_IMAGE);
			}
			this.dragHouse = new pos.SVGLifeStyle(null, {

	    		});
			this.$el.find('.left-container').append(this.dragHouse.$el);
			this.dragHouse.initialize(houseType);
		},

		startToTargetAnimation: function() {
			var self = this;

			var x = (this.$middleSection.width() - this.dragHouse.$el.width()) / 2;
			var y = this.$el.find('.content-container').offset().top;

			y = 350;

			if (this.currentHouse) {
				this.currentHouse.$el.fadeOut(400, function() {
					this.remove();
				});
			}

			this.dragHouse.$el.animate({
				"left" : x,
				"top": y
			},  500, "swing", function() {
				self.completeChoosingCharacterAnimation();
			});
		},

		animateToDetailRetirementEducation: function() {
			this.pageState = page.UserHousing.STATE_ANIMATING;
			var self = this;

			this.customer.$el.animate({
				"left": RetirementLifeStyle.DETAIL_X_POS
			}, 500, "swing", function() {
				self.retirementEducation.$el.fadeIn(500, function() {
					self.pageState = RetirementLifeStyle.STATE_RETIREMENT_EDUCATION;
				});
			});

			this.currentHouse.$el.fadeOut(500, function() {

			});
		},

		animateFromDetailToList: function() {
			var self = this;
			var xPos = this.$el.find(".left-container").width() - page.UserHousing.INIT_CUSTOMER_X_RIGHT - this.customer.$el.width();
			self.retirementEducation.$el.fadeOut(500, function() {
				self.pageState = RetirementLifeStyle.STATE_RETIREMENT_EDUCATION;
				self.customer.$el.animate({
					"left": xPos
				}, 500, "swing", function() {
					self.pageState = page.UserHousing.STATE_START_CHOOSE_HOUSE;
				});

				self.currentHouse.$el.fadeIn(500, function() {

				});
			});
		},

		setData: function(emotionalFactFindingData) {
			page.UserHousing.prototype.setData.call(this, emotionalFactFindingData.getGettingToKnowYouData());
			this.retirementPlanData = emotionalFactFindingData.getRetirementPlanData();
			var self = this;

			this.customer.$el.on("click", function() {
				/*
				if (self.pageState === page.UserHousing.STATE_START_CHOOSE_HOUSE && self.currentHouse !== null) {
					self.animateToDetailRetirementEducation();
				} else if (self.pageState === RetirementLifeStyle.STATE_RETIREMENT_EDUCATION)  {
					self.animateFromDetailToList();
				}
				*/

			});
		},

		navigationPage: function(isNext) {
			var self = this;
			if (isNext) {
				if (self.pageState === page.UserHousing.STATE_START_CHOOSE_HOUSE && self.currentHouse !== null) {
					self.animateToDetailRetirementEducation();
				} else if (self.pageState === RetirementLifeStyle.STATE_RETIREMENT_EDUCATION)  {
					page.UserHousing.prototype.navigationPage.call(this, isNext);
				}
			} else {
				if (self.pageState === RetirementLifeStyle.STATE_RETIREMENT_EDUCATION)  {
					self.animateFromDetailToList();
				} else {
					page.UserHousing.prototype.navigationPage.call(this, isNext);
				}
			}
		},

		getDocumentHTML : function() {
			return 	"<div class='emotional-retirement-life-style'> \
					<div class='left-container'> \
						<div class='header'> \
							<div class='container'> \
								<div class='characters-list'> \
									<div class='inner'> \
									<div class='character-icon icon-retirement-life-style-basic'></div> \
									<p class='title'>BASIC</p> \
									</div> \
								</div> \
								<div class='characters-list'> \
									<div class='inner'> \
									<div class='character-icon icon-retirement-life-style-moderate'></div> \
									<p class='title'>MODERATE</p> \
									</div> \
								</div> \
								<div class='characters-list'> \
									<div class='inner'> \
									<div class='character-icon icon-retirement-life-style-care-free'></div> \
									<p class='title'>CARE-FREE</p> \
									</div> \
								</div> \
								<div class='characters-list'> \
									<div class='inner'> \
									<div class='character-icon icon-retirement-life-style-luxury'></div> \
									<p class='title'>LUXURY</p> \
									</div> \
								</div> \
							</div> \
						</div> \
						<div class='middle'> \
							<p class='title'>Retirement Lifestyle</p> \
							<div class='control-container'> \
								<p class='previous'>PREVIOUS</p> \
								<p class='next'>NEXT</p> \
							</div> \
						</div> \
						<div class='content-container'> \
							<div class='new-slider-component single white retirement-education'> \
								<div class='content clearfix'> \
									<label class='label'>RETIREMENT EDUCATION</label> \
									<input type='text' name='fname' class='textinput'> \
								</div> \
								<div class='slider-container'></div> \
							</div> \
						</div> \
					</div> \
				</div>";
		}



	};

	var temporaryObj = RetirementLifeStyle.prototype;
	RetirementLifeStyle.prototype = Object.create(page.UserHousing.prototype);
	$.extend(RetirementLifeStyle.prototype, temporaryObj);

	// exports
	retirement.RetirementLifeStyle = RetirementLifeStyle;
}(page.retirement, jQuery));