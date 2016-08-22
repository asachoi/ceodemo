/* © 2014 Aleph-labs.com
 * @author Thanh Tran
 */
// namespace
var pos = pos || {};

(function(pos, $) {
    'use strict';

    /**
     * ToggleButton component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function ToggleButton(element, options) {
        this.$el  = $(element);
        this.el = this.$el[0];
        this.$checkbox = this.$el.children('[type="checkbox"]');
        // store this instance to data object so that I can retrieve it later
        this.$el.data('toggleButton', this);
        //
        this.options   = $.extend({}, ToggleButton.DEFAULTS, options);
        this.bindEvents();
    }

    ToggleButton.VERSION  = '3.3.1';

    ToggleButton.DEFAULTS = {
        // no defaults for now
    };


    ToggleButton.prototype = {
        constructor: ToggleButton,

        $el: null,
        el: null,
        $checkbox: null,

        bindEvents: function() {
            var self = this;

            // make use of the checkbox toggle state
            this.$el.on('change', '[type="checkbox"]', function() {
                var checked = this.checked;

                self._toggleClass(checked);
            });
        },

        toggle: function() {
            this.$checkbox.prop('checked', !this.$checkbox.prop('checked'));
            this._toggleClass();
            return this.isSelected();
        },

        _toggleClass: function(checked) {
            checked = checked || this.isSelected();

            this.$el.toggleClass('selected', checked);
        },

        isSelected: function() {
            return this.$checkbox.prop('checked');
        }
    };

    // exports
    pos.ToggleButton = ToggleButton;
}(pos, jQuery));