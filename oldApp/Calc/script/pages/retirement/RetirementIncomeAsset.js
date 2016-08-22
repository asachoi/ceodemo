/* © 2014 Aleph-labs.com
 * @author Thang Kieu, Phuong VO
 */
// namespace
var page = page || {};
page.retirement = page.retirement || {};
var pos = pos || {};
var data = data || {};

(function(retirement, $) {
	'use strict';

	function RetirementIncomeAsset(element, options) {
		this.initialize(element, options);
		this.render();
	}

	RetirementIncomeAsset.VERSION  = '3.3.1';

	RetirementIncomeAsset.EVENT_NEXT = "event_next";
	RetirementIncomeAsset.EVENT_PREVIOUS = "event_previous";

	RetirementIncomeAsset.STATE_ANIMATING = "state_animating";
	RetirementIncomeAsset.STATE_VIEW_CHARACTER_LIST = "state_view_character_list";
	RetirementIncomeAsset.STATE_START_CHOOSE_CHARACTER = "state_start_choose_character";

	RetirementIncomeAsset.INIT_CUSTOMER_X_RIGHT = -10;
	RetirementIncomeAsset.INIT_CUSTOMER_Y_BOTTOM = 70;
	RetirementIncomeAsset.DISTANCE_CHARACTER = -450;

	RetirementIncomeAsset.DEFAULTS = {
		// no defaults for now
		isDebug:true,
		isStandalone: false,
		isMobileWebSimulator: false
	};


	RetirementIncomeAsset.prototype = {
		constructor: RetirementIncomeAsset,

		$el: null,
		el: null,

		$overlayView: null,

		// middle section
		selectedItem: null,
		pageState: null,

		_typeListDataConfig: null,	//type list is list position, image config data for each income/assets type

		retirementPlanData: null,

		initialize: function(element, options) {
			if (element) {
				this.$el  = $(element);
			} else {
				this.$el = $(this.getDocumentHTML());
			}
			this.el = this.$el[0];

			this.selectedItem = null;
			this.pageState = null;
			this.retirementPlanData = null;

			this.options   = $.extend({}, RetirementIncomeAsset.DEFAULTS, options);
		},

		render: function() {
			if (this.options.isStandalone) {
				this.initComponent();
				this.bindEvents(true);

				//for standalone data
				var emotionalData = new data.EmotionalFactFindingData();
				emotionalData.getGettingToKnowYouData().setGender(data.CharacterData.MALE);
				emotionalData.getGettingToKnowYouData().setAge(data.CharacterData.AGE_DEFAULT_MAN);
				emotionalData.getGettingToKnowYouData().setMaritalStatus(data.ConfigData.MARITAL_MARRIED.toString());

				this.setData(emotionalData);
			}
		},

		renderCharacter: function() {
			var $container = this.$el.find(".left-container");
			var xPos = $container.width() - RetirementIncomeAsset.INIT_CUSTOMER_X_RIGHT - this.customerCharacter.$el.width();
			var yPos = $container.height() - RetirementIncomeAsset.INIT_CUSTOMER_Y_BOTTOM - this.customerCharacter.$el.height();
			if (this.coupleCharacter) {
				this.coupleCharacter.$el.css({
					"left": xPos,
					"top": yPos
				});
				xPos = xPos - this.coupleCharacter.$el.width() - RetirementIncomeAsset.DISTANCE_CHARACTER;
			}

			this.customerCharacter.$el.css({
				"left": xPos,
				"top": yPos
			});

		},

		initComponent: function() {
			this.pageState = RetirementIncomeAsset.STATE_START_CHOOSE_CHARACTER;

			this.$overlayView = this.$el.find(".overlay");

			this._typeListDataConfig = this._getTypeListDataConfig();
		},

		_getTypeListDataConfig: function() {
			var WIDTH_ITEM = 75;
			var PADDING_X = 40;
			var widthContent = this.$el.find(".middle").width();

			var INIT_BOTTOM_POSY = 70;

			var dataConfigList = [];
			var typeAvailableList = data.retirement.RetirementIncomeAssetsData.getAvailableTypeList();
			var DISTANCE_BETWEEN_ITEM = (widthContent - typeAvailableList.length * WIDTH_ITEM - 2* PADDING_X) / (typeAvailableList.length - 1);
			var targetPosX = PADDING_X;
			for (var i = 0; i < typeAvailableList.length; i++) {
				console.log("==targetPosX " + targetPosX);
				var type = typeAvailableList[i];
				dataConfigList.push(this._getConfigForType(type, targetPosX, INIT_BOTTOM_POSY));

				targetPosX = targetPosX + WIDTH_ITEM + DISTANCE_BETWEEN_ITEM;
			}

			return dataConfigList;
		},

		_getIndexTypeList: function(type) {
			var typeAvailableList = data.retirement.RetirementIncomeAssetsData.getAvailableTypeList();
			for (var i = 0; i < typeAvailableList.length; i++) {
				var typeObj = typeAvailableList[i];
				if (typeObj === type) {
					return i;
				}
			}

			return -1;
		},

		_getConfigForType: function(type, posX, posY) {
			return {
				'type' : type,
				'title': data.retirement.RetirementIncomeAssetsData.getTitleForType(type),
				'posX' : posX,
				'bottom_posY' : posY
			};
		},

		_getConfigByType: function(type) {
			for (var i = 0; i < this._typeListDataConfig.length; i++) {
				var configItem = this._typeListDataConfig[i];
				if (configItem['type'] === type) {
					return configItem;
				}
			}

			return null;
		},

		bindEvents: function(isActiveEvent) {
			var self = this;
			if (isActiveEvent) {
				this.$el.find(".control-container .next").on("click", function() {
					self.nextPageHandler();
				});
				this.$el.find(".control-container .previous").on("click", function() {
					self.previousPageHandler();
				});
				this.$el.off().on('mousedown touchstart', '.character-icon', function(events) {
					events.stopPropagation();
					events.preventDefault();
					self.startClickCharacter(events);
				});
			} else {
				this.$el.find(".control-container .next").off("click");
				this.$el.find(".control-container .previous").off("click");
				this.$el.find('.character-icon').each(function() {
					self.$el.off('mousedown touchstart');
				});
			}
		},

		startClickCharacter: function(events) {
			//dont allow click if  we still have animation
			if (this.pageState === RetirementIncomeAsset.STATE_ANIMATING) {
				return;
			}

			// prevent when this icon is disabled
			// it's mean this options was selected
			var $option = $(events.target).closest('.characters-list');
			if ($option.hasClass('disabled')) {
				return;
			}

			this.pageState = RetirementIncomeAsset.STATE_ANIMATING;

			var documentX = events.originalEvent.pageX;
			var documentY = events.originalEvent.pageY;
			if (this.options.isMobileWebSimulator) {
				//TODO : why using originalEvent.targetTouches[0]????
				documentX = events.originalEvent.targetTouches[0].pageX;
				documentY = events.originalEvent.targetTouches[0].pageY;
			}

			var xPos = documentY;

			// create house image
			this.createRetirementForAnimation(events);
			this.selectedItem.$el.offset({
				'left': documentX - this.selectedItem.$el.width() / 2,
				//'top': documentY - this.selectedItem.$el.height() / 1.5
				'top': xPos
			});

			this.activeMouseEvent(true);
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
					events.preventDefault();
					self.endDragCharacter(events);
				});
			} else {
				this.$el.off("mousemove touchend");
				this.$el.off("mouseup touchmove");
			}
		},

		/**
		 * create image for animation
		 * @param  {[type]} pos [description]
		 * @return {[type]}     [description]
		 */
		createRetirementForAnimation: function(event) {
			var $el = $(event.target);
			var id = $el.closest('.characters-list').index();
			var availableTypeList = data.retirement.RetirementIncomeAssetsData.getAvailableTypeList();
			var incomeType = availableTypeList[id];

			var imageList = [
				"../images/emotional/icons/retirement-income-money-icon-1.png",
				"../images/emotional/icons/retirement-income-money-icon-1.png",
				"../images/emotional/icons/retirement-income-money-icon-1.png",
				"../images/emotional/icons/retirement-income-money-icon-1.png",
				"../images/emotional/icons/retirement-income-money-icon-1.png"
			];

			this.selectedItem = new pos.IncomeAssetComponent(null, {
				'incomeAssetsType': incomeType,
	    			"ageImageList": imageList,
	    			"valueMin" : 1,
	    			"valueMax" : 80000,
	    			"isActiveEvent": true,
	    			"initValue" : 50000
	    		});
			this.$el.find('.left-container').append(this.selectedItem.$el);
			this.selectedItem.initialize();


		},

		startDragCharacter: function(events) {
			var documentX = events.originalEvent.pageX;
			var documentY = events.originalEvent.pageY;
			if (this.options.isMobileWebSimulator) {
				//TODO : why using originalEvent.targetTouches[0]????
				documentX = events.originalEvent.targetTouches[0].pageX;
				documentY = events.originalEvent.targetTouches[0].pageY;
			}


			var characterOffsetX = documentX - this.selectedItem.$el.width() / 2;
			var characterOffsetY = documentY - this.selectedItem.$el.height() / 1.5;
			characterOffsetY = documentY;

			//update big lady position
			this.selectedItem.$el.offset({
				"left":characterOffsetX,
				"top":characterOffsetY
			});
		},

		endDragCharacter: function() {
			this.activeMouseEvent(false);

			var middleYPos = this.$el.find(".middle").offset().top + 110;
			if ((this.selectedItem.$el.offset().top + (this.selectedItem.$el.height() / 1.5)) < middleYPos) {
				//remove big character
				this.selectedItem.$el.remove();

				this.pageState = RetirementIncomeAsset.STATE_START_CHOOSE_CHARACTER;
			} else {
				this.startToTargetAnimation();
			}
		},

		/**
		 * start animation to target position
		 * @return {[type]} [description]
		 */
		startToTargetAnimation: function() {
			var self = this;
			var typeIncome = this.selectedItem.getIncomeAssetType();
			var config = this._getConfigByType(typeIncome);

			var yPos = this.$el.find(".left-container").height() - this.selectedItem.$el.height() - config.bottom_posY;

			//match the type of income asset with the index icon in header
			var indexType = this._getIndexTypeList(typeIncome);
			var $icon = this.$el.find('.characters-list').eq(indexType);

			//add event for item
			this.addEventForIncomeItem(this.selectedItem, true);

			// this.startAnimation();
			this.selectedItem.$el.animate({
				"left" : config.posX,
				"top": yPos
			}, 500, "swing", function() {
				// disable this icon
				$icon.addClass('disabled');
				//self.$selectedItem.find('.top-value').animate({'opacity': 1}, 200);

				self.completeChoosingCharacterAnimation();
			});
		},

		addEventForIncomeItem: function(incomeItem, isAddedEvent) {
			var self = this;
			if (isAddedEvent) {
				incomeItem.$el.on(pos.IncomeAssetComponent.EVENT_START_DRAG, function(event, targetValueIncome) {
					console.log("==EVENT_START_DRAG " + targetValueIncome);
					self.$overlayView.fadeIn(500, function() {

					});

					self.$overlayView.find(".age-num").html(Math.round(targetValueIncome));
				});

				incomeItem.$el.on(pos.IncomeAssetComponent.EVENT_DRAGING, function(event, targetValueIncome) {
					console.log("==EVENT_DRAGING " + targetValueIncome);
					self.$overlayView.find(".age-num").html(Math.round(targetValueIncome) );
				});

				incomeItem.$el.on(pos.IncomeAssetComponent.EVENT_END_DRAG, function() {
					self.$overlayView.fadeOut(500, null);
				});

				incomeItem.$el.on(pos.IncomeAssetComponent.EVENT_SWIPE, function(events, incomeObj) {
					console.log("swipe >>>>> ");
					self.removeRetirementItem(incomeObj);
				});

				incomeItem.$el.on(pos.IncomeAssetComponent.EVENT_CHANGE, function(events, targetIncome, targetValueIncome) {
					//change the data in retirementPlan data and publish the event
					self.onValueChangeInRetirementComponent(targetIncome, targetValueIncome);
				});
			} else {
				incomeItem.$el.off(pos.IncomeAssetComponent.EVENT_START_DRAG);
				incomeItem.$el.off(pos.IncomeAssetComponent.EVENT_DRAGING);
				incomeItem.$el.off(pos.IncomeAssetComponent.EVENT_END_DRAG);
				incomeItem.$el.off(pos.IncomeAssetComponent.EVENT_SWIPE);
			}
		},

		onValueChangeInRetirementComponent: function(targetIncome, targetIncomeValue) {
			var retirementIncomeData = this.retirementPlanData.getIncomeAssetByType(targetIncome.getIncomeAssetType());
			retirementIncomeData.setValue(targetIncomeValue);
			this.retirementPlanData.publish(data.retirement.RetirementPlanData.EVENT_CHANGE_INCOME_ASSETS);
		},

		removeRetirementItem: function(incomeItem) {
			var self = this;
			var incomeType = incomeItem.getIncomeAssetType();
			var indexType = this._getIndexTypeList(incomeType);
			var $icon = this.$el.find('.characters-list').eq(indexType);

			incomeItem.$el.fadeOut(300, function() {
				self.addEventForIncomeItem(incomeItem, false);
				incomeItem.$el.remove();
			});

			$icon.removeClass('disabled');

			this.removeIncomeData(incomeType);
		},

		completeChoosingCharacterAnimation: function() {
			this.log("completeChoosingCharacterAnimation");
			// update state
			this.pageState = RetirementIncomeAsset.STATE_VIEW_CHARACTER_LIST;

			// add data
			var newItem = new data.retirement.RetirementIncomeAssetsData();
			newItem.setType(this.selectedItem.getIncomeAssetType());
			newItem.setValue(this.selectedItem.getSelectedValue());

			this.addIncomeData(newItem);
		},

		addIncomeData: function(newItem) {
			this.retirementPlanData.addIncomeAssetItem(newItem);
			this.retirementPlanData.publish(data.retirement.RetirementPlanData.EVENT_CHANGE_INCOME_ASSETS);
		},

		removeIncomeData: function(incomeType) {
			this.retirementPlanData.removeIncomeAssetsByType(incomeType);
			this.retirementPlanData.publish(data.retirement.RetirementPlanData.EVENT_CHANGE_INCOME_ASSETS);
		},

		/**
		 * next page handler
		 * @return {[type]} [description]
		 */
		nextPageHandler: function() {
			this.log("==nextPageHandler");

			var self = this;
			// animation after move to next page
			// fadeOut icon list
			var index = 0;
			var $icons = this.$el.find('.characters-list');

			var animateFn = function($icon) {
				$icon.animate({
					'opacity': 0
				}, {
					duration: 1500,
					specialEasing: {
						opacity: 'easeOutQuint'
					},
					complete: function() {

					}
				});
			};

			var timeOutFunc = function() {
				index++;
				startNewAnimate();
			};

			var startNewAnimate = function() {
				if (index < $icons.length) {
					//call animate the current index
					var $icon = $icons.eq(index);
					animateFn($icon);

					//set timeout to start the new one
					setTimeout(timeOutFunc, 200);
				} else {
					setTimeout(function() {
						self.$el.trigger(RetirementIncomeAsset.EVENT_NEXT);
					}, 200);

				}
			};

			startNewAnimate();
		},

		previousPageHandler: function() {
			this.log("==previousPageHandler");
			this.$el.trigger(RetirementIncomeAsset.EVENT_PREVIOUS);
		},


		log: function(msg) {
			if (this.options.isDebug) {
				console.log(msg);
			}
		},


		//>>>>>>>>>>>>>>for pageElement event >>>>>>>>>>>>
		getDocumentHTML : function() {
			// jshint multistr:true
			return	"<div class='retirement-income-asset'> \
					<div class='left-container'> \
						<div class='header'> \
							<div class='container'> \
								<div class='characters-list'> \
									<div class='inner'> \
									<div class='character-icon icon-income-current-assets'></div> \
									<p class='title'>CURRENT ASSETS</p> \
									</div> \
								</div> \
								<div class='characters-list'> \
									<div class='inner'> \
									<div class='character-icon icon-income-monthly-MPF'></div> \
									<p class='title'>MONTHLY MPF</p> \
									</div> \
								</div> \
								<div class='characters-list'> \
									<div class='inner'> \
									<div class='character-icon icon-income-current-monthly'></div> \
									<p class='title'>CURRENT MONTHLY<br> INCOME</p> \
									</div> \
								</div> \
								<div class='characters-list'> \
									<div class='inner'> \
									<div class='character-icon icon-income-existing-MPF-balance'></div> \
									<p class='title'>EXISTING MPF<br>BALANCE</p> \
									</div> \
								</div> \
								<div class='characters-list'> \
									<div class='inner'> \
									<div class='character-icon icon-income-saving-and-investments'></div> \
									<p class='title'>SAVINGS & INVESTMENTS<br>(EXCLUDING PROPERTY)</p> \
									</div> \
								</div> \
							</div> \
						</div> \
						<div class='middle'> \
							<div class='overlay'> \
								<div class='container'> \
									<div class='age-container'> \
										<p class='age-title'>Value</p> \
										<p class='age-num'>100 years</p> \
									</div> \
								</div> \
							</div> \
							<p class='title'>Retirement Income/Assets</p> \
							<div class='content-container'> \
							</div> \
						</div> \
						<div class='control-container'> \
							<p class='previous'>PREVIOUS</p> \
							<p class='next'>NEXT</p> \
						</div> \
					</div> \
				</div>";
		},

		onRender: function() {
			this.log("==RetirementIncomeAsset onRender " );
			this.initComponent();
			this.bindEvents(true);
		},

		onDestroy: function() {
			this.bindEvents(false);
		},

		//emotionalData is EmotionalFactFindingData
		setData: function(emotionalData) {
			this.retirementPlanData = emotionalData.getRetirementPlanData();

			/*
			//show the character accordingly
			var customerGender = emotionalData.getGettingToKnowYouData().getGender();
			var isMarried =data.ConfigData.isMarried(emotionalData.getGettingToKnowYouData().getMaritalStatus());

			//init customer
			this.customerCharacter = new pos.CharacterAge(null, {
				"gender": customerGender,
				"ageMin" : 1,
				"ageMax" : 80,
				"initAge" : emotionalData.getGettingToKnowYouData().getAge(),
				'widthMax': null,
				'heightMax': null,
				"isActiveEvent": false
			});
			this.$el.find(".left-container").append(this.customerCharacter.$el);
			this.customerCharacter.initialize();

			if (isMarried) {
				var customerIdentification = data.CharacterData.getIdentificationByAge(emotionalData.getGettingToKnowYouData().getAge(), emotionalData.getGettingToKnowYouData().getGender());
				var coupleIdentification = data.CharacterData.getAnotherCoupleByIndentification(customerIdentification);
				var coupleGender = data.CharacterData.getGenderByIdentification(coupleIdentification);
				this.coupleCharacter = new pos.CharacterAge(null, {
					"gender": coupleGender,
					"ageMin" : 1,
					"ageMax" : 80,
					"initAge" : emotionalData.getGettingToKnowYouData().getAge(),
					'widthMax': null,
					'heightMax': null,
					"isActiveEvent": false
				});
				this.$el.find(".left-container").append(this.coupleCharacter.$el);
				this.coupleCharacter.initialize();
			}

			this.renderCharacter();
			*/
		}

	};

	// exports
	var temporaryObj = RetirementIncomeAsset.prototype;
	RetirementIncomeAsset.prototype = Object.create(pos.PageElement.prototype);
	$.extend(RetirementIncomeAsset.prototype, temporaryObj);

	retirement.RetirementIncomeAsset = RetirementIncomeAsset;

}(page.retirement, jQuery));