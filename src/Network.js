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

			socket.on("game/start", function (d) {

				main.screen.listen("net/game/start", d);

			});

			socket.on("game/recPing", function (d) {

				main.screen.listen("net/game/ping", d);

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

		send_ping: function (model) {

			this.socket.emit("ping", model);

		},

		send_join_request: function () {

			this.socket.emit("join_request");

		}


	};

	window.Network = Network;

}());
