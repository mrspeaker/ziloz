var main = {

	w: 500,
	h: 300,

	ents: null,
	bits: null,

	init: function () {

		this.ents = [];

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

		//var blurFilter1 = new PIXI.BlurFilter();

		document.addEventListener("keydown", (function (e) {

			this.keyDown(e);

		}).bind(this), false);

		this.run();

	},

	keyDown: function (e) {

		if (e.keyCode === 32) {

			this.addBullet(this.tank);

		}

	},

	addBullet: function (e) {

		var rot = e.sprite ? e.sprite.ref.rotation : 0;

		var b = this.makeSprite(
			this.texture,
			e.pos.x,
			e.pos.y);

		b.rotation = rot;

		var bb = createEntity("bullet", {
			pos: {
				x: b.position.x,
				y: b.position.y
			},
			sprite: {
				ref: b
			},
			shoot: {
				rot: rot - Math.PI / 2
			}
		});

		this.ents.push(bb);
		this.stage.addChild(b);

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

		var tank = this.makeSprite(
			this.texture,
			0, 0,
			Math.random() * 0xFFFFFF,
			2, 2);

		tank.blendMode = PIXI.blendModes.ADD;

		this.tank = createEntity("tank", {
			pos: {
				x: (Math.random() * (this.w - 100)) + 100,
				y: Math.random() * this.h
			},
			sprite: {
				ref: tank
			}
		});

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

		this.ents.push(this.tank);
		this.ents.push(this.tank2);

		this.stage.addChild(this.tank.sprite.ref);
		this.stage.addChild(this.tank2.sprite.ref);

		var bit = PIXI.Sprite.fromFrame("f" + 1 + "_" + 1);

		this.run();

	},

	run: function () {

		this.update();
		this.render();

		requestAnimFrame(function () { main.run() });

	},

	update: function () {

		//blurFilter1.blur = (Math.max(0, Math.sin(Date.now() / 400) - 0.5)) * 20 ;
		var stage = this.stage;

		this.ents = this.ents.filter(function (e) {

			sys.AI.update(e);
			sys.Physics.update(e, 1);
			sys.Render.update(e);
			sys.Life.update(e);

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