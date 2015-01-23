"use strict";

window.AIInput = {

	key: null,

	keyset: {
		up: 1,
		down: 2,
		left: 3,
		right: 4,
		fire: 5,
		fire2: 6
	},

	down: null,

	init: function () {

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

	tick: function () {

		var was = this.key_was,
			is = this.key;

		was.up = is.up;
		was.down = is.down;
		was.left = is.left;
		was.right = is.right;

		if (this.key.fire) this.keyUp({keyCode: 5});
		if (Math.random() < 0.05) {
			while (this.down.length) {
				this.keyUp({keyCode: this.down[0]});
			}
			this.keyDown({keyCode: Math.random() * 4 | 0});
		}
		if (Math.random() < 0.01) {
			this.keyDown({keyCode: 5});
		}

	}

};
