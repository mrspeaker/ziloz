"use strict";

var sys = (window.sys = window.sys || {});

sys.Physics = {

	update: function (e, map, dt) {

		if (!e.pos || !e.vel) { return; }

		var pos = e.pos,
			vel = e.vel,
			dx = 0,
			dy = 0;

		e.pos.lastX = pos.x;
		e.pos.lastY = pos.y;

		dx += vel.x * dt;
		dy += vel.y * dt;

		vel.x *= 0.2;
		vel.y *= 0.2;

		if (e.fuel && (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1)) {
			e.fuel.amount = Math.max(0, e.fuel.amount - 0.1);
			if (e.fuel.amount <= 0) {
				main.outOfFuel(e);
			}

		}

		pos.x += dx;
		pos.y += dy;

	}

};
