"use strict";

window.Level = {

	w: 0,
	h: 0,

	ents: null,
	ents_to_add: null,

	map: null,

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

		var spawn = this.spawn.bind(this),
			targetSpawner = core.addComponent({}, "behaviour");

		// Testing behaviour system
		/*targetSpawner.behaviour.stack.push({
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
		});*/
		//this.ents_to_add.push(targetSpawner);

		this.map.render(sys.Render.stage, this);

		// Player 1

		var tank = this.tank = this.add("tank", {
			sprite: {
				tint: 0x88ff88
			}
		});
		tank.input = main.input1; // grr
		tank.input.power = 1.4; // TODO: fix obj ref in components
		this.spawn(tank);

		// Player 2
		var tank2 = this.tank2 = this.add("tank", {
			sprite: {
				tint: 0xffff88
			},
			refillGroup: {
				team: 2
			},
			//autofire: {},
			spin:{}
		});
		tank2.input = main.input2;
		tank2.input.power = 1.4; // TODO: fix obj ref in components
		this.spawn(tank2);

		// Tank GUIs
		this.guiTank2 = new PIXI.Graphics();
		sys.Render.addSprite(this.guiTank2);

		this.guiTank1 = new PIXI.Graphics();
		sys.Render.addSprite(this.guiTank1);


	},

	spawn: function (e) {

		var free = this.map.findFreeSpot();

		e.pos.x = free.x;
		e.pos.y = free.y;

		if (e.fuel) {

			e.fuel.amount = e.fuel.max;

		}

		if (e.health) {

			e.health.amount = 100;

		}

		e.remove = false;

	},

	removeAndExplode: function (e) {

		e.remove = true;
		this.addExplosion(e);

	},

	die: function (e) {

		var respawn = this.spawn.bind(this);

		if (e.lives && e.lives.number-- > 0) {

			this.addExplosion(e);

			e.behaviour.toAdd.push({
				type: "timer",
				time: 2000,
				done: "script",
				params: {
					func: function (e) {

						core.addComponent(e, "fuel");
						core.addComponent(e, "vel");
						respawn(e);

					},
					args: [
						e
					]
				}
			});

			core.removeComponent(e, "fuel");
			core.removeComponent(e, "vel");


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
	addExplosion: function (e) {

		for (var i = 0; i < 10; i++) {

			this.add("explosion", {
				pos: {
					x: e.pos.x + (Math.random() * 20 - 10),
					y: e.pos.y + (Math.random() * 20 - 10)
				},
				sprite: {
					scale: 0.7,
					tint: 0xff7733,
					blend: "ADD"
				},
				life: {
					count: (Math.random() * 30) + 40 | 0
				}

			});

		}

	},

	addRefill: function (refill, pos) {

		this.ents_to_add.push(core.createEntity({
			pos: {
				x: pos.x + 16,
				y: pos.y + 16
			},

			size: {
				w: 10,
				h: 10
			},
			refill: {
				ammo: refill.type === 1 ? 10 : 0,
				fuel: refill.type === 2 ? 100 : 0,
				health: refill.type === 3 ? 100 : 0,
				group: refill.group
			},
			collision: {
				group: "pickup"
			}
		}));

	},


	tick: function (dt) {

		var ents = this.ents,
			self = this;

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

	},

	render: function () {

		this.renderHealthBars();

	},

	renderHealthBars: function () {

		// Health bars
		var aGui = this.guiTank1,
			aTank = this.tank,
			bGui = this.guiTank2,
			bTank = this.tank2;

		aGui.clear();
		bGui.clear();

		aGui.beginFill(aTank.sprite.ref.tint);
		bGui.beginFill(bTank.sprite.ref.tint);

		aGui.drawRect(15, 15, 120 * (aTank.health.amount / 100), 5);
		aGui.drawRect(15, 25, 120 * (aTank.ammo.amount / 10), 5);
		if (aTank.fuel) aGui.drawRect(15, 35, 120 * (aTank.fuel.amount / aTank.fuel.max), 5);

		bGui.drawRect(this.w - 138, this.h - 40, 120 * (bTank.health.amount / 100), 5);
		bGui.drawRect(this.w - 138, this.h - 30, 120 * (bTank.ammo.amount / 10), 5);
		if (bTank.fuel) bGui.drawRect(this.w - 138, this.h - 20, 120 * (bTank.fuel.amount / bTank.fuel.max), 5);

	}

};
