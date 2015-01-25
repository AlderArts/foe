/*
 * 
 * Define Terry
 * 
 */

Scenes.Terry = {};

function Terry(storage) {
	Entity.call(this);
	
	// Character stats
	this.name = "Thief";
	this.monsterName = "the thief";
	this.MonsterName = "The thief";
	
	this.avatar.combat = Images.terry;
	
	this.currentJob = Jobs.Rogue;
	this.jobs["Fighter"]   = new JobDesc(Jobs.Fighter);
	this.jobs["Fighter"].level = 3;
	this.jobs["Fighter"].mult  = 2;
	this.jobs["Rogue"]     = new JobDesc(Jobs.Rogue);
	this.jobs["Ranger"]    = new JobDesc(Jobs.Ranger);    this.jobs["Ranger"].mult    = 2;
	this.jobs["Scholar"]   = new JobDesc(Jobs.Scholar);   this.jobs["Scholar"].mult   = 3;
	this.jobs["Courtesan"] = new JobDesc(Jobs.Courtesan); this.jobs["Courtesan"].mult = 2;

	this.jobs["Mage"]      = new JobDesc(Jobs.Mage);   this.jobs["Mage"].mult   = 2;
	this.jobs["Mystic"]    = new JobDesc(Jobs.Mystic); this.jobs["Mystic"].mult = 2;
	this.jobs["Healer"]    = new JobDesc(Jobs.Healer); this.jobs["Healer"].mult = 2;
	
	this.jobs["Hypnotist"] = new JobDesc(Jobs.Hypnotist);
	
	this.maxHp.base        = 50;
	this.maxSp.base        = 60; this.maxSp.growth        = 6;
	this.maxLust.base      = 50;
	// Main stats
	this.strength.base     = 13;
	this.stamina.base      = 10;
	this.dexterity.base    = 24; this.dexterity.growth    = 1.5;
	this.intelligence.base = 15; this.intelligence.growth = 1.2;
	this.spirit.base       = 13;
	this.libido.base       = 15; this.libido.growth       = 1.1;
	this.charisma.base     = 20; this.charisma.growth     = 1.3;
	
	this.level    = 5;
	this.sexlevel = 1;
	this.SetExpToLevel();
	
	this.body.DefMale();
	this.body.muscleTone.base = 0.1;
	this.body.femininity.base = 0.9;
	this.Butt().buttSize.base = 3;
	this.SetSkinColor(Color.gold);
	this.SetHairColor(Color.red);
	this.SetEyeColor(Color.blue);
	this.body.SetRace(Race.fox);
	this.body.height.base      = 157;
	this.body.weigth.base      = 45;
	
	this.weaponSlot   = Items.Weapons.Dagger;
	
	this.Equip();
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"]   = 0;
	this.flags["Saved"] = 0;
	this.flags["PrefGender"] = Gender.male;
	this.flags["Skin"] = 0;
	this.flags["BM"] = 0;
	this.flags["pQ"] = 0;
	this.flags["xLick"] = 0; //lick butt in buttfuck
	this.flags["Rogue"] = 0;
	this.flags["TF"] = Terry.TF.NotTried;
	this.flags["TFd"] = 0;
	this.flags["xLact"] = 0;
	this.flags["maxPast"] = 0;
	this.flags["rotPast"] = 0;
	this.flags["vFirst"] = 0;
	this.flags["caFirst"] = 0; //Catch anal (terry pitching)
	//TF state
	this.flags["breasts"] = Terry.Breasts.Flat;
	this.flags["lact"] = 0;
	this.flags["vag"]  = Terry.Pussy.None;
	this.flags["cock"] = Terry.Cock.Regular;
	
	this.sbombs = 3;
	this.hidingSpot = world.loc.Rigard.ShopStreet.street;
	
	if(storage) this.FromStorage(storage);
	
	this.SetBreasts();
	this.SetLactation();
	this.SetPussy();
	this.SetCock();
}
Terry.prototype = new Entity();
Terry.prototype.constructor = Terry;

//Note: bitmask
Terry.TF = {
	NotTried   : 0,
	TriedItem  : 1,
	Rosalin    : 2,
	Jeanne     : 4,
	JeanneUsed : 8
}
Terry.Met = {
	NotMet  : 0,
	Found   : 1,
	Caught  : 2,
	LetHer  : 2,
	StopHer : 3,
	TakeHim : 4
};
Terry.Saved = {
	NotStarted    : 0,
	TalkedMiranda : 1,
	TalkedTwins1  : 2,
	TalkedTwins2  : 3,
	Saved         : 4
};
Terry.Rogue = {
	Locked : 0,
	First  : 1,
	Taught : 2
};
Terry.Breasts = {
	Flat : 0,
	Acup : 1,
	Bcup : 2,
	Ccup : 3,
	Dcup : 4
};
Terry.Cock = {
	Regular : 0,
	Horse   : 1,
	None    : 2
};
Terry.Pussy = {
	None   : 0,
	Virgin : 1,
	Used   : 2
};
Terry.MilkLevel = {
	Low      : 0.5,
	Mid      : 3,
	High     : 5,
	VeryHigh : 7.5
};
Terry.CumLevel = {
	Low      : 3,
	Mid      : 8,
	High     : 13,
	VeryHigh : 20
};
Terry.PersonalQuest = {
	NotStarted : 0,
	Started    : 1,
	Completed  : 2
};

Terry.prototype.Recruited = function() {
	return this.flags["Saved"] >= Terry.Saved.Saved;
}

Terry.prototype.FromStorage = function(storage) {
	this.Butt().virgin       = parseInt(storage.virgin) == 1;
	
	this.LoadCombatStats(storage);
	this.LoadPersonalityStats(storage);
	this.LoadEffects(storage);
	this.LoadJobs(storage);
	this.LoadEquipment(storage);
	this.LoadPregnancy(storage);
	this.LoadLactation(storage);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
	
	this.RecallAbilities();
	this.SetLevelBonus();
	this.Equip();
		
	if(this.flags["Met"] >= Terry.Met.Caught || this.Recruited()) {
		this.name = "Terry";
		this.avatar.combat = Images.terry_c;
		this.monsterName = null;
		this.MonsterName = null;
	}
}

Terry.prototype.ToStorage = function() {
	var storage = {
		virgin : this.Butt().virgin ? 1 : 0
	};
	
	this.SaveCombatStats(storage);
	this.SavePersonalityStats(storage);
	this.SaveEffects(storage);
	this.SaveJobs(storage);
	this.SaveEquipment(storage);
	this.SavePregnancy(storage);
	this.SaveLactation(storage);
	
	// Save flags
	this.SaveFlags(storage);
	this.SaveSexStats(storage);
	
	return storage;
}

Terry.prototype.SetBreasts = function() {
	switch(this.flags["breasts"]) {
		default:
		case Terry.Breasts.Flat:
			this.FirstBreastRow().size.base = 1;
			break;
		case Terry.Breasts.Acup:
			this.FirstBreastRow().size.base = 3;
			break;
		case Terry.Breasts.Bcup:
			this.FirstBreastRow().size.base = 5;
			break;
		case Terry.Breasts.Ccup:
			this.FirstBreastRow().size.base = 7.5;
			break;
		case Terry.Breasts.Dcup:
			this.FirstBreastRow().size.base = 10;
			break;
	}
}
Terry.prototype.SetLactation = function() {
	if(this.flags["lact"] != 0) {
		this.lactHandler.milkProduction.base = 3;
		this.lactHandler.lactationRate.base = 1;
		this.lactHandler.lactating = true;
	}
	else {
		this.lactHandler.milkProduction.base = 0;
		this.lactHandler.lactationRate.base = 0;
		this.lactHandler.lactating = false;
	}
}
Terry.prototype.Lactation = function() {
	return terry.flags["lact"] != 0;
}
Terry.prototype.SetPussy = function() {
	this.body.vagina = [];
	if(this.flags["vag"] != Terry.Pussy.None) {
		this.body.vagina.push(new Vagina());
		if(this.flags["vag"] == Terry.Pussy.Used)
			this.FirstVag().virgin = false;
	}
}
Terry.prototype.SetCock = function() {
	this.body.cock = [];
	if(this.flags["cock"] == Terry.Cock.Regular) {
		this.body.cock.push(new Cock());
		this.FirstCock().length.base = 11;
		this.FirstCock().thickness.base = 2;
		this.FirstCock().race = Race.fox;
		this.FirstCock().knot = 1;
		this.FirstCock().sheath = 1;
		this.Balls().cumCap.base = 5;
		this.Balls().size.base  = 2;
		this.Balls().count.base = 2;
	}
	else if(this.flags["cock"] == Terry.Cock.Horse) {
		this.body.cock.push(new Cock());
		this.FirstCock().length.base = 33;
		this.FirstCock().thickness.base = 6;
		this.FirstCock().race = Race.horse;
		this.FirstCock().knot = 1;
		this.FirstCock().sheath = 1;
		this.Balls().cumCap.base = 10;
		this.Balls().size.base  = 5;
		this.Balls().count.base = 2;
	}
	else { //None
		this.Balls().count.base = 0;
	}
}


Terry.prototype.PronounGender = function() {
	return this.flags["PrefGender"];
}

Terry.prototype.heshe = function() {
	var gender = this.flags["PrefGender"];
	if(gender == Gender.male) return "he";
	else return "she";
}
Terry.prototype.HeShe = function() {
	var gender = this.flags["PrefGender"];
	if(gender == Gender.male) return "He";
	else return "She";
}
Terry.prototype.himher = function() {
	var gender = this.flags["PrefGender"];
	if(gender == Gender.male) return "him";
	else return "her";
}
Terry.prototype.HimHer = function() {
	var gender = this.flags["PrefGender"];
	if(gender == Gender.male) return "Him";
	else return "Her";
}
Terry.prototype.hisher = function() {
	var gender = this.flags["PrefGender"];
	if(gender == Gender.male) return "his";
	else return "her";
}
Terry.prototype.HisHer = function() {
	var gender = this.flags["PrefGender"];
	if(gender == Gender.male) return "His";
	else return "Her";
}
Terry.prototype.hishers = function() {
	var gender = this.flags["PrefGender"];
	if(gender == Gender.male) return "his";
	else return "hers";
}
Terry.prototype.mfPronoun = function(male, female) {
	var gender = this.flags["PrefGender"];
	if(gender == Gender.male) return male;
	else return female;
}

Terry.prototype.HorseCock = function() {
	return (this.FirstCock() && this.FirstCock().race == Race.horse);
}
Terry.prototype.Cup = function() {
	return this.flags["breasts"];
}

Terry.prototype.FuckVag = function(vag, cock, expMult) {
	this.flags["vag"] = Terry.Pussy.Used;
	Entity.prototype.FuckVag.call(this, vag, cock, expMult);
}

Terry.prototype.PussyVirgin = function() {
	return this.flags["vFirst"] == 0;
}

// Party interaction
Terry.prototype.Interact = function(switchSpot) {
	var parse = {
		foxvixen : terry.mfPronoun("fox", "vixen"),
		HeShe   : terry.HeShe(),
		heshe   : terry.heshe(),
		HisHer  : terry.HisHer(),
		hisher  : terry.hisher(),
		himher  : terry.himher(),
		hishers : terry.hishers(),
		truegender : Gender.Desc(terry.Gender()),
		armordesc  : function() { return terry.ArmorDescLong(); },
		weapondesc : function() { return terry.WeaponDescLong(); }
	};
	
	Text.Clear();
	Text.Add("Terry is a [truegender] fox-morph follower you 'recruited' from Rigard’s Jail; [heshe]’s currently wearing [armordesc] and wielding [weapondesc].", parse);
	Text.NL();
	if(terry.Relation() < 30)
		Text.Add("[HeShe] scratches [hisher] neck sometimes, around the enchanted collar you gave [himher] to ensure [heshe]’s kept under control. Sometimes [heshe] gives you an irritated glance, when [heshe] thinks you’re not looking.", parse);
	else if(terry.Relation() < 60)
		Text.Add("Around [hisher] neck is an enchanted collar that prevents [himher] from leaving you or otherwise disobeying you. It was the only way you could take the petite [foxvixen] away from the death row. It’s probably a good thing [heshe]’s wearing it too; considering [hisher] thieving past, there’s no guarantee [heshe] won’t get in trouble again. When [heshe] spots you looking, [heshe] quickly nods in acknowledgement at you.", parse);
	else if(terry.flags["pQ"] >= Terry.PersonalQuest.Completed)
		Text.Add("The [foxvixen] is always wearing that enchanted collar you gave [himher] when you bailed [himher] out of jail, even though [heshe] technically doesn’t have to wear it anymore. You didn’t think the crafty [foxvixen] would find a way out of it, but [heshe] did. Even so, [heshe] insists on wearing it. “As proof of ownership,” you quote. You didn’t think [heshe] would take to [hisher] station so well, nor that you’d grow this close as you travelled together. When your eyes meet, [heshe] smiles warmly at you.", parse);
	else
		Text.Add("[HeShe]’s grown quite close to you as you spent time together, and you gotta admit, the [foxvixen] is not so bad once you get to know [himher]. You’ve found [himher] to be quite amorous when [heshe] wants to, and even a bit clingy at times… but nevertheless you’re glad to have the company of the pretty [foxvixen]. When your eyes meet, [heshe] smiles warmly at you.", parse);
	Text.Flush();
	Scenes.Terry.Prompt();
}

Scenes.Terry.Appearance = function() {
	var parse = {
		foxvixen : terry.mfPronoun("fox", "vixen"),
		HeShe   : terry.HeShe(),
		heshe   : terry.heshe(),
		HisHer  : terry.HisHer(),
		hisher  : terry.hisher(),
		himher  : terry.himher(),
		hishers : terry.hishers(),
		trueGender : Gender.Desc(terry.Gender()),
		tbreastDesc : function() { return terry.FirstBreastRow().Short(); },
		tcockDesc : function() { return terry.MultiCockDesc(); }
	};
	
	Text.Clear();
	Text.Add("You take a closer look at Terry.", parse);
	Text.NL();
	Text.Add("Terry is a [trueGender] fox-morph, a former thief that you 'rescued' from the jail in Rigard.", parse);
	if(terry.Gender() == Gender.male && terry.PronounGender() != Gender.male)
		Text.Add(" Though he’s really a male, you chose to refer to him as a 'she'.", parse);
	else if(terry.Gender() == Gender.female && terry.PronounGender() != Gender.female)
		Text.Add(" Though she’s really a female, you chose to refer to her as a 'he'.", parse);
	Text.NL();
	Text.Add("Terry’s vulpine features are unquestionably feminine; ", parse);
	if(terry.Gender() == Gender.male)
		Text.Add("despite [hisher] birth gender, [heshe] can easily pass as a very fetching young fox-woman with only a little effort on [hisher] part.", parse);
	else
		Text.Add("which is only fitting, seeing as how [heshe]’s a very lovely [foxvixen] [trueGender].", parse);
	Text.Add(" Two small, delicate vulpine ears sit atop [hisher] head, practically swallowed by a lush mane of crimson fur. Well-groomed and clean, Terry doesn’t style [hisher] hair much beyond making a rough effort to tie it back into a ponytail. A prominent forelock drapes [hisher] face, falling almost down onto [hisher] dainty little black nose. Beautiful ocean-blue eyes stare out from amidst the hair, always surveying [hisher] surroundings.", parse);
	Text.NL();
	if(terry.Relation() < 30)
		Text.Add("Once [heshe] realizes you’re checking [himher] out, Terry immediately looks away with an indignant huff. Seems like [heshe]’s not too comfortable with your inspection.", parse);
	else if(terry.Relation() < 60)
		Text.Add("Terry grins nervously, once [heshe] realizes you’re checking [himher] out. Aside from [hisher] apparent nervousness, [heshe] makes no move to block your view.", parse);
	else
		Text.Add("The [foxvixen]’s eyes dart toward you, and as your gaze meets [hisher]’s, [heshe] smiles. Terry adjusts [hisher] hair a bit and straightens [hisher] posture as [heshe] stretches languidly, giving you a perfectly unobstructed view of [himher]self.", parse);
	Text.NL();
	Text.Add("Despite the crimson mane atop the [foxvixen]’s head, the rest of [hisher] fur is a very different color; golden yellow offsetting white. Though most of [hisher] face is pure white, a large ring of gold around each eye blurs together over the bridge of the nose, creating a very domino mask-like effect. [HisHer] ears are, likewise, pure gold on the outside and pure white on the inside. White gives way to gold at [hisher] neck, and you know for a fact that most of Terry’s fur is gold; only on [hisher] forelimbs, legs from knees to ankle, stomach, buttocks, and the very tip of [hisher] tail does the white return.", parse);
	Text.NL();
	Text.Add("Following the fur leads your gaze down to Terry’s chest. ", parse);
	if(terry.Cup() > Terry.Breasts.Flat) {
		parse["c"] = terry.FirstCock() ? Text.Parse(", contrasting the [tcockDesc] between [hisher] legs", parse) : "";
		Text.Add("A pair of [tbreastDesc] bulge noticeably atop Terry’s chest[c]. ", parse);
		if(terry.Cup() == Terry.Breasts.Dcup) {
			Text.Add("Though only D-cups, Terry is so slenderly built elsewhere that they seem exaggeratedly large. The full quivering breasts jiggle softly whenever [heshe] moves, making even the act of breathing almost hypnotic as they rise, fall, expand and contract. It really is incredible that such a dainty [foxvixen] could have such huge breasts.", parse);
			if(terry.Lactation()) {
				Text.NL();
				Text.Add("The huge [foxvixen] tits contain an equally huge supply of warm, creamy milk, just waiting to be tapped whenever you want. As if to prove your point, a small bead leaks from each perky pink nipple in turn, sliding down Terry’s areolae. With practised disinterest, [heshe] wipes the smears of milk away with a quick flick of [hisher] fingers over each breast.", parse);
			}
		}
		else if(terry.Cup() == Terry.Breasts.Ccup) {
			Text.Add("Plush and proud, the C-cup sized breasts have just the right amount of sag to them, drawing a casual eye and enticing the viewer to touch and squeeze them. Terry’s delicate body-type only makes them seem more prominent.", parse);
			if(terry.Lactation())
				Text.Add(" Further weighing the [foxvixen] down is the ample supply of fresh milk brewing in each plush teat. As [heshe] moves, a small bead of white wells from one little pink nipple, forced out by the shift in pressure.", parse);
		}
		else if(terry.Cup() == Terry.Breasts.Bcup) {
			Text.Add("The full, perky orbs are a good size that blends well with Terry’s dainty frame; the luscious pair of B-cups are just big enough to squeeze and play with.", parse);
			if(terry.Lactation())
				Text.Add(" And that squeezability comes in handy; it makes milking [himher] of the sweet [foxvixen] milk brewing in each tit almost effortless.", parse);
		}
		else {
			Text.Add("Dainty little things just barely big enough to squeeze as they are, you’d estimate Terry’s breasts to be A-cups. They mesh very well with [hisher] slender frame.", parse);
			if(terry.Lactation())
				Text.Add(" Despite their small size, you know they contain an easily tapped supply of warm, creamy [foxvixen] milk.", parse);
		}
	}
	else {
		Text.Add("Terry’s chest is flat... but that’s about the most masculine thing you can say about [hisher] build. Even though it lacks any visible breasts, there’s a slender suppleness to [hisher] physique that ", parse);
		if(terry.Gender() == Gender.male)
			Text.Add("doesn’t help [himher] present [himher]self as male.", parse);
		else if(terry.Gender() == Gender.herm)
			Text.Add("seems strangely appropriate for one who blurs the gender-line like your double-equipped [foxvixen].", parse);
		else
			Text.Add("manages to convey [hisher] fundamental femininity.", parse);
	}
	Text.NL();
	if(terry.Slut() < 30) {
		if(terry.Relation() < 30) {
			Text.Add("The [foxvixen] immediately hugs [hisher] chest. <i>“Quit it!”</i> [heshe] protests.", parse);
			Text.NL();
			Text.Add("You sigh mentally and roll your eyes, but choose to listen. There’s nothing to be gained by making [himher] upset over something so trivial.", parse);
		}
		else if(terry.Cup() >= Terry.Breasts.Acup) {
			Text.Add("<i>“Umm… it’s kinda embarrassing when you stare at them like that,”</i> the [foxvixen] says, cupping [hisher] breasts.", parse);
			Text.NL();
			Text.Add("You smile slightly and shake your head. Terry really needs to stop being so shy; [heshe] has a perfectly nice set of breasts, so naturally you’re going to look at them.", parse);
		}
		else {
			Text.Add("<i>“I don’t see why you’re so fascinated with my chest. I got nothing but fur here,”</i> [heshe] states nonchalantly.", parse);
			Text.NL();
			Text.Add("You simply grin back; it’s just part of [hisher] charms, after all.", parse);
		}
	}
	else if(terry.Slut() < 60) {
		if(terry.Cup() >= Terry.Breasts.Acup) {
			parse["heft"] = terry.Cup() >= Terry.Breasts.Ccup ? " and hefting" : "";
			Text.Add("Terry cups [hisher] breasts, massaging[heft] them. <i>“You like them?”</i> [heshe] asks teasingly, <i>“Well, you’d better. Cuz it was you who gave them to me.”</i>", parse);
			Text.NL();
			Text.Add("You enthusiastically nod your head in agreement; you most certainly do like them.", parse);
		}
		else {
			Text.Add("<i>“I got nothing to offer up here, and ogling me like that isn’t going to make boobs sprout out of my chest,”</i> the [foxvixen] teases with a grin.", parse);
			Text.NL();
			Text.Add("[HeShe] has to admit, though, that’s a pretty entertaining thought, you shoot back.", parse);
		}
	}
	else {
		if(terry.Cup() >= Terry.Breasts.Acup) {
			Text.Add("<i>“If you keep staring at them like that, it feels like you’re going to wind up burning holes through my clothes,”</i> Terry teases. <i>“Not that I’d mind if you did, but replacing them might get expensive.”</i>", parse);
			Text.NL();
			Text.Add("Well, maybe you should just have [himher] go around naked; you think [heshe]’d like that.", parse);
			Text.NL();
			Text.Add("<i>“Ha! I will if you really want me to. But you’ll have to go naked yourself. If I’m going to be giving you eye-candy all the time, I expect the same treatment,”</i> [heshe] quips back.", parse);
			Text.NL();
			Text.Add("You shoot back that you’ll consider it, but right now, you want to keep looking at Terry.", parse);
		}
		else {
			Text.Add("<i>“You should know well that my best assets aren’t up here,”</i> the [foxvixen] says, patting [hisher] chest. <i>“But feel free to keep looking.”</i>", parse);
			Text.NL();
			Text.Add("Well, if [heshe] insists, why not? Still, there’s more of [himher] to look at...", parse);
		}
	}
	Text.NL();
	Text.Add("Your gaze sweeps down Terry’s form, toward [hisher] waist. ", parse);
	// Pregnancy
	var womb = terry.PregHandler().Womb();
	var stage = womb ? womb.progress : null;
	if     (womb && stage > 0.8)
		Text.Add("Seems like Terry’s pregnancy is in its final stages. The [foxvixen]’s belly is nice and round. When you put your hand on [hisher] belly, you can feel the baby inside kick you. The big belly coupled with the [foxvixen]’s sometimes distant gaze make [himher] look very attractive...", parse);
	else if(womb && stage > 0.6)
		Text.Add("[HisHer] pregnancy has come a long way. You don’t think there’s much more [heshe] can grow before [heshe]’s ripe for birthing a little fox into the world. Terry sometimes rubs [hisher] belly with a smile, it’s clear that despite the burdens [hisher] pregnancy have imposed on [himher], [heshe]’s looking forward to popping the little fox out.", parse);
	else if(womb && stage > 0.4)
		Text.Add("Terry’s belly is growing nicely. The [foxvixen] sometimes has cravings, but that’s to be expected of a pregnant [foxvixen]. At least [heshe]’s not feeling sick anymore. You gotta say though, this pretty belly of [hishers] makes [himher] look very feminine and attractive. Maybe you should consider calling Terry over for some alone time later...", parse);
	else if(womb && stage > 0.2)
		Text.Add("[HisHer] belly’s developing a nice paunch, and you can see that [hisher] pregnancy is taking its toll on the poor [foxvixen]. Sometimes Terry looks sick or tired, but that only lasts an instant before the [foxvixen] recomposes [himher]self.", parse);
	else
		Text.Add("Your [foxvixen] is nicely trim, lean, flat-bellied and perfectly suited for sneaking through windows or wriggling under couches. But there’s not really anything else to say about it, so your gaze keeps sweeping down toward [hisher] loins...", parse);
	Text.NL();
	if(terry.FirstCock()) {
		if(terry.HorseCock()) {
			Text.Add("A rather stark contrast to the rest of the [foxvixen]’s form, between Terry’s thighs rests a proud piece of stallion-cock, far larger than [hisher] old dick. Mottled brown in color, its flaccid state boasts an area of nine inches long and one and a half inches thick. At full mast, however, it grows even bigger, bringing home a massive thirteen inches in length and two and a half inches thick.", parse);
			Text.NL();
			Text.Add("It’s a lot more sensitive than [hisher] old fox-prick, and [heshe] can get going with just a little attention there. Despite the new form, it hasn’t entirely changed from before; [heshe] still has a knot at the base of [hisher] cock, though it’s much bigger than it used to be. [HisHer] balls have practically doubled in size, heavy with churning loads of cum. Sometimes you wonder if it’s even possible for the [foxvixen] to run dry...", parse);
		}
		else
			Text.Add("Between [hisher] thighs lies [hisher] dainty little vulpine dick. When fully erect, it’s a below-average red piece of meat, four inches long and an inch thick. Below it lies a pair of pretty little trappy-balls that cling closely to [hisher] crotch. It’s no surprise that [heshe] can disguise [himher]self as a normal woman so easily. Even when it’s fully erect, it looks too cute to be on a guy.", parse);
		Text.NL();
	}
	if(terry.FirstVag()) {
		parse["c"] = terry.FirstCock() ? Text.Parse(", behind [hisher] [tcockDesc]", parse) : "";
		Text.Add("[HeShe] has a dainty little feminine pussy between [hisher] legs[c]. It’s wet, shiny, and seemingly just waiting to be stuffed with an inquisitive cock, tongue or fingers. If you stimulate it enough, Terry can’t help but squirt a nice gush of vixen-juice, ", parse);
		if(terry.Slut() < 45)
			Text.Add("much to [hisher] embarrassment.", parse);
		else
			Text.Add("a quirk [heshe]’s come to appreciate.", parse);
		Text.NL();
	}
	parse["ns"] = terry.Slut() >= 60 ? "seductively" : "nervously";
	Text.Add("Done admiring what lies between your [foxvixen]’s legs, your gaze sweeps down over [hisher] legs. A girlishly curvy set of hips helps to support a definitely non boyish bubble-butt; Terry’s tail flicks [ns] over a perky ass, more than enough to fill your groping hands if you were to take a grab. Slender, shapely plantigrade legs stretch down, ending in partially paw-like feet. [HeShe] has pads on the balls of [hisher] feet, so [hisher] footprints would resemble those of a real fox.", parse);
	Text.NL();
	Text.Add("Your investigation complete, you nod your head in satisfaction.", parse);
	Text.Flush();
}

Scenes.Terry.Prompt = function() {
	var parse = {
		foxvixen : terry.mfPronoun("fox", "vixen"),
		HeShe   : terry.HeShe(),
		heshe   : terry.heshe(),
		HisHer  : terry.HisHer(),
		hisher  : terry.hisher(),
		himher  : terry.himher(),
		hishers : terry.hishers()
	};
	
	var that = terry;
	var switchSpot = party.location.switchSpot();
	
	var options = new Array();
	options.push({ nameStr : "Appearance",
		func : Scenes.Terry.Appearance, enabled : true,
		tooltip : "Take a closer look."
	});
	options.push({ nameStr : "Talk",
		func : function() {
			Text.Clear();
			Text.Add("<i>“You want to talk? What about?”</i>", parse);
			Text.Flush();
			
			Scenes.Terry.TalkPrompt();
		}, enabled : true,
		tooltip : "Have a chat with Terry."
	});
	options.push({ nameStr : "Pet",
		func : Scenes.Terry.SkinshipPrompt, enabled : true,
		tooltip : Text.Parse("Play around with your pretty little [foxvixen]; [heshe] looks like [heshe] could use a good petting.", parse)
	});
	options.push({ nameStr : "Sex",
		func : function() {
			Text.Clear();
			if(terry.Relation() >= 60) {
				parse["h"] = player.Height() > terry.Height() + 5 ? Text.Parse(" getting on [hisher] tiptoes,", parse) : "";
				Text.Add("The [foxvixen] walks up to you with a smile,[h] and gives you a peck on the lips. <i>“Of course this is a booty call,”</i> [heshe] grins, wagging [hisher] fluffy tail.", parse);
			}
			else if(terry.Relation() >= 30)
				Text.Add("<i>“Sex, huh?”</i> [heshe] says with a grin, closing the distance. <i>“Alright, I don’t mind putting out for you.”</i> [HeShe] pokes your belly playfully before taking a step back.", parse);
			else
				Text.Add("<i>“Okay, if you want me, I guess I don’t have much choice,”</i> [heshe] says nonchalantly.", parse);
			Text.NL();
			Scenes.Terry.SexPrompt(terry.Interact);
		}, enabled : true,
		tooltip : Text.Parse("Terry is a sexy [foxvixen], why not have some fun with [himher]?", parse)
	});
	//TODO
	options.push({ nameStr: "Release",
		func : function() {
			Text.Clear();
			Text.AddOutput("[Placeholder] Terry masturbates fiercely, cumming buckets.");
			
			world.TimeStep({minute : 10});
			
			that.OrgasmCum();
			
			Gui.NextPrompt(function() {
				that.Interact(switchSpot);
			});
		}, enabled : true,
		tooltip : "Pleasure yourself."
	});
	//Equip, stats, job, switch
	that.InteractDefault(options, switchSpot, true, true, true, true);
	
	Gui.SetButtonsFromList(options, true, PartyInteraction);
}

Terry.prototype.Act = function(encounter, activeChar) {
	// TODO: AI!
	Text.AddOutput("The thief hops around nimbly.");
	Text.Newline();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);
	
	var first = this.turnCounter == 0;
	this.turnCounter++;
	
	if(first) {
		Items.Combat.DecoyStick.UseCombatInternal(encounter, this);
		return;
	}
	
	var choice = Math.random();
	
	if(this.turnCounter > 4 && this.sbombs > 0)
		Items.Combat.SmokeBomb.UseCombatInternal(encounter, this);
	else if(Abilities.Physical.Backstab.enabledCondition(encounter, this) && Abilities.Physical.Backstab.enabledTargetCondition(encounter, this, t))
		Abilities.Physical.Backstab.Use(encounter, this, t);
	else if(choice < 0.2 && Abilities.Physical.Kicksand.enabledCondition(encounter, this))
		Abilities.Physical.Kicksand.Use(encounter, this, t);
	else if(choice < 0.4 && Abilities.Physical.Swift.enabledCondition(encounter, this))
		Abilities.Physical.Swift.Use(encounter, this);
	else if(choice < 0.6)
		Items.Combat.PoisonDart.UseCombatInternal(encounter, this, t);
	else if(choice < 0.8)
		Items.Combat.LustDart.UseCombatInternal(encounter, this, t);
	else if(Abilities.Physical.DirtyBlow.enabledCondition(encounter, this))
		Abilities.Physical.DirtyBlow.Use(encounter, this, t);
	else
		Abilities.Attack.Use(encounter, this, t);
}

Scenes.Terry.ExploreGates = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("With a nod of agreement to each other, you and Miranda start investigating the area, looking for potential hiding spots or clues that could help you catch this thief.", parse);
	Text.NL();
	if(terry.flags["Met"] >= Terry.Met.Found) {
		Text.Add("As best you can, the pair of you make your way through the crowds, looking for the slightest sign of the thief you're chasing, eyes ever alert for a telltale vulpine form. With the sheer number of people here, it doesn't make your task easy, and you keep having to push your way through the scrum.", parse);
		Text.NL();
		if(terry.hidingSpot == world.loc.Rigard.Gate) {
			Text.Add("Your search finally pays off when you see a vulpine tail rounding a corner toward an alleyway. You signal to Miranda and she opens a path in the crowd so you can give chase. As soon as she notices she’s being followed she makes a mad dash toward the other side. <i>“Dammit!</i> Miranda curses as she rushes ahead. You follow in tow.", parse);
			Text.NL();
			Text.Add("After a while she finally makes a mistake and rounds a corner on a dead end. Without so much a batting an eye she readies herself for combat!", parse);
			Text.Flush();
			
			Scenes.Terry.CombatVsMiranda();
			return;
		}
		else {
			Text.Add("In the end you come back empty-handed. Wherever the vixen is, she doesn’t seem to be here.", parse);
			Text.NL();
			Text.Add("<i>“Come on, let’s look somewhere else,”</i> Miranda says in annoyance, pushing a path open in the crows so the two of you can get out.", parse);
		}
	}
	else {
		Text.Add("Despite your exhaustive efforts at searching, it all comes to naught - there isn't a single trace of a clue to be found here. Eventually, Miranda declares it's time to look somewhere else.", parse);
	}
	Text.Flush();
	world.TimeStep({minute : 30});
	
	Gui.NextPrompt();
}
Scenes.Terry.ExploreResidential = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("With a nod of agreement to each other, you and Miranda start investigating the area, looking for potential hiding spots or clues that could help you catch this thief.", parse);
	Text.NL();
	
	if(terry.flags["Met"] >= Terry.Met.Found) {
		Text.Add("You decide to look around and ask a few people. Someone might’ve seen her. ", parse);
		if(terry.hidingSpot == world.loc.Rigard.Residental.street) {
			Text.Add("After a long string of complaints, annoyed comments and plain rudeness, one of the residents finally provides a lead.<i>“A vixen? You mean that one?”</i> they point toward an alleyway, where you see a distinct vulpine running off.", parse);
			Text.NL();
			Text.Add("Without missing a beat you call for Miranda and make a mad dash after the thief. You chase after her for a while, until Miranda manages to corner her at a dead end. She draws her blade and prepares for battle!", parse);
			Text.Flush();
			
			Scenes.Terry.CombatVsMiranda();
			return;
		}
		else {
			Text.Add("After a long string of complaints, annoyed comments and plain rudeness, Miranda approaches you. <i>“Any luck?”</i>", parse);
			Text.NL();
			Text.Add("You shake your head.", parse);
			Text.NL();
			Text.Add("<i>“Dammit! When I catch that thief...”</i> she trails off into a growl, signalling you to follow.", parse);
		}
	}
	else {
		Text.Add("You do your best to search, questioning people if they have seen anything strange and poking your nose into any likely looking corner, but in the end, you come up empty-handed. Looking toward Miranda, she shakes her head with a disgusted grimace; evidently her luck was no better than yours. It looks like your thief isn't here.", parse);
	}
	Text.Flush();
	world.TimeStep({minute : 30});
	
	Gui.NextPrompt();
}
Scenes.Terry.ExploreMerchants = function() {
	var parse = {
		weapon : player.WeaponDesc()
	};
	
	Text.Clear();
	Text.Add("With a nod of agreement to each other, you and Miranda start investigating the area, looking for potential hiding spots or clues that could help you catch this thief.", parse);
	Text.NL();
	
	if(terry.flags["Met"] >= Terry.Met.Found) {
		if(terry.hidingSpot == world.loc.Rigard.ShopStreet.street) {
			Text.Add("You and Miranda wander through the warehouses of the merchant’s district, looking for any sign of the sleek vixen. The two of you check a few of them before you catch a glimpse of a moving shadow. Without thinking you rush ahead, Miranda following after you, and as soon as round the corner you’re faced with the vixen thief, already ready for combat!", parse);
			Text.Flush();
			Scenes.Terry.CombatVsMiranda();
			return;
		}
		else {
			Text.Add("Though you and Miranda search the many warehouses, you find no sign of the vulpine thief. It appears she hasn't returned here since you flushed her out before.", parse);
		}
	}
	else {
		Text.Add("As you consider your options for searching the place, you note it's unlikely that a thief would be hiding in one of the stores. Turning to the long-term resident, you ask Miranda if she has any opinions on where would be likely prospects for ‘good hiding spots’ here.", parse);
		Text.NL();
		Text.Add("Miranda shrugs. <i>“There’s always the warehouses. Not much movement around there even during normal days.”</i>", parse);
		Text.NL();
		Text.Add("You reply that it would probably be best to try searching the warehouses first, in that case.", parse);
		Text.NL();
		Text.Add("<i>“Right, this way.”</i>", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("Despite your efforts, so far the search has been for nothing; you're both empty-handed despite how thoroughly you keep checking. You are just about to leave the warehouse district and search elsewhere when you spot something; a warehouse with its doors ajar. Recalling Miranda said there isn't much activity here even when things are normal, you deem that suspicious and call her attention to it, suggesting that you should both check it out.", parse);
			Text.NL();
			Text.Add("Miranda boldly walks up to the door and kicks it open. <i>“Hey! Is the bastard that stole Krawitz stuff here?”</i>", parse);
			Text.NL();
			Text.Add("...That's Miranda for you. ", parse);
			if(player.SubDom() > 0)
				Text.Add("She really wouldn't know subtlety if it bit her on the ass, would she?", parse);
			else
				Text.Add("There are times when she's a little too direct, even for your taste.", parse);
			Text.Add(" Much to your surprise, you hear a gasp and the sound of metal hitting the floor.", parse);
			Text.NL();
			Text.Add("<i>“Get your weapon ready,”</i> Miranda snarls, taking her sword in her hands and assuming a battle stance. You follow her lead as Miranda shouts, <i>“Show yourself!”</i>", parse);
			Text.NL();
			Text.Add("The two of you wait patiently, but when no reply comes Miranda takes a step forward. Immediately you note a small sphere flying toward her. She has no time to react as the sphere bursts open into a cloud of dust, temporarily blinding the canine guard. <i>“Shit!”</i> she exclaims trying to shake off the dust.", parse);
			Text.NL();
			Text.Add("Thankfully you manage to protect your eyes, and by the time you uncover them you’re faced with a blur heading your way, no doubt making a run for it! You quickly strike them with your [weapon], narrowly missing your mark as the blur takes a step back. Their mask comes loose, falling on the ground, as it does so you’re faced with a familiar face. It’s the vixen from the Lady’s Blessing!", parse);
			Text.NL();
			Text.Add("She's traded her uniform for a practical, tight-fitting suit of leather armor. A hood rises from the neck to cover her scalp and partially obscure her features, its long sleeves and pant-legs reaching to her wrists and ankles, but tight against the limbs so as to not get in the way. Bracers and pads add a little extra protection, and the front sports a number of pockets and a holster covered in pouches wrapped diagonally around her chest. All in all, perfect gear for a thief.", parse);
			Text.NL();
			Text.Add("<i>“Dammit!”</i> she yells, grabbing a dagger and entering her battle stance.", parse);
			Text.NL();
			Text.Add("<i>“Alright asshole, it’s personal now,”</i> Miranda growls as she steps by your side, eyes red from the thief’s initial attack.", parse);
			Text.Flush();
			Scenes.Terry.CombatVsMiranda();
			return;
		});
		
		
		terry.flags["Met"] = Terry.Met.Found;
		
		return;
	}
	
	Text.Flush();
	world.TimeStep({minute : 30});
	
	Gui.NextPrompt();
}
Scenes.Terry.ExplorePlaza = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	
	if(terry.flags["Met"] >= Terry.Met.Found) {
		Text.Add("With a nod of agreement to each other, you and Miranda start investigating the area, looking for potential hiding spots or clues that could help you catch this thief.", parse);
		Text.NL();
		Text.Add("Luckily for you, the bustling movement of the people here makes the plaza seem more crowded than it really is, and there aren't that many places to hide anyway. Thusly, if the thief is here, you have a chance of finding her.", parse);
		Text.NL();
		if(terry.hidingSpot == world.loc.Rigard.Plaza) {
			Text.Add("As you make your way through the crowds, you feel someone walk straight into you, having been looking over their shoulder and not watching where they were going. As you shake your head to recover, you find yourself looking right into the eyes of the vixen you were chasing! She yelps in shock and tries to run away, but the crowd is in the path and so she is cornered inadvertently by the scrum. You shout at her to halt, and she replies by drawing her weapons, sending the crowd fleeing and bringing Miranda running to assist.", parse);
			Text.Flush();
			Scenes.Terry.CombatVsMiranda();
			return;
		}
		else {
			Text.Add("You find yourself bumped, shoved, sworn at, shouted over and generally given the run around as you try fording through the seething crowd of people. Eventually, you fight your way free of the crowd and find Miranda quickly joining you, the doberherm watchdog visibly growling in frustration as you shake your head. Evidently, you'll need to try searching elsewhere.", parse);
		}
	}
	else {
		if(miranda.Attitude() >= Miranda.Attitude.Neutral) {
		Text.Add("<i>“[playername], this place is already packed with guards. Do you really think a thief would hide here where everyone can see them?”</i> she asks you with obvious disdain.", parse);
		Text.NL();
		Text.Add("Even a cursory glance around makes you agree with Miranda's opinion, and you nod your head as you tell her so.", parse);
		Text.NL();
		Text.Add("<i>“Then let’s look elsewhere.”</i>", parse);
		}
		else {
			Text.Add("<i>“Use your head and think for once, this place is already packed with guards, plus there’s nowhere to hide. A thief wouldn’t dream of attempting to stay incognito here.”</i>", parse);
			Text.NL();
			Text.Add("It's hardly necessary to look to see that Miranda does have a valid point, and you waste no time in agreeing with her that it'd be better to try searching elsewhere.", parse);
			Text.NL();
			Text.Add("<i>“Let’s get out of here.”</i>", parse);
		}
	}
	Text.Flush();
	world.TimeStep({minute : 30});
	
	Gui.NextPrompt();
}

Scenes.Terry.CombatVsMiranda = function() {
	var enemy = new Party();
	enemy.AddMember(terry);
	var enc = new Encounter(enemy);
	
	terry.RestFull();
	terry.turnCounter = 0;
	terry.flags["PrefGender"] = Gender.female;
	
	enc.canRun = false;
	
	enc.onLoss = function() {
		var parse = {
			
		};
		
		SetGameState(GameState.Event);
		Text.Clear();
		Text.Add("Smirking, the vixen jumps over you and dashes away. You rub your sore spots and with some effort manage to get back up. Miranda looks like she’s going to pop a vein…", parse);
		Text.NL();
		Text.Add("<i>“That damn bitch! I’m gonna get her, get her good next time!”</i> she fumes. Looking at you, she calms down some and sheathes her sword. <i>“Let’s regroup at the gates and chase after that bitch again.”</i>", parse);
		Text.NL();
		Text.Add("You nod and follow after Miranda.", parse);
		Text.Flush();
		
		party.location = world.loc.Rigard.Gate;
		world.TimeStep({minute: 30});
		
		party.RestFull();
		
		// Move Terry
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			terry.hidingSpot = world.loc.Rigard.Gate;
		}, 1.0, function() { return terry.hidingSpot != world.loc.Rigard.Gate; });
		scenes.AddEnc(function() {
			terry.hidingSpot = world.loc.Rigard.Residental.street;
		}, 1.0, function() { return terry.hidingSpot != world.loc.Rigard.Residental.street; });
		scenes.AddEnc(function() {
			terry.hidingSpot = world.loc.Rigard.ShopStreet.street;
		}, 1.0, function() { return terry.hidingSpot != world.loc.Rigard.ShopStreet.street; });
		scenes.AddEnc(function() {
			terry.hidingSpot = world.loc.Rigard.Plaza;
		}, 1.0, function() { return terry.hidingSpot != world.loc.Rigard.Plaza; });
		
		scenes.Get();
		
		Gui.NextPrompt();
	}
	enc.onRun = function() {
		var parse = {
			
		};
		terry.sbombs--;
		SetGameState(GameState.Event);
		Text.Clear();
		Text.Add("When the smoke clears, the vixen is nowhere to be seen. Miranda looks like she’s going to pop a vein…", parse);
		Text.NL();
		Text.Add("<i>“That damn bitch! I’m gonna get her, get her good next time!”</i> she fumes. Looking at you, she calms down some and sheathes her sword. <i>“She can’t have gone far, lets continue looking!”</i>", parse);
		Text.NL();
		Text.Add("You nod and follow after Miranda.", parse);
		Text.Flush();
		
		world.TimeStep({minute: 30});
		
		// Move Terry
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			terry.hidingSpot = world.loc.Rigard.Gate;
		}, 1.0, function() { return terry.hidingSpot != world.loc.Rigard.Gate; });
		scenes.AddEnc(function() {
			terry.hidingSpot = world.loc.Rigard.Residental.street;
		}, 1.0, function() { return terry.hidingSpot != world.loc.Rigard.Residental.street; });
		scenes.AddEnc(function() {
			terry.hidingSpot = world.loc.Rigard.ShopStreet.street;
		}, 1.0, function() { return terry.hidingSpot != world.loc.Rigard.ShopStreet.street; });
		scenes.AddEnc(function() {
			terry.hidingSpot = world.loc.Rigard.Plaza;
		}, 1.0, function() { return terry.hidingSpot != world.loc.Rigard.Plaza; });
		
		scenes.Get();
		
		Gui.NextPrompt();
	}
	enc.onVictory = Scenes.Terry.CaughtTheThief;
	/*
	enc.onEncounter = ...
	enc.VictoryCondition = ...
	*/
	Gui.NextPrompt(function() {
		enc.Start();
	});
}

Scenes.Terry.CaughtTheThief = function() {
	var parse = {
		playername : player.name,
		masterMistress : player.mfTrue("master", "mistress")
	};
	
	SetGameState(GameState.Event);
	rigard.Krawitz["Q"] = Rigard.KrawitzQ.CaughtTerry;
	
	terry.flags["PrefGender"] = Gender.male;
	
	var dom = player.SubDom() - miranda.SubDom();
	
	Text.Clear();
	Text.Add("As soon as the vixen is down, Miranda strides over to her and roughly pins her down on the floor. <i>“Got you now, thief!”</i>", parse);
	Text.NL();
	Text.Add("The vixen struggles, but she has no strength left, and you doubt it would make a difference if she did. <i>“Get off me! You stupid lapdog!”</i>", parse);
	Text.NL();
	Text.Add("<i>“Oh, she has fire!”</i> Miranda comments grabbing her sword and stabbing the ground right beside the vixen thief.", parse);
	Text.NL();
	Text.Add("Taken aback by the unspoken threat, vixen yelps, making Miranda laugh. <i>“Okay, you mangy mutt, you’re going to tell me where you’ve stashed your loot now or should I extract the information out of you?”</i>", parse);
	Text.NL();
	Text.Add("The vixen swallows audibly…", parse);
	Text.NL();
	if(party.location == world.loc.Rigard.ShopStreet.street)
		Text.Add("<i>“I-it’s in that warehouse over there,”</i> she squeaks, pointing across the street. Her eyes never leave Miranda’s face.", parse);
	else
		Text.Add("<i>“I… I hid it in a warehouse in the merchant district!”</i> she squeaks, eyeing Miranda fearfully.", parse);
	Text.Flush();
	
	world.TimeStep({minute: 30});
	
	Gui.NextPrompt(function() {
		Text.Clear();Text.Add("Following the thief’s directions, you make your way into the appointed warehouse. The doors are locked, not that it makes any difference. Miranda shatters the lock, and latch, with a well placed kick, making both you and the thieving vixen cringe. ", parse);
		Text.NL();
		Text.Add("You look inquisitively at your surroundings, trying to see if you can spot where the vixen might’ve stashed the goods. Miranda closes the door behind you and pushes the defeated vixen to your side. Her arms are tied behind her back by a sturdy rope knotted around her wrists, the free end trailing back into Miranda's firm grasp. Not seeing any signs, you turn your attention back toward the thief.", parse);
		Text.NL();
		Text.Add("<i>“It’s inside those boxes,”</i> the thief says indignantly. Miranda simply gives you a look and nods toward the boxes.", parse);
		Text.NL();
		Text.Add("Needing no further prompting, you walk over to the indicated crates and, with a little effort, manage to pull them apart, revealing a bulging sack that a quick glance proves is filled with stolen property.", parse);
		Text.NL();
		Text.Add("<i>“Good girl,”</i> Miranda says patting the smaller vixen’s head patronizingly. <i>“Now before I lock you up, I’m going to take revenge for making me hunt you all over the town.”</i>", parse);
		Text.NL();
		Text.Add("<i>“What!? I already told you where the stuff is, what more do you want?”</i> the vixen protests.", parse);
		Text.NL();
		Text.Add("Miranda doesn’t bother with a reply, she roughly grabs the thief’s pants and with a quick tug pulls them down, exposing the vixen’s butt and her cock. Shaking your head you take another glance, cock?", parse);
		Text.NL();
		Text.Add("Miranda cackles like a hyena in laughter, grabbing the vixen’s below-average sheath and checking behind. <i>“What a nice surprise! So you’re actually a boy?”</i> she asks, checking behind her… his balls. <i>“Nothing, what a kinky slut you are, mr. thief.”</i>", parse);
		Text.NL();
		Text.Add("<i>“C-Cut it out! So what if I’m a guy?”</i>", parse);
		Text.NL();
		Text.Add("Miranda forces the fox down on his knees, eliciting a yelp. <i>“Pretty thing like you is too girly to be a guy,”</i> Miranda teases. <i>“I’m gonna show you what’s it like to be a real man,”</i> Miranda says, pulling her pants down and letting her half-erect doggy-dong flop against the trembling fox’s shoulder.", parse);
		Text.NL();
		Text.Add("You realise that Miranda's serious about this; she's in one of her moods again. What should you do?", parse);
		Text.Flush();
		
		world.TimeStep({minute: 30});
		
		//[LetHer][StopHer][TakeHim]
		var options = new Array();
		options.push({ nameStr : "Let her",
			func : function() {
				Text.Clear();
				Text.Add("Miranda spins the poor fox around, making him come face to cock with Miranda’s shaft. <i>“You’d better do a good job blowing me, slut. This is all the lube you’re going to get when I fuck your ass later,”</i> Miranda warns him, shoving her cock against his cheek.", parse);
				Text.NL();
				Text.Add("He tries his best to look away to no avail, he opens his mouth to utter a protest, which winds up being a terrible mistake as Miranda takes the opportunity to shove half of her eleven inches of doghood down his throat.", parse);
				Text.NL();
				Text.Add("You hear a muffled gurgle as Miranda begins to mercilessly ram her way down his throat.", parse);
				Text.NL();
				if(miranda.Attitude() >= Miranda.Attitude.Neutral)
					Text.Add("You can't help but wince at the unusual roughness with which Miranda starts fucking the thief. If that's how she tends to act when angry, maybe you should avoid getting on her bad side...", parse);
				else
					Text.Add("You actually feel a pang of sympathy for the thief. You can remember being on the receiving end of Miranda when she's in that sort of mood all too vividly.", parse);
				Text.Add(" Silently you stand by and watch as Miranda unceremoniously fucks the fox's face, grunting lewdly to herself with effort as she slaps her cock back and forth down his throat. The thief tries his hardest, but he's ultimately little more than a living onahole, casting pleading looks in your direction as he does his best not to choke on her dick.", parse);
				Text.NL();
				Text.Add("<i>“What a nice throat you have, you dirty fox, but let’s not get ahead of ourselves,”</i> Miranda says pulling out of the fox’s abused mouth. He gasps and coughs, thankful for the opportunity to breathe fresh air. Unfortunately it seems his ordeal is just not over yet. Miranda roughly grabs him and pins him down on the floor, butt up in the air as she teases him one more time before finally taking him, <i>“Get ready fox, I’m gonna split you in two!”</i> She pushes forward.", parse);
				Text.NL();
				Text.Add("Before she can press into his tight butthole, the doors of the warehouse burst open.", parse);
				Text.Flush();
				
				terry.relation.DecreaseStat(-100, 5);
				miranda.relation.IncreaseStat(100, 3);
				
				terry.flags["Met"] = Terry.Met.LetHer; // "0"
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "What does it matter if you let the angry, horny herm vent her frustrations on some common thief? Who's it really going to hurt? Besides, you're sure that she'll appreciate your looking the other way."
		});
		options.push({ nameStr : "Stop her",
			func : function() {
				Text.Clear();
				Text.Add("In her distracted state, Miranda doesn't notice you approaching until you've already shoved her firmly away from the trappy fox-thief. As she scrambles back to her feet, you make a show of firmly planting yourself in front of him, making it clear you won't let her get back to him. ", parse);
				if(miranda.Attitude() >= Miranda.Attitude.Neutral) {
					Text.Add("<i>“Hey! What the hell are you doing [playername]?”</i> she protests.", parse);
					Text.NL();
					if(dom > 50) {
						Text.Add("Stopping her, you reply calmly. You don't want her fucking this thief - does your bitch have a problem with that?", parse);
						Text.NL();
						Text.Add("<i>“But this bastard made us chase after him through the whole town!”</i> Miranda protests. It’s obvious she’s frustrated, normally she’d never talk back to you like this. Still you won’t budge on that. You said no, and that’s final.", parse);
						Text.NL();
						Text.Add("<i>“Listen here [playername]. I <b>am</b> your bitch, I don’t deny that. I’d be happy to take your orders and shut up anytime, but this bastard,”</i> she points at the fox, <i>“made it personal! So Aria help me, I’m going to wreck his ass!”</i>", parse);
						Text.NL();
						Text.Add("The two of you yell at each other as you scold Miranda. The thief doesn’t utter a single peep through this whole discussion, but you do detect a that he’s at least relieved you didn’t let Miranda have her way. You’re about to add something on top of your arguments when the doors to the warehouse burst open.", parse);
					}
					else {
						Text.Add("Keeping her from making a big mistake, you tell her. What she was planning is not right and she knows it; she caught the thief, she'll get the glory, leave it at that.", parse);
						Text.NL();
						Text.Add("<i>“After this bastard made us chase after his tail through the whole city? You’ve gotta be kidding me!”</i>", parse);
						Text.NL();
						Text.Add("You shake your head and insist that you mean what you say; you won't let her do this. It's not right.", parse);
						Text.NL();
						Text.Add("<i>“Don’t you dare tell me what’s right or wrong in <b>my</b> city, [playername]. If you care so much I have no problem letting you take his place, but Aria forbids me, I’m going to wreck someone’s ass over this!”</i>", parse);
						Text.NL();
						Text.Add("The two of you argue vehemently, hurling statement and rebuttal back and forth like knives, the stubborn bitch refusing to back down a foot and doing everything she can to force you to let her past, something you refuse to do. You're dimly aware that the thief remains on his knees behind you throughout the argument, and you can sense relief from him at your unexpected salvation of his anus. Things are just starting to get particularly heated when the doors to the warehouse are violently thrown open.", parse);
					}
				}
				else {
					Text.Add("<i>“What the- you’ve got some nerve pushing me around [playername],”</i> she growls.", parse);
					Text.NL();
					if(miranda.Sexed()) {
						Text.Add("Despite your natural nervousness, you manage to square your shoulders and shake your head, insisting you won't let her do this. Remembering the things she's done to you adds a little stiffness to your spine; you refuse to let her do those same things to someone else! ...Though, privately, you yourself can't tell if it's nobility or jealousy that makes you unable to stand the thought.", parse);
						Text.NL();
						Text.Add("<i>“So the slut’s jealous someone might be stealing their thunder… Well don’t worry, I’ve got enough in me for both of you, now step aside.”</i>", parse);
						Text.NL();
						Text.Add("A perverse thrill tickles down your spine, but you insistently shake your head and refuse to move.", parse);
						Text.NL();
						Text.Add("<i>“You’re making me mad, slut. And trust me, you won’t like me when I’m mad, now step aside before I decide to rip you apart as well!”</i> she threatens with a growl.", parse);
						Text.NL();
						Text.Add("As hard as it is for you, you manage to hold your ground, trying to convince Miranda to leave the thief alone, standing firm even in the face of her increasingly volatile and lewd threats, innuendoes and outright profanity. It comes as something of a relief when the warehouse doors suddenly slam open; you were so very close to losing your nerve and caving before her will.", parse);
					}
					else {
						Text.Add("You simply glare back and tell her to knock it off. She's made the collar, she's got what she needs, so she can stick her dick back in her pants where it belongs.", parse);
						Text.NL();
						Text.Add("She walks up to you with a growl, pointing a finger straight at you. <i>“You, step out of my way, now!”</i>", parse);
						Text.NL();
						Text.Add("Folding your arms over your chest, you shake your head.", parse);
						Text.NL();
						Text.Add("<i>“So the slut’s found some balls to stand up to me, huh? Well it’s either his ass or <b>your</b> ass. And trust me, if you thought I was being rough with you before you haven’t seen anything! Now step aside!”</i>", parse);
						Text.NL();
						Text.Add("That was the worst thing she could have said to try and make you back down; on general principle, you ball your fists and start calling her out, the enraged morph screaming back at you. It's almost a good thing when someone suddenly storms into the warehouse, distracting the pair of you; one more word either way, and you both know that the pair of you would have started swinging.", parse);
					}
				}
				Text.Flush();
				
				terry.relation.IncreaseStat(100, 3);
				miranda.relation.DecreaseStat(-100, 3);
				miranda.subDom.DecreaseStat(-100, 5);
				
				terry.flags["Met"] = Terry.Met.StopHer; // "1"
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Criminal or not, letting her rape him just isn't right. She's not going going to appreciate you interfering in her affairs, but it's still the noble thing to do."
		});
		if(player.FirstCock() || player.Strapon()) {
			options.push({ nameStr : "Take him",
				func : function() {
					Text.Clear();
					Text.Add("You protest to Miranda that it's not fair - you worked just as hard to catch this thief, you want a fair share of him too.", parse);
					Text.NL();
					if(miranda.Attitude() >= Miranda.Attitude.Neutral) {
						if(dom > 50) {
							Text.Add("<i>“Don’t worry about it, [masterMistress]. I’ll be done soon and then you can have your fun. Or if you can’t take waiting you can have your way with me while I plow this dirty fox,”</i> she replies pushing her dick against his lips.", parse);
							Text.NL();
							Text.Add("The offer to take Miranda instead is tempting, you have to admit, but your attention is more focused on the shapely fox femmeboi. So you interrupt Miranda, telling her that you want to go first.", parse);
							Text.NL();
							Text.Add("Miranda looks at you as if you’d just uttered nonsense. <i>“No offense, [playername]. But this bastard made us chase after him through the entire city, and I’m raring for some payback. Normally I’d be bending over and wagging my tail at you like a good bitch, but not this time, so deal with it.”</i>", parse);
							Text.NL();
							Text.Add("Drawing yourself up to your full height, you stare imperiously into Miranda's eyes and pointedly remind her of who calls the shots here. You say you want to fuck the thief first, so that's what's going to happen, and <b>she</b> can deal with it!", parse);
							Text.NL();
							Text.Add("Miranda's eyes glow with a spark of her old passion, and the two of you start to argue back and forth over who gets to claim him first. Just when you think you are starting to wear her will down, though, a loud banging from the doors signals an interruption as someone strides through into the warehouse.", parse);
						}
						else { // Nice
							Text.Add("<i>“Frustrated with this bastard too, huh? Not a problem, just wait in line while I lube him up for you,”</i> she replies pushing her dick against his lips.", parse);
							Text.NL();
							Text.Add("You tell Miranda that's not necessary - you intend to lube him up for her, instead.", parse);
							Text.NL();
							Text.Add("Miranda laughs at your statement. <i>“Oh, [playername]. You crack me up. But after chasing after this bastard through the entire city you gotta be kidding if you think I’m going to sit back and wait for you to be done. So get in line.”</i>", parse);
							Text.NL();
							Text.Add("You inform her that you won't get in line - if you let her at him first, you'll probably never get a chance to fuck him, and even if you do, she'll probably have stretched him all out to the point he's useless. No, you insist that you get to go first this time!", parse);
							Text.NL();
							Text.Add("The two of you fall to arguing over who gets first rights on the thief's tight little ass, getting so carried away that time slips away. You are dragged rudely back to reality at a loud clamour as the warehouse doors are violently thrown open and strangers march into the room to join you.", parse);
						}
					}
					else { // Nasty
						Text.Add("<i>“So the slut feels like pitching instead of receiving for once, huh? Fine, I’ll let you have seconds, since I’m in such a nice mood,”</i> she replies pushing her dick against his lips.", parse);
						Text.NL();
						Text.Add("Firsts, you reply - you want to have him first.", parse);
						Text.NL();
						Text.Add("<i>“Why you… you’ve got some nerve demanding to go first. I’ve been chasing after this asshole through the entire city, I’m mad, frustrated and pent up. So I’m going first and that’s final!” </i>", parse);
						Text.NL();
						Text.Add("Your frustration boils up and you find yourself shouting back that this time, you get to go first; you're sick of taking it and taking it from her all the time, you intend to fuck someone on your terms for once!", parse);
						Text.NL();
						Text.Add("The two of you devolve into a screaming match with each other, forgetting all about the thief as you instead focus on venting your hostilities toward one another. So caught up in it are the pair of you that you almost don't notice it when someone kicks in the warehouse doors and comes marching in. Almost.", parse);
					}
					Text.Flush();
					
					terry.relation.DecreaseStat(-100, 10);
					miranda.subDom.DecreaseStat(-100, 10);
					player.subDom.IncreaseStat(100, 3);
					
					terry.flags["Met"] = Terry.Met.TakeHim; // "2"
					
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Why should Miranda get to keep all the fun? You’ve worked just as hard to bust this fox."
			});
		}
		Gui.SetButtonsFromList(options, false, null);
		
		Gui.Callstack.push(function() {
			Text.NL();
			Text.Add("You quickly compose yourself and do your best to assess the situation. Beside you, you have a bound prisoner, naked from the waist down, and beside him is standing Miranda, dressed from the top up in a city watch outfit and naked from the waist down, an erection bobbing uneasily before her. In front of you, a detachment of armed and armored figures whose iconography makes it clear they belong to the royal guard. Really not a good scene to be caught in... at least <b>you</b> are still as dressed as you ever are; you look to be the only one acting somewhat professionally here. So, your reputation is probably safe... pity Miranda can't say the same.", parse);
			Text.NL();
			Text.Add("The guards are led by a man in his mid thirties wearing garish silver armour, polished to a shine. You can tell he is a man very preoccupied with his own appearance, as his short, jet-black hair has been meticulously cut and oiled. Neither his armor nor his makeup does anything to soften the expression of sneering contempt on his face, nor the bile in his voice.", parse);
			Text.NL();
			Text.Add("<i>“Men, look at this,”</i> the commander points at both Miranda and the thief, descending into laughter, his men following in tow as they see what he is laughing at. Miranda’s ears flatten as she grabs her pants and pulls them up.", parse);
			Text.NL();
			Text.Add("<i>“Isn’t this exactly what you’d expect of the watch? Cohorting with a common thief. Truly you cannot go lower than this.”</i>", parse);
			Text.NL();
			Text.Add("Miranda growls and steps toward the commander, <i>“Now you listen here-”</i>", parse);
			Text.NL();
			Text.Add("<i>“Shush dog! We’re here because we received information that the thief was holing up here, now be a good lapdog and go back to the watch. We will handle this since you’re obviously too busy with other issues to do your job. Men, haul this mangy mutt off to the prison.”</i>", parse);
			Text.NL();
			Text.Add("The royal guards waste not time in picking up the distraught fox and dragging him off, pants down and all. The ones not carrying the thief pick-up his loot and walk away as well. Once they’re out, the commander closes the door on two of you. Looking at Miranda she looks on the verge of blowing up.", parse);
			Text.NL();
			Text.Add("<i>“Goddammit!”</i> she yells as she angrily punches the floor, cracking the boards and sending splinters flying.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				party.location = world.loc.Rigard.Tavern.common;
				world.TimeStep({hour: 1});
				Text.Add("After Miranda calms down enough, you two somehow find yourselves at the Maidens' Bane. Word that the royal guard had <i>caught</i> the thief has spread and the blockade has been lifted. Miranda looks absolutely dejected, drowning her sorrows in a mugful of ale.", parse);
				Text.NL();
				Text.Add("<i>“Damn that pompous ass, making fun of me and taking credit for <b>my</b> hard work.”</i> She drains the entire mug, and pours herself another mugful. <i>“You’ve just had the pleasure of meeting Preston the Shining, the commander of the Royal Guard. Yes, he’s always that much of an ass.”</i>", parse);
				Text.NL();
				Text.Add("You can't really blame her for being upset in this situation. Maybe she'd like it if you offered her a little sympathy? Then again, there is that pride of hers to consider, too.", parse);
				Text.Flush();
				
				//[Comfort][Leave]
				var options = new Array();
				options.push({ nameStr : "Comfort",
					func : function() {
						Text.Clear();
						Text.Add("Shuffling a little close in your seat, you spread your arm over Miranda's shoulders, letting her feel your weight in a show of support. Gently, you assure her that you're on her side; the royal guard are damned fools, and she doesn't deserve what they did. But still, you know how hard she worked and what she did, and you respect her for how well she did. She should be proud of herself; while those puffed-up slugs were polishing their armor, she was out chasing down the thief and capturing him single-handedly - she's a real hero.", parse);
						Text.NL();
						Text.Add("Miranda smiles a bit at that and leans into you. ", parse);
						if(miranda.Attitude() >= Miranda.Attitude.Neutral) {
							Text.Add("<i>“Thanks [playername]. ", parse);
							if(dom > 50)
								Text.Add("I’m glad I have a [masterMistress] as nice you. I wouldn’t have made it without you.”</i>", parse);
							else
								Text.Add("I’m glad I have you around. That alone makes everything a little better. Thanks for all the help.”</i>", parse);
							Text.NL();
							Text.Add("You simply smile and hug her back, hand slipping down her side to further touch her in reassurance.", parse);
						}
						else {
							Text.Add("<i>“Thanks for that, [playername],”</i> she says, just enjoying the comfort of your embrace for a moment. <i>“Y’know? You’re not so bad. I’m thankful for the help, even if I forced you to do it.”</i>", parse);
							Text.NL();
							Text.Add("You tell her it wasn't so bad, and you're glad you managed to help her.", parse);
							Text.NL();
							Text.Add("<i>“Maybe I should be nicer to you from now on. I guess you don’t deserve the crap I throw at you all the time. Sorry for being a dick,”</i> she apologizes.", parse);
							if(miranda.flags["subCellar"] != 0)
								Text.Add(" <i>“And - uh - for locking you in my cellar and having sex with you for three days.”</i>", parse);
							Text.NL();
							Text.Add("Apology accepted, you reply, not wanting to press your luck. Getting back in her good books is enough for you.", parse);
						}
						Text.NL();
						Text.Add("The two of you sit like that for a while longer, till Miranda is done drinking. <i>“Thanks for everything, [playername]. I’ll see you around,”</i> she says, gathering her stuff and walking away.", parse);
						Text.NL();
						Text.Add("You watch her go before getting up and leaving yourself.", parse);
						Text.NL();
						
						party.RemoveMember(miranda);
						party.LoadActiveParty();
						party.location = world.loc.Rigard.Inn.common;
						world.TimeStep({hour: 1});
						
						if(party.Num() > 1) {
							parse["comp"] = party.Num() > 2 ? "Your companions are" : party.Get(1).name + " is";
							Text.Add("[comp] probably tired of waiting for you, you should hurry to the Lady’s Blessing.", parse);
							Text.NL();
						}
						Text.Add("You can’t deny that there’s a part of you that feels sorry for letting the thief take the blame for your own misdeeds at Krawitz’s. Maybe you should ask Miranda how he’s doing after she’s calmed down.", parse);
						
						Text.Flush();
						
						miranda.flags["Attitude"] = Miranda.Attitude.Nice;
						miranda.relation.IncreaseStat(100, 10);
						
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : Text.Parse("Show some sympathy for Miranda’s frustrated catch.[nasty]", {nasty: (miranda.Attitude() < Miranda.Attitude.Neutral) ? " Maybe she’ll come around and start being nicer to you." : ""})
				});
				options.push({ nameStr : "Leave",
					func : function() {
						Text.Clear();
						
						party.RemoveMember(miranda);
						party.LoadActiveParty();
						party.location = world.loc.Rigard.Inn.common;
						world.TimeStep({hour: 1});
						
						
						if(party.Num() > 1) {
							parse["comp"] = party.Num() > 2 ? "your companions" : party.Get(1).name;
							Text.Add("You pat Miranda on the back, announcing that you’re leaving and return to the Lady’s Blessing to find [comp].", parse);
						}
						else {
							Text.Add("You pat Miranda on the back, announcing that you’re leaving and leave her to her sorrows.", parse);
						}
						Text.NL();
						Text.Add("There’s a part of you that feels sorry for letting the thief take the blame for your own misdeeds at Krawitz’s. Maybe you should ask Miranda how he’s doing after she’s calmed down.", parse);
						Text.Flush();
						
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : "There’s nothing you can do or say about the matter. What is done, is done. You should probably go back to your own business."
				});
				Gui.SetButtonsFromList(options, false, null);
			});
		});
	});
}

Scenes.Terry.Release = function() {
	var parse = {
		playername : player.name,
		masterMistress : player.mfTrue("master", "mistress"),
		armorTopDesc : function() { return player.ArmorDesc(); }
	};
	
	terry.flags["Saved"] = Terry.Saved.Saved;
	
	Text.Clear();
	Text.Add("<i>“Halt! What business do you have here?”</i> You are quickly stopped by a guard as you approach the entrance to the jail. Remembering the letter that Rumi gave you, you fish through your belongings and retrieve it. Adopting your best officious expression, you present it to the guard on duty.", parse);
	Text.NL();
	Text.Add("The guard examines the seal of the letter before breaking it open and reading its contents. Once finished he returns the letter and mutters, <i>“Lucky mutt...”</i>", parse);
	Text.NL();
	if(party.InParty(miranda)) {
		Text.Add("You tell Miranda to hold back a bit. You don’t think it’d be a good idea to have her meet the thief right now.", parse);
		Text.NL();
	}
	
	Text.Add("He procures a keychain from his belt, and unlocks the door leading to the cells. <i>“Follow me.”</i>", parse);
	Text.NL();
	Text.Add("The two of you walk toward the back of the jail, passing through two more doors before arriving at an empty area where the guards lead you to a cell. Inside you see the fox thief, resting on his cot and looking at the roof. <i>“Hey mutt! Today’s your lucky day. Your ticket out of here has arrived.”</i>", parse);
	Text.NL();
	Text.Add("The fox chuckles at that. <i>“Yeah right, ain’t I lucky...”</i>", parse);
	Text.NL();
	Text.Add("Turning to you, the guard says, <i>“I’ll leave you two to socialize while I fetch his belongings.”</i> Having said that, he promptly turns on his heels and walks away.", parse);
	Text.NL();
	Text.Add("Stretching languidly, he moves to get himself up. <i>“Alright, let’s meet my bene-”</i> as soon as his eyes set on you he stops dead in his tracks. <i>“You!”</i>", parse);
	Text.NL();
	Text.Add("So, he remembers you then?", parse);
	Text.NL();
	if(terry.flags["Met"] == Terry.Met.LetHer) {
		Text.Add("<i>“You let that dog rape me! What’re you here for? Want to finish what you started?”</i>", parse);
		Text.NL();
		Text.Add("You tell him that, actually, no; you came to see him released.", parse);
		Text.NL();
		Text.Add("<i>“Oh I get it. You’re going to let that dog have another go at me! What are you? Some kind of sick voyeur?”</i>", parse);
		Text.NL();
		Text.Add("Miranda isn't even here, you inform him. This is a bail-out, pure and simple.", parse);
	}
	else if(terry.flags["Met"] == Terry.Met.StopHer) {
		Text.Add("<i>“Why are you releasing me? Weren’t you working with that dog to have me arrested?”</i>", parse);
		Text.NL();
		Text.Add("You admit that's true, but circumstances have changed.", parse);
		Text.NL();
		Text.Add("<i>“What do you mean, circumstances have changed? That dog… oh no, she’s not here is she?”</i>", parse);
		Text.NL();
		Text.Add("You assure him that Miranda isn't here. It's just you and him now.", parse);
	}
	else {
		Text.Add("<i>“You were going to rape me along with that dog! Why the hell are you here? Came to finish what you started?”</i>", parse);
		Text.NL();
		Text.Add("You reply that your actual intention was to save his life, but if he wants to pick up where the two of you were left off...", parse);
		Text.NL();
		Text.Add("<i>“Hell no! Keep your hands to yourself, I’m not going!”</i>", parse);
		Text.NL();
		Text.Add("So, he'd rather wait here for the executioner's axe? Or noose, or whatever it is they have planned for him? ", parse);
		Text.NL();
		Text.Add("<i>“No, but-”</i>", parse);
		Text.NL();
		Text.Add("Before he can get any further, you interrupt him. You're not going to make any excuses for what happened at the warehouse, but right now, all you intend is to get him out of jail and save his life. He can either trust you and keep his neck, or stay here and be executed.", parse);
	}
	Text.NL();
	Text.Add("The fox looks at you with distrust for a few moments, but then he visibly calms down. <i>“I suppose I don’t have a choice.”</i>", parse);
	Text.NL();
	Text.Add("That’s better. That wasn’t so difficult now, was it?", parse);
	Text.NL();
	Text.Add("<i>“They’re revoking the death sentence? What’s the catch?”</i> he asks.", parse);
	Text.NL();
	Text.Add("As part of the terms for his release, he needs to wear this, you inform him as you show him the collar. It has an enchantment in it that will prevent him from disobeying any command you give him, as well as preventing him from escaping. He needs to wear this before you can take him out of the cell. Having explained it, you hold it out to him and instruct him to fasten it around his neck.", parse);
	Text.NL();
	Text.Add("The fox thief takes the collar, examining it in his hands. He looks at you, then back at the collar, obviously unsure if this is actually better than a death sentence. Finally with a sigh, he acquiesces and puts the collar around his neck. <i>“Tch, out of the pan and into the fire...”</i> he mumbles as he connects the iron tips, holding the collar around his neck. It looks a bit loose… maybe if he tried he could get it off? Still you resolve to trust the twins’ word.", parse);
	Text.NL();
	Text.Add("You promptly say the word ‘Featherfall’, as you were instructed before.", parse);
	Text.NL();
	Text.Add("The collar emanates a faint pink glow, tightening up until it’s snug against the fox’s neck. He tries to grip the collar, scared that it might tighten enough to strangle him, but he’s ultimately unable to stop the magic from running its course. He moves to undo the binding, but the metallic tips refuse to let go. Seems like the enchantment worked like magic. <i>“There, it’s on,”</i> he says with disdain. <i>“I suppose you want me to call you [masterMistress] now?”</i>", parse);
	Text.NL();
	Text.Add("You think the matter over, and then tell him that he doesn’t have to. You might change your mind later, but for now, [playername] is all you expect him to call you.", parse);
	Text.NL();
	Text.Add("The guard returns, carrying with him a bag containing the thief’s stuff. <i>Here.</i> He hands it to you. <i>“Are you done yet? Can I open the cell?”</i>", parse);
	Text.NL();
	Text.Add("Yes, you reply. The guardsmen takes a key and twists it in the lock, opening the door. Without so much as a word, he takes the fox by the shoulder and shove him out of the cell and in your direction. <i>“He’s all yours, now get this mangy mutt out of my jail. Gonna have to kill all the fleas he left behind.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Don’t worry, I’m pretty sure your stench will do the job just fine,”</i> he quips back pinching his nose.", parse);
	Text.NL();
	Text.Add("Seeing the guard's angry expression, you tell your new... recruit... to follow you, before turning and heading for the jail's exit.", parse);
	Text.Flush();
	
	world.TimeStep({minute: 30});
	
	Gui.NextPrompt(function() {
		Text.Clear();
		
		party.location = world.loc.Rigard.Plaza;
		
		Text.Add("Once you’re back in the city, the fox pulls on your [armorTopDesc]. <i>“Hey, do you mind if I duck out in an alleyway to get dressed? These prison clothes are all itchy,”</i> he scratches his arm for emphasis.", parse);
		Text.NL();
		Text.Add("After a moment's thought, you tell him that'd be fine, privately trusting that the collar's magic will work as you were promised.", parse);
		Text.NL();
		Text.Add("<i>“Some privacy?”</i> he asks with a raised brow.", parse);
		Text.NL();
		Text.Add("A little less certainly, you nod your head and turn around, pointedly looking away from the effeminate fox-morph.", parse);
		Text.NL();
		Text.Add("You hear the sounds of ruffling cloth for a few moment, before he says, <i>“Done.”</i>", parse);
		Text.NL();
		Text.Add("Turning around, you take a good long look at the newly re-garbed fox. He's traded his former barmaid's dress and leather armor for a simple but good quality tunic and pants, both a little on the tight side. A leather cuirass drapes over his torso, and it looks like the guard even gave him back his chest holster, whilst his paw-like feet have been squeezed into knee-high leather boots.", parse);
		Text.NL();
		Text.Add("<i>“This isn’t as good as my previous gear, but it’ll have to do. Bet the bastard didn’t even look to see if it was the right bag… Thank Aria it fits.”</i> He kicks the bag and the prison clothes into a corner. <i>“Thanks chief.”</i>", parse);
		Text.NL();
		Text.Add("You inform him that it's no problem. Better he wasn't walking around in a prisoner's outfit anyway.", parse);
		Text.NL();
		Text.Add("As the two of you continue to walk in silence, he moves to walk beside you. <i>“Y’know, I didn’t really thank you for saving my neck. ", parse);
		if(terry.flags["Met"] == Terry.Met.StopHer)
			Text.Add("And for protecting me from that dog. ", parse);
		Text.Add("They say you should never look a gift horse in the mouth, but after our little encounter in the warehouse you gotta understand, I had my doubts.”</i>", parse);
		Text.NL();
		Text.Add("You tell him that's understandable.", parse);
		Text.NL();
		Text.Add("<i>“By the way, my name is Theodore. But everyone just calls me Terry. Thanks for rescuing me, [playername].”</i>", parse);
		Text.NL();
		Text.Add("Terry, huh? Well, it's no problem, you inform him; you couldn't let him get killed for stealing from the likes of Krawitz.", parse);
		Text.NL();
		Text.Add("<i>“So… out of curiosity, what exactly happens if I disobey you or try to run?”</i> he asks, tail swaying behind.", parse);
		Text.NL();
		parse["j"] = jeanne.flags["Met"] != 0 ? "Jeanne, " : "";
		Text.Add("You consider it for a moment, then finally decide to tell him the truth, admitting you don't really know. But you know the collar was made by [j]the Royal Court Mage, so he can probably figure it out himself.", parse);
		Text.NL();
		Text.Add("<i>“I see… so I guess I’m at your mercy. Lead away then?”</i>", parse);
		
		terry.topArmorSlot = Items.Armor.LeatherChest;
		terry.botArmorSlot = Items.Armor.LeatherPants;
		terry.Equip();
		terry.RestFull();
		
		terry.name = "Terry";
		terry.avatar.combat = Images.terry_c;
		terry.monsterName = null;
		terry.MonsterName = null;
		party.AddMember(terry);
		
		if(party.InParty(miranda)) {
			var dom = player.SubDom() - miranda.SubDom();
			
			Text.NL();
			Text.Add("Terry looks a bit nervous as you set out, constantly looking around as if he was being watched. His fears turn out to be justified, as Miranda steps out from a side street, a wide grin on her face.", parse);
			Text.NL();
			Text.Add("<i>“So the little thief is roaming the streets again, guess that means you are fair game!”</i> You tell her to stop teasing Terry, and introduce him to her.", parse);
			Text.NL();
			Text.Add("<i>“W-w-what?! She’s with you? B-but you said-!”</i> Terry swivels this way and that, desperately looking for a way to escape. You tell him to calm down, and remind him of the collar. For a moment, the effeminate fox looks like he’s going to chance it, but then he lowers his head, shuffling to stand behind you.", parse);
			Text.NL();
			Text.Add("You explain that Miranda is travelling together with you, and he’ll just have to deal with that.", parse);
			Text.NL();
			Text.Add("<i>“You’re asking too much! I’m not going to travel with this stupid bitch!”</i> he protests.", parse);
			Text.NL();
			Text.Add("Miranda cracks her knuckles, she looks like she’s about to teach him a lesson, but you stop her. You inform Terry that it’s either this or death row, so the faster he gets used to this, the better. Likewise, you tell Miranda not to provoke Terry. The last thing you need is infighting.", parse);
			Text.NL();
			parse["mastermistress"] = dom > 50 ? player.mfTrue(" master", " mistress") : "";
			Text.Add("<i>“Whatever you say…[mastermistress],”</i> Miranda replies. Terry just glares at her, keeping his distance.", parse);
			Text.NL();
			Text.Add("You’re just about to get going when Miranda stops you. <i>“You know, [playername]. I think there’s a perfect way for us to settle our differences. How about you let me finish what we started back then? In the warehouse?”</i> she asks with an insidious smile.", parse);
			Text.NL();
			Text.Add("<i>“Oh, no! No way! You gotta be kidding me! Listen here if you-”</i> You swiftly shush him by telling him to be silent. You need to consider this. On one hand… maybe doing this will put an end to their animosity, though you admit that seems unlikely. On the other… you’re pretty sure your relationship with the fox thief is going to take a hit if you let Miranda have her way.", parse);
			Text.Flush();
			
			//[Let her][Nope]
			var options = new Array();
			options.push({ nameStr : "Let her",
				func : function() {
					Text.Clear();
					Text.Add("Terry’s ears droop as you watch the fox swallow what looks like lead.", parse);
					Text.NL();
					Text.Add("<i>“Sweet, let’s go somewhere more private, shall we?”</i> she suggests, looking at both you and Terry.", parse);
					Text.NL();
					Text.Add("The three of you duck out in a nearby alleyway…", parse);
					Text.Flush();
					
					miranda.relation.IncreaseStat(100, 5);
					terry.relation.DecreaseStat(-100, 5);
					
					// TODO: Repeatable YES
				}, enabled : true,
				tooltip : "You’re pretty sure Miranda will appreciate this, unlike Terry."
			});
			options.push({ nameStr : "Nope",
				func : function() {
					Text.Clear();
					Text.Add("Miranda groans. ", parse);
					if(dom > 50) {
						parse["mastermistress"] = player.mfTrue("master", "mistress");
						Text.Add("<i>“As you wish, [mastermistress],”</i> she says rolling her eyes.", parse);
					}
					else
						Text.Add("<i>“After all the hell this little bastard’s put me through you’re not even going to let me have a shot at him? Bah! Do whatever you want!”</i> Miranda exclaims dismissively.", parse);
					Text.NL();
					Text.Add("Terry breathes a sigh of relief, and you’re pretty sure you caught the faintest hint of a smile when he glanced at you just now.", parse);
					Text.NL();
					Text.Add("You motion for them to follow you as you continue on your way.", parse);
					Text.Flush();
					
					terry.relation.IncreaseStat(100, 3);
					miranda.relation.DecreaseStat(-100, 10);
					
					Gui.NextPrompt();
				}, enabled : true,
				tooltip : "It wouldn’t be very nice of you to submit the fox thief to this after he’s just gotten out of the death row."
			});
			Gui.SetButtonsFromList(options, false, null);
			
			terry.relation.DecreaseStat(-100, 5);
		}
		else {
			Text.Flush();
			
			Gui.NextPrompt();
		}
	});
}

Scenes.Terry.TalkPrompt = function() {
	var parse = {
		foxvixen : terry.mfPronoun("fox", "vixen"),
		HeShe   : terry.HeShe(),
		heshe   : terry.heshe(),
		HisHer  : terry.HisHer(),
		hisher  : terry.hisher(),
		himher  : terry.himher(),
		hishers : terry.hishers()
	};

	var options = new Array();
	options.push({ nameStr : "Feelings",
		func : Scenes.Terry.TalkFeelings, enabled : true,
		tooltip : Text.Parse("Ask your pet [foxvixen] how [heshe]’s doing.", parse)
	});
	//TODO
	options.push({ nameStr : "Pronoun",
		func : Scenes.Terry.TalkPronoun, enabled : true,
		tooltip : terry.PronounGender() == Gender.male ? "Terry looks too much like a girl, you should address 'her' as such from now on." : "In the end Terry is a guy, no matter how girly she looks. You should address 'him' as such."
	});
	options.push({ nameStr : "Past",
		func : Scenes.Terry.TalkPast, enabled : true,
		tooltip : Text.Parse("Ask Terry to tell you a bit about [himher]self.", parse)
	});
	options.push({ nameStr : "Compliment",
		func : Scenes.Terry.TalkCompliment, enabled : true,
		tooltip : Text.Parse("Let the [foxvixen] know how attractive [heshe] is.", parse)
	});

	Gui.SetButtonsFromList(options, true, terry.Interact);
}

Scenes.Terry.TalkFeelings = function() {
	var parse = {
		playername: player.name,
		foxvixen : terry.mfPronoun("fox", "vixen"),
		HeShe   : terry.HeShe(),
		heshe   : terry.heshe(),
		HisHer  : terry.HisHer(),
		hisher  : terry.hisher(),
		himher  : terry.himher(),
		hishers : terry.hishers(),
		breasts : function() { return terry.FirstBreastRow().Short(); },
		breastsDesc : function() { return player.FirstBreastRow().Short(); }
	};

	Text.Clear();
	if(terry.LustLevel() >= 0.5) {
		if(terry.Relation() >= 60) {
			Text.Add("<i>“I’m feeling pretty horny,”</i> [heshe] says, sizing you up. ", parse);
			if(terry.Slut() >= 60) {
				parse["b"] = terry.Cup() >= Terry.Breasts.Bcup ? Text.Parse(" against [hisher] [breasts]", parse) : "";
				Text.Add("<i>“I just can’t get you out of my head, [playername].”</i> [HeShe] walks up to you, gently stroking your arm. <i>“Can we go have sex?”</i> [heshe] asks, ears to the sides and tail wagging slowly, as [heshe] sidles up to you, hugging your arm[b]. <i>“I need you...”</i>", parse);
			}
			else if(terry.Slut() >= 30) {
				Text.Add("<i>“How about a quickie? I mean, not that I absolutely <b>need</b> one,”</i> [heshe] immediately adds. <i>“I’d just feel a bit better if we did… just a bit...”</i> [HeShe] looks at you expectantly.", parse);
			}
			else {
				Text.Add("[HeShe] looks a bit nervous. <i>“I was wondering...”</i> [heshe] trails off. You place a hand on [hisher] shoulder and smile, waiting for [himher] to finish. <i>“Maybe we could, if you’re willing, maybe do something about my arousal?”</i>", parse);
				Text.NL();
				Text.Add("Sex, [heshe] means.", parse);
				Text.NL();
				Text.Add("<i>“Er, yes,”</i> the fox smiles nervously.", parse);
			}
			Text.Flush();
			
			var options = new Array();
			options.push({ nameStr : "Yes",
				func : function() {
					Text.Clear();
					Text.Add("You sweep Terry into your arms, pulling the [foxvixen] into a passionate kiss. [HisHer] chest presses against yours, ", parse);
					if(terry.FirstBreastRow().Size() > 3)
						Text.Add("[hisher] [breasts] squishing pleasantly against your own [breastsDesc], ", parse);
					Text.Add("and [heshe] moans softly in surprise before eagerly returning your kiss. Terry’s eyes sink shut in rapture, arms moving to fold themselves possessively around your waist. The [foxvixen]’s tail wags in delight over [hisher] shapely buttocks, enticing you to reach down and give it a stroke. When you release the kiss, [heshe] pants for breath, and you suggest moving to a more private spot for this.", parse);
					Text.NL();
					if(terry.Slut() >= 60)
						Text.Add("<i>“Why? Let ‘em look, for all I care,”</i> [heshe] giggles mischievously, snuggling up against your chest. <i>“But if that’s what you want...”</i>", parse);
					else if(terry.Slut() >= 30)
						Text.Add("<i>“Well...”</i> [heshe] drawls thoughtfully. <i>“I’d be lying if I said I was totally against the idea of doing it here... but I definitely rather have you all to myself. Lead on.”</i>", parse);
					else
						Text.Add("Terry shivers in a mixture of arousal and embarrassment. <i>“Oh, yes, certainly,”</i> [heshe] agrees, [hisher] voice a whisper of desire.", parse);
					Text.NL();
					Text.Add("You waste little time further in leading Terry somewhere more comfortable, and out of sight of prying eyes.", parse);
					Text.NL();
					
					terry.relation.IncreaseStat(70, 1);

					Text.Flush();
					Scenes.Terry.SexPrompt(terry.Interact);
				}, enabled : true,
				tooltip : Text.Parse("Well, if [heshe] is in the mood, no sense wasting it, right?", parse)
			});
			options.push({ nameStr : "No",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Oh, okay,”</i> [heshe] says, looking a bit disappointed.", parse);
					Text.Flush();
					Scenes.Terry.TalkPrompt();
				}, enabled : true,
				tooltip : "You’re not in the mood for sex right now."
			});
			Gui.SetButtonsFromList(options, false, null);
			return;
		}
		else if(terry.Relation() >= 30) {
			Text.Add("<i>“I’m… feeling a bit giddy. Just a bit though!”</i> [heshe] blurts out.", parse);
			if(terry.Slut() >= 60)
				Text.Add(" <i>“Perhaps I’d feel a bit better if we could fool around a bit.”</i>", parse);
			else if(terry.Slut() >= 30)
				Text.Add(" <i>“I wouldn’t say no if you wanted to… do something.”</i>", parse);
			Text.NL();
			Text.Add("Looks like your pet is opening up to you more, if [heshe]’s willing to admit to wanting you. Maybe you should help [himher] get some release...", parse);
			Text.Flush();
			
			var options = new Array();
			options.push({ nameStr : "Yes",
				func : function() {
					Text.Clear();
					Text.Add("You draw Terry closer and hug [himher] gently, one hand brushing in soft, even strokes down [hisher] back and along the fluffy tail swinging above [hisher] shapely ass. If that’s what [heshe] needs, you’re happy to help, but first, you should head somewhere a little more private.", parse);
					Text.NL();
					Text.Add("<i>“Okay, umm… lead the way,”</i> [heshe] smiles nervously.", parse);
					Text.NL();
					Text.Add("With a reassuring smile, you release [himher] from your grip and take [hisher] hand before gently leading [himher] away.", parse);
					Text.NL();
					Text.Add("", parse);
					Text.NL();
					
					terry.relation.IncreaseStat(40, 1);

					Text.Flush();
					Scenes.Terry.SexPrompt(terry.Interact);
				}, enabled : true,
				tooltip : Text.Parse("Be a shame to waste it if your pet [foxvixen] is in the mood for some sex.", parse)
			});
			options.push({ nameStr : "No",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Of course, there are more important things to do anyway.”</i> You note the slight disappointment in [hisher] tone.", parse);
					Text.Flush();
					Scenes.Terry.TalkPrompt();
				}, enabled : true,
				tooltip : Text.Parse("You’re not really in the mood yourself, though, so [heshe]’ll just have to take care of it [himher]self.", parse)
			});
			Gui.SetButtonsFromList(options, false, null);
			
			return;
		}
		else {
			Text.Add("<i>“I-I’m fine,”</i> [heshe] says, looking quite flustered.", parse);
			Text.NL();
			Text.Add("The [foxvixen] certainly doesn’t look fine. In fact, if you’re any judge, [heshe]’s really in need of a good fuck; [heshe] looks awfully pent up. Of course, [heshe] won’t admit that to you; you’ll need to make the first move about settling it.", parse);
		}
	}
	else if(terry.HPLevel() <= 0.3)
		Text.Add("<i>“I’m exhausted!”</i> [heshe] exclaims. <i>“We should find somewhere safe and take a moment to catch our breath.”</i>", parse);
	else if(terry.HPLevel() <= 0.6)
		Text.Add("<i>“I’m a bit tired, but still hanging in there,”</i> [heshe] smiles softly. <i>“I wouldn’t say no to getting some rest, though.”</i>", parse);
	else
		Text.Add("<i>“I’m fine, thanks for asking,”</i> [heshe] smiles, tail wagging slowly behind.", parse);
	Text.Flush();
	
	terry.relation.IncreaseStat(20, 1);
	
	Scenes.Terry.TalkPrompt();
}


Scenes.Terry.TalkPronoun = function() {
	var parse = {
		breasts : function() {
			var desc = terry.FirstBreastRow().Desc();
			return desc.cup + "s";
		},
		foxvixen : terry.mfPronoun("fox", "vixen"),
		cock    : function() { return terry.MultiCockDesc(); },
		HeShe   : function() { return terry.HeShe(); },
		heshe   : function() { return terry.heshe(); },
		HisHer  : function() { return terry.HisHer(); },
		hisher  : function() { return terry.hisher(); },
		himher  : function() { return terry.himher(); },
		hishers : function() { return terry.hishers(); },
		girlguy : function() { return terry.mfPronoun("guy", "girl"); }
	};
	
	Text.Clear();
	if(terry.PronounGender() == Gender.male) {
		Text.Add("Shaking your head, you tell Terry that you just can’t really think of him as being a guy. ", parse);
		if(terry.FirstBreastRow().Size() < 3)
			Text.Add("It doesn’t matter that he’s flat up top. ", parse);
		else
			Text.Add("The fact he has [breasts] certainly doesn’t help the matter. ", parse);
		if(terry.FirstCock() && terry.FirstVag())
			Text.Add("The cock he has to go with his pussy doesn’t matter.", parse);
		else if(terry.FirstCock())
			Text.Add("And it doesn’t matter that he has a cock hanging between his legs.", parse);
		else //vag
			Text.Add("Especially when you consider that what lies between his legs is a pretty little pussy.", parse);
		Text.Add(" He’s just far too pretty, and his build is just too curvy. No matter what angle you look at him from, there’s just no way this feminine figure could be a guy", parse);
		if(terry.FirstVag() && terry.FirstBreastRow().Size() >= 3)
			Text.Add(" - he even has all the proper parts", parse);
		Text.Add(". So, from now on, you’re going to start addressing him as such. It’ll be less confusing if you didn’t have to keep calling ‘him’ a guy all the time.", parse);
	}
	else {
		Text.Add("With a shake of your head, you confess to Terry that you just can’t really think of her as a girl. ", parse);
		if(terry.FirstBreastRow().Size() >= 3)
			Text.Add("It doesn’t matter how big her breasts are. ", parse);
		else
			Text.Add("That flat chest of hers just doesn’t present a very feminine image. ", parse);
		if(terry.FirstCock() && terry.FirstVag())
			Text.Add("And that cock she has right above her pussy clearly doesn’t look right on a girl.", parse);
		else if(terry.FirstCock())
			Text.Add("And the [cock] swinging between her legs certainly puts to rest any debate toward her apparent gender.", parse);
		else //vag
			Text.Add("Even if she doesn’t have a cock anymore, there’s just no hiding it.", parse);
		Text.Add(" She was born a guy, you know she was born a guy, and you can’t lie to yourself anymore. Terry is a guy, and she has a right to be addressed as such. So that’s what you’ll be doing from now on.", parse);
	}
	Text.NL();
	
	if(terry.PronounGender() == Gender.male)
		terry.flags["PrefGender"] = Gender.female;
	else
		terry.flags["PrefGender"] = Gender.male;
	
	if(terry.Relation() >= 60) {
		Text.Add("<i>“I don’t know if I’m really comfortable with you addressing me as a [girlguy]...”</i> [heshe] says, tapping [hisher] chin.", parse);
		Text.NL();
		Text.Add("Grinning at the [foxvixen]’s quip, you close the distance and give [himher] a playful peck right on [hisher] upturned lips, lifting off after a few seconds to see [hisher] response.", parse);
		Text.NL();
		Text.Add("<i>“Okay… nice try, but you’re going to have to do better than that if you hope to con-”</i> you interrupt [himher] with another peck, and another, it’s not long before you’re deeply entangled in each other’s arms, kissing each other passionately. By the time you break away Terry’s panting.", parse);
		Text.NL();
		Text.Add("<i>“I’m convinced,”</i> [heshe] grins, tail wagging as [heshe] licks [hisher] lips.", parse);
		
		terry.AddLustFraction(0.2);
		player.AddLustFraction(0.2);
	}
	else if(terry.Relation() >= 30) {
		Text.Add("<i>“I was kinda getting used to the way you were addressing me. But if you really consider me a [girlguy], go ahead. I spent the longest time trying to assert myself as a guy, but lately I don’t think it really matters anymore,”</i> [heshe] smiles, tail wagging slowly behind.", parse);
	}
	else {
		Text.Add("<i>“Hearing you say that kind-of makes me pissed, but… it’s not like I can stop you, so suit yourself.”</i>", parse);
		Text.NL();
		Text.Add("[HeShe] doesn’t look very angry to you...", parse);
	}
	Text.Flush();
	
	Scenes.Terry.TalkPrompt();
}

Scenes.Terry.TalkPast = function(force) {
	var parse = {
		foxvixen : terry.mfPronoun("fox", "vixen"),
		mastermistress : player.mfTrue("master", "mistress"),
		playername : player.name
	};
	
	parse = terry.ParserPronouns(parse);
	
	var max = terry.flags["maxPast"];
	var cur = terry.flags["rotPast"];
	
	var scenes = [];
	
	var BlockScene = function() {
		Text.Add("The [foxvixen] looks like [heshe]’s contemplating what to tell you. Finally, [heshe] says:", parse);
		Text.NL();
		Text.Add("<i>“...Listen, I don’t really feel comfortable talking about more just yet. I… Well, can we do this later?”</i> [HeShe] asks.", parse);
		Text.NL();
		Text.Add("You could always order [himher] to tell you anyway, but that would be counterproductive, so you quietly agree.", parse);
	}
	
	// Long
	scenes.push(function() {
		Text.Add("<i>“I was born in the slums of Rigard. My mother was a hooker and my father was a thief. One heavy night of drinking and partying, and I was conceived.”</i>", parse);
		Text.NL();
		Text.Add("<i>“My father tells me that when he heard the news he was surprisingly joyous. He and mom never married, but they started living together all the same. Who said someone needs to be married to have a family together?”</i>", parse);
		Text.NL();
		Text.Add("<i>“To be honest I don’t remember my mother that well. I was just a baby when she died. Some trouble with morphs here in Rigard. I don’t recall the exact details. But you can see that the bigotry still runs strong.”</i> Terry sighs.", parse);
		Text.NL();
		Text.Add("You nod in silent understanding.", parse);
		Text.NL();
		Text.Add("<i>“Anyway, my parents ran. Mom wasn’t so quick, but luckily daddy was. He took me away and we escaped to the free cities, where I spent most of my childhood.”</i>", parse);
		Text.NL();
		Text.Add("Terry takes a deep breath. <i>“I suppose that’s enough for now. Can we talk, or do, something else for a bit?”</i>", parse);
		Text.NL();
		Text.Add("Sure, you tell [himher].", parse);
		
		Text.Flush();
		Scenes.Terry.TalkPrompt();
	});
	scenes.push(function() {
		if(terry.Relation() < 10) {
			BlockScene();
			return true;
		}
		
		Text.Add("<i>“My dad was surprisingly caring when it came down to raising me. Although he did have some bad habits.”</i>", parse);
		Text.NL();
		Text.Add("Oh? Like what?", parse);
		Text.NL();
		Text.Add("<i>“He was an alcoholic. Can’t say I blame him. War broke out and he lost mom. Sometimes, when he was really drunk, he’d mistake me for her.”</i>", parse);
		Text.NL();
		Text.Add("He mistook Terry for [hisher] mother?", parse);
		Text.NL();
		Text.Add("<i>“Yeah, well. I look pretty girly to begin with. And booze kinda blurs things. He never touched me, just kept saying stuff to me. It was kinda sad. I could tell that he really loved mom. I never bothered correcting him either. Sometimes I’d just pretend to be a woman and reply in kind.”</i>", parse);
		Text.NL();
		Text.Add("That’s… pretty sad, you admit.", parse);
		Text.NL();
		Text.Add("<i>“Yeah… can we leave the rest for later?”</i>", parse);
		Text.NL();
		Text.Add("Sure.", parse);
		
		if(max < 1)
			terry.relation.IncreaseStat(100, 1);
		
		Scenes.Terry.TalkPrompt();
	});
	scenes.push(function() {
		if(terry.Relation() < 20) {
			BlockScene();
			return true;
		}
		
		Text.Add("<i>“I told how my father was a thief, right?”</i>", parse);
		Text.NL();
		Text.Add("Yes, you recall that.", parse);
		Text.NL();
		Text.Add("<i>“So, when he was sober enough, he thought he’d train me. Said it always paid to know a thing or two about the ‘finer arts’, his words. And it turns out I was pretty good at it too. Of course, the fact that I looked pretty darn innocent and meek also helped my cause.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Father worked at the docks. Loading and unloading ships, and if something went missing? No skin off his back. I mean, things go missing all the time during the busy hours. Pretty sure my dad wasn’t the only one relieving a few of the dirty rich merchant of some of their precious cargo.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Those were good days. But they only lasted a couple years. Dad… well, he didn’t last long.”</i> Terry’s visage saddens for a moment.", parse);
		Text.NL();
		Text.Add("You place a comforting hand on [hisher] shoulder.", parse);
		Text.NL();
		Text.Add("[HeShe] looks at you and brightens up a little. <i>“Thanks… umm, anyway. Guess we’ll pick up some other time?”</i>", parse);
		Text.NL();
		Text.Add("Sounds good to you.", parse);
		
		if(max < 2)
			terry.relation.IncreaseStat(100, 1);
	});
	scenes.push(function() {
		if(terry.Relation() < 30) {
			BlockScene();
			return true;
		}
		
		Text.Add("<i>“Last time I mentioned my father died, right?”</i>", parse);
		Text.NL();
		Text.Add("You nod in confirmation.", parse);
		Text.NL();
		Text.Add("<i>“Turns out he was ill. He didn’t say anything, but eventually it was clear. He wasn’t going to make it. I… cried a lot back then.”</i> Terry’s ears droop.", parse);
		Text.NL();
		Text.Add("You scoop the [foxvixen] up into your arms and embrace [himher]. Eventually [heshe] breaks the hug, looking at least a bit better.", parse);
		Text.NL();
		Text.Add("<i>“Anyways. I was all alone, and I had to fend for myself. Daddy’s skills came in pretty handy. But I was pretty scrawny by comparison. So working at the docks? No dice.”</i> [HeShe] shakes [hisher] head.", parse);
		Text.NL();
		Text.Add("<i>“Instead I managed to land a job at the local inn. It wasn’t as safe as the docks, but at least I could pick my marks. And my fingers were light enough that few even noticed missing goods. I didn’t steal anything major, after all.”</i> A smile breaks on [hisher] muzzle.", parse);
		Text.NL();
		Text.Add("<i>“I was pretty naive back then. Also pretty darn careless. That’s how I met my master, actually. But that’s a tale for another time.”</i>", parse);
		
		if(max < 3)
			terry.relation.IncreaseStat(100, 1);
	});
	scenes.push(function() {
		if(terry.Relation() < 40) {
			BlockScene();
			return true;
		}
		
		Text.Add("<i>“I’ve always been pretty good when picking pockets, or stealthily nabbing a thing or two from a careless traveller. But nothing could’ve prepared me for my master. Not ‘master’ like you, [playername]. I mean… I guess ‘mentor’ would be a more appropriate term.”</i>", parse);
		Text.NL();
		Text.Add("Well, trying to rob a thief is one way to get them to teach you, you suppose. How did it happen?", parse);
		Text.NL();
		Text.Add("<i>“He looked pretty well off, and he was distracted messing with a strange contraption, so I thought that I should help myself to his rather loaded bag. I pickpocketed the key off him and snuck inside his room while he was out, opened his suitcase and BAM! An alarm rang out,”</i> Terry says, punching [hisher] open palm for effect.", parse);
		Text.NL();
		Text.Add("<i>“He caught me in an instant, I thought I was done for. But to my surprise, he smiled and turned the alarm off. Told me I had talent, he hadn’t even noticed his key was gone. Instead of ratting me out, he offered to train me. Teach me the finer points of being a thief. Not a two-bit one like I was, but a pro thief.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Since I really didn’t want to deal with the authorities, I accepted. Initially that was my motivation. But as time passed and he trained me, I grew to like him. That, however, is a tale for another time. Maybe later?”</i>", parse);
		Text.NL();
		Text.Add("You nod your head in understanding, smiling softly before you thank [himher] for [hisher] time.", parse);
		
		if(max < 4)
			terry.relation.IncreaseStat(100, 1);
	});
	scenes.push(function() {
		if(terry.Relation() < 45) {
			BlockScene();
			return true;
		}
		
		Text.Add("<i>“He was a gray fox, and he told me that his name was Thorn. Probably not his real name, but it’s what I called him. I did give him my real name, Theodore, but he said that name was a mouthful, so he stuck to calling me by the nickname folks at the inn gave me, Terry.”</i>", parse);
		Text.NL();
		Text.Add("Honestly, [heshe] feels more like a ‘Terry’ than a ‘Theodore’ anyway, in your opinion.", parse);
		Text.NL();
		Text.Add("<i>“Training was tough, he prepared a wide assortment of challenges. I had to pass each of them with minimal instruction and keep practicing. He made me do various things, like picking the locks of several different lockboxes, solving riddles, working puzzles...”</i> Terry smiles softly. <i>“Now that I think back on it, I never did figure out the last one. Got around it by using a micro-explosive to bust the lock,”</i> [heshe] grins at [hisher] own ingenuity.", parse);
		Text.NL();
		Text.Add("Well... that’s not exactly what you’d think of as ‘thiefly behavior’, but you have to confess, it sounds effective.", parse);
		Text.NL();
		Text.Add("<i>“Anyways, the most important thing he taught me was how to build all sorts of gadgets. Smoke bombs, trick mirrors, magic baubles, all kinds of neat things. The same ones I offered to make you. That’s what most of my training was dedicated to.”</i>", parse);
		Text.NL();
		Text.Add("<i>“He did use me sometimes, had me dress up elegantly and go in-town to scout some info on possible marks. We only went after the dirty-rich. And Thorn, well Thorn had a special way of making his heists.”</i>", parse);
		Text.NL();
		Text.Add("Oh? What did he do that was so special?", parse);
		Text.NL();
		Text.Add("<i>“He would dress up in some colorful clothes, rob the mark blind, then leave a calling card. The masked fox, he would call himself. It was quite funny seeing the reaction of the local authorities as we snuck away,”</i> Terry laughs.", parse);
		Text.NL();
		Text.Add("<i>“Life was good again, and it was so for a few years. I didn’t go into heists myself, just helped Thorn with info and prepared gadgets. He said I was pretty good as a thief already, and all I needed was to complement my skills, so that’s what I focused on. Can’t say I loved wearing a few of those frilly dresses tho...”</i>", parse);
		Text.NL();
		Text.Add("Dresses... Thorn made [himher] dress up as a girl? You consider what you’ve been told for a moment, and then ask if Thorn was just using the old ‘honeypot trick’, or if he had ulterior motives for it.", parse);
		Text.NL();
		Text.Add("<i>“It was easier to collect info, plus people were less likely to suspect a vixen of a crime committed by a fox. You can’t believe the things people will babble about to a pretty face and some giggles. And I played the part well. What’s with me looking all girly and everything...”</i>", parse);
		Text.NL();
		Text.Add("You can’t help but nod your head and agree; [heshe] certainly could play the part of the vixen well. You never would have guessed what was really under that waitress getup until you caught ‘her’ back then.", parse);
		Text.NL();
		if(terry.FirstVag() && !terry.FirstCock()) {
			Text.Add("You wonder what Thorn would think of his apprentice having become a vixen for real?", parse);
			if(terry.Cup() <= Terry.Breasts.Acup)
				Text.Add(" At least - you add, looking at [hisher] flat chest - a vixen where it matters?", parse);
			Text.NL();
		}
		if(terry.HorseCock()) {
			Text.Add("You wonder what Thorn would say if he saw what kind of heat Terry’s packing. ", parse);
			if(terry.FirstVag() && terry.Cup() >= Terry.Breasts.Acup)
				Text.Add("Despite [himher] having all the bits necessary to pass as a woman, [hisher]", parse);
			else if(terry.FirstVag() || terry.Cup() >= Terry.Breasts.Acup)
				Text.Add("Despite [himher] also some girly bits, [hisher]", parse);
			else
				Text.Add("[HisHer]", parse);
			Text.Add(" stallionhood is truly eye-catching! Although Terry <b>is</b> pretty skilled at keeping it hidden...", parse);
			Text.NL();
		}
		else if(terry.FirstCock() && !terry.FirstVag() && terry.Cup() >= Terry.Breasts.Bcup) {
			Text.Add("You can’t help but wonder what Thorn would think of his old apprentice’s ‘new assets’? Certainly makes the old act more convincing.", parse);
			Text.NL();
		}
		else if(terry.FirstCock() && terry.FirstVag()) {
			if(terry.Cup() <= Terry.Breasts.Acup)
				Text.Add("What would Thorn say to Terry upon learning of [hisher] new ‘extra’ tucked away between [hisher] legs?", parse);
			else
				Text.Add("You just bet Thorn would have something to say about Terry’s new body; [heshe] was girly to begin with, but with the new breasts and a new pussy too, well, that’s a whole new level, isn’t it?", parse);
			Text.NL();
		}
		Text.Add("<i>“He… ugh, he wouldn’t let me hear the end of it. My girly physique was always something he’d mock me about. Not that I resent him for that. It was all in good fun. Tho there was a time when I kicked him in the nuts for a particularly offensive remark.”</i>", parse);
		Text.NL();
		Text.Add("Well... he kind of deserved it, from what Terry just told you.", parse);
		Text.NL();
		Text.Add("<i>“Yeah, he kinda did. We had a good run, but eventually I guess he was too cocky and things didn’t end up well for him. But let’s visit that some other time, alright?”</i>", parse);
		Text.NL();
		parse["again"] = (max == cur) ? "" : " again";
		Text.Add("Of course; Terry should take [hisher] time, [heshe]’ll talk when [heshe]’s ready. You thank [himher] for telling you about Thorn[again].", parse);
		if(max < 5)
			terry.relation.IncreaseStat(100, 1);
	});
	scenes.push(function() {
		if(terry.Relation() < 50) {
			BlockScene();
			return true;
		}
		
		Text.Add("<i>“We kept avoiding capture by travelling a lot under the pretense of being merchants. Thorn was very pleased with our successful heists. We had a system that worked really well,”</i> Terry smiles softly, but the smile quickly fades.", parse);
		Text.NL();
		Text.Add("<i>“About then we caught wind of a VIP that was visiting the town we were in. Thorn’s eyes were aglow. That was a great mark if there ever was one, and best of all? He had little security with him. It was an opportunity, and if there’s a thing you learn in thievery, it’s that you never miss an opportunity.”</i>", parse);
		Text.NL();
		Text.Add("You nod your head in understanding, and ask who this VIP was.", parse);
		Text.NL();
		Text.Add("<i>“Our mark was Duke Kane, he was responsible for the neighbouring town and had vast amount of land under his name. Naturally, despite the opportunity, we couldn’t just take risks blindly, so I set out to gather info my usual way. Thorn was stalking the Duke, gathering info on his own.”</i>", parse);
		Text.NL();
		Text.Add("You nod your head in understanding, then inquisitively ask just how close Terry was able to get to Kane; did [heshe] have to settle for just chasing rumors? Or did the Duke welcome the chance to spend a little time with a sexy vixen who was just so interested in him?", parse);
		Text.NL();
		Text.Add("<i>“No, he didn’t stay anywhere near me. I was simply a maid at the local inn. But I did get the chance to speak with a few guards. Naturally also had to deflect more flirts than I’d like,”</i> Terry adds, cringing at the memory.", parse);
		Text.NL();
		Text.Add("<i>“So, as you can guess, gathering info on this mark was slow. We were approaching our deadline, and we didn’t have near enough info on the Duke and his guards to make a proper heist. My dad always preached that I should be patient. Same goes for thievery. You rush into the danger and you’ll wind up caught or worse.”</i>", parse);
		Text.NL();
		Text.Add("Sage advice, you say in agreement.", parse);
		Text.NL();
		Text.Add("<i>“Well, Thorn was impatient. I was just getting started on my shift when I heard one of the guards remark that a masked thief had tried to steal from Duke Kane. When I heard that, I rushed back to our room, and sure enough… Thorn was there. Hurt.”</i>", parse);
		Text.NL();
		Text.Add("<i>“He had lost too much blood, and by the time I could get him to a healer, it was too late. I was devastated by the news. Even if Thorn was just using me, he was still my best friend. So, once again, I was all alone.”</i>", parse);
		Text.NL();
		Text.Add("With a sigh, you put a hand on Terry’s shoulder, trying to comfort the [foxvixen].", parse);
		Text.NL();
		Text.Add("<i>“We’re almost at the end of me tale, but I think we should wait until another time to finish it.”</i>", parse);
		Text.NL();
		Text.Add("Sure, sounds like a plan.", parse);
		
		if(max < 6)
			terry.relation.IncreaseStat(100, 1);
	});
	scenes.push(function() {
		if(terry.Relation() < 55) {
			BlockScene();
			return true;
		}
		
		Text.Add("<i>“Last time we spoke I told about how my mentor, Thorn, died right?”</i>", parse);
		Text.NL();
		Text.Add("You nod in confirmation.", parse);
		Text.NL();
		Text.Add("<i>“Well after that, I performed the last rites, quit my job at the inn and got in the first caravan headed out of the city. I wanted to get away from it all, plus there was always the chance people would find out I was with Thorn. Then I’d be in trouble too.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I had nowhere to go, and I was feeling too depressed to think about anything. So I just idled, waiting for the caravan to reach its destination. It was a long trip, but eventually we made our way to Rigard.”</i>", parse);
		Text.NL();
		Text.Add("So [heshe] wound up in [hisher] hometown. Did he recall it at all from [hisher] childhood?", parse);
		Text.NL();
		Text.Add("<i>“I didn’t recall too much about it, no. But from what dad told me, the city was shit back then as well,”</i> Terry sighs, frowning in disapproval.", parse);
		Text.NL();
		Text.Add("<i>“I was getting short on money, and I was already dressed for the job. So I thought… why not get back into the game? Rob some fool and hop on the nearest caravan. Problem is… that damn blockade on the city gates.”</i>", parse);
		Text.NL();
		Text.Add("Ah yes, you had a hard time getting past the gates yourself...", parse);
		Text.NL();
		Text.Add("<i>“I was lucky enough to make it inside the city, but I couldn’t just rob anyone. Even long after the that conflict that took my mother from me, people were still on edge. So finding a mark was tough. In the end I decided if I wanted to score some decent loot, I’d have to rob one of the local nobles.”</i>", parse);
		Text.NL();
		Text.Add("Oh? And who was the lucky one?", parse);
		Text.NL();
		Text.Add("<i>“Krawitz seemed like a good mark. He was a bigot to morphs and an asshole to most people. I figured no one would mind if the old fool got robbed blind. So I did what I always did. Prepared, gathered intel, and in honor of my late mentor? I decided to don his costume and replicate his MO. Thought I should let the good lord know that a morph outwitted him and robbed him.”</i>", parse);
		Text.NL();
		Text.Add("You decide not to say anything. Your own crimes got pinned on Terry, after all. It wouldn’t do you both any good if [heshe] found out you were there with [himher] that day...", parse);
		Text.NL();
		Text.Add("<i>“After that, you know the story. Fin.”</i>", parse);
		Text.NL();
		Text.Add("Well, that was quite the story. But in the end [heshe] wound up with you, and you’re glad you met [himher].", parse);
		Text.NL();
		Text.Add("<i>“Yes, I’m glad I met you too,”</i> [heshe] replies, wagging [hisher] bushy tail. <i>“Now, anything else I can do for you?”</i>", parse);
		
		if(max < 7)
			terry.relation.IncreaseStat(100, 1);
	});
	
	if(cur >= scenes.length) cur = 0;
	
	if(!force) {
		Text.Clear();
		if(max == 0 && cur == 0) {
			Text.Add("<i>“Okay, I guess I can do that. So, what would you like to know?”</i>", parse);
			Text.NL();
			Text.Add("You’re curious about [hisher] past. You’d like to know more about [himher] and you feel this would help sorting that out.", parse);
			Text.NL();
			Text.Add("<i>“My past? My past is nothing special. It’s quite cliché I’d say. And honestly it’s best forgotten...”</i> the [foxvixen] says, ears flattening on [hisher] skull. It’s obvious this isn’t [hisher] favorite topic.", parse);
			Text.NL();
			Text.Add("You’d still like to know. ", parse);
			if(terry.Relation() < 30)
				Text.Add("Getting to know [himher] better would be a big step toward getting a better relationship with [himher], you feel.", parse);
			else
				Text.Add("The two of you are well on your way toward building a better relationship, and getting to know more about [himher] would only strengthen your bonds.", parse);
			Text.NL();
			Text.Add("The [foxvixen] ponders your words for a few moments, but finally acquiesces. <i>“Tough to argue against that...”</i>", parse);
			Text.NL();
			Text.Add("<i>“Well, if you really want to know I guess I have to tell you.”</i> [HeShe] smiles a bit. <i>“Let’s start at the beginning then...”</i>", parse);
			
			terry.relation.IncreaseStat(100, 3);
		}
		else if(cur == 0) {
			Text.Add("<i>“I already told you everything I could about my past, [playername]. So, unless you want me to start over there’s not much else to tell.”</i>", parse);
			Text.Flush();
			
			//[HearAgain][Nevermind]
			var options = new Array();
			options.push({ nameStr : "Hear again",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Okay then, back to the beginning. I suppose...”</i>", parse);
					Text.NL();
					Scenes.Terry.TalkPast(true);
				}, enabled : true,
				tooltip : Text.Parse("You’d like [himher] to tell you [hisher] stories again, and refresh your memories.", parse)
			});
			options.push({ nameStr : "Nevermind",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Alright.”</i>", parse);
					Text.Flush();
					Scenes.Terry.TalkPrompt();
				}, enabled : true,
				tooltip : Text.Parse("In that case, you’d rather talk to [himher] about something else.", parse)
			});
			Gui.SetButtonsFromList(options, false, null);
			return;
		}
		else {
			Text.Add("<i>“Alright then. Now where was I...”</i>", parse);
		}
		Text.NL();
	}
	
	// Play scene
	var block = scenes[cur]();
	
	if(!block) {
		terry.flags["rotPast"] = cur + 1;
		terry.flags["maxPast"] = Math.max(max, cur);
	}
	
	Text.Flush();
	Scenes.Terry.TalkPrompt();
}

Scenes.Terry.TalkCompliment = function() {
	var parse = {
		foxvixen : terry.mfPronoun("fox", "vixen"),
		HeShe   : terry.HeShe(),
		heshe   : terry.heshe(),
		HisHer  : terry.HisHer(),
		hisher  : terry.hisher(),
		himher  : terry.himher(),
		hishers : terry.hishers(),
		mastermistress : player.mfTrue("master", "mistress")
	};
	
	Text.Clear();
	Text.Add("A studious look on your face, you start to circle Terry, intensely observing [himher] from all angles, gaze moving up and down, back and forth, as you continue to trail around the puzzled vulpine.", parse);
	Text.NL();
	if(terry.Relation() >= 60) {
		Text.Add("Terry looks a bit nervous. <i>“Um, everything is alright, right? I didn’t miss any spots combing my fur… maybe my hair is not good?”</i>", parse);
		Text.NL();
		Text.Add("You hasten to assure [himher] that [hisher] hair looks lovely, as always. Just like the rest of [himher], it’s beautiful.", parse);
		Text.NL();
		Text.Add("This gets you a smile as [hisher] tail begins wagging. <i>“If you want we can go more private spot and I can show you all of me. But if we do, I can’t promise we won’t take this beyond a show and tell.”</i>", parse);
		Text.NL();
		Text.Add("You can’t keep a smirk off your face at the mischievous grin spreading over the [foxvixen]’s vulpine features, [hisher] tail wagging in seductive twirls over the shapely ass that [hisher] posture tilts enticingly toward you. The thought comes to mind that you might not even make it to a private spot... still, the offer is tempting; maybe you should accept it?", parse);
		Text.Flush();
		
		//[Yes][No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				Text.Clear();
				Text.Add("With a grin, you invite Terry to follow you and lead [himher] toward a less public place to conduct your ‘show and tell’.", parse);
				Text.NL();
				Text.Add("No sooner are you out of sight, the petite [foxvixen] spins you, nearly pouncing [hisher] way into your arms as [heshe] wraps [hisher] lips around yours in a passionate kiss. [HisHer] hair and fur become a disheveled mess the first few seconds, not that either of you mind it. When you finally break the kiss, the smiling [foxvixen] takes a step back to look you over. <i>“I figured just looking can be a bit boring. I think we’d both prefer a more hands-on approach, don’t you think?”</i>", parse);
				Text.NL();
				if(terry.Slut() >= 60)
					Text.Add("<i>“I know what parts <b>I</b> want, but what parts do <b>you</b> want, my lovely [mastermistress]?”</i> Terry asks, giving you a smouldering look.", parse);
				else if(terry.Slut() >= 30)
					Text.Add("<i>“Okay, before we continue, you should probably tell me how you’ll be wanting to have me,”</i> Terry says, smiling as [hisher] tail wags in excitement.", parse);
				else
					Text.Add("<i>“So, how do you want to do this?”</i> Terry asks.", parse);
				Text.NL();
				Text.Flush();
				Scenes.Terry.SexPrompt(terry.Interact);
			}, enabled : true,
			tooltip : Text.Parse("You just know that this is just going to wind up in sex, but sex is not a bad outcome. Go do your [foxvixen].", parse)
		});
		options.push({ nameStr : "No",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Suit yourself, but I hope you’re willing to humor me later?”</i>", parse);
				Text.NL();
				Text.Add("You assure [himher] that you most certainly are. After all, you couldn’t keep yourself away from your lovely pet [foxvixen] for long.", parse);
				Text.NL();
				Text.Add("<i>“It’s a promise then,”</i> [heshe] giggles.", parse);
				Text.Flush();
				
				Scenes.Terry.TalkPrompt();
			}, enabled : true,
			tooltip : Text.Parse("You really just want to look, refuse [hisher] invitation.", parse)
		});
		Gui.SetButtonsFromList(options, false, null);
		
		return;
	}
	else if(terry.Relation() >= 30) {
		Text.Add("The [foxvixen] is quick to pick up on your intentions, and [heshe] submits willingly to your scrutiny. <i>“I’m still the same old me, as you can see,”</i> [heshe] quips.", parse);
		Text.NL();
		Text.Add("[HeShe] most certainly is; lovely as always.", parse);
		Text.NL();
		Text.Add("Terry looks a bit flustered at your compliment, and you note that [heshe] seems to adjust [hisher] clothing to enhance [hisher] more feminine curves. <i>“Well, go ahead and look then,”</i> [heshe] says nonchalantly, even as [hisher] tail starts wagging. It’s quite obvious that despite [hisher] demeanor [heshe] enjoys the attention…", parse);
		Text.NL();
		Text.Add("You draw out your observations for as long as possible, smiling and nodding your approval of every luscious inch. When you are finished, you nod your head and step away, telling [himher] that it was your pleasure to look at such a beautiful [foxvixen].", parse);
		Text.NL();
		Text.Add("<i>“Thank you,”</i> [heshe] says with a smile.", parse);
	}
	else {
		Text.Add("<i>“What’s wrong? Why are you looking at me like that?”</i>", parse);
		Text.NL();
		Text.Add("Just appreciating [hisher] good looks properly, you reply.", parse);
		Text.NL();
		Text.Add("<i>“Umm, right. So, appreciate away… I guess...”</i> [heshe] trails off, looking more than a bit flustered at your scrutiny.", parse);
		Text.NL();
		Text.Add("With a smile, you continue to look Terry over, the [foxvixen]’s embarrassment at your appraisal no impediment to your appreciation of [hisher] looks. Finally, though, you have enough and you thank [himher] for [hisher] patience; [heshe]’s a very pretty [foxvixen].", parse);
		Text.NL();
		Text.Add("<i>“Thanks.”</i>", parse);
	}
	Text.Flush();
	
	terry.relation.IncreaseStat(30, 1);
	
	Scenes.Terry.TalkPrompt();
}

Scenes.Terry.SkinshipRummagePack = function() {
	var parse = {
		foxvixen : terry.mfPronoun("fox", "vixen"),
		boygirl : terry.mfTrue("boy", "girl"),
		HeShe   : terry.HeShe(),
		heshe   : terry.heshe(),
		HisHer  : terry.HisHer(),
		hisher  : terry.hisher(),
		himher  : terry.himher(),
		hishers : terry.hishers(),
		master : player.mfTrue("master", "mistress")
	};
	
	Text.Add("You find Terry’s pack and rummage through it. ", parse);
	if(terry.Slut() >= 60) {
		Text.Add("At first you just find a few spare clothes, panties, few tools of the trade, and a couple dry snacks. But once you get to the bottom you raise a brow at what you see. A dildo, lube, a cockring, another dildo, an inflatable buttplug, more lube, and some honey. Chuckling to yourself you ask whyever [heshe] would need all of that? Doesn’t it get heavy having to lug around all these toys?", parse);
		Text.NL();
		Text.Add("<i>“Gotta be prepared for when you’re not around, my dear [master]. Plus in case you’re feeling kinky in the middle of the forest, I’d rather not have to wait until we find a city to go after the big [boygirl] toys,”</i> [heshe] grins innocently.", parse);
		Text.NL();
		Text.Add("...You think you created a monster…", parse);
		Text.NL();
		if(terry.Relation() < 60)
			Text.Add("<i>“Damn right you did, and now you gotta take care of me,”</i> [heshe] states.", parse);
		else {
			Text.Add("<i>“Maybe you did, but I loved every second of it. And so did you.”</i>", parse);
			Text.NL();
			Text.Add("True. In that case you’ll just have to enjoy the spoils of your hard labor.", parse);
		}
		Text.NL();
		Text.Add("After digging through quite a few toys, you finally manage to secure Terry’s comb and brush. Carefully you put away everything back into [hisher] pack and move to the grinning [foxvixen].", parse);
	}
	else if(terry.Slut() >= 30) {
		Text.Add("Terry keeps [hisher] pack fairly organized. A few spare clothes, some lockpicks, assorted tools for crafting [hisher] gadgets… a bottle of lube? You set that aside and rummage a bit deeper, grinning to yourself once you find what looks like a fairly small buttplug. Has Terry being having fun behind your back?", parse);
		Text.NL();
		Text.Add("<i>“Umm... ah...”</i> [heshe] trails off. <i>“Well, I figured since we’ve been doing the dirty deed a lot, I should start getting used to it. And it does, kinda, feel good… sometimes… when I’m in the mood.”</i>", parse);
		Text.NL();
		Text.Add("Right… You consider the teasing the [foxvixen] a bit more, but there’ll be plenty of opportunities to do that later. For now you concentrate on finding [hisher] comb and brush. Locating it at the bottom of [hisher] pack is simple enough, and once you pick them up you put [hisher] things back in [hisher] pack.", parse);
	}
	else {
		Text.Add("Terry is kinda neat when it comes to keeping [hisher] pack organized. It’s clear [heshe] takes great care when putting away [hisher] things. You easily locate [hisher] comb and brush at the bottom of the pack, underneath [hisher] extra clothes and tools of the trade. After picking them up, you replace the contents of [hisher] pack back into their proper order.", parse);
	}
}

Scenes.Terry.SkinshipPrompt = function() {
	var parse = {
		foxvixen : terry.mfPronoun("fox", "vixen"),
		HeShe   : terry.HeShe(),
		heshe   : terry.heshe(),
		HisHer  : terry.HisHer(),
		hisher  : terry.hisher(),
		himher  : terry.himher(),
		hishers : terry.hishers(),
		breasts : function() { return terry.FirstBreastRow().Short(); },
		boygirl : terry.mfTrue("boy", "girl"),
		playername : player.name,
		hand    : function() { return player.HandDesc(); },
		breastsDesc : function() { return player.FirstBreastRow().Short(); }
	};
	
	Text.Clear();
	if(terry.Relation() < 30) {
		Text.Add("<i>“Huh?”</i> The [foxvixen] glares at you as if [heshe]’d just been mocked. <i>“What do I look like to you? Some kind of pet? I don’t need your grabby [hand]s on my body.”</i>", parse);
		Text.NL();
		if(terry.flags["Skin"] == 0) {
			Text.Add("Maybe [heshe] doesn’t <i>need</i> them, you confess. But does [heshe] really think it’d be so bad to let you just touch [himher]? You don’t mean anything by doing so, if that’s [hisher] concern. Besides, you <i>could</i> just make this an order...", parse);
			Text.NL();
			Text.Add("The [foxvixen] scowls at you, but acquiesces. <i>“Fine, you got your point across… what are you thinking of doing then?”</i>", parse);
		}
		else {
			Text.Add("With a smirk and a shake of your head, you teasingly ask if [heshe]’s really going to protest like this when you both know how much [heshe] enjoyed it last time.", parse);
			Text.NL();
			Text.Add("Terry sighs. <i>“Okay, I guess there’s no harm in letting you… do whatever to me, just watch where you touch.”</i>", parse);
		}
	}
	else if(terry.Relation() < 60) {
		Text.Add("<i>“Seriously, [playername]. Do I look like a dog to you?”</i>", parse);
		Text.NL();
		Text.Add("...Well-", parse);
		Text.NL();
		Text.Add("<i>“No, don’t answer that,”</i> the [foxvixen] says, raising [hisher] hands. <i>“I have half a mind I’m digging myself into a pit by asking that.”</i>", parse);
		Text.NL();
		Text.Add("You’re content to simply grin. You aren’t going to say anything if [heshe] isn’t. So, [heshe]’s got no problems?", parse);
		Text.NL();
		Text.Add("<i>“Nope, but if you’re going to get touchy-feely with me, at least make me feel good, okay?”</i> [heshe] says with a smile, tail wagging slowly behind.", parse);
		Text.NL();
		Text.Add("You assure [himher] that is precisely what you have in mind.", parse);
	}
	else {
		Text.Add("<i>“Alright, I’m ready whenever you are.”</i>", parse);
		Text.NL();
		Text.Add("Just like that? No complaints? No protests? No token efforts at dissuading you?", parse);
		Text.NL();
		Text.Add("<i>“I’m about to get pampered and loved, [playername]. What idiot would refuse that?”</i> [heshe] asks, grinning innocently.", parse);
		Text.NL();
		Text.Add("A much bigger idiot than your clever [foxvixen], you immediately reply, chest swelling with pride at [hisher] response.", parse);
		Text.NL();
		Text.Add("<i>“You got it! Now what did you have in store for little old me?”</i>", parse);
	}
	Text.Flush();
	
	Scenes.Terry.SkinshipPromptChoices();
}


Scenes.Terry.SkinshipPromptChoices = function() {
	var parse = {
		foxvixen : terry.mfPronoun("fox", "vixen"),
		HeShe   : terry.HeShe(),
		heshe   : terry.heshe(),
		HisHer  : terry.HisHer(),
		hisher  : terry.hisher(),
		himher  : terry.himher(),
		hishers : terry.hishers(),
		breasts : function() { return terry.FirstBreastRow().Short(); },
		boygirl : terry.mfTrue("boy", "girl"),
		playername : player.name,
		hand    : function() { return player.HandDesc(); },
		breastsDesc : function() { return player.FirstBreastRow().Short(); }
	};
	
	//[Hug]
	var options = new Array();
	options.push({ nameStr : "Hug",
		func : function() {
			terry.flags["Skin"]++;

			var pbreasts = player.FirstBreastRow().Size() > 2;
			var tbreasts = terry.FirstBreastRow().Size() > 2;
			Text.Clear();
			Text.Add("You close the distance between you and your pet [foxvixen], arms spreading wide before folding around [hisher] shoulders and drawing [himher] into your chest. ", parse);
			if(pbreasts && tbreasts)
				Text.Add("Your [breastsDesc] squish most pleasantly against Terry’s own [breasts], the cleavage flesh rippling and rolling together.", parse);
			else if(pbreasts)
				Text.Add("Your [breastsDesc] flatten themselves against Terry’s daintily flat chest, pressed between the two of you.", parse);
			else if(tbreasts)
				Text.Add("Terry’s [breasts] squish wonderfully against your own flat chest as you press [himher] to you.", parse);
			else
				Text.Add("You are pressed tightly against each other, pectoral to pectoral, loins to loins.", parse);
			Text.NL();
			if(terry.Relation() >= 60)
				Text.Add("Terry hugs you back with as much intensity as [heshe] can muster. A whine of happiness escapes [himher] as [heshe] basks in your warmth.", parse);
			else if(terry.Relation() >= 30)
				Text.Add("Terry hesitates at first, but quickly succumbs and wraps [hisher] arms around you. [HeShe] closes [hisher] eyes as [heshe] basks in your warmth.", parse);
			else
				Text.Add("At first, it seems Terry is pissed at you, but your concerns are dispelled when the [foxvixen] hesitantly lifts [hisher] arms to return the hug. [HeShe]’s not very enthusiastic, and [hisher] body is tensed up, but at least this is a start….", parse);
			Text.NL();
			Text.Add("Eventually, you break the hug, unfolding your arms from around the warm [foxvixen]-morph. As you step back, you can see that your surprise hug has really perked your pet up; [hisher] tail is wagging openly, and [hisher] eyes have closed in happiness, a pleased smile on [hisher] lips. ", parse);
			if(terry.flags["Skin"] <= 1 && terry.Relation() < 30)
				Text.Add(" Seems like you made an important step toward furthering your relationship with the pretty fox-[boygirl].", parse);
			Text.Flush();
			
			terry.relation.IncreaseStat(40, 1);
			
			Scenes.Terry.Prompt();
		}, enabled : true,
		tooltip : Text.Parse("Terry’s fur looks so soft to the touch. It makes you want to cuddle the [foxvixen].", parse)
	});
	options.push({ nameStr : "Brush Hair",
		func : function() {
			terry.flags["Skin"]++;

			Text.Clear();
			if(terry.Relation() < 60)
			{
				Text.Add("<i>“Sure, I guess there’s no harm in touching up my hair, but I can do this by myself. You don’t really need to bother.”</i>", parse);
				Text.NL();
				Text.Add("Nonsense, it would be a pleasure.", parse);
				Text.NL();
				Text.Add("<i>“Well, if you don’t mind I guess it’s alright. I have a comb and a brush in my pack.”</i>", parse);
			}
			else {
				Text.Add("<i>“Something wrong with my hair?”</i> Terry asks, a hint of mischief in [hisher] voice.", parse);
				Text.NL();
				Text.Add("You pretend to examine it with great scrutiny before admitting you just want some quality time together. Plus you gotta help your [foxvixen] maintain [himher]self.", parse);
				Text.NL();
				Text.Add("<i>“As good an excuse as any. You know where I keep my comb and my brush right?”</i>", parse);
			}
			Text.NL();
			
			Scenes.Terry.SkinshipRummagePack();
			
			Text.NL();
			Text.Add("As the [foxvixen] sees you approaching, [heshe] ", parse);
			if(party.location.safe())
				Text.Add("finds a stool and sits down.", parse);
			else
				Text.Add("sits on the ground cross-legged.", parse);
			Text.NL();
			Text.Add("You circle [himher] until you’re behind [himher], then remove the small strap holding [hisher] pony tail. Terry doesn’t look half-bad with [hisher] bangs loose… Well, plenty of time to admire later; first of all you decide to begin with the comb. As neat as the [foxvixen] is, [hisher] hair is perfectly cared for and provides minimal resistance as you rake the comb through [hisher] locks. Then you set down the comb and grab the brush.", parse);
			Text.NL();
			Text.Add("<i>“Ah… this feels pretty nice.”</i>", parse);
			Text.NL();
			Text.Add("Well, you’re glad [heshe]’s liking [hisher] treatment, you say whilst massaging [hisher] scalp, right behind [hisher] triangular ears.", parse);
			Text.NL();
			if(terry.Relation() < 60)
				Text.Add("<i>“I could get used to this,”</i> [heshe] remarks.", parse);
			else
				Text.Add("<i>“Bit more to the left… yeah, right there.”</i> [HeShe] leans into your touch shamelessly.", parse);
			Text.NL();
			Text.Add("Once you’re done, you quickly locate [hisher] strap and tie [hisher] hair back into the traditional ponytail [heshe] likes to wear it in.", parse);
			Text.NL();
			Text.Add("<i>“Thanks a lot, [playername].”</i> ", parse);
			Text.NL();
			Text.Add("You pat [hisher] on the head and put [hisher] things back into [hisher] pack.", parse);
			Text.Flush();
			
			terry.relation.IncreaseStat(50, 1);
			
			Scenes.Terry.Prompt();
		}, enabled : terry.Relation() >= 30,
		tooltip : Text.Parse("Terry’s hair oughta suffer from all your adventuring, maybe you should brush it to ensure your [foxvixen] is always looking good.", parse)
	});
	
	options.push({ nameStr : "Brush tail",
		func : Scenes.Terry.BrushTail, enabled : terry.Relation() >= 40,
		tooltip : Text.Parse("Terry’s lovely bushy tail looks like it needs a lot of attention to look its best. Why don’t you do your [foxvixen] a favor and give it a nice brushing?", parse)
	});
	
	parse["gen"] = "";
	if(terry.HasBalls()) parse["gen"] += " nuts";
	if(terry.HasBalls() && terry.Lactation()) parse["gen"] += " and";
	if(terry.Lactation()) parse["gen"] += " breasts";
	options.push({ nameStr : "Check fluids",
		func : Scenes.Terry.CheckFluids, enabled : terry.flags["BM"] >= 1 && (terry.HasBalls() || terry.Lactation()),
		tooltip : Text.Parse("See how much fluid Terry is packing in [hisher][gen].", parse)
	});
	//TODO
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Terry.BrushTail = function() {
	var parse = {
		foxvixen       : terry.mfPronoun("fox", "vixen"),
		boygirl        : terry.mfPronoun("boy", "girl"),
		tarmorDesc     : function() { return terry.ArmorDesc(); },
		tlowerArmor    : function() { return terry.LowerArmorDesc(); },
		tbreastDesc   : function() { return terry.FirstBreastRow().Short(); },
		tcockDesc      : function() { return terry.MultiCockDesc(); },
		bellydesc      : function() { return terry.StomachDesc(); },
		skinDesc       : function() { return player.SkinDesc(); },
		playername : player.name
	};
	parse = terry.ParserPronouns(parse);
	
	terry.flags["Skin"]++;
	
	Text.Clear();
	if(terry.Relation() < 60) {
		Text.Add("<i>“Um, okay I guess. It can be a lot of pain to brush properly. And the fur gets tangled all the time, so getting some help wouldn’t be so bad... I think.”</i>", parse);
		Text.NL();
		Text.Add("That’s good then; [heshe] gets a nice brushed tail, you get to help [himher] out, everybody’s happy! Not to mention you get to enjoy touching such a soft and fluffy tail...", parse);
		Text.NL();
		Text.Add("<i>“Alright then, I have a brush in my pack.”</i>", parse);
	}
	else {
		Text.Add("<i>“My tail, huh? Pretty sure you have other intentions. And if you don’t, then I’m pretty sure you’ll have them by the time you’re done. But okay, I’ll play along then, just try not to be too obvious about it,”</i> the [foxvixen] says, grinning mischievously.", parse);
		Text.NL();
		Text.Add("Same goes for [himher]. [HeShe] should at least pretend [heshe]’s not enjoying it too much, and try to keep [hisher] tail under control. It’s tough to brush with all the wagging. ", parse);
		Text.NL();
		Text.Add("As if proving your point, Terry’s tail begins wagging even more enthusiastically. <i>“Okay, I’ll try. But I can’t promise anything,”</i> [heshe] chuckles. <i>“Brush is in my pack.”</i>", parse);
	}
	Text.NL();
	
	Scenes.Terry.SkinshipRummagePack();
	
	Text.NL();
	Text.Add("Now that you have the brush, you make yourself comfortable and tell Terry that [heshe] should bend over your lap so that you can start properly brushing [hisher] tail.", parse);
	Text.NL();
	Text.Add("<i>“Alright.”</i> ", parse);
	var naked = false;
	if(terry.Slut() >= 60) {
		Text.Add("Terry begins undressing [himher]self, removing each piece of [hisher] [tarmorDesc].", parse);
		Text.NL();
		Text.Add("You can’t hold back a chuckle, even as you watch in appreciation as your little vulpine slut exposes ever more of [himher]self to the air. Unable to resist, you quip that you were only planning on brushing [hisher] tail, not the rest of [hisher] body.", parse);
		Text.NL();
		Text.Add("<i>“Hey, those clothes would only get in the way. Plus I was hoping to convince you to brush the rest of my fur too. Especially since you seem so fond of making it messy,”</i> [heshe] chuckles.", parse);
		Text.NL();
		Text.Add("True, true... well, you’ll both have to see if there’s anything you can do with the rest of [hisher] fur afterwards.", parse);
		Text.NL();
		Text.Add("The, now naked, [foxvixen] sashays your way, laying down atop your lap, tush high for easy access.", parse);
		naked = true;
		player.AddLustFraction(0.3);
	}
	else {
		Text.Add("Terry approaches, laying down on top of your lap, tush up in the air.", parse);
		Text.NL();
		Text.Add("You detect a hint of embarrassment from the [foxvixen]. But when you glance [hisher] way, [heshe] smiles back. Cute.", parse);
	}
	Text.NL();
	Text.Add("With your free hand, you carefully take hold of Terry’s tail and maneuver it to be more accessible. Holding it still, your other hand starts at the base of [hisher] tail and starts to smoothly and levelly glide down its length, toward the tip of [hisher] brush.", parse);
	Text.NL();
	Text.Add("You’re rather impressed; despite [hisher] rough lifestyle, Terry’s tail is quite luxuriously cared for, with no major snarls or tangles for you to comb out. At least, you haven’t found any yet. As you continue stroking Terry, you compliment [himher] on how much care [heshe] obviously takes in looking after [hisher] tail.", parse);
	Text.NL();
	Text.Add("<i>“Yeah, If I let it get too messy then it becomes pretty hard to move it around. And it also hurts.", parse);
	if(terry.Relation() >= 60) {
		Text.Add(" Plus keeping it neat makes it better for drawing the eyes of a certain someone,”</i> [heshe] adds, with a smile, wagging [hisher] tail a bit.", parse);
		Text.NL();
		Text.Add("You chuckle and assure [himher] that it most certainly does, then playfully mock-scold [himher] to keep it still; you can’t brush it whilst [heshe]’s waving it about.", parse);
	}
	else {
		Text.Add("”</i>", parse);
		Text.NL();
		Text.Add("You nod and express your sympathies. Still, [heshe] should feel proud of how good a job [heshe] does with it.", parse);
	}
	Text.NL();
	Text.Add("You return your attention to your task, brushing the long gold and white fur in smooth, even strokes. This close to the [foxvixen], you’re intimately aware of the weight of [hisher] body in your lap, the warmth of [hisher] presence and the faintest whiff of [hisher] personal scent.", parse);
	Text.NL();
	Text.Add("It’s very easy to lose yourself in the brushing, almost mechanically stroking as you savor the [foxvixen]’s body against your own. You can feel Terry leaning against you, soft sighs of contentment escaping the [foxvixen] as [heshe] basks under your care and relaxes with a dreamy look in [hisher] face.", parse);
	Text.NL();
	Text.Add("Almost involuntarily, your eyes are drawn to the shapely ass currently perched so invitingly before you. Terry looks almost stupefied; surely [heshe] wouldn’t protest if you were to give it a nice little grope?", parse);
	Text.NL();
	Text.Add("You gaze flicks to Terry’s head, and you can’t help a smile of amusement at the way [hisher] ears are daintily flicking in [hisher] half sleeping state. They’re just too cute; you really want to pet them...", parse);
	Text.NL();
	Text.Add("Then again, maybe you should just keep brushing...", parse);
	Text.Flush();
	
	//[Grope] [Pet] [Nope]
	var options = new Array();
	var tooltip = naked ? Text.Parse("[HeShe]’s just asking for it, flaunting that sweet ass without even the slightest stitch for modesty. Go on and give it a big squeeze...", parse) : Text.Parse("Even through [hisher] [tlowerArmor], Terry’s got a sweet ass. Why not cop a feel while you can?", parse);
	options.push({ nameStr : "Grope",
		func : function() {
			Text.Clear();
			Text.Add("Of course, you have more wits than to just cop a feel out of the blue. Besides, you’ve spent all this time and energy brushing the [foxvixen]’s tail; let’s see what your efforts have done.", parse);
			Text.NL();
			Text.Add("You stop brushing Terry’s tail and gently move to cup the bushy tip of the appendage, lifting it up closer to your face. Playfully, you give it a sniff, filling your nostrils with the Terry’s scent. Bringing it closer, you start to rub your cheek against it, closing your eyes to enjoy the feel of the soft, velvety fur brushing over your [skinDesc]. With your free hand, you start to run your fingers through the fur, half-stroking and half-combing the vulpine brush.", parse);
			Text.NL();
			if(terry.Slut() < 60 && terry.Relation() < 60) {
				Text.Add("<i>“[playername]? What are you doing,”</i> Terry asks, turning [hisher] head slightly to look up at you.", parse);
				Text.NL();
				Text.Add("With a smile, you assure [himher] that you’re simply admiring Terry’s tail... and, perhaps, the butt it’s attached to.", parse);
				Text.NL();
				Text.Add("<i>“Oh… alright then. I guess,”</i> [heshe] says, a bit embarrassed by your actions. Though you also detect a hint of excitement in the [foxvixen].", parse);
			}
			else {
				Text.Add("<i>“Hmm, I knew it. It was just a matter of time,”</i> Terry says knowingly, even as [hisher] tail moves to curl against your cheek.", parse);
				Text.NL();
				parse["nude"] = naked ? " stripped down and" : "";
				Text.Add("Well, [heshe] can’t really blame you; what did [heshe] expect when [heshe][nude] started flaunting this glorious ass right in your face? Grinning, you emphasize your point by giving your slutty [foxvixen]’s butt a nice squeeze with your free hand.", parse);
				Text.NL();
				Text.Add("<i>“Oh!”</i> [heshe] yelps at your sudden squeeze. <i>“You never fail to disappoint, do you? You big perv.”</i>", parse);
				Text.NL();
				Text.Add("Your only answer is a triumphant smirk, possessively caressing the fine vulpine butt again.", parse);
				Text.NL();
				Text.Add("<i>“Alright then, you got me. I’m in no position to fight back. So I guess I’m at your mercy,”</i> [heshe] says with a grin.", parse);
				Text.NL();
				Text.Add("That’s true enough... but, don’t worry; you know [heshe]’ll enjoy it...", parse);
			}
			Text.NL();
			if(naked) {
				Text.Add("Since your little slut of a [foxvixen] handily stripped down before [heshe] sat down, there’s nothing to stop you admiring the shapely curves of [hisher] ass. Terry’s hips twitch, wiggling [hisher] butt and ensuring your attention is drawn to the heart so boldly emblazoned on [hisher] ass. ", parse);
				
				if(terry.flags["BM"] == 0) {
					Text.Add("What’s this? You look down at Terry’s bubble-butt. A heart-shaped patch of golden fur is stamped on [hisher] right butt-cheek. You didn’t expect to see a tramp stamp on Terry’s butt, however you admit it looks kinda cute.", parse);
					terry.flags["BM"] = 1;
				}
				else {
					Text.Add("Terry’s birthmark stands out on [hisher]’s creamy butt, painting a tantalizing target for your attentions.", parse);
				}
				
				Text.Add(" Unthinkingly, you reach out and touch it, gently caressing the patch-colored fur and the flesh beneath.", parse);
				Text.NL();
				Text.Add("<i>“Wha? Hey cut it out!”</i> Terry exclaims, batting your hand with [hisher] tail. <i>“Don’t tease my birthmark, you perv!”</i>", parse);
				Text.NL();
				Text.Add("Like [heshe]’s one to talk, you quip back, waving aside the wagging tail to purposefully stroke the [foxvixen]’s tail again. After all, here [heshe] is with your hand on [hisher] ass and wagging [hisher] tail at it.", parse);
				Text.NL();
				Text.Add("<i>“W-Well… Just don’t tease my birthmark. You know how embarrassed that makes me...”</i>", parse);
				Text.NL();
				Text.Add("You shake your head, assuring [himher] that [heshe] really doesn’t have anything to be embarrassed about - it’s such a cute mark, and [heshe]’s got such a sexy ass to wear it on. [HeShe] should be proud of being able to show off something like that!", parse);
				Text.NL();
				Text.Add("But, if that’s the way [heshe] wants it, you’ll leave it alone. For now. [HeShe]’s kind of cute when [heshe] gets all upset like this...", parse);
				Text.NL();
				Text.Add("<i>“Alright… uhh… thanks.”</i>", parse);
			}
			else {
				Text.Add("Abandoning Terry’s fluffy tail for the moment, you reach for [hisher] [tlowerArmor], slowly tugging it down over [hisher] ass, sliding it down past [hisher] thighs until you have neatly peeled it off of [himher].", parse);
				Text.NL();
				Text.Add("As the [foxvixen] instinctively kicks out lightly with [hisher] legs, you reach down and caress the heart shape emblazoned so boldly on [hisher] ass, tracing the outline of the all-natural tramp stamp.", parse);
				Text.NL();
				Text.Add("<i>“Ah! Not my mark, you perv!”</i> Terry cries out as you trace [hisher] heart-shaped birthmark.", parse);
				if(terry.Relation() >= 60)
					Text.Add(" It doesn’t matter how familiar the two of you are with each other, [heshe] never stops being embarrassed about that. Even if it makes [himher] extra-cute.", parse);
				Text.NL();
				Text.Add("Smiling, you gently pat [himher] on the mark and promise you’ll leave it alone. You have so much else to play with, after all...", parse);
			}
			Text.NL();
			Text.Add("You resume stroking the [foxvixen]’s tail, this time harder and faster than before. No longer are you leisurely stroking, but instead making quick, firm passes through the lush fur. You run your fingers eagerly through [hisher] gold-and-white coat, feeling it gliding between your digits.", parse);
			Text.NL();
			Text.Add("After tiring of this, your hand moves from [hisher] tail to the full, heart-shaped cheeks of [hisher] plump rear. With the same energy, you start to caress and knead the flesh, running your fingers through the fur and cupping each bulging buttock. Your fingers push and slide, stroking the most sensitive spots you can find, shamelessly fondling the vulpine’s tush however you want.", parse);
			Text.NL();
			if(terry.FirstCock()) {
				Text.Add("You become distinctly aware of something hard and wet starting to poke against your thigh. It looks like your little [foxvixen] is enjoying [himher]self as much as you are. You pause your stroking for a few moments and adjust Terry slightly in your lap, moving [himher] into a position where you’ll both be more comfortable.", parse);
				Text.NL();
				Text.Add("A soft moan escapes the [foxvixen]-morph’s lips. Looking over at [hisher] face, you can see a mixture of pleasure and satisfaction.", parse);
				Text.NL();
			}
			var lubed = false;
			if(terry.FirstVag()) {
				Text.Add("A scent tickles at your nostrils and you sniff, trying to figure out what it is. After a few moments, you recognize it as the distinctive scent of female arousal - and it’s coming from between Terry’s legs. No matter how [heshe] squeezes [hisher] thighs together to try and hide it. With a grin, your hand snakes down, worming its way between the [foxvixen]’s clenched thighs to try and touch the dampness of [hisher] cunt.", parse);
				Text.NL();
				Text.Add("<i>“Ah!”</i> [HeShe] cries out as you make contact with [hisher] swollen netherlips. Moisture clings to your digits, proof of [hisher] intense arousal. You didn’t think a tail-stroke would have so much of an effect on the [foxvixen].", parse);
				Text.NL();
				lubed = true;
			}
			Text.Add("Your hands resume stroking the sweet ass in your lap, the now-free [foxvixen] tail sweeping eagerly back and forth in time with your hands. But the stroking isn’t enough; you want a little more...", parse);
			Text.NL();
			Text.Add("Slowly, your fingers creep like spiders into the cleavage of Terry’s bountiful buttocks, purposefully worming their way toward [hisher] ring. Your index finger traces the puckered ring of muscle in leisurely spirals, then starts to push against it.", parse);
			Text.NL();
			if(terry.Slut() < 30) {
				parse["lubed"] = lubed ? ", despite the feminine juices coating your fingers" : "";
				Text.Add("Whimpers of protest escape the [foxvixen]’s mouth as you try and worm your way inside[lubed]. It’s hard, because you have to fight for every inch; you wouldn’t say Terry’s a virgin, but [hisher] ass is definitely watertight. It’s quite obvious that Terry doesn’t know how to relax it properly, and you’re lucky to make it halfway inside.", parse);
				Text.NL();
				Text.Add("<i>“Hng, that hurts!”</i> [heshe] protests.", parse);
				Text.NL();
				Text.Add("Gently shushing [himher], you apologise, but tell [himher] that [heshe] needs to relax; this will stop hurting so much if only [heshe] can just loosen up back here. You try to help by carefully worming your finger back out, much easier than going in, leaving only the very tip still inside. With your free hand, you reach down and start to rub [hisher] lower back, rolling your palm around in smooth, steady circles, trying to coax the tight muscles to loosen.", parse);
				Text.NL();
				Text.Add("Terry sighs in pleasure, and you can feel [himher] slowly becoming more relaxed. Eventually the pressure [hisher] tight rosebud eases enough that you feel comfortable pushing back inside.", parse);
			}
			else if(terry.Slut() < 60) {
				parse["lubed"] = lubed ? ", even with the juices lubing your finger" : "";
				Text.Add("Terry mewls quietly, initially tensing at the pressure you’re exerting. After a few moments, though, the [foxvixen] sighs softly and relaxes, allowing your finger to just glide on in. Though it’s clearly seen some use, Terry’s tailhole is still very tight and you need to push with purpose to glide inside[lubed].", parse);
			}
			else {
				parse["lubed"] = lubed ? Text.Parse("You don’t even need the lube you made from [hisher] pussy-juice. ", parse) : "";
				Text.Add("There’s not even the slightest hesitation from your slutty [foxvixen]. [lubed]Terry’s well-trained asshole opens up before you, allowing you to slide in without a hitch. The only problem is getting your finger back <b>out</b>; the little slut has enough trained control to grip down like a vice when [heshe] wants.", parse);
			}
			Text.NL();
			Text.Add("<i>“Ah! Ohm!”</i> the [foxvixen] moans as you pump your finger into [hisher] ass. [HeShe] pants, desire clear in [hisher] eyes when [heshe] sneaks a glance at you. Your heart skips a beat, a stab of desire surging through you.", parse);
			Text.NL();
			Text.Add("Maybe you should invite the [foxvixen] for a little tumble in the hay...", parse);
			Text.Flush();
			
			//[Sex][No Sex]
			var options = new Array();
			options.push({ nameStr : "Sex",
				func : function() {
					Text.Clear();
					if(terry.Relation() < 60)
						Text.Add("<i>“Sounds good to me!”</i> Terry readily agrees, suppressing a moan as you continue to finger [himher].", parse);
					else
						Text.Add("<i>“Finally! I was wondering how many more signs that I want it you’d need to spring into action,”</i> Terry teases, clenching [hisher] ass around your finger.", parse);
					Text.NL();
					Text.Add("With a grin, you extract your finger from Terry’s tailhole, petting [hisher] butt affectionately before giving [himher] a helping hand to push out of your lap and stand up.", parse);
					Text.NL();
					
					var scenes = new EncounterTable();
					scenes.AddEnc(function() {
						parse["fox"] = terry.HorseCock() ? "horse" : "fox";
						Text.Add("<i>“So what are we doing? I’m already rock-hard. Maybe you’d like to add some [fox]-meat to your diet? Or maybe you just need something to fill you up?”</i> [heshe] suggests with a lusty grin.", parse);
					}, 1.0, function() { return terry.FirstCock(); });
					scenes.AddEnc(function() {
						Text.Add("<i>“What’s it gonna be, [playername]? You finally going to break my virgin pussy in?”</i>", parse);
					}, 1.0, function() { return terry.FirstVag() && terry.FirstVag().virgin && (player.FirstCock() || player.Strapon()); });
					scenes.AddEnc(function() {
						Text.Add("<i>“Tell me what are we doing? I’m so wet I can barely stand it anymore!”</i>", parse);
					}, 1.0, function() { return terry.FirstVag() && terry.FirstVag().virgin == false; });
					scenes.AddEnc(function() {
						Text.Add("<i>“So what are you planning? Personally, I’m a bit hungry. Think you could feed me?”</i>", parse);
					}, 1.0, function() { return player.FirstCock(); });
					scenes.AddEnc(function() {
						Text.Add("<i>“I got an itch in my butt, and I just can’t reach it. Got something long and hard to help me with?”</i>", parse);
					}, 1.0, function() { return player.FirstCock() || player.Strapon(); });
					
					scenes.AddEnc(function() {
						Text.Add("<i>“Feeling a bit thirsty, think you can get me something to drink? Maybe some juice?”</i> [heshe] grins.", parse);
					}, 1.0, function() { return player.FirstVag(); });
					scenes.AddEnc(function() {
						Text.Add("<i>“My boobs feel so heavy… I could really use a hand over here,”</i> [heshe] says, caressing [hisher] breasts.", parse);
					}, 1.0, function() { return terry.Lactation() && (terry.Milk() >= terry.MilkCap()); });
					
					scenes.Get();
					
					player.AddLustFraction(0.5);
					terry.AddLustFraction(1);
					terry.relation.IncreaseStat(50, 1);
					
					Text.Flush();
					
					Scenes.Terry.SexPromptChoice(function() {
						Text.Clear();
						Text.Add("<i>“What? After getting me all worked up, you’re going to back down <b>now</b>!?”</i>", parse);
						Text.NL();
						Text.Add("Well… yes.", parse);
						Text.NL();
						Text.Add("Terry sighs, frowning and looking incredulously at you. <i>“I can’t believe you’re going to leave me hanging after all that. Sometimes you can be kind of a jerk you know? Alright then, guess I have no say in the matter anyway, so suit yourself! ”</i> the [foxvixen] exclaims, gathering [hisher] clothes and walking away.", parse);
						Text.Flush();
						
						terry.relation.DecreaseStat(30, 3);
						
						Gui.NextPrompt();
					});
				}, enabled : true,
				tooltip : Text.Parse("Come on, [heshe]’s begging for it!", parse)
			});
			options.push({ nameStr : "No sex",
				func : function() {
					Text.Clear();
					Text.Add("Steeling yourself, you just grin innocently back at the pleading [foxvixen] in your lap. As you do, your finger continues to pump back and forth, curling slightly as you twisted in order to continue teasing [himher]. ", parse);
					Text.NL();
					Text.Add("Terry’s toes curl, tail thrashing a bit. [HeShe] continues to look pleadingly at you, grabbing at the ground as you continue to pleasure [himher]. Despite [hisher] obvious desire, [heshe] says nothing.", parse);
					Text.NL();
					Text.Add("Finger still methodically pumping away, you turn your attention back to the [foxvixen]’s twitching tail, your other hand still smoothly stroking it. You manage to get a nice rhythm going; stroke-pump, stroke-pump, combining each brushing motion with a matching thrust into Terry’s ass. You wonder how much more of this [heshe] can take...", parse);
					Text.NL();
					Text.Add("Some other time, you might be interested in seeing. But, right now, you don’t feel that way. Instead, you carefully pop your finger free from the sucking embrace of Terry’s tailhole, giving [himher] a conciliatory pat on the butt with that hand. You continue stroking for a few moments, before you slowly put your brush away and cheerfully announce Terry’s good to go.", parse);
					Text.NL();
					if(terry.Relation() < 60) {
						parse["nude"] = naked ? Text.Parse(", and finds [hisher] clothes", parse) : "";
						Text.Add("<i>“Huh? Oh, right... thanks,”</i> the [foxvixen] mumbles. [HeShe] sounds a bit disappointed as [heshe] carefully slips out of your lap[nude].", parse);
					}
					else {
						Text.Add("<i>“Wait, what? That’s all?”</i> the [foxvixen] asks in protest.", parse);
						Text.NL();
						Text.Add("Cheerfully, you assure [himher] that’s all; [hisher] tail’s all nice and groomed now. Did [heshe] enjoy your efforts?", parse);
						Text.NL();
						Text.Add("<i>“Well, yes. But after all that teasing, what am I supposed to do about this?”</i>", parse);
						if(terry.FirstCock())
							Text.Add(" [HeShe] points to [hisher] erect cock. Already at full mast and dripping pre.", parse);
						else
							Text.Add(" [HeShe] points to [hisher] moist cunt. Already puffy and dripping out the signals of [hisher] excitement.", parse);
						Text.NL();
						Text.Add("Smiling, you reach out and playfully tussle the [foxvixen]’s ears with your fingertips. And what’s wrong with [himher] being a little excited. You quite like how [heshe] looks like that.", parse);
						Text.NL();
						Text.Add("<i>“Aww, come on! You’re not going to leave me hanging like this, are you?”</i> Terry asks, pouting pleadingly at you.", parse);
						Text.NL();
						Text.Add("Ha! And [heshe] calls you a perv. Well, you did just want to touch that fluffy tail of [hishers], getting [himher] all worked up was just a bonus. And considering how cute [heshe] looks when [heshe] pleads like that, you think you’re going to make [himher] wait for it. At least for a little while.", parse);
						Text.NL();
						Text.Add("<i>“You big meanie...”</i> [heshe] huffs.", parse);
						Text.NL();
						Text.Add("If [heshe]’s a good [boygirl], you promise to help [himher] with that. For now tho, [heshe] should get dressed.", parse);
						Text.NL();
						Text.Add("Sighing, Terry conceded. <i>“Fiiiine. I guess there’s no arguing with you...”</i>", parse);
						Text.NL();
						Text.Add("Good [boygirl].", parse);
					}
					Text.Flush();
					
					player.AddLustFraction(0.3);
					terry.AddLustFraction(1);
					terry.relation.IncreaseStat(50, 1);
					
					Scenes.Terry.Prompt();
				}, enabled : true,
				tooltip : Text.Parse("It’s more fun to keep teasing [himher]; let’s just watch [himher] squirm.", parse)
			});
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true,
		tooltip : tooltip
	});
	options.push({ nameStr : "Pet",
		func : function() {
			Text.Clear();
			Text.Add("Slowly, your free hand stretches out toward the dozy [foxvixen]’s head, even as the other continues to languidly caress [hisher] tail. Your fingers stroke softly through the flowing red locks that crown Terry’s head, feeling it gliding so smoothly between your digits. ", parse);
			Text.NL();
			Text.Add("After a few moments of luxuriating there, your hands reach higher, for the twitching vulpine ears that crown the [foxvixen]’s head. You take the closest one carefully between forefinger and thumb, slowly rubbing tender circles around its surface with your digits, then moving down to stroke the base of the triangular lobe.", parse);
			Text.NL();
			Text.Add("<i>“Hmm, that feels good,”</i> Terry says with a happy smile, eyes closing shut as [heshe] enjoys your caress.", parse);
			Text.NL();
			Text.Add("You grin at the contentment your vulpine pet is showing, continuing to caress [hisher] ear for a moment before moving your fingers to the top of [hisher] scalp. With just the right amount of pressure, you start to scratch [himher] between the ears in that spot you’re sure [heshe]’ll just love.", parse);
			Text.NL();
			Text.Add("A soft whimper escapes [himher] and Terry tries to disguise it with a fake cough. <i>“Umm, sorry. I must’ve choked or something.”</i> Of course, you see right through. [HeShe] looks so much like a pet fox right now…", parse);
			Text.NL();
			Text.Add("For now you decide to ignore Terry’s lame excuse and focus on your ministrations. Your whole palm now overlays itself on Terry’s head, stroking back and forth, tussling [hisher] ears from side to side. Your hand goes gliding down through the flowing red locks, held together in the crude tail that the [foxvixen] sports, and you can’t resist tickling at the back of [hisher] neck.", parse);
			Text.NL();
			Text.Add("<i>“A bit more to the left,”</i> Terry says, wagging [hisher] tail softly.", parse);
			Text.NL();
			Text.Add("With a grin, you comply in shifting your fingers and scratching what is clearly an itchy spot. Flippantly, you comment that you always thought a love of being petted was more a dog-thing than a fox-thing. Or are you just that good at it, hmm?", parse);
			Text.NL();
			Text.Add("<i>“Shut it and keep stroking - Oh! - right there!”</i> [HeShe] whimpers again, this time not bothering to hide it.", parse);
			Text.NL();
			Text.Add("Smirking openly now, you continue to scratch away, your other hand abandoning its place at Terry’s tail to creep up the small of [hisher] back, stroking in search of further itches to soothe and sweet-spots to touch.", parse);
			Text.NL();
			Text.Add("Soon, Terry is openly groaning in pleasure, wriggling like an overgrown puppy in your lap as your fingers stroke all the right spots. [HisHer] kneeling position prevents [himher] from kicking out like a dog getting a belly-rub, but it certainly doesn’t stop [hisher] tail beating a tattoo of delight against your side.", parse);
			Text.NL();
			Text.Add("You while away some very pleasant minutes simply petting, stroking and scratching your happy little pet, [hisher] tongue lolling out shamelessly in pleasure, but eventually you have to stop. With one last gentle stroke on the head, you inform Terry that [hisher] brushing is done now.", parse);
			Text.NL();
			Text.Add("<i>“Aw, already?”</i> [heshe] asks, a hint of disappointment apparent in [hisher] voice.", parse);
			Text.NL();
			Text.Add("Yes, already, you quip back playfully.", parse);
			Text.NL();
			Text.Add("Sighing, Terry gently touches up [hisher] hair and smiles at you. <i>“Thanks a lot, [playername]. I should have you brush my tail more often.”</i>", parse);
			Text.NL();
			parse["l"] = player.LowerBodyType() == LowerBodyType.Single ? ", so to speak," : "";
			Text.Add("You smile back, assuring [himher] that you’d be happy to give [himher] a hand whenever [heshe] feels like it. But, for now, you both have other things to do. Terry sighs and vacates your lap, whilst you get back to your feet[l] and head off again.", parse);
			Text.Flush();
			
			player.AddLustFraction(0.3);
			terry.AddLustFraction(0.3);
			terry.relation.IncreaseStat(50, 2);
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : Text.Parse("Terry’s just too much like a big sleepy dog to resist. Let’s see what petting [himher] will do when [heshe]’s in this kind of state...", parse)
	});
	options.push({ nameStr : "Nope",
		func : function() {
			Text.Clear();
			Text.Add("Quietly, you continue to brush the [foxvixen]’s sleek, clean tail-fur, running the prongs of your brush through [hisher] tail in companionable silence. The two of you remain there for several pleasant moments, just feeling each other’s body next to you, before you put the brush aside and announce that you’re finished.", parse);
			Text.NL();
			Text.Add("Terry lifts [himher]self off your lap, reaching back to pet [hisher] tail. <i>“Alright, that looks great. It sure beats having to brush by myself. Thanks a lot, [playername].”</i>", parse);
			Text.NL();
			Text.Add("It was your pleasure, you reply, then add that if ever [heshe] wants a hand, you’d be happy to help again. Gathering up your own stuff, you head back off on your way again.", parse);
			Text.Flush();
			terry.relation.IncreaseStat(50, 1);
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : Text.Parse("You promised Terry you were only going to brush [hisher] tail, so you’ll push aside the temptation and keep at it.", parse)
	});
	Gui.SetButtonsFromList(options, false, null);
}


Scenes.Terry.CheckFluids = function() {
	var parse = {
		foxvixen       : terry.mfPronoun("fox", "vixen"),
		boygirl        : terry.mfPronoun("boy", "girl"),
		armorDesc      : function() { return terry.ArmorDesc(); },
		topArmorDesc   : function() { return terry.ArmorDesc(); },
		lowerArmorDesc : function() { return terry.LowerArmorDesc(); },
		tbreastDesc   : function() { return terry.FirstBreastRow().Short(); },
		tcockDesc      : function() { return terry.MultiCockDesc(); },
		bellydesc      : function() { return terry.StomachDesc(); },
		playername : player.name
	};
	parse = terry.ParserPronouns(parse);
	
	terry.flags["Skin"]++;
	
	Text.Clear();
	Text.Add("Looking Terry over, you tell the [foxvixen] that you need [himher] to strip for what you have in mind.", parse);
	Text.NL();
	if(terry.Relation() < 30) {
		Text.Add("The [foxvixen] glares daggers at you, but ultimately complies with a resigned sigh. Slowly [heshe] removes [hisher] [armorDesc] and sets it aside.", parse);
	}
	else if(terry.Relation() < 60) {
		Text.Add("[HeShe] raises a brow at your request, but moves to comply. <i>“Now you’re making me dubious about your intentions, [playername],”</i> [heshe] says as [heshe] removes [hisher] [armorDesc].", parse);
		Text.NL();
		Text.Add("You assure [himher] that your intentions are innocent. Well, innocent-ish.", parse);
		Text.NL();
		Text.Add("<i>“Riiiiight,”</i> [heshe] replies rolling [hisher] eyes.", parse);
	}
	else { //high rel
		Text.Add("<i>“That eager to see me naked, huh? One look and you just can’t get enough, is that it?”</i> [heshe] asks teasingly.", parse);
		Text.NL();
		Text.Add("[HeShe] sure has you figured out; but, seriously, you really do need [himher] naked for this, too.", parse);
		Text.NL();
		Text.Add("<i>“Oh, I didn’t say I wouldn’t strip for you. I just thought that I’d get you to help me a little. Especially since you’re in such a rush to see me in my birthday suit,”</i> [heshe] grins.", parse);
		Text.NL();
		Text.Add("Rolling your eyes playfully at the horny [foxvixen]’s antics, you step forward to help [himher] get undressed.", parse);
		Text.NL();
		Text.Add("Terry giggles as you begin undoing [hisher] [topArmorDesc]. <i>“You’re such a pervert, [playername]. All it took was a little invitation and you came to me like a moth to a flame,”</i> [heshe] grins.", parse);
		Text.NL();
		Text.Add("What moth worthy of the name could resist when the flame is as enticing as Terry, you quip back. Having removed [hisher] [topArmorDesc], you start to work on [hisher] [lowerArmorDesc]. The coquettish [foxvixen] eagerly plays along, daintily lifting [hisher] foot to help you get the gear off and teasingly brushing [hisher] fluffy tail against your side, until finally [heshe] is totally naked before you.", parse);
		Text.NL();
		Text.Add("<i>“Done? Great! Now let’s get started,”</i> Terry says, wrapping [hisher] arms around your neck and pulling you into a kiss.", parse);
		Text.NL();
		Text.Add("You let the [foxvixen]’s lips touch your own, for a moment, but then insistently push [himher] away. Now who’s the pervert? You just said you needed [himher] to be naked, you never said you were out for sex.", parse);
		Text.NL();
		Text.Add("<i>“What? But I thought...</i> [heshe] trails off, pouting.", parse);
		Text.NL();
		Text.Add("You gently scold [himher] to not look at you like that; [heshe]’s the one who let [hisher] libido carry [himher] away. But, you assure [himher] that [heshe]’ll enjoy what you have in mind, and maybe you’ll have sex with [himher] after you’re done...", parse);
		Text.NL();
		Text.Add("<i>“Hmph, I’ll be holding you to that promise,”</i> [heshe] replies, taking a step back and crossing [hisher] arms. <i>“Alright then, just carry on with whatever you had in mind.”</i>", parse);
	}
	Text.NL();
	//BREASTS
	if(terry.Lactation()) {
		Text.Add("Your eyes are drawn to the [foxvixen]’s [tbreastDesc], filled with their liquid cargo... but just how full are they? Well, there’s only one way to get a proper estimate.", parse);
		Text.NL();
		Text.Add("Closing the distance between you, your hands reach out for Terry’s tits. ", parse);
		if(terry.Cup() >= Terry.Breasts.Dcup)
			Text.Add("The heaving, near basketball-sized breasts are far too large for you to have a hope of fitting in a single hand. Instead, both hands reach out for a single vulpine mammary, wrapping themselves around the abundant titflesh as best they can. Even with this presumptory touch, you can feel the weight of it.", parse);
		else if(terry.Cup() >= Terry.Breasts.Ccup)
			Text.Add("Terry’s breasts squish nicely between your fingers, just a little bit too big for your hands, but not so much that you can’t effectively feel them with one hand to each one.", parse);
		else if(terry.Cup() >= Terry.Breasts.Bcup)
			Text.Add("The [foxvixen] has breasts perfectly sized for this, each nestling snugly into your grasping fingers and easy to grope.", parse);
		else
			Text.Add("[HisHer] petite breasts are actually a little tricky to get a proper hold of, they’re so small, but it should certainly make it easier to do what you have in mind.", parse);
		Text.NL();
		Text.Add("A soft moan escapes the [foxvixen]’s lips. <i>“Not so rough! They’re sensitive...”</i>", parse);
		Text.NL();
		Text.Add("You promise [himher] that you’ll try to be more gentle, and give [himher] a moment to adjust to the feeling of your fingers wrapping around the soft flesh. Once [heshe] seems to be comfortable, you start to gently knead [hisher] breast, groping and squeezing, lifting them in your palms as best you can to better feel their weight.", parse);
		Text.NL();
		if(terry.Milk() >= Terry.MilkLevel.VeryHigh)
			Text.Add("You’re amazed by the sheer weight of Terry’s tits in your hands; there’s no question that [heshe] is absolutely bloated with milk. It’s amazing that it doesn’t leak automatically from the sheer quantity contained within; it’s effortless for you to coax milk forth, and once [heshe] starts seeping, a simple squeeze can actually send a fine squirt of milk flying.", parse);
		else if(terry.Milk() >= Terry.MilkLevel.High)
			Text.Add("The weight of the [foxvixen]’s breasts is a palpable thing, so engorged with milk that your first exploratory squeeze makes [himher] start to drip. By the time you are finished with your explorations, a constant trickle of milk is seeping from [hisher] nipples, slowly trailing down [hisher] breasts.", parse);
		else if(terry.Milk() >= Terry.MilkLevel.Mid)
			Text.Add("You can feel a noticeable weight to Terry’s bosom as you manipulate it with your hands. Almost as soon as your groping caresses tease [hisher] nipples into erecting, they start to drip whiteness from their tips. Terry clearly has a good supply of milk in [hisher] bosom; it would be very easy to tap [himher] if you wanted.", parse);
		else if(terry.Milk() >= Terry.MilkLevel.Low)
			Text.Add("There’s a little weight to [hisher] breasts, just barely enough for you to notice them. Terry moans softly as you knead and stroke, though it takes a lot of attention to coax a single precious bead of milk from [hisher] bosom. It looks like Terry doesn’t have much milk in [hisher] breasts at all, you’d probably drink [himher] dry if you tried to nurse.", parse);
		else
			Text.Add("Terry’s breasts feel surprisingly light in your hands. And though you knead and stroke until [hisher] nipples are visibly engorged and [heshe] is moaning softly in pleasure, not a drop of precious milk comes out. It looks like [heshe] has been completely tapped; there isn’t any milk left in [himher].", parse);
		if(terry.FirstCock()) {
			Text.NL();
			Text.Add("Having finished testing Terry’s breasts, your attention is drawn in turn to [hisher] [tcockDesc]. Well, since you’re here and all...", parse);
			Text.NL();
		}
	}
	//COCK
	if(terry.FirstCock()) {
		if(terry.HorseCock()) {
			parse["preg"] = terry.PregHandler().IsPregnant() ? Text.Parse(", slapping heavily against [hisher] [bellydesc]", parse) : "";
			Text.Add("The footlong equine shaft hanging heavily between the [foxvixen]’s legs draws your hand like a magnet, compelling you to stroke its mottled brown length. A whimper bubbles from Terry’s throat as you touch the overly sensitive organ, which practically leaps erect in your hands[preg]. Not wanting to push [himher] too far, you quickly move to instead cup the heavy balls that fuel [hisher] new beast of a dick.", parse);
		}
		else {
			Text.Add("Your hand brushes the [foxvixen]’s dainty little vulpine dick, the healthy pink flesh pulsing under your touch, growing just that bit firmer in response. Terry fidgets a little as you slide up and down across the [foxvixen]’s petite shaft, caressing its bobbing pointy tip before reaching down to cup the equally petite testicles swaying between [hisher] legs.", parse);
		}
		Text.NL();
		Text.Add("Terry moans as you knead [hisher] shaft and balls, hips moving against your touch.", parse);
		Text.NL();
		Text.Add("Calmly but firmly, you tell the [foxvixen] to stop moving; you can’t measure how heavy [hisher] load is when [heshe] keeps wriggling around like that.", parse);
		Text.NL();
		Text.Add("<i>“Oh yeah? Then maybe you shouldn’t give me a handjob while checking for that. You try staying still when someone is jacking you off,”</i> [heshe] replies in mild annoyance.", parse);
		Text.NL();
		parse["cutehuge"] = terry.HorseCock() ? "huge" : "cute";
		Text.Add("Clicking your tongue in mock-reproach, you chide Terry that [heshe]’s supposed to be a big, tough thief; surely [heshe] can keep still for a few seconds whilst you’re finishing weighing up this [cutehuge] [tcockDesc] of [hishers]? Or is the big bad [foxvixen] just a pervy little wimp, you ask, playfully poking the tip of [hisher] dick for emphasis.", parse);
		Text.NL();
		Text.Add("<i>“Hng! Me? A perv? What about you? Fondling me so casually...”</i>", parse);
		Text.NL();
		Text.Add("You’re just performing a routine medical check-up on your pet [foxvixen]; [heshe]’s the one who’s getting all worked up over it, you reply, shaking a finger at [himher] as if in chastisement.", parse);
		Text.NL();
		Text.Add("The [foxvixen] looks at you with disdain. <i>“You’re not convincing anyone… but fine. I’ll try to stop moving if you stop stroking me.", parse);
		if(terry.Slut() < 30)
			Text.Add("”</i>", parse);
		else if(terry.Slut() < 60) {
			Text.Add(" Not that I mind getting a handjob,”</i> [heshe] grins mischievously.", parse);
			Text.NL();
			Text.Add("You just bet [heshe] doesn’t. Well, if that’s what [heshe] needs to convince [himher] to stay still, you’re happy for [himher] to think of it that way.", parse);
		}
		else {
			Text.Add(" Of course, if you really want to check the size of my load, nothing can be quite as accurate as seeing it for yourself. So feel free to keep going,”</i> [heshe] says, grinning mischievously.", parse);
			Text.NL();
			Text.Add("Pervert. [HeShe]’s definitely a pervert. But, [heshe]’s <b>your</b> pervert, and that’s part of the reason why you love [himher]. You’ll consider treating [himher] to some R&R later, but right now you mean business. So [heshe] can either cooperate and get some later, or get a serious case of blue balls. What’s it gonna be?", parse);
			Text.NL();
			Text.Add("The [foxvixen] sighs with a knowing smile. <i>“Well, if you put it that way. I guess I have no choice but to obey, right?”</i>", parse);
			Text.NL();
			Text.Add("Good [boygirl].", parse);
		}
		Text.NL();
		parse["petitebulging"] = terry.HorseCock() ? "bulging" : "petite";
		Text.Add("Your hands continue to stroke and caress the [foxvixen]’s [petitebulging] balls, gently kneading them and rolling them around on your palms as you try to gauge their weight and firmness, and from that the amount of semen stored within.", parse);
		Text.NL();
		var cum = terry.Cum();
		if(cum >= Terry.CumLevel.High)
			Text.Add("It goes without saying that Terry’s balls are full of cum; you can practically see the difference in size even before you touch them. In your hands, the seed-bloated orbs have a substantial amount of weight to them, straining over their liquid contents to the point the tension is palpable with the slightest touch. The [foxvixen] can’t hold back a plaintive moan, a bead of precum visibly welling from [hisher] shaft at the gentle pressure you inflict. You really doubt Terry would object to getting some venting, if you were of a mind.", parse);
		else if(cum >= Terry.CumLevel.Mid)
			Text.Add("There’s a very real weight to Terry’s nuts, well beyond what [heshe] should normally have. There’s no question that there’s an abundance of semen in there; you can feel the firmness of [hisher] balls under your fingers as it packs them full. A quiver wracks the [foxvixen]’s form, and a moan escapes Terry’s mouth, letting you know how sensitive they are as a result. It’d be quite messy if you were to tap [himher] now.", parse);
		else if(cum >= Terry.CumLevel.Low)
			Text.Add("You can definitely feel a little extra weight to the [foxvixen]’s balls, and there’s a definite firmness to the touch. You’d hesitate to say that [heshe]’s extremely loaded with semen, but it feels like [heshe] has enough for a nice fuck if you were in the mood.", parse);
		else
			Text.Add("Despite your efforts, you can’t really feel any weight beyond what you’d consider normal for Terry. Not only that, but they feel quite soft to the touch. You’d have to guess that [heshe]’s pretty much running on empty, practically nothing left inside them at all. Might be best to leave [himher] to fill up a while before your next session.", parse);
	}
	Text.NL();
	
	terry.AddLustFraction(0.3);
	
	Text.Add("Satisfied with your assessment, you let the [foxvixen] go and take a step back, assuring [himher] that you’re finished now and [heshe] can put [hisher] clothes back on.", parse);
	Text.NL();
	if(terry.Relation() < 30)
		Text.Add("<i>“Alright then,”</i> Terry says, putting [hisher] [armorDesc] back on.", parse);
	else if(terry.Relation() < 60) {
		Text.Add("<i>“Oh? You’re finished? Alright then,”</i> [heshe] says with a hint of disappointment as [heshe] begins dressing back up.", parse);
		Text.NL();
		Text.Add("This is definitely not the same shy [foxvixen] you used to know; [heshe]’s really changed since you’ve been together. Maybe you should consider sticking around a little longer...", parse);
	}
	else {
		Text.Add("<i>“Aww, you’re not even going to play with me?”</i> [heshe] asks provocatively.", parse);
		Text.NL();
		Text.Add("You make a show of it, but you really are considering the question. [HeShe] <b>is</b> right there, and clearly ready to play... it’d honestly be kind of a shame to waste it... ", parse);
		Text.Flush();
		
		var backFunc = function() {
			Text.Clear();
			Text.Add("<i>“Alright then, but maybe later?”</i>", parse);
			Text.NL();
			Text.Add("Nodding your head, you assure the [foxvixen] that it should be possible.", parse);
			Text.NL();
			Text.Add("<i>“It’s a promise!”</i> [heshe] exclaims, gathering [hisher] [armorDesc].", parse);
			Text.Flush();
			
			Scenes.Terry.Prompt();
		};
		
		//[Sex] [No Sex]
		var options = new Array();
		options.push({ nameStr : "Sex",
			func : function() {
				Text.Clear();
				Text.Add("<i>“I knew you couldn’t resist my sexy charms, you big perv,”</i> Terry teases.", parse);
				Text.Flush();
				
				Scenes.Terry.SexPromptChoice(backFunc);
			}, enabled : true,
			tooltip : Text.Parse("[HeShe] wants to play, and you’re in the mood as well; why not?", parse)
		});
		options.push({ nameStr : "No sex",
			func : backFunc, enabled : true,
			tooltip : Text.Parse("No, you’re not really in the mood. [HeShe] can put [hisher] clothes back on.", parse)
		});
		Gui.SetButtonsFromList(options, false, null);
		
		return;
	}
	Text.Flush();
	
	Scenes.Terry.Prompt();
}

// TODO
Scenes.Terry.SexPrompt = function(backPrompt) {
	var parse = {
		foxvixen : terry.mfPronoun("fox", "vixen"),
		HeShe   : terry.HeShe(),
		heshe   : terry.heshe(),
		HisHer  : terry.HisHer(),
		hisher  : terry.hisher(),
		himher  : terry.himher(),
		hishers : terry.hishers(),
		tarmorDesc : function() { return terry.ArmorDesc(); },
		master : player.mfTrue("master", "mistress"),
		lowerArmorDesc : function() { return player.LowerArmorDesc(); },
		playername : player.name
	};
	
	Gui.Callstack.push(function() {
		Text.Add("Done appreciating your vulpine pet’s naked form, you step around so that you are in front of [himher], rubbing your chin idly as you consider how you want to fuck the [foxvixen] this time...", parse);
		Text.Flush();
		Scenes.Terry.SexPromptChoice(backPrompt);
	});
	
	if(terry.Slut() >= 60) {
		Text.Add("With practiced motions, Terry begins stripping [hisher] [tarmorDesc], each motion a flourish that emphasises [hisher] assets. You watch the delicate [foxvixen]’s strip-tease enraptured, drinking in every detail on [hisher] lithe body, until [heshe] is completely naked.", parse);
		player.AddLustFraction(0.2);
	}
	else if(terry.Slut() >= 30)
		Text.Add("Terry eagerly begins removing [hisher] [tarmorDesc].", parse);
	else {
		Text.Add("Terry reluctantly begins stripping off [hisher] [tarmorDesc], taking off each piece of [hisher] garment painstakingly slowly.", parse);
		if(terry.Relation() >= 30)
			Text.Add(" Whether to entice you, or out of shyness, you don’t know.", parse);
	}
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“How’s this?”</i> [heshe] asks, puffing [hisher] chest and proudly displaying [himher]self before you. <i>“Ready for the taking?”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“I’m ready… [master],”</i> the [foxvixen] says, kneeling before you.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Alright, I guess I’m ready,”</i> the [foxvixen] says, standing before you.", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.NL();
	parse["malefemaleherm"] = Gender.Desc(terry.Gender());
	parse["nervousnessarousal"] = terry.Relation() < 30 ? "nervousness" : "arousal";
	Text.Add("You make a point of circling Terry, looking up and down and studying every inch of the [malefemaleherm]’s naked form. As [hisher] tail waves gently in [nervousnessarousal], it exposes a prominent “birthmark” on [hisher] buttcheek; though a large patch of pure white otherwise envelops [hisher] ass and the backs of [hisher] thighs, on the right cheek there is a large love-heart-shaped patch of the rich golden color that adorns the rest of [hisher] body.", parse);
	Text.NL();
	
	if(terry.flags["BM"] == 0) {
		terry.flags["BM"] = 1;
		Text.Add("Motivated by curiosity, you reach out with your hand to touch it, gently trailing your fingers through the [foxvixen]’s soft fur and tracing the edge of the heart-design on [hisher] lusciously shapely asscheek. There’s no question that it’s real.", parse);
		Text.NL();
		Text.Add("The [foxvixen] thief gasps as you trace, ears flattening against [hisher] skull as [heshe] protests, <i>“D-Don’t touch my birthmark!”</i>", parse);
		Text.NL();
		Text.Add("That’s some reaction! But what’s wrong with touching it?", parse);
		Text.NL();
		Text.Add("<i>“It’s embarrassing...”</i>", parse);
		Text.NL();
		Text.Add("Isn’t that just so cute...", parse);
		Text.Flush();
		
		//[Tease][Praise]
		var options = new Array();
		options.push({ nameStr : "Tease",
			func : function() {
				Text.Clear();
				Text.Add("Smirking, you cup the [foxvixen]’s asscheek in one hand, kneading the soft flesh over the birthmark with slow, sensual caresses. Now, whyever should [heshe] be so embarrassed over it? After all, it’s not like it isn’t the most blatant beauty spot you’ve ever seen, just perfect for such a sweet, luscious ass... Why, it’s like a perfect target for anyone who wants to spank [himher], or fuck [hisher] ass...", parse);
				Text.NL();
				Text.Add("Terry shudders, [hisher] body temp spiking as [heshe] flushes with such deep embarrassment that you can see the crimson redness covering [hisher] cheeks. <i>“J-Just stop teasing me and get to the point, you jerk!”</i>", parse);
				Text.NL();
				
				terry.relation.DecreaseStat(-100, 2);
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : Text.Parse("Maybe you should tease [himher]? It’s clearly a sensitive spot and you could do with having some fun at the [foxvixen]’s expense.", parse)
		});
		options.push({ nameStr : "Praise",
			func : function() {
				Text.Clear();
				Text.Add("Shaking your head, you gently chide Terry for getting embarrassed; [heshe] has such a beautiful body, [heshe] should be proud of it! And this mark, why, it’s simply so fitting for [himher]; surprisingly cute and delicate, but bold and flamboyant when seen. It emphasizes the lusciousness of [hisher] sweet ass wonderfully, drawing the eye in to appreciate it, inviting the onlooking to touch, to rub, to fondle...", parse);
				Text.NL();
				Text.Add("<i>“But it’s embarrassing!”</i> [heshe] protests. ", parse);
				if(terry.Gender() == Gender.male)
					Text.Add("<i>“I’m a boy dammit! But I have that girly tramp stamp permanently tattooed on my butt!”</i> [heshe] exclaims. ", parse);
				Text.Add("<i>“Can you imagine what’s like growing on the streets? With that thing on my butt? I was bullied left and right because of it!”</i>", parse);
				Text.NL();
				Text.Add("Moving closer, you gently draw the [foxvixen] into your arms, folding them around [himher] in a soft, comforting embrace. Leaning closer to [hisher] vulpine ear, you tell [himher] that [heshe] has nothing to be ashamed of. [HeShe] is beautiful, and this - your hand moves to cover the vulpine morph’s birthmark, tenderly stroking the gold-on-white fur - this is just part of [hisher] beauty. They were idiots, teasing [himher] for what they didn’t understand. In fact, they were probably just jealous...", parse);
				Text.NL();
				Text.Add("<i>“You really think so?”</i>", parse);
				Text.NL();
				Text.Add("You assure [himher] that you know so.", parse);
				Text.NL();
				Text.Add("<i>“Thanks, [playername]. I guess… well, I guess you can touch it. Sometimes.”</i>", parse);
				Text.NL();
				
				terry.relation.IncreaseStat(100, 3);
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : Text.Parse("That mark is pretty attractive. Terry should learn to appreciate [hisher] charms better.", parse)
		});
		Gui.SetButtonsFromList(options, false, null);
		return;
	}
	else {
		var scenes = new EncounterTable();
		
		scenes.AddEnc(function() {
			Text.Add("You thrust your tenting bulge against the golden heart, grinding your fabric-clad erection against your [foxvixen]’s beauty mark and letting [himher] feel your appreciation of it through your [lowerArmorDesc].", parse);
			Text.NL();
			Text.Add("<i>“S-Stop it! You perv!”</i> [heshe] exclaims, though [heshe] makes no move to step away from you.", parse);
		}, 1.0, function() { return player.FirstCock(); });
		scenes.AddEnc(function() {
			Text.Add("Feeling mischievous, you give Terry’s butt a sudden firm poke with your finger, right in the middle of [hisher] love-heart birthmark.", parse);
			Text.NL();
			Text.Add("<i>“Eep!”</i> Terry rubs [hisher] butt, right where you poked [himher]. <i>“Jerk...”</i> [heshe] pouts.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("Your fingers reach out and gently trace the love-heart’s edging, starting from the point down at its bottom before curving up, around and then down again.", parse);
			Text.NL();
			Text.Add("Terry shudders in embarrassment as you do so. <i>“Okay, you’ve done your teasing, so let’s move on.”</i>", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("Grinning to yourself, you deliver a sudden appreciative slap to Terry’s ass, right on [hisher] birthmark, watching as the [foxvixen]’s butt jiggles slightly in response to the impact.", parse);
			Text.NL();
			Text.Add("<i>“Ooh! H-Hey! Be gentle!”</i> [heshe] protests, rubbing where you slapped.", parse);
		}, 1.0, function() { return true; });
		
		scenes.Get();
	}
	Text.NL();
	PrintDefaultOptions();
}

Scenes.Terry.SexPromptChoice = function(backPrompt) {
	var parse = {
		foxvixen : terry.mfPronoun("fox", "vixen"),
		master : player.mfTrue("master", "mistress")
	};
	parse = terry.ParserPronouns(parse);
	
	var cocksInAss = player.CocksThatFit(terry.Butt());
	
	var options = new Array();
	if(terry.FirstVag()) {
		var cocksInVag = player.CocksThatFit(terry.FirstVag());
		options.push({ nameStr : "Pitch vaginal",
			func : function() {
				Scenes.Terry.SexPitchVaginal(cocksInVag);
			}, enabled : cocksInVag.length > 0,
			tooltip : Text.Parse("You went to the trouble of growing Terry a vagina, so let’s go ahead and use it.", parse)
		});
	}
	options.push({ nameStr : "Pitch anal",
		func : function() {
			Scenes.Terry.SexPitchAnal(cocksInAss);
		}, enabled : cocksInAss.length > 0,
		tooltip : Text.Parse("Terry’s butt is so cute with that heart stamp. It paints a perfect target for your attentions...", parse)
	});
	if(terry.FirstCock()) {
		var tooltip = terry.HorseCock() ? "You went through the trouble of giving Terry that big stallionhood of [hishers] for a reason." : "Why not let the [foxvixen] catch a break and let [himher] do you for a change of pace?";
		options.push({ nameStr : "Catch Anal",
			func : function() {
				Scenes.Terry.SexCatchAnal();
			}, enabled : true,
			tooltip : Text.Parse(tooltip, parse)
		});
	}
	if(terry.HorseCock()) {
		options.push({ nameStr : "Worship Terry",
			func : function() {
				Scenes.Terry.SexWorship();
			}, enabled : true,
			tooltip : Text.Parse("Give your [foxvixen]’s mighty horsecock the love and attention that it deserves!", parse)
		});
	}
	/* //TODO
	options.push({ nameStr : "name",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
		}, enabled : true,
		tooltip : Text.Parse("", parse)
	});
	 */
	Gui.SetButtonsFromList(options, backPrompt, backPrompt);
}


Scenes.Terry.SexPitchAnal = function(cocksInAss) {
	var p1Cock = player.BiggestCock(cocksInAss);
	
	var parse = {
		foxvixen : terry.mfPronoun("fox", "vixen"),
		boygirl : terry.mfPronoun("boy", "girl"),
		HeShe   : terry.HeShe(),
		heshe   : terry.heshe(),
		HisHer  : terry.HisHer(),
		hisher  : terry.hisher(),
		himher  : terry.himher(),
		hishers : terry.hishers(),
		tcockDesc : function() { return terry.FirstCock().Short(); },
		master  : player.mfTrue("master", "mistress"),
		MasterMistress : player.mfTrue("Master", "Mistress"),
		playername : player.name,
		armorDesc : function() { return player.ArmorDesc(); },
		tongueDesc : function() { return player.TongueDesc(); },
		multiCockDesc : function() { return p1Cock.isStrapon ? p1Cock.Short() : player.MultiCockDesc(); },
		cockDesc : function() { return p1Cock.Short(); },
		earsDesc : function() { return player.EarDesc(); },
		legsDesc : function() { return player.LegsDesc(); },
		hipsDesc : function() { return player.HipsDesc(); },
		ballsDesc : function() { return player.BallsDesc(); }
	};
	
	var virgin = terry.Butt().virgin;
	var promise;
	
	Gui.Callstack.push(function() {
		
		Gui.Callstack.push(function() {
			Text.Add("Taking the proper stance, you grind your [cockDesc] against the [foxvixen]’s ass, gliding it through the velvety-furred cheeks of [hisher] ass before lining the tip up with [hisher] newly-lubed hole.", parse);
			Text.NL();
			if(p1Cock.Volume() >= 400) {
				if(virgin || terry.Slut() < 30) {
					Text.Add("Terry swallows as [heshe] feels your [cockDesc] grinding in the valley of [hisher] butt. <i>“You’re big,”</i> [heshe] states nervously.", parse);
					Text.NL();
					if(promise)
						Text.Add("You assure [himher] that you remember your promise; it’ll fit, but you will take it slow and steady, give [himher] a chance to properly adjust to it.", parse);
					else
						Text.Add("You assure the [foxvixen] that you have every confidence that it’ll fit; you know [heshe] can take it.", parse);
					Text.NL();
					Text.Add("<i>“Okay.”</i> [HeShe] relaxes a little.", parse);
				}
				else if(terry.Slut() < 60) {
					Text.Add("<i>“Take it easy, [playername]. Remember you’re not exactly little,”</i> the [foxvixen] says nervously.", parse);
					Text.NL();
					Text.Add("You assure [himher] that you will... although, not too gentle; you know [heshe] likes it when you get a little rough...", parse);
				}
				else {
					Text.Add("<i>“You know, it’s always a thrill when you make it a point to state just how big you really are,”</i> Terry says, looking back with a coy smile.", parse);
					Text.NL();
					Text.Add("Grinning, you quip back that you know; that’s why you do it, after all. ", parse);
					Text.NL();
					Text.Add("<i>“Show off.”</i>", parse);
				}
				Text.NL();
			}
			
			Scenes.Terry.SexFuckButtEntrypoint(p1Cock, promise, function(rough) {
				if(rough) {
					Text.Add("<i>“Ugh, my ass...”</i> Terry groans. <i>“My hips feel sore, my butt feels sore, I’m feeling sore in places I didn’t even think it was possible to feel sore...”</i>", parse);
					Text.NL();
					parse["c"] = !p1Cock.isStrapon ? Text.Parse(" and [cockDesc]", parse) : "";
					Text.Add("You mumble an idle agreement, noting your own hips[c] are certainly going to get you back for this when they can.", parse);
					Text.NL();
					if(terry.Relation() < 30) {
						Text.Add("<i>“Ugh, did you absolutely HAVE to be this rough?”</i>", parse);
						Text.NL();
						Text.Add("As if [heshe] didn’t enjoy it, you quip back, indicating the great smears of sexual fluid [heshe] has left down your [legsDesc] and [hishers] from [hisher] climax.", parse);
						Text.NL();
						Text.Add("The [foxvixen] just huffs indignantly and looks away.", parse);
						Text.NL();
						Text.Add("You don’t even try to fight back the grin that crosses your face. [HeShe]’ll learn to admit the truth in time.", parse);
					}
					else if(terry.Relation() < 60) {
						Text.Add("<i>“You really did a number on me this time, [playername]. I’m not even sure I’ll be able to recover from this one.”</i>", parse);
						Text.NL();
						Text.Add("Smirking, you assure Terry that you just know [heshe]’ll get better soon. And then you can do this again when [heshe] does.", parse);
						Text.NL();
						Text.Add("<i>“Again!? Are you crazy?”</i>", parse);
						Text.NL();
						Text.Add("[HeShe] says that, but you have a feeling [heshe]’s looking forward to the idea [himher]self, you quip back.", parse);
						Text.NL();
						Text.Add("<i>“In your dreams,”</i> the [foxvixen] smirks.", parse);
					}
					else {
						Text.Add("<i>“You know, [playername]. Any other time and I’d tell you I love you, but right now I freaking hate you. Ow, my ass...”</i>", parse);
						Text.NL();
						Text.Add("Oh, poor baby; if you weren’t so sore as well, you’d kiss it better for [himher], you reply, grinning as you do so.", parse);
						Text.NL();
						Text.Add("<i>“You know, that actually sounds like it might work. Kiss me better, right where it hurts,”</i> [heshe] wiggles on your lap, trying to raise [hisher] butt.", parse);
						Text.NL();
						Text.Add("Grinning, you cup Terry’s ass playfully in your hand, using the other to pull [hisher] lips to yours and enfold them in a deep, passionate kiss. A few very pleasant moments later, you break the kiss and ask if [heshe] feels better now.", parse);
						Text.NL();
						Text.Add("<i>“A bit, but you’d better do that again, just to be sure.”</i>", parse);
						Text.NL();
						Text.Add("You can’t help but laugh softly; Terry really is yours, isn’t [heshe]? Still, you’re happy to oblige, pulling the [foxvixen] into another deep, affectionate kiss.", parse);
						
						terry.relation.IncreaseStat(100, 1);
					}
					Text.Flush();
					
					terry.slut.IncreaseStat(100, 4);
					world.TimeStep({hour: 1});
					
					Gui.NextPrompt();
				}
				else { // Gentle
					if(virgin) {
						Text.Add("So, how was it?", parse);
						Text.NL();
						Text.Add("<i>“F-Fuck, [playername]. It was pretty intense,”</i> [heshe] groans. <i>“If you - hah - can make me feel like this every time, I might even grow to like this.”</i>", parse);
						Text.NL();
						Text.Add("Cheerfully, you declare that’s a promise, then.", parse);
					}
					else if(terry.Slut() < 30) {
						Text.Add("<i>“Damn, that felt good,”</i> [heshe] groans. <i>“I never thought taking it in the butt could feel so good. That thing you did with my nipples while you fucked me...”</i> [heshe] shudders at the thought. <i>“That was unique.”</i>", parse);
						Text.NL();
						Text.Add("You can’t help but smile proudly; [heshe]’s come quite a long way from the blushing virgin [heshe] was. Still, you’ve a feeling that [heshe]’ll only get better at this with practice...", parse);
					}
					else if(terry.Slut() < 60) {
						Text.Add("<i>“Aha! I’ll never get tired of this. Fuck, I really needed this...”</i> [heshe] pants.", parse);
						Text.NL();
						Text.Add("That’s your [boygirl], you cheerfully proclaim.", parse);
					}
					else {
						Text.Add("<i>“Oh yes! You know me so well, [playername].”</i>", parse);
						Text.NL();
						Text.Add("Grinning, you reply that you ought to by now.", parse);
						Text.NL();
						Text.Add("<i>“Damn right you do, hah… Keep up the good work.”</i>", parse);
						Text.NL();
						Text.Add("You most certainly will, you assure [himher].", parse);
					}
					Text.NL();
					
					var knotted = p1Cock.knot != 0;
					
					var fTooltip;
					var kTooltip;
					var pTooltip;
					
					if(terry.Relation() < 30) {
						Text.Add("<i>“Thanks a lot for the the great sex, but I think I’ll need a rest now...”</i>", parse);
						Text.NL();
						Text.Add("A frown crosses your face as you hear Terry’s words; does the [foxvixen] not realise that [heshe]’s the only one who’s gotten off so far? That’s being kind of selfish...", parse);
						fTooltip = Text.Parse("You want to cum as well; finish off in Terry’s ass before you let [himher] get some rest.", parse);
						if(knotted)
							fTooltip += Text.Parse(" You’ll be nice and spare [himher] the knot, though.", parse);
						kTooltip = Text.Parse("Give [himher] a pointed reminder about letting [hisher] partner get off as well.", parse);
						pTooltip = Text.Parse("Terry’s clearly worn out; why not be generous and let [himher] be?", parse);
					}
					else if(terry.Relation() < 60) {
						Text.Add("<i>“That was great, [playername]. Thanks a lot, but I can’t help but notice you still didn’t cum. I’m pretty tired but I think I can hold out enough to at least get you off.”</i>", parse);
						fTooltip = Text.Parse("Well, since [heshe]’s offering, why not take the generous offer?", parse);
						kTooltip = Text.Parse("Your knot’s just aching to be used; surely Terry won’t mind if you tie in the process of getting off?", parse);
						pTooltip = Text.Parse("Terry’s being generous, but you can be generous too; let [himher] get some rest, you’ll take care of this yourself.", parse);
					}
					else {
						Text.Add("<i>“Thanks for making me cum so hard, [playername]. But surely we’re not finished yet, are we? You didn’t cum. And you can’t just hold out on me like this. If you don’t give me treats I might grow rebellious,”</i> [heshe] smirks mischievously. It’s clear that [heshe]’s tired, but you can also tell that [heshe]’s not about to collapse without at least getting you off.", parse);
						fTooltip = Text.Parse("It’s what [heshe] wants, it’s what your body wants, why not make everyone happy?", parse);
						kTooltip = Text.Parse("If [heshe] wants it all, then you may as well give it to [himher]; shove your knot up Terry’s tailhole!", parse);
						pTooltip = Text.Parse("Terry’s words are brave, but [heshe]’s clearly tired. You can be magnanimous and let [himher] get some sleep instead.", parse);
					}
					Text.Flush();
					
					//[Finish][Knot][PullOut] 
					var options = new Array();
					if(!p1Cock.isStrapon) {
						options.push({ nameStr : "Finish",
							func : function() {
								Text.Clear();
								Text.Add("You wrap your arms tightly around Terry’s chest, as much for support as ensuring [heshe] can’t hope to wriggle free of your embrace, and resume thrusting, faster and rougher than before. [HeShe] grunts and moans softly as you fuck the [foxvixen]’s ass harder, the orgasm-softened flesh doing its best to clench down around your intruding girth. Moments later, you cry out in pleasure as your own orgasm washes through you, erupting inside Terry’s tailhole.", parse);
								Text.NL();
								
								var cum = player.OrgasmCum();
								
								if(cum > 6) {
									Text.Add("Terry cries out as your tremendous load erupts inside of [himher], pressurised jets of spunk erupting backwards and washing over your [legsDesc], matting them both in fluid. Still, even with the pressure forcing so much of it out, more still finds its way into the [foxvixen]’s stomach, which bloats into a massive swell. Finally, your climax finishes and you go soft, panting for breath. Terry shifts restlessly, trying to get more comfortable with [hisher] newly enhanced girth, wetly belching as the semen audibly sloshes around inside [hisher] gut.", parse);
								}
								else if(cum > 3) {
									Text.Add("A long, gurgling moan bubbles from Terry’s throat as [hisher] stomach visibly bulges from your titanic climax, swelling out like a balloon as you keep unloading spurt after spurt of semen inside of [himher]. By the time you go limp, it looks like [heshe] is ready to give birth any day now, and the [foxvixen] unthinkingly pats the stretched skin, rubbing it soothingly.", parse);
								}
								else {
									Text.Add("Your cum explodes inside of Terry’s ass, packing itself into a nice, wet, gloopy load somewhere inside of [himher]. Terry moans softly, ass flexing as if to milk you, but you have nothing more left to give.", parse);
								}
								Text.NL();
								if(terry.Relation() < 30) {
									Text.Add("<i>“F-Full...”</i> the [foxvixen] groans, collapsing into a heap and promptly passing out.", parse);
								}
								else if(terry.Relation() < 60) {
									Text.Add("<i>“That’s better now, isn’t it?”</i>", parse);
									Text.NL();
									Text.Add("You groan idly in agreement, sleepily nodding your head even though Terry can’t see it.", parse);
									Text.NL();
									Text.Add("<i>“Rest with me?”</i>", parse);
									Text.NL();
									parse["seeppourgush"] = cum > 6 ? "gush" :
									                        cum > 3 ? "pour" : "seep";
									Text.Add("That’s... that’s a very welcoming idea. Deciding words are unnecessary, you gently pull yourself free of Terry’s ass, letting your seed start to [seeppourgush] from [hisher] depths. Once [heshe]’s properly uncorked, you ease [himher] fully to the ground, snuggling up closer and wrapping your arms around the [foxvixen] as you rest your head in the crook of [hisher] neck.", parse);
								}
								else {
									parse["c"] = cum > 6 ? "pregnant-looking" :
									             cum > 3 ? "distended" : "";
									Text.Add("<i>“Yes, hmm. Let it all out for me,”</i> [heshe] says, patting [hisher][c] belly. <i>“Pack me full of your seed.”</i>", parse);
									Text.NL();
									Text.Add("You shudder, managing to squeeze out a last tiny trickle of semen, before announcing that [heshe]’s as full as you can make [himher].", parse);
									Text.NL();
									Text.Add("<i>“Snuggle and nap together? [MasterMistress]?”</i> Terry says with a coy smile.", parse);
									Text.NL();
									Text.Add("Stifling a yawn, you nod your head and agree that sounds like a wonderful idea. You start to pull yourself free of Terry’s ass, only to stop as the [foxvixen] reaches back to grab at your [hipsDesc].", parse);
									Text.NL();
									Text.Add("<i>“Leave it in. It feels nice like this.”</i>", parse);
									Text.NL();
									Text.Add("Well, if that’s what [heshe] wants... You push forward again, properly slotting yourself back inside of the [foxvixen]’s ass, then gently lower the pair of you to the ground. You tuck yourself as close to Terry as you can manage, nestling your chin in the crook of [hisher] shoulder, then close your eyes and allow yourself to drift off.", parse);
								}
								Text.Flush();
								
								terry.relation.IncreaseStat(50, 2);
								terry.slut.IncreaseStat(100, 1);
								world.TimeStep({hour: 1});
								
								Gui.NextPrompt();
							}, enabled : true,
							tooltip : fTooltip
						});
						if(knotted) {
							options.push({ nameStr : "Knot",
								func : function() {
									Text.Clear();
									Text.Add("You wrap your arms tightly around Terry’s chest, ensuring you are well supported - and that the [foxvixen] can’t get away - before you draw your hips back and then give them a firm thrust forward. Your knot isn’t fully inflated yet, but it already markedly increases your girth, meaning you have to push with firm, insistent strokes to try and squeeze inside of Terry’s tailhole. Terry gasps and wriggles, scratching at the ground as [heshe] tries to loosen up enough to let your bulging dick-root inside. Finally, amazingly, you manage to force your way in, the texture and the heat and the feeling of Terry’s asshole crushing your knot with its vice-like grip driving you over the edge; you throw back your head and cry out as you climax in turn.", parse);
									Text.NL();
									
									var cum = player.OrgasmCum();
									
									if(cum > 6) {
										Text.Add("Terry whimpers and mewls as gush after inhuman gush of seed floods inside of [himher], belly veritably exploding outwards under the titanic influx of semen. Though some thin spurts spray out around the rim of your knot, the seal is tight enough that the vast majority goes directly to Terry’s stomach. By the time you finish, Terry is wallowing atop a stomach like a beachball full of water, moaning softly. [HeShe] lets out a gurgled belch, expelling a mouthful of cum down [hisher] front.", parse);
									}
									else if(cum > 3) {
										Text.Add("With mewls and moans, Terry wriggles as [hisher] stomach begins bloating under your output of semen, swelling out like a balloon, your bulging knot ensuring every last drop is sent squirting into the [foxvixen]’s increasingly full-packed stomach. By the time you go limp, Terry looks ready to pop with a whole litter of kits, each motion eliciting a soft sloshing sound as the semen inside [himher] is stirred by the movement. [HeShe] pats it gently, and stifles a burp.", parse);
									}
									else {
										Text.Add("The two of you moan in pleasure as your hot seed flows freely into the [foxvixen]. With your knot trapping it inside, every last drop you have to spare is pushed inside of Terry’s ass, until [hisher] stomach bulges subtly.", parse);
									}
									
									Text.NL();
									
									if(terry.Relation() < 30) {
										Text.Add("<i>“Ow... my butt. So full...”</i> [heshe] mumbles before collapsing on the floor, passed out.", parse);
										Text.NL();
										Text.Add("You shake your head with a soft sigh; still, [heshe]’ll get better with practice. As best you can, you maneuver the two of you into a spooning position on the ground; nothing to do but make yourself comfortable until your knot deflates. You yawn softly, tuck your head against Terry’s shoulder, and allow your eyes to close.", parse);
									}
									else if(terry.Relation() < 60) {
										Text.Add("<i>“Hng! You really stuffed me back there,”</i> [heshe] states.", parse);
										Text.NL();
										Text.Add("Grinning tiredly, you playfully ask if [heshe]’s saying [heshe] didn’t enjoy it.", parse);
										Text.NL();
										Text.Add("<i>“I didn’t say that, now did I? But damn my butt’s gonna be sore when you finally pull out. Good thing you were just being ‘gentle’ this time,”</i> the [foxvixen] teases.", parse);
										Text.NL();
										Text.Add("Feeling a little sheepish, you apologise to [himher] about that.", parse);
										Text.NL();
										Text.Add("<i>“Don’t worry about it. It was a great ride nevertheless. Just… let’s rest for now okay? I was pretty tired before taking all of you, and now I feel like I might just pass out...”</i>", parse);
										Text.NL();
										Text.Add("Yawning softly, you confess that you feel like a rest yourself. You help gently guide Terry down to the ground, and then snuggle up close to [hisher] fluffy form, folding your arms around the [foxvixen] and cradling [himher] close.", parse);
									}
									else {
										Text.Add("<i>“Mmm, yes. I love it when you tie me. You can always give me everything you have, I’ll take it all,”</i> [heshe] proclaims, looking back at you with a tired smile, tail thumping softly against your midriff as [heshe] wags it.", parse);
										Text.NL();
										Text.Add("You smile through the haze of your afterglow and reach out to gently tousle Terry’s ears, assuring [himher] that you’ll keep that in mind. But, right now, you have nothing left to give.", parse);
										Text.NL();
										parse["b"] = player.HasBalls() ? Text.Parse(" reaches between [hisher] legs to fondle your [ballsDesc] and", parse) : "";
										Text.Add("<i>“You sure?”</i> The [foxvixen][b] clenches [hisher] ass one last time. You groan as you spew just a little bit more cum inside [himher]. <i>“Looks like you weren’t quite finished for me,”</i> [heshe] teases.", parse);
										Text.NL();
										Text.Add("You roll your eyes and nip gently at the tip of Terry’s ear, eliciting a girly squeak of protest from the [foxvixen]. Yawning gently, you decide that now is the time to get some rest, and promptly pull Terry down with you as you settle yourself upon the ground, using [himher] like a full-body pillow.", parse);
										Text.NL();
										Text.Add("<i>“Aw, no goodnight kiss?”</i>", parse);
										Text.NL();
										Text.Add("In this position? Not possible. Will [heshe] settle for a goodmorning kiss instead?", parse);
										Text.NL();
										Text.Add("<i>“Alright, I can live with that.”</i> [HeShe] snuggles up against you and follows you on your brief, but necessary, journey to dreamland.", parse);
									}
									Text.Flush();
									
									terry.relation.IncreaseStat(50, 2);
									terry.slut.IncreaseStat(100, 2);
									world.TimeStep({hour: 2});
									
									Gui.NextPrompt();
								}, enabled : true,
								tooltip : kTooltip
							});
						}
					}
					options.push({ nameStr : "Pull out",
						func : function(choice) {
							if(choice)
								Text.Clear();
							else
								Text.NL();
							Text.Add("Wriggling a little to get into a better position to do so, you patiently guide your [cockDesc] free of your vulpine pet’s newly used ass.", parse);
							Text.NL();
							if(p1Cock.isStrapon) {
								if(terry.Relation() >= 30) {
									Text.Add("Shaking your head, you thank Terry for the offer, but gently remind [himher] that your [cockDesc] is only a toy; it’s not going to cum, so there’s no point in continuing.", parse);
									Text.NL();
									Text.Add("<i>“Of course there is, you can try to get another load off me,”</i> the [foxvixen] grins.", parse);
									Text.NL();
									Text.Add("Smirking, you quip back that Terry is certainly a horny little [foxvixen] - whatever happened to [hisher] being tired?", parse);
									Text.NL();
									Text.Add("<i>“Okay, maybe you have a point. But let’s not forget whose fault it is that I grew to enjoy our little ‘alone time’ so much.”</i>", parse);
									Text.NL();
									Text.Add("Guilty as charged, you concede, still grinning smugly as you do so. But that doesn’t change the fact that [heshe]’s about to pass out.", parse);
									Text.NL();
									Text.Add("<i>“Can you at least spare some time to snuggle?”</i>", parse);
									Text.NL();
									Text.Add("That you most certainly can, you reply, already moving to embrace Terry and pull the [foxvixen] carefully into your lap, gently cradling [himher].", parse);
								}
								else {
									Text.Add("Terry’s out like a candle as soon as you’re done pulling out. You sigh and shake your head; yes, the cock is only a dildo, but still, it’s disrespectful for [himher] to just go out like a light after you go to all the trouble of getting [himher] off like that. You’ll simply <i>have</i> to train [himher] better, you resolve.", parse);
								}
							}
							else { // real cock
								if(terry.Relation() < 30) {
									Text.Add("Terry’s out like a candle as soon as you’re done pulling out. You sigh in disappointment; you decide to be generous, and [heshe] can’t even thank you for it? You’re going to need to teach [himher] some proper manners in the future.", parse);
								}
								else if(terry.Relation() < 60) {
									Text.Add("<i>“Whu? Why’d you pull out?”</i>", parse);
									Text.NL();
									Text.Add("Because [heshe]’s tired and clearly about to fall asleep, you point out; it’s no fun to fuck [himher] if [heshe] passes out before you’re through. You’ll get off somewhere else, it’s no biggie.", parse);
									Text.NL();
									Text.Add("<i>“Don’t be stupid, [playername]. I can at least-”</i> You swiftly cut [himher] off with a finger pressed against [hisher] lips, smiling as you assure Terry that it’s okay.", parse);
									Text.NL();
									Text.Add("Terry smiles at you. <i>“You’re too nice to me, [playername]. I promise I’ll get you off properly next time.”</i>", parse);
									Text.NL();
									Text.Add("Still grinning, you promise that you’ll hold [himher] up to that.", parse);
								}
								else {
									Text.Add("<i>“Hey! I was using that!”</i> [heshe] jokingly protests.", parse);
									Text.NL();
									Text.Add("You shake your head and gently chide Terry in the same tone; you both know [heshe]’s about to pass out, so [heshe] may as well lay down and get some sleep. You’ll take care of your [cockDesc] yourself.", parse);
									Text.NL();
									parse["boygirl"] = terry.mfPronoun("boy", "girl");
									Text.Add("<i>“But, I wanna!”</i> [heshe] pouts. <i>“Besides, what kind of [boygirl]friend would I be if I didn’t at least get my lover off before passing out?”</i>", parse);
									Text.NL();
									Text.Add("Smiling, you shake your head and assure [himher] that it’s alright; as brave a face as [heshe] wants to put on, you clearly wore [himher] out. You exhort that [heshe] needs to get [hisher] rest; you’ll be fine. Besides, you quip, you’d rather have a well-rested [foxvixen] raring for a second go later than a tired, worn-out one now.", parse);
									Text.NL();
									Text.Add("Sighing in defeat, Terry smiles tiredly. <i>“Alright, you have a point. I guess I’ll just have to get you off twice as hard to make up for this time, won’t I?”</i>", parse);
									Text.NL();
									Text.Add("You nod your head with a smile and say that sounds acceptable to you.", parse);
									Text.NL();
									Text.Add("<i>“It’s a promise, make sure to have plenty of cum backed up for me later. But for now, can we snuggle? I can’t sleep very well without my [playername].”</i>", parse);
									Text.NL();
									Text.Add("You simply grin and hold out your arms, an open invitation to an embrace. [HeShe] hugs you tightly, snuggling up to you affectionately.", parse);
								}
							}
							Text.Flush();
							
							terry.relation.IncreaseStat(50, 2);
							terry.slut.IncreaseStat(100, 1);
							world.TimeStep({hour: 1});
							
							Gui.NextPrompt();
						}, enabled : true,
						tooltip : pTooltip,
						obj : true
					});
					if(options.length > 1)
						Gui.SetButtonsFromList(options, false, null);
					else
						options[0].func();
				}
			});
		});
		
		Text.NL();
		Text.Add("With Terry in position, it’s time to get yourself ready, and you quickly strip off your [armorDesc] before putting it aside. As the [foxvixen] eyes you, you tap your chin, considering what would be the best way to prepare [himher] for a proper butt-stuffing...", parse);
		Text.Flush();
		
		//[Finger][Lick]
		var options = new Array();
		options.push({ nameStr : "Finger",
			func : function() {
				Text.Clear();
				Text.Add("Turning back to your belongings for the moment, you fish around and retrieve a bottle of lubricant, proceeding to smear a generous amount on your fingers before settling down behind Terry. Moving [hisher] tail out of the way, you reach out with your lube-dripping fingers and smear some of the creamy substance onto [hisher] anal ring, kneading it in as you roll your fingers around and around.", parse);
				Text.NL();
				if(terry.Slut() < 30)
					Text.Add("<i>“Hng! T-Take it easy, [playername].”</i>", parse);
				else if(terry.Slut() < 60)
					Text.Add("<i>“Ugh! It’s cold!”</i> the [foxvixen] complains.", parse);
				else
					Text.Add("The [foxvixen] shudders as you begin massaging the lube into [hisher] tight rosebud. <i>“Don’t worry, it’s cold but I’m fine. Just start fingering me, please.”</i>", parse);
				Text.NL();
				Text.Add("With your thumb, you continue spiralling around and around Terry’s tailhole, until you deem the surface sufficiently lubed. Now it’s time to start lubing [himher] up inside... Extending your finger, you begin to push gently but firmly at [hisher] newly creamed hole, patiently worming the very tip of your finger inside of the [foxvixen]’s ass, eliciting a moan from the vulpine. [HeShe] adjusts [himher]self, bucking back against your finger slightly.", parse);
				if(terry.Slut() >= 60) {
					Text.Add(" The [foxvixen] reaches back, raising [hisher] bubble-butt as [heshe] spreads [hisher] buttcheeks for you. <i>“Easier to work like this, right?”</i>", parse);
					Text.NL();
					Text.Add("You nod your head, letting out a grunt of agreement, concentrating more on feeling [hisher] asshole slowly conforming to your probing digit than anything.", parse);
				}
				Text.NL();
				Text.Add("Patiently you pump away with your finger, feeling Terry stretching around the intruder. Once you gauge the [foxvixen] as being loose enough, you push a second finger against the seal of [hisher] anal ring, feeling it slide slowly around this new invader. Terry moans as you worm both fingers inside of [hisher] ass, patiently thrusting them and further stretching [hisher] tight ring.", parse);
				Text.NL();
				if(terry.FirstCock()) {
					parse["p"] = terry.FirstVag() ? Text.Parse("Ignoring [hisher] dripping pussy, y", parse) : "Y";
					Text.Add("[p]ou reach for Terry’s [tcockDesc] with your free hand, sliding your fingers along its length in smooth, even strokes that match the tempo of your thrusting fingers. ", parse);
					Text.NL();
					if(terry.HorseCock()) {
						Text.Add("You can feel it growing from its meager half-erect state to its more impressive fully-erect state. Each touch sends an electric ripple flowing through the [foxvixen], proof of how sensitive [heshe] really is down there. The sound of dripping cum becomes more prominent, and you notice [heshe]’s made a decently sized puddle underneath. You grasp [hisher] deflated knot, earning yourself a yelp and a rope of pre.", parse);
						Text.NL();
						Text.Add("<i>“Dammit, [playername]. Watch it, I’m sen - Ah!”</i> Yes, yes, [heshe]’s pretty sensitive down here. That’s why it’s so much fun teasing [himher] like this.", parse);
					}
					else {
						Text.Add("[HisHer] half-erect cock hardens to full mast under your careful ministrations; knot already beginning to form as you stroke [hisher] foxhood and milk [hisher] length for precious gobs of pre.", parse);
					}
				}
				else {
					Text.Add("You reach for Terry’s new womanhood, already starting to plush with arousal. Gently you stroke [hisher] feminine sex, slowly running your fingers through the folds, feeling [hisher] excitement beginning to bead on your fingertips and run down to puddle in your palm. Terry moans softly as you continue the two-pronged assault, the [foxvixen] unthinkingly bucking back and forth against each set of fingers.", parse);
				}
				Text.NL();
				Text.Add("Once you judge your fingers are sufficiently slick with the [foxvixen]’s precum, you leave [hisher] sex alone, wetly popping your original fingers free of [hisher] ass. Terry wriggles, a mewl of protest unthinkingly escaping [hisher] lips, before you slide your newly sex-slickened fingers back inside of [himher]. You push these as far inside of [himher] as you can, the mingled fluids letting you stretch Terry wider and deeper than before, audibly squelching as you pump away.", parse);
				Text.NL();
				Text.Add("Once you deem Terry to feel sufficiently loose and lubed, you pull your fingers out again and stand up; time for the main event now...", parse);
				Text.NL();
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : Text.Parse("Give [himher] a taste of what’s to come and stretch [himher] in preparation at the same time.", parse)
		});
		options.push({ nameStr : "Lick",
			func : function() {
				Text.Clear();
				parse["l"] = player.LowerBodyType() != LowerBodyType.Single ? " to your knees" : "";
				Text.Add("Sinking[l] at Terry’s rear, you gently nip [himher] right on the heart-stamp, sinking your teeth through the fur into the flesh beneath just hard enough that [heshe] can properly feel it.", parse);
				Text.NL();
				Text.Add("<i>“Ow! That hurt!”</i> Terry protests. <i>“Why’d you bite me?”</i>", parse);
				Text.NL();
				Text.Add("It’s [hisher] own fault for being so tasty, you promptly shoot back; how could you possibly resist such a delectable morsel?", parse);
				Text.NL();
				if(terry.Relation() >= 60) {
					Text.Add("<i>“Hardy, har, har. Ain’t you lucky that you found someone that likes you, despite your lame one-liners, and weird antics?”</i> [heshe] asks mockingly.", parse);
					Text.NL();
					Text.Add("Shaking your head as Terry’s tail brushes ticklishly across your nose, you quip back that you’d be twice as lucky if you could find someone who could do that without smacking you in the face with their tail all the time. For emphasis you catch Terry’s tail near its base in your hand, gently stroking down its length.", parse);
					Text.NL();
					Text.Add("<i>“Hmm, your own fault for stalling instead of doing your job,”</i> [heshe] coos as you stroke [hisher] tail.", parse);
					Text.NL();
					Text.Add("Well, you’ll just have to get back to work, you reply, giving [hisher] tail one last stroke for luck.", parse);
				}
				else if(terry.Relation() >= 30) {
					Text.Add("<i>“Dear Aria… Please bite me again, just stop with the lame one-liners before I puke.”</i> Terry gags mockingly.", parse);
					Text.NL();
					Text.Add("Well, since [heshe] asked... you promptly nip [hisher] heart-stamp again, a little harder this time.", parse);
					Text.NL();
					Text.Add("<i>“Oof! Still less painful than your one-liners,”</i> [heshe] quips again.", parse);
				}
				else {
					Text.Add("<i>“I’m not even gonna bother replying to that,”</i> [heshe] jerks [hisher] head away in disapproval.", parse);
					Text.NL();
					Text.Add("You just sigh softly and shake your head; [heshe]’ll warm up to you eventually. You simply give [hisher] butt a gentle pat instead.", parse);
				}
				Text.NL();
				Text.Add("Gently you part Terry’s asscheeks, the white fur giving way to the naked pink flesh of [hisher] anus. ", parse);
				if(terry.Slut() >= 60)
					Text.Add("The [foxvixen] starts panting in anticipation, round butt wiggling a little in excitement. <i>“Are you going to get started already?”</i>", parse);
				else if(terry.Slut() >= 30)
					Text.Add("[HeShe] thrusts [hisher] butt up, granting you easier access.", parse);
				else
					Text.Add("[HeShe] shudders in surprise, not quite used to being touched like that just yet. You can tell that [heshe]’s pretty tense.", parse);
				Text.NL();
				parse["NervouslyPlayfully"] = terry.Slut() < 30 ? "Nervously" : "Playfully";
				Text.Add("Your [tongueDesc] extends over your lips and you begin to trace Terry’s ring with it, feeling it clench and squirm as you trail teasingly over the sensitive flesh. Around and around you loop, slathering a good amount of natural lube over its surface; then, when you deem your efforts sufficient, you start to push the very tip of your [tongueDesc] against [hisher] entrance. [NervouslyPlayfully], [heshe] tries to clench [hisher] butt shut, however no matter how much [heshe] tries, your tongue is just too flexible to be stopped so easily. Patiently you squirm and pry and poke, slowly teasing it open and feeding your tongue inside, worming it deeper and deeper until you are buried in [hisher] ass.", parse);
				if(terry.FirstCock()) {
					parse["vulpineequine"] = terry.HorseCock() ? "equine" : "vulpine";
					Text.NL();
					Text.Add("Your probing [tongueDesc] finds the [foxvixen]’s prostate, and you waste no time in grinding and wriggling your length against it, rubbing the sensitive organ that you’ll soon be mashing with your [multiCockDesc]. One of your hands reaches around [hisher] hip and comes up between [hisher] legs, letting you feel the throbbing length of [hisher] [vulpineequine] erection with your fingers. You playfully stroke it, giving it a gentle squeeze of affection.", parse);
				}
				Text.NL();
				if(terry.flags["xLick"] < 5) {
					Text.Add("<i>“Hng! This feels… weird.”</i>", parse);
					Text.NL();
					Text.Add("Tempted as you might be to reassure the [foxvixen], that’s a little improbable from your current position. Pulling your tongue back from inside Terry’s tailhole, you lift your face from between [hisher] asscheeks and ask if [heshe] sincerely doesn’t like what you’re doing to [himher].", parse);
					Text.NL();
					Text.Add("To emphasize your point, you plunge your tongue back inside [hisher] ass again, this time taking a slower and gentler approach, caressing [hisher] interior with soft, languid laps, painstakingly gliding over the most sensitive spots you can find.", parse);
					Text.NL();
					Text.Add("<i>“I guess it’s not too bad - ah! - b-but I’m having a hard time getting used to the feeling.”</i>", parse);
				}
				else if(terry.flags["xLick"] < 10) {
					Text.Add("<i>“Umm! This still feels strange, but I guess I can appreciate the feeling of you eating me out like that.”</i>", parse);
					Text.NL();
					Text.Add("As best you can from your current position, you grin in approval; Terry’s come quite a way. Unthinkingly, you congratulate [himher], making your tongue vibrate and flex inside the [foxvixen]’s tailhole. Naturally, no words come out, but from the way Terry clamps down, you think [heshe] got the message.", parse);
				}
				else {
					Text.Add("<i>“Ah! This feels great. I love it when you eat me out, [playername]. A bit more to the - oh! - yes, right there...”</i>", parse);
					Text.NL();
					Text.Add("What a little buttslut your [foxvixen] has become... still, you need no further encouragement, moving your tongue as Terry instructs and feeling [himher] practically melting around you, [hisher] throaty moans of pleasure echoing in your [earsDesc].", parse);
				}
				Text.NL();
				Text.Add("Eventually, you withdraw your tongue and stand up; you just want to lube the [foxvixen], not tongue [himher] to an assgasm. You give [himher] an affectionate pat on the butt and announce that [heshe]’s ready for the real fun.", parse);
				Text.NL();
				
				terry.flags["xLick"]++;
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Bite that tasty tush, and maybe have a taste of what’s to come..."
		});
		Gui.SetButtonsFromList(options, false, null);
	});
	
	Text.Clear();
	if(virgin) {
		Gui.Callstack.push(function() {
			Text.NL();
			Text.Add("Reaching out with your hands, you gently push on Terry’s shoulders, the [foxvixen] quickly catching on and kneeling down on all fours. You move [hisher] limbs slightly with your hands, adjusting Terry’s stance so that the posture will be more comfortable for [himher], until you are satisfied with the result.", parse);
			Text.NL();
			Text.Add("Nodding to yourself, you reach out and lightly clasp the [foxvixen]’s long, bushy tail before moving it to the side, so it’s no longer covering [hisher] ass from view. Playfully you run your fingers through [hisher] brush, luxuriating in the soft fur as your fingers glide through its strands, before letting it go and moving your hands to Terry’s shapely rear.", parse);
			Text.NL();
			Text.Add("You start to rub [himher] with smooth, even strokes, kneading flesh through soft fur in a soothing massage and telling [himher] to relax. The [foxvixen] nods, trying [hisher] best to relax, despite the anxiety.", parse);
			
			PrintDefaultOptions();
		});
		
		Text.Add("<i>“W-Wait! I’m sure there’s something else we could I-”</i> With a gentle smile on your lips you cut the [foxvixen] off in mid-protest with a finger placed demurely to [hisher] lips. Shaking your head makes it clear that [heshe]’s not going to make you change your mind, and [hisher] ears droop in submission.", parse);
		Text.NL();
		if(terry.Relation() >= 60) {
			Text.Add("The [foxvixen] takes a deep breath, steeling [hisher] resolve. <i>“Okay, then… alright. I’ll do it, not because of the collar. But because it’s you that’s asking for it. Just, please. Promise me you’ll be gentle?”</i>", parse);
			Text.Flush();
			
			//[Promise][Can’t]
			var options = new Array();
			options.push({ nameStr : "Promise",
				func : function() {
					Text.Clear();
					Text.Add("Smiling sweetly, you kiss Terry tenderly on the lips, gently stroking [hisher] ears with your fingertips in that way that you know [heshe] likes. Once Terry’s melted into your arms, you break the kiss and look the [foxvixen] in the eyes, swearing in your most sincere tone that you would never stand for hurting [himher]. No, all [heshe] needs to worry about is how good you’re going to make [himher] feel; once you’re done, you vow [heshe]’s not going to be able to get enough of doing it like this.", parse);
					Text.NL();
					Text.Add("Terry smiles at your reassurance. <i>“So… that’s how it is, huh? You’re going to fuck me until I turn into your foxy buttslut, is that it?”</i>", parse);
					Text.NL();
					Text.Add("Giving [himher] a playful peck on the nose, you tell [himher] that’s <i>exactly</i> how it is.", parse);
					Text.NL();
					parse["h"] = player.Height() > terry.Height() + 5 ? Text.Parse(" stands on [hisher] tiptoes, then", parse) : "";
					Text.Add("<i>“Okay then, I’ll take you up on that challenge, then.”</i> [HeShe] grins. <i>“Alright, I’m trusting you to keep up with your promise, let’s do it then. Take me and make me yours.”</i> [HeShe] takes a step and[h] gives you a little peck on the lips.", parse);
					
					promise = true;
					terry.relation.IncreaseStat(100, 5);
					
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "You promise to be gentle."
			});
			options.push({ nameStr : "Can’t",
				func : function() {
					Text.Clear();
					Text.Add("With a playful shake of your head, you proclaim you just can’t make that promise; who’d be able to resist tapping a hot fox’s ass like Terry’s as hard as they possibly can? For emphasis, you reach down and cup [hisher] butt, fondling the feminine curves and feeling how it squishes wonderfully in your grip.", parse);
					Text.NL();
					Text.Add("<i>“Hmm, you perv!”</i> [heshe] exclaims, playfully punching you in the arm. Grinning back, you let out a melodramatic ‘ow!’ of protest and make a show of rubbing the spot where the [foxvixen] punched you.", parse);
					Text.NL();
					Text.Add("<i>“Alright then, since you can’t seem to think about anything else, I guess I have no choice but to take your mind off my ‘hot fox’s ass’ as you put it. But I expect you to at least make the entry easy on me.”</i>", parse);
					Text.NL();
					Text.Add("Nodding your head, you assure Terry that you can at least do that for [himher].", parse);
					
					promise = false;
					terry.relation.IncreaseStat(100, 2);
					
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "You can't make that promise."
			});
			Gui.SetButtonsFromList(options, false, null);
		}
		else if(terry.Relation() >= 30) {
			Text.Add("Still, there’s a definite wag in [hisher] tail as it swishes softly over [hisher] butt. It looks like Terry isn’t entirely against this...", parse);
			PrintDefaultOptions();
		}
		else {
			Text.Add("Cowed, [heshe] meekly looks at [hisher] feet, saying not a word.", parse);
			PrintDefaultOptions();
		}
	}
	else if(terry.Slut() < 30) {
		Text.Add("<i>“Alright...”</i> Terry hesitantly turns around, first kneeling on the floor, then finally crawling on fours. [HisHer] tail is tucked between [hisher] legs, ears flat on [hisher] skull. It’s clear that the [foxvixen] is a nervous pile.", parse);
		PrintDefaultOptions();
	}
	else if(terry.Slut() < 60) {
		Text.Add("<i>“Okay, sure. If you want my butt, it’s yours. Should I get on fours now?”</i>", parse);
		Text.NL();
		Text.Add("Nodding your head, you tell the [foxvixen] that’s right. Without further ado [heshe] kneels and complies with your command, crawling around until [heshe] has [hisher] back turned to you, tail raised to give you a clear view of your target.", parse);
		PrintDefaultOptions();
	}
	else {
		Text.Add("<i>“My, my, someone can’t get enough of my butt.”</i> [HeShe] grins. <i>“Alright then, you can have it. But you’ll have to come and get it.”</i> The [foxvixen] winks.", parse);
		Text.NL();
		Text.Add("Well, that’s an invitation you can hardly refuse. In a few brisk motions you have crossed the distance between the pair of you, one hand moving to possessively cup Terry’s ass. As your slutty [foxvixen] mewls in delight, you stifle [hisher] noise by hungrily enveloping [hisher] lips with your own. Terry melts into your embrace, and you easily coax [himher] into the proper stance before breaking the kiss, standing back up with an appreciative slap to [hisher] butt.", parse);
		PrintDefaultOptions();
	}
}


Scenes.Terry.SexFuckButtEntrypoint = function(p1Cock, promise, retFunc) {
	var virgin = terry.Butt().virgin;
	var knotted = p1Cock.knot != 0;

	var parse = {
		foxvixen : terry.mfPronoun("fox", "vixen"),
		boygirl  : terry.mfPronoun("boy", "girl"),
		HeShe   : terry.HeShe(),
		heshe   : terry.heshe(),
		HisHer  : terry.HisHer(),
		hisher  : terry.hisher(),
		himher  : terry.himher(),
		hishers : terry.hishers(),
		tcockDesc : function() { return terry.FirstCock().Short(); },
		tbreastDesc : function() { return terry.FirstBreastRow().Short(); },
		master  : player.mfTrue("master", "mistress"),
		mistermiss : player.mfTrue("mister", "miss"),
		playername : player.name,
		armorDesc : function() { return player.ArmorDesc(); },
		tongueDesc : function() { return player.TongueDesc(); },
		multiCockDesc : function() { return p1Cock.isStrapon ? p1Cock.Short() : player.MultiCockDesc(); },
		cockDesc : function() { return p1Cock.Short(); },
		cockTip  : function() { return p1Cock.TipShort(); },
		ballsDesc : function() { return player.BallsDesc(); },
		earsDesc : function() { return player.EarDesc(); },
		breastsDesc : function() { return player.FirstBreastRow().Short(); },
		nipsDesc : function() { return player.FirstBreastRow().NipsShort(); }
	};
	
	Text.Add("You spare a quick thought for how you should take Terry’s tailhole; gently, or roughly?", parse);
	if(promise)
		Text.Add(" You promised [himher] you’d be gentle...", parse);
	else if(virgin)
		Text.Add(" [HeShe]’d probably prefer it if you were gentle with [himher]...", parse);
	Text.Flush();
	
	//[Gentle] [Rough]
	var options = new Array();
	options.push({ nameStr : "Gentle",
		func : function() {
			Text.Clear();
			Text.Add("Holding Terry by the hips, you start to push forward, slow and steady, pressing against [hisher] newly loosened and lubed ass until you begin to work your way inside. ", parse);
			Text.NL();
			
			Sex.Anal(player, terry);
			terry.FuckAnal(terry.Butt(), player.FirstCock(), 3);
			player.Fuck(player.FirstCock(), virgin ? 10 : 3);
			
			if(virgin || terry.Slut() < 30) {
				Text.Add("<i>“Ouch! Stop! Give me a moment.”</i>", parse);
				Text.NL();
				Text.Add("Immediately you stop your advance, waiting there for Terry to give the go-ahead again. You can feel the [foxvixen]’s anal ring contracting around your [cockTip] as [heshe] gets used to your girth.", parse);
				Text.NL();
				Text.Add("<i>“Okay, I guess I’m good. Just keep it nice and slow.”</i>", parse);
			}
			else if(terry.Slut() < 60) {
				Text.Add("<i>“Ugh!”</i> the [foxvixen] groans. You promptly stop your advance, asking if [heshe]’s alright.", parse);
				Text.NL();
				Text.Add("<i>“It’s alright, I’m cool. Just hurts a little, but I’m fine. It feels kinda good already,”</i> [heshe] reaffirms, bucking back and taking another inch in. <i>“Nng! I guess you’d better handle this...”</i>", parse);
			}
			else {
				Text.Add("<i>“Yeah… You can go a little quicker if you want, I’m a big [boygirl], I can take it.”</i>", parse);
				Text.NL();
				Text.Add("Smiling, you reach out and scratch the [foxvixen] behind the ears; you know [heshe] is, but still, it’s nice to take things slow and sweet sometimes, isn’t it?", parse);
				Text.NL();
				Text.Add("<i>“Hmm, well I do enjoy the feeling of you going in the first time… so alright, I guess you can take your time. It still hurts a little, to be honest, but I won’t care too much about that when you’re making me feel good later.”</i>", parse);
			}
			Text.NL();
			parse["b"] = player.HasBalls() ? Text.Parse(", your [ballsDesc] nestling softly against [hisher] thighs", parse) : "";
			Text.Add("Patiently you feed inch after inch of your length inside of [himher], trying to make the insertion as gentle as possible. Terry’s appreciative groans fill your [earsDesc] as you push inside of [himher], stopping only when have reached to the very hilt of your [cockDesc][b]. You ask Terry how that feels, brushing your hand gently down [hisher] back.", parse);
			Text.NL();
			if(virgin || terry.Slut() < 30)
				Text.Add("<i>“Not bad, all things considered. Better than I expected, anyway.”</i>", parse);
			else if(terry.Slut() < 60)
				Text.Add("<i>“Nice and full. I think you can start moving now.”</i>", parse);
			else
				Text.Add("<i>“Pretty good, but you’d better get moving before I get it in my mind to run this show myself, [mistermiss] ‘nice and slow’.”</i> [HeShe] clenches [hisher] ass, drawing a groan out of you.", parse);
			if(promise) {
				Text.NL();
				Text.Add("You gently tousle Terry’s ears affectionately, assuring [himher] that you remember your promise; you’ll keep things nice and gentle for [himher], just like [heshe] asked. No better way to lose [hisher] virginity than that.", parse);
				Text.NL();
				Text.Add("<i>“Thanks, [playername].”</i>", parse);
				
				terry.relation.IncreaseStat(100, 2);
			}
			Text.NL();
			parse["c"] = terry.FirstCock() ? Text.Parse(", sliding tantalisingly over the [foxvixen]’s prostate with each plunge", parse) : "";
			Text.Add("With Terry ready, you hold onto [hisher] hips for support and start to lean back, drawing your shaft free of the [foxvixen]’s ass with the same smooth, patient movement you used to insert it. You withdraw until only your [cockTip] remains inside, hold that pose for a second, and then push back inside again. With the same gentle rhythm you pump back and forth, gliding in and out of Terry’s tailhole[c].", parse);
			Text.NL();
			Text.Add("Each time you pump yourself back in, you’re received with a groan as [heshe] does [hisher] best to relax; and each time you pull out Terry moans and clenches [hisher] butt, trying to keep you inside, which results in a nice vacuum that feels almost like [heshe]’s sucking on your cock with [hisher] ass. It’s tough to not throw care to the wind and just do [himher] hard. <i>“More...”</i> [heshe] moans.", parse);
			Text.NL();
			parse["belly"] = player.pregHandler.BellySize() > 3 ? Text.Parse(" and [bellyDesc]", { bellyDesc : player.StomachDesc() }) : "";
			parse["b"] = player.FirstBreastRow().Size() > 0.5 ? Text.Parse(" your [breastsDesc][belly] squishing softly against [hisher] girlish physique,", parse) : "";
			Text.Add("You can’t help but shudder at Terry’s plaintive moan; that’s certainly not helping you keep your resolve about keeping this gentle! Still, you manage to push it down and continue your rhythmic thrusting. To distract yourself, you lean forward until you are resting atop the [foxvixen]’s back,[b] your [nipsDesc] rubbing gently against [hisher] soft, downy fur. You playfully flick some of Terry’s mane of red hair out of the way and plant a playful kiss on the back of [hisher] neck.", parse);
			Text.NL();
			Text.Add("<i>“Hmm, that’s nice. Keep going,”</i> the [foxvixen] coos in pleasure.", parse);
			Text.NL();
			Text.Add("[HisHer] wish is your command; sliding forward on a particularly deep thrust. You lean over Terry’s back, gently maneuvering [hisher] muzzle so you can steal a quick kiss from the [foxvixen]’s lips. Seeing [hisher] ears twitching as you thrust away awakens a playful streak in you, and you teasingly nip at their pointy tips, making Terry giggle and wriggle in response.", parse);
			Text.NL();
			Text.Add("Your hand creeps around onto [hisher] front, reaching for [hisher] [tbreastDesc]. ", parse);
			if(terry.Cup() >= Terry.Breasts.Acup)
				Text.Add("Your fingers cup [hisher] [tbreastDesc], feeling the perky orb squish pleasantly. You grope and fondle it for a few moments, then release it, fingers returning to their original target. ", parse);
			Text.Add("Terry’s nipples are perky little nubs from the [foxvixen]’s excitement, practically diamond-hard with arousal. You pinch one between thumb and forefinger, tweaking and massaging it. <i>“Ah! Not so rough!”</i> You throw a quick apology and continue your ministrations, careful to be gentle as you listen to Terry’s mewls of pleasure at your assault.", parse);
			if(terry.Lactation())
				Text.Add(" Milk seeps onto your digits at the pressure, dripping to the ground below.", parse);
			Text.NL();
			Text.Add("<i>“If you - ah! - keep doing this I don’t think I - hmm! - I’m going to last much longer.”</i>", parse);
			Text.NL();
			Text.Add("Smiling, you kiss the back of [hisher] neck again, playfully teasing that [heshe] doesn’t sound unhappy about that. Your fingers trail tantalizing circles around [hisher] swollen nipples, dancing across the areolae before flicking the nubs themselves.", parse);
			Text.NL();
			if(terry.FirstCock()) {
				Text.Add("Remembering the bobbing erection between Terry’s legs, you decide to give [himher] a helpful little extra <i>push</i>... Your other hand winds itself between [hisher] hips, gently stroking the length of throbbing, turgid flesh between. You keep your strokes soft and even; you just want to keep [himher] properly on edge with this, not make [himher] blow [hisher] load just from that.", parse);
				if(terry.HorseCock())
					Text.Add(" That enhanced sensitivity of [hishers] makes it more difficult, but that’s half the fun!", parse);
				Text.NL();
			}
			Text.Add("Lifting your face closer to Terry’s ear, you whisper into it a single, simple word. <i>“Cum.”</i>", parse);
			Text.NL();
			Text.Add("Whether the [foxvixen] thief interprets that as an actual order or not, you don’t know. All that you know is the vice-like tightness of [hisher] ass, as [heshe] moans whorishly.", parse);
			if(terry.FirstVag()) {
				parse["b"] = player.HasBalls() ? player.BallsDesc() : player.ThighsDesc();
				Text.Add(" You can feel [hisher] pussy contracting to grip at a phantom member as your [b] are plastered with a squirt of warm feminine juices.", parse);
			}
			if(terry.HorseCock())
				Text.Add(" Terry’s equine endowment throbs in your grasp; you can feel as the massive load being held in [hisher] balls travels up [hisher] shaft to spew forth like from a perverted hose, matting [hisher] [tbreastDesc], arms and the ground below. You continue to stroke [hisher] shaft throughout the orgasm, making it a point to squeeze the large knot that’s formed just at the base, drawing a few extra jets as Terry groans and cries like a slut.", parse);
			else if(terry.FirstCock())
				Text.Add(" Terry’s cock throbs in your grasp. You can feel [hisher] knot inflating as [heshe] spews jet after jet of fox-seed below, emptying [hisher] balls of their liquid load.", parse);
			Text.NL();
			
			var cum = terry.OrgasmCum();
			
			Text.Add("You stop for a moment to admire the shuddering [foxvixen] below you, barely managing to remain on all fours as [hisher] trembling arms and knees threaten to give at any moment. You hug [himher] from behind, supporting [himher] as you turn to give [hisher] cheek a kiss.", parse);
			Text.NL();
			
			retFunc(false);
		}, enabled : true,
		tooltip : Text.Parse("Give it to [himher] smooth and soft; make sure [heshe] enjoys this.", parse)
	});
	options.push({ nameStr : "Rough",
		func : function() {
			Text.Clear();
			Text.Add("Gripping Terry’s hips tightly for extra leverage, you draw your hips back and surge forward, slamming your [cockDesc] right into the [foxvixen]’s tailhole in a single powerful impact that buries almost half of your length inside of [himher] in that instant.", parse);
			Text.NL();
			
			Sex.Anal(player, terry);
			terry.FuckAnal(terry.Butt(), player.FirstCock(), 4);
			player.Fuck(player.FirstCock(), 4);
			
			if(promise) {
				Text.Add("<i>“Ouch! What the fuck, [playername]!?”</i> Terry protests, wincing in pain. <i>“You promised to be gentle!”</i>", parse);
				Text.NL();
				Text.Add("You nod your head and concede that you did promise that, yes. But you changed your mind, you add unabashedly.", parse);
				Text.NL();
				Text.Add("<i>“Ugh! Great, shows how much I can trust you!”</i> [heshe] chastises.", parse);
				
				terry.relation.DecreaseStat(-100, 10);
			}
			else {
				if(terry.Slut() < 30) {
					Text.Add("The [foxvixen] cries out in pain. <i>“Dammit, [playername]. Can’t you be a little gentler!”</i> [heshe] protests.", parse);
					Text.NL();
					Text.Add("You shake your head; not when an ass as sweet as [hishers] is on the line, you reply. If [heshe] would just loosen up, this would be a lot more enjoyable for the both of you. Still, [heshe] is new at this, you suppose you can give [himher] a moment to adjust...", parse);
				}
				else if(terry.Slut() < 60) {
					Text.Add("Terry cries out in pain. <i>“T-That was quite the entrance. Dammit! At least let me adjust before you screw me raw.”</i>", parse);
					Text.NL();
					Text.Add("Well, it’s hard to hold yourself back when such a sweet ass is there, but you want this to feel good for [himher] too; you assure the [foxvixen] [heshe] can have the time [heshe] needs.", parse);
				}
				else {
					Text.Add("Terry cries out in a mixture of pain and pleasure. <i>“Ah! So rough! Someone is feeling randy,”</i> the [foxvixen] teases.", parse);
					Text.NL();
					Text.Add("As if [heshe] doesn’t love it when you feel this way, you quip back.", parse);
					Text.NL();
					Text.Add("<i>“Maybe I do… but you should still give me time to adjust.”</i>", parse);
					Text.NL();
					Text.Add("Of course, if [heshe] needs it.", parse);
				}
			}
			Text.NL();
			Text.Add("As the moments tick past, you feel Terry’s ass slowly growing looser, slackening its grip around your [cockDesc] as the [foxvixen] recovers from your initial penetration and relaxes. Once you feel [heshe] is as adjusted as [heshe]’s going to get, you waste no time; holding onto [hisher] hips for balance, you pull back a few centimeters and then roughly thrust forward, driving yourself deeper inside. Back a little for energy, then fiercely forward; you pound away at Terry’s butt until you have thrust your way inside of [himher] to the very hilt.", parse);
			Text.NL();
			Text.Add("Terry groans as your hips connect with [hisher] ass, instinctively clenching as you begin to pull out, then relaxing when you push back in. Without realising the two of you have fallen into a brisk, but steady pace. <i>“Hng! H-Harder,”</i> the [foxvixen] begs, lust-addled eyes glancing at you over [hisher] shoulder.", parse);
			Text.NL();
			parse["k"] = knotted ? Text.Parse(", your knot stretching [himher] with each penetration, even though it’s not yet swollen enough to tie you together", parse) : "";
			Text.Add("That’s a request you’re hardly inclined to deny; you pick up the pace, your flesh meeting with meaty slaps that make it quite clear what you are doing to any possible listeners. Your [cockDesc] jackhammers the [foxvixen]’s ass, wetly pounding into [himher][k].", parse);
			Text.NL();
			Text.Add("You rut Terry’s ass as if [heshe] were a bitch in heat, but you find yourself frustrated; it’s just not letting you get [himher] done right! Addled by lust, you suddenly pull backwards, sitting up and yanking Terry into your lap. The [foxvixen] yelps in surprise, gasping as your hands move from [hisher] hips to instead hold [hisher] legs by the knees. Letting gravity aid you in your task, you lift [himher] up and roughly slam [hisher] down on your shaft. Terry thrashes in your grasp, whether in protest or enjoyment you can’t tell. [HeShe] tries to speak to you, but all that comes out of [hisher] mouth is a garbled mess of groans, moans, and gasps.", parse);
			Text.NL();
			Text.Add("You decide to silence [himher] by going at it even harder than before, violently bouncing Terry up and down in your lap to give [himher] the hardest fucking you can possibly manage. Obscene noises echo around you, a perverse chorus of fleshy slapping, squelching as your cock slurps through Terry’s precum-filled anus, and the whimpers, mewls and salacious moans of your pleasure-delirious fucktoy.", parse);
			Text.NL();
			
			var cum = terry.OrgasmCum();
			
			Text.Add("There is no warning when the [foxvixen]’s butt suddenly clenches, grasping your [cockDesc] mid-thrust. ", parse);
			if(terry.FirstVag()) {
				parse["b"] = player.HasBalls() ? Text.Parse(" and down your [ballsDesc]", parse) : "";
				Text.Add("A squirt of juices flows out of [hisher] nethers, painting an obscene trail as [hisher] pussy continues to leak [hisher] pleasure down toward your [cockDesc][b]. ", parse);
			}
			if(terry.FirstCock()) {
				Text.Add("Strands of white shower the two of you as [hisher] cock whips about, spraying [hisher] load as you continue to fuck [himher] despite [hisher] climax. ", parse);
			}
			Text.Add("You grin to yourself as you continue to fuck your [foxvixen] through [hisher] climax, even as [heshe] grows slack in your grip, no longer capable, nor willing, to fight you as you use [himher].", parse);
			Text.NL();
			if(p1Cock.isStrapon)
				Text.Add("Even if you’re not actually feeling it yourself, the sight of your pet getting off so hard from your favorite toy is just too precious, spurring you to keep fucking [himher] as hard as you possibly can.", parse);
			else
				Text.Add("You moan with pleasure as Terry’s ass clenches down so wonderfully around your dick, feeling your own orgasm building up inside of you. You fuck as hard as you possibly can, eager to paint Terry’s guts with your seed.", parse);
			Text.NL();
			if(knotted) {
				Text.Add("Finally, your thrusting gets so rough and impatient that you drive your knot completely inside of Terry’s ass, [hisher] tailhole stretching obscenely to swallow it all and tie you both together.", parse);
				Text.NL();
				if(p1Cock.isStrapon) {
					Text.Add("As you unconsciously pull back, you feel something funny happening between your legs. With a moment’s thought, you realise that you have been fucking Terry so hard that your dildo has come out of its setting in your strap-on and is now stuck in Terry’s ass!", parse);
					Text.NL();
					Text.Add("Amused and annoyed in equal measure, you shift the [foxvixen] slightly in your lap for better access and try to grab the small stump of dildo jutting from [hisher] ass. Between the shortness of the available grip, and the knot jammed inside of Terry’s butt, it’s a difficult thing to achieve; you pull as hard as you can, twisting and turning this way and that, wriggling it however you can to try and coax it free.", parse);
					Text.NL();
					Text.Add("Up above Terry is panting in pleasure, moaning tiredly every time you yank. And despite the fact that [heshe]’s pretty much gone slack, [hisher] butt still refuses to let go of your [cockDesc]. You rock [himher] left and right, up and down, as you attempt to wrench the blasted toy off [hisher] butt. It’s not until you give it a good yank that you manage to drive the dildo out of [himher], the [foxvixen] coming crashing down on you as [heshe] giggles deliriously.", parse);
					Text.NL();
					Text.Add("You put the used toy aside, working to better adjust the pleasure-addled pet in your lap for greater comfort.", parse);
				}
				else {
					var cum = player.OrgasmCum();
					
					Text.Add("The sensation as [hisher] ass sucks your knot down is the final straw; you arch your back and cry out in your pleasure as your orgasm washes through you, erupting into Terry’s ass. ", parse);
					if(cum > 6) {
						Text.Add("Terry’s stomach practically explodes outward, your knot forcing the vast bulk of your inhuman load inside [himher], bloating the [foxvixen] so swiftly and efficiently you wouldn’t be surprised if some of it came flying out of [hisher] mouth. By the time you finish, Terry is cradling [hisher] beachball of a stomach gingerly in [hisher] lap, the sheer pressure making semen seep out around the seal of your knot.", parse);
					}
					else if(cum > 3) {
						Text.Add("Terry moans deliriously as [hisher] stomach expands dramatically, your cascade of semen bloating [himher] like a balloon. When your climax finally ends, Terry looks like [heshe] could give birth any day now.", parse);
					}
					else {
						Text.Add("Thick, hot strands of semen pour into Terry’s ass, your knot ensuring that not a single drop escapes, leaving [himher] looking slightly bloated by the time that you finish.", parse);
					}
					
					world.TimeStep({hour: 1});
				}
			}
			else { //no knot
				if(p1Cock.isStrapon) {
					Text.Add("As you withdraw from your latest thrust, you feel something strange happening about your nethers. Shifting around slightly, you realise that the sheer vigor of your fucking has loosened your toy and made it pop free of its harness. You don’t think you can fix it properly back in place in your current position... but that doesn’t mean you can’t have a little more fun.", parse);
					Text.NL();
					parse["c"] = terry.FirstCock() ? Text.Parse(" [hisher] prostate and", parse) : "";
					Text.Add("Taking hold of your [cockDesc], you resume the original punishing pace, thrusting it back and forth into Terry’s used ass with all your strength, twisting and turning to better rub against[c] all the most sensitive parts of [hisher] back passage.", parse);
					if(player.FirstVag())
						Text.Add(" With your free hand, you start to frig yourself, panting heavily from stimulation and arousal both as your fingers dance through your folds. Excited as you were from seeing Terry reduced to such a slut for your toy, your body responds well, and you’re certain an orgasm of your own is coming fast.", parse);
					Text.NL();
					Text.Add("Terry is helpless to resist your advances, not that you think [heshe]’d even want to resist, at this point. [HeShe]’s giggling like an insensate fool, wiggling [hisher] butt to try and follow your motions. At one point the [foxvixen] loses [hisher] balance and comes crashing down on you.", parse);
					Text.NL();
					parse["v"] = player.FirstVag() ? " The sudden shudders that ripple through you as your own orgasm hits don’t help." : "";
					Text.Add("The impact nearly knocks you over, and does make you drop the toy you were so busily plumbing [hisher] ass with before.[v] The two of you lay there for the moment, panting for breath, even as you mindlessly adjust Terry in your lap to be a little more comfortable.", parse);
					
					var cum = player.OrgasmCum();
				}
				else {
					Text.Add("You cry out in pleasure as your resistance breaks and orgasm washes through you, fountaining your seed into Terry’s waiting ass.", parse);
					Text.NL();
					
					var cum = player.OrgasmCum();
					
					if(cum > 6) {
						Text.Add("Seed pours back out over your lap as Terry’s body tries to reject the inhuman flood you are filling [himher] with, but so great is your geyser of semen that [hisher] stomach still bloats like a filled condom, swelling into a huge pregnant looking swell. Even when you are finished, excess spunk seeping out and smearing your legs, Terry remains bloated like a mother about to give birth.", parse);
					}
					else if(cum > 3) {
						Text.Add("You can see your pet’s stomach growing from the sheer volume of semen you are flooding [hisher] belly with, making Terry groan deliriously from the sensations of being pumped so full. By the time you finish, Terry is left rubbing a heavily pregnant-looking belly, the semen-filled orb dimpling under [hisher] fingers.", parse);
					}
					else {
						Text.Add("Thick and hot, your seed plasters Terry’s ass, squelching wetly by the time you are done as you paint it white.", parse);
					}
				}
			}
			Text.NL();
			
			retFunc(true);
		}, enabled : true,
		tooltip : Text.Parse("Fuck that butt good and hard!", parse)
	});
	Gui.SetButtonsFromList(options, false, null);
}


// TODO ITEMS

Terry.prototype.ItemUsable = function(item) {
	return true;
}

Terry.prototype.ItemUse = function(item, backPrompt) {
	if(item.isTF) {
		var parse = {
			item : item.sDesc(),
			aItem : item.lDesc(),
			foxvixen : terry.mfPronoun("fox", "vixen")
		};
		parse = terry.ParserPronouns(parse);
		
		if(terry.flags["TF"] & Terry.TF.TriedItem) {
			Text.Add("Terry does as ordered and takes the [item]. [HisHer] collar glows for a moment, but nothing else happens.", parse);
		}
		else {
			Text.Add("You hand Terry [aItem] and tell [himher] to try it. [HeShe] examines the [item] for a moment, before shrugging and moving to take it.", parse);
			Text.NL();
			Text.Add("[HeShe] swallows and you observe a faint, pinkish glow emanating from [hisher] collar, however it quickly fades. After a while, the [foxvixen] shrugs. <i>“So… that was it? I don’t feel any different.”</i>", parse);
			Text.NL();
			Text.Add("Considering what you’ve seen, you can only assume that this has something to do with that collar of [hishers]. It seems like it just isn't going to let you just transform [himher] like that. You'll need to see a specialist about this...", parse);
			Text.NL();
			if(jeanne.flags["Met"] != 0)
				Text.Add("It'd probably be best if you talked to Jeanne; she most likely made the collar, so she should be able to explain what's going on.", parse);
			else
				Text.Add("Given you got this collar from the princes of Rigard, the creator of it is probably the Rigard court wizard; talking to him or her may help answer why this just happened.", parse);
		}
		
		terry.flags["TF"] |= Terry.TF.TriedItem;
		
		Text.Flush();
		Gui.NextPrompt(backPrompt);
		
		return {grab : true, consume : true};
	}
	else
		return {grab : false, consume : true};
}

// Need if(terry.flags["TF"] & Terry.TF.TriedItem && !(terry.flags["TF"] & Terry.TF.Rosalin))
Scenes.Terry.RosalinTF = function() {
	var parse = {
		playername : player.name,
		rearsDesc  : function() { return rosalin.EarDesc(); }
	};
	parse = terry.ParserPronouns(parse);
	parse = rosalin.ParserPronouns(parse, "r");
	
	Text.Clear();
	Text.Add("<i>“Alchemy doesn’t work?”</i> Rosalin’s [rearsDesc] perk in curiosity as [rheshe] studies Terry. The alchemist turns around, quickly whipping together a potion from the ingredients [rheshe] has at hand. <i>“Try this, I want to see it for myself,”</i> [rheshe] urges the fox, handing [himher] the bottle. Terry looks a bit unsure of about this, but at your nod, [heshe] drinks contents of the offered flask. Just as before, the collar glows pink, and absolutely nothing happens.", parse);
	Text.NL();
	Text.Add("<i>“Hmm,”</i> Rosalin concludes, poking at the offending collar to little effect. <i>“Give me a few minutes, okay?”</i> Terry gulps as the determined alchemist starts pouring ingredients together into a bowl. This one takes significantly longer than the last, and the result is a vile smelling yellow goop.", parse);
	Text.NL();
	Text.Add("<i>“I… I’m supposed to drink that?”</i> Terry falters, shaking [hisher] head fearfully, backing away quickly.", parse);
	Text.NL();
	Text.Add("<i>“For science!”</i> Rosalin proclaims as [rheshe] advances on the poor fox, catching [himher] off guard and prying open [hisher] mouth, pouring the contents down [hisher] throat before you have a chance to intervene. Terry looks like [heshe] is going to be ill, swaying back and forth in place while smoke pours out of [hisher] mouth, nose and ears. The collar is working overtime, shining so brightly it almost hurts your eyes. Finally, the reaction seems to wear off. As the smoke settles, you can make out Terry again, unchanged.", parse);
	Text.NL();
	Text.Add("<i>“That is cheating!”</i> Rosalin complains, peeking out from [rhisher] position huddling behind [rhisher] workbench. <i>“That should’ve been enough hair balls to turn a bloody elephant into a housecat!”</i> [rHeShe] turns [rhisher] back on you, throwing ingredients together with newfound fervor, muttering something about magic.", parse);
	Text.NL();
	Text.Add("Terry tugs you away urgently, putting as much distance between you and the alchemist as [heshe] can. <i>“Don’t take me to that crazy person again, okay [playername]?”</i> the thief pleads anxiously, hiding behind you from the vindictive alchemist. <i>“I’m not drinking anything [rheshe] makes, and that’s that!”</i> [HeShe] looks vehement about it; [heshe]’d probably take [hisher] chances with the collar and try to run for it should you force the issue again.", parse);
	Text.Flush();
	
	terry.relation.DecreaseStat(-100, 3);
	world.TimeStep({hour: 1});
	terry.flags["TF"] |= Terry.TF.Rosalin;
	
	Gui.NextPrompt();
}

Scenes.Terry.JeanneTFFirst = function() {
	var parse = {
		foxvixen : terry.mfPronoun("fox", "vixen")
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	Text.Add("You ask Jeanne if she recognizes this collar, pointing at the object in question, sitting secure as always around Terry’s neck.", parse);
	Text.NL();
	Text.Add("<i>“Hmm? Yes, I made them. Pretty nice, don’t you think?”</i> she smiles.", parse);
	Text.NL();
	Text.Add("Yes, she did a wonderful job on it, you assure her. Best to keep her in a good mood for this, after all. You then explain you had a question; you attempted to transform Terry here, but the collar basically stopped the transformation from happening. Is it supposed to do that?", parse);
	Text.NL();
	Text.Add("<i>“Yes, certain transformatives and alchemical substances can interfere with the collar’s magic, something that can have disastrous consequences for the wearer. So I’ve put an enchantment on it to deal with this kind of risk. If you try to take a transformative wearing the collar, the collar will nullify all of the item’s transformative properties,”</i> she explains. <i>“So, if you want to use a transformative you have to take it off first.”</i>", parse);
	Text.NL();
	Text.Add("Looking at Terry for a moment, you then ask if there is any possible way that you could apply a transformative to Terry without taking the collar off first. ", parse);
	if(terry.Relation() >= 60)
		Text.Add("You trust Terry's loyalty without question, you know [heshe] would never leave you, but the two of you really prefer that [heshe] keeps the collar on.", parse);
	else if(terry.Relation() >= 30)
		Text.Add("Terry's gotten a lot better since you first 'recruited' [himher], but still, you're not entirely certain you'd trust [himher] not to run away if you took the collar off.", parse);
	else
		Text.Add("You have little doubt that if you removed Terry's collar, the [foxvixen] would bolt for freedom, after all.", parse);
	Text.NL();
	Text.Add("<i>“Then I suppose you’re in a dilemma,”</i> she states nonchalantly.", parse);
	Text.NL();
	Text.Add("Please, does she have any ideas how to solve this? You're sure someone as smart as her must have some inkling on how to pull it off - you really would appreciate it.", parse);
	Text.NL();
	Text.Add("<i>“Well...”</i> she trails off, tapping her lips. <i>“I can probably come up with something, but it’ll cost you, plus I’ll need some materials.”</i>", parse);
	Text.NL();
	Text.Add("That's certainly alright with you; it's about what you expected. You thank her for doing this for you, and then ask if there's anything else she needs to tell you about these specialised transformatives.", parse);
	Text.NL();
	Text.Add("<i>“I can’t prepare just any kind of transformative like this, but having some options beats having none, I think. Of course, you could always cave and just remove the collar,”</i> she smiles.", parse);
	Text.NL();
	Text.Add("You tell her that you'll keep that in mind.", parse);
	Text.Flush();
	
	world.TimeStep({minute: 30});
	terry.flags["TF"] |= Terry.TF.Jeanne;
	
	Scenes.Jeanne.Talk();
}

Terry.JeanneTFCost = function() {
	return 50;
}
Scenes.Terry.JeanneTFPrompt = function() {
	var parse = {
		
	};
	parse = terry.ParserPronouns(parse);
	
	//[name]
	var options = new Array();
	
	var AddItem = function(item, scene, name, tooltip, costmult, horseTF) {
		options.push({ nameStr : name || item.name,
			func : function(obj) {
				parse["item"] = obj.str;
				var coin = obj.mult * Terry.JeanneTFCost();
				parse["coin"] = Text.NumToText(coin);
				
				Text.Clear();
				Text.Add("<i>“For that, I’ll need [item], plus [coin] coins,”</i> she says, showing you a scroll of what she’ll be needing.", parse);
				if(terry.PregHandler().IsPregnant() && item == Items.Testos) {
					Text.NL();
					Text.Add("<i>“Sorry, [playername]. But trying to modify [hisher] pussy while [heshe]’s still pregnant could have disastrous consequences both for [himher] and the baby. So I’m going to have to refuse to do so until Terry’s had the baby.”</i>", parse);
					Text.NL();
					Text.Add("Jeanne has a point; looks like you’ll have to wait until Terry has [hisher] baby.", parse);
					Text.Flush();
					Scenes.Terry.JeanneTFPrompt();
				}
				else {
					Text.Flush();
					
					var options = new Array();
					options.push({ nameStr : "Craft",
						func : function() {
							world.TimeStep({hour: 1});
							party.coin -= coin;
							party.Inv().RemoveItem(item);
							Scenes.Terry.JeanneTFCraft(obj.item, obj.scene, horseTF);
						}, enabled : party.coin >= coin && party.Inv().QueryNum(item) > 0,
						tooltip : Text.Parse("Craft the potion for [coin] coins.", parse)
					});
					Gui.SetButtonsFromList(options, true, Scenes.Terry.JeanneTFPrompt);
				}
			}, enabled : true,
			obj : {
				str   : item.lDesc(),
				mult  : costmult || 1,
				item  : item,
				scene : scene
			},
			tooltip : tooltip
		});
	};
	
	//TODO items?
	AddItem(Items.Bovia,     Scenes.Terry.JeanneTFGrowBoobs,     "Grow boobs", "", 1);
	AddItem(Items.Lacertium, Scenes.Terry.JeanneTFShrinkBoobs,   "Shrink boobs", "", 1);
	AddItem(Items.Bovia,     Scenes.Terry.JeanneTFStartLactate,  "Lactate+", "", 1);
	AddItem(Items.Lacertium, Scenes.Terry.JeanneTFStopLactate,   "Lactate-", "", 1);
	AddItem(Items.Estros,    Scenes.Terry.JeanneTFGrowVag,       "Add pussy", "", 2);
	AddItem(Items.Testos,    Scenes.Terry.JeanneTFRemVag,        "Rem pussy", "", 1);
	AddItem(Items.Testos,    Scenes.Terry.JeanneTFGrowCock,      "Add cock", "", 2);
	AddItem(Items.Estros,    Scenes.Terry.JeanneTFRemCock,       "Rem cock", "", 1);
	AddItem(Items.Equinium,  Scenes.Terry.JeanneTFGrowHorsecock, "Horsecock", "", 5, true);
	
	Gui.SetButtonsFromList(options, true, Scenes.Jeanne.InteractPrompt);
}

Scenes.Terry.JeanneTFCraft = function(item, scene, horseTF) {
	var parse = {
		playername : player.name,
		lowerArmorDesc : function() { return player.LowerArmorDesc(); },
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		boygirl    : terry.mfPronoun("boy", "girl"),
		boygirl2   : player.mfTrue("boy", "girl"),
		armorDesc  : function() { return terry.ArmorDesc(); },
		terrycock  : function() { return terry.MultiCockDesc(); },
		terrypussy : function() { return terry.FirstVag().Short(); }
	};
	parse = terry.ParserPronouns(parse);
	
	terry.flags["TFd"]++;
	
	Text.Clear();
	Text.Add("Jeanne smiles as she takes the necessary ingredients from you, as well as the coins. <i>“Wait here, I’ll be right back.”</i>", parse);
	Text.NL();
	Text.Add("The elven mage moves about her room, collecting the materials she’ll need and setting them all up on a clear spot at a table nearby. Jeanne begins by taking the ingredients you’ve given and pouring them all into a bowl. She mixes it until she has worked the mix into an oddly-colored soup. Afterwards, she immediately pours the soup into a distill and starts the distilling process with a flick of her finger.", parse);
	Text.NL();
	Text.Add("While waiting for the process to finish, she opens a box nearby and takes out a strange-looking vial. It is about three inches long and one inch thick, ending in a rounded-out tip. She plugs the open vial to the end of the distill and sits back to watch the process conclude.", parse);
	Text.Flush();
	
	//TODO
	Gui.NextPrompt(function() {
		Text.Clear();
		if(horseTF) {
			Text.Add("Once it’s over, she closes the vial and utters something under her breath, making the vial glow briefly. <i>“Sorry, but I can’t really shrink this one, so your [foxvixen] will have to settle for taking a big one this time,”</i> Jeanne explains, handing you the sealed vial.", parse);
		}
		else {
			Text.Add("Once it’s over, she closes the vial and utters something under her breath, making the vial glow and shrink. She tests the seal to make sure it’s solid, then presents it to you. <i>“Here you go.”</i> You accept it, turning it over in your hand. After the magic has done its work, the vial is only a fraction of its former size.", parse);
		}
		
		world.TimeStep({hour : 1});
		
		if(terry.flags["TF"] & Terry.TF.JeanneUsed)
			Text.Add(" You take the capsule and look at Terry.", parse);
		else {
			Text.Add(" You thank her and take the capsule. So… you just feed Terry the capsule? Is that all it takes?", parse);
			Text.NL();
			Text.Add("<i>“Well, if you feed it to [himher] normally the collar will just counteract the transformative again. I did what I could to hide the elements detected by the collar, but the truth is that if the collar detects it, it’ll still nullify the effects.”</i>", parse);
			Text.NL();
			Text.Add("How are you supposed to give it to [himher] then?", parse);
			Text.NL();
			Text.Add("<i>“Anally,”</i> she says nonchalantly. <i>“That is a suppository, so just shove it in and it’ll work its magic. Don’t worry about the vial itself, the spell on it will dissolve it harmlessly.”</i>", parse);
			Text.NL();
			if(terry.Slut() < 5)
				Text.Add("<i>“What!? I’m not shoving that up my ass!”</i> Terry immediately protests.", parse);
			else if(terry.Slut() < 30)
				Text.Add("<i>“Tch, at least it won’t be as bad as a dick….”</i> Terry mumbles, not thrilled by the idea at all.", parse);
			else {
				Text.Add("<i>“Well, if that’s what it takes, I suppose I’m fine with it. Not like I haven’t taken bigger.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Oh? Would you like me to increase it’s size? I can make it as big as-”</i> Jeanne starts.", parse);
				Text.NL();
				Text.Add("<i>“Small is fine!”</i> Terry interrupts Jeanne. The elven mage just shrugs.", parse);
			}
			Text.NL();
			Text.Add("You thank Jeanne once again; applying this should be interesting…", parse);
		}
		Text.NL();
		
		terry.flags["TF"] |= Terry.TF.JeanneUsed;
		
		if(terry.Slut() < 5) {
			Text.Add("<i>“Do I really have to?”</i>", parse);
			Text.NL();
			Text.Add("<i>“It’s an order,”</i> you reply. As soon as you say the words the collar tightens in warning, a faint glow emanating from the enchanted leather.", parse);
			Text.NL();
			Text.Add("Terry sighs in defeat. <i>“I hate this...”</i> [heshe] mumbles. Without further ado [heshe] begins stripping off [hisher] [armorDesc].", parse);
		}
		else if(terry.Slut() < 30) {
			Text.Add("The [foxvixen] rolls [hisher] eyes, but complies with the unspoken command. [HeShe] strips off [hisher] [armorDesc]. <i>“Let’s just get this over with...”</i>", parse);
		}
		else {
			Text.Add("<i>“Alright, no need to say anything,”</i> [heshe] raises a hand, waving dismissively as [heshe] begins undoing [hisher] [armorDesc].", parse);
		}
		Text.NL();
		Text.Add("You watch patiently as Terry removes the last of [hisher] clothes and folds them carefully, setting them aside. Turning to look at you expectantly, [heshe] says. <i>“I’m ready… now what?”</i>", parse);
		Text.NL();
		if(terry.Relation() + terry.Slut() >= 60) {
			parse["milkdripping"] = terry.Lactation() ? " milk-dripping" : "";
			Text.Add("There’s a definite air of excitement in the [foxvixen]’s body language,[milkdripping] nipples erect through [hisher] fur.", parse);
			if(terry.FirstCock())
				Text.Add(" [HisHer] [terrycock] is jutting out of its sheath, as if in anticipation.", parse);
			if(terry.FirstVag())
				Text.Add(" [HisHer] [terrypussy] is visibly wet, a small stream leaking down the inside of [hisher] thighs.", parse);
			Text.NL();
			Text.Add("Looks like your little [foxvixen] is looking forward to doing some bodywork, you quip, reaching out to affectionately tussle [hisher] ears,", parse);
			Text.NL();
			if(terry.Relation() >= 60) {
				Text.Add("<i>“You can’t expect me to strip in front of my [boygirl2]friend and <b>not</b> get at least a bit antsy,”</i> [heshe] says, flustered and pouting as [heshe] averts [hisher] gaze in embarrassment.", parse);
				Text.NL();
				Text.Add("Smiling at [hisher] confession, you gently lift [hisher] chin and steal a quick kiss, assuring [himher] that’s part of [hisher] considerable charms. [HeShe] smiles at that, tail wagging softly behind.", parse);
			}
			else {
				Text.Add("<i>“So what if I am? It’s your fault I’m like this...”</i> [heshe] mumbles, averting [hisher] gaze with a slight frown.", parse);
				Text.NL();
				Text.Add("You just smirk and shake your head good-naturedly; [hisher] lips may say one thing, but [hisher] body tells the real story, no matter how much the [foxvixen] may want to deny it.", parse);
				Text.NL();
				Text.Add("<i>“That’s not...”</i> [heshe] starts, but quickly falls silent with a resigned sigh. <i>“Look, are you going to get on with it or are you just here to bully me?”</i> [heshe] asks indignantly.", parse);
			}
			Text.NL();
		}
		Text.Add("With one hand on [hisher] hip and the other on [hisher] shoulder, it’s a matter of moments for you to gently spin Terry around and give [himher] a gentle push. Effortlessly, the vulpine morph falls forward onto [hisher] knees. Another gentle push and a command is all you need to make [himher] go on fours, tail swept aside around [hisher] hip and buttocks raised slightly for better access to [hisher] tailhole. <i>“O-Okay, please be gentle.”</i>", parse);
		Text.NL();
		if(terry.flags["TFd"] > 5)
			Text.Add("Playfully you chide [himher]; you’re always gentle with your special [foxvixen], [heshe] knows that.", parse);
		else
			Text.Add("You assure [himher] that you’ll be as gentle as you can.", parse);
		Text.NL();
		Text.Add("Kneeling down for a better view, you admire the shapely, feminine ass now lifted before you. Terry’s tail twitches, and unthinkingly you move to stroke the long appendage with its soft, fluffy fur. A few caresses of the plush tail, and then it’s back to business, and you resume studying Terry’s butt, your gaze drawn to the pronounced love-heart shape of pure gold set against the creamy white of the rest of [hisher] asscheeks.", parse);
		Text.NL();
		
		if(terry.flags["BM"] == 0) {
			terry.flags["BM"] = 1;
			Text.Add("You can’t resist teasing Terry about [hisher] ‘birthmark’; who’d have thought [heshe] would have something so cute on [hisher] body, nevermind it being there of all places?", parse);
			Text.NL();
			Text.Add("<i>“S-Stop teasing me- Ah!”</i> [heshe] jumps when you touch the patch. <i>“Don’t touch it! It’s embarrassing!”</i> [heshe] protests weakly, cheeks burning so hot you can feel the heat from this distance.", parse);
			Text.NL();
			Text.Add("Seems like you found a weak spot, you think to yourself. ", parse);
		}
		else {
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Unable to resist yourself, you poke [himher] playfully right in the center of the heart-shape, feeling [hisher] buttflesh giving under the pressure of your finger.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("You gently trail your finger around the heart’s shape, following the lines until you have traced the shape completely.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Struck by an impulse, you bend in closer and plant a soft kiss on the golden-furred patch.", parse);
			}, 1.0, function() { return true; });
			scenes.Get();
			
			Text.NL();
			Text.Add("[HeShe] gasps softly at your touch. <i>“Don’t tease me like that!”</i> [heshe] protests.", parse);
			Text.NL();
			Text.Add("With a soft chuckle at how worked up [heshe] can get over something so small, you offer the [foxvixen] a half-hearted apology, asserting that you just couldn’t resist such a tempting target.", parse);
			Text.NL();
			Text.Add("<i>“Meanie...”</i>", parse);
		}
		Text.NL();
		Text.Add("<i>“This might help,”</i> Jeanne says, handing you a small tube with a clear gel inside. You thank her for the lube as she steps away. Now then… time to get started.", parse);
		Text.NL();
		Text.Add("Applying lube to your fingers, you begin to softly massage Terry’s tailhole, tracing your gel-caked digits around and around [hisher] ring before starting to working your fingertips inside. The [foxvixen]’s tail flutters as [heshe] represses the urge to wave it, whole body shivering from your touch even as [heshe] bites back any sounds of pleasure. As the lube begins to work and more and more of your finger slides inside, you start to pump away, getting [himher] ready for the insertion you’ll be making shortly.", parse);
		if(terry.FirstCock())
			Text.Add(" You have a front-row seat to watch Terry’s [terrycock] grow to full mast, hard and aching to be used.", parse);
		if(terry.FirstVag())
			Text.Add(" From where you are, you can see quite clearly as Terry’s [terrypussy] flushes with arousal, netherlips growing more prominent through [hisher] fur, aroused fluids starting to drip from its folds.", parse);
		Text.NL();
		Text.Add("Looks like [heshe]’s enjoying [himher]self, you say, smiling even as you continue to finger the [foxvixen].", parse);
		Text.NL();
		if(terry.Slut() < 30) {
			Text.Add("<i>“J-Just shut it and get this done with!”</i> [heshe] quips back.", parse);
			Text.NL();
			Text.Add("Temper, temper, you chide [himher]. Still, you have other things to do, so you focus your attention on finishing the lubing. Plenty of time to tease Terry later.", parse);
		}
		else {
			Text.Add("<i>“Yeah… it feels nice,”</i> [heshe] admits.", parse);
			if(terry.Relation() >= 60) {
				Text.Add(" <i>“We should continue this later, alone,”</i> [heshe] says, casting a glance at the smiling Jeanne.", parse);
				Text.NL();
				Text.Add("You smirk and inform [himher] that you’ll hold [himher] up to that, leisurely continuing to lube Terry’s asshole.", parse);
			}
		}
		Text.NL();
		Text.Add("Finally, you deem Terry’s tush to be as ready as it’ll ever be. Giving Jeanne back her lube, you reach for the transformative suppository she gave you earlier, align it with Terry’s anus, and start to gently push it against [hisher] pucker.", parse);
		Text.NL();
		
		Gui.Callstack.push(function() {
			Text.NL();
			Text.Add("The [foxvixen] gets up on [hisher], awaiting whatever effect the suppository is supposed to have on [himher]self.", parse);
			Text.Flush();
			
			Gui.NextPrompt(scene);
		});
		
		if(horseTF) {
			Text.Add("<i>“I-It’s too big!”</i> Terry protests as you try to shove the suppository up [hisher] butt.", parse);
			Text.NL();
			Text.Add("You try your best to comfort the [foxvixen] and get [himher] to relax, but it’s no use. Terry is just too tense to take this one, even though you stretched [himher] out just moments ago. If [heshe] doesn’t relax you’re never getting this inside.", parse);
			Text.NL();
			Text.Add("Sighing, you stop for a moment, considering your options. Finally an idea pops in your head. This should stretch [himher] nicely. ", parse);
			
			var cocksInAss = player.CocksThatFit(terry.Butt());
			var p1Cock     = player.BiggestCock(cocksInAss);
			
			parse["multiCockDesc"] = function() { return player.MultiCockDesc(); }
			parse["cockDesc"]      = function() { return p1Cock.Short(); }
				
			if(p1Cock) {
				Text.Add("You strip your [lowerArmorDesc], exposing your [multiCockDesc] to air.", parse);
				Text.NL();
				Text.Add("<i>“[playername], what are you…!?”</i> [heshe] suddenly gasps as you nestle your [cockDesc] against [hisher] rosebud. <i>“Here!? You’re going to take me here, of all places?”</i>", parse);
				Text.NL();
				Text.Add("Yes, you have to stretch [himher] out. Besides, it’s not like Jeanne would mind, would she?", parse);
				Text.NL();
				Text.Add("<i>“Don’t mind me,”</i> the elven mage replies, taking a seat on a nearby chair, studying the fox intently.", parse);
				Text.NL();
				Text.Add("It’s settled then.", parse);
			}
			else {
				Text.Add("You ask if Jeanne has a strap-on you could use.", parse);
				Text.NL();
				Text.Add("<i>“What!?”</i> Terry protests.", parse);
				Text.NL();
				Text.Add("<i>“Sure,”</i> she replies, walking to a chest nearby.", parse);
				Text.NL();
				Text.Add("<i>“You can’t be serious, [playername]! You’re going to take me? Here of all places?”</i>", parse);
				Text.NL();
				Text.Add("Yes, you have to stretch [himher] out. Besides, it’s not like Jeanne would mind, would she?", parse);
				Text.NL();
				Text.Add("<i>“Don’t mind me,”</i> the elven mage replies, taking a seat on a nearby chair, studying the fox intently.", parse);
				Text.NL();
				Text.Add("It’s settled then. You strip off your [lowerArmorDesc] and attach the strap-on, making sure it won’t come loose. Now, about Terry’s butt...", parse);
				p1Cock = Items.StrapOn.PlainStrapon.cock;
			}
			Text.NL();
			
			Scenes.Terry.SexFuckButtEntrypoint(p1Cock, false, function(rough) {
				Text.Add("There, now [heshe]’s all stretched up, you proudly declare, working the tip of the big suppository into [hisher] butt. ", parse);
				if(rough) {
					Text.Add("<i>“That works, I suppose,”</i> Jeanne muses, huffing as she adjusts her gown, unabashedly licking her drenched fingers clean. <i>“Was it really necessary to be that rough, though?”</i> She really shouldn’t be one to talk. While you had your own fun, the court magician has been playing with some toys out of her collection, eyeing Terry with lustful eyes. Looks like she really enjoyed the show.", parse);
					Text.NL();
					Text.Add("<i>“[playername],”</i> the [foxvixen] grunts. <i>“Ya big jerk!”</i> [heshe] exclaims, moaning as you manage to insert the first few inches. <i>“Not only did you fuck me in front of - Aah! - her, but did you really have to be so rough!”</i>", parse);
					Text.NL();
					if(terry.Slut() < 60) {
						Text.Add("Yes. With Terry’s cute tush in full display before you… why, asking you to hold back is just asking too much! No, a glorious butt like the one [heshe] has was just made to be fucked raw, and you’re more than happy to oblige!", parse);
						Text.NL();
						Text.Add("<i>“...You...”</i> Terry starts, but doesn’t finish. You can tell the [foxvixen] is embarrassed at your comment. [HeShe]’s really a sucker for compliments, isn’t [heshe]?", parse);
					}
					else {
						Text.Add("Funny, you don’t remember hearing [himher] complain while you were doing it.", parse);
						Text.NL();
						Text.Add("<i>“You - ah! - didn’t give me a chance to.”</i>", parse);
						Text.NL();
						Text.Add("Chuckling, you reply that [heshe]’s right. [HeShe] really couldn’t hope to say otherwise in-between [hisher] moaning about how good it felt. Nor [hisher] cries of enjoyment.", parse);
						Text.NL();
						Text.Add("<i>“S-Stop it!”</i> Terry protests, cheeks flushing with embarrassment. You can see them redden just a bit, even though [hisher] fur does a good job of hiding it.", parse);
						Text.NL();
						Text.Add("Oh Terry… [heshe]’s just so fun to tease...", parse);
					}
				}
				else {
					Text.Add("<i>“A novel enough technique,”</i> Jeanne muses, idly playing with herself as she watches you.", parse);
					Text.NL();
					Text.Add("<i>“[playername],”</i> the [foxvixen] says with a groan. <i>“You fucked me in front of- Aah!”</i> [heshe] says, moaning as you manage to insert the first few inches.", parse);
					Text.NL();
					if(terry.Slut() < 60) {
						Text.Add("You simply chuckle. It’s not like it was a big deal. You enjoyed yourself, Terry enjoyed [himher]self, and Jeanne got a good show. Think about it, was it really that bad indulging in front of an audience?", parse);
						Text.NL();
						Text.Add("<i>“I-I guess not.”</i>", parse);
						Text.NL();
						Text.Add("You pet the [foxvixen] lightly in response.", parse);
						terry.slut.IncreaseStat(60, 1);
					}
					else {
						Text.Add("You laugh at what [heshe] was about to say. Come on… you know [himher] better than that. It’s not like the [foxvixen] even cares if you do it in public. Once you get [himher] going there’s just no stopping [himher].", parse);
						Text.NL();
						Text.Add("<i>“...Alright, alright, I get it. No need to rub it in. But do I really need to remind you that it was <b>you</b> who made me this way?”</i>", parse);
						Text.NL();
						Text.Add("Of course not, but you couldn’t help keeping your hands off [himher] either. So maybe it’s [hisher] own fault for being so damn fuckable…", parse);
						Text.NL();
						Text.Add("If Terry didn’t have any fur, you’d think [heshe] was blushing. <i>“Um… I’m not sure how to respond that...”</i>", parse);
						Text.NL();
						Text.Add("No need to dwell on it. You knew [heshe]’d make a great pet, and you’re glad you got [himher] to come with you.", parse);
						terry.relation.IncreaseStat(100, 1);
					}
				}
				if(terry.Relation() >= 60) {
					Text.Add(" <i>“I love you,”</i> [heshe] adds.", parse);
					Text.NL();
					Text.Add("Yes, of course [heshe] does. You love [himher] too, you reply. Now if [heshe]’ll be a good [boygirl] and take all of [hisher] medicine?", parse);
				}
				else {
					Text.NL();
					if(rough)
						Text.Add("<i>“Doesn’t - oh! - make you any less of a jerk,”</i> [heshe] quips.", parse);
					else
						Text.Add("<i>“Doesn’t - oh! - make you any less of a perv, you horndog.”</i> [heshe] quips.", parse);
					Text.NL();
					Text.Add("Maybe so, but right now you need [himher] to be a good [boygirl] and take all of [hisher] medicine.", parse);
				}
				Text.NL();
				Text.Add("Your only reply is a lusty moan as you manage to cram in a few more inches.", parse);
				Text.NL();
				Text.Add("Once you manage to get the other end of the vial past [hisher] sphincter, Terry groans and suddenly clenches [hisher] butt, a couple inches of the suppository escaping from [hisher] used butthole. Seeing no other reasonable way to push this in effectively, you align the tip of your [cockDesc] with the vial and thrust.", parse);
				Text.NL();
				Text.Add("Terry howls in a mixture of pain and pleasure as [hisher] butt is stretched both by the large capsule and your [cockDesc], the magic within the vial finally activating and drilling itself inside Terry’s guts. Success!", parse);
				Text.NL();
				Text.Add("<i>“Owowow! What happened to being gentle!?”</i> the [foxvixen] protests.", parse);
				Text.NL();
				Text.Add("You wouldn’t have had to do this if [heshe] wasn’t being so stubborn about taking the suppository, besides it’s not like [heshe] didn’t enjoy it, you point out.", parse);
				Text.NL();
				Text.Add("Despite having climaxed only moments ago", parse);
				if(terry.FirstVag())
					Text.Add(" [hisher] [terrypussy] is already puffed up in full arousal, wet with [hisher] juices", parse);
				if(terry.FirstVag() && terry.FirstCock())
					Text.Add(", and", parse);
				if(terry.FirstCock())
					Text.Add(" [hisher] [terrycock] is fully erect, dripping pre", parse);
				Text.Add(".", parse);
				Text.NL();
				Text.Add("Terry flushes in embarrassment, averting [hisher] eyes. <i>“You really are a big meanie,”</i> [heshe] pouts.", parse);
				Text.NL();
				parse["armorDesc"] = function() { return player.ArmorDesc(); }
				Text.Add("Extricating your [cockDesc], you pat [himher] gently on the flank and inform [himher] that you’re all done. Having said that you move to clean up and put your [armorDesc] back on.", parse);
				PrintDefaultOptions();
			});
		}
		else {
			Text.Add("With a groan of arousal, Terry arches [hisher] back in unthinking pleasure as it glides smoothly inside, your fingers following it as deeply as you can fit them. Finally, you are inside [himher] to the knuckle, but you can feel the capsule continue gliding inwards, making course for Terry’s stomach.", parse);
			Text.NL();
			Text.Add("Extricating your digits, you pat the [foxvixen] tenderly on the flank and inform [himher] that you’re all done.", parse);
			PrintDefaultOptions();
		}
	});
}

Scenes.Terry.JeanneTFGrowBoobs = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		terrycock  : function() { return terry.MultiCockDesc(); }
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.Cup() <= Terry.Breasts.Flat) {
		Text.Add("The naked [foxvixen] twitches, looking down in surprise at [hisher] chest as the transformative’s effects begin taking hold. [HisHer] nipples perk up, though who can say if from arousal or the magic, like little cherry-pink nubs through Terry’s fur. Terry groans softly at the sensation, [hisher] formerly flat chest begins to bulk up; fat visibly swelling into being underneath the skin and fur and pushing [hisher] nipples outwards. Within moments, what was a flat chest is now sporting a dainty pair of feminine A-cup breasts.", parse);
		Text.NL();
		Text.Add("The [foxvixen] pants, as [heshe] recovers from the TF. Then [heshe] slowly rises to [hisher] feet, experimentally pinching a nipple and gasping as [heshe] does so. <i>“Sensitive...”</i> [heshe] comments under [hisher] breath.", parse);
		Text.NL();
		Text.Add("Now that’s too tempting to pass up. Without hesitation, your hands reach for your vulpine pet’s new bosom, gently stroking each of the new A-cups in turn, squeezing the plush flesh through its soft fur before caressing [hisher] erect nipples with your thumbs.", parse);
		Text.NL();
		Text.Add("Terry gasps and quickly moves to bat your hands away. <i>“S-Stop it!”</i> [heshe] protests weakly.", parse);
		
		terry.flags["breasts"] = Terry.Breasts.Acup;
		terry.SetBreasts();
	}
	else if(terry.Cup() == Terry.Breasts.Acup) {
		Text.Add("A soft whimper escapes Terry’s throat, nipples perking up as [hisher] small bosom quivers before starting to grow. A pleased murmur bubbles from the [foxvixen]’s throat as they swell outwards, stopping only after [heshe] has acquired a perky pair of B-cup breasts.", parse);
		Text.NL();
		Text.Add("Terry is left panting as [hisher] transformation reaches an end. [HeShe] cups [hisher] newly grown breasts, testing them momentarily as [heshe] rises to [hisher] feet.", parse);
		Text.NL();
		Text.Add("Nodding your head appreciatively, you idly compliment Terry on how good [heshe] looks with them. Not so big as to be obtrusive, but definitely enhancing [hisher] womanly charms.", parse);
		Text.NL();
		if(terry.Relation() < 60) {
			Text.Add("<i>“I’m not a girl...”</i> [heshe] protests weakly.", parse);
			Text.NL();
			Text.Add("The breasts [heshe] has certainly don’t make [himher] look very manly - not that [heshe] ever did, of course - but you let the [foxvixen] insist otherwise, for [hisher] peace of mind.", parse);
		}
		else {
			Text.Add("<i>“Um… thanks. I guess...”</i>", parse);
			Text.NL();
			Text.Add("With a smile, you assure [himher] that you’d be happy to help [himher] give them a test run, if ever [heshe] feels like it.", parse);
		}
		
		terry.flags["breasts"] = Terry.Breasts.Bcup;
		terry.SetBreasts();
	}
	else if(terry.Cup() == Terry.Breasts.Bcup) {
		Text.Add("Terry’s head falls back and [heshe] moans softly, bosom quivering as the transformative goes to work. Nipples hard as diamond, jutting blatantly through the fur, you watch as the perky orbs balloon outwards, swelling into plush, proud C-cups, with just the right amount of sag. Terry truly looks like a woman at any casual glance, with an hourglass figure that many women would kill to have.", parse);
		if(terry.FirstCock())
			Text.Add(" Even knowing about the [terrycock] hanging between [hisher] legs, if [heshe] were covered, you doubt anyone would notice it at a first glance in [hisher] usual clothes.", parse);
		Text.NL();
		Text.Add("Terry pants, watching [hisher] own chest rise and fall. [HeShe] cups [hisher] pillowy breasts, testing their weight. Slowly, [heshe] rises to [hisher] feet, [hisher] expression one of confusion. Your eyes meet and you can tell [heshe]’s not too sure about this development.", parse);
		Text.NL();
		Text.Add("Well, you know one way to convince [himher]. Closing the distance between you, your hands reach out and gently cup [hisher] newly amplified bosom. Massaging the pillowing flesh with your fingers, you begin kneading [hisher] nipples and caressing the sensitive titflesh.", parse);
		Text.NL();
		if(terry.Relation() < 30) {
			Text.Add("For a moment the [foxvixen] pushes [hisher] chest against your hands, as if enjoying your caress, but then [heshe] gasps and quickly jumps back. <i>“Don’t touch them!”</i> [heshe] protests.", parse);
			Text.NL();
			Text.Add("Certainly looked to you like [heshe] was enjoying it, but you hold your peace. You know [heshe]’ll come around and admit the truth eventually; you just need to be patient with [himher] until then.", parse);
		}
		else if(terry.Relation() < 60) {
			Text.Add("Terry’s expression is one of discomfort, even so, [heshe] doesn’t move away from your touch. Instead [heshe] just stands there while you inspect [hisher] new growth; a soft sigh of pleasure escaping [himher] as you finish.", parse);
			Text.NL();
			Text.Add("You’re a little disappointed at the lack of reaction, but at least [heshe]’s not actively fighting you away anymore. Little steps lead to big rewards, after all.", parse);
		}
		else {
			Text.Add("Terry moans softly as you caress [hisher] newly grown breasts. [HeShe] thrusts [hisher] chest out to allow you full access. <i>“Do you like them?”</i> [heshe] asks, looking at you expectantly.", parse);
			Text.NL();
			Text.Add("You smile back and playfully kiss [himher] right on the closest nipple, a soft girly squeak of pleasure and surprise escaping Terry’s mouth. You glance up at [himher] and see the [foxvixen] openly grinning, clearly pleased by your approval.", parse);
		}
		terry.flags["breasts"] = Terry.Breasts.Ccup;
		terry.SetBreasts();
	}
	else if(terry.Cup() == Terry.Breasts.Ccup) {
		Text.Add("Terry arches [hisher] back and moans in pleasure, unthinkingly thrusting out [hisher] bosom and emphasizing its sudden growth spurt. Before your eyes, the former C-cups balloon into large, luscious D-cups, looking even larger than they actually are on Terry’s otherwise petite and graceful build.", parse);
		Text.NL();
		Text.Add("Even with the [foxvixen]’s small frame exaggerating every quiver and quake of them, they are truly enticing. Before Terry can think of clambering back to [hisher] feet, you move to touch them. They’re just as soft and inviting as they look, downy fur covering ample flesh that’s got just the right amount of give to it. Yes, groping these is going to be a very enjoyable experience, for both of you.", parse);
		Text.NL();
		Text.Add("Giving them a last appreciative squeeze for luck, you let Terry’s tits go and offer the [foxvixen] a hand to clamber back to [hisher] feet. ", parse);
		if(terry.Relation() < 30)
			Text.Add("Terry ignores your offer for help and gets back on [hisher] feet by [himher]self.", parse);
		else
			Text.Add("Terry takes your hand and you help [himher] back to [hisher] feet.", parse);
		Text.Add(" <i>“They’re heavy,”</i> the [foxvixen] idly comments.", parse);
		Text.NL();
		Text.Add("That may be so, you reply, but they most assuredly look great on [himher]; [heshe] really pulls them off well. You think you’d be hard-pressed to find another [foxvixen] anywhere near Rigard who looks as good as [heshe] does.", parse);
		Text.NL();
		if(terry.Relation() < 60)
			Text.Add("Terry looks away, clearly embarrassed by your compliment.", parse);
		else
			Text.Add("Terry looks at you, a soft smile on [hisher] lips.", parse);
		terry.flags["breasts"] = Terry.Breasts.Dcup;
		terry.SetBreasts();
	}
	else {
		Text.Add("Terry gasps and moans, panting as [hisher] tits begin their now familiar ballooning routine, swelling out into heaving E-cups... but then, rather than stopping, they keep on growing! Terry whimpers in panic as they continue to bloat, swelling down and out over [hisher] stomach. Inches passing like seconds, they reach F-cup size, almost as big as [hisher] head, and then they grow into G-cups and are <i>bigger</i> than [hisher] head... just how big is [heshe] going to get...?", parse);
		Text.NL();
		Text.Add("As soon as you pass the thought, however, the [foxvixen]’s boobs stop their dramatic expansion, quivering atop Terry’s chest. And then, even faster than they grew before, they start to shrink, deflating rapidly until Terry is left with [hisher] former D-cup cleavage, much to [hisher] evident relief.", parse);
		Text.NL();
		Text.Add("<i>“Don’t you think you’ve gone far enough, [playername]?”</i> Jeanne comments reproachfully.", parse);
		Text.NL();
		Text.Add("Biting back any possible sarcastic quips, you idly agree and move to help the shivering [foxvixen] to [hisher] feet. You’ll need to remember that [heshe] is as busty as [heshe]’s going to get, otherwise you’ll just be wasting money and ingredients. You ask Terry if [heshe]’s alright.", parse);
		Text.NL();
		Text.Add("[HeShe] nods, hugging [hisher] chest as [heshe] gets over what just happened. <i>“Please. Don’t make me go through that again.”</i>", parse);
		terry.flags["breasts"] = Terry.Breasts.Dcup;
		terry.SetBreasts();
		
		terry.relation.DecreaseStat(0, 3);
	}
	Text.Flush();
	
	Scenes.Jeanne.InteractPrompt();
}

Scenes.Terry.JeanneTFShrinkBoobs = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen")
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.Cup() >= Terry.Breasts.Dcup) {
		Text.Add("Terry gasps, arching [hisher] back with a moan, bosom thrusting unconsciously forward. Before your eyes, the luscious D-cups quiver and then start to dwindle, shrinking in on themselves until Terry has lost a full cup-size, leaving [himher] with a more manageable C-cup bustline.", parse);
		Text.NL();
		Text.Add("The [foxvixen] hefts [hisher] reduced boobs, testing them. <i>“Well, that’s certainly a load off my back,”</i> [heshe] states. <i>“Personally I was way too big previously. So it’s nice to have them be a little smaller.”</i>", parse);
		Text.NL();
		Text.Add("You nod your head absently, noting that you’re happy that Terry is happier with [hisher] new breasts.", parse);
		
		terry.flags["breasts"] = Terry.Breasts.Ccup;
		terry.SetBreasts();
	}
	else if(terry.Cup() == Terry.Breasts.Ccup) {
		Text.Add("A mewl escapes Terry’s throat as [hisher] C-cups quiver visibly, unconsciously arching [hisher] back and making it more prominent as they shrink. By the time they stop, the [foxvixen] is sporting a new B-cup bustline.", parse);
		Text.NL();
		Text.Add("[HeShe] massages [hisher] boobs experimentally. <i>“I guess smaller breasts are more manageable...”</i> [heshe] mumbles. You get the feeling that [heshe]’s a bit disappointed at [hisher] reduced bust.", parse);
		Text.NL();
		Text.Add("Deciding not to raise the matter directly, you simply give Terry an idle agreement with [hisher] statement. Privately, you’re certain [heshe]’ll get over it soon enough.", parse);
		
		terry.flags["breasts"] = Terry.Breasts.Bcup;
		terry.SetBreasts();
	}
	else if(terry.Cup() == Terry.Breasts.Bcup) {
		Text.Add("The [foxvixen]’s eyes sink closed with a luxuriant groan, B-cups visibly shrinking away and not stopping until [heshe]’s left with a humble A-cup bustline.", parse);
		Text.NL();
		Text.Add("Terry checks out [hisher] perky breasts. <i>“Guess I don’t really have to worry about them sagging anymore now.”</i>", parse);
		Text.NL();
		Text.Add("That’s certainly true, you quip back.", parse);
		
		terry.flags["breasts"] = Terry.Breasts.Acup;
		terry.SetBreasts();
	}
	else if(terry.Cup() == Terry.Breasts.Bcup) {
		Text.Add("With a single moan, Terry’s bustline rapidly shrinks away, within seconds leaving [himher] with [hisher] original daintily flat chest.", parse);
		Text.NL();
		Text.Add("<i>“Guess I won’t have to worry so much about protecting my chest now, at least not more than usual,”</i> the [foxvixen] states.", parse);
		if(terry.Lactation())
			Text.Add(" <i>“And I won’t have to worry anymore about draining my breasts,”</i> [heshe] adds.", parse);
		Text.NL();
		Text.Add("That certainly seems to be the case, you agree.", parse);
		
		terry.flags["breasts"] = Terry.Breasts.Flat;
		terry.flags["lact"] = 0;
		terry.SetBreasts();
		terry.SetLactation();
	}
	else {
		Text.Add("Long, silent moments tick by, and not a thing happens. Terry pokes [hisher] chest experimentally and then shrugs, clearly unsure what to say. You feel very foolish; what were you expecting to happen, giving a breast-reducer to someone without breasts to reduce?", parse);
		
		terry.flags["breasts"] = Terry.Breasts.Flat;
		terry.flags["lact"] = 0;
		terry.SetBreasts();
		terry.SetLactation();
	}
	Text.Flush();
	
	Scenes.Jeanne.InteractPrompt();
}

Scenes.Terry.JeanneTFStartLactate = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		terrybreasts : function() { return terry.FirstBreastRow().Short(); }
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.Lactation()) {
		Text.Add("Terry cringes, the [foxvixen]’s lips instinctively curled back over [hisher] teeth in a nervous snarl as [hisher] nipples perk up through the fur, breasts visibly quivering. [HeShe] whimpers, hands reaching up to tenderly cradle [hisher] [terrybreasts], then [heshe] throws [hisher] head back in a primal scream as, out of nowhere, [hisher] nipples unleash a cascade of vulpine milk.", parse);
		Text.NL();
		Text.Add("As close as you are, you can do nothing to keep yourself from getting hosed down as Terry becomes a veritable milk-fountain. Fortunately, it’s only temporary, and the streams die away after a few moments, leaving only the white streaks painted over your body and Terry’s swollen-looking nipples as sign of what lurks inside [hisher] breasts.", parse);
		Text.NL();
		Text.Add("The court magician giggles. ", parse);
		if(terry.flags["xLact"] == 0)
			Text.Add("<i>“I suppose that’s what you get for trying to make a lactating [foxvixen] lactate; I could get used to watching this,”</i> she teases.", parse);
		else if(terry.flags["xLact"] <= 3)
			Text.Add("<i>“You must really enjoy getting drenched in breast milk, hrm?”</i>  she teases.", parse);
		else if(terry.flags["xLact"] <= 6)
			Text.Add("<i>“I admit this was amusing the first few times, but don’t you think [heshe]’s had enough?”</i> she comments.", parse);
		else
			Text.Add("<i>“Will you ever learn your lesson?”</i> she asks, rolling her eyes.", parse);
		Text.Add(" Jeanne snaps her fingers, gathering all the milk into a floating white orb and funnelling it all into a bottle. She corks the bottle and passes it to you.", parse);
		Text.NL();
		Text.Add("You idly thank Jeanne for her help, and the clean up, before reaching down and helping Terry to [hisher] feet. From the way [heshe] is still gingerly cradling [hisher] bosom, it looks like [heshe]’s still full to capacity.", parse);
		
		terry.flags["xLact"]++;
	}
	else {
		Text.Add("Terry moans softly as [hisher] [terrybreasts] visibly quiver; it almost looks like [hisher] nipples are vibrating, working themselves up fatter and fuller than usual. After a few moments, the [foxvixen]’s chest settles back down again, leaving [himher] with engorged nipples. Terry makes a small noise of curiosity, and inquisitively pinches at one; [heshe] lets out a yelp of shock, hand withdrawing as if stung, and allowing you to see the droplet of white milk seeping from the nipple and running down [hisher] tit.", parse);
		Text.NL();
		Text.Add("<i>“I feel so full,”</i> [heshe] comments, hugging [hisher] own chest.", parse);
		Text.NL();
		Text.Add("Inquisitive, you take Terry’s hands by the wrists and gently lift [hisher] arms away, allowing you to move in closer to suckle at one sensitive nipple. Your pet’s milk washes over your tongue, a distinctive taste accompanied by liquid warmth; very nice. Smacking your lips appreciatively, you congratulate Terry on how tasty it is.", parse);
		Text.NL();
		if(terry.Relation() < 30) {
			Text.Add("<i>“How dare you! Don’t touch me!”</i> [heshe] protests, jumping away from you.", parse);
			Text.NL();
			Text.Add("You watch [himher] with feigned indifference, asking how [heshe] expects to drain [himher]self without your help whenever [heshe] gets full. Terry grumbles, ears flattening against [hisher] skull. The [foxvixen] looks down at the floor, but says nothing. [HeShe]’ll get over it.", parse);
		}
		else if(terry.Relation() < 60) {
			Text.Add("<i>“You like it? Good. Because you’re helping me drain it whenever I’m full!”</i> [heshe] says imperiously.", parse);
			Text.NL();
			Text.Add("You can’t help but smirk at Terry’s attempt at a defiant bark, casually replying that you think you can do that for [himher].", parse);
		}
		else {
			Text.Add("<i>“I’m glad you like it. But I hope you’re aware this means you’ll be adding ‘milk the fox’ to your daily tasks,”</i> [heshe] teases with a smirk.", parse);
			Text.NL();
			Text.Add("Grinning back, you assure [himher] that you’ll adjust your schedule accordingly.", parse);
		}
	}
	Text.Flush();
	terry.flags["lact"] = 1;
	terry.SetLactation();
	terry.lactHandler.milk.base = terry.MilkCap();
	
	Scenes.Jeanne.InteractPrompt();
}

Scenes.Terry.JeanneTFStopLactate = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		terrybreasts : function() { return terry.FirstBreastRow().Short(); }
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.Lactation()) {
		Text.Add("Terry’s breasts quiver to the extent [hisher] nipples vibrate, the formerly engorged nubs shrinking down and compacting into their original small, perky selves. Once they have dwindled away, the shuddering wracking the [foxvixen]’s titflesh vanishes, leaving [hisher] [terrybreasts] the way they were before.", parse);
		Text.NL();
		Text.Add("Terry experimentally pinches a nipple, but nothing comes out. <i>“I guess that’s the end of that then.”</i>", parse);
		Text.NL();
		Text.Add("You nod idly, agreeing that it looks like neither of you will need to deal with fox-milk anymore. Doesn’t look like Terry minds the change very much, either.", parse);
	}
	else {
		Text.Add("The two of you look at Terry’s bosom for a while, but ultimately nothing happens.", parse);
		Text.NL();
		Text.Add("<i>“I guess… it worked?”</i> Terry says, getting up on [hisher] feet.", parse);
		Text.NL();
		Text.Add("<i>“Of course it did,”</i> Jeanne offers. <i>“My potions always work. Just because it didn’t have any visible effect doesn’t mean it fizzed out.”</i>", parse);
		Text.NL();
		Text.Add("As you stand there, you feel embarrassed. It should have occurred to you in the first place that it would be a waste of time and resources removing lactation from someone who doesn’t lactate in the first place. All you’ve done is made yourself look and feel rather foolish.", parse);
	}
	Text.Flush();
	
	terry.flags["lact"] = 0;
	terry.SetLactation();
	
	Scenes.Jeanne.InteractPrompt();
}

Scenes.Terry.JeanneTFGrowVag = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		tcockDesc  : function() { return terry.MultiCockDesc(); },
		hand       : function() { return terry.HandDesc(); }
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.FirstVag()) {
		Text.Add("Terry gasps, [hisher] hands darting to [hisher] pussy and barely making it before the [foxvixen] cums with a cry. Squirt after squirt of feminine fluids flowing from between [hisher] legs like a perverted cascade.", parse);
		if(terry.HorseCock())
			Text.Add(" [HisHer] equine pecker erupts cum above, bobbing in a lewd fountain almost as messy as [hisher] feminine half.", parse);
		else if(terry.FirstCock())
			Text.Add(" [HisHer] cock spurts rope after rope of seed down to join [hisher] feminine half in sympathetic orgasm.", parse);
		Text.NL();
		Text.Add("The [foxvixen] continues being stuck in perpetual orgasm for a while longer, until [hisher] legs finally give out and [heshe] collapses to [hisher] knees on the puddle of [hisher] own making. A few more spurts of female juices and [heshe] finally stops. <i>“D-Damn...”</i>", parse);
		Text.NL();
		Text.Add("[HeShe] can certainly say that again; that looked like one intense orgasm. Still, it seems that the intended effect won’t work anymore; Terry’s only ever going to have the one vagina, it looks like.", parse);
	}
	else {
		Text.Add("Terry groans, holding [hisher] crotch as it heats up, rubbing [hisher] slender thighs together. <i>“Hot! Hot! Hot!”</i> [heshe] cries out, falling to [hisher] knees.", parse);
		Text.NL();
		Text.Add("You quickly move to catch [himher], one arm around [hisher] shoulder, asking if [heshe]’s alright and to let you see what’s happening to [himher]. [HeShe] wriggles and mewls, but eventually you manage to get [himher] on [hisher] back and spread [hisher] legs so that you can see what is happening. Lifting [hisher] [tcockDesc] out of the way, you watch as the flesh underneath [hisher] balls dimples and ripples, a vertical line of pink flesh rising through the fur before suddenly parting, Terry crying out as wet fluid gushes from the new opening.", parse);
		Text.NL();
		Text.Add("Motivated by curiosity, you reach in with a finger, gently running it down the soft, delicate-looking folds of the [foxvixen]’s new netherlips. Terry wriggles and threshes, mewling in pleasure, and you become aware of [hisher] cock jutting eagerly from its sheath... and, more importantly, of a stiff little clitoris just barely peeking out of its hood at the top of Terry’s new pussy.", parse);
		Text.NL();
		Text.Add("You can’t resist touching it, squeezing it gently between forefinger and thumb and rolling it between your digits. This is evidently the last straw for Terry; the [foxvixen] lets out a barking cry of pleasure and veritably gushes femcum from [hisher] new pussy, a great wet squirt of juices splashes against the your [hand]s and the floor, followed by a couple more weak squirts as [heshe] collapses, exhausted for the moment.", parse);
		Text.NL();
		Text.Add("Looking at the great mess that Terry has made, you can’t help shaking your head and quipping that it looks like [hisher] new equipment is working just fine. Out of the corner of your eye, you can see Jeanne smirking before she twitches her fingers, making the fluids roll and seep off of Terry’s body and yours alike, creeping along the floor in a great puddle before rising up and pouring itself into an open bottle that comes floating through the air to meet it.", parse);
		terry.flags["vag"] = Terry.Pussy.Virgin;
	}
	Text.Flush();
	
	terry.SetPussy();
	
	var cum = terry.OrgasmCum();
	
	Scenes.Jeanne.InteractPrompt();
}

Scenes.Terry.JeanneTFRemVag = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		tcockDesc  : function() { return terry.MultiCockDesc(); },
		horse      : terry.HorseCock() ? "horse" : ""
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.FirstVag()) {
		Text.Add("<i>“Ugh!”</i> Terry falls to [hisher] knees, holding [hisher] crotch. [HeShe] moans, falling on [hisher] hands and knees.", parse);
		if(terry.FirstCock())
			Text.Add(" From your vantage you can see that Terry’s [horse]cock is already at full mast, throbbing and spewing pre like a faucet.", parse);
		Text.NL();
		Text.Add("You move to kneel behind [himher], lifting [hisher] tail out of the way as you watch the last moments of Terry’s pussy. You can see its netherlips flexing and wrinkling, shudders wracking the [foxvixen]’s body before [heshe] lets out a barking cry as it squeezes shut, fluid spurting wetly between its folds even as they dwindle away, shrinking into [hisher] fur until it is lost forever.", parse);
		Text.NL();
		if(terry.FirstCock()) {
			Text.Add("Terry’s [tcockDesc] visibly bulges before erupting, spraying semen across the floor to join the puddle of feminine fluids already there.", parse);
			Text.NL();
			parse["more"] = terry.sex.birth > 0 ? " any more" : "";
			Text.Add("The [foxvixen] groans, <i>“Guess I don’t have to worry about having[more] babies now.”</i>", parse);
			Text.NL();
			Text.Add("[HeShe] most certainly doesn’t.", parse);
		}
		else {
			Text.Add("The now flat, featureless expanse of Terry’s crotch suddenly bulges alarming, fur stretching into three indistinct shapes; one oval, two rounded. Within seconds, they reshape themselves into something clearer; two dangling, dainty balls, much like the ones Terry originally had. The identity of the third shape becomes clear when a throbbing, crimson-fleshed fox prick thrusts its quivering shape out of the opening at its end, spraying semen into the puddle of sexual fluids below the [foxvixen]’s form.", parse);
			Text.NL();
			Text.Add("<i>“Hey there, old buddy,”</i> [heshe] says, touching [hisher] sensitive foxhood.", parse);
			Text.NL();
			Text.Add("You can’t resist asking if Terry wants you to leave the two of them alone to ‘get reacquainted’. [HeShe] just looks at you disdainfully.", parse);
			
			terry.flags["cock"] = Terry.Cock.Regular;
			terry.SetCock();
		}
	}
	else {
		Text.Add("A few moments tick by, and absolutely nothing happens. There’s not even the slightest hint of stirring from the [foxvixen]’s [tcockDesc]. Terry simply gives you a noncommittal shrug, whilst you feel very foolish about using a vagina-removing suppository on someone who doesn’t have a vagina to remove.", parse);
	}
	Text.Flush();
	
	terry.flags["vag"] = Terry.Pussy.None;
	terry.SetPussy();
	
	Scenes.Jeanne.InteractPrompt();
}

Scenes.Terry.JeanneTFGrowCockEntrypoint = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen")
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Add("Terry’s whole body quakes with violent tremors, the [foxvixen] letting out a high-pitched cry as [hisher] legs fail [himher], sending [himher] pitching down onto [hisher] knees. Eyes screwed closed, whimpering, [heshe] rubs frantically at [hisher] loins, just above [hisher] pussy.", parse);
	Text.NL();
	Text.Add("As you watch, the flesh over Terry’s cunt begins to bulge and bloat, swelling into an oval-shaped mass. Finally, [heshe] wraps [hisher] fingers around it and its tip splits apart, revealing something crimson-colored and conical in shape jutting from the interior of what is clearly [hisher] new sheath. Curling [hisher] fingers around it, Terry strokes away in an almost trance-like state, coaxing centimeter after centimeter of turgid flesh from its depths. Its base begins to swell, bloating into the iconic vulpine knot, engorged and clearly ready to be used to anchor Terry to someone. But after that happens... nothing else happens.", parse);
}

Scenes.Terry.JeanneTFHorsegasmEntrypoint = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		tcockDesc  : function() { return terry.MultiCockDesc(); },
		tbreastDesc : function() { return terry.FirstBreastRow().Short(); }
		
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Add("Terry immediately falls to [hisher] knees, hands darting to stroke [hisher] already engorged [tcockDesc]. Knot already fully formed, all [heshe] needs is a small touch on [hisher] inflated thickness to send forth a veritable geyser of jism. And once [heshe]’s begun you know there’s just no stopping [himher]. [HisHer] equine endowment never stops spewing gob after gob of cum, even as [heshe] gets the brilliant idea to lean over and take the flared tip of [hisher] horse-cock into [hisher] foxy muzzle. In the end [heshe] winds up blasting [hisher] own face with spunk, not that [heshe]’d care at this point, and though [heshe] does [hisher] best to suckle it all, in reality most of the spent juices wind up on [hisher] body rather than [hisher] muzzle.", parse);
	if(terry.FirstVag())
		Text.Add(" Somewhere in [hisher] continuous climax, Terry’s pussy’s decided to make its own contribution to the mess, by squirting some femcum down below, between the [foxvixen]’s legs.", parse);
	Text.NL();
	Text.Add("You watch as the semen-hose masquerading as a [foxvixen] slowly comes to a halt, [hisher] perversely equine cock slapping wetly against [hisher] [tbreastDesc] and lying slack on [hisher] visibly bulging belly. You slowly scrape a stray bead of semen off of your cheek and ", parse);
	if(player.Slut() >= 60)
		Text.Add("suck it off your finger, savoring the taste of it in your mouth.", parse);
	else
		Text.Add("flick it dismissively aside.", parse);
	Text.Add(" You ask Terry if [heshe] thinks [heshe]’s done now, to which the tired, seed-soaked [foxvixen] simply gives you a dizzy grin and nods sheepishly. Even as you say this, you look over [hisher] now-flaccid horse-cock; it doesn’t look to have changed at all.", parse);
}

Scenes.Terry.JeanneTFGrowCock = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		tcockDesc  : function() { return terry.MultiCockDesc(); }
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.flags["cock"] == Terry.Cock.None) {
		Scenes.Terry.JeanneTFGrowCockEntrypoint();
		Text.NL();
		Text.Add("The [foxvixen] pants, fapping like [hisher] life depended on it. <i>“Hah… c-can’t cum!”</i> [heshe] exclaims, desperation apparent in [hisher] voice.", parse);
		Text.NL();
		Text.Add("Instinctively, you close the distance and approach the [foxvixen]. Batting [hisher] hand away, you reach out to gently massage the base of [hisher] new sheath. With soft but insistent strokes your fingers move up and around. Terry shudders and lets out a deep, sighing moan, and a bulge of flesh suddenly forms at the base of [hisher] sheath. A suspicion of what it is prompts you to keep going, and when the effect repeats itself, thick ropes of precum starting to bubble from [hisher] cock. You’re certain of it: [heshe] now has balls again.", parse);
		Text.NL();
		Text.Add("Without a thought, you lift your hands from the base of Terry’s sheath and give [hisher] new cock a firm pump between your fingers.", parse);
		Text.NL();
		Text.Add("Terry cries out in pleasure as your touch brings [himher] to [hisher] climax. [HeShe] instinctively bucks against your grasp as rope after rope of fox-jism spurts from [hisher] newly grown fox-cock. A wet splash comes from underneath the [foxvixen] as [hisher] pussy achieves a sympathetic orgasm.", parse);
		Text.NL();
		Text.Add("Stepping back, you watch as the [foxvixen] collapses onto a puddle of [hisher] own making. [HeShe] sighs in relief. <i>“Ah… I thought I was going to explode.”</i>", parse);
		Text.NL();
		Text.Add("Looking at the sheer mess of Terry’s climax, you can’t resist quipping that you wouldn’t say [heshe] didn’t.", parse);
		
		terry.flags["cock"] = Terry.Cock.Regular;
		terry.SetCock();
	}
	else if(terry.flags["cock"] == Terry.Cock.Regular) {
		Text.Add("Terry immediately falls to [hisher] knees, furiously fapping at [hisher] fox-cock as it reaches its fully engorged state, dripping pre. The knot inflates in record time and each time [hisher] paws connect with [hisher] knot [heshe] spews a long strand of fox-cum.", parse);
		if(terry.FirstVag())
			Text.Add(" The [foxvixen]’s pussy reacts in a similar manner, squirting small, but constant, gushes of fluids underneath, quickly forming a pool of female-scented arousal.", parse);
		Text.NL();
		Text.Add("The process continues for a short while longer, until Terry’s finished cumming. After [heshe]’s done [heshe] slowly climbs back to [hisher] feet, still a bit dizzy and wobbly from so many repeated orgasms. <i>“Damn… that was intense.”</i>", parse);
		Text.NL();
		Text.Add("You nod your head in agreement with [hisher] statement, but note that, despite that, Terry’s [tcockDesc] doesn’t look any different. It seems Jeanne’s suppository is only good for restoring a removed cock, not for adding new ones or increasing its size.", parse);
	}
	else { // Horsecock
		Scenes.Terry.JeanneTFHorsegasmEntrypoint();
	}
	Text.Flush();
	
	var cum = terry.OrgasmCum();
	
	Scenes.Jeanne.InteractPrompt();
}

//TODO
Scenes.Terry.JeanneTFRemCock = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen")
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.FirstCock()) {
		if(terry.HorseCock()) {
			Text.Add("The [foxvixen] arches [hisher] back, eyes screwed shut as [hisher] equine endowment thrusts from [hisher] sheath. It visibly throbs, knot swelling as if tying with some ethereal pussy, and then, with a body-wracking shudder, Terry cums. A great gout of semen sprays from its flared head, splashing messily across the floor, and then its underside bulges before it fires a second shot, and then a third, each as large as the one before.", parse);
			Text.NL();
			Text.Add("After its third shot, however, it stops firing; a steady flow of cum seeps slowly from its head, but nothing else seems to be coming out. Terry wriggles and moans, delirious with the pleasure of the transformative running through [hisher] system. If you let this run its course you’re going to be stuck here until tomorrow, and considering Terry is in no shape to try and fix this [himher]self, it seems you’ll have to do something about it yourself.", parse);
			Text.NL();
			Text.Add("Crossing the distance between you both, you seat yourself behind the [foxvixen] and pull [himher] into your lap, reaching around to take hold of the horse-cock as it throbs away in [hisher] lap. You can feel that it’s shrunk, shorter and thinner now than it was before.", parse);
			Text.NL();
			Text.Add("Moving your fingers to its inflated knot and gripping the bloated bulge of flesh with your hand, you caress it. Slowly you massage it against your palm with smooth, even motions. Terry moans like a whore in heat, thick spurts of cum geysering from [hisher] flare, each climactic outburst causing [hisher] knot to shrink a little bit in your hand, until finally it disappears, leaving [himher] with just a normal horse-cock.", parse);
			Text.NL();
			Text.Add("Smiling, your hand glides in a long, slow stroke up Terry’s shaft, not stopping until you reach the flared tip. Your fingers trace circles around the bulging flesh, rubbing every bump and wrinkle, teasing out great jets of semen that spill down [hisher] length. Looking over Terry’s shoulder confirms what your fingers are telling you; Terry’s dick is shrinking, and quite rapidly, inches vanishing with every spurt of seed.", parse);
			Text.NL();
			Text.Add("Stroke by stroke and spurt by spurt, Terry’s cock keeps dwindling from its former impressive size to something even more puny than [hisher] original vulpine dick, just barely big enough to fit outside its sheath now. Moved by impulse, you reach out and gently tuck the now micro-dick away inside of the sheath, one final pathetic spurt of semen erupting from between its fleshy lips as if in weak protest of its fate. Your fingers move to pinch the sheath’s lips shut, rubbing it back into Terry’s loins and feeling it seep away into the flesh of [hisher] loins until there’s nothing there.", parse);
			Text.NL();
			Text.Add("Terry’s balls remain, dangling lonely in their former space, and you move to cup them, fondling them and rolling them around in your palm, feeling them shrink smaller and smaller until they have receded totally into Terry’s body, leaving a blank space where [hisher] cock was.", parse);
			Text.NL();
			parse["vag"] = terry.FirstVag() ? Text.Parse(", apart from [hisher] pussy, of course", parse) : "";
			Text.Add("As your [foxvixen] pants heavily for breath, you give [himher] a moment’s support, then gently wriggle your way out from under [himher] once it looks like [heshe] can support [himher]self. As [heshe] continues catching [hisher] breath, you walk back around to [hisher] front, so you can properly examine [hisher] new state. Sure enough, it’s totally smooth and blank[vag].", parse);
		}
		else {
			Text.Add("The [foxvixen] arches [hisher] back, eyes screwed shut as [hisher] vulpine dick thrusts from [hisher] sheath. It visibly throbs, knot swelling as if tying with some ethereal pussy, and then, with a body-wracking shudder, Terry cums, spraying [hisher] usual meager splash of semen across the floor. Instead of going limp, however, it sprays again, and then again, multiple orgasms wracking the vulpine-morph in quick succession.", parse);
			Text.NL();
			Text.Add("But as [heshe] barks and whimpers in pleasure, you can see something surprising happening; Terry’s dick is growing smaller, inch after inch dwindling down until only the barest nub of a dick is poking out of [hisher] sheath. Then, with one final thigh-spattering splash of semen, it vanishes inside of [hisher] sheath, which seems to melt away into Terry’s body. Balls dwindle, as if being sucked into Terry’s pelvis from the inside out, and are likewise gone.", parse);
		}
		
		terry.flags["cock"] = Terry.Cock.None;
		terry.SetCock();
		
		Text.NL();
		Text.Add("Terry rubs [hisher] smoothened crotch, exhaling a sigh as the last tickles of pleasure fade. <i>“Well, I guess I’m a bit less male now...”</i>", parse);
		if(!terry.FirstVag()) {
			Text.NL();
			Text.Add("Your vulpine pet isn’t left a neuter for long; moaning in pleasure, you watch [hisher] now-blank loins beginning to puff and swell, shaping into the unmistakably feminine form of a daintily puffy mons. Pink flesh pushes through the fur in a vertical line, then suddenly peels open in a great squirt of translucent fluid, the ecstatic howl escaping Terry’s lips making you very certain as to what it is.", parse);
			Text.NL();
			Text.Add("Terry has grown [himher]self a brand new pussy to replace [hisher] old cock!", parse);
			
			terry.flags["vag"] = Terry.Pussy.Virgin;
			terry.SetPussy();
		}
		
		var cum = terry.OrgasmCum();
	}
	else {
		parse["lust"] = (terry.LustLevel() >= 0.5 || terry.Slut() >= 60) ? " beyond usual" : "";
		Text.Add("Both you and Terry wait patiently, but nothing happens. There’s simply no alteration in the [foxvixen]. No stirring on [hisher] pussy, not even a tickle of arousal[lust]. After a few moments, Terry simply gives you a noncommittal shrug, whilst you feel very foolish about using a penis-removing suppository on someone who doesn’t have a penis to remove.", parse);
	}
	Text.Flush();
	
	Scenes.Jeanne.InteractPrompt();
}

Scenes.Terry.JeanneTFGrowHorsecock = function() {
	var parse = {
		playername : player.name,
		pheshe     : player.heshe(),
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		paternalMaternal : player.mfTrue("paternal", "maternal")
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.HorseCock()) {
		Scenes.Terry.JeanneTFHorsegasmEntrypoint();
		
		Text.Flush();
		var cum = terry.OrgasmCum();
		
		Scenes.Jeanne.InteractPrompt();
		return;
	}
	
	if(terry.FirstCock()) {
		Text.Add("Terry groans, falling to [hisher] knees as a dizzy spell threatens to knock [himher] off balance. <i>“T-Tight!”</i>", parse);
		Text.NL();
		Text.Add("You watch as the [foxvixen] sits down and spread [hisher] legs to let you watch as [hisher] balls churn. The tip of [hisher] cock pokes out from its sheath as a small rope of cum spews forth, even before [hisher] cock has a chance to grow into a proper erection.", parse);
		Text.NL();
		Text.Add("With the pressure of the seed churning within [hisher] balls, Terry’s cock sprouts like lightning into a full-fledged erection, knot bulging out with the need to anchor. The shaft throbs visibly, its base bulging as a great spurt of semen forces its way up and out [hisher] glans, far larger than the last. Looking a little further down, you can see [hisher] balls throbbing in sympathy, almost visibly churning up more and more cum, bloating to twice their original size from the sheer volume of seed crammed into them.", parse);
	}
	else {
		Scenes.Terry.JeanneTFGrowCockEntrypoint();
		
		Text.NL();
		Text.Add("<i>“Huh? Is that it?”</i> the [foxvixen] asks, stopping [hisher] masturbation and sitting down to look at [hisher] turgid cock throb.", parse);
		Text.NL();
		Text.Add("A gob of pre forms on the pointy tip, falling to the ground as Terry groans, <i>“Ugh… I guess it isn’t over...”</i>", parse);
		Text.NL();
		Text.Add("Sitting on [hisher] haunches, the [foxvixen] spreads [hisher] legs, giving you a perfect view of [hisher] foxhood as it throbs. A few drops of pre slide along the erect shaft, down [hisher] knot and onto the floor.", parse);
		Text.NL();
		Text.Add("Before your eyes, the fur at the base of the [foxvixen]’s new cock starts to bulge, swelling out and taking the shape of what is unquestionably a new scrotum. They hit the size of Terry’s old balls, but keep on growing, expanding until they are easily twice the size of the [foxvixen]’s original dainty testes. Terry shudders, moaning softly as they almost visibly churn, bulging with frothing new [foxvixen]-seed. The semen inside builds in pressure until it is forcing its way up Terry’s shaft, a bulge visibly traveling its underside before a great ropy strand of seed spews from its tip.", parse);
	}
	Text.NL();
	Text.Add("Terry cries out, [hisher] cock bulging out, veins on display, pumping into [hisher] shaft as [heshe] suddenly grows harder than you thought possible.", parse);
	Text.NL();
	Text.Add("Before your eyes, Terry’s cock begins to bulge, swelling in girth wider and wider, [hisher] knot being absorbed by the growing flesh until it disappears altogether. Only after it has grown so wide does the outward swelling stop, the cock pulsing with pent-up need. Terry mewls and shudders, bucking [hisher] hips in unconscious need, and with each thrust, [hisher] tip grows flatter and flatter. Soon, it’s no longer pointy at all, but blunt and roughly circular; the more you look at it, the more it looks like a horse’s cock, flare and all.", parse);
	Text.NL();
	Text.Add("A cry of ecstasy wrings its way from the [foxvixen]’s throat as a small spurt of seed shoots from [hisher] now flat, flared tip. It splashes almost meekly onto the floor, and then a second spurt erupts, and then a third, meager ropes of seed trailing across the floor.", parse);
	Text.NL();
	Text.Add("The transformative is clearly still at work, however; each spurt of seed makes Terry’s cock grow just a little bit bigger, a little bit fatter. Inch by inch it slowly swells outwards, bloating longer and longer. When the volley of semen ropes finally dwindles away into a seeping trickle, the panting [foxvixen]’s sheath is visibly distended around [hisher] new phallic girth. There’s no question what [heshe]’s now sporting is an equine cock, at least three times its original length and almost three times as thick as it once was. Colored the same bright crimson as Terry’s old cock, the bobbing shaft is incredibly eye-catching, drawing attention with color and size and girth.", parse);
	Text.NL();
	Text.Add("The [foxvixen] pants with the effort, [hisher] sheath slowly growing more and more accustomed to the girth of [hisher] new horsecock. <i>“D-Damn! It’s not over!”</i> [HeShe] cries out as [hisher] cock slowly changes color, the bright crimson fading into a more subtle pink coloration, dulling out so as to not draw as much attention to [hisher] newly acquired equine endowment. Not that such a huge shaft would go unnoticed when it’s attached to Terry’s dainty body.", parse);
	Text.NL();
	Text.Add("As if in response to your thoughts, the colors of Terry’s dick keep on changing, shifting from its former pearly pink shade to a mottled brown color that is more like something you’d associate with a horse’s dick. It looks like you spoke too soon; this darker color seems to make it stand out even more against Terry’s white and gold fur than it did when it was bright red.", parse);
	Text.NL();
	Text.Add("Before your eyes, the straining flesh of Terry’s sheath begins to grow, creeping forward and stretching wider as it does. Soon, it has enveloped the base of the new horse-like cock, properly sized to fit, and making it match [hisher] body much more smoothly. Looking at the pulsing erection, you feel compelled to touch it and see for yourself how well Terry responds.", parse);
	Text.NL();
	Text.Add("Deciding to give in to your curiosity, you circle Terry and seat yourself on the floor behind [himher]. Once comfortable, you unceremoniously pull the [foxvixen] into your lap, one arm curling around [hisher] waist to hold [himher] there and the other hand reaching eagerly into [hisher] lap and the new toy that awaits you there.", parse);
	Text.NL();
	Text.Add("<i>“Ah! Wait!”</i> the [foxvixen] protests as you encircle [hisher] shaft, slowly stroking along its length, milking pre as it seeps like a faucet. You eagerly divert your caress to [hisher] flat tip, rubbing the sensitive glans as Terry cries out in pleasure, more bogs of pre forming, which you quickly swipe to rub along [hisher] shaft. <i>“C-Can’t cum!”</i>", parse);
	Text.NL();
	Text.Add("As Terry bucks madly into your hand, unthinkingly rutting you in [hisher] magically-induced rut, you can’t help but rub [hisher] new shaft, trying to help the [foxvixen] achieve release. Strange... there’s some sort of bulge growing down near the base of [hisher] dick...", parse);
	Text.NL();
	Text.Add("Curious, you continue to rub and stroke it, feeling it continuing to bloat outwards in mimicry of the flaring tip, and you realise what it is: the shift from vulpine to equine evidently wasn’t total. Terry’s growing a brand new knot! And quite a knot, at that; as you continue to molest it, it bloats into a monster easily the size of a grapefruit, though fortunately that seems to be as big as it’s going to get.", parse);
	Text.NL();
	Text.Add("Semen drools thick and heavy over your stroking fingers, Terry gasping and whimpering, trembling so hard you can feel it. It doesn’t look like [heshe]’s going to last much longer... Abandoning Terry’s cock, your hand reaches for [hisher] newly-bloated balls, which show no sign of shrinking despite the copious amounts of seed leaking from Terry’s new endowment. You caress the bulging orbs with your fingers, rolling them into your palm as best you can and fondling them, feeling their liquid contents churn and boil inside them.", parse);
	Text.NL();
	Text.Add("That seems to be it, as Terry arches [hisher] back and howls in ecstasy, erupting like a perverse volcano as [hisher] new balls eagerly empty themselves. Great waves of semen, any one of which would have put [hisher] old climaxes to shame, erupt from the flaring tip, vomiting in a fountain of off-white. What feels like minutes slips by before finally Terry’s new dick belches its last hands-filling gobbet of seed and falls limp... well, as limp as it can, with the knot swollen at its base, preventing Terry’s sheath from sucking it back inside.", parse);
	Text.NL();
	Text.Add("With a huge sigh of release, Terry slumps back against you, going limp in your lap due to how spent [heshe] is, head falling down and resting [hisher] chin on [hisher] chest. You adjust the [foxvixen] on your lap, so [heshe] can have some proper rest.", parse);
	Text.NL();
	Text.Add("You glance over at Jeanne, who took the brunt of Terry’s climax. The magician is soaked in the fox’s cum, long strands hanging from her hat and dripping down her cleavage. She looks relatively unconcerned, if a little surprised. With a small gesture and a few whispered words, the white goop is swept up by her magic, gathering into a rather large floating blob. Another flick of her wrist, and a vial drifts lazily over to the base of the blob, which vanishes inside of it before it caps itself off. She deftly plucks it from the air and stows it away inside of her pocket, clearly intending to make use of it somehow.", parse);
	Text.NL();
	Text.Add("<i>“Well, that was certainly... interesting. Quite a show your little [foxvixen] put on, [playername],”</i> the elven mage comments.", parse);
	Text.NL();
	Text.Add("[HeShe] most certainly did, you reply. ", parse);
	if(player.Slut() >= 60)
		Text.Add("An almost [paternalMaternal] wave of pride fills you at just how much of a show your little pet gave you; you can’t wait to see what [heshe] can do with this new dick after some more training.", parse);
	else
		Text.Add("You wriggle in embarrassment, feeling the guilt of soaking Jeanne washing over you like an icy shower. If this new productivity is going to be staying, sex is going to get a bit more embarrassing in the future.", parse);
	Text.NL();
	Text.Add("It takes the better part of an hour before Terry is well enough to get back on [hisher] feet. [HeShe] examines [hisher] new sheath and balls, both much bigger, and fuller, than [hisher] original set. <i>“Dammit, [playername]. You can’t keep changing and transforming me like I’m some kind of toy,”</i> [heshe] pouts.", parse);
	Text.NL();
	Text.Add("<i>“I did not hear you complain over all the screaming about how good it felt, nor when you were on all fours getting done in the butt by [playername],”</i> Jeanne states nonchalantly. <i>“You also did not protest when [pheshe] brought up the idea.”</i>", parse);
	Text.NL();
	Text.Add("Smiling, you agree to Jeanne’s observations.", parse);
	Text.NL();
	Text.Add("<i>“I… umm...”</i>", parse);
	Text.NL();
	Text.Add("Looks like Terry is at a loss for words. ", parse);
	if(terry.Relation() < 30) {
		Text.Add("With a friendly grin, you give the [foxvixen] a playful clap on the shoulder, assuring [himher] that [heshe]’ll grow to enjoy [hisher] new toy, if [heshe] gives it a chance.", parse);
		Text.NL();
		Text.Add("The [foxvixen] huffs indignantly, looking away.", parse);
	}
	else if(terry.Relation() < 60) {
		Text.Add("Smiling, you close the distance and draw Terry to you, wrapping your arms around [himher] in an affectionate hug. The new cock really looks great on [himher], you assure the [foxvixen].", parse);
		Text.NL();
		Text.Add("<i>“Thanks. It’s… pretty sensitive, I guess. It’ll take some getting used to.”</i>", parse);
		Text.NL();
		Text.Add("That may be, but you’re sure [heshe]’ll get used to it in record time.", parse);
	}
	else {
		Text.Add("You simply can’t resist, Terry’s face lighting up with glee as you pull the [foxvixen] into a warm hug, feeling [himher] melting against you as your lips claim [hishers]. As your bodies tangle, you can feel the new equine dick hanging between [hisher] legs poking against you. Breaking the kiss, you smirk and quip that you have a feeling it won’t be long before Terry starts to enjoy [hisher] new equipment.", parse);
		Text.NL();
		Text.Add("The [foxvixen] grins. <i>“I just hope you’re ready to deal with the responsibility that comes attached with giving me this big cock. I already have an idea about what I’d like it used for,”</i> Terry says, licking [hisher] lips.", parse);
		Text.NL();
		Text.Add("That’s the spirit; [heshe]’s getting the hang of things already. To celebrate, you decide to kiss [himher] again, enjoying the almost purring sound of pleasure that rumbles up [hisher] throat as [heshe] melts against you. After a few pleasant moments, you release the [foxvixen], who actually pouts at being let go.", parse);
	}
	Text.Flush();
	
	terry.flags["cock"] = Terry.Cock.Horse;
	terry.SetCock();
	
	world.TimeStep({hour: 1});
	var cum = terry.OrgasmCum();
	
	Scenes.Jeanne.InteractPrompt();
}


Scenes.Terry.SexWorship = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		boygirl    : terry.mfPronoun("boy", "girl"),
		guygirl    : terry.mfPronoun("guy", "girl"),
		tongueDesc : function() { return player.TongueDesc(); },
		breastsDesc : function() { return player.FirstBreastRow().Short(); },
		tbreastDesc : function() { return terry.FirstBreastRow().Short(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		buttDesc : function() { return player.Butt().Short(); },
		anusDesc : function() { return player.Butt().AnalShort(); },
		skinDesc : function() { return player.SkinDesc(); },
		bellyDesc : function() { return player.StomachDesc(); },
		vagDesc : function() { return player.FirstVag().Short(); }
	};
	parse = terry.ParserPronouns(parse);
	
	parse["stuttername"] = player.name[0] + "-" + player.name;
	
	parse["s"]    = player.NumCocks() > 1 ? "s" : "";
	parse["notS"] = player.NumCocks() > 1 ? "" : "s";
	parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
	
	Text.Clear();
	Text.Add("Your gaze falls upon the long length of mottled-brown horseflesh bobbing between your [foxvixen]’s legs, and a smirk curls your lips. Your hand reaches forward and possessively twines its fingers around the turgid flesh, tightening just enough to hold it firm against your palm.", parse);
	Text.NL();
	Text.Add("<i>“Ack! Watch it!”</i> the [foxvixen] gasps in surprise at your sudden lunge. <i>“What are you-”</i>", parse);
	Text.NL();
	Text.Add("A single finger from your free hand pressed firmly against [hisher] lips interrupts the [foxvixen]‘s protests. Looking [himher] firmly in the eye, you tell [himher] a single word, your tone blunt and clear, your expression brooking no argument.", parse);
	Text.NL();
	Text.Add("<i>“Sit.”</i>", parse);
	Text.NL();
	Text.Add("Terry doesn’t protest, [heshe] just looks at you in silence and immediately complies with your command. Your tone commanding such obedience that even if the [foxvixen] wasn’t wearing [hisher] collar [heshe] would have obeyed without question. Using [hisher] hands for support, the [foxvixen] sits down where [heshe] stands, spreading [hisher] legs to allow you access.", parse);
	Text.NL();
	Text.Add("Smiling, you nod your head in pride, an acknowledgement of what a good [boygirl] [heshe] just was, and kneel down in smooth, graceful motions, every step showing that you are in command. Confident that Terry is yours now, you turn your attention fully to the prize pulsing so warmly in your grip...", parse);
	Text.NL();
	Text.Add("Terry’s cock is a proud pillar of stallionflesh, over a foot long and nearly three inches thick. Your fingers twitch, kneading the sensitive dickmeat you are holding even as your palm begins to rise and fall. With each pass you squeeze and caress, lovingly milking the [foxvixen]’s prick in a smooth, steady rhythm. Hot, thick precum wells from its blunt tip, Terry whimpering in pleasure as you grope [hisher] sensitive cock, the liquid proof of [hisher] arousal slowly drooling down over your fingers.", parse);
	Text.NL();
	Text.Add("The scent of [hisher] lust tingles in your nose, a strong and enticing musk that makes you shuffle closer, allowing your [tongueDesc] to slide between your lips. Gently you flick the very tip of [hisher] cock, short and quick dabs with the tip of your tongue that tickle Terry’s cumslit and let you catch the tantalising sweet-salt of precum on your tongue.", parse);
	Text.NL();
	Text.Add("You spare a glance at Terry, to see how well you’re being received by the petite [foxvixen]. [HeShe]’s looking straight at you, lovingly nipping the flared tip of [hisher] member, eyes glazed in lust as [heshe] pants expectantly. Each lick sending a shudder of enjoyment rattling through [hisher] body. It’s good that you made [himher] sit; [hisher] cute little toes are all curled up, and [hisher] legs are shaking so much that you doubt [heshe] would remain upright, if [heshe] was still standing.", parse);
	Text.NL();
	Text.Add("Your tongue ceases playing with the helpless [foxvixen], withdrawing into your mouth as you stop stroking. You gently place your free hand on Terry’s left thigh and softly stroke it, running your fingers through [hisher] soft, fine white fur as you murmur quietly to the [foxvixen]. You exhort [himher] to calm down, to relax; that’s a good [boygirl], [heshe]’s a good [foxvixen]...", parse);
	Text.NL();
	if(terry.Relation() < 30) {
		Text.Add("<i>“Don’t treat me like I’m your - hah! - pet. I’m not… hmm… not...”</i> [heshe] trails off. <i>“L-Look, this cock… my cock, is very sensitive. When you keep teasing me like that, it’s really hard for me to keep control. But I’ll try, I guess.”</i>", parse);
		Text.NL();
		Text.Add("You smile pleasantly and nod your approval. It’s more fun playing with [himher] when [heshe] tries not to just give in straight away...", parse);
	}
	else if(terry.Relation() < 60) {
		Text.Add("<i>“Shit, you might as well as have asked me to lift the world. You know how sensitive I am down there. Plus you look incredibly hot when you go down on me like that.”</i>", parse);
		Text.NL();
		Text.Add("Flattery will get [himher] places, you assure the [foxvixen], but if [heshe] can crack jokes, then [heshe] can calm down and give you a chance to really blow [hisher] mind.", parse);
		Text.NL();
		Text.Add("<i>“Okay, I suppose I can try. But no promises,”</i> [heshe] smiles.", parse);
		Text.NL();
		Text.Add("You don’t need them anyway; you know [heshe]’ll come through.", parse);
	}
	else {
		Text.Add("<i>“Tough to calm down when your lover is being so unbelievably hot by going down on you,”</i> the [foxvixen] smirks. <i>“Plus, I’m pretty sensitive down there. You should know that.”</i>", parse);
		Text.NL();
		Text.Add("Ignoring the fact [heshe] has a point, you smirk and ask if [heshe]’s saying [heshe]’s too weak to deal with a little pleasure, hmm?", parse);
		Text.NL();
		Text.Add("<i>“Well, maybe <b>I</b> should give you a similar treatment. Let’s see how <b>you</b> hold up when I’m the one in control,”</i> [heshe] pouts.", parse);
		Text.NL();
		Text.Add("You’ll look forward to it, you assure [himher]. But, right now, this is supposed to be [hisher] time... and you’re not moving until [heshe] gets [himher]self under control.", parse);
		Text.NL();
		Text.Add("Terry sighs, <i>“You drive a hard bargain, [playername]. But alright, I’ll try.”</i>", parse);
		Text.NL();
		Text.Add("As if you ever doubted [heshe] would.", parse);
	}
	Text.NL();
	Text.Add("Terry closes [hisher] eyes, inhaling and exhaling softly, the trembling slowly ceasing. You pet the [foxvixen]’s thigh in approval, then your head lunges forward. Your tongue’s tip thrusts itself against the tip of Terry’s cock, worming its way into the urethra as best it can and wriggling ticklishly inside [hisher] cumvein before your mouth closes over it. Your fingers slide down Terry’s shaft to caress and knead the churning balls, stroking the fluffy seed-factories even as you withdraw your tongue, allowing a great spurt of precum to wash over your lips and into your mouth. Wetly you slurp your mouth off of Terry’s shaft, lips sealing [hisher] precum inside, and abandon [hisher] balls to wriggle closer.", parse);
	Text.NL();
	Text.Add("You grind yourself into Terry’s lap, loins to loins. ", parse);
	if(player.FirstCock()) {
		Text.Add("Your [multiCockDesc] rub[notS] against the [foxvixen]’s own shaft, flesh throbbing against flesh. You hump and grind, effectively frotting Terry’s equine shaft, feeling the tingle race over your loins - every ridge, every vein on [hisher] stallionhood registering as you clamber up Terry’s body, sending jolts of pleasure coursing through your cock[s].", parse);
	}
	else {
		Text.Add("Your [vagDesc] burns as you grind its folds against Terry’s dick, the thick [foxvixen]-prick spreading you and grinding against you. Your juices drool over the heated flesh, filling you with an ache to properly envelop Terry in your depths, but you force it aside; you have other things in mind. Still, you can’t help but cling to Terry’s hips with your own even as you slide your torso up the length of Terry’s body.", parse);
	}
	Text.NL();
	Text.Add("Face to face with your lover, you thrust your lips against the [foxvixen]’s, pressing your face inescapably against [hishers]. Your lips part and your tongue pushes into Terry’s mouth, allowing you to guide most of the precum filling your mouth into [hishers], even if some leaks down over [hisher] chin and out of the corner of [hisher] mouth. Your tongue pushes firmly into [hisher] mouth, trying to pin [hisher] own tongue flat and ensure that your perverse meal is swallowed.", parse);
	Text.NL();
	if(terry.Slut() < 30) {
		Text.Add("Terry’s eyes bulge out in surprise as soon as [heshe] tastes [hisher] own pre. There is a muffled protest as you continue lathering the inside of [hisher] mouth with your helping, before you finally break the kiss. A thin strand of pre and saliva links your mouths to one another.", parse);
		Text.NL();
		Text.Add("[HeShe] coughs, spitting a wad of pre. <i>“Yuck! That was gross, [playername]!”</i>", parse);
		Text.NL();
		Text.Add("Ah, Terry; so naive and innocent... you really must do something more about fixing that. You simply grin back at [himher], confident [heshe]’ll eventually come to see things your way.", parse);
	}
	else if(terry.Slut() < 60) {
		Text.Add("Terry gags as soon as [heshe] tastes [himher]self on your tongue. There is a moment of hesitation, but [heshe] quickly recovers and begins kissing you back. You take the opportunity to baste [hisher] mouth with [hisher] own seed. It’s not long before you’ve emptied yourself and break the kiss. A thin strand of mixed pre and saliva linking your mouth to [hishers]. The [foxvixen] simply looks at you in confusion, unsure of what to do.", parse);
		Text.NL();
		Text.Add("Eyes half-closed, smouldering seductively as they stare into the baffled [foxvixen]’s own, your own [tongueDesc] slides slowly and deliberately from between your lips. You carefully lick the strand of mingled juices clear on your end, curling it purposefully into your mouth. Tilting your head, you swallow loudly, throat visibly flexing as you gulp down the fluid you took, a faint hum of pleasure bubbling up from between your lips.", parse);
		Text.NL();
		Text.Add("Following your lead, the [foxvixen] tilts [hisher] own head back and swallows, smacking [hisher] lips afterwards. <i>“...Good?”</i> [heshe] smiles nervously.", parse);
		Text.NL();
		Text.Add("Smiling proudly, you nod your head and confirm that’s very good.", parse);
	}
	else {
		Text.Add("Terry’s arms and legs are around you the moment your lips press to [hishers]. The [foxvixen] is completely unfazed by the taste of [hisher] own cum in your mouth, even as [hisher] own tongue pushes past your lips to help you feed [himher]. You take the opportunity to both explore and lather the inside of the [foxvixen]’s mouth, enjoying the act immensely before you finally have to break for a breath of fresh air.", parse);
		Text.NL();
		Text.Add("Your [foxvixen] lover regards you with a smile, opening [hisher] maw to let you see the seed you’ve deposited there. You only have an instant to appreciate the view though, as [heshe] quickly closes [hisher] mouth and tips [hisher] head back, an audible gulp signalling the act. Terry whimpers, eyes closed, as if you had just fed [himher] pure ambrosia. Then [heshe] looks at you at licks [hisher] lips, smacking them as [heshe] opens her muzzle so you can see that [heshe] did, indeed, drink everything.", parse);
		Text.NL();
		if(terry.Relation() < 60) {
			Text.Add("<i>“Delicious,”</i> is [hisher] single statement.", parse);
			Text.NL();
			Text.Add("A thrill runs down your spine at your kinky little [foxvixen]; [heshe]’s come a long way since [hisher] days as a blushing virgin. You feel arousal and pride pulse within you, all the more motivated to get back to your oh-so-pleasant task...", parse);
			player.AddLustFraction(0.4);
		}
		else {
			Text.Add("<i>“Hmm, that wasn’t bad. But you know I prefer yours, right?”</i> [heshe] asks, licking [hisher] lips provocatively.", parse);
			Text.NL();
			Text.Add("Shuddering at the spike of lust that suddenly pierces you, your words come out a mere whisper, so husky with lust is your tone, as you quip back that as flattering as you may find that, you think [heshe] looks absolutely irresistible no matter whose juices [heshe]’s sucking down.", parse);
			Text.NL();
			Text.Add("<i>“Then I guess you’ll just have to feed me more,”</i> [heshe] says, licking [hisher] lips again.", parse);
		}
	}
	Text.NL();
	parse["v"] = terry.FirstVag() ? Text.Parse(", mingling with the juices seeping from [hisher] neglected cunt", parse) : "";
	Text.Add("You grind your hips against Terry’s once more, then start to shuffle backwards, lowering your torso down until you are lying sprawled on your belly over Terry’s thighs, the engorged length of [hisher] shaft rising before you like a sacred pillar. The mottled brown has darkened with the blood rushing through it, the un-equine knot at its base bulging in arousal to match the flare of its glans. Precum runs thick and clear like a perverse waterfall down its length, pooling over [hisher] bulging balls[v].", parse);
	Text.NL();
	Text.Add("Lifting your neck slightly, you purse your lips and kiss Terry's cock right on its flat tip, noisily slurping as you dab it with your tongue and let the precum wash into your mouth. You lift your lips again and nuzzle [hisher] flare with the tip of your nose, then oh-so-gently close your teeth around it; just enough to let [himher] feel the pressure, but not enough to bruise the sensitive flesh.", parse);
	Text.NL();
	Text.Add("Your mouth moves down Terry’s cock, noisily smacking and slurping as you alternate kisses and licks, curling your tongue over [hisher] bulging veins and ridges until you reach [hisher] knot, which you start to suckle on, casting your eyes up to see Terry’s reaction.", parse);
	Text.NL();
	if(terry.Relation() < 60)
		Text.Add("<i>“[stuttername], if you keep that up - hng! - I’m gonna blow!”</i> the [foxvixen] cries, fingers digging on the ground as [heshe] tries [hisher] best not to blow.", parse);
	else
		Text.Add("<i>“lover-[boygirl], if you keep doing - hah! - that, little Terry wo- ooh! - won’t be able to hold back!”</i> the [foxvixen] cries, fingers digging on the ground as [heshe] tries [hisher] best not to blow.", parse);
	Text.NL();
	Text.Add("Whoa, hold it right there! You hold [hisher] cumvein shut with a finger.", parse);
	Text.NL();
	Text.Add("<i>“Ack! D-Don’t move so suddenly! Didn’t you hear my warning?”</i>", parse);
	Text.NL();
	Text.Add("Of course you did, that’s precisely why you’re holding this delicious piece of horse-fox meat shut. You’re not going to let [himher] cum without your say-so, you tell [himher] rubbing your fingertip over [hisher] urethra.", parse);
	Text.NL();
	Text.Add("The only reply the [foxvixen] can manage is a moan as [hisher] cock throbs in warning. [HeShe] wasn’t lying when [heshe] said [heshe] was close. Looks like Terry is only hanging in there by a thin line, just about to break… question is, how to push [himher] over? You could give [himher] a nice pasting with [hisher] own juices; you know what a cum-fountain this cock makes [himher] into... on the other hand, you could give yourself a nice hot cum-bath instead. Then again, why waste it? Why not let [himher] cum inside you; you’re pretty sure you could take [himher] balls deep before [heshe] blows...", parse);
	Text.Flush();
	
	world.TimeStep({hour: 1});
	
	//[HoseTerry] [Bukkake] [AnalCatch]
	var options = new Array();
	options.push({ nameStr : "Hose Terry",
		func : function() {
			Text.Clear();
			Text.Add("Your mind made up, you begin by giving [hisher] flare an experimental lick, cleaning up whatever trace of pre happened to be smeared by your prodding finger. It’s all for naught, for as soon as you remove your finger from [hisher] cumslit, a fresh batch of pre begins leaking down [hisher] shaft.", parse);
			Text.NL();
			Text.Add("Extending your [tongueDesc] you follow the trail below, tracing each little detour the guiding stream makes around Terry’s veins. You lick your way down the underside of [hisher] throbbing cock until you finally make contact with [hisher] sheath. Unfortunately, there’s no way you can work your way inside like this, so you settle for the next best thing. Terry’s swollen nuts.", parse);
			Text.NL();
			parse["vag"] = terry.FirstVag() ? ", seeping femjuices basting them from beneath" : "";
			Text.Add("The bulging orbs seem to ripple before your eyes this close up, soaked in precum pooling down over [hisher] stretched sack[vag]. Your tongue glides through soft, velvety fur, tasting them tentatively; salt-sweet from precum, a tinge of sweat, and Terry’s own particular musk rolling over your tastebuds.", parse);
			Text.NL();
			Text.Add("Unthinkingly you smack your lips, emboldened by the taste, and extend your tongue to taste more. Around and across you circle the [foxvixen]’s balls, curling ticklishly through the canyon between [hisher] nuts, feeling every ridge and ripple of flesh and muscle and fur pass under your probing [tongueDesc].", parse);
			Text.NL();
			Text.Add("Worming your tongue under one ball, you jiggle it up off of the floor, leveraging it into your gaping mouth, your lips closing around it as you envelop it as deeply as you can. Tongue slithering back between your jaws, you start to suckle and slurp, the fluid-soaked orb bobbing back and forth under the suction. Your tongue caresses it, your teeth gently trailing over the delicate skin, trying to gulp it all the way into your mouth.", parse);
			Text.NL();
			Text.Add("After a few moments of futile effort, you release it and slurp the other ball inside your mouth, sucking and slobbering as you redouble your efforts to pull it into your mouth, moaning softly in pleasure as you try.", parse);
			Text.NL();
			Text.Add("<i>“Ah! I’m really gonna cum now!”</i> the [foxvixen] warns, thighs closing around your head despite Terry’s best efforts. No, this won’t do. You’re running this show, so Terry’d best mind [hisher] cue. Having said that your hand immediately flies to grab [hisher] shaft, holding it shut and preventing even a single droplet from escaping. ", parse);
			Text.NL();
			Text.Add("<i>“Dammit, [playername]! Let me cum!”</i> the [foxvixen] protests, hands flying to try and wrestle your grip away. But a quick bat on each from your free hand is enough to remind [himher] of [hisher] place.", parse);
			Text.NL();
			Text.Add("You spread [hisher] thighs apart and look at [himher] sternly in the eyes, <i>“Not yet,”</i> you say. Terry whines, but complies, resting [hisher] hands back on the ground.", parse);
			Text.NL();
			Text.Add("Now that’s better. Gathering some of [hisher] spent pre, you lather your middle finger and press it against the entrance to [hisher] rosebud. A quick press and a cry later, and you’re in up to your knuckle. It only takes a bit of wiggling around for you to find Terry’s prostate. All preparations done, you ask if [heshe]’s ready to cum now.", parse);
			Text.NL();
			Text.Add("<i>“I was ready ages ago!”</i>", parse);
			Text.NL();
			Text.Add("Slackening your grip slightly, you lean over and give the side of [hisher] flare a light nip. That’s all it takes to set the [foxvixen] off. [HeShe]’s spurting [hisher] load skywards even before a ripple of throbbing pleasure works its way through [hisher] equine mast. You don’t lose a beat and quickly tilt Terry’s shaft toward [himher]self, letting jet after powerful jet fly off through the air and land on the unsuspecting [foxvixen].", parse);
			Text.NL();
			
			terry.OrgasmCum();
			
			Text.Add("Some of it falls on [hisher] open maw, as [heshe] cries out in pleasure. But most of it winds up plastering [hisher] body. To ensure not a single droplet is left behind, you make it a point to press your finger and massage [hisher] prostate, alternating between fingering [himher] and stroking the rock-hard horse-shaft in your hand.", parse);
			Text.NL();
			if(terry.FirstVag()) {
				Text.Add("You feel the distinct splash of [hisher] female half’s juices splattering your arm as you continue to finger the hapless [foxvixen]. Chuckling, you remark to no one in particular that Terry must be in heaven. All the better! You spare a thumb from your fingering hand to grant the clenching pussy something to grip as it continues gushing with the [foxvixen]’s pleasure.", parse);
				Text.NL();
			}
			Text.Add("Terry’s orgasm lasts for a good while, but ultimately it ceases, leaving you with a very creamy, very pleasured [foxvixen]. <i>“D-Damn… [playername]...”</i> [heshe] says weakly, still not recovered enough to form a coherent sentence between [hisher] panting gasps.", parse);
			Text.NL();
			Text.Add("Pulling your finger out of [hisher] butt, you heft [hisher] balls. They definitely feel lighter, but it doesn’t look like they’re totally empty just yet… you bet the [foxvixen]’s got another go in [himher].", parse);
			Text.NL();
			Text.Add("<i>“Oh no! Please no! Let… at least let me rest a bit before - Ah!”</i> You silence [himher] by giving [hisher] swollen knot a tug. Shush now, Terry’s done very well, you’re not going to push [himher]. At least not now.", parse);
			Text.NL();
			Text.Add("Terry relaxes at that, and you leave the [foxvixen] to lay on the ground, resting a bit. Gotta say though, that after this little [heshe] looks like an absolute mess; you oughta help the [foxvixen] clean up since [heshe]’s obviously not up to the task yet. If you don’t clean up all the cream clinging to [hisher] fur before it dries, your pretty fox-[boygirl]’s fur is going to get stained.", parse);
			Text.Flush();
			
			terry.relation.IncreaseStat(35, 1);
			
			world.TimeStep({hour: 1});
			
			Scenes.Terry.PCCleansTerry();
		}, enabled : true,
		tooltip : Text.Parse("Give the [foxvixen] a nice basting with [hisher] own semen.", parse)
	});
	options.push({ nameStr : "Bukkake",
		func : function() {
			Text.Clear();
			Text.Add("Decision made, you withdraw your dripping finger and wrap your lips around it, noisily sucking it clean, savoring the taste of your [foxvixen]’s precum as it vanishes down your gullet. Wetly popping your finger free, you bat your eyes up at Terry meaningfully, then wrap your fingers around [hisher] pulsing member.", parse);
			Text.NL();
			Text.Add("You can feel [hisher] heartbeat through the shuddering of [hisher] dick in your palms, and you knead the dripping flesh with smooth, rhythmic strokes. You clench and squeeze, releasing to trail your fingers up and down, curling spiralling patterns over [hisher] prick that massage the precum deeper into the overheated flesh.", parse);
			Text.NL();
			Text.Add("<i>“[stuttername]. I don’t think I - ah! - can hold out any long - oooh! - longer. if you keep - hah! - milking me like - Aah! - this!”</i>", parse);
			Text.NL();
			Text.Add("Wriggling closer, your mouth opens and you extend your [tongueDesc] with almost languid ease. Your fingers continue to play and caress with [hisher] dripping stallionhood, even as your tongue trails with slow, teasing purposefulness around [hisher] flare, tickling each tiny ridge and bump of flesh.", parse);
			Text.NL();
			Text.Add("Your fingers creep downward, curling themselves under Terry’s precum-soaked balls, jiggling them gently into your palms as your mouth stretches wider to envelop Terry’s flare. Precum flows thick and hot down your throat as you suckle and lap at the dish-like spread of flesh wedged in your mouth, thumbs kneading and stroking the bulging cum-factories nestled in your palms.", parse);
			Text.NL();
			Text.Add("Overwhelmed by pleasure, Terry involuntarily thrusts into your mouth. [HisHer] fingers and toes dig into the ground. Seems like [heshe]’s gonna blow anytime now... ", parse);
			Text.NL();
			
			var cum = terry.OrgasmCum();
			
			Text.Add("Deeming the [foxvixen] finally stimulated to your liking, you close your eyes and wetly pop your mouth free. A trail of saliva links your gaping lips to [hisher] flaring glans for a moment, before [heshe] howls in pleasure and veritably explodes in orgasm.", parse);
			Text.NL();
			Text.Add("You can feel [hisher] balls pulsate in your palms, stretching and then contracting with the force of [hisher] climax barely a second before the first cannonshot of cum splashes into your open mouth. Thick, salty, musky seed washes over your [tongueDesc] and pours down your throat without you even needing to swallow, the excess painting itself over your cheeks and running messily down your chin.", parse);
			Text.NL();
			Text.Add("The warmth of Terry’s seed on your [skinDesc] thrills you, and you instinctively knead [hisher] bulging balls, coaxing a second shot from [himher], a third right on its heels. Gush after gush of semen plasters itself over your face and pours down your throat, flooding your nostrils with its musk and deluging your tastebuds in its distinctive flavor.", parse);
			Text.NL();
			Text.Add("Groaning in ecstasy, you close your mouth and tilt your head up, allowing the cum fountain masquerading as a [foxvixen] to continue basting your body. Warm, sticky, slimy juices spatter against your [breastsDesc], rolling down your body and sliding wetly over your [bellyDesc]. ", parse);
			Text.NL();
			Text.Add("Your arms are dripping with seed, abandoning Terry’s nuts unthinkingly as you twist gently back and forth, allowing [himher] to truly bathe you in [hisher] sweet fluids. You feel so warm and right, drenched in Terry’s splooge, surrounding by [hisher] musk... when [heshe] moans, an ululation of release and exhaustion, you groan in disappointment, feeling the last jet of semen patter wetly against your dripping body.", parse);
			Text.NL();
			Text.Add("Gently wiping at your eyelids to clear off the worst of the cum sprayed there, you open your eyes and look Terry in the face, grinning happily as you do so.", parse);
			Text.NL();
			parse["guygirl"] = terry.mfPronoun("guy", "girl");
			Text.Add("The fox simply groans, still delirious after [hisher] fierce orgasm. For a moment you worry you might’ve broken the poor [guygirl], but after a few prods on [hisher] [tbreastDesc], [heshe] finally reacts. <i>“Ugh, my balls hurt…”</i>", parse);
			Text.NL();
			Text.Add("Well, considering how much [heshe] came, that’s really not a surprise, you quip. You can’t resist pausing for a moment to admire the deep plastering of off-white now drenching your form, feeling quite satisfied with the results yourself.", parse);
			Text.NL();
			if(terry.Relation() < 30) {
				Text.Add("<i>“Alright then… you got what you wanted… can I go now?”</i> [heshe] asks, already gathering [himher]self up.", parse);
			}
			else if(terry.Relation() < 60) {
				Text.Add("[HisHer] eyes crack open and [heshe] makes a face as soon as [heshe] spots your creamy self. <i>“Whoa, I really did a number on you, didn’t I?”</i>", parse);
				Text.NL();
				Text.Add("[HeShe] most certainly did, you cheerfully inform the [foxvixen]. Who’d have thought all it would take was a horse-juice suppository to turn [himher] into such a productive little cum-fountain?", parse);
				Text.NL();
				Text.Add("<i>“Well that’s your damn fault. I wouldn’t have this if you hadn’t insisted I get it...”</i> [heshe] looks away, trying to look hurt.", parse);
				Text.NL();
				Text.Add("Try as [heshe] might, you can see the [foxvixen]’s tail is waving back and forth with slow, gentle swishes. With a soft chuckle, you smirkingly ask if that’s <b>really</b> how [heshe] feels.", parse);
				Text.NL();
				Text.Add("<i>“...Well, okay. I admit it feels pretty good. Still, it can be a bit difficult to work around sometimes,”</i> [heshe] notes.", parse);
				Text.NL();
				Text.Add("Maybe that’s true... still, you ask, does the [foxvixen] really think it wasn’t worth it.", parse);
				Text.NL();
				Text.Add("<i>“I guess it was worth it, all things considered...”</i> [heshe] takes a deep breath. <i>“Well, I suppose I am responsible for all that mess,”</i> [heshe] starts, pointing at you. <i>“Want me to help you clean up?”</i>", parse);
			}
			else {
				Text.Add("<i>“Well, they’d hurt a lot less if <b>someone</b> didn’t keep abusing them,”</i> [heshe] pouts, looking accusingly at you. ", parse);
				Text.NL();
				Text.Add("Poor baby; would [heshe] like you to kiss them better, you suggest, grinning innocently at the exhausted [foxvixen]. You’d be happy to if [heshe] asked...", parse);
				Text.NL();
				Text.Add("<i>“I’d ask, but then I don’t trust you not to turn this into something more than a kiss, ya big perv,”</i> [heshe] replies with a smirk.", parse);
				Text.NL();
				Text.Add("[HeShe] just knows you too well, you agree, laughing at how right the [foxvixen] is.", parse);
				Text.NL();
				Text.Add("<i>“Honestly, I’m surprised my eating habits haven’t changed, considering the amount of seed you drain from me each time.”</i>", parse);
				Text.NL();
				Text.Add("Teasingly, you assure the [foxvixen] that if [heshe] wants you to start making meals for [himher], all [heshe] needs to do is just say so.", parse);
				Text.NL();
				if(momo.IsFollower()) {
					Text.Add("<i>“With Momo around? No offense, but as good a cook as you may be, love. I don’t think you can beat a professional chef,”</i> [heshe] chuckles.", parse);
					Text.NL();
					Text.Add("Maybe not, you agree, but your cooking would certainly have an... investment... that hers wouldn’t.", parse);
					Text.NL();
					Text.Add("Terry rolls [hisher] eyes. <i>“Of course there’d be strings attached… perv.”</i>", parse);
				}
				else {
					Text.Add("<i>“Do I even have to ask? Isn’t it supposed to be your duty to keep me pampered and cared for?”</i>", parse);
					Text.NL();
					Text.Add("That’s true, you have been neglecting your duty there, too. You beg the [foxvixen] to have mercy on you and forgive your negligence.", parse);
					Text.NL();
					Text.Add("<i>“Hmm… I might if you bend over and ask real nice sometime later,”</i> [heshe] says teasingly. <i>“But right now I’m too tired to try and ‘forgive’ you.”</i>", parse);
					Text.NL();
					Text.Add("You promise [himher] that you’ll keep it in mind and offer a proper apology when [heshe]’s not so tired, grinning as you do.", parse);
				}
				Text.NL();
				Text.Add("The [foxvixen] eyes up and down with interest. <i>“You know? As good as you look with the whole creamy motif, maybe you’d want to get clean? Maybe with my help?”</i>", parse);
			}
			Text.Flush();
			
			world.TimeStep({hour: 1});
			
			Scenes.Terry.TerryCleansPC();
		}, enabled : true,
		tooltip : Text.Parse("Let [himher] cum all over you.", parse)
	});
	options.push({ nameStr : "Anal catch",
		func : function() {
			Text.Clear();
			Text.Add("Trusting Terry won’t explode this very second, you let go of [hisher] throbbing stallionhood and glide in closer, straddling the [foxvixen]’s hips.", parse);
			Text.NL();
			Text.Add("<i>“Huh? What are y- Ah!”</i> the [foxvixen] cries out in pleasure as [heshe] feels your [buttDesc] descend upon [hisher] pole of horse-meat, its flat tip nestling your [anusDesc].", parse);
			Text.NL();
			Text.Add("Teasingly, you grind your [anusDesc] against Terry’s half-flared tip, letting [himher] feel the heat washing over [hisher] glans as you prepare yourself. Then, lifting yourself up, you thrust back down, deliberately impaling yourself on the throbbing horse-cock.", parse);
			Text.NL();
			
			Sex.Anal(terry, player);
			player.FuckAnal(player.Butt(), terry.FirstCock(), 3);
			terry.Fuck(terry.FirstCock(), 3);
			
			Text.Add("You force yourself down [hisher] length until maybe half of it sits inside you, feeling it pulse and throb in time with the [foxvixen]’s heartbeat. You pant softly with the effort, eyes flicking to Terry’s face to see how [heshe]’s feeling in response to this.", parse);
			Text.NL();
			Text.Add("The [foxvixen]’s face is contorted in pleasure. A whimper escapes [himher] as it grows until it finally becomes a deep-throated moan. [HisHer] tail is standing up, fluffy fur bristled as you overwhelm [hisher] senses with pleasure.", parse);
			Text.NL();
			Text.Add("Smiling, you reach out and gently pet Terry’s cheek, then resume sinking deeper and deeper down upon [hisher] shaft. Inch after inch of delicious fuckmeat spears into your ass, and you arch your back at the sensations they elicit inside of you. You moan as you feel the distinctive bulge of the [foxvixen]’s knot pressing against your ass. For a moment, you consider what you should do... but the answer is obvious.", parse);
			Text.NL();
			Text.Add("Gritting your teeth, holding onto Terry’s shoulders for support, you force yourself down upon [hisher] knot, your abused ass stretching madly to try and cope with the feel of it. Finally, with a cry of effort, you feel it squeeze inside of you, sucked into your hole and expanding to anchor the two of you together, leaving you well and truly tied.", parse);
			Text.NL();
			Text.Add("Terry cries out as [heshe] throbs inside you, [hisher] knot growing as big as it can. You feel [hisher] balls churn, almost vibrating with the effort of pumping all of [hisher] load up [hisher] footlong mast. The last signal you get is [hisher] tip flaring out as a veritable eruption of fox-seed heralds Terry’s climax.", parse);
			Text.NL();
			
			terry.OrgasmCum();
			
			Text.Add("Stretched to the fullest, you shudder, arching your back as you feel the [foxvixen]’s seed roaring into your guts like a perverse volcano. You can practically feel the first wave of semen slapping against your stomach wall, your belly bulging from the liquid cannon-shot you have taken, before Terry fires again, and then again. Gush after jet after spurt cascades inside you, Terry’s knot sealing your ass and ensuring it has nowhere to go but up and in. Your stomach bloats obscenely, a perverse parody of pregnancy, slapping heavily into Terry’s own belly as you just keep growing, and growing...", parse);
			Text.NL();
			Text.Add("Finally, mercifully, Terry’s howl dies away into exhausted panting as [hisher] vul-quine seed factories deplete themselves, leaving the two of you cradling a belly that looks pregnant with a whole litter of Terry’s pups. Your stomach gurgles and you stifle a belch, tasting cum on the back of your tongue.", parse);
			Text.NL();
			Text.Add("The [foxvixen] pants below you, trying [hisher] best to catch [hisher] breath after this mind-breaking orgasm. When [heshe] finally does, you don’t miss the smile of relief in [hisher] face. Still not quite recovered, [heshe] gives a few experimental humps, trying to pull out. <i>“Huh? We’re tied?”</i>", parse);
			Text.NL();
			Text.Add("Moaning softly as [hisher] efforts twist the bulging flesh stretching your tired pucker, you nod your head and assure [himher] that you are well and truly tied.", parse);
			Text.NL();
			if(terry.Relation() < 30) {
				Text.Add("<i>“Great, now I’m going to be stuck to you for a while,”</i> [heshe] sighs.", parse);
				Text.NL();
				Text.Add("Oh, as if [heshe] had anywhere better to be than here knot-deep in your ass...", parse);
				Text.NL();
				Text.Add("<i>“Doesn’t mean I wouldn’t rather be somewhere else,”</i> [heshe] adds with a pout.", parse);
			}
			else if(terry.Relation() < 60) {
				Text.Add("<i>“I guess this means we’re going to be here for a while. Not that I mind,”</i> [heshe] adds, smiling.", parse);
				Text.NL();
				Text.Add("With a matching grin, you assure the [foxvixen] that you’re certainly not complaining either, reaching out a hand and tenderly stroking [hisher] cheek.", parse);
			}
			else {
				Text.Add("<i>“For what it’s worth, there’s no one else I’d rather be stuck with,”</i> [heshe] grins.", parse);
				Text.NL();
				Text.Add("Tenderly you kiss your [foxvixen] on the lips, holding [himher] by them before gently breaking away and looking into [hisher] eyes as you assert that you feel the same way.", parse);
			}
			Text.NL();
			var cock = player.BiggestCock();
			parse["cockDesc"] = function() { return cock.Short(); }
			parse["cockHeadDesc"] = function() { return cock.TipShort(); }
			if(cock && (cock.length.Get() > 30) && (terry.Slut() + terry.Relation() >= 90)) { //30cm ~ 1 foot
				Text.Add("The two of you sit in silence for a while, but eventually the [foxvixen] eyes settles on[oneof] your [multiCockDesc].", parse);
				Text.NL();
				Text.Add("Following Terry’s gaze, you fight a smile off your lips, asking with feigned innocence if there’s something wrong with your dick.", parse);
				Text.NL();
				Text.Add("[HeShe] chuckles at your question. <i>“No, nothing wrong. It’s just that you look pretty hard right now, and you did make me lose a <b>lot</b> of protein just now. So I was wondering if you wanted me to take care of that and have a little snack while I do it,”</i> [heshe] says, licking [hisher] lips. <i>“After all, you’re so big. And that looks so juicy,”</i> [heshe] adds with a grin.", parse);
				Text.NL();
				Text.Add("As if in thought, you tap a finger slowly against your lips, but the truth is it’s just a little show for Terry’s sake. Feeling your aching need burning against the fluid-crammed swell of your gut is more than enough to convince you to accept the [foxvixen]’s oh-so-generous offer.", parse);
				Text.NL();
				Text.Add("Smiling toothily, you assure Terry that if [heshe] can reach it, [heshe] can suck it as much as [heshe] wants. You assure [himher] you’d be more than happy to do your best at returning the favor [heshe] just gave you, tapping your belly for emphasis.", parse);
				Text.NL();
				Text.Add("<i>“Hehe, sounds like a deal.”</i> [HeShe] takes your [cockDesc] and pulls it down, toward [himher]self. ", parse);
				if(terry.Cup() >= Terry.Breasts.Ccup) {
					Text.Add("[HeShe] squeezes [hisher] boobs, trapping your shaft in [hisher] cleavage. <i>“Whaddya know. These came in handy,”</i> [heshe] says with a grin, rubbing along your length with [hisher] pillowy breastflesh.", parse);
					Text.NL();
					Text.Add("Feeling the warm, softly fluffy flesh enveloping your sensitive shaft, you can’t hold back a moan of pleasure, arching your back as best you can. You wriggle a little in Terry’s lap, sending sparks surging up your spine as you stimulate the nerves in your ass. Panting softly, you can’t help but loudly agree that Terry is right; [hisher] breasts really do come in handy for things like this.", parse);
					Text.NL();
					Text.Add("<i>“I’m glad you agree,”</i> [heshe] says, continuing to rub your [cockDesc] with [hisher] breasts.", parse);
					if(terry.Lactation()) {
						Text.Add(" Some of the [foxvixen] tasty milk leaks from [hisher] engorged nipples to add a pleasant layer of creamy moisture to Terry’s impromptu boobjob.", parse);
					}
					Text.NL();
					Text.Add("You are in heaven, feeling the soft fur and the just-rightly squishy titflesh sweeping back and forth along your shaft. Your moan of pleasure changes in mid-groan to one of query and disappointment when, just as you are truly starting to enjoy [hisher] efforts, [heshe] stops. Unthinkingly, you ask [himher] why [heshe] stopped.", parse);
					Text.NL();
					Text.Add("<i>“Let’s not get ahead of ourselves, shall we? Wouldn’t want you wasting your precious cargo on my face.”</i> [HeShe] winks.", parse);
				}
				Text.NL();
				Text.Add("The [foxvixen] leans in and closes [hisher] eyes, smelling your musk and heady scent. <i>“Smells good enough to eat,”</i> [heshe] remarks. <i>“But I think I’ll take it slow.”</i> [HeShe] extends [hisher] tongue, gently lapping around your [cockHeadDesc].", parse);
				Text.NL();
				Text.Add("A soft coo of desire wells unabashedly from your throat, shifting slightly in response to the gentle, tantalizing tongue-flicks that the [foxvixen] is raining upon your glans. Pleasure races under your skin, crackling through your mind, and you find it harder to think.", parse);
				Text.NL();
				Text.Add("It’s an effort to get the words out, but you manage to gasp to Terry that [heshe] doesn’t need to hold back on your account. [HeShe] just used up a lot of protein, [heshe] must be starving, after all...", parse);
				Text.NL();
				Text.Add("<i>“Yes, I am. But I’m a bad [boygirl]. And I like playing with my food,”</i> [heshe] giggles, giving a peck on your [cockHeadDesc], some pre sticking to [hisher] nose before [heshe] laps it off.", parse);
				Text.NL();
				Text.Add("You sigh heavily in anguish that isn’t entirely feigned for Terry’s benefit. With an exaggeratedly grudging tone, you concede that you can’t stop [himher], so if [heshe]’s going to play with [hisher] food, that’s [hisher] choice. But you warn [himher] that if [heshe] spends too long playing, [heshe] may end up with a bath instead of a meal...", parse);
				Text.NL();
				parse["mastermistress"] = player.mfTrue("master", "mistress");
				Text.Add("<i>“Oh, I wouldn’t worry about that. You trained me well, and I can tell when you’re just about to peak. Isn’t that right, [mastermistress]?”</i> [heshe] asks teasingly, licking your urethra with the very tip of [hisher] tongue.", parse);
				Text.NL();
				Text.Add("Your whole body shudders at the touch, a moan spilling unconsciously from your throat. That’s true, you have trained [himher] as best you can... now, let’s see just how well you did... Stiffening yourself as best you can, you tell Terry that [heshe] can play all [heshe] wants, now. This time, [heshe]’s in charge.", parse);
				Text.NL();
				parse["breasts"] = terry.Cup() >= Terry.Breasts.Ccup ? "breasts" : "hands";
				Text.Add("<i>“You mean I’m not always? Just joking,”</i> [heshe] laughs. <i>“Alright then, I’m going to milk you good.”</i> Finally [heshe] engulfs your length in [hisher] warm maw. Terry wastes no time, and begins sucking on as much of your [cockDesc] as [heshe] can get to. [HisHer] [breasts] stroking along the remainder of your shaft.", parse);
				Text.NL();
				parse["knot"] = cock.knot != 0 ? " and your knot" : "";
				Text.Add("Your eyes sink closed and you cry out softly in pleasure at the [foxvixen]’s expert ministrations. Warm wetness envelops the key parts of your cock, the stroking against the very base of your shaft[knot] merely highlighting the pleasure of [hisher] lips and tongue. ", parse);
				Text.NL();
				Text.Add("The hot wet flesh strokes and caresses you, teasing your [cockHeadDesc] and undulating against the underside of your shaft. Sparks of pleasure crackle along your nerves, like a lightningstorm inside your brain, and you mindlessly thrust your hips as best you can with Terry’s knot anchoring your ass in place.", parse);
				Text.NL();
				Text.Add("Gasping in pleasure, you mindlessly babble compliments on Terry’s skill; [heshe]’s come such a long way from the prudish near-virgin [heshe] was before...", parse);
				Text.NL();
				Text.Add("The [foxvixen] hums, not being capable of replying with [hisher] muzzle so full of cock. Vibrations course throughout your member, and you can feel [hisher] tongue caressing your glans. You can feel [himher] circling your [cockHeadDesc], finally peaking when [heshe] finds your cumvein dribbling with spent pre. [HeShe] gives you a muffled chuckle and pushes [hisher] tongue against your urethra, trying to lick inside.", parse);
				Text.NL();
				Text.Add("You were on thin ice already, but this final perverse trick of Terry’s is all you can take. Arching your back, anus squeezing down viciously on Terry’s knot in pleasure, your whole body shudders as you climax, exploding into the [foxvixen]’s mouth with a cry of pleasure.", parse);
				Text.NL();
				
				var cum = player.OrgasmCum();
				
				var CumCoat = {
					None  : 0,
					Gut   : 1,
					Cummy : 2
				};
				var cumCoat = CumCoat.None;
				
				if(cum > 6) {
					Text.Add("Your seed erupts from your shaft like a perverse volcano, a cascade of salty goo pouring down Terry’s hungry gullet. Bravely, [heshe] sucks and slurps, swallowing each cheek-bulging mouthful as it comes, [hisher] belly thrusting itself boldly into your own as it stretches over your titanic output. ", parse);
					Text.NL();
					Text.Add("Your [cockDesc] is sandwiched between your bulging bellies, the cream-crammed flesh wrapping itself with delicious softness around the heated flesh of your shaft. But you just keep on cumming, and cumming; Terry can’t keep up!", parse);
					Text.NL();
					Text.Add("Eventually, the pouring tide of semen bloats Terry to the point [hisher] own belly shoves your dick out of [hisher] mouth, and you’re still cumming! All the [foxvixen] can do is close [hisher] eyes, open [hisher] mouth, and let the thick jets of warm seed paint [hisher] face cum-white. Great ropes of semen bead through [hisher] luscious red mane, washing over [hisher] cheeks, pouring down onto [hisher] [tbreastDesc], even flicking a few ropes between [hisher] ears.", parse);
					Text.NL();
					Text.Add("Finally, though, you groan your way to the end of your climax, a single last dribble of cum spattering wetly across the [foxvixen]’s nose before you fall limp. Bellies sloshing with their mutual loads, you slump forward against the newly-bloated [foxvixen], panting for breath.", parse);
					Text.NL();
					Text.Add("Terry licks some of your cum out of [hisher] nose, giggling shortly after. <i>“As productive as always,”</i> [heshe] remarks teasingly.", parse);
					Text.NL();
					Text.Add("With a half-grin, you concede that you are... but then, it’s not as if Terry’s much of a slouch in the cum department either, and you drum your fingertips on your own swollen stomach as a reminder. You shift slightly atop Terry’s hips, moaning quietly as you feel [hisher] knot grinding against your walls, the twin seed-bloated orbs of your bellies still sandwiching your sensitive prick-flesh.", parse);
					Text.NL();
					Text.Add("<i>“True, but that’s also your fault,”</i> [heshe] teases. <i>“Did you really have to give me a facepaint tho? Now I’ll need another bath...”</i> [heshe] sighs.", parse);
					Text.NL();
					Text.Add("You apologise, but insist you couldn’t help it; Terry just did too good a job for you to hold it back at all. But, if it’ll make [himher] feel better, you’d be happy to wash [himher] down in the bathroom, once [heshe] unknots you...", parse);
					Text.NL();
					parse["mistermiss"] = player.mfTrue("mister", "miss");
					Text.Add("<i>“Sounds like a deal, just make sure to keep your hands to yourself [mistermiss]. No mischief in the bath, I need to get cleaner. Not dirtier.”</i>", parse);
					Text.NL();
					Text.Add("Grinning, you tell Terry that you can’t make any promises there. Yawning softly, you snuggle up to [himher] as best you can given your present state, closing your eyes and allowing yourself to drift off into the contented slumber of the fucked senseless.", parse);
					cumCoat = CumCoat.Cummy;
				}
				else if(cum > 3) {
					Text.Add("Your cock fires cum like a liquid cannonball, but your brave vulpine slutly neatly swallows each cheek-bulging load. Wetly [heshe] gulps and slurps, the cascade of thick, rich semen pouring down [hisher] throat and into the increasingly tight confines of [hisher] belly. With each mouthful [heshe] swallows, you can feel [hisher] belly growing rounder and fuller, pushing back against your dick and pressing it against the semen-stuffed fullness of your own.", parse);
					Text.NL();
					Text.Add("By the time you groan and dribble your last shot of semen into Terry’s waiting mouth, your [cockDesc] is well and truly sandwiched between your two bloated bellies. Each shift and wriggle that either of you makes sends soft flesh brushing gently across its sensitive length, ensuring you remain half-erect even despite your tired state.", parse);
					Text.NL();
					Text.Add("<i>“Plentiful as usual. That should compensate for all the seed you’ve made me spill.”</i>", parse);
					Text.NL();
					Text.Add("Feigning wounded pride, you reply that [heshe] should expect nothing less. Curiously, you eye your mutual bulges, reaching out to gently stroke what parts of Terry’s soft, fur-covered roundness you can reach, looking thoughtful as you do. Finally, you give [himher] a gentle pat and declare that you think Terry put out more than you did, grinning as you do.", parse);
					Text.NL();
					Text.Add("<i>“Guess you’ll have to make up to me later then,”</i> [heshe] suggests with a smile.", parse);
					Text.NL();
					Text.Add("Teasingly, you wonder aloud just what Terry might mean by ‘making it up to [himher]’. You chuckle softly, but then yawn softly, your body demanding rest after the experience you just put it through.", parse);
					Text.NL();
					Text.Add("<i>“You know what I’m talking about, you huge perv. Now, since you’re tired too. How about a snuggle and a nap? I think we’ll both need some time to digest all this. Plus I can’t pull out of you just yet.”</i>", parse);
					Text.NL();
					Text.Add("That sounds like a good idea to you. Sleepily nodding your head, you wriggle a little to see if you can coax your cock out from between your stomachs. When it fails to budge, you decide to put up with it; you’re too tired to do anything more. Gently you settle against your equally bloated partner and close your eyes, drifting off to a warm and enticing slumber.", parse);
					cumCoat = CumCoat.Gut;
				}
				else {
					Text.Add("Like the expert little cocksucker [heshe] is, Terry neatly fields every spurt and dribble of cum that your dick puts forth. Even as you quiver and shake your way through your climax, the liquid leavings of your pleasure disappears down [hisher] throat like water down a drain, swallowed with nary a hiccup. When you finally finish, Terry’s tongue runs itself teasingly along your glans, cleaning off the last remaining smears of semen with a final bit of suction before [heshe] wetly pops [hisher] mouth free.", parse);
					Text.NL();
					Text.Add("<i>“Creamy and tasty, just how I like it,”</i> [heshe] grins.", parse);
					Text.NL();
					Text.Add("You can’t resist quipping back that you always aim to please; you know Terry’s favorite flavor, after all. You choke back a yawn, feeling the fatigue crashing down upon you.", parse);
					Text.NL();
					Text.Add("<i>“Sure you do. Now, since you’re probably as tired as I am. How about we snuggle for a short nap? It’ll be a while before I can pull out. Especially if you - oh! - keep squeezing on me like that.”</i>", parse);
					Text.NL();
					Text.Add("Blinking your eyes sleepily, you nod your head; that sounds like a good idea to you. As best you can with your stomach in the way, you snuggle closer to Terry and allow your eyes to sink closed, eagerly drifting off to sleep.", parse);
				}
				Text.NL();
				Text.Add("Eventually, you woke up to find Terry’s member limping but still embedded inside your [anusDesc]. Pulling away prompted the [foxvixen]’s awakening, followed by a stream of fox-seed leaking from your butt. That was quite a mess.", parse);
				Text.NL();
				if(terry.Relation() + terry.Slut() >= 90) {
					Text.Add("Naturally, being the helpful little pet [heshe] is, Terry offered to help you clean up… with [hisher] tongue. [HeShe] made sure to lick everything, even giving you a rimjob to ensure [heshe]’s got everything. ", parse);
				}
				else {
					Text.Add("Thankfully, a few towels is all you needed to deal with that.", parse);
				}
				Text.NL();
				if(cumCoat == CumCoat.Cummy) {
					Text.Add("This brings you to the present... there’s the little matter of your promise to help Terry wash all of the now-gummy, sticky cum matting [hisher] crimson hair out of [hisher] mane.", parse);
					Text.NL();
					Text.Add("<i>“Alright, just remember to stay focused. Knowing you I bet you’re going to be getting all grabby with me, and I don’t need another layer of [playername] on me to clean up later,”</i> [heshe] teases with a grin.", parse);
					Text.NL();
					Text.Add("Smirking back, you promise [himher] that you’ll do your best, so long as [heshe] remembers to keep the flirting down. It’s not your fault [heshe]’s such a tease, always begging you to bend [himher] over and make [himher] all dirty again...", parse);
					Text.NL();
					Text.Add("<i>“Hey, I don’t do that!”</i> [heshe] protests. <i>“At least not all the time,”</i> [heshe] adds with a smirk. <i>“Let’s go then, we need to get you cleaned up too.”</i> Terry comes up to you, gives your [buttDesc] a smack and dashes away.", parse);
					Text.NL();
					Text.Add("With a cheerful grin and a light toss of your head, you hurry after the [foxvixen], racing to catch up.", parse);
					Text.Flush();
					
					world.TimeStep({hour: 3});
					Gui.NextPrompt();
					return;
				}
				else if(cumCoat == CumCoat.Gut) {
					parse["rel"] = (terry.Relation() + terry.Slut() >= 90) ? " and Terry’s kinky tongue" : "";
					Text.Add("Even though gravity[rel] have cleaned out your bowels some, you are still sporting quite a belly. Of course, so is the [foxvixen] who gave you your belly. Playfully, you look back and forth between your two semen-stuffed swells, visibly comparing them, before announcing that you’re fairly sure Terry’s bigger than you, now.", parse);
					Text.NL();
					parse["mistermiss"] = player.mfTrue("mister", "miss");
					Text.Add("<i>“Give me a break. It’s not like I can drain myself like you [mistermiss] leaky faucet.”</i>", parse);
					Text.NL();
					Text.Add("With a cheeky grin, you concede [heshe] has a point. Luckily for [himher] it’s not only [hisher] favorite treat, it’s also good for [himher], right?", parse);
					Text.NL();
					Text.Add("<i>“Gotta take back all that I gave you somehow. Otherwise you’re going to wind up killing me,”</i> [heshe] says with a grin.", parse);
					Text.NL();
					Text.Add("You’re happy to give it back anytime. As for killing [himher]. You’d never do that, otherwise you wouldn’t have a pretty foxy to drain anymore.", parse);
					Text.NL();
					Text.Add("<i>“That’s true. So you’d better take good care of me.”</i>", parse);
					Text.NL();
					Text.Add("Better than you do?", parse);
					Text.NL();
					Text.Add("<i>“Always room for improvement,”</i> [heshe] giggles.", parse);
					Text.NL();
					Text.Add("Finished dressing up, you collect your belongings and leave with Terry in tow.", parse);
				}
				else {
					Text.Add("No longer anchored together, you take a few moments to shake the last stiffness out of your joints and start getting your gear together, casting the occasional glance in Terry’s direction as the [foxvixen] pulls [hisher] own gear on. Once the two of you are properly attired, you offer [himher] the lead and follow the nimble vulpine back in the way you came.", parse);
				}
			}
			else {
				if(terry.Relation() < 30) {
					Text.Add("The two of you sit in silence, neither breaking the ice. Eventually Terry yawns. Seems like you wore the poor [guygirl] out. Well, since you’re not going anywhere for a while, you might as well try and be nice; with your warmest smile, you ask if Terry would like to get some sleep whilst [heshe]’s waiting for [hisher] knot to go down.", parse);
					Text.NL();
					Text.Add("<i>“I guess I wouldn’t mind a nap. Not like I have anything better to do...”</i>", parse);
					Text.NL();
					Text.Add("As soon as the [foxvixen] agrees, your arms sweep out and hug [himher] to your chest, shifting your center of gravity to bring the two of you toppling onto the ground in a controlled crash. Once down, you waste no time in snuggling up to the startled [foxvixen], resting your head comfortably against [hisher] own luscious red mane, filling your nostrils with the sweet scent of [hisher] shampoo. Smiling happily, you wish [himher] a good sleep.", parse);
					Text.NL();
					Text.Add("[HeShe] looks a bit flustered at first, but quickly calms down, accepting your embrace. <i>“umm, right. Good night,”</i> [heshe] says, letting [hisher] eyes shut.", parse);
				}
				else {
					Text.Add("The two of you sit in silent contemplation for some time. Eventually Terry decides to break the ice. <i>“So, how’s it going up there?”</i> [heshe] asks, resting [hisher] head on [hisher] hands.", parse);
					Text.NL();
					Text.Add("Cheerfully, you reply that it’s going pretty good; you have over a foot of juicy thick horsecock jammed up your ass and a tasty knot keeping it stuck there. For emphasis, you squeeze down with your anal muscles, grinning at the soft gasp that escapes the [foxvixen]’s lips.", parse);
					Text.NL();
					Text.Add("Casually, you add that you’d ask how [heshe]’s going down there, but it seems a bit redundant, given the earthshattering orgasm [heshe] evidently just had. Playfully, you drum your fingers atop the mammoth roundness of your jism-packed belly.", parse);
					Text.NL();
					Text.Add("<i>“Yeah, I’m a bit tired. So, how about we snuggle and nod off for a bit? Just until my knot’s small enough to slip out of your tasty rump,”</i> [heshe] suggests with a smile.", parse);
					Text.NL();
					Text.Add("Smiling, you gently reach out and twine your arms around the [foxvixen]’s neck, tenderly bringing [hisher] head close enough that you can rest it on your shoulder. Conversationally, you tell Terry that sounds like a wonderful idea to you, lightly resting your own cheek against [hishers] and letting your eyes close.", parse);
					Text.NL();
					Text.Add("<i>“Yeah, that’s just who I am. Full of bright ideas. Good night,”</i> [heshe] says, giving your cheek a peck and closing [hisher] eyes for some much needed rest.", parse);
				}
				terry.relation.IncreaseStat(45, 2);
				world.TimeStep({hour: 1});
			}
			Text.Flush();
			
			world.TimeStep({hour: 1});
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : Text.Parse("Stuff your butt with Terry’s cock and give it a proper sleeve to empty itself into.", parse)
	});
	Gui.SetButtonsFromList(options, false, null);
}

// Clean Terry Up Entry Point
Scenes.Terry.PCCleansTerry = function(func, opts) {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		tarmorDesc : function() { return terry.ArmorDesc(); },
		skinDesc   : function() { return player.SkinDesc(); },
		tongueDesc : function() { return player.TongueDesc(); },
		breastsDesc : function() { return player.FirstBreastRow().Short(); },
		nipsDesc : function() { return player.FirstBreastRow().NipsShort(); },
		nipDesc : function() { return player.FirstBreastRow().NipShort(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		cockDesc : function() { return player.BiggestCock().Short(); },
		vagDesc : function() { return player.FirstVag().Short(); },
		clitDesc : function() { return player.FirstVag().ClitShort(); },
		handDesc : function() { return player.HandDesc(); },
		tbellyDesc : function() { return terry.StomachDesc(); },
		tbreastdesc : function() { return terry.FirstBreastRow().Short(); }
	};
	parse = terry.ParserPronouns(parse);
	
	parse["s"]    = player.NumCocks() > 1 ? "s" : "";
	parse["notS"] = player.NumCocks() > 1 ? "" : "s";
	parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
					
	opts = opts || {};
	func = func || function(opts) {
		Text.Flush();
		Gui.NextPrompt();
	};
	
	//[Towel][Lick Clean]
	var options = new Array();
	options.push({ nameStr : "Towel",
		func : function() {
			Text.Clear();
			Text.Add("Clambering back upright, you tell Terry to wait for a second. The semen-dripping [foxvixen] mumbles an idle agreement and waves a hand, even as you wander off to find a towel. Once you have what you need, you kneel beside Terry and wrap the towel around [hisher] head, rubbing [hisher] ears and flowing mane of red hair to try and wipe away the worst of the jets that splattered this high, then start stroking at [hisher] face to clean it away.", parse);
			Text.NL();
			Text.Add("The [foxvixen] mutters some muffled protest as you rub [hisher] face clean, but you doubt it was anything important… so you decide to ignore it for now and continue to wipe Terry clean.", parse);
			Text.NL();
			Text.Add("Judging Terry’s head to be sufficiently clean, you move down [hisher] neck toward [hisher] chest, where the bulk of [hisher] ejaculate is smeared. ", parse);
			if(terry.Cup() >= Terry.Breasts.Dcup) {
				parse["milk"] = terry.Lactation() ? ", making milk seep out to further stain your towel" : "";
				Text.Add("The [foxvixen]’s plush, jiggling D-cups squish delightfully as you apply pressure to them[milk], and Terry moans in unconscious appreciation as you carefully, tenderly wipe and stroke them. With meticulous attention you mop the [foxvixen]’s breasts clean, wiping away as much of Terry’s cum as you possibly can before accepting you aren’t going to get [himher] any cleaner and moving on.", parse);
			}
			else if(terry.Cup() >= Terry.Breasts.Ccup) {
				parse["milk"] = terry.Lactation() ? " unwittingly coaxing forth milk to mix with the semen," : "";
				Text.Add("Even as you wipe at the semen coating them, you cannot resist squishing and fondling Terry’s ample tits, feeling the [foxvixen] unthinkingly lean against you in pleasure at the touch. With diligent, patient motions you rub and stroke and mop each breast in turn,[milk] until you have to accept that [heshe] is as clean there as possible.", parse);
			}
			else if(terry.Cup() >= Terry.Breasts.Bcup) {
				Text.Add("As you wrap and rub the towel over Terry’s chest, you find the [foxvixen]’s perky breasts squishing most delightfully in the process, just big enough to flatten as you press down, but small enough to slide deliciously between your fingers. Even you can’t pinpoint how much of your efforts are actually cleaning [himher] and how much are simply groping [himher], but eventually [heshe] is clean enough that it’s time to move on.", parse);
			}
			else if(terry.Cup() >= Terry.Breasts.Acup) {
				Text.Add("Terry’s perky little tits bounce and move most invitingly under your towel as you wash down [hisher] chest, and you can’t help but cop the odd feel in the process. As small as they are, they don’t add much to your workload and you soon have [himher] as clean as you’re going to get [himher] with just a towel.", parse);
			}
			else {
				Text.Add("Terry’s femininely flat chest is easy enough to clean; you can easily wrap the whole towel around [hisher] upper torso and rub it back and forth, sopping up the excess semen as best you possibly can. [HeShe] arches [hisher] back, leaning into the impromptu massage, and you soon have [himher] fairly clean.", parse);
			}
			Text.NL();
			var preg = terry.PregHandler().IsPregnant();
			parse["swollen"] = preg ? " swollen" : "";
			Text.Add("With Terry’s chest clean, you move down toward [hisher][swollen] belly next. ", parse);
			if(preg)
				Text.Add("Carefully you massage the bulging orb of [hisher] midriff, distended with your unborn child, rubbing the towel around, across and over with smooth, even strokes. You fall easily into a rhythm of wiping the semen away and stroking the stretched and sensitive skin beneath, massaging your pregnant lover tenderly. Eventually, you deem [himher] to be as clean as you can make [himher] with just a towel.", parse);
			else
				Text.Add("With firm, energetic strokes you rub and wipe, sopping up the semen puddling on [hisher] belly and drying out the [foxvixen]’s fur as best you can. It takes a while, but finally you have [himher] looking decently presentable.", parse);
			Text.NL();
			Text.Add("<i>“Thanks,”</i> you hear the [foxvixen] mumble.", parse);
			Text.NL();
			Text.Add("You assure [himher] that it’s no problem and offer [himher] a friendly smile.", parse);
			Text.NL();
			Text.Add("Terry smiles [himher]self, before slumping back. Seems like your pet is still drained after your activities. You pat [himher] on the thigh and tell [himher] that [heshe] should get some rest.", parse);
			Text.NL();
			if(terry.Relation() < 30)
				Text.Add("<i>“Right… I will,”</i> [heshe] replies closing [hisher] eyes.", parse);
			else if(terry.Relation() < 60)
				Text.Add("<i>“Okay, thanks again, [playername].”</i> You pat [himher] on the head and watch as [heshe] closes [hisher] eyes, before leaving.", parse);
			else
				Text.Add("<i>“Kiss me goodnight?”</i> [heshe] requests. A request which you’re only too happy to oblige, before leaving [himher] to rest with a smile.", parse);
			
			func(opts);
		}, enabled : true,
		tooltip : Text.Parse("Grab a towel or something and help rub [himher] down.", parse)
	});
	var tooltip = player.Slut() < 30 ? "It's icky and gross, but you probably could lick [himher] clean... you think [heshe]'d like that... Honestly, it's kind of hot, too." :
	              player.Slut() < 60 ? "Why waste all that tasty [foxvixen] spunk? Bon appetite..." : "Like you're really going to waste yummy nutbutter on a towel! Time to eat!";
	options.push({ nameStr : "Lick Clean",
		func : function() {
			Text.Clear();
			var preg = terry.PregHandler().IsPregnant();
			Text.Add("Licking your lips unconsciously, you place a hand on each of the [foxvixen]’s thighs for support and wriggle in closer. Your lips sink forward until you are hovering over the underside of [hisher] [tbellyDesc], then part to allow your [tongueDesc] to slide outwards. Carefully you glide over the cum-caked fur, heavy enough to lap the off-white smears from its surface but not enough to coat your tongue in fur. The thick taste of salt and musk washes over your senses, and you swallow hard, squeezing the semen down your throat before starting to lick again.", parse);
			Text.NL();
			Text.Add("Painstakingly you wash your way up Terry’s belly, pausing at its peak to ", parse);
			if(preg)
				Text.Add("lap and play with the pregnant [foxvixen]’s bellybutton, popped out through the fur into a distinctive little peak for you to kiss and suckle, teasing with tongue, lips and teeth.", parse);
			else
				Text.Add("worm your way into [hisher] bellybutton, wriggling in circles along the indent’s walls, tongue pumping playfully in and out.", parse);
			Text.NL();
			Text.Add("The [foxvixen] laughs incessantly at your ministrations. <i>“[playername]! - heh! - S-Stop! That tickles!”</i>", parse);
			Text.NL();
			Text.Add("Amused, you can’t resist teasing Terry just a little longer, feeling the [foxvixen] wriggle and squirm beneath you, then take mercy. Removing your tongue from [hisher] bellybutton, you start to lick and suckle and lap your way further up Terry’s body, up until you reach [hisher] chest.", parse);
			Text.NL();
			if(terry.Cup() >= Terry.Breasts.Ccup) {
				parse["milk"] = terry.Lactation() ? Text.Parse(" - which rewards you with a taste of [hisher] milk -", parse) : "";
				Text.Add("Your tongue and lips attack the [foxvixen]’s ample cleavage with a vengeance, licking long and hard, slurping wetly at [hisher] nipples[milk] and planting wet, sucking kisses over their surface until they jiggle from the force.", parse);
			}
			else if(terry.Cup() >= Terry.Breasts.Acup) {
				parse["milky"] = terry.Lactation() ? " milky" : "";
				Text.Add("Small as they are, your [foxvixen]’s breasts are still big enough for you to suckle at, to tease each[milky] nipple with lips and tongue and teeth, lapping and slurping and kissing your way over the swells.", parse);
			}
			else {
				Text.Add("Your [foxvixen]’s nipples poke like tiny little pink islands from the sea of white fur, and your tongue is drawn to them like an iron filing to a magnet. With slow, gentle strokes from the very tip you tease and caress, polishing them until they shine, then gently nipping them just barely with your teeth.", parse);
			}
			Text.NL();
			Text.Add("Not able to resist, Terry is content to moan and groan as you lavish [hisher] [tbreastdesc] with attention. [HisHer] hands moving to the back of your head, not to stop you, but to direct and aid you in your task. Each lick causing [hisher] hands to clench, reassuring you that the [foxvixen] is indeed enjoying your treatment very much.", parse);
			Text.NL();
			Text.Add("By this point, you have lapped up the bulk of the semen adorning your pet’s form. Latest mouthful between your lips, you are struck by an urge that you can’t resist. Clambering the last few inches along Terry’s body, you thrust your lips possessively against [hisher] own, drawing the [foxvixen] into a deep and passionate kiss. As you do so, your tongue pushes authoritatively into [hisher] mouth, gravity drawing the mouthful of semen from your mouth into [hishers].", parse);
			Text.NL();
			if(terry.Slut() < 30) {
				Text.Add("Even if this something the [foxvixen] would never consider otherwise, [heshe]’s just feeling too good to care. Terry accepts your kiss without a hint of protest, licking your own [tongueDesc] clean of all the fox-seed you feed [himher].", parse);
			}
			else if(terry.Slut() < 60) {
				Text.Add("Terry is feeling too good - basking in [hisher] afterglow as [heshe] is - to bother hesitating when you thrust your creamy [tongueDesc] into [hisher] maw. All [heshe] does is accept and lick your mouth clean of [hisher] own jism, a smile gracing [hisher] features once you break the kiss.", parse);
			}
			else {
				Text.Add("The [foxvixen] regains some of [hisher] pep when you touch lips. [HisHer] tongue darts into your mouth to kiss you back passionately. The moment [heshe] tastes [himher]self, [heshe] eagerly begins lapping any remnant of spunk, thoroughly washing your mouth up. [HisHer] tongue tangles with yours, dancing in wild, chaotic embraces, hooking together so [heshe] can pull you inside [hisher] own maw. Puckering [hisher] lips, Terry makes a show of sucking on your [tongueDesc], gulping down jism and saliva as [heshe] does so. It actually takes some effort for you to break free of the hungry [foxvixen] with a pop.", parse);
				Text.NL();
				Text.Add("What a slutty [foxvixen] your sexy little pet is…", parse);
				Text.NL();
				Text.Add("Terry just grins at you with a mischievous smile, licking [hisher] lips to taste the last of you.", parse);
			}
			Text.NL();
			Text.Add("Slowly you slide your tongue over your lips, swallowing heavily as your eyes sink half-closed with pleasure. With a throaty purr of approval, you congratulate Terry on being so tasty.", parse);
			Text.NL();
			if(terry.Relation() < 30) {
				Text.Add("<i>“Err, thanks?”</i> the [foxvixen] says, unsure of how to proceed. It’s clear [heshe] appreciates you cleaning [himher] the way you did, but the fact that [heshe]’s being all shy about it is kinda cute.", parse);
				Text.NL();
				Text.Add("[HeShe]’s welcome, you reply. Terry looks as if [heshe] is about to say something, but cuts [himher]self off with a soft yawn; looks like [heshe] needs to be left to get some rest.", parse);
			}
			else if(terry.Relation() < 60) {
				Text.Add("<i>“Anytime, [playername],”</i> [heshe] replies with a tired smile.", parse);
				Text.NL();
				Text.Add("With a mischievous grin of your own, you assure [himher] that you’ll keep that in mind. But, for now, [heshe] should lay back and get some rest. Affectionately you tussle the [foxvixen]’s ears, running your fingers through silky-soft hair before petting [hisher] head.", parse);
			}
			else {
				Text.Add("<i>“Gods, you’re such a perv, [playername],”</i> [heshe] comments teasingly.", parse);
				Text.NL();
				Text.Add("That may be so, but you know [heshe] wouldn’t have you any other way.", parse);
				Text.NL();
				parse["boygirl"] = player.mfTrue("boy", "girl");
				Text.Add("<i>“Lucky you that I happen to like pervy [boygirl]s, then.”</i> the [foxvixen] giggles.", parse);
				Text.NL();
				Text.Add("You agree that you are most lucky indeed, then steal a quick kiss. But even so, [heshe] needs to get some rest now; the two of you can have more fun later.", parse);
				Text.NL();
				Text.Add("<i>“Alright, then. See you later?”</i>", parse);
				Text.NL();
				Text.Add("You promise [himher] that [heshe] will.", parse);
			}
			
			player.slut.IncreaseStat(75, 1);
			terry.slut.IncreaseStat(100, 2);
			
			func(opts);
		}, enabled : true,
		tooltip : Text.Parse(tooltip, parse)
	});
	Gui.SetButtonsFromList(options, false, null);
}
// Clean Terry Up Exit Point

// Terry cleans PC Entry Point
Scenes.Terry.TerryCleansPC = function(func, opts) {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		tarmorDesc : function() { return terry.ArmorDesc(); },
		skinDesc   : function() { return player.SkinDesc(); },
		tongueDesc : function() { return player.TongueDesc(); },
		breastsDesc : function() { return player.FirstBreastRow().Short(); },
		nipsDesc : function() { return player.FirstBreastRow().NipsShort(); },
		nipDesc : function() { return player.FirstBreastRow().NipShort(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		cockDesc : function() { return player.BiggestCock().Short(); },
		vagDesc : function() { return player.FirstVag().Short(); },
		clitDesc : function() { return player.FirstVag().ClitShort(); },
		handDesc : function() { return player.HandDesc(); }
	};
	parse = terry.ParserPronouns(parse);
	
	parse["s"]    = player.NumCocks() > 1 ? "s" : "";
	parse["notS"] = player.NumCocks() > 1 ? "" : "s";
	parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
					
	opts = opts || {};
	func = func || function(opts) {
		Text.Flush();
		Gui.NextPrompt();
	};
	
	//[Let Be][Clean Up]
	var options = new Array();
	var tooltip = terry.Relation() < 30 ? Text.Parse("No, you don’t want anything more from [himher] at the moment. [HeShe]’s free to go.", parse) :
	              terry.Relation() < 60 ? Text.Parse("No, you don’t need [hisher] help; you’ll go and clean yourself off.", parse) :
	              Text.Parse("That’s not necessary; you’re happy to walk around wearing your lover on your [skinDesc] like this.", parse);
	options.push({ nameStr : "Let Be",
		func : function() {
			Text.Clear();
			if(terry.Relation() < 30) {
				Text.Add("<i>“Alright, thanks,”</i> [heshe] finds [hisher] [tarmorDesc] and leaves you.", parse);
				Text.NL();
				Text.Add("Gathering up your things as necessary, you prepare yourself to get back to what you were doing.", parse);
				
				terry.relation.IncreaseStat(60, 2);
			}
			else if(terry.Relation() < 60) {
				Text.Add("<i>“You sure? Okay then.”</i> [HeShe] gathers [himher]self and finds [hisher] [tarmorDesc] leaving you with a smile. <i>“See you later, [playername].”</i>", parse);
				Text.NL();
				Text.Add("You assure [himher] that [heshe] most certainly will. And you’re sure [heshe] will enjoy it even more than [heshe] did this time. Smirking to yourself, you finish gathering up your own things in turn.", parse);
				
				terry.relation.IncreaseStat(60, 2);
			}
			else {
				Text.Add("Terry chuckles at your reply. <i>“Why did I have to fall for such a huge perv...”</i>", parse);
				Text.NL();
				Text.Add("Grinning, you suggest that maybe it’s because that’s what [heshe] likes in a lover.", parse);
				Text.NL();
				Text.Add("<i>“Maybe so. Alright then, lover. Have it your way. If you want to broadcast to everyone that you’re mine, I’m powerless to stop you,”</i> [heshe] teases, pointing at [hisher] collar. <i>“See you later, creamy,”</i> [heshe] says, gathering [hisher] [tarmorDesc] and leaving you.", parse);
				Text.NL();
				Text.Add("You blow the [foxvixen] a rather gooey kiss and set about gathering your things as well before setting off.", parse);
				
				terry.relation.IncreaseStat(80, 2);
			}
			
			func(opts);
		}, enabled : true,
		tooltip : tooltip
	});
	var tooltip = terry.Relation() < 30 ? Text.Parse("No, this is [hisher] mess and you want [himher] to clean up. That’s an order.", parse) :
	              terry.Relation() < 60 ? Text.Parse("Yes, you’d appreciate [hisher] help getting cleaned up.", parse) :
	              Text.Parse("If your lovely [foxvixen] is offering to help you clean up, you wouldn’t dream of saying no.", parse);
	options.push({ nameStr : "Clean Up",
		func : function() {
			Text.Clear();
			var towel = false;
			if(terry.Relation() < 30) {
				Text.Add("The moment [foxvixen] thinks to protest, [hisher] collar begins flashing faintly. You watch as [heshe] gasps, growing a bit flushed at the influences of the collar. <i>“Dammit, alright, alright. I’ll help you clean up. Let me just get a towel...”</i>", parse);
				towel = true;
			}
			else if(terry.Relation() < 60) {
				Text.Add("<i>“Alright, just wait a little bit,”</i> [heshe] tells you, wandering off to check on [hisher] pack. ", parse);
				if(terry.Slut() < 60) {
					Text.Add("After some rummaging, Terry returns with a towel. <i>“Just hold still and I’ll clean you up.”</i>", parse);
					Text.NL();
					Text.Add("Nodding your head in understanding, you sit up to make it easier for the [foxvixen] to towel you clean.", parse);
					towel = true;
				}
				else {
					Text.Add("After rummaging through [hisher] belongings, Terry returns with a waterskin. [HeShe] pops the top and takes a drink, sighing in relief at rehydrating. <i>“Alright, I’m ready.”</i>", parse);
					Text.NL();
					Text.Add("You’re pretty sure you know how the [foxvixen] intends to clean you up. Still, you decide to playfully ask what [heshe]’s up to. Just a waterskin is not enough to clean you up.", parse);
					Text.NL();
					Text.Add("<i>“Don’t be silly, [playername]. You should know what to expect of me after all we’ve been through. I’m going to eat you up,”</i> [heshe] says, licking [hisher] lips.", parse);
					Text.NL();
					Text.Add("[HeShe] just can’t resist a taste, can [heshe]? No matter, you’ll help [himher] up. You sit up to let [himher] have easier access.", parse);
				}
			}
			else {
				Text.Add("<i>“Of course you wouldn’t say no. If you did you’d miss the chance of groping me while I try to get you cleaned,”</i> [heshe] teases, wandering off toward [hisher] pack.", parse);
				Text.NL();
				Text.Add("[HeShe] knows you too well, you quip back, watching the seductive swishing of the [foxvixen]’s girlish hips as [heshe] goes.", parse);
				Text.NL();
				if(terry.Slut() < 40) {
					Text.Add("You close your eyes momentarily as you wait for the [foxvixen]’s return, when a towel flies in your direction, landing over your head. Moments later, Terry lifts it off your face. <i>“Come on, lazy bones. Get up so I can clean you up.”</i>", parse);
					Text.NL();
					Text.Add("Grinning, you sit up, holding your torso off the ground so that Terry can get at the semen coating your form. Your little [foxvixen] is certainly getting bold, isn’t [heshe]? You might have to punish [himher] for this later...", parse);
					Text.NL();
					Text.Add("<i>“Yes, yes. We all know what kind of punishment you have in store for me,”</i> [heshe] grins. <i>“Looking forward to it, honey. Now be quiet and let me work.”</i>", parse);
					Text.NL();
					Text.Add("Rolling your eyes but shutting your mouth, you do as the [foxvixen] instructs... for now, anyway.", parse);
					towel = true;
				}
				else {
					Text.Add("You close your eyes momentarily as you wait for the [foxvixen]’s return, when a pair of lips suddenly presses against your own. A familiar tongue darts into your mouth, taking advantage of your surprised gasp to do so.", parse);
					Text.NL();
					Text.Add("Happily, you sink into the welcome warm wetness of Terry’s kiss, your own [tongueDesc] rising to meet the returning visitor. The [foxvixen]’s taste sweeps its way across your senses as your tongues tangle together, lips hungrily consuming each other. You are just dimly reaching out to pull Terry into a hug when the [foxvixen] delicately breaks the kiss, nimbly stepping back out of reach of your dripping form.", parse);
					Text.NL();
					Text.Add("<i>“Hmm, tasty,”</i> the [foxvixen] remarks, licking [hisher] chops. <i>“Okay, now that my mouth is wet, I can start cleaning you up.”</i>", parse);
				}
			}
			Text.NL();
			if(towel) {
				Text.Add("The [foxvixen] starts with an arm, ensuring that the towel absorbs as much cum as it can. Naturally, there’s no way a single towel would be enough to absorb all the cum on you, but you decide to let Terry work that out by [himher]self.", parse);
				Text.NL();
				Text.Add("You hum quietly to yourself in pleasure as you feel the [foxvixen]’s careful, gentle strokes and pats along your [skinDesc] with the towel, patiently wiping the limb clean of [hisher] bountiful goo.", parse);
				Text.NL();
				Text.Add("Terry is quite thorough, even stroking along your palm and swiping between your fingers, until your arm is clean. Seeing [hisher] intent, you lower the now-cleaned limb, careful to not let it touch your still-dripping torso, and raise the second, the vulpine body-attendant daintily stepping around you and starting to work on it in turn.", parse);
				Text.NL();
				Text.Add("[HeShe] doesn’t dwell on it long, and by the time [heshe] moves to your head, the towel is more than a little soaked with fox-juice. <i>“Hold on.”</i> [HeShe] moves away to bat the towel, flinging off gobs of cum onto the floor. It works to some extent… the excess goop flies off the towel easily enough. But the towel is still pretty much caked with cum. However the [foxvixen] thief eases your worry when [heshe] opens up [hisher] waterskin to wash the towel a little.", parse);
				Text.NL();
				Text.Add("<i>“Close your eyes. I’m going to clean your head next,”</i> [heshe] instructs.", parse);
				Text.NL();
				Text.Add("Doing as you are told, you feel [hisher] gentle hands on your face, the damp material of the towel gliding smoothly over your [skinDesc]. You keep your eyes and your mouth shut, going limp to help Terry move your head from side to side, tilting it at various angles to help [himher] remove the excess semen from your facial features, running down the nape of your throat and brushing along your collarbone for good measure.", parse);
				Text.NL();
				Text.Add("<i>“Head is done,”</i> Terry remarks, moving down to your torso.", parse);
				Text.NL();
				if(player.FirstBreastRow().Size() > 3) {
					Text.Add("The [foxvixen] takes great care cleaning up your [breastsDesc]. Though unintentionally, it does feel kinda good when [heshe] rubs your breasts with the towel...", parse);
				}
				else {
					Text.Add("It doesn’t take much work for the [foxvixen] to be done with your torso and move on to the next area...", parse);
				}
				Text.NL();
				if(player.FirstCock()) {
					if(terry.Relation() < 30) {
						Text.Add("Terry is careful, almost wary, when cleaning your [multiCockDesc]. You can see the look of discomfort [heshe] gives when your hardened shaft[s] throb[notS] in [hisher] paws.", parse);
					}
					else if(terry.Relation() < 60) {
						Text.Add("Terry rubs your [multiCockDesc] with the towel. Up and down. Almost as if [heshe] was stroking you. <i>“Just cleaning you up, not stroking you. Don’t get any funny ideas,”</i> [heshe] says, a bit embarrassed.", parse);
						Text.NL();
						Text.Add("Feigning innocence, you assure [himher] that you wouldn’t <i>dream</i> of it.", parse);
					}
					else {
						Text.Add("Terry pays a lot of attention whilst cleaning your [multiCockDesc]. In fact, you’d say [heshe]’s paying too much attention. When [heshe] ditches the towel to rub your more sensitive spots, you’re pretty this is way more attention than you should get. At least if [heshe] intends to clean you.", parse);
						Text.NL();
						Text.Add("<i>“What? I gotta make sure you’re all clean, down here. Can’t miss a spot,”</i> [heshe] says with a mischievous smirk.", parse);
						Text.NL();
						Text.Add("That’s your Terry, alright. Smiling innocently back, you assure [himher] that you believe everything [heshe]’s saying. Why, surely [heshe] wouldn’t get carried away with something else when [heshe]’s so busy tending to you already.", parse);
						Text.NL();
						Text.Add("<i>“Of course not, you know better than anyone that I’m serious about getting the job done,”</i> [heshe] says, giving you another stroke.", parse);
					}
				}
				else if(player.FirstVag()) {
					if(terry.Relation() < 30) {
						Text.Add("Terry is pretty careful when it’s time to finally clean your [vagDesc]. [HeShe] stops momentarily as you twitch in pleasure when [heshe] touches you.", parse);
					}
					else if(terry.Relation() < 60) {
						Text.Add("A soft moan escapes you as Terry rubs your [vagDesc] with the towel.", parse);
						Text.NL();
						Text.Add("<i>“Do you really have to moan when I wipe it here?”</i>", parse);
						Text.NL();
						Text.Add("With a roll of your eyes, you assure the [foxvixen] that if your positions were reversed, [heshe] would be moaning even more.", parse);
						if(!terry.FirstVag())
							Text.Add(" Well, [heshe] knows what you mean.", parse);
						Text.NL();
						Text.Add("<i>“Alright, alright. I’ll be done shortly, so try to bear with it a little.”</i>", parse);
						Text.NL();
						Text.Add("You nod and promise [himher] that you can, gritting your teeth to try and help you resist the pleasure that Terry’s strokes are bringing you, however unintentionally.", parse);
					}
					else {
						Text.Add("Terry wipes your [vagDesc] vigorously, no doubt trying to ensure maximum pleasure while [heshe] takes care of your lower bits. <i>“Will you stop leaking already? I can’t clean you up if you keep wetting yourself right after,”</i> [heshe] jokingly complains.", parse);
						Text.NL();
						Text.Add("Gasping a little as [heshe] touches a particularly sensitive spot, you wish loudly that you could, but [heshe]’s just too good at this.", parse);
					}
				}
				Text.NL();
				Text.Add("<i>“Phew. Alright, I think that’s all. You’re as clean as I can make you without a bath,”</i> Terry declares, folding the towel and heading for [hisher] clothes.", parse);
				Text.NL();
				if(terry.Relation() < 30) {
					Text.Add("After a quick lookover, you nod your head in satisfaction. Thanking the [foxvixen] for [hisher] efforts, you tell [himher] that [heshe] can go now, if [heshe] wants.", parse);
					Text.NL();
					Text.Add("<i>“Right, thanks.”</i> The [foxvixen] gathers [hisher] things and leaves you.", parse);
				}
				else if(terry.Relation() < 60) {
					Text.Add("With a smile, you assure the [foxvixen] that [heshe] did a very good job with the tools [heshe] had. You’re very impressed.", parse);
					Text.NL();
					Text.Add("<i>“Thanks,”</i> [heshe] replies with a smile. <i>“I should probably get my stuff and go clean this towel up. If you don’t need me for anything else?”</i>", parse);
					Text.NL();
					Text.Add("You give the matter some thought, but ultimately shake your head, assuring Terry that you’re good now.", parse);
					Text.NL();
					Text.Add("<i>“Alright then. I guess I’ll see you later,”</i> [heshe] says, gathering [hisher] things and leaving you.", parse);
				}
				else {
					Text.Add("Playfully, you declare that you’d rather get a rubdown from Terry than a mere bath any day.", parse);
					Text.NL();
					Text.Add("<i>“Flatterer,”</i> [heshe] chuckles. <i>“Well, you know that all you gotta do is ask. I’ll come running to rub you down.”</i>", parse);
					Text.NL();
					Text.Add("With a grin, you assure [himher] that you never doubted that for a second.", parse);
					Text.NL();
					Text.Add("<i>“Good. Now if you’ll excuse me I need to clean this towel up.”</i>", parse);
					Text.NL();
					Text.Add("You wave a hand and assure Terry you’ll drop by later.", parse);
					Text.NL();
					Text.Add("[HeShe] gathers [hisher] things up and leaves you. For the moment at least.", parse);
				}
				Text.NL();
				Text.Add("With your vulpine attendant gone and [hisher] semen cleaned from your body, you set about grabbing your gear. Once satisfied you’re ready, you go back to what you were doing before.", parse);
			}
			else {
				Text.Add("The [foxvixen] starts with your [handDesc]s, sucking on each of your fingers in turn, and licking your palm.", parse);
				Text.NL();
				Text.Add("You repress a twitch as the vulpine daintily osculates at your digits, a ticklish sensation that ripples across your [skinDesc] with each lap of [hisher] little pink tongue. Despite yourself, your lips curl into a smile of pleasure and amusement, but you do your best to hold still, so as to not disrupt Terry’s work.", parse);
				Text.NL();
				Text.Add("[HeShe] licks [hisher] way up your arm, shoulder, and finally your cheek. There [heshe] spends a few moments leisurely licking your cheek and chin.", parse);
				Text.NL();
				Text.Add("You bite your lip, trying to hold back a giggle, unable to keep from wriggling your face instinctively away from the probing [foxvixen]’s tongue.", parse);
				Text.NL();
				Text.Add("Eventually the [foxvixen] stops and moves on to your other arm, repeating the process. Next up is the rest of your head. [HeShe] had already taken care of your cheeks, but there were still a few spots left. <i>“We’ll do your hair later, for now just close your eyes a bit,”</i> [heshe] says with a smile.", parse);
				Text.NL();
				Text.Add("You nod your head to show your understanding and then close your eyes as instructed.", parse);
				Text.NL();
				Text.Add("Terry sets about [hisher] task, tasting [himher]self on your [skinDesc] with each lap. When [heshe] reaches your lips, [heshe] wraps them into a kiss, licking around inside your mouth.", parse);
				Text.NL();
				Text.Add("Your [tongueDesc] immediately leaps up to meet this intruder in your mouth, playfully trying to wrestle the slick, nimble invader into submission. You narrowly fight back the urge to pull Terry into a hug, focusing instead on the vulpine tongue and the taste of Terry in your mouth. The two of you moan softly into each other’s lips, tongues wriggling wetly, with you trying to push Terry’s tongue back into [hisher] mouth so you can return the favor.", parse);
				Text.NL();
				Text.Add("The [foxvixen] holds out valiantly, but cannot withstand your onslaught, and soon it is your tongue that is exploring every nook and crevice of [hisher] mouth. [HisHer] taste washes over your tongue, rich and strong, sharp teeth pointed when your wriggling appendage brushes against them.", parse);
				Text.NL();
				Text.Add("You press your advantage, savoring your dominance over your vulpine lover’s mouth, then slowly and deliberately withdraw. Your lips break away with a soft sigh, and you can feel the cool air tingling on your tongue as it glides back into your mouth, anchored to Terry’s tongue for a moment by a tenuous string of saliva that snaps as your lips close.", parse);
				Text.NL();
				parse["pet"] = terry.Relation() >= 60 ? "lover" : "pet";
				Text.Add("Swallowing, the [foxvixen] smiles, a bit flustered. <i>“That was pretty good, but back to business.”</i> [HeShe] leans closer to lap around your lips before moving down your neck. Dainty handpaws gently push you down by your shoulders, trying to get you to lie down as your foxy [pet] straddles your chest.", parse);
				if(player.FirstBreastRow().Size() > 3 && terry.HorseCock())
					Text.Add("As close as [heshe] is, you can easily feel [hisher] proud stallionhood slapping against your chest. Half-erect from the kinky [foxvixen]’s own ministrations to you, it falls naturally into the valley of your [breastsDesc], gliding back and forth with each unthinking thrust and twitch of [hisher] hips.", parse);
				Text.NL();
				Text.Add("After a moment’s struggle, you decide to give in to Terry’s unspoken request, allowing [himher] to pin you gently back against the ground and resting your hands at your sides. You look up at [himher] with amusement, waiting to see what your kinky little [foxvixen] has in mind from here, feeling [himher] carefully shift [hisher] weight atop your torso.", parse);
				Text.NL();
				Text.Add("Terry slides [hisher] way down your body, ", parse);
				if(terry.FirstCock()) {
					Text.Add("letting [hisher] shaft rub against your creamy [skinDesc] as [heshe] crawls to begin licking your chest. You can feel [himher] gently thrusting against you, rubbing [himher]self on you as [heshe] grows back to full mast.", parse);
				}
				else {
					Text.Add("letting [hisher] vagina purposely rub against your creamy [skinDesc]. [HeShe] moans in pleasure, trails of [hisher] arousal joining the seed on your body, adding to the mess.", parse);
				}
				Text.NL();
				Text.Add("Despite this, [hisher] attention lies on your [breastsDesc] and your [nipsDesc]. [HeShe] licks [hisher] lips before homing in on the closest target, closing [hisher] mouth around your [nipDesc] and slurping it like a lollypop.", parse);
				Text.NL();
				parse["leaking"] = player.Lactation() ? " leaking" : "";
				Text.Add("You moan softly in appreciation, feeling your[leaking] nipple perking in [hisher] mouth. Unthinkingly, you push up with your elbows, raising your torso a little in an effort to push more of your breast into the suckling [foxvixen]’s mouth.", parse);
				Text.NL();
				Text.Add("[HeShe] repeats the process on your other nipple, then moves back down. ", parse);
				if(player.FirstCock())
					Text.Add("By now [hisher] erect shaft is actively frigging[oneof] your [multiCockDesc]. [HisHer] hard horse-cock feels so good against your own [cockDesc] that you can’t resist humping back at [himher].", parse);
				else
					Text.Add("By now [hisher] erect shaft is rubbing against your groin. The shallow movements of the [foxvixen]’s hips rubbing that tasty piece of horse-meat up and down. If only [heshe] moved a little lower...", parse);
				Text.NL();
				Text.Add("You shudder and cry out, wriggling under the vulpine form pinning you as a warm wet tongue glides ticklishly over your navel. Mischievously, Terry slurps and laps at your bellybutton, as if trying to nurse it, the ticklish sensation leaving you writhing beneath [himher]. You try to hold out, but soon [heshe] has you laughing at the sensation, trying your best to beg [himher] for mercy in between giggling fits.", parse);
				Text.NL();
				Text.Add("But Terry shows you no remorse, [hisher] tongue steadily gliding out to lap circles around your belly. ", parse);
				var womb = player.PregHandler().Womb();
				var preg = womb && womb.pregnant;
				if(preg && womb.progress > 0.3) {
					if(womb.progress > 0.6) {
						parse["babyCheck"] = "baby"; //TODO baby
						Text.Add("With the [babyCheck] inside of you so close to term, [heshe] certainly has plenty of belly to lick. The stretched, swollen orb of flesh invites ceaseless attentions, long languid strokes of the [foxvixen]’s tongue tingling on your sensitive skin. Terry shows no signs of halting at the work [heshe] has to do; [heshe] just keeps on licking and suckling until your baby-bloated belly is practically shining clean.", parse);
					}
					else {
						Text.Add("The dome of your stomach gives the [foxvixen] an abundance to lick at, and [heshe] attacks it with zeal. Your skin tingles deliciously as [heshe] painstakingly laps away, each smooth stroke removing more and more of the vulpine seed smeared across its bulging sides.", parse);
					}
				}
				else {
					Text.Add("Industriously licking away, it doesn’t take Terry very long to have wiped your gut clean of all the semen that dripped and oozed its way down there.", parse);
				}
				Text.NL();
				if(player.FirstCock()) {
					Text.Add("<i>“What a lovely sight,”</i> the [foxvixen] says, looking at your creamy [multiCockDesc]. <i>“Here, let me clean this up for you.”</i> Terry picks[oneof] your [multiCockDesc] and leans over it, letting [hisher] hot breath caress your cum caked [cockDesc].", parse);
					Text.NL();
					Text.Add("Your shudder at the sensation of hot wind chasing over your seed-slick shaft turns into an open moan as you feel the [foxvixen]’s hot, wet mouth wrapping itself hungrily around your length. Instinctively you buck your hips, feeding yourself as deep into Terry’s mouth as [heshe]’s willing to take you.", parse);
					Text.NL();
					Text.Add("The lusty [foxvixen] wastes no time and begins milking your [cockDesc] for its creamy prize. You tease your pet for [hisher] slutty behavior, which prompts [himher] to pull away with a smirk. <i>“And whose fault is it that I’m like this?”</i> [heshe] asks teasingly.", parse);
					Text.NL();
					Text.Add("You are forced to confess that it’s your fault.", parse);
					Text.NL();
					Text.Add("<i>“Then can it and feed me. Mine is tasty too, but I need some variance in my meal.”</i>", parse);
					Text.NL();
					Text.Add("Any thoughts you might have about teasing your slutty little [foxvixen] are blown away as [hisher] mouth expertly engulfs you again. Your [cockDesc] is rockhard by this point, and [heshe] lewdly slurps and suckles away, making you moan and thrust your hips, mindlessly anxious for [hisher] hungry lips and tongue.", parse);
					Text.NL();
					Text.Add("Terry’s become pretty good at this. [HisHer] tongue massages you in all the key spots [heshe]’s come to know so well. As you face-fuck your pet [foxvixen], you come to realize that your hips are moving of their own accord. Not that either of you are complaining at this point. Suddenly, you feel [himher] take you all the way, as deep into [hisher] muzzle as [heshe] can. The feeling of [hisher] throat closing down on your shaft is the last straw.", parse);
					Text.NL();
					
					var cum = player.OrgasmCum();
					
					Text.Add("With a jubilant howl of pleasure, you empty yourself into Terry’s waiting belly, shedding a nice-sized gush of seed down [hisher] throat. [HeShe] sucks hungrily, gulping down each gush, until you finally finish, confident that you have given [hisher] stomach a nice whitewash.", parse);
					Text.NL();
					Text.Add("As you slump panting back against the ground, Terry wetly pops [hisher] mouth free of your glans, smacking [hisher] lips daintily as [heshe] does.", parse);
					Text.NL();
					Text.Add("<i>“Hmm, so tasty,”</i> the [foxvixen] comments, licking [hisher] lips and wiping a small strand that escaped [hisher] hungry maw.", parse);
					Text.NL();
					Text.Add("Sucking in a lungful of air, you manage to smirk and assure Terry that you’re glad [heshe] approves.", parse);
				}
				else if(player.FirstVag()) {
					Text.Add("The feel of your pet [foxvixen]’s tongue, lapping at your labia sends jolts of pleasure racing through your spine, and you find yourself moaning and shuddering as you feel [hisher] tongue invade your [vagDesc].", parse);
					Text.NL();
					Text.Add("Your fingers clutch unthinkingly at the ground under you, your mind clouded by a haze of pleasure. Gasping for breath, clutching at the straws of consciousness, you pant out a query, asking Terry what made [himher] change [hisher] mind. You thought [heshe] was supposed to be cleaning you up...", parse);
					Text.NL();
					Text.Add("Stopping momentarily to chuckle, the [foxvixen] replies, <i>“I am going to clean you up, just thought I’d get a drink first. Something sweet and tasty to wash down all this semen.”</i>", parse);
					Text.NL();
					Text.Add("As you feel [hisher] tongue caress your [clitDesc] again, you moan in pleasure, assuring [himher] that [heshe] can drink all [heshe] wants, just please, keep doing that!", parse);
					Text.NL();
					Text.Add("Terry engulfs your [vagDesc], letting [hisher] tongue drill into your muff, draining it of your precious juices. Which you’re only too glad to give [himher]. ", parse);
					Text.NL();
					
					var cum = player.OrgasmCum();
					
					Text.Add("With a shriek of ecstasy, your whole body shudders in climax, gushing your feminine juices into the [foxvixen]’s ever-hungry mouth. [HeShe] practically inhales your honey, gulping it down until every last drop is gone, then carefully licks around to remove the last vestiges from your flower. You can only moan weakly in bliss until [heshe] finally deigns to lift [hisher] face from your folds.", parse);
					Text.NL();
					Text.Add("<i>“Hmm, that hit the spot. [playername], your juices are like a drug. The more I drink them, the more I like them,”</i> [heshe] praises you.", parse);
					Text.NL();
					Text.Add("Panting for breath, you dreamily thank Terry for having such a high opinion of them.", parse);
				}
				Text.NL();
				Text.Add("As you relax, enjoying your afterglow, Terry finishes up the rest of your body. Sure you’re clean of [hisher] semen. But now you’re covered in [foxvixen] slobber!", parse);
				Text.NL();
				Text.Add("<i>“Can’t win them all,”</i> the [foxvixen] chuckles. <i>“Anyway, I think this is as good as it’ll get without a bath proper. Anything else you need me for?”</i>", parse);
				Text.NL();
				Text.Add("You shake your head, assuring the [foxvixen] that you’re fine now.", parse);
				Text.NL();
				Text.Add("<i>“Alright then. If you’ll excuse me, I think I’ll be going, but I had fun. So let’s do that again some other time,”</i> [heshe] grins.", parse);
				Text.NL();
				Text.Add("You assure Terry that you won’t forget about trying this again. ", parse);
				if(party.InParty(terry))
					Text.Add("You gather your own gear, and set off along with the grinning [foxvixen].", parse);
				else
					Text.Add("You wave [himher] goodbye, gather your own gear, and set off on your separate ways.", parse);
				
				terry.relation.IncreaseStat(75, 2);
			}
			
			func(opts);
		}, enabled : true,
		tooltip : tooltip
	});
	Gui.SetButtonsFromList(options, false, null);
}
// Terry cleans PC Exit Point


Scenes.Terry.FuckedByBunnyMob = function(male, parse) {
	if(terry.Slut() < 45) {
		Text.Add("<i>“Whoa, wait you bunch of pervs! I didn’t- mmf!”</i> Terry’s protests get immediately silenced as one of the males kiss [himher] straight on the lips. ", parse);
		if(terry.PronounGender() == Gender.male)
			Text.Add("Maybe because Terry looks just so girly...", parse);
		else
			Text.Add("It seems the lagomorphs are incapable of resisting Terry’s charms...", parse);
	}
	else
		Text.Add("<i>“Hey! No need to push I’m strip- mmf!”</i> Terry has no time to finish before one of the taller bunnies decides to keep [hisher] muzzle shut with a kiss. After the initial surprise the slutty [foxvixen] is quick to kiss back. Maybe you should punish [himher] for being so forward...", parse);
	Text.NL();
	Text.Add("Your [foxvixen] is undressed in record time. [HisHer] clothing discarded carelessly as the lagomorphs push [himher] down toward the ground. ", parse);
	if(terry.Cup() < Terry.Breasts.Ccup) {
		Text.Add("One of the rabbits immediately jumps on [hisher] chest, rubbing his erect cock on the [foxvixen]’s nipples.", parse);
		if(terry.Lactation()) {
			Text.NL();
			Text.Add("A small droplet of milk beads on [hisher] nipple, and the male immediately replaces his cock with his mouth, drinking from Terry as another bunny takes the other breast. You can’t see very well from your position, but you’re pretty you can see them fapping as they suck. Looks like Terry is in for a creamy finish.", parse);
			//TODO Drink milk
		}
	}
	else {
		Text.Add("One of the rabbits immediately straddles Terry’s bosom, holding [hisher] boobs tightly together as the bunny male inserts his dick in-between the [foxvixen]’s pillowy orbs.", parse);
		if(terry.Lactation()) {
			Text.NL();
			Text.Add("A few droplets of milk moistens the lagomorph’s handpaws, and he withdraws them with a surprised squeak. A pair of his siblings quickly replace his hands with eager mouths, though. They squeeze your pet [foxvixen]’s bosom, intent on draining each orb of their liquid load.", parse);
			//TODO Drink milk
		}
	}
	Text.NL();
	if(terry.HorseCock()) {
		Text.Add("A pair of lagomorphs looks at the [foxvixen]’s enormous spire of horse-meat. Already at full mast and positively towering. The bunny-sluts are already drooling at the sight, and you’re pretty sure of their intentions when they decide to pounch on Terry’s cock. They lick and kiss the length like a long-lost lover, caressing [hisher] balls and bathing themselves on the [foxvixen]’s pre.", parse);
		Text.NL();
		
		Sex.Blowjob(male, terry);
		male.FuckOral(male.Mouth(), terry.FirstCock(), 2);
		terry.Fuck(terry.FirstCock(), 2);
	}
	else if(terry.FirstCock()) {
		Text.Add("One of the lagomorphs decides to have a taste of Terry’s cute fox-pecker. And like a practiced slut, the bunny takes the entire shaft in one long gulp. Knot and all. He suckles on Terry’s shaft with abandon, eager for some fox cream. And from the looks of it, Terry is eager to give him some too.", parse);
		Text.NL();
		
		Sex.Blowjob(male, terry);
		male.FuckOral(male.Mouth(), terry.FirstCock(), 2);
		terry.Fuck(terry.FirstCock(), 2);
	}
	var pussy = false;
	if(terry.FirstVag()) {
		var virgin = terry.FirstVag().virgin;
		parse["virgin"] = virgin ? " virgin" : "";
		Text.Add("Lifting one of the [foxvixen]’s legs, one of the bunnies easily finds Terry’s[virgin] pussy. He thrusts mercilessly, plunging his small pecker into Terry’s depths. ", parse);
		if(virgin)
			Text.Add("Robbed of [hisher] virginity, Terry screams in both pain and pleasure, muffled by the lagomorph kissing [himher].", parse);
		else
			Text.Add("Terry cries out in pleasure as the lagomorph’s sibling continues to kiss [hisher], effectively muffly [himher].", parse);
		Text.NL();
		
		Sex.Vaginal(male, terry);
		terry.FuckVag(terry.FirstVag(), male.FirstCock(), 3);
		male.Fuck(male.FirstCock(), 3);
		pussy = true;
	}
	Text.Add("The rabbit kissing Terry decides he’s had enough, and replaces his mouth with a cock, already erect and dripping pre for the [foxvixen] to suckle. Overcome by lust, Terry wastes no time in opening [hisher] muzzle invitingly and letting the rabbit plunge his petite shaft into the [foxvixen]’s muzzle.", parse);
	Text.NL();
	if(!pussy) {
		var avirgin = terry.Butt().virgin;
		Text.Add("Terry moans as another bunny decides to play with [hisher] butt, lubing it up with tiny laps of his tongue. ", parse);
		if(avirgin) {
			Text.Add("As the lagomorph aligns his shaft, Terry immediately pushes the rabbit on top of [himher] away.", parse);
			Text.NL();
			Text.Add("<i>“No! Not my ass!”</i> [heshe] exclaims authoritatively. The bunnies crowding [himher] are stunned at [hisher] strong reaction, but quickly resume their activities. The one that was preparing to take [hisher] butt instead decides to simply stick to rimming [himher]. While the first rabbit pushes his cock against Terry’s lips once more.", parse);
			Text.NL();
		}
		else {
			Text.Add("Terry spread [hisher] legs wider, glaring lustily at the rabbit rimming [himher]. Quick to catch on, the lagomorph immediately replaces his mouth with his dick, and in a few pokes he’s plunging into the [foxvixen]’s anal passage, drawing a whorish moan from the [foxvixen]-slut.", parse);
			Text.NL();
			
			Sex.Anal(male, terry);
			terry.FuckAnal(terry.Butt(), male.FirstCock(), 3);
			male.Fuck(male.FirstCock(), 3);
		}
	}
	Text.Add("You watch as the bunnies have their fun with your pet [foxvixen] before you decide to leave them to their own devices.", parse);
	Text.NL();
	
	var cum = terry.OrgasmCum();
}

Scenes.Terry.SexPitchVaginal = function(cocks) {
	var p1cock  = player.BiggestCock(cocks);
	var strapon = p1cock.isStrapon;
	
	var parse = {
		playername  : player.name,
		master      : player.mfTrue("master", "mistress"),
		foxvixen    : terry.mfPronoun("fox", "vixen"),
		fox         : terry.HorseCock() ? "horse" : "fox",
		armorDesc   : function() { return player.ArmorDesc(); },
		skinDesc    : function() { return player.SkinDesc(); },
		legsDesc    : function() { return player.LegsDesc(); },
		hipsDesc    : function() { return player.HipsDesc(); },
		thighsDesc  : function() { return player.ThighsDesc(); },
		tongueDesc  : function() { return player.TongueDesc(); },
		breastsDesc : function() { return player.FirstBreastRow().Short(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		cockDesc    : function() { return p1cock.Short(); },
		cockTip     : function() { return p1cock.TipShort(); },
		vagDesc     : function() { return player.FirstVag() ? player.FirstVag().Short() : "taint"; },
		clitDesc    : function() { return player.FirstVag() ? player.FirstVag().ClitShort() : p1cock.Short(); },
		nipsDesc    : function() { return player.FirstBreastRow().NipsShort(); },
		buttDesc    : function() { return player.Butt().Short(); },
		tcockDesc   : function() { return terry.FirstCock().Short(); },
		tcockTip    : function() { return terry.FirstCock().TipShort(); },
		tvagDesc    : function() { return terry.FirstVag().Short(); },
		tanusDesc   : function() { return terry.Butt().AnalShort(); },
		tbreastDesc : function() { return terry.FirstBreastRow().Short(); },
		boygirl     : player.mfTrue("boy", "girl")
	};
	
	var p2cock;
	if(player.NumCocks() > 1) {
		var allCocks = player.AllCocksCopy();
		for(var i = 0; i < allCocks.length; i++) {
			if(allCocks[i] == p1cock) {
				allCocks.remove(i);
				break;
			}
		}
		p2cock = player.BiggestCock(allCocks);
		
		parse["multiCockDesc2"] = player.MultiCockDesc(allCocks);
	}
	
	var virgin = terry.FirstVag().virgin;
	var virginFirst = terry.PussyVirgin();
	
	parse = terry.ParserPronouns(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	parse["stuttername"] = player.name[0] + "-" + player.name;
	
	Text.Clear();
	if(terry.Relation() < 30) {
		Text.Add("<i>“Umm, I’m not so sure about this...”</i> Seems like Terry is not so receptive to the idea of being penetrated.", parse);
		if(!virginFirst)
			Text.Add(" Even tho it’s not [hisher] first time.", parse);
		Text.NL();
		Text.Add("Smiling gently, you reach out and take [hisher] hands, swearing to [himher] that it’s okay, you’ll be gentle with [himher].", parse);
		Text.NL();
		Text.Add("<i>“O-Okay. It’s not like I have a choice anyway...”</i>", parse);
	}
	else if(terry.Relation() < 60) {
		Text.Add("<i>“Okay, just remember to be gentle.”</i>", parse);
		Text.NL();
		Text.Add("You promise [himher] that you will try to be as gentle as you can.", parse);
	}
	else {
		Text.Add("<i>“Good, I was craving some meat between my legs,”</i> [heshe] giggles.", parse);
		Text.NL();
		parse["lady"] = terry.mfPronoun("'lady'", "lady");
		Text.Add("Well, you’re certainly happy to oblige; anything your [lady] desires...", parse);
		Text.NL();
		Text.Add("<i>“If you got time to be cheeky, you also have time for foreplay. So why haven’t you started yet? And why are you still dressed?”</i>", parse);
	}
	Text.NL();
	Text.Add("One eye focused on the naked [foxvixen] before you, you make short work of your own [armorDesc], stripping away your clothes until you’re standing before [himher] equally naked. ", parse);
	if(strapon)
		Text.Add("You quickly check your [cockDesc], making sure that it’s properly secured to its place. Don’t want it to fall out while you’re fucking Terry, after all.", parse);
	else
		Text.Add("Your own erect [multiCockDesc] stands proudly before you, signalling your readiness to begin whenever Terry gives the okay.", parse);
	Text.NL();
	
	if(virgin) {
		if(virginFirst) {
			Text.Add("<i>“Listen, I… well… common knowledge is that it always hurts the first time. So can you go slowly? Give me time to adjust?”</i>", parse);
			Text.NL();
			Text.Add("Nodding your head, you give [himher] your word. Everyone knows virgins need a delicate touch, and virgins who were once boys especially so.", parse);
			Text.NL();
			Text.Add("<i>“Alright, I’m trusting you.”</i>", parse);
			
			terry.flags["vFirst"] = 1;
			
			terry.slut.IncreaseStat(100, 2);
			terry.relation.IncreaseStat(100, 1);
		}
		else {
			Text.Add("<i>“Hope you’ll take your time before you start humping. After all, you’ll be popping my cherry all over again, and that hurts!”</i>", parse);
			Text.NL();
			Text.Add("With a nod and a reassuring smile, you assure the [foxvixen] that you haven’t forgotten what [heshe] needs.", parse);
			Text.NL();
			Text.Add("<i>“Okay, we’re set then. Let’s go, I guess.”</i>", parse);
			
			terry.slut.IncreaseStat(100, 2);
		}
	}
	else {
		Text.Add("<i>“Alright then, some foreplay before we get down to business?”</i>", parse);
		Text.NL();
		Text.Add("Why not? After all, you know how much [heshe] likes it better when you play around first.", parse);
	}
	Text.Flush();
	
	//[Kiss][Hands][Lick][Dildo]
	var options = new Array();
	options.push({ nameStr : "Kiss",
		func : function() {
			Text.Clear();
			Text.Add("With a smile, you cross the distance between yourself and the [foxvixen], hands reaching out to gently but authoritatively take hold of [hisher] cheeks. [HisHer] blue eyes flick about instinctively before your lips dip in and cover [hisher] own. Softly, at first, a tender press of flesh on flesh. But as your ardor builds, you kiss the [foxvixen] harder, more insistently, sliding closer and closer to [himher] so you can try and dominate [hisher] mouth.", parse);
			Text.NL();
			Text.Add("Terry is a bit taken by surprise initially, but [heshe] quickly reciprocates, tail wagging slowly behind as [hisher] eyes close. [HisHer] tongue wrestles with yours, and [heshe] moans a little as you twist your heads slightly to deepen the kiss.", parse);
			Text.NL();
			parse["slender"] = terry.PregHandler().BellySize() > 0.2 ? "pregnancy-swollen" : "slender";
			Text.Add("As your tongues tangle together in the [foxvixen]’s mouth, your hand rises as if on autopilot, skimming the fur of Terry’s [slender] form to reach for [hisher] chest. ", parse);
			if(terry.Cup() >= Terry.Breasts.Acup)
				Text.Add("Your fingers splay around the vulpine breast, cupping it as best you can. You caress and squeeze it, fingers kneading the soft and sensitive flesh, thumb rubbing itself ardently against the perky nipple, coaxing it to pebble under your touch.", parse);
			else
				Text.Add("With no breasts to speak of, your fingers zero in on Terry’s nipple. You pinch it between forefinger and thumb, slowly rubbing and teasing it, nipping it just hard enough to add an extra spark. Your efforts bear fruit, coaxing it into a little pink pebble of arousal-stiffened flesh.", parse);
			Text.NL();
			Text.Add("The [foxvixen] moans into the kiss, but otherwise doesn’t protest your ministrations. In fact, [heshe] leans closer, [hisher] own hands setting themselves on your [hipsDesc]. You’ve been kissing for a while now, but neither of you feel the need to break just yet.", parse);
			Text.NL();
			Text.Add("Your other hand glides over the [foxvixen]’s womanly hip to reach for the heart-shaped perkiness of [hisher] butt. Fingers cup one bountiful cheek and squeeze possessively, amorously kneading at the tight, firm flesh, delighting in the way it squishes between your fingers.", parse);
			Text.NL();
			Text.Add("Terry breaks the kiss momentarily to gasp. <i>“Perv...”</i> [heshe] utters, almost inaudibly.", parse);
			Text.NL();
			parse["leg"] = player.LowerBodyType() != LowerBodyType.Single ? "leg" : "tail"; //TODO slime
			parse["c"] = terry.FirstCock() ? Text.Parse(", not that [hisher] erect [tcockDesc] poking against you wasn’t enough of an indication already", parse) : "";
			Text.Add("Like [heshe] doesn’t love it, you retort, before covering [hisher] mouth again with possessive firmness. Close as you are, you can easily use your [leg] to start grinding at [hisher] arousal-clenched thighs, slowly spreading them and allowing you to work your own [multiCockDesc] in-between them to rub against [hisher] rapidly moistening pussy. It’s pretty clear that the [foxvixen] arousal is already peaking[c].", parse);
			if(terry.HorseCock())
				Text.Add(" You’re surprised you didn’t notice it earlier, given how huge [heshe] is.", parse);
			Text.NL();
			Text.Add("Terry grinds back against you, moaning softly as [heshe] feels[oneof] your [multiCockDesc] rubbing against [hisher] pussy. [HeShe] stands on shaky legs, maybe you should sit down before the [foxvixen] loses [hisher] balance.", parse);
			Text.NL();
			Text.Add("The scent of Terry’s drooling cunt fills your nostrils as you finally deign to break the kiss, the panting, glaze-eyed [foxvixen] staring at you longingly. Wrapping [himher] gently in your arms, you sit down, tenderly guiding the [foxvixen] to straddle you. You let[oneof] your [multiCockDesc] nestle against Terry’s wet pussy, and ask [himher] if [heshe]’s ready to start.", parse);
			Text.NL();
			Text.Add("Your only reply is a soft nod.", parse);
			Text.Flush();
			
			terry.AddLustFraction(0.5);
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : Text.Parse("A nice makeout session should be just the thing to put your [foxvixen] in the mood.", parse)
	});
	options.push({ nameStr : "Hands",
		func : function() {
			Text.Clear();
			Text.Add("Closing the distance between you, your arms reach out and gently embrace the [foxvixen], pulling [himher] into a tender hug, feeling [himher] rest [hisher] head against your collarbone. You hold [himher] like that for a few moments, gently stroking [hisher] hair, then let the [foxvixen] go in order to seat yourself upon the ground, guiding Terry down into your lap and instructing [himher] to straddle you.", parse);
			Text.NL();
			Text.Add("Terry does exactly as you instructed, moaning softly as[oneof] your [multiCockDesc] rubs against [hisher] [tvagDesc]. You push your [multiCockDesc] below the [foxvixen], letting them emerge from behind [himher]. ", parse);
			if(terry.Relation() < 30)
				Text.Add("Terry looks a bit uneasy in this position, but [heshe] also looks at you with undeniable lust in [hisher] eyes. It’s difficult to tell which one is the strongest emotion.", parse);
			else if(terry.Relation() < 60)
				Text.Add("Terry doesn’t look all that comfortable at first, but after some wiggling [heshe] finds the best position to straddle you in. [HeShe] looks at you and smiles softly.", parse);
			else {
				Text.Add("Terry smiles as [heshe] adjusts [himher]self in your lap, embracing you with outstretched arm.", parse);
				if(terry.FirstCock())
					Text.Add(" You feel [hisher] [tcockDesc] throb gently against your belly.", parse);
			}
			Text.NL();
			Text.Add("Seeing Terry is ready to go, you decide to start with the obvious, and so your hands reach toward the [foxvixen]’s chest. ", parse);
			if(terry.Cup() < Terry.Breasts.Acup) {
				Text.Add("Of course, Terry has no bosom, even if [heshe] does have a perfectly feminine flower between [hisher] legs. But that still leaves a pair of pearl-pink nipples to play with, and your fingers gravitate toward them inevitably.", parse);
				Text.NL();
				Text.Add("With expert precision your digits trace circles, starting at the fur just past the areola before spiralling in, flicking the nipples back and forth with tiny twitches of fingertip. You caress and rub, going so far as to take the pebbling nipples between thumb and forefinger in a not-unpleasant pinch that lets you gently grind on the sensitive flesh. ", parse);
			}
			else if(terry.Cup() < Terry.Breasts.Ccup) {
				Text.Add("Terry’s small, perky breasts match [hisher] slender build just perfectly, easily fitting into your hands.", parse);
				Text.NL();
				Text.Add("Though too small and firm to really squish, you can still knead them like dough and that is what you proceed to do. Your thumbs rub each nipple in circles, stroking them back and forth as you cup and squeeze at [hisher] breasts.", parse);
			}
			else if(terry.Cup() < Terry.Breasts.Dcup) {
				Text.Add("Stretching the limits of what would fit a [foxvixen] as petitely built as Terry, the bountiful C-cups are almost too large to hold with a single hand, leaving you cupping generously at the toned, perky breasts.", parse);
				Text.NL();
				Text.Add("As best you can, you massage them with thumbs and fingers, kneading the flesh that squishes so delightfully between your digits and stroking at the nipples. You gently heft them up from Terry’s chest, marveling at their weight, caressing them with tender possessiveness.", parse);
			}
			else {
				Text.Add("[HisHer] bountiful breasts, so large as to be out of place on [hisher] small, slender frame, draw your hands like iron filings to a magnet. So large that a single hand alone strains to even try and cup a singular one, you find yourself needing to devote both hands to each one in turn.", parse);
				Text.NL();
				Text.Add("The weight of them in your hands is a palpable thing, and there is more than enough flesh to caress and stroke. Fingers sink into luxuriant fur-wrapped boobflesh, groping shamelessly, more than enough for you to focus on caressing with one hand as the other plays with the nipple, pinching and squeezing, tugging lightly.", parse);
				Text.NL();
				Text.Add("You play with one breast to your heart’s content, then switch over to the other, lavishing the same attention on it before switching back to the first.", parse);
			}
			Text.NL();
			parse["breasts"] = terry.Cup() < Terry.Breasts.Acup ? "breasts" : "nipples";
			parse["boobs"] = terry.Cup() < Terry.Breasts.Acup ? "boobs" : "nipples";
			Text.Add("<i>“Ah!”</i> the [foxvixen] cries out as you play with [hisher] [breasts]. <i>“H-Hey, I thought you were going to do me. Not play around with my [boobs],”</i> [heshe] teases you, stifling another moan.", parse);
			Text.NL();
			Text.Add("All in due time, you quip back. First of all, you think some foreplay is in order. Just to get [himher] started. And [hisher] [breasts] sure seem to be the quickest way to get [himher] going.", parse);
			Text.NL();
			if(terry.Relation() < 30) {
				Text.Add("The [foxvixen] doesn’t say anything, instead [heshe] continues to try and stifle [hisher] moans as you work [himher] into a soft pant.", parse);
			}
			else if(terry.Relation() < 60) {
				Text.Add("<i>“Oh! Get me going, huh?”</i> [heshe] replies, panting softly.", parse);
				Text.NL();
				Text.Add("You chuckle and tell [himher] that you can’t just start on [himher] without enjoying [himher] a little...", parse);
			}
			else {
				Text.Add("<i>“Get me going? What kind of teasing remark is that? How about <b>I</b> get <b>you</b> ‘going’, big [boygirl],”</i> Terry huskily replies, reaching over to twist one of your [nipsDesc].", parse);
				Text.NL();
				Text.Add("You moan in pleased surprise, body tensing at the sensation that spikes under your skin. In shock, you whisper Terry’s name, shaking your head and managing a weak laugh at how far [heshe]’s come from the sexual innocent [heshe] was.", parse);
				Text.NL();
				Text.Add("<i>“So, you going to pick-up the pace or do I have to take charge?”</i> [heshe] grins mischievously.", parse);
				Text.NL();
				Text.Add("Oh, you’ll pick up the pace alright...", parse);
			}
			Text.NL();
			Text.Add("Abandoning Terry’s chest, your hands roam down [hisher] body, heading for [hisher] lower half.", parse);
			Text.NL();
			if(terry.FirstCock()) {
				if(terry.HorseCock()) {
					Text.Add("Naturally, your hands first stop at the magnificent pillar of equine meat jutting so erroneously between Terry’s dainty thighs. You know you need to be careful here, lest your teasing of the over-sensitive flesh makes Terry cum before you want [himher] to.", parse);
					Text.NL();
					Text.Add("Your fingers curl possessively around Terry’s ample cockflesh, sliding back and forth in smooth even strokes, tracing the bluntness of [hisher] glans and teasing back along its upper side. You reach for the swollen fullness of [hisher] balls, setting them swaying playfully with gentle nudges of your fingers, fondling them as if to gauge their ripeness.", parse);
				}
				else
					Text.Add("The almost dainty foxhood laying between Terry’s thighs is a natural step for you. You caress the base, just above the sheathe, feeling the promise there of [hisher] knot before gliding your fingers back and forth along its upper side. You pinch the pointed tip gently between your fingers, then caress the shaft with your palm. You cup [hisher] dainty little balls in your palm and knead them softly, feeling the promise of seed within.", parse);
			}
			else
				Text.Add("Though it is too soon to play with Terry’s cunt properly, you can still tease [himher] a little. Your fingers stroke just above [hisher] pussy, rubbing gently at the hood above [hisher] clitoris, trailing the outer lips with one questing finger.", parse);
			Text.NL();
			Text.Add("<i>“Ah! If you keep playing with me like that you’re going to make me cum!”</i> Terry cries out in warning as [heshe] tries to grind [himher]self against you, enjoying your loving caress to the fullest.", parse);
			Text.NL();
			Text.Add("You shake your head in gentle reproach; you can’t have that, now can you? Even as you ask this, your fingers removes themselves from Terry’s loins, your hands resting idly upon [hisher] thighs instead as you wait for [himher] to get back under control.", parse);
			Text.NL();
			Text.Add("Terry leans onto you, resting [hisher] head on your shoulder. <i>“Kinda disappointed you stopped,”</i> [heshe] remarks, still panting.", parse);
			Text.NL();
			Text.Add("It’s only until [heshe] isn’t so close to [hisher] climax, you assure the [foxvixen].", parse);
			Text.NL();
			Text.Add("<i>“Just give me some time.”</i>", parse);
			Text.NL();
			Text.Add("You nod your head in understanding, letting the [foxvixen] rest against you in companionable silence for a few long moments.", parse);
			Text.NL();
			parse["t"] = terry.FirstCock() ? Text.Parse(", despite the fact that [hisher] [tcockDesc] is still rock-hard and throbbing against you", parse) : "";
			Text.Add("<i>“Okay, I guess I’m good now,”</i> Terry declares[t].", parse);
			Text.NL();
			Text.Add("Well if [heshe] says so, then you should be getting ready for the main event. You smile at the [foxvixen] and tease [himher] by telling [himher] not to cum on the first thrust.", parse);
			Text.NL();
			if(terry.Slut() < 30) {
				Text.Add("<i>“Hey, I’m not that bad at sex,”</i> [heshe] protests with a pout. But [hisher] muzzle quickly spreads into a smile. <i>“Alright then, let’s get started.”</i>", parse);
			}
			else {
				Text.Add("<i>“Not my first rodeo, cow[boygirl]. You know I’m not shabby. If anything, <b>you</b> should look out for yourself and not blow the first thrust, ”</i> the [foxvixen] teases back.", parse);
				Text.NL();
				Text.Add("Now who’s getting ahead of themselves, hmm? You wink to show you’re just teasing, but it’s clear you’re both ready to begin.", parse);
			}
			Text.Flush();
			
			terry.AddLustFraction(0.7);
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : Text.Parse("Show Terry just how good you are with your hands by getting [himher] all hot and ready.", parse)
	});
	
	var TerryBlowjob = {
		No   : 0,
		Yes  : 1,
		Came : 2
	}
	var blowjob = TerryBlowjob.No;
	var pleasuredPC = false;
	
	//TODO
	options.push({ nameStr : "Lick",
		func : function() {
			Text.Clear();
			Text.Add("Looking the [foxvixen] up and down speculatively, you smile and ask if [heshe]’d like you to personally lube [himher] up before either of you considers penetration.", parse);
			Text.NL();
			
			// Callstack manipulation
			Gui.Callstack.push(function() {
				Text.NL();
				parse["c"] = terry.FirstCock() ? Text.Parse(", [hisher] neglected maleness brushes softly against your chin, but you pay it no mind", parse) : "";
				Text.Add("Reaching up with your arms, you wrap them around the [foxvixen]’s curvy hips, pulling [himher] down and forward to bring your mouth in proper alignment with [hisher] cunt[c]. This close, you can smell the musk seeping from [hisher] pussy, a heady scent that screams “ready female”. You make sure to burn the scent into your brain.", parse);
				Text.NL();
				Text.Add("<i>“Hey, [playername]?”</i>", parse);
				Text.NL();
				Text.Add("You grunt in acknowledgement.", parse);
				Text.NL();
				Text.Add("<i>“It’s not gonna lick itself you know? Plus if you keep teasing me like that, I can’t say what I’ll do. Hell hath no fury like a [foxvixen] scorned!”</i> [heshe] warns you playfully.", parse);
				Text.NL();
				parse["boygirl"] = player.mfTrue("boy", "girl");
				Text.Add("You roll your eyes, even as you dramatically plead for Terry to spare you from [hisher] terrible wrath. You’ll be a good [boygirl]. And, to prove your words, you open your mouth and let your tongue roll out, giving [hisher] cunt a big, sloppy lick, letting the taste wash through your mouth.", parse);
				Text.NL();
				Text.Add("<i>“Ah! G-Good [boygirl],”</i> Terry says, stifling a moan. [HisHer] tail wagging demurely above your head.", parse);
				Text.NL();
				if(player.FirstCock()) {
					if(terry.Relation() + terry.Slut() >= 90) {
						Text.Add("You feel Terry’s nose bop[oneof] your [cockTip][s]. <i>“Hmm, such a tasty morsel… don’t mind if I do.”</i> The [foxvixen] promptly engulfs your shaft.", parse);
						Text.NL();
						Text.Add("You moan in pleasure, gratefully returning the favor by enveloping Terry’s flower in a perverse kiss, tongue caressing the slit and licking through to [hisher] inner folds before you release. You don’t want to spoil [himher] too quickly...", parse);
						Text.NL();
						pleasuredPC = true;
					}
					else if(terry.Relation() + terry.Slut() >= 60) {
						Text.Add("You feel a pair of vulpine handpaws encircle[oneof] your [multiCockDesc]. <i>“Just returning the favor,”</i> you hear Terry say.", parse);
						Text.NL();
						Text.Add("You let out a muffled noise of gratitude, and extend your tongue again, intent on properly thanking [himher] for [hisher] generosity.", parse);
						Text.NL();
						pleasuredPC = true;
					}
				}
				Text.Add("Your tongue dances across the [foxvixen]’s petals, sliding with all the skill you can muster back and forth along [hisher] slit. Once the outer labia have been lubed enough, you start to probe deeper with your tongue, tantalizing the inner labia and coaxing them to let you through deeper. You slurp Terry’s clitoris into a kiss, sucking on it before returning to the rest of [hisher] womanhood, burying yourself as deeply into it as you can.", parse);
				Text.NL();
				parse["p"] = pleasuredPC ? Text.Parse(", stopping [hisher] ministrations on your [cockDesc]", parse) : "";
				Text.Add("<i>“Ah!”</i> the [foxvixen] cries out[p]. <i>“H-Hey, [playername]. Don’t you think you’re - Ooh! - getting a bit carried away back there? You’re gonna make me cum!”</i>", parse);
				Text.NL();
				Text.Add("Well, you can’t have that, now can you? You give Terry’s pussy one last sloppy lick for luck, and then you release your grip on [hisher] hips and settle back down. Mischievously, you ask if [heshe] thinks [heshe]’s ready for something meatier between [hisher] legs than your tongue.", parse);
				Text.NL();
				Text.Add("Getting off of you, the [foxvixen] turns to look at you, panting, eyes filled with lust, <i>“[playername]. I was ready ages ago. Do me now!”</i>", parse);
				Text.NL();
				Text.Add("[HeShe] only had to ask, you purr, even as you sit up and cross your [legsDesc], creating an impromptu seat from your lap, leaning back to better expose your [multiCockDesc].", parse);
				Text.NL();
				Text.Add("Terry wastes no time straddling you.", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			});
			
			if(terry.Slut() < 30) {
				Text.Add("<i>“What exactly do you have in mind?”</i> Terry asks, looking at you inquisitively.", parse);
				Text.NL();
				Text.Add("[HeShe]’ll see soon enough, you quip back. But first, you need [himher] to kneel. Obediently, the [foxvixen] nods [hisher] head and does as you instruct, looking patiently at you. Once [heshe]’s in the proper position, you walk over and lay down on your back before [himher], head pointing toward [himher], and instruct [himher] to crawl.", parse);
				Text.NL();
				Text.Add("<i>“Umm, what’s next?”</i> Terry asks, slowly creeping down your body as instructed.", parse);
				Text.NL();
				parse["c"] = terry.FirstCock() ? Text.Parse(" [tcockDesc] and balls pass by and [hisher]", parse) : "";
				Text.Add("You grin to yourself as [hisher][c] pussy comes into view. Without speaking, you reach up and wrap your arms around Terry’s hips, bringing the [foxvixen] to a halt before you pull [himher] downward, tongue questing out to dab playfully at [hisher] womanhood.", parse);
				Text.NL();
				Text.Add("<i>“Ah!”</i> Terry cries out, surprised by your lick. <i>“So this is what you had in mind...”</i>", parse);
				Text.NL();
				Text.Add("It most certainly was. Unless [heshe] has any objections...?", parse);
				Text.NL();
				Text.Add("<i>“N-Not really...”</i> the [foxvixen] replies, a bit embarrassed.", parse);
				
				PrintDefaultOptions();
			}
			else if(terry.Slut() < 60) {
				Text.Add("<i>“Lube me yourself? I wonder what do you mean by that?”</i> Terry asks with a smirk.", parse);
				Text.NL();
				Text.Add("Smirking back, you retort that you think Terry has a pretty good idea of what you mean. For emphasis, you thrust your tongue out between your lips, licking at the air before retracting it again.", parse);
				Text.NL();
				Text.Add("<i>“Oh ho! I see. Why don’t you get comfortable then?”</i> [heshe] suggests with a knowing grin.", parse);
				Text.NL();
				Text.Add("Smiling back, you lay yourself upon the ground and indicate you’re ready for Terry to take [hisher] position.", parse);
				Text.NL();
				parse["c"] = terry.FirstCock() ? Text.Parse(" [HeShe] makes a point of shaking [hisher] hips enticingly, ensuring [hisher] [tcockDesc] and balls swing side to side above you.", parse) : "";
				Text.Add("The [foxvixen] wastes no time, crawling atop you.[c] <i>“Ready when you are,”</i> [heshe] notifies you.", parse);
				Text.NL();
				Text.Add("Alright then, in that case...", parse);
				
				PrintDefaultOptions();
			}
			else {
				Text.Add("<i>“I personally don’t think I need any lube, I’m more than capable of taking you on. But, on the other hand, I’m pretty sure you got something good in store. So let’s say, yes.”</i> Terry grins knowingly.", parse);
				Text.NL();
				Text.Add("Somehow, you thought that was what [heshe]’d say, you reply, even as you lay down on your back and make yourself comfortable, knowing that Terry knows exactly what needs to be done.", parse);
				Text.NL();
				Text.Add("Terry kneels before you, leaning down to give you a lusty kiss. It’s an interesting experience sharing an inverted kiss like this, but it still feels good. Once [heshe]’s done, [heshe] breaks the kiss with a smile, licking [hisher] lips of any lingering trace of your saliva. <i>“Hmm, tasty. Gotta make sure you’re wet enough to lube me,”</i> [heshe] grins.", parse);
				Text.NL();
				Text.Add("Sure [heshe] does... so, do you pass the test?", parse);
				Text.NL();
				Text.Add("<i>“Maybe, just maybe. I guess there’s only way to find out, don’t you agree?”</i> Having said that, [heshe] gets down on four and begins slowly crawling above you.", parse);
				
				if(terry.FirstCock()) {
					parse["little"] = terry.HorseCock() ? "not-so-little" : "little";
					Text.Add("You catch a glimpse of [hisher] swaying [tcockDesc] and balls, when [heshe] suddenly stops. As you wonder why [heshe]’s stopping, Terry angles [himher]self and brings [hisher] cock down on your face, smacking your lips with [hisher] shaft. <i>“C’mon, give my [little] friend a kiss,”</i> [heshe] teases.", parse);
					Text.Flush();
					
					//[Blow [himher]][Push away]
					var options = new Array();
					options.push({ nameStr : Text.Parse("Blow [himher]", parse),
						func : function() {
							blowjob = TerryBlowjob.Yes;
							
							Text.Clear();
							Text.Add("[HeShe] wants a kiss, huh? Well, let’s see what [heshe] thinks of this... Opening your lips, you inhale the very tip of Terry’s [tcockDesc], wetly slurping on the prickflesh between your lips and flicking your tongue against it, caressing the [tcockTip] and what parts of it that you can.", parse);
							Text.NL();
							Text.Add("<i>“Oh! [playername], you really know how to make a fox happy. Here I am just asking for a kiss, and instead I’m getting the full treatment. You’re gonna spoil me if you keep that up… [master],”</i> [heshe] giggles, adjusting [himher]self so you can get better leverage.", parse);
							Text.NL();
							Text.Add("With Terry in a better position, you start to teasingly gulp you way up [hisher] length, bobbing your head back and forth in a smooth, steady rhythm.", parse);
							Text.NL();
							Text.Add("<i>“Oh, yes! Suck on my [fox]-meat. Eat me all up like the big perv that you are,”</i> Terry cries out in pleasure, letting [hisher] tongue loll out as [heshe] draws [hisher] hips back, and thrusts into your mouth.", parse);
							Text.NL();
							Text.Add("You roll your eyes at Terry’s antics, but do your best to oblige. As your tongue and lips caress [hisher] thrusting member, your hands reach up between [hisher] thighs, stroking the swaying orbs of [hisher] balls and caressing the fluffy surfaces of [hisher] inner thighs.", parse);
							Text.NL();
							if(player.sexlevel <= 3) {
								Text.Add("With your mouth so full of [fox]-cock, there’s only so much you can do, but you give it your best shot.", parse);
								Text.NL();
								Text.Add("Your fingers dance over whatever parts of Terry that you can reach, stroking and kneading [hisher] balls, caressing [hisher] thighs, groping [hisher] ass and brushing down the length of [hisher] tail. Your ministrations aren’t expert, by any means, but there’s no denying your enthusiasm.", parse);
								Text.NL();
								Text.Add("And all the while, you let your [foxvixen] hump away eagerly at your mouth, whetting [hisher] appetite for what’s to come.", parse);
								Text.NL();
								if(player.FirstCock()) {
									Text.Add("<i>“Not bad, [playername]. But let me teach you how to properly suck a cock.”</i> Terry’s handpaws fly to your crotch, where [heshe] finds[oneof] your [multiCockDesc].", parse);
									Text.NL();
									Text.Add("You sigh in pleasure as you feel the [foxvixen]’s muzzle engulf your flesh, blowing you with both enthusiasm and technique. Still, you continue your task, now moaning into the shaft stuffing your maw.", parse);
									Text.NL();
									Text.Add("<i>“Think that’ll be enough,”</i> Terry declares, pulling away and licking [hisher] lips off your pre-cum.", parse);
								}
								else {
									Text.Add("<i>“Ah! You’re so good to me, [playername]. Use your tongue a bit more.”</i>", parse);
									Text.NL();
									Text.Add("You grunt a muffled response to Terry’s request, working your mouth as best you can. You lap circles around [hisher] glans, curling your tongue back and around to run along the veins lining [hisher] dick.", parse);
									Text.NL();
									Text.Add("<i>“Alright, that’s enough of that,”</i> the [foxvixen] declares.", parse);
								}
								Text.NL();
								Text.Add("You can’t help but grunt as you feel Terry shifting [hisher] weight atop you, firmly pushing away from you. [HisHer] cock pops wetly from your mouth, still drooling a mixture of precum and saliva down your chin and onto your [breastsDesc]. You work your jaw, getting a little feeling back into it, eyes staring after Terry’s sweet ass as [heshe] delicately steps off of you, [hisher] tail brushing playfully against your chin as [heshe] goes.", parse);
								Text.NL();
								Text.Add("<i>“Come on, [playername]. You said you wanted my pussy. So, you’re just going to lay there and let me do all the work?”</i> Terry says teasingly, hands on [hisher] hips as [heshe] waits for you to get in position.", parse);
							}
							else {
								Text.Add("Though naturally you steal this opportunity to grope and fondle whatever parts of Terry you can reach, from [hisher] girly thighs to [hisher] sexy butt, you have bigger things in mind. ", parse);
								Text.NL();
								Text.Add("You caress the ripe fruit of [hisher] nuts, wishing you could spare a moment to give them a nice sucking, but Terry’s too insistent to let your mouth get put to such use. You moan plaintively at being denied it, letting the vibrations dance along [hisher] dick, tongue dextrously massaging [hisher] flesh.", parse);
								Text.NL();
								Text.Add("Finished with the fondling, you move for the other choice targets instead.", parse);
								Text.NL();
								Text.Add("One hand creeps up behind the [foxvixen]’s balls for [hisher] womanly flower, expertly manipulating its petals with your fingers. You spread [himher] open, stroking and twitching, stealing a mischievous playful half-pinch of [hisher] little clitoris before pushing just the tips of your index and middle finger inside to pump back and forth.", parse);
								Text.NL();
								Text.Add("The other hand reaches further up, worming its way between the [foxvixen]’s plushly fuckable booty to trail teasing circles around [hisher] anus, pushing lightly but insistently against [hisher] back passage to try and worm a finger inside.", parse);
								Text.NL();
								Text.Add("<i>“Ack! You’re gonna make me cum!”</i> Terry cries out in warning.", parse);
								Text.NL();
								Text.Add("Well, that was the whole point... You show [himher] no mercy, swallowing Terry’s [fox]hood as deeply as you possibly can without taking [hisher] knot. As you do so, your fingers thrust themselves decisively into each of [hisher] holes.", parse);
								Text.NL();
								Text.Add("The [foxvixen] lets out a yipping cry of equal parts shock and pleasure, [hisher] pussy and ass clamping roughly down on your intruding fingers and a shudder visibly rippling through [hisher] body as [heshe] comes.", parse);
								Text.NL();
								if(terry.HorseCock())
									Text.Add("Thick gouts of hot seed relentlessly pummels your throat with jet after jet of copious fox-cum. [HisHer] knotty horse-cock does a good job of plugging your mouth as it throbs. Even so, you’re no novice at this, and you manage to swallow just as fast as [heshe]’s can pump out jism.", parse);
								else
									Text.Add("Terry’s fox-cock throbs within your maw as it spews rope after rope of searing fox-cum down your throat. You smile inwardly with each whorish moan that escapes the [foxvixen]’s mouth. [HeShe]’s so cute when [heshe]’s helplessly cumming for you.", parse);
								Text.NL();
								Text.Add("When Terry starts to pant above you, you know that [heshe]’s spent. Wrapping your arms tenderly around the [foxvixen] to keep [himher] close, you roll the both of you over onto your sides. With Terry now laying down beside you, you start to wriggle your way free, the [foxvixen]’s [tcockDesc] sliding out of your mouth.", parse);
								Text.NL();
								Text.Add("When only the tip remains in your mouth, you cease your withdrawal. With mischievous purpose, your hand reaches for [hisher] still-throbbing dick, its counterpart reaching for [hisher] balls. You caress and knead Terry’s nuts, even as you pump purposefully on [hisher] shaft.", parse);
								Text.NL();
								Text.Add("Terry moans and shudders, a few last weak spurts of cream emptying themselves into your waiting mouth. There, now it looks like you’ve gotten everything. You let Terry’s dick slide out from between your lips as you finish withdrawing, but you don’t swallow the semen plastering itself over your tongue yet.", parse);
								Text.NL();
								Text.Add("<i>“Ugh… I thought you said you wanted my pussy, not my cock,”</i> [heshe] teases, laughing softly.", parse);
								Text.NL();
								Text.Add("Oh, like [heshe] doesn’t have it in [himher] to go for another round. Of course, you can’t actually say that to Terry with your mouth full of cum. So you simply clap [himher] authoritatively on the thigh, signalling that [heshe] should get into position for you.", parse);
								
								blowjob = TerryBlowjob.Came;
							}
							Text.NL();
							Text.Add("You take a set on the ground, keeping yourself upright and curling your [legsDesc] to form a proper seat for Terry’s shapely rump and provide proper access to your [multiCockDesc]. With a smirk, you gesture toward your lap signalling the [foxvixen] that [hisher] throne is ready.", parse);
							Text.NL();
							Text.Add("<i>“All that? For me? Aww, you’re so considerate, [playername],”</i> the [foxvixen] grins teasingly straddling you and making [himher]self comfortable.", parse);
							Text.Flush();
							
							player.slut.IncreaseStat(50, 1);
							terry.relation.IncreaseStat(60, 1);
							terry.AddLustFraction(1);
							player.AddLustFraction(0.3);
							
							Gui.Callstack.pop();
							Gui.NextPrompt();
						}, enabled : true,
						tooltip : "Why stop with just a kiss when you could do so much more?"
					});
					options.push({ nameStr : "Push away",
						func : function() {
							Text.Clear();
							Text.Add("However tempting the offer may be, you focus and push the [fox]cock away from your lips, chiding Terry playfully that [heshe] needs to be thinking with [hisher] cunt, not [hisher] cock.", parse);
							Text.NL();
							Text.Add("<i>“Aww, you’re no fun [playername],”</i> the [foxvixen] teases, shaking [hisher] hips. <i>“Alright then, if you want my tight cunt, you can have it. Just come and get it~”</i> [heshe] giggles.", parse);
							Text.Flush();
							
							Gui.NextPrompt();
						}, enabled : true,
						tooltip : "You’d rather not. You want pussy, and that’s what you’ll be getting."
					});
					Gui.SetButtonsFromList(options, false, null);
				}
				else
					PrintDefaultOptions();
			}
		}, enabled : true,
		tooltip : Text.Parse("Let’s see how your [foxvixen] likes being licked instead.", parse)
	});
	
	var dildoScene = function(toy) {
		parse["toyDesc"]     = toy.sDesc();
		parse["toyHeadDesc"] = toy.cock.TipShort();
		
		Text.Clear();
		Text.Add("You ask Terry to just give you a moment to get something first. At the [foxvixen]’s nod, you quickly begin rooting through your belongs, smiling to yourself as you pull out your [toyDesc]. With a grin, you turn back to Terry and start to close the distance between you, holding up your toy for [hisher] inspection.", parse);
		Text.NL();
		if(terry.Slut() < 30) {
			Text.Add("Terry raises a brow as [heshe] notices the [toyDesc] but other doesn’t say anything.", parse);
		}
		else if(terry.Slut() < 60) {
			Text.Add("Terry simply smiles knowingly.", parse);
		}
		else {
			Text.Add("<i>“Between you and me, you don’t think you have enough to play with?”</i> [heshe] asks teasingly.", parse);
			Text.NL();
			Text.Add("Oh, [heshe] knows how it goes; the more to play with, the more fun, right? You wink at [himher] knowingly in reply.", parse);
		}
		Text.NL();
		Text.Add("Closing the remaining distance between you, you reach out with the dildo toward Terry’s mouth, holding it invitingly there as you instruct [himher] to lick it.", parse);
		Text.NL();
		if(terry.Slut() < 60)
			Text.Add("<i>“O-Okay...”</i> the [foxvixen] replies, opening [hisher] mouth and letting [hisher] tongue loll out to lick at the [toyHeadDesc].", parse);
		else
			Text.Add("<i>“Personally, I’d prefer some real meat between my lips, but I’ll humor you,”</i> [heshe] replies, opening [hisher] mouth and letting [hisher] tongue loll out to lick at the [toyHeadDesc]", parse);
		Text.NL();
		Text.Add("Terry starts with slow licks along the glans of the [toyDesc], then starts moving up and down along the shaft. You tilt the toy slightly to give [himher] a better angle and [heshe] begins taking the [toyHeadDesc] in [hisher] mouth, suckling lightly.", parse);
		Text.NL();
		Text.Add("That’s a good [foxvixen], you quip, twisting your wrist to push another inch or two past Terry’s willing lips.", parse);
		Text.NL();
		Text.Add("<i>“Mmnf,”</i> is your muffled reply.", parse);
		Text.NL();
		parse["slut"] = terry.Slut() >= 60 ? Text.Parse(" Struggling a little to get it out as Terry playfully insists on keeping [hisher] lips closed.", parse) : "";
		Text.Add("Judging the toy suitably wet, you gently but insistently pry it from Terry’s mouth.[slut] Brandishing it with a flourish of your wrist, you place it against the nape of [hisher] neck and slowly trail it down [hisher] body.", parse);
		Text.NL();
		Text.Add("The [foxvixen] shudders as the tip of the [toyDesc] tickles [hisher] fur.", parse);
		Text.NL();
		if(terry.Cup() < Terry.Breasts.Acup) {
			Text.Add("Despite Terry’s lack of boobflesh, you can still have some fun. Bringing the spit-slick toy to rest against one of [hisher] nipples, you start to stroke it back and forth, rubbing the [toyHeadDesc] against the [foxvixen]’s nub and trailing it in circles across the flesh.", parse);
			Text.NL();
			Text.Add("<i>“Ahn! That tickles!”</i> the [foxvixen] exclaims, tho [heshe] doesn’t recoil.", parse);
			Text.NL();
			Text.Add("Well, if that’s the case... your free hand reaches out for Terry’s other nipple, pinching it gently between forefinger and thumb, twiddling it with just the right amount of force that [heshe] can feel it without it hurting.", parse);
		}
		else if(terry.Cup() < Terry.Breasts.Ccup) {
			Text.Add("The [foxvixen]’s small, perky breasts are just begging for a bit of attention. The flesh gives way just a little as you press the [toyHeadDesc] against it, grinding it softly against [hisher] nipple before you start to stroke and rub, tracing patterns around and over [hisher] tit.", parse);
			Text.NL();
			Text.Add("Terry moans as you stimulate [hisher] breasts with the [toyDesc]. <i>“H-Hey, watch it. That tickles!”</i>", parse);
			Text.NL();
			Text.Add("Tickles, huh? Maybe you need a little more than that. With your other hand, you reach out and cup the remaining breast, feeling it squish just a little beneath your groping fingers before you start to rub and stroke. You knead the flesh with dextrous flexes of your fingers, brushing against Terry’s other nipple in time with the rubbing and stroking of your [toyDesc].", parse);
		}
		else {
			Text.Add("Those big juicy tits are practically singing out for you. Boobflesh squishes enticingly as you press your [toyDesc] to one, jiggling gently as you start to grind the [toyHeadDesc] into the nipple. Lightly thrusting back and forth, you stroke and caress Terry’s nipple with your [toyDesc], making [hisher] breast bounce with each flex of your wrist.", parse);
			Text.NL();
			Text.Add("<i>“Ah! Hey, be careful! - Ahn! - They’re sensitive,”</i> Terry cries out in pleasure.", parse);
			Text.NL();
			Text.Add("Sensitive, hmm? Grinning mischievously, your other hand reaches out to cup and fondle the breast you aren’t currently molesting with a [toyDesc], groping away shamelessly, delighting in the feel of boobage squishing and jiggling between your fingers.", parse);
		}
		Text.NL();
		Text.Add("Terry pants as you continue to tease [himher]. [HeShe] cries out whenever you pinch [hisher] nipples, moaning whorishly soon after. You’ve no doubt [heshe]’s already sopping wet by now.", parse);
		Text.NL();
		Text.Add("Though your hand remains pressed against [hisher] breast, you move the [toyDesc] away from the other nipple. ", parse);
		var belly = terry.PregHandler().BellySize();
		if(belly < 0.2)
			Text.Add("Down over Terry’s stomach it sinks, though you can’t resist stopping at [hisher] bellybutton, playfully rubbing the [toyHeadDesc] back and forth inside of it, trailing a circle before dropping lower.", parse);
		else if(belly < 0.6)
			Text.Add("With Terry’s bulging belly, you can’t resist playing a little, you trace patterns of loops and curls over the swollen, fur-covered orb with the [toyHeadDesc], rubbing gently against the protruding navel before continuing your descent.", parse);
		else {
			Text.Add("The roundness of Terry’s stomach compels you to get a little playful. You gently grind your [toyHeadDesc] against the pregnant [foxvixen]’s protruding navel, then start to rub it in circles around [hisher] lower belly. As you do, [hisher] skin visibly distends, a small lump suddenly rising sharply against the toy pushed against [hisher] skin, making you stop in shock. Was that...?", parse);
			Text.NL();
			Text.Add("<i>“Hey! Don’t poke my belly with that [toyDesc],”</i> Terry says with a frown. <i>“You’re disturbing our baby!”</i>", parse);
			Text.NL();
			Text.Add("You can’t help a smile, but you manage to apologise, promising Terry you’ll stop poking [hisher] belly.", parse);
			Text.NL();
			Text.Add("<i>“Right, just be more careful. You don’t want to hurt our kit before it had a chance to see what a hopeless pervert their father is, do you?”</i> Terry asks teasingly, rubbing [hisher] baby-bump.", parse);
			Text.NL();
			Text.Add("You just bite back a chuckle and continue down Terry’s body.", parse);
		}
		Text.NL();
		if(terry.FirstCock()) {
			Text.Add("Terry’s [tcockDesc] is half-erect already and visibly jutting from its sheath. You can’t resist playfully running your [toyDesc] along the smooth, sensitive sides of the exposed flesh. Terry visibly quakes in pleasure, but this isn’t what you’re here for and so you keep dropping.", parse);
			Text.NL();
		}
		Text.Add("Guiding your [toyDesc] between Terry’s legs, you reach it up against Terry’s petals, rubbing the [toyHeadDesc] with careful pressure squarely against [hisher] clitoris. You can feel warm wetness dripping onto your fingers; [heshe]’s really turned on right now!", parse);
		Text.NL();
		Text.Add("<i>“Hng! Don’t you think it’s about time you stopped teasing me and gave it to me? I… I want you!”</i> [heshe] says pleadingly.", parse);
		Text.NL();
		Text.Add("You make a show of looking thoughtful... Well… You give Terry a moment or two to sweat, then smile and promise you’ll give it to [himher] alright. Taking your hand off, you give [hisher] cunt one last brush with your [toyDesc] before you pull the slick piece away.", parse);
		Text.NL();
		Text.Add("Taking a step or two back, you sit down, curling your [legsDesc] to expose your [multiCockDesc] and make a seat out of your lap. Smiling, you invite Terry to sit down, so you can give [himher] what [heshe]’s craving.", parse);
		Text.NL();
		Text.Add("Terry quickly moves to straddle you, letting[oneof] your [multiCockDesc] rub against [hisher] wet [tvagDesc] as [heshe] slides into place. <i>“Ahn!”</i> [heshe] cries out cutely as [heshe] finally settles into your lap.", parse);
		Text.NL();
		Text.Add("You chuckle; if [heshe]’s that hot now, you can’t wait to see how [heshe] reacts when you start going for real...", parse);
		Text.Flush();
		
		Gui.NextPrompt();
	};
	
	var addDildoScene = function(toy) {
		if(party.Inv().QueryNum(toy) < 1) return;
		
		parse["toy"] = toy.sDesc();
		options.push({ nameStr : toy.name,
			func : dildoScene, obj : toy, enabled : true,
			tooltip : Text.Parse("You’ll give [himher] the real thing soon enough, but why not get [himher] into the proper mood with a proper tool, first? How about your [toy]?", parse)
		});
	}
	
	addDildoScene(Items.Toys.SmallDildo);
	addDildoScene(Items.Toys.MediumDildo);
	addDildoScene(Items.Toys.LargeDildo);
	addDildoScene(Items.Toys.ThinDildo);
	addDildoScene(Items.Toys.ButtPlug);
	addDildoScene(Items.Toys.LargeButtPlug);
	addDildoScene(Items.Toys.EquineDildo);
	addDildoScene(Items.Toys.CanidDildo);
	addDildoScene(Items.Toys.ChimeraDildo);
		
		//TODO: additional toys
	
	Gui.SetButtonsFromList(options, false, null);
	
	Gui.Callstack.push(function() {
		Text.Clear();
		if(blowjob == TerryBlowjob.Came) {
			Text.Add("Smiling around your mouthful, you take Terry’s right hand and bring it toward your mouth, palm up, as if you were going to kiss it. Instead, you open your lips and tilt your head, allowing the sticky semen within to ooze out over [hisher] fingers. Once you have emptied your mouth, you guide the ooze-dripping digits to[oneof] your [multiCockDesc].", parse);
			Text.NL();
			Text.Add("[HeShe] grins knowingly at you and begins eagerly stroking your [cockDesc] all over. <i>“Making me lube you like this… you’re so kinky, [playername],”</i> [heshe] comments teasingly.", parse);
			Text.NL();
			Text.Add("You smile in pleasure as Terry’s lecherous fingers stroke your shaft, smearing you in the [foxvixen]’s own orgasm for lube. Bending closer, you give Terry an appreciative kiss on the lips, soft and tender, before bucking your hips as best you can to ensure that you get as lubed as possible.", parse);
			Text.NL();
			Text.Add("<i>“That’s enough,”</i> the [foxvixen] declares, releasing your [cockDesc]. <i>“I really need you now, [playername],”</i> [heshe] says, voice dripping with lust.", parse);
			Text.NL();
		}
		Text.Add("Curling your fingers under Terry’s girlish thighs, you strain and heave [himher] up out of your lap. Guiding the [foxvixen] into proper alignment, you carefully lower [himher] down onto your jutting erection.", parse);
		Text.NL();
		if(virginFirst) {
			Text.Add("<i>“Be careful,”</i> [heshe] says as your [cockDesc] nestles against [hisher] folds, threatening to penetrate [himher].", parse);
			Text.NL();
			Text.Add("You assure [himher] that you will, and try to take it as slowly and as gently as possible, carefully lowering the [foxvixen] down and feeling [hisher] hymen stretch and finally break as you push inside.", parse);
			Text.NL();
			Text.Add("<i>“Ah!”</i> Terry cries out at the pain of having [hisher] hymen pierced.", parse);
		}
		else if(terry.FirstVag().virgin) {
			Text.Add("<i>“Here we go again,”</i> [heshe] says, adjusting [himher]self as soon as your [cockDesc] nestles against [hisher] folds.", parse);
			Text.NL();
			Text.Add("You nod, and reaffirm that you’ll be gentle with [himher] this time too. As carefully as you can, you continue lowering the [foxvixen] onto your cock, slowly pushing against [hisher] hymen and patiently stretching it apart, rather than roughly bursting it.", parse);
			Text.NL();
			Text.Add("<i>“Ugh!”</i> Terry cries out in slight pain.", parse);
		}
		else {
			Text.Add("<i>“Ah… I’ve been waiting for this,”</i> [heshe] says, as your [cockDesc] nestles against [hisher] folds.", parse);
			Text.NL();
			Text.Add("Smirking, you quip back that you have as well, and finish lowering Terry down into your lap, warm flesh wrapping eagerly around your [cockDesc] as it impales [himher].", parse);
		}
		Text.NL();
		
		Sex.Vaginal(player, terry);
		terry.FuckVag(terry.FirstVag(), p1cock, 3);
		player.Fuck(p1cock, 3);
		
		parse["c"] = terry.FirstCock() ? Text.Parse(", [hisher] own meaty manhood slapping against your belly", parse) : "";
		Text.Add("With the [foxvixen] now properly seated in your lap, your [cockDesc] buried in [himher] to the very hilt[c], you seize the moment and claim [hisher] lips in a powerful kiss.", parse);
		Text.NL();
		if(blowjob >= TerryBlowjob.Yes) {
			Text.Add("Breaking the kiss momentarily, Terry says, <i>“Mwah, I can taste myself inside your mouth.”</i>", parse);
			Text.NL();
			Text.Add("You lick your lips and nod; you enjoyed the taste, so you thought you ought to share it with [himher].", parse);
			Text.NL();
			Text.Add("<i>“Not that I can’t appreciate my fine flavor, but I’d rather have something else from you, if you catch my drift,”</i> [HeShe] replies, giving an experimental buck against you.", parse);
			Text.NL();
			Text.Add("Well, ask and [heshe] shall receive, you quip back, then cover Terry’s lips before the [foxvixen] can reply.", parse);
		}
		else {
			Text.Add("Terry kisses you back, beginning to grind against you as [hisher] legs close behind you.", parse);
			if(terry.FirstCock())
				Text.Add(" [HisHer] [tcockDesc], already at full mast, oozes pre as [heshe] continues to grind.", parse);
		}
		Text.NL();
		parse["b"] = terry.Cup() >= Terry.Breasts.Acup ? Text.Parse("hands cup [hisher] breasts, palpating them momentarily. As you do so, your", parse) : "";
		Text.Add("Lips still locked together, you start to rock your hips, grinding against and into the [foxvixen] atop you. Your hands eagerly begin to roam across Terry’s form, reaching for the softest, tenderest places that you can think of. Your [b] fingers reach for Terry’s perky nipples, tweaking and twiddling them between forefinger and thumb before exploring lower.", parse);
		Text.NL();
		Text.Add("<i>“Mmmmnf!”</i> Terry moans into the kiss. [HisHer] own arms moving to embrace you, handpaws scratching your back a little as [heshe] grips your shoulders momentarily.", parse);
		var wings = player.HasWings();
		if(wings) {
			parse["wingsDesc"] = wings.Short();
			Text.Add(" You instinctively adjust your [wingsDesc] to allow the [foxvixen] to properly caress your back.", parse);
		}
		Text.NL();
		Text.Add("You can’t help but wriggle a little deeper into Terry’s arms, savoring [hisher] embrace. Your hands reach down to cup the perky bubbles that make [hisher] butt, squishing the flesh between your fingers. You caress the beautiful heart-shaped patch of fur that adorns Terry’s rump like a natural tramp stamp with one hand, the other moving to stroke luxuriantly through [hisher] silky brush tail.", parse);
		Text.NL();
		Text.Add("The [foxvixen] breaks the kiss momentarily, panting in pleasure. <i>“N-Not my birthmark! - Ah! - You meanie...”</i> [heshe] says, leaning back to kiss you once more.", parse);
		Text.NL();
		Text.Add("You chuckle, playfully teasing Terry that [heshe] should just get used to it; [hisher] birthmark’s just too cute not to play with, especially not if [heshe]’s always going to pout like this when you do it. You accept the [foxvixen]’s return kiss eagerly, squeezing [hisher] butt for appreciation and for balance as you rock your hips back, starting to pull your cock out of the warm tightness of Terry’s cunt.", parse);
		Text.NL();
		if(player.NumCocks() > 1) {
			parse["oneof2"] = player.NumCocks() > 2 ? " one of" : "";
			Text.Add("Once you have withdrawn properly, you break the kiss, both of you panting for breath. As Terry is preoccupied, your hand snakes underneath you, reaching for[oneof2] your other [multiCockDesc2] and aligning it with the puckered hole beneath Terry’s tail. Once confident of your efforts, you start to push forward again, beginning to spear into Terry’s tailhole even as you sink deeper inside of [hisher] cunt.", parse);
			Text.NL();
			Text.Add("<i>“Ahn! My butt too?”</i> [heshe] asks, bewildered.", parse);
			Text.NL();
			parse["c"] = player.NumCocks() > 2 ? " at least" : "";
			Text.Add("Well, you do have[c] two cocks, Terry has two holes... seems fair to you. As you say this, you continue slowly pushing forward, filling Terry in front and back with your two shafts.", parse);
			Text.NL();
			Text.Add("<i>“I-I don’t know how much - Ooh! - longer I can stand this,”</i> [heshe] warns, clinging desperately onto you.", parse);
		}
		else {
			Text.Add("You break the kiss with Terry, the both of you gasping for breath. Still, your fingers creep like a horny spider over the plush expanse of the [foxvixen]’s inviting bottom, worming their way into [hisher] buttock cleavage to press against the puckered ring of muscle within. Your index finger trails around it, tracing a single circle, then starts to push its way insistently inside.", parse);
			Text.NL();
			Text.Add("<i>“Ah! My butt!”</i> The [foxvixen] cries out in surprise.", parse);
			Text.NL();
			Text.Add("You shush [himher] gently, softly kissing at [hisher] bottom lip to distract [himher] for a moment. All [heshe] has to do is relax; this will make things so much better, you promise. Even as you say that, you keep pushing your finger deeper inside, allowing your own [cockDesc] to start thrusting back into [hisher] cunt as you do.", parse);
			Text.NL();
			Text.Add("<i>“Ungh! Okay! I-I’ll try, but I don’t know how much longer I can keep this up,”</i> [heshe] warns, clinging onto you.", parse);
		}
		Text.NL();
		parse["c"] = player.NumCocks() > 2 ? "other cocks" :
		             player.NumCocks() > 1 ? "other cock" : "finger";
		Text.Add("You start to thrust for real, bucking your hips back and forth, working Terry’s cunt with your [cockDesc] and [hisher] ass with your [c]. You soon have a steady rhythm going, the two of you gasping and panting in exertion.", parse);
		Text.NL();
		Text.Add("After a few pleasant minutes, you notice that, as much as Terry tries to cling to your torso, the [foxvixen]’s grip is weakening. You must be wearing [himher] out faster than you thought... Holding Terry tightly in your arms, you swivel around, bringing you both down to the ground on your sides in a controlled, gentle crash. Terry cries out softly, and you roll over, resting [himher] on [hisher] back and positioning yourself above [himher]. You start to thrust again, asking Terry if that’s better.", parse);
		Text.NL();
		Text.Add("The [foxvixen] smiles at you. <i>“Yeah, that feels more - Ah! - comfortable,”</i> [heshe] says between pants and moans.", parse);
		Text.NL();
		Text.Add("Laying down like this, you’re free to get a better look at your vulpine lover. Terry’s cute face whenever [heshe] moans. [HisHer] ", parse);
		if(terry.Cup() >= Terry.Breasts.Ccup)
			Text.Add("luscious mounds, capped with erect little nubs poking out of [hisher] fluffy fur. ", parse);
		else if(terry.Cup() >= Terry.Breasts.Acup)
			Text.Add("pert mounds, with tiny pearls that make [hisher] nipples poking out of the fluffy fur on [hisher] chest. ", parse);
		else
			Text.Add("little nipples, hardened in excitement, begging to be pressed like tiny pleasure buzzers. ", parse);
		
		var belly = terry.PregHandler().BellySize();
		if(belly < 0.2)
			Text.Add("That lean belly of [hishers]...", parse);
		else if(belly < 0.6)
			Text.Add("That bulging belly of [hishers], shaking around as you pummel [hisher] pussy...", parse);
		else
			Text.Add("Terry’s pregnant swell, heavy with your child. You wonder if the baby isn’t being bothered by how much Terry’s shaking underneath you...", parse);
		Text.NL();
		if(terry.HorseCock()) {
			Text.Add("Next your gaze falls on Terry’s stallion-hood. Huge and throbbing, slapping obscenely against [hisher] belly as pre-cum oozes out like a faucet. [HisHer] balls churning in preparation for the huge orgasm that’s to follow, as [hisher] knot swells.", parse);
			Text.NL();
		}
		else if(terry.FirstCock()) {
			Text.Add("Next your gaze falls onto Terry’s cute fox-hood. Erect and bright red, seeping gobs of pre as it slaps against the [foxvixen]’s belly with wet flaps. [HisHer] knot completely swollen as [hisher] balls work overtime to provide all the cum for [hisher] oncoming climax.", parse);
			Text.NL();
		}
		parse["c"] = player.NumCocks() > 1 ? Text.Parse("other [multiCockDesc2]", parse) : "finger";
		Text.Add("You groan in pleasure as you feel the [foxvixen]’s pussy grasp your [cockDesc] like a vice, while [hisher] rosebud clenches onto your [c]. ", parse);
		if(terry.Relation() < 60)
			Text.Add("<i>“C-Can’t hold out much longer, [playername]. I’m too close to cumming!”</i> [heshe] yells.", parse);
		else
			Text.Add("<i>“D-Doing my best to hold back here, [playername]. I’m too close! B-But, I want to cum with you...”</i> [heshe] whines.", parse);
		Text.NL();
		Text.Add("Your own need boils within you; you know you’re in no better shape than the [foxvixen] beneath you. You need to consider how you want to finish this, and quickly!", parse);
		
		cumbath = false;
		
		var knotted = p1cock.knot != 0;
		var doubleKnot = knotted;
		if(p2cock) knotted = knotted || p2cock.knot != 0;
		if(p2cock) doubleKnot = doubleKnot && p2cock.knot != 0;
		
		parse = Text.ParserPlural(parse, doubleKnot, null, "4");
		
		if(!strapon) {
			Text.Flush();
			
			//[Cum inside][Cum outside][Breed][Tittyjob]
			var options = new Array();
			options.push({ nameStr : "Cum inside",
				func : function() {
					Text.Clear();
					parse["c"] = player.NumCocks() > 1 ? "other dick" : "finger";
					Text.Add("<i>“[playername]! I’m coming!”</i> Terry cries out. [HisHer] [tvagDesc] clamps down on your [cockDesc], while [hisher] ass does the same on your [c]. Both [hisher] holes working overtime to milk you of your precious cargo.", parse);
					Text.NL();
					Text.Add("It feels like barely three heartbeats before your precious willpower crumbles like a collapsing wall. Ramming in as deeply as you possibly can, you cry out to the heavens above as you release yourself into Terry’s waiting depths.", parse);
					Text.NL();
					
					var cum = player.OrgasmCum();
					
					//TODO
					terry.PregHandler().Impregnate({
						slot   : PregnancyHandler.Slot.Vag,
						mother : terry,
						father : player,
						type   : PregType.Terry,
						num    : 1,
						time   : 24,
						load   : cum
					});
					
					if(p1cock.knot != 0) {
						var knot2 = p2cock && p2cock.knot != 0;
						parse = Text.ParserPlural(parse, knot2, null, "3");
						parse["andguts"] = knot2 ? " and guts" : ""; 
						if(cum > 6) {
							Text.Add("With your knot[s3] anchoring you in place, you can’t help but ensure Terry is jammed full of the waterfall of semen gushing from your cock[s] and invading [hisher] defenseless womb[andguts]. Terry’s stomach seems to practically explode as you pour gush after gush inside of [himher], thrusting aggressively against you as [heshe] just keeps getting fuller and fuller. The pressure inside is so intense that fine sprays of semen start spurting out around the seal[notS3] of your knot[s3].", parse);
							Text.NL();
							Text.Add("Despite this, Terry’s stomach just keeps getting bigger and bigger, until it fills the space between you completely, pressing against not only your own belly, but against your loins and even your [breastsDesc]. And it still grows, deforming outwards in response to the pressure of your body against it, wobbling over Terry’s sides as you finally finish.", parse);
							Text.NL();
							Text.Add("The stuffed [foxvixen] audibly sloshes and gurgles with each breath, stomach churning underneath you until you feel like you are laying atop your own personal velvety waterbed.", parse);
						}
						else if(cum > 3) {
							Text.Add("Terry’s stomach begins to bloat from the volume of your orgasm, but your knot[s3] seal[notS3] [hisher] hole[s3] shut, ensuring that not a drop of your ejaculate escapes.", parse);
							Text.NL();
							Text.Add("The dome of the [foxvixen]’s stomach rises up quickly and steadily, growing ever larger with each heartbeat. By the time you are finally finished, it is brushing insistently against your own torso, allowing you to feel the warmth of the fur-sheathed orb brushing against your stomach, loins, even against your [breastsDesc]. Terry’s belly wobbles slightly with each rise and fall, and you find yourself rising up and down along with it.", parse);
						}
						else {
							Text.Add("Jammed shut as [heshe] is, there’s nowhere for your cum to escape from. Terry’s stomach visibly rises up by the time you are done, crammed full with enough semen to add several inches to [hisher] former girth. Feeling quite blissfully drained, you allow yourself to rest gently atop the newly swollen [foxvixen].", parse);
						}
					}
					else {
						if(cum > 6) {
							Text.Add("Cum explodes into Terry’s depths like a perverted volcano eruption. Though much of it spurts back out afterwards, the bulk of it spirals deep into Terry’s belly, ballooning it outwards with such vigor it thrusts itself against you.", parse);
							Text.NL();
							parse["andass"] = player.NumCocks() > 1 ? " and ass" : "";
							Text.Add("By the time you finally finish, Terry looks to have doubled [hisher] previous weight, with all the extra bulk concentrated on [hisher] belly, and a veritable river of semen flows from [hisher] cunt[andass] down between your respective legs.", parse);
							Text.NL();
							Text.Add("You are resting atop the sloshing orb, feeling it quiver and shake with each breath that Terry takes.", parse);
						}
						else if(cum > 3) {
							Text.Add("As your tidal wave of semen flows inside of Terry, the [foxvixen]’s stomach starts to expand, gaining inch by inch even as excess spunk trickles back out again. By the time you finish, Terry looks like [heshe] could have just swallowed a watermelon whole even despite the leaking fluids seeping from between [hisher] legs. [HisHer] new belly makes a perfect cushion for your own torso as you sink down upon [himher] to rest.", parse);
						}
						else {
							Text.Add("Thick and sloppy, your cream splashes deep into Terry’s waiting hole[s], swirling eagerly away into [hisher] depths. Finally spent, you sink down atop your lover, enjoying the feel of resting against [himher].", parse);
						}
					}
					
					Text.NL();
					Text.Add("<i>“Ugh...”</i> the [foxvixen] groans in exertion. <i>“You really filled me up, [playername].”</i>", parse);
					Text.NL();
					Text.Add("Smiling merrily, you quip back that you couldn’t help yourself; Terry’s just too fuckable for [hisher] own good. And you gently kiss [himher] on the nose for emphasis.", parse);
					Text.NL();
					if(terry.Relation() < 60)
						Text.Add("<i>“Whatever you say, you incorrigible perv,”</i> [heshe] quips back teasingly.", parse);
					else
						Text.Add("<i>“Yes, I know you can’t resist my foxy charms,”</i> [heshe] giggles.", parse);
					Text.NL();
					if(terry.FirstCock()) {
						Text.Add("Pressed together as you are, you can feel it intimately when something twitches against your stomach. It doesn’t take you more than a heartbeat to realise what it is, and you playfully ask why Terry still hasn’t managed to cum yet.", parse);
						Text.NL();
						Text.Add("<i>“Kinda difficult to cum with you pressing down on my cock,”</i> [heshe] teasingly replies. <i>“Not that I’m complaining. It also feels kinda good...”</i>", parse);
						Text.NL();
						Text.Add("Maybe... but you’ll bet that finally shooting [hisher] load off will be a lot better.", parse);
						Text.NL();
						if(terry.HorseCock()) {
							Text.Add("You wriggle slightly, shifting your body atop Terry’s until the distinctive shape of [hisher] proud stallion-cock comes into view, visibly throbbing as precum oozes like magma from its half-flared tip.", parse);
							Text.NL();
							if(player.Slut() >= 45)
								Text.Add("Grinning mischievously, you can’t help but lick your lips at the tasty treat you are about to enjoy. Your hand works its way between your bodies to start stroking the lower part of Terry’s shaft, feeling its distinctly un-equine knot bulging against your fingers. As you do, you bend in and start to tease the upper part of Terry’s cock with your tongue, caressing the shaft with slow, deliberate licks and gently nibbling on the flare.", parse);
							else
								Text.Add("Though you need to wriggle back slightly to get a better grip, you start to pump away enthusiastically at Terry’s drooling erection. Smooth, steady strokes glide from [hisher] bulging knot to [hisher] flare and back again, nice and even in their rhythm.", parse);
							Text.NL();
							Text.Add("<i>“Augh! C-Cummin~!”</i> Terry cries out with a grimace.", parse);
							Text.NL();
							Text.Add("You watch in amusement as the [foxvixen]’s stallionhood throbs in your grasp, spewing forth the load hidden within Terry’s balls like a great volcano. White, hot jism rains down upon the [foxvixen]’s prone form, falling down like a perverted rain to mat [hisher] fluffy fur with the undeniable proof of your recent activities. By the time [heshe]’s done, [heshe]’s a complete mess!", parse);
							Text.NL();
							parse["cum"] = cum > 3 ? " and semen-stuffed" : "";
							Text.Add("Grinning widely, you quip that’s a very good look for Terry; cum-glazed[cum] is definitely something [heshe] carries well.", parse);
							Text.NL();
							Text.Add("<i>“Hmph. Maybe I should aim at you next time,”</i> [heshe] quips back.", parse);
							Text.NL();
							if(player.Slut() >= 60)
								Text.Add("Oh, [heshe] definitely should; you hear [foxvixen] spooge just does wonders for the skin. You laugh and shoot your lover a wink.", parse);
							else
								Text.Add("Well... fair is fair, isn’t it?", parse);
						}
						else {
							parse["foxcock"] = terry.mfPronoun("foxcock", "vixenprick");
							Text.Add("Feeling between you with one hand, you manage to close your fingers around the dainty piece of throbbing meat that is Terry’s petite [foxcock]. As best you can, you stroke and tease the [foxvixen]’s dick, grinding your hips to [hishers] as you do.", parse);
							Text.NL();
							Text.Add("<i>“H-Here it comes!”</i> [heshe] cries out.", parse);
							Text.NL();
							Text.Add("You watch as the [foxvixen]’s crimson member throbs, its knot expanding just a bit more as Terry fires off ropes of hot fox-seed toward the sky. One after the other, they fall atop [hisher] prone body, matting [hisher] fur with the creamy excess that resulted from your activities. Once [heshe]’s done, [heshe] sighs with relief. <i>“Ah, that hit the spot. I really needed that.”</i>", parse);
							Text.NL();
							Text.Add("It certainly looks like it, you agree.", parse);
						}
						
						cumbath = true;
					}
					else {
						Text.Add("As you shift your position slightly, you grind your [multiCockDesc] around inside of Terry’s hole[s], an action that elicits a soft whimper from the [foxvixen] beneath you. Blinking, you brush your fingers gently over one of Terry’s arms, feeling the muscles tensing beneath [hisher] skin, and your eyes widen in realisation.", parse);
						Text.NL();
						Text.Add("A teasing smirk spreads across your lips as your hands start to brush along Terry’s arms with more purpose, deliberately grinding against [himher] hips to hips. As you do, you teasingly note that Terry seems to be a little tense, playfully asking [himher] what’s wrong.", parse);
						Text.NL();
						Text.Add("<i>“S-Still a bit - Ahn! - on edge,”</i> [heshe] replies.", parse);
						Text.NL();
						Text.Add("Still on edge?", parse);
						Text.NL();
						Text.Add("<i>“Well you did get me to cum a little already, but - Oh!”</i>", parse);
						Text.NL();
						Text.Add("You slide your hips back again, having cut Terry off with a purposeful grind into [hisher] hips. But nothing; you’re not letting your little [foxvixen] walk away from this without making sure [heshe] gets off too.", parse);
						Text.NL();
						Text.Add("Terry stares at you, opening [hisher] mouth as if to say something, but you cut [himher] off with a possessively passionate kiss. You thrust your [tongueDesc] shamelessly into [hisher] mouth, wrestling [hisher] own tongue into submission. As you do, your hands start to move into a proper position, one reaching down for [hisher] clitoris, the other toward [hisher] nipples...", parse);
						Text.NL();
						parse["c"] = player.NumCocks() > 1 ? Text.Parse(" and [tanusDesc]", parse) : "";
						parse["k"] = p1cock.knot != 0 ? Text.Parse(", even with your knot plugging [himher]", parse) : "";
						Text.Add("The [foxvixen] groans into the kiss as you feel [hisher] [tvagDesc][c] clench onto your member[s]. A flood of vixen-juice escaping the seal of your shaft[k]. You moan in pleasure as [hisher] squirting femcum hits your [cockTip] before leaking around your shaft.", parse);
						Text.NL();
						Text.Add("<i>“[stuttername], you jerk! I’m still sensitive and you go forcing another orgasm on me,”</i> Terry chastises you, pouting and trying to look mad at you.", parse);
						Text.NL();
						Text.Add("Forcing? That’s a bit of a strong word, doesn’t [heshe] think? You grin and shake your head at Terry’s antics. Besides, what were you supposed to do? You couldn’t just leave your Terry all pent up, not after [heshe] went and milked you dry earlier...", parse);
						Text.NL();
						Text.Add("<i>“Hmph. I wasn’t ready to cum yet.”</i>", parse);
						Text.NL();
						Text.Add("Smiling, you tap an index finger playfully against the [foxvixen]’s nose, teasing [himher] about how [heshe]’s just so adorable when [heshe] tries to feign being mad at you.", parse);
						Text.NL();
						Text.Add("The [foxvixen] regards you with a pour, before sighing. <i>“I can’t really stay mad at you...”</i>", parse);
						Text.NL();
						Text.Add("You just smile, assure [himher] that’s part of [hisher] charms, and gently steal a quick kiss from [hisher] lips before snuggling back down.", parse);
					}
					Text.NL();
					
					terry.OrgasmCum();
					
					if(cumbath) {
						Text.Add("<i>“Ugh. I hope you like creamy [foxvixen]. I’m a total mess right now.”</i>", parse);
						Text.NL();
						Text.Add("You make a show of looking over the spooge-slick fur of your vulpine lover, before grinning and assuring [himher] that [heshe] pulls the look off <i>very</i> well. There’s just something sexy about the sight of [himher] utterly drenched in [hisher] own semen.", parse);
						Text.NL();
						Text.Add("<i>“There’d better be, since this is all your fault,”</i> Terry replies teasingly. <i>“Speaking of which, how long do you plan to stay inside me? I could really use a bath...”</i>", parse);
						Text.NL();
						if(knotted) {
							Text.Add("Well, that’s not exactly up to you, and you tug your bulging knot[s4] inside of Terry’s hole[s4] to emphasize your point.", parse);
							Text.NL();
							Text.Add("<i>“I guess you have a point,”</i> [heshe] sighs. <i>“Well, I guess I get to ‘forcibly’ enjoy you a little longer,”</i> [heshe] giggles.", parse);
							Text.NL();
							Text.Add("You smile happily and nod, enjoying the sound of Terry’s laugh.", parse);
							Text.NL();
							Text.Add("<i>“Just hope all this cum won’t dry up till you can pull out. You have no idea how tough it is to clean-up dry cum when you got fur as fluffy as mine.”</i>", parse);
							Text.NL();
							Text.Add("You nod your head in idle agreement, busy with snuggling yourself appreciatively into the soft fluffyness of your vulpine pillow. As you close your eyes and allow yourself to luxuriate in Terry’s warmth, you idly promise [himher] that, whether it dries or not, you’ll help Terry clean [himher]self off when you’re done.", parse);
							Text.NL();
							Text.Add("<b>Later...</b>", parse);
							Text.NL();
							Text.Add("Finally feeling your knot[s4] deflate, you wriggle your hips and pop yourself free. Now, that just leaves the question of how to clean Terry up...", parse);
							
							world.TimeStep({hour : 1});
						}
						else {
							Text.Add("You pout and ask if Terry really wants you out of [himher] already? [HeShe]’s so comfortable!", parse);
							Text.NL();
							Text.Add("<i>“I’m also very dirty, and you wouldn’t believe how tough it is to clean dry cum from fluffy fur.”</i>", parse);
							Text.NL();
							Text.Add("You have to admit to yourself, the [foxvixen] has a point. Slowly and tenderly you pull yourself free of Terry’s leaking hole[s], pausing whilst still atop [himher] to study the mess. Since this is your fault, you resolve that you should help Terry with the clean up.", parse);
						}
						Text.Flush();
						
						world.TimeStep({hour: 1});
						terry.slut.IncreaseStat(100, 1);
						terry.relation.IncreaseStat(100, 1);
					
						Scenes.Terry.PCCleansTerry();
					}
					else {
						Text.Add("<i>“Phew, when you get going, there’s just no stopping you,”</i> Terry idly comments, still panting in exertion.", parse);
						Text.NL();
						Text.Add("[HeShe] certainly wasn’t complaining about that before, you quip, even as you gulp for air yourself.", parse);
						Text.NL();
						Text.Add("<i>“That’s because you were smothering me with your lips,”</i> [heshe] teases.", parse);
						Text.NL();
						Text.Add("You were smothering [himher]? Funny, the way you remember it, it was [himher] who wouldn’t let you up.", parse);
						Text.NL();
						if(terry.Relation() < 30) {
							Text.Add("<i>“In your dreams, perv,”</i> Terry replies, though [heshe] does have a smile on [hisher] face. <i>“Anyways… how long do you intend to stay inside me?”</i>", parse);
							Text.NL();
							Text.Add("You put on a thoughtful expression. Well... ", parse);
							if(knotted) {
								Text.Add("As long as it takes for your knot[s4] to deflate, you reckon.", parse);
								Text.NL();
								Text.Add("<i>“Ah, I’d forgotten about that...”</i> Terry sighs. <i>“So… what do we do until then?”</i>", parse);
								Text.NL();
								Text.Add("You simply smile, peck Terry gently on the lips, then lay your head back down upon [hisher] [tbreastDesc] and snuggle in softly, sighing in pleasure as you get comfortable.", parse);
								Text.NL();
								Text.Add("<i>“A-Alright, I supposed that’s one way...”</i> the [foxvixen] says, a bit uncomfortable with your closeness. But [heshe] settles down all the same.", parse);
								
								world.TimeStep({hour: 1});
							}
							else {
								Text.Add("If it really bothers [himher] so much, you suppose you can get out now.", parse);
								Text.NL();
								Text.Add("<i>“It’s...”</i> [heshe] seems to ponder the feeling for a few moments, before finally adding, <i>“kinda weird, I guess.”</i>", parse);
								Text.NL();
								Text.Add("With a smile, you assure [himher] that it’ll stop feeling so weird with practice. But, if [heshe]’ll let you stay a little longer, it’ll help it to stop feeling so weird.", parse);
							}
						}
						else if(terry.Relation() < 60) {
							Text.Add("<i>“Well, you were unexpectedly tasty. So, you can’t really blame for trying to get a more lasting flavor out of you.”</i>", parse);
							Text.NL();
							Text.Add("You just chuckle; it that’s how [heshe] feels, [heshe] only needs to ask whenever [heshe] wants a taste. You promise you’ll always have the time to refresh [hisher] memory.", parse);
							Text.NL();
							Text.Add("<i>“Don’t flatter yourself, you’re not THAT tasty,”</i> [heshe] quips back. ", parse);
							if(knotted) {
								Text.Add("<i>“Anyway, how long till your knot[s4] deflate[notS4] so we can get going?”</i>", parse);
								Text.NL();
								Text.Add("You visibly think it over, then shrug your shoulders flippantly. As long as it takes. With such a sexy [foxvixen] under you, why, you can’t make any promises.", parse);
								Text.NL();
								Text.Add("<i>“Flatterer,”</i> [heshe] giggles. <i>“Alright, I guess we’ll just wait.”</i>", parse);
								
								world.TimeStep({hour: 1});
							}
							else {
								Text.Add("<i>“In any case, how much longer do you plan to stay inside me?”</i>", parse);
								Text.NL();
								Text.Add("Pouting, you teasingly ask if [heshe]’s really so eager to be rid of you already.", parse);
								Text.NL();
								Text.Add("The [foxvixen] rolls [hisher] eyes. <i>“No, I’m not. I suppose you can stay a while longer...”</i>", parse);
								Text.NL();
								Text.Add("You smirk in triumph, pointedly cuddling back up to your vulpine lover, burying your head against [hisher] [tbreastDesc] and sighing in pleasure at the feeling of being so close.", parse);
							}
						}
						else {
							Text.Add("<i>“Hey, I have every right to push for more when a sexy [boygirl] like you puts the moves on me. Key point being: You started it.”</i>", parse);
							Text.NL();
							Text.Add("You nod your head, slowly conceding this is truth. Then, with a wicked grin, you kiss Terry passionately on the lips, breaking the kiss only to whisper gently into [hisher] ear that [heshe] was the one who finished it.", parse);
							Text.NL();
							Text.Add("<i>“Who says I’m done?”</i> [heshe] asks with a mischievous grin. Before you can reply, [heshe] grabs your head and pulls you into another kiss. It doesn’t last long though.", parse);
							Text.NL();
							Text.Add("<i>“Not done yet, just taking a break to catch my breath,”</i> [heshe] warns.", parse);
							Text.NL();
							Text.Add("You believe it... and you couldn’t be happier.", parse);
							Text.NL();
							if(knotted) {
								Text.Add("<i>“So, love. How long till your knot[s4] deflate[notS4]?”</i>", parse);
								Text.NL();
								Text.Add("With a smirk, you quip back that it depends on how long Terry wants it to be.", parse);
								Text.NL();
								Text.Add("<i>“Good, that gives me plenty of time to play with you then,”</i> [heshe] says with a predatory smirk, hands caressing your cheek.", parse);
								Text.NL();
								Text.Add("Oh, beat still my heart, you whisper, leaning back against your lover in a passionate embrace.", parse);
								
								world.TimeStep({hour: 1});
							}
							else {
								Text.Add("<i>“Not that I have a problem with it or anything, but how long do you intend to stay inside?”</i>", parse);
								Text.NL();
								Text.Add("As long as Terry will let you, you shoot back, snuggling yourself down into Terry’s [tbreastDesc]. After all, [heshe] isn’t <b>really</b> in a hurry to get rid of you, is [heshe]?", parse);
								Text.NL();
								Text.Add("<i>“Of course not, love. Just thought that the sooner you leave me, the sooner you’ll be ready for another round,”</i> [heshe] quips back with a smirk.", parse);
								Text.NL();
								Text.Add("That is true... still, you’d rather cuddle for a little while first before you leave. You glance up with the widest, most innocent-looking eyes you can muster at your vulpine bedmate, playfully pleading with [himher] to agree.", parse);
								Text.NL();
								Text.Add("<i>“Oh, alright. You know I can’t say no when you make that face...”</i> Terry replies, rolling [hisher] eyes and hugging you affectionately.", parse);
							}
						}
						Text.Flush();
						
						Gui.NextPrompt(function() {
							Text.Clear();
							Text.Add("<b>Later…</b>", parse);
							Text.NL();
							Text.Add("With a little shifting and some wriggling of your hips, you pull yourself free of Terry’s warm hole[s], whiteness streaming in your wake. Shifting your weight, you slide off of Terry’s sprawling form and haul yourself upright, before reaching down and offering the [foxvixen] a hand to join you.", parse);
							Text.NL();
							Text.Add("Terry gladly accepts the help, one hand moving to catch some of the whiteness.", parse);
							Text.NL();
							if(terry.Slut() < 60) {
								Text.Add("[HeShe] brings [hisher] hand level with [hisher] eyes and looks at your combined juices. <i>“You really came a lot.”</i>", parse);
								Text.NL();
								Text.Add("You did, yes. It helps when you have such a cute bedmate as Terry to play with.", parse);
								Text.NL();
								Text.Add("<i>“Alright, that’s enough flattery. Let’s just get dressed and go.”</i>", parse);
							}
							else {
								Text.Add("[HeShe] brings [hisher] hand to [hisher] mouth and begins lapping at [hisher] digits. <i>“Hmm, so tasty. Though there’s still room for improvement flavor-wise.”</i>", parse);
								Text.NL();
								Text.Add("Oh? So now [heshe]’s an expert, hmm? You smile teasingly, even as you playfully shake your head.", parse);
								Text.NL();
								Text.Add("<i>“Kinda have to be with you around,”</i> [heshe] teasingly replies. <i>“But enough chitchat for now. Let’s get dressed and go.”</i>", parse);
							}
							Text.NL();
							Text.Add("After a few moments, you and Terry busy yourselves getting back into your respective gear. Once you’re both dressed, you set off again.", parse);
							Text.Flush();
							
							world.TimeStep({hour: 1});
							terry.slut.IncreaseStat(100, 1);
							terry.relation.IncreaseStat(100, 1);
					
							Gui.NextPrompt();
						});
					}
				}, enabled : true,
				tooltip : Text.Parse("Terry’s just begging for you to fill [himher] up. So why not give [himher] the entire course?", parse)
			});
			options.push({ nameStr : "Cum outside",
				func : function() {
					Text.Clear();
					Text.Add("Vigorously you continue to thrusting, feeling yourself climbing the metaphorical wall. So close now, so close...", parse);
					Text.NL();
					Text.Add("<i>“Ah! - [playername]! - Uhn! - I don’t think - Ah! - I can hold out any - Hng! - more!”</i>", parse);
					Text.NL();
					parse["c"] = terry.FirstCock() ? " and maleness" : "";
					Text.Add("Pulling back with all your will, you manage to pop your cock[s] free of the writhing [foxvixen] below you. Aiming your [cockDesc] at [hisher] clitty[c], you thrust forward again, rubbing and grinding upon the sensitive flesh.", parse);
					Text.NL();
					Text.Add("As one, you shudder and cry out, orgasm surging through the pair of you. Grabbing your throbbing [multiCockDesc], you aim [itThem] at Terry’s [tbreastDesc] and face, showering [himher] with glistening streamers of off-white seed. Your mind fades away in the tide of white-hot pleasure, only dimly cognizant as you paint your lover’s face and chest with pearlescent ropes of cum.", parse);
					Text.NL();
					if(terry.FirstCock()) {
						Text.Add("You feel Terry’s [tcockDesc] throb against your own, and look as the [foxvixen]’s prick unleashes it’s own cascade of white upon [hisher] hapless body - a huge load, ", parse);
						if(terry.HorseCock())
							Text.Add("fitting of the member that’s firing it.", parse);
						else
							Text.Add("unlike the below-average fox-cock that’s firing it.", parse);
						Text.NL();
					}
					
					player.OrgasmCum();
					terry.OrgasmCum();
					
					Text.Add("Terry is only capable of crying out in pleasure, as cum gathers in [hisher] once-soft fur. Utterly plastering it with the results of your recent activities. Some of the seed even manages to get into [hisher] mouth, but if [heshe] minds, or even notices, you can’t tell.", parse);
					Text.NL();
					Text.Add("Feeling mischievous, you angle your [multiCockDesc] to try and aim the last few spurts gushing from your dick[s] at Terry’s open mouth, ending with a few pitiful last dribbles that splatter messily on [hisher] belly.", parse);
					Text.NL();
					Text.Add("The [foxvixen] lays on the ground, panting and trying to catch [hisher] breath. <i>“Uhnn… I’m a  total mess,”</i> [heshe] mutters.", parse);
					Text.NL();
					Text.Add("Yeah, [heshe] kind of is, you immediately agree. But, you note with a smile, [heshe] looks pretty sexy when [heshe]’s all messed up like this.", parse);
					Text.NL();
					if(terry.Relation() < 30)
						Text.Add("<i>“Yeah, whatever you say...”</i> [heshe] replies. <i>“Damn, this is going to be so hard to clean up...”</i>", parse);
					else if(terry.Relation() < 60)
						Text.Add("<i>“Thanks, ya big perv,”</i> Terry replies with a chuckle. <i>“But I bet I won’t look half as sexy when all of this is dried up.”</i> [HeShe] sighs. <i>“It’s going to be a bitch to wash this out of my fur...”</i>", parse);
					else {
						Text.Add("<i>“What? You mean I don’t always look sexy?”</i> Terry asks teasingly.", parse);
						Text.NL();
						Text.Add("Of course [heshe] does! It’s just, well, that nice glazing of semen helps make [himher] look <b>extra</b> sexy.", parse);
						Text.NL();
						Text.Add("<i>“Good,”</i> the [foxvixen] says with a satisfied nod. <i>“Enjoy the sight while you can, [playername]. I’m going to have to wash this out before it dries.”</i>", parse);
					}
					Text.NL();
					Text.Add("Well, you made the mess, it’s only fair you should offer Terry a hand... you ask the [foxvixen] if you can help [himher] with the clean-up.", parse);
					Text.NL();
					Text.Add("<i>“Sure, I’d love to get some help cleaning up,”</i> [heshe] replies with a smile.", parse);
					Text.Flush();
					
					terry.slut.IncreaseStat(100, 2);
					terry.relation.IncreaseStat(100, 1);
					world.TimeStep({hour: 1});
					
					Scenes.Terry.PCCleansTerry();
				}, enabled : true,
				tooltip : Text.Parse("Pull out of your vulpine lover and glaze [himher] over with a nice layer of jism.", parse)
			});
			options.push({ nameStr : "Breed",
				func : function() {
					Text.Clear();
					Text.Add("With a shudder, you pull yourself firmly out of the writhing [foxvixen] beneath you. Terry lets out a wordless mewl of protest, but before [heshe] can articulate a more formal complaint, your hands lunge for [hisher] ass. Squeezing [himher] around the hips, you bodily roll [himher] over onto [hisher] front, pulling [hisher] ass up so that [heshe] is kneeling with [hisher] face down on the ground.", parse);
					Text.NL();
					parse["c"] = player.NumCocks() > 1 ? Text.Parse(" and [tanusDesc]", parse) : "";
					Text.Add("<i>“[playername]? What are you- Ah!”</i> You cut [himher] off before [heshe] can finish by penetrating [hisher] [tvagDesc][c] once more.", parse);
					Text.NL();
					Text.Add("Properly in place again, you take Terry by the hips and start to pump away, harder and faster than you have before. As best you can, you grind yourself down Terry’s [tvagDesc], trying to angle yourself to thrust as deeply as possible; you <b>need</b> to fill [hisher] womb with as much cum as you possibly can!", parse);
					Text.NL();
					if(player.NumCocks() > 1) {
						parse["c"] = terry.FirstCock() ? Text.Parse(" and paying special attention to [hisher] prostate", parse) : "";
						Text.Add("At the same time, you angle and grind with your second [cockDesc], firmly rutting Terry’s anus[c] in your efforts to make [hisher] cervix dilate.", parse);
						Text.NL();
					}
					if(terry.Relation() < 30)
						Text.Add("<i>“A-Ah! Be more gentle, [playername]! You’re- Ah!”</i> the [foxvixen] tries to protest.", parse);
					else if(terry.Relation() < 60)
						Text.Add("Terry moans and pants as you thrust into [himher] with abandon. <i>“Uh! Take it easy - Oh! - [playername]. I’m not - Ah! - going anywhere!”</i>", parse);
					else
						Text.Add("By this point Terry is reduced to a moaning mess, but [heshe] still does [hisher] best to reciprocate your thrusts. <i>“I - Ah! - I don’t know what brought this on. B-But I like it!”</i>", parse);
					Text.NL();
					Text.Add("Your hips slap against Terry’s with audible force - you just know the both of you are going to be walking a little funny after this. You can feel it, your cock[s] throbbing in anticipation; you’re going to blow any time now.", parse);
					Text.NL();
					parse["k"] = knotted ? Text.Parse(", your knot[s4] bloating to their full glory and anchoring you in place", parse) : "";
					Text.Add("Grabbing Terry’s ass for dear life, you thrust yourself as hard and as deeply as you can into [hisher] waiting hole[s]. You can feel it boiling within you, a rising tide of seed just aching to flood the [foxvixen]’s womb and fill [himher] with your child. Trembling in your excitement, you cry out and slam yourself in for the final time[k]. No sooner have your hips battered against Terry’s rear than you explode inside of [himher], hot seed gushing freely into [hisher] hole[s].", parse);
					Text.NL();
					
					terry.OrgasmCum();
					
					parse["c"] = player.NumCocks() > 1 ? " and ass both" : "";
					parse["considerable"] = terry.HorseCock() ? " considerable" : "";
					Text.Add("Your climax triggers the [foxvixen]’s own, [hisher] pussy[c] clamp[notS] down on your intruding cock[s]. ", parse);
					if(terry.FirstCock())
						Text.Add("[HisHer] own [tcockDesc] spasming as it begins shooting it’s own[considerable] load onto the ground below. ", parse);
					Text.Add("<i>“[playername]!”</i> Terry cries out in pleasure.", parse);
					Text.NL();
					Text.Add("You cry out in response, shouting Terry’s own name back to [himher].", parse);
					Text.NL();
					
					var cum = player.OrgasmCum();
					
					//TODO
					terry.PregHandler().Impregnate({
						slot   : PregnancyHandler.Slot.Vag,
						mother : terry,
						father : player,
						type   : PregType.Terry,
						num    : 1,
						time   : 24,
						load   : cum * 3
					});
					
					
					if(cum > 6) {
						Text.Add("Great gushes of semen wash into Terry like an ocean of spunk, filling [himher] to the brim and beyond. Such is the cascade of cum you have unleashed that Terry’s stomach distends, hanging pendulously down until it almost brushes the ground; [heshe] looks like [heshe] could drop a kit or two any day now. You’re almost certain that [heshe]’s going to get pregnant from this.", parse);
					}
					else {
						Text.Add("Pent up as you are, your load is much larger than normal. Terry’s belly begins to bloat, swelling into a cantaloup-sized bulge, almost as if foreshadowing what will happen to [himher] after your seed takes hold.", parse);
					}
					Text.NL();
					Text.Add("Finally, though, your climax ends and you slump over Terry’s prone form, panting from the exertion.", parse);
					Text.NL();
					Text.Add("<i>“Hmm, so full,”</i> the [foxvixen] says before collapsing [himher]self.", parse);
					Text.NL();
					Text.Add("You reach out and gently stroke the long mane of red hair flowing onto Terry’s shoulders, your other hand rubbing [hisher] shoulders with equal tenderness. Conversationally, you note that you hope Terry doesn’t mind being so full, because it’s very likely [heshe]’s going to feel that way for a while.", parse);
					Text.NL();
					if(terry.Relation() < 30) {
						Text.Add("<i>“You were pretty rough...”</i>", parse);
						Text.NL();
						Text.Add("You apologise for that as best you can. Still, it was for a purpose, you assure [himher] of that.", parse);
						Text.NL();
						Text.Add("<i>“Right… well, it’s not like I have any say about it...”</i>", parse);
						Text.NL();
						Text.Add("Maybe it wasn’t such a good idea to do this so early. You can practically hear the frown on Terry’s face. You’re going to need to work on [himher] if you want [himher] to like you more again.", parse);
						
						terry.relation.DecreaseStat(0, 1);
					}
					else if(terry.Relation() < 60) {
						Text.Add("<i>“Wow, that was… unexpected.”</i>", parse);
						Text.NL();
						Text.Add("You ask if Terry really thought it was so bad - did [heshe] really not like it?", parse);
						Text.NL();
						Text.Add("<i>“Not really, but I would’ve appreciated a warning at least.”</i>", parse);
						Text.NL();
						Text.Add("You apologise, stating that you were caught up in the moment; if you had a moment to think, you would have warned [himher] what you were going to do, you promise.", parse);
						Text.NL();
						Text.Add("<i>“Right...”</i>", parse);
						
						terry.relation.DecreaseStat(0, 1);
					}
					else {
						Text.Add("<i>“Didn’t know you’d get this turned over penetrating me,”</i> Terry chuckles. <i>“Now that I’m complaining, but wow… what brought this on?”</i>", parse);
						Text.NL();
						Text.Add("Bending down is a little awkward, but you manage to teasingly kiss the tip of one of Terry’s ears, which flicks at the touch. Why, you were simply overcome by Terry’s beauty, that’s all. And, well, you were convinced that now was the time to make a real effort toward expanding your little family with [himher]...", parse);
						Text.NL();
						Text.Add("<i>“I see.”</i> Terry takes a deep breath and smiles. <i>“Well, if you really want that, I have no objections, though I expect to be pampered and spoiled if it took,”</i> [heshe] adds teasingly", parse);
						Text.NL();
						Text.Add("You chuckle, and assure Terry that’s exactly what you had in mind from the beginning. Though you have to ask, what if it didn’t take?", parse);
						Text.NL();
						Text.Add("<i>“If it didn’t, then we get to try again later,”</i> [heshe] says, reaching back to grab your [buttDesc]. <i>“We can keep trying as much as you want, love.”</i>", parse);
						Text.NL();
						Text.Add("You chuckle and rub Terry’s ear in that way you know [heshe] loves. That’s your Terry, alright...", parse);
						
						terry.relation.IncreaseStat(100, 2);
					}
					Text.Flush();
					
					terry.slut.IncreaseStat(100, 2);
					
					world.TimeStep({hour: 1});
					
					Gui.NextPrompt();
				}, enabled : player.sexlevel >= 5 && terry.PregHandler().IsPregnant() == false,
				tooltip : Text.Parse("Show Terry what that cunt of [hishers] is really for! Breed [himher] like the bitch [heshe] is and fill [himher] full of kits!", parse)
			});
			if(terry.Cup() >= Terry.Breasts.Ccup) {
				options.push({ nameStr : "Tittyjob",
					func : function() {
						Text.Clear();
						Text.Add("Inhaling deeply to help yourself focus, you pull yourself purposefully from Terry’s used hole[s], precum seeping sluggishly from your [multiCockDesc] as you clear the [foxvixen]’s tunnel[s].", parse);
						Text.NL();
						if(terry.Relation() < 30) {
							Text.Add("<i>“Huh? Why did you stop?”</i>", parse);
							Text.NL();
							Text.Add("Because you can think of something else to do, something you are quite sure Terry will enjoy if [heshe] gives it a chance.", parse);
							Text.NL();
							Text.Add("The [foxvixen] sighs. <i>“I’m afraid to even ask… but what do you have in mind?”</i>", parse);
						}
						else if(terry.Relation() < 60) {
							Text.Add("<i>“Hmm? Is something the matter, [playername]?”</i>", parse);
							Text.NL();
							Text.Add("You shake your head, assuring the [foxvixen] that everything’s fine. You just feel like a different sort of finisher, this time.", parse);
							Text.NL();
							Text.Add("<i>“Oh? Well, what do you intend to do?”</i>", parse);
						}
						else {
							Text.Add("<i>“Aww, why did you pull out?”</i>", parse);
							Text.NL();
							Text.Add("Because, as lovely as Terry’s cunt is, those sweet boobs of [hishers] are just begging to get a little fun, too.", parse);
							Text.NL();
							Text.Add("<i>“Heh, alright then you big tease. If you want them so badly, why don’t you get over here and show me your appreciation,”</i> Terry replies, hugging [hisher] bust.", parse);
						}
						Text.NL();
						Text.Add("With purposeful movements, you slide your way carefully up Terry’s body, bringing[oneof] your [multiCockDesc] in line with the [foxvixen]’s [tbreastDesc]. Your hands reach out to cup the bountiful orbs, pressing them together to make a makeshift pussy, and you thrust your [cockDesc] into the squished breastflesh. A shudder of pleasure ripples through your body as the soft flesh, covered in warm, velvet-smooth fur, brushes so deliciously over your sensitive dickflesh, and you grind your way forward until you’ve managed to bury yourself in Terry’s tits to the very hilt.", parse);
						Text.NL();
						if(terry.Relation() < 30) {
							Text.Add("<i>“So this is what you had in mind...”</i>", parse);
							Text.NL();
							Text.Add("Not entirely, you quip. As Terry opens [hisher] mouth, you wriggle yourself forward, pushing the tip of your [cockDesc] into the [foxvixen]’s mouth. Now this is what you had in mind, you tease; so [heshe] had better start sucking.", parse);
							Text.NL();
							Text.Add("Terry mumbles a reply as [heshe] starts lapping at the [cockTip] of your [cockDesc].", parse);
						}
						else if(terry.Relation() < 60) {
							Text.Add("<i>“I see, so this is what you were looking for, ya perv,”</i> Terry teases, extending [hisher] tongue to lick the [cockTip] of your [cockDesc].", parse);
							Text.NL();
							Text.Add("You shudder appreciatively, and confess it’s true. But then, who’s the one who just started licking your dick, hmm? You’d say Terry’s the perv here...", parse);
							Text.NL();
							Text.Add("<i>“As if you weren’t going to request that in the first place!”</i> [heshe] teases back, giving you another lick.", parse);
						}
						else {
							Text.Add("<i>“So hot and so hard… you really like my boobs, don’t you? Ya big perv.”</i>", parse);
							Text.NL();
							Text.Add("Of course you do. They’re so soft and fluffy...", parse);
							Text.NL();
							Text.Add("<i>“Don’t worry, I know exactly how to deal with big [boygirl]s like yourself,”</i> the [foxvixen] says, extending [hisher] tongue to lap at the [cockTip] of your [cockDesc].", parse);
							Text.NL();
							parse["boygirl2"] = terry.mfPronoun("boy", "girl");
							Text.Add("You groan appreciatively; that’s your [boygirl2]...", parse);
						}
						Text.NL();
						parse["eager"] = terry.Relation() >= 30 ? " eager" : "";
						Text.Add("With Terry busy for the moment, you decide that you should reward the [foxvixen] for [hisher][eager] compliance.", parse);
						Text.NL();
						
						var tail = player.IsNaga() || player.HasPrehensileTail();
						if(tail) {
							parse["tailDesc"] = player.IsNaga() ? function() { return player.LegsDesc(); } : player.HasTail().Short();
							parse["tailSkinDesc"] = player.IsNaga() ? player.body.SkinDesc(player.Legs()) : player.body.SkinDesc(player.HasTail());
						}
						
						if(terry.FirstCock()) {
							if(tail) {
								Text.Add("Your [tailDesc] wriggles speculatively behind you, and you smile to yourself. Yes, that should do just nicely. Even as Terry laps away at your [cockTip] and your fingers grope and caress [hisher] ample bosom, smothering your shaft in furry boobage, your tail works its way back toward Terry’s nethers.", parse);
								Text.NL();
								Text.Add("Feeling for Terry’s [tcockDesc], you brush your tail-tip gently up its throbbing length, feeling the turgid flesh pulsing with [hisher] arousal, intimately aware of precum oozing sluggishly over its [tailSkinDesc]. Convinced what to do, your tail begin to curl itself around Terry’s shaft, slowly pumping back and forth along its length.", parse);
								Text.NL();
								Text.Add("Terry lets out a muffled groan, resolving to suckle on your [cockTip] instead of just licking it. Judging by [hisher] sudden grimace of pleasure, it seems that [heshe] likes the contact.", parse);
								Text.NL();
								Text.Add("Smirking, you coil your tail a little firmer around Terry’s dick and begin to stroke away with greater resolve, the looped flesh sliding up and down, back and forth, growing faster and surer with each pass, even as you focus on ministering to your own cock alongside Terry.", parse);
							}
							else {
								Text.Add("It’s a little awkward for you to lean back to reach [hisher] cock without pulling yourself away from Terry’s mouth, but you manage to pull it off. Groping fingers stroke and eventually take triumphant hold of the [foxvixen]’s [tcockDesc], allowing you to caress it with smooth, steady strokes of your fingers. You can feel [hisher] precum oozing over your fingers, intimately aware of it throbbing away under your grasp.", parse);
								Text.NL();
								Text.Add("Terry moans at your touch, hands instinctively flying to [hisher] bosom to sandwich your [cockDesc] between [hisher] luscious orbs. [HeShe] wastes no time in treating your [cockTip] to a few licks, before [heshe] starts suckling on it like a teat.", parse);
								Text.NL();
								Text.Add("With Terry so conveniently focusing on holding [hisher] breasts in place for you, you can properly focus your attention on feeling behind you to play with Terry’s [tcockDesc]. Your fingers stroke and caress, kneading the turgid flesh and dabbling in the bubbling precum, rubbing every sensitive spot that you can think of without actually being able to see it.", parse);
							}
						}
						else {
							if(tail) {
								Text.Add("Hmm... well, it might be a little odd, but you’re sure Terry will approve of it in the end. Grinning mischievously to yourself, your [tailDesc] undulates in anticipation before starting to crawl its way back down Terry’s body, over the [foxvixen]’s belly before reaching for [hisher] just-used cunt.", parse);
								Text.NL();
								Text.Add("<i>“Ah!”</i> Terry cries out in surprise as you penetrate [himher]. For a moment [heshe] loses [hisher] composure and just pants in lust, but [heshe] quickly recovers and goes back to licking and suckling on your [cockTip].", parse);
								Text.NL();
								Text.Add("You smile as you feed more of your tail inside of the [foxvixen]’s pussy; without being able to see, it’s a little trickier, as your tail isn’t as sensitive as your cock, but you soon feel content to start pumping away with your appendage. Even as you play with Terry’s breasts up front, your tail thrusts behind you, a makeshift dildo eager to get Terry off in turn.", parse);
							}
							else {
								Text.Add("This is going to be tricky, but you think you can manage it... Leaning back carefully, you tentatively feel for Terry’s pussy with your hand, fingers creeping like spiders in an effort to find [hisher] folds.", parse);
								Text.NL();
								Text.Add("Terry groans the moment [heshe] feels your digits on [hisher] moist folds. Seeing that you bothered to grant [himher] some pleasure, [hisher] hands fly to [hisher] breasts, to hold the soft orbs together, sandwiching your [cockDesc]. [HisHer] mouth opens and [heshe] envelops your [cockTip] in the moist embrace of [hisher] lips, tickling your glans with [hisher] tongue.", parse);
								Text.NL();
								Text.Add("You moan appreciatively. Since Terry is willing to take charge of your dick, you devote your attention to leaning back, supporting yourself with one hand on the [foxvixen]’s thigh even as the other busily caresses and teases [hisher] folds, doing the best you can to masturbate [himher] by touch alone.", parse);
							}
						}
						Text.NL();
						Text.Add("The two of you writhe together, mutually pleasuring each other as best you can. With your earlier efforts, you don’t last much longer. Huffing as you try to hold it back, you cry out a warning to Terry that you’re cumming. Seconds later, you arch your back and cry out as your [cockDesc] erupts right into Terry’s face.", parse);
						Text.NL();
						
						var cum = player.OrgasmCum();
						
						if(player.NumCocks() > 1) {
							Text.Add("You dimly note your other neglected cock[s] erupting in turn; some of it catches Terry right in the face, but most of it simply flies right over [hisher] head.", parse);
							Text.NL();
						}
						if(terry.Relation() + terry.Slut() < 90)
							Text.Add("The blast comes completely unexpected despite your warning. A few strands paint the [foxvixen]’s muzzle before [heshe] looks away so most of your climax flies right over [hisher] head. Only the last few weaker spurts manage to land on [hisher] face.", parse);
						else
							Text.Add("After the initial jet, Terry immediately clamps down on your cock, drinking all of your load that [heshe] can. Some of it winds up escaping the sides of [hisher] muzzle, [heshe] doesn’t stop. Terry only releases your tip when [heshe]’s sure that [heshe]’s gotten all of your creamy release. However as your [cockDesc] springs free, a leftover strand shoots out to plaster itself across the [foxvixen]’s muzzle.", parse);
						Text.NL();
						if(terry.FirstCock()) {
							if(tail)
								Text.Add("Even through your tail, you can feel Terry quivering; [heshe]’s so close... Diligently, you keep on pumping, until you can feel the semen gushing back up [hisher] shaft; then you use your tail to point [hisher] cock away, so [heshe] doesn’t go spraying it all over your back.", parse);
							else
								Text.Add("Feeling the trembling and the gushing tide of precum washing over your fingers stirs you to keep pumping away with your hands. When Terry quivers and squirms, it’s a struggle to point [hisher] [tcockDesc] away from you, but you manage to pull it off.", parse);
							Text.NL();
							parse["considerable"] = terry.HorseCock() ? " considerable" : "";
							Text.Add("<i>“C-Cumming!”</i> Terry cries out. A late warning, but thankfully you were already prepared. The fox spurts [hisher][considerable] load into the air. Most of it comes crashing down onto the ground, but a few droplets wind up falling onto your [skinDesc] all the same. What a messy [foxvixen]...", parse);
						}
						else {
							if(tail)
								Text.Add("Your tail quivers, but you manage to keep it steady, continuing to pump away into Terry’s sopping-wet hole... up until it clamps down on you like a vice, keeping you locked in place as the [foxvixen] cries out and squirms beneath you.", parse);
							else
								Text.Add("Your probing fingers continue to stroke and caress and pump as best they can. Soon enough, you feel Terry’s netherlips fluttering, trying to wrap around your fingers and squeeze them like a makeshift cock.", parse);
							Text.NL();
							parse["tail"]  = tail ? "tail" : "fingers";
							parse["tail2"] = tail ? parse["tailDesc"] : "digits";
							Text.Add("<i>“Hiyaaa!”</i> the [foxvixen] cries out in pleasure. [HisHer] pussy squirting a jet of femcum all over your [tail], most of it escaping around your [tail2] to create a messy pool on the ground below.", parse);
						}
						Text.NL();
						
						var cum = terry.OrgasmCum();
						
						Text.Add("<i>“Haah, haah, that was… pretty good,”</i> Terry says, collapsing on the ground.", parse);
						Text.NL();
						Text.Add("You nod and make a wordless hum of agreement. [HeShe] was really something, alright. You wriggle gently, carefully sliding your way off of Terry to lay on your back on the ground beside [himher].", parse);
						Text.NL();
						Text.Add("<i>“Hey, [playername]? How about a nap? I’m feeling mighty tired right now...”</i>", parse);
						Text.NL();
						Text.Add("You stifle a yawn and nod your head; a nap sounds mighty enticing right now...", parse);
						Text.Flush();
						
						terry.slut.IncreaseStat(100, 1);
						terry.relation.IncreaseStat(100, 1);
						world.TimeStep({hour: 1});
						
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : Text.Parse("Terry’s got some nice big boobs, so why not use them to finish the job?", parse)
				});
			}
			Gui.SetButtonsFromList(options, false, null);
		}
		//STRAPON FINISH
		else {
			Text.NL();
			Text.Add("Terry’s clearly very close... but you, yourself, need something a little more. On your next thrust backwards, you keep retreating until your toy pops clearly free of Terry’s grasping cunt.", parse);
			Text.NL();
			Text.Add("<i>“Huh? Why did you pull out? I was so close!”</i> [heshe] protests.", parse);
			Text.NL();
			Text.Add("Ignoring the [foxvixen], you turn your attentions to the mechanisms holding your artificial cock in place. A few deft motions, and you have it removed, and you waste little time in bending back down and manually feeding it back into Terry’s cunt.", parse);
			Text.NL();
			Text.Add("<i>“Ah! Yesss...”</i> Terry trails off, happy to have something to fill [hisher] quivering cunt once more.", parse);
			Text.NL();
			Text.Add("Smiling in satisfaction, you push the dildo what you judge to be a satisfactory distance into the [foxvixen]’s squirming cunt, then stand up. Circling the [foxvixen], you straddle [himher], swiftly moving up [hisher] torso until you reach [hisher] face, then turn around so you are facing back down [hisher] torso. Squatting over your vulpine lover’s face, you lower yourself down until your [vagDesc] is all but rubbing in [hisher] face.", parse);
			Text.NL();
			Text.Add("Terry immediately catches on to what you’re wanting, and dives into [hisher] task without delay or protest. [HisHer] broad vulpine tongue begins lapping your moist folds, teasing your [clitDesc] every few laps.", parse);
			Text.NL();
			Text.Add("You moan appreciatively, cooing a complement to your bedmate. To reward [himher] for being so compliant, you lean forward and reach down, grasping the base of the dildo you left penetrating [himher] and start to pump it back and forth. Slowly, at first, to get your old rhythm back.", parse);
			Text.NL();
			Text.Add("The [foxvixen] moans appreciatively moments before [heshe] buries [hisher] muzzle into your muff. [HeShe] begins truly licking your insides now, cooing at the taste of your sweet juices.", parse);
			Text.NL();
			Text.Add("Now this is more like it. You eagerly begin to speed up the rhythm of your dildo-thrusting, rewarding Terry’s enthusiasm in kind, matching your efforts to [hisher] own.", parse);
			Text.NL();
			if(terry.FirstCock()) {
				Text.Add("Seeing Terry’s [tcockDesc] waving back and forth over [hisher] belly, you determine that you should give it some attention as well.", parse);
				Text.NL();
				if(player.Slut() >= 40) {
					Text.Add("You lay yourself down atop Terry, shamelessly mashing your womanhood into [hisher] face as you eagerly reach for [hisher] [tcockDesc]. Opening your mouth, you gulp down the pre-drooling dick, lewdly slurping and slobbering in your eagerness, one hand playing with Terry’s balls and the other still pumping away with the dildo.", parse);
					blowjob = TerryBlowjob.Yes;
				}
				else
					Text.Add("Laying down further, you reach out with your free hand to caress Terry’s jutting [tcockDesc], alternatively stroking the throbbing shaft and fondling the seed-bloated balls beneath. As you do that, your other hand busily plunges the dildo back and forth, refusing to slacken it.", parse);
			}
			Text.NL();
			Text.Add("Your vulpine lover moans and groans, sending delightful vibration through your cunny. After a few more licks, [heshe] pushes you away to take a breath. <i>“I-I’m close!”</i> [heshe] warns you.", parse);
			Text.NL();
			if(blowjob >= TerryBlowjob.Yes)
				Text.Add("You’re so close, too, but of course you can’t tell [himher] that! All you can do is moan and mumble rapturously around the dick in your mouth, vibrating it even as you thrust your cunt back into Terry’s face. You want [himher] to lick you, dammit!", parse);
			else
				Text.Add("You gasp out to Terry that you’re also close, fingers tightening without thinking around [hisher] cock. You wriggle in anticipation, then mash your pussy back down against [hisher] lips, exhorting [himher] to keep licking even as you resume jerking and plumbing [himher].", parse);
			Text.NL();
			Text.Add("<i>“Cumming!”</i> Terry cries out, bucking one last time as [hisher] [tvagDesc] clamps down on the [cockDesc], holding it in place as a squirt of feminine fluids escape the seal of the [cockDesc], nearly knocking it out of [hisher] pussy.", parse);
			Text.NL();
			if(terry.HorseCock()) {
				if(blowjob >= TerryBlowjob.Yes) {
					Text.Add("You feel the [foxvixen]’s stallionhood throb within your maw, [hisher] balls visibly churning and knot fully inflating as the flared tip expands. Immediately you brace yourself for the oncoming onslaught of jism.", parse);
					Text.NL();
					if(player.sexlevel >= 5)
						Text.Add("Luckily this is not your first rodeo, and you manage to catch the first eruption without spilling a single drop. Despite Terry’s attempts to drown you with fox-cream, you’re good enough to maintain a steady rhythm of gulping it down and breathing. You don’t stop until the last gob of cum has been spilled, leaving you with a rounded out belly and completely satisfied after your hot drink.", parse);
					else {
						Text.Add("Despite your preparation, Terry’s load is just too much for you. You gag and release [hisher] shaft to try and catch your breath, getting plastered with a veritable eruption of fox-jism as Terry continue to cum. By the time [heshe]’s done, you’re an absolute mess!", parse);
						cumbath = true;
					}
				}
				else {
					Text.Add("You feel the [foxvixen]’s stallionhood throb within your grasp, and all you have is a moment to brace yourself before the first of many of Terry’s jets of cum exits it’s hiding place within [hisher] stallionhood and hits you with the force of a punch. All you can do is keep your eyes shut as Terry bathes you in a cascade of hot jism, leaving you a creamy mess.", parse);
					cumbath = true;
				}
				Text.NL();
			}
			else if(terry.FirstCock()) {
				if(blowjob >= TerryBlowjob.Yes)
					Text.Add("You feel Terry’s shaft throb within your maw, [hisher] balls churning with effort as [hisher] knot inflates to its full size. The first jet of fox-cum touches your [tongueDesc] and you instinctively drink it down, savouring the flavor of your vulpine lover as [heshe] tries to [hisher] best to cope with your demand for more cream. It’s almost disappointing when [heshe] stops cumming, leaving you slightly full, but still wanting more.", parse);
				else {
					Text.Add("You feel Terry’s canine shaft throb within your grasp and smile as the first rope shoots out of [hisher] crimson shaft with enough force to clear your head and fall across your forehead. The following ropes fly about chaotically, some hitting you in your chin, others hitting you on your [breastsDesc], a few plastering your [thighsDesc]. By the time Terry’s done, [heshe]’s only capable of shooting blanks. You pat [hisher] cute balls, overworked after this powerful climax, and giggles as they manage to send one more dollop out to drool onto your hand.", parse);
					cumbath = true;
				}
				Text.NL();
			}
			Text.Add("Despite [hisher] climax, Terry never stops licking you, nor kissing your [clitDesc]. With the scent of Terry’s climax hanging in your nostrils and such attention, it is little wonder that moments later, you are crying out in ecstasy. Your whole body quivers with pleasure as orgasm ripples through your body, pussy trying to clamp on Terry’s intruding tongue but spasming too fiercely to hold it.", parse);
			Text.NL();
			
			var cum = player.OrgasmCum();
			
			Text.Add("When your climax washes through you, you are left weak and spent. Panting for breath, you slowly topple from your perch atop Terry onto the ground beside [himher], flopping bonelessly onto your back as you continue to gulp air.", parse);
			Text.NL();
			Text.Add("<i>“That was… great,”</i> Terry says, licking [hisher] lips of any stray traces of your juices. [HeShe] sits up to look at you. <i>“I really enjoyed that, [playername]. ", parse);
			if(cumbath) {
				Text.Add("Sorry about the mess though.”</i>", parse);
				Text.NL();
				Text.Add("You smile and wave a hand flippantly, assuring [himher] it’s alright. Well worth the price of admission, as the saying goes.", parse);
				Text.NL();
				if(terry.Relation() < 30)
					Text.Add("<i>“So… if we’re done here, can I go now? I could really use a bath.”</i>", parse);
				else if(terry.Relation() < 60)
					Text.Add("<i>“Hey, before I go. Want some help cleaning up?”</i>", parse);
				else
					Text.Add("<i>“Love, you look absolutely gorgeous covered in my seed. Plus I love the fact that I marked you as mine,”</i> [heshe] chuckles at [hisher] own teasing. <i>“But I know dry cum can be a bitch to clean up, so do you want me to help you?”</i>", parse);
				Text.Flush();
				
				Scenes.Terry.TerryCleansPC();
			}
			else {
				Text.Add("Though I’d appreciate it if you didn’t try to drown me next time,”</i> [heshe] adds jokingly.", parse);
				Text.NL();
				Text.Add("Well, maybe [heshe] shouldn't do so good a job of eating you out next time, you quip back, teasingly sticking your tongue out at [himher].", parse);
				Text.NL();
				Text.Add("The [foxvixen] chuckles at your comeback, but otherwise doesn’t say anything. Eventually Terry gets back on [hisher] feet and offers you a helping hand.", parse);
				Text.NL();
				Text.Add("You eagerly reach out for it and allow the [foxvixen] to help you back upright again. Stretching a few kinks out of your joints, you smirk and playfully ask if Terry wouldn’t mind giving you back your [cockDesc].", parse);
				Text.NL();
				if(terry.Relation() < 45) {
					Text.Add("<i>“Huh? Oh right, sorry,”</i> the flustered [foxvixen] says, reaching between [hisher] legs to pull out your [cockDesc] with a groan. <i>“Here you go… perv.”</i>", parse);
					Text.NL();
					Text.Add("[HeShe] was almost about to walk off with it, and <b>you’re</b> the perv? Even as you say this, you grin and collect the toy off of [himher].", parse);
					Text.NL();
					Text.Add("Terry just grins back and collects [hisher] gear.", parse);
				}
				else {
					Text.Add("<i>“Aww. and here I was hoping you’d let me keep it as a souvenir,”</i> the [foxvixen] teasingly replies.", parse);
					Text.NL();
					Text.Add("Tempting, but... no, you’re going to need that in the future. So, your lewd little [foxvixen] can just give it back now, thank you.", parse);
					Text.NL();
					Text.Add("<i>“You put it there, you take it out,”</i> [heshe] replies with a wink, spreading [hisher] legs to give you access.", parse);
					Text.NL();
					Text.Add("You chuckle, but step forward, hand reaching out to grab your [cockDesc] by its base and slowly pull it free. You hold it up, pointedly watching it drip a bead of Terry’s female cum, and smirk knowingly at your vulpine lover before lowering it again.", parse);
					Text.NL();
					Text.Add("Terry playfully shows you [hisher] tongue, moving to fetch [hisher] gear.", parse);
				}
				Text.Flush();
			}
			
			terry.slut.IncreaseStat(100, 1);
			terry.relation.IncreaseStat(100, 1);
			world.TimeStep({hour: 1});
		}
	});
}

Scenes.Terry.SexCatchAnal = function() {
	var p1cock = player.BiggestCock();
	
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		fox        : terry.HorseCock() ? "stallion" : "fox",
		tcockDesc  : function() { return terry.FirstCock().Short(); },
		tcockTip  : function() { return terry.FirstCock().TipShort(); },
		hipDesc    : function() { return player.HipDesc(); },
		hipsDesc   : function() { return player.HipsDesc(); },
		armorDesc  : function() { return player.ArmorDesc(); },
		buttDesc   : function() { return player.Butt().Short(); },
		anusDesc   : function() { return player.Butt().AnalShort(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		ballsDesc  : function() { return player.BallsDesc(); },
		cockDesc   : function() { return p1cock.Short(); },
		cockTip    : function() { return p1cock.TipShort(); },
		vagDesc    : function() { return player.FirstVag().Short(); },
		clitDesc   : function() { return player.FirstVag().ClitShort(); },
		breastsDesc : function() { return player.FirstBreastRow().Short(); },
		tbreastsDesc : function() { return terry.FirstBreastRow().Short(); },
		nipDesc    : function() { return player.FirstBreastRow().NipShort(); },
		skinDesc   : function() { return player.SkinDesc(); },
		boygirl    : player.mfFem("boy", "girl"),
		tongueDesc : function() { return player.TongueDesc(); },
		tonguetipDesc : function() { return player.TongueTipDesc(); },
		feetDesc   : function() { return player.FeetDesc(); },
		legsDesc   : function() { return player.LegsDesc(); },
		thighsDesc : function() { return player.ThighsDesc(); },
		earDesc   : function() { return player.EarDesc(); }
	};
	
	var first = terry.flags["caFirst"] == 0;
	terry.flags["caFirst"]++;
	
	parse = terry.ParserPronouns(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	var tail = player.HasTail();
	var wing = player.HasWings();
	parse["tailDesc"] = tail ? tail.Short() : "";
	parse["wingsDesc"] = wing ? wing.Short() : "";
	
	Text.Clear();
	Text.Add("Grinning smugly to yourself, your gaze drifts toward Terry’s crotch and the delightful toy hanging there, already protruding from its protective sheath. With a lick of your lips, you step closer to Terry, cooing that this is going to be [hisher] lucky day.", parse);
	Text.NL();
	if(terry.Relation() < 30) {
		Text.Add("<i>“It is?”</i>", parse);
		Text.NL();
		Text.Add("You nod, assuring [himher] that it is.", parse);
	}
	else if(terry.Relation() < 60) {
		Text.Add("<i>“And why would that be?”</i> [heshe] asks with a smug smile.", parse);
		Text.NL();
		Text.Add("Well...", parse);
	}
	else {
		Text.Add("<i>“Reaaaaly?”</i> [heshe] asks with a grin.", parse);
		Text.NL();
		Text.Add("Oh yes, really, you purr, grinning back at [himher].", parse);
	}
	Text.NL();
	Text.Add("Because, right now, you feel like taking this - you reach out and cup Terry’s [tcockDesc], caressing it wantonly - and letting [himher] bury it right to the hilt in your needy ass. Still fondling the [foxvixen], feeling the warmth of arousal under your fingers, you purr seductively, asking if [heshe] likes the sound of that.", parse);
	Text.NL();
	Text.Add("<i>“Not gonna lie, I love what I’m hearing,”</i> [heshe] replies, thrusting [hisher] hips out and letting you fondle [hisher] crotch with a mischievous grin. <i>“Does that mean I can do whatever I want?”</i>", parse);
	Text.NL();
	Text.Add("You purse your lips thoughtfully. Well... you let Terry stew for a few moments, rubbing the tip of [hisher] cock with your fingertips, then grin broadly and nod. Whyever not? This time, Terry can be in charge; you’ll let [himher] do as [heshe] likes.", parse);
	Text.NL();
	Text.Add("<i>“Music to my ears… Now how about you stop holding out on me and show me the goods?”</i> [heshe] asks, placing a hand on your [hipDesc].", parse);
	Text.NL();
	Text.Add("[HeShe] only had to ask, you quip back, giving [himher] a quick affectionate squeeze with your fingertips before stepping back. With purposeful movements you divest yourself of your [armorDesc], casting it casually aside before turning around and bending over, thrusting out your [buttDesc] for the [foxvixen]’s approval.", parse);
	Text.NL();
	Text.Add("Terry starts by appraising your [buttDesc] moving [hisher] handpaws over your [skinDesc]. <i>“Nice,”</i> [heshe] says, giving you an appreciative pat.", parse);
	Text.NL();
	Text.Add("You smile over your shoulder, telling [himher] that you’re glad [heshe] approves.", parse);
	Text.NL();
	Text.Add("<i>“Let’s not waste time then,”</i> [heshe] says.", parse);
	
	//[Suck][Vagina][Grind][[HeShe] decides]
	var options = new Array();
	options.push({ nameStr : "Suck",
		func : function() {
			Text.Clear();
			Text.Add("The [foxvixen] guides you to the ground, then circles around to present you [hisher] erect [tcockDesc]. <i>“Here’s my cock, be a good [boygirl] and give me a good cockshine.”</i>", parse);
			Text.NL();
			Text.Add("Smiling happily, you reach out with one hand for the erection bobbing before you.", parse);
			Text.NL();
			if(terry.HorseCock()) {
				Text.Add("It’s not at full extension yet, but there’s at least nine or ten inches of semi-turgid horsemeat waving before you. Plenty to wrap your fingers around and then pull closer, letting the [tonguetipDesc] of your tongue glide teasingly over its surface. You lick the [foxvixen]’s stallionhood like an icecream, getting it nicely shiny before you pop it inside. The salty-sweet taste of precum washes over your senses and your eyes close to concentrate on it better. You bob your head back and forth, audibly humming your delight as you work it around inside your mouth, drooling unabashedly upon the proud erection.", parse);
			}
			else {
				Text.Add("Terry’s dainty little piece is so cute, really. [HeShe]’s really going to need to work it hard, but you just know [heshe] can pull it off. Your lips close around the tip in a mock-nip, then you noisily slurp it insides, burying your nose up against Terry’s belly. You lavish loving licks upon the pre-dripping piece of meat between your lips, tasting salty-sweet washing over your tastebuds and crooning with pleasure as you do.", parse);
			}
			Text.NL();
			
			Sex.Blowjob(player, terry);
			player.FuckOral(player.Mouth(), terry.FirstCock(), 1);
			terry.Fuck(terry.FirstCock(), 1);
			
			Text.Add("<i>“Ah, yes. That feels great,”</i> you hear [himher] whisper. [HisHer] hands move to your head, holding you gently by the sides as [heshe] guides you to [hisher] most sensitive spots. <i>“Work a bit harder here.”</i>", parse);
			Text.NL();
			Text.Add("You voice a muffled moan of desire, increasing the suction as best you can and stroking all the harder with your tongue. You lavish your attention on Terry’s [tcockDesc], worshipping it with lips and tongue until the precum is flowing steadily down your throat, then slowly pop yourself free. Strings of saliva link the bobbing dick to your parted lips, and it glistens before you as Terry shifts [hisher] stance. Your eyes look up toward the [foxvixen] and you give [himher] your sexiest smoulder, lustfully breathing that [heshe] looks good and lubed now.", parse);
			Text.NL();
			Text.Add("<i>“Ah! Here, let me help!”</i> the [foxvixen] says with glee, grasping your head by the sides and beginning to hump you.", parse);
			Text.NL();
			Text.Add("Caught off-guard, the [tcockDesc] plunges back between your lips, thrusting vigorously into your mouth again before you manage to raise your hands and pointedly shove Terry away. Wiping a smear of precum and saliva from your cheek, you ask if [heshe] really loves your mouth so much that [heshe]’s going to just turn down a chance to have your ass.", parse);
			Text.NL();
			Text.Add("<i>“Of course not. I’m just making sure you got it lubed enough. Wouldn’t want to hurt that pretty ass of yours would we?”</i> [heshe] replies with a smirk.", parse);
			Text.NL();
			Text.Add("No, you most certainly wouldn’t, you purr back. You just wanted to make sure [heshe] had [hisher] eye still on the real prize here for [himher]... Now, since you went and got your little [foxvixen] all lubed up, perhaps [heshe] would like to get started with the real fun now?", parse);
			Text.NL();
			Text.Add("<i>“As you wish, my pet,”</i> [heshe] says with a grin.", parse);
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : Text.Parse("Why doesn’t [heshe] bring that tasty [tcockDesc] around to your mouth? You’ll get [himher] all lubed up...", parse)
	});
	if(player.FirstVag()) {
		options.push({ nameStr : "Vagina",
			func : function(hischoice) {
				Text.Clear();
				if(hischoice)
					Text.Add("<i>“You know what, I think I’ll just use your [vagDesc] for this. Get down on the floor and raise your butt for me!”</i>", parse);
				else
					Text.Add("<i>“Great idea!”</i> the [foxvixen] exclaims. <i>“Alright then, I’ll give you a taste of my [fox]hood. Get down on the floor and raise that tush for me!”</i>", parse);
				Text.NL();
				parse["tail"] = tail ? Text.Parse(" and curl your [tailDesc] out of the way", parse) : "";
				Text.Add("You smirk to yourself and nod, already moving into position as you were instructed. Belly nearly flat on the ground, supporting yourself on your hands and elbows, you raise your [anusDesc] up into the air[tail], giving it a seductive shake.", parse);
				Text.NL();
				Text.Add("Terry starts off by gently massaging your [vagDesc], slowly teasing your labia and prodding your [clitDesc] with a padded finger. <i>“You were not lying about the wet part,”</i> Terry comments, bringing [hisher] moist digits to [hisher] mouth and giving them a lick.", parse);
				Text.NL();
				Text.Add("You moan huskily and arch your back, curling your [feetDesc] in pleasure at Terry’s touch, then chuckling softly. Does Terry not like the idea [heshe] can get you so hot and bothered this easily? Imagine what you’ll be like when you’re actually wrapped around [hisher] hot, throbbing cock...", parse);
				Text.NL();
				if(terry.Relation() < 30) {
					Text.Add("<i>“Well, I’m just surprised you feel that way about me. Never thought a girl would get wet for me without money being involved.”</i>", parse);
					Text.NL();
					Text.Add("You shake your head and click your tongue. Any girl who wasn’t willing to give your sweet little [foxvixen] a shot was a fool. But their loss is your gain; and you don’t intend to let [himher] go any time soon...", parse);
					Text.NL();
					Text.Add("<i>“I see, thanks,”</i> [heshe] says with a smile. <i>“So… get started?”</i>", parse);
					Text.NL();
					Text.Add("Please, let’s.", parse);
				}
				else if(terry.Relation() < 60) {
					Text.Add("<i>“Of course I like it, but nothing wrong with working you up to the high, right? If you’re already like that then it kinda takes the fun out of it,”</i> [heshe] replies teasingly.", parse);
					Text.NL();
					Text.Add("Oh, poor baby; are you spoiling [hisher] fun? You’ll just have to make it up to [himher] when the real fun begins...", parse);
					Text.NL();
					Text.Add("<i>“I’m counting on it. But let’s not delay any longer, shall we?”</i>", parse);
					Text.NL();
					Text.Add("Somebody else is in a hurry too, hmm? Well, you’re ready when [heshe] is.", parse);
				}
				else {
					Text.Add("<i>“Ha! Any other fox would ask themselves why you said you wanted to be buggered if you’re here pining to get my fat cock up your [vagDesc]. But since it’s me, and I know what a huge perv you are…”</i> [heshe] trails off with a grin.", parse);
					Text.NL();
					Text.Add("As if that isn’t part of the reason [heshe] loves you so much, you immediately quip back.", parse);
					Text.NL();
					Text.Add("<i>“Too true. Now let’s get down to business, shall we?”</i>", parse);
					Text.NL();
					Text.Add("You purr contentedly at that suggestion and nod your head eagerly. Oh, yes...", parse);
				}
				Text.NL();
				parse["h"] = terry.HorseCock() ? " considerable" : "";
				Text.Add("The [foxvixen] starts off by gently prodding your moist slit with [hisher] [tcockTip], gathering some of your juices as [heshe] aligns with your opening proper. With deliberate slowness, as if savoring every second, [heshe] begins feeding you inch after inch of [hisher][h] girth.", parse);
				Text.NL();
				Text.Add("You gasp as you feel your folds spreading, then moan blissfully as Terry sinks inside of you. Unthinkingly, you clench down, trying to pull the [foxvixen] deeper, wriggling your hips to try and help guide [himher] inside. That feels good...", parse);
				Text.NL();
				Text.Add("A moan of pleasure emanates from your pet [foxvixen], but [heshe] doesn’t change [hisher] pace. [HeShe] keeps slowly pressing inside you until [heshe] bottoms out. <i>“Dammit, [playername]. If you keep gripping me like this I’m gonna wind up shooting my load up your pussy,”</i> [heshe] says with a gasp of pleasure. ", parse);
				Text.NL();
				Text.Add("A moan bubbles from deep inside you, the temptation to tell the [foxvixen] to just go ahead welling up. But you shake your head and start breathing deep and slow, until your body stops shaking and you can unclench your folds. Feeling more sure of yourself now, you ask if Terry feels [heshe] is lubed enough now.", parse);
				Text.NL();
				Text.Add("<i>“Honestly, I think I could do with a bit more, but we’d better stop now before you wind up grabbing me in a vice again,”</i> the [foxvixen] chuckles.", parse);
				Text.NL();
				Text.Add("Even as you nod, you still can’t hold back a quiver and a pout of disappointment as Terry gently slips [hisher] newly slickened shaft from your womanhood.", parse);
				Text.NL();
				Text.Add("<i>“Alright, let’s begin!”</i>", parse);
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : Text.Parse("You’re already plenty wet in the other hole; why doesn’t [heshe] lube [hisher] dick there?", parse)
		});
	}
	options.push({ nameStr : "Grind",
		func : function(hischoice) {
			Text.Clear();
			if(hischoice)
				Text.Add("<i>“You know what, I think all you need is a bit of grinding and you’ll be all set. Get down and spread yourself for me!”</i>", parse);
			else
				Text.Add("<i>“You want it that bad?”</i> the [foxvixen] teases. <i>“A little patience wouldn’t hurt, [playername]. But that’s okay. If you want to feel my cock up your butt so badly, I’ll oblige! Now get down and spread yourself for me!”</i>", parse);
			Text.NL();
			Text.Add("[HeShe] only had to ask. Smiling, you ease yourself to the ground and move your [legsDesc] to better expose the full expanse of your [anusDesc]. You even go so far as to reach back with one hand and crudely spread your buttcheeks with your splayed fingers, ensuring the [foxvixen] can get a better look at your [anusDesc].", parse);
			Text.NL();
			Text.Add("Terry starts out by grabbing your [hipsDesc] and aligning [hisher] [tcockDesc] with your butt-cleavage.", parse);
			Text.NL();
			Text.Add("You groan in pleased anticipation as you feel Terry’s hard meat slap against your asscheeks, moving your fingers to provide [himher] with better access to your hole. Shifting your stance slightly to be better braced, you tell [himher] to go ahead.", parse);
			Text.NL();
			Text.Add("The [foxvixen] begins humping you, brushing your [anusDesc] with [hisher] length as pre bubbles from [hisher] [tcockTip]. <i>“This might take a bit of work...”</i>", parse);
			Text.NL();
			Text.Add("A coo of pleasure escapes your lips, unthinkingly thrusting back with your hips as a shudder ripples down your spine. You assure Terry that you don’t mind; this feels delicious...", parse);
			Text.NL();
			Text.Add("<i>“Good, because we’re just getting started,”</i> [heshe] says, sliding [hisher] [tcockDesc] down to [hisher] [tcockTip] and smearing your sphincter with [hisher] slick pre.", parse);
			Text.NL();
			Text.Add("With Terry starting to grind [hisher] [tcockTip] against your anus, your hand abandons your ass and joins its partner in supporting you. As the [foxvixen] gently but insistently grinds [hisher] glans against your anus, you can’t help moaning at the feel of flesh on flesh, precum seeping into every wrinkle. Your [anusDesc] flexes in response to Terry’s touch, opening up in anticipation of his [tcockTip] pushing inside.", parse);
			Text.NL();
			Text.Add("<i>“Think that’ll be enough lube for you,”</i> Terry says, pulling away.", parse);
			Text.NL();
			Text.Add("Unthinkingly, you groan in disappointment, shifting your weight restlessly even though you know Terry will be giving it back to you soon.", parse);
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : Text.Parse("[HeShe] can just grind your ass, you know you’ll be ready for [himher] with a little prepping back there.", parse)
	});
	options.push({ nameStr : Text.Parse("[HeShe] decides", parse),
		func : function() {
			Text.Clear();
			Text.Add("<i>“If that’s what you want, I’m happy to oblige!”</i>", parse);
			Text.NL();
			var next = options[Math.floor(Math.random() * (options.length-1))].func;
			next(true);
		}, enabled : true,
		tooltip : Text.Parse("You want Terry to really cut loose on you; [heshe] can do whatever [heshe] wants to you.", parse)
	});
	
	if(terry.Relation() >= 45) {
		Text.Add(" <i>“Since you’ve been so nice to me, I think I’ll let you pick your poison. How do you wanna get me lubed up for that [anusDesc] of yours?”</i>", parse);
		Text.Flush();
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		var next = options[Math.floor(Math.random() * (options.length-1))].func;
		Text.Flush();
		Gui.NextPrompt(function() {
			next(true);
		});
	}
	
	Gui.Callstack.push(function() {
		Text.Clear();
		if(terry.Relation() < 30) {
			Text.Add("<i>“No point in delaying the inevitable!”</i> [heshe] says, gripping your [hipsDesc] and pushing [hisher] entire cock in a single thrust.", parse);
			Text.NL();
			
			Sex.Anal(terry, player);
			player.FuckAnal(player.Butt(), terry.FirstCock(), 4);
			terry.Fuck(terry.FirstCock(), 4);
			
			if(terry.HorseCock())
				Text.Add("Even with all the efforts Terry put into lubing you, you still shriek in shock and pain; [hisher] cock isn’t small by any stretch of the imagination, and [heshe] just jammed it in you with one move! Your anus feels like it’s on fire from the force with which he just violated you.", parse);
			else
				Text.Add("You cry out in surprise and a tinge of pain as Terry’s petite foxhood plunges home. Dimly you thank your lucky stars that Terry is small down there, and that [heshe] allowed you to lube [himher] up first. That would have <b>really</b> hurt otherwise...", parse);
			Text.NL();
			Text.Add("<i>“What’s the matter, [playername]? Wasn’t this what you were asking for?”</i> Terry teases, beginning to move [hisher] hips.", parse);
			Text.NL();
			Text.Add("Shaking your head to try and clear the spots from your eyes, you crane your head to glare at Terry over your shoulder. You protest that this is <b>not</b> what you asked for, cut-off in mid-sentence as Terry suddenly bucks roughly into your waist, making you snap forward with an incoherent splutter.", parse);
			Text.NL();
			Text.Add("<i>“You said I was in charge, and that I was supposed to take your butt. So that’s what I’m doing,”</i> [heshe] replies nonchalantly.", parse);
			Text.NL();
			if(first) {
				if(player.SubDom() >= 40) {
					Text.Add("Growling, you snap that being in charge doesn’t mean [heshe] can just hurt you for [hisher] own pleasure! [HeShe] better not forget [heshe] still has that collar around [hisher] neck, because you sure haven’t!", parse);
					Text.NL();
					Text.Add("<i>“Now, listen up. If you-”</i>", parse);
				}
				else {
					Text.Add("Tearfully, you ask why [heshe] has to do it in a way that hurts you; you wanted to be nice and let [himher] be in charge, so why is [heshe] treating you like this?", parse);
					Text.NL();
					Text.Add("<i>“You want to know why? I’ll tell you-”</i>", parse);
				}
				Text.Add(" Terry suddenly stops in [hisher] tracks, a gasp escaping [himher] as [heshe] suddenly grows motionless inside you. Though [heshe] stops moving, you can feel [hisher] [tcockDesc] throbbing inside. <i>“Haa, Haa...”</i> [heshe] pants.", parse);
				Text.NL();
				Text.Add("Looks like the collar has picked up on your distress and automatically started to punish Terry for you.", parse);
				Text.NL();
				if(player.SubDom() >= 40) {
					Text.Add("With a sneer, you taunt Terry that this is what [heshe] gets for abusing the trust you so generously placed in [himher]. You deliberately crawl forward, far enough that Terry’s [tcockDesc] pops free of your recently abused asshole.", parse);
					Text.NL();
					Text.Add("<i>“T-Too hot...”</i> [heshe] says airily, sitting on [hisher] knees, unable to do anything.", parse);
					Text.NL();
					Text.Add("Rolling over onto your back, you smirk at Terry. Well, what a shame. Maybe you should just leave [himher] like that - see if it will teach [himher] a lesson about not abusing your nicety in the future.", parse);
					Text.NL();
					Text.Add("<i>“N-No! Please...”</i> [heshe] begs, moaning as pre begins dripping from [hisher] [tcockTip].", parse);
					Text.NL();
					Text.Add("With a knowing smirk, you tap your finger against your arm. Well, it <b>would</b> be a waste of a perfectly good cock... and you did spend all that time getting primed and ready, too... Does [heshe] promise to be good if you let [himher] have the reigns again?", parse);
					Text.NL();
					Text.Add("<i>“Yes! Anything you want! Just make it stop, haa...”</i> [heshe] readily agrees.", parse);
					Text.NL();
					Text.Add("Well... you trail off, leaving the word hanging just long enough for the [foxvixen] to voice a plaintive, pleading moan. Smiling at [himher] in a gentler fashion, you raise yourself from your position and close the distance between you. ", parse);
					Text.NL();
					Text.Add("You take Terry gently in your arms and guide the [foxvixen] until [heshe] is laying on [hisher] back. Then, you straddle [hisher] waist, sitting so that [hisher] [tcockDesc] is jutting up through the cheeks of your [buttDesc].", parse);
					Text.NL();
					Text.Add("Teasingly, you grind your buttocks back against the [foxvixen]’s jutting erection, rubbing up and down and enjoying the feel of hot precum sliding over your [skinDesc], even as Terry moans plaintively beneath you.", parse);
					Text.NL();
					Text.Add("When you feel you have teased Terry enough, you lift your hips, align [hisher] cock with your asshole again, and start to descend again. This time you take it slowly and carefully - partially because of the lingering tenderness from Terry’s initial penetration, but mostly to make it clear that you aren’t helpless here. You don’t stop until you have taken [himher] to the very hilt.", parse);
				}
				else {
					Text.Add("With a sigh, you gently shake your head and ask if Terry is alright; you didn’t want this to happen to [himher], after all.", parse);
					Text.NL();
					Text.Add("<i>“T-Too hot...”</i> [heshe] says airily, sitting on [hisher] knees, helpless.", parse);
					Text.NL();
					Text.Add("In Terry’s state, it’s easy for you to pull yourself free of [hisher] [tcockDesc], shuffling forward so that you can stand up. Gingerly, you rub at your sore ass and take in the pitiful form of your lover.", parse);
					Text.NL();
					Text.Add("You shake your head and sigh softly; you should just leave [himher] to the collar for a while... but you won’t do that. Closing the distance back between you, you start carefully guiding the [foxvixen] to the ground, so that [heshe] is laying on [hisher] back.", parse);
					Text.NL();
					Text.Add("<i>“What are you…?”</i>", parse);
					Text.NL();
					Text.Add("Well, you can’t just leave [himher] like this, you declare, even as you start carefully straddling the [foxvixen]’s waist and gingerly aligning [hisher] [tcockDesc] with your ass. Even if [heshe] deserves it, you add. You inhale deeply, trying to steel your nerves, then slowly start to sink down again. A quiet moan escapes you as your abused anus stretches around Terry’s cock again, but you keep on, pushing down and down until your hips bump into [hisher] own.", parse);
				}
				Text.NL();
				Text.Add("<i>“Aaah...”</i> Terry sighs in relief. [HisHer] [tcockDesc] throbs inside you, seemingly growing harder.", parse);
				Text.NL();
				parse["vulpineequine"] = terry.HorseCock() ? "equine" : "vulpine";
				parse["c"] = player.FirstCock() ? Text.Parse(", your own [multiCockDesc] slapping meatily against Terry’s belly", parse) : "";
				Text.Add("You give yourself a few moments, breathing slowly and steadily, feeling your anus adjust to the [vulpineequine] shaft spreading it open. When you feel ready, you start to raise your hips, slowly dragging yourself up Terry’s shaft until the [tcockTip] almost pops free, then slowly sinking down again. You keep pumping back and forth like that, a nice steady rhythm[c].", parse);
				Text.NL();
				Text.Add("Terry tentatively reaches out for you, laying [hisher] hands on your [hipsDesc] to guide you up and down [hisher] shaft. From the way [heshe]’s moaning, you’d venture a guess that [heshe]’s enjoying your treatment. <i>“Oh! So good!”</i>", parse);
				Text.NL();
				Text.Add("You smile knowingly, teasingly asking if this doesn’t feel much better than when [heshe] was just brutally reaming your ass.", parse);
				Text.NL();
				Text.Add("<i>“Yes! Just don’t stop, please!”</i>", parse);
				Text.NL();
				Text.Add("As your own nerves sing from the stimulation, you have no intention of stopping. Slowly you increase your pace, each slide up and fall down a heartbeat quicker than the one before, until you are bouncing away quite steadily in the [foxvixen]’s lap. Terry moans and whimpers beneath you, the look on [hisher] face bringing a smile to your lips. You could almost forget about what you had planned, and just focus on riding Terry until [heshe] cums; you’re sure the [foxvixen] wouldn’t mind that...", parse);
				Text.NL();
				Text.Add("But you have a plan, and so you start slowing your pace again. When Terry groans in disappointment, you lower yourself forward, placing a tender kiss on [hisher] lips before asking if [heshe] feels more in control of [himher]self now.", parse);
				Text.NL();
				Text.Add("[HeShe] still looks a bit flustered, especially after the kiss. <i>“I’m fine… I guess,”</i> [heshe] replies, touching where you kissed [himher].", parse);
				Text.NL();
				Text.Add("Smirking in pleasure, you declare that if that’s the case, it’s time to try this again. And so, when you next raise your hips, you keep on rising until you have popped yourself free. Somewhat wobbly, you take a few steps back and kneel again, raising your [buttDesc] into the air. Smiling back over your shoulder at Terry, you playfully ask if [heshe] is ready to take it from the top.", parse);
				Text.NL();
				Text.Add("<i>“Yeah...”</i> [HeShe] gets back in position, aligning [himher]self with your entrance. <i>“Sorry.”</i>", parse);
				Text.NL();
				Text.Add("Apology accepted, but [heshe] had better not do it again! Now, let’s see what [heshe] can do when [heshe]’s <b>gentle</b> with the reins...", parse);
				Text.NL();
				Text.Add("Terry nods and begins slowly entering you once more.", parse);
			}
			else {
				if(player.SubDom() >= 40)
					Text.Add("You snap harshly at [himher] to have better care; you told [himher] the first time about being so rough! Has [heshe] forgotten what that collar [heshe]’s wearing will do if you’re not happy with [hisher] efforts?", parse);
				else
					Text.Add("Biting your lip, you gently remind Terry that [heshe] promised to be gentle with you when you let [himher] take the reins like this. Does [heshe] want that collar to go off again?", parse);
				Text.NL();
				Text.Add("<i>“Umm… sorry,”</i> [heshe] immediately slows down to give you a better chance to adjust.", parse);
				Text.NL();
				parse["sizeable"] = terry.HorseCock() ? " sizeable" : "";
				Text.Add("You inhale and exhale, slowly and steadily, willing your body to adjust to the[sizeable] invader intruding inside of you. Seconds tick away like hours, but finally you feel the pain of the [foxvixen]s blunt intrusion bleed away, leaving you able to move. Clenching your [anusDesc], you make a short, experimental thrust, sliding up and down on Terry’s cock. Though you feel the motion stirring your inner walls, it’s not painful, and emboldened, you make a second such thrust.", parse);
				Text.NL();
				Text.Add("<i>“Good to go?”</i> [heshe] asks tentatively.", parse);
				Text.NL();
				Text.Add("You slide back until your [buttDesc] is snug against Terry’s groin, smirking to yourself as you decree that you’re ready when [heshe] is.", parse);
			}
			Text.NL();
			Text.Add("Your [foxvixen] lover sets a brisk, but steady pace. Not too fast, but not too slow either. Just perfect for the constant climb toward the edge.", parse);
			Text.NL();
			Text.Add("You purr in pleasure as Terry thrusts into you, matching the rhythm with ease. You clench and squeeze with your anus, flexing the rippling walls of flesh in time with Terry’s efforts to better stroke and manipulate [himher] as [heshe] slides in and out. Your whole body trembles with desire, but you make yourself settle for matching the pace [heshe] is setting; you are leaving [himher] in charge, this time.", parse);
			Text.NL();
			var tw = "";
			if(tail)
				tw += ", curling your [tailDesc] out of the way";
			if(tail && wing)
				tw += " and ";
			else if(wing)
				tw += ", ";
			if(wing)
				tw += "shifting your [wingsDesc] so that he won’t be laying atop [himher]";
			parse["tw"] = Text.Parse(tw, parse);
			Text.Add("After a few pleasurable minutes, you feel a pressure growing over your [hipsDesc], creeping along your spine. You straighten your limbs to support the increase in weight as Terry leans over you[tw].", parse);
			Text.NL();
			parse["b"] = player.FirstBreastRow().Size() > 3 ? ", taking the opportunity to fondle you as well" : "";
			Text.Add("The [foxvixen] scrambles a bit to get [hisher] arms around you, one hand moving across your [breastsDesc]. [HeShe] teases your [nipDesc] with small pinches[b]. ", parse);
			if(player.FirstCock())
				Text.Add("[HisHer] other hand travels toward your crotch, where your [multiCockDesc] rests. [HeShe] easily finds[oneof] your [cockDesc] and begin stroking it.", parse);
			else
				Text.Add("[HisHer] other hand roams your [hipsDesc] looking for a good position to support [himher]self as [heshe] prepares to redouble [hisher] assault on your [buttDesc].", parse);
			Text.NL();
			parse["t"] = player.HasPrehensileTail() ? " coil your [tailDesc] around [hisher] legs as best as you can and" : "";
			Text.Add("As Terry plays you like an instrument, you moan in appreciation, You[t] thrust your ass back into Terry’s, grinding deliberately as your [anusDesc] does its best to milk [hisher] [tcockDesc] dry. With a lilting purr, you praise Terry for having such skilled fingers - but then, that’s part of the prize of having a thief for a lover.", parse);
			Text.NL();
			Text.Add("<i>“T-Thanks,”</i> [heshe] says shakily. <i>“Hng! If you keep clenching like that I won’t last long. Getting close already!”</i>", parse);
			Text.NL();
			Text.Add("Now that [heshe] mentions it... you shudder and groan deeply, thrusting harder against the [foxvixen] atop you. That makes two of you. Panting heavily, you plead for Terry to do you harder - you want to cum, too...", parse);
			Text.NL();
			Text.Add("<i>“Right.”</i> [HeShe] redoubles [hisher] efforts, hips slapping against your [buttDesc], rocking you forward each time they connect.", parse);
			Text.NL();
			Text.Add("You meet the [foxvixen] thrust for thrust and grind for grind, setting up a chorus of whorish moans and lewd mewls. You twist your hips from side to side, grinding and flexing in order to milk the [tcockDesc] ploughing your ass as best you can. Lightning races along your spine, fire burning under your skin; you’re so close you can taste it, and you scream Terry’s name in ecstasy, praying [heshe] will push you over the edge at last.", parse);
			Text.NL();
			Text.Add("The sound of flesh slapping against flesh competes with the sound of your heartbeat racing in your [earDesc]s, drowning out the world around you. There is only you and Terry, connected by the [tcockDesc] ravaging your [anusDesc]. Finally, in one definitive thrust, Terry slams [himher]self home, bulging knot stretching your asshole to its breaking point before gliding inside.", parse);
			Text.NL();
			
			var cum = terry.OrgasmCum(); //TODO
			var cum = player.OrgasmCum();
			
			Text.Add("As your pucker grinds shut, Terry howls like the fox [heshe] resembles, firing ropes of hot cum into your sealed-tight hole, the feel of liquid warmth splashing around inside of you the final thing you needed to push you over the edge. Your own cry of ecstasy rises to match your partner’s as your body quakes in orgasm.", parse);
			if(player.FirstCock())
				Text.Add(" Your [multiCockDesc] fire[s] a cascade of cum, splattering heavily on the ground below, filling your nostrils with the scent of sex.", parse);
			if(player.FirstVag())
				Text.Add(" Your [vagDesc] clenches in sympathy, spattering juices everywhere in a shower of feminine honey.", parse);
			Text.NL();
			Text.Add("Finally spent, you slump against the ground, panting for breath, groaning softly as the afterglow envelops you in its warm arms.", parse);
			Text.NL();
			Text.Add("Terry lays atop you, worn out after [hisher] earth shattering orgasm. <i>“That was pretty good.”</i>", parse);
			Text.NL();
			parse["h"] = terry.HorseCock() ? " newly cumflated" : "";
			Text.Add("[HeShe] wasn’t so bad [himher]self you quip back, affectionately petting one of the hands looped over your[h] stomach. So, how did [heshe] enjoy being given the reins? Everything [heshe] hoped for?", parse);
			Text.NL();
			Text.Add("<i>“Well, it was pretty fun, I admit. Thank you for doing this. Sorry about the rough start...”</i>", parse);
			Text.NL();
			Text.Add("You smile and assure Terry that it’s alright. [HeShe] should just try and remember to take it easier in the future. Tired of talking, you snuggle up to your vulpine bedmate as best you can, closing your eyes to wait out [hisher] knot deflating.", parse);
		}
		else if(terry.Relation() < 60) {
			Text.Add("<i>“Let’s begin then, I want to savor this,”</i> [heshe] says, beginning to slowly push past your sphincter.", parse);
			Text.NL();
			
			Sex.Anal(terry, player);
			player.FuckAnal(player.Butt(), terry.FirstCock(), 4);
			terry.Fuck(terry.FirstCock(), 4);
			
			if(terry.HorseCock())
				Text.Add("You moan deep and low as the [foxvixen]’s mighty stallionhood begins to stretch you open. You spare an idle thought to thank the fates for lube, and for Terry’s gentleness. Even with that, though, you’re definitely feeling it; your whole world seems to boil down to the horse-cock spreading you wider and wider, ploughing inexorably inside. For a moment, you almost find yourself doubting it will fit, but inevitably, Terry’s hips come flush with your own [buttDesc].", parse);
			else
				Text.Add("Arching your back, you croon in pleasure as Terry glides smoothly inside. You know that [hisher] cock isn’t the most impressively sized of organs, but it’s more than adequate for your needs. Indeed, between its size and the thorough job Terry did of lubing it, it’s almost effortless for you to open your [anusDesc] and let it just slide on in. The only possible dissatisfaction is that, even as Terry’s own hips come to rest against your ass, you want [himher] to go <b>deeper</b>; right now, [heshe]’s just tantalizing you, [hisher] glans tickling madly inside your butt.", parse);
			Text.NL();
			Text.Add("<i>“So warm!”</i> [heshe] sighs. <i>“I’m going to start moving now, okay?”</i>", parse);
			Text.NL();
			Text.Add("You let out a purring note of approval, nodding to show that it’s more than okay with you. You clench down with your [anusDesc], playfully trying to trap Terry’s cock where it is.", parse);
			Text.NL();
			Text.Add("<i>“Ack! You sneaky bastard,”</i> [heshe] playfully teases, beginning to pump [hisher] hips.", parse);
			Text.NL();
			Text.Add("[HeShe] knows that [heshe] loves it, you shoot back, working to match the [foxvixen] pump for pump.", parse);
			Text.NL();
			Text.Add("As Terry picks up [hisher] pace, you’re treated the feeling of [hisher] padded hand-paws roaming your back.", parse);
			if(tail) {
				parse["pt"] = player.HasPrehensileTail() ? " and try to curl it around his arm" : "";
				Text.Add(" [HeShe] moves to stroke your [tailDesc], gently teasing the base. Eliciting a thrill of pleasure from you. Whenever [heshe] tickles your base, you wag your [tailDesc] softly [pt].", parse);
			}
			Text.NL();
			Text.Add("You rotate your shoulders, shuffling your weight from arm to arm as you croon your appreciation. ", parse);
			if(wing)
				Text.Add("Your [wingsDesc] spread themselves in invitation, rewarded with Terry’s soft touch as the [foxvixen] kneads the muscles at their base before tenderly stroking out along their lengths and then returning. ", parse);
			Text.Add("Terry’s hands busily massage your neck and shoulders, loosening the tension in your muscles. You arch your back to better draw [hisher] attentions, making the [foxvixen] chuckle. Terry’s [tbreastsDesc] touch your back as [heshe] bends over, leaning [himher]self across your torso.", parse);
			Text.NL();
			Text.Add("[HeShe] nuzzles you softly, the new position helping him go deeper inside you. You can feel [hisher] knot batting your [buttDesc], as if asking to be allowed in. Yet Terry makes no effort to push past your barrier. <i>“How does this feel?”</i> [heshe] asks, hugging you from behind.", parse);
			Text.NL();
			Text.Add("It feels wonderful, you reply, making no effort to hide the pleased purr underlying your words. In a playful act, you clench your buttocks, feeling Terry’s knot grinding between your [buttDesc] cheeks. You wriggle your hips slightly, caressing the bulge of flesh within your anal cleavage, and ask why [heshe] is holding that back - you’re sure the two of you can make it fit, if [heshe] wants...", parse);
			Text.NL();
			Text.Add("<i>“Make no mistake, [playername]. By the end of this, you’ll be getting <b>all</b> of me. But why rush? Let’s take our time. Not everyday you let me own your ass,”</i> [heshe] says, slowing down [hisher] thrusts.", parse);
			Text.NL();
			Text.Add("You chuckle softly; is that what [heshe] really wants? Or is [heshe] simply scared that [heshe] can’t take it any faster than this? You’re a big [boygirl], you know you can handle whatever your pretty little [foxvixen] throws your way.", parse);
			if(player.HasPrehensileTail())
				Text.Add(" Your [tailDesc] twists through the air, landing a mocking swat on Terry’s own jiggly heart-shaped ass for emphasis.", parse);
			Text.NL();
			Text.Add("<i>“And what about you? Acting all cocky just because you can’t get enough of my cock,”</i> [heshe] teases right back.", parse);
			Text.NL();
			Text.Add("[HeShe]’s damn right you can’t get enough of [hisher] [tcockDesc]. ", parse);
			if(terry.HorseCock())
				Text.Add("[HeShe] has got a damn fine piece of stallion-meat. It’s so long and thick and juicy, with those balls just bulging full of fine vulpine seed. And with a great big bitchbreaking knot to cap it all off, the real thing that makes it stand out as unique in all the world.", parse);
			else
				Text.Add("[HeShe] uses that dainty little foxhood like an expert, hitting all the spots that a bigger dick just wouldn’t be able to touch. [HeShe]’s got the finesse to bring you to the peak of ecstasy; why wouldn’t you love having such an expert playing with you?", parse);
			Text.NL();
			Text.Add("So, what’s [heshe] afraid of? Doesn’t [heshe] think [heshe]’ll be able to handle you for real? You don’t mind if [heshe] blows [hisher] load in your ass - that’s what you want! With the hardest squeeze of your [anusDesc] for emphasis, you purr to Terry that [heshe] should just give it up to you; a nice, thick, sloppy shot of foxcum right down your slutty ass, just what you need.", parse);
			Text.NL();
			Text.Add("<i>“Hehe, alright then. If that’s what you want, you can have it all!”</i> Terry says, grabbing your waist and pulling you with all [hisher] might.", parse);
			Text.NL();
			Text.Add("Faster than you can follow, Terry pulls you backwards as [heshe] falls onto [hisher] shapely behind, the sudden shift in position bringing gravity to play. Your own weight means you fall down hard on Terry’s shaft, the [tcockDesc] spearing upward with such force that [hisher] knot proves no obstacle. Instead, you feel your anal ring stretching with all its might as it envelops the proud bulb of [foxvixen] flesh, driving it completely inside before you wetly slurp shut around it.", parse);
			Text.NL();
			
			var cum = terry.OrgasmCum();
			
			Text.Add("As you unconsciously squeeze down on the sensitive dickmeat with all your might, Terry yips loudly behind your ear. ", parse);
			if(terry.HorseCock()) {
				Text.Add("The pillar of equine flesh embedded in your stomach throbs so violently you can feel it through your anus, bulging as the first great shot of cum erupts inside of you.", parse);
				Text.NL();
				Text.Add("It feels like you’ve trapped some sort of perverse volcano inside your guts as the [foxvixen] empties [hisher] prodigious balls into your depths. The knot seals you closed so that each belly-bulging burst of seed has nowhere to go but up.", parse);
				Text.NL();
				Text.Add("By the time Terry shudders and slumps into your shoulder, your stomach audibly sloshes from the sheer volume of semen distending it.", parse);
			}
			else {
				Text.Add("Thick liquid warmth spills inside of you with a perverse slurping sensation. Terry’s humble knot traps it all enclosed, leaving you tingling with the feeling of [hisher] seed sloshing around in your ass.", parse);
			}
			Text.NL();
			Text.Add("You usher a plaintive moan and wriggle in your seat in Terry’s lap; even though Terry’s cum, you haven’t gotten off yet. The feel of [hisher] cock buried deep in your rosebud and [hisher] seed swirling through your guts enflames your desire, but you just can’t manage to cum on your own!", parse);
			Text.NL();
			Text.Add("<i>“Just quit struggling and cum already!”</i> [heshe] exclaims. ", parse);
			if(player.FirstCock())
				Text.Add("[HisHer] hand dives straight toward[oneof] your [multiCockDesc], gripping [itThem] and fapping with all that remains of [hisher] energy.", parse);
			else
				Text.Add("[HisHer] hand dives straight to your [vagDesc], teasing your entrance and pinching your [clitDesc] with all that remains of [hisher] energy.", parse);
			Text.NL();
			Text.Add("You buck and thrash as best you can with the anchor tying you to your vulpine lover. As pleasure washes over your senses, clouding your mind and blurring your vision, you blurt out praise to Terry about how good [heshe] is with [hisher] hands.", parse);
			Text.NL();
			Text.Add("If Terry says anything, it’s drowned out by your own cry of ecstasy as he provides the last bits of stimulation you need. In your mind, the metaphorical dam breaks, drowning you in a sea of pleasure. Your nerves spark and your blood sings as you arch your back, shuddering violently in climax.", parse);
			Text.NL();
			
			var cum = player.OrgasmCum();
			
			if(player.FirstCock()) {
				Text.Add("Your [multiCockDesc], painfully erect and throbbing by this point, finally erupt[s] under Terry’s nimble fingers. Ropes of seed fly from your loins, drenching the [foxvixen]’s hands and painting the ground before you with the fruits of your pleasure.", parse);
				Text.NL();
			}
			if(player.FirstVag()) {
				Text.Add("Your [vagDesc] creases shut, walls rippling and squeezing as your feminine nectar gushes forth. Strings of fluid paint themselves over your [thighsDesc] as you cum, squirting around a phantasmal cock and pooling wetly over Terry’s balls.", parse);
				Text.NL();
			}
			Text.Add("Finally spent, you slump back against Terry with a languid sigh of pleasure. [HeShe] makes a very comfortable body cushion, and you rest your head against [hisher] shoulder without hesitation, closing your eyes to focus on the feelings coursing through you.", parse);
			Text.NL();
			Text.Add("<i>“That was great. You have a very nice ass, [playername],”</i> Terry says, laying down on [hisher] side, and dragging you along by your tie.", parse);
			Text.NL();
			Text.Add("And [heshe] has a very, <b>very</b> nice cock, you purr back to the [foxvixen]. If [heshe]’s lucky, you might let [himher] have the reins more often, especially since [heshe] seems to know how to treat you right when you let [himher].", parse);
			Text.NL();
			Text.Add("You snuggle as close to Terry as you can, [hisher] [tbreastsDesc] pressed against your back, playfully grinding your buttocks deeper into [hisher] loins.", parse);
			
			player.slut.IncreaseStat(75, 1);
		}
		else {
			Text.Add("<i>“Better relax, dear. Don’t want to ruin this pretty ass of yours,”</i> Terry says teasingly, slapping your [buttDesc] for effect.", parse);
			Text.NL();
			Text.Add("Smirking, you quip back that of course [heshe] doesn’t; then [heshe] wouldn’t get to enjoy it to the fullest in the future, would [heshe]?", parse);
			Text.NL();
			Text.Add("<i>“Gotta watch out for my own interests,”</i> [heshe] teasingly replies. <i>“But if you’re being this cheeky, then I suppose you’re ready. So take it!”</i> [HeShe] bucks into you in a single thrust, lodging [hisher] [tcockTip] past your sphincter.", parse);
			Text.NL();
			
			Sex.Anal(terry, player);
			player.FuckAnal(player.Butt(), terry.FirstCock(), 4);
			terry.Fuck(terry.FirstCock(), 4);
			
			Text.Add("You arch your back and groan in surprise, clenching down instinctively to stop further intrusion. A heartbeat later, and you realise Terry’s not pushing any further than that. Your lips curl into a grin, before you force them into a pout, and you mockingly huff to the [foxvixen] about playing dirty tricks.", parse);
			Text.NL();
			Text.Add("<i>“No foul play here, [playername]. You asked for a buttfucking and that’s exactly what I’m giving you. Now loosen up so I can finish pushing in,”</i> [heshe] says, tapping your butt.", parse);
			Text.NL();
			Text.Add("You tap your chin in thought. A soft hum escapes your lips as you consider Terry’s request. Then you shake your head and issue a loud huff, telling [himher] no.", parse);
			Text.NL();
			Text.Add("<i>“Aww, come on. Don’t be like that,”</i> Terry says, gently rubbing your [hipsDesc]. <i>“Don’t you want me to make you feel good, hmm?”</i>", parse);
			Text.NL();
			Text.Add("Well...", parse);
			Text.NL();
			Text.Add("<i>“Pretty please?”</i> ", parse);
			if(tail)
				Text.Add("Terry says, bending over to nuzzle your [tailDesc]. Taking it in hand and gently biting the tip.", parse);
			else
				Text.Add("Terry says, bending over to nuzzle your back.", parse);
			Text.NL();
			Text.Add("You can’t help the smile that splits your face. With a chuckle, you praise Terry’s skill as a sweet talker.", parse);
			Text.NL();
			Text.Add("As you say this, you relax the grip of your [anusDesc] and start to push your hips back. Slowly guiding your ring down along Terry’s [tcockDesc].", parse);
			Text.NL();
			Text.Add("<i>“Hehe, don’t underestimate my smooth-talking skills, now let’s get this pretty ass of yours filled!”</i> [heshe] says, enthusiastically pushing inside.", parse);
			Text.NL();
			Text.Add("You moan appreciatively, pushing back into the advancing [foxvixen] with equal enthusiasm. You can feel every glorious inch of [tcockDesc] slide smoothly into your [anusDesc]. Your nerves sing as the flesh glides against your own, able to feel every vein, ridge and wrinkle of your lover’s dick. It almost comes as a surprise when your [buttDesc] bumps gently into Terry’s hips, having been so lost in the euphoria of being filled.", parse);
			Text.NL();
			Text.Add("You trill in pleasure, and then your eyes widen as something warm and wet glides teasingly over the back of your neck. You wriggle in surprise, unable to hold back an exclamation of shock that gives way to a laughing, ‘Terry!’", parse);
			Text.NL();
			Text.Add("<i>“What? I caught my prey, now I’m enjoying it,”</i> [heshe] says licking the back of your neck once more.", parse);
			Text.NL();
			Text.Add("A shiver runs along your spine, an instinctive reaction to the tickle of Terry’s tongue on your neck. You laugh in pleasure, and ask when it is that you became prey.", parse);
			Text.NL();
			Text.Add("<i>“The moment you asked me to take charge, sweet cheeks. Now let’s get this show on the road.”</i> [HeShe] begins moving, slowly at first, but [heshe] quickly picks up pace.", parse);
			Text.NL();
			Text.Add("The [foxvixen] moves smoothly and steadily, shifting slightly with each thrust in order to brush the most sensitive spots [heshe] can think of touching. ", parse);
			if(terry.HorseCock())
				Text.Add("The thick length of equine dick stretches you out wonderfully. [HeShe] can’t muster much finesse with its sheer size, but it does a very admirable job of stimulating you all the same. You are intimately aware of every bump and wrinkle, every bulging vein and ridging along its half-unfurled flare.", parse);
			else
				Text.Add("The petite [foxvixen]-prick may not be able to stretch you much, but its size lets Terry handle it like a real pro. The pointed tip twirls and twists inside of you as Terry angles, strokes and redirects it with each motion. It catches on every sensitive bulge, worms its way into each delicious cranny, and generally drives you mad with lust with each motion it makes.", parse);
			Text.NL();
			Text.Add("You are no passive partner during this either. You match Terry thrust for thrust, gyration for gyration. Your [anusDesc] flexes hungrily, sucking [hisher] cock in when [heshe] tries to pull it out and opening wide to ease [hisher] entry.", parse);
			Text.NL();
			Text.Add("<i>“Hmm, this is nice. But I’m kinda sad I don’t have more to play with back here.”</i>", parse);
			Text.NL();
			Text.Add("Baffled, you tilt your head and give the [foxvixen] a quizzical look over your shoulder. What does [heshe] mean?", parse);
			Text.NL();
			Text.Add("<i>“How about a little switch?”</i> Terry offers, pulling out of your [anusDesc] and grabbing your sides. Before you have a chance to say anything, [heshe] pushes you on your back.", parse);
			Text.NL();
			Text.Add("You blink in surprise and open your mouth to say something. Before you can work out what, though, Terry’s arms have flung themselves around your shoulders and the [foxvixen] is kissing you passionately.", parse);
			Text.NL();
			Text.Add("Your train of thought scatters, boiling down to the feel of [hisher] soft, cuddly form in your arms and the warm lips claiming your own. You reach for Terry to pull [himher] closer, even as [heshe] releases your lips.", parse);
			Text.NL();
			Text.Add("As you blink, you feel [hisher] [tcockTip] probing against your newly used butt, stopping just shy of actually penetrating.", parse);
			Text.NL();
			Text.Add("<i>“Isn’t that much better?”</i> [heshe] asks, leaning over to kiss you again.", parse);
			Text.NL();
			Text.Add("You chuckle that it certainly has its charm, then eagerly open your mouth to accept Terry’s second kiss. As you twine your arms around [himher], you feel [hisher] hips slide forward, pushing [hisher] [tcockDesc] back inside of you again, making you break the kiss with a gasp of pleasure.", parse);
			Text.NL();
			Text.Add("<i>“There’s just so much more for me to play with on this side,”</i> [heshe] says teasingly. [HisHer] hands caress your [breastsDesc]", parse);
			if(player.FirstCock())
				Text.Add(", stroke your [multiCockDesc]", parse);
			if(player.HasBalls())
				Text.Add(", fondle your [ballsDesc]", parse);
			if(player.FirstVag())
				Text.Add(", tease your [vagDesc]", parse);
			Text.Add(", then finally settle back on your [hipsDesc].", parse);
			Text.NL();
			Text.Add("That’s funny; you were thinking the same thing. As you grin, your hands reach for your vulpine lover’s chest. ", parse);
			if(terry.Cup() >= Terry.Breasts.Bcup)
				Text.Add("You gently cup [hisher] [tbreastsDesc], squeezing and kneading the vulpine tit-flesh with your fingers. Your thumbs press down on the pearly nubs of [hisher] nipples, rolling them as you continue to play with [hisher] boobs.", parse);
			else
				Text.Add("With forefinger and thumb, you take hold of each pink pearl of a vulpine nipple, twiddling them back and forth with short, gently firm strokes and pinches.", parse);
			Text.NL();
			Text.Add("<i>“Ahn! See? So much more,”</i> [heshe] replies, already beginning to pant.", parse);
			Text.NL();
			parse["v"] = terry.FirstVag() ? ", one finger reaching up to stroke teasingly at Terry’s vagina" : "";
			Text.Add("You smile and nod in agreement. Your hands leave their position on Terry’s [tbreastsDesc]; one travels up to drape itself around the [foxvixen]’s shoulders, giving you some extra support, whilst the other travels lower. With this free hand, you work your way under Terry’s girlish thigh and cup [hisher] balls[v].", parse);
			Text.NL();
			Text.Add("The [foxvixen]’s mouth opens at your touch, and you capitalize on it; you pull yourself forward and kiss [himher] hungrily, thrusting your [tongueDesc] through [hisher] lips and into [hisher] mouth.", parse);
			Text.NL();
			Text.Add("Terry kisses you back, pushing [hisher] body against yours as [heshe] begins bucking [hisher] hips. Fucking your butt while enjoying your lips on [hisher] own.", parse);
			Text.NL();
			Text.Add("The two of you wrestle together willingly, Terry’s [tcockDesc] rutting your [anusDesc] in counterpoint to the wrestling of your tongues. Your fingers knead and squeeze [hisher] balls, compelling [himher] to thrust deeper. [HisHer] arms crush you tight, [breastsDesc] to [tbreastsDesc] , fingers scraping across the [skinDesc] of your back.", parse);
			Text.NL();
			var gen = "";
			if(player.FirstCock())
				gen += "[multiCockDesc] slap meatily against [hisher] belly";
			if(player.FirstCock() && player.FirstVag())
				gen += " and ";
			if(player.FirstVag())
				gen += "your [vagDesc] drool female nectar over [hisher] thighs";
			parse["gen"] = Text.Parse(gen, parse);
			Text.Add("Pleasure washes through you like a rising tide, making your [gen]. You moan deeply into Terry’s mouth, breaking the kiss to sigh longingly, whispering to Terry that you’re getting so very close...", parse);
			Text.NL();
			Text.Add("<i>“M-Me too,”</i> [heshe] replies, panting. <i>“Let’s cum together, [playername].”</i>", parse);
			Text.NL();
			Text.Add("You nod your head and inhale deeply. Once you have steeled yourself, focusing your willpower on holding back your climax, you sink down Terry’s [tcockDesc] in a single fierce thrust. Terry’s bulging knot stops you, for a moment, but you power on, forcing your pucker to stretch until it envelops the bulging flesh and slurps it lewdly inside of you.", parse);
			Text.NL();
			Text.Add("As soon as Terry’s knot pops in, the [foxvixen] lets out a howl of pleasure. [HeShe] grits [hisher] teeth, in an attempt to stave off [hisher] oncoming climax. <i>“G-Gonna!”</i> [heshe] declares, looking you over.", parse);
			Text.NL();
			if(player.FirstCock()) {
				Text.Add("[HisHer] eyes home in on your [multiCockDesc], and in one fell swoop [heshe] takes[oneof] your cock[notS] into [hisher] mouth. Sucking on the [cockTip] in an effort to grant you that last spike you need to orgasm yourself.", parse);
				Text.NL();
				
				var cum = terry.OrgasmCum(); //TODO
				var cum = player.OrgasmCum();
				
				Text.Add("You fling your head back and cry out as you explode into the [foxvixen]’s suckling mouth. Terry valiantly swallows and gulps, drinking every last drop you have to give [himher].", parse);
				Text.NL();
				Text.Add("Even through the wracking shudders you experience as you empty yourself into Terry’s belly, you can still feel [hisher] own [tcockDesc] erupting inside your [anusDesc], sending [hisher] own cum shooting for your stomach.", parse);
				Text.NL();
				Text.Add("Like a perverse oroboros, you remain locked together, cock to mouth and cock to ass, each feeding the other with semen until you both run dry at last.", parse);
				Text.NL();
				parse["c"] = player.NumCocks() > 1 ? Text.Parse(", not caring about the mess your other cock[notS] made in the least", parse) : "";
				Text.Add("Terry releases your cock[c]. <i>“Hmm, tasty,”</i> [heshe] declares, slumping over your prone form.", parse);
				Text.NL();
				Text.Add("You’re certainly glad that [heshe] approves. As you say this, you pet [hisher] head affectionately.", parse);
			}
			else {
				Text.Add("[HisHer] eyes home in on your [vagDesc], and in a moment of desperation [heshe] shuffles to finger your moist entrance. Two fingers are crammed inside your pussy, while [hisher] thumb teases your [clitDesc]. This is the last straw, you can’t hold back anymore!", parse);
				Text.NL();
				
				var cum = terry.OrgasmCum(); //TODO
				var cum = player.OrgasmCum();
				
				Text.Add("You cry out in pleasure, quaking violently against your vulpine lover. Your [vagDesc] clasps shut, trying to squeeze [hisher] fingers like the cock they have pretended to be, drenching [hisher] wrist in your feminine honey.", parse);
				Text.NL();
				Text.Add("Even through your own cascade of pleasure, you can still feel when Terry’s [tcockDesc] bulges inside of you. A great spray of hot [foxvixen] cum floods your anus, swirling around inside your guts and driving your pleasure.", parse);
				Text.NL();
				Text.Add("Finally, the two of you are completely drained, slumping against each other for support.", parse);
				Text.NL();
				parse["bulging"] = terry.HorseCock() ? " bulging" : "";
				Text.Add("<i>“Haa… That was great, [playername],”</i> [heshe] says, gently caressing your[bulging] belly.", parse);
				Text.NL();
				Text.Add("[HeShe] wasn’t so bad [himher]self, you shoot back, playfully stroking [hisher] hair.", parse);
			}
			Text.NL();
			Text.Add("<i>“So, how’d you like being owned by your pet for a change?”</i> [heshe] asks with a mischievous grin.", parse);
			Text.NL();
			Text.Add("It was certainly quite an experience, you coo back. You might just have to consider doing it again in the future. So, you take it [heshe] liked being the owner instead of the pet, hmm?", parse);
			Text.NL();
			Text.Add("<i>“Sure. I mean, I don’t mind being the ‘pet’ most of the time, but switching roles once or twice keeps things fresh. After all, variety is the spice of life.”</i>", parse);
			Text.NL();
			Text.Add("It most certainly is, you agree. A coquettish smile on your lips, you spank your [buttDesc] for emphasis. Then you lean into your vulpine lover and curl your arms around [himher], pulling [hisher] head to your chest and kissing [himher] gently on the forehead.", parse);
			Text.NL();
			parse["masterMistress"] = terry.mfPronoun("master", "mistress");
			parse["boygirl"] = player.mfFem("boy", "girl");
			Text.Add("<i>“Snuggling your [masterMistress]. You’re such a good [boygirl], [playername],”</i> Terry says, gently caressing your cheek. <i>“Well, it’ll be a while before I can pull out, so best get comfortable.”</i>", parse);
			Text.NL();
			Text.Add("You’re hard-pressed to think of anywhere more comfortable than this. As you say this, you snuggle slightly closer to Terry, shifting in [hisher] lap to avoid squishing [himher] too much.", parse);
		}
		Text.NL();
		Text.Add("Once Terry’s knot finally deflates, you detach your [buttDesc] from the [foxvixen] you were so firmly attached to. The two of you clean yourselves off, get dressed again, and set off once more.", parse);
		Text.NL();
		parse["h"] = terry.HorseCock() ? ", <b>really</b>" : "";
		Text.Add("Your own progress is somewhat slower than it was before...your butt is really[h] aching. Damned if you don’t think it was worth it, though.", parse);
			
		terry.relation.IncreaseStat(80, 1);
		world.TimeStep({hour: 1, minute: 30});
		
		Text.Flush();
		
		Gui.NextPrompt();
	});
}
