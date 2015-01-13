"use strict";

window.Map = {

	w: 0,
	h: 0,
	tileW: 16,
	tileH: 16,

	blocks: null,

	init: function (blocks) {

		this.blocks = blocks || [
			[5,5,5, 5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5, 5,5,5,5,5,5],
			[5,5,5, 5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,5],
			[5,5,5, 5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,5],
			[5,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,1,1,0,0,5],
			[5,0,0, 0,0,0,0,0,0,0,0,2,9,3,2,0,0,0,0,0,0,0,0,0, 0,7,4,0,0,5],
			[5,0,0, 1,7,4,6,4,1,0,0,2,3,3,2,0,0,0,0,0,0,0,0,0, 0,4,4,0,0,5],
			[5,0,0, 1,4,4,4,4,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,1,1,0,0,5],
			[5,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0, 0,0,0,0,0,5],
			[5,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0, 0,0,0,0,0,5],
			[5,1,1, 1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0, 0,1,1,1,1,5],
			[5,5,5, 5,1,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0, 0,1,5,5,5,5],
			[5,5,5, 5,1,0,0,0,0,4,4,0,0,1,8,4,1,0,0,3,3,0,0,0, 0,1,5,5,5,5],
			[5,5,5, 5,1,0,0,0,0,4,4,0,0,1,4,4,1,0,0,3,3,0,0,0, 0,1,5,5,5,5],
			[5,5,5, 5,1,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0, 0,1,5,5,5,5],
			[5,1,1, 1,1,0,0,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,1,1,1,1,5],
			[5,0,0, 0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,5],
			[5,0,0, 0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,5],
			[5,0,0, 1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,9,3,10,3,1,0,0,5],
			[5,0,0,10,3,0,0,0,0,0,0,0,0,0,0,2,6,4,2,0,0,1,3,3, 3,3,1,0,0,5],
			[5,0,0, 3,3,0,0,0,0,0,0,0,0,0,0,2,4,4,2,0,0,0,0,0, 0,0,0,0,0,5],
			[5,0,0, 1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,5],
			[5,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5, 5,5,5,5,5,5],
			[5,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5, 5,5,5,5,5,5],
			[5,5,5, 5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5, 5,5,5,5,5,5]
		].map(function (row) {

			return row.map(function (col) {

				var refill = null,
					refillGroup = 0;

				if ([6, 7].indexOf(col) > -1) {
					refill = col - 5;
					col = 4;
					refillGroup = 1;
				}

				if ([9, 10].indexOf(col) > -1) {
					refill = col - 8;
					col = 3;
					refillGroup = 2;
				}

				if (col === 8) {
					col = 4;
					refill = 3;
				}

				var tile = {
					type: col,
					health: 10,
					walkable: [0, 3, 4].indexOf(col) > -1,
					destructible: [1].indexOf(col) > -1,
					sprite: null
				};

				if (refill) {
					tile.refill = {
						type: refill,
						group: refillGroup
					};
					console.log(tile.refill)
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
