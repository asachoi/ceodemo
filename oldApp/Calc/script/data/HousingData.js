/* © 2014 Aleph-labs.com
 * @author Thanh Tran
 */
// namespace
var data = data || {};

(function (data, I18nHelper) {
    'use strict';

    function HousingData() {
        this.initDefault();
    }

    HousingData.VERSION = '3.3.1';

    HousingData.DEFAULTS = {

    };

    HousingData.HOUSE_MORTGAGE = "house_mortgage";
    HousingData.HOUSE_FULLY_OWNED = "house_full_owned";
    HousingData.HOUSE_RENTED = "house_rented";
    HousingData.HOUSE_LIVING_WITH_FAMILY = "house_living_with_family";


    HousingData.HOUSING_RANGE = [
        {
            "id": HousingData.HOUSE_MORTGAGE,
            "class": "icon character-icon icon-mortgage",
            "icon": "icon-mortgage",
            "label": "Mortgage",
            "translationPath": "user_housing.mortgage"
        },
        {
            "id": HousingData.HOUSE_FULLY_OWNED,
            "class": "icon character-icon icon-fully-owned",
            "icon":"icon-fully-owned",
            "label": "Fully Owned",
            "translationPath": "user_housing.fully_owned"
            },
        {
            "id":  HousingData.HOUSE_RENTED,
            "class": "icon character-icon icon-rented",
            "icon":"icon-rented",
            "label": "Rented",
            "translationPath": "user_housing.rented"
            },
        {
            "id": HousingData.HOUSE_LIVING_WITH_FAMILY,
            "class": "icon character-icon icon-living-with-family",
            "icon":"icon-living-with-family",
            "label": "Living With Family",
            "translationPath": "user_housing.living_with_family"
        }
    ];


    HousingData.getHousingObj = function(id){
        console.log("CharacterData::getCharacterObj:",id);
        var items = HousingData.HOUSING_RANGE;
        for(var i=0; i<items.length; i++){
            var item = items[i];
            if(item.id == id){
                return item;
            }
        }
        return null;
    };


    HousingData.getTitleByType = function (type) {
        var result = "";

        /*
        switch (type) {
        case HousingData.HOUSE_MORTGAGE:
            result = "Mortgage";
            break;
        case HousingData.HOUSE_FULLY_OWNED:
            result = "Fully owned";
            break;
        case HousingData.HOUSE_RENTED:
            result = "Rented";
            break;
        case HousingData.HOUSE_LIVING_WITH_FAMILY:
            result = "Living with family";
            break;
        }
        */

        var obj = HousingData.getHousingObj(type);
        if(obj){
            result = obj.label;
        }

        return result;
    };

    HousingData.getIconByType = function (type) {
        var result = "";

        /*
        switch (type) {
        case HousingData.HOUSE_MORTGAGE:
            result = "icon-mortgage";
            break;
        case HousingData.HOUSE_FULLY_OWNED:
            result = "icon-fully-owned";
            break;
        case HousingData.HOUSE_RENTED:
            result = "icon-rented";
            break;
        case HousingData.HOUSE_LIVING_WITH_FAMILY:
            result = "icon-living-with-family";
            break;
        }
        */

        var obj = HousingData.getHousingObj(type);
        if(obj){
            result = obj.icon;
        }

        return result;
    };

    //stepper config
    HousingData.getCurencyRange = function () {

        var currency = I18nHelper.t("currency");

        var items = [
            {
                "id": 0,
                "value": "",
                "label": "",
                "translationPath": ""
            },
            {
                "id": 1,
                "value": 1000,
                "label": HousingData.formatNumber(1000),
                "translationPath": ""
            },
            {
                "id": 2,
                "value": 5000,
                "label": HousingData.formatNumber(5000),
                "translationPath": ""
            },
            {
                "id": 3,
                "value": 10000,
                "label": HousingData.formatNumber(10000),
                "translationPath": ""
            },
            {
                "id": 4,
                "value": 20000,
                "label": HousingData.formatNumber(20000),
                "translationPath": ""
            },
            {
                "id": 5,
                "value": 30000,
                "label": HousingData.formatNumber(30000),
                "translationPath": ""
            },
            {
                "id": 6,
                "value": 40000,
                "label": HousingData.formatNumber(40000),
                "translationPath": ""
            },
            {
                "id": 7,
                "value": 50000,
                "label": HousingData.formatNumber(50000),
                "translationPath": ""
            }
        ];
        return items;
    };

    HousingData.getIncomeRange = function () {
        var items = [
            {
                "id": 0,
                "value": "",
                "label": "",
                "translationPath": ""
            },
            {
                "id": 1,
                "value": "<4000",
                "label": "<4000",
                "translationPath": "user_housing.income_range.0.label"
            },
            {
                "id": 2,
                "value": "4000-9999",
                "label": "4000-9999",
                "translationPath": "user_housing.income_range.1.label"
            },
            {
                "id": 3,
                "value": "10000-19999",
                "label": "10000-19999",
                "translationPath": "user_housing.income_range.2.label"
            },
            {
                "id": 4,
                "value": "20000-49999",
                "label": "20000-49999",
                "translationPath": "user_housing.income_range.3.label"
            },
            {
                "id": 5,
                "value": "50000-100000",
                "label": "50000-100000",
                "translationPath": "user_housing.income_range.4.label"
            },
            {
                "id": 6,
                "value": ">100000",
                "label": ">100000",
                "translationPath": "user_housing.income_range.5.label"
            }
        ];
        return items;
    };

     HousingData._outstandingMortgageRange = null;
     HousingData.getOutstandingMortgageRange = function () {

        if(HousingData._outstandingMortgageRange == null){

             var currency = I18nHelper.t("currency");
             var startAmount = 100000;
             var maxAmount = 99999999;
             var increment = 100000;
             var iAmount = startAmount;
             var iAmountFmt = HousingData.formatNumber(iAmount);

             var items = [];
             for(var i=0; iAmount<maxAmount; i++){
                 var item = {
                     "id": i,
                     "value": iAmount,
                     "label": iAmountFmt,
                     "translationPath": "",
                     "translationOptions":""
                 }
                 items.push(item);

                 iAmount=iAmount+increment;
                 iAmountFmt=HousingData.formatNumber(iAmount);
             }

             HousingData._outstandingMortgageRange = items;
        }

        return HousingData._outstandingMortgageRange;
    };


    HousingData._monthlyRentalExpensesRange = null;
    HousingData.getMonthlyRentalExpensesRange = function () {

        if(HousingData._monthlyRentalExpensesRange == null){

            var currency = I18nHelper.t("currency");
            var startAmount = 500;
            var maxAmount = 999999;
            var increment = 500;
            var iAmount = startAmount;
            var iAmountFmt = HousingData.formatNumber(iAmount);

            var items = [];
            for(var i=0; iAmount<maxAmount; i++){
                var item = {
                    "id": i,
                    "value": iAmount,
                    "label": iAmountFmt,
                    "translationPath": "",
                    "translationOptions":""
                }
                items.push(item);

                iAmount=iAmount+increment;
                iAmountFmt=HousingData.formatNumber(iAmount);
            }

            HousingData._monthlyRentalExpensesRange = items;
        }

        return HousingData._monthlyRentalExpensesRange;

    };

    HousingData._monthlyExpensesRange = null;
    HousingData.getMonthlyExpensesRange = function () {

        if(HousingData._monthlyExpensesRange == null){
            var currency = I18nHelper.t("currency");
            var startAmount = 5000;
            var maxAmount = 9999999;
            var increment = 5000;
            var iAmount = startAmount;
            var iAmountFmt = HousingData.formatNumber(iAmount);

            var items = [];
            for(var i=0; iAmount<maxAmount; i++){
                var item = {
                    "id": i,
                    "value": iAmount,
                    "label": iAmountFmt,
                    "translationPath": "",
                    "translationOptions":""
                }
                items.push(item);

                iAmount=iAmount+increment;
                iAmountFmt=HousingData.formatNumber(iAmount);
            }

             HousingData._monthlyExpensesRange = items;

        }
        return HousingData._monthlyExpensesRange;
    };



    HousingData.formatNumber = function(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    };


    // exports
    data.HousingData = HousingData;
}(data, app.I18nHelper));