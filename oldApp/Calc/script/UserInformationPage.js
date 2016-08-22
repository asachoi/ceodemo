/* © 2014 Aleph-labs.com
 * @author Phuong Vo
 */
// namespace
var page = page || {};

(function(page, $) {
	'use strict';

	/**
	 * UserInformationPage component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function UserInformationPage(element, options) {
			this.$el  = $(element);
			this.el = this.$el[0];
			// store this instance to data object so that I can retrieve it later
			this.$el.data('user_landing_screen', this);
			//
			this.options   = $.extend({}, UserInformationPage.DEFAULTS, options);
			this.initComponent();
			this.bindEvents();
	}

	UserInformationPage.VERSION  = '3.3.1';

	UserInformationPage.DEFAULTS = {
			// no defaults for now
	};

	UserInformationPage.TIME_DISTANCE = 500;


	UserInformationPage.prototype = {
		constructor: UserInformationPage,

		$el: null,
		el: null,

		swipePanelControl: null,
		landingScreen: null,
		animationScreen: null,


		bindEvents: function() {
			var self = this;
			this.landingScreen.$el.on(page.UserLandingScreen.EVENT_CHOOSE_ITEM, function(events, index) {
				self.chooseItemAtIndex(index);
			});
		},

		initComponent: function() {
			var self = this;
			var swipeHTML = this.$el.find('.swiper-container')[0];
			this.swipePanelControl = new pos.SwipePanel(swipeHTML, {});

			var landingHTML = this.$el.find('.user-landing-screen')[0];
			this.landingScreen = new page.UserLandingScreen(landingHTML, {
				"isStandalone": true
			});

			var animationHTML = this.$el.find('.about-you-page')[0];
			this.animationScreen = new page.AboutYouPage(animationHTML, {
				"isStandalone": true
			});

			var footer = this.$el.find(".active-panel");
			footer.hide();

			//this.landingScreen.startFadInAnimation();
			setTimeout(function() {
				self.startApp();
			}, 1000);

			var htmlUserState = this.$el.find(".user-life-stage")[0];
			var userLife = new page.UserLifeState(htmlUserState, {});

			var animationSVGHTML = this.$el.find(".animation-page-svg")[0];
			var aboutYouPage = new page.AboutYouPage(animationSVGHTML, {});

			var closeIcon = this.$el.find(".imageIconClose");
			closeIcon.on("click", function() {
				window.open("index_paralex.html");
			});
		},

		chooseItemAtIndex: function(index) {
			this.swipePanelControl.doAction("right");
		},

		startApp: function() {
			this.landingScreen.startFadInAnimation();
		}
	};

	// exports
	page.UserInformationPage = UserInformationPage;
}(page, jQuery));