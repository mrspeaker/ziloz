"use strict";

window.Map = {

	w: 0,
	h: 0,
	tileW: 16,
	tileH: 16,

	blocks: null,

	init: function (blocks) {

		var _ = 0;

		this.blocks = blocks || [
			[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
			[5, 5, 5, 5, 5, 5, 5, 5, 5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5],
			[5, 5, 5, 5, 5, 5, 5, 5, 5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5],
			[5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 1, 1, _, _, 5],
			[5, _, _, _, _, _, _, _, _, _, _, 2,22, 3, 2, _, _, _, _, _, _, _, _, _, _,21, 4, _, _, 5],
			[5, _, _, 1,21, 4,20, 4, 1, _, _, 2, 3, 3, 2, _, _, _, _, _, _, _, _, _, _, 4, 4, _, _, 5],
			[5, _, _, 1, 4, 4, 4, 4, 1, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 1, 1, _, _, 5],
			[5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 2, 2, _, _, _, _, _, _, _, _, 5],
			[5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 6, 6, _, _, _, _, _, _, _, _, 5],
			[5, 1, 1, 1, 1, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 6, 6, _, _, _, _, 1, 1, 1, 1, 5],
			[5,10,10,10, 1, _, _, _, _, 2, 2, _, _, _, _, _, _, _, _, 2, 2, _, _, _, _, 1,11,11,11, 5],
			[5,10,10,10, 1, _, _, _, _, 6, 6, _, _, 1, 9, 6, 1, _, _, 6, 6, _, _, _, _, 1,11,11,11, 5],
			[5,10,10,10, 1, _, _, _, _, 6, 6, _, _, 1, 6, 6, 1, _, _, 6, 6, _, _, _, _, 1,11,11,11, 5],
			[5,10,10,10, 1, _, _, _, _, 2, 2, _, _, _, _, _, _, _, _, 2, 2, _, _, _, _, 1,11,11,11, 5],
			[5, 1, 1, 1, 1, _, _, _, _, 6, 6, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 1, 1, 1, 1, 5],
			[5, _, _, _, _, _, _, _, _, 6, 6, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5],
			[5, _, _, _, _, _, _, _, _, 2, 2, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5],
			[5, _, _, 1, 1, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 1,22, 3,23, 3, 1, _, _, 5],
			[5, _, _,23, 3, _, _, _, _, _, _, _, _, _, _, 2,20, 4, 2, _, _, 1, 3, 3, 3, 3, 1, _, _, 5],
			[5, _, _, 3, 3, _, _, _, _, _, _, _, _, _, _, 2, 4, 4, 2, _, _, _, _, _, _, _, _, _, _, 5],
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
				if (col === 9) {
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
					walkable: [0, 3, 4, 6, 9, 20, 21, 22, 23].indexOf(col) > -1,
					destructible: [1].indexOf(col) > -1,
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

			}

		}
	},

	render: function (stage, level) {

		var mapContainer = new PIXI.DisplayObjectContainer();

		// Render the map
		for (var y = 0; y < this.h; y++) {

			for (var x = 0; x < this.w; x++) {

				var block = this.blocks[y][x];

				if (block.type === 0) { continue; }

				// TODO: lol lol
				var frameName = block.type >= 20 && block.type <= 23 ? "large" : "f";

				var tx, ty, tile;

				if (frameName === "f") {

					tx = (block.type - 1) % 8 | 0;
					ty = (block.type - 1) / 8 | 0;
					tile = PIXI.Sprite.fromFrame("f" + tx + "_" + ty);

				} else {

					tx = (block.type - 20) % 2 | 0;
					ty = (block.type - 20) / 2 | 0;
					tile = PIXI.Sprite.fromFrame(frameName + tx + "_" + ty);

				}

				tile.position.x = x * this.tileW;
				tile.position.y = y * this.tileH;
				if (block.type !== 3 && block.type !== 4) {

					mapContainer.addChild(tile);

				}
				this.blocks[y][x].sprite = tile;

				if (block.refill) {

					level.addRefill(block.refill, tile.position);

				}

			}

		}

		stage.addChild(mapContainer);

	}

};
