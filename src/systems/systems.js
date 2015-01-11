"use strict";

var sys = (window.sys = window.sys || {});

sys.Life = {
	update: function (e) {

		if (!e.life) return;

		if(e.life.count-- <= 0) {
			e.remove = true;
		}

	}
}

sys.Move = {
	update: function (e) {

		if (e.spin && e.rot) {

			e.rot.angle += e.spin.rate;

		}

		if (!e.vel) { return; }

		if (e.shoot && e.rot) {

			e.vel.x += Math.cos(e.rot.angle) * e.shoot.vel;
			e.vel.y += Math.sin(e.rot.angle) * e.shoot.vel;

		}

		if (e.jiggle) {

			e.vel.x += (Math.random() * 2 - 1) * e.jiggle.rate;
			e.vel.y += (Math.random() * 2 - 1) * e.jiggle.rate;

		}

		if (e.sine) {

			e.vel.y += Math.sin(Date.now() / e.sinbounce.freq) * e.sinbounce.amp;

		}

		if (e.input) {

			var input = e.input,
				key = input.key,
				speed = 0.2;

			if (key.left || key.right) {
				if (key.right) {
					e.vel.x += speed;
					e.rot.angle = Math.PI / 2;
				}
				if (key.left) {
					e.vel.x -= speed;
					e.rot.angle = -Math.PI / 2;
				}
			} else {
				if (key.up) {
					e.vel.y -= speed;
					e.rot.angle = 0;
				}
				if (key.down) {
					e.vel.y += speed;
					e.rot.angle = Math.PI;
				}
			}
			if (key.fire || e.autofire) {

				var now = Date.now();
				if (!e.lastFire || now - e.lastFire > 200) {
					main.addBullet(e);
					e.lastFire = now;
				}

			}

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

		vel.x *= 0.8;
		vel.y *= 0.8;
	}
};
