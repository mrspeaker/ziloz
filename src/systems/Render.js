"use strict";

var sys = (window.sys = window.sys || {});

sys.Render = {
	update: function (e) {

		if (!e.sprite) return;

		var sprite = e.sprite.ref;

		sprite.position.x = e.pos.x | 0;
		sprite.position.y = e.pos.y | 0;

		if (e.rot) {
			sprite.rotation = e.rot.angle + e.rot.offset;
		}

	}
};

