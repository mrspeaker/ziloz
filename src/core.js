"use strict";

window.prefabs = {};
window.components = {};

function merge (a, b) {
	var out = {};
	for (var attr in a) { out[attr] = a[attr]; }
	for (attr in b) { out[attr] = b[attr]; }
	return out;
}

function addComponent (e, name, conf) {
	e[name] = merge({}, window.components[name]);
	if (conf) {
		e[name] = merge(e[name], conf);
	}
}

function removeComponent (e, name) {
	delete e[name];
}

function createEntity (type, conf) {
	// TODO: more efficient way to do this? Lot's of merging!
	var prefab = window.prefabs[type],
		entity = merge(conf, prefab);

	for (var key in entity) {
		entity[key] = merge(entity[key], window.components[key]); // merge comp defaults
		entity[key] = merge(entity[key], prefab[key]); // merge prefab defaults
		entity[key] = merge(entity[key], conf[key]); // merge instant settings
	}

	entity.remove = false;

	return entity;
}
