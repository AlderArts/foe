import * as _ from "lodash";

import { Abilities } from "../abilities";
import { Images } from "../assets";
import { AppendageType } from "../body/appendage";
import { HipSize } from "../body/body";
import { Cock, CockType } from "../body/cock";
import { Color } from "../body/color";
import { Gender } from "../body/gender";
import { Capacity, Orifice } from "../body/orifice";
import { Race } from "../body/race";
import { Encounter } from "../combat";
import { Element } from "../damagetype";
import { EncounterTable } from "../encountertable";
import { Entity } from "../entity";
import { TargetStrategy } from "../entity";
import { Sex } from "../entity-sex";
import { GAME, TimeStep, WorldTime } from "../GAME";
import { GameState, SetGameState } from "../gamestate";
import { Gui } from "../gui";
import { AlchemyItems } from "../items/alchemy";
import { AlchemySpecial } from "../items/alchemyspecial";
import { ArmorItems } from "../items/armor";
import { CombatItems } from "../items/combatitems";
import { IngredientItems } from "../items/ingredients";
import { ToysItems } from "../items/toys";
import { WeaponsItems } from "../items/weapons";
import { Party } from "../party";
import { PregnancyHandler } from "../pregnancy";
import { Text } from "../text";
import { TF } from "../tf";

/*
Tier 1 Malice scouts and outriders
*/

const MaliceScoutsScenes: any = {};
MaliceScoutsScenes.Catboy = {};
MaliceScoutsScenes.Mare = {};
MaliceScoutsScenes.Goat = {};
MaliceScoutsScenes.Group = {};

/*
 *
 * Catboy Mage, lvl 9-13
 *
 */
export class CatboyMage extends Entity {
	public turnCounter: number;

	constructor(levelbonus?: number) {
		super();

		this.ID = "catboymage";

		this.avatar.combat     = Images.catboy;
		this.name              = "Catboy";
		this.monsterName       = "the catboy";
		this.MonsterName       = "The catboy";
		this.body.DefMale();
		this.FirstCock().thickness.base = 4;
		this.FirstCock().length.base = 19;
		this.Balls().size.base = 2;

		this.maxHp.base        = 500;
		this.maxSp.base        = 800;
		this.maxLust.base      = 50;
		// Main stats
		this.strength.base     = 20;
		this.stamina.base      = 25;
		this.dexterity.base    = 30;
		this.intelligence.base = 50;
		this.spirit.base       = 45;
		this.libido.base       = 20;
		this.charisma.base     = 18;

		this.elementDef.dmg[Element.mWater]  = -0.5;

		let level = 0;

		const scenes = new EncounterTable();
		scenes.AddEnc(function() {
			level = 9;
		}, 4.0, function() { return true; });
		scenes.AddEnc(function() {
			level = 10;
		}, 5.0, function() { return true; });
		scenes.AddEnc(function() {
			level = 11;
		}, 3.0, function() { return true; });
		scenes.AddEnc(function() {
			level = 12;
		}, 2.0, function() { return true; });
		scenes.AddEnc(function() {
			level = 13;
		}, 1.0, function() { return true; });
		scenes.Get();

		this.level             = level + (levelbonus || 0);
		this.sexlevel          = 0;

		this.combatExp         = this.level * 2;
		this.coinDrop          = this.level * 5;

		this.body.SetRace(Race.Feline);

		this.body.SetBodyColor(Color.white);

		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Feline, Color.white);

		this.body.SetEyeColor(Color.green);

		this.weaponSlot   = WeaponsItems.MageStaff;
		this.topArmorSlot = ArmorItems.MageRobes;

		this.Equip();

		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}

	public DropTable() {
		const drops = [];
		if (Math.random() < 0.1) {  drops.push({ it: AlchemyItems.Felinix }); }
		if (Math.random() < 0.02) { drops.push({ it: AlchemySpecial.Tigris }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.Whiskers }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.HairBall }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.CatClaw }); }

		if (Math.random() < 0.01) { drops.push({ it: AlchemyItems.Bovia }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.GoatMilk }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.SheepMilk }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.CowMilk }); }
		if (Math.random() < 0.05) { drops.push({ it: IngredientItems.LizardEgg }); }
		if (Math.random() < 0.05) { drops.push({ it: IngredientItems.MFluff }); }

		if (Math.random() < 0.3) {  drops.push({ it: IngredientItems.FreshGrass }); }
		if (Math.random() < 0.3) {  drops.push({ it: IngredientItems.SpringWater }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.Foxglove }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.TreeBark }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.RawHoney }); }

		if (Math.random() < 0.05) { drops.push({ it: IngredientItems.Wolfsbane }); }
		if (Math.random() < 0.05) { drops.push({ it: IngredientItems.Ramshorn }); }

		if (Math.random() < 0.01) { drops.push({ it: IngredientItems.BlackGem }); }
		if (Math.random() < 0.01) { drops.push({ it: IngredientItems.CorruptPlant }); }
		if (Math.random() < 0.01) { drops.push({ it: IngredientItems.CorruptSeed }); }
		if (Math.random() < 0.01) { drops.push({ it: IngredientItems.DemonSeed }); }

		return drops;
	}

	public Act(encounter: any, activeChar: any) {
		// TODO: Very TEMP
		Text.Add(this.name + " acts! Meow!");
		Text.NL();
		Text.Flush();

		// Pick a random target
		const targets = this.GetPartyTarget(encounter, activeChar);
		const t = this.GetSingleTarget(encounter, activeChar);

		this.turnCounter = this.turnCounter || 0;

		const first = (this.turnCounter == 0);
		this.turnCounter++;

		if (first) {
			CombatItems.DecoyStick.combat.Use(encounter, this);
			return;
		}

		const that = this;

		const scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Abilities.Attack.Use(encounter, that, t);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			CombatItems.DecoyStick.combat.Use(encounter, that);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			CombatItems.HPotion.combat.Use(encounter, that);
		}, 1.0, function() { return that.HPLevel() < 0.5; });
		scenes.AddEnc(function() {
			Abilities.Black.Bolt.Use(encounter, that, t);
		}, 3.0, function() { return Abilities.Black.Bolt.enabledCondition(encounter, that); });
		scenes.AddEnc(function() {
			Abilities.Black.Eruption.Use(encounter, that, targets);
		}, 4.0, function() { return Abilities.Black.Eruption.enabledCondition(encounter, that); });
		scenes.AddEnc(function() {
			Abilities.Black.ThunderStorm.Use(encounter, that, targets);
		}, 3.0, function() { return Abilities.Black.ThunderStorm.enabledCondition(encounter, that); });
		scenes.Get();
	}

}

MaliceScoutsScenes.Catboy.Impregnate = function(mother: Entity, father: CatboyMage, slot?: number, load?: number) {
	mother.PregHandler().Impregnate({
		slot   : slot || PregnancyHandler.Slot.Vag,
		mother,
		father,
		race   : Race.Feline,
		num    : 1,
		time   : 30 * 24,
		load   : load || 2,
	});
};

/*
 *
 * Centaur Mare, lvl 9-13
 *
 */
export class CentaurMare extends Entity {
	constructor(levelbonus?: number) {
		super();

		this.ID = "centaurmare";

		this.avatar.combat     = Images.centaur_mare;
		this.name              = "Centauress";
		this.monsterName       = "the centauress";
		this.MonsterName       = "The centauress";
		this.body.DefFemale();
		this.FirstVag().virgin = false;
		this.Butt().virgin     = false;

		this.maxHp.base        = 1000;
		this.maxSp.base        = 400;
		this.maxLust.base      = 400;
		// Main stats
		// High stamina, dex. Mid str, int, spi, libido. Low cha.
		this.strength.base     = 40;
		this.stamina.base      = 50;
		this.dexterity.base    = 45;
		this.intelligence.base = 35;
		this.spirit.base       = 35;
		this.libido.base       = 30;
		this.charisma.base     = 15;

		this.elementDef.dmg[Element.mEarth]  = 0.5;

		let level = 0;

		const scenes = new EncounterTable();
		scenes.AddEnc(function() {
			level = 9;
		}, 4.0, function() { return true; });
		scenes.AddEnc(function() {
			level = 10;
		}, 5.0, function() { return true; });
		scenes.AddEnc(function() {
			level = 11;
		}, 3.0, function() { return true; });
		scenes.AddEnc(function() {
			level = 12;
		}, 2.0, function() { return true; });
		scenes.AddEnc(function() {
			level = 13;
		}, 1.0, function() { return true; });
		scenes.Get();

		this.level             = level + (levelbonus || 0);
		this.sexlevel          = 0;

		this.combatExp         = this.level * 2;
		this.coinDrop          = this.level * 5;

		this.body.SetRace(Race.Horse);

		this.body.SetBodyColor(Color.brown);

		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Horse, Color.black);

		this.body.SetEyeColor(Color.blue);

		this.weaponSlot   = WeaponsItems.OakSpear;
		this.topArmorSlot = ArmorItems.BronzeChest;
		this.botArmorSlot = ArmorItems.BronzeLeggings;

		this.Equip();

		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}

	public DropTable() {
		const drops = [];

		if (Math.random() < 0.1) {  drops.push({ it: AlchemyItems.Equinium }); }
		if (Math.random() < 0.05) { drops.push({ it: AlchemySpecial.Taurico }); }
		if (Math.random() < 0.01) { drops.push({ it: AlchemySpecial.EquiniumPlus }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.HorseHair }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.HorseShoe }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.HorseCum }); }

		if (Math.random() < 0.3) {  drops.push({ it: IngredientItems.FruitSeed }); }
		if (Math.random() < 0.2) {  drops.push({ it: IngredientItems.Hummus }); }
		if (Math.random() < 0.2) {  drops.push({ it: IngredientItems.SpringWater }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.FlowerPetal }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.Wolfsbane }); }

		if (Math.random() < 0.05) { drops.push({ it: WeaponsItems.OakSpear }); }
		if (Math.random() < 0.05) { drops.push({ it: ArmorItems.BronzeChest }); }
		if (Math.random() < 0.05) { drops.push({ it: ToysItems.EquineDildo }); }
		if (Math.random() < 0.05) { drops.push({ it: CombatItems.HPotion }); }
		if (Math.random() < 0.05) { drops.push({ it: CombatItems.LustDart }); }

		if (Math.random() < 0.01) { drops.push({ it: AlchemyItems.Caprinium }); }
		if (Math.random() < 0.01) { drops.push({ it: AlchemyItems.Cerventine }); }
		if (Math.random() < 0.01) { drops.push({ it: AlchemyItems.Estros }); }
		if (Math.random() < 0.01) { drops.push({ it: AlchemyItems.Fertilium }); }
		if (Math.random() < 0.01) { drops.push({ it: AlchemyItems.FertiliumPlus }); }

		return drops;
	}

	public Act(encounter: any, activeChar: any) {
		// TODO: Very TEMP
		Text.Add(this.name + " acts! Hyaaah!");
		Text.NL();
		Text.Flush();

		// Pick a random target
		const t = this.GetSingleTarget(encounter, activeChar);

		const that = this;

		const scenes = new EncounterTable();

		scenes.AddEnc(function() {
			Abilities.Attack.Use(encounter, that, t);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Abilities.Physical.Bash.Use(encounter, that, t);
		}, 2.0, function() { return Abilities.Physical.Bash.enabledCondition(encounter, that); });
		scenes.AddEnc(function() {
			Abilities.Physical.CrushingStrike.Use(encounter, that, t);
		}, 3.0, function() { return Abilities.Physical.CrushingStrike.enabledCondition(encounter, that); });
		scenes.AddEnc(function() {
			Abilities.Physical.FocusStrike.Use(encounter, that, t);
		}, 2.0, function() { return Abilities.Physical.FocusStrike.enabledCondition(encounter, that); });
		/* TODO Taunt attack? (focus)
		scenes.AddEnc(function() {
			Abilities.Physical.TAttack.Use(encounter, that, t);
		}, 3.0, function() { return Abilities.Physical.TAttack.enabledCondition(encounter, that); });
		*/
		scenes.Get();
	}
}

/*
 *
 * Goat Alchemist, lvl 9-13
 *
 */
export class GoatAlchemist extends Entity {
	constructor(levelbonus?: number) {
		super();

		this.ID = "goatalchemist";

		this.avatar.combat     = Images.old_goat;
		this.name              = "Alchemist";
		this.monsterName       = "the goat alchemist";
		this.MonsterName       = "The goat alchemist";

		this.body.DefMale();
		this.FirstCock().thickness.base = 5;
		this.FirstCock().length.base = 22;
		this.Balls().size.base = 3;

		this.maxHp.base        = 700;
		this.maxSp.base        = 500;
		this.maxLust.base      = 500;
		// Main stats
		this.strength.base     = 22;
		this.stamina.base      = 45;
		this.dexterity.base    = 34;
		this.intelligence.base = 40;
		this.spirit.base       = 40;
		this.libido.base       = 35;
		this.charisma.base     = 13;

		this.elementDef.dmg[Element.mIce]  =  0.5;
		this.elementDef.dmg[Element.mFire] = -0.5;

		let level = 0;

		const scenes = new EncounterTable();
		scenes.AddEnc(function() {
			level = 9;
		}, 4.0, function() { return true; });
		scenes.AddEnc(function() {
			level = 10;
		}, 5.0, function() { return true; });
		scenes.AddEnc(function() {
			level = 11;
		}, 3.0, function() { return true; });
		scenes.AddEnc(function() {
			level = 12;
		}, 2.0, function() { return true; });
		scenes.AddEnc(function() {
			level = 13;
		}, 1.0, function() { return true; });
		scenes.Get();

		this.level             = level + (levelbonus || 0);
		this.sexlevel          = 0;

		this.combatExp         = this.level * 2;
		this.coinDrop          = this.level * 5;

		this.body.SetRace(Race.Goat);

		this.body.SetBodyColor(Color.white);

		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Goat, Color.white);

		this.body.SetEyeColor(Color.gray);

		this.topArmorSlot = ArmorItems.SimpleRobes;

		this.Equip();

		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}

	public DropTable() {
		const drops = [];
		if (Math.random() < 0.1) {  drops.push({ it: AlchemyItems.Caprinium }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.Ramshorn }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.GoatMilk }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.GoatFleece }); }

		if (Math.random() < 0.3) {  drops.push({ it: IngredientItems.FreshGrass }); }
		if (Math.random() < 0.3) {  drops.push({ it: IngredientItems.SpringWater }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.Foxglove }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.FlowerPetal }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.FoxBerries }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.TreeBark }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.AntlerChip }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.SVenom }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.MDust }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.RawHoney }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.BeeChitin }); }

		if (Math.random() < 0.3) { drops.push({ it: IngredientItems.Wolfsbane }); }

		if (Math.random() < 0.02) { drops.push({ it: IngredientItems.BlackGem }); }
		if (Math.random() < 0.02) { drops.push({ it: IngredientItems.CorruptPlant }); }
		if (Math.random() < 0.02) { drops.push({ it: IngredientItems.CorruptSeed }); }
		if (Math.random() < 0.02) { drops.push({ it: IngredientItems.DemonSeed }); }

		return drops;
	}

	public Act(encounter: any, activeChar: any) {
		// TODO: Very TEMP
		Text.Add(this.name + " acts! Harrumph!");
		Text.NL();
		Text.Flush();

		// Pick a random target
		const targets = this.GetPartyTarget(encounter, activeChar);
		const t = this.GetSingleTarget(encounter, activeChar);

		const allies = this.GetPartyTarget(encounter, activeChar, true);
		const ally = this.GetSingleTarget(encounter, activeChar, TargetStrategy.LowHp, true);

		const that = this;

		const scenes = new EncounterTable();
		// Offensive
		scenes.AddEnc(function() {
			Abilities.Attack.Use(encounter, that, t);
		}, 2.0, function() { return true; });
		scenes.AddEnc(function() {
			Abilities.Black.Shimmer.Use(encounter, that, t);
		}, 3.0, function() { return Abilities.Black.Shimmer.enabledCondition(encounter, that); });
		scenes.AddEnc(function() {
			Abilities.White.Tirade.Use(encounter, that, t);
		}, 1.0, function() { return Abilities.White.Tirade.enabledCondition(encounter, that); });
		// Buffing/Healing
		scenes.AddEnc(function() {
			CombatItems.SpeedPotion.combat.Use(encounter, that);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Abilities.White.Heal.Use(encounter, that, ally);
		}, 1.0, function() { return Abilities.White.Heal.enabledCondition(encounter, that) && ally.HPLevel() < 0.9; });
		scenes.AddEnc(function() {
			Abilities.White.Cheer.Use(encounter, that, allies);
		}, 1.0, function() { return Abilities.White.Cheer.enabledCondition(encounter, that); });
		scenes.AddEnc(function() {
			Abilities.White.Empower.Use(encounter, that, ally);
		}, 1.0, function() { return Abilities.White.Empower.enabledCondition(encounter, that); });

		scenes.Get();
	}
}

// CATBOY SCENES
MaliceScoutsScenes.Catboy.LoneEncounter = function(levelbonus: number) {
	const player = GAME().player;
	const party: Party = GAME().party;
	const enemy    = new Party();
	const catboy   = new CatboyMage(levelbonus);
	enemy.AddMember(catboy);
	const enc: any = new Encounter(enemy);
	enc.catboy   = catboy;

	enc.onEncounter = function() {
		let parse: any = {
			day : WorldTime().LightStr("sun beats down warmly", "moon shines softly"),
		};
		parse = player.ParserTags(parse);

		Text.Clear();
		parse.f = player.HasLegs() ? " in your feet" : "";
		Text.Add("Wandering of the foothills of the Highlands for about an hour, you don’t find anything of note amongst the rocky ground and tall grasses. The air is crisp and the [day] upon you; although you’re starting to feel the rigors of the hard, uneven ground[f], there’s a certain quality to it that you nevertheless find quite refreshing and invigorating.", parse);
		Text.NL();
		parse.f = player.HasLegs() ? " - or perhaps where your thighs would have been, if you’d had any" : "";
		Text.Add("No better time for a quick break, then, before all that traveling really gets to you. The gently rounded top of a nearby hill offers a perfect spot to take a breather - high up in the midst of a stiff breeze, and with a good view of the surrounding lands to survey them and plan your next move. The grasses get taller as you move along, reaching up to perhaps mid-thigh[f], but you press on ahead and are at the top before long.", parse);
		Text.NL();
		Text.Add("Yes, this is indeed the life. Shrugging off your possessions, you ", parse);
		if (party.Num() > 1) {
			if (party.Num() == 2) {
				parse.comp = party.Get(1).name;
			} else {
				parse.comp = "your companions";
			}
			Text.Add("and [comp] ", parse);
		}
		Text.Add("lounge around for a bit to recuperate, closing your eyes to feel the wind on your [skin] and simply savoring the wonder of the great outdoors. As you’re reveling in the natural sensations, though, something else makes itself known to you - cold and clammy as it winds about your arms and body…", parse);
		Text.NL();
		Text.Add("Opening your eyes with a start, you quickly realize that tendrils of a mist-like substance have risen out of a particularly thick patch of grass and begun curling about your arms and body, pushing at you as they begin to tighten. Thankfully, they’re still largely immaterial, and you easily manage to break free with a bit of concentrated effort. Readying your [weapon], you spring into action with a yell and leap at the tall grass.", parse);
		Text.NL();
		Text.Add("What you flush out isn’t quite what one might have expected: instead of an animal or wild monster, what emerges into the open is a small-ish catboy, perhaps no more than five and a half feet tall. A large hood covers much of his head and hair, the garment having large slits cut out from its fabric to accommodate the catboy’s large, white-furred ears. Bits of translucent mist fall from his fingers, marking him as the one who’d tried to ensnare you with that spell; his simple brown cloak and baggy pants billow in the stiff breeze as he yowls and tries to run away. Unfortunately for the poor catboy, the large belt at his waist with all the pouches and implements - as well as what looks like a pocket-sized spellbook - unbalance him somewhat; he loses his footing, comically trips over something hidden in the grass and plants his face into the ground.", parse);
		Text.NL();
		Text.Add("You almost feel sorry for the poor, effeminate guy. Almost. He did try to truss you up with magical bindings on the sly, after all.", parse);
		Text.NL();
		Text.Add("The catboy desperately attempts to right himself as you approach, his snowy-furred tail thrashing to and fro as he gathers magic into the palm of his hand. Fear, practically pouring off him like a waterfall, turns into a kind of grim determination as he quickly concludes he’s being cornered.", parse);
		Text.NL();
		Text.Add("<i>“Went out to prove that I’m worthy of being a man,”</i> he mutters to himself as he brushes dirt off his threadbare shirt. <i>“And I’m going to do it!”</i>", parse);
		Text.NL();
		Text.Add("<b>It’s a fight, although you wonder if it really has to be one…</b>", parse);
		Text.Flush();

		// Start combat
		Gui.NextPrompt(function() {
			enc.PrepCombat();
		});
	};

	/*
	enc.canRun = false;
	enc.VictoryCondition = ...
	*/
	enc.onLoss    = MaliceScoutsScenes.Catboy.LossPrompt;
	enc.onVictory = MaliceScoutsScenes.Catboy.WinPrompt;

	return enc;
};

MaliceScoutsScenes.Catboy.WinPrompt = function() {
	const player = GAME().player;
	const party: Party = GAME().party;
	const enc  = this;
	SetGameState(GameState.Event, Gui);

	const parse: any = {

	};

	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("A loud yowl sounds from the catboy mage as he stumbles back. It’s impressive how despite his frail-looking frame, he’s managed to take as much punishment as he already has and still remain standing. You’re not exactly sure when you actually hit him in the face, but there’s blood pouring out of his nose in a frenetic nosebleed and his large, floppy ears have folded flat against his tattered hood.", parse);
		Text.NL();
		Text.Add("<i>“Okay, okay, you win,”</i> he mumbles in a distinctly nasal voice, no thanks to his nosebleed. <i>“Maybe being captured isn’t so bad, after all. At least I’ll be able to get away from everything.”</i> He holds out a hand as if about to fashion a spell, then thinks the better of it and lets it fall to his side.", parse);
		Text.NL();
		Text.Add("So… now that you’re talking like reasonable people… just what in the seven hells was he doing, anyway?", parse);
		Text.NL();
		Text.Add("He blows his nose into his hands and looks aghast at the bloody mess that results, his tail drooping. <i>“You want to know?”</i>", parse);
		Text.NL();
		Text.Add("Yes.", parse);
		Text.NL();
		Text.Add("<i>“You really want to know?”</i>", parse);
		Text.NL();
		Text.Add("Given that he was going to ensnare you, no doubt for whatever nefarious purposes he had in mind, you’d like to think you’re owed a small courtesy for not thrashing him within an inch of his life like he deserves.", parse);
		Text.NL();
		Text.Add("Upon hearing this, the catboy shrinks back even more and mewls pathetically. Actual fright, or an attempt to play off your emotions? Who knows? <i>“Um, well, you see, the others at the camp said I needed to go out and be a man, if you know what I mean… really aren’t enough camp followers to go around, and to be honest I’m not really very good at this sort of thing…”</i>", parse);
		Text.NL();
		Text.Add("You motion for him to go on, and to stop mumbling.", parse);
		Text.NL();
		Text.Add("<i>“So I thought that if I actually went and did it with an outsider, at least word wouldn’t spread about how useless I am…”</i>", parse);
		Text.NL();
		Text.Add("Right. You’re seeing how this is shaping up. ", parse);
		if (party.Num() > 1) {
			parse.s = party.Num() > 2 ? "s" : "";
			Text.Add("Maybe he should’ve, you don’t know, at least not picked a target which would leave him outnumbered?", parse);
			Text.NL();
			Text.Add("<i>“Didn’t see your friend[s] there. Grass was tall.”</i>", parse);
			Text.NL();
		}
		Text.Add("Yeah, hopeless. What’re you going to do with this poor sop?", parse);
		Text.Flush();

		const options = [];

		options.push({nameStr : "Petting",
			tooltip : Text.Parse("Aww, what a pathetic little kitty. Why don’t you give him a scratch?", parse),
			enabled : true,
			func() {
				MaliceScoutsScenes.Catboy.Petting(enc);
			},
		});
		options.push({nameStr : "Petplay",
			tooltip : Text.Parse("Play around with the kitty, put him in his place. Have him put that mouth of his to good use.", parse),
			enabled : true,
			func() {
				MaliceScoutsScenes.Catboy.PetPlay(enc);
			},
		});
		if (player.FirstVag()) {
			options.push({nameStr : "Pity fuck",
				tooltip : Text.Parse("Take pity on the poor guy and let him have it.", parse),
				enabled : true,
				func() {
					MaliceScoutsScenes.Catboy.PityFuck(enc, true);
				},
			});
		}
		/* TODO (fuck him)
		options.push({nameStr : "",
			tooltip : Text.Parse("", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
				Text.Flush();
			}
		});
		*/

		Gui.SetButtonsFromList(options, true, function() {
			Text.Clear();
			Text.Add("This doesn’t have anything on you. Whatever’s been going on between this catboy and his friends, it’s nothing that you want any part of. If he wants to be a man, he can go learn to be one somewhere else.", parse);
			Text.NL();
			Text.Add("You dismiss the poor bastard with a wave of your hand, and he scurries off instantly, moving surprisingly fast as his thin legs carry him over the next hill and out of sight. Hopefully, he’s learned something from this, although you’re not going to hold out hope for that.", parse);
			Text.Flush();
			Gui.NextPrompt();
		});
	});
	Encounter.prototype.onVictory.call(enc);
};

MaliceScoutsScenes.Catboy.PityFuck = function(enc: any, win: boolean) {
	const player = GAME().player;
	const party: Party = GAME().party;
	const catboy = enc.catboy;
	const p1cock = player.BiggestCock();
	let parse: any = {

	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");

	Text.Clear();
	if (win) {
		Text.Add("Shit, this kitty-boy is so sad, you can’t even believe such a wretched little cumrag is possible. Several spirits of utter misfortune must have conspired to produce him, and even so…", parse);
		Text.NL();
		Text.Add("The catboy’s ears perk up at your words. <i>“Sad enough for pity sex?”</i>", parse);
		Text.NL();
		Text.Add("Well, technically it might be possible for someone to be so pathetic and hopeless that they go all the way around to be actually sexy, but unfortunately for him, he hasn’t quite gotten to that point yet - he’ll have to be a lot more of a loser before he even approaches that point. It’s like… like drinking so much coffee that your sobriety wraps about itself and you end up in whatever the opposite of drunk is.", parse);
		Text.NL();
		Text.Add("His ears flatten again. <i>“Oh.”</i>", parse);
		Text.NL();
		Text.Add("Come on, he has to try. You’re quite sure that he’s much, much worse, isn’t he? If he wants, he can start with the light stuff and work his way deeper. So, when was the last time he kissed a girl? He’ll have to get waaaay more pathetic to turn you on, that’s for sure.", parse);
		Text.NL();
		Text.Add("His brow furrows weakly. <i>“Um… I don’t remember…”</i>", parse);
		Text.NL();
		Text.Add("Does he not remember because he forgot when was the last time he locked lips, or is it because he’s actually never kissed anyone save for maybe his own mother?", parse);
		Text.NL();
		Text.Add("He flushes and looks away. <i>“All right, you got me. I’ve never kissed an actual girl before… and before you mention it, I’ve never kissed a guy, either.”</i>", parse);
		Text.NL();
		Text.Add("That’s better, although still pretty far off the mark. What else has he got to prove how much of a pathetic wimp he is?", parse);
		Text.NL();
		Text.Add("<i>“Hmm… let me think...“</i> He gasps all of a sudden. <i>“I know! I know! I secretly collect life-size cushions with erotic art on them! Things like nude catgirls in seductive and suggestive poses! I’ve given them all names… don’t tell the alchemist, though. He’d be mad.”</i>", parse);
		Text.NL();
		Text.Add("All right, that <i>is</i> pretty pathetic - just listening to that was enough to make your stomach turn and a creepy feeling crawl all over your body. He’ll have to do just a bit better, though…", parse);
		Text.NL();
		Text.Add("<i>“Hmm.”</i> He thinks a moment more. <i>“Well, there was that time when Meredith demanded that I finally learn to be a man, and so she went ahead and got me a night with one of the whores amongst the camp followers…”</i> he hesitates, coughs and whimpers.", parse);
		Text.NL();
		Text.Add("Yes? What happened?", parse);
		Text.NL();
		Text.Add("<i>“So she’d just gotten undressed, you see, and came over to do the same to me. She’d just gotten my pants down to about my knees when her fingers just brushed against my cock, and… and… I just came right there and then before anything even happened.”</i>", parse);
		Text.NL();
		Text.Add("Oh fuck, now that <i>is</i> wretched.", parse);
		Text.NL();
		Text.Add("<i>“She didn’t even bother to put her clothes back on, just ran out of the place to tell her sisters about what’d just happened, and they all started laughing, and more people came, which just meant they got to hear about it, and that drew more people…”</i> He bursts into a flood of tears that run down his cheeks. <i>“I’m such a useless piece of shit… I’m sure even Malice himself knows how much of a loser I am. He’d boot me straight out of camp or order me turned into a cocksleeve, only I’m too lowly and pathetic to even warrant his notice.”</i>", parse);
		Text.NL();
		Text.Add("Fine, fine, you’ve heard enough; he can come over. You want to see just how badly someone can fuck. Lying down on the ground, you beckon the catboy forward with a “come hither” finger, a predatory grin on your face.", parse);
	} else {
		Text.Add("Astonished, the catboy stares down at his furry paw-hands disbelievingly, clearly uncertain as to whether his victory was for real or just some figment of his imagination. He pinches his cheeks a few times, then his arm, and finally his tail before reluctantly admitting that yes, this is real and it is happening.", parse);
		Text.NL();
		Text.Add("Well? He beat you fair and square. Isn’t he going to finish what he started?", parse);
		Text.NL();
		Text.Add("<i>“Umm… I’m not sure what happens next. I didn’t think that far ahead.”</i>", parse);
		Text.NL();
		Text.Add("What?", parse);
		Text.NL();
		Text.Add("<i>“Err… I was told by my friend to go out there and be a man, you see… and if I didn’t become a man, I shouldn’t bother to head back, that this was the last straw and I was a total loser if I couldn’t even get this simple thing done. So…”</i> he hesitates a little more. <i>“I’m not sure what happens next. He just said to go and beat up some likely-looking traveler, and he stopped there.”</i>", parse);
		Text.NL();
		Text.Add("There’s a moment of uncomfortable silence as you digest this, and the catboy mage flicks his eyes this way and that.", parse);
		Text.NL();
		Text.Add("<i>“Hey, my magic was pretty good, wasn’t it?”</i>", parse);
		Text.NL();
		Text.Add("Seeing as how he’s the one still standing, you kinda have to agree with that.", parse);
		Text.NL();
		Text.Add("More silence.", parse);
		Text.NL();
		Text.Add("Look, does he even know what his friend <i>meant</i> by being a man?", parse);
		Text.NL();
		Text.Add("<i>“Um… I think I have some idea, but I’m not entirely sure on the details. Whenever I ask, everyone seems to get flustered and shy away from me, especially the girls.”</i>", parse);
		Text.NL();
		Text.Add("Gah. Sure, he may be a pathetic loser, but since you lost to him, what does that make <i>you</i>? Fine, fine; since you’ve stalled long enough for some strength to return to your limbs, guess you’ll just have to show this young feline friend exactly what it means to be a man. With any chance, you’ll also discover just how badly someone can fuck.", parse);
	}
	Text.NL();
	Text.Add("Hesitantly, the catboy closes the distance between you. Despite his usual spineless demeanor, you can see that he’s trying to be brave and resolute about it - too bad that “trying” simply isn’t going to be enough. After all, there is only do or do not, no “try”. The moment he kneels down within arm’s reach, you shoot out your hand and catch him by the collar of his shirt.", parse);
	Text.NL();
	Text.Add("<i>“Hey! What-”</i>", parse);
	Text.NL();
	Text.Add("You’re going to teach him to be a man; in short, you’re going to give him a pity fuck. Isn’t that what he wanted?", parse);
	Text.NL();
	Text.Add("<i>“Y-yes, but-”</i>", parse);
	Text.NL();
	Text.Add("Sure, it <i>is</i> a pity fuck and you’re going to make sure that you take every opportunity to remind him of that fact, but considering how pathetic he is, he should be thankful to just be able to get his dick wet.", parse);
	Text.NL();
	Text.Add("The catboy mewls and whimpers, holding his face in his hands with his large, fluffy ears pressed flat against his hair. Right, that seems to shut him up well enough; time to get to business. With a flourish, you rip down the waistband of his baggy pants, pulling it about his knees and revealing his junk and balls hanging free for all who want to take a gander.", parse);
	Text.NL();
	Text.Add("Hey, so he likes to go commando, does he?", parse);
	Text.NL();
	Text.Add("<i>“H-hey! What business of it is yours what I wear under my clothes?”</i>", parse);
	Text.NL();
	Text.Add("That’s nice; might that be the beginnings of a spine developing in him?", parse);
	Text.NL();
	Text.Add("The catboy does his best to remain resolute, but eventually breaks down under your withering gaze. You just smirk and study his tackle a little more closely; on such an effeminate guy, the catboy mage is surprisingly well-endowed. About nine inches of feline cock stands at attention before you, stiff and turgid in every sense of the word as it twitches in time with his heartbeat. This goes double for the soft cartilaginous barbs of pleasure interspersed along its length - teasing one of them elicits a plaintive, needy mewl from the catboy, and a small dribble of pre works its way out from the tip of his manhood. Truly hopeless; you’ve barely touched him and he’s already fit to bust.", parse);
	Text.NL();
	Text.Add("Come to think of it, what <i>would</i> happen if you did just that?", parse);
	Text.NL();
	Text.Add("<i>“W-what are you thinking?”</i>", parse);
	Text.NL();
	Text.Add("Oh, nothing much. You just need him to kneel atop you, straddle your chest for a bit.", parse);
	Text.NL();
	Text.Add("He clearly doesn’t like the idea and makes to shuffle away, but you sit up and grab him by one of his large ears, tugging until he mewls plaintively and complies, shedding his pants in the process.", parse);
	Text.NL();
	Text.Add("See? That wasn’t so bad. He’s going to have to get bigger balls if he wants to be an actual man instead of a cringing cat only fit for being a cocksleeve.", parse);
	Text.NL();
	Text.Add("<i>“Um, they’re already pretty heavy… it’s why I prefer to let them loose instead of packing them up like that, it gets really uncomfortable… I was once considering a potion to make them more manageable, but Meredith laughed and asked if I really wanted to be less of a man than I already was…”</i>", parse);
	Text.NL();
	Text.Add("All right, you meant that figuratively, and you did <i>not</i> need to know that snippet of information. The catboy mage is already pretty stiff, but rapidly becomes even more so when you take his maleness in hand; the pleasure-nubs rapidly swell from small pimple-like bumps into something actually approaching barbs. Grinning, you rub the soft spines one at a time, taking care to tease them between thumb and forefinger. There’s a moment of tension, a moment of electricity in the air, and then a huge dollop of pre plops out of the tip of his cock.", parse);
	Text.NL();
	Text.Add("Well, you can’t blame him for not having had experience. You’ll just have to get this over with before he just blows his load all over you. The catboy is quite light, and it doesn’t take much strength for you to shift him into a more proper position.", parse);
	Text.NL();
	Text.Add("Now, maybe you should start slowly. Considering how the catboy’s face is utterly flushed and - yep, he’s actually bleeding from his nose, just a thin trickle, but it’s there. He looks at you dumbfounded for a bit, then realizes why you’re staring at him and summons the willpower to daub at his face with a sleeve.", parse);
	Text.NL();
	Text.Add("Now, does he understand what missionary is?", parse);
	Text.NL();
	Text.Add("<i>“Kinda sorta.”</i>", parse);
	Text.NL();
	Text.Add("Kinda sorta?", parse);
	Text.NL();
	Text.Add("The blush intensifies, and you feel the feline cock against your skin strain at its physical confines, desperate with desire. <i>“Um, I’ve read books… so I’m pretty good on the theory, just not the practical aspect of things…”</i>", parse);
	Text.NL();
	Text.Add("Oh-kay…", parse);
	Text.NL();
	Text.Add("<i>“I mean, I’ve even memorized how to do the grand pincer movement!”</i> He brightens up a little. <i>“I’ve practiced a lot, just not with anyone…”</i>", parse);
	Text.NL();
	Text.Add("Then who or what… wait, you probably shouldn’t give too much thought to that. He’s already gone around from being so pathetic that he’s sexy; you don’t need him to come full circle and go back to being utterly pathetic again. Look, you’ve drawn this out long enough; he should just stuff it in you before he shoots himself in the foot again.", parse);
	Text.NL();
	Text.Add("<i>“Wha…?”</i>", parse);
	Text.NL();
	Text.Add("Just stuff it in already!", parse);
	Text.NL();

	Sex.Vaginal(catboy, player);
	player.FuckVag(player.FirstVag(), catboy.FirstCock(), 3);
	catboy.Fuck(catboy.FirstCock(), 3);

	Text.Add("The snappiness finally gets to him, and he rushes to obey, stuffing your [vag] full of cat cock. The petals of your womanly flower bump against each soft, nubby barb as he stretches you wide, sad green eyes going wide with a mixture of awe and instinctual desire as your inner walls pulse and flex against his manhood.", parse);
	Text.NL();
	Text.Add("<i>“Ah! I think - I think I’m going to-”</i>", parse);
	Text.NL();
	Text.Add("No, he’s not going to. He’s going to pack it in and hold on for as long as he can. If he dares to blow his load before you give him the go-ahead, he’s going to regret it.", parse);
	Text.NL();
	Text.Add("<i>“I… I’ll try…”</i> The way his voice is trembling and eyes are crossed doesn’t inspire great confidence in his abilities.", parse);
	Text.NL();
	Text.Add("Do or do not. There is no try.", parse);
	Text.NL();
	Text.Add("He just mewls piteously and continues thrusting. You have to admit, there’s at least some potential there; the way his barbs caress at your folds, the way his fingers grip at your waist. It’s not as if he’s ugly or not well-endowed; if only he could find it in himself to be more assertive, a little more forceful instead of cringing all the time which frankly is a huge turn-off.", parse);
	Text.NL();
	Text.Add("Well, he just needs to grow a spine, damn it. If he’s going to get any pleasure out of this, he’s going to have to <i>work</i> for it. Even as you’re thinking this, he stops his thrusting for a moment, fingers tightening as he prepares to-", parse);
	Text.NL();
	Text.Add("No! Bad!", parse);
	Text.NL();
	Text.Add("The catboy’s body tenses again and he manages to fight back the rising tide, but by the looks of it, he won’t be able to hold the line much longer. One supposes it’s a miracle that he’s already lasted this long… but you’re going to push him to his limits.", parse);
	Text.NL();
	Text.Add("In and out. In and out. If there were a textbook example of a pity fuck, well, this is it. The catboy looks as if he’s enjoying himself, inasmuch as one can enjoy himself while being utterly terrified. You would liked to have enjoyed yourself a little more, but them’s the breaks, as they say.", parse);
	Text.NL();
	Text.Add("Unfortunately for the poor catboy, he can’t take it anymore. The entirety of his lithe frame shakes and shudders as he blows his load into you with a resounding yowl, balls visibly deflating in the process. With how much there is, the spunk quickly fills up your cunt, then forces its way into your womb. Squelching noises rise from your hips as the catboy’s body runs on automatic, pounding away with an intensity that’s most uncharacteristic of his lithe body.", parse);
	Text.NL();

	MaliceScoutsScenes.Catboy.Impregnate(player, catboy);

	Text.Add("<i>“Ah! Ah! Ah!”</i> He’s still going at it - even though the stream of seed has slowed, it’s a good minute or so before he finally finishes up, his body sagging with exhaustion. It certainly looks like he’s put everything he had into it; sweat sheens on his brow and drips down his body. Eventually, though, even he has to give up and withdraws from you with a wet, sucking sound.", parse);
	Text.NL();
	Text.Add("Well, he’s a man now. How does that make him feel?", parse);
	Text.NL();
	Text.Add("The catboy winces and rubs his temples; his ears twitch this way and that. <i>“A little dizzy.”</i>", parse);
	Text.NL();
	Text.Add("Aah, that happens sometimes. It’ll pass soon enough.", parse);
	Text.NL();
	Text.Add("<i>“Um, well.”</i> He looks down at his now-deflating cock, at the dribble of spunk oozing out from your [vag], and then at you. <i>“Thanks.”</i>", parse);
	Text.NL();
	Text.Add("He shouldn’t get used to this. Not everyone is going to be as nice as you are.", parse);
	Text.NL();
	Text.Add("<i>“Oh, don’t I know that.”</i> He mutters to himself.", parse);
	Text.NL();
	Text.Add("It would really help if he stood up for himself more… can he do that for you? He doesn’t need to start kicking asses and taking names all at once, but maybe he should start watching out for himself instead of letting others push him about all the time. He’d be a lot more sexy then, you can assure him of that.", parse);
	Text.NL();
	Text.Add("He perks up. <i>“I’ll do my best!”</i>", parse);
	Text.NL();
	Text.Add("Right, right. Now if he doesn’t mind, he needs to get lost for a bit?", parse);
	Text.NL();
	Text.Add("<i>“Um… not immediately!”</i>", parse);
	Text.NL();
	Text.Add("An admirable attempt, but he needs to be more forceful about it.", parse);
	Text.NL();
	Text.Add("<i>“No!”</i>", parse);
	Text.NL();
	Text.Add("<b>Much</b> better.", parse);
	Text.NL();
	parse.comp = party.Num() == 2 ? party.Get(1).name : "your companions";
	parse.c = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
	Text.Add("Business taken care of, the two of you part ways, and you[c] continue on your journey.", parse);
	Text.Flush();

	player.subDom.IncreaseStat(50, 1);

	Gui.NextPrompt();
};

MaliceScoutsScenes.Catboy.PetPlay = function(enc: any) {
	const player = GAME().player;
	const catboy = enc.catboy;
	const p1cock = player.BiggestCock();
	let parse: any = {

	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");

	Text.Clear();
	Text.Add("A smile crosses your face as an idea comes to mind. Yes… yes, that should do very nicely. With how pathetic the catboy is, you bet he’ll even like it. Acting all innocent, you step forward, crook a finger under the catboy’s chin and tell him to lose the clothes. After all, animals aren’t in the habit of wearing clothes, and you’re pretty sure he’s too much of a simpering sop to be anything but one.", parse);
	Text.NL();
	Text.Add("The catboy mage looks up at you, eyes wide with alarm. <i>“No! What do you mean? I-”</i>", parse);
	Text.NL();
	Text.Add("Animals don’t talk either, you remind him as you grab him by the collar of his cloak. And those who make too much noise are badly trained, and badly trained animals often are in dire need of… well, <i>correction</i>.", parse);
	Text.NL();
	Text.Add("He’s so pathetic, he’s not even fit to wield the smallest shred of dignity. Loose and baggy as they are, the catboy’s cloak and pants come off with ease; he tries to shy away, but his token resistance is soon defeated by you taking a step forward and batting his arms away.", parse);
	Text.NL();
	Text.Add("Bad! Bad kitty!", parse);
	Text.NL();
	Text.Add("The catboy flinches a little, but his submissive nature wins out in the end and he mewls pathetically, cringing as he folds his ears flat against his head. So much for the stereotypical devil-may-care feline attitude; this fine specimen will make someone a great pet. Grabbing his tunic, you pull it off with a flourish, leaving him as naked as the day he entered the world.", parse);
	Text.NL();
	Text.Add("Truth be told, he doesn’t actually <i>look</i> that bad - under his clothes, the catboy’s a fine, long-haired specimen, his fur as white as his large, floppy ears and fluffed up against the cold highland air. Most incongruous, though, is his slightly above-average shaft and balls - the former possibly a considerable nine inches when fully engorged with bumpy, nubby protrusions running down its length and clustered on its head. He squirms and flushes as he feels your gaze on his fur, clearly desperate to cover himself as you size him up.", parse);
	Text.NL();
	Text.Add("Time to get him properly tamed, then. The hallmark of a well-trained pet is being comfortable about familiar people, after all. Reaching up to the spot between the catboy’s large, floppy ears, you give the thick fur a good scratching, making sure to let your touch play generously with his ears. He starts to groan and purr, making happy little noises in the back of his throat; once you’re certain he’s well and truly out of it, you divert one of your hands downwards to cup his balls.", parse);
	Text.NL();
	Text.Add("Hmm. They’re certainly not minotaur-sized, but on the other hand they’re very palm-filling - almost large enough to spill over the edges of your hand. A twitch of movement nearby draws your attention, and your eyes are drawn to his dick to see it swell and stiffen with his growing arousal. The nubby protrusions, too, are engorging - although not as drastically as his shaft itself - the cartilaginous nubs hardening into something more approaching the traditional barbs of a cat-cock.", parse);
	Text.NL();
	Text.Add("Aww, does he like it?", parse);
	Text.NL();
	Text.Add("The catboy just mewls and looks at you with kitten-like eyes. Well, time to move on to the next stage. Grinning, you focus on your hand still on his head and gently but firmly start pushing downwards. He gets your intentions clear as day, and happily settles down on all fours like a proper pet cat should before giving you an affectionate nuzzle of his head and rubbing his body all about your [legs].", parse);
	Text.NL();
	Text.Add("Good kitty. Good, good kitty.", parse);
	Text.NL();
	Text.Add("He mewls happily and paws at you, eager to please.", parse);
	Text.NL();
	Text.Add("Time to move on, then. You’ll need a collar for your pet kitten, something to let others know he’s a proper pet and not some stray out in the woods. Turning your attention to the catboy’s discarded clothes, you spy the belt he’d been using to hold his baggy pants up - yes, this will do very nicely. You move over, pick it up, then return to your pet’s side and fashion the belt into a makeshift collar - loose enough so that he can breathe easily, but secure enough that he won’t be accidentally slipping out of it when you’re not looking. The metal buckle is a bit loose, and jingles against itself as it moves much like a bell would.", parse);
	Text.NL();
	Text.Add("Wonderful. It’s not the best, but it’ll do for a properly claimed pet. The catboy barely makes a fuss throughout the whole process, shying away a little at first but soon warming up to the notion as you pet him some more and make general noises of approval in his direction. With a final click, you secure the collar in place and note that makeshift as it is, it’s really very fetching on him.", parse);
	Text.NL();
	Text.Add("Now, since he’s been such a good kitten, would he like a treat?", parse);
	Text.NL();
	Text.Add("An enthusiastic nod, followed by two more.", parse);
	Text.NL();
	Text.Add("Right. He’ll have to be trained to take it properly, though. First, he’ll have to learn some self-restraint… with that thought in mind, you quickly divest yourself of your [botarmor], letting your", parse);
	if (player.FirstCock() && player.FirstVag()) {
		Text.Add(" mixed genitalia enjoy the cool mountain breeze as they’re exposed to the elements", parse);
	} else if (player.FirstVag()) {
		Text.Add(" juicy pussy wink at him as fabric falls away to reveal your womanhood to the world", parse);
 } else if (player.FirstCock()) {
		Text.Add(" shaft[s] ", parse);
		if (player.HasBalls()) {
			Text.Add("and balls ", parse);
		}
		parse.their = (player.NumCocks() > 1 || player.HasBalls()) ? "their" : "its";
		Text.Add("hang out and flop in the cool mountain air, finally released from [their] cramped confines", parse);
	}
	Text.Add(".", parse);
	Text.NL();

	const scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("At the sight of your womanly flower, the catboy’s eyes go wide to sickeningly sweet proportions. The entirety of his body trembles with repressed need - he’s clearly fighting it, trying to be an obedient, good kitty in the face of your commands, but it’s a losing battle that he’s waging against his treacherous body.", parse);
		Text.NL();
		Text.Add("No! Bad kitten! He’s not going to release until you give him the go-ahead!", parse);
		Text.NL();
		Text.Add("The catboy meows piteously, but is unable to stem the rising tide that’s gathering within him. Already stiff from before, you see his cat-cock throb between his legs, looking ever bigger than before - even the barbs are fully extruded, and the slightest mountain breeze against them sends more blood rushing to his manhood.", parse);
		Text.NL();
		Text.Add("A single dollop of pre wells up on the catboy’s cockhead; he mewls again, feeling it thin out into a strand and drip onto the grass underneath him.", parse);
		Text.NL();
		Text.Add("If he dares…", parse);
		Text.NL();
		Text.Add("He makes the mistake of looking up at you again - right into the glistening lips of your cunt, ", parse);
		if (player.FirstCock()) {
			Text.Add("nestled underneath your [cocks]", parse);
		} else {
			Text.Add("not six inches from his face", parse);
		}
		Text.Add(" and smelling heavily of sex. That’s it - unable to hold himself back any longer, the catboy flops back onto his rump and instinctively thrusts his hips forward as spooge bursts from his shaft in great gouts, his balls shrinking slightly as they empty their load to who-cares-where. Most of it lands on himself, soiling his skin and fur, but some manages to get on your [feet].", parse);
		Text.NL();
		Text.Add("Bad kitten! Now look at what he’s done - that’s a right proper mess he’s made here, and who’s going to clean it up?", parse);
		Text.NL();
		Text.Add("The catboy meows and shrinks back on himself, cringing.", parse);
		Text.NL();
		Text.Add("Him, that’s who! He can start with you, then clean himself up; that’ll be adequate punishment for such a bad kitty. Or does he need you get out the squirt bottle? Actually, it’s highly unlikely that you actually <i>have</i> a squirt bottle, but he’s just a silly kitten; he doesn’t know that.", parse);
		Text.NL();
		Text.Add("At the mere mention of a squirt bottle, your kitten goes completely prone on the floor, covering his eyes with his hands as he lands in his own puddle of cum with a soft squelch. Sighing, you step up, give him a little pat between the ears, then instruct him to hurry up and get to cleaning if he wants to make things right and have a chance at being a good kitty again.", parse);
		Text.NL();
		Text.Add("The mere suggestion is enough to get him springing into action once more. Getting up to all fours, your kitten rubs himself against your [legs], giving you a couple of nuzzles for good measure, then starts lapping up the messy spooge like milk from a saucer. Now that’s not so bad - the feel of your pussy’s damp, warm and rough tongue moving rhythmically would be so much better against your pussy - but you’ll have to exhibit a tad of self-restraint on your part if you’re going to teach him that important lesson.", parse);
		Text.NL();
		Text.Add("Before too long, he’s done, and then he starts on himself, bending his body in ways that can only be attributed to a healthy dose of feline flexibility. With that much seed, though, and how he’s gotten it all over himself lying down in that puddle of his own making, it’s going to take some time for him to be done, more than you have on hand. Besides, even if he’s trying to make amends now, he‘s been a bad kitten, and you’re not sure if he still deserves that treat any more.", parse);
		Text.NL();
		Text.Add("…Hah, interesting. Given his longer than normal cock and prodigious flexibility, you catch your kitten sucking himself off - barely so, with only the tip of his head fitting in between his lips, but he technically still <i>is</i> giving himself a blowjob. He looks up at you guiltily when he feels your gaze upon him, but you decide to let it slide - after all, you have to suppose he is cleaning himself up in a fashion.", parse);
		Text.NL();
		Text.Add("Still, you don’t have to be idle here. Since your kitten’s all hunched over sucking himself off, that leaves his tailhole open to attack - and that’s what you do, swiftly stepping around him, pulling his tail up, and jabbing a finger right into that tight, virgin pucker. Your pretty kitty, mewls in surprise, eyes going wide with shock, and almost chokes on his own barbed cat-cock.", parse);
		Text.NL();
		Text.Add("Hehe. You can tell he likes it, though, judging by the way he wiggles his body in response to you flexing your finger. Inch by inch, you sink your digit deeper into his warm tailhole, violating it and forcing it to take in something which it’s never had the pleasure of taking before. Deeper and deeper you go, until every last joint is firmly sequestered in his butt - and then you start trying to find his prostate.", parse);
		Text.NL();
		Text.Add("It doesn’t take you long for you to hit gold - the reaction from your kitten is obvious as he tries to hold back the second surge of cum that he feels welling up in his balls. Tears spring into his large, clear eyes as he realizes that he’s going to be a bad kitty again, but you give him a quick pat between the ears with your free hand and tell him that you’re giving him permission to spill his seed if need be.", parse);
		Text.NL();
		Text.Add("He seems to enjoy it a lot more after that, almost as much as you do - you can feel his body trembling as it tries to adjust to this strange, alien pleasure you’re giving him, even as he continues to suck himself off. Judging by the familiarity with which he’s going through the motions, it’s clear that this isn’t the first time he’s given himself a blowjob, and you can’t help but wonder if this is how he usually gets himself off when you’re not around to watch him…", parse);
		Text.NL();
		Text.Add("Well, that’s a thought for later. Here and now, your business is having a good time playing with your cute, subby pet, and that’s just what you go ahead and do with great relish. Feeling his cum surge again, your kitten closes his eyes and clamps his lips down tight around his barbed cocktip. His balls churn again, and then spurts of white seed are gushing from his shaft again.", parse);
		Text.NL();
		Text.Add("Try as he might, your feline pet can’t help but cough and splutter; his shaft slips free from his mouth and he struggles to contain it. That, too, is a fruitless endeavor, and before long your kitten is looking up at you again with forlorn eyes that peer through the creamy white facial he’s given himself. For a second load in so short a time, that’s quite the production he’s got going over there.", parse);
		Text.NL();
		Text.Add("Sensing that some consolation is in order, you give your pet a few more ear scritches and let him know that he hasn’t been a bad kitty this time round. Not that he’s been a <i>good</i> kitten, either, but he hasn’t been bad because what just happened wasn’t his fault. Also, seeing him like this has put you in a marginally better mood.", parse);
		Text.NL();
		Text.Add("He just mewls again and paws at his face with his hands, trying to wipe off the worst of the mess. Sheesh, even at this point, he can’t help but appear pathetic, can he? It’s almost as if it’s baked into his nature.", parse);
		Text.NL();
		Text.Add("Very well, then - you’ll let him off this time. No more freebies from you, though, so he shouldn’t get used to it!", parse);
		Text.NL();
		Text.Add("Your pet looks at you hopefully, silently promising that he won’t.", parse);

		player.AddLustFraction(0.4);
		player.AddSexExp(2);
	}, 3.0, function() { return player.FirstVag(); });
	scenes.AddEnc(function() {
		Text.Add("Eyeing your [cocks], the catboy ", parse);
		if (p1cock.Len() >= 30) {
			Text.Add("shudders a little at the sight of your massive cock[s]. He swallows hard and shies away a little, clearly intimidated by the thought of what you intend.", parse);
			Text.NL();
			Text.Add("He hadn’t counted on this? Well, that’s too bad for him. Yes indeed, this is a <i>big</i> treat, and you’re going to require that he eat it <i>all</i> up. Kitties who waste even the smallest portions of their treats are bad kitties, and bad kitties don’t just not get treats in the future, but they also need to be punished.", parse);
			Text.NL();
			Text.Add("He doesn’t want to be punished, does he?", parse);
			if (player.NumCocks() > 1) {
				Text.Add(" You imperiously motion to the biggest of your shafts.", parse);
			}
			Text.NL();
			Text.Add("Your kitten meows and shakes his head vigorously, the makeshift bell on his belt-collar clattering away. Yes, he knows the score. Gingerly, almost timidly, he gets off all fours and kneels in front of you, bowing his head submissively. You waggle your massive treat in his face for a few seconds, getting his attention, and smile as he takes it mid-length in both hands and opens his mouth wide.", parse);
			Text.NL();
			Text.Add("That’s right. That’s a good kitty. Now, open wide and say ‘ah’.", parse);
			Text.NL();
			Text.Add("He obeys unthinkingly, the soft tones of your voice lulling him into a sense of security. Once that cute little mouth of his is open, you thrust with everything you’ve got, slip out of his grasp, and plunge as deep into his throat as he’s capable of accommodating. The poor kitten’s eyes go wide as his breath is suddenly cut off, making piteous, strangled noises in the back of his throat as he struggles for breath, but you remain resolute in your actions; he needs to be properly trained if he’ll even make a good pet.", parse);
			if (player.NumCocks() > 1) {
				Text.Add(" Your other dick[s2] grind[notS2] against his forehead, reminding the effeminate pussy that this’ll end messily for him, no matter how good he is at swallowing.", parse);
			}
			Text.NL();

			Sex.Blowjob(catboy, player);
			catboy.FuckOral(catboy.Mouth(), player.FirstCock(), 2);
			player.Fuck(player.FirstCock(), 2);

			Text.Add("As you’d expected, your kitten gets over his surprise quickly enough, wheezing and spluttering several times but eventually settling into a rhythm that allows him to get some measure of his breath back while pleasuring you.", parse);
		} else if (p1cock.Len() >= 18) {
			Text.Add("seems a little unsure at the sheer sight of your stupendous shaft[s], but gets over his uncertainties soon enough and closes in. You take the moment to praise him for being such a brave kitty, ready to face a task that he very well knows might be daunting, and he practically blushes with pride.", parse);
			Text.NL();
			Text.Add("Aww, is he unaccustomed to being praised? Well, he’ll get a lot more of it if he continues proving himself to be a good, obedient kitty. Now, won’t he please go ahead and get his treat?", parse);
			Text.NL();
			Text.Add("Your pretty kitten purrs delightedly and grabs hold of[oneof] your [cocks] in both hands, closing his eyes in delight as he slides his lips over your [cockTip]. You feel it, too, waves of pleasure radiating outwards like ripples on a still pond surface. Deeper and deeper, he takes you into his mouth, breath hot against your man-meat, and it’s only after you bump against the back of his throat that he begins scraping at the underside of your shaft with his rough, warm tongue.", parse);
			if (player.NumCocks() > 1) {
				Text.Add(" Feeling left out, your other cock[s2] grind[notS2] against the feline’s upturned face, dribbling [itsTheir2] sticky pre all over his soft fur.", parse);
			}
			Text.NL();

			Sex.Blowjob(catboy, player);
			catboy.FuckOral(catboy.Mouth(), player.FirstCock(), 2);
			player.Fuck(player.FirstCock(), 2);

			Text.Add("Mm, that feels good, doesn’t it? You were already hard before, but faced with such a tender touch, the entirety of your length feels full to bursting, hard as diamonds - or at least, it <i>feels</i> that way.", parse);
			Text.NL();
			Text.Add("So, does he like his treat? Is it a yummy one?", parse);
			Text.NL();
			Text.Add("Your kitten nods vigorously, the warm and wet insides of his mouth shifting against your shaft and making you moan with delight. Well, he should know that you’re enjoying giving him this treat as much as he’s enjoying having it, so he should be an obedient kitty as much as possible in the future, yes?", parse);
			Text.NL();
			Text.Add("He purrs, and the vibrations carry through his flesh, up your rod and into your groin. Ah, the simple pleasures of life.", parse);
		} else {
			Text.Add("opens his mouth eagerly and without hesitation, revealing its warm, pink insides and that little sandpapery tongue of his. Mmm… you can practically feel it against your [cock] now, wrapping lovingly about the girth of[oneof] your man-meat[s] while you’re stroked to fullness…", parse);
			Text.NL();
			Text.Add("The lewd thoughts flood into your mind unbidden, coming fast and hard, and you take a moment to take a deep breath and let it all out in a happy sigh. It’s not as if your kitten’s going anywhere, anyway - he’s staring enraptured at your prick[s], watching the meaty member[s] bob up and down in time with your heartbeat. You can see him just itching to bat at[oneof] [itThem] like some kind of plaything, but he’s successfully resisting the urge so far. What a strong-willed pet you have - maybe he deserves a <i>double</i> helping of kitty treats as a reward…", parse);
			Text.NL();
			parse.it = player.NumCocks() > 1 ? "one" : "it";
			Text.Add("Wasting no more time, you thrust your [cocks] at the catboy, practically poking him in the face with [itThem] a few times before he manages to catch [it] in both hands and guide it into his waiting maw. Your kitten’s mouth is as warm and wet as the inside of any other hole, and his tongue as divine as you’d envisioned it to be.", parse);
			if (player.NumCocks() > 1) {
				Text.Add(" Your other member[s2] grind[notS2] against his upturned face, reminding him that there’s more treats to go around.", parse);
			}
			Text.NL();

			Sex.Blowjob(catboy, player);
			catboy.FuckOral(catboy.Mouth(), player.FirstCock(), 2);
			player.Fuck(player.FirstCock(), 2);

			Text.Add("Sure, he’s lacking in experience, but a desperate, almost childish eagerness to please manages to make up for that somewhat. Purring deeply in the back of his throat, your kitty slides your shaft in and out of his mouth a few times, leaving it glistening with his spit before commencing to lick his delicious kitty treat like a large lollipop.", parse);
			Text.NL();
			Text.Add("Now, there’s no need to be conservative with enjoying his just reward; all he needs to do is continue being a good kitty, and he’ll get more treats just like this one. He should eat up with gusto, you tell your pet as you ruffle his fur and ears. It really <i>does</i> feel very good when you do that…", parse);
			Text.NL();
			Text.Add("Obediently, he takes a deep breath, then slides his head and body forward to swallow the entirety of your [cock] up to the base, suppressing his gag reflex as your [cockTip] hits the back of his throat. Now <i>that’s</i> a trick!", parse);
		}
		Text.NL();
		Text.Add("This goes on for a little while longer as your pet continues to worship you, licking and sucking away, the natural movements of his mouth seemingly in time with the throbbing of your shaft[s]. Pleasured in such a fashion, it’s not long before you begin feeling the warning tingles of impending orgasm, and you smile at the thought of your pet discovering the creamy center of his delectable kitty treat.", parse);
		if (player.NumCocks() > 1) {
			Text.Add(" The pre leaking from your unused cock[s2] might give him a hint.", parse);
		}
		Text.NL();
		Text.Add("With the catboy’s rough, sandpapery tongue working away, you blow your load in no time at all - it happens so quickly that you’re surprised yourself. Your kitten’s eyes flick open in surprise as the first thick rope of seed explodes in his mouth; reeling instinctively, he lets go of your shaft, coughing and spluttering as you empty the rest of your tank straight onto his face.", parse);
		if (player.NumCocks() > 1) {
			Text.Add(" Not to be left out, your other dick[s2] [isAre2] quick to add [itsTheir2] generous addition[s2] to his already tasty treat.", parse);
		}
		Text.NL();

		const cum = player.OrgasmCum();

		if (cum > 7) {
			Text.Add("Try as you might to hold back, you can’t slow, let alone stifle the deluge of thick, gooey cum that’s built up in ", parse);
			if (player.HasBalls()) {
				Text.Add("your balls", parse);
			} else {
				Text.Add("you", parse);
			}
			Text.Add(". Throwing your head back from the sheer force of it all, you let out a cry as your sperm bursts free of you and gushes all over the catboy. Your poor kitty has barely enough time to try and shield himself ineffectually with an arm before the barrage of spunk hits him.", parse);
			Text.NL();
			Text.Add("And a deluge it is, a veritable flood that sweeps over the catboy and threatens to carry him off his feet and away into the distance - or at least, that’s what it <i>feels</i> like. Once you’ve started, you can scarcely stop, and the most you manage to hear from your pet is a few plaintive meows as globs upon globs of thick sperm land on his skin and fur, horribly despoiling his once-pristine vestige even further.", parse);
			Text.NL();
			Text.Add("On his part, your pet kitten doesn’t seem to care - if anything, he seems equally curious and amused by the thick coat of seed which you’re covering him with. Once he gets over his initial fear and shyness of this new situation, he quickly takes to being bathed in cum like a duck to water; he happily splashes around in the thick, sticky puddles you’re creating on the ground and rubbing his paws all over his body, smearing it across himself as if it was some kind of lotion. Come to think of it, it probably is…", parse);
			Text.NL();
			Text.Add("Nevertheless, that’s so adorably cute; there’re few things more endearing in life than a cute kitten enjoying himself for real. By the time you’re done, the catboy looks like a dribbly candle - an unevenly-shaped pillar of white with wide eyes and the faint outline of large, floppy ears.", parse);
		} else if (cum > 4) {
			Text.Add("Your pet instinctively averts his gaze, turning his cheek towards you - but alas, it does him little good given the force of the flow that erupts from your [cocks]. It’s got all the volume and power of a fire hose, but a lot thicker and weightier than one would expect of a fire hose’s usual fare - the first ropes of spunk to hit your kitten do so with gusto, staggering him and nearly knocking him over.", parse);
			Text.NL();
			Text.Add("Well, if that isn’t a show to watch! Not that you could’ve stopped if you wanted to - with so much sperm pent up in you, rippling waves of satiation and satisfaction course through your body as ", parse);
			if (player.HasBalls()) {
				Text.Add("your [balls] empty themselves with shocking speed", parse);
			} else {
				Text.Add("you spew string after string of virile seed", parse);
			}
			Text.Add(" onto your poor pet kitty, making him mewl and whimper in shock and surprise as he’s momentarily blinded by having his face plastered with sperm.", parse);
			Text.NL();
			Text.Add("Oh, come now - why does he have to be so fussy about it? It’s not as if you’ve turned the squirt bottle on him, have you?", parse);
			Text.NL();
			Text.Add("The catboy just meows again as spooge runs off his face, dripping off his chin and running down his neck to stain the rest of his body. Grabbing the length of[oneof] your [cocks] with both hands, you pump back and forth desperately, wringing out every last drop of jism you have in you and sending it right onto the catboy’s face. There’s little left of his features now save for the vague outline of his head and above all odds, his ears, two vaguely triangular spooge-covered points jutting out from the top of his creamy head.", parse);
			Text.NL();
			Text.Add("At length, your ejaculation does begin to abate somewhat, but not before your pretty kitty has been thoroughly despoiled, his skin and fur covered with a glistening layer of cum that stretches from head to toe. It’s a bit uneven in parts, but that’s only to be expected - it’s not as if you’ve managed enough production to give him an even coating, alas.", parse);
			Text.NL();
			Text.Add("Finally managing to open one eye and look about him, your pet kitten meows at you curiously, pawing at you; you reach down and give him a reassuring pat on the head. There, there.", parse);
		} else {
			Text.Add("While your production isn’t as high as you’d hoped it would be, you nevertheless manage to come up with enough ejaculate to give your pet kitty a hearty faceful of delicious cream. He certainly seems to take an instant liking to it, his small, pink tongue darting out of his mouth and touching his lips in an experimental taste before coming out for more.", parse);
			Text.NL();
			Text.Add("Well, let him have all he wants - there’s still more where that came from.", parse);
			Text.NL();
			Text.Add("Since he’s not sucking you off any more, it’s up to you to bring yourself the rest of the way and you do just that, grabbing[oneof] your rock-solid [cocks] with both hands and pumping up and down its length furiously. It’s like this that you spend the next few moments, playing your manhood like a fiddle in a bid to wring out every last drop of cum out from you and onto your pet kitten’s face. Your breathing becomes short and labored as you ride out your orgasm, feeling the workings of your body shift and ebb. Seeing what you’re up to, the catboy leans forward and begins licking your [cockTip] once more, catching stray strands and droplets of creamy seed on his dainty little tongue, purring all the while.", parse);
			Text.NL();
			Text.Add("What a good little kitty he is, to sense your need like that and volunteer his help without you needing to ask! Surely he deserves a second helping of delectable creamy kitty treats - and right on cue, you feel a huge load coming down the pipe!", parse);
			Text.NL();
			Text.Add("Your pet kitty must have sensed it too, for he meows happily and wastes no time in locking his lips with your [cockTip], determined to not waste the treat this time. Such a good kitty - yes, yes, he deserves everything that’s coming to him!", parse);
			Text.NL();
			Text.Add("With an air-rending groan, you shake and shudder a second time, blasting gob after gob of creamy feline treat into the catboy’s mouth. It’s probably nowhere as thick and nutritious as your first load, but that’s probably for the best given your pet’s inexperience in receiving goodies like these. ", parse);
			if (player.NumCocks() > 1) {
				Text.Add("Your other cock[s2] add[notS2] [itsTheir2] load to [itsTheir2] previous mess on his innocent face, soiling his fur in your seed. ", parse);
			}
			Text.Add("You see his cheeks balloon outwards as he struggles to take all your sperm in without wasting even a single drop of his precious kitty treat, swallowing furiously, and give him yet another pat on his cum-smeared head, ruffling his hair and ears as you praise your precious little pet for trying so hard.", parse);
			Text.NL();
			Text.Add("Finishing the last of his treat, the catboy pulls away from your manhood with an audible pop and smack of his lips, wiping away a strand of seed with the back of his hand. ", parse);
			if (player.NumCocks() > 1) {
				Text.Add("Taking meticulous care to not waste your sticky gift, the catboy cleans up the load you deposited on him and eagerly slurps them up, starved for more of your precious cream. ", parse);
			}
			Text.Add("He looks up at you with wide, adoring eyes and meows, closing them in pure bliss and rubbing his head against your crotch.", parse);
			Text.NL();
			Text.Add("Aww… isn’t that so cute.", parse);
		}

		Text.NL();
		Text.Add("Eventually, your feline pet gets himself cleaned up a bit - from the spunk dripping off him onto the ground, if nothing else. Looking at the facial - and a bit more - that you’ve just given him, you smile at your kitten approvingly and tell him what a delightful pet he’s been.", parse);
		Text.NL();
		Text.Add("He purrs and bows his head submissively, exposing enough of his neck such that you can bestow scritches unto him. Between the makeshift collar you’ve given him and all the spooge that coats his exterior, it’s not an easy task, but you manage it nonetheless - he’s earned as much for his efforts at being a good kitten.", parse);
	}, 1.0, function() { return player.FirstCock(); });
	scenes.Get();

	Text.NL();
	Text.Add("All right, then - that’s enough play for today. You’ve had a bit of fun, but you’ve got other things that need doing and have to be on your way. Your pet whimpers a little, sad to see you go, but you pull on your [botarmor] and tell him firmly that he can wait for you if he wants, but he shouldn’t expect you to be back that soon.", parse);
	Text.NL();
	Text.Add("He mewls unhappily, but doesn’t try to follow when you fold up his clothes and place them neatly by the side of the road. After all, you’ve trained him better than that, and he knows he’d be a bad kitty if he disobeyed.", parse);
	Text.NL();
	Text.Add("Throwing one last look over your shoulder as you saunter back down the road, the parting sight you have of your pet is that of him sitting on his haunches, staring at you forlornly. You swallow hard - now, you can’t just take in every stray who looks like he might make a good pet - you’d be swamped in cats before long!", parse);
	Text.Flush();

	Gui.NextPrompt();
};

MaliceScoutsScenes.Catboy.Petting = function(enc: any) {
	const player = GAME().player;
	let parse: any = {

	};
	parse = player.ParserTags(parse);

	Text.Clear();
	Text.Add("An idea comes into your mind, and you hold out your hands as you advance upon the catboy mage, waggling your fingers suggestively. The poor bastard’s eyes widen in fear as you close the distance between the two of you, grinning like a madman.", parse);
	Text.NL();
	Text.Add("<i>“W-what do you intend?”</i>", parse);
	Text.NL();
	Text.Add("Oh, nothing much. But those large, white ears of his are so fuzzy, you can’t help but want to give them a good petting.", parse);
	Text.NL();
	Text.Add("Before the poor schlub can react, you’ve gone and thrown off his hood and stuck a hand atop his head, fingers running through his grayish-white hair and finding those large, fuzzy ears of his. Mm… they’re every bit as nice and pleasant to the touch as they look, and just being in contact with them makes you feel all warm and good inside.", parse);
	Text.NL();
	Text.Add("The catboy instantly breaks into a cold sweat at your touch, his voice going as weak as his knees. You feel him give a little push against your hand, but then he rapidly catches himself and draws away. <i>“H-hey! S-stop it!”</i>", parse);
	Text.NL();
	Text.Add("Now, why should you? If he didn’t want them to be fondled, then they shouldn’t be so large. Considering that he was attempting to truss you up with magical bonds and rape you while you were helpless, he’s getting off lightly with a bit of ear-scratching, isn’t he? One way or the other, he’s not in any position to be making demands of you.", parse);
	Text.NL();
	Text.Add("The poor bastard looks down at his sandaled feet. <i>“Well, yeah…”</i>", parse);
	Text.NL();
	Text.Add("Then that settles things. If he doesn’t like it that much, maybe he should lie back and think of Eden?", parse);
	Text.NL();
	Text.Add("The catboy gives a plaintive whimper-meow and hangs his head. You’re not going to drag this any further, and take the opportunity to thrust your fingers straight between his sprightly ears. Slowly, you begin to rub large, lazy circles through his hair and fur, eliciting pitiful mewls from the catboy mage; he resists for a few seconds, and then is unable to help himself as he presses himself against your palm, eyes fluttering closed as he begs for more. Sure, he might be a mage, but there’s no chance he’ll be casting any spells in his current euphoric state of mind.", parse);
	Text.NL();
	Text.Add("Heh. Whether by accident or design, it seems like you’ve found this guy’s weakness. Smirking, you increase the vigor of your stroking and rubbing, feeling the catboy’s fear and unhappiness dissolve away under your increased attentions. It’s clear from the way his knees are shaking that he won’t be able to stay standing much longer, so you place your hand on his shoulder and guide him to the ground. He’s more than willing to obey, sprawling on the soft grass with his belly up and tail wrapped about one thigh, his entire being practically putty in your hands so long as you keep on giving him more and more of those exquisite scritches.", parse);
	Text.NL();
	Text.Add("What a poor bastard. With a weakness like this, it’s little wonder that he’s being mercilessly teased for being a pushover; to be honest, he should embrace his nature, not defy it. You lavish some more attention on the catboy’s ears, both hands working in tandem to cover every inch of those pointy, fluffy peaks before turning in and about to tease at the bushy tufts of fur in their insides.", parse);
	Text.NL();
	Text.Add("That certainly hits the spot. A desperate, needy caterwaul escapes the catboy mage’s lips as his slight form quakes with repressed pleasure; his breath comes hot and heavy even as you notice that his formerly baggy pants are tenting, the fabric growing tight with evidence of his mounting arousal. As you watch, the very peak of the tent grows ever higher as something strains within…", parse);
	Text.NL();
	Text.Add("Well, there’s no reason you shouldn’t let that all out. Pausing your scritching for a moment, you reach for the catboy’s pants with a hand and yank them down hard to his knees, revealing a thick and throbbing cat-cock complete with spines along its length. It’s not <i>huge</i>, but is nevertheless large enough to look out of place on the catboy mage’s slight, effeminate frame. Thick, pulsating veins wrap about its surface, joining one feline barb to another - just as your thumb brushes against the catboy’s delicate ear-tufts, he shudders from head to toe and looses a small squirt of pre from the tip of his maleness.", parse);
	Text.NL();
	Text.Add("<i>“There’s a good kitty,”</i> you whisper to the catboy as focus your attentions on his ear-tufts, rubbing the fine hairs between thumb and forefinger. <i>“There’s a very, very good kitty.”</i>", parse);
	Text.NL();
	Text.Add("He yowls again, his member twitching as it strains against its fleshy confines, trying to get even bigger than what its physical form will allow. Heh, it’s just like the rest of him - a grand spirit constrained by the body it inhabits… as you watch, pre starts oozing down its length, glistening all the while…", parse);
	Text.Flush();

	// [Handjob][Tease]
	const options = [];
	options.push({nameStr : "Handjob",
		tooltip : Text.Parse("Why not give the poor pent-up kitty a hand?", parse),
		enabled : true,
		func() {
			Text.Clear();
			Text.Add("Hey, you may not have made him a man like he wanted, but you’ve still made him feel very, very good. Leaving one hand to continue teasing and prodding at the catboy’s ears, you seize his considerable maleness in the other, stroking him off with an up-and-down pumping motion. The cartilaginous barbs along his shaft push into your palms, every bit as hard as the rest of his cock; you tighten your grip, feeling them dig into your flesh.", parse);
			Text.NL();
			Text.Add("Oooh…", parse);
			Text.NL();
			Text.Add("Greedily, you brush the heel of your palm against one of the barbs, while taking another into your fingers and teasing it much like your other hand is doing with the catboy’s ear-fluff. He whimpers and puts up a last smidgen of resistance, feebly trying to bat your [hand]s away while his body betrays him and his hips start pushing against your fingers.", parse);
			Text.NL();
			Text.Add("<i>“No… don’t do this to me…”</i>", parse);
			Text.NL();
			Text.Add("Your only answer to that is to pump away at his shaft with renewed vigor, a motion that has him go practically catatonic with delight, his little pink tongue hanging out of the corner of his mouth, his eyes glazed over and unfocused. Wrapped about his member, your hand distinctly picks up on the increasingly powerful throbbing of the virile and desperate cat-cock in its grasp.", parse);
			Text.NL();
			Text.Add("Dividing your attention between the catboy’s ears and his shaft, you begin to stroke him off in earnest; your effeminate friend responds instinctively, mirroring each tug on his manhood with a thrust of his hips. The catboy pants and mewls, his chest heaving and straining with each gasp and moan, need and desperation welling up as his cock continues to strain at your fingers. Soon, your hand is soaked with feline seed as he grows dangerously close to release, brain completely scrambled by the conflicting sensations of comfort and arousal coming from both ends of his body.", parse);
			Text.NL();
			Text.Add("<i>“Now, now,”</i> you whisper, giving the catboy one final brush of his head and ears. <i>“There’s no need to get all excited.”</i>", parse);
			Text.NL();
			Text.Add("That tiny bit of stimulation is enough to push the poor catboy over the brink of ecstasy. With a mewling yelp, a thick stream of spunk spews from his manhood and arcs through the air in a slimy spray, coming to rest in a sticky shower a good three or four feet away from him. Spirits, you can swear that his nutsack visibly deflates with the release - which really isn’t that surprising, considering how little release he must get in the course of his daily life.", parse);
			Text.NL();
			parse.manwoman = player.mfTrue("man", "woman");
			Text.Add("Undeterred by the literally sticky situation that you’re faced with, you grab the catboy’s shaft once more and pump away furiously like a [manwoman] possessed, squelching sounds rising from your fingers as you work away diligently. The poor bastard writhes on the ground as he continues to blow his load all over the grass and your hands; the flow continues unabated for a good fraction of a minute before it begins to show signs of dying down.", parse);
			Text.NL();
			Text.Add("All good things must eventually come to an end, though, and the catboy’s torrential ejaculation slowly dies down to a dribble that runs down his maleness and onto your fingers. You clench your fist about his slowly softening shaft, feeling the thick spunk squish and burble, then wipe your digits clean on his clothes. The catboy himself is utterly drained, ears twisting this way and that as he pants away with the occasional groan of exhaustion.", parse);
			Text.NL();
			player.AddSexExp(2);
			Gui.PrintDefaultOptions();
		},
	});
	options.push({nameStr : "Tease",
		tooltip : Text.Parse("That, from just an ear rub? Let’s find out just how much of a hair-trigger he is...", parse),
		enabled : true,
		func() {
			Text.Clear();
			Text.Add("Teasingly, you tell the catboy that he really is a hair-trigger - all this from just an ear rub?", parse);
			Text.NL();
			Text.Add("<i>“C-can’t help it!”</i> he manages to get out. <i>“P-please, don’t-”</i>", parse);
			Text.NL();
			Text.Add("Don’t what? Do this?", parse);
			Text.NL();
			Text.Add("<i>“A-aah!”</i> the feline yelps, arching his back as you pinch his sensitive ears. The magician’s staff throbs erratically in response to your teasing, sending a gout of sticky white pre that mats his snowy fur.", parse);
			Text.NL();
			Text.Add("<i>“No, d-don’t… don’t...”</i> he gasps. The kitty squirms helplessly as you keep relentlessly petting him without regards for his demands. He’s just so cuddly and cute! The mage has his eyes almost closed, gaze drawn into some heavenly realm not allowed mere mortals. You chuckle as he begins purring despite himself, fully giving in to his weakness.", parse);
			Text.NL();
			Text.Add("<i>“Don’t… stop,”</i> he mewls pleadingly. There’s a good, honest pussy!", parse);
			Text.NL();
			Text.Add("Spurred by the now placated feline’s squirming, you work up his shirt to expose his belly, covered in soft white fur. He’s slender, hardly a hint of muscle visible. Once again, you’re struck by the wonders of magic - that such power could be wielded by someone with as delicate a frame as this!", parse);
			Text.NL();
			Text.Add("As you sink your [hand] into the fur on his tummy, you are rewarded with the biggest gasp yet. The catboy arches his back, throbbing kitty-cock hard as a rock. This guy is just full of weak spots!", parse);
			Text.NL();
			Text.Add("You hum to yourself while you pet your kitty, keeping yourself amused by alternating your teasing between his sensitive ears and vulnerable stomach. The snowy feline is growing more and more excited by the minute, purring and squirming in your grasp. Finally, your gentle torture becomes too much for him and he cries out, hips thrusting impotently at the air as his seed sprays all over himself. You quickly retract your belly-rubber, not wishing a shower of spunk all over you.", parse);
			Text.NL();
			Text.Add("The catboy is less lucky in this regard as most of his own fountaining seed lands right back down on him, splattering all over his fur and leaving him a sticky mess. After quite an impressive climax for someone his size, the shuddering kitty simmers down, collapsing in a heap.", parse);
			Text.NL();
			player.AddSexExp(1);
			Gui.PrintDefaultOptions();
		},
	});

	Gui.Callstack.push(function() {
		Text.Add("See? That wasn’t so bad after all. He may not have become a man in the sense that he might have put it, but he most certainly had a bit of fun, didn’t he?", parse);
		Text.NL();
		Text.Add("The catboy mewls and flicks his tail.", parse);
		Text.NL();
		Text.Add("Now there’s a good kitty. You tousle his hair, and his still-twitching dick makes the extra effort to let loose a few more spurts of cum before giving up completely and flopping down to join the rest of him.", parse);
		Text.NL();
		Text.Add("Looking good, then. With how peaceful this windy hilltop is, it’s probably safe to leave this mewling, drooling wreck as he is. Nothing’s probably going to come across him… and if something <i>does</i>, well, maybe he’ll actually get his chance to learn to be a man.", parse);
		Text.NL();
		Text.Add("With that, you get yourself cleaned up and prepare to go on your way.", parse);
		Text.Flush();

		Gui.NextPrompt();
	});

	Gui.SetButtonsFromList(options, false, null);
};

MaliceScoutsScenes.Catboy.LossPrompt = function() {
	const player = GAME().player;
	const party: Party = GAME().party;
	SetGameState(GameState.Event, Gui);
	Text.Clear();

	// this = encounter
	const enc = this;

	const parse: any = {

	};

	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("Slight as the catboy may be, the raw destructive force of his magics is too much for you to you bear. Bruised and battered from sheer force, your body finally gives up the ghost and buckles under its own weight, sending you toppling to the ground. Before you can recover, more tendrils of that same magical mist wind about your limbs, quickly solidifying and trussing you up like a pig in a poke.", parse);
		if (party.Num() > 1) {
			if (party.Num() > 2) {
				parse.comp    = "your companions";
				parse.notS    = "";
				parse.heshe   = "they";
				parse.hasHave = "have";
			} else {
				const p1 = party.Get(1);
				parse.comp    = p1.name;
				parse.notS    = "s";
				parse.heshe   = p1.heshe();
				parse.hasHave = "has";
			}
			Text.Add(" A quick glance at [comp] reveal[notS] that [heshe] [hasHave] pretty much befallen the same fate, restrained with magical bonds identical to the ones which you now bear.", parse);
		}
		Text.NL();
		Text.Add("Hesitantly, uncertainly, the catboy approaches you, panting from the tussle you’ve just gone through. He distinctly avoids looking you in the eye as he reaches into a pocket in his baggy pants and pulls out a small slip of paper.", parse);
		Text.NL();
		Text.Add("<i>“Hmm, what to do now… okay, that’s ambush done, and now subdue…”</i> he draws out a stub of pencil and ticks the items off the list. <i>“And right at number four is become a man, so… hey, he left the third step out, there’re only just question marks here!”</i> The catboy flicks his large, fluffy ears and grumbles irritably, tail swishing about as he pockets the paper. <i>“Guess he wanted me to figure it out for myself…”</i>", parse);
		Text.NL();
		Text.Add("Oh, great. Not only are you facing an unappealing rapist, you’re facing an unappealing rapist who <i>doesn’t even know what he’s doing</i>. You don’t think things can get any worse from here on out… can they?", parse);
		Text.NL();

		// TODO Scenes
		// Return true for valid scenes, indicating successful scene proc

		const scenes = new EncounterTable();

		scenes.AddEnc(function() {
			MaliceScoutsScenes.Catboy.PityFuck(enc, false);
			return true;
		}, 1.0, function() { return player.FirstVag() && player.Femininity() > 0.3; });
		scenes.AddEnc(function() {
			MaliceScoutsScenes.Catboy.GetMilked(enc);
			return true;
		}, 1.0, function() { return player.Lactation(); });
		/* TODO
		scenes.AddEnc(function() {
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
			return true;
		}, 1.0, function() { return true; });
		*/
		const ret = scenes.Get();

		// Default fallback
		if (!ret) {
			Text.Add("He looks you up and down a few times, scratching his head intermittently, and then mumbles to himself. <i>“Don’t think this is what he meant by that… guess I’ll have to find another one. Oh, bother.”</i>", parse);
			Text.NL();
			Text.Add("With that, he shuffles off, leaving you in the lurch to recover on your own time. That’s quite a while thanks to the magical beating he gave you, but at length you do manage to get up - albeit shakily - without anything else coming to harass you in the meantime.", parse);
			Text.Flush();
			Gui.NextPrompt();
		}
	});
	Encounter.prototype.onLoss.call(enc);
};

MaliceScoutsScenes.Catboy.GetMilked = function(enc: any) {
	const player = GAME().player;
	const catboy = enc.catboy;
	let parse: any = {

	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");

	Text.Clear();
	Text.Add("While the catboy is thinking, he suddenly stops and sniffs at the air. Once, twice, and then he closes his eyes to better concentrate on the source of whatever he’s sensed. Slowly, he turns his head to follow it, stoops down a little, and then his eyelids flick open again.", parse);
	Text.NL();
	Text.Add("Oh. The exertion of the battle <i>has</i> squished your [breasts] about a bit, causing them to leak into your [armor], creating two damp blotches, wet and still spreading. A gentle, sweet smell rises from your chest, and it’s this that the adorable little kitty cat has traced back to its origins, his small, pink tongue running over his lips as the full realization of what he’s seeing hits home.", parse);
	Text.NL();
	Text.Add("<i>“Whoa, you’ve got milk!”</i> The catboy mage’s eyes practically bulge at the sight of your leaky, milk-laden [breasts], and he makes a pathetic little sound in the back of his throat. <i>“Hnnnn… I’ve got to have a sip… but then, I’m supposed to be out here learning to be a man...“</i>", parse);
	Text.NL();
	Text.Add("You’d have shaken your head in disbelief at the sight of a full-grown man literally drooling over the thought of breast milk, but calling this guy a man is probably stretching it.", parse);
	Text.NL();
	Text.Add("<i>“<b>Hnnnnnn!!!</b> I’ve been dying for some now, never managed to get any since Malice waded in and started bossing people around…”</i>", parse);
	Text.NL();
	Text.Add("By now, he’s sweating bullets and biting his nails as his tail thrashes madly behind him. Somehow, you get the idea that this desperate craving in response to the mere idea of warm milk isn’t a completely voluntary thing.", parse);
	Text.NL();
	Text.Add("Screw it. It’s better than getting raped by a complete loser, and you do eerily get the impression that you’ll regret it if you insist on refusing the catboy his milk. Beckoning to the mage with an outstretched finger, you make sure his full attention is on your rack, then pull off your [armor]. Almost as if anticipation what you’re about to do, your [nips] seem bigger, fuller and darker than usual; the catboy himself is just trembling from head to toe and chewing his lips furiously as sweat beads on his brow.", parse);
	Text.NL();
	Text.Add("It would be comical if it weren’t so utterly pathetic.", parse);
	Text.NL();
	Text.Add("At last, the inevitable happens; the catboy’s entire body coils like a large spring, and he pounces forward to land on you with a soft thump and a ruffle of loose fabric. Wasting no time, the effeminate feline happily opens his mouth in an “O” and throws himself forward, latching onto your breast with surprising ferocity and sucking for all he’s worth.", parse);
	Text.NL();
	Text.Add("Pleasant tingles run through the lady lump in question, spreading out into the rest of your chest as his warm lips begin applying pressure to get your milk flowing; it’s clear he’s no stranger to this. Try as you might, you can’t help but grin and take the chance to run your fingers through his white hair and large, fluffy ears; he purrs gloriously, eyes closing in pure bliss as you tuck him against your breast while he nurses.", parse);
	Text.NL();
	const lactation = player.LactHandler().Rate();
	if (lactation <= 1) {
		Text.Add("Continuing to mewl to himself, the catboy suckles harder and harder until your feel your milk let down in a flush of warmth from the base of your breast; a pleasant trickle of your milky goodness runs from your nipple into his mouth. Although there’s not that much to be had, his rough, sandpapery tongue rubs against your [nip] until you’re a moaning wreck, coaxing every last drop of nourishing cream that you’ve to spare.", parse);
		Text.NL();
		Text.Add("It’s not long before the first tap runs dry, and the kitty cat of a mage moves onto the next, repeating the process with gusto. All cross-eyed and dreamy, the poor guy looks like he’s having the time of his life draining you dry; you just don’t have the heart to stop him even if you had the mind to do so.", parse);
	} else if (lactation <= 3) {
		Text.Add("The catboy pulls hard on your nipple, but it’s unnecessary considering how eager your milk is to let down. It flows and gushes into the catboy’s mouth, leaving you feeling wonderfully maternal as a warm stream joins the base of your breast to your [nip], leaving you gasping in delight to mirror the catboy’s bliss. Ah, this is the life…", parse);
		Text.NL();
		Text.Add("With how ferocious the catboy is, it’s not long before you’re down and out despite the considerable reserves you’d started with. Not enough for the catboy mage, though - fighting you seems to have worked up an appetite in him, and he goes straight for your other nipple, attacking it with an increasingly maddened ferocity as you feel your milk let down again.", parse);
		Text.NL();
		Text.Add("You have to wonder at his desperate love of milk - sure, he’s a cat, but even so he’s fitting the stereotype a bit <i>too</i> comfortably… oh well, it does take all sorts to make a world. The suckling goes on nearly as long as it did with the first, until he finally finishes and pulls away with a pop. Your [breasts] do feel much lighter now, and he continues eyeing you hungrily even as his stomach gurgles from all the cream he’s taken from you.", parse);
	} else {
		Text.Add("The catboy suckles hard momentarily, and winds up sputtering at the flood of milk that jets out of your nipple in response. Backed up for goodness knows how long, your lady lumps revel as much as your feline friend in their long-awaited release. Breast milk gushes over his face, wetting his hair and fur, and he can only look on with ravenous pleasure at what he's started.", parse);
		Text.NL();
		Text.Add("Wasting no time, the catboy leans forward and latches back on, his throat swallowing visibly and often as he gulps away, struggling to keep up with your production as you let down in earnest, a torrent of warmth joining the base of your breast to the nipple.  His arms worm their way around your back and lock together in an effort to hold onto you even as your milk squirts out from the corners of his mouth with glorious gusto, forcing himself to either drink or drown in your engulfing flow.", parse);
		Text.NL();
		Text.Add("Lost in all the milk he could ever need or want, the catboy mage purrs away blissfully as he dutifully nurses, somehow managing to keep up with your production. His stomach gurgles noisily as if begins to swell with your cream, but he doesn’t care one bit.", parse);
		Text.NL();
		Text.Add("Gee, this cat sure does like his cream, doesn’t he?", parse);
		Text.NL();
		Text.Add("The suckling goes on and on, until your milk slows to a reasonable trickle.  Content to have drained one milk spout, the catboy mage detaches himself with a wet pop, smacking his lips before moving on to the next milk tank on your chest. His hunger hasn’t diminished any as he applies the same vigorous ministrations as he did with your first breast, gleefully massaging the firm titflesh with his lips and sending pleasant vibrations racing through you with each deepthroated purr he makes.", parse);
		Text.NL();
		Text.Add("Ah… despite your knowledge that the catboy is supposed to be, well, your rapist, it’s an uphill battle to not just lie back, close your eyes, and revel in the ungodly sensations of having your milky burden relieved in the best possible way.", parse);
	}
	player.MilkDrain(30);
	Text.NL();
	Text.Add("Eventually, though, you’ve been absolutely drained, ", parse);
	if (lactation > 3) {
		Text.Add("your breasts having deflated by a good two or three cup sizes in the process. This change is only temporary, though - you can feel your milk makers revving up their production once more, a gushing sensation filling your chest as they do their best to ensure that your tits are always full, turgid and deliciously milky.", parse);
		Text.NL();
		Text.Add("On his part, the catboy looks absolutely ecstatic, if not exactly sated. His milk-swollen tummy wobbles dangerously with each movement he makes, and he can’t stop purring to himself with each breath he draws.", parse);
	} else if (lactation > 1) {
		Text.Add("your breasts having shrunk half or perhaps even a whole cup size now that they’ve been emptied. Not for long, though - you can feel a sensation of churning warmth in your chest as your [breasts] hurry to replace what you’ve lost to the catboy. Bit by bit, they start to grow fat and full again - it’ll be a little while before they’re back at full capacity, but the feeling in the meantime is just wondrous.", parse);
	} else {
		Text.Add("an overwhelming sensation of relief washing over you as the nursing comes to an end.", parse);
	}
	Text.Add(" On his part, the catboy looks up at you and licks his milky lips; there’s a bit of cream left on your [breasts] and he laps that right up, his little pink tongue flicking in and out of his mouth like a kitten lapping from a saucer.", parse);
	Text.NL();
	Text.Add("There’s a good kitty, you murmur as you give the catboy a weak scratch between his large, snow-white ears. There’s a very good, and very hungry kitty indeed.", parse);
	Text.NL();
	Text.Add("He purrs and swipes his tail at you. It tickles.", parse);
	Text.NL();
	Text.Add("Aww, that’s so cute. Like it or not, though, you’re getting quite sleepy - first from being beaten up like that, then having your nourishment drained from you. The gentle scraping of the catboy’s tongue against your increasingly sensitive titflesh and nipples is heavenly, and it’s a little hard to think straight…", parse);
	Text.NL();
	Text.Add("You wake up a little while later on the windy hilltop, the magical bindings having long since evaporated from your limbs. There’s no sign of the catboy mage, but your exposed and drained lady lumps are proof enough that he wasn’t just a figment of your imagination.", parse);
	Text.NL();
	Text.Add("Well… that could have been worse. For example, the catboy could have remembered that he was out here to “become a man”, whatever that meant - with how pathetic-looking he was, though, you probably don’t want word to get out that you lost to him. Picking yourself off the ground, you get your [armor] in shape and prepare to be on your way.", parse);
	Text.Flush();

	player.AddLustFraction(0.2);
	player.AddSexExp(1);

	Gui.NextPrompt();
};

MaliceScoutsScenes.Mare.LoneEncounter = function(levelbonus: number) {
	const player = GAME().player;
	const enemy    = new Party();
	const mare     = new CentaurMare(levelbonus);
	enemy.AddMember(mare);
	const enc: any = new Encounter(enemy);
	enc.mare     = mare;

	enc.onEncounter = function() {
		let parse: any = {

		};
		parse = player.ParserTags(parse);

		Text.Clear();
		parse.oneself = player.HasLegs() ? "one’s feet" : "oneself";
		Text.Add("This part of the Highlands that you’re currently exploring is more well-traveled than most. Enough, at least, for a proper mountain trail to have materialized amongst the hills and valleys; it twists and winds its way amongst the highland downs, rarely making a straight line between two points, but the extra distance is worth not having to cut [oneself] on the rocky trails and plateaus.", parse);
		Text.NL();
		Text.Add("There’s no sign of who maintains these roads - if anything, it looks like they’ve been made by many, many feet and wheels simply trampling out the path until the grass won’t grow there anymore.", parse);
		Text.NL();
		Text.Add("All of a sudden, your attention is drawn by the sounds of hooves clopping on the road’s hard surface. At first, you think it’s someone on horseback, but as the figure draws closer you realize that your initial assessment was close, but not quite on the mark. It’s a centaur mare, her human half slightly tanned with her equine half a shiny chestnut brown, her long black hair pulled back in a tightly-knotted braid. A quite literal breastplate - it has to be so, to accommodate her generous mammaries - shields her front half; perhaps it was magnificent once, but time and use have worn away the swirly engravings and taken away any shine it might have once had, leaving it slightly dented but functional. Behind that, barding clearly intended for a warhorse, but the thin, overlapping plates of steel have been refitted to suit a centaur better.", parse);
		Text.NL();
		Text.Add("In her hand, a long, sharp spear; on the other arm, a buckler of leather and hardened wood. There’s some slight muscle definition to her human portion that speaks of training and experience, but not quite enough to be considered bulk.", parse);
		Text.NL();
		Text.Add("Slowly, the centaur mare canters up to you and stops in the middle of the road, blocking your advance. <i>“Halt, traveler.”</i>", parse);
		Text.NL();
		Text.Add("Okay, okay, you’ve stopped. What does she want? This isn’t a hold-up or anything along those lines, is it?", parse);
		Text.NL();
		Text.Add("She scowls. You note that her spear is shaking slightly, her eyes a little wider than you’d expect, her breathing a little too deep. And not to mention, there’s an odd scent in the air that you can’t quite put words to…", parse);
		Text.NL();
		Text.Add("<i>“No,”</i> she replies, then scowls. <i>“I need a fuck.”</i>", parse);
		Text.NL();
		Text.Add("Um, come again? She needs a <i>what</i>?", parse);
		Text.NL();
		Text.Add("<i>“I said, I need a fuck. I don’t care how I get it, I just need a good fucking, and you’re the only outsider I’ve seen all day.”</i> The centaur mare lowers her spear at you such that its head is level with your chest. <i>“Now, I don’t want to have to fight you, but I will if I have to. I’m going to ask once, and once only - I’m fucking desperate, and what with my poor body meaning not being able to reach my own pussy means I’ve to turn to others. So, are you going to get me off out of your own free will, or am I going to have to make you do it for me?”</i>", parse);
		Text.NL();
		Text.Add("Right. Um…", parse);
		Text.Flush();

		// [Yes][No]
		const options = [];
		options.push({nameStr : "Yes",
			tooltip : Text.Parse("Oh, why not? She’s clearly in a bad spot.", parse),
			enabled : true,
			func() {
				Text.Clear();
				Text.Add("The mare visibly sags in relief, her shoulders slumping as she puts away her weapon. <i>“Thanks for being reasonable,”</i> she mumbles, her body now quaking ever so slightly with repressed need. <i>“Shit, just thinking about it is already getting me all wet - not that I don’t like this body of mine, but some days it just wants to do something at the most inconvenient times, if you get what I mean.”</i>", parse);
				Text.NL();
				Text.Add("Oh, you understand perfectly.", parse);
				Text.NL();
				Text.Add("<i>“Let’s find a spot off the road for this, then. Hope you’re not too alarmed by my tastes…”</i>", parse);
				Text.NL();
				Text.Add("Without any warning, the centaur mare charges at you, catching you by surprise and sending you sprawling to the ground dazed. She looms over you, spear in hand, then drops her weapon onto the grass and smiles down at you.", parse);
				Text.NL();
				Text.Add("<i>“Phew, sorry about that; hope I didn’t hurt you too badly. Just had to get that out of my system before we began fucking like a bunch of fucking animals.”</i> She pauses a moment and draws a deep breath, panting away - whether from heat or exertion is anyone’s guess. <i>“Damn it, it’s already getting to my vocabulary. Let’s just hurry up and scratch this itch of mine before it gets very much worse.”</i>", parse);
				Text.Flush();

				Gui.NextPrompt(function() {
					TimeStep({hour: 1});
					Text.Clear();
					MaliceScoutsScenes.Mare.LossEntry(enc);
				});
			},
		});
		options.push({nameStr : "No",
			tooltip : Text.Parse("No thanks, you’re just not feeling up to it today.", parse),
			enabled : true,
			func() {
				Text.Clear();
				Text.Add("You do your best to explain to the centaur mare that you’re really not interested in the offer she’s soliciting for, but she won’t have any of it.", parse);
				Text.NL();
				Text.Add("<i>“See?”</i> she rails, waving her buckler at the heavens. <i>“You ask them nicely, maybe even say ‘please’ and ‘thank you’, and it’s not as if there’s any meaningful difference in the end anyway! You want to do it the hard way, lowlander? I’ll give you the hard way, then! Mmm… hard… fuck, not right now!”</i>", parse);
				Text.NL();
				Text.Add("Her expression turns steely, and you barely have enough time to throw yourself aside as she levels her spear at you and charges!", parse);
				Text.NL();
				Text.Add("<b>It’s a fight!</b>", parse);
				Text.Flush();

				// Start combat
				Gui.NextPrompt(function() {
					enc.PrepCombat();
				});
			},
		});
		Gui.SetButtonsFromList(options, false, null);
	};

	/*
	enc.canRun = false;
	enc.VictoryCondition = ...
	*/
	enc.onLoss    = MaliceScoutsScenes.Mare.LossPrompt;
	enc.onVictory = MaliceScoutsScenes.Mare.WinPrompt;

	return enc;
};

MaliceScoutsScenes.Mare.WinPrompt = function() {
	const player = GAME().player;
	const enc  = this;
	SetGameState(GameState.Event, Gui);

	const parse: any = {

	};

	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("Unable to keep on fighting any longer, the centaur mare sinks to her knees - all four of them - and makes little urgent noises in the back of her throat. Despite being soundly beaten, it looks like her desperate need hasn’t diminished any from the combat. Letting her spear and shield fall to the grassy ground with soft thuds, the centaur wiggles her rump, and when you half-circle around her to investigate you can see a dark streak of wetness running down her hind legs as her flanks heave.", parse);
		Text.NL();
		Text.Add("<i>“Well,”</i> she mumbles. <i>“You’ve gone and beaten me, lowlander. Why don’t you go ahead and humiliate me further by just walking away? Just walk away, and leave me to wallow in my...”</i>", parse);
		Text.NL();
		Text.Add("The centaur mare’s words cut off, but she continues grumbling under her breath, crossing her arms under the bulges on her breastplate. What will you do now?", parse);
		Text.Flush();

		// [Walk away][Fuck][Fist]
		const options = [];

		if (player.FirstCock()) {
			const p1cock = player.BiggestCock();
			options.push({nameStr : "Fuck",
				tooltip : Text.Parse("Give her what she wants - but on your terms.", parse),
				enabled() { return player.HasLegs() && p1cock.Len() >= 25; }, // Gotta have legs and a 10" cock
				func() {
					MaliceScoutsScenes.Mare.WinFuck(enc);
				},
			});
		}
		options.push({nameStr : "Fist",
			tooltip : Text.Parse("Literally pound the mare’s pussy.", parse),
			enabled : true,
			func() {
				MaliceScoutsScenes.Mare.WinFist(enc);
			},
		});
		/* TODO
		options.push({nameStr : "",
			tooltip : Text.Parse("", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
				Text.Flush();
			}
		});
		*/

		Gui.SetButtonsFromList(options, true, function() {
			Text.Clear();
			Text.Add("Yeah. Either horses aren’t quite your style, or you’re just not feeling up to it today. Either way, since she was so kind to point it out to you, you’re going to do just that - humiliate her by just walking away after having soundly thrashed the stuffing out of her.", parse);
			Text.NL();
			Text.Add("As you turn to leave, she blinks in surprise and calls out to you. <i>“Wait, what are you doing?”</i>", parse);
			Text.NL();
			Text.Add("Why, you’re just leaving like she told you to.", parse);
			Text.NL();
			Text.Add("<i>“No! You’re not supposed to actually <b>listen</b> to what I just said, you’re supposed to do the opposite of -”</i> the mare blurts out, then rubs her temples and heaves a huge sigh. <i>“Fucking reverse psychology.”</i>", parse);
			Text.NL();
			Text.Add("Okay, then! You’re going to do the opposite of what she just said and do the opposite of the opposite, which is just… well, would you know it, just walking away and leaving her in the dust. Bye!", parse);
			Text.NL();
			Text.Add("The centaur mare glares at you with all the viciousness of a cauldron fit to bubble over, but doesn’t have the strength to follow up on the desire writ large on her face. You give her a cheery smile and wave, then skip on down the road, leaving her in the dust.", parse);
			Text.Flush();

			Gui.NextPrompt();
		});
	});
	Encounter.prototype.onVictory.call(enc);
};

MaliceScoutsScenes.Mare.WinFuck = function(enc: any) {
	const player = GAME().player;
	const mare   = enc.mare;
	const p1cock = player.BiggestCock();
	let parse: any = {

	};
	parse = player.ParserTags(parse);

	Text.Clear();
	Text.Add("Aww, she just wants some desperate relief. Really, getting a standing dildo of some sort would be far more efficient than waylaying travelers on the road and asking for a fuck. Or even just asking nicely instead of demanding it… catch more flies with honey than vinegar and all that. Did that ever occur to her?", parse);
	Text.NL();
	Text.Add("The centaur mare mumbles something under her breath, then replies. <i>“It is the proud ethos of my people that -”</i>", parse);
	Text.NL();
	Text.Add("Okay, okay, you get the idea just where this is going. Let’s just get this over with. Circling around to the centaur’s hindquarters, you take your own sweet time studying her butt, making sure she feels your gaze on her rump before you whip out your fingers and shamelessly grab that sexy rear of hers.", parse);
	Text.NL();
	Text.Add("Of course, touching isn’t enough - far from it - and you make sure to dig in as far as you can, past the thin layer of fat and into the solid, athletic muscle of her butt, clenching and squeezing with your digits fingers before moving onto the other half and repeating the same process. The centaur’s body shudders, her flanks heaving even more than before, and she desperately cranes her neck in a bid to try and look at just what you’re doing.", parse);
	Text.NL();
	Text.Add("And you’ve barely even gotten started here.", parse);
	Text.NL();
	Text.Add("<i>“Didn’t you want to get this over with?”</i>", parse);
	Text.NL();
	Text.Add("Yes, but proper procedures must be followed, mustn’t they? You’ve got to inspect any and all horseflesh before settling on a decision.", parse);
	Text.NL();
	Text.Add("The centaur mare swallows hard and turns her gaze forward. All the better for you, then - grabbing hold of one butt cheek in each hand, you force them apart, revealing the centaur’s equine cunt. Like the dark streaks down her legs suggest, it winks and drips at you, making her heated need all the more evident to you.", parse);
	Text.NL();
	Text.Add("Geez. And there are <i>no</i> centaur men in camp who wouldn’t happily service her?", parse);
	Text.NL();
	Text.Add("<i>“Not that I haven’t pestered over and over again already,”</i> comes the very grumpy reply. <i>“Do you think I do this out of boredom?”</i>", parse);
	Text.NL();
	Text.Add("Hrrmph. ", parse);
	if (player.IsTaur()) {
		Text.Add("Well, it looks like all the goods check out. Time to get down to business, then - you take a moment to take aim, then rear up and get mounted on the mare. She lets out a sharp breath as your weight descends upon her - not a surprise, since you did just beat the stuffing out of her - but her body is sturdy with a strong constitution, and before long you’ve got yourself all nicely mounted up atop her.", parse);
		Text.NL();
		if (p1cock.Len() >= 38) {
			Text.Add("Even for someone of equine proportions, your tackle is a force to be reckoned with", parse);
			if (p1cock.race.isRace(Race.Horse)) {
				Text.Add(", especially since it’s appropriately shaped for the task at hand", parse);
			}
			Text.Add(". The mare’s walls clench needily about your member as it slides deeper and deeper into her, no doubt sending palpable waves of satisfaction and satiation as you fill her insides with rock-hard cock. She’s so well-lubed up from her own juices that you have scarcely any problem plunging into her nethers until you’re hilted well and deep, man-meat firmly wrapped up in mare-meat.", parse);
			Text.NL();

			Sex.Vaginal(player, mare);
			mare.FuckVag(mare.FirstVag(), p1cock, 4);
			player.Fuck(p1cock, 4);

			Text.Add("<i>“Shit,”</i> she murmurs, then heaves a trembling sigh at finally having something huge enough to fully stuff that deep, juicy cunt of hers. <i>“Now that’s something. Finally, someone who can actually fill me.”</i>", parse);
			Text.NL();
			Text.Add("Why, you only seek to please.", parse);
			Text.NL();
			Text.Add("The centaur mare simply snorts at that, but she doesn’t say anything more. Very well, then - you grin and concentrate on proving that you’re more than a worthwhile fuck for what her sensibilities must be demanding of her.", parse);
		} else {
			Text.Add("Grinning, you take a few moments to tease her pussy lips with your [cockTip], causing a burst of clear girl-cum to erupt from her equine pussy. Yeah, it looks like you won’t be needing any additional lube for this one.", parse);
			Text.NL();
			Text.Add("<i>“Just hurry up and put it inside me already, you bastard!”</i>", parse);
			Text.NL();
			Text.Add("Bah, she’s in no position to make demands, you’ll take your time if you please. The mare just bucks up against you, trying to take you into her; she manages to grind against your [cockTip] a few times, but you keep your distance and she only manages to ramp up her already considerable arousal and anticipation by no small amount.", parse);
			Text.NL();
			Text.Add("At last, when you’re sure that your [cock] is as stiff and large as it’ll ever be - thanks in no small part to the desperate scent of sex wafting up from the mare’s sweaty body - you lean forward and slide your shaft into the centaur’s oozing cunt. It eagerly devours your man-meat with a wet slurping sound, and you’re in.", parse);
			Text.NL();

			Sex.Vaginal(player, mare);
			mare.FuckVag(mare.FirstVag(), p1cock, 4);
			player.Fuck(p1cock, 4);

			Text.Add("<i>“Ffff-”</i>the centaur mare looks fit to bust even as her inner walls try to grasp at your tackle, which you unfortunately have to admit is at least a little too small for the cavernous tunnel which she possesses. <i>“Shit, you’ve got so much body - would it really kill you to find a potion or something and make yourself, I don’t know, more proportional?”</i>", parse);
			Text.NL();
			Text.Add("Hey, a small dick is better than no dick. Or is she going to look a gift horse in the mouth?", parse);
			Text.NL();
			Text.Add("There’s more grumbling, but you cut it short with a quick thrust of your shaft, turning it into a moan.", parse);
		}
		Text.NL();
		Text.Add("At the same time, you run your hands up the centaur’s human torso, up from her belly and up to her breastplate, tugging at the leather straps that hold it in place. She eagerly aids you in that endeavor, and before long both halves of armor clatter on the ground, giving you clean access to her plump, oh-so-human breasts.", parse);
		Text.NL();
		Text.Add("Mm - her nipples and areolae are dark and lovely, enough to provide sharp contrast against even her tanned skin. Rock-hard, they protrude proudly from her lady lumps, which themselves are swollen and tender from arousal. Yes, they’re definitely bigger since you’ve mounted her - not very much so, but still enough for the difference to be perceptible.", parse);
		Text.NL();
		Text.Add("Taking each plump nipple between thumb and forefinger, you tease them in tandem, the centaur mare’s inner walls quivering and sliding against your shaft with each back-and-forth motion. Instinctively, she arches her back to push her breasts into your hands, clearly wanting more; seeing no reason to deny her, you start clenching and squeezing all the breastflesh your hands can gather. It’s not milking her - she’s not producing any milk to drain - but it sure is coming close. From the growing heat in the centaur mare’s chest, it’s clear that she is more than happy to receive such attentions, and she half-turns to look back at you with a softer gaze this time, biting her lip furiously.", parse);
		Text.NL();
		Text.Add("Time to seize the moment, then. You nuzzle and kiss at her neck briefly before your arousal builds to the point that you're just grunting and panting in her ear; she's certainly enjoying being mounted and stuffed as much as you are in doing the stuffing.  With her deep cunt squeezing and gripping around as much of your manhood as it can get, you're both quite content to focus on fucking.", parse);
		Text.NL();
		Text.Add("With such stimulation, it doesn’t take long before you feel your seed well up ", parse);
		if (player.HasBalls()) {
			Text.Add("and your balls churn ominously ", parse);
		}
		Text.Add("as your body prepares for release. Still, it’s not as if you can do anything but the inevitable at this point - you can only close your eyes and grasp tightly at your tauric lover’s torso as orgasm descends upon you.", parse);
		Text.NL();
		Text.Add("Sensing the first signs that you’re about to blow, the centaur mare’s body reacts just as quickly, driving her mind over the edge with a loud whinny of delight that echoes about the hilly countryside. Her body tenses in preparation to receive your load, and so you dump it all into her in a wonderfully glorious fashion. Her cunt squeezes about your shaft, desperately milking you for all you’re worth, but it’s not as if you need any extra encouragement to do your best.", parse);
		Text.NL();

		const cum = player.OrgasmCum();

		if (cum >= 8) {
			Text.Add("You’re not exactly sure how long you spend unloading your seed into the centaur mare, but you know what they say - time flies when you’re having fun. As the first rush of spunk floods the mare’s tunnel, she gasps orgasmically and writhes in your grasp, thrown into ecstasy by the sheer sensation of being filled with baby batter like this.", parse);
			Text.NL();
			Text.Add("With such a high volume that’s pouring out of your [cock]", parse);
			if (p1cock.Knot()) {
				Text.Add(" and a knot to keep it in to boot", parse);
			}
			Text.Add(", the poor centaur’s womb doesn’t stand a chance. Her cunt fills with spunk almost immediately, the sheer pressure of being stuffed so deeply forcing her cervix apart to admit torrents upon torrents of your seed into her freshly heated oven.", parse);
			Text.NL();
			Text.Add("No way you’re stopping now! The centaur mare gasps in alarm as her belly begins to bloat and distend downwards as you continue to cum, but you grip her tightly and comfortingly, the closeness of your tauric body to her own seeming to impart some measure of comfort to her as her underbelly inflates to obscene proportions with your sperm.", parse);
			Text.NL();
			Text.Add("With so much spunk expended, you’d be surprised if you haven’t already seeded a foal or two on her baby bag. Maybe three, if luck is on your side, but hey, that’d certainly put her out of commission for a while now.", parse);
			Text.NL();
			Text.Add("When you’re done, the centaur mare is so swollen that her equine underbelly is almost touching the ground. She quavers a moment, then heaves a huge sigh of relief.", parse);
			Text.NL();
			Text.Add("<i>“Fuuuuuck. Now <b>that</b> was what I needed. See? If you were going to do that, then you didn’t need to beat me up in the first place.”</i>", parse);
			Text.NL();
			Text.Add("Yeah, you can definitely agree with her. Question, though - now, how is she going to be getting back to her camp, her tribe, or wherever she lives?", parse);
			Text.NL();
			Text.Add("<i>“Heh. I wasn’t expecting to get back for some time anyway. Maybe…”</i> she breathes a deep sigh and adjusts herself to better bear your weight. <i>“Bah, I won’t be missed for a while anyway. This was most definitely worth it - I don’t think I’ll be feeling so fucking needy for a while now.”</i>", parse);
		} else if (cum >= 5) {
			Text.Add("You spend a fairly long while giving the mare a good taste of your wild oats. Of course, it doesn’t <i>seem</i> that long, but as they say - time flies when you’re having fun. At the first rush of spunk into her, the centaur mare gasps and closes her eyes, relief clearly washing over her entire form as she instinctively moves to accept your seed.", parse);
			Text.NL();
			Text.Add("<i>“Fuuuuck,”</i> the mare groans, pushing her massive hips against you in a bid to ensure that as much of you as she can take is in her. <i>“Fuuuuuuuck.”</i>", parse);
			Text.NL();
			Text.Add("Yes, yes, that’s what you’re doing to her right now.", parse);
			Text.NL();
			Text.Add("She moans again and rolls her hindquarters some more, little nickers coming from her mouth amidst flutters of breath. Uncertainly, the centaur mare summons up enough presence of mind to glance back at you, and you notice that her face is a delightful shade of hearty red.", parse);
			Text.NL();
			Text.Add("More and more spunk courses through your [cock] and fills her cunt", parse);
			if (p1cock.Knot()) {
				Text.Add(" held firmly in place by your bloated, swollen knot such that there’s no chance of any going to waste", parse);
			}
			Text.Add(". Slowly but gradually, the centaur mare’s underbelly begins to grow round and heavy, stretching with the load you’re forcing into her womb. You see her bite her lip a little uncertainly at the queer sensations of being filled this way, but a hearty grope to her firm breasts is enough to take her mind off such trivialities and back to the business of fucking.", parse);
			Text.NL();
			Text.Add("Faster and faster the both of you move, riding out the crest of your high, until she herself reaches hers just as yours is starting to die down. With a savage push against you, the centaur mare stamps at the ground and screams into the cool highland air, her fists clenched into tight, white-knuckled balls. Those deep inner walls pulse and shift against your shaft, coaxing it into the depths of her warm, slippery embrace.", parse);
			Text.NL();
			Text.Add("At last, though, the bliss finally begins to die down, leaving the two of you panting. The centaur mare shifts her weight a little, clearly unused to the load of sperm she’s now carrying inside her - large enough to look as if there’s already a lovely little foal growing inside her.", parse);
			Text.NL();
			Text.Add("<i>“Huh,”</i> she huffs, sweat running down her flanks and torso. <i>“Well, that’s going to be one hell of a weight to carry back to camp.”</i>", parse);
			Text.NL();
			Text.Add("And that’s one hell of a weight you won’t be lugging around with you.", parse);
			Text.NL();
			Text.Add("<i>“Well then, it’s a good thing that I won’t be expected around camp for a bit just yet,”</i> she replies with a number of heavy sighs. <i>“That, and with any luck it’ll be a good long while before I’m itching for a fuck again.”</i>", parse);
		} else {
			Text.Add("You grit your teeth and close your eyes as you pound the centaur mare again and again, giving her equine half a good taste of the wild oats you have on offer. Rope after rope of thick, hot cum passes from your [cock] into her waiting pussy, which flexes and clenches as it slurps it up greedily. Maybe there’s not as much as you might have hoped there would be, but there’s far more than enough to put a foal into her baby bag if it came to that.", parse);
			Text.NL();
			Text.Add("Come to think of it, <i>will</i> it come to that? Who knows? It’s not as if you’re likely to see this particular centaur mare again, after all.", parse);
			Text.NL();
			Text.Add("Keeping that thought in mind, you redouble your efforts in hammering yourself against the centaur, pounding her equine pussy as if the energy and ferocity of your copulation will make up for your modest load. Who knows? Maybe it will.", parse);
			Text.NL();
			Text.Add("On her part, the centaur mare responds eagerly to your enthusiasm, pushing her hindquarters against you to meet your thrusts. Juices slap and squelch wetly and messily as the two of you spiral into an increasingly frenzied bout of rutting and she seamlessly picks up the dying crest of your pleasure with her own, cunt walls trembling and flexing with a primal need to gather up all the seed you’ve so kindly given her.", parse);
			Text.NL();
			Text.Add("Moments tick by, and eventually the two of you relax a little, joints and muscles loosening as the high passes and afterglow begins to set in. The centaur mare mumbles something to herself, then reaches back to pat her flank and let out a long, contented sigh.", parse);
			Text.NL();
			Text.Add("<i>“Fuck, that was just what I needed - really hit the spot there,”</i> she says as she wipes the sweat off her brow. <i>“Not the best I’ve had, that’s for sure, but it was still pretty damn good.”</i>", parse);
			Text.NL();
			Text.Add("Oh, she doesn’t need to be modest, really.", parse);
			Text.NL();
			Text.Add("A snort. <i>“Fine, take it as you will.”</i>", parse);
		}
		Text.NL();
		Text.Add("When you're done and feel you’ve had enough, you pull out with a wet slurp and dismount, enjoying the sight of her creamy, well-fucked cunt. She seems quite pleased after her release, tail raised to show off those cum-stained lips of her equine pussy.", parse);
		if (cum >= 5) {
			Text.Add(" For a moment, you wonder if all the spunk you just pumped into her is going to blow back out in a small geyser of white, creamy fury, but by some small miracle both her womb and cunt hold, with little more than a trickle of spunk oozing down her hindquarters.", parse);
		}
		Text.NL();
		Text.Add("She catches you eyeing her cum-stained cunt, and turns up the corner of her mouth in a small smile. <i>“Enjoying your handiwork?”</i>", parse);
		Text.NL();
		Text.Add("Why not? It’s something to be proud of.", parse);
		Text.NL();
		Text.Add("<i>“Still don’t get why you were going to go to all this trouble if you were going to fuck me anyway. Could’ve just cut to the chase and gotten down to business.”</i>", parse);
		Text.NL();
		Text.Add("Hey, maybe it’s just an elaborate form of foreplay to turn you on, or maybe you just wanted to be sure that she was too tired to pull off some kind of tricksy stunt on you while you were fucking her. Highlanders are supposed to have their ways, after all.", parse);
		Text.NL();
		Text.Add("She huffs at that and reaches for her spear and shield, leaning her weight on the former in a bid to get about. It’s not very successful - she manages to totter for a few steps before having to sink back down onto the grass. Sure, you’d just beaten the stuffing out of her <i>and</i> then replaced it with a fresh stuffing of spunk, but you didn’t expect her to be <i>that</i> worn-down from all that attention.", parse);
		Text.NL();
		Text.Add("<i>“I’ll be fine.”</i> The mare waves you off. <i>“Go ahead and trot back to the lowlands or wherever you came from; all I need is to catch my breath and I’ll be fine.”</i>", parse);
		Text.NL();
		Text.Add("If she says so, then. With one last look back at the centaur mare, you turn and head on past her and down the road.", parse);
	} else { // Biped
		Text.Add("Well, it looks like everything’s where it should be and she’s in good health. No reason not to go ahead with your plan, then - finding a hollow log nearby, you heft it over and secure it solidly on the ground. With it, you’re able to get a proper boost up in order to properly get at her hindquarters - what with not being a taur and all - giving that firm horseflesh of hers a resounding smack with the flat of your palm.", parse);
		Text.NL();
		Text.Add("She yelps. <i>“H-hey!”</i>", parse);
		Text.NL();
		Text.Add("Why, did that feel good? It’d be a crime to leave her unbalanced so… smiling sweetly, you aim for her other butt cheek and give it a sharp slap, too. A soft moan escapes unbidden from the centaur mare - she stifles it quickly, but her juicy cunt betrays her as the dark streaks trickling down her hind legs grow ever so slightly.", parse);
		Text.NL();
		Text.Add("Oh, all right. You’ll not tease her anymore than is strictly necessary. The centaur mare’s swollen, drooling pussy lips make for a large, easy target, and you get all lined up, grinding your [cockTip] against them until she’s squealing and bucking against you, inadvertently getting you all lubed up with her juices.", parse);
		Text.NL();
		Text.Add("No time like the present, then. With a mighty thrust, you slide your man-meat into the centaur’s heated folds, ", parse);
		if (p1cock.Len() >= 38) {
			Text.Add("fitting her deep tunnel like a sleeve - almost as if you were made for this.", parse);
			if (p1cock.race.isRace(Race.Horse)) {
				Text.Add(" That goes double considering the equine tackle you’re packing at the moment - suited in both shape and size, as it were.", parse);
			}
			Text.NL();

			Sex.Vaginal(player, mare);
			mare.FuckVag(mare.FirstVag(), p1cock, 3);
			player.Fuck(p1cock, 3);

			Text.Add("<i>“Damn,”</i> the centaur mare says with a satisfied sigh. <i>“It’s been a good long while since I’ve found a shaft capable of actually filling me.”</i>", parse);
			Text.NL();
			Text.Add("Why, are there no guy centaurs around?", parse);
			Text.NL();
			Text.Add("<i>“I’d have to get in line to see those who <b>are</b> in camp. Now shut up and fuck.”</i>", parse);
		} else {
			Text.Add("eventually bottoming out in her cavernous cunt.", parse);
			Text.NL();

			Sex.Vaginal(player, mare);
			mare.FuckVag(mare.FirstVag(), p1cock, 3);
			player.Fuck(p1cock, 3);

			Text.Add("<i>“Wait, that’s all you’ve got?”</i>", parse);
			Text.NL();
			Text.Add("Why, is it not enough? Some cock is better than no cock - would she rather have that?", parse);
			Text.NL();
			Text.Add("A sigh, followed by what might be the faintest trace of a pout <i>“Well, no…”</i>", parse);
			Text.NL();
			Text.Add("You shrug and keep on working away at it. Sure, her body might be clearly signaling that it could do with more than what it’s currently receiving, but it’s not as if you can do much about that - not right now, in any case.", parse);
		}
		Text.NL();
		Text.Add("Soon enough, you settle into a steady rhythm, pounding away to the musky smell of sex and squelching of juices. ", parse);
		if (player.HasBalls()) {
			Text.Add("Your [balls], full of sperm waiting to be unleashed, slap heavily against her butt cheeks as you grip her hindquarters to steady yourself", parse);
		} else {
			Text.Add("Your pounding is so ferocious that you’ve to widen your stance a little and grip her hindquarters tightly as you steady yourself against the mare’s powerful bucking", parse);
		}
		Text.Add(" - and frankly speaking, what fine ass cheeks they are. Round and plump, yet with firm muscle supporting them from underneath and pushing them up, you have to admit that they’re fine pieces of horseflesh indeed. So fine, in fact, that you can’t help but palm them - an action which the centaur returns by way of pushing herself eagerly against you.", parse);
		Text.NL();
		Text.Add("Now that’s an invitation if you ever had one. It would be a shame to turn down that advance, so you shift your grasp from her hips to her ass, shamelessly squeezing, kneading, rolling that juicy horseflesh in your hands even as the centaur mare’s inner walls quiver and slide along your [cock] as you continue to fuck her silly.", parse);
		Text.NL();
		Text.Add("After a while, though, you feel that it’s time to move on to greener pastures. You can’t reach her human breasts - your arms aren’t quite long enough for that - but you <i>can</i> reach down to her underbelly and tweak her mare nipples. On her part, the centaur mare reaches up to her chest, and cupping her bosom, begins to molest herself with wanton, shameless abandon, half-turning so that you can get a good side view of her boobsterbation.", parse);
		Text.NL();
		Text.Add("<i>“Like what you see?”</i> she asks, tacking a whorish moan onto the end of her question. When no response is forthcoming, the centaur mare shrugs and redoubles her efforts. Her human mammaries seem to be far more sensitive and pleasure-inducing than her equine ones, by all appearances, and you grit your teeth and make sure you don’t start falling behind.", parse);
		Text.NL();
		Text.Add("<i>“Keep up, lowlander!”</i> the centaur mare yells as the two of you buck and writhe against each other with increasing, warlike ferocity. <i>“If you can beat me, sure you have the staying power for this!”</i>", parse);
		Text.NL();
		Text.Add("You’re doing what you can! The centaur mare looks back at you once more, and little hisses of heated breath escape from between her gritted teeth as she throws a determined glare in your direction.", parse);
		Text.NL();
		parse.b = player.HasBalls() ? "r balls" : "";
		Text.Add("Guess what? You’re determined, too! With her deep cunt squeezing and gripping around as much of your manhood as it can get, you can practically feel the cum being sucked out of you, drawn out of you[b] by the insistent suction being applied to your shaft.", parse);
		Text.NL();
		Text.Add("Subjected to such an intense fucking, you quickly feel yourself approaching your peak despite your best efforts to hold on. Sensing that you don’t have much time left, you desperately smash your hips against the centaur mare’s in a furious bout of fucking, trying to get her to break down before you do.", parse);
		Text.NL();
		Text.Add("She wins - barely. With a final thrust of your [cock] into the centaur mare’s warm, inviting insides, you groan aloud and blow your load straight into the centaur mare", parse);
		if (player.HasBalls()) {
			Text.Add(", balls churning and squelching audibly as they disgorge their cargo with terrible efficiency", parse);
		}
		Text.Add(". She squeals and whinnies, her voice ringing in the cool highland air, and presses herself against you in a bid to take your seed.", parse);
		if (p1cock.Knot()) {
			Text.Add(" Even now, you feel your knot swelling and growing, greedily tying the two of you together, corking her cunt to make sure that as little of your sperm escapes as possible.", parse);
		}
		Text.NL();

		const cum = player.OrgasmCum();

		if (cum >= 8) {
			Text.Add("And what a load this one is. The deluge of spunk that’s been kept in reserve within you jets from your [cockTip] like water from a fire hose, an overwhelming sensation of delight washing over your entire body as you feel thick, hot jism run down the entirety of your shaft, down, down, down -", parse);
			Text.NL();
			Text.Add("- Clearly, the mare feels it too, for she lets out a loud whinny of orgasming delight just before her equine underbelly begins to bloat with your seed, her cervix unable to withstand the pressure of so much cum being forced into her that it has to no choice but to allow the flood into her heated, waiting womb, your bodies working together to ensure she receives your fertile cock cream.", parse);
			Text.NL();
			Text.Add("Bigger and bigger the centaur grows, almost as if gripped by some kind of unnatural pregnancy, ballooning away with your cum. Blushing furiously with a strawberry-red flush that covers her face and reaches all the way into her breasts, the mare pants lustily as the fires in her body are finally quenched by the liquid warmth pouring into her.", parse);
			Text.NL();
			Text.Add("<i>“Damn,”</i> the centaur mare manages to choke out after a little while, when your flow begins to abate somewhat and the two of you can think straight again. <i>“That was something.”</i>", parse);
			Text.NL();
			Text.Add("You look around to her huge, cum-inflated equine underbelly, so taut, round and low that it brushes against the grass as it sloshes from side to side as she tries to move. Yeah, that’s definitely something all right.", parse);
			Text.NL();
			Text.Add("<i>“Aren’t going to be moving about very much, not when I’m filled up like this.”</i> A sigh. <i>“But I guess it’s worth it if it means that I won’t be squirming around for a long time. Not as if I’m expected back in camp any time soon, anyway.”</i>", parse);
		} else if (cum >= 5) {
			Text.Add("The load that blasts out of your [cockTip] is certainly respectable, certainly heavy enough for you to palpably feel the rush of thick, liquid warmth that gushes through your manhood before erupting out into the centaur mare’s cunt. The feel of your hot spunk flooding her insides is enough to send the mare careening over the edge of pleasure and she goes down wildly, sweat pouring off her flanks as she shakes and trembles with sated need and desire.", parse);
			Text.NL();
			Text.Add("<i>“Fuuuuuck,”</i> she moans, her breasts heaving as she gasps great lungfuls of air. The centaur mare’s sex-swollen breasts bob up and down on her chests, nipples as hard as diamonds, and you have little doubt that her mare ones down below are as equally stiff. <i>“Fuck this. Fuck it all.”</i>", parse);
			Text.NL();
			Text.Add("Your only desire is to serve. So yes, you’ll fuck her.", parse);
			Text.NL();
			Text.Add("Filled to the brim with your sperm, the centaur mare’s only response is to moan and shift her weight as her equine underbelly begins to swell outwards, growing lower and rounder as if there’s already a foal growing unnaturally fast in her. Of course, you know it’s just cum from the way it sloshes around, but one can’t deny that it’s quite the satisfying sight.", parse);
			Text.NL();
			Text.Add("Eventually, your flow begins to ebb a little - although it’s far from stopped - and the centaur mare sighs in satisfaction. <i>“Well. Won’t <b>this</b> get a few odd looks when I return to camp.”</i>", parse);
		} else {
			Text.Add("Greedily, you press yourself against the fine piece of equine horseflesh that the centaur mare is, determined to give her a good taste of your wild oats. As you pump and thrust away, trying to get your sperm in as deep as you can, she on her part rears up against you to take it all into her cavernous pussy, the muscles of her inner walls undulating against and massaging your shaft. Sure, there’s not as much as one might have hoped, but one takes what one can get.", parse);
			Text.NL();
			Text.Add("<i>“Is that all you’ve got?”</i> the centaur mare says as your flow begins to ebb and falter. <i>“Sheesh, maybe I should have just let you pass by and jumped the next idiot with a dick to come down the road.”</i>", parse);
			Text.NL();
			Text.Add("She sure wasn’t holding that line of thought when she jumped <i>you</i>, though.", parse);
			Text.NL();
			Text.Add("<i>“Oh, just shut up and focus on fucking me.”</i>", parse);
		}
		Text.NL();
		Text.Add("Eventually, though, ", parse);
		if (player.HasBalls()) {
			Text.Add("your [balls] exhaust themselves", parse);
		} else {
			Text.Add("you exhaust yourself", parse);
		}
		Text.Add(", the last of your available sperm dribbling out to join what you’ve already put deep in the mare. Winded and breathing hard, you wait for yourself to soften ", parse);
		if (p1cock.Knot()) {
			Text.Add("and your knot to deflate ", parse);
		}
		Text.Add("enough for you to be able to pull out. There’s a loud, wet pop followed by the unsettling noise of slick juices, and you’re free.", parse);
		if (cum >= 5) {
			Text.Add(" Despite your initial apprehensions, her cunt holds against the internal pressure of her cumflated womb with little more than a slight trickle that soon comes to a stop. Hah, seems like she’s going to be carrying your load about for a while, then.", parse);
		}
		Text.NL();
		Text.Add("<i>“So, question.”</i>", parse);
		Text.NL();
		Text.Add("Yes?", parse);
		Text.NL();
		Text.Add("<i>“If you were going to fuck me anyway, why bother with beating me up in the first place? Is that your kink or what?”</i>", parse);
		Text.NL();
		Text.Add("You shrug; she stares at you with steely eyes before shrugging herself and picking up her spear and shield, leaning her weight on the former. She staggers a few steps, totters, and then sinks onto the ground with a small sigh.", parse);
		Text.NL();
		Text.Add("<i>“Welp, guess you did a number on me. I’ll just wait here for a bit until I get my breath back. For what it was worth… you were an okay fuck, lowlander.”</i>", parse);
		Text.NL();
		Text.Add("Merely okay? Next time, you’re just going to beat the stuffing out of her and leave her to work out her lusts by herself - assuming you ever run into her again, that is.", parse);
		Text.NL();
		Text.Add("<i>“Sheesh, don’t be so sore about it - it’s not in the way of my people to gush over or flatter others.”</i> The centaur mare sighs. <i>“Word of advice - I think you’d look a lot more fetching on four legs instead of two, but of course I’m biased.”</i>", parse);
		Text.NL();
		Text.Add("Heh. You’ll keep that in mind, then. Quickly, you tidy yourself off as best as you can, dust the dirt off your feet, then are on your way down the highland road.", parse);
	}
	Text.Flush();

	TimeStep({hour: 1});

	Gui.NextPrompt();
};

MaliceScoutsScenes.Mare.WinFist = function(enc: any) {
	const player = GAME().player;
	const mare   = enc.mare;
	const p1cock = player.BiggestCock();
	let parse: any = {

	};
	parse = player.ParserTags(parse);

	Text.Clear();
	Text.Add("Huh. She just wants to let loose a bit of steam, doesn’t she?", parse);
	Text.NL();
	Text.Add("The centaur mare just huffs. <i>“Whatever you’re going to do, do it. If you’re not going to make a move, then just get on down the road and leave me be.”</i>", parse);
	Text.NL();
	Text.Add("Ha ha - there’s no need to get her jimmies all rustled up and be so prissy about things. You’re sure that her people have a proud warrior people ethos going on that requires her to be such an uptight stick all of the time, but you’re sure that she can let her hair down now. After all, you <i>did</i> beat the stuffing out of her - and what better excuse is there for her current predicament than that?", parse);
	Text.NL();
	Text.Add("The centaur mare attempts to twist her lips into a scowl, but the renewed trickle of girl-cum down her equine hind legs betrays her thoughts, or at the very least, her instinctive desires. Musky and clearly smelling of arousal, it beckons you to her swollen and puffy pussy lips, slightly parted and just begging to be penetrated.", parse);
	Text.NL();
	Text.Add("Time to get started, then. Circling around behind the centaur mare, you take your time in inspecting her like a prize pony at a show fair. Placing your hands on her well-toned rump, you let out a contented sigh of victory at her firm yet pliable ass cheeks, reveling in the sheer sensation of healthy fat supported by an athletic musculature. Soft horsehair runs under your fingertips, and you raise her tail and force her ass cheeks apart, fully exposing the centaur mare’s pussy to full view.", parse);
	Text.NL();
	Text.Add("She gasps as the shock of cool air hits her wet, toasty pussy, and you see her innards clench, a fresh stream of girl-cum oozing down her rear as she makes a strangled noise in the back of her throat and color rises into her chest and cheeks.", parse);
	Text.NL();
	Text.Add("<i>“Come on, lowlander,”</i> she snarls through clenched teeth. <i>“There’s no need to keep anyone waiting.”</i>", parse);
	Text.NL();
	Text.Add("Hah, so she says. ", parse);
	if (p1cock) {
		Text.Add("Sure, you might have the equipment to do so, but you’re not in the mood for getting your dick wet today", parse);
		if (p1cock.Len() < 20) {
			Text.Add(" - that, or you’re too well aware that you’d be completely insufficient for the satiation of the mare’s carnal needs", parse);
		}
		Text.Add(". No, instead you have a much better idea, and you’re certain that the mare will be on board with you once you’re in.", parse);
	} else {
		Text.Add("It’s not like you have the equipment to do things the orthodox way… but then again, it’s not as if you ever had that in mind from the get go, right? No, you’ve got something better in mind to slake the mare’s desperate thirst, and you’re fairly certain she’ll be on board with you once she gets a taste of what you intend to serve up.", parse);
	}
	Text.NL();
	Text.Add("Slowly, you run two fingertips across the mare’s wet petals, lightly touching them with just the slightest hint of pressure. The centaur mare stiffens her entire body, drawing a sharp breath; you grin and work your way up her womanly flower until you’re faced with her love-button. Fat and swollen with her desperate arousal, it peeks out from under its hood stiffly; you take it between thumb and forefinger, slowly rubbing circles across the glistening nub of flesh, occasionally taking a moment to grind your thumb back and forth across its tip.", parse);
	Text.NL();
	Text.Add("The reaction is immediate - you move to the side just in time to avoid a squirt of clear girl-cum jet from her cunt and splash to the grass behind you. Trembling at all four knees, the centaur mare lets out a desperate, whorish moan, her eyes closed and fists balled so tightly her knuckles have turned white.", parse);
	Text.NL();
	Text.Add("Heh heh. Now <i>that’s</i> better. All right, then - now that she’s got a proper perspective and attitude about things, you’ll give her the relief that she was willing to fight you for.", parse);
	Text.NL();
	Text.Add("Bit by bit, you sink two fingers into the centaur mare’s cunt, enveloping them in wet horsey heat. Sensing the intrusion into her most intimate place, the centaur mare’s muscles pulse and flex, trying to draw what they imagine is a cock deeper into her cavernous pussy.", parse);
	Text.NL();
	Text.Add("However, you stay your hand, resisting the temptation to dive straight into the mare. Patience, patience - you force your breathing to remain calm and measured as you massage the mare’s inner walls with both fingers, occasionally spreading them wide so as to stretch her out a bit, get her more flexible and receptive to what you intend later. Barely able to remain standing, the mare wiggles desperately against your hand, letting loose juices that trickle down your wrist before falling to the ground.", parse);
	Text.NL();
	Text.Add("<i>“Spirits above, just fuck me already.”</i> It’s clear that instead of satiating her lusts, your foreplay has only served to exponentially ignite them further. <i>“Damn it, what are you waiting for? Are you dragging things out just to see me squirm?”</i>", parse);
	Text.NL();
	Text.Add("You were just waiting for her to say the magic word.", parse);
	Text.NL();
	Text.Add("<i>“Fuck you!”</i>", parse);
	Text.NL();
	Text.Add("Nope, that’s not the magic word. Come on, you’re pretty sure that she knows it - everyone does, unless they were brought up in a barn.", parse);
	Text.NL();
	Text.Add("The centaur mare half-turns to look back at you, biting her lip, and something in her eyes seems to snap. <i>“Please?”</i>", parse);
	Text.NL();
	Text.Add("And <i>there’s</i> the magic word. Seriously, if she’d just bothered with asking at the outset instead of jumping other people and trying to rape them, you suspect that she’d have gotten a much more favorable response to her advances. And since she’s now asked so nicely, you see no reason not to give her what she wants.", parse);
	Text.NL();
	Text.Add("Two fingers quickly become three, then four, until your entire fist has sunk into the mare’s pussy with a loud squelch of juices. True to its equine nature, her cunt stretches and gapes to admit the entirety of your hand, the sudden straining of her muscles eliciting a cry of pleasure from her lips.", parse);
	Text.NL();
	Text.Add("You’re only just getting started, though. Even as the centaur mare’s pussy tries to clamp down on your fist with vice-like vigor, you spread your palm within her inner walls, clenching and unclenching your fingers as her slick tunnel pushes and slides against your hand. It’s just so wet, warm and <i>slick</i> that you almost pity the mare for having to deal with this on a regular basis and yet have no means of actually satisfying herself under her own power.", parse);
	Text.NL();
	Text.Add("What a pity, indeed. Good thing that you’re here to scratch that itch, then!", parse);
	Text.NL();
	Text.Add("It’s not an actual, massive equine shaft, but your fist and forearm are a pretty good approximation, judging by how the centaur mare nickers. Her inner walls continue to squeeze and ripple against your arm as you push more and more of it into her, stopping just past your wrist before beginning to pull out again. She’s just as toned and muscular on the inside as she is on the outside, and you can’t help but wonder why the centaur men wherever she lives wouldn’t want a piece of her. ", parse);
	if (player.IsTaur()) {
		Text.Add("Yeah, you may be not quite in the mood for that kind of fun right now, but surely <i>all</i> the tauric guys can’t be having a headache <i>all</i> the time.", parse);
	} else {
		Text.Add("You know you would, if you were on four legs instead of two. It’s such a waste, to be honest.", parse);
	}
	Text.NL();
	Text.Add("<i>“H-hey!”</i> the centaur mare says as you move to extract your fist. <i>“You’re not going to pull out already, are you? Come on!”</i>", parse);
	Text.NL();
	Text.Add("Whatever made her think that you were anywhere near done? Really, all she needs to do is to just stand there and relax, anything else is a bonus. Don’t worry about performance, take a load off and enjoy the show!", parse);
	Text.NL();
	Text.Add("<i>“I can’t -”</i> her words are cut off mid-sentence as you gather your strength and literally punch into her cunt, driving your arm through those meat curtains and lodging yourself up to the elbow in fine horseflesh.", parse);
	Text.NL();
	Text.Add("Her eyes wide and mouth formed into a small ‘o’, the centaur mare dances on the spot for a few seconds, her hooves trampling the grass underfoot - you’re a little worried that she might bolt and take you with her, but her lust eventually overcomes the shock of the sudden penetration and she pushes her hindquarters against you.", parse);
	Text.NL();
	Text.Add("<i>“Ah! Ah!”</i>", parse);
	Text.NL();
	Text.Add("Feels good, doesn’t it? Bracing your [feet] on the grassy ground, you pull your arm out of the centaur mare - it’s a bit of effort considering how reluctant she is to let you go, but you pull back such that only your wrist still remains in her. Taking a deep breath, you shift your weight and lunge forward, a loud squelch sounding in the air as you pound her pussy with your fist. This time, you sink in almost all the way to your shoulder, and feel a satisfying hardness as you hit her cervix.", parse);
	Text.NL();
	Text.Add("Fully stuffed by way of being impaled on your arm, the centaur mare whinnies while you jiggle your limb up and down, to and fro, stretching her cunt for what’s going to come next. Once you’re sure you have a good footing, you begin jackhammering her insides with your fist, making sure to spread your fingers every so often for maximum effect. ", parse);
	Text.NL();
	Text.Add("Slick, glistening juices and slurping sounds abound as you throw your weight back and forth, withdrawing to your wrist before lunging forward to hammer at her cervix like a battering ram at the gates. The centaur mare completely loses it at this point - she can barely remain standing, and screams her arousal like a cheap, overacting whore over the mountains and foothills. With how loud she is, you’re pretty sure that everyone will be able to hear you for miles - not that you care, or that you could back out now even if you did.", parse);
	Text.NL();
	Text.Add("Feebly, the centaur mare tries to reciprocate your efforts, but you’re moving too quickly and she’s simply too addled by her mounting lust that there’s no way she’s keeping up with you. Feminine honey oozes out from around your arm, dripping onto the grass at a steady rate, and the slow trembling in her body alerts you to her impending orgasm.", parse);
	Text.NL();
	Text.Add("Best to let it all out, then. Grinning widely, you give the centaur mare one good final thrust, twisting and wiggling your arm in her heated depths like some kind of tentacle. Her entire body tenses for a split second, and then her love-tunnel is gripping tightly at your limb as waves of orgiastic pleasure cascade through her form, leaving her a quivering wreck. Unable to keep standing, the centaur mare collapses on her knees, dragging you to the ground with her even as the puddle of slick juices she’s standing in continues to grow.", parse);
	Text.NL();
	Text.Add("Time to get out of here, then - your job is done. One last surge of effort has you free of her, your glistening fist emerging from the centaur’s now-gaping cunt with a pop and spray of girl-cum. Looking down at the centaur mare, you can’t help but feel at least a small amount of satisfaction as she whines and groans, the aftershocks of her tremendous orgasm carrying her a good way with their momentum before she finally comes to a panting, wheezing stop.", parse);
	Text.NL();
	Text.Add("Did she enjoy herself?", parse);
	Text.NL();
	Text.Add("<i>“Fuck.”</i>", parse);
	Text.NL();
	Text.Add("You’ll take that as a yes. Did this sate her, and does that mean that she won’t be troubling people on the highland roads for a little while now?", parse);
	Text.NL();
	Text.Add("<i>“Fuck. Fuck. Fuck.”</i> The centaur mare’s underbelly heaves in and out as she looks at you with stupid, glazed-over eyes. Compared to the proud warrior race girl schtick she was trying to pull off earlier, this suits her so much better. Either way, having had some much-needed relief for her heated cunt, she looks to be in no condition to be menacing the roads, so you’ve probably done the Highlands a public service. Go you!", parse);
	Text.NL();
	Text.Add("Pumping in and out of the mare for that long did take quite a bit out of you as well, but you’re able to stroll on over to the centaur’s human half and give her a pat on the head with your cum-stained hand, then wipe your arm off all over her face and torso, as if you were applying some kind of lewd war-paint on her.", parse);
	Text.NL();
	Text.Add("There, much better! Smiling, you turn your back on the dazed centaur, leaving her by the roadside behind you. Before long, you are on your way.", parse);
	Text.Flush();

	player.AddSexExp(2);
	player.AddLustFraction(0.5);

	Gui.NextPrompt();
};

MaliceScoutsScenes.Mare.LossPrompt = function() {
	const player = GAME().player;
	SetGameState(GameState.Event, Gui);
	Text.Clear();

	// this = encounter
	const enc = this;

	let parse: any = {

	};
	parse = player.ParserTags(parse);

	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("There’s something about a huge mass of horseflesh that has a sense of weight and inevitability about it, one that you get a very keen appreciation for when the centaur mare charges and blindsides you, knocking ", parse);
		if (player.weapon) {
			Text.Add("your [weapon] out of your [hand]s", parse);
		} else {
			Text.Add("the wind out of you", parse);
		}
		Text.Add(" and sending you reeling. Before you know it, she’s got the tip of her spear a hair’s breadth away from your throat.", parse);
		Text.NL();
		Text.Add("<i>“I told you that I’d <b>make</b> you service me if it came down to that, and so it has.”</i> She draws a deep breath of cool highland air to steady her words, shaking with mounting arousal, and continues. <i>“You fought well - or at least, as well as you could - but your strength has failed you. I hope that you’ve the good sense to acquiesce, or if not, at least submit to your fate.”</i>", parse);
		Text.NL();
		Text.Add("And what if you don’t?", parse);
		Text.NL();
		Text.Add("The centaur mare licks her lips. <i>“Then like it or not, I will take whatever I want from you anyway.”</i>", parse);
		Text.NL();

		let armor = "";
		if (player.Armor() || !player.LowerArmor()) { armor += "[armor]"; }
		if (player.Armor() && player.LowerArmor()) { armor += " followed by your "; }
		if (player.LowerArmor()) { armor += "[botarmor]"; }
		parse.arm = Text.Parse(armor, parse);

		Text.Add("Your concentration is so focused on her spear-tip that you don’t notice one of her hooved forefeet lashing out, catching you soundly on the chest and sending you sprawling onto your back. Before you know it, she’s tossed aside her spear and shield and is on you, pawing messily at your [arm] in a frantic bid to get it off. It takes somewhat longer than one would expect thanks to how haphazardly she’s grabbing at the material, but eventually the lot is off and you’re at her mercy.", parse);
		Text.NL();
		MaliceScoutsScenes.Mare.LossEntry(enc);
	});
	Encounter.prototype.onLoss.call(enc);
};

MaliceScoutsScenes.Mare.LossEntry = function(enc: any) {
	// TODO More Loss Scenes
	const scenes = new EncounterTable();

	scenes.AddEnc(function() {
		MaliceScoutsScenes.Mare.LossFacesit(enc);
	}, 1.0, function() { return true; });

	/* TODO
	scenes.AddEnc(function() {

	}, 1.0, function() { return true; });
	*/
	scenes.Get();
};

MaliceScoutsScenes.Mare.LossFacesit = function(enc: any) {
	const player = GAME().player;
	let parse: any = {

	};
	parse = player.ParserTags(parse);

	Text.Add("Out of breath, the centaur mare pauses for a moment and considers you on the ground as she takes a moment to recover.", parse);
	Text.NL();
	Text.Add("<i>“Fuck. How to make sure this one won’t run away while fucking me.”</i> Another moment of hesitation as her eyes dart this way and that - guess she hasn’t actually thought anywhere past “waylay and beat up travelers on the road”, eh?", parse);
	Text.NL();
	Text.Add("<i>“Shut up,”</i> she replies, a scowl on her face. <i>“I’m trying to think.”</i>", parse);
	Text.NL();
	Text.Add("She scratches her head, looks around a little more, and then her eyes fall upon a large, flat-sided boulder a little ways to the side of the road. <i>“Guess that’ll have to do.”</i>", parse);
	Text.NL();
	Text.Add("Guess <i>what</i> will have to do? Before you can ask the question, though, the centaur mare’s grabbed you by the scruff of your neck and has begun dragging you towards the boulder. Of course, you’re obligated to put up a token resistance - which, of course, is ultimately ineffectual as she hoists you upright and pushes your back against the boulder’s smooth, flat side.", parse);
	Text.NL();
	Text.Add("Okay, now what?", parse);
	Text.NL();
	Text.Add("<i>“Don’t get lippy with me,”</i> the centaur mare snarls. <i>“Just because I need you to pleasure me doesn’t mean I can’t break a limb or two while at it.”</i>", parse);
	Text.NL();
	Text.Add("Twisting her neck so she can keep an eye on you, the mare turns about such that her shapely equine rear is directly facing you. Even like this, you can see her cunny winking at you from between her hindquarters, literally wet and dripping with arousal. There’s only a moment to wonder what she’s up to when she bucks backward forcefully, sandwiching you between a rock and a weighty mass of horseflesh.", parse);
	Text.NL();
	Text.Add("<i>“There’s no way you’re getting out from under this,”</i> she tells you as you put up yet another round of token struggle. <i>“You can enjoy it, or not, but either way the end result is the same.”</i>", parse);
	Text.NL();
	Text.Add("With that said, she wiggles her rounded rear all over your torso, giving you a good feel of all that supple, solid horseflesh rolling over your [skin], spreading her scent all over you. That goes doubly so for the musk rising from her juicy pussy - although it’s still some distance from your face, the very air itself is saturated with the needy scent of sex. You can’t escape it - the pervading aura forces its way into your nostrils and down your throat, making you cough and splutter a bit even as the centaur mare continues grinding against you.", parse);
	Text.NL();
	Text.Add("Another thrust up against you, and the mare has her ass cheeks spread wide, her cunny winking and dripping with heated need as she slides it further and further up, leaving a slick trail of girl-cum along the length of your body. Without warning, she shifts her weight again, and now she’s got your face well up and against her butt, her womanly flower overflowing with nectar and barely an inch or two from your lips.", parse);
	Text.NL();
	Text.Add("You can’t breathe! While you can get just enough air to avoid passing out - if you struggle to fill your lungs - the bulk of the mare’s supple butt cheeks are pressed into your face. All you can smell - or even taste - is her sex, and there’s no way to escape that overpowering scent now, so close as you are to its source.", parse);
	Text.NL();
	Text.Add("<i>“Lick,”</i> the centaur mare commands in an authoritative voice - or at least, as authoritative as one can get when one’s practically riddled with need. <i>“I’m sorry, but I can’t risk you getting away. The sooner you’re done, the sooner you can be released.”</i>", parse);
	Text.NL();
	Text.Add("Nothing for it, then. Gingerly, you brush the tip of your [tongue] across her mare folds, and taste her feminine nectar for real. Back and forth, back and forth, you begin teasing the centaur mare’s labia with your tongue-tip, quick touches and flicks that while providing enough sensation, also harbor the promise of so much more.", parse);
	Text.NL();
	Text.Add("The centaur mare shifts her weight again, her voice trembling. <i>“T-there’s no need to bother with foreplay. Just get to it already!”</i>", parse);
	Text.NL();
	Text.Add("She may have beaten you and may be forcing you to eat her out, but at least this is something you still have control over. Taking your time, you lap at her love-button like a kitten at a saucer of milk, with much the same effect - the centaur mare nickers and moans as you continue your tender ministrations, juices practically gushing down her cunt, dribbling down your chin and running down her legs, but the sheer bulk of her body and barding is ensuring that you still aren’t going anywhere in a hurry.", parse);
	Text.NL();
	Text.Add("Fine, now that you’re done with the appetizers, time to get on with the main course. You pause a moment beforehand to get all the air you can, then press your lips to her juicy cunt and start licking. With her rump in your face, you can’t quite see her face, but you can definitely <i>hear</i> her scream in a mixture of release and relief as she’s given a reprieve from her desperate lusts.", parse);
	Text.NL();
	Text.Add("<i>“Fuck,”</i> she groans. <i>“Fuuuuck. That’s it, yes. That’s. Just. It.”</i>", parse);
	Text.NL();
	Text.Add("Great! Since she liked that, who wants to bet she wants even more! You work your tongue over the centaur mare's cunny and dive into it shamelessly, putting all your strength into it as you do your best to bring her to climax as quickly as possible. One has to admit, the taste of the mare's hot juices is deliciously arousing despite the circumstances, and you lap up as much of it as you can get.", parse);
	Text.NL();
	Text.Add("Hot and sticky, the scent and taste of her nectar overwhelms your senses, blinding you to pretty much everything else but the mare and her pussy. The more you lick away, the faster and freer it flows, and with her ass pressed up against your face, you can feel the muscles beneath shifting, flexing, squeezing as you drive her closer and closer to finally letting loose all that pent-up sexual energy she’s got in her body.", parse);
	Text.NL();
	Text.Add("At long last, you break down the last of the centaur mare’s inhibitions and she cums with a loud whinny of release, stamping at the ground with her hooved forefeet as shockwaves of ecstasy travel up and down the length of her body. Hot and sticky with girl-cum, you pant for breath as she finally pulls her ass away and collapses onto her knees and equine underbelly, her head bowed as she balls her fists and groans needily.", parse);
	Text.NL();
	Text.Add("My, my, wasn’t she just so pent-up - it must have taken an iron will for her to have held it back for so long. As you look on, the centaur mare cums not once but twice more from the aftershocks of her first orgasm, needing no further stimulation on your part - the sheer rush from the release of all that sexual energy is enough to drive her over the edge. Squirt after squirt of nectar lands on the grass, wetting it until her hind legs are in a messy puddle of her own sexual fluids.", parse);
	Text.NL();
	Text.Add("<i>“Shit,”</i> she groans, then looks back at you. Her lips move and she tries to say something, but all that comes out is a bunch of garbled nonsense - she tries this a few more times, then finally gives up and shuts her yap. Well, it’s not as if you’d had have the energy to carry on a meaningful conversation anyway - it’s all you can do to slump down on the ground, sliding down the boulder’s smooth surface until the you can feel the cool grass beneath you.", parse);
	Text.NL();
	Text.Add("And just like that, it’s over. It’s clear that the centaur mare has gotten some much-needed relief for her heat-filled cunt - hopefully by taking one for the team, she won’t be harassing travelers on the Highlands roads for some time now. Quick and dirty, with perhaps no real pleasure from the deed, but what needs to be done has been done.", parse);
	Text.NL();

	let armor = "";
	if (player.Armor() || !player.LowerArmor()) { armor += "[armor]"; }
	if (player.Armor() && player.LowerArmor()) { armor += " followed by your "; }
	if (player.LowerArmor()) { armor += "[botarmor]"; }
	parse.arm = Text.Parse(armor, parse);

	Text.Add("Seems there nothing left for you here now. Leaving the centaur mare to recover in her own time, you gather your [arm] and are on your way. Before long, you crest the next hill, and the centaur vanishes from sight.", parse);
	Text.Flush();

	player.AddSexExp(2);
	player.AddLustFraction(0.5);

	Gui.NextPrompt();
};

// GOAT ALCHEMIST SCENES

MaliceScoutsScenes.Goat.LoneEncounter = function(levelbonus: number) {
	const player = GAME().player;
	const party: Party = GAME().party;
	const enemy    = new Party();
	const goat     = new GoatAlchemist(levelbonus);
	enemy.AddMember(goat);
	const enc: any = new Encounter(enemy);
	enc.goat     = goat;

	enc.onEncounter = function() {
		let parse: any = {

		};
		parse = player.ParserTags(parse);

		Text.Clear();
		Text.Add("The Highlands aren’t all rolling hills and rocky mountains. Dips, valleys and ravines are all part of the landscape, gouged out of the rock by wind, snow and ice, and although rarer than the former they’re no less treacherous in nature. It’s in one of these that you find yourself, treading through the thin scrub and gravelly soil that lines its bottom. Hard going, perhaps, but much less so than attempting to go over the mountains proper.", parse);
		Text.NL();
		Text.Add("<i>“Bombs away!”</i>", parse);
		Text.NL();
		Text.Add("You have barely enough time to look up and see two dark, spherical objects fall from the top of the ravine towards you before your instincts kick in and take control of your movement, sending you into a dive for the nearest boulder", parse);
		if (party.Num() > 1) {
			parse.comp = party.Num() == 2 ? party.Get(1).name : "your companions";
			Text.Add(" with [comp] following suit", parse);
		}
		Text.NL();
		Text.Add(". There’s a split second of dreadful silence, followed by a deafening roar as an eruption of heat and flame spreads outwards from where you’d been standing mere moments ago. Even from behind your cover, you feel the wave of scorching air wash outwards and over your [skin] as it passes, and only after you’re sure it’s passed do you carefully emerge, [weapon] at the ready, prepared to face your ambusher.", parse);
		Text.NL();
		Text.Add("<i>“I really shouldn’t give them any warning,”</i> a voice bleats from the ravine walls above you. <i>“But it’s so much <b>fun</b> watching them scurry and run like that - gives one  whole sense of satisfaction, if you know what I mean?”</i>", parse);
		Text.NL();
		Text.Add("No, actually, you don’t know what the bastard means. Looking up, you see a goat-morph perched precariously on the rocky ravine wall, completely unperturbed by how high up he is and probably very insecure footing. Two large ram’s horns curve back from his disheveled-looking hair and mane, his teeth look like they’ve got a mouthful of bad breath to accompany them, and he’s clad in what looks like a white smock - or at least, the tattered remains of what used to be one, damaged far beyond any reasonable repair by repeated spills, reactions and explosions.", parse);
		Text.NL();
		Text.Add("Most important of all, though, is the heavy belt he wears at his waist. Flasks and vials of all sorts have been stuffed in every conceivable nook and cranny and then some, along with a small bag stuffed with more bombs of the like which had been spent spiraling down at you. You can only wonder just what the vials hold - some of the liquids held within look very much disconcerting - but the most eye-catching bits are a pair of rod-like metallic implements that look vaguely like wands, but you can’t be certain that they’re so…", parse);
		Text.NL();
		Text.Add("Seeing you studying him, he gives you a cheery little wave and smile that’s anything but friendly. <i>“Hello there! I don’t suppose I could persuade you to take part in a couple of my experiments? You, of course, <b>won’t</b> be compensated for your time - well, not unless you’re into that kind of stuff, I guess. Yes? No? No? Oh well, guess I’ll just have to persuade you to go along, then. It’s for the sake of… well, discovery! Discovery, inquiry, and learning! What could be better than measuring the average circumference at which someone’s ass can gape?”</i>", parse);
		Text.NL();
		Text.Add("But… you haven’t answered yes or no to his question. Maybe you really <i>are</i> into that sort of thing. Who knows?", parse);
		Text.NL();
		Text.Add("The goat alchemist looks slightly puzzled at your reply, then brightens, hopping down from rocky foothold to rocky foothold without so much as missing a beat. <i>“Well, I <b>will</b> give you that it’s a technical possibility that you might be into being unethically experimented on, but hey, it’s so much more <b>fun</b> to blow prospective test subjects up into submission.”</i> He brandishes a couple of bombs. <i>“Don’t you agree?”</i>", parse);
		Text.NL();
		Text.Add("No.", parse);
		Text.NL();
		Text.Add("He shrugs and grins a mouth full of crooked, yellow teeth. <i>“Oh well, more’s the pity. I’m sure I can coax you into coming around to my way of thinking.”</i>", parse);
		Text.NL();
		Text.Add("<b>It’s a fight!</b>", parse);
		Text.Flush();

		Gui.NextPrompt(function() {
			enc.PrepCombat();
		});
	};

	/*
	enc.canRun = false;
	enc.VictoryCondition = ...
	*/
	enc.onLoss    = MaliceScoutsScenes.Goat.LossPrompt;
	enc.onVictory = MaliceScoutsScenes.Goat.WinPrompt;

	return enc;
};

MaliceScoutsScenes.Goat.WinPrompt = function() {
	const enc  = this;
	SetGameState(GameState.Event, Gui);

	const parse: any = {

	};

	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("The goat-morph alchemist lets out a plaintive bleat as you deal him a solid last blow, knocking him off his feet and onto the ground. He tumbles into a roll to try and avoid breaking any of his precious substances, which by some miracle all of which manage to survive the fall intact.", parse);
		Text.NL();
		Text.Add("…Screw this crazy guy. He was more than willing to blow you up to - well, who knows what goes on in the crazed, twisted mind of this rancid old has-been? Whatever “experiments” he had in store for you, they can’t have been anything good for you.", parse);
		Text.NL();
		Text.Add("So, what now?", parse);
		Text.Flush();

		//
		const options = [];
		options.push({nameStr : "Turn Tables",
			tooltip : Text.Parse("So, he was planning to experiment on you? Turnabout is fair play.", parse),
			enabled : true,
			func() {
				MaliceScoutsScenes.Goat.WinTurnTables(enc);
			},
		});

		/* TODO
		options.push({nameStr : "",
			tooltip : Text.Parse("", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
				Text.Flush();
			}
		});
		*/

		Gui.SetButtonsFromList(options, true, function() {
			Text.Clear();
			Text.Add("You definitely have better things to do than to deal with crazy old has-beens. If a solid beating hasn’t shaken loose some of the cobwebs from that mind of his, you doubt that anything else you might have the mind to do is going to change that. Besides, it’s not as if you can turn him in to the law, since out here in the highlands there really isn’t <i>any</i> law - and you’re not going to kill him, so that’s out of the question. It doesn’t feel <i>right</i> to be just leaving him like that, but no immediately better solution presents itself.", parse);
			Text.NL();
			Text.Add("Pausing to kick some sand onto the prone goat-morph and receiving a very satisfying bleat in reply, you turn and make your way through the remainder of the ravine without further incident.", parse);
			Text.Flush();

			Gui.NextPrompt();
		});
	});
	Encounter.prototype.onVictory.call(enc);
};

MaliceScoutsScenes.Goat.WinTurnTables = function(enc: any) {
	const player = GAME().player;
	const goat = enc.goat;
	let parse: any = {

	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);

	Text.Clear();
	Text.Add("Snorting, you step forward towards the randy, unkempt old goat and give the bastard a kick in his side just to make sure he stays down and tries no funny tricks. So, he was planning to use you as a guinea pig for whatever crazed experiments he had in mind, didn’t he? Has he ever come across the saying, “physician, heal thyself”?", parse);
	Text.NL();
	Text.Add("<i>“Don’t you touch that, you young whippersnapper!”</i> the old fart bleats as you reach down for his belt, but he’s powerless to prevent you from unbuckling it and sliding it off his waist. The contents already looked to be of questionable character, and a closer inspection of the various liquids and powders within the thick glass vials does nothing to alleviate your concerns about their integrity or legality.", parse);
	Text.NL();
	Text.Add("Taking a deep breath, you reach into one of the belt’s many pockets and pull out the first thing your fingers close down upon, which just so happens to be ", parse);

	// Pick one random option from the below, and follow on from there:
	const scenes = new EncounterTable();
	// Grow-it-big cream
	scenes.AddEnc(function() {
		Text.Add("a large, solid ceramic tub sealed with plenty of wax. It takes a little bit of tugging for you to finally get the seal open - it’s <i>almost</i> as bad as a pickle jar. Not exactly as bad, but pretty darn close - and it parts with a pop. The heavy scent of cherries rises from the tub’s contents - a light, rosy-pink salve that looks as light and fluffy as whipped cream.", parse);
		Text.NL();
		Text.Add("<i>“No, you fool!”</i> the goat alchemist bleats. <i>“You know not what you’re dealing with! There are forces at work here that are beyond the grasp of your simple mind to comprehend!”</i>", parse);
		Text.NL();
		Text.Add("You laugh. Of course you know what you’re dealing with - he wrote the contents himself on the side, didn’t he? Look - you point right at the alchemist’s spidery handwriting on the tub’s side - “grow-it-big cream”, and judging by the look of it, this stuff isn’t for growing plants, tentacles, or plant tentacles. Oh look, there’re a bunch of additional notes on the side, too - “needs testing to determine correct dosage”.", parse);
		Text.NL();
		Text.Add("<i>“Oh.”</i> A few seconds’ silence. <i>“Shit.”</i>", parse);
		Text.NL();
		parse.l = player.IsNaga() ? "your tail" : player.HasLegs() ? "a foot" : Text.Parse("your [legs]", parse);
		Text.Add("Now that you’ve called his bluff, the poor bastard tries to scramble away in earnest, but you pin him to the ground with [l] and grin.", parse);
		Text.NL();
		Text.Add("<i>“Seriously! You don’t want to touch that stuff! Not with your bare skin, that is. It’s… it’s… caustic.”</i>", parse);
		Text.NL();
		Text.Add("Which is why you’ve found this handy-dandy pair of gloves in one of the belt pouches as well. He really thinks of everything, doesn’t he? To be honest, you find it a little irksome that he’s more than willing to inflict upon others experiments that he wouldn’t submit to himself… but that’s karma, isn’t it? Without further ado, you slip on the cured-hide gloves, scoop two fingers in the cream and gather up a large lump - now, where’s the nearest spot on the old goat’s body? Ah, there’s a nice large gash in the front of his smock - not thinking twice of it, you reach down and splatter the cream all over the goat-morph’s hair and skin, rubbing it in by drawing large, slow circles with your fingertips.", parse);
		Text.NL();
		Text.Add("<i>“Damn you! Damn youu - oohhh…”</i>", parse);
		Text.NL();
		Text.Add("As the alchemist’s cries of protest turn into moans of reluctant pleasure, you notice a marked change begin where you smeared the cream. Slowly, gentle bumps begin to form on his chest, mass gathering under his skin and pushing outwards against the remains of his tattered smock as they pulse gently with growth. The goat alchemist moans and grabs his chest, almost as if trying to squeeze the developing mounds back into their original form, but his efforts are in vain; getting rounder and fuller with each tiny growth spurt, his chest rises like leavened dough until he’s sporting a nice pair of B-cup breasts. They still aren’t large enough for his nipples to thrust through his thick goat hair, but you can definitely see the latter’s outline marked on the new curvature of his freshly ballooned jugs.", parse);
		Text.NL();
		Text.Add("<i>“Curses! So much from so little? I - I must’ve forgotten to dilute the mixture again -”</i> Another wave of pleasure washes through the alchemist’s body, and he moans, fondling at his newly-grown breasts. <i>“Fuck you!”</i>", parse);
		Text.NL();
		Text.Add("Heh. With him as stinky and unkempt as he is, he’s probably got all sorts of nasty diseases on him anyway. Peering down, you take a moment to study the alchemist’s new feminine assets - they most certainly look rather incongruous on the goat; fresh and perky boobs without so much as the slightest spot of sag, attached to a rancid old has-been’s body. The goat alchemist looks mortified as you study the tub of cream in your hands, and wonder just what else it can do to him… or to you, for that matter.", parse);
		Text.NL();
		Text.Add("Still, you’ve got to keep him occupied and pliable while you think. Reaching down with a gloved hand, you proceed to sink your fingers into the alchemist’s freshly-grown boobs, smirking at the desperate bleats and gasps you extract from him as you squeeze and fondle away. He certainly isn’t used to sporting a pair of lady lumps, is he?", parse);
		Text.NL();
		Text.Add("But back to the point; it seems like you could use this cream to “enhance” one of your body parts, if you so desired. Alternatively, you could have some fun forcing the alchemist to suffer his little concoction, or you could just chuck this thing and be on your way.", parse);
		Text.NL();
		Text.Add("What will you do?", parse);
		Text.Flush();

		TimeStep({hour: 1});

		// Structure this as such: random opening for each of the four body parts, followed by body-part specific portion. Alchemist and leave have their own blocks altogether.

		const intro = function() {
			const scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("An idea begins forming in your mind, but your better sense grabs hold of you and shakes your consciousness silly until it’s sure you’re paying attention. Do you really want to do this? Apply to yourself the completely unverified and unvouched-for product of an old, nasty-smelling ruminant who in all probability hasn’t bathed for days?", parse);
				Text.NL();
				Text.Add("Of all the things you could be doing to yourself, is applying to yourself the concoctions of a very possibly deranged alchemist the wisest decision that you could be making at this juncture?", parse);
				Text.NL();
				Text.Add("Pfffft, why not? No matter what’s gone into this cream you’re holding in your hands now, it certainly can’t be crazier than some of the stuff that you’ve <i>seen</i> going into the so-called <i>reliable</i> potions. At this point, nothing can surprise you any more, can it? At least it’s topical and you’re not going to be expected to shove it down your throat like some disaffected hobo who eats everything he or she can get his or her hands on.", parse);
				Text.NL();
				Text.Add("With that thought in mind, you stick your fingers into the tub again and scoop up a large lump of cream. This had better be good…", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("You look at the tub in your hand. It doesn’t have eyes, but you get the feeling that it’s staring back at you - or at the very least, there’s a distinct burning gaze on your [skin], although that might be the alchemist.", parse);
				Text.NL();
				Text.Add("That’s beyond the point, though. <i>Use me!</i> the tub of cream seems to say to you. <i>What’s the worst that could happen?</i>", parse);
				Text.NL();
				Text.Add("Indeed, what’s the worst that could happen? Considering all the crazy things which alchemy can do these days - a potion for everything, as the saying goes - there are indeed a lot of terrible things this little tub of cream could conceivably do to you, but none of them have happened to the randy old goat at your [feet], at any rate.", parse);
				Text.NL();
				Text.Add("If nothing terrible happened to him, it shouldn’t to you, right? Right? It’s just a matter of figuring out the proper dosage, right? Nevertheless, you catch your breath as you dip your fingers into the tub once more and scoop out a dollop of grow-it-big cream.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("You turn the tub over in your hands once more and give its fine contents a hard look. Completely innocuous, isn’t it? And yet you’ve got a randy old goat lying on the ground sporting a fresh, perky pair of tits that any growing girl would be proud to have. Only this isn’t a growing girl, this is an old, smelly has-been, and he rolls a rheumy, bloodshot eye up at you as you handle the jar with the thick gloves you found.", parse);
				Text.NL();
				Text.Add("<i>“Careful with that thing,”</i> he groans, coughing a bit. <i>“The stuff in that tub’s probably more precious than everything you have on you combined.”</i>", parse);
				Text.NL();
				Text.Add("Oh, <i>really</i>.", parse);
				Text.NL();
				Text.Add("<i>“Yes, really, you young whippersnapper. Haven’t you noticed that there’s <b>cream</b> in the tub?”</i>", parse);
				Text.NL();
				Text.Add("So?", parse);
				Text.NL();
				Text.Add("<i>“It’s <b>cream</b>. You put it on your skin instead of drinking it and hoping for the best, like you do with almost everything else. It’s hard to imagine that in the whole history of the damned plane, I’m the only one who thought up the idea of having something that sticks to the skin in order to produce a much more localized effect, but there we have it. Guess people like putting things in their mouths too much to give it up.”</i>", parse);
				Text.NL();
				Text.Add("Huh. Come to think of it, <i>have</i> you actually come across something alchemical that wasn’t a potion? You’re pondering this train of thought when the goat alchemist pipes up again.", parse);
				Text.NL();
				Text.Add("<i>“What do you think? Eh? Eh? Pret-ty sm-art of me, I should say. Don’t you think? Don’t you think that’s the most awesome thing you ever heard of? A transformative you can put in a cream that you can actually apply on-point and in a controlled dose, instead of just swigging it down and hoping for the best? Eh? What? Eh?”</i>", parse);
				Text.NL();
				Text.Add("Goodness. You’ve just given this guy boobs, and all he can think of is bragging. Er, very good.", parse);
				Text.NL();
				Text.Add("<i>“Isn’t it?”</i> the goat alchemist continues to bleat, caught up in the moment of bragging to someone who actually appears to care, no matter how fleetingly. <i>“Isn’t it, though? Makes me all <b>excited</b>, I don’t mind telling you, just thinking about it. It’s a <b>cream</b>, you see.”</i>", parse);
				Text.NL();
				Text.Add("Yes. You, er, see. The goat alchemist blabbers on for a little while longer - talk about oblivious - but you go ahead and tune him out before scooping out another bunch of cream from the tub.", parse);
			}, 1.0, function() { return true; });
			scenes.Get();
			Text.NL();
		};

		// [Cock][Balls][Breasts][Vag][Alchemist][Leave]
		const options = [];
		if (player.FirstCock()) {
			options.push({nameStr : "Cock",
				tooltip : Text.Parse("Do you really have to think twice about this? Swab a batch on your [cocks].", parse),
				enabled : true,
				func() {
					Text.Clear();
					intro();
					if (player.NumCocks() > 1) {
						parse.all = player.NumCocks() > 2 ? "all" : "both";
						Text.Add("Although you’ve decided on what you want to do, you can’t help but heave a sigh when you look down at your [cocks]. Which one to start with, then? Unable to decide on which of your manhoods to treat first, you eventually settle for working the stuff in your hands to a slick and slippery lather, then grabbing [all] of them in your cream-slick palms and pumping them up and down, as if you were trying to jerk off a bundle of sticks. Up and down, back and forth - to be completely honest, the cream isn’t <i>too</i> different in texture from your average lube, and while it’s still a bit of a struggle to try and evenly coat each one of your shafts all over with a layer of sweet-smelling cream, it’s also easier than you expected.", parse);
						Text.NL();
						Text.Add("Of course, it also helps that the cream feels considerably pleasurable as it seeps into your [cocks], a sensation of warm fullness permeating in and suffusing your shafts to their very core. Between this and your zealous rubbing, it doesn’t take long for you to bring all of your man-meat to bear, full and ready for action.", parse);
						Text.NL();
						Text.Add("And then it begins. Pulsing and throbbing ever so slightly, veins sticking out on their surfaces like spiderwebs, you see your manhoods begin to grow before your very eyes, the shiny layer of alchemical cream rapidly absorbed into flesh as it fuels the uncanny growth spurt your malenesses are going through. Try as you might, you can’t help but utter a little cry as sensations of contentment wash out from the base of your [cocks], a myriad of lovers’ caresses stroking outwards from your groin and seeping into your lower belly. Before you know it, your [cocks] are twitching of their own accord - and you’ve upended a healthy dose of spunk all over the alchemist lying at your [feet], head thrown back and teeth clenched as each and every one of your shafts blasts away on rapid fire at the stinking old creep.", parse);
					} else {
						Text.Add("Yeah, you could do with a bit of enhancement down there. Size does matter, as the saying goes, and you’re not quite done with growing this little puppy yet. Taking the dollop of grow-it-big cream that you’ve gathered on your fingers, you swiftly apply it to the length and girth of your manhood, taking care to ensure that an even coating is applied to all exposed skin from base to tip. The stuff is surprisingly slick and slippery - come to think of it, it’s not too unlike lube - and before you know it, you’ve slipped into a steady back-and-forth motion in applying the stuff as if you were jerking yourself off.", parse);
						Text.NL();
						Text.Add("Which, let’s face it, is what you’re doing right now. It’s not just your fingers, it’s the cream as well, and a pleasurable tingling starts up in your [cock] as the alchemical cream settles in, the sensation moving in from the outsides and seeping deep into your flesh. You can’t help it - a groan escapes your lips unbidden as the entirety of your [cock] is transformed into an intensely sensitive pleasure-shaft, twitching furiously in the air as pre quickly gathers and oozes from its tip.", parse);
						Text.NL();
						Text.Add("Before long, it begins. The already visible veins on your stiff member seem to thicken and spread even further as your maleness develops in a matter of moments, the shiny sheen of magical cream on its surface absorbed into the skin to fuel the unnatural growth that’s taking place. It’s all you can do to grit your teeth, ride this one out, and hope you don’t scream your pleasure to the heavens even as you shudder and unleash your load straight onto the rancid old goat.", parse);
					}
					Text.NL();

					const cum = player.OrgasmCum();

					Text.Add("The alchemist moans weakly and tries to shield his face with his hands, but that’s pretty much all that he can do in his current state besides sputter and cough. Rope upon rope of steaming spunk splatters down upon him, getting in his tattered smock, in his hair, and even in his freshly formed cleavage.", parse);
					Text.NL();
					Text.Add("What’s more important, though, are the ongoing changes; with each burst of cum you expel from your [cockTip] and onto the alchemist, you can both see and feel your [cock] growing longer and girthier, as if this bout of exercise is causing it to swell like a well-trained muscle.", parse);
					Text.NL();
					if (cum > 5) {
						Text.Add("With the sheer size of the load that you’re currently dumping onto the alchemist, you’re probably going to end up with quite the swinger when all this is over. Already, the old goat’s entire body is covered with thick gobs of your sperm, having plastered him from head to toe; it slowly runs off his matted hair and collects in a puddle beneath him - which is becoming deeper by the second.", parse);
						Text.NL();
						Text.Add("Does he like his bath? He really hasn’t had one for a long, long time; he should really be thankful that you stopped by and gave him one. He’ll be all clean and green when he gets himself sorted out, you’re sure of that.", parse);
						Text.NL();
						Text.Add("<i>“Fuck… you…”</i>", parse);
						Text.NL();
						Text.Add("Oh no no, you get the distinct impression that as big as it is, you’re going to need your entire load for this, so there won’t be any left over for fucking afterwards.", parse);
					} else {
						Text.Add("String upon string of hot sperm splashes on the alchemist, and he bleats in his growing distress. You don’t quite have enough in you to give him an actual cumbath, but there’re still sufficient reserves in store to confer upon him a facial, a pearl necklace, and a lovely sheen of spunk on his freshly-grown lady lumps to go with his newfound femininity.", parse);
						Text.NL();
						Text.Add("It may not be much, but it’s more of a bath than he’s probably taken for a good, long while. He should be grateful to you that you’re blessing him with a pearly shower like this.", parse);
						Text.NL();
						Text.Add("<i>“Fuck… you…”</i>", parse);
						Text.NL();
						Text.Add("Hmm, try as you might, knowing what he was intending to do to you had you lost… you can’t quite seem to work up very much sympathy for this rancid old goat despite his current predicament. Whistling a merry tune, you simply stand back and relax as the last of the cream works its magic on your [cock], sending out a few more blasts of sticky seed straight onto the alchemist’s face.", parse);
					}
					Text.NL();
					if (player.FirstVag()) {
						Text.Add("The alchemist was as good to his word, though - this grow-it-big cream stuff is truly localized in its effect. Despite all that’s happened to your [cock] and the accompanying pleasurable sensations that flooded your body, your [vag] is hardly even so much as damp.", parse);
						Text.NL();
						Text.Add("Hmm, he may be crazy, but he seems to have done good work. Too bad he has to be such a rancid old bastard in the bargain.", parse);
						Text.NL();
					}
					Text.Add("At last, the final burst of seed strikes the goat’s face, and the flow finally stops - you’ve drained yourself as dry as a bone. Nevertheless, your insides keep on clenching for a few moments longer, unwilling or perhaps unable to figure out that the flow has abated at last. Looking down at your [cocks], you’re somewhat relieved that you didn’t just go the whole hog and splurge - that tiny bit of cream has added almost two inches and half an inch to your length and girth respectively.", parse);
					Text.NL();
					Text.Add("<i>“H-hey, what are you doing?”</i> the alchemist bleats as you toss the remainder of the tub over your shoulder and onto a nearby rock. The tub shatters, spilling its contents all over the grass, and the rancid old goat lets out a loud groan of dismay.", parse);
					Text.NL();
					Text.Add("<i>“Whippersnapper! Wastrel! Have you any idea how much that cost to make?”</i>", parse);
					Text.NL();
					Text.Add("You have a very good idea, which is exactly why you did that. Giving the cum-covered goat a big smile, you apply a swift kick to his side and trot away, leaving him to think about what he’s done - if such a thing is applicable to an old has-been like him.", parse);
					Text.Flush();

					TimeStep({hour: 1});

					const cocks = player.AllCocks();
					for (let i = 0; i < cocks.length; i++) {
						cocks[i].length.IncreaseStat(80, 2);
						cocks[i].thickness.IncreaseStat(15, 0.5);
					}

					Gui.NextPrompt();
				},
			});
		}
		if (player.HasBalls()) {
			options.push({nameStr : "Balls",
				tooltip : Text.Parse("Because everyone knows that the pair makes the man.", parse),
				enabled : true,
				func() {
					Text.Clear();
					intro();
					Text.Add("Right, no turning back now. Pulling down your [botarmor], you reach down and apply the cream you’ve gathered to your [balls]. ", parse);
					if (player.Balls().BallSize() >= 12) {
						Text.Add("With how large and weighty they already are, you have to use both hands to apply it with any reasonable speed and make sure that you get a more or less even coating of the sweet-smelling cream on your nuts. It’s not <i>difficult</i>, but it is tedious, and you’re sort of privately relieved when the job is done - especially with all the looks of barely restrained jealousy that the alchemist is shooting you. You’ve had to use a bit more than the original amount you scooped out from the tub in order to get everything slathered nicely, but there’s still plenty left over if it comes to that.", parse);
					} else if (player.Balls().BallSize() >= 8) {
						Text.Add("It’s not unpleasant, the sensation of the sweet-smelling alchemical stuff against your [balls] as you work in an even coating all over your nutsack. To be completely honest, the slightly greasy and oily feel to it distinctly reminds you of lube… and looking down at the rancid old bastard who concocted it, there’s a more than average chance that he intended just that.", parse);
					} else {
						Text.Add("Cupping your [balls] in your cream-filled hand, you roll them around in your palm, feeling the alchemical concoction cool and comforting against your sensitive nutsack as you work an even shine of the stuff around your seed factories. Slightly greasy and oily to the touch, there’s a distinct lube-like quality to it; given the sexual nature of the enhancing cream, you don’t doubt that this was completely intentional.", parse);
					}
					Text.NL();
					Text.Add("Gradually, the comforting coolness of the cream is replaced by an invigorating warmth that seeps into your [balls] from the outside, sharp enough for you to suck in a sudden breath as the first pulse of amorous sensation strikes you. When you look down, you notice that the thin sheen of cream on your [balls] is gone, absorbed right into the flesh to… well, do what it’s supposed to do, you figure.", parse);
					Text.NL();
					Text.Add("And it does. Once the heat fills the entirety of your groin, you feel your [balls] begin to swell, growing not just weightier, but denser as well - there isn’t <i>that</i> much increase in size, but you certainly feel more of a drag as you - hey, is the rancid old goat actually <i>staring</i> at your nuts as they grow? Why yes, he is - and despite his beaten and battered state, you can’t help but notice that he’s tenting his pants quite considerably, if you might say.", parse);
					Text.NL();
					Text.Add("Why, is he jealous? He shouldn’t be, really - after all, he can just head back and cook up some for himself. Or have there been… complications?", parse);
					Text.NL();
					Text.Add("The alchemist just harrumphs loudly and refuses to look you in the eye. Well, that’s his loss. Or maybe he’s not just plain jealous… well, not to worry, you won’t tell anyone about his secret turn-on, mostly because you don’t know anyone he knows.", parse);
					Text.NL();
					Text.Add("Another snort. Hah.", parse);
					Text.NL();
					Text.Add("Slowly, the growth begins to abate somewhat, and you go ahead and test your newly improved jewels. Yep, much better - it’s a good thing you didn’t use more than you did, though, considering the amount of growth that you got for that much cream.", parse);
					Text.NL();
					Text.Add("Welp, that’s that. Looking down at the rest of the cream, you shrug and toss it over your shoulder, eliciting a cry of dismay from the alchemist.", parse);
					Text.NL();
					Text.Add("<i>“Whippersnapper! Do you know how much that cost me to make?”</i>", parse);
					Text.NL();
					Text.Add("Yes, you had an idea, which is exactly why you did just that. You’d smash up the rest of his toolbelt as well, but you really don’t have the time to spare on tormenting an old has-been like him any further.", parse);
					Text.NL();
					Text.Add("The alchemist scowls furiously, but is unable to stop you as you turn and walk away, whistling a cheery tune as you do so. Maybe he’ll learn something from that… maybe not. You sure got something out of this encounter, though… assuming there aren’t any side effects from this stuff.", parse);
					Text.NL();
					Text.Add("Are there?", parse);
					Text.Flush();

					TimeStep({hour: 1});

					player.Balls().size.IncreaseStat(20, 1);
					player.RestoreCum(10);

					Gui.NextPrompt();
				},
			});
		}
		options.push({nameStr : "Breasts",
			tooltip : Text.Parse("Your rack could do with a little enhancement…", parse),
			enabled : true,
			func() {
				Text.Clear();
				intro();
				if (player.FirstBreastRow().Size() > 10) {
					Text.Add("Hmm. You consider your [breasts] for a moment - sure, they’re large and weighty, but hell, you could do with even bigger ones. Looking down at the nice perky pair of Bs you’ve given the bleating bastard lying before you, you’re pretty sure that even though you have a pretty good thing already going, it can still be improved further with a healthy application of some cream from this little tub.", parse);
				} else {
					Text.Add("Hmm. Well, considering the nice pair of lady lumps that the cream has produced on the goat alchemist’s chest, you can only wonder what it can do for you. You <i>do</i> suppose that you could do with some additional heft - and if the results before your eyes are any indication of the final result, then you won’t just be getting a boost in quantity, but quality as well. What’s not to love?", parse);
				}
				Text.NL();
				Text.Add("Before you can second-guess yourself again, you quickly pull aside your [armor] from the neckline down, your [breasts] easily pushing their way out of their confines with their release, presenting themselves for your attentions. Grimacing, you push your cream-laden fingers against the firm, springy flesh of your lady lumps, kneading away with considerable vigor as you try to get an even coating of the cream on every bit of exposed skin.", parse);
				Text.NL();
				Text.Add("It doesn’t take long for the first changes to set in. The cream is silken smooth to the touch and slightly warm to boot, a warmth that quickly seeps in through your [skin] and collects just above the breastbone beneath. The heated tenderness is more than a little pleasurable, and soon enough you begin groping yourself in earnest, little moans escaping your lips as your [breasts] grow increasingly sensitive. Even though you haven’t paid that much attention to them yet, your [nips] are full and standing at attention, faint, ghostly tingles from them signaling their receptiveness for affection.", parse);
				Text.NL();
				Text.Add("Despite all this, though, your [breasts] haven’t actually changed any - up to the point where a sudden rush of heat fills your chest and sends your milk makers rushing outwards by about a full cup size. Unlike the slow swell that happened to the alchemist, the changes are over in a matter of seconds, leaving you hot under the collar and gasping for breath.", parse);
				Text.NL();
				Text.Add("Not that the alchemist himself hasn’t been busy, either. The randy old goat has pulled down his pants and whipped out his cock, jerking himself off furiously while his eyes are trained on your ballooning bust.", parse);
				Text.NL();
				Text.Add("So, huh, he likes it when boobs grow in his face, eh? The only answer you get to that is a plaintive bleat from the stinking old goat as he writhes in place and a measly load plops out the head of his dick.", parse);
				Text.NL();
				Text.Add("Well, guess that answers your question well enough, doesn’t it? With the alchemist out of commission and lying in a panting heap on the ground, you toss down the tub and gloves by his side and test your newly-improved tits with a finger. Yep, they’re not just bigger - there’s a definite increase in fullness and perkiness too, punctuated by a pleasant tingling.", parse);
				Text.NL();
				Text.Add("Huh. Looks like it actually worked - and that was quite the change for the small amount you used. Doesn’t seem like there’re any side effects, either, save for the nagging desire at the back of your mind to go ahead and give someone, <i>anyone</i> a boobjob, but even that is fading as you push your [breasts] back into your [armor] and prepare to be on your way.", parse);
				Text.Flush();

				TimeStep({hour: 1});

				_.each(player.AllBreastRows(), function(breasts) {
					breasts.size.IncreaseStat(50, 1);
				});
				player.AddLustFraction(0.4);

				Gui.NextPrompt();
			},
		});
		if (player.FirstVag()) {
			options.push({nameStr : "Vag",
				tooltip : Text.Parse("Not the first thing that comes to mind, but it should work.", parse),
				enabled : true,
				func() {
					Text.Clear();
					Text.Add("Hand halfway to your groin, you pause for a second and consider what you’re about to do. Sure, this isn’t the sort of thing that usually comes to mind when one thinks of growing things bigger, but technically it should work, right?", parse);
					Text.NL();
					Text.Add("Right?", parse);
					Text.NL();
					Text.Add("You throw a glance at the alchemist, but the rancid old goat seems overly obsessed with the new pair of tits that he’s sporting; besides, even if you had his attention, you get the feeling that he wouldn’t give you a straight answer anyway.", parse);
					Text.NL();
					Text.Add("Fine. Instead of rolling the cream in your palm, you slam your other fist into it and grease - yes, there’s a distinctly oily and slippery feel to the cream that reminds you of lube - and rub it all over the outsides of your fingers, grinding your knuckles into your hands to ensure you’ve got an even coating of the stuff on the glove.", parse);
					Text.NL();
					Text.Add("Now comes the hard part - actually applying the stuff where it’s needed. Taking a deep breath, you mentally go through the steps of what you need to do next, then go ahead and bend over. ", parse);
					Text.NL();
					// TODO GROWTHRATE RANK
					const dexrank = player.dexterity.GrowthRank();
					if (player.IsFlexible() || dexrank >= 15) {
						Text.Add("Fortunately for you, you’re the fairly limber kind of person, so going through the contortions needed in order to get into position to fist yourself is no problem. As your gloved hands come into contact with your pussy lips, you feel a tingle of warmth emanate from them, worming its way up into your lower belly and sending shivers down your spine.", parse);
						Text.NL();
						Text.Add("No time to be hesitant now. Your cunt parts as you gather your strength and push against them, and before you know it, you’re in.", parse);
					} else if (dexrank >= 10) {
						Text.Add("You might not be the clumsiest of people, but even so, the dexterity required for you to be able to fist yourself to the extent you desire is no small feat. You have to widen your stance a little more than you expected in order for you to get your hand in position, and as you do you can’t help but “accidentally” grind your knuckles against the lips of your womanly flower, smearing just a tiny bit of the cream onto their sensitive folds.", parse);
						Text.NL();
						Text.Add("The rush of heat and throbbing blood that funnels into your pussy lips takes you by surprise and leaves you stunned for a moment, quickly followed by a gnawing urge for more. Well, since you were going to be about that anyway, you waste no time in cramming your cream-coated fist into your warm, wet depths, eager to see what happens next.", parse);
					} else {
						Text.Add("It’s true that you’re not the most limber of people about, but when there’s a will, there’s a way. Bracing yourself against a nearby boulder, you slowly ease yourself into a position more suited for well and truly fisting yourself as deeply as possible. Your muscles complain in a low, achy tone as you make the necessary contortions, but eventually give way as you position your cream-coated fist at the mouth of your love-tunnel, almost-but-not-quite-touching as you gather your strength for the final insertion.", parse);
						Text.NL();
						Text.Add("Knowing what you’re about to do to yourself, your pussy has started to grow just a little damper in response, and you can’t help but finger the petals of your womanly flower tenderly, daubing a bit of the alchemical cream onto the moist folds. The moment that happens, a surge of erotic heat ripples outwards from your cunt lips, traveling up the length of your love-tunnel and sending back a slick coating of juices in response.", parse);
						Text.NL();
						Text.Add("Yes, there’s little point in putting this off any longer - your body is as ready as it’ll ever get. Letting out a quiet murmur of pleasure, you literally punch your way through your cunt and into your depths, your insides greedily swallowing your gloved fist, cream and all.", parse);
					}
					Text.NL();
					Text.Add("Out of the corner of your eye, you notice the alchemist watching you intently, his narrow black eyes not leaving the action as you begin to pump your hand in and out of yourself. He probably hasn’t noticed it himself, but the look on his face, coupled with the fact that his freshly acquired breasts look slightly bigger and firmer… and ah, yes, he’s also tenting his pants.", parse);
					Text.NL();
					Text.Add("Hey, does he like watching you that much? Maybe you could see if there’s something in his belt that could grow a cunt on him, so that he can join you as well…", parse);
					Text.NL();
					Text.Add("<i>“No, thanks,”</i> comes the hasty reply. <i>“Actually, I don’t have anything like that on me, I’m absolutely and utterly completely sure of that.”</i>", parse);
					Text.NL();
					Text.Add("That’s a very convincing reply - not. You’d pursue the matter further, if not for the distracting fact that you’ve got a lubed-up, gloved hand stuck in your cooch. That, and you’re starting to <i>really</i> feel the cream starting to do its work, tiny electric tingles working their way into your inner walls and traveling outwards into your hips.", parse);
					Text.NL();

					const cap = player.FirstVag().Capacity();

					if (cap >= Capacity.gaping) {
						Text.Add("The transformative takes hold almost immediately after, spreading outwards to fill the entirety of your stretchy womanhood. You’re unable to hold back a lewd moan as your cunt becomes ever more prominent and defined, the petals of your womanly flower swelling and thickening, glistening with arousal and need. They’re so plump and thick, they’re beginning to look almost kissable… you hold that thought in mind for a little longer, then lose it as yet more orgasmic sensations crash into you. Flowing ever further into your flesh, you can’t help but start feeling quite literally hollow as your mound protrudes ever further, growing more and more prominent as it struggles to hide all the excess vaginal flesh that you’re gaining.", parse);
						Text.NL();
						Text.Add("Last but not least are your hips - as the cream’s magical effects seep deeper into your body, you feel a strange yet calming and pleasant tingling sensation as your [hips] widen some more, helping to accentuate and enhance your figure but also more importantly, give you some much-needed space to take advantage of your increased stretchiness and fit even larger things within you.", parse);
					} else if (cap >= Capacity.loose) {
						Text.Add("The moment the changes hit, you go cross-eyed and bite your lips as a wave of orgasmic pleasure washes over you bottom up, sending clear girl-cum oozing out from between your wrist and cunt lips as you come dangerously close to losing it there and then. Nevertheless, you manage to hang on and keep standing as your inner walls greedily absorb the magical cream to fuel their development.", parse);
						Text.NL();
						Text.Add("Even as your [vag] clamps down on your fist in a vice-like grip, you can see your cleft slowly swelling, growing more pronounced and defined by the moment. That’s just on the outside, of course - inside, you can definitely feel yourself deepening, flesh parting as it grows more muscular and elastic.", parse);
						Text.NL();
						Text.Add("The final area of change is, surprisingly, in your hips - as the tingles from earlier reach your hip bone, you can feel it reform and widen, shifting your stance slightly. This confuses you for a bit until you realize that there’s no point in having a massive womanhood if your hips aren’t wide enough to make use of that added girth in order to fit bigger things in you more comfortably.", parse);
					} else {
						Text.Add("With a sudden shudder and outpouring of clear girl-cum, you feel a little more hollow as your sex starts to deepen, inner walls spasming and clenching at your fist and forearm as they swiftly react to the cream’s special properties. You were quite tight before - perhaps overly so - but the cream seems to have changed that, at the very least. Although there’s no obvious change save perhaps a slight swelling of your mound as it accommodates the extra vaginal flesh, a little probing and prodding leaves little doubt that you’re definitely more able to stretch, and a little deeper to boot.", parse);
					}

					player.FirstVag().capacity.IncreaseStat(15, 0.5);
					if (cap >= Capacity.loose) {
						player.body.torso.hipSize.IncreaseStat(HipSize.VeryWide, 0.5);
					}

					Text.NL();
					Text.Add("Caught up in the frenzy of sensation, your body works on automatic, mindlessly pistoning your fist in and out of your cunt as all the alchemical cream smeared on the outside of the glove is greedily consumed to fuel your cunt’s rapid growth. Clear, slick fluids flow freely down your wrist and across your [thighs], your womanly flower overflowing with nectar and staining your [skin] with slippery, glistening fluid - this feels <i>so</i> much better than it usually does, and you have little doubt it’s all thanks to the cream.", parse);
					Text.NL();
					if (player.FirstCock()) {
						parse.w = player.NumCocks() > 1 ? "worms" : "a worm";
						Text.Add("The alchemist wasn’t kidding about the selectiveness of his cream’s effects, either. Despite your entire body being enraptured by feminine needs and urges, your [cocks] remain[notS] as limp and flaccid as [w] on a hot day. With all the additional effects which come with so many potions, something as targeted as this could really make a pretty coin or two on the market - if the rancid old goat could ever convince anyone to buy his wares. Oh well.", parse);
						Text.NL();
					}
					Text.Add("On his part, the alchemist continues to have his eyes glued on you, and he’s now openly stroking himself off to the sight of you applying the cream to your cunt, his hand pumping furiously with a meaty - if not big - shaft firmly in his grip. Well, since he was so kind to provide the cream for you, there’s no reason you can’t be just a <i>bit</i> merciful and let him have a smidgen of fun; making sure he’s watching well, you begin to gyrate your hips even as you impale yourself on your forearm over and over again. Wet, sucking noises sound in the air as your glistening pussy lips suck and slurp at your skin, and it’s so <i>good</i>, especially since they’re thicker and plumper than before.", parse);
					Text.NL();
					Text.Add("It’s too much for the rancid old goat to bear. With a plaintive bleat that echoes through the ravine, his eyes roll back into his head and his whole body spasms as a steaming stream of sticky, stinking spunk lets loose from his much-scarred cock, arcing through the air and landing on the ground in a disgusting mess. Eww, he should really consider using his own products, make himself at least look a little better.", parse);
					Text.NL();
					Text.Add("Finally, though, the last of the shocks and tingles fade, and you’re left panting and exhausted, standing in a puddle of your own sexual fluids. For what it’s worth, there’s little doubt that you’re noticeably stretchier than before, and the trip there wasn’t all that bad, either. Smiling dreamily to yourself, you toss the remainder of the cream over your shoulder and hear a very satisfying crash as the ceramic tub shatters into a million pieces.", parse);
					Text.NL();
					Text.Add("<i>“No, you fool! Do you know how much that cost me to make, both in reagent costs and time?”</i>", parse);
					Text.NL();
					Text.Add("Of course, that’s why you did it. If he treasures his little concoctions so much, maybe he could consider actually finding volunteers for his experiments instead of lying in wait in the wilderness to make “volunteers” out of unsuspecting travelers. Reaching down, you give his softening dick a good hard slap, making him bleat in pain, then turn your back on the old has-been and are on your way.", parse);
					Text.Flush();

					TimeStep({hour: 1});

					Gui.NextPrompt();
				},
			});
		}
		// Alchemist
		options.push({nameStr : "Alchemist",
			tooltip : Text.Parse("Yeah, you’re not using this stuff on yourself. Him, though…", parse),
			enabled : true,
			func() {
				Text.Clear();
				Text.Add("Yeeeah. Seeing what just a small handful of this stuff has done to the alchemist, you look down at the rest of the tub in your hands and a wry smile comes to your lips. There’s no way you’re going to be using any of this stuff on yourself, not after that - but the alchemist himself, though, he looks like he could use some more enhancement - quite a lot of it, in fact.", parse);
				Text.NL();
				Text.Add("Maybe it’s your attitude, maybe it’s the nasty gleam in your eye, but one way or the other the rancid old goat senses that you’ve got a bad time in store for him and tries to crawl away hand over foot. That, however, is easily stopped when you simply cross over and place yourself in his path, putting ", parse);
				if (player.HasLegs()) {
					Text.Add("a foot", parse);
				} else if (player.IsNaga()) {
					Text.Add("your tail", parse);
 } else {
					Text.Add("yourself", parse);
 }
				Text.Add(" directly in his path.", parse);
				Text.NL();
				Text.Add("Going somewhere?", parse);
				Text.NL();
				Text.Add("<i>“Away from you, creep.”</i>", parse);
				Text.NL();
				Text.Add("Oh, you don’t know. He was the one planning to bomb random travelers into submission to force-test his alchemical concoctions on them, and <i>you’re</i> the creep? So, he thinks you’re a creep? Oh, too bad he had the misfortune to come across you today. Normally, you try to tone down your creepiness, but you’ll make an exception just for him and show him just how creepy you can be!", parse);
				Text.NL();
				Text.Add("Carefully, you set the tub of grow-it-big cream down on a rock out of the alchemist’s reach, and bend over such that you’re looming ominously over the old bastard, your shadow falling on him like a wave of darkness over the land. After taking a second or two to ensure that he’s watching, you curl your fingers and make what can only be described as grabby hands, wiggling your fingers as you reach for his newly-shaped breasts. He’s unable to put up much of a resistance as you sink your fingertips into his newly blossomed boobies and start to knead and grope away, sending him into a writhing, rutting frenzy.", parse);
				Text.NL();
				Text.Add("Mm, he likes that, doesn’t he? With someone like him, you’re sure he’s done his share of gropings before, but has he ever been on the receiving end?", parse);
				Text.NL();
				Text.Add("He doesn’t say anything, but his widening eyes and increasingly impassioned cries and grunts tell you all you need to know. Well then, time to truly break him into the wonderful world of gropings. You turn it up to eleven, kneading and pounding away like some kind of possessed freak, and the alchemist bleats even louder in ecstasy, his eyes rolling into his head.", parse);
				Text.NL();
				Text.Add("Yes, yes, he likes it so much, you bet he wouldn’t mind if he had <i>more</i> of his bosom to better receive pleasure, wouldn’t he? Reaching around with your [foot], you kick the tub of grow-it-big cream right back within reach, and pause your shameless molestation for a moment to grab a large handful of the sweet-smelling stuff.", parse);
				Text.NL();
				Text.Add("Heh. Does he know what this is?", parse);
				Text.NL();
				Text.Add("<i>“No! Yes! No!”</i>", parse);
				Text.NL();
				Text.Add("After you’re done with him, he’ll be the perkiest, most tantalizing trap for miles around. To make it all the better, you’ll do this to him with no mercy whatsoever - because he sure as hell wasn’t about to show you any, was he?", parse);
				Text.NL();
				Text.Add("<i>“No! No! I was totally about to show you mercy and -”</i>", parse);
				Text.NL();
				Text.Add("He’s a terrible liar, does he know that? Next time, perhaps he should consider the context of the situation before spouting nonsense; it would really help him. Without further ado, you dip your fingers into the tub of cream, scoop out a huge dollop of the strawberry-scented stuff and splatter a good portion of it onto the alchemist’s freshly-blossomed bosom, watching it jiggle enticingly as you give it a solid slap for good luck. If only you weren’t wearing gloves… but you’d rather not risk any of the stuff getting where it shouldn’t.", parse);
				Text.NL();
				Text.Add("Closing his eyes and shuddering from head to toe, the old goat unthinkingly arches his back and pushes his chest out and forward, presenting his breasts to you and inadvertently making them seem larger than they are. You grin as you realize he’s quickly settling into a more slutty role - although whether this is some repressed part of his psyche brought forward by the presence of boobs, or some side effect of the cream, you don’t know?", parse);
				Text.NL();
				Text.Add("Who cares? By the looks of him, the alchemist sure doesn’t. The old goat pants heavy and hard, his breasts rising and falling with each heaving breath he draws. Rising and falling, rising and falling, swelling bigger and fuller with passing moment, the shapely and undeniably feminine curves of a bosom becoming more pronounced and defined…", parse);
				Text.NL();
				Text.Add("Another plaintive bleat, and you notice a spreading stain on the goat alchemist’s tented pants. Seems like he’s gone ahead and “wet” himself, so to speak - and you aren’t even halfway done yet. As his newly-formed breasts have grown, their rate of development has slowed somewhat - he’s now just under a C - but it’s still going strong.", parse);
				Text.NL();
				Text.Add("Seems like you should help things along, then. You make grabby hands, reach for the alchemist’s firm bosom, and proceed to utterly and thoroughly molest him once more. It actually <i>does</i> seem to work as you can actually <i>feel</i> those milk-makers swelling and growing under your fingers, stretching skin and hair alike as they continue to rise from his chest.", parse);
				Text.NL();
				Text.Add("At last, the inevitable happens: the old goat’s chest hair parts, and a pair of nipples rise from beneath, pink and perky nubs that would be the pride of any young woman. You grin and give each of them a flick in turn, eliciting another exhausted groan from the alchemist.", parse);
				Text.NL();
				Text.Add("<i>“No… I’m sorry… I don’t know how much more I can take…”</i>", parse);
				Text.NL();
				Text.Add("Well, he should have thought of that <i>before</i> he went ambushing people in ravines, shouldn’t he! This is science of the sort he was all too willing to embrace - he should be glad you’ve volunteered his body to further the progress of the alchemical sciences!", parse);
				Text.NL();
				Text.Add("Kneading and pounding, kneading and pounding, you work the alchemist’s breasts like bread dough, with much the same effect. Eventually, when all of the cream you’ve put on has been absorbed, the poor bastard is sporting a pair of heavy Ds - just under DDs, to be precise. With so much mass accumulated therein, they can’t help but wobble and jiggle a little every time he moves.", parse);
				Text.NL();
				Text.Add("There, that should do it. Just for good measure, you rub each nipple between thumb and forefinger again, eliciting another pained bleat from the alchemist as the stain on his pants grows ever-bigger.", parse);
				Text.NL();
				Text.Add("<i>“What am I going to do now? Everyone’s going to laugh at me when I get back!”</i>", parse);
				Text.NL();
				Text.Add("Why should you care? He’s an alchemist, he can fix himself up. And let’s face it - he looks a <i>lot</i> better with a big, perky pair of tits than without, wondrous hemispherical humps that bounce and jiggle and entice. And just for good measure…", parse);
				Text.NL();
				Text.Add("Grabbing hold of the waistband of the alchemist’s pants, you rip them off with a flourish, trying to not look too closely at the massive goat boner that pops out at you. Emptying the rest of the tub in hand, you slather all of it onto the the alchemist’s hips. He kicks feebly at you with his hooved feet, but you eventually manage to get all of it onto him in a more or less even coating.", parse);
				Text.NL();
				Text.Add("This change is far swifter than the last - barely a minute’s passed before he’s sporting a pair of hips that most women would kill for.", parse);
				Text.NL();
				Text.Add("There, a perfect trap! Now if he’s lucky, he’ll be able to make it back to wherever it is he calls home before something or someone else takes an interest in him.", parse);
				Text.NL();
				Text.Add("The alchemist tries to say something, opening and closing his mouth a few times, but eventually settles for a lusty moan and wriggles on the ground.", parse);
				Text.NL();
				Text.Add("There, there. He should really try to keep still and quiet, or else something might come to see what all the fuss is about. The last thing he wants to have happen to him is to be subjected to public use, yes?", parse);
				Text.NL();
				Text.Add("Not waiting for a reply, you toss the empty tub over your shoulder, pull off the borrowed gloves, and are well on your way through the ravine without so much as a second thought.", parse);
				Text.Flush();

				TimeStep({hour: 1});

				Gui.NextPrompt();
			},
		});

		Gui.SetButtonsFromList(options, true, function() {
			Text.Clear();
			Text.Add("Huh, you think you’ve taught the old bastard a good enough lesson. Oh, there’s little doubt he can brew something to fix himself up, being an alchemist and all, but you have the distinct feeling that he’ll be turning some eyes - and inciting some laughter - before he manages that.", parse);
			Text.NL();
			Text.Add("Still, you can’t help but toss the tub over your shoulder, letting the contents spill onto the ground, then give the goat alchemist’s brand-new breasts a few more gropes, rolling the warm weight about in your palm until he breaks and moans like a cheap alley whore. Hell, he even looks the part, so it’s really quite fitting, and it’s keeping his mind occupied while you pilfer the remaining contents of his belt for anything that’s recognizably useful.", parse);
			Text.NL();
			Text.Add("Maybe now he’ll think twice about waylaying people for his “experiments”, you think to yourself as you stop away. And if not, maybe the pain will suffice to keep him from more shenanigans.", parse);
			Text.Flush();

			Gui.NextPrompt();
		});
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("a sizeable cylindrical object that looks like - oh why yes, it <i>is</i> a dildo. By the looks of the tapered tip and addition of a knot near the base, it’s a rather canine one in design. On the surface, it doesn’t <i>look</i> any different from your average dog-inspired sex toy, but there’s a certain something or the other about it that drives you to inspect it further.", parse);
		Text.NL();
		Text.Add("<i>“What are you doing?”</i> the alchemist bleats. You kick some dirt onto the old bastard to shut him up, and continue your investigations.", parse);
		Text.NL();
		Text.Add("Hmm, interesting. A number of small metal buttons have been set into the base just below the knot, and you inspect them further. All of them are labeled, with some of them being self-explanatory, such as “tie”, but others are more esoteric. Whatever “extendo grip” and “drill mode” mean, you’re not quite sure you want to find out by being subjected to them…", parse);
		Text.NL();
		Text.Add("…On the other hand, there <i>is</i> someone here whom you could use to sate your curiosity - and you get the feeling that he’d have used this on you without any compunctions, so it’s not going to be any problem if you turned his own contraptions on him.", parse);
		Text.NL();
		Text.Add("What do you do now?", parse);
		Text.Flush();

		const options = [];
		// [Use][Don’t Use]
		options.push({nameStr : "Use on him",
			tooltip : Text.Parse("You really DO want to know just how this works…", parse),
			enabled : true,
			func() {
				Text.Clear();
				Text.Add("Riiight. The dildo looks so interesting - and with so many buttons to boot - that you can’t help but want to see just how it works. Besides, you’ve got a helpless subject here who you can freely experiment on without any moral qualms whatsoever, so why the hell not?", parse);
				Text.NL();
				Text.Add("At the very least, you’d like to give the alchemist a taste of his own medicine, so to speak.", parse);
				Text.NL();
				Text.Add("Right then, chop chop. There’s only one hole on this guy in which this’ll fit, so time to get at it - actually coming into contact with the smelly old bastard isn’t the best of plans, because to say that he’s unpleasant to the touch would be a great understatement - but the thought of what you’re about to do keeps you going and determined. Besides, the stupid bleat the old goat lets out when you rip down the seat of his pants and expose his quivering ass for all to see is rather satisfying, if you might say so.", parse);
				Text.NL();
				Text.Add("He knows what’s coming, doesn’t he? So much so that you’re pretty certain this was amongst the things that he was planning to do to you, yes?", parse);
				Text.NL();
				Text.Add("<i>“You’ve no way of proving that!”</i>", parse);
				Text.NL();
				Text.Add("Hah. Perhaps, but he pretty much admitted it with those words, didn’t he? The alchemist wriggles and kicks with all his might as you hold him in position - face down on his knees with his exposed ass high in the air and presented neatly to you - but when it comes down to it, all his might isn’t quite enough to throw you off. You give his butt cheeks a few pokes with the doggy dildo’s tip as a warm-up of sorts, then look closer at the array of buttons on the dildo’s base.", parse);
				Text.NL();
				Text.Add("Oooh. What does <i>this</i> button do? You hover your finger over a small button labeled in tiny, spidery lettering: “red rocket rotator”. It calls out to you, beckoning, tempting… “push me!”, it seems to say. Frankly, it’s taking you a Herculean force of will to not just give in and press the button over and over and over again just to see what it does.", parse);
				Text.NL();
				Text.Add("<i>“Is that what I think it is?”</i> the old has-been bleats, a note of desperate fear entering his voice. <i>“Because if it is, you really, really shouldn’t touch it -”</i>", parse);
				Text.NL();
				Text.Add("Well, that was all the encouragement you needed to grasp the dildo’s handle firmly in your fingers and jam down hard on the button with your thumb.", parse);
				Text.NL();
				Text.Add("Oopsie! Butterfingers, honest!", parse);
				Text.NL();
				Text.Add("<i>“No! Fool! Do not push that butto-”</i>", parse);
				Text.NL();
				Text.Add("With an ominous whirr from deep within, the dildo’s head begins to rotate on its shaft - slowly at first, but rapidly spinning faster and faster as it begins to pick up speed. A thin coating of lube - no doubt from a reservoir within the handle - begins oozing from its tip, running down its sides and getting it all wonderfully slick and shiny.", parse);
				Text.NL();
				Text.Add("Faced with such a wonder of alchemical tinkering, you can’t hold back any longer - it’s just like a particularly gripping novel; you’ve got to see just what’s going to happen next. Taking aim at the old goat’s exposed pucker, you thrust your arm forward and jam the dildo’s revolving head straight into your target.", parse);
				Text.NL();
				Text.Add("The moment the two meet, the old goat lets out a massive, pained bleat that echoes down the entirety of the ravine; he wriggles desperately as the doggy dildo’s tapered end violates his back door, whirring all the while. Flecks of lube are thrown into the air as the old bastard’s sphincter is stretched wider and wider by the dildo’s girth - for a moment, you think that this isn’t going to work, that things are going to get stuck, but the lube does its job well enough and by and large you manage to get most of the tapered head in even as it’s revolving. The alchemist squeals like a pig in a poke, futilely shaking his ass in a bid to get free of the torturous implement, but your hold is firm and the revolving dildo stays in.", parse);
				Text.NL();
				Text.Add("He’s an ass virgin, isn’t he? With how tight he is, you don’t doubt it one bit - well, he’ll get used to it soon enough. You do have to wonder, though - just what was going through his mind when he actually <i>made</i> this thing? Yeah, sure, he might be a bit crazed, but you’re pre-tty sure that no one’s <i>that</i> crazed in order to go ahead and do something like… this. Not without help, anyway.", parse);
				Text.NL();
				Text.Add("<i>“...Commission…”</i>", parse);
				Text.NL();
				Text.Add("Oh, a commission, was it? And what was he paid in? Party powder? No, don’t tell. Hmm, it looks like he’s gotten pretty used to the revolving tapered tip by now - maybe it might be a good time to up the ante, then. Let’s see what you can do with another button…", parse);
				Text.NL();
				Text.Add("<i>“Fuck you… chafing…”</i> the old goat groans.", parse);
				Text.NL();
				Text.Add("Chafing? Oh well, maybe he should have added a better lube, then. They always say that the first time hurts, don’t they? Or maybe he should’ve thought of that <i>before</i> he went out ambushing random people in ravines to be unwilling test subjects? Never thought that one might turn the tables on him, did he? Now, about that button…", parse);
				Text.NL();
				Text.Add("He groans, and it’s not in pleasure.", parse);
				Text.NL();
				Text.Add("…Perhaps you’ll try this one, then. Your thumb finds another button, and the dildo begins to vibrate back and forth in your hand - and his ass. If the old goat’s squealing was bad before, the sounds he’s now making are beyond belief, wailing and wiggling about as his breadth of experience and asshole alike are similarly expanded. You can only wonder if this thing here has a “thrust” function - maybe it does, but it’s no fun having all the work done for you. Grinning madly, you begin pumping your arm back and forth, pistoning the dildo up and down the length of his back door. Alas, the knot is simply too large for it to fit inside no matter how much you cram it against the old goat’s sphincter, so you just leave it at that and merrily proceed apace.", parse);
				Text.NL();
				Text.Add("With such vigorous stimulation applied to the old goat’s insides, you aren’t surprised when his body begins acting of its own accord, humping and grinding against the vibrating doggy dildo in a lustful frenzy. Hairy and bony his ass may be, but he nevertheless rocks back and forth against the toy’s thick length, making bleating noises that sound alternately as if he’s in both pleasure and pain at the same time.", parse);
				Text.NL();
				Text.Add("And then it happens. Unable to withstand the furious milking any longer, the alchemist prostate gives way, and the old goat cries out as a stinking, steaming pool rapidly forms under him, soaking his pants all the way and leaving him kneeling in a pool of his own cum. He has barely enough time to recover when a second orgasm grips him, causing his puddle of release to grow ever larger.", parse);
				Text.NL();
				Text.Add("Huh, you didn’t know that he had that much in him. Appearances can be deceiving - maybe he has more left in there? You’re tempted to leave the dildo in there for a bit longer, see just how much cum can be wrung out of him…", parse);
				Text.NL();
				Text.Add("<i>“N-no! Please! N-no more!”</i>", parse);
				Text.NL();
				Text.Add("He’ll have to speak up, you can’t quite hear him straight. Was that something about him wanting more?", parse);
				Text.NL();
				Text.Add("He tries to give a reply, but manages little more than a handful of moans and mumbles before giving up and slumping in the puddle of his own cum.", parse);
				Text.NL();
				Text.Add("Oh well. Your arm’s getting quite tired holding the dildo in place, anyway - with such an enthusiastic display on his part, your wrist is already starting to ache a little. Best to stop before you get a full-blown wrist ache… and yet he looks like he hasn’t had enough yet, judging by the way he’s wiggling his butt at you.", parse);
				Text.NL();
				Text.Add("Hmm, what a conundrum. You think a moment, and then your eyes fall back upon the old goat’s toolbelt. Could it… why yes, it looks to be just about the right size for that. Straining to keep the dildo in with one hand while reaching out with the other, you barely manage to hook a couple of fingers about the toolbelt and draw it close. Yeah, there’s the buckle, and those are the straps… with a little jury-rigging, you manage to tie the toolbelt about the alchemist’s hands, looping them in place while using the rest of the material to wrap about his butt and hold the vibrating, rotating dildo in place. It’s not very secure - to be honest - but with the dildo keeping the alchemist’s gaping butthole occupied, you doubt he’ll be able to muster the will to free himself from his predicament.", parse);
				Text.NL();
				Text.Add("Bet he feels fine now, doesn’t he?", parse);
				Text.NL();
				Text.Add("The rancid old bastard moans, his mind mostly lost in pleasure now. You smile and give him a rub on his horns, then stand up and turn to leave. He’ll have to remain like this until either the doggy dildo’s power runs out, or someone finds him down here in this ravine and sets him free from his misery… although by the looks of him, he’s finally come around to the quiet glories of being pegged.", parse);
				Text.NL();
				Text.Add("Chuckling to yourself, you gather up your things and prepare to leave. The faint buzz of the toy still lodged on the alchemist’s ass follows you all the way out, and while you’d love to stay and see what happens next, you’ve got other things to do and places to go.", parse);
				Text.Flush();

				player.AddSexExp(2);

				TimeStep({hour: 1});

				Gui.NextPrompt();
			},
		});

		options.push({nameStr : "Don’t Use",
			tooltip : Text.Parse("You have a bad feeling about this. Just drop the doggy dildo and walk away.", parse),
			enabled : true,
			func() {
				Text.Clear();
				Text.Add("Hmm. As much as you’d like to see what exactly <i>this</i> is capable of, you just plain don’t feel like a little scientific experimentation today. Mercy… yeah, it’s a fun thing, maybe you’ll show a little.", parse);
				Text.NL();
				Text.Add("Taking the intricately crafted doggy dildo in hand, you toss it to the ground and stomp on it a few times, then a few more for good measure. It’s surprisingly fragile, its thin wooden casing coming apart easily to reveal springs, gears, and other mechanisms within - just what sort of daredevil would actually <i>want</i> all this inside him or her?", parse);
				Text.NL();
				Text.Add("Well, that question won’t be coming into play now. The alchemist lets out a cry of dismay as you smash the dildo to bits, which you guess is punishment enough if you’re not going to be using it.", parse);
				Text.NL();
				Text.Add("<i>“Have you any idea what you’ve done?”</i>", parse);
				Text.NL();
				Text.Add("Destroyed something which took a long time to build and likely highly valuable, thus pissing him off to no end? Why yes, you have an idea of what you’ve done, and he should be thankful you weren’t in a particularly creative or vindictive mood today. With that, you kick some more dirt on the old goat, then spin on your proverbial heel and leave him in your wake.", parse);
				Text.Flush();

				Gui.NextPrompt();
			},
		});
		Gui.SetButtonsFromList(options, false, null);
	}, 1.0, function() { return true; });

	/* TODO other items
	scenes.AddEnc(function() {
		Text.Add("", parse);
		Text.NL();
		Text.Add("", parse);
	}, 1.0, function() { return true; });
	*/

	scenes.Get();
};

MaliceScoutsScenes.Goat.LossPrompt = function() {
	const player = GAME().player;
	SetGameState(GameState.Event, Gui);
	Text.Clear();

	// this = encounter
	const enc = this;

	let parse: any = {

	};
	parse = player.ParserTags(parse);

	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("Triumphant, the alchemist looms over you, fingering his toolbelt with barely restrained anticipation and glee. <i>“Now, I could say that this was an exercise in tedium, but to be honest I’m glad you got your blood flowing and body all limbered up. Cuts down on the time spent waiting around for results to show up.”</i>", parse);
		Text.NL();
		Text.Add("Now that the old goat is so close, you really can’t escape his rancid stink anymore. It distinctly reminds you of something of a cross between old cheese and rotting fish, and you have to wonder just exactly how long it is since this idiot last bathed.", parse);
		Text.NL();
		Text.Add("<i>“Don’t worry,”</i> he continues. <i>“I’d like to think that I’m a very ethical experimenter - there’s little point in making irreversible changes or permanently impairing potential test subjects, it makes acquiring the next one all that more difficult. Now, let’s see what I wanted to take a look at here…”</i>", parse);
		Text.NL();
		Text.Add("The alchemist pats at his toolbelt, chewing at his lip with his buckteeth until he flips open a small pouch and his hands close in upon a ", parse);
		MaliceScoutsScenes.Goat.LossEntry(enc);
	});
	Encounter.prototype.onLoss.call(enc);
};

MaliceScoutsScenes.Goat.LossEntry = function(enc: any) {
	const player = GAME().player;
	let parse: any = {

	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);

	// TODO More Loss Scenes
	const scenes = new EncounterTable();

	// Tentacle Pet
	scenes.AddEnc(function() {
		const tentacock = new Cock();
		tentacock.type = CockType.tentacle;
		tentacock.length.base = 50;
		tentacock.thickness.base = 8;

		Text.Add("small box about the size of two clenched fists laid side by side. Small, greyish and metallic, and completely nondescript, its exterior bearing no hint of what might be inside.", parse);
		Text.NL();
		Text.Add("<i>“I managed to make a little friend by the lake the other day. It’s got some rather strange appetites, and I think you might want to meet it.”</i> He sniggers in a most unpleasant way. <i>“It likes making new friends. It has potential, but I’d like to study its habits in a little more detail.”</i>", parse);
		Text.NL();
		Text.Add("With that, he flips open the box’s lid, and it opens with a creak before he sets it down on the ground. Nothing happens for a little while longer, and then you hear something… something <i>sloshing</i> about in the depths of the box. For something that fits into so small a container, it sure is making a lot of noise…", parse);
		Text.NL();
		Text.Add("<i>“I’m sure it’d like to get to know you better. It sure did a handful of the mares back at camp.”</i>", parse);
		Text.NL();
		Text.Add("The sloshing sounds continue to grow louder and louder, until at the last something oozes its way out of the box’s lid, hanging loosely over the edge - the tip of a single tentacle. This is rapidly followed by the rest of it, followed by another, and another, and another, until you’ve got a total of eight tentacles protruding from the box, waving about in the air and testing their surroundings.", parse);
		Text.NL();
		Text.Add("You gulp.", parse);
		Text.NL();
		Text.Add("It seems impossible that all <i>that</i> could have come from within the tiny box, but if anything could, then this would be it - the goo-tentacles look like they could be distinctly squishy and pliable when need be - as opposed to their current firm and turgid forms…", parse);
		Text.NL();
		Text.Add("<i>“Quite the marvel, isn’t it? Everyone knows that goo-girls live in the lake, but this is something else altogether! Maybe it’s why those goos stick around the lake instead of migrating upstream? It even grows from cuttings, like a plant! Oh well, I’ll just sit back and leave the both of you to it! If you need me, I’ll just be way back over there, taking… notes! That’s right, taking notes!”</i>", parse);
		Text.NL();
		Text.Add("The goo tentacles dart closer, flowing even further out from their box, and you’re able to get a better look at your impending violation. Each of them is a clear, transparent blue, perhaps one and a half-times as girthy as your arm but far, far more dexterous. The shapes of their ends vary - most of them have smooth, tapered tips, but two of them sport phallic heads, and a third is ribbed with bands of gelatinous material, undulating and pulsing rhythmically as beads of moisture drip off its length - or at least, you can only assume it’s moisture and not something else altogether. Their smooth surfaces ripple and shift as they surge and slither towards you, quickly closing the distance over the thin, gravelly soil.", parse);
		Text.NL();
		Text.Add("In the blink of an eye, it’s got you trussed up in its cool and unpleasantly pliant appendages. One tentacle whips out, coiling its length about your ankles and binding them tight; the other does the same with your wrists, effectively immobilizing you.", parse);
		Text.NL();
		Text.Add("<i>“This little guy appears to feed on fluids,”</i> the alchemist remarks as he makes himself comfortable on a nearby boulder and brings out a sketchpad. <i>“I’ve tried a number of things… milk, alcohol, even plain water, but he seems to enjoy sexual fluids the most.</i>", parse);
		Text.NL();
		Text.Add("<i>“And with my experiments as they are, I usually don’t even have to go out of my way to feed it - one way or the other, it keeps on coming across the yummiest, tastiest food. No wonder the little guy likes sticking by me. I’ve never considered myself much of a naturalist, but I’ve been reconsidering that of late. I may be getting on in years, but it isn’t too late to go dabbling into another field, yes?”</i>", parse);
		Text.NL();
		Text.Add("As he speaks, two more of the tapered-tip tentacles took themselves about your ", parse);
		if (player.Armor() || !player.LowerArmor()) {
			Text.Add("[armor]", parse);
		}
		if (player.Armor() && player.LowerArmor()) {
			Text.Add(" followed by your ", parse);
		}
		if (player.LowerArmor()) {
			Text.Add("[botarmor]", parse);
		}
		Text.Add(" with practiced ease - either the goo tentacles instinctively know how to go about divesting people of their clothing, or it’s had a <i>lot</i> of practice doing such. The cool tips brush against your [skin] gently, their touch cold at first, but quickly blossoming into a supremely erotic warmth that quickens your pulse and leaves you gasping for breath.", parse);
		Text.NL();
		Text.Add("<i>“Oh, I almost forgot to mention,”</i> the alchemist quips as the tentacle beast rips your [armor] off and flings it away. <i>“My little pet here also secretes a rather nasty contact venom. Not the most potent, that’s for sure, but it does what it’s meant to very well, for an aphrodisiac.”</i>", parse);
		Text.NL();
		Text.Add("An… oh. OH. By now, the tentacles about your ankles have worked their way up your legs and are very securely coiled about your thighs, spreading more of that slick venom on your body. It’s getting hard to think straight… or of anything but lying back in surrender and allowing yourself to be utterly violated over and over by this magnificently phallic beast. Panting and groaning in anticipation of what’s to come, you’re unable to resist as the tentacles wrench your thighs apart, held as securely as if you were locked in a pair of spreader bars.", parse);
		Text.NL();
		Text.Add("With that, it begins.", parse);
		Text.NL();
		if (player.FirstCock()) {
			Text.Add("Already achingly stiff from the aphrodisiac’s effects, your [cocks] ", parse);
			if (player.NumCocks() > 1) {
				Text.Add("are already obscenely aroused and swollen from the goo tentacles’ venom, a powerful desire to unload your seed already welling up in your groin, growing by the second. The beast seems surprised to find such a brace of malenesses in one place - perhaps it thinks it’s found another of its kind? - and proceeds cautiously, sending a single probing tentacle to wrap about each of your shafts one by one, testing their [cockTip]s before moving onto the next one.", parse);
				Text.NL();
				Text.Add("The tentative tickling only serves to turn you on even more, and before long you’re straining at the clear tentacles, your [cocks] throbbing and bobbing in their restraints even as you mindlessly hump away, your lusts amplified by the copious amounts of aphrodisiac venom being directly applied to your manhoods.", parse);
				Text.NL();
				Text.Add("At last, the beast seems to make up its mind as to what it wants to do. Though your cloudy vision, you see yet another tapered tentacle quiver and quake, its end splitting apart into a stretchy, worm-like orifice. This it rapidly attaches to the nearest of your shafts, latching onto the tip with a pop and suckling away with a powerful suction.", parse);
			} else {
				Text.Add("twitches and throbs in time with your heartbeat as the aphrodisiac venom directly applied to it takes effect, increasing your burgeoning desire to empty your seed onto - well, you really don’t care where it ends up, so long as it’s out from you.", parse);
				Text.NL();
				Text.Add("The goo tentacles take their time in growing your arousal, gently caressing and rubbing with those stretchy, slimy appendages.", parse);
			}
			Text.NL();
			Text.Add("You can’t take any more, and howl out loud in pure bliss. The goo tentacles have you right where they want you - controlling you like a poppet through your rod - and know just what to do for you to go along obediently with their plan. The open tentacle suckles hard on the [cockTip] it’s attached to, greedily slurping up every last drop of pre-cum you produce, an appetizer in anticipation of the main course yet to come.", parse);
			Text.NL();
			Text.Add("Despite your urgent arousal, you’re denied your release just yet. Oh no, that would probably be too easy… and you get the feeling that this goo beast is saving the best for last.", parse);
			Text.NL();
			player.AddSexExp(1);
		}
		// mouth block
		Text.Add("Without you noticing, one of the moist, slimy tentacles has worked its way to mouth, taking advantage of your distraction in resisting your bindings to creep up on you. Before you know it, one of the thick, phallic tentacles has forced its way between your lips and pushed aside your tongue, quickly numbing your gag reflex and slipping down your throat.", parse);
		Text.NL();
		Text.Add("For some reason… it tastes like mint. Well, mint isn’t so bad - for a mysterious, slime-coated tentacle, it could have had a much worse flavor. Strawberries, perhaps.", parse);
		Text.NL();
		Text.Add("Leaving you just enough room to breathe, the phallic tentacle begins facefucking you, sliding up and down your throat - up all the way until its bulbous tentacle-head is just inside your mouth, what possibly passes for its urethra ticking the roof of your palate, then diving in deep. More than a little confused, you bite down on the goo tentacle more than once, but the pliant jelly flows seamlessly about your teeth and inflates itself, forcing your jaws apart again.", parse);
		Text.NL();
		Text.Add("It’s just so big, so thick… and the aphrodisiac minty slime that moistens its surface is making you ever hornier and hornier, especially since it’s being applied directly to the insides of your throat. Throwing a glance at the alchemist, the crazed old goat has gleefully dropped his pants and is shamelessly beating himself off to the sight of you being trussed up and violated like this. Hell, he isn’t even pretending to take notes anymore, instead rocking back and forth on the boulder he’s sitting on, pumping his hand up and down, only stopping occasionally to add more lotion from a small flask from his belt.", parse);
		Text.NL();
		Text.Add("By now, even more clear blue tentacles have emerged from the box, writhing and pumping in the air in fits of excitement as they slither towards you, eager to join their fellows. Seems like you’re in for yet more fun…", parse);
		Text.NL();
		player.AddSexExp(1);

		const womb = player.PregHandler().Womb();
		const preg = womb && womb.pregnant;

		// breast block
		if (player.FirstBreastRow().Size() > 7.5) { // D
			Text.Add("Indeed, you steadily become aware of yet another cool slickness wrapping itself about your ", parse);
			if (preg && womb.progress >= 0.4) {
				Text.Add("pregnant, bulging", parse);
			} else {
				Text.Add("slender", parse);
			}
			Text.Add(" waist, coiling itself about you securely before the phallic tip slides along your ribs and nudges the underside of your ample cleavage. Electrifying tingles run through your [breasts] as it pushes again and again, applying a little more force each time, daubing a little more aphrodisiac slime onto the bottom of your lady lumps with each pass.", parse);
			Text.NL();
			Text.Add("N-no… try as you might, you can distinctly feel heat building in your face as the underside of your [breasts] finally parts, allowing the turgid tentacle to delve into your cleavage from the bottom. You can feel it working its way upwards, pushing aside your lady lumps as it pulses and undulates accordingly, and then the tentacle’s phallic tip bursts out from the top of your cleavage, bumping against your chin as it worms about and tastes the air.", parse);
			Text.NL();
			Text.Add("Caught in the tentacles’ slimy embrace, you feel your half-lidded eyes begin to droop further as your breasts jiggle and shake, wobbling about from the tentacle’s fervent thrusting. You can <i>feel</i> the blood rushing to your chest, feel your mammaries and nipples swell ever so slightly with the hot flush of excitement, and the anticipation brought on by your body clearly preparing itself for <i>something</i> is maddeningly arousing.", parse);
			Text.NL();
			if (player.Lactation()) {
				Text.Add("Having aroused you sufficiently, the tentacle caressing your [breasts] bends in upon itself with inhuman flexibility, more of its length surging up until there’s enough length for its head to be level with your [nips]. You suck in a sharp breath and slowly let it out around the tentacle in your mouth as the tentacle’s phallic head parts, opening up like the petals of a flower to reveal a hungry, maw-like orifice that wastes no time attaching itself to the nearest swollen nipple, engulfing the pleasurable little nub of flesh and swallowing it whole along with the surrounding raised areola.", parse);
				Text.NL();
				Text.Add("Tears spring to your eyes, but they’re not ones of pain; your body takes on a life of its own and thrashes against its slippery bindings as you make muffled noises of ecstasy in the back of your throat. Accompanying the rhythmic suckling of the tentacle tip is yet more of the constant back and forth of its length in your cleavage, your ample jugs trailing its movements and making you fully aware of just how weighty they are upon your chest.", parse);
				Text.NL();
				if (preg && womb.progress >= 0.4) {
					Text.Add("With how delicate your pregnancy has made your [breasts], you can’t even begin to try resisting the tentacle as it slurps and suckles away, stealing the enriched milk that’s intended for your unborn progeny. Sure, you’ll just make more <i>and</i> it feels so <i>good</i> to be milked like this, but still…", parse);
					Text.NL();
					Text.Add("The pumping on your nipples grows more intense, your breastflesh seeming to grow warm as you feel your milk let down in earnest, and the last of the reservations is swept from your mind as convulsions wrack your body in a beautiful, blissful boobgasm.", parse);
					Text.NL();
					Text.Add("Spirits above, you want this so badly. Mindlessly, you thrust your ample chest out at the tentacle, catching the creature by surprise and causing it to double take; it nevertheless swiftly recovers and reciprocates the gesture as eagerly. You want to be milked, to be suckled dry, not just here and now by this goo-tentacle-beast, but also when you finally birth the fruit of your womb. You just want to be a literal milk-maid, giving suck to an endless legion of feeders, your ever-full mammaries instilling orgasm after orgasm for all eternity.", parse);
					Text.NL();
					Text.Add("Is this just the aphrodisiac venom talking, or is it you? Who cares? More and more rich white cream flows outwards from your fat, engorged nipples, traveling down the goo’s translucent tentacles before finally disappearing into its main body, and the mere sight gives you a rush of excitement and fulfillment that leaves you groaning and sighing like the milk slut that you’re becoming.", parse);

					player.slut.IncreaseStat(75, 2);
				} else {
					Text.Add("With you all trussed up like this, you couldn’t resist even if you wanted to; your limbs feel as if they’ve been turned to jelly, with all the strength having left them. Slurping and suckling, the tentacle drinks every last drop of fluid it can wrangle from your milk jugs - you can actually <i>see</i> the stuff traveling down its translucent insides back into the box - before moving onto the next and doing the same.", parse);
				}
				Text.NL();

				player.MilkDrain(25);

				Text.Add("It seems like forever before the tentacle has drained you dry, but it eventually manages the task and detaches from your nipple, its “mouth” closing back together into its old phallic shape with a wet slurp. As far as you can tell, it looks quite pleased with the meal it’s just had - but still hungry for more.", parse);
			} else {
				Text.Add("Having aroused you to breaking, the tentacle gently prods at your nipples and areolae, caressing the diamond-hard nubs and making you ache with desire. It seems to be probing, questing for something, yet it can’t have found what it was looking for, since it withdraws at length, looking almost disappointed.", parse);
				Text.NL();
				Text.Add("Nevertheless, it tries a few more times, rubbing its head against your sensitive and heated breastflesh until it’s sure that whatever it was looking for isn’t there and retreats.", parse);
				Text.NL();
				Text.Add("Either way, being deprived of one thing isn’t stopping the goo beast any. You do, after all, have so many other soft, fleshy parts to be toyed with, and the tentacles get to exploring them with swift efficiency, perhaps to make up for time lost in this momentary diversion.", parse);
			}
			Text.NL();
			player.AddSexExp(1);
		}
		// vag block
		if (player.FirstVag()) {
			Text.Add("At last, it’s time for the ribbed tentacle to make its move. For some reason, there’s only one of these, and as you look on in your aphrodisiac-fueled stupor, you quickly realize why. The tentacle is actually <i>growing</i> before your eyes, gaining in girth even as the ribs along its length stand out even further from its main body, slick and rigid, just waiting to be used.", parse);
			Text.NL();
			Text.Add("Without further ado, the tentacles spread you even further apart, a cool brush of Highlands air greeting your dripping cunt as it’s fully exposed for all to see. All the stimulation up to this point leaves little doubt as to the nature of your aroused state, and without further ado, the gigantic ribbed tentacle slithers its way up your inner thigh and pauses just outside your pussy. You wonder if it’s going to tease you for a bit - no, clearly it thinks you’re wet enough already, for it rams itself into your waiting cooch.", parse);
			Text.NL();

			if (player.FirstVag().Tightness() < Orifice.Tightness.gaping) {
				player.FirstVag().stretch.base = Orifice.Tightness.gaping;
			}

			Sex.Vaginal(null, player);
			player.FuckVag(player.FirstVag(), tentacock, 1);

			Text.Add("You squeal in a mixture of equal parts pain and pleasure as you strain to accommodate the massive ribbed tentacle in your cunt. No matter how stretchy you are - or not - the tentacle can simply add more mass to make the fit painfully tight, which it does with gusto. The tentacles on your thighs reaffirm their hold on you, spreading more venom on your [skin], then begin bouncing you up and down on the massive, ribbed tentacle.", parse);
			Text.NL();
			Text.Add("If you weren’t gaping before, you are now. With how wet you are - considerably wetter than you remember yourself being under any normal circumstances - the passage of the tentacle into your love-tunnel is easier than it otherwise might have been, but it’s still by no means easy. Somewhere in the back of your mind, in a place that’s not completely occupied with how <i>good</i> the tentacle feels as it squirms and undulates in you, you realize that the goo beast’s venom must be causing the extra wetness in your cunt. After all, it’s feeding off your fluids, and the more pleasure it gives you, the more food it receives…", parse);
			Text.NL();
			Text.Add("Your thoughts are cut short by a powerful pounding between your legs - it seems like in addition to being impaled, the tentacle has begun thrusting, too. The goo may be normally pliant, but the thing inside you is gloriously strong and hard as it rams into you again and again, filling every bit of space you have available in you as it bottoms out against your womb. It doesn’t try to go any further, but that’s more than enough for you to see your mound bulge dangerously as it’s stuffed full up, your now-hypersensitive inner walls keenly feeling the ribs on the tentacle each and every time it slides along your slick cunt.", parse);
			Text.NL();
		}
		// ass block
		Text.Add("Last but not least, there’s still your ass which needs dealing with - and the slime tentacles aren’t about to leave an empty orifice unexplored, no. A particularly bulbous phallic tentacle crawls out from the box, a massive knob on the tip of an exceptionally girthy goo appendage. It pauses in front of you for a moment, almost as if to make sure you’re watching, then dives around behind you and out of sight. You can’t see where it’s going, but you can definitely <i>feel</i> the tentacle as its massive head forces its way into your [anus], violating you in every way imaginable - and then some.", parse);
		Text.NL();

		Sex.Anal(null, player);
		player.FuckAnal(player.Butt(), tentacock, 1);

		if (player.Butt().Tightness() >= Orifice.Tightness.loose) {
			Text.Add("Good thing that you did all that anal training, for it finally paid off today! There’s a little - well, admittedly a lot of - discomfort as the tentacle worms its way into you; it’s a very tight fit, but your sphincter is strong and brave, stretching wide to admit the tentacle’s head without running the risk of tearing. Even the goo itself seems surprised at this, twisting to and fro like a corkscrew as it explores the insides of your butt, but calms down once it realizes you’re the one with the problem, not it.", parse);
			Text.NL();
			Text.Add("Eventually, the two of you come to some sort of compromise: the tentacle pumps more fluid into its tip until it’s snug inside you - but not overfull - and you don’t resist too much.", parse);
		} else {
			Text.Add("Twisting and turning like a giant corkscrew, the bulbous tentacle takes a perverse pleasure in forcing its way into you, prying apart your poor asshole and causing you to stretch torturously in order to accommodate its massive girth. You feel like you’re being torn asunder as more and more goo pulses and flows into your back door, several whole sessions of anal training compressed into the short space of a mere few moments.", parse);
			Text.NL();
			Text.Add("It’s not over, though. Once the bulk of the tentacle is firmly sequestered in your rectum, you feel it begin to swell even further, filling you up and stretching you out until you’re groaning and gasping at the sheer sensation of being stuffed to the absolute brim.", parse);
			Text.NL();
			Text.Add("Yeah… if you weren’t gaping before, then you’re now. Either way, there’s no doubt that you’re going to be walking funny for the next few days…", parse);
		}
		if (player.Butt().Tightness() < Orifice.Tightness.gaping) {
			player.Butt().stretch.base = Orifice.Tightness.gaping;
		}

		Text.NL();
		Text.Add("Surprisingly, though, the tentacle doesn’t seek to push itself any further into your back door - or move very much at all, for that matter. All it does is just sit in your behind and occupy every single last jot of space that you have to spare, pulsating gently every few moments.", parse);
		Text.NL();
		Text.Add("The movements may be slight and subtle compared to what’s just happened to you, but it’s nevertheless strangely arousing. Besides, there’s little doubt that your bowels have already been given a thick coating of the beast’s aphrodisiac venom, which is certainly helping things along…", parse);
		Text.NL();
		// orgasm block
		Text.Add("With you being stuffed from both ends and in every available orifice, it’s a small miracle that you haven’t effected a release already. Instead, the tentacles’ pounding and caressing keeps you constantly on the brink, teetering on the edge but unable to fall over or get secure footing.", parse);
		Text.NL();
		Text.Add("To say it’s frustrating would be the understatement of a lifetime. You wiggle about in the crushing goo coils, trying to find that last brush, that last touch that’ll finally grant you sweet, sweet release, but it maddenly eludes you despite your best efforts. Seems like you’ll only get to get off when the goo beast allows you to, and not one moment earlier.", parse);
		Text.NL();
		if (player.FirstCock()) {
			Text.Add("You can feel your [cock] twitching rapidly within the tentacles’ coils", parse);
			if (player.HasBalls()) {
				Text.Add(", your [balls] tightening and drawing together as they prepare to send their cargo up and out", parse);
			}
			Text.Add(", desperate for the release that’s swaying just out of your reach.", parse);
			Text.NL();
		}
		Text.Add("The alchemist on his part, can’t take it anymore. Letting out a loud bleat, he jerks his hips forward even as his balls contract, ready to unload their contents in your general direction.", parse);
		Text.NL();
		Text.Add("<i>“Oh yes!”</i> he groans, his eyes squeezed shut as his hand pumps up and down his erect member in a blur. <i>“Fucking yes!”</i>", parse);
		Text.NL();
		Text.Add("Another bleat, and the rancid old goat lets loose a torrential stream of stinking, steaming spunk arcing into the air. Thankfully, it doesn’t have the power to actually reach you, but most of the vile stuff lands on the tentacles, which quickly absorb it. That which lands on the ground is quickly mopped up by yet more tentacles, leaving nothing behind but a very sated old goat. One of the tentacles wanders over to his exposed prick, perhaps seeking more food, but he pushes it away with a hand and sighs in satisfaction. The tentacle doesn’t persist in its attentions, instead more than happy to just sink down onto the gravel and suck up the seed from the ground.", parse);
		Text.NL();
		Text.Add("<i>“Best show I’ve had in a while now,”</i> he says, panting. <i>“Props to the both of you - you’ve furthered my research quite a bit today. Credit’s where credit’s due, after all, and I’m not <b>completely</b> heartless.”</i>", parse);
		Text.NL();
		Text.Add("That’s a nice thought, isn’t it?", parse);
		Text.NL();
		if (player.FirstVag()) {
			Text.Add("<i>“Perhaps,”</i> the old goat continues, <i>“my only regret is that I’m not the one pounding that cunt of yours, but I guess I’ll just have to vicariously experience it through my little pet here. Not the best, perhaps, but it’ll do. It’ll do.”</i>", parse);
			Text.NL();
		}
		Text.Add("Every bit as cool and slick as the moment they first grabbed you, the tentacles slither across your [skin], and you feel… <i>something</i> shift within their depths. All of a sudden, all that pent up need and hunger come rushing to the fore, swamping your brain with a mind-blowing blast of orgiastic pleasure. Spots swim before your eyes as white-hot flashes erupt in their sockets, and you feel faint and dizzy as your body is gripped by automatic instinct to fulfil its primal desires.", parse);
		Text.NL();

		const cum = player.OrgasmCum(2);

		if (player.FirstCock()) {
			Text.Add("The first part of you to give way is your [cock]. Painfully erect and unyielding, it ", parse);
			if (player.HasBalls()) {
				Text.Add("works in tandem with your balls, the former throbbing and pulsating as the latter grows ever tighter, clenching and unclenching as all the spooge it’s held up in reserve to this point is brought to the fore.", parse);
			} else {
				Text.Add("twitches and trembles ominously, liquid fire surging upwards from its base as you prepare to finally unload everything you’ve got.", parse);
			}
			Text.Add(" No more pre - this is the real deal, and the tentacles know it. Sensing that more food is near, ", parse);
			if (player.NumCocks() > 1) {
				Text.Add("more and more gelatinous tentacles attach themselves to your remaining shafts, desperately suckling away in a bid to not waste so much as a single drop of your seed.", parse);
			} else {
				Text.Add("the goo tentacle attached to your manhood sucks away all the more, encouraging you to make your consequent load a big, big one.", parse);
			}
			Text.NL();
			Text.Add("It’s like you’ve been offered a small slice of heaven itself. How you never noticed it before, you’re not quite sure - from your point of view, everything that’s happened in the last hour or two has melded into a fluffy pink haze - but the inside of the goo is so warm and divine. It’s almost like - no, <i>better</i> than an actual pussy, and with such encouragement and the go-ahead from the goo-beast, you finally get to blow your load with a muffled cry.", parse);
			Text.NL();
			if (cum >= 9) {
				Text.Add("Even the tentacle beast is taken aback by how, ah - <i>productive</i> you are. Faced with the torrent of spunk that blasts forth from your [cocks], the tentacle[s] [hasHave] trouble channeling all of your sperm back into the beast’s main body hidden in the box. Rope after rope of thick white splooge shoots out in a non-stop barrage, threatening to overwhelm the tentacle[s] - you can see huge bulges of sticky white stuff traveling along the clear, flexible appendage[s], the difference in girth plain for all to see. The layer of goo that separates the tentacles’ insides from their outsides grows dangerously thin - if it’s possible for something as pliant as a goo beast to overstuff itself, well, this is it.", parse);
				Text.NL();
				Text.Add("Unfortunately - or perhaps fortunately - for you, the goo beast knows better than to bite off more than it can chew, allowing for some of your seed to overflow and spill onto the rocky ground, only for more tentacles to swarm over and mop up the mess before it can seep into the earth. The sheer determined efficiency with which the thing is feeding is a sight to behold, especially in the face of such overwhelming odds.", parse);
				Text.NL();
				Text.Add("Well, if it wants a reprieve, it’ll have to work for it - especially when this is the only way in which you can fight back. Clenching and squeezing, you close your eyes, bite down hard, and concentrate on your groin, pumping every last drop of sperm that you’re worth into the tentacles attached to your [cocks].", parse);
				if (player.HasBalls()) {
					Text.Add(" It gets so that you can actually <i>feel</i> your [balls] deflating by the moment, and you desperately hope that you still have enough reserves in you to keep up this deluge for a little while more yet.", parse);
				}
				Text.NL();
				Text.Add("It works. It’s beyond all hope and belief, but it works. Overwhelmed by the sheer rate at which you’re pumping out cum, the goo tentacle[s] hurriedly pop[notS] free of your manhood[s] and beat[notS] a quick retreat lest [itThey] split[s] from the obscene amount of spunk you’re sending down [itThem]. Victorious, you let out a muffled yell about the tentacle in your mouth and thrust your hips forward, allowing the last of your sperm to freely jet through the air like water from a fire hose, glistening globules of white arcing upwards and landing on the stony ground with a splat.", parse);
			} else if (cum >= 6) {
				Text.Add("Letting loose a long, lurid groan, you empty ", parse);
				if (player.HasBalls()) {
					Text.Add("your balls", parse);
				} else {
					Text.Add("yourself", parse);
				}
				Text.Add(" straight into the tentacle[s] busily slurping away at you. It looks like the goo beast hasn’t had a meal this filling in a long, long time, and is particularly ravenous. Then again, that’s not really surprising considering that the old goat of an alchemist doesn’t look like the most conscientious of pet owners - the bastard probably forgets to feed it on a regular basis.", parse);
				Text.NL();
				Text.Add("Well then, seems like it’s up to you to take responsibility for someone else’s pet. Caught in the cool, fluid embrace of the goo beast, your [cocks] twitch[notEs] and pound[notS], each thump of blood in your extremities sending tingles of numbing pleasure racing down your shaft[s] and into your body. You can actually <i>see</i> ", parse);
				if (player.NumCocks() > 1) {
					Text.Add("thin lines of white running down each of the tentacles, passing through them like a bunch of bendy straws", parse);
				} else {
					Text.Add("a thin line of white running down the tentacle, passing through it like a bendy straw", parse);
				}
				Text.Add(", and the simple sight gives you an overwhelming sense of satisfaction.", parse);
				Text.NL();
				Text.Add("Despite the copious amount of spunk that you’re producing, the creature seems to have no trouble at all in containing the lot, and you’ve definitely shot off enough seed to fill that small box a handful of times over. Just how big is it on the inside, anyway? You lie back and relax, pondering that question along with the other mysteries of the universe as the goo ripples and undulates, milking the last drops of cum from your [cocks] until it’s sure that you’ve nothing left to give.", parse);
			} else {
				Text.Add("With a muffled cry, your body convulses and spasms before loosing forth the load that you’ve built up. It certainly <i>feels</i> like a lot, for you’re absolutely drained at this point, but the goo beast seems to disagree with you. Despite all the stroking and caressing, despite all the anticipation that’s built up in you, there doesn’t seem to be enough spooge in you to satisfy the creature’s hunger.", parse);
				Text.NL();
				Text.Add("The tentacle[s] attached to your [cocks] pump away furiously, increasing their suction as far as they dare without hurting you, but the most they manage is a pale white stream, looking fairly diluted as it travels down the goo’s clear blue length before disappearing into the main body somewhere in the box. The tentacles that remain unoccupied swerve down towards you, waggling their tips in your direction in what you can only assume to be a reproachful manner - but giving an apology is sort of hard, especially with one of their number stuffed in your mouth.", parse);
				Text.NL();
				Text.Add("Still, some food is better than no food, and the goo beast must agree with you. It’s a long while before it finally deigns to consider you milked as dry as a bone, and you’re utterly and completely exhausted at the end of it all, having shot off your load multiple times in the process.", parse);
			}
			Text.NL();
			Text.Add("Eventually, though, the goo beast must’ve decided it’s gotten all that it’s going to get from your manhood[s]. A wet, slurping sound rings in the air as ", parse);
			if (player.NumCocks() > 1) {
				Text.Add("all of the tentacles withdraw from you at once", parse);
			} else {
				Text.Add("the tentacle pops free of your [cock]", parse);
			}
			Text.Add(", allowing you to finally go limp with a sigh of relief. With you having utterly spent your load, the tentacles are free to turn their attention to other matters - and your ordeal is far from over.", parse);
			Text.NL();
		}
		if (player.FirstVag()) {
			Text.Add("The tentacles which had been bouncing you up and down on the giant ribbed goo-cock had been maintaining a steady rhythm, but now they pick up speed, clearly working you towards a fabulous finish. Despite the tentacle stuffed in your mouth, you gasp and groan as best as you can, fingers digging into the tentacles’ cool, pliant surface and sinking in deep.", parse);
			Text.NL();
			Text.Add("Thanks to all the venom that by now’s been spread all over the insides of your love-tunnel, you keenly feel each and every thrust of the gargantuan tentacle you’re impaled on  The ribs, ever more intense than you remember them being, rub up and down your slick inner walls, drinking your feminine juices with great relish even as the vigorous stimulation urges you to produce yet more lubrication.", parse);
			Text.NL();
			if (preg && womb.progress >= 0.4) {
				Text.Add("With you stuffed so thoroughly - filled up with your unborn progeny on one side of your cervix, and with the goo tentacle on the other - you can’t help but feel intensely aroused. Aphrodisiac, hormones and being pounded by a great big tentacle come together in the perfect storm to send you spiraling to new heights of pleasure.", parse);
				Text.NL();
				Text.Add("Spirits above, you just feel so <i>full</i> with your swollen midriff and bulging groin; the latter twitches about impatiently as the the goo tentacle writhes about in you, coaxing more and more girl-cum from your insides.", parse);
			} else {
				Text.Add("With you stuffed so thoroughly, you can distinctly <i>see</i> the bulge of the tentacle moving about inside you, prominent on your lower belly, and whimper as it piledrives into you yet again.", parse);
				Text.NL();
				Text.Add("It’s all you can do to hold on and not pass out from the pleasure as every last slick drop of girl-cum is sucked out of you, leaving you panting and wanting more.", parse);
			}
			Text.NL();
			if (player.FirstCock()) {
				Text.Add("Sure, it may not be as large an amount of sperm as that you fed the goo beast earlier on, but you suppose that girl-cum has its own unique flavor, texture, or whatnot. Or hey, maybe it just really wants dessert after the main course!", parse);
				Text.NL();
			}
			Text.Add("The tentacle stops its pounding for a moment, giving you pause - what’s up? Your question’s answered when you feel something building inside you, a sense of restrained strength and tension - and then the tentacle’s bulging tip begins to violently abuse - well, more violently, anyway - your poor cunt, causing your bones to rattle with each furious pounding.", parse);
			Text.NL();
			Text.Add("While you may be exhausted, your insides still have a spark of energy left, and just as a candle burns brightest just before it goes out, so do you mount an attack of your own. Clenching down hard on the invading goo tentacle, your pussy squeezes the firm, slippery goo in a vice-like grip as if it were a real manhood. The ribbing allows your love-tunnel to get a handle on the slimy appendage within you, and the two of you begin something akin to a perverse tug of war, the tentacle trying to pull away even as you do your best to prevent it from leaving you. Amplified by the aphrodisiac venom, the intense friction of the tentacle’s surface against your tender cunt is more than enough for white-hot spots of pleasure to swim in your vision, and you let out a desperate, muffled scream as a pure blissgasm overtakes you.", parse);
			Text.NL();
			parse.gen = player.mfTrue("boy", "girl");
			Text.Add("You don’t remember much of what happens next, up till the point where you dimly realize that you’ve now got two hands full of gelatinous slime, having literally ripped out part of the tentacles binding you in your ecstasy. It doesn’t seem to have done the goo beast any harm as more slime quickly flows back in place to make up for what you took, but a tentacle nevertheless worms over and gives you a reproachful smack on the ass for being such a naughty [gen].", parse);
			Text.NL();
			Text.Add("Over and over again, the tentacle pounds itself into you, over and over again, you orgasm until the inside of your head feels like jelly. When the tentacles are finally sated on your fluids and turn their attentions elsewhere, you’re blabbering incoherently around the tentacle gag in your mouth.", parse);
			Text.NL();
		}
		// Ass block. Since everyone will have an asshole, this will be the default string that everyone will be able to see.
		Text.Add("At about this time, the goo tentacles decide that it’s finally time for it to finish up in your ass. Stretching you beyond what you thought yourself ever capable of, the tentacle up in your butthole is more than content to simply fill you up to bursting, with the occasional wiggle to remind you that it’s there. Slow and subtle, it tickles you from the inside out, insidious little tendrils of pleasure that salaciously sneak in through the back door and send you to shivering.", parse);
		Text.NL();
		if (player.PregHandler().MPregEnabled()) {
			Text.Add("At last, the anusol’s effect finally kick in on a level that you can actually distinguish it from the slick aphrodisiac venom that the goo’s been smearing all over your insides, manifesting itself as an outpouring of lubricating fluids from your back door.", parse);
			Text.NL();
			Text.Add("The goo tentacle pauses for a moment, clearly uncertain at this unnatural outpouring of fluids where they should not be, but must have clearly decided that food is food anyway, and continues with an enthusiasm that surprises even you.", parse);
		} else {
			Text.Add("There’s not much in the way of fluids here for the goo beast to feed on, but it nevertheless seems to be enjoying itself quite thoroughly. Too much for it to be pulling out of you just yet, at any rate.", parse);
		}
		Text.Add(" At least the tentacle’s gentler than it was upon its entry, giving you a little time to recover. Even so, you can’t help but wonder why it’s just content to remain like this, much like a snake coiled up on someone’s midriff - does it like the heat in your rear or something?", parse);
		Text.NL();
		Text.Add("Either way, guess you won’t have to ponder that question anymore - by and large, the tentacle appears to be satisfied with what it’s done and slowly deflates before retreating from your various orifices, leaving you feeling more than just a little hollow inside. The void within your bowels, cool and gaping, nags at your mind, and maybe it’s just the venom speaking, but you already miss its filling presence…", parse);
		Text.NL();
		// end of ass block.
		Text.Add("At long last, it looks like the goo beast has had its fill. You notice that the girth of its clear tentacles is now distinctly fatter - not by a lot, but enough to be readily noticeable, and by and large the slimy appendages see fit to release you, letting you slump to the rocky ground in a quivering lump of drained jelly. The last you see of the creature is its tentacles withdrawing into the tiny box, which the alchemist shuts and stows away carefully.", parse);
		Text.NL();
		Text.Add("<i>“Well!”</i> he says, pulling up his pants. <i>“That was most certainly a very educational experience. I learned a lot from that - did you?”</i>", parse);
		Text.NL();
		Text.Add("You’d have replied, but the numb feeling that the tentacle left in your throat leaves you wanting for words. The rancid old goat looks at you askance, then shrugs.", parse);
		Text.NL();
		Text.Add("<i>“Well? Nothing to say? Dismissed, then. Maybe I’ll see you around when it’s time for the next session.”</i> He chuckles to himself, then kicks a bit of gravel onto your face before leaving.", parse);
		Text.NL();
		Text.Add("Ugh… you’ll remember this… and really, he ought to take better care of his pet, or at least feed the poor thing more often.", parse);
		Text.Flush();

		TimeStep({hour: 2});

		Gui.NextPrompt();
	}, 1.0, function() { return player.Humanoid(); });

	scenes.AddEnc(function() {
		Text.Add("small bound book in black-dyed leather, about the size and thickness of a small notebook. <i>“Interesting reading material Malice gets these days, wonder where he’s getting all these from. Never struck me as a reading man, too. Now, where was it?”</i>", parse);
		Text.NL();
		Text.Add("You watch sullenly as the rickety old goat flips through a few pages, mumbling to himself. <i>“Right, right, let’s try this one - he wanted the results posthaste. Ahem - greater lactic rush… mm-hm, hm…”</i>", parse);
		Text.NL();
		Text.Add("He waggles a hand in the air and gestures at your chest. <i>“Evals klim ym emoceb llahs uoy.”</i>", parse);
		Text.NL();
		Text.Add("Have you heard that incantation before? It sounds distinctly familiar, a lingering recollection on the edge of your memory… your train of thought of halted in the middle of the line, though, by a distinct tingling sensation in your [breasts], followed by a steadily mounting pressure from within that begins to push outwards without regard for your [armor]. ", parse);

		const breastsize = player.FirstBreastRow().Size();

		if (breastsize < 2) {
			Text.Add("Groaning, you throw your head back and stare up stupidly at the sky as firm flesh gathers on your chest, warm pressure causing two gently raised points to bud outwards before the sensation turns upon itself and washes back into the rest of your body. Rubbing the afflicted area only seems to amplify the pleasure further, and that’s what you end up doing - just unthinkingly rubbing away like a trained monkey while the perverted old goat takes notes.", parse);
			Text.NL();
			Text.Add("Well, he’s doing that with one hand, to be precise. He’s dropped his pants with the other and is busily stroking himself off, fingers firmly wrapped about seven stinking inches of goat-cock as the spell proceeds apace.", parse);
			Text.NL();
			Text.Add("A renewed surge of warm pressure runs through your chest, and you whimper and moan as the tiny breast-buds rapidly mature and grow, small pointy bumps ballooning outwards into deliciously rounded teardrop shapes, not that large but certainly <i>feeling</i> very weighty for what they’re worth. Your [armor] now feels considerably stretched - not a surprise given how much more volume it’s accommodating at the moment - and the alchemist is kind enough to help out by stopping his masturbation for a moment to yank it off with a slick, glistening hand, taking care to give you an grope in the bargain. It feels so good that you don’t care - even the weight of your [armor] is enough to to send erotic shivers down from your hypersensitive nipples.", parse);
			Text.NL();
			Text.Add("<i>“Instant results,”</i> he mutters not-quite under his breath before pausing to leer at you. <i>“Increase in volume of dense tissue of… hmm… Yes. Very nice.”</i>", parse);
		} else if (breastsize < 7.5) {
			Text.Add("Coupled with the sheer sensitivity that’s been instilled in your [breasts], the feeling of having your lady lumps grow in this fashion is exquisitely delicious. It’s all you can do to gaze down stupidly at your chest as your [breasts] tremble and jiggle of their own accord, possessed by some invisible force that pushes them against each other as they swell from within.", parse);
			Text.NL();
			Text.Add("The perverted old goat hasn’t been idle, either. He’s got a pencil in one hand, scribbling down notes madly, while the other… well, he’s pulled down his pants and is busy beating himself off to the tune of seven inches of rock-solid goat-cock. How he manages to keep his concentration while clearly aroused like this is anyone’s guess, but you suppose that he’s no stranger to keeping work and pleasure separate, considering the nature of his profession.", parse);
			Text.NL();
			Text.Add("Pulsing and pushing, wobbling and jiggling like a pair of precarious jellies, your lady lumps eventually stop their growth at a firm C, a slight teardrop shape to them. The pressure keeps on for a little while longer, though - you feel it seeping into your [nips] before finally fading away, leaving you with a pair of stiff, swollen teats and an achingly sensitive chest. Moaning like a street whore, you push your hands together and rub at your breasts vigorously, but no matter how much you massage your now-jiggly tits the sensations simply won’t leave you.", parse);
			Text.NL();
			Text.Add("<i>“Very swift reaction,”</i> the alchemist bleats, his breath coming in gasps as he trails the numerous throbbing veins on his shaft with a finger. <i>“Extremely pleasurable for the subject, too… initial hostile intent practically evaporated within moments. Very satisfactory.”</i>", parse);
		} else {
			Text.Add("You groan and roll your eyes back as the pressure builds up within your [breasts], sending them to throbbing and pulsing, growing outwards ever so slightly before shrinking back to their old size again. More and more pressure continues to mount, but it simply doesn’t seem to have a valid outlet to express itself, eventually fading away in a burst of tingles.", parse);
			Text.NL();
			Text.Add("Despite there being no outward change, that hasn’t stopped the alchemist from pulling down his pants and masturbating to the sight of your ample tits, one of his hands a blur as it moves back and forth across seven inches of goat-cock, the other scribbling away furiously as he takes notes with a stub of pencil.", parse);
			Text.NL();
			Text.Add("<i>“No additional volume added to the subject in question… the spell must realize when a sufficient size has been reached for optimum efficiency. Quite remarkable… one has to wonder where Malice gets his hands on things like these. Still, quite pleasurable for the subject, so not a complete loss.”</i>", parse);
		}
		Text.NL();

		_.each(player.AllBreastRows(), function(breasts) {
			breasts.size.IncreaseStat(7.5, 10);
		});
		player.AddLustFraction(0.4);

		Text.Add("You’re just starting to recover from the rush of euphoric pleasure when another one hits, signaling the second phase of the spell. Blood practically rushes to your chest, creating an intense warmth in the surrounding [skin] as your [breasts] begin to throb in unison, areolae swollen and raised, [nips] diamond-hard and reaching up for the sky. Like it or not, your boobflesh just feels so <i>firm</i> and <i>turgid</i>, sending palpable waves of contentment into the rest of your body. Something about this just feels… <i>right</i>, and you’re somehow dissuaded to think too deeply or indeed be overly concerned about your current predicament.", parse);
		Text.NL();
		Text.Add("Then it begins. ", parse);
		if (player.Lactation()) {
			Text.Add("You were already milky before, but the alchemist’s spell has turned your previous production up to eleven. With a cry of pleasure, you clutch your tits and squeeze them for dear life as twin jets of milky goodness erupt from your [nips], geysering in the air before falling back down on you in a creamy white shower. The sensations emanating from your lady lumps are absolutely divine, washing over you from head to toe and making you feel just like ", parse);
			if (player.Gender() == Gender.female) {
				Text.Add("the woman that you are", parse);
			} else {
				Text.Add("a woman", parse);
			}
			Text.Add(". You groan aloud, pushing and squeezing, but the flow seems to have absolutely no intention of abating anytime soon. If anything, it grows ever stronger, adding even more to the sweet-scented puddle of white you’re now lying in.", parse);
		} else {
			Text.Add("Unable to withstand the build-up inside them, your [breasts] give way and spurt their load high into the air - twin streams of rich white cream that ribbon outwards before arcing back downwards and falling down onto you in a light, sweet shower. You might not have been lactating before, but whatever else the spell might have done to you, there’s little doubt that you are now.", parse);
			Text.NL();
			Text.Add("Naturally, accompanying this is an overwhelming sense of pleasure and satisfaction that radiates outwards from your tits - you never knew that being so milky, so <i>full</i> could feel this good. The only thing better than being full is being milked, and with a start, you realize that you’ve been doing just that for a good while now, groping and squeezing at your bountiful boobs in a frenzied burst of lusty pleasure.", parse);
		}
		Text.NL();
		Text.Add("It’s in this manner that you hose down the gravelly soil with thick streams of your milk, seemingly more than the entire mass of your body; at any rate, the spell is clearly keeping you from ending up dehydrated from the sheer mass of fluid that’s pouring out from you. The constant gushing from your [nips] caresses the insides of your lady lumps, silken hands stroking away beneath your skin, and you grit your teeth as your pleasure approaches its peak.", parse);
		Text.NL();
		Text.Add("<i>“Marvelous! Marvelous! Far more than I could have ever hoped for!”</i> the randy old goat bleats, rushing forward to stand over you. Smacking your hands away, he personally sees to the milking of your overproductive tits, a big grin plastered over his face as his long, bony fingers dig into your milky mammaries. Perhaps you should care, but it just feels so <i>good</i> to be milked like this, and to be fair your arms were getting a bit tired anyway, so having someone else take over for you is just fine.", parse);
		Text.NL();
		Text.Add("Nevertheless, if he’s going to be a dear and service you like this, it’s only fair for you to reciprocate the favor. The alchemist’s still-erect shaft bobs up and down in front of you, all seven inches of man-meat flicking drops of pre to mix in with your milky bounty - it’s a simple matter for you to reach up and take it in hand, then start stroking it like he was doing, pistoning your palm up and down its knobby, veined length. He clearly wasn’t expecting you to do that, stumbling a little and shifting his weight to compensate even as he doubly redoubles his efforts to grope you into oblivion.", parse);
		Text.NL();
		Text.Add("<i>“Little slut,”</i> he bleats, <i>“spell or no spell, I’m going to milk you as dry as a bone.”</i>", parse);
		Text.NL();
		Text.Add("Hah, you’d like to see him try.", parse);
		Text.NL();
		Text.Add("<i>“Challenge accepted.”</i> With that, the alchemist squeezes down hard with his bony fingers, painfully constricting your [breasts] in his grasp. You yelp and push your chest forward, ramming your milk-makers into his hands and causing your milk to blast out even faster. The entirety of the randy old goat’s smock is utterly soaked with sweet lactate, and his hair is awash with the same stuff; you’re vaguely aware of the fact that this might be the first bath the rancid old has-been has taken in some time.", parse);
		Text.NL();
		Text.Add("You’re not one to give up without a fight, though! By now, plenty of milk has wormed its way in between your palm and his shaft, acting as plentiful lubricant - or at least, better than what was there before. You do your best to match blow for blow, pumping away like a possessed madman at his shaft, determined not to lose a second time.", parse);
		Text.NL();
		Text.Add("Your grit pays off. The alchemist is the first one to crack, letting out a loud, dolorous bleat as his cock twitches once, twice, then lets loose a stream of spunk almost as torrential as the milk erupting from your aching nipples. It’s thick, it’s heavy, and it stinks to high heaven, a fact that’s thankfully abated somewhat as it mixes in with your sweet offering.", parse);
		Text.NL();
		Text.Add("<i>“Harder! FASTER!”</i> the alchemist bleats at the top of his lungs, clearly unwilling to give up either. Nevertheless, you note that he’s starting to weaken - he’s clearly been pent-up for a long time, and that release took its toll on him. Your suspicions are confirmed when he groans, shudders, and lets out another heavy blast of spunk onto you, the ponderous orbs hanging between his legs shrinking slightly with this second emptying.", parse);
		Text.NL();
		Text.Add("And just in time, too, as whatever magic the alchemist wove upon you begins to unravel, having run its course. You start squeezing your breasts as their flow diminishes, anxious to continue the pleasure, but eventually all good things come to an end and you have to admit that the bulk of the spell’s effects have finally worn off - although something in your [breasts] feels fuller and riper, eager and ready to give forth a greater bounty the next time you drain your lady lumps.", parse);
		Text.NL();

		player.lactHandler.lactationRate.IdealStat(10, 1);
		player.lactHandler.milkProduction.IncreaseStat(5, 1);

		Text.Add("Nevertheless, considering how strangely erotic the constant lactation was, you can’t help but continue pulling at your fattened nipples for a good minute or two even after the milk has completely stopped, secretly hoping that doing so might prolong the spell just a little longer.", parse);
		Text.NL();
		Text.Add("It doesn’t.", parse);
		Text.NL();
		Text.Add("<i>“Ugh,”</i> the alchemist groans woozily, tottering on his feet. Spent and sated, his member is quickly going limp and flaccid, and as you watch, the old goat slips in a puddle of milk and lands on the ground with a large splash face-up. He wiggles about a bit in the mess, trying to get comfortable, but doesn’t bother to get up.", parse);
		Text.NL();
		Text.Add("Well, here’s your chance to get away before this crazy old bastard comes up with something even more deranged - even if pleasurable - to inflict upon you. Taking one last look back at the mess you’ve created and shaking your head and the enormous milk puddles slowly draining into the rocky dirt - lactic rush indeed - you scrounge together the remainder of your strength and drag yourself away hand over foot, collapsing into a small cubbyhole in the side of the ravine.", parse);
		Text.NL();
		Text.Add("Right, right. You can be on your way… once you’ve rested a bit, cleaned yourself up and gotten everything in order. Then there’s the matter of your newly enhanced mammaries… giving the firm boobflesh a poke and shuddering at the erotic tingles the touch generates, you sigh and shake your head. That’s going to have to be dealt with sooner or later…", parse);
		Text.Flush();

		TimeStep({hour: 1});

		Gui.NextPrompt();
	}, 1.0, function() { return true; });

	/* TODO
	scenes.AddEnc(function() {
		Text.Add("", parse);
		Text.NL();
		Text.Add("", parse);
		Text.Flush();
	}, 1.0, function() { return true; });
	*/
	scenes.Get();
};

// GROUP ENCOUNTER

MaliceScoutsScenes.Group.Encounter = function(levelbonus: number) {
	const player = GAME().player;
	const party: Party = GAME().party;
	const enemy    = new Party();
	const catboy   = new CatboyMage(levelbonus);
	const goat     = new GoatAlchemist(levelbonus);
	const mare     = new CentaurMare(levelbonus);
	enemy.AddMember(catboy);
	enemy.AddMember(goat);
	enemy.AddMember(mare);
	const enc: any = new Encounter(enemy);
	enc.catboy   = catboy;
	enc.goat     = goat;
	enc.mare     = mare;

	enc.onEncounter = function() {
		const parse: any = {
			himher : player.mfFem("him", "her"),
		};

		Text.Clear();
		Text.Add("Making your way through the Highlands is rough work - the sharp, stony ground wears at you, and the constant ups and downs of the rugged foothills and grand vistas are an ever-present drain on your energy. However, the sights that you take in are quite unlike anything else on Eden - the vastness of it all, coupled with the sense of antiquity and mysticism that you get from just being here…", parse);
		Text.NL();
		Text.Add("This is a place where the lore, rather than the law, rules. Little wonder that the Kingdom is loathe to try and extend its reach to these peaks.", parse);
		Text.NL();
		Text.Add("Your path takes you by a circle of standing stones, one of the many which dot the Highlands. Some of them are big, spanning whole plateaus, others are simple stubs of stone which look at home in a small garden. This one is fairly expansive - perhaps the size of a city plaza - and has runes of indeterminate origin etched into worn granite. They’ve clearly been here a long time, judging by the amount of moss that’s crept upwards along their sides; if they aren’t magical, they damn well look the part at the very least.", parse);
		Text.NL();
		Text.Add("Tempted to go forward and investigate a little further, you’re about to make for the stone circle when a voice snaps in the cool air, even as an arrow whizzes past you and buries itself in the ground not too far from you- a warning shot.", parse);
		Text.NL();
		Text.Add("<i>“Hah! Travelers! Submit and we won’t be forced to hurt you.”</i>", parse);
		Text.NL();
		Text.Add("You whirl around to view your assailants - a trio of figures stepping out from behind the standing stones to confront you. The obvious leader of the lot is an imposing centaur mare, perhaps seven feet tall from hoof to head, fingering a longbow in her hands. Lazily, she nocks another arrow and grins, this time taking aim for you.", parse);
		Text.NL();
		Text.Add("<i>“I don’t know. This one looks like we might have to hurt [himher] anyway.”</i>", parse);
		Text.NL();
		Text.Add("The second speaker - a goat-morph with an assortment of potions and bombs at his belt - steps forward, cutting off any easy avenue of escape. Whistling, he pulls out a fragile-looking  flask from his belt and looks around, scowling.", parse);
		Text.NL();
		Text.Add("<i>“Hey! Where are you? Get on out or -”</i>", parse);
		Text.NL();
		Text.Add("The final member of the trio, a diminutive catboy mage dressed in baggy robes and pants, waves his hands. <i>“I-I’m here. I’ve been here for a while.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Oh, right. You’re so unnoticable, I simply forgot you were there.”</i> The goat-morph alchemist sniffs, then turns to you. <i>“Well, then. I’m afraid to say that we appear to have gotten the drop on you", parse);
		if (party.Num() > 1) {
			parse.s = party.Num() > 2 ? "s" : "";
			Text.Add(" and your friend[s]", parse);
		}
		Text.Add(", wouldn’t you say?”</i>", parse);
		Text.NL();
		Text.Add("Indeed. And what do they intend?", parse);
		Text.NL();
		Text.Add("The centaur mare cocks her head. <i>“Oh, I don’t know. A bit of fun, and maybe some of your coin, perhaps.”</i>", parse);
		Text.NL();
		Text.Add("Shouldn’t that be the other way around?", parse);
		Text.NL();
		Text.Add("A snicker. <i>“We’re paid well enough, so money’s not what we’re after. But a fine piece of ass like yours, that’s something that doesn’t wander by every day. Prepare to surrender it!”</i>", parse);
		Text.NL();
		Text.Add("With that, the trio advance upon you. <b>It’s a fight!</b>", parse);
		Text.Flush();

		// Start combat
		Gui.NextPrompt(function() {
			enc.PrepCombat();
		});
	};

	/*
	enc.canRun = false;
	enc.VictoryCondition = ...
	*/
	enc.onLoss    = MaliceScoutsScenes.Group.LossPrompt;
	enc.onVictory = MaliceScoutsScenes.Group.WinPrompt;

	return enc;
};

MaliceScoutsScenes.Group.WinPrompt = function() {
	const player = GAME().player;
	const enc  = this;
	SetGameState(GameState.Event, Gui);

	let parse: any = {

	};
	parse = player.ParserTags(parse);

	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("Defeated, the trio lie groaning on the grass - the catboy and goat-morph are flat on their backs, while the centaur mare has toppled over on her side during the fight, unable or unwilling to get up. Heaving a sigh of relief, you put away your [weapon] and step forward to inspect your assailants more closely. They certainly look like mercenaries, being too well-dressed and equipped for simple bandits. Which company they’re from is a mystery, though; they certainly bear no markings indicating such.", parse);
		Text.NL();
		Text.Add("You shake your head. They certainly don’t seem to be in any shape to be answering questions, but you could let them have their bit of fun, if you were in the mood… alternatively, you could just skedaddle and be on your way before any of their friends come looking for them.", parse);
		Text.NL();
		Text.Add("What do you do?", parse);
		Text.Flush();

		const options: any[] = [];
		/* TODO
		options.push({nameStr : "",
			tooltip : Text.Parse("", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
				Text.Flush();
			}
		});
		*/

		if (options.length > 0) {
			Gui.SetButtonsFromList(options, false, null);
		} else { // NULL OPTION
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("You rack your brains, trying to think of what to do next. Either you can’t think of anything appropriately kinky that would involve all three of your assailants, or you simply don’t want to have anything to do with them, for the next thing you know, you’re heading out and away from this mess before someone else comes up and… well, inconvenient questions would be the least of the things that could happen. Yeah, sure, you could stay and try and think of increasingly implausible sex acts that would probably involve quite a bit of contortion to accommodate all three of them, but seriously, you’ve got better things to do with your time, don’t you?", parse);
				Text.NL();
				Text.Add("Turning away, you double-time it out of the stone circle and make a beeline for the nearest road, or at least what passes for roads in the Highlands before considering your next move.", parse);
				Text.Flush();

				Gui.NextPrompt();
			});
		}
	});
	Encounter.prototype.onVictory.call(enc);
};

MaliceScoutsScenes.Group.LossPrompt = function() {
	const player = GAME().player;
	const party: Party = GAME().party;
	SetGameState(GameState.Event, Gui);
	Text.Clear();

	// this = encounter
	const enc = this;

	const parse: any = {

	};

	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("Ouch! A savage kick from the centaur mare’s hooves sends your head spinning, and this is quickly followed by streams of translucent mist that issue from the catboy mage’s hands and solidify about your limbs, holding you in place. ", parse);
		if (party.Num() > 1) {
			if (party.Num() > 2) {
				parse.comp    = "Your companions";
				parse.isAre   = "are";
				parse.himher  = "they";
			} else {
				const p1 = party.Get(1);
				parse.comp    = p1.name;
				parse.isAre   = "is";
				parse.himher  = p1.himher();
			}
			Text.Add("[comp] [isAre] too dazed to help you break free of the magical bindings, what with [himher] being wounded and pretty much out of the fight. ", parse);
		}
		Text.Add("You struggle a bit against the magical bonds, but it soon becomes clear that the fight is pretty much over - and you’re not the victor here. As one, the trio lower their weapons and close in on you, their gazes running up and down your form with varying levels of apprehension and hunger.", parse);
		Text.NL();
		Text.Add("<i>“So,”</i> the centaur mare begins, <i>“what do we do with this one?”</i>", parse);
		Text.NL();
		Text.Add("The goat-morph alchemist grins. <i>“Well, I was thinking…”</i>", parse);
		Text.NL();

		// #randomly go to one of the below options

		const catlike = player.RaceCompare(Race.Feline);

		const scenes = new EncounterTable();
		scenes.AddEnc(function() {
			MaliceScoutsScenes.Group.LossCatboyForcedTF(enc);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			MaliceScoutsScenes.Group.LossMagicalBondage(enc);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			MaliceScoutsScenes.Group.LossCatRape(enc);
		}, 1.0, function() { return player.FirstVag() && catlike >= 0.4; });

		/* TODO
		scenes.AddEnc(function() {
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
		}, 1.0, function() { return true; });
		*/
		scenes.Get();
	});
	Encounter.prototype.onLoss.call(enc);
};

MaliceScoutsScenes.Group.LossCatboyForcedTF = function(enc: any) {
	const player = GAME().player;
	const catboy = enc.catboy;

	let parse: any = {

	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);

	Text.Add("<i>“…I do have a concoction that I’ve been meaning to test for a while, and one of the things we’ve come out all this way for is to teach this fellow here -”</i> he points at the catboy - <i>“just how to be a man.”</i>", parse);
	Text.NL();
	Text.Add("The catboy’s eyes widen, and he holds his hands out as he begins to back away slowly. <i>“Hey, h-hey. I don’t remember you saying anything about testing potions…I didn’t sign up for this.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Oh, don’t be such a pansy,”</i> the centaur mare replies, cantering over with a snort. Reaching down with equine strength, she easily rips down the catboy’s pants, revealing a thin bottom fitting of his lithe frame. <i>“It’s not as if he’d do anything to harm you. Intentionally, anyway.”</i>", parse);
	Text.NL();
	Text.Add("<i>“S-stop that!”</i> the catboy yowls, his tail thrashing about in protest. <i>“I’m not -”</i> his words are cut off abruptly as the the alchemist sallies forth, jabs a gigantic dildo-shaped syringe into his asshole, and depresses the plunger before wrenching it out. You can’t help but feel a <i>tiny</i> bit sorry for the poor catboy as his eyes practically bulge from his head, whatever suppository that was in the alchemist’s syringe rushing up his ass and into the rest of his body.", parse);
	Text.NL();
	Text.Add("The effects are instantaneous. Within moments, the catboy’s muscles begin to swell, rapidly filling out his once-baggy robes and stretching them to their limits. His pants don’t get that much dignity - they rip apart as his legs lengthen and thighs bulk up, practically rippling with power.", parse);
	Text.NL();
	Text.Add("Naturally, those aren’t the only parts of his body that’re growing. Your eyes are drawn to the catboy’s shaft in a mixture of horror and wonder - at nine inches, the mage’s man-meat is already surprisingly large for his diminutive form, but it just keeps on getting bigger and <i>bigger</i>. Bit by bit, length and girth alike are added to the catboy’s cock, veins rising to its surface as it strains against its earthly confines, stretching them beyond belief. Ramrod straight, it’s already past one whole foot and still growing as the potion’s effects course through the catboy’s - well, it’s hard to think of the thing he’s becoming as a <i>boy</i> - veins.", parse);
	Text.NL();
	Text.Add("Of course, with his cock growing, his balls follow suit. Scrotal flesh grows taut as the catboy’s nuts swell with rapidly increasing virility, soon the size of eggs, then plums, then apples, then grapefruits… spirits, how ridiculous are they going to become? Even worse is the churning, squelching noise that rises from them as they swell with seed, practically pulsing with the need for release.", parse);
	Text.NL();
	Text.Add("When the changes are finally over, standing before you in the remains of his clothes is an eight foot musclebound brute, slightly hunched over as he adjusts to his new proportions. Although he’s kept his large, fluffy ears - which admittedly detract from any intimidation value he might have - the transformed catboy’s hair has spread down the sides of his face and down his chin in a pair of sick sideburns, cumulating in a large, silver mane worthy of a pride’s leader. Tusks jut downwards from his upper jaw, long and savagely sharp, eager to pierce and rend.", parse);
	Text.NL();
	Text.Add("What is most noteworthy, though, is his cock and balls. The former’s almost two feet long, at least as girthy as your arm, and continually twitches up and down even as it dribbles pre onto the ground, carrying with it the scent of raw maleness. The latter are equally impressive and ponderous, massive orbs that dangle between his legs, stretched tight and pulsing lightly with a fresh load of sperm. The soft, cartilaginous pleasure-nubs have swollen and extended themselves outwards from the main thrust of his shaft into something that look more like actual barbs, although they thankfully don’t actually look <i>hard</i> or anything…", parse);
	Text.NL();
	Text.Add("Yep, gone is the shy, simpering catboy, and in his place is this furious, growling, white-furred beast - or maybe he’s less angry and more desperate to mate. Either way, it doesn’t bode well for you or your ass.", parse);
	Text.NL();
	Text.Add("While the centaur mare is a little taken aback at the catboy’s sudden transformation, the alchemist is practically dancing with glee as he takes in the effects his potion is having on the catboy. <i>“Ha ha! I said I’d be able to make a man out of someone as pathetic as you, and I did! Look! Look! Can you deny that he’s anything but a man now? Can you? Can you?”</i>", parse);
	Text.NL();
	Text.Add("The former catboy rips off the remainder of his clothing, hurls the tattered fabric over his shoulder, and lets out a bestial roar. His green, slitted eyes narrow as he surveys you, then begins stomping over in your direction - but not before grabbing the centaur by her torso and dragging her along with him.", parse);
	Text.NL();
	Text.Add("<i>“Hey!”</i> the mare shouts as the transformed catboy’s thick, meaty arm wraps about her waist. <i>“Not me, you doofus!”</i> She looks about for the alchemist, but he’s long since vanished, perhaps headed for a safe vantage point from which to view the fruits of his work. <i>“Come back and tell this brute to let go of me! You didn’t say that he would -”</i>", parse);
	Text.NL();

	let armor = "";
	if (player.Armor() || !player.LowerArmor()) { armor += "[armor]"; }
	if (player.Armor() && player.LowerArmor()) { armor += " and "; }
	if (player.LowerArmor()) { armor += "[botarmor]"; }
	parse.arm = Text.Parse(armor, parse);

	Text.Add("Another roar, angrier this time, and this is enough to shut the centaur up; reaching for you with his free hand, the former catboy almost literally tears off your [arm], leaving you stark naked. You wiggle about a bit, fear driving you to attempt one final desperate foray at escape, but the magical bindings are just as strong as they were when they were forged. Before you know it, his hand is on you as well, the bulging muscles of his arm forcing you upright; that same unnatural strength lifts you into the air even as he sits down on one of the standing stones and plops you straight into his lap and onto his barbed member.", parse);
	Text.NL();

	// Set to 2ft arm thick cock
	catboy.FirstCock().length.base    = 55;
	catboy.FirstCock().thickness.base = 10;

	player.AddLustFraction(0.5);

	if (player.FirstVag()) {
		if (player.FirstVag().Fits(catboy.FirstCock(), -5)) {
			Text.Add("Seems like all that stretchiness training’s finally paid off today. Your breath catches in your throat as the cum-slick tip of the former catboy’s cock brushes against the petals of your womanly flower, then erupts in a scream of pain and pleasure alike as he impales you upon his shaft, simply loosening his grip on you and letting your weight drag you down upon him.", parse);
			Text.NL();

			Sex.Vaginal(catboy, player);
			player.FuckVag(player.FirstVag(), catboy.FirstCock(), 4);
			catboy.Fuck(catboy.FirstCock(), 4);

			Text.Add("It’s hard to put to words the intense sensation of <i>stretching</i> that’s forced upon you as your [vag] continues to gape wider and wider in order to accommodate the former catboy’s virile rod - thin and tense, your inner walls keenly feel every twitch and bob of that gargantuan manhood in you, shivering and convulsing at the sensations each and every soft cock-barb is producing as it pricks at your insides. The manly musk that rises from him isn’t helping matters, either - like it or not, your face is growing hot, and your thoughts can’t help but start to be consumed by the utterly perverse and painful sex you’re having right now.", parse);
			Text.NL();
			Text.Add("Even with your considerable girth, there’re limits to just how much a torso can hold, though. The ex-catboy’s massive shaft has no problem forcing your cervix apart and entering your womb, bumps rising on your lower belly as you <i>feel</i> that steely hardness thrust about inside your warm confines. No matter how much he tries, though, he can’t get any more than about half of his entire length inside you, and eventually gives up with a grunt.", parse);
			Text.NL();
			Text.Add("<i>“You,”</i> he growls, jabbing a finger in the centaur mare’s direction. <i>“Come lick rest.”</i>", parse);
			Text.NL();
			Text.Add("The centaur flicks her eyes this way and that, and then trots over and starts licking the exposed remainder of the ex-catboy’s meaty boner. Guess she figured that a little tonguework isn’t much compared to what you’re going through; on his part, the catboy jams the fist that was restraining the mare straight into her hindquarters, sinking up to the forearm. The centaur sputters and whinnies in surprise as she ends up being vigorously fisted through and through, but manages to stay the course. Stifling her lusty moans, she manages to stay focused on the catboy’s shaft, lapping away like a filly faced with a salt lick.", parse);
			Text.NL();
			Text.Add("In and out, in and out, the barbs rubbing up against your slick inner walls with each movement and leaving behind trails of exhilarant pleasure laced with just a smidgen of pain. You bite your lip and try to hold on just a little longer as the former catboy picks up his pace, but the sheer sensation of the <i>thing</i> moving about inside you, squashing your innards even as it ravages your womb - it’s too much for a mere earthly body to bear. You orgasm for the first of what’s soon to be many times, ", parse);
			if (player.FirstCock()) {
				Text.Add("sperm blasting from your own shaft[s] and arching through the air, ", parse);
			}
			Text.Add("clear girl-cum running down and out to coat the catboy’s massive, meaty member. Somewhere beneath you, the centaur mare whinnies as an extra flavor is added to the medley of tastes currently flooding her mouth.", parse);
			Text.NL();
			Text.Add("Bounced up and down on the ex-catboy’s lap, you’re quickly brought to climax again and again in quick succession, rapidly reducing you to a quivering, mindless pile of pleasure-wracked flesh. The alchemist’s concoction has given him as much staying power as it did strength, and he seems to show no indication of slowing - in fact, he picks up the pace each time you succumb to your pleasures, his powerful chest heaving as he breathes heavily through sharp teeth.", parse);
			Text.NL();
			Text.Add("Time passes in a blur as your head swims and vision dims, your senses overwhelmed by the catboy’s forceful fucking. At last, though, an ominous twitching deep within your body jerks you back to groggy awareness just in time for the catboy to unleash the contents of his balls straight into your womb. Throwing his head back, the feline lets out a bestial roar not too unlike that of a lion’s, and then a torrential surge of spunk flows straight into you.", parse);
			Text.NL();

			const womb = player.PregHandler().Womb();
			const preg = womb && womb.pregnant;

			if (preg && womb.progress >= 0.2) {
				Text.Add("Being already knocked up, you can’t get any <i>more</i> pregnant than you already are - that sort of thing’s reserved for broody birds - but neither the catboy nor his cum care one whit for what you or your body wants. Another roar rends the air about the standing stones, and you can only groan and hang limply as your already swollen womb grows ever bigger as it’s pumped full of seed.", parse);
				Text.NL();
				Text.Add("Bigger and bigger, rounder and rounder - you can <i>feel</i> your unborn progeny being bathed in the catboy’s thick spunk, and the roaring deluge only serves to make you even more aroused. Unable to retain its shape with cock, child and cum all weighing down upon it, your glistening, stretched belly distends and drops, producing a delightful oblong shape.", parse);
			} else {
				const womb = player.PregHandler().Womb({slot: PregnancyHandler.Slot.Butt});
				const preg = womb && womb.pregnant;
				parse.swollen = (preg && womb.progress >= 0.4) ? "already-swollen" : "still-relatively-flat";
				Text.Add("Unable to withstand the deluge of baby batter racing into it, your [swollen] belly rapidly swells and distends as if the catboy’s seed had already taken root and was quickening into a batch of kittens at an inhuman rate. You can practically <i>feel</i> muscles stretching and organs giving way to make room for the growing reservoir of spunk within you - first looking to be four months along, then nine, then heavily overdue… and you’re still growing.", parse);
				Text.NL();
				Text.Add("Gazing down at your bulging belly, the catboy lets out a triumphant roar just as you feel your belly button surrender to the pressure within your womb and turn itself into an outie. Of course, it doesn’t stop there, protruding further and further as your “pregnancy” continues to grow weightier and weightier…", parse);
				Text.NL();
				Text.Add("<i>“Me big cat man!”</i> the catboy shouts, running his fingers across your [hair]. <i>“You good female. You grow many kittens for me, yes?”</i>", parse);
				Text.NL();
				Text.Add("You don’t have the presence of mind to whip up a witty response to that, so you settle for keeping your mouth shut and pretending that didn’t even dignify a response.", parse);
			}
			Text.NL();

			MaliceScoutsScenes.Catboy.Impregnate(player, catboy, PregnancyHandler.Slot.Vag, 6);

			Text.Add("Try as it might, though, there’s a limit to how much your insides can hold, and before too long the river of spunk backflows out your cunt and oozes down the remainder of the catboy’s shaft, painting it white as it flows along. Yet another flavor is added to the delectable meat lollipop that the centaur mare’s been going at for the last few moments; coupled with the heady and arousing scent of sex, it’s enough to set the mare off.", parse);
			Text.NL();
			Text.Add("As you watch, the centaur’s eyes roll back into her head, her body shaking as she rears back onto her hind legs and takes the catboy’s fist into herself all the way up to her elbow. Twisting her equine half this way and that so as to get the most out of being skewered on the catboy’s arm, she yelps and moans as slick streams of her own juices run from her pussy and out onto her hind legs.", parse);
			Text.NL();
			Text.Add("On his part, the catboy throws the poor mare a bone and flexes his muscles once, twice - you can see the bulge in the mare’s underbelly where it’s clearly straining to keep the limb contained as it flexes. It’s no barbed cat-cock, but it gets the job done well enough.", parse);
		} else { // dont fit
			Text.Add("Try as he might, there’s no way that the transformed catboy is getting that massive, meaty member in you - it’s simply too large to effect any sort of entrance. Well, the tip might fit, but it’s going to be nowhere near satisfactory for this monster well in rut.", parse);
			Text.NL();
			Text.Add("Clearly, the former catboy agrees with you, for he sets you down on the grass with an angry grumble and turns his attentions to the centaur mare. Now <i>there’s</i> a cocksleeve more suited for his massive member - sensing his intentions, the mare looks about frantically, but is as powerless as you to resist as he grabs her hindquarters in both hands and grinds his barbed cat-cock between her legs. She whinnies, first in shock, then in orgiastic pleasure as the former catboy rams his rod into her with a loud squelch and begins a steady rhythm. Hips thrusting, balls slapping against the mare’s pert butt, he moves with slow, rolling motions that speak of carefully restrained power, power that could have ravaged the poor mare at any point.", parse);
			Text.NL();
			Text.Add("Of course, as deep as the mare is, even she can’t take the entirety of the former catboy’s humongous dick into herself. Girth is one thing, length is another - and there’s just under half of his massive member still left dry and untouched by the mare’s puffy, heat-swollen pussy. Eyeing you, he jabs a finger in your direction, then at the exposed section of his manhood.", parse);
			Text.NL();
			Text.Add("<i>“You, come stroke,”</i> he growls. <i>“Work together.”</i>", parse);
			Text.NL();
			Text.Add("Somehow, you get the idea that claiming to have a headache at this juncture would be a very, very bad idea. Stroking him off isn’t so bad compared to what the centaur mare’s going through, and the yelps and squeals as the barbs on his shaft ravage her cunt are more than enough to make you glad you’re not on the receiving end of those attentions.", parse);
			Text.NL();
			Text.Add("Still, there’s a lot of man-meat for you to cover, and it’s clear that your initial, cautious laps aren’t doing it for him. It’s hard to go any faster, especially with the overpoweringly arousing scent of his crotch so close to your face; it’s difficult to concentrate on pleasing him and not yourself.", parse);
			Text.NL();
			parse.l = player.HasLegs() ? "between your legs" : "to your needy pussy";
			Text.Add("You don’t know exactly when it happened, but one of your hands has found its way [l]. Dipping and weaving, stroking and caressing, you’re keenly aware of just how inadequate your fingers are compared to the mighty cat-cock that the centaur mare’s currently speared on, and a small voice in the back of your mind points out that it’d be so much <i>more</i> fun if you were the one of the end of that man-meat instead.", parse);
			Text.NL();
			Text.Add("<i>“Bitch!”</i> the cat-boy growls, tapping you on the head. Well, to him it might be just a tap, but to <i>you</i>, it’s a good, solid blow. Sure, he didn’t mean it - the brute doesn’t know his own strength - but it still smarts. <i>“Lick good!”</i>", parse);
			Text.NL();
			Text.Add("Clearly, drastic times call for drastic measures. Instead of actually bothering to lick, you simply open your mouth wide and press your lips against the ponderous cylinder of man-meat, stifling a moan of ecstasy as that hard, heady scent fills your nose and mouth with impatient need. The centaur’s girl-juices only make things worse - or if you look at it from another angle, better - as they run down the length of your meat lollipop and add yet another flavor to it.", parse);
			Text.NL();
			Text.Add("It’s thus that you do your best to satiate the former catboy, flexing and undulating your lips as the main thrust of your attack while your tongue backs you up. Gradually, you work your way back and forth across the circumference of his shaft, pausing at each pleasure-nub to suck and lick at it for all you’re worth.", parse);
			Text.NL();
			Text.Add("It seems to satiate him, at the very least. Through the sensitive skin of your lips, you can feel the throbbing of the feline prick you’re worshipping, pulsating with a steady virility; you can sense him tense ever so slightly every time you lavish your attentions on each flexible barb. At last, you’re getting through to him; all you need to do is keep this up until -", parse);
			Text.NL();
			Text.Add("- With a bestial roar, the catboy’s shaft clenches, and you feel a hot rush pass beneath your lips for the briefest of moments before he unleashes his load into the centaur mare. The poor equine groans limply as her underbelly begins bloating with thick cat-spunk, her womb swelling up nice and round until it simply can’t accommodate any more sperm and the continued deluge simply backflows around the edges of her already supremely stretched pussy, emerging as a thick white spray.", parse);
			Text.NL();
			Text.Add("Caught up as you are, you have barely enough time to turn shield yourself with your arms before the backflow hits. Much good it does you against the torrent of sperm that blasts back from the centaur’s abused womb - mere seconds pass before you’re completely soaked with cat cum, and twice as long as that before you’ve been completely painted and plastered over, making you resemble a particularly dribbly candle more than anything else. Of course,  you’re not the only thing that ends up coated with spunk; the blowback is so strong that his thighs and groin end up splattered with a nice layer of white as well.", parse);

			player.AddSexExp(2);
		}
	} else { // anal
		if (player.Butt().Fits(catboy.FirstCock(), -5)) {
			Text.Add("As hard to believe as it is, the bestial catboy manages to effect entry into your [anus] after a fashion. Despite his monstrous girth, the firm grip he has about your waist pushes you down steadily atop his barbed shaft, wiggling and worming away…", parse);
			Text.NL();

			Sex.Anal(catboy, player);
			player.FuckAnal(player.Butt(), catboy.FirstCock(), 4);
			catboy.Fuck(catboy.FirstCock(), 4);

			Text.Add("You catch sight of the centaur mare staring at you, mouth agape; straddled as you are atop the catboy’s gargantuan cock-head, there’s no way you’re seeing what’s going on underneath you. Feeling it, though, is another matter as your already well-trained asshole is stretched to its limits just trying to accommodate the huge head. At last, the very tip of his cock does manage to pass your sphincter - and you already feel fit to bust. The fact that there’s no lube save for the pre drooling steadily from his tip only makes things worse, but it’s all you can do to grit your teeth and hopefully ride it out.", parse);
			Text.NL();
			Text.Add("The bestial catboy growls and shakes his head. <i>“Hole not big enough. Me make hole bigger for next time!”</i> Tossing the centaur mare away like an old toy, he plants both hands about your waist and jams you down <i>hard</i> on his rock-solid prick.", parse);
			Text.NL();
			Text.Add("You can’t believe that this is happening to you, but it is. With all his strength focused on piston-pumping away at your [anus], you’re methodically, completely and utterly ruined into an incontinent, gaping mess. None of the barbs manage to make it in, but you nevertheless sense them pricking at your ass cheeks and shudder as what they might have done had they invaded your colon.", parse);
			Text.NL();
			Text.Add("<i>“No good!”</i> the transformed, bestial catboy roars, hammering you against his shaft in frustration. Spread wide and bruised, your ass cheeks feel like they’re going to be torn asunder. More and more steaming pre is rammed up your backside, working tendrils of heat up your colon; for a moment there, you pass out thanks to the intense stretchy pain coursing up your spine.", parse);
			Text.NL();
			Text.Add("<i>“Grrroooaaarrr!”</i> The earth-shattering roar that the catboy lets out reverberates amongst the standing stones jerks you back to wakefulness just in time for you to realize he’s tossing you to the ground. Your head still spinning, you try to crawl away from the perverse scene - only to find that you can’t feel your battered and abused ass any more save for the occasional twinge of pain.", parse);
			Text.NL();
			Text.Add("Overhead, a veritable stream of spunk blasts forth from the catboy’s barbed shaft like water from a fire hose, whipping and twisting through the air in a high-angled arc before falling upon both you and the centaur mare in a sticky, steaming shower. Grimacing, you plant your elbows in the ground and do your best to drag yourself forward and out of the shower of cum, but are surprised when a hand finds you amidst the slippery, sticky mess.", parse);
			Text.NL();
			Text.Add("It’s the centaur mare. <i>“Shit,”</i> she mumbles. <i>“Sorry about this. I didn’t know what he was up to, or what the concoction would do…”</i>", parse);
			Text.NL();
			Text.Add("It’s all right, you try to say, but the words won’t come out - and even if they would, the perversely deliciously salty taste of cat spunk stops your tongue cold. No need for words, though - you gratefully grasp the centaur’s hand as she drags you out and away from the worst of it. You can’t help but look back, though - while the catboy’s balls are ever so slightly smaller, he’s still going strong, his blasts of seed painting the standing stones a cheery clear white.", parse);
		} else { // dont fit
			Text.Add("<i>“Fit!”</i> the transformed catboy growls as he rams you down upon the head of his member, causing your [anus] to scream out in pain and terror as it’s stretched beyond what mere mortals are supposed to be capable of. <i>“Me make you fit!”</i>", parse);
			Text.NL();
			Text.Add("Despite the catboy’s exhortations, even a brute like him can’t defy the laws of nature. No matter how he twists, wiggles and worms your abused asshole upon the head of his manhood, you simply don’t possess the physical wherewithal to allow even the very tip into you, let alone the barbs that dot the head of his shaft. It doesn’t stop him from trying his very best, though, and it would almost be commendable if he wasn’t trying to split you in two, starting with your ass cheeks.", parse);
			Text.NL();
			Text.Add("Eventually, though, even he with his thick skull has to admit that he’s not going to ram his meaty, throbbing rod into you, and pauses for a moment to contemplate the situation.", parse);
			Text.NL();
			Text.Add("<i>“You no big enough to fit? Me no use back door then. Me use other end!”</i> the catboy growls, effortlessly flipping you around so that your face is directly in line with his head. With brutal determination, he begins mashing your face against his urethra - at least <i>that</i> you manage to take into your mouth, along with a little bit of the surrounding tip. It’s clearly far from satisfactory, but at least the catboy appears to be jerking himself in earnest now.", parse);
			Text.NL();

			Sex.Blowjob(player, catboy);
			player.FuckOral(player.Mouth(), catboy.FirstCock(), 2);
			catboy.Fuck(catboy.FirstCock(), 2);

			Text.Add("The brutal facefucking goes on for what seems like forever, the potent scent of masculine sex flooding your nose and mouth and turning you dizzy. Dollops of spunk splatter onto your face, rendering you practically blind, and it’s all you can do to struggle to get air in the face of being ravaged this way.", parse);
			Text.NL();
			Text.Add("<i>“Me want satisfaction!”</i> Deep and sonorous, the catboy’s voice is thunder in your ears, reverberating through your frail, fuckable flesh. <i>“Give satisfaction now!”</i>", parse);
			Text.NL();
			Text.Add("You’re doing all you can - which admittedly is not very much given the circumstances, but it’s still something! The sooner he finally gets off, the sooner this nightmare can end!", parse);
			Text.NL();
			Text.Add("Another bellow from the catboy’s barrel-chest, and he flings you away like an unloved rag-doll, sending you skidding along the soft grass, leaving a trail of slimy seed in your wake. Is it over? Is it over?", parse);
			Text.NL();
			Text.Add("Apparently not, for you feebly wipe the cum away from your eyes just in time to see the catboy blow his load, his balls clenching and pulsing as gargantuan spurts and ropes of kitten-batter erupt from his shaft, glistening as it flies through the air and rains down straight upon you. You don’t even have the strength to try and shield yourself from being painted a lovely creamy shade of white - and to be fair, even if you had the strength, there’s not much that you could’ve done against that deluge anyways.", parse);
			Text.NL();
			Text.Add("<i>“Hurry, get up!”</i> A hand reaches down for yours, and tries to hoist you upright. <i>“He’s not going to be distracted forever!”</i>", parse);
			Text.NL();
			Text.Add("You look up at your unlikely savior - the centaur mare - and let her pull you upright. No, you can’t <i>walk</i>, but you can kind of stand, and that’s just about enough for the centaur to half-lead, half-drag you out and away from the hail of jism raining down upon the two of you.", parse);
			Text.NL();
			Text.Add("Once you’re safely out of the blast radius, you promptly collapse back onto the ground, and the centaur mare follows suit. Like you, she’s completely covered in thick, goopy sperm, and heaves a sigh of relief as she tumbles down on her side not too far away from you.", parse);
			Text.NL();
			Text.Add("You thank her for rescuing you from… from your fate.", parse);
			Text.NL();
			Text.Add("<i>“Oh, don’t worry about it,”</i> she manages to gasp between pants. <i>“I wasn’t quite expecting this to happen. It was just supposed to be a bit of fun to break away from the stifling monotony of camp all day long…”</i>", parse);
			Text.NL();
			Text.Add("Right, right. Weakly, you turn your eyes away from the centaur and back to the catboy. He certainly seems to be enjoying himself, even though you aren’t sucking him off anymore - does what you did even count as sucking him off? Either way, at least the torrential rain of spunk appears to be dying down, the catboy’s balls having shrunk from the size of melons to being simply ponderous as they empty themselves into the middle of the stone circle.", parse);
		}
	}
	Text.NL();
	Text.Add("By and large, though, the flood dies down to a dribble, and the flow of cum finally comes to a halt. Spent and sated, the catboy lets loose a deep, throaty purr and flops onto his back, eyes staring up at the cloudy sky as he mumbles incoherently to himself. Doesn’t look like he’s a threat anymore, then - but where’s the last of the trio?", parse);
	Text.NL();
	Text.Add("At last, you spy just where the goat-morph alchemist went - he’s sitting up atop one of the larger monoliths, his pants hanging over the side, leaving his hindquarters buck naked. Watching the entire scene from his safe vantage point, the alchemist masturbates furiously, jerking himself off so quickly that his arm’s practically a blur. With a plaintive bleat, he shoots off a small stream of cum into the air, then collapses backwards onto the stone, panting while his prick slowly begins to soften.", parse);
	Text.NL();
	Text.Add("Both you and the centaur mare share a knowing, grumpy look.", parse);
	Text.NL();
	Text.Add("<i>“Don’t worry,”</i> she mutters. <i>“I’ll sort <b>him</b> out before we return to camp.”</i>", parse);
	Text.NL();
	Text.Add("Looks like the suppository’s effects have begun to fade, too. Behind you, the catboy is quickly reverting to his old, spineless self, one last heavy blast of sperm spurting forth from his prick as his balls return to their former size along with the rest of his body.", parse);
	Text.NL();
	Text.Add("Yeah, you have to admit you like him a <i>lot</i> better this way.", parse);
	Text.NL();
	Text.Add("It takes quite a bit of effort, but eventually you’re able to pull yourself upright, albeit unsteadily, and totter off before something worse can happen. Like it or not, you’re going to be walking funny for the next few days…", parse);
	Text.Flush();

	TimeStep({hour: 2});

	Gui.NextPrompt();
};

MaliceScoutsScenes.Group.LossMagicalBondage = function(enc: any) {
	const player = GAME().player;
	const party: Party = GAME().party;
	let parse: any = {
		hisher : player.mfTrue("his", "her"),
		himher : player.mfTrue("him", "her"),
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);

	player.AddLustFraction(0.7);

	Text.Add("<i>“You can do that spell, can’t you?”</i>", parse);
	Text.NL();
	Text.Add("The catboy looks a little uncertain and takes a step back. <i>“W-what spell?”</i>", parse);
	Text.NL();
	Text.Add("<i>“<b>That</b> spell!”</i> the alchemist snaps. <i>“You know, the one which you get asked to do all the time when we need to tie someone up and don’t have rope? Yes, that’s the one!”</i>", parse);
	Text.NL();
	Text.Add("<i>“B-but why do we need it?”</i> the catboy stammers. <i>“These ones look pretty beat up as it is; they can’t even stand. We don’t need to restrain them any -”</i>", parse);
	Text.NL();
	Text.Add("Grinning - although there’s absolutely no humor in it - the rancid old goat shushes his colleague by planting a finger on his lips. <i>“You see, when I ask you to do something, you do it. You don’t get ahead by questioning your betters, boy, and especially not when you can’t even figure out that I’m not about to tie this one up to restrain [himher], but for something else altogether, you fucking nitwit.</i>", parse);
	Text.NL();
	Text.Add("<i>“Now, are you doing to do it or not?”</i>", parse);
	Text.NL();
	Text.Add("The catboy cringes a bit, looking to the centaur mare for help but receiving none. His large ears folded back against his fuzzy head, the catboy proceeds to weave his fingers in the air, mumbling words that you can’t make out properly. By and large, tendrils of white mist curl from his outstretched fingers, wafting towards you.", parse);
	Text.NL();
	Text.Add("<i>“Yes, correct.”</i> The old goat snorts and spits on the ground. <i>“I want that one.”</i>", parse);
	Text.NL();
	if (party.Num() > 2) {
		Text.Add("<i>“And the others?”</i> the catboy asks, still cringing. <i>“What do you want to do with them?”</i>", parse);
		Text.NL();
	} else if (party.Num() > 1) {
		Text.Add("<i>“And the other one?”</i> the catboy asks fearfully. <i>“What do you intend?”</i>", parse);
		Text.NL();
	}
	Text.Add("The goat just rolls his shoulders and coughs as he fumbles about in the massive toolbelt at his waist. <i>“Not interesting. Don’t care. This one, though - a new specimen of a type that I haven’t quite had the opportunity to experiment on yet. Don’t look so cowed, kid - you’re going to have a front-row seat to <b>science</b> being performed.”</i>", parse);
	Text.NL();
	Text.Add("With that, a heavy silence falls over the circle as the catboy finishes his spell. The mist might appear incorporeal, but it’s solid enough as a tendril each wraps about your wrists, pulling them sharply behind your back as if jerked by rope. Once you’re firmly bound, the tendrils meld into one before breaking off, resulting in a pair of cuffs locking your arms together uselessly. The remainder of the bindings wrap about your forearms, encasing you from fingertip to elbow in the shimmering magical stuff.", parse);
	Text.NL();
	Text.Add("You know instinctively that this isn’t going to be something you’ll be able to break by struggling, even if you hadn’t had the stuffing just beaten out of you. ", parse);
	if (player.SubDom() >= 30) {
		Text.Add("Though it’s hard to accept your fate being bound and tied up like this, there isn’t much you can do at this juncture. If you’d wanted to change things, maybe you should have done so a little earlier, or at least before losing to this trio of ne’er-do-wells of dubious origin.", parse);
	} else if (player.SubDom() >= -30) {
		Text.Add("Well, there doesn’t seem to be anything you can do about this, so it seems that you might as well lie back and think of Eden. If you’re lucky, you might actually get some pleasure out of this… although with the grin that the alchemist’s wearing on his face, you kind of doubt it.", parse);
	} else {
		Text.Add("You know that this isn’t quite the right time for this, but there’s something in the back of your mind that’s just made so helplessly aroused to be tied up like this, to be rendered completely at someone’s mercy.", parse);
		Text.NL();
		Text.Add("You can’t help it - the more you struggle ineffectually at the magical bonds tying your arms together, the more turned on you become, and before long you feel a surge of heat pass through your breast on its way to your loins, where it blossoms into a cloud of shivering, delectable anticipation.", parse);
	}
	Text.NL();
	Text.Add("<i>“Hmph. Passable. Now don’t you ever <b>dare</b> question me again, or -”</i>", parse);
	Text.NL();
	Text.Add("<i>“Or…?”</i>", parse);
	Text.NL();
	Text.Add("<i>“Or I’ll have you join in on the experiments, too,”</i> the alchemist finishes with a sneer. <i>“Finish up with [hisher] [feet], and we can get started.”</i>", parse);
	Text.NL();
	Text.Add("Trembling, the catboy waggles his fingers again, and more mist flows from his fingers to wind about you, steadily tightening about them until there’s no chance that you’d be able to run away even if you had the strength to. Unlike the bindings on you arms, though, the catboy doesn’t wrap them in magic, content with just the coils about your person.", parse);
	Text.NL();
	Text.Add("<i>“Great job,”</i> the alchemist says, still rummaging about in his toolbelt. <i>“Now, get [himher] into position and hold [himher] there until I manage to find the paddle, will you? There’s a good kitty.”</i>", parse);
	Text.NL();
	Text.Add("Driven by something approaching sheer, unadulterated terror, the catboy mutters a few more incantations and gestures with his hands. With a sharp yank, you’re dragged upwards and into the air as your magical bindings levitate, stopping at perhaps a yard off the ground. You’re starting to feel more than a little like a pig on a poke - and with your limbs high in the air and midsection sagging towards the ground, that’s not an entirely inaccurate description of your current predicament.", parse);
	Text.NL();
	Text.Add("At length, the alchemist fishes out what he was looking for: a small bronze and wood box perhaps the size of a coconut. As you watch, he disassembles and unfurls it into some kind of contraption, complete with a tripod stand that places its top level with you. It seems incredulous to you that an entire person-sized device could fold into something small enough to fit into a belt pouch, but if anyone can manage it, it’s this unhinged old bastard.", parse);
	Text.NL();
	Text.Add("You don’t know what this is - you’ve never seen the likes of it before - but the number of gears and shafts, as well as the wheel of rotating wooden paddles, suggests quite clearly its intended purpose.", parse);
	Text.NL();
	Text.Add("<i>“This,”</i> the alchemist says proudly, sweeping a gnarled hand in a flourish, <i>“is one of my newer inventions, the automated spanker. No more getting your joints all sore having to raise and bring down the paddle over and over again - no, now you can enjoy the luxuries of a good spanking without getting the spanker all tired out. With this, you can deliver all the spankings you want, as quickly as you want them! Isn’t that wonderful?”</i>", parse);
	Text.NL();
	Text.Add("<i>“Of course, there’re a few snags and kinks to be worked out before it’s ready for public use, but that’s where you come in; it was so nice of you to volunteer for testing. And of course, credit is due to my lovely assistants, too.”</i>", parse);
	Text.NL();
	Text.Add("You throw a glance at the catboy and centaur mare, both of whom which look as if they’d really, <i>really</i> be somewhere else other than helping to get the rancid old goat’s contraption in place behind you, aimed directly at your [butt]. Unfortunately, your momentary distraction has allowed the alchemist to sneak up on you undetected, and before you know it he’s in front of you and jamming a large leather bit into your mouth, securing it in place with a pair of straps which he fastens about your head.", parse);
	Text.NL();
	Text.Add("<i>“Now then, I’m sure you’ll want this,”</i> he whispers, giving you an affectionate pat on the head. <i>“Wouldn’t want you to bite your tongue off, would we? That would be messy, and I don’t want to have to account for that extra variable.”</i>", parse);
	Text.NL();
	if (player.SubDom() >= 30) {
		Text.Add("You’d have told him to go and get dunked, but all you manage is a series of muffled grunts and snarls thanks to the bit in your mouth. The alchemist catches your death glare as he looks straight at you, then bursts into nasty laughter and gives you another patronizing pat on the head.", parse);
		Text.NL();
	} else if (player.SubDom() < -30) {
		Text.Add("No, no you wouldn’t - in fact, you’re very glad that he was thoughtful like this, for you’re practically wiggling in your bindings now. Can he get started already? Please? Please? The waiting is killing you.", parse);
		Text.NL();
		Text.Add("Of course, you can’t <i>say</i> all of this thanks to the bit in your mouth, but you’re so enthusiastic about all this that the alchemist seems to sense it for himself and quickens his footsteps as he moves into position.", parse);
		Text.NL();
	}
	Text.Add("Clearly taking far too much pleasure in this, old goat rubs his wrinkled hands together. <i>“All right, everything’s in place now.</i>", parse);
	Text.NL();
	Text.Add("<i>“Let’s do some science! Get cranking!”</i>", parse);
	Text.NL();
	Text.Add("Obediently, the centauress starts working the crank on the device, and you feel the first resounding smack of its paddle on your butt.", parse);
	Text.NL();
	if (player.Butt().Size() >= 9) {
		Text.Add("At first, you feel nothing, and then the sting of the paddle against your [skin] hits you, accompanied by a resounding smack that resonates through the circle of stones. With how expansive your booty is, the blow is cushioned somewhat, but when it finally sinks in you gasp as blood rushes to the mark the paddle made across your butt cheeks.", parse);
		Text.NL();
		Text.Add("Smack! Another hit, and this one lands squarely on the luscious fullness of your butt cheeks, sending them jiggling to and fro vigorously as tears spring to your eyes.", parse);
		Text.NL();
		Text.Add("Smack! A hit for the third time, and ", parse);
		if (player.SubDom() >= 30) {
			Text.Add("try as you might to resist it, you can’t help but feel a thrill of lustful pleasure as your body betrays you, trying to make the best of a bad situation. The spirit is strong but the flesh is weak, as the saying goes, and a muffled moan inadvertently escapes your throat, working its way about the leather bit in your mouth.", parse);
		} else if (player.SubDom() >= -30) {
			Text.Add("you bite down hard on the bit in your mouth as your ample tush takes more and more abuse. Whether you feel that way is anyone’s guess, but your body is actively getting increasingly aroused by being subjected to the machine’s furious spanking.", parse);
 } else {
			Text.Add("you feel yourself begin to give way wholly to the perversely pleasurable abuse, reveling in being paddled faster than any creature could reasonably do to you. Being tied up like this and spanked over and over again is so much fun, you can’t help but feel like a slut for taking so much enjoyment in being so submissive…", parse);
 }
		Text.NL();
		Text.Add("The machine’s paddles come and go; your bodacious booty jiggles to and fro. Quivering and wobbling like a pair of firm jellies on a plate, they manage to cushion some of the brunt from the blows rapidly landing on your tush, turning your thoughts from pain to arousal.", parse);
	} else if (player.Butt().Size() < 4) {
		Text.Add("With a butt so thin and slight as yours, you feel every bit of the blow as the paddle cracks firmly on your behind, leaving a sharp stinging across both slight mounts of your rear. This is quickly followed by a prickling rush of blood to the afflicted area - which in turn quickly gives way to another firm smack.", parse);
		Text.NL();
		Text.Add("You yelp, tears threatening to come into your eyes. With how thin your rear is, you could have sworn you felt that one all the way to the bone!", parse);
		Text.NL();
		Text.Add("<i>“Disappointing,”</i> the alchemist mutters to himself as he takes notes on a tattered sketchpad. <i>“We’ll have to design different paddles to be more ergonomic for leaner spankees…”</i>", parse);
		Text.NL();
		if (player.SubDom() >= 30) {
			Text.Add("Spankee? You’re not built to be a spankee! You’re not <i>made</i> to be a spankee - in fact, you should be the spanker, and you don’t need some stupid machine to do the job for you! Sure, it might be more efficient in terms of raw spanking power, but it doesn’t have that personal touch only a firm hand can provide, that deep connection that only a wielded paddle or whip can provide.", parse);
			Text.NL();
			Text.Add("You should know, yes.", parse);
			Text.NL();
			Text.Add("The alchemist catches the fury in your eye, and simply shrugs and grins. <i>“Heh, don’t worry. I’m sure you’ll come to like it a little by the time we’re done with you.”</i>", parse);
			Text.NL();
			Text.Add("The worst thing is, he’s right. Your mind may be pulling in one direction, but your traitorous body has decided to go in the exact opposite direction, and as the blows continue to land on your slender, bony butt, you can’t help but feel just the tiniest bit aroused, your loins stirring despite your best attempts at shutting out those treacherous thoughts.", parse);
		} else if (player.SubDom() >= -30) {
			Text.Add("You have no good answer for the alchemist, instead deciding to hold on as long as possible and hope that the alchemist’s perverted research will be done before your strength finally gives out.", parse);
			Text.NL();
			let gen = "";
			if (player.FirstCock()) { gen += "[cocks]"; }
			if (player.FirstCock() && player.FirstVag()) { gen += " and "; }
			if (player.FirstVag()) { gen += "[vag]"; }
			parse.gen = Text.Parse(gen, parse);
			Text.Add("Smack after smack lands on your slight rump, and perhaps out of desperation or a bid to get <i>something</i> useful out of this, your body starts to feel a bit horny despite the constant stinging pain from the machine’s repeated smackings. The heat of arousal blossoms in your loins, briefly creeping into your lower belly before concentrating in your [gen]. Running on automatic, you moan softly into the bit in your mouth and squirm against the magical bonds keeping you trussed up in the air, trying to work off the lust your traitorous body is accumulating.", parse);
		} else {
			let gen = "";
			if (player.FirstCock()) { gen += "your manhood[s] to stiffening, rapidly swelling with arousal and beads of pre gathering on your [cockTip][s]"; }
			if (player.FirstCock() && player.FirstVag()) { gen += " even as your lustful thoughts get the better of you. You moan as tingles run from your manhood[s] into your femininity, turning "; }
			if (player.FirstVag()) { gen += "your honeypot into a sweltering heat, and you squirm about in your magical bonds as the sudden flush of desire that makes you need to be filled"; }
			parse.gen = Text.Parse(gen, parse);
			Text.Add("Design? More ergonomic? Whyever would he want a <i>spanking</i> to be more comfortable? Doesn’t he know it’s better the more it hurts? The way the paddle is landing firmly on your slender rump, the shock of the impact sinking deep into your bones to be savored like a vintage wine… oh, just daydreaming about being swatted over and over again sends [gen].", parse);
			Text.NL();
			Text.Add("<i>“Hey,”</i> the alchemist notes, a nasty grin on his face as he scribbles furiously on a sketchpad. <i>“Seems like this one really, really likes it. Although I must say, the experimental results are probably skewed a bit from the subject’s personality, but nevertheless I think this is going to be an important data point.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Does that mean I can stop cranking now? Is the experiment over?”</i>", parse);
			Text.NL();
			Text.Add("<i>“No!”</i> the alchemist snaps. <i>“Keep on cranking it, or else I won’t let you play with it when it’s not in use!”</i>", parse);
		}
	} else {
		Text.Add("With a butt as well-proportioned as yours - not too big, not too small, but just right, as they say - each smack of the wooden paddles upon your posterior sends both mounds to quivering and trembling. They don’t actually have the mass required to <i>jiggle</i>, but you can feel the ripples spreading out on your skin from where you’re being spanked, carrying with them the angry heat of pain into your lower back.", parse);
		Text.NL();
		Text.Add("<i>“Faster! Faster!”</i> the alchemist yells, reaching up into the air and clenching his fingers as if milking a giant cow. <i>“I want to see some pain here; something to show that all those sleepless nights were worth the time!”</i>", parse);
		Text.NL();
		Text.Add("<i>“It’s already going as fast as it can!”</i> the centauress mutters grumpily, but puts her back into the cranking.", parse);
		Text.NL();
		Text.Add("Crack! Crack! Crack! More blows of the paddle arrive swift and sharp on your increasingly sore posterior, no doubt flushing a shade of angry red under your [skin] by now. ", parse);
		if (player.SubDom() >= 30) {
			Text.Add("You grit your teeth and swear that once you’re out of this thing, you’re going to hunt down this snide little alchemist and show him what a <i>real</i> spanking is all about, and without the use of a stupid contraption, too!", parse);
			Text.NL();
			Text.Add("The alchemist just looks down at you, and catching your expression, points and lets out an annoying, bleat of laughter.", parse);
			Text.NL();
			Text.Add("<i>“Ha-HA! Why, are you mad?”</i>", parse);
			Text.NL();
			Text.Add("Yeah, you’re mad indeed. Mad at this bastard and his cronies for trussing you up like this and “volunteering” you for his little science experiment, but also mad at yourself for not pushing his face into the dirt when you had the chance.", parse);
			Text.NL();
			Text.Add("<i>“Oh, I guess you sure look mad, but the rest of you isn’t. Look at it, eh? Pretty turned on, I’d say.”</i>", parse);
			Text.NL();
			let gen = "";
			if (player.FirstCock()) { gen += "your [cocks] start[notS] to twitch and throb"; }
			if (player.FirstCock() && player.FirstVag()) { gen += " and "; }
			if (player.FirstVag()) { gen += "your gash grows slick"; }
			parse.gen = Text.Parse(gen, parse);
			Text.Add("With a start, you notice that the rancid old goat is right - your traitorous body has not only let you down in the fight beforehand, but it’s actually enjoying the spanking that’s being applied to your vulnerable booty. Like it or not, the heat of arousal is welling up in your loins, growing with each firm smack of the paddle that’s applied to you. You bite back a moan as [gen], cursing the weakness of your body.", parse);
		} else if (player.SubDom() >= -30) {
			Text.Add("It’s all you can do to bite back your squeals and moans of pain as the rotating paddles go back and forth in circles, turning your [butt] increasingly red and raw. The blows aren’t strong or sharp enough to draw blood, but the stinging is distinctly uncomfortable - and arousing - as the automated spanking proceeds apace.", parse);
			Text.NL();
			Text.Add("You butt cheeks aren’t the only cheeks that’re flushed - heat is creeping into your face and blossoming in your breast, and you wiggle with increased agitation against the magical bonds keeping you suspended in the air. Not that you would be doing much even if you managed to break free, of course, not with the alchemist and his cronies but a few feet away. Like it or not, you’re utterly helpless and at their mercy… and it’s more than a little arousing.", parse);
		} else {
			const catlike = player.RaceCompare(Race.Feline);

			Text.Add("Reveling in the luxurious glow of being beaten and punished, you let out a low, muffled moan, practically purring in delight ", parse);
			if (catlike >= 0.4) {
				Text.Add("like the cat you are ", parse);
			}
			Text.Add("even as tears of pain and pleasure spring to your eyes from the firm paddling you’re receiving.", parse);
			Text.NL();
			Text.Add("Feeling a desperate need well up in your breast, you wiggle about in your magical bonds, desperately seeking something to hump and grind against in order to assuage your urges. Unfortunately, not only do you not find anything suited to that purpose, the bindings restraining you only serve to turn you on even more to the point where you feel like you’re about to blow.", parse);
			Text.NL();
			Text.Add("<i>“Hmm,”</i> the alchemist notes, eyeing you carefully as he jots something down on a sketchpad. <i>“This one’s reacting in a rather unorthodox manner. Takes a little <b>too</b> much pleasure in it, I’d say…”</i>", parse);
			Text.NL();
			if (player.FirstCock()) {
				Text.Add("You have no response to that as a shudder wracks your body all over, eventually running through your [cocks]. When it finally passes, a long, thin strand of pre dangles precipitously from your [cockTip][s] towards the ground, beading before finally snapping free.", parse);
				Text.NL();
			}
			Text.Add("Too much pleasure? Not enough, you’d say! This machine of his can deliver a spanking that’s more thorough than any flesh-and-blood creature can manage - what’s not to love about it?", parse);
		}
	}
	Text.NL();
	Text.Add("Before long, you can’t deny it any longer. Not when your body twists and writhes of its own accord in its bindings, ", parse);
	if (player.FirstCock()) {
		Text.Add("your [cocks] pulsating with release as you finally blow your load in a river of orgasmic ecstasy, emptying ", parse);
		if (player.HasBalls()) {
			Text.Add("your balls", parse);
		} else {
			Text.Add("yourself", parse);
		}
		Text.Add(" out on the gravel beneath you, leaving you utterly drained and exhausted. Seeing you flagging, the centaur mare must’ve decided to take pity on you, slowing the rate of spanking just a bit to give you time to recover between each blow of the paddles.", parse);
		Text.NL();
		Text.Add("Tied up like this, gagged and bound, watching the large puddle of salty seed you produced slowly seep into the ground - you feel", parse);
		if (player.SubDom() >= 30) {
			Text.Add(", much to your chagrin,", parse);
		} else if (player.SubDom() < -30) {
			Text.Add(" wonderfully and gloriously", parse);
 }
		Text.Add(" relieved at what you’ve done.", parse);
		Text.NL();
	}
	if (player.FirstCock() && player.FirstVag()) {
		Text.Add("But it’s not over yet. Not when a different surge of pained lust sends tingles and shudders sweeping through you, ", parse);
	}
	if (player.FirstVag()) {
		Text.Add("your [vag] squelching audibly as your inner walls clench furiously, sending rivulets of feminine honey streaming down your ", parse);
		if (player.IsNaga()) {
			Text.Add("tail", parse);
		} else {
			Text.Add("[thighs]", parse);
		}
		Text.Add(" in a thick, free-flowing waterfall. Even with the sudden initial outflow of fluids somewhat abated, your [vag] continues to weep steadily, that glistening honeypot desperately advertising its desire and readiness to be stuffed - a desire that sadly remains unrequited.", parse);
		Text.NL();
		Text.Add("Spank. Spank. Spank. The vibrations from each swat of the paddles courses through your lower body, knocking loose a spray of femcum from your honeypot to splash on the ground. You try to pant and whine, your lungs heaving, but the bit in your mouth prevents you from making any kind of meaningful sound.", parse);
		Text.NL();
	}

	const cum = player.OrgasmCum();

	Text.Add("Another glance at your captors. The centauress is decidedly not looking at you, while the catboy is doing the same, only with a bright blush on his face. Yeah, you’re not going to get anything out of them.", parse);
	Text.NL();

	// Breasts block
	// Use if breast size >= 7.5

	if (player.FirstBreastRow().Size() >= 7.5) {
		Text.Add("<i>“Oh, look. What do we have here?”</i>", parse);
		Text.NL();
		Text.Add("The alchemist’s voice groggily brings you back to some semblance of coherency, and you quickly wish that you hadn’t. The rancid old goat has set down his sketchbook and pencil, and is eyeing your [breasts] with considerable interest. Given their weight and the position that you’re in, they hang down towards the ground, a pair of pendulous orbs which are most definitely feeling their heft.", parse);
		Text.NL();
		Text.Add("To make things worse, each time the spanking machine lands another blow on your [butt], the vibrations that race through your body send the girls to jiggling and wobbling all over the place, and the only real question is why this old pervert didn’t pay attention to them sooner.", parse);
		Text.NL();
		Text.Add("<i>“Why, this is a very important set of variables that I’d almost forgotten to account for,”</i> the alchemist continues, his rheumy eyes fixed on your rack. <i>“Could’ve thrown off all the data points if I didn’t control for them, indeed. Well, better late than never; I can take a fresh set of readings while I’m about it.”</i>", parse);
		Text.NL();
		Text.Add("Grinning nastily, the rancid old goat reaches out with gnarled, bony fingers and cups one of your lady lumps, taking great care to scrape the rough skin of his palm across your nipple. Back and forth, back and forth he goes until the plump little nub of flesh is hard from all the stimulation, even though you’re still weak from your earlier release.", parse);
		Text.NL();
		Text.Add("He sneers again, and sinks his fingertips deep into firm breastflesh, shamelessly groping you while you strain against your bindings helplessly. Against all appearances, his fingers are deft and nimble, and you get the lingering suspicion that this isn’t the first time he’s pawed at a good pair of boobs…", parse);
		Text.NL();
		Text.Add("<i>“Ah, it’s been too long since I’ve had such an exceedingly suitable test subject to play around with,”</i> the alchemist tells you, a triumphant, nasty sneer plastered on his lips. <i>“It was so nice of you to come along and allow yourself to be volunteered; we all appreciate your kindness in doing so.”</i>", parse);
		Text.NL();
		if (player.SubDom() >= 30) {
			Text.Add("You let out an angry retort, muffled as it is, in which you express several hopes of misfortune personally directed at the rancid old goat’s manhood, along with a handful of colorful expletives pertaining to its attributes. Of course, it comes out about the leather bit as one indistinct mess of noise, but hey, it’s the thought which counts.", parse);
			Text.NL();
			Text.Add("The alchemist laughs at your frustration, reaching down to jab you squarely on the nose. <i>“That’s it, that’s it. Rage impotently at me some more.”</i>", parse);
			Text.NL();
			Text.Add("Impotent. That word’s going to describe something else very soon, if only you could just somehow get yourself free…", parse);
			Text.NL();
			Text.Add("<i>“But by all means, fume away.”</i> He reaches down to his pants, the stained fabric plainly tented by something massive underneath. Thrusting it in your face, he makes a show of rubbing the bulge, his fingers drawing large, smooth circles across its tip. <i>“It just turns me on even more.”</i>", parse);
		} else if (player.SubDom() >= -30) {
			Text.Add("You try and think up some kind of witty and clever response to that, but one keeps eluding you - perhaps the burning pain from the constant paddling applied to your rear end has something to do with that.", parse);
			Text.NL();
			Text.Add("<i>“Not one for talking, are you? Guess you’re not that different from the other test subjects in that regard. Oh well…”</i>", parse);
		} else {
			Text.Add("Oh, it wasn’t really any problem. You have to admit, this is feeling kind of good; it’s been a long time since you’ve had as good a mauling as this one. Not necessarily the most intense, but still good nonetheless.", parse);
			Text.NL();
			Text.Add("The alchemist looks at you askance for a moment, perhaps just a tiny bit incredulously, then clearly must have decided to go with the flow, for he harrumphs and takes a step back to consider you.", parse);
			Text.NL();
			Text.Add("<i>“And it doesn’t hurt that much?”</i>", parse);
			Text.NL();
			Text.Add("Oh, it hurts. Quite a lot, you’d imagine, but that’s what makes it so good. Now, could he just go back to shamelessly groping you like the submissive slut that you are?", parse);
			Text.NL();
			Text.Add("He looks even more taken aback at that, and frowns. <i>“Are you sure you’re not trying to use reverse psychology on me to try and get me to stop?”</i>", parse);
			Text.NL();
			Text.Add("Now, whyever would you do that when you’re clearly having so much fun? Can he just get back to it already?", parse);
		}
		Text.NL();
		Text.Add("Kneeling such that his shoulders are level with your body, the dirty old goat lays his fingers across the curve of your sumptuous lady lumps and and begins bouncing them up and down, pushing them up into your chest and then letting go, allowing gravity to pull them downwards again.", parse);
		Text.NL();
		Text.Add("Boing. Boing. In perfect time with the rhythmic spanking, too. Your eyes roll up into your head and your chest heaves as he picks up the pace, sending your [breasts] jiggling and swaying as he bounces them in his cupped palms like an expert juggler. Little explosions of bliss and splendor burst into existence behind your eyelids, and you make increasingly urgent noises in the back of your throat as the weight of your full breasts becomes almost too much to bear.", parse);
		Text.NL();
		if (player.FirstVag()) {
			Text.Add("You were already drooling before, but this is something else altogether. With boobs and cunt working together to fill every fiber of your body with mind-numbing pleasure, you cringe a moment before screaming into the leather bit as you orgasm for the second time. You can <i>feel</i> your love-tunnel throb and pulse, and then another outpouring of clear, sticky sexual fluids graces your ", parse);
			if (player.IsNaga()) {
				Text.Add("tail", parse);
			} else {
				Text.Add("[thighs]", parse);
			}
			Text.Add(", staining yourself with your own feminine nectar as the high begins to die down and be replaced with heaving exhaustion.", parse);
			Text.NL();
		}
		Text.Add("Still, the alchemist hasn’t finished having his fun yet. Humming a little tune to himself, he presses his fingers <i>hard</i> into your mammaries, sinking in deep and going for the gold.", parse);
		Text.NL();
		if (player.Lactation()) {
			Text.Add("Such pressure - the outcome was never really in doubt, was it? Twin streams of rich cream burst from your [nips], their flow encouraged by the alchemist’s cruel grasp. Practically giddy with delight, he begins to milk you openly, draining your tender breasts of their load. The gravelly ground beneath you is more than eager to drink it all up, too, leaving but a thin, wet sheen remaining.", parse);
			Text.NL();
			player.MilkDrain(15);
		}
		Text.Add("It’s too much for one body to bear. Combined with the continuous spanking that’s being applied to you and the pain of having your lady lumps squeezed like this, your body begins to give out, darkness closing in over your consciousness like a thick haze, veiling your eyes.", parse);
		Text.NL();
		Text.Add("The last thing you’re aware of are white-hot lances of pain jabbing into your body from all directions - agonizing, true, but amazingly kinky at the same time.", parse);
	} else {
		Text.Add("Unfortunately for you, the spanking is rapidly becoming more than what your frail meat shell can handle. Still, the centauress keeps on turning the handle, and as the paddle lands on your rear for the umpteenth time, you can’t help but feel consciousness gradually slipping away from you, a thick dark haze veiling your eyes…", parse);
	}
	Text.NL();
	Text.Add("You come to some time later, lying belly-down on the ground with your red and raw posterior high in the air. It feels distinctly cool, but burns like a bitch when you so much as try to move your [legs].", parse);
	Text.NL();
	Text.Add("At least there’s a silver lining to this cloud - at least they didn’t leave you in the puddle of sexual fluids you’d created, that would have been just mean.", parse);
	Text.NL();
	Text.Add("You try to move again, and your butt complains. Well, tough beans; if you lie here all day, something worse than the alchemist’s little gang is going to come across you, and then you don’t want to be found in a compromising position like this. By and large, you manage to struggle to your feet over the course of a half-hour, then lean against the nearest standing stone to catch your breath.", parse);
	Text.NL();
	Text.Add("Ugh, you’re going to be walking funny for the next few days, aren’t you?", parse);
	Text.Flush();

	TimeStep({hour: 2});

	player.AddSexExp(3);

	Gui.NextPrompt();
};

MaliceScoutsScenes.Group.LossCatRape = function(enc: any) {
	const player = GAME().player;
	const catboy = enc.catboy;

	let parse: any = {

	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);

	const virgin = player.FirstVag().virgin;

	Text.Add("<i>“Yes?”</i>", parse);
	Text.NL();
	Text.Add("The goat alchemist glances at the centauress, and the latter sidles surreptitiously over to place herself directly behind the catboy, cutting off his escape with her bulk. While this is happening, the alchemist strides over to you, fumbling about in his toolbelt.", parse);
	Text.NL();
	Text.Add("<i>“Where did I leave it, where did I leave it… ah, there!”</i> He draws out a large, phallic syringe and brandishes it aloft. There’s a viscous pink fluid roiling in its depths, and he grins as he steps towards you. <i>“Truth be told, I’ve been wanting to conduct this particular experiment for some time now, but the availability of a suitable test subject has always eluded me - there <i>are</i> a number of very specific conditions which must be met. But wonder of wonders! Who should come along today but a feline friend who meets all my requirements!</i>", parse);
	Text.NL();
	Text.Add("<i>“Now just lie there a little while longer; I promise this won’t hurt one bit.”</i>", parse);
	Text.NL();
	Text.Add("Looking at the way he’s holding the syringe with a wide, crazed grin spread on his face, you’re thoroughly disinclined to believe him. ", parse);
	if (virgin) {
		Text.Add("And as it turns out, he <i>was</i> lying - but it still doesn’t hurt as much as the old goat pulls down your [botarmor] with an overdramatic flourish. You’re in no shape to protest any further - whatever fight you had has long since been knocked out of you - and with an alacrity that defies his age, the alchemist swoops down and shoves the syringe straight into your cooch. There’s a brief flare of pain as you realize you’re no longer a virgin, followed by a strange, warm tingling about your inner walls as he depresses the plunger, injecting the fluid into you.", parse);
	} else {
		Text.Add("Surprisingly, though, he was telling the truth - it doesn’t hurt one bit as the old goat gleefully rips off your [botarmor], exposing your [vag]. With a peal of diabolical laughter, the old goat reaches down with surprising swiftness and jams the phallus-shaped syringe straight into your cooter.", parse);
		Text.NL();
		Text.Add("Whoa, whoa. You -", parse);
		Text.NL();
		Text.Add("- You feel a strange, warm tingling fan outwards inside you, the feeling of the pink goop coating your inner walls more than a little arousing. Being no stranger to having long, hard objects inserted into you, your cunt reflexively clenches about the dildo-shaped syringe, evenly spreading out the pink, slimy goop along the inside of your pussy.", parse);
	}
	Text.NL();
	Text.Add("Just what was <i>that</i> stuff?", parse);
	Text.NL();
	Text.Add("The alchemist looks down at you, then gives the syringe a firm yank. A small moan escapes your lips as it emerges with a wet popping sound, and you’re suddenly very, <i>very</i> aware that your other set of lips needs a good stuffing now that there’s nothing in them…", parse);
	Text.NL();
	Text.Add("Hey, come to think of it, was it always this warm? The Highlands are supposed to be a generally cool place, but now you’re practically sweating under your collar, your face flushed and cheeks burning. Gee, it’s really too warm in here - you need to cool off any way you can…", parse);
	Text.NL();
	Text.Add("Before your brain’s had a chance to interject, your instincts have taken control of your body and pulled off your [armor]. Phew, now that’s a <i>lot</i> better, although it’s still too damned warm for your comfort! The heat isn’t just in your face and shoulders now, it’s crept to every part of your middle, making you feel good and tingly all over. Must have been something to do with the… the… your mind tries to come up with a suitably descriptive word to name the thing which the creepy goat guy stuck in you, and fails. Oh well, it probably wasn’t that important anyway. Or maybe it was; you kinda miss having something stuffed in you. Maybe you ought to get something else to stuff you, that should be fun!", parse);
	Text.NL();
	Text.Add("Come to think of it, something smells really nice and yummy, and it’s not too far away to boot. You follow your feline nose, letting it guide you until you’re face to face with a nine-inch cat-cock, complete with barbs. It’s not quite completely stiff at the moment, but you can fix that in a jiffy. The person it’s attached to, though… well, he could use a little improvement, but any meal’s going to taste good when you’re hungry.", parse);
	Text.NL();
	Text.Add("<i>“Would you just hold still? I wouldn’t have to be so rough in restraining you if you didn’t keep on wriggling like that!”</i>", parse);
	Text.NL();
	Text.Add("<i>“N-no!”</i> the catboy wails. <i>“You never told me it would be like this! I don’t want to have my precious bodily fluids stolen!”</i>", parse);
	Text.NL();
	Text.Add("<i>“Really.”</i> The centauress looks down at the poor effeminate white kitten. <i>“Even if it feels really, really good?”</i>", parse);
	Text.NL();
	Text.Add("<i>“Yes!”</i>", parse);
	Text.NL();
	Text.Add("<i>“You said you wanted to be a man.”</i>The alchemist jabs a finger into the catboy’s little pink nose, making the latter wince in pain. <i>“Well, we’re going to make you one, like you wanted.”</i>", parse);
	Text.NL();
	Text.Add("<i>“I didn’t know that it would involve me having my precious bodily fluids taken from me!”</i>", parse);
	Text.NL();
	Text.Add("The centaur mare sighs, oblivious to the catboy’s flailing and struggling. <i>“Oh, don’t be such a big baby. This is for your own good. You’ll like it once she’s gotten started.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Every time anyone’s said that to me, it’s never been pleasant!”</i>", parse);
	Text.NL();
	Text.Add("<i>“Well, too bad. You asked for it; I spent hours making the perfect concoction, dragged you out for days on end just looking for a suitable subject, and now that we’ve got the perfect setup for the experiment, you want to back out? Perish the thought!”</i>", parse);
	Text.NL();
	Text.Add("Gee, those silly three sure seem to be angry about something. It’s a little hard to follow them - they speak so quickly, and sometimes use words that you aren’t really sure of. Oh well, so long as you’ve got a nice playmate to have fun with. Another flush of heat courses through your body, far more urgent than the others, and you squirm in place for a second or two, feeling the insides of your thighs grow wet and slick before the fluids seep into your fur, creating damp, matted patches.", parse);
	Text.NL();
	Text.Add("Mrowl. You’re so hungry, you could eat this guy all up.", parse);
	Text.NL();
	Text.Add("Padding forward on all fours, you close the distance to your little morsel, and give his white, fluffy fur a good, long nuzzle, making sure to let your sensitive whiskers brush against his inner thighs for good measure. The scent of this little morsel’s desperate arousal - seasoned with a dash of fear is making you even hungrier, but you’ve got to claim him properly first, mark him as yours. You let out a deep, throaty purr, then giggle a bit as his eyes widen while you slip your paws into what little remaining clothing he has on left and tear it away.", parse);
	Text.NL();
	Text.Add("<i>“N-no…”</i>", parse);
	Text.NL();
	Text.Add("He may be protesting, but his growing erection betrays what he’s <i>really</i> thinking. Another purr escapes your throat as you bend your head down and give his stiffening shaft an experimental lick, savoring the sensation of your rough tongue sliding across it from head to base and back again. Mm, slightly salty, but it would really taste so much better between your other set of lips…", parse);
	Text.NL();
	Text.Add("…Ooh, that’s a nice set of family jewels he’s got there. Two big and nice pearls, each one the size of a small plum and perfectly suited for a lady like you. You finish up with his man-meat, licking your lips to relish the unique flavor that it had, then turn your attention to those tender orbs dangling in front of you. Gently cupping them in the palm of one hand, you jiggle them up and down, bouncing those precious jewels about until your delicious little feline morsel whines with increasing desperation.", parse);
	Text.NL();
	Text.Add("<i>“No… I <b>like</b> my precious bodily fluids in me, thank you very much… please don’t do this to me…”</i>", parse);
	Text.NL();
	Text.Add("Somehow, the sight of your little boytoy begging desperately just serves to turn you on even more.", parse);
	Text.NL();
	if (player.SubDom() < 30 || player.Slut() < 30) {
		Text.Add("You aren’t entirely sure that you’re yourself - you know that whatever the alchemist injected into you must’ve done something to the way your head is working - but you can’t seem to hold onto any thought that isn’t about filling that horrible, horrible emptiness within you. ", parse);
	}
	Text.Add("Ah… you just feel so warm and good inside; it would be a shame if no one else could share in this delightful glow that suffuses your entire body. All you want to do is to invite a small portion of your delicious little boytoy into yourself so he can share in your pleasure.", parse);
	Text.NL();
	Text.Add("Is that too much to ask? Is it?", parse);
	Text.NL();
	Text.Add("Hee hee. It just feels so <i>good</i>, pushing your face into your little morsel’s crotch, feeling your cheeks push against his thighs, making a beeline for his balls. He gasps as you take his balls into your warm, wet mouth one at a time, but soon calms down when you take each rounded orb between your teeth - a gentle bite, not too hard, but with the implicit promise of greatly increased pressure if he dares resist any further.", parse);
	Text.NL();
	Text.Add("What are you doing? Why are you doing this? A tiny voice in the back of your mind speaks up in protest, but is quickly silenced by yet another flush of heat, this time practically overwhelming. Your entire body stiffens, your eyes cross, and you let out a hungry, desperate yowl as clear juices burst forth to stain your already soaked thighs.", parse);
	Text.NL();
	Text.Add("That’s it! No more waiting! Your legs tense, ready to spring, and you don’t hesitate as you straighten up and greedily pounce the little white-furred morsel in front of you, catching him in a flying tackle and sending the both of you tumbling to the ground. Someone or something was holding him up before, but whatever it is, it’s gone now - the world has narrowed down to just you and the sumptuous, tender meal that lies just under your paws, and it’s time to feast. He’s still struggling a little, but you quickly put a stop to that nonsense with a firm bat of your paw to his head and pin him on his back.", parse);
	Text.NL();
	Text.Add("<i>“Oww…”</i>", parse);
	Text.NL();
	Text.Add("Hmm. He’s big, but still not as big as he could be. Oh well, who cares? He’ll get big enough inside you, you’ll make sure of that. Grinning down at your little morsel like some kind of feral beast, you stretch with feline grace, pushing your hips down and grinding your cunt against the little catboy’s shaft, getting your slick, glistening juices all over him. He mewls pathetically and stops resisting, finally submitting to his proper role as your boytoy.", parse);
	Text.NL();
	Text.Add("Hey, now there’s a good stiffy; you especially liked the part where the barbs on his cockhead brushed the petals of your womanly flower. Heck, you liked it so much that you want to do it again - and you do, pressing your cunt lips against the barbed tip of your little morsel’s manhood and grinding back and forth, yowling in satisfaction as you become very keenly aware of the tiny little spikes jabbing into your soft flesh. The more you bump and grind and spill your feminine juices on them, the bigger and harder they become, giving you even more pleasure to the point you feel like your head will explode from it all.", parse);
	Text.NL();
	Text.Add("Hee hee. Wouldn’t that be funny, yes? Well, you’ll be the one making his head explode - right into you, if you’re going to have any say in the matter. Leaning your weight back onto your knees, you purr lazily as you finally guide your morsel of a boytoy into you; your wet, hungry lips are only too eager to devour his cock, gleefully stuffing itself with as much of that meaty goodness as it can get, eagerly savoring the wonderful texture and sensation of being filled like this. With all the attention you’ve lavished on him up to this point, your delicious little kitty boytoy is all lubed up and ready to go, slipping into you without any problems.", parse);
	Text.NL();

	Sex.Vaginal(catboy, player);
	player.FuckVag(player.FirstVag(), catboy.FirstCock(), 3);
	catboy.Fuck(catboy.FirstCock(), 3);

	Text.Add("Your morsel of a boytoy whimpers and paws at you, but there’s no fight in it; his breathing is coming short and rapid, that small pink tongue of his hanging out of his mouth as he begins to truly give himself over to the pleasure you’re giving him. Those firm, sensitive nubs on the tip and sides of his manhood - they bump and rub against your inner walls even as you let yourself rise and fall, rise and fall. You can feel them rubbing - no, scraping against your insides, and the twinges of pain only serve to excite you even further, feeding the sweltering fire growing deep within your belly.", parse);
	Text.NL();
	Text.Add("He’s so juicy, isn’t he? Your delicious boytoy throbs in time with the clenching of your cunt, the two quickly settling into a steady, pounding rhythm that rapidly grows more intense as you start riding him. Spirits above, that tastes good, so sumptuous to the cock-hungry monster that you are. Oh sure, it could be better, but every meal’s a feast when you’re starving.", parse);
	Text.NL();
	Text.Add("And speaking of starving, it’s not enough. You’re still desperately hungry, and need <i>more</i>; he needs to go deeper! With a furious surge of frenzied heat, you steady yourself by grabbing your boytoy’s shoulders and bash your hips against his, demanding that the remaining length that he’s so shamefully and selfishly keeping to himself should go inside you. He whimpers, but does his best to comply, moving in tandem with you to feed your hunger.", parse);
	Text.NL();
	Text.Add("And it works. Sweat beads on your forehead as you exhaust yourself, but by and large you feel your cervix begin to give way, stretching wide open to allow those last inches of man-meat between your inner lips and into your gaping maw. You can <i>feel</i> him inside you, a pressure on the inside of your lower belly, and purr deeply.", parse);
	Text.NL();
	Text.Add("Mrrrr! Mrrrrr! Good boy. See, that wasn’t that hard, was it? Not being selfish?", parse);
	Text.NL();
	Text.Add("Just having him all the way inside your heated baby-oven makes you feel incredibly good, a crushing sense of satisfaction that leaves you practically panting and dizzy with euphoria. It’s still not enough, though - you need to be stuffed even further, even more! Thinking about being filled to the brim with a bellyful of mewling kittens… it’s like your biggest dream ever! Just an armful of little white mewling fluffballs like your delicious little boytoy over here, all nice and obedient. A bit naughty at times, but a firm smack usually nips such problems in the bud, yes?", parse);
	Text.NL();
	Text.Add("Looking down at your delicious little morsel, he seems to be quite into it, too. His face has melted into an expression of exhausted delight, his gaze unfocused, and you can’t help but reach up and give his large, triangular ears a good scritching. As you suspected, that does the trick - the moment your paws come in contact with your boytoy’s large, fluffy ears, he pretty much goes limp with pleasure, his body running on automatic as his eyes glaze over in a fit of adorable purring.", parse);
	Text.NL();
	Text.Add("Good kitty. Good, delicious kitty. Just lie there like the subby boytoy that he is, and let his body do the necessary work without reservations. Effeminate in appearance though he may be, he nevertheless still knows how to do what comes naturally to him, and you purr and luxuriate in the glory of his full-mast member pushing in and out of you.", parse);
	Text.NL();
	Text.Add("Time to give him a little more pleasure of his own, then - you are a magnanimous mistress, if nothing else. ", parse);
	if (player.Lactation()) {
		Text.Add("Pushing yourself off him with your knees, you slowly and laboriously pull yourself off his shaft, feeling the emptiness of withdrawal until only his barbed tip remains in you. Looming over your boytoy, you lean forward and shove one of your [breasts] into his face, ", parse);
		if (player.FirstBreastRow().Size() >= 7.5) {
			Text.Add("the pillowy mound pressing softly against his mouth and nose, threatening to smother him with its sheer expansiveness. He lets out a few muffled meows, and you graciously ease your weight of him a little to let him breathe easier. There, now you’re all in position for the next step.", parse);
		} else {
			Text.Add("causing him to wriggle a little in surprise. Still, he doesn’t protest too much, which is good for you. Considering what you have in mind for him, it’d be a bit of a problem if he got squirmy all over.", parse);
		}
		Text.NL();
		Text.Add("If he’s going to complain about you stealing his precious bodily fluids, well, you’ve got to pay him back in kind, don’t you? Grinning, you thrust your fat little nipple into his mouth and press down hard on your boobflesh, causing a small stream of delicious cream to burst forth and land squarely in his mouth. Your little morsel’s eyes grow wide with surprise, then he purrs and begins suckling hungrily like an eager little kitten.", parse);
		Text.NL();
		Text.Add("Aww. Too bad for him, though, you aren’t about to let him get <i>all</i> of it in one go. Shifting your weight back, you return to your old position, your breast freeing itself from your boytoy’s mouth with a loud pop - followed by a wet squelch as his swollen, throbbing cock enters you once more, making you tremble in barely restrained pleasure as the barbs tickle your insides on their entry.", parse);
		Text.NL();
		Text.Add("It’s in this fashion that you allow your yummy little boytoy to have a good taste of you, relieving your aching mammaries of their lactic load. He certainly seems a lot happier for having had the milk - there’s a smile on his face, and his eyes are screwed shut in pure bliss.", parse);
		Text.NL();
		Text.Add("Aww, did he miss his mommy? Did he? Did he? Well, so long as he remains an obedient little boytoy, he can have all of your yummy milk to the last drop. There’s no need to be shy about sharing your bodily fluids, after all.", parse);
	} else {
		Text.Add("Digging into your delicious little boytoy’s fur, you slide your paws up to his chest and find his yummy little nipples. They’re not as wonderfully sensitive as yours, of course, but they’re still fun to play with, especially on such a cute and shy little morsel like he is.", parse);
		Text.NL();
		Text.Add("He realizes what you’re doing, but it’s too late, too late - not that he could have stopped you even if he’d adequate warning of your intentions. Small, whimpering noises escape his mouth as you tease each warm nipple, feeling them respond to your gentle, loving touch. His face trembles, and you can see sweat dampening his fur.", parse);
		Text.NL();
		Text.Add("Aww, that’s so cute. He’s actually getting <i>embarrassed</i>. You press your thumb down hard on a nipple, and he responds by groaning and sending a surge of blood into his dick, so strong that you actually <i>felt</i> it inside you.", parse);
		Text.NL();
		Text.Add("Hee hee. That’s adorable. The next few moments are filled with so much fun as you play with your tender little kitten boytoy, rolling your palms across his nipples, teasing and tweaking the rock-hard little buds of flesh, and generally making him a very happy little morsel indeed.", parse);
	}
	Text.NL();
	Text.Add("With such a focused effort on giving your boytoy such pleasure, it’s no surprise that he’s but moments from giving out himself. It’s clear from the pained, strangled noises coming from the back of his throat that he can’t hold back much longer. For a split second, your delicious little morsel of a boytoy squeezes his large eyes shut, and then yowls as all nine inches of his barbed feline manhood erupt in a sticky shower of spunk inside you. You can feel it painting the inside of your baby factory, all thick and gooey, finally giving you some small measure of the satiation that you’ve so desired.", parse);
	Text.NL();
	Text.Add("Yes, yes, you’re robbing this poor little kitty of every last drop of his precious bodily fluids, your heated cunt milking and wringing him for all that he’s worth, clearly intending to give no quarter and take no prisoners.", parse);
	Text.NL();
	Text.Add("Hee. For such an effeminate-looking boytoy, he’s quite the virile stud, isn’t he? Barely a few moments have passed, and already your belly is bulging ever so slightly with the sperm that he’s pouring into you. You pet him a few more times on his ears, praising him for being such a good little morsel and encouraging him to drain every single last drop of seed out from his balls and into you. Mrrrr… with such a vigorous seeding, you’d be surprised if your womanly flower weren’t set to bear fruit in a little bit.", parse);
	Text.NL();

	MaliceScoutsScenes.Catboy.Impregnate(player, catboy);

	const cum = player.OrgasmCum();

	Text.Add("He yowls again and thrusts again furiously, those cartilaginous pleasure-barbs rubbing against your insides and sending your body to quaking. ", parse);
	if (player.FirstCock()) {
		Text.Add("It’s now that your [cocks] decide[notS] to loose [itsTheir] load, erupting in a geyser of spunk that splatters all over your yummy little boytoy’s front. Most of it gets onto his torso and shoulders, sticking to his fluffy fur, but he also gets several cumshots to the face, making him mewl in surprise. Giggling, you lean forward and lick off some of the stuff off his face - it’s delicious! He should really have some himself, but if he doesn’t want to then that’s his loss.", parse);
		Text.NL();
		Text.Add("You pant wildly as you cum again and again, your ecstatic release sending spurt after spurt of seed to coat your little morsel of a boytoy in a nice, sticky layer of spunk. He’s long given up trying to shield himself, instead concentrating on just breathing, and after you’ve finally exhausted yourself he’s been turned into ", parse);
		if (cum >= 4) {
			Text.Add("a matted mess", parse);
		} else {
			Text.Add("a splattered mess", parse);
		}
		Text.Add(" from your precious gift.", parse);
		Text.NL();
		Text.Add("But that’s not all. ", parse);
	}
	Text.Add("With a yowl of your own, you send a veritable waterfall of girl-juices flooding down and out onto your boytoy’s crotch, your fingers and cunt alike clenched in a vice-like grip about him until the orgasm finally begins to pass, leaving you gloriously relieved.", parse);
	Text.NL();
	Text.Add("Yes… yes, you’re definitely not that hungry any more. Sure, you still have something of an appetite, but with a load of seed safely sequestered in your kitten-making machine you’re no longer starving, and you can feel the heat wafting from your body as it slowly leaves you. You let your boytoy remain in you a little while longer, then pull yourself free of his softening manhood with a very wet and satisfying pop.", parse);
	Text.NL();
	Text.Add("There, that wasn’t so bad, was it?", parse);
	Text.NL();
	Text.Add("He doesn’t reply, eyes staring up at the sky, face frozen in a mask of pure bliss; only the slightest rise and fall of his soft, furry chest gives you any indication that he’s still alive. Mmm… you pad around to his side and sniff him - yes, he smells wonderfully strongly of sex and spent seed. You purr softly, rubbing your face against his, and he manages to respond with a quiet mewl.", parse);
	Text.NL();
	Text.Add("There, there. There’s a good boytoy - he’s performed his stud duties admirably, and provided a delicious, sumptuous meal for your pleasure. You pat your lower tummy once more, and let out a contented sigh at the sheer sensation of being filled at last. Yes, this was a good meal, a very good meal indeed, and now you’re starting to feel more than a little drowsy. Must be a food coma…", parse);
	Text.NL();
	Text.Add("You come to some time later - you’re not sure exactly how long - your head and loins pounding. What… what just happened there? You’re not entirely sure, but there’s something about you that makes you feel all warm and good, a tingling sensation all over your skin and fur that makes you want to hug yourself.", parse);
	Text.NL();
	Text.Add("Hmm… you feel weird all over. Maybe it’s your imagination - it’s probably just the cold, it does get quite chilly up here, and you <i>are</i> lying about in your birthday suit.", parse);
	Text.NL();
	Text.Add("Well, at least there’s no sign of the trio that accosted you - all that remains in this circle of stones are a few wet splotches of fluids best not looked at too closely. Pulling yourself to your feet, you gather up your stuff from the ground and make to leave.", parse);
	Text.Flush();

	TimeStep({hour: 2});

	Gui.NextPrompt();
};

export { MaliceScoutsScenes };
