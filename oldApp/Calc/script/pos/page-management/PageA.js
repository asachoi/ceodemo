/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var pos = pos || {};

(function(pos, $) {
	'use strict';

	/**
	 * PageA component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function PageA(options) {
		pos.PageElement.call(this, options);
	}

	PageA.VERSION  = '3.3.1';

	PageA.DEFAULTS = {
	};

	PageA.currentIndex = 0;


	PageA.prototype = {
		constructor: PageA,
		index: -1,

		initialize: function(options) {
			pos.PageElement.prototype.initialize.call(this);
			this.index = PageA.currentIndex;
		},

		getDocumentHTML : function() {
			return "<div class='page-element'>" +
						"Page Test " + PageA.currentIndex +
					"</div>";
		},

		//super class
		getSuperClass: function() {
			return pos.PageElement.prototype;
		},

		//>>>>>>event handler >>>>>>>>>
		onRender: function() {
			if (this.checkMethodInSuperClass("onRender")) {
				pos.PageElement.prototype.onRender.call(this);
			}

			this.$el.addClass("background" + this.index);
		},

		onSavingState: function() {
			return {
				"index" : this.index
			};
		},

		onRestoreState: function(state) {
			if(this.$el.hasClass("background" + this.index)) {
				this.$el.removeClass("background" + this.index);
			}

			this.index = state.index;

			this.$el.html("Page Test " + this.index);
			this.$el.addClass("background" + this.index);
			console.log("==PageA onRestoreState " + this.index);
		}
	};

	//extend the page element class
	var temporaryObj = PageA.prototype;
	PageA.prototype = Object.create(pos.PageElement.prototype);
	$.extend(PageA.prototype, temporaryObj);

	// exports
	pos.PageA = PageA;
}(pos, jQuery));