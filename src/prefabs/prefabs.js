"use strict";

var prefabs = window.prefabs || {};

prefabs.tank = {
	pos: {},
	size: {
		w: 22,
		h: 22
	},
	behaviour: {},
	rot: {},
	vel: {},
	sprite: {},
	collision: {},
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
		damage: 10
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
