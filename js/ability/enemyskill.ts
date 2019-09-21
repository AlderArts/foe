
import { Ability, TargetMode } from "../ability";
import { Encounter } from "../combat";
import { OrchidScenes } from "../enemy/orchid-scenes";
import { Entity } from "../entity";
import { Sex } from "../entity-sex";
import { GAME } from "../GAME";
import { Party } from "../party";
import { PregnancyHandler } from "../pregnancy";
import { Status } from "../statuseffect";
import { IParse, Text } from "../text";
import { AttackAb } from "./attack";
import { Defaults } from "./default";
import { AbilityNode } from "./node";

const sting = new Ability("Sting");
sting.Short = () => "Tail attack with chance of poisoning the target.";
sting.cost = { hp: undefined, sp: 10, lp: undefined};
sting.cooldown = 2;
sting.castTree.push(AbilityNode.Template.Physical({
	atkMod: 1.2,
	hitMod: 0.8,
	damageType: {pPierce: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] read[y] [hisher] stinger, aiming it at [tname]!", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] sting[notS] [tname] for " + Text.Damage(-dmg) + " damage!", parse);
		Text.NL();
	}],
	onAbsorb: [Defaults.Physical._onAbsorb],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Venom(target, { hit : 0.6, turns : 3, turnsR : 3, str : 1, dmg : 0.15 })) {
			Text.Add("[tName] [thas] been poisoned!", parse);
			Text.NL();
		}
	}],
}));

// Orchid
const tSnare = new Ability("T.Snare");
tSnare.Short = () => "Slows down the target and raises lust.";
tSnare.cost = { hp: undefined, sp: 20, lp: undefined};
tSnare.castTree.push(AbilityNode.Template.Physical({
	damageType: {lust: 0.1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] send[notS] [hisher] tentacles rushing toward [tname], wrapping them around [thimher]. ", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] only narrowly avoid[tnotS] getting caught by the vines!", parse);
		Text.NL();
	}],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Slow(target, { hit : 0.6, factor : 2, turns : 3, turnsR : 3 })) {
			Text.Add("The tentacles successfully snare [tname], restricting [thisher] movements!", parse);
			Text.NL();
		}
	}],
}));

const tSpray = new Ability("T.Spray");
tSpray.Short = () => "Sprays the targets in sticky tentacle seed. Raises lust.";
tSpray.cost = { hp: undefined, sp: 40, lp: undefined};
tSpray.targetMode = TargetMode.Enemies;
tSpray.cooldown = 2;
tSpray.castTree.push(AbilityNode.Template.Physical({
	damageType: {lust: 0.1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Party) => {
		const parse = AbilityNode.DefaultParser(caster);
		parse.foes = target.members.length > 1 ? "foes" : "foe";
		Text.Add("[Name] brandish[notEs] [hisher] tentacles, pointing them toward [hisher] [foes]. In a great fountain, sticky strands of cum splatter from the cock-like tentacles!", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] manage[tnotS] to avoid getting hit by the blast!", parse);
		Text.NL();
	}],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] take[tnotS] the full brunt of the spray, gaining a thick coating of tentacle spunk!", parse);
		Text.NL();
		target.AddLustFraction(0.2);
	}],
}));

const tVenom = new Ability("T.Venom");
tVenom.Short = () => "Sprays one target in poisonous goop.";
tVenom.cost = { hp: undefined, sp: 20, lp: undefined};
tVenom.cooldown = 1;
tVenom.castTree.push(AbilityNode.Template.Physical({
	hitMod: 0.8,
	damageType: {lust: 0.3},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] direct[notS] [hisher] tentacles toward [tname], spraying a long gout of toxic goop toward [thimher]! ", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] narrowly avoid[tnotS] the blast, escaping unharmed!", parse);
		Text.NL();
	}],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] cough[tnotS] and sputter[tnotS] as [theshe] is hit by the poisonous liquid!", parse);
		Text.NL();
	}],
	onAbsorb: [Defaults.Physical._onAbsorb],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Venom(target, { hit : 0.6, turns : 3, turnsR : 3, str : 1, dmg : 0.15 })) {
			Text.Add("[tName] [thas] been poisoned!", parse);
			Text.NL();
		}
	}],
}));

const tRavage = new Ability("T.Ravage");
tRavage.Short = () => "Grasps the enemy and constricts them, dealing damage and raising lust.";
tRavage.cost = { hp: undefined, sp: 25, lp: undefined};
tRavage.castTree.push(AbilityNode.Template.Physical({
	damageType: {lust: 0.5, pBlunt: 0.5},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] send[notS] [hisher] tentacles rushing toward [tname], aiming to catch [thimher]! ", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The tentacles narrowly miss [tname], merely grazing [thimher].", parse);
		Text.NL();
	}],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] can’t avoid the squirming mass of tentacles that quickly wrap around [thisher] body, and [theshe] cr[ty] out as the viny tendrils violate [thimher]. Somehow, the snakey tentacles manage to find their way past [tposs] defenses, ravaging [thimher]!", parse);
		Text.NL();
		Text.Add("[tName] only barely manage[tnotS] to break [poss] hold on [thimher], but not before the tentacles have gotten real close and personal.", parse);
		Text.NL();
		Text.Add("[tName] take[tnotS] " + Text.Damage(-dmg) + " damage!", parse);
		Text.NL();
		target.AddLustFraction(0.3);
	}],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

const tWhip = new Ability("T.Whip");
tWhip.Short = () => "Standard attack. Whips target for blunt damage.";
tWhip.cost = { hp: undefined, sp: undefined, lp: undefined};
tWhip.castTree.push(AbilityNode.Template.Physical({
	damageType: {lust: 0.5, pBlunt: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[Name] thrash[notEs] out with [hisher] tentacles, slashing [tname]! ", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The tentacles narrowly miss [tname], hitting empty air!", parse);
		Text.NL();
	}],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] [tis] unable to avoid the blow, and stagger[tnotS] back as it hits, dealing " + Text.Damage(-dmg) + " damage!", parse);
		Text.NL();
		target.AddLustFraction(0.3);
	}],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

const tViolate = new Ability("T.Violate");
tViolate.Short = () => "Orchid's violate attack.";
tViolate.cost = { hp: undefined, sp: undefined, lp: undefined};
tViolate.castTree.push(AbilityNode.Template.Physical({
	damageType: {lust: 1, pBlunt: 0.5},
	hitMod: 2,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Orchid grins lewdly as she lashes out with her tentacles, aiming for [tname]! ", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Even though [tname] [tis] greatly aroused, [theshe] somehow manage[tnotS] to evade getting tangled up in the tentacles.", parse);
		Text.NL();
	}],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		parse.tarmor = target.ArmorDesc();
		Text.Add("[tName] [tis] very aroused, and [thisher] reaction is dulled. The dryad laughs triumphantly as she strings [tname] up in the air, her tentacles worming their way inside [tposs] [tarmor]!", parse);
		Text.NL();
		if (target === GAME().player) {
			parse.vagDesc  = () => GAME().player.FirstVag().Short();
			parse.anusDesc = () => GAME().player.Butt().AnalShort();
			parse.vag = GAME().player.FirstVag() ? Text.Parse(" [vagDesc] and", parse) : "";
			Text.Add("You gasp as multiple plant-cocks press their way inside your[vag] [anusDesc]. A bad move it turns out, as additional ones shove their way inside your throat.", parse);
			Text.NL();

			if (GAME().player.FirstVag()) {
				Sex.Vaginal(GAME().orchid, GAME().player);
				GAME().player.FuckVag(GAME().player.FirstVag(), GAME().orchid.FirstCock(), 2);
				GAME().orchid.Fuck(GAME().orchid.FirstCock(), 2);

				OrchidScenes.Impregnate(GAME().player);
			}
			Sex.Anal(GAME().orchid, GAME().player);
			GAME().player.FuckAnal(GAME().player.Butt(), GAME().orchid.FirstCock(), 2);
			GAME().orchid.Fuck(GAME().orchid.FirstCock(), 2);

			OrchidScenes.Impregnate(GAME().player, PregnancyHandler.Slot.Butt);

			Sex.Blowjob(GAME().player, GAME().orchid);
			GAME().player.FuckOral(GAME().player.Mouth(), GAME().orchid.FirstCock(), 2);
			GAME().orchid.Fuck(GAME().orchid.FirstCock(), 2);

			Text.NL();
			Text.Add("You groan as your body protests against the massive strain of a dozen tentacles violently raping your every hole. The intense pressure quickly pushes you over the edge, and you feel your energy drain even as Orchid pumps her seed into you.", parse);
		} else {
			Text.Add("You scamper to [tposs] aid, feebly trying to pull the tentacles away from [thimher], but the dryad is strong. [tName] gargles as [thisher] throat is violated, yet more tentacles seeking [thisher] crotch.", parse);
			Text.NL();
			Text.Add("[tName] climaxes loudly, struggling helplessly against the invasive tentacles. Orchid laughs as she pumps [tname] full of her seed, making a mess of your companion.", parse);
		}
		Text.NL();
		Text.Add("<i>“That was merely a taste of what is to come,”</i> the corrupted dryad purrs as she discards [tname] on the ground.", parse);
		Text.NL();

		const dmg = Math.floor(target.curLust);
		target.AddHPAbs(-dmg);

		Text.Add("[tName] take[tnotS] " + Text.Damage(dmg) + " damage!", parse);

		const cum = target.OrgasmCum();

		Text.NL();
	}],
}));

// Gol
const golLustyPheromones = new Ability("L.Pheromones");
golLustyPheromones.Short = () => "Attack with lusty pheromones.";
golLustyPheromones.castTree.push(AbilityNode.Template.Lust({
	damageType: {lust: 1},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The Gol reaches down to just below the joint of her humanoid upper body and mantis-like lower form where an immense, juicy-looking pussy lies. She hooks her fingers into either side of it, panting at the sensation, and pulls it open, allowing you gaze into the simmering, pink depths. It's easily big enough to swallow your arm, but far more alarming is the scent it exudes - sweet and enticing.", parse);
		Text.NL();
		caster.AddLustFraction(0.1);
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] hold[tnotS] [thisher] breath to avoid as much of it as possible. Frowning, the Gol releases her netherlips.", parse);
		Text.NL();
	}],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] blush[tnotEs] as [thisher] head swims with thoughts of naked trysts under the stars, overwhelmed by the Gol’s pheromones.", parse);
		Text.NL();
		target.AddLustFraction(0.3);
	}],
	onAbsorb: [Defaults.Seduction._onAbsorb],
	damageFunc: AbilityNode.DamageFunc.Lust,
}));

const golCuntDash = new Ability("C.Dash");
golCuntDash.Short = () => "Cunt dash!";
golCuntDash.cost = { hp: undefined, sp: 50, lp: undefined};
golCuntDash.castTree.push(AbilityNode.Template.Physical({
	atkMod: 1.3,
	hitMod: 0.8,
	damageType: {pBlunt: 1, lust: 0.5},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Without warning, the Gol launches herself forward, legs clattering as she approaches [tname] with blinding speed. ", parse);
		Text.NL();

		caster.AddLustFraction(0.1);
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tName] barely toss[tnotEs] [thimher]self out of the way in time!", parse);
		Text.NL();
	}],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		parse.feet = target.FeetDesc();
		Text.Add("[tName] react[tnotS] a little too late to dive out the way, but [theshe] manage[tnotS] to duck low in an attempt to slip under her scythes… just not low enough. Her oncoming crotch and abdomen smack into [tname], and her fragrant pussy drags across [tposs] face and slimes it with a thick coat of her vaginal juices. The chitin of her underbelly is quite soft on [tposs] cheek, almost like a pleasant caress.", parse);
		Text.NL();
		Text.Add("The Gol queen bashes [tname] for " + Text.Damage(-dmg) + " damage, staggering [thimher]!", parse);
		Text.NL();
		Text.Add("When she finishes charging past, [tname] blink[tnotS] in a daze and stagger back on [thisher] [feet], uncomfortably warm in all the wrong places.", parse);
		Text.NL();
		target.AddLustFraction(0.3);
	}],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

const golPollen = new Ability("S.Pollen");
golPollen.Short = () => "Submission pollen.";
golPollen.cost = { hp: undefined, sp: undefined, lp: 250 };
golPollen.targetMode = TargetMode.Enemies;
golPollen.castTree.push(AbilityNode.Template.Physical({
	hitMod: 0.8,
	toDamage: undefined,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse: IParse = {};
		Text.Add("Sighing, the Gol runs her hands through her shimmering black hair in frustration. After her fingers' first pass, she repeats the action, then does it again. And again. Soon, the air around her seems slightly foggy, and your nose itches. A sneeze wracks your body as she continues the motion, filling the air with... something. You can't say what, but it's making you sneeze, and causing your nose to get itchy and irritable. The insectile beauty seems taller and more imposing after each involuntary spasm of your body. Her breasts appear larger, her pussy more inviting, and her face more charmingly human. For a monster, she wouldn't be a bad one to settle down with.", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Physical._onMiss],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		target.AddLustFraction(0.2);

		if (Status.Slow(target, { hit : 0.6, factor : 2, turns : 1, turnsR : 3 })) {
			Text.Add("[tName] [tis] slowed! ", parse);
			Text.NL();
		}
		if (Status.Horny(target, { hit : 0.6, str : 1, dmg : 0.1, turns : 1, turnsR : 3 })) {
			Text.Add("[tName] [tis] horny! ", parse);
			Text.NL();
		}
		if (Status.Sleep(target, { hit : 0.5, turns : 1, turnsR : 3 })) {
			Text.Add("[tName] [tis] drowsy! ", parse);
			Text.NL();
		}
		if (Status.Confuse(target, { hit : 0.3, turns : 1, turnsR : 3 })) {
			Text.Add("[tName] [tis] confused! ", parse);
			Text.NL();
		}
	}],
}));

// Corishev
const corishevWhip = new Ability("Corishev.Whip");
corishevWhip.Short = () => "Corishev Whip.";
corishevWhip.castTree.push(AbilityNode.Template.Physical({
	damageType: {pSlash: 1, lust: 0.2},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The lieutenant raises his arm, sending his whip lashing toward [tname]. ", parse);
		Text.NL();
	}],
	onMiss: [Defaults.Physical._onMiss],
	onDamage: [Defaults.Physical._onDamage],
	onAbsorb: [Defaults.Physical._onAbsorb],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The whip’s lust inducing poison quickly seeps into the wound, arousing [thimher]!", parse);
		Text.NL();

		target.AddLustFraction(0.2 + 0.3 * Math.random());

		if (Status.Bleed(target, { hit : 0.6, str : 1, dmg : 0.1, turns : 1, turnsR : 2 })) {
			Text.Add("[tName] [tis] bleeding!", parse);
			Text.NL();
		}
	}],
}));

const corishevLashing = new Ability("Corishev.Lashing");
corishevLashing.Short = () => "Corishev lashing.";
corishevLashing.cost = { hp: undefined, sp: 30, lp: 50};
corishevLashing.castTree.push(AbilityNode.Template.Physical({
	atkMod: 0.6,
	hitMod: 0.7,
	nrAttacks: 4,
	damageType: {pPierce: 1, lust: 0.2},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Laughing maniacally, Corishev swings his whip wildly, raining down a hail of lashes on [tname]. ", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("[tHeShe] barely manage[tnotS] to evade the blow. ", parse);
		Text.NL();
	}],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		parse.skin = target.SkinDesc();
		Text.Add("The barbed tip of the poisoned whip slashes across [tposs] [skin], dealing " + Text.Damage(-dmg) + " damage! ", parse);
		Text.NL();
	}],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

const corishevWideStrike = new Ability("Corishev.WideStrike");
corishevWideStrike.Short = () => "Corishev lashing.";
corishevWideStrike.cost = { hp: undefined, sp: 30, lp: 30};
corishevWideStrike.targetMode = TargetMode.Enemies;
corishevWideStrike.castTree.push(AbilityNode.Template.Physical({
	atkMod: 1.2,
	damageType: {pPierce: 1, lust: 0.2},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse: IParse = {};
		Text.Add("The crazed lieutenant swings his whip in an arc, hoping to catch the both of you with a single strike.", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Thankfully, the blow swings wide, missing [tname] completely.", parse);
		Text.NL();
	}],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Poisoned barbs sink into [tposs] flesh, causing [thimher] to take " + Text.Damage(-dmg) + " damage!", parse);
		Text.NL();
	}],
	onAbsorb: [Defaults.Physical._onAbsorb],
}));

const corishevSelfHarm = new Ability("SelfHarm");
corishevSelfHarm.Short = () => "Corishev SelfHarm.";
corishevSelfHarm.targetMode = TargetMode.Self;
corishevSelfHarm.castTree.push((ability: Ability, encounter: Encounter, caster: Entity) => {
	const parse: IParse = {};

	Text.Add("<i>“Yes… Yes!”</i> Corishev pants, the sounds of his whip repeatedly hitting his own flesh echoing throughout the dungeon. <i>“Ah… the fight excites me so… I’ll let you have a taste of it too, this burning lust!”</i>", parse);

	caster.AddLustFraction(0.3);

	Status.Horny(caster, { hit : 2, str : 1, dmg : 0.1, turns : 3, turnsR : 3 });
	Text.NL();
});

const corishevPunish = new Ability("Corishev.Punish");
corishevPunish.Short = () => "Corishev lashing.";
corishevPunish.cost = { hp: undefined, sp: undefined, lp: 200 };
corishevPunish.castTree.push(AbilityNode.Template.Physical({
	atkMod: 3,
	hitMod: 2,
	damageType: {pPierce: 1, lust: 0.2},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("<i>“You can feel it, can you not? This burning fire coursing through your veins...”</i> Corishev purrs as he licks his whip, fixing his eyes on [tname]. <i>“Let it flow, let the pain mix with the pleasure, until it consumes you whole!”</i> Whirling around with dizzying speed, the crazed lieutenant unleashes a massive attack toward [thimher].", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(undefined, target);
		parse.skin = target.SkinDesc();
		Text.Add("[tName] [tis] barely able to avoid the brunt of Corishev’s onslaught, but some of the poison from his whip still lands on [thisher] [skin], causing some vicious burning.", parse);
		Text.NL();
	}],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Caught by surprise - or perhaps distracted by [thisher] pounding heart - [tname] [tis] unable to dodge the flurry of blows raining down on [thimher]. [tHeShe] cr[ty] out in pain as the whip lacerates [thisher] flesh time and time again, dealing " + Text.Damage(-dmg) + " damage!", parse);
		Text.NL();
	}],
	onAbsorb: [Defaults.Physical._onAbsorb],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Horny(target, { hit : 0.6, str : 1, dmg : 0.1, turns : 1, turnsR : 3 })) {
			Text.Add("[tName] [tis] horny! ", parse);
			Text.NL();
		}
	}],
}));

// Cassidy Spar

const cassidyTailSlap = new Ability("CassTailSlap");
cassidyTailSlap.cost = { hp: undefined, sp: 10, lp: undefined};
cassidyTailSlap.Short = () => "CassTailSlap";
cassidyTailSlap.cooldown = 3;
cassidyTailSlap.castTree.push(AbilityNode.Template.Physical({
	damageType: {pBlunt: 0.5, mFire: 0.5},
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("<i>“Oh hey, ace. You really like swinging that thing around, don’t you? Don’t I get a go, too?”</i>", parse);
		Text.NL();
		Text.Add("Smiling cheerfully, Cassidy rushes up at you with her hammer raised for a swing. At the last moment, she drops the feint and half-turns, lashing at you with her prehensile, burning tail!", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(undefined, target);
		Text.Add("You narrowly manage to dodge Cassidy’s tail as it sails through the air. Despite the setback, she takes a step back and to the side, easily recovering from the miss and ready to come back at you!", parse);
		Text.NL();
	}],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The weight of Cassidy’s flaming tail smacks you silly! You take " + Text.Damage(-dmg) + " damage!", parse);
		Text.NL();
	}, AbilityNode.Template.Cancel()],
	onAbsorb: [Defaults.Physical._onAbsorb],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Numb(target, { hit : 0.2, turns : 1, turnsR : 1, proc : 0.25 })) {
			Text.Add("[tName] [thas] been afflicted with numb!", parse);
			Text.NL();
		}
	}],
}));

const cassidySmoke = new Ability("CassSmoke");
cassidySmoke.cost = { hp: undefined, sp: 20, lp: undefined};
cassidySmoke.Short = () => "CassSmoke";
cassidySmoke.cooldown = 4;
cassidySmoke.castTree.push(AbilityNode.Template.Physical({
	damageType: {mFire: 1},
	atkMod: 0.5,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Breathing deeply, Cassidy coughs up clouds of thick, hot smoke, interspersed with cinders. They wind their way in your direction, threatening to engulf you!", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(undefined, target);
		Text.Add("The cloud of smoke and cinders envelops you, but you push the worst of it away before you’re overwhelmed.", parse);
		Text.NL();
	}],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("The cinders burn you! You take " + Text.Damage(-dmg) + " damage!", parse);
		Text.NL();
	}, AbilityNode.Template.Cancel()],
	onAbsorb: [Defaults.Physical._onAbsorb],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Blind(target, { hit : 0.5, str : 0.5, turns : 1, turnsR : 3 })) {
			Text.Add("The thick smoke surrounds you. [tName] [tis] blinded!", parse);
			Text.NL();
		}
	}],
}));

const cassidyReflex = new Ability("CassReflex");
cassidyReflex.cost = { hp: undefined, sp: 30, lp: undefined};
cassidyReflex.Short = () => "CassReflex";
cassidyReflex.cooldown = 5;
// Push a regular attack
cassidyReflex.castTree.push(AttackAb.castTree[0]);
cassidyReflex.castTree.push((ability: Ability, encounter: Encounter, caster: Entity|any) => {
	caster.reflexFlag = true;
});

const cassidyImpact = new Ability("CassImpact");
cassidyImpact.cost = { hp: undefined, sp: 50, lp: undefined};
cassidyImpact.Short = () => "CassImpact";
cassidyImpact.cooldown = 5;
cassidyImpact.castTime = 100;
cassidyImpact.castTree.push(AbilityNode.Template.Physical({
	damageType: {pBlunt: 1, mFire: 1},
	atkMod: 2,
	onCast: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("Cassidy winks at you. <i>“Oh, you’re pushing me, aren’tcha? It looks like I’ve got to use my <b>special attack</b>. I’ve spent quite a bit of time practicing… do hope you like it!”</i>", parse);
		Text.NL();
		Text.Add("It looks like Cass is preparing something…", parse);
		Text.NL();
	}],
	onMiss: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(undefined, target);
		Text.Add("<i>“Heh. Here goes nothing!”</i> Cass roars as she brings her war hammer down, its head wreathed in flame. <i>“I pity you, ace - you’re gonna have a bad time!”</i>", parse);
		Text.NL();
		Text.Add("Imagine her surprise, then, when you duck under the arc of her hammer swing. It swooshes most impressively through empty air, creating a fiery arc; she wasn’t lying when she said you were going to have a bad time.", parse);
		Text.NL();
		Text.Add("<i>“H-hey! I spent so long winding that up!”</i>", parse);
		Text.NL();
		Text.Add("What? Did she think you were just going to stand there and take it?", parse);
		Text.NL();
		Text.Add("<i>“Oh, a smart one, aren’t you? Come at me, ace!”</i>", parse);
		Text.NL();
	}],
	onDamage: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity, dmg: number) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		Text.Add("<i>“Heh. Here goes nothing!”</i> Cass roars as she brings her war hammer down, its head wreathed in flame. <i>“I pity you, ace - you’re gonna have a bad time!”</i>", parse);
		Text.NL();
		Text.Add("Gah! You reel as Cass’ hammer connects with the impact of a fiery meteor, shaking you to the bone and burning you badly! You take " + Text.Damage(-dmg) + " damage!", parse);
		Text.NL();
	}, AbilityNode.Template.Cancel()],
	onAbsorb: [Defaults.Physical._onAbsorb],
	onHit: [(ability: Ability, encounter: Encounter, caster: Entity, target: Entity) => {
		const parse = AbilityNode.DefaultParser(caster, target);
		if (Status.Burn(target, { hit : 1, turns : 3, turnsR : 5, str : 1, dmg : 0.3 })) {
			Text.Add("[tName] [thas] been burned!", parse);
			Text.NL();
		}
	}],
}));

export namespace EnemySkillAb {
	export const Sting = sting;
	export const TSnare = tSnare;
	export const TSpray = tSpray;
	export const TVenom = tVenom;
	export const TRavage = tRavage;
	export const TWhip = tWhip;
	export const TViolate = tViolate;

	export namespace GolQueen {
		export const LustyPheromones = golLustyPheromones;
		export const CuntDash = golCuntDash;
		export const Pollen = golPollen;
	}

	export namespace Corishev {
		export const Whip = corishevWhip;
		export const Lashing = corishevLashing;
		export const WideStrike = corishevWideStrike;
		export const SelfHarm = corishevSelfHarm;
		export const Punish = corishevPunish;
	}

	export namespace Cassidy {
		export const TailSlap = cassidyTailSlap;
		export const Smoke = cassidySmoke;
		export const Reflex = cassidyReflex;
		export const Impact = cassidyImpact;
	}
}
