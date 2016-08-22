/*
 * © 2014 Aleph-labs.com
 * @author Thang Kieu, Phuong Vo
 * Last Updatedby: Aqeel Bhat
 * LUP: 17th Of April 2015
 *
 */

var page = page || {};
var pos = pos || {};
var data = data || {};

(function (page, $, Templates, I18nHelper, HeaderComponent, ConcernData) {
    'use strict';

    function YourConcernPage(element, options) {
        this.initialize(element, options);
        this.render();
    }

    YourConcernPage.VERSION = '3.3.1';
    YourConcernPage.EVENT_NEXT = "event_next";
    YourConcernPage.EVENT_PREVIOUS = "event_previous";
    YourConcernPage.STATE_ANIMATING = "state_animating";
    YourConcernPage.STATE_START_CHOOSE_CONCERN = "state_start_choose_house";
    YourConcernPage.INIT_CUSTOMER_X_RIGHT = -140;
    YourConcernPage.INIT_CUSTOMER_Y_BOTTOM = 70;

    YourConcernPage.DEFAULTS = {
        isDebug: true,
        isStandalone: false,
        isMobileWebSimulator: false
    };

    YourConcernPage.prototype = {
        constructor: YourConcernPage,
        $el: null,
        el: null,
        customerCharacter: null,
        coupleCharacter: null,
        $middleSection: null,
        customer: null,
        currentConcernData: null,
        currentConcern: null,
        dragConcern: null,
        pageState: null,
        gettingToKnowYouData: null,

        initialize: function (element, options) {
            if (element) {
                this.$el = $(element);
            } else {
                this.$el = $(this.getDocumentHTML());
            }

            this.el = this.$el[0];
            this.options = $.extend({}, YourConcernPage.DEFAULTS, options);
        },

        render: function () {
            this.gettingToKnowYouData = new data.GettingToKnowYouData();

            /*
            this.gettingToKnowYouData.setGender(data.CharacterData.MALE);
            this.gettingToKnowYouData.setAge(data.CharacterData.AGE_DEFAULT_MAN);
            this.gettingToKnowYouData.setMaritalStatus(data.ConfigData.MARITAL_MARRIED.toString());
            */

            if (this.options.isStandalone) {
                this.initComponent();
                this.bindEvents(true);

                this.setData(this.gettingToKnowYouData);
            }
        },

        initComponent: function () {
            var self = this;


            $( "#sortable" ).sortable({
                update: function( event, ui ) {
                    self.updateSortableIndexes();
                }
            });
            $( "#sortable" ).disableSelection();



            this.$middleSection = this.$el.find(".middle");
            this.pageState = YourConcernPage.STATE_START_CHOOSE_CONCERN;
        },

        bindEvents: function (isActiveEvent) {
            var self = this;
            console.log("===isActiveEvent " + isActiveEvent);
            if (isActiveEvent) {

                //for next-previous button
                this.$el.find(".control-container .next").on("click", function () {
                    self.navigationPage(true);
                });
                this.$el.find(".control-container .previous").on("click", function () {
                    self.navigationPage(false);
                });

                // housing list
                this.$el.off().on('mousedown touchstart', '.character-icon, .characters-list .title', function (events) {
                    //events.stopPropagation();
                    //events.preventDefault();
                    self.startClickCharacter(events);
                });


                //update the layout of the container when window resizes
                $(window).resize(function(){
                    self.updateLayout();
                });
                this.updateLayout();

            } else {
                this.$el.find(".control-container .next").off("click");
                this.$el.find(".control-container .previous").off("click");

                this.$el.find('.character-icon').each(function () {
                    self.$el.off('mousedown touchstart');
                });
            }
        },

        startClickCharacter: function (events) {

            console.log("==this.pageState " + this.pageState);

            this.headerComponent.hideHintArrow();

            var concernType = this.getConcernTypeByEvent(events);
            //don't allow to add more concern type if it is already in list
            if (this.gettingToKnowYouData.isConcernTypeInConcernList(concernType)) {
                return;
            }

            //dont allow click if  we still have animationing
            if (this.pageState !== YourConcernPage.STATE_START_CHOOSE_CONCERN) {
                return;
            }

            this.pageState = YourConcernPage.STATE_ANIMATING;

            var documentX = events.originalEvent.pageX;
            var documentY = events.originalEvent.pageY;
            if (this.options.isMobileWebSimulator) {
                //for test in chrome simulator device
                documentX = events.originalEvent.targetTouches[0].pageX;
                documentY = events.originalEvent.targetTouches[0].pageY;
            }

            // create house image
            this.createConcernForAnimation(events);
            this.dragConcern.$el.offset({
                'left': documentX - this.dragConcern.$el.width() / 2,
                'top': documentY
            });
            this.dragConcern.$el.css("opacity",0);
            this.activeMouseEvent(true);
        },

        activeMouseEvent: function (isActive) {
            var self = this;
            if (isActive) {
                this.$el.on("mousemove touchmove", function (events) {
                    events.stopPropagation();
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
            var $container = this.$el.find(".middle-wrapper");
            var pt = this.getCharFinalPosition();
            this.customerCharacter.$el.css({
                "left": pt.x,
                "top": pt.y
            });

        },

        createConcernForAnimation: function (event) {
            var $el = $(event.target);
            var index = $el.closest('.characters-list').index();

            if (this.currentConcern) {
                //this.currentConcern.updateLayout(pos.SVGItem.STATIC_IMAGE);
                //this.currentConcern.pauseSVGAnimation();
            }
            var filteredItems = ConcernData.getFilteredRange();
            this.currentConcernData = filteredItems[index];
            this.dragConcern = new pos.ConcernItem(null, this.currentConcernData);
            this.dragConcern.$el.data("data", this.currentConcernData);
            this.$el.find('.middle-wrapper').append(this.dragConcern.$el);
            this.dragConcern.initialize();

        },

        startDragCharacter: function (events) {
            var documentX = events.originalEvent.pageX;
            var documentY = events.originalEvent.pageY;
            if (this.options.isMobileWebSimulator) {
                //TODO : why using originalEvent.targetTouches[0]????
                documentX = events.originalEvent.targetTouches[0].pageX;
                documentY = events.originalEvent.targetTouches[0].pageY;
            }

            var characterOffsetX = documentX - this.dragConcern.$el.width() / 2;
            var characterOffsetY = documentY;

            this.log("==characterOffsetX " + characterOffsetX + " / characterOffsetY = " + characterOffsetY);

            //update big lady position
            this.dragConcern.$el.offset({
                "left": characterOffsetX,
                "top": characterOffsetY
            });

            //if the user is dragging the header we must hide the dragDream
            var middleYPos = this.$el.find(".middle").offset().top + 110;
            if (this.dragConcern.$el.offset().top < middleYPos) {
                this.dragConcern.$el.css("opacity",0);
            }
            else{
                this.dragConcern.$el.css("opacity",1);
            }

        },

        endDragCharacter: function () {
            //var self = this;
            this.activeMouseEvent(false);

            var middleYPos = this.$el.find(".middle").offset().top + 110;
            if (this.dragConcern.$el.offset().top < middleYPos) {
                //remove big character
                this.dragConcern.$el.remove();
                this.dragConcern = null;

                this.pageState = YourConcernPage.STATE_START_CHOOSE_CONCERN;
            } else {
                this.startToTargetAnimation();
            }

        },

        getCharFinalPosition: function(){
            var $wrappper = this.$el.find(".middle-wrapper");

            var target = this.customer;

            var wWidth =  $wrappper.width();
            var wHeight =  $wrappper.height();
            var tWidth =  target.$el.width();
            var tHeight =  target.$el.height();

            var x =  wWidth/10  - tWidth / 2;
            var y =  wHeight/2  - tHeight / 2 + 20;

            console.log("YourConcernPage::getCharFinalPosition:", wWidth, wHeight, tWidth, tHeight);

            return {x:x,y:y};
        },


        getConcernFinalPosition: function(){
            var $container = this.$el.find(".content-container");

            var sortableHeight = $container.find("#sortable").height();

            var x =  $container.offset().left + 70;//60 is the padding of #sortable
            var y =  parseInt($container.css("top").replace("px","")) + sortableHeight;

            console.log("YourConcernPage::getConcernFinalPosition:", x, y, sortableHeight);

            return {x:x,y:y};
        },



        startToTargetAnimation: function () {
            var self = this;

            var pt = this.getConcernFinalPosition();

            this.dragConcern.$el.css("position", "absolute");
            this.dragConcern.$el.animate({
                "left": pt.x,
                "top": pt.y
            }, 500, "swing", function () {
                self.completeChoosingCharacterAnimation();
            });
        },

        completeChoosingCharacterAnimation: function () {
            var self = this;

            //insert the dragConcern to the actual list
            this.dragConcern.$el.appendTo("#sortable");
            this.dragConcern.$el.css("position", "relative");
            this.dragConcern.$el.css("top", "");
            this.dragConcern.$el.css("left", "");
            this.dragConcern.grow(function(){
                self.updateLayout();
            });

            //switch to svg animation
            this.currentConcern = this.dragConcern;
            this.dragConcern = null;

            this.currentConcern.$el.on(mixin.Swipable.EVENT_SWIPE, function(events, target) {
                self.removeConcern(target);
            });

            this.log("completeChoosingCharacterAnimation");
            // update state
            this.pageState = YourConcernPage.STATE_START_CHOOSE_CONCERN;
            // add data and publish event

            this.gettingToKnowYouData.addConcern(this.currentConcernData);
            this.publishData();

             //fadout the item with dreamtype in header
            var concernType = this.currentConcernData.id;
            var indexSlide = data.ConcernData.getIndexByType(concernType);
            if (indexSlide !== -1) {
                this.headerComponent.disableItemAtIndex(indexSlide, true, true);
            }

        },



        publishData: function () {
            this.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_CONCERN);
        },


        removeConcern: function (target) {
            var self = this;
            var concernData = target.$el.data("data");
            target.$el.fadeOut(300, function () {
                this.remove();

                //update the header item again
                var concernType = concernData.id;
                var indexSlide = data.ConcernData.getIndexByType(concernType);
                self.headerComponent.disableItemAtIndex(indexSlide, false, true);

                self.pageState = YourConcernPage.STATE_START_CHOOSE_CONCERN;
                self.gettingToKnowYouData.removeConcern(concernData);
                self.publishData();
                self.updateLayout();


                console.log("YourConcernPage::removeConcern:", self.gettingToKnowYouData.getConcernList());
            });
        },

        getConcernTypeByEvent: function(event) {
            var $el = $(event.target);
            var index = $el.closest('.characters-list').index();
            var filteredList = ConcernData.getFilteredRange();
            if(index>=0 && index < filteredList.length){
                return filteredList[index].id;
            }
            else{
                return "";
            }
        },

        navigationPage: function (isNext) {

            var self = this;
            this.headerComponent.fadeOutMenuItems(function(){
                if (isNext) {
                    self.$el.trigger(YourConcernPage.EVENT_NEXT);
                } else {
                    self.$el.trigger(YourConcernPage.EVENT_PREVIOUS);
                }
            });

        },



        log: function (msg) {
            if (this.options.isDebug) {
                console.log(msg);
            }
        },

        getDocumentHTML: function () {
            var template = Templates.getTemplate('your-concern-page');
            return template();
        },

        onRender: function () {
            this.log("==YourConcernPage onRender ");
            this.initComponent();
            this.bindEvents(true);
        },

        onDestroy: function () {
            this.log("==YourConcernPage onDestroy ");
            this.bindEvents(false);
        },

        setData: function (dataObj) {
            console.log("==setData " + dataObj.getGender());
            this.gettingToKnowYouData = dataObj;

            //render customer
            var customerGender = this.gettingToKnowYouData.getGender();
            var occupation = this.gettingToKnowYouData.getOccupation();
            var age = this.gettingToKnowYouData.getAge()||40;
            console.log("YourConcernPage::setData:"+age+","+customerGender+","+occupation);

            //var customerGender = data.CharacterData.FEMALE;
            //var occupation = data.CharacterData.OCCUPATION_CAREER_STARTER;
            this.customer = new pos.CharacterEmotion(null, {
                "gender": customerGender,
                "ageMin": 1,
                "ageMax": 80,
                "age": age,
                "occupation": occupation,
                'widthMax': null,
                'heightMax': null,
                "isActiveEvent": false
            });
            var $container = this.$el.find(".middle-wrapper");
            $container.append(this.customer.$el);
            this.customer.initialize();


            //init the header
            var filters = [];
            var lifeStageData = this.gettingToKnowYouData.getLifeStage();
            console.log("YourConcernPage::initComponent:", this.gettingToKnowYouData, lifeStageData);
            
            if(lifeStageData.getIsProtection()){
                filters.push(ConcernData.FILTER_PROTECTION);
            }
            if(lifeStageData.getIsRetirement()){
                filters.push(ConcernData.FILTER_RETIREMENT);
            }
            if(lifeStageData.getIsInvestmentSaving()){
                filters.push(ConcernData.FILTER_INVESTMENT);
            }
            var items = ConcernData.filterRange(filters);

            this.headerModel = {
                items: items
            }

            this.headerComponent = new HeaderComponent({
                container: this.$el.find(".header"),
                model: this.headerModel,
                onlyExternal:false
            });

            this.cleanUpConcernItems();
            this.initConcernItems();

            this.updateLayout();

        },


        /**
        * purge concern items not on the filter list before displaying
        */
        cleanUpConcernItems: function(){
            var concernItems =  this.gettingToKnowYouData.getConcernList();

            if(concernItems.length > 0){
               var itemsToPurge = [];
               for(var i=0; i<concernItems.length; i++){
                    var item = concernItems[i];
                    var itemInFilteredItems = ConcernData.itemInFilteredItems(item);
                    if(!itemInFilteredItems){
                        itemsToPurge.push(item);                       
                    }
               }

               for(var j=0; j<itemsToPurge.length; j++){
                    //remove this from the list
                    this.gettingToKnowYouData.removeConcern(itemsToPurge[j]);
               }                
            }


        },


        /**
        * insert the existing concern item in the DOM
        */
        initConcernItems:function(){
            var self = this;
            var concernItems =  this.gettingToKnowYouData.getConcernList();          

            if(concernItems.length > 0){
            
                for(var i=0; i<concernItems.length; i++){
                    this.currentConcernData = concernItems[i];
                    this.currentConcern = new pos.ConcernItem(null, this.currentConcernData);
                    this.currentConcern.$el.data("data", this.currentConcernData);
                    this.currentConcern.$el.appendTo("#sortable");
                    this.currentConcern.growInstant();

                    this.currentConcern.$el.on(mixin.Swipable.EVENT_SWIPE, function(events, target) {
                        self.removeConcern(target);
                    });

                    //update the header item
                    var indexSlide = ConcernData.getIndexByType(this.currentConcernData.id);
                    if (indexSlide !== -1) {
                        self.headerComponent.disableItemAtIndex(indexSlide, true, false);
                    }
                }
                this.headerComponent.hideHintArrow();

            }
            else if(this.headerModel.items.length == 0){
                this.headerComponent.hideHintArrow();
            }
            else{
                this.headerComponent.showHintArrow();
            }
        },


        updateSortableIndexes: function(){
            var $sortables =  this.$el.find(".sortable-cloud");
            $sortables.each(function(index){
                $(this).find(".number").text(index + 1);
            });
        },

        updateEmotion:function(){
            if(this.customer){
                var concernCount =  this.gettingToKnowYouData.getConcernList().length;
                if(concernCount > 2){
                    this.customer.renderEmotion(pos.CharacterEmotion.EMOTION_TYPE_SAD);
                }
                else{
                    this.customer.renderEmotion(pos.CharacterEmotion.EMOTION_TYPE_DEFAULT);
                }
            }
        },


        /**
        * update the position of the container when the window resizes
        */
        updateLayout: function(){

            this.updateSortableIndexes();
            this.updateEmotion();

            var $container =  this.$el.find(".content-container");
            var $parent = this.$el.find(".middle-wrapper");
            var containerHeight = $container.height();
            var pHeight = $parent.height();

            var pTop = $parent.find(">.title").height();

            var pBottom = $parent.find(".next").height();

            var parentAvaibleHeight =    pHeight  - pTop - pBottom;
            var offset = 0; //arbitrary
            var toT = (parentAvaibleHeight - containerHeight)/2 + pTop - offset;

            //if we have the house displayed change the position of the house
            if(this.customer){
                var pt = this.getCharFinalPosition();
                console.log("YourConcernPage::updateLayout:->", pt);
                this.customer.$el.css("left",pt.x);
                this.customer.$el.css("top", pt.y);

                var $bubbleCloud = this.$el.find(".bubble-cloud");
                $bubbleCloud.css("left",pt.x + this.customer.$el.width()/2 + 40);
                $bubbleCloud.css("top", pt.y  + 10);

                $container.animate({
                    "top": pt.y  - 10
                }, 500, "swing");
            }



            console.log("YourConcernPage::updateLayout:", containerHeight, pHeight, pTop, pBottom, parentAvaibleHeight, toT);

            //show the bubble only when we have concerns
            var concernCount =  this.gettingToKnowYouData.getConcernList().length;
            if(concernCount > 0){
                this.$el.find(".bubble-cloud").fadeIn();
            }
            else{
                this.$el.find(".bubble-cloud").fadeOut();
            }

        }


    };

    var temporaryObj = YourConcernPage.prototype;

    YourConcernPage.prototype = Object.create(pos.PageElement.prototype);

    $.extend(YourConcernPage.prototype, temporaryObj);

    page.YourConcernPage = YourConcernPage;

}(page, jQuery, app.Templates, app.I18nHelper, pos.HeaderComponent, data.ConcernData));