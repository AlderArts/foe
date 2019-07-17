import { Item, Items } from '../item';
import { Ability, Abilities, TargetMode } from '../ability';
import { AbilityNode } from '../ability/node';

function CombatItemAbility(item) {
	Ability.call(this);
	this.targetMode = TargetMode.Ally;
	this.item = item;
}
CombatItemAbility.prototype = new Ability();
CombatItemAbility.prototype.constructor = CombatItemAbility;

CombatItemAbility.prototype.Use = function(encounter, caster, target, inv) {
	if(inv && this.item.consume) {
		inv.RemoveItem(this.item);
	}
	
	Ability.prototype.Use.call(this, encounter, caster, target);
}

function CombatItem(id, name) {
	Item.call(this, id, name);
	this.consume = true;
	this.combat = new CombatItemAbility(this);
}
CombatItem.prototype = new Item("_combat");
CombatItem.prototype.constructor = CombatItem;


// Default messages
CombatItem._onDamage = function(ability, encounter, caster, target, dmg) {
	var parse = { tName : target.nameDesc() };
	Text.Add("The attack hits [tName] for " + Text.Damage(dmg) + " damage!", parse);
	Text.NL();
}
CombatItem._onMiss = function(ability, encounter, caster, target) {
	var parse = { tName : target.nameDesc() };
	Text.Add("The attack narrowly misses [tName], dealing no damage!", parse);
	Text.NL();
}
CombatItem._onAbsorb = function(ability, encounter, caster, target, dmg) {
	var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
	Text.Add("[tName] absorb[s] the attack, gaining " + Text.Heal(dmg) + " health!", parse);
	Text.NL();
}



Items.Combat = {};

Items.Combat.HPotion = new CombatItem("pot0", "Health Pot");
Items.Combat.HPotion.price = 20;
Items.Combat.HPotion.sDesc = function() { return "health potion"; }
Items.Combat.HPotion.lDesc = function() { return "a weak health potion"; }
Items.Combat.HPotion.Short = function() { return "A health potion."; }
Items.Combat.HPotion.Long = function() { return "A weak health potion."; }
Items.Combat.HPotion.combat.castTree.push(function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[Name] use[notS] a potion.", parse);
	Text.NL();
	Text.Add("It heals [tname] for " + Text.Heal(100) + "!", parse);
	
	target.AddHPAbs(100);
});


Items.Combat.EPotion = new CombatItem("pot1", "Energy Pot");
Items.Combat.EPotion.price = 40;
Items.Combat.EPotion.sDesc = function() { return "energy potion"; }
Items.Combat.EPotion.lDesc = function() { return "a weak energy potion"; }
Items.Combat.EPotion.Short = function() { return "An energy potion."; }
Items.Combat.EPotion.Long = function() { return "A weak energy potion."; }
Items.Combat.EPotion.combat.castTree.push(function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[Name] use[notS] an energy potion.", parse);
	Text.NL();
	Text.Add("A brief surge of energy runs through [tname], restoring " + Text.Mana(100) + " points of energy!", parse);
	
	target.AddSPAbs(100);
});


Items.Combat.SpeedPotion = new CombatItem("pot2", "Speed Pot");
Items.Combat.SpeedPotion.price = 100;
Items.Combat.SpeedPotion.sDesc = function() { return "speed potion"; }
Items.Combat.SpeedPotion.lDesc = function() { return "a speed potion"; }
Items.Combat.SpeedPotion.Short = function() { return "A speed potion."; }
Items.Combat.SpeedPotion.Long = function() { return "A speed potion."; }
Items.Combat.SpeedPotion.combat.targetMode = TargetMode.Self;
Items.Combat.SpeedPotion.combat.castTree.push(function(ability, encounter, caster, target) {
	var parse = AbilityNode.DefaultParser(caster);

	Status.Haste(caster, { turns : 3, turnsR : 3, factor : 2 });

	Text.Add("[Name] uncork[notS] a slender vial and drink[notS] its contents. [HeShe] briefly boost[notS] [hisher] speed!", parse);
});


Items.Combat.SmokeBomb = new CombatItem("esc0", "S.Bomb");
Items.Combat.SmokeBomb.price = 100;
Items.Combat.SmokeBomb.Short = function() { return "A smoke bomb."; }
Items.Combat.SmokeBomb.Long = function() { return "A glass sphere containing an alchemical concoction that disperses in thick, oily smoke when mixed with air. Smashing the bomb creates instant cover."; }
Items.Combat.SmokeBomb.combat.enabledCondition = function(encounter, caster) {
	return encounter.canRun;
}
Items.Combat.SmokeBomb.combat.targetMode = TargetMode.Self;
Items.Combat.SmokeBomb.combat.CastInternal = function(encounter, caster) {
	var parse = AbilityNode.DefaultParser(caster);
	Text.Clear();
	Text.Add("[Name] toss[notEs] a smoke bomb at the ground. It explodes in a cloud of smoke, covering for [hisher] escape!", parse);
	Text.NL();
	Text.Flush();
	
	encounter.onRun();
}


Items.Combat.DecoyStick = new CombatItem("decoy0", "Decoy");
Items.Combat.DecoyStick.price = 250;
Items.Combat.DecoyStick.Short = function() { return "A decoy stick."; }
Items.Combat.DecoyStick.Long = function() { return "A stick containing the shards of an enchanted mirror, when broken it will generate illusory copies of the user, confusing targets."; }
Items.Combat.DecoyStick.combat.targetMode = TargetMode.Self;
Items.Combat.DecoyStick.combat.castTree.push(function(ability, encounter, caster) {
	var parse = AbilityNode.DefaultParser(caster);
	
	Text.Add("[Name] grab[notS] a decoy stick and break[notS] it. A flash of light emanates, and when it subsides, [heshe] [has] split into four copies.", parse);
	
	Status.Decoy(caster, {copies: 3});
});


Items.Combat.LustDart = new CombatItem("dart0", "Lust darts");
Items.Combat.LustDart.price = 25;
Items.Combat.LustDart.Short = function() { return "Aphrodisiac-tipped darts."; }
Items.Combat.LustDart.Long = function() { return "Throwing darts smeared in potent aphrodisiacs. On a hit, they will charm an enemy."; }
Items.Combat.LustDart.combat.targetMode = TargetMode.Enemy;
Items.Combat.LustDart.combat.castTree.push(AbilityNode.Template.Physical({
	toDamage : null,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] throw[notS] a lust dart at [tname].", parse);
		Text.NL();
	}],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(null, target);
		Text.Add("It strikes [tname], inflicting [thimher] with charm!", parse);
		Text.NL();
		if(Status.Horny(target, { hit : 0.75, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
			Text.Add("[tName] [tis] charmed!", parse);
		}
		else {
			Text.Add("[tName] resist[tnotS] the aphrodisiac!", parse);
		}
		Text.NL();
	}],
	onMiss: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(null, target);
		Text.Add("[tName] manage[tnotS] to deftly sidestep the dart.", parse);
		Text.NL();
	}]
}));


Items.Combat.PoisonDart = new CombatItem("dart1", "Poison darts");
Items.Combat.PoisonDart.price = 40;
Items.Combat.PoisonDart.Short = function() { return "Poison-tipped darts."; }
Items.Combat.PoisonDart.Long = function() { return "Throwing darts smeared in a fast-acting venom, making them quite dangerous."; }
Items.Combat.PoisonDart.combat.targetMode = TargetMode.Enemy;
Items.Combat.PoisonDart.combat.castTree.push(AbilityNode.Template.Physical({
	toDamage : null,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] throw[notS] a poison dart at [tname].", parse);
		Text.NL();
	}],
	onHit: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(null, target);
		Text.Add("It strikes [tname], inflicting [thimher] with poison!", parse);
		Text.NL();
		if(Status.Venom(target, { hit : 0.75, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
			Text.Add("[tName] [tis] poisoned!", parse);
		}
		else {
			Text.Add("[tName] resist[tnotS] the poison!", parse);
		}
		Text.NL();
	}],
	onMiss: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(null, target);
		Text.Add("[tName] manage[tnotS] to deftly sidestep the dart.", parse);
		Text.NL();
	}]
}));


Items.Combat.GlassSword = new CombatItem("glass0", "Glass sword");
Items.Combat.GlassSword.price = 1000;
Items.Combat.GlassSword.Short = function() { return "A glass sword, shatters on use."; }
Items.Combat.GlassSword.Long = function() { return "A razor-sharp glass sword. A fragile but very powerful blade."; }
Items.Combat.GlassSword.combat.targetMode = TargetMode.Enemy;
Items.Combat.GlassSword.combat.castTree.push(AbilityNode.Template.Physical({
	atkMod: 7,
	hitMod: 2,
	onCast: [function(ability, encounter, caster, target) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] strike[notS] [tname] with a glass sword. The blade shatters!", parse);
		Text.NL();
	}],
	onMiss: [Abilities.Physical._onMiss],
	onDamage: [Abilities.Physical._onDamage],
	onAbsorb: [Abilities.Physical._onAbsorb]
}));

export { CombatItem, CombatItemAbility };
