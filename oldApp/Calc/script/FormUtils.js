/* © 2014 Aleph-labs.com
 * @author Ernesto Pile
 */
// namespace
var app = app || {};

(function(app, $, Templates, I18nHelper, CssCheckBox) {
    'use strict';

    /**
     * Number Utility Helper
     * @class
     * @param {[type]} options [description]
     */
    function FormUtils(options) {
        this.options   = $.extend({}, FormUtils.DEFAULTS, options);
    }

    FormUtils.VERSION  = '1.0.0';

    FormUtils.DEFAULTS = {
        // no defaults for now
    };

    FormUtils.prototype = {
        constructor: FormUtils
    };

    /**
     * create parse DOM and create common inout components from it
     * @param $parent
     * @param arr
     * @returns {*|{}}
     */
    FormUtils.createInputWrappers =  function($parent, arr) {
        arr = arr || {};
        if ( !($parent instanceof $) ) {
            $parent = $($parent);
        }

        //create wrapper for checkbox buttons
        $parent.find('.css-checkbox').each(function () {
            var id = $(this).find('input').attr('id');
            arr[id] = new CssCheckBox(this);
        });

        return arr;
    };

    // exports
    app.FormUtils = FormUtils;
}(app, jQuery, app.Templates, app.I18nHelper, pos.CssCheckBox));