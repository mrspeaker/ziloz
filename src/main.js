"use strict";

var main = {

	w: 30 * 16,
	h: 24 * 16,

	ents: null,
	ents_to_add: null,

	textures: null,

	init: function () {

		this.ents = [];
		this.ents_to_add = [];

		this.initPixi();

		this.input1 = Object.create(Input).init(1);
		this.input2 = Object.create(Input).init(2);

		this.map = Object.create(Map).init();

	},

	initPixi: function () {

		PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

		this.stage = new PIXI.Stage(0x18060C);
		this.renderer = PIXI.autoDetectRenderer(this.w, this.h);

		document.body.appendChild(this.renderer.view);

		this.textures = {
			"main":  PIXI.Texture.fromImage("res/images/tank.png")
		};

		var loader = new PIXI.AssetLoader([
			"res/images/tanktiles.json"
		]);
		loader.onComplete = this.onAssetsLoaded.bind(this);
		loader.load();

	},

	onAssetsLoaded: function () {

		var map = this.map;

		// Draw the map
		for (var y = 0; y < this.map.h; y++) {

			for (var x = 0; x < this.map.w; x++) {

				var block = map.blocks[y][x];

				if (block.type === 0) {
					continue;
				}

				var tx = (block.type - 1) % 8 | 0,
					ty = (block.type - 1) / 8 | 0,
					tile = PIXI.Sprite.fromFrame("f" + tx + "_" + ty);

				tile.position.x = x * map.tileW;
				tile.position.y = y * map.tileH;
				this.stage.addChild(tile);
				this.map.blocks[y][x].sprite = tile;

				if (block.refill) {

					this.addRefill(block.refill, tile.position);

				}

			}

		}

		// Player 1
		var free = this.map.findFreeSpot();
		this.tank = this.add("tank", {
			pos: {
				x: free.x,
				y: free.y
			},
			sprite: {
				tint: 0x88ffff
			}
		});
		this.tank.input = this.input1;
		this.input1.power = 1.4; // TODO: fix obj ref in components with arrays

		this.guiTank1 = new PIXI.Graphics();
		this.stage.addChild(this.guiTank1);

		// Player 2
		free = this.map.findFreeSpot();
		this.tank2 = this.add("tank", {
			pos: {
				x: free.x,
				y: free.y
			},
			sprite: {
				tint: 0xffff55
			},
			refillGroup: {
				team: 2
			},
			autofire: {},
			spin:{}
		});
		this.tank2.input = this.input2;
		this.input2.power = 1.4; // TODO: fix obj ref in components with arrays

		this.guiTank2 = new PIXI.Graphics();
		this.stage.addChild(this.guiTank2);

		this.run();

	},

	add: function (type, conf) {

		var e = createPrefab(type, conf);
		this.ents_to_add.push(e);

		return e;

	},

	addBullet: function (e) {

		var rot = e.rot ? e.rot.angle - Math.PI / 2 : 0,
			x = e.pos.x + (Math.cos(rot) * 18),
			y = e.pos.y + (Math.sin(rot) * 18);

		return this.add("bullet", {
			pos: {
				x: x,
				y: y
			},
			sprite: {
				texture: "main",
				scale: 0.5,
				rot: Math.PI
			},
			rot: {
				angle: rot
			}
		});

	},

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

	addTarget: function () {

		return this.add("target", {
			pos: this.map.findFreeSpot(),
			sprite: {
				tint: Math.random() * 0xffffff,
				scale: 0.5
			},
			rot: {},
			spin: {}
		});

	},

	addRefill: function (refill, pos) {

		this.ents_to_add.push(createEntity({
			pos: {
				x: pos.x + 16,
				y: pos.y + 16
			},
			sprite: {
				scale: 0.5
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


	makeSprite: function (texture, x, y, col, sx, sy) {

		var sprite = new PIXI.Sprite(texture);

		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;

		sprite.position.x = x;
		sprite.position.y = y;

		sprite.scale.x = sx || 1;
		sprite.scale.y = sy || 1;

		if (col) {
			sprite.tint = col;
		}

		return sprite;

	},

	run: function (now, last) {

		var dt = now - (last || now);

		this.update(dt);
		this.render();

		requestAnimFrame(function (next) { main.run(next, now); });

	},

	update: function (dt) {

		var ents = this.ents,
			self = this;

		this.input1.tick();
		this.input2.tick(true);

		this.ents_to_add = this.ents_to_add.filter(function (e) {

			if (e.sprite) {
				sys.Render.init(e);
			}

			this.ents.push(e);

			return false;

		}, this);

		this.ents = this.ents.filter(function (e) {

			sys.LifeCycle.update(e);
			sys.Move.update(e);
			sys.Physics.update(e, self.map, 1);
			sys.Map.update(e, self.map);
			sys.Collision.update(e, ents);
			sys.Render.update(e);

			if (e.remove) {

				if (e.sprite) {

					sys.Render.remove(e);

				}

			}

			return !(e.remove);

		});

		if (Math.random () < 0.001) {

			this.addTarget();

		}

	},

	outOfFuel: function (e) {

		e.remove = true;
		this.addExplosion(e);

	},

	render: function () {

		this.renderHealthBars();
		this.renderer.render(this.stage);

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
		aGui.drawRect(15, 35, 120 * (aTank.fuel.amount / 100), 5);

		bGui.drawRect(this.w - 138, this.h - 40, 120 * (bTank.health.amount / 100), 5);
		bGui.drawRect(this.w - 138, this.h - 30, 120 * (bTank.ammo.amount / 10), 5);
		bGui.drawRect(this.w - 138, this.h - 20, 120 * (bTank.fuel.amount / 100), 5);

	}

};
