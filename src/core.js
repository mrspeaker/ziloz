"use strict";

window.prefabs = {};
window.components = {};

function merge (a, b) {
	var out = {};
	for (var attr in a) { out[attr] = a[attr]; }
	for (attr in b) { out[attr] = b[attr]; }
	return out;
}

function createEntity (type, conf) {
	var prefab = prefabs[type];
	var entity = merge(conf, prefab);

	for (var key in entity) {
		entity[key] = merge(entity[key], components[key]);
		entity[key] = merge(entity[key], conf[key]);
	}

	return entity;
}
