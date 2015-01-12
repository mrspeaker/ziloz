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

		vel.x *= 0.5;
		vel.y *= 0.5;

		// Check if move valid...
		var nextX = ox + dx,
			nextY = oy + dy,
			w = e.size.w / 2 | 0,
			h = e.size.h / 2 | 0;

		var tl = map.getBlockAt(nextX - w, nextY - h).walkable,
			tm = map.getBlockAt(nextX, nextY - h).walkable,
			tr = map.getBlockAt(nextX + w, nextY - h).walkable,
			bl = map.getBlockAt(nextX - w, nextY + h).walkable,
			bm = map.getBlockAt(nextX, nextY + h).walkable,
			br = map.getBlockAt(nextX + w, nextY + h).walkable,
			lm = map.getBlockAt(nextX - w, nextY).walkable,
			rm = map.getBlockAt(nextX + w, nextY).walkable;

		if (!(tl && tm && tr && bl && bm && br && lm && rm)) {
			dx = 0;
			dy = 0;
			vel.x = 0;
			vel.y = 0;

			if (e.bouncer) {
				e.rot.angle += Math.PI / 4;
			}


		}

		pos.x += dx;
		pos.y += dy;
	}

};
