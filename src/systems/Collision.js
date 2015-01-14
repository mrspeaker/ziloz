"use strict";

var sys = (window.sys = window.sys || {});

sys.Collision = {

	update: function (e, ents) {

		if (e.remove || !e.collision) { return; }

		var col = e.collision,
			fireEvent = this.fire;

		// If can do damage...
		if (col.damage) {

			ents.forEach(function (e2) {

				if (e2.remove || e2 === e || !e2.collision) { return; }
				// Hit other projectiles?
				// if (e2.collision.group === "projectile" ) { return; }

				var dx = e2.pos.x - e.pos.x,
					dy = e2.pos.y - e.pos.y;

				if (Math.sqrt(dx * dx + dy * dy) < 15) {

					fireEvent("collision", {
						a: e2,
						b: e
					});

				}

			});

		}

		// If a "pickup"
		if (col.group === "pickup") {

			ents.forEach(function (e2) {

				if (e2.remove || !e2.collision || e2.collision.group !== "default") { return; }

				var dx = e2.pos.x - e.pos.x,
					dy = e2.pos.y - e.pos.y;

				if (Math.sqrt(dx * dx + dy * dy) < 15) {

					fireEvent("pickup", {
						e: e2,
						pickup: e
					});

				}

			});

		}

	},

	fire: function (event, params) {

		if (event === "collision") {

			sys.Behaviour.collide(params);

		}

		if (event === "pickup") {

			sys.Behaviour.pickup(params);

		}

	}

};
