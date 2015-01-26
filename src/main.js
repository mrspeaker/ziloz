"use strict";

var main = {

	w: 30 * 16,
	h: 24 * 16,

	screen: null,

	textures: null,

	init: function () {

		this.initPixi();

		this.input1 = Object.create(Input).init(1);
		this.input2 = Object.create(Input).init(2);

		Network.init();
	},

	initPixi: function () {

		PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

		this.stage = new PIXI.Stage(0x18060C);
		this.renderer = PIXI.autoDetectRenderer(this.w, this.h);

		document.body.appendChild(this.renderer.view);

		this.textures = {
			"main":  PIXI.Texture.fromImage("res/images/tank.png"),
			"base": PIXI.Texture.fromImage("res/images/tank-base.png"),
			"top": PIXI.Texture.fromImage("res/images/tank-top.png")
		};

		var loader = new PIXI.AssetLoader([
			"res/images/tanktiles.json",
			"res/images/tiles-large.json"
		]);
		loader.onComplete = this.onAssetsLoaded.bind(this);
		loader.load();

	},

	onAssetsLoaded: function () {

		this.setScreen(TitleScreen);

		this.run();

	},

	run: function (now, last) {

		var dt = now - (last || now);

		this.tick(dt);
		this.render();

		requestAnimFrame(function (next) { main.run(next, now); });

	},

	setScreen: function (scr) {

		if (this.screen) {
			this.stage.removeChild(this.screen.stage);
		}
		this.screen = Object.create(scr).init(this.w, this.h, this.stage);
		this.screen.tick(16); // Lol.

	},

	tick: function (dt) {

		this.input1.tick();
		this.input2.tick();

		this.screen.tick(dt);

	},

	render: function () {

		this.screen.render();
		this.renderer.render(this.stage);

	},

	listen: function (event, data) {

		this.screen.listen(event, data);

	}

};
