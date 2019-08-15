import { Color } from "./color";
import { Race, RaceDesc } from "./race";

export class BodyPart {

	public static HasFur(race: RaceDesc) {
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
	public static HasScales(race: RaceDesc) {
		return race.isRace(Race.Reptile);
	}
	public static HasSkin(race: RaceDesc) {
		return race.isRace(
			Race.Human,
			Race.Elf,
			Race.Demon,
			Race.Dryad);
	}
	public race: RaceDesc;
	public color: Color;

	constructor(race?: RaceDesc, color?: Color) {
		this.race  = race || Race.Human;
		this.color = color || Color.white;
	}

	public Feathered() {
		return this.race.isRace(Race.Avian);
	}
}

export enum BodyPartType {
	cock   = 0,
	vagina = 1,
	ass    = 2,
	nipple = 3,
	mouth  = 4,
}
