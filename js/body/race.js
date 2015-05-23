
Race = {
	human    : 0,
	horse    : 1,
	cat      : 2,
	dog      : 3,
	fox      : 4,
	lizard   : 5,
	rabbit   : 6,
	demon    : 7,
	dragon   : 8,
	dryad    : 9,
	elf      : 10,
	satyr    : 11,
	sheep    : 12,
	goat     : 13,
	cow      : 14,
	wolf     : 15,
	avian    : 16,
	moth     : 17,
	scorpion : 18,
	ferret   : 19,
	plant    : 20,
	snake    : 21,
	goo      : 22,
	insect   : 23,
	jackal   : 24,
	
	// TODO: Keep updated!
	numRaces : 25
}
Race.Desc = function(race) {
	var r;
	switch(race) {
	case Race.human: return "human";
	case Race.horse: r = Rand(2);
		if(r == 0) return "horse";
		else       return "equine";
	case Race.cat: r = Rand(2);
		if(r == 0) return "cat";
		else       return "feline";
	case Race.dog: r = Rand(2);
		if(r == 0) return "dog";
		else       return "canine";
	case Race.fox: r = Rand(3);
		if     (r == 0) return "fox";
		else if(r == 1) return "fennec";
		else            return "vulpine";
	case Race.lizard: return "lizard";
	case Race.rabbit: r = Rand(3);
		if     (r == 0) return "rabbit";
		else if(r == 1) return "lapine";
		else            return "lagomorph";
	case Race.demon: return "demon";
	case Race.dragon: return "dragon";
	case Race.dryad: r = Rand(2);
		if(r == 0) return "dryad";
		else       return "fawn";
	case Race.satyr: r = Rand(2);
		if(r == 0) return "satyr";
		else       return "faun";
	case Race.elf: return "elf";
	case Race.sheep: r = Rand(2);
		if(r == 0) return "sheep";
		else       return "ovine";
	case Race.goat:  return "goat";
	case Race.cow: r = Rand(2);
		if(r == 0) return "cow";
		else       return "bovine";
	case Race.wolf: r = Rand(2);
		if(r == 0) return "wolf";
		else       return "lupine";
	case Race.avian: r = Rand(2);
		if(r == 0) return "avian";
		else       return "bird";
	case Race.moth: return "moth";
	case Race.scorpion: return "scorpion";
	case Race.ferret: return "ferret";
	case Race.plant: return "plant";
	case Race.snake: r = Rand(2);
		if(r == 0) return "snake";
		else       return "naga";
	case Race.goo: return "goo";
	case Race.insect: return "insect";
	case Race.jackal: return "jackal";
	default: return "undefined";
	}
}

Race.Quantifier = function(race) {
	var r;
	switch(race) {
	case Race.human: return "a human";
	case Race.horse: r = Rand(2);
		if(r == 0) return "a horse";
		else       return "an equine";
	case Race.cat: r = Rand(2);
		if(r == 0) return "a cat";
		else       return "a feline";
	case Race.dog: r = Rand(2);
		if(r == 0) return "a dog";
		else       return "a canine";
	case Race.fox: r = Rand(3);
		if     (r == 0) return "a fox";
		else if(r == 1) return "a fennec";
		else            return "a vulpine";
	case Race.lizard: return "a lizard";
	case Race.rabbit: r = Rand(3);
		if     (r == 0) return "a rabbit";
		else if(r == 1) return "a lapine";
		else            return "a lagomorph";
	case Race.demon: r = Rand(2);
		if     (r == 0) return "a demon";
		else if(r == 1) return "a hellish";
		else            return "an infernal";
	case Race.dragon: r = Rand(2);
		if(r == 0) return "a dragon";
		else       return "a draconian";
	case Race.dryad: r = Rand(2);
		if(r == 0) return "a dryad";
		else       return "a fawn";
	case Race.satyr: r = Rand(2);
		if(r == 0) return "a satyr";
		else       return "a faun";
	case Race.elf: r = Rand(2);
		if(r == 0) return "an elf";
		else       return "an elfin";
	case Race.sheep: r = Rand(2);
		if(r == 0) return "a sheep";
		else       return "an ovine";
	case Race.goat:  return "a goat";
	case Race.cow: r = Rand(2);
		if(r == 0) return "a cow";
		else       return "a bovine";
	case Race.wolf: r = Rand(2);
		if(r == 0) return "a wolf";
		else       return "a lupine";
	case Race.avian: r = Rand(2);
		if(r == 0) return "an avian";
		else       return "a bird";
	case Race.moth: return "a moth";
	case Race.scorpion: return "a scorpion";
	case Race.ferret: return "a ferret";
	case Race.plant: return "a plant-like";
	case Race.snake: r = Rand(2);
		if(r == 0) return "a snake-like";
		else       return "a serpentine";
	case Race.goo: return "a gelatinous";
	case Race.insect: return "an insectoid";
	case Race.jackal: return "a canine";
	default: return "an undefined";
	}
}
