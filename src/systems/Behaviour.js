"use strict";

var sys = (window.sys = window.sys || {});

sys.Behaviour = {

	update: function (e) {

		if (e.life && e.life.count-- <= 0) {

			e.remove = true;

		}

		if (e.fuel && e.fuel.refreshRate) {

			e.fuel.amount = Math.min(100, e.fuel.amount + e.fuel.refreshRate);

		}

		if (!e.behaviours) { return; }

		var newBehaviours = [];

		e.behaviours = e.behaviours.filter(function (b) {

			var keep = true;

			switch (b.type) {

			case "timer":
				keep = this.timerTick(e, b);
				break;

			case "behaviour":
				if (this[b.name]) {
					var add = this[b.name](b.params);
					if (add.length) {
						newBehaviours = newBehaviours.concat(add);
					}
					keep = false;
				}
				break;

			default:
				console.log("unknown behvaviour: ", b);
			}

			return keep;

		}, this);

		if (newBehaviours.length) {

			e.behaviours = e.behaviours.concat(newBehaviours);

		}

	},

	timerTick: function (e, t) {

		if (!t._start) { t._start = Date.now(); }

		var elapsed = Date.now() - t._start,
			finished = elapsed > t.time;

		if (finished) {
			if (t.done === "addComponent") {
				addComponent(e, t.params.name, t.params.conf);
			}
			if (t.done === "removeComponent") {
				removeComponent(e, t.params.name);
			}
		}

		return !finished;

	},

	entityMoved: function (e, params) {

		if (e.fuel) {

			this.useFuel(e, params);

		}

	},

	entityFired: function (e, params) {

		this.fireWeapon(e);

	},

	collide: function (params) {

		var a = params.a,
			b = params.b,
			damage = Math.max(a.damage || b.damage || 1);

		a.remove = !a.health ? false : (a.health.amount -= damage) <= 0;
		b.remove = !b.health ? false : (b.health.amount -= damage) <= 0;

		main.addExplosion(a);

		if (a.shakesWhenHit) {

			a.behaviours.push({
				type: "behaviour",
				name: "addShake",
				params: {
					time: 2000
				}
			});

		}

	},

	pickup: function (params) {

		var e = params.e,
			pickup = params.pickup;

		if (pickup.refill) {

			if (pickup.refill.group && e.refillGroup && e.refillGroup.team !== pickup.refill.group) {

				// Not for you, bud.

			} else {

				if (pickup.refill.ammo && e.ammo) {

					e.ammo.amount = pickup.refill.ammo;

				}

				if (pickup.refill.fuel && e.fuel) {

					e.fuel.amount = pickup.refill.fuel;

				}

				if (pickup.refill.health && e.health) {

					e.health.amount = pickup.refill.health;

				}

			}

		} else {

			pickup.remove = true;  // derp: make this "if removabable or something"

		}

	},

	useFuel: function (e, params) {

		var dx = params.dx,
			dy = params.dy,
			distance = Math.sqrt(dx * dx + dy * dy);

		if (distance > 0.1) {

			e.fuel.amount = Math.max(0, e.fuel.amount - (distance * e.fuel.burnRate));
			if (e.fuel.amount <= 0) {

				main.outOfFuel(e);

			}

		}

	},

	fireWeapon: function (e) {

		var now = Date.now();

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

	},

	addShake: function (params) {

		var b = [];

		b.push({
			type: "timer",
			time: 0,
			done: "addComponent",
			params: {
				name: "jiggle",
				conf: { rate: 1}
			}
		});

		b.push({
			type: "timer",
			time: params.time,
			done: "removeComponent",
			params: {
				name: "jiggle"
			}
		});

		return b;

	}

};
