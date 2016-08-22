/* © 2014 Aleph-labs.com
 * @author Thang Kieu
 */
// namespace
var pos = pos || {};

(function(pos, $) {
	'use strict';

	/**
	 * Radio component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function Radio(element, options) {
		this.$el  = $(element);
		this.el = this.$el[0];
		// store this instance to data object so that I can retrieve it later
		this.$el.data('checkbox', this);
		//
		this.options   = $.extend({}, Radio.DEFAULTS, options);
		this.bindEvents();
	}

	Radio.DEFAULTS = {
		// no defaults for now
	};


	Radio.prototype = {
		constructor: Radio,

		$el: null,
		el: null,
		$valueInput: null,

		bindEvents: function() {
			var self = this;
			// make use of the checkbox toggle state
			// only < ie9
			if (this.checkIE8()) {
				this.$el.on('click', 'label', function() {
					var name = $(this).closest('div').find('input[type="radio"]').attr('name');
						self.clearChecked(name);
					// if (!self.$el.find('input[type="radio"]').prop('checked')) {
						$(this).addClass('checked');
					// } else {
					// }
				});
			}
		},

		checkIE8: function() {
			return $('html').hasClass('lt-ie9');
		},

		clearChecked: function(name) {
			$('input[name="' + name + '"]').each(function() {
				$(this).closest('div').find('label').removeClass('checked');
			});
		}
	};

	// exports
	pos.Radio = Radio;
}(pos, jQuery));