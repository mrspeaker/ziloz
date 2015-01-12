"use strict";

var sys = (window.sys = window.sys || {});

sys.Map = {
	update: function (e, map) {

		var run = e.mazeRunner;

		if (!run) return;

		if (run.hit) {
			if (e.bouncer) {
				e.rot.angle += Math.PI / 4;
			}

			var block = map.blocks[e.pos.y / map.tileH | 0][e.pos.x / map.tileW | 0];
			if (!(block.walkable || block.type === 2 || block.type === 5)) {
				block.type = 0;
				block.walkable = true;
				if (block.sprite) {
					main.stage.removeChild(block.sprite);
					block.sprite = null;
				}
			}

			e.remove = true;
		}

	}
};

