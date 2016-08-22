/* © 2014 Aleph-labs.com
 * @author Phuong Vo
 */
// namespace
var data = data || {};

(function(data) {
	'use strict';

	/**
	 * SubscribeItem data
	 * @class
	 */
	function SubscribeItem() {
		this.initialize();
	}

	SubscribeItem.VERSION  = '3.3.1';

	SubscribeItem.DEFAULTS = {

	};

	SubscribeItem.prototype = {
		constructor: SubscribeItem,

		initialize: function() {
			this.topics = {};
			this.subUid = -1;
		},

		//for suscribe and publish
		topics: {},
		// An topic identifier
	    	subUid : -1,

		// Publish or broadcast events of interest
		// with a specific topic name and arguments
		// such as the data to pass along
		publish : function( topic, args ) {
			if ( !this.topics[topic] ) {
				return false;
			}

			var subscribers = this.topics[topic],
			len = subscribers ? subscribers.length : 0;

			while (len--) {
				subscribers[len].func( topic, args );
			}

			return this;
		},

		// Subscribe to events of interest
		// with a specific topic name and a
		// callback function, to be executed
		// when the topic/event is observed
		subscribe : function( topic, func ) {
			if (!this.topics[topic]) {
				this.topics[topic] = [];
			}

			var token = ( ++this.subUid ).toString();
			this.topics[topic].push({
				token: token,
				func: func
			});
			return token;
		},

		// Unsubscribe from a specific
		// topic, based on a tokenized reference
		// to the subscription
		unsubscribe : function( token ) {
			for ( var m in this.topics ) {
				if ( this.topics[m] ) {
					for ( var i = 0, j = this.topics[m].length; i < j; i++ ) {
						if ( this.topics[m][i].token === token ) {
							this.topics[m].splice( i, 1 );
							return token;
						}
					}
				}
			}
			return this;
		}
	};

	// exports
	data.SubscribeItem = SubscribeItem;
}(data));