/*
 * Describes a maze location. A maze consists of multiple maze rooms
 */
import * as _ from "lodash";

import { GetDEBUG } from "../app";
import { Images } from "./assets";
import { Event } from "./event";
import { MoveToLocation } from "./GAME";
import { GameState } from "./gamestate";
import { Input } from "./input";
import { Text } from "./text";

export class Maze {
	public map: any[];
	public xMax: number;
	public yMax: number;

	constructor(opts?: any) {
		opts = opts || {};

		this.map = [];
		this.xMax = 0;
		this.yMax = 0;
	}

	public AddRoom(x: number, y: number, room?: MazeRoom) {
		x = x || 0;
		y = y || 0;
		room = room || new MazeRoom();
		room.maze = this;
		room.x = x;
		room.y = y;

		if (this.xMax < x) {
			this.xMax = x;
		}
		if (this.yMax < y) {
			this.yMax = y;
		}

		if (_.isUndefined(this.map[x])) {
			this.map[x] = [];
		}
		this.map[x][y] = room;
	}
	public GetRoom(x: number, y: number): MazeRoom {
		if (this.map[x]) {
			return this.map[x][y];
		}
	}
	public Print(room: MazeRoom) {
		const maze = this;
		// TODO TEMP
		Text.Add("<table class='party'>");
		_.times(maze.yMax + 1, (y) => {
			Text.Add("<tr>");
			_.times(maze.xMax + 1, (x) => {
				Text.Add("<td>");
				let img = "";
				const r = maze.GetRoom(x, y);
				if (r === room) {
					img = "Player";
				} else if (r) {
					img = "Room";
				}
				Text.Add(img);
				Text.Add("</td>");
			});
			Text.Add("</tr>");
		});
		Text.Add("</table>");
		Text.Flush();
	}

}

/*
* Describes a maze room. A maze room is an event location, with special controls
*/
export class MazeRoom extends Event {
	public maze: Maze;
	public x: number;
	public y: number;

	constructor(nameFunc?: CallableFunction, opts?: any) {
		super(nameFunc, opts);
	}

	public SetButtons(links: any) {
		// Set up regular events
		super.SetButtons(links);

		const north = this.maze.GetRoom(this.x, this.y - 1);
		const west  = this.maze.GetRoom(this.x - 1, this.y);
		const south = this.maze.GetRoom(this.x, this.y + 1);
		const east  = this.maze.GetRoom(this.x + 1, this.y);

		// Set up special interface
		Input.buttons[5].enabledImage = Images.imgButtonEnabled2;
		Input.buttons[5].Setup("North", MoveToLocation, north !== undefined, north, undefined, GameState.Event);

		Input.buttons[8].enabledImage = Images.imgButtonEnabled2;
		Input.buttons[8].Setup("West", MoveToLocation, west !== undefined, west, undefined, GameState.Event);

		Input.buttons[9].enabledImage = Images.imgButtonEnabled2;
		Input.buttons[9].Setup("South", MoveToLocation, south !== undefined, south, undefined, GameState.Event);

		Input.buttons[10].enabledImage = Images.imgButtonEnabled2;
		Input.buttons[10].Setup("East", MoveToLocation, east !== undefined, east, undefined, GameState.Event);
	}

	public PrintDesc() {
		super.PrintDesc();

		if (GetDEBUG()) {
			this.maze.Print(this);
		}
	}
}
