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
	function CssCheckBox(element, options) {

		this.options   = $.extend({}, CssCheckBox.DEFAULTS, options);
		this.options.element = element;
		this.model = this.options;

		this.insertToDOM();

		// store this instance to data object so that I can retrieve it later
		this.$el.data('checkbox', this);

		this.initComponent();
		this.bindEvents();

	}

	CssCheckBox.DEFAULTS = {
		// no defaults for now
		isChecked:false,
		containerClass:'',
		isDisabled:false
	};

	CssCheckBox.CHANGE = "change_value";


	CssCheckBox.prototype = {
		constructor: CssCheckBox,

		$el: null,
		el: null,
		$valueInput: null,
		_initialized:false,


		initComponent: function(){

		},

		bindEvents: function() {
			var self = this;
			this.$el.on('click', 'label', function() {

				//prevent clicking when disabled
				if(self.$el.hasClass('disabled')){
					return;
				}

				self.$el.toggleClass('checked');
				var isCheck = false;
				if (self.$el.hasClass('checked')) {
					isCheck = true;
				}

				self.$el.trigger(CssCheckBox.CHANGE, [isCheck]);
			});
		},

		setCheck: function(isCheck, isNeedNotifyEvent) {
			//remove all the check class
			if (this.$el.hasClass("checked")) {
				this.$el.removeClass("checked");
			}

			if (isCheck) {
				this.$el.addClass("checked");
			}

			if (isNeedNotifyEvent) {
				this.$el.trigger(CssCheckBox.CHANGE, [isCheck]);
			}
		},

		disable:function(){
			this.$el.addClass("disabled");
		},

		enable:function(){
			this.$el.removeClass("disabled");
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
			var template = Templates.getTemplate('css-checkbox');
			return 	template(this.model);
		}

	};

	// exports
	pos.CssCheckBox = CssCheckBox;
}(pos, jQuery, app.Templates, app.I18nHelper));