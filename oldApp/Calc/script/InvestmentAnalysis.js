/* © 2014 Aleph-labs.com
 * @author Thanh Tran
 */
/* global pos*/
// namespace
var page = page || {};

(function(page, $) {
    'use strict';

    /**
     * InvestmentAnalysis component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function InvestmentAnalysis(element, options) {
        this.$el = $(element);
        this.el = this.$el[0];
        // store this instance to data object so that I can retrieve it later
        this.$el.data('investmentanalysis', this);
        //
        this.options = $.extend({}, InvestmentAnalysis.DEFAULTS, options);
        this.initComponent();
        this.bindEvents();

        this.showDefaultValue();
    }

    InvestmentAnalysis.VERSION = '3.3.1';

    InvestmentAnalysis.DEFAULTS = {
        // no defaults for now
    };


    InvestmentAnalysis.prototype = {
        constructor: InvestmentAnalysis,

        $el: null,
        el: null,

        graphControl: null,
        accordianControl: null,

        annualRateControl: null,
        rateInflationControl: null,
        yearsIncrementControl: null,

        slideInControl: null,

        bindEvents: function() {


        },

        initComponent: function() {
            //new pos.SwipePanel($('.swipe-panel-wrapper'));
            var accordian = this.$el.find(".accordians-control");
            this.accordianControl = new pos.Accordians(accordian);

            var slideHtml = $(".slide-in-panel-wrapper");
            this.slideInControl = new pos.SlideInControl(slideHtml, {});


            this.annualRateControl  = new pos.IncrementControl( this.$el.find('.annual-rate .increment-control'), {counterNo: 1});
            this.rateInflationControl = new pos.IncrementControl(this.$el.find(".rate-inflation  .increment-control"), {counterNo: 1});
            this.yearsIncrementControl = new pos.IncrementControl(this.$el.find(".years-block .increment-control"), {counterNo: 1});
            var graphHeight = 380;
            var graphHtml = this.$el.find(".graph-control");
            this.graphControl = new pos.Graph(graphHtml, {
                title: 'At Age 65',
                background: '#eaeaea',
                pushLeft: '60px',
                width: '75px',
                height: graphHeight + 'px',
                shortfall: true,
                currency: 'HK$ ',
                data: {
                    max: 150000,
                    columns: [{
                        color: '#efb112',
                        label: '<p>Total Assets</p><p class="label-bold">HK$ 80,000</p>',
                        value: 80000
                    }, {
                        color: '#1471ad',
                        label: '<p>Target Amount</p><p class="label-bold">HK$ 150,000</p>',
                        value: 150000
                    }]
                }
            });

            // number input
            this.$el.find('input[type="number"]').each(function() {
                if (pos.NumberInput) {
                    new pos.NumberInput(this);
                }
            });
        },

        showDefaultValue: function() {

        },

        showSingleOrVariable: function() {

        }


    };

    // exports
    page.InvestmentAnalysis = InvestmentAnalysis;
}(page, jQuery));
