"use strict";

window.Map = {

	w: 0,
	h: 0,
	tileW: 16,
	tileH: 16,

	blocks: null,

	refills: null,

	init: function (blocks) {

		this.refills = [];

		var _ = 0;

		this.blocks = blocks || [
			[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
			[5, 5, 5, 5, 5, 5, 5, 5, 5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5],
			[5, 5, 5, 5, 5, 5, 5, 5, 5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5],
			[5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 1, 1, _, _, 5],
			[5, _, _, _, _, _, _, _, _, _, _, 1,22, _, 1, _, _, _, _, _, _, _, _, _, _,21, _, _, _, 5],
			[5, _, _, 1,21, _,20, _, 1, _, _, 1, _, _, 1, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5],
			[5, _, _, 1, _, _, _, _, 1, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 1, 1, _, _, 5],
			[5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5],
			[5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 2, 2, _, _, _, _, _, _, _, _, 5],
			[5, 1, 1, 1, 4, _, _, _, _, 2, 2, _, _, _, _, _, _, _, _, 6, 7, _, _, _, _, 3, 1, 1, 1, 5],
			[5,10,10,10, 1, _, _, _, _, 6, 7, _, _, _, _, _, _, _, _,14,15, _, _, _, _, 1,11,11,11, 5],
			[5,10,10,10, 1, _, _, _, _,14,15, _, _, 1,24, _, 1, _, _, 2, 2, _, _, _, _, 1,11,11,11, 5],
			[5,10,10,10, 1, _, _, _, _, 2, 2, _, _, 1, _, _, 1, _, _, 6, 7, _, _, _, _, 1,11,11,11, 5],
			[5,10,10,10, 1, _, _, _, _, 6, 7, _, _, _, _, _, _, _, _,14,15, _, _, _, _, 1,11,11,11, 5],
			[5, 1, 1, 1,13, _, _, _, _,14,15, _, _, _, _, _, _, _, _, 2, 2, _, _, _, _, 12, 1, 1, 1, 5],
			[5, _, _, _, _, _, _, _, _, 2, 2, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5],
			[5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5],
			[5, _, _, 1, 1, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 1,22, _,23, _, 1, _, _, 5],
			[5, _, _,23, _, _, _, _, _, _, _, _, _, _, _, 1,20, _, 1, _, _, 1, _, _, _, _, 1, _, _, 5],
			[5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 1, _, _, 1, _, _, _, _, _, _, _, _, _, _, 5],
			[5, _, _, 1, 1, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5],
			[5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5, 5, 5, 5, 5, 5, 5, 5, 5],
			[5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5, 5, 5, 5, 5, 5, 5, 5, 5],
			[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
		].map(function (row, y) {

			return row.map(function (col, x) {

				var refill = null,
					refillGroup = 0;

				// TODO: lolol

				// Team 1 refils
				if ([20, 21].indexOf(col) > -1) {
					refill = col - 19;
					//col = 4;
					refillGroup = 1;
				}

				// Team 2 refils
				if ([22, 23].indexOf(col) > -1) {
					refill = col - 21;
					refillGroup = 2;
				}

				// Health
				if (col === 24) {
					refill = 3;
				}

				// TODO: hmm..... should tiles be entities?
				var tile = {
					pos: {
						x: x,
						y: y
					},
					type: col,
					health: 10,
					walkable: [0, 6, 7, 9, 14, 15, 20, 21, 22, 23, 24].indexOf(col) > -1,
					destructible: [1, 3, 4, 12, 13].indexOf(col) > -1,
					sprite: null
				};

				if (refill) {
					tile.refill = {
						type: refill,
						group: refillGroup
					};
				}

				return tile;

			});

		});

		this.h = this.blocks.length;
		this.w = this.blocks[0].length;

		return this;

	},

	getBlockAt: function (x, y) {

		var yb = y / this.tileH | 0,
			xb = x / this.tileW | 0,
			nullBlock = {walkable: false};

		if (yb < 0 || xb < 0) return nullBlock;
		if (xb > this.w - 1) return nullBlock;
		if (yb > this.h - 1) return nullBlock;

		return this.blocks[yb][xb];

	},

	findFreeSpot: function () {

		var ok = false,
			map = this,
			x,
			y,
			tw = map.tileW,
			th = map.tileH;

		while (!ok) {

			x = (Math.random () * map.w | 0);
			y = (Math.random () * map.h | 0);

			if (
				map.getBlockAt(x * tw, y * th).walkable &&
				map.getBlockAt((x - 1) * tw, y * th).walkable &&
				map.getBlockAt(x * tw, (y - 1) * th).walkable &&
				map.getBlockAt((x - 1) * tw, (y - 1) * th).walkable) {
					ok = true;
			}

		}

		return { x: x * tw, y: y * th };

	},

	tileHit: function (b, e) {

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

				// If it's part of a refill structure, destroy the strucutre.
				// Crappy way to handle structures... but no time!

				var getRefill = function (x, y) {
					return this.refills.filter(function (r) {
						return r.tile.x / 16 === x && r.tile.y / 16 === y;
					});
				}.bind(this);

				[
					{ station: [12, 4], tiles: [[11, 4], [11, 5], [14, 4], [14, 5]] },
					{ station: [25, 4], tiles: [[25, 3], [26, 3], [25, 6], [26, 6]] },

					{ station: [4, 5], tiles: [[3, 5], [3, 6]] }, // green base ammo
					{ station: [6, 5], tiles: [[8, 5], [8, 6]] }, // green base fuel

					{ station: [14, 11], tiles: [[13, 11], [13, 12], [16, 11], [16, 12]] }, // Health

					{ station: [22, 17], tiles: [[21, 17], [21, 18]] },  // yellow base ammo
					{ station: [24, 17], tiles: [[26, 17], [26, 18]] },  // yellow base fuel

					{ station: [3, 18], tiles: [[3, 17], [4, 17], [3, 20], [4, 20]] },
					{ station: [16, 18], tiles: [[15, 18], [15, 19], [18, 18], [18, 19]] } // green ammo

				].forEach(function (e) {

					var destroyedRefill = e.tiles.some(function (t) {
						return b.pos.x === t[0] && b.pos.y === t[1];
					});

					if (destroyedRefill) {
						var ref = getRefill(e.station[0], e.station[1]);
						if (ref) {
							this.view.removeChild(ref[0].tile);
							ref[0].refill.remove = true;
							main.listen("explodeStation", {pos: {x: e.station[0], y: e.station[1]}});
						}
					}

				}, this);

			}

		}
	},

	render: function (stage, level) {

		var mapContainer = new PIXI.DisplayObjectContainer();
		this.view = mapContainer;

		// Render the map
		for (var y = 0; y < this.h; y++) {

			for (var x = 0; x < this.w; x++) {

				var block = this.blocks[y][x];

				if (block.type === 0) { continue; }

				// TODO: lol lol
				var frameName = block.type >= 20 && block.type <= 24 ? "large" : "f";

				var tx, ty, tile;

				if (frameName === "f") {

					tx = (block.type - 1) % 8 | 0;
					ty = (block.type - 1) / 8 | 0;
					tile = PIXI.Sprite.fromFrame("f" + tx + "_" + ty);

				} else {

					tx = (block.type - 20) % 4 | 0;
					ty = (block.type - 20) / 4 | 0;
					tile = PIXI.Sprite.fromFrame(frameName + tx + "_" + ty);

				}

				tile.position.x = x * this.tileW;
				tile.position.y = y * this.tileH;
				//if (block.type !== 3 && block.type !== 4) {

					mapContainer.addChild(tile);

				//}
				this.blocks[y][x].sprite = tile;

				if (block.refill) {

					this.refills.push({
						tile: tile,
						refill: level.addRefill(block.refill, tile.position)
					});

				}

			}

		}

		stage.addChild(mapContainer);

	}

};
