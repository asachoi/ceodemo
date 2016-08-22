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
	 * ChildrenChoosingPage component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function ChildrenChoosingPage(element, options) {

		this.options   = $.extend({}, ChildrenChoosingPage.DEFAULTS, options);
		this.options.element = element;


		this.insertToDOM();

		// store this instance to data object so that I can retrieve it later
		this.$el.data('children_choosing_page', this);
		this.gettingToKnowYouData = new data.GettingToKnowYouData();

		if (this.options.isStandalone) {
			this.gettingToKnowYouData.setGender(data.CharacterData.MALE);
			this.gettingToKnowYouData.setAge(data.CharacterData.AGE_DEFAULT_MAN);

			//for debugging only. don't forget to comment out
			//this.gettingToKnowYouData.setMaritalStatus(data.ConfigData.MARITAL_MARRIED.toString());
			//this.gettingToKnowYouData.setMaritalStatus(data.ConfigData.MARITAL_SINGLE.toString());

			this.initComponent();
			this.bindEvents(true);

			this.setData(this.gettingToKnowYouData);
		}

	}

	ChildrenChoosingPage.VERSION  = '3.3.1';

	ChildrenChoosingPage.EVENT_NEXT = "event_next";
	ChildrenChoosingPage.EVENT_PREVIOUS = "event_previous";

	//config params
	ChildrenChoosingPage.DISTANCE_CHARACTER = 10;
	//ChildrenChoosingPage.DISTANCE_CHARACTER = -450;
	ChildrenChoosingPage.POS_END_Y = 30;	//for the position that show charatcer information
	ChildrenChoosingPage.POS_END_X = 70;	//for the position that show charatcer information
	//ChildrenChoosingPage.POS_END_X = -160;	//for the position that show charatcer information

	ChildrenChoosingPage.INIT_CUSTOMER_X = 230;
	ChildrenChoosingPage.INIT_CUSTOMER_Y = 190;

	ChildrenChoosingPage.INIT_BOTTOM_POS = 70;

	ChildrenChoosingPage.MAX_DEPENDENT = 4;

	ChildrenChoosingPage.STATE_ANIMATING = "state_animating";
	ChildrenChoosingPage.STATE_VIEW_CHARACTER_LIST = "state_view_character_list";
	ChildrenChoosingPage.STATE_VIEW_CHARACTER_DETAIL = "state_view_character_detail";

	ChildrenChoosingPage.DEFAULTS = {
		// no defaults for now
		isDebug:true,
		isStandalone: false,
		isMobileWebSimulator: false
	};


	ChildrenChoosingPage.prototype = {
		constructor: ChildrenChoosingPage,

		$el: null,
		el: null,

		identificationList: null,		//identification list
		selectedCharacterIndex: -1,		//the index of the selected character

		clickPosX:-1,
		clickPosY: -1,

		iconCharacterList: null,	//character list that show in middle of screen, it include CharacterAge obj, and jquery obj
		movingCharacterBig: null,
		selectedCharacterList: null,	//include dependent view and dependent data, structure like
										//[{
										//	"view":
										//	"data":
										//},{
										//	"view":
										//	"data":
										//}]
		//state
		pageState: null,
		gettingToKnowYouData: null,		//GettingToKnowYou class

		//control
		$controlContainer: null,
		$nextBtn: null,
		$previousBtn: null,

		$overlayView: null,

		$middleSection: null,

		// slider
		educationExpenses: null,
		expensesAge: null,

		//inputs
		$nameTextInput:null,
		ageSelect:null,

		//characters
		customer: null, //the selected character from AboutYouPage
		couple: null, //the spouse of the character if married


		bindEvents: function(isActiveEvent) {
			if (isActiveEvent) {
				var self = this;

				//for next-previous button
				this.$nextBtn.on("click", function() {
					self.nextPageHandler();
				});
				this.$previousBtn.on("click", function() {
					self.previousPageHandler();
				});

				this.$nameTextInput.on('change', function(event){
					self.updateSelectedCharacterData({name:event.currentTarget.value});
				});


				this.ageSelect.$el.on(SwipeSelect.EVENT_CHANGE, function(){
					self.updateSelectedCharacterData({age:self.ageSelect.getValue()});
				});


				//character icon
				var downFunc = function(events) {
					events.stopPropagation();
					events.preventDefault();

					//only permit click if state is STATE_VIEW_CHARACTER_LIST
					if (self.pageState !== ChildrenChoosingPage.STATE_VIEW_CHARACTER_LIST) {
						return;
					}

					var $characterObj = self.chosingCharacterByHTML(events.currentTarget);
					var selectedCharacterIdentifcation = self.getCharacterIdentificationByCharacterIcon($characterObj);
					if ($characterObj) {
						self.startClickIconCharacter(events, $characterObj, selectedCharacterIdentifcation);
					}
				};

				for (var i = 0; i < this.iconCharacterList.length; i++) {
					var $characterObj = this.iconCharacterList[i];
					$characterObj.on("mousedown touchstart",  downFunc);
				}


				//update the layout of the container when window resizes
                $(window).resize(function(){
                    self.updateLayout();
                });
                this.updateLayout();


			} else {
				this.$nextBtn.off("click");
				this.$previousBtn.off("click");

				for (var i = 0; i < this.iconCharacterList.length; i++) {
					var $characterObj = this.iconCharacterList[i];
					$characterObj.off("mousedown touchstart");
				}
			}
		},

		//>>>>>>>>>>>>>> event handler >>>>>>>>>>>>>>>>
		nextPageHandler: function() {
			//check if there is animation or not
			if (this.pageState === ChildrenChoosingPage.STATE_ANIMATING) {
				return;
			}

			this.headerComponent.hideHintArrow();

			//view next dependent or next page
			var dependentList = this.getDependentInList();
			var indexChoosingCharacter = this.getUserChoosingCharacterIndexFromList(dependentList);
			var isListStateAndNoDependent = this.pageState === ChildrenChoosingPage.STATE_VIEW_CHARACTER_LIST &&
												dependentList.length === 0;
			var isListStateAndNoDependentSelected = indexChoosingCharacter === -1 &&
												this.pageState === ChildrenChoosingPage.STATE_VIEW_CHARACTER_LIST;
			console.log("nextPageHandler >>>> dependentList.lenght " + dependentList.length + " / " + indexChoosingCharacter);
			//list view state and no dependent => go next page
			if (isListStateAndNoDependent) {
				this.navigateToNextPreviousPage(true);
				return;
			}

			//list view state and has dependent but no dependent is selected => select the first one
			if (isListStateAndNoDependentSelected) {
				this.chooseCharacterToViewDetailHandler(0);
				return;
			}

			//detail view state and at least one dependent is selected =>next and previous depdendent
			if (indexChoosingCharacter !== -1 && indexChoosingCharacter < dependentList.length - 1) {
				//has character selected
				this.navigateNexPrevioustBigCharacter(dependentList, indexChoosingCharacter, true);
			} else {
				//last dependent is selected => go next page
				this.navigateToNextPreviousPage(true);
			}
		},

		previousPageHandler: function() {

			this.headerComponent.hideHintArrow();

			var self = this;
			var dependentList = this.getDependentInList();
			var indexChoosingCharacter = this.getUserChoosingCharacterIndexFromList(dependentList);
			var isListState = this.pageState === ChildrenChoosingPage.STATE_VIEW_CHARACTER_LIST;
			var isDetailStateAndFirstDependentSelected = indexChoosingCharacter === 0 &&
												this.pageState === ChildrenChoosingPage.STATE_VIEW_CHARACTER_DETAIL;
			console.log("==isListState " + isListState + "/ " + isDetailStateAndFirstDependentSelected);
			//list view state  => return previous page
			if (isListState) {
				//clear dependents
				//self.gettingToKnowYouData.emptyDependent();
				//self.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_CHILDREN);

				this.navigateToNextPreviousPage(false);
				return;
			}

			//detail view state, and first depdendent is selected => return to list view
			if (isDetailStateAndFirstDependentSelected) {
				var characterSelected = dependentList[indexChoosingCharacter]["view"];
				characterSelected.$el.data("status", "no_view_detail");
				var previousLeft = characterSelected.$el.data("previous_x");
				self.animateFromCharacterDetailInfoToCharacterListView(characterSelected, previousLeft);

				return;
			}

			//detail view state and selected dependent is not first item => next dependent
			this.navigateNexPrevioustBigCharacter(dependentList, indexChoosingCharacter, false);
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

		startClickIconCharacter: function(events, $characterObj, selectedCharacterIdentifcation) {
			//we need to hide the hint arrow
			this.headerComponent.hideHintArrow();

			if (this.gettingToKnowYouData.getChildrens().length > 3) {
				return;		//limit the number of children
			}

			//update state
			this.pageState = ChildrenChoosingPage.STATE_ANIMATING;

			var documentX = events.originalEvent.pageX;
			var documentY = events.originalEvent.pageY;
			if (this.options.isMobileWebSimulator) {
				//TODO : why using originalEvent.targetTouches[0]????
				documentX = events.originalEvent.targetTouches[0].pageX;
				documentY = events.originalEvent.targetTouches[0].pageY;
			}

			var ladyOffset = $characterObj.offset();

			this.clickPosX = documentX - ladyOffset.left;
			this.clickPosY = documentY - ladyOffset.top;

			this.log("==clickPosX " + this.clickPosX + " / clickPosY = " + this.clickPosY);
			//create big character dynamically
			this.movingCharacterBig = this.initBigCharacterByIdentification(selectedCharacterIdentifcation, null);
			this.$el.find(".middle-wrapper").append(this.movingCharacterBig.$el);
			this.movingCharacterBig.$el.data("identification", selectedCharacterIdentifcation);	//attachment identification
			this.movingCharacterBig.initialize();

			var imageOffset = this.movingCharacterBig.getImageOffsetPosition();
			this.movingCharacterBig.$el.offset({
				"left":ladyOffset.left - imageOffset.left - this.movingCharacterBig.$el.width()/2,
				"top":ladyOffset.top - imageOffset.top
			});
			this.movingCharacterBig.$el.css("opacity",0);
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

			var characterOffsetX = documentX - this.clickPosX;
			var characterOffsetY = documentY - this.clickPosY;

			//this.log("==characterOffsetX " + characterOffsetX + " / characterOffsetY = " + characterOffsetY);

			//update big lady position
			var imageOffset = this.movingCharacterBig.getImageOffsetPosition();
			this.movingCharacterBig.$el.offset({
				"left":characterOffsetX - imageOffset.left - this.movingCharacterBig.$el.width()/2,
				"top":characterOffsetY - imageOffset.top // 50 is arbitrary
			});

			//if the user is dragging the header we must hide the dragDream
            var middleYPos = this.$el.find(".middle").offset().top + 110;
            if (this.movingCharacterBig.$el.offset().top < middleYPos) {
                this.movingCharacterBig.$el.css("opacity",0);
            }
            else{
                this.movingCharacterBig.$el.css("opacity",1);
            }

		},

		endDragCharacter: function(/*events*/) {
			//var self = this;
			this.activeMouseEvent(false);

			//check if lady position is in middle section
			var middleYPos = this.$el.find(".middle").offset().top + 110;
			if (this.movingCharacterBig.$el.offset().top < middleYPos) {
				//remove big character
				this.movingCharacterBig.$el.remove();
				this.movingCharacterBig = null,

				//update state
				this.pageState = ChildrenChoosingPage.STATE_VIEW_CHARACTER_LIST;
			} else {
				this.startAnimation();
			}
		},

		chooseCharacterToViewDetailHandler: function(indexTarget) {

			var self = this;
			/*
			//get character and index
			var indexTarget = self.selectedCharacterInList(events.currentTarget);
			if (indexTarget === -1) {
				console.log("==can not find the click character in list");
				return;
			}*/

			self.selectedCharacterIndex = indexTarget;
			var characterSelected = self.selectedCharacterList[indexTarget]["view"];

			if(characterSelected.$el.data("status") === "no_view_detail") {
				//only start animation if it is STATE_VIEW_CHARACTER_LIST
				if (self.pageState === ChildrenChoosingPage.STATE_VIEW_CHARACTER_LIST) {
					//store some information for return back
					characterSelected.$el.data("status", "view_detail");
					var cssLeft = characterSelected.$el.css("left");
					var previousLeft = parseFloat(cssLeft.substr(0, cssLeft.length - 2));
					characterSelected.$el.data("previous_x", previousLeft);

					//do animate
					self.animateFromCharacterViewToCharacterDetailInfo(indexTarget);
				}

			} else {
				//only start animation if
				if (self.pageState === ChildrenChoosingPage.STATE_VIEW_CHARACTER_DETAIL) {
					return;
					/*TODO : it is implementation for returning from detail state to list state
					//return back previous position
					characterSelected.$el.data("status", "no_view_detail");
					var previousLeft = characterSelected.$el.data("previous_x");
					self.animateFromCharacterDetailInfoToCharacterListView(characterSelected, previousLeft);
					*/
				}
			}
		},

		initIdentificationDependentsList: function() {
			var $iconBaby = this.$el.find(".container .characters-list .icon-baby");
			var $iconBoy = this.$el.find(".container .characters-list .icon-boy");
			var $iconGirl = this.$el.find(".container .characters-list .icon-girl");
			var $iconGFather = this.$el.find(".container .characters-list .icon-grandfather");
			var $iconGMother = this.$el.find(".container .characters-list .icon-grandmother");

			//identification list and icon list must be matched
			this.iconCharacterList = [
				$iconBaby,
				$iconBoy,
				$iconGirl,
				$iconGFather,
				$iconGMother
			];

			this.identificationList = [
				data.CharacterData.CHARACTER_BABY_BOY_IDENTIFICATION,
				data.CharacterData.CHARACTER_BABY_BOY_IDENTIFICATION,
				data.CharacterData.CHARACTER_BABY_GIRL_IDENTIFICATION,
				//data.CharacterData.CHARACTER_BOY_IDENTIFICATION,
				//data.CharacterData.CHARACTER_GIRL_IDENTIFICATION,
				data.CharacterData.CHARACTER_GRAND_FATHER_STATUS_IDENTIFICATION,
				data.CharacterData.CHARACTER_GRAND_MOTHER_STATUS_IDENTIFICATION
			];
		},

		//identify character by choosing icon
		chosingCharacterByHTML: function(objHTML) {
			for (var i = 0; i < this.iconCharacterList.length; i++) {
				var $obj = this.iconCharacterList[i];
				if ($obj[0] === objHTML) {
					return $obj;
				}
			}

			return null;
		},

		getCharacterIdentificationByCharacterIcon: function(characterIcon) {
			var targetIndex = -1;
			for (var i = 0; i < this.iconCharacterList.length; i++) {
				var $obj = this.iconCharacterList[i];
				if ($obj === characterIcon) {
					targetIndex = i;
					break;
				}
			}

			if (targetIndex === -1) {
				return data.CharacterData.CHARACTER_NOT_IDENTIFICATION;
			}

			return this.identificationList[targetIndex];
		},

		initBigCharacterByIdentification: function(characterIndetification, age) {
			var initAge =data.CharacterData.AGE_DEFAULT_BABY;
			var widthMax = 69;
			var heightMax = 214;
			var gender = data.CharacterData.MALE;

			gender = data.CharacterData.getGenderByIndentification(characterIndetification);
			initAge = data.CharacterData.getDefaultAgeByIndentification(characterIndetification);
			initAge = age ? age : initAge;

			return new pos.CharacterAge(null, {
				"gender": gender,
				"ageMin" : 1,
				"ageMax" : 80,
				"initAge" : initAge,
				'widthMax': widthMax,
				'heightMax': heightMax,
				"isActiveEvent": false
			});
		},

		//depend on the character identification, we can create different data, temporary using the same
		//data structure
		initDependentDataByIndentification: function(characterIndetification, age) {
			var dependentData = new data.DependentData();
			dependentData.setAge(age);
			dependentData.setIdentification(characterIndetification);
			console.log("==dependentData." + dependentData.getIdentification());
			return dependentData;
		},


		getCharInitPosition: function(){
            var $wrappper = this.$el.find(".middle-wrapper");

            var target = this.customer;

            var wWidth =  $wrappper.width();
            var wHeight =  $wrappper.height();
            var tWidth =  target.$el.width();
            var tHeight =  target.$el.height();

            var x =  wWidth/2  - tWidth / 2;
            var y =  wHeight/2  - tHeight / 2 + 20;

            console.log("ChildrenChoosingPage::getCharInitPosition:", wWidth, wHeight, tWidth, tHeight);

            return {x:x,y:y};
        },


		getCharFinalPosition: function(){
            var $wrappper = this.$el.find(".middle-wrapper");

            var target = this.customer;

            var wWidth =  $wrappper.width();
            var wHeight =  $wrappper.height();
            var tWidth =  target.$el.width();
            var tHeight =  target.$el.height();

            var x =  wWidth/5  - tWidth / 2;
            var y =  wHeight/2  - tHeight / 2 + 20;

            console.log("ChildrenChoosingPage::getCharFinalPosition:", wWidth, wHeight, tWidth, tHeight);

            return {x:x,y:y};
        },


		initSliderComp: function() {
			this.educationExpenses = new pos.NewSlider(this.$el.find('.education-expenses'), {
				value: 20,
				minValue: 0,
				maxValue: 100000
			});

			this.expensesAge = new pos.NewSlider(this.$el.find('.expenses-age'), {
				value: 10,
				minValue: 0,
				maxValue: 30
			});
		},

		initComponent: function() {

			//init the header
			this.headerModel = {
				items:[
					{
						"id":"boy",
						"class":"icon character-icon icon-boy",
						"label":"BOY",
						"translationPath":"children_choosing.boy"
					},
					{
						"id":"girl",
						"class":"icon character-icon icon-girl",
						"label":"GIRL",
						"translationPath":"children_choosing.girl"
					}
				]
			},
			this.headerComponent = new HeaderComponent({container:this.$el.find(".header"), model:this.headerModel});

			//init the age swipe select
			this.ageSelectModel = {
				items:CharacterData.getAgeRange()
			};
			this.ageSelect = new SwipeSelect({container:this.$el.find(".age-select-row"), model:this.ageSelectModel});


			//for next-previous btn
			this.$nextBtn = this.$el.find(".control-container .next");
			this.$previousBtn = this.$el.find(".control-container .previous");
			//this.$previousBtn.hide();
			this.$controlContainer = this.$el.find(".control-container");

			this.$overlayView = this.$el.find(".overlay");

			this.$middleSection = this.$el.find(".middle");

			//init dependent list
			this.initIdentificationDependentsList();

			// initialize slider and increment control
			//this.initSliderComp();

			// initialize slider and increment control
			/*
			this.$el.find('.increment-control').each(function() {
				new pos.IncrementControl(this);
			});
			*/

			/*
			this.$el.find('.radio-group').each(function() {
				new pos.RadioGroup(this);
			});
			*/

			this.$nameTextInput = this.$el.find("input.name");


			this.$el.find(".main-info").hide();

			this.pageState = ChildrenChoosingPage.STATE_VIEW_CHARACTER_LIST;

			//this.initHeaderCarousel();

			this.$el.find(".container.swiper-wrapper").css({
				"opacity": 1
			});


		},

		//dependentList is DependentData array
		initDependentsViewListByDependentDataList: function(dependentList) {
			var self  = this;


			for (var i = 0; i < dependentList.length; i++) {

				//we only add children, not oldies
				var dependentData = dependentList[i];

				if(!dependentData.getIsOldie()){

					var movingCharacterBig = this.initBigCharacterByIdentification(dependentData.getIdentification(), dependentData.getAge());
					this.$el.find(".middle-wrapper").append(movingCharacterBig.$el);
					movingCharacterBig.$el.data("identification", dependentData.getIdentification());	//attachment identification
					movingCharacterBig.initialize();

					//push to selected event list and make consistent with the normal flow
					//pay attention on no_view_detail
					self.selectedCharacterList.unshift({
						"view": movingCharacterBig,
						"data": dependentData
					});
					movingCharacterBig.$el.data("status", "no_view_detail");
					self.addEventForBigCharacter(movingCharacterBig, true);

				}

			}

			if(dependentList.length > 0){
				this.headerComponent.hideHintArrow();
			}
			else{

				this.headerComponent.showHintArrow();
			}

		},

		log: function(msg) {
			if (this.options.isDebug) {
				console.log(msg);
			}
		},

		//character list
		selectedCharacterInList: function(htmlObj) {
			//find the target character for view information
			var targetIndex = -1;
			for (var i = 0; i < this.selectedCharacterList.length; i++) {
				var $obj = this.selectedCharacterList[i]["view"];
				if ($obj instanceof pos.CharacterAge) {
					$obj = $obj.$el;
				}

				if ($obj[0] === htmlObj) {
					targetIndex = i;
				}
			}

			if (targetIndex !== -1) {
				//this.animateFromCharacterViewToCharacterDetailInfo(targetIndex);
			} else {
				console.log("CAN NOT SEE THE CLICKABLE CHARACTER");
			}

			return targetIndex;
		},

		resetXPosInSelectedList: function() {
			var distance = ChildrenChoosingPage.DISTANCE_CHARACTER;
			var widthOfCharacterList = this.getCharactersWidth();
			var widthContainer = this.$middleSection.width();
			var initLeft = widthContainer / 2.0 - widthOfCharacterList / 2.0;

			for (var i = 0; i < this.selectedCharacterList.length; i++) {
				var $obj = this.selectedCharacterList[i]["view"];
				if ($obj instanceof pos.CharacterAge) {
					$obj = $obj.$el;
				}

				$obj.css({
					"left": initLeft + "px"
				});

				initLeft = initLeft + $obj.width() + distance;
			}
		},

		alignBottomForSelectedList: function() {
			//align base on the
			var $firstCharacter = null;
			var $obj = null;
			var i = -1;
			for (i = 0; i < this.selectedCharacterList.length; i++) {
				$obj = this.selectedCharacterList[i]["view"];
				var isCustomer = !($obj instanceof pos.CharacterAge) ||
							($obj instanceof pos.CharacterAge && $obj.$el.data("not_dependent"));
				if (isCustomer) {
					$firstCharacter = ($obj instanceof pos.CharacterAge) ? $obj.$el : $obj;
					break;
				}
			}

			if ($firstCharacter) {
				var cssCharacter = $firstCharacter.css("top");
				var yPos = parseFloat(cssCharacter.substr(0, cssCharacter.length - 2)) + $firstCharacter.height();
				for (i = 0; i < this.selectedCharacterList.length; i++) {
					$obj = this.selectedCharacterList[i]["view"];
					if ($obj !== $firstCharacter) {
						if ($obj instanceof pos.CharacterAge) {
							$obj = $obj.$el;
						}
						var yPosForObj = yPos - $obj.height();
						$obj.css({
							"top": yPosForObj +"px"
						});
					}
				}
			}
		},

		//dependent are CharacterAge by order as original in selectedCharacterList
		getDependentInList: function() {
			var dependents = [];
			for (var i = 0; i < this.selectedCharacterList.length; i++) {
				var $obj = this.selectedCharacterList[i];
				if ($obj["view"] instanceof pos.CharacterAge ) {
					var data = $obj["view"].$el.data("not_dependent");
					console.log("=====data "+ data);
					if (!data) {
						dependents.push($obj);
					}
				}
			}

			return dependents;
		},

		//after choosing character successfully
		addDependentSuccess: function(dependentData) {
			var self = this;
			self.selectedCharacterList.unshift({
				"view": self.movingCharacterBig,
				"data": dependentData
			});
			//also add into gettingToKnowYouData and notify event
			self.gettingToKnowYouData.addChildren(dependentData);
			self.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_CHILDREN);
			if (self.gettingToKnowYouData.getChildrens().length >= 4) {
				this.headerComponent.disableSelection();
			}else {

			}

			self.addEventForBigCharacter(self.movingCharacterBig, true);

			//add click handler
			self.movingCharacterBig.$el.data("status", "no_view_detail");

		},

		addEventForBigCharacter: function(bigCharacter, isActiveEvent) {

			var self = this;
			if (isActiveEvent) {
				console.log("===active event");
				bigCharacter.$el.on("click", function(events) {
					var indexTarget = self.selectedCharacterInList(events.currentTarget);
					if (indexTarget === -1) {
						console.log("==can not find the click character in list");
						return;
					}
					self.chooseCharacterToViewDetailHandler(indexTarget);
				});

				bigCharacter.$el.on(pos.CharacterAge.EVENT_CHANGE, function(events, targetCharacter, age) {
					//change the data also for character
					var roundAge = Math.round(age);
					var dependentList = self.getDependentInList();
					var chosenCharacterData = null;	//it is DependentData
					for (var i = 0; i < dependentList.length; i++) {
						var characterObj = dependentList[i];
						if (characterObj["view"] === targetCharacter) {
							chosenCharacterData = characterObj["data"];
							break;
						}
					}

					if (!chosenCharacterData) {
						return;
					}

					//we update the value for name first
					chosenCharacterData.setName(self.$nameTextInput.val());
					//reset dependent data and publish event
					chosenCharacterData.setAge(roundAge);
					//console.log("===chosenCharacterData.getIdentification() 111" + chosenCharacterData.getIdentification());

					var gender = data.CharacterData.getGenderByIdentification(chosenCharacterData.getIdentification());

					/*
					var gender = chosenCharacterData.getGender();
					if(gender === null){

						chosenCharacterData.setGender(gender);
					}*/
					//console.log("===gender >>>> " + gender);
					var identification = data.CharacterData.getIdentificationByAge(roundAge, gender);
					//console.log("===identification >>>> " + identification + " / " + gender + " / " +roundAge);
					chosenCharacterData.setIdentification(identification);

					self.updateInputFields();

					self.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_CHILDREN);

				});

				bigCharacter.$el.on(pos.CharacterAge.EVENT_START_DRAG, function(events, age) {
					self.$overlayView.fadeIn(500, function() {

					});

					self.$overlayView.find(".age-num").html(Math.round(age) + " years");
				});

				bigCharacter.$el.on(pos.CharacterAge.EVENT_DRAGING, function(events, age) {
					self.$overlayView.find(".age-num").html(Math.round(age) + " years");
				});

				bigCharacter.$el.on(pos.CharacterAge.EVENT_END_DRAG, function() {
					self.$overlayView.fadeOut(500, null);
				});

				bigCharacter.$el.on(pos.CharacterAge.EVENT_SWIPE, function(events, target) {
					self.$el.find(".test").append($("<p>swipe</p>"));
					self.startRemoveDependent(target);
				});
			} else {
				console.log("===off event");
				bigCharacter.$el.off("click");
				bigCharacter.$el.on(pos.CharacterAge.EVENT_CHANGE);
				bigCharacter.$el.on(pos.CharacterAge.EVENT_START_DRAG);
				bigCharacter.$el.on(pos.CharacterAge.EVENT_DRAGING);
				bigCharacter.$el.on(pos.CharacterAge.EVENT_END_DRAG);
				bigCharacter.$el.off(pos.CharacterAge.EVENT_SWIPE);
			}
		},

		startRemoveDependent: function(dependentView) {
			console.log("==startRemoveDependent ");
			var self = this;
			//remove data first
			self.removeDependentData(dependentView);

			//animation
			this.pageState = ChildrenChoosingPage.STATE_ANIMATING;
			//show the user information
			this.$el.find(".main-info").fadeOut(500, function() {

			});

			dependentView.fadOutAgeSection();
			dependentView.activeAction(false);

			dependentView.$el.fadeOut(500, function() {
				dependentView.$el.remove();
			});

			//restart xPos
			this.resetXPosInSelectedList();


			var sumAnimation = 0;
			var completeAnimation = 0;
			var completeFadeInFun = function() {
				completeAnimation ++;
				console.log("==completeFadeInFun");
				if (completeAnimation === sumAnimation) {
					self.pageState = ChildrenChoosingPage.STATE_VIEW_CHARACTER_LIST;
					console.log("==complete animation to view_character_list");
				}
			};

			for (var i = 0; i < this.selectedCharacterList.length; i++) {
				var $character = this.selectedCharacterList[i]["view"];
				if ($character instanceof pos.CharacterAge) {
					$character = $character.$el;
				}
				sumAnimation ++;
				$character.fadeIn(1000, completeFadeInFun);
			}


		},

		removeDependentData: function(dependentView) {
			var self = this;
			var dependentList = self.getDependentInList();
			var removedCharacterData = null;	//it is DependentData
			var removeCharacter = null;
			for (var i = 0; i < dependentList.length; i++) {
				var characterObj = dependentList[i];
				if (characterObj["view"] === dependentView) {
					removedCharacterData = characterObj["data"];
					removeCharacter = characterObj;
					break;
				}
			}

			//remove view from selectedCharacterList
			var indexObj = this.selectedCharacterList.indexOf(removeCharacter);
			this.selectedCharacterList.splice(indexObj, 1);

			console.log("===removedCharacterData " + removedCharacterData);
			if (removedCharacterData) {
				var isRemoveSuccessfully = self.gettingToKnowYouData.removeChildren(removedCharacterData);
				console.log("===isRemoveSuccessfully " + isRemoveSuccessfully);
				if (isRemoveSuccessfully) {
					self.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_CHILDREN);
				}
			}

			if (self.gettingToKnowYouData.getChildrens().length >= 4) {

			} else {
				this.headerComponent.enableSelection();
			}
		},

		//get user choosing character in list, we can navigate from current choosing character to
		//next character or navigate back to previous character
		getUserChoosingCharacterIndexFromList: function(characterBigList) {
			if (!characterBigList) {
				return -1;
			}

			for (var i = 0; i < characterBigList.length; i++) {
				var characterBigObj = characterBigList[i];
				var characterView = characterBigObj["view"];
				if (characterView.$el.data("status") === "view_detail") {
					return i;
				}
			}

			return -1;
		},

		//>>>>>>>>>>>>>>animation >>>>>>>>>>>>
		startAnimation: function() {
			var self = this;
			this.movingCharacterBig.$el.fadeOut(500, function() {

				// get position of new dependent
				var pos = self.getPosOfFirstCharacterInSelectedList();
				var oldPosX = pos.x;

				// get total width of character list
				var charactersNewWidth = self.getCharactersWidth() + self.movingCharacterBig.$el.width() + ChildrenChoosingPage.DISTANCE_CHARACTER;
				// get position of new dependent
				pos.x = (self.$middleSection.width() - charactersNewWidth) / 2;
				var newPosOfFirst = pos.x + self.movingCharacterBig.$el.width() + ChildrenChoosingPage.DISTANCE_CHARACTER;
				var distance = newPosOfFirst - oldPosX;
				pos.y = pos.y -  self.movingCharacterBig.$el.height();	//align bottom
				self.movingCharacterBig.$el.css({
					"left" : pos.x,
					"top" : pos.y
				});

				//init dependent data
				var age = self.movingCharacterBig.getSelectedAge();
				var dependentData = self.initDependentDataByIndentification(self.movingCharacterBig.$el.data("identification"), age);
				self.moveSelectedListToRight(distance);

				//animate character and move the character list to the right
				self.movingCharacterBig.$el.fadeIn(1000, function() {
					//add character into list and active init swipe
					console.log("==dependentData " + dependentData.getAge());
					self.addDependentSuccess(dependentData);

					self.movingCharacterBig = null;
					self.pageState = ChildrenChoosingPage.STATE_VIEW_CHARACTER_LIST;
				});
			});
		},

		moveSelectedListToRight: function(distance) {
			for (var i = 0; i < this.selectedCharacterList.length; i++) {
				var $characterObj = this.selectedCharacterList[i]["view"];
				if ($characterObj instanceof pos.CharacterAge) {
					$characterObj = $characterObj.$el;
				}

				var cssLeft = $characterObj.css("left");
				var toLeft = parseFloat(cssLeft.substr(0, cssLeft.length - 2)) + distance;
				$characterObj.animate({
					"left": toLeft
				}, 500, "swing", function() {

				});
			}
		},

		getPosOfFirstCharacterInSelectedList: function() {
			var $leftCharacter = this.selectedCharacterList[0]["view"];
			if ($leftCharacter instanceof pos.CharacterAge) {
				$leftCharacter = $leftCharacter.$el;
			}
			var cssLeft = $leftCharacter.css("left");
			var cssTop= $leftCharacter.css("top");
			var xPos = parseFloat(cssLeft.substr(0, cssLeft.length - 2));
			var yPos = parseFloat(cssTop.substr(0, cssTop.length - 2));
			yPos = yPos + $leftCharacter.height();
			return {
				"x":  xPos,
				"y": yPos	//yPos is the bottom y pos of character
			};
		},

		getCharactersWidth: function() {
			var width = 0;
			var $character = null;
			var self = this;

			for (var i = 0; i < this.selectedCharacterList.length; i++) {
				$character = this.selectedCharacterList[i]["view"];
				if ($character instanceof pos.CharacterAge) {
					$character = $character.$el;
					if (i === self.selectedCharacterList.length - 1) {
						width += $character.width();
					} else {
						width += ($character.width() + ChildrenChoosingPage.DISTANCE_CHARACTER);
					}
				} else {
					if (i === self.selectedCharacterList.length - 1) {
						width += $character.width();
					} else {
						width += $character.width() + ChildrenChoosingPage.DISTANCE_CHARACTER;
					}
					// big lady and big man

				}
			}

			return width;
		},

		//transform from character list to character detail view
		animateFromCharacterViewToCharacterDetailInfo: function(indexSelectedCharacter) {
			var self = this;
			self.pageState = ChildrenChoosingPage.STATE_ANIMATING;

			//animate selected obj to the right and fadout the remain character
			//only perform in CharacterAge obj
			var selectedCharacter = this.selectedCharacterList[indexSelectedCharacter]["view"];
			selectedCharacter.$el.animate({
				"left": ChildrenChoosingPage.POS_END_X
			}, 500, "swing", function() {
				//active selected character
				selectedCharacter.fadInAgeSection();
				selectedCharacter.activeAction(true);
				//selectedCharacter.$el.swipe("enable");

				//show the user information

				self.$el.find(".main-info").fadeIn(500, function() {
					self.updateInputFields();
				});
				self.updateLayout();
			});

			var sumAnimation = 0;
			var completeAnimation = 0;
			var completeFadouFunc = function() {
				completeAnimation ++;
					if (sumAnimation === completeAnimation) {
						console.log("==complete animation to view_character_detail");
						self.pageState = ChildrenChoosingPage.STATE_VIEW_CHARACTER_DETAIL;
					}
			};
			for (var i = 0; i < this.selectedCharacterList.length; i++) {
				if (i !== indexSelectedCharacter) {
					var $character = this.selectedCharacterList[i]["view"];
					if ($character instanceof pos.CharacterAge) {
						$character = $character.$el;
					}
					sumAnimation ++;
					$character.fadeOut(1000, completeFadouFunc);
				}
			}

			//this.updateInputFields();
		},

		//animate from character detail infor to character list
		animateFromCharacterDetailInfoToCharacterListView: function(bigCharacter, previousLeft) {
			var self = this;
			this.pageState = ChildrenChoosingPage.STATE_ANIMATING;
			//show the user information
			this.$el.find(".main-info").fadeOut(500, function() {

			});

			bigCharacter.fadOutAgeSection();
			bigCharacter.activeAction(false);
			//bigCharacter.$el.swipe("disable");

			bigCharacter.$el.animate({
				"left": previousLeft
			}, 500, "swing", function() {

			});

			var sumAnimation = 0;
			var completeAnimation = 0;
			var completeFadeInFun = function() {
				completeAnimation ++;
				if (completeAnimation === sumAnimation) {
					self.pageState = ChildrenChoosingPage.STATE_VIEW_CHARACTER_LIST;
					console.log("==complete animation to view_character_list");
				}
			};
			for (var i = 0; i < this.selectedCharacterList.length; i++) {
				var $character = this.selectedCharacterList[i]["view"];
				if ($character !== bigCharacter) {
					if ($character instanceof pos.CharacterAge) {
						$character = $character.$el;
					}
					sumAnimation ++;
					$character.fadeIn(1000, completeFadeInFun);
				}
			}
		},

		//navigate to next dependent
		navigateNexPrevioustBigCharacter: function(dependentList, currentIndex, isNext) {
			var self = this;
			this.pageState = ChildrenChoosingPage.STATE_ANIMATING;
			//big character must have structure : {"view": CharacterAge, "data": Dependent};
			var currentBigCharacter = dependentList[currentIndex];
			var nextBigCharacter = null;
			if (!isNext) {
				nextBigCharacter = dependentList[currentIndex - 1];
				this.selectedCharacterIndex = currentIndex - 1;
			} else {
				nextBigCharacter = dependentList[currentIndex + 1];
				this.selectedCharacterIndex = currentIndex + 1;
			}

			var currentCharacter = currentBigCharacter["view"];
			//var currentCharacterData = currentBigCharacter["data"];
			var nextCharacter = nextBigCharacter["view"];
			//var nextCharacterData = nextBigCharacter["data"];

			//fadeout character and animate view
			var fadeInNextCharacterFunc = function() {
				//reset the previous position and remove event
				currentCharacter.$el.data("status", "no_view_detail");
				var previousLeft = currentCharacter.$el.data("previous_x");
				currentCharacter.$el.css({
					"left": previousLeft
				});
				currentCharacter.fadOutAgeSection();
				currentCharacter.activeAction(false);
				//currentCharacter.$el.swipe("disable");

				//start the nextCharacter
				nextCharacter.$el.data("status", "view_detail");
				var cssLeft = nextCharacter.$el.css("left");
				previousLeft = parseFloat(cssLeft.substr(0, cssLeft.length - 2));
				nextCharacter.$el.data("previous_x", previousLeft);
				nextCharacter.$el.css({
					"left": ChildrenChoosingPage.POS_END_X
				});

				nextCharacter.$el.fadeIn(500, function() {
					console.log("===complete next character fadin");
					self.pageState = ChildrenChoosingPage.STATE_VIEW_CHARACTER_DETAIL;
					nextCharacter.fadInAgeSection();
					nextCharacter.activeAction(true);
					//nextCharacter.$el.swipe("enable");
				});

				$(".main-info").fadeIn(500, function() {

				});

				self.updateInputFields();

			};

			var animationNum = 2;
			var completeAnimation = 0;
			currentCharacter.$el.fadeOut(500, function() {
				completeAnimation ++;
				if (completeAnimation === animationNum) {
					fadeInNextCharacterFunc();
				}
			});

			$(".main-info").fadeOut(500, function() {
				completeAnimation ++;
				if (completeAnimation === animationNum) {
					fadeInNextCharacterFunc();
				}
			});


		},

		navigateToNextPreviousPage: function(isNext) {

			var self = this;

            this.headerComponent.fadeOutMenuItems(function(){
            	console.log("ChildrenChoosingPage::navigateToNextPreviousPage:");
                if (isNext) {
                    self.$el.trigger(ChildrenChoosingPage.EVENT_NEXT);
                } else {
                    self.$el.trigger(ChildrenChoosingPage.EVENT_PREVIOUS);
                }
            });


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
		/*jshint multistr: true */
		getDocumentHTML : function() {
			var template = Templates.getTemplate('children-choosing-page');
			return 	template();
		},

		onRender: function() {
			this.initComponent();
			this.bindEvents(true);
		},

		onDestroy: function() {
			//this.log("==ChildrenChoosingPage onDestroy ");
			this.bindEvents(false);

			//remove all event from depenent list
			var dependentList = this.getDependentInList();
			for (var i = 0; i < dependentList.length; i++) {
				var dependent = dependentList[i]["view"];
				this.addEventForBigCharacter(dependent, false);
			}
		},

		//set data
		setData: function(dataObj) {
			this.gettingToKnowYouData = dataObj;

			var self = this;

			//show the character accordingly
			var customerGender = this.gettingToKnowYouData.getGender();
			var isMarried =  data.ConfigData.isMarried(this.gettingToKnowYouData.getMaritalStatus());

			//init customer
			this.customer = new pos.CharacterAge(null, {
				"gender": customerGender,
				"ageMin" : 1,
				"ageMax" : 80,
				"initAge" : this.gettingToKnowYouData.getAge(),
				"occupation": this.gettingToKnowYouData.getOccupation(),
				'widthMax': null,
				'heightMax': null,
				"isActiveEvent": false
			});
			this.$el.find(".middle-wrapper").append(this.customer.$el);
			this.customer.$el.data("not_dependent", true);	//attachment identification
			this.customer.initialize();

			var pt = this.getCharInitPosition();

			//var initTop = this.$el.find(".left-container").height() - ChildrenChoosingPage.INIT_BOTTOM_POS - customer.$el.height();
			//var initLeft = ChildrenChoosingPage.INIT_CUSTOMER_X;
			var initLeft = pt.x;
			var initTop = pt.y;

			this.customer.$el.css({
				"left": initLeft,
				"top": initTop
			});


			if (isMarried) {

				//
				//initialize the spouse
				//
				var customerIdentification = data.CharacterData.getIdentificationByAge(this.gettingToKnowYouData.getAge(), this.gettingToKnowYouData.getGender());
				var coupleIdentification = data.CharacterData.getAnotherCoupleByIndentification(customerIdentification);
				var coupleGender = data.CharacterData.getGenderByIdentification(coupleIdentification);
				var age = data.CharacterData.getDefaultAgeByIndentification(coupleIdentification);
				this.couple = new pos.CharacterAge(null, {
					"gender": coupleGender,
					"ageMin" : 1,
					"ageMax" : 80,
					"initAge" : age,
					'widthMax': null,
					'heightMax': null,
					"isActiveEvent": false
				});
				this.$el.find(".middle-wrapper").append(this.couple.$el);
				this.couple.$el.data("not_dependent", true);	//attachment identification
				this.couple.initialize();
				this.couple.$el.css({
					"left": initLeft + this.couple.$el.width() + ChildrenChoosingPage.DISTANCE_CHARACTER,
					"top": initTop
				});

				//add to list
				this.selectedCharacterList = [{
					"view": this.customer,
					"data": null
				}, {
					"view": this.couple,
					"data": null
				}];
			} else {
				this.selectedCharacterList = [{
					"view": this.customer,
					"data": null
				}];

			}

			//render dependent list
			self.initDependentsViewListByDependentDataList(self.gettingToKnowYouData.getChildrens());

			self.resetXPosInSelectedList();
			self.alignBottomForSelectedList();

			if (self.gettingToKnowYouData.getChildrens().length >= 4) {
				this.headerComponent.disableSelection(false);
			}else {
				this.headerComponent.enableSelection(false);
			}

		},

		/*
		initHeaderCarousel: function() {
			if (pos.SwiperCarousel !== undefined) {
				new pos.SwiperCarousel(this.$el.find('.swiper-carousel'), {onlyExternal: true});
			}
		}
		*/


		/**
		 * update the selected character data
		 * @param params - the incremental data  that needs to change. E.g. {name:"new name", age:0}
		 */
		updateSelectedCharacterData:function(params){
			var characterList = this.getDependentInList();
			var selectedCharacter = characterList[this.selectedCharacterIndex];
			var selectedCharacterData = selectedCharacter.data;

			if(params.name !== undefined){
				selectedCharacterData.setName(params.name);
			}

			if(params.age !== undefined){
				selectedCharacterData.setAge(params.age);
				selectedCharacter.view.renderAge(params.age);

				//when the character change age it may change identification 
				//we need to update the identification
				var gender = selectedCharacter.view.getGender();
				var identification = CharacterData.getIdentificationByAge(params.age, gender);
				selectedCharacterData.setIdentification(identification);

			}

			//console.log("updateSelectedCharacterData:", selectedCharacter, selectedCharacterData);

			//let us notify other pages that we changed the detail of the dependent
			this.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_CHILDREN);

		},

		/**
		 * update the input fields based on the default data of the the selected character
		 */
		updateInputFields:function(){
			var characterList = this.getDependentInList();
			var selectedCharacter = characterList[this.selectedCharacterIndex];
			var selectedCharacterData = selectedCharacter.data;
			console.log("ChildrenChoosingPage::updateInputFields:selectedCharacterData", selectedCharacterData.getAge());
			this.$nameTextInput.val(selectedCharacterData.getName());
			this.ageSelect.setValue(selectedCharacterData.getAge());
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
            var offset = 0; //arbitrary
            var toT = (parentAvaibleHeight - containerHeight)/2 + pTop - offset;
            $container.css("top", toT+"px");
            console.log("UserDependent::updateLayout:", containerHeight, pHeight, pTop, pBottom, parentAvaibleHeight, toT);
        }

	};

	var temporaryObj = ChildrenChoosingPage.prototype;
	ChildrenChoosingPage.prototype = Object.create(pos.PageElement.prototype);
	$.extend(ChildrenChoosingPage.prototype, temporaryObj);

	// exports
	page.ChildrenChoosingPage = ChildrenChoosingPage;
}(page, jQuery, app.Templates, app.I18nHelper, data.CharacterData, pos.HeaderComponent, pos.SwipeSelect));