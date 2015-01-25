"use strict";

window.TitleScreen = {

	count: 100,

	init: function (w, h, stage) {

		this.view = new PIXI.DisplayObjectContainer();

		var text = new PIXI.Text("Zilok", {font:"50px Arial", fill:"#030"});
		this.view.addChild(text);

		this.w = w;
		this.h = h;
		this.stage = stage;

		this.stage.addChild(this.view);

		return this;

	},

	tick: function (dt) {

		if (this.count-- <= 0) {
			main.setScreen(GameScreen);
		}

	},

	render: function () {

	},

	listen: function (event, data) {

	}

};
