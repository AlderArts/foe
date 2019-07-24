/*
 *
 * Define Lei
 *
 */
import { Entity } from '../../entity';
import { GetDEBUG } from '../../../app';
import { Color } from '../../body/color';
import { Images } from '../../assets';
import { HairStyle } from '../../body/hair';
import { Stat } from '../../stat';
import { Time } from '../../time';
import { WorldTime } from '../../worldtime';

// TODO: FIX STATS
function Lei(storage) {
	Entity.call(this);
	this.ID = "lei";
	// Character stats
	this.name = "Lei";

	this.avatar.combat     = Images.lei;

	this.maxHp.base        = 460;
	this.maxSp.base        = 200;
	this.maxLust.base      = 220;
	// Main stats
	this.strength.base     = 35;
	this.stamina.base      = 31;
	this.dexterity.base    = 44;
	this.intelligence.base = 28;
	this.spirit.base       = 30;
	this.libido.base       = 19;
	this.charisma.base     = 35;

	this.level    = 15;
	this.sexlevel = 5;

	this.body.DefMale();
	this.body.height.base      = 181;
	this.body.weigth.base      = 80;
	this.body.head.hair.color  = Color.black;
	this.body.head.hair.length.base = 20;
	this.body.head.hair.style  = HairStyle.ponytail;
	this.body.head.eyes.color  = Color.black;

	this.Butt().virgin = true;

	this.SetLevelBonus();
	this.RestFull();

	this.flags["Met"] = Lei.Met.NotMet;
	this.flags["ToldOrvin"] = 0;
	this.flags["HeardOf"] = 0;
	this.flags["Fought"] = Lei.Fight.No;
	this.flags["Talk"] = 0; //Bitmask
	this.flags["SexOpen"] = 0; //Toggle

	this.flags["T1"] = 0; //Bitmask, job 1

	this.annoyance = new Stat(0);
	this.pastRotation = 0;

	this.timeout = new Time();
	this.taskTimer = new Time();
	this.sparTimer = new Time();

	if(storage) this.FromStorage(storage);
}
Lei.prototype = new Entity();
Lei.prototype.constructor = Lei;

Lei.PartyStrength = {
	LEVEL_WEAK   : 5,
	LEVEL_STRONG : 10
};
Lei.Met = {
	NotMet    : 0,
	SeenInn   : 1,
	SeenGates : 2,
	KnowName  : 3,
	OnTaskEscort : 4,
	EscortFinished : 5,
	CompletedTaskEscort : 6
}
Lei.Fight = {
	No         : 0,
	Submission : 1,
	Loss       : 2,
	Win        : 3
};
Lei.Rel = {
	L1 : 20,
	L2 : 40,
	L3 : 60,
	L4 : 80
};
Lei.Talk = { //Bitmask
	Skills : 1,
	Sex : 2,
	GuardBeating : 4
};

Lei.prototype.Annoyance = function() {
	return this.annoyance.Get();
}

Lei.prototype.Recruited = function() {
	return false; //TODO Lei.Met >= Recruited
}

Lei.prototype.SexOpen = function() {
	return this.flags["SexOpen"] != 0;
}

Lei.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);

	this.timeout.Dec(step);
	this.taskTimer.Dec(step);
	this.sparTimer.Dec(step);
}

Lei.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	this.annoyance.base = parseInt(storage.ann)  || this.annoyance.base;

	this.timeout.FromStorage(storage.timeout);
	this.taskTimer.FromStorage(storage.tt);
	this.sparTimer.FromStorage(storage.st);

	// Load flags
	this.LoadFlags(storage);
}

Lei.prototype.ToStorage = function() {
	var storage = {};

	this.SavePersonalityStats(storage);
	if(this.annoyance.base != 0) storage.ann = this.annoyance.base.toFixed();

	this.SaveFlags(storage);

	storage.timeout = this.timeout.ToStorage();
	storage.tt = this.taskTimer.ToStorage();
	storage.st = this.sparTimer.ToStorage();

	return storage;
}

// COMBAT STATS
// TODO: FIX STATS
Lei.Spar = function(levelbonus) {
	Entity.call(this);
	// Character stats
	this.name = "Lei";

	this.avatar.combat     = Images.lei;

	this.maxHp.base        = 460;
	this.maxSp.base        = 200;
	this.maxLust.base      = 220;
	// Main stats
	this.strength.base     = 35;
	this.stamina.base      = 31;
	this.dexterity.base    = 44;
	this.intelligence.base = 28;
	this.spirit.base       = 30;
	this.libido.base       = 19;
	this.charisma.base     = 35;

	this.level    = 15 + levelbonus;
	this.sexlevel = 5;

	this.combatExp         = this.level + 5;

	this.body.DefMale();
	this.body.height.base      = 181;
	this.body.weigth.base      = 80;
	this.body.head.hair.color  = Color.black;
	this.body.head.hair.length.base = 20;
	this.body.head.hair.style  = HairStyle.ponytail;
	this.body.head.eyes.color  = Color.black;

	this.Butt().virgin = true;

	this.SetLevelBonus();
	this.RestFull();
}
Lei.Spar.prototype = new Entity();
Lei.Spar.prototype.constructor = Lei.Spar;

Lei.Spar.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.Add(this.name + " acts! Chop chop!");
	Text.NL();

	// Pick a random target
	var targets = this.GetPartyTarget(encounter, activeChar);
	var t = this.GetSingleTarget(encounter, activeChar);

	var choice = Math.random();
	if(choice < 0.2)
		Abilities.Attack.CastInternal(encounter, this, t);
	else if(choice < 0.3 && Abilities.Physical.Kicksand.enabledCondition(encounter, this))
		Abilities.Physical.Kicksand.Use(encounter, this, t);
	else if(choice < 0.5 && Abilities.Physical.Bash.enabledCondition(encounter, this))
		Abilities.Physical.Bash.Use(encounter, this, t);
	else if(choice < 0.7 && Abilities.Physical.DirtyBlow.enabledCondition(encounter, this))
		Abilities.Physical.DirtyBlow.Use(encounter, this, t);
	else if(choice < 0.9 && Abilities.Physical.TAttack.enabledCondition(encounter, this))
		Abilities.Physical.TAttack.Use(encounter, this, t);
	else
		Abilities.Attack.Use(encounter, this, t);
}


// Schedule
Lei.prototype.IsAtLocation = function(location) {
	// Numbers/slacking/sleep
	if(location == world.loc.Rigard.Inn.common && lei.timeout.Expired())
		return (WorldTime().hour >= 14 && WorldTime().hour < 23);
	return false;
}

// Party interaction
Lei.prototype.Interact = function() {
	Text.Clear();
	Text.Add("Rawr Imma stabbitystab.");


	if(GetDEBUG()) {
		Text.NL();
		Text.Add("DEBUG: relation: " + lei.relation.Get(), null, 'bold');
		Text.NL();
		Text.Add("DEBUG: subDom: " + lei.subDom.Get(), null, 'bold');
		Text.NL();
		Text.Add("DEBUG: slut: " + lei.slut.Get(), null, 'bold');
		Text.NL();
	}

	Text.Flush();
	Gui.NextPrompt(function() {
		PartyInteraction();
	});
}

export { Lei };
