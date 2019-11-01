import { Ability, TargetMode } from "../ability";
import { Defaults } from "../ability/default";
import { AbilityNode } from "../ability/node";
import { Encounter } from "../combat";
import { Entity, ICombatEncounter } from "../entity";
import { Inventory } from "../inventory";
import { Item, ItemType } from "../item";
import { Status } from "../statuseffect";
import { IParse, Text } from "../text";

export class CombatItemAbility extends Ability {
	public item: CombatItem;
	constructor(item: CombatItem) {
		super();
		this.targetMode = TargetMode.Ally;
		this.item = item;
	}

	public Use(encounter: ICombatEncounter, caster: Entity, target?: Entity, inv?: Inventory) {
		if (inv && this.item.consume) {
			inv.RemoveItem(this.item);
		}

		super.Use(encounter, caster, target);
	}
}

export class CombatItem extends Item {

	// Default messages
	public static _onDamage(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) {
		const parse: IParse = { tName : target.nameDesc() };
		Text.Add("The attack hits [tName] for " + Text.Damage(dmg) + " damage!", parse);
		Text.NL();
	}
	public static _onMiss(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) {
		const parse: IParse = { tName : target.nameDesc() };
		Text.Add("The attack narrowly misses [tName], dealing no damage!", parse);
		Text.NL();
	}
	public static _onAbsorb(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) {
		const parse: IParse = { tName : target.NameDesc(), s : target.plural() ? "" : "s" };
		Text.Add("[tName] absorb[s] the attack, gaining " + Text.Heal(dmg) + " health!", parse);
		Text.NL();
	}
	public consume: boolean;
	public combat: CombatItemAbility;

	constructor(id: string, name: string, type?: ItemType) {
		super(id, name, type);
		this.consume = true;
		this.combat = new CombatItemAbility(this);
	}
}

const hPotion = new CombatItem("pot0", "Health Pot");
hPotion.price = 20;
hPotion.sDesc = () => "health potion";
hPotion.lDesc = () => "a weak health potion";
hPotion.Short = () => "A health potion.";
hPotion.Long = () => "A weak health potion.";
hPotion.combat.castTree.push((ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[Name] use[notS] a potion.", parse);
	Text.NL();
	Text.Add("It heals [tname] for " + Text.Heal(100) + "!", parse);
	Text.NL();

	target.AddHPAbs(100);
});

const ePotion = new CombatItem("pot1", "Energy Pot");
ePotion.price = 40;
ePotion.sDesc = () => "energy potion";
ePotion.lDesc = () => "a weak energy potion";
ePotion.Short = () => "An energy potion.";
ePotion.Long = () => "A weak energy potion.";
ePotion.combat.castTree.push((ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(caster, target);
	Text.Add("[Name] use[notS] an energy potion.", parse);
	Text.NL();
	Text.Add("A brief surge of energy runs through [tname], restoring " + Text.Mana(100) + " points of energy!", parse);
	Text.NL();

	target.AddSPAbs(100);
});

const speedPotion = new CombatItem("pot2", "Speed Pot");
speedPotion.price = 100;
speedPotion.sDesc = () => "speed potion";
speedPotion.lDesc = () => "a speed potion";
speedPotion.Short = () => "A speed potion.";
speedPotion.Long = () => "A speed potion.";
speedPotion.combat.targetMode = TargetMode.Self;
speedPotion.combat.castTree.push((ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
	const parse = AbilityNode.DefaultParser(caster);

	Status.Haste(caster, { turns : 3, turnsR : 3, factor : 2 });

	Text.Add("[Name] uncork[notS] a slender vial and drink[notS] its contents. [HeShe] briefly boost[notS] [hisher] speed!", parse);
	Text.NL();
});

const smokeBomb = new CombatItem("esc0", "S.Bomb");
smokeBomb.price = 100;
smokeBomb.Short = () => "A smoke bomb.";
smokeBomb.Long = () => "A glass sphere containing an alchemical concoction that disperses in thick, oily smoke when mixed with air. Smashing the bomb creates instant cover.";
smokeBomb.combat.enabledCondition = (encounter: Encounter, caster: Entity) => {
	return encounter.canRun;
};
smokeBomb.combat.targetMode = TargetMode.Self;
smokeBomb.combat.CastInternal = (encounter: Encounter, caster: Entity) => {
	const parse = AbilityNode.DefaultParser(caster);
	Text.Clear();
	Text.Add("[Name] toss[notEs] a smoke bomb at the ground. It explodes in a cloud of smoke, covering for [hisher] escape!", parse);
	Text.NL();
	Text.Flush();

	encounter.onRun();
};

const decoyStick = new CombatItem("decoy0", "Decoy");
decoyStick.price = 250;
decoyStick.Short = () => "A decoy stick.";
decoyStick.Long = () => "A stick containing the shards of an enchanted mirror, when broken it will generate illusory copies of the user, confusing targets.";
decoyStick.combat.targetMode = TargetMode.Self;
decoyStick.combat.castTree.push((ability: Ability, encounter: Encounter, caster: Entity) => {
	const parse = AbilityNode.DefaultParser(caster);

	Text.Add("[Name] grab[notS] a decoy stick and break[notS] it. A flash of light emanates, and when it subsides, [heshe] [has] split into four copies.", parse);
	Text.NL();

	Status.Decoy(caster, {copies: 3});
});

const lustDart = new CombatItem("dart0", "Lust darts");
lustDart.price = 25;
lustDart.Short = () => "Aphrodisiac-tipped darts.";
lustDart.Long = () => "Throwing darts smeared in potent aphrodisiacs. On a hit, they will charm an enemy.";
lustDart.combat.targetMode = TargetMode.Enemy;
lustDart.combat.castTree.push(AbilityNode.Template.Physical({
	toDamage : undefined,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] throw[notS] a lust dart at [tname].", parse);
		Text.NL();
	}],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(undefined, target);
		Text.Add("It strikes [tname], inflicting [thimher] with charm!", parse);
		Text.NL();
		if (Status.Horny(target, { hit : 0.75, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
			Text.Add("[tName] [tis] charmed!", parse);
		} else {
			Text.Add("[tName] resist[tnotS] the aphrodisiac!", parse);
		}
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(undefined, target);
		Text.Add("[tName] manage[tnotS] to deftly sidestep the dart.", parse);
		Text.NL();
	}],
}));

const poisonDart = new CombatItem("dart1", "Poison darts");
poisonDart.price = 40;
poisonDart.Short = () => "Poison-tipped darts.";
poisonDart.Long = () => "Throwing darts smeared in a fast-acting venom, making them quite dangerous.";
poisonDart.combat.targetMode = TargetMode.Enemy;
poisonDart.combat.castTree.push(AbilityNode.Template.Physical({
	toDamage : undefined,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] throw[notS] a poison dart at [tname].", parse);
		Text.NL();
	}],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(undefined, target);
		Text.Add("It strikes [tname], inflicting [thimher] with poison!", parse);
		Text.NL();
		if (Status.Venom(target, { hit : 0.75, turns : 3, turnsR : 5, str : 1, dmg : 0.2 })) {
			Text.Add("[tName] [tis] poisoned!", parse);
		} else {
			Text.Add("[tName] resist[tnotS] the poison!", parse);
		}
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(undefined, target);
		Text.Add("[tName] manage[tnotS] to deftly sidestep the dart.", parse);
		Text.NL();
	}],
}));

const glassSword = new CombatItem("glass0", "Glass sword");
glassSword.price = 1000;
glassSword.Short = () => "A glass sword, shatters on use.";
glassSword.Long = () => "A razor-sharp glass sword. A fragile but very powerful blade.";
glassSword.combat.targetMode = TargetMode.Enemy;
glassSword.combat.castTree.push(AbilityNode.Template.Physical({
	atkMod: 7,
	hitMod: 2,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] strike[notS] [tname] with a glass sword. The blade shatters!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
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
