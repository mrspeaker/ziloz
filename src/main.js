var main = {

	w: 500,
	h: 300,

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
			assetsToLoader = ["res/images/tank.json"],
			loader = new PIXI.AssetLoader(assetsToLoader);

		this.texture = texture;

		loader.onComplete = this.onload.bind(this);
		loader.load();

		this.input1 = Object.create(Input).init(1);
		this.input2 = Object.create(Input).init(2);

		this.run();

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

		var x = e.pos.x,
			y = e.pos.y,
			b = this.makeSprite(this.texture, x, y, 0xff0000);
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

	onload: function () {

		this.tank = createEntity("tank", {
			pos: {
				x: (Math.random() * (this.w - 100)) + 100,
				y: Math.random() * this.h
			},
			sprite: {
				ref: this.makeSprite(this.texture, 0, 0, null, 2, 2)
			},
			input: this.input1
		});

		this.tank.playerControl = {};
		delete this.tank.spin;

		this.tank2 = createEntity("tank", {
			pos: {
				x: (Math.random() * (this.w - 100)) + 100,
				y: Math.random() * this.h
			},
			sprite: {
				ref: this.makeSprite(
					this.texture,
					0, 0,
					Math.random() * 0xFFFFFF,
					2, 2
				)
			},
			input: this.input2,
			autofire: {}
		});

		this.ents_to_add.push(this.tank);
		this.ents_to_add.push(this.tank2);

		this.stage.addChild(this.tank.sprite.ref);
		this.stage.addChild(this.tank2.sprite.ref);

		for (var bb = 0; bb < 9; bb++) {

			for (var aa = 0; aa < 15; aa++) {

				var f = bb === 0 || bb === 8 || aa === 0 || aa === 14 ? 0 : 1;
				if (f === 1) continue;
				var bit = PIXI.Sprite.fromFrame("f" + f + "_" + 0);
				bit.position.x = aa * 32;
				bit.position.y = bb * 32;
				this.stage.addChild(bit);

			}

		}

		this.addBullet(this.tank);

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

			sys.Move.update(e);
			sys.Physics.update(e, 1);
			sys.Life.update(e);
			sys.Render.update(e);

			ents.forEach(function (e2) {

				if (e2 === e || !e.collision || !e2.collision) return;
				if (e2.collision.group !== "default") {
					return;
				}

				var dead = false,
					dx = e2.pos.x - e.pos.x,
					dy = e2.pos.y - e.pos.y;

				if (Math.sqrt(dx * dx + dy * dy) < 15) {

					e2.remove = !e2.health ? true : (e2.health.amount -= 20) <= 0;
					e.remove = !e.health ? true : (e.health.amount -= 20) <= 0;

					self.addExplosion(e2);

				}

			});

			if (e.remove) {

				stage.removeChild(e.sprite.ref);

			}

			return !(e.remove);

		});

	},

	render: function () {

		this.renderer.render(this.stage);

	}

}