var input = {

	space: false,
	space_was: false,

	key: {
		up: false,
		down: false,
		left: false,
		right: false
	},

	init: function () {

		document.addEventListener("keydown", (function (e) {

			this.keyDown(e);

		}).bind(this), false);

		document.addEventListener("keyup", (function (e) {

			this.keyUp(e);

		}).bind(this), false);

	},

	keyDown: function (e) {

		if (e.keyCode === 32) { this.space = true; }
		if (e.keyCode === 38) { this.key.up = true; }
		if (e.keyCode === 40) { this.key.down = true; }
		if (e.keyCode === 37) { this.key.left = true; }
		if (e.keyCode === 39) { this.key.right = true; }

	},

	keyUp: function (e) {

		if (e.keyCode === 32) { this.space = false; }
		if (e.keyCode === 38) { this.key.up = false; }
		if (e.keyCode === 40) { this.key.down = false; }
		if (e.keyCode === 37) { this.key.left = false; }
		if (e.keyCode === 39) { this.key.right = false; }

	},

	tick: function () {

	}

};
