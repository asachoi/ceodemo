/* © 2014 Aleph-labs.com
 * @author Thang Kieu
 */
// namespace
var pos = pos || {};

(function(pos, $) {
    'use strict';

    /**
     * Select component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function Select(element, options) {
        this.$el = $(element);
        // store this instance to data object so that I can retrieve it later
        this.$el.data('Select', this);
        this.options = $.extend({}, Select.DEFAULT, options);

        this.init();
    }


    Select.DEFAULTS = {
        // no defaults for now
    };

    Select.prototype = {
        constructor: Select,

        init: function() {
            // wrap select
            var $wrapper = $('<div/>');
            var $value = $('<span/>');
            $wrapper.addClass('select');

            this.$el.wrap($wrapper);

            this.$el.closest('.select').prepend($value);

            this.setValue();
            this.bindEvent();
        },

        bindEvent: function() {
            this.change();
        },

        change: function() {
            var self = this;
            this.$el.on('change', function() {
                self.setValue();
            });
        },

        setValue: function() {
            var text = this.$el.find('option:selected').text();
            this.$el.closest('.select').find('span').text(text);
        }
    };

    // exports
    pos.Select = Select;
}(pos, jQuery));
