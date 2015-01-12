"use strict";

var sys = (window.sys = window.sys || {});

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

			e.vel.y += Math.sin(Date.now() / e.sine.freq) * e.sine.amp;

		}

		if (e.input) {

			var input = e.input,
				key = input.key,
				speed = 0.5;

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