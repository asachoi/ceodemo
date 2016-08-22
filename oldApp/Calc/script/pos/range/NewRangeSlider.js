/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var pos = pos || {};

(function(pos, $) {
    'use strict';

    /**
     * NewRangeSlider component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    var eventForRange = function() {

    }

    function NewRangeSlider(element, options) {
        this.$el  = $(element);
        this.el = this.$el[0];
        // store this instance to data object so that I can retrieve it later
        this.$el.data('newrangeslider', this);
        //
        this.options   = $.extend({}, NewRangeSlider.DEFAULTS, options);
        this.initComponent();
        this.bindEvents();
    }

    NewRangeSlider.VERSION  = '3.3.1';

    NewRangeSlider.DEFAULTS = {
        lowValue:10,
        highValue:20,
        minValue: 0,
        maxValue: 30,
        step:1
    };

    NewRangeSlider.ON_CHANGE = "change";

    NewRangeSlider.prototype = {
        constructor: NewRangeSlider,

        $el: null,
        el: null,

        $lowTextField: null,
        $highTextField: null,
        slider: null,

        bindEvents: function() {
            var self = this;
            var changeTextHandler = $.proxy(this.onTextHandler, this)
            this.$lowTextField.change(changeTextHandler);
            this.$highTextField.change(changeTextHandler);

            this.slider.on("change", function() {
                self.onRangeHandler(self.slider.val());
            })

            this.slider.on("slide", function() {
                //self.onRangeHandler(self.slider.val());
            })
        },

        initComponent : function() {
            this.slider = this.$el.find('.slider-container');
            this.slider.noUiSlider({
                start: [ this.options.lowValue, this.options.highValue ],
                step: this.options.step,
                range: {
                    'min': this.options.minValue,
                    'max': this.options.maxValue
                }
            });

            this.$lowTextField = this.$el.find(".left .textinput");
            this.$highTextField = this.$el.find(".right .textinput");

            //set init value
            this.onRangeHandler(this.slider.val());
        },

        onRangeHandler: function(values) {
            var lowValue = values[0];
            var highValue = values[1];
            this.$lowTextField.val(Math.round(lowValue));
            this.$highTextField.val(Math.round(highValue));

            this.$el.trigger(NewRangeSlider.ON_CHANGE);
        },

        onTextHandler: function() {
            var lowValue = this.$lowTextField.val();
            var highValue = this.$highTextField.val();
            this.slider.val([lowValue, highValue]);
        },

        getValue: function() {
            return this.slider.val();
        }

    };

    // exports
    pos.NewRangeSlider = NewRangeSlider;
}(pos, jQuery));