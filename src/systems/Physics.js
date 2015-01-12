"use strict";

var sys = (window.sys = window.sys || {});

sys.Physics = {

	update: function (e, map, dt) {

		if (!e.pos || !e.vel) { return; }

		var pos = e.pos,
			vel = e.vel,
			ox = pos.x,
			oy = pos.y,
			dx = 0,
			dy = 0;

		e.pos.lastX = ox;
		e.pos.lastY = oy;

		dx += vel.x * dt;
		dy += vel.y * dt;

		vel.x *= 0.2;
		vel.y *= 0.2;

		pos.x += dx;
		pos.y += dy;

	}

};
