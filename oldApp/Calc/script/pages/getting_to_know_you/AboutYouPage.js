/* © 2014 Aleph-labs.com
 * @author Phuong VO
 */
// namespace
var page = page || {};
var pos = pos || {};
var data = data || {};


(function(page, $, Templates, I18nHelper, CharacterData, HeaderComponent, SwipeSelect) {
	'use strict';

	/**
	 * AboutYouPage component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function AboutYouPage(element, options) {


		this.options   = $.extend({}, AboutYouPage.DEFAULTS, options);
		this.options.element = element;

		this.insertToDOM();

		// store this instance to data object so that I can retrieve it later
		//this.$el.data('protection_analysis', this);
		this.gettingToKnowYouData = new data.GettingToKnowYouData();

		if (this.options.isStandalone) {
			this.initComponent();
			this.bindEvents(true);
		}

	}


	AboutYouPage.VERSION  = '3.3.1';

	//page state
	AboutYouPage.STATE_START_CHOOSE_CHARACTER = "start_choose_character";
	AboutYouPage.STATE_CHOOSING_CHARACTER_ANIMATING = "choosing_character_animating";
	AboutYouPage.STATE_CHARACTER_INPUT_INFORMATION = "character_input_animating";
	AboutYouPage.STATE_REMOVING_CHARACTER_ANIMATING = "removing_character_animating";

	AboutYouPage.EVENT_NEXT = "event_next";
	AboutYouPage.EVENT_PREVIOUS = "event_previous";

	AboutYouPage.SAVE_STATE = "ap_page_state";

	AboutYouPage.POS_BOTTOM = 70;
	AboutYouPage.POS_LEFT = -160;

	AboutYouPage.DEFAULTS = {
		// no defaults for now
		isDebug:true,
		isStandalone: false,
		isMobileWebSimulator: false
	};


	AboutYouPage.prototype = {
		constructor: AboutYouPage,

		$el: null,
		el: null,
		$container: null,


		$overlayView: null,

		gettingToKnowYouData: null,	//GettingToKnowYouData class

		//for character animation
		$smallLady: null,
		$smalMan: null,
		bigLady: null,
		$bigLady: null,

		clickPosOnLadyX: -1,
		clickPosOnLadyY: -1,

		pageState: "",	//state for page

		//for content
		$middleSection: null,
		$contentContainer: null,
		maritalStatusRadioControl: null,

		//for testing
		$testArea: null,

		//inputs
		ageSelect:null,
		occupationSelect:null,

		//control
		$controlContainer: null,
		$nextBtn: null,
		$previousBtn: null,

		bindEvents: function(isActiveEvent) {
			var self = this;

			if (isActiveEvent) {

				this.$smallLady.on("mousedown touchstart", function(events) {
					events.stopPropagation();
					events.preventDefault();
					self.startClickCharacter(events, true);
				});

				this.$smalMan.on("mousedown touchstart", function(events) {
					events.stopPropagation();
					events.preventDefault();
					self.startClickCharacter(events, false);
				});

				//for next-previous button
				this.$nextBtn.on("click", function() {
					self.nextPreviousPageHandler(true);
				});
				this.$previousBtn.on("click", function() {
					//self.previousPageHandler();
					self.nextPreviousPageHandler(false);
				});

				//TODO: we have one note for the flow updating date between age/occupation companent
				//and the character age
				//When character age change some data, it notify event to AboutYouPage =>
				//AboutYouPage update the age/occupation component, then age/Occupation component
				//notify the change event to AboutYouPage, then AboutYouPage will render the CharacterAge
				//again.. These flow may create the infinite loop
				//The solution is that in updateInputFields method, we must call the age/occupation component
				//to update itseft, without notify the change event to AboutYouPage, it will make the flow simpler
				//
				this.ageSelect.$el.on(SwipeSelect.EVENT_CHANGE, function(){
					self.gettingToKnowYouData.setAge(self.ageSelect.getValue());
					self.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_CUSTOMER);

					//we need to update the character display of the age
					//Note:bigLady is holder of the character regardless of gender
					self.bigLady.setSelectedAge(self.ageSelect.getValue());

				});

				this.occupationSelect.$el.on(SwipeSelect.EVENT_CHANGE, function(){
					//self.bigLady.renderOccupation(self.occupationSelect.getValue());
					self.bigLady.setOccupation(self.occupationSelect.getValue());

					self.gettingToKnowYouData.setOccupation(self.occupationSelect.getValue());
					self.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_OCCUPATION);

				});

				this.maritalStatusRadioControl.$el.on(pos.RadioGroup.ON_CHANGE, function() {
					self.gettingToKnowYouData.setMaritalStatus(self.maritalStatusRadioControl.getValue());
					console.log("==maritalStatus " + self.gettingToKnowYouData.getMaritalStatus());
					self.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_MARITAL);
				});

				//character event
				this.bigLady.$el.on(pos.CharacterAge.EVENT_CHANGE, function(events, targetCharacter, age) {
					//self.gettingToKnowYouData.setAge(self.bigLady.getSelectedAge());
					var roundAge = Math.round(age);

					self.gettingToKnowYouData.setAge(roundAge);

					/*
					//update identification character according to age
					var gender = data.CharacterData.getGenderByIdentification(self.gettingToKnowYouData.getIdentification());
					var identification = data.CharacterData.getIdentificationByAge(roundAge, gender);
					self.gettingToKnowYouData.setIdentification(identification);
					self.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_CUSTOMER);
					*/

					self.updateInputFields();

				});

				this.bigLady.$el.on(pos.CharacterAge.EVENT_START_DRAG, function(events, age) {
					//console.log("==EVENT_START_DRAG ");
					self.characterClickHandler(age);
				});

				this.bigLady.$el.on(pos.CharacterAge.EVENT_DRAGING, function(events, age) {
					//console.log("==EVENT_DRAGING ");
					self.characterDragHandler(age);
				});

				this.bigLady.$el.on(pos.CharacterAge.EVENT_END_DRAG, function() {
					//console.log("==EVENT_END_DRAG ");
					self.characterEndDragHandler();
				});

				this.bigLady.$el.on(pos.CharacterAge.EVENT_SWIPE, function(events, target) {
					console.log("==event swipe " + target);
					self.startRemoveCharacter();
				});


                //update the layout of the container when window resizes
                $(window).resize(function(){
                    self.updateLayout();
                });
                this.updateLayout();

			} else {
				this.$smallLady.off("mousedown touchstart");
				this.$nextBtn.off("click");
				this.$previousBtn.off("click");

				this.maritalStatusRadioControl.$el.off(pos.RadioGroup.ON_CHANGE);

				this.bigLady.$el.off(pos.CharacterAge.EVENT_CHANGE);
				this.bigLady.$el.off(pos.CharacterAge.EVENT_START_DRAG);
				this.bigLady.$el.off(pos.CharacterAge.EVENT_DRAGING);
				this.bigLady.$el.off(pos.CharacterAge.EVENT_END_DRAG);
				this.bigLady.$el.off(pos.CharacterAge.EVENT_SWIPE);
			}


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

		characterClickHandler: function(age) {
			this.$overlayView.fadeIn(500, function() {
				//self.completeChoosingCharacterAnimation();
			});

			this.$overlayView.find(".age-num").html(Math.round(age) + " years");
		},

		characterDragHandler: function(age) {
			this.$overlayView.find(".age-num").html(Math.round(age) + " years");
		},

		characterEndDragHandler: function() {
			this.$overlayView.fadeOut(500, function() {
				//self.completeChoosingCharacterAnimation();
			});
		},

		startClickCharacter: function(events, isSmallLady) {

			this.headerComponent.hideHintArrow();

			//dont allow click if  we still have animationing
			if (this.pageState !== AboutYouPage.STATE_START_CHOOSE_CHARACTER) {
				return;
			}

			if (isSmallLady) {
				this.chooseLadyCharacter();
			} else {
				this.chooseManCharacter();
			}

			this.pageState = AboutYouPage.STATE_CHOOSING_CHARACTER_ANIMATING;
			var documentX = events.originalEvent.pageX;
			var documentY = events.originalEvent.pageY;
			if (this.options.isMobileWebSimulator) {
				//TODO : why using originalEvent.targetTouches[0]????
				documentX = events.originalEvent.targetTouches[0].pageX;
				documentY = events.originalEvent.targetTouches[0].pageY;
			}

			var ladyOffset = this.$smallLady.offset();
			var ladyWidth = this.$smallLady.width();
			this.gettingToKnowYouData.setGender(data.CharacterData.FEMALE);

			if (!isSmallLady) {
				ladyOffset = this.$smalMan.offset();
				ladyWidth = this.$smalMan.width();
				this.gettingToKnowYouData.setGender(data.CharacterData.MALE);
			}

			this.clickPosOnLadyX = documentX - ladyOffset.left;
			this.clickPosOnLadyY = documentY - ladyOffset.top;

			this.log("==clickPosOnLadyX " + this.clickPosOnLadyX + " / clickPosOnLadyY = " + this.clickPosOnLadyY);

			//update position of big lady
			//this.resetBigLady();

			this.showBigLady(true);
			var imageOffset = this.bigLady.getImageOffsetPosition();
			this.$bigLady.offset({
				"left":ladyOffset.left - imageOffset.left - this.$bigLady.width() / 2,
				"top":ladyOffset.top - imageOffset.top
			});
			this.$bigLady.css("opacity",0);

			this.activeMouseEvent(true);

		},

		startDragCharacter: function(events) {
			var documentX = events.originalEvent.pageX;
			var documentY = events.originalEvent.pageY;
			if (this.options.isMobileWebSimulator) {
				//TODO : why using originalEvent.targetTouches[0]????
				documentX = events.originalEvent.targetTouches[0].pageX;
				documentY = events.originalEvent.targetTouches[0].pageY;
			}


			var characterOffsetX = documentX - this.clickPosOnLadyX;
			var characterOffsetY = documentY - this.clickPosOnLadyY;

			this.log("==characterOffsetX " + characterOffsetX + " / characterOffsetY = " + characterOffsetY);

			//update big lady position
			//this.$bigLady.offset({"left":characterOffsetX,"top":characterOffsetY});
			var imageOffset = this.bigLady.getImageOffsetPosition();
			this.$bigLady.offset({
				"left":characterOffsetX - imageOffset.left - this.$bigLady.width() / 2,
				"top":characterOffsetY - imageOffset.top
			});

			//if the user is dragging the header we must hide the dragDream
            var middleYPos = this.$el.find(".middle").offset().top + 110;
            if (this.$bigLady.offset().top < middleYPos) {
                this.$bigLady.css("opacity",0);
            }
            else{
                this.$bigLady.css("opacity",1);
            }

		},

		endDragCharacter: function(events) {
			this.activeMouseEvent(false);

			//check if lady position is in middle section
			var middleYPos = this.$middleSection.offset().top + 100;
			if (this.$bigLady.offset().top < middleYPos) {
				this.resetBigLady();
				this.pageState = AboutYouPage.STATE_START_CHOOSE_CHARACTER;
				this.gettingToKnowYouData.setGender(data.CharacterData.NOT_IDENTIFY);
			} else {
				this.startToCenterAnimation();
			}
		},

		startToCenterAnimation: function() {
			var self = this;

			var pt = this.getCharInitPosition();
			this.$bigLady.animate({
				"left" : pt.x,
				"top": pt.y
			}, 500, "swing", function() {
				setTimeout(function() {
					self.startToTargetAnimation();
				}, 500);
			});
		},

		startToTargetAnimation: function() {
			var self = this;

			 var pt = this.getCharFinalPosition();
			 this.$bigLady.animate({
				"left" : pt.x,
				"top": pt.y
			}, 500, "swing", function() {
				//self.completeChoosingCharacterAnimation();
				self.fadinContentContainer();
			});

		},



		getCharInitPosition: function(){
            var $wrappper = this.$el.find(".middle-wrapper");

            var target = this.$bigLady;

            var wWidth =  $wrappper.width();
            var wHeight =  $wrappper.height();
            var tWidth =  target.width();
            var tHeight =  target.height();

            var x =  wWidth/2  - tWidth / 2;
            var y =  wHeight/2  - tHeight / 2 + 20;

            console.log("UserHousing::getCharInitPosition:", wWidth, wHeight, tWidth, tHeight);

            return {x:x,y:y};
        },


		getCharFinalPosition: function(){
            var $wrappper = this.$el.find(".middle-wrapper");

            var target = this.$bigLady;

            var wWidth =  $wrappper.width();
            var wHeight =  $wrappper.height();
            var tWidth =  target.width();
            var tHeight =  target.height();

            var x =  wWidth/5  - tWidth / 2;
            var y =  wHeight/2  - tHeight / 2 + 20;

            console.log("UserHousing::getCharFinalPosition:", wWidth, wHeight, tWidth, tHeight);

            return {x:x,y:y};
        },


		completeChoosingCharacterAnimation: function() {
			this.log("completeChoosingCharacterAnimation");
			this.pageState = AboutYouPage.STATE_CHARACTER_INPUT_INFORMATION;

			this.bigLady.fadInAgeSection();
			this.bigLady.activeAction(true);

			this.headerComponent.disableSelection();

			//var self = this;
			//this.$bigLady.swipe("enable");

			this.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_CUSTOMER);

			this.updateInputFields();
		},

		nextPreviousPageHandler: function(isNext) {

			var self = this;

            this.headerComponent.fadeOutMenuItems(function(){
                if (isNext) {
                    self.$el.trigger(AboutYouPage.EVENT_NEXT);
                } else {
                	//we must reset data                	
                	self.resetPage();
                    self.$el.trigger(AboutYouPage.EVENT_PREVIOUS);
                }
            });


		},

		resetPage: function(){            
			this.headerComponent.fadeInMenuItems();
			this.startRemoveCharacter();
		},


		previousPageHandler: function() {
			this.log("==previousPageHandler");
			this.headerComponent.hideHintArrow();

			this.$el.trigger(AboutYouPage.EVENT_PREVIOUS);
		},


		initCharacterComponent: function() {
			var charatcerAgeHTML = this.$el.find(".character-age")[0];

			this.bigLady = new pos.CharacterAge(charatcerAgeHTML, {
				"gender": data.CharacterData.FEMALE,
				"ageImageList": null,
				"ageMin" : 1,
				"ageMax" : 80,
				"initAge" : this.gettingToKnowYouData.getAge(),
				"occupation": this.gettingToKnowYouData.getOccupation(),
				"isActiveEvent": false
			});
			this.bigLady.initialize();
			this.$bigLady = this.bigLady.$el;
		},

		chooseLadyCharacter: function() {
			this.gettingToKnowYouData.setAge(data.CharacterData.AGE_DEFAULT_YOUNG_WOMAN);	//default value
			this.gettingToKnowYouData.setOccupation(data.CharacterData.OCCUPATION_NOT_SPECIFIED);	//default value

			this.bigLady.resetData({
				"gender": data.CharacterData.FEMALE,
				"ageMin" : 1,
				"ageMax" : 80,
				"initAge" : this.gettingToKnowYouData.getAge(),
				"occupation": this.gettingToKnowYouData.getOccupation(),
				'widthMax': 66,
				'heightMax': 293,
				"isActiveEvent": false
			});
		},

		chooseManCharacter: function() {
			this.gettingToKnowYouData.setAge(data.CharacterData.AGE_DEFAULT_YOUNG_MAN);	//default value
			this.gettingToKnowYouData.setOccupation(data.CharacterData.OCCUPATION_NOT_SPECIFIED);	//default value

			this.bigLady.resetData({
				"gender": data.CharacterData.MALE,
				"ageMin" : 1,
				"ageMax" : 80,
				"initAge" : this.gettingToKnowYouData.getAge(),
				"occupation": this.gettingToKnowYouData.getOccupation(),
				'widthMax': 90,
				'heightMax': 293,
				"isActiveEvent": false
			});
		},


		initComponent: function() {
			//init the header
			this.headerModel = {
				items:[
					{
						"id":"man",
						"class":"icon character-icon icon-man",
						"label":"MALE",
						"translationPath":"about_you.male"
					},
					{
						"id":"lady-small",
						"class":"icon character-icon icon-woman",
						"label":"FEMALE",
						"translationPath":"about_you.female"
					}
				]
			},
			this.headerComponent = new HeaderComponent({container:this.$el.find(".header"), model:this.headerModel});


			//init the age swipe select
			this.ageSelectModel = {
				items:CharacterData.getAgeRange()
			};

			this.ageSelect = new SwipeSelect({container:this.$el.find(".age-select-row"), model:this.ageSelectModel});

			//init the occupation select
			this.occupationSelectModel = {
				items:CharacterData.OCCUPATION_RANGE
			};
			this.occupationSelect = new SwipeSelect({container:this.$el.find(".occupation-select-row"), model:this.occupationSelectModel});
			this.$smallLady = this.$el.find(".lady-small .icon");
			this.$smalMan = this.$el.find(".man .icon");
			this.initCharacterComponent();
			this.$testArea = this.$el.find(".test");
			this.$testArea.hide();
			this.$middleSection = this.$el.find(".middle");
			this.$overlayView = this.$el.find(".overlay");

			//for content container
			this.$contentContainer = this.$el.find(".content-container");
			this.$contentContainer.hide();

			var maritalStatusRadioHTML = this.$el.find(".marital-status-field .radio-group")[0];
			this.maritalStatusRadioControl = new pos.RadioGroup(maritalStatusRadioHTML, {

			});

			//for next-previous btn
			this.$nextBtn = this.$el.find(".control-container .next");
			this.$previousBtn = this.$el.find(".control-container .previous");
			this.$controlContainer = this.$el.find(".control-container");
			this.$controlContainer.hide();

			this.pageState = AboutYouPage.STATE_START_CHOOSE_CHARACTER;

			this.resetBigLady();

		},



		//pay attention on the hide of this.$bigLady, sometime, it make offset function not correct
		showBigLady: function(isShow) {
			if (isShow) {
				this.$bigLady.css({
					"opacity" : "1",
					"z-index": 99999
				});
			} else {
				this.$bigLady.css({
					"opacity" : "0",
					"z-index": 0
				});
			}

		},

		resetBigLady: function() {
			//var ladyOffset = this.$smallLady.offset();
			//this.$bigLady.offset({"left":ladyOffset.left,"top":ladyOffset.top});
			this.$bigLady.offset({"left":0,"top":0});
			this.showBigLady(false);
		},

		fadinContentContainer: function() {
			var self = this;

			this.$contentContainer.fadeIn(500, function() {
				self.completeChoosingCharacterAnimation();
			});

			this.$controlContainer.fadeIn(500, function() {

			});
		},

		//animation, logic for content container
		fadOutContentContainer: function() {
			//var self = this;
			this.$contentContainer.fadeOut(1000, function() {

			});

			this.$controlContainer.fadeOut(1000, function() {
			});
		},

		startRemoveCharacter: function() {
			//var self = this;
			//this.$bigLady.swipe("disable");

			this.fadOutContentContainer();
			this.resetBigLady();
			this.completeAnimationForRemoving();

			this.headerComponent.enableSelection();

			//publish event
			this.gettingToKnowYouData.setGender(data.CharacterData.NOT_IDENTIFY);
			this.gettingToKnowYouData.setMaritalStatus(data.ConfigData.MARITAL_SINGLE);
			this.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_CUSTOMER);
		},

		completeAnimationForRemoving: function() {
			this.log("==completeAnimationForRemoving");
			this.bigLady.resetToInitialState();
			this.pageState = AboutYouPage.STATE_START_CHOOSE_CHARACTER;
		},

		log: function(msg) {
			if (this.options.isDebug) {
				console.log(msg);
			}
		},

		insertToDOM: function(){

			if(this.options.element){
				this.$el = $(this.options.element);
			}
			else{
				this.$el = $(this.getDocumentHTML());
				this.$container  = $(this.options.container);
				if(this.options.container){
					if(this.options.containerPosition == "prepend"){
						this.$container.prepend(this.$el);
					}
					else{
						this.$container.append(this.$el);
					}
				}
			}
			this.el = this.$el[0];
		},


		//>>>>>>>>>>>>>>for pageElement event >>>>>>>>>>>>
		getDocumentHTML : function() {
			var template = Templates.getTemplate('about-you-page');
			return 	template();
		},

		onRender: function() {
			this.log("==AboutYouPage onRender " );
			this.initComponent();
			this.bindEvents(true);
		},

		onDestroy: function() {
			this.log("==AboutYouPage onDestroy ");
			this.bindEvents(false);
		},


		loadHtml: function() {
			console.log("loadHtml");
			var temp = $("<div/>");
			temp.load("animation-page.html .about-you-page", function(responseText, statusText, xhr) {
				if(statusText === "success") {
					console.log("Successfully loaded the content!");
					console.log("==temp " + temp.html());
				}

				if(statusText === "error") {
					alert("An error occurred: " + xhr.status + " - " + xhr.statusText);
				}
			});
		},

		//place to restore the data in page
		setData: function(dataObj) {

			this.gettingToKnowYouData = dataObj;
			console.log("==setData " + dataObj.getGender());

			var customerGender = this.gettingToKnowYouData.getGender();

			if (customerGender !== data.CharacterData.NOT_IDENTIFY) {
				this.bigLady.resetData({
					"gender": this.gettingToKnowYouData.getGender(),
					"ageMin" : 1,
					"ageMax" : 80,
					"initAge" : this.gettingToKnowYouData.getAge(),
					"occupation": this.gettingToKnowYouData.getOccupation(),
					'widthMax': 66,
					'heightMax': 293,
					"isActiveEvent": false
				});
				this.$contentContainer.show();
				this.$controlContainer.show();

				//this.$bigLady.swipe("enable");
				this.showBigLady(true);
				this.bigLady.showAgeSection();
				this.bigLady.activeAction(true);


				this.updateInputFields();


				this.updateLayout();

				this.headerComponent.disableSelection(false);
				this.headerComponent.hideHintArrow();

				this.pageState = AboutYouPage.STATE_CHARACTER_INPUT_INFORMATION;

			}
			else{
				this.headerComponent.enableSelection(false);
				this.headerComponent.showHintArrow();
			}


		},

		/**
		 * update the input fields based on the default data of the the selected character
		 */
		updateInputFields:function(){
			var initAge = this.gettingToKnowYouData.getAge();
			var initOccupation = this.gettingToKnowYouData.getOccupation();


			this.ageSelect.setValue(initAge);
			this.occupationSelect.setValue(initOccupation);

			//NOTE: convert marital status to string to match the value of the radio
			var initMaritalStatus = this.gettingToKnowYouData.getMaritalStatus() + '';

			//we need to render the marital status buttons
			this.maritalStatusRadioControl.selectObj(initMaritalStatus);

		},


		/**
        * update the position of the container when the window resizes
        */
        updateLayout: function(){
            var $container =  this.$el.find(".content-container");
            var $parent = this.$el.find(".middle-wrapper");
            var containerHeight = $container.height();
            var pHeight = $parent.height();

            var pTop = $parent.find(">.title").height();

            var pBottom = $parent.find(".next").height();

            var parentAvaibleHeight =    pHeight  - pTop - pBottom;
            var offset = 30; //arbitrary
            var toT = (parentAvaibleHeight - containerHeight)/2 + pTop - offset;
            $container.css("top", toT+"px");
            console.log("AboutYouPage::updateLayout:", containerHeight, pHeight, pTop, pBottom, parentAvaibleHeight, toT);


            //if we have the house displayed change the position of the house
            if(this.$bigLady){
                var pt = this.getCharFinalPosition();
                console.log("AboutYouPage::updateLayout:currentHouse->", pt);
                this.$bigLady.css("left",pt.x);
                this.$bigLady.css("top", pt.y);
            }

        }

	};

	// exports
	var temporaryObj = AboutYouPage.prototype;
	AboutYouPage.prototype = Object.create(pos.PageElement.prototype);
	$.extend(AboutYouPage.prototype, temporaryObj);

	// exports
	page.AboutYouPage = AboutYouPage;
}(page, jQuery, app.Templates, app.I18nHelper, data.CharacterData, pos.HeaderComponent, pos.SwipeSelect));