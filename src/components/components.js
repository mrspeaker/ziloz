"use strict";

var components = window.components || {};

components.pos = {
	x: 0,
	y: 0
};

components.size = {
    w: 16,
    h: 16
};

components.spinny = {
	vel: -0.01
};

components.life = {
	count: 100
}

components.vel = {
	x: 0,
	y: 0
};

components.shoot = {
	vel: 0.3,
	rot: -Math.PI / 2
};

components.sprite = {
	ref: null
};

components.sinbounce = {
	freq: 300,
	amp: 0.1
};

