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
	
	Use(encounter : Encounter, caster : Entity, target? : Entity, inv? : Inventory) {
		if(inv && this.item.consume) {
			inv.RemoveItem(this.item);
		}
		
		super.Use(encounter, caster, target);
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
		var parse : any = { tName : target.nameDesc() };
		Text.Add("The attack hits [tName] for " + Text.Damage(dmg) + " damage!", parse);
		Text.NL();
	}
	static _onMiss(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
		var parse : any = { tName : target.nameDesc() };
		Text.Add("The attack narrowly misses [tName], dealing no damage!", parse);
		Text.NL();
	}
	static _onAbsorb(ability : Ability, encounter : Encounter, caster : Entity, target : Entity, dmg : number) {
		var parse : any = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
		Text.Add("[tName] absorb[s] the attack, gaining " + Text.Heal(dmg) + " health!", parse);
		Text.NL();
	}
}





let hPotion = new CombatItem("pot0", "Health Pot");
hPotion.price = 20;
hPotion.sDesc = function() { return "health potion"; }
hPotion.lDesc = function() { return "a weak health potion"; }
hPotion.Short = function() { return "A health potion."; }
hPotion.Long = function() { return "A weak health potion."; }
hPotion.combat.castTree.push(function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[Name] use[notS] a potion.", parse);
	Text.NL();
	Text.Add("It heals [tname] for " + Text.Heal(100) + "!", parse);
	
	target.AddHPAbs(100);
});


let ePotion = new CombatItem("pot1", "Energy Pot");
ePotion.price = 40;
ePotion.sDesc = function() { return "energy potion"; }
ePotion.lDesc = function() { return "a weak energy potion"; }
ePotion.Short = function() { return "An energy potion."; }
ePotion.Long = function() { return "A weak energy potion."; }
ePotion.combat.castTree.push(function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
	var parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[Name] use[notS] an energy potion.", parse);
	Text.NL();
	Text.Add("A brief surge of energy runs through [tname], restoring " + Text.Mana(100) + " points of energy!", parse);
	
	target.AddSPAbs(100);
});


let speedPotion = new CombatItem("pot2", "Speed Pot");
speedPotion.price = 100;
speedPotion.sDesc = function() { return "speed potion"; }
speedPotion.lDesc = function() { return "a speed potion"; }
speedPotion.Short = function() { return "A speed potion."; }
speedPotion.Long = function() { return "A speed potion."; }
speedPotion.combat.targetMode = TargetMode.Self;
speedPotion.combat.castTree.push(function(ability : Ability, encounter : Encounter, caster : Entity, target : Entity) {
	var parse = AbilityNode.DefaultParser(caster);

	Status.Haste(caster, { turns : 3, turnsR : 3, factor : 2 });

	Text.Add("[Name] uncork[notS] a slender vial and drink[notS] its contents. [HeShe] briefly boost[notS] [hisher] speed!", parse);
});


let smokeBomb = new CombatItem("esc0", "S.Bomb");
smokeBomb.price = 100;
smokeBomb.Short = function() { return "A smoke bomb."; }
smokeBomb.Long = function() { return "A glass sphere containing an alchemical concoction that disperses in thick, oily smoke when mixed with air. Smashing the bomb creates instant cover."; }
smokeBomb.combat.enabledCondition = function(encounter : Encounter, caster : Entity) {
	return encounter.canRun;
}
smokeBomb.combat.targetMode = TargetMode.Self;
smokeBomb.combat.CastInternal = function(encounter : Encounter, caster : Entity) {
	var parse = AbilityNode.DefaultParser(caster);
	Text.Clear();
	Text.Add("[Name] toss[notEs] a smoke bomb at the ground. It explodes in a cloud of smoke, covering for [hisher] escape!", parse);
	Text.NL();
	Text.Flush();
	
	encounter.onRun();
}


let decoyStick = new CombatItem("decoy0", "Decoy");
decoyStick.price = 250;
decoyStick.Short = function() { return "A decoy stick."; }
decoyStick.Long = function() { return "A stick containing the shards of an enchanted mirror, when broken it will generate illusory copies of the user, confusing targets."; }
decoyStick.combat.targetMode = TargetMode.Self;
decoyStick.combat.castTree.push(function(ability : Ability, encounter : Encounter, caster : Entity) {
	var parse = AbilityNode.DefaultParser(caster);
	
	Text.Add("[Name] grab[notS] a decoy stick and break[notS] it. A flash of light emanates, and when it subsides, [heshe] [has] split into four copies.", parse);
	
	Status.Decoy(caster, {copies: 3});
});


let lustDart = new CombatItem("dart0", "Lust darts");
lustDart.price = 25;
lustDart.Short = function() { return "Aphrodisiac-tipped darts."; }
lustDart.Long = function() { return "Throwing darts smeared in potent aphrodisiacs. On a hit, they will charm an enemy."; }
lustDart.combat.targetMode = TargetMode.Enemy;
lustDart.combat.castTree.push(AbilityNode.Template.Physical({
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


let poisonDart = new CombatItem("dart1", "Poison darts");
poisonDart.price = 40;
poisonDart.Short = function() { return "Poison-tipped darts."; }
poisonDart.Long = function() { return "Throwing darts smeared in a fast-acting venom, making them quite dangerous."; }
poisonDart.combat.targetMode = TargetMode.Enemy;
poisonDart.combat.castTree.push(AbilityNode.Template.Physical({
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


let glassSword = new CombatItem("glass0", "Glass sword");
glassSword.price = 1000;
glassSword.Short = function() { return "A glass sword, shatters on use."; }
glassSword.Long = function() { return "A razor-sharp glass sword. A fragile but very powerful blade."; }
glassSword.combat.targetMode = TargetMode.Enemy;
glassSword.combat.castTree.push(AbilityNode.Template.Physical({
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


export namespace CombatItems {
	export const HPotion = hPotion;
	export const EPotion = ePotion;
	export const SpeedPotion = speedPotion;
	export const SmokeBomb = smokeBomb;
	export const DecoyStick = decoyStick;
	export const LustDart = lustDart;
	export const PoisonDart = poisonDart;
	export const GlassSword = glassSword;
}
