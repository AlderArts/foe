
let Gender = {
	male   : 0,
	female : 1,
	herm   : 2,
	none   : 3,
	LAST   : 4
}
Gender.Desc = function(gender) {
	var r;
	switch(gender) {
	case Gender.male: return "male";
	case Gender.female: return "female";
	case Gender.herm: r = Rand(2);
		if(r == 0) return "hermaphrodite";
		else return "herm";
	default: return "genderless";
	}
}
Gender.Noun = function(gender) {
	var r;
	switch(gender) {
	case Gender.male: return "man";
	case Gender.female: return "woman";
	case Gender.herm: r = Rand(2);
		if(r == 0) return "herm";
		else return "herm";
	default: return "neuter";
	}
}
Gender.Short = function(gender) {
	var r;
	switch(gender) {
	case Gender.male: return "M";
	case Gender.female: return "F";
	case Gender.herm: return "H";
	default: return "-";
	}
}
Gender.Rand = function(odds) {
	odds = odds || [1, 1, 1];
	var sum = 0;
	for(var i = 0; i < Gender.LAST; i++) {
		if(odds[i]) sum += odds[i];
	}
	
	var step = Math.random() * sum;
	
	for(var i = 0; i < Gender.LAST; i++) {
		if(odds[i])
			step -= odds[i];
		if(step <= 0.0)
			return i;
	}
	return Gender.none;
}

export { Gender };
