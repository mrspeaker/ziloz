"use strict";

var express = require("express"),
	app = express(),
	http = require("http").Server(app),
	io = require("socket.io")(http),
	UUID = require("node-uuid"),
	port = 3002;

var games = [];

app.get("/", function(req, res){
	res.sendFile("index.html", {"root": "../"});
});
app.use("/src", express.static(__dirname + "/../src/"));
app.use("/res", express.static(__dirname + "/../res/"));
app.use("/lib", express.static(__dirname + "/../lib/"));

io.on("connection", function (client) {

	console.log("client", client.id);

	client.on("ping", function (d) {

		this.broadcast.to(this.gameId).emit("game/recPing", d);

	});

	client.on("disconnect", function (d) {

		if (client.gameId) {

			// Do what, exactly?
			var game = games.filter(function (g) {
				return g.id === client.gameId;
			});

			if (game.length) {
				if (game[0].players.length === 1) {
					// Remove the game
					games = games.filter(function (g) {
						return g.id !== game[0].id;
					});
				} else {
					console.log("What if we're in the middle of a game, hey?!");
				}
			};

		};

	});

	client.on("join_request", function () {

		var game = games.reduce(function (ac, el) {

			if (ac) return ac;
			if (el.players.length < 2) {

				console.log("Joining game:", el.id);
				return el;

			}

		}, null);

		// ... or create a new one.
		if (!game) {
			console.log("create new game");
			game = {
				players: [],
				id: Math.random() * 999999 | 0
			}
			games.push(game);
		}

		game.players.push(client);
		client.gameId = game.id;

		client.join(game.id);

		if (game.players.length == 2) {

			io.sockets.in(game.id).emit("game/start", {
				game: game.id,
				p1: game.players[0].id,
				p2: game.players[1].id
			});

		}

	});

	client.on("fire_one", function (posRot) {

		this.broadcast.to(this.gameId).emit("game/recFire", posRot);

	});

	client.on("die", function () {

		io.sockets.in(this.gameId).emit("game/die", client.id);

	});

});

http.listen(port, function () {

	console.log("listening on *:" + port);
	loopTick();
	loopPing();

});

function loopPing () {

	//Worlds.ping();
	setTimeout(loopPing, 40);

}

function loopTick () {

	//Worlds.tick();
	setTimeout(loopTick, 1000 / 60);

}
