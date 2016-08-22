//JSHint options for code-analysis engine
/* jshint debug: true,  devel: true, browser: true, node: true, jquery: true, strict: true*/

var page = page || {};
var pos = pos || {};
var data = data || {};

(function (page, $, Templates, CssCheckBox) {
	'use strict';

	/**
	 * GTKYSummaryPage component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function GTKYSummaryPage(element, options) {
		this.initialize(element, options);
	}

	GTKYSummaryPage.VERSION = '3.3.1';

	GTKYSummaryPage.EVENT_NEXT = "event_next";
	GTKYSummaryPage.EVENT_PREVIOUS = "event_previous";

	GTKYSummaryPage.DEFAULTS = {
		// no defaults for now
		isDebug: true,
		isStandalone: false,
		isMobileWebSimulator: false
	};

	GTKYSummaryPage.CAR_LIST =[{
			"image": "../images/emotional/dreams/card/items_dreams_car_micro.png",
			"title": "MICRO CAR",
			"translationPath": "dreams.buy_a_new_car.options_summary.microcar"
		}, {
			"image": "../images/emotional/dreams/card/items_dreams_car_family.png",
			"title": "SMALL FAMILY",
			"translationPath": "dreams.buy_a_new_car.options_summary.small_family"
		}, {
			"image": "../images/emotional/dreams/card/items_dreams_car_large_family.png",
			"title": "LARGE FAMILY",
			"translationPath": "dreams.buy_a_new_car.options_summary.large_family"
		}, {
			"image": "../images/emotional/dreams/card/items_dreams_car_mid_luxury.png",
			"title": "MID LUXURY",
			"translationPath": "dreams.buy_a_new_car.options_summary.mid_luxury"
		}, {
			"image": "../images/emotional/dreams/card/items_dreams_car_luxury.png",
			"title": "LUXURY",
			"translationPath": "dreams.buy_a_new_car.options_summary.luxury"
		}, {
			"image": "../images/emotional/dreams/card/items_dreams_car_super_car.png",
			"title": "SUPERCAR",
			"translationPath": "dreams.buy_a_new_car.options_summary.supercar"
		}
	];

	GTKYSummaryPage.EDUCATION_LIST =[{
			"image": "../images/emotional/dreams/card/items_dreams_collage_local.png",
			"title": "PRIVATE COLLEGE",
			"translationPath": "dreams.plan_for_education.options_summary.local_private_college"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_university_local.png",
			"title": "LOCAL UNIVERSITY",
			"translationPath": "dreams.plan_for_education.options_summary.overseas_college"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_college_overseas.png",
			"title": "OVERSEAS COLLEGE",
			"translationPath": "dreams.plan_for_education.options_summary.local_university"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_university_overseas.png",
			"title": "OVERSEAS UNIVERSITY",
			"translationPath": "dreams.plan_for_education.options_summary.overseas_university"
		}
	];

	GTKYSummaryPage.BABY_LIST =[{
			"image": "../images/emotional/dreams/card/items_dreams_having_baby_government.png",
			"title": "GOV. HOSPITAL PRIVATE WARD",
			"translationPath": "dreams.having_a_baby.options_summary.government_hospital"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_having_baby_private.png",
			"title": "PRIVATE HOSPITAL",
			"translationPath": "dreams.having_a_baby.options_summary.private_hospital"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_having_baby_overseas.png",
			"title": "OVERSEAS DELIVERY",
			"translationPath": "dreams.having_a_baby.options_summary.overseas_delivery"
		}
	];

	GTKYSummaryPage.HOUSE_LIST =[{
			"image": "../images/emotional/dreams/card/items_dreams_house_paid_public_apartment.png",
			"title": "PAID PUBLIC APARTMENT",
			"translationPath": "dreams.buying_a_house.options_summary.paid_public_apartment"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_house_first_time_buyer.png",
			"title": "FIRST TIME BUYER",
			"translationPath": "dreams.buying_a_house.options_summary.first_time_buyer"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_house_upgrade.png",
			"title": "UPGRADE HOUSE",
			"translationPath": "dreams.buying_a_house.options_summary.upgrade"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_house_deluxe.png",
			"title": "DELUXE HOUSE",
			"translationPath": "dreams.buying_a_house.options_summary.deluxe"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_house_luxury.png",
			"title": "LUXURY HOUSE",
			"translationPath": "dreams.buying_a_house.options_summary.luxury"
		}
	];
	GTKYSummaryPage.RETIREMENT_LIST =[{
			"image": "../images/emotional/dreams/card/items_dreams_retirement_basic.png",
			"title": "BASIC RETIREMENT",
			"translationPath": "dreams.early_retirement.options_summary.basic"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_retirement_moderate.png",
			"title": "MODERATE RETIREMENT",
			"translationPath": "dreams.early_retirement.options_summary.moderate"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_retirement_care_free.png",
			"title": "CARE FREE RETIREMENT",
			"translationPath": "dreams.early_retirement.options_summary.care_free"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_retirement_luxury.png",
			"title": "LUXURY RETIREMENT",
			"translationPath": "dreams.early_retirement.options_summary.luxury"
		}
	];
	GTKYSummaryPage.VACATION_LIST =[{
			"image": "../images/emotional/dreams/card/items_dreams_vacation_for_2_asia.png",
			"title": "SHORT HAUL HOLIDAY",
			"translationPath": "dreams.plan_for_vacation.options_summary.asia_tour_for_two"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_vacation_luxury_asia.png",
			"title": "LUXURY SHORT HAUL HOLIDAY",
			"translationPath": "dreams.plan_for_vacation.options_summary.asia_luxury_tour"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_vacation_long_haul_for_2.png",
			"title": "LONG HAUL HOLIDAY",
			"translationPath": "dreams.plan_for_vacation.options_summary.long_haul_tour_for_two"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_vacation_luxury_long_haul.png",
			"title": "LUXURY LONG HAUL HOLIDAY",
			"translationPath": "dreams.plan_for_vacation.options_summary.luxury_long_haul_tour"
		}
	];
	GTKYSummaryPage.WEDDING_LIST =[{
			"image": "../images/emotional/dreams/card/items_dreams_wedding_budget.png",
			"title": "BUDGET WEDDING",
			"translationPath": "dreams.getting_married.options_summary.budget"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_wedding_standard.png",
			"title": "STANDARD WEDDING",
			"translationPath": "dreams.getting_married.options_summary.standard"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_wedding_standard_honeymoon.png",
			"title": "STANDARD WITH HONEYMOON",
			"translationPath": "dreams.getting_married.options_summary.standard_with_honeymoon"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_wedding_luxury.png",
			"title": "LUXURY WEDDING",
			"translationPath": "dreams.getting_married.options_summary.luxury"
		},{
			"image": "../images/emotional/dreams/card/items_dreams_wedding_dream.png",
			"title": "DREAM WEDDING",
			"translationPath": "dreams.getting_married.options_summary.dream"
		},
	];



	GTKYSummaryPage.prototype = {
		constructor: GTKYSummaryPage,

		$el: null,
		el: null,

		characterListView: null,


		initialize: function (element, options) {
			if (element) {
				this.$el = $(element);
			} else {
				this.$el = $(this.getDocumentHTML());
			}
			this.el = this.$el[0];
			this.options = $.extend({}, GTKYSummaryPage.DEFAULTS, options);

			this.bindEvents(true);
		},


		/**
		 * bind event
		 * @param  {Boolean} isActiveEvent [description]
		 * @return {[type]}                [description]
		 */
		bindEvents: function(isActiveEvent) {
			var self = this;
			console.log("===isActiveEvent " + isActiveEvent);
			if (isActiveEvent) {

				//for next-previous button
				this.$el.find(".control-container .next").on("click", function() {
					self.navigationPage(true);
				});
				this.$el.find(".control-container .previous").on("click", function() {
					self.navigationPage(false);
				});

				/*
				//update the layout of the container when window resizes
                $(window).resize(function(){
                    self.updateLayout();
                });
                this.updateLayout();
				*/
			} else {
				this.$el.find(".control-container .next").off("click");
				this.$el.find(".control-container .previous").off("click");
			}
		},

		getDocumentHTML: function () {
			// jshint multistr:true
			var template = Templates.getTemplate('user-summary-page');
			return template();
			// jshint multistr:false
		},

		setFakeDataForTest: function() {
			this.gettingToKnowYouData = new data.GettingToKnowYouData();
			this.gettingToKnowYouData.setAge(40);
			this.gettingToKnowYouData.setGender(data.CharacterData.MALE);
			this.gettingToKnowYouData.setMaritalStatus(data.ConfigData.MARITAL_SINGLE);

			this.gettingToKnowYouData.setHousing({
				type: data.HousingData.HOUSE_MORTGAGE,
				income: null,
				expenses: null,
				outstandingMortgage: null,
				monthlyMortgagePayment: null,
				monthlyRentalExpenses: null
			});
		},

		navigationPage: function(isNext) {
			var self = this;
			setTimeout(function() {
				if (isNext) {
					self.$el.trigger(GTKYSummaryPage.EVENT_NEXT);
				} else {
					self.$el.trigger(GTKYSummaryPage.EVENT_PREVIOUS);
				}
			}, 200);

		},

		setData: function (gettingToKnowYouData) {
			this.gettingToKnowYouData = gettingToKnowYouData;
			//this.setFakeDataForTest();
			//get housing
			var userHouseData = this.gettingToKnowYouData.getHousing();
			this.userHouse = new pos.SVGHousingItem(null, {});
			this.$el.find('.house-content').append(this.userHouse.$el);
			this.userHouse.initialize(userHouseData.type);

			//get family
			this.addUserAndDependent(this.gettingToKnowYouData);

			//get dreams
			this.addDream(this.gettingToKnowYouData);

			//life stage
			this.addLifeStage();

			//get needs
			this.addNeeds();

			//get personal protection
			this.addPersonalProtection();
		},

		addUserAndDependent: function(gettingToKnowYouData) {
			this.characterListView = [];
			var age = gettingToKnowYouData.getAge();
			var occupation = gettingToKnowYouData.getOccupation();
			var customerGender = gettingToKnowYouData.getGender();
			var isMarried =data.ConfigData.isMarried(gettingToKnowYouData.getMaritalStatus());

			this.customer = new pos.CharacterAge(null, {
				"gender": customerGender,
				"ageMin" : 1,
				"ageMax" : 80,
				"initAge" : age,
				"occupation": occupation,
				'widthMax': null,
				'heightMax': null,
				"isActiveEvent": false
			});
			this.customer.initialize();
			//this.$el.find('.user-dependent-view').append(this.customer.$el);
			this.characterListView.push(this.customer);

			if (isMarried) {
				var customerIdentification = data.CharacterData.getIdentificationByAge(this.gettingToKnowYouData.getAge(), this.gettingToKnowYouData.getGender());
				var coupleIdentification = data.CharacterData.getAnotherCoupleByIndentification(customerIdentification);
				var coupleGender = data.CharacterData.getGenderByIdentification(coupleIdentification);
				this.couple = new pos.CharacterAge(null, {
					"gender": coupleGender,
					"ageMin" : 1,
					"ageMax" : 80,
					"initAge" : this.gettingToKnowYouData.getAge(),
					'widthMax': null,
					'heightMax': null,
					"isActiveEvent": false
				});
				//this.$el.find(".user-dependent-view").append(this.couple.$el);
				this.couple.initialize();
				this.characterListView.unshift(this.couple);
			}

			var dependentData = null;
			var characterObj = null;
			var i = -1;
			//children and dependent list
			var listChildren = this.gettingToKnowYouData.getChildrens();
			for (i = 0; i < listChildren.length; i++) {
				dependentData = listChildren[i];
				characterObj = this.initBigCharacterByIdentification(dependentData.getIdentification(), dependentData.getAge());
				//this.$el.find(".user-dependent-view").append(characterObj.$el);
				characterObj.initialize();

				//push to selected event list and make consistent with the normal flow
				//pay attention on no_view_detail
				this.characterListView.unshift(characterObj);
			}

			var listDependent = this.gettingToKnowYouData.getDependents();
			for (i = 0; i < listDependent.length; i++) {
				dependentData = listDependent[i];
				characterObj = this.initBigCharacterByIdentification(dependentData.getIdentification(), dependentData.getAge());
				//this.$el.find(".user-dependent-view").append(characterObj.$el);
				characterObj.initialize();

				//push to selected event list and make consistent with the normal flow
				//pay attention on no_view_detail
				this.characterListView.push(characterObj);
			}

			//add all character inside listview into stage
			for (i = 0; i < this.characterListView.length; i++) {
				var characterView = this.characterListView[i];
				this.$el.find(".user-dependent-view").append(characterView.$el);
			}

			//center the character list
			var wWrapper = this.$el.find(".user-dependents-area").width();
			var characterContainer = this.$el.find(".user-dependent-view");
			var wCharacterContainer = characterContainer.width();
			var centerPoint = wWrapper / 2.0 - wCharacterContainer / 2.0;

			characterContainer.css({
				left: centerPoint
			});
		},

		initBigCharacterByIdentification: function(characterIndetification, age) {
			var gender = data.CharacterData.MALE;

			gender = data.CharacterData.getGenderByIdentification(characterIndetification);
			var initAge = data.CharacterData.getDefaultAgeByIndentification(characterIndetification);

			initAge = age ? age : initAge;

			return new pos.CharacterAge(null, {
				"gender": gender,
				"ageMin" : 1,
				"ageMax" : 99,
				"initAge" : initAge,
				'widthMax': null,
				'heightMax': null,
				"isActiveEvent": false
			});
		},

		addDream: function(gettingToKnowYouData) {
			//get columns and column template
			var dreamList = gettingToKnowYouData.getDreamList();
			var RATIO_IMAGE = 1;
			var columnsNum = 2;
			var rowElementTemplate = $("<div class='row dreams-row'>");
			var columnElementTemplate = $("<div class='col-md-6 dream'></div>");
			if (dreamList.length > 2) {
				columnsNum = 3;
				columnElementTemplate = $("<div class='col-md-4 dream'></div>");
			}
			rowElementTemplate.addClass("row" + columnsNum);

			//set the width of dream area
			var heightOfContainer = this.$el.find(".your-dream-area").height();
			var heightOfColumn = (heightOfContainer / columnsNum) - 30;	//30 is padding bottom of one item
			var widthOfContainer = heightOfColumn * RATIO_IMAGE * columnsNum;
			this.$el.find(".your-dream-area").css({
				"width": widthOfContainer
			});

			var rowNum = columnsNum;
			for (var i = 0; i < rowNum; i++) {
				var rowItem = rowElementTemplate.clone();
				for (var j = 0; j < columnsNum; j++) {
					var columnItem = columnElementTemplate.clone();
					rowItem.append(columnItem);

					//identify the index for each item
					var numClass = "index" + (i * rowNum + j);
					columnItem.addClass(numClass);
				}

				this.$el.find(".your-dream-area").append(rowItem);
			}


			//fullfil the dream item inside the grid
			for (i = 0; i < dreamList.length; i++) {
				var dreamData = dreamList[i];
				var iconClass = this.getDreamItemClassByDreamType(dreamData.getDreamType());
				var obj = this.getDreamDataByDreamTypeAndIndex(dreamData.getDreamType(), dreamData.getIndex());


				var indexClass= ".index" + i;
				var itemElement = this.$el.find(".your-dream-area " + indexClass);
				itemElement.addClass(iconClass);
				var imgElement = $("<img src='" + obj.image +"'/>");
				var titleElement = $("<p class='dream-title' data-i18n='"+obj.translationPath+"'>" + obj.title + "</p>");
				itemElement.append(imgElement);
				itemElement.append(titleElement);
			}

			//rotate the item
			$(".dream").each(function () {
				var rNum = (Math.random() * 15) - 1;
				$(this).css({
					'-webkit-transform': 'rotate(' + rNum + '3deg)',
					'-moz-transform': 'rotate(' + rNum + '3deg)'
				});
			});
			/*
			var dreamList = gettingToKnowYouData.getDreamList();
			var containerDivElementTemplate = $("<div class='col-md-6 dream'><img class='' alt='dream'/></div>");
			if (dreamList.length > 2) {
				containerDivElementTemplate = $("<div class='col-md-4 dream'><img class='' alt='dream'</div>");
			}

			for (var i = 0; i < dreamList.length; i++) {
				var itemElement = containerDivElementTemplate.clone();
				var dreamData = dreamList[i];
				var iconClass = this.getDreamItemClassByDreamType(dreamData.getDreamType());
				//var imgClass = this.getDreamIndexClassByDreamTypeAndIndex(dreamData.getDreamType(), dreamData.getIndex());
				var srcImg = this.getDreamSrcImgByDreamTypeAndIndex(dreamData.getDreamType(), dreamData.getIndex());
				console.log("==dreamData.getDreamType() " + dreamData.getDreamType() + " / " + dreamData.getIndex());
				console.log("==srcImg " + iconClass + " / " + srcImg);
				itemElement.addClass(iconClass);
				itemElement.find("img").attr("src", srcImg);

				this.$el.find(".your-dream-area .dreams-row").append(itemElement);
			}
			*/
		},

		getDreamDataByDreamTypeAndIndex : function(dreamType, index) {
			var dreamListSrc = null;
			switch(dreamType) {
				case data.DreamData.DREAM_BUYING_A_HOUSE:
					dreamListSrc = GTKYSummaryPage.HOUSE_LIST;
				break;
				case data.DreamData.DREAM_GETTING_MARRIED:
					dreamListSrc = GTKYSummaryPage.WEDDING_LIST;
				break;
				case data.DreamData.DREAM_HAVING_A_BABY:
					dreamListSrc = GTKYSummaryPage.BABY_LIST;
				break;
				case data.DreamData.DREAM_PLAN_FOR_EDUCATION:
					dreamListSrc = GTKYSummaryPage.EDUCATION_LIST;
				break;
				case data.DreamData.DREAM_BUYING_A_NEW_CAR:
					dreamListSrc = GTKYSummaryPage.CAR_LIST;
				break;
				case data.DreamData.DREAM_PLAN_FOR_VACATION:
					dreamListSrc = GTKYSummaryPage.VACATION_LIST;
				break;
				case data.DreamData.DREAM_EARLY_RETIREMENT:
					dreamListSrc = GTKYSummaryPage.RETIREMENT_LIST;
				break;
			}

			if (dreamListSrc) {
				return dreamListSrc[index];
			}

			return null;
		},

		getDreamIndexClassByDreamTypeAndIndex: function(dreamType, index) {
			var iconClass = "";
			switch(dreamType) {
				case data.DreamData.DREAM_BUYING_A_HOUSE:
					iconClass = "dream-house-";
				break;
				case data.DreamData.DREAM_GETTING_MARRIED:
					iconClass = "dream-wedding-";
				break;
				case data.DreamData.DREAM_HAVING_A_BABY:
					iconClass = "dream-baby-";
				break;
				case data.DreamData.DREAM_PLAN_FOR_EDUCATION:
					iconClass = "dream-education-";
				break;
				case data.DreamData.DREAM_BUYING_A_NEW_CAR:
					iconClass = "dream-car-";
				break;
				case data.DreamData.DREAM_PLAN_FOR_VACATION:
					iconClass = "dream-vacation-";
				break;
				case data.DreamData.DREAM_EARLY_RETIREMENT:
					iconClass = "dream-retirement-";
				break;
			}

			if (iconClass !== "") {
				iconClass = iconClass + index.toString();
			}

			return iconClass;
		},

		getDreamItemClassByDreamType: function(dreamType) {
			var iconClass = "";
			switch(dreamType) {
				case data.DreamData.DREAM_BUYING_A_HOUSE:
					iconClass = "summary-buy-house";
				break;
				case data.DreamData.DREAM_GETTING_MARRIED:
					iconClass = "summary-getting-married";
				break;
				case data.DreamData.DREAM_HAVING_A_BABY:
					iconClass = "summary-having-baby";
				break;
				case data.DreamData.DREAM_PLAN_FOR_EDUCATION:
					iconClass = "summary-plan-for-education";
				break;
				case data.DreamData.DREAM_BUYING_A_NEW_CAR:
					iconClass = "summary-buy-car";
				break;
				case data.DreamData.DREAM_PLAN_FOR_VACATION:
					iconClass = "summary-plan-vacation";
				break;
				case data.DreamData.DREAM_EARLY_RETIREMENT:
					iconClass = "summary-early-retirement";
				break;
			}

			return iconClass;
		},

		addLifeStage: function() {
			var lifeStageData = this.gettingToKnowYouData.getLifeStage();
			console.log("GTKYSummaryPage::addLifeStage:", lifeStageData);
			var lifeStageType = lifeStageData.lifeStyleType;
			var lifeStageObj = data.LifeStageData.getLifeStageObj(lifeStageType);
			var src = lifeStageObj.src;
			this.$el.find('.life-stage-img').attr('src', src);
		},

		addNeeds:function(){
			var lifeStageData = this.gettingToKnowYouData.getLifeStage();
			var items = lifeStageData.getNeedsList();
			console.log("GTKYSummaryPage::addNeeds:", items);
			var $container = this.$el.find(".needs-box");
			for(var i=0; i<items.length; i++){
				var item = items[i];
				var cbOptions = this.options = $.extend({}, item);
				cbOptions.container = $container;
				cbOptions.isChecked = true;
				cbOptions.isDisabled = true;
				var checkBox = new CssCheckBox(null, cbOptions);
			}
		},

		addPersonalProtection:function(){
			var self = this;
			var items = data.LifeStageData.PROTECTION_RANGE;
			for(var i=0; i<items.length; i++){
				var iTemplate = Templates.getTemplate('personal-protection-item');
				var iModel = items[i];
				var tpl = iTemplate(iModel);
				self.$el.find(".personal-protection-box").append(tpl);
			}
		}

	};


	var temporaryObj = GTKYSummaryPage.prototype;
	GTKYSummaryPage.prototype = Object.create(pos.PageElement.prototype);
	$.extend(GTKYSummaryPage.prototype, temporaryObj);

	// exports
	page.GTKYSummaryPage = GTKYSummaryPage;

}(page, jQuery, app.Templates, pos.CssCheckBox));
