import ChessBoard = require("./ChessBoard");
import GameMode = require("./enum/GameMode");
import GameStatus = require("./enum/GameStatus");
import HighlightType = require("./enum/HighlightType");
import PieceType = require("./enum/PieceType");
import TeamType = require("./enum/TeamType");
import GameCore = require("./GameCore");
import Cell = require("./interface/Cell");
import Rules = require("./Rules");
import Team = require("./Team");
import ViewManager = require("./ViewManager");

interface Props {
	cell: Cell;
	type: PieceType;
	teamType: TeamType;
	team: Team;
}

class Piece {

	scene: g.Scene;
	gameCore: GameCore;
	chessBoard: ChessBoard;

	cell: Cell;
	type: PieceType;
	teamType: TeamType;
	team: Team;
	otherTeam: Team;

	sprite: g.Sprite;
	highlight: g.Sprite;

	constructor(scene: g.Scene, gameCore: GameCore, chessBoard: ChessBoard, props: Props) {
		this.scene = scene;
		this.gameCore = gameCore;
		this.chessBoard = chessBoard;

		this.cell = props.cell;
		this.type = props.type;
		this.teamType = props.teamType;
		this.team = props.team;

		this.otherTeam = this.teamType === TeamType.Black ? this.chessBoard.redTeam : this.chessBoard.blackTeam;

		this.cell.piece = this;

		this.sprite = ViewManager.createPiece(this);

		this.sprite.pointUp.add((event: g.PointUpEvent) => {
			let playerId = event.player.id;
			this.showMove(playerId);
		});
	}

	showHighlight(highlightType: HighlightType): void {
		if (!this.highlight) this.highlight = ViewManager.createHighlight(this, highlightType);
	}

	hideHighlight(): void {
		if (!!this.highlight) {
			if (!this.highlight.destroyed()) this.highlight.destroy();
			this.highlight = undefined;
		}
	}

	checkMove(playerId: string): boolean {
		let nico = this.gameCore.nico;
		if (nico.gameStatus !== GameStatus.Playing) return false;
		if (!nico.players[playerId] || nico.players[playerId].teamType !== this.teamType) return false;

		if (nico.gameMode === GameMode.RealTime) {
			if (this.team.lastPieceMove === this) return false;
		}
		else {
			if (this.chessBoard.lastPieceMove === this) return false;
			if (nico.currentPlayerTurn.indexOf(playerId) < 0) return false;
		}

		return true;
	}

	showMove(playerId: string): void {
		if (this.chessBoard.pieceShowMove === this || !this.checkMove(playerId)) return;

		(this.scene.assets.se as g.AudioAsset).play();

		this.chessBoard.clearMove();
		this.chessBoard.pieceShowMove = this;
		this.showHighlight(HighlightType.Slected);

		let cells = Rules.findMove(this);
		cells.forEach((cell) => {
			this.chessBoard.createMove(this, cell);
		});
	}

	moveTo(cell: Cell, playerId: string): boolean {
		if (!this.checkMove(playerId)) return false;
		if (Rules.findMove(this, cell).length === 0) return false;

		console.log("player " + playerId + " move piece");
		
		if((this.chessBoard.pieceShowMove === this) || (cell.piece && this.chessBoard.pieceShowMove === cell.piece)) {
			this.chessBoard.clearMove();
		}

		if (this.gameCore.nico.gameMode === GameMode.RealTime) {
			if (this.team.lastPieceMove) this.team.lastPieceMove.hideHighlight();
			this.team.lastPieceMove = this;
			this.showHighlight(!cell.piece ? HighlightType.Move : HighlightType.Eat);
		}
		else {
			if (this.chessBoard.lastPieceMove) this.chessBoard.lastPieceMove.hideHighlight();
			this.chessBoard.lastPieceMove = this;
			this.showHighlight(!cell.piece ? HighlightType.Move : HighlightType.Eat);

			this.gameCore.nico.removePlayerTurn(playerId);
			if (this.gameCore.nico.checkChangeTurn()) {
				this.gameCore.nico.toggleTurn();
			}
		}
		
		if (cell.piece) {
			if (cell.piece.type === PieceType.General) {
				this.gameCore.nico.onGameEnded(this.teamType);
			}

			cell.piece.destroy();
		}

		//
		let piece = this;
		piece.sprite.x = cell.point.x;
		piece.sprite.y = cell.point.y;
		piece.sprite.modified();

		piece.cell.piece = null;
		cell.piece = piece;
		piece.cell = cell;
		
		if (this.gameCore.nico.gameStatus !== GameStatus.Ended) {
			let checkmateBlack = this.chessBoard.checkmate(TeamType.Black);
			let checkmateRed = this.chessBoard.checkmate(TeamType.Red);
			if (checkmateBlack || checkmateRed) {
				console.log("Checkmate");
				this.gameCore.nico.checkmateLabel.show();
			}
			else {
				this.gameCore.nico.checkmateLabel.hide();
			}
		}

		return true;
	}

	destroy(): void {
		if (this.sprite.destroyed()) return;
		this.sprite.destroy();

		let index = this.chessBoard.pieces.indexOf(this);
		if (index >= 0) this.chessBoard.pieces.splice(index, 1);
	}

}

export = Piece;
