/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var pos = pos || {};

(function(pos, $) {
    'use strict';

    /**
     * Slider component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    var eventForRange = function() {

    }

    function Slider(element, options) {
        this.$el  = $(element);
        this.el = this.$el[0];
        // store this instance to data object so that I can retrieve it later
        this.$el.data('slider', this);
        //
        this.options   = $.extend({}, Slider.DEFAULTS, options);
        this.initComponent();
        this.bindEvents();
    }

    Slider.VERSION  = '3.3.1';

    Slider.DEFAULTS = {
        // no defaults for now
    };

    Slider.PLUGIN_NAME = "plugin_jRange";


    Slider.prototype = {
        constructor: Slider,

        $el: null,
        el: null,

        $textField: null,

        $rangeObj: null,
        rangeObj: null,

        bindEvents: function() {
            var self = this;
            var changeTextHandler = $.proxy(this.onTextHandler, this)
            this.$textField.change(changeTextHandler);
        },

        initComponent : function() {
            this.$rangeObj = this.$el.find(".single-slider");
            var newObj = $.extend({}, {
                from: 0,
                to: 100,
                step: 1,
                scale: [0,25,50,75,100],
                format: '%s',
                width: '80%',
                showLabels: false,
                isRange : false,
                onstatechange: $.proxy(this.onRangeHandler, this)
            }, this.options);
            this.$rangeObj.jRange(newObj);

            this.rangeObj = this.$rangeObj.data(Slider.PLUGIN_NAME);

            this.$textField = this.$el.find(".textinput");

            //set default
            this.onRangeHandler(this.rangeObj.getValue());
        },

        onRangeHandler: function(value) {
            // console.log("value " + value);
            this.$textField.val(value.toString());
        },

        onTextHandler: function() {
            // console.log("=onTextHandler=");
            var value = this.$textField.val();
            this.rangeObj.setValue(value);
        }

    };

    // exports
    pos.Slider = Slider;
}(pos, jQuery));