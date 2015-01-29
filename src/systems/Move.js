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

		if (e.noLoitering) {

			if (!e.noLoitering.lastMovedAt) { e.noLoitering.lastMovedAt = Date.now(); }

			if (Date.now() - e.noLoitering.lastMovedAt > e.noLoitering.bustedAfter) {
				e.health.amount = 0;
			}
		}

		if (e.input) {

			var input = e.input,
				key = input.key,
				speed = input.power;

			e.input.tick();

			if (key.left || key.right) {

				if (key.right) {

					e.vel.x += speed;
					e.rot.angle = Math.PI / 2;

				}

				if (key.left) {

					e.vel.x -= speed;
					e.rot.angle = -Math.PI / 2;

				}

			}

			if (key.up || key.down) {

				if (key.up) {

					e.vel.y -= speed;
					e.rot.angle = 0;

				}

				if (key.down) {

					e.vel.y += speed;
					e.rot.angle = Math.PI;

				}

			}

			// TODO: 0.1 what detlat??
			if (Math.abs(e.vel.x) < 0.1) e.vel.x = 0;
			if (Math.abs(e.vel.y) < 0.1) e.vel.y = 0;

			// Update loitering if moved
			if (e.noLoitering && (e.vel.x !== 0 || e.vel.y !== 0)) {
				e.noLoitering.lastMovedAt = Date.now();
			}

			if (key.fire || e.autofire) {

				this.fire(e, "entityFired");

			}

		}

	},

	fire: function (e, event, params) {

		if (event === "entityFired") {

			sys.Behaviour.entityFired(e, params);

		}

	}

};
