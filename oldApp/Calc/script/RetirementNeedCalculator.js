/* © 2014 Aleph-labs.com
 * @author Thanh Tran
 */
// namespace
var page = page || {};

(function(page, $) {
    'use strict';

    /**
     * RetirementNeedCalculator component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function RetirementNeedCalculator(element, options) {
        this.$el  = $(element);
        this.el = this.$el[0];
        // store this instance to data object so that I can retrieve it later
        this.$el.data('retirementneedcalculator', this);
        //
        this.options   = $.extend({}, RetirementNeedCalculator.DEFAULTS, options);
        this.initComponent();
        this.bindEvents();

        this.showDefaultValue();
    }

    RetirementNeedCalculator.VERSION  = '3.3.1';

    RetirementNeedCalculator.DEFAULTS = {
        // no defaults for now
    };


    RetirementNeedCalculator.prototype = {
        constructor: RetirementNeedCalculator,

        $el: null,
        el: null,

        retirementUserInfo:null,
        retirementLifeStyle:null,


        bindEvents: function() {

        },

        initComponent: function() {

            //monthly income
            var durationHTML = this.$el.find(".retirement-duration .slider-component.single")[0];
            this.retirementDurationSlider = new pos.Slider(durationHTML, {

            });

            //retirement type
            var retirementHTML = this.$el.find(".retirement-type .radio-group")[0];
            this.retirementTypeRadio = new pos.RadioGroup(retirementHTML, {

            });

            var levelHTML = this.$el.find(".life-style-container .radio-group")[0];
            this.levelExpenseRadio  = new pos.RadioGroup(levelHTML, {

            });

            var hkHTML = this.$el.find(".hk-month .slider-component.single")[0];
            this.hkMonthSlider = new pos.Slider(hkHTML, {
                width: '60%',
            });

            this.$lifeStyleContainer = this.$el.find(".life-style-container");
            this.$expenseContainer = this.$el.find(".expense-container");
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
        }


    };

    // exports
    page.RetirementNeedCalculator = RetirementNeedCalculator;
}(page, jQuery));