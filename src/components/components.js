"use strict";

var components = window.components || {};

components.sprite = {
	ref: null,
	texture: "base",
	scale: 1,
	rot: 0
};

components.behaviour = {
	stack: [],
	toAdd: []
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
	power: 1.0
};

components.health = {
	lives: 5,
	amount: 100,
	max: 100,
	dead: false
};

components.ammo = {
	amount: 10,
	max: 10
};

components.fuel = {
	amount: 100,
	max: 100,
	burnRate: 0.04,
	refreshRate: 0.01
};

components.lives = {
	number: 3
};

components.refill = {
	group: 1
};
components.refillGroup = {
	team: 1
};

components.shakesWhenHit = {};

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
	vel: 8.0,
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

components.noLoitering = {
	lastMovedAt: 0,
	bustedAfter: 30 * 1000
}

components.trails = {
	rate: 15,
	lastTrailAt: 0
};

components.muzzleFlash = {
	time: 50,
	ref: null
};
