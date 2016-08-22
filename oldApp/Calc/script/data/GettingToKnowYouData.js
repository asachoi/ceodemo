/* © 2014 Aleph-labs.com
 * @author Phuong Vo
 */
// namespace

var data = data || {};

(function (data) {
	'use strict';

	function GettingToKnowYouData() {
		this.initDefault();
	}

	GettingToKnowYouData.VERSION = '3.3.1';

	GettingToKnowYouData.DEFAULTS = {

	};

	GettingToKnowYouData.EVENT_CHANGE_CUSTOMER = "event_change_customer";
	GettingToKnowYouData.EVENT_CHANGE_MARITAL = "event_change_marital";
	GettingToKnowYouData.EVENT_CHANGE_DEPENDENT = "event_change_dependent";
	GettingToKnowYouData.EVENT_CHANGE_CHILDREN = "event_change_children";
	GettingToKnowYouData.EVENT_CHANGE_HOUSE = "event_change_house";
	GettingToKnowYouData.EVENT_CHANGE_OCCUPATION = "event_change_occupation";
	GettingToKnowYouData.EVENT_CHANGE_DREAM = "event_change_dream";
	GettingToKnowYouData.EVENT_CHANGE_CONCERN = "event_change_concern";
	GettingToKnowYouData.EVENT_CHANGE_LIFESTAGE = "event_lifestage";
	GettingToKnowYouData.EVENT_RESET = "event_reset";


	GettingToKnowYouData.MARITAL_SINGLE = 0;
	GettingToKnowYouData.MARITAL_MARRIED = 1;
	GettingToKnowYouData.MARITAL_DIVORCED = 2;
	GettingToKnowYouData.MARITAL_WIDOWED = 3;

	GettingToKnowYouData.prototype = {
		constructor: GettingToKnowYouData,

		_identification: null,
		_gender: -1,
		_age: 0,
		_maritalStatus: 0, //0-Single, 1-Married
		_occupation: 0,

		_dependents: null,
		_childrens:null,	//children is dependentData type

		_housingType: null,
		_housingIncome: null,
		_housingExpenses: null,
		_housingOutstandingMortgage: null,
		_housingMonthlyMortgagePayment: null,
		_housingMonthlyRentalExpenses: null,

		_lifeStage: null,

		_dreamList: null,
		_concernList:null,


		initDefault: function () {
			this._identification = data.CharacterData.CHARACTER_MAN_IDENTIFICATION;
			this._gender = data.CharacterData.NOT_IDENTIFY;
			this._age = 0;
			this._maritalStatus = 0;
			this._occupation = 0;
			this._housingType = null;
			this._housingIncome = null;
			this._housingExpenses = null;

			this._dependents = [];
			this._childrens = [];

			this._dreamList = [];
			this._concernList = [];

			this.listenerList = {};
		},

		/**
		* Alias for initDefault
		*/
		resetData: function(){
			this.initDefault();
		},


		setHousing: function (housing) {
			this._housingType = housing.type;
			this._housingIncome = housing.income;
			this._housingExpenses = housing.expenses;
			this._housingOutstandingMortgage = housing.outstandingMortgage,
			this._housingMonthlyMortgagePayment = housing.monthlyMortgagePayment,
			this._housingMonthlyRentalExpenses = housing.monthlyRentalExpenses;
		},

		getHousing: function () {
			var housing = {
				type: this._housingType,
				income: this._housingIncome,
				expenses: this._housingExpenses,
				outstandingMortgage: this._housingOutstandingMortgage,
				monthlyMortgagePayment: this._housingMonthlyMortgagePayment,
				monthlyRentalExpenses: this._housingMonthlyRentalExpenses
			};
			return housing;
		},

		emptyHousing: function () {
			this.setHousing({});
		},


		setIdentification: function (identification) {
			this._identification = identification;
		},

		getIdentification: function () {
			return this._identification;
		},

		setGender: function (gender) {
			this._gender = gender;
		},

		getGender: function () {
			return this._gender;
		},

		setAge: function (age) {
			this._age = age;
		},

		getAge: function () {
			return this._age;
		},

		setMaritalStatus: function (maritalStatus) {
			this._maritalStatus = maritalStatus;
		},

		getMaritalStatus: function () {
			return this._maritalStatus;
		},

		setOccupation: function (occupation) {
			this._occupation = occupation;
		},

		getOccupation: function () {
			return this._occupation;
		},

		//dependent and children
		setDependents: function (dependents) {
			this._dependents = dependents;
		},

		getDependents: function () {
			return this._dependents;
		},

		addDependent: function (dependent) {
			this._dependents.push(dependent);
		},

		removeDependent: function (dependent) {
			var indexOfDependent = this._dependents.indexOf(dependent);
			if (indexOfDependent !== -1) {
				this._dependents.splice(indexOfDependent, 1);
				return true;
			}

			return false; //can not remove
		},

		emptyDependent: function () {
			this._dependents = [];
		},

		isCharacterIdentificationInDependentList: function(id) {
			for (var i = 0; i < this._dependents.length; i++) {
				var dependentData = this._dependents[i];
				var identification = dependentData.getIdentification();
				if (identification === id) {
					return true;
				}
			}

			return false;
		},

		setChildrens: function(childrens) {
			this._childrens = childrens;
		},

		getChildrens: function() {
			return this._childrens;
		},

		getConcernList: function() {
			return this._concernList;
		},

		addChildren: function(children) {
			this._childrens.push(children);
		},

		removeChildren: function(children) {
			var indexOfChildren = this._childrens.indexOf(children);
			if (indexOfChildren !== -1) {
				this._childrens.splice(indexOfChildren, 1);
				return true;
			}

			return false; //can not remove
		},

		emptyChildren: function () {
			this._childrens = [];
		},

		/**
		 * Dream section
		 */

		getDreamList: function() {
			return this._dreamList;
		},

		emptyDreamList: function() {
			this._dreamList = [];
		},

		addDreamElement: function(dreamData) {
			this._dreamList.push(dreamData);
		},

		removeDream:function(dreamData){
			for (var i = 0; i < this._dreamList.length; i++) {
				var item = this._dreamList[i];
				if (item === dreamData) {
					this._dreamList.splice(i, 1);
					break;
				}
			}
		},


		isDreamTypeInDreamList: function(dreamType) {
			for (var i = 0; i < this._dreamList.length; i++) {
				var item = this._dreamList[i];
				if (item.getDreamType() === dreamType) {
					return true;
				}
			}

			return false;
		},

		/**
		 * life style section
		 */
		setLifeStage: function(lifeStage) {
			console.log("GettingToKnowYouData::setLifeStage:", lifeStage);
			this._lifeStage = lifeStage;
		},

		getLifeStage: function() {
			return this._lifeStage;
		},


		addConcern: function(concernData){
			this._concernList.push(concernData);
		},


		removeConcern: function(concernData){
			for (var i = 0; i < this._concernList.length; i++) {
				var item = this._concernList[i];
				if (item === concernData) {
					this._concernList.splice(i, 1);
					break;
				}
			}
		},

		emptyConcernList: function() {
			this._concernList = [];
		},

		isConcernTypeInConcernList: function(concernType) {
			for (var i = 0; i < this._concernList.length; i++) {
				var item = this._concernList[i];
				if (item.id === concernType) {
					return true;
				}
			}

			return false;
		},


		//notification system event
		topics: {},
		// An topic identifier
		subUid: -1,

		// Publish or broadcast events of interest
		// with a specific topic name and arguments
		// such as the data to pass along
		publish: function (topic, args) {
			if (!this.topics[topic]) {
				return false;
			}

			var subscribers = this.topics[topic],
				len = subscribers ? subscribers.length : 0;

			while (len--) {
				subscribers[len].func(topic, args);
			}

			return this;
		},

		// Subscribe to events of interest
		// with a specific topic name and a
		// callback function, to be executed
		// when the topic/event is observed
		subscribe: function (topic, func) {
			if (!this.topics[topic]) {
				this.topics[topic] = [];
			}

			var token = (++this.subUid).toString();
			this.topics[topic].push({
				token: token,
				func: func
			});
			return token;
		},

		// Unsubscribe from a specific
		// topic, based on a tokenized reference
		// to the subscription
		unsubscribe: function (token) {
			for (var m in this.topics) {
				if (this.topics[m]) {
					for (var i = 0, j = this.topics[m].length; i < j; i++) {
						if (this.topics[m][i].token === token) {
							this.topics[m].splice(i, 1);
							return token;
						}
					}
				}
			}
			return this;
		}
	};

	// exports
	data.GettingToKnowYouData = GettingToKnowYouData;

}(data));