import { Entity } from './entity';

Entity.prototype.PrintDescription = function(partial) {
	
	var parse = {
		name     : this.NameDesc(),
		possesive: this.possessive(),
		weigth   : Math.floor(this.body.weigth.Get() * 2),
		race     : this.body.RaceStr(),
		gender   : this.body.GenderStr(),
		skinDesc : this.body.SkinDesc(),
		faceDesc : this.body.FaceDescLong(),
		eyeCount : Text.NumToText(this.body.head.eyes.count.Get()),
		eyeColor : Color.Desc(this.body.head.eyes.color),
		eyeS     : this.body.head.eyes.count.Get() == 1 ? "" : "s",
		hairDesc : this.body.head.hair.Long(),
		buttDesc : this.Butt().Long(),
		hipsDesc : this.HipsDesc(),
		anusDesc : this.Butt().AnalLong(),
		ballsDesc: this.Balls().Long(),
		has      : this.has(),
		is       : this.is(),
		larmor   : this.LowerArmorDescLong()
	};
	parse = this.ParserTags(parse);
	parse = this.ParserPronouns(parse);
	var height = Math.floor(Unit.CmToInch(this.body.height.Get()));
	var height_feet = Math.floor(height / 12);
	var height_inches = Math.floor(height % 12);
	parse["height"] = height_feet + " feet";
	if(height_inches > 0) {
		parse["height"] += " and " + height_inches + " inch";
		if(height_inches > 1) {
			parse["height"] += "es";
		}
	}
	
	Text.Add("[name] [is] a [gender] [race], [height] tall and weighing around [weigth]lb. [HeShe] [has] [skinDesc]. ", parse);
	Text.Add("[HeShe] [is] wearing [armor].", parse);
	if(this.LowerArmor()) Text.Add(" [HeShe] [is] wearing [larmor].", parse);
	if(this.Weapon()) Text.Add(" [HeShe] [is] wielding [weapon].", parse);
	// TODO Body appearance, skin color
	Text.NL();
	Text.Add("[HeShe] [has] [faceDesc]. [HisHer] [eyeCount] [eyeColor] [eye][eyeS] observe the surroundings. ", parse);
	Text.Add("A pair of [ears] sticks out from [possesive] [hairDesc]. ", parse);
	
	for(var i = 0; i < this.body.head.appendages.length; i++) {
		var a = this.body.head.appendages[i];
		parse.appDesc = a.Long();
		Text.Add("On [hisher] head, [heshe] [has] a [appDesc]. ", parse);
	}
	
	Text.NL();
	var bs = false;
	// Back slots
	for(var i = 0; i < this.body.backSlots.length; i++) {
		var b = this.body.backSlots[i];
		parse.appDesc = b.Long();
		Text.Add("On [hisher] back, [heshe] [has] a [appDesc]. ", parse);
		bs = true;
	}
	if(bs) Text.NL();
	
	// TODO: Arms/Legs
	if(this.body.legs.count == 2) {
		Text.Add("[name] [has] arms. [name] [has] [legs], ending in [feet].", parse);
	}
	else if(this.body.legs.count > 2) {
		parse["num"] = Text.NumToText(this.body.legs.count);
		parse["race"] = this.body.legs.race.qShort();
		Text.Add("[name] [has] arms and [num] [race] legs.", parse);
	}
	else {
		parse["race"] = this.body.legs.race.qShort();
		Text.Add("[name] [has] arms and [race] lower body.", parse);
	}
	Text.NL();
	
	// TODO: Hips/butt
	Text.Add("[name] [has] [hipsDesc], and [buttDesc].", parse);
	Text.NL();
	
	// TODO: Breasts
	var breasts = this.body.breasts;
	if(breasts.length == 1) {
		parse.breastDesc = breasts[0].Long();
		Text.Add("[HeShe] [has] [breastDesc].", parse);
	}
	else if(breasts.length > 1) {
		var breast = breasts[0];
		var breastDesc = breast.Desc();
		parse.breastDesc = breasts[0].Short();
		parse.breastSize = breastDesc.size;
		Text.Add("Multiple rows of " + breast.nounPlural() + " sprout from [hisher] chest. [HisHer] first pair of [breastDesc] are [breastSize] in circumference.", parse);
		for(var i = 1; i < breasts.length; i++) {
			Text.Add("<br>Another two breasts.");
		}
	}
	else {
		Text.Add("[name] have a featureless smooth chest.", parse);
	}
	if(breasts.length > 0)
		this.LactationDesc(parse);
	Text.NL();
	
	// Genetalia
	var cocks = this.body.cock;
	var vags = this.body.vagina;
	
	if(cocks.length == 1) {
		var cock = cocks[0];
		parse.cockDesc = cock.aLong();
		Text.Add("[name] [has] [cockDesc].", parse);
	}
	else if(cocks.length > 1) {
		var cock = cocks[0];
		parse.cockDesc = cock.aLong();
		parse.numCocks = Text.NumToText(cocks.length);
		Text.Add("[name] [has] a brace of [numCocks] " + cock.nounPlural() + ".", parse);
		for(var i = 0; i < cocks.length; i++) {
			var cock = cocks[i];
			parse.cockDesc = cock.aLong();
			Text.NL();
			Text.Add("[name] [has] [cockDesc].", parse);
		}
	}
	if(cocks[0])
		Text.NL();
	
	// TODO: balls
	if(this.HasBalls())
	{
		if(cocks.length > 0 || vags.length > 0) {
			Text.Add("Beneath [hisher] other genitalia, [ballsDesc] hang.", parse);
		}
		else {
			// Weird, no genetalia, just balls
			Text.Add("Strangely, [ballsDesc] hang from [hisher] otherwise flat crotch.", parse);
		}
		Text.NL();
	}
	else if(cocks.length == 0 && vags.length == 0) {
		// Genderless, no balls
		Text.Add("[name] [has] a smooth, featureless crotch.", parse);
		Text.NL();
	}
	
	// TODO: vagina
	if(vags.length == 1) {
		var vag = vags[0];
		var vagDesc = vag.Desc();
		Text.Add("[name] [has] " + vagDesc.a + " " + vagDesc.adj + " " + vag.noun() + ".", parse);
	}
	else if(vags.length > 1) {
		var vag = vags[0];
		Text.Add("[name] [has] multiple " + vag.nounPlural() + ". [HisHer] first " + vag.noun() + " is slutty.<br>", parse);
		for(var i = 1; i < vags.length; i++) {
			Text.Add("<br>Another of [hisher] " + vag.nounPlural() + " is slutty.", parse);
		}
	}
	if(vags[0])
		Text.NL();
	
	if(partial) {
		return;
	}
	
	// TODO TEMP
	var balls = this.Balls();
	Text.Add("Cum: " + balls.cum.Get().toFixed(2) + " / " + balls.CumCap().toFixed(2));
	Text.NL();
	Text.Add("Milk: " + this.Milk().toFixed(2) + " / " + this.MilkCap().toFixed(2));
	Text.NL();
	
	// TODO: Pregnancy
	var womb = this.pregHandler.Womb({slot: PregnancyHandler.Slot.Vag});
	if(womb && womb.pregnant) {
		parse["proc"] = (womb.progress * 100).toFixed(1);
		parse["hour"] = womb.hoursToBirth.toFixed(1);
		Text.Add("[name] [is] pregnant. Current progress, [proc]%. [hour] hours to term.", parse);
		Text.NL();
	}
	
	womb = this.pregHandler.Womb({slot: PregnancyHandler.Slot.Butt});
	if(womb && womb.pregnant) {
		parse["proc"] = (womb.progress * 100).toFixed(1);
		parse["hour"] = womb.hoursToBirth.toFixed(1);
		Text.Add("[name] [is] butt-pregnant. Current progress, [proc]%. [hour] hours to term.", parse);
		Text.NL();
	}
	
	// TODO: Ass
	Text.Add("[name] [has] [anusDesc].", parse);
	
	if(DEBUG) {
		Text.NL();
		Text.Add("DEBUG: relation: " + this.relation.Get(), null, 'bold');
		Text.NL();
		Text.Add("DEBUG: subDom: " + this.subDom.Get(), null, 'bold');
		Text.NL();
		Text.Add("DEBUG: slut: " + this.slut.Get(), null, 'bold');
		Text.NL();
	}
	
	var drunk = this.DrunkStr();
	if(drunk) {
		Text.NL();
		Text.Add(drunk);
	}
	
	Text.Flush();
}

// TODO: affect with lust/perks?
Entity.prototype.SubDom = function() {
	return this.subDom.Get();
}
Entity.prototype.Relation = function() {
	return this.relation.Get();
}
Entity.prototype.Slut = function() {
	return this.slut.Get();
}

Entity.prototype.Gender = function() {
	return this.body.Gender();
}
Entity.prototype.Race = function() {
	return this.body.torso.race;
}

Entity.prototype.MuscleTone = function() {
	return this.body.muscleTone.Get();
}
Entity.prototype.BodyMass = function() {
	return this.body.bodyMass.Get();
}

Entity.prototype.Height = function() {
	return this.body.height.Get();
}
Entity.prototype.Weigth = function() {
	return this.body.weigth.Get();
}

Entity.prototype.Humanity = function() {
	var racescore = new RaceScore(this.body);
	var humanScore = new RaceScore();
	humanScore.score[Race.Human.id] = 1;
	return racescore.Compare(humanScore);
}
Entity.prototype.RaceCompare = function(race) {
	var racescore = new RaceScore(this.body);
	return racescore.SumScore(race);
}
Entity.prototype.Femininity = function() {
	return this.body.femininity.Get();
}
Entity.prototype.FaceDesc = function() {
	return this.body.FaceDesc();
}
Entity.prototype.SkinDesc = function() {
	return this.body.SkinDesc();
}
Entity.prototype.SkinType = function() {
	return this.body.torso.race;
}
Entity.prototype.LipsDesc = function() {
	return this.body.LipsDesc();
}
Entity.prototype.TongueDesc = function() {
	return this.body.TongueDesc();
}
Entity.prototype.TongueTipDesc = function() {
	return this.body.TongueTipDesc();
}
Entity.prototype.LongTongue = function() {
	return this.body.LongTongue();
}
Entity.prototype.Hair = function() {
	return this.body.head.hair;
}
Entity.prototype.HasHair = function() {
	return this.body.head.hair.Bald() == false;
}
Entity.prototype.HasLongHair = function() {
	return this.body.head.hair.Bald() == false; //TODO
}
Entity.prototype.Face = function() {
	return this.body.head;
}
Entity.prototype.Mouth = function() {
	return this.body.head.mouth;
}
Entity.prototype.Tongue = function() {
	return this.body.head.mouth.tongue;
}
Entity.prototype.Eyes = function() {
	return this.body.head.eyes;
}
Entity.prototype.EyeDesc = function() {
	return this.body.EyeDesc();
}
Entity.prototype.Ears = function() {
	return this.body.head.ears;
}
Entity.prototype.EarDesc = function() {
	return this.body.EarDesc();
}
Entity.prototype.HasFlexibleEars = function() {
	return this.body.HasFlexibleEars();
}
Entity.prototype.HasMuzzle = function() {
	return this.body.HasMuzzle();
}
Entity.prototype.HasLongSnout = function() {
	return this.body.HasLongSnout();
}
Entity.prototype.Arms = function() {
	return this.body.arms;
}
Entity.prototype.MultiArm = function() {
	return this.body.arms.count > 2;
}
Entity.prototype.Legs = function() {
	return this.body.legs;
}
let LowerBodyType = {
	Single   : 0,
	Humanoid : 1,
	Taur     : 2
};
Entity.prototype.LowerBodyType = function() {
	if     (this.body.legs.count <  2) return LowerBodyType.Single;
	else if(this.body.legs.count == 2) return LowerBodyType.Humanoid;
	else                               return LowerBodyType.Taur;
}
Entity.prototype.NumLegs = function() {
	return this.body.legs.count;
}
Entity.prototype.Humanoid = function() {
	return this.LowerBodyType() == LowerBodyType.Humanoid;
}
Entity.prototype.HasLegs = function() {
	return (this.body.legs.count >= 2);
}
Entity.prototype.IsNaga = function() {
	return (this.body.legs.count < 2) &&
		(this.body.legs.race.isRace(Race.Snake));
}
Entity.prototype.IsTaur = function() {
	return this.LowerBodyType() == LowerBodyType.Taur;
}
Entity.prototype.IsGoo = function() {
	return (this.body.legs.race.isRace(Race.Goo));
}
Entity.prototype.IsFlexible = function() {
	return this.body.IsFlexible(); //TODO Perks
}
Entity.prototype.Butt = function() {
	return this.body.ass;
}
Entity.prototype.HasBalls = function() {
	return this.Balls().count.Get() > 0;
}
Entity.prototype.Balls = function() {
	return this.body.balls;
}
Entity.prototype.BallsDesc = function() {
	return this.Balls().Short();
}
Entity.prototype.Virility = function() {
	return this.body.balls.fertility.Get();
}
Entity.prototype.HasFur = function() {
	return this.body.HasFur();
}
Entity.prototype.HasSkin = function() {
	return this.body.HasSkin();
}
Entity.prototype.HasScales = function() {
	return this.body.HasScales();
}

Entity.prototype.LactationDesc = function(parse) {
	
}
Entity.prototype.StomachDesc = function() {
	var bellysize = this.pregHandler.BellySize();
	return this.body.StomachDesc(bellysize);
}
Entity.prototype.HipDesc = function() {
	return this.body.HipsDesc();
}
Entity.prototype.HipsDesc = function() {
	return this.body.HipsDesc(true);
}
Entity.prototype.HipSize = function() {
	return this.body.HipSize();
}
// TODO
Entity.prototype.ArmDesc = function() {
	return this.body.ArmDesc();
}
Entity.prototype.HandDesc = function() {
	return this.body.HandDesc();
}
Entity.prototype.PalmDesc = function() {
	return this.body.PalmDesc();
}
Entity.prototype.LegDesc = function() {
	return this.body.LegDesc();
}
Entity.prototype.LegsDesc = function() {
	return this.body.LegsDesc();
}
Entity.prototype.ThighDesc = function() {
	return this.body.ThighDesc();
}
Entity.prototype.ThighsDesc = function() {
	return this.body.ThighsDesc();
}
Entity.prototype.KneeDesc = function() {
	return this.body.KneesDesc();
}
Entity.prototype.KneesDesc = function() {
	return this.body.KneesDesc(true);
}
Entity.prototype.FeetDesc = function() {
	return this.body.FeetDesc();
}
Entity.prototype.FootDesc = function() {
	return this.body.FootDesc();
}
Entity.prototype.Appendages = function() {
	return this.body.head.appendages;
}
Entity.prototype.HasNightvision = function() {
	return this.body.HasNightvision();
}
Entity.prototype.HasHorns = function() {
	for(var i = 0; i < this.body.head.appendages.length; i++)
		if(this.body.head.appendages[i].type == AppendageType.horn)
			return this.body.head.appendages[i];
	return null;
}
Entity.prototype.HasAntenna = function() {
	for(var i = 0; i < this.body.head.appendages.length; i++)
		if(this.body.head.appendages[i].type == AppendageType.antenna)
			return this.body.head.appendages[i];
	return null;
}
Entity.prototype.Back = function() {
	return this.body.backSlots;
}
Entity.prototype.HasTail = function() {
	for(var i = 0; i < this.body.backSlots.length; i++)
		if(this.body.backSlots[i].type == AppendageType.tail)
			return this.body.backSlots[i];
	return null;
}
Entity.prototype.HasPrehensileTail = function() {
	var found = false;
	for(var i = 0; i < this.body.backSlots.length; i++)
		if(this.body.backSlots[i].type == AppendageType.tail)
			found = found || this.body.backSlots[i].Prehensile();
	return found;
}
Entity.prototype.HasWings = function() {
	for(var i = 0; i < this.body.backSlots.length; i++)
		if(this.body.backSlots[i].type == AppendageType.wing)
			return this.body.backSlots[i];
	return null;
}
Entity.prototype.NumAttributes = function(race) {
	return this.body.NumAttributes(race);
}

// TODO
Entity.prototype.Weapon = function() {
	return this.weaponSlot;
}
// TODO
Entity.prototype.WeaponDesc = function() {
	return this.weaponSlot ? this.weaponSlot.sDesc() : "stick";
}
// TODO
Entity.prototype.WeaponDescLong = function() {
	return this.weaponSlot ? this.weaponSlot.lDesc() : "a stick";
}
// TODO
Entity.prototype.Armor = function() {
	return this.topArmorSlot;
}
// TODO
Entity.prototype.LowerArmor = function() {
	return this.botArmorSlot;
}
// TODO
Entity.prototype.LowerArmorDesc = function() {
	return this.botArmorSlot ? this.botArmorSlot.sDesc() : this.ArmorDesc();
}
// TODO
Entity.prototype.LowerArmorDescLong = function() {
	return this.botArmorSlot ? this.botArmorSlot.lDesc() : this.ArmorDescLong();
}
// TODO
Entity.prototype.ArmorDesc = function() {
	return this.topArmorSlot ? this.topArmorSlot.sDesc() : "comfortable clothes";
}
Entity.prototype.ArmorDescLong = function() {
	return this.topArmorSlot ? this.topArmorSlot.lDesc() : "a set of comfortable clothes";
}
Entity.prototype.Accessories = function() {
	return [this.acc1Slot, this.acc2Slot];
}

export { LowerBodyType };
