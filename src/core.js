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

	return e;

}

function removeComponent (e, name) {

	delete e[name];

	return e;

}

function createEntity (conf) {

	var entity = merge({}, conf);

	for (var key in conf) {

		entity[key] = merge(entity[key], window.components[key]); // merge comp defaults
		entity[key] = merge(entity[key], conf[key]); // merge instant settings

	}

	entity.remove = false;

	return entity;

}

function createPrefab (type, conf) {

	// TODO: more efficient way to do this? Lot's of merging!
	var prefab = window.prefabs[type],
		entity = merge(conf, prefab);

	for (var key in entity) {

		entity[key] = merge(entity[key], window.components[key]); // merge comp defaults

		// merge prefab defaults
		if (prefab[key]) {
			entity[key] = merge(entity[key], prefab[key]);
		}

		// merge instant settings
		if (conf[key]) {
			entity[key] = merge(entity[key], conf[key]);
		}

	}

	entity.remove = false;

	return entity;

}
