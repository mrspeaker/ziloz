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

		dx += vel.x * dt;
		dy += vel.y * dt;

		vel.x *= 0.8;
		vel.y *= 0.8;

		// Check if move valid...
		var block = map.getBlockAt(ox + dx, oy + dy);
		if (!block.walkable) {
			dx = 0;
			dy = 0;
			vel.x = 0;
			vel.y = 0;
		}

		pos.x += dx;
		pos.y += dy;
	}

};
