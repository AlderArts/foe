/*
 * 
 * Rabbit-morph lvl 1-2
 * 
 */

import { Entity } from '../entity';
import { Images } from '../assets';
import { TF } from '../tf';
import { AppendageType } from '../body/appendage';
import { Gender } from '../body/gender';
import { Color } from '../body/color';
import { Race } from '../body/race';
import { Element } from '../damagetype';
import { AlchemyItems } from '../items/alchemy';
import { IngredientItems } from '../items/ingredients';
import { Abilities } from '../abilities';
import { PregnancyHandler } from '../pregnancy';
import { Party } from '../party';
import { Encounter } from '../combat';
import { EncounterTable } from '../encountertable';
import { Text } from '../text';
import { Gui } from '../gui';
import { SetGameState, GameState } from '../gamestate';
import { BodyPartType } from '../body/bodypart';
import { Sex } from '../entity-sex';
import { TimeStep } from '../GAME';
import { TerryFlags } from '../event/terry-flags';
import { BurrowsFlags } from '../loc/burrows-flags';

let LagomorphScenes = {};

// TODO: Make base stats depend on Burrows flags (perhaps make a factory function?)

function Lagomorph(gender) {
	Entity.call(this);
	this.ID = "lagomorph";
	
	this.name              = "Lagomorph";
	this.monsterName       = "the lagomorph";
	this.MonsterName       = "The lagomorph";
	this.maxHp.base        = 30;
	this.maxSp.base        = 10;
	this.maxLust.base      = 5;
	// Main stats
	this.strength.base     = 8;
	this.stamina.base      = 9;
	this.dexterity.base    = 12;
	this.intelligence.base = 8;
	this.spirit.base       = 10;
	this.libido.base       = 17;
	this.charisma.base     = 12;
	
	this.elementDef.dmg[Element.mFire] = -0.5;
	
	this.level             = 1;
	if(Math.random() > 0.8) this.level = 2;
	this.sexlevel          = 3;
	
	this.combatExp         = this.level;
	this.coinDrop          = this.level * 3;
	
	if(gender == Gender.male) {
		this.body.DefMale();
		this.avatar.combat     = Images.lago_male;
	}
	else if(gender == Gender.female) {
		this.body.DefFemale();
		this.avatar.combat     = Images.lago_fem;
		this.FirstBreastRow().size.base = 5;
		this.FirstVag().virgin = false;
	}
	else {
		this.body.DefHerm(true);
		this.avatar.combat     = Images.lago_fem;
		this.FirstBreastRow().size.base = 5;
		if(Math.random() < 0.8)
			this.FirstVag().virgin = false;
	}
	this.Butt().buttSize.base = 2;
	this.Butt().virgin = false;
	
	this.body.SetRace(Race.Rabbit);
	
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.Rabbit, Color.white);
	
	this.body.SetBodyColor(Color.white);
	
	this.body.SetEyeColor(Color.blue);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
Lagomorph.prototype = new Entity();
Lagomorph.prototype.constructor = Lagomorph;

Lagomorph.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.05) drops.push({ it: AlchemyItems.Leporine });
	if(Math.random() < 0.5)  drops.push({ it: IngredientItems.RabbitFoot });
	if(Math.random() < 0.5)  drops.push({ it: IngredientItems.CarrotJuice });
	if(Math.random() < 0.5)  drops.push({ it: IngredientItems.Lettuce });
	
	
	if(Math.random() < 0.1)  drops.push({ it: IngredientItems.Whiskers });
	if(Math.random() < 0.1)  drops.push({ it: IngredientItems.HorseHair });
	if(Math.random() < 0.1)  drops.push({ it: IngredientItems.HorseCum });
	if(Math.random() < 0.1)  drops.push({ it: IngredientItems.FruitSeed });
	if(Math.random() < 0.1)  drops.push({ it: IngredientItems.FreshGrass });
	
	if(Math.random() < 0.01) drops.push({ it: IngredientItems.CorruptSeed });
	if(Math.random() < 0.01) drops.push({ it: IngredientItems.DemonSeed });
	
	if(Math.random() < 0.01) drops.push({ it: AlchemyItems.Felinix });
	if(Math.random() < 0.01) drops.push({ it: AlchemyItems.Equinium });
	if(Math.random() < 0.01) drops.push({ it: AlchemyItems.Lacertium });
	if(Math.random() < 0.01) drops.push({ it: AlchemyItems.Gestarium });
	return drops;
}

Lagomorph.prototype.Act = function(encounter, activeChar) {
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.6)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.DAttack.enabledCondition(encounter, this))
		Abilities.Physical.DAttack.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}


function LagomorphAlpha(gender) {
	Lagomorph.call(this, gender);
	
	this.name              = "Alpha";
	this.monsterName       = "the lagomorph alpha";
	this.MonsterName       = "The lagomorph alpha";
	
	this.maxHp.base        *= 2;
	this.maxSp.base        *= 1.2;
	this.maxLust.base      *= 2;
	// Main stats
	this.strength.base     *= 1.4;
	this.stamina.base      *= 1.2;
	this.dexterity.base    *= 1.5;
	this.intelligence.base *= 1.1;
	this.spirit.base       *= 1.2;
	this.libido.base       *= 2;
	this.charisma.base     *= 1.3;
	
	this.level             = Math.floor(this.level * 1.5 + 0.5);
	this.sexlevel          = Math.floor(this.sexlevel * 1.5 + 0.5);
	
	this.combatExp         *= 2;
	this.coinDrop          *= 2;
	
	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
LagomorphAlpha.prototype = new Lagomorph();
LagomorphAlpha.prototype.constructor = LagomorphAlpha;

/*
 * TODO Drop table & act for alpha
 */

function LagomorphElite(gender) {
	Lagomorph.call(this, gender);
	
	this.name              = "Elite";
	this.monsterName       = "the lagomorph elite";
	this.MonsterName       = "The lagomorph elite";
	
	this.maxHp.base        *= 6;
	this.maxSp.base        *= 4;
	this.maxLust.base      *= 4;
	// Main stats
	this.strength.base     *= 4;
	this.stamina.base      *= 4;
	this.dexterity.base    *= 4;
	this.intelligence.base *= 4;
	this.spirit.base       *= 4;
	this.libido.base       *= 4;
	this.charisma.base     *= 4;
	
	this.level             = Math.floor(this.level * 4);
	this.sexlevel          = Math.floor(this.sexlevel * 4);
	
	this.combatExp         *= 4;
	this.coinDrop          *= 4;
	
	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
LagomorphElite.prototype = new Lagomorph();
LagomorphElite.prototype.constructor = LagomorphElite;


/*
 * TODO Drop table & act for elite
 */


function LagomorphBrute(gender) {
	gender = gender || Gender.male;
	Lagomorph.call(this, gender);
	
	this.name              = "Brute";
	this.monsterName       = "the lagomorph brute";
	this.MonsterName       = "The lagomorph brute";
	
	this.avatar.combat     = Images.lago_brute;
	
	this.maxHp.base        *= 10;
	this.maxSp.base        *= 3;
	this.maxLust.base      *= 2;
	// Main stats
	this.strength.base     *= 5;
	this.stamina.base      *= 4;
	this.dexterity.base    *= 0.9;
	this.intelligence.base *= 0.9;
	this.spirit.base       *= 2;
	this.libido.base       *= 2;
	this.charisma.base     *= 0.9;
	
	this.level             *= 3;
	this.sexlevel          *= 3;
	
	this.combatExp         *= 3;
	this.coinDrop          *= 3;
	
	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
LagomorphBrute.prototype = new Lagomorph();
LagomorphBrute.prototype.constructor = LagomorphBrute;

// TODO: Drop table

LagomorphBrute.prototype.Act = function(encounter, activeChar) {
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.4)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.6 && Abilities.Physical.CrushingStrike.enabledCondition(encounter, this))
		Abilities.Physical.CrushingStrike.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.Bash.enabledCondition(encounter, this))
		Abilities.Physical.Bash.Use(encounter, this, t);
	else if(choice < 0.9 && Abilities.Physical.Frenzy.enabledCondition(encounter, this))
		Abilities.Physical.Frenzy.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}


function LagomorphWizard(gender) {
	gender = gender || Gender.male;
	Lagomorph.call(this, gender);
	
	this.avatar.combat     = Images.lago_brain;
	
	this.name              = "Wizard";
	this.monsterName       = "the lagomorph wizard";
	this.MonsterName       = "The lagomorph wizard";
	
	this.maxHp.base        *= 1.5;
	this.maxSp.base        *= 6;
	this.maxLust.base      *= 2;
	// Main stats
	this.strength.base     *= 1.2;
	this.stamina.base      *= 1.1;
	this.dexterity.base    *= 3;
	this.intelligence.base *= 5;
	this.spirit.base       *= 5;
	this.libido.base       *= 2;
	this.charisma.base     *= 2;
	
	this.level             *= 3;
	this.sexlevel          *= 3;
	
	this.combatExp         *= 3;
	this.coinDrop          *= 3;
	
	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
LagomorphWizard.prototype = new Lagomorph();
LagomorphWizard.prototype.constructor = LagomorphWizard;

// TODO: Drop table

LagomorphWizard.prototype.Act = function(encounter, activeChar) {
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.1)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.3 && Abilities.Black.Fireball.enabledCondition(encounter, this))
		Abilities.Black.Fireball.Use(encounter, this, t);
	else if(choice < 0.5 && Abilities.Black.Freeze.enabledCondition(encounter, this))
		Abilities.Black.Freeze.Use(encounter, this, t);
	else if(choice < 0.7 && Abilities.Black.Bolt.enabledCondition(encounter, this))
		Abilities.Black.Bolt.Use(encounter, this, t);
	else if(choice < 0.9 && Abilities.Black.Venom.enabledCondition(encounter, this))
		Abilities.Black.Venom.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}

LagomorphScenes.Impregnate = function(mother, father, slot) {
	mother.PregHandler().Impregnate({
		slot   : slot || PregnancyHandler.Slot.Vag,
		mother : mother,
		father : father,
		race   : Race.Rabbit,
		num    : 4,
		time   : 20 * 24
	});
}

LagomorphScenes.GroupEnc = function() {
	var enemy = new Party();
	var enc = new Encounter(enemy);
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		var alpha = burrows.GenerateLagomorphAlpha();
		enc.alpha = alpha;
		enemy.AddMember(alpha);
		enemy.AddMember(burrows.GenerateLagomorph());
		enemy.AddMember(burrows.GenerateLagomorph());
		enemy.AddMember(burrows.GenerateLagomorph());
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		var brute = new LagomorphBrute(Gender.male);
		enc.brute = brute;
		enemy.AddMember(brute);
		enemy.AddMember(burrows.GenerateLagomorph());
		enemy.AddMember(burrows.GenerateLagomorph());
		enemy.AddMember(burrows.GenerateLagomorph());
	}, 1.0, function() { return burrows.BruteActive(); });
	scenes.AddEnc(function() {
		var brainy = new LagomorphWizard(Gender.female);
		enc.brainy = brainy;
		enemy.AddMember(brainy);
		enemy.AddMember(burrows.GenerateLagomorph());
		enemy.AddMember(burrows.GenerateLagomorph());
		enemy.AddMember(burrows.GenerateLagomorph());
	}, 1.0, function() { return burrows.BrainyActive(); });
	scenes.AddEnc(function() {
		var herm = new Lagomorph(Gender.herm);
		enc.herm = herm;
		enemy.AddMember(herm);
		enemy.AddMember(burrows.GenerateLagomorph());
		enemy.AddMember(burrows.GenerateLagomorph());
		enemy.AddMember(burrows.GenerateLagomorph());
	}, 1.0, function() { return burrows.HermActive(); });
	
	scenes.Get();
	
	/*
	enc.canRun = false;
	enc.VictoryCondition = ...
	*/
	
	enc.onEncounter = LagomorphScenes.PlainsEncounter;
	enc.onLoss      = LagomorphScenes.GroupLossOnPlains;
	enc.onVictory   = LagomorphScenes.GroupWinOnPlainsPrompt;
	
	return enc;
}

LagomorphScenes.PlainsEncounter = function() {
	let player = GAME().player;
	let party = GAME().party;
	var enc = this;
	
	var parse = {
		himherthem : party.Num() > 1 ? "them" : player.mfFem("him", "her")
	};
	
	parse = player.ParserTags(parse);
	
	Text.Clear();
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("As you wander about, your [ears] twitch as familiar sounds reach them: soft, high-pitched moans and groans, lewd squelches and slurps, a perverse chorus that compels you to investigate. The sounds grow louder and louder as you follow them, and it doesn’t take more than a few minutes before you have uncovered the source.", parse);
		Text.NL();
		Text.Add("There before you sprawls a mass of furry bodies, writhing in the throes of indiscriminate carnal passion. A bounty of bunny-morphs are busily fucking one another, indiscriminately molesting any and every bunny in reach and being molested in turn.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("As you crest a hill, you are met by the sight of a large group of bunnies engaged in a large fuck-pile, reminiscent of the orgy in the Pit. Vena’s spawn are running rampant across the countryside, though their lack of focus make them less of a threat.", parse);
		Text.NL();
		Text.Add("Unless you happen to get inside their range and catch their attention, that is.", parse);
	}, 1.0, function() { return burrows.Access(); });
	
	scenes.Get();
	Text.NL();
	
	if(enc.brainy) {
		Text.Add("<i>“Oh, will you all cut it out!”</i> screeches an indignant female voice, clearly quite unhappy with what is going on. From amongst the mass of bodies comes the figure of a female rabbit-morph, quite modestly dressed in comparison. She’s actually wearing clothes, however rudimentary in nature - little more than an improvised dress crudely sewn from scraps of salvaged cloth, and a pair of spectacles perched on her little pink nose.", parse);
		Text.NL();
		Text.Add("She steps pointedly over one rutting pair, nose twitching in disgust. <i>“Seriously, Father sent us out on a scouting mission, not to gad about fucking each other! That’s what the Pit is for!”</i> she complains, angrily glowering about at her companions. Her gaze shifts in your direction and she starts, a gasp of shock bubbling out between her lips.", parse);
		Text.NL();
		Text.Add("<i>“Now look what you’ve done! We’re under attack - come on, get up, get <b>up</b>, you stupid sluts!”</i> she screams, violently kicking at a thrusting bunny-butt. <i>“Get [himherthem], you idiots!”</i>", parse);
		Text.NL();
		Text.Add("The kicked rabbits stir to their feet, chittering unhappily even as the female’s curses rouse others nearby to join you. Still, many more bunnies continue to happily fuck each other, the spectacle-wearing bunny cursing them even as she brandishes a stick in your direction.", parse);
		Text.NL();
		Text.Add("You have a fight on your hands!", parse);
	}
	else if(enc.brute) {
		Text.Add("<i>“Good...”</i> rumbles an alarmingly deep voice, drawing your attention to the owner. It’s a rabbit... but definitely not like the other bunnies around him. This one is a monster, easily twice the size of his compatriots, muscles bulging visibly beneath his tangled pelt. He is holding a smaller bunny in his arms, brutally thrusts into it twice, then lets out a veritable roar of pleasure. The lagomorph caught in the brute’s arm squeals in ecstasy, the sound barely audible over the brute’s roar. Sperm gushes messily from the smaller rabbit’s rear, plastering the brute’s thighs even as the bulk of it distends the rabbit’s stomach with a faux-pregnancy.", parse);
		Text.NL();
		Text.Add("Grunting casually, the bunny-brute pulls the now-bloated rabbit from his loins, revealing a half-flaccid cock easily as long as his arm bobbing in the breeze, then casually dumps his former partner atop the pile of still-fucking bunnies. At once, the brute is swarmed by eager-looking morphs, all excitedly yammering, reaching their hands for his impressive piece of fuckmeat. A self-satisfied grin crosses the brute’s features as he looks idly around, clearly ready to pick his next playmate, but then he looks right at you.", parse);
		Text.NL();
		Text.Add("An expression of dull surprise washes over the hulking lagomorph’s features, quickly chased away by a horny grin, cock rising to its full length once again. <i>“Fresh meat!”</i> he thunders, and charges impatiently toward you, his jealous groupies swarming after him. You have to defend yourself!", parse);
	}
	else if(enc.herm) {
		Text.Add("The mound of writhing bodies seems to ripple and heave, its ceaseless throes eventually throwing forth a stumbling figure, notably larger than its compatriots. The lagomorph sports a fine pair of heaving breasts upon her chest, but as she wades from the sea of bunnies, her mouth curled into an “O-shape” of pleasure, a distinctly masculine cock is revealed, an eager rabbit greedily suckling and lapping at it even as another humps away at her bouncy butt.", parse);
		Text.NL();
		Text.Add("Impatiently, the herm lagomorph wriggles, tossing back the bunny humping her ass, kicking away the one trying to suck her cock. She pouts impatiently, clearly dissatisfied with her current choice of playmates, and looks around as if hoping to see something better. She spots you and her eyes light up with glee.", parse);
		Text.NL();
		Text.Add("<i>“New sexy!”</i> she squeals happily, clapping her hands, the delighted activity drawing several curious lagomorphs to look up and see you. She hops up and down in her excitement, and then starts racing toward you, a few of the other horny bunnies abandoning their fellows to join her in your assault.", parse);
		Text.NL();
		Text.Add("You can’t run; you have to fight!", parse);
	}
	else {
		parse = enc.enemy.Get(0).ParserPronouns(parse);
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("<i>“New catch! Reward!”</i> exclaims one of the rabbits just returning from scouting. [HeShe] rushes toward you, followed by [hisher] siblings.", parse);
			Text.NL();
			Text.Add("Looks like it’s a fight!", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("One of the dazed hoppers, having just finished inside its latest conquest, happens to look at you. Life instantly returns to the critter’s half-lidded eyes as [heshe] gets up on [hisher] feet and charges toward you, leaving a trail of juices behind. [HeShe] only stops to tug at a few others and call out to them, <i>“Fresh meat! Father happy!”</i>", parse);
			Text.NL();
			Text.Add("Seems like there’s no point in arguing; you’ll have to fight.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("Noticing your arrival, a small group of sex-crazed bunnies separate from the larger pile, clambering over each other as they swarm toward you. The little critters are quick, and they have you surrounded in the blink of an eye.", parse);
			Text.NL();
			Text.Add("You ready yourself for combat!", parse);
		}, 1.0, function() { return true; });
		
		scenes.Get();
	}
	Text.Flush();
	
	// Start combat
	Gui.NextPrompt(function() {
		enc.PrepCombat();
	});
}

LagomorphScenes.GroupLossOnPlains = function() {
	SetGameState(GameState.Event, Gui);
	
	var enc = this;
	Gui.Callstack.push(function() {
		Text.Clear();
		var scenes = new EncounterTable();
	
		// TODO: Add alternate loss scene that 
		scenes.AddEnc(function() {
			LagomorphScenes.GroupLossOnPlainsToBurrows(enc);
		}, 1.0, function() { return burrows.flags["Access"] == BurrowsFlags.AccessFlags.Unknown; });
		
		if(enc.brainy) {
			scenes.AddEnc(function() {
				LagomorphScenes.GroupLossOnPlainsBrainy(enc);
			}, 1.0, function() { return true; });
		}
		// TODO Fallback
		else if(scenes.encounters.length == 1) {
			scenes.AddEnc(function() {
				Text.Add("TODO PLACEHOLDER");
				Text.Flush();

				Gui.NextPrompt();
			}, 1.0, function() { return true; });
		}
		/*
		scenes.AddEnc(function() {
			Text.Add("", parse);
			Text.NL();
		}, 1.0, function() { return true; });
		*/
		scenes.Get();
	});
	
	Encounter.prototype.onLoss.call(enc);
}


LagomorphScenes.GroupLossOnPlainsBrainy = function(enc) {
	let player = GAME().player;
	let party = GAME().party;
	var p1cock = player.BiggestCock();

	var brainy = enc.brainy;
	var parse = {
		
	};
	
	parse = player.ParserTags(parse);
	parse["comp"] = party.Num() == 2 ? party.Get(1).name :
	                party.Num() >  2 ? "your companions" : "";
	parse["comp2"] = " and " + parse["comp"];
	parse["himher"] = player.mfTrue("him", "her");
	
	Text.Clear();
	if(player.LowerBodyType() != LowerBodyType.Single)
		Text.Add("You fall to your knees, no longer capable of standing up after being beaten by the rabbits.", parse);
	else
		Text.Add("You sink to the ground, holding yourself propper on an arm as you look toward the rabbits.", parse);
	Text.Add(" The spectacle-wearing rabbit smirks as she watches you[comp2] collapse.", parse);
	Text.NL();
	Text.Add("<i>“Bet you thought that you couldn’t lose to a bunch of weak little bunnies, hmm?”</i> She steps toward you, looking you over speculatively. A hand rises up and rubs her chin in contemplation, before she nods. <i>“You! Pin [himher] down!”</i> she barks, pointing at about half a dozen of the lagomorphs that defeated you for emphasis.", parse);
	parse = Text.ParserPlural(parse, party.Num() > 2);
	if(party.Num() > 1)
		Text.Add(" <i>“The rest of you, make yourselves useful and keep an eye on [thatThose] one[s]!”</i> she adds, gesturing to [comp].", parse);
	Text.NL();
	Text.Add("With a chorus of soft squeaks, they quickly scurry to do her bidding. Rolling you over onto your back and pinning you down by the arms and [legs], they wrap their fluffy little forms around your limbs as best they can.", parse);
	if(party.Num() > 1) {
		parse["heshethey"] = party.Num() > 2 ? "they" : party.Get(1).heshe();
		Text.Add(" Other bunnies hasten to cordon off [comp], ensuring [heshethey] can’t get to you.", parse);
	}
	Text.NL();
	Text.Add("You struggle instinctively, but as tired as you are, you simply can’t free yourself from the furry little pests. Looks like you have no choice but to comply with their orders for now. As you reluctantly settle back down, the upside-down visage of the bunny leader comes into view, a smirk on her lips.", parse);
	Text.NL();
	Text.Add("<i>“You could be just what I need...”</i> she muses, more to herself than to you. Ignoring any reply you might make, she starts to sweep her gaze back and forth along your body.", parse);
	Text.NL();
	if(player.FirstCock()) {
		Text.Add("Her gaze falls upon your [cocks] and she visibly pauses, tongue nervously dabbing at her lips. With a hard swallow, she forces herself to nervously shake her head and move on.", parse);
		Text.NL();
	}
	Text.Add("<i>“Yes... alright.”</i> Her fingers fidget as they grip the edge of the crude handmade dress she’s wearing, and she sucks in a nervous breath. Then, in a sudden burst of motion, eager to get it over with, she grabs hold of the hemline and pulls up, roughly yanking her clothes up and over her head, leaving her naked before you.", parse);
	Text.NL();
	Text.Add("Without her clothes, you’re free to look at the bunny’s feminine form. She’s pretty curvy, if a bit on the short side. And from the looks of it, her brain is not the only thing that’s bigger in comparison to her siblings. She’s sporting a pair of huge breasts, about DD-cups if your estimations are correct. Down below, between her soft thighs, you see a pink slit. It’s already puffy and seems to be winking at you. Her arousal is clear; small streams run along her inner thighs, glistening in the light as she bends over to lay down her clothes.", parse);
	Text.NL();
	Text.Add("She looks down at you, expression uncertain, one elongated foot rubbing nervously against her calf. She opens her mouth, as if to say something, but then closes it, swallowing the words stillborn. A long ear flicks and she draws herself up straighter. Almost demurely, she pads forward, a foot to either side of your head, cunt practically dripping into your face, and then squats down. Her sex hovers mere inches above your nose, filling your nostrils with the scent of her arousal, a rich and heavy musk that your body can’t help but respond to.", parse);
	Text.NL();
	Text.Add("<i>“Let’s see what you can do. Lick me.”</i>", parse);
	Text.NL();
	if(player.Slut() < 30)
		Text.Add("...It seems you have little choice. You reluctantly open your mouth as the hopper’s mons steadily approach your maw.", parse);
	else if(player.Slut() < 60)
		Text.Add("Well, maybe this won’t be so bad. You open your mouth and roll out your [tongue] to receive the approaching lapine pussy, already wondering what it will taste like.", parse);
	else
		Text.Add("It’s difficult to hide your excitement as she lowers herself over you. You can barely contain yourself as you lick your lips and open wide, rolling your [tongue] out like a red carpet as you wait for her hips to lower enough for you to taste her.", parse);
	Text.NL();
	Text.Add("She sucks in a quiet breath between her lips, shivering once, and then allows herself to fall the last few inches. Her thighs press against your head for support, blocking out most of the light and leaving you in a warm, musk-heavy darkness. A trickle of juices drips slowly and steadily onto your lips, the taste seeping over your tongue already.", parse);
	Text.NL();
	Text.Add("Needing no further instruction to get started on your task, you begin. Slowly, you lick around her labia, lapping up her juices as you circle her slit. Your hands move to grasp her butt, holding her in place as well as adjusting her so you can reach the entirety of her treasure. Ever so slowly, you begin to creep inside her. Only half an inch at first, but slowly progressing with each pass of your tongue.", parse);
	Text.NL();
	Text.Add("<i>“Oooh! Oh, that - ah! - that feels good...”</i> she moans happily, wriggling atop your face to better facilitate the probing of your tongue into her depths. A steady trickle of liquid arousal meets your tongue, drooling across your face and puddling in the back of your mouth. Her thighs clamp together unconsciously, pinning your face firmly in place as she unthinkingly grinds down against you.", parse);
	Text.NL();
	Text.Add("Taking that as an incentive to probe deeper, you do just that.", parse);
	Text.NL();
	parse["boygirl"] = player.mfTrue("boy", "girl");
	Text.Add("<i>“Mmm, good [boygirl]... I think a special - yeep! - treat is in order,”</i> she coos, squeaking in delight as your tongue hits a particularly sensitive spot inside her. As best she can, she leans forward, hands stretching down your body toward your nethers.", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	var usecock = false;
	scenes.AddEnc(function() {
		Text.Add("Like iron filings to a magnet, her fingers are drawn to[oneof] your [cocks], wrapping themselves around the half-turgid flesh as best they can. With surprising expertise, she grips you - not so hard as to hurt, but with plenty of pressure that you can feel her - and begins to stroke. Up and down, she alternates, squeezing and releasing with each passage, kneading the flesh with dexterous ripples of her digits, coaxing you to erection.", parse);
		Text.NL();
		Text.Add("You gasp in surprise when her deft fingers begin stroking your [cock]. ", parse);
		usecock = true;
	}, 1.0, function() { return player.FirstCock(); });
	scenes.AddEnc(function() {
		parse["c"] = player.FirstCock() ? Text.Parse("Passing over your [cocks] in the process, h", parse) : "H";
		Text.Add("[c]er fingers reach for your womanhood. Nimbly, her fingertips start to stroke your netherlips, teasingly caressing around your opening. With surprising adeptness for someone so apparently prudish, she teases open your folds and begins to work her fingers inside, gentle but insistent strokes and thrusts that slowly feed her into your cunt.", parse);
		Text.NL();
		Text.Add("You gasp in surprise when her deft fingers begin fingering your [vag]. ", parse);
	}, 1.0, function() { return player.FirstVag(); });
	
	scenes.Get();
	
	if(player.LowerBodyType() != LowerBodyType.Single)
		Text.Add("Slowly, you spread your [legs], allowing the lapine full access to your goods. ", parse);
	else
		Text.Add("Slowly, you adjust yourself, making it easier for the lapine to access your goods. ", parse);
	Text.Add("Up top, you grip her butt, massaging it as you redouble your efforts at eating her out. Every few licks, you give her clitty a flicker with the tip of your tongue, drawing a fresh moan out of your lover. Her juices flow copiously, almost faster than you can lap them. If this keeps up, it won’t be long before you’re rewarded with a flood of bunny-juice… and if she keeps up her treatment, it won’t be long until she’s equally rewarded.", parse);
	Text.NL();
	Text.Add("<i>“H-hey! What are - oooh! - what are you idiots doing?”</i> your assailant suddenly cries out. <i>“Y-you’re supposed to be h-holding [himher] down, not ma..ma...not playing with yourselves!”</i>", parse);
	Text.NL();
	Text.Add("Through the pounding of your own heartbeat in your ears, you are dimly aware of the high-pitched sounds of heavy bunny breathing, lustful pants and groans making their way through the thighs muffling your ears. With what the lagomorph mounted atop you had to say, you have a good idea why...", parse);
	Text.NL();
	Text.Add("Small hands suddenly latch onto your own hands, insistently tugging at you and pulling you away from cupping the alpha-rabbit’s butt. Unable to fight them off, you allow them to draw your palms away, something hot, round, soft-firm and dripping slime pressing itself against each hand in turn. It looks like two of the horny bunnies want themselves a handjob...", parse);
	Text.NL();
	if(player.Slut() >= 60)
		Text.Add("You see no reason not to grant them their wish, especially since this means you can cover the lapine atop you with her sibling’s cream. Of course, you’d get soaked too… but that wouldn’t be so bad now, would it?", parse);
	else if(player.Slut() >= 30)
		Text.Add("Normally, you’d have a thing or two to say about this, but right now you’re too busy to care. So you decide to grant them a small reprieve and begin moving your hands. The effort is only half-hearted though, as you have better, and more delicious, things to do...", parse);
	else
		Text.Add("As if getting your face buried into a horny hopper’s muff wasn’t enough… well, you’re too busy to bother. They can have your hands, but you’re not going to stroke them.", parse);
	Text.NL();
	Text.Add("<i>“What the hell do you think you’re doing?! You can’t just go grabbing <b>my</b> fuckbuddy like that - certainly not while I’m still fucking [himher]! Do you want to make me fall off?”</i> The lagomorph atop you complains loudly, wobbling slightly as if in emphasis, though her hand remains fixed to your genitals as if glued there.", parse);
	Text.NL();
	Text.Add("If the bunnies she’s yelling at apologize, you certainly can’t make sense of it. Finally, an exasperated huff billows from the rabbit atop you. <i>“Stupid useless... oh, very well. Not like you can do anything else,”</i> she grumbles. You have a feeling she’s rolling her eyes at their antics.", parse);
	Text.NL();
	parse["cockpussy"] = usecock ? p1cock.Short() : "pussy";
	Text.Add("The two bucks with their cocks in your hands grunt and hiss, thrusting their hips aimlessly into your palms. Above you, the alpha molests your [cockpussy] with greater abandon, wriggling her hips to grind her muff into your face. Fluid is flowing thick and strong into your mouth, drenching your tongue in her taste and forcing you to swallow to keep up. <i>“C-come on then... I’m getting close, you know you have to be too...”</i> she stutters, hissing in a way that implies she’s biting her lip to keep herself from blowing right there and then.", parse);
	Text.NL();
	Text.Add("She’s right, you won’t be able to keep this up for much longer. Your climax is approaching, and your lungs are already straining with the lack of air. Whenever you do manage to catch a breath, the air is so heavy with pheromones that you can’t keep yourself from gasping in arousal.", parse);
	Text.NL();
	if(usecock)
		Text.Add("The bunny’s fingers play your cock like an instrument, squeezing and clenching, dexterously caressing every inch of your fuckmeat, trembling with her desire to pleasure you, stroking faster and rougher in her impatience.", parse);
	else
		Text.Add("The lagomorph’s fingers piston in and out of your cunt, what feels like three or four fingers stretching you out even as she all but pounds away inside of you. She grunts and wriggles, moaning impatiently, too caught up in the feelings of your own tongue lapping away to concentrate on anything other than her desire to make you cum.", parse);
	Text.NL();
	Text.Add("A wordless protest bubbles out of the rabbit’s throat and she arches her back, squealing in ecstasy as climax makes her whole body shake violently atop you. Her cunt gushes into your mouth, assaulting you with the liquid tide of her orgasm, forcing you to swallow several mouthfuls of hot, musky fluids.", parse);
	Text.NL();
	if(usecock)
		Text.Add("Unable to hold back any longer, you reflexively thrust into her grip, letting out a muffled cry as you send jet after jet of white, hot seed arcing through the air. Most of it splattering over the lapine nerd above you.", parse);
	else
		Text.Add("Crying out into her muff, you finally let yourself go and paint her fingers with your juices. Your femcum soaks into the rabbit’s furry paws before dripping to the ground and forming a veritable puddle underneath.", parse);
	Text.NL();
	Text.Add("The sights and scents are too much for the other lapines clustering around you. An off-key chorus of high-pitched moans and squeals makes its way dimly to your ears, and you feel hot juices splashing over your [skin] as the others do their best to paint you with their perverse fluids.", parse);
	Text.NL();
	Text.Add("Panting in satiation, your captor slumps atop you, still idly squatting over your face. You feel warm weight pressing against your body, suggesting the other bunnies are joining her in using you like a couch. You have no idea how long it is, trapped there in the musk-muggy hot darkness, before a feminine sigh echoes from above you.", parse);
	Text.NL();
	Text.Add("<i>“That... well, I suppose that wasn’t so bad,”</i> come the alpha-bunny’s voice, even as she slowly pushes off of you, wobbling a little as a few last drips of femcum splatter on your cheek. <i>“I... okay, yeah, I think I’m done. C-come on, you lot, let’s get out of here... I said get up!”</i> she hisses, ears bristling as she glowers at some of the bunnies that, yes, are indeed cuddling up to you like a giant pillow.", parse);
	Text.NL();
	Text.Add("They squeak and mutter in protest, but shuffle off of you and wander away, leaving you to catch your breath. By the time you have recovered, the whole orgy has up and vanished, leaving just you[comp2] behind. You clean yourself off as best you can, get dressed again, and set off once more.", parse);
	Text.Flush();
	
	Gui.NextPrompt();
}

LagomorphScenes.GroupLossOnPlainsToBurrows = function(enc) {
	let player = GAME().player;
	let party = GAME().party;
	var alpha = enc.alpha;
	var parse = {
		p1name     : function() { return party.members[1].name; },
		m1HeShe    : function() { return alpha.HeShe(); },
		m1heshe    : function() { return alpha.heshe(); },
		m1HisHer   : function() { return alpha.HisHer(); },
		m1hisher   : function() { return alpha.hisher(); },
		m1himher   : function() { return alpha.himher(); },
		m1cock 	   : function() { return alpha.FirstCock().Short(); }
	};
	
	parse = player.ParserTags(parse);
	
	Text.Clear();
	Text.Add("You try to scuttle back as the horde moves in, surrounding you on all sides. More have joined the ranks of those that defeated you, and they crowd in on you, incoherent lust filling their eyes. They pin you down, their eager paws groping you and feeling you up. It’s quite disconcerting, being mobbed by an army of humanoid bunnies with large, floppy ears, but right now you are too weak to mount any resistance.", parse);
	Text.NL();
	if(party.Two()) {
		Text.Add("A muffled shout indicates that [p1name] has also been captured by your fluffy adversaries.", parse);
		Text.NL();
	}
	else if(!party.Alone()) {
		Text.Add("Muffled shouts indicate the rest of your party have been similarly restricted.", parse);
		Text.NL();
	}
	Text.Add("The mob has started to tear off your clothes, exposing your [skin] to the eager crowd. This is it, they are going to rape you, and judging by the large number of stiff cocks suddenly looming over your nude form, they are going to take hours. You briefly wonder if they hold to the mold of “fucking like rabbits”, though you suspect you’ll find out shortly, whether you want to or not.", parse);
	Text.NL();
	Text.Add("Just as they are about to descend on you, a high voice shouts a short, rapt command, halting them. The horde reluctantly retract their groping hands, shuffling out of the way to reveal their leader, not too different from [m1hisher] followers, but wearing a determined look on [m1hisher] small, furred face.", parse);
	Text.NL();
	Text.Add("<i>“No!”</i> [m1heshe] repeats the order. <i>“Take back!”</i> Before you have time to puzzle over this, the mob closes in again, countless hands grabbing hold of you, hoisting you into the air.", parse);
	if(player.Weigth >= 250) {
		Text.NL();
		Text.Add("Well, making an attempt at least. Even with their great numbers, the diminutive creatures are unable to bear the weight of your body. In a cacophony of pained yelps, your frame crashes back to the ground, only just avoiding flattening one of your captors.", parse);
		Text.NL();
		Text.Add("<i>“Heavy!”</i> the horde bemoans. <i>“Too fat!”</i> another one pipes in. How rude!", parse);
		Text.NL();
		Text.Add("The leader looks down on you, annoyed. <i>“Eat less! Run more!”</i> [m1heshe] scolds you, shaking [m1hisher] head. Without direct guidance, the crowd is starting to disperse, wandering off in different directions.", parse);
		Text.NL();
		if(alpha.FirstCock()) {
			Text.Add("Unable to enact [m1hisher] original plan, the victor instead opts to jerk off [m1hisher] [m1cock], marking your defeated form with strand after strand of [m1hisher] potent load.", parse);
			Text.NL();
			Text.Add("<i>“Next time,”</i> the rabbit promises ominously. The bunny hands you some lettuce, apparently suggesting a new diet. You briefly wonder what passing travelers might think if they saw you, covered in cum and holding a piece of salad.", parse);
			Text.NL();
		}
		Text.Add("Losing interest in you, the lagomorph alpha heads off to join [m1hisher] band.", parse);
		Text.NL();
		if(party.Two()) {
			Text.Add("The retreating bunnies seem to have forgotten all about [p1name]. Your companion joins you, relieved that you made it out alright.", parse);
			Text.NL();
		}
		else if(!party.Alone()) {
			Text.Add("Your companions, seemingly forgotten in the confusion, join you and help you up.", parse);
			Text.NL();
		}
		
		Text.Add("Shaking your head, you prepare to continue your travels, which hopefully won’t include any more rape mobs in the near future.", parse);
		Text.NL();
		
		Text.Flush();
		
		TimeStep({minute: 20});
		
		party.inventory.AddItem(Items.Lettuce);
		player.AddLustFraction(0.3);
		
		Gui.NextPrompt();
		return;
	}
	else if(player.Weigth >= 100)
		Text.Add(" Despite your size, the rabbits have no trouble carrying you, making up for their lesser strength with their large numbers.", parse);
	else
		Text.Add(" The rabbits have no trouble carrying you, despite their size.", parse);
	Text.NL();
	Text.Add("With the alpha in the lead, you set out, your convoy loping over the rolling plains at a rapid pace. You are passed between hands several times, as the horde shares the burden of your weight, as if carrying a platter of food, with you the main course.", parse);
	Text.Flush();
	
	TimeStep({hour: 1});
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("The rabbits are traveling straight toward a low set of hills in the distance, an air of purpose about them. As you draw closer, you see that there are quite a number of their kind milling about the mounds, with even more passing in and out of large holes leading underground.", parse);
		Text.NL();
		if(burrows.flags["Access"] == BurrowsFlags.AccessFlags.Unknown) {
			Text.Add("<b>You discovered the Burrows.</b>", parse);
			Text.NL();
		}
		Text.Add("<i>“Leader will be pleased. Good breeding stock!”</i> the alpha bubbles jovially. With a sinking feeling, you start to realize just what kind of plans the bunnies have for you. Somehow, you didn’t quite expect this was the way you’d end up - a sex slave to a bunch of stupid critters.", parse);
		Text.NL();
		Text.Flush();
		
		Scenes.Burrows.Arrival(alpha);
	});
}

LagomorphScenes.GroupWinOnPlainsPrompt = function() {
	let player = GAME().player;
	let party = GAME().party;
	SetGameState(GameState.Event, Gui);
	
	var enc = this;
	
	var parse = {
		
	};
	
	Gui.Callstack.push(function() {
		Text.Clear();
		if(enc.brute) {
			Text.Add("The large brute looks incredulous as he lands on his butt, completely defeated. The rest of his group huddles behind him, eyeing your warily… or perhaps lustily? It seems that you have impressed them quite a bit by beating their alpha, and all they really wanted was sex. Are you willing to provide it? Or perhaps you want to have them pull out some of their comrades from the pile that are more to your liking?", parse);
		}
		else if(enc.brainy) {
			Text.Add("The bespectacled leader of the rabbit mob sulks as you stand victorious over her.", parse);
			Text.NL();
			Text.Add("<i>“You big meanie, we just wanted to have some fun with you...”</i> she pouts, crossing her arms over her fluffy chest. Her companions are already distracted again, eyeing the rutting pile longingly.", parse);
			Text.NL();
			Text.Add("Well, if that was what they wanted, why didn’t they say so? You could have a bit of fun with this girl - she seems to be a lot sharper than her siblings - or perhaps have her companions drag someone more to your liking from the pile.", parse);
		}
		else if(enc.herm) {
			Text.Add("The hermaphrodite bunny scowls at you sulkily, her plans to rape you shattered by your stubborn resistance. Regardless, sex is even closer on her mind than before, as you can see her male parts at full mast. She blushes a bit under your gaze, and bites her lip sultrily.", parse);
			Text.NL();
			Text.Add("<i>“You… fuck? Me bad girl, punish!”</i> she moans, offering herself as her natural instincts to mate take over. She’s a girl with quite a few options, sporting both a regular pussy and a more uncommon cock. You could appease the horny rabbit’s needs… or you could have her comrades drag out some rabbits more to your liking from the pile.", parse);
		}
		else {
			Text.Add("The last of the rabbits fall before you, unable to fight on anymore. The critters still look like they want to fuck you though, so maybe - just maybe - you’ll humor them? You could deal with this group here, or have them drag out some of their comrades from the pile that are more to your liking.", parse);
		}
		
		var options = new Array();
		
		if(burrows.flags["Access"] == BurrowsFlags.AccessFlags.Unknown) {
			Text.NL();
			Text.Add("...Just what is going on here? Where are all these bunnies coming from anyways?", parse);
			
			options.push({ nameStr : "Question",
				func : function() {
					LagomorphScenes.GroupWinInterrorigate(enc);
				}, enabled : true,
				tooltip : "Interrorigate the leader to find out more about the rabbits."
			});
		}
		Text.Flush();
		
		
		var group = {};
		
		group.males   = 0;
		group.females = 0;
		for(var i=0,j=enc.enemy.Num(); i<j; ++i) {
			var mob = enc.enemy.Get(i);
			if(mob.Gender() == Gender.male)   group.males++;
			if(mob.Gender() == Gender.female) group.females++;
		}
		
		if(enc.brute || enc.brainy || enc.herm) {}
		else {
			group.malegroup   = group.males > 0 && group.females == 0;
			group.femalegroup = group.females > 0 && group.males == 0;
			group.mixedgroup  = !group.malegroup && !group.femalegroup;
		}
		
		if(party.Num() == 2)
			parse["comp"] = party.Get(1).name + " is";
		else if(party.Num() > 2)
			parse["comp"] = "your companions are";
		
		// Brute TODO
		if(enc.brute) {
			//[Fuck Him][Vaginal Ride][Anal Ride]
			if(player.FirstCock() || player.Strapon()) {
				options.push({ nameStr : "Fuck him",
					func : function() {
						LagomorphScenes.GroupWinOnPlainsFuckBrute(enc);
					}, enabled : true,
					tooltip : "You’re pretty sure this big guy’s butt is pretty much unused. So why not use his back door to relieve yourself?"
				});
			}
			/* TODO
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
		}
		// Brainy TODO
		else if(enc.brainy) {
			/* TODO
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
		}
		// Herm TODO
		else if(enc.herm) {
			/* TODO
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
		}
		
		//[Get fucked (M)]
		var tooltip = "You want to put all that bunny cock to good use and get a nice fuck. As the saying goes, they ‘fuck like rabbits’, and when one goes down, there are plenty to take his place.";
		if(party.Num() > 1)
			tooltip += " They probably won’t discriminate though, so hopefully [comp] okay with getting a thorough reaming.";
		
		options.push({ nameStr : "Get fucked (M)",
			func : function() {
				LagomorphScenes.GroupWinOnPlainsGetFuckedM(enc, group);
			}, enabled : true,
			tooltip : Text.Parse(tooltip, parse)
		});
		
		//[Fuck (M)]
		var tooltip = "Sure are plenty of cocky bucks around… time to put them in their place for attacking you.";
		if(party.Num() > 1)
			tooltip += " Who knows, perhaps [comp] will join you as well.";
		options.push({ nameStr : "Fuck (M)",
			func : function() {
				LagomorphScenes.GroupWinOnPlainsFuckM(enc, group);
			}, enabled : true,
			tooltip : Text.Parse(tooltip, parse)
		});
		
		/* TODO
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
		
		options.push({ nameStr : "Leave",
			func : function() {
				Gui.PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Leave the rabbits."
		});
		Gui.SetButtonsFromList(options);
		
	});
	Encounter.prototype.onVictory.call(enc);
}

LagomorphScenes.GroupWinOnPlainsFuckBrute = function(enc) {
	let player = GAME().player;
	let party = GAME().party;
	var p1cock  = player.BiggestCock(null, true);
	var strapon = p1cock ? p1cock.isStrapon : null;
	
	var parse = {
		playername : player.name
		
	};
	
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	var brute = enc.brute;
	
	Text.Clear();
	
	LagomorphScenes.GroupWinOnPlainsBruteIntro();
	
	Text.NL();
	Text.Add("You easily slip out of your [armor] and ", parse);
	if(strapon)
		Text.Add("attach your [cock], making sure it’s won’t come loose as you present him with your prosthetic cock.", parse);
	else
		Text.Add("pull out[oneof] your [cocks]. You give yourself a quick stroke before presenting it to him.", parse);
	Text.Add(" The hulking bunny visibly picks up at the sight of you; whether he believes you’re not intending to give him your dick or simply doesn’t care, who can say? His ears rise up curiously and he tilts his head, watching you... or, at least, watching your dick.", parse);
	Text.NL();
	Text.Add("Seems like he’s not getting what he’s supposed to do just yet. So you tell him to open up and thrust your [cock] against his lips, a hand moving to the side of his head in order to guide him toward your intended target.", parse);
	Text.NL();
	Text.Add("The brute grunts in mild disapproval, his eyes flicking up in the direction of yours, but you have made your superiority quite clear, it seems. Eyes rolling shut, he opens his mouth and hesitantly envelops your [cock], gingerly slurping and licking you with timid, inexperienced strokes of his tongue, rolling you awkwardly against the insides of his cheeks.", parse);
	Text.NL();
	Text.Add("It’s quite clear he’s not used to sucking dick instead of having his dick sucked.", parse);
	Text.NL();
	Text.Add("You ease him on the job, gently thrusting your hips into his mouth, hands gripping the back of his head so you can better guide his efforts. You order him to use more tongue as you settle into a brisk, but gentle, pace.", parse);
	Text.NL();
	if(p1cock.Volume() > 400) {
		Text.Add("A muffled choking noise comes from the brute as your oversized maleness butts up against the back of his throat. He gags a little, backing off to breathe, but then stubbornly pushes forward; you can feel the hot, wet flesh of his gullet as he envelops you, the tightness almost vice-like before he finally suppresses his gag reflex and you slide into his throat properly.", parse);
		Text.NL();
		Text.Add("The lagomorph bobs back and forth, throat rippling and squeezing around your cock, tongue caressing what parts of your meat still remain in his mouth. His eyes close and he begins to fall into a smooth, steady rhythm, slowly building in pace.", parse);
		Text.NL();
		Text.Add("The big slut is getting into it; good for you...", parse);
	}
	else {
		Text.Add("The hulking lapin submits to your efforts readily enough, slowly licking and slurping at your dick as you instruct. As you patiently coax him through what you want, he becomes bolder, eyes rolling closed as he picks up the pace.", parse);
		Text.NL();
		Text.Add("Soft murmurs and mumbles echo up from the depths of his barrel-like chest, stirring deliciously along your dick as he starts to suck away with gusto, washing your cock with quick and eager laps of his tongue.", parse);
		Text.NL();
		Text.Add("Big slut; he’s really gotten into this, you don’t even need to guide him anymore other than to keep him on the right track for you to feel good.", parse);
	}
	Text.NL();
	Text.Add("It’s a pity you have to stop him in his tracks, you’re not here for a blowjob, after all. With a push of your hands, you pop out of muzzle. He shakes his head slightly, a wordless grumble of complaint bubbling from his lips as he stares up at you, confused, but clearly hopeful. An ear twitches as he watches you, waiting to see what you’re doing now.", parse);
	Text.NL();
	parse["f"] = player.LowerBodyType() != LowerBodyType.Single ? player.FootDesc() : player.HandDesc();
	parse["c"] = strapon ? "" : ", he even managed to coax some pre from you";
	Text.Add("The big slut did a good job[c]. But it’s time to get started with the main event. You circle the beaten bunny, stopping once you’re at his back. Without so much as a word, you set your [f] on his back, eliciting a grunt of annoyance from the rabbit brute. You order him to get down of fours and push him down.", parse);
	Text.NL();
	Text.Add("He looks back over his shoulder at you, ears flicking in a fashion that definitely looks annoyed, but he complies silently, settling down on all fours. He even shifts his legs slightly to better thrust his butt out, tail twitching as if to draw attention to his hindquarters.", parse);
	Text.NL();
	Text.Add("Looks like he’s got some idea of what you have in mind, and evidently, it’s not bothering him too much.", parse);
	Text.NL();
	parse["c"] = strapon ? "saliva" : "mixture of his saliva and your pre";
	Text.Add("You nestle your [cock] between his muscular cheeks, hotdogging yourself as you rub the slick [c] onto his tight rosebud. Yes, you were right. This big guy hasn’t seen much mileage from back here. Well, in this case, you’ll be more than happy to break him in.", parse);
	Text.NL();
	Text.Add("A quiet grunt echoes back to you, the hulking rabbit settling himself a little firmer in anticipation. Hesitantly, clearly not sure how to react, he slowly rubs back against you, grinding his tight ring against your dripping dick.", parse);
	Text.NL();
	Text.Add("You bend over the brute, holding his hips as you settle yourself on his broad back. Gently poking his entrance with your [cockTip], you tell him to relax. He nods and shifts, taking a deep breath and then exhaling, trying to do as you say. Once you feel his sphincter slacken a little, you push in. At first, you just give an experimental thrust, barely burying your tip inside the big bunny-slut. Naturally, you feel a little resistance, but it’s not bad enough that you can’t push in without hurting the muscular buck.", parse);
	Text.NL();
	Text.Add("The bunny beneath you groans, deep and low, shifting restlessly on all fours as you stretch him. He makes no effort to stop you, and indeed nudges his hips back against you a little, as if inviting you to try again.", parse);
	Text.NL();
	Text.Add("You push in again, this time a bit more forceful as you finally push your [cockTip] past his clenching sphincter, burying the first couple inches in. He grunts in pain as you stretch his ass with your girth, and you stop to give him some time to adjust. Slowly, you rub the soft fur of his back, trying to soothe him as you wait. Despite the big guy’s muscles, he’s still a bunny, and you’re pleasantly surprised to find that he can still be quite cuddly. Much like his lither siblings.", parse);
	Text.NL();
	Text.Add("A soft rumbling moan echoes up from the brute’s throat, his eyes closed as he adjusts. Despite his discomfort, you can see the massive manhood between his legs is rock solid, jutting out beneath his belly. After a little rubbing, he nods to you. <i>“Me better now... more?”</i>", parse);
	Text.NL();
	
	Sex.Anal(player, brute);
	brute.FuckAnal(brute.Butt(), p1cock, 3);
	player.Fuck(p1cock, 3);
	
	parse["ba"] = player.HasBalls() ? Text.Parse(", ensuring he can feel your [balls] churn", parse) : "";
	Text.Add("Grinning at his reaction, you rear your [hips] and thrust into back into him, feeding over half your [cock] to his hungry ass. Another thrust is all you need to finish plunging your way down this rabbit hole. You moan in satisfaction, grinding into his butt[ba].", parse);
	Text.NL();
	parse["flesh"] = player.strapOn ? "" : ", his flesh tight and hot";
	Text.Add("The big lapin moans back, his stretched ring wrinkling around your intruding dick[flesh]. His whole body shivers and he wriggles a little, unthinkingly grinding back against you.", parse);
	Text.NL();
	Text.Add("No matter how much he tries to act as the alpha, deep down he’s still a slut. You slap his ass and tell him to tighten up; you want to feel him gripping you as you stir up his insides.", parse);
	Text.NL();
	parse["tunnel"] = player.strapOn ? "" : "in a tunnel of hot, wet flesh";
	parse["real"] = player.FirstCock() ? "" : " if you had a real dick";
	Text.Add("Grunting unthinkingly in response, the toppled alpha buck complies, muscles rippling along his back from the effort. You can feel his anus squeezing down against you, tightening its grip on your [cock] [tunnel]. With a bit of practice, he could probably wring you out good[real], but as inexperienced as he is, you’ll have to make do with just the tightness.", parse);
	Text.NL();
	Text.Add("That’s a good boy, you praise him, giving his throbbing bunny mast an appreciative stroke. Now you’re going to start moving, so you want him to tighten as you pull out and relax as you thrust back in.", parse);
	if(player.FirstCock()) {
		Text.Add(" This should help him milk your cock out really good.", parse);
	}
	Text.NL();
	parse["milk"] = player.strapOn ? "" : ", making it clear you'll get all the milking you could ask for when you're ready";
	Text.Add("The brute nods his head, a dull 'uh huh' of understanding escaping him to show he follows what you are telling him. His ass manages to clench down even tighter on your intruding dick[milk]. His hips shake from side to side and one leg jiggles uneasily, clearly anxious for you to get to proper fucking.", parse);
	Text.NL();
	Text.Add("Without missing a beat, you start pulling out, until just your [cockTip] is inside, then you immediately plunge your way back. As you see-saw in and out of the brute’s fairly unused tailhole, you set a brisk pace. Each time your hips make contact with the lagomorph’s own, you give his cock a stroke, stimulating him much like he’s stimulating you.", parse);
	Text.NL();
	Text.Add("He moans and groans in concert with each stroke-thrust combo, wriggling anxiously under your assault. Mindlessly, he starts to react, humping back against your loins with clumsily enthusiastic strokes, happy to subject his ass to you in exchange for the pleasure you bring.", parse);
	Text.NL();
	Text.Add("You’re getting close now. Time to give this guy your all. You place your hands on his hips bracing yourself as you redouble your pace, extracting a cacophony of lewd moans from your lapin partner.", parse);
	Text.NL();
	Text.Add("The brutish lagomorph grunts beneath you, shifting slightly to support himself on just three limbs, a now-free hand reaching back to close around his cock.", parse);
	Text.NL();
	Text.Add("You stop your fucking to bat his hand away. Bad bunny. You’re in charge here, and you don’t remember giving him permission to masturbate…", parse);
	Text.NL();
	Text.Add("A mournful grumble escapes the big brute’s lips and he hangs his head in shame, ears flopping down to either side of his face. <i>“Me sorry...”</i>", parse);
	Text.NL();
	Text.Add("Chuckling, you reach over to rub his cheek tenderly. Don’t worry, big guy. All he has to do is focus on pleasuring you with his butt and he’ll get to cum. You promise.", parse);
	Text.NL();
	Text.Add("His ears visibly prick up and he nods excitedly, clenching down with his ass to assure you that he will give you his butt.", parse);
	Text.NL();
	parse["knot"] = p1cock.knot != 0 ? " without actually tying him" : "";
	Text.Add("Seeing the brute comply you resume fucking his butt. You’re so close now… you can almost feel it. All you need is one more thrust… With an audible slap on his muscular buttocks, you yell at him to tighten up and push yourself in as deep as you can[knot].", parse);
	Text.NL();
	if(!strapon) {
		var cum = player.OrgasmCum();
		
		if(cum > 6) {
			Text.Add("A veritable flood of semen erupts from your [cock] into the helpless lapin’s bowels, the once-proud alpha brute’s belly bulging obscenely as you fill him with your seed. Sheer pressure forces more sperm to spurt out around your cock, spattering across your [legs] in thick white rivers, but even so, he balloons under the deluge. By the time you finally finish, his gut hangs almost to the ground, a perverse reflection of the pregnancies he has doubtlessly inflicted on countless females in his warren.", parse);
		}
		else if(cum > 3) {
			Text.Add("Like a sexual volcano, you explode inside the tight, hot constraints of your unwitting lover’s ass, gush after gush of thick sexual fluids pouring inside his guts. Stray rivulets of semen seep wetly around your dick, staining the fur of his ass, but his butt takes it all without complaint. When you have emptied yourself fully, he is visibly bloated, swollen with your seed.", parse);
		}
		else {
			Text.Add("Thick ropes of seed pour inside the moaning bunny, gushing hot and wet into his waiting bowels until you have spent the last of yourself.", parse);
		}
		
		Text.NL();
		
		LagomorphScenes.GroupWinOnPlainsBruteCums();
		
		Text.NL();
		Text.Add("Pulling out of him with a pop, you sigh in relief. That was good. Looking down at his butt, you can see the results of your climax slowly pouring out of his outstretched asshole. His own orgasm seems to have made quite a mess of him too; it’s a nice look for the hulking brute.", parse);
		Text.NL();
		Text.Add("He did a pretty good job of making you cum, all things considered. You feel he deserves some praise. So you circle him to stand before him, your limping cock dripping cum right in front of him as you lower yourself to pat him on the head. That’s a good boy, you praise him.", parse);
		Text.NL();
		Text.Add("The panting bunny smiles proudly, actually leaning into your stroking fingers like an overgrown pet, content to let you touch him in such a manner. Seeing your cock so close, his mouth opens and he leans forward and lets his tongue roll out. Industriously, the overgrown lapin licks and laps, slurping wetly at your semen-soaked shaft and cleaning it up with every sign of enjoyment, mumbling softly in between mouthfuls.", parse);
		Text.NL();
		Text.Add("Holding his ears, you pry him away from your shaft, chuckling as you look down only to see his confused gaze.", parse);
		Text.NL();
		Text.Add("His eyes are fixated on your dick, and he finally looks up at you with an expression at once mournful and quizzical. <i>“No more? No cum?”</i>", parse);
		Text.NL();
		Text.Add("Silly rabbit, you already came. If he wants more, he’ll have to look elsewhere. Grabbing him by the cheeks, you turn his head to look at the pile where his brothers and sisters have gathered. If he wants more, that’s where he should look.", parse);
		Text.NL();
		parse["cum"] = cum > 6 ? "gushing" :
		               cum > 3 ? "pouring" : "dripping";
		Text.Add("He nods his head in witless understanding, powerful muscles flexing as he gathers his strength and tries to push to his feet. He wobbles from side to side as he tries, but manages to finally rise, flinching as he reaches back and gingerly rubs his cum-[cum] ass; evidently, he’s quite sore, but that’s only to be expected.", parse);
		Text.NL();
		Text.Add("You help him up, holding him so he can steady himself. He’s quite heavy for a ball of fluff, but you manage to stabilize him after some time. Go get ‘em, you say to him, giving his butt a pat to send running him along.", parse);
		Text.NL();
		Text.Add("A goofy smile crosses the overgrown rabbit’s face and he nods dreamily before stumbling back in the direction of his fucking kindred.", parse);
	}
	else {
		LagomorphScenes.GroupWinOnPlainsBruteCums();
		
		Text.NL();
		Text.Add("Pulling out of his clenching butthole, you step back and watch the mess he’s made. He’s lucky his fur is white, otherwise the cum would be showing a lot more once it dried. Not that it’d be a bad thing, you think the look would suit this big bunny-slut.", parse);
		Text.NL();
		Text.Add("Well, he’s gotten off, but you haven’t yet. So it’s time to make him work for it.", parse);
		Text.NL();
		Text.Add("You take off your [cock] and circle him, making your way to his front, where you present him with your dripping [vag].", parse);
		Text.NL();
		Text.Add("Grunting dully, the dull-witted lagomorph looks up at you blearily, clearly confused about what you expect - at least at first. As the scent of your dripping womanhood hits him, his nostrils visibly widen before his eyes open in realization.", parse);
		Text.NL();
		Text.Add("He practically dives into your muff, tongue hungrily lapping at your folds, slurping wetly and with more enthusiasm than skill, but still eagerly. Looks like this is definitely more to his liking than a dildo up the butt, no matter how hard you got him off with it.", parse);
		Text.NL();
		Text.Add("You pat his head and tell him he’s a good boy. Hmm, yes. Drink everything…", parse);
		Text.NL();
		Text.Add("He certainly doesn’t need the encouragement, slurping and mumbling as he licks and flicks at your cunt, burying his flat bunny-nose as far into your womanhood as he fit it so as to slide ever deeper inside you.", parse);
		Text.NL();
		Text.Add("Moaning at each lap of the lapin’s broad tongue, you feel your climax quickly approaching. It’s no surprise, you were pretty turned on from fucking his butt, as well as the show he’s put on for you when he came. Come to think of it, he seemed to enjoy it a lot getting creamed all over. So you figure you might as well as contribute to the mess.", parse);
		Text.NL();
		Text.Add("Gripping him by the ears, you smother him with your quivering muff and tell him to open wide, because it’s coming!", parse);
		Text.NL();
		Text.Add("You can feel his jaws stretch, trying to suck your folds inside, nursing perversely in an effort to gulp down as much of your fluids as possible, tongue still lavishing attentions on your cunny.", parse);
		Text.NL();
		
		var cum = player.OrgasmCum();
		
		Text.Add("Were you not holding onto the brute’s head, you’re pretty sure you’d have lost your balance. You cry out as your orgasm rocks throughout your body, femcum flooding from your [vag] and into the lapin’s hungry maw.", parse);
		Text.NL();
		Text.Add("With loud, wet gulping and slurping, the brute drinks it all, lapping at you to try and clear up any remaining seepage or strands even when the final wave of feminine juices splashes out into his mouth.", parse);
		Text.NL();
		Text.Add("Releasing him, you sigh in pleasure as you sit down on the ground. Pretty good, he’s really a good boy, you tell him as you pat him on his head.", parse);
		Text.NL();
		Text.Add("Jowls dripping with your cum, the big lug grins dopily, pleasure at your words and your tastes written on his face for all the world to see.", parse);
		Text.NL();
		Text.Add("As you sit there, enjoying your afterglow and recovering your strength, you feel the brute move. Looking over, you see him crawling toward you, cock already at full mast and dripping pre…", parse);
		Text.NL();
		parse["f"] = player.HasLegs() ? Text.Parse("a [foot]", parse) : Text.Parse("your [foot]", parse);
		Text.Add("You stop him in his tracks with [f], asking him what he thinks he’s doing?", parse);
		Text.NL();
		Text.Add("<i>“Me fuck you now?”</i> the dull-witted lagomorph replies puzzled, head tilting on his shoulder as he looks at you. Clearly, he expects you to want a dicking in return, since you just got done fucking his own ass.", parse);
		Text.NL();
		Text.Add("Rolling your eyes at the rabbit’s over-the-top libido, you tell him that you’ve already had your fun with him. If he wants more, he should look elsewhere.", parse);
		Text.NL();
		Text.Add("A quizzical grunt escapes the brute, clearly not sure of where to go.", parse);
		Text.NL();
		Text.Add("You point him in the direction of his siblings, still happily fucking each other over yonder.", parse);
		Text.NL();
		Text.Add("Finally, a light of recognition comes to his eyes and he makes a quiet noise of realization. Pushing unsteadily to his feet, he slouches quickly off in the direction of his siblings, aching for a chance to use his cock instead.", parse);
	}
	Text.NL();
	Text.Add("Watching him go, you wonder if he’ll be a bit more receptive of the males trying to get on his back. Or maybe he’ll just forget all about your recent encounter and skewer the first thing he finds that happens to have a hole…", parse);
	Text.NL();
	parse["name"] = party.Num() == 2 ? party.Get(1).name : "your companions";
	parse["comp"] = party.Num() > 1 ? Text.Parse(", signaling to [name] that you’re leaving", parse) : "";
	Text.Add("Either way, it’s not your problem. Feeling satisfied, you gather your [armor] and dress up[comp].", parse);
	Text.Flush();
	
	TimeStep({hour: 1});
	
	Gui.NextPrompt();
}

LagomorphScenes.GroupWinOnPlainsBruteIntro = function() {
	let party = GAME().party;
	var parse = {};
	
	if(party.Num() > 1) {
		var p1 = party.Get(1);
		parse["name"]  = party.Num() == 2 ? p1.name : "your companions";
		parse["heshe"] = party.Num() == 2 ? p1.heshe() : "they";
		parse["Name"]  = party.Num() == 2 ? p1.name : "They";
		parse["s"]     = party.Num() == 2 ? "s" : "";
		Text.Add("You signal to [name] that [heshe] should leave the lagomorph brute in your care. [Name] nod[s] in understanding, stepping away for a moment.", parse);
		Text.NL();
	}
	Text.Add("Approaching the lagomorphs, you tell them that you got your eyes set on their alpha, so you won’t be needing the rest of them.", parse);
	Text.NL();
	Text.Add("A few scatter in fear, but most of them seem to be disappointed with your decision. Still, the disappointment doesn’t last long as they’re soon reunited with their brothers and sisters, who are more than happy to include them in their orgy.", parse);
	Text.NL();
	Text.Add("Still flat on his rear, the overgrown buck stares up at you, lips pressed together and brow furrowed, but seeming more curious than defiant. <i>“You want me? What you want?”</i> he rumbles, far deeper than any of the other rabbits nearby.", parse);
}

LagomorphScenes.GroupWinOnPlainsBruteCums = function() {
	var parse = {
		
	};
	
	Text.Add("It’s all too much for the hulking rabbit beneath you; you can feel his muscles roll like waves on the sea as he arches his back, a lusty full-throated bellow surging from his throat as he cries out in ecstasy.", parse);
	Text.NL();
	Text.Add("Beneath him, his monstrous prick explodes like a jizz-volcano, thick ropes of seed pouring across the ground beneath him and spattering over his stomach with the force of his eruption, filling the air with a thick fog of sex.", parse);
	Text.NL();
	Text.Add("When even his prodigious balls are tapped, he slumps forward, panting heavily, ears almost trailing down into the great puddle of jism centered on his hulking form, washing thick and sticky over his hands and swirling around his knees and lower legs.", parse);
}

LagomorphScenes.GroupWinOnPlainsFuckM = function(enc, group) {
	let player = GAME().player;
	let party = GAME().party;
	var male = new Lagomorph(Gender.male);
	
	var p1cock  = player.BiggestCock();
	var strapon = p1cock ? p1cock.isStrapon : null;
	
	var parse = {
		playername : player.name
		
	};
	
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Text.Clear();
	if(!group.malegroup) {
		parse["c"] = p1cock ? Text.Parse(" and your [cocks]", parse) : "";
		Text.Add("Uninterested in your current foes, you instruct them to bring you some of the male bunnies from the pile. You[c] have some business with them...", parse);
		if(enc.brute)
			Text.Add(" The hulking brute looks a bit relieved at being spared whatever you have planned, and shuffles away, returning to the pile to sate his needs. On his way, he dislodges a group of males and sends them your direction.", parse);
		else if(enc.brainy) {
			Text.NL();
			Text.Add("<i>“I-I’m not good enough?”</i> the bespectacled rabbit tuts, fuming. She mutters to herself as she hops over to the pile, ordering a few males to head your way. Before you have a chance to thank the girl, someone grabs her and pull her into the pile. Well, she’s in good company.", parse);
		}
		else if(enc.herm) {
			Text.NL();
			Text.Add("<i>“You not into girls?”</i> the herm looks puzzled. Not that you are sure she qualifies, considering the meatstick poking out between her legs. <i>“’s okay, I fetch!”</i> Seeking to sate her own itch, the bunny returns to the pile, sending a group of eager - though perhaps misguided - males your way.", parse);
		}
		else { //females
			parse = Text.ParserPlural(parse, group.females > 1);
			parse["yIes"] = group.females > 1 ? "y" : "ies";
			Text.Add(" The female[s] look[notS] a bit disappointed, but scurr[yIes] to do your bidding, bodily pulling out a few males from the larger fuck-pile.", parse);
		}
		Text.NL();
	}
	parse["strapon"] = strapon ? Text.Parse(", securing the straps of your [cock]", parse) : "";
	Text.Add("The group of males lined up in front of you look eager, though they may not be expecting what you have in mind for them. Shrugging out of your [armor], you present them with the goods[strapon].", parse);
	if(p1cock)
		Text.Add(" Several of them gulp at the sight of your [cocks], though from what you have seen of the lagomorphs, even the males are far from unfamiliar with being on the receiving end.", parse);
	Text.NL();
	Text.Add("You tell them how this will go down; they do whatever you tell them to without any complaints, or you’ll start getting angry again. The jacks collectively lower their ears, nodding nervously. Might as well get started.", parse);
	Text.NL();
	parse["gen"] = 	   player.FirstCock() ? "cock" :
	                   strapon ? "strap-on" :
	                   player.FirstVag() ? "cunt" : "crotch";
	Text.Add("Gesturing for one of them to step forward, you instruct him to get you ready, indicating your [gen] meaningfully. Eager to please, he hops forward, getting down on his knees as he offers his tongue.", parse);
	Text.NL();
	if(player.FirstCock()) {
		Text.Add("The buck closes his lips around[oneof] your [cocks], dutifully lathering it in bunny saliva. ", parse);
		if(player.NumCocks() > 1)
			Text.Add("He shifts between your shafts, giving each of them equal time and keeping them hard with his paws when his mouth is otherwise busy. ", parse);
		Text.Add("You can’t wait to stick [thisThese] into one of your submissive charges… maybe you’ll let this one be your first target.", parse);
	}
	else if(strapon) {
		parse["pussy"] = player.FirstVag() ? "pussy" : "crotch";
		Text.Add("The buck dutifully lathers your [cock], coating it in bunny saliva. Though you only feel vibrations from the artificial member propagating to your [pussy], you are already excited at the prospect of using it on your defeated foes.", parse);
	}
	else if(player.FirstVag()) {
		Text.Add("You bite your lip as the buck buries his head in your crotch, lapping away at your [vag]. He might not be experienced with this kind of thing, but he makes up for it in enthusiasm.", parse);
	}
	Text.NL();
	Text.Add("Patting his head, you tell him what a good boy he is. Looking around to the others, you suggest that they start getting themselves ready too… and you don’t mean their cocks. Shuffling a bit and looking at each other uncertainly, the remaining bunnies pair up, using tongues and paws to prepare themselves for your onslaught. Fingering and rimming each other, the bunnies moan as their respective partners loosen their butts for whatever you have in store for them.", parse);
	Text.NL();
	if(p1cock) {
		Text.Add("You pull away the jack blowing your [cock], gesturing for him to roll around on all fours. Telling the others that they’ll be next, you grasp the bunny by the hips and slowly insert your shaft into his colon. He whimpers and moans, but from how easily he stretches around your [cock], this isn’t his first time on the receiving end. You find that your furry cocksleeve is quite sturdy, and quickly pick up your pace, encouraged by his lewd moans.", parse);
		Text.NL();
		
		Sex.Anal(player, male);
		male.FuckAnal(male.Butt(), p1cock, 3);
		player.Fuck(p1cock, 3);
		
		Text.Add("The others are slowly gathering around you, shivering with excitement as they watch their brother get fucked. One of the bolder ones hops forward and stuffs your rabbit’s mouth with his cock, spit roasting the poor thing. Smiling, you tell the brave lagomorph that he’s next in line. He bites his lip, pummeling his brother’s throat rapidly, determined to get the most of it. In no time at all, he grinds to a halt, dick hilted in the other lagomorph’s mouth. He arches his back as he unloads his seed down your willing sextoy’s gullet, giving his place to another one of the hovering males. Having gotten his blowjob, the bunny hobbles down onto all fours, presenting himself to you hopefully.", parse);
		Text.NL();
		Text.Add("Deciding to have a bit of fun, you tell him to lie down on his back instead. In short order, you have your current fucktoy straddle the other rabbit, their cocks and balls pressing against each other. ", parse);
		if(player.NumCocks() > 1)
			Text.Add("Thanks to your crowded crotch, doublestuffing the bunnies is an easy and intensely rewarding task.", parse);
		else
			Text.Add("Pressing down on them, you alternate between their holes, giving both bunnies an equal share of your [cock].", parse);
	}
	else if(player.FirstVag()) {
		Text.Add("You roughly shove the jack giving you oral pleasure over on his back, lowering yourself on his jutting cock. Hardly believing his luck, the rabbit bucks his hips, meeting your descent. You press down firmly, making certain that he understands that <i>you</i> set the pace here, and he’s just your willing sex toy.", parse);
		Text.NL();
		
		Sex.Vaginal(male, player);
		player.FuckVag(player.FirstVag(), male.FirstCock(), 3);
		male.Fuck(male.FirstCock(), 3);
		
		LagomorphScenes.Impregnate(player, male);
		
		Text.Add("Smiling to yourself, you wave one of the others over, instructing him to get down on all fours in front of you, dick poised over his brother’s maw. You give the offered bunny-butt a familiar squeeze, caressing his soft fur as your [hand] creeps its way closer to his loosened rosebud.", parse);
		Text.NL();
		Text.Add("The male spread his butt cheeks, gasping as you plunge three fingers into his offered fuckhole. Bucking his hips as you probe deeper, he stuffs his siblings mouth with his throbbing shaft. Before long, the jack is reduced to a quivering, cum-spewing mess as you pummel his prostate, the salty taste of his seed only making the cock inside you grow harder.", parse);
	}
	Text.NL();
	Text.Add("The others, loath to wait around, have already started busying themselves, pairing up in groups of twos or threes - you can swear that more of the rabbits have separated from the larger pile in order to join you. The horny lagomorphs seem content with fucking whatever hole is presented to them, just as long as they get off.", parse);
	Text.NL();
	
	var beingFucked = false;
	// COMPANION SECTION BEGIN
	//TODO Miranda
	
	var compsJoining = [];
	
	var blockKiai = false;
	
	if(party.InParty(kiakai) && Math.random() < 0.5) { //TODO cond
		blockKiai = true;
		
		parse = kiakai.ParserPronouns(parse);
		parse = kiakai.ParserTags(parse, "k");
		parse = Text.ParserPlural(parse, kiakai.NumCocks() > 1, "k");
		parse["name"] = kiakai.name;
		parse["priest"] = kiakai.mfTrue("priest", "priestess");
		parse["pHeShe"] = player.mfTrue("He", "She");
		parse["phisher"] = player.mfTrue("his", "her");
		parse["phimher"] = player.mfTrue("him", "her");
		
		Text.Add("<i>“Pretty elf come too?”</i> one of the bunnies hops over, pulling insistently on [name]’s arms, trying to get [himher] to join the orgy. The blushing elf protests, but lets [himher]self be dragged along, only mildly objecting as the bunnies remove [hisher] clothes and gear.", parse);
		Text.NL();
		Text.Add("<i>“He just would not let up,”</i> [name] apologizes to you, fidgeting nervously and avoiding your gaze. ", parse);
		if(kiakai.FirstCock()) {
			Text.Add("[HeShe] makes a token effort to hide [hisher] [kcocks], but it is a rather futile endeavor. The elf’s cock[ks] stick[knotS] out proudly beneath [hisher] hands, hard and dripping pre. ", parse);
		}
		else if(kiakai.FirstVag()) {
			Text.Add("From the looks of [hisher] dripping pussy, the elf is a bit jealous of the bunnies who are getting their just reward. ", parse);
		}
		Text.Add("The elf shuffles around a bit, looking uncomfortable.", parse);
		Text.Flush();
		
		// [Fuck them][Fuck you][Service them][Sit it out]
		var options = new Array();
		if(kiakai.FirstCock()) {
			options.push({ nameStr : "Fuck them",
				func : function() {
					compsJoining.push(kiakai);
					
					Text.Clear();
					Text.Add("Well, what’s [heshe] waiting for? [HeShe] can have [hisher] pick of any of the lagomorphs… several of them if [heshe] wants, you add slyly.", parse);
					Text.NL();
					
					if(kiakai.GiveAnalAllowed()) {
						Text.Add("<i>“Ah, uhm, if you are okay with it, [playername],”</i> the elf gulps, eyeing one of the rabbits nervously. Seeing [hisher] interest, the hopper rolls onto his back, raising his legs and spreading his fluffy butt cheeks for the embarrassed elf. [name] gives you one last uncertain look before [heshe] digs in, sighing in pleasure as [heshe] sinks[koneof] [hisher] [kcocks] into the eager bunny.", parse);
						Text.NL();
						
						Sex.Anal(kiakai, male);
						male.FuckAnal(male.Butt(), kiakai.FirstCock(), 3);
						kiakai.Fuck(kiakai.FirstCock(), 3);
						
						Text.Add("Too lost in [hisher] own pleasure, the elf doesn’t notice another one of the bunnies sneaking up on [himher] from behind, pouncing on the enraptured acolyte.", parse);
					}
					else {
						Text.Add("<i>“I… ah...”</i> [name] stutters, red as a beet. <i>“P-perhaps if they only use their mouths?”</i> [HeShe] finally mutters, dragging [hisher] foot on the ground. No sooner has [heshe] uttered the words before [heshe]’s smothered in rabbit, the horny hoppers eager to get the first go at [name]’s [kcocks].", parse);
						Text.NL();
						Text.Add("The elf cries out as several of the males fight to grab hold of[koneof] [hisher] cock[ks], the victor of their scuffle greedily chomping down on the tasty shaft.", parse);
						
						Sex.Blowjob(male, kiakai);
						male.FuckOral(male.Mouth(), kiakai.FirstCock(), 2);
						kiakai.Fuck(kiakai.FirstCock(), 2);
					}
					Text.NL();
					Text.Add("Looks like [name] made some new friends.", parse);
					Text.NL();
					
					var cum = kiakai.OrgasmCum();
					kiakai.slut.IncreaseStat(75, 2);
					
					Gui.PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Encourage the elf to have a go at the bunnies."
			});
			options.push({ nameStr : "Fuck you",
				func : function() {
					compsJoining.push(kiakai);
					
					Text.Clear();
					parse["stuttername"] = player.name[0] + "-" + player.name;
					Text.Add("<i>“[stuttername]!”</i> [name] gasps, blushing as [heshe] tries to inefficiently bat away the rabbits pawing at [hisher] body. ", parse);
					if(kiakai.GiveAnalAllowed()) {
						Text.Add("<i>“I… uhm, here?”</i> [heshe] asks in a small voice. You nod, motioning for [himher] to come over.", parse);
						Text.NL();
						Text.Add("Gulping, the naked elf scurries to your side, trying to avert [hisher] gaze from ", parse);
						if(p1cock)
							Text.Add("the prone bunnies getting speared on your [cock].", parse);
						else
							Text.Add("the prone bunny who’s cock you are riding.", parse);
						Text.Add(" Rolling your eyes at [hisher] shyness, you put your hand around [name]’s waist and pull [himher] in for a kiss. The acolyte practically melts in your arms, any semblance of resistance evaporating into nothing.", parse);
						Text.NL();
						Text.Add("<i>“Well, I guess it would not be the first time,”</i> [name] murmurs under [hisher] breath. You smile, slowing down the rocking of your [hips] to allow your cute elven lover to get in position. [HeShe] gives you a hug from behind, [hisher] [kcocks] sliding in between your butt cheeks.", parse);
						Text.NL();
						parse["forward"] = p1cock ? "forward" : "down";
						parse["c"] = p1cock ? "thrusting into one of the subby bunnies" : "impaling yourself on the subby bunny";
						Text.Add("<i>“Just tell me if it hurts, okay?”</i> [heshe] says anxiously, lining up[koneof] [hisher] cock[ks] with your [anus]. In response, you slowly push back, greedily swallowing the elf’s shaft. Before [heshe] has had time to react, you slam yourself [forward] again, [c], who lets out a stifled moan.", parse);
						Text.NL();
						
						Sex.Anal(kiakai, player);
						player.FuckAnal(player.Butt(), kiakai.FirstCock(), 3);
						kiakai.Fuck(kiakai.FirstCock(), 3);
						
						parse["two"] = p1cock ? "three" : "two";
						Text.Add("[name] is swept away, hanging onto you by the hips as you rock back and forth between your [two] lovers. ", parse);
						if(p1cock)
							Text.Add("Giving on one end and receiving on the other, you’re in heaven, both fucking and being fucked.", parse);
						else
							Text.Add("You shudder in bliss as you ride your lovers, stuffed in both holes.", parse);
						Text.NL();
						
						kiakai.slut.IncreaseStat(75, 2);
						kiakai.subDom.IncreaseStat(75, 2);
						
						parse["pus"] = player.FirstVag() ? ", another load being poured into your pussy at the same time" : "";
						Text.Add("<i>“[stuttername]!”</i> [name] cries out, back arching as [heshe] shoots [hisher] seed into your bowels[pus].", parse);
						
						beingFucked = true;
					}
					else {
						if(kiakai.flags["TalkedSex"] == 2)
							Text.Add("<i>“I… I want to,”</i> [heshe] pipes, face red as a beet. <i>“J-just… not now, not like this.”</i> The elf hangs [hisher] head, embarrassed.", parse);
						else
							Text.Add("<i>“I… I could not!”</i> [heshe] exclaims, face red as a beet.", parse);
						Text.NL();
						Text.Add("Taking pity on [name], you call [himher] over to you anyway, promising you won’t make [himher] do something [heshe] doesn’t want. Right now, you just want… a hug. Can [heshe] do that?", parse);
						Text.NL();
						parse["s2"] = p1cock ? "s" : "";
						Text.Add("<i>“Uhm, o-okay.”</i> Stepping warily around the bunnies, the elf makes [hisher] way over. You slow down the rocking of your hips as the elf steps up behind you and wraps [hisher] arms around you, letting your other lover[s2] rest at the same time. You tell the elf that [heshe]’s warm, leaning back into [hisher] arms.", parse);
						Text.NL();
						Text.Add("A small smile plays on your lips as [name]’s [kcocks] pokes you in the back. Reaching behind you, you trail one [hand] down [hisher] side, feeling the shape of [hisher] [kbutt] and finally tracing the length of[koneof] [hisher] shaft[ks]. The elf shivers at your touch, but doesn’t complain. You give [himher] a slow handjob while you rock against your other lover[s2]. [HeShe] doesn’t last long, gasping as [heshe] sprays your back with [hisher] seed.", parse);
					}
					Text.NL();
					Text.Add("Turning your head around, you give [name] a kiss before returning to the task at hand, thanking [himher] for being there.", parse);
					Text.NL();
					
					var cum = kiakai.OrgasmCum();
					kiakai.relation.IncreaseStat(50, 1);
					
					Gui.PrintDefaultOptions();
				}, enabled : !beingFucked,
				tooltip : Text.Parse("Why don’t put that juicy cock of [hishers] to good use? Ask [name] to take position behind you and have a go.", parse)
			});
		}
		options.push({ nameStr : "Service them",
			func : function() {
				compsJoining.push(kiakai);
				
				Text.Clear();
				Text.Add("<i>“W-what, do you mean you want me to- no, [playername]!”</i> [name] gasps, blushing fiercely.", parse);
				Text.NL();
				parse["boyGirl"] = kiakai.mfTrue("boy", "girl");
				Text.Add("You nod, motioning for [himher] to join you. The elf uncertainly scurries to your side, looking a bit lost. Ruffling [hisher] hair, you tell [himher] that [heshe] is a good [boyGirl].", parse);
				Text.NL();
				if(p1cock) {
					Text.Add("Leaning down, you put your [hand]s under the armpits of the top bunny, pulling him into an upright position. This leaves the elf plenty of room to reach the two bunny cocks which are being pressed together tightly, leaking pre onto the furred belly of the one on the bottom.", parse);
					Text.NL();
					Text.Add("Burrowing into the thick fluff around the lagomorph’s neck, you point suggestively toward his crotch. [name] blushes, but gingerly gets down, licking [hisher] lips. Giving the twin cocks an experimental rub, the elf softly trace the sensitive flesh, barely managing to grasp both of them in [hisher] graceful hand.", parse);
					Text.NL();
					parse["s"] = player.NumCocks() > 1 ? "s" : "";
					Text.Add("After another urging from you, the elf bows down and goes to work on them with [hisher] mouth, somehow managing to wrap [hisher] lips around both bunny cockheads at the same time. Determined to give [himher] a tasty treat, you redouble your efforts, ramming your cock[s] into the moaning rabbits.", parse);
					Text.NL();
					Text.Add("There is a muffled yelp from below as your combined efforts simultaneously triggers both bunnies’ climaxes, pumping the contents of the furry critters down [name]’s gullet.", parse);
				}
				else {
					Text.Add("Rolling over on your back and flipping the bunny up on top, you gesture for the elf to get down behind the bunny. [name] looks like [heshe] understands your instructions, and hurriedly complies.", parse);
					Text.NL();
					Text.Add("The rutting rabbit moans happily as [name] starts sucking at his balls, gently caressing his furred bum. Blushing even deeper, the elf moves on to lick at the lagomorph’s rosebud, rimming your lover.", parse);
					Text.NL();
					Text.Add("<i>“Such shameful things you make me do,”</i> [name] mutters as [heshe] fondles the bunny’s balls, pressing one of [hisher] fingers up his butt.", parse);
					Text.NL();
					Text.Add("Hey, this is all [himher], you just told [himher] to come over, remember?", parse);
					Text.NL();
					Text.Add("<i>“You are horrible,”</i> [heshe] complains, wincing as the enraptured bunny arches his back and blows his load inside you. Sneaking a peek over his shoulder, you notice that the elf is still working the lagomorph’s prostate, probing his butt with two digits.", parse);
				}
				Text.NL();
				Text.Add("You commend the elf for doing a good job, and get back to your rutting.", parse);
				Text.NL();
				
				kiakai.slut.IncreaseStat(40, 1);
				kiakai.subDom.DecreaseStat(-75, 2);
				
				Gui.PrintDefaultOptions();
			}, enabled : true,
			tooltip : Text.Parse("Doesn’t [heshe] think it’s unfair that all those bunny cocks are just bobbing there, unsatisfied?", parse)
		});
		options.push({ nameStr : "Sit it out",
			func : function() {
				Text.Clear();
				Text.Add("<i>“R-right,”</i> the elf bobs [hisher] head in agreement, quickly scurrying away to [hisher] pile of discarded clothes. Maybe next time...", parse);
				Text.NL();
				Gui.PrintDefaultOptions();
			}, enabled : true,
			tooltip : Text.Parse("Perhaps [name] should just sit this one out. You’ll be along eventually.", parse)
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	
	Gui.Callstack.push(function() {
		var blockTerry = false;
		
		if(party.InParty(terry) && Math.random() < 0.5) {
			parse = terry.ParserPronouns(parse);
			parse = terry.ParserTags(parse, "t");
			parse["foxvixen"] = terry.mfTrue("fox", "vixen");
			parse["tlower"] = function() { return terry.LowerArmorDesc(); }
			
			Text.Add("Terry watches you having fun from the sidelines", parse);
			if(terry.FirstCock())
				Text.Add(", an erection tenting [hisher] [tlower].", parse);
			else
				Text.Add(", [hisher] handpaws moving unconsciously toward [hisher] groin, where you know [hisher] [tvag] lies.", parse);
			Text.NL();
			Text.Add("Well, there’s certainly plenty of bunnies to go around; if your pet [foxvixen] really wants to join in, you could always give [himher] permission...", parse);
			Text.Flush();
			
			blockTerry = true;
			
			//[Fuck] [Get Fucked] [Don’t Fuck]
			var options = new Array();
			if(terry.FirstCock()) {
				options.push({ nameStr : "Fuck",
					func : function() {
						compsJoining.push(terry);
						
						Text.Clear();
						if(terry.Relation() < 60) {
							Text.Add("<i>“Sure! With pleasure!”</i> [heshe] replies, starting to divest [himher]self.", parse);
						}
						else {
							Text.Add("<i>“You sure? What you gonna do if I start liking doing bunnies?”</i> [heshe] asks teasingly, starting to remove [hisher] [tarmor].", parse);
							Text.NL();
							Text.Add("You’ll just have to remind [himher] why [heshe] likes you better, you quip. Now off with [hisher] clothes and let’s see [himher] stuffing bunny-butt!", parse);
							Text.NL();
							Text.Add("<i>“Aye-aye, Cap’n!”</i>", parse);
						}
						Text.NL();
						Text.Add("As soon as [heshe]’s undressed, a couple of rabbits approach [himher], looking up curiously at the [foxvixen]. Their shafts are already hard and dribbling pre in expectation. You watch as one makes a move and tries to grab Terry, only to be stopped short by a handpaw.", parse);
						Text.NL();
						Text.Add("<i>“Afraid not, bunny-bums.”</i>", parse);
						Text.NL();
						Text.Add("The lapins halt, looking at the [foxvixen] with confused expression. One, bolder than his brother, dares to ask: <i>“We no fuck foxy?”</i> even as he hungrily eyes the naked expanse of Terry’s body.", parse);
						if(terry.Cup() >= TerryFlags.Breasts.Bcup)
							Text.Add(" Like a magnet, the two’s gaze is drawn to the bouncing tits upon the [foxvixen]’s chest.", parse);
						Text.NL();
						Text.Add("<i>“Oh, don’t worry. We’ll fuck. Just not the way you’re expecting,”</i> [heshe] rubs [hisher] chin. <i>“How to put it, hmm… Foxy fucks we,”</i> [heshe] says with a mischievous grin.", parse);
						Text.NL();
						Text.Add("The bunny-boys blink, looking no less confused than before. Still, they pick up that Terry does intend to fuck them, and that’s clearly all they need, erections bobbing naked before them, the hints of smiles dawning on their lips.", parse);
						Text.NL();
						Text.Add("<i>“Show me your tails,”</i> Terry says, motioning with a finger for the lagomorphs to turn around.", parse);
						Text.NL();
						Text.Add("Confusion sweeps itself off their faces, replaced with gormless grins of anticipatory delight. The two lapins practically fall over themselves in their rush to do as Terry said, even going so far as to bend over and thrust their butts out to try and look more enticing. Two little white puffball tails wriggle and twitch, as if trying to wag like Terry’s own long, enticing brush.", parse);
						Text.NL();
						Text.Add("The [foxvixen] immediately locks-on to one of the bobtails, licking [hisher] lips predatorily as [heshe] strokes [hisher] half-erect [tcock].", parse);
						Text.NL();
						if(terry.HorseCock()) {
							Text.Add("Terry drapes [hisher] equine shaft over one of the bunny-sluts’ butt, letting the lapin feel the heat as [heshe] teases, <i>“Come on, slut. I wanna hear you beg for it.”</i>", parse);
							Text.NL();
							Text.Add("The lucky lagomorph moans plaintively, eyes screwed shut in anticipation and desire. Anxiously, he thrusts his hips back, wriggling them from side to side to try and catch the half-erect stallionhood in his buttock cleavage, grinding along Terry’s shaft as best he can. Words evidently fail him in his desire for that big, meaty [foxvixen] dick.", parse);
							Text.NL();
							Text.Add("His unchosen brother isn’t quite so overcome, but still twists around in order to look plaintively at Terry’s dick, whimpering softly at his not being chosen. His eyes drink in the sight of the half-flaccid horse-cock, and he licks his lips hungrily, clearly wishing Terry would use it on him.", parse);
							Text.NL();
							Text.Add("<i>“Alright, boys, if you want it, you’re going to have to work for it,”</i> Terry starts, circling the lagomorphs. [HeShe] takes the other one by the ears and shoves [hisher] cock against the rabbit’s cheek. <i>“Suck.”</i>", parse);
							Text.NL();
							Text.Add("The chosen bunny needs no further prompting. His hands immediately latch onto Terry’s lower shaft for extra security, his head twisting as his mouth opens to envelop the [foxvixen]’s blunt equine glans. His pink eyes sink shut in rapture as he wraps his lips around Terry’s dick, noisily sucking like a babe at a teat.", parse);
							Text.NL();
							Text.Add("A squeak of protest bubbles from the other rabbit’s throat at being left out and he scrambles to his sibling’s side, shoving his brother hard to get closer. Since his brother has what seems to be a deathgrip on Terry’s glans, he settles for wetly kissing along the untouched portions of Terry’s shaft, noisily lapping at [hisher] cock with his tongue and trying to suck tiny mouthfuls of shaft when he can.", parse);
							Text.NL();
							Text.Add("Placing [hisher] hands over each bunny’s head, Terry moans in obvious pleasure. <i>“That’s it, sluts. Pleasure the mighty [foxvixen]’s cock.”</i>", parse);
							Text.NL();
							Text.Add("As the lagomorphs lavish their considerable affection upon Terry’s dick, it rewards them by starting to grow to its true majesty. Inch after inch of mottled-brown horse sausage slides smoothly from [hisher] leathery sheath, its sides bloating to its full hole-plugging majesty. The bunny-boys are in heaven, the one sucking abandoning Terry’s glans to join his brother in licking back and forth as the full figure of the [foxvixen]’s footlong fuckmeat rises proudly before them.", parse);
							Text.NL();
							Text.Add("<i>“That’ll be enough from you,”</i> the [foxvixen] says, idly pushing the lapins away. One loses balance and falls on his butt, but before he can recompose himself and raise back to his feet, Terry pins him with a footpaw. <i>“No, don’t get up. This is a fine position for you,”</i> [heshe] says, pushing the rabbit down with [hisher] padded feet.", parse);
							Text.NL();
							Text.Add("The chosen bunny settles back against the ground, spreading his legs widely as possible and lifting his hips slightly to better expose his tailhole, visibly rippling in anticipation. His hands reach out to hold his knees, the jutting pinkness of his dick hard and dripping against his belly.", parse);
							Text.NL();
							Text.Add("Moaning in a mixture of disappointment and wanton lust, the unlucky rabbit steps back to avoid getting in Terry’s way. Like an iron filing to a magnet, his hand is drawn to his dick, starting to pump away with the expertise of someone well practiced in masturbation, making him groan in pleasure.", parse);
							Text.NL();
							Text.Add("Terry rolls [hisher] eyes at the masturbating bunny, but for the moment decides to focus [hisher] attention on the one lying down before [himher]. <i>“Good boy,”</i> [heshe] praises, lifting the rabbit’s legs up and aligning [hisher] member with the lagomorph’s rosebud.", parse);
							Text.NL();
							Text.Add("As you’d expect, the little bunslut is not an anal virgin; Terry’s cock pops its head in at the very first thrust, and [heshe] finds it harder to keep from sliding all the way home in one or two pumps than [heshe] does to push it in. Still, even as the wriggling lapin moans his slutty pleasure at being filled so full, Terry manages to keep [hisher] pace smooth and steady. Inch by inch, the [foxvixen]’s horse-prick glides inside, stopping only when [hisher] knot is butting up against the mewling whorebun’s stretched asshole.", parse);
							Text.NL();
							Text.Add("If there’s anything that surprises you about this, it’s how readily Terry managed to make [himher]self fit, given how much larger [heshe] is compared to the bunny-boys themselves. They must really be sluts to get <b>that</b> stretched out...", parse);
							Text.NL();
							if(enc.brute) {
								Text.Add("Then again, there is that big bruiser they were taking it from. He’s definitely built to put even Terry to shame...", parse);
								Text.NL();
							}
							Text.Add("The [foxvixen] wastes no time and begins pumping [himher]self in and out of the bunny-slut’s ass. [HisHer] eyes dart to the masturbating brother, whistling to get his attention. <i>“Hey, slut! Stop fapping and get your slutty butt over here. My balls need a good spitshine.”</i>", parse);
							Text.NL();
							Text.Add("A delighted squeak escapes the lapin’s mouth and his hand flies off his dick as he scrabbles toward Terry, cock jutting naked and pink as he goes. He practically dives behind Terry, the [foxvixen]’s long bushy tail draping itself over his back as he kneels on hands and knees beneath [hisher] shapely butt. Spreading Terry’s thighs slightly, he brings his head up between [hisher] legs to bring his mouth on level with [hisher] balls, opening his mouth and giving them a long, sloppy lick.", parse);
							Text.NL();
							Text.Add("Terry moans in delight, pounding the lapin’s brother with renewed vigor. <i>“That’s it. Good boy.”</i>", parse);
							Text.NL();
							if(terry.FirstVag()) {
								Text.Add("You can see his nose crinkling as the scent of the [foxvixen]’s feminine arousal floods his nostrils, eyes fixated on the pussy lips hovering right in front of his face. You could cut the desire for it with a knife, but he obediently keeps his head in its proper place.", parse);
								Text.NL();
							}
							Text.Add("Avidly, the lapin licks and sucks at Terry’s swaying cum-factories as best he can, trying to move his head with the thrusting of your companion’s hips to keep them from escaping his suckling. The result is perversely comical as the [foxvixen]’s balls sway like a pendulum, the bunny chasing them back and forth. And all the while, Terry’s thrusting has [hisher] first bunslut moaning like the whore he is.", parse);
							Text.NL();
							Text.Add("Terry stops pumping [himher]self and pulls out of the first lagomorph, backing off and letting [hisher] shaft plop free. Some drops of [hisher] creamy pre fall onto the snout of the bunny that was sucking his balls. <i>“Good job, slut. Now, I think it’s time for your reward.”</i>", parse);
							Text.NL();
							Text.Add("The rabbit moans greedily, tongue slurping wetly over his snout to catch Terry’s pre.", parse);
							Text.NL();
							Text.Add("The [foxvixen] grabs the lapin below by the shoulders and pushes him toward his prone brother, the rabbit crashing into him and falling atop his brother, muzzle to muzzle. Without missing a beat, Terry thrusts into the back door of the top bunny, entering him just as easily as he did his sibling.", parse);
							Text.NL();
							Text.Add("As the bunslut gasps and groans appreciatively, wriggling his hips to thrust back against the [foxvixen]-prick filling him up so deliciously, his brother jealously reaches up and pulls him into a passionate kiss. Their tongues tangle as they moan softly into each other’s mouths, arms wrapping around one another in a passionate embrace as their hips slide back and forth, doubtlessly grinding their dripping dicks together.", parse);
							Text.NL();
							Text.Add("As soon as Terry feels the lapin’s sphincter on [hisher] knot, [heshe] pulls back, popping out of one loose bum and aiming for the other.", parse);
							Text.NL();
							Text.Add("The lower rabbit groans in ecstasy as Terry’s cock slides back into his used ass again, his envious brother muffling his moans with his tongue.", parse);
							Text.NL();
							Text.Add("They continue this dance for a while, Terry alternating between each set of butts", parse);
							if(p1cock)
								Text.Add(" - much like you did earlier", parse);
							Text.Add(". [HeShe] keeps at it until [heshe] feels [hisher] balls churn, already taut with backed up seed, it’s only a matter of time before Terry cums. A devious thought crosses the [foxvixen]’s mind, and instead of pulling out of one bum and filling the other, Terry pushes [hisher] cock between the bunnies.", parse);
							Text.NL();
							Text.Add("The two lapin sluts welcome the slickness of Terry’s shaft into their crushing embrace, striving to include [himher] in their passionate grinding. Their hips buck and rock back and forth, frotting each other and Terry with equal abandon, hugging each other tightly to ensure [heshe] has to work [hisher] way through a tight press of soft, velvety fur.", parse);
							Text.NL();
							Text.Add("Face screwed up with the effort, Terry moans softly as [heshe] forces [hisher] way deeper, until finally the very tip of [hisher] cock surfaces between the faces of [hisher] two lagomorph lovers. The round tip is half-flared already, [heshe] clearly can’t be far from climax.", parse);
							Text.NL();
							Text.Add("As one, the bunny-boys noisily kiss Terry’s cock, nibbling gently at [hisher] flare with their teeth. This is the last straw for Terry; the [foxvixen] arches [hisher] back and cries out throatily as [hisher] flare bulges to its full length and erupts in a great shower of pearly white. Streams of cum pour from [hisher] shaft, flowing wetly across the lower bunny’s face, his envious brother dipping [hisher] face down to slurp at the gushing seed like a youth at a fountain.", parse);
							Text.NL();
							
							var cum = terry.OrgasmCum();
							
							Text.Add("By the time Terry finishes, the lower bunny is totally soaked in spunk, lying on his back in a great puddle of [foxvixen] seed, whilst his upper brother is dripping from the face from his efforts at drinking. Despite this, both bunny-sluts are grinning happily.", parse);
							Text.NL();
							Text.Add("You watch from your vantage point as Terry pulls out from between the lapins with a broad smile on [hisher] face. <i>“Good job, sluts. Now, here’s what I want you to do next,”</i> [heshe] says, already formulating the plans for the next taking. Seems like Terry’s enjoying [himher]self.", parse);
							Text.NL();
							Gui.PrintDefaultOptions();
						}
						else {
							Text.Add("<i>“No time to waste then,”</i> the [foxvixen] declares, aligning [himher]self with the nearest willing bunny-butt.", parse);
							Text.NL();
							Text.Add("An excited chittering bubbles from the chosen rabbit, even as his brother lets out a disappointed-sounding grumble. The lucky bunslut waggles his ass, clearly inviting Terry to fuck it.", parse);
							Text.NL();
							Text.Add("Terry pushes in without regard for the slutty rabbit, not that [heshe]’d need to be careful. [HisHer] shaft practically glides into the loose butthole, all the way to the knot. <i>“Shit, how much of a slut do you have to be to get an ass this loose?", parse);
							if(terry.Slut() >= 60)
								Text.Add(" I fool around a lot and I’m not even close to being this loose.", parse);
							Text.Add("”</i>", parse);
							Text.NL();
							Text.Add("The lapin moans in ecstasy, eyes rolled shut and tongue hanging out. His hips thrust back eagerly, more than matching Terry pump for pump. Terry might not be the most well-hung [foxvixen] around, but [heshe]’s certainly big enough for this sluttybun’s liking.", parse);
							Text.NL();
							Text.Add("The rabbit does his best to milk Terry’s cock, his own neglected erection smacking wetly against his belly with each powerful thrust and hump into his ass. Grunts and groans of efforts echo from his throat as he happily gives himself over to Terry’s lust.", parse);
							Text.NL();
							Text.Add("<i>“Get ready because here it comes, bunny-bums,”</i> Terry cries out, redoubling [hisher] pace.", parse);
							Text.NL();
							Text.Add("The lapin slut squeals in pleasure, humping back with all his might as the [foxvixen] pounds his ass. The slapping of flesh on flesh echoes, and you have a feeling Terry’s going to be sporting some pretty impressive bruises when [heshe]’s done.", parse);
							Text.NL();
							Text.Add("With one last mighty thrust, the [foxvixen] buries [himher]self all the way to the hilt, tying the rabbit as [heshe] lets [hisher] [foxvixen]-jism spill into the lagomorph’s willing butt. <i>“Yes, take it all like a good slut!”</i> Terry exclaims as [heshe] finishes painting the lapin’s insides with [hisher] seed.", parse);
							Text.NL();
							Text.Add("The other bunny decides to join the fray and presents his throbbing cock to his brother, whom gladly begins fellating him.", parse);
							Text.NL();
							Text.Add("The rocking motions of the enthusiastic rabbits shakes the [foxvixen]. Terry has no choice but to follow the lagomorphs’ lead, since [heshe]’s still tied. Eventually, annoyance wins over, and [heshe] decides to try and pull out. Maybe [heshe] could get the rabbits to stop for a moment and let [himher] recover in peace.", parse);
							Text.NL();
							Text.Add("The lapin below groans as Terry keeps pulling on his ass, and he definitely fights to stay in place. However, during a particularly strong thrust, Terry recoils farther than usual and pops out of the rabbit’s ass, crashing on [hisher] butt. <i>“Ow! Watch out, you perverted sluts.”</i>", parse);
							Text.NL();
							Text.Add("The two bunnies simply continue to fuck leisurely, not even reacting to Terry’s words. In fact, it seems they haven’t even realized Terry’s out.", parse);
							Text.NL();
							Text.Add("<i>“Damn lagomorphs, I oughta show then...”</i> the [foxvixen] mumbles, rubbing [hisher] butt. [HeShe] elects to sit down and recover for a bit, simply watching as the fellating rabbit catches his brother’s load straight down his throat. He then rises to his feet so his brother can return the favor and suck his own cock.", parse);
							Text.NL();
							Text.Add("A mischievous glint sets on Terry’s eyes, as [heshe] decides [heshe]’s had enough rest. Without so much as a word, [heshe] approaches the bunny giving the blowjob and coaxes him into raising his butt.", parse);
							Text.NL();
							Text.Add("There is no resistance, nor protest, just a groan of acknowledgement as the lapin does as instructed. When he spreads his legs, it’s clear that he knows what Terry intends.", parse);
							Text.NL();
							Text.Add("Not needing any further invitation, Terry decides to align his hard shaft with the offered rosebud and penetrate the lagomorph, much like [heshe] did his brother.", parse);
							Text.NL();
							Text.Add("Seems like they’re gonna be a while...", parse);
							Text.NL();
							
							var cum = terry.OrgasmCum();
							
							Gui.PrintDefaultOptions();
						}
					}, enabled : true,
					tooltip : Text.Parse("Let’s see what [heshe] can do with that cock of [hishers] and some willing bunny-butts!", parse)
				});
			}
			options.push({ nameStr : "Get fucked",
				func : function() {
					compsJoining.push(terry);
					
					Text.Clear();
					Text.Add("No sooner have you finished speaking, a pair of bunnies immediately pounce on Terry, intent on removing his [tarmor].", parse);
					Text.NL();
					Scenes.Terry.FuckedByBunnyMob(male, parse);
					Gui.PrintDefaultOptions();
				}, enabled : true,
				tooltip : Text.Parse("Well, if [heshe] wants it so bad, you can spare some bunny-cocks for [hisher] needy holes...", parse)
			});
			options.push({ nameStr : "Don’t fuck",
				func : function() {
					Text.Clear();
					Gui.PrintDefaultOptions();
				}, enabled : true,
				tooltip : Text.Parse("[HeShe] can just stay there and watch, you don’t want any bunny-boys touching your pet.", parse)
			});
			Gui.SetButtonsFromList(options, false, null);
		}
		
		// COMPANION SECTION END
		
		
		Gui.Callstack.push(function() {
			Text.Add("Things start melding together as the entire group deteriorates into an all out orgy. You make sure to split your attentions between the various lagomorphs, but one quickly becomes interchangeable with the next, a huge pile of horny creatures eager to be your next target.", parse);
			Text.NL();
			Text.Add("Time passes...", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				
				var cum = player.OrgasmCum(2);
				
				if(compsJoining.length == 1) {
					parse["comp"]  = " and " + compsJoining[0].name;
					parse["comp2"] = compsJoining[0].name + " and ";
				}
				else if(compsJoining.length > 1) {
					parse["comp"]  = " and your companions";
					parse["comp2"] = "your companions and ";
				}
				else {
					parse["comp"]  = "";
					parse["comp2"] = "";
				}
				Text.Add("Some time later, you[comp] are finally finished with the rabbit mob. Feeling a bit drained, you gather up [comp2]your gear, wobbling a bit unsteadily as you re-equip yourself. In the end, you are not sure who got the most out of that engagement: you or the rabbits.", parse);
				Text.Flush();
				
				TimeStep({hour: 1});
				
				Gui.NextPrompt();
			});
		});
		
		if(!blockTerry) {
			Gui.PrintDefaultOptions();
		}
	});
	
	if(!blockKiai) {
		Gui.PrintDefaultOptions();
	}
}

LagomorphScenes.GroupWinOnPlainsGetFuckedM = function(enc, group) {
	let player = GAME().player;
	let party = GAME().party;
	var parse = {
		playername : player.name
		
	};
	
	parse = player.ParserTags(parse);
	
	Text.Clear();
	if(!group.malegroup) {
		parse["pus"] = player.FirstVag() ? " pussy and" : "";
		Text.Add("Uninterested in your current foes, you instruct them to bring you some males that want to spend their seed in a willing[pus] ass.", parse);
		if(enc.brute)
			Text.Add(" The hulking brute looks dumbfounded at your dismissal of his magnificent cock, and shuffles away, returning to the pile to sate his needs. On his way, he dislodges a group of males and sends them your direction.", parse);
		else if(enc.brainy) {
			Text.NL();
			Text.Add("<i>“I-I’m not good enough?”</i> the bespectacled rabbit tuts, fuming. <i>“Fine! I’ll find someone to fuck you!”</i> Grumbling to herself, she hops over to the pile and begins shouting orders. It seems like her message gets through, as a few bunnies head your way, cocks at the ready. Before you have a chance to thank the girl, someone grabs her and pull her into the pile. Well, she’s in good company.", parse);
		}
		else if(enc.herm) {
			Text.NL();
			Text.Add("<i>“I have cock,”</i> the herm protests, arms crossed sullenly. <i>“Me fuck you!”</i> She pouts a bit, but you manage to convince her to do as you say. Seeking to sate her own itch, the bunny returns to the pile, sending a group of eager males your way.", parse);
		}
		else { //females
			parse = Text.ParserPlural(parse, group.females > 1);
			Text.Add(" The female[s] look[notS] a bit disappointed, but scurr[yIes] to do your bidding, bodily pulling out a few males from the larger fuck-pile.", parse);
		}
		Text.NL();
	}
	parse["be"] = player.Ears().race.isRace(Race.Rabbit) ? " much like your own" : "";
	Text.Add("You briefly survey the strapping young bucks lined up in front of you. The bunnies are lithe in build and covered in white fur, their heads topped by long floppy ears[be]. Thanks to their short stature, their rigid dicks are quite large in proportion to their body-size. You plan to study those delicious-looking things in much closer detail in the coming hour.", parse);
	Text.NL();
	
	var comp = party.Num() > 1;
	
	if(party.Num() == 2)
		parse["comp"] = party.Get(1).name;
	else if(party.Num() > 2)
		parse["comp"] = "your companions";
	else
		parse["comp"] = "";
	
	parse["p"] = comp ? Text.Parse(" and suggesting to [comp] to do the same", parse) : "";
	Text.Add("Removing your gear[p], you present the horny rabbits with the goods. A sultry word is all it takes for their fragile composure to break, sending the group surging toward you.", parse);
	Text.NL();
	Text.Add("The lagomorphs are not creatures that waste much time on foreplay - seeing as they spend much of their waking time fucking, you are not sure that they’ve even considered the concept - something that becomes readily apparent as two of them jump you, shoving their cocks into your mouth, filling the first hole available to them.", parse);
	Text.NL();
	
	var male = new Lagomorph(Gender.male);
	
	Sex.Blowjob(player, male);
	player.FuckOral(player.Mouth(), male.FirstCock(), 1);
	male.Fuck(male.FirstCock(), 1);
	
	if(comp) {
		Text.Add("The others are eyeing [comp] restlessly, though they don’t stride into action quite yet, hovering around you.", parse);
	}
	else {
		Text.Add("The others are circling you restlessly, and you take pity on them, stroking their cocks with your hands.", parse);
	}
	Text.NL();
	
	var target;
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		target = BodyPartType.vagina;
		parse["target"] = function() { return player.FirstVag().Short(); }
	}, 3.0, function() { return player.FirstVag(); });
	scenes.AddEnc(function() {
		target = BodyPartType.ass;
		parse["target"] = function() { return player.Butt().AnalShort(); }
	}, 1.0, function() { return true; });
	scenes.Get();
	
	Text.Add("The air is thick with the lagomorphs’ musk, the taste of their pre on your [tongue] intoxicating. With your attention thus occupied, it comes as a bit of a surprise when another bunny jumps you from behind, pressing his cock between your butt cheeks and rutting against you. It doesn’t take long for him to find your [target], and once inside you, he fucks like a natural.", parse);
	Text.NL();
	
	if(target == BodyPartType.vagina) {
		Sex.Vaginal(male, player);
		player.FuckVag(player.FirstVag(), male.FirstCock(), 3);
		male.Fuck(male.FirstCock(), 3);
		
		LagomorphScenes.Impregnate(player, male);
		
		Text.Add("The bunny bucks, pistoning his meat into your wet cleft at a blinding pace. His hips must look like a blur, judging by the speed that he’s fucking you. The lagomorph doesn’t only go for speed either, each thrust is deep enough to drive the breath from your lungs - if your airways weren’t already plugged with cock, that is. Overrun by his urge to breed, it feels like he’s trying to drill all the way into your womb.", parse);
	}
	else {
		Sex.Anal(male, player);
		player.FuckAnal(player.Butt(), male.FirstCock(), 3);
		male.Fuck(male.FirstCock(), 3);
		
		Text.Add("Eager to spend his seed, the bunny rapidly bucks his hips, pummeling your asshole. His breeding instinct might be a bit misguided, but you suspect he’s willing to fuck just about anything that moves if it gives him release. He’s sure as hell doing his damndest to get that butt of yours pregnant.", parse);
	}
	Text.NL();
	Text.Add("It’s not long before he shoots his load, pouring thick wads of hot seed into your [target]. You don’t really have a chance to be disappointed at his short fuse, as his cock is quickly replaced by another one… and there is a lot more to go around.", parse);
	Text.NL();
	Text.Add("You are distracted from the amazing feeling in your groin by your other two friends unloading their balls in your mouth and all over your [face]. Spurt after spurt of thick rabbit cum slide down your throat, or is deposited in long glistening strands on your body, dripping down on your [breasts].", parse);
	Text.NL();
	Text.Add("Despite you already being covered both inside and out in bunny semen, your fluffy suitors show little sign of tiring, taking turns at plugging every hole they can get their paws on. You can’t help but succumb to them, riding your pleasure high as they use you.", parse);
	if(player.FirstCock()) {
		parse["isAre"] = player.NumCocks() > 1 ? "are" : "is";
		Text.Add(" Your [cocks] [isAre] mostly left alone, though from time to time one of the bunnies plugging you will reach down and jerk you off.", parse);
	}
	Text.NL();
	
	
	if(player.FirstVag()) {
		Sex.Vaginal(male, player);
		player.FuckVag(player.FirstVag(), male.FirstCock(), 2);
		male.Fuck(male.FirstCock(), 2);
		
		LagomorphScenes.Impregnate(player, male);
	}
	Sex.Anal(male, player);
	player.FuckAnal(player.Butt(), male.FirstCock(), 2);
	male.Fuck(male.FirstCock(), 2);
	
	LagomorphScenes.Impregnate(player, male, PregnancyHandler.Slot.Butt);
	
	// COMPANION SECTION BEGIN
	//TODO Miranda
	if(party.InParty(kiakai)) {
		parse = kiakai.ParserPronouns(parse);
		parse = kiakai.ParserTags(parse, "k");
		parse["name"] = kiakai.name;
		parse["priest"] = kiakai.mfTrue("priest", "priestess");
		parse["pHeShe"] = player.mfTrue("He", "She");
		parse["phisher"] = player.mfTrue("his", "her");
		parse["phimher"] = player.mfTrue("him", "her");
		
		Text.Add("Meanwhile, some of the lagomorphs have approached [name], eyeing [himher] lustily. The elf’s eyes flicker to you uncertainly, and [heshe] shakes [himher]self as one of the rabbits advance on [himher].", parse);
		Text.NL();
		Text.Add("<i>“N-no! I cannot!”</i> [heshe] pipes hurriedly, blushing fiercely as [heshe] understands what they want with [himher]. The elf has yet to remove [hisher] clothes, and [heshe]’s hugging [himher]self tightly.", parse);
		Text.NL();
		Text.Add("<i>“No?”</i> The bunny looks confused, gesturing toward you. <i>“[pHeShe] ask, you no want?”</i> If there was any question about what the rabbit is referring to, his bobbing cock makes his intentions clear. [name] throws another glance your way, hurriedly averting [hisher] gaze as the bunnies on top of you add another layer of cum to your sticky coating. <i>“If no want, me go back there, yes?”</i>", parse);
		Text.NL();
		Text.Add("<i>“W-wait!”</i> [name] calls him and his friend back, face still as red as a beet. [HeShe] mutters something under [hisher] breath, finally coming to a decision. <i>“I cannot let you do that to [playername],”</i> [heshe] declares stoically, puffing up [hisher] chest. <i>“[pHeShe] takes so much on [phisher] shoulders, you will wear [phimher] out. I will share [phisher] burden,”</i> the elf announces, looking a lot less certain than [heshe] sounds.", parse);
		Text.NL();
		
		//TODO vagsex
		if(kiakai.TakeVaginalAllowed()) {
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
		}
		else if(kiakai.TakeAnalAllowed()) {
			Text.Add("[HeShe] struggles out of [hisher] clothes, dropping them on the ground beside [himher]. ", parse);
			if(kiakai.FirstVag())
				Text.Add("<i>“Y-you can only use my butt though,”</i> [name] adds, blushing as [heshe] says the words. ", parse);
			Text.Add("The two rabbits close in, pulling the consenting elf down into the grass.", parse);
			Text.NL();
			Text.Add("<i>“We make you feel good, stuff your butt nice!”</i> one of them declares as he rubs his cock against the acolyte’s cheek, pressing it in between [hisher] pliant lips. The other one circles the prone elf, crouching down behind [himher] and placing his cockhead at his lover’s [kanus].", parse);
			Text.NL();
			
			Sex.Blowjob(kiakai, male);
			kiakai.FuckOral(kiakai.Mouth(), male.FirstCock(), 2);
			male.Fuck(male.FirstCock(), 2);
			
			Sex.Anal(male, kiakai);
			kiakai.FuckAnal(kiakai.Butt(), male.FirstCock(), 3);
			male.Fuck(male.FirstCock(), 3);
			
			kiakai.slut.IncreaseStat(60, 3);
			
			var cum = kiakai.OrgasmCum();
						
			Text.Add("Soon, [name]’s moans join with yours as they echo across the plains. Looks like your elf has grown to like getting fucked; you should make sure [heshe] gets [hisher] fill more often...", parse);
		}
		else { //Prude
			Text.Add("<i>“...You can only use my mouth though,”</i> [name] adds, fidgeting. The elf gets down on [hisher] knees, looking up apprehensively as the two rabbits close in. One of them offers the [priest] his cock, while the other sidles up behind [himher], hugging [himher].", parse);
			Text.NL();
			Text.Add("As [name] begins to service [hisher] partner - apparently under the pretense of relieving you - the other bunny slides his paw in between the elf’s legs, ", parse);
			if(kiakai.FirstCock()) {
				parse["kb"] = kiakai.HasBalls() ? " and balls" : "";
				Text.Add("fondling [hisher] cock[kb]", parse);
			}
			if(kiakai.FirstCock() && kiakai.FirstVag())
				Text.Add(" and ", parse);
			if(kiakai.FirstVag())
				Text.Add("fingering [hisher] pussy", parse);
			Text.Add(". The acolyte of Aria arches [hisher] back, unintentionally rubbing up against the bunny’s stiff shaft.", parse);
			Text.NL();
			Text.Add("Though he looks like he feels a bit left out, the bunny restrains himself to rutting against the elf’s back, and doesn’t soil [hisher] purity.", parse);
			Text.NL();
			
			Sex.Blowjob(kiakai, male);
			kiakai.FuckOral(kiakai.Mouth(), male.FirstCock(), 2);
			male.Fuck(male.FirstCock(), 2);
			
			Text.Add("[name] seems to be putting up quite a performance… perhaps you can convince [himher] to offer you similar services, or maybe to take it a step further next time…", parse);
			
			kiakai.slut.IncreaseStat(40, 1);
		}
		Text.NL();
	}
	if(party.InParty(terry)) {
		parse = terry.ParserPronouns(parse);
		parse["foxvixen"] = terry.mfTrue("fox", "vixen");
		parse["tarmor"] = terry.ArmorDesc();
		
		Text.Add("A small group of rabbits approach the [foxvixen] thief and immediately set about removing [hisher] [tarmor].", parse);
		Text.NL();
		
		Scenes.Terry.FuckedByBunnyMob(male, parse);
	}
	
	//TODO Others
	// COMPANION SECTION END
	
	Text.Add("Things start melding together as the entire group deteriorates into an all out orgy.", parse);
	if(comp)
		Text.Add(" The rabbits fuck you and [comp] relentlessly, taking turns at you and shifting partners constantly.", parse);
	Text.NL();
	Text.Add("Time passes...", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		
		var cum = player.OrgasmCum(2);
		
		Text.Add("A significant amount of time later, it seems like the rabbits are finally running out of steam. Your belly is bloated with their numerous loads, cum seeping out of every orifice. Each of your lovers give you one final go before they hop off to rejoin their friends in the pile, though in their exhausted state they’ll most likely spend some time as bottoms.", parse);
		Text.NL();
		if(party.Num() == 2)
			parse["comp"] = " " + party.Get(1).name + " and";
		else if(party.Num() > 2)
			parse["comp"] = " your companions and";
		else
			parse["comp"] = "";
		Text.Add("You gather up[comp] your gear, wobbling a bit unsteadily as you re-equip yourself. In the end, you are not sure who got the most out of that engagement: you or the rabbits.", parse);
		Text.Flush();
		
		TimeStep({hour: 1});
		
		Gui.NextPrompt();
	});
}


LagomorphScenes.GroupWinInterrorigate = function(enc) {
	let player = GAME().player;
	let party = GAME().party;
	var alpha = enc.alpha;
	var parse = {
		meUs       : party.Alone() ? "me" : "us",
		p1name     : function() { return party.members[1].name; }
	};
	
	parse = alpha.ParserPronouns(parse, "m1");
	parse = alpha.ParserTags(parse, "m1");
	parse = player.ParserTags(parse);
	
	if(party.Two())
		parse["comp"] = " and " + party.members[1].name;
	else if(!party.Alone())
		parse["comp"] = " and your companions";
	else
		parse["comp"] = "";
	
	Text.Add("The rabbit horde scatters, scrambling desperately to escape your wrath. You home in on their leader, determined to get to the bottom of this. Before the beaten alpha can join [m1hisher] minions, you block off [m1hisher] path of escape.", parse);
	Text.NL();
	Text.Add("Why were you attacked? What are these critters after? How come there are so damn many of them? The alpha petulantly shakes [m1hisher] head at your questions, unwilling or unable to answer. No matter what you ask, [m1heshe] ignores you, gaze quickly flicking from side to side, looking for a chance to escape.", parse);
	Text.Flush();
	
	//[Leave][Intimidate][Seduce]
	var options = new Array();
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			Text.Add("Useless. You have better things to do than terrorize hapless rabbits. It’s not like beating them would be a hassle, should they prove foolish enough to challenge you again.", parse);
			Text.NL();
			Text.Add("You gather your gear and prepare to continue your journey, ignoring the frightened critter as it scurries away.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "You are just wasting time here."
	});
	options.push({ nameStr : "Intimidate",
		func : function() {
			Text.Clear();
			Text.Add("You push your defeated enemy to the ground beneath you, holding [m1himher] down by force. [m1HeShe] cringes back, growing frightened at your intimidating demeanor.", parse);
			Text.NL();
			Text.Add("<i>“Now answer!”</i> you snap. <i>“Why did you lagomorphs attack [meUs], and where are the lot of you coming from?”</i> You grab the alpha by [m1hisher] fluffy collar, preventing [m1himher] from squirming away.", parse);
			Text.NL();
			Text.Add("<i>“No! No!”</i> [m1heshe] yips, shaking [m1hisher] head desperately. You tighten your grip, fuming at [m1hisher] continued defiance. Seeing [m1hisher] eyes go even wider and almost crazy with terror, however, you realize that [m1heshe] simply doesn’t understand your questions. Perhaps a different approach is in order.", parse);
			Text.NL();
			Text.Add("<i>“You. Attack. Me.”</i> Each word is punctuated with a clear gesture, explaining your query. <i>“<b>Why?</b>”</i> The poor bunny gulps, [m1hisher] whiskers twitching nervously. [m1HeShe] is actually blushing faintly!", parse);
			Text.NL();
			Text.Add("<i>“P-pretty,”</i> [m1heshe] stammers, <i>“bring home... b-breed.”</i> Kidnap and rape, more like.", parse);
			Text.NL();
			Text.Add("<i>“Where is home?”</i> you press.", parse);
			Text.NL();
			Text.Add("<i>“N-no! Can’t!”</i> [m1heshe] moans, struggling helplessly. <i>“Lagon... hurt! Kill!”</i> No matter what you say, the defeated alpha refuses to tell you any more, afraid of something - or someone - more terrifying than you.", parse);
			Text.NL();
			Text.Add("Perhaps, though... you step back from your captive. <i>“Stay,”</i> you command. <i>“No talk? Hurt.”</i> You punctuate the last word by pointing straight at [m1hisher] rapidly drumming chest. Turning around, you make a great show of searching through your pack, pulling out various implements that could, theoretically, be applied to harm someone.", parse);
			Text.NL();
			Text.Add("A rapid patter of feet behind you tells you that your captive has finally caught on. Now to see if your bet paid off, and if the critter is as stupid as you think. You set out after your quarry, who is making a beeline across the plains for some unknown location.", parse);
			Text.NL();
			
			// TODO: Maybe a hunting check. Maybe.
			
			Text.Add("After stalking your prey at a safe distance for the better part of an hour, you draw close to a set of low hills. You slow down, as you don’t want to run straight into a trap. There seem to be a lot of lagomorphs milling around, way too many for you to handle by yourself. The alpha disappears down a large hole, set in the side of one of the central mounds, hopping down some musky underground tunnel.", parse);
			Text.NL();
			Text.Add("Just barging in doesn’t seem to be the wisest thing to do, but at least you know how to find this place again.", parse);
			Text.NL();
			Text.Add("<b>You discovered the Burrows.</b>", parse);
			Text.Flush();
			
			burrows.flags["Access"] = BurrowsFlags.AccessFlags.KnownNotVisited;
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Force some answers from your captive."
	});
	options.push({ nameStr : "Seduce",
		func : function() {
			Text.Clear();
			Text.Add("Rather than the stick, perhaps the carrot could prove more effective in getting your way...", parse);
			Text.NL();
			Text.Add("You sidle up to the defeated alpha, seductively caressing [m1hisher] [m1breasts], suggesting that you can be very... accomodating, should [m1heshe] cooperate. To illustrate your point, ", parse);
			if(alpha.FirstCock())
				Text.Add("you idly slide your fingers across [m1hisher] flaccid member, coaxing it to its full length. ", parse);
			else
				Text.Add("one of your hands slides between her legs, teasing open her folds. ", parse);
			Text.Add("It’s not very hard to get the rabbit desperately aroused - it’s part of [m1hisher] nature, after all.", parse);
			Text.NL();
			Text.Add("<i>“C-coop... rate?”</i> [m1heshe] pants, rutting against your hand with [m1hisher] hips. Yes... to start with, where are all these rabbits coming from? <i>“B-burrows,”</i> the alpha yips, waving dismissively off in the distance, far more interested in your hands than your questions.", parse);
			Text.NL();
			Text.Add("Much to [m1hisher] frustration, you withdraw your hands. You tell [m1himher] that you’ll show [m1himher] a <i>really</i> good time, if [m1heshe] just takes you there. The rabbit looks conflicted for a moment, juggling with the promise of sex and potentially revealing a secret. Only for a moment, though.", parse);
			Text.NL();
			Text.Add("You are dragged along by the eager alpha, who heads off across the plains, hopping about excitedly. Before long, you spot a low cluster of hills, apparently the rabbit’s destination.", parse);
			Text.NL();
			Text.Add("As you draw closer, you spot a large crowd of lagomorphs milling around outside, far too many for you to deal with.", parse);
			Text.NL();
			Text.Add("<b>You discovered the Burrows.</b>", parse);
			Text.NL();
			Text.Add("What should you do about your expectant companion? This close to so many of [m1hisher] kind, you probably won’t get away without putting out at least something.", parse);
			
			TimeStep({hour: 1});
			Text.Flush();
			
			//[Follow][Ditch]
			var options = new Array();
			options.push({ nameStr : "Follow",
				func : function() {
					Text.Clear();
					Text.Add("You nod to your guide encouragingly, telling [m1himher] to lead on. As you enter the mob, the alpha calls out a few wordless commands. An entourage quickly forms, countless hands grabbing hold of you[comp], hoisting you into the air.", parse);
					Text.NL();
					Text.Add("Things are rapidly moving out of your control, though you ruefully admit that you should probably have seen this coming. Not much you can do about it at this point - and who knows, maybe it will even prove pleasurable, as you are quite sure the alpha will demand [m1hisher] reward before long.", parse);
					Text.NL();
					Text.Flush();
					
					Gui.NextPrompt(function() {
						Text.Clear();
						Scenes.Burrows.Arrival(alpha);
					});
				}, enabled : true,
				tooltip : "Follow the alpha into the crowd."
			});
			options.push({ nameStr : "Ditch",
				func : function() {
					Text.Clear();
					parse["down"] = player.HasLegs() ? "getting down on your knees" : "lowering yourself";
					Text.Add("Rather than follow the alpha into the gathering, you pull [m1himher] off to the side, [down] in front of the short bunny-morph. The alpha moans expectantly, [m1hisher] hips twitching of their own accord in anticipation.", parse);
					Text.NL();
					if(alpha.FirstCock()) {
						Text.Add("The lagomorph is stiff as a rod and leaking pre from waiting so long, and all but erupts the second [m1heshe] feels your lips close around [m1hisher] [m1cock]. Thinking that this is going to be even easier than you imagined, you lick [m1hisher] [m1cockTip] encouragingly, coaxing forth [m1hisher] seed.", parse);
						Text.NL();
						Text.Add("Yelping loudly, the lagomorph releases a torrent down your gullet, pumping what feels like gallons of hot semen into your stomach. It seems like you have gravely misjudged [m1hisher] capacity, however, as the alpha - rather than pulling out - starts rutting [m1hisher] cock, not softening one bit.", parse);
						Text.NL();
						Text.Add("[m1HeShe] hasn’t even stopped cumming before [m1heshe] is rapidly thrusting the entire length of [m1hisher] meat down the tight confines of your poor throat. Though [m1hisher] progress is greatly eased by the generous amount of lubricant [m1heshe] provided, your constricting tunnel is still protesting violently.", parse);
						Text.NL();
						Text.Add("Your eyes are watering from lack of air, when the next pinnacle of your lover’s assault sets in, pouring even more sticky white cream into your expanding stomach. Finally, [m1heshe] pulls out, letting you catch your breath again.", parse);
						Text.NL();
						Text.Add("Spent, the alpha wanders off to join the others.", parse);
					}
					else {
						Text.Add("You guide the alpha down on her back, and tell her to spread her legs. Licking your lips hungrily, you dig in, burying your [tongue] in the moist cleft between her thighs. You take your time soaking up her sweet nectar, lapping at her folds and sensitive clit.", parse);
						Text.NL();
						Text.Add("The lagomorph urges you on, whimpering softly as you ravage her sex. Your lover strokes your [hair], showing uncharacteristic gentleness for her usually hyperactive species. It almost makes you wish you could take this farther, but this close to the other rabbits, the risk of being discovered is too great. Who knows what they’d do if they noticed you...", parse);
						Text.NL();
						Text.Add("The alpha has no such qualms, on the other hand, crying out in pleasure for all the world to hear. Then again, you’re probably still safe, as she doesn’t seem to be the only one. By the sounds of it, there seems to be quite a lot of carnal activity going on in the large rabbit mob milling around close by.", parse);
						Text.NL();
						Text.Add("She gives one final cry as her hips start twitching, the rewards of your oral efforts trickling down one of her thighs. Shuddering, she collapses on the ground, panting incessantly for more.", parse);
						Text.NL();
						Text.Add("As much as you’d like to, this is probably your best opportunity to leave unscathed, so you quickly gather your gear, murmuring your apologies to the pining bunny. No doubt, she’ll find plenty of willing partners soon enough.", parse);
					}
					Text.NL();
					Text.Add("For the moment, you retreat back to the plains, not quite ready to tackle the burrows yet.", parse);
					Text.Flush();
					
					burrows.flags["Access"] = BurrowsFlags.AccessFlags.KnownNotVisited;
					
					Gui.NextPrompt();
				}, enabled : true,
				tooltip : Text.Parse("You’re not quite ready to tackle this yet. Give the alpha what [m1heshe] wants and be off.", parse)
			});
			Gui.SetButtonsFromList(options);
			
		}, enabled : true,
		tooltip : "Entice your captive with promises of rewards."
	});
	Gui.SetButtonsFromList(options);
}

export { Lagomorph, LagomorphAlpha, LagomorphElite, LagomorphBrute, LagomorphWizard, LagomorphScenes };
