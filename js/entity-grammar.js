
// Grammar
Entity.prototype.nameDesc = function() {
	return this.monsterName || this.name;
}
Entity.prototype.NameDesc = function() {
	return this.MonsterName || this.name;
}
Entity.prototype.possessive = function() {
	var name = this.monsterName || this.name || "the entity";
	var letter = name[name.length-1];
	var s = (letter == 's' || letter == 'x') ? "'" : "'s";
	return name + s;
}
Entity.prototype.Possessive = function() {
	var name = this.MonsterName || this.name || "The entity";
	var letter = name[name.length-1];
	var s = (letter == 's' || letter == 'x') ? "'" : "'s";
	return name + s;
}
Entity.prototype.possessivePlural = function() {
	var name = this.groupName || this.name || "the entities";
	return name + "'";
}
Entity.prototype.PossessivePlural = function() {
	var name = this.GroupName || this.name || "The entities";
	return name + "'";
}
Entity.prototype.heshe = function(forcegender) {
	var gender = forcegender ? forcegender : this.body.Gender();
	if(gender == Gender.male) return "he";
	else if(gender == Gender.female) return "she";
	else if(gender == Gender.herm) return "she";
	else return "they";
}
Entity.prototype.HeShe = function(forcegender) {
	var gender = forcegender ? forcegender : this.body.Gender();
	if(gender == Gender.male) return "He";
	else if(gender == Gender.female) return "She";
	else if(gender == Gender.herm) return "She";
	else return "They";
}
Entity.prototype.himher = function(forcegender) {
	var gender = forcegender ? forcegender : this.body.Gender();
	if(gender == Gender.male) return "him";
	else if(gender == Gender.female) return "her";
	else if(gender == Gender.herm) return "her";
	else return "them";
}
Entity.prototype.HimHer = function(forcegender) {
	var gender = forcegender ? forcegender : this.body.Gender();
	if(gender == Gender.male) return "Him";
	else if(gender == Gender.female) return "Her";
	else if(gender == Gender.herm) return "Her";
	else return "Them";
}
Entity.prototype.hisher = function(forcegender) {
	var gender = forcegender ? forcegender : this.body.Gender();
	if(gender == Gender.male) return "his";
	else if(gender == Gender.female) return "her";
	else if(gender == Gender.herm) return "her";
	else return "their";
}
Entity.prototype.HisHer = function(forcegender) {
	var gender = forcegender ? forcegender : this.body.Gender();
	if(gender == Gender.male) return "His";
	else if(gender == Gender.female) return "Her";
	else if(gender == Gender.herm) return "Her";
	else return "Their";
}
Entity.prototype.hishers = function(forcegender) {
	var gender = forcegender ? forcegender : this.body.Gender();
	if(gender == Gender.male) return "his";
	else if(gender == Gender.female) return "hers";
	else if(gender == Gender.herm) return "hers";
	else return "theirs";
}
Entity.prototype.has = function() {
	if(this.body.Gender() == Gender.none) return "have";
	return "has";
}
Entity.prototype.is = function() {
	if(this.body.Gender() == Gender.none) return "are";
	return "is";
}
Entity.prototype.plural = function() {
	return (this.body.Gender() == Gender.none);
}
// TODO femininity from other things (breasts etc)
Entity.prototype.mfFem = function(male, female) {
	return this.body.femininity.Get() > 0 ? female : male;
}
Entity.prototype.mfTrue = function(male, female) {
	return (this.body.Gender() == Gender.male) ? male : female;
}

Entity.prototype.ParserPronouns = function(parse, prefix, forcegender) {
	parse  = parse  || {};
	prefix = prefix || "";
	parse[prefix + "HeShe"]   = this.HeShe(forcegender);
	parse[prefix + "heshe"]   = this.heshe(forcegender);
	parse[prefix + "HisHer"]  = this.HisHer(forcegender);
	parse[prefix + "hisher"]  = this.hisher(forcegender);
	parse[prefix + "HimHer"]  = this.HimHer(forcegender);
	parse[prefix + "himher"]  = this.himher(forcegender);
	parse[prefix + "hishers"] = this.hishers(forcegender);
	return parse;
}

Entity.prototype.ParserTags = function(parse, prefix) {
	var ent = this;
	parse  = parse  || {};
	prefix = prefix || "";
	
	var p1cock = ent.BiggestCock(null, true);
	
	parse[prefix + "cocks"]     = function() { return ent.MultiCockDesc(); }
	parse[prefix + "cock"]      = function() { return p1cock.Short(); }
	parse[prefix + "cockTip"]   = function() { return p1cock.TipShort(); }
	parse[prefix + "balls"]     = function() { return ent.BallsDesc(); }
	parse[prefix + "butt"]      = function() { return ent.Butt().Short(); }
	parse[prefix + "anus"]      = function() { return ent.Butt().AnalShort(); }
	parse[prefix + "vag"]       = function() { return ent.FirstVag().Short(); }
	parse[prefix + "clit"]      = function() { return ent.FirstVag().ClitShort(); }
	parse[prefix + "breasts"]   = function() { return ent.FirstBreastRow().Short(); }
	parse[prefix + "nip"]       = function() { return ent.FirstBreastRow().NipShort(); }
	parse[prefix + "nips"]      = function() { return ent.FirstBreastRow().NipsShort(); }
	parse[prefix + "tongue"]    = function() { return ent.TongueDesc(); }
	parse[prefix + "tongueTip"] = function() { return ent.TongueTipDesc(); }
	parse[prefix + "skin"]      = function() { return ent.SkinDesc(); }
	parse[prefix + "hair"]      = function() { return ent.Hair().Short(); }
	parse[prefix + "face"]      = function() { return ent.FaceDesc(); }
	parse[prefix + "ears"]      = function() { return ent.EarDesc(); }
	parse[prefix + "eyes"]      = function() { return ent.EyeDesc()+'s'; }
	parse[prefix + "hand"]      = function() { return ent.HandDesc(); }
	parse[prefix + "palm"]      = function() { return ent.PalmDesc(); }
	parse[prefix + "hips"]      = function() { return ent.HipsDesc(); }
	parse[prefix + "thighs"]    = function() { return ent.ThighsDesc(); }
	parse[prefix + "thigh"]     = function() { return ent.ThighDesc(); }
	parse[prefix + "legs"]      = function() { return ent.LegsDesc(); }
	parse[prefix + "leg"]       = function() { return ent.LegDesc(); }
	parse[prefix + "foot"]      = function() { return ent.FootDesc(); }
	parse[prefix + "feet"]      = function() { return ent.FeetDesc(); }
	parse[prefix + "belly"]     = function() { return ent.StomachDesc(); }
	
	parse[prefix + "weapon"]    = function() { return ent.WeaponDesc(); }
	parse[prefix + "armor"]     = function() { return ent.ArmorDesc(); }
	return parse;
}

Entity.prototype.toString = function() {
	return this.name;
}

Entity.prototype.Appearance = function() {
	return this.FullName()
	+ " is a "
	+ this.body.GenderStr() + " "
	+ this.body.RaceStr() + ".";
}
