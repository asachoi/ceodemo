/* © 2014 Aleph-labs.com
 * @author Thang Kieu. Revised by Ernesto Pile
 */
// namespace
var pos = pos || {};

(function(pos, $, Templates, I18nHelper) {
	'use strict';

	/**
	 * SwipeSelect component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function SwipeSelect(options) {

		this.options   = $.extend({}, SwipeSelect.DEFAULTS, options);

		this.model = this.options.model || {};
		this.model.inputPrefix = this.options.inputPrefix;
		this.model.value = this.options.value;
		this.model.selectedIndex = this.options.selectedIndex;
		this.model.inputMin = this.options.inputMin;
		this.model.inputMax = this.options.inputMax;

		if(this.options.noOfLines > 1){
			this.model.containerClass = "multiline multiline-"+this.options.noOfLines;
		}
		
		this.insertToDOM();
		this.initComponent();
		this.bindEvents();

	}

	SwipeSelect.EVENT_CHANGE = "change";

	SwipeSelect.DEFAULTS = {
		// no defaults for now
		noOfLines:1,
		editable:false,
		inputPrefix:"",
		selectedIndex:-1,
		value:null,
		inputMin:0,
		inputMax:1000000000
	};


	SwipeSelect.prototype = {
		constructor: SwipeSelect,

		model:null,

		$el: null,
		el: null,
		$swipperContainer:null,
		$prevBtn: null,
		$nextBtn: null,
		$input: null,
		$list: null,
		listItemHeight:25,
		_selectedIndex: -1,
		_initialized:false,
		_editable:false,

		initComponent: function() {

			var self = this;

			this.$prevBtn = this.$el.find(".prev-btn");
			this.$nextBtn = this.$el.find(".next-btn");
			this.$input = this.$el.find(".swipe-select-input");
			this.$input.hide();
			this.$input.autoNumeric('init');

			this.$swipperContainer =  this.$el.find(".swiper-container");
			this.swipeInstance = this.$swipperContainer.swiper({
				//Your options here:
				slidesPerView: 1,
				mode:'vertical',
				loop: false,
				onSlideChangeEnd: function(){
					console.log("SwipeSelect::onSlideChangeEnd");
					self._updateSlideIndex();
				},
				onSlideReset: function(){
					console.log("SwipeSelect::onSlideReset");
					self._updateSlideIndex();
				}
			});

			if(this.model.selectedIndex !== -1 && this.model.selectedIndex !== null){
				//if there is a selected index in model then that should be selected
				this.setSelectedIndex(this.model.selectedIndex);
			}
			else if(this.model.value !== undefined && this.model.value !== null){
				//if there is a selected value in model then that should be selected
				this.setValue(this.model.value);
			}
			else{
				this.setSelectedIndex(0);
			}

			this._updateBtnBySelectedIndex();
			
			this._initialized = true;
			console.log("SwipeSelect::initComponent");
		},

		bindEvents: function() {
			var self = this;
			
			this.$el.on("click", ".swiper-slide", function(){
				if(self.options.editable || self._editable){
					self.setEditable(true);				
				}
			});
			this.$prevBtn.click(function(){
				self._onPrevBtnClicked();
			});
			this.$nextBtn.click(function(){
				self._onNextBtnClicked();
			});
		},

		_onPrevBtnClicked:function(){
			if(this._editable){
				this.setEditable(false);
			}
			else{
				this.prev();
			}
		},


		_onNextBtnClicked:function(){
			if(this._editable){
				this.setEditable(false);				
			}
			else{
				this.next();				
			}
		},


		insertToDOM: function(){

			if(this.options.element){
				this.$el = $(this.options.element);
			}
			else{
				this.$el = $(this.getDocumentHTML());
				this.$container  = $(this.options.container);
				if(this.options.container){
					if(this.options.containerPosition === "prepend"){
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
			var template = Templates.getTemplate('swipe-select');
			return 	template(this.model);
		},

		/**
		 * enable the text input
		 * @param bool
		 */
		setEditable:function(bool){
			this._editable = bool;
			if(bool){
				this.$input.show();
				this.$input.focus();
				this.$swipperContainer.hide();
			}
			else{

				this.$input.autoNumeric('set', '');
				this.$input.hide();
				this.$swipperContainer.focus(); 
				this.$swipperContainer.show(); 
			}
			this._updateBtnBySelectedIndex(); 
		},

		getEditable:function(){
			return this._editable;
		},

		getTotalItems:function(){
			if(this.swipeInstance) {
				return this.swipeInstance.slides.length;
			}

			return 0;
		},

		/**
		 * set the selected index in the list
		 */
		setSelectedIndex:function(pIndex){
			//console.log("SwipeSelect::setSelectedIndex:"+pIndex);
			var total = this.getTotalItems();
			if(this.swipeInstance){

				if(pIndex > -1 && pIndex < total){
					//console.log("====update " + this._selectedIndex);
					this._selectedIndex = pIndex;
					this.swipeInstance.swipeTo(pIndex);
					return true;
				}

				return false;

			}
			return false;
		},

		/**
		 * get the selected index
		 */
		getSelectedIndex:function(){
			return this._selectedIndex;
		},


		/**
		 * get the selected item
		 * @returns {*}
		 */
		getSelectedItem:function(){
			return this.model.items[this._selectedIndex];
		},


		/**
		 * get the selected value
		 */
		getValue:function(){
			if(!this._editable){
				var selectedItem = this.getSelectedItem();
				return selectedItem.value;
			}
			else{
				var val = Number(this.$input.autoNumeric('get'));//will return unformatted number
				return val;
			}
		},

		/**
		 * set the selected item by value
		 * if multiple value exists, select the first one
		 */
		setValue: function(pValue){
			var toIndex = -1;
			var count = this.model.items.length;
			for(var i=0; i<count; i++){
				var item = this.model.items[i];
				if(item.value === pValue) {
					toIndex = i;
					break;
				}
			}
			
			if(toIndex !== -1){
				//console.log("SwipeSelect::setValue to index:", toIndex);
				this.setSelectedIndex(toIndex);
				this._updateBtnBySelectedIndex();
			}
			else if(this.options.editable && pValue !== undefined){
				//console.log("SwipeSelect::setValue editable:", pValue);
				this.$input.autoNumeric('set', pValue);
				this.setEditable(true);
				//this.setSelectedIndex(count-1);
				this._updateBtnBySelectedIndex();
			}

		},


		/**
		* update the selectedIndex. called when swipper ends transition
		* @private
		*/
		_updateSlideIndex: function(){
			//console.log("==_updateSlideIndex");
			//disable the next, previous button according to the index
			this._selectedIndex = this.swipeInstance.activeIndex;
			this._updateBtnBySelectedIndex();
			this._updateSpecifyTextInputVisibility();

			if(this._initialized){
				this.$el.trigger(SwipeSelect.EVENT_CHANGE);
			}
		},


		/**
		* update the navigation arrows
		* @private
		*/
		_updateBtnBySelectedIndex: function() {
			var selectedIndex = this.getSelectedIndex();
			var total = this.getTotalItems();
			var editable = this._editable;

			console.log("SwipeSelect::_updateBtnBySelectedIndex:"+selectedIndex);


			//reset the opacity
			this.$prevBtn.css({
				"opacity": 1
			});
			this.$nextBtn.css({
				"opacity": 1
			});

			if(!this._editable){

				if (selectedIndex === 0) {
					this.$prevBtn.css({
						"opacity": 0.3
					});
				}

				if (selectedIndex === total - 1) {
					this.$nextBtn.css({
						"opacity": 0.3
					});
				}		

			}

		},


		/**
		* update text input visibility
		* @private
		*/
		_updateSpecifyTextInputVisibility:function(){
			var selectedIndex = this.getSelectedIndex();
			var total = this.getTotalItems();			
			if(this.options.specifiable && (selectedIndex == total-1)){
				this.setEditable(true);
			}
			else{
				this.setEditable(false);				
			}
		},


		/**
		 * move to previous entry
		 */
		prev:function(){
		   this.setSelectedIndex(this.getSelectedIndex() - 1);
		},

		/**
		 * move to next entry
		 */
		next:function(){
			this.setSelectedIndex(this.getSelectedIndex() + 1);
		},

		hide:function(){
			this.$el.hide();
		},

		show:function(){
			this.$el.show();
		}

	};

	// exports
	pos.SwipeSelect = SwipeSelect;
}(pos, jQuery, app.Templates, app.I18nHelper));