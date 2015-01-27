"use strict";

window.GameScreen = {

	init: function (w, h, stage) {

		this.stage = new PIXI.DisplayObjectContainer();
		stage.addChild(this.stage);

		this.level = Object.create(Level).init(w, h, this.stage);

		return this;

	},

	tick: function (dt) {

		this.level.tick(dt);

	},

	render: function () {

		this.level.render();

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
				console.log("game over A");
			}
			if (data.block.type === 11) {
				console.log("game over B");
			}

			break;

		case "die":

			this.level.die(data);

			break;

		case "net/game/ping":

			var np = this.level.networkPlayer;

			np.pos = data.pos;
			np.rot.angle = data.rot;

			if (data.health) { np.health.amount = data.health; }
			if (data.ammo) { np.ammo.amount = data.ammo; }
			if (data.fuel) { np.fuel.amount = data.fuel; }

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

			console.error("what the heck is ", event, "?");

		}

	}

};
