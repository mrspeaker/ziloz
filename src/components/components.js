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
	rate: -0.01
};

components.jiggle = {
	rate: 0.2
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

components.sine = {
	freq: 300,
	amp: 0.1
};

