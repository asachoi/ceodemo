/* © 2014 Aleph-labs.com
 * @author Thang Kieu
 */
// namespace
var page = page || {};
page.investment = page.investment || {};
var pos = pos || {};
var data = data || {};

(function(investment, $) {
	'use strict';

	/**
	 * InvestmentIncomeAsset component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function InvestmentIncomeAsset(element, options) {
		this.initialize(element, options);
		this.render();
	}

	InvestmentIncomeAsset.VERSION  = '3.3.1';


	InvestmentIncomeAsset.EVENT_NEXT = "event_next";
	InvestmentIncomeAsset.EVENT_PREVIOUS = "event_previous";

	InvestmentIncomeAsset.STATE_ANIMATING = "state_animating";
	InvestmentIncomeAsset.STATE_VIEW_CHARACTER_LIST = "state_view_character_list";
	InvestmentIncomeAsset.STATE_START_CHOOSE_CHARACTER = "state_start_choose_character";

	InvestmentIncomeAsset.DEFAULTS = {
		// no defaults for now
		isDebug:true,
		isStandalone: false,
		isMobileWebSimulator: false
	};


	InvestmentIncomeAsset.prototype = {
		constructor: InvestmentIncomeAsset,

		// houses
		house: null,

		// middle section
		$middleSection: null,

		//control
		$controlContainer: null,
		$nextBtn: null,
		$previousBtn: null,

		$selectedItem: null,
		houseWidth: 0,

		pageState: null,
		extraTopOffset: 0,

		investmentGoalData: null,

		initialize: function(element, options) {
			if (element) {
				this.$el  = $(element);
			} else {
				this.$el = $(this.getDocumentHTML());
			}
			this.el = this.$el[0];

			this.options   = $.extend({}, InvestmentIncomeAsset.DEFAULTS, options);
		},

		render: function() {
			if (this.options.isStandalone) {
				this.initComponent();
				this.bindEvents(true);

				this.setData(new data.EmotionalFactFindingData());
			}
		},

		initComponent: function() {
			this.$middleSection = this.$el.find(".middle");
			//for next-previous btn
			this.$nextBtn = this.$el.find(".control-container .next");
			this.$previousBtn = this.$el.find(".control-container .previous");
			this.$controlContainer = this.$el.find(".control-container");

			this.pageState = InvestmentIncomeAsset.STATE_START_CHOOSE_CHARACTER;

			this.setTargetPosition();
		},

		/**
		 * bind event
		 * @param  {Boolean} isActiveEvent [description]
		 * @return {[type]}                [description]
		 */
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

				// housing list
				this.$el.off().on('mousedown touchstart', '.character-icon', function(events) {
					events.stopPropagation();
					events.preventDefault();
					self.startClickCharacter(events);
				});
			} else {
				// this.$smallLady.off("mousedown touchstart");
				this.$nextBtn.off("click");
				this.$previousBtn.off("click");

				this.$el.find('.character-icon').each(function() {
					this.off('mousedown touchstart');
				});
			}
		},

		startClickCharacter: function(events) {
			//dont allow click if  we still have animationing
			if (this.pageState === InvestmentIncomeAsset.STATE_ANIMATING) {
				return;
			}

			// prevent when this icon is disabled
			// it's mean this options was selected
			var $option = $(events.target).closest('.characters-list');

			if ($option.hasClass('disabled')) {
				return;
			}

			this.pageState = InvestmentIncomeAsset.STATE_ANIMATING;
			this.chooseHouse(events);

			// this.pageState = InvestmentIncomeAsset.STATE_CHOOSING_CHARACTER_ANIMATING;
			var documentX = events.originalEvent.pageX;
			var documentY = events.originalEvent.pageY;
			if (this.options.isMobileWebSimulator) {
				//TODO : why using originalEvent.targetTouches[0]????
				documentX = events.originalEvent.targetTouches[0].pageX;
				documentY = events.originalEvent.targetTouches[0].pageY;
			}

			// position of mouse
			var pos = {
				x: documentX,
				y: documentY
			};
			// create house image
			this.createRetirementForAnimation(pos);

			this.activeMouseEvent(true);
		},

		/**
		 * active mouse event
		 *  for drag drop
		 */
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
		 * re-render house
		 * @return {[type]} [description]
		 */
		renderHouse: function() {
			var houseId = this.gettingToKnowYouData.getHousing();
			this.house = data.retirement.RetirementConfigData.HOUSES[houseId];

			var $selectedItem = $('<div />');
			$selectedItem.addClass('icon-housing-animation icon-retirement'); // icon-housing-mortgage

			// add class for bg
			$selectedItem.addClass(this.house.bg);

			this.$el.find('.left-container').append($selectedItem);
			this.houseWidth = $selectedItem.width();

			// var x = this.$middle
			var x = (this.$middleSection.width() - this.houseWidth) / 2;
			var y = this.$el.find('.content-container').offset().top;

			// get target position center
			var pos = {
				x: x,
				y: y
			};

			$selectedItem.css({
				'left': pos.x,
				'top': pos.y
			});
		},

		/**
		 * create image for animation
		 * @param  {[type]} pos [description]
		 * @return {[type]}     [description]
		 */
		createRetirementForAnimation: function(pos) {
			// var self = this;
			// var $selectedItem = this.$el.find('.icon-housing-animation');
			var $wrap = $('<div/>');
			var $topValue = $('<div/>');

			var $icon = $('<i/>');
			var $value = $('<p/>');
			var $name = $('<p/>');
			var $arrow = $('<i/>');
			// if ($icon.length <= 1) {

			// add class for bg
			$icon.addClass('icon-retirement ' + this.house.bg);
			// name
			$name
				.addClass('name')
				.text(this.house.name);
			// value
			$value
				.addClass('value')
				.text(this.house.value);
			// top arrow icon
			$arrow
				.addClass('icon-top-arrow');

			$topValue
				.addClass('top-value')
				.css('opacity', 0)
				.append($name)
				.append($value)
				.append($arrow);

			// append to wrap
			$wrap
				.css('width', data.retirement.RetirementConfigData.ITEM_WIDTH)
				.append($topValue)
				.append($icon)
				.addClass('retirement-item');
			// }
			this.$selectedItem = $wrap;

			this.$el.find('.left-container').append($wrap);
			this.houseWidth = $wrap.width();
			this.extraTopOffset = $wrap.height() / 1.5;

			$wrap.offset({
				'left': pos.x - this.houseWidth / 2,
				'top': pos.y - this.extraTopOffset
			});
		},

		startDragCharacter: function(events) {
			var documentX = events.originalEvent.pageX;
			var documentY = events.originalEvent.pageY;
			if (this.options.isMobileWebSimulator) {
				//TODO : why using originalEvent.targetTouches[0]????
				documentX = events.originalEvent.targetTouches[0].pageX;
				documentY = events.originalEvent.targetTouches[0].pageY;
			}


			var characterOffsetX = documentX - this.houseWidth / 2;
			var characterOffsetY = documentY - this.extraTopOffset;

			this.log("==characterOffsetX " + characterOffsetX + " / characterOffsetY = " + characterOffsetY);

			//update big lady position
			this.$selectedItem.offset({"left":characterOffsetX,"top":characterOffsetY});
		},

		endDragCharacter: function() {
			//var self = this;
			this.activeMouseEvent(false);

			var middleYPos = this.$el.find(".middle").offset().top + 110;
			if ((this.$selectedItem.offset().top + (this.$selectedItem.height() / 1.5)) < middleYPos) {
				//remove big character
				this.$selectedItem.remove();

				this.pageState = InvestmentIncomeAsset.STATE_START_CHOOSE_CHARACTER;
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

			// get target position center
			var pos = this.house.targetPos;

			// get top position
			var totalHeight = this.$middleSection.height();
			var selectedItemHeight = this.$selectedItem.height();

			var y = totalHeight - selectedItemHeight - data.retirement.RetirementConfigData.POSITION_BOTTOM;

			pos.y = y;

			// icon list
			var $icons = this.$el.find('.characters-list');
			var $icon = $icons.eq(this.house.id);

			// this.startAnimation();
			this.$selectedItem.animate({
				"left" : pos.x,
				"top": pos.y
			}, 500, "swing", function() {
				self.completeChoosingCharacterAnimation();

				// disable this icon
				$icon.addClass('disabled');

				self.$selectedItem.find('.top-value').animate({'opacity': 1}, 200);
			});

			this.$selectedItem.swipe({
				//Generic swipe handler for all directions
				swipe:function(/*event, direction, distance, duration, fingerCount, fingerData*/) {
					console.log("==swipe");
					self.removeRetirementItem(this, $icon);
				},
				//Default is 75px, set to 0 for demo so any distance triggers swipe
				threshold:10,
				maxTimeThreshold: 200
			});
		},

		removeRetirementItem: function(el, $icon) {
			el.fadeOut(300, function() {
				this.remove();
			});

			$icon.removeClass('disabled');
		},

		/**
		 * get target position
		 */
		setTargetPosition: function() {
			var x = 40;

			var totalW = this.$middleSection.width() - (x * 2);
			var totalItem = data.retirement.RetirementConfigData.HOUSES.length;
			var itemW = data.retirement.RetirementConfigData.ITEM_WIDTH; // this.$selectedItem.width();

			var totalDistance = 0;
			var distance = 0;
			// var itemId = this.house.id;

			totalDistance = totalW - (totalItem * itemW);
			distance = totalDistance / (totalItem - 1);

			for (var i = 0; i < totalItem; i++) {
				data.retirement.RetirementConfigData.HOUSES[i].targetPos.x = x;
				x = x + itemW + distance;
			}
		},

		completeChoosingCharacterAnimation: function() {
			this.log("completeChoosingCharacterAnimation");
			// update state
			this.pageState = InvestmentIncomeAsset.STATE_VIEW_CHARACTER_LIST;
		},

		/**
		 * set data of house
		 * @return {[type]} [description]
		 */
		chooseHouse: function(events) {
			// console.log('--- Add house data');
			var $el = $(events.target);
			var id = $el.closest('.characters-list').index();

			this.house = data.retirement.RetirementConfigData.HOUSES[id];
			this.house.id = id;
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
						self.$el.trigger(InvestmentIncomeAsset.EVENT_NEXT);
					}, 200);

				}
			};

			startNewAnimate();
		},

		previousPageHandler: function() {
			this.log("==previousPageHandler");
			this.$el.trigger(InvestmentIncomeAsset.EVENT_PREVIOUS);
		},

		//utilities for parent class
		getSuperClass: function() {
			return pos.PageElement.prototype;
		},

		//>>>>>>>>>>>>>>for pageElement event >>>>>>>>>>>>
		getDocumentHTML : function() {
			// jshint multistr:true
			return	"<div class='emotional-investment-income-asset'>\
					<div class='left-container'>\
						<div class='header'>\
							<div class='container'>\
								<div class='characters-list'>\
									<div class='inner'>\
									<div class='character-icon icon-mortgage'></div>\
									<p class='title'>Mortgage</p>\
									</div>\
								</div>\
								<div class='characters-list'>\
									<div class='inner'>\
									<div class='character-icon icon-fully-owned'></div>\
									<p class='title'>Fully owned</p>\
									</div>\
								</div>\
								<div class='characters-list'>\
									<div class='inner'>\
									<div class='character-icon icon-rented'></div>\
									<p class='title'>Rented</p>\
									</div>\
								</div>\
								<div class='characters-list'>\
									<div class='inner'>\
									<div class='character-icon icon-living-with-family'></div>\
									<p class='title'>Living with family</p>\
									</div>\
								</div>\
								<div class='characters-list'>\
									<div class='inner'>\
									<div class='character-icon icon-living-with-family'></div>\
									<p class='title'>Living with family</p>\
									</div>\
								</div>\
							</div>\
						</div>\
						<div class='middle'>\
							<p class='title'>Retirement Income/Assets</p>\
							<div class='content-container'>\
							</div>\
							<div class='control-container'>\
								<p class='previous'>PREVIOUS</p>\
								<p class='next'>NEXT</p>\
							</div>\
						</div>\
					</div>\
				</div>";
		},

		onRender: function() {
			this.log("==InvestmentIncomeAsset onRender " );
			this.initComponent();
			this.bindEvents(true);
		},

		//emotionalData is EmotionalFactFindingData
		setData: function(emotionalData) {
			console.log("==setData >>> " + emotionalData.getInvestmentGoalData());
			this.investmentGoalData = emotionalData.getInvestmentGoalData();
		}

	};

	var temporaryObj = InvestmentIncomeAsset.prototype;
	InvestmentIncomeAsset.prototype = Object.create(pos.PageElement.prototype);
	$.extend(InvestmentIncomeAsset.prototype, temporaryObj);

	// exports
	investment.InvestmentIncomeAsset = InvestmentIncomeAsset;
}(page.investment, jQuery));