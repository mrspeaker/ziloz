"use strict";

var sys = (window.sys = window.sys || {});

sys.Life = {
	update: function (e) {
		if (!e.life) return;

		if(e.life.count-- <= 0) {
			e.remove = true;
		}
	}
}

sys.AI = {
	update: function (e) {
		if (!e.vel) { return; }

		if (e.shoot) {

			e.vel.x += Math.cos(e.shoot.rot) * e.shoot.vel;
			e.vel.y += Math.sin(e.shoot.rot) * e.shoot.vel;

		}

		if (e.jiggle) {
			e.vel.x += (Math.random() * 2 - 1) * e.jiggle.rate;
			e.vel.y += (Math.random() * 2 - 1) * e.jiggle.rate;
		}

		if (e.sine) {
			e.vel.y += Math.sin(Date.now() / e.sinbounce.freq) * e.sinbounce.amp;
		}

		if (e.spinny) {
			e.sprite.ref.rotation += e.spinny.rate;
		}
	}
};

sys.Physics = {
	update: function (e, dt) {

		if (!e.pos || !e.vel) { return; }

		var pos = e.pos;
		var vel = e.vel;

		pos.x += vel.x * dt;
		pos.y += vel.y * dt;

		vel.x *= 0.9;
		vel.y *= 0.9;
	}
};
