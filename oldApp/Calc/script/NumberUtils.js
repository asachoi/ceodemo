/* © 2014 Aleph-labs.com
 * @author Ernesto Pile
 */
// namespace
var app = app || {};

(function(app, $) {
    'use strict';

    /**
     * Number Utility Helper
     * @class
     * @param {[type]} options [description]
     */
    function NumberUtils(options) {
        this.options   = $.extend({}, NumberUtils.DEFAULTS, options);
    }

    NumberUtils.VERSION  = '1.0.0';

    NumberUtils.DEFAULTS = {
        // no defaults for now
    };

    NumberUtils.prototype = {
        constructor: NumberUtils
    };


    // exports
    app.NumberUtils = NumberUtils;
}(app, jQuery));