/* © 2014 Aleph-labs.com
 * @author Phuong VO
 */
// namespace
var page = page || {};
var pos = pos || {};

(function(pos, $, ProgressBar, Templates, I18nHelper, CharacterData, HousingData, DreamData) {
	'use strict';

	/**
	 * RightPanelKnowYou component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function RightPanelKnowYou(element, options) {
		if (element) {
			this.$el  = $(element);
		} else {
			this.$el = $(this.getDocumentHTML());
		}

		this.el = this.$el[0];
		// store this instance to data object so that I can retrieve it later
		this.$el.data('right_panel_know_you', this);
		//
		this.options   = $.extend({}, RightPanelKnowYou.DEFAULTS, options);

		this.initComponent();
		this.bindEvents(true);
	}


	RightPanelKnowYou.VERSION  = '3.3.1';

	RightPanelKnowYou.DEFAULTS = {
		isDebug:true
	};


	RightPanelKnowYou.prototype = {
		constructor: RightPanelKnowYou,

		$el: null,
		el: null,

		$objContainer: null,
		progressBar:null,


		bindEvents: function(isActiveEvent) {
			if (isActiveEvent) {


			} else {

			}
		},

		initComponent: function() {
			this.$objContainer = this.$el.find(".object-container");

			//create the progress bar
			this.progressBar = new ProgressBar({container:this.$el.find(".progress-bar-container")});

			//set the height for
			var heightOfRightPanel = this.$el.height();
			var heightOfHeader = this.$el.find(".header").height();
			var heightForContent = heightOfRightPanel - heightOfHeader;
			this.$el.find(".content").css({
				"height": heightForContent + "px"
			});
		},



		log: function(msg) {
			if (this.options.isDebug) {
				console.log(msg);
			}
		},

		/**
		 * add object item
		 * @param $parentContainer - the parent container of the row to be added. This is needed to create grouping
		 * @param objItemData
		 */
		addObjectItem: function($parentContainer, objItemData) {
			/*
			var objHTML = "<div class='obj-item'>" +
					"<span class='character-icon icon-woman'></span>" +
					"<p class='label-bold'>" + objItemData.title + "</p>" +
				"</div>";
			var $objItem = $(objHTML);
			*/


			if(!$parentContainer){
				$parentContainer = this.$objContainer;
			}
			var itemTemplate = Templates.getTemplate('right-panel-item');
			$parentContainer.append(itemTemplate(objItemData));
		},


		/**
		 * update the character display
		 */
		updateCharacter: function(character, maritalStatus){
			var $characterContainer = this.$objContainer.find('.character-list');
			if($characterContainer.length === 0){
				$characterContainer = $("<div class='segment-container character-list'/>");
				this.insertAtIndex(0, $characterContainer);
			}

			//empty the list since we are populating all the items again
			$characterContainer.empty();

			var gender = character.getGender();
			console.log("RightPanelKnowYou::updateCharacter:",gender);
			if(gender !== CharacterData.NOT_IDENTIFY){
				var icon = "";
				var iconSpouse = "";
				var label = "";
				var translationPath = "";
				var suffix ="";

				var charObj = null;
				var spouseObj = null;

				if (gender === CharacterData.FEMALE) {
					charObj = 	CharacterData.getCharacterObj(CharacterData.CHARACTER_WOMAN_IDENTIFICATION);
					spouseObj = CharacterData.getCharacterObj(CharacterData.CHARACTER_MAN_IDENTIFICATION);

				} else if (gender === CharacterData.MALE) {
					charObj = 	CharacterData.getCharacterObj(CharacterData.CHARACTER_MAN_IDENTIFICATION);
					spouseObj = CharacterData.getCharacterObj(CharacterData.CHARACTER_WOMAN_IDENTIFICATION);
				}

				icon = charObj.icon;
				iconSpouse = spouseObj.icon;
				translationPath = charObj.translationPath;
				label = I18nHelper.t(translationPath);

				if(character.getAge() !== 0){
					suffix = " " + character.getAge();
				}

				var obj = {
					icon:icon,
					label:label,
					translationPath:translationPath,
					suffix:suffix
				};

				this.addObjectItem($characterContainer, obj);

				if(maritalStatus === 1 || maritalStatus === true || maritalStatus === "1"){
					var objSpouse = {
						icon:iconSpouse,
						translationPath:'marital_status.married',
						label:I18nHelper.t('marital_status.married')
					};
					this.addObjectItem($characterContainer, objSpouse);
				}
			}
		},




		/**
		 * update dependents list or children list
		 */
		updateDependents: function(dependentsList, isDependent){
			console.log("RightPanelKnowYou::updateDependents:", dependentsList);

			var className = isDependent ? "dependents-list" : "children-list";
			var index = isDependent ? 2 : 1;

			var $dependentsContainer = this.$objContainer.find("."+className);
			if($dependentsContainer.length === 0){
				$dependentsContainer = $("<div class='segment-container " + className + "'/>");
				this.insertAtIndex(index, $dependentsContainer);
			}
			//empty the list since we are populating all the items again
			$dependentsContainer.empty();
			for (var i = 0; i < dependentsList.length; i++) {
				var iData = dependentsList[i];
				var id = iData.getIdentification();

				var charObj = CharacterData.getCharacterObj(id);

				var icon = charObj.icon;
				var translationPath = charObj.translationPath;
				var label = I18nHelper.t(translationPath);
				var suffix ="";

				if(iData.getName() !== ""){
					label = iData.getName();
					translationPath = "";//we reset the translation so that it would not translate
				}


				if (iData.getAge() !== null && iData.getAge() !== undefined) {
					if(!isDependent){
						suffix += " "+iData.getAge();
					}
				}

				var obj = {
					icon:icon,
					label:label,
					translationPath:translationPath,
					suffix:suffix
				};
				this.addObjectItem($dependentsContainer, obj);
			}
		},

		updateHousing: function(housingData){
			console.log("RightPanelKnowYou::updateHousing:", housingData);

			var $housingContainer = this.$objContainer.find('.housing-list');
			if($housingContainer.length === 0){
				$housingContainer = $("<div class='segment-container housing-list'/>");
				this.insertAtIndex(3,$housingContainer);
			}
			//empty the list since we are populating all the items again
			$housingContainer.empty();

			var type = housingData.type;
			//alert("RightPanelKnowYou::type:"+type);
			if(type !== null && type !== undefined){
				var housingObj = HousingData.getHousingObj(type);
				var translationPath = housingObj.translationPath;
				var obj = {
					icon:housingObj.icon,
					translationPath:housingObj.translationPath,
					label: I18nHelper.t(translationPath)
				};
				this.addObjectItem($housingContainer, obj);
			}

		},

		insertAtIndex:function(index, $obj) {
			//alert("insertAtIndex:"+index);

		    var $children = this.$objContainer.find("> *");
		    if(index > $children.length-1){
		    	this.$objContainer.append($obj);
		    }
		    else{
		    	var $before = this.$objContainer.find("> *:nth-child(" + (index + 1)+ ")");
		    	$before.before($obj);
		    }
		},

		updateDream: function(dreamList) {
			var $dreamContainer = this.$objContainer.find('.dream-list');
			if($dreamContainer.length > 0){
				$dreamContainer.empty();
			}

			if(dreamList.length === 0) {
				return;
			}

			var sepTranslationPath = 'generic.your_dreams';
			var sepLabel = I18nHelper.t(sepTranslationPath);
			$dreamContainer = $("<div class='segment-container dream-list'><div class='title-container'><p class='title' data-i18n='"+sepTranslationPath+"'>"+sepLabel+"</p></div><div class='container-items'></div></div>");
			this.insertAtIndex(4,$dreamContainer);



			for (var i = 0; i < dreamList.length; i++) {
				var dreamType = dreamList[i].getDreamType();
				var dreamObj = DreamData.getDreamObjByType(dreamType);
				var icon = dreamObj.icon;
				var translationPath = dreamObj.translationPath;
				var label = I18nHelper.t(translationPath);

				var obj = {
					icon:icon,
					label:label,
					translationPath:translationPath
				};
				var $container = $dreamContainer.find(".container-items");
				this.addObjectItem($container, obj);
			}

		},

		reset:function(){
			//remove all segment containers
			this.$el.find(".segment-container").remove();
		}

	};

	// exports
	pos.RightPanelKnowYou = RightPanelKnowYou;
}(pos, jQuery, pos.ProgressBar, app.Templates, app.I18nHelper, data.CharacterData, data.HousingData, data.DreamData));
