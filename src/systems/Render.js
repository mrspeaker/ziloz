"use strict";

var sys = (window.sys = window.sys || {});

sys.Render = {

	initSys: function (stage) {

		this.stage = stage;

	},

	addSprite: function (sprite) {

		this.stage.addChild(sprite);

	},

	removeSprite: function (sprite) {

		this.stage.removeChild(sprite);

	},

	init: function (e) {

		if (!e.sprite) { return; }

		var def = e.sprite,
			cont = new PIXI.DisplayObjectContainer(),
			sprite = this.makeSprite(
				main.textures[def.texture],
				0,
				0,
				def.tint,
				def.scale,
				def.scale
			);

		cont.addChild(sprite);

		if (def.turret) {
			var turret = this.makeSprite(
				main.textures["top"],
				0, 0,
				def.tint - 20000,
				def.scale, def.scale
			);

			turret.position.y -= 5;
			cont.addChild(turret);
			def.turretRef = turret;

		}

		cont.rotation = def.rot;

		if (def.blend) {

			sprite.blendMode = PIXI.blendModes[def.blend];

		}

		def.ref = sprite;
		def.cont = cont;

		this.addSprite(cont);

	},

	update: function (e) {

		if (!e.sprite) { return };

		var sprite = e.sprite.cont; //sprite.ref;

		sprite.position.x = e.pos.x | 0;
		sprite.position.y = e.pos.y | 0;

		if (e.rot) {

			sprite.rotation = e.rot.angle + e.rot.offset;

			if (e.sprite.turretRef) {
				e.sprite.turretRef.position.x = (Math.sin(sprite.position.x / 2)) + 0.5;
				e.sprite.turretRef.position.y = (Math.cos(sprite.position.y / 2)) - 5;
			}

		}

	},

	makeSprite: function (texture, x, y, col, sx, sy) {

		var sprite = new PIXI.Sprite(texture);

		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;

		sprite.position.x = x;
		sprite.position.y = y;

		sprite.scale.x = sx || 1;
		sprite.scale.y = sy || 1;

		if (col) {
			sprite.tint = col;
		}

		return sprite;

	},

	remove: function (e) {

		this.stage.removeChild(e.sprite.ref);
		this.stage.removeChild(e.sprite.cont);

	}

};
