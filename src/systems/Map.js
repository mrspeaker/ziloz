"use strict";

var sys = (window.sys = window.sys || {});

sys.Map = {

	update: function (e, map) {

		var run = e.map;

		if (!run) { return };

		var neighbours = function (x, y, w, h) {

			var hits = {
				tl: map.getBlockAt(x - w, y - h).walkable,
				tm: map.getBlockAt(x, y - h).walkable,
				tr: map.getBlockAt(x + w, y - h).walkable,
				bl: map.getBlockAt(x - w, y + h).walkable,
				bm: map.getBlockAt(x, y + h).walkable,
				br: map.getBlockAt(x + w, y + h).walkable,
				lm: map.getBlockAt(x - w, y).walkable,
				rm: map.getBlockAt(x + w, y).walkable
			};

			hits.hit = !(hits.tl && hits.tm && hits.tr && hits.bl && hits.bm && hits.br && hits.lm && hits.rm);

			return hits;

		}

		// Check if move valid...
		var x = e.pos.x,
			y = e.pos.y,
			w = e.size.w / 2 | 0,
			h = e.size.h / 2 | 0,
			xd = e.pos.lastX - e.pos.x,
			yd = e.pos.lastY - e.pos.y,
			hit = false,
			ns;

		if (e.input) {

			var moved = false,
				movedBoth = false,
				dir = e.input.down.length ? e.input.down[e.input.down.length - 1] : 0;

			// BUG: if DOWN then LEFT then slide past down entrance, doesn't go down.
			//      if LEFT then DOWN then does... can fix this?

			// Check left/right
			if (xd !== 0) {

				ns = neighbours(x, e.pos.lastY, w, h);
				if (ns.hit) {

					x = e.pos.lastX;
					hit = true;

				} else {

					moved = true;

				}

			}

			// Check up/down
			if (yd !== 0) {

				ns = neighbours(x, y, w, h);
				if (ns.hit) {

					y = e.pos.lastY;
					hit = true;

				} else {

					if (moved) { movedBoth = true; }
					moved = true;

				}

			} else {

				y = e.pos.lastY;

			}

			// If we've moved both, lock to one!
			if (movedBoth && dir) {

				if (dir === e.input.keyset.up || dir === e.input.keyset.down) {

					x = e.pos.lastX;
					e.rot.angle = dir === e.input.keyset.up ? 0 : Math.PI;

				} else {

					y = e.pos.lastY;
					e.rot.angle = dir === e.input.keyset.left ? -Math.PI / 2 : Math.PI / 2;

				}

			}

			e.pos.x = x;
			e.pos.y = y;

			run.hit = moved ? false : hit;

		} else {

			ns = neighbours(x, y, w, h);
			run.hit = ns.hit;
			if (run.hit) {

				e.pos.x = e.pos.lastX;
				e.pos.y = e.pos.lastY;

			}

		}

		if (run.hit) {

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
