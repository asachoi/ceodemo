/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var pos = pos || {};
var data = data || {};

(function(pos, $, Templates, SwipeSelect) {
    'use strict';
    /**
     * SwipeSelectImage component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     *  This class controll the changing age of character by using drag, drop
     *  each period age has range, and has an image for range
     */
    function SwipeSelectImage(element, options) {
        this.options   = $.extend({}, SwipeSelectImage.DEFAULTS, options);
        this.options.element = element;

        if (element) {
            this.$el  = $(element);
        } else {
            var template = Templates.getTemplate('swipe-select-image');
            this.$el = $(template(this.options));
        }

        this.el = this.$el[0];
        // store this instance to data object so that I can retrieve it later
        this.$el.data('character_age', this);
    }

    SwipeSelectImage.VERSION  = '3.3.1';

    SwipeSelectImage.STATE_SELECTED_AGE = "ch_selected_age";
    SwipeSelectImage.EVENT_CHANGE = "character_change";

    SwipeSelectImage.EVENT_START_DRAG = "character_age_event_start_drag";
    SwipeSelectImage.EVENT_DRAGING = "character_age_event_dragged";
    SwipeSelectImage.EVENT_END_DRAG = "character_age_event_end_drag";

    SwipeSelectImage.EVENT_SWIPE = "character_age_event_swipe";
    SwipeSelectImage.EVENT_CHANGE_INDEX = "swipe-select-image-change-index";

    //constant for long press detection
    SwipeSelectImage.LONG_PRESS_MAX_TIME = 250;
    SwipeSelectImage.LONG_PRESS_MAX_DISTANCE = 100000;  //mean we dont care about the max distance

    SwipeSelectImage.DEFAULTS = {
        // no defaults for now
        title:"",
        translationPath: "",
        isDebug: true,
        incomeAssetsType: "",
        ageImageList: [],
        selection: [],
        noOfLines: 1,
        valueMin: 5,
        valueMax: 0,
        initValue: 0,
        widthMax: 220,
        heightMax: 75,
        ratio: 40,
        isActiveEvent: false,
        isMobileWebSimulator: false,
        allowedSwipeDirection: ["up","down"],
    };

    SwipeSelectImage.prototype = {
        constructor: SwipeSelectImage,

        $el: null,
        el: null,

        //data config
        ageImageListData : null,
        valueMin: -1,
        valueMax: -1,

        //all component
        $ageImage: null,
        $ageTitleSection: null,
        $ageImageSection: null,

        //temporary storage
        clickPos: null,
        cachedHeight: null,
        cachedOffset: null,
        temporaryValue: -1,
        selectedValue: -1,

        ageImgInstanceList: null,
        renderedImgIndex: null,

        //for public
        ageImageSectionOffset: null,

        //for check long press event
        timeoutId: null,
        isSatisfyLongPress: null,
        isDetectingLongPress:null,

        swipeSelect: null,

        renderItems: function() {

        },

        //this method must call after $el is added into DOM
        initialize: function () {
            var self = this;
            this.initComponent();
            this.bindEvents();
            this.initDefaultValue();

            this.resetDectectLongPress();

            this.$ageImageSection.swipe({
                //Generic swipe handler for all directions
                swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
                    console.log("==swipe >>>>>>>> ");

                    //restrict swipe vertical directions only
                    if( $.isArray(self.options.allowedSwipeDirection) && ($.inArray(direction,self.options.allowedSwipeDirection) == -1)){
                        return false;
                    }

                    self.$el.trigger(pos.CharacterAge.EVENT_SWIPE, [self]);
                },
                //Default is 75px, set to 0 for demo so any distance triggers swipe
                threshold:10,
                maxTimeThreshold: 200
            });
        },

        bindEvents: function() {
            var self = this;

            this.activeAction(this.options.isActiveEvent);
        },


        activeAction: function(isActive) {
            //this.options.isActiveEvent = isActive;

            if (isActive) {
                var self = this;
                /*
                this.$el.on("mousedown touchstart", function(events) {
                    events.stopPropagation();
                    events.preventDefault();

                    //handle click event
                    self.startTouch(events);
                });
*/
/*
                this.$ageImageSection.on("mousemove touchstart", function(events) {
                    events.stopPropagation();
                    events.preventDefault();

                    //handle click event
                    self.startTouch(events);
                    console.log("=mousedown");
                });
*/
                this.$ageImageSection.swipe("enable");

                this.swipeSelect.$el.on(SwipeSelect.EVENT_CHANGE, function(){
                    //we need to update the character display of the age
                    //Note:bigLady is holder of the character regardless of gender
                    console.log("=EVENT_CHANGE");
                    self.updateImageIndex(self.swipeSelect.getSelectedIndex());
                    self.$el.trigger(SwipeSelectImage.EVENT_CHANGE_INDEX, [self.swipeSelect.getSelectedIndex()]);

                });


            } else {
                //this.$el.off("mousedown touchstart");
                //this.$el.swipe("disable");
                this.$ageImageSection.off("mousemove touchstart");
                this.$ageImageSection.swipe("disable");
                this.swipeSelect.$el.off(SwipeSelect.EVENT_CHANGE);

            }
        },

        initComponent: function() {
            this.getValueFromOption();

            this.clickPos = {
                "x" : 0,
                "y" : 0
            };


            //component
            this.swipeSelectModel = {
                items: this.options.selection
            };

            this.swipeSelect = new SwipeSelect({container:this.$el.find(".swipe-select-row"), noOfLines:this.options.noOfLines, selectedIndex:this.options.initValue, model:this.swipeSelectModel});
            this.$ageTitleSection = this.$el.find(".title-section");
            this.$ageImageSection = this.$el.find(".image-container-section");

            this.initImgInstanceList();

            this.selectedValue = this.options.initValue;
            this.renderValue(this.selectedValue);

        },

        getValueFromOption: function() {
            this.valueMin = this.options.valueMin;
            this.valueMax = this.options.valueMax;

            this.ageImageListData = this.options.ageImageList;
        },

        initImgInstanceList: function() {
            this.$ageImageSection.empty();
            this.ageImgInstanceList = [];

            for (var i = 0; i < this.ageImageListData.length; i++) {
                var imgStr = "<div class='img-container'>" +
                    "<img src='"+ this.ageImageListData[i] + "' class='age-image' " +
                    "/>"+
                    "</div>";
                var $imgobj = $(imgStr);
                this.$ageImageSection.append($imgobj);
                $imgobj.css({"opacity" : 0});
                //$imgobj.hide();
                this.ageImgInstanceList.push($imgobj);
            }
        },

        initDefaultValue: function() {
            this.$ageImageSection.css({
                "width": this.options.widthMax + "px",
                "height": this.options.heightMax + "px"
            });

            this.$el.css({
                "width": this.options.widthMax + "px"
            });

            //get age section offset
            var containerOffset = this.$el.offset();
            var ageOffset = this.$ageImageSection.offset();
            this.ageImageSectionOffset  = {
                "top": ageOffset.top - containerOffset.top,
                "left": ageOffset.left - containerOffset.left
            };

            //this.hideAgeSection();
        },

        renderValue: function(age) {
            console.log("SwipeSelectImage::renderValue:"+age);

            age = Math.round(age);
            this.$el.find(".title-section .value-num").html(age);

            //choose correct image
            // we divide equally
            var targetIndex = -1;
            var distanceStep = (this.valueMax - this.valueMin) / (this.ageImageListData.length - 1);
            var distance = age - this.valueMin;
            var indexImage = distance / distanceStep;
            targetIndex = Math.round(indexImage);
            console.log("SwipeSelectImage::renderValue:targetIndex-->"+targetIndex);


            this.updateImageIndex(targetIndex);
            this.swipeSelect.setSelectedIndex(age);
        },

        updateImageIndex: function(targetIndex){
            for (var i = 0; i < this.ageImgInstanceList.length; i++) {
                var $objItem = this.ageImgInstanceList[i];
                if (targetIndex === i) {
                    $objItem.css({"opacity" : 1});
                    //$objItem.show();
                } else {
                    $objItem.css({"opacity" : 0});
                    //$objItem.hide();
                }
            }
        },

        calculateAgeBaseOnDistance: function(distance) {
            var age = distance / this.options.ratio;
            return parseInt(age);
        },

        //>>>>>>>>>>>event control >>>>>>>>>>>>
        startTouch: function(events) {
            var self = this;
            var documentX = events.originalEvent.pageX;
            var documentY = events.originalEvent.pageY;
            if (this.options.isMobileWebSimulator) {
                //TODO : why using originalEvent.targetTouches[0]????
                documentX = events.originalEvent.targetTouches[0].pageX;
                documentY = events.originalEvent.targetTouches[0].pageY;
            }

            var containerOffset = this.$el.offset();
            this.clickPos.x = documentX - containerOffset.left;
            this.clickPos.y = documentY - containerOffset.top;
            console.log("===startTouch " + this.clickPos.x + "/ " + this.clickPos.y);

            this.cachedHeight = this.$el.height();
            this.cachedOffset = containerOffset;

            //active event handler
            this.activeDragBehavior(true);

            console.log("==start long press detection");
            this.isSatisfyLongPress = false;
            this.timeoutId = null;
            this.isDetectingLongPress = true;

            this.timeoutId = setTimeout(function() {
                console.log("==satisfy long press");
                self.isSatisfyLongPress = true;
                self.timeoutId = null;
                self.isDetectingLongPress = false;

                self.$el.trigger(SwipeSelectImage.EVENT_START_DRAG, [self.selectedValue]);
            }, SwipeSelectImage.LONG_PRESS_MAX_TIME);

            //this.$el.trigger(CharacterAge.EVENT_START_DRAG, [this.selectedValue]);
        },

        resetDectectLongPress: function() {
            this.isSatisfyLongPress = false;
            this.timeoutId = null;
            this.isDetectingLongPress = false;
        },

        startDrag: function(events) {
            var documentX = events.originalEvent.pageX;
            var documentY = events.originalEvent.pageY;
            if (this.options.isMobileWebSimulator) {
                //TODO : why using originalEvent.targetTouches[0]????
                documentX = events.originalEvent.targetTouches[0].pageX;
                documentY = events.originalEvent.targetTouches[0].pageY;
            }

            //var containerOffset = this.$el.offset();
            var containerOffset = this.cachedOffset;

            var dragPos = {};
            dragPos.x = documentX - containerOffset.left;
            dragPos.y = documentY - containerOffset.top;

            //only care about the y position
            var distance = -(dragPos.y - this.clickPos.y);

            //isDetecting and distance > MAX_DISTANCE => invalid long press
            if (this.isDetectingLongPress && Math.abs(distance) > SwipeSelectImage.LONG_PRESS_MAX_DISTANCE) {
                console.log("==exceed max distance fof long press");
                clearTimeout(this.timeoutId);
                this.resetDectectLongPress();
            } else {
                if (!this.isDetectingLongPress && this.isSatisfyLongPress) {    //not detecting and satification => permit drag
                    console.log("==sastisfy long press for dragging");
                    var marginAgeFromSelectedAge = this.calculateAgeBaseOnDistance(distance);
                    var targetValue = this.selectedValue + marginAgeFromSelectedAge;
                    if (targetValue > this.valueMax) {
                        targetValue = this.valueMax;
                    }

                    if (targetValue < this.valueMin) {
                        targetValue = this.valueMin;
                    }

                    console.log("==targetAge " + targetValue + " / " + this.valueMin + " / " + this.valueMax + "/ " + this.selectedValue);

                    //render the age
                    this.renderValue(targetValue);
                    this.temporaryValue = targetValue;

                    this.$el.trigger(SwipeSelectImage.EVENT_DRAGING, [targetValue]);
                } else {

                }
            }
        },

        //TODO : pay attention in touchend event in ipad, currently, we disable it
        endDrag: function(events) {
            if (this.isDetectingLongPress) {
                console.log("==not enough max time for long press");
                clearTimeout(this.timeoutId);
                this.resetDectectLongPress();
            } else {
                if (!this.isDetectingLongPress && this.isSatisfyLongPress) {    //not detecting and satification => permit drag
                    console.log("==sastisfy long press for end drag");
                    this.log("endDrag");
                    this.selectedValue = this.temporaryValue;
                    this.activeDragBehavior(false);
                    this.$el.trigger(SwipeSelectImage.EVENT_CHANGE, [this, this.selectedValue]);

                    this.$el.trigger(SwipeSelectImage.EVENT_END_DRAG);
                }
            }
        },

        //drag behavior
        activeDragBehavior: function(isActive) {
            if (isActive) {
                var self = this;

                $(window).on("mousemove touchmove", function(events) {
                    events.stopPropagation();

                    //handle drag event
                    self.startDrag(events);
                });

                $(window).on("mouseup touchend", function(events) {
                    events.stopPropagation();

                    //handle end drag event
                    self.endDrag(events);
                });
            } else {
                $(window).off("mousemove touchend");
                $(window).off("mouseup touchmove");
            }

        },

        //>>>>>>>>>>end event control

        log: function(msg) {
            if (this.options.isDebug) {
                console.log(msg);
            }
        },

        getIncomeAssetType: function() {
            return this.options.incomeAssetsType;
        },

        getSelectedValue: function() {
            return this.selectedValue;
        },

        setSelectedValue: function(value) {
            console.log("SwipeSelectImage::setSelectedValue:"+value);
            this.selectedValue = value;
            this.renderValue(this.selectedValue);
        }

    };

    // exports
    pos.SwipeSelectImage = SwipeSelectImage;
}(pos, jQuery, app.Templates, pos.SwipeSelect));