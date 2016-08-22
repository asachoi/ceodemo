/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var pos = pos || {};
var data = data || {};

(function(pos, $, Templates, I18nHelper) {
	'use strict';
	/**
	 * CharacterAge component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 *  This class control the changing age and occupation of character by using drag, drop
	 *  each period age has range, and has an image for range
	 */
	function CharacterAge(element, options) {

		if (element) {
			this.$el  = $(element);
		} else {
			this.$el = $(CharacterAge.htmlTemplate);
		}

		this.el = this.$el[0];

		// store this instance to data object so that I can retrieve it later
		this.$el.data('character_age', this);
		this.options   = $.extend({}, CharacterAge.DEFAULTS, options);
		console.log("CharacterAge:options:", this.options);
		//this.initialize();
	}

	CharacterAge.VERSION  = '3.3.1';

	CharacterAge.STATE_SELECTED_AGE = "ch_selected_age";
	CharacterAge.EVENT_CHANGE = "character_change";

	CharacterAge.EVENT_START_DRAG = "character_age_event_start_drag";
	CharacterAge.EVENT_DRAGING = "character_age_event_dragged";
	CharacterAge.EVENT_END_DRAG = "character_age_event_end_drag";

	CharacterAge.EVENT_SWIPE = "character_age_event_swipe";

	CharacterAge.MALE_LIST_ELEMENT_TEMPLATE_NAME = [
		data.CharacterData.BABY_TEMPLATE_NAME,
		data.CharacterData.INFANT_BOY_TEMPLATE_NAME,
		data.CharacterData.BOY_TEMPLATE_NAME,
		data.CharacterData.TEEN_BOY_TEMPLATE_NAME,
		data.CharacterData.YOUNG_MAN_TEMPLATE_NAME,
		data.CharacterData.MAN_TEMPLATE_NAME,
		data.CharacterData.OLD_MAN_TEMPLATE_NAME,
		data.CharacterData.GRAND_FATHER_TEMPLATE_NAME
	];

	CharacterAge.MALE_RANGE = data.CharacterData.MALE_RANGE;


	CharacterAge.MALE_MAX_WIDTH = 560;
	CharacterAge.MALE_MAX_HEIGHT = 280;
	CharacterAge.FEMALE_MAX_WIDTH = 560;
	CharacterAge.FEMALE_MAX_HEIGHT = 280;

	CharacterAge.FEMALE_LIST_ELEMENT_TEMPLATE_NAME = [
		data.CharacterData.BABY_TEMPLATE_NAME,
		data.CharacterData.INFANT_GIRL_TEMPLATE_NAME,
		data.CharacterData.GIRL_TEMPLATE_NAME,
		data.CharacterData.TEEN_GIRL_TEMPLATE_NAME,
		data.CharacterData.YOUNG_WOMAN_TEMPLATE_NAME,
		data.CharacterData.WOMAN_TEMPLATE_NAME,
		data.CharacterData.OLD_WOMAN_TEMPLATE_NAME,
		data.CharacterData.GRAND_MOTHER_TEMPLATE_NAME
	];

	CharacterAge.FEMALE_OCCUPATION_LIST_TEMPLATE_NAME = [
		{id:data.CharacterData.OCCUPATION_NOT_SPECIFIED, svg:data.CharacterData.FEMALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_STUDENT, svg:data.CharacterData.FEMALE_OCCUPATION_STUDENT_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_STUDENT, svg:data.CharacterData.FEMALE_OCCUPATION_STUDENT_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_UNEMPLOYED, svg:data.CharacterData.FEMALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_SUPERVISOR, svg:data.CharacterData.FEMALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_SELF_EMPLOYED, svg:data.CharacterData.FEMALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_RETIRED, svg:data.CharacterData.FEMALE_OCCUPATION_RETIRED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_PROFESSIONAL, svg:data.CharacterData.FEMALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_INTERMEDIATE, svg:data.CharacterData.FEMALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_EXECUTIVE, svg:data.CharacterData.FEMALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_CIVIL_SERVANT, svg:data.CharacterData.FEMALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_CAREER_STARTER, svg:data.CharacterData.FEMALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME}
	];

	CharacterAge.MALE_OCCUPATION_LIST_TEMPLATE_NAME = [
		{id:data.CharacterData.OCCUPATION_NOT_SPECIFIED, svg:data.CharacterData.MALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_STUDENT, svg:data.CharacterData.MALE_OCCUPATION_STUDENT_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_UNEMPLOYED, svg:data.CharacterData.MALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_SUPERVISOR, svg:data.CharacterData.MALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_SELF_EMPLOYED, svg:data.CharacterData.MALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_RETIRED, svg:data.CharacterData.MALE_OCCUPATION_RETIRED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_PROFESSIONAL, svg:data.CharacterData.MALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_INTERMEDIATE, svg:data.CharacterData.MALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_EXECUTIVE, svg:data.CharacterData.MALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_CIVIL_SERVANT, svg:data.CharacterData.MALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_CAREER_STARTER, svg:data.CharacterData.MALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME}
	];


	CharacterAge.OLD_FEMALE_OCCUPATION_LIST_TEMPLATE_NAME = [
		{id:data.CharacterData.OCCUPATION_NOT_SPECIFIED, svg:'old-'+data.CharacterData.FEMALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_STUDENT, svg:'old-'+data.CharacterData.FEMALE_OCCUPATION_STUDENT_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_UNEMPLOYED, svg:'old-'+data.CharacterData.FEMALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_SUPERVISOR, svg:'old-'+data.CharacterData.FEMALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_SELF_EMPLOYED, svg:'old-'+data.CharacterData.FEMALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_RETIRED, svg:'old-'+data.CharacterData.FEMALE_OCCUPATION_RETIRED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_PROFESSIONAL, svg:'old-'+data.CharacterData.FEMALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_INTERMEDIATE, svg:'old-'+data.CharacterData.FEMALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_EXECUTIVE, svg:'old-'+data.CharacterData.FEMALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_CIVIL_SERVANT, svg:'old-'+data.CharacterData.FEMALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_CAREER_STARTER, svg:'old-'+data.CharacterData.FEMALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME}
	];

	CharacterAge.YOUNG_FEMALE_OCCUPATION_LIST_TEMPLATE_NAME = [
		{id:data.CharacterData.OCCUPATION_NOT_SPECIFIED, svg:'young-'+data.CharacterData.FEMALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_STUDENT, svg:'young-'+data.CharacterData.FEMALE_OCCUPATION_STUDENT_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_UNEMPLOYED, svg:'young-'+data.CharacterData.FEMALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_SUPERVISOR, svg:'young-'+data.CharacterData.FEMALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_SELF_EMPLOYED, svg:'young-'+data.CharacterData.FEMALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_RETIRED, svg:'young-'+data.CharacterData.FEMALE_OCCUPATION_RETIRED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_PROFESSIONAL, svg:'young-'+data.CharacterData.FEMALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_INTERMEDIATE, svg:'young-'+data.CharacterData.FEMALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_EXECUTIVE, svg:'young-'+data.CharacterData.FEMALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_CIVIL_SERVANT, svg:'young-'+data.CharacterData.FEMALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_CAREER_STARTER, svg:'young-'+data.CharacterData.FEMALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME}
	];

	CharacterAge.OLD_MALE_OCCUPATION_LIST_TEMPLATE_NAME = [
		{id:data.CharacterData.OCCUPATION_NOT_SPECIFIED, svg:'old-'+data.CharacterData.MALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_STUDENT, svg:'old-'+data.CharacterData.MALE_OCCUPATION_STUDENT_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_UNEMPLOYED, svg:'old-'+data.CharacterData.MALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_SUPERVISOR, svg:'old-'+data.CharacterData.MALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_SELF_EMPLOYED, svg:'old-'+data.CharacterData.MALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_RETIRED, svg:'old-'+data.CharacterData.MALE_OCCUPATION_RETIRED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_PROFESSIONAL, svg:'old-'+data.CharacterData.MALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_INTERMEDIATE, svg:'old-'+data.CharacterData.MALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_EXECUTIVE, svg:'old-'+data.CharacterData.MALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_CIVIL_SERVANT, svg:'old-'+data.CharacterData.MALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_CAREER_STARTER, svg:'old-'+data.CharacterData.MALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME}
	];

	CharacterAge.YOUNG_MALE_OCCUPATION_LIST_TEMPLATE_NAME = [
		{id:data.CharacterData.OCCUPATION_NOT_SPECIFIED, svg:'young-'+data.CharacterData.MALE_OCCUPATION_NOT_SPECIFIED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_STUDENT, svg:'young-'+data.CharacterData.MALE_OCCUPATION_STUDENT_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_UNEMPLOYED, svg:'young-'+data.CharacterData.MALE_OCCUPATION_UNEMPLOYED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_SUPERVISOR, svg:'young-'+data.CharacterData.MALE_OCCUPATION_SUPERVISOR_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_SELF_EMPLOYED, svg:'young-'+data.CharacterData.MALE_OCCUPATION_SELF_EMPLOYED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_RETIRED, svg:'young-'+data.CharacterData.MALE_OCCUPATION_RETIRED_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_PROFESSIONAL, svg:'young-'+data.CharacterData.MALE_OCCUPATION_PROFESSIONAL_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_INTERMEDIATE, svg:'young-'+data.CharacterData.MALE_OCCUPATION_INTERMEDIATE_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_EXECUTIVE, svg:'young-'+data.CharacterData.MALE_OCCUPATION_EXECUTIVE_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_CIVIL_SERVANT, svg:'young-'+data.CharacterData.MALE_OCCUPATION_CIVIL_SERVANT_TEMPLATE_NAME},
		{id:data.CharacterData.OCCUPATION_CAREER_STARTER, svg:'young-'+data.CharacterData.MALE_OCCUPATION_CAREER_STARTER_TEMPLATE_NAME}
	];


	//classes inserted in the svg container
	//this is used to control the size of the svg
	//this applies for both male and female
	CharacterAge.CHAR_LIST_SVG_CLASSES = [
		"char-baby",
		"char-infant",
		"char-preteen",
		"char-teen",
		"char-young-adult",
		"char-adult",
		"char-old",
		"char-dependent"
	];


	//constant for long press detection
	CharacterAge.LONG_PRESS_MAX_TIME = 250;
	CharacterAge.LONG_PRESS_MAX_DISTANCE = 100000;	//mean we dont care about the max distance

	CharacterAge.DEFAULTS = {
		// no defaults for now
		isDebug: true,
		gender: data.CharacterData.NOT_IDENTIFY,
		occupation: '', //not specified
		ageImageList: [],
		ageMin: 20,
		ageMax: 80,
		initAge: 30,
		widthMax: 66,
		heightMax: 293,
		realWidth: 100,
		isActiveEvent: false,
		isMobileWebSimulator: false,
		allowedSwipeDirection: ["up","down"]
	};

	CharacterAge.prototype = {
		constructor: CharacterAge,

		$el: null,
		el: null,

		//data config
		ageImageListData : null,
		ageMin: -1,
		ageMax: -1,
		gender: null,


		//all component
		$ageLabel: null,
		$ageImage: null,
		$ageTitleSection: null,
		$ageImageSection: null,

		//temporary storage
		clickPos: null,
		cachedHeight: null,
		cachedOffset: null,
		temporaryAge: -1,
		selectedAge: -1,
		occupation: "", //current occupation


		ageImgInstanceList: null,
		renderedImgIndex: null,

		//for public
		ageImageSectionOffset: null,

		//for check long press event
		timeoutId: null,
		isSatisfyLongPress: null,
		isDetectingLongPress:null,

		renderItems: function() {

		},

		//this method must call after $el is added into DOM
		initialize: function () {
			var self = this;

			console.log("CharacterAge:initialize:", self.options);


			this.$el.swipe({
				//Generic swipe handler for all directions
				swipe:function(event, direction, distance, duration, fingerCount, fingerData) {

					//console.log("CharacterAge:swipe:", self.options.allowedSwipeDirection, direction);

					//restrict swipe vertical directions only
					if( $.isArray(self.options.allowedSwipeDirection) && ($.inArray(direction,self.options.allowedSwipeDirection) == -1)){
						return false;
					}

					self.$el.trigger(CharacterAge.EVENT_SWIPE, [self]);

				},
				//Default is 75px, set to 0 for demo so any distance triggers swipe
				threshold:10,
				maxTimeThreshold: 200
			});
			this.initComponent();
			this.bindEvents();
			this.initDefaultValue();

			this.resetDectectLongPress();
		},

		bindEvents: function() {
			this.activeAction(this.options.isActiveEvent);
		},

		initComponent: function() {
			this.getValueFromOption();

			this.clickPos = {
				"x" : 0,
				"y" : 0
			};

			//component
			this.$ageLabel = this.$el.find(".age-section .age-num");
			//this.$ageImage = this.$el.find(".character-image-section .age-image");
			this.$ageTitleSection = this.$el.find(".age-section");
			this.$ageImageSection = this.$el.find(".character-image-section");

			this.initImgInstanceList();

			this.selectedAge = this.options.initAge;
			this.occupation = this.options.occupation;
			this.renderAge(this.selectedAge);
			this.renderOccupation(this.occupation);

			/*
			if (window.count === null || window.count === undefined) {
				window.count = 0;
			}
			this.$el.find("svg #face_1_").attr("id", "face_1_" + window.count);
			var newValue = "url(#face_1_" + window.count + ")";
			this.$el.find("[fill='url(#face_1_)']").attr("fill", newValue);
			window.count ++;
			*/
			this.resetTheGradientIdOfSVG();
		},

		resetTheGradientIdOfSVG: function() {
			for (var index = 0; index < this.ageImgInstanceList.length; index++) {
				var instanceElement = this.ageImgInstanceList[index];

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
			this.ageMin = this.options.ageMin;
			this.ageMax = this.options.ageMax;
			this.gender = this.options.gender;
			if (this.gender === data.CharacterData.MALE) {
				this.ageImageListData = CharacterAge.MALE_LIST_ELEMENT_TEMPLATE_NAME;

				this.options.heightMax = CharacterAge.MALE_MAX_HEIGHT;
				this.options.widthMax = CharacterAge.MALE_MAX_WIDTH;

			} else if (this.gender === data.CharacterData.FEMALE) {
				this.ageImageListData = CharacterAge.FEMALE_LIST_ELEMENT_TEMPLATE_NAME;

				this.options.heightMax = CharacterAge.FEMALE_MAX_HEIGHT;
				this.options.widthMax = CharacterAge.FEMALE_MAX_WIDTH;
			} else {
				this.ageImageListData = this.options.ageImageList;
			}
		},

		initImgInstanceList: function() {
			this.$ageImageSection.empty();
			this.ageImgInstanceList = [];

			for (var i = 0; i < this.ageImageListData.length; i++) {
				var charOjbect = {
					charClass:CharacterAge.CHAR_LIST_SVG_CLASSES[i],
					//src:this.ageImageListData[i],
					width:this.options.widthMax+'px',
					height:this.options.heightMax+'px'
				};

				var template = Templates.getTemplate('character-image');
				var $imgobj = $(template(charOjbect));
				var characterSVGTemplate = Templates.getTemplate(this.ageImageListData[i]);
				var $characterElement = $(characterSVGTemplate({}));
				$characterElement.css({
					"width": "100%",
					"height": "100%"
				});
				$imgobj.find(".age-image").append($characterElement);

				this.$ageImageSection.append($imgobj);
				$imgobj.hide();
				this.ageImgInstanceList.push($imgobj);
			}
		},


		initDefaultValue: function() {
			var leftPos = - (this.options.widthMax / 2 - this.options.realWidth / 2);
			this.$ageImageSection.css({
				"width": this.options.widthMax + "px",
				"height": this.options.heightMax + "px",
				"left" : leftPos + "px"
			});

			this.$el.css({
				"width": this.options.realWidth + "px",
				"height": this.options.heightMax + "px"
			});

			//get age section offset
			var containerOffset = this.$el.offset();
			var ageOffset = this.$ageImageSection.offset();
			this.ageImageSectionOffset  = {
				"top": ageOffset.top - containerOffset.top,
				"left": 0
				//"left": ageOffset.left - containerOffset.left
			};

			this.hideAgeSection();
		},


		/**
		 * get the character image based on the passed parameter
		 * @param identify - gender of the character
		 * @param age - age of the character
		 * @returns {number}
		 */
		getIndexImageFromRangeByAge: function(identify, age) {

			if (identify === data.CharacterData.NOT_IDENTIFY) {
				//dont support if not identify
				return -1;
			}

			var rangeList = CharacterAge.MALE_RANGE;
			for (var i = 0; i < rangeList.length; i++) {
				var range = rangeList[i];
				if (age >= range[0] && range[1] >= age) {
					return i;
				}
			}

			return -1;
		},


		/**
		 * the the image for the occupation
		 */
		getOccupationImage: function(age, gender){
			var list;

			var minWorkingAge = data.CharacterData.PERIOD_YOUNG_MAN_WOMAN[0];
			var maxWorkingAge = data.CharacterData.PERIOD_OLDMAN_WOMAN[1];
			var withInWorkingAge = (age >= minWorkingAge && age <= maxWorkingAge);

			var identification = data.CharacterData.getIdentificationByAge(age, gender);
			var isDependent = (identification === data.CharacterData.CHARACTER_GRAND_FATHER_STATUS_IDENTIFICATION ||
					identification === data.CharacterData.CHARACTER_GRAND_MOTHER_STATUS_IDENTIFICATION) ? true : false;
			if (isDependent) {
				return "";	//dont need occupation if it is grandpa or grandma
			}

			//console.log("CharacterAge::getOccupationImage:age->",this.selectedAge);
			if(withInWorkingAge){
				if(gender === data.CharacterData.FEMALE){
					if(age < data.CharacterData.PERIOD_MAN_WOMAN[0]){
						console.log("CharacterAge::getOccupationImage:young woman");
						list = CharacterAge.YOUNG_FEMALE_OCCUPATION_LIST_TEMPLATE_NAME;
					} else if(age < data.CharacterData.PERIOD_OLDMAN_WOMAN[0]){
						console.log("CharacterAge::getOccupationImage:woman");
						list = CharacterAge.FEMALE_OCCUPATION_LIST_TEMPLATE_NAME;
					} else{
						console.log("CharacterAge::getOccupationImage:old woman");
						list = CharacterAge.OLD_FEMALE_OCCUPATION_LIST_TEMPLATE_NAME;
					}
				}
				else if(gender === data.CharacterData.MALE){
					if(age < data.CharacterData.PERIOD_MAN_WOMAN[0]){
						console.log("CharacterAge::getOccupationImage:young man");
						list = CharacterAge.YOUNG_MALE_OCCUPATION_LIST_TEMPLATE_NAME;
					} else if(age < data.CharacterData.PERIOD_OLDMAN_WOMAN[0]){
						console.log("CharacterAge::getOccupationImage:man");
						list = CharacterAge.MALE_OCCUPATION_LIST_TEMPLATE_NAME;
					} else{
						console.log("CharacterAge::getOccupationImage:old man");
						list = CharacterAge.OLD_MALE_OCCUPATION_LIST_TEMPLATE_NAME;
					}
				}
			}

			if(list){
				//alert("lthis.occupation:"+this.occupation);
				for (var i = 0; i < list.length; i++) {
					var item = list[i];
					if (item.id === this.occupation) {
						return item.svg;
					}
				}
			}

			return "";
		},


		renderAge: function(age) {
			age = Math.round(age);
			this.$ageLabel.html(age);

			//choose correct image
			// we divide equally
			var targetIndex = -1;
			if (this.gender === data.CharacterData.NOT_IDENTIFY) {
				var distanceStep = (this.ageMax - this.ageMin) / (this.ageImageListData.length - 1);
				var distance = age - this.ageMin;
				var indexImage = distance / distanceStep;
				targetIndex = Math.round(indexImage);
			} else {
				targetIndex = this.getIndexImageFromRangeByAge(this.gender, age);
			}

			console.log("==targetIndex " + targetIndex + " / "+ this.ageMax + "/ " + this.ageMin + "/ " + age);
			var $targetObj = null;
			for (var i = 0; i < this.ageImgInstanceList.length; i++) {
				var $objItem = this.ageImgInstanceList[i];
				if (targetIndex === i) {
					$objItem.show();
					$targetObj = $objItem;
				} else {
					$objItem.hide();
				}
			}

			//this.renderOccupation();
		},

		renderOccupation: function(occupation){
			this.occupation = occupation;
			var rangeList = CharacterAge.MALE_RANGE;

			for (var i = 0; i < rangeList.length; i++) {
				var range = rangeList[i];
				var age = range[0];

				//we need to replace the source of the woman or man image
				var occupationImage = this.getOccupationImage(age, this.gender);

				var targetIndex = this.getIndexImageFromRangeByAge(this.gender, age);
				if (targetIndex === -1) {
					return;
				}

				var $targetObj = this.ageImgInstanceList[targetIndex];

				if ($targetObj && occupationImage) {
					var newOccuaptionTpl = Templates.getTemplate(occupationImage);
					var $newOccupationElement = $(newOccuaptionTpl({}));
					$newOccupationElement.css({
						"width": "100%",
						"height": "100%"
					});
					$targetObj.find(".age-image").empty();
					$targetObj.find(".age-image").append($newOccupationElement);
				}
			}
		},

		calculateAgeBaseOnDistance: function(distance) {
			var maxAgeDistance = this.ageMax - this.ageMin;
			//var maxDistance = this.$el.height();
			var maxDistance = this.cachedHeight;
			var ratio = 5;	//how much distance for one age
			var age = distance / ratio;
			return parseInt(age);
		},

		//event behavior
		startTouch: function(events) {
			var self = this;
			var documentX = events.originalEvent.pageX;
			var documentY = events.originalEvent.pageY;
			if (this.options.isMobileWebSimulator) {
				//TODO : why using originalEvent.targetTouches[0]????
				documentX = events.originalEvent.targetTouches[0].pageX;
				documentY = events.originalEvent.targetTouches[0].pageY;
			}

			var containerOffset = this.$el.offset();
			this.clickPos.x = documentX - containerOffset.left;
			this.clickPos.y = documentY - containerOffset.top;
			//console.log("===startTouch " + this.clickPos.x + "/ " + this.clickPos.y);

			this.cachedHeight = this.$el.height();
			this.cachedOffset = containerOffset;

			//active event handler
			this.activeDragBehavior(true);

			//console.log("==start long press detection");
			this.isSatisfyLongPress = false;
			this.timeoutId = null;
			this.isDetectingLongPress = true;

			this.timeoutId = setTimeout(function() {
				//console.log("==satisfy long press");
				self.isSatisfyLongPress = true;
				self.timeoutId = null;
				self.isDetectingLongPress = false;

				self.$el.trigger(CharacterAge.EVENT_START_DRAG, [self.selectedAge]);
			}, CharacterAge.LONG_PRESS_MAX_TIME);

			//this.$el.trigger(CharacterAge.EVENT_START_DRAG, [this.selectedAge]);
		},

		resetDectectLongPress: function() {
			this.isSatisfyLongPress = false;
			this.timeoutId = null;
			this.isDetectingLongPress = false;
		},

		startDrag: function(events) {
			var documentX = events.originalEvent.pageX;
			var documentY = events.originalEvent.pageY;
			if (this.options.isMobileWebSimulator) {
				//TODO : why using originalEvent.targetTouches[0]????
				documentX = events.originalEvent.targetTouches[0].pageX;
				documentY = events.originalEvent.targetTouches[0].pageY;
			}


			//var containerOffset = this.$el.offset();
			var containerOffset = this.cachedOffset;

			var dragPos = {};
			dragPos.x = documentX - containerOffset.left;
			dragPos.y = documentY - containerOffset.top;

			//only care about the y position
			var distance = -(dragPos.y - this.clickPos.y);

			//isDetecting and distance > MAX_DISTANCE => invalid long press
			if (this.isDetectingLongPress && Math.abs(distance) > CharacterAge.LONG_PRESS_MAX_DISTANCE) {
				//console.log("==exceed max distance fof long press");
				clearTimeout(this.timeoutId);
				this.resetDectectLongPress();
			} else {
				if (!this.isDetectingLongPress && this.isSatisfyLongPress) {	//not detecting and satification => permit drag
					//console.log("==sastisfy long press for dragging");
					var marginAgeFromSelectedAge = this.calculateAgeBaseOnDistance(distance);
					var targetAge = this.selectedAge + marginAgeFromSelectedAge;
					if (targetAge > this.ageMax) {
						targetAge = this.ageMax;
					}

					if (targetAge < this.ageMin) {
						targetAge = this.ageMin;
					}

					//console.log("==distance " + targetAge + "/ " + marginAgeFromSelectedAge + " / " + this.selectedAge);
					//console.log("==targetAge " + targetAge + " / " + this.ageMin + " / " + this.ageMax + "/ " + this.selectedAge);

					//render the age
					this.renderAge(targetAge);
					this.temporaryAge = targetAge;

					this.$el.trigger(CharacterAge.EVENT_DRAGING, [targetAge]);
				} else {

				}
			}
		},

		//TODO : pay attention in touchend event in ipad, currently, we disable it
		endDrag: function(events) {
			if (this.isDetectingLongPress) {
				console.log("==not enough max time for long press");
				clearTimeout(this.timeoutId);
				this.resetDectectLongPress();
			} else {
				if (!this.isDetectingLongPress && this.isSatisfyLongPress) {	//not detecting and satification => permit drag
					console.log("==sastisfy long press for end drag");
					//this.log("endDrag");
					this.selectedAge = this.temporaryAge;
					this.activeDragBehavior(false);
					this.$el.trigger(CharacterAge.EVENT_CHANGE, [this, this.selectedAge]);

					this.$el.trigger(CharacterAge.EVENT_END_DRAG);
				}
			}
		},

		//drag behavior
		activeDragBehavior: function(isActive) {
			if (isActive) {
				var self = this;

				$(window).on("mousemove touchmove", function(events) {
					events.stopPropagation();

					//handle drag event
					self.startDrag(events);
				});

				$(window).on("mouseup touchend", function(events) {
					events.stopPropagation();

					//handle end drag event
					self.endDrag(events);
				});
			} else {
				$(window).off("mousemove touchend");
				$(window).off("mouseup touchmove");
			}

		},

		log: function(msg) {
			if (this.options.isDebug) {
				console.log(msg);
			}
		},

		hideAgeSection: function() {
			this.$ageTitleSection.css({
				"opacity" : "0"
			});
		},

		showAgeSection: function() {
			this.$ageTitleSection.css({
				"opacity" : "1"
			});
		},

		fadInAgeSection: function() {
			this.$ageTitleSection.animate({
				"opacity" : 1
			}, 500, "swing", function() {

			});
		},

		fadOutAgeSection: function() {
			this.$ageTitleSection.animate({
				"opacity" : 0
			}, 500, "swing", function() {

			});
		},

		activeAction: function(isActive) {
			console.log("==isActive " + isActive);
			this.options.isActiveEvent = isActive;

			if (isActive) {
				var self = this;
				this.$el.on("mousedown touchstart", function(events) {
					events.stopPropagation();
					events.preventDefault();

					//handle click event
					self.startTouch(events);
				});

				this.$el.swipe("enable");
			} else {
				this.$el.off("mousedown touchstart");
				this.$el.swipe("disable");
			}
		},

		activeActionOnlyForSwipe: function() {
			this.$el.swipe("enable");
		},

		resetToInitialState: function() {
			this.activeAction(false);
			this.hideAgeSection();

			this.selectedAge = this.options.initAge;
			this.renderAge(this.selectedAge);
		},

		getImageOffsetPosition: function() {
			return this.ageImageSectionOffset;
		},

		getState: function() {
			var stateObj = {};
			stateObj[CharacterAge.STATE_SELECTED_AGE] = this.selectedAge;

			return stateObj;
		},

		setState: function(state) {
			var age = state[CharacterAge.STATE_SELECTED_AGE];

			this.selectedAge = age;
			this.renderAge(this.selectedAge);
		},

		resetData: function(data) {
			//this.options = data;
			this.options =  $.extend({}, CharacterAge.DEFAULTS, data);

			this.getValueFromOption();

			this.clickPos = {
				"x" : 0,
				"y" : 0
			};

			this.initImgInstanceList();

			this.selectedAge = this.options.initAge;
			this.occupation = this.options.occupation;
			this.renderAge(this.selectedAge);
			this.renderOccupation(this.occupation);

			this.initDefaultValue();

			this.resetTheGradientIdOfSVG();
		},

		getSelectedAge: function() {
			return Math.round(this.selectedAge);
		},

		setSelectedAge: function(age) {
			this.selectedAge = age;
			this.renderAge(this.selectedAge);
			//this.renderOccupation(this.occupation);
			//this.resetTheGradientIdOfSVG();
		},

		getGender:function(){
			return this.gender;
		},


		setOccupation: function(occup) {
			this.occupation = occup;
			this.renderOccupation(this.occupation);

			this.resetTheGradientIdOfSVG();
		}


	};

	CharacterAge.htmlTemplate = "<div class='character-age'>" +
						"<div class='character-image-section'>"+
							"<img class='age-image'>" +
							"</img>" +
						"</div>" +
					"</div>";

	// exports
	pos.CharacterAge = CharacterAge;
}(pos, jQuery, app.Templates, app.I18nHelper));