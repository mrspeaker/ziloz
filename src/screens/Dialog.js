"use strict";

window.Dialog = {

	count: 0,
	keepTickingMain: false,
	init: function (stage, msgFunc, keepTickingMain, count) {
		this.view = new PIXI.DisplayObjectContainer();

		msgFunc(this.view, stage.width, stage.hieght);

		this.stage = stage;
		stage.addChild(this.view);
		this.keepTickingMain = keepTickingMain;
		this.count = count || this.count;
		return this;
	},
	end: function () {
		this.stage.removeChild(this.view);
		main.screen.dialog = null;
	},
	tick: function (dt) {
		this.count++;
		if (this.count === 100) {
			this.end();
		}
	},
	render: function () {

	}

};
