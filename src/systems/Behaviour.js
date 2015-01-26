"use strict";

var sys = (window.sys = window.sys || {});

sys.Behaviour = {

	update: function (e) {

		// Hmm... life & fuel refresh should be here?
		if (e.life && e.life.count-- <= 0) {

			e.remove = true;

		}

		if (e.fuel) {

			if (e.fuel.amount <= 0) {

				main.listen("die", e);

			}

			else if (e.fuel.refreshRate) {

				e.fuel.amount = Math.min(e.fuel.max, e.fuel.amount + e.fuel.refreshRate);

			}


		}

		if (e.health && e.health.amount <= 0) {

			main.listen("die", e);

		}

		if (!e.behaviour) { return; }

		e.behaviour.stack = e.behaviour.stack.filter(function (b) {

			var keep = true;

			switch (b.type) {

			case "timer":
				keep = this.timerTick(e, b);
				break;

			case "behaviour":
				if (this[b.name]) {

					var add = this[b.name].apply(this, b.args);
					if (add && add.length) {

						e.behaviour.toAdd = e.behaviour.toAdd.concat(add);

					}
					keep = false;

				}
				break;

			case "script":
				b.func.apply(b.func, b.args);
				keep = false;
				break;

			default:
				console.log("unknown behaviour: ", b);

			}

			return keep;

		}, this);

		e.behaviour.toAdd = e.behaviour.toAdd.filter(function (b) {

			e.behaviour.stack.push(b);

			return false;

		});

	},

	timerTick: function (e, t) {

		if (!t._start) { t._start = Date.now(); }

		var elapsed = Date.now() - t._start,
			finished = elapsed > t.time;

		if (finished) {
			switch (t.done) {
			case "addComponent":
				core.addComponent(e, t.params.name, t.params.conf);
				break;

			case "removeComponent":
				core.removeComponent(e, t.params.name);
				break;

			case "addBehaviour":
				e.behaviour.toAdd.push({
					type: "behaviour",
					name: t.params.name,
					args: t.params.args
				});
				break;

			case "script":
				e.behaviour.toAdd.push({
					type: "script",
					func: t.params.func,
					args: t.params.args
				})
			}

			if (t.repeat) {
				t._start = Date.now();
				finished = false;
			}

		}

		return !finished;

	},

	/*

		Game specific behaviour logic

	*/

	entityMoved: function (e, params) {

		if (e.fuel) {

			var dx = params.dx,
				dy = params.dy,
				distance = Math.sqrt(dx * dx + dy * dy);

			if (distance > 0.1) {

				e.fuel.amount = Math.max(0, e.fuel.amount - (distance * e.fuel.burnRate));

			}

		}

	},

	entityFired: function (e, params) {

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

			  	var rot = e.rot ? e.rot.angle - Math.PI / 2 : 0;

			  	this.spawn("bullet", {
			  		pos: {
			  			x: e.pos.x + (Math.cos(rot) * (e.size.w)),
			  			y: e.pos.y + (Math.sin(rot) * (e.size.w))
			  		},
			  		sprite: {
			  			scale: 0.5
			  		},
			  		rot: {
			  			angle: rot
			  		}
			  	});

				e.lastFire = now;

			}

		}

	},

	entityWallHit: function (params) {

		var e = params.e,
			blocks = params.blocks || [];

		if (e.bouncer) {

			e.rot.angle += Math.PI / 4;

		}

		if (e.map.destroy) {

			blocks
				.filter(function (b, i, self) {

					// Unique
					return self.indexOf(b) === i;

				})
				.forEach(function (b) {

					// Don't really know where tile behaviour should go.
					main.listen("tileHit", { block: b, e: e });

				});

			if (e.map.destroyedBy) {

				// TODO: some kind of behaviour?
				main.listen("removeAndExplode", e);

			}

		}

	},

	hitByProjectile: function (params) {

		var a = params.a,
			b = params.b,
			damage = Math.max(a.collision.damage || b.collision.damage || 1);

		if (a.health) { a.health.amount -= damage; }
		if (b.health) { b.health.amount -= damage; }

		main.listen("explode", a);

		if (a.shakesWhenHit) {

			a.behaviour.stack.push({
				type: "behaviour",
				name: "addShake",
				args: [2000]
			});

		}

	},

	collide: function (params) {

		var a = params.a,
			b = params.b;

		a.pos.x = a.pos.lastX;
		a.pos.y = a.pos.lastY;
		b.pos.x = b.pos.lastX;
		b.pos.y = b.pos.lastY;

		if (a.shakesWhenHit) {

			a.behaviour.stack.push({
				type: "behaviour",
				name: "addShake",
				args: [2000]
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

	spawn: function (prefab, conf, init) {


		if (init) {

			init(conf);

		}

		// Could be event... but ergh, events...
		main.listen("addEntity", { prefab: prefab, conf: conf });

	},

	addShake: function (time) {

		var b = [];

		b.push({
			type: "timer",
			time: 0,
			done: "addComponent",
			params: {
				name: "jiggle",
				conf: { rate: 1 }
			}
		});

		b.push({
			type: "timer",
			time: time || 1000,
			done: "removeComponent",
			params: {
				name: "jiggle"
			}
		});

		return b;

	}

};
