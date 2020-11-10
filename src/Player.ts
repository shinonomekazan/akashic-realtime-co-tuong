import PlayerStatus = require("./enum/PlayerStatus");
import TeamType = require("./enum/TeamType");

class Player {
	id: string;
	status: PlayerStatus;
	teamType: TeamType;

	constructor(id: string, status: PlayerStatus, teamType: TeamType) {
		this.id = id;
		this.status = status;
		this.teamType = teamType;
	}
}

export = Player;
