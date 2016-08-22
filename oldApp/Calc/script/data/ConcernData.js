/* © 2014 Aleph-labs.com
 * @author Thanh Tran
 */
// namespace
var data = data || {};

(function (data) {
    'use strict';

    function ConcernData() {
        
    }

    ConcernData.VERSION = '3.3.1';

    ConcernData.DEFAULTS = {

    };
    
    ConcernData.CONCERN_DEATH = "death";
	ConcernData.CONCERN_ILLNESS = "illness";
	ConcernData.CONCERN_ACCIDENT = "accident";
	ConcernData.CONCERN_HEALTH_COSTS = "health_costs";
	ConcernData.CONCERN_RETIREMENT = "retirement";
	ConcernData.CONCERN_FUTURE_EXPENSES = "future_expenses";

	ConcernData.FILTER_PROTECTION = "filter_protection";
	ConcernData.FILTER_RETIREMENT = "filter_retirement";
	ConcernData.FILTER_INVESTMENT = "filter_investment";

    ConcernData.CONCERN_RANGE = [
		{
			"id":ConcernData.CONCERN_DEATH,
			"value":ConcernData.CONCERN_DEATH,
			"class": "icon character-icon icon-header-cloud icon-header-cloud-death",
			"label":"WHAT IF I PASS AWAY?",
			"translationPath":"concerns.death",
			"categories":[
				ConcernData.FILTER_PROTECTION
			]
		},
		{
			"id":ConcernData.CONCERN_ILLNESS,
			"value":ConcernData.CONCERN_ILLNESS,
			"class": "icon character-icon icon-header-cloud icon-header-cloud-accident",
			"label":"WHAT IF I FALL SERIUOSLY ILL?",
			"translationPath":"concerns.illness",
			"categories":[
				ConcernData.FILTER_PROTECTION
			]
		},
		{
			"id":ConcernData.CONCERN_ACCIDENT,
			"value":ConcernData.CONCERN_ACCIDENT,
			"class": "icon character-icon icon-header-cloud icon-header-cloud-accident",
			"label":"WHAT IF I HAVE AN ACCIDENT OR MAJOR INJURY?",
			"translationPath":"concerns.accident",
			"categories":[
				ConcernData.FILTER_PROTECTION
			]
		},
		{
			"id":ConcernData.CONCERN_HEALTH_COSTS,
			"value":ConcernData.CONCERN_HEALTH_COSTS,
			"class": "icon character-icon icon-header-cloud icon-header-cloud-healthcare",
			"label":"HOW CAN I COVER EVERYDAY HEALTHCARE COSTS?",
			"translationPath":"concerns.health_costs",
			"categories":[
				ConcernData.FILTER_PROTECTION
			]
		},
		{
			"id":ConcernData.CONCERN_RETIREMENT,
			"value":ConcernData.CONCERN_RETIREMENT,
			"class": "icon character-icon icon-header-cloud icon-header-cloud-retirement",
			"label":"HOW CAN I ENSURE COMFORTABLE RETIREMENT?",
			"translationPath":"concerns.retirement",
			"categories":[
				ConcernData.FILTER_RETIREMENT
			]
		},
		{
			"id":ConcernData.CONCERN_FUTURE_EXPENSES,
			"value":ConcernData.CONCERN_FUTURE_EXPENSES,
			"class": "icon character-icon icon-header-cloud icon-header-cloud-expenses",
			"label":"HOW WILL I COVER FOR FUTURE EXPENSES?",
			"translationPath":"concerns.future_expenses",
			"categories":[
				ConcernData.FILTER_INVESTMENT
			]
		}
	];

	ConcernData._filters = null; 
	ConcernData._filteredRange = ConcernData.CONCERN_RANGE;

	ConcernData.filterRange = function(filters){
		ConcernData._filters = filters;
		if($.isArray(ConcernData._filters)){
			var itemsHash = {};
			var items = [];
			var haystack = ConcernData.CONCERN_RANGE;
			for(var i=0; i<haystack.length; i++){
				var straw = haystack[i];
				var categories = straw.categories;
				var inFilteredItems = ConcernData.itemInFilteredItems(straw);
				if(inFilteredItems){
					if(!itemsHash[straw.id]){
						items.push(straw);
						itemsHash[straw.id] == straw;							
					}
				}							
			}
			ConcernData._filteredRange = items;
		}
		else{
			ConcernData._filteredRange = ConcernData.CONCERN_RANGE;		
		}

		return ConcernData._filteredRange;
	},

	/**
	* check if an item is the current filtered item
	*/
	ConcernData.itemInFilteredItems = function(item){
		var categories = item.categories;
		for(var j=0; j<ConcernData._filters.length; j++){
			var filter = ConcernData._filters[j];
			if($.inArray(filter, categories) > -1){
				return true;
			}
		}	
		return false;	
	},

	ConcernData.getFilteredRange = function(){
		return ConcernData._filteredRange;
	},


	ConcernData.getIndexByType = function(id){
		var items = ConcernData._filteredRange;
		console.log("ConcernData.getIndexByType:", id);
		for(var i=0; i<items.length; i++){
			var item = items[i];
			if(item.id == id){
				return i;
			}
		}
		return -1;
	};

    // exports
    data.ConcernData = ConcernData;
}(data));