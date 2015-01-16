# zilok

## Next todos

- player/player collisions
- game play
	- lives
	- destory base
	- game over
	- destroy stations
- simple ai
- controls v2
- screens
	- title

## ECS fixes

- Input component should be just model, with input class modifying entity's model.
  then AI can just set it's own up/down/left/right
- collision groups: eg, projectiles don't hit projectiles:

	col: {
		group: "projectile",
		hits: ["plyaer", "wall"],
		hitBy: ["player", "wall"]
	}
