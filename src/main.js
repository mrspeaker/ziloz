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

		this.map = this.makeMap();

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
		loader.onComplete = this.onAssetLoad.bind(this);
		loader.load();

	},

	onAssetLoad: function () {

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

			}

		}

		// Player 1
		var free = this.findFreeSpot(map);
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
		free = this.findFreeSpot(map);
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

	makeMap: function () {

		// TODO: move to new module

		return {
			w: 30,
			h: 24,
			tileW: 16,
			tileH: 16,
			blocks: [
				[5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
				[5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
				[5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
				[5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,5],
				[5,0,0,0,0,0,0,0,0,0,0,2,3,3,2,0,0,0,0,0,0,0,0,0,0,3,3,0,0,5],
				[5,0,0,1,3,3,3,3,1,0,0,2,3,3,2,0,0,0,0,0,0,0,0,0,0,3,3,0,0,5],
				[5,0,0,1,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,5],
				[5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,5],
				[5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,5],
				[5,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,1,1,1,1,5],
				[5,5,5,5,1,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,1,5,5,5,5],
				[5,5,5,5,1,0,0,0,0,4,4,0,0,1,4,4,1,0,0,3,3,0,0,0,0,1,5,5,5,5],
				[5,5,5,5,1,0,0,0,0,4,4,0,0,1,4,4,1,0,0,3,3,0,0,0,0,1,5,5,5,5],
				[5,5,5,5,1,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,1,5,5,5,5],
				[5,1,1,1,1,0,0,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,5],
				[5,0,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
				[5,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
				[5,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,4,4,4,4,1,0,0,5],
				[5,0,0,4,4,0,0,0,0,0,0,0,0,0,0,2,4,4,2,0,0,1,4,4,4,4,1,0,0,5],
				[5,0,0,4,4,0,0,0,0,0,0,0,0,0,0,2,4,4,2,0,0,0,0,0,0,0,0,0,0,5],
				[5,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
				[5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,5],
				[5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,5],
				[5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]
			].map(function (row) {

				return row.map(function (col) {

					return {
						type: col,
						health: 10,
						walkable: [0, 3, 4].indexOf(col) > -1,
						destructible: [1].indexOf(col) > -1,
						sprite: null
					};

				});

			}),

			getBlockAt: function (x, y) {

				var yb = y / this.tileH | 0,
					xb = x / this.tileW | 0,
					nullBlock = {walkable: false};

				if (yb < 0 || xb < 0) return nullBlock;
				if (xb > this.w - 1) return nullBlock;
				if (yb > this.h - 1) return nullBlock;

				return this.blocks[yb][xb];
			}

		};


	},

	add: function (type, conf) {

		var e = createEntity(type, conf);
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
			pos: this.findFreeSpot(this.map),
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

	findFreeSpot: function (map) {

		var ok = false,
			x,
			y,
			tw = map.tileW,
			th = map.tileH;

		while (!ok) {

			x = (Math.random () * map.w | 0);
			y = (Math.random () * map.h | 0);

			if (
				map.getBlockAt(x * tw, y * th).walkable &&
				map.getBlockAt((x - 1) * tw, y * th).walkable &&
				map.getBlockAt(x * tw, (y - 1) * th).walkable &&
				map.getBlockAt((x - 1) * tw, (y - 1) * th).walkable) {
					ok = true;
			}

		}

		return { x: x * tw, y: y * th };

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
		this.t1Health.drawRect(5, 5, 100 * (this.tank.health.amount / 100), 5);
		this.t2Health.drawRect(this.w - 105, this.h - 8, 100 * (this.tank2.health.amount / 100), 5);
		this.t1Health.endFill();

	}

};
