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
				main.listen("entityMoved", e);

			}

		}


		if (e.trails) {

			var now = Date.now();

			if (now - e.trails.lastTrailAt > e.trails.rate) {

				main.listen("addTrail", e);
				e.trails.lastTrailAt = now;

			}

		}

	},

	entityFired: function (e, params) {

		var now = Date.now();

		if (!e.lastFire || now - e.lastFire > 300) {

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

			  	var mod = {
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
			  	};

			  	this.spawn("bullet", mod);

			  	Network.send_fire({
			  		pos: mod.pos,
			  		rot: mod.rot.angle
			  	});

				e.lastFire = now;

				// Fire Knockback
				if (e.rot && e.vel) {
					var knockback = 6;
					if (e.rot.angle === Math.PI) e.vel.y -= knockback;
					if (e.rot.angle === 0) e.vel.y += knockback;
					if (e.rot.angle === Math.PI / 2) e.vel.x -= knockback;
					if (e.rot.angle === -Math.PI / 2) e.vel.x += knockback;
				}

				main.sounds.shoot.play();

				if (e.muzzleFlash) {
					e.muzzleFlash.ref.alpha = 1;
					setTimeout(function () {
						e.muzzleFlash.ref.alpha = 0;
					}, e.muzzleFlash.time);
				}

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

			var bounds = {
				minX: blocks[0].pos.x,
				maxX: blocks[0].pos.x,
				minY: blocks[0].pos.y,
				maxY: blocks[0].pos.y
			};

			blocks = blocks
				.filter(function (b, i, self) {

					if (!b.pos) {
						return false;
					}
					if (b.pos.x < bounds.minX) { bounds.minX = b.pos.x; }
					if (b.pos.x > bounds.maxX) { bounds.maxX = b.pos.x; }
					if (b.pos.y < bounds.minY) { bounds.minY = b.pos.y; }
					if (b.pos.y > bounds.maxY) { bounds.maxY = b.pos.y; }

					// Unique
					return self.indexOf(b) === i;

				})
				.filter(function (b, i) {

					// down
					if (e.rot.angle == Math.PI / 2) {
						return b.pos.y === bounds.minY;
					}
					// up
					if (e.rot.angle == -Math.PI / 2) {
						return b.pos.y === bounds.maxY;
					}
					// right
					if (e.rot.angle == 0) {
						return b.pos.x === bounds.minX;
					}
					// left
					if (e.rot.angle == -Math.PI) {
						return b.pos.x === bounds.maxX;
					}

					return false;
				})

			blocks
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

		if (b.rot && a.vel) {
			var knockback = 10;
			if (b.rot.angle === -Math.PI) a.vel.x = -knockback;
			if (b.rot.angle === 0) a.vel.x = knockback;
			if (b.rot.angle === Math.PI / 2) a.vel.y = knockback;
			if (b.rot.angle === -Math.PI / 2) a.vel.y = -knockback;
		}

		main.listen("explode", a);

		if (a.shakesWhenHit) {

			a.behaviour.stack.push({
				type: "behaviour",
				name: "addShake",
				args: [2000]
			});

			main.listen("shake");

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

					if (e.ammo.amount < pickup.refill.ammo) {
						e.ammo.amount = pickup.refill.ammo;
						main.sounds.pu1.play();
					}

				}

				if (pickup.refill.fuel && e.fuel) {

					if (pickup.refill.fuel - e.fuel.amount > 5) {
						main.sounds.pu2.play();
					}
					e.fuel.amount = pickup.refill.fuel;

				}

				if (pickup.refill.health && e.health) {

					if (pickup.refill.health - e.health.amount > 5) {
						main.sounds.pu3.play();
					}
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
