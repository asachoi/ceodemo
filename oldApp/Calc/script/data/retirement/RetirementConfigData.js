/* © 2014 Aleph-labs.com
 * @author PhuongVo
 */
// namespace
var data = data || {};
data.retirement = data.retirement || {};

(function(retirement) {
	'use strict';

	function RetirementConfigData() {
	}

	RetirementConfigData.VERSION  = '3.3.1';

	RetirementConfigData.DEFAULTS = {

	};

	RetirementConfigData.ITEM_WIDTH = 75;
	RetirementConfigData.OFFSET_TOP = 400;
	RetirementConfigData.POSITION_BOTTOM = 70;

	// constant
	RetirementConfigData.HOUSES = [
		{
			name: 'Mortgage',
			value: 10000,
			icon: 'icon-mortgage',
			bg: 'icon-mortgage',
			targetPos: {
				x: 120,
				y: RetirementConfigData.OFFSET_TOP
			}
		},
		{
			name: 'Fully owned',
			value: 10000,
			icon: 'icon-fully-owned',
			bg: 'icon-fully-owned',
			targetPos: {
				x: 240,
				y: RetirementConfigData.OFFSET_TOP
			}
		},
		{
			name: 'Rented',
			value: 10000,
			icon: 'icon-rented',
			bg: 'icon-rented',
			targetPos: {
				x: 360,
				y: RetirementConfigData.OFFSET_TOP
			}
		},
		{
			name: 'Living with family',
			value: 10000,
			icon: 'icon-living-with-family',
			bg: 'icon-living-with-family',
			targetPos: {
				x: 480,
				y: RetirementConfigData.OFFSET_TOP
			}
		},
		{
			name: 'Living with family',
			value: 10000,
			icon: 'icon-living-with-family',
			bg: 'icon-living-with-family',
			targetPos: {
				x: 480,
				y: RetirementConfigData.OFFSET_TOP
			}
		}

	];

	// exports
	retirement.RetirementConfigData = RetirementConfigData;
}(data.retirement));