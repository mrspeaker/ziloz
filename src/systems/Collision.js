"use strict";

var sys = (window.sys = window.sys || {});

sys.Collision = {

	update: function (e, ents) {

		if (e.remove || !e.collision) { return; }

		var col = e.collision,
			fireEvent = this.fire;

		if (col.group === "projectile" ) {

			ents.forEach(function (e2) {

				if (e2.remove || e2 === e || !e2.collision) { return; }
				// Hit other projectiles?
				// if (e2.collision.group === "projectile" ) { return; }
				if (e2.collision.group !== "tank" ) { return; }

				var dx = e2.pos.x - e.pos.x,
					dy = e2.pos.y - e.pos.y;

				if (Math.sqrt(dx * dx + dy * dy) < 15) {

					fireEvent("hitByProjectile", {
						a: e2,
						b: e
					});

				}

			});

		}

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

		if (col.group === "tank") {

			ents.forEach(function (e2) {

				if (e2.remove || !e2.collision || e2.collision.group !== "tank" || e2 === e ) { return; }

				var dx = e2.pos.x - e.pos.x,
					dy = e2.pos.y - e.pos.y;

				if (Math.sqrt(dx * dx + dy * dy) < 20) {

					fireEvent("collision", {
						a: e,
						b: e2
					});

				}

			});

		}

	},

	fire: function (event, params) {

		if (event === "hitByProjectile") {

			sys.Behaviour.hitByProjectile(params);

		}


		if (event === "collision") {

			sys.Behaviour.collide(params);

		}

		if (event === "pickup") {

			sys.Behaviour.pickup(params);

		}

	}

};
