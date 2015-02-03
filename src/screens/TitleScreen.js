"use strict";

window.TitleScreen = {

	count: 100,

	init: function (w, h, stage) {

		this.stage = new PIXI.DisplayObjectContainer();
		this.stage.scale.x = main.scale;
		this.stage.scale.y = main.scale;

		this.stage.addChild(
			new PIXI.TilingSprite(main.textures["bg"], w, h)
		);

		var text = new PIXI.Text("Zilok", {
			font:"70px 'Black Ops One', monospace",
			fill:"#fff",
			stroke: "#222",
			strokeThickness: 5
		});

		text.position.x = 140;
		text.position.y = 40;

		var waiting = this.waiting = new PIXI.Text("Waiting for player 2...", {
			font:"20px helvetica, arial, sans-serif", fill:"#777"
		});
		waiting.position.x = w / 2 - 100;
		waiting.position.y = h / 2;
		this.stage.addChild(text);
		this.stage.addChild(waiting);

		this.w = w;
		this.h = h;
		//this.stage = stage;

		stage.addChild(this.stage);

		Network.send_join_request();

		return this;

	},

	tick: function (dt) {

		this.waiting.alpha = (Date.now() / 600) % 2 > 1 ? 1 : 0;

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
