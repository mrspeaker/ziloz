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

    health: {}
};

prefabs.bullet = {
	pos: {},
	size: {},
	vel: {},
	rot: {
	//	offset: Math.PI / 2
	},
	sprite: {},

	shoot: {},
	life: {},
    sine: {
    	freq: 30
    },
    collision: {
    	group: "projectiles",
    	damage: 10
    },
    bouncer: {},
    mazeRunner: {}
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
}

prefabs.target = {
	pos: {},
	size: {},
	sprite: {},
	collision: {
		group: "pickup"
	},
	life: {
		count: 3000
	}
}

