/* © 2014 Aleph-labs.com
 * @author Phuong Vo
 */
// namespace
var data = data || {};

(function(data) {
	'use strict';

	/**
	 * CharacterData component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 * define data for chracter
	 */
	function CharacterData() {
		this.initDefault();
	}

	CharacterData.VERSION  = '3.3.1';

	CharacterData.DEFAULTS = {

	};

	CharacterData.CHARACTER_NOT_IDENTIFICATION = "not_identification";
	CharacterData.CHARACTER_BABY_BOY_IDENTIFICATION = "character_baby_boy_identification";
	CharacterData.CHARACTER_BABY_GIRL_IDENTIFICATION = "character_baby_girl_identification";

	CharacterData.CHARACTER_INFANT_BOY_IDENTIFICATION = "character_infant_boy_identification";
	CharacterData.CHARACTER_BOY_IDENTIFICATION = "character_boy_identification";
	CharacterData.CHARACTER_TEEN_BOY_IDENTIFICATION = "character_teen_boy_identification";

	CharacterData.CHARACTER_INFANT_GIRL_IDENTIFICATION = "character_infant_girl_identification";
	CharacterData.CHARACTER_GIRL_IDENTIFICATION = "character_girl_identification";
	CharacterData.CHARACTER_TEEN_GIRL_IDENTIFICATION = "character_teen_girl_identification";

	CharacterData.CHARACTER_YOUNG_MAN_IDENTIFICATION = "character_young_man_identification";
	CharacterData.CHARACTER_MAN_IDENTIFICATION = "character_man_identification";
	CharacterData.CHARACTER_OLD_MAN_IDENTIFICATION = "character_old_man_identification";

	CharacterData.CHARACTER_YOUNG_WOMAN_IDENTIFICATION = "character_young_woman_identification";
	CharacterData.CHARACTER_WOMAN_IDENTIFICATION = "character_woman_identification";
	CharacterData.CHARACTER_OLD_WOMAN_IDENTIFICATION = "character_old_woman_identification";

	//for dependents only
	CharacterData.CHARACTER_GRAND_FATHER_STATUS_IDENTIFICATION = "character_grand_father_identification";
	CharacterData.CHARACTER_GRAND_MOTHER_STATUS_IDENTIFICATION = "character_grand_mother_identification";


	CharacterData.MALE = "male";
	CharacterData.FEMALE = "female";
	CharacterData.NOT_IDENTIFY = "not_identify";

	CharacterData.PERIOD_BABY = [1, 2];
	CharacterData.PERIOD_INFANT_BOY_GIRL = [3,6];
	CharacterData.PERIOD_BOY_GIRL = [7,12];
	CharacterData.PERIOD_TEEN_BOY_GIRL = [13,17];
	CharacterData.PERIOD_YOUNG_MAN_WOMAN = [18, 30];
	CharacterData.PERIOD_MAN_WOMAN = [31, 50];
	CharacterData.PERIOD_OLDMAN_WOMAN = [51, 99];

	//for dependents only
	CharacterData.PERIOD_GRAND_FATHER_MOTHER = [100, 200];

	CharacterData.AGE_DEFAULT_BABY = CharacterData.PERIOD_BABY[0];

	CharacterData.AGE_DEFAULT_INFANT_BOY = 4;
	CharacterData.AGE_DEFAULT_BOY = 10;
	CharacterData.AGE_DEFAULT_TEEN_BOY = 15;

	CharacterData.AGE_DEFAULT_INFANT_GIRL = 4;
	CharacterData.AGE_DEFAULT_GIRL = 10;
	CharacterData.AGE_DEFAULT_TEEN_GIRL = 15;

	CharacterData.AGE_DEFAULT_YOUNG_MAN =  CharacterData.PERIOD_YOUNG_MAN_WOMAN[0];
	CharacterData.AGE_DEFAULT_MAN = 40;
	CharacterData.AGE_DEFAULT_OLD_MAN = 60;

	CharacterData.AGE_DEFAULT_YOUNG_WOMAN = CharacterData.PERIOD_YOUNG_MAN_WOMAN[0];
	CharacterData.AGE_DEFAULT_WOMAN = 40;
	CharacterData.AGE_DEFAULT_OLD_WOMAN = 60;

	//for dependents only
	CharacterData.AGE_DEFAULT_GRAND_FATHER = 100;
	CharacterData.AGE_DEFAULT_GRAND_MOTHER = 100;

	CharacterData.BABY_TEMPLATE_NAME = "baby-default";

	CharacterData.INFANT_BOY_TEMPLATE_NAME = "boy-infant-default";
	CharacterData.BOY_TEMPLATE_NAME = "boy-default";
	CharacterData.TEEN_BOY_TEMPLATE_NAME = "boy-teenager-default";

	CharacterData.INFANT_GIRL_TEMPLATE_NAME = "girl-infant-default";
	CharacterData.GIRL_TEMPLATE_NAME = "girl-default";
	CharacterData.TEEN_GIRL_TEMPLATE_NAME = "girl-teenager-default";

	CharacterData.YOUNG_MAN_TEMPLATE_NAME = "young-man-default";
	CharacterData.MAN_TEMPLATE_NAME = "man-default";
	CharacterData.OLD_MAN_TEMPLATE_NAME = "old-man-default";

	CharacterData.YOUNG_WOMAN_TEMPLATE_NAME = "young-woman-default";
	CharacterData.WOMAN_TEMPLATE_NAME = "woman-default";
	CharacterData.OLD_WOMAN_TEMPLATE_NAME = "old-woman-default";

	//for dependents only
	CharacterData.GRAND_FATHER_TEMPLATE_NAME = "grandpa-default";
	CharacterData.GRAND_MOTHER_TEMPLATE_NAME = "grandma-default";

	CharacterData.MALE_RANGE = [
		CharacterData.PERIOD_BABY,
		CharacterData.PERIOD_INFANT_BOY_GIRL,
		CharacterData.PERIOD_BOY_GIRL,
		CharacterData.PERIOD_TEEN_BOY_GIRL,
		CharacterData.PERIOD_YOUNG_MAN_WOMAN,
		CharacterData.PERIOD_MAN_WOMAN,
		CharacterData.PERIOD_OLDMAN_WOMAN,
		CharacterData.PERIOD_GRAND_FATHER_MOTHER
	];

	CharacterData.CHARACTER_RANGE = [{
			id: CharacterData.CHARACTER_BABY_BOY_IDENTIFICATION,
			label: "BABY",
			translationPath: "character.baby",
			icon:"icon-baby",
			gender:	CharacterData.MALE,
			spouse: CharacterData.CHARACTER_BABY_GIRL_IDENTIFICATION,
			defaultAge: CharacterData.AGE_DEFAULT_BABY
		}, {
			id: CharacterData.CHARACTER_BABY_GIRL_IDENTIFICATION,
			label: "BABY",
			translationPath: "character.baby",
			icon:"icon-baby",
			gender:	CharacterData.FEMALE,
			spouse: CharacterData.CHARACTER_BABY_BOY_IDENTIFICATION,
			defaultAge: CharacterData.AGE_DEFAULT_BABY
		}, {
			id: CharacterData.CHARACTER_INFANT_BOY_IDENTIFICATION,
			label: "BOY",
			translationPath: "character.infant_boy",
			icon:"icon-infant-boy",
			gender:	CharacterData.MALE,
			spouse: CharacterData.CHARACTER_INFANT_GIRL_IDENTIFICATION,
			defaultAge: CharacterData.AGE_DEFAULT_INFANT_BOY
		}, {
			id: CharacterData.CHARACTER_BOY_IDENTIFICATION,
			label: "BOY",
			translationPath: "character.boy",
			icon:"icon-boy",
			gender:	CharacterData.MALE,
			spouse: CharacterData.CHARACTER_GIRL_IDENTIFICATION,
			defaultAge: CharacterData.AGE_DEFAULT_BOY
		}, {
			id: CharacterData.CHARACTER_TEEN_BOY_IDENTIFICATION,
			label: "TEEN BOY",
			translationPath: "character.teen_boy",
			icon:"icon-teen-boy",
			gender:	CharacterData.MALE,
			spouse: CharacterData.CHARACTER_TEEN_GIRL_IDENTIFICATION,
			defaultAge: CharacterData.AGE_DEFAULT_TEEN_BOY
		}, {
			id: CharacterData.CHARACTER_INFANT_GIRL_IDENTIFICATION,
			label: "GIRL",
			translationPath: "character.infant_girl",
			icon:"icon-infant-girl",
			gender:	CharacterData.FEMALE,
			spouse: CharacterData.CHARACTER_INFANT_BOY_IDENTIFICATION,
			defaultAge: CharacterData.AGE_DEFAULT_INFANT_GIRL
		}, {
			id: CharacterData.CHARACTER_GIRL_IDENTIFICATION,
			label: "GIRL",
			translationPath: "character.girl",
			icon:"icon-girl",
			gender:	CharacterData.FEMALE,
			spouse: CharacterData.CHARACTER_BOY_IDENTIFICATION,
			defaultAge: CharacterData.AGE_DEFAULT_GIRL
		}, {
			id: CharacterData.CHARACTER_TEEN_GIRL_IDENTIFICATION,
			label: "TEEN GIRL",
			translationPath: "character.teen_girl",
			icon:"icon-teen-girl",
			gender:	CharacterData.FEMALE,
			spouse: CharacterData.CHARACTER_TEEN_BOY_IDENTIFICATION,
			defaultAge: CharacterData.AGE_DEFAULT_TEEN_GIRL
		}, {
			id: CharacterData.CHARACTER_YOUNG_MAN_IDENTIFICATION,
			label: "MAN",
			translationPath: "character.young_man",
			icon:"icon-young-man",
			gender:	CharacterData.MALE,
			spouse: CharacterData.CHARACTER_YOUNG_WOMAN_IDENTIFICATION,
			defaultAge: CharacterData.AGE_DEFAULT_YOUNG_MAN
		}, {
			id: CharacterData.CHARACTER_MAN_IDENTIFICATION,
			label: "MAN",
			translationPath: "character.man",
			icon:"icon-man",
			gender:	CharacterData.MALE,
			spouse: CharacterData.CHARACTER_WOMAN_IDENTIFICATION,
			defaultAge: CharacterData.AGE_DEFAULT_MAN
		}, {
			id: CharacterData.CHARACTER_OLD_MAN_IDENTIFICATION,
			label: "MAN",
			translationPath: "character.old_man",
			icon:"icon-old-man",
			gender:	CharacterData.MALE,
			spouse: CharacterData.CHARACTER_OLD_WOMAN_IDENTIFICATION,
			defaultAge: CharacterData.AGE_DEFAULT_OLD_MAN
		}, {
			id: CharacterData.CHARACTER_YOUNG_WOMAN_IDENTIFICATION,
			label: "WOMAN",
			translationPath: "character.young_woman",
			icon:"icon-young-woman",
			gender:	CharacterData.FEMALE,
			spouse: CharacterData.CHARACTER_YOUNG_MAN_IDENTIFICATION,
			defaultAge: CharacterData.AGE_DEFAULT_YOUNG_WOMAN
		}, {
			id: CharacterData.CHARACTER_WOMAN_IDENTIFICATION,
			label: "WOMAN",
			translationPath: "character.woman",
			icon:"icon-woman",
			gender:	CharacterData.FEMALE,
			spouse: CharacterData.CHARACTER_MAN_IDENTIFICATION,
			defaultAge: CharacterData.AGE_DEFAULT_WOMAN
		}, {
			id: CharacterData.CHARACTER_OLD_WOMAN_IDENTIFICATION,
			label: "WOMAN",
			translationPath: "character.old_woman",
			icon:"icon-old-woman",
			gender:	CharacterData.FEMALE,
			spouse: CharacterData.CHARACTER_OLD_MAN_IDENTIFICATION,
			defaultAge: CharacterData.AGE_DEFAULT_OLD_WOMAN
		}, {
			id: CharacterData.CHARACTER_GRAND_FATHER_STATUS_IDENTIFICATION,
			label: "GRAND FATHER",
			translationPath: "character.grandfather",
			icon:"icon-grandfather",
			gender:	CharacterData.MALE,
			spouse: CharacterData.CHARACTER_GRAND_MOTHER_STATUS_IDENTIFICATION,
			defaultAge: CharacterData.AGE_DEFAULT_GRAND_FATHER
		}, {
			id: CharacterData.CHARACTER_GRAND_MOTHER_STATUS_IDENTIFICATION,
			label: "GRAND MOTHER",
			translationPath: "character.grandmother",
			icon:"icon-grandmother",
			gender:	CharacterData.FEMALE,
			spouse: CharacterData.CHARACTER_GRAND_FATHER_STATUS_IDENTIFICATION,
			defaultAge: CharacterData.AGE_DEFAULT_GRAND_MOTHER
		}
	];


	CharacterData.getCharacterObj = function(id){
		console.log("CharacterData::getCharacterObj:",id);
		var items = CharacterData.CHARACTER_RANGE;
		for(var i=0; i<items.length; i++){
			var item = items[i];
			if(item.id == id){
				console.log("CharacterData::getCharacterObj: result:",item);
				return item;
			}
		}
		return null;
	},


	CharacterData.getIdentificationByAge = function(age, gender) {

		console.log("CharacterData.getIdentificationByAge" + age + "/ " + gender);

		if (gender !== CharacterData.MALE && gender !== CharacterData.FEMALE) {
			return CharacterData.CHARACTER_NOT_IDENTIFICATION;
		}

		var periodList = CharacterData.MALE_RANGE;
		var maleIdentificationList = [
			CharacterData.CHARACTER_BABY_BOY_IDENTIFICATION,
			CharacterData.CHARACTER_INFANT_BOY_IDENTIFICATION,
			CharacterData.CHARACTER_BOY_IDENTIFICATION,
			CharacterData.CHARACTER_TEEN_BOY_IDENTIFICATION,
			CharacterData.CHARACTER_YOUNG_MAN_IDENTIFICATION,
			CharacterData.CHARACTER_MAN_IDENTIFICATION,
			CharacterData.CHARACTER_OLD_MAN_IDENTIFICATION,
			CharacterData.CHARACTER_GRAND_FATHER_STATUS_IDENTIFICATION
		];
		var femaleIdentificationList = [
			CharacterData.CHARACTER_BABY_GIRL_IDENTIFICATION,
			CharacterData.CHARACTER_INFANT_GIRL_IDENTIFICATION,
			CharacterData.CHARACTER_GIRL_IDENTIFICATION,
			CharacterData.CHARACTER_TEEN_GIRL_IDENTIFICATION,
			CharacterData.CHARACTER_YOUNG_WOMAN_IDENTIFICATION,
			CharacterData.CHARACTER_WOMAN_IDENTIFICATION,
			CharacterData.CHARACTER_OLD_WOMAN_IDENTIFICATION,
			CharacterData.CHARACTER_GRAND_MOTHER_STATUS_IDENTIFICATION
		];

		var targetIdentification = femaleIdentificationList;
		if (gender === CharacterData.MALE) {
			targetIdentification = maleIdentificationList;
		}

		for (var i = 0; i < periodList.length; i++) {
			var periodAge = periodList[i];
			if (age >= periodAge[0] && periodAge[1] >= age) {
				console.log("===targetIdentification " + targetIdentification[i]);
				return targetIdentification[i];
			}
		}

		return CharacterData.CHARACTER_NOT_IDENTIFICATION;
	};

	CharacterData.getGenderByIdentification = function(identification) {
		var charObj = CharacterData.getCharacterObj(identification);
		if(charObj){
			return charObj.gender;
		}

		return CharacterData.NOT_IDENTIFY;

	};



	CharacterData.getAnotherCoupleByIndentification = function(identification) {
		var charObj = CharacterData.getCharacterObj(identification);

		if(charObj){
			return charObj.spouse;
		}

		return CharacterData.NOT_IDENTIFY;
	};

	CharacterData.getGenderByIndentification = function(identification)	{
		var charObj = CharacterData.getCharacterObj(identification);
		console.log("CharacterData::getGenderByIndentification:", identification, charObj);

		if(charObj){
			return charObj.gender;
		}

		return CharacterData.NOT_IDENTIFY;
	};

	CharacterData.getDefaultAgeByIndentification = function(identification) {
		var charObj = CharacterData.getCharacterObj(identification);

		if(charObj){
			return charObj.defaultAge;
		}

		return 1;

	};


	/**
	 * get icon base on age and gender
	 */
	CharacterData.getIcon = function(id) {
		var charObj = CharacterData.getCharacterObj(id);
		console.log("CharacterData::getIcon:"+id, charObj);

		if(charObj){

			return {
				icon: charObj.icon,
				text: charObj.label,
				translationPath: charObj.translationPath
			};

		}

		return {
			icon: '',
			text: '',
			translationPath: ''
		};

	};




	/**
	 * generate age dataprovider to be used in age swipe select
	 * @type {{}}
	 */
	CharacterData.getAgeRange = function(){
		var items = [];

		//add blank
		/*
		var blankAgeObj = {
			"id":"",
			"value":"",
			"label":"",
			"translationPath":""
		};
		items.push(blankAgeObj);
		*/
		for(var i=1; i<99; i++){
			var ageObj = {
				"id":i,
				"value":i,
				"label":i, 
				"translationPath":"" 
			};
			items.push(ageObj);
		}
		return items;
	};

	//
	//occupation
	//
	CharacterData.OCCUPATION_NOT_SPECIFIED = ""; //no occupation specified
	CharacterData.OCCUPATION_STUDENT = "student";
	CharacterData.OCCUPATION_UNEMPLOYED = "unemployed";
	CharacterData.OCCUPATION_SUPERVISOR = "supervisor";
	CharacterData.OCCUPATION_SELF_EMPLOYED = "self-employed";
	CharacterData.OCCUPATION_RETIRED = "retired";
	CharacterData.OCCUPATION_PROFESSIONAL = "professional";
	CharacterData.OCCUPATION_INTERMEDIATE = "intermediate";
	CharacterData.OCCUPATION_EXECUTIVE = "executive";
	CharacterData.OCCUPATION_CIVIL_SERVANT = "civil-servant";
	CharacterData.OCCUPATION_CAREER_STARTER = "career-starter";

	CharacterData.FEMALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME = CharacterData.WOMAN_TEMPLATE_NAME;
	CharacterData.FEMALE_OCCUPATION_STUDENT_TEMPLATE_NAME = 'woman-student';
	CharacterData.FEMALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME = 'woman-unemployed';
	CharacterData.FEMALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME = 'woman-supervisor';
	CharacterData.FEMALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME = 'woman-self-employed';
	CharacterData.FEMALE_OCCUPATION_RETIRED_TEMPLATE_NAME = 'woman-retirement';
	CharacterData.FEMALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME = 'woman-professional';
	CharacterData.FEMALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME = 'woman-intermediate';
	CharacterData.FEMALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME = 'woman-excutive';
	CharacterData.FEMALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME = 'woman-civil-servant';
	CharacterData.FEMALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME = 'woman-career-starter';

	CharacterData.MALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME = CharacterData.MAN_TEMPLATE_NAME;
	CharacterData.MALE_OCCUPATION_STUDENT_TEMPLATE_NAME = 'man-student';
	CharacterData.MALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME = 'man-unemployed';
	CharacterData.MALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME = 'man-supervisor';
	CharacterData.MALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME = 'man-self-employed';
	CharacterData.MALE_OCCUPATION_RETIRED_TEMPLATE_NAME = 'man-retirement';
	CharacterData.MALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME = 'man-professional';
	CharacterData.MALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME = 'man-intermediate';
	CharacterData.MALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME = 'man-excutive';
	CharacterData.MALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME = 'man-civil-servant';
	CharacterData.MALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME = 'man-career-starter';


	CharacterData.OCCUPATION_RANGE = [
		{
			"id":CharacterData.OCCUPATION_NOT_SPECIFIED,
			"value":CharacterData.OCCUPATION_NOT_SPECIFIED,
			"label":"DEFAULT",
			"translationPath":"occupation.default"
		},
		{
			"id":CharacterData.OCCUPATION_STUDENT,
			"value":CharacterData.OCCUPATION_STUDENT,
			"label":"STUDENT",
			"translationPath":"occupation.student"
		},
		{
			"id":CharacterData.OCCUPATION_UNEMPLOYED,
			"value":CharacterData.OCCUPATION_UNEMPLOYED,
			"label":"UNEMPLOYED",
			"translationPath":"occupation.unemployed"
		},
		{
			"id":CharacterData.OCCUPATION_SUPERVISOR,
			"value":CharacterData.OCCUPATION_SUPERVISOR,
			"label":"SUPERVISOR",
			"translationPath":"occupation.supervisor"
		},
		{
			"id":CharacterData.OCCUPATION_SELF_EMPLOYED,
			"value":CharacterData.OCCUPATION_SELF_EMPLOYED,
			"label":"SELF EMPLOYED",
			"translationPath":"occupation.self_employed"
		},
		{
			"id":CharacterData.OCCUPATION_RETIRED,
			"value":CharacterData.OCCUPATION_RETIRED,
			"label":"RETIRED",
			"translationPath":"occupation.retired"
		},
		{
			"id":CharacterData.OCCUPATION_PROFESSIONAL,
			"value":CharacterData.OCCUPATION_PROFESSIONAL,
			"label":"PROFESSIONAL",
			"translationPath":"occupation.professional"
		},
		{
			"id":CharacterData.OCCUPATION_INTERMEDIATE,
			"value":CharacterData.OCCUPATION_INTERMEDIATE,
			"label":"INTERMEDIATE",
			"translationPath":"occupation.intermediate"
		},
		{
			"id":CharacterData.OCCUPATION_EXECUTIVE,
			"value":CharacterData.OCCUPATION_EXECUTIVE,
			"label":"EXECUTIVE",
			"translationPath":"occupation.executive"
		},
		{
			"id":CharacterData.OCCUPATION_CIVIL_SERVANT,
			"value":CharacterData.OCCUPATION_CIVIL_SERVANT,
			"label":"CIVIL SERVANT",
			"translationPath":"occupation.civil_servant"
		},
		{
			"id":CharacterData.OCCUPATION_CAREER_STARTER,
			"value":CharacterData.OCCUPATION_CAREER_STARTER,
			"label":"CAREER STARTER",
			"translationPath":"occupation.career_starter"
		}
	];

	//CharacterData.WORKING_AGE_RANGE = CharacterData.PERIOD_MAN_WOMAN;

	CharacterData.prototype = {
		constructor: CharacterData,

		initDefault: function() {

		}
	};

	// exports
	data.CharacterData = CharacterData;
}(data));