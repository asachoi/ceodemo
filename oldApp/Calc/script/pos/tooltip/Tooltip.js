/* © 2014 Aleph-labs.com
 * @author Thang Kieu
 */
// namespace
var pos = pos || {};

(function(pos, $) {
	'use strict';

	/**
	 * Tooltip component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function Tooltip(element, options) {
		this.$el  = $(element);
		this.el = this.$el[0];
		// store this instance to data object so that I can retrieve it later
		this.$el.data('Tooltip', this);
		//
		this.options   = $.extend({}, Tooltip.DEFAULTS, options);
		this.init();
		this.bindEvents();
	}

	Tooltip.DEFAULTS = {
		// no defaults for now
	};


	Tooltip.prototype = {
		constructor: Tooltip,

		$el: null,
		el: null,
		tooltipIns: null,

		init: function() {
			if ($().tooltip !== undefined) {
				this.tooltipIns = this.$el.find('[title]').tooltip({
					position: {
						my: 'left-20 top+10',
						at: 'left bottom',
						collision: 'flipfit',
						using: function(position, feedback) {
							$(this).css(position);
							$('<div>')
								.addClass('arrow')
								.addClass(feedback.vertical)
								.addClass(feedback.horizontal)
								.appendTo(this);
						}
					},
					tooltipClass: 'pos-ui-tooltip'
				});
			}
		},

		/**
		 * Event on touch device
		 * @return {[type]} [description]
		 */
		bindEvents: function() {
			var self = this;
			/**
			 * Show tooltip
			 * apply for touch device
			 * @return {[type]}   [description]
			 */
			this.$el.on('touchstart', '.icon-info', function() {
				self.tooltipIns.tooltip('close');
				$(this).tooltip('open');
				$(this).off('mouseleave');
			});

			$('body').on('touchstart', function(event) {
				var target = event.target;

				if (!$(target).hasClass('icon-info')) {
					self.tooltipIns.tooltip('close');
				}
			});
		}
	};

	// exports
	pos.Tooltip = Tooltip;
}(pos, jQuery));