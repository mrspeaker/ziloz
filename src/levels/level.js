"use strict";

window.Level = {

	w: 0,
	h: 0,

	ents: null,
	ents_to_add: null,

	entMoving: false,
	entMoved: false,

	map: null,

	tank1: null,
	tank2: null,

	player: null,
	networkPlayer: null,

	init: function (w, h, stage) {

		this.w = w;
		this.h = h;

		this.ents = [];
		this.ents_to_add = [];

		sys.Render.initSys(stage);

		this.map = Object.create(Map).init();
		this.createLevel();

		return this;

	},

	createLevel: function () {

		/*
		var spawn = this.spawn.bind(this),
			targetSpawner = core.addComponent({}, "behaviour");

		// Testing behaviour system
		targetSpawner.behaviour.stack.push({
			type: "timer",
			time: 8000,
			repeat: true,
			done: "addBehaviour",
			params: {
				name: "spawn",
				args: [
					"target",
					{
						pos: {},
						sprite: {
							scale: 0.5
						},
						rot: {},
						spin: {}
					},
					function (conf) {

						conf.sprite.tint = Math.random() * 0xffffff;
						spawn(conf);

					}
				]
			}
		});
		this.ents_to_add.push(targetSpawner);
		*/

		this.map.render(sys.Render.stage, this);

		// Player 1

		var tank1 = this.tank1 = this.add("tank", {
			sprite: {
				tint: 0x88ff88
			}
		});
		// tank.input = main.input1; // grr
		// tank.input.power = 1.4; // TODO: fix obj ref in components
		this.spawn(tank1);


		this.t1Lives = [
			sys.Render.makeSprite(main.textures.icon, 30, 185, 0x88ff88),
			sys.Render.makeSprite(main.textures.icon, 50, 195, 0x88ff88)
		]
		sys.Render.addSprite(this.t1Lives[0]);
		sys.Render.addSprite(this.t1Lives[1]);

		function addTiling (texture, x, y, w, h, scale) {
			var s = new PIXI.TilingSprite(main.textures[texture], w, h);
			s.scale.x = scale;
			s.scale.y = scale;
			s.position.x = x;
			s.position.y = y;
			sys.Render.addSprite(s);
			return s;
		}

		// Player 2
		var tank2 = this.tank2 = this.add("tank", {
			sprite: {
				tint: 0xffff88
			},
			refillGroup: {
				team: 2
			}//,
			//autofire: {},
			//spin:{}
		});
		//tank2.input = Object.create(AIInput).init();//main.input2;
		//tank2.input.power = 1.4; // TODO: fix obj ref in components
		this.spawn(tank2);

		this.t2Lives = [
			sys.Render.makeSprite(main.textures.icon, 430, 185, 0xffff88),
			sys.Render.makeSprite(main.textures.icon, 450, 195, 0xffff88)
		]
		sys.Render.addSprite(this.t2Lives[0]);
		sys.Render.addSprite(this.t2Lives[1]);

		tank1.sprite.turret = true;
		tank2.sprite.turret = true;

		// Tank GUIs

		var guiBG = new PIXI.Graphics();
		guiBG.alpha = 0.5;
		guiBG.beginFill(0x000000);
		guiBG.drawRect(8, 8, 128, 32);
		guiBG.drawRect(this.w - 136, this.h - 40, 128, 32);
		guiBG.endFill();
		sys.Render.addSprite(guiBG);

		this.h1 = addTiling("icon-health", 74, 11, 120, 22, 0.5);
		this.a1 = addTiling("icon-ammo", 74, 26, 120, 22, 0.5);
		this.h2 = addTiling("icon-health", this.w - 70, this.h - 37, 120, 22, 0.5);
		this.a2 = addTiling("icon-ammo", this.w - 70, this.h - 23, 120, 22, 0.5);


		this.guiTank2 = new PIXI.Graphics();
		this.guiTank2.alpha = 0.5;
		sys.Render.addSprite(this.guiTank2);

		this.guiTank1 = new PIXI.Graphics();
		this.guiTank1.alpha = 0.5;
		sys.Render.addSprite(this.guiTank1);




	},

	spawn: function (e) {

		var spot = {};

		if (e === this.tank1 || e === this.tank2) {

			if (e === this.tank1) {

				spot.x = 2 * 16;
				spot.y = 8 * 16;
				e.rot.angle = Math.PI / 2;

			} else {

				spot.x = this.w - 32;
				spot.y = this.h - (16 * 8);
				e.rot.angle = -Math.PI / 2;

			}

		} else {

			spot = this.map.findFreeSpot();

		}

		e.pos.x = spot.x;
		e.pos.y = spot.y;

		if (e.fuel) {

			e.fuel.amount = e.fuel.max;

		}

		if (e.ammo) {

			e.ammo.amount = e.ammo.max;

		}


		if (e.health) {

			e.health.amount = e.health.max;
			e.dead = false;

		}

		if (e.noLoitering) {
			e.noLoitering.lastMovedAt = Date.now();
		}

		e.remove = false;

	},

	removeAndExplode: function (e) {

		e.remove = true;
		this.addExplosion(e);

	},

	die: function (e) {

		var respawn = this.spawn.bind(this);

		if (e.lives) {

			this.addExplosion(e, 1);
			e.sprite.ref.alpha = 0;

			var s = (e === this.tank1 ? this.t1Lives : this.t2Lives).pop();
			if (s) {
				sys.Render.removeSprite(s);
			}

			if (--e.lives.number > 0) {

				e.behaviour.toAdd.push({
					type: "timer",
					time: 2000,
					done: "script",
					params: {
						func: function (e) {

							core.addComponent(e, "health");
							core.addComponent(e, "fuel");
							core.addComponent(e, "vel");
							e.sprite.ref.alpha = 1;
							respawn(e);

						},
						args: [
							e
						]
					}
				});

				//e.sprite.ref.alpha = 0;
				core.removeComponent(e, "health");
				core.removeComponent(e, "fuel");
				core.removeComponent(e, "vel");

			} else {

				main.screen.listen("gameover", { p: e === this.tank1 ? 2 : 1, base: false });

			}

		} else {

			this.removeAndExplode(e);

		}

	},

	add: function (type, conf) {

		var e = core.createPrefab(type, conf);
		this.ents_to_add.push(e);

		return e;

	},

	// TODO: should be behaviour
	addExplosion: function (e, type) {

		var num = [10, 20, 5][type || 0],
			tint = [0x663311, 0xff3311, 0x776666][type || 0],
			life = [10, 50, 0][type || 0];


		for (var i = 0; i < num; i++) {

			this.add("explosion", {
				pos: {
					x: e.pos.x + (Math.random() * 20 - 10),
					y: e.pos.y + (Math.random() * 20 - 10)
				},
				sprite: {
					texture: "expl",
					scale: 0.7,
					tint: tint,
					blend: "ADD"
				},
				life: {
					count: (Math.random() * 10) + life | 0
				}

			});

		}

	},

	addRefill: function (refill, pos) {

		var idx = this.ents_to_add.push(core.createEntity({
			pos: {
				x: pos.x + 24,
				y: pos.y + 24
			},
			size: {
				w: 8,
				h: 8
			},
			refill: {
				ammo: refill.type === 1 ? components.ammo.max : 0,
				fuel: refill.type === 2 ? components.fuel.max : 0,
				health: refill.type === 3 ? components.health.max : 0,
				group: refill.group
			},
			collision: {
				group: "pickup"
			}
		}));

		return this.ents_to_add[idx - 1];

	},


	tick: function (dt) {

		var ents = this.ents,
			self = this;

		this.entMoved = false;

		this.ents_to_add = this.ents_to_add.filter(function (e) {

			// Any system init calls
			sys.Render.init(e);

			this.ents.push(e);

			return false;

		}, this);

		this.ents = this.ents.filter(function (e) {

			// Any system update calls
			sys.Behaviour.update(e);
			sys.Move.update(e);
			sys.Physics.update(e, self.map, 1);
			sys.Map.update(e, self.map);
			sys.Collision.update(e, ents);
			sys.Render.update(e);

			if (e.remove) {

				if (e.sprite) {

					// Any system remove calls
					sys.Render.remove(e);

				}

			}

			return !(e.remove);

		});

		if (this.player) {

			var playerModel = {
				pos: this.player.pos,
				rot: this.player.rot.angle
			}

			if (this.player.health) { playerModel.health = this.player.health.amount; }
			if (this.player.ammo) { playerModel.ammo = this.player.ammo.amount; }
			if (this.player.fuel) { playerModel.fuel = this.player.fuel.amount; }

			Network.tick(playerModel);
		};


		// Play rumble when moving.
		if (this.entMoved && !this.entMoving) {
			main.sounds.move.play();
			this.entMoving = true;
		} else if (!this.entMoved && this.entMoving) {
			this.entMoving = false;
			main.sounds.move.stop();
		}

	},

	render: function () {

		this.renderHealthBars();

	},

	renderHealthBars: function () {

		// Health bars
		var aGui = this.guiTank1,
			aTank = this.tank1,
			bGui = this.guiTank2,
			bTank = this.tank2;

		aGui.clear();
		bGui.clear();

		aGui.beginFill(aTank.sprite.ref.tint);
		bGui.beginFill(bTank.sprite.ref.tint);

		if (aTank.health) {
			this.h1.width = 120 * (aTank.health.amount / aTank.health.max);
		}
		if (aTank.ammo) {
			this.a1.width = 120 * (aTank.ammo.amount / aTank.ammo.max);
		}

		if (aTank.fuel) aGui.drawRect(12, 12, 56 * (aTank.fuel.amount / aTank.fuel.max), 25);

		if (bTank.health) {
			this.h2.width = 120 * (bTank.health.amount / bTank.health.max);
		}
		if (bTank.ammo) {
			this.a2.width = 120 * (bTank.ammo.amount / bTank.ammo.max);
		}
		if (bTank.fuel) bGui.drawRect(this.w - 132, this.h - 36, 56 * (bTank.fuel.amount / bTank.fuel.max), 25);

		/*if (aTank.lives) {
			for(var i = 0; i < aTank.lives.number - 1; i++) {
				aGui.drawRect((18 * i) + 20, 185, 16, 16);
			}
		}

		if (bTank.lives) {
			for(var i = 0; i < bTank.lives.number - 1; i++) {
				bGui.drawRect((18 * i) + (this.w - 60), 185, 16, 16);
			}
		}*/

	}

};
