/* © 2014 Aleph-labs.com
 * @author PhuongVO
 */
// namespace
var pos = pos || {};
var data = data || {};

(function(pos, $, app, mixin) {
	'use strict';
	/**
	 * ConcernItem component
	 *  This class controll the changing svg item and pausing svg animation or have one static image when user moving
	 */
	function ConcernItem(element, options) {

		this.options   = $.extend({}, ConcernItem.DEFAULTS, options);
		this.options.element = element;
		this.model = this.options;
		
		this.insertToDOM();
		this.bindEvents();
	}

	ConcernItem.VERSION  = '3.3.1';

	ConcernItem.DEFAULTS = {
		// no defaults for now
		isDebug: true,
		isMobileWebSimulator: false,
		id:"",
		label:"",
		translationPath: ""
	};

	ConcernItem.prototype = {
		constructor: ConcernItem,

		labelAnimInteravlId: null,

		//this method must call after $el is added into DOM
		initialize: function () {
			
		}, 

		getConcernIndex:function(){
			return this.concernIndex;
		},
		
		bindEvents: function() {
			//initialize swipe	
			this.initSwipe();
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

        getDocumentHTML: function () {
            var template = app.Templates.getTemplate('concern-item');
            return template(this.model);
        },

        grow: function(callback){
        	var self = this;        	
        	var label = app.I18nHelper.t(this.options.translationPath);
        	var labelArray = label.split("");
            var current = 0;
            var $label = this.$el.find(".label");
            $label.text("");
			
			this.$el.find(".number").removeClass("hidden");

            clearInterval(this.labelAnimInteravlId);
	        this.labelAnimInteravlId = setInterval(function() {
	            if(current < labelArray.length) {
	                $label.text($label.text() + labelArray[current++]);
	            }
	            else{
	            	clearInterval(self.labelAnimInteravlId);
	            	self.$el.find(".sortable-cloud-thumb").removeClass("hidden");
	            	if(callback){
	            		callback();
	            	}
	            }
	        }, 30);
        },

        /**
        * just like grow but without delay
        */
        growInstant:function(){
        	var $label = this.$el.find(".label");
        	this.$el.find(".number").removeClass("hidden");
        	$label.text(app.I18nHelper.t(this.options.translationPath));
        	this.$el.find(".sortable-cloud-thumb").removeClass("hidden");
        }


	};

	// exports
	pos.ConcernItem = ConcernItem;

	//mixin initialization
	mixin.Mixin.addMixin(pos.ConcernItem, mixin.Swipable);

}(pos, jQuery, app, mixin));