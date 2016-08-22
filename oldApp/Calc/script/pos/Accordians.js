/* © 2014 Aleph-labs.com
 * @author Thang Kieu
 */
/*global Modernizr*/
// namespace
var pos = pos || {};

(function(pos, $) {
    'use strict';

    /**
     * Accordians component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function Accordians(element, options) {
        this.$el  = $(element);
        this.el = this.$el[0];
        // store this instance to data object so that I can retrieve it later
        this.$el.data('toggleButton', this);
        //
        this.options   = $.extend({}, Accordians.DEFAULTS, options);
        // this.init();
        this.bindEvents();
    }

    Accordians.DEFAULTS = {
        // no defaults for now
    };

    Accordians.prototype = {
        constructor: Accordians,

        $el: null,
        el: null,
        $checkbox: null,

        bindEvents: function() {
            this.$el.on('click', '.accordians-header', function() {
                var $wrap = $(this).closest('.accordians-control');

                $wrap.toggleClass('expanded');
                if ($wrap.hasClass('expanded')) {
                    $wrap.find('.accordians-content').slideDown(300, 'linear');
                } else {
                    $wrap.find('.accordians-content').slideUp(300, 'linear');
                }
            });
        }
    };

    // exports
    pos.Accordians = Accordians;
}(pos, jQuery));