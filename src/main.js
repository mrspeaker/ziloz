"use strict";

var main = {

	w: 30 * 16,
	h: 24 * 16,

	level: null,

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
			"main":  PIXI.Texture.fromImage("res/images/tank.png")
		};

		var loader = new PIXI.AssetLoader([
			"res/images/tanktiles.json",
			"res/images/tiles-large.json"
		]);
		loader.onComplete = this.onAssetsLoaded.bind(this);
		loader.load();

	},

	onAssetsLoaded: function () {

		this.level = Object.create(Level).init(this.w, this.h, this.stage);

		this.run();

	},

	run: function (now, last) {

		var dt = now - (last || now);

		this.tick(dt);
		this.render();

		requestAnimFrame(function (next) { main.run(next, now); });

	},

	tick: function (dt) {

		this.input1.tick();
		this.input2.tick();

		this.level.tick(dt);

	},

	render: function () {

		this.level.render();
		this.renderer.render(this.stage);

	},

	listen: function (event, data) {

		switch (event) {

		case "addEntity":

			this.level.add(data.prefab, data.conf);

			break;

		case "explode":

			this.level.addExplosion(data);

			break;

		case "removeAndExplode":

			// TODO: this should be behaviour?
			this.level.removeAndExplode(data);

			break;

		case "tileHit":

			this.level.map.tileHit(data.block, data.e);

			break;

		case "die":

			this.level.die(data);

			break;

		default:

			console.error("what the heck is ", event, "?");

		}

	}

};
