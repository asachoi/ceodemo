/* © 2014 Aleph-labs.com
 * @author Thanh Tran
 */
// namespace
var pos = pos || {};

(function(pos, $) {
	'use strict';

	/**
	 * TabControl component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function TabControl(element, options) {
		this.$el  = $(element);
		this.el = this.$el[0];
		this.$el.data('tab_control', this);

		this.options   = $.extend({}, TabControl.DEFAULTS, options);

		this.bindEvents();
		this.initComponent();
	}

	TabControl.VERSION  = '3.3.1';

	TabControl.DEFAULTS = {
		// no defaults for now
	};


	TabControl.prototype = {
		constructor: TabControl,

		$el: null,
		el: null,
		$tabControl: null,

		numTab: null,
		maxTab: null,

		bindEvents: function() {

		},

		initComponent: function() {
			this.$tabControl = this.$el.find(".tabs");
			this.$tabControl.tabs();
			// console.log("==tab list " + this.$tabControl.tabs());

			this.maxTab = this.$tabControl.find(".ui-tabs-nav li").length;
			// console.log("==maxTab " + this.maxTab);
		},

		setNumTab: function(numTab) {
			if (numTab > this.maxTab) {
				return;
			}

			var tabList = this.$tabControl.find(".ui-tabs-nav li");
			for (var i = 0; i < tabList.length; i++) {
				var objHtml = tabList[i];
				if (i < numTab) {
					$(objHtml).show();
				} else {
					$(objHtml).hide();
				}
			}

		},

		changeTab: function(index) {
			this.$tabControl.tabs( "option", "active", index);
		},

		disabledAll : function() {
			//this.$el.find(".tabs").tabs( "disable" );
		}



	};

	// exports
	pos.TabControl = TabControl;
}(pos, jQuery));