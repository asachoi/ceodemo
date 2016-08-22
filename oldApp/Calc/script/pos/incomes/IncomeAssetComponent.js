/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var pos = pos || {};
var data = data || {};

(function(pos, $) {
	'use strict';
	/**
	 * IncomeAssetComponent component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 *  This class controll the changing age of character by using drag, drop
	 *  each period age has range, and has an image for range
	 */
	function IncomeAssetComponent(element, options) {
		if (element) {
			this.$el  = $(element);
		} else {
			this.$el = $(IncomeAssetComponent.htmlTemplate);
		}

		this.el = this.$el[0];
		// store this instance to data object so that I can retrieve it later
		this.$el.data('character_age', this);
		this.options   = $.extend({}, IncomeAssetComponent.DEFAULTS, options);
	}

	IncomeAssetComponent.VERSION  = '3.3.1';

	IncomeAssetComponent.STATE_SELECTED_AGE = "ch_selected_age";
	IncomeAssetComponent.EVENT_CHANGE = "character_change";

	IncomeAssetComponent.EVENT_START_DRAG = "character_age_event_start_drag";
	IncomeAssetComponent.EVENT_DRAGING = "character_age_event_dragged";
	IncomeAssetComponent.EVENT_END_DRAG = "character_age_event_end_drag";

	IncomeAssetComponent.EVENT_SWIPE = "character_age_event_swipe";

	//constant for long press detection
	IncomeAssetComponent.LONG_PRESS_MAX_TIME = 250;
	IncomeAssetComponent.LONG_PRESS_MAX_DISTANCE = 100000;	//mean we dont care about the max distance

	IncomeAssetComponent.DEFAULTS = {
		// no defaults for now
		isDebug: true,
		incomeAssetsType: data.retirement.RetirementIncomeAssetsData.UNIDENTIFY,
		ageImageList: [],
		valueMin: 20000,
		valueMax: 80000,
		initValue: 30000,
		widthMax: 75,
		heightMax: 75,
		isActiveEvent: false,
		isMobileWebSimulator: false
	};

	IncomeAssetComponent.prototype = {
		constructor: IncomeAssetComponent,

		$el: null,
		el: null,

		//data config
		ageImageListData : null,
		valueMin: -1,
		valueMax: -1,

		//all component
		$ageImage: null,
		$ageTitleSection: null,
		$ageImageSection: null,

		//temporary storage
		clickPos: null,
		cachedHeight: null,
		cachedOffset: null,
		temporaryValue: -1,
		selectedValue: -1,

		ageImgInstanceList: null,
		renderedImgIndex: null,

		//for public
		ageImageSectionOffset: null,

		//for check long press event
		timeoutId: null,
		isSatisfyLongPress: null,
		isDetectingLongPress:null,

		renderItems: function() {

		},

		//this method must call after $el is added into DOM
		initialize: function () {
			var self = this;
			this.$el.swipe({
				//Generic swipe handler for all directions
				swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
					console.log("==swipe");
					self.$el.trigger(IncomeAssetComponent.EVENT_SWIPE, [self]);
				},
				//Default is 75px, set to 0 for demo so any distance triggers swipe
				threshold:10,
				maxTimeThreshold: 200
			});
			this.initComponent();
			this.bindEvents();
			this.initDefaultValue();

			this.resetDectectLongPress();
		},

		bindEvents: function() {
			this.activeAction(this.options.isActiveEvent);
		},

		activeAction: function(isActive) {
			this.options.isActiveEvent = isActive;

			if (isActive) {
				var self = this;
				this.$el.on("mousedown touchstart", function(events) {
					events.stopPropagation();
					events.preventDefault();

					//handle click event
					self.startTouch(events);
				});

				this.$el.swipe("enable");
			} else {
				this.$el.off("mousedown touchstart");
				this.$el.swipe("disable");
			}
		},

		initComponent: function() {
			this.getValueFromOption();

			this.clickPos = {
				"x" : 0,
				"y" : 0
			};

			//component
			this.$ageTitleSection = this.$el.find(".title-section");
			this.$ageImageSection = this.$el.find(".image-container-section");

			this.initImgInstanceList();

			this.selectedValue = this.options.initValue;
			this.renderValue(this.selectedValue);

		},

		getValueFromOption: function() {
			this.valueMin = this.options.valueMin;
			this.valueMax = this.options.valueMax;

			this.ageImageListData = this.options.ageImageList;
		},

		initImgInstanceList: function() {
			this.$ageImageSection.empty();
			this.ageImgInstanceList = [];

			for (var i = 0; i < this.ageImageListData.length; i++) {
				var imgStr = "<div class='img-container'>" +
					"<img src='"+ this.ageImageListData[i] + "' class='age-image' " +
					"style='width:" + this.options.widthMax + "px'" + "/>"+
					"</div>";
				var $imgobj = $(imgStr);
				this.$ageImageSection.append($imgobj);
				$imgobj.css({"opacity" : 0});
				//$imgobj.hide();
				this.ageImgInstanceList.push($imgobj);
			}
		},

		initDefaultValue: function() {
			this.$ageImageSection.css({
				"width": this.options.widthMax + "px",
				"height": this.options.heightMax + "px"
			});

			this.$el.css({
				"width": this.options.widthMax + "px"
			});

			//get age section offset
			var containerOffset = this.$el.offset();
			var ageOffset = this.$ageImageSection.offset();
			this.ageImageSectionOffset  = {
				"top": ageOffset.top - containerOffset.top,
				"left": ageOffset.left - containerOffset.left
			};

			//this.hideAgeSection();
		},

		renderValue: function(age) {
			age = Math.round(age);
			this.$el.find(".title-section .value-num").html(age);

			//choose correct image
			// we divide equally
			var targetIndex = -1;
			var distanceStep = (this.valueMax - this.valueMin) / (this.ageImageListData.length - 1);
			var distance = age - this.valueMin;
			var indexImage = distance / distanceStep;
			targetIndex = Math.round(indexImage);

			for (var i = 0; i < this.ageImgInstanceList.length; i++) {
				var $objItem = this.ageImgInstanceList[i];
				if (targetIndex === i) {
					$objItem.css({"opacity" : 1});
					//$objItem.show();
				} else {
					$objItem.css({"opacity" : 0});
					//$objItem.hide();
				}
			}
		},

		calculateAgeBaseOnDistance: function(distance) {
			var maxAgeDistance = this.valueMax - this.valueMin;
			//var maxDistance = this.$el.height();
			var maxDistance = this.cachedHeight;
			var ratio = maxDistance / maxAgeDistance;	//how much distance for one age

			var age = distance / ratio;

			return age;
		},

		//>>>>>>>>>>>event control >>>>>>>>>>>>
		startTouch: function(events) {
			var self = this;
			var documentX = events.originalEvent.pageX;
			var documentY = events.originalEvent.pageY;
			if (this.options.isMobileWebSimulator) {
				//TODO : why using originalEvent.targetTouches[0]????
				documentX = events.originalEvent.targetTouches[0].pageX;
				documentY = events.originalEvent.targetTouches[0].pageY;
			}

			var containerOffset = this.$el.offset();
			this.clickPos.x = documentX - containerOffset.left;
			this.clickPos.y = documentY - containerOffset.top;
			console.log("===startTouch " + this.clickPos.x + "/ " + this.clickPos.y);

			this.cachedHeight = this.$el.height();
			this.cachedOffset = containerOffset;

			//active event handler
			this.activeDragBehavior(true);

			console.log("==start long press detection");
			this.isSatisfyLongPress = false;
			this.timeoutId = null;
			this.isDetectingLongPress = true;

			this.timeoutId = setTimeout(function() {
				console.log("==satisfy long press");
				self.isSatisfyLongPress = true;
				self.timeoutId = null;
				self.isDetectingLongPress = false;

				self.$el.trigger(IncomeAssetComponent.EVENT_START_DRAG, [self.selectedValue]);
			}, IncomeAssetComponent.LONG_PRESS_MAX_TIME);

			//this.$el.trigger(CharacterAge.EVENT_START_DRAG, [this.selectedValue]);
		},

		resetDectectLongPress: function() {
			this.isSatisfyLongPress = false;
			this.timeoutId = null;
			this.isDetectingLongPress = false;
		},

		startDrag: function(events) {
			var documentX = events.originalEvent.pageX;
			var documentY = events.originalEvent.pageY;
			if (this.options.isMobileWebSimulator) {
				//TODO : why using originalEvent.targetTouches[0]????
				documentX = events.originalEvent.targetTouches[0].pageX;
				documentY = events.originalEvent.targetTouches[0].pageY;
			}

			//var containerOffset = this.$el.offset();
			var containerOffset = this.cachedOffset;

			var dragPos = {};
			dragPos.x = documentX - containerOffset.left;
			dragPos.y = documentY - containerOffset.top;

			//only care about the y position
			var distance = -(dragPos.y - this.clickPos.y);

			//isDetecting and distance > MAX_DISTANCE => invalid long press
			if (this.isDetectingLongPress && Math.abs(distance) > IncomeAssetComponent.LONG_PRESS_MAX_DISTANCE) {
				console.log("==exceed max distance fof long press");
				clearTimeout(this.timeoutId);
				this.resetDectectLongPress();
			} else {
				if (!this.isDetectingLongPress && this.isSatisfyLongPress) {	//not detecting and satification => permit drag
					console.log("==sastisfy long press for dragging");
					var marginAgeFromSelectedAge = this.calculateAgeBaseOnDistance(distance);
					var targetValue = this.selectedValue + marginAgeFromSelectedAge;
					if (targetValue > this.valueMax) {
						targetValue = this.valueMax;
					}

					if (targetValue < this.valueMin) {
						targetValue = this.valueMin;
					}

					console.log("==targetAge " + targetValue + " / " + this.valueMin + " / " + this.valueMax + "/ " + this.selectedValue);

					//render the age
					this.renderValue(targetValue);
					this.temporaryValue = targetValue;

					this.$el.trigger(IncomeAssetComponent.EVENT_DRAGING, [targetValue]);
				} else {

				}
			}
		},

		//TODO : pay attention in touchend event in ipad, currently, we disable it
		endDrag: function(events) {
			if (this.isDetectingLongPress) {
				console.log("==not enough max time for long press");
				clearTimeout(this.timeoutId);
				this.resetDectectLongPress();
			} else {
				if (!this.isDetectingLongPress && this.isSatisfyLongPress) {	//not detecting and satification => permit drag
					console.log("==sastisfy long press for end drag");
					this.log("endDrag");
					this.selectedValue = this.temporaryValue;
					this.activeDragBehavior(false);
					this.$el.trigger(IncomeAssetComponent.EVENT_CHANGE, [this, this.selectedValue]);

					this.$el.trigger(IncomeAssetComponent.EVENT_END_DRAG);
				}
			}
		},

		//drag behavior
		activeDragBehavior: function(isActive) {
			if (isActive) {
				var self = this;

				$(window).on("mousemove touchmove", function(events) {
					events.stopPropagation();

					//handle drag event
					self.startDrag(events);
				});

				$(window).on("mouseup touchend", function(events) {
					events.stopPropagation();

					//handle end drag event
					self.endDrag(events);
				});
			} else {
				$(window).off("mousemove touchend");
				$(window).off("mouseup touchmove");
			}

		},

		//>>>>>>>>>>end event control

		log: function(msg) {
			if (this.options.isDebug) {
				console.log(msg);
			}
		},

		getIncomeAssetType: function() {
			return this.options.incomeAssetsType;
		},

		getSelectedValue: function() {
			return this.selectedValue;
		}

	};

	IncomeAssetComponent.htmlTemplate = "<div class='income-assets'>" +
							"<div class='image-container-section'>"+
								"<img class='age-image'>" +
								"</img>" +
							"</div>" +
							"<div class='title-section'>" +
								"<label class='title'>CURRENT MONTHLY INCOME</label>" +
								"<label class='value-num'>200000</label>" +
								"<div class='icon'></div>" +
							"</div>" +
						"</div>";

	// exports
	pos.IncomeAssetComponent = IncomeAssetComponent;
}(pos, jQuery));