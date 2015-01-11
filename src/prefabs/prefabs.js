"use strict";

var prefabs = window.prefabs || {};

prefabs.tank = {
	pos: {},
    size: {},
    rot: {},
    vel: {},
    sprite: {},
    collision: {},

    health: {},
    spin: {}
};

prefabs.bullet = {
	pos: {},
	size: {},
	vel: {},
	rot: {
		offset: Math.PI / 2
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
}

prefabs.target = {
	pos: {},
	size: {},
	sprite: {},
	collision: {
		group: "pickup"
	}
}

