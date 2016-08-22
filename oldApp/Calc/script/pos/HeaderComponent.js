/* © 2014 Aleph-labs.com
 * @author Thang Kieu. Revised by Ernesto Pile
 */
// namespace
var pos = pos || {};

(function(pos, $, Templates, I18nHelper) {
    'use strict';

    /**
     * HeaderComponent component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function HeaderComponent(options) {

        this.options   = $.extend({}, HeaderComponent.DEFAULTS, options);

        this.insertToDOM();
        this.initComponent();
        this.bindEvents();

    }


    HeaderComponent.DEFAULTS = {
        // no defaults for now
        showBarInLast: false,
        invisibleArrow: false,
        isSwipe: true
    };


    HeaderComponent.prototype = {
        constructor: HeaderComponent,

        $el: null,
        el: null,
        swipeInstance: null,
        $nextBtn:null,
        $prevBtn:null,
        $prevGrad:null,
        $nextGrad:null,
        $hintArrow:null,


        initComponent: function() {

            var self = this;
            var onlyExternal = (this.options.onlyExternal !== false)?true:false;

            //alert("onlyExternal:"+onlyExternal);
            this.swipeInstance = this.$el.find(".swiper-container").swiper({
                //Your options here:
                slidesPerView: 'auto',
                loop: false,
                onlyExternal: onlyExternal,
                onTouchEnd: function() {
                    self.updateNavigation();
                },
                onSlideChangeEnd: function() {
                    self.updateNavigation();
                },
                afterResizeFix: function(){
                    self.updateNavigation();
                }
            });


            this.$prevBtn = this.$el.find(".icon-arrow-invert-prev");
            this.$nextBtn = this.$el.find(".icon-arrow-invert-next");
            this.$prevGrad = this.$el.find(".grad-prev");
            this.$nextGrad = this.$el.find(".grad-next");
            this.updateNavigation();

            this.$hintArrow =  this.$el.find(".hint-arrow");

            this.updateHintArrowVisibiity();
           
           

        },


        bindEvents: function() {
            var self = this;

            // make use of the checkbox toggle state
            this.$prevBtn.on('click', function() {
                self.swipeInstance.swipePrev();
            });

            this.$nextBtn.on('click', function() {
                self.swipeInstance.swipeNext();
            });

            $(window).resize(function(){
                self.updateLayout();
            });
            this.updateLayout();

        },

        updateNavigation: function() {
            var slideCount  = this.swipeInstance.slides.length;

            var visibleCount =  0;
            if(this.swipeInstance.visibleSlides){
                visibleCount = this.swipeInstance.visibleSlides.length;
            }    

            var firstVisibleIndex = this.swipeInstance.activeIndex;
            var lastVisibleIndex = firstVisibleIndex + visibleCount - 1;
            var isDisabled = this.getIsDisabled();
            // first item

            console.log("slideCount:"+slideCount+",visibleCount:"+visibleCount+",firstVisibleIndex:"+firstVisibleIndex+",lastVisibleIndex:"+lastVisibleIndex);

            if((visibleCount < slideCount) && !isDisabled){
                if (firstVisibleIndex > 0) {
                    this.$prevBtn.removeClass('hidden');
                    this.$prevGrad.removeClass('hidden');
                }
                else{
                    this.$prevBtn.addClass('hidden');
                    this.$prevGrad.addClass('hidden');
                }
                if(lastVisibleIndex < slideCount - 1){
                    this.$nextBtn.removeClass('hidden');
                    this.$nextGrad.removeClass('hidden');
                }
                else{
                    this.$nextBtn.addClass('hidden');
                    this.$nextGrad.addClass('hidden');
                }
            }else{
                this.$prevBtn.addClass('hidden');
                this.$nextBtn.addClass('hidden');
                this.$prevGrad.addClass('hidden');
                this.$nextGrad.addClass('hidden');
            }

        },

        insertToDOM: function(){

            if(this.options.element){
                this.$el = $(this.options.element);
            }
            else{
                this.$el = $(this.getDocumentHTML());
                this.$container  = $(this.options.container);
                if(this.options.container){
                    if(this.options.containerPosition == "prepend"){
                        this.$container.prepend(this.$el);
                    }
                    else{
                        this.$container.append(this.$el);
                    }
                }
            }
            this.el = this.$el[0];
        },



        getDocumentHTML : function() {
            var template = Templates.getTemplate('header-component');
            return 	template(this.options.model);
        },


        /**
        * update hint arrow visibility
        */
        updateHintArrowVisibiity:function(){
            //alert("HeaderComponent::updateHintArrowVisibiity:"+this.options.model.items.length);
            if(this.options.model.items instanceof Array){
                if(this.options.model.items.length == 0){
                    this.hideHintArrow();
                }
            }
            else{
                this.hideHintArrow();
            }
        },


        /**
         * show hint arrow instructing users to drag down characters
         */
        showHintArrow: function(){
            this.$hintArrow.fadeIn();
        },


        /**
         * Hide the hint arrow
         */
        hideHintArrow: function(){
            this.$hintArrow.fadeOut();
        },


        updateLayout:function(){
            var self = this;
            setTimeout(function(){
                //self.swipeInstance.calcVisibleSlides();
                self.updateNavigation();
            }, 1000);
        },

        disableSelection:function(needAnimation){
            needAnimation =  (needAnimation === false)?needAnimation:true;
            
            var self = this;
            var containerIcon = self.$el.find(".container.swiper-wrapper");
            var opacityContainer = containerIcon.css("opacity");
            var time = needAnimation ? 1000 : 0;
            if (opacityContainer === 1 || opacityContainer === "1") {
                containerIcon.animate({
                    "opacity": 0.3
                }, time, "swing", function() {
                    self.updateNavigation();
                });
            }
            this.$el.addClass("disabled");
        },

        enableSelection:function(needAnimation){
            needAnimation =  (needAnimation == false)?needAnimation:true;

            //we also need to set the icon opacity to 1
            var $icons = this.$el.find('.characters-list');
            $icons.css("opacity",1);      

            
            //alert("enableSelection:"+needAnimation);
            var self = this;
            var containerIcon = self.$el.find(".container.swiper-wrapper");
            var opacityContainer = containerIcon.css("opacity");
            var time = needAnimation ? 1000 : 0;
            if (opacityContainer !== 1 && opacityContainer !== "1") {

                containerIcon.animate({
                    "opacity": 1
                }, time, "swing", function() {
                    self.updateNavigation();
                });
            }
            this.$el.removeClass("disabled");
        },

        disableItemAtIndex: function(index, isDisable, needAnimation) {
            if (index < 0 || index > this.swipeInstance.slides.length - 1) {
                return;
            }

            var targetOpacity = isDisable ? 0.1 : 1;
            var slideItem = this.swipeInstance.slides[index];
            var time = needAnimation ? 1000 : 0;
            $(slideItem).animate({
                "opacity": targetOpacity
            }, time, "swing", function() {

            });
        },

        /**
        * getter only. returns true if component is disabled, false otherwise
        */
        getIsDisabled:function(){
            return this.$el.hasClass("disabled");
        },


        /**
        * fadeout the menu items
        * @param callback - the function to call after fading out
        */
        fadeOutMenuItems:function(callback){
            var self = this;
            var index = 0;
            var $icons = this.$el.find('.characters-list');

            var duration = 800;
            var delay = 100;

            self._queue(function(){
                return self.$hintArrow.animate({
                    'opacity': 0
                },
                {
                    duration: duration,
                    specialEasing: {
                        opacity: 'easeOutQuint'
                    }
                });
            });


            self._queue(function(){
                return self.$prevBtn.animate({
                    'opacity': 0
                },
                {
                    duration: duration,
                    specialEasing: {
                        opacity: 'easeOutQuint'
                    }
                });
            });

            $icons.each(function(index){
                var $icon = $(this);
                self._queue(function(){
                    return $icon.stop(true, true).delay(index*delay).animate({
                        'opacity': 0
                    },
                    {
                        duration: duration,
                        specialEasing: {
                            opacity: 'easeOutQuint'
                        }
                    });
                });
            });

           self._queue(function(){
            return self.$nextBtn.animate({
                    'opacity': 0
                },
                {
                    duration: duration,
                    specialEasing: {
                        opacity: 'easeOutQuint'
                    },
                    complete:function(){
                        if(callback){
                            //alert("here");
                            callback();
                        }
                    }
                });
            });


        },


        fadeInMenuItems:function(callback){
            var self = this;
            var index = 0;
            var $icons = this.$el.find('.characters-list');

            var duration = 800;
            var delay = 100;

            self._queue(function(){
                return self.$hintArrow.animate({
                    'opacity': 1
                },
                {
                    duration: duration,
                    specialEasing: {
                        opacity: 'easeOutQuint'
                    }
                });
            });


            self._queue(function(){
                return self.$prevBtn.animate({
                    'opacity': 1
                },
                {
                    duration: duration,
                    specialEasing: {
                        opacity: 'easeOutQuint'
                    }
                });
            });

            $icons.each(function(index){
                var $icon = $(this);
                self._queue(function(){
                    return $icon.stop(true, true).delay(index*delay).animate({
                        'opacity': 1
                    },
                    {
                        duration: duration,
                        specialEasing: {
                            opacity: 'easeOutQuint'
                        }
                    });
                });
            });

           self._queue(function(){
            return self.$nextBtn.animate({
                    'opacity': 1
                },
                {
                    duration: duration,
                    specialEasing: {
                        opacity: 'easeOutQuint'
                    },
                    complete:function(){
                        if(callback){
                            //alert("here");
                            callback();
                        }
                    }
                });
            });
        },


        _queue: function(start) {
            var self = this;
            var rest = [].splice.call(arguments, 1),
                promise = $.Deferred();

            if (start) {
                $.when(start()).then(function () {
                    self._queue.apply(window, rest);
                });
            } else {
                promise.resolve();
            }
            return promise;
        }


    };

    // exports
    pos.HeaderComponent = HeaderComponent;
}(pos, jQuery, app.Templates, app.I18nHelper));