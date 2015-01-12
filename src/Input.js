var Input = {

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

	init: function (keyset) {

		this.key = {
			up: false,
			down: false,
			left: false,
			right: false
		};

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

		var set = this.keyset;

		if (e.keyCode === set.fire) { this.key.fire = true; }
		if (e.keyCode === set.fire2) { this.key.fire = true; }
		if (e.keyCode === set.up) { this.key.up = true; }
		if (e.keyCode === set.down) { this.key.down = true; }
		if (e.keyCode === set.left) { this.key.left = true; }
		if (e.keyCode === set.right) { this.key.right = true; }

	},

	keyUp: function (e) {

		var set = this.keyset;

		if (e.keyCode === set.fire) { this.key.fire = false; }
		if (e.keyCode === set.fire2) { this.key.fire = false; }
		if (e.keyCode === set.up) { this.key.up = false; }
		if (e.keyCode === set.down) { this.key.down = false; }
		if (e.keyCode === set.left) { this.key.left = false; }
		if (e.keyCode === set.right) { this.key.right = false; }

	},

	tick: function () {

	}

};
