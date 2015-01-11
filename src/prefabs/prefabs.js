"use strict";

var prefabs = window.prefabs || {};

prefabs.tank = {
	pos: {},
    size: {},
    rot: {},
    vel: {},
    sprite: {},
    collision: {},

    spin: {}
    //jiggle: {}
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
	life: {}
};


