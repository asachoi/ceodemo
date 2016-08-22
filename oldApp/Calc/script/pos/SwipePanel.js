/* © 2014 Aleph-labs.com
 * @author Thang Kieu
 */
// namespace
var pos = pos || {};

(function(pos, $) {
	'use strict';

	/**
	 * SwipePanel component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function SwipePanel(element, options) {
		this.$el  = $(element);
		this.el = this.$el[0];
		// this.$swipe = this.$e
		this.swipeInstance = this.$el.find('.swipe-panel');
		this.$items = this.$el.find('.swiper-slide');
		this.$activeBar = this.$el.find('.active-panel');
		this.length = this.$items.length;

		// store this instance to data object so that I can retrieve it later
		this.$el.data('swipePanel', this);
		//
		this.options   = $.extend({}, SwipePanel.DEFAULTS, options);

		this.init();
		this.bindEvents();
	}

	SwipePanel.DEFAULTS = {
		// no defaults for now
		showBarInLast: false,
		invisibleArrow: false,
		isSwipe: true
	};


	SwipePanel.prototype = {
		constructor: SwipePanel,

		$el: null,
		el: null,
		$checkbox: null,
		footerHeight: 0,

		init: function() {
			var self = this;

			this.setCurrStep(1);
			this.setActiveBar(1);

          	// fix height of web
          	this.setHeight();

			this.swipeInstance = this.$el.swiper({
	            //Your options here:
	            mode:'horizontal',
	            loop: false,
	            onlyExternal: this.options.onlyExternal,
	            onSlideChangeEnd: function(swiper) {
	                self.slideEndChangeHandler(swiper.activeIndex);
	            }
            	//etc..
          	});

          	this.initFooterMenu();

		},

		bindEvents: function() {
			var self = this;

			// make use of the checkbox toggle state
			this.$el.on('click', '.swipe-button', function() {
				var action = self.getAction(this);

				self.doAction(action);
			});

			// show footer menu
			this.$el.on('click', '.show-footer-menu', function() {
				var $footerMenu = self.$el.find('#footer-menu');
				if ($footerMenu.hasClass('showed')) {
					self.hideFooterMenu();
				} else {
					self.showFooterMenu();
				}
			});
		},

		getAction: function(el) {
			var action = 'right';
			if ($(el).hasClass('left-arrow')) {
				action = 'left';
			}

			return action;
		},

		doAction: function(action) {
			switch (action) {
				case 'left':
					this.swipeInstance.swipePrev();
					break;
				case 'right':
					this.swipeInstance.swipeNext();
					break;
				default:
			}
		},

		// set state of active bar
		setActiveBar: function(index) {
			var self = this;
			var activeBarWidth = this.$activeBar.find('.active-panel-bar').outerWidth(true);
			var itemActiveWidth = activeBarWidth / this.$items.length;

			this.$activeBar.find('.active-bar').animate({
				width: itemActiveWidth * index
			}, 300, 'linear', function() {
				if (index === self.$items.length) {
					$(this).addClass('last');
				} else {
					$(this).removeClass('last');
				}
			});
		},

		/**
		 * Set current step
		 * @param {[type]} index [description]
		 */
		setCurrStep: function(index) {
			var total = this.length;

			var $currStepText = this.$activeBar.find('.curr-step');
			var $totalStepText = this.$activeBar.find('.total-step');

			$currStepText.html(index);
			$totalStepText.html(total);
		},

		/**
		 * show/hide proceed button
		 * @param  {Boolean} isShow [description]
		 * @return {[type]}         [description]
		 */
		showProceedbtn: function(isShow) {
			var $proceedLink = this.$el.find('.proceed-link');
			if (isShow) {
				$proceedLink.removeClass('hidden');
			} else {
				$proceedLink.addClass('hidden');
			}
		},

		windowResizeHandler: function() {
			var wrapW = this.$el.width();
			var itemsNo = this.$items.length;
			this.$swipe.width(wrapW * itemsNo);
			this.$items.each(function() {
				$(this).width(wrapW);
			});
		},

		/**
		 * Show footer menu
		 * @return {[type]} [description]
		 */
		showFooterMenu: function() {
			var self = this;
			var $footer = this.$el.find('#footer-menu');
			// $footer.slideDown(300, function() {
			// 	$(this).addClass('showed');
			// 	self.showOverlay(true);
			// });
			$footer.addClass('showed');
			// $footer.css('transform', 'translate(0, 0)');
			$footer.css('bottom', 60);
			self.showOverlay(true);
			this.$el.find('.active-panel .up-arrow').addClass('down-arrow');
		},

		/**
		 * hide footer menu
		 * @return {[type]} [description]
		 */
		hideFooterMenu: function() {
			// this.$el.find('#footer-menu').slideUp(300, function() {
			// 	$(this).removeClass('showed');
			// });
			var $footer = this.$el.find('#footer-menu');
			$footer.removeClass('showed');
			// $footer.css('transform', 'translate(0, 100%)');
			$footer.css('bottom', - ($footer.height() + 60));
			this.showOverlay(false);

			this.$el.find('.active-panel .up-arrow').removeClass('down-arrow');
		},

		/**
		 * Show/hide active bar
		 * @param  {[type]} flag [description]
		 * @return {[type]}      [description]
		 */
		showActiveBar: function(flag) {
			if (flag) {
				this.$activeBar.removeClass('hidden');
			} else {
				this.$activeBar.addClass('hidden');
			}
		},

		/**
		 * Show overlay for hide footer menu when user click out of this block
		 * @param  {Boolean} isShow [description]
		 * @return {[type]}         [description]
		 */
		showOverlay: function(isShow) {
			var $whiteOverlay = $('#white-overlay');
			if (isShow) {
				// show overlay
				$whiteOverlay.show(100);
				this.bindOverlayEvent();
			} else {
				// hide overlay
				$whiteOverlay.hide(100);
			}
		},

		bindOverlayEvent: function() {
			var self = this;
			$('#white-overlay').on('click touchstart', function() {
				self.hideFooterMenu();
				$(this).off('click');
				self.showOverlay(false);
				event.stopPropagation();
				event.preventDefault();
			});
		},

		/**
		 * handler when slide change is ended
		 * @param  {[type]} index [description]
		 * @return {[type]}       [description]
		 */
		slideEndChangeHandler: function(index) {
			var i = index + 1;
			this.setActiveBar(i);
			this.setCurrStep(i);

			// hide arrow button
			if (i === 1) {
				this.$el.find('.swipe-button').removeClass('hidden');
				this.$el.find('.left-arrow').addClass('hidden');
			} else if (i === this.length) {
				this.$el.find('.swipe-button').removeClass('hidden');
				this.$el.find('.right-arrow').addClass('hidden');
				this.showProceedbtn(true);
				// hide active bar
				if (this.options.showBarInLast) {
					this.showActiveBar(true);
				}
			} else {
				this.$el.find('.swipe-button').removeClass('hidden');
				this.showProceedbtn(false);
				// hide active bar
				if (this.options.showBarInLast) {
					this.showActiveBar(false);
				}
			}

			this.setActiveInFooter(index);
		},

		/**
		 * init Footer Menu and bind event on list
		 * @return {[type]} [description]
		 */
		initFooterMenu: function() {
			var self = this;

			var $footerMenu = this.$el.find('#footer-menu');
			var $questionList = $('<ul/>');
			var $li = $('<li/>');
			var title = '';

			for (var i = 0; i < this.length; i++) {
				// get title
				title = this.$items.eq(i).find('.calc-page-title .title').text();
				$li = $('<li/>');
				$li
					.text('Q'+ (i + 1) +': ' + title)
					.attr('data-index', i);
				if (i === 0) {
					$li.addClass('selected checked');
				}
				$questionList.append($li);
			}
			$footerMenu.find('.menu-list').remove();
			$questionList.addClass('menu-list');

			$footerMenu.append($questionList);

			$footerMenu.on('click', 'li', function() {
				var index = $(this).index();

				self.setActiveInFooter(index);
				self.swipeInstance.swipeTo(index);
				self.hideFooterMenu();
			});

			this.footerHeight = $footerMenu.height();
			this.hideFooterMenu();
		},

		/**
		 * Set active slider in footer menu
		 */
		setActiveInFooter: function(index) {
			var $footerMenu = this.$el.find('#footer-menu');
			var $lis = $footerMenu.find('li');
			// hide selected and checked state
			$lis.removeClass('selected');

			// show selected and checked state
			$lis.eq(index).addClass('selected');
		},

		setHeight: function() {

			var height = function() {

				// get height of view port
				var vH = $(window).height();

				$('#pageWrapper').height(vH);
			};
			height();
			$(window).resize(function() {
				height();
			});
		}
	};

	// exports
	pos.SwipePanel = SwipePanel;
}(pos, jQuery));