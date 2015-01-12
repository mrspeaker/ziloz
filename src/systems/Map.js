"use strict";

var sys = (window.sys = window.sys || {});

sys.Map = {

	update: function (e, map) {

		var run = e.map;

		if (!run) { return };

		// Check if move valid...
		var x = e.pos.x,
			y = e.pos.y,
			w = e.size.w / 2 | 0,
			h = e.size.h / 2 | 0;

		var tl = map.getBlockAt(x - w, y - h).walkable,
			tm = map.getBlockAt(x, y - h).walkable,
			tr = map.getBlockAt(x + w, y - h).walkable,
			bl = map.getBlockAt(x - w, y + h).walkable,
			bm = map.getBlockAt(x, y + h).walkable,
			br = map.getBlockAt(x + w, y + h).walkable,
			lm = map.getBlockAt(x - w, y).walkable,
			rm = map.getBlockAt(x + w, y).walkable;

		run.hit = false;
		run.touching = [];

		if (!(tl && tm && tr && bl && bm && br && lm && rm)) {

			e.pos.x = e.pos.lastX;
			e.pos.y = e.pos.lastY;

			run.hit = true;
			run.touching = [tl, tm, tr, lm, false, rm, bl, bm, br];


			if (e.bouncer) {

				e.rot.angle += Math.PI / 4;

			}

			if (run.destroy) {

				var block = map.blocks[e.pos.y / map.tileH | 0][e.pos.x / map.tileW | 0];

				if (block.destructible) {

					block.type = 0;
					block.walkable = true;

					if (block.sprite) {

						main.stage.removeChild(block.sprite);
						block.sprite = null;

					}

				}

				if (run.destroyedBy) {

					e.remove = true;
					main.addExplosion(e);

				}

			}

		}

	}
};
