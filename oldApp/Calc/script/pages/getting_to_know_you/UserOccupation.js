/* © 2014 Aleph-labs.com
 * @author Phuong VO
 */
// namespace
var page = page || {};
var pos = pos || {};
var data = data || {};

(function(page, $) {
	'use strict';


	/**
	 * UserOccupation component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function UserOccupation(element, options) {
		this.initialize(element, options);
		this.render();
	}

	UserOccupation.VERSION  = '3.3.1';


	UserOccupation.EVENT_NEXT = "event_next";
	UserOccupation.EVENT_PREVIOUS = "event_previous";

	UserOccupation.STATE_ANIMATING = "state_animating";
	UserOccupation.STATE_READY_TO_RECEIVE_EVENT = "state_ready_to_receive_event";

	UserOccupation.DISTANCE_CHARACTER = -450;
	UserOccupation.INIT_CUSTOMER_X = 230;
	UserOccupation.INIT_CUSTOMER_Y = 190;
	UserOccupation.INIT_CUSTOMER_X_RIGHT = -10;
	UserOccupation.INIT_CUSTOMER_Y_BOTTOM = 70;

	UserOccupation.DEFAULTS = {
		// no defaults for now
		isDebug:true,
		isStandalone: false,
		isMobileWebSimulator: false
	};

	UserOccupation.ClassList =[
		"occupation-professional",
		"occupation-civil-servant",
		"occupation-executive",
		"occupation-supervisor-manager",
		"occupation-intermediate-staff",
		"occupation-career-starter",
		"occupation-self-employed"
	];

	UserOccupation.ValueList =[
		data.ConfigData.OCCUPATION_PROFESSIONAL,
		data.ConfigData.OCCUPATION_CIVIL_SERVANT,
		data.ConfigData.OCCUPATION_EXECUTIVE,
		data.ConfigData.OCCUPATION_SUPERVISOR_MANAGER,
		data.ConfigData.OCCUPATION_INTERMEDIATE_STAFF,
		data.ConfigData.OCCUPATION_CAREER_STARTER,
		data.ConfigData.OCCUPATION_SELF_EMPLOYED
	];

	UserOccupation.prototype = {
		constructor: UserOccupation,

		$el: null,
		el: null,

		carousel : null,
		customerCharacter: null,
		coupleCharacter: null,

		$dragItem: null,
		offsetClick: null, //store the
		pageState: null,	//state for animation, finish or ready to handle the click event

		//data
		gettingToKnowYouData: null,
		occupationValue : null,

		initialize: function(element, options) {
			if (element) {
				this.$el  = $(element);
			} else {
				this.$el = $(this.getDocumentHTML());
			}
			this.el = this.$el[0];

			this.options   = $.extend({}, UserOccupation.DEFAULTS, options);

			this.pageState = UserOccupation.STATE_READY_TO_RECEIVE_EVENT;
			this.occupationValue = null;
			this.offsetClick = null;
			this.$dragItem = null;

			this.gettingToKnowYouData = new data.GettingToKnowYouData();
			if (this.options.isStandalone) {
				this.gettingToKnowYouData.setGender(data.CharacterData.MALE);
				this.gettingToKnowYouData.setAge(data.CharacterData.AGE_DEFAULT_MAN);
				//this.gettingToKnowYouData.setMaritalStatus(data.ConfigData.MARITAL_MARRIED.toString());
			}
		},

		initComponent: function() {
			this.carousel = new pos.SwiperCarousel(this.$el.find('.swiper-carousel'));
			this.$dragItem = this.$el.find(".drag-item");
			this.$dragItem.css({
				"opacity": 0,
				"z-index": 0
			});
		},

		render: function() {
			if (this.options.isStandalone) {
				this.initComponent();
				this.bindEvents(true);

				this.setData(this.gettingToKnowYouData);
			}
		},

		renderCharacter: function() {
			var $container = this.$el.find(".left-container");
			var xPos = $container.width() - UserOccupation.INIT_CUSTOMER_X_RIGHT - this.customerCharacter.$el.width();
			var yPos = $container.height() - UserOccupation.INIT_CUSTOMER_Y_BOTTOM - this.customerCharacter.$el.height();
			if (this.coupleCharacter) {
				this.coupleCharacter.$el.css({
					"left": xPos,
					"top": yPos
				});
				/*
				this.coupleCharacter.$el.css({
					"left": UserOccupation.INIT_CUSTOMER_X + this.customerCharacter.$el.width() + UserOccupation.DISTANCE_CHARACTER,
					"top": UserOccupation.INIT_CUSTOMER_Y + this.customerCharacter.$el.height() - this.coupleCharacter.$el.height()
				});
*/
				xPos = xPos - this.coupleCharacter.$el.width() - UserOccupation.DISTANCE_CHARACTER;
			}

			this.customerCharacter.$el.css({
				"left": xPos,
				"top": yPos
			});

		},

		completeDragItem: function() {
			var self = this;
			this.$dragItem.animate({
				"opacity": 0
			}, 1000, "swing", function() {
				self.pageState = UserOccupation.STATE_READY_TO_RECEIVE_EVENT;

				//get data for current item
				var occupationClass = self._getOccupationClassByItemHeader(self.$dragItem);
				var occupationData = self._getOccupationDataFromOccupationClass(occupationClass);
				console.log("==completeDragItem occupationData=  " + occupationData);

				//set gettingtoknowyou data
				self.gettingToKnowYouData.setOccupation(occupationData);
				self.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_OCCUPATION);
			});
		},

		showDragItem: function() {
			this.$dragItem.css({
				"opacity": 1,
				"z-index": 2
			});
		},

		hideDragItem: function() {
			this.$dragItem.css({
				"opacity": 0,
				"z-index": 0
			});
		},

		_getOccupationDataFromOccupationClass: function(occupationClass) {
			var result = 0;
			for (var i = 0; i < UserOccupation.ClassList.length; i++) {
				if (occupationClass.toString().toLowerCase() === UserOccupation.ClassList[i]) {
					result = i;
					break;
				}
			}

			return UserOccupation.ValueList[result];
		},

		_getOccupationClassByItemHeader: function($itemHeader) {
			for (var i = 0; i < UserOccupation.ClassList.length; i++) {
				if ($itemHeader.hasClass(UserOccupation.ClassList[i])) {
					return UserOccupation.ClassList[i];
				}
			}

			return null;
		},

		//>>>>>>>>>>>>>>event handler>>>>>>>>>>>>>>>>>>
		bindEvents: function(isActiveEvent) {
			if (isActiveEvent) {
				var self = this;

				//for next-previous button
				this.$el.find(".control-container .next").on("click", function() {
					self.nextPageHandler();
				});
				this.$el.find(".control-container .previous").on("click", function() {
					self.previousPageHandler();
				});

				//init event for header
				this.$el.find(".swiper-wrapper .occupation-item").on("mousedown touchstart", function(event) {
					event.stopPropagation();
					event.preventDefault();
					self.startCLickItemInHeader(event);
				});

			} else {
				this.$el.find(".control-container .next").off("click");
				this.$el.find(".control-container .previous").off("click");
				this.$el.find(".swiper-wrapper .occupation-item").off("mousedown touchstart");
			}
		},

		activeMouseMoveEvent: function(isActive) {
			var self = this;
			if (isActive) {
				this.$el.on("mousemove touchmove", function(event) {
					event.stopPropagation();
					self.startDragItem(event);
				});

				this.$el.on("mouseup touchend", function(event) {
					event.stopPropagation();
					event.preventDefault();
					self.endDragItem(event);
				});
			} else {
				this.$el.off("mousemove touchend");
				this.$el.off("mouseup touchmove");

			}
		},

		startCLickItemInHeader: function(event) {
			if (this.pageState === UserOccupation.STATE_ANIMATING) {
				return;
			}

			var documentX = event.originalEvent.pageX;
			var documentY = event.originalEvent.pageY;
			if (this.options.isMobileWebSimulator) {
				//TODO : why using originalEvent.targetTouches[0]????
				documentX = event.originalEvent.targetTouches[0].pageX;
				documentY = event.originalEvent.targetTouches[0].pageY;
			}

			//store the position for move
			var $item = $(event.target);
			var itemOffset = $item.offset();
			this.offsetClick = {
				top : (documentY - itemOffset.top),
				left : (documentX - itemOffset.left)
			};

			//update the drag object(position and class)
			this.$dragItem.offset({
				'left':itemOffset.left,
				'top':itemOffset.top
			});
			var occupationClass = this._getOccupationClassByItemHeader($item);
			this.$dragItem.removeClass()
				.addClass("drag-item occupation-item " + occupationClass);


			this.showDragItem();

			//active drag-drop event
			this.activeMouseMoveEvent(true);
			this.pageState = UserOccupation.STATE_ANIMATING;
		},

		startDragItem: function(event) {
			var documentX = event.originalEvent.pageX;
			var documentY = event.originalEvent.pageY;
			if (this.options.isMobileWebSimulator) {
				//TODO : why using originalEvent.targetTouches[0]????
				documentX = event.originalEvent.targetTouches[0].pageX;
				documentY = event.originalEvent.targetTouches[0].pageY;
			}
			this.log("==obj left " + (documentX - this.offsetClick.left) + " / object top = " + (documentY - this.offsetClick.top));
			//update drag item accordingly
			this.$dragItem.offset({
				'left': (documentX - this.offsetClick.left),
				'top': (documentY - this.offsetClick.top)
			});
		},

		endDragItem: function() {
			this.activeMouseMoveEvent(false);

			var middleYPos = this.$el.find(".middle").offset().top + 110;
			if (this.$dragItem.offset().top < middleYPos) {
				//this.$dragItem.hide();
				this.hideDragItem();

				this.pageState = UserOccupation.STATE_READY_TO_RECEIVE_EVENT;
			} else {
				this.completeDragItem();
			}
		},

		nextPageHandler: function() {
			this.log("==nextPageHandler");
			//this.$el.trigger(UserOccupation.EVENT_NEXT);
			this.navigateToNextPreviousPage(true);
		},

		previousPageHandler: function() {
			this.log("==previousPageHandler");
			//this.$el.trigger(UserOccupation.EVENT_PREVIOUS);
			this.navigateToNextPreviousPage(false);
		},

		navigateToNextPreviousPage: function(isNext) {
			var self = this;
			var animateIndex = 0;
			var $headerItemObj = this.$el.find(".characters-list");

			var animateIconCharacterFunc = function($icon) {
				$icon.animate({
					"opacity" : 0
				},  {
					duration: 1500,
					specialEasing: {
						opacity: "easeOutQuint"
					},
					complete: function() {
					}
				});
			};

			var timeOutFunc = function() {
				animateIndex ++;
				startNewAnimate();
			};

			var startNewAnimate = function() {
				if (animateIndex < $headerItemObj.length) {
					//call animate the current index
					var $icon = $($headerItemObj[animateIndex]);
					animateIconCharacterFunc($icon);

					//set timeout to start the new one
					setTimeout(timeOutFunc, 200);
				} else {
					setTimeout(function() {
						//console.log("==complete event");
						if (isNext) {
							self.$el.trigger(UserOccupation.EVENT_NEXT);
						} else {
							self.$el.trigger(UserOccupation.EVENT_PREVIOUS);
						}

					}, 200);

				}
			};

			startNewAnimate();
		},

		//>>>>>>>>>>>>>>>end event handler >>>>>>>>>>>>>>

		log: function(msg) {
			if (this.options.isDebug) {
				console.log(msg);
			}
		},


		//>>>>>>>>>>>>>>for pageElement event >>>>>>>>>>>>
		/*jshint multistr: true */
		getDocumentHTML : function() {
			return	"<div class='user-occupation'> \
						<div class='left-container'>\
							<div class='header'>\
								<div class='swiper-container swiper-carousel'>\
									<div class='left-gradient'></div>\
									<div class='right-gradient'></div>\
									<div class='container swiper-wrapper'>\
										<div class='swiper-slide characters-list'>\
											<div class='inner'>\
												<div class='occupation-item occupation-professional'></div>\
												<p class='title'>PROFESSIONAL</p>\
											</div>\
										</div>\
										<div class='swiper-slide characters-list'>\
											<div class='inner'>\
												<div class='occupation-item occupation-civil-servant'></div>\
												<p class='title'>CIVIL SERVANT</p>\
											</div>\
										</div>\
										<div class='swiper-slide characters-list'>\
											<div class='inner'>\
												<div class='occupation-item occupation-executive'></div>\
												<p class='title'>EXECUTIVE</p>\
											</div>\
										</div>\
										<div class='swiper-slide characters-list'>\
											<div class='inner'>\
												<div class='occupation-item occupation-supervisor-manager'></div>\
												<p class='title'>SUPERVISOR/<br>MANAGER</p>\
											</div>\
										</div>\
										<div class='swiper-slide characters-list'>\
											<div class='inner'>\
												<div class='occupation-item occupation-intermediate-staff'></div>\
												<p class='title'>INTERMEDIATE<br>STAFF</p>\
											</div>\
										</div>\
										<div class='swiper-slide characters-list'>\
											<div class='inner'>\
												<div class='occupation-item occupation-career-starter'></div>\
												<p class='title'>CAREER<br>STARTER</p>\
											</div>\
										</div>\
										<div class='swiper-slide characters-list'>\
											<div class='inner'>\
												<div class='occupation-item occupation-self-employed'></div>\
												<p class='title'>SELF<br>EMPLOYED</p>\
											</div>\
										</div>\
									</div>\
									<i class='icon-switch icon-switch-left hidden'></i>\
									<i class='icon-switch icon-switch-right'></i>\
								</div>\
								<i class='icon-switch icon-switch-left'></i>\
								<i class='icon-switch icon-switch-right'></i>\
							</div>\
							<div class='middle'>\
								<p class='header_title'>Occupation</p>\
								<div class='content-container'>\
									<div class='character'>\
										<div class='big-lady'>\
										</div>\
									</div>\
									<div class='main-info'>\
									</div>\
								</div>\
								<div class='control-container'>\
									<p class='previous'>PREVIOUS</p>\
									<p class='next'>NEXT</p>\
								</div>\
							</div>\
							<div class='drag-item occupation-item occupation-intermediate-staff'>\
							</div>\
						</div>\
					</div>";
		},

		onRender: function() {
			this.log("==UserOccupation onRender " );
			this.initComponent();
			this.bindEvents(true);
		},

		onDestroy: function() {
			this.log("==UserOccupation onDestroy ");
			this.bindEvents(false);
		},

		onStart: function() {
			this.log("==UserOccupation onStart ");
		},

		setData: function(dataObj) {
			this.gettingToKnowYouData =dataObj;

			var initTop = UserOccupation.INIT_CUSTOMER_Y;
			var initLeft = UserOccupation.INIT_CUSTOMER_X;

			//show the character accordingly
			var customerGender = this.gettingToKnowYouData.getGender();
			var isMarried =data.ConfigData.isMarried(this.gettingToKnowYouData.getMaritalStatus());

			//init customer
			this.customerCharacter = new pos.CharacterAge(null, {
				"gender": customerGender,
				"ageMin" : 1,
				"ageMax" : 80,
				"initAge" : this.gettingToKnowYouData.getAge(),
				'widthMax': null,
				'heightMax': null,
				"isActiveEvent": false
			});
			this.$el.find(".left-container").append(this.customerCharacter.$el);
			this.customerCharacter.initialize();
			this.customerCharacter.$el.css({
				"left": initLeft,
				"top": initTop
			});

			if (isMarried) {
				var customerIdentification = data.CharacterData.getIdentificationByAge(this.gettingToKnowYouData.getAge(), this.gettingToKnowYouData.getGender());
				var coupleIdentification = data.CharacterData.getAnotherCoupleByIndentification(customerIdentification);
				var coupleGender = data.CharacterData.getGenderByIdentification(coupleIdentification);
				this.coupleCharacter = new pos.CharacterAge(null, {
					"gender": coupleGender,
					"ageMin" : 1,
					"ageMax" : 80,
					"initAge" : this.gettingToKnowYouData.getAge(),
					'widthMax': null,
					'heightMax': null,
					"isActiveEvent": false
				});
				this.$el.find(".left-container").append(this.coupleCharacter.$el);
				this.coupleCharacter.initialize();
				this.coupleCharacter.$el.css({
					"left": initLeft + this.coupleCharacter.$el.width() + UserOccupation.DISTANCE_CHARACTER,
					"top": initTop
				});
			}

			this.renderCharacter();
		}

	};


	// exports
	var temporaryObj = UserOccupation.prototype;
	UserOccupation.prototype = Object.create(pos.PageElement.prototype);
	$.extend(UserOccupation.prototype, temporaryObj);

	page.UserOccupation = UserOccupation;

}(page, jQuery));