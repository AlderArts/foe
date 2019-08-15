/*
 *
 * Naga, lvl 4-6
 *
 */

import { Entity } from '../entity';
import { WorldTime, TimeStep, GameCache, GAME } from '../GAME';
import { Images } from '../assets';
import { Cock } from '../body/cock';
import { Vagina } from '../body/vagina';
import { Element } from '../damagetype';
import { Race } from '../body/race';
import { Color } from '../body/color';
import { AlchemySpecial } from '../items/alchemyspecial';
import { AlchemyItems } from '../items/alchemy';
import { IngredientItems } from '../items/ingredients';
import { Text } from '../text';
import { Party } from '../party';
import { Encounter } from '../combat';
import { EncounterTable } from '../encountertable';
import { Gui } from '../gui';
import { SetGameState, GameState } from '../gamestate';
import { Sex } from '../entity-sex';
import { Abilities } from '../abilities';
import { PregnancyHandler } from '../pregnancy';
import { LowerBodyType } from '../body/body';
import { Orifice } from '../body/orifice';
import { Jobs } from '../job';

let NagaScenes : any = {};

export class Naga extends Entity {
	constructor() {
		super();

		this.ID = "naga";

		this.avatar.combat     = Images.naga;
		this.name              = "Naga";
		this.monsterName       = "the naga";
		this.MonsterName       = "The naga";
		this.body.cock.push(new Cock());
		this.body.cock.push(new Cock());
		this.body.vagina.push(new Vagina());
		if(Math.random() < 0.7)
			this.Butt().virgin = false;
		this.FirstVag().virgin = false;
		this.FirstBreastRow().size.base = 10;

		this.maxHp.base        = 100;
		this.maxSp.base        = 40;
		this.maxLust.base      = 65;
		// Main stats
		this.strength.base     = 20;
		this.stamina.base      = 18;
		this.dexterity.base    = 23;
		this.intelligence.base = 21;
		this.spirit.base       = 22;
		this.libido.base       = 24;
		this.charisma.base     = 27;

		this.elementDef.dmg[Element.lust]   =   0.5;
		this.elementDef.dmg[Element.mFire]  =   0.5;
		this.elementDef.dmg[Element.mIce]   =  -0.5;
		this.elementDef.dmg[Element.mWater] = -0.25;

		this.level             = 4;
		if(Math.random() > 0.8) this.level = 6;
		this.sexlevel          = 2;

		this.combatExp         = this.level;
		this.coinDrop          = this.level * 4;

		this.body.SetRace(Race.Snake);

		this.body.SetBodyColor(Color.olive);

		this.body.SetEyeColor(Color.purple);
		this.body.SetHairColor(Color.blue);

		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}
	
	//TODO other conditions?
	static HypnoUnlocked() {
		return GameCache().flags["NagaVenom"] != 0;
	}

	static NagaMateUnlocked() {
		return GameCache().flags["NagaMate"] != 0;
	}
		
	DropTable() {
		let drops = [];
		if(Math.random() < 0.05) drops.push({ it: AlchemySpecial.Nagazm });
		if(Math.random() < 0.05) drops.push({ it: AlchemyItems.Lacertium });
		if(Math.random() < 0.5)  drops.push({ it: IngredientItems.SnakeOil });
		if(Math.random() < 0.5)  drops.push({ it: IngredientItems.SnakeFang });
		if(Math.random() < 0.5)  drops.push({ it: IngredientItems.SnakeSkin });

		if(Math.random() < 0.1)  drops.push({ it: IngredientItems.LizardEgg });
		if(Math.random() < 0.1)  drops.push({ it: IngredientItems.LizardScale });
		if(Math.random() < 0.1)  drops.push({ it: IngredientItems.SpringWater });
		if(Math.random() < 0.1)  drops.push({ it: IngredientItems.Trinket });

		if(Math.random() < 0.01) drops.push({ it: IngredientItems.BlackGem });
		if(Math.random() < 0.01) drops.push({ it: AlchemyItems.Scorpius });
		if(Math.random() < 0.01) drops.push({ it: AlchemyItems.Gestarium });
		return drops;
	}

	Act(encounter : any, activeChar : any) {
		// TODO: Very TEMP
		Text.Add(this.name + " acts! Hiss!");
		Text.NL();

		// Pick a random target
		let t = this.GetSingleTarget(encounter, activeChar);

		let parseVars = {
			name   : this.name,
			hisher : this.hisher(),
			tName  : t.name
		};

		let choice = Math.random();
		if(choice < 0.4)
			Abilities.Attack.Use(encounter, this, t);
		else if(choice < 0.6 && Abilities.Physical.Ensnare.enabledCondition(encounter, this))
			Abilities.Physical.Ensnare.Use(encounter, this, t);
		else if(choice < 0.8 && Abilities.Physical.Pierce.enabledCondition(encounter, this))
			Abilities.Physical.Pierce.Use(encounter, this, t);
		else if(choice < 0.9 && Abilities.Seduction.Distract.enabledCondition(encounter, this))
			Abilities.Seduction.Distract.Use(encounter, this, t);
		else
			Abilities.Seduction.Tease.Use(encounter, this, t);
	}

}


NagaScenes.Impregnate = function(mother : Entity, father : Naga, slot? : number) {
	mother.PregHandler().Impregnate({
		slot   : slot || PregnancyHandler.Slot.Vag,
		mother : mother,
		father : father,
		race   : Race.Snake,
		num    : 1,
		time   : 20 * 24,
		load   : 3
	});
}

NagaScenes.LoneEnc = function() {
	let enemy = new Party();
	let enc : any = new Encounter(enemy);

	enc.naga = new Naga();

	enemy.AddMember(enc.naga);

	enc.onEncounter = NagaScenes.DesertEncounter;
	enc.onLoss      = NagaScenes.DesertLoss;
	enc.onVictory   = NagaScenes.DesertWinPrompt;

	return enc;
}

NagaScenes.DesertEncounter = function() {
	let player = GAME().player;
	let enc  = this;
	let naga : Naga = enc.naga;
	let parse : any = {

	};

	parse = player.ParserTags(parse);
	let nagaMate =  false;

	Text.Clear();
	let scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("You crest yet another sand dune and discover a large rocky outcrop. Spotting a cave entrance, you decide to look inside and seek shelter from the unforgiving desert climate. You reach the cave entrance and peek inside. The cave is dark, but you feel cool air and hear the sound of dripping water.", parse);
		Text.NL();
		Text.Add("<i>“My, my... aren’t you just the sweetest little morsel? I do love it when my prey is courteous enough to come to me.”</i> You spin around to face the source of the sultry feminine voice.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("You come across a small oasis surrounded by plant life, a rare sight in this area. Several wide slabs of sandstone are exposed among the vegetation, and from a distance you spot something lying on one of them. As you cautiously approach the rock, you see a thick, scaly tail resting on top of it - resembling a snake’s, but much larger. Your [foot] upsets a nearby stone, and the creature springs to attention, seeking the source of the sound.", parse);
		Text.NL();
		Text.Add("<i>“Oh, hello there, plaything! I suppose I won’t have to hunt tonight, now that my prey has come to me,”</i> a clearly female voice says excitedly. You realize what you’ve stumbled upon is definitely more than a snake.", parse);
	}, 1.0, function() { return WorldTime().hour >= 6 && WorldTime().hour < 19; });
	scenes.AddEnc(function() {
		Text.Add("While exploring the sands in the cool night air, you get the feeling you’re being watched. Looking around and seeing nothing, you continue more cautiously, sweeping the sand behind you to cover your tracks, hoping to lose would-be pursuers. A few minutes later, you hear hissing right behind you!", parse);
		Text.NL();
		Text.Add("<i>“Submit, prey!”</i> a domineering, feminine voice commands and you turn to face your would-be attacker.", parse);
	}, 1.0, function() { return WorldTime().hour < 4 || WorldTime().hour >= 20; });
	scenes.AddEnc(function() {
		Text.Add("You come upon a familiar cavern in your travels through the harsh desert. Within seconds of your arrival at the den of your naga mate, you hear her sultry, breathy voice inches from your ear.", parse);
		Text.NL();
		Text.Add("<i>“Welcome back, my delicious mate...”</i> she coos lewdly, her breath tickling your ear. <i>“Did you come here to fuck, or would you like to put up that facade of resistance you showed last time?”</i>", parse);
		Text.Flush();
		nagaMate = true;

	}, 1.0, function() { return Naga.NagaMateUnlocked(); });

	scenes.Get();

	if(nagaMate) {
		//[Fuck][Fight]
		let options = new Array();
		options.push({ nameStr : "Fuck",
			func : function() {
				Text.Clear();
				Text.Add("The naga smiles and stares into your eyes with her faintly glowing magenta orbs. <i>“That’s a good [boyGirl]... Come on, I’ll help you get off all of those pesky clothes...”</i> she purrs while you fall once again under her spell.", parse);
				Text.NL();
				Text.Flush();

				let ret = NagaScenes.DesertLossScenes(enc);

				if(!ret) {
					Text.Add("PLACEHOLDER...");
					Text.Flush();
					Gui.NextPrompt();
				}
			}, enabled : true,
			tooltip : "Forget fighting, get down and dirty with the scaly slut!"
		});
		options.push({ nameStr : "Fight",
			func : function() {
				Text.Clear();
				Text.Add("The naga sighs. <i>“Must we <b>really</b> go through this again? Fine, but I’m not holding back!”</i> she shouts as she rears up to her full height, ready to fight!", parse);
				Text.Flush();

				Gui.NextPrompt(function() {
					enc.PrepCombat();
				});
			}, enabled : true,
			tooltip : "Resist the naga’s temptation and fight her off!"
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		Text.Add(" Towering over you at roughly eight feet tall is a half-human, half-serpent creature. From the hips up, her body is that of a lithe, average-sized human woman with a thin waist, shapely D-cup breasts proudly on display, and long, slender arms adorned with golden armlets.", parse);
		Text.NL();
		Text.Add("Her skin is pale, with a slight hint of green, and her facial features call to mind images of snakes; she has a flattened nose, vivid, angular magenta eyes, and elongated, pointy ears pierced with golden hoops. You catch a glimpse of a forked tongue as it slips out between her supple lips, licking them hungrily. An unmatched pair of shining emerald gemstones adorn her forehead just below where her long, icy blue hair begins, sweeping back and falling below her shoulders.", parse);
		Text.NL();
		Text.Add("Her human torso gives way to an enormous snake-like lower body, complete with a thick tail in place of legs. Dark green scales cover her from the hips down, parting only to allow her genitals to show. This snake is a hermaphrodite! Her pair of matching massive cocks are already standing at attention at twelve inches of length, and her barely visible slit is dripping with anticipation.", parse);
		Text.NL();
		Text.Add("<i>“This will be much more enjoyable for you if you don’t resist.”</i> The naga’s voice alerts you just in time to dodge her tail as she attacks you!", parse);
		Text.Flush();

		Gui.NextPrompt(function() {
			enc.PrepCombat();
		});
	}
}

NagaScenes.DesertLoss = function() {
	let player = GAME().player;
	let party : Party = GAME().party;
	let enc  = this;
	let naga : Naga = enc.naga;
	SetGameState(GameState.Event, Gui);

	let parse : any = {

	};
	parse = player.ParserTags(parse);

	if(party.Num() == 2)
		parse["comp"] = party.Get(1).name;
	else if(party.Num() > 2)
		parse["comp"] = "your companions";
	else
		parse["comp"] = "";

	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("You collapse to the sand with a thud, lacking the energy to resist any further.", parse);
		Text.NL();
		parse["c"] = party.Num() > 1 ? Text.Parse(", completely ignoring [comp]", parse) : "";
		Text.Add("<i>“You went and tired yourself out! I told you it would be easier if you didn’t resist. Don’t worry though, I won’t hurt you… much...”</i> the naga says with a lusty chuckle as she slithers toward your prone form[c]. Your eyes are drawn to her crotch and impressive genitals. Her pulsating pair of enormous cocks throbs and her reptilian slit oozes, its juices dripping to the sand. She coils her tail around you and squeezes just tightly enough to avoid hurting you as she lifts you off the ground, raising your face to hers.", parse);
		Text.NL();
		Text.Add("The naga’s forked tongue tastes your sweat, plays across your lips, and licks at your [ears]. She leans over to whisper in your ear: <i>“We’re going to have some fun now… I’m going to use you, but I’m sure you’ll get off in the process.”</i> She giggles and nibbles on your earlobe, her fangs thankfully retracted.", parse);
		Text.NL();
		Text.Add("As she pulls away from your ear, you find your eyes drawn to hers by the sound of her voice, and feel an irresistible urge to gaze deep into her piercing magenta eyes. Any resistance that you might have mustered slips away, leaving only complete obedience.", parse);
		if(player.FirstCock()) {
			parse = Text.ParserPlural(parse, player.NumCocks() > 1);
			Text.Add(" Blood surges to your [cocks] as you fall under the naga’s spell, and [itThey] throb[notS] in anticipation of the pleasure to come.", parse);
		}
		if(player.FirstVag())
			Text.Add(" You feel your [vag] moisten as you stare into your captor’s eyes, lubricating you liberally for the impending penetration.", parse);
		Text.NL();

		let ret = NagaScenes.DesertLossScenes(enc);

		if(!ret) {
			Text.Add("PLACEHOLDER...");
			Text.Flush();
			Gui.NextPrompt();
		}
	});
	Encounter.prototype.onLoss.call(enc);
}

NagaScenes.DesertLossScenes = function(enc : any) {
	let player = GAME().player;
	let scenes = new EncounterTable();
	scenes.AddEnc(function() {
		NagaScenes.DesertLossGetDPd(enc);
		return true;
	}, 1.0, function() { return player.FirstVag() && player.LowerBodyType() != LowerBodyType.Single; });
	scenes.AddEnc(function() {
		NagaScenes.DesertLossUseCock(enc);
		return true;
	}, 1.0, function() { return player.FirstCock(); });
	scenes.AddEnc(function() {
		NagaScenes.DesertNagaMating(enc.naga);
		return true;
	}, 1.0, function() { return player.IsNaga(); });
	//TODO Redo into a proper scene structure

	/*
	scenes.AddEnc(function() {
		Text.Add("", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	*/

	return scenes.Get();
}

NagaScenes.DesertLossGetDPd = function(enc : any) {
	let player = GAME().player;
	let party : Party = GAME().party;
	let naga : Naga = enc.naga;
	SetGameState(GameState.Event, Gui);

	let parse : any = {

	};

	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);

	if(party.Num() == 2)
		parse["comp"] = party.Get(1).name;
	else if(party.Num() > 2)
		parse["comp"] = "your companions";
	else
		parse["comp"] = "";

	Text.Add("Still wrapped tightly within the naga’s coils, you feel your body being turned upside-down. Her upper shaft brushes against the side of your face, and instinctively your lips part and you wrap your hands around the thick erection presented to you, guiding the head into your welcoming mouth. You do your best to coat it in saliva, knowing that your only task is to prepare it for the main course.", parse);
	Text.NL();
	parse["cl2"] = player.FirstVag().clitCock ? "" : Text.Parse(", using some of her tongue's excess length to prod your [clit] for good measure", parse);
	Text.Add("Your serpentine mistress takes hold of your legs with her hands, spreading them as she lifts your [vag] to her lips. She takes a few exploratory licks inside[cl2]. You moan as her slim, flexible muscle pleasures and tickles at your vaginal walls, managing to find all of your most sensitive places.", parse);
	Text.NL();
	Text.Add("Satisfied that your [vag] is soaked with your own secretions, she pulls away, simultaneously drawing her hips away and presenting you with her lower member. You greedily welcome her second cock into your empty maw, slathering it in as much saliva as you can manage.", parse);
	Text.NL();
	Text.Add("The naga pulls you closer and begins to probe around your [anus] with her tongue. She spits on the entrance and pushes one of her fingers through to allow her thin, flexible organ inside. The snake-tongue is drenched in drool, and you realize that the naga is pushing so much saliva into you that she could have filled your mouth several times over. You relax your [anus] at the warmth and wetness inside you, and delight in the feeling of letting it coat and lubricate your passages.", parse);
	Text.NL();
	Text.Add("<i>“Alright, it’s time for the main course.”</i> You barely register your scaled lover’s words as she turns you upright and rests your back on her tail before aligning you with her monstrous, saliva-slicked members. Your [breasts] are on full display, and the naga licks her lips, clearly enjoying the sight of your naked, subservient form. Her hands find your hips as she draws her tail closer, bringing your [vag] and [anus] to rest against the heads of their partners. The heat from her genitals alone is enough to make you squirm and moan.", parse);
	Text.NL();
	Text.Add("<i>“Please, <b>fuck me!</b>”</i> you yell, the anticipation of pleasure too great to even show the barest restraint. Right now, you need those cocks inside you more than the most depraved slut.", parse);
	Text.NL();
	Text.Add("The naga leans her upper body down, hands still firmly on your [hips]. Her face inches away from yours, she replies, <i>“Gladly, pet.”</i> She moves her hips forward, the heads of her twin towering erections pressing harder and harder against your entrances until they finally breach, sending sparks of pleasure racing through your body. Your [vag] lets another spurt of juice out, coating the first few inches of your lover’s first cock, while you can feel a little of her spit leaking out around your anal invader.", parse);
	Text.NL();

	Sex.Vaginal(naga, player);
	player.FuckVag(player.FirstVag(), naga.FirstCock(), 3);
	naga.Fuck(naga.FirstCock(), 3);

	Sex.Anal(naga, player);
	player.FuckAnal(player.Butt(), naga.FirstCock(), 3);
	naga.Fuck(naga.FirstCock(), 3);

	Text.Add("<i>“Fuck, you’re so tight, pet. That’s alright, we’ll fix that.”</i> The naga flashes you a wicked grin, then presses her lips to yours. Her tongue slips into your mouth, and pleasant as it is to feel it swirling and wrapping around your [tongue], it proves to be a fleeting distraction. Moments later, the snake-lady thrusts her hips forward in a short but powerful motion, embedding the first three inches of her throbbing cocks inside you.", parse);
	Text.NL();
	Text.Add("Your scream of surprise and pleasure is muffled by the continuing kiss, but you swear you can feel the naga’s lips twist into more of a grin, even without breaking the lip-lock. The tongue inside your mouth slithers in deeper, now completely wrapped around your [tongue] and constricting it rhythmically. You feel the fingers on your hips grip tighter, and you know your mistress’s second thrust is coming. Steeling yourself as well as you can, you try to relax and let her in.", parse);
	Text.NL();
	Text.Add("Sure enough, the second thrust comes, just as powerful as the first, but slightly farther, the naga’s thick shafts now a full seven inches inside you. You try again to scream as pleasure wracks your brain, but barely a sound escapes the tightness of the serpent’s mouth pressed to yours. You’re already as full inside as you think your body can handle, and it feels so good that you almost forget that the cocks stuffing you are only halfway in.", parse);
	Text.NL();
	Text.Add("With less time to recover than after the first thrust, the third comes, this one stronger, hard enough to ram the remainder of the naga’s members home. Your lover abruptly breaks the kiss as she thrusts this time so that as you hear the slap of her flesh against yours. You scream in raw, bestial pleasure that anyone within a mile could hear you. Your eyes roll back in your head momentarily, your holes utterly filled with slowly pulsating naga-cock. Your mistress laughs almost as loud as you cried out, giving you but a moment to rest.", parse);
	Text.NL();
	Text.Add("<i>“Ah, pet… so amusing. That was all just preamble, slut.”</i> the naga taunts as she slowly and steadily begins to pull her hips back. Every inch that her double-dicks vacate feels painfully empty, and your body aches to be filled to the brim again. The naga continues to withdraw until only the bulbous heads of her cocks remain inside you.", parse);
	Text.NL();
	Text.Add("<i>The real fun begins… <b>now!</b>”</i> the she-serpent shouts, grabbing your [nips] and twisting as she thrusts her hips forward once again, this time ramming her cocks in to the hilt in one savage motion. Both you and your lover scream in delight, your raw cries of uncontrolled pleasure creating an excellent harmony with the naga’s dominant exclamation of control and power. Brought over the edge, you cum, your [vag] squirting fem-spunk all over the naga’s bare midriff.", parse);
	Text.NL();

	let cum = player.OrgasmCum();

	if(player.FirstCock()) {
		Text.Add("Your [cocks] begin[notS] to spasm, sympathetically climaxing with your [vag]. ", parse);
		if(cum > 6) {
			Text.Add("Seed erupts from your shaft[s], showering the desert sands around you in the evidence of your sensational orgasm. ", parse);
		}
		else if(cum > 3) {
			Text.Add("Thick ropes of jizz arc over your head as your [cocks] release[notS] [itsTheir] payload[s], some landing in your [hair] as the flow ends. ", parse);
		}
		else {
			Text.Add("Hot spunk lands wetly on your midriff, and you enjoy the sensation almost as much as the orgasm itself. ", parse);
		}
	}
	Text.Add("Very nearly insensate now, the only thing you can do is groan and deeply enjoy the rough fuck you’re receiving. The snake gives you no rest, immediately beginning to pull out and tugging not-so-gently on your nipples. You moan whorishly and arch your back, beginning to lose all muscle control to the throes of pleasure.", parse);
	Text.NL();
	if(player.FirstBreastRow().Size() > 3) {
		Text.Add("The naga switches her focus from your [nips] to your [breasts], grabbing them with her hands as fast as a cobra strikes its prey. Your mistress squeezes roughly, kneading your [breasts] vigorously as she enthusiastically plows back into you.", parse);
		if(player.Lactation()) {
			Text.NL();
			parse["milk"] = player.Milk() > 20 ? "your seemingly endless supply of milk" :
			                player.Milk() > 10 ? "numerous mouthfuls" : "all she can";
			//TODO drain milk
			Text.Add("Streamers of warm cream spew from your [nips]. <i>“Oh! I love the taste of fresh milk. Gets me so hot and bothered...”</i> the naga says, her intentions plain from the way she licks her lips. Bending down and latching her mouth onto your left [nip], she bites down softly and begins to forcibly suckle. She starts viciously milking your left breast for all its sweet creamy goodness, never slowing the pace of penetration. Gulping down [milk], she releases your left mound, its load depleted.", parse);
			Text.NL();
			Text.Add("Neither wasting time nor disrupting her rhythm, she turns her attention to your right breast and begins draining it with the same thirsty fervor. Your moans become louder as your right [breast] is pumped in time with the thick peckers inside you. Your [breasts] are soon completely drained of their precious cargo, feeling noticeably lighter.", parse);
			Text.NL();
			Text.Add("<i>“Mmm… delicious...”</i> the naga breathes, her voice husky, a trickle of your milk rolling down her jaw. Her hips stop briefly, shafts hilted inside you, and you feel the already huge erections pulsate with further intensity inside you. The moment passes as the serpent resumes plumbing your depths, but you could swear you feel even more full of naga cock than you were a while ago.", parse);
		}
	}
	else {
		Text.Add("The snake alternates between tweaking and softly biting your [nips] while dragging her claw-like nails softly along your chest. Her scratching draws no blood, but does serve to further cement your current position as submissive prey.", parse);
	}
	Text.NL();
	if(player.FirstCock()) {
		Text.Add("Your scaled mistress’ hands roam from your chest to your crotch, where your still-sensitive [cocks] [hasHave] just returned to full-mast. <i>“Here, let me help you out, pet. You’ve already cum from [thisThese] once, so this will feel even better...”</i> She wraps her fingers firmly around[oneof] your [cocks], warmth surging into its hypersensitive flesh. You cry out in agonized pleasure, the sensation too much for you to bear so soon after cumming. She begins to stroke your trembling shaft in time with her thrusting, and with each stroke you shriek wildly, your hips convulsing as your cock is assaulted by many times the stimulation you can take right now.", parse);
		Text.NL();
	}
	Text.Add("The naga moans and starts to pick up her pace, steadily increasing the frequency of her thrusts. You lose track of time under the sensory onslaught you’re experiencing. At some point, you cum again, able to recall the deluge of ecstasy but not at what moment it occurs during the savaging you’re taking.", parse);
	Text.NL();
	Text.Add("You finally regain some semblance of consciousness in time to hear your snake-lover begin to moan and grunt with increasing frequency. Her thrusts are becoming more deliberate without slowing down, and you realize that the naga is about to cum. Surprisingly - and agonizingly - the serpent pulls her pair of monstrous cocks out of you completely, the feeling of emptiness momentarily overwhelming you.", parse);
	Text.NL();
	Text.Add("You see the fat shafts throb wildly for a few seconds as she points them at your face and your [breasts], stroking them with one hand each to coax out as much jizz as she can. With the most unrestrained sound she’s made so far, the naga unloads her cannons on you, torrents of sperm splattering against your [breasts] and all over your features, plenty making it into your wide-open maw. You briefly savor the salty but delicious taste before swallowing submissively just in time for the next gush of seed to strike. The cum that doesn’t land in your mouth simply piles up on the rest of your face. Your [breasts], having no such drainage, simply become covered in layer after layer of hot, sticky snake-seed.", parse);
	Text.NL();
	Text.Add("The naga allows you to briefly revel in the warmth of your cum bath while she catches her own breath. You take the moment to feed yourself more of the jism that landed where your tongue couldn’t reach on your visage, even scooping some off of your [breasts] when your face is more or less cleaned up.", parse);
	Text.NL();
	Text.Add("<i>“Now that you’re warmed up, I can go again without worrying about breaking you.”</i> The naga laughs, smiling at you wickedly as she flips you over to lie face-down on her tail. You thought she was done after the ridiculous amount of cum she just shot, but it seems the snake’s reserves are quite deep. She lines up her still rock-hard cocks at the opposite holes of those they just penetrated, and now takes no time before inserting their heads into your [anus] and [vag].", parse);
	Text.NL();
	Text.Add("Your serpent-mistress gives your [butt] a firm slap - the sound echoing who knows how far out into the desert - and begins your second reaming, immediately fucking you with smooth and powerful thrusts. Your insides once again feel that blissful fullness, and you moan as you receive another firm spank. The naga clutches at your ass cheeks, playing with them as she did with your breasts. You close your eyes and begin to lose yourself once again to the pleasure when suddenly you feel something in your mouth.", parse);
	Text.NL();
	Text.Add("The tip of the snake’s long tail is pushing its way into your maw, pressing your tongue down and poking at the back of your throat. The naga forces a length of her scaly appendage into your gullet and begins to slide it in and out in time with her cunt and ass destroyers. Effectively being triple penetrated now in this two-member gangbang, you lose control, your body shaking as another orgasm begins.", parse);
	Text.NL();

	cum = player.OrgasmCum();

	Text.Add("You feel your [anus] and [vag]’s muscles spasm and clench, beginning to milk the enormous invaders for all they’re worth. You don’t want a cum bath this time… you want to be <b>filled</b> with your mistress’ seed. As she once again picks up the pace, thrusting fast and deep, hilting with an audible slap of flesh on flesh at the end of each, you feel the thick shafts inside you throb faster. The naga is close as well, and she kneads and slaps your [butt] savagely between thrusts, clearly getting off even more on her dominance.", parse);
	Text.NL();
	Text.Add("In what seems like hours, but is actually less than a minute, the serpentess crosses the edge. She pushes her massive rods into your holes as far as possible and grinds her hips roughly against your ass as if to push her cocks further in than her body would allow. You feel the embedded erections pulsate, becoming significantly thicker periodically as the naga breaks into another shout of utmost pleasure.", parse);
	Text.NL();
	Text.Add("As you begin to feel the warmth of her cum pumping into you, your already feverish orgasm doubles in intensity, and you let out another scream, muffled by the tail that’s been throat-fucking you. Unable to move or speak as you’re pumped full of sperm from both your [vag] and [anus], you lose yourself to the satisfaction. You can barely breathe around the snake’s flexible appendage, but somehow the sensation of your belly slightly inflating is comforting.", parse);
	Text.NL();

	NagaScenes.Impregnate(player, naga, PregnancyHandler.Slot.Vag);
	NagaScenes.Impregnate(player, naga, PregnancyHandler.Slot.Butt);

	if(player.FirstCock()) {
		parse["cum"] = cum > 6 ? "torrents" :
		               cum > 3 ? "bursts" : "streams";
		Text.Add("Your [cocks] [isAre] pinned helplessly between the naga’s tail and her crotch as she continues to mash her hips against your [butt]. The pressure combined with your feminine orgasm’s intensity brings your masculine endowment[s] over the edge again, even after [itsTheir] earlier release and subsequent torment. Your overused [cocks] release[notS] [cum] of semen down the scaly tail beneath you, but your lover is too engrossed in her orgasm to care.", parse);
		Text.NL();
	}
	Text.Add("You feel yourself being lifted subtly, gently away from the section of tail supporting you as the naga’s orgasm finally runs its course. She gives you one last celebratory swat on the ass as she slides her prodigious peckers out of your orifices, and lowers you onto the soft sand below. <i>“That was fun, slut. Come again, any time...”</i> she says with a parting wink before slithering away into the desert, leaving you naked and your savaged holes leaking cum.", parse);
	Text.NL();

	parse["c"] = party.Num() > 1 ? Text.Parse(" with [comp]", parse) : "";

	Text.Add("You pass out, waking hours later[c].", parse);
	Text.Flush();

	TimeStep({hour: 2});

	Gui.NextPrompt();
}


NagaScenes.DesertLossUseCock = function(enc : any) {
	let player = GAME().player;
	let party : Party = GAME().party;
	let naga : Naga = enc.naga;
	SetGameState(GameState.Event, Gui);

	let p1cock = player.BiggestCock();
	let allCocks = player.AllCocksCopy();
	for(let i = 0; i < allCocks.length; i++) {
		if(allCocks[i] == p1cock) {
			allCocks.splice(i, 1);
			break;
		}
	}

	let parse : any = {
		cocks2 : function() { return player.MultiCockDesc(allCocks); }
	};

	parse = player.ParserTags(parse);
	parse = naga.ParserTags(parse, "n");
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");

	if(party.Num() == 2)
		parse["comp"] = party.Get(1).name;
	else if(party.Num() > 2)
		parse["comp"] = "your companions";
	else
		parse["comp"] = "";

	Text.Clear();
	parse["themItL"] = player.LowerBodyType() != LowerBodyType.Single ? "them" : "it";
	Text.Add("The naga’s tail slithers over your [legs], pinning [themItL] to the sand under its considerable weight. She swivels her humanoid upper body until her dripping, scaly slit is on display inches from your lips. Droplets of her juice fall into your open maw, the taste making you flush with warmth. Instinctively, you extend your tongue and raise your head until your mouth makes contact with the naga’s tight pussy. Her hands treat her bulging erections to a few lazy strokes as you begin your oral ministrations.", parse);
	Text.NL();
	Text.Add("Piercing inside her, your [tongue] explores, probing her every nook and cranny. The naga’s cunt contracts suddenly as you tongue a bump near the top of her slit, and you know you must have found her clit, or at least its serpentine equivalent. A fresh squirt of her juices enters your mouth, and you gulp it down eagerly, continuing to please the conquering snake as well as you can.", parse);
	Text.NL();
	Text.Add("Meanwhile, the naga begins preparing your [cocks] to use as she pleases. <i>“We are going to have so much fun, pet, I promise. You’ll enjoy it almost as much as I will.”</i> She takes[oneof] your [cocks] in her smooth hands and begins to stroke it gently with slow and steady motions. Her tongue slips from her mouth, soaked in her saliva, and begins to coil around your shaft. Its surface tickles the sensitive flesh of your head, your hips spasming in response, your body attempting to thrust your manhood toward the source of your pleasure, but its attempt fails. Your [legs] [isAre] still pinned by the naga’s lower half.", parse);
	Text.NL();
	Text.Add("The silken palms caressing your [cock] slide down to its base, their grip tightening somewhat. You soon realize that she simply moved her hands out of the way for her tongue to snake its way around most of your length, gently squeezing your member with each additional coil added to your [cock]’s fleshy wrapping. The serpent giggles as you squirm in pleasure, moaning into her cunt as you continue to pleasure it.", parse);
	Text.NL();
	Text.Add("The laughter subsides as she brings her mouth down to bear on your already tongue-covered cock, engulfing it in heat and moisture. The first few inches of your [cock] slip easily into her maw, passage aided by the slippery, exposed underside of her [ntongue]. ", parse);
	if(p1cock.length.Get() < 13) {
		Text.Add("Your shaft fits comfortably within the naga’s mouth, completely enveloped by her extremely flexible tongue.", parse);
	}
	else {
		Text.Add("The head of your manhood makes contact with the back of the naga’s mouth, the entrance to her throat beckoning. You feel her jaw shifting as she changes position slightly, lining herself up with the remaining length of your [cock]. With one smooth motion, she dives forward, taking the rest of you into the tight confines of her gullet. You cry out in pleasure, the sound muffled by the ocean of pussy you’re drowning in.", parse);
	}
	Text.NL();
	if(player.FirstVag()) {
		parse["cl"] = p1cock != player.FirstVag().clitCock ? ", one hand zeroing in on your [clit] and pinching it gently" : "";
		Text.Add("With no exposed skin left on your cock, the naga’s [nhand]s roam down to your [vag][cl]. Your hips redouble their efforts to grind into the source of stimulus to no avail. Two fingers from her other [nhand] slip between your folds into your [vag], rubbing your inner walls and probing around for your g-spot. You let out a loud, muffled moan once she finds it, causing her to start vigorously rubbing it and prompting your body to quake with feminine bliss.", parse);
		Text.NL();
	}
	if(player.HasBalls()) {
		Text.Add("Satisfied with her current efforts to stimulate your genitals, the naga decides to turn her dexterous hands on your [balls]. She softly cups your sack, ever so gently caressing your jizz factories. Switching gears, she wraps one [nhand] around the base of your scrotum and tugs gently while lightly dragging the clawed nails of her other over its stretched surface. Her ministrations stop just short of causing any pain, and instead cause your [balls] to surge with intense, animalistic need. You let loose a muffled roar of pleasure, redoubling your oral efforts on the scaly slit before you.", parse);
		Text.NL();
	}
	Text.Add("The sultry serpent’s [ntongue] pulsates far stronger now than it did before she swallowed your [cock]. Rhythmic contractions of the forked appendage begin to milk your meat, waves of pleasurable pressure starting at its base and squeezing their way to the head. The naga begins to pull back, her mouth forming a tight seal as she withdraws, the additional constriction almost pushing you over the edge. She continues her tongue’s ministrations as your blowjob intensifies, its coils proving no obstacle to the pleasure of her lips.", parse);
	Text.NL();
	parse["b"] = player.HasBalls() ? Text.Parse(" as pressure builds to unbearable levels in your [balls]", parse) : "";
	Text.Add("Soon, the majority of your [cock] escapes the naga’s mouth, although still being stimulated by her prehensile penis-licker. You moan as she lowers herself again, returning your shaft to the warmth inside of her with the speed you’d expect from a snake’s bite. Without stopping at the base this time, she blows you with increasing speed, waves of ecstasy from your [cock] wracking your body[b].", parse);
	Text.NL();

	let cum = player.OrgasmCum();
	parse["cum"] = cum > 6 ? "explode" :
	               cum > 3 ? "erupt" :
	               "burst";
	Text.Add("You can only take the oral onslaught for so long before you give in, your [cocks] throbbing wildly as [itThey] [cum][notS]. The serpent’s throat eagerly sucks down your cum as quickly as it escapes your pulsating member. ", parse);
	if(player.NumCocks() > 1)
		Text.Add("Your neglected [cocks2] unleash[notEs2] [itsTheir2] payload into open air, your spunk landing mostly on the scaly tail still resting on your [legs]. ", parse);
	Text.Add("You keep cumming for what seems like forever, the expert oral skills of the naga coaxing plenty of seed from your loins. The suction coming from the vacuum seal of her mouth doesn’t diminish until the flow of your jizz has entirely abated.", parse);
	if(player.HasBalls())
		Text.Add(" By the end of your orgasm, your [balls] feel almost painfully empty, drained completely of your spunk.", parse);
	Text.NL();
	Text.Add("The naga withdraws completely from your [cock] as she retracts her absurdly long tongue and lifts her soaked slit away from your now-drenched face. She turns to face you as you lift your torso, a slightly disappointed look in her [neyes]. <i>“So little stamina, pet!”</i> she pouts melodramatically. <i>“That’s alright, I’m well equipped for situations like this. Don’t worry, this will only hurt for a second...”</i> You catch a mischievous glint in her eyes, the snake’s gaze meeting yours as she brings her mouth down to the base[s] of your shaft[s].", parse);
	Text.NL();
	Text.Add("Your eyes widen as the naga pulls her lips back in a wicked grin, exposing a pair of fangs protruding from her upper jaw. With no further warning, she sinks them into your crotch. You feel searing pain for a split-second, but it subsides immediately, replaced by a warm, tingling sensation as the naga pumps venom into your body. You gasp, losing your breath as your [cocks] surge[notS] with renewed vigor, swelling beyond [itsTheir] normal limit[s] while bobbing wildly and squirting pre-cum. You realize [itsTheyve] actually grown longer and thicker than [itThey] [wasWere] moments ago! A haze of lust fills your mind as your libido goes into overdrive almost like if you hadn’t felt release in months.", parse);
	Text.NL();

	let first = GameCache().flags["NagaVenom"] == 0;
	GameCache().flags["NagaVenom"]++;

	if(player.HasBalls()) {
		Text.Add("Your [balls] churn and swell, and you can almost <i>feel</i> them overflowing with fresh spunk, coaxed into creation by the venom flowing through your loins. They begin to ache with fullness, engorged beyond their usual size from the excess load they bear.", parse);
		Text.NL();
	}
	if(player.FirstVag()) {
		Text.Add("Your [vag] spasms, a deluge of lubricating juices flowing from your mostly neglected cunny. An intense need to be fucked by her pair of enormous erections washes over you, your vaginal walls squeezing uncontrollably at the emptiness inside. You squirm with anticipation, although from her efforts so far, you know the snake has other plans for you.", parse);
		Text.NL();
	}
	Text.Add("<i>“There, isn’t that better?”</i> the naga asks with a wide smile on her lips and a trickle of venom rolling down her cheek. Quivering uncontrollably with artificial aphrodisia and very nearly senseless with pleasure already, you can muster only a shaky nod as a response. <i>“Very good, pet! Now that we’ve taken care of that little problem, it’s time to get down to business...”</i>", parse);
	Text.NL();
	Text.Add("The naga reaches up to your shoulders and grasps them gently, shifting her weight as she slowly pushes your upper body down until your back rests on the sand once again. Her shapely breasts press against your [breasts], her cocks smearing pre on your abdomen as they slide unused between your bodies.", parse);
	if(player.FirstBreastRow().Size() > 3) {
		Text.Add(" You moan as your [breasts] squeeze against the naga’s, your [nips] rubbing sensually against her [nnips].", parse);
		if(player.Lactation())
			Text.Add(" The breast-on-breast pressure is enough to cause your [nips] to squirt some of your milk into the fleshy pillow fight. Noticing the extra lubrication, the serpent-woman smiles lasciviously and makes extra effort to wriggle her sizable breasts around, spreading your cream all over both of your mounds and all over your torso.", parse);
	}
	Text.NL();
	Text.Add("Your serpent-lover presses her lips to yours, kissing you fervently as her hands align[oneof] your [cocks] with her practically gushing slit. You return the lip-lock as well as you can considering your lust-addled state, wanting nothing more than to be used by the half-snake temptress; it isn’t long before you get your wish.", parse);
	Text.NL();
	Text.Add("The naga’s [ntongue] plunges between your lips at the same time as she lowers her scaled pelvis, the saliva-slicked tip of your [cock] parting the lips of her wet, welcoming slit. Her serpentine pussy is unbelievably tight, squeezing your overly engorged tip greedily as her inner walls begin to undulate. Her tongue explores your mouth at roughly the same pace as she pushes her [nvag] down, vigorously French kissing you while inviting your [cock] into the warmth of her cunt, accepting inch after inch of your extra swollen, throbbing shaft.", parse);
	Text.NL();

	Sex.Vaginal(player, naga);
	naga.FuckVag(naga.FirstVag(), p1cock, 4);
	player.Fuck(p1cock, 4);

	Text.Add("The inside of the snake’s box is vice tight around your abnormally bulging member, and her inner walls massage you unrelentingly as her periodic thrusts completely lodge your newly enlarged maleness into her serpentine love tunnel. Her vaginal muscles go wild, beginning to milk your [cock] thirstily as juices gush out and coat your crotch to a lust-slick shine.", parse);
	Text.NL();
	Text.Add("You moan throatily into the naga’s passionate kiss as you feel another orgasm coming over you, but after over a dozen gigantic waves of pleasure crashing over your entire body, you feel no release. Your [cocks] pulsate[notS] wildly as [itThey] try to climax, your muscles spasming but failing to expel any cum.", parse);
	if(player.HasBalls())
		Text.Add(" Your [balls] clench painfully, overfilled with semen but helpless to fulfill your body’s need to ejaculate.", parse);
	Text.NL();
	if(first) {
		Text.Add("You feel the naga laughing as she pulls her lips away from yours, taking her time to peel her tongue from yours. Her cheeks flush hotly, her face adopting an expression of wanton, lustful hunger. <i>“Oh, I suppose I should have mentioned,”</i> she explains flatly with an almost malicious, carnal expression on her face. <i>“My venom gives me <b>complete</b> control of your climax, pet. You don’t get to cum until I do.”</i> she continues, licking her lips for good measure. <i>“Don’t worry though, it only works for a while each time I cum, and it doesn’t neutralize the... <b>other</b> effects of the venom. You’ll be hard for a good, long, time...”</i>", parse);
		Text.NL();
		Text.Add("The naga’s worrying explanation trails off as she leans down to resume the lip-lock, redoubling her vaginal milking and now adding short, powerful thrusts to the sensory onslaught her animalistic cunt is delivering to your [cock].", parse);
	}
	else {
		Text.Add("You feel the naga laughing as she pulls away from the lip-lock, her tongue playing over your lips as she retracts it enough to speak. <i>“Yes… you remember this part, don’t you, pet?”</i> You vaguely remember your scaly mistress’ explanation from your last encounter, and you steel yourself for the agonizing buildup to come. You’ll only get to cum whenever she does, and you try to brace yourself for being on edge until then.", parse);
		Text.NL();
		Text.Add("Seeing your understanding, she smiles at you, leaning in close. <i>“Good… I like it when my toys are eager to please me. We’re going to have such a good time making me cum...”</i> she coos, resuming her forceful kiss. Her inner walls ripple, their surfaces gripping your [cock] tightly as she begins to rock her serpentine pelvis up and down.", parse);
		Text.NL();
		Text.Add("You moan lustily as the naga subjects your expanded erection to the ecstatic sensations of her beastly pussy’s milking and her penetrating thrusts simultaneously. You know the pleasure will continue to rise, coming closer and closer to breaking your mind until the snake herself climaxes.", parse);
	}
	if(player.FirstBreastRow().Size() > 3) {
		Text.Add(" Her soft, enticing breasts rub more intensely against your [breasts] as she begins moving her torso. ", parse);
		if(player.Lactation())
			Text.Add("Your milk-slicked bodies glide over each other with blissful ease, every square inch of your titflesh surging with pleasure at the smooth sliding of the naga’s sizable mounds over yours. ", parse);
		Text.Add("The snake’s mouth muffles your whorish moan as the sensation of your [nips] rubbing against her [nnips] adds yet another stimulus to the list of overwhelming pleasures you’re receiving.", parse);
	}
	Text.NL();
	parse["tightLooseGaping"] = player.Butt().Tightness() < Orifice.Tightness.tight ? "tight" :
	                            player.Butt().Tightness() < Orifice.Tightness.loose ? "loose" : "gaping";
	Text.Add("You feel a shifting sensation in the sand beneath you as you realize the naga is moving her tail. A few seconds later in your ongoing sexual overload, you feel a tickle on your [anus]. Realizing with shock what’s about to happen, you groan into your lover’s lips, half of you pleading for mercy and the other half craving ever more pleasure. As the scaly tip of the naga’s scaly appendage breaches your [tightLooseGaping] pucker, your moan turns into a muffled scream.", parse);
	Text.NL();
	Text.Add("The serpentine tail has a relatively thin point, but the scales themselves make the penetration somewhat unique. You can feel each scale at first, the naga sliding her tail in slowly and purposefully, swirling around the tip to feel your inner walls. As her snake appendage enters deeper into your anal passage, the thickness increases, becoming far thicker than most cocks in short order.", parse);
	Text.NL();
	Text.Add("The tail twists and turns as the snake-lady continues to use your venom-laced [cock] to stuff herself, her lips and tongue unrelenting in their conquest of your mouth. Suddenly, the tail’s thickness brushes against your prostate and you experience another agonizing non-climax, your orgasm denied again by her aphrodisiac toxin. Your [cock] bulges further, throbbing and pulsating within the naga’s obscenely talented cock-milker of a cunt.", parse);
	Text.NL();
	Text.Add("For her part, your serpent mistress notices your plight, and lifts her face inches away. <i>“Ahh… There we are, pet. I absolutely <b>love</b> to watch you squirm like that, it makes me <b>so</b> hot. I think you’ll get your first reward soon...”</i> she coos, her features wearing a mask of lewd dominance as she licks her lips. She makes eye contact, or at least as much as can be made while your [eyes] are rolled back in their sockets from your second lack of release.", parse);
	Text.NL();
	Text.Add("<i>“<b>Yes!</b> Just like that! That face is <b>perfect!</b>”</i> she shouts, pulling back into a vertical position and clutching one of her monstrous members in each hand. She picks up her pace, madly hammering your [cock] into her almost torturously tight pussy, and starts to furiously jack off her towering twin cocks. Moments later, you feel your engorged dick squeezed viciously, and the naga’s slit and shafts all erupt with fluid.", parse);
	Text.NL();
	Text.Add("Geysers of alabaster jizz stream from her massive pricks, most of it soaring over you onto the desert sands with the force of her climax, but some lands on your [breasts], covering them in a thick coat of hot, sticky cum. A flood of femcum bursts from the naga’s slit, and as you feel it seep into the skin of your [cock] and crotch, your body convulses, your denied orgasms coming back to you with a vengeance and bringing you to a furious double climax.", parse);
	Text.NL();

	cum = player.OrgasmCum(3);

	if(player.HasBalls()) {
		Text.Add("Your [balls] tighten and you feel the need within them overflow as your climax begins. ", parse);
	}
	Text.Add("Your [cock] swells impossibly within the confines of the naga’s twat, an enormous load of jizz erupting deep into the monstrous passage that is the snake’s vagina. You’re rocked by pleasure many times what you’re used to from cumming, and you lose track of how long your orgasm continues, your body spasming as you shoot a seemingly endless amount of spunk into the sweltering serpent cunt.", parse);
	if(player.NumCocks() > 1) {
		Text.NL();
		Text.Add("Your other [cocks2], thus far neglected by the naga, fire[notS2] jets of semen into the air, soaking skin, scales and sand alike with huge globs of your thick cum.", parse);
	}
	else {
		Text.Add(" The pressure on your [balls] is finally released. Your reservoirs are once again drained and you relish in the comfort of having empty balls this time.", parse);
	}
	Text.NL();
	if(player.FirstVag()) {
		Text.Add("The pleasure surging through your body is so intense that your [vag] reaches its own climax despite its total neglect since the naga started to ride you. Fem-spunk gushes from your entrance as you feel sparks of pleasure from every nerve in your cunny arcing to your brain.", parse);
		Text.NL();
	}
	if(player.Lactation()) {
		Text.Add("Your [breasts] are far from immune to the ecstasy coursing through you, and your hands leap to the overly sensitive, serpent cum-covered flesh of your [nips] and begin to fondle them out of pure animal instinct. You pinch them with sensuous fervor, causing streams of your own brand of cream to spurt out into the desert air, soaking your upper body and the sand below.", parse);
		Text.NL();
		Text.Add("As your orgasmic spasms dissipate and you regain some degree of motor control, you can’t help but notice that plenty of the milk has mixed with the naga’s cum, and you scoop up a handful, pouring it into your thirsty mouth and savoring the uniquely sexual combination of flavors. The serpent notices and licks her lips, taking great pleasure in your lewd display.", parse);
		Text.NL();
	}
	Text.Add("When you’ve finally ridden out the mind-wracking pleasure of the double orgasm you’ve just been treated to, you notice that the naga hasn’t moved. She’s slowly stroking her still-stiff bitch-breakers and waiting with a licentious grin for realization to dawn on you. Your [cock] is still rock-hard, swollen, and enveloped in the titillating tightness of the snake’s cunt. When she sees the look in your eyes, the naga bursts out in wicked laughter.", parse);
	Text.NL();
	Text.Add("<i>“Oh, you thought we were done?”</i> The naga asks rhetorically, leaning in to whisper in your ear. <i>“We. Are. Just. Getting. Started. <b>Pet.</b>”</i>", parse);
	Text.Flush();

	TimeStep({hour: 2});

	let cocks = player.AllCocks();
	let len = false, thk = false;
	for(let i = 0; i < cocks.length; i++) {
		let inc  = cocks[i].length.IncreaseStat(50, 3);
		let inc2 = cocks[i].thickness.IncreaseStat(12, 1);
		len = len || inc;
		thk = thk || inc2;
	}
	let grown = len || thk;

	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("<b>Several hours and many, many orgasms later...</b>", parse);
		Text.NL();
		parse["c"] = party.Num() > 1 ? Text.Parse(" with [comp],", parse) : "";
		Text.Add("At some point, the naga literally fucked you unconscious. You awaken[c] sore and drained", parse);
		if(grown) {
			Text.Add(". Inspecting yourself and your possessions, you find that the dose of venom you received seems to have had permanent effects: your flagging [cocks] [hasHave] grown ", parse);
			if(len)
				Text.Add("an inch longer", parse);
			if(len && thk)
				Text.Add(" and ", parse);
			if(thk)
				Text.Add("slightly thicker", parse);
			Text.Add("! You are otherwise unharmed.", parse);
		}
		else {
			Text.Add(", but otherwise unharmed. The effects of the naga’s venom seems to have worn off, your [cocks] shrinking down to [itsTheir] previous size; still huge, but not as ridiculous as before.", parse);
		}
		Text.Flush();

		TimeStep({hour: 1});

		Gui.NextPrompt();
	});
}

//TODO
NagaScenes.DesertWinPrompt = function() {
	let player = GAME().player;
	let party : Party = GAME().party;
	let enc  = this;
	let naga : Naga = enc.naga;
	SetGameState(GameState.Event, Gui);

	let parse : any = {
		master : player.mfFem("master", "mistress")
	};

	parse = player.ParserTags(parse);
	parse["comp"] = party.Num() == 2 ? party.Get(1).name :
	                party.Num() > 2 ? "your companions" : "";

	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("The naga slumps down, defeated. Her upper body falls to the sand with a thump, where she rests, breathing heavily. ", parse);
		if(naga.LustLevel() > 0.75)
			Text.Add("Her cheeks flush deeply with arousal from your battle, her tongue lolling out of her wide-open mouth, giving her a positively whorish countenance. ", parse);
		parse["c"] = party.Num() > 1 ? Text.Parse(", [comp] wandering off to rest and recuperate", parse) : "";
		Text.Add("You take a moment to catch your breath and stow your [weapon][c].", parse);
		Text.NL();
		Text.Add("When you turn your attention back to the naga, she has regained some of her composure, though she’s lost her air of aggressive dominance. Her upper body lies prostrated before you in a gesture of complete submission.", parse);
		Text.NL();
		Text.Add("<i>“Please forgive me, [master]. I had no idea you were this… powerful.”</i> Her surrender is delivered in a breathy, clearly aroused voice, and she licks her lips enticingly when she pauses. It’s blatantly obvious that the naga will let you do whatever you want to her.", parse);
		Text.Flush();

		NagaScenes.DesertWinPrompt2(enc, false);
	});
	Encounter.prototype.onVictory.call(enc);
}

NagaScenes.DesertWinPrompt2 = function(enc : any, hypno : boolean) {
	let player = GAME().player;
	let party : Party = GAME().party;
	let naga : Naga = enc.naga;

	let parse : any = {};

	//[Fuck][Hypnotize][Leave]
	let options = new Array();
	if(player.FirstCock()) {
		options.push({ nameStr : "Fuck & Jerk",
			func : function() {
				NagaScenes.DesertWinFuckJerk(enc, hypno);
			}, enabled : true,
			tooltip : "Pound the naga’s slit while giving her a double handjob."
		});
	}
	if(player.FirstVag()) {
		options.push({ nameStr : "Get fucked",
			func : function() {
				NagaScenes.DesertWinGetFuckedVag(enc, hypno);
			}, enabled : true,
			tooltip : "Take one of the naga’s huge cocks vaginally."
		});
	}
	/* TODO
	options.push({ nameStr : "name",
		func : function() {

		}, enabled : true,
		tooltip : ""
	});
	 */
	if(Jobs.Hypnotist.Master(player)) {
		options.push({ nameStr : "Hypnotize",
			func : function() {
				NagaScenes.DesertWinHypnotizeOwn(enc);
			}, enabled : !hypno,
			tooltip : "Several times during the battle, you’ve caught a familiar glint in the naga’s eyes. Wouldn’t it be fun to show this creature what a true hypnotist can do?"
		});
	}
	else if(Naga.HypnoUnlocked()) {
		options.push({ nameStr : "Hypnotize",
			func : function() {
				NagaScenes.DesertWinHypnotize(enc);
			}, enabled : !hypno,
			tooltip : "Having been on the receiving end of the naga’s hypnotic eyes before, you have a plan on how to turn her powers back on herself..."
		});
	}
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			if(player.LustLevel() > 0.4)
				Text.Add("You decide you’d rather satisfy your own needs elsewhere than with this aggressive snake.", parse);
			else
				Text.Add("You decide it best to leave the serpent to her own depravity.", parse);
			if(hypno)
				Text.Add(" You turn and walk away from the entranced naga.", parse);
			Text.NL();

			let scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Whimpering, she starts to follow you, clearly still hoping for release at your hands. You notice her pursuit and tell her in no uncertain terms that you’re done with her. Just before you turn away again, you notice her slither off, no doubt to look for something else to satisfy her heated loins.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				parse["Master"] = player.mfFem("Master", "Mistress");
				parse["Chuckling"] = player.mfFem("Chuckling", "Giggling");
				Text.Add("<i>“[Master]!”</i> she calls out as you distance yourself. <i>“Wh-what about me?”</i> she asks, confused at being left without release. You tell her that you’re leaving, and she’s free to do as she wishes. Before you can blink, she wraps her hands around her swollen, throbbing cocks and starts masturbating. [Chuckling], you turn away from the perverse spectacle, hearing wet pumping noises as you depart.", parse);
			}, 1.0, function() { return true; });

			scenes.Get();

			Text.NL();

			parse["comp"] = party.Num() == 2 ? party.Get(1).name :
			                party.Num() > 2 ? "your companions" : "";
			parse["c"] = party.Num() > 1 ? Text.Parse(" rejoin [comp] and", parse) : "";
			Text.Add("You[c] leave the defeated naga behind.", parse);
			Text.Flush();

			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "You want nothing more to do with the naga - set her free."
	});
	Gui.SetButtonsFromList(options, false, null);
}

NagaScenes.DesertWinHypnotize = function(enc : any) {
	let player = GAME().player;
	let naga : Naga = enc.naga;

	let parse : any = {};

	parse = player.ParserTags(parse);
	parse = naga.ParserTags(parse, "n");

	Text.Clear();
	Text.Add("Grinning devilishly, you scan the scaly submissive’s jewelry for a large reflective surface. You find what you’re looking for: the centerpiece of her necklace is a wide, mostly-flat golden plate, and you quickly find your face in the reflection. You tell the naga to give it to you. She agrees and quickly removes it, presenting it to you with her head bowed.", parse);
	Text.NL();
	parse["l"] = player.HasLegs() ? " kneel down to" : Text.Parse(" crouch to", parse);
	Text.Add("You use a bit of clothing to give the metal a bit of extra polish. Satisfied with your work, you[l] bring your face level with the naga’s. You align the golden plate with the her eyes and ask if she can see them clearly in the reflection. She says nothing, but nods eagerly. Grinning again, you slide your free hand up to the back of the naga’s head, grasp her hair firmly at the base and order her to use her hypnotic magic on herself.", parse);
	Text.NL();
	Text.Add("You shield your eyes with the other side of the reflective plate, waiting a few moments until the faint glow emanating from her [neyes] disappears. When you make eye contact again, the naga’s magenta eyes are completely lust-crazed, all reason and disobedience gone. Her hands tremble, her body obviously aching for pleasure. The only thing keeping her from furiously masturbating is her hope that you will fulfill her desperate need to be used as a fucktoy.", parse);
	Text.Flush();

	player.subDom.IncreaseStat(75, 1);

	TimeStep({minute : 5});

	NagaScenes.DesertWinPrompt2(enc, true);
}

NagaScenes.DesertWinHypnotizeOwn = function(enc : any) {
	let player = GAME().player;
	let naga : Naga = enc.naga;

	let parse : any = {
		master : player.mfFem("master", "mistress")
	};

	parse = player.ParserTags(parse);
	parse = naga.ParserTags(parse, "n");

	Text.Clear();
	Text.Add("Powerful? She doesn’t know half of it. You motion for her to raise her head and look into your [eyes]. The naga catches her breath in surprise as she’s caught up in your hypnotizing gaze - her own power turned against her. Her eyelids flutter drowsily as she feebly tries to resist you, but after a momentary struggle she’s yours. The naga’s breathing becomes heavy as you pour all your lust-inducing power into her, making her the sex-slave she wished to make you.", parse);
	Text.NL();
	Text.Add("You chuckle in satisfaction as you step back, the naga’s [neyes] now completely lust-crazed and devoid of disobedience. Her chest is heaving, her entire body aching for pleasure, wishing to become your tool to use. <i>“H-how may I serve you, [master]?”</i> she stammers, awkwardly reaching for the rock hard cocks poking out of her genital slit, unable to contain her lust.", parse);
	Text.NL();
	Text.Add("Much better. Now, how should you make your toy pleasure you?", parse);
	Text.Flush();

	player.subDom.IncreaseStat(75, 1);

	TimeStep({minute : 5});

	NagaScenes.DesertWinPrompt2(enc, true);
}

NagaScenes.DesertWinFuckJerk = function(enc : any, hypno : boolean) {
	let player = GAME().player;
	let naga : Naga = enc.naga;

	let p1cock = player.BiggestCock();

	let parse : any = {
		master  : player.mfFem("master", "mistress"),
		biggest : player.NumCocks() > 1 ? " biggest" : ""
	};

	parse = player.ParserTags(parse);
	parse = naga.ParserTags(parse, "n");
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");


	Text.Clear();
	Text.Add("Feeling a distinct tightness in your nether regions, you excitedly remove your equipment, disrobing until you’re completely nude. As soon as [itsTheyre] free, your [cocks] begin[notS] to harden, throbbing at the sight of the scaly slit before you.", parse);
	if(player.NumCocks() > 1)
		Text.Add(" You sigh at the misfortune of only having one hole to use, leaving[someof2] your other cock[s2] in the proverbial lurch, but the promise of that one tight pussy is enough to keep blood rushing to your crotch.", parse);
	Text.NL();
	if(hypno) {
		Text.Add("You inform the naga that you’re going to ravage her tight cunt, to use her like she used you the last time you fell prey to her hypnotic magic. Cheekily, you assure her that she’ll probably get off in the process.", parse);
		Text.NL();
	}
	parse["hypno1"] = hypno ? ", or you’ll find something else to fuck" : "";
	parse["hypno2"] = hypno ? " Please, don’t go! Let me taste your cock - I <b>need</b> it inside me!" : "";
	parse["hypno3"] = hypno ? "subserviently" : "excitedly";
	Text.Add("You present the naga with your[biggest] dick, holding it in front of her gaping mouth. You tell her to finish getting you hard, and quickly[hypno1]. <i>“Yes, [master]![hypno2]”</i> she replies [hypno3], hungrily diving on her appetizer.", parse);
	Text.NL();
	parse["hypno"] = hypno ? ", clouded" : "";
	Text.Add("The naga eagerly wraps your cock’s head first in her tongue, then with her mouth, her lips closing around the bottom of your [cockTip]. She begins to suck vigorously, her lusty[hypno] eyes locked to your gaze as she coaxes your shaft to become more and more rigid. Her [ntongue] plays over the surface of your member as she slides her lips lower, wrapping more of your length with the delightful warmth and moisture of her maw.", parse);
	Text.NL();
	if(p1cock.Len() <= 13)
		Text.Add("Before you know it, the scaly slut takes the entirety of your [cock] into her organic vacuum of a mouth, its insides hot and soft around your member. The suction on your prick intensifies, and she begins to bob her head up and down, blowing you slowly but fiercely. The air is filled with wet slurps and gulps as pre starts to leak from your [cockTip], only to be swallowed almost immediately.", parse);
	else {
		Text.Add("Your [cockTip] bumps against the back of your scaly slut’s throat. Her lips curl slightly - an attempt to smile at you around the thickness of your tool. Her [neyes] flutter closed as she swallows, drawing the next inch of your [cock] into the succulent tightness of her gullet. She opens her eyes as she pushes her head further down, engulfing the rest of your throbbing maleness and forming a tight seal around your base with her mouth.", parse);
		Text.NL();
		Text.Add("She hums lasciviously as she draws her head up, the sensation causing your cock to pulsate with your heartbeat and swell to its full size in no time. She begins to vigorously fellate you, dutifully plunging down your entire shaft with a fierce vigor. She obviously wants to get you hard as quickly as she can, probably to get your manhood inside her slit as soon as possible.", parse);
	}
	Text.NL();
	parse["hypno"] = hypno ? "overflowing with lust" : "glittering with eagerness";
	Text.Add("After scant moments of the naga’s oral ministrations, you’re stiff as iron and ready to plunge into her pussy. You tell the naga to stop and she complies happily, her eyes [hypno]. She makes sure to leave your [cock] glistening with her saliva as she finally peels her tongue away.", parse);
	Text.NL();
	Text.Add("<i>“How would you like me, [master]?”</i> she asks excitedly, one [nhand] caressing one of her round, full breasts. The shapely fingers of her other hand push her slit open and play with her now-exposed engorged clit.", parse);
	Text.NL();
	Text.Add("You order your pet snake to make sure you’re comfortable while you fuck her. She lies back, her upper body mostly flat against the sands below. Raising her crotch into the air, she presents her pussy and displays her stiff cocks as they drool pre-cum down both sides of her scaly hips. Her serpentine appendage provides a perfect resting place for your [hips] while you go to town. You smile and tell her that it will do nicely, while stroking your turgid, moistened shaft. You get into position, lining up the [cockTip] of your [cock] with the naga’s sopping wet snatch and resting your butt gingerly on the smooth scales of her tail.", parse);
	Text.NL();
	Text.Add("Glancing upward, you notice the naga is now vigorously kneading her [nbreasts], pausing only briefly to twist and tweak her [nnips], biting her lower lip each time she does. Her tongue slips out of her mouth to assist her hands in pleasuring her chest. The snake-slut’s wanton display only serves to further fuel your sex drive, and you take the opportunity to shove the first three inches of your rock-hard shaft into her tight, rippling cunt. The naga screams in pleasure as your maleness penetrates her, the walls of her pussy practically vibrating against your [cock].", parse);
	Text.NL();

	let exp = hypno ? 4 : 3;

	Sex.Vaginal(player, naga);
	naga.FuckVag(naga.FirstVag(), p1cock, exp);
	player.Fuck(p1cock, exp);

	Text.Add("You smile at the lust-addled naga as you push in more of your throbbing member. Her lusty wail fades into a moan, her cocks bouncing and squirting pre-cum into the air. You let out a pleasured sigh of your own as you thrust again, pushing the rest of your meaty shaft into the incredible tightness of the serpent’s soaking pussy. As you embed your whole [cock] inside her twat, her vaginal walls ripple, their surfaces rubbing against the skin on your pecker in a wildly twisting and undulating manner.", parse);
	Text.NL();
	if(player.NumCocks() > 1) {
		parse["c"] = player.NumCocks() > 2 ? "the rest of your" : "your other";
		Text.Add("Your unused cock[s2] throb[notS2], slapping against the naga’s scales. You decide it only fair to give <b>some</b> pleasure to [c] prick[s2], and collect some of the snake’s copious pre to use as lube. Smearing your slut’s juice on your shaft[s2], you begin to stroke [itThem2], moaning gently as the sensations combine with the delightful intensity of the tight box your preoccupied pecker is buried in.", parse);
		Text.NL();
	}
	parse["hypno1"] = hypno ? "your temporary slave" : "the serpent";
	parse["hypno2"] = hypno ? "hypno-slut" : "lover";
	Text.Add("Both your voices crescendo as your mutual pleasure intensifies. You slowly pull your member out of her twat, preparing to start fucking [hypno1] in earnest. Your steely phallus drips with a mixture of your [hypno2]’s saliva and pussy juices, and slides out of her passage with rapturous ease. ", parse);
	if(hypno)
		Text.Add("Despite the ample lubrication, it feels like the scaly slut is trying desperately not to let your [cock] leave her cunt. Her vaginal muscles clutch, squeezing fervently on your erection as if to trap it deep inside, but her efforts prove futile. ", parse);
	Text.Add("You let out a long, low moan while you savor the sensation, a mere prologue to the pleasure you’re about to feel.", parse);
	Text.NL();
	Text.Add("Taking the briefest of moments to catch your breath, you make eye contact with the naga. She licks her lips, returning your gaze with half-closed, lust drunk eyes. <i>“", parse);
	if(hypno)
		Text.Add("I want you <b>soooo</b> bad, [master]! Please, fuck me hard, pound my tight little snake pussy <b>RAW!</b>", parse);
	else
		Text.Add("Please… p-please just fuck me already!", parse);
	parse["hypno"] = hypno ? "yells in a display of carnal servitude" : "moans pleadingly";
	Text.Add("”</i> she [hypno].", parse);
	Text.NL();
	parse["hypno"] = hypno ? "licentious" : "desperate";
	parse["slap"] = player.IsGoo() ? "wet squelch" : "loud slap";
	Text.Add("Hearing a [hypno] plea like that, your [cock] surges with newfound ardor, and you promptly buck your hips, burying your tool inside the snake until your [thighs] hit her tail with a [slap]. Burning with your own lust, you vigorously fuck her, fully impaling the naga on your cock with each thrust. Her hands clench at her [nbreasts], soft titflesh bulging between her fingers as she moans in sexual bliss.", parse);
	Text.NL();
	Text.Add("The naga’s pair of monstrous shafts throb and you can’t resist the opportunity to play with such eager cocks. She shrieks in ecstasy as you grip their bases and her cunt constricts, becoming even tighter just as you hilt yourself inside her once again. You slide your hands up her pre-cum slicked peckers, barely able to wrap your fingers around their girths.", parse);
	Text.NL();
	parse["chuckle"] = player.mfFem("chuckle", "giggle");
	Text.Add("You [chuckle] as you begin to jack off the serpentine slut, at first keeping time with your thrusts but soon increasing and varying the pace, giving the naga distinctly different stimuli to deal with. Her whole body quakes, her mind struggling to focus on anything but the triplicate sensations she’s experiencing. Her pussy clenches forcefully, stopping your thrust in place while the rhythmic contractions of her vaginal muscles assail your maleness with waves of obscene pleasure.", parse);
	Text.NL();
	Text.Add("The tight, milking sensations on your [cock] build to a fever pitch, and you feel pleasure flooding your loins. ", parse);
	if(player.HasBalls()) {
		let sacksize = player.Balls().SackSize();
		parse["sack"] = sacksize < 4 ? "tight pouch" :
		                sacksize < 8 ? "plump sack" : "heaving nutsack";
		Text.Add("Your [sack] clenches around your [balls] as you practically feel your spunk surging to your buried prick. ", parse);
	}
	parse["hypno"] = hypno ? "ensorcelled, " : "";
	Text.Add("The naga’s [hypno]wanton eyes roll back in their sockets and you feel her thick cocks begin rapidly pulsating as the walls of her vice tight pussy relent. You seize the opportunity to hilt yourself inside her as you reach your own climax.", parse);
	if(player.FirstVag())
		Text.Add(" Your clit presses against her scaly tail and you grind your hips, sending jolts of ecstasy to your unused [vag], inviting it to the pleasure party your cock[s] [isAre] about to throw.", parse);
	Text.NL();

	let cum = player.OrgasmCum();

	Text.Add("The snake screams, her twin shafts bulging obscenely as they erupt; thick globs of her off-white jizz soar through the desert air to either side of her. You feel your [cock] following suit, injecting your own steaming seed deep inside the naga’s love tunnel. ", parse);
	if(player.NumCocks() > 1) {
		parse["hypno"] = hypno ? "slave" : "pet";
		Text.Add("Your loose cannon[s2] fire[notS2] [itsTheir2] payload[s2], shooting arcing ropes of your creamy jism into the air. You and your scaly [hypno] resemble a cum-spewing fountain, showering the desert in the fruits of your spontaneous tryst. ", parse);
	}
	Text.Add("Gushing with its own climax, the serpent’s tight cunt soaks your cock ", parse);
	if(player.HasBalls())
		Text.Add("and [balls] ", parse);
	Text.Add("in slick, warm, liquid orgasm.", parse);
	if(cum > 3)
		Text.Add(" Some of your own cum spills out alongside it, the naga’s love tunnel too tight to contain your ample discharge.", parse);
	Text.NL();
	if(player.FirstVag()) {
		parse["cum"] = cum > 6 ? "like a waterfall" :
		               cum > 3 ? "like a river" : "in a trickle";
		Text.Add("As if your serpent lover’s orgasm presented a challenge, your unfilled [vag] releases a torrent of femcum, spilling down the naga’s tail [cum]. Your body quakes and you scream, throwing your head back in a rush of dual orgasmic euphoria.", parse);
		Text.NL();
	}
	parse["hypno"] = hypno ? " entranced" : "";
	Text.Add("Utterly spent, the[hypno] naga loses consciousness, collapsing to the sand. You free your softening cock from the still-tight confines of the sleeping naga’s pussy. Exhausted yourself, you gather your discarded clothing and get dressed, shaking the sand out as you go.", parse);
	Text.Flush();

	TimeStep({hour: 1});

	Gui.NextPrompt();
}

NagaScenes.DesertWinGetFuckedVag = function(enc : any, hypno : boolean) {
	let player = GAME().player;
	let party : Party = GAME().party;
	Text.Clear();

	let naga : Naga = enc.naga;

	let p1cock = player.BiggestCock();
	let vag = player.FirstVag();

	let parse : any = {
		master  : player.mfFem("master", "mistress"),
		biggest : player.NumCocks() > 1 ? " biggest" : ""
	};

	parse = player.ParserTags(parse);
	parse = naga.ParserTags(parse, "n");
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse["a"] = player.NumCocks() > 1 ? "" : " a";
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");

	parse["hypno1"] = hypno ? "compliant" : "lusty";
	parse["hypno2"] = hypno ? "obediently" : "excitedly";
	Text.Add("Your eyes settle on the naga’s pair of fat, pulsating cocks and you decide that one of them will do a fine job of satisfying the desire building in your [vag]. Biting your lower lip softly as you disrobe, you inform the [hypno1] serpent of your intention to ride her and she nods [hypno2].", parse);
	Text.NL();
	parse["hypno1"] = hypno ? "command" : "instruct";
	parse["hypno2"] = hypno ? "slave" : "pet";
	parse["c"] = vag.clitCock ? "" : Text.Parse(" sucking on your [clit] and", parse);
	parse["l"] = player.HasLegs() ? "to your knees" : "down";
	Text.Add("Once fully nude, you [hypno1] your scaly pet to lie flat on her back and she complies without hesitation. You move to where her head rests on the sand and drop [l] above her face. Your attention drifts to her chest and her luscious, heaving tits as they quiver in time with her shallow breathing, just begging to be toyed with. Far be it for you to pass up a chance to fondle them, you reach down and grab a handful of soft titflesh in each hand as you continue lowering your [butt] toward your [hypno2]’s face. Your backside makes contact with her smooth skin and you press the lips of your [vag] against the naga’s mouth, moaning quietly when she responds by happily[c] plunging her tongue between your folds.", parse);
	Text.NL();

	Sex.Cunnilingus(naga, player);
	naga.Fuck(null, 1);
	player.Fuck(null, 1);

	parse["l2"] = player.HasLegs() ? "Bending forward" : "From your prone position atop your scaly lover";
	Text.Add("You caress the snake-slut’s supple breasts while she dutifully stimulates your cunt, moistening it with both her warm saliva and your own juices. As soft and pleasant as they are to grope, you realize that you’d better do some lubricating of your own. [l2], your gaze falls upon on her pair of impressive peckers, both throbbing and oozing steady streams of pre-cum. You reach out for the nearest of her cocks with your hands while moving your face toward her other member.", parse);
	Text.NL();
	Text.Add("As you take hold of her cocks, one with both hands and the other with your lips, the naga moans whorishly into your [vag]. The vibration causes you to let out your own pleasured sigh as your vaginal muscles tighten around the snake-like tongue currently exploring your depths. Your mouth widens around the bulbous head of the cock you’re kissing, taking as much of it into your maw as you can. The taste of her pre-cum soaks your [tongue] and you feel your cheeks blushing hotly as you swallow more of her thick shaft.", parse);
	Text.NL();

	Sex.Blowjob(player, naga);
	player.FuckOral(player.Mouth(), naga.FirstCock(), 1);
	naga.Fuck(naga.FirstCock(), 1);

	Text.Add("Your hands get to work smearing the naga’s other cock with its own pre, then massaging her length with tight, slow strokes. ", parse);
	if(p1cock)
		Text.Add("Your [cocks] twitch[notEs], responding to the pre you’re swallowing, first with droplets, then with[a] stream[s] of [itsTheir] own slick juice. ", parse);
	parse["hypno1"] = hypno ? "entranced" : "lusty";
	Text.Add("The [hypno1] serpent’s oral ministrations become faster and more forceful, clearly repaying your efforts on her pulsating pricks. Your only response is to force the rest of her member down your throat, earning an intense moan into your [vag]. With that, you decide you’re both ready for the main event.", parse);
	Text.NL();
	parse["hypno1"] = hypno ? "bewitched" : "wanton";
	parse["c"] = player.FirstCock() ? Text.Parse(", your dripping [cocks] bobbing in time with each movement you make", parse) : "";
	Text.Add("Lifting your face from the naga’s crotch, you leave her cock drenched in a mixture of pre-cum and your spit. Satisfied with the wet sheen coating her girthy erection, you raise your hips off of her face, hearing her inhale deeply, finally given a clear breath. Smiling down at her [hypno1] eyes and face covered in your juices, you stride over to her crotch[c].", parse);
	Text.NL();
	parse["hypno1"] = hypno ? ", hypnotized" : "";
	parse["cl"] = player.FirstVag().clitCock ? "" : Text.Parse(". As more of her length passes into your love tunnel, you reach down to your [clit] and begin rubbing it slowy", parse);
	Text.Add("Lowering yourself once more toward your scaly[hypno1] lover, you crouch down until the tip of the cock you fellated grinds against the soaked entrance to your [vag]. Both of your voices rise in a shared exaltation of pleasure as you push your hips further down, spearing yourself on the naga’s huge member[cl]. Your voice full of passion, you cry out, feeling the rush of a minor vaginal orgasm from the thickness of the invader inside you.", parse);
	Text.NL();

	Sex.Vaginal(naga, player);
	player.FuckVag(player.FirstVag(), naga.FirstCock(), 2);
	naga.Fuck(naga.FirstCock(), 2);

	if(player.FirstCock()) {
		parse["y"] = player.NumCocks() > 1 ? "One of y" : "Y";
		parse["c"] = player.NumCocks() > 1 ? " biggest" : "";
		let len = p1cock.Len();
		parse["len"] = len < 13 ? "completely dwarfed by" :
		               len < 23 ? "barely comparing to" :
		               len < 38 ? "competing nicely with" : "dominating";
		Text.Add("[y]our [cocks] brush[notEs] against the naga’s unengaged prick and you let out a devious chuckle. You move your hands to the convergence of your cocks, aligning them and pressing them together as you continue to slide down her other shaft. Your pricks rub together, your[c] tool [len] the length of hers, and you moan as you smear pre-cum from both of your members along their surfaces.", parse);
		Text.NL();
	}
	Text.Add("Your [butt] makes contact with scaly hips, and you delightfully realize that you’ve taken the naga’s cock to the hilt. You lean forward to plant a kiss on her gaping, panting mouth, which she returns with lusty fervor.", parse);
	if(player.FirstCock())
		Text.Add(" Your [cocks] [isAre] pressed against her girthy length between your bodies - the tightness between your waists is incredible. Fresh pre-cum leaks into the space between you and your midriffs become slick and warm with the combination of your juices.", parse);
	Text.NL();
	Text.Add("Full of pulsating snake-staff, you hum elatedly into the kiss you're sharing with the slutty serpent. Crossing your arms behind her neck, you slide your [hips] forward, inching her thickness out of you ever so slightly. ", parse);
	if(player.FirstCock()) {
		parse["y"] = player.NumCocks() > 1 ? "Each of y" : "Y";
		Text.Add("[y]our well-slicked pecker[s] rub[notS] sensually along the underside of hers as you thrust your pelvis up along her pre-cum lubed midsection. ", parse);
	}
	parse["hypno1"] = hypno ? "slave" : "partner";
	parse["c"] = player.FirstCock() ? " other" : "";
	Text.Add("Breaking the kiss with a gasp, you cry out as the sensation of your [hypno1]’s[c] girthy member being extracted briefly overcomes you. Your tunnel squeezes the naga’s shaft greedily even as you drag yourself off of its throbbing heat.", parse);
	Text.NL();
	if(player.FirstCock())
		Text.Add("Pre-cum spurts forth from your [cocks] like[a] fountain[s] as you continue to grind [itThem] against your pet’s exposed erection, soaking her cleavage with your gooey lube. ", parse);
	parse["c"] = player.FirstCock() ? " and your well-lubricated frotting" : "";
	Text.Add("You share a quiet moan with the scaly temptress as you almost completely empty yourself of naga-dick, leaving only her engorged cockhead inside your [vag]. The sound becomes an ecstatic roar as you reverse the motion of your [hips], impaling yourself once again with that thick, turgid member that your cunt craves so much. The wet, slippery sounds of penetration[c] provide the background music for the impassioned duet you’re singing with the naga. ", parse);
	Text.NL();
	Text.Add("Your voices only grow louder as you find a rhythm and start riding the serpentine slut in earnest. You piston your [hips] to an inaudible beat, your [vag] swallowing the entirety of her huge, girthy prick in each powerful backward thrust. Your inner muscles fight to contain that hot, bulging cock as you pull it out to the head with each measured forward movement.", parse);
	Text.NL();
	if(player.FirstCock()) {
		Text.Add("As your pussy is pleased by one of the naga’s shafts, your own [cocks] glide[notS] alongside her other tool and into the pre-cum drenched valley of her cleavage. The naga’s meat is wedged between the undersides of her breasts, and you can clearly see squirts of her musky fluid shooting between them and onto her neck in time with your crown[s] rubbing along her length.", parse);
		Text.NL();
	}
	Text.Add("It occurs to you in your lust for ever-greater pleasure that your lover has a long, prehensile appendage she isn’t making proper use of right now and you have an unfilled hole...", parse);
	Text.Flush();

	NagaScenes.DesertWinTailpeg({naga : naga, hypno : hypno,
		next : function(tailPeg : boolean) {
			let sens = 0;
			if(tailPeg) sens++;
			if(player.FirstCock()) sens++;

			parse["sens"] = sens >= 2 ? " triplicate" :
			                sens >= 1 ? " duo of" : "";
			Text.Add("Your intense tryst with the naga intensifies until you’re both nearly insensate with pleasure. The[sens] sensations bring you over the edge and you feel your pet’s cocks throb with impending release. Letting yourself go with an animalistic cry of passion, your vaginal muscles clench, squeezing the turgid, throbbing erection in you as if to milk it dry of its precious seed. For her part, the naga bucks her hips, hilting herself inside you as her pricks swell with her imminent ejaculation. You grab your lover’s supple, bountiful breasts and squeeze her nipples tightly as you lose yourself, cumming hard.", parse);
			Text.NL();

			NagaScenes.Impregnate(player, naga, PregnancyHandler.Slot.Vag);

			Text.Add("Your [vag]’s orgasm wracks your form, and your upper body curves backward from your [hips] to your head, your spasming muscles locking you into a crescent shape. The naga screams in delight as your fingers, still locked around her [nnips], pull roughly on her [nbreasts], adding to her own overflowing pleasure. You feel long, intense surges of warmth travel through the cock lodged inside your cunt, the snake-slut pumping a huge amount of her cum straight into your welcoming tunnel.", parse);
			Text.NL();

			let cum = player.OrgasmCum();

			if(player.FirstCock()) {
				parse["c"] = player.NumCocks() > 1 ? "Each of y" : "Y";
				Text.Add("[c]our [cocks] and the naga’s other cock erupt at the same time, firing torrents of mixed seed between her breasts and straight at her face.", parse);
			}
			else
				Text.Add("The naga’s loose cock blows its load at the same time, blasting streams of sperm straight through her cleavage and onto her face.", parse);
			parse["hypno"] = hypno ? " in a lust-clouded frenzy" : "";
			Text.Add(" She’s quickly coated in layer after layer of thick cum, hungrily slurping up any landing near her mouth and swallowing as much as she can[hypno].", parse);
			if(player.FirstCock() && player.HasBalls())
				Text.Add(" You don’t stop blasting her face with your pearly jizz until you’ve completely drained your [balls].", parse);
			Text.NL();
			Text.Add("Your orgasm continues for what feels like hours, your muscles slowly releasing you from your ecstasy-induced paralysis. The naga lies on the ground below, knocked unconscious by her own furious climax. ", parse);
			if(tailPeg)
				Text.Add("You carefully remove her tail from your back door, sliding it from your [anus] rather unceremoniously and letting it land with a soft thud on the sand. ", parse);
			parse["comp"] = party.Num() == 2 ? party.Get(1).name :
			                "your companions";
			parse["c"] = party.Num() > 1 ? Text.Parse(", and rejoin [comp]", parse) : "";
			Text.Add("Gathering your senses and your equipment, you leave the defeated serpent woman behind and set about cleaning and clothing yourself[c].", parse);
			Text.Flush();

			TimeStep({hour: 1});

			Gui.NextPrompt();
		}
	});
}

NagaScenes.DesertWinTailpeg = function(opts : any) {
	let player = GAME().player;
	let parse : any = {

	};

	parse = player.ParserTags(parse);
	let next  = opts.next || Gui.PrintDefaultOptions;
	let naga : Naga = opts.naga || new Naga();
	let hypno : boolean = opts.hypno || false;

	//[Tailpeg][No]
	let options = new Array();
	options.push({ nameStr : "Tailpeg",
		func : function() {
			Text.Clear();
			parse["hypno1"] = hypno ? "order" : "instruct";
			parse["hypno2"] = hypno ? "entranced, " : "";
			parse["hypno3"] = hypno ? "her " + player.mfTrue("master", "mistress") : "you";
			Text.Add("Licking your lips, you [hypno1] the naga to put her tail to good use and fuck you in your [anus]. Her [hypno2]lusty eyes light up, clearly excited at the chance to please [hypno3]. You feel her serpentine lower body shift ever so slightly just before you feel a tickle at your lonely pucker. That tickle becomes a gentle push and in no time, her scaly appendage is probing inside your back door. More and more smooth, scaly skin enters you, and your anal passage stretches to accommodate. The feeling of fullness inside you is exquisite; your eyes roll back in their sockets as the sensation floods your body with warmth.", parse);
			Text.NL();

			Sex.Anal(naga, player);
			player.FuckAnal(player.Butt(), naga.FirstCock(), 2);
			naga.Fuck(naga.FirstCock(), 2);

			if(player.FirstCock()) {
				Text.Add("Just then, part of her tail brushes against your prostate and you scream wildly in rapture. Realizing what she’s found, the naga begins to grind her scales against it repeatedly, the stimulation joining with the pleasure you’re experiencing from the rest of your body sends thunderstorms of euphoria into your mind.", parse);
				Text.NL();
			}
			parse["c"] = player.FirstCock() ? ", making sure to milk your inner pleasure gland the whole time" : "";
			parse["c2"] = player.FirstCock() ? ", the assault on your prostate quickly eroding what’s left of your stamina" : "";
			Text.Add("The naga slowly pulls her tail out of your [anus][c]. When it’s almost completely out and your pucker almost regains its original shape, she plows her prehensile appendage back in, beginning to tailfuck you hard and fast. Your body’s only response is to quake in pleasure[c2].", parse);
			Text.NL();
			next(true);
		}, enabled : true,
		tooltip : "It’s time to put the naga’s tail to use, and get her to fuck you in the ass."
	});
	options.push({ nameStr : "No",
		func : function() {
			Text.Clear();
			Text.Add("You brush the errant thought aside, and focus on the pleasure you’re already feeling.", parse);
			Text.NL();
			next(false);
		}, enabled : true,
		tooltip : "You aren’t interested in being penetrated by her tail."
	});
	Gui.SetButtonsFromList(options, false, null);
}

NagaScenes.DesertNagaMating = function(naga : Naga) {
	let player = GAME().player;
	let party : Party = GAME().party;
	let p1cock = player.BiggestCock();

	let parse : any = {
		boyGirl : player.mfTrue("boy", "girl")
	};
	parse = player.ParserTags(parse);
	parse = naga.ParserTags(parse, "n");
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, null, "2");

	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";

	GameCache().flags["NagaMate"] = 1;

	Text.Clear();
	Text.Add("<i>“Such a pretty tail...”</i> the naga purrs, her gentle words echoing inside your entranced mind. <i>“Since you’re such a feisty one, I think I’ll take you as my mate!”</i> she continues, her voice surprisingly tender given her promise to “use” you. Her hands caress your face, her nails tracing soft lines across your [skin] and gently stroking your [hair].", parse);
	if(party.Num() > 1) {
		if(party.Num() > 2)
			Text.Add(" Your unconscious companions lie");
		else
			Text.Add(" The unconscious [comp] lies", parse);
		Text.Add(" defeated just out of sight, ignored by the naga who focuses her attention solely on you.", parse);
	}
	Text.NL();
	Text.Add("You feel the naga’s serpentine tail begin to slide against yours, slowly curling over it… then under it… and back over again. She applies just the right amount of pressure that you instinctively curl your own tail, coiling it with hers as she continues to wrap her long, scaly lower body around yours. <i>“Gooooood, pet. Such a good [boyGirl]... Just let me wrap you up in comfort and pleasure, and drift away as you become <b>mine.</b>”</i> Your mind registers some brief alarm at the thought, but it’s quickly swept away as your lover’s tail entwines completely with yours, forming a thick double helix of scaly flesh.", parse);
	Text.NL();
	Text.Add("The scaled seductress looks into your eyes, planting a tender kiss on your pliant lips. As her [ntongue] slides into your mouth, her tail begins to undulate, squeezing yours with the perfect amount of force. You moan into the lip-lock with the unexpected stimulus and she returns with an amused vocalization of her own as her tongue plays with yours.", parse);
	Text.NL();
	Text.Add("Gasping as she breaks the kiss, the naga smiles, your lips connected momentarily by a thin strand of saliva. Her full, supple breasts rub gently against your [breasts], their nipples tickling your [skin]. <i>“It’s time, pet. From now on, you’ll be my mate!”</i> the naga informs you, her tone somehow both commanding and loving.", parse);
	Text.NL();

	let scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("Your dominant lover slides her thick, pre-cum drooling shafts into position, lining up the tip of one against the entrance of your [vag] while the other angles upward along your torso. The naga presses her lips to yours, kissing you passionately as she pushes her pulsating cock into you, its counterpart sliding against you pleasantly, smearing her sticky, fragrant musk up your midsection. She wraps her tongue around yours - coiling it to match your intertwined tails - as she penetrates you, her member filling you with heat and setting your pussy alight with pleasure.", parse);
		Text.NL();

		Sex.Vaginal(naga, player);
		player.FuckVag(player.FirstVag(), naga.FirstCock(), 4);
		naga.Fuck(naga.FirstCock(), 4);

		Text.Add("The naga hugs you tight, embracing you closely and firmly as she hilts herself inside you. You reach your arms down unthinkingly and wrap your hands around the serpent’s loose prick, using her own pre-cum to coat and lube her shaft as you start to stroke it. You just feel like pleasing your mate, and you moan and blush as she twitches in your grip, giving you more viscous lust to work with.", parse);
		Text.NL();
		Text.Add("Your inner walls ripple and squeeze in time with the pulsating of your tail in the naga’s embrace, as if your [vag] is naturally responding to the subtle stimulation. Your scaly mate begins to extract her member from your quivering mound, filling the air with wet squishing noises as she reverses direction. She quickly settles into a relatively slow rhythm of short, intense thrusts, combining with the strange sensation on your tail to bring you quickly to the brink of orgasm.", parse);
		Text.NL();
		Text.Add("The naga breaks her lip-lock once more, and your mouth feels desperately empty without her [ntongue] playing over yours. <i>“I know you’re close, pet…”</i> she coos breathily as she almost tenderly fucks you. <i>“Go on, it’s alright… As my mate, you can cum as many times as you want.”</i> Your lover quickly resumes her oral affections, her invitation more than enough for you, and you crest the wave of orgasm as her tongue, tail, and cock all continue to please you.", parse);
		Text.NL();
		Text.Add("Your body twitches and quivers as you moan throatily into the serpent’s hungry lips. Your [vag] gushes around the thick cock plumbing your depths, milking and squeezing it as well as your body can manage. The naga groans ecstatically into your lips, her thrusts becoming suddenly faster, more intense. The noise of sex builds to a frantic pace for a few seconds, and your orgasm-addled brain somehow finds enough focus to continue stroking your partner’s second member, jacking her off faster and faster in time with her thrusts into your cunt.", parse);
		Text.NL();
		Text.Add("The naga grunts and hilts herself a final time, her body pressed as closely as possible to you in every place she can. Your mate trembles and quivers as her cocks erupt, hot, sticky snake cum spraying into your [vag] and up onto your [breasts] and further, some even reaching the joining of your lips. Your inner walls are painted with rapid, repeated bursts of spunk, filling you and warming you from the core as your womb is filled with jizz. Meanwhile, the space between your chest and the snake’s is spattered, smeared, and lubricated with more of her spooge, letting your [skin] slide against her body with blissful smoothness and lewd, slippery noises.", parse);
		Text.NL();

		NagaScenes.Impregnate(player, naga, PregnancyHandler.Slot.Vag);

		let cum = player.OrgasmCum();

		if(player.FirstCock()) {
			Text.Add("Your own neglected [cocks] take[notS] the match of your lover’s climax with your kitty’s as invitation to join the jism-party. [ItThey] sympathetically spray[notS] your own cum into the sticky mess between your torso and your mate’s. Your body is completely wracked with orgasmic pleasure as you’re pleased in so many ways at once. Your mind goes blank for a few seconds, so completely overloaded by ecstasy that you can’t even begin to think about anything else.", parse);
			Text.NL();
		}
		Text.Add("The serpent’s muscles relax, both of your bodies slowly loosening up from the intense climax you’ve both felt. She rests on you, content to lie in the sticky mess between you while she kisses you constantly, reluctant to part lips even after your orgasms. Finally, her mouth breaks from yours with a gasp, her breathing heavy and hot against your face. She caresses you with her slender hands, gently stroking your features as you instinctively lap at the drops of cum that made it to your mate’s face, cleaning it submissively.", parse);
		Text.NL();
		Text.Add("<i>“Such a well-behaved mate… It seems I made the right choice!”</i> the naga purrs with a wink. She cleans your own face of cum with a finger, feeding it to you as you finish cleaning her face. You lick it off eagerly, drawing a smile and a giggle from your scaled lover. She rolls your bodies onto the sand so that you lie on your side, still face to face. The mess of cum between you slowly oozes down toward the ground, leaving you comparatively [warm/cool] against the desert air. You drift to sleep in your mate’s arms, her cock still firmly embedded in your [vag].", parse);

		TimeStep({hour: 4});

		Gui.NextPrompt();
	}, 1.0, function() { return player.FirstVag(); });
	scenes.AddEnc(function() {
		Text.Add("Your new mate shifts the upper region of her scaled tail against you, your entwined tails gently pulsing in time with your heartbeats. You feel the warmth and moisture of her glistening slit as she slowly rubs it across the length of[oneof] your [cocks], slathering it with her liquid arousal. She lines up her tight, dripping entrance with your [cock], pressing her netherlips gently against your [cockTip] and giggling softly as she kisses you again. Her stare meets yours with warmth and passion as she slowly but surely presses her body against yours, forcing your prick between her tight folds. You both moan in bliss as her pussy swallows your member whole, wrapping your dick in warmth and sensations of rippling muscle contractions.", parse);
		if(player.NumCocks() > 1)
			Text.Add(" Your remaining shaft[s2] [isAre2] left out of the heavenly warmth of the naga’s cunt, but [isAre2] still pressed between the shifting, writhing flesh of your bodies, granting a little pleasure as consolation.", parse);
		Text.NL();

		Sex.Vaginal(player, naga);
		naga.FuckVag(naga.FirstVag(), p1cock, 4);
		player.Fuck(p1cock, 4);

		parse["c"] = player.NumCocks() > 1 ? " and intermingling with yours" : "";
		Text.Add("The naga’s hips undulate ever so slightly, moving less than an inch in either direction. Her movements sync up exactly with the subtle constriction of her tail, and your [cock] is brought into the strangely intense cycle of serpentine stimulation. With her face still inches away from yours, she treats you to a mischievous but warm grin as her inner muscles bring that gentle undulation from the tip of your tail up its length and up to the [cockTip] of your member. You notice that your mate’s cocks are rubbing wetly against your belly[c], smearing pre-cum all over the [skin] of your midsection. She simply smiles wider at you and leans in to resume her near-constant possessive kissing.", parse);
		Text.NL();
		Text.Add("Your lover’s aptly serpentine ministrations continue to expand through you, her body now sliding subtly upward relative to yours. Your lips are forced to part somewhat by her movement, but her tongue stays in your mouth, continuing to play with yours and allow you to taste each other. The rhythmic, alien contractions of her kitty match up with her motions perfectly, engulfing you from the tip of your tail upwards in the naga’s sensuality and grace. Your [cock] is wrapped in waves of pleasure; it's as if your mate’s entire body from the hips down were pleasing it, milking it for your thick seed.", parse);
		Text.NL();
		parse["c"] = player.NumCocks() > 1 ? Text.Parse(" and your own exposed member[s2]", parse) : "";
		parse["c2"] = player.NumCocks() > 1 ? " both" : "";
		parse["c3"] = player.NumCocks() > 1 ? " and your own" : "";

		Text.Add("Your mistress’ thick, oozing cocks press between both your midsections and slide up along your [skin][c], coaxing gentle moans of ecstasy from[c2] her lips[c3]. The soft, bountiful globes of the naga’s breasts glide across the surface of your [breasts], tickling your flesh pleasantly.", parse);
		let size = player.FirstBreastRow().Size();
		if(size > 3) {
			Text.Add(" Your own soft bosom smooshes against your mate’s, forming a delicious vise of flesh and stimulating your [nips] as they brush against hers. You both moan as your nubs pop free on each slippery body-on-body movement, tugged on by flesh until they finally slip free.", parse);
		}
		if(player.Lactation()) {
			Text.Add(" Some of your milk escapes, expelled by the breast-on-breast pressure into the compact, hot void between your bodies. The sweet cream serves as copious lubrication and makes the naga’s sensual slithering feel even better, her motions becoming blissfully easy and fluid against your wet [skin].", parse);
		}
		Text.NL();
		Text.Add("Every inch the snake slides up your body is an exposed inch of your [cock], but she reverses direction well before you slip free of her tight, sweltering cunny. Flesh slips past flesh as you’re engulfed once more in that blissful warmth, your cock milked and worshipped in such a fantastic way that you can’t help but groan and giggle as the naga fucks you, her movements becoming a blur of intense stimulation as you lose track of time.", parse);
		Text.NL();
		Text.Add("The next moment of real consciousness you experience comes as the pleasure building in your loins rises to fever pitch, your pinned and immobilized body twitching and vibrating as you prepare to climax. The deep flush in the naga’s face and the whorish moans escaping her gaping mouth are indication enough she’s as ready as you are, to say nothing of the feverish pace with which she slides up and down your sweaty body. She glances down at your face, no doubt a lewd mask of bliss itself, and giggles as her inner muscles squeeze harder, going into overdrive to bring both of you over the edge in unison.", parse);
		Text.NL();
		parse["b"] = size > 3 ? " the underside of" : "";
		Text.Add("After what seems an eternity of entwined rapture, you and your mate cry out in fervent passion as her slit swallows you to the hilt one last time. You feel her pussy quake and tremble even as it milks your [cock] with machine-like ardor. Her reptilian cunt gushes around your engulfed member, spewing femcum out to soak the upper region of your own serpentine tail. Meanwhile, her pair of massive cocks throbs and pulsates, unleashing a deluge of her seed upward to splatter against[b] your [breasts], your collarbone and face. Your whole upper body is bathed in serpent spunk in short order, even your [hair] gets its share of thick naga cum to soak in.", parse);
		Text.NL();

		let cum = player.OrgasmCum();

		Text.Add("With such intense stimulation, not to mention the intense cumbath, your cock finally succumbs to the pleasure, a torrential surge of cum flooding the naga’s cunt, painting her walls white. Her moans intensify with the surge of heat inside her, and she quivers in delight at the cream filling you’re giving her.", parse);
		if(player.NumCocks() > 1)
			Text.Add(" Your other cock[s2] erupt[notS2] as well, spraying your own sperm into the mess of spooge coating your torso and head, adding your own gooey orgasm to your thick veil of jizz.", parse);
		Text.NL();
		Text.Add("The naga collapses on top of you, a wet splat echoing out around you as your bodies slither against each other in a morass of cum. She licks at your lips until you open them, then kisses you, feeding you a mouthful of spunk gathered from your visage. She repeats the process while her fingers link with yours, cleaning your face off completely by slurping up all of its alabaster mask and then snowballing it into your mouth. You both roll to one side just before you pass out, losing consciousness after such an intense orgasm, your [cock] still lodged firmly in your mate’s greedy pussy.", parse);

		TimeStep({hour: 4});

		Gui.NextPrompt();
	}, 1.0, function() { return player.FirstCock(); });

	Gui.Callstack.push(function() {
		Text.Clear();
		parse["s"] = party.Num() > 2 ? "s" : "";
		parse["c"] = party.Num() > 1 ? Text.Parse(" and the still-unconscious form[s] of [comp]", parse) : "";
		Text.Add("You awaken sheltered from the desert in a small cavern next to a pool of cool water. You’ve been washed clean and your belongings[c] lie on the other side of the pool, unharmed. A note is scrawled elegantly on a parchment beside you, reading:", parse);
		Text.NL();
		Text.Add("<i>I’ve brought you home so you’re safe while you sleep. I don’t expect you’ll stay long - I picked you exactly because you’re a feisty one, so feel free to come and go as you please. When you see me next, we can skip all the needless posturing and just get to the fucking, unless you insist on being taught your place again!</i>", parse);
		Text.Flush();

		Gui.NextPrompt();
	});

	scenes.Get();
}

export { NagaScenes };
