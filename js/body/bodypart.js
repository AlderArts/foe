import { Race } from "./race";
import { Color } from "./color";

function BodyPart(race, color) {
	this.race  = race || Race.Human;
	this.color = color || Color.white;
}

BodyPart.HasFur = function(race) {
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
BodyPart.HasScales = function(race) {
	return race.isRace(Race.Reptile);
}
BodyPart.HasSkin = function(race) {
	return race.isRace(
		Race.Human,
		Race.Elf,
		Race.Demon,
		Race.Dryad);
}

let BodyPartType = {
	cock   : 0,
	vagina : 1,
	ass    : 2,
	nipple : 3,
	mouth  : 4
};

export {BodyPart, BodyPartType};
