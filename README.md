# zilok

## Next todos

### required:

- ammo network amount is off.
- if other ntwork killed, local die never sent.
- gui icons
- sounds
	- shoot
	- explode
	- no ammo sound

### Then:

- balance
- improve gfx
	- better lives icon
	- better splash
- tracks particles

### Probably not

- stalemate if both out of ammo and no refills?
- controls v2
- simple ai
- network sync dead tiles.

## ECS fixes

- Input component should be just model, with input class modifying entity's model.
  then AI can just set it's own up/down/left/right
- collision groups: eg, projectiles don't hit projectiles:

	col: {
		group: "projectile",
		hits: ["plyaer", "wall"],
		hitBy: ["player", "wall"]
	}
- way too many... ran out of time, when hack-mode.
