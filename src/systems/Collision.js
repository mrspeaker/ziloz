"use strict";

var sys = (window.sys = window.sys || {});

sys.Collision = {

	update: function (e, ents) {

		if (e.remove || !e.collision) { return; }

		var col = e.collision;

		// If can do damage...
		if (col.damage) {

			ents.forEach(function (e2) {

				if (e2.remove || e2 === e || !e2.collision) { return; }
				if (e2.collision.group === "projectile" ) { return; }

				var dx = e2.pos.x - e.pos.x,
					dy = e2.pos.y - e.pos.y;

				if (Math.sqrt(dx * dx + dy * dy) < 15) {

					e2.remove = !e2.health ? false : (e2.health.amount -= e.collision.damage) <= 0;
					e.remove = !e.health ? false : (e.health.amount -= col.damage) <= 0;

					main.addExplosion(e2);

				}

			});

		}

		// If a "pickup" (FIX: why not a pickup AND damage, eh?!)
		else if (col.group === "pickup") {

			ents.forEach(function (e2) {

				if (e2.remove || !e2.collision || e2.collision.group !== "default") { return; }

				var dx = e2.pos.x - e.pos.x,
					dy = e2.pos.y - e.pos.y;

				if (Math.sqrt(dx * dx + dy * dy) < 15) {

					if (e.refill) {

						if (e.refill.ammo && e2.ammo) {
							e2.ammo.amount = e.refill.ammo;
						}

						if (e.refill.fuel && e2.fuel) {
							e2.fuel.amount = e.refill.fuel;
						}

						if (e.refill.health && e2.health) {
							e2.health.amount = e.refill.health;
						}

					} else {

						e.remove = true;  // derp: make this "if removabable or something"

					}

				}


			});

		}

		// If a "trigger"
		/// if (e.collision && e.collision.group === "trigger") {

		//}

	}

};
