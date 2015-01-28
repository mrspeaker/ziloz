"use strict";

window.GameScreen = {

	dialog: null,

	init: function (w, h, stage) {

		this.stage = new PIXI.DisplayObjectContainer();
		stage.addChild(this.stage);

		this.level = Object.create(Level).init(w, h, this.stage);

		this.dialog = Object.create(Dialog).init(this.stage, function (container) {
			var text = new PIXI.Text("REady...", { font:"20px Arial", fill:"#090" });
			text.position.x = w / 2 - 30;
			text.position.y = h / 2 - 60;
			container.addChild(text);
		});

		return this;

	},

	tick: function (dt) {

		if (this.dialog) {
			this.dialog.tick(dt);
		}

		// Dialog can be removed during tick.
		if (!this.dialog || this.dialog.keepTickingMain) {
			this.level.tick(dt);
		}

	},

	render: function () {

		if (this.dialog) {
			this.dialog.render();
		} else {
			this.level.render();
		}

	},

	listen: function (event, data) {

		switch (event) {

		case "addEntity":

			this.level.add(data.prefab, data.conf);

			break;

		case "explode":

			this.level.addExplosion(data);

			break;

		case "removeAndExplode":

			// TODO: this should be behaviour?
			this.level.removeAndExplode(data);

			break;

		case "tileHit":

			this.level.map.tileHit(data.block, data.e);
			if (data.block.type === 10) {
				this.listen("gameover", 2);
			}
			if (data.block.type === 11) {
				this.listen("gameover", 1);
			}

			break;

		case "die":

			this.level.die(data);

			break;

		case "gameover":

			if (this.gameover) { break; }
			this.gameover = true;

			console.log("game over yo!");

			var tank = data === 2 ? this.level.tank2 : this.level.tank1;

			core.addComponent(tank, "spin");
			core.removeComponent(this.level.tank1, "input");
			core.removeComponent(this.level.tank2, "input");

			console.log("thing.")

			this.dialog = Object.create(Dialog).init(this.stage, function (container, w, h) {
				var text = new PIXI.Text("GAME OVER", { font:"20px Arial", fill:"#090" });
				text.position.x = w / 2 - 30;
				text.position.y = h / 2 - 60;
				container.addChild(text);
			}, true);

			setTimeout(function () {
				main.setScreen(TitleScreen);
			}, 6000);

			break;

		case "net/game/ping":

			var np = this.level.networkPlayer;

			np.pos = data.pos;
			np.rot.angle = data.rot;

			if (data.health && np.health) { np.health.amount = data.health; }
			if (data.ammo && np.ammo) { np.ammo.amount = data.ammo; }
			if (data.fuel && np.fuel) { np.fuel.amount = data.fuel; }

			break;

		case "net/game/fire":

			var np = this.level.networkPlayer;
			var mod = {
				pos: data.pos,
				sprite: {
					scale: 0.5
				},
				rot: {
					angle: data.rot
				}
			};

			this.listen("addEntity", { prefab: "bullet", conf: mod });

			break;

		default:

			console.log("what the heck is ", event, "?");

		}

	}

};
