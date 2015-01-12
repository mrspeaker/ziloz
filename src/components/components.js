"use strict";

var components = window.components || {};

components.sprite = {
	ref: null,
	texture: "main",
	scale: 1,
	rot: 0
};

components.pos = {
	x: 0,
	y: 0,
	lastX: 0,
	lastY: 0
};

components.rot = {
	angle: 0,
	offset: 0
};

components.size = {
    w: 16,
    h: 16
};

components.vel = {
	x: 0,
	y: 0
};

components.input = {
	power: 1.4
};

components.health = {
	amount: 100
};

components.autofire = {};

components.spin = {
	rate: -0.02
};

components.jiggle = {
	rate: 0.2
};

components.life = {
	count: 100
};

components.shoot = {
	vel: 5.0,
	rot: -Math.PI / 2
};

components.sine = {
	freq: 300,
	amp: 0.1
};

components.collision = {
	group: "default"
};

components.bouncer = {};

components.map = {
   	destroy: false,
   	destroyedBy: false
};
