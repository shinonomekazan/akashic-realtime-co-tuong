import Piece = require("../Piece");
import Index = require("./Index");
import Point = require("./Point");

interface Cell {
	index: Index;
	point: Point;
	piece: Piece;
}

export = Cell;
