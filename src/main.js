"use strict";

var main = {

	w: 30 * 16,
	h: 24 * 16,

	scale: 1.5,

	screen: null,

	textures: null,
	sounds: null,

	init: function () {

		this.initPixi();

		this.input1 = Object.create(Input).init(1);
		this.input2 = Object.create(Input).init(2);

		this.sounds = {
			"expl": new Howl({
  				src: ['res/audio/expl.mp3', 'res/audio/expl.ogg'],
  				volume: 0.7
  			}),
  			"expl2": new Howl({
  				src: ['res/audio/expl2.mp3', 'res/audio/expl2.ogg'],
  				volume: 0.5
  			}),
  			"shoot": new Howl({
  				src: ['res/audio/shoot.mp3', 'res/audio/shoot.ogg'],
  				volume: 0.3
  			}),
  			"warn": new Howl({
  				src: ['res/audio/warn.mp3', 'res/audio/warn.ogg'],
  				volume: 0.7
  			}),
  			"pu1": new Howl({
  				src: ['res/audio/Powerup4.wav'],
  				volume: 0.7
  			}),
  			"pu2": new Howl({
  				src: ['res/audio/Powerup26.wav'],
  				volume: 0.7
  			}),
  			"pu3": new Howl({
  				src: ['res/audio/Powerup3.wav'],
  				volume: 0.7
  			}),
  			"move": new Howl({
  				src: ['res/audio/move.mp3'],
  				loop: true,
  				volume: 0.1
  			})
		}

		Network.init();
	},

	initPixi: function () {

		PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

		this.stage = new PIXI.Stage(0x18060C);

		/*var f = new PIXI.ColorMatrixFilter();
		this.stage.filters = [f];

		var colorMatrix =  [
			1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			0,0,0,1
		];

		f.matrix = colorMatrix;*/

		this.renderer = PIXI.autoDetectRenderer(this.w * this.scale, this.h * this.scale);

		document.body.appendChild(this.renderer.view);

		this.textures = {
			"main":  PIXI.Texture.fromImage("res/images/tank.png"),
			"base": PIXI.Texture.fromImage("res/images/tank-base.png"),
			"top": PIXI.Texture.fromImage("res/images/tank-top.png"),
			"expl": PIXI.Texture.fromImage("res/images/expl1.png"),
			"flash": PIXI.Texture.fromImage("res/images/flash.png"),
			"bg": PIXI.Texture.fromImage("res/images/bg.png"),
			"icon": PIXI.Texture.fromImage("res/images/tankicon.png"),
			"icon-health": PIXI.Texture.fromImage("res/images/icon-health.png"),
			"icon-ammo": PIXI.Texture.fromImage("res/images/icon-ammo.png"),
			"missile": PIXI.Texture.fromImage("res/images/missile.png")
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
		this.screen.tick(16); // Lol. If you don't tick, then render gets called on last screen.

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
