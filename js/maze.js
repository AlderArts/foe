/*
 * Describes a maze location. A maze consists of multiple maze rooms
 */

function Maze(opts) {
	opts = opts || {};
	
	this.map = [];
}

Maze.prototype.AddRoom = function(room, x, y) {
	room = room || new Maze.Room({maze: this, x: x, y: y});
	x = x || 0;
	y = y || 0;
	
	if(_.isUndefined(this.map[x])) {
		this.map[x] = [];
	}
	this.map[x][y] = room;
}
Maze.prototype.GetRoom = function(x, y) {
	if(this.map[x])
		return this.map[x][y];
}

/*
 * Describes a maze room. A maze room is an event location, with special controls
 */
Maze.Room = function(opts) {
	Event.call(this);
	
	opts = opts || {};
	this.maze = opts.maze;
	this.x = opts.x;
	this.y = opts.y;
}
Maze.Room.prototype = new Event();
Maze.Room.prototype.constructor = Maze.Room;

Maze.Room.prototype.SetButtons = function(links) {
	//Set up regular events
	Event.prototype.SetButtons.call(this, links);
	
	var north = this.maze.GetRoom(this.x, this.y-1);
	var west  = this.maze.GetRoom(this.x-1, this.y);
	var south = this.maze.GetRoom(this.x, this.y+1);
	var east  = this.maze.GetRoom(this.x+1, this.y);
	
	//Set up special interface
	Input.buttons[5].enabledImage = Images.imgButtonEnabled2;
	Input.buttons[5].Setup("North", MoveToLocation, north, north, null, GameState.Event);
	
	Input.buttons[8].enabledImage = Images.imgButtonEnabled2;
	Input.buttons[8].Setup("West", MoveToLocation, west, west, null, GameState.Event);
	
	Input.buttons[9].enabledImage = Images.imgButtonEnabled2;
	Input.buttons[9].Setup("South", MoveToLocation, south, south, null, GameState.Event);
	
	Input.buttons[10].enabledImage = Images.imgButtonEnabled2;
	Input.buttons[10].Setup("East", MoveToLocation, east, east, null, GameState.Event);
}
