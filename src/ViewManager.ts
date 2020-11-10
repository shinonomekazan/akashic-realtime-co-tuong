import HighlightType = require("./enum/HighlightType");
import PieceType = require("./enum/PieceType");
import TeamType = require("./enum/TeamType");
import GameCore = require("./GameCore");
import Cell = require("./interface/Cell");
import Piece = require("./Piece");

class ViewManager {

	//
	static createChessBoard(scene: g.Scene, gameCore: GameCore): g.Sprite {
		const img = scene.assets.chessboard as g.ImageAsset;
		const scale = Math.min(g.game.width / img.width, g.game.height / img.height);

		return (new g.Sprite({
			scene: scene,
			src: img,
			width: img.width,
			height: img.height,
			anchorX: .5,
			anchorY: .5,
			scaleX: scale,
			scaleY: scale,
			x: gameCore.center.x,
			y: gameCore.center.y,
			local: true,
			parent: gameCore.chessboardLayer
		}));
	}

	static createPiece(piece: Piece): g.Sprite {
		const img = piece.scene.assets[this.getPieceAssetsID(piece.type, piece.teamType)] as g.ImageAsset;

		return (new g.Sprite({
			scene: piece.scene,
			src: img,
			width: img.width,
			height: img.height,
			anchorX: .5,
			anchorY: .5,
			x: piece.cell.point.x,
			y: piece.cell.point.y,
			touchable: true,
			local: true,
			parent: piece.chessBoard.pieceLayer
		}));
	}

	static createMove(scene: g.Scene, parent: g.E, cell: Cell): g.Sprite {
		let img = scene.assets[!cell.piece ? "move0" : "move1"] as g.ImageAsset;

		return (new g.Sprite({
			scene: scene,
			src: img,
			width: img.width,
			height: img.height,
			opacity: .5,
			anchorX: .5,
			anchorY: .5,
			x: cell.point.x,
			y: cell.point.y,
			touchable: true,
			local: true,
			parent: parent
		}));
	}

	static createHighlight(piece: Piece, highlightType: HighlightType): g.Sprite {
		let id = highlightType === HighlightType.Slected ? "highlight" 
				: highlightType === HighlightType.Move ? "move0" : "move1";
		let img = piece.scene.assets[id] as g.ImageAsset;

		return (new g.Sprite({
			scene: piece.scene,
			src: img,
			width: img.width,
			height: img.height,
			opacity: .3,
			x: 0,
			y: 0,
			local: true,
			parent: piece.sprite
		}));
	}

	//
	static getPieceAssetsID(pieceType: PieceType, teamType: TeamType): string {
		let color: string = teamType === TeamType.Black ? "black" : "red";
		switch (pieceType) {
			case PieceType.Advisor:
				return color + "_advisor";

			case PieceType.Cannon:
				return color + "_cannon";

			case PieceType.Chariot:
				return color + "_chariot";

			case PieceType.Elephant:
				return color + "_elephant";

			case PieceType.General:
				return color + "_general";

			case PieceType.Horse:
				return color + "_horse";

			case PieceType.Soldier:
				return color + "_soldier";
		}
	}
}

export = ViewManager;
