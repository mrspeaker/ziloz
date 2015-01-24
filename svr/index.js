"use strict";

var express = require("express"),
	app = express(),
	http = require("http").Server(app),
	io = require("socket.io")(http),
	port = 3002;

var games = [];

app.get("/", function(req, res){
	res.sendFile("index.html", {"root": "../"});
});
app.use("/src", express.static(__dirname + "/../src/"));
app.use("/res", express.static(__dirname + "/../res/"));
app.use("/lib", express.static(__dirname + "/../lib/"));

io.on("connection", function (client) {

	var game = games.reduce(function (ac, el) {

		if (ac) return ac;
		if (el.players.length < 2) {

			console.log("Joining game:", el.id);
			return el;

		}

	}, null);

	// ... or create a new one.
	if (!game) {
		console.log("create enw game");
		game = {
			players: [],
			id: Math.random() * 999999 | 0
		}
		games.push(game);
	}

	game.players.push(client);

	client.join(game.id);
	io.sockets.in(game.id).emit("game/welcome", game.id);

});

http.listen(port, function () {

	console.log("listening on *:" + port);

});
