# zilok

## Next todos

- game play
	- destory base
	- game over
	- destroy stations
- screens
	- title
	- main
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
