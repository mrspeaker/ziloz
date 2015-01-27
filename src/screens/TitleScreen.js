"use strict";

window.TitleScreen = {

	count: 100,

	init: function (w, h, stage) {

		this.view = new PIXI.DisplayObjectContainer();

		var text = new PIXI.Text("Zilok", { font:"50px Arial", fill:"#030" });
		this.view.addChild(text);

		this.w = w;
		this.h = h;
		this.stage = stage;

		this.stage.addChild(this.view);

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
