/* © 2014 Aleph-labs.com
 * @author Thanh Tran
 */
// namespace
var page = page || {};

(function(page, $) {
    'use strict';

    /**
     * ProtectionCoverageReserve component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function ProtectionCoverageReserve(element, options) {
        this.$el  = $(element);
        this.el = this.$el[0];
        // store this instance to data object so that I can retrieve it later
        this.$el.data('protection_coverage_reserve', this);
        //
        this.options   = $.extend({}, ProtectionCoverageReserve.DEFAULTS, options);
        this.initComponent();
        this.bindEvents();
    }

    ProtectionCoverageReserve.VERSION  = '3.3.1';

    ProtectionCoverageReserve.DEFAULTS = {
        // no defaults for now
    };

    ProtectionCoverageReserve.prototype = {
        constructor: ProtectionCoverageReserve,

        $el: null,
        el: null,

        savingInvestSlider:null,
        targetAmountSlider:null,

        graphControl: null,

        bindEvents: function() {
            var self = this;

        },

        initComponent: function() {
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

            var graphHeight=380;
            var graphHtml = this.$el.find(".graph-control");
            var valueForGraph = 40 * 1000;
            this.graphControl = new pos.Graph(graphHtml, {
                title: 'Your Current Protection',
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
                            color: '#efb112',
                            label: '<p class="label-bold">HK$ 60,000</p>',
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
        }
    };

    // exports
    page.ProtectionCoverageReserve = ProtectionCoverageReserve;
}(page, jQuery));