var main = {

	w: 500,
	h: 300,

	ents: null,
	bits: null,

	init: function () {

		this.ents = [];
		this.bits = [];

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

		this.run();

	},

	onload: function () {

		for (var i = 0; i < 100; i++) {

			var tank = new PIXI.Sprite(this.texture);
			tank.anchor.x = 0.5;
			tank.anchor.y = 0.5;

			tank.position.x = (Math.random() * (this.w - 100)) + 100;
			tank.position.y = Math.random() * this.h;

			tank.scale.x = 2;
			tank.scale.y = 2;

			tank.tint = Math.random() * 0xFFFFFF;

			tank.blendMode = PIXI.blendModes.ADD;

			var tt = createEntity("tank", {
				pos: {
					x: tank.position.x,
					y: tank.position.y
				},
				sprite: {
					ref: tank
				},
				sinbounce: {
					freq: Math.random() * 200 + 200
				}
			});

			this.ents.push(tt);
			this.stage.addChild(tank);

		}

		for (var i = 0; i < 4; i++) {

			for (var j = 0; j < 4; j++) {

				var bit = PIXI.Sprite.fromFrame("f" + j + "_" + i);

				bit.scale.x = 4;
				bit.scale.y = 4;
				bit.position.x = (j * 16) + 20;
				bit.position.y = (i * 16) + 60;
				bit.anchor.x = 0.5;
				bit.anchor.y = 0.5;

				this.stage.addChild(bit);

				this.bits.push(bit);

			}
		}

		this.run();

	},

	run: function () {

		this.update();
		this.render();

		requestAnimFrame(function () { main.run() });

	},

	update: function () {

		this.bits.forEach(function (t, i) {

			t.position.y += Math.sin(Date.now() / 300 + i) * 0.9;

		});

		//blurFilter1.blur = (Math.max(0, Math.sin(Date.now() / 400) - 0.5)) * 20 ;

		for (var i = 0; i < this.ents.length; i++) {
			var e = this.ents[i];

			sys.AI.update(e);
			sys.Physics.update(e, 1);
			sys.Render.update(e);

		}

	},

	render: function () {

		this.renderer.render(this.stage);

	}

}