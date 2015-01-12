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

				var tile = PIXI.Sprite.fromFrame("f" + (block.type - 1) + "_" + 0);
				tile.position.x = x * map.tileW;
				tile.position.y = y * map.tileH;
				this.stage.addChild(tile);
				this.map.blocks[y][x].sprite = tile;

				if (block.refill) {
					this.ents_to_add.push(createEntity({
						pos: {
							x: tile.position.x + 16,
							y: tile.position.y + 16
						},
						sprite: {
							scale:0.5
						},
						size: {
							w: 10,
							h: 10
						},
						refill: {
							ammo: block.refill === 1 ? 10 : 0,
							fuel: block.refill === 2 ? 100 : 0,
							health: block.refill === 3 ? 100 : 0
						},
						collision: {
							group: "pickup"
						}
					}));
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
			},
			input: this.input1
		});
		this.t1Health = new PIXI.Graphics();
		this.stage.addChild(this.t1Health);

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
			input: this.input2,
			autofire: {},
			spin:{}
		});
		this.t2Health = new PIXI.Graphics();
		this.stage.addChild(this.t2Health);

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

		this.ents_to_add = this.ents_to_add.filter(function (e) {

			if (e.sprite) {
				sys.Render.init(e);
			}

			this.ents.push(e);

			return false;

		}, this);

		this.ents = this.ents.filter(function (e) {

			sys.Life.update(e);
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
		this.t1Health.clear();
		this.t2Health.clear();

		this.t1Health.beginFill(this.tank.sprite.ref.tint);
		this.t2Health.beginFill(this.tank2.sprite.ref.tint);

		this.t1Health.drawRect(15, 15, 120 * (this.tank.health.amount / 100), 5);
		this.t1Health.drawRect(15, 25, 120 * (this.tank.ammo.amount / 10), 5);
		this.t1Health.drawRect(15, 35, 120 * (this.tank.fuel.amount / 100), 5);

		this.t2Health.drawRect(this.w - 138, this.h - 40, 120 * (this.tank2.health.amount / 100), 5);
		this.t2Health.drawRect(this.w - 138, this.h - 30, 120 * (this.tank2.ammo.amount / 10), 5);
		this.t2Health.drawRect(this.w - 138, this.h - 20, 120 * (this.tank2.fuel.amount / 100), 5);

		//this.t1Health.endFill();


	}

};
