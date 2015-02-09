"use strict";

window.TitleScreen = {

	count: 150,
	textCount: 30,

	state: "WAITING",

	init: function (w, h, stage) {

		this.stage = new PIXI.DisplayObjectContainer();
		this.stage.scale.x = main.scale;
		this.stage.scale.y = main.scale;

		this.stage.addChild(
			new PIXI.TilingSprite(main.textures["bg"], w, h)
		);

		this.w = w;
		this.h = h;

		for (var j = 0; j < 6; j++) {
			for (var i = 0; i < 30; i++) {
				var tile = PIXI.Sprite.fromFrame("f" +(j >0 ? 4: 0) + "_" + 0);
				tile.position.x = i * 16;
				tile.position.y = 40 + (j * 16);
				this.stage.addChild(tile);
			}
		}
		for (j = 0; j < 3; j++) {
			for (i = 0; i < 2; i++) {
				var tile = PIXI.Sprite.fromFrame("f" + 0 + "_" + 0);
				tile.position.x = (i === 0 ? 0 : 29) * 16;
				tile.position.y = (j * 16) - 8;
				this.stage.addChild(tile);
			}
		}

		stage.addChild(this.stage);

		Network.send_join_request();

		return this;

	},

	addTexts: function () {

		var w = this.w,
			h = this.h;

		var text1 = new PIXI.Text("Z l  k", {
			font:"70px 'Black Ops One', monospace",
			fill:"#fff",
			stroke: "#222",
			strokeThickness: 5
		});
		var text2 = new PIXI.Text("  i o ", {
			font:"70px 'Black Ops One', monospace",
			fill:"#fff",
			stroke: "#222",
			strokeThickness: 5
		});

		text1.position.x = 160;
		text2.position.x = 166;
		this.text1 = text1;
		this.text2 = text2;

		var waiting = this.waiting = new PIXI.Text("Waiting for player 2...", {
			font:"15pt 'Black Ops One', monospace",
			stroke: "#333",
			strokeThickness: 1,
			fill:"#233F50"
		});
		waiting.position.x = w / 2 - (waiting.width / 2);
		waiting.position.y = h - 60;

		[
			"by Mr Speaker.",
			"Take out fuel and ammo supplies.",
			"Destroy opponent's base for K/O."
		].map (function (m, i) {
			var t = new PIXI.Text(m, {
				font:"15px 'Black Ops One', monospace",
				fill:"#fff",
				stroke: "#222",
				strokeThickness: 5
			});

			t.x = w / 2 - (t.width / 2);
			t.y = 190 + (i * 30);
			this.stage.addChild(t);

		}, this);

		this.stage.addChild(text1);
		this.stage.addChild(text2);
		this.stage.addChild(waiting);


	},

	tick: function (dt) {

		// Wait a bit, hopefully chrome's loaded the webfont!
		if (this.textCount > 0) {
			if (--this.textCount <= 0){
				this.addTexts();
			}
			return;
		}

		if (this.state === "READY") {
			if (this.count === 100) {
				// REMOVE tings...
				this.stage.removeChild(this.waiting);
			}
			if (this.count-- <= 0) {
				this.listen("gameOn", this.data);
			}
		}

		this.waiting.alpha = (Date.now() / 1000) % 3 < 2 ? 1 : 0;
		this.text1.position.y = 55 + (Math.cos(Date.now() / 400) * 3)
		this.text2.position.y = 59 + (Math.sin(Date.now() / 300) * 3)

	},

	render: function () {

	},

	listen: function (e, data) {

		switch (e) {
		case "net/game/start":
			this.state = "READY";
			this.data = data;
			break;
		case "gameOn":
			main.setScreen(GameScreen);
			var level = main.screen.level;
			level.player = data.p1 === Network.socket.id ? level.tank1 : level.tank2;
			level.networkPlayer = level.player === level.tank1 ? level.tank2 : level.tank1;

			level.player.input = main.input1; // grr
			level.player.input.power = 1.7; // TODO: fix obj ref in components
			break;
		}

	}

};
