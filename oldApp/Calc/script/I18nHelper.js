/* © 2014 Aleph-labs.com
 * @author Ernesto Pile
 */
// namespace
var app = app || {};

(function(app, $, i18n) {
    'use strict';

    /**
     * ProtectionAnalysis component
     * @class
     * @param {[type]} options [description]
     */
    function I18nHelper(options) {
        this.options = $.extend({}, I18nHelper.DEFAULTS, options);
    }

    I18nHelper.VERSION = '1.0.0';

    I18nHelper.DEFAULTS = {
        // no defaults for now
    };

    I18nHelper.eventDispatcher = $({});
    I18nHelper.EVENT_INIT = "event_init";
    I18nHelper.EVENT_CHANGE = "event_change_language";

    I18nHelper.selectedLanguageId = "en"; //the id of the selected languageI18nHelper
    I18nHelper.fallbackLanguageId = "en"; //the id of the fallback language

    I18nHelper.init = function () {
        i18n.init({
            lng: I18nHelper.selectedLanguageId,
            fallbackLng: I18nHelper.fallbackLanguageId,
            ns: 'Translations',
            resGetPath: '../data/__ns__-__lng__.json',
            getAsync: false,
            useDataAttrOptions: true
        }, function () {
            /*
             if  (callback) {
             callback();
             }
             */
            $(I18nHelper.eventDispatcher).trigger(I18nHelper.EVENT_INIT);
        });
    },


    /**
     * set the selected language id
     * @param languageId
     * @param callback
     */
      I18nHelper.setLng = function(languageId, callback){
        var that = this;
        that.selectedLanguageId = languageId;
        console.log(console.WARNING, 'I18n::setLng:', that.selectedLanguageId);
        i18n.setLng(languageId.split("-").join(""), function(){

            if(callback){
                callback();
            }

            //trigger a language change event
            //all listeners should re-render
            $(I18nHelper.eventDispatcher).trigger(I18nHelper.EVENT_CHANGE);

        });
    },


    I18nHelper.t = function (key, params) {
        if (i18n.exists(key)) {
            return i18n.t(key, params);
        } else {
            console.log(console.WARNING, 'I18n::t:Translation item', key, 'is undefined');
            return key;
        }
    },


    I18nHelper.prototype = {
        constructor: I18nHelper
    };

    // exports
    app.I18nHelper = I18nHelper;
}(app, jQuery, i18n));