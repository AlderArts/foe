/*
 * 
 * Lust attacks
 * 
 */
import { AbilityNode } from './node';
import { Ability, Abilities, TargetMode } from '../ability';

Abilities.Seduction = {};

// Default messages
Abilities.Seduction._onDamage = function(ability, encounter, caster, target, dmg) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[tName] become[tnotS] aroused, gaining " + Text.Lust(-dmg) + " lust!", parse);
	Text.NL();
}
Abilities.Seduction._onAbsorb = function(ability, encounter, caster, target, dmg) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[tName] [tis] turned off, losing " + Text.Soothe(dmg) + " lust!", parse);
	Text.NL();
}
Abilities.Seduction._onMiss = function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[tName] manage[tnotS] to resist the temptation!", parse);
	Text.NL();
}


Abilities.Seduction.Sleep = new Ability("Sleep");
Abilities.Seduction.Sleep.Short = function() { return "Put one enemy to sleep for a short while with magical charms."; }
Abilities.Seduction.Sleep.cost = { hp: null, sp: 20, lp: null};
Abilities.Seduction.Sleep.castTree.push(function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster, target);
	
	Text.Add("[Name] weave[notS] [hisher] [hand]s in alluring patterns, winking seductively at [tname]. ", parse);
	if(Status.Sleep(target, { hit : 0.6, turns : 2, turnsR : 2 })) {
		Text.Add("[tName] [tis] unable to resist looking at the hypnotic display, and fall[tnotS] into a slumber. [tName] [thas] been afflicted with sleep!", parse);
	}
	else {
		Text.Add("[tName] manage[notS] to shake off [poss] enchantment, resisting its drowsing effect.", parse);
	}
});


Abilities.Seduction.TIllusion = new Ability("T.Illusion");
Abilities.Seduction.TIllusion.Short = function() { return "Terrifies your foes by creating frightening phantasms that soak up any attacks directed at you."; }
Abilities.Seduction.TIllusion.cost = { hp: null, sp: 25, lp: 10};
Abilities.Seduction.TIllusion.targetMode = TargetMode.Self;
Abilities.Seduction.TIllusion.castTree.push(function(ability, encounter, caster) {
	var parse = AbilityNode.DefaultParser(caster);
	var num = 2;
	num += Math.random() * 3;
	parse["num"] = Text.NumToText(num);
	
	Text.Add("Weaving [hisher] [hand]s in exotic patterns, [name] create[notS] [num] terrifying apparitions, which rise from purple smoke; bellowing in rage while drawing their phantasmal weapons.", parse);
	Status.Decoy(caster, { copies : num, func : function(attacker) {
		var decoy = caster.combatStatus.stats[StatusEffect.Decoy];
		var num = decoy.copies;
		decoy.copies--;
		if(decoy.copies <= 0)
			caster.combatStatus.stats[StatusEffect.Decoy] = null;
		var parse = {
			p : num > 1 ? "One of " + caster.possessive() : caster.Possessive(),
			s : num > 1 ? "s" : "",
			aposs   : attacker.possessive(),
			aName   : attacker.NameDesc(),
			ahisher : attacker.hisher(),
			ahas    : attacker.has(),
			anotS   : attacker.plural() ? "" : "s"
		};
		Text.Add("[p] spectral servant[s] quickly moves in the way of [aposs] attack, flowing into [ahisher] body with a spine-chilling screech, vanishing. ", parse);
		if(Status.Siphon(attacker, {turns: 1, turnsR: 2, hp: 25, sp: 5, caster: caster})) {
			Text.Add("[aName] stagger[anotS], the remnant of the revenant draining the energy from [ahisher] body. [aName] [ahas] been afflicted with siphon!", parse);
		}
		else {
			Text.Add("[aName] shrug[anotS] off the phantom’s chill.", parse);
		}
		Text.Flush();
		return false;
	} });
});


Abilities.Seduction.SIllusion = new Ability("S.Illusion");
Abilities.Seduction.SIllusion.Short = function() { return "Arouses your foes by creating a harem of alluring mirages."; }
Abilities.Seduction.SIllusion.cost = { hp: null, sp: 10, lp: 25};
Abilities.Seduction.SIllusion.targetMode = TargetMode.Self;
Abilities.Seduction.SIllusion.castTree.push(function(ability, encounter, caster) {
	var parse = AbilityNode.DefaultParser(caster);
	var num = 2;
	num += Math.random() * 3;
	parse["num"] = Text.NumToText(num);
	
	Text.Add("Weaving [hisher] [hand]s in exotic patterns, [name] create[notS] [num] mesmerising and utterly lewd images which strut about invitingly; offering comfort and release with throaty groans and soft, alluring gasps.", parse);
	Status.Decoy(caster, { copies : num, func : function(attacker) {
		var decoy = caster.combatStatus.stats[StatusEffect.Decoy];
		var num = decoy.copies;
		decoy.copies--;
		if(decoy.copies <= 0)
			caster.combatStatus.stats[StatusEffect.Decoy] = null;
		var parse = {
			p : num > 1 ? "One of " + caster.possessive() : caster.Possessive(),
			s : num > 1 ? "s" : "",
			aposs   : attacker.possessive(),
			aName   : attacker.NameDesc(),
			ahimher : attacker.himher(),
			ahisher : attacker.hisher(),
			ahas    : attacker.has(),
			anotS   : attacker.plural() ? "" : "s"
		};
		Text.Add("[p] titillating apparition[s] quickly moves in the way of [aposs] attack, flowing into [ahimher] with an orgasmic cry. ", parse);
		if(Status.Horny(attacker, { hit : 0.75, turns : 1, turnsR : 2, str : 1, dmg : 0.2 })) {
			Text.Add("[aName] stagger[anotS], flustered with visions of obscene acts. [aName] [ahas] been afflicted with horny!", parse);
		}
		else {
			Text.Add("[aName] resist[anotS], reigning in [ahisher] urges.", parse);
		}
		Text.Flush();
		return false;
	} });
});


Abilities.Seduction.Confuse = new Ability("Confuse");
Abilities.Seduction.Confuse.Short = function() { return "Fuck a single opponent’s mind, temporarily drawing them to your side."; }
Abilities.Seduction.Confuse.cost = { hp: null, sp: 30, lp: 20};
Abilities.Seduction.Confuse.castTree.push(function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster, target);

	Text.Add("[Name] perform[notS] a hypnotising dance, blending in [hisher] alluring magic and attempting to assume control of [tname]. ", parse);
	
	if(Status.Confuse(target, {hit: 0.75, turns: 3, turnsR: 3})) {
		Text.Add("[tName] [tis] unable to resist [poss] power, and utterly falls under [hisher] control.", parse);
	}
	else {
		Text.Add("[tName] manage[tnotS] to compose [thimher]self, resisting [poss] unnatural influence.", parse);
	}
});


Abilities.Seduction.Rut = new Ability("Rut");
Abilities.Seduction.Rut.Short = function() { return "Hump away at target, dealing damage."; }
Abilities.Seduction.Rut.cost = { hp: null, sp: null, lp: 10};
Abilities.Seduction.Rut.castTree.push(AbilityNode.Template.Lust({
	damageFunc: AbilityNode.DamageFunc.Physical,
	damagePool: [AbilityNode.DamagePool.Physical],
	damageType: {pBlunt: 0.2, lust: 0.8},
	onDamage: [function(ability, encounter, caster, target, dmg) {
		target.AddLustAbs(-dmg*0.25);
	}, function(ability, encounter, caster, target, dmg) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] rut[notS] against [tname] for " + Text.Damage(-dmg) + " damage! Sexy!", parse);
	}]
}));


//TODO Tweak
Abilities.Seduction.Fantasize = new Ability("Fantasize");
Abilities.Seduction.Fantasize.Short = function() { return "Raise own lust."; }
Abilities.Seduction.Fantasize.targetMode = TargetMode.Self;
Abilities.Seduction.Fantasize.castTree.push(function(ability, encounter, caster) {
	var dmg = 1 * caster.LAttack();
	dmg = Math.floor(dmg);
	
	caster.AddLustAbs(dmg);
	
	var parse = {
		name : caster.NameDesc()
	}

	// TODO: Make more flavor text	
	Text.Add("[name] fantasizes, building " + Text.Lust(dmg) + " lust! Sexy!", parse);
});


Abilities.Seduction.Soothe = new Ability("Soothe");
Abilities.Seduction.Soothe.cost = { hp: null, sp: 20, lp: null};
Abilities.Seduction.Soothe.Short = function() { return "Calm the wayward thoughts of your allies with the gentle touch of your voice."; }
Abilities.Seduction.Soothe.targetMode = TargetMode.Party;
Abilities.Seduction.Soothe.castTree.push(function(ability, encounter, caster, target) {
	var targets = target.members;
	
	var group = targets.length > 1;
	var parse = {
		Poss: caster.Possessive(),
		their: group ? "their" : caster.hisher(),
		himher: group ? caster.hisher() + ' party' : caster.himher()
	};
	Text.Add("[Poss] gentle voice washes over [himher], calming [their] desires.", parse);
	
	_.each(targets, function(e) {
		if(e.Incapacitated()) return;
		
		var mult = 1 + (Math.random()-0.5)*0.2;
		var soothe = Math.floor(caster.Spi() * 3 * mult);
		
		e.AddLustAbs(-soothe);
		
		var parse = AbilityNode.DefaultParser(null, e);
		Text.NL();
		Text.Add("The music washes over [tposs] mind, leaving [thimher] feeling clean and pristine. [tName] lose[tnotS] " + Text.Soothe(soothe) + " lust!", parse);
	});
});


Abilities.Seduction.Captivate = new Ability("Captivate");
Abilities.Seduction.Captivate.cost = { hp: null, sp: null, lp: 40};
Abilities.Seduction.Captivate.Short = function() { return "Attempt to immobilize and slow a foe with a captivating song. Success rate dependent on your charisma and the target’s lust. If it fails, the target is nevertheless slowed."; }
Abilities.Seduction.Captivate._onMiss = function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[tName] manage[tnotS] to resist the brunt of the mesmerizing melody, but still finds [thisher] movements slowed.", parse);
}
Abilities.Seduction.Captivate.castTree.push(AbilityNode.Template.Lust({
	toDamage: null,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Fixing [tname] with a piercing gaze, [name] begin[notS] singing, [hisher] song’s captivating undertones ringing through the air. ", parse);
		Status.Slow(target, { hit : 0.6, factor : 2, turns : 3, turnsR : 3 });
	}],
	onHit: [function(ability, encounter, caster, target) {
		if(Status.Numb(target, { hit : 0.8, turns : 2, proc : 1 })) {
			var parse = AbilityNode.DefaultParser(caster, target);
			Text.Add("[tName] is utterly entranced by [poss] song and is slowed to a stop, completely immobilized.", parse);
		}
		else
			Abilities.Seduction.Captivate._onMiss(ability, encounter, caster, target);
	}],
	onMiss: [Abilities.Seduction.Captivate._onMiss]
}));



//TODO Tweak
Abilities.Seduction.Lull = new Ability("Lull");
Abilities.Seduction.Lull.cost = { hp: null, sp: 10, lp: 10};
Abilities.Seduction.Lull.Short = function() { return "Put the foe to sleep with a soothing song."; }
Abilities.Seduction.Lull.castTree.push(function(ability, encounter, caster, target) {
	/*
	var hit    = caster.LHit();
	var evade  = target.LEvade();
	var toHit  = Ability.ToHit(hit, evade);
	*/
	var parse = AbilityNode.DefaultParser(caster, target);
	
	Text.Add("[Name] raise[notS] [hisher] voice in a soothing song, lulling [tname] with the haunting tune. ", parse);
	
	if(Status.Sleep(target, { hit : 0.8, turns : 3, turnsR : 3 })) {
		Text.Add("Overcome by [poss] song, [tname] falls asleep.", parse);
	}
	else
		Text.Add("[tName] shrug[ts] it off, managing to stay awake.", parse);
});


