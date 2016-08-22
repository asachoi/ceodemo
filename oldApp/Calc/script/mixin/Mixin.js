/* © 2015 Aleph-labs.com
 * @author Ernesto Pile
 */
// namespace
var mixin = mixin || {};

(function(mixin, $) {
	'use strict';

	/**
	 * A helper class to add mixins
	 * @class
	 */
	function Mixin() {
	}

	Mixin.VERSION  = '0.0.1';

	Mixin.DEFAULTS = {

	}; 

	/**
	* Extend an existing object with a method from another
	* @param receivingClass - the class to get mixin
	* @param mixinClass - the mixin whose methods will be added to the receivingClass
	* @param ... - optional argument to select only the methods to add
	*/
	Mixin.addMixin = function( receivingClass, mixinClass ) {
	 
	    // only provide certain methods
	    if ( arguments[2] ) {
	        for ( var i = 2, len = arguments.length; i < len; i++ ) {
	            receivingClass.prototype[arguments[i]] = mixinClass.prototype[arguments[i]];
	        }
	    }
	    // provide all methods
	    else {
	        for ( var methodName in mixinClass.prototype ) {
	 			
	            // check to make sure the receiving class doesn't
	            // have a method of the same name as the one currently
	            // being processed
	            if ( !Object.hasOwnProperty.call(receivingClass.prototype, methodName) ) {
	                receivingClass.prototype[methodName] = mixinClass.prototype[methodName];
	            }
	 
	            // Alternatively (check prototype chain as well):
	            // if ( !receivingClass.prototype[methodName] ) {
	            // receivingClass.prototype[methodName] = mixinClass.prototype[methodName];
	            // }
	        }
	    }
	}


	// exports
	mixin.Mixin = Mixin;

}(mixin, jQuery));