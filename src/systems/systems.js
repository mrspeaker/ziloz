"use strict";

var sys = (window.sys = window.sys || {});

sys.AI = {
	update: function (e) {
		if (!e.vel) { return; }

		e.vel.x += Math.random() * 4 - 2 | 0;
		e.vel.y += Math.random() * 2 - 1 | 0;

		if (e.sinbounce) {
			e.vel.y += Math.sin(Date.now() / e.sinbounce.freq) * e.sinbounce.amp;
		}

	}
};

sys.Physics = {
	update: function (e, dt) {

		if (!e.pos || !e.vel) { return; }

		var pos = e.pos;
		var vel = e.vel;

		pos.x += vel.x * dt;
		pos.y += vel.y * dt;

		vel.x *= 0.9;
		vel.y *= 0.9;
	}
};
