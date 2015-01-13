"use strict";

window.Input = {

	key: null,

	keyset1: {
		up: 38,
		down: 40,
		left: 37,
		right: 39,
		fire: 32,
		fire2: 190
	},

	keyset2: {
		up: 87,
		down: 83,
		left: 65,
		right: 68,
		fire: 88,
		fire2: 70
	},

	down: null,

	init: function (keyset) {

		this.down = [];

		this.key = {
			up: false,
			down: false,
			left: false,
			right: false
		};

		this.key_was = {
			up: false,
			down: false,
			left: false,
			right: false
		}

		this.keyset = this["keyset" + keyset];

		document.addEventListener("keydown", (function (e) {

			this.keyDown(e);

		}).bind(this), false);

		document.addEventListener("keyup", (function (e) {

			this.keyUp(e);

		}).bind(this), false);

		return this;

	},

	keyDown: function (e) {

		var set = this.keyset,
			code = e.keyCode,
			toAdd = this.down.slice(),
			add = function (code) {
				if (!toAdd.some(function (k) {
					return k === code;
				})){
					toAdd.push(code);
				}
			};

		if (code === set.fire) { this.key.fire = true; }
		if (code === set.fire2) { this.key.fire = true; }
		if (code === set.up) { this.key.up = true; add(code); }
		if (code === set.down) { this.key.down = true; add(code); }
		if (code === set.left) { this.key.left = true; add(code); }
		if (code === set.right) { this.key.right = true; add(code); }

		this.down = toAdd;

	},

	keyUp: function (e) {

		var set = this.keyset,
			code = e.keyCode,
			toRemove = this.down.slice(),
			clear = function (code) {
				toRemove = toRemove.filter(function (k) {
					return k !== code;
				});
			};

		if (code === set.fire) { this.key.fire = false; }
		if (code === set.fire2) { this.key.fire = false; }
		if (code === set.up) { this.key.up = false; clear(code); }
		if (code === set.down) { this.key.down = false; clear(code); }
		if (code === set.left) { this.key.left = false; clear(code); }
		if (code === set.right) { this.key.right = false; clear(code); }

		this.down = toRemove;

	},

	tick: function (a) {

		var was = this.key_was,
			is = this.key;

		was.up = is.up;
		was.down = is.down;
		was.left = is.left;
		was.right = is.right;
	}

};
