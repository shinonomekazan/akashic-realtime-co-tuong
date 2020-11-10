import { Label } from "@akashic-extension/akashic-label";
import GameMode = require("./enum/GameMode");
import GameStatus = require("./enum/GameStatus");
import PlayerStatus = require("./enum/PlayerStatus");
import TeamType = require("./enum/TeamType");
import GameCore = require("./GameCore");
import Player = require("./Player");

class Nico {
	scene: g.Scene;
	gameCore: GameCore;
	gameMasterId: string;

	gameStatus: GameStatus;
	gameMode: GameMode;
	myPlayer: Player;

	players: {[key: string]: Player};
	playersID: string[];
	blackTeams: string[];
	redTeams: string[];

	currentTeamTurn: TeamType;
	currentPlayerTurn: string[];

	//
	leftLayout: g.E;
	rightLayout: g.E;

	gameStatusLabel: Label;
	playerStatusLabel: Label;
	currentTeamTurnLabel: Label;
	currentPlayerTurnLabel: Label;
	teamTypeLabel: Label;
	redTeamLabel: Label;
	blackTeamLabel: Label;
	infoLabel: Label;
	checkmateLabel: Label;
	gameModeLabel: Label;
	teamWinLabel: Label;

	closeButton: g.FilledRect;
	entryButton: g.FilledRect;
	remakeButton: g.FilledRect;
	changeButton: g.FilledRect;

	constructor(scene: g.Scene, gameCore: GameCore) {
		this.scene = scene;
		this.gameCore = gameCore;

		this.gameMode = GameMode.RealTime;

		this.createUI(scene, gameCore);

		this.onGameCreate();

		g.game.join.addOnce(e => {
			this.onGameMasterArrive(e.player.id);
		});

		this.scene.message.add(ev => {
			if (ev.data.message === "Entry") {
				this.onPlayerArrive(ev.player.id);
			}

			if (ev.data.message === "EntryClosed") {
				this.onGameStarted();
			}

			if (ev.data.message === "Remake") {
				this.onRemake();
			}

			if (ev.data.message === "ChangeMode") {
				if (this.gameMode !== GameMode.RealTime) {
					this.gameMode = GameMode.RealTime;
					this.gameModeLabel.text = "Game Mode: Realtime";
					this.gameModeLabel.invalidate();
				}
				else {
					this.gameMode = GameMode.Turn;
					this.gameModeLabel.text = "Game Mode: Turn";
					this.gameModeLabel.invalidate();
				}
			}
		});

		this.changeButton.pointUp.add(() => {
			g.game.raiseEvent(new g.MessageEvent({ message: "ChangeMode" }));
		});

		this.closeButton.pointUp.add(() => {
			if (this.playersID.length < 2) {
				alert("The game requires a minimum of 2 players to start !");
				return;
			}
			this.closeButton.remove();
			g.game.raiseEvent(new g.MessageEvent({ message: "EntryClosed" }));
		});

		this.entryButton.pointUp.add(() => {
			this.entryButton.remove();
			g.game.raiseEvent(new g.MessageEvent({ message: "Entry" }));
		});

		this.remakeButton.pointUp.add(() => {
			this.remakeButton.remove();
			g.game.raiseEvent(new g.MessageEvent({ message: "Remake" }));
		});
	}

	createUI(scene: g.Scene, gameCore: GameCore): void {
		let chessboard = gameCore.chessboard.chessboard;
		let width = (g.game.width - chessboard.width * chessboard.scaleX) / 2;

		this.leftLayout = new g.E({
			scene: scene,
			width: width,
			height: g.game.height,
			x: 0,
			y: 0,
			parent: gameCore.infoLayer
		});

		this.rightLayout = new g.E({
			scene: scene,
			width: width,
			height: g.game.height,
			x: g.game.width - width,
			y: 0,
			parent: gameCore.infoLayer
		});

		let dfont = new g.DynamicFont({
			game: scene.game,
			fontFamily: "monospace",
			size: 40,
		});

		this.gameStatusLabel = new Label({
			scene: scene,
			width: width - 16,
			font: dfont,
			fontSize: 14,
			text: "",
			x: 8,
			y: 32,
			parent: this.leftLayout
		});

		this.playerStatusLabel = new Label({
			scene: scene,
			width: width - 16,
			font: dfont,
			fontSize: 14,
			text: "",
			x: 8,
			y: 32,
			parent: this.rightLayout
		});

		this.teamTypeLabel = new Label({
			scene: scene,
			width: width - 16,
			font: dfont,
			fontSize: 14,
			text: "",
			x: 8,
			y: 64,
			parent: this.rightLayout
		});

		this.checkmateLabel = new Label({
			scene: scene,
			width: width - 16,
			font: dfont,
			fontSize: 14,
			text: "Checkmate",
			x: 8,
			y: 180,
			parent: this.rightLayout
		});

		this.teamWinLabel = new Label({
			scene: scene,
			width: width - 16,
			font: dfont,
			fontSize: 14,
			text: "",
			x: 8,
			y: g.game.height / 2,
			parent: this.rightLayout
		});

		this.currentTeamTurnLabel = new Label({
			scene: scene,
			width: width - 16,
			font: dfont,
			fontSize: 14,
			text: "",
			x: 8,
			y: g.game.height / 2 - 16,
			parent: this.rightLayout
		});

		this.currentPlayerTurnLabel = new Label({
			scene: scene,
			width: width - 16,
			font: dfont,
			fontSize: 14,
			text: "",
			x: 8,
			y: this.currentTeamTurnLabel.y + 32,
			parent: this.rightLayout
		});

		this.redTeamLabel = new Label({
			scene: scene,
			width: width - 16,
			font: dfont,
			fontSize: 14,
			text: "",
			x: 8,
			y: 160,
			parent: this.leftLayout
		});

		this.blackTeamLabel = new Label({
			scene: scene,
			width: width - 16,
			font: dfont,
			fontSize: 14,
			text: "",
			x: 8,
			y: 288,
			parent: this.leftLayout
		});

		this.gameModeLabel = new Label({
			scene: scene,
			width: width - 16,
			font: dfont,
			fontSize: 14,
			text: "Game Mode: Realtime",
			x: 8,
			y: g.game.height - 170,
			parent: this.leftLayout
		});

		this.changeButton = this.createButton({
			scene: scene,
			width: 60,
			height: 30,
			fontSize: 14,
			font: dfont,
			text: "Change",
			x: 200,
			y: g.game.height - 160
		});

		this.closeButton = this.createButton({
			scene: scene,
			font: dfont,
			text: "Close",
			x: this.rightLayout.width / 2,
			y: this.rightLayout.height - 120
		});

		this.entryButton = this.createButton({
			scene: scene,
			font: dfont,
			text: "Entry",
			x: this.rightLayout.width / 2,
			y: this.rightLayout.height - 120
		});

		this.remakeButton = this.createButton({
			scene: scene,
			font: dfont,
			text: "Remake",
			x: this.rightLayout.width / 2,
			y: this.rightLayout.height - 120
		});

		this.infoLabel = new Label({
			scene: scene,
			width: width - 16,
			font: dfont,
			fontSize: 12,
			text: "",
			x: 8,
			y: this.rightLayout.height - 80,
			parent: this.rightLayout
		});

	}

	createButton(params: {
		scene: g.Scene;
		width?: number;
		height?: number;
		x?: number;
		y?: number;
		font: g.Font;
		fontSize?: number;
		text?: string;
		color?: string;
		textColor?: string;
		parent?: g.E;
	}): g.FilledRect {

		params.width = params.width || 120;
		params.height = params.height || 40;
		params.fontSize = params.fontSize || 20;

		let button = new g.FilledRect({
			scene: params.scene,
			cssColor: params.color || "grey",
			width: params.width,
			height: params.height,
			x: params.x || 0,
			y: params.y || 0,
			anchorX: .5,
			anchorY: .5,
			touchable: true,
			local: true,
			parent: params.parent || null
		});

		new Label({
			scene: params.scene,
			width: params.width,
			height: params.height,
			font: params.font,
			fontSize: params.fontSize,
			text: params.text || "",
			textColor: params.textColor || "black",
			textAlign: g.TextAlign.Center,
			trimMarginTop: true,
			y: (params.height - params.fontSize) / 2,
			parent: button
		});

		return button;
	}

	onGameCreate(): void {
		console.log("onGameCreate");

		this.gameStatus = GameStatus.GameMasterWaiting;
		this.myPlayer = new Player(g.game.selfId, PlayerStatus.Watcher, -1);

		this.players = {};
		this.playersID = [];
		this.blackTeams = [];
		this.redTeams = [];

		this.currentTeamTurn = -1;
		this.currentPlayerTurn = [];

		this.gameStatusLabel.text = "Game Status: GameMasterWaiting";
		this.gameStatusLabel.invalidate();

		this.playerStatusLabel.text = "Player Status: Watcher";
		this.playerStatusLabel.invalidate();

		this.infoLabel.text = "Game Master Waiting !";
		this.infoLabel.invalidate();

		this.teamTypeLabel.text = "";
		this.teamTypeLabel.invalidate();

		this.teamWinLabel.text = "";
		this.teamWinLabel.invalidate();

		this.currentTeamTurnLabel.text = "";
		this.currentTeamTurnLabel.invalidate();

		this.currentPlayerTurnLabel.text = "";
		this.currentPlayerTurnLabel.invalidate();

		this.blackTeamLabel.text = "Black Teams: ";
		this.blackTeamLabel.invalidate();

		this.redTeamLabel.text = "Red Teams: ";
		this.redTeamLabel.invalidate();

		this.checkmateLabel.hide();
		this.gameModeLabel.hide();
	}

	checkChangeTurn(): boolean {
		return this.currentPlayerTurn.length === 0;
	}

	toggleTurn(): void {
		if (this.currentTeamTurn === TeamType.Red || this.currentTeamTurn === -1) {
			this.currentTeamTurn = TeamType.Black;

			this.currentTeamTurnLabel.text = "Team Turn: Black";
			this.currentTeamTurnLabel.invalidate();

			this.currentPlayerTurn = [];
			this.currentPlayerTurnLabel.text = "Player Turn: ";
			this.blackTeams.forEach((playerId) => {
				this.currentPlayerTurn.push(playerId);
				this.currentPlayerTurnLabel.text += "player" + playerId + ", "
			});
			this.currentPlayerTurnLabel.invalidate();
		}
		else {
			this.currentTeamTurn = TeamType.Red;

			this.currentTeamTurnLabel.text = "Team Turn: Red";
			this.currentTeamTurnLabel.invalidate();

			this.currentPlayerTurn = [];
			this.currentPlayerTurnLabel.text = "Player Turn: ";
			this.redTeams.forEach((playerId) => {
				this.currentPlayerTurn.push(playerId);
				this.currentPlayerTurnLabel.text += "player" + playerId + ", "
			});
			this.currentPlayerTurnLabel.invalidate();
		}
	}

	removePlayerTurn(playerId: string): void {
		let index: number;

		index = this.currentPlayerTurn.indexOf(playerId);
		if (index >= 0) {
			this.currentPlayerTurn.splice(index, 1);
		}

		index = this.currentPlayerTurnLabel.text.indexOf("player" + playerId);
		if (index >= 0) {
			let index2 = this.currentPlayerTurnLabel.text.indexOf(",", index);
			this.currentPlayerTurnLabel.text = this.currentPlayerTurnLabel.text.substring(0, index)
			+ this.currentPlayerTurnLabel.text.substring(index2 + 2);
			this.currentPlayerTurnLabel.invalidate();
		}
	}

	onGameMasterArrive(gameMasterId: string): void {
		console.log("onGameMasterArrive " + gameMasterId);
		this.gameMasterId = gameMasterId;

		this.gameStatus = GameStatus.Initializing;
		this.gameStatusLabel.text = "Game Status: Initializing";
		this.gameStatusLabel.invalidate();

		this.gameModeLabel.show();

		if (this.gameMasterId === this.myPlayer.id) {
			this.rightLayout.append(this.closeButton);
			this.leftLayout.append(this.changeButton);
		  	this.infoLabel.text =
			"You joined first. You are a broadcaster\nYou can close the reception of participants";
			this.infoLabel.invalidate();
		} else {
			this.rightLayout.append(this.entryButton);
			this.infoLabel.text = "You are a viewer You can participate in the game.";
			this.infoLabel.invalidate();
		}

		this.onPlayerArrive(gameMasterId);
	}

	onPlayerArrive(playerId: string): void {
		console.log("onPlayerArrive " + playerId);

		if (this.playersID.indexOf(playerId) < 0) {
			this.playersID.push(playerId);
			let playerStatus = playerId === this.gameMasterId ? PlayerStatus.Master : PlayerStatus.Player;
			let teamType = this.playersID.length % 2 === 1 ? TeamType.Black : TeamType.Red;
			let player = new Player(playerId, playerStatus, teamType)
			this.players[playerId] = player;
			
			if (teamType === TeamType.Black) {
				this.blackTeams.push(playerId);
			}
			else {
				this.redTeams.push(playerId);
			}

			let teamLabel = teamType === TeamType.Black ? this.blackTeamLabel : this.redTeamLabel;
			teamLabel.text += "player" + playerId + ", ";
			teamLabel.invalidate();

			if (playerId === this.myPlayer.id) {
				this.myPlayer = player;

				if (playerId === this.gameMasterId) {
					this.playerStatusLabel.text = "Player Status: Master";
					this.playerStatusLabel.invalidate();
				} else {
					this.playerStatusLabel.text = "Player Status: Player";
					this.playerStatusLabel.invalidate();

					this.infoLabel.text = "You participated.\nWaiting for broadcasters to close";
					this.infoLabel.invalidate();
				}

				this.teamTypeLabel.text = "My Team: " + (teamType === TeamType.Black ? "Black" : "Red");
				this.teamTypeLabel.invalidate();

				this.gameCore.chessboard.flip();
			}
		}
	}

	onGameStarted(): void {
		console.log("onGameStarted");
		this.gameStatus = GameStatus.Playing;
		this.toggleTurn();

		this.gameStatusLabel.text = "Game Status: Playing";
		this.gameStatusLabel.invalidate();

		this.infoLabel.text = "Game started !";
		this.infoLabel.invalidate();

		if (this.gameMode === GameMode.RealTime) {
			this.currentTeamTurnLabel.hide();
			this.currentPlayerTurnLabel.hide();
		}
		else {
			this.currentTeamTurnLabel.show();
			this.currentPlayerTurnLabel.show();
		}

		if (this.closeButton.parent) this.closeButton.remove();
		if (this.entryButton.parent) this.entryButton.remove();
		if (this.changeButton.parent) this.changeButton.remove();
	}

	onGameEnded(teamType: TeamType): void {
		console.log("onGameEnded");

		this.gameStatus = GameStatus.Ended;
		this.gameStatusLabel.text = "Game Status: Ended";
		this.gameStatusLabel.invalidate();

		this.currentTeamTurnLabel.text = "";
		this.currentTeamTurnLabel.invalidate();

		this.currentPlayerTurnLabel.text = "";
		this.currentPlayerTurnLabel.invalidate();

		this.teamWinLabel.text = "Team Win: " + (teamType === TeamType.Black ? "Black" : "Red");
		this.teamWinLabel.invalidate();

		this.infoLabel.text = "Game ended !";
		this.infoLabel.invalidate();

		this.checkmateLabel.hide();

		if (g.game.selfId === this.gameMasterId) {
			this.rightLayout.append(this.remakeButton);
		}
	}

	onRemake(): void {
		console.log("onRemake");

		this.onGameCreate();
		this.onGameMasterArrive(this.gameMasterId);
		this.gameCore.remake();
	}
}

export = Nico;
