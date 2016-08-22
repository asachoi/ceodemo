/* © 2014 Aleph-labs.com
 * @author Thanh Tran
 */
/*global pos*/
// namespace
var page = page || {};

(function(page, $) {
    'use strict';

    /**
     * RetirementAnalysis component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function RetirementAnalysis(element, options) {
        this.$el  = $(element);
        this.el = this.$el[0];
        // store this instance to data object so that I can retrieve it later
        this.$el.data('retirementanalysis', this);
        //
        this.options   = $.extend({}, RetirementAnalysis.DEFAULTS, options);
        this.initComponent();
        this.bindEvents();

        this.showDefaultValue();
    }

    RetirementAnalysis.VERSION  = '3.3.1';

    RetirementAnalysis.DEFAULTS = {
        // no defaults for now
    };


    RetirementAnalysis.prototype = {
        constructor: RetirementAnalysis,

        $el: null,
        el: null,

        graphControl: null,
        accordianControl: null,

        preRetirementControl:null,
        postRetirementControl: null,
        annualRateControl:null,
        yearsIncrementControl:null,

        slideInControl: null,

        bindEvents: function() {


        },

        initComponent: function() {
           //new pos.SwipePanel($('.swipe-panel-wrapper'));
           var accordian = this.$el.find(".accordians-control");
           this.accordianControl = new pos.Accordians(accordian);

            var slideHtml = $(".slide-in-panel-wrapper");
            this.slideInControl = new pos.SlideInControl(slideHtml, {});

            // Thang Kieu
            this.$el.find('.increment-control').each(function() {
                new pos.IncrementControl(this, {counterNo: 1});
            });
           //  this.preRetirementControl  = new pos.IncrementControl( this.$el.find(".pre-retirement  .increment-control"), {counterNo: 1});
           // this.postRetirementControl  = new pos.IncrementControl( this.$el.find(".post-retirement  .increment-control"), {counterNo: 1});
           //  this.annualRateControl  = new pos.IncrementControl( this.$el.find(".rate-inflation .increment-control"), {counterNo: 1});
           //  this.yearsIncrementControl = new pos.IncrementControl( this.$el.find(".years-block .increment-control"), {counterNo: 1});

            var graphHeight=380;
            var graphHtml = this.$el.find(".graph-control");
            this.graphControl = new pos.Graph(graphHtml, {
                title: 'At Age 65 you will have',
                background: '#eaeaea',
                pushLeft:'60px',
                width: '75px',
                height: graphHeight + 'px',
                shortfall: true,
                currency: 'HK$ ',
                data: {
                    max: 60000,
                    columns: [
                        {
                            color: '#efb112',
                            label: '<p>Have</p><p class="label-bold">HK$ 100</p>',
                            value: 55000
                        },
                        {
                            color: '#1471ad',
                            label: '<p>Need</p><p class="label-bold">HK$ 150</p>',
                            value: 60000
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
        },

        showDefaultValue: function() {

        },

        showSingleOrVariable: function() {

        }


    };

    // exports
    page.RetirementAnalysis = RetirementAnalysis;
}(page, jQuery));