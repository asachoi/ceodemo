/* © 2014 Aleph-labs.com
 * @author Phuong Vo
 */
// namespace
var page = page || {};

(function (page, $) {
    'use strict';

    /**
     * UserLandingScreen component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function UserLandingScreen(element, options) {
        if (element) {
            this.$el = $(element);
        } else {
            this.$el = $(this.getDocumentHTML());
        }

        this.el = this.$el[0];
        // store this instance to data object so that I can retrieve it later
        this.$el.data('user_landing_screen', this);
        //
        this.options = $.extend({}, UserLandingScreen.DEFAULTS, options);

        if (this.options.isStandalone) {
            this.initComponent();
            this.bindEvents();
            //this.initFirstState();
        }

    }

    UserLandingScreen.VERSION = '3.3.1';

    UserLandingScreen.DEFAULTS = {
        isDebug: true,
        isStandalone: false
            // no defaults for now
    };

    UserLandingScreen.TIME_DISTANCE = 1000;
    UserLandingScreen.EVENT_CHOOSE_ITEM = "choose_item";


    UserLandingScreen.prototype = {
        constructor: UserLandingScreen,

        $el: null,
        el: null,

        $contentContainer: null,
        $headerContainer: null,

        optionList: null,

        indexAnimation: null,


        bindEvents: function () {
            var self = this;

            for (var i = 0; i < this.optionList.length; i++) {
                var $objItem = this.optionList[i].item;
                $objItem.on("click", function (events) {
                    self.clickItemHandler(events);
                });
            }


            //update the layout of the container when window resizes
            $(window).resize(function(){
                self.updateLayout();
             });
        },

        initComponent: function () {
            this.$contentContainer = this.$el.find(".content-container");
            this.$headerContainer = this.$el.find(".header-container");

            var knowyou = this.$el.find(".know-you");
            var likeToRetirement = this.$el.find(".like-to-retire");
            var lifeInsurance = this.$el.find(".life-insurance");
            var investmentGoal = this.$el.find(".investment-goal");

            //init the list to animation
            this.optionList = [{
                "item": knowyou,
                "initPos": -1
            }, 
            {
                "item": likeToRetirement,
                "initPos": -1
            }, 
            {
                "item": lifeInsurance,
                "initPos": -1
            }, 
            {
                "item": investmentGoal,
                "initPos": -1
            }];


            //init
            this._doUpdateLayout();

            this.initFirstState();
        },

        /*
        initOptionList: function () {
            var containerWidth = this.$el.find(".option-container").width();

            var initYPos = 30;
            var distance = 30;

            for (var i = 0; i < this.optionList.length; i++) {
                var $objItem = this.optionList[i].item;
                $objItem.css({
                    "left": xPos + "px",
                    "top": initYPos + "px"
                });
                $objItem.data("index", i);

                //update init position
                this.optionList[i].initPos = initYPos;

                //update y pos
                if (i % 2 !== 0) {
                    initYPos += $objItem.height() + distance;
                    $objItem.css({
                        "left": xPos + xPos - 100 + "px",
                        "top": initYPos - initYPos + "px"
                    });
                    $objItem.data("index", i);
                }
            }
        },
        */


        initFirstState: function () {
          
            //console.log("==distanceFromFirstItem " + distanceFromFirstItem);
            for (var i = 0; i < this.optionList.length; i++) {
                var $objItem = this.optionList[i].item;
                var targetPos = this.optionList[i].initY + 360;
                $objItem.css({
                    "top": targetPos + "px",
                    "opacity": "0"
                });
            }
        },



        startAnimationAtIndex: function (index) {
            //we dont do anything if index is out if the optionList
            if (index > this.optionList.length - 1) {
                return;
            }

            var self = this;
            var $obj = this.optionList[index].item;
            var targetPosY = this.optionList[index].initY;

            //start time out to force next item to animate
            setTimeout(function () {
                self.completeItemAnimation();
            }, 100);

            //start animation for current item
            $obj.animate({
                "top": targetPosY + "px",
                "opacity": 1
            }, {
                duration: UserLandingScreen.TIME_DISTANCE,
                specialEasing: {
                    top: "easeOutQuint",
                    opacity: "linear"
                },
                complete: function () {
                    //$( this ).after( "<div>Animation complete.</div>" );
                }
            });
        },


        startFadInAnimation: function () {
            var self = this;

            this.initFirstState();

            this.indexAnimation = 0;
            setTimeout(function(){
                self.startAnimationAtIndex(self.indexAnimation);
            },1000);

        },

        completeItemAnimation: function () {
            //console.log("==complete item " + this.indexAnimation);
            this.indexAnimation++;
            this.startAnimationAtIndex(this.indexAnimation);
        },


        completeFadInAnimation: function () {
            //console.log("=completeFadInAnimation");
        },

        clickItemHandler: function (events) {
            var self = this;


            var currentObj = events.currentTarget;
            var index = $(currentObj).data("index");
            var $targetObj = null;
            //find the item that is clicked
            for (var i = 0; i < this.optionList.length; i++) {
                var $objItem = this.optionList[i].item;
                if ($objItem[0] === currentObj) {
                    $targetObj = $objItem;
                    break;
                }
            }

            //make animation clicked item
            if ($targetObj) {

                /*
                
                //animation bigger
                $targetObj.find(".title").css({
                    "opacity": 0
                });

                var $icon = $targetObj.find(".icon");
                var initWidth = $icon.width();
                var initHeight = $icon.height();

                var targetWidth = initWidth * 2;
                var targetHeight = initHeight * 2;

                $icon.animate({
                    "width": targetWidth + "px",
                    "height": targetHeight + "px",
                    "opacity": 0
                }, {
                    duration: 500,
                    specialEasing: {
                        "width": "easeOutExpo",
                        "height": "easeOutExpo",
                        "opacity": "easeOutExpo"
                    },
                    complete: function () {
                        console.log("complete >>>> ");
                        //reset selected item
                        $targetObj.find(".title").css({
                            "opacity": 1
                        });
                        $targetObj.find(".icon").css({
                            "width": initWidth + "px",
                            "height": initHeight + "px",
                            "opacity": 1
                        });
                        //move the whole page down
                        //self.moveWholePageDown(index);
                        //self.$el.trigger(UserLandingScreen.EVENT_CHOOSE_ITEM, [index]);
                    }
                });
                */

                setTimeout(function () {
                    self.$el.trigger(UserLandingScreen.EVENT_CHOOSE_ITEM, [index]);
                }, 200);
            }
        },

        returnNormalStatus: function () {

        },

        /*
        moveWholePageDown: function (index) {
            var self = this;
            var targetYPos = this.$el.height() + 100;
            this.$el.animate({
                "top": targetYPos + "px",
            }, {
                duration: 500,
                specialEasing: {
                    "top": "easeOutQuint",
                },
                complete: function () {
                    console.log("complete");
                    //move the whole page down
                    self.$el.trigger(UserLandingScreen.EVENT_CHOOSE_ITEM, [index]);
                }
            });
        },
        */

        //>>>>>>>>>>>>>>for pageElement event >>>>>>>>>>>>
        getDocumentHTML: function () {
            var template = Templates.getTemplate('user-landing-page');
            return  template();
        },

        onRender: function () {
            this.log("==UserLandingScreen onRender ");
            this.initComponent();
            this.bindEvents();
            //this.initFirstState();
        },

        onDestroy: function () {
            this.log("==UserLandingScreen onDestroy ");
        },

        onStart: function () {
            this.log("==UserLandingScreen onStart ");
            this.startFadInAnimation();
        },

        onSavingState: function () {
            return {

            };
        },

        onRestoreState: function (state) {
            this.log("==UserLandingScreen onStart ");
        },

        log: function (msg) {
            if (this.options.isDebug) {
                console.log(msg);
            }
        },

        updateLayout:function(){self
            var self = this;
            setTimeout(function(){
                self._doUpdateLayout();             
            },500);
        },

        _doUpdateLayout:function(){
             //init the init state for list
            var containerHeight= this.$el.find(".option-container").height();
            var containerWidth = this.$el.find(".option-container").width();

            var itemHeight = 100;
            var itemWidth = 180;
            var distanceX = 160;
            var distanceY = 50;

            var centerY = containerHeight / 2;
            var centerX = containerWidth / 2;
            var initY = containerHeight / 2 - distanceY/2 - itemHeight;
            var initX = containerWidth / 2 - distanceX/2 - itemWidth;

            var iX = initX;
            var iY = initY;
            for (var i = 0; i < this.optionList.length; i++) {
                var $objItem = this.optionList[i].item;
                $objItem.data("index", i);
                
                this.optionList[i].initX = iX;
                this.optionList[i].initY = iY;
                
                $objItem.css({
                    "left": iX + "px",
                    "top": iY + "px"
                });

                iX = iX + itemWidth + distanceX;
                if(i%2 == 1){
                    iY = iY + itemHeight + distanceY;
                    iX = initX;                
                }
 
            }
        }


    };

    // exports
    page.UserLandingScreen = UserLandingScreen;
}(page, jQuery));