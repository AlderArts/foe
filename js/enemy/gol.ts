/*
 *
 * Gol boss
 *
 */

import { Abilities } from "../abilities";
import { Images } from "../assets";
import { LowerBodyType } from "../body/body";
import { Body } from "../body/body";
import { Cock, CockType } from "../body/cock";
import { Color } from "../body/color";
import { Race } from "../body/race";
import { Encounter } from "../combat";
import { Element } from "../damagetype";
import { EncounterTable } from "../encountertable";
import { Sex } from "../entity-sex";
import { Player } from "../event/player";
import { GAME, TimeStep } from "../GAME";
import { GameState, SetGameState } from "../gamestate";
import { Gui } from "../gui";
import { AlchemyItems } from "../items/alchemy";
import { IngredientItems } from "../items/ingredients";
import { QuestItems } from "../items/quest";
import { WeaponsItems } from "../items/weapons";
import { IChoice } from "../link";
import { BurrowsFlags } from "../loc/burrows-flags";
import { SetGameOverButton } from "../main-gameover";
import { Party } from "../party";
import { Text } from "../text";
import { BossEntity } from "./boss";

export class GolQueen extends BossEntity {
	constructor() {
		super();

		this.ID = "gol";

		this.avatar.combat     = Images.gol;

		this.name              = "Gol Queen";
		this.monsterName       = "the Gol";
		this.MonsterName       = "The Gol";

		// TODO Stats

		this.maxHp.base        = 1800;
		this.maxSp.base        = 700;
		this.maxLust.base      = 900;
		// Main stats
		this.strength.base     = 70;
		this.stamina.base      = 60;
		this.dexterity.base    = 30;
		this.intelligence.base = 50;
		this.spirit.base       = 50;
		this.libido.base       = 100;
		this.charisma.base     = 70;

		this.level             = 13;
		this.sexlevel          = 6;

		this.combatExp         = 350;
		this.coinDrop          = 1500;

		this.elementAtk.dmg[Element.pSlash]   =    1;
		this.elementDef.dmg[Element.mNature]  =  0.5;
		this.elementDef.dmg[Element.mIce]     =   -1;
		this.elementDef.dmg[Element.mThunder] = -0.5;

		this.body              = new Body(this);

		this.body.DefHerm();

		this.body.SetRace(Race.Gol);
		this.body.SetBodyColor(Color.green);
		this.body.SetHairColor(Color.green);
		this.body.SetEyeColor(Color.red);
		this.FirstCock().race = Race.Gol;
		this.FirstCock().type = CockType.ovipositor;
		this.FirstCock().length.base = 400;
		this.FirstCock().thickness.base = 10;

		// 3'
		this.FirstVag().capacity.base = 20;
		this.FirstVag().virgin = false;

		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();

		this.AddLustFraction(0.3);
	}

	public DropTable() {
		const drops = [];
		drops.push({ it: QuestItems.Scepter });
		drops.push({ it: WeaponsItems.GolClaw });
		drops.push({ it: AlchemyItems.GestariumPlus });

		drops.push({ it: IngredientItems.Letter, num: 3 });
		drops.push({ it: IngredientItems.Trinket, num: 3 });
		drops.push({ it: IngredientItems.HorseShoe, num: 3 });

		if (Math.random() < 0.1) { drops.push({ it: IngredientItems.RawHoney }); }
		if (Math.random() < 0.1) { drops.push({ it: IngredientItems.BeeChitin }); }
		if (Math.random() < 0.1) { drops.push({ it: IngredientItems.MFluff }); }
		if (Math.random() < 0.1) { drops.push({ it: IngredientItems.HorseCum }); }
		if (Math.random() < 0.1) { drops.push({ it: IngredientItems.BlackGem }); }

		if (Math.random() < 0.2) { drops.push({ it: AlchemyItems.Estros }); }
		if (Math.random() < 0.2) { drops.push({ it: AlchemyItems.Gestarium }); }
		if (Math.random() < 0.2) { drops.push({ it: AlchemyItems.GestariumPlus }); }

		return drops;
	}

	public Act(encounter: any, activeChar: any) {
		const party: Party = GAME().party;
		// TODO: Very TEMP
		Text.Add(this.name + " acts! Buzz!");
		Text.NL();

		// Pick a random target
		const t = this.GetSingleTarget(encounter, activeChar);

		const parseVars = {
			name   : this.name,
			hisher : this.hisher(),
			tName  : t.name,
		};

		const choice = Math.random();
		if (choice < 0.2) { // TODO
			Abilities.Attack.CastInternal(encounter, this, t);
		} else if (choice < 0.4 && Abilities.EnemySkill.GolQueen.Pollen.enabledCondition(encounter, this)) {
			Abilities.EnemySkill.GolQueen.Pollen.Use(encounter, this, party);
		} else if (choice < 0.55 && Abilities.EnemySkill.GolQueen.LustyPheromones.enabledCondition(encounter, this)) {
			Abilities.EnemySkill.GolQueen.LustyPheromones.Use(encounter, this, t);
		} else if (choice < 0.7 && Abilities.EnemySkill.GolQueen.CuntDash.enabledCondition(encounter, this)) {
			Abilities.EnemySkill.GolQueen.CuntDash.Use(encounter, this, t);
		} else if (choice < 0.8 && Abilities.Physical.DAttack.enabledCondition(encounter, this)) {
			Abilities.Physical.DAttack.Use(encounter, this, t);
		} else if (choice < 0.9 && Abilities.Physical.GrandSlam.enabledCondition(encounter, this)) {
			Abilities.Physical.GrandSlam.Use(encounter, this, party);
		} else {
			Abilities.Attack.Use(encounter, this, t);
		}
	}

}

export namespace GolScenes {

	export function SearchForScepter() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const parse: any = {

		};

		Text.Clear();
		Text.Add("Just when you’re about to give up the search for the missing merchant, you notice tracks leading off the beaten path and into a hilly, forested area off in the distance. Only, it doesn’t look like the decision to change course was made willingly - in fact, it looks like the cart was dragged off, and there are signs of a struggle, faded by time but still visible if you look for them.", parse);
		Text.NL();
		Text.Add("Following the tracks, you end up near the mouth of a narrow canyon. Here, too, you see the signs of struggle - a ripped piece of clothing, the ripped off wheel from a merchant’s cart, a smashed barrel with various knick-knacks spread across the ground.", parse);
		Text.NL();
		Text.Add("You waver on the brink of the crevasse. This may be your only lead on finding Lagon’s scepter, but this doesn’t look like the work of ordinary bandits. Not only that, you have an uneasy feeling about this place.", parse);
		Text.Flush();

		TimeStep({minute: 30});

		// [Leave][Explore]
		const options: IChoice[] = [];
		options.push({ nameStr : "Leave",
			func() {
				Text.Clear();
				Text.Add("You decide to return to the dubious safety of the main travel route. If you want to take on whatever attacked the caravan, you should do so when better prepared.", parse);
				Text.Flush();

				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "You can always return later when you are better prepared for what lies ahead.",
		});
		options.push({ nameStr : "Explore",
			func() {
				Text.Clear();
				Text.Add("Steeling yourself, you head inside the winding canyon, nerves on end and ready for combat. ", parse);
				parse.Comp = party.Num() === 2 ? party.Get(1).name : "Your companions";
				parse.notS = party.Num() === 2 ? "s" : "";
				if (party.Num() > 1) {
					Text.Add("[Comp] walk[notS] by your side, staying as close to you as possible. ", parse);
				}
				Text.Add("It’s eerily quiet, and you don’t hear the usual din of the wilds here - no calls of birds or baying of distant wild dogs. You find further evidence of the caravan; splinters of wood and patches of cloth hanging off scraggly trees. Some of the narrow sections you pass through doesn’t look like they’d even allow for a regular wagon to pass through. It’s as if someone hauled it through bodily. It’s not a feat possible for a regular horse, far less by mere bandits.", parse);
				Text.NL();
				Text.Add("More alarming, you begin to see unnatural secretions of… something. Sticky mucus clings to the cliffside like an infestation of some sort. It’s not spiderwebs, but perhaps something similar. Surely, it’s not natural. Trying not to touch it, you soldier on.", parse);
				Text.NL();
				Text.Add("Rounding a corner, you come upon a secluded valley in the hill; a place of madness and corruption. The strange sticky mucus is everywhere, and there is an unnerving whirring noise, like that of the distant rapid beat of insect wings. Even looking around, you can’t figure out its source - it’s as if it was emanating from the inside of your skull.", parse);
				Text.NL();
				Text.Add("Here, you finally discover the fate of the unlucky caravan: the remains of several wagons smashed to pieces and scattered across the ground. You quickly realize that you’re not alone, however, as there is a large hulking shape rummaging through the remains of one of the carts. Half woman, half insect, all terrifying, she stands well over ten feet tall, with four arms - two of which are similar to enormous scythes - and six legs. Her face is vaguely human, though the antenna sticking out of her long green hair and the four inhuman eyes on her forehead belay her insectoid nature; she looks like a freakish mix between a human and a mantis.", parse);
				Text.NL();
				Text.Add("Sensing your approach, the monster steps out of the wreckage, tossing aside planks and iron-rimmed wagon wheels with ease. In one scythe-like hand, she holds an unconscious maiden with a belly distended with the unmistakable bulge of late-term pregnancy and clad in ill-fitting clothes ripped from within. The insectile behemoth meets your gaze, and a smile breaks across her face. Placing the woman gently behind her, she unintentionally gives you a good look at her chitinous lower half, complete with a half-dozen skittering legs and a tubular, tail-like extension that sprouts from the back of her abdomen. The backmost foot of it shines with reflective juices. Whether they're her own or her captive's, you cannot say.", parse);
				Text.NL();
				Text.Add("You realize that you’ve seen something like her before; during the time you helped Ophelia, you found the husk of one of her kind. This insectoid being has to be one of the Gol, the fearsome creatures that the alchemist warned you about. Looks like you have no choice but to face this one, however. Looking a live one in the face is a heck of a lot more intimidating than their remains, that’s for sure… and this one looks even bigger than the one you found. No - not just one. You see several others nearby, though much smaller and differently endowed. Perhaps these are drones of some kind.", parse);
				Text.NL();
				Text.Add("<i>“Did you also come to join my hive?”</i> her buzzing voice asks as she lays her victim alongside a number of other, similarly swollen captives. Some are unconscious, but others are awake, softly moaning as their fingers splay across taut, pregnant skin or fluid-drenched fur. Not even the males have escaped her attentions. They lie there with swollen balls and dazed looks on their faces, looking fondly at her while quietly begging for her attention.", parse);
				Text.NL();
				Text.Add("In her other hand, she is grasping what must unmistakably be Lagon’s scepter. It’s a grand thing, crowned by a large gemstone. You tell her in no uncertain terms that you're here for the scepter, not to join her hive - trying to hide your surprise at her words. You thought these creatures were feral? Readying yourself for battle, you prepare to face down the monstrosity.", parse);
				Text.NL();
				parse.incubatorBreeder = player.mfFem("incubator", "breeder");
				Text.Add("The Gol straightens to her full height and turns to answer, splintering wood as each pointed, chitin-plated foot slams into the remains of an unlucky wagon. <i>“A shame.”</i> She climbs closer, batting the eyelashes over her human eyes while four unblinking, insectile eyes stare you down. <i>“I've only learned to enjoy sex as your people do since discovering this scepter.”</i> She holds it aloft in one hand, just below her scything arms. <i>“But it's so much better when you start out unwilling.”</i> Her nippleless breasts heave with excitement. <i>“You shall make a fine [incubatorBreeder] for the hive!”</i>", parse);
				Text.NL();
				Text.Add("The monster waves her scepter, and the men and women are carried away by scurrying drones, off to whatever fate awaits them deeper within the canyon. You're going to have to fight this crazy Gol if you don't want to wind up like the people of the caravan!", parse);
				Text.Flush();

				Gui.NextPrompt(() => {
					const enemy = new Party();
					const gol = new GolQueen();
					enemy.AddMember(gol);
					const enc: any = new Encounter(enemy);
					enc.gol = gol;

					enc.canRun = false;
					enc.onLoss = GolScenes.CombatLoss;
					enc.onVictory = GolScenes.CombatWin;

					enc.Start();
				});
			}, enabled : true,
			tooltip : "Forge on and search for the ultimate fate of the merchant. Perhaps you can find out what has happened with Lagon’s scepter as well.",
		});
		Gui.SetButtonsFromList(options, false, undefined);
	}

	// TODO
	export function CombatLoss() {
		const player: Player = GAME().player;
		const enc = this;
		const gol: GolQueen = enc.gol;
		SetGameState(GameState.Event, Gui);

		const parse: any = {
			foot() { return player.FootDesc(); },
		};

		Text.Clear();
		parse.lust = player.LustLevel() > 0.7 ? ", lust-" : "";
		Text.Add("Looming above your defeated[lust]stricken form, the Gol leers at you, all six of her eyes focusing down at you. You do your best to scramble away through the rubble, but it's quite difficult to move in your state. She thoughtfully strokes her chin with a humanlike arm, holding the scepter aloft in her other. <i>“You're different than the others. They broke without much effort.”</i> She snaps her mantis-like claws. <i>“All I had to do was treat them with a degree of tenderness, perhaps expose them to my pollen, and they became willing breeders.”</i>", parse);
		Text.NL();
		Text.Add("You try to crawl away, but she hooks an insectile limb around your [foot].", parse);
		Text.NL();
		Text.Add("<i>“Tsk, tsk. Just because you can struggle doesn't mean you won't be useful to my hive.”</i> She spins the scepter in her hand. <i>“Do you think an item such as this - one that gave me the gifts of thought and speech - could be used to bring you into the fold? To make you willingly, eagerly mine?”</i> She skitters forward, dislodging bits of wood as she moves. The insectile horror looms large as she bends forward, dangling her scepter just above your face. <i>“You know what? I think it can.”</i>", parse);
		Text.NL();
		parse.lust = player.LustLevel() > 0.7 ? ", no matter how horny you are" : "";
		parse.lust2 = player.LustLevel() > 0.7 ? " and lust" : "";
		Text.Add("You're not going to give her the chance[lust]! You twist to the side and claw forward, giving yourself a half-dozen splinters in the process. The pain is nothing next to the fear[lust2] coursing through you.", parse);
		Text.NL();

		let incubator: boolean;

		const scenes = new EncounterTable();
		scenes.AddEnc(() => {
			incubator = true;
		}, 1.0, () => player.FirstVag() !== undefined);
		scenes.AddEnc(() => {
			incubator = false;
		}, 1.0, () => player.FirstCock() !== undefined);
		scenes.Get();

		parse.inc = incubator ? "incubator" : "drone prince";
		parse.him = player.mfFem("him", "her");

		Text.Add("<i>“Oh, that won't do,”</i> the Gol coos, excitedly scampering after you. Pincers hook underneath your shoulders and lift you aloft. <i>“I can't have my new [inc] injuring [him]self.”</i> She looks almost upset. <i>“What kind of Queen would that make me?”</i>", parse);
		Text.NL();
		Text.Add("You feebly struggle once, then sag back, defeated and wondering what fresh terrors she's going to inflict upon you.", parse);
		Text.NL();
		Text.Add("The Gol chirps in happiness. <i>“That's more like it. I don't desire your pain, only your compliance.”</i> One of her legs tugs a ragged-looking quilt out from the caravan's rubble, its once fine stitching torn in places. Its fluff has bled out in places, but there is no doubt that it was a well-made blanket. Feeling the comforting softness press against you as you're laid down is a stark relief. <i>“Now, why don't you just forget about your old life and focus on serving me. It'll be easier for you that way.”</i>", parse);
		Text.NL();
		Text.Add("You spit your defiance at her. There is still too much left for you to do!", parse);
		Text.NL();
		Text.Add("She shakes her head sadly. <i>“How petty and simple your goals are. The world does not revolve around you, little meatling. The scepter has helped me see that. It is only by working together in unified purpose that we can make anything good, and who better to guide that purpose than the one who holds the scepter?”</i> Her armored bulk skitters forward. Pointed legs stab through the blanket on either side of you, and you do your best to hold still lest you gain a few new holes. <i>“I will give you purpose.”</i>", parse);
		Text.Flush();

		Gui.NextPrompt(() => {
			if (incubator) {
				GolScenes.CombatLossIncubator(gol);
			} else {
				GolScenes.CombatLossDrone(gol);
			}
		});
	}

	export function CombatLossIncubator(gol: GolQueen) {
		const player: Player = GAME().player;
		const parse: any = {
			skinDesc() { return player.SkinDesc(); },
			armor() { return player.ArmorDesc(); },
			legs() { return player.LegsDesc(); },
			vagina() { return player.FirstVag().Short(); },
		};

		Text.Clear();
		Text.Add("The rapid-fire clicks of her legs punching through the ruins of the caravan keep you jumpy, your nerves on edge, but you dare not move or even open your eyes. Just seeing one of those exoskeletal monstrosities coming down next to your head would probably send you into fits. You try your damnedest to quiet the tremors of nervous energy toying with your muscles, but the partial success is little comfort.", parse);
		Text.NL();
		Text.Add("The heat of the insect-woman’s enormous underside washes over you in waves, accompanied by scents both musky and pleasant; all are oddly sexual, spreading twinges of desire through your body under the tight-knit balls of fear.", parse);
		Text.NL();
		Text.Add("<i>“Oh, don’t be afraid. I’d never hurt one of my breeders.”</i>", parse);
		Text.NL();
		Text.Add("You stomach a smarmy reply - there’s no use in getting offed if you can help it. You beg for her to let you go, sincerely doubting that it’ll work.", parse);
		Text.NL();
		Text.Add("As expected, it doesn’t. The monstrous Gol actually giggles. <i>“Oh, still your worrying, pet. All will be made clear enough soon. Here, let me assuage your fears - you seem awfully worried about being stepped on, after all.”</i> Something warm and wet sprays across you, and you can’t hold your eyes shut any longer. You have to see what fresh horror she has brought to the fore.", parse);
		Text.NL();
		Text.Add("<i>“Oh.”</i> The word slips through your lips at the sight of your body covered in sticky, rapidly solidifying webbing. Some of the pointed legs zip back and forth across your body, arranging it before it finishes hardening, then she squirts another wave of the stuff from recessed glands you would have missed at first glance, covering you in so much that everything below your neck obscured by white silk. Well, almost everything. Your crotch has been left curiously unguarded and your [armor] removed. When did that happen? You feel like you should be struggling, but your head is dizzy from the fight or her scent, and you don’t want to get stepped on. The thickening cocoon is blessedly comfortable as well.", parse);
		Text.NL();
		Text.Add("At some point while your eyes were closed, the insect Matron spun around so that her front was past your feet, and her tail positioned over your head. Now you’re getting your first good look at the odd organ at its tip. It’s a little longer than it was when you first got here, if such a thing is possible, and a small, lubricant dripping hole sits at the end. You don’t know that much about insects, but you wager this is where her eggs come from. Maybe you should be grossed out right now. Instead, you find yourself fascinated by its unique biology.", parse);
		Text.NL();
		Text.Add("Just how big could her eggs be, and why is everyone from the caravan pregnant if she lays eggs? Her tail twitches as if mindful of your gaze, dripping a thicker flow of its fluid onto your bound chest. She must be ready to birth again. The organ surges out another inch or so from the surrounding carapace, gleaming in the starlight. That scent you smelled earlier - the musky, sexual tang that sent shivers down your spine - is stronger now, given off by the swelling ovipositor above.", parse);
		Text.NL();
		parse.l = player.LowerBodyType() !== LowerBodyType.Single ? "between your thighs" : "in your loins";
		Text.Add("You whimper, though from fear or arousal, you cannot tell. The Gol queen is a magnificent piece of work, perfectly engineered to breed often and in large quantities. The dripping hole above is clearly her ovipositor, and it’s stretching out before your very eyes, engorging in preparation of... something. You try to convince yourself the moisture [l] is nervous sweat and that the prickle of your sensitive nipples against their bindings is a trick of your mind. It works until a droplet of slippery goo lands on your neck, hot and wonderfully sensuous against your [skinDesc].", parse);
		Text.NL();
		Text.Add("You gasp in shock, wriggling in your confinement. ", parse);
		if (player.LowerBodyType() !== LowerBodyType.Single) {
			Text.Add("Your [legs] are so perfectly spread and anchored by yet more webs until closing them is an impossibility. You want to close them, close them and grind them together, squeezing down on the wetness between, but you can’t.", parse);
		} else {
			Text.Add("Your [legs] is stretched out so that you can’t even flex or twist, anchored with web upon web until movement or concealment of your [vagina] is an impossibility. You wish you could curl back onto yourself, and maybe rub a little across your increasingly puffy entrance, but you can’t.", parse);
		}
		Text.Add(" You’re pinned and exposed, being dripped on and dripped from. Another splatter of goo smears your cheek, and you moan in anxious need.", parse);
		Text.NL();
		GolScenes.CombatLossIncEntry(gol);
	}

	export function CombatLossIncEntry(gol: GolQueen) {
		const player: Player = GAME().player;
		const p1cock = player.BiggestCock();

		let parse: any = {
			vagina() { return player.FirstVag().Short(); },
			cocks() { return player.MultiCockDesc(); },
			cock() { return p1cock.Short(); },
		};

		parse = Text.ParserPlural(parse, player.NumCocks() > 1);

		Text.Add("Why isn’t she doing anything to you? Can’t she see how horny you are? Can’t she see the way your bare flesh is gleaming? You whine, high pitched and plaintive, looking at her growing ovipositor with a sort of half-understood need. There’s no doubting the thing’s phallic nature now. It isn’t meant to lay eggs; it’s meant to ram into a hot, sweaty box like yours and pump it full of eggs in the most pleasant way possible. A splatter of fragrant lubricant glances off your lip, and you taste it without thinking, savoring the flavor. An idea bursts upon, whole and fully formed, perfect in its majesty - you could let her fill you with eggs and escape while she’s tired.", parse);
		Text.NL();
		Text.Add("It might be a little hard to walk, with your belly all pregnant and dome-like, gleaming and shifting with every egg-weighted step you take, but you could get away, maybe find somewhere quiet to lie down and.... It’s better to leave it a mystery. Maybe you’ll jill yourself off and dig every drop of her delicious nectar from your well-used slit. Maybe you’ll just sit there, rubbing your tummy while the life within you grows to maturity. Maybe you’ll cum just from feeling your beautiful Gol babies slide out into the grass, slick with fluid that smells just as wonderful as their mommy’s.", parse);
		Text.NL();
		Text.Add("A warm, melodious voice cuts through your musings like a blade through butter. Why didn’t you notice how sweet she sounded before? <i>“Is something the matter, dear?”</i> The armored women is looking over her shoulder at you with a look of knowing concern, but the excited flush of her cheeks tell you just how aware of your condition she is. Why, her ovipositor is still growing above you, firming up in preparation of something. She scuttles a short distance away, then turns to face you. <i>“You look... eager. Did you change your mind... about being my incubator?”</i> She pauses, blushing hotter. <i>“I have so many I could give you, again and again.”</i>", parse);
		Text.NL();
		Text.Add("Your mouth waters and your head swims. Your [vagina] feels like a hot spring’s waterfall. The Gol’s ovipositor just looked so thick and... filling. You were going to trick her into... stuffing you full of her eggs so you could get away. Somehow, you get even wetter at the idea.", parse);
		Text.NL();
		Text.Add("Licking your lips, you answer, proud of how deceptively eager you sound, <i>“Yes! Use me as your eggholster!”</i> A decidedly panty-drenching thought occurs to you, and you can’t help but give it voice. <i>“Stuff me so full of eggs you have to web my gaped cunt shut just to hold them in!”</i> That was filthy, but it made your [vagina] weep with anticipation. Maybe she’ll wrap you up in webs and just let you hang there until it’s time for your next filling.", parse);
		Text.NL();
		Text.Add("Her voice cuts your fantasies short once more. <i>“I exist to serve.”</i> Her tone is anything but humble, but how could you care when that thick cunt-stretcher is being pointed in your direction. It’s so close to you now, the clear fluids it exudes painting a trail up the ruined quilt toward the ", parse);
		if (player.LowerBodyType() !== LowerBodyType.Single) {
			Text.Add("junction of your thighs", parse);
		} else {
			Text.Add("hole that lies at the center of your body and thoughts", parse);
		}
		Text.Add(". The need is palpable, almost all consuming. Your heartbeat hammers so hard you worry that it’ll crack your chest when the Gol’s oozing organ finally makes first contact.", parse);
		Text.NL();
		Text.Add("It feels better than you thought it would - better than a fingertip or penis ever could. Your lips part with glacial slowness around the intruder’s slickened bulk. You can tell she’s going easy on you, much as you might want her to ram it in until it’s splitting your cervix. Even going slow, it feels right in a way that tickles at your synapses, burning away worries and depression more effectively than any celebration or gift. With a shuddering gasp, you realize why this is so wonderful: it’s a fulfillment of purpose.", parse);
		Text.NL();

		Sex.Vaginal(gol, player);
		player.FuckVag(player.FirstVag(), gol.FirstCock(), 6);
		gol.Fuck(gol.FirstCock(), 6);

		Text.Add("You were meant to do this. Meant to take life inside you and nurture it. You see that now, as clearly as you feel your new purpose being bored into your quivering slit. Your thoughts of escape burn away under the raw, untamed truth of it, molten hot in a way that sears your pleasure inside you, forcing you to boil in it. Runnels of girlcum stream out onto the rubble below as if forced out to make room for the new you. A soon to be pregnant you.", parse);
		Text.Flush();

		Gui.NextPrompt(() => {
			Text.Clear();
			Text.Add("You close your eyes once more, not because of fear or revulsion, but because dealing with the wealth of sensory data from your stretching quim and your vision is making you dizzy. You can’t shut off the input from down below, so the vision has to go. It’s easier this way. You can focus on the rippling distentions and veins of the expanding ovipositor, the way it tingles and numbs and enhances your sensations all at once.", parse);
			Text.NL();
			Text.Add("You almost wish it would triple in size, just to see if she could take you that far. Something about her fluids seems to dim your ability to feel pain, and you can feel something inside you relaxing and opening up, blossoming like a beautiful flower.", parse);
			Text.NL();
			Text.Add("The Gol grunts, abruptly pushing forward, giving you exactly what you want. Her organ widens the closer it gets to the base, and you feel your walls giving as they’re pulled to their limit and beyond. The more it pushes, the more intense the pleasure becomes, rolling in like impenetrable pink fog.", parse);
			Text.NL();
			Text.Add("You gasp, <i>“More!”</i> without thinking of the hows or the whys or even if your body is capable of such a feat; the only concern is being taken and filled to the brim. You want your pussy filled with her ovipositor, your womb stuffed with eggs, and your tits brimming with more milk than your babies will ever be able to drink. Do insects-girls drink milk? A flash of yourself tugging on your nipples, fountaining milk while a hip-splitting egg slowly works its way out of your overtaxed pussy overwhelms you, and you decide it doesn’t matter.", parse);
			Text.NL();
			Text.Add("The Gol queen, your Queen, you realize, shoves harder, slamming her lengthy organ in to the hilt. You feel it slip past some obstruction inside you. Your womb, you realize through the haze of pleasure. Then she pulls back, waits a moment, and slams herself home, fully seating her egg-laying she-dick within your moist accommodations, forcing your cervix to dilate wide as its tip nuzzles at your fallopian tubes.", parse);
			Text.NL();

			const cum = player.OrgasmCum();

			parse.woman = player.mfFem("man", "woman");
			Text.Add("You cum to the feeling of utter violation. If it weren’t for the steel-strong silk binding you in place, you’d be thrashing like a wild [woman]. ", parse);
			if (player.FirstCock()) {
				Text.Add("Your [cocks] launch[notEs] gob after gob of forgotten cum onto your face, but [itThey] only serves to make your situation all the hotter. Such a heedless, arrogant release, riding high on the waves of your true pleasure, the pleasure of serving your purpose. All that a dick is for is making you an even wetter, sluttier drone for the Queen until she decrees otherwise.", parse);
			} else {
				Text.Add("Your juices run in streams around the dick, practically spraying out of you as you give in to the true pleasure. It’s the perfect orgasm for a perfect, slutty drone, one who will do this again and again, so long as the Queen wills it.", parse);
			}
			Text.NL();
			Text.Add("The Queen, grunting with effort, still manages to grace you with a smile. <i>“Cumming already? Well, I suppose it will not matter.”</i> She grunts once more, straining with something. <i>“It’s good that you find such pleasure in your place, little incubator. If you handle these eggs well, I will give you all you can handle, and visits from the drones besides.”</i>", parse);
			Text.NL();
			Text.Add("Drones? Visions of big-dicked, handsome bug-boys dance in your head, clapping their carapace-covered crotches against your own again and again, your pregnant belly wobbling just above. You nearly cum again. The Queen - your Queen - is so generous!", parse);
			Text.Flush();

			Gui.NextPrompt(() => {
				Text.Clear();
				Text.Add("The ovipositor lodged inside of you shifts, twisting and rubbing against your overtaxed walls in whole new ways. It flexes, the base expanding slightly, and then that distention slides deeper inside you. Behind it, the ovipositor narrows once more. She must be giving you your first egg! You giggle with girlish glee, a little pleasure-drunk, and try to relax your muscles as much as possible.", parse);
				Text.NL();
				Text.Add("Even with your acceptance, the egg still has a tough time squeezing through your increasingly narrow hole, slowing down the closer it gets to your womb. The ovipositor clenches and flexes, pushing harder and harder, forcing the obstruction deeper and deeper. You feel it’s about to tear you in two and make you cum all at the same time, and then, suddenly, it’s inside you, falling to rest against the soft wall of your womb.", parse);
				Text.NL();
				Text.Add("The egg is so warm. Even buried within you, you can feel it radiating heat. It’s just a hair warmer than your own body, enough to remind you at all times that you’re carrying more than just your own flesh.", parse);
				Text.NL();
				Text.Add("While you marvel at your motherhood, flush with multiple varieties of pleasure, another egg begins its journey inward. Then another, and another... and another. These come easier than the first. Your elasticized pussy has spread so terrifically wide. You doubt a lesser lover could ever please you again. The eggs come on, one after another, slowly filling your uterus with potential life, pressing by sensitive nerves on their way in.", parse);
				Text.NL();
				Text.Add("The eighth egg has you cumming and screaming your devotion to the Queen. The body-wracking ecstasy goes on for so long that you lose count of just how many eggs slip inside, but the number doesn’t really matter, so long as you’re full of her blessings. Drool runs from the corner of your open, moaning mouth, but that doesn’t matter either. Your life as an incubator doesn’t matter. Being gaped by an insect woman doesn’t matter.", parse);
				Text.NL();
				Text.Add("Being the best possible egg-bearer is what matters. That, and cumming as often as possible while doing so.", parse);
				Text.NL();
				Text.Add("Your belly bulges. Your pussy creams. You cum, and cum, and cum until unconsciousness claims you.", parse);
				Text.Flush();

				Gui.NextPrompt(() => {
					Text.Clear();
					Text.Add("<b>Sometime later...</b>", parse);
					Text.NL();
					Text.Add("You lie in your cubby, masturbating to the feelings coming from your newly grown abdomen. Just as the queen promised, having a second womb doubled your pleasure, and your abdomen can hold so many more eggs that your belly! Every now and then it shifts in the most pleasant way, adjusting to the growing young within.", parse);
					Text.NL();
					Text.Add("The Queen promised you that it would double in size before you got to give birth. That’s why it’s so important that you stay in your cubby, where the lower level drones can keep you fed and the higher level ones can find you for release. Your body gives you all the entertainment you could ever want anyway. Why, just circling a tender nipple could keep your entertained for hours.", parse);
					Text.NL();
					Text.Add("The hive needs so many born to finish conquering the world, but you and your sisters are up to the task. You rub the shining dome of your gravid tummy. Oh yes, are you ever.", parse);
					Text.Flush();

					TimeStep({season: 1});

					SetGameOverButton();
				});
			});
		});
	}

	export function CombatLossDrone(gol: GolQueen) {
		const player: Player = GAME().player;
		const p1cock = player.BiggestCock();

		let parse: any = {
			vagina() { return player.FirstVag().Short(); },
			cocks() { return player.MultiCockDesc(); },
			cock() { return p1cock.Short(); },
			cockTip() { return p1cock.TipShort(); },
			armor() { return player.ArmorDesc(); },
			face() { return player.FaceDesc(); },
			hair() { return player.Hair().Short(); },
			legs() { return player.LegsDesc(); },
			butt() { return player.Butt().Short(); },
		};

		const growcock = p1cock.Len() < 90;

		parse = Text.ParserPlural(parse, player.NumCocks() > 1);

		Text.Clear();
		Text.Add("Gingerly, the Gol lowers herself down onto you, pinning you under her soft underside. It's less uncomfortable than you would think, but it does put you in the unfortunate position of having her fragrant gash positioned a few inches above your face.", parse);
		Text.NL();
		Text.Add("She wiggles, getting comfortable, and in the process rubbing your uncomfortably hard penis between your bodies. Dragging the scepter's head around her engorging folds, the feminine creature promises, <i>“You're going to get very acquainted with this hole soon.”</i> She brings it up to do tiny circuits around a very prominent clitoris. <i>“The males from the caravan were quite taken with it. I believe their exact words were that it was entrancing.”</i>", parse);
		Text.NL();
		Text.Add("Entrancing? You don't really see it. Sure, it's a huge, fertile-looking pussy with puffy, wet lips that would feel so good to slip inside of it, but you wouldn't really call it entrancing. It's just a pussy. A nice-looking example of feminine genitalia, but nothing more.", parse);
		Text.NL();
		Text.Add("<i>“There you go, staring at it like it's the most important thing in the world. If you aren't careful, you're going to want to fuck it more than anything - more than having free will.”</i> The Gol playfully strokes your hair.", parse);
		Text.NL();
		Text.Add("Yeah, right. You ignore her condescending petting. You could look somewhere else if you wanted. There's nothing stopping you. It's just... just that it's her most interesting feature - the best part of her for sure. The smell of it is even kind of pleasant in its way. You squirm a little, feeling more than a little hot, but that's only because she's pinning it down and making you look at her fuckable cunt. It's a perfectly normal reaction. A droplet of lubrication falls on your cheek, making you wonder just what it would taste like.", parse);
		Text.NL();
		Text.Add("Giggling excitedly, the Gol drags the scepter across her increasingly wet womanhood once more. Her lips briefly part, revealing a flash of its insides so pink that you could swear it burns an afterimage into your retinas. <i>“It's okay if you don't look away. That's what I want, after all. Do you want me to hold it open so that you can see it better?”</i> From the corner of your vision, you see her cock her head questioningly.", parse);
		Text.NL();
		Text.Add("When a sexy girl asks you if you want to see the inside of her pussy, you don't say no. <i>“Yes...”</i> Your [cocks] surge[notS] excitedly at the prospect. Damn, you're really, really hard. She doesn't have any kind of magic vagina powers or anything, she's just really hot, wet, and smells like bottled sex. Your [cocks] strains[notS] inside your [armor]. You'd have to be castrated not to want a slit like that. <i>“Please?”</i>", parse);
		Text.NL();
		Text.Add("The Gol says something, but you're too busy watching her fingers hook into her sides of her dribbling delta and pull it wide opening, revealing the wettest, slickest looking pussy you've ever laid eyes on it. And it's just so... so... <i>pink</i>.", parse);
		Text.NL();
		Text.Add("You breathe deeply and sigh in delight. Her scent smells even more potent now - practically all-consuming. The air itself seems stained with her incredibly feminine flavor. Perhaps it's from how wet she's gotten? You thrill at the knowledge that she's lubricating for you, making herself ready for you to fuck her. If only you hadn't tried to fight her, you could be fucking <i>right now</i>. You groan and twist beneath her, rubbing your dick against her supple underbelly. Your eyes longingly trace the contours of her interior, and your mouth falls open, hoping to catch one of the glistening droplets that are falling over your [face].", parse);
		Text.NL();
		Text.Add("The Gol dips a finger inside, gathering some of her juices up. <i>“Do you want a taste?”</i> She giggles. <i>“Once you try it, you'll never want another woman again. You'll be hooked on my pussy.”</i>", parse);
		Text.NL();
		Text.Add("It's enough to make you chuckle. <i>“Just because I'd be eating you out if I could doesn't mean I'm going to follow you around, worshipping it all day long.”</i> You smirk, then open wide. <i>“Go on, let me have a taste so we can stop this silly game and get to the fucking.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Now that's the kind of eagerness I like to hear from my drones!”</i> The Gol puts her gooey finger on your lip. Her hand blocks your view of her entrance, but that's just fine, you figure. The view would just distract you from the taste. Closing your eyes, you suck her proffered digit into your maw and run your tongue over it, licking her flavorful juices from her knuckle. She tastes like... peaches and cherries mixed together? You pause momentarily, then flick your tongue around the finger, gathering her ambrosia from every nook and cranny. You hum softly as you work, suckling her to the knuckle.", parse);
		Text.NL();
		Text.Add("Even when there's nothing left but your own saliva, you can still feel the taste on your tongue, in your throat, and in your belly. It suffuses your body, fills you with a tingling, bubbling kind of sexual excitement. Here you are, pinned down by this sexy creature, and you can't even use your mouth to please her, let alone your wildly pulsating, dribbling dick. If you put it inside right now, you'd probably cum on the spot. But that's fine. You'd just have to keep fucking her until you could cum a second time. Somehow you know you'd have quite a few wombs to fill.", parse);
		Text.NL();
		Text.Add("Pulling her finger out, the Gol looks between you and her spit-glossed digit. <i>“Well, what do you think, drone? Isn't it a pussy worth worshipping?”</i>", parse);
		Text.NL();
		Text.Add("You lick your lips in an effort to gather every stray mote of flavor into your maw, eyes shining brightly as they openly stare at the alien gash. <i>“It's, uh... pretty good. Scoot forward, would you? Please?”</i>", parse);
		Text.NL();
		Text.Add("The Gol edges her scuttling form forward just enough to press the bottom of her oversized slit against your chin. Strings of her sticky, feminine syrup fall over your face. Heedless of how slick your face is getting, you lean up and press yourself against her, finally getting to touch your tongue directly to this sexy monster-woman's entrance. A shiver wracks your pinned body, and your cock's need explodes from a quiet simmer to a rolling boil. You grunt in ecstasy, muffled by the thick, fertile folds of the mantis-girl's heavenly slit. Cum bubbles out of your [cocks] in thick squirts, your dick harder than its ever felt before.", parse);
		if (growcock) {
			Text.Add(" Every eruption seems to ooze out higher on your body, matched by an increase in the tightness between you.", parse);
		}
		Text.NL();

		Sex.Cunnilingus(player, gol);
		player.Fuck(undefined, 4);
		gol.Fuck(undefined, 4);

		const cum = player.OrgasmCum();

		Text.Add("The Gol chitters in enthusiastic delight, stroking a humanoid hand through your [hair]. <i>“There there. Isn't it wonderful, drone? You're tasting your very purpose - nursing on the nectar of your new life. ", parse);
		if (growcock) {
			Text.Add("After all, what good is a drone if he isn't big enough to seed each of my wombs in turn?”</i> Her pussy's juices thicken, concentrating the flavor that much further. You relish gulping them down all the same, delighted that you're able to taste her that much more strongly. You barely notice[oneof] your [cocks] bumping into the underside of your chin, still oozing alabaster goo.", parse);
		} else {
			Text.Add("After all, what good is a drone if he can't stay hard through a few successive orgasms?”</i> Her pussy's juices thicken, concentrating the flavor that much further. You relish gulping them down all the same, delighted that you're able to taste her that much more strongly. You barely notice fresh, alabaster streams squirting from your [cocks], rolling down either side of your pinned body.", parse);
		}
		Text.Add(" <i>“There's a good drone. Wouldn't it be better to put all that eager cum inside me?”</i>", parse);
		Text.NL();
		Text.Add("Oh gods, yes it would! You peel your face away from your cunnilingual nirvana to answer. Her clear juices hang between your forms in a thick web, glittering in the light before they eventually snap. <i>“Yes!”</i> It's getting hard to think of doing anything but that. You know you were impassioned about proving something to her just a minute ago, but it seems small and unimportant next to the need to flood her delightful honeypot with fertile seed. You rub your palms along her chitinous sides. She'd feel so good swollen with your eggs. If only she'd let you inside! <i>“Please, Queen!”</i>", parse);
		Text.NL();
		Text.Add("You don't know why you called her that, but it felt... right somehow. The powerful, regal creature looms large in stature, both above and in your mind. She deserves to be worshipped. The realization bursts across you like your previous orgasm. Whatever you were trying to prove to her before, this new knowledge supplants it. You know now that proving your loyal worship of your Queen is all that matters. Your [cocks] jump[notS] in agreement.", parse);
		Text.NL();
		Text.Add("<i>She</i> throws back her head and laughs. Her smile looks heartless, but at least it's a smile. <i>“I'm not so sure you've earned the right. I don't let just anyone fertilize my eggs, you know. What's to stop you from running away after you fucked me to orgasm a few times?”</i> She gathers a droplet of her juices on her finger once more and holds it before you. Your eyes cross to watch it. <i>“What indeed.”</i>", parse);
		Text.NL();
		parse.ItsTheyre = player.NumCocks() > 1 ? "They're" : "It's";
		Text.Add("You lick your lips, whimpering. Belatedly, you remember that your Queen expects a response. <i>“Why would I run with you right here?”</i> You tip your head back and open your mouth hungrily, hoping she'll press that droplet to your tongue. It makes talking difficult, but you manage. <i>“Why would I want to stop fucking you?”</i> If you could, you'd gesture at your [cocks]. [ItsTheyre] still pumping bullets of cum from your overactive balls. You’re so horny that it's hard to think. The very idea of stopping just because you've cum seems almost ludicrous.", parse);
		Text.NL();
		Text.Add("<i>“Shhh, shhh...”</i> The Gol presses that droplet to your tongue, letting you suck. <i>“I believe you, drone.”</i> She lifts herself up, pulling her cleaned finger from your pursed lips.", parse);
		Text.NL();
		Text.Add("The sensation of cool air on your [cocks] is almost foreign and, frankly, a little unpleasant. You want the warm tightness of your Queen's underbelly - the hot press of her huge, powerful frame on you.", parse);
		Text.NL();
		if (growcock) {
			Text.Add("And there's so much feeling coming from your crotch! You look down at gasp at the immensity of your erection[s]. You've gotten big enough that you doubt anyone save for the Gol Queen could ever take you again. Like it or not, she's changed you to fit your new role, and the strangest part is that you do like it. You like it very much if the dribbling wads of cum are any indication.", parse);
		} else {
			Text.Add("And what a mess you made while she lavished her affections on you! You're drenched in frothing, ivory cream of your own creation. More still is rolling out of your bloated cocktip[s]. You wonder if you're ever going to completely stop cumming, or if you really care.", parse);
		}
		Text.NL();
		Text.Add("The Gol's skittering legs carry her back toward a comfortable patch of grass, near where her other captives are. None are affected like you. They're all either packing egg-bulged bellies or far-away, hungry looks, but none bear your impressive manhood[s]. She settles next to a glassy-eyed woman and eases the tip of her tail into her willing incubator's cunt. <i>“Come here.”</i> The Gol Queen gestures to you. <i>“You may father the eggs of future hives if you wish, drone-king. All you have to do is cum in here, forever.”</i> She rubs anxiously at her slit, quivering with her own need for breeding.", parse);
		Text.NL();
		Text.Add("Staggering up, you grab hold of your oozing erection[s] and stumble toward your Queen. She needs you, and you need her. You understand that. Without an endless source of cum, she won't be able to spread her hive across the lands. She won't be able to make the rest of the world understand what you do: that there's endless pleasure to be found beneath her scepter.", parse);
		Text.Flush();

		Gui.NextPrompt(() => {
			Text.Clear();
			Text.Add("Walking across the rubble is hard enough without trying to support several feet worth of cum-drizzling cock. The Gol Queen is watching you, though, smiling to herself when your motions cause you to accidentally stroke your sensitive skin and shoot a lance of release across your own path. You nearly fall twice, each time due to your own pleasure, but every step is bringing you closer to your queen and her heavenly scent. There's only a few yards of distance left.", parse);
			Text.NL();
			Text.Add("When you accidentally bump your drizzling member into her belly, you cry out in relief, shooting pent-up loads across her curvy tits. Spunk sluices off both sides and down the middle of her expansive cleavage. You writhe in place, dropping to your knees. Your [cocks] [isAre] lurching wildly as [itThey] erupt[notS]. Rope after rope is falling over your Queen, and all you can think of is how wonderful her flesh feels against you and how her incredible aroma completes your world.", parse);
			Text.NL();
			Text.Add("Giggling, your Queen grabs you pumping length and angles it south. <i>“Why don't we put all this energy to better use?”</i> Guiding your [cockTip] to her lips, she spreads them just enough for your vigorous ejaculation to flow inside. Her cheeks flush in enjoyment, and she sighs, a sound that's heaven to your ears. <i>“There we go. Mmmm, this is just the beginning. Thrust inside, and claim your place as my consort.”</i>", parse);
			Text.NL();
			Text.Add("Tentatively, you wrap your arms around her human waistline and pull yourself forward, pushing inch after inch of climax-craving flesh into her perfect hole. Narrow rings give way for your sperm-slinging length, allowing you deeper access by the second. Somehow you know them to be entrances to successive wombs - wombs that you're glazing in a thick layer of virile fuckjuice. You bottom out, still pumping, still filling your Queen, still cumming until your eyes cross.", parse);
			Text.NL();

			Sex.Vaginal(player, gol);
			gol.FuckVag(gol.FirstVag(), player.FirstCock(), 5);
			player.Fuck(player.FirstCock(), 5);

			Text.Add("Silky softness presses against your back, looping over your shoulders. More of it wraps your hips, your [legs], even your [butt]. Lolling your head back, you try to figure out what's going on. Rational thought is difficult with your dick being constantly milked, but you eventually work out that she's spooling silk out of her mouth to web you in place with. It's like some kind of fuck-sling, keeping you in place so that she can tend to her business without having to stop to breed.", parse);
			Text.NL();
			Text.Add("There's just enough freedom to slide a few inches out and in. Indeed, every movement she takes does that for you. You're able to just sit there, filling her with your jism, lost to pleasure. Sighing in perfect contentment, you let her every movement milk your dick. This is your place now, ensuring that your Queen has all the genetic resources she'll need to spread her hive to every corner of the world.", parse);
			Text.NL();
			Text.Add("You're a good drone, and endless orgasms are your reward.", parse);
			Text.Flush();

			TimeStep({season: 1});

			SetGameOverButton();
		});
	}

	export function CombatWin() {
		const player: Player = GAME().player;
		const enc = this;
		const gol: GolQueen = enc.gol;
		SetGameState(GameState.Event, Gui);

		const parse: any = {
			feet() { return player.FeetDesc(); },
			foot() { return player.FootDesc(); },
		};

		Gui.Callstack.push(() => {
			Text.Clear();
			if (gol.LustLevel() < 0.5) {
				Text.Add("The Gol collapses under the weight of her body now that her strength is exhausted. All six legs splay out, and her human-like torso dips forward, barely held aloft by her four quivering arms. The scepter lies discarded so that she might stay at least partially upright.", parse);
				Text.NL();
				Text.Add("<i>“How? I... so much power. I could do anything! I... was... sure...”</i> she pants. Her eyes gleam with the undimmed light of defiance, but her body, weakened by the fight, is unable to offer up a sliver of resistance.", parse);
				Text.NL();
				Text.Add("The scepter you came for rolls down the heaped rubble to your [foot]. You can grab it and go, but you might never get a chance to make it with a Gol, and she seemed quite keen on breeding with you.", parse);
			} else {
				parse.fem = player.mfFem("king", "queen");
				Text.Add("The Gol takes one shuddering step toward you before collapsing in a heap, moaning and thrashing. Her human arms dive into the simmering sexpot that dominates her crotch while the insectile ones cross behind her back, pressing her huge breasts in your direction enticingly. The flexible extension at the end of her abdomen raises up to point in your direction, dripping long strands of fragrant lubricant. <i>”You... win... Fuck me.... Be hive [fem]. I will serve you. Please! So hot!”</i>", parse);
				Text.NL();
				Text.Add("Forgotten, the scepter rolls down the mound of rubble to stop at your [feet]. You can grab and go, but when will you get another chance to sexually dominate a Gol? Her eyes are glassy with lust, and her expression is pleading.", parse);
			}
			Text.NL();
			Text.Add("For now, the others seem to be gone, along with their captives. Perhaps they’ve retreated to the hive the Gol spoke about… at any rate, you think you have at least some time before they return.", parse);
			Text.Flush();

			// [Hyper fuck][Tailfuck][Cunnilingus][Scepter]
			const options: IChoice[] = [];
			if (player.FirstCock()) {
				const p1cock = player.BiggestCock();

				const cocksInTail = player.CocksThatFit(gol.FirstVag(), true);
				const p2cock = player.BiggestCock(cocksInTail);

				options.push({ nameStr : "Hyper fuck",
					func() {
						GolScenes.CombatWinHyperFuck(enc, p1cock);
					}, enabled : p1cock.Len() >= 61, // > 2'
					tooltip : "It’s not often you find someone who can take a cock as big as yours… the opportunity is too good to pass up.",
				});
				options.push({ nameStr : "Tailfuck",
					func() {
						GolScenes.CombatWinTailfuck(enc, p2cock);
					}, enabled : p2cock.length !== undefined,
					tooltip : "Fuck that tailgina until it’s dripping and leaking eggs!",
				});
			}
			if (player.FirstVag()) {
				options.push({ nameStr : "Cunnilingus",
					func() {
						GolScenes.CombatWinCunn(enc);
					}, enabled : true,
					tooltip : "Have her eat you out.",
				});
			}
			options.push({ nameStr : "Scepter",
				func() {
					Text.Clear();
					Text.Add("No… you shouldn’t forget why you came here. You grab hold of the scepter and back away from the creature, still wary of her.", parse);
					Text.NL();
					Text.Add("<i>”M-my scepter!”</i> she mumbles, reaching after you half-heartedly, but you are able to easily avoid her grasping scythes. Feeling a bit curious, you ask her what it does.", parse);
					Text.NL();
					Text.Add("<i>”I… before, I… don’t remember,”</i> she struggles, faltering on her words. <i>”I remember standing there, the scepter in hand, and it all seemed so clear. I was to be ruler of all!”</i> The Gol shakes her head, a confused look on her face.", parse);
					Text.NL();
					Text.Add("<i>”I was… as none of my race has been before. With this, I could take down even the mighty towers of your people!”</i> You look at the scepter in wonder. Apparently, it holds quite a lot of power… you should be careful to not let it fall in the wrong hands. It seemingly played a role in giving the Gol an intellect far surpassing her old, feral mind. It’s not a stretch to say that it probably did the same for Lagon and his brood.", parse);
					Text.Flush();

					TimeStep({minute: 30});

					Gui.NextPrompt(() => {
						GolScenes.CombatAftermath(enc);
					});
				}, enabled : true,
				tooltip : "Just grab the scepter and go.",
			});
			Gui.SetButtonsFromList(options, false, undefined);

		});
		Encounter.prototype.onVictory.call(enc);
	}

	export function CombatWinHyperFuck(enc: any, p1cock: Cock) {
		const player: Player = GAME().player;
		const gol: GolQueen = enc.gol;
		const lusty = gol.LustLevel() >= 0.5;

		let parse: any = {
			cocks() { return player.MultiCockDesc(); },
			cock() { return p1cock.Short(); },
			cockTip() { return p1cock.TipShort(); },
			skinDesc() { return player.SkinDesc(); },
			legs() { return player.LegsDesc(); },
			hips() { return player.HipsDesc(); },
			balls() { return player.BallsDesc(); },
			chest() { return player.FirstBreastRow().Short(); },
		};

		parse = Text.ParserPlural(parse, player.NumCocks() > 1);
		parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");

		Text.Clear();
		parse.c = player.NumCocks() > 1 ? Text.Parse(", followed shortly by its smaller brother[s2]", parse) : "";
		Text.Add("There's no point in delaying satiation any longer. You pull your [cock] out into the open air[c]. Surging powerfully, [itThey] rush[notEs] toward full tumescence with a speed that makes your head light and your loins ache. You waver, pumping it with idle strokes while you adjust to the repositioning of so much blood. Veins pump powerfully against your palms, and you let out a quiet sigh of contentment. You've finally met someone that can take what you have to offer.", parse);
		Text.NL();
		if (lusty) {
			Text.Add("Drooling all over herself, the Gol gushes in more ways than one, <i>“Such a big dick! It could give me many young. Are we to breed now?”</i>", parse);
		} else {
			Text.Add("The Gol's eyes perk up at the sight of your length, and both her super-sized box and the pussy at the end of her tail release long strands of condensed lust. <i>“Allow me to compensate you for sparing me. Such a... strapping... hero deserves a reward.”</i>", parse);
		}
		Text.NL();
		Text.Add("You barely hear her words over the sound of your heartbeat hammering in your ears. It sounded like she wanted you to fuck her, which is fine by you. After all, you didn't whip out your [cock] just to jack off. She wanted to breed a hive. It's up to you to see her every hole so thoroughly creamed that she's too busy being pregnant to bother anyone else, at least for a while. A clear drop of pre-cum beads from your [cockTip] as if conjured by your lascivious musings or tugged out by the simple presence of a hyper-fertile pussy.", parse);
		Text.NL();
		if (!lusty) {
			Text.Add("You help the soon-to-be gravid insect to lift her battered torso, if only to get better access to the glistening delta below. ", parse);
		}
		Text.Add("Broken boards creak as you traverse the shattered wagons of the caravan on your way to your prize. The air is muggy with arousal. Closer now, you can make out the obscene shine of her engorged lips, the way they quiver against one another. Sometimes, they spread apart, suspending a web of promising lubricant between themselves. For once, you feel that a fly falling into a web might be lucky indeed. Sliding a hand along your immense shaft, you cannot resist smiling, for you are no mere fly.", parse);
		Text.NL();
		Text.Add("You are a battering ram - an unstoppable force here to plow her lips wide open and leave her pussy forever aching at the memory of being so wholly filled.", parse);
		Text.NL();
		Text.Add("<i>“Please,”</i> the Gol cries, holding her lips open. <i>“Put it inside me. I have... I've never found a male big enough to satisfy me properly.”</i> Her legs, all of them, quiver. <i>“I think you could.”</i>", parse);
		Text.NL();
		Text.Add("While a part of you would like to hold back to tease her, really put her through the wringer for making you work so hard, your crotch's pernicious need is making it difficult to think of anything but sliding into that gilded canal. <i>Fuck it,</i> you decide. It takes both hands to align your bulky dick with its target and all your will not to spastically thrust at the first nerve-sizzling contact. You thrust in what feels like a concession to baser instincts, but control your push forward into a controlled exploration. The sensation of her alien vagina closing around your [cockTip] is unlike any you have experienced before. It gives with an easy elasticity that would make you assume her loose, but it clings to every inch of you, even recessed edges half-hidden behind veins.", parse);
		Text.NL();

		Sex.Vaginal(player, gol);
		gol.FuckVag(gol.FirstVag(), p1cock, 6);
		player.Fuck(p1cock, 6);

		Text.Add("The first half foot or so has already entered her, and you rapidly become aware of something you didn't expect - her heat. She's hot. Not just warm, but almost feverishly hot. Her channel suffuses you with strange calefaction that makes sweat break out on your [skinDesc], running down the nape of your neck as you work your way inside.", parse);
		Text.NL();
		Text.Add("The Gol gasps, <i>“A-ah! Almost to my first womb!”</i>", parse);
		Text.NL();
		Text.Add("First womb? The feeling hitting an obstruction confirms it. You've hit whatever she has that passes for a cervix, but the mantis-woman does not grunt with pain or discomfort. Her jaw drops, and her tongue lolls in what can only be supreme pleasure. She gasps and shakes, her body reacting to you on instinct. You feel that barrier... weaken dramatically. Belatedly, you realize that you're still pushing against it, and before you can stop, it spreads around you, a tight ring that hugs your [cock], squeezing it as you burrow deeper.", parse);
		Text.NL();
		Text.Add("<i>“Deeper!”</i> the Gol cries.", parse);
		Text.NL();
		Text.Add("You're already pushing into her womb! How much more can she handle? You know you shouldn't feel guilty after what she tried, but neither do you want what should be a good, hard fuck to turn into a painful mess. Still, she <i>is</i> egging you on. You look at her face for signs of discomfort and, finding only sublime enjoyment, you push inside.", parse);
		Text.NL();
		Text.Add("At once, you're aware of a slight difference in texture. Its sides are pebbly and not quite as heavily lubricated, yet there is pussy juice enough for a human whore to envy. The Gol's womb is not as clingy as her outer passage either. The vacuum-like seal you've enjoyed is replaced by a gentler, uterine hug. Groaning as paroxysms of pleasure wrack your body, you lose control and thrust, slamming six more inches inside.", parse);
		Text.NL();
		Text.Add("Drooling now, the Gol's lower lip quivers, and her human eyes roll back in their sockets. She pants, <i>“Second... second womb. Yours....”</i>", parse);
		Text.NL();
		Text.Add("Sure enough, your [cockTip] feels a change in the smoothness of her tunnel, finding itself surrounded in a sleeve of the finest velvet, squeezed from every angle. You come upon what can only be another cervix, pushing through it with even greater ease than the first. The face of your once-foe is rendered almost comic by her reaction, mouth agape and nostrils flaring. Her bosom heaves, and her feminine juices squirt over your [legs]. Grinning, you venture deeper.", parse);
		Text.NL();
		Text.Add("<i>“Take all twelve!”</i> the prodigiously fertile insect declares in a sudden burst of cognizance. <i>“All my wombs! Take them!”</i> Her human arms reach up to your shoulders and squeeze imploringly while the beast-woman's tongue dangles to run over your [chest].", parse);
		Text.NL();
		Text.Add("Armed with better knowledge of your host's capabilities, you stop holding yourself back. You let your [hips] pull back and hammer forward. Cervixes dilate around your girth, turning the juicy pussy into a frothing, ring-lined fuck-tunnel with bands of titillating texture. The next pistoning thrust takes you through at least six of them and feels far too good for you to maintain your concentration. Growling, you grab the mantis-girl's sides and pound away, thrilling her by the sound of her blissful shrieks and lurid moans.", parse);
		Text.NL();
		Text.Add("You're delighted to find the chitinous surface of her breasts to be far softer than the rest of her body when an overenthusiastic motion carries your head into them. They're still firmer than human tits, but still soft enough to conform to your face. Your sexual ardor bids you to stay and enjoy them. It's as comfortable a place as any to hold your torso while your lower body pounds away, filling the air with a symphony of wet squishing.", parse);
		Text.NL();
		if (p1cock.Len() < 122) { // 4'
			Text.Add("Your waist contacts the Gol's before you know it, signalling the complete envelopment of your rod. You haven't even fully plumbed her depths yet. She's too deep, even for you. Resuming your forceful fucking, you consider that bottoming out is far better than being too big to fit inside and wrap your arms around the sapient insect-woman's waist for a better grip. Your bodies, lubricated by the slickness of her sex, slip and slide against one another with every dick-hilting thrust. Your voices are little more than grunts and groans. Reason long ago fled both your forms, replaced with simmering need and undiluted ecstasy.", parse);
		} else if (p1cock.Len() < 152) { // 5'
			Text.Add("You feel yourself hit what must be the edge of the Gol's last womb about the same time that your hips slap into her waist, fully embedding your tool to the hilt. It's like she was made for you. Taking a moment to savor this once in a lifetime opportunity, you grab her waist. Then, you resume your forceful fucking. Reason long ago fled your forms, and you twist and writhe against each other, lubricated in what feels like a curtain of your lover's gushing lube. Her groans mix with your grunts, filling the air with the sounds of simmering need mixed with undiluted ecstasy.", parse);
	} else {
			Text.Add("You feel yourself hit what must be the edge of the Gol's last womb long before you manage to bottom out. She's doesn't seem to mind, in the slightest. If anything, her trembling moans transform in throaty groans as you test her limits. She's clearly not been so filled in an age, and she loves it. Her abdomen looks swollen and distorted from the tremendous insertion, packed full of potential virility. She looks almost regretful that she can't take more of you, but undiluted ecstasy steals the expression away as soon as it comes. It barely matters anyway; she can handle a pretty tremendous amount of cock, ensuring you're suffused with pleasure.", parse);
	}
		Text.NL();
		parse.len = p1cock.Len() >= 152 ? " despite the lack of any room for you to go" : "";
		Text.Add("Lost in coital bliss, you fervently pump away, goaded on by the ebullient cries of the wriggling Gol. She lurches into orgasm, squirting what feels like a waterfall of her girlish honey down your legs, twisting in place so violently that the piled wreckage shifts dangerously. Her tunnel clenches and squeezes, almost unbearably warm against your flesh, pulling you deeper[len]. Her voice begs, <i>“Please! Fertilize me!”</i>", parse);
		Text.NL();
		parse.b = player.HasBalls() ? Text.Parse("[balls] clench", parse) : "body clenches";
		Text.Add("You feel the coiled tension of bubbling potentiality welling up from within, almost unbearable at this point. You can't say if you were close from the constant, rutting fuck you were giving her or if the honest, plaintive tone of the monstrous woman's request pushed you past your limits, but you are sure of one thing: you're going to cum, and cum hard. The coil inside you twists into an overtensioned spring, and then it releases - you release, arching your back as your [b], pumping thick wads of goo through your plus-sized tool. You feel like a living bolt of white-hot lightning, grounding through the pulsating walls of your mantis lover.", parse);
		Text.NL();

		const cum = player.OrgasmCum();

		if (cum > 6) {
			Text.Add("You erupt into her cavern, flooding it with spurts that could easily fill buckets. Alabaster cream froths around from her lips, cascading down her abdomen. Every inch of her alien vagina is painted white, marinated in fuck-juice.", parse);
		} else if (cum > 3) {
			Text.Add("You flood her cavern with what feels like gallons of your ivory spunk, pumping and thrusting until drops of cream are oozing out of her alien slit.", parse);
		} else {
			Text.Add("You spend every drop you have inside her, and then spend a little more.", parse);
		}

		Text.NL();
		Text.Add("You stay inside her until you begin to go soft. Her upper body sags against you, the strength all but gone out of it. The lower half, oozing mixed cum and only weakly twitching, doesn't show any signs of recovering any time soon. You pull out, enjoying the groan of pleasure the Gol gives up, and step away, panting for breath, exhausted.", parse);
		Text.NL();
		Text.Add("The scepter sits a short distance away. Gathering your equipment, you walk over to grab it, sparing a look at the well-fucked creature behind. She's a little drunk looking and blushing, wearing the kind of look that unequivocally commends you for a job well done.", parse);
		Text.Flush();

		TimeStep({hour: 1});

		Gui.NextPrompt(() => {
			GolScenes.CombatAftermath(enc);
		});
	}

	export function CombatWinTailfuck(enc: any, p1cock: Cock) {
		const player: Player = GAME().player;
		const gol: GolQueen = enc.gol;
		const lusty = gol.LustLevel() >= 0.5;

		let parse: any = {
			cocks() { return player.MultiCockDesc(); },
			cock() { return p1cock.Short(); },
			cockTip() { return p1cock.TipShort(); },
			skinDesc() { return player.SkinDesc(); },
			legs() { return player.LegsDesc(); },
			hips() { return player.HipsDesc(); },
			balls() { return player.BallsDesc(); },
		};

		parse = Text.ParserPlural(parse, player.NumCocks() > 1);
		parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");

		Text.Clear();
		Text.Add("With a randy smile, you free your [cocks], hefting the engorging length[s] as you look over the prone Gol. Your eyes flick down her chitin-covered breasts toward the huge, dripping gash at her crotch, then along her side to the dripping entrance at the end of her tail. That entrance is far more appropriately sized for[oneof] your [cocks]. You step forward and stroke yourself to the sight of your alien prize, leaving her no doubt as to your intentions.", parse);
		Text.NL();
		Text.Add("<i>“Yes...”</i> the Gol hisses, <i>“your seed will make our children strong.”</i> She squirms on the rubble, twisting to present her insectile backside to you. It ripples from stem to stern, culminating in a gush of fluid from her pussy packing tail. She wiggles it back and forth and smiles over her shoulder. <i>“Go ahead. Stick it in. This will drink your essence as freely as the other.”</i> She digs her scythe-tipped arms into the rubble to stabilize herself. Her torso is bent low and her swollen abdomen raised up to present to you.", parse);
		Text.NL();
		Text.Add("You're more interested in plugging her full of cum than in what she does with it after you leave. Lining your [cock] up with that oddly twitching hole, you hesitantly ease your [hips] forward. The Gol's rear entrance doesn't look like any you've seen before. It's puffy, sure, but it's also completely round and devoid of any form of recognizable clitoris, ringed with soft folds where the engorged flesh has compressed itself. The moisture it continually drips fogs the air with the muggy scent of fuck, and you can feel the swampy heat washing over your dick like a breathy whisper.", parse);
		Text.NL();
		Text.Add("The first contact on your [cockTip] elicits a pleased gasp from your lips. There's nothing quite like the first touch of another's body to your own, particularly when that touch comes from a body part that's smooth enough to glide across but textured enough to titillate your densely-packed nerves.", parse);
		Text.NL();
		Text.Add("The Gol squirms beneath you, forcing you to grab hold of her tail to keep it from sliding off. She pants, <i>“Please... it's sensitive.”</i>", parse);
		Text.NL();
		Text.Add("She should have thought of that before she tried to rape you along with the rest of her victims. You hold onto her squirming tailpussy with both hands, revelling in the feel of its slick surface polishing your glans, and thrust, burying your eager length into her simmering slot's folds. The Gol arches her back, her eyes wide and her mouth gaped. Her humanoid arms briefly flail before falling bonelessly slack. She lets out a full-body moan that vibrates the whole way through her body to her pudendum, spurring you to grind more firmly against the dripping entrance.", parse);
		Text.NL();

		Sex.Vaginal(player, gol);
		gol.FuckVag(gol.FirstVag(), p1cock, 5);
		player.Fuck(p1cock, 5);

		Text.Add("Your forceful thrusts soon have the mantis-woman almost face-down in the rubble. Her high-pitched moans mix pleasantly with your own licentious groans. She's stopped being so damned wiggly everywhere except where it counts, enabling you to shift your grip further up the back of her abdomen and begin to properly thrust against the undulating folds. The Gol's rear pussy feels simply divine, smoother than velvet, slicker than the finest lubricant. It grips you tightly as you plunge in, and wriggles against you as you slide out, your length dripping with iridescent wetness.", parse);
		Text.NL();
		parse.male = player.mfFem("male", "seeder");
		Text.Add("<i>“Does this please you? A mighty [male] like you perhaps craves a tighter fit,”</i> the Gol offers in between almost delirious moans. <i>“Like this.”</i> Her tailpussy contracts down on your [cock], twisting slightly in order to grip you more firmly. Your [legs] nearly buckle from the onslaught of sensation. You grab hold of her rearmost legs just to keep from sliding out. Then, those sinfully squeezing muscles flex, drawing you back into the root. You cry out as your [cock] is forcefully pumped and squeezed, expertly tugged until it feels like your pre is spilling out in one unceasing flow.", parse);
		Text.NL();
		Text.Add("Hanging like that, practically suspended by the Gol's hungry entrance, you try to master your quivering thighs, to ignore the starbursts of pleasure bursting behind your eyelids. You're so close now, so very close, and your body just won't listen. The battle to overcome the paralyzing pleasure and give this monstrous woman the proper fucking she deserves proves more trying than the conflict that preceded it. Nevertheless, you manage to muster your strength and pull back, if only to slam your [cock] home once more.", parse);
		Text.NL();
		Text.Add("The Gol shudders, and her shoulderblades shift in the most delightful way, highlighting the perfect arch her back is making. She's not looking back anymore; her body is too wracked with ecstasy for her to watch you enjoy her back door any longer. Flecks of her girl-honey splatter over the ground below with each powerful hump. She may be still be inhumanly tight, but the tightness is now driving you to pound it all the harder. You're determined to fuck the exotic pussy into your sloppy, slippery mate, determined to ravish it wholly and utterly.", parse);
		Text.NL();
		Text.Add("The coiling bliss inside you twists tighter, and you realize that you're going to cum soon. Whether you thrust a few last times or pull out, climax is almost upon you. The only difference is whether you give the Gol what she wants and relish the last few seconds of her oh-so-tight embrace, or pull out and paint her insect half white.", parse);
		Text.NL();
		Text.Add("Do you cum inside or outside?", parse);
		Text.Flush();

		TimeStep({hour: 1});

		// [Inside] [Outside]
		const options: IChoice[] = [];
		options.push({ nameStr : "Outside",
			func() {
				Text.Clear();
				Text.Add("Not seeing any point in giving her any bastards to remember you by, you yank your hips backward as pleasure overwhelms you. Your [cocks] give[notS] one last fitful pulse before finally releasing, throwing long ropes of seed into the air.", parse);
				Text.NL();

				const cum = player.OrgasmCum();

				if (cum > 6) {
					Text.Add("They splatter so heavily that the first two effectively glaze her emerald chitin, and the cummy bursts that follow cause a rain of spunk to fall on the ground below.", parse);
				} else if (cum > 3) {
					Text.Add("They splatter thickly across the moaning mantis's back, leaving it half painted in a coat of glittering alabaster.", parse);
				} else {
					Text.Add("They splatter across the moaning mantis's back, leaving her with ivory stripes on her emerald chitin.", parse);
				}

				Text.NL();
				Text.Add("<i>“Nooo!”</i> the Gol cries as your orgasm dies down to fitful dribbles. Her soaking-wet entrance quivers, empty and unfilled.", parse);
				Text.NL();
				Text.Add("The Gol looks back over her shoulder at you with an expression of confused lust. You can hear the sound of her fisting her frontal entrance all the same, but judging by the expression on her face, she'd like to tear you limb from limb as much as fuck you. Luckily for you, she's still a quivering, defeated wreck. You grab your things and the scepter, whistling jauntily.", parse);
				Text.Flush();

				Gui.NextPrompt(() => {
					GolScenes.CombatAftermath(enc);
				});
			}, enabled : true,
			tooltip : "Pull out; she’s not worthy of your seed.",
		});
		options.push({ nameStr : "Inside",
			func() {
				Text.Clear();
				Text.Add("Not content to waste your cum on her smooth chitin, you jackhammer a few last strokes home, each harder than the one that preceded it, propelled on increasingly tight spasms of pleasure. The Gol wriggles below you, throatily hissing, <i>“Yesssssss,”</i> while her body squirms, inside and out, pumping your [cock] as if she could milk every drop from you via contraction alone.", parse);
				Text.NL();
				Text.Add("The realization that she's orgasming hits you about the same time as your own.", parse);
				Text.NL();

				const cum = player.OrgasmCum();

				if (cum > 6) {
					Text.Add("Your first blast feels more like releasing a pressurized vessel than firing a rope of cum, and it floods her passage to capacity in short order. You gasp a quick breath just before the second starts, bracing yourself for the onslaught of white-hot pleasure that accompanies the feeling of flooding the mantis's middle. Cascades of jism flow out of her tailcunt's entrance, but nowhere near the volume that you're putting in. You swear that her insectile abdomen is actually inflating with the immense, virile load. She doesn't offer comment, too busy looking at you with a kind of sated wonder on her face.", parse);
				} else if (cum > 3) {
					Text.Add("You flood her tunnel with copious spurts of thick cum, filling the slight gaps in her folds to brimming with salty whiteness. She squeezes you tighter, trying to wring every drop from you, though in the process she winds up forcing some out to drip onto your thighs, mixed with her own effluence. A sated smile forms on her face as she looks at you.", parse);
				} else {
					Text.Add("You pump every drop into her needy tunnel and gasp when she squeezes you for more, wringing every last drop of creamy virility from your form. Evidently, it's not enough for her given the way that continues to tug your softening member, though her face looks sated all the same.", parse);
				}

				Text.NL();
				Text.Add("The monstrous woman's powerful contractions lead you to stay inside her for far longer than you otherwise would have. Or perhaps it's the way her pheromones linger in your head, making it oh so easy to think with your [cocks]. No matter the cause, you stay there until you're half limp and exhausted, withdrawing once she finally stops milking your length. Puddles of sexual fluid soak the rubble-covered ground for feet in every direction, and your lower body is practically coated in fuckjuice.", parse);
				Text.NL();
				Text.Add("You stagger away toward the scepter. You got your prize, and she got the cum she wanted. Win-win, right?", parse);
				Text.Flush();

				Gui.NextPrompt(() => {
					GolScenes.CombatAftermath(enc);
				});
			}, enabled : true,
			tooltip : "Cream her up good!",
		});
		Gui.SetButtonsFromList(options, false, undefined);

	}

	export function CombatWinCunn(enc: any) {
		const player: Player = GAME().player;
		const gol: GolQueen = enc.gol;
		const lusty = gol.LustLevel() >= 0.5;
		const p1cock = player.BiggestCock();

		let parse: any = {
			cocks() { return player.MultiCockDesc(); },
			cock() { return p1cock.Short(); },
			cockTip() { return p1cock.TipShort(); },
			skinDesc() { return player.SkinDesc(); },
			legs() { return player.LegsDesc(); },
			hips() { return player.HipsDesc(); },
			balls() { return player.BallsDesc(); },
			vagina() { return player.FirstVag().Short(); },
			clit() { return player.FirstVag().ClitShort(); },
			asshole() { return player.Butt().AnalShort(); },
		};

		parse = Text.ParserPlural(parse, player.NumCocks() > 1);

		Text.Clear();
		Text.Add("You figure she should at least tongue you out for getting you so worked up. Walking through the splintery wreckage, you draw closer to the monstrous insect-woman. She coos in excitement, slipping a fist into her tremendous gash. Her eyes drift half-closed, and she pants, <i>“Fuck me now?”</i>", parse);
		Text.NL();
		Text.Add("You shake you head and tell her to stick out her tongue. She's almost within arm's reach now.", parse);
		Text.NL();
		Text.Add("The Gol frowns, looking confused. <i>“Tongue?”</i>", parse);
		Text.NL();
		Text.Add("You nod, explaining that you want to have a look at it. After all, you plan to make good use of it in a moment.", parse);
		Text.NL();
		Text.Add("Confused for a second, the monstrous woman cocks her head to the side. Then, she moans, letting her tongue roll out of her mouth all at once. It's a gleaming pink thing, at least a foot long and wiggling unsubtly in your direction. Thick, viscous saliva drips from the organ as it wavers  before you, eagerly reaching for your passion-inflamed groin. That will do.", parse);
		Text.NL();
		Text.Add("You waste no time in disrobing and move toward the squirming muscle, cooing slightly at the touch of it on your moistened gates. It flexes against your vulva in a way that you can only describe as beautiful. Your [hips] quiver and lurch, edging closer and closer to the Gol's lips while your hands reach out in search of support. They alight on the insect queen's head, finding purchase in her hair.", parse);
		Text.NL();
		Text.Add("The Gol's tongue insistently presses against your skin, somehow hotter than it felt a moment before. You arch forward, close enough for ", parse);
		if (player.FirstCock()) {
			Text.Add("your [cocks] to rub against her forehead", parse);
		} else {
			Text.Add("your clit to caress the chitin-covered nose", parse);
		}
		Text.Add(". The mantis-woman appears content to let you control the pace. Her two bladed arms are firmly fixed behind her back, and the human-like pair is too busy plunging into her overheated gash to do anything else. Her breath bursts across your own slit in explosive, humid puffs.", parse);
		Text.NL();
		Text.Add("You haven't even felt what that tongue would feel like inside you, and you're already as wet as a bitch in heat! You shiver, croaking, <i>“More!”</i> Your hands twist, tugging on the creature's locks to finally mate its lips to your ardor-swollen ones, forcing the girthy base of her tongue to arc up into your steamy crevice. The insectile proboscis wriggles in an impossible seeming way, bending itself into an upside-down 'u' shape that gets taller by the second. The tip flickers across your [asshole]. Her tastebuds' texture sends tingles up your spine, and you pucker uncontrollably. A startled gasp escapes in your mouth in response, but you do not pull away.", parse);
		Text.NL();

		Sex.Cunnilingus(gol, player);
		gol.Fuck(undefined, 4);
		player.Fuck(undefined, 4);

		Text.Add("The Gol's tongue has your pussy enspelled with its pernicious wiggles and libidinous energies. You clamp around it, rapt to the sensation of it stretching higher, gradually pulling the tip up the bottom of your slit. The magnificent muscle twists itself, contorting into a cunt-stroking double-helix. White-knuckled, you hang on for dear life, already feeling anxious flutters in your belly. You're so close to cumming, and yet you've barely begun to sample the Gol's oral talents!", parse);
		Text.NL();
		Text.Add("The air is redolent with the sounds of gushing-wet vaginas being serviced. With the heated tongue lodged deep inside you, licking at your cervix as it contorts, you feel like you're more red-hot furnace than girl. If it rained, you'd probably kick up a cloud of steam. Everything smells muggy with the scent of need and fuck. The Gol's pheromone charged cunt may hang thick in the air, but the scent of your [vagina] is there too. It's a lighter note in a bouquet of sexual perfume. Riding high in the scents and sounds of your victory tryst, you thrust your mound harder against the bug slut's face, grinding your way to an orgasm you couldn't have avoided if you wanted to.", parse);
		Text.NL();

		const cum = player.OrgasmCum();

		if (player.FirstCock()) {
			parse.ItThey = player.NumCocks() > 1 ? "They" : "It";
			parse.cl = player.FirstVag().clitCock ? "" : Text.Parse(", centered on your [clit]", parse);
			Text.Add("Your forgotten dick[s] lurch[notEs] on spreading cascades of pleasure[cl], jutting high and proud above the Gol's mane. [ItThey] pulse[notS] fitfully before the muscles behind [itThem] find their rhythm, expelling", parse);
			Text.NL();
			if (cum > 6) {
				Text.Add("gooey eruptions of jizz all over your former foe's crown. A head-obscuring wave rolls down her, masking her features behind a veneer of ivory, and the blasts that follow wreathe her torso in a robe of pure pearlescence. She could almost pass as a pope of pussy pleasing if fresh waves of jism weren't constantly falling down her, ruining the illusion. It would be a worthier title than any the scepter could bestow.", parse);
			} else if (cum > 3) {
				Text.Add("virile streams of cum onto your former foe's head. Your spunk bathes her crown in a hood of pearlescent goo. She could almost pass for a priestess of herm-pussy. A worthier title than any the scepter could have afforded her.", parse);
			} else {
				Text.Add("hot globules of cum over your former foe's head. She gains a crude, white-tinted crown that marks her, for now, as queen of the cunt-lickers. A worthier title than any the scepter could have afforded her.", parse);
			}
		}
		Text.NL();
		Text.Add("Arcs of pure, electric pleasure ricochet around your skull, tearing conscious thoughts asunder as they go. Some of your muscles lock while other turn to jelly. Your fingers have a death-grip on the Gol's hair, yet your [legs] are quivering almost bonelessly. Your [vagina] is somewhere in the middle, alternatively clenching and fluttering around the long-tongued monster's ropey muscle. The nerves inside you are on overdrive, so sensitive that you swear you can feel every single taste-bud as it rubs against your folds. Screaming, you let your mind shut down and simply enjoy the pleasure as your juices gush down the insect-woman’s chin.", parse);
		Text.NL();
		Text.Add("Your strength ebbs as the ecstasy subsides, and unable to support yourself, you slide off the captive bug-girl into a shuddering heap. Her thrashing tongue retracts into her mouth only to come out with a fresh coat of saliva and a new mission; it swirls across her lips, cheeks, and face, gathering every single drop of your liquid love to devour. All the while, her hands continue to rampantly fist at the plus-sized pussy a few feet below.", parse);
		Text.NL();
		Text.Add("The Gol bends down, one arm disappearing up to the elbow. The other joins it a brief second later. Looking back at you, the Gol moans, and her human eyes flutter closed, leaving the four insectile ones to keep staring. Juices froth around her elbows. With a bestial howl, the Gol cums, unleashing a torrent of bubbly cunt-juice in your direction. It washes over you, bathing you in her scent, her taste... her everything.", parse);
		Text.NL();
		Text.Add("She collapses with a sad smile, her torso dropping to lay next to you, heaped upon her pillowy breasts and on the edge of unconsciousness.", parse);
		Text.NL();
		Text.Add("You could grab the scepter and your things and take off if you wished, but being so covered in her pheromones has left you feeling surprisingly giddy. Your netherlips feel even puffier than before, greedy for a touch, making that vaguely phallic, leaking tail look far more appetizing than it did a minute ago.", parse);
		Text.NL();
		Text.Add("<i>”I have… other things that could go inside your pussy,”</i> the Gol offers, her voice shaky but mesmerizing. <i>”Just lay back… I will fill you with my eggs, yes...”</i> Her tail twitches enticingly.", parse);
		Text.Flush();

		TimeStep({hour: 1});

		player.AddLustFraction(1);

		// [Stick It In] [Scepter]
		const options: IChoice[] = [];
		options.push({ nameStr : "Stick it in",
			func() {
				Text.Clear();
				Text.Add("You lie back in a daze, allowing the Gol to loom over you, covering your body in a sticky goo that drips from hidden glans on her body. When you realize what it’s for, it’s already too late; the strands have hardened into a cocoon around you, only exposing your head and nether region. The stuff is strong as steel, and you can barely move a muscle.", parse);
				Text.NL();
				Text.Add("<i>”Worry not, little one,”</i> the mantis-woman drones in a singsong voice. <i>”I shall fulfill your desires… ease the aching in your loins.”</i> She hovers over you, her tantalizing ovipositor <i>just</i> outside your reach.", parse);
				Text.NL();

				GolScenes.CombatLossIncEntry(gol);
			}, enabled : true,
			tooltip : "Yes… you want her to take you...",
		});
		options.push({ nameStr : "Scepter",
			func() {
				Text.Clear();
				Text.Add("No! You shake off the effects of the pheromones as best as you can. This creature wanted to enslave you and make you into a breeding slut not half an hour ago, you should know better than to let it take control.", parse);
				Text.NL();
				Text.Add("The Gol gives out a disappointed cry as you grab the scepter and back away from her, but she stays put, knowing better than to fight you.", parse);
				Text.Flush();
				Gui.NextPrompt(() => {
					GolScenes.CombatAftermath(enc);
				});
			}, enabled : true,
			tooltip : "Grab the scepter and go, before you lose yourself.",
		});
		Gui.SetButtonsFromList(options, false, undefined);
	}

	export function CombatAftermath(enc: any) {
		const parse: any = {

		};

		Text.Clear();
		Text.Add("Scepter in hand, you have what you came here for. A pity you couldn’t do anything for the poor souls that the Gol waylaid, but it looks like they’re long gone, dragged back to the hive. Just as well; you’re quite glad you didn’t have to face ten of these beasts at once. One thing is for sure, there’s still more of them out there, somewhere.", parse);
		Text.NL();
		Text.Add("Now; what are you to do with this one? Despite the thorough trashing you gave it, the creature looks like it’s slowly recovering, wobbling back on its legs unsteadily. There’s something… different about it, however. There is a wild look in her eyes, and she’s making very strange insectile sounds, interspersed with fragmented speech.", parse);
		Text.NL();
		Text.Add("<i>”No… you can’t… zzzgh… my rod… schee...”</i> she pants, wobbling from side to side. With a hungry look in her eyes, the Gol takes a few steps toward you with her scythe-like arms stretching for her treasured prize, only for her to fall down on her knees, shaking.", parse);
		Text.NL();
		Text.Add("<i>”M-mine!”</i> she cries, one last futile outburst. What little humanity she had seems to have left her completely; without the scepter, she seem to be nothing more than a feral bug once again. She almost looks a bit pitiful, but you are mindful of her sharp scythes flailing about.", parse);
		Text.NL();
		Text.Add("That reminds you… you really shouldn’t be staying around. Already, you can hear the buzzing of the drones returning to aid their queen - dozens of them skittering toward you with bared fangs. Not wanting to take on the entire hive, you hastily make your exit, the angry drones hard on your trail. The last you see of the Gol queen, she’s still trying to get to her feet, scrabbling mindlessly and hissing at her minions.", parse);
		Text.NL();
		Text.Add("You somehow manage to make your way back to the king’s road in one piece - the drones left you alone as soon as you left the canyon behind you. This isn’t the end of the threat however, and you shudder, knowing that you may have to fight these beasts again in the future. At least they won’t have the mind-altering scepter then.", parse);
		Text.NL();
		Text.Add("You should bring this back to the burrows as soon as you can, and perhaps alert the guards in Rigard of this threat.", parse);
		Text.NL();
		Text.Add("<b>You’ve acquired Lagon’s scepter.</b>", parse);
		Text.Flush();

		GAME().burrows.flags.Access = BurrowsFlags.AccessFlags.Stage5;

		Gui.NextPrompt();
	}

}
