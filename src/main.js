var main = {

	w: 28 * 16,
	h: 22 * 16,

	ents: null,
	ents_to_add: null,

	init: function () {

		this.ents = [];
		this.ents_to_add = [];

		PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

		this.stage = new PIXI.Stage(0x18060C),
		this.renderer = PIXI.autoDetectRenderer(this.w, this.h);

		document.body.appendChild(this.renderer.view);

		var texture = PIXI.Texture.fromImage("res/images/tank.png"),
			assetsToLoader = ["res/images/tanktiles.json"],
			loader = new PIXI.AssetLoader(assetsToLoader);

		this.texture = texture;

		loader.onComplete = this.onload.bind(this);
		loader.load();

		this.input1 = Object.create(Input).init(1);
		this.input2 = Object.create(Input).init(2);

		this.map = this.makeMap();

		this.run();

	},

	makeMap: function () {

		return {
			w: 28,
			h: 22,
			tileW: 16,
			tileH: 16,
			blocks: [
				[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0],
				[0,0,0,0,0,0,0,0,0,0,2,3,3,2,0,0,0,0,0,0,0,0,0,0,3,3,0,0],
				[0,0,1,3,3,3,3,1,0,0,2,3,3,2,0,0,0,0,0,0,0,0,0,0,3,3,0,0],
				[0,0,1,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0],
				[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,1,1,1,1],
				[0,0,0,1,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,1,0,0,0],
				[0,0,0,1,0,0,0,0,4,4,0,0,1,4,4,1,0,0,3,3,0,0,0,0,1,0,0,0],
				[0,0,0,1,0,0,0,0,4,4,0,0,1,4,4,1,0,0,3,3,0,0,0,0,1,0,0,0],
				[0,0,0,1,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,1,0,0,0],
				[1,1,1,1,0,0,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
				[0,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,4,4,4,4,1,0,0],
				[0,0,4,4,0,0,0,0,0,0,0,0,0,0,2,4,4,2,0,0,1,4,4,4,4,1,0,0],
				[0,0,4,4,0,0,0,0,0,0,0,0,0,0,2,4,4,2,0,0,0,0,0,0,0,0,0,0],
				[0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0]
			],
			getBlockAt: function (x, y) {

				var yb = y / this.tileH | 0,
					xb = x / this.tileW | 0;

				if (yb < 1 || xb < 1) return {walkable: false}
				if (xb > this.w - 2) return {walkable: false}
				if (yb > this.h - 2) return {walkable: false}

				return { walkable: [0, 3, 4].indexOf(this.blocks[yb][xb]) > -1};
			}
		}


	},

	addBullet: function (e) {

		var rot = e.rot ? e.rot.angle - Math.PI / 2 : 0,
			x = e.pos.x + (Math.cos(rot) * 18),
			y = e.pos.y + (Math.sin(rot) * 18);

		var b = this.makeSprite(this.texture, x, y);
		b.rotation += Math.PI;

		this.stage.addChild(b);

		var bb = createEntity("bullet", {
			pos: {
				x: x,
				y: y
			},
			sprite: {
				ref: b
			},
			rot: {
				angle: rot
			}
		});

		this.ents_to_add.push(bb);

		return bb;

	},

	addExplosion: function (e) {


		for (var i = 0; i < 10; i++) {
			var x = e.pos.x + (Math.random() * 20 - 10),
				y = e.pos.y + (Math.random() * 20 - 10),
				b = this.makeSprite(this.texture, x, y, 0xff0000);

			b.blendMode = PIXI.blendModes.ADD;

			this.stage.addChild(b);

			var bb = createEntity("explosion", {
				pos: {
					x: x,
					y: y
				},
				sprite: {
					ref: b
				}
			});

			this.ents_to_add.push(bb);
		}

	},

	addTarget: function () {

		var pos = this.findFreeSpot(this.map),
			s = this.makeSprite(this.texture, pos.x, pos.y, 0xffff00);

		this.stage.addChild(s);

		var bb = createEntity("target", {
			pos: pos,
			sprite: {
				ref: s
			}
		});

		this.ents_to_add.push(bb);

	},

	makeSprite: function (texture, x, y, col, sx, sy) {

		var sprite = new PIXI.Sprite(texture);
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;

		sprite.position.x = x;
		sprite.position.y = y;

		sprite.scale.x = sx || 1;
		sprite.scale.y = sx || 1;

		if (col) {
			sprite.tint = col;
		}

		return sprite;

	},

	findFreeSpot: function (map) {

		var ok = false,
			x,
			y;

		while (!ok) {
			x = map.tileW * (Math.random () * map.w | 0);
			y = map.tileH * (Math.random () * map.h | 0);

			if (map.getBlockAt(x, y).walkable) {
				ok = true;
			}

		}

		return {x: x, y: y}
	},

	onload: function () {

		var map = this.map;
		for (var bb = 0; bb < this.map.h; bb++) {

			for (var aa = 0; aa < this.map.w; aa++) {

				var block = map.blocks[bb][aa];
				if (block === 0) continue;
				var bit = PIXI.Sprite.fromFrame("f" + (block - 1) + "_" + 0);
				bit.position.x = aa * map.tileW;
				bit.position.y = bb * map.tileH;
				this.stage.addChild(bit);

			}

		}


		var free = this.findFreeSpot(map);

		this.tank = createEntity("tank", {
			pos: {
				x: free.x,
				y: free.y
			},
			sprite: {
				ref: this.makeSprite(this.texture, 0, 0, Math.random() * 0xFFFFFF, 1.7, 1.7)
			},
			input: this.input1
		});
		this.t1Health = new PIXI.Graphics();
		this.stage.addChild(this.t1Health);


		var free = this.findFreeSpot(map);

		this.tank.playerControl = {};
		delete this.tank.spin;

		this.tank2 = createEntity("tank", {
			pos: {
				x: free.x,
				y: free.y
			},
			sprite: {
				ref: this.makeSprite(
					this.texture,
					0, 0,
					Math.random() * 0xFFFFFF,
					1.7, 1.7
				)
			},
			input: this.input2,
			autofire: {}
		});
		this.t2Health = new PIXI.Graphics();
		this.stage.addChild(this.t2Health);

		this.ents_to_add.push(this.tank);
		this.ents_to_add.push(this.tank2);

		this.stage.addChild(this.tank.sprite.ref);
		this.stage.addChild(this.tank2.sprite.ref);

		this.run();

	},

	run: function (now, last) {

		var dt = now - (last || now);

		this.update(dt);
		this.render();

		requestAnimFrame(function (next) { main.run(next, now) });

	},

	update: function (dt) {

		var ents = this.ents,
			stage = this.stage,
			self = this;

		this.ents_to_add = this.ents_to_add.filter(function (e) {

			this.ents.push(e);

			return false;

		}, this);

		this.ents = this.ents.filter(function (e) {

			sys.Life.update(e);
			sys.Move.update(e);
			sys.Physics.update(e, self.map, 1);
			sys.Collision.update(e, ents);
			sys.Render.update(e);

			if (e.remove) {

				stage.removeChild(e.sprite.ref);

			}

			return !(e.remove);

		});

		if (Math.random () < 0.001) {
			this.addTarget();
		}

	},

	render: function () {

		this.renderer.render(this.stage);

		if (this.t1Health) {

			this.t1Health.clear();
			this.t2Health.clear();
			this.t1Health.beginFill(this.tank.sprite.ref.tint);
			this.t2Health.beginFill(this.tank2.sprite.ref.tint);
			this.t1Health.drawRect(5, 5, 100 * (this.tank.health.amount / 100), 5);
			this.t2Health.drawRect(this.w - 105, this.h - 8, 100 * (this.tank2.health.amount / 100), 5);
			this.t1Health.endFill();

		}


	}

}