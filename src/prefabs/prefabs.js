"use strict";

var prefabs = window.prefabs || {};

prefabs.tank = {
	pos: {},
	size: {
		w: 22,
		h: 22
	},
	rot: {},
	vel: {},
	sprite: {},
	collision: {},
	health: {},
	ammo: {},
	map: {}
};

prefabs.bullet = {
	pos: {},
	size: {},
	vel: {},
	rot: {},
	sprite: {},

	shoot: {},
	life: {},
	collision: {
		group: "projectiles",
		damage: 10
	},
	bouncer: {},
	map: {
		destroy: true,
		destroyedBy: false
	},
	health: {
		amount: 1
	}
};

prefabs.explosion = {
	pos: {},
	size: {},
	vel: {},
	rot: {},
	sprite: {},
	life: {},
	jiggle: {},
	spin: {}
};

prefabs.target = {
	pos: {},
	size: {},
	sprite: {},
	collision: {
		group: "pickup"
	},
	life: {
		count: 3000
	},
	sine: {
		freq: 30
	}
};
