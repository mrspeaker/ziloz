var main = {

	w: 500,
	h: 300,

	ents: null,
	ents_to_add: null,
	bits: null,

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

		input.init();

		this.run();

	},

	addBullet: function (e) {

		var rot = e.rot ? e.rot.angle : 0;

		var b = this.makeSprite(
			this.texture,
			e.pos.x,
			e.pos.y);

		b.rotation += Math.PI;

		var bb = createEntity("bullet", {
			pos: {
				x: e.pos.x,
				y: e.pos.y
			},
			sprite: {
				ref: b
			},
			rot: {
				angle: rot - Math.PI / 2
			}
		});

		this.ents_to_add.push(bb);
		this.stage.addChild(b);

		return bb;

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
			}
		});

		this.tank.playerControl = {};

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
			}
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

		console.log("yp")
		this.bbbb = this.addBullet(this.tank);

		this.run();

	},

	run: function () {

		this.update();
		this.render();
		requestAnimFrame(function () { main.run() });

	},

	update: function () {

		var stage = this.stage;

		this.ents_to_add = this.ents_to_add.filter(function (e) {

			this.ents.push(e);

			return false;

		}, this);

		sys.Move.count =0;
		this.ents = this.ents.filter(function (e) {

			sys.Move.update(e);
			sys.Physics.update(e, 1);
			sys.Life.update(e);
			sys.Render.update(e);

			/*this.ents.forEach(function (e2) {

				if (e2 === e) return;

			});*/

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