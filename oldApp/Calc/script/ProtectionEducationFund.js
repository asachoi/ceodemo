/* © 2014 Aleph-labs.com
 * @author Thanh Tran
 */
/*global pos*/
// namespace
var page = page || {};

(function(page, $) {
	'use strict';

	/**
	 * ProtectionEducationFund component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function ProtectionEducationFund(element, options) {
		this.$el  = $(element);
		this.el = this.$el[0];
		// store this instance to data object so that I can retrieve it later
		this.$el.data('protection_education_fund', this);
		//
		this.options   = $.extend({}, ProtectionEducationFund.DEFAULTS, options);
		this.initComponent();
		this.bindEvents();

		this.showDefaultValue();
	}

	ProtectionEducationFund.VERSION  = '3.3.1';

	ProtectionEducationFund.DEFAULTS = {
		// no defaults for now
	};


	ProtectionEducationFund.prototype = {
		constructor: ProtectionEducationFund,

		$el: null,
		el: null,

		childrenNumRadio: null,
		childrenContentTab:null,

		//all the component for child
		$childContainer: null,
		firstChildEducationSlider: null,
		firstChildAgeRangeSlider: null,
		firstChildYearNumIncrement:null,

		secondChildEducationSlider: null,
		secondChildAgeRangeSlider: null,
		secondChildYearNumIncrement:null,

		thirdChildEducationSlider: null,
		thirdChildAgeRangeSlider: null,
		thirdChildYearNumIncrement:null,

		fourChildEducationSlider: null,
		fourChildAgeRangeSlider: null,
		fourChildYearNumIncrement:null,


		graphControl: null,


		bindEvents: function() {
			var self = this;
			this.childrenNumRadio.$el.on(pos.RadioGroup.ON_CHANGE, function() {
				var value = self.childrenNumRadio.getValue();
				self.showChildContent(value);
			});
		},

		initComponent: function() {
			var childrenHTML = this.$el.find(".life-style-container .radio-group")[0];
			this.childrenNumRadio  = new pos.RadioGroup(childrenHTML, {

			});

			this.childrenContentTab = new pos.TabControl(".children-container .tab-component", {
			});

			this.$childContainer = this.$el.find(".children-container");

			//for item in first tab
			this.initFirstTab();
			this.initSecondTab();
			this.initThirdTab();
			this.initFourTab();

			var graphHeight=380;
			var graphHtml = this.$el.find(".graph-control");
			this.graphControl = new pos.Graph(graphHtml, {
				title: 'Your Total Education Fund',
				background: '#eaeaea',
				pushLeft:'119px;',
				width: '75px',
				height: graphHeight + 'px',
				shortfall: false,
				currency: 'HK$ ',
				data: {
					max: 1089000,
					columns: [
						{
							color: '#ae89d3',
							label: '<p class="label-bold">HK$ 1,089,000</p>',
							value: 800000
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

			// init tooltip
			this.initTooltip();
		},

		initFirstTab: function() {
			var $firstChild = this.$el.find(".children-container .tab-component .tabs #tabs-1");
			var firstChildEducationHTML = $firstChild.find(".education-expense")[0];
			this.firstChildEducationSlider = new pos.NewSlider(firstChildEducationHTML, {
			});

			var firstChildAgeHTML = $firstChild.find(".age-info")[0];
			this.firstChildAgeRangeSlider = new pos.NewRangeSlider(firstChildAgeHTML, {
			});

			this.firstChildYearNumIncrement = new pos.IncrementControl( $firstChild.find(".year-support .increment-control")[0], {counterNo: 1});
		},

		initSecondTab: function() {
			var $secondChild = this.$el.find(".children-container .tab-component .tabs #tabs-2");
			var secondChildEducationHTML = $secondChild.find(".education-expense")[0];
			this.secondChildEducationSlider = new pos.NewSlider(secondChildEducationHTML, {
			});

			var secondChildAgeHTML = $secondChild.find(".age-info")[0];
			this.secondChildAgeRangeSlider = new pos.NewRangeSlider(secondChildAgeHTML, {
			});

			this.secondChildYearNumIncrement = new pos.IncrementControl( $secondChild.find(".year-support .increment-control")[0], {counterNo: 1});
		},

		initThirdTab: function() {
			var $thirdChild = this.$el.find(".children-container .tab-component .tabs #tabs-3");
			var thirdChildEducationHTML = $thirdChild.find(".education-expense")[0];
			this.thirdChildEducationSlider = new pos.NewSlider(thirdChildEducationHTML, {
			});

			var thirdChildAgeHTML = $thirdChild.find(".age-info")[0];
			this.thirdChildAgeRangeSlider = new pos.NewRangeSlider(thirdChildAgeHTML, {
			});

			this.thirdChildYearNumIncrement = new pos.IncrementControl( $thirdChild.find(".year-support .increment-control")[0], {counterNo: 1});
		},

		initFourTab: function() {
			var $fourChild = this.$el.find(".children-container .tab-component .tabs #tabs-4");
			var fourChildEducationHTML = $fourChild.find(".education-expense")[0];
			this.fourChildEducationSlider = new pos.NewSlider(fourChildEducationHTML, {
			});

			var fourChildAgeHTML = $fourChild.find(".age-info")[0];
			this.fourChildAgeRangeSlider = new pos.NewRangeSlider(fourChildAgeHTML, {
			});

			this.fourChildYearNumIncrement = new pos.IncrementControl( $fourChild.find(".year-support .increment-control")[0], {counterNo: 1});
		},

		showDefaultValue: function() {
			this.showChildContent(0);
			this.childrenContentTab.disabledAll();
		},

		showChildContent: function(childNum) {
			if (childNum === 0 || childNum === "0") {
				this.$childContainer.hide();
			} else {
				this.$childContainer.show();
				//this.childrenContentTab.changeTab(childNum - 1);
				this.childrenContentTab.setNumTab(childNum);
				this.childrenContentTab.changeTab(0);
			}
		},

        initTooltip: function() {
            // init tooltip
            if (pos.Tooltip !== undefined) {
                new pos.Tooltip(this.$el);
            }
        }

	};

	// exports
	page.ProtectionEducationFund = ProtectionEducationFund;
}(page, jQuery));