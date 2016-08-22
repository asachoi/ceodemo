/* © 2014 Aleph-labs.com
 * @author Phuong VO
 */
// namespace
var page = page || {};

(function(page, $) {
	'use strict';

	/**
	 * AnimationPageSVG component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function AnimationPageSVG(element, options) {
		this.$el  = $(element);
		this.el = this.$el[0];
		// store this instance to data object so that I can retrieve it later
		this.$el.data('protection_analysis', this);
		//
		this.options   = $.extend({}, AnimationPageSVG.DEFAULTS, options);

		this.initComponent();
		this.bindEvents();
	}

	AnimationPageSVG.VERSION  = '3.3.1';

	//page state
	AnimationPageSVG.STATE_START_CHOOSE_CHARACTER = "start_choose_character";
	AnimationPageSVG.STATE_CHOOSING_CHARACTER_ANIMATING = "choosing_character_animating";
	AnimationPageSVG.STATE_CHARACTER_INPUT_INFORMATION = "character_input_animating";
	AnimationPageSVG.STATE_REMOVING_CHARACTER_ANIMATING = "removing_character_animating";

	AnimationPageSVG.DEFAULTS = {
		// no defaults for now
		isDebug:true
	};


	AnimationPageSVG.prototype = {
		constructor: AnimationPageSVG,

		$el: null,
		el: null,

		//for character animation
		$smallLady: null,
		$smalMan: null,
		bigLady: null,
		$bigLady: null,

		clickPosOnLadyX: -1,
		clickPosOnLadyY: -1,

		pageState: "",	//state for page

		targetPosX: 50,
		targetPosY: 200,

		//for content
		$middleSection: null,
		$contentContainer: null,
		educationRadioControl: null,
		maritalStatusRadioControl: null,

		//for testing
		$testArea: null,

		bindEvents: function() {
			var self = this;
			this.$smallLady.on("mousedown touchstart", function(events) {
				events.stopPropagation();
				events.preventDefault();
				self.startClickCharacter(events);
			});
		},

		activeMouseEvent: function(isActive) {
			var self = this;
			if (isActive) {
				this.$el.on("mousemove touchmove", function(events) {
					events.stopPropagation();
					self.startDragCharacter(events);
				});

				this.$el.on("mouseup touchend", function(events) {
					events.stopPropagation();
					self.endDragCharacter(events);
				});
			} else {
				this.$el.off("mousemove touchend");
				this.$el.off("mouseup touchmove");
			}
		},

		startClickCharacter: function(events) {
			//dont allow click if  we still have animationing
			if (this.pageState !== AnimationPageSVG.STATE_START_CHOOSE_CHARACTER) {
				return;
			}

			this.pageState = AnimationPageSVG.STATE_CHOOSING_CHARACTER_ANIMATING;

			var documentX = events.originalEvent.pageX;
			var documentY = events.originalEvent.pageY;

			var ladyOffset = this.$smallLady.offset();
			this.clickPosOnLadyX = documentX - ladyOffset.left;
			this.clickPosOnLadyY = documentY - ladyOffset.top;

			this.log("==clickPosOnLadyX " + this.clickPosOnLadyX + " / clickPosOnLadyY = " + this.clickPosOnLadyY);

			//update position of big lady
			this.resetBigLady();
			this.showBigLady(true);

			this.activeMouseEvent(true);
		},

		startDragCharacter: function(events) {
			var documentX = events.originalEvent.pageX;
			var documentY = events.originalEvent.pageY;

			var characterOffsetX = documentX - this.clickPosOnLadyX;
			var characterOffsetY = documentY - this.clickPosOnLadyY;

			this.log("==characterOffsetX " + characterOffsetX + " / characterOffsetY = " + characterOffsetY);

			//update big lady position
			this.$bigLady.offset({"left":characterOffsetX,"top":characterOffsetY});
		},

		endDragCharacter: function(events) {
			var self = this;
			this.activeMouseEvent(false);

			//check if lady position is in middle section
			var middleYPos = this.$middleSection.offset().top;
			if (this.$bigLady.offset().top < middleYPos) {
				this.resetBigLady();
				this.pageState = AnimationPageSVG.STATE_START_CHOOSE_CHARACTER;
			} else {
				this.startToCenterAnimation();
			}
		},

		startToCenterAnimation: function() {
			var self = this;
			//get center point
			//var centerPointX = this.$el.width() / 2 - this.$bigLady.width() / 2;
			//var centerPointY = this.$el.height() / 2 - this.$bigLady.height() / 2;
			var centerPointX = this.$middleSection.width() / 2 - this.$bigLady.width() / 2;
			this.$bigLady.animate({
				"left" : centerPointX,
				//"top": centerPointY
				"top": self.targetPosY
			}, 500, "swing", function() {
				setTimeout(function() {
					self.startToTargetAnimation();
				}, 500);
			});
		},

		startToTargetAnimation: function() {
			var self = this;

			this.$bigLady.animate({
				"left" : self.targetPosX,
				"top": self.targetPosY
			}, 500, "swing", function() {
				//self.completeChoosingCharacterAnimation();
				self.fadinContentContainer();
			});
		},

		completeChoosingCharacterAnimation: function() {
			this.log("completeChoosingCharacterAnimation");
			this.pageState = AnimationPageSVG.STATE_CHARACTER_INPUT_INFORMATION;

			/*
			this.bigLady.fadInAgeSection();
			this.bigLady.activeAction(true);

			var self = this;
			this.$bigLady.swipe({
				//Generic swipe handler for all directions
				swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
					self.startRemoveCharacter();
				},
				//Default is 75px, set to 0 for demo so any distance triggers swipe
			   	threshold:10
			});
*/
		},

		initComponent: function() {
			console.log("==initComponent");
			this.$smallLady = this.$el.find(".lady-small");
			this.$smalMan = this.$el.find(".man");
			this.$bigLady = this.$el.find(".big-lady");
			/*
			var imageList = ["../images/lady_big_40.png",
				"../images/lady_big_50.png",
				"../images/lady_big_60.png",
				"../images/lady_big_70.png",
				"../images/lady_big_80.png",
				"../images/lady_big_90.png",
				"../images/lady_big_100.png"
			];

	    		this.bigLady = new pos.CharacterAge(".character-age", {
	    			"ageImageList": imageList,
	    			"ageMin" : 20,
	    			"ageMax" : 80,
	    			"initAge" : 50,
	    			"isActiveEvent": false
	    		});
	    		this.$bigLady = this.bigLady.$el;
	    		*/

			this.$testArea = this.$el.find(".test");
			this.$testArea.hide();

			this.$middleSection = this.$el.find(".middle");

			//for content container
			this.$contentContainer = this.$el.find(".content-container");
			this.$contentContainer.hide();
			var educationRadioHTML = this.$el.find(".education-field .radio-group")[0];
			this.educationRadioControl = new pos.RadioGroup(educationRadioHTML, {

			});
			var maritalStatusRadioHTML = this.$el.find(".marital-status-field .radio-group")[0];
			this.maritalStatusRadioControl = new pos.RadioGroup(maritalStatusRadioHTML, {

			});

			this.pageState = AnimationPageSVG.STATE_START_CHOOSE_CHARACTER;

			this.resetBigLady();
		},

		//pay attention on the hide of this.$bigLady, sometime, it make offset function not correct
		showBigLady: function(isShow) {
			if (isShow) {
				this.$bigLady.css({"opacity" : "1"});
			} else {
				this.$bigLady.css({"opacity" : "0"});
			}
		},

		resetBigLady: function() {
			var ladyOffset = this.$smallLady.offset();
			//this.$bigLady.offset({"left":ladyOffset.left,"top":ladyOffset.top});
			this.$bigLady.offset({"left":0,"top":0});
			this.showBigLady(false);
		},

		fadinContentContainer: function() {
			var self = this;
			this.$contentContainer.fadeIn(500, function() {
				self.completeChoosingCharacterAnimation();
			});
		},

		//animation, logic for content container
		fadOutContentContainer: function() {
			var self = this;
			this.$contentContainer.fadeOut(1000, function() {

			});
		},

		startRemoveCharacter: function() {
			var self = this;
			this.bigLady.activeAction(false);

			this.fadOutContentContainer();
			//this.$bigLady.fadeOut(1000, function() {
				//self.completeAnimationForRemoving();
			//});
			this.resetBigLady();
			this.completeAnimationForRemoving();
		},

		completeAnimationForRemoving: function() {
			this.log("==completeAnimationForRemoving");
			this.pageState = AnimationPageSVG.STATE_START_CHOOSE_CHARACTER;
		},

		log: function(msg) {
			if (this.options.isDebug) {
				console.log(msg);
			}
		}

	};

	// exports
	page.AnimationPageSVG = AnimationPageSVG;
}(page, jQuery));