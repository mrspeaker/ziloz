"use strict";

var prefabs = window.prefabs || {};

prefabs.tank = {
	pos: {},
	size: {
		w: 24,
		h: 24
	},
	behaviour: {},
	rot: {},
	vel: {},
	sprite: {},
	collision: {
		group: "tank"
	},
	lives: {},
	health: {},
	ammo: {},
	fuel: {},
	map: {},
	refillGroup: {},
	shakesWhenHit: {}
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
		group: "projectile",
		damage: 102
	},
//	bouncer: {},
	map: {
		destroy: true,
		destroyedBy: true
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
