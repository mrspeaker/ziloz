"use strict";

var express = require("express"),
	app = express(),
	http = require("http").Server(app),
	io = require("socket.io")(http),
	port = 3002;

var games = {};

app.get("/", function(req, res){
	res.sendFile("index.html", {"root": "../"});
});
app.use("/src", express.static(__dirname + "/../src/"));
app.use("/res", express.static(__dirname + "/../res/"));
app.use("/lib", express.static(__dirname + "/../lib/"));

io.on("connection", function (client) {

	client.on("join", function (data) {

		console.log("joiny");
		console.log(io.sockets.adapter.rooms);
		var game = games[data.room];
		if (game) {

		} else {

		}

	});

	client.join("lobby");

	io.sockets.in("lobby").emit("lobby/welcome");

});

http.listen(port, function () {

	console.log("listening on *:" + port);

});
