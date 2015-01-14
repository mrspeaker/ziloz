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

		pos.x += dx;
		pos.y += dy;

		if (dx !== 0 || dy !== 0) {

			this.fire(e, "entityMoved", {
				dx: dx,
				dy: dy
			});

		}

	},

	fire: function (e, event, params) {

		if (event === "entityMoved") {

			sys.Behaviour.entityMoved(e, params);

		}


	}

};
