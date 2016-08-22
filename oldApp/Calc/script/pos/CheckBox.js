/* © 2014 Aleph-labs.com
 * @author Thang Kieu
 */
// namespace
var pos = pos || {};

(function(pos, $) {
	'use strict';

	/**
	 * CheckBox component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function CheckBox(element, options) {
		this.$el  = $(element);
		this.el = this.$el[0];
		// store this instance to data object so that I can retrieve it later
		this.$el.data('checkbox', this);
		//
		this.options   = $.extend({}, CheckBox.DEFAULTS, options);
		this.bindEvents();
	}

	CheckBox.DEFAULTS = {
		// no defaults for now
	};


	CheckBox.prototype = {
		constructor: CheckBox,

		$el: null,
		el: null,
		$valueInput: null,

		bindEvents: function() {
			// make use of the checkbox toggle state
			// only < ie9
			if (this.checkIE8()) {
				this.$el.on('click', 'label', function() {
					$(this).toggleClass('checked');
				});
			}
		},

		checkIE8: function() {
			return $('html').hasClass('lt-ie9');
		}
	};

	// exports
	pos.CheckBox = CheckBox;
}(pos, jQuery));