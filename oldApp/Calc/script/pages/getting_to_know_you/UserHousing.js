/* © 2015 - Aleph-labs.com
 * @author Thang Kieu, Phuong Vo
 * Last Updated: 17th of April 2015
 * Last Updated By: Aqeel Bhat
 */

// namespace
var app = app || {};
var page = page || {};
var pos = pos || {};
var data = data || {};
var mixins = mixins || {};

(function (page, $, app, data, pos, mixin) {
    'use strict';

    function UserHousing(element, options) {


        this.options   = $.extend({}, UserHousing.DEFAULTS, options);
        this.options.element = element;

        this.insertToDOM();

        this.gettingToKnowYouData = new data.GettingToKnowYouData();
        this.housingData = this.gettingToKnowYouData.getHousing();

        if (this.options.isStandalone) {
            this.initComponent();
            this.bindEvents(true);
        }

    }

    UserHousing.VERSION = '3.3.1';
    UserHousing.EVENT_NEXT = "event_next";
    UserHousing.EVENT_PREVIOUS = "event_previous";
    UserHousing.STATE_ANIMATING = "state_animating";
    UserHousing.STATE_START_CHOOSE_HOUSE = "state_start_choose_house";
    UserHousing.INIT_CUSTOMER_X_RIGHT = -140;
    UserHousing.INIT_CUSTOMER_Y_BOTTOM = 70;

    UserHousing.DEFAULTS = {
        // no defaults for now
        isDebug: true,
        isStandalone: false,
        isMobileWebSimulator: false
    };

    UserHousing.prototype = {
        constructor: UserHousing,
        $el: null,
        el: null,
        customerCharacter: null,
        coupleCharacter: null,
        $middleSection: null,
        customer: null,
        currentHouse: null,
        dragHouse: null,
        pageState: null,
        gettingToKnowYouData: null,
        housingData:null, //a subset of gettusingToKnowYouData sepecifically for this page

        isVisibleDragHouse: null,
        initComponent: function () {
            console.log("UserHousing::initComponent:", this.gettingToKnowYouData);

            this.$middleSection = this.$el.find(".middle");
            this.$houseItem = this.$el.find(".svg-item");
            this.$formView = this.$el.find(".content-container");

            this.headerModel = {
                items: data.HousingData.HOUSING_RANGE
            };
            this.headerComponent = new pos.HeaderComponent({
                container: this.$el.find(".header"),
                model: this.headerModel
            });

            this.pageState = UserHousing.STATE_START_CHOOSE_HOUSE;

            //init the swipe select
            this.outstandingMortgageModel = {
                items: data.HousingData.getOutstandingMortgageRange()
            };
            this.outstandingMortgageSelect = new pos.SwipeSelect({
                container: this.$el.find(".outstanding-mortgage-select-row"),
                model: this.outstandingMortgageModel,
                editable:true,
                value:1000000,
                inputMin:0,
                inputMax:999999999
            });

            this.monthlyMortgagePaymentModel = {
                items: data.HousingData.getMonthlyExpensesRange()
            };
            this.monthlyMortgagePaymentSelect = new pos.SwipeSelect({
                container: this.$el.find(".monthly-mortgage-payment-select-row"),
                model: this.monthlyMortgagePaymentModel,
                editable:true,
                value:10000,
                inputMin:0,
                inputMax:9999999
            });

            this.monthlyRentalExpensesModel = {
                items: data.HousingData.getMonthlyRentalExpensesRange()
            };
            this.monthlyRentalExpensesSelect = new pos.SwipeSelect({
                container: this.$el.find(".monthly-rental-expenses-select-row"),
                model: this.monthlyRentalExpensesModel,
                editable:true,
                value:10000,
                inputMin:0,
                inputMax:999999999
            });


            this.expenseModel = {
                items: data.HousingData.getMonthlyExpensesRange()
            };
            this.expenseSelect = new pos.SwipeSelect({
                container: this.$el.find(".expenses-select-row"),
                model: this.expenseModel,
                editable:true,
                value:30000,
                inputMin:0,
                inputMax:9999999
            });

            this.incomeModel = {
                items: data.HousingData.getIncomeRange()
            };
            this.incomeSelect = new pos.SwipeSelect({
                container: this.$el.find(".income-select-row"),
                model: this.incomeModel,
                editable:true,
                value:''
            });
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
                this.$el.off().on('mousedown touchstart', '.character-icon', function (events) {
                    events.stopPropagation();
                    events.preventDefault();
                    self.startClickCharacter(events);
                });

                this.expenseSelect.$el.on(pos.SwipeSelect.EVENT_CHANGE, function(){
                    self.publishData();
                });

                this.incomeSelect.$el.on(pos.SwipeSelect.EVENT_CHANGE, function(){
                      self.publishData();
                });

                this.outstandingMortgageSelect.$el.on(pos.SwipeSelect.EVENT_CHANGE, function(){
                      self.publishData();
                });

                this.monthlyMortgagePaymentSelect.$el.on(pos.SwipeSelect.EVENT_CHANGE, function(){
                      self.publishData();
                });

                this.monthlyRentalExpensesSelect.$el.on(pos.SwipeSelect.EVENT_CHANGE, function(){
                      self.publishData();
                });


                //update the layout of the container when window resizes
                $(window).resize(function(){
                    self.updateLayout();
                });
                this.updateLayout();

            }
            else {
                this.$el.find(".control-container .next").off("click");
                this.$el.find(".control-container .previous").off("click");

                this.$el.find('.character-icon').each(function () {
                    self.$el.off('mousedown touchstart');
                });
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

        startClickCharacter: function (events) {
            console.log("==this.pageState " + this.pageState);

            this.isVisibleDragHouse = false;
            this.headerComponent.hideHintArrow();

            //dont allow click if  we still have animationing
            if (this.pageState !==UserHousing.STATE_START_CHOOSE_HOUSE || this.headerComponent.getIsDisabled()) {
                return;
            }

            this.pageState = UserHousing.STATE_ANIMATING;

            var documentX = events.originalEvent.pageX;
            var documentY = events.originalEvent.pageY;
            if (this.options.isMobileWebSimulator) {
                //for test in chrome simulator device
                documentX = events.originalEvent.targetTouches[0].pageX;
                documentY = events.originalEvent.targetTouches[0].pageY;
            }

            // create house image
            this.createHouseForAnimation(events);
            this.dragHouse.$el.offset({
                'left': documentX - this.dragHouse.$el.width() / 2,
                'top': documentY
            });
            this.dragHouse.$el.css("opacity",0);
            this.activeMouseEvent(true);
            /*
            if (this.currentHouse) {
                this.currentHouse.updateLayout(pos.SVGItem.STATIC_IMAGE);
            }*/
        },

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
            var xPos = $container.width() - UserHousing.INIT_CUSTOMER_X_RIGHT - this.customerCharacter.$el.width();
            var yPos = $container.height() - UserHousing.INIT_CUSTOMER_Y_BOTTOM - this.customerCharacter.$el.height();
            if (this.coupleCharacter) {
                this.coupleCharacter.$el.css({
                    "left": xPos,
                    "top": yPos
                });
                xPos = xPos - this.coupleCharacter.$el.width() - UserHousing.DISTANCE_CHARACTER;
            }

            this.customerCharacter.$el.css({
                "left": xPos,
                "top": yPos
            });

        },

        //convert the index item in header type with the house type
        getIndexOfHeaderSlideByHouseType: function(houseType) {
            if (houseType === data.HousingData.HOUSE_MORTGAGE) {
                return 0;
            }
            if (houseType === data.HousingData.HOUSE_FULLY_OWNED) {
                return 1;
            }
            if (houseType === data.HousingData.HOUSE_RENTED) {
                return 2;
            }
            if (houseType === data.HousingData.HOUSE_LIVING_WITH_FAMILY) {
                return 3;
            }
            return -1;
        },

        createHouseForAnimation: function (event) {
            var $el = $(event.target);
            var id = $el.closest('.characters-list').index();

            var houseType = "";
            if (id === "0" || id === 0) {
                houseType = data.HousingData.HOUSE_MORTGAGE;
            }
            if (id === "1" || id === 1) {
                houseType = data.HousingData.HOUSE_FULLY_OWNED;
            }
            if (id === "2" || id === 2) {
                houseType = data.HousingData.HOUSE_RENTED;
            }
            if (id === "3" || id === 3) {
                houseType = data.HousingData.HOUSE_LIVING_WITH_FAMILY;
            }

            this.dragHouse = new pos.SVGHousingItem(null, {});
            this.$el.find('.middle-wrapper').append(this.dragHouse.$el);
            this.dragHouse.initialize(houseType);
        },

        startDragCharacter: function (events) {
            var documentX = events.originalEvent.pageX;
            var documentY = events.originalEvent.pageY;
            if (this.options.isMobileWebSimulator) {
                //TODO : why using originalEvent.targetTouches[0]????
                documentX = events.originalEvent.targetTouches[0].pageX;
                documentY = events.originalEvent.targetTouches[0].pageY;
            }

            var characterOffsetX = documentX - this.dragHouse.$el.width() / 2;
            var characterOffsetY = documentY - 50; //50 is arbitrary offset

            //this.log("==characterOffsetX " + characterOffsetX + " / characterOffsetY = " + characterOffsetY);

            //update big lady position
            this.dragHouse.$el.offset({
                "left": characterOffsetX,
                "top": characterOffsetY
            });

             //if the user is dragging the header we must hide the dragDream
            var middleYPos = this.$el.find(".middle").offset().top + 110;
            var isSatisfyPosition = this.dragHouse.$el.offset().top < middleYPos;
            console.log("==isSatisfyPosition " + isSatisfyPosition + " /this.isVisibleDragHouse " + this.isVisibleDragHouse);
            if (isSatisfyPosition && this.isVisibleDragHouse === false) {
                this.dragHouse.$el.css("opacity",0);
            }
            else{
                this.isVisibleDragHouse = true;
                if (this.currentHouse) {
                    this.currentHouse.updateLayout(pos.SVGItem.STATIC_IMAGE);
                }
                this.dragHouse.$el.css("opacity",1);
            }

        },

        endDragCharacter: function () {
            //var self = this;
            this.activeMouseEvent(false);

            var middleYPos = this.$el.find(".middle").offset().top + 110;
            if (this.dragHouse.$el.offset().top < middleYPos && this.isVisibleDragHouse === false) {
                //remove big character
                this.dragHouse.$el.remove();
                this.dragHouse = null;
                this.pageState = UserHousing.STATE_START_CHOOSE_HOUSE;
            } else {
                this.startToCenterAnimation();
            }
        },

        startToCenterAnimation: function () {
            var self = this;
            //get center point
            var pt = this.getHouseInitPosition();

            //animate the current house
            if(this.currentHouse){
                var currentHouseType =  this.currentHouse.getHouseType();
                var temporaryObj = this.currentHouse;
                this.currentHouse.$el.fadeOut(1000, function() {
                    temporaryObj.$el.remove();
                    temporaryObj = null;
                });
                this.hideFormView();
                //enable the previously selected house item in the header
                var index = this.getIndexOfHeaderSlideByHouseType(currentHouseType);
                this.headerComponent.disableItemAtIndex(index, false, true);
            }

            this.dragHouse.$el.animate({
                "left": pt.x,
                "top": pt.y,
            }, 300, "swing", function () {
                setTimeout(function () {
                    self.startToTargetAnimation();
                }, 300);
            });
        },

        startToTargetAnimation: function () {
            var self = this;

            // var x = this.$middle
            var pt = this.getHouseFinalPosition();

            this.dragHouse.$el.animate({
                "left" : pt.x,
                "top": pt.y
            }, 500, "swing", function() {
                self.completeChoosingCharacterAnimation();
            });

        },

        getHouseInitPosition: function(){
            var $wrappper = this.$el.find(".middle-wrapper");

            var target = this.dragHouse;

            var wWidth =  $wrappper.width();
            var wHeight =  $wrappper.height();
            var tWidth =  target.$el.width();
            var tHeight =  target.$el.height();

            var x =  wWidth/2  - tWidth / 2;
            var y =  wHeight/2  - tHeight / 2;

            console.log("UserHousing::getCharInitPosition:", wWidth, wHeight, tWidth, tHeight);

            return {x:x,y:y};
        },

        getHouseFinalPosition: function(){
            var $wrappper = this.$el.find(".middle-wrapper");

            var targetHouse = this.dragHouse;

            //sometimes we are targetting to position the current house
            if(!targetHouse){
                targetHouse  = this.currentHouse;
            }

            var wWidth =  $wrappper.width();
            var wHeight =  $wrappper.height();
            var tWidth =  targetHouse.$el.width();
            var tHeight =  targetHouse.$el.height();

            var x =  wWidth/5  - tWidth / 2;
            //var y =  wHeight/2  - tHeight / 2 - 30;
            var y =  wHeight/2  - tHeight / 2;

            console.log("UserHousing::getHouseFinalPosition:", wWidth, wHeight, tWidth, tHeight);

            return {x:x,y:y};
        },


        completeChoosingCharacterAnimation: function () {
            var self = this;
            //switch to svg animation
            this.currentHouse = this.dragHouse;
            this.currentHouse.updateLayout(pos.SVGItem.SVG_IMAGE);
            this.dragHouse = null;
            this.log("UserHousing::completeChoosingCharacterAnimation:");
            // update state
            this.pageState = UserHousing.STATE_START_CHOOSE_HOUSE;
            // add data and publish event

            this.currentHouse.$el.on(mixin.Swipable.EVENT_SWIPE, function(events, target) {
                self.removeHouse(target);
            });


            this.publishData();
            this.showFormView();
            this.updateLayout();

            //fadout the item with dreamtype in header
            var houseType = this.currentHouse.getHouseType();
            var indexSlide = this.getIndexOfHeaderSlideByHouseType(houseType);
            console.log("==indexSlide " + indexSlide);
            if (indexSlide !== -1) {
                this.headerComponent.disableItemAtIndex(indexSlide, true, true);
            }

        },

        showFormView:function(){

            //only show the perfinent form element
            var housingData =  this.gettingToKnowYouData.getHousing();
            var housingType = housingData.type;
            //alert("showFormView:"+housingType);


            switch(housingType){
                  case   data.HousingData.HOUSE_MORTGAGE:
                    this.$formView.find(".outstanding-mortgage-field").show();
                    this.$formView.find(".monthly-mortgage-payment-field").show();
                    this.$formView.find(".monthly-rental-expenses-field").hide();
                    this.$formView.find(".expenses-select-field").show();
                    this.$formView.find(".income-select-field").show();
                  break;
                  case   data.HousingData.HOUSE_FULLY_OWNED:
                    this.$formView.find(".outstanding-mortgage-field").hide();
                    this.$formView.find(".monthly-mortgage-payment-field").hide();
                    this.$formView.find(".monthly-rental-expenses-field").hide();
                    this.$formView.find(".expenses-select-field").show();
                    this.$formView.find(".income-select-field").show();
                  break;
                  case   data.HousingData.HOUSE_RENTED:
                    this.$formView.find(".outstanding-mortgage-field").hide();
                    this.$formView.find(".monthly-mortgage-payment-field").hide();
                    this.$formView.find(".monthly-rental-expenses-field").show();
                    this.$formView.find(".expenses-select-field").show();
                    this.$formView.find(".income-select-field").show();
                  break;
                  case   data.HousingData.HOUSE_LIVING_WITH_FAMILY:
                    this.$formView.find(".outstanding-mortgage-field").hide();
                    this.$formView.find(".monthly-mortgage-payment-field").hide();
                    this.$formView.find(".monthly-rental-expenses-field").hide();
                    this.$formView.find(".expenses-select-field").show();
                    this.$formView.find(".income-select-field").show();
                  break;
            }

            this.$formView.fadeIn();

        },

        hideFormView:function(){
            this.$formView.fadeOut();
        },


        /**
        * called when inputs in the housing detail view changed
        */
        publishData: function () {
            console.log("UserHousing::publishData after:",this.gettingToKnowYouData);
            var housingType = this.currentHouse.getHouseType();
            var obj = {
                type: housingType,
                income: null,
                expenses: null,
                outstandingMortgage: null,
                monthlyMortgagePayment: null,
                monthlyRentalExpenses: null
            };
            switch(housingType){
                  case   data.HousingData.HOUSE_MORTGAGE:
                   obj.income =  this.incomeSelect.getValue(),
                   obj.expenses = this.expenseSelect.getValue(),
                   obj.outstandingMortgage =  this.outstandingMortgageSelect.getValue(),
                   obj.monthlyMortgagePayment =  this.monthlyMortgagePaymentSelect.getValue()
                  break;
                  case   data.HousingData.HOUSE_FULLY_OWNED:
                   obj.income =  this.incomeSelect.getValue(),
                   obj.expenses = this.expenseSelect.getValue()
                  break;
                  case   data.HousingData.HOUSE_RENTED:
                    obj.income =  this.incomeSelect.getValue(),
                    obj.expenses = this.expenseSelect.getValue(),
                    obj.monthlyRentalExpense =  this.monthlyRentalExpensesSelect.getValue()
                  break;
                  case   data.HousingData.HOUSE_LIVING_WITH_FAMILY:
                    obj.income =  this.incomeSelect.getValue(),
                    obj.expenses = this.expenseSelect.getValue()
                  break;
            }

            this.gettingToKnowYouData.setHousing(obj);
            console.log("UserHousing::publishData after:",this.gettingToKnowYouData);
            this.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_HOUSE);

        },


        removeHouse: function (target) {
            // console.log('--remove house')
            var houseType = target.getHouseType();
            target.$el.fadeOut(300, function () {
                this.remove();
            });
            this.pageState = UserHousing.STATE_START_CHOOSE_HOUSE;
            this.hideFormView();

            this.gettingToKnowYouData.emptyHousing();
            this.gettingToKnowYouData.publish(data.GettingToKnowYouData.EVENT_CHANGE_HOUSE);

            //update the header item again
            var indexSlide = this.getIndexOfHeaderSlideByHouseType(houseType);
            this.headerComponent.disableItemAtIndex(indexSlide, false, true);

        },


        navigationPage: function (isNext) {


            var self = this;
            // animation after move to next page
            // fadeOut icon list
            var index = 0;
            var $icons = this.$el.find('.characters-list');

            this.headerComponent.fadeOutMenuItems(function(){
                if (isNext) {
                    self.$el.trigger(UserHousing.EVENT_NEXT);
                } else {
                    self.$el.trigger(UserHousing.EVENT_PREVIOUS);
                }
            });

        },

        log: function (msg) {
            if (this.options.isDebug) {
                console.log(msg);
            }
        },

        getDocumentHTML: function () {
            var template = app.Templates.getTemplate('user-housing-page');
            return template();
        },

        onRender: function () {
            this.log("==UserHousing onRender ");
            this.initComponent();
            this.bindEvents(true);
        },

        onDestroy: function () {
            this.log("==UserHousing onDestroy ");
            this.bindEvents(false);
        },

        setData: function (dataObj) {
            console.log("UserHousing::setData", dataObj);

            var self = this;

            this.gettingToKnowYouData = dataObj;
            this.housingData =  this.gettingToKnowYouData.getHousing();

            //init customer
            var houseType = this.housingData.type;
            if(houseType){
                this.dragHouse = new pos.SVGHousingItem(null, {});
                this.$el.find('.middle-wrapper').append(this.dragHouse.$el);
                this.dragHouse.initialize(houseType);

                this.updateInputFields();

                this.completeChoosingCharacterAnimation();

                this.headerComponent.hideHintArrow();

                //update the header item
                var indexSlide = self.getIndexOfHeaderSlideByHouseType(houseType);
                if (indexSlide !== -1) {
                    self.headerComponent.disableItemAtIndex(indexSlide, true, false);
                }

            }
            else{
                this.headerComponent.showHintArrow();
            }

        },


        /**
         * update the input fields based on the default data of the the selected character
         */
        updateInputFields:function(){
            var self = this;
            var housingData =  this.gettingToKnowYouData.getHousing();

            console.log("UserHousing::updateInputFields:", housingData);
            self.expenseSelect.setValue(housingData.expenses);
            self.incomeSelect.setValue(housingData.income);
            self.outstandingMortgageSelect.setValue(housingData.outstandingMortgage);
            self.monthlyMortgagePaymentSelect.setValue(housingData.monthlyMortgagePayment);
            self.monthlyRentalExpensesSelect.setValue(housingData.monthlyRentalExpense);
          


        },


        /**
        * update the position of the container when the window resizes
        */
        updateLayout: function(){
            var $container =  this.$el.find(".content-container");
            var $parent = this.$el.find(".middle-wrapper");
            var containerHeight = $container.height();
            var pHeight = $parent.height();

            var pTop = $parent.find(">.title").height();

            var pBottom = $parent.find(".next").height();

            var parentAvaibleHeight =    pHeight  - pTop - pBottom;
            //var offset = 40; //arbitrary
            var offset = 0; //arbitrary
            var toT = (parentAvaibleHeight - containerHeight)/2 + pTop - offset;
            $container.css("top", toT+"px");
            console.log("UserHousing::updateLayout:", containerHeight, pHeight, pTop, pBottom, parentAvaibleHeight, toT);


            //if we have the house displayed change the position of the house
            if(this.currentHouse){
                var pt = this.getHouseFinalPosition();
                console.log("UserHousing::updateLayout:currentHouse->", pt);
                this.currentHouse.$el.css("left",pt.x);
                this.currentHouse.$el.css("top", pt.y);
            }
        }

    };

    var temporaryObj = UserHousing.prototype;
    UserHousing.prototype = Object.create(pos.PageElement.prototype);   $.extend(UserHousing.prototype, temporaryObj);
    page.UserHousing = UserHousing;

}(page, jQuery, app, data, pos, mixin));