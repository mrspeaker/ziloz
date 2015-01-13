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
			[5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 3, 3, _, _, _, _, _, _, _, _, 5],
			[5, 1, 1, 1, 1, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 3, 3, _, _, _, _, 1, 1, 1, 1, 5],
			[5, 5, 5, 5, 1, _, _, _, _, 2, 2, _, _, _, _, _, _, _, _, 2, 2, _, _, _, _, 1, 5, 5, 5, 5],
			[5, 5, 5, 5, 1, _, _, _, _, 4, 4, _, _, 1, 6, 4, 1, _, _, 3, 3, _, _, _, _, 1, 5, 5, 5, 5],
			[5, 5, 5, 5, 1, _, _, _, _, 4, 4, _, _, 1, 4, 3, 1, _, _, 3, 3, _, _, _, _, 1, 5, 5, 5, 5],
			[5, 5, 5, 5, 1, _, _, _, _, 2, 2, _, _, _, _, _, _, _, _, 2, 2, _, _, _, _, 1, 5, 5, 5, 5],
			[5, 1, 1, 1, 1, _, _, _, _, 4, 4, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 1, 1, 1, 1, 5],
			[5, _, _, _, _, _, _, _, _, 4, 4, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5],
			[5, _, _, _, _, _, _, _, _, 2, 2, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5],
			[5, _, _, 1, 1, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 1,22, 3,23, 3, 1, _, _, 5],
			[5, _, _,23, 3, _, _, _, _, _, _, _, _, _, _, 2,20, 4, 2, _, _, 1, 3, 3, 3, 3, 1, _, _, 5],
			[5, _, _, 3, 3, _, _, _, _, _, _, _, _, _, _, 2, 4, 4, 2, _, _, _, _, _, _, _, _, _, _, 5],
			[5, _, _, 1, 1, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5],
			[5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5, 5, 5, 5, 5, 5, 5, 5, 5],
			[5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5, 5, 5, 5, 5, 5, 5, 5, 5],
			[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
		].map(function (row) {

			return row.map(function (col) {

				var refill = null,
					refillGroup = 0;

				// Team 1 refils
				if ([20, 21].indexOf(col) > -1) {
					refill = col - 19;
					col = 4;
					refillGroup = 1;
				}

				// Team 2 refils
				if ([22, 23].indexOf(col) > -1) {
					refill = col - 21;
					col = 3;
					refillGroup = 2;
				}

				// Health
				if (col === 6) {
					refill = 3;
				}

				var tile = {
					type: col,
					health: 10,
					walkable: [0, 3, 4, 6].indexOf(col) > -1,
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

	}

};
