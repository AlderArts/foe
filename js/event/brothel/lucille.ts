/*
 *
 * Define Lucille
 *
 */

import { EncounterTable } from "../../encountertable";
import { Entity } from "../../entity";
import { GAME } from "../../GAME";
import { Gui } from "../../gui";
import { IChoice } from "../../link";
import { ILocation } from "../../location";
import { Party } from "../../party";
import { Text } from "../../text";
import { Player } from "../player";
import { BastetScenes } from "./bastet";
import { FireblossomScenes } from "./fireblossom";
import { GryphonsScenes } from "./gryphons";
import { LucilleFlags } from "./lucille-flags";

export class Lucille extends Entity {
	constructor(storage?: any) {
		super();

		this.ID = "lucille";

		// Character stats
		this.name = "Lucille";

		this.body.DefFemale();

		this.flags.buy = 0;
		this.flags.Theme = 0; // Been to theme room. Bitmask

		if (storage) { this.FromStorage(storage); }
	}

	public ThemeroomOpen() {
		return this.flags.buy >= LucilleFlags.Buy.First;
	}
	public ThemeroomFirst() {
		return this.flags.Theme === 0;
	}

	public FromStorage(storage: any) {
		this.LoadPersonalityStats(storage);

		// Load flags
		this.LoadFlags(storage);
	}

	public ToStorage() {
		const storage = {};

		this.SavePersonalityStats(storage);

		this.SaveFlags(storage);

		return storage;
	}

	// Flags

	// Schedule TODO
	public IsAtLocation(location?: ILocation) {
		return true;
	}
}

export namespace LucilleScenes {
	export function Themerooms() {
		const player: Player = GAME().player;
		const gryphons = GAME().gryphons;
		const bastet = GAME().bastet;
		const fireblossom = GAME().fireblossom;
		const lucille: Lucille = GAME().lucille;

		const parse: any = {
			playername: player.name,
			sirmadam: player.mfFem("sir", "madam"),
		};

		const lucilleFirst = lucille.ThemeroomFirst();
		const lucillePresent = lucilleFirst || lucille.IsAtLocation();

		Text.Clear();
		Text.Add("You make your way toward a billboard of sorts in the back of the main hall, where a set of garish posters proclaim the fabulous experiences one might have in the themed rooms.", parse);
		if (lucilleFirst) {
			Text.Add(" You’re still not quite certain what they actually entail - Lucille’s explanation made them sound like some form of elaborate roleplaying, and you can’t deny that you are at least a little bit intrigued.", parse);
			Text.NL();
			Text.Add("<i>“Ah, you have an interest in our themed rooms?”</i> You give a startled jump as you hear Lucille’s voice behind you. Absorbed in the lurid descriptions on the board, you must have missed noticing her approach.", parse);
			Text.NL();
			Text.Add("<i>“For a meager pouch of coins, we can make your dreams come true,”</i> the hostess purrs, sliding a hand around your waist. <i>“Now, what sort of experience would you like to have? I have heard good things about the Cat Dynasty one, perhaps that one would be good for a beginner?”</i>", parse);
		} else if (lucillePresent) {
			Text.Add(" As you ponder, Lucille slides up by your side, sensually placing a hand around your waist that sends shivers of anticipation up your spine.", parse);
			Text.NL();
			Text.Add("<i>“What sort of dream would you like to have this time, [playername]?”</i> Lucille murmurs at your side. <i>“Take your time deciding. Here, there are no opening or closing hours.”</i>", parse);
		} else {
			Text.NL();
			Text.Add("<i>“Anything to your liking?”</i> one of the attendants, a pretty young maid, approaches you. <i>“Take as much time as you like in making the choice, I will lead you to your dreams once you’re ready.”</i>", parse);
		}
		Text.NL();
		Text.Add("Nodding, you turn to the board and survey your options.", parse);
		Text.NL();

		// #room choice TODO

		Text.Add("<i><b>The Cat Dynasty:</b> Experience life through the eyes of a young feline chosen by the fates to saddle the mantle of godhood. As the Goddess of love, Lady Bastet, how will your judgement change the lives of your adoring worshippers?</i>", parse);
		Text.NL();
		Text.Add("The poster shows a sultry, dark-skinned cat-morph reclining on a dias, fanned by her priestesses. Bastet seems to be a hermaphrodite with quite... impressive assets. The poster notes that each use is [coin] coins.", {coin: bastet.Cost()});

		Text.NL();

		Text.Add("<i><b>Birth of a Kingdom:</b> Travel back to the dawn of time, when the world and its people were wild and untamed. Witness the rise of a civilization as seen through the eyes of both its founders!</i>", parse);
		Text.NL();
		Text.Add("The poster depicts two gryphon-morphs: a muscle-bound, scarred male with a tribal, bestial air about him, and his very pregnant mate in his arms. Both are scantily clad, wearing little more than loincloths and leathers, and set against a backdrop of a lush, tropical valley. The poster notes that each use is [coin] coins.", {coin: gryphons.Cost()});

		Text.NL();

		Text.Add("<i><b>Under the Dragon’s Claw:</b> Live the life of Fireblossom, a princess brought low by her draconic conquerors. Experience the might of a dragon, first-hand!</i>", parse);
		Text.NL();
		Text.Add("There is a pale and incredibly beautiful young woman with long blonde hair on the poster. She’s completely nude, her naughty bits covered up by an immense serpentine tail that envelops her body possessively. The poster notes that each use is [coin] coins.", {coin: fireblossom.Cost()});
		/* TODO
		Text.NL();
		Text.Add("", parse);
		*/
		Text.Flush();

		const selection = (func: any) => {
			Text.Clear();
			if (lucillePresent) {
				Text.Add("<i>“A wise choice,”</i> Lucille affirms, leading you toward the back. The two of you enter a narrow corridor with a long line of doors, each marked by a small symbol indicating what is inside. Some of the rooms are marked as occupied, and you hear strange noises from inside them.", parse);
				Text.NL();
				if (lucilleFirst) {
					Text.Add("<i>“I’m not sure what sort of impression you have so far, and what your expectations going forward might be, but let me explain a bit about how the rooms work, so as to not startle you.”</i> The beauty leans against you reassuringly, her soft breasts squishing against your arm. <i>“This is not mere roleplay; what you see inside is a manifestation of a different reality, a space where you may freely explore and sate your desires.”</i>", parse);
					Text.NL();
					Text.Add("Is it some form of magic?", parse);
					Text.NL();
					Text.Add("<i>“You could say that. A glamour, hypnotism, a lucid dream...”</i> she waves her hand dismissively. <i>“Do not think of the details; immerse yourself in the experience as if it was real. Also, know that the procedure is entirely safe for you. No harm will befall you within these walls.”</i>", parse);
					Text.NL();
					Text.Add("Noting your lingering uncertainty, the madame gently caresses your cheek. <i>“Worry not. It might be frightening at first, but there are so many possibilities to explore, so much to see and do. I’ve heard it to be healthy to play out your fantasies in a safe space such as this, and see the world through a different lense. My explanation can’t give it justice though, you must experience it yourself. Will you take this leap of faith?”</i>", parse);
					Text.NL();
					Text.Add("Well, that is what you came here for, after all. It seems silly to turn back now. You nod, gaining an approving smile from Lucille that makes your heart skip a bit. <i>“Then enter, [playername].”</i> She steps aside, urging you inside the room. <i>“I assure you, it will be worth the price.”</i> You have the strange feeling that she’s not talking about money when she says the word price...", parse);
				} else {
					Text.Add("<i>“This is it,”</i> the hostess stops in front of one of the doors, unlocking it. ", parse);
					const scenes = new EncounterTable();
					scenes.AddEnc(() => {
						Text.Add("<i>“Sometime, you must tell me of your experiences,”</i> Lucille eyes you suggestively. <i>“Perhaps in my room, over a bottle of wine.”</i>", parse);
					}, 1.0, () => true);
					scenes.AddEnc(() => {
						Text.Add("<i>“Have a pleasant time, [playername].”</i> She smiles, batting her thick eyelashes at you. <i>“This particular room has seen a lot of use lately - it seems to be really popular.”</i>", parse);
					}, 1.0, () => true);
					scenes.AddEnc(() => {
						Text.Add("<i>“Remember, your choices inside does affect your unique experience. Feel free to explore any desires or urges that you usually would not.”</i>", parse);
					}, 1.0, () => true);
					scenes.AddEnc(() => {
						Text.Add("<i>“Ah… it seems that someone is eager to get started,”</i> Lucille smiles warmly, brushing her hand lightly over your taut clothing and tracing the outline of your [cocks]. <i>“I do so hope that the experience is up to your expectations… if not, perhaps you can come by my chambers afterward?”</i>", {cocks: player.MultiCockDesc()});
						player.AddLustFraction(1);
					}, 1.0, () => player.FirstCock());
					scenes.Get();
					Text.NL();
					Text.Add("With that, she steps aside, allowing you to enter the room.", parse);
				}
			} else {
				Text.Add("<i>“As you wish,”</i> the attendant nods, leading you into the back. She unlocks one of the many doors, gesturing for you to step inside. <i>“I hope you have a pleasant time, [sirmadam].”</i>", parse);
			}
			Text.Flush();

			Gui.NextPrompt(func);
		};

		const options: IChoice[] = [];
		options.push({ nameStr : "Cat Dynasty",
			tooltip : "Choose the Cat Dynasty and enter the role of Bastet, the hermaphrodite feline Goddess.",
			func() {
				selection(BastetScenes.IntroEntryPoint);
			}, enabled : true,
		});
		options.push({ nameStr : "Gryphons",
			tooltip : "Choose Birth of a Kingdom and step back to the beginning of time, seeing history through the eyes of two gryphon-morphs.",
			func() {
				selection(GryphonsScenes.IntroEntryPoint);
			}, enabled : true,
		});
		options.push({ nameStr : "Fireblossom",
			tooltip : "Choose Under the Dragon’s Claw, and embody Fireblossom, the princess turned slave.",
			func() {
				selection(FireblossomScenes.IntroEntryPoint);
			}, enabled : true,
		});
		/* TODO */
		Gui.SetButtonsFromList(options, true, () => {
			Text.Clear();
			if (lucillePresent) {
				Text.Add("<i>“It can be so hard to decide sometimes, can’t it?”</i> Lucille murmurs sympathetically at your side. <i>“Why don’t you mingle for a bit, chat with some of the staff before you’re ready to make your choice?”</i>", parse);
				Text.NL();
				Text.Add("You disentangle yourself from the dark beauty, throwing one last glance at the enticing posters.", parse);
			} else {
				Text.Add("<i>“Please come back when you’ve made your decision.”</i> The attendant gives you a courtesy, leaving you to your thoughts.", parse);
			}
			Text.Flush();

			Gui.NextPrompt();
		});
	}

	export function WhoreAftermath(name: string, cost: number) {
		const player: Player = GAME().player;
		const party: Party = GAME().party;
		const lucille: Lucille = GAME().lucille;

		cost = cost || 0;

		const parse: any = {
			name,
			playername : player.name,
			skinDesc() { return player.SkinDesc(); },
			coin       : Text.NumToText(cost),
		};

		const payFunc = () => {
			Text.Add("You reach for your coin purse and count how many coins you owe her.", parse);
			Text.NL();
			Text.Add("<i>“Pleasure doing business with you, [playername].”</i> Lucille accepts the money and somehow vanishes it in her bodice. <i>“I will look forward to your continued patronage.”</i>", parse);
			Text.Flush();

			party.coin -= cost;

			Gui.NextPrompt();
		};

		Text.Clear();
		Text.Add("You make your way back into the main chamber of the brothel, where you are met up with madame Lucille.", parse);
		if (lucille.flags.buy === LucilleFlags.Buy.No) {
			Text.NL();
			Text.Add("<i>“Did you have an enjoyable time, [playername]?”</i> the sultry raven-haired beauty asks you. <i>“You seem more relaxed than back when you came in here… did [name] help you relieve some stress?”</i>", parse);
			Text.NL();
			parse.c = party.coin < cost ? "; too late, you notice it’s too light to cover the expenses" : "";
			Text.Add("Realizing what she’s after, you stretch for your coin-purse[c]. Tittering, Lucille shakes her head.", parse);
			Text.NL();
			Text.Add("<i>“Here at the Shadow Lady, we value returning customers, so we take good care of our clientele. First time is on the house.”</i> She leans closer, whispering. <i>“Besides, I think [name] would be crushed if you didn’t come back for another visit.”</i>", parse);
			Text.NL();
			Text.Add("This isn’t the way you expected this place to run… But hey, why say no to a freebie?", parse);
			Text.NL();
			Text.Add("<i>“We offer many other services in this palace of pleasure,”</i> Lucille continues, placing a hand on your arm. <i>“For the right price, your every fantasy can be fulfilled; experiences beyond your wildest imagination can be yours to behold...”</i> You catch yourself drowning in the madame’s eyes, lured by her melodious voice that promises so much more than the mere words she speaks.", parse);
			Text.NL();
			Text.Add("<i>“When you are ready, I want you to visit our theme rooms. They are our specialty, experiences that not only satisfy the flesh, but also the spirit. Shards of different possibilities, things that may have been, fantasies beyond the mundane tapestry of our world.”</i> There is a sparkle in her gaze as she speaks of these things, and you find yourself trying to imagine what these mysterious rooms might be like… some form of roleplay, perhaps?", parse);
			Text.NL();
			Text.Add("<i>“Speak to me or one of the attendants should you wish to try them out,”</i> Lucille tells you. <i>“They are by far the most expensive luxuries provided in our establishment, but they are well worth the price, I promise you that.”</i>", parse);
			Text.NL();
			Text.Add("The voluptuous woman steps back, sensually trailing her finger down your arm almost as if to pull you along into her chambers and whatever unearthly pleasures might await there. You shake yourself back to reality just as she disappears behind a beaded curtain, an unreadable smile playing on her full lips.", parse);
			Text.Flush();

			player.AddLustFraction(0.5);

			lucille.flags.buy = LucilleFlags.Buy.First;

			Gui.NextPrompt();
		} else if (lucille.flags.buy === LucilleFlags.Buy.First) {
			if (party.coin >= cost) {
				Text.NL();
				payFunc();
			} else {
				if (name) {
					Text.Add("She greets you and makes some small talk, asking for bedside gossip. You reach down into your pouch to retrieve the coin to pay for your time with [name]… only to realize that you’re short.", parse);
				} else {
					Text.Add("<i>“Was the experience satisfactory?”</i> Lucille asks, that mysterious smile playing on her lips. Still a bit shaken by whatever magic that powers the themed rooms, you merely nod. You reach down into your pouch to retrieve the coin for payment, only to realize that you’re short.", parse);
				}
				Text.NL();
				Text.Add("<i>“Worry yourself not, [playername],”</i> Lucille waves away your concerns, though her sly grin in no way eases your mind. <i>“We all make the accidental slip once in a while… but do not make this a recurring occasion.”</i> She makes a sweeping gesture to her establishment, drawing your attention to the many whores working under her, to her impressive clientele.", parse);
				Text.NL();
				Text.Add("<i>“We value quality here at the Shadow Lady, and quality costs money. I would of course personally never dream of imposing on you, but we do have a reputation to maintain. Should word get out that you can just walk out after not paying, could you imagine what kind of depraved place this would become?”</i> Her eyes sparkle mischievously.", parse);
				Text.NL();
				Text.Add("<i>“I’ll let you off this once… but should this happen again, I’d have to administer punishment, you understand?”</i> You shake your head, saying you do not.", parse);
				Text.NL();
				Text.Add("<i>“If you cannot provide the coin, I need to be reimbursed for the lost upkeep in some way… and I think I know just the thing for you.”</i> Pursing her lips, she puts her arm around you, snuggling up close. <i>“A rather popular event here at the Shadow Lady are the dancing shows,”</i> the dame confides, indicating the big stage. <i>“We put them up for free, but they bring in quite a good amount in tips.”</i>", parse);
				Text.NL();
				Text.Add("You ask if she’s expecting you to perform on the stage for her.", parse);
				Text.NL();
				Text.Add("<i>“In a way. You do not have to be a great dancer… just be yourself.”</i> She seductively trails one finger down your front as she lays out her plan. <i>“We will make a deal. If you cannot pay the fees, you will be part of an act. A public display of punishment, to show the other customers what awaits them should they be short on cash.”</i>", parse);
				Text.NL();
				Text.Add("<i>“I do not know if you’ve been introduced to Chester yet,”</i> she points across the room, indicating the bulky shark-morph bouncer near the front entrance. <i>“Around here, he is the muscle, the enforcer. When people make trouble, he intervenes. I could use the occasional reminder of his authority, however,”</i> she smiles to herself.", parse);
				Text.NL();
				Text.Add("<i>“This is what will happen. If you do not provide the money for the services you’ve paid for - or if you want to make an alternative form of payment - Chester here will bring you to the stage and make an example of you.”</i>", parse);
				Text.NL();
				Text.Add("A public beating? You frown. Lucille gives out a peal of laughter, shaking her head hurriedly.", parse);
				Text.NL();
				Text.Add("<i>“You forget where this is, [playername]. People come here for fun… to explore the carnal, the sexual. And that’s what you’ll give them.”</i> She leans in, whispering in your ear. <i>“He’ll take you up on stage and strip you off everything. He’ll start with your clothes, your gear, until nothing but bare [skinDesc] hides you from the watchful eyes of the crowd. Last, he’ll rob you of your dignity as he takes you. You can make it an act, put on a facade. You can pour out what you feel unaltered. Either way, he’ll fuck you with his rock-hard twin cocks. He’ll fuck you, and he <b>will</b> break you, for the enjoyment of the audience.”</i>", parse);
				Text.NL();
				Text.Add("She pulls back, her dark eyes glittering. <i>“Deal? If this isn’t acceptable, my prices aren’t that steep, and you’ll just have to make sure you never end up short...”</i>", parse);
				Text.NL();
				Text.Add("You’re troubled as she sways away, not sure what to make of this strange ‘offer’ of hers.", parse);
				Text.Flush();

				lucille.flags.buy = LucilleFlags.Buy.Deal;

				Gui.NextPrompt();
			}
		} else {
			Text.NL();
			if (name) {
				Text.Add("<i>“I trust that [name] was to your liking?”</i> she smiles knowingly, winking.", parse);
			} else {
				Text.Add("<i>“I trust that the experience was to your liking?”</i> she smiles, winking. <i>“Be aware that the dream might cling for a while, but I assure you that the procedure is completely safe. You may return as many times as you wish.”</i>", parse);
			}
			Text.Flush();

			// [Pay][Shark]
			const options: IChoice[] = [];
			options.push({ nameStr : "Pay",
				func() {
					Text.Clear();
					payFunc();
				}, enabled : party.coin >= cost,
				tooltip : Text.Parse("Pay the [coin] you owe her.", parse),
			});
			options.push({ nameStr : "Shark",
				func() {
					Text.Clear();
					Text.Add("<i>“I’m sure you remember our deal,”</i> Lucille slowly replies at your refusal, licking her lips in anticipation. Before you can even react, you find yourself paralyzed, unable to lift even a finger as you’re lost in the hypnotic depths of Lucille’s eyes. The madame slowly sways past you, heading toward Chester by the entrance. <i>“I’ll enjoy watching this,”</i> she whispers as she passes by you, <i>“as I’m sure the other customers will as well.”</i>", parse);
					Text.NL();
					Text.Add("This isn’t mere allure; there’s something otherworldly behind your invisible bonds, and you find yourself completely powerless as you watch the shark-morph descends on you. Chester effortlessly lifts you off the ground, throwing you over his muscular shoulder as he takes you backstage.", parse);
					Text.NL();
					// TODO #Goto Shark Punishment
					Text.Add("PLACEHOLDER", parse);
					Text.Flush();

					Gui.NextPrompt();
				}, enabled : true,
				tooltip : "Refuse to pay and face the sharks instead.",
			});
			Gui.SetButtonsFromList(options, false, undefined);
		}
	}
}
