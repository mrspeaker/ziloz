"use strict";

var sys = (window.sys = window.sys || {});

sys.Render = {
	update: function (e) {

		if (!e.sprite) return;

		var sprite = e.sprite.ref;

		sprite.position.x = e.pos.x;
		sprite.position.y = e.pos.y;
	}
};

