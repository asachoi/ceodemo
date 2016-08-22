/* © 2014 Aleph-labs.com
 * @author Thanh Tran
 */
/*global pos*/
// namespace
var page = page || {};

(function(page, $) {
    'use strict';

    /**
     * ProtectionLifeCoverage component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function ProtectionLifeCoverage(element, options) {
        this.$el  = $(element);
        this.el = this.$el[0];
        // store this instance to data object so that I can retrieve it later
        this.$el.data('protection_life_coverage', this);
        //
        this.options   = $.extend({}, ProtectionLifeCoverage.DEFAULTS, options);
        this.initComponent();
        this.bindEvents();
    }

    ProtectionLifeCoverage.VERSION  = '3.3.1';

    ProtectionLifeCoverage.DEFAULTS = {
        // no defaults for now
    };

    ProtectionLifeCoverage.prototype = {
        constructor: ProtectionLifeCoverage,

        $el: null,
        el: null,

        mortgageBalanceSlider: null,
        familyExpenseSlider: null,
        assciateExpenseSlider: null,

        yearSupportIncreament: null,
        rateReturnIncreament: null,
        rateInflationIncreament: null,

        graphControl: null,

        bindEvents: function() {
            var self = this;

        },

        initComponent: function() {
            //martgage balance
            var mortgageBalanceHTML = this.$el.find(".saving-investment .new-slider-component.single")[0];
            this.mortgageBalanceSlider = new pos.NewSlider(mortgageBalanceHTML, {
                value:20,
                minValue: 0,
                maxValue: 30
            });

            //family expense
            var familyExpenseHTML = this.$el.find(".target-amount .new-slider-component.single")[0];
            this.familyExpenseSlider = new pos.NewSlider(familyExpenseHTML, {
                value:20,
                minValue: 0,
                maxValue: 30
            });

            //
            var assciateExpenseHTML = this.$el.find(".asscoiate-expense .new-slider-component.single")[0];
            this.assciateExpenseSlider = new pos.NewSlider(assciateExpenseHTML, {
                value:20,
                minValue: 0,
                maxValue: 30
            });

            this.yearSupportIncreament  = new pos.IncrementControl( this.$el.find(".year-support .increment-control"), {counterNo: 1});
            this.rateReturnIncreament  = new pos.IncrementControl( this.$el.find(".rate-return .increment-control"), {counterNo: 1});
            this.rateInflationIncreament  = new pos.IncrementControl( this.$el.find(".rate-inflation .increment-control"), {counterNo: 1});

            var graphHeight=380;
            var graphHtml = this.$el.find(".graph-control");
            var valueForGraph = 820000;
            this.graphControl = new pos.Graph(graphHtml, {
                title: 'Basic Life Coverage Needs',
                background: '#eaeaea',
                pushLeft:'119px;',
                width: '75px',
                height: graphHeight + 'px',
                shortfall: false,
                currency: 'HK$ ',
                data: {
                    max: 1820000,
                    columns: [
                        {
                            color: '#1471ad',
                            label: '<p class="label-bold">HK$ 1,820,000</p>',
                            value:valueForGraph
                        }
                    ]
                }
            });

            // init tooltip
            this.initTooltip();

            // number input
            this.$el.find('input[type="number"]').each(function() {
                if (pos.NumberInput) {
                    new pos.NumberInput(this);
                }
            });
        },

        initTooltip: function() {
            // init tooltip
            if (pos.Tooltip !== undefined) {
                new pos.Tooltip(this.$el);
            }
        }
    };

    // exports
    page.ProtectionLifeCoverage = ProtectionLifeCoverage;
}(page, jQuery));