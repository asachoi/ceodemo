/* © 2014 Aleph-labs.com
 * @author Thanh Tran
 */
/*global pos*/
// namespace
var page = page || {};

(function(page, $) {
    'use strict';

    /**
     * InvestmentUserInfo component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function InvestmentUserInfo(element, options) {
        this.$el  = $(element);
        this.el = this.$el[0];
        // store this instance to data object so that I can retrieve it later
        this.$el.data('investmentuserinfo', this);
        //
        this.options   = $.extend({}, InvestmentUserInfo.DEFAULTS, options);
        this.initComponent();
        this.bindEvents();

        this.showDefaultValue();
    }

    InvestmentUserInfo.VERSION  = '3.3.1';

    InvestmentUserInfo.DEFAULTS = {
        // no defaults for now
    };


    InvestmentUserInfo.prototype = {
        constructor: InvestmentUserInfo,

        $el: null,
        el: null,

        ageRangeSlider: null,
        savingInvestSlider:null,
        targetAmountSlider:null,

        rateReturnCreament:null,
        rateInflationCreament:null,

        graphControl: null,

        bindEvents: function() {
            var self = this;

            this.ageRangeSlider.$el.on(pos.NewRangeSlider.ON_CHANGE, function() {
                var val = self.ageRangeSlider.getValue();
                var valueForGraph = val[0] * 1000;
                console.log("==val " + valueForGraph);
                self.graphControl.updateValue([{
                        label: 'HK$ 200',
                        value: valueForGraph
                    }
                ]);
            });
        },

        initComponent: function() {
            //age
            var ageRangeHTML = this.$el.find(".age-info .new-slider-component.range")[0];
            this.ageRangeSlider = new pos.NewRangeSlider(ageRangeHTML, {
                lowValue:30,
                highValue:40,
                minValue: 20,
                maxValue: 60,
                step:5
            });

            //saving investment
            var savingInvestHTML = this.$el.find(".saving-investment .new-slider-component.single")[0];
            this.savingInvestSlider = new pos.NewSlider(savingInvestHTML, {
                value:20,
                minValue: 0,
                maxValue: 30
            });

            //target amount
            var targetAmountHTML = this.$el.find(".target-amount .new-slider-component.single")[0];
            this.targetAmountSlider = new pos.NewSlider(targetAmountHTML, {
                value:20,
                minValue: 0,
                maxValue: 30
            });

            //single-variable
            this.rateReturnCreament  = new pos.IncrementControl( this.$el.find(".rate-container .variable .rate-return .increment-control"), {counterNo: 1});
            this.rateInflationCreament  = new pos.IncrementControl( this.$el.find(".rate-container .variable .rate-inflation .increment-control"), {counterNo: 1});

            var graphHeight=380;
            var graphHtml = this.$el.find(".graph-control");
            var valueForGraph = this.ageRangeSlider.getValue()[0] * 1000;
            this.graphControl = new pos.Graph(graphHtml, {
                title: 'Cumulative Total Assets',
                background: '#eaeaea',
                pushLeft:'119px;',
                width: '75px',
                height: graphHeight + 'px',
                shortfall: false,
                currency: 'HK$ ',
                data: {
                    max: 80000,
                    columns: [
                        {
                            color: '#1471ad',
                            label: '<p class="label-bold">HK$ 80,000</p>',
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

        showDefaultValue: function() {

        },

        initTooltip: function() {
            // init tooltip
            if (pos.Tooltip !== undefined) {
                new pos.Tooltip(this.$el);
            }
        }


    };

    // exports
    page.InvestmentUserInfo = InvestmentUserInfo;
}(page, jQuery));