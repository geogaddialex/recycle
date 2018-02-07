'use strict';

//socket factory that provides the socket service
angular.module( 'myApp' ).factory('SocketService', function( ){

	var socket = io.connect();

	return {

		on: function(event, callback){

			socket.on(event, callback);   
		},

		emit: function (eventName, data, callback) {
			
          socket.emit(eventName, data, callback);
		},

		getSocket: function() {
			return socket;
		}
	}

});