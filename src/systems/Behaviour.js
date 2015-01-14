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
		if (!e.behaviours_to_add) { e.behaviours_to_add = []; } // todo... ergh.

		e.behaviours = e.behaviours.filter(function (b) {

			var keep = true;

			switch (b.type) {

			case "timer":
				keep = this.timerTick(e, b);
				break;

			case "behaviour":
				if (this[b.name]) {

					var add = this[b.name].apply(this, b.args);
					if (add && add.length) {

						e.behaviours_to_add = e.behaviours_to_add.concat(add);

					}
					keep = false;

				}
				break;

			default:
				console.log("unknown behvaviour: ", b);

			}

			return keep;

		}, this);

		e.behaviours_to_add = e.behaviours_to_add.filter(function (b) {

			e.behaviours.push(b);

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
				addComponent(e, t.params.name, t.params.conf);
				break;

			case "removeComponent":
				removeComponent(e, t.params.name);
				break;

			case "addBehaviour":
				e.behaviours_to_add.push({
					type: "behaviour",
					name: t.params.name,
					args: t.params.args
				});
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
				if (e.fuel.amount <= 0) {

					main.outOfFuel(e);

				}

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
			  			x: e.pos.x + (Math.cos(rot) * 18),
			  			y: e.pos.y + (Math.sin(rot) * 18)
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

			blocks.forEach(function (b) {

				if (b.destructible) {

					b.health -= 1;

					// todo: getting double hits! fix...
					if (b.sprite) b.sprite.alpha = b.health / 10;

					if (b.health <= 0) {

						b.type = 0;
						b.walkable = true;

						if (b.sprite) {

							main.stage.removeChild(b.sprite);
							b.sprite = null;

						}

					}

				}

			});

			if (e.map.destroyedBy) {

				e.remove = true;
				main.addExplosion(e);

			}

		}

	},

	collide: function (params) {

		var a = params.a,
			b = params.b,
			damage = Math.max(a.collision.damage || b.collision.damage || 1);

		a.remove = !a.health ? false : (a.health.amount -= damage) <= 0;
		b.remove = !b.health ? false : (b.health.amount -= damage) <= 0;

		main.addExplosion(a);

		if (a.shakesWhenHit) {

			a.behaviours.push({
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

		main.add(prefab, conf);

	},

	addShake: function (time) {

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
			time: time || 1000,
			done: "removeComponent",
			params: {
				name: "jiggle"
			}
		});

		return b;

	}

};
