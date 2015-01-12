"use strict";

var sys = (window.sys = window.sys || {});

sys.Render = {

	init: function (e) {

		var def = e.sprite;

		var sprite = main.makeSprite(
				main.textures[def.texture],
				0,
				0,
				def.tint,
				def.scale,
				def.scale);

		sprite.rotation = def.rot;

		if (def.blend) {
			sprite.blendMode = PIXI.blendModes[def.blend];
		}

		def.ref = sprite;

		main.stage.addChild(sprite);

	},

	update: function (e) {

		if (!e.sprite) return;

		var sprite = e.sprite.ref;

		sprite.position.x = e.pos.x | 0;
		sprite.position.y = e.pos.y | 0;

		if (e.rot) {
			sprite.rotation = e.rot.angle + e.rot.offset;
		}

	},

	remove: function (e) {

		main.stage.removeChild(e.sprite.ref);

	}

};
