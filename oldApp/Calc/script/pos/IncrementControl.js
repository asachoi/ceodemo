/* © 2014 Aleph-labs.com
 * @author Thang Kieu
 */
// namespace
var pos = pos || {};

(function(pos, $) {
	'use strict';

	/**
	 * IncrementControl component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function IncrementControl(element, options) {
		this.$el  = $(element);
		this.el = this.$el[0];
		this.$valueInput = this.$el.find('input');
		// store this instance to data object so that I can retrieve it later
		this.$el.data('incrementControl', this);
		//
		this.options   = $.extend({}, IncrementControl.DEFAULTS, options);
		this.init();
		this.bindEvents();
	}

	IncrementControl.DEFAULTS = {
		// no defaults for now
		max: 100,	// max
		min: 0,		// min
		counterNo: 1
	};


	IncrementControl.prototype = {
		constructor: IncrementControl,

		$el: null,
		el: null,
		$valueInput: null,

		init: function() {
			// init number input
			if (pos.NumberInput !== undefined) {
				this.$el.find('input[type="number"]').each(function() {
					new pos.NumberInput(this);
				});
			}

			this.$el.find('input').addClass('hidden');
			this.setValueInput(0);
			// this.setEvent();
		},

		bindEvents: function() {
			var self = this;

			// make use of the checkbox toggle state
			this.$el.on('click', '.increment-button', function(event) {
				self.incrementValue(this);
			});

			this.$el.on('click', '.value', function(event) {
				self.showInput(true, this);
			});

			// when user input and enter
			this.$el.on('blur', 'input', function() {
				// get value
				var value = parseInt($(this).val());

				if (value) {
					if (value >= self.options.max) {
						value = self.options.max;
					} else if (value <= self.options.min) {
						value = self.options.min;
					}
				} else {
					value = 0;
				}

				self.setValueInput(value);
				self.showInput(false);

			});
		},

		showInput: function(isShow) {
			var $label = this.$el.find('.value');
			var $input = this.$el.find('input');

			if (isShow) {
				$label.addClass('hidden');
				$input.removeClass('hidden').focus();
			} else {
				$label.removeClass('hidden');
				$input.addClass('hidden');
			}
		},

		incrementValue: function(el) {
			var currValue = this.$el.find('input').val();
			var action = '';

			// check current value
			if (currValue !== '') {
				currValue = parseInt(currValue);
			} else {
				currValue = 0;
			}

			// get action
			if ($(el).closest('li').hasClass('sub')) {
				action = 'sub';
			} else {
				action = 'add';
			}

			switch (action) {
				case 'sub':
					if (currValue > this.options.min) {
						currValue -= this.options.counterNo;
					}
					break;
				case 'add':
					if (currValue < this.options.max) {
						currValue += this.options.counterNo;
					}
					break;
				default:
					currValue = 0;
			}

			// set value
			this.setValueInput(currValue);
		},

		setValueInput: function(value) {
			var $label = this.$el.find('.value');
			var $input = this.$el.find('input');

			// set value for input
			$input.val(value);
			/**
			 * trim function pollyfill
			 */
			if (typeof String.prototype.trim !== 'function') {
			    String.prototype.trim = function() {
			        return this.replace(/^\s+|\s+$/g, '');
			    };
			}

			var suffix = this.$el.attr('data-suffix') || '';
			suffix = suffix.trim();

			if (suffix) {
				value += ' ' + suffix;
			}
			// set value to show
			$label.text(value);
		}
	};

	// exports
	pos.IncrementControl = IncrementControl;
}(pos, jQuery));