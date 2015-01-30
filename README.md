# zilok

## Next todos

### required:

- ammo network amount is off?
- balance

### Then:

- better splash screen
- tracks particles
- sounds
	- no ammo sound ("click")
	- start sound
- handle network disconnect

### Probably not

- network sync dead tiles.
- theme tune
- stalemate if both out of ammo and no refills?
- controls v2
- simple ai

### Really not

- names
- highscore tables
- acheivements

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
