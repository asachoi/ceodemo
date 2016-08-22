/* © 2014 Aleph-labs.com
 * @author Phuong Vo
 */
// namespace
var page = page || {};

(function (page, $, Templates, I18nHelper, LanguageMenu) {
    'use strict';

    /**
     * EmotionalFactFinding component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function EmotionalFactFinding(element, options) {
        this.$el = $(element);
        this.el = this.$el[0];
        //
        this.options = $.extend({}, EmotionalFactFinding.DEFAULTS, options);


        window.appData = {
            "getting-to-know-you": {
                "gender": 0,
                "education": 0,
                "maritalStatus": 0,
                "occupation": 0,
                "dependents": [{
                    "educationExpenses": 300,
                    "expensesStartAge": 100,
                    "primary": 0, //0: public, 1: private, 2: overseas
                    "secondary": 0, //0: public, 1: private, 2: overseas
                    "university": 0, //0: public, 1: private, 2: overseas
                    "estimateEducationCost": 100
                }],
                "housing": 0
            }
        };

        I18nHelper.init();
        this.initData();
        this.initComponent();
        this.bindEvents(true);
        this.initDefault();
        this.startApp();

    }

    EmotionalFactFinding.VERSION = '3.3.1';
    EmotionalFactFinding.TAG_PAGE_CONTENT = ".eff-content-page";

    EmotionalFactFinding.DEFAULTS = {
        // no defaults for now
        isDebug: true,
        isStandalone: false
    };

    EmotionalFactFinding.PAGE_INDEX_USER_LANDING = 4;
    EmotionalFactFinding.PAGE_INDEX_GETTING_TO_KNOW_YOU = 0;
    EmotionalFactFinding.PAGE_INDEX_WOULD_YOU_RETIRE = 1;
    EmotionalFactFinding.PAGE_INDEX_LIFE_INSURANCE_PLAN = 2;
    EmotionalFactFinding.PAGE_INDEX_INVESTMENT_GOAL = 3;


    EmotionalFactFinding.PAGE_COMPLETE_PAGE = "page_complete";
    EmotionalFactFinding.PAGE_CANCEL_PAGE = "page_cancel";
    EmotionalFactFinding.PAGE_UPDATE_LANGUAGE = "page_update_language";


    EmotionalFactFinding.prototype = {
        constructor: EmotionalFactFinding,

        $el: null,
        el: null,

        $pageContainer: null,
        pageList: null,

        languageMenu:null,

        //page
        landingPage: null,
        gettingToKnowYou: null,
        retirementPlan: null,
        lifeInsuranePlan: null,
        investmentGoal: null,

        //data
        emotionalFundData: null,

        //for animation management
        widthPage: null,
        $activePage: null,

        bindEvents: function (isActiveEvent) {
            var i = -1;
            if (isActiveEvent) {
                var self = this;

                I18nHelper.eventDispatcher.on(I18nHelper.EVENT_INIT, function(events){
                    self.updateTranslations();
                });
                I18nHelper.eventDispatcher.on(I18nHelper.EVENT_CHANGE, function(events){
                    self.updateTranslations();
                });


                this.landingPage.$el.on(page.UserLandingScreen.EVENT_CHOOSE_ITEM, function (events, index) {
                    self.chosePageHandler(index);
                });

                var completeFunc = function (events, index) {
                    self.pageCompleteHandler(index);
                };
                var cancelFunc = function (events, index) {
                    self.pageCancelHandler(index);
                };
                for (i = 0; i < this.pageList.length; i++) {
                    var pageItem = this.pageList[i];
                    pageItem.$el.on(EmotionalFactFinding.PAGE_COMPLETE_PAGE, completeFunc);
                    pageItem.$el.on(EmotionalFactFinding.PAGE_CANCEL_PAGE, cancelFunc);
                    pageItem.$el.on(EmotionalFactFinding.PAGE_UPDATE_LANGUAGE, function(){
                        self.updateTranslations();
                    });
                }

            } else {
                this.landingPage.$el.off(page.UserLandingScreen.EVENT_CHOOSE_ITEM);

                for (i = 0; i < this.pageList.length; i++) {
                    var pageItem = this.pageList[i];
                    pageItem.$el.off(EmotionalFactFinding.PAGE_COMPLETE_PAGE);
                    pageItem.$el.off(EmotionalFactFinding.PAGE_CANCEL_PAGE);
                }
            }
        },

        initComponent: function () {
            this.languageMenu = new LanguageMenu(null);


            this.landingPage = new page.UserLandingScreen(this.$el.find(EmotionalFactFinding.TAG_PAGE_CONTENT + " .user-landing-screen")[0], {
                "isStandalone": true //can only run standalone as component, if set this variable is true
            });


            var gettingKnowYouHTML = this.$el.find(EmotionalFactFinding.TAG_PAGE_CONTENT + " .getting-to-know-you")[0];
            this.gettingToKnowYou = new page.GettingToKnowYou(gettingKnowYouHTML, {
                "index": 0
            });
            this.gettingToKnowYou.initialize(this.emotionalFundData.getGettingToKnowYouData());

            var retirementPlanHTML = this.$el.find(EmotionalFactFinding.TAG_PAGE_CONTENT + " .retirement-plan")[0];
            this.retirementPlan = new page.retirement.RetirementPlan(retirementPlanHTML, {
                "index": 1,
                "isStandAlone": false
            });
            this.retirementPlan.initialize(this.emotionalFundData);

            //life insurance plan
            var lifeInsuranePlanHTML = this.$el.find(EmotionalFactFinding.TAG_PAGE_CONTENT + " .emotional-life-insurance-plan")[0];
            this.lifeInsuranePlan = new page.insurance.LifeInsurancePlan(lifeInsuranePlanHTML, {
                "index": 2
            });
            this.lifeInsuranePlan.initialize(this.emotionalFundData);

            //investment goal
            var investmentHTML = this.$el.find(EmotionalFactFinding.TAG_PAGE_CONTENT + " .emotional-investment-goal")[0];
            this.investmentGoal = new page.insurance.LifeInsurancePlan(investmentHTML, {
                "index": 3
            });
            this.investmentGoal.initialize(this.emotionalFundData);

            this.pageList = [
                this.gettingToKnowYou,
                this.retirementPlan,
                this.lifeInsuranePlan,
                this.investmentGoal];
        },

        initDefault: function () {
            for (var i = 0; i < this.pageList.length; i++) {
                var pageItem = this.pageList[i];
                pageItem.$el.closest(EmotionalFactFinding.TAG_PAGE_CONTENT).hide();
            }

            this.widthPage = this.$el.find(".eff-content-container").width();
        },

        initData: function () {
            this.emotionalFundData = new data.EmotionalFactFindingData();
        },

        startApp: function () {
            var self = this;
            window.setTimeout(function () {
                self.landingPage.startFadInAnimation();
            }, 1000);
        },

        getPageInstanceByIndex: function (indexPage) {
            var result = null;
            switch (indexPage) {
            case EmotionalFactFinding.PAGE_INDEX_USER_LANDING:
                result = this.landingPage;
                break;
            case EmotionalFactFinding.PAGE_INDEX_GETTING_TO_KNOW_YOU:
                result = this.gettingToKnowYou;
                break;
            case EmotionalFactFinding.PAGE_INDEX_WOULD_YOU_RETIRE:
                result = this.retirementPlan;
                break;
            case EmotionalFactFinding.PAGE_INDEX_LIFE_INSURANCE_PLAN:
                result = this.lifeInsuranePlan;
                break;
            case EmotionalFactFinding.PAGE_INDEX_INVESTMENT_GOAL:
                result = this.investmentGoal;
                break;
            }

            return result;
        },

        //>>>>>>>>>>>>>event handler >>>>>>>>>>>
        chosePageHandler: function (index) {
            console.log("==chosePageHandler " + index);
            var instancePage = this.getPageInstanceByIndex(index);

            if (instancePage) {
                this.animateTo1(instancePage.$el.closest(EmotionalFactFinding.TAG_PAGE_CONTENT), false);
            }
        },

        pageCompleteHandler: function (indexPage) {
            console.log("==complete page " + indexPage);
            /*
			var instancePage = this.getPageInstanceByIndex(EmotionalFactFinding.PAGE_INDEX_USER_LANDING);
			if (instancePage) {
				this.animateTo(instancePage.$el.closest(EmotionalFactFinding.TAG_PAGE_CONTENT), true);
			}
			*/
            //this.returnToRootPage();
            this.returnToRootPage1(indexPage);
        },

        pageCancelHandler: function (indexPage) {
            console.log("==cancel page " + indexPage);
            //this.returnToRootPage();
            this.returnToRootPage1(indexPage);
        },

        pageAnimationComplete: function ($page) {
            console.log("pageAnimationComplete");
            if (this.$activePage) {
                this.$activePage.hide();
            }

            //insert after for navigate back
            //this.landingPage.$el.closest(EmotionalFactFinding.TAG_PAGE_CONTENT).insertAfter($page);
            this.landingPage.$el.closest(EmotionalFactFinding.TAG_PAGE_CONTENT).hide();
            this.$activePage = $page;
        },

        //>>>>>>>>>>>>>> for manage transition animation >>>>>>>>>>
        animateTo: function ($targetPage, isReverse) {
            var self = this;
            //only perform transition
            var initTargetPos = isReverse ? -1 : 1;
            $targetPage.css({
                "top": "0px",
                "left": initTargetPos * this.widthPage + "px"
            });
            $targetPage.show();

            $targetPage.animate({
                "top": "0px",
                "left": "0px"
            }, 500, "swing", function () {
                self.pageAnimationComplete($targetPage);
            });
        },

        animateTo1: function ($targetPage, isReverse) {
            var self = this;

            /*
            //move the rootpage down
            var targetYPos = this.landingPage.$el.height() + 100;
            this.landingPage.$el.animate({
                "top": targetYPos + "px"
            }, {
                duration: 500,
                specialEasing: {
                    "top": "easeOutQuint"
                },
                complete: function () {
                    console.log("===complete animation obj");
                    self.pageAnimationComplete($targetPage);
                }
            });
            */
            this.landingPage.$el.animate({
                "opacity": 0
            }, {
                duration: 500,
                specialEasing: {
                    "top": "easeOutQuint"
                },
                complete: function () {
                    console.log("===complete animation obj");
                    self.pageAnimationComplete($targetPage);
                }
            });


            setTimeout(function () {
                //only perform transition
                //var initTargetPos = isReverse ? -1 : 1;
                $targetPage.removeAttr('style');
                $targetPage.css({
                    "top": "0px",
                    "left": "0px",
                    "opacity": 0
                });

                $targetPage.animate({
                    "opacity": 1
                }, {
                    duration: 5000,
                    specialEasing: {
                        "opacity": "easeOutExpo"
                    },
                    complete: function () {
                        //self.pageAnimationComplete($targetPage);
                    }
                });
            }, 200);
        },

        returnToRootPage: function () {
            var self = this;
            var $pageItem = this.landingPage.$el.closest(EmotionalFactFinding.TAG_PAGE_CONTENT);
            $pageItem.css({
                "top": "0px",
                "left": -this.widthPage + "px"
            });
            $pageItem.show();

            $pageItem.animate({
                "top": "0px",
                "left": "0px"
            }, 500, "swing", function () {
                if (self.$activePage) {
                    self.$activePage.hide();
                }
                self.$activePage = null;
                //$pageItem.insertBefore(self.gettingToKnowYou.$el.closest(EmotionalFactFinding.TAG_PAGE_CONTENT));
            });
        },

        returnToRootPage1: function (index) {
            if (this.$activePage) {
                this.$activePage.stop();
            }

            var self = this;

            //active landing page
            var $pageItem = this.landingPage.$el.closest(EmotionalFactFinding.TAG_PAGE_CONTENT);
            this.landingPage.$el.css({
                "top": "0px",
                "left": "0px",
                "opacity": 0
            });
            this.landingPage.initFirstState();
            $pageItem.show();


            //move the activepage down
            var targetYPos = self.$activePage.height() + 100;
            var temporaryObj = self.$activePage;
            self.$activePage.animate({
                "top": targetYPos + "px"
            }, {
                duration: 500,
                specialEasing: {
                    "top": "easeOutQuint"
                },
                complete: function () {
                    var page = self.pageList[index];
                    page.resetPage();
                    page = null;
                }
            });


            setTimeout(function () {
                //only perform transition
                //var initTargetPos = isReverse ? -1 : 1;
                self.landingPage.$el.animate({
                    "opacity": 1
                }, {
                    duration: 2000,
                    specialEasing: {
                        "opacity": "easeOutExpo"
                    },
                    complete: function () {
                        if (self.$activePage) {
                            self.$activePage.hide();
                        }
                        self.$activePage = null;
                        self.landingPage.startFadInAnimation();
                    }
                });
            }, 200);
        },

        /**
        * Almost all tranlation will be handled by this method.
        * However some pages may implement their own updateTranslations for
        * some instances that this will not work
        */
        updateTranslations:function(){
            console.log("EmotionalFactFinding::updateTranslations:");
            this.$el.find("[data-i18n]").i18n();
        }

      
    };

    // exports
    page.EmotionalFactFinding = EmotionalFactFinding;
}(page, jQuery, app.Templates, app.I18nHelper, pos.LanguageMenu));
/*global FastClick, page*/
FastClick.attach(document.body);
new page.EmotionalFactFinding(".emotional-fact-finding", {});