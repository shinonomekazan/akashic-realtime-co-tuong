import PieceType = require("./enum/PieceType");
import TeamType = require("./enum/TeamType");
import GameCore = require("./GameCore");
import Cell = require("./interface/Cell");
import Point = require("./interface/Point");
import Size = require("./interface/Size");
import Piece = require("./Piece");
import Rules = require("./Rules");
import Team = require("./Team");
import ViewManager = require("./ViewManager");

class ChessBoard {

	readonly lengthX = 9;
	readonly lengthY = 10;

	readonly cellStart: Point = {x: 66, y: 61};
	readonly cellSize: Size = {width: 77.5, height: 80};

	scene: g.Scene;
	gameCore: GameCore;

	chessboard: g.Sprite;
	pieceLayer: g.E;
	moveLayer: g.E;

	cells: Cell[][];
	pieces: Piece[];

	redTeam: Team;
	blackTeam: Team;

	pieceShowMove: Piece;
	lastPieceMove: Piece;

	constructor(scene: g.Scene, gameCore: GameCore) {
		this.scene = scene;
		this.gameCore = gameCore;

		this.chessboard = ViewManager.createChessBoard(this.scene, this.gameCore);
		this.createLayer();
		this.createCells();
		// this.TestCells();
		this.createPieces();
	}

	createLayer(): void {
		this.pieceLayer = new g.E({
			scene: this.scene,
			local: true,
			parent: this.chessboard
		});

		this.moveLayer = new g.E({
			scene: this.scene,
			local: true,
			parent: this.chessboard
		});
	}

	createCells(): void {
		this.cells = [];
		for (let i = 0; i < this.lengthY; i++) {
			this.cells.push([]);

			for (let j = 0; j < this.lengthX; j++) {
				this.cells[i].push({
					index: {
						i: i,
						j: j
					},
					point: {
						x: this.cellStart.x + j * this.cellSize.width,
						y: this.cellStart.y + i * this.cellSize.height
					},
					piece: null
				});
			}
		}
	}

	testCells(): void {
		for (let i = 0; i < this.lengthY; i++) {
			for (let j = 0; j < this.lengthX; j++) {
				new g.FilledRect({
					scene: this.scene,
					cssColor: "black",
					width: 10,
					height: 10,
					x: this.cells[i][j].point.x,
					y: this.cells[i][j].point.y,
					local: true,
					parent: this.chessboard
				});
			}
		}
	}

	createPieces(): void {
		let chessBoard = this;
		let scene = this.scene;
		let gameCore = this.gameCore;

		this.pieces = [];
		this.redTeam = new Team(TeamType.Red);
		this.blackTeam = new Team(TeamType.Black);
		this.pieceShowMove = null;
		this.lastPieceMove = null;

		// red team
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][0],
			type: PieceType.Chariot,
			teamType: TeamType.Red,
			team: this.redTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][8],
			type: PieceType.Chariot,
			teamType: TeamType.Red,
			team: this.redTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][1],
			type: PieceType.Horse,
			teamType: TeamType.Red,
			team: this.redTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][7],
			type: PieceType.Horse,
			teamType: TeamType.Red,
			team: this.redTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][2],
			type: PieceType.Elephant,
			teamType: TeamType.Red,
			team: this.redTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][6],
			type: PieceType.Elephant,
			teamType: TeamType.Red,
			team: this.redTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][3],
			type: PieceType.Advisor,
			teamType: TeamType.Red,
			team: this.redTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][5],
			type: PieceType.Advisor,
			teamType: TeamType.Red,
			team: this.redTeam
		}));
		this.pieces.push(this.redTeam.general = new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][4],
			type: PieceType.General,
			teamType: TeamType.Red,
			team: this.redTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[2][1],
			type: PieceType.Cannon,
			teamType: TeamType.Red,
			team: this.redTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[2][7],
			type: PieceType.Cannon,
			teamType: TeamType.Red,
			team: this.redTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[3][0],
			type: PieceType.Soldier,
			teamType: TeamType.Red,
			team: this.redTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[3][8],
			type: PieceType.Soldier,
			teamType: TeamType.Red,
			team: this.redTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[3][2],
			type: PieceType.Soldier,
			teamType: TeamType.Red,
			team: this.redTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[3][6],
			type: PieceType.Soldier,
			teamType: TeamType.Red,
			team: this.redTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[3][4],
			type: PieceType.Soldier,
			teamType: TeamType.Red,
			team: this.redTeam
		}));

		// black team
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][0],
			type: PieceType.Chariot,
			teamType: TeamType.Black,
			team: this.blackTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][8],
			type: PieceType.Chariot,
			teamType: TeamType.Black,
			team: this.blackTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][1],
			type: PieceType.Horse,
			teamType: TeamType.Black,
			team: this.blackTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][7],
			type: PieceType.Horse,
			teamType: TeamType.Black,
			team: this.blackTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][2],
			type: PieceType.Elephant,
			teamType: TeamType.Black,
			team: this.blackTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][6],
			type: PieceType.Elephant,
			teamType: TeamType.Black,
			team: this.blackTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][3],
			type: PieceType.Advisor,
			teamType: TeamType.Black,
			team: this.blackTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][5],
			type: PieceType.Advisor,
			teamType: TeamType.Black,
			team: this.blackTeam
		}));
		this.pieces.push(this.blackTeam.general = new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][4],
			type: PieceType.General,
			teamType: TeamType.Black,
			team: this.blackTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[7][1],
			type: PieceType.Cannon,
			teamType: TeamType.Black,
			team: this.blackTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[7][7],
			type: PieceType.Cannon,
			teamType: TeamType.Black,
			team: this.blackTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[6][0],
			type: PieceType.Soldier,
			teamType: TeamType.Black,
			team: this.blackTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[6][8],
			type: PieceType.Soldier,
			teamType: TeamType.Black,
			team: this.blackTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[6][2],
			type: PieceType.Soldier,
			teamType: TeamType.Black,
			team: this.blackTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[6][6],
			type: PieceType.Soldier,
			teamType: TeamType.Black,
			team: this.blackTeam
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[6][4],
			type: PieceType.Soldier,
			teamType: TeamType.Black,
			team: this.blackTeam
		}));
	}

	handleMesssge(ev: g.MessageEvent): void {
		let playerId = ev.player.id;
		let playerName = "player" + playerId;

		if (ev.data.message === "PieceMove") {
			let fromCell: Cell;
			let toCell: Cell;

			try {
				fromCell = this.cells[ev.data.fromCell.i][ev.data.fromCell.j];
				toCell = this.cells[ev.data.toCell.i][ev.data.toCell.j];
			}
			catch(ex) {
				fromCell = toCell = null;
			}
			
			if (!fromCell || !toCell || !fromCell.piece || !fromCell.piece.moveTo(toCell, playerId)) 
				console.log(playerName + " hacking");
		}
	}

	createMove(piece: Piece, cell: Cell): void {
		let move = ViewManager.createMove(this.scene, this.moveLayer, cell);

		move.pointUp.add((event: g.PointUpEvent) => {
			this.clearMove();

			g.game.raiseEvent(new g.MessageEvent({
				message: "PieceMove",
				fromCell: piece.cell.index,
				toCell: cell.index
			}));

			// test hack
			// g.game.raiseEvent(new g.MessageEvent({
			// 	message: "PieceMove",
			// 	fromCell: {i: 0, j: 0},
			// 	toCell: {i: 9, j: 8}
			// }));
		});
	}

	clearMove(): void {
		if (this.pieceShowMove) {
			if (this.pieceShowMove !== this.lastPieceMove) this.pieceShowMove.hideHighlight();
			this.pieceShowMove = null;
		}
		
		if (!!this.moveLayer.children) {
			let i = this.moveLayer.children.length;
			while (i--) {
				this.moveLayer.children[i].destroy();
			}
		}
	}

	checkmate(teamType: TeamType): boolean {
		let general = teamType === TeamType.Red ? this.redTeam.general : this.blackTeam.general;
		for (let i = 0; i < this.pieces.length; i++) {
			let piece = this.pieces[i];
			if (piece.teamType !== teamType) {
				if (Rules.findMove(piece, general.cell).length > 0) return true;
			}
		}
		return false;
	}

	flip(): void {
		let teamType = this.gameCore.nico.myPlayer.teamType;
		this.chessboard.angle = teamType === TeamType.Black ? 0 : 180;
		this.chessboard.modified();
	}

	destroy(): void {
		if (this.chessboard.destroyed()) return;
		this.chessboard.destroy();

		this.pieces = [];
		this.cells = [];
	}

	remake(): void {
		for (let i = 0; i < this.lengthY; i++) {
			for (let j = 0; j < this.lengthX; j++) {
				this.cells[i][j].piece = null;
			}
		}

		this.chessboard.angle = 0;
		this.chessboard.modified();

		this.pieceLayer.destroy();
		this.moveLayer.destroy();
		this.createLayer();
		this.createPieces();
	}
}

export = ChessBoard;
