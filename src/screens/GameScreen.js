"use strict";

window.GameScreen = {

	dialog: null,
	shakeCount: 0,

	init: function (w, h, stage) {

		this.stage = new PIXI.DisplayObjectContainer();
		stage.addChild(this.stage);

		this.stage.scale.x = main.scale;
		this.stage.scale.y = main.scale;

		this.stage.addChild(
			new PIXI.TilingSprite(main.textures["bg"], w, h)
		);

		this.level = Object.create(Level).init(w, h, this.stage);

		this.dialog = Object.create(Dialog).init(this.stage, function (container) {
			var text = new PIXI.Text("REady...", {
				font: "40px 'Black Ops One', monospace",
				fill:"#fff",
				stroke: "#333",
				strokeThickness: 5
			});
			text.position.x = w / 2 - 50;
			text.position.y = h / 2 - 70;
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

		this.shake();

	},

	render: function () {

		if (this.dialog) {
			this.dialog.render();
		} else {
			this.level.render();
		}

	},

	shake: function () {

		if (this.shakeCount > 0) {

			this.stage.position.x = (Math.random() - 0.5) * 3 | 0;
			this.stage.position.y = (Math.random() - 0.5) * 3 | 0;

			if(--this.shakeCount === 0) {
				this.stage.position.x = 0;
				this.stage.position.y = 0;
			}
		}

	},

	listen: function (event, data) {

		switch (event) {

		case "addEntity":

			this.level.add(data.prefab, data.conf);

			break;

		case "explode":

			this.level.addExplosion(data);
			main.sounds.expl.play();

			break;

		case "shake":

			this.shakeCount = data || 20;

			break;

		case "removeAndExplode":

			// TODO: this should be behaviour?
			this.level.removeAndExplode(data);

			break;

		case "entityMoved":

			if (data === this.level.player) {
				this.level.entMoved = true;
			}
			break;

		case "explodeStation":

			// TODO: refactor with base explosion
			var exps = 10,
				addExplosion = this.level.addExplosion.bind(this.level);

			var splode = function () {
				setTimeout(function () {

					addExplosion({
						pos: {
							x: (Math.random() * 30) + (data.pos.x * 16),
							y: (Math.random() * 30) + (data.pos.y * 16)
						}
					}, Math.random() * 3 | 0);

					if (exps-- > 0) {
						splode();
					}

				}, 30);
			}.bind(this);
			splode();

			this.listen("shake", 35);
			main.sounds.expl.play();

			break;

		case "tileHit":

			this.level.map.tileHit(data.block, data.e);
			if (data.block.type === 10) {
				this.listen("gameover", { p: 2, base: true });
			}
			if (data.block.type === 11) {
				this.listen("gameover", { p: 1, base: true });
			}

			break;

		case "die":

			if (data.health) {
				if (data.health.dead) {
					//console.log("already dead.");
					break;
				}
				data.health.dead = true;
			}
			if (data.collision.group === "tank") {
				if (data === this.level.player) {
					Network.send_die();
				}
			} else {
				// console.log("don't care", data.collision.group);
				this.level.die(data);
			}


			break;

		case "gameover":

			if (this.gameover) { break; }
			this.gameover = true;

			var tank = data.p === 2 ? this.level.tank2 : this.level.tank1;

			core.addComponent(tank, "spin");
			core.removeComponent(this.level.tank1, "input");
			core.removeComponent(this.level.tank2, "input");

			if (data.base) {

				var exps = 80,
					addExplosion = this.level.addExplosion.bind(this.level);

				var splode = function () {
					setTimeout(function () {

						addExplosion({
							pos: {
								x: (Math.random() * 80) + (data.p === 1 ? 24 : 0) * 16,
								y: (Math.random() * 100) + (16 * 9)
							}
						}, Math.random() * 3 | 0);

						if (exps-- > 0) {
							splode();
						}

					}, 50);
				}.bind(this);
				splode();

				main.listen("shake", 100);

			}

			this.dialog = Object.create(Dialog).init(this.stage, function (container, w, h) {
				var text = new PIXI.Text("GAME OVER", {
					font:"70px 'Black Ops One', monospace",
					fill:"#fff",
					stroke: "#333",
					strokeThickness: 5
				});

				text.position.x = 25;
				//text.position.y = h / 2 - 60;
				container.addChild(text);
			}, true, 300);

			setTimeout(function () {
				main.setScreen(TitleScreen);
			}, 6000);

			break;

		case "addTrail":

			this.level.addExplosion(data, 2);

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
			main.sounds.shoot.play();

			break;

		case "net/game/die":
			var e = data === Network.socket.id ? this.level.player : this.level.networkPlayer;
			this.level.die(e);
			break;

		default:

			console.log("what the heck is ", event, "?");

		}

	}

};
