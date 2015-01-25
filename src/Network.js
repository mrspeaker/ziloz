(function () {

	"use strict";

	var Network = {

		socket: null,

		pingEvery: 40,
		delta: 0,
		lastPingSent: null,
		lastPingRec: null,

		init: function () {

			this.initSocket();

			return this;
		},

		initSocket: function () {

			if (this.socket) {

				console.log("Already connected, yo.", this.socket);

				return this;

			}

			var socket = this.socket = window.io(window.location.host,  {
				reconnection: true
			});

			socket.io.on("reconnect", function () {

				// TODO
				console.log("Disconnect/refresh");
				socket.io.disconnect();
				setTimeout(function () {

					window.location.href = window.location.href;

				}, 250);

			});

			socket.on("game/welcome", function (d) {

				console.log("Welcome to the game!", d);

			});

		},

		tick: function (model) {

			// Do update ping
			var now = Date.now();

			if (now - this.lastPingSent > this.pingEvery) {

				this.lastPingSent = now;
				this.send_ping(model);

			}

		},

		receive_ping: function (ping) {

			// Get delta since last ping
			this.delta = (ping.elapsed - this.lastPingRec) * 1000;
			this.lastPingRec = ping.elapsed;

		},

		send_ping: function (model) {

			this.socket.emit("ping", model);

		}


	};

	window.Network = Network;

}());
