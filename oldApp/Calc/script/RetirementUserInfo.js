/* © 2014 Aleph-labs.com
 * @author Thanh Tran
 */
/*global pos*/
// namespace
var page = page || {};

(function(page, $) {
    'use strict';

    /**
     * RetirementUserInfo component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function RetirementUserInfo(element, options) {
        this.$el  = $(element);
        this.el = this.$el[0];
        // store this instance to data object so that I can retrieve it later
        this.$el.data('retirementuserinfo', this);
        //
        this.options   = $.extend({}, RetirementUserInfo.DEFAULTS, options);
        this.initComponent();
        this.bindEvents();

        this.showDefaultValue();
    }

    RetirementUserInfo.VERSION  = '3.3.1';

    RetirementUserInfo.DEFAULTS = {
        // no defaults for now
    };


    RetirementUserInfo.prototype = {
        constructor: RetirementUserInfo,

        $el: null,
        el: null,

        ageRangeSlider: null,
        monthlyIncomeSlider:null,
        existBalanceSlider:null,
        monthlyMPFSlider:null,
        savingInvestSlider:null,
        singleVariableRadio:null,

        $singleContainer:null,
        $variableContainer:null,
        singleControlCreament:null,

        firstVariableControlCreament:null,
        secondVariableControlCreament:null,

        graphControl: null,

        bindEvents: function() {
            var self = this;
            this.singleVariableRadio.$el.find('[type="radio"]').on('click', function() {
                var value = $(this).val();
                if (value === 'single') {
                    self.showSingleOrVariable(true);
                } else if (value === 'variable'){
                    self.showSingleOrVariable(false);
                }
            });

            this.ageRangeSlider.$el.on(pos.NewRangeSlider.ON_CHANGE, function() {
                var val = self.ageRangeSlider.getValue();
                var valueForGraph = val[0] * 1000;
                // console.log("==val " + valueForGraph);
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
                highValue:65,
                minValue: 20,
                maxValue: 65,
                step:5
            });

            //monthly income
            var monthlyIncomeHTML = this.$el.find(".monthly-income .new-slider-component.single")[0];
            this.monthlyIncomeSlider = new pos.NewSlider(monthlyIncomeHTML, {
                value:20,
                minValue: 0,
                maxValue: 30
            });

            //exist balance
            var existBalanceHTML = this.$el.find(".exist-balance .new-slider-component.single")[0];
            this.existBalanceSlider = new pos.NewSlider(existBalanceHTML, {
                value:20,
                minValue: 0,
                maxValue: 30
            });

            //monthly mpf
            var monthlyMPFHTML = this.$el.find(".monthly-mpf .new-slider-component.single")[0];
            this.monthlyMPFSlider = new pos.NewSlider(monthlyMPFHTML, {
                value:20,
                minValue: 0,
                maxValue: 30
            });

            //saving invest
            var savingInvestHTML = this.$el.find(".saving-investment .new-slider-component.single")[0];
            this.savingInvestSlider = new pos.NewSlider(savingInvestHTML, {
                value:20,
                minValue: 0,
                maxValue: 30
            });

            //single-variable
            var singleVariableHTML = this.$el.find(".expect-rate .radio-group")[0];
            this.singleVariableRadio = new pos.RadioGroup(singleVariableHTML, {

            });

            this.$singleContainer = this.$el.find(".rate-container .single");
            this.$variableContainer = this.$el.find(".rate-container .variable");
            // Thang Kieu
            this.$el.find('.increment-control').each(function() {
                new pos.IncrementControl(this, {counterNo: 1});
            });
            // this.singleControlCreament = new pos.IncrementControl( this.$el.find(".rate-container .single .increment-control"), {counterNo: 1});
            // this.firstVariableControlCreament  = new pos.IncrementControl( this.$el.find(".rate-container .variable .pre-retirement .increment-control"), {counterNo: 1});
            // this.secondVariableControlCreament  = new pos.IncrementControl( this.$el.find(".rate-container .variable .post-retirement .increment-control"), {counterNo: 1});

            var graphHeight=380;
            var graphHtml = this.$el.find(".graph-control");
            var valueForGraph = this.ageRangeSlider.getValue()[0] * 1000;
            this.graphControl = new pos.Graph(graphHtml, {
                title: 'At Age 65 you will have',
                background: '#eaeaea',
                pushLeft:'119px;',
                width: '75px',
                height: graphHeight + 'px',
                shortfall: false,
                currency: 'HK$ ',
                data: {
                    max: 60000,
                    columns: [
                        {
                            color: '#1471ad',
                            label: '<p class="label-bold">HK$ 100</p>',
                            value:valueForGraph
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

        showDefaultValue: function() {
            this.showSingleOrVariable(true);
        },

        showSingleOrVariable: function(isSingle) {
            this.$singleContainer.hide();
            this.$variableContainer.hide();
            if (isSingle) {
                this.$singleContainer.show();
            } else {
                this.$variableContainer.show();
            }
        },

        /**
         * initialize tooltip
         * @return {[type]} [description]
         */
        initTooltip: function() {
            if (pos.Tooltip !== undefined) {
                new pos.Tooltip(this.$el);
            }
        }


    };

    // exports
    page.RetirementUserInfo = RetirementUserInfo;
}(page, jQuery));