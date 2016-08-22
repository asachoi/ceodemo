/* © 2014 Aleph-labs.com
 * @author Thanh Tran
 */
/*global pos*/
// namespace
var page = page || {};

(function(page, $) {
	'use strict';

	/**
	 * ProtectionAnalysis component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function ProtectionAnalysis(element, options) {
		this.$el  = $(element);
		this.el = this.$el[0];
		// store this instance to data object so that I can retrieve it later
		this.$el.data('protection_analysis', this);
		//
		this.options   = $.extend({}, ProtectionAnalysis.DEFAULTS, options);
		this.initComponent();
		this.bindEvents();
	}

	ProtectionAnalysis.VERSION  = '3.3.1';

	ProtectionAnalysis.DEFAULTS = {
		// no defaults for now
	};


	ProtectionAnalysis.prototype = {
		constructor: ProtectionAnalysis,

		$el: null,
		el: null,

		graphControl: null,
		accordianControl: null,

		annualRateControl:null,
		rateInflationControl:null,

		slideInControl: null,

		bindEvents: function() {


		},

		initComponent: function() {

			var accordian = this.$el.find(".accordians-control");
			this.accordianControl = new pos.Accordians(accordian);

			var slideHtml = $(".slide-in-panel-wrapper");
			this.slideInControl = new pos.SlideInControl(slideHtml, {});

			this.annualRateControl  = new pos.IncrementControl( this.$el.find(".rate-return  .increment-control"), {counterNo: 1});
			this.rateInflationControl  = new pos.IncrementControl( this.$el.find(".rate-inflation1  .increment-control"), {counterNo: 1});

			var graphHeight=380;
			var graphHtml = this.$el.find(".graph-control");
			this.graphControl = new pos.Graph(graphHtml, {
				title: 'Your Protection',
				background: '#eaeaea',
				pushLeft:'60px',
				width: '75px',
				height: graphHeight + 'px',
				shortfall: true,
				currency: 'HK$ ',
				data: {
					max: 3998000,
					columns: [
						{
							color: '#efb112',
							label: '<p>Total Assets</p><p class="label-bold">HK$ 600,000</p>',
							value: 1998000
						},
						{
							color: '#1471ad',
							background: '#ae89d3',
							label: '<p>Target Amount</p><p class="label-bold">HK$ 3,998,000</p>',
							value: 1998000
						}
					]
				}
			});

			// number input
			this.$el.find('input[type="number"]').each(function() {
			    if (pos.NumberInput) {
			        new pos.NumberInput(this);
			    }
			});
		}

	};

	// exports
	page.ProtectionAnalysis = ProtectionAnalysis;
}(page, jQuery));