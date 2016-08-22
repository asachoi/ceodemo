/* © 2014 Aleph-labs.com
 * @author Phuong VO
 */
// namespace
var page = page || {};
page.retirement = page.retirement || {};
var pos = pos || {};
var data = data || {};

(function(retirement, $) {
	'use strict';

	/**
	 * RetirementAnalysis component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function RetirementAnalysis(element, options) {
		this.initialize(element, options);
		this.render();
	}

	RetirementAnalysis.VERSION  = '3.3.1';


	RetirementAnalysis.EVENT_NEXT = "event_next";
	RetirementAnalysis.EVENT_PREVIOUS = "event_previous";




	RetirementAnalysis.DEFAULTS = {
		// no defaults for now
		isDebug:true,
		isStandalone: false
	};


	RetirementAnalysis.prototype = {
		constructor: RetirementAnalysis,

		$el: null,
		el: null,

		customerCharacter: null,
		lifeStyle: null,

		retirementPlanData: null,

		initialize: function(element, options) {
			if (element) {
				this.$el  = $(element);
			} else {
				this.$el = $(this.getDocumentHTML());
			}

			this.el = this.$el[0];

			this.options   = $.extend({}, RetirementAnalysis.DEFAULTS, options);
		},

		render: function() {
			if (this.options.isStandalone) {
				this.initComponent();
				this.bindEvents(true);

				//for standalone data
				var emotionalData = new data.EmotionalFactFindingData();
				emotionalData.getGettingToKnowYouData().setGender(data.CharacterData.MALE);
				emotionalData.getGettingToKnowYouData().setAge(data.CharacterData.AGE_DEFAULT_MAN);
				emotionalData.getGettingToKnowYouData().setMaritalStatus(data.ConfigData.MARITAL_MARRIED.toString());

				this.setData(emotionalData);
			}
		},

		initComponent: function() {

		},

		bindEvents: function(isActiveEvent) {
			var self = this;
			if (isActiveEvent) {
				this.$el.find(".control-container .next").on("click", function() {
					self.nextPageHandler();
				});
				this.$el.find(".control-container .previous").on("click", function() {
					self.previousPageHandler();
				});

			} else {
				this.$el.find(".control-container .next").off("click");
				this.$el.find(".control-container .previous").off("click");
			}
		},

		nextPageHandler: function() {
			this.log("==nextPageHandler");

			this.$el.trigger(RetirementAnalysis.EVENT_NEXT);
		},

		previousPageHandler: function() {
			this.log("==previousPageHandler");
			this.$el.trigger(RetirementAnalysis.EVENT_PREVIOUS);
		},


		log: function(msg) {
			if (this.options.isDebug) {
				console.log(msg);
			}
		},


		//>>>>>>>>>>>>>>for pageElement event >>>>>>>>>>>>
		getDocumentHTML : function() {
			// jshint multistr:true
			return	"<div class='emotional-retirement-analysis'> \
					<div class='left-container'> \
						<p class='title'>Retirement Analysis</p> \
						<div class='content-container'> \
							<div class='retirement-need'> \
								<div class='block-center'> \
									<p class='sub-of-title'>YOU HAVE</p> \
									<p class='sub-value'>5,000,000</p> \
								</div> \
								<div class='block-center line-container'> \
									<p class='sub-of-title'>SHORTFALL</p> \
									<div class='line-item'> \
										<p class='sub-value'>5,000,000</p> \
										<div class='line'></div> \
									</div> \
								</div> \
								<div class='block-center shortfall'> \
									<p class='sub-of-title'>SHORTFALL</p> \
									<p class='sub-value'>5,000,000</p> \
								</div> \
								<div class='block-center line-container'> \
									<p class='sub-of-title'>SHORTFALL</p> \
									<div class='line-item'> \
										<p class='sub-value'>5,000,000</p> \
										<div class='line'></div> \
									</div> \
								</div> \
								<div class='block-center'> \
									<p class='sub-of-title'>YOU NEED</p> \
									<p class='sub-value'>5,000,000</p> \
								</div> \
							</div> \
							<div class='recommended'> \
								<p class='sub-of-title'>RECOMMENDED MONTHLY SAVINGS FOR NEXT 20 YEARS</p> \
								<p class='sub-value'>8,809</p> \
							</div> \
							<div class='your-plan'> \
								<div class='block-center'> \
									<p class='sub-of-title'>WHAT IF YOU DELAY YOUR RETIREMENT</p> \
									<ul id='increment-control' class='increment-control white'> \
										<li class='sub'> \
											<span class='increment-button'></span> \
										</li> \
										<li> \
											<p class='value'></p> \
											<input type='number'/> \
										</li> \
										<li class='add'> \
											<span class='increment-button'></span> \
										</li> \
									</ul> \
								</div> \
								<div class='block-center'> \
									<p class='sub-of-title'>ESTIMATED MONTHLY SAVINGS FOR NEXT 20 YEAR(S)</p> \
									<p class='sub-value'>9,198(+1759)</p> \
								</div> \
							</div> \
						</div> \
						<div class='control-container'> \
							<p class='previous'>PREVIOUS</p> \
							<p class='next'>NEXT</p> \
						</div> \
					</div> \
				</div>";
		},

		onRender: function() {
			this.log("==RetirementAnalysis onRender " );
			this.initComponent();
			this.bindEvents(true);
		},


		//emotionalData is EmotionalFactFindingData
		setData: function(emotionalData) {
			console.log("==setData >>> " + emotionalData.getRetirementPlanData());
			this.retirementPlanData = emotionalData.getRetirementPlanData();

			//show the character accordingly
			var customerGender = emotionalData.getGettingToKnowYouData().getGender();
			var $leftContainer = this.$el.find(".left-container");
			var widthContainer = $leftContainer.width();

			//init customer
			this.customerCharacter = new pos.CharacterAge(null, {
				"gender": customerGender,
				"ageMin" : 1,
				"ageMax" : 80,
				"initAge" : emotionalData.getGettingToKnowYouData().getAge(),
				'widthMax': null,
				'heightMax': null,
				"isActiveEvent": false
			});
			$leftContainer.append(this.customerCharacter.$el);
			this.customerCharacter.initialize();
			this.customerCharacter.$el.css({
				'left' : -200,
				'top' : -100
			});

			this.lifeStyle =  new pos.SVGLifeStyle(null, {

	    		});
			$leftContainer.append(this.lifeStyle.$el);
			this.lifeStyle.initialize(data.retirement.RetirementLifeStyleData.TYPE_BASIC);
			this.lifeStyle.$el.css({
				'left' : widthContainer - this.lifeStyle.$el.width() - 20,
				'top' : 100
			});
		}

	};

	// exports
	var temporaryObj = RetirementAnalysis.prototype;
	RetirementAnalysis.prototype = Object.create(pos.PageElement.prototype);
	$.extend(RetirementAnalysis.prototype, temporaryObj);

	retirement.RetirementAnalysis = RetirementAnalysis;
}(page.retirement, jQuery));