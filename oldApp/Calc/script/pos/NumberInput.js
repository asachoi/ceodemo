/* © 2014 Aleph-labs.com
 * @author Thang Kieu
 */
// namespace
var pos = pos || {};

(function(pos, $) {
    'use strict';

    /**
     * NumberInput component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function NumberInput(element, options) {
        this.$el = $(element);
        this.el = this.$el[0];
        // store this instance to data object so that I can retrieve it later
        this.$el.data('numberinput', this);
        //
        this.options = $.extend({}, NumberInput.DEFAULTS, options);
        this.bindEvents();
    }

    NumberInput.DEFAULTS = {
        // no defaults for now
    };


    NumberInput.prototype = {
        constructor: NumberInput,

        pattern: /[0-9]/, //accept number only
        $el: null,
        el: null,
        $valueInput: null,

        bindEvents: function() {
            var self = this;
            this.$el.on('keydown', function(event) {
                var charKey = event.keyCode;

                if (!self.validateInput(charKey)) {
                    return false;
                }
            });
        },

        validateInput: function(charKey) {
            var charCode = String.fromCharCode(charKey);
            var result = false;

            if (charKey === 46 || charKey === 8) {
                //delete key is pressed
                result = true;
            } else {
                //backspace key is pressed
            	result = this.pattern.test(charCode);
            }
            return result;
        }
    };

    // exports
    pos.NumberInput = NumberInput;
}(pos, jQuery));
