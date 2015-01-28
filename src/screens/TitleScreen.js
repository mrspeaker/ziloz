"use strict";

window.TitleScreen = {

	count: 100,

	init: function (w, h, stage) {

		this.stage = new PIXI.DisplayObjectContainer();

		var text = new PIXI.Text("Zilok", { font:"50px Arial", fill:"#030" });
		var text2 = new PIXI.Text("waiting for player 2...", { font:"20px Arial", fill:"#070" });
		text2.position.x = w / 2 - 100;
		text2.position.y = h / 2;
		this.stage.addChild(text);
		this.stage.addChild(text2);

		this.w = w;
		this.h = h;
		//this.stage = stage;

		stage.addChild(this.stage);

		Network.send_join_request();

		return this;

	},

	tick: function (dt) {

	},

	render: function () {

	},

	listen: function (e, data) {

		switch (e) {
		case "net/game/start":
			main.setScreen(GameScreen);
			var level = main.screen.level;
			level.player = data.p1 === Network.socket.id ? level.tank1 : level.tank2;
			level.networkPlayer = level.player === level.tank1 ? level.tank2 : level.tank1;

			level.player.input = main.input1; // grr
			level.player.input.power = 1.4; // TODO: fix obj ref in components
			break;
		}

	}

};
