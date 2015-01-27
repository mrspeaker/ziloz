# zilok

## Next todos

### required:

- player spawn location.
- remove player when dead before respwan
- explosion on other screen when player dies.
- gameover screen
- sounds

### Then:

- knockback?
- improve gfx
	- better tiles
	- bullet gfx
	- better lives icon
- simple ai
- controls v2

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