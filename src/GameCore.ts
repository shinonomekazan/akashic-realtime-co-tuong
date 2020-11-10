import ChessBoard = require("./ChessBoard");
import Point = require("./interface/Point");
import Nico = require("./Nico");

class GameCore {

	center: Point;
	scene: g.Scene;
	chessboard: ChessBoard;
	nico: Nico;

	chessboardLayer: g.E;
	infoLayer: g.E;
	panelLayer: g.E;

	constructor(scene: g.Scene) {
		this.scene = scene;

		this.center = {
			x: g.game.width/2,
			y: g.game.height/2
		};

		this.chessboardLayer = new g.E({
			scene: scene,
			parent: scene
		});

		this.infoLayer = new g.E({
			scene: scene,
			parent: scene
		});

		this.panelLayer = new g.E({
			scene: scene,
			parent: scene
		});

		this.chessboard = new ChessBoard(scene, this);
		
		this.nico = new Nico(scene, this);

		this.scene.message.add(ev => {
			this.chessboard.handleMesssge(ev);
		});
	}

	remake(): void {
		// this.chessboard.destroy();
		// this.chessboard = new ChessBoard(this.scene, this);
		this.chessboard.remake();
	}
}

export = GameCore;
