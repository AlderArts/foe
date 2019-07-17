/*
 * 
 * Define Terry
 * 
 */

import { Entity } from '../entity';
import { Scenes } from '../event';

Scenes.Terry = {};

function Terry(storage) {
	Entity.call(this);
	this.ID = "terry";
	
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
	this.body.SetRace(Race.Fox);
	this.body.height.base      = 157;
	this.body.weigth.base      = 45;
	
	this.weaponSlot   = Items.Weapons.Dagger;
	
	this.Equip();
	this.SetLevelBonus();
	this.RecallAbilities();
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
	this.flags["vengeance"] = Terry.Vengeance.NotTriggered;
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
Terry.Vengeance = {
	NotTriggered : 0,
	Triggered    : 1,
	Pursued      : 2
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

Terry.prototype.Changed = function() {
	return this.flags["breasts"] != 0 ||
		this.flags["vag"]     != 0 ||
		this.flags["cock"]    != 0;
}

Terry.prototype.Recruited = function() {
	return this.flags["Saved"] >= Terry.Saved.Saved;
}

Terry.prototype.FromStorage = function(storage) {
	storage = storage || {};
	
	this.body.FromStorage(storage.body);
	this.LoadLactation(storage);
	this.LoadPregnancy(storage);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
	this.LoadCombatStats(storage);
	this.LoadPersonalityStats(storage);
	
	this.LoadJobs(storage);
	this.LoadEquipment(storage);
	
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
	var storage = {};
	this.SaveBodyPartial(storage, {ass: true, vag: true, balls: true});
	this.SaveLactation(storage);
	this.SavePregnancy(storage);
	
	// Save flags
	this.SaveFlags(storage);
	this.SaveSexFlags(storage);
	this.SaveCombatStats(storage);
	this.SavePersonalityStats(storage);
	
	this.SaveJobs(storage);
	this.SaveEquipment(storage);
	
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
	var vag = this.flags["vag"];
	if(vag == Terry.Pussy.None) {
		if(this.FirstVag())
			this.body.vagina = [];
	}
	else if(this.NumVags() == 0) {
		this.body.vagina.push(new Vagina());
		if(vag == Terry.Pussy.Used)
			this.FirstVag().virgin = false;
	}
}
Terry.prototype.SetCock = function() {
	this.body.cock = [];
	if(this.flags["cock"] == Terry.Cock.Regular) {
		this.body.cock.push(new Cock());
		this.FirstCock().length.base = 8;
		this.FirstCock().thickness.base = 2;
		this.FirstCock().race = Race.Fox;
		this.FirstCock().knot = 1;
		this.Balls().cumCap.base = 5;
		this.Balls().size.base  = 2;
		this.Balls().count.base = 2;
	}
	else if(this.flags["cock"] == Terry.Cock.Horse) {
		this.body.cock.push(new Cock());
		this.FirstCock().length.base = 28;
		this.FirstCock().thickness.base = 6;
		this.FirstCock().race = Race.Horse;
		this.FirstCock().knot = 1;
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
	return (this.FirstCock() && this.FirstCock().race.isRace(Race.Horse));
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
		Text.Add("[HeShe] occasionally scratches [hisher] neck, around the enchanted collar you gave [himher] to ensure [heshe]’s kept under control. Sometimes, [heshe] gives you an irritated glance when [heshe] thinks you’re not looking.", parse);
	else if(terry.Relation() < 60)
		Text.Add("Around [hisher] neck is an enchanted collar that prevents [himher] from leaving you or otherwise disobeying you. It was the only way you could take the petite [foxvixen] away from the death row. It’s probably a good thing [heshe]’s wearing it too; considering [hisher] thieving past, there’s no guarantee [heshe] won’t get in trouble again. When [heshe] spots you looking, [heshe] quickly nods in acknowledgement at you.", parse);
	else if(terry.flags["pQ"] >= Terry.PersonalQuest.Completed)
		Text.Add("The [foxvixen] is always wearing that enchanted collar you gave [himher] when you bailed [himher] out of jail, even though [heshe] technically doesn’t have to wear it anymore. You didn’t think the crafty [foxvixen] would find a way out of it, but [heshe] did. Even so, [heshe] insists on wearing it: “As proof of ownership,” you quote. You didn’t think [heshe] would take to [hisher] station so well, nor that you’d grow this close as you travelled together. When your eyes meet, [heshe] smiles warmly at you.", parse);
	else
		Text.Add("[HeShe]’s grown quite close to you as you spent time together, and you gotta admit, the [foxvixen] is not so bad once you get to know [himher]. You’ve found [himher] to be quite amorous when [heshe] wants to, and even a bit clingy at times… but nevertheless, you’re glad to have the company of the pretty [foxvixen]. When your eyes meet, [heshe] smiles warmly at you.", parse);
	
	if(DEBUG) {
		Text.NL();
		Text.Add("DEBUG: relation: " + terry.Relation(), null, 'bold');
		Text.NL();
		Text.Add("DEBUG: slut: " + terry.Slut(), null, 'bold');
	}
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
		Text.Add("The [foxvixen]’s eyes dart toward you and as your gaze meets [hishers], [heshe] smiles. Terry adjusts [hisher] hair a bit and straightens [hisher] posture as [heshe] stretches languidly, giving you a perfect, unobstructed view of [himher]self.", parse);
	Text.NL();
	Text.Add("Despite the crimson mane atop the [foxvixen]’s head, the rest of [hisher] fur is a very different color; golden yellow offsetting white. Though most of [hisher] face is pure white, a large ring of gold around each eye blurs together over the bridge of the nose, creating a very domino mask-like effect. [HisHer] ears are, likewise, pure gold on the outside and pure white on the inside. White gives way to gold at [hisher] neck, and you know for a fact that most of Terry’s fur is gold; only on [hisher] forelimbs, legs from knees to ankle, stomach, buttocks, and the very tip of [hisher] tail does the white return.", parse);
	Text.NL();
	Text.Add("Following the fur leads your gaze down to Terry’s chest. ", parse);
	if(terry.Cup() > Terry.Breasts.Flat) {
		parse["c"] = terry.FirstCock() ? Text.Parse(", contrasting the [tcockDesc] between [hisher] legs", parse) : "";
		Text.Add("A pair of [tbreastDesc] bulge noticeably atop Terry’s chest[c]. ", parse);
		if(terry.Cup() == Terry.Breasts.Dcup) {
			Text.Add("Though only D-cups, Terry is so slenderly built elsewhere that they seem exaggeratedly large. The full quivering breasts jiggle softly whenever [heshe] moves, making even the act of breathing almost hypnotic as they rise, fall, expand and contract. It really is incredible that such a dainty [foxvixen] could have such huge boobs.", parse);
			if(terry.Lactation()) {
				Text.NL();
				Text.Add("The huge [foxvixen] tits contain an equally huge supply of warm creamy milk, just waiting to be tapped. As if to prove your point, a small bead leaks from each perky pink nipple in turn, sliding down Terry’s areolae. With practiced disinterest, [heshe] wipes the smears of milk away with a quick flick of [hisher] fingers over each breast.", parse);
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
			Text.Add("<i>“Umm… it’s kinda embarrassing when you stare at them like that,”</i> the [foxvixen] says, cupping [hisher] tits.", parse);
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
			Text.Add("Terry cups [hisher] breasts, massaging[heft] them. <i>“You like them?”</i> [heshe] asks teasingly, <i>“Well, you’d better, 'cuz it was you who gave them to me.”</i>", parse);
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
			Text.Add("<i>“Ha! I will if you really want me to, but you’ll have to go naked yourself. If I’m going to be giving you eye-candy all the time, I expect the same treatment,”</i> [heshe] quips back.", parse);
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
	var preg = womb && womb.pregnant;
	var stage = preg ? womb.progress : null;
	if     (preg && stage > 0.8)
		Text.Add("Seems like Terry’s pregnancy is in its final stages. The [foxvixen]’s belly is nice and round. When you put your hand on [hisher] belly, you can feel the baby inside kick you. The big belly coupled with the [foxvixen]’s sometimes distant gaze make [himher] look very attractive...", parse);
	else if(preg && stage > 0.6)
		Text.Add("[HisHer] pregnancy has come a long way. You don’t think there’s much more [heshe] can grow before [heshe]’s ripe for birthing a little kit into the world. Terry sometimes rubs [hisher] belly with a smile; it’s clear that despite the burdens [hisher] pregnancy have imposed on [himher], [heshe]’s looking forward to popping the little pup out.", parse);
	else if(preg && stage > 0.4)
		Text.Add("Terry’s belly is growing nicely. The [foxvixen] sometimes has cravings, but that’s to be expected of a pregnant [foxvixen] - at least [heshe]’s not feeling sick anymore. You gotta say though, this pretty belly of [hishers] makes [himher] look very feminine and attractive. Maybe you should consider calling Terry over for some alone time later...", parse);
	else if(preg && stage > 0.2)
		Text.Add("[HisHer] belly’s developing a nice paunch, and you can see that [hisher] pregnancy is taking its toll on the poor [foxvixen]. Sometimes, Terry looks sick or tired, but that only lasts an instant before the [foxvixen] recomposes [himher]self.", parse);
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
			Text.Add("[Placeholder] Terry masturbates fiercely, cumming buckets.");
			Text.Flush();
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
	Text.Add("The thief hops around nimbly.");
	Text.NL();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);
	
	var first = this.turnCounter == 0;
	this.turnCounter++;
	
	if(first) {
		Items.Combat.DecoyStick.combat.Use(encounter, this);
		return;
	}
	
	var choice = Math.random();
	
	if(this.turnCounter > 4 && this.sbombs > 0)
		Items.Combat.SmokeBomb.combat.Use(encounter, this);
	else if(Abilities.Physical.Backstab.enabledCondition(encounter, this) && Abilities.Physical.Backstab.enabledTargetCondition(encounter, this, t))
		Abilities.Physical.Backstab.Use(encounter, this, t);
	else if(choice < 0.2 && Abilities.Physical.Kicksand.enabledCondition(encounter, this))
		Abilities.Physical.Kicksand.Use(encounter, this, t);
	else if(choice < 0.4 && Abilities.Physical.Swift.enabledCondition(encounter, this))
		Abilities.Physical.Swift.Use(encounter, this);
	else if(choice < 0.6)
		Items.Combat.PoisonDart.combat.Use(encounter, this, t);
	else if(choice < 0.8)
		Items.Combat.LustDart.combat.Use(encounter, this, t);
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
			Text.Add("Your search finally pays off when you see a vulpine tail rounding a corner toward an alleyway. You signal to Miranda and she opens a path in the crowd so you can give chase. As soon as she notices she’s being followed, she makes a mad dash toward the other side. <i>“Dammit!</i> Miranda curses as she rushes ahead. You follow in tow.", parse);
			Text.NL();
			Text.Add("After a while, she finally makes a mistake and rounds a corner on a dead end. Without so much a batting an eye, she readies herself for combat!", parse);
			Text.Flush();
			
			Scenes.Terry.CombatVsMiranda();
			return;
		}
		else {
			Text.Add("In the end, you come back empty-handed. Wherever the vixen is, she doesn’t seem to be here.", parse);
			Text.NL();
			Text.Add("<i>“Come on, let’s look somewhere else,”</i> Miranda says in annoyance, pushing a path open through the crowd so the two of you can get out.", parse);
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
		if(terry.hidingSpot == world.loc.Rigard.Residential.street) {
			Text.Add("After a long string of complaints, annoyed comments and plain rudeness, one of the residents finally provides a lead.<i>“A vixen? You mean that one?”</i> They point toward an alleyway, where you see a distinct vulpine running off.", parse);
			Text.NL();
			Text.Add("Without missing a beat, you call for Miranda and make a mad dash after the thief. You chase after her for a while, until Miranda manages to corner her at a dead end. She draws her blade and prepares for battle!", parse);
			Text.Flush();
			
			Scenes.Terry.CombatVsMiranda();
			return;
		}
		else {
			Text.Add("After a long string of complaints, annoyed comments and plain rudeness, Miranda approaches you. <i>“Any luck?”</i>", parse);
			Text.NL();
			Text.Add("You shake your head.", parse);
			Text.NL();
			Text.Add("<i>“Dammit! When I catch that thief...”</i> she trails off into a growl, signaling you to follow.", parse);
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
			Text.Add("You and Miranda wander through the warehouses of the merchant’s district, looking for any sign of the sleek vixen. The two of you check a few of them before you catch a glimpse of a moving shadow. You rush ahead without thinking, Miranda following hot on your heels, and as soon as round the corner, you’re faced with the vixen thief, already ready for combat!", parse);
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
			Text.Add("Despite your efforts, the search so far has been for nothing; you're both empty-handed despite how thoroughly you keep checking. You are just about to leave the warehouse district and search elsewhere when you spot something; a warehouse with its doors ajar. Recalling Miranda said there isn't much activity here even when things are normal, you deem that suspicious and call her attention to it, suggesting that you should both check it out.", parse);
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
			Text.Add("The two of you wait patiently, but when no reply comes, Miranda takes a step forward. Immediately, you note a small sphere flying toward her. She has no time to react as the sphere bursts open into a cloud of dust, temporarily blinding the canine guard. <i>“Shit!”</i> she exclaims, trying to shake off the dust.", parse);
			Text.NL();
			Text.Add("Thankfully, you manage to protect your eyes, and by the time you uncover them, you’re faced with a blur heading your way, no doubt making a run for it! You quickly strike them with your [weapon], narrowly missing your mark as the blur takes a step back. Their mask comes loose, falling on the ground, and as it does so, you’re faced with a familiar face. It’s the vixen from the Lady’s Blessing!", parse);
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
			terry.hidingSpot = world.loc.Rigard.Residential.street;
		}, 1.0, function() { return terry.hidingSpot != world.loc.Rigard.Residential.street; });
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
			terry.hidingSpot = world.loc.Rigard.Residential.street;
		}, 1.0, function() { return terry.hidingSpot != world.loc.Rigard.Residential.street; });
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
		Text.Add("Miranda cackles like a hyena in laughter, grabbing the vixen’s below-average sheath and checking behind. <i>“What a nice surprise! So you’re actually a boy?”</i> she asks, checking behind her… his balls. <i>“Nothing, what a kinky slut you are, Mr. Thief.”</i>", parse);
		Text.NL();
		Text.Add("<i>“C-cut it out! So what if I’m a guy?”</i>", parse);
		Text.NL();
		Text.Add("Miranda forces the fox down on his knees, eliciting a yelp. <i>“Pretty thing like you is too girly to be a guy,”</i> Miranda teases. <i>“I’m gonna show you what’s it like to be a real man,”</i> Miranda says, pulling her pants down and letting her half-erect doggy-dong flop against the trembling fox’s shoulder.", parse);
		Text.NL();
		Text.Add("You realize that Miranda's serious about this; she's in one of her moods again. What should you do?", parse);
		Text.Flush();
		
		world.TimeStep({minute: 30});
		
		//[LetHer][StopHer][TakeHim]
		var options = new Array();
		options.push({ nameStr : "Let her",
			func : function() {
				Text.Clear();
				Text.Add("Miranda spins the poor fox around, making him come face to cock with Miranda’s shaft. <i>“You’d better do a good job blowing me, slut. This is all the lube you’re going to get when I fuck your ass later,”</i> Miranda warns him, shoving her hermhood against his cheek.", parse);
				Text.NL();
				Text.Add("He tries his best to look away to no avail, he opens his mouth to utter a protest, which winds up being a terrible mistake as Miranda takes the opportunity to shove half of her eleven inches of doghood down his throat.", parse);
				Text.NL();
				Text.Add("You hear a muffled gurgle as Miranda begins to mercilessly ram her way down his throat.", parse);
				Text.NL();
				if(miranda.Attitude() >= Miranda.Attitude.Neutral)
					Text.Add("You can't help but wince at the unusual roughness with which Miranda starts fucking the thief. If that's how she tends to act when angry, maybe you should avoid getting on her bad side...", parse);
				else
					Text.Add("You actually feel a pang of sympathy for the thief. You can remember being on the receiving end of Miranda when she's in that sort of mood all too vividly.", parse);
				Text.Add(" Silently, you stand by and watch as Miranda unceremoniously fucks the fox's face, grunting lewdly to herself with effort as she slaps her cock back and forth down his throat. The thief tries his hardest, but he's ultimately little more than a living onahole, casting pleading looks in your direction as he does his best not to choke on her dick.", parse);
				Text.NL();
				Text.Add("<i>“What a nice throat you have, you dirty fox, but let’s not get ahead of ourselves,”</i> Miranda says pulling out of the fox’s abused mouth. He gasps and coughs, thankful for the opportunity to breathe fresh air. Unfortunately, it seems his ordeal is just not over yet. Miranda roughly grabs him and pins him down on the floor, butt up in the air as she teases him one more time before finally taking him, <i>“Get ready fox, I’m gonna split you in two!”</i> She pushes forward.", parse);
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
						Text.Add("<i>“But this bastard made us chase after him through the whole town!”</i> Miranda protests. It’s obvious she’s frustrated; normally she’d never talk back to you like this. Still, you won’t budge on that. You said no, and that’s final.", parse);
						Text.NL();
						Text.Add("<i>“Listen here, [playername]. I <b>am</b> your bitch, I don’t deny that. I’d be happy to take your orders and shut up anytime, but this bastard,”</i> she points at the fox, <i>“made it personal! So Aria help me, I’m going to wreck his ass!”</i>", parse);
						Text.NL();
						Text.Add("The two of you yell at each other as you scold Miranda. The thief doesn’t utter a single peep through this whole discussion, but you do detect that he’s at least relieved you didn’t let Miranda have her way. You’re about to add something on top of your arguments when the doors to the warehouse burst open.", parse);
					}
					else {
						Text.Add("Keeping her from making a big mistake, you tell her. What she was planning is not right and she knows it; she caught the thief, she'll get the glory, leave it at that.", parse);
						Text.NL();
						Text.Add("<i>“After this bastard made us chase after his tail through the whole city? You’ve gotta be kidding me!”</i>", parse);
						Text.NL();
						Text.Add("You shake your head and insist that you mean what you say; you won't let her do this. It's not right.", parse);
						Text.NL();
						Text.Add("<i>“Don’t you dare tell me what’s right or wrong in <b>my</b> city, [playername]. If you care so much, I have no problem letting you take his place, but Aria forbids me, I’m going to wreck someone’s ass over this!”</i>", parse);
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
						Text.Add("<i>“So the slut’s jealous someone might be stealing their thunder… Well, don’t worry; I’ve got enough in me for both of you, now step aside.”</i>", parse);
						Text.NL();
						Text.Add("A perverse thrill tickles down your spine, but you insistently shake your head and refuse to move.", parse);
						Text.NL();
						Text.Add("<i>“You’re making me mad, slut; trust me, you won’t like me when I’m mad. Now, step aside before I decide to rip you apart as well!”</i> she threatens with a growl.", parse);
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
						Text.Add("<i>“So the slut’s found some balls to stand up to me, huh? Well it’s either his ass or <b>your</b> ass. And trust me, if you thought I was being rough with you before, you haven’t seen anything! Now step aside!”</i>", parse);
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
			tooltip : "Criminal or not, letting her rape him just isn't right. She's not going to appreciate you interfering in her affairs, but it's still the noble thing to do."
		});
		if(player.FirstCock() || player.Strapon()) {
			options.push({ nameStr : "Take him",
				func : function() {
					Text.Clear();
					Text.Add("You protest to Miranda that it's not fair - you worked just as hard to catch this thief, you want a fair share of him too.", parse);
					Text.NL();
					if(miranda.Attitude() >= Miranda.Attitude.Neutral) {
						if(dom > 50) {
							Text.Add("<i>“Don’t worry about it, [masterMistress]. I’ll be done soon and then you can have your fun - or, if you can’t take waiting, you can have your way with me while I plow this dirty fox,”</i> she replies, pushing her dick against his lips.", parse);
							Text.NL();
							Text.Add("The offer to take Miranda instead is tempting, you have to admit, but your attention is more focused on the shapely fox femmeboi. You interrupt Miranda, telling her that you are going first.", parse);
							Text.NL();
							Text.Add("Miranda looks at you as if you’d just uttered nonsense. <i>“No offense, [playername], but this bastard made us chase after him through the entire city, and I’m raring for some payback. Normally, I’d be bending over and wagging my tail at you like a good bitch, but not this time, so deal with it.”</i>", parse);
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
							Text.Add("Miranda laughs at your statement. <i>“Oh, [playername], you crack me up. But after chasing this bastard through the entire city, you gotta be kidding if you think I’m going to sit back and wait for you to be done. Get in line.”</i>", parse);
							Text.NL();
							Text.Add("You inform her that you won't get in line - if you let her at him first, you'll probably never get a chance to fuck him, and even if you do, she'll probably have stretched him all out to the point he's useless. No, you insist that you get to go first this time!", parse);
							Text.NL();
							Text.Add("The two of you fall to arguing over who gets first rights on the thief's tight little ass, getting so carried away that time slips away. You are dragged rudely back to reality at a loud clamor as the warehouse doors are violently thrown open and strangers march into the room to join you.", parse);
						}
					}
					else { // Nasty
						Text.Add("<i>“So the slut feels like pitching instead of receiving for once, huh? Fine, I’ll let you have seconds, since I’m in such a nice mood,”</i> she replies pushing her dick against his lips.", parse);
						Text.NL();
						Text.Add("Firsts, you reply - you want to have him first.", parse);
						Text.NL();
						Text.Add("<i>“Why you… you’ve got some nerve demanding to go first. I’ve been chasing after this asshole through the entire city. I’m mad, frustrated and pent up, so I’m going first and that’s final!” </i>", parse);
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
			Text.Add("You quickly compose yourself and do your best to assess the situation. Beside you, you have a bound prisoner, naked from the waist down, and beside him is standing Miranda, dressed from the top up in a city watch outfit and naked from the waist down, an erection bobbing uneasily before her. In front of you, a detachment of armed and armored figures whose iconography makes it clear they belong to the Royal Guard. Really not a good scene to be caught in... at least <b>you</b> are still as dressed as you ever are; you look to be the only one acting somewhat professionally here, so your reputation is probably safe... pity Miranda can't say the same.", parse);
			Text.NL();
			Text.Add("The guards are led by a man in his mid thirties wearing garish silver armor, polished to a shine. You can tell he is a man very preoccupied with his own appearance, as his short, jet-black hair has been meticulously cut and oiled. Neither his armor nor his makeup does anything to soften the expression of sneering contempt on his face, nor the bile in his voice.", parse);
			Text.NL();
			Text.Add("<i>“Men, look at this,”</i> the commander points at both Miranda and the thief, descending into laughter, his men following in tow as they see what he is laughing at. Miranda’s ears flatten as she grabs her pants and pulls them up.", parse);
			Text.NL();
			Text.Add("<i>“Isn’t this exactly what you’d expect of the watch? Cohorting with a common thief. Truly, you cannot go lower than this.”</i>", parse);
			Text.NL();
			Text.Add("Miranda growls and steps toward the commander, <i>“Now you listen here-”</i>", parse);
			Text.NL();
			Text.Add("<i>“Shush dog! We’re here because we received information that the thief was holing up here, now be a good lapdog and go back to the watch. We will handle this since you’re obviously too busy with other issues to do your job. Men, haul this mangy mutt off to the prison.”</i>", parse);
			Text.NL();
			Text.Add("The Royal Guards waste no time in picking up the distraught fox and dragging him off, pants down and all. The ones not carrying the thief pick-up his loot and walk away as well. Once they’re out, the commander closes the door on two of you. Looking at Miranda, she looks on the verge of blowing up.", parse);
			Text.NL();
			Text.Add("<i>“Goddammit!”</i> she yells as she angrily punches the floor, cracking the boards and sending splinters flying.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				party.location = world.loc.Rigard.Tavern.common;
				world.TimeStep({hour: 1});
				Text.Add("After Miranda calms down enough, you two somehow find yourselves at the Maidens' Bane. Word that the Royal Guard had <i>caught</i> the thief has spread and the blockade has been lifted. Miranda looks absolutely dejected, drowning her sorrows in a mugful of ale.", parse);
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
						Text.Add("Shuffling a little close in your seat, you spread your arm over Miranda's shoulders, letting her feel your weight in a show of support. Gently, you assure her that you're on her side; the Royal Guard are damned fools, and she doesn't deserve what they did. But still, you know how hard she worked and what she did, and you respect her for how well she did. She should be proud of herself; while those puffed-up slugs were polishing their armor, she was out chasing down the thief and capturing him single-handedly - she's a real hero.", parse);
						Text.NL();
						Text.Add("Miranda smiles a bit at that and leans into you. ", parse);
						if(miranda.Attitude() >= Miranda.Attitude.Neutral) {
							Text.Add("<i>“Thanks, [playername]. ", parse);
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
	Text.Add("The guard examines the seal of the letter before breaking it open and reading its contents. Once finished, he returns the letter and mutters: <i>“Lucky mutt...”</i>", parse);
	Text.NL();
	if(party.InParty(miranda)) {
		Text.Add("You tell Miranda to hold back a bit. You don’t think it’d be a good idea to have her meet the thief right now.", parse);
		Text.NL();
	}
	
	Text.Add("He procures a keychain from his belt, and unlocks the door leading to the cells. <i>“Follow me.”</i>", parse);
	Text.NL();
	Text.Add("The two of you walk toward the back of the jail, passing through two more doors before arriving at an empty area where the guards lead you to a cell. Inside, you see the fox thief, resting on his cot and looking at the roof. <i>“Hey mutt! Today’s your lucky day. Your ticket out of here has arrived.”</i>", parse);
	Text.NL();
	Text.Add("The fox chuckles at that. <i>“Yeah right, ain’t I lucky...”</i>", parse);
	Text.NL();
	Text.Add("Turning to you, the guard says, <i>“I’ll leave you two to socialize while I fetch his belongings.”</i> Having said that, he promptly turns on his heels and walks away.", parse);
	Text.NL();
	Text.Add("Stretching languidly, he moves to get himself up. <i>“Alright, let’s meet my bene-”</i> as soon as his eyes set on you, he stops dead in his tracks. <i>“You!”</i>", parse);
	Text.NL();
	Text.Add("So, he remembers you then?", parse);
	Text.NL();
	if(terry.flags["Met"] == Terry.Met.LetHer) {
		Text.Add("<i>“You let that dog rape me! What’re you here for? Want to finish what you started?”</i>", parse);
		Text.NL();
		Text.Add("You tell him that, actually, no; you came to see him released.", parse);
		Text.NL();
		Text.Add("<i>“Oh, I get it. You’re going to let that dog have another go at me! What are you? Some kind of sick voyeur?”</i>", parse);
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
	Text.Add("The fox thief takes the collar, examining it in his hands. He looks at you, then back at the collar, obviously unsure if this is actually better than a death sentence. Finally with a sigh, he acquiesces and puts the collar around his neck. <i>“Tch, out of the pan and into the fire...”</i> he mumbles as he connects the iron tips, holding the collar around his neck. It looks a bit loose… maybe if he tried he could get it off? Still, you resolve to trust the twins’ word.", parse);
	Text.NL();
	Text.Add("You promptly say the word ‘Featherfall’, as you were instructed before.", parse);
	Text.NL();
	Text.Add("The collar emanates a faint pink glow, tightening up until it’s snug against the fox’s neck. He tries to grip the collar, scared that it might tighten enough to strangle him, but he’s ultimately unable to stop the magic from running its course. He moves to undo the binding, but the metallic tips refuse to let go. Seems like the enchantment worked like magic. <i>“There, it’s on,”</i> he says with disdain. <i>“I suppose you want me to call you [masterMistress] now?”</i>", parse);
	Text.NL();
	Text.Add("You think the matter over, and then tell him that he doesn’t have to. You might change your mind later, but for now, [playername] is all you expect him to call you.", parse);
	Text.NL();
	Text.Add("The guard returns, carrying with him a bag containing the thief’s stuff. <i>Here.</i> He hands it to you. <i>“Are you done yet? Can I open the cell?”</i>", parse);
	Text.NL();
	Text.Add("Yes, you reply. The guardsman takes a key and twists it in the lock, opening the door. Without so much as a word, he takes the fox by the shoulder and shoves him out of the cell and in your direction. <i>“He’s all yours, now get this mangy mutt out of my jail. Gonna have to kill all the fleas he left behind.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Don’t worry, I’m pretty sure your stench will do the job just fine,”</i> he quips back, pinching his nose.", parse);
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
		Text.Add("You hear the sounds of ruffling cloth for a few moments before he says, <i>“Done.”</i>", parse);
		Text.NL();
		Text.Add("Turning around, you take a good long look at the newly re-garbed fox. He's traded his former barmaid's dress and leather armor for a simple but good quality tunic and pants, both a little on the tight side. A leather cuirass drapes over his torso, and it looks like the guard even gave him back his chest holster, whilst his paw-like feet have been squeezed into knee-high leather boots.", parse);
		Text.NL();
		Text.Add("<i>“This isn’t as good as my previous gear, but it’ll have to do. Bet the bastard didn’t even look to see if it was the right bag… thank Aria it fits.”</i> He kicks the bag and the prison clothes into a corner. <i>“Thanks, chief.”</i>", parse);
		Text.NL();
		Text.Add("You inform him that it's no problem. Better he wasn't walking around in a prisoner's outfit anyway.", parse);
		Text.NL();
		Text.Add("As the two of you continue to walk in silence, he moves to walk beside you. <i>“Y’know, I didn’t really thank you for saving my neck. ", parse);
		if(terry.flags["Met"] == Terry.Met.StopHer)
			Text.Add("And for protecting me from that dog. ", parse);
		Text.Add("They say you should never look a gift horse in the mouth, but after our little encounter in the warehouse, you gotta understand I had my doubts.”</i>", parse);
		Text.NL();
		Text.Add("You tell him that's understandable.", parse);
		Text.NL();
		Text.Add("<i>“By the way, my name is Theodore, but everyone just calls me Terry. Thanks for rescuing me, [playername].”</i>", parse);
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
		terry.uniqueName = null;
		terry.monsterName = null;
		terry.MonsterName = null;
		party.SwitchIn(terry);
		
		if(party.InParty(miranda)) {
			var dom = player.SubDom() - miranda.SubDom();
			
			Text.NL();
			Text.Add("Terry looks a bit nervous as you set out, constantly looking around as if he was being watched. His fears turn out to be justified, as Miranda steps out from a side street, a wide grin on her face.", parse);
			Text.NL();
			Text.Add("<i>“So the little thief is roaming the streets again, guess that means you are fair game!”</i> You tell her to stop teasing Terry, and introduce him to her.", parse);
			Text.NL();
			Text.Add("<i>“W-w-what?! She’s with you? B-but you said-!”</i> Terry swivels this way and that, desperately looking for a way to escape. You tell him to calm down, and remind him of the collar. For a moment, the effeminate fox looks like he’s going to chance it, but then he lowers his head, shuffling to stand behind you.", parse);
			Text.NL();
			Text.Add("You explain that Miranda is traveling together with you, and he’ll just have to deal with that.", parse);
			Text.NL();
			Text.Add("<i>“You’re asking too much! I’m not going to travel with this stupid bitch!”</i> he protests.", parse);
			Text.NL();
			Text.Add("Miranda cracks her knuckles, she looks like she’s about to teach him a lesson, but you stop her. You inform Terry that it’s either this or death row, so the faster he gets used to this, the better. Likewise, you tell Miranda not to provoke Terry. The last thing you need is infighting.", parse);
			Text.NL();
			parse["mastermistress"] = dom > 50 ? player.mfTrue(" master", " mistress") : "";
			Text.Add("<i>“Whatever you say…[mastermistress],”</i> Miranda replies. Terry just glares at her, keeping his distance.", parse);
			Text.NL();
			Text.Add("You’re just about to get going when Miranda stops you. <i>“You know, [playername], I think there’s a perfect way for us to settle our differences. How about you let me finish what we started back then? In the warehouse?”</i> she asks with an insidious smile.", parse);
			Text.NL();
			Text.Add("<i>“Oh, no! No way! You gotta be kidding me! Listen here, if you-”</i> You swiftly shush him by telling him to be silent. You need to consider this. On one hand… maybe doing this will put an end to their animosity, though you admit that seems unlikely. On the other… you’re pretty sure your relationship with the fox thief is going to take a hit if you let Miranda have her way.", parse);
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
						Text.Add("<i>“As you wish, [mastermistress],”</i> she says, rolling her eyes.", parse);
					}
					else
						Text.Add("<i>“After all the hell this little bastard’s put me through, you’re not even going to let me have a shot at him? Bah! Do whatever you want!”</i> Miranda exclaims dismissively.", parse);
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
		tooltip : terry.PronounGender() == Gender.male ? "Terry looks too much like a girl, you should address 'her' as such from now on." : "In the end, Terry is a guy, no matter how girly she looks. You should address 'him' as such."
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
		breasts : function() { return terry.FirstBreastRow().Short(); },
		breastsDesc : function() { return player.FirstBreastRow().Short(); }
	};
	parse = terry.ParserPronouns(parse);

	Text.Clear();
	if(terry.LustLevel() >= 0.5) {
		if(terry.Relation() >= 60) {
			Text.Add("<i>“I’m feeling pretty horny,”</i> [heshe] says, sizing you up. ", parse);
			if(terry.Slut() >= 60) {
				parse["b"] = terry.Cup() >= Terry.Breasts.Bcup ? Text.Parse(" against [hisher] [breasts]", parse) : "";
				Text.Add("<i>“I just can’t get you out of my head, [playername].”</i> [HeShe] walks up to you, gently stroking your arm. <i>“Can we go have sex?”</i> [heshe] asks, ears to the sides and tail wagging slowly as [heshe] sidles up to you, hugging your arm[b]. <i>“I need you...”</i>", parse);
			}
			else if(terry.Slut() >= 30) {
				Text.Add("<i>“How about a quickie? I mean, not that I absolutely <b>need</b> one,”</i> [heshe] immediately adds. <i>“I’d just feel a bit better if we did… just a bit...”</i> [HeShe] looks at you expectantly.", parse);
			}
			else {
				Text.Add("[HeShe] looks a bit nervous. <i>“I was wondering...”</i> [heshe] trails off. You place a hand on [hisher] shoulder and smile, waiting for [himher] to finish. <i>“Maybe we could, if you’re willing, maybe do something about my arousal?”</i>", parse);
				Text.NL();
				Text.Add("Sex, [heshe] means.", parse);
				Text.NL();
				Text.Add("<i>“Er, yes,”</i> the [foxvixen] smiles nervously.", parse);
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
		Text.Add(". From now on, you’re going to start addressing him as such. It’ll be less confusing if you didn’t have to keep calling ‘him’ a guy all the time.", parse);
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
		Text.Add(" She was born a guy, you know she was born a guy, and you can’t lie to yourself anymore. Terry is male, and he has a right to be addressed as such, so that’s what you’ll be doing from now on.", parse);
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
		Text.Add("<i>“Okay… nice try, but you’re going to have to do better than that if you hope to con-”</i> you interrupt [himher] with another kiss, and another. It’s not long before you’re deeply entangled in each other’s arms, passionately making out. By the time you break away, Terry’s panting.", parse);
		Text.NL();
		Text.Add("<i>“I’m convinced,”</i> [heshe] grins, tail wagging as [heshe] licks [hisher] lips.", parse);
		
		terry.AddLustFraction(0.2);
		player.AddLustFraction(0.2);
	}
	else if(terry.Relation() >= 30) {
		Text.Add("<i>“I was kinda getting used to the way you were addressing me, but if you really consider me a [girlguy], go ahead. I spent the longest time trying to assert myself as a guy. Lately, I don’t think it really matters anymore,”</i> [heshe] smiles, tail wagging slowly behind.", parse);
	}
	else {
		Text.Add("<i>“Hearing you say that kinda makes me pissed, but… it’s not like I can stop you, so suit yourself.”</i>", parse);
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
		Text.Add("<i>“...Listen, I don’t really feel comfortable talking about more just yet. I… well, can we do this later?”</i> [heshe] asks.", parse);
		Text.NL();
		Text.Add("You could always order [himher] to tell you anyway, but that would be counterproductive, so you quietly agree.", parse);
	}
	
	// Long
	scenes.push(function() {
		Text.Add("<i>“I was born in the slums of Rigard. My mother was a hooker and my father was a thief. One heavy night of drinking and partying, and I was conceived.”</i>", parse);
		Text.NL();
		Text.Add("<i>“My father told me that when he heard the news, he was surprisingly joyous. He and mom never married, but they started living together all the same. Who said someone needs to be married to have a family together?”</i>", parse);
		Text.NL();
		Text.Add("<i>“To be honest, I don’t remember my mother that well. I was just a baby when she died. Some trouble with morphs here in Rigard... I don’t recall the exact details, but you can see that the bigotry still runs strong.”</i> Terry sighs.", parse);
		Text.NL();
		Text.Add("You nod in silent understanding.", parse);
		Text.NL();
		Text.Add("<i>“Anyway, my parents ran. Mom wasn’t so quick, but luckily daddy was. He took me away and we escaped to the Free Cities, where I spent most of my childhood.”</i>", parse);
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
		
		Text.Add("<i>“My dad was surprisingly caring when it came down to raising me, although he did have some bad habits.”</i>", parse);
		Text.NL();
		Text.Add("Oh? Like what?", parse);
		Text.NL();
		Text.Add("<i>“He was an alcoholic. Can’t say I blame him. War broke out and he lost mom. Sometimes, when he was really drunk, he’d mistake me for her.”</i>", parse);
		Text.NL();
		Text.Add("He mistook Terry for [hisher] mother?", parse);
		Text.NL();
		Text.Add("<i>“Yeah. Well, I look pretty girly to begin with and booze kinda blurs things. He never touched me, just kept saying stuff to me. It was kinda sad. I could tell that he really loved mom... I never bothered correcting him either. Sometimes, I’d just pretend to be a woman and reply in kind.”</i>", parse);
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
		Text.Add("<i>“Whenever he was sober enough, he thought he’d train me. Said it always paid to know a thing or two about the ‘finer arts’, his words. It turns out I was pretty good at it too. Of course, the fact that I looked pretty darn innocent and meek also helped my cause.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Father worked at the docks, loading and unloading ships... and if something went missing? No skin off his back. I mean, things go missing all the time during the busy hours. Pretty sure my dad wasn’t the only one relieving a few of the dirty rich merchants of some of their precious cargo.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Those were the good days, but they only lasted a couple years. Dad… well, he didn’t last long.”</i> Terry’s visage saddens for a moment.", parse);
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
		
		Text.Add("<i>“Last time, I mentioned my father died, right?”</i>", parse);
		Text.NL();
		Text.Add("You nod in confirmation.", parse);
		Text.NL();
		Text.Add("<i>“Turns out he was ill. He didn’t say anything, but eventually it was clear. He wasn’t going to make it. I… cried a lot back then.”</i> Terry’s ears droop.", parse);
		Text.NL();
		Text.Add("You scoop the [foxvixen] up into your arms and embrace [himher]. Eventually, [heshe] breaks the hug, looking at least a bit better.", parse);
		Text.NL();
		Text.Add("<i>“Anyways, I was all alone, and I had to fend for myself. Daddy’s skills came in pretty handy, but I was pretty scrawny by comparison. Working at the docks? No dice.”</i> [HeShe] shakes [hisher] head.", parse);
		Text.NL();
		Text.Add("<i>“Instead, I managed to land a job at the local inn. It wasn’t as safe as the docks, but at least I could pick my marks - also, my fingers were light enough that few even noticed missing goods. I didn’t steal anything major, after all.”</i> A smile breaks on [hisher] muzzle.", parse);
		Text.NL();
		Text.Add("<i>“I was pretty naive back then - and pretty darn careless. That’s how I met my master, actually. But that’s a tale for another time.”</i>", parse);
		
		if(max < 3)
			terry.relation.IncreaseStat(100, 1);
	});
	scenes.push(function() {
		if(terry.Relation() < 40) {
			BlockScene();
			return true;
		}
		
		Text.Add("<i>“I’ve always been pretty good when picking pockets or stealthily nabbing a thing or two from a careless traveler, but nothing could’ve prepared me for my master. Not ‘master’ like you, [playername]. I mean… I guess ‘mentor’ would be a more appropriate term.”</i>", parse);
		Text.NL();
		Text.Add("Well, trying to rob a thief is one way to get them to teach you, you suppose. How did it happen?", parse);
		Text.NL();
		Text.Add("<i>“He looked pretty well off, and he was distracted messing with a strange contraption, so I thought that I should help myself to his rather loaded bag. I pickpocketed the key off him and snuck inside his room while he was out, opened his suitcase and 'BAM!', an alarm rang out,”</i> Terry says, punching [hisher] open palm for effect.", parse);
		Text.NL();
		Text.Add("<i>“He caught me in an instant, I thought I was done for, but to my surprise, he smiled and turned the alarm off. Told me I had talent, he hadn’t even noticed his key was gone. Instead of ratting me out, he offered to train me. Teach me the finer points of being a thief. Not a two-bit one like I was, but a pro thief.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Since I really didn’t want to deal with the authorities, I accepted. Initially, that was my motivation, but as time passed and he trained me, I grew to like him. That, however, is a tale for another time. Maybe later?”</i>", parse);
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
		Text.Add("<i>“Training was tough; he prepared a wide assortment of challenges. I had to pass each of them with minimal instruction and keep practicing. He made me do various things, like picking the locks of several different lockboxes, solving riddles, working puzzles...”</i> Terry smiles softly. <i>“Now that I think back on it, I never did figure out the last one. Got around it by using a micro-explosive to bust the lock,”</i> [heshe] grins at [hisher] own ingenuity.", parse);
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
		Text.Add("<i>“Life was good again, and it was so for a few years. I didn’t go into heists myself, just helped Thorn with info and prepared gadgets. He said I was pretty good as a thief already, and all I needed was to complement my skills, so that’s what I focused on. Can’t say I loved wearing a few of those frilly dresses though...”</i>", parse);
		Text.NL();
		Text.Add("Dresses... Thorn made [himher] dress up as a girl? You consider what you’ve been told for a moment, and then ask if Thorn was just using the old ‘honeypot trick’, or if he had ulterior motives for it.", parse);
		Text.NL();
		Text.Add("<i>“It was easier to collect info, plus people were less likely to suspect a vixen of a crime committed by a fox. You can’t believe the things people will babble about to a pretty face and some giggles. I played the part well - what with me looking all girly and everything...”</i>", parse);
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
		Text.Add("<i>“He… ugh, he wouldn’t let me hear the end of it. My girly physique was always something he’d mock me about. Not that I resent him for that. It was all in good fun, though there was a time when I kicked him in the nuts for a particularly offensive remark.”</i>", parse);
		Text.NL();
		Text.Add("Well... he kind of deserved it, from what Terry just told you.", parse);
		Text.NL();
		Text.Add("<i>“Yeah, he kinda did. We had a good run... but eventually, I guess he got too cocky and things didn’t end up well for him. But let’s visit that some other time, alright?”</i>", parse);
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
		
		Text.Add("<i>“We kept avoiding capture by traveling a lot under the pretense of being merchants. Thorn was very pleased with our successful heists. We had a system that worked really well,”</i> Terry smiles softly, but the smile quickly fades.", parse);
		Text.NL();
		Text.Add("<i>“About then, we caught wind of a VIP that was visiting the town we were in. Thorn’s eyes were aglow. That was a great mark if there ever was one... and best of all? He had little security with him. It was an opportunity, and if there’s a thing you learn in thievery, it’s that you never miss an opportunity.”</i>", parse);
		Text.NL();
		Text.Add("You nod your head in understanding, and ask who this VIP was.", parse);
		Text.NL();
		Text.Add("<i>“Our mark was Duke Kane. He was responsible for the neighboring town and had a vast amount of land under his name. Naturally, despite the opportunity, we couldn’t just take risks blindly, so I set out to gather info my usual way. Thorn was stalking the Duke, gathering info on his own.”</i>", parse);
		Text.NL();
		Text.Add("You nod your head in understanding, then inquisitively ask just how close Terry was able to get to Kane; did [heshe] have to settle for just chasing rumors? Or did the Duke welcome the chance to spend a little time with a sexy vixen who was just so interested in him?", parse);
		Text.NL();
		Text.Add("<i>“No, he didn’t stay anywhere near me. I was simply a maid at the local inn, but I did get the chance to speak with a few guards. Naturally, I also had to deflect more flirts than I’d like,”</i> Terry adds, cringing at the memory.", parse);
		Text.NL();
		Text.Add("<i>“So, as you can guess, gathering info on this mark was slow. We were approaching our deadline, and we didn’t have near enough info on the Duke and his guards to make a proper heist. My dad always preached that I should be patient. Same goes for thievery. You rush into the danger and you’ll wind up caught or worse.”</i>", parse);
		Text.NL();
		Text.Add("Sage advice, you say in agreement.", parse);
		Text.NL();
		Text.Add("<i>“Well, Thorn was impatient. I was just getting started on my shift when I heard one of the guards remark that a masked thief had tried to steal from Duke Kane. When I heard that, I rushed back to our room, and sure enough… Thorn was there, hurt.”</i>", parse);
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
		
		Text.Add("<i>“Last time we spoke, I told about how my mentor Thorn died, right?”</i>", parse);
		Text.NL();
		Text.Add("You nod in confirmation.", parse);
		Text.NL();
		Text.Add("<i>“Well after that, I performed the last rites, quit my job at the inn and got in the first caravan headed out of the city. I wanted to get away from it all, plus there was always the chance people would find out I was with Thorn and then I’d be in trouble too.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I had nowhere to go, and I was feeling too depressed to think about anything. So I just idled, waiting for the caravan to reach its destination. It was a long trip, but eventually we made our way to Rigard.”</i>", parse);
		Text.NL();
		Text.Add("So [heshe] wound up in [hisher] hometown. Did [heshe] recall it at all from [hisher] childhood?", parse);
		Text.NL();
		Text.Add("<i>“I didn’t recall too much about it, no. But from what dad told me, the city was shit back then as well,”</i> Terry sighs, frowning in disapproval.", parse);
		Text.NL();
		Text.Add("<i>“I was getting short on money, and I was already dressed for the job. So I thought… why not get back into the game? Rob some fool and hop on the nearest caravan. Problem is… that damn blockade on the city gates.”</i>", parse);
		Text.NL();
		Text.Add("Ah yes, you had a hard time getting past the gates yourself...", parse);
		Text.NL();
		Text.Add("<i>“I was lucky enough to make it inside the city, but I couldn’t just rob anyone. Even long after the conflict that took my mother from me, people were still on edge. Finding a mark was tough. In the end, I decided if I wanted to score some decent loot, I’d have to rob one of the local nobles.”</i>", parse);
		Text.NL();
		Text.Add("Oh? And who was the lucky one?", parse);
		Text.NL();
		Text.Add("<i>“Krawitz seemed like a good mark. He was a bigot to morphs and an asshole to most people. I figured no one would mind if the old fool got robbed blind. So I did what I always did. Prepared, gathered intel, and in honor of my late mentor? I decided to don his costume and replicate his signature style. Thought I should let the good lord know that a morph outwitted him and robbed him.”</i>", parse);
		Text.NL();
		Text.Add("You decide not to say anything. Your own crimes got pinned on Terry, after all. It wouldn’t do you both any good if [heshe] found out you were there with [himher] that day...", parse);
		Text.NL();
		Text.Add("<i>“After that, you know the story. Fin.”</i>", parse);
		Text.NL();
		Text.Add("Well, that was quite the story, but in the end [heshe] wound up with you, and you’re glad you met [himher].", parse);
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
			Text.Add("<i>“My past? My past is nothing special. It’s quite cliché I’d say. And honestly, it’s best forgotten...”</i> the [foxvixen] says, ears flattening on [hisher] skull. It’s obvious this isn’t [hisher] favorite topic.", parse);
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
			Text.Add("<i>“I already told you everything I could about my past, [playername]. So, unless you want me to start over, there’s not much else to tell.”</i>", parse);
			Text.Flush();
			
			//[HearAgain][Nevermind]
			var options = new Array();
			options.push({ nameStr : "Hear again",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Okay then. Back to the beginning, I suppose...”</i>", parse);
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
			Text.Add("<i>“Alright then. Now, where was I...”</i>", parse);
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
	Text.Add("With a studious look on your face, you start to circle Terry, intensely observing [himher] from all angles. Moving your gaze up and down, back and forth, you continue to trail around the puzzled vulpine.", parse);
	Text.NL();
	if(terry.Relation() >= 60) {
		Text.Add("Terry looks a bit nervous. <i>“Um, everything is alright, right? I didn’t miss any spots combing my fur… maybe my hair is not good?”</i>", parse);
		Text.NL();
		Text.Add("You hasten to assure [himher] that [hisher] hair looks lovely, as always. Just like the rest of [himher], it’s beautiful.", parse);
		Text.NL();
		Text.Add("This gets you a smile as [hisher] tail begins wagging. <i>“If you want, we can go more private spot and I can show you all of me. But if we do, I can’t promise we won’t take this beyond a show and tell.”</i>", parse);
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
				Text.Add("No sooner are you out of sight, the petite [foxvixen] spins you, nearly pouncing [hisher] way into your arms as [heshe] wraps [hisher] lips around yours in a passionate kiss. [HisHer] hair and fur become a disheveled mess the first few seconds, not that either of you mind it. When you finally break away, the smiling [foxvixen] takes a step back to look you over. <i>“I figured just looking can be a bit boring. I think we’d both prefer a more hands-on approach, don’t you think?”</i>", parse);
				Text.NL();
				if(terry.Slut() >= 60)
					Text.Add("<i>“I know what parts <b>I</b> want, but what parts do <b>you</b> want, my lovely [mastermistress]?”</i> Terry asks, giving you a smoldering look.", parse);
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
		Text.Add("Terry looks a bit flustered at your compliment, and you note that [heshe] seems to adjust [hisher] clothing to enhance [hisher] more feminine curves. <i>“Well, go ahead and look then,”</i> [heshe] says nonchalantly, even as [hisher] tail starts wagging. It’s quite obvious that despite [hisher] demeanor, [heshe] enjoys the attention…", parse);
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
		Text.Add("At first, you just find a few spare clothes, panties, few tools of the trade, and a couple dry snacks. Once you get to the bottom though, you raise a brow at what you see: a dildo, lube, a cockring, another dildo, an inflatable buttplug, more lube, and some honey. Chuckling to yourself, you ask whyever [heshe] would need all of that? Doesn’t it get heavy having to lug around all these toys?", parse);
		Text.NL();
		Text.Add("<i>“Gotta be prepared for when you’re not around, my dear [master]. Plus, in case you’re feeling kinky in the middle of the forest, I’d rather not have to wait until we find a city to go after the big [boygirl] toys,”</i> [heshe] grins innocently.", parse);
		Text.NL();
		Text.Add("...You think you created a monster…", parse);
		Text.NL();
		if(terry.Relation() < 60)
			Text.Add("<i>“Damn right you did, and now you gotta take care of me,”</i> [heshe] states.", parse);
		else {
			Text.Add("<i>“Maybe you did, but I loved every second of it, and so did you.”</i>", parse);
			Text.NL();
			Text.Add("True. In that case, you’ll just have to enjoy the spoils of your hard labor.", parse);
		}
		Text.NL();
		Text.Add("After digging through quite a few toys, you finally manage to secure Terry’s comb and brush. Carefully, you return everything to [hisher] pack and move to the grinning [foxvixen].", parse);
	}
	else if(terry.Slut() >= 30) {
		Text.Add("Terry keeps [hisher] pack fairly organized. A few spare clothes, some lockpicks, assorted tools for crafting [hisher] gadgets… a bottle of lube? You set that aside and rummage a bit deeper, grinning to yourself once you find what looks like a fairly small buttplug. Has Terry being having fun behind your back?", parse);
		Text.NL();
		Text.Add("<i>“Umm... ah...”</i> [heshe] trails off. <i>“Well, I figured since we’ve been doing the dirty deed a lot, I should start getting used to it. And it does, kinda, feel good… sometimes… when I’m in the mood.”</i>", parse);
		Text.NL();
		Text.Add("Right… you consider the teasing the [foxvixen] a bit more, but there’ll be plenty of opportunities to do that later. For now, you concentrate on finding [hisher] comb and brush. Locating it at the bottom of [hisher] pack is simple enough, and once you pick them up, you put [hisher] things back in [hisher] pack.", parse);
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
		breastsDesc : function() { return player.FirstBreastRow().Short(); },
		tongueDesc : function() { return player.TongueDesc(); }
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
		Text.Add("<i>“You got it! Now, what did you have in store for little old me?”</i>", parse);
	}
	Text.Flush();
	
	Scenes.Terry.SkinshipPromptChoices();
}


Scenes.Terry.SkinshipPromptChoices = function() {
	var parse = {
		foxvixen : terry.mfPronoun("fox", "vixen"),
		breasts : function() { return terry.FirstBreastRow().Short(); },
		boygirl : terry.mfTrue("boy", "girl"),
		playername : player.name,
		hand    : function() { return player.HandDesc(); },
		breastsDesc : function() { return player.FirstBreastRow().Short(); },
		tongueDesc : function() { return player.TongueDesc(); }
	};
	parse = terry.ParserPronouns(parse);
	
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
				Text.Add("<i>“Well, if you don’t mind, I guess it’s alright. I have a comb and a brush in my pack.”</i>", parse);
			}
			else {
				Text.Add("<i>“Something wrong with my hair?”</i> Terry asks, a hint of mischief in [hisher] voice.", parse);
				Text.NL();
				Text.Add("You pretend to examine it with great scrutiny before admitting you just want some quality time together. Plus, you gotta help your [foxvixen] maintain [himher]self.", parse);
				Text.NL();
				Text.Add("<i>“Well, as good an excuse as any I suppose. You know where I keep my comb and my brush, right?”</i>", parse);
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
			Text.Add("You circle [himher] until you’re behind [himher], then remove the small strap holding [hisher] ponytail. Terry doesn’t look half-bad with [hisher] bangs loose… well, plenty of time to admire later. First of all, you decide to begin with the comb. As neat as the [foxvixen] is, [hisher] hair is perfectly cared for and provides minimal resistance as you rake the comb through [hisher] locks. Then, you set down the comb and grab the brush.", parse);
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
	
	options.push({ nameStr : "Kiss",
		func : function() {
			Text.Clear();
			Text.Add("Bridging the distance between you, your hands reach out toward Terry’s face. One tenderly caresses [hisher] cheek, whilst the other tucks itself under the [foxvixen]’s chin, tilting [hisher] head for a better angle.", parse);
			Text.NL();
			if(terry.Relation() < 60) {
				Text.Add("Terry looks a bit unsure of [himher]self, but [heshe] makes no move to push you away either.", parse);
				Text.NL();
				Text.Add("You give [himher] a reassuring smile, trying to calm [hisher] nerves. When it’s clear [heshe]’s not going to stop you, you allow your lips to close the gap and press against [hisher] own.", parse);
			}
			else {
				Text.Add("The [foxvixen] closes [hisher] eyes, moving to meet your intended kiss.", parse);
				Text.NL();
				Text.Add("Eager little thing, isn’t [heshe]? You intercept [himher] halfway, not willing to entirely give up the initiative in this.", parse);
			}
			Text.NL();
			if(player.sexlevel < 3) {
				Text.Add("The warmth of the [foxvixen]’s lips on your own is an intriguing sensation, one you could happily lose yourself in. Your eyes flutter closed, allowing you to bask in the feeling as you kiss [himher], instinctively pushing your tongue into [hisher] mouth. The taste of Terry floods your senses, and you try to concentrate as it assaults your taste buds, softly and amateurishly stroking Terry’s tongue with sporadic twitches and tugs.", parse);
				
				terry.AddLustFraction(0.2);
			}
			else if(player.sexlevel < 5) {
				Text.Add("Your eyes sink closed, allowing you to fully concentrate on what you’re doing, and you embrace Terry’s lips with your own. With practiced skill, you insinuate your tongue into the [foxvixen]’s mouth, savoring [hisher] flavor as it washes over you. Your [tongueDesc] curls itself around Terry’s own flat muscle, squeezing gently as you make an effort to explore the depths of [hisher] mouth.", parse);
				
				terry.AddLustFraction(0.4);
			}
			else {
				Text.Add("Your teeth close purposefully upon Terry’s lower lip; not hard enough to pierce the skin, but not so soft that [heshe] can’t feel them as you nibble teasingly. You suck the soft skin into your mouth, working it with your own lips, releasing only to then conquer [himher] in a single fell swoop.", parse);
				Text.NL();
				Text.Add("With serpentine sensuality, your [tongueDesc] invades the [foxvixen]’s mouth, curling around [hisher] tongue and drawing it into your mouth. Greedily, you suckle upon Terry’s tongue, massaging it with your lips and letting [hisher] flavor consume your world, moaning around your fleshy muffler in your pleasure at the feel and the taste.", parse);
				Text.NL();
				Text.Add("Your teeth descend, just hard enough that Terry can feel them raking over [hisher] tongue as you let it slip back into [hisher] mouth so you can breathe. Then you pounce once more, grinding your lips against [hishers] as you feed [himher] your tongue.", parse);
				
				terry.AddLustFraction(0.7);
			}
			Text.NL();
			if(terry.Slut() < 30) {
				Text.Add("Terry kisses you back. [HeShe] might lack technique, but makes up for it with enthusiasm. The [foxvixen] tries to match your movements and massage your tongue as best as [heshe] can.", parse);
				
				player.AddLustFraction(0.2);
			}
			else if(terry.Slut() < 60) {
				Text.Add("Terry kisses back with abandon, clinging to you as [heshe] explores your mouth with [hisher] tongue, licking the roof of your mouth in controlled strokes to further excite you. It’s a strange technique, being licked inside your mouth, but it’s also very effective. You can’t resist the moan that wells up when [hisher] tongue suddenly makes a dive to pull your own [tongueDesc] back into [hisher] mouth.", parse);
				
				player.AddLustFraction(0.4);
			}
			else {
				Text.Add("Terry grinds [himher]self against you, while [heshe] fellates your tongue and explores the inside of your mouth. You can’t even decide what to focus on. It’s as if the [foxvixen] has turned into a blanket and is trying [hisher] best to envelop all of you.", parse);
				Text.NL();
				Text.Add("Slurping sounds emanate from your joined lips as Terry drinks your saliva in measured suckles, exchanging it with [hisher] own moments later. You can see [himher] gulping it down as if it were the sweetest nectar [heshe]’d ever tasted.", parse);
				Text.NL();
				Text.Add("[HeShe] can’t help but moan against you, a deep sound that passes a very clear message - Terry wants you.", parse);
				
				player.AddLustFraction(0.7);
			}
			Text.NL();
			parse["metaphorical"] = player.HasLegs() ? "" : " metaphorical";
			Text.Add("Eventually, the need for oxygen forces you to break the kiss. You take a[metaphorical] step back as you inhale and exhale, allowing your heart to slow down.", parse);
			Text.NL();
			if(terry.LustLevel() < 0.3) {
				Text.Add("<i>“Not bad, [playername]. That was pretty nice.”</i> [HeShe] smiles, tail wagging in obvious enjoyment.", parse);
				Text.NL();
				Text.Add("You’re glad that [heshe] liked it so much. You thought that it would brighten [hisher] day a little.", parse);
				Text.NL();
				Text.Add("<i>“It did.”</i> Terry nods. <i>“So, now that my day is a bit brighter… is there anything else you’d like to do?”</i>", parse);
				
				Scenes.Terry.Prompt();
			}
			else if(terry.LustLevel() < 0.6) {
				Text.Add("<i>“Wow… I didn’t think a kiss could feel this intense...”</i> [heshe] breathes, panting heavily. <i>“Almost makes me sad it had to end...”</i>", parse);
				Text.NL();
				Text.Add("Well, there's plenty of other things that the two of you can do, if [heshe] liked that so much...", parse);
				Text.NL();
				Text.Add("<i>“Really? And what exactly do you have in mind?”</i> The [foxvixen] cocks [hisher] head quizzically.", parse);
				Text.NL();
				if(player.LustLevel() >= 30)
					Text.Add("Oh, you have some rather naughty ideas in store… ", parse);
				Text.Add("You mentally pause for a second to consider your answers. It looks like Terry wouldn’t be averse to a nice little bedroom romp, in the mood [heshe]’s in. On the other hand, a bit more friendly intimacy certainly wouldn’t be turned down, either.", parse);
				Text.NL();
				Text.Add("You’re also aware of a little voice in the back of your mind, whispering about the enticing nature of the first option.", parse);
				Text.NL();
				Text.Add("Terry is looking at you expectantly; what are you going to suggest?", parse);
				
				//[Intimacy] [Sex]
				var options = new Array();
				options.push({ nameStr : "Intimacy",
					func : function() {
						Text.Clear();
						Text.Add("[HeShe] smiles softly. <i>“Sure, I wouldn’t be against that at all.”</i>", parse);
						Text.Flush();
						
						Scenes.Terry.SkinshipPromptChoices();
					}, enabled : true,
					tooltip : Text.Parse("Since [heshe] loved kissing so much, how about the two of you play around a little more?", parse)
				});
				options.push({ nameStr : "Sex",
					func : function() {
						Text.Clear();
						Text.Add("<i>“Hotter than kissing, huh?”</i> the [foxvixen] muses, shooting you a knowing grin. <i>“I can only imagine what you really mean by that. Not that it’s any surprise,”</i> [heshe] says, leaning closer. <i>“Ya big perv.”</i>", parse);
						Text.NL();
						Text.Add("You simply grin at that. It takes one to know one.", parse);
						Text.NL();
						Scenes.Terry.SexPrompt();
					}, enabled : true,
					tooltip : "Why don’t the two of you enjoy something a little hotter than kissing? [HeShe] certainly looks in the mood for it..."
				});
				Gui.SetButtonsFromList(options, false, null);
			}
			else {
				Text.Add("<i>“[playername], you big tease. Surely, you don’t expect to end this with just a kiss,”</i> [heshe] says, smiling seductively. <i>“That was pretty good. So good, in fact, that now I’m craving something more.”</i>", parse);
				Text.NL();
				Text.Add("Trying to hold back a smile, you carefully raise a quizzical eyebrow and ask what [heshe] wants.", parse);
				Text.NL();
				Text.Add("<i>“Oh, I don’t know...”</i> [heshe] says, looking you over. ", parse);
				parse["raceDesc"] = player.body.RaceStr();
				if(player.MuscleTone() > 0.5)
					Text.Add("<i>“I have a craving for a hunky [raceDesc]. You don’t know where I could find one of those, do you?”</i> [HeShe] smiles mischievously.", parse);
				else
					Text.Add("<i>“I could go for a sexy [raceDesc]. Yes, that would hit the spot,”</i> [heshe] teases, licking [hisher] lips in a clearly predatory gesture.", parse);
				Text.NL();
				Text.Add("Looks like <i>somebody</i> really got excited with your little kiss. Perhaps you should offer to ‘help out’, as it were?", parse);
				
				//[Yes] [No]
				var options = new Array();
				options.push({ nameStr : "Yes",
					func : function() {
						Text.Clear();
						Text.Add("With a mischievous grin, you saunter closer, reaching out to tickle the [foxvixen]’s chin. Well, you might not know exactly where [heshe] could find what [heshe]’s looking for, but you’d be happy to help [himher] with [hisher] cravings...", parse);
						Text.NL();
						Text.Add("<i>“I’m sure you would,”</i> [heshe] replies with a knowing grin.", parse);
						Text.NL();
						Scenes.Terry.SexPrompt();
					}, enabled : true,
					tooltip : Text.Parse("Oh, come on, [heshe]’s practically <i>begging</i> for it! How could you possibly turn [himher] down now, of all times?", parse)
				});
				options.push({ nameStr : "No",
					func : function() {
						Text.Clear();
						Text.Add("You tell Terry that you’re not in the mood for sex right now.", parse);
						Text.NL();
						Text.Add("<i>“Pity. I guess we can do this some other time then.”</i>", parse);
						Text.NL();
						Text.Add("Absently nodding your agreement, you tell [himher] that there was something else that you wanted.", parse);
						Text.Flush();
						
						Scenes.Terry.Prompt();
					}, enabled : true,
					tooltip : Text.Parse("As much as you sympathize, you’re really not in the mood. You’ll just have to turn [himher] down.", parse)
				});
				Gui.SetButtonsFromList(options, false, null);
			}
			Text.Flush();
			
			terry.relation.IncreaseStat(70, 1);
		}, enabled : terry.Relation() >= 40,
		tooltip : Text.Parse("What better way to show your feelings for [himher] than a nice, warm kiss? Your [foxvixen] deserves to know that you care for [himher].", parse)
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
	/*
	//[name]
	options.push({ nameStr : "name",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
		}, enabled : true,
		tooltip : ""
	});
	 */
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“Oh, okay. Is there anything else you want to do?”</i>", parse);
		Text.Flush();
		
		Scenes.Terry.Prompt();
	});
}

Scenes.Terry.BrushTail = function() {
	var parse = {
		foxvixen       : terry.mfPronoun("fox", "vixen"),
		boygirl        : terry.mfPronoun("boy", "girl"),
		tarmorDesc     : function() { return terry.ArmorDesc(); },
		tlowerArmor    : function() { return terry.LowerArmorDesc(); },
		tbreastDesc    : function() { return terry.FirstBreastRow().Short(); },
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
		Text.Add("<i>“My tail, huh? Pretty sure you have other intentions... and if you don’t, then I’m pretty sure you’ll have them by the time you’re done. Okay, I’ll play along then - just try not to be too obvious about it,”</i> the [foxvixen] says, grinning mischievously.", parse);
		Text.NL();
		Text.Add("Same goes for [himher]. [HeShe] should at least pretend [heshe]’s not enjoying it too much, and try to keep [hisher] tail under control. It’s tough to brush with all the wagging. ", parse);
		Text.NL();
		Text.Add("As if proving your point, Terry’s tail begins wagging even more enthusiastically. <i>“Okay, I’ll try, but I can’t promise anything,”</i> [heshe] chuckles. <i>“Brush is in my pack.”</i>", parse);
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
		Text.Add("<i>“Hey, those clothes would only get in the way. Plus, I was hoping to convince you to brush the rest of my fur too - especially since you seem so fond of making it messy,”</i> [heshe] chuckles.", parse);
		Text.NL();
		Text.Add("True, true... well, you’ll both have to see if there’s anything you can do with the rest of [hisher] fur afterward.", parse);
		Text.NL();
		Text.Add("The, now naked, [foxvixen] sashays your way, lying down atop your lap, tush high for easy access.", parse);
		naked = true;
		player.AddLustFraction(0.3);
	}
	else {
		Text.Add("Terry approaches, lying down on top of your lap, tush up in the air.", parse);
		Text.NL();
		Text.Add("You detect a hint of embarrassment from the [foxvixen], but when you glance [hisher] way, [heshe] smiles back. Cute.", parse);
	}
	Text.NL();
	Text.Add("With your free hand, you carefully take hold of Terry’s tail and maneuver it to be more accessible. Holding it still, your other hand starts at the base of [hisher] fluffy appendage and starts to smoothly and levelly glide down its length, toward the tip of [hisher] brush.", parse);
	Text.NL();
	Text.Add("You’re rather impressed; despite [hisher] rough lifestyle, Terry’s tail is quite luxuriously cared for, with no major snarls or tangles for you to comb out. At least, you haven’t found any yet. As you continue stroking Terry, you compliment [himher] on how much care [heshe] obviously takes in looking after [himher]self.", parse);
	Text.NL();
	Text.Add("<i>“Yeah, if I let it get too messy, then it becomes pretty hard to move it around... also, it hurts.", parse);
	if(terry.Relation() >= 60) {
		Text.Add(" Plus, keeping it neat makes it better for drawing the eyes of a certain someone,”</i> [heshe] adds, with a smile, wagging [hisher] tail a bit.", parse);
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
	Text.Add("Your gaze flicks to Terry’s head and you can’t help but put on a smile of amusement at the way [hisher] ears are daintily flicking in [hisher] half sleeping state. They’re just too cute; you really want to pet them...", parse);
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
				Text.Add("<i>“[playername]? What are you doing?”</i> Terry asks, turning [hisher] head slightly to look up at you.", parse);
				Text.NL();
				Text.Add("With a smile, you assure [himher] that you’re simply admiring Terry’s tail... and, perhaps, the butt it’s attached to.", parse);
				Text.NL();
				Text.Add("<i>“Oh… alright then, I guess,”</i> [heshe] says, a bit embarrassed by your actions. However, you also detect a hint of excitement in the [foxvixen].", parse);
			}
			else {
				Text.Add("<i>“Hmm, I knew it. It was just a matter of time,”</i> Terry says knowingly, even as [hisher] tail moves to curl against your cheek.", parse);
				Text.NL();
				parse["nude"] = naked ? " stripped down and" : "";
				Text.Add("Well, [heshe] can’t really blame you; what did [heshe] expect when [heshe][nude] started flaunting this glorious ass right in your face? Grinning, you emphasize your point by giving your slutty [foxvixen]’s butt a nice squeeze with your free hand.", parse);
				Text.NL();
				Text.Add("<i>“Oh!”</i> [heshe] yelps at your sudden intimacy. <i>“You never fail to disappoint, do you? Ya big perv.”</i>", parse);
				Text.NL();
				Text.Add("Your only answer is a triumphant smirk, possessively caressing the fine vulpine butt again.", parse);
				Text.NL();
				Text.Add("<i>“Alright then, you got me. I’m in no position to fight back, so I guess I’m at your mercy,”</i> [heshe] says with a grin.", parse);
				Text.NL();
				Text.Add("That’s true enough... but don’t worry; you know [heshe]’ll enjoy it...", parse);
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
				Text.Add("<i>“Wha? Hey, cut it out!”</i> Terry exclaims, batting your hand with [hisher] tail. <i>“Don’t tease my birthmark, you perv!”</i>", parse);
				Text.NL();
				Text.Add("Like [heshe]’s one to talk, you quip back, waving aside the wagging tail to purposefully stroke the [foxvixen]’s tail again. After all, here [heshe] is with your hand on [hisher] ass and wagging [hisher] tail at it.", parse);
				Text.NL();
				Text.Add("<i>“W-well… just don’t tease my birthmark. You know how embarrassed that makes me...”</i>", parse);
				Text.NL();
				Text.Add("You shake your head, assuring [himher] that [heshe] really doesn’t have anything to be embarrassed about - it’s such a cute mark, and [heshe]’s got such a sexy ass to wear it on. [HeShe] should be proud of being able to show off something like that!", parse);
				Text.NL();
				Text.Add("But, if that’s the way [heshe] wants it, you’ll leave it alone - for now. [HeShe]’s kind of cute when [heshe] gets all upset like this...", parse);
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
				Text.Add("A scent tickles at your nostrils and you sniff, trying to figure out what it is. After a few moments, you recognize it as the distinctive scent of female arousal - and it’s coming from between Terry’s legs, no matter how [heshe] squeezes [hisher] thighs together to try and hide it. With a grin, your hand snakes down, worming its way between the [foxvixen]’s clenched thighs to try and touch the dampness of [hisher] cunt.", parse);
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
					}, true);
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
					Text.Add("Some other time, you might be interested in seeing, but right now, you don’t feel that way. Instead, you carefully pop your finger free from the sucking embrace of Terry’s tailhole, giving [himher] a conciliatory pat on the butt with that hand. You continue stroking for a few moments, before you slowly put the brush away and cheerfully announce Terry’s good to go.", parse);
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
						Text.Add("Smiling, you reach out and playfully tussle the [foxvixen]’s ears with your fingertips. After all, what’s wrong with [himher] being a little excited? You quite like how [heshe] looks like that.", parse);
						Text.NL();
						Text.Add("<i>“Aww, come on! You’re not going to leave me hanging like this, are you?”</i> Terry asks, pouting pleadingly at you.", parse);
						Text.NL();
						Text.Add("Ha! And [heshe] calls you a perv. Well, you did just want to touch that fluffy tail of [hishers], getting [himher] all worked up was just a bonus. Considering how cute [heshe] looks when [heshe] pleads like that, you think you’re going to make [himher] wait for it - at least for a little while.", parse);
						Text.NL();
						Text.Add("<i>“You big meanie...”</i> [heshe] huffs.", parse);
						Text.NL();
						Text.Add("If [heshe]’s a good [boygirl], you promise to help [himher] with that. For now though, [heshe] should get dressed.", parse);
						Text.NL();
						Text.Add("Sighing, Terry concedes. <i>“Fiiiine. I guess there’s no arguing with you...”</i>", parse);
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
			Text.Add("For now, you decide to ignore Terry’s lame excuse and focus on your ministrations. Your whole palm now overlays itself on Terry’s head, stroking back and forth, tussling [hisher] ears from side to side. Your hand goes gliding down through the flowing red locks, held together in the crude tail that the [foxvixen] sports, and you can’t resist tickling at the back of [hisher] neck.", parse);
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
			Text.Add("You smile back, assuring [himher] that you’d be happy to give [himher] a hand whenever [heshe] feels like it, but for now, you both have other things to do. Terry sighs and vacates your lap, whilst you get back to your feet[l] and head off again.", parse);
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
			Text.Add("Quietly, you continue to brush the [foxvixen]’s sleek, clean tail-fur, running the prongs of the brush through [hisher] tail in companionable silence. The two of you remain there for several pleasant moments, just feeling each other’s bodies, before you put the brush aside and announce that you’re finished.", parse);
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
				
				Scenes.Terry.SexPromptChoice(backFunc, true);
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

export { Terry };
