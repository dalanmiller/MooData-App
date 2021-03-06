// 'use strict';
// /*global window */
// window.app = {
// 		// Application Constructor
// 		initialize: function () {
// 			this.bindEvents();
// 		},
// 		// Bind Event Listeners
// 		//
// 		// Bind any events that are required on startup. Common events are:
// 		// 'load', 'deviceready', 'offline', and 'online'.
// 		bindEvents: function () {
// 			/*jslint browser:true */
// 			document.addEventListener('deviceready', this.onDeviceReady, false);
// 			document.addEventListener("touchstart", function(){}, true)

// 		},
// 		// deviceready Event Handler
// 		//
// 		// The scope of 'this' is the event. In order to call the 'receivedEvent'
// 		// function, we must explicity call 'app.receivedEvent(...);'
// 		onDeviceReady: function () {
// 			window.app.receivedEvent('deviceready');
// 		},
// 		// Update DOM on a Received Event
// 		receivedEvent: function (id) {
// 			/*jslint browser:true */
// 			var parentElement = document.getElementById(id);
// 			var listeningElement = parentElement.querySelector('.listening');
// 			var receivedElement = parentElement.querySelector('.received');

// 			listeningElement.setAttribute('style', 'display:none;');
// 			receivedElement.setAttribute('style', 'display:block;');
// 		}
// 	};
// window.app.initialize();