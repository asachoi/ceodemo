/* © 2014 Aleph-labs.com
 * @author Phuong Vo
 */
// namespace
var page = page || {};

(function(page, $) {
	'use strict';

	/**
	 * UserLifeState component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function UserLifeState(element, options) {
		if (element) {
			this.$el  = $(element);
		} else {
			this.$el = $(this.getDocumentHTML());
		}

		this.el = this.$el[0];
		// store this instance to data object so that I can retrieve it later
		this.$el.data('user_landing_screen', this);
		//
		this.options   = $.extend({}, UserLifeState.DEFAULTS, options);

		if (this.options.isStandalone) {
			this.initComponent();
			this.bindEvents();
		}
	}

	UserLifeState.VERSION  = '3.3.1';

	UserLifeState.DEFAULTS = {
			// no defaults for now
			isDebug: true,
			isStandalone: false
	};


	UserLifeState.prototype = {
		constructor: UserLifeState,

		$el: null,
		el: null,

		$sortableControl:null,


		bindEvents: function() {

		},

		initComponent: function() {
			this.$sortableControl = this.$el.find(".sortable");
			this.$sortableControl.sortable({

			});
		},




		//>>>>>>>>>>>>>>for pageElement event >>>>>>>>>>>>
		getDocumentHTML : function() {
			return	"<div class='user-life-stage'>" +
						"<div class='left-container'>" +
							"<div class='header'>" +
							"<div class='img-header'></div>" +
							"</div>" +
							"<div class='middle'>" +
								"<div class='left-content'>" +
									"<p class='text'>Based on your input your life Stage is:</p>" +
									"<div class='growing-family'>" +
									"</div>" +
									"<p class='text'>Growing Family - Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text over since the 1500s</p>" +
								"</div>" +
								"<div class='right-content'>" +
									"<ul class='sortable'>" +
										"<li class='sortable-item'>Product 1</li>" +
										"<li class='sortable-item'>Product 2</li>" +
										"<li class='sortable-item'>Product 3</li>" +
										"<li class='sortable-item'>Product 4</li>" +
										"<li class='sortable-item'>Product 5</li>" +
										"<li class='sortable-item'>Product 6</li>" +
										"<li class='sortable-item'>Product 7</li>" +
									"</ul>" +
								"</div>" +
							"</div>" +
						"</div>" +
					"</div>";
		},

		onRender: function() {
			this.log("==UserLifeState onRender " );
			this.initComponent();
			this.bindEvents();
		},

		onDestroy: function() {
			this.log("==UserLifeState onDestroy ");
		},

		onStart: function() {
			this.log("==UserLifeState onStart ");

		},

		onSavingState: function() {
			return {

			};
		},

		onRestoreState: function(state) {
			this.log("==UserLifeState onRestoreState ");
		},

		log: function(msg) {
			if (this.options.isDebug) {
				console.log(msg);
			}
		},

		setData: function(dataObj) {

		}

	};

	// exports
	page.UserLifeState = UserLifeState;
}(page, jQuery));