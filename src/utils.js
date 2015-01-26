(function () {

	"use strict";

	var utils = {

		dist: function (a, b) {
			var dx = b.x - a.x,
				dy = b.y - b.y;

			return Math.sqrt(dx * dx + dy * dy);
		},

		aabb: function (a, b) {

			return !(b.pos.x > a.pos.x + a.size.w ||
				b.pos.x + b.size.w < a.pos.x ||
				b.pos.y > a.pos.y + a.size.h ||
				b.pos.y + b.size.h < a.pos.y);
		}

	}

	window.utils = utils;

}());