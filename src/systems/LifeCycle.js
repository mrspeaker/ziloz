"use strict";

var sys = (window.sys = window.sys || {});

sys.LifeCycle = {

	update: function (e) {

		if (!e.life) { return };

		if (e.life.count-- <= 0) {

			e.remove = true;

		}

	}

};
