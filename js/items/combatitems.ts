import { Item } from '../item';
import { Ability, TargetMode } from '../ability';
import { AbilityNode } from '../ability/node';
import { Defaults } from '../ability/default';
import { Text } from '../text';
import { Encounter } from '../combat';
import { Entity } from '../entity';
import { Inventory } from '../inventory';
import { Status } from '../statuseffect';

export class CombatItemAbility extends Ability {
	item : CombatItem;
	constructor(item : CombatItem) {
		super();
		this.targetMode = TargetMode.Ally;
		this.item = item;
	}
	
	Use(encounter : Encounter, caster : Entity, target : Entity, inv : Inventory) {
		if(inv && this.item.consume) {
			inv.RemoveItem(this.item);
		}
		
		Ability.prototype.Use.call(this, encounter, caster, target);
	}
}


export class CombatItem extends Item {
	consume : boolean;
	combat : CombatItemAbility;

	constructor(id : string, name : string, type? : any) {
		super(id, name, type);
		this.consume = true;
		this.combat = new CombatItemAbility(this);
	}
	
	// Default messages
	static _onDamage(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
		var parse = { tName : target.nameDesc() };
		Text.Add("The attack hits [tName] for " + Text.Damage(dmg) + " damage!", parse);
		Text.NL();
	}
	static _onMiss(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = { tName : target.nameDesc() };
		Text.Add("The attack narrowly misses [tName], dealing no damage!", parse);
		Text.NL();
	}
	static _onAbsorb(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
		var parse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
		Text.Add("[tName] absorb[s] the attack, gaining " + Text.Heal(dmg) + " health!", parse);
		Text.NL();
	}
}




let CombatItems : any = {};

CombatItems.HPotion = new CombatItem("pot0", "Health Pot");
CombatItems.HPotion.price = 20;
CombatItems.HPotion.sDesc = function() { return "health potion"; }
CombatItems.HPotion.lDesc = function() { return "a weak health potion"; }
CombatItems.HPotion.Short = function() { return "A health potion."; }
CombatItems.HPotion.Long = function() { return "A weak health potion."; }
CombatItems.HPotion.combat.castTree.push(function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[Name] use[notS] a potion.", parse);
	Text.NL();
	Text.Add("It heals [tname] for " + Text.Heal(100) + "!", parse);
	
	target.AddHPAbs(100);
});


CombatItems.EPotion = new CombatItem("pot1", "Energy Pot");
CombatItems.EPotion.price = 40;
CombatItems.EPotion.sDesc = function() { return "energy potion"; }
CombatItems.EPotion.lDesc = function() { return "a weak energy potion"; }
CombatItems.EPotion.Short = function() { return "An energy potion."; }
CombatItems.EPotion.Long = function() { return "A weak energy potion."; }
CombatItems.EPotion.combat.castTree.push(function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[Name] use[notS] an energy potion.", parse);
	Text.NL();
	Text.Add("A brief surge of energy runs through [tname], restoring " + Text.Mana(100) + " points of energy!", parse);
	
	target.AddSPAbs(100);
});


CombatItems.SpeedPotion = new CombatItem("pot2", "Speed Pot");
CombatItems.SpeedPotion.price = 100;
CombatItems.SpeedPotion.sDesc = function() { return "speed potion"; }
CombatItems.SpeedPotion.lDesc = function() { return "a speed potion"; }
CombatItems.SpeedPotion.Short = function() { return "A speed potion."; }
CombatItems.SpeedPotion.Long = function() { return "A speed potion."; }
CombatItems.SpeedPotion.combat.targetMode = TargetMode.Self;
CombatItems.SpeedPotion.combat.castTree.push(function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
	var parse = AbilityNode.DefaultParser(caster);

	Status.Haste(caster, { turns : 3, turnsR : 3, factor : 2 });

	Text.Add("[Name] uncork[notS] a slender vial and drink[notS] its contents. [HeShe] briefly boost[notS] [hisher] speed!", parse);
});


CombatItems.SmokeBomb = new CombatItem("esc0", "S.Bomb");
CombatItems.SmokeBomb.price = 100;
CombatItems.SmokeBomb.Short = function() { return "A smoke bomb."; }
CombatItems.SmokeBomb.Long = function() { return "A glass sphere containing an alchemical concoction that disperses in thick, oily smoke when mixed with air. Smashing the bomb creates instant cover."; }
CombatItems.SmokeBomb.combat.enabledCondition = function(encounter : Encounter, caster : Entity) {
	return encounter.canRun;
}
CombatItems.SmokeBomb.combat.targetMode = TargetMode.Self;
CombatItems.SmokeBomb.combat.CastInternal = function(encounter : Encounter, caster : Entity) {
	var parse = AbilityNode.DefaultParser(caster);
	Text.Clear();
	Text.Add("[Name] toss[notEs] a smoke bomb at the ground. It explodes in a cloud of smoke, covering for [hisher] escape!", parse);
	Text.NL();
	Text.Flush();
	
	encounter.onRun();
}


CombatItems.DecoyStick = new CombatItem("decoy0", "Decoy");
CombatItems.DecoyStick.price = 250;
CombatItems.DecoyStick.Short = function() { return "A decoy stick."; }
CombatItems.DecoyStick.Long = function() { return "A stick containing the shards of an enchanted mirror, when broken it will generate illusory copies of the user, confusing targets."; }
CombatItems.DecoyStick.combat.targetMode = TargetMode.Self;
CombatItems.DecoyStick.combat.castTree.push(function(ability : Ability, encounter : Encounter, caster : Entity) {
	var parse = AbilityNode.DefaultParser(caster);
	
	Text.Add("[Name] grab[notS] a decoy stick and break[notS] it. A flash of light emanates, and when it subsides, [heshe] [has] split into four copies.", parse);
	
	Status.Decoy(caster, {copies: 3});
});


CombatItems.LustDart = new CombatItem("dart0", "Lust darts");
CombatItems.LustDart.price = 25;
CombatItems.LustDart.Short = function() { return "Aphrodisiac-tipped darts."; }
CombatItems.LustDart.Long = function() { return "Throwing darts smeared in potent aphrodisiacs. On a hit, they will charm an enemy."; }
CombatItems.LustDart.combat.targetMode = TargetMode.Enemy;
CombatItems.LustDart.combat.castTree.push(AbilityNode.Template.Physical({
	toDamage : null,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] throw[notS] a lust dart at [tname].", parse);
		Text.NL();
	}],
	onHit: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
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
	onMiss: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(null, target);
		Text.Add("[tName] manage[tnotS] to deftly sidestep the dart.", parse);
		Text.NL();
	}]
}));


CombatItems.PoisonDart = new CombatItem("dart1", "Poison darts");
CombatItems.PoisonDart.price = 40;
CombatItems.PoisonDart.Short = function() { return "Poison-tipped darts."; }
CombatItems.PoisonDart.Long = function() { return "Throwing darts smeared in a fast-acting venom, making them quite dangerous."; }
CombatItems.PoisonDart.combat.targetMode = TargetMode.Enemy;
CombatItems.PoisonDart.combat.castTree.push(AbilityNode.Template.Physical({
	toDamage : null,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] throw[notS] a poison dart at [tname].", parse);
		Text.NL();
	}],
	onHit: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
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
	onMiss: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(null, target);
		Text.Add("[tName] manage[tnotS] to deftly sidestep the dart.", parse);
		Text.NL();
	}]
}));


CombatItems.GlassSword = new CombatItem("glass0", "Glass sword");
CombatItems.GlassSword.price = 1000;
CombatItems.GlassSword.Short = function() { return "A glass sword, shatters on use."; }
CombatItems.GlassSword.Long = function() { return "A razor-sharp glass sword. A fragile but very powerful blade."; }
CombatItems.GlassSword.combat.targetMode = TargetMode.Enemy;
CombatItems.GlassSword.combat.castTree.push(AbilityNode.Template.Physical({
	atkMod: 7,
	hitMod: 2,
	onCast: [function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] strike[notS] [tname] with a glass sword. The blade shatters!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb]
}));

export { CombatItems };
