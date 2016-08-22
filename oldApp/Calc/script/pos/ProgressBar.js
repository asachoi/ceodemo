/* © 2014 Aleph-labs.com
 * @author Thang Kieu
 */
// namespace
var pos = pos || {};

(function(pos, $, Templates, I18nHelper) {
	'use strict';

	/**
	 * CheckBox component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function ProgressBar(options) {

		// store this instance to data object so that I can retrieve it later
		//this.$el.data('checkbox', this);

		this.options   = $.extend({}, ProgressBar.DEFAULTS, options);

		this.insertToDOM();

		this.initComponent();
		this.bindEvents();

	}


	ProgressBar.DEFAULTS = {
		// no defaults for now
	};



	ProgressBar.prototype = {
		constructor: ProgressBar,

		$el: null,
		el: null,

		max:100,
		value: 50,

		initComponent: function(){
			this.updateProgress();
		},

		bindEvents: function() {

		},

		insertToDOM: function(){

			if(this.options.element){
				this.$el = $(this.options.element);
			}
			else{
				this.$el = $(this.getDocumentHTML());
				this.$container  = $(this.options.container);
				if(this.options.container){
					if(this.options.containerPosition == "prepend"){
						this.$container.prepend(this.$el);
					}
					else{
						this.$container.append(this.$el);
					}
				}
			}
			this.el = this.$el[0];

		},

		getDocumentHTML : function() {
			var template = Templates.getTemplate('progress-bar');
			return 	template();
		},

		setMax: function(max){
			this.max = max;
			this.updateProgress();
		},

		setValue: function(value){
			this.value = value;
			this.updateProgress();
		},

		updateProgress: function(){
			var self = this;
			var percent = Math.floor(this.value/this.max*100);
			var $progressBarLeft = this.$el.find(".progress-bar-left");
			console.log("ProgressBar::updateProgress:"+percent);

			$progressBarLeft.css("width", percent+"%");
	
			//sometimes that memory is so full and transition does not happen
			//we need to redraw this again
			//to make sure the width is correct
			setTimeout(function(){
				$progressBarLeft.css("width", (percent-.1)+"%");
			},500);


		}

	};

	// exports
	pos.ProgressBar = ProgressBar;
}(pos, jQuery, app.Templates, app.I18nHelper));