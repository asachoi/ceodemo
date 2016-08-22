/* © 2014 Aleph-labs.com
* @author Thanh Tran
*/
// namespace
var pos = pos || {};

(function(pos, $) {
'use strict';

/**
* RadioGroup component
* @class
* @param {[type]} element [description]
* @param {[type]} options [description]
*/
function RadioGroup(element, options) {
	this.$el  = $(element);
	this.el = this.$el[0];
	// store this instance to data object so that I can retrieve it later
	this.$el.data('radiogroup', this);
	//
	this.options   = $.extend({}, RadioGroup.DEFAULTS, options);
	this.initComponent();
	this.bindEvents();
	this.selectObj("0");
}

RadioGroup.VERSION  = '3.3.1';
RadioGroup.DEFAULTS = {
	// no defaults for now
};

RadioGroup.ON_CHANGE = "change";


RadioGroup.prototype = {
	constructor: RadioGroup,

	$el: null,
	el: null,
	$checkboxList: null,
	$labelList: null,
	selectedValue: 0,

	bindEvents: function() {
		var self = this;
		// window.radioObj = this;

		// make use of the checkbox toggle state
		var onSelectedHandler = $.proxy(this.onSelectedHandler, this);
		this.$el.on('change', '[type="checkbox"]', function(event) {
			self.selectObj(event.target.value);
		});
	},

	initComponent: function() {
		this.$checkboxList = this.$el.find('[type="checkbox"]');
		this.$labelList = this.$el.find('label');
	},

	selectObj: function(value) {
		this.resetAllValue();
		for (var i = 0; i < this.$checkboxList.length; i++) {
			var obj = this.$checkboxList[i];
			this.selectedValue = value;
			if (obj.value === value) {
				$(this.$labelList[i]).addClass("selected");
			}
		}

		// console.log("==selectObj");
		this.$el.trigger(RadioGroup.ON_CHANGE);
	},

	resetAllValue: function() {
		this.$checkboxList.prop('checked', false);
		this.$labelList.removeClass("selected");
	},

	getSelectedObj: function() {
		for (var i = 0; i < this.$checkboxList.length; i++) {
			var obj = this.$checkboxList[0];
			var isCheck = $(obj).prop("checked");
			if (isCheck === "true") {
				return obj;
			}
		}
	},

	toggle: function() {
		this.$checkboxList.prop('checked', !this.$checkbox.prop('checked'));
		this._toggleClass();
		return this.isSelected();
	},

	_toggleClass: function(checked) {
		checked = checked || this.isSelected();

		this.$el.toggleClass('selected', checked);
	},

	getValue: function() {
		return this.selectedValue;
	}
};

// exports
pos.RadioGroup = RadioGroup;
}(pos, jQuery));