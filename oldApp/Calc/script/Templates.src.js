/* © 2014 Aleph-labs.com
 * @author Ernesto Pile
 */
// namespace
var app = app || {};

(function(app, $, Handlebars) {
	'use strict';

	/**
	 * Templates Helper
	 * @class
	 * @param {[type]} options [description]
	 */
	function Templates(options) {
		this.options   = $.extend({}, Templates.DEFAULTS, options);
	}

	Templates.VERSION  = '1.0.0';

	Templates.DEFAULTS = {
		// no defaults for now
	};

    Templates.templateHash = {

		//elements
		'progress-bar': Handlebars.compile("<!-- @import elements/progress-bar.tpl -->"),
		'swipe-select': Handlebars.compile("<!-- @import elements/swipe-select.tpl -->"),
		'swipe-select-image': Handlebars.compile("<!-- @import elements/swipe-select-image.tpl -->"),
		'header-component': Handlebars.compile("<!-- @import elements/header-component.tpl -->"),
		'right-panel-item': Handlebars.compile("<!-- @import elements/right-panel-item.tpl -->"),
		'character-image': Handlebars.compile("<!-- @import elements/character-image.tpl -->"),
		'css-checkbox': Handlebars.compile("<!-- @import elements/css-checkbox.tpl -->"),
		'concern-item': Handlebars.compile("<!-- @import elements/concern-item.tpl -->"), 
		'language-menu': Handlebars.compile("<!-- @import elements/language-menu.tpl -->"), 
		'personal-protection-item': Handlebars.compile("<!-- @import elements/personal-protection-item.tpl -->"),  

		//pages
		'user-landing-page': Handlebars.compile("<!-- @import pages/user-landing-page.tpl -->"),
		'about-you-page': Handlebars.compile("<!-- @import pages/animation-page.tpl -->"),
		'children-choosing-page': Handlebars.compile("<!-- @import pages/children-choosing-page.tpl -->"),
		'user-dependents-page': Handlebars.compile("<!-- @import pages/user-dependents-page.tpl -->"),
		'your-dream-page': Handlebars.compile("<!-- @import pages/your-dream-page.tpl -->"),
		'your-concern-page': Handlebars.compile("<!-- @import pages/your-concern-page.tpl -->"),
		'user-housing-page' : Handlebars.compile("<!-- @import pages/user-housing-page.tpl -->"),
		'user-life-stage' : Handlebars.compile("<!-- @import pages/user-life-stage.tpl -->"),
		'user-summary-page': Handlebars.compile("<!-- @import pages/user-summary-page.tpl -->"),

		//
		//CHARACTER DEFAULTS
		//
		"baby-default": Handlebars.compile("<!-- @import svg/character/baby-default.svg -->"),

		"boy-infant-default": Handlebars.compile("<!-- @import svg/character/boy-infant-default.svg -->"),
		"boy-default": Handlebars.compile("<!-- @import svg/character/boy-default.svg -->"),
		"boy-teenager-default": Handlebars.compile("<!-- @import svg/character/boy-teenager-default.svg -->"),

		"girl-infant-default": Handlebars.compile("<!-- @import svg/character/girl-infant-default.svg -->"),
		"girl-default": Handlebars.compile("<!-- @import svg/character/girl-default.svg -->"),
		"girl-teenager-default": Handlebars.compile("<!-- @import svg/character/girl-teenager-default.svg -->"),

		"young-woman-default": Handlebars.compile("<!-- @import svg/character/young-woman-default.svg -->"),
		"woman-default": Handlebars.compile("<!-- @import svg/character/woman-default.svg -->"),
		"old-woman-default": Handlebars.compile("<!-- @import svg/character/old-woman-default.svg -->"),

		"young-man-default": Handlebars.compile("<!-- @import svg/character/young-man-default.svg -->"),
		"man-default": Handlebars.compile("<!-- @import svg/character/man-default.svg -->"),
		"old-man-default": Handlebars.compile("<!-- @import svg/character/old-man-default.svg -->"),

		"grandma-default": Handlebars.compile("<!-- @import svg/character/grand-mother-default.svg -->"),
		"grandpa-default": Handlebars.compile("<!-- @import svg/character/grand-father-default.svg -->"),



		//
		//occupations
		//

		//man-young
		"young-man-career-starter": Handlebars.compile("<!-- @import svg/occupation/man_young/man-18-30-career-starter-animated.min.svg -->"),
		"young-man-civil-servant": Handlebars.compile("<!-- @import svg/occupation/man_young/man-18-30-civil-servant-animated.min.svg -->"),
		"young-man-excutive": Handlebars.compile("<!-- @import svg/occupation/man_young/man-18-30-executive-animated.min.svg -->"),
		"young-man-intermediate": Handlebars.compile("<!-- @import svg/occupation/man_young/man-18-30-intermediate-animated.min.svg -->"),
		"young-man-professional": Handlebars.compile("<!-- @import svg/occupation/man_young/man-18-30-professional-animated.min.svg -->"),
		"young-man-retirement": Handlebars.compile("<!-- @import svg/occupation/man_young/man-18-30-retired-animated.min.svg -->"),
		"young-man-self-employed": Handlebars.compile("<!-- @import svg/occupation/man_young/man-18-30-self-employed-animated.min.svg -->"),
		"young-man-student": Handlebars.compile("<!-- @import svg/occupation/man_young/man-18-30-student-animated.min.svg -->"),
		"young-man-supervisor": Handlebars.compile("<!-- @import svg/occupation/man_young/man-18-30-supervisor-animated.min.svg -->"),
		"young-man-unemployed": Handlebars.compile("<!-- @import svg/occupation/man_young/man-18-30-unemployed-animated.min.svg -->"),

		//man
		"man-career-starter": Handlebars.compile("<!-- @import svg/occupation/man/man-31-50-career-starter-animated.min.svg -->"),
		"man-civil-servant": Handlebars.compile("<!-- @import svg/occupation/man/man-31-50-civil-servant-animated.min.svg -->"),
		"man-excutive": Handlebars.compile("<!-- @import svg/occupation/man/man-31-50-executive-animated.min.svg -->"),
		"man-intermediate": Handlebars.compile("<!-- @import svg/occupation/man/man-31-50-intermediate-animated.min.svg -->"),
		"man-professional": Handlebars.compile("<!-- @import svg/occupation/man/man-31-50-professional-animated.min.svg -->"),
		"man-retirement": Handlebars.compile("<!-- @import svg/occupation/man/man-31-50-retired-animated.min.svg -->"),
		"man-self-employed": Handlebars.compile("<!-- @import svg/occupation/man/man-31-50-self-employed-animated.min.svg -->"),
		"man-student": Handlebars.compile("<!-- @import svg/occupation/man/man-31-50-student-animated.min.svg -->"),
		"man-supervisor": Handlebars.compile("<!-- @import svg/occupation/man/man-31-50-supervisor-animated.min.svg -->"),
		"man-unemployed": Handlebars.compile("<!-- @import svg/occupation/man/man-31-50-unemployed-animated.min.svg -->"),

		//man-oldie
		"old-man-career-starter": Handlebars.compile("<!-- @import svg/occupation/man_oldie/man-51-99-career-starter-animated.min.svg -->"),
		"old-man-civil-servant": Handlebars.compile("<!-- @import svg/occupation/man_oldie/man-51-99-civil-servant-animated.min.svg -->"),
		"old-man-excutive": Handlebars.compile("<!-- @import svg/occupation/man_oldie/man-51-99-executive-animated.min.svg -->"),
		"old-man-intermediate": Handlebars.compile("<!-- @import svg/occupation/man_oldie/man-51-99-intermediate-animated.min.svg -->"),
		"old-man-professional": Handlebars.compile("<!-- @import svg/occupation/man_oldie/man-51-99-professional-animated.min.svg -->"),
		"old-man-retirement": Handlebars.compile("<!-- @import svg/occupation/man_oldie/man-51-99-retired-animated.min.svg -->"),
		"old-man-self-employed": Handlebars.compile("<!-- @import svg/occupation/man_oldie/man-51-99-self-employed-animated.min.svg -->"),
		"old-man-student": Handlebars.compile("<!-- @import svg/occupation/man_oldie/man-51-99-student-animated.min.svg -->"),
		"old-man-supervisor": Handlebars.compile("<!-- @import svg/occupation/man_oldie/man-51-99-supervisor-animated.min.svg -->"),
		"old-man-unemployed": Handlebars.compile("<!-- @import svg/occupation/man_oldie/man-51-99-unemployed-animated.min.svg -->"),


		//woman-young
		"young-woman-career-starter": Handlebars.compile("<!-- @import svg/occupation/woman_young/woman-18-30-career-starter-animated.min.svg -->"),
		"young-woman-civil-servant": Handlebars.compile("<!-- @import svg/occupation/woman_young/woman-18-30-civil-servant-animated.min.svg -->"),
		"young-woman-excutive": Handlebars.compile("<!-- @import svg/occupation/woman_young/woman-18-30-executive-animated.min.svg -->"),
		"young-woman-intermediate": Handlebars.compile("<!-- @import svg/occupation/woman_young/woman-18-30-intermediate-animated.min.svg -->"),
		"young-woman-professional": Handlebars.compile("<!-- @import svg/occupation/woman_young/woman-18-30-professional-animated.min.svg -->"),
		"young-woman-retirement": Handlebars.compile("<!-- @import svg/occupation/woman_young/woman-18-30-retired-animated.min.svg -->"),
		"young-woman-self-employed": Handlebars.compile("<!-- @import svg/occupation/woman_young/woman-18-30-self-employed-animated.min.svg -->"),
		"young-woman-student": Handlebars.compile("<!-- @import svg/occupation/woman_young/woman-18-50-student-animated.min.svg -->"),
		"young-woman-supervisor": Handlebars.compile("<!-- @import svg/occupation/woman_young/woman-18-30-supervisor-animated.min.svg -->"),
		"young-woman-unemployed": Handlebars.compile("<!-- @import svg/occupation/woman_young/woman-18-30-unemployed-animated.min.svg -->"),

		//woman
		"woman-career-starter": Handlebars.compile("<!-- @import svg/occupation/woman/woman-31-50-career-starter-animated.min.svg -->"),
		"woman-civil-servant": Handlebars.compile("<!-- @import svg/occupation/woman/woman-31-50-civil-servant-animated.min.svg -->"),
		"woman-excutive": Handlebars.compile("<!-- @import svg/occupation/woman/woman-31-50-executive.svg -->"),
		"woman-intermediate": Handlebars.compile("<!-- @import svg/occupation/woman/woman-31-50-intermediate.svg -->"),
		"woman-professional": Handlebars.compile("<!-- @import svg/occupation/woman/woman-31-50-professional.svg -->"),
		"woman-retirement": Handlebars.compile("<!-- @import svg/occupation/woman/woman-31-50-retired.svg -->"),
		"woman-self-employed": Handlebars.compile("<!-- @import svg/occupation/woman/woman-31-50-self-employed.svg -->"),
		"woman-student": Handlebars.compile("<!-- @import svg/occupation/woman_young/woman-18-50-student-animated.min.svg -->"),
		"woman-supervisor": Handlebars.compile("<!-- @import svg/occupation/woman/woman-31-50-supervisor.svg -->"),
		"woman-unemployed": Handlebars.compile("<!-- @import svg/occupation/woman/woman-31-50-unemployed.svg -->"),

		//woman-oldie
		"old-woman-career-starter": Handlebars.compile("<!-- @import svg/occupation/woman_oldie/woman-51-99-career-starter-animated.min.svg -->"),
		"old-woman-civil-servant": Handlebars.compile("<!-- @import svg/occupation/woman_oldie/woman-51-99-civil-servant-animated.min.svg -->"),
		"old-woman-excutive": Handlebars.compile("<!-- @import svg/occupation/woman_oldie/woman-51-99-executive-animated.min.svg -->"),
		"old-woman-intermediate": Handlebars.compile("<!-- @import svg/occupation/woman_oldie/woman-51-99-intermediate-animated.min.svg -->"),
		"old-woman-professional": Handlebars.compile("<!-- @import svg/occupation/woman_oldie/woman-51-99-professional-animated.min.svg -->"),
		"old-woman-retirement": Handlebars.compile("<!-- @import svg/occupation/woman_oldie/woman-51-99-retired-animated.min.svg -->"),
		"old-woman-self-employed": Handlebars.compile("<!-- @import svg/occupation/woman_oldie/woman-51-99-self-employed-animated.min.svg -->"),
		"old-woman-student": Handlebars.compile("<!-- @import svg/occupation/woman_oldie/woman-51-99-student-animated.min.svg -->"),
		"old-woman-supervisor": Handlebars.compile("<!-- @import svg/occupation/woman_oldie/woman-51-99-supervisor-animated.min.svg -->"),
		"old-woman-unemployed": Handlebars.compile("<!-- @import svg/occupation/woman_oldie/woman-51-99-unemployed-animated.min.svg -->"),


		//
		//emotions
		//

		//man-young
		"young-man-default-sad": Handlebars.compile("<!-- @import svg/character/young-man-default.svg -->"),
		"young-man-career-starter-sad": Handlebars.compile("<!-- @import svg/emotion/man_young/man-18-30-career-starter-sad-animated.min.svg -->"),
		"young-man-civil-servant-sad": Handlebars.compile("<!-- @import svg/emotion/man_young/man-18-30-civil-servant-sad-animated.min.svg -->"),
		"young-man-excutive-sad": Handlebars.compile("<!-- @import svg/emotion/man_young/man-18-30-executive-sad-animated.min.svg -->"),
		"young-man-intermediate-sad": Handlebars.compile("<!-- @import svg/emotion/man_young/man-18-30-intermediate-sad-animated.min.svg -->"),
		"young-man-professional-sad": Handlebars.compile("<!-- @import svg/emotion/man_young/man-18-30-professional-sad-animated.min.svg -->"),
		"young-man-retirement-sad": Handlebars.compile("<!-- @import svg/emotion/man_young/man-18-30-retired-sad-animated.min.svg -->"),
		"young-man-self-employed-sad": Handlebars.compile("<!-- @import svg/emotion/man_young/man-18-30-self-employed-sad-animated.min.svg -->"),
		"young-man-student-sad": Handlebars.compile("<!-- @import svg/emotion/man_young/man-18-30-student-sad-animated.min.svg -->"),
		"young-man-supervisor-sad": Handlebars.compile("<!-- @import svg/emotion/man_young/man-18-30-supervisor-sad-animated.min.svg -->"),
		"young-man-unemployed-sad": Handlebars.compile("<!-- @import svg/emotion/man_young/man-18-30-unemployed-sad-animated.min.svg -->"),


		//man
		"man-default-sad": Handlebars.compile("<!-- @import svg/character/man-default.svg -->"),
		"man-career-starter-sad": Handlebars.compile("<!-- @import svg/emotion/man/man-31-50-career-starter-sad-animated.min.svg -->"),
		"man-civil-servant-sad": Handlebars.compile("<!-- @import svg/emotion/man/man-31-50-civil-servant-sad-animated.min.svg -->"),
		"man-excutive-sad": Handlebars.compile("<!-- @import svg/emotion/man/man-31-50-executive-sad-animated.min.svg -->"),
		"man-intermediate-sad": Handlebars.compile("<!-- @import svg/emotion/man/man-31-50-intermediate-sad-animated.min.svg -->"),
		"man-professional-sad": Handlebars.compile("<!-- @import svg/emotion/man/man-31-50-professional-sad-animated.min.svg -->"),
		"man-retirement-sad": Handlebars.compile("<!-- @import svg/emotion/man/man-31-50-retired-sad-animated.min.svg -->"),
		"man-self-employed-sad": Handlebars.compile("<!-- @import svg/emotion/man/man-31-50-self-employed-sad-animated.min.svg -->"),
		"man-student-sad": Handlebars.compile("<!-- @import svg/emotion/man/man-31-50-student-sad-animated.min.svg -->"),
		"man-supervisor-sad": Handlebars.compile("<!-- @import svg/emotion/man/man-31-50-supervisor-sad-animated.min.svg -->"),
		"man-unemployed-sad": Handlebars.compile("<!-- @import svg/emotion/man/man-31-50-unemployed-sad-animated.min.svg -->"),

		//man-oldie
		"old-man-default-sad": Handlebars.compile("<!-- @import svg/character/old-man-default.svg -->"),
		"old-man-career-starter-sad": Handlebars.compile("<!-- @import svg/emotion/man_oldie/man-51-99-career-starter-sad-animated.min.svg -->"),
		"old-man-civil-servant-sad": Handlebars.compile("<!-- @import svg/emotion/man_oldie/man-51-99-civil-servant-sad-animated.min.svg -->"),
		"old-man-excutive-sad": Handlebars.compile("<!-- @import svg/emotion/man_oldie/man-51-99-executive-sad-animated.min.svg -->"),
		"old-man-intermediate-sad": Handlebars.compile("<!-- @import svg/emotion/man_oldie/man-51-99-intermediate-sad-animated.min.svg -->"),
		"old-man-professional-sad": Handlebars.compile("<!-- @import svg/emotion/man_oldie/man-51-99-professional-sad-animated.min.svg -->"),
		"old-man-retirement-sad": Handlebars.compile("<!-- @import svg/emotion/man_oldie/man-51-99-retired-sad-animated.min.svg -->"),
		"old-man-self-employed-sad": Handlebars.compile("<!-- @import svg/emotion/man_oldie/man-51-99-self-employed-sad-animated.min.svg -->"),
		"old-man-student-sad": Handlebars.compile("<!-- @import svg/emotion/man_oldie/man-51-99-student-sad-animated.min.svg -->"),
		"old-man-supervisor-sad": Handlebars.compile("<!-- @import svg/emotion/man_oldie/man-51-99-supervisor-sad-animated.min.svg -->"),
		"old-man-unemployed-sad": Handlebars.compile("<!-- @import svg/emotion/man_oldie/man-51-99-unemployed-sad-animated.min.svg -->"),


		//woman-young
		"young-woman-default-sad": Handlebars.compile("<!-- @import svg/character/young-woman-default.svg -->"),
		"young-woman-career-starter-sad": Handlebars.compile("<!-- @import svg/emotion/woman_young/woman-18-30-career-starter-sad-animated.min.svg -->"),
		"young-woman-civil-servant-sad": Handlebars.compile("<!-- @import svg/emotion/woman_young/woman-18-30-civil-servant-sad-animated.min.svg -->"),
		"young-woman-excutive-sad": Handlebars.compile("<!-- @import svg/emotion/woman_young/woman-18-30-executive-sad-animated.min.svg -->"),
		"young-woman-intermediate-sad": Handlebars.compile("<!-- @import svg/emotion/woman_young/woman-18-30-intermediate-sad-animated.min.svg -->"),
		"young-woman-professional-sad": Handlebars.compile("<!-- @import svg/emotion/woman_young/woman-18-30-professional-sad-animated.min.svg -->"),
		"young-woman-retirement-sad": Handlebars.compile("<!-- @import svg/emotion/woman_young/woman-18-30-retired-sad-animated.min.svg -->"),
		"young-woman-self-employed-sad": Handlebars.compile("<!-- @import svg/emotion/woman_young/woman-18-30-self-employed-sad-animated.min.svg -->"),
		"young-woman-student-sad": Handlebars.compile("<!-- @import svg/emotion/woman_young/woman-18-50-student-sad-animated.min.svg -->"),
		"young-woman-supervisor-sad": Handlebars.compile("<!-- @import svg/emotion/woman_young/woman-18-30-supervisor-sad-animated.min.svg -->"),
		"young-woman-unemployed-sad": Handlebars.compile("<!-- @import svg/emotion/woman_young/woman-18-30-unemployed-sad-animated.min.svg -->"),

		//woman
		"woman-default-sad": Handlebars.compile("<!-- @import svg/character/woman-default.svg -->"),
		"woman-career-starter-sad": Handlebars.compile("<!-- @import svg/emotion/woman/woman-31-50-career-starter-sad-animated.min.svg -->"),
		"woman-civil-servant-sad": Handlebars.compile("<!-- @import svg/emotion/woman/woman-31-50-civil-servant-sad-animated.min.svg -->"),
		"woman-excutive-sad": Handlebars.compile("<!-- @import svg/emotion/woman/woman-31-50-executive-sad-animated.min.svg -->"),
		"woman-intermediate-sad": Handlebars.compile("<!-- @import svg/emotion/woman/woman-31-50-intermediate-sad-animated.min.svg -->"),
		"woman-professional-sad": Handlebars.compile("<!-- @import svg/emotion/woman/woman-31-50-professional-sad-animated.min.svg -->"),
		"woman-retirement-sad": Handlebars.compile("<!-- @import svg/emotion/woman/woman-31-50-retired-sad-animated.min.svg -->"),
		"woman-self-employed-sad": Handlebars.compile("<!-- @import svg/emotion/woman/woman-31-50-self-employed-sad-animated.min.svg -->"),
		"woman-student-sad": Handlebars.compile("<!-- @import svg/occupation/woman_young/woman-18-50-student-animated.min.svg -->"),
		"woman-supervisor-sad": Handlebars.compile("<!-- @import svg/emotion/woman/woman-31-50-supervisor-sad-animated.min.svg -->"),
		"woman-unemployed-sad": Handlebars.compile("<!-- @import svg/emotion/woman/woman-31-50-unemployed-sad-animated.min.svg -->"),

		//woman-oldie
		"old-woman-default-sad": Handlebars.compile("<!-- @import svg/character/old-woman-default.svg -->"),
		"old-woman-career-starter-sad": Handlebars.compile("<!-- @import svg/emotion/woman_oldie/woman-51-99-career-starter-sad-animated.min.svg -->"),
		"old-woman-civil-servant-sad": Handlebars.compile("<!-- @import svg/emotion/woman_oldie/woman-51-99-civil-servant-sad-animated.min.svg -->"),
		"old-woman-excutive-sad": Handlebars.compile("<!-- @import svg/emotion/woman_oldie/woman-51-99-executive-sad-animated.min.svg -->"),
		"old-woman-intermediate-sad": Handlebars.compile("<!-- @import svg/emotion/woman_oldie/woman-51-99-intermediate-sad-animated.min.svg -->"),
		"old-woman-professional-sad": Handlebars.compile("<!-- @import svg/emotion/woman_oldie/woman-51-99-professional-sad-animated.min.svg -->"),
		"old-woman-retirement-sad": Handlebars.compile("<!-- @import svg/emotion/woman_oldie/woman-51-99-retired-sad-animated.min.svg -->"),
		"old-woman-self-employed-sad": Handlebars.compile("<!-- @import svg/emotion/woman_oldie/woman-51-99-self-employed-sad-animated.min.svg -->"),
		"old-woman-student-sad": Handlebars.compile("<!-- @import svg/emotion/woman_oldie/woman-51-99-student-sad-animated.min.svg -->"),
		"old-woman-supervisor-sad": Handlebars.compile("<!-- @import svg/emotion/woman_oldie/woman-51-99-supervisor-sad-animated.min.svg -->"),
		"old-woman-unemployed-sad": Handlebars.compile("<!-- @import svg/emotion/woman_oldie/woman-51-99-unemployed-sad-animated.min.svg -->"),


		//
		//housing svg
		//
		"housing-mortage": Handlebars.compile("<!-- @import svg/housing/bg-housing-mortgage-animated.min.svg -->"),
		"housing-fully-owned": Handlebars.compile("<!-- @import svg/housing/bg-housing-fully-owned-animated.min.svg -->"),
		"housing-rented": Handlebars.compile("<!-- @import svg/housing/bg-housing-rented-animated.min.svg -->"),
		"housing-living-with-family": Handlebars.compile("<!-- @import svg/housing/bg-housing-family-animated.min.svg -->")

	};

	/**
	 * Return the template function to use later
	 * @param  {string} tmpl Template ids, same with *.tmpl file name
	 * @return {Function}    The template function to call later
	 * @method getTemplate
	 * @static
	 */
	Templates.getTemplate = function (tmpl) {
		if (typeof Templates.templateHash[tmpl] === 'function') {
			return Templates.templateHash[tmpl];
		} else {
			throw new Error('Template: ' + tmpl + ' not existed');
		}
	};

	Templates.prototype = {
		constructor: Templates
	};

	// exports
	app.Templates = Templates;
}(app, jQuery, Handlebars));
