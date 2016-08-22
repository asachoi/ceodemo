/* © 2014 Aleph-labs.com
 * @author Thang Kieu, Phuong Vo
 */
// namespace
var page = page || {};
var pos = pos || {};
var data = data || {};

(function (page, $, Templates, I18nHelper, HeaderComponent, DreamData) {
    'use strict';

    /**
     * YourDreamPage component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function YourDreamPage(element, options) {

        this.options   = $.extend({}, YourDreamPage.DEFAULTS, options);
        this.options.element = element;

        this.insertToDOM();

        if (this.options.isStandalone) {

            this.initComponent();
            this.bindEvents(true);
            this.setData(this.gettingToKnowYouData);
        }

    }

    YourDreamPage.VERSION = '3.3.1';


    YourDreamPage.EVENT_NEXT = "event_next";
    YourDreamPage.EVENT_PREVIOUS = "event_previous";

    YourDreamPage.STATE_ANIMATING = "state_animating";
    YourDreamPage.STATE_START_CHOOSE_DREAM = "state_start_choose_dream";

    YourDreamPage.INIT_CUSTOMER_X_RIGHT = -140;
    YourDreamPage.INIT_CUSTOMER_Y_BOTTOM = 70;

    YourDreamPage.DISTANCE_BETWEEN_DREAM_COMPONENT = 10;

    YourDreamPage.DEFAULTS = {
        // no defaults for now
        isDebug: true,
        isStandalone: false,
        isMobileWebSimulator: false
    };


    YourDreamPage.prototype = {
        constructor: YourDreamPage,

        $el: null,
        el: null,

        customerCharacter: null,
        coupleCharacter: null,

        // middle section
        $middleSection: null,

        customer: null,

        currentDream: null,
        dragDream: null,

        pageState: null,

        gettingToKnowYouData: null,

        selectedDreamType: null, //the current dream type
        dreamListItem: null,

        middleSwipeComp: null,
        posTopOfSwipe: null,

        initComponent: function () {
            //init the header
            var self = this;
            this.headerModel = {
                items: DreamData.DREAM_RANGE
            };

            this.headerComponent = new HeaderComponent({
                container: this.$el.find(".header"),
                model: this.headerModel,
                onlyExternal:false
            });

            this.$middleSection = this.$el.find(".middle");
            this.pageState = YourDreamPage.STATE_START_CHOOSE_DREAM;

            this.dreamListItem = [];

            this.middleSwipeComp = this.$el.find(".dream-list-container");
			this.middleSwipeComp = this.middleSwipeComp.swiper({
				//Your options here:
				slidesPerView: 'auto',
				loop: false,
				onlyExternal: false,
				onSlideChangeEnd: function() {
                    self.onSlideChangeEndForSwipeComponent();
                }
			});
			this.$el.find(".dream-list-container .icon-arrow-invert-next").hide();
        	this.$el.find(".dream-list-container .icon-arrow-invert-prev").hide();
        },

        /**
         * bind event
         * @param  {Boolean} isActiveEvent [description]
         * @return {[type]}                [description]
         */
        bindEvents: function (isActiveEvent) {
            var self = this;
            console.log("===isActiveEvent " + isActiveEvent);

            if (isActiveEvent) {

                I18nHelper.eventDispatcher.on(I18nHelper.EVENT_CHANGE, function(events){
                    self.updateTranslations();
                });

                //for next-previous button
                this.$el.find(".control-container .next").on("click", function () {
                    self.navigationPage(true);
                });
                this.$el.find(".control-container .previous").on("click", function () {
                    self.navigationPage(false);
                });

                // dreams list
                this.$el.off().on('mousedown touchstart', '.character-icon', function (events) {
                    events.stopPropagation();
                    events.preventDefault();
                    self.startClickCharacter(events);
                });

                this.$el.on('swipe', function () {
                    console.log('swipe');
                });

                this.$el.find(".dream-list-container .icon-arrow-invert-next").on("click", function() {
                	self.nextEventHandlerForSwipeComponent();
                });
                this.$el.find(".dream-list-container .icon-arrow-invert-prev").on("click", function() {
                	self.previousEventHandlerForSwipeComponent();
                });

            } else {
                this.$el.find(".control-container .next").off("click");
                this.$el.find(".control-container .previous").off("click");

                this.$el.find('.character-icon').each(function () {
                    self.$el.off('mousedown touchstart');
                });

                this.$el.find(".dream-list-container .icon-arrow-invert-next").off("click");
                this.$el.find(".dream-list-container .icon-arrow-invert-prev").off("click");
            }
        },

        startClickCharacter: function (events) {
            //check if dreamtype is already in data or not
            var dreamType = this.getDreamTypeByEvent(events);
            //don't allow to add more dream type if it is already in list
            if (this.gettingToKnowYouData.isDreamTypeInDreamList(dreamType)) {
                return;
            }

            this.headerComponent.hideHintArrow();

            if (this.gettingToKnowYouData.getDreamList().length > 6) {
                return;     //limit the number of dependents
            }

            console.log("==this.pageState " + this.pageState);
            //dont allow click if  we still have animationing
            if (this.pageState !== YourDreamPage.STATE_START_CHOOSE_DREAM) {
                return;
            }

            this.pageState = YourDreamPage.STATE_ANIMATING;

            var documentX = events.originalEvent.pageX;
            var documentY = events.originalEvent.pageY;
            if (this.options.isMobileWebSimulator) {
                //for test in chrome simulator device
                documentX = events.originalEvent.targetTouches[0].pageX;
                documentY = events.originalEvent.targetTouches[0].pageY;
            }

            // create house image
            this.createDreamForAnimation(dreamType);
            this.dragDream.$el.offset({
                'left': documentX - this.dragDream.$el.width() / 2,
                'top': documentY
            });
            this.dragDream.$el.css("opacity",0);
            this.activeMouseEvent(true);
        },


        /**
         * active mouse event
         *  for drag drop
         */
        activeMouseEvent: function (isActive) {
            var self = this;
            if (isActive) {
                this.$el.on("mousemove touchmove", function (events) {
                    //events.stopPropagation();
                    self.startDragCharacter(events);
                });

                this.$el.on("mouseup touchend", function (events) {
                    //events.stopPropagation();
                    //events.preventDefault();
                    self.endDragCharacter(events);
                });
            } else {
                this.$el.off("mousemove touchend");
                this.$el.off("mouseup touchmove");

            }
        },

        renderCharacter: function () {
            var $container = this.$el.find(".left-container");
            var xPos = $container.width() - YourDreamPage.INIT_CUSTOMER_X_RIGHT - this.customerCharacter.$el.width();
            var yPos = $container.height() - YourDreamPage.INIT_CUSTOMER_Y_BOTTOM - this.customerCharacter.$el.height();
            if (this.coupleCharacter) {
                this.coupleCharacter.$el.css({
                    "left": xPos,
                    "top": yPos
                });
                xPos = xPos - this.coupleCharacter.$el.width() - YourDreamPage.DISTANCE_CHARACTER;
            }

            this.customerCharacter.$el.css({
                "left": xPos,
                "top": yPos
            });

        },

        getDreamTypeByEvent: function(event) {
            var $el = $(event.target);
            var id = $el.closest('.characters-list').index();

            var dreamType = "";
            if (id === "0" || id === 0) {
                dreamType = data.DreamData.DREAM_BUYING_A_HOUSE;
            }
            if (id === "1" || id === 1) {
                dreamType = data.DreamData.DREAM_GETTING_MARRIED;
            }
            if (id === "2" || id === 2) {
                dreamType = data.DreamData.DREAM_HAVING_A_BABY;
            }
            if (id === "3" || id === 3) {
                dreamType = data.DreamData.DREAM_PLAN_FOR_EDUCATION;
            }
            if (id === "4" || id === 4) {
                dreamType = data.DreamData.DREAM_BUYING_A_NEW_CAR;
            }
            if (id === "5" || id === 5) {
                dreamType = data.DreamData.DREAM_PLAN_FOR_VACATION;
            }
            if (id === "6" || id === 6) {
                dreamType = data.DreamData.DREAM_EARLY_RETIREMENT;
            }

            return dreamType;
        },

        //convert the index item in header type with the dream type
        getIndexOfHeaderSlideByDreamType: function(dreamType) {
            if (dreamType === data.DreamData.DREAM_BUYING_A_HOUSE) {
                return 0;
            }
            if (dreamType === data.DreamData.DREAM_GETTING_MARRIED) {
                return 1;
            }
            if (dreamType === data.DreamData.DREAM_HAVING_A_BABY) {
                return 2;
            }
            if (dreamType === data.DreamData.DREAM_PLAN_FOR_EDUCATION) {
                return 3;
            }
            if (dreamType === data.DreamData.DREAM_BUYING_A_NEW_CAR) {
                return 4;
            }
            if (dreamType === data.DreamData.DREAM_PLAN_FOR_VACATION) {
                return 5;
            }

            if (dreamType === data.DreamData.DREAM_EARLY_RETIREMENT) {
                return 6;
            }

            return -1;
        },

        createDreamForAnimation: function (dreamType) {
            this.selectedDreamType = dreamType;
            this.dragDream = this.createDreamItemByType(dreamType);
        },

        addEventForDreamObj: function(dreamItem, isAddEvent) {
            console.log("===addEventForDreamObj " + isAddEvent);
            var self = this;
            if (isAddEvent) {
                dreamItem.$el.on(pos.SwipeSelectImage.EVENT_CHANGE_INDEX, function(event, index) {
                    var dreamData  = dreamItem.$el.data("data");
                    dreamData.setIndex(index);
                });
                dreamItem.$el.on(pos.CharacterAge.EVENT_SWIPE, function(events, target) {
                    console.log("==swipe out");
                    self.removeDream(target);
                });
            } else {
                dreamItem.$el.off(pos.SwipeSelectImage.EVENT_CHANGE_INDEX);
                dreamItem.$el.off(pos.CharacterAge.EVENT_SWIPE);
            }
        },

        startDragCharacter: function (events) {
            var documentX = events.originalEvent.pageX;
            var documentY = events.originalEvent.pageY;
            if (this.options.isMobileWebSimulator) {
                //TODO : why using originalEvent.targetTouches[0]????
                documentX = events.originalEvent.targetTouches[0].pageX;
                documentY = events.originalEvent.targetTouches[0].pageY;
            }

            var characterOffsetX = documentX - this.dragDream.$el.width() / 2;
            var characterOffsetY = documentY;

            //this.log("==characterOffsetX " + characterOffsetX + " / characterOffsetY = " + characterOffsetY);

            //update big lady position
            this.dragDream.$el.offset({
                "left": characterOffsetX,
                "top": characterOffsetY
            });

            //if the user is dragging the header we must hide the dragDream
            var middleYPos = this.$el.find(".middle").offset().top + 110;
            if (this.dragDream.$el.offset().top < middleYPos) {
                this.dragDream.$el.css("opacity",0);
            }
            else{
                this.dragDream.$el.css("opacity",1);
            }

        },

        endDragCharacter: function () {
            //var self = this;
            this.activeMouseEvent(false);

            var middleYPos = this.$el.find(".middle").offset().top + 110;
            if (this.dragDream.$el.offset().top < middleYPos) {
                //remove big character
                this.dragDream.$el.remove();
                this.dragDream = null;

                this.pageState = YourDreamPage.STATE_START_CHOOSE_DREAM;
            } else {
                this.startToTargetAnimation();
            }
        },

        /**
         * start animation to target position
         * @return {[type]} [description]
         */
        startToTargetAnimation: function () {
            var self = this;
            var $wrappper = this.$el.find(".middle-wrapper");

            if (this.posTopOfSwipe === null) {
            	this.posTopOfSwipe = $wrappper.height()/2 - this.dragDream.$el.height()/2;
            }

            var leftPos = this.getAvailableSpace();
            console.log("===leftPos " + leftPos + " / " + $wrappper.height() + " / " + this.dragDream.$el.height() + " / " + this.posTopOfSwipe);

            this.dragDream.$el.animate({
                "left": leftPos,
                "top": this.posTopOfSwipe
            }, 500, "swing", function () {
                self.completeChoosingCharacterAnimation();
            });

            this.dreamListItem.push(this.dragDream);
        },

        getAvailableSpace: function() {
            var availablePos = 0;
            var DISTANCE = YourDreamPage.DISTANCE_BETWEEN_DREAM_COMPONENT;
            for (var i = 0; i <this.dreamListItem.length ; i++) {
            	var dreamItem = this.dreamListItem[i];
            	availablePos = availablePos + dreamItem.$el.width() + DISTANCE;
            }

            return availablePos;
        },

        removeDreamItemFromList: function(item) {
        	var indexSelected = -1;
            for (var i = 0; i < this.dreamListItem.length; i++) {
                var dream = this.dreamListItem[i];
                if (dream === item) {
                    this.dreamListItem.splice(i, 1);
                    indexSelected = i;
                    break;
                }
            }

            //this.rearrangeItemList();

            //remove from the swipe component
            if (indexSelected !== -1) {
            	this.middleSwipeComp.removeSlide(indexSelected);
            }

            this.checkToVisibleNextPreviousBtnOfSwipeComponent();
        },

        rearrangeItemList: function() {
            var availablePos = 0;
            var DISTANCE = 40;
            var topPos = 0;
            if (this.dreamListItem.length > 0) {
                var firstItem = this.dreamListItem[0];
                var $wrappper = this.$el.find(".middle-wrapper");
                topPos = $wrappper.height() * 4/5 - firstItem.$el.height();
            }

            //rearrange the list again
            for (var i = 0; i < this.dreamListItem.length; i++) {
                var dream = this.dreamListItem[i];
                dream.$el.css({
                    "top": topPos,
                    "left": availablePos
                });

                availablePos = availablePos + DISTANCE + dream.$el.width();
            }
        },

        completeChoosingCharacterAnimation: function () {
            var self = this;

            //switch to svg animation
            this.currentDream = this.dragDream;
            //this.currentDream.updateLayout(pos.SVGItem.SVG_IMAGE);
            this.dragDream = null;

            this.log("completeChoosingCharacterAnimation");
            // update state
            this.pageState = YourDreamPage.STATE_START_CHOOSE_DREAM;
            // add data and publish event

            this.addEventForDreamObj(this.currentDream, true);

            this.publishData();

            this.selectedDreamType = null;

            this.updateHeaderDreamSelection();

            var selectedValue = this.currentDream.getSelectedValue();
            this.addComponentToSwipeContainer(this.currentDream);

            this.checkToVisibleNextPreviousBtnOfSwipeComponent();

            //fadout the item with dreamtype in header
            var dreamType = this.currentDream.getIncomeAssetType();
            var indexSlide = this.getIndexOfHeaderSlideByDreamType(dreamType);
            console.log("==indexSlide " + indexSlide);
            if (indexSlide !== -1) {
                this.headerComponent.disableItemAtIndex(indexSlide, true, true);
            }

        },

        //add all the dream item in screen into the swipe component
        //It will allow user to scroll the dream item list and swipe in the list
        addComponentToSwipeContainer: function(dreamItem) {
        	var $swipeSlideItemContainer = $("<div class='swiper-slide dream-item'></div>");
        	var marginLeft = YourDreamPage.DISTANCE_BETWEEN_DREAM_COMPONENT;
        	if (this.dreamListItem.length === 1) {
        		marginLeft = 0;
        	}
        	dreamItem.$el.css({
        		"top": "initial",
        		"left": "initial",
        		"position": "initial",
        		"padding-left": marginLeft,
                "margin-top": this.posTopOfSwipe
        	});
        	$swipeSlideItemContainer.append(dreamItem.$el);
           

        	this.$el.find(".dream-list-container").css({
        		//"margin-top": this.posTopOfSwipe
        	});
        	this.middleSwipeComp.appendSlide($swipeSlideItemContainer.get(0));

            console.log("==this.middleSwipeComp.slides.length - 1 " + this.middleSwipeComp.slides.length - 1);
            this.middleSwipeComp.swipeTo(this.middleSwipeComp.slides.length - 1);
        },

        checkToVisibleNextPreviousBtnOfSwipeComponent: function() {
        	var slideCount  = this.middleSwipeComp.slides.length;
            var visibleCount =  this.middleSwipeComp.visibleSlides.length;
            var firstVisibleIndex = this.middleSwipeComp.activeIndex;
            var lastVisibleIndex = firstVisibleIndex + visibleCount - 1;
            console.log("==firstVisibleIndex " + firstVisibleIndex + "/ " + lastVisibleIndex);

            if(visibleCount < slideCount){
                //alert("slideCount:"+slideCount+",visibleCount:"+visibleCount+",firstVisibleIndex:"+firstVisibleIndex+",lastVisibleIndex:"+lastVisibleIndex);
                if (firstVisibleIndex > 0) {
        			this.$el.find(".dream-list-container .icon-arrow-invert-prev").show();
                } else {
                	this.$el.find(".dream-list-container .icon-arrow-invert-prev").hide();
                }
                if(lastVisibleIndex < slideCount - 1){
                    this.$el.find(".dream-list-container .icon-arrow-invert-next").show();
                } else {
                	this.$el.find(".dream-list-container .icon-arrow-invert-next").hide();
                }
            }
            else{
                //alert("all visible");
                this.$el.find(".dream-list-container .icon-arrow-invert-next").hide();
                this.$el.find(".dream-list-container .icon-arrow-invert-prev").hide();
            }
        },

        nextEventHandlerForSwipeComponent: function() {
        	this.middleSwipeComp.swipeNext();
        },

        previousEventHandlerForSwipeComponent: function() {
        	this.middleSwipeComp.swipePrev();
        },

        onSlideChangeEndForSwipeComponent: function() {
        	console.log("==onSlideChangeEndForSwipeComponent");
        	this.checkToVisibleNextPreviousBtnOfSwipeComponent();
        },

        publishData: function () {
            console.log("YourDreamPage::publishData:");
            var dreamData = new data.DreamData();
            dreamData.setDreamType(this.selectedDreamType);
            dreamData.setIndex(this.currentDream.getSelectedValue());
            this.gettingToKnowYouData.addDreamElement(dreamData);
            this.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_DREAM);

            //attach the dream data to view and set default value for dream component
            this.currentDream.$el.data("data", dreamData);
            
            /*
            var index = dreamData.getIndex();
            if (index !== -1) {
                this.currentDream.setSelectedValue(index);
            }
            */            

        },

        removeDream: function (target) {
            target.$el.fadeOut(300, function () {
                this.remove();
            });
            this.pageState = YourDreamPage.STATE_START_CHOOSE_DREAM;
            var dreamData = target.$el.data("data");

            this.gettingToKnowYouData.removeDream(dreamData);
            this.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_DREAM);

            this.updateHeaderDreamSelection();

            //remove the target from dreamList instance view
            this.removeDreamItemFromList(target);
            //remove the event
            this.addEventForDreamObj(target, false);

            //update the header item again
            var dreamType = dreamData.getDreamType();
            var indexSlide = this.getIndexOfHeaderSlideByDreamType(dreamType);
            this.headerComponent.disableItemAtIndex(indexSlide, false, true);
        },

        updateHeaderDreamSelection:function(){
            if (this.gettingToKnowYouData.getDreamList().length > 6) {
                //this.headerComponent.disableSelection();
            } else {
                //this.headerComponent.enableSelection();
            }
        },

        navigationPage: function (isNext) {
            var self = this;

            this.headerComponent.fadeOutMenuItems(function(){
                if (isNext) {
                    self.$el.trigger(YourDreamPage.EVENT_NEXT);
                } else {
                    self.$el.trigger(YourDreamPage.EVENT_PREVIOUS);
                }
            });

        },

        log: function (msg) {
            if (this.options.isDebug) {
                console.log(msg);
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
                    if(this.options.containerPosition === "prepend"){
                        this.$container.prepend(this.$el);
                    }
                    else{
                        this.$container.append(this.$el);
                    }
                }
            }
            this.el = this.$el[0];
        },


        //>>>>>>>>>>>>>>for pageElement event >>>>>>>>>>>>
        getDocumentHTML: function () {
            // jshint multistr:true
            var template = Templates.getTemplate('your-dream-page');
            return template();
        },

        onRender: function () {
            this.log("==YourDreamPage onRender ");
            this.initComponent();
            this.bindEvents(true);
        },

        onDestroy: function () {
            this.log("==YourDreamPage onDestroy ");

            this.bindEvents(false);
        },

        setData: function (dataObj) {
            console.log("YourDreamPage::setData:"+dataObj.getGender());
            this.gettingToKnowYouData = dataObj;
            var self = this;

            var dreamList = this.gettingToKnowYouData.getDreamList();
            if(dreamList.length > 0){
                for (var i = 0; i < dreamList.length; i++) {
                    var dreamType = dreamList[i].getDreamType();
                    var index = dreamList[i].getIndex();
                    var dreamObj = self.createDreamItemByType(dreamType);
                    if (this.posTopOfSwipe === null) {
                    	var $wrappper = this.$el.find(".middle-wrapper");
    					this.posTopOfSwipe = $wrappper.height()/2 - dreamObj.$el.height()/2;
                    }

                    self.addComponentToSwipeContainer(dreamObj);
                    dreamObj.$el.data("data", dreamList[i]);
                    console.log("==index " + index);
                    if (index !== -1) {
                        dreamObj.setSelectedValue(index);
                    }

                    this.dreamListItem.push(dreamObj);
                    self.addEventForDreamObj(dreamObj, true);

                    //update the header item
                    var indexSlide = self.getIndexOfHeaderSlideByDreamType(dreamType);
                    if (indexSlide !== -1) {
                        self.headerComponent.disableItemAtIndex(indexSlide, true, false);
                    }
                }

                //arange the list again
                //this.rearrangeItemList();

                this.headerComponent.hideHintArrow();
            }
            else{
                 this.headerComponent.showHintArrow();
            }
        },

        createDreamItemByType: function(dreamType) {
            var title = DreamData.getTitleByType(dreamType);
            var translationPath = DreamData.getTranslationPathByType(dreamType);
            var imageList = DreamData.getImagesByDreamType(dreamType);
            var selection = DreamData.getSelectionByDreamType(dreamType);
            var dragDream = new pos.SwipeSelectImage(null, {
                    'incomeAssetsType': dreamType,
                    "ageImageList": imageList,
                    "selection": selection,
                    "title": title,
                    "translationPath":translationPath,
                    "noOfLines": 2,
                    "valueMin" : 0,
                    "valueMax" : selection.length - 1,
                    "isActiveEvent": true,
                    "ratio": 80
                });

            //this.$el.find('.middle-wrapper').append(this.dragDream.$el);
            this.$el.find('.component-container').append(dragDream.$el);
            dragDream.initialize(dreamType);

            //we need to translate the dream as this is not handled by the global
            //translator
            this.updateTranslations();

            return dragDream;
        },

        updateTranslations:function(){
            console.log("YourDreamPage::updateTranslations:");
            this.$el.find("[data-i18n]").i18n();
        }
    };


    var temporaryObj = YourDreamPage.prototype;
    YourDreamPage.prototype = Object.create(pos.PageElement.prototype);
    $.extend(YourDreamPage.prototype, temporaryObj);

    // exports
    page.YourDreamPage = YourDreamPage;
}(page, jQuery, app.Templates, app.I18nHelper, pos.HeaderComponent, data.DreamData));
