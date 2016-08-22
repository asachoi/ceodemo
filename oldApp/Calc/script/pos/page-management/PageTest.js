/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var pos = pos || {};

(function(pos, $) {
	'use strict';

	/**
	 * PageTest component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function PageTest(element, options) {
		this.$el  = $(element);
		this.el = this.$el[0];
		// store this instance to data object so that I can retrieve it later
		this.$el.data('page_test', this);
		//
		this.options   = $.extend({}, PageTest.DEFAULTS, options);

		this.initComponent();
		this.bindEvents();


		this.initStartDefault();
	}

	PageTest.VERSION  = '3.3.1';

	PageTest.DEFAULTS = {
		// no defaults for now
	};


	PageTest.prototype = {
		constructor: PageTest,

		$el: null,
		el: null,

		pageManagement: null,
		$nextButton: null,
		$previousButton: null,

		bindEvents: function() {
			var self = this;
			this.$nextButton.on("click", function() {
				self.nextPageHandler();
			});

			this.$previousButton.on("click", function() {
				self.previousPageHandler();
			});
		},

		initComponent: function() {
			this.$nextButton = this.$el.find(".right-arrow");
			this.$previousButton = this.$el.find(".left-arrow");

			var pageManagementHTML = this.$el.find(".page-management");
			this.pageManagement = new pos.PageManagement(pageManagementHTML, {});
			window.pageManagement = this.pageManagement;
		},

		initStartDefault: function () {
			var nextPageClass = pos.PageA;
			this.pageManagement.nextPage(nextPageClass);
		},

		nextPageHandler: function() {
			console.log("==nextPageHandler current index " + pos.PageA.currentIndex);
			if (!this.pageManagement.isAnimating) {
				pos.PageA.currentIndex ++;
				var nextPageClass = pos.PageA;
				this.pageManagement.nextPage(nextPageClass);
			}
		},

		previousPageHandler: function() {
			console.log("==previousPageHandler current index " + pos.PageA.currentIndex);
			if (this.pageManagement.canBack() && !this.pageManagement.isAnimating) {
				pos.PageA.currentIndex --;
				this.pageManagement.back();
			}

		}


	};

	// exports
	pos.PageTest = PageTest;
}(pos, jQuery));