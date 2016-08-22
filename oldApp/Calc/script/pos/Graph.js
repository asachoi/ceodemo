/* © 2014 Aleph-labs.com
 * @author Waheed Akhtar
 */
// namespace
var pos = pos || {};

(function(pos, $) {
    'use strict';

    /**
     * Graph component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function Graph(element, options) {
        this.$el  = $(element);
        this.el = this.$el[0];
		var graphContainer=this.$el;
        // store this instance to data object so that I can retrieve it later
        //this.$el.data('toggleButton', this);
        //
        var self = this;
        //console.log(options);
        this.options   = $.extend({}, Graph.DEFAULTS, options);

		var graphdata=options.data;
		var columns=graphdata.columns;
		var columnWidth=options.width;
		var columnHeight=options.height;
		var columnBackground=options.background;
		var maxVal=graphdata.max;
		var title=options.title;
		var shortfall=options.shortfall;
		var currency=options.currency;

		var pushLeft=options.pushLeft;
		if(pushLeft===undefined) {
			pushLeft='';
		}

		//console.log(graphdata);

		graphContainer.html('<h1>' + title + '</h1>');
		var pushLeftCSS='';
		var shortfallVal=0;
		$.each(columns, function(key, column) {
			var barHeight=column.value;
			var barColor=column.color;
			var label=column.label;
			var barValue=column.value;
			var percentageValue=(barValue * 100) / maxVal;

			if (column.background) {
				columnBackground = column.background
			}

			if(key===0)
			{
				shortfallVal=maxVal-barValue;
				if(shortfallVal<0) {
					shortfallVal=0;
				}

				if(pushLeft!=='') {
					pushLeftCSS='margin-left:' + pushLeft;
				}
			} else {
				pushLeftCSS='';
			}

			var html='<div class="col-frame col-frame-' + key + '">\
						<div class="column" style="width:' + columnWidth + ';background:' + columnBackground + ';"> \
							<div class="bar" id="bar' + key + '" style="width:' + columnWidth + ';height:0%;background:' + barColor + ';"></div> \
							<div class="shortfall-bar" id="shortfall-bar' + key + '" ></div>\
						</div>\
						<div class="label" id="label' + key + '">' + label + '</div>\
					 </div>';

			graphContainer.html(graphContainer.html() + html);

			setTimeout(function() {
				if(shortfall===false)
				{
					graphContainer.find('#shortfall-bar' + key).hide();
				}
				else if(shortfall===true && key===0)
				{
					graphContainer.addClass('graph-shortfall');
					var shortfallPercentage=100-percentageValue;
					//alert(shortfall);
					graphContainer.find('#shortfall-bar' + key).show();
					graphContainer.find('#shortfall-bar' + key).css('height', shortfallPercentage + '%').addClass('has-short-fall');
					graphContainer.find('#shortfall-bar' + key).html('<span class="up-down-arrow"></span>');
					graphContainer.find('.col-frame-' + key).append('<div class="value-text value-text-' + key +'"><small class="red-title">Shortfall</small><span class="label-bold red-title">' + currency + self.numberWithCommas(shortfallVal) + '</span></div>');
				}
				graphContainer.find('#bar' + key).css('height', percentageValue + '%');
				// Thang Kieu - jump shortfall to top when it's less than 15%
				var $upDownArrow = graphContainer.find('#shortfall-bar' + key).find('.up-down-arrow');
				var $shortValueWrap = graphContainer.find('.value-text-' + key);
				if (percentageValue >= 85) {
					var top = $shortValueWrap.outerHeight(true);
					$shortValueWrap.css('top', - (top + 5)).addClass('c-arrow');
					$upDownArrow.addClass('has-shortfall-arrow');
					if ($shortValueWrap.hasClass('c-arrow')) {
						graphContainer.find('.col-frame').css('margin-top', '60px');
					}
				} else {
					$shortValueWrap.css('top', shortfallPercentage / 2 + '%');
				}
			}, 100);

		})

        //this.bindEvents();
    }

    Graph.DEFAULTS = {
        // no defaults for now
    };

    Graph.prototype = {
        constructor: Graph,

        $el: null,
        el: null,
        $checkbox: null,

        updateValue: function(data) {
			var maxVal=this.options.data.max;
			var shortfall=this.options.shortfall;
			var currency=this.options.currency;

			var graphContainer=this.$el;
			var shortfallVal=0;
            $.each(data, function(key, column) {
                var percentageValue=(column.value * 100) / maxVal;

				if(shortfall===false)
					{
						graphContainer.find('#shortfall-bar' + key).hide();
					}
					else if(shortfall===true && key===0)
					{
						shortfallVal=maxVal-column.value;
						if(shortfallVal<0) shortfallVal=0;

						var shortfallPercentage=100-percentageValue;
						//alert(shortfall);
						graphContainer.find('#shortfall-bar' + key).show();
						graphContainer.find('#shortfall-bar' + key).css('height', shortfallPercentage + '%').addClass('has-short-fall');
						graphContainer.find('#shortfall-bar' + key).html('<span class="up-down-arrow"></span>');
						graphContainer.find('.col-frame-' + key).find('.value-text').remove();
						graphContainer.find('.col-frame-' + key).append('<div class="value-text value-text-' + key +'"><small class="red-title">Shortfall</small><span class="red-title">' + currency + shortfallVal + '</span></div>');
					}
					graphContainer.find('#bar' + key).css('height', percentageValue + '%');
					// Thang Kieu - jump shortfall to top when it's less than 15%
					var $upDownArrow = graphContainer.find('#shortfall-bar' + key).find('.up-down-arrow');
					var $shortValueWrap = graphContainer.find('.value-text-' + key);
					if (percentageValue >= 85) {
						var top = $shortValueWrap.outerHeight(true);
						$shortValueWrap.css('top', - (top + 5)).addClass('c-arrow');
						$upDownArrow.addClass('hide-arrow');
						if ($shortValueWrap.hasClass('c-arrow')) {
							graphContainer.find('.col-frame').css('margin-top', '60px');
						}
					} else {
						$shortValueWrap.css('top', shortfallPercentage / 2 + '%');
					}
            })
        },

        numberWithCommas: function(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }

        /*bindEvents: function() {
            this.$el.on('click', '.expand-icon', function() {
            	var $wrap = $(this).closest('.accordians-control');
                $wrap.toggleClass('expanded');
                if ($wrap.hasClass('expanded')) {
                	$wrap.find('.accordians-content').slideDown(300);
                } else {
                	$wrap.find('.accordians-content').slideUp(300);
                }
            });
        }*/
    };

    // exports
    pos.Graph = Graph;
}(pos, jQuery));