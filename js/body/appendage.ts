
import { IStorage } from "../istorage";
import { Text } from "../text";
import { BodyPart } from "./bodypart";
import { Color } from "./color";
import { Race, RaceDesc } from "./race";

export enum AppendageType {
	horn    = 0,
	antenna = 1,
	tail    = 2,
	wing    = 3,
	abdomen = 4,
}

export class Appendage extends BodyPart {
	public type: AppendageType;
	public count: number;

	constructor(type?: AppendageType, race?: RaceDesc, color?: Color, count?: number) {
		super(race, color);
		this.type  = type || AppendageType.horn;
		this.count = count || 1;
	}

	public ToStorage() {
		const storage = {
			col   : this.color.toFixed(),
			count : this.count.toFixed(),
			race  : this.race.id.toFixed(),
			type  : this.type.toFixed(),
		};
		return storage;
	}

	public FromStorage(storage: IStorage) {
		storage = storage || {};
		this.race   = RaceDesc.IdToRace[parseInt(storage.race, 10)] || this.race;
		this.color  = parseInt(storage.col, 10)    || this.color;
		this.type   = parseInt(storage.type, 10)   || this.type;
		this.count  = parseInt(storage.count, 10)  || this.count;
	}

	public Short() {
		let noun;
		if (this.count > 1) {
			if     (this.type === AppendageType.horn) {
				if (this.race.isRace(Race.Deer)) {
					noun = "antlers";
				} else {
					noun = "horns";
				}
			} else if (this.type === AppendageType.antenna) { noun = "antennas"; } else if (this.type === AppendageType.tail) {    noun = "tails"; } else if (this.type === AppendageType.wing) {    noun = "wings"; } else if (this.type === AppendageType.abdomen) { noun = "abdomen"; }
		} else {
			if     (this.type === AppendageType.horn) {
				if (this.race.isRace(Race.Deer)) {
					noun = "antler";
				} else {
					noun = "horn";
				}
			} else if (this.type === AppendageType.antenna) { noun = "antenna"; } else if (this.type === AppendageType.tail) {    noun = "tail"; } else if (this.type === AppendageType.wing) {    noun = "wing"; } else if (this.type === AppendageType.abdomen) { noun = "abdomen"; }
		}
		return noun;
	}
	// Is the appendage prehensile or not?
	public Prehensile() {
		if (this.type === AppendageType.tail) {
			if (this.race.isRace(Race.Reptile)) { return true; }
			if (this.race.isRace(Race.Demon)) { return true; }
		}
		return false;
	}

	public Long() {
		const count = Text.Quantify(this.count);
		const desc = this.race.qShort();
		if     (this.type === AppendageType.horn) {
			switch (this.race.id) {
				case Race.Deer.id: return count + " of antlers";
				default: return count + " of " + desc + " horns";
			}
		} else if (this.type === AppendageType.antenna) {
			switch (this.race.id) {
				case Race.Moth.id:   return count + " moth-like antenna";
				default: return count + " of strange antenna";
			}
		} else if (this.type === AppendageType.tail) {
			switch (this.race.id) {
				case Race.Avian.id:  return "tail feathers";
				case Race.Scorpion.id: return "segmented tail, with a stinger";
				default: return desc + " tail";
			}
		} else if (this.type === AppendageType.wing) {
			return count + " of " + desc + " wings";
		} else if (this.type === AppendageType.abdomen) {
			return desc + " abdomen";
		} else { return "strange growth"; }
	}

}
