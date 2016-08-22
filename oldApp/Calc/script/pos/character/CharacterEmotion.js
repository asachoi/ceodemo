/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var pos = pos || {};
var data = data || {};

(function(pos, $, Templates, I18nHelper, CharacterData) {
	'use strict';
	/**
	 * CharacterEmotion component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 *  This class control the changing age and occupation of character by using drag, drop
	 *  each period age has range, and has an image for range
	 */
	function CharacterEmotion(element, options) {

		if (element) {
			this.$el  = $(element);
		} else {
			this.$el = $(CharacterEmotion.htmlTemplate);
		}

		this.el = this.$el[0];

		// store this instance to data object so that I can retrieve it later
		this.$el.data('character_emotion', this);
		this.options   = $.extend({}, CharacterEmotion.DEFAULTS, options);

		//this.initialize();
	}

	CharacterEmotion.VERSION  = '3.3.1';

	CharacterEmotion.EVENT_CHANGE = "character_change";

	CharacterEmotion.EVENT_SWIPE = "character_emotion_event_swipe";

	CharacterEmotion.MALE_MAX_WIDTH = 560;
	CharacterEmotion.MALE_MAX_HEIGHT = 280;
	CharacterEmotion.FEMALE_MAX_WIDTH = 560;
	CharacterEmotion.FEMALE_MAX_HEIGHT = 280;

	//classes inserted in the svg container
	//this is used to control the size of the svg
	//this applies for both male and female
	CharacterEmotion.CHAR_LIST_SVG_CLASSES = [
		"char-baby",
		"char-preteen",
		"char-teen",
		"char-adult",
		"char-old"
	];


	CharacterEmotion.EMOTION_TYPE_DEFAULT = 0;
	CharacterEmotion.EMOTION_TYPE_SAD = 1;

	CharacterEmotion.TEMPLATE_LIST = [
		{
			id:CharacterData.CHARACTER_BABY_BOY_IDENTIFICATION,
			occupations:null,
			emotions:[
				CharacterData.BABY_TEMPLATE_NAME,
				CharacterData.BABY_TEMPLATE_NAME
			]
		},
		{
			id:CharacterData.CHARACTER_INFANT_BOY_IDENTIFICATION,
			occupations:null,
			emotions:[
				CharacterData.INFANT_BOY_TEMPLATE_NAME,
				CharacterData.INFANT_BOY_TEMPLATE_NAME
			]
		},
		{
			id:CharacterData.CHARACTER_BOY_IDENTIFICATION,
			occupations:null,
			emotions:[
				CharacterData.BOY_TEMPLATE_NAME,
				CharacterData.BOY_TEMPLATE_NAME
			]
		},
		{
			id:CharacterData.CHARACTER_TEEN_BOY_IDENTIFICATION,
			occupations:null,
			emotions:[
				CharacterData.TEEN_BOY_TEMPLATE_NAME,
				CharacterData.TEEN_BOY_TEMPLATE_NAME
			]
		},
		{
			id:CharacterData.CHARACTER_INFANT_GIRL_IDENTIFICATION,
			occupations:null,
			emotions:[
				CharacterData.INFANT_GIRL_TEMPLATE_NAME,
				CharacterData.INFANT_GIRL_TEMPLATE_NAME
			]
		},
		{
			id:CharacterData.CHARACTER_GIRL_IDENTIFICATION,
			occupations:null,
			emotions:[
				CharacterData.GIRL_TEMPLATE_NAME,
				CharacterData.GIRL_TEMPLATE_NAME
			]
		},
		{
			id:CharacterData.CHARACTER_TEEN_GIRL_IDENTIFICATION,
			occupations:null,
			emotions:[
				CharacterData.TEEN_GIRL_TEMPLATE_NAME,
				CharacterData.TEEN_GIRL_TEMPLATE_NAME
			]
		},
		{
			id:CharacterData.CHARACTER_YOUNG_MAN_IDENTIFICATION,
			occupations:[
				{
					id:CharacterData.OCCUPATION_NOT_SPECIFIED,
					emotions:[
						"young-"+CharacterData.MALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME,
						"young-"+CharacterData.MALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_STUDENT,
					emotions:[
						"young-"+CharacterData.MALE_OCCUPATION_STUDENT_TEMPLATE_NAME,
						"young-"+CharacterData.MALE_OCCUPATION_STUDENT_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_UNEMPLOYED,
					emotions:[
						"young-"+CharacterData.MALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME,
						"young-"+CharacterData.MALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_SUPERVISOR,
					emotions:[
						"young-"+CharacterData.MALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME,
						"young-"+CharacterData.MALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_SELF_EMPLOYED,
					emotions:[
						"young-"+CharacterData.MALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME,
						"young-"+CharacterData.MALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_RETIRED,
					emotions:[
						"young-"+CharacterData.MALE_OCCUPATION_RETIRED_TEMPLATE_NAME,
						"young-"+CharacterData.MALE_OCCUPATION_RETIRED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_PROFESSIONAL,
					emotions:[
						"young-"+CharacterData.MALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME,
						"young-"+CharacterData.MALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_INTERMEDIATE,
					emotions:[
						"young-"+CharacterData.MALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME,
						"young-"+CharacterData.MALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_EXECUTIVE,
					emotions:[
						"young-"+CharacterData.MALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME,
						"young-"+CharacterData.MALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_CIVIL_SERVANT,
					emotions:[
						"young-"+CharacterData.MALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME,
						"young-"+CharacterData.MALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_CAREER_STARTER,
					emotions:[
						"young-"+CharacterData.MALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME,
						"young-"+CharacterData.MALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME+"-sad"
					]
				}
			],
			emotions:null
		},
		{
			id:CharacterData.CHARACTER_MAN_IDENTIFICATION,
			occupations:[
				{
					id:CharacterData.OCCUPATION_NOT_SPECIFIED,
					emotions:[
						CharacterData.MALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME,
						CharacterData.MALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_STUDENT,
					emotions:[
						CharacterData.MALE_OCCUPATION_STUDENT_TEMPLATE_NAME,
						CharacterData.MALE_OCCUPATION_STUDENT_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_UNEMPLOYED,
					emotions:[
						CharacterData.MALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME,
						CharacterData.MALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_SUPERVISOR,
					emotions:[
						CharacterData.MALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME,
						CharacterData.MALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_SELF_EMPLOYED,
					emotions:[
						CharacterData.MALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME,
						CharacterData.MALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_RETIRED,
					emotions:[
						CharacterData.MALE_OCCUPATION_RETIRED_TEMPLATE_NAME,
						CharacterData.MALE_OCCUPATION_RETIRED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_PROFESSIONAL,
					emotions:[
						CharacterData.MALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME,
						CharacterData.MALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_INTERMEDIATE,
					emotions:[
						CharacterData.MALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME,
						CharacterData.MALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_EXECUTIVE,
					emotions:[
						CharacterData.MALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME,
						CharacterData.MALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_CIVIL_SERVANT,
					emotions:[
						CharacterData.MALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME,
						CharacterData.MALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_CAREER_STARTER,
					emotions:[
						CharacterData.MALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME,
						CharacterData.MALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME+"-sad"
					]
				}
			],
			emotions:null
		},
		{
			id:CharacterData.CHARACTER_OLD_MAN_IDENTIFICATION,
			occupations:[
				{
					id:CharacterData.OCCUPATION_NOT_SPECIFIED,
					emotions:[
						"old-"+CharacterData.MALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME,
						"old-"+CharacterData.MALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_STUDENT,
					emotions:[
						"old-"+CharacterData.MALE_OCCUPATION_STUDENT_TEMPLATE_NAME,
						"old-"+CharacterData.MALE_OCCUPATION_STUDENT_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_UNEMPLOYED,
					emotions:[
						"old-"+CharacterData.MALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME,
						"old-"+CharacterData.MALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_SUPERVISOR,
					emotions:[
						"old-"+CharacterData.MALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME,
						"old-"+CharacterData.MALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_SELF_EMPLOYED,
					emotions:[
						"old-"+CharacterData.MALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME,
						"old-"+CharacterData.MALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_RETIRED,
					emotions:[
						"old-"+CharacterData.MALE_OCCUPATION_RETIRED_TEMPLATE_NAME,
						"old-"+CharacterData.MALE_OCCUPATION_RETIRED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_PROFESSIONAL,
					emotions:[
						"old-"+CharacterData.MALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME,
						"old-"+CharacterData.MALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_INTERMEDIATE,
					emotions:[
						"old-"+CharacterData.MALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME,
						"old-"+CharacterData.MALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_EXECUTIVE,
					emotions:[
						"old-"+CharacterData.MALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME,
						"old-"+CharacterData.MALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_CIVIL_SERVANT,
					emotions:[
						"old-"+CharacterData.MALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME,
						"old-"+CharacterData.MALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_CAREER_STARTER,
					emotions:[
						"old-"+CharacterData.MALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME,
						"old-"+CharacterData.MALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME+"-sad"
					]
				}
			],
			emotions:null
		},
		{
			id:CharacterData.CHARACTER_YOUNG_WOMAN_IDENTIFICATION,
			occupations:[
				{
					id:CharacterData.OCCUPATION_NOT_SPECIFIED,
					emotions:[
						'young-'+CharacterData.FEMALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME,
						'young-'+CharacterData.FEMALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_STUDENT,
					emotions:[
						'young-'+CharacterData.FEMALE_OCCUPATION_STUDENT_TEMPLATE_NAME,
						'young-'+CharacterData.FEMALE_OCCUPATION_STUDENT_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_UNEMPLOYED,
					emotions:[
						'young-'+CharacterData.FEMALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME,
						'young-'+CharacterData.FEMALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_SUPERVISOR,
					emotions:[
						'young-'+CharacterData.FEMALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME,
						'young-'+CharacterData.FEMALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_SELF_EMPLOYED,
					emotions:[
						'young-'+CharacterData.FEMALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME,
						'young-'+CharacterData.FEMALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_RETIRED,
					emotions:[
						'young-'+CharacterData.FEMALE_OCCUPATION_RETIRED_TEMPLATE_NAME,
						'young-'+CharacterData.FEMALE_OCCUPATION_RETIRED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_PROFESSIONAL,
					emotions:[
						'young-'+CharacterData.FEMALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME,
						'young-'+CharacterData.FEMALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_INTERMEDIATE,
					emotions:[
						'young-'+CharacterData.FEMALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME,
						'young-'+CharacterData.FEMALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_EXECUTIVE,
					emotions:[
						'young-'+CharacterData.FEMALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME,
						'young-'+CharacterData.FEMALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_CIVIL_SERVANT,
					emotions:[
						'young-'+CharacterData.FEMALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME,
						'young-'+CharacterData.FEMALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_CAREER_STARTER,
					emotions:[
						'young-'+CharacterData.FEMALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME,
						'young-'+CharacterData.FEMALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME+"-sad"
					]
				}
			],
			emotions:null
		},
		{
			id:CharacterData.CHARACTER_WOMAN_IDENTIFICATION,
			occupations:[
				{
					id:CharacterData.OCCUPATION_NOT_SPECIFIED,
					emotions:[
						CharacterData.FEMALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME,
						CharacterData.FEMALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_STUDENT,
					emotions:[
						CharacterData.FEMALE_OCCUPATION_STUDENT_TEMPLATE_NAME,
						CharacterData.FEMALE_OCCUPATION_STUDENT_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_UNEMPLOYED,
					emotions:[
						CharacterData.FEMALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME,
						CharacterData.FEMALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_SUPERVISOR,
					emotions:[
						CharacterData.FEMALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME,
						CharacterData.FEMALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_SELF_EMPLOYED,
					emotions:[
						CharacterData.FEMALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME,
						CharacterData.FEMALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_RETIRED,
					emotions:[
						CharacterData.FEMALE_OCCUPATION_RETIRED_TEMPLATE_NAME,
						CharacterData.FEMALE_OCCUPATION_RETIRED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_PROFESSIONAL,
					emotions:[
						CharacterData.FEMALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME,
						CharacterData.FEMALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_INTERMEDIATE,
					emotions:[
						CharacterData.FEMALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME,
						CharacterData.FEMALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_EXECUTIVE,
					emotions:[
						CharacterData.FEMALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME,
						CharacterData.FEMALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_CIVIL_SERVANT,
					emotions:[
						CharacterData.FEMALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME,
						CharacterData.FEMALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_CAREER_STARTER,
					emotions:[
						CharacterData.FEMALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME,
						CharacterData.FEMALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME+"-sad"
					]
				}
			],
			emotions:null
		},
		{
			id:CharacterData.CHARACTER_OLD_WOMAN_IDENTIFICATION,
			occupations:[
				{
					id:CharacterData.OCCUPATION_NOT_SPECIFIED,
					emotions:[
						'old-'+CharacterData.FEMALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME,
						'old-'+CharacterData.FEMALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_STUDENT,
					emotions:[
						'old-'+CharacterData.FEMALE_OCCUPATION_STUDENT_TEMPLATE_NAME,
						'old-'+CharacterData.FEMALE_OCCUPATION_STUDENT_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_UNEMPLOYED,
					emotions:[
						'old-'+CharacterData.FEMALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME,
						'old-'+CharacterData.FEMALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_SUPERVISOR,
					emotions:[
						'old-'+CharacterData.FEMALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME,
						'old-'+CharacterData.FEMALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_SELF_EMPLOYED,
					emotions:[
						'old-'+CharacterData.FEMALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME,
						'old-'+CharacterData.FEMALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_RETIRED,
					emotions:[
						'old-'+CharacterData.FEMALE_OCCUPATION_RETIRED_TEMPLATE_NAME,
						'old-'+CharacterData.FEMALE_OCCUPATION_RETIRED_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_PROFESSIONAL,
					emotions:[
						'old-'+CharacterData.FEMALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME,
						'old-'+CharacterData.FEMALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_INTERMEDIATE,
					emotions:[
						'old-'+CharacterData.FEMALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME,
						'old-'+CharacterData.FEMALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_EXECUTIVE,
					emotions:[
						'old-'+CharacterData.FEMALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME,
						'old-'+CharacterData.FEMALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_CIVIL_SERVANT,
					emotions:[
						'old-'+CharacterData.FEMALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME,
						'old-'+CharacterData.FEMALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_CAREER_STARTER,
					emotions:[
						'old-'+CharacterData.FEMALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME,
						'old-'+CharacterData.FEMALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME+"-sad"
					]
				}
			],
			emotions:null
		},
		{
			id:CharacterData.CHARACTER_GRAND_FATHER_STATUS_IDENTIFICATION,
			occupations:[
				{
					id:CharacterData.OCCUPATION_NOT_SPECIFIED,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_STUDENT,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_UNEMPLOYED,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_SUPERVISOR,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_SELF_EMPLOYED,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_RETIRED,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_PROFESSIONAL,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_INTERMEDIATE,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_EXECUTIVE,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_CIVIL_SERVANT,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_CAREER_STARTER,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				}
			],
			emotions:null
		},
		{
			id:CharacterData.CHARACTER_GRAND_MOTHER_STATUS_IDENTIFICATION,
			occupations:[
				{
					id:CharacterData.OCCUPATION_NOT_SPECIFIED,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_STUDENT,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_UNEMPLOYED,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_SUPERVISOR,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_SELF_EMPLOYED,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_RETIRED,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_PROFESSIONAL,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_INTERMEDIATE,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_EXECUTIVE,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_CIVIL_SERVANT,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				},
				{
					id:CharacterData.OCCUPATION_CAREER_STARTER,
					emotions:[
						CharacterData.GRAND_FATHER_TEMPLATE_NAME,
						CharacterData.GRAND_FATHER_TEMPLATE_NAME+"-sad"
					]
				}
			],
			emotions:null
		}
	]


	CharacterEmotion.DEFAULTS = {
		// no defaults for now
		isDebug: true,
		gender: CharacterData.NOT_IDENTIFY,
		age: 30,
		occupation: '', //not specified
		emotion: CharacterEmotion.EMOTION_TYPE_DEFAULT,
		widthMax: 66,
		heightMax: 293,
		isActiveEvent: false,
		isMobileWebSimulator: false
	};

	CharacterEmotion.prototype = {
		constructor: CharacterEmotion,

		$el: null,
		el: null,

		//data confige
		emotionImageListData : null,
		gender: null,


		//all component
		$ageLabel: null,
		$ageImage: null,
		$ageTitleSection: null,
		$emotionImageSection: null,

		//temporary storage
		clickPos: null,
		cachedHeight: null,
		cachedOffset: null,
		temporaryAge: -1,
		selectedAge: -1,
		occupation: "", //current occupation


		emotionImgInstanceList: null,
		renderedImgIndex: null,

		//for public
		emotionImageSectionOffset: null,

		//for check long press event
		timeoutId: null,
		isSatisfyLongPress: null,
		isDetectingLongPress:null,

		renderItems: function() {

		},

		//this method must call after $el is added into DOM
		initialize: function () {
			var self = this;
			this.initComponent();
			this.bindEvents();
			this.initDefaultValue();
		},

		bindEvents: function() {
			this.activeAction(this.options.isActiveEvent);
		},

		initComponent: function() {
			this.getValueFromOption();

			this.$emotionImageSection = this.$el.find(".character-image-section");

			this.initImgInstanceList();

			this.renderEmotion(this.emotion);

			this.resetTheGradientIdOfSVG();

		},

		resetTheGradientIdOfSVG: function() {
			for (var index = 0; index < this.emotionImgInstanceList.length; index++) {
				var instanceElement = this.emotionImgInstanceList[index];

				var linearGradientElementList = instanceElement.find("linearGradient");
				for (var i = 0; i < linearGradientElementList.length; i++) {
					var linearGradientElement = $(linearGradientElementList.get(i));
					var id = linearGradientElement.attr("id");
					if (id !== "") {
						var newValue = id + new Date().getTime();
						linearGradientElement.attr("id", newValue);
						var fillTemplate = "[fill='url(#" + id +")']";
						var anotherFillTemplate = "[style='fill:url(#" + id +");']";
						//console.log("==anotherFillTemplate " + anotherFillTemplate);
						var newValueForFill = "url(#" + newValue + ")";
						var referenceElement = instanceElement.find(fillTemplate);
						referenceElement.attr("fill", newValueForFill);

						var anotherReferenceElement = instanceElement.find(anotherFillTemplate);
						anotherReferenceElement.css("fill", newValueForFill);
					}
				}
			}
		},

		getValueFromOption: function() {

			this.options.heightMax = CharacterEmotion.FEMALE_MAX_HEIGHT;
			this.options.widthMax = CharacterEmotion.FEMALE_MAX_WIDTH;


			this.gender = this.options.gender;
			this.age = this.options.age;
			this.occupation = this.options.occupation;
			this.emotion = this.options.emotion;

			//get the identification given the gender and age
			this.identification = CharacterData.getIdentificationByAge(this.age, this.gender);

			this.emotionImageListData = [];

			var idTemplates =[];
			for(var j=0; j<CharacterEmotion.TEMPLATE_LIST.length; j++){
				var idObj = CharacterEmotion.TEMPLATE_LIST[j];
				if(idObj.id == this.identification){
					idTemplates = idObj;
					break;
				}
			}

			var hasOccupation = $.isArray(idTemplates.occupations);
			console.log("CharacterEmotion::getValueFromOption", this.age, this.identification, idTemplates, hasOccupation);

			if(hasOccupation){
				//find the occupation
				var occupationEmotions = [];
				for(var i=0; i<idTemplates.occupations.length; i++){
					var occupationObj = idTemplates.occupations[i];
					if(occupationObj.id == this.occupation){
						this.emotionImageListData = occupationObj.emotions;
						break;
					}
				}
			}
			else if(idTemplates.emotions){
				this.emotionImageListData = idTemplates.emotions;
			}


			console.log("CharacterEmotion::getValueFromOption", this.emotionImageListData);

		},

		getCharClassById:function(){
			switch(this.identification){
				case CharacterData.CHARACTER_BABY_BOY_IDENTIFICATION:
					return CharacterEmotion.CHAR_LIST_SVG_CLASSES[0];
					break;
				case CharacterData.CHARACTER_BOY_IDENTIFICATION:
				case CharacterData.CHARACTER_GIRL_IDENTIFICATION:
					return CharacterEmotion.CHAR_LIST_SVG_CLASSES[1];
					break;
				case CharacterData.CHARACTER_TEEN_BOY_IDENTIFICATION:
				case CharacterData.CHARACTER_TEEN_BOY_IDENTIFICATION:
					return CharacterEmotion.CHAR_LIST_SVG_CLASSES[2];
					break;
				case CharacterData.CHARACTER_MAN_IDENTIFICATION:
				case CharacterData.HARACTER_WOMAN_IDENTIFICATION:
					return CharacterEmotion.CHAR_LIST_SVG_CLASSES[4];
					break;
				case CharacterData.CHARACTER_GRAND_FATHER_STATUS_IDENTIFICATION:
				case CharacterData.CHARACTER_GRAND_FATHER_STATUS_IDENTIFICATION:
					return CharacterEmotion.CHAR_LIST_SVG_CLASSES[4];
					break;
			}
		},


		initImgInstanceList: function() {
			this.$emotionImageSection.empty();
			this.emotionImgInstanceList = [];

			for (var i = 0; i < this.emotionImageListData.length; i++) {
				var charOjbect = {
					charClass: this.getCharClassById(),
					//src:this.emotionImageListData[i],
					width:this.options.widthMax+'px',
					height:this.options.heightMax+'px'
				};

				var template = Templates.getTemplate('character-image');
				var $imgobj = $(template(charOjbect));
				var characterSVGTemplate = Templates.getTemplate(this.emotionImageListData[i]);
				var $characterElement = $(characterSVGTemplate({}));
				$characterElement.css({
					"width": "100%",
					"height": "100%"
				});
				$imgobj.find(".age-image").append($characterElement);

				this.$emotionImageSection.append($imgobj);
				$imgobj.hide();
				this.emotionImgInstanceList.push($imgobj);
			}
		},


		initDefaultValue: function() {

			this.$emotionImageSection.css({
				"width": this.options.widthMax + "px",
				"height": this.options.heightMax + "px"
			});

			this.$el.css({
				"width": this.options.widthMax + "px",
				"height": this.options.heightMax + "px"
			});

			//get age section offset
			/*
			var containerOffset = this.$el.offset();
			var ageOffset = this.$emotionImageSection.offset();
			this.emotionImageSectionOffset  = {
				"top": ageOffset.top - containerOffset.top,
				"left": ageOffset.left - containerOffset.left
			};
			*/

		},


		renderEmotion: function(emotion) {
			this.emotion = emotion;

			var $targetObj = null;
			for (var i = 0; i < this.emotionImgInstanceList.length; i++) {
				var $objItem = this.emotionImgInstanceList[i];
				if (i === parseInt(this.emotion)) {
					$objItem.show();
					$targetObj = $objItem;
				} else {
					$objItem.hide();
				}
			}

		},



		log: function(msg) {
			if (this.options.isDebug) {
				console.log(msg);
			}
		},


		activeAction: function(isActive) {
			console.log("==isActive " + isActive);
			this.options.isActiveEvent = isActive;

			if (isActive) {
				var self = this;
			} else {

			}
		},

		resetToInitialState: function() {
			this.activeAction(false);
			this.emotion = this.options.emotion;
			this.renderEmotion(this.emotion);
		}

	};

	CharacterEmotion.htmlTemplate = "<div class='character-age'>" +
						"<div class='character-image-section'>"+
							"<img class='age-image'>" +
							"</img>" +
						"</div>" +
					"</div>";

	// exports
	pos.CharacterEmotion = CharacterEmotion;
}(pos, jQuery, app.Templates, app.I18nHelper, data.CharacterData));