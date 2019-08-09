import { Race, RaceDesc } from "./race";
import { Color } from "./color";

export class BodyPart {
	race : RaceDesc;
	color : Color;
	
	constructor(race? : RaceDesc, color? : Color) {
		this.race  = race || Race.Human;
		this.color = color || Color.white;
	}
	
	static HasFur(race : RaceDesc) {
		return race.isRace(
			Race.Canine,
			Race.Feline,
			Race.Goat,
			Race.Sheep,
			Race.Musteline,
			Race.Rabbit)
			||
			race.isRaceNotParent(Race.Deer);
	}
	static HasScales(race : RaceDesc) {
		return race.isRace(Race.Reptile);
	}
	static HasSkin(race : RaceDesc) {
		return race.isRace(
			Race.Human,
			Race.Elf,
			Race.Demon,
			Race.Dryad);
	}

}

let BodyPartType = {
	cock   : 0,
	vagina : 1,
	ass    : 2,
	nipple : 3,
	mouth  : 4,
};

export { BodyPartType };
