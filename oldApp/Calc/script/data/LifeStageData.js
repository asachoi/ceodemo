/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var data = data || {};

(function(data) {
	'use strict';

	/**
	 * ConfigData component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 *
	 *  All operation on this class must use the method that provide
	 *  It will be easy to change and observe
	 */
	function LifeStageData() {
		//this.initDefault();
	}

	LifeStageData.VERSION  = '3.3.1';

	LifeStageData.DEFAULTS = {

	};

	LifeStageData.LIFE_STAGE_NOT_INDENTIFY = "life_style_not_identify";
	LifeStageData.LIFE_STAGE_CAREER_STARTER = 'career_starter';
	LifeStageData.LIFE_STAGE_STARTING_FAMILY = 'starting_family';
	LifeStageData.LIFE_STAGE_GETTING_MARRIED = 'getting_married';
	LifeStageData.LIFE_STAGE_RETIRING = 'retiring';

	LifeStageData.LIFE_STAGE_CAREER_STARTER_SVG = '../images/emotional/lifestages/lifestages_carreer_starter.png';
	LifeStageData.LIFE_STAGE_STARTING_FAMILY_SVG = '../images/emotional/lifestages/lifestages_starting_a_family.png';
	LifeStageData.LIFE_STAGE_GETTING_MARRIED_SVG = '../images/emotional/lifestages/lifestages_getting_married.png';
	LifeStageData.LIFE_STAGE_RETIRING_SVG = '../images/emotional/lifestages/lifestages_retiring.png';

	LifeStageData.LIFE_STAGE_RANGE = [{
			"id":LifeStageData.LIFE_STAGE_CAREER_STARTER,
			"class":"",
			"label":"CAREER STARTER",
			"src":LifeStageData.LIFE_STAGE_CAREER_STARTER_SVG,
			"translationPath":"life_stage_need.career_starter",
			"description":"START A CAREER THE RIGHT WAY. BEGIN PLANNING FOR YOU FINANCIAL FUTURE.  SUCCESS COMES WITH A PLAN.JUST GRADUATED FROM COLLEGE? OR ARE YOU LOOKING TO START YOUR CAREER OR YOUR OWN BUSINESS? TAKE THE SMARTER FIRST STEP FORWARD BY ENSURING YOUR FINANCIAL PLANNING IS ON TRACK. WITH THE RIGHT PLANNING, YOU CAN ENSURE THAT EVERY STEP AND SUCCESS YOU MAKE WILL NOT BE HINDERED BY LIFE’S MANY CHALLENGES.",
			"descriptionTranslationPath":"[html]life_stage_need.career_starter_description"
		}, {
			"id":LifeStageData.LIFE_STAGE_GETTING_MARRIED,
			"class":"",
			"label":"GETTING MARRIED",
			"src":LifeStageData.LIFE_STAGE_GETTING_MARRIED_SVG,
			"translationPath":"life_stage_need.getting_married",
			"description":"GETTING MARRIED DESCRIPTION HERE",
			"descriptionTranslationPath":"[html]life_stage_need.getting_married_description"
		},{
			"id":LifeStageData.LIFE_STAGE_STARTING_FAMILY,
			"class":"",
			"label":"STARTING FAMILY",
			"src":LifeStageData.LIFE_STAGE_STARTING_FAMILY_SVG,
			"translationPath":"life_stage_need.starting_family",
			"description":"STARTING FAMILY DESCRIPTION HERE",
			"descriptionTranslationPath":"[html]life_stage_need.starting_family_description"
		}, {
			"id":LifeStageData.LIFE_STAGE_RETIRING,
			"class":"",
			"label":"RETIRING",
			"src":LifeStageData.LIFE_STAGE_RETIRING_SVG,
			"translationPath":"life_stage_need.retiring",
			"description":"RETIRING DESCRIPTION HERE",
			"descriptionTranslationPath":"[html]life_stage_need.retiring_description"
		}
	];


	LifeStageData.PROTECTION_RANGE = [
		{
			"id":"personal_protection_life_protection",
			"label":"LIFE PROTECTION",
			"translationPath":"life_stage_need.personal_protection.life_protection"
		},
		{
			"id":"personal_protection_critical_illness",
			"label":"CRITICAL ILLNESS",
			"translationPath":"life_stage_need.personal_protection.critical_illness"
		},
		{
			"id":"personal_protection_accident_protection",
			"label":"ACCIDENT PROTECTION",
			"translationPath":"life_stage_need.personal_protection.accident_protection"
		},
		{
			"id":"personal_protection_disability_protection",
			"label":"DISABILITY PROTECTION",
			"translationPath":"life_stage_need.personal_protection.disability_protection"
		},
		{
			"id":"personal_protection_medical_protection",
			"label":"MEDICAL PROTECTION",
			"translationPath":"life_stage_need.personal_protection.medical_protection"
		},
		{
			"id":"personal_protection_build_your_wealth",
			"label":"BUILD YOUR WEALTH",
			"translationPath":"life_stage_need.personal_protection.build_your_wealth"
		},
		{
			"id":"personal_protection_protect_your_wealth",
			"label":"PROTECT YOUR WEALTH",
			"translationPath":"life_stage_need.personal_protection.protect_your_wealth"
		},
		{
			"id":"personal_protection_enjoy_your_retirement",
			"label":"ENJOY YOUR RETIREMENT",
			"translationPath":"life_stage_need.personal_protection.enjoy_your_retirement"
		},
		{
			"id":"personal_protection_ilas",
			"label":"ILAS",
			"translationPath":"life_stage_need.personal_protection.ilas"
		},
		{
			"id":"personal_protection_savings",
			"label":"SAVINGS",
			"translationPath":"life_stage_need.personal_protection.savings"
		}
	];

	LifeStageData.NEED_RANGE = [
		{
			"id":"need_protection",
			"containerClass":"normal",
			"label":"PROTECTION",
			"translationPath":"life_stage_need.protection"
		},
		{
			"id":"need_investing_and_savings",
			"containerClass":"dark",
			"label":"INVESTING & SAVINGS",
			"translationPath":"life_stage_need.investing_and_saving"
		},
		{
			"id":"need_retirement",
			"containerClass":"light",
			"label":"RETIREMENT",
			"translationPath":"life_stage_need.retirement"
		},
		{
			"id":"need_other_planning",
			"containerClass":"dark",
			"label":"OTHER PLANNING",
			"translationPath":"life_stage_need.other_planning"
		}
	];


	LifeStageData.getLifeStageObj = function(id){
        console.log("LifeStageData::getLifeStageObj:",id);
        var items = LifeStageData.LIFE_STAGE_RANGE;
        for(var i=0; i<items.length; i++){
            var item = items[i];
            if(item.id == id){
                return item;
            }
        }
        return null;
    },


    LifeStageData.getNeedObj = function(id){
        console.log("LifeStageData::getNeedsObj:",id);
        var items = LifeStageData.NEED_RANGE;
        for(var i=0; i<items.length; i++){
            var item = items[i];
            if(item.id == id){
                return item;
            }
        }
        return null;
    },


	LifeStageData.GetDefaultInstance = function() {
		var newInstance = new LifeStageData();
		newInstance.setLifeStyleType(LifeStageData.LIFE_STAGE_CAREER_STARTER);
		newInstance.setIsProtection(true);
		newInstance.setIsInvestmentSaving(true);
		newInstance.setIsRetirement(true);
		newInstance.setIsOtherPlan(false);

		return newInstance;
	};


	LifeStageData.prototype = {

		constructor: LifeStageData,

		lifeStyleType: null,
		isProtection: null,
		isInvestmentSaving: null,
		isRetirement: null,
		isOtherPlan: null,

		getLifeStyleType: function() {
			return this.lifeStyleType;
		},

		setLifeStyleType: function(type) {
			this.lifeStyleType = type;
		},

		setIsProtection: function(isProtection) {
			this.isProtection = isProtection;
		},

		getIsProtection: function() {
			return this.isProtection;
		},

		setIsInvestmentSaving: function(isInvestmentSaving) {
			this.isInvestmentSaving = isInvestmentSaving;
		},

		getIsInvestmentSaving: function() {
			return this.isInvestmentSaving;
		},

		setIsRetirement: function(isRetirement) {
			this.isRetirement = isRetirement;
		},

		getIsRetirement: function() {
			return this.isRetirement;
		},

		setIsOtherPlan: function(isOtherPlan) {
			this.isOtherPlan = isOtherPlan;
		},

		getIsOtherPlan: function(isOtherPlan) {
			return this.isOtherPlan;
		},

		/**
		* return the needs in an array
		*/
		getNeedsList:function(){
			var needs = [];
			if(this.getIsProtection()){
				var item = LifeStageData.getNeedObj("need_protection");
				needs.push(item);
			}
			if(this.getIsInvestmentSaving()){
				var item = LifeStageData.getNeedObj("need_investing_and_savings");
				needs.push(item);
			}
			if(this.getIsRetirement()){
				var item = LifeStageData.getNeedObj("need_retirement");
				needs.push(item);
			}
			if(this.getIsOtherPlan()){
				var item = LifeStageData.getNeedObj("need_other_planning");
				needs.push(item);
			}
			return needs;
		}

	};



	// exports
	data.LifeStageData = LifeStageData;
}(data));