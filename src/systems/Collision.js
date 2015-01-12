"use strict";

var sys = (window.sys = window.sys || {});

sys.Collision = {

	update: function (e, ents) {

		if (e.remove) { return; }

		if (e.collision && e.collision.damage) {

			ents.forEach(function (e2) {

				if (e2.remove || e2 === e || !e2.collision) { return; }
				if (e2.collision.group === "projectile" ) { return; }

				var dx = e2.pos.x - e.pos.x,
					dy = e2.pos.y - e.pos.y;

				if (Math.sqrt(dx * dx + dy * dy) < 15) {

					e2.remove = !e2.health ? false : (e2.health.amount -= e.collision.damage) <= 0;
					e.remove = !e.health ? false : (e.health.amount -= e.collision.damage) <= 0;

					main.addExplosion(e2);

				}

			});

		} else if (e.collision && e.collision.group === "pickup") {

			ents.forEach(function (e2) {

				if (e2.remove || !e2.collision || e2.collision.group !== "default") { return; }

				var dx = e2.pos.x - e.pos.x,
					dy = e2.pos.y - e.pos.y;

				if (Math.sqrt(dx * dx + dy * dy) < 15) {

					//e.remove = true;
					if (e.refill) {

						if (e2.ammo) {
							e2.ammo.amount = e.refill.amount;
						}

					} else {
						e.remove = true;
					}


				}


			});

		}

	}

};
