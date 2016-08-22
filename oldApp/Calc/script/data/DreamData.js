/* © 2014 Aleph-labs.com
 * @author Thanh Tran
 */
// namespace
var data = data || {};

(function (data) {
    'use strict';

    function DreamData() {
        this.initDefault();
    }

    DreamData.VERSION = '3.3.1';

    DreamData.DEFAULTS = {

    };

    DreamData.DREAM_BUYING_A_HOUSE = "buying_a_house";
    DreamData.DREAM_GETTING_MARRIED = "getting_married";
    DreamData.DREAM_HAVING_A_BABY = "having_a_baby";
    DreamData.DREAM_PLAN_FOR_EDUCATION = "plan_for_education";
    DreamData.DREAM_BUYING_A_NEW_CAR = "buy_a_new_car";
    DreamData.DREAM_PLAN_FOR_VACATION = "plan_for_vacation";
    DreamData.DREAM_EARLY_RETIREMENT = "early_retirement";


    DreamData.DREAM_RANGE = [
        {
            "id": "buying_a_house",
            "class": "icon character-icon icon-buying-a-house",
            "icon":"icon-buying-a-house",
            "label": "BUYING A HOUSE",
            "translationPath": "dreams.buying_a_house.title"
        },
        {
            "id": "getting_married",
            "class": "icon character-icon icon-getting-married",
            "icon":"icon-getting-married",
            "label": "GETTING MARRIED",
            "translationPath": "dreams.getting_married.title"
        },
        {
            "id": "having_a_baby",
            "class": "icon character-icon icon-having-a-baby",
            "icon":"icon-having-a-baby",
            "label": "HAVING A BABY",
            "translationPath": "dreams.having_a_baby.title"
        },
        {
            "id": "plan_for_education",
            "class": "icon character-icon icon-plan-for-education",
            "icon":"icon-plan-for-education",
            "label": "PLAN FOR EDUCATION",
            "translationPath": "dreams.plan_for_education.title"
        },
        {
            "id": "buy_a_new_car",
            "class": "icon character-icon icon-buying-a-car",
            "icon":"icon-buying-a-car",
            "label": "BUYING A NEW CAR",
            "translationPath": "dreams.buy_a_new_car.title"
        },
        {
            "id": "plan_for_vacation",
            "class": "icon character-icon icon-going-on-holiday",
            "icon":"icon-going-on-holiday",
            "label": "PLAN FOR VACATION",
            "translationPath": "dreams.plan_for_vacation.title"
        },
         {
            "id": "early_retirement",
            "class": "icon character-icon icon-early-retirement",
            "icon":"icon-early-retirement",
            "label": "EARLY RETIREMENT",
            "translationPath": "dreams.early_retirement.title"
        }
    ];


    DreamData.getDreamObjByType = function (type) {
        var items = DreamData.DREAM_RANGE;
        for(var i=0; i<items.length; i++){
            var item = items[i];
            if(item.id == type){
                return item;
            }
        }
        return null;
    };

    DreamData.getTitleByType = function (type) {
        var result = "Unidentified";
        var item = DreamData.getDreamObjByType(type);
        if(item){
            result = item.label;
        }
        return result;
    };

    DreamData.getTranslationPathByType = function (type) {
        var result = "";
        var item = DreamData.getDreamObjByType(type);
        if(item){
            result = item.translationPath;
        }
        return result;
    };


    DreamData.getIconByType = function (type) {
        var result = "";
        /*
        switch (type) {
            case DreamData.DREAM_BUYING_A_HOUSE:
                result = "icon-buying-a-house";
                break;
            case DreamData.DREAM_GETTING_MARRIED:
                result = "icon-getting-married";
                break;
            case DreamData.DREAM_HAVING_A_BABY:
                result = "icon-having-a-baby";
                break;
            case DreamData.DREAM_PLAN_FOR_EDUCATION:
                result = "icon-plan-for-education";
                break;
            case DreamData.DREAM_BUYING_A_NEW_CAR:
                result = "icon-buying-a-car";
                break;
            case DreamData.DREAM_PLAN_FOR_VACATION:
                result = "icon-going-on-holiday";
                break;
            case DreamData.DREAM_EARLY_RETIREMENT:
                result = "icon-early-retirement";
                break;
        }*/
        var item = DreamData.getDreamObjByType(type);
        if(item){
            result = item.icon;
        }
        return result;
    };

    //stepper config
    DreamData.DREAM_BUYING_A_HOUSE_IMAGES = [
        "../images/emotional/dreams/items_dreams_house_paid_public_apartment.png",
        "../images/emotional/dreams/items_dreams_house_first_time_buyer.png",
        "../images/emotional/dreams/items_dreams_house_upgrade.png",
        "../images/emotional/dreams/items_dreams_house_deluxe.png",
        "../images/emotional/dreams/items_dreams_house_luxury.png"
    ],
    DreamData.DREAM_GETTING_MARRIED_IMAGES = [
        "../images/emotional/dreams/items_dreams_wedding_budget.png",
        "../images/emotional/dreams/items_dreams_wedding_standard.png",
        "../images/emotional/dreams/items_dreams_wedding_standard_honeymoon.png",
        "../images/emotional/dreams/items_dreams_wedding_dream.png",
        "../images/emotional/dreams/items_dreams_wedding_luxury.png"
    ],
    DreamData.DREAM_HAVING_A_BABY_IMAGES = [
        "../images/emotional/dreams/items_dreams_having_baby_government.png",
        "../images/emotional/dreams/items_dreams_having_baby_private.png",
        "../images/emotional/dreams/items_dreams_having_baby_overseas.png"
    ],
    DreamData.DREAM_PLAN_FOR_EDUCATION_IMAGES = [
        "../images/emotional/dreams/items_dreams_collage_local.png",
        "../images/emotional/dreams/items_dreams_college_overseas.png",
        "../images/emotional/dreams/items_dreams_university_local.png",
        "../images/emotional/dreams/items_dreams_university_overseas.png"
    ],
    DreamData.DREAM_BUYING_A_NEW_CAR_IMAGES = [
        "../images/emotional/dreams/items_dreams_car_micro.png",
        "../images/emotional/dreams/items_dreams_car_family.png",
        "../images/emotional/dreams/items_dreams_car_large_family.png",
        "../images/emotional/dreams/items_dreams_car_mid_luxury.png",
        "../images/emotional/dreams/items_dreams_car_luxury.png",
        "../images/emotional/dreams/items_dreams_car_super_car.png"
    ],
    DreamData.DREAM_PLAN_FOR_VACATION_IMAGES = [
        "../images/emotional/dreams/items_dreams_vacation_for_2_asia.png",
        "../images/emotional/dreams/items_dreams_vacation_luxury_asia.png",
        "../images/emotional/dreams/items_dreams_vacation_long_haul_for_2.png",
        "../images/emotional/dreams/items_dreams_vacation_luxury_long_haul.png"
    ],
    DreamData.DREAM_EARLY_RETIREMENT_IMAGES = [
        "../images/emotional/dreams/items_dreams_retirement_basic.png",
        "../images/emotional/dreams/items_dreams_retirement_moderate.png",
        "../images/emotional/dreams/items_dreams_retirement_care_free.png",
        "../images/emotional/dreams/items_dreams_retirement_luxury.png"
    ],

    DreamData.DREAM_BUYING_A_HOUSE_SELECTION = [
        {
            "id":1,
            "value":0,
            "label":"PAID PUBLIC APARTMENT<br/><b><3,000,000</b>",
            "translationPath":"[html]dreams.buying_a_house.options.paid_public_apartment"
        },
        {
            "id":2,
            "value":1,
            "label":"FIRST TIME BUYER<br/><b>3,000,000-4,500,000</b>",
            "translationPath":"[html]dreams.buying_a_house.options.first_time_buyer"
        },
        {
            "id":3,
            "value":2,
            "label":"UPGRADE<br/><b>5,000,000-9,000,000</b>",
            "translationPath":"[html]dreams.buying_a_house.options.upgrade"
        },
        {
            "id":4,
            "value":3,
            "label":"DELUXE<br/><b>9,000,000-20,000,000</b>",
            "translationPath":"[html]dreams.buying_a_house.options.deluxe"
        },
        {
            "id":5,
            "value":4,
            "label":"LUXURY<br/><b>>20,000,000</b>",
            "translationPath":"[html]dreams.buying_a_house.options.luxury"
        }
    ],

    DreamData.DREAM_GETTING_MARRIED_SELECTION = [
        {
            "id":1,
            "value":0,
            "label":"BUDGET<br/><b><150,000</b>",
            "translationPath":"[html]dreams.getting_married.options.budget"
        },
        {
            "id":2,
            "value":1,
            "label":"STANDARD<br/><b>150,000-250,000</b>",
            "translationPath":"[html]dreams.getting_married.options.standard"
        },
        {
            "id":3,
            "value":2,
            "label":"STANDARD WITH HONEYMOON<br/><b>250,000-350,000</b>",
            "translationPath":"[html]dreams.getting_married.options.standard_with_honeymoon"
        },
        {
            "id":4,
            "value":3,
            "label":"LUXURY<br/><b>350,000-500,000</b>",
            "translationPath":"[html]dreams.getting_married.options.luxury"
        },
        {
            "id":5,
            "value":4,
            "label":"DREAM<br/><b>&gt;500,000</b>",
            "translationPath":"[html]dreams.getting_married.options.dream"
        }
    ],

    DreamData.DREAM_HAVING_A_BABY_SELECTION = [
        {
            "id":1,
            "value":0,
            "label":"GOV. HOSPITAL PRIVATE WARD<br/><b><50,000</b>",
            "translationPath":"[html]dreams.having_a_baby.options.government_hospital"
        },
        {
            "id":2,
            "value":1,
            "label":"PRIVATE HOSPITAL<br/><b>50,000-500,000</b>",
            "translationPath":"[html]dreams.having_a_baby.options.private_hospital"
        },
        {
            "id":3,
            "value":2,
            "label":"OVERSEAS DELIVERY<br/><b>&gt;500,000</b>",
            "translationPath":"[html]dreams.having_a_baby.options.overseas_delivery"
        }
    ],

    DreamData.DREAM_PLAN_FOR_EDUCATION_SELECTION = [
        {
            "id":1,
            "value":0,
            "label":"LOCAL PRIVATE COLLEGE SCHOOL<br/><b>300,000-1,000,000</b>",
            "translationPath":"[html]dreams.plan_for_education.options.local_private_college"
        },{
            "id":2,
            "value":1,
            "label":"LOCAL UNIVERSITY<br/><b>300,000-1,000,000</b>",
            "translationPath":"[html]dreams.plan_for_education.options.local_university"
        },{
            "id":3,
            "value":2,
            "label":"OVERSEAS COLLEGE SCHOOL WITH EXPENSES<br/><b>&gt;1,000,000</b>",
            "translationPath":"[html]dreams.plan_for_education.options.overseas_college"
        }, {
            "id":4,
            "value":3,
            "label":"OVERSEAS UNIVERSITY WITH EXPENSES<br/><b>&gt;1,000,000</b>",
            "translationPath":"[html]dreams.plan_for_education.options.overseas_university"
        }
    ],

    DreamData.DREAM_BUYING_A_NEW_CAR_SELECTION = [
        {
            "id":1,
            "value":0,
            "label":"MICROCAR<br/><b><200,000</b>",
            "translationPath":"[html]dreams.buy_a_new_car.options.microcar"
        },
        {
            "id":2,
            "value":1,
            "label":"SMALL FAMILY<br/><b>200,000-300,000</b>",
            "translationPath":"[html]dreams.buy_a_new_car.options.small_family"
        },
        {
            "id":3,
            "value":2,
            "label":"LARGE FAMILY<br/><b>300,000-450,000</b>",
            "translationPath":"[html]dreams.buy_a_new_car.options.large_family"
        },
        {
            "id":3,
            "value":2,
            "label":"MID LUXURY<br/><b>450,000-900,000</b>",
            "translationPath":"[html]dreams.buy_a_new_car.options.mid_luxury"
        },
        {
            "id":4,
            "value":3,
            "label":"LUXURY<br/><b>900,000-2,000,000</b>",
            "translationPath":"[html]dreams.buy_a_new_car.options.luxury"
        },
        {
            "id":5,
            "value":4,
            "label":"SUPERCAR<br/><b>&gt;2,000,000</b>",
            "translationPath":"[html]dreams.buy_a_new_car.options.supercar"
        }
    ],

    DreamData.DREAM_PLAN_FOR_VACATION_SELECTION = [
        {
            "id":1,
            "value":0,
            "label":"SHORT HAUL HOLIDAY<br/><b>10,000-25,000</b>",
            "translationPath":"[html]dreams.plan_for_vacation.options.asia_tour_for_two"
        },
        {
            "id":2,
            "value":1,
            "label":"LUXURY SHORT HAUL HOLIDAY<br/><b>&gt;25,000</b>",
            "translationPath":"[html]dreams.plan_for_vacation.options.asia_luxury_tour"
        },
        {
            "id":3,
            "value":2,
            "label":"LONG HAUL<br/><b>50,000-100,000</b>",
            "translationPath":"[html]dreams.plan_for_vacation.options.long_haul_tour_for_two"
        },
        {
            "id":4,
            "value":3,
            "label":"LUXURY LONG HAUL HOLIDAY<br/><b>&gt;100,000</b>",
            "translationPath":"[html]dreams.plan_for_vacation.options.luxury_long_haul_tour"
        }
    ],

    DreamData.DREAM_EARLY_RETIREMENT_SELECTION = [
        {
            "id":1,
            "value":0,
            "label":"BASIC<br/><b>&lt;5,000,000</b>",
            "translationPath":"[html]dreams.early_retirement.options.basic"
        },
        {
            "id":2,
            "value":1,
            "label":"MODERATE<br/><b>5,000,000-12,000,000</b>",
            "translationPath":"[html]dreams.early_retirement.options.moderate"
        },
        {
            "id":3,
            "value":2,
            "label":"CARE FREE<br/><b>12,000,000-20,000,000</b>",
            "translationPath":"[html]dreams.early_retirement.options.care_free"
        },
        {
            "id":4,
            "value":3,
            "label":"LUXURY<br/><b>&gt;20,000,000</b>",
            "translationPath":"[html]dreams.early_retirement.options.luxury"
        }
    ],

    DreamData.getImagesByDreamType = function(dreamType) {
        var items = [];
        switch(dreamType){
            case DreamData.DREAM_BUYING_A_HOUSE:
                items = DreamData.DREAM_BUYING_A_HOUSE_IMAGES;
            break;
            case DreamData.DREAM_GETTING_MARRIED:
                items = DreamData.DREAM_GETTING_MARRIED_IMAGES;
            break;
            case DreamData.DREAM_HAVING_A_BABY:
                items = DreamData.DREAM_HAVING_A_BABY_IMAGES;
            break;
            case DreamData.DREAM_PLAN_FOR_EDUCATION:
                items = DreamData.DREAM_PLAN_FOR_EDUCATION_IMAGES;
            break;
            case DreamData.DREAM_BUYING_A_NEW_CAR:
                items = DreamData.DREAM_BUYING_A_NEW_CAR_IMAGES;
            break;
            case DreamData.DREAM_PLAN_FOR_VACATION:
                items = DreamData.DREAM_PLAN_FOR_VACATION_IMAGES;
            break;
            case DreamData.DREAM_EARLY_RETIREMENT:
                items = DreamData.DREAM_EARLY_RETIREMENT_IMAGES;
            break;
        }
        return items;
    };

    DreamData.getSelectionByDreamType = function (dreamType) {
        var items = [];
        switch(dreamType){
            case DreamData.DREAM_BUYING_A_HOUSE:
                items = DreamData.DREAM_BUYING_A_HOUSE_SELECTION;
            break;
            case DreamData.DREAM_GETTING_MARRIED:
                items = DreamData.DREAM_GETTING_MARRIED_SELECTION;
            break;
            case DreamData.DREAM_HAVING_A_BABY:
                items = DreamData.DREAM_HAVING_A_BABY_SELECTION;
            break;
            case DreamData.DREAM_PLAN_FOR_EDUCATION:
                items = DreamData.DREAM_PLAN_FOR_EDUCATION_SELECTION;
            break;
            case DreamData.DREAM_BUYING_A_NEW_CAR:
                items = DreamData.DREAM_BUYING_A_NEW_CAR_SELECTION;
            break;
            case DreamData.DREAM_PLAN_FOR_VACATION:
                items = DreamData.DREAM_PLAN_FOR_VACATION_SELECTION;
            break;
            case DreamData.DREAM_EARLY_RETIREMENT:
                items = DreamData.DREAM_EARLY_RETIREMENT_SELECTION;
            break;
        }
        return items;
    };

    DreamData.prototype = {
        dreamType: null,
        index: 0,

        initDefault: function() {

        },

        setDreamType: function(type) {
            this.dreamType = type;
        },

        getDreamType: function() {
            return this.dreamType;
        },

        setIndex: function(index) {
            this.index = index;
        },

        getIndex: function() {
            return this.index;
        }
    };

    // exports
    data.DreamData = DreamData;
}(data));