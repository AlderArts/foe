/*
 *
 * Lizard, lvl 1-2
 *
 */

import { Abilities } from "../abilities";
import { Images } from "../assets";
import { AppendageType } from "../body/appendage";
import { LowerBodyType } from "../body/body";
import { Cock } from "../body/cock";
import { Color } from "../body/color";
import { Gender } from "../body/gender";
import { Capacity, Orifice } from "../body/orifice";
import { Race, RaceScore } from "../body/race";
import { Encounter } from "../combat";
import { Element } from "../damagetype";
import { EncounterTable } from "../encountertable";
import { Entity } from "../entity";
import { Sex } from "../entity-sex";
import { Player } from "../event/player";
import { GAME, TimeStep, WorldTime } from "../GAME";
import { GameState, SetGameState } from "../gamestate";
import { Gui } from "../gui";
import { AlchemyItems } from "../items/alchemy";
import { AlchemySpecial } from "../items/alchemyspecial";
import { IngredientItems } from "../items/ingredients";
import { IChoice } from "../link";
import { Party } from "../party";
import { PregnancyHandler } from "../pregnancy";
import { Text } from "../text";
import { TF } from "../tf";

export class Lizard extends Entity {
	constructor(gender: Gender) {
		super();

		this.ID = "lizard";

		if (gender === Gender.male) {
			this.avatar.combat     = Images.lizard_male;
			this.name              = "Lizard";
			this.monsterName       = "the male lizard";
			this.MonsterName       = "The male lizard";
			this.body.cock.push(new Cock());
			this.body.cock.push(new Cock());
			if (Math.random() < 0.1) {
				this.Butt().virgin = false;
			}
		} else if (gender === Gender.female) {
			this.avatar.combat     = Images.lizard_fem;
			this.name              = "Lizard";
			this.monsterName       = "the female lizard";
			this.MonsterName       = "The female lizard";
			this.body.DefFemale();
			this.Butt().buttSize.base = 4;
			if (Math.random() < 0.9) {
				this.FirstVag().virgin = false;
			}
			if (Math.random() < 0.4) {
				this.Butt().virgin = false;
			}
		} else {
			this.avatar.combat     = Images.lizard_fem;
			this.name              = "Lizard";
			this.monsterName       = "the herm lizard";
			this.MonsterName       = "The herm lizard";
			this.body.DefHerm(false);
			this.Butt().buttSize.base = 4;
			if (Math.random() < 0.5) {
				this.FirstVag().virgin = false;
			}
			this.body.cock.push(new Cock());
			if (Math.random() < 0.5) {
				this.Butt().virgin = false;
			}
		}

		this.maxHp.base        = 40;
		this.maxSp.base        = 20;
		this.maxLust.base      = 25;
		// Main stats
		this.strength.base     = 10;
		this.stamina.base      = 13;
		this.dexterity.base    = 13;
		this.intelligence.base = 11;
		this.spirit.base       = 11;
		this.libido.base       = 14;
		this.charisma.base     = 15;

		this.elementDef.dmg[Element.mFire]    =   0.5;
		this.elementDef.dmg[Element.mIce]     =  -0.5;
		this.elementDef.dmg[Element.mWater]   = -0.25;
		this.elementDef.dmg[Element.mThunder] =  -0.5;

		this.level             = 1;
		if (Math.random() > 0.8) { this.level = 2; }
		this.sexlevel          = 1;

		this.combatExp         = this.level;
		this.coinDrop          = this.level * 4;

		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Lizard, Color.brown);
		TF.SetAppendage(this.Appendages(), AppendageType.horn, Race.Lizard, Color.green);

		this.body.SetRace(Race.Lizard);

		this.body.SetBodyColor(Color.green);

		this.body.SetEyeColor(Color.blue);

		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}

	public DropTable() {
		const drops = [];
		if (Math.random() < 0.05) { drops.push({ it: AlchemyItems.Lacertium }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.SnakeOil }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.LizardScale }); }
		if (Math.random() < 0.5) {  drops.push({ it: IngredientItems.LizardEgg }); }

		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.SnakeFang }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.SnakeSkin }); }
		if (Math.random() < 0.1) {  drops.push({ it: IngredientItems.SpringWater }); }

		if (Math.random() < 0.01) { drops.push({ it: AlchemyItems.Scorpius }); }
		if (Math.random() < 0.01) { drops.push({ it: AlchemySpecial.Nagazm }); }
		if (Math.random() < 0.01) { drops.push({ it: AlchemyItems.Gestarium }); }
		return drops;
	}

	public Act(encounter: any, activeChar: any) {
		// TODO: Very TEMP
		Text.Add(this.name + " acts! Hiss!");
		Text.NL();

		// Pick a random target
		const t = this.GetSingleTarget(encounter, activeChar);

		const parseVars = {
			name   : this.name,
			hisher : this.hisher(),
			tName  : t.name,
		};

		const choice = Math.random();
		if (choice < 0.6) {
			Abilities.Attack.Use(encounter, this, t);
		} else if (choice < 0.8 && Abilities.Physical.Pierce.enabledCondition(encounter, this)) {
			Abilities.Physical.Pierce.Use(encounter, this, t);
		} else {
			Abilities.Seduction.Tease.Use(encounter, this, t);
		}
	}
}

export namespace LizardsScenes {

	export function Impregnate(mother: Entity, father: Lizard, slot?: number) {
		mother.PregHandler().Impregnate({
			slot   : slot || PregnancyHandler.Slot.Vag,
			mother,
			father,
			race   : Race.Lizard,
			num    : 1,
			time   : 16 * 24,
		});
	}

	export function GroupEnc() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;

		const enemy    = new Party();
		const male     = new Lizard(Gender.male);
		const female   = new Lizard(Gender.female);
		enemy.AddMember(male);
		enemy.AddMember(female);
		const enc: any = new Encounter(enemy);
		enc.male     = male;
		enc.female   = female;

		if (Math.random() < 0.5) {
			const third = new Lizard((Math.random() > 0.5) ? Gender.male : Gender.female);
			enemy.AddMember(third);
			enc.third = third;
		}

		/*
		enc.canRun = false;
		enc.onEncounter = ...
		enc.onLoss = ...
		enc.onVictory = ...
		enc.VictoryCondition = ...
		*/

		enc.onEncounter = () => {
			let parse: any = {
				numQ     : Text.Quantify(enemy.Num()),
				num      : Text.NumToText(enemy.Num()),
			};
			parse = player.ParserTags(parse);

			if (WorldTime().hour >= 6 && WorldTime().hour < 19) {
				Text.Add("Walking through the broad expanse of the desert, the sun beating down on you from above, you pass through a series of immense dunes. They tower above you, almost creating a valley of sand that shields you from the harsh heat of day.", parse);
			} else {
				Text.Add("Even under the cover of night, the desert is a harsh, almost lifeless expanse of dry sand, stretching from horizon to horizon. You climb a series of immense sand dunes that tower above you, your [feet] digging in deep, sapping your strength. At least you don’t have to worry about the sun beating down on your neck for the moment.", parse);
			}
			if (party.Two()) {
				const member = party.members[1];
				Text.Add(" You glance back at [name] to make sure that [heshe] isn't hurt or dehydrated and, seeing that [heshe]'s relatively okay, press on.", { name: member.name, heshe : member.heshe() });
			} else if (!party.Alone()) {
				Text.Add(" You glance back to your party to make sure that no one is hurt or dehydrated. After checking that they're relatively okay, you all press on.", parse);
			}
			Text.NL();
			if (WorldTime().hour >= 6 && WorldTime().hour < 19) {
				Text.Add("As you near the end of the monolithic dunes, you see a [numQ] of shadows fall over you. Looking up toward the sun, you see [num] shapes. You shield your eyes with one hand to make them out...", parse);
			} else {
				Text.Add("As you near the ridge of one of the monolithic dunes, you see a [numQ] of black shadows hovering over you, standing out against the starry sky. In the dim light, you can just barely make them out...", parse);
			}
			Text.NL();
			Text.Add("The first is a bulky, heavily muscled creature of scales and claws. His body is covered in thick, armored, yellow-green scales and a long, powerful tail stretches out behind him. Heavyset horns jut out from the back of his head, with the hint of small spikes protruding from either side of his angular muzzle. He holds a nasty-looking spear, and two large feet spread his weight evenly on the sand.", parse);
			Text.NL();
			Text.Add("While he’s completely nude, you can't see any sign of genitals between his legs, everything likely hidden within a reptilian slit. The only reason you can even tell his gender is his companion, who looks like a more slender, fairer counterpart with two large breasts held pert by a woven bra of some material you can't make out, the space between her legs similarly clad. Black hair cascades in silken tresses around her shoulders and her eyes are painted in an exotic fashion. She holds a slightly smaller spear, which looks more designed for cutting.", parse);
			Text.NL();

			if (enc.third) {
				Text.Add("Beside the two of them, a second [gender] stands, watching you. ", { gender : Gender.Desc(enc.third.body.Gender()) });
			}
			Text.Add("When they realize you've spotted them, the male thrusts his spear forward. The group surges down the slope of the sand dune toward you. It's a fight!", parse);

			Text.Flush();

			Gui.NextPrompt(() => {
				enc.PrepCombat();
			});
		};

		enc.onLoss    = LizardsScenes.LossPrompt;
		enc.onVictory = LizardsScenes.WinPrompt;

		return enc;
	}

	export function WinPrompt() {
		SetGameState(GameState.Event, Gui);

		const enc = this;
		const third: Lizard = enc.third;

		Gui.Callstack.push(() => {
			Text.Clear();

			const parse: any = {
				two : third ? " two" : "",
			};
			let scene: any;

			const odds = third ? (third.body.Gender() === Gender.male ? 0.66 : 0.33) : 0.5;

			// Male
			if (Math.random() < odds) {
				scene = () => { LizardsScenes.WinMale(enc); };
				parse.m1himher  = "him";
				parse.m1hisher  = "his";
				parse.m2hisher  = "her";
			} else {
				scene = () => { LizardsScenes.WinFemale(enc); };
				parse.m1himher  = "her";
				parse.m1hisher  = "her";
				parse.m2hisher  = "his";
			}
			parse.m2hisherTheir = third ? "their" : parse.m2hisher;

			if (Math.random() < 0.6) {
				Text.Add("With a solid <i>thump</i>, you beat your foe to the ground. The reptile tries to scramble away, but you step in front of [m1himher], blocking [m1hisher] path. As you stop [m1himher], you see the other[two] scurry away, leaving [m2hisherTheir] companion to [m1hisher] fate...", parse);

				Gui.NextPrompt(() => {
					scene(enc);
				});
			} else {
				Text.Add("You feint one way, then strike the finishing blow to the surprised reptile in front of you. She slumps to the ground and you move to block her escape. Suddenly, you hear an alarmed hiss of breath. Turning your head, you see the beaten male looking up at you, breathing slowly. He looks to the female, then back at you.", parse);
				Text.NL();
				Text.Add("<i>“Spare her,”</i> he hisses. <i>“Take... me.”</i>", parse);
				Text.NL();
				Text.Add("You blink in pleased surprise. It seems that, this time, you have your pick of the litter...", parse);

				// [Male][Female]
				const options: IChoice[] = [];
				options.push({ nameStr : "Male",
					func() { LizardsScenes.WinMale(enc); }, enabled : true,
					tooltip : "Listen to his pleas and take out your victory on him instead.",
				});
				options.push({ nameStr : "Female",
					func() { LizardsScenes.WinFemale(enc); }, enabled : true,
					tooltip : "Ignore him and claim his female companion.",
				});
				options.push({ nameStr : "Neither",
					func() {
						Text.NL();
						Text.Add("Rather than taking out your victory rush on your fallen foes, you opt to continue on your travels.", parse);
						Text.Flush();
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : "Have mercy on them.",
				});
				Gui.SetButtonsFromList(options);
			}
			Text.Flush();
		});

		Encounter.prototype.onVictory.call(enc);
	}

	export function WinMale(enc: any) {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		let parse: any = {
			p1name() { return party.members[1].NameDesc(); },
			m1Name() { return enc.male.NameDesc(); },
			m1name() { return enc.male.nameDesc(); },
		};
		parse = player.ParserTags(parse);

		Text.Clear();
		Text.Add("You grin triumphantly, standing over the reptile you just trounced, looking down at him victoriously. He lies there on the ground, his chest heaving and his breath coming as a sibilant hiss. He gazes at your feet, his slitted eyes defeated.", parse);
		Text.NL();
		Text.Add("You smirk at him. The creatures are known for abusing those they beat, perhaps you should return the favor?", parse);

		Text.NL();
		if (player.FirstCock() && player.FirstVag()) {
			Text.Add("You feel a steady ache in your quivering pussy, and a similar one as your [cocks] gently begin to throb to life. It quickly reminds you of just what you could do with the defeated reptile... What do you do?", parse);
		} else if (player.FirstCock()) {
			Text.Add("The steady stirring in your groin tells you that your body is more than willing... What do you do?", parse);
		} else if (player.FirstVag()) {
			Text.Add("The dull ache in your [vag] and the feeling of your nipples hardening under your [armor] sends shivers down your spine... What do you do?", parse);
		}
		Text.Flush();

		const options: IChoice[] = [];
		if (player.FirstCock()) {
			options.push({ nameStr : "Anal",
				func() {
					LizardsScenes.WinClaimAss(enc, enc.male);
				}, enabled : true,
				tooltip : "He's not going to put up much of a fight now, why not put his ass to good use?",
			});
			options.push({ nameStr : "Blowjob",
				func() {
					LizardsScenes.WinBlowjob(enc, enc.male);
				}, enabled : true,
				tooltip : "With a muzzle that long, you bet he could take every inch...",
			});
		}

		// [Powerbottom][Leave]
		options.push({ nameStr : "Powerbottom",
			func() {
				LizardsScenes.WinPowerbottom(enc);
			}, enabled : true,
			tooltip : "Who says the winner has to be on top? You like a good ride, when you're in charge.",
		});
		options.push({ nameStr : "Leave",
			func() {
				Text.Clear();
				Text.Add("You shake your head, looking down at [m1name]. He gazes up at you warily, as if expecting something bad to happen. Lucky for him, you're not in the mood for reptile today.", parse);
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "It's tempting, but you have better things to do than teach a reptile his place.",
		});
		Gui.SetButtonsFromList(options);
		Text.Flush();
	}

	export function WinFemale(enc: any) {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		let parse: any = {
			p1name() { return party.members[1].NameDesc(); },
			m1Name() { return enc.female.NameDesc(); },
			m1name() { return enc.female.nameDesc(); },
		};
		parse = player.ParserTags(parse);

		Text.Clear();
		Text.Add("You can't help but grin as you overcome the reptilian warrior who so eagerly tried to beat you down.  You stare at her for a few minutes, calming your breathing as she gazes at the ground. Her scales glint in the light and you find yourself struck by an odd sort of attraction to the creature.", parse);
		Text.NL();

		Text.Add("She's actually rather pretty, at least in a reptilian, monstrous way. You find your thoughts trailing to what she would feel like, then slowly to more lewd thoughts.", parse);
		Text.NL();
		if (player.FirstCock() && player.FirstVag()) {
			Text.Add("You feel a stirring in your groin, both your [cocks] and your [vag] feeling flushed with heat. You bite your lip for a moment in thought, then nod, having decided.", parse);
		} else if (player.FirstCock()) {
			Text.Add("You feel yourself rapidly growing hard, and take a deep breath. The lizard looks up at you, her eyes seeming oddly sultry. She quickly glances back down. What do you do?", parse);
		} else if (player.FirstVag()) {
			Text.Add("You feel your [vag] growing wet, and idly wonder what you could do with hers... The lizard looks up at you, her eyes seeming oddly sultry. She quickly glances back down. What do you do?", parse);
		}
		Text.Flush();

		const options: IChoice[] = [];
		if (player.FirstCock()) {
			options.push({ nameStr : "Anal",
				func() {
					LizardsScenes.WinClaimAss(enc, enc.female);
				}, enabled : true,
				tooltip : "She's not going to put up much of a fight now, why not put her ass to good use?",
			});
			options.push({ nameStr : "Blowjob",
				func() {
					LizardsScenes.WinBlowjob(enc, enc.female);
				}, enabled : true,
				tooltip : "With a muzzle that long, you bet she could take every inch...",
			});
		}
		if (player.FirstCock() || player.Strapon()) {
			options.push({ nameStr : "Fuck",
				func() {
					LizardsScenes.WinFuckVag(enc);
				}, enabled : true,
				tooltip : "Give her some dick.",
			});
		}

		// [Tailpeg][Leave]
		if (player.sexlevel > 2) {
			options.push({ nameStr : "Tailpeg",
				func() {
					LizardsScenes.WinTailpeg(enc);
				}, enabled : true,
				tooltip : "Your experience points out a lovely idea. Perhaps her tail could be put to a wonderful use...",
			});
		}
		options.push({ nameStr : "Leave",
			func() {
				Text.Clear();
				Text.Add("You shake your head, looking down at [m1name]. She gazes up at you warily, as if expecting something bad to happen. Lucky for her, you're not in the mood for reptile today.", parse);
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "It's tempting, but you have better things to do than teach a reptile her place.",
		});
		Gui.SetButtonsFromList(options);
		Text.Flush();
	}

	export function WinFuckVag(enc: any) {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const enemy: Lizard = enc.female;
		const third: Lizard = enc.third;

		const p1cock = player.BiggestCock(undefined, true);
		const realCock = p1cock.isStrapon === false;

		let parse: any = {
		};
		parse = player.ParserTags(parse);

		parse = Text.ParserPlural(parse, player.NumCocks() > 1);
		parse = Text.ParserPlural(parse, player.NumCocks() > 2, undefined, "2");

		const girthy = p1cock.Thickness() > enemy.FirstVag().Cap();

		Text.Clear();
		Text.Add("To the victor go the spoils. Before you now, you see a desert flower just begging to be plucked. The lizan girl gulps as you shrug your way out of your [armor], ", parse);
		if (realCock) {
			Text.Add("letting out an impressed yelp as you reveal your stiffening cock[s].", parse);
		} else {
			Text.Add("letting out a surprised yelp when you pull on your [cock], fastening it securely. You wonder if it’s her first time seeing such a thing - at the very least, it’ll probably be the first time someone uses one on her.", parse);
		}
		if (girthy) {
			Text.Add(" She looks a little apprehensive at your girth, but from what you’ve heard, scalies are quite flexible - there shouldn’t be any problems once you get started.", parse);
		}
		Text.NL();
		Text.Add("You’re pretty sure she knows where this is going; her body language tells you that she wants it as much as you do. It’s subtle; a slight parting of the lips, a quickening of her breath, the soft slither of scale on scale as her thighs rub together. From the way she’s seated, her nethers are hidden from you, though you get a brief flash of her wet slit now and then as she moves her tail lazily back and forth.", parse);
		Text.NL();
		Text.Add("<i>”Ah… and what am I supposed to do with that?”</i> she asks coyly, eyeing your [cocks] with feigned disinterest. <i>”What do I look like to you, a snake handler?”</i>", parse);
		Text.NL();
		Text.Add("Very funny. You’re willing to bet that she’s handled quite a few ‘snakes’ in her day. The lizard blushes faintly, but doesn’t refute your words. You suggest that she start by coming closer; perhaps a more intimate inspection will clue her in. She rolls her eyes, but obediently crawls up to you on all fours. ", parse);
		if (realCock) {
			Text.Add("Her scaly hand is cold as it comes to rest on[oneof] your [cocks] and she lightly runs it down the appendage, tracing the veins in fascination.", parse);
		} else {
			Text.Add("She experimentally prods your artificial cock, as if pondering how such a strange thing came to be.", parse);
		}
		Text.Add(" It’s probably as much a surprise for her as for you when her forked tongue flits forward, giving your [cock] a light flick.", parse);
		Text.NL();
		Text.Add("That’s right, get to know each other, you encourage her.", parse);
		Text.NL();
		Text.Add("The reptile gives you a dirty look, but nonetheless cups your [cock] in the palm of her hand and gives it a more thorough lick from tip to base. The light kiss turns into an intricate makeout session as the girl starts to get worked up. Swallowing her hesitation - and quite a lot more - she wraps her lips around your shaft and takes it into her mouth.", parse);
		Text.NL();
		parse.you = realCock ? "you" : "it";
		Text.Add("You let her play with [you] for a while before suggesting that now that her mouth is on such good terms with the snake, perhaps she should introduce it to some of her other orifices. With a loud slurp, she pops your [cock] out of her mouth, dripping of her saliva. She slowly turns over on all fours, wiggling her butt at you invitingly. Her tail is held high, allowing you full access to both her stretchy holes.", parse);
		Text.NL();
		Text.Add("The lizard gasps as you close in, putting a firm hand on her soft butt as you run your lubed-up cock between her cheeks, prodding at the entrance of her labia and gently rubbing her tailhole. You continue to tease the girl for a while longer, delighting in how she squirms and tries to grind her hips back against you. Finally, you align your [cock] with her slit and slide it in.", parse);
		if (realCock) {
			Text.Add(" Her insides are deliciously tight, and hot like a furnace.", parse);
		}
		Text.NL();

		Sex.Vaginal(player, enemy);
		enemy.FuckVag(enemy.FirstVag(), player.FirstCock(), 4);
		player.Fuck(player.FirstCock(), 4);

		Text.Add("<i>”S-such a naughty snake!”</i> she moans, rocking her hips back to meet yours. ", parse);
		if (girthy) {
			Text.Add("Just as you suspected, her opening is incredibly flexible, forming a perfect cock-sheath for you, a hand in a glove. ", parse);
		}
		Text.Add("A naughty snake for a naughty snake handler, you reply amiably, giving her another thrust. She grunts, her tail swaying back and forth above her jiggling butt.", parse);
		Text.NL();
		Text.Add("You build up a rhythm, each of her goading taunts echoed by you slamming your hips home, filling up the feisty lizard. Before long, she can’t even muster that. Now that she's reduced to base moans and lustful panting, her every thought other than the need of your shaft in her hot loins is scattered to the winds. She’s accepted her place as the willing receptacle of your [cock] and she’s enjoying every second of it.", parse);
		Text.NL();
		Text.Add("The need for words is gone. All that remains is your passion for each other as your bodies grind together, the girl doing her best to diligently milk your [cock]. ", parse);
		if (realCock) {
			Text.Add("She’s taking at least as much pleasure from this as you are, shamelessly moaning and egging you on.", parse);
		} else {
			Text.Add("You can’t help but think that she’s getting the sweeter side of the deal here, wrapped tightly around your artificial member. On the other hand, every powerful backstroke grinds the base of the toy into your own [vag], so you can’t really complain.", parse);
		}
		Text.Add(" You feel your control over the situation slip as your rutting slowly turns more insistent, becoming the instinctive actions of the lusty beast inside you. Her tail snakes around you, caressing your back fondly and keeping you inside her reach as if she’s afraid you’ll pull away and end her bliss prematurely.", parse);
		Text.NL();
		Text.Add("Like you’re going to let that happen! With still quite a bit left in you, you set to it, intent on making this as good as possible for both of you. ", parse);
		if (player.NumCocks() > 1) {
			Text.Add("Your other cock[s2] grind[notS2] against her taint, a carnal promise of more to come. Deciding to let [itThem2] have a little action, you pull out, immediately filling her again with a different member. You switch back and forth a while before plugging her with your main [cock] again.", parse);
		} else {
			Text.Add("You keep your hands busy by toying with the sensitive lizan; caressing the soft scales on the underside of her tail, squeezing her plush butt and circling your thumb on her taint.", parse);
		}
		Text.Add(" She does her best to keep up with you, but after a while of incessant fucking, her breath starts to grow shorter and shorter, her moans more insistent. Finally, the constant pummeling of your [cock] becomes too much for the girl and she collapses in throes of ecstasy.", parse);
		Text.NL();

		const cum = player.OrgasmCum();

		Text.Add("While she’s the first one to cum, you’re not far behind. ", parse);
		if (realCock) {
			parse.cum = cum > 6 ? "copious" :
						cum > 3 ? "generous" : "large";
			Text.Add("Letting out a groan, you unload and flood her with a [cum] amount of nut-batter. You idly wonder if you’ll fertilize her eggs; the thought of a pregnant lizard sending another spurt from your [cock].", parse);
			if (player.NumCocks() > 1) {
				Text.Add(" Your other cock[s2] blast [itsTheir2] load[s2] across her back, coating her in jizz both inside and out.", parse);
			}
		} else {
			Text.Add("Even if you can’t feel the lizan squeezing her walls around your artificial cock, her passionate thrashing grinding the base of the toy against your private parts is enough to set you off. You cry out, waves of pleasure spreading through your loins as you fall onto her back.", parse);
		}
		Text.NL();
		parse.real = realCock ? " and the girl’s belly filled with your seed" : "";
		Text.Add("Spent, you try to pull out of the reptile, but her tail snares you in and holds you close as she rides out her own climax, her pussy reflexively clenching around your [cock]. When she finally lets go, you’re both thoroughly exhausted by the ordeal. You give her a shaky hand up, and you share a smile before you go your separate ways, both of you sated[real].", parse);
		if (party.Num() > 1) {
			parse.Comp = party.Num() === 2 ? party.Get(1).name : "Your companions";
			parse.notS = party.Num() === 2 ? "s" : "";
			Text.NL();
			Text.Add("[Comp] join[notS] you, helping you gather your gear before you set out on your journey again.", parse);
		}
		Text.Flush();

		TimeStep({minute : 30});

		Gui.NextPrompt();
	}

	export function WinTailpeg(enc: any) {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const enemy: Lizard = enc.female;

		let parse: any = {
			p1name() { return party.members[1].NameDesc(); },
			m1Name() { return enemy.NameDesc(); },
			m1name() { return enemy.nameDesc(); },
			m1anus() { return enemy.Butt().AnalShort(); },
			m1butt() { return enemy.Butt().Short(); },
			m1cocks() { return enemy.MultiCockDesc(); },
			m1breasts() { return enemy.FirstBreastRow().Short(); },
		};
		parse = player.ParserTags(parse);

		Text.Clear();

		Text.Add("You slide forward, your eyes set on the [m1name]'s tail. A sly thought fills your mind, and the idea sticks firmly. The reptile looks up at you, her eyes uncertain as you approach almost predator-like.", parse);
		if (player.Armor()) {
			Text.Add(" You slowly remove your [armor], letting it fall to the floor; it would only get in the way now.", parse);
		}
		Text.NL();
		Text.Add("[m1Name] bites her lip as you approach, your", parse);
		if (player.FirstVag()) {
			Text.Add(" [vag] exposed to the warm air, the breeze sending a gentle thrill through your body.", parse);
		} else if (player.FirstCock()) {
			Text.Add(" slowly hardening [cocks] twitching to life.", parse);
		} else {
			Text.Add(" featureless crotch bare to the world.", parse);
		}
		Text.NL();
		Text.Add("You stop just a step shy of her. She looks up at you from the ground, her oasis-blue eyes locking onto yours. You drop to your hands and knees, your eyes bright as you slide over the top of her. When your hands don't move to her underwear, her expression becomes slightly confused. Your hands meet her legs, her cool scales firm against your fingers. You trail them downward, letting touch guide your hands to the base of her tail, and then lower...", parse);
		Text.NL();
		Text.Add("[m1Name]'s tail twitches back and forth, flicking in your grip as she leans backwards. Her legs slightly spread, she watches you confusedly, her mind trying to work out just what you intend to do with her. You don't leave her to wait too long, however, as your fingers near her tail's tip. You take a firm hold of it, giving her a teasing smile before <i>pulling</i> it upward. The reptile swallows, her eyes widening.", parse);
		Text.NL();
		Text.Add("Bringing her tail up between your legs, ", parse);
		if (player.FirstVag()) {
			Text.Add("you feel her whip-like, scaled tip brush against your moist [vag].", parse);
		} else {
			Text.Add("you press her thin, green-yellow scaled tail-tip against your pucker, drawing in a breath.", parse);
		}
		Text.NL();
		parse.sound = player.Race().isRace(Race.Horse) ? "nicker" :
						player.Race().isRace(Race.Reptile) ? "hiss" :
						player.Race().isRace(Race.Feline) ? "purr" :
						player.Race().isRace(Race.Canine) ? "whine" :
						"moan";
		Text.Add("[m1Name] tenses, before her eyeridges drop lower in thought. As understanding dawns on her, a sly look passes her muzzle and she twitches her tail against you. The tip, so very thin, easily slips a half inch inside of you between your fingers and you feel it wriggle just inside your body. The motion feels strange, but oddly pleasant, and you find yourself holding her tail tight, keeping it from sliding back out from your flesh. You let out a small [sound] of pleasure, and [m1name] grins in satisfaction.", parse);
		player.AddLustFraction(0.1);
		Text.NL();
		Text.Add("Gradually, you begin to feed her tail into your body, ", parse);
		const analVirgin = player.Butt().virgin;
		if (player.FirstVag()) {
			Text.Add("your heated cunt gradually filling with her thickening tail. She twitches it frequently, and you don't tell her to stop; the way it undulates and slithers through your lips sends electric thrills through your body and you feel your wet mound squeezing tightly around the reptile's tail.", parse);
			Text.NL();
			player.FuckVag(player.FirstVag(), undefined, 3);
			Sex.Vaginal(enemy, player);
		} else {
			Text.Add("your [anus] slowly stretching around it. You lift one hand, licking the palm of it, then bring it back down to lubricate her tail slightly. As you rub your saliva along the length of her scaled tail, it starts to slide in much more easily.", parse);
			if (player.FirstCock()) {
				parse.itThey = player.NumCocks() > 1 ? "they throb" : "it throbs";
				Text.Add(" Her eyes roam hungrily over your [cocks] as [itThey] to life, beginning to feel much heavier between your legs.", parse);
			}
			Text.NL();
			player.FuckAnal(player.Butt(), undefined, 3);
			Sex.Anal(enemy, player);
		}
		Text.Add("Thicker and thicker her tail grows and you feel yourself slowly, achingly stretching to take the growing girth of her tail.", parse);
		Text.NL();

		const scenes = new EncounterTable();
		scenes.AddEnc(() => {
			Text.Add("Finally you feel her bottom out inside of you, your entrance feeling wonderfully stretched, her tail twitching now and then within the heated confines of your body. You close your eyes, taking long, slow breaths. It feels almost <i>just</i> like you imagined...", parse);
			Text.NL();
			Text.Add("Suddenly you feel, deep inside your sensitive passage, [m1name]'s tailtip <i>curve</i>. You feel your insides stretch around her as she curls the tip of her tail in a tight bend, and suddenly you can feel her serpentine tail beginning to slither back out of you. As you look down though, you see her buried as deeply in you as before... and you find yourself feeling <i>very</i> much more full. You give a soft groan, ", parse);
			if (player.HasTail()) {
				Text.Add("your [tail] curling behind you. As you do, you realize...", parse);
			} else {
				Text.Add("placing one hand on your [belly].", parse);
			}
			Text.NL();
			Text.Add("She's curling her tail around inside you! You feel your insides beginning to stretch around her tail as she doubles up inside of you, and you clench around her tightly as you can.", parse);
			Text.NL();
			if (player.FirstVag()) {
				Text.Add("You feel the slick lips of your cunt being forced wider and wider as she starts to slide yet more of her tail into you, keeping you completely filled. You spread your legs as wide as you can to try to ease the pressure, but it's no use. You find yourself stretched achingly wide, and feel your vision blur as your pussy squeezes around the lizard's cool, undulating tail.", parse);
				Text.NL();
				Text.Add("[m1Name] seems to be getting decidedly into it, and you feel her start to <i>wriggle</i> her tail inside of you. Like a living, thrashing creature it writhes inside of you, grinding against your heated walls deviously. You feel her whip-like tail-tip tickle spots deep inside of you, and your cunt clamps down around her again. Leaning forward, you grind yourself on her tail, your cunt stretched wide as it can go...", parse);
				if (player.FirstVag().Tightness() < Orifice.Tightness.gaping) {
					Text.NL();
					Text.Add("...And then she shoves in even <i>more</i>. You cry out in shock as you feel yourself stretch beyond your limits, going cross-eyed.", parse);
					player.FirstVag().stretch.IncreaseStat(Orifice.Tightness.gaping, 1);
					player.AddLustFraction(0.2);
				}
			} else {
				Text.Add("You feel her tail sliding deeper into your clenching sphincter, your muscles growing sore as she forces you ever wider. You sit down heavily on her tail, and she responds by stiffening it, making several more inches sink slowly into you. As her tail-tip slides back toward your entrance, you feel it brush your prostate. Though you try, you find yourself unable to stifle the soft yelp of surprise it brings.", parse);
				Text.NL();
				Text.Add("[m1Name] picks up on it immediately, a coy smile on her lips. Wordless as ever, you feel her tail slow, and her tip slither back to brush your prostate again. You fix your gaze on her, and her eyes almost dare you to object. Drawn on by the supple motions of her serpentine tail, you're not sure you want to...", parse);
				Text.NL();
				Text.Add("Suddenly her tail twitches again, and her tip <i>grinds</i> against your prostate. Your eyes widen, and she <i>shoves</i> another four inches of her now painfully thick tail into you. Pleasure blankets out the pain and you spasm on top of her, your [cocks] throbbing at attention as you press harder against her.", parse);
				if (player.Butt().Tightness() < Orifice.Tightness.gaping) {
					Text.NL();
					Text.Add("You feel your [anus] stretching agonizingly wide, and you know it will be a while before you feel tight again...", parse);
					player.Butt().stretch.IncreaseStat(Orifice.Tightness.gaping, 1);
					player.AddLustFraction(0.2);
				}
			}
		}, () => (player.FirstVag() ? (60 + player.FirstVag().Tightness() * 5) : (20 + player.Butt().Tightness() * 5)) / 100);
		scenes.AddEnc(() => {
			Text.Add("Slowly, she begins to slide it out from your body again. You feel her sinuous tail slithering out, tugging on your ", parse);
			if (player.FirstVag()) {
				Text.Add("slick cunt as it moves, coating her scales with your fluids.", parse);
			} else {
				Text.Add("clenching sphincter as it moves, making it distend outwards as she twitches her tail inside of you.", parse);
			}
			Text.NL();
			Text.Add("You let your hands come forward, taking hold of her legs to steady yourself as she slowly pulls her tail out of you... only to push it back in, equally as slow. You feel her tip sliding against your most sensitive spot, her rough scales grinding across it leave you gasping for breath. She lets out a hiss of delight at the sight of you shuddering.", parse);
		}, () => Math.max((player.FirstVag() ? (40 - player.FirstVag().Tightness() * 5) : (80 - player.Butt().Tightness() * 5)) / 100, 0));

		scenes.Get();

		Text.NL();
		if (player.FirstCock()) {
			Text.Add("You feel her gaze on your [cocks], and realize that you're leaking precum steadily.", parse);
			Text.NL();
			if (player.NumCocks() === 2) {
				Text.Add("A small hunger in her eyes leaves you suddenly wary of her. You see one hand come forward, reaching for your pair of pulsating dicks. Her tail twitches inside of you, and you feel yourself sliding forward. Her fingers close around your [cocks], giving a slow, sensual <i>squeeze.</i> Perhaps two is just the right number for her...", parse);
				Text.NL();
				Text.Add("Slowly she begins to pump her hand up and down your sensitive flesh, squishing your thick shafts against each other, smearing your own precum along your lengths. All too soon though, she lets go, returning to the slow, steady pumps of her tail instead...", parse);
				Text.NL();
			}
		}
		Text.Add("[m1Name] gets an impish twinkle in her eyes and she presses her tail gently against you. Before you can wonder what she's doing, you feel her entire tail undulate inside of you, rippling through your body. Back and forth it squirms inside of you, pressing against your tender flesh. You feel a soft gurgling coming from deep inside you and her slick tail wriggles in another inch. Your muscles stretch around her, and you bite your lip, your eyes closing.", parse);
		Text.NL();
		Text.Add("[m1Name] sets into a slow, tormenting rhythm as her undulating tail slithers in and out of your body. Each time she draws her sinuous tail out, you feel your body begin to clench... before she <i>rams</i> it back in, sending a jolt through your pelvis as she forces you open again. You rapidly feel yourself approaching your own climax as her wriggling tail teases your most intimate of spots, very deliberately.", parse);
		Text.Flush();

		Gui.NextPrompt(() => {
			Text.Clear();
			if (player.FirstVag()) {
				Text.Add("In and out her slick, scaly tail slides, driving into your wet cunt like a piston over and over.", parse);
				if (player.HasBalls()) {
					Text.Add(" Her tail lifts your [balls] up and out of the way to gain better access to your strained pussy.", parse);
				}
				Text.NL();
				Text.Add("You feel your walls clenching down helplessly and you find it hard to keep yourself upright on her. Her tail fills you so wonderfully that you find it hard to think straight. Her undulating tip strokes your g-spot and the base of her thick tail grinds against your pulsing [clit]. <i>“That's it, my desert flower,”</i> she whispers then. Her tail ripples inside of you and you are unable to prevent yourself from moaning. Your cunt clamps heavily down around her, and she leans forward.", parse);
				Text.NL();
				if (player.FirstBreastRow().size.Get() > 3) {
					Text.Add("Her hands suddenly lift to your [breasts] and you feel her cool fingers brush your [nips]. Her tail twitches inside of you again, and your pussy squeezes it tight, your fluids dripping down her tail. Her fingers gently take hold of your breasts... and begin to squeeze, lightly tweaking your nipples as her tail keeps you almost docile, speeding toward the edge.", parse);
				}
				Text.NL();
				Text.Add("Suddenly, she <i>rams</i> her tail into you and you feel her deepest inches make a fleshy thump against your cervix. You begin to see double and your wet pussy squeezes achingly around her undulating tail. You hear a loud moaning, and it takes you a few moments to realize that it's you. You feel your [clit] throbbing achingly, and feel yourself teetering at the edge. <i>“Mm... The rewards of victory are yours,”</i> she whispers. You look at her hungrily... before your hands slide down to her tail and <i>shove</i> it deeper into you. Her tail-tip curls slightly as you feel it stroking your g-spot relentlessly. Your eyes widen and you feel your lips clamp down on her.", parse);
				Text.NL();
				Text.Add("You fall onto her as pleasure rips through your mind, your cunt clenching down powerfully around her tail as it continues undulating and wriggling inside of you. Your hot juices flood your passage, and then splatter out onto her tail, making a mess of her yellow-green scales. She lets out a satisfied hiss as you climax at her touches, flicking her tail deep within you. Using your hands to hold her tight, you ride her tail like a flexible, living sex toy, pulling the last inch out and cramming it back inside over and over, a look of pure bliss plastered on your face.", parse);
				Text.NL();
				Text.Add("Harder and harder, you ream yourself with her constantly moving tail, your juices gushing from your quivering cunt as your cheeks go dark red. Even when your climax begins to fade, her tail continues wriggling and twitching inside of you, keeping you going, not letting your pleasure end. You feel her tail-tip squirming so deeply inside of you, and it's slowly driving you crazy.", parse);
				Text.NL();
				Text.Add("You hump her tail desperately, trying to extract as much pleasure as physically possible as your cunt ripples around her merciless tail. Your eyes roll back in your head as you make a wet mess of her for what feels like forever.", parse);
				Text.NL();
				Text.Add("Suddenly, her tail drives you to the peak again, and you see white as your slathered cunt clamps down once more, another torrent of your juices pouring over her tail. <i>“Cum again, my desert rose,”</i> the lizard whispers as you ride out a second orgasm, your eyes rolling back as her tail continues to wriggle, thrusting in and out of you. Her tip grinds your g-spot and you find yourself drooling. She smirks delightedly, twisting and thrusting her tail inside you until you feel your pussy radiating an agonizing heat. You squeal out helplessly as she makes you cum a third time, impaled on her thick tail.", parse);
				Text.NL();
				Text.Add("Finally, you feel your muscles come back under control, feeling your wet cunt begin to calm down, even with her tail continuing to flail inside of you.", parse);
			} else if (player.FirstCock()) {
				Text.Add("Slowly, you feel her slender tail sliding through your heated passage, filling your rear so completely. You close your eyes, feeling your body trembling as she keeps you stretched so wide. The tip of her tail continues grinding against your prostate, twitching and flickering against it with every passing moment, keeping the pressure high.", parse);
				Text.NL();
				Text.Add("You feel your [cocks] twitching, pulsing in aching need, but the way her tail torments your nerves, simply riding her feels even better.", parse);
				if (!analVirgin) {
					Text.Add(" Her tail inside of you feels so much better than the random dicks you've had plunging into you, and your cheeks burn as you grind with her.", parse);
				}
				Text.NL();
				Text.Add("You feel [m1name] drawing her tail slowly, steadily out of you then, letting it slide free from your stretched pucker. You give a soft groan as it wriggles out of you, your eyes widening at just how much was buried deep in your gut. Though you tense your muscles in preparation for what you know is coming, you can't stifle the loud cry that comes as she <i>rams</i> her tail back into you.", parse);
				Text.NL();
				Text.Add("Before you can react beyond a quivering groan, she draws her tail back out... and then thrusts it back inside of you. Her roughly textured tail begins to batter through your entrance, fucking your slicked pucker almost violently. You spasm on top of her, your [cocks] twitching as you feel yourself begin to drip precum freely.", parse);
				Text.NL();
				Text.Add("For what feels like ages she brutally pumps her tail in and out of you, slowed only by your hands which keep her relatively under control. Finally you feel yourself approaching that plateau of pleasure in a strange way, your untouched [cocks] pulsing ever more frequently.", parse);
				Text.NL();
				Text.Add("Breathing hard, you grab hold of her tail, drawing it out for a few inches. <i>“Make me cum,”</i> you whisper, a simple command, before you <i>shove</i> her tail as deeply into yourself as you can manage. Your muscles burn in protest, but the pleasure rapidly overwhelms it as [m1name] complies.", parse);
				Text.NL();
				Text.Add("Her tail begins to undulate and wriggle inside of you, sliding and grinding against your prostate, massaging and jabbing against it. You feel an almost uncontrollable pressure building up behind your [balls] as she plays hell with your insides, before finally you can't take it any more.", parse);
				Text.NL();
				Text.Add("The pressure suddenly explodes inside of you, and you see stars in front of your eyes. You feel thick, hot slime pulsing through your [cocks], splattering out over [m1name]'s breasts, some even hitting her muzzle. Your whole body shakes as you cry out in ecstasy, riding her tail eagerly as it slithers around inside of you. Cumming all over her, you feel yourself clenching down on her tail with reckless abandon, as she gazes hungrily at your throbbing [cocks].", parse);
				Text.NL();
				Text.Add("Finally you feel yourself beginning to calm down, even as she continues stroking and kneading your prostate. You groan quietly, still drooling cum as her skilled tail-tip forces it from your body.", parse);
			}
			player.AddLustFraction(-1);
			Text.NL();
			Text.Add("Weakly, you begin to pull her tail out of your body, sliding it back. Several inches slip free... then a foot... then another. Your eyes widen as you realize just how <i>deep</i> she was inside of you.", parse);
			Text.NL();
			Text.Add("Finally, you feel her tip sliding free. She wriggles it just slightly, brushing your entrance one last time. You shudder in pleasure, but pull it the rest of the way out.", parse);
			Text.NL();
			Text.Add("You quickly gather your things and the spoils of victory, and cast a look at her. [m1Name] smirks coyly at you, her slick tail twitching in your direction. You blush, and turn away.", parse);

			if (party.Two()) {
				Text.NL();
				Text.Add("[p1name] joins you, blushing.", parse);
			} else if (!party.Alone()) {
				Text.NL();
				Text.Add("Your party joins you.", parse);
			}
			Text.Flush();
			Gui.NextPrompt();
		});
	}

	export function WinClaimAss(enc: any, enemy: Lizard) {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		let parse: any = {
			p1name() { return party.members[1].NameDesc(); },
			m1Name() { return enemy.NameDesc(); },
			m1name() { return enemy.nameDesc(); },
			m1HeShe() { return enemy.HeShe(); },
			m1heshe() { return enemy.heshe(); },
			m1HisHer() { return enemy.HisHer(); },
			m1hisher() { return enemy.hisher(); },
			m1himher() { return enemy.himher(); },
			m1hishers() { return enemy.hishers(); },
			m1anus() { return enemy.Butt().AnalShort(); },
			m1butt() { return enemy.Butt().Short(); },
			m1cocks() { return enemy.MultiCockDesc(); },
			m1breasts() { return enemy.FirstBreastRow().Short(); },
		};
		parse = player.ParserTags(parse);

		Text.Clear();

		Text.Add("You can't help but smirk slightly as you step forward, thoughts of just what to do to [m1himher] filling your head. You stop just in front of [m1name], peering down at [m1himher]. [m1HeShe] lifts [m1hisher] head, looking up at you.", parse);
		Text.NL();
		if (Math.random() < 0.8) {
			Text.Add("[m1HeShe] scowls at you, but offers no resistance as you lean forward, pushing [m1himher] over onto the ground. [m1HeShe] struggles weakly when you try to move [m1hisher] legs to expose the underside of [m1hisher] tail, but you ", parse);
			if (player.strength.Get() > enemy.strength.Get() + 20) {
				Text.Add("easily overpower [m1himher], revealing [m1hisher] [m1anus], taking hold of [m1hisher] legs by the knees.", parse);
			} else if (player.dexterity.Get() > enemy.dexterity.Get() + 20) {
				Text.Add("easily outmaneuver [m1himher], leaving [m1himher] startled as you part [m1hisher] stronger legs through sheer skill, taking hold of each one.", parse);
			} else {
				Text.Add("manage to pry [m1hisher] legs apart, sliding forward as [m1heshe] grunts indignantly. [m1HisHer] scaled legs are strong in your hands, and it occurs to you that [m1heshe] might simply be going along with it to avoid your wrath.", parse);
			}
		} else {
			Text.Add("[m1HeShe] looks down almost shyly and, seeming to realize your intent, slowly lies down on [m1hisher] back, drawing in a deep breath. Idly, you wonder if [m1heshe] might have a preference for this. Sensing it will be easy to put your [cocks] to good use, you step forward, grinning at [m1himher]. You take a hold of [m1hisher] legs by the knees, and [m1heshe] gazes at you uncertainly. Pushing [m1hisher] legs further apart, you slide your hips forward, pressing your groin up against [m1name]'s [m1butt]. [m1Name] looks away, [m1hisher] muzzle darkening in a slight blush that sends a delighted thrill down your spine.", parse);
		}
		Text.NL();

		if (player.Armor()) {
			Text.Add("You let go of one of [m1hisher] legs and place a hand on the front of your [armor] and pull your [cocks] out. [m1Name] glances down, [m1hisher] eyes widening slightly as [m1heshe] sees your [cocks].", parse);
			Text.NL();
			if (enemy.body.Gender() === Gender.male) {
				Text.Add("<i>“You... you aren't gonna...”</i> he starts, before falling silent, his slitted eyes meeting yours. You smirk at him and he swallows heavily.", parse);
			} else {
				Text.Add("<i>“I hope you know what you're doing there,”</i> she breathes.", parse);
			}
			Text.NL();
			Text.Add("Before [m1heshe] has a chance to muster up a new wave of energy, you take hold of [m1hisher] legs again by the knees, pushing them up and out of the way.", parse);
			Text.NL();
		}

		if (player.NumCocks() > 1) {
			Text.Add("You let your [cocks] press up against [m1hisher] [m1anus], feeling [m1hisher] cool scales against the underside of each of your throbbing cocks. [m1HisHer] eyes widen again, and [m1hisher] claws dig into the ground beneath [m1himher]. You smirk, watching [m1hisher] face in delight, imagining the thoughts [m1heshe] must be having. You'll be sure to give [m1himher] inspiration for many more, as you position your largest, pulsing dick against [m1hisher] tight [m1anus]. [m1HeShe] seems a little small to fit more than one...", parse);
		} else {
			Text.Add("You let your [cock] flop out onto [m1hisher] [m1butt], watching [m1name]'s face eagerly. [m1HeShe] looks away, breathing deeply, claws clutching at the ground beneath [m1himher]. [m1Name]'s tail flicks back and forth under you, and you feel [m1himher] clench [m1hisher] jaws in anticipation.", parse);
		}
		Text.Flush();

		Gui.NextPrompt(() => {
			Text.Clear();

			Text.Add("You grind the tip of your slowly oozing cock against [m1hisher] pucker, smearing it with your precum, ensuring that it's nice and slick. [m1Name] grunts, looking away and closing [m1hisher] eyes. Underneath you, [m1hisher] tail twitches uneasily. You contemplate toying with [m1himher] a little longer, but decide that [m1heshe]'s had enough – and you don't want to wait anymore.", parse);
			Text.NL();
			Text.Add("With a powerful heave, you <i>shove</i> [m1hisher] legs wider apart, making [m1hisher] muscles strain. [m1HeShe] cries out just as you thrust your hips forward, the tip of your dick pushing hard against [m1hisher] tight ring of muscles. The pressure builds quickly, before [m1hisher] [m1anus] can't take it any more. <i>“Oh, gods, s-stop!”</i> [m1heshe] cries, muscles tensing. [m1HisHer] sphincter gives way and you feel your [cock] suddenly sink several inches into [m1himher], the warmth of [m1hisher] body gripping your shaft tightly.", parse);
			Text.NL();
			Text.Add("[m1HisHer] insides feel much hotter than [m1hisher] cool scales, and after the initial thrust, you start to push into [m1himher] much more slowly to simply enjoy the feeling of [m1hisher] warm passage rippling around you. [m1HisHer] strong jaws open and [m1heshe] lets out a soft groan, [m1hisher] legs trying to close.", parse);
			Text.NL();

			const scenes = new EncounterTable();
			scenes.AddEnc(() => {
				Text.Add("Your grip is too strong and your arms overpower [m1hisher] muscles, weakened by the combat, and you simply go on with a broad smile. You slide your shaft back out, feeling [m1hisher] [m1anus] try to hold you tighter. Helpless under your touches, the reptile claws at the earth, a soft groan passing [m1hisher] muzzle. In and out you thrust, burying your [cock] a little deeper with each buck, working yourself steadily deeper to [m1hisher] squirming body.", parse);
				Text.NL();
				Text.Add("Finally, you draw your dripping dick back - only to <i>slam</i> it into [m1himher], your groin mashing up to [m1hisher] [m1anus]. Your tip sinks deep into [m1himher] and [m1hisher] jaws snap open wide in a breathless moan.", parse);
				Text.NL();
				if (enemy.body.Gender() === Gender.male) {
					Text.Add("He lets out a loud, hissing groan, his pair of throbbing dicks pulsing at attention.", parse);
				}
			}, () => Math.min((50 + player.strength.Get() - enemy.strength.Get()) / 100, 0.95));
			scenes.AddEnc(() => {
				Text.Add("You're startled by the sheer force of [m1hisher] legs, and they quickly overpower your arms, closing behind your back. Your body lurches toward [m1himher] and you stumble, falling forward. Your entire [cock] hammers into [m1hisher] body, and the reptile's eyes snap wide open. <i>“Aah!”</i> [m1heshe] hisses, [m1hisher] entire body tensing. It only grips your [cock] tighter, and you struggle to suppress a moan. You land on [m1hisher] stomach ", parse);
				if (enemy.body.Gender() === Gender.male) {
					Text.Add("and feel his own [m1cocks] press against your belly.", parse);
				} else {
					Text.Add("and feel her [m1breasts] press against your [face].", parse);
				}
				Text.NL();
				Text.Add("You let out a grunt, quickly pressing yourself back upright, drawing your cock out as much as [m1hisher] legs allow...", parse);
			}, () => Math.max((50 - player.strength.Get() + enemy.strength.Get()) / 100, 0.05));
			scenes.Get();

			Text.NL();
			Text.Add("Slowly, you work yourself deep inside of [m1himher], humping [m1hisher] tight, reptilian rear", parse);
			if (player.HasBalls()) {
				Text.Add(", your [balls] dragging back and forth across [m1hisher] tail", parse);
			}
			Text.Add(" as you let out a soft groan of your own. Before long, you feel your climax growing closer and your thrusts start to grow slower, more powerful. Finally, with one heavy <i>shove</i>, you bury your pulsing, heavy dick deep into [m1hisher] clamping sphincter. You feel your cum surging through your shaft and grin as you feel your seed pumping deep into [m1hisher] body.", parse);
			Text.NL();
			Text.Add("<i>“Are you- oh, <b>oh</b>!”</i> [m1heshe] groans out, muzzle blushing a bright red.", parse);
			Text.NL();
			if (enemy.body.Gender() === Gender.male && Math.random() < (10 + player.stamina.Get() / 2) / 100) {
				Text.Add("Your heavy bucks seem to have been enough to tip [m1name] over the edge as well, and he lets out a long, aching <i>groan</i>. You see his own [m1cocks] throbbing heavily and feel his [m1anus] practically <i>milking</i> you of your spunk. You aim his dicks up at his chest and watch delightedly as he sends rope after rope of his cum all over his chest, painting himself a sticky white.", parse);
				Text.NL();
			}

			let expMult = 3;
			if (enemy.Butt().virgin) { expMult *= 3; }
			player.AddLustFraction(-1);
			player.Fuck(player.FirstCock(), expMult);
			Sex.Anal(player, enemy);

			Text.Add("Finally spent, you slowly pull your [cock] from [m1hisher] body, letting one last dribble of cum smear across [m1hisher] pucker. You slide out from between [m1hisher] legs, gathering your things. [m1Name] lets out a weak groan, laying there in the dirt, traces of your cum oozing from [m1hisher] body. Claiming your spoils, you turn to leave.", parse);
			if (party.Two()) {
				Text.NL();
				Text.Add("[p1name] joins you with a nod.", parse);
			} else if (!party.Alone()) {
				Text.NL();
				Text.Add("Your party joins you.", parse);
			}
			Text.Flush();

			Gui.NextPrompt();
		});
	}

	export function WinBlowjob(enc: any, enemy: Lizard) {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		let parse: any = {
			p1name() { return party.members[1].NameDesc(); },
			m1cocks() { return enemy.MultiCockDesc(); },
			m1Name() { return enemy.NameDesc(); },
			m1name() { return enemy.nameDesc(); },
			m1HeShe() { return enemy.HeShe(); },
			m1heshe() { return enemy.heshe(); },
			m1HisHer() { return enemy.HisHer(); },
			m1hisher() { return enemy.hisher(); },
			m1himher() { return enemy.himher(); },
			m1hishers() { return enemy.hishers(); },
		};
		parse = player.ParserTags(parse);

		Text.Clear();

		Text.Add("You look down at [m1name] again, feeling yourself pulsing to arousal. Luckily, there's a warm muzzle to take care of that... You smirk down at [m1himher], stepping forward.", parse);
		if (player.Armor()) {
			Text.Add(" Tugging down the front of your [armor] to expose your [cocks], you let yourself swell to full hardness.", parse);
		}
		Text.NL();
		Text.Add("Reaching down, you cup [m1hisher] muzzle, tilting it up to look at you. [m1HeShe] blushes slightly, [m1hisher] slitted, golden eyes looking away. Without another word, you push ", parse);
		if (player.NumCocks() > 1) {
			Text.Add("your largest, thick shaft ", parse);
		} else {
			Text.Add("your thick [cock] ", parse);
		}
		Text.Add("to [m1hisher] lips, looking expectantly down at [m1himher]. <i>“Open up,”</i> you murmur. [m1HeShe] closes [m1hisher] eyes, taking a slow, deep breath that brushes softly across your [cocks]. [m1Name] slowly, hesitantly opens [m1hisher] jaws just enough for your heavy [cock] to slide forward... and you do.", parse);
		Text.NL();
		Text.Add("Your pulsing, heated dick slides forward into the reptile's waiting jaws, and [m1heshe] swallows uncertainly. The feeling of [m1hisher] mouth constricting around your [cock] feels wonderfully warm and wet, and you realize that [m1heshe] is covering [m1hisher] sharp teeth with [m1hisher] scaled lips.", parse);
		Text.NL();
		Text.Add("Quickly, you push into [m1hisher] hungry muzzle, angling for the back of [m1hisher] throat.", parse);
		if (player.FirstCock().length.Get() > 20) {
			Text.Add(" [m1HisHer] eyes widen as it slides all the way to the back of [m1hisher] forked tongue, squishing up against [m1hisher] throat. You can feel it squeezing your [cock] wetly, a slick tunnel just waiting to be taken. ", parse);
			if (player.FirstCock().length.Get() > 30) {
				Text.Add("With great delight, you push even further forward. [m1Name] lets out a startled whimper as you quickly fill [m1hisher] throat, making it stretch around your [cock]. The tight feeling of [m1hisher] wet throat hugs your fleshy [cock], and you find yourself rapidly humping into [m1hisher].", parse);
			} else {
				Text.Add("You can't quite reach though, your [cock] being just a little too short. [m1Name] seems relieved.", parse);
			}
		}
		Text.Flush();

		Gui.NextPrompt(() => {
			Text.Clear();

			Text.Add("Soon, you settle into a rhythm of drawing your [cock] back, feeling [m1hisher] lips massaging and squeezing your thick shaft. [m1HisHer] tongue curls around your dick, and guides your slick cock deeper into [m1hisher] muzzle. For what seems like ages, you stand there, watching [m1hisher] face as [m1heshe] suckles and nurses on your [cock]. Now and then, [m1heshe] glances up to meet your gaze, only to blush deeply as [m1heshe] realizes [m1heshe]'s been caught. You smirk at how much [m1heshe] seems to be secretly enjoying it.", parse);
			Text.NL();
			Text.Add("Finally, you feel yourself building up to the edge. You reach forward, your hand quickly wrapping around one of [m1hisher] horns and <i>pull</i> [m1hisher] head forward onto your throbbing dick. [m1HisHer] eyes widen, and you feel the pressure in your groin break, a torrent of your seed pumping through your [cock] and down [m1hisher] throat. The reptile's cheeks bulge as you blast your cum across [m1hisher] mouth.", parse);
			Text.NL();
			parse.s = player.NumCocks() > 2 ? "s" : "";
			if (player.NumCocks() > 1) {
				Text.Add("At the same time, your sticky seed spurts out across [m1hisher] face from your other pulsing shaft[s], and [m1heshe] has to close one eye.", parse);
				Text.NL();
			}
			parse.boygirl = enemy.body.Gender() === Gender.male ? "boy" : "girl";
			Text.Add("When your orgasm tapers down, the last vestibules of your spunk dripping through the tip of your [cock], you gaze down at [m1name], your cheeks flush with the afterglow of climax. <i>“Swallow,”</i> you order. [m1HeShe] pauses, looking up at you meekly. [m1HisHer] tail flicks in indecision behind [m1himher], before [m1heshe] takes a heavy <i>gulp</i>. You pat [m1hisher] muzzle. <i>“Good [boygirl],”</i> you mutter, pulling your dick from [m1hisher] muzzle. You take the spoils of the encounter and turn to leave without another word, your pleasure taken.", parse);
			Text.Flush();

			player.Fuck(player.FirstCock(), 2);
			Sex.Blowjob(enemy, player);

			player.AddLustFraction(-1);

			Gui.NextPrompt();
		});
	}

	export function WinPowerbottom(enc: any) {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const enemy: Lizard = enc.male;

		let parse: any = {
			p1name() { return party.members[1].NameDesc(); },
			m1cock() { return enemy.FirstCock().Short(); },
			m1cocks() { return enemy.MultiCockDesc(); },
			m1Name() { return enemy.NameDesc(); },
			m1name() { return enemy.nameDesc(); },
			m1anus() { return enemy.Butt().AnalShort(); },
			m1butt() { return enemy.Butt().Short(); },
			m1face() { return enemy.FaceDesc(); },
		};
		parse = player.ParserTags(parse);

		Text.Clear();

		Text.Add("Your eyes drop to the reptile's groin, and you give him a broad grin. You step up to him, pushing a hand to his snout. <i>“Lie down,”</i> you instruct. He looks questioningly at you, but you ignore him. He's not the one who won, after all. After a moment of hesitation, he slowly lies down on his back. His legs cross just enough to cover his [m1anus] from you. You smirk, finding it cute that the bulky male fears you might do something like that to him.", parse);
		Text.NL();
		if (!player.FirstCock()) {
			Text.Add("You're not even really sure what you'd do.", parse);
			Text.NL();
		}
		Text.Add("Stepping up to him, you kneel, inspecting his body. His scaled underbelly shows strongly packed muscle, barely an inch of fat on him. His arms are thick and powerful, and his strong, angular face gazes at you in uneasy curiosity. You slide forward and place a single finger on the faint outline of his genital slit, pressing slightly. <i>“Get hard,”</i> you command, dragging your finger down.", parse);
		Text.NL();
		Text.Add("[m1Name] looks at you in surprise, but makes no objection. You watch as he quickly gets himself ready, his fingers beginning to massage his slit. In short order, his pair of thick, bulbous shafts push out from his slit, throbbing into the air as they grow to an almost obscene length. You swallow, imagining just what it will be like to have one moving inside you.", parse);
		Text.Flush();

		// [Sure][Nah]
		const options: IChoice[] = [];
		if (player.FirstVag()) {
			options.push({ nameStr : "Cunt",
				func() {
					Text.Clear();
					Text.Add("Slowly, you inch forward, moving until your rump is poised just over his slimier looking shaft, your aching cunt hovering above his reptilian, bulbous tip. He looks at you in excitement, seeming to have realized that he won't be abused today. The lizard raises his hand to help steady your hips - and you let him. Feeling his strong, scaled hands on your hips, you slowly begin to lower yourself, feeling his slick, heavy [m1cock] meet the outer folds of your wet [vag].", parse);
					Text.NL();
					Text.Add("You let gravity help you, and his strong hands. The pressure builds at your entrance, before you hear him let out a hiss. At the same time, his fat, hot tip pushes past the lips of your cunt and you feel him throb powerfully inside of you. He tries to pull you down further onto his dick, but your hands grab a hold of his warningly. [m1Name] stops, seeming slightly sullen. Too bad, you think. This is <i>your</i> victory.", parse);
					Text.NL();
					Text.Add("Feeling him pulse inside of you feels exquisite. Slowly, you slide further down onto him, letting inch after aching inch sink into your heated body. His slimy cock fills you quickly, and you can feel his ridges and supple bulges grinding against your folds. He feels so very hot inside of you.", parse);
					Text.NL();
					Text.Add("Quickly, you feel your hips meet his, his second dick sliding up between your legs.", parse);
					if (player.FirstCock()) {
						Text.Add(" You playfully grind it against your own, leaving him moaning softly.", parse);
					}
					Text.Add(" Back and forth you rock, his hands around your hips helping you both move to a steady rhythm. Before long, you're both moaning softly, your cheeks red as he slides deeply inside of you.", parse);

					const racescore   = new RaceScore(player.body);
					const lizardScore = new RaceScore();
					lizardScore.score[Race.Lizard] = 1;
					const compScore   = racescore.Compare(lizardScore);

					if (compScore > 0.2) {
						Text.NL();
						Text.Add("You find yourself imagining [m1name]'s seed filling your womb... Forming eggs, laying egg after egg for the strong, reptilian warrior underneath you. You blush as the fantasies that seem only half-alien fill your mind. The thought of being seeded by such a strong, handsome male...", parse);

						Text.Flush();
						// [Sure][Nah]
						const options: IChoice[] = [];
						options.push({ nameStr : "Yes!",
							func() {
								Text.Clear();
								Text.Add("You grin at the reptile under you. He grins back at you, his slitted eyes watching yours. You quickly get into it, riding him steadily, grinding your heated mound against his thick [m1cock]. He groans softly, his voice a sibilant hiss, and his hold tightens on your waist. You both want the same thing though, now, and soon you're each moving in unison.", parse);
								Text.NL();
								Text.Add("He presses his bulbous, fat dick deep into your body, slick fluids smearing over your clenching, rippling walls right as you push down, your body pleading for him to take you deeper. You can feel your climax closing in, and know that his won't be far away. Having his thick, custard-like spunk filling your insides as his second coats your groin sends a deeper thrill through your body than you care to admit.", parse);
								Text.NL();
								Text.Add("You moan eagerly, and he joins you with a hissed groan of passion.", parse);
								Text.NL();
								Text.Add("Finally, you feel your own climax hitting like a wave, washing through your very being. Your cunt starts to clamp down on his thick shaft, and you lean forward, placing your hands on his chest and moaning needily. The act seems to be just enough to push him over the edge, too. Your hot, slick [vag] clamps down rhythmically around his heavy shaft as it spasms as well, the two of you almost synchronizing as you sit, impaled on his dick.", parse);
								Text.NL();
								Text.Add("Thick, sticky sperm floods your passage as his other dick sprays it across your groin, while your own juices gush out around his cock, bathing his groin in your essence.", parse);
								Text.NL();
								Text.Add("After a long minute spent there, connected to each other at the hip, you come to your senses enough to pull off of him. He lets you go, watching you in a happy daze, your belly bulging slightly from the sheer volume of his spunk.", parse);
								Text.NL();
								Text.Add("You gather up your things, claiming your fair share from the battle, before slowly heading away.", parse);
								Text.NL();
								if (!party.Alone()) {
									parse.comp = party.Two() ? "companion" : "party";
									Text.Add("Your [comp] joins you, looking at you a little strangely.", parse);
								}
								Text.Flush();

								player.FuckVag(player.FirstVag(), enemy.FirstCock(), 4);
								Sex.Vaginal(enemy, player);

								LizardsScenes.Impregnate(player, enemy);

								player.AddLustFraction(-1);
								Gui.NextPrompt();
							}, enabled : true,
							tooltip : "Being egg-heavy to a virile male like this one sounds perfect.",
						});
						options.push({ nameStr : "No",
							func() {
								Text.Clear();
								Text.Add("The thought of having the lizard under you actually <i>breed</i> with you, though, is not an attractive one. He's not even close to your species. They rape enough, they can live without tainting your womb, too.", parse);
								Text.NL();
								LizardsScenes.WinPowerbottomDeny(enc);
							}, enabled : true,
							tooltip : "He seems handsome, but you don't want to <i>breed</i> with him...",
						});
						Gui.SetButtonsFromList(options);
					} else {
						Text.Flush();
						Gui.NextPrompt(() => {
							Text.Clear();
							LizardsScenes.WinPowerbottomDeny(enc);
						});
					}
				}, enabled : true,
				tooltip : "Just thinking about that thick, ridged slab of meat between your lower lips has you wet...",
			});
		}
		options.push({ nameStr : "Ass",
			func() {
				Text.Clear();
				Text.Add("Slowly inching forward, you let yourself hover just over his pair of serpentine pricks. He watches you intently, his eyes glinting. You simply look down at his powerful chest, taking a deep breath. His hands lift, coming to your hips, and you feel them take hold of you. Knowing how quickly he'll slam you down onto his slimy dicks if you let him get a good grip, you push his hands away. He'll get what he wants soon enough – on <i>your</i> time.", parse);
				Text.NL();
				Text.Add("You let out a soft breath, closing your eyes.", parse);
				Text.NL();
				if (player.FirstVag()) {
					Text.Add("Your moist cunt aches to be filled, but you want to scratch a different itch with the yellow-green reptile under you. Another reason not to let him hold your hips; he'd breed you till you blacked out if he got control, most likely.", parse);
					Text.NL();
					player.AddLustFraction(0.1);
				}
				Text.Add("Slowly, you begin to lower yourself, feeling his slippery, pulsing dicks press against your [butt]. He lets out a hiss of breath as you feel his twin, spaded tips slide between your cheeks, squeezing them between your [butt] teasingly. [m1Name] gazes steadily at you, his slitted eyes caught somewhere between being excited and frustrated.", parse);
				Text.NL();
				if (player.Butt().Tightness() > Orifice.Tightness.loose) {
					Text.Add("You decide to give him a real treat this time. Just one can't satisfy your loose hole, and you need more... and luckily for the both of you, [m1name] can accommodate. You lower yourself down, and feel his twin tips slip toward your [anus]. They slip away, and you reach back with one hand. You squeeze his dicks together, and he hisses in surprise.", parse);
					Text.NL();
					Text.Add("<i>“Careful,”</i> he hisses. You smirk, angling him upward, his ridged, fleshy shafts pulsing in your grip. You sit downward, and feel his two slimy, wet tips push against your sphincter. Relaxing all of your muscles, you slowly sit down, your [feet] gripping the ground on either side of his hips.", parse);
					Text.NL();

					player.FuckAnal(player.Butt(), enemy.FirstCock(), 2);
					Sex.Anal(enemy, player);

					Text.Add("The reptile's eyes widen, and he scratches at the ground as your [butt] sinks down onto both of his slimy dicks at once. You can feel his immense girth stretching you <b>wide</b> open, the flexing shafts tugging at your hole with surprising strength. You can feel him flexing them both eagerly inside of you, his face quickly melting into a mask of ecstasy. <i>“O-oh... Ah...”</i> he whispers. You clench down <i>hard</i>, and his eyes cross as his [m1cocks] squish against each other.", parse);
					if (player.Butt().Tightness() < Orifice.Tightness.gaping) {
						Text.NL();
						Text.Add("You feel your body stretching slowly around him, his twin lengths almost painfully large inside of you.", parse);
						player.Butt().stretch.IncreaseStat(Orifice.Tightness.gaping, 0.5);
					}

					player.AddLustFraction(0.2);
				} else {
					Text.Add("You reach back with one hand, taking hold of his twinned dicks. The look in his eyes tells you all you need to know; he may well try to thrust both into you at once and you have an idea of how painful that would be...", parse);
					Text.NL();
					Text.Add("He lets out a hiss as you aim one away from yourself, but as his second slick, hot shaft meets your [anus] that hiss melts into a croon. He bucks gently against you, but you’re ready for it, quickly rising. His yellow-green muzzle contorts in impatience. You smirk at how eager he is, so soon after being beaten.", parse);
					Text.NL();
					Text.Add("You steady yourself, feeling your tight pucker squeeze against the tip of his slimy pole. A gentle pulse, and you feel a small gush of precum ooze against your entrance, leaving a blush on your cheeks. Slowly, you lower yourself, letting the pressure build against your flesh as his fat, oozing dick presses against you. After what feels like an hour of slow, aching buildup, you feel your tight ring stretch around his slippery, bulbous tip. Two inches sink into you, making your muscles burn... but the burn is worth it.", parse);
					Text.NL();

					player.FuckAnal(player.Butt(), enemy.FirstCock(), 4);
					Sex.Anal(enemy, player);

					Text.Add("<i>“You’re so <b>tight</b>,”</i> [m1name] hisses, his eyes lidding over. He bucks his hips again, and this time you find yourself unable to keep him out. Nearly half of his throbbing flesh sinks into you, ramming into your prostate. You moan softly yourself, clenching <i>hard</i> around him.", parse);
					Text.NL();
					if (player.FirstCock()) {
						if (player.NumCocks() > 1) {
							Text.Add("Your own [cocks] jump to life, throbbing together, bumping against each other.", parse);
						} else {
							Text.Add("Your own [cock] throbs at attention, a bead of precum already drooling from your tip.", parse);
						}
						Text.NL();
					}
					if (player.FirstVag()) {
						if (player.libido.Get() > 40) {
							Text.Add("Your slick [vag] ripples around empty space, already feeling moist, your body eager for things to come.", parse);
						} else {
							Text.Add("Your [vag] grows warmer, and you blush from the new sensation in your [butt].", parse);
						}
						Text.NL();
					}
				}
				Text.Flush();

				Gui.NextPrompt(() => {
					Text.Clear();
					if (player.LustLevel() > 0.75) {
						Text.Add("Slowly you let gravity force you downward, feeling inch after inch of his flesh slide into your body. His hands again come to your hips.", parse);
						Text.NL();
						Text.Add("You move to brush them away again, but pause... The look on his face is one of mounting bliss, and the pleasure that courses through your body has your veins aflame with need. You'll never be taken as hard as if you let him take you – but maybe that's a good thing...", parse);
						Text.Flush();

						// [Sure][Nah]
						const options: IChoice[] = [];
						options.push({ nameStr : "Let him",
							func() {
								Text.NL();
								Text.Add("In the end, your lust wins out, and you let his claws take a grip of your hips. A broad, lusty smirk crosses his muzzle.", parse);
								Text.NL();
								Text.Add("<i>“You want it,”</i> he accuses. You just grin at him, licking your lips. His hands move back further, cupping your cheeks. You feel his scaled hands knead your body, squeezing tightly. His grip hurts, and you reach back to silently tell him to ease up.", parse);
								Text.NL();
								Text.Add("His hands are strong as steel though, and he holds you tightly.", parse);
								Text.NL();
								if (player.Butt().Tightness() > Orifice.Tightness.loose) {
									Text.Add("<i>“Not many can fit both in one hole... Mmm...”</i> his sibilant whispers come. You swallow.", parse);
								} else {
									Text.Add("His second dick bumps against your warm rump, and you feel his slimy precum smearing against you.", parse);
									Text.NL();
									Text.Add("<i>“If only you coulda fitted both,”</i> he rumbles, his eyes half lidded.", parse);
								}
								Text.NL();

								if (player.FirstCock()) {
									Text.Add("You feel your [cocks] jump, and precum dribbles freely. The lizard smirks at the way your own arousal shows. <i>“Let's go faster,”</i> he hisses amusedly.", parse);
									Text.NL();
								}
								if (player.FirstVag()) {
									Text.Add("You feel your [vag] dripping, and heat rises in your cheeks. He smirks up at you, his hands groping your [butt] eagerly, his fingers cool on your [skin].", parse);
									Text.NL();
								}
								Text.Add("Suddenly his grip tightens, and you feel his claws draw blood. You grimace in surprise at the same time as he <i>slams</i> your body downward.", parse);
								Text.NL();
								player.AddLustFraction(-0.05);
								Text.Add("A heavy pressure fills your body, and your [anus] stretches painfully and quickly. Your eyes go wide and you feel the air burst out from your lungs as his fat, slimy ", parse);
								Text.NL();
								if (player.Butt().Tightness() > Orifice.Tightness.loose) {
									Text.Add("dicks both slide deeper into you in the span of a half second. Your cheeks redden, and you feel your entire body filled with his dual dicks.", parse);
								} else {
									Text.Add("cock sinks deeper and deeper into your clenching hole within a second. You feel your cheeks burning as he fills you.", parse);
								}
								Text.NL();
								Text.Add("A loud hiss of pleasure escapes his muzzle as you feel your [butt] press up to his slit, and with a dull ache that spreads through your rump, you realize that he's hilted in you.", parse);
								Text.NL();
								if (player.Butt().Tightness() > Orifice.Tightness.loose) {
									Text.Add("His fingers squeeze your [butt] tighter, kneading your cheeks like dough as his nostrils flare. You feel yourself lifted upward, and his ridged, bulbous cocks slip back out from your loose hole. <i>“Oh yessss... So good,”</i> he hisses, his eyes halfway closing.", parse);
								} else {
									Text.Add("You feel him groping your [butt] in his powerful hands, his breathing coming raggedly as he lifts you up again, tugging his dripping length out of your body. His eyes open again and he gives a lascivious grin, licking his lips.", parse);
								}
								Text.NL();
								Text.Add("Finally he lets go of your sore, abused cheeks with one hand, and you feel yourself begin to slide down. You take a sharp breath to fill your empty lungs, only to have it robbed from you as firm scales <i>smack</i> your tender ass. Stars burst in front of your eyes as his hand impacts your ass again... And then again, and again. He grins broadly as you let out a gasp.", parse);
								Text.NL();
								if (player.body.Gender() === Gender.female) {
									Text.Add("Despite yourself, you feel your wet cunt growing only more heated as he works your back passage, and the wet dripping from your lips onto his groin seems to fuel his mood further...", parse);
								} else {
									Text.Add("Despite yourself, you feel your ", parse);
									if (player.NumCocks() > 1) {
										parse.s = player.Butt().Tightness() > Orifice.Tightness.loose ? "s" : "";
										Text.Add("dicks throbbing at aching attention, and can feel [m1name]'s fat dick[s] mashing against your prostate.", parse);
									} else {
										Text.Add("[cock] throbbing at aching attention, dripping slowly onto the reptile's stomach. ", parse);
										if (player.Butt().Tightness() > Orifice.Tightness.loose) {
											Text.Add("His dual cocks mash up against your prostate, sending electric tingles through your entire body.", parse);
										} else {
											Text.Add("[m1Name]’s heavy shaft throbs inside you, its brother pushing against your [butt].", parse);
										}
									}
									Text.NL();
									if (player.Butt().Tightness() > Orifice.Tightness.loose) {
										Text.Add("As those ridged, slick appendages squish ", parse);
									} else {
										Text.Add("As his ridged, slimy prick squishes up ", parse);
									}

									Text.Add("against your sensitive spot, your cheeks grow a darker shade of red and you feel precum forced up and through your [cocks]. [m1Name] smirks as it drips from your body, and you can't completely suppress a moan as he <i>rams</i> himself against your prostate again.", parse);
								}
								Text.NL();
								Text.Add("Up and down he lifts you and pulls you down, forcing his ", parse);
								if (player.Butt().Tightness() > Orifice.Tightness.loose) {
									Text.Add("[m1cocks] through your achingly stretched [anus]. You can hear wet, fleshy noises as he squeezes his throbbing dicks between your sore cheeks again.", parse);
								} else {
									Text.Add("slimy, wet meat through your increasingly sloppier [anus]. You can feel your clenches growing weaker, feel it becoming increasingly difficult to keep him out as his bulbous ridges and strangely textured rod slides in and out of your aching hole.", parse);
								}
								Text.NL();
								Text.Add("For what seems like ages he drives into you, hoisting you up until less than an inch remains, leaving just his spaded, slick ", parse);
								if (player.Butt().Tightness() > Orifice.Tightness.loose) {
									Text.Add("tips inside of you, only for his tightly gripping claws to shove you down to the base of his throbbing spires. With his heavy shafts pulsating inside of you, you find yourself unable to hold back a quiet moan. [m1Name] smirks, grinding his hips against your [butt]", parse);
								} else {
									Text.Add("tip lodged inside of your squeezable, [butt]. His claws hold you tightly and you feel him suddenly wrenching you downward, burying his shaft in your soft insides. Grinning in satisfaction, he grinds his groin against your [butt]", parse);
								}
								if (player.FirstCock()) {
									if (player.Butt().Tightness() > Orifice.Tightness.loose) {
										Text.Add(", his [m1cocks]", parse);
									} else {
										Text.Add(", his slimy flesh", parse);
									}
									Text.Add(" pressing mercilessly against your prostate. Your moans turn higher still. As he bounces you up and down in his lap, you can feel a steady pressure growing in your body, an aching heat that you realize is only growing harder to resist. Your feel your [cocks] twitch, and a steady stream of precum oozing through your urethra leaves you blushing.", parse);
									player.AddLustFraction(0.1);
								} else {
									Text.Add(".", parse);
								}
								Text.Flush();

								Gui.NextPrompt(() => {
									Text.Clear();
									if (player.Butt().Tightness() > Orifice.Tightness.loose) {
										Text.Add("With one great <i>heave</i>, he shoves you upward, and you feel your [anus] clench down around his pulsating tips. Even as they begin to twitch, you know what's coming. You relax your loose entrance as much as you can, right as you feel his firm hands pull you downward. At the same time, he bucks his hips upward, plunging himself into you one last time. Ridge after firm, fleshy ridge sinks into your body, and you feel his spaded tips sink deep into you, stretching your insides until they ache.", parse);
										Text.NL();
										Text.Add("His [m1cocks] spasm and pulse inside of you, and his hands squeeze your taut rump tightly.", parse);
									} else {
										Text.Add("[m1Name] squeezes you tightly, his powerful hands pressing in around you. His scales feel rough as he <i>shoves</i> you upward. You feel your tight pucker clench down around his tip, trying to keep his slippery, bulbous flesh inside of you. His throbbing, spongy shaft twitches inside of you, its brother sliding wetly against your rump, slathered in his precum. His hands pull you downward as his hips piston upward, the reptile burying himself in you one more time. Hard, supple ridges plow into your body, making your muscles spasm.", parse);
										Text.NL();
										Text.Add("You feel both his heated dicks begin to twitch and pulse wildly, and his eyes lose focus.", parse);
									}
									Text.NL();
									Text.Add("<i>“A-ah... Yessssss!”</i> he hisses, his right leg kicking, making you bounce up and down in his lap.", parse);
									Text.NL();

									const scenes = new EncounterTable();
									scenes.AddEnc(() => {
										if (player.FirstCock()) {
											parse.s = player.Butt().Tightness() > Orifice.Tightness.loose ? "s" : "";
											parse.notS = player.Butt().Tightness() > Orifice.Tightness.loose ? "" : "s";
											Text.Add("As his fat, slimy tip[s] hammer[notS] against your prostate, you feel yourself clenching tighter and tighter, your whole body locking up.", parse);
											Text.NL();
										}
										Text.Add("The feeling of him sliding in and out of your body grows harder and harder to ignore, and the lizard's every thrust and hump makes your [anus] <i>stretch</i> around his fat ridges. Faster and faster he rails you, until you can't hold it in anymore. You feel your head fall back, the sky looming above you, and you <i>howl</i> out as your slick hole clenches around [m1name]. You can feel the tubes running down the underside of his twin cocks bulge heavily, his potent, sticky cum quickly pumping through them and directly into ", parse);
										if (player.Butt().Tightness() <= Orifice.Tightness.loose) {
											Text.Add("and onto ", parse);
										}
										Text.Add("your body.", parse);
										Text.NL();
										Text.Add("[m1Name]'s eyes roll back in his head as he rocks with you, and you feel your already full hole flooding with hot, reptilian cum.", parse);
										Text.NL();
										if (player.Butt().Tightness() > Orifice.Tightness.loose) {
											Text.Add("Through both of his fat, bulbous dicks he fills you scarily quickly, and you feel it pushing deeper into your body with fleshy, grumbling noises centered on your gut. Viscous slime gushes out from your [anus] in spurts as he overfills you, and his constant thrusting smears it all over your [butt].", parse);
										} else {
											Text.Add("His heavy dick pumps thick, sticky gouts of reptilian slime into your gut, filling you with a deep seated heat. You feel [m1name]’s second dick throbbing and jumping between your cheeks, painting your [butt] with virile, gooey spunk; you feel it dripping slowly down your flesh.", parse);
										}
										Text.NL();
										if (player.FirstVag()) {
											Text.Add("Your slick [vag] spasms wildly, and you feel your legs give out from under you. As [m1name] turns your [anus] shamefully messy, pleasure swamps your mind and you do the same to your [vag].", parse);
											Text.NL();
										}
										if (player.FirstCock()) {
											Text.Add("At the same time, you feel thick ropes of your own seed erupting from your [cocks], splattering messily across [m1name]'s belly scales.", parse);
											Text.NL();
										}
										Text.Add("He holds you there as you both climax, bucking his hips up and into you from below, pumping his sticky slime deeper into your body and letting it drool from your sloppy hole. You hold his arms tightly as he takes you for a ride, an almost drunken look on your face as you ride out your own orgasm.", parse);
										player.AddLustFraction(-1);

										Text.NL();
										Text.Add("Finally he begins to slow... and with one last heavy roll of his hips he <i>drives</i> himself to the hilt, drawing a breathless moan from your lips, before he slowly begins to pull you forward and off of him. His thick ridges stretch you wonderfully again, the motion in your back passage making your [anus] distend outward. As you move, you can feel his warm spunk pooling inside of you.", parse);
										player.AddLustFraction(0.05);
										Text.NL();
										Text.Add("His powerful arms tug you forward, his twitching meat sliding out of you as you land on his chest, resting on him.", parse);
										if (player.FirstBreastRow().size.Get() > 3) {
											Text.Add(" Your breasts squish up against his chest, and he smirks at you, his snout mere inches in front of you.", parse);
										}
										Text.NL();
										Text.Add("One scaled hand comes to your [face], and he holds you steady. Surprisingly, he pushes his own, yellow-green snout forward... and kisses you. Your eyes widen as you find yourself unsure what to do. His forked tongue laps at your lips for a moment, before he pulls back and gives a hazy grin, only to fall back.", parse);
									}, () => player.LustLevel() + (player.FirstCock() ? 0.2 : 0));
									scenes.AddEnc(() => {
										Text.Add("You feel him rocking faster and faster inside of you. His muzzle parts, and his tongue hangs out from his maw. You can feel his every thrust burying his fat, heavy ridges deeper inside of you, stretching you so achingly wide. It feels wonderful, the warm slime of his [m1cocks] sliding through your [anus].", parse);
										Text.NL();
										parse.s = player.Butt().Tightness() > Orifice.Tightness.loose ? "s" : "";
										parse.notS = player.Butt().Tightness() > Orifice.Tightness.loose ? "" : "s";
										if (player.FirstCock()) {
											Text.Add("His fat, slick tip[s] batter[notS] your prostate, driving you harder against your own pleasure which grows harder and harder to resist. The wet slaps of his groin against you becomes hard to ignore, and you lean forward to try and support yourself.", parse);
											Text.NL();
											Text.Add("The new angle drives you even harder, and your eyes open wide in surprise.", parse);
											Text.NL();
											player.AddLustFraction(0.1);
										}
										if (player.FirstVag()) {
											Text.Add("As he pistons himself up and into your body, you find it hard to concentrate. Your wet [vag] drips onto his [m1cocks], making his thrusts come even easier, letting him slide deeper inside of you. He closes his eyes, his fat meat slotting into you relentlessly.", parse);
											Text.NL();
										}
										Text.Add("His thrusting grows shorter and shorter, and you can see his slitted eyes unfocusing. His breath comes heavily, and you can tell he's right at his limit. You wish you were at yours... Finally, with one, hard <i>thrust</i>, he slams his hips up against your [butt], letting out a loud hiss of delight.", parse);
										Text.NL();
										Text.Add("Suddenly you feel his ", parse);
										if (player.Butt().Tightness() > Orifice.Tightness.loose) {
											Text.Add("twin ", parse);
										} else {
											Text.Add("immense ", parse);
										}
										Text.Add("dick[s] bulge, growing painfully stiff inside of you. Thick, hot slime begins to fill your [butt] quickly, overfilling you in seconds. A blissfully dazed look crosses [m1name]'s [m1face] and he humps against your [butt] fervently, longing moans escaping his throat.", parse);
										Text.NL();
										if (player.FirstVag()) {
											Text.Add("You feel your [vag] clench down tightly, and a heat passes through your body... Despite his heavy thrusts, it just isn't quite enough for you to reach that tantalizing threshold. You let out a needy groan, grinding back against him futilely.", parse);
										} else {
											Text.Add("As hard as he cums inside of you, you don't even come close to his pleasure. You grind yourself down onto his throbbing meat, trying to push yourself over the edge, but it's not quite enough. You bring your hands down to take hold of yourself, but his hands catch yours, holding them in place... You groan in burning need.", parse);
										}
									}, () => 1 - player.LustLevel() - (player.FirstCock() ? 0.2 : 0));

									scenes.Get();

									Text.NL();
									Text.Add("You feel his spurts grow less and less, until you can't feel his hot sperm flowing any longer. His hands fall away from you.", parse);
									Text.NL();

									LizardsScenes.Impregnate(player, enemy, PregnancyHandler.Slot.Butt);

									Text.Add("In a moment, you can see that he's passed out.", parse);
									Text.NL();
									Text.Add("Gingerly you stand up, breathing hard, your cheeks burning. As his flesh pops free from your pucker you tremble, feeling his potent slime dripping from your hole. ", parse);
									if (player.Butt().Tightness() > Orifice.Tightness.loose) {
										Text.Add("Clenching your [anus] as much as you can, you blush as you realize that it isn't managing to close entirely. ", parse);
									}
									Text.Add("As [m1name]'s thick spunk drips down your legs, you gather your things, claim the spoils of victory, and make to leave...", parse);
									player.AddLustFraction(0.25);

									if (party.Two()) {
										Text.NL();
										Text.Add("[p1name] joins you, giving you a funny look.", parse);
									} else if (!party.Alone()) {
										Text.NL();
										Text.Add("Your party joins you, giving you a few funny looks.", parse);
									}
									Text.Flush();

									Gui.NextPrompt();
								});

							}, enabled : true,
							tooltip : "You've already won, why not let him have a little fun with you?",
						});
						options.push({ nameStr : "Deny him",
							func() {
								LizardsScenes.WinPowerbottomAssert(enc);
							}, enabled : true,
							tooltip : "You don't like how rough he might go...",
						});
						Gui.SetButtonsFromList(options);
					} else {
						LizardsScenes.WinPowerbottomAssert(enc);
					}
				});
			}, enabled : true,
			tooltip : Text.Parse("There's something about having something pushing deep into your [anus]...", parse),
		});
		if (options.length > 1) {
			Gui.SetButtonsFromList(options);
		} else {
			Gui.NextPrompt(options[0].func);
		}

		Text.Flush();
	}

	export function WinPowerbottomAssert(enc: any) {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const enemy: Lizard = enc.male;

		let parse: any = {
			p1name() { return party.members[1].NameDesc(); },
			m1cock() { return enemy.FirstCock().Short(); },
			m1cocks() { return enemy.MultiCockDesc(); },
			m1Name() { return enemy.NameDesc(); },
			m1name() { return enemy.nameDesc(); },
			m1anus() { return enemy.Butt().AnalShort(); },
			m1butt() { return enemy.Butt().Short(); },
		};
		parse = player.ParserTags(parse);

		Text.Clear();
		Text.Add("You push his hands away, giving him a dark, sultry look. He lets out a low, hissing whine of discontentment. You can't help but grin, rolling your hips against his body as you stop him taking control. You know that your pleasure will be the last thing on [m1name]'s mind - and this is about <i>you</i>. You won. You clench your loose hole around his ", parse);
		if (player.Butt().Tightness() > Orifice.Tightness.loose) {
			Text.Add("pair of pulsing dicks ", parse);
		} else {
			Text.Add("twitching, eager shaft ", parse);
		}
		Text.Add("though, and watch as his eyes roll back in his head. You smirk at how easy he is to play with. The scent of his own lust meets your nostrils, and you inhale slowly. The way his flesh pulses inside of your [anus] leaves you feeling tender.", parse);
		Text.NL();
		if (player.FirstVag()) {
			Text.Add("Your heated cunt clenches wetly, and you feel decidedly empty there, even if the sensations are definitely worth it.", parse);
			Text.NL();
		}
		if (player.FirstCock()) {
			parse.notS = player.NumCocks() > 1 ? "" : "s";
			Text.Add("Your [cocks] throb[notS], and you feel a shudder run down your spine as [m1name]'s own pair pulse in rhythm with yours.", parse);
			Text.NL();
		}
		parse.s = player.Butt().Tightness() > Orifice.Tightness.loose ? "s" : "";
		Text.Add("[m1Name] thrusts upward, burying his rock-solid, ridged pole[s] into your waiting passage. Your hands press down on his stomach, while his grip the ground firmly. Your [anus] burns gently from the stretch, but he doesn’t let up, slowly pressing his hips upward against you. You hear yourself groaning softly, and move yourself steadily up, keeping him from sinking in further.", parse);
		Text.NL();
		Text.Add("<i>“Stop moving,”</i> you order. He ignores it, trying to push himself deeper again. You grunt softly and start to pull off of him as he lets out a hiss of discontentment. You pause, feeling his spires pulse, thick spurts of slime invading your body. Suddenly, [m1name] stops moving, waiting, watching you carefully. You stop pulling off of him, and he begins to slide deeper into you once more. Immediately, you pull yourself off again, feeling his slippery flesh tugging free of your loose ass. [m1Name] tenses up, coming to a halt again.", parse);
		Text.NL();
		Text.Add("<i>“Stop, or I pull off,”</i> you warn lowly. The lizard lets out a hiss of grudging understanding. <i>“Are you going to be a good boy?”</i> you whisper. He growls lowly, unhappily, but nods once. You smirk, letting one hand slide back to press his hips back to the ground. <i>“Good answer...”</i>", parse);
		Text.Flush();

		Gui.NextPrompt(() => {
			Text.Clear();

			Text.Add("Slowly, you begin to press yourself down onto him, keeping things to your own pace. The reptile under you squirms steadily, his face contorted uncomfortably as he holds himself back from bucking upward into you. Every time he looks at you, his muzzle reddened and his breathing heavy, you give him a warning look to remind him who’s in control, and what happens if he pushes. You feel his fat ridges sinking into you, ", parse);
			if (player.Butt().Tightness() > Orifice.Tightness.loose) {
				Text.Add("filling your body completely, both of his wet, slimy poles squishing together inside of you.", parse);
			} else {
				Text.Add("his twitching dick pulsing inside of you. His every movement sends tingles down your spine even as his second spire leaks that musky ooze onto your flesh.", parse);
			}
			Text.NL();

			if (player.FirstCock()) {
				parse.s = player.Butt().Tightness() > Orifice.Tightness.loose ? "s" : "";
				parse.notS = player.Butt().Tightness() > Orifice.Tightness.loose ? "" : "s";
				Text.Add("His spongy, drooling tip[s] grind[notS] against your engorged prostate and you hear a soft, fleshy squelch as you grind yourself down onto him. He lets out a hiss of pleasure as you send a slick spurt of precum from your [cocks] over his chest.", parse);
				Text.NL();
			}
			Text.Add("You set into a steady pace, lifting yourself up to his oozing tips, only to let yourself sink back down, pushing his dense flesh ", parse);
			const tail = player.HasTail();
			if (tail) {
				parse.s = tail.count > 1 ? "s" : "";
				Text.Add("back under your tail[s].", parse);
			} else {
				Text.Add("into you once more.", parse);
			}
			Text.Add(" Deeper and deeper he slides, filling your clenching passageway completely.", parse);
			if (player.Butt().Tightness() > Orifice.Tightness.loose) {
				Text.Add(" Even loose as you are now, it’s a challenge to fit both of him at the same time.", parse);
			}
			Text.NL();
			Text.Add("Each time you come close to fitting him completely, you find him just a little too thick and have to rise again - yet each time you stop, you find yourself fitting just a little bit more...", parse);
			Text.NL();
			if (player.Butt().Tightness() > Orifice.Tightness.loose) {
				Text.Add("[m1Name] hisses out, his eyes glazing over as he squirms underneath you, and you clench around his twin lengths, delighting in the gasp it draws from his muzzle... and the warm fluid you feel filling you. You spread your legs further, feeling the muscles in your legs stretch as [m1name] stretches other ones for you. Up and down you bounce in his lap, breathing harder with each moment, your blood pounding in your ears.", parse);
				Text.NL();
				Text.Add("He feels so big inside of you, being taken by what feels like two males at once. You can feel him getting closer...", parse);
			} else {
				Text.Add("[m1Name] claws at the ground in ecstasy, his shaft throbbing powerfully inside of you and making your pucker stretch. His second shaft twitches against your [butt], smearing ever more of his slick, oily precum over your flesh. He moans lowly, squeezing his eyes shut as your muscles stretch to fit him.", parse);
				Text.NL();
				Text.Add("Up and down you bounce in his lap, breathing harder with each moment, your blood pounding in your ears. Your hole burns, a deep ache in your ring as it slides up and down along his bulbous meat, but the pleasure only bubbles up inside of you.", parse);
			}
			Text.NL();
			Text.Add("You feel yourself nearing the edge too. The lizard’s thick, slimy meat moving inside of you engulfs your thoughts, the way you feel so completely filled punctuating each heartbeat. Your every motion leaves him deeper inside of you, his fleshy ridges jumping with his pulse and toying with your senses.", parse);
			Text.NL();
			if (player.FirstBreastRow().Size() > 3) {
				Text.Add("You feel [m1name]’s hands suddenly reach forward, groping your [breasts] firmly, cupping your sensitive mounds. You moan softly, pressing your melons forward into his grip as his fingers slide forward, coming to your stiff nipples, gently tweaking them. As you gaze at the lizard, he seems halfway drunk with pleasure, his dicks pulsing helplessly as you ride him.", parse);
				Text.NL();
			}
			if (player.FirstCock()) {
				Text.Add("You lift one hand, grabbing hold of your [cocks], stroking yourself rapidly, your eyes closing. It feels so good, you could almost...", parse);
				Text.NL();
			}
			parse.of = player.Butt().Tightness() > Orifice.Tightness.loose ? "of" : "and against";
			Text.Add("You can’t hold yourself back any longer. You feel it coming already, and can’t stop yourself as his fat meat pushes deep into you, sending you over the edge. You moan loudly, <i>ramming</i> yourself down into his lap, feeling his dense cocks hilt inside [of] you as your climax erupts.", parse);

			player.AddLustFraction(-1);

			Text.NL();
			if (player.FirstCock()) {
				Text.Add("You feel thick gouts of slime erupting from your [cocks], splattering messily over [m1name]. His eyes close as you cum hard enough to paint his muzzle in your sticky seed.", parse);
				Text.NL();
			}
			if (player.FirstVag()) {
				parse.cl = player.FirstVag().clitCock ? "" : Text.Parse(", a deep heat spreading from your [clit]", parse);
				Text.Add("Your wet cunt finally gives out and you feel your walls clamping down tightly[cl]. As you bounce up and down on his groin, your juices gush over him, soaking his own dicks and slit.", parse);
				Text.NL();
			}
			Text.Add("As your pucker clenches down around [m1name] over and over, he <i>howls</i> out. Helplessly, he bucks upward into you, humping against your entrance wildly and sending sharp jolts through your system. Cumming messily, you dimly feel his own twin cocks begin to throb heavily, set off by your powerful clenching. Scaled hands grip your hips, holding you down as he finishes inside your ", parse);
			if (player.Butt().Tightness() > Orifice.Tightness.loose) {
				Text.Add("loose, aching hole. His twin, heavy dicks spurt inside of you, sending jet after jet of sticky lizard spunk deep into your gut. You feel yourself rapidly growing full. As his internal balls empty out inside of you, it grows too much. His slimy cum gushes out of your aching hole, still clenching to try and keep as much as possible.", parse);
			} else {
				Text.Add("tight, clenching hole. You feel his dicks stiffen, growing thicker right before a wet, sticky gush of reptilian sperm pumps into your body. As one dick fills you with his slimy essence, you feel warm spunk splattering between your cheeks, [m1name]’s second shaft coating you in his warmth.", parse);
			}
			Text.NL();

			LizardsScenes.Impregnate(player, enemy, PregnancyHandler.Slot.Butt);

			Text.Add("<i>“Y... yes,”</i> he hisses, pushing his hips up against you.", parse);
			Text.NL();
			Text.Add("Eventually, you feel yourself coming down from that carnal high, feel the reptile under you finally taper off to small spurts, then nothing. You pant heavily, slowly getting control of yourself. [m1Name] looks covered in a sheen of sweat, laying there in the dirt. Slowly, you stand up and turn away, shaking your head.", parse);
			Text.NL();
			Text.Add("Gathering your things, you look back to [m1name], only to find that he has passed out, his twin shafts still dripping.", parse);
			Text.NL();
			Text.Add("As [m1name]'s thick spunk drips down your legs you claim the spoils of victory, making to leave...", parse);

			if (party.Two()) {
				Text.NL();
				Text.Add("[p1name] joins you, giving you a funny look.", parse);
			} else if (!party.Alone()) {
				Text.NL();
				Text.Add("Your party joins you, giving you a few funny looks.", parse);
			}
			Text.Flush();

			Gui.NextPrompt();
		});
	}

	export function WinPowerbottomDeny(enc: any) {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const enemy: Lizard = enc.male;

		let parse: any = {
			p1name() { return party.members[1].NameDesc(); },
			m1cock() { return enemy.FirstCock().Short(); },
			m1cocks() { return enemy.MultiCockDesc(); },
			m1Name() { return enemy.NameDesc(); },
			m1name() { return enemy.nameDesc(); },
			m1anus() { return enemy.Butt().AnalShort(); },
			m1butt() { return enemy.Butt().Short(); },
		};
		parse = player.ParserTags(parse);

		Text.Clear();
		parse.cl2 = player.FirstVag().clitCock ? " rubbing your cock" : Text.Parse(" pressing your [clit]", parse);
		Text.Add("You ride him for all you're worth, racing him to climax, now, hungering to get your own finish without giving him his own inside of you. You lean forward,[cl2] against the ridges along his length. The added stimulation quickly begins to send your vision cloudy.", parse);
		Text.NL();
		Text.Add("Finally, you feel your [vag] begin to spasm around him. You throw back your head and <i>moan</i> as your cunt begins to clench around him, losing control over your muscles as you ride him desperately. Your juices gush from your lips, making a mess of his groin as you bounce up and down on his shaft.", parse);
		Text.NL();

		if (Math.random() < (10 + player.strength.Get() / 2) / 100) {
			Text.Add("Finally, you pull yourself off, keeping his hands from your hips. He groans, hissing in need for you to continue, but you just gaze at him, still recovering from your own climax as your fluids drip down your leg. <i>“H-have... fun,”</i> you stammer, quickly collecting your things, and walking away...", parse);
		} else {
			Text.Add("Finally, you move to pull yourself off from him... but his hands lock firmly around your hips. You quickly try to pull his hands away, but the reptile seems spurred on with newfound strength! Realizing you rode him too long, gave him too much of a chance with your body, you can do little but squirm, trying to pull off as he humps roughly up into your spasming cunt. You see spots in front of your eyes from the stimulation, and let out a helpless moan.", parse);
			Text.NL();
			Text.Add("He grins toothily at your moaning, his bucking growing more erratic by the moment. With one last, powerful buck of his hips, he lodges his bulbous, reptilian breeding pole deep in your body, and you feel gouts of slimy, thick cum pumping into your womb. You groan, trying to pull away again, but he simply holds you there. You feel spurt after spurt filling your womb, until your stomach stretches slightly. Finally spent, he simply... lets go.", parse);
			Text.NL();
			Text.Add("You get up, staggering off of him, your cheeks flushed. How quickly he turned that around... Then again, you can't help but feel that you <i>did</i> ask for that to happen. [m1Name] smirks at you as you watch him, two fingers idly tapping his twin shafts. You gather your things and the spoils of battle, and quickly hurry away.", parse);
		}

		if (party.Two()) {
			Text.NL();
			Text.Add("[p1name] follows you.", parse);
		} else if (!party.Alone()) {
			Text.NL();
			Text.Add("Your party follows you.", parse);
		}

		player.FuckVag(player.FirstVag(), enemy.FirstCock(), 3);
		Sex.Vaginal(enemy, player);

		LizardsScenes.Impregnate(player, enemy);

		Text.Flush();

		player.AddLustFraction(-1);
		Gui.NextPrompt();
	}

	export function LossPrompt() {
		const player: Player = GAME().player;
		SetGameState(GameState.Event, Gui);

		const enc = this;

		let parse: any = {
			m1Name() { return enc.male.NameDesc(); },
			m1hisher() { return enc.male.hisher(); },
			m1HeShe() { return enc.male.HeShe(); },
			m1heshe() { return enc.male.heshe(); },
		};
		parse = player.ParserTags(parse);

		Gui.Callstack.push(() => {
			Text.Clear();
			if (player.LustLevel() > 0.6) {
				Text.Add("You slump to the ground, finding it hard to keep your eyes focused on the leering, scaled creatures standing over you. Your body aches, and not just from bruises. ", parse);
				// If male
				if (player.FirstCock() && !player.FirstVag()) {
					Text.Add("Your breathing comes in wheezes, and you can feel your pulse thundering in both your ears and your almost painfully aroused [cocks].", parse);
				} else if (!player.FirstCock() && player.FirstVag()) {
					Text.Add("Your [breasts] heave and you gaze steadily at the ground for several long, tense moments, feeling your [vag] beginning to stick to your clothing as slick fluids drip from it.", parse);
				} else if (player.FirstCock() && player.FirstVag()) {
					Text.Add("You find it hard to concentrate through the fog being pumped through your brain by your dually aroused sexes. Your [vag] quivers, and you can feel your own fluids trickling down your [leg]. Set to the rhythm of your cunt's slick clenching, you can feel the pulses sending shivers up and down your spine from your [cocks].", parse);
				}
				Text.NL();
				Text.Add("[m1Name] stops in front of you, gazing down over your heaving form, a smirk on [m1hisher] face. [m1HeShe] leans down, hands reaching for your shoulders. You don't even bother to resist. The way that [m1heshe] looks at you hungrily as [m1heshe] lifts you by your shoulders, intentions deviously obvious, you can't quite manage to bring yourself to regret losing the fight...", parse);
			} else { // NOT AROUSED
				Text.Add("The final hit knocks you down to the ground leaving you momentarily stunned. You shake your head to try to settle your scrambled thoughts, only to see two big, scaled feet stop in front of your battered body. Before you can escape, the lizard's weapon clatters to the ground and two frighteningly powerful hands hoist you up into the air, where you find yourself face to face with the leering reptile.", parse);
			}
			Text.Flush();

			Gui.NextPrompt(() => {
				const scenes = new EncounterTable();

				scenes.AddEnc(() => { LizardsScenes.LossMale.call(enc);   });
				scenes.AddEnc(() => { LizardsScenes.LossFemale.call(enc); });

				scenes.Get();
			});
		});

		Encounter.prototype.onLoss.call(enc);
	}

	export function LossMale() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const enc = this;

		const member1 = party.members[1];
		const member2 = party.members[2];

		let parse: any = {
			m1name() { return enc.male.nameDesc(); },
			m1Name() { return enc.male.NameDesc(); },
			m1race() { return enc.male.body.RaceStr(); },
			m1hisher() { return enc.male.hisher(); },
			m1HeShe() { return enc.male.HeShe(); },
			m1heshe() { return enc.male.heshe(); },
			m1cock() { return enc.male.MultiCockDesc(); },
			p1name() { return member1.name; },
			p1himher() { return member1.himher(); },
			p2name() { return member2.name; },
			p2heshe() { return member2.heshe(); },
			m2Name() { return enc.female.NameDesc(); },
			m3name() { return enc.third.nameDesc(); },
		};
		parse = player.ParserTags(parse);

		Text.Clear();
		Text.Add("The reptilian creature brings you closer, smirking at you lewdly. His slitted eyes watch you with keen interest, and you can feel them roaming lower. You dare a glance across your assailant's body and see exactly what you hoped you wouldn't see. Between his potently muscled legs, his [m1cock] slowly, but surely are rising to attention. You struggle mightily, squirming and thrashing to try and break free, but in your already weakened state you are no match for the reptile.", parse);
		Text.NL();

		if (player.Armor()) {
			Text.Add("He lifts your hands up above your head, one thick hand gripping your wrists, while his other hand draws close to your body. With a thick looking finger, he slowly tugs down the length of your [armor], letting them fall away from your bruised body, leaving them in a slump on the ground.", parse);
			Text.NL();
			player.AddLustFraction(0.05);
		}

		const scenes = new EncounterTable();
		// IF FEMALE OR HERM
		scenes.AddEnc(() => {
			Text.Add("With a lascivious smirk, his eyes hungrily drink in the sight of your body.", parse);
			if (player.FirstBreastRow().size.Get() >= 3) {
				Text.Add(" His scaled hand comes up and roughly gropes your [breasts], a delighted look on his face as he plays with your exposed mounds.", parse);
			}
			Text.NL();

			Text.Add("His hand trails lower, rubbing over your belly. It feels slightly cool to the touch, almost as chilled as the harsh expression on his face. <i>“What a pretty thing,”</i> he hisses, his muzzle splitting into a grin. <i>“Does the little girly want to be played with?”</i> he asks, giving a sibilant chuckle.", parse);
			Text.NL();

			if (player.LustLevel() < 0.5) {
				Text.Add("You shake your head avidly. You are definitely not in the mood right now. <i>“Too bad.”</i>", parse);
			} else {
				Text.Add("You close your eyes, trying to think of a way to say 'Yes' without degrading yourself. Your thoughts are broken by [m1name] chuckling darkly. <i>“Can't even bring yourself to say 'no', can you?”</i>", parse);
			}
			Text.Add(" His hand trails lower, and you look away.", parse);
			Text.NL();

			if (member1 && enc.female.LustLevel() > 0.4) {
				Text.Add("You see [p1name] cringing, trying to get away from the reptile pinning [p1himher] to the ground. [m2Name] grins at [p1name] lewdly, holding [p1himher] down as [m2heshe] begins to grope and tease [p1himher].", parse);
				if (member2 && enc.third) {
					Text.Add(" Meanwhile, [p2name] is battering at [m3name] with one fist that [p2heshe] managed to get free, but it only seems to be egging [m3name] on further.", parse);
				}
				Text.NL();
				player.AddLustFraction(0.05);
			}

			// Check for numcocks
			const cockNum = player.NumCocks();
			if (cockNum === 1) {
				Text.Add("His hand stops halfway down your body, hovering just above your [cock] for a moment. His eyes narrow and his nostrils flare, before his hand trails lower... He doesn't seem that interested in it this time.", parse);
			} else if (cockNum > 1) {
				Text.Add("His hand stops just above your groin, and he smirks. His fingers hover above your [cocks] hesitantly, before moving further down.", parse);
			}

			if (cockNum === 2) {
				Text.Add(" <i>“Halfway to being a [m1race]...”</i>", parse);
			}
			Text.NL();
			Text.Add("The sudden touch of his clawed finger to your [vag] startles you back to attention, and your eyes widen.", parse);
			if (player.LustLevel() < 0.5) {
				Text.Add(" You struggle to get away again, kicking at him, but your fatigued body just can't muster up the strength to fight him off.", parse);
			}
			Text.Add(" His finger begins to slowly rub and stroke your outer folds, slowly beginning to work itself inwards. ", parse);
			if (player.LustLevel() < 0.5) {
				Text.Add("As much as you hate to admit it, his surprisingly gentle touch doesn't feel as bad as you think it should.", parse);
			} else {
				Text.Add("You bite your lip softly, squeezing your eyes shut. His teasing, slow touches drive you further into the pink haze of lust that threatens to engulf you.", parse);
			}
			Text.NL();
			Text.Add("The lizard draws his hand away and lifts it to his muzzle. <i>“I wonder how much it will take to make you squeal,”</i> he leers, popping his finger into his maw. When he pulls it back out, it glistens with saliva. You try to squirm away, but his hand holding you in the air leaves you helpless. You realize there's no one around able to help you.", parse);
			Text.NL();
			Text.Add("Suddenly his finger makes contact with your [vag], this time that much slicker. He smirks, pushing it a half an inch in. He begins to twist it, stroking along your folds, seeming to revel in the heat of your body.", parse);
			if (player.LustLevel() < 0.5) {
				Text.Add(" Before long, you find yourself growing wet, your cheeks a deep red.", parse);
			} else {
				Text.Add(" The slick moisture dripping from your [vag] mixes with his saliva, and soon his finger has slid deep inside of you, playing with your eager hole.", parse);
			}
			Text.NL();
			Text.Add("Finally, the lizard seems to call that enough and pushes you firmly toward the ground, still holding your wrists. He forces you forward until your [face] meets the ground, holding your wrists tightly together behind your back.", parse);

			Text.Flush();
			// RANDOM SCENE
			Gui.NextPrompt(() => {
				LizardsScenes.LossMaleVagVariations.call(enc);
			});
		}, 2.0, () => player.FirstVag());
		// IF MALE OR HERM
		scenes.AddEnc(() => {
			Text.Add("His eyes drift down between your legs, and his eyes narrow.", parse);
			Text.NL();

			LizardsScenes.LossMaleCockVariations.call(enc);
		}, 1.0, () => player.FirstCock());

		scenes.Get();
	}

	export function LossMaleVagVariations() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		Text.Clear();

		const enc = this;

		const member1 = party.members[1];

		let parse: any = {
			m1Name() { return enc.male.NameDesc(); },
			m1name() { return enc.male.nameDesc(); },
			m2name() { return enc.female.nameDesc(); },
			m1cock() { return enc.male.FirstCock().Short(); },
			m1cocks() { return enc.male.MultiCockDesc(); },
			m1hisher   : enc.male.hisher(),
			m1HeShe    : enc.male.HeShe(),
			m1heshe    : enc.male.heshe(),
			m2heshe    : enc.female.heshe(),
			m2HeShe    : enc.female.HeShe(),
			m2hisher   : enc.female.hisher(),
			p1name() { return member1.name; },
			p1himher() { return member1.himher(); },
			p1heshe() { return member1.heshe(); },
		};
		parse = player.ParserTags(parse);
		parse = Text.ParserPlural(parse, player.NumCocks() > 1);
		parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");

		const scenes = new EncounterTable();
		// ANAL
		scenes.AddEnc(() => {
			Text.Add("He leans over your back, and you feel his heavy pair of dense shafts flop down on you, one on either cheek. His hulking form looms over you, and you feel his muzzle slide up beside your ears. <i>“I wonder what your other hole feels like,”</i> he whispers... before you feel his hips draw back. In one swift roll of his hips, you feel a thick, slimy <i>presence</i> spear itself through your [anus], a matching one sliding up between your cheeks as the lizard's other [m1cock] squishes deep inside your body.", parse);
			Text.NL();

			player.FuckAnal(player.Butt(), enc.male.FirstCock(), 2);
			Sex.Anal(enc.male, player);

			player.AddLustFraction(-0.05);

			Text.Add("Spots burst in front of your eyes, and you find yourself clutching weakly at the air as your [anus] adjusts to his aching size. A deep, satisfied rumble sounds out from his throat, and his hand squeezes your wrists together firmly. He draws his hips back, the pulsing flesh of his cock surprisingly hotter than the rest of his body. You feel it slide slickly out of your sphincter, before he bucks his hips forward again. Once more you feel a warm, heavy pressure fill your [anus], and he grunts. Cool scales press up against your [butt], and he rocks himself against your body, using his groin to smear the lubricating slime that covered his shaft across your rear. His other [m1cock] slides against your [skin], smearing his slime across your [butt].", parse);
			Text.NL();
			Text.Add("Soon he picks up the pace, beginning to lose himself to the pleasure your body gives him... and before long, you find that his strangely ridged length is reaming spots you didn't quite know you had. The alien feel of his dicks both deep inside you and against your [butt] gradually gets less and less uncomfortable, and by the time you feel his [m1cock] throbbing powerfully inside of you, you find it hard to suppress a moan.", parse);
			if (Math.random() < 0.5) {
				Text.NL();
				Text.Add("Halfway through, he seems to change his mind about what he said. You feel him simply pull himself out from your stuffed [anus], only to swiftly roll his hips forward again. You feel his dual cocks push heavily against your own entrances.", parse);
				Text.NL();

				if (player.LustLevel() < 0.5) {
					Text.Add("Your eyes widen and you bite your lip, the reptile taking it further than you prayed. Trying to push it out of mind, you squeeze your eyes shut tight, right as you feel the pressure build.", parse);
				} else {
					Text.Add("Your eyes cross and you close them, feeling the heat of his spaded tips push roughly against both of your entrances at the same time. Weakly you mouth, <i>“Please...”</i>", parse);
					Text.NL();
					Text.Add("[m1Name] grunts out his ecstatic approval, and pushes all the harder.", parse);
				}
				Text.NL();
				Text.Add("Suddenly the force of his tips against your slicked entrances grows too firm, and you feel his heated [m1cocks] spear into both your [anus] and [vag] simultaneously. Your eyes open in surprise, but he shoves you harder into the dirt. He pulls his hips back, then <i>rams</i> both his shafts deeper into both of your holes. Stars burst in front of your eyes again, and you feel your now slick [vag] convulse around his [m1cock] as his other pumps into your [anus].", parse);
				Text.NL();

				player.FuckVag(player.FirstVag(), enc.male.FirstCock(), 2);
				Sex.Vaginal(enc.male, player);

				if (player.body.Gender() === Gender.herm) {
					Text.Add("The way that his twin dicks both slide sloppily into your body, each throb making them squeeze together inside of you quickly sends your own [cocks] pulsing to life. [m1Name] just smirks, letting out a grunt as he steadily begins to hump.", parse);
					Text.NL();
				}
				parse.cl3 = player.FirstVag().clitCock ? "" : Text.Parse(", ridges grinding against your [clit]", parse);
				Text.Add("In and out he thrusts them, steadily working you into your own frenzy, his second dick pulsating between your slick walls[cl3]. Just as you find yourself getting into it, beginning to move to his heavy rhythm and feeling his own fluids smearing around your [vag] walls, he yanks himself back, popping both of his dicks free from you. With another push, you feel his first slide back into your [anus], his second sliding between your cheeks again. His free hand pats your [butt]. <i>“Maybe when you win, you'll get to finish...”</i>", parse);

				player.AddLustFraction(0.2);
			}

			Text.Flush();
			Gui.NextPrompt(() => {
				Text.Clear();
				Text.Add("Finally, with a powerful thrust of his hips, his [m1cock] slams deep into your body. [m1Name] howls out, a bestial cry that makes a shudder run down your spine. He lets go of your hands, grabbing hold of your [butt], rocking his hips against you. You feel his shafts pulsing heavily, before thick, warm fluid starts to fill your [anus]. Thick gouts of it splatter over your back, making a mess of you both inside and out. Deeper and deeper his seed spills into your body, until he simply... pushes you off, jerking his first [m1cock] out from you and leaving you in the dirt. A few, last ropes splatter over your body as he picks up his weapon, before turning and walking away. Exhausted and quivering from your own cruelly teased arousal, you roll onto your back and consign yourself to rest.", parse);

				LizardsScenes.Impregnate(player, enc.male, PregnancyHandler.Slot.Butt);

				if (player.body.Gender() === Gender.herm) {
					Text.NL();
					Text.Add("You feel your [cocks] pulsing in the air, but after [m1name]'s heavy romp, you can't quite summon up the energy to do more than lie there, feeling your sexes throb in time to each other.", parse);
				}
				if (!party.Alone()) {
					Text.NL();
					Text.Add("Dimly, you can hear the other reptile[s] finishing with your companion[s2], leaving [group] in a similar state...", { group: party.Two() ? "both of you" : "your entire group", s: enc.third ? "s" : "", s2: party.Two() ? "" : "s" });
				}
				Text.Flush();
				Gui.NextPrompt();
			});

		});
		// VAG
		scenes.AddEnc(() => {
			Text.Add("Without wasting any time, he steps up behind you, his scaled feet padding against the ground. A soft growl sounds from his throat, and you feel not one, but both of his thick, pulsating dicks press against your [vag]. They feel slimy against your [vag], no doubt slick with the slime in the lizard's slit designed to keep his [m1cocks] ready for use. In a mildly pleasant turn of events, his flesh feels much warmer than his scales. At least it won't be an <i>entirely</i> unpleasant experience.", parse);
			Text.NL();
			Text.Add("He grinds against you for what feels like an hour, though your mind idly reasons it can't be more than a minute. Finally, he draws back... and with a single, well placed buck of his powerful hips, both of his dense, hot shafts sink halfway into your dripping [vag].", parse);
			Text.NL();

			player.AddLustFraction(0.1);

			const virgin = player.FirstVag().virgin;
			player.FuckVag(player.FirstVag(), enc.male.FirstCock(), 3);
			Sex.Vaginal(enc.male, player);

			if (player.FirstVag().capacity.Get() > 30) {
				Text.Add("It feels just right, the pair sliding easily into your [vag]. The lizard gives out a groan and grinds more steadily into you, forcing just an extra inch of each into your body. It leaves your loose, sloppy cunt clenching tightly and your body aching even more.", parse);
				player.AddLustFraction(0.05);
			} else {
				Text.Add("It hurts as he forces both of them in at once. You squeeze your eyes shut, feeling your [vag] stretched beyond its limits. They grind between your lips, forcing them ever wider. A deep heat floods your body as you realize how much looser you'll be if he goes on.", parse);
				player.AddLustFraction(-0.05);
			}
			Text.NL();
			Text.Add("He hunches over you, stopping with his lengths buried only halfway inside. One hand grips your head, tilting it back. You see [m1name] grinning delightedly down at you.", parse);
			Text.NL();

			if (virgin) {
				Text.Add("<i>“Looks like I get to be the first to break you in... You never forget your first,”</i> he mocks, grinding his [m1cock] against your clenching walls. His free hand gropes your [butt] roughly.", parse);
			} else if (player.FirstVag().capacity.Get() > 30) {
				Text.Add("<i>“Seems I'm not your first... Bit of a slut, aren't you? Don't bother denying it,”</i> he smirks, drawing his throbbing dicks a quarter of the way out, before pushing them slowly back in. You feel your walls stretch around him slickly.", parse);
			} else {
				Text.Add("<i>“So tight... I'll fix <b>that</b>.”</i>", parse);
			}
			Text.NL();
			parse.cl4 = player.FirstVag().clitCock ? Text.Parse(" Soft, fleshy ridges along his dicks rub against your [cocks]", parse) : Text.Parse(" Soft, fleshy ridges along his dicks bump against your [clit] in sequence", parse);
			Text.Add("Without another word, he <i>pushes</i> his [m1cocks] the rest of the way into your [vag].[cl4], sending electric tingles up your spine. Deeper and deeper his reptilian shaft sinks into your body, and by the time his hips meet yours, you can feel his every movement through the pair of rods deep in your quivering [vag].", parse);
			if (player.LustLevel() < 0.5) {
				Text.NL();
				Text.Add("You close your eyes, cheeks red. The way that his dual members pulse inside of you, each at the same time... The way that they twitch within you, grinding against each other and your walls, you can feel your own arousal building rapidly.", parse);
			}
			Text.Flush();

			Gui.NextPrompt(() => {
				Text.Clear();

				Text.Add("Drawing his groin back, [m1name] pulls his [m1cocks] slowly, achingly out of your cunt, each inch leaving you feeling cooler as his flesh slips out from yours. His hand tightens around your wrists, and he shoves the entirety of both of his pulsating, thick cocks into you, only to yank them back out with a fleshy squish that you can't help but blush at to hear coming from your own body. He quickly settles into roughly humping your slick passage, and the feeling of his alien lengths sliding through your [vag] makes it hard to concentrate. He smirks, and it takes you a moment to realize that it's because you're moaning softly.", parse);
				Text.NL();
				Text.Add("Finally his humps grow slower, more irregular.", parse);
				Text.NL();

				const scenes2 = new EncounterTable();
				scenes2.AddEnc(() => {
					Text.Add("He holds you steady and buries both of his [m1cock]s deep inside you, his teeth clenching tightly as his thick shafts seem to <i>pulse</i>. Your eyes go wide as he holds you there, impaled on his pulsating dicks. Helpless to stop it, you feel his sticky, gooey sperm pumping deep into your passage, squeezing past your cervix and deep into your womb. He grins toothily and gazes almost menacingly at you as the realization grips your mind. Yet even as his climax slowly tapers off, he doesn't stop railing you roughly in the dirt. His [m1cocks] slide wetly in and out of your slippery [vag], steadily pushing you toward your own edge. The pressure builds and builds inside of you, the pleasure growing almost unbearable.", parse);
					Text.NL();
					parse.cl5 = player.FirstVag().clitCock ? " loins" : Text.Parse(" [clit]", parse);
					parse.cl6 = player.FirstVag().clitCock ? Text.Parse(" [cocks]", parse) : Text.Parse(" [clit]", parse);
					Text.Add("Finally, the growing ache seems to build inside your[cl5], every ounce of your being focusing into a point. Your[cl6] feel[notS] like [itThey] grow[notS] so very hot, and spots burst in front of your eyes as his [m1cocks] pound you over the edge. You cry out up at him, his eyes boring into yours as you feel your [vag] convulse around his heavy, thick shafts. Your lips clench around him and you feel the pleasure swamp your vision as your legs give out from under you, leaving you propped up by his rock solid [m1cocks]. As your [vag] juices itself, he smirks, feeling your fluids make a mess of both your groins. He pulls out of your sloppy [vag], letting you slump to the ground. Picking up his weapon, he turns and walks away.", parse);
					Text.NL();

					LizardsScenes.Impregnate(player, enc.male, PregnancyHandler.Slot.Vag);

					player.AddLustFraction(-1);

					if (!party.Alone()) {
						Text.Add("As you lay there with your face flushed and your breathing heavy, still feeling the slimy spunk of [m1name] dripping from your abused [vag], you see [p1name] being held down by another one of the lizards. [m2HeShe] has [m2hisher] groin pressed to [p1name]'s mouth, and you can see [p1himher] looking up into the eyes of [m2name] blearily.", parse);
						if (party.Num() > 2) { Text.Add(" You can't see anyone else, though you can hear them...", parse); }
						Text.NL();
						if (player.FirstCock()) {
							Text.Add("You feel precum drooling from your [cocks], and try not to focus on the sensation too much.", parse);
						}
						Text.NL();
						Text.Add("You pass out watching [p1name] pleasure [m2name], feeling [m1name]'s seed settling in your womb.", parse);
					} else {
						Text.Add("You manage to pull your legs closed, but roll into the puddle you and [m1name] made.", parse);
						if (player.NumCocks() === 1) {
							Text.Add(" You let out a groan as a gob of precum trails up to the tip of your [cock], oozing down your length.", parse);
						} else if (player.NumCocks() > 1) {
							Text.Add("You let out a soft groan as gobs of precum trail up to the tip of your [cocks], oozing down the length of each.", parse);
						}
						Text.Add(" Blushing shamefully, you pass out to the sensations of his seed settling in your womb.", parse);
					}
					Text.Flush();
					player.AddLustFraction(0.05);
					Gui.NextPrompt();
				});
				scenes2.AddEnc(() => {
					Text.Add("He holds you in place, before letting out a hiss. <i>“I don't want my line tainted by a weakling like you...”</i>", parse);
					Text.NL();
					Text.Add("He slides his [m1cocks] out from your clenching, quivering cunt, dragging his tips across your lips. He snorts, before thrusting his hips forward, his [m1cocks] sliding wetly between your cheeks, aimed over your back.", parse);
					Text.NL();
					Text.Add("Suddenly you feel thick, slimy fluid splattering over your back. Some of it hits your hands, and you think you can feel some dripping into your hair. An almost alarming amount of cum begins to drip down your back, stopping after what feels like far too long to be normal. With a satisfied hiss, the reptile releases your hands, pushing you into the ground. He snorts, picking up his weapon, turning to go. <i>“Get a little stronger and next time I might just put you to real use,”</i> he smirks.", parse);
					Text.NL();

					if (party.Alone()) {
						Text.Add("You manage to spot [p1name] slumped in a similar heap not too far away. [p1heshe] looks unconscious. You let out a groan, succumbing to a similar state...", parse);
					} else {
						Text.Add("You shudder, feeling his slime dripping off your body. You close your eyes, and sleep quickly claims you.", parse);
					}
					Text.Flush();
					player.AddLustFraction(0.15);
					Gui.NextPrompt();
				});
				scenes2.Get();
			});
		});

		scenes.Get();
	}

	export function LossMaleCockVariations() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const enc = this;

		const member1 = party.members[1];

		let parse: any = {
			MalesHerms : player.FirstVag() ? "Herms" : "Males",
			playerRace() { return player.body.RaceStr(); },
			m1Name() { return enc.male.NameDesc(); },
			m1name() { return enc.male.nameDesc(); },
			m1hisher() { return enc.male.hisher(); },
			m1HeShe() { return enc.male.HeShe(); },
			m1heshe() { return enc.male.heshe(); },
			m1cock() { return enc.male.FirstCock().Short(); },
			m1cocks() { return enc.male.MultiCockDesc(); },
			m1anus() { return enc.male.Butt().AnalShort(); },
			p1name() { return member1.name; },
			p1hisher() { return member1.hisher(); },
			p1armor() { return member1.ArmorDesc(); },
		};
		parse = player.ParserTags(parse);

		const scenes = new EncounterTable();
		// DISS
		scenes.AddEnc(() => {
			if (player.FirstVag()) {
				Text.Add("His eyes narrow uncertainly, and you hear him <i>sniff</i> a few times. Abruptly he shoves one hand down under your male attributes. You feel a finger drag across the entrance to your [vag], and he snorts. <i>“A real shame you're... spoiled,”</i> he mutters, dropping you to the ground, picking up his weapon and walking away.", parse);
			} else {
				Text.Add("His eyes seem to darken, and his face falls. He snorts, and drops you to the ground. <i>“Figures, not even a cunt worth fucking,”</i> he growls, picking up his weapon, walking away.", parse);
			}
			Text.NL();
			Text.Add("You're not sure whether you're glad to have gotten away unscathed, or offended. Out of nowhere the butt of his weapon collides with your head, and you black out entirely.", parse);
			Text.Flush();
			player.AddLustFraction(-0.05);
			Gui.NextPrompt();
		});
		// ORAL
		scenes.AddEnc(() => {
			Text.Add("He snorts, looking at you. [m1Name] glowers at you, his eyes piercing into yours.", parse);
			if (!player.FirstVag()) {
				Text.Add(" <i>“Guess you don't have a cunt, but a mouth's a mouth.”</i>", parse);
			}
			Text.NL();
			Text.Add("He drops you to the ground. Before you can so much as push yourself into a sitting position, one scaled hand slides under your arm, the other coming to the back of your [hair]. A slick, hot presence pushes against your lips and pops them open, sliding rapidly through at the same time as a second, throbbing appendage slides against your face. The sight of the reptile's groin fills your vision as one of his [m1cock] fills your startled face. <i>“Bite down and you'll <b>regret</b> it,”</i> he warns. You gulp around his invading flesh, looking up at the menacing, armored creature staring down at you. He rumbles in approval as your mouth constricts around his [m1cock].", parse);
			Text.NL();
			Text.Add("You can feel it on your tongue, sliding between your lips. His other grinds against your [face] slickly, smearing slime over it. The hand on the back of your head keeps you from pulling off of him, and the reptile's dangerous form towering above you reminds you exactly why you should be doing what he says. He holds you there, one [m1cock] resting between your lips, pulsing softly on your tongue. It tastes tangy and slightly earthy, the exotic flavor smearing over your taste buds. Ridges cover the side of his heavy meat, and he wastes no time in forcing each and every one past your lips.", parse);
			Text.NL();
			Text.Add("Before long you feel his tip mash up against the back of your throat, and you gag around it. His other tip bumps against one of your [ears]. He chuckles, holding you in place for a second. You gulp heavily around his [m1cock], your nose pressed almost to his armored groin. A heady musk fills each of your breaths. Thankfully, before it gets too bad, he rolls his hips back, looking down at you.", parse);
			Text.NL();

			const scenes2 = new EncounterTable();
			scenes2.AddEnc(() => {
				if (player.body.HasLongSnout()) {
					Text.Add("<i>“Just the right size for my dick. You got your muzzle just for this, didn't you?”</i>", parse);
				} else {
					Text.Add("<i>“What a pretty little mouth you have... Shame it's not a snout, I might be able to fit it all in, then.”</i>", parse);
				}
			}, 3.0);
			scenes2.AddEnc(() => {
				Text.Add("<i>“And here I thought all [playerRace]s were bad at sucking cock.”</i>", parse);
			}, 4.0);
			scenes2.AddEnc(() => {
				Text.Add("<i>“Such a pushover. Hope you like the taste, you're going to get it every time you run into my kind.”</i>", parse);
			}, 3.0);
			scenes2.Get();

			Text.Add(" With a smirk, he pushes his hips forward, burying his [m1cock] into your face, letting every inch of it he can fit press into your mouth. Red faced, you close your eyes. You can't push his thick rod out from your lips, and you realize that doing poorly will just make him go even harder. What should you do?", parse);
			Text.Flush();
			// [Give in][Resist]
			const options: IChoice[] = [];
			options.push({ nameStr : "Give in",
				func() {
					player.AddLustFraction(0.15);
					Text.Clear();
					Text.Add("With a heavy swallow that seems to leave his slime trickling down your throat, you resign yourself to pleasuring the reptile. You open your eyes, taking a deep breath as his thick rod pulls halfway out. Gazing up at him, you see him grinning toothily down at you as your tongue begins to lap at his tip. <i>“That's better. Get sucking,”</i> he growls. You drop your eyes shamefully, giving a mumble of assent.", parse);
					Text.NL();
					Text.Add("You push your face forward freely, taking his [m1cock] deeper into your mouth. He groans softly as you willingly get into the act. He pushes his hips forward, and you meet him halfway. His tip bumps against the back of your throat, and you carefully, gently angle your head to give him the best angle. He seems to understand exactly what you're doing, and takes full advantage of it. With a roll of his hips, the last couple of inches sink into your mouth, your lips meeting his groin. At the same time, you feel his slimy, fat [m1cock] push into your throat. Your muscles protest, but he doesn't seem to care.", parse);
					Text.NL();

					player.FuckOral(player.Mouth(), enc.male.FirstCock(), 2);
					Sex.Blowjob(enc.male, player);

					Text.Add("The side of your face feels wet with his slick fluids. You swallow reflexively, and it elicits a soft moan from him. The noise sends a thrill through your body, abashed as it is. He steps forward, straddling your face and beginning to slowly, steadily hump your mouth. You kneel there, letting the reptile abuse your mouth freely, his scaled groin taking up your entire vision.", parse);
					Text.NL();

					if (player.FirstVag()) {
						Text.Add("You let your hand trail down to your groin, feeling tempted to join in the reptile's sensations... but the way that his shaft fills your face so entirely, its partner smearing the scaled creature's fluids over your [face] leaves you feeling an itch for something... else. Your hand trails lower, between your legs. Your fingers brush the wet folds of your [vag], beginning to stroke across them, one finger just beginning to plumb your aching depths.", parse);
					} else if (player.NumCocks() > 1) {
						Text.Add("Your hand trails down to your groin, where you let it find your favorite dick. Slowly you squeeze it, blushing yet deeper as you feel precum start to drip from multiple tips.", parse);
					} else {
						Text.Add("You let your hand trail down to your [cock], feeling yourself harden.", parse);
					}
					Text.NL();
					Text.Add("Despite the position, the way his shaft slides over your tongue feels sinfully good. Before long, you find yourself pumping away at yourself as he pistons his heavy meat in and out of your maw. Finally, he grips your head tightly in both hands, and <i>rams</i> your face onto his crotch, his legs spread and tail arched in bliss. You feel his [m1cock] spasm heavily, and thick bulges run down his shaft... emptying right into your throat. You can't even taste it, though you realize you want to. You just feel his potent cum flooding your throat, sliding down to your belly, its partner spraying sticky, oddly thick fluids across your [face]. <i>“Drink up,”</i> the lizard hisses, holding you there. ", parse);
					if (player.FirstVag()) {
						Text.Add("You do so obediently, still pumping at yourself eagerly.", parse);
					} else {
						Text.Add("You do so obediently, still fingering yourself dazedly.", parse);
					}
					Text.NL();
					Text.Add("Finally, he lets go... and draws his [m1cocks] back. The tip of one pops from your lips, and he smirks down at you. <i>“Next time, skip the fight, I love a good cocksucker,”</i> he mutters. You drop to the ground, feeling mixed fluids dripping from your lips and face. You lick them up, trying to taste him. Dropping to the ground, you keep working at yourself eagerly. He picks up his weapon and turns, gesturing to the rest of his party.", parse);
					Text.NL();
					if (!party.Alone()) {
						Text.Add("The lizards leave you and your companion[s], [group] looking smugly satisfied. You doubt that you were the only one to be used...", {s: party.Two() ? "" : "s", group: enc.third ? "all" : "both"});
						Text.NL();
					}
					Text.Add("They follow him off. Just as you find yourself reaching climax, a sharp blow to your head sends you into blackness. The last thought you have before unconsciousness claims you is how badly you need to get off.", parse);
					Text.Flush();

					player.AddLustFraction(0.25);
					Gui.NextPrompt();
				}, enabled : true,
				tooltip : "There's no point fighting with his cock already halfway down your throat...",
			});
			options.push({ nameStr : "Resist",
				func() {
					player.AddLustFraction(-0.05);
					Text.Clear();
					Text.Add("You open your eyes, glaring up at him. The reptile looks down at you with a glare of his own. He snorts again and grips your head, thrusting into your mouth. You find your throat beginning to ache at the rough treatment. He goes hard and fast, and his spaded tip digs into the muscles of your throat painfully. Even so, you don't give in. Your body is your own, and if he wants pleasure from it, then he'll have to fight for every drop.", parse);
					Text.NL();
					Text.Add("[m1Name] holds your face steady for a while more, his slimy, dripping dick grinding into your tongue and across your [face]. The taste is strange, and you can't get rid of it. It's hard to avoid gagging. Suddenly, he grips your cheeks tighter still, thrusting his hips forward.", parse);
					Text.NL();
					Text.Add("His [m1cock] rams against your throat. He smirks down at you, holding the pressure steady. Your eyes widen as you realize... he isn't pulling back! You <i>writhe</i> on his dick, but it's no use. Your throat stretches around his thick tip, and your mouth slides further down his shaft. Your lips meet his scaled groin, and he forces you to lewdly kiss it, rubbing it against your mouth. You feel his [m1cock] throb again, and your eyes cross.", parse);
					Text.NL();
					Text.Add("H-he isn't. He can't be...");
					Text.NL();
					Text.Add("You swallow shamefully as you feel the first thick pulse of slime travel down his shaft, spilling into your throat. Thick, sticky ooze pumps down your gullet as he holds you there, and you can't even resist swallowing the creature's vile seed. You can feel your belly <i>filling</i> with it, even as the reptile's other shaft sends equally hot, viscous slime splattering over your face.", parse);
					Text.NL();

					player.FuckOral(player.Mouth(), enc.male.FirstCock(), 1);
					Sex.Blowjob(enc.male, player);

					const scenes2 = new EncounterTable();
					scenes2.AddEnc(() => {
						Text.Add("Right near the end though, he jerks his hips back. Your sore throat contracts, leaving you feeling normal again. Unfortunately [m1name] is still in the throes of orgasm, and with a shift of his hips you find <i>both</i> of his fat tips pressed between your lips. You feel his sticky slime pumping across your tongue, filling your cheeks quickly. It tastes bitter and salty, and strangely thick, as though there isn't much water in it. The thick, custard-like slime fills your mouth until you're forced to swallow it just to breathe. With a sickening gulp, you feel the sludge trickling down your throat. He smirks down at you, popping his tips free as you swallow, letting the last few ropes paint your face.", parse);
						Text.NL();
						Text.Add("He pushes you to the ground, and picks up his weapon. You gulp down sweet air, looking around.", parse);
						Text.NL();
						if (!party.Alone()) {
							Text.Add("You can see that you're not the only one to have been humiliated. [p1name] has [p1hisher] [p1armor] splattered with a fluid you don't care to think about.", parse);
							Text.NL();
						}
						Text.Add("[m1Name] looks down at you. He snorts, before swinging the butt of his weapon toward you one more time. You try to dodge it, but still feel too dazed to.", parse);
						Text.NL();
						Text.Add("The blunt end strikes your temple, and you black out.", parse);
					});
					scenes2.AddEnc(() => {
						Text.Add("He holds you there, each rope pumping down your throat. You look up at him, waiting for him to pull out... Yet even as his climax ends, he just holds you there. You begin to writhe, to squirm, trying to push him off. He easily overpowers you, holding you there. You gasp for air, but his [m1cock] plugs your throat. You find yourself feeling faint. He smirks down at you. Dimly you hear him say, <i>“Maybe next time you'll learn to suck better.”</i>", parse);
						Text.NL();
						Text.Add("You pass out...", parse);

						player.AddLustFraction(-0.1);
					});
					scenes2.Get();
					Text.Flush();
					Gui.NextPrompt();
				}, enabled : true,
				tooltip : "You're not giving this monster pleasure without another fight!",
			});
			Gui.SetButtonsFromList(options);
		});
		// ANAL FUCK
		scenes.AddEnc(() => {
			Text.Add("His eyes light up as he sees your [cock]. He grins a toothy smile. <i>“Well, looks like my lucky day. Been too many females around lately, you have no idea how much I've been wanting a chance like this.”</i>", parse);
			Text.NL();
			Text.Add("You don't quite know what he means, exactly, but the guesses you can make leave a sinking feeling in your stomach. He pushes you to the ground.", parse);
			Text.NL();

			const scenes2 = new EncounterTable();
			// 25%, fuck him
			scenes2.AddEnc(() => {
				Text.Add("His claws push your back into the ground, and his nostrils flare. His feet step on your [feet], splaying your legs to either side. He comes to a crouch between your legs, looking down at you with a hungry glint in his eyes.", parse);
				Text.NL();
				Text.Add("<i>“What..?”</i> you ask, letting out a quivering breath. He grins.", parse);
				Text.NL();
				Text.Add("<i>“Shut up. Today's your lucky day. Say another word though, and I'll fuck your ass till you pass out. I don't <b>need</b> this.”</i>", parse);
				Text.NL();
				Text.Add("You nod quickly, quieting down. You watch on in a mixture of fear and trepidation as [m1name] focuses on your [cock]. His hungry eyes watch your [cock] as it rests there. One scaled hand comes up to it, and you feel cool fingers wrap around your shaft, giving it a few tentative squeezes.", parse);
				Text.NL();
				if (player.HasBalls()) {
					Text.Add("He smirks, his fingers trailing down, coming to cup your [balls]. You feel him give them a series of slow, sensual squeezes, tugging them slightly. <i>“So warm...”</i>", parse);
					Text.NL();
				}
				Text.Add("He draws his hand back, before licking his lips. Almost in disbelief, you watch as his head lowers down. His muzzle bumps against your [cock], and you feel a warm, wet tongue flicker out, brushing against your tip. His lips part, and he draws your shaft into his mouth. A deep warmth envelops it, and he quickly begins to slurp and suckle on you. Before long, you find yourself growing helplessly hard. You don't mind too much, though.", parse);
				Text.NL();

				player.AddLustFraction(0.15);

				if (!party.Alone()) {
					Text.Add("A quick glance around at your team shows that you have by far the best fate.", parse);
					Text.NL();
				}
				Text.Add("When you find yourself at full attention, [m1name] pulls himself off, sniffing your [cock] lightly, as though relishing the scent. Without a word, he slides across your body, moving toward your chest.", parse);
				Text.NL();
				Text.Add("He stops halfway, just above your groin. He grins at you. You feel a scaled hand grip your shaft, angling it upward, and you can see his [m1anus] hovering just above your [cock]. <i>“Not a word.”</i>", parse);
				Text.NL();
				Text.Add("You clamp your mouth shut, watching in trepidation as he positions himself. Satisfied, he closes his slitted eyes, before simply... dropping. You feel your [cock] meet his cool pucker, before it simply parts. Gravity does the rest, and his [m1anus] quickly meets your groin. You can't hold back a sharp gasp of breath as you feel your shaft sink into his surprisingly warm confines. His tail rests between your legs, and he holds himself there with your shaft embedded inside his reptilian body.", parse);
				Text.NL();

				const virgin = enc.male.Butt().virgin;
				player.Fuck(player.FirstCock(), virgin ? 5 : 3);
				enc.male.FuckAnal(enc.male.Butt(), player.FirstCock());
				Sex.Anal(player, enc.male);

				if (virgin) {
					Text.Add("<i>“Ahhh...”</i> he hisses, slightly pained. <i>“That it would feel so good, I had no idea...”</i>", parse);
				} else if (player.FirstCock().Size() > 75) {
					Text.Add("<i>“Oh, just... right,”</i> he hisses.", parse);
				} else {
					Text.Add("<i>“This all you got?”</i> he shakes his head, seeming almost disappointed.", parse);
				}
				Text.NL();
				Text.Add("Slowly he builds up a pace, bouncing up and down on your [cock]. His hand presses against your belly as he rocks himself on your aching length, working you quickly to the edge. His own [m1cocks] bob in front of you almost hypnotically, and between the lewd motion and the pleasure of having his [m1anus] squeezing around your shaft you quickly find yourself moving with him, aching for release.", parse);
				Text.NL();
				Text.Add("It comes quickly, and in just a few short minutes, you feel the bubbling pressure building to a crescendo inside you.", parse);
				if (player.HasBalls()) {
					Text.Add(" Your [balls] tighten, and you feel [m1name] grip your hips tightly.", parse);
				}
				Text.NL();
				Text.Add("[m1Name] leans forward, and you feel both of his [m1cock] push against your stomach. Your every muscle tenses, and you feel yourself tumbling over the edge as your spunk surges through your [cock]. You feel spurt after spurt flood [m1name]'s body, and the reptile groans, his eyes fluttering open. <i>“Yessss...”</i> he hisses, still rocking atop you.", parse);
				Text.Flush();

				Gui.NextPrompt(() => {
					Text.Clear();
					player.AddLustFraction(-1);

					Text.Add("Finally your climax passes, and you grin at him. He smirks at you, still riding. It takes you a moment to realize that he isn't finished... and even though you feel yourself beginning to soften, he keeps up the pace. Before long, you find yourself helplessly hardening under the stimulation. Your hypersensitive [cock] protests, but he doesn't seem to care.", parse);
					Text.NL();
					Text.Add("He holds you there as you writhe, trying to pull away. <i>“Uh-uh. I won, you're <b>mine</b>, and <b>I</b> say when you stop cumming,”</i> he growls. You can only whimper as he works your body to exhaustion...", parse);
					Text.NL();
					parse.climaxNr = Math.floor(player.stamina.Get() / 5);
					if (parse.climaxNr < 4) { parse.climaxNr = 4; }
					if (parse.climaxNr > 21) { parse.climaxNr = 21; }
					Text.Add("After your [climaxNr]th climax, you find yourself growing faint... and black out, still with [m1name] milking your [cock], even though you're only shooting blanks now...", parse);
					Text.Flush();
					Gui.NextPrompt();
				});
			}, 1.0, () => player.FirstCock());
			// 75%, get fucked
			scenes2.AddEnc(() => {
				Text.Add("His claws find your [butt], and he turns you around onto your stomach. You feel him slide up behind you. <i>“Mmh...”</i> he groans softly.", parse);
				Text.NL();
				Text.Add("He leans over your back, and you feel his heavy [m1cocks] flop down between your pert cheeks. His hulking form looms over you, and you feel his muzzle slide up beside your ear. <i>“[MalesHerms] feel so much better than females,”</i> he whispers in your ear. You feel his hips draw back. In one swift roll of his hips, you feel a thick, slimy <i>presence</i> spear itself through your [anus], the [m1cock] squishing up deep inside your body.", parse);
				Text.NL();

				player.FuckAnal(player.Butt(), enc.male.FirstCock(), 3);
				Sex.Anal(enc.male, player);

				Text.Add("Spots burst in front of your eyes, and you find yourself clutching weakly at the air as your [anus] adjusts to his aching size. A deep, satisfied rumble sounds from his throat, and his hands squeeze your rump cheeks, kneading them like dough. He draws his hips back, the pulsing flesh of his cock surprisingly hotter than the rest of his body. You feel it slide slickly out of your sphincter, before he bucks his hips forward again. Once more you feel a warm, heavy pressure fill your [anus], and he grunts. <i>“Oh yeah... You feel so good... I'm gonna do this <b>every</b> time...”</i>", parse);
				Text.NL();
				Text.Add("Cool scales press up against your [butt], and he rocks himself against your body, using his groin to smear the lubricating slime that covered his shaft across your rear. Soon he picks up the pace, beginning to lose himself to the pleasure your body gives him... and before long, you find that his oddly ridged length is battering at your prostate, sending your own [cock] surging to life. The alien feel of his dick deep inside you gradually gets less and less painful, and by the time you feel his [m1cock] throbbing powerfully inside of you, you find it hard to suppress a moan. <i>“That's right, you love this, little slut...”</i>", parse);
				Text.NL();

				if (Math.random() < 0.6) {
					Text.Add("Halfway through, his right hand leaves your [butt], sliding down between your legs. His cool hand wraps around your [cock], and he begins to pump wildly, seemingly not caring how rough he goes. Your eyes snap wide open, and you find yourself unable to keep from clenching around his thick [m1cock] as he gropes your hanging shaft.", parse);
					Text.NL();
					Text.Add("That seems to be what he wanted, though, and as your wildly squeezing [anus] clenches around the ridges of his [m1cock], he lets go again. His free hand pats your [butt]. <i>“Maybe when you win, you'll get to finish...”</i>", parse);
					Text.NL();

					player.AddLustFraction(0.1);
				}

				Text.Add("Finally, with a powerful thrust of his hips, his [m1cock] slams deep into your body. [m1Name] howls out, a bestial cry that makes a shudder run down your spine. He roughly squeezes your [butt], rocking his hips against you. You feel his two shafts pulsing heavily, before thick, warm fluid starts to coat your back and fill your [anus]. Deeper and deeper his seed spills into your body, until he simply... pushes you off, jerking his [m1cock] out from you and leaving you in the dirt. A few, last ropes splatter over your body as he picks up his weapon, before turning and walking away. Exhausted and quivering from your cruelly teased arousal, you roll onto your back and consign yourself to rest.", parse);
				Text.NL();

				LizardsScenes.Impregnate(player, enc.male, PregnancyHandler.Slot.Butt);

				if (!party.Alone()) {
					Text.Add("Dimly, you can hear the other reptile[s] finishing with [party], leaving [all] of you in a similar state...", { s: enc.third ? "s" : "", party: party.Two() ? member1.name : "your group", all: party.Two() ? "both" : "all" });
				}
				player.AddLustFraction(0.2);
				Text.Flush();
				Gui.NextPrompt();
			}, 3.0);
			scenes2.Get();
		});
		scenes.Get();
	}

	export function LossFemale() {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		Text.Clear();

		const enc = this;
		const third: Lizard = enc.third;
		const member1: Entity = party.members[1];
		const lizard: Lizard = enc.female;

		let parse: any = {
			playerName   : player.name,
			race() { return player.body.RaceStr(); },
			boygirl() { return player.body.femininity.Get() > 0 ? "girl" : "boy"; },
			m1Name() { return enc.female.NameDesc(); },
			m1name() { return enc.female.nameDesc(); },
			m1hisher() { return enc.female.hisher(); },
			m1HeShe() { return enc.female.HeShe(); },
			m1heshe() { return enc.female.heshe(); },
			m1breasts() { return enc.female.FirstBreastRow().Short(); },
			m1vag() { return enc.female.FirstVag().Short(); },
			m1clit() { return enc.female.FirstVag().ClitShort(); },
			p1name() { return member1.name; },
			p1heshe() { return member1.heshe(); },
			p1himher() { return member1.himher(); },
		};
		parse = player.ParserTags(parse);

		Text.Add("The reptile holds you steady, and you glance up and down the creature's body. The [m1breasts] she has almost hypnotize you while her hair falls silkily as she moves, and you swallow, unsure of what she might do with you.", parse);
		Text.NL();
		if (player.Armor()) {
			Text.Add("She looks you over before reaching out with one clawed hand. She makes short work of your [armor]. ", parse);
		}
		Text.Add("With a smirk, she pushes you to the ground.", parse);
		Text.NL();

		const scenes = new EncounterTable();
		// ORAL RAPE
		scenes.AddEnc(() => {
			Text.Add("You grunt as your back hits the ground. When you look up, you see the reptile standing over you, her scant underwear already gone. She smirks down at you, your vision taken up mostly by her yellow-green scaled groin. She crouches down, straddling your face. You blush, trying to turn your head away, but her thighs close around your [face].", parse);
			Text.NL();
			Text.Add("<i>“Uh-uh. You're going to be a good [boygirl],”</i> she hisses. You find your nose pressed right against her groin. This close, you can see the vague cleft where her [m1vag] must be, her physiology keeping it hidden and protected from the desert sand when not in use... something she seems very keen to remedy. <i>“Get to work...”</i>", parse);
			Text.NL();
			Text.Add("You swallow heavily, and look up at her. She gazes down at you with a mixture of smugness and threatening expectancy. The scent of her fills your nose, and you find it hard to say no.", parse);
			Text.NL();
			Text.Add("The heady, soft aroma floods your [face], and you quiver softly at it. ", parse);
			if (player.NumAttributes(Race.Lizard) > 2) {
				Text.Add("Her pheromones have a potent effect on your body, and you feel heat building between your own legs. She gazes down at you knowingly, one hand lowering to trace across your brow. <i>“That's right, just breathe deeply, let it take hold...”</i>", parse);
				Text.NL();
				Text.Add("You blush, realizing you're falling under the spell of [m1name].", parse);
			} else {
				Text.Add("Her scent is exotic and strange, almost like a foreign spice. You find yourself entranced by it, though it doesn't have a strong effect on your body. You swallow heavily, and slowly bring your [face] toward her scaled slit.", parse);
			}
			Text.NL();
			Text.Add("You find your tongue slipping out from between your lips, shakily bringing it to her [m1vag], brushing gently against the cool folds there. She lets out a low, rumbling croon and presses herself forward, knees on either side of your head. Her black hair tumbles forward around her yellow-green muzzle, and she presses her scaled cunt right to your lips.", parse);
			Text.NL();
			Text.Add("You feel yourself licking softly at her slit, your [tongue] sliding up against her, tasting her outer folds. Sinking deeper, you press your tongue harder against her body, and feel it slip between her moistening folds. As your wet, slick tongue slithers into her [m1vag], [m1name] gives a soft moan and grinds her pussy into your mouth. Encouraged by her response, you let your tongue sink deeper into her, feeling her walls contract and squeeze down around you.", parse);

			Sex.Cunnilingus(player, enc.female);
			player.FuckOral(player.Mouth(), enc.female.FirstVag(), 2);
			Text.Flush();

			Gui.NextPrompt(() => {
				Text.Clear();

				Text.Add("You press your [face] against her heated [m1vag] as her legs slide closed around your head.", parse);
				Text.NL();

				const horns = player.HasHorns();
				if (horns) {
					parse.hornDesc = horns.Long();
					Text.Add("She reaches down and grabs onto your [hornDesc], holding on tightly and pressing you harder against her [m1vag], a soft, breathy groan escaping her snout. Her eyes flutter shut, and you feel your [face] grow warm from her now wet pussy. Holding onto you by your horns, she uses your mouth almost like a personal toy, her lips clenching down around your tongue.", parse);
					Text.NL();
					player.AddLustFraction(0.1);
				}

				if (player.LustLevel() > 0.6) {
					Text.Add("You find it hard to contain yourself now, and you start to push deeper into her. The sensations, the scents, the achingly delectable feel of her slippery tunnel squeezing around your tongue, it's all too much. You give in to pleasuring her, finding yourself growing quickly aroused as well...", parse);
					Text.NL();
					player.AddLustFraction(0.05);
				}
				Text.Add("You flicker your tongue through her lips and begin to tongue-fuck her slick, warm vent. She gasps in surprise, and presses harder against you. You take a deep, long breath of her scents and flick your tongue upward, trying to brush against her clit.", parse);
				Text.NL();

				if (player.dexterity.Get() > 25) {
					Text.Add("You easily curl your tongue out from your lips, letting it slither up to [m1name]'s bud of flesh, flicking your heated muscle against it. She groans out in delight. <i>“Oh, yesssss,”</i> she whispers, her words slipping into a long hiss of pleasure. Her slick walls clamp around your tongue, and you soon abandon her [m1clit] to plunge yourself back into her sensual, heated passage...", parse);
				} else {
					Text.Add("Unfortunately, you're just not dextrous enough to reach... Grunting in frustration, you let your tongue slurp back into her slimy passage, tonguing her ever more deeply.", parse);
				}
				Text.NL();

				if (player.body.HasLongSnout()) {
					Text.Add("Finally, you can hear her breathing growing erratic, and know she must be close. You lap at her trickling juices, slurping on her wet cunt. Her legs spasm and clench around your head, and she holds your head tightly in her hands. Suddenly, her walls squeeze tightly around you, and she lets out a long, aching moan.", parse);
					Text.NL();
					Text.Add("Before you can do anything more, she <i>rams</i> your head forward, pushing your muzzle not against her dripping cunt, but <i>into</i> it. Your eyes snap open in surprise, but it's too late. Your nose fills with the thick, heady scent of her sex, and your tongue is forced deeper into her body.", parse);
					Text.NL();
					Text.Add("[m1Name] moans loudly, her slick walls squeezing and contracting around your snout, and you find your air supply rapidly runs out. Gulping her scent and her wet juices, you try to pleasure her now not just out of lust, but the need for her to let go and grant you air.", parse);
					Text.NL();
					Text.Add("Deeper and deeper you slurp with your tongue, grinding against her walls as she roughly humps your entire muzzle. Riding your snout, you feel her warm, slick walls squeeze rhythmically around you. You push your face forward, and feel her cunt suddenly clench down achingly tight. <i>“You f-feel so... so g-good... insiiiiiide!”</i> she cries, her head tilting back. Her walls spasm powerfully around your snout, rippling and squeezing you tightly.", parse);
					Text.NL();
					Text.Add("Suddenly you feel a wet gush of fluids hit your muzzle, filling your mouth and squirting out onto your face. You force your eyes shut as [m1name] squeals in delight, her quivering cunt clamping around you. Her slick, slightly sweet fluids flooding your muzzle, you gulp them down to clear your airway.", parse);
					Text.NL();
					Text.Add("For what seems like minutes she orgasms, gushes of her slippery juices coating your face and throat. Finally, she seems to calm down... and simply pulls herself off. You gasp for air, your every breath laced with her scents.", parse);
					player.AddLustFraction(0.05);
				} else {
					Text.Add("She grips your head tightly, grinding her pussy up and down your lips. [m1Name] moans eagerly, her eyes fluttering open and shut as you eagerly lick at her dripping cunt. Her tail flickers over your body, and you feel it brush between your legs.", parse);
					Text.NL();
					Text.Add("Spurred on by her touches, you press your tongue deeper into her, lapping and slurping at her entrance. She moans softly, humping against your face slowly. <i>“Keep it up and I'll let you taste the waters of the desert,”</i> she whispers. You blush and inhale her scent again.", parse);
					Text.NL();
					Text.Add("On and on you slurp at her, your tongue running up and down her warm, moist pussy lips, her hips moving against you. You reach up and hold softly onto her, steadying her motions. It seems to drive her on even further, and soon the two of you are grinding away there on the sand...", parse);
					Text.NL();
					Text.Add("Finally, her breaths begin to come less and less regularly. Her [m1breasts] heave and her face flushes a deep red. Suddenly her [m1vag] clamps down around your tongue, and she <i>squeals</i> out as a wet torrent of reptilian juices pours over your face. You quiver, swallowing every drop that floods your mouth, as the rest mats your [hair] and pools behind your head.", parse);
					Text.NL();
					Text.Add("Slowing down, she shudders in her afterglow and then gradually stands. She gazes down at you, panting heavily.", parse);
				}
				Text.NL();

				Text.Add("She moans softly, her cunt dripping onto your face still. You look away, and she smirks down at you through red cheeks.", parse);
				Text.NL();
				parse.s = third ? "s" : "";
				Text.Add("<i>“Not... oh... bad,”</i> she pants. She collects her things - and some of your money - and then quickly heads off toward her companion[s].", parse);

				const coin = Math.min(Math.floor(5 + Math.random() * 20), party.coin);
				party.coin -= coin;
				Text.NL();
				if (coin > 0) {
					parse.coin = Text.NumToText(coin);
					parse.s = coin > 1 ? "s" : "";
					Text.Add("<b>She takes [coin] coin[s] from you!</b>", parse);
				} else {
					Text.Add("<b>You didn't have any coins for her to take!</b>", parse);
				}
				Text.Flush();
				player.AddLustFraction(0.3);
				Gui.NextPrompt();
			});
		}, 1.0);
		// GENDER SPECIFIC SCENES (COCK)
		scenes.AddEnc(() => {
			Text.Add("Finding yourself flat on your back, she steps over you, reaching down and dropping her scant clothing. ", parse);
			if (player.LustLevel() > 0.5) {
				Text.Add("You blush, your [cocks] already hard from her coy behavior, and she smirks sultrily down at you. Right where she wants you, you can do little but look down as she slides over your body, straddling your hips.", parse);
			} else {
				Text.Add("You look away, trying not to give her what she wants. But [m1name] doesn't seem to be taking 'no' for an answer, and slides across your body, straddling your hips.", parse);
			}
			Text.NL();

			if (player.FirstBreastRow().size.Get() >= 3) {
				Text.Add("Her hand presses to your [breasts], rubbing them slowly, sending delightful shivers through your body that feel more than a little shameful. At about the same time as she toys with your mounds, fingers tweaking and caressing your nipples, she lowers herself further...", parse);
			} else {
				Text.Add("Her hand presses to your chest, rubbing it slowly as she lowers herself down further...", parse);
			}
			Text.NL();
			Text.Add("You feel her [m1vag] press against your ", parse);
			if (player.NumCocks() >= 3) {
				Text.Add("numerous, half-hard dicks, grinding the middle one along her folds.", parse);
			} else if (player.NumCocks() === 2) {
				Text.Add("pair of thick shafts, her eyes lighting up in delight at the similarity to her own kinds' attributes. Her other hand slides down, and you feel her cool grip surround your twinned members. She presses them right against her [m1vag], which seems suddenly more moist...", parse);
	} else {
				Text.Add("heavy [cock], letting out a coo of delight as it pushes against her entrance.", parse);
	}
			Text.NL();

			player.AddLustFraction(0.25);

			Text.Add("She licks her lips, and leans forward. Her tail lifts slightly, exposing her even further. You find yourself helplessly hard from her sensual touches. She reaches back and takes a hold of you, before aiming you upward... and sitting down.", parse);
			Text.NL();

			// TODO: Multidick
			if (player.NumCocks() === 2) {
				Text.Add("You feel <i>both</i> of your [cocks] push against her surprisingly wet, warm folds, before they easily part them. A heritage of taking two at once seems to have made her amazingly adapted...", parse);
				Text.NL();
				Text.Add("Your twin tips sink into the wet heat of her rippling passage, and her walls constrict around you. You feel your [cocks] squish against each other and her silky confines, and she sinks deeper onto you. You roll your hips, letting out a soft moan as she lowers herself.", parse);
				player.AddLustFraction(0.15);
			} else {
				Text.Add("You feel your dick push against her wet entrance, her eyes watching you hungrily before it simply slips in. A deep, rich <i>heat</i> grips your cock as it sinks into her, and you find yourself softly moaning in surprise. The gentle feel of her body clenching around your [cock] leaves you panting, and you bite your lip.", parse);
			}
			const virgin = enc.female.FirstVag().virgin;
			Sex.Vaginal(player, enc.female);
			player.Fuck(player.FirstCock(), virgin ? 5 : 3);
			enc.female.FuckVag(enc.female.FirstVag(), player.FirstCock());

			if (virgin) {
				Text.NL();
				Text.Add("<i>“Consider yourself lucky on being my first,”</i> she hisses, her voice a mixture of pleasure and pain.", parse);
			}
			Text.Flush();
			Gui.NextPrompt(() => {
				Text.Clear();

				Text.Add("She smirks, sensing the power she has over you now. You reach out to pull her down further, but as soon as you touch her... she stops. You grip her hips and struggle to pull her down, ", parse);

				let odds = (10 + player.strength.Get()) / 100;
				if (odds > 0.95) { odds = 0.95; }

				if (Math.random() < odds) {
					Text.Add("and her eyes open wide as you succeed. You let out a lusty moan as you feel your [cocks] sink deeper into her body, and she lets out a surprised hiss, tilting her head back as you force pleasure into her slick love canal. She tenses up, her lips squeezing around you tantalizingly, your thick tip being stroked by her rippling, undulating muscles.", parse);
				} else {
					Text.Add("but her strength outmatches yours, post-combat. She gives you a stern look, her muzzle curling into a growl. You meekly look down, grunting as her slick walls clench around you. She pushes your hands away, and ", parse);

					if (player.HasTail()) {
						Text.Add("twines her tail with yours, using it to pull herself down onto your [cocks].", parse);
					} else {
						Text.Add("grips the side of your body, pulling herself down onto your [cocks].", parse);
					}
					Text.NL();
					Text.Add("She hisses out in delight, closing her eyes as her oddly warm, wet cunt squishes around your [cocks], her fluids dripping down onto your groin.", parse);
				}

				Text.NL();
				Text.Add("Getting into it rapidly, she lifts one hand and gropes at her scaled, [m1breasts], her eyes lolling back as you sink deeper into her. She lifts her rump up a few inches, slickly pulling your [cocks] out of her, the wet noises that accompany the act spurring you on further.", parse);
				Text.NL();

				if (player.LustLevel() > 0.6) {
					Text.Add("Encouraged by her actions, you reach up and take her scaly, pert breasts in your hands, squeezing them tightly. She gasps in surprise, her loose pussy clenching slickly around you and you let out a soft moan, your precum spurting deeper into her. She gives a delighted moan, letting you toy with her [m1breasts], her eyes shut.", parse);
				} else {
					Text.Add("She squeezes her [m1breasts] slowly, sensually as she rides you, and you find yourself steadily encouraged by the action - whatever else, it's very definitely naughty. You close your eyes and let out a long, shaky breath as her wet cunt milks your [cocks] steadily.", parse);
				}
				Text.NL();
				Text.Add("For what seems like ages she works over your [cocks], humping and riding you with shameless abandon. You feel your cheeks flushed with heat, and find it hard to think straight through the pleasure she forced on you.", parse);
				Text.Flush();
				player.AddLustFraction(0.1);

				Gui.NextPrompt(() => {
					Text.Clear();

					// TODO More than 2 cocks?
					if (player.NumCocks() === 2) {
						Text.Add("Finally, you feel like you can't take it anymore. You let out an aching moan... and then another. Soon you're groaning wantonly, thrusting and humping back up into her, your twinned, slick shafts pulsing inside her. She opens her muzzle, and you hear her sibilant yet sweet voice sound out, <i>“Cum in me... make me heavy with your eggs...”</i>", parse);
						Text.NL();
						Text.Add("You blush as she orders you to finish inside of her.", parse);
						Text.NL();

						player.AddSexExp(1);

						if (player.NumAttributes(Race.Lizard) > 3) {
							Text.Add("<i>“Our hatchlings will have the brightest scales,”</i> she hisses, looking down at you. She seems to consider you lizard enough to breed with!", parse);
						} else {
							Text.Add("<i>“Such exotic hatchlings you'll give me,”</i> she hisses, looking down at you. You can't help but blush an even deeper red.", parse);
						}
						Text.NL();
						Text.Add("She grinds her [m1vag] messily against your two dicks, moaning eagerly as you fill her nicely. Finally though, you can't bear it any longer... and with a long drawn, breathless moan of your own, you feel climax pound through your brain. Hot, sticky ropes of cum spurt out through each of your tips deep into her body, and you feel the pressure in your taint surging, making every jet of spunk so agonizingly wonderful to fill her with.", parse);
						Text.NL();

						// CUM PRODUCTION
						if (player.CumOutput() > 3) {
							Text.Add("You quickly feel your cum surging back around your [cocks], the hot fluids coating your shafts as she rides you. Her belly seems to be bloating before your eyes as you pump your potent seed deep into her body... You cum and cum, unable to help yourself as you fill her to the brim, and her eyes simply glaze over in ecstasy.", parse);
							Text.NL();
							Text.Add("Harder and harder she rides you, until you hear her <i>shout</i> out to the air in bliss. Her wet, sloppy cunt tightens and squeezes around your pair of spurting cocks, trapping your seed even further. Her stomach grows even more, and by the time your own climax begins to die down, she looks mildly pregnant. Gasping for breath, she slumps forward, lying atop you.", parse);
						} else {
							Text.Add("Harder and harder she rides you, until you hear her <i>shout</i> out to the air in bliss. Her wet, sloppy cunt tightens and squeezes around your pair of spurting cocks, trapping your seed deep inside of her. She leans forward, holding tightly onto you as she rides out her own climax, her juices making a mess of your groin.", parse);
						}
					} else {
						Text.Add("She pulls herself up, lifting her heated vent until just your thick tip rests inside of her. You feel her [m1vag] clench around your slick tip and find it hard to keep from moaning. She smirks down at you in delight, before plunging herself back onto you.", parse);
						Text.NL();
						Text.Add("You let out a loud gasp, which seems to spur her on even further.", parse);
						Text.NL();

						if (player.FirstVag() && Math.random() < 0.5) {
							Text.Add("She seems to be intent on tormenting you, though, and you see her hand move down behind her. You almost stop to ask her what she's doing, before you feel <i>exactly</i> what.", parse);
							Text.NL();
							Text.Add("Two, thick, scaled fingers press to your own wet lips, and she slowly massages your heated labia. You blush deeply, feeling your [cock] pulse sympathetically. As she feels the way your dick spasms inside of her dripping cunt, [m1name] seems to settle on a course of action. You take a deep breath as you feel her fingers begin to rub and tease your [vag].", parse);
							Text.NL();
							Text.Add("Her fingers move mercilessly, stroking up and down your folds, stopping to lightly brush your [clit] with each motion. Every time she touches you, it makes your thick [cock] pulse more achingly within her, and soon she's bouncing slowly up and down on your heavy dick as her fingers explore your feminine half.", parse);
							Text.NL();
							Text.Add("<i>“Mmm...”</i> she moans, her cunt clamping around your aching dick. She lifts herself up again, holding herself right at your tip. [m1Name] gives you a smirk... before dropping. You feel her wet passage engulf your dick right as her fingers straighten, and <i>plunge</i> into your wet [vag]. Stars burst in front of your eyes, and you feel your body spasm. She groans delightedly, and begins to thrash about on your dense meat, her fingers filling your cunt to capacity.", parse);
							Text.NL();
							Text.Add("You can do little more than lie there in forced bliss as she abuses your [vag], her fingers leaving you twitching and moaning in aching need. All the while, her own wet passage milks your [cock] eagerly.", parse);
							Text.NL();
							Text.Add("Finally, it gets to be too much. You feel your climax approaching like a wave. Your eyes roll back, and you <i>howl</i> out in pleasure as your dick begins to spasm wildly, your legs thrashing behind [m1name] as your [vag] clamps down around her fingers. Your juices gush around her fingers, pooling onto the ground quickly and leaving your [vag] a mess. Your [cock] throbs and spasms inside the reptile, and she lets out a delighted hiss, leaning forward.", parse);
							Text.NL();
							Text.Add("Your entire body goes tense with the sensation of filling a warm female, as your own cunt is filled so wonderfully. Dimly you're aware of the reptile's own climax, her pussy mimicking your own as it squeezes around your dick.", parse);
						} else {
							Text.Add("Back and forth she rides you, grinding her scaled cunt against your groin with a delighted expression on her face. She lets out a hiss of lust, moving sensually atop you. Her slick walls squeeze your fat dick constantly, and you find yourself moving with her, bucking in. She drives you steadily toward the edge, and all you can think of is filling her reptilian womb with your seed, lacing her body with your sticky spunk.", parse);
							Text.NL();
							Text.Add("Her tight lips massage and squeeze your dick, and her hands again cup her breasts, groping and squeezing them. You lie there, watching shakily as you focus on pushing your hips up to hers, trying to push your [cock] ever deeper.", parse);
							Text.NL();

							// STAMINA CHECK
							const odds = (10 + player.stamina.Get()) / 100;
							if (Math.random() < odds) {
								Text.Add("You piston your hips hard against hers... and seem to hit just the <i>right</i> spot. Her eyes snap open, and her face makes a surprised, silent 'Oh!'", parse);
								Text.NL();
								Text.Add("Suddenly her cunt contracts around your [cock], and you feel her humping grow more and more desperate. Up and down, grinding herself along your breeding pole, she works herself into a frenzy. Then her legs clamp tightly around your hips, and she tilts her head back and <i>howls</i> out. You feel slick, warm fluids squirt out around your [cock], and [m1name] shudders as her cunt milks you hungrily. Her eyes glazed, she pants heavily as her climaxing pussy spasms around your dick, quickly pumping you into your own climax.", parse);
							} else {
								Text.Add("It gets harder and harder to resist the squeezing, slippery folds that stroke your [cock], and you find yourself looking at [m1name]'s smug face as she watches you lose to her body. She swivels her hips, grinding your wet, sensitive tip right against her walls deep within her slick passage, and you can't help but moan eagerly.", parse);
								Text.NL();
								Text.Add("<i>“Cum, little [race], you know you can't help yourself,”</i> she coos, sounding delighted at your predicament. But she's right... You grunt, panting heavily, your breath getting louder and harder to control. You feel orgasm surging to take you, and there's nothing you can do. It hits you like a wall, and your hips jerk and you buck needily into her waiting cunt. She lets out a hiss of pleasure as you thrust almost mindlessly into her reptilian pussy, pumping rope after rope of thick cum into her waiting depths.", parse);
								Text.NL();
								Text.Add("Still unsatisfied however, she keeps riding you, extracting more pleasure from you, driving you harder.", parse);
							}
						}
					}
					Text.NL();
					Text.Add("Your brain awash with pleasure, you pass into the haze of afterglow, and soon simply pass out...", parse);
					player.AddLustFraction(-1);
					Text.NL();
					if (!party.Alone()) {
						Text.Add("You wake to [p1name] standing over you, shaking you gently. <i>“[playerName], wake up!”</i> [p1heshe] says. You groan softly, struggling to sit up. Looking a mess, you blush slightly, before thanking [p1himher] for helping you. Your party helps you gather your things, before you set off.", parse);
						player.AddLustFraction(0.05);
					} else {
						Text.Add("Some time later you awake, and find her gone. You gather your things slowly, before heading off again.", parse);
					}
					Text.Flush();
					Gui.NextPrompt();
				});
			});
		}, 1.0, () => player.FirstCock());
		scenes.AddEnc(() => { // TAILFUCK
			const lusty = player.LustLevel() >= 0.7;
			parse.boygirl = player.mfTrue("boy", "girl");
			parse = Text.ParserPlural(parse, player.NumCocks() > 1);
			parse = Text.ParserPlural(parse, third, undefined, "2");

			Text.Add("<i>“Much better,”</i> she hisses, her voice slippery like snake oil. <i>“I was feeling so stressed until you came along. You will be my plaything, won’t you?”</i> Not that it seems like you have much choice in the matter. The reptilian enjoys you squirming under her gaze, lightly touching herself as she considers what to do with you. Her tail sways back and forth slowly; poised to strike should you dare escape her clutches.", parse);
			Text.NL();
			if (player.FirstCock()) {
				Text.Add("<i>“I bet you take pride in [thatThose],”</i> she smirks, planting a scaled foot on your [cocks]. <i>“Do[notEs] [itThey] make the girls squeal in delight as you fuck them?”</i> The pressure grows as she starts to slowly stroke you, pushing your throbbing shaft[s] against your [belly].", parse);
				if (player.HasBalls()) {
					Text.Add(" She takes special care with your [balls], toying with them carefully with her foot. The girl is being nice and tender, but the occasional ‘accidental slip’ reminds you of just who is in charge here.", parse);
				}
				Text.NL();
				if (player.FirstVag()) {
					Text.Add("<i>“I’m far more interested in what lies below, though,”</i> she grins as she leans down, pulling your [cocks] aside, exposing your pussy. <i>“Perhaps another time.”</i>", parse);
				} else {
					Text.Add("<i>“Does that feel good?”</i> There is a hungry look in her eyes, and an aroused flush on her face. <i>“Wouldn’t you like it more than anything else if I were to sink down on you right now and ride you like a bitch in heat?”</i> She continues toying with your maleness, raising [itThem] to full mast, though [itsTheyre] still pinned painfully against your stomach.", parse);
					Text.NL();
					if (lusty) {
						Text.Add("You nod quickly. This is turning out a lot better than you could hope for.", parse);
						Text.NL();
					}
					Text.Add("<i>“Well, I hate to disappoint you,”</i> the reptile drawls, <i>“but I’m not here to fulfill <b>your</b> needs… you are here to fulfill <b>mine</b>.”</i>", parse);
					Text.NL();
					Text.Add("That sounded ominous.", parse);
				}
				Text.NL();
			}
			if (player.FirstVag()) {
				parse.l = player.LowerBodyType() !== LowerBodyType.Single ? Text.Parse("up the inside of your [thigh]", parse) : "from your stomach down into the valley of your crotch";
				Text.Add("<i>“Now <b>this</b> is a treat,”</i> the lizan licks her lips appreciatively as her finger traces a line [l]. After teasing your outer lips for a bit, she sinks two digits into your [vag], watching your face closely as she does. If you weren’t wet before, the sensual lizard sure does her best to push your buttons… but to what end? A tiny gasp slips out from your lips, much to her mirth.", parse);
				Text.NL();
				parse.c = player.FirstCock() ? Text.Parse(" removing her foot from your [cocks] as she gets down on all fours,", parse) : "";
				Text.Add("<i>“Good plaything,”</i> she murmurs encouragingly. <i>“I’m going to need you nice and wet for this next part...”</i> The reptile leans down further,[c] and graces your nethers with her dexterous tongue. The slithering appendage darts into your folds, and by the time she’s tasted enough of you, you’re panting heavily.", parse);
				Text.NL();
			}
			Text.Add("<i>“I think it’s time you give me some attention too.”</i> You gulp as the lizard looms over you, straddling your midsection and leaning down over you, her breasts inches from your face. <i>“You may start here,”</i> she whispers, her smoldering eyes boring into you as you give in to her whims and start kneading her scaly tits.", parse);
			Text.NL();
			Text.Add("<i>“Mmm… use your tongue too,”</i> she commands, grinding her hips down on you and leaving a wet trail from her pussy across your belly. ", parse);
			if (player.FirstCock()) {
				Text.Add("On her downstroke, she grinds your [cocks] between her buttcheeks, rubbing her pussy over [itThem], then drawing her inviting cleft out of your reach when your shaft[s] twitch[notEs] in response. Her slow torture is driving you wild - if you are not going to be allowed to use your [cocks], why must she torment you this way? ", parse);
			}
			Text.Add("Obediently, you wrap your lips around one of her nipples - are lizards supposed to have nipples? No matter, this one does, and they are quite fun to play with, quickly becoming stiff as you do so.", parse);
			Text.NL();
			if (player.sexlevel < 3) {
				Text.Add("<i>“No teeth!”</i> she warns you, frowning at your enthusiasm. <i>“What do they teach the [boygirl]s these days?”</i>", parse);
			} else {
				Text.Add("<i>“Good… just like that,”</i> she moans appreciatively. <i>“You’re a keeper, come and submit to me more often.”</i>", parse);
			}
			Text.Add(" Before long, her delicious boobies are pulled out of your reach, only to be replaced by her drooling snatch.", parse);
			Text.NL();
			Text.Add("<i>“Here, next,”</i> she pants, caressing your [hair] lightly as she straddles your [face], grinding her crotch all over you. Her scent is intoxicating, and you can’t resist giving in to her wishes, letting the spiral of lust drag you deeper and deeper into debauchery just as you bury your [tongue] into her needy slit. Your nose grinds against the rutting lizard’s delicate nub, making her squeal in pleasure.", parse);
			Text.NL();
			if (player.FirstCock()) {
				parse.t = player.NumCocks() > 1 ? " together" : "";
				Text.Add("You’re in for quite the surprise too, as you feel the reptilian wrap her scaly tail around your [cocks], hugging [itThem] tightly[t] as she jerks you off. Waves of pleasure surge through you, but she stops as soon as she notices your onsetting orgasm, releasing you from her hold and leaving you a panting mess.", parse);
			} else if (player.FirstVag()) {
				Text.Add("You let out a muffled moan into the reptilian’s wet pussy as you feel her tail rub against your own entrance. The girl has expert control of the appendage, which she demonstrates as she gives your [clit] a light flick, making you shudder.", parse);
			}
			Text.NL();
			Text.Add("<i>“Mmm… you’ve been a very good, obedient [boygirl],”</i> the busty lizard praises you, stifling a moan as her sweet, oily nectar trickles onto your [tongue]. <i>“Just do one more thing for me, and perhaps I shall reward you, yes?”</i>", parse);
			Text.NL();
			if (player.SubDom() > 0) {
				Text.Add("Well, it’s not like you have a choice, is it? Ignoring your defiant stare, your scaly mistress flashes you a grin.", parse);
			} else {
				Text.Add("Eager to please your scaly mistress, you nod expectantly.", parse);
			}
			Text.Add(" <i>“My tail is very sensitive, and I quite enjoy having it licked… won’t you indulge me, pet?”</i> Her voice is sultry, but you can sense the vague outline of a trap there. You don’t have much time to contemplate however, as the lizan takes your silence for agreement. That, or she wasn’t really asking for permission in the first place, merely stating your future. She adjusts her position so she sits straddling your [belly], her tail bent between her legs and snaking its way up your body.", parse);
			Text.NL();
			Text.Add("The lizan’s face is flushed as you begin slathering the scaly tip with your tongue. Splatters of oily femcum trickle down to your stomach; she’s grinding her newly pleasured pussy against her own tail, and the juices are spreading.", parse);
			if (player.FirstCock()) {
				Text.Add(" As you work your way up her tail, you can taste the salty tang of your own pre, reminding you of your spurned [cocks].", parse);
			} else if (player.FirstVag()) {
				Text.Add(" Speaking of juices, you can taste your own on her tail; a reminder of where it was just a short while ago. Your loins twitch at the memory.", parse);
			}
			Text.NL();

			Sex.Cunnilingus(player, lizard);
			player.Fuck(undefined, 2);
			lizard.Fuck(undefined, 2);

			if (player.FirstBreastRow().Size() >= 6) {
				Text.Add("The girl smirks as she tops you, her scaly tail worming its way between your [breasts] and into your pliant mouth. <i>“If anyone were to see this, it’d look like you were giving me a blowjob, wouldn’t it?”</i> she murmurs coyly, pushing your breasts together to form a tight valley for her to thrust her tail into.", parse);
			} else {
				Text.Add("<i>“Come on, can’t you take more?”</i> she goads you, rolling her hips forward and feeding you more of the snake. It takes all you have to not gag on the thick prehensile appendage as it worms its way down your protesting gullet.", parse);
			}
			Text.Add(" Finally, she lets you go, pulling out of your mouth and leaving you coughing.", parse);
			Text.NL();
			Text.Add("<i>“I’ve always wondered what having a cock would feel like,”</i> the reptilian murmurs to herself as she caresses the saliva-coated tail. She looks you over thoughtfully, a slow grin spreading across her face. ", parse);
			if (player.FirstVag()) {
				Text.Add("<i>“I’d say it’s time for your reward, my pet.”</i>", parse);
			} else {
				Text.Add("<i>“Have you ever wondered what it would feel like to be fucked by one?”</i>", parse);
			}
			player.AddLustFraction(1);

			Text.Flush();

			Gui.NextPrompt(() => {
				Text.Clear();
				const dom = player.SubDom();
				Text.Add("A quick look tells you that the lizard isn’t joking, and she’s too far gone into the haze of lust to be reasoned with. ", parse);
				if (dom > 25) {
					Text.Add("You fume at the thought of the scaly girl persuming to lord it over you like if you were some common slut, but your words lack fire; she and her companion[s2] have already bested you once, they could undoubtedly do so again in your current state.", parse);
				} else if (dom > -25) {
					Text.Add("A quick glance tells you that her companion[s2] [isAre2] still around, watching events unfold with curiosity. You can’t really stand up to them the way you are, perhaps it’s better to just let her do her thing and get it over with.", parse);
				} else {
					Text.Add("Not that you’d want to… the thought of your mistress’s tail impaling you is too arousing to let go of. The more you think about it, the more receptive you become to the idea.", parse);
				}
				Text.Add(" Either way, it’s becoming harder to think straight. Your loins are aching with need… maybe you should just give in, if only to have your own release.", parse);
				Text.NL();
				parse.l = player.HasLegs() ? "between your legs" : "into the valley of your crotch";
				Text.Add("<i>“Good, that’s the expression I want you to have,”</i> she encourages you as her hand slides down [l]. <i>“I’ll ease you open, then it’s time...”</i> Her tail sways back and forth eagerly, glistening with your saliva.", parse);
				Text.NL();

				let pussy: boolean = false;

				const scenes = new EncounterTable();
				scenes.AddEnc(() => {
					pussy = true;
					Text.Add("You moan as she once again thrusts her fingers into your [vag]; the reptile savouring your discomfort. <i>“Don’t try to fool me, you’re wet as the Oasis itself,”</i> she leans closer and taunts you. <i>“You can put on a defiant facade if you want; your body sings a different song.”</i>", parse);
					Text.NL();
					parse.dom = dom > 25 ? " reluctantly" :
								dom > -25 ? "" : " eagerly";
					Text.Add("She’s right… it’s no use denying it. You[dom] let go of your last sliver of self-control and close your eyes, only focusing on the heavenly feeling of her hand pounding your pussy. Filling your thoughts is the promise of something more; that scaly and deliciously thick fuckstick that you helped prepare yourself.", parse);
				}, 3.0, () => player.FirstVag());
				scenes.AddEnc(() => {
					parse.l = player.HasLegs() ? "on all fours" : "face forward";
					const tail = player.HasTail();
					parse.tail = tail ? tail.Short() : "";
					parse.t = tail ? Text.Parse(", roughly pulls your [tail] out of the way", parse) : "";
					Text.Add("Though her words are soothing, her actions are all but. You’re quickly hoisted around [l], head pushed down into the sand as the lizard takes a seat straddling your back, using you as furniture. You’d be hard pressed to think of a way she could humiliate you further, but she easily exceeds your expectations when she wets her fingers[t] and reaches between your buttcheeks, lightly prodding your [anus]. You clench reflexively, but she’s not about to have any of that. She pushes the first finger in, probing your depths and testing how stretchy you are, and you moan despite yourself.", parse);
					Text.NL();
					Text.Add("<i>“It doesn’t have to hurt, I have this oil...”</i> She briefly pulls out her fingers, rummaging through her pack for a bit. A cool liquid seeps between your cheeks, dulling the pain and coaxing another appreciative moan from you. The lizard works it in, spreading you wider and wider. Before long, she fits digit after digit into your relaxing butt, until she can easily make room for her entire hand. This is just the beginning, though; you know how thick her tail is.", parse);
				}, 1.0, () => true);

				scenes.Get();
				parse.target = pussy ? parse.vag : parse.anus;

				Text.NL();
				Text.Add("<i>“Mmm, you’re so hot inside,”</i> the reptile sighs, probing deeper and deeper. <i>“My cock wants you, are you ready for it?”</i> ", parse);
				if (player.FirstCock()) {
					if (player.HasLegs()) {
						parse.hind = player.NumLegs() > 2 ? " hind" : "";
						parse.b = player.HasBalls() ? Text.Parse(" fondling your [balls] and", parse) : "";
						Text.Add("Her other hand reaches between your[hind] legs,[b] tugging on your [cocks].", parse);
					} else {
						parse.b = player.HasBalls() ? Text.Parse(" and your [balls]", parse) : "";
						Text.Add("Her other hand reaches around you, playing with your [cocks][b].", parse);
					}
					Text.Add(" With the dual stimulation, you feel like you could come then and there, but she once again cruelly prevents your orgasm, her tight grip clamping your cumvein shut. If you want release, it’s going to have to be through other means. ", parse);
				}
				parse.more = !pussy ? " more" : "";
				Text.Add("Interpreting your muffled moan as an affirmative, she quickly takes her place, the tip of her tail poised at your [target]. Your to-be lover coats her already glistening tail in[more] sticky oil, retrieved from her belongings. It seems like she’s been preparing for something like this for quite some time now.", parse);
				Text.NL();
				Text.Add("She leans down, whispering: <i>“I’ll go slow at the start.”</i> Not very convincing, nor reassuring. You bite your lip as she guides her tail inside your [target], the thin tip passing easily. The scaly appendage only grows thicker the more of it she feeds you, however, and she has a good four feet at her disposal.", parse);
				Text.NL();

				let cap;
				if (pussy) {
					Sex.Vaginal(lizard, player);
					player.FuckVag(player.FirstVag(), undefined, 3);
					lizard.Fuck(undefined, 3);

					cap = player.FirstVag().Cap();
				} else {
					Sex.Anal(lizard, player);
					player.FuckAnal(player.Butt(), undefined, 3);
					lizard.Fuck(undefined, 3);

					cap = player.Butt().Cap();
				}

				Text.Add("Stuffing you is an agonizingly slow process. Each scale that goes into you imprints its texture on your sensitive opening, and once inside, it joins a whole army of its brothers, intent on claiming your deepest reaches. ", parse);
				if (cap > Capacity.loose) {
					Text.Add("Your well-trained [target] has no trouble receiving the girl’s girth - she mutters a muffled oath of surprise at how stretchy you are.", parse);
					Text.NL();
					Text.Add("<i>“This isn’t your first time, is it,”</i> she gasps, impressed at your capacity. <i>“I might even be able to go ‘balls deep’!”</i>", parse);
				} else if (cap > Capacity.tight) {
					Text.Add("The first foot or two is reasonably thin, but the girl soon encounters resistance when she tries to push the girthier part of her tail into you.", parse);
					Text.NL();
					Text.Add("<i>“Don’t worry,”</i> she comforts you, <i>“we have a looot of time to get you used to this...”</i> It doesn’t seem like she’s about to be discouraged by a minor setback like this.", parse);
				} else {
					Text.Add("<i>“Hng… you’re tight,”</i> she grunts, barely a foot of her tail in your [target] before she meets resistance. <i>“Guess I’m a bit too big for you… perhaps I should ask some of my friends to stretch you out first...”</i> Either way, it doesn’t look like she’s about to be discouraged by a minor setback like this.", parse);
				}
				Text.NL();
				parse.back = pussy ? "stomach" : "back";
				Text.Add("Placing her hands firmly on your [hips], the lizard pulls back out part of the way, taking a stance on her knees with an appropriate length of her tail pressed tightly between her thighs. <i>“This way, I can move easier,”</i> she murmurs, caressing your [skin] affectionately, running a hand across your [back]. You try to brace for the impact, but she still manages to surprise you when she slams her hips forward, plunging into your [target].", parse);
				Text.NL();
				if (pussy) {
					Text.Add("Your scaly lover is easily able to penetrate all the way to your womb, her thrusts further setting you off as her tail doubles back over, making it feel like there’s a wild snake loose in your straining pussy, coiling over and over. It’s very different from a cock; the tail is fully prehensile, and the lizard seems to take perverse delight in twisting it this way and that as she pistons you, coaxing you into moaning louder and louder.", parse);
				} else {
					Text.Add("The feeling of her tail creeping up your colon is truly something else. Due to its flexibility, it can easily twist and turn the way no normal cock could, eagerly exploring depths usually untouched. ", parse);
					if (player.FirstCock()) {
						Text.Add("Not to mention, the endless row of nubby scales endlessly grinding against your prostate. Whether you want to or not, she’s going to push you over the edge with this sooner rather than later. ", parse);
					}
					Text.Add("You’re grateful for the lube, because she sure as hell isn’t going easy on you.", parse);
				}
				Text.NL();
				Text.Add("The reptile doesn’t seem to be very experienced in having sex this way, but she makes up for it in enthusiasm, slamming her hips up against yours time and time again at breakneck pace. She quickly establishes a rough rhythm, moaning as her movements grind the underside of her tail against her drooling slit.", parse);
				Text.NL();
				parse.hisher = third ? "their" : "his";
				parse.heshe  = third ? "they" : "he";
				Text.Add("The lizan’s friend[s2] [isAre2] watching in rapt attention, probably surprised at this turn of events. You can’t tell from [hisher] expression[s2] if [heshe] [isAre2] apprehensive at being the next one in line to sate her lusts, turned on, or both.", parse);
				Text.NL();

				const cum = player.OrgasmCum();

				Text.Add("You lover keeps trying to force more and more of her tail into your protesting hole, and it’s not long before your body can’t take any more of it. With a nerve-wrecking shudder, your orgasm hits, and it’s going to be a messy one.", parse);
				if (player.FirstCock()) {
					if (!pussy) {
						Text.Add(" Your prostate is ablaze, the continuous grinding of her tail too much for you.", parse);
					}
					parse.cum = cum > 6 ? "blasting" :
								cum > 3 ? "jetting" : "shooting";
					parse.p = pussy ? Text.Parse("your [belly]", parse) : "the sands below";
					Text.Add(" Finally getting [itsTheir] long-awaited release, your [cocks] [cum] [itsTheir] load[s] all over [p].", parse);
				}
				if (player.FirstVag()) {
					parse.p = pussy ? " overstuffed" : "";
					Text.Add(" Juices spill from your[p] [vag], gushing from it in streams.", parse);
				}
				Text.NL();
				Text.Add("The girl gradually slows down when she realizes that you’re spent, giving you some respite. She doesn’t pull out though. <i>“You can go again, right?”</i> she asks, sounding slightly worried. <i>“I wanted to try some more things too...”</i> It doesn’t seem like you’ll be getting away from this one for a while… at least not until she’s had her fill.", parse);
				Text.NL();
				Text.Add("Time passes...", parse);
				Text.NL();
				parse.comp = party.Num() === 2 ? member1.name : "your companions";
				parse.c = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
				Text.Add("You’re thoroughly exhausted when the playful lizard finally leaves you alone. Wobbling slightly, you[c] set out on your journey again.", parse);
				Text.Flush();

				TimeStep({hour: 2});
				player.subDom.DecreaseStat(-75, 1);

				Gui.NextPrompt();
			});
		}, 1.0, () => true);
		scenes.Get();
	}

}
