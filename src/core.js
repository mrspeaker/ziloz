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
	// TODO: more efficient way to do this? Lot's of merging!
	var prefab = prefabs[type],
		entity = merge(conf, prefab);

	for (var key in entity) {
		entity[key] = merge(entity[key], components[key]); // merge comp defaults
		entity[key] = merge(entity[key], prefab[key]); // merge prefab defaults
		entity[key] = merge(entity[key], conf[key]); // merge instant settings
	}

	entity.remove = false;

	return entity;
}
