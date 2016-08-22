/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var pos = pos || {};

(function(pos, $) {
    'use strict';

    /**
     * NewSlider component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function NewSlider(element, options) {
        this.$el  = $(element);
        this.el = this.$el[0];
        // store this instance to data object so that I can retrieve it later
        this.$el.data('newslider', this);
        //
        this.options   = $.extend({}, NewSlider.DEFAULTS, options);
        this.initComponent();
        this.bindEvents();
    }

    NewSlider.VERSION  = '3.3.1';

    NewSlider.DEFAULTS = {
        // no defaults for now
        value: 10,
        minValue: 0,
        maxValue: 30,
        step:1
    };

    NewSlider.ON_CHANGE = "change";

    NewSlider.prototype = {
        constructor: NewSlider,

        $el: null,
        el: null,

        $textField: null,
        slider: null,

        bindEvents: function() {
            var self = this;
            var changeTextHandler = $.proxy(this.onTextHandler, this)
            this.$textField.change(changeTextHandler);

            this.slider.on("change", function() {
                self.onRangeHandler(self.slider.val());
            })

            this.slider.on("slide", function() {
                self.onRangeHandler(self.slider.val());
            })
        },

        initComponent : function() {
            this.slider = this.$el.find('.slider-container');
            this.slider.noUiSlider({
                start: this.options.value,
                step:this.options.step,
                connect:"lower",
                range: {
                    'min': this.options.minValue,
                    'max': this.options.maxValue
                }
            });

            this.$textField = this.$el.find(".textinput");

            //set default
            this.onRangeHandler(this.slider.val());
        },

        onRangeHandler: function(values) {
            var value = values;
            this.$textField.val(Math.round(value));

            this.$el.trigger(NewSlider.ON_CHANGE);
        },

        onTextHandler: function() {
            var value = this.$textField.val();
            this.slider.val([value]);
        }

    };

    // exports
    pos.NewSlider = NewSlider;
}(pos, jQuery));