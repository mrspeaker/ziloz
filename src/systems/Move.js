"use strict";

var sys = (window.sys = window.sys || {});

sys.Move = {

	update: function (e) {

		var now = Date.now();

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
				speed = input.power,
				hit = e.map.hit,
				touch = e.map.touching;

			var walledLeft = hit && key.left && (touch.tr || touch.rm || touch.br),
				walledRight = hit && key.right && (touch.tl || touch.lm || touch.bl),
				walledUp = false, //hit && key.up && (touch.bl || touch.bm || touch.br),
				walledDown = false; //hit && key.down && (touch.tl || touch.tm || touch.tr);

			if ((key.left && !walledLeft) || (key.right && !walledRight)) {

				e.vel.y = 0;

				if (key.right) {

					e.vel.x += speed;
					e.rot.angle = Math.PI / 2;

				}

				if (key.left) {

					e.vel.x -= speed;
					e.rot.angle = -Math.PI / 2;

				}

			}
			else if ((key.up && !walledUp) || (key.down && !walledDown)) {

				e.vel.x = 0;

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

				if (!e.lastFire || now - e.lastFire > 200) {

					var doFire = true;

					if (e.ammo) {
						if (e.ammo.amount > 0) {
							e.ammo.amount--;
						}
						else {
							doFire = false;
						}
					}

					if (doFire) {

					  	main.addBullet(e);
						e.lastFire = now;

					}
				}

			}

		}

	}

};
