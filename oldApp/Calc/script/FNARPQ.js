/* © 2014 Aleph-labs.com
 * @author Thang Kieu
 */
/*global pos*/
// namespace
var page = page || {};

(function(page, $) {
	'use strict';

	/**
	 * FNARPQ component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function FNARPQ(element, options) {
		this.$el  = $(element);
		this.el = this.$el[0];
		// store this instance to data object so that I can retrieve it later
		this.$el.data('fnarpq', this);
		//
		this.options   = $.extend({}, FNARPQ.DEFAULTS, options);
		this.init();
	}

	FNARPQ.VERSION  = '0';

	FNARPQ.DEFAULTS = {
		// no defaults for now
	};


	FNARPQ.prototype = {
		constructor: FNARPQ,

		$el: null,
		el: null,
		tooltipIns: null,

		$page1: null,
		question1: null,
		question2: null,
		question3: null,
		question41: null,
		question43: null,
		question44: null,
		question45: null,

		$page2: null,
		$page3: null,

		init: function() {
			this.initTooltip();
			this.initNumber();
			this.initRadioGroup();
			this.initSelect();
			this.initSwiper();

			this.initPage1();

			this.bindEvents();
		},

		initPage1: function() {
			this.$page1 = this.$el.find('.page-1');

			this.$page2 = this.$el.find('.page-2');
			this.$page3 = this.$el.find('.page-3');

			//get the list question and hide all in page 2, page 3
			var targetQuestion = 10;
			for (var i = 0; i < targetQuestion; i++) {
				var targetName = "question-" + (i+1);
				this.showHideTheSectionByTarget(targetName, false);
			}
		},

		showHideTheSectionByTarget: function(targetName, isShow) {
			//traverse the page 2
			var targetSection = this.$page2.find("div[data-section='" + targetName  + "']");
			if (targetSection.length > 0) {
				if (!isShow) {
					targetSection.hide();
				} else {
					targetSection.show();
				}
			}

			//traverse the page 3
			targetName = "page-2-" + targetName;
			var selector = "[data-section='" + targetName  + "']";
			targetSection = this.$page3.find(selector);

			if (targetSection.length > 0) {
				if (!isShow) {
					targetSection.hide();
				} else {
					targetSection.show();
				}
			}
		},

		onChangeValueInPage1: function() {
			window.question1 = this.question1;
			window.question2 = this.question2;
			window.question3 = this.question3;
			window.question41 = this.question41;
			window.question43 = this.question43;
			window.question44 = this.question44;
			window.question45 = this.question45;
			console.log("==onChangeValueInPage1 ");
		},

		checkTargetSectionForQuestion: function(event) {
			var targetObj = event.target;
			var parent = $(targetObj).closest("div[data-section^='question']");
			var targetSection = parent.attr("data-section");
			if (targetSection) {
				this.showHideTheSectionByTarget(targetSection, true);
			}
		},

		initQuestion1ForPage1: function() {
			var self = this;
			this.question1 = {
				'life-protection' : 0,
				'savings' : 0,
				'investment' : 0,
				'accident' : 0,
				'retirement': 0,
				'education' : 0,
				'health' : 0,
				'captial': 0,
				'others': 0
			};

			window.question1 = this.question1;

			this.$page1.on('click', '.question-1 #life-protection', function(event) {
				self.question1['life-protection'] = this.checked ? 1 : 0;
				self.onChangeValueInPage1();
				self.checkTargetSectionForQuestion(event);
			});

			this.$page1.on('click', '.question-1 #savings', function(event) {
				self.question1['savings'] = this.checked ? 1 : 0;
				self.onChangeValueInPage1();
				self.checkTargetSectionForQuestion(event);
			});

			this.$page1.on('click', '.question-1 #investment', function(event) {
				self.question1['investment'] = this.checked ? 1 : 0;
				self.onChangeValueInPage1();
				self.checkTargetSectionForQuestion(event);
			});

			this.$page1.on('click', '.question-1 #accident', function(event) {
				self.question1['accident'] = this.checked ? 1 : 0;
				self.onChangeValueInPage1();
				self.checkTargetSectionForQuestion(event);
			});

			this.$page1.on('click', '.question-1 #retirement', function(event) {
				self.question1['retirement'] = this.checked ? 1 : 0;
				self.onChangeValueInPage1();
				self.checkTargetSectionForQuestion(event);
			});

			this.$page1.on('click', '.question-1 #education', function(event) {
				self.question1['education'] = this.checked ? 1 : 0;
				self.onChangeValueInPage1();
				self.checkTargetSectionForQuestion(event);
			});

			this.$page1.on('click', '.question-1 #health', function(event) {
				self.question1['health'] = this.checked ? 1 : 0;
				self.onChangeValueInPage1();
				self.checkTargetSectionForQuestion(event);
			});

			this.$page1.on('click', '.question-1 #captial', function(event) {
				self.question1['captial'] = this.checked ? 1 : 0;
				self.onChangeValueInPage1();
				self.checkTargetSectionForQuestion(event);
			});

			this.$page1.on('click', '.question-1 #others', function(event) {
				self.question1['captial'] = this.checked ? 1 : 0;
				self.onChangeValueInPage1();
				self.checkTargetSectionForQuestion(event);
			});
		},

		initQuestion2ForPage1 : function () {
			var self = this;
			this.question2 = -1;
			var nameGroup = "2-radio";
			var selector = ".question-2 input[name='" + nameGroup + "']:checked";

			var eventHandler = function(event) {
				var value = self.$page1.find(selector).attr('value');
				self.question2 = value;

				self.onChangeValueInPage1();

				self.checkTargetSectionForQuestion(event);
			};

			this.$page1.on('click', '.question-2 #1-year', function(event) {
				eventHandler(event);
			});

			this.$page1.on('click', '.question-2 #1-5-years', function(event) {
				eventHandler(event);
			});

			this.$page1.on('click', '.question-2 #6-10-years', function(event) {
				eventHandler(event);
			});

			this.$page1.on('click', '.question-2 #11-20-years', function(event) {
				eventHandler(event);
			});

			this.$page1.on('click', '.question-2 #20-years', function(event) {
				eventHandler(event);
			});
		},

		initQuestion3ForPage1: function() {
			var self = this;
			this.question3 = -1;
			var nameGroup = "3-radio";
			var selector = ".question-3 input[name='" + nameGroup + "']:checked";

			var eventHandler = function(event) {
				var value = self.$page1.find(selector).attr('value');
				self.question3 = value;

				self.onChangeValueInPage1();
				self.checkTargetSectionForQuestion(event);
			};

			this.$page1.on('click', '.question-3 #primary-school-or-below', function(event) {
				eventHandler(event);
			});

			this.$page1.on('click', '.question-3 #secondary-school', function(event) {
				eventHandler(event);
			});

			this.$page1.on('click', '.question-3 #post-secondary-college', function(event) {
				eventHandler(event);
			});

			this.$page1.on('click', '.question-3 #bachelor-degree-or-above', function(event) {
				eventHandler(event);
			});
		},

		initQuestion41ForPage1: function() {
			var self = this;
			this.question41 = -1;
			var nameGroup = "4-1-radio";
			var selector = ".question-4-1 input[name='" + nameGroup + "']:checked";

			var eventHandler = function(event) {
				var value = self.$page1.find(selector).attr('value');
				self.question41 = value;
				console.log("==value " + value);

				self.onChangeValueInPage1();

				self.checkTargetSectionForQuestion(event);
			};

			this.$page1.on('click', '.question-4-1 #specific-amount', function(event) {
				eventHandler(event);
			});

			this.$page1.on('click', '.question-4-1 #in-range', function(event) {
				eventHandler(event);
			});
		},

		initQuestion43ForPage1: function() {
			var self = this;
			this.question43 = -1;
			var nameGroup = "4-3-radio";
			var selector = ".question-4-3 input[name='" + nameGroup + "']:checked";

			var eventHandler = function(event) {
				var value = self.$page1.find(selector).attr('value');
				self.question43 = value;

				self.onChangeValueInPage1();

				self.checkTargetSectionForQuestion(event);
			};

			this.$page1.on('click', '.question-4-3 #2-1-year', function(event) {
				eventHandler(event);
			});

			this.$page1.on('click', '.question-4-3 #2-1-5-years', function(event) {
				eventHandler(event);
			});

			this.$page1.on('click', '.question-4-3 #2-6-10-years', function(event) {
				eventHandler(event);
			});

			this.$page1.on('click', '.question-4-3 #2-11-20-years', function(event) {
				eventHandler(event);
			});

			this.$page1.on('click', '.question-4-3 #2-20-years', function(event) {
				eventHandler(event);
			});
		},

		initQuestion44ForPage1: function() {
			var self = this;
			this.question44 = -1;
			var nameGroup = "4-5-radio";
			var selector = ".question-4-4 input[name='" + nameGroup + "']:checked";

			var eventHandler = function(event) {
				var value = self.$page1.find(selector).attr('value');
				self.question44 = value;

				self.onChangeValueInPage1();

				self.checkTargetSectionForQuestion(event);
			};

			this.$page1.on('click', '.question-4-4 #2-1-percent', function(event) {
				eventHandler(event);
			});

			this.$page1.on('click', '.question-4-4 #2-1-5-percent', function(event) {
				eventHandler(event);
			});

			this.$page1.on('click', '.question-4-4 #2-6-10-percent', function(event) {
				eventHandler(event);
			});

			this.$page1.on('click', '.question-4-4 #2-11-20-percent', function(event) {
				eventHandler(event);
			});

			this.$page1.on('click', '.question-4-4 #2-20-percent', function(event) {
				eventHandler(event);
			});
		},

		initQuestion45ForPage1: function() {
			var self = this;
			this.question45 = {
				'salary' : 0,
				'income' : 0,
				'saving' : 0,
				'other_investment' : 0,
				'saving_investment': 0,
				'other' : 0
			};

			window.question1 = this.question1;

			this.$page1.on('click', '.question-4-5 #2-life-protection', function(event) {
				self.question45['salary'] = this.checked ? 1 : 0;
				self.onChangeValueInPage1();

				self.checkTargetSectionForQuestion(event);
			});

			this.$page1.on('click', '.question-4-5 #2-savings', function(event) {
				self.question45['income'] = this.checked ? 1 : 0;
				self.onChangeValueInPage1();

				self.checkTargetSectionForQuestion(event);
			});

			this.$page1.on('click', '.question-4-5 #2-investment', function(event) {
				self.question45['saving'] = this.checked ? 1 : 0;
				self.onChangeValueInPage1();

				self.checkTargetSectionForQuestion(event);
			});

			this.$page1.on('click', '.question-4-5 #2-accident', function(event) {
				self.question45['other_investment'] = this.checked ? 1 : 0;
				self.onChangeValueInPage1();

				self.checkTargetSectionForQuestion(event);
			});

			this.$page1.on('click', '.question-4-5 #2-retirement', function(event) {
				self.question45['saving_investment'] = this.checked ? 1 : 0;
				self.onChangeValueInPage1();

				self.checkTargetSectionForQuestion(event);
			});

			this.$page1.on('click', '.question-4-5 #2-education', function(event) {
				self.question45['other'] = this.checked ? 1 : 0;
				self.onChangeValueInPage1();

				self.checkTargetSectionForQuestion(event);
			});
		},

		initEventForGender: function() {
			var self = this;
			var onChangeValueHandler = function(event) {
				var targetObj = event.target;
				var parent = $(targetObj).closest("div[data-section^='question']");
				var targetSection = parent.attr("data-section");

				self.showHideTheSectionByTarget(targetSection, true);
			};
			this.$page1.on('click', '.gender-radio #gender-1', function(event) {
				onChangeValueHandler(event);
			});

			this.$page1.on('click', '.gender-radio #gender-2', function(event) {
				onChangeValueHandler(event);
			});
		},

		initEventForMarialStatus: function() {
			var self = this;

			var onChangeValueHandler = function(event) {
				var targetObj = event.target;
				var parent = $(targetObj).closest("div[data-section^='question']");
				var targetSection = parent.attr("data-section");

				self.showHideTheSectionByTarget(targetSection, true);
			};
			this.$page1.on('click', '.marrital-radio #radio-1', function(event) {
				onChangeValueHandler(event);
			});

			this.$page1.on('click', '.marrital-radio #radio-2', function(event) {
				onChangeValueHandler(event);
			});
			this.$page1.on('click', '.marrital-radio #radio-3', function(event) {
				onChangeValueHandler(event);
			});
			this.$page1.on('click', '.marrital-radio #radio-4', function(event) {
				onChangeValueHandler(event);
			});
		},

		initEventForInput: function() {
			var self = this;
			var onChangeTextHandler = function(event) {
				var targetObj = event.target;
				//check if targetObj has data-section
				var $targetObj = $(targetObj);
				if ($targetObj.attr('data-section')) {
					var targetSection = $targetObj.attr('data-section');
					console.log("==targetSection " + targetSection);
					var visible = $targetObj.val() !== null && $targetObj.val() !== undefined && $targetObj.val() !== "";
					self.showHideTheSectionByTarget(targetSection, visible);
				}
			};


			this.$page1.on('change', "input[type='text']", function(event) {
				onChangeTextHandler(event);
			});
			this.$page1.on('change', "input[type='number']", function(event) {
				onChangeTextHandler(event);
			});
			this.$page1.on('change', "input[type='tel']", function(event) {
				onChangeTextHandler(event);
			});
		},

		initQuestionEventForPage1: function() {
			//for gender
			this.initEventForGender();
			this.initEventForMarialStatus();
			this.initEventForInput();

			this.initQuestion1ForPage1();
			this.initQuestion2ForPage1();
			this.initQuestion3ForPage1();
			this.initQuestion41ForPage1();
			this.initQuestion43ForPage1();
			this.initQuestion44ForPage1();
			this.initQuestion45ForPage1();
		},

		initTooltip: function() {
			if (pos.Tooltip !== undefined) {
				// this.$el.find('[title]').each(function() {
					this.tooltipIns = new pos.Tooltip(this.$el);
				// });
			}

		},

		initNumber: function() {

			this.$el.find('input[type="number"]').each(function() {
				if (pos.NumberInput) {
					new pos.NumberInput(this);
				}
			});
		},

		initRadioGroup: function() {
			this.$el.find('.radio-group').each(function() {
				new pos.RadioGroup(this);
			});
		},

		initSelect: function() {
			this.$el.find('select').each(function() {
			    new pos.Select(this);
			});
		},

		isDesktop: function() {
			//var ua = navigator.userAgent.toLowerCase();
			//return !(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0,4)));
			var ismobile=navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
			return !ismobile;
		},

		initSwiper: function() {
			var swiper = this.$el.find('.swiper-container');
			var isDesktop = this.isDesktop();
			console.log("=isDesktop " + isDesktop);
			if (swiper.length > 0) {
				new pos.SwipePanel(swiper, {
				    showBarInLast: true,
				    onlyExternal: isDesktop
				});
			}
		},

		bindEvents: function() {

			var self = this;

			// this.clickToShow();
			var otherNo = 0;
			this.$el.on('click', '.button-add', function() {
				var $questionBlock = $(this).closest('.life-insurance-block');
				var template = $('#template-others').html();
				var $template = $(template).addClass('other-' + otherNo);

				$questionBlock.find('.life-insurance-rows').append($template);

				// init Tooltip
				self.tooltipIns.init();
				// event.stopPropagation();
				// event.preventDefault();
			});

			this.$el.on('click', '.button-remove-other', function() {
				$(this).closest('.question-block').remove();
			});

			this.$el.on('click', '.has-sub-question', function() {
				self.showSubQuestionHandler(this);
			});


			this.$el.find('.date-birthday').on('focus', function() {
				$(this).attr('type', 'date');
			}).on('blur', function() {
				var selfObj = $(this);
				selfObj.attr('type', 'text');

				setTimeout(function() {
					selfObj.attr('type', 'date');
				}, 0);
			});

			this.initQuestionEventForPage1();

		},

		showSubQuestionHandler: function(el) {
			var subQuestionClass = $(el).attr('data-sub-question');
			var $wrap = $(el).closest('.question-block');
			var $subQuestionBlock = $wrap.find(subQuestionClass);
			var $subQuestionBlocks = $wrap.find('.sub-question-content');
			var $questions = $wrap.find('.question-with-sub');
			var $currentQues = $(el).closest('.question-with-sub');

			// var action = $(el).attr('data-action');
			//
			$questions.removeClass('bottom-arrow');
			$currentQues.addClass('bottom-arrow');

			$subQuestionBlocks.addClass('hidden');
			$subQuestionBlock.removeClass('hidden');
		}

	};

	// exports
	page.FNARPQ = FNARPQ;
}(page, $));