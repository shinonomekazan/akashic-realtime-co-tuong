import TeamType = require("./enum/TeamType");
import Piece = require("./Piece");

class Team {
    teamType: TeamType;
    lastPieceMove: Piece;
    general: Piece;

    constructor(teamType: TeamType) {
        this.teamType = teamType;
        this.lastPieceMove = null;
    }
}

export = Team;