/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var pos = pos || {};

(function(pos, $) {
	'use strict';

	/**
	 * PageElement component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 * Base Page Element class for PageManagement class
	 */
	function PageElement(options) {
		this.initialize();
		this.render();
	}

	PageElement.VERSION  = '3.3.1';

	PageElement.DEFAULTS = {
		// no defaults for now
		isDebug: false
	};

	PageElement.prototype = {
		constructor: PageElement,

		$el: null,
		el: null,

		bindEvents: function() {
			console.log("==pageElement bindEvents");
		},

		initComponent: function() {
			console.log("==pageElement initComponent");
		},

		initialize : function(options) {
			this.options   = $.extend({}, PageElement.DEFAULTS, options);

			//this.$el  = $(element);
			this.$el = $(this.getDocumentHTML());
			this.el = this.$el[0];
		},

		render: function() {
			this.initComponent();
			this.bindEvents();
		},

		log: function(msg) {
			if (this.options.isDebug) {
				console.log(msg);
			}
		},

		getDocumentHTML : function() {
			return "";
		},

		//utilities for parent class
		getSuperClass: function() {
			return Object.prototype;
		},

		checkMethodInSuperClass: function(methodName) {
			var superClass = this.getSuperClass();
			return methodName in superClass;
		},

		//>>>>>>event handler >>>>>>>>>
		onRender: function() {
			console.log("PageElement onRender");
		},

		onDestroy: function() {

		},

		onStart: function() {

		},

		onSavingState: function() {
			return {};
		},

		onRestoreState: function(state) {

		}
	};

	// exports
	pos.PageElement = PageElement;
}(pos, jQuery));