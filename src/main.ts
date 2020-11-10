import GameCore = require("./GameCore");

function main(param: g.GameMainParameterObject): void {
	const scene = new g.Scene({
		game: g.game,
		assetIds: ["se", "chessboard", "highlight", "move0", "move1",
			"black_advisor", "black_cannon", "black_chariot", "black_elephant", "black_general", "black_horse", "black_soldier",
			"red_advisor", "red_cannon", "red_chariot", "red_elephant", "red_general", "red_horse", "red_soldier"]
	});

	scene.loaded.add(() => {
		new GameCore(scene);
	});

	g.game.pushScene(scene);
}

export = main;
