/* © 2014 Aleph-labs.com
 * @author Thanh Tran
 */
/*global Modernizr*/
// namespace
var pos = pos || {};

(function(pos, $) {
    'use strict';

    /**
     * SlideInControl component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function SlideInControl(element, options) {
        this.$el  = $(element);
        this.el = this.$el[0];
        // store this instance to data object so that I can retrieve it later
        this.$el.data('slideincontrol', this);
        //
        this.options   = $.extend({}, SlideInControl.DEFAULTS, options);

        this.initComponent();
        this.bindEvents();
    }

    SlideInControl.VERSION  = '3.3.1';

    SlideInControl.DEFAULTS = {
        // no defaults for now
    };


    SlideInControl.prototype = {
        constructor: SlideInControl,

        $el: null,
        el: null,

        toggleBtn: null,
        toggleClass: null,
        preRetirementIncreamentControl: null,
        postRetirementIncreamentControl: null,
        rateInflationIncreamentControl: null,

        bindEvents: function() {
            var self = this;

            self.$el.animate({
                right: - (self.$el.width() - $(this.$el.find('.action')).width())
            }, 300, 'linear', function() {
                self.$el.removeClass(self.toggleClass);
            });

            this.toggleBtn.on('click', function() {
                if (!self.$el.hasClass(self.toggleClass)) {
                    self.$el.animate({
                        right: 0
                    }, 300, 'linear', function() {
                        self.$el.addClass(self.toggleClass);
                    });
                } else {
                    self.$el.animate({
                        right: - (self.$el.width() - $(this).width())
                    }, 300, 'linear', function() {
                        self.$el.removeClass(self.toggleClass);
                    });
                }
                // self.$el.toggleClass(self.toggleClass);
                // event.stopPropagation();
                // event.preventDefault();
            });

            this.windowResize();
        },

        initComponent: function () {
            //this.toggleBtn = this.$el.attr('data-toggle-button');
            this.toggleBtn = this.$el.find('.action');
            this.toggleClass = this.$el.attr('data-toggle-class');

            var preRetireHtml = this.$el.find(".pre-retirement .increment-control");
            this.preRetirementIncreamentControl = new pos.IncrementControl(preRetireHtml, {});

            var postRetireHtml = this.$el.find(".post-retirement .increment-control");
            this.postRetirementIncreamentControl = new pos.IncrementControl(postRetireHtml, {});

            var rateInflationHtml = this.$el.find(".rate-inflation .increment-control");
            this.rateInflationIncreamentControl = new pos.IncrementControl(rateInflationHtml, {});
        },

        windowResize: function() {
            var self = this;
            $(window).resize(function() {
                console.log(self.$el.width() - self.$el.find('.action').width());
                self.$el.css({
                    right: - (self.$el.width() - self.$el.find('.action').width())
                });
            });
        }
    };

    // exports
    pos.SlideInControl = SlideInControl;
}(pos, jQuery));