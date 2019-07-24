/*
 * Describes a maze location. A maze consists of multiple maze rooms
 */

import { Event, MoveToLocation } from './event';
import { GetDEBUG } from '../app';
import { Images } from './assets';
import { Text } from './text';

function Maze(opts) {
	opts = opts || {};
	
	this.map = [];
	this.xMax = 0;
	this.yMax = 0;
}

Maze.prototype.AddRoom = function(x, y, room) {
	x = x || 0;
	y = y || 0;
	room = room || new Maze.Room();
	room.maze = this;
	room.x = x;
	room.y = y;
	
	if(this.xMax < x)
		this.xMax = x;
	if(this.yMax < y)
		this.yMax = y;
	
	if(_.isUndefined(this.map[x])) {
		this.map[x] = [];
	}
	this.map[x][y] = room;
}
Maze.prototype.GetRoom = function(x, y) {
	if(this.map[x])
		return this.map[x][y];
}
Maze.prototype.Print = function(room) {
	var maze = this;
	//TODO TEMP
	Text.Add("<table class='party'>");
	_.times(maze.yMax+1, function(y) {
		Text.Add("<tr>");
		_.times(maze.xMax+1, function(x) {
			Text.Add("<td>");
			var img = "";
			var r = maze.GetRoom(x, y);
			if(r == room) img = "Player";
			else if(r) img = "Room";
			Text.Add(img);
			Text.Add("</td>");
		});
		Text.Add("</tr>");
	});
	Text.Add("</table>");
	Text.Flush();
}

/*
 * Describes a maze room. A maze room is an event location, with special controls
 */
Maze.Room = function(nameFunc, opts) {
	opts = opts || {};
	Event.call(this, nameFunc, opts);
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

Maze.Room.prototype.PrintDesc = function() {
	Event.prototype.PrintDesc.call(this);
	
	if(GetDEBUG()) {
		this.maze.Print(this);
	}
}

export { Maze };
