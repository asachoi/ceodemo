/* © 2014 Aleph-labs.com
 * @author Thanh Tran
 */
/*global pos*/
// namespace
var page = page || {};

(function(page, $) {
    'use strict';

    /**
     * RetirementLifeStyle component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function RetirementLifeStyle(element, options) {
        this.$el  = $(element);
        this.el = this.$el[0];
        // store this instance to data object so that I can retrieve it later
        this.$el.data('retirementlifestyle', this);
        //
        this.options   = $.extend({}, RetirementLifeStyle.DEFAULTS, options);
        this.initComponent();
        this.bindEvents();

        this.showDefaultValue();
    }

    RetirementLifeStyle.VERSION  = '3.3.1';

    RetirementLifeStyle.DEFAULTS = {
        // no defaults for now
    };


    RetirementLifeStyle.prototype = {
        constructor: RetirementLifeStyle,

        $el: null,
        el: null,

        retirementDurationSlider:null,
        retirementTypeRadio:null,

        $lifeStyleContainer:null,
        $expenseContainer:null,

        annualRateIncrementControl:null,

        levelExpenseRadio:null,
        hkMonthSlider: null,

        graphControl: null,


        bindEvents: function() {
            var self = this;
            this.retirementTypeRadio.$el.on(pos.RadioGroup.ON_CHANGE, function() {
                var value = self.retirementTypeRadio.getValue();
                if (value === 0 || value === "0") {
                    self.showStyleOrExpense(true);
                } else {
                    self.showStyleOrExpense(false);
                }
            });
        },

        initComponent: function() {

            //monthly income
            var durationHTML = this.$el.find(".retirement-duration .new-slider-component.single")[0];
            this.retirementDurationSlider = new pos.NewSlider(durationHTML, {

            });

            //retirement type
            var retirementHTML = this.$el.find(".retirement-type .radio-group")[0];
            this.retirementTypeRadio = new pos.RadioGroup(retirementHTML, {

            });

            var levelHTML = this.$el.find(".life-style-container .radio-group")[0];
            this.levelExpenseRadio  = new pos.RadioGroup(levelHTML, {

            });

            var hkHTML = this.$el.find(".hk-month .new-slider-component.single")[0];
            this.hkMonthSlider = new pos.NewSlider(hkHTML, {
                width: '60%'
            });

            // Thang Kieu
            this.$el.find('.increment-control').each(function() {
                new pos.IncrementControl(this, {counterNo: 1});
            });
            // this.annualRateIncrementControl  = new pos.IncrementControl( this.$el.find(".annual-rate  .increment-control"), {counterNo: 1});

            this.$lifeStyleContainer = this.$el.find(".life-style-container");
            this.$expenseContainer = this.$el.find(".expense-container");

            var graphHeight=380;
            var graphHtml = this.$el.find(".graph-control");
            this.graphControl = new pos.Graph(graphHtml, {
                title: 'At Age 65 you will have',
                background: '#eaeaea',
                pushLeft:'119px;',
                width: '75px',
                height: graphHeight + 'px',
                shortfall: false,
                currency: 'HK$ ',
                data: {
                    max: 50000,
                    columns: [
                        {
                            color: '#efb112',
                            label: '<p class="label-bold">HK$ 100</p>',
                            value: 25000
                        }
                    ]
                }
            });

            this.initTooltip();

            // number input
            this.$el.find('input[type="number"]').each(function() {
                if (pos.NumberInput) {
                    new pos.NumberInput(this);
                }
            });
        },

        showDefaultValue: function() {
            this.showStyleOrExpense(true);
        },

        showStyleOrExpense: function(isStyle) {
            this.$lifeStyleContainer.hide();
            this.$expenseContainer.hide();
            if (isStyle) {
                this.$lifeStyleContainer.show();
            } else {
                this.$expenseContainer.show();
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
    page.RetirementLifeStyle = RetirementLifeStyle;
}(page, jQuery));