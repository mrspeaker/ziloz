"use strict";

window.prefabs = {};
window.components = {};
window.core = {};

core.merge = function (a, b) {

	var out = {};

	for (var attr in a) { out[attr] = a[attr]; }
	for (attr in b) { out[attr] = b[attr]; }

	return out;

};

core.addComponent = function (e, name, conf) {

	e[name] = core.merge({}, window.components[name]);

	if (conf) {

		e[name] = core.merge(e[name], conf);

	}

	return e;

};

core.removeComponent = function (e, name) {

	delete e[name];

	return e;

};

core.createEntity = function (conf) {

	var merge = core.merge,
		entity = merge({}, conf);

	for (var key in conf) {

		entity[key] = merge(entity[key], window.components[key]); // merge comp defaults
		entity[key] = merge(entity[key], conf[key]); // merge instant settings

	}

	entity.remove = false;

	return entity;

};

core.createPrefab = function (type, conf) {

	var merge = core.merge,
		prefab = window.prefabs[type],
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

};
