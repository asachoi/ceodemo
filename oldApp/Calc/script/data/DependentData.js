/* © 2014 Aleph-labs.com
 * @author Phuong Vo
 */
// namespace
var data = data || {};

(function(data) {

	'use strict';

	/**
	 * DependentData component
	 * @class
	 * @param {[type]} element [description]
	 * @param {[type]} options [description]
	 */
	function DependentData() {
		this.initDefault();
	}

	DependentData.VERSION  = '3.3.1';

	DependentData.DEFAULTS = {

	};

	DependentData.prototype = {
		constructor: DependentData,
		_identification: "",	//must follow the CharacterData
		_age: 0,
		_gender: null,
		_name: '',
		_educationExpenses: 0,
		_starAge: 0,
		_yearSupport: 0,
		_primaryStatus: 0,
		_secondaryStatus: 0,
		_universityStatus: 0,
		_estimateEducationCost: 0,
		_isOldie: false,


		initDefault: function() {
			this._age = -1;
			this._educationExpenses = -1;
			this._starAge = 0;
			this._yearSupport = 0;
			this._primaryStatus = 0;
			this._secondaryStatus = 0;
			this._universityStatus = 0;
			this._estimateEducationCost = 0;
		},

		setIdentification: function(identification) {
			this._identification = identification;
		},

		getIdentification: function() {
			return this._identification;
		},

		setAge: function(age) {
			this._age = age;
		},

		getAge: function() {
			return this._age;
		},

		setName: function(name) {
			this._name = name;
		},

		getName: function() {
			return this._name;
		},

		setEducationExpenses: function(educationExpenses) {
			this._educationExpenses = educationExpenses;
		},

		setGender: function(gender) {
			this._gender = gender;
		},

		getGender: function() {
			return this._gender;
		},

		setStarAge: function(starAge) {
			this._starAge = starAge;
		},

		getStarAge: function() {
			return this._starAge;
		},

		setYearSupport: function(yearSupport) {
			this._yearSupport = yearSupport;
		},

		getYearSupport: function() {
			return this._yearSupport;
		},

		setPrimaryStatus: function(primaryStatus) {
			this._primaryStatus = primaryStatus;
		},

		getPrimaryStatus: function() {
			return this._primaryStatus;
		},

		setSecondaryStatus: function(secondaryStatus) {
			this._secondaryStatus = secondaryStatus;
		},

		getSecondaryStatus: function() {
			return this._secondaryStatus;
		},

		setUniversityStatus: function(universityStatus) {
			this._universityStatus = universityStatus;
		},

		getUniversityStatus: function() {
			return this._universityStatus;
		},

		setIsOldie: function(bool) {
			this._isOldie = bool;
		},

		getIsOldie: function() {
			return this._isOldie;
		},


		setEstimateEducationCost: function(estimateEducationCost) {
			this._estimateEducationCost = estimateEducationCost;
		},

		getDependents: function() {
			return this._estimateEducationCost;
		}

	};

	// exports
	data.DependentData = DependentData;
}(data));