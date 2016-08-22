/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var pos = pos || {};

(function(pos, $) {
    'use strict';

    /**
     * RangeSlider component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    var eventForRange = function() {

    }

    function RangeSlider(element, options) {
        this.$el  = $(element);
        this.el = this.$el[0];
        // store this instance to data object so that I can retrieve it later
        this.$el.data('range_slider', this);
        //
        this.options   = $.extend({}, RangeSlider.DEFAULTS, options);
        this.initComponent();
        this.bindEvents();
    }

    RangeSlider.VERSION  = '3.3.1';

    RangeSlider.DEFAULTS = {
        // no defaults for now
    };

    RangeSlider.PLUGIN_NAME = "plugin_jRange";


    RangeSlider.prototype = {
        constructor: RangeSlider,

        $el: null,
        el: null,

        $lowTextField: null,
        $highTextField:null,

        $rangeObj: null,
        rangeObj: null,

        bindEvents: function() {
            var self = this;
            var changeTextHandler = $.proxy(this.onTextHandler, this)
            this.$lowTextField.change(changeTextHandler);
            this.$highTextField.change(changeTextHandler);
        },

        initComponent : function() {
            this.$rangeObj = this.$el.find(".range-slider");
            this.$rangeObj.jRange({
                from: 0,
                to: 100,
                step: 1,
                scale: [0,25,50,75,100],
                format: '%s',
                width: '100%',
                showLabels: false,
                isRange : true,
                onstatechange: $.proxy(this.onRangeHandler, this)
            });
            this.rangeObj = this.$rangeObj.data(RangeSlider.PLUGIN_NAME);

            this.$lowTextField = this.$el.find(".left .textinput");
            this.$highTextField = this.$el.find(".right .textinput");
            // console.log("low " + this.$lowTextField + " / " + this.$highTextField);

            //set default
            this.onRangeHandler(this.rangeObj.getValue());
        },

        onRangeHandler: function(value) {
            var values = value.toString().split(',');
            var lowValue = values[0];
            var highValue = values[1];
            this.$lowTextField.val(lowValue);
            this.$highTextField.val(highValue);
        },

        onTextHandler: function() {
            // console.log("=onTextHandler=");
            var lowValue = this.$lowTextField.val();
            var highValue = this.$highTextField.val();
            this.rangeObj.setValue(lowValue.toString() +"," + highValue.toString());
        }

    };

    // exports
    pos.RangeSlider = RangeSlider;
}(pos, jQuery));