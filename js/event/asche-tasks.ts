
/*
 * TASKS
 */
import * as _ from 'lodash';

import { GetDEBUG } from '../../app';
import { Gender } from '../body/gender';
import { WorldTime, TimeStep, GAME, WORLD } from '../GAME';
import { SetGameState, GameState } from '../gamestate';
import { Gui } from '../gui';
import { Text } from '../text';
import { Party } from '../party';
import { ZebraShaman, ZebraBrave, ZebraShamanScenes } from '../enemy/zebra';
import { Encounter } from '../combat';
import { Jobs } from '../job';
import { Sex } from '../entity-sex';
import { EncounterTable } from '../encountertable';
import { AquiliusScenes } from './outlaws/aquilius';
import { Season } from '../time';
import { IngredientItems } from '../items/ingredients';
import { QuestItems } from '../items/quest';
import { AccItems } from '../items/accessories';
import { AscheFlags } from './asche-flags';
import { AscheScenes } from './asche-scenes';
import { AscheSexScenes } from './asche-sex';

export namespace AscheTasksScenes {
	export function Default() {
		var parse : any = {};
		
		//Play this if the player isn’t eligible for a new task at the moment.
		Text.Clear();
		Text.Add("You ask the jackal-morph shopkeeper if she has anything for you to do.", parse);
		Text.NL();
		Text.Add("<i>“Ah, so adventuring spirit is surging in good customer? Asking shopkeepers and people in bars is time-honored way of receiving important tasks of saving world and such things.”</i>", parse);
		Text.NL();
		Text.Add("That, and being bequeathed tasks by mysterious Goddesses whom you just met moments before.", parse);
		Text.NL();
		Text.Add("<i>“Well, that is being not so common. But still happens, so customer has point.”</i> Asche looks thoughtful for a moment. <i>“Still, Asche is not having anything for you at the moment - she is not wanting other people to be helping with things she can be doing herself, and she is to be avoiding debts if she can help it. Asche is hating being in debt - is possibly one of worst things in world. Maybe to be asking later, yes?”</i>", parse);
		Text.Flush();
		
		AscheScenes.TalkPrompt();
	}

	export namespace Ginseng {
		export function IsEligable() {
			let asche = GAME().asche;
			let rigard = GAME().rigard;
			return asche.flags["Tasks"] < AscheFlags.Tasks.Ginseng_Started &&
				rigard.MagicShop.totalBought >= 500 &&
				GAME().player.level >= 5;
		}
		export function IsOn() {
			let asche = GAME().asche;
			return asche.flags["Tasks"] >= AscheFlags.Tasks.Ginseng_Started &&
				asche.flags["Tasks"] < AscheFlags.Tasks.Ginseng_Finished;
		}
		export function IsFail() {
			let asche = GAME().asche;
			return asche.flags["Tasks"] & AscheFlags.Tasks.Ginseng_Failed;
		}
		export function IsSuccess() {
			let asche = GAME().asche;
			return asche.flags["Tasks"] & AscheFlags.Tasks.Ginseng_Succeeded;
		}
		export function IsCompleted() {
			let asche = GAME().asche;
			return asche.flags["Tasks"] >= AscheFlags.Tasks.Ginseng_Finished;
		}

		//This should have a level requirement such that the PC has a chance at actually beating the enemies involved. Maybe add a money spent or items bought requirement?
		//Maybe a minimum level of 7, the encounter will be 8 or 9.
		export function Initiation() {
			let player = GAME().player;
			let asche = GAME().asche;

			var parse : any = {
				heshe : player.mfFem("he", "she"),
				handsomepretty : player.mfFem("handsome", "pretty")
			};
			
			Text.Clear();
			Text.Add("You ask the jackaless if she has anything that needs doing. To your mild surprise, she actually looks thoughtful for a second or so, then nods.", parse);
			Text.NL();
			Text.Add("<i>“Actually, is something that customer can be doing for Asche, if [heshe] is so desiring. Does customer wish for Asche to say more?”</i>", parse);
			Text.NL();
			Text.Add("Hmm… perhaps you should think about it for a moment… why yes, you’d be interested in hearing about what she has in mind.", parse);
			Text.NL();
			Text.Add("<i>“Customer is to be giving Asche a moment, please.”</i> The jackaless cranes her head this way and that, surveying her shop with the help of several strategically-placed mirrors on the walls. Satisfied that the two of you are alone in the shop, she continues. <i>“Now, to be listening closely. Asche is trying out new recipe she has been working on for some time now, but is needing final ingredient, which is rather special.”</i>", parse);
			Text.NL();
			Text.Add("What is it?", parse);
			Text.NL();
			Text.Add("<i>“Fresh ginseng.”</i>", parse);
			Text.NL();
			Text.Add("That shouldn’t be hard to get in a city like Rigard, should it? There must be any number of herbalists who could get her some.", parse);
			Text.NL();
			Text.Add("<i>“You are not listening closely to what Asche is saying, despite her telling you to,”</i> she chides you, clicking her tongue in reproach. <i>“Asche is needing <b>fresh</b> ginseng. All to be found in the city is either dried or cured in herbal brew to preserve them before they are being sold, since ginseng is coming a long way to city from where it is growing. Is usually not problem when it comes to root’s remedial properties, but when it is coming to being reagent in potion… is making ginseng very much useless.</i>", parse);
			Text.NL();
			Text.Add("<i>“There is also second matter of where to get best specimen that Asche desires - is growing by wooded spring in highland basin. Soil there is heavy with mystical energies which when added to cool climate makes ginseng there grow large and containing much power. Problem is being spring lies on land that is territory of zebras, which have not been on best terms with Asche’s kind for generations.”</i>", parse);
			Text.NL();
			Text.Add("All right, now you’re starting to see where this is going. Nodding, you ask Asche to continue.", parse);
			Text.NL();
			Text.Add("<i>“Asche is but one, no matter how powerful her magic, so maybe going herself and using force is not being best idea. Besides, if Asche is causing trouble at their spring, will only make matters worse between clans. Times like this, is best if outsider is one doing getting, maybe can be talking to shamans and convincing them to give one where jackal like Asche would not be listened to.”</i>", parse);
			Text.NL();
			Text.Add("Yeah, what she says does make sense. A neutral party would stand a better chance at negotiation than one who’s disliked on sight. All right, then: you asked for a task, you got a task. There’s the matter of payment, though…", parse);
			Text.NL();
			Text.Add("The jackaless chuckles. <i>“Well, there are choices customer can be having. First one is that customer can be having money, as is traditional way of rewarding questers. Other way is”</i> - she gazes at you, those lovely, dark eyes seeming to grow as they draw you into their depths - <i>“also very traditional reward, although less spoken of. But yes, Asche can be teaching you some things if that is [handsomepretty] customer’s desire.”</i>", parse);
			Text.NL();
			Text.Add("Got it. You’ll have to make a trip out to the Highlands, then. Where’s this spring that she speaks of?", parse);
			Text.NL();
			Text.Add("<i>“Asche can be giving you directions. To be waiting a moment, please.”</i>", parse);
			Text.NL();
			Text.Add("She’s as good as her word - a few moments later, Asche passes you a small slip of paper with some hastily scribbled directions on it: northwest from a certain crossroads, then west and in that direction until the ravine to the crag which houses the spring comes into sight. The shopkeeper’s handwriting is quite atrocious, but at least it’s not illegible. Well, time to be off to this spring and see what you find there.", parse);
			Text.Flush();
			
			asche.flags["Tasks"] |= AscheFlags.Tasks.Ginseng_Started;
			
			Gui.NextPrompt();
		}

		export function OnTask() {
			let player = GAME().player;

			var parse : any = {
				handsomepretty : player.mfFem("handsome", "pretty")
			};
			
			Text.Clear();
			Text.Add("<i>“Oh? Customer is back already? Surely could not have lost way in Highlands - Asche’s directions are very good. Used to play pranks on stuffy old shamans when Asche was a little girl.”</i>", parse);
			Text.NL();
			Text.Add("You try to imagine the sexy shopkeeper as a little girl - to say that it’s hard would be an understatement of the greatest degree.", parse);
			Text.NL();
			Text.Add("<i>“Nevertheless, potion that is requiring ginseng is very important to Asche, so if [handsomepretty] customer can be hurrying up, she will be most delighted.”</i>", parse);
			Text.Flush();
			
			AscheScenes.TalkPrompt();
		}

		export function Failed() {
			let player = GAME().player;
			let asche = GAME().asche;

			var parse : any = {
				himher : player.mfFem("him", "her")
			};
			
			Text.Clear();
			Text.Add("You hang your head and tell Asche that the shaman and his entourage drove you away from the spring.", parse);
			Text.NL();
			Text.Add("<i>“Oh well,”</i> the jackaless replies, disappointment clear in her voice. <i>“Asche is seeing color of zebra magic on you, so she sees that you at least tried. Maybe she was overestimating customer’s abilities. Perhaps if customer had some of Asche’s stock with [himher], might not have gone so badly… but is over now. Asche supposes she will have to ask someone else to be getting it for her, yes?”</i>", parse);
			Text.Flush();
			
			asche.flags["Tasks"] |= AscheFlags.Tasks.Ginseng_Finished;
		}

		export function Highlands() {
			let player = GAME().player;
			let party : Party = GAME().party;
			let asche = GAME().asche;

			var parse : any = {
				
			};
			
			Text.Clear();
			Text.Add("Remembering Asche’s directions, you step off the main highland path at the crossroads she’d indicated and set off in a northwesterly direction. Crossing the uneven, hilly terrain is far more tiring than following the mountain trails, and it’s not long before you begin to feel the difference in your muscles.", parse);
			Text.NL();
			Text.Add("At least her directions are good: you’ve walked for little more than an hour before you spot the twin moss-covered arches that Asche mentioned, then another hour’s walk west brings the entrance to the ravine into view. As you were told, you see a long, narrow gash in the mountains, as if someone had taken a cleaver and rent a high plateau in two; from where you stand near the bottom, the lower slopes appear thickly forested and the upper slopes strewn with light sprinkles of snow. The woods seem a sanctuary for life in the grass and shrub-dominated Highlands. If that’s what the entrance looks like, surely it must be even lusher further inside…", parse);
			Text.NL();
			parse["footsteps"] = player.HasLegs() ? "footsteps echo" : "passage echoes";
			Text.Add("Cautiously, you enter the ravine, eyes peeled for any sign of the zebra-morphs whose territory this is. Your [footsteps] off the ravine’s towering walls - so high that a narrow slit is all that remains visible of the sky - sounding deafeningly loud to you, yet you attract no attention from anything larger than a few rodents and lizards. The reason for that becomes clear as you near the ravine’s other end: stationed by the entrance - or exit, depending on how you look at it - is a zebra-morph shaman and two savage-looking warriors - you believe you’ve heard such as them referred to as ‘braves’. The marked, hooded robes along with the staff propped up against a rock leave no doubt to the shaman’s identity. Likewise, the braves wear little more than loincloths and have accentuated their natural patterning with streaks and stripes of blue body-paint; the end result is certainly quite fearsome in appearance, especially when one considers their bronze-tipped spears.", parse);
			Text.NL();
			if(WorldTime().IsDay()) {
				Text.Add("Seems like you’ve arrived just in time for food. All three zebras are gathered around a cast-iron pot hanging over a fire pit, one of the braves stirring the stew. Judging by the smell wafting over to you, it’s spiced gruel of some sort.", parse);
				Text.NL();
				Text.Add("Well, it’s probably for the best - while they’re busy cooking is probably the ideal time for getting the drop on them, if you are so inclined.", parse);
			}
			else {
				Text.Add("Seems like you’ve come at a good time. The two warriors are currently fast asleep on thin bedrolls next to a blazing fire pit, leaving the shaman to keep watch. It’s as good a situation as you could hope for sneaking by or getting the jump on them, if you were so minded.", parse);
			}
			Text.NL();
			Text.Add("You weigh your options. How best to proceed?", parse);
			Text.Flush();
			
			//[Approach][Sneak][Fight]
			var options = new Array();
			options.push({ nameStr : "Approach",
				tooltip : "See if you can negotiate with the shamans. Maybe you can come to an agreement of some sort.",
				func : function() {
					Text.Clear();
					Text.Add("Deciding that you should at least try a peaceful way of resolving this conundrum, you call out to the three zebras, holding up your empty hands in the air to signal your intent. They certainly weren’t expecting anyone to come across this place, let alone an outsider like you, and grab their staves, looking quite panicked.", parse);
					Text.NL();
					Text.Add("Seeing that you aren’t threatening, though, they bid you stop a little ways away from them, and the shaman steps forward to greet you. <i>“This basin and its spring have been claimed by the zebra clan, outsider, and are under our jurisdiction. As the land is an important source of remedies for our people, I’m sure you understand why we can’t allow just anyone to enter.”</i>", parse);
					Text.NL();
					Text.Add("So, they’re the guardians of the spring or somesuch?", parse);
					Text.NL();
					Text.Add("<i>“After a fashion. I am guiding new braves from the clan through the final leg of their initiation rites, which requires us to watch over the spring for a year in solitude, eschewing drink, carnal acts, and other such worldly pleasures. Now, outsider, what is your purpose in coming here?”</i>", parse);
					Text.NL();
					Text.Add("You explain that you need a specimen of ginseng from the spring in question in order to make a very important potion for a friend. As you natter on, though, judging by the shaman’s slightly bored expression, you get the impression that your tale of woe probably isn’t going to be enough to convince him to give you goods from his peoples’ sacred grounds. Maybe a little encouragement would be in order to ease things along…", parse);
					Text.Flush();
					
					//[Bribe][Whore]
					var options = new Array();
					options.push({ nameStr : "Bribe",
						tooltip : "See if you can buy off the zebras.",
						func : AscheTasksScenes.Ginseng.Bribe, enabled : true
					});
					options.push({ nameStr : "Whore",
						tooltip : "A whole year of celibacy, huh… they must be pretty pent-up. Maybe you can whore yourself out for a favor.",
						func : AscheTasksScenes.Ginseng.Whore, enabled : true
					});
					Gui.SetButtonsFromList(options, false, null);
				}, enabled : true
			});
			var tooltip = Text.Parse("Try to slip past the zebras and enter the spring basin while they’re [day].", {day: WorldTime().IsDay() ? "distracted" : "out of it"});
			options.push({ nameStr : "Sneak",
				tooltip : tooltip,
				func : function() {
					// Make a dex check. If success, PC sneaks by and digs one up, else, fail and fight.
					
					var dex = Math.floor(player.Dex() + Math.random() * 20);
					
					Text.Clear();
					Text.Add("Steeling yourself, you try to plot a path into the basin that’ll get you around the zebras encamped out front - the ravine walls are thickly wooded, and if you climbed high enough and stuck close to the trees, you might be able to get through unseen. It’s as good a plan as any; sticking to the path at the bottom isn’t an option, at any rate. ", parse);
					Text.NL();
					Text.Add("Gritting your teeth, you begin the ascent, trying to gain some height on the steep walls; hopefully the vegetation will break your fall if you happen to tumble. It feels like it takes forever, but you manage to climb to a decent height - about four stories above the ravine floor - and finally begin the task of edging your way through the vegetation and around the small encampment.", parse);
					Text.NL();
					
					var goal = 40;
					
					if(GetDEBUG()) {
						Text.Add("Dex check: [dex] (vs [goal])", {dex: dex, goal: goal}, 'bold');
						Text.NL();
					}
					if(dex >= goal) {
						var day = WorldTime().IsDay();
						parse["day1"] = day ? "the zebras are too focused on their fire to look up" : "the weary zebra shaman doesn’t lift his eyes from the path in front of his post";
						parse["day2"] = day ? "" : ", thanks to the bright moon";
						parse["day3"] = day ? "the shaman and his companions haven’t moved from their fire, and don’t even look up as you slip by them" : "the only thing you hear from the braves is their snores, and the shaman looks on the verge of joining them, letting you slip by easily";
						Text.Add("By good fortune, [day1]. While there are a few close moments, you manage to slip past them and into the basin without causing any more noise than the wind through the trees. You carefully descend the ravine walls and take a moment to soothe your aching limbs before heading out in search of what you came here for.", parse);
						Text.NL();
						Text.Add("The search is quick[day2]: the broad-leaved trees surrounding the clear spring have quite a bit of vegetation surrounding them, and it’s clear that the zebras take considerable care of their sacred grounds, tending to the underbrush and making sure the medicinal plants that grow naturally here aren’t overcrowded. With the same luck that carried you into the basin, you manage to find a decent-looking specimen of ginseng within a half-hour, and dig it out of the earth - root, stem and all - before stowing it away with your other possessions. Your departure is as smooth as your entrance - [day3] and head back through the ravine.", parse);
						Text.NL();
						Text.Add("All right, now to head back to Asche posthaste - you don’t want to risk the ginseng getting stale and having to head all the way back out here again, do you?", parse);
						Text.Flush();
						
						party.Inv().AddItem(QuestItems.Ginseng);
						TimeStep({hour: 1});
						
						asche.flags["Tasks"] |= AscheFlags.Tasks.Ginseng_Succeeded;
						
						Gui.NextPrompt();
					}
					else { //Fail
						Text.Add("For a moment, everything looks like it’s going smoothly, then you bump into a fist-sized pebble, sending it careening down the steep ravine slope. That in turn knocks into another, rattling down the thin grass and roots, and another, and another, until a small shower of pebbles, leaves and loose dirt comes cascading down to the ravine floor.", parse);
						Text.NL();
						Text.Add("So much for stealth! A shout comes up, directed at you - down below, the shaman and his companions are already on their feet, having seized their staff and spears. Scowling in frustration, you narrowly dodge a few beams of magic aimed your way, and slide down the ravine to do battle.", parse);
						Text.Flush();
						
						AscheTasksScenes.Ginseng.Fight();
					}
				}, enabled : true
			});
			options.push({ nameStr : "Fight",
				tooltip : "Since you have the initiative, it’s probably best to get the jump on them while you can.",
				func : function() {
					Text.Clear();
					var day = WorldTime().IsDay();
					Text.Add("You decide that force is probably going to be the easiest solution to this quandary, and prepare to do battle. It might cause problems for Asche to march in and start bashing skulls, but you’re a filthy, filthy outsider and you doing so probably won’t cause much of a stir.", parse);
					Text.NL();
					if(day)
						Text.Add("Preoccupied as they are, it’s not too hard to get the drop on the zebras guarding the basin’s entrance. They certainly look surprised enough when you come charging into their camp, scrambling for their gear and putting up a hasty defense.", parse);
					else
						Text.Add("You rush straight for the shaman, who visibly shakes himself to alertness and, his eyes widening, screams for the braves to assist him. The two jolt awake, but still look groggy as they scramble for their spears.", parse);
					Text.Add(" Best to press your advantage while you still have it.", parse);
					Text.Flush();
					
					AscheTasksScenes.Ginseng.Fight();
				}, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		}

		export function Fight() {
			var enemy = new Party();
			enemy.AddMember(new ZebraShaman(2));
			enemy.AddMember(new ZebraBrave(2));
			enemy.AddMember(new ZebraBrave(2));
			var enc = new Encounter(enemy);
			
			enc.canRun = false;
			enc.onLoss = AscheTasksScenes.Ginseng.FightLoss;
			enc.onVictory = AscheTasksScenes.Ginseng.FightWin;
			
			Gui.NextPrompt(function() {
				enc.Start();
			});
		}

		export function Bribe() {
			let party : Party = GAME().party;
			let asche = GAME().asche;

			var parse : any = {
				
			};
			
			Text.Clear();
			Text.Add("Pulling out your coin purse, you shake it around a little in front of the shaman, making sure its contents jingle around as enticingly as you can make them. Doing your best to speak in a calm and unhurried fashion, you explain that you have no intention of trespassing on the zebras’ lands, but you’d be very grateful if they could spare some of their local produce - just one specimen of ginseng freshly dug up from the earth should do. That can’t be too much to ask, can it? Surely there’s enough to go around?", parse);
			Text.NL();
			Text.Add("Hearing your offer, shaman and braves alike glance at each other. <i>“Bide a moment, please. We must confer amongst ourselves.”</i>", parse);
			Text.NL();
			Text.Add("Why, sure. They can take all the time they need - it’s not as if anyone’s slated to go anywhere, right? The zebras huddle together in a tight circle, murmuring and whispering for a few minutes, then the shaman breaks away and returns to you, clearing his throat.", parse);
			Text.NL();
			Text.Add("<i>“Well, it <b>has</b> been a good year for the harvesting of various herbs and roots from the spring, outsider. We’re willing to let you have what you seek in exchange for the modest sum of three hundred and fifty coins - you see, we’ll still need to convince the elders that this was a good decision, and you don’t seem like the type who lacks for money.”</i>", parse);
			Text.NL();
			Text.Add("Three hundred and fifty?", parse);
			Text.NL();
			Text.Add("A nod. <i>“No more, no less.”</i>", parse);
			Text.NL();
			Text.Add("Hmm. Seems like they aren’t going to entertain any haggling on your part. What are you going to do here?", parse);
			Text.Flush();
			
			//[Pay][Whore][Fight]
			var options = new Array();
			options.push({ nameStr : "Pay",
				tooltip : "Pay what they want and be done with it.",
				func : function() {
					Text.Clear();
					party.coin -= 350;
					Text.Add("You wanted to buy them off, so you’ll buy them off all right. Digging into your coin pouch, you draw out the requisite amount of money and pass it into the shaman’s waiting hand. Once he’s done counting the payment, he gives the fellows behind him a nod.", parse);
					Text.NL();
					Text.Add("<i>“Go dig up one of the roots by the lakeshore for the outsider here. Those from the zebra clan honor their agreements.”</i>", parse);
					Text.NL();
					Text.Add("The two of them take off at a run, and you wait with the shaman for perhaps half an hour before they return, bearing a large, forked root, with the rest of the plant and plenty of dirt still attached. They don’t get any fresher than that - though there’s little doubt in your mind that they haven’t given you the best of their lot. Wonder how large their prize specimens of ginseng must be… but Asche said nothing about needing a specific size. Carefully, you put away the root and thank the zebra-morphs.", parse);
					Text.NL();
					Text.Add("<i>“We’re a very reasonable people. I’m glad that we came to a mutual understanding, although do keep in mind that an outsider shouldn’t expect to get something every time one turns up. Most of the remedies that grow here are for our own use.”</i>", parse);
					Text.NL();
					Text.Add("Either way, you got what you wanted, and they got what they wanted. Sounds like a good deal. As you’re walking away, though, you overhear snatches of conversation from the apprentice shamans:", parse);
					Text.NL();
					Text.Add("<i>“The outsider actually paid <b>that</b> much for that ginseng? I can’t believe it!”</i>", parse);
					Text.NL();
					Text.Add("<i>“Lowlanders are swimming in money - remember that they aren’t the kind to get only one traveling merchant once a month. With this much dough, we can definitely afford to buy some things for the clan the next time one comes around.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Still…”</i>", parse);
					Text.Flush();
					
					party.Inv().AddItem(QuestItems.Ginseng);
					TimeStep({hour: 1});
					
					asche.flags["Tasks"] |= AscheFlags.Tasks.Ginseng_Succeeded;
					
					Gui.NextPrompt();
				}, enabled : party.coin >= 350
			});
			options.push({ nameStr : "Whore",
				tooltip : "Hmm, maybe they’re willing to accept another price…",
				func : AscheTasksScenes.Ginseng.Whore, enabled : true
			});
			options.push({ nameStr : "Fight",
				tooltip : "Screw this - enough talk! Have at them!",
				func : function() {
					Text.Clear();
					Text.Add("Either you’re unwilling or unable to pay the price - it doesn’t matter in the end, does it? Lunging at the shaman with a growl, you tackle him to the ground even as his fellows grab their spears and run to his aid.", parse);
					Text.NL();
					Text.Add("It’s a fight!", parse);
					Text.Flush();
					
					AscheTasksScenes.Ginseng.Fight();
				}, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		}


		export function Whore() {
			let player = GAME().player;
			let party : Party = GAME().party;
			let asche = GAME().asche;

			var parse : any = {
				
			};
			parse = player.ParserTags(parse);
			
			Text.Clear();
			if(player.Gender() == Gender.female && player.Femininity() >= 0) {
				Text.Add("The shaman fidgets uncomfortably at your suggestion and swallows hard. <i>“I… you can’t mean to...”</i>", parse);
				Text.NL();
				Text.Add("Oh? You run your hands across your [skin], lingering over your [breasts] and [butt], then grin at him - and at the bulge on his loincloth, growing by the moment. Who says you can’t?", parse);
				Text.NL();
				Text.Add("<i>“T-the discipline involved in shamanistic rituals requires—”</i>", parse);
				Text.NL();
				Text.Add("<i>“Hey, that’s a fine piece of ass over there,”</i> one of the braves pipes up from behind him. <i>“Best to not let such a treasure get away. If you don’t want it, I’ll be more than willing to take it off your hands.”</i>", parse);
				Text.NL();
				Text.Add("<i>“What the fuck! You can’t be serious!”</i>", parse);
				Text.NL();
				Text.Add("<i>“I am. I mean, we’re all the way out here, and we all know that there’s no actual way to tell whether we’ve been fucking around or not, <b>and</b> you know better than most that it doesn’t matter when it comes to the mystical component of the rites. I don’t know about you, but ten months into this thing, I’m pretty much at my limit. So, I’ll say it again: if you don’t want that fine piece of ass, suit yourself, but one of the roots we dug up yesterday’s a small price to pay from where I’m standing.”</i>", parse);
				Text.NL();
				Text.Add("You lower your voice to a low, sultry whisper and tell the shaman that his companions are right. A good romp for a silly root is the most worthwhile of trades and a good deal for all involved. What’s the problem?", parse);
				Text.NL();
				Text.Add("The shaman looks from you to his fellows a few times. Back and forth, back and forth, back and forth - his loincloth is unable to hide the raging hard-on he’s sporting, and you can already see more than a foot of meaty equine member jutting from underneath.", parse);
				Text.NL();
				Text.Add("<i>“Hey, we can always say that the outsider seduced us, and that we were helpless against her wiles. Everyone knows that outsiders are loose like that - even worse than the jackal-morphs..”</i>", parse);
				Text.NL();
				Text.Add("That semblance of an excuse is apparently enough to push him over the edge. <i>“Oh, all right! Fine! Fine! You’ve got yourself a deal!”</i>", parse);
				Text.NL();
				Text.Add("He might have talked a good game, but the shaman sure is quick when it comes to divesting himself of his robe and loincloth, practically tearing them off his needy body and letting them fall to the ground where they may. At least his staff gets marginally better treatment, with him leaning it against a nearby boulder before getting down to business. The zebra braves are less reserved in their eagerness, letting their spears clatter to the ground as they come charging up, eager to get their piece of tail.", parse);
				Text.NL();
				Text.Add("Oh yes, your body is ready for this. So very, very ready for this. Not that they’re checking, as the sight of three foot-long equine penises in varying degrees of erection says you’d better be, whether you like it or not.", parse);
				Text.NL();
				Text.Add("Grabbing you and hoisting you off your feet, the zebras waste no time in stripping off your clothes until you’re as buck naked as they are, tossing your possessions to the side in the most unceremonious fashion. Without further ado, they dump you on your back, and get straight down to it. The zebras’ rough, potent musk speaks volumes about what’s going through their minds now that the opportunity has presented itself. Rutting, urgency, heat, release—", parse);
				Text.NL();
				Text.Add("Your thoughts are cut short by the shaman yanking your legs apart. There’s a brief burst of sensation as he lines up that throbbing, veined horsecock with your [vag], then pain as he begins to violate you, pounding like a maddened beast with months’ and months’ worth of pent-up sexual frustration. Ignoring your predicament, the first brave in line yanks your head back and forces his massive shaft down your throat.", parse);
				Text.NL();
				
				var zebra = new ZebraShaman();
				
				Sex.Vaginal(zebra, player);
				player.FuckVag(player.FirstVag(), zebra.FirstCock(), 4);
				zebra.Fuck(zebra.FirstCock(), 4);
				
				Text.Add("Your gag reflex protests for a fraction of a second, then is overwhelmed by the sheer amount of dick invading your throat, leaving you barely able to breathe. That’s two, with one more to go - a tiny voice in the back of your mind wonders if whoring yourself out to three horny zebras was the best of ideas. Too late for regrets now, though - you doubt that they’d be able to stop even if they had a mind to do so.", parse);
				Text.NL();
				Text.Add("Now that they’re in position, the shaman and brave begin to pump and thrust away - slowly at first as they get used to stuffing your body, then faster and faster as they throw caution to the wind in their rush to slake their desires. Working in tandem to spit roast you, one thrusting while the other withdraws, they grunt and growl like savage animals tearing at a particularly tasty piece of raw meat. That isn’t too far off the mark, too, considering how thoroughly violated you’re currently being, turned into little more than a set of warm, wet holes for the zebras to fill.", parse);
				Text.NL();
				Text.Add("A moist friction across your [breasts] draws what little attention you have remaining to the third and final zebra - bereft of a good position to get himself off on your breasts, the poor fellow is grinding his equine cock against your [nips], making do with the crumbs that fall from the table of his fellows. ", parse);
				if(player.FirstBreastRow().Size() > 12) {
					Text.Add("With how busty you are, you nevertheless give him a fair deal of pleasure, the brave using your ample melons as best as he can. The feeling of your [breasts] jiggling against his hot, throbbing cock only completes the perfect picture of being filled and used from all directions, with your body working overtime to pleasure all three hungering beasts at once.", parse);
				}
				else {
					Text.Add("He seems like such a poor thing, what with your [breasts] being too small to accommodate him properly, that you do your best to reach out for his cock and take its slick, pulsating length in hand, your fingers encircling it before you begin to stroke him off. The poor sop quivers in delight, and you feel his pre running down the length of his shaft and slopping onto your fingers. Wow, talk about repressed.", parse);
				}
				Text.NL();
				Text.Add("You yourself lose all sense of time or place, fucked thoroughly into submission like the whore you presented yourself as - up to the point where, by some perverse coincidence, each and every one of the trio violating you decides to orgasm at the same time. You twist and writhe on the ground, filled up in front and back alike by the zebras’ baby batter, with even more of it slopping over your [breasts] and running down your torso as the third zebra blasts great gouts of hot seed to paint your [skin], making you thoroughly used inside and out.", parse);
				Text.NL();
				
				ZebraShamanScenes.Impregnate(player, zebra);
				
				var cum = player.OrgasmCum();
				
				Text.Add("Hell, you don’t even remember if you came yourself. What you <i>do</i> remember, though, is all of them pulling out of and away from you, finally having had some relief for their… ah, aches and pains. You’re dropped in the most ignoble fashion in the puddle of cum you helped with creating, trickles of the sticky fluid running from your mouth and cunt.", parse);
				Text.NL();
				Text.Add("<i>“Spirits above, that was great,”</i> one of them moans, his voice barely more than an exhausted whisper. <i>“Anything’s bound to taste fucking great to the starving.”</i>", parse);
				Text.NL();
				Text.Add("The only replies he gets are pants and moans.", parse);
				Text.NL();
				Text.Add("<i>“Hey, you there. If you’re still alive after that, that is?”</i> He has to pause to catch his breath. <i>“We went flower picking yesterday - what a coincidence. Why don’t you just help yourself? I don’t think we’ll be up for doing much for a bit… anyways, left the baskets in the back of the spring grotto-”</i> his voice trails off, to be replaced by a snore.", parse);
				Text.NL();
				Text.Add("You’ll get what you came for… eventually. Or at least, when you can breathe a little better and your limbs actually work right. For now, sleep seems like the best option…", parse);
				Text.Flush();
				
				party.Inv().AddItem(QuestItems.Ginseng);
				TimeStep({hour: 4});

				asche.flags["Tasks"] |= AscheFlags.Tasks.Ginseng_Succeeded;

				Gui.NextPrompt();
			}
			else {
				Text.Add("The shaman raises an eyebrow at your suggestion. <i>“I don’t swing that way. I mean, sure, I’m a bit desperate - we all are, but we’ve been trained, <b>and</b> if it really came to that, we’d have buggered each other by now instead of waiting for an outsider to come along and make the offer. Sorry, no-go.”</i>", parse);
				Text.NL();
				Text.Add("Seems like they aren’t too interested in the offer; different strokes for different folks, as the saying goes, and you just didn’t have what they were interested in. What do you do now?", parse);
				Text.Flush();
				
				//[Bribe][Fight]
				var options = new Array();
				options.push({ nameStr : "Bribe",
					tooltip : "If sex won’t sway them, maybe money will…",
					func : AscheTasksScenes.Ginseng.Bribe, enabled : true
				});
				options.push({ nameStr : "Fight",
					tooltip : "Screw this (well, not literally), enough talk! Have at them!",
					func : function() {
						Text.Clear();
						Text.Add("They dare reject your advances? Fie! Lunging at the shaman with a growl, you tackle him to the ground even as his fellows grab their staves and run to his aid.", parse);
						Text.NL();
						Text.Add("It’s a fight!", parse);
						Text.Flush();
						
						AscheTasksScenes.Ginseng.Fight();
					}, enabled : true
				});
				Gui.SetButtonsFromList(options, false, null);
			}
		}

		export function FightWin() {
			let party : Party = GAME().party;
			let asche = GAME().asche;

			var enc = this;
			SetGameState(GameState.Event, Gui);
			
			var parse : any = {
				
			};
			
			Gui.Callstack.push(function() {
				var day = WorldTime().IsDay()
				
				parse["day"] = day ? "" : " thanks to the bright moon";
				Text.Clear();
				Text.Add("The deed’s done - the shaman and braves have been knocked out cold, with various cuts and scrapes on their persons - well, cuts and scrapes might be a little understating the matter, but they’ll live. If the shaman’s any good at his job, he’ll patch all of them up just fine. Leaving their unconscious forms behind you, you head into the spring basin to go flower picking.", parse);
				Text.NL();
				Text.Add("The search is quick[day]: the broad-leafed trees surrounding the clear spring have quite a bit of vegetation surrounding them, and it’s clear that the zebras take considerable care of their sacred grounds, tending to the underbrush and making sure the medicinal plants that grow naturally here aren’t overcrowded.", parse);
				Text.NL();
				Text.Add("Today must be your day; you manage to find a decent-looking specimen of ginseng within the half-hour, and dig it out of the earth, root, stem and all. Stowing it away in a sac with your other possessions, you make your escape before the zebras come to, hurrying through the ravine and back to the crossroads with all due haste.", parse);
				Text.Flush();
				
				party.Inv().AddItem(QuestItems.Ginseng);

				asche.flags["Tasks"] |= AscheFlags.Tasks.Ginseng_Succeeded;
				
				Gui.NextPrompt();
			});
			Encounter.prototype.onVictory.call(enc);
		}

		export function FightLoss() {
			let party : Party = GAME().party;
			let asche = GAME().asche;

			var enc = this;
			SetGameState(GameState.Event, Gui);
			
			var parse : any = {
				
			};
			
			Text.Clear();
			Text.Add("Ugh. This isn’t going quite as you planned - maybe Asche wasn’t wrong about violence not being the optimal choice, but it’s a little too late for second thoughts now. You’re trying to decide whether it would be better to disengage or see this through to the bitter end when something hard and heavy connects with the side of your head, knocking you unconscious.", parse);
			Text.NL();
			parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
			parse["c"] = party.Num() > 1 ? Text.Parse(", [comp] by your side and still out cold", parse) : "";
			Text.Add("You come to some time later face-down in the dirt[c]. That, and the fact that your coin purse is missing, are the only signs that the altercation ever took place - you search around for a bit, and discover that the ravine entrance has been quite thoroughly sealed with fresh-laid stone, no doubt placed there with the shaman’s magic. Seems like the zebras are <i>really</i> determined not to have you back.", parse);
			Text.NL();
			Text.Add("There’s not much you can do now but to head back to Asche and tell the jackaless you failed.", parse);
			Text.Flush();
			
			asche.flags["Tasks"] |= AscheFlags.Tasks.Ginseng_Failed;
			
			Gui.NextPrompt();
		}

		export function Complete() {
			let player = GAME().player;
			let party : Party = GAME().party;
			let asche = GAME().asche;

			var parse : any = {
				himher : player.mfFem("him", "her"),
				hisher : player.mfFem("his", "her"),
				heshe : player.mfFem("he", "she"),
				handsomepretty : player.mfFem("handsome", "pretty")
			};
			
			Text.Clear();
			party.Inv().RemoveItem(QuestItems.Ginseng);
			
			asche.flags["Tasks"] |= AscheFlags.Tasks.Ginseng_Finished;
			
			Text.Add("<i>“Ah! You are having fresh ginseng?”</i>", parse);
			Text.NL();
			Text.Add("Indeed, you do - drawing it out, you wave the long, branched root in front of her like a doggy treat, with much the same effect until the jackaless calms herself.", parse);
			Text.NL();
			Text.Add("<i>“Asche is sorry for reaction, but she is so very excited.”</i> She sniffs the air. <i>“Ginseng is a bit stale, but is still far better than usual dried or cured things that are spending hours in dark, damp warehouses. Now, please to be giving it to Asche so she can finally finish potion.”</i>", parse);
			Text.NL();
			Text.Add("You hand over the root, and watch as Asche brings it over to her alchemy workspace. Producing a cutting board and knife from a nearby drawer, she cuts off a slice from the top and mutters to herself as she pounds away with mortar and pestle, reducing the slice to a thick paste.", parse);
			Text.NL();
			Text.Add("<i>“Must be properly preserving the rest of this, far too much to let go to waste. Would be far more effective if boiled forty times until turning into syrup, but no time… maybe later. Everything is almost ready… perhaps is better if Asche closed the shop, Asche doesn’t need other customers walking in during delicate process. Would nice customer be so kind as to lock front door and turn sign over?”</i>", parse);
			Text.NL();
			Text.Add("Her request is reasonable enough, and you cross the shop to do just that, the latch setting in place with a satisfying click. By the time you get back, Asche already has a flask full of clear liquid bubbling over a burner, and the jackaless is measuring out the ginseng paste into it with a tiny teaspoon. Once she’s done, she picks up the flask and swirls the heated liquid inside a few times, mixing it evenly before setting it down on the bench to cool.", parse);
			Text.NL();
			Text.Add("You can’t help but ask what she’s making.", parse);
			Text.NL();
			Text.Add("<i>“Well, customer did bring final ingredient for Asche, so maybe she can be telling [himher]. Is improvement on old recipe which has kept Asche very pretty over the years, as well as in quite a bit of money. Asche has been very careful in modifying recipe, has done many experiments, and now she is almost done; ginseng should solve problem she was having.</i>", parse);
			Text.NL();
			Text.Add("<i>“Now,”</i> the jackaless says, a coy smile dancing on her lips, <i>“We are now discovering results.”</i>", parse);
			Text.NL();
			Text.Add("Saying that, she tips the flask’s contents into her mouth and swallows.", parse);
			Text.NL();
			Text.Add("<i>“Mm.”</i> Asche smacks her lips, fully aware that you’re watching her. <i>“Maybe is tasting too bitter, could use some spice, but taste is not main purpose of - <b>o-oh</b>.”</i>", parse);
			Text.NL();
			Text.Add("Hastily setting down the beaker lest she drop it, the jackaless moans and yips softly, rubbing her body through the fabric of her sari. The reason for her apparent arousal is soon apparent: her figure is changing, subtly but visibly - Asche was already quite the exotic specimen, but the potion is making her even more remarkable. The changes sweep through her from head to toe - you can see the jackaless’ chest fill out and perk up before your eyes, her full and firm milk makers pushing out against the front of her pure white sari. What little fat there was melts from her slender midriff and flows into her ass, leaving her filigree chain hanging loose on her broadened hips while her buttcheeks plump out and become more shapely.", parse);
			Text.NL();
			Text.Add("The changes don’t stop there, of course. Even her face isn’t left untouched - again, the individual changes are slight, but the combination of the jackaless’ fuller lips, generous eyelashes and shapelier face and svelte jaw is practically astounding now. Her golden-brown fur has gained even more of a delicious, lustrous shine to it, and she takes clear pleasure in running her hands through her fine coat.", parse);
			Text.NL();
			Text.Add("<i>“Well, well,”</i> Asche pants, the jackaless’ breasts heaving with each heavy breath she draws. Reaching beneath the counter - how is there space for everything she must keep there? - she brings out a small mirror and admires herself, clearly pleased with the results. <i>“New version of recipe was more effective than Asche had hoped for. Maybe she used too much mandrake root. Perhaps shall be only giving in small doses, yes? Still want users to be recognising themselves afterwards - and not jumping bones of nearest thing they are seeing, of course. Point of potion is to give subtle, rich beauty, not to turn drinker into bimbo.</i>", parse);
			Text.NL();
			Text.Add("<i>“Now, Asche thinks that good customer has earned something extra as reward for such astounding success,”</i> the jackaless practically purrs, composing herself somewhat despite her obvious arousal before turning to you. <i>“Asche shall not ask again, as she does not like owing favors or debts, so offer only stands now. One-time deal for [handsomepretty] here, yes? Does customer wish to take up offer?”</i>", parse);
			Text.NL();
			Text.Add("It’s clear what the alluring shopkeeper means by that…", parse);
			Text.Flush();
			
			//[Yes][No]
			var options = new Array();
			options.push({ nameStr : "Yes",
				tooltip : "Why not? The mystical shopkeeper is definitely willing and able.",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Ah, [handsomepretty] customer most certainly has good taste.”</i> A sly grin spreads Asche’s muzzle, widening with each step she takes towards you. <i>“This jackal-morph shall be showing you to the back room now, yes? Asche is a bit too shy to be doing funny business in storefront.”</i>", parse);
					Text.NL();
					Text.Add("Well, if it’ll set her mind at ease.", parse);
					Text.NL();
					Text.Add("With the shop properly closed up, you follow the jackaless as she pushes open a door in the back of the shop and invites you in. Asche’s sleeping quarters are modest but clean: woven reed mats cover much of the wooden floor, supporting a low table on which a small tea set has been neatly arranged. The cups seem to be as much for decoration as for practical purposes, judging by their perfect placement. The jasmine and incense of the shop have been replaced with a refreshing mint smell that emanates from a potpourri diffuser in a corner, and the entire room is lit with a soft light coming from a crystal in one corner.", parse);
					Text.NL();
					Text.Add("Naturally, your attention is drawn to the jackaless’ bed: a comfortable-looking mattress laid out on the floor, strewn with a number of plump cushions. The fabric gleams, completely unlike anything you’ve ever seen before; you can’t help but marvel at its beautiful strangeness. Maybe it came from another plane?", parse);
					Text.NL();
					Text.Add("<i>“Just to be taking a moment while Asche prepares things.”</i> You turn at Asche’s voice to find the jackaless slowly divesting herself of her clothing, reveling in the fact that you’re watching her every movement. Her shawl is the first thing to go, dirty-blond hair spilling out in a long ponytail that reaches the small of her back as she pulls the pure fabric from her head and shoulders. Another deft movement of her fingers has her hair untied, and it billows out in a rich fan, finally free of its constraints.", parse);
					Text.NL();
					Text.Add("<i>“Customer is liking what [heshe] is seeing? But this is only beginning.”</i>", parse);
					Text.NL();
					Text.Add("Her tongue playing across her lips and muzzle, the jackaless begins to disrobe herself, inch after inch of snow-white cloth peeling away to unveil more and more of that dark golden fur. It’s almost like watching a ball of yarn unravel itself - no, a silken cocoon from which the butterfly you helped create is emerging. You soon realize that Asche wears neither panties nor bra, treating you to the unadulterated sight of her ripe, juicy breasts hanging softly from her chest, nipples already stiff and jutting through her fur, just begging to be teased. Or maybe you’d like to start with her blatant mound, her pussy lips thick and swollen with heat…", parse);
					Text.NL();
					Text.Add("Asche hangs her clothes up on a hook on the wall, then saunters towards you, flared hips sashaying and jewelery clinking with every step. Does she know how to dance as well? Your thoughts are cut short by soft, seductive words as she places her hands on your chest. <i>“Perhaps it is time brave customer removes clothes before [heshe] embarrasses [himher]self, hmm?”</i>", parse);
					Text.NL();
					Text.Add("Oh, right. You quickly strip yourself down until you’re as naked as she is, then she bids you lie down on the mattress while she produces a small pot of gold-colored ointment. You can smell the jackaless’ light, slightly musky scent, and the way it melds with the mint perfume of the room is arousing, to say the least.", parse);
					Text.NL();
					Text.Add("<i>“Asche shall now paint herself and customer with special concoction to help [himher] better feel and understand sensations,”</i> the jackaless explains as she unscrews the lid of the ointment pot. <i>“Ingredients of ointment are important, but so is pattern; mistake means it is not working, or worse, not having intended effect. To be observing closely.”</i>", parse);
					Text.NL();
					parse = player.ParserTags(parse);
					var gen = "";
					if(player.FirstCock()) gen += " [cocks] stiffening";
					if(player.FirstCock() && player.FirstVag()) gen += " and your";
					if(player.FirstVag()) gen += " [vag] growing damp";
					parse["gen"] = Text.Parse(gen, parse);
					Text.Add("With that, she reaches into the pot and scoops out a fingerful of ointment, carefully tracing it about her eyes. Done with herself, she does the same for you, and so it goes, a bright golden pattern slowly taking shape across her burnished fur and your [skin], an intricate construction of swirls and waves, with hardly a single straight line to be found. The ointment glistens and glimmers in the muted light, her touch sending sparks dancing across your being. You can’t help but wriggle under the jackaless in response to her ministrations, your[gen].", parse);
					Text.NL();
					Text.Add("<i>“To be relaxing, [handsomepretty] one. Not needing to be so tense,”</i> Asche whispers as she smears more golden ointment across your [skin]. The pattern she’s creating is now radiating outwards from the initial swirls she’s drawn on your body, branching towards your arms and [legs] like the limbs of a tree, warm and cool to the touch at the same time regardless of how contradictory that sounds. At last, though, she’s done, and sets the pot down on the table before beaming at you. <i>“Asche can give you so many gifts, teach you so many things… customer will not be regretting it.</i>", parse);
					Text.NL();
					Text.Add("<i>“Now, what kind of lesson would customer like for [hisher] reward?”</i>", parse);
					Text.Flush();
					
					AscheSexScenes.Prompt();
				}, enabled : true
			});
			options.push({ nameStr : "No",
				tooltip : "As exotically alluring as Asche is, you have better things to do. You’ll have the money that was promised.",
				func : function() {
					Text.Clear();
					Text.Add("You shake your head. While Asche is a very lovely jackaless in that sari and shawl of hers, you just don’t feel up to the task. You do your best to decline the offer with as much tact as you can muster.", parse);
					Text.NL();
					Text.Add("<i>“Why, customer is not wishing to enter back room with Asche?”</i> She sets her gaze loose upon your body, and runs her tongue across her muzzle with slow deliberation, finishing up with a smack of her full, rich lips. <i>“Customer has excellent self-restraint, and Asche congratulates [himher]. It will be serving you well in adventures, yes yes. Well then, if customer insists, [heshe] can be having the money.”</i>", parse);
					Text.NL();
					Text.Add("With that, the jackaless pulls out a coin purse from the folds of her sari and sets it on the counter with a satisfying clink. As you scoop up your well-deserved reward, she shakes her head and grins slyly. <i>“Asche is hoping that customer is making right choice and does not regret it later. To be having good day, then.”</i>", parse);Text.NL();
					
					var coin = 500;
					
					party.coin += coin;
					Text.Add("You recieved [coin] coins.", {coin: Text.NumToText(coin)}, 'bold');
					Text.Flush();
					
					_.each(party.members, function(member) {
						member.AddExp(25);
					});
					
					Gui.NextPrompt();
				}, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		}

	}


	//
	// Second Quest (Nightshade)
	//
	export namespace Nightshade {
		export function IsEligable() {
			let asche = GAME().asche;
			let rigard = GAME().rigard;
			return asche.flags["Tasks"] < AscheFlags.Tasks.Nightshade_Started &&
				rigard.MagicShop.totalBought >= 1000 &&
				GAME().player.level >= 8;
		}
		export function IsOn() {
			let asche = GAME().asche;
			return asche.flags["Tasks"] >= AscheFlags.Tasks.Nightshade_Started &&
				asche.flags["Tasks"] < AscheFlags.Tasks.Nightshade_Finished;
		}
		export function IsSuccess() {
			let asche = GAME().asche;
			return asche.flags["Tasks"] & AscheFlags.Tasks.Nightshade_Succeeded;
		}
		export function HasHelpFromAquilius() {
			let asche = GAME().asche;
			return asche.flags["Tasks"] & AscheFlags.Tasks.Nightshade_Aquilius;
		}
		export function IsCompleted() {
			let asche = GAME().asche;
			return asche.flags["Tasks"] >= AscheFlags.Tasks.Nightshade_Finished;
		}


		//The player should have resolved the first quest, be at an appropriate level, and perhaps have spent x amount of money or bought so many items from Asche before this unlocks.
		export function Initiation() {
			let player = GAME().player;
			let asche = GAME().asche;

			var parse : any = {
				heshe : player.mfFem("he", "she")
			};
			
			Text.Clear();
			Text.Add("<i>“Yes, there is being new task that customer can be doing for Asche, since [heshe] is being nice enough to ask. Asche has just received new special order for candle to be warding off evil. Seems like rich man is being worried that business rival may be trying to be cursing him, so has asked Asche for help in countering black magic. Asche has seen the site, and there is indeed black magic at work - is small thing to remove, but place is needing protections as Asche cannot be there all day, can she?</i>", parse);
			Text.NL();
			Text.Add("<i>“For this, amidst other components of spell, Asche is requiring deadly nightshade plant. All parts are okay, but root is being most concentrated; nevertheless, is best to dig up whole plant and be giving it to Asche. Nightshade is being representing harm and death in highland folk magic, and while is most often being used to invoke such evil, can also be used to ward off such.”</i>", parse);
			Text.NL();
			Text.Add("All right, so Asche wants you to go flower-picking - sounds like a straightforward enough deal. While you’re out there, though, surely there’s some other reason that she isn’t doing it herself?", parse);
			Text.NL();
			Text.Add("The jackaless grins. <i>“While good customer is being in forest looking for herb, Asche is preparing to close up shop and make small trip to Boneyard to gather specimens of dragon bone. When ground into meal to release energies, ancient bones of mighty dragons can be giving spell lasting power it is needing to ward off evil. All ingredients are needing to be mixed at same time, so unless customer is willing to make trip into the Boneyard, Asche is suggesting [heshe] be looking for herbs instead.”</i>", parse);
			Text.NL();
			Text.Add("Yes, you can see her point. The forest it is, then. Are there any particular spots you should be looking in, or should you just wander about until you happen to bump into the plant?", parse);
			Text.NL();
			Text.Add("<i>“Asche is not being sure whether customer is joking with her,”</i> the jackaless replies. <i>“But she will answer anyway. It has been some time since this jackaless has been in forest, so while she can tell you general area, details are up to customer to find, yes? Nightshade plant is being growing in deep reaches of forest. Well, not too deep, but is still dangerous enough that is not walk in park. Rest, though, is up to customer, although Asche is sure that person of customer’s resourcefulness will be having no problem. Maybe to be asking locals about it, if is concern.”</i>", parse);
			Text.NL();
			Text.Add("Is she trying to flatter you? As you look at her, Asche merrily returns your gaze with a smile and arch of her eyebrows, leaning lazily on the countertop. Seems like you’re not getting <i>that</i> much out of her.", parse);
			Text.NL();
			Text.Add("<i>“Maybe customer is to be buying some of my stock if [heshe] is worried, yes? In any case, Asche is needing one whole plant, after which she will be extracting essence of poisons and using to imbue candle with spell. Now, if there is being nothing else, Asche suggests that customer is making haste to be getting reagents, yes yes.”</i>", parse);
			Text.Flush();
			
			asche.flags["Tasks"] |= AscheFlags.Tasks.Nightshade_Started;
			
			Gui.NextPrompt();
		}

		export function OnTask() {
			let player = GAME().player;
			var parse : any = {
				hisher : player.mfFem("his", "her")
			};
			
			Text.Clear();
			Text.Add("<i>“Customer is not having nightshade for Asche?”</i> The jackaless flashes her pearly white teeth at you. <i>“Is all right for now, since preparations to be going into bone yard are very long because place is so evil. Customer can be taking [hisher] time… for now.</i>", parse);
			Text.NL();
			Text.Add("<i>“If customer is needing reminding, then Asche is needing whole nightshade plant from forest. To be careful when handling the poisonous herb, though - Asche is not wanting customer’s blood on her head. Again, if customer is having trouble finding plant on [hisher] own, maybe she can be asking locals of forest who know something of herbs that are growing there.”</i>", parse);
			Text.Flush();
			
			AscheScenes.TalkPrompt();
		}

		//While on this quest, add a one-time “nightshade” button to Aquilius’ daytime talk menu.
		export function AskAquiliusForHelp() {
			let player = GAME().player;
			let asche = GAME().asche;

			var parse : any = {
				playername : player.name
			};
			
			Text.Clear();
			Text.Add("Aquilius frowns at your question. <i>“Whyever would you want some of <b>that</b>? There are lethal poisons that are far safer to handle than deadly nightshade.”</i>", parse);
			Text.NL();
			Text.Add("You explain to him that you need the plant not so much as a poison, but for its magical properties. Repeating Asche’s explanation, you point out that it’s not so much for your own purposes, as that you’re collecting samples at that eccentric shopkeeper’s request. Aquilius considers you a moment, then nods and sighs. <i>“I know what shop you’re speaking of, [playername]. The owner wasn’t really my kind - I didn’t, and still don’t, use magic much in my daily work. Nevertheless, I’ve never heard anyone speak ill of her or her goods.</i>", parse);
			Text.NL();
			Text.Add("<i>“Very well. I can confirm that deadly nightshade <b>does</b> grow in the forest, although I have never had need to use it; I do know that while it is extremely toxic, trace doses may be used as a hallucinogenic or to relieve pain. The plant grows best in chalky soil, on hillslopes, and in the shade of trees - or so has been my experience on my herb-gathering forays. There’s a stand in the outer reaches of the forest, a little ways to the west of where we outlaws pay our respects to our departed, but I’m not certain if you’ll find any of the plants useable.”</i>", parse);
			Text.NL();
			Text.Add("Now that’s some concrete information for once. Is there anything else he can tell you?", parse);
			Text.NL();
			Text.Add("<i>“Yes. Get this all down, because I’m not repeating myself. I’d recommend that you at least wear gloves while harvesting the plant, as prolonged contact is enough for mild intoxication.</i>", parse);
			Text.NL();
			Text.Add("<i>“That’s about all I have for you, [playername]. I just pray to whatever spirits have your loyalty that you know what you’re doing with that stuff. Now, is there anything else I can help you with?”</i>", parse);
			Text.Flush();
			
			asche.flags["Tasks"] |= AscheFlags.Tasks.Nightshade_Aquilius;
			
			AquiliusScenes.Prompt();
		}

		//Add a “nightshade” button in the forest main menu. Click this to get the below scenes.
		//If the player went ahead and asked Aquilius, they can skip ahead to actually finding the stuff instead of risking wandering around the forest and wasting their time.
		//Maybe a success bonus if the player has ranger job mastered?

		//Only used if PC is wandering around blind (I.E, didn’t ask Aquilius)
		export function BlindStart() {
			let player = GAME().player;

			var parse : any = {
				
			};
			
			Text.Clear();
			Text.Add("Setting out into the forest on your hunt for a specimen of nightshade for Asche, you do your best to get this little flower-picking task done with a minimum of fuss. Keeping your eyes trained on the forest undergrowth and peeled for anything that might look like the herb you’re after, you set off along one of the myriad trails that wind their way through the forest, wandering where your feet will take you.", parse);
			Text.NL();
			
			var rangerBonus = 0;
			if(Jobs.Ranger.Unlocked(player))
				rangerBonus += 1;
			if(Jobs.Ranger.Master(player)) {
				rangerBonus += 2;
				Text.Add("At least your mastery of a ranger’s skills and the knowledge of the wilds that comes with the job should help you in your hunt… or so you hope.", parse);
				Text.NL();
			}
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Unfortunately, after half an hour you’re still as empty-handed as you were when you set out, the only thing you’ve gained being an ache in your back and crick in your neck from staring at the forest floor for so long. In a decidedly more sour mood than before, you rub your various sore spots and decide that this wasn’t exactly your lucky day. Maybe you’ll try again later when you’ve made yourself a little more comfortable… or at least, a little less tender.", parse);
				Text.Flush();
				
				TimeStep({minute: 30});
				
				Gui.NextPrompt();
			}, 3, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("After half an hour of wandering along the winding and uneven forest trails, you’re about to throw in the towel and take a break when the trail abruptly opens up into a clearing dominated by a small woodland stream at its far end. What’s more important, though, are the numerous dirt and moss-covered rocky outcroppings that dot the area - some of them of considerable height - and perched halfway along one of them is… could it be? Is it? Yes, it <i>is</i> a specimen of nightshade!", parse);
				Text.NL();
				Text.Add("Now, to get it down…", parse);
				
				TimeStep({minute: 30});
				
				AscheTasksScenes.Nightshade.HerbComplications();
			}, 1 + rangerBonus, function() { return true; });
			
			scenes.Get();
		}

		//Use this if asked Aquilius for help
		export function FollowAquilius() {
			var parse : any = {
				
			};
			
			Text.Clear();
			Text.Add("Having directions sure made this simple. Instead of risking wasting hours wandering around the forest with your gaze down and rump in the air - and possibly attracting all sorts of unwanted attention to boot - you head for the spot Aquilius told you about, near the outer reaches of the forest and to the west of the outlaws’ little memorial.", parse);
			Text.NL();
			Text.Add("Sure enough, the forest trail opens up into a clearing, one end of which is occupied by a quick-flowing stream. Several rocky outcroppings stick out from the ground, covered in places with dirt and moss. The only problem is, they’re quite tall - almost rising above the shorter trees surrounding them - and the nightshade plants are growing on ledges high up on the towering formations.", parse);
			Text.NL();
			Text.Add("Not quite what you’d expected, but there it is. At least, it’s better than dealing with shamans, right?", parse);
			
			TimeStep({minute: 30});
			
			AscheTasksScenes.Nightshade.HerbComplications();
		}

		export function HerbComplications() {
			let player = GAME().player;
			let party : Party = GAME().party;
			let asche = GAME().asche;

			var parse : any = {
				feet : player.FeetDesc()
			};
			
			asche.flags["Tasks"] |= AscheFlags.Tasks.Nightshade_Succeeded;
			
			Text.NL();
			if(player.HasWings()) {
				Text.Add("And better it is. Sustained flight may be out of your reach, but you’re able to use your wings to fly up in short hops to the lowest-growing plant on one of the tall, thin stone outcroppings. Once there, you easily uproot the plant from the shallow dirt it’s growing in, being careful not to get any of its sap on yourself in the process, and carefully wrap it before putting it away safely.", parse);
				Text.NL();
				Text.Add("All right, now to return to Asche and see what she has to say.", parse);
				Text.Flush();
				
				party.Inv().AddItem(QuestItems.Nightshade);
				
				Gui.NextPrompt();
			}
			else { // Must climb
				Text.Add("Well. If only you could fly… but alas, that luxury isn’t within your grasp. A ladder? No, a ladder wouldn’t be long enough. You pace about the monolithic rock formations for a little while - how did they come to be here, anyway? Did the stream wear away the ground over the years, exposing them, or were they thrust from the ground by some force from below? Whatever the case, it seems that your only recourse here is to climb.", parse);
				Text.NL();
				Text.Add("With nothing better coming to mind, you decide that finding a proper route with plenty of hand and footholds is the best you can do here. You take your time, trying to choose the most easily reached plant, and finally decide on one particular specimen before starting to climb.", parse);
				Text.NL();
				
				var goal = 60; // #make a combined stamina, dex and int check here. Maybe sum the three, make an average, and go for a check that’s suitable for a level 7 or 8 character?
				
				var check = Math.floor((player.Dex() + player.Sta() + player.Int()) / 3.0 + Math.random() * 20);
				
				if(GetDEBUG()) {
					Text.Add("(Dex+Sta+Int)/3 test: [val] (vs [goal])", {val: check, goal: goal}, 'bold');
					Text.NL();
				}
				
				if(check >= goal) {
					Text.Add("Struggling up the limestone outcropping takes considerable effort, but you manage to spot enough handholds - and nimbly make use of them - to make your ascent. It’s plenty tiring, too, but your stamina holds, and after perhaps fifteen minutes of climbing, you’re level with one of the nightshade plants.", parse);
					Text.NL();
					Text.Add("Taking a moment to secure yourself on the ledge, you catch your breath before uprooting the plant from the shallow dirt it’s growing in. Careful not to get any sap on your skin in the process, you wrap the whole plant up in whatever’s at hand before stowing it away.", parse);
					Text.NL();
					Text.Add("Thankfully, the descent is a little easier, and before too long you’re back on solid ground once more, dropping the last few feet to the soft grass that carpets the forest clearing. Time to head back to Asche with your find, then.", parse);
				}
				else { //#else (stat check fails)
					Text.Add("Wow, you knew this would be hard, but climbing up the limestone outcropping is still taking more out of you than you expected. Maybe it’s poor planning - the handholds are certainly further apart than you’d imagined them to be - or maybe it’s just that you need to exercise a little more, but your breath whistles through your teeth as you struggle onwards, hand over head.", parse);
					Text.NL();
					Text.Add("Going forward is hard, but you’ve come too far to turn back now. At least there aren’t any overhangs on this thing that you’d have to navigate - that would just be the icing on the cake. You have to stop a few times on the way up to rest, but at least you make it up to the ledge in the end. Rubbing your aching arms, you take a moment to recover before turning your attention to the nightshade plant you came all the way up here for, yanking the thing from the shallow soil it’s growing in before stowing it away with your other possessions. You’ll be glad to see the back of this cliff… so long as you make it down, that is.", parse);
					Text.NL();
					Text.Add("Well, nothing for it; you don’t intend to stay up here for the rest of your days, do you? Steeling yourself, you begin the laborious descent back to solid ground. After descending a few feet, you find your hand grabbing desperately at thin air - you <i>know</i> there should have been a handhold there, you used it on the way up, but somehow it’s gone missing. The fingers of your other hand strain to hold up your weight, and as a pebble gives way, lose their grip, sending you tumbling head-over-heels to the ground. Thankfully, the soft grass that carpets the clearing cushions your fall somewhat, but the impact of landing is still enough to knock the wind out of you and leave you badly bruised.", parse);
					Text.NL();
					Text.Add("Oof. You lie there dazed for a moment, then struggle to your [feet]. Nothing seems to be broken, but you’ll be smarting all over for a while. Well, let’s hope you don’t have to do <i>that</i> again anytime soon; best to hurry up and get that stupid plant to Asche before something else goes wrong.", parse);
					
					//#halve player’s current HP
					player.AddHPFraction(-player.HPLevel() / 2);
				}
				
				Text.Flush();
				
				party.Inv().AddItem(QuestItems.Nightshade);
				
				Gui.NextPrompt();
			}
		}

		export function Complete() {
			let player = GAME().player;
			let party : Party = GAME().party;
			let asche = GAME().asche;

			var parse : any = {
				handsomepretty : player.mfFem("handsome", "pretty"),
				himher : player.mfFem("him", "her"),
				hisher : player.mfFem("his", "her"),
				heshe : player.mfFem("he", "she")
			};
			parse = player.ParserTags(parse);
			
			asche.flags["Tasks"] |= AscheFlags.Tasks.Nightshade_Finished;
			
			Text.Clear();
			
			party.Inv().RemoveItem(QuestItems.Nightshade);
			
			Text.Add("<i>“Asche knew customer would come through! And at just right time, too - Asche has just returned from edge of Boneyard and ground dragon bones into meal.”</i> There’s a soft click of gold on gold as the jackaless reaches into a nearby shelf and draws out a small bag of fine white powder. <i>“Asche was thinking to herself, ‘Would it not be good thing if [handsomepretty] customer were coming back with nightshade right about now?’ and here you are! Is almost like magic!”</i>", parse);
			Text.NL();
			Text.Add("Maybe it <i>is</i> magic, you reply with a grin as you set out the plants on the counter. Asche pulls out a pair of thick cloth gloves from under the counter, slips them on, and begins to examine the specimens you brought back.", parse);
			Text.NL();
			Text.Add("<i>“Is wholly adequate,”</i> she says at last. <i>“Asche is thinking that these will be serving her purposes quite nicely.”</i>", parse);
			Text.NL();
			Text.Add("Does she mind if you watch her about her business? As part of the reward, that is.", parse);
			Text.NL();
			Text.Add("Asche swoons in the most dramatic fashion, looking ready to fall off her seat any moment. <i>“Oh, is customer not trusting Asche? Asche is so hurt by unkind words.”</i> She moans, more than a little lewdly, then snaps back upright and grins maniacally at you. <i>“Oh, Asche is understanding. You are giving her very dangerous thing, and are wanting to be assured that it is not being misused; is perfectly reasonable request. Very well, you may be watching while Asche is working.”</i>", parse);
			Text.NL();
			Text.Add("The jackaless bids you pull up a high stool beside the counter, then brings the nightshade over to her alchemy lab.", parse);
			Text.NL();
			Text.Add("<i>“To be distilling essence of nightshade is taking some effort.”</i> The jackaless concentrates a moment, and then you feel a stiff breeze blow through the entirety of the shop, sweeping in from the far end and out the window behind Asche. <i>“Fumes are thin, but still very deadly. Now, customer is to be watching very carefully as I am taking large beaker - I am not cutting up nightshade, but steeping entire plant in distilled spirits. Also am heating concoction with hot water, not with open flame. Distilled spirits can be catching fire easily…”</i>", parse);
			Text.NL();
			Text.Add("Asche explains each and every step of the extraction process as she works away, and you quickly realize that she’s giving you an impromptu alchemy lesson.", parse);
			if(player.alchemyLevel >= 1) {
				Text.Add(" Some of the concepts are new to you, others you know well, but it’s always nice to go over the basics one more time.", parse);
			}
			Text.NL();
			Text.Add("<i>“Now, watch as Asche uses special metal salts to be extracting poison from plant fibers… keeping on gently warming liquid, but do not be heating to dryness… color change is quite important, as Asche is telling you…”</i> The exotic shopkeeper’s face is a mask of concentration as she conducts the alchemical process with practiced deftness of hand. <i>“Now, strain out remaining plant fibers with sieve, then gently boil off excess spirits to create concentrated essence. Is being very poisonous at this point, even to touch. If customer is unsure of [himher]self, then Asche is recommending that [heshe] be wearing smock for this.”</i>", parse);
			Text.NL();
			Text.Add("Done at last, the jackaless holds up the beaker for you to examine. With the now colorless plant fibers removed - the remnants of the stems, leaves, roots and berries lie the beaker - what’s left at the bottom is a light green slurry, and it’s this that she pours into a small glass vial, stoppering it tightly with a wooden cork.", parse);
			Text.NL();
			Text.Add("<i>“The rest is being simple. All spell components must be mixed at same time with tallow that is forming main body of candle, then spell is cast as tallow is cooling. Alchemical properties of reagents are being interacting with energies of caster and world; bridge is being formed between physical and metaphysical worlds, as Asche’s mother put it. Now, customer is to be observing.”</i>", parse);
			Text.NL();
			Text.Add("Putting away the used glassware from the bench, Asche heats a large glob of tallow in a metal basin, letting it render into a gently steaming liquid. One by one, she adds the ingredients into the light yellow mixture, stirring it thoroughly with a wooden rod after each before the next one is introduced. The process takes the better part of an hour, but you find yourself strangely captivated by the sight - and by the scents that rise from the basin.", parse);
			Text.NL();
			Text.Add("<i>“Highlander magic is different from lowlander magic; each component is having meaning. Downside is that needing to gather materials for spell to be working properly. Upside is that reagents are being helping caster to wield far more raw energy than caster can alone.</i>", parse);
			Text.NL();
			Text.Add("<i>“Bone is representing lasting and permanence, and dragon bone even more so, for it harbors remnant of mighty creature’s power. Simple garlic, when being ground and added, is creating protection and being inverting nightshade’s property of harm and death. Eye of newt is representing opening of magician’s inner eye which is allowing magic; Asche notes that customer is having powerful eye. Leaf of mint plant is serving as reminder of purity and clarity; also, to be using three pinches of freshly sliced leaf. How big or small pinch is not important, customer is to be knowing that what is essential is that <b>three</b> pinches are being used.</i>", parse);
			Text.NL();
			Text.Add("<i>“All this Asche learned at mother’s knee, and now is imparting to customer.”</i>", parse);
			Text.NL();
			Text.Add("At length, Asche brings up a large mold, and it’s into this that she pours the now-discolored tallow. Even as she does so, you feel a pulsating warmth emanating from the jackaless’ person; wisps of golden light curl from her fur and gently fall to the floor, where they vanish without a trace. Satisfied with her handiwork, the exotic shopkeeper lowers a wick into the cooling tallow and frowns a moment before bringing out a smaller mold.", parse);
			Text.NL();
			Text.Add("<i>“Hmm, it seems that Asche is having a little left over,”</i> she says. <i>“Maybe she is making small candle for [handsomepretty] customer, too? Is not being big enough for burning, but just holding candle and having it around customer’s person can help ward off poisons.”</i>", parse);
			Text.NL();
			Text.Add("That would be very helpful. Even if it ends up worthless to you, you could probably sell the candle for a little money.", parse);
			Text.NL();
			Text.Add("<i>“Is very easy thing to be doing, so no need to be thanking me. There, both are done, now just to be waiting for candle to set, and Asche can be bringing it over to client at her leisure. Candle for [handsomepretty] customer is smaller, so should be hardening easily - should be done by time customer is ready to leave.”</i> The jackaless finishes putting away the last of the alchemical apparatus, removes her gloves, and washes her hands in a small basin of water. <i>“Now, am thinking that it is about time customer is being receiving [hisher] well-earned reward, yes?</i>", parse);
			Text.NL();
			Text.Add("<i>“As before, customer may be choosing between reward of money or very educational lesson.”</i> Asche smiles slyly, throwing back the hood of her shawl to shake loose her lustrous hair. <i>“Asche does not mind either way, but customer is to be remembering that this is one-time deal. Asche is not liking being in debt, so is best to be clearing everything that is being owed quickly.”</i>", parse);
			Text.Flush();
			
			//[Money][Lesson]
			var options = new Array();
			options.push({ nameStr : "Lesson",
				tooltip : "Well, you aren’t the kind to pass up a very educational experience…",
				func : function() {
					Text.Clear();
					
					party.Inv().AddItem(AccItems.GreenScentedCandle);
					
					Text.Add("Upon hearing your words, Asche’s smile widens into a sultry grin. Leaning forward onto the counter, she jabs a finger at the door. <i>“Is all well and good, but maybe [handsomepretty] customer is to be locking storefront and taking [hisher] candle before Asche is bringing [himher] to back room, yes? Although shop is having protections, Asche still does not want to be dealing with shoplifters when her mind is on… other matters. Giving lesson is being requiring full concentration, after all.”</i>", parse);
					Text.NL();
					Text.Add("Well, you asked for it, so you take care of locking up. Once the shop’s front door is locked and secure, Asche beckons you over to the counter with a finger in a clear “come hither” gesture.", parse);
					Text.NL();
					Text.Add("<i>“Now, Asche was expecting much from brave and [handsomepretty] customer, and [heshe] has not failed to deliver. Is good to have daring and resourceful adventurer doing tasks for shopkeeper like Asche. It is fair exchange of desires, yes?”</i>", parse);
					Text.NL();
					Text.Add("Moving almost of their own accord, the jackaless’ hands wander over to her ripe breasts, her palms cupping their swell as she rubs her milk-makers through the silky smooth fabric of her sari. Seeing your gaze transfixed by the little display she’s putting on, Asche moans lustily and begins unwinding her clothing; inch after inch of white cloth pools on the ground as she pulls her sari away from her bare midriff to reveal more of her deep golden fur. The jackaless wears neither bra nor panties, a fact that’s made more and more obvious the more skin she reveals.", parse);
					Text.NL();
					Text.Add("<i>“Mm, Asche is not sure why, but she is feeling all sorts of aroused right now,”</i> the jackaless says with a flirtatious giggle. <i>“Maybe is side-effect of having worked with spell components… or maybe [handsomepretty] customer is just too much for Asche to bear.”</i>", parse);
					Text.NL();
					Text.Add("Flattery isn’t going to get her anywhere - not that there’s much further up to go from here. Nevertheless, you do find yourself stepping closer to the sexy, exotic shopkeeper until you’re right up against the counter, your eyes captivated by Asche’s deep gaze.", parse);
					Text.NL();
					Text.Add("<i>“If customer is liking Asche’s breasts so much, [heshe] only has to be saying word. This jackaless is knowing just how valuable each of her assets are, even if they are not being for sale.”</i> With a series of slow, sensual movements, Asche strips off the last curl of her top and lets her soft, generous melons fall out, bouncing gently as they greet cool, open air. Making sure you’re watching closely, the jackaless snakes her hands over her hips and divests herself of the last of her clothing with a gentle push, folding up her sari neatly and setting it down on the shop counter.", parse);
					Text.NL();
					Text.Add("<i>“Is customer approving of Asche?”</i> the exotic shopkeeper asks as she stretches and poses, the clink of golden bracelets ringing in the air as she shows off her full, lovely hourglass figure with unabashed aplomb. <i>“As she is sure customer knows, Asche is working very hard to look pretty over many years.”</i>", parse);
					Text.NL();
					Text.Add("You grin. Yes, you approve - you’re still here, aren’t you? How old is she, anyways?", parse);
					Text.NL();
					Text.Add("<i>“My, my,”</i> the jackaless chides. <i>“And those words are being coming out of lips which customer is wishing to kiss Asche with? Whatever shall Asche do with such a naughty customer? Maybe she shall be sweetening [himher] such that hurtful words like these are not even forming in customer’s mind, yes?”</i>", parse);
					Text.NL();
					parse["armor"] = player.ArmorDesc();
					Text.Add("Winking and beckoning you to follow, Asche leads you into the shop’s back room with its fine mattress, mint smell and woven mats. Without further ado, she slinks up to you and begins tugging at your [armor], quickly divesting you of them and letting them fall to the floor, where she kicks them out of the way.", parse);
					Text.NL();
					Text.Add("<i>“Asche knows from personal experience that being adventurer is very stressful job, so is probably best if [handsomepretty] customer is just relaxing and forgetting about troubles. Asche is very happy to be taking lead and guiding customer in lesson.”</i>", parse);
					Text.NL();
					Text.Add("Without waiting for your reply, the jackaless presses her lips to yours in a deep, breathless kiss, her hands reaching for your ", parse);
					if(player.FirstCock()) {
						if(player.NumCocks() > 1)
							Text.Add("[cocks], letting her fingers ply up and down along each of their lengths in turn.", parse);
						else
							Text.Add("[cock], letting her fingers ply up and down along its length.", parse);
						Text.NL();
						Text.Add("Her touch is as sensual as it is deft, the dancing of her fingertips against man-meat producing bright sparks of pleasure, which pass running through your groin and into the rest of your body.", parse);
					}
					else {
						Text.Add("[vag], her nimble fingers teasing the petals of your womanly flower. Her touch only intensifies as your netherlips begin to grow flush with damp heat, encouraging the jackaless to toy with your [clit].", parse);
					}
					Text.Add(" Although Asche weighs hardly anything, you find yourself sinking back onto the mattress at her insistence, the jackaless leaning her weight on you until your back is firmly pressed against the fabulously smooth sheets. Kneeling above you, straddling you with ease, Asche runs her hands along her curvaceous sides, licking her muzzle as she looks down at you. Carefully, she produces a small pot of golden ointment seemingly from thin air, then makes a show of unscrewing the lid and dipping a finger into the warm mixture.", parse);
					Text.NL();
					Text.Add("<i>“Asche shall now paint herself and customer with special concoction to help [himher] better feel and understand sensations,”</i> she explains as she trails a finger down from her forehead and around her eyes. <i>“Is important to be having feedback when in lesson, and pattern to be drawn on bodies is allowing for sharing of touch and feelings. Just to be lying back and trusting Asche to be doing her work, yes?”</i>", parse);
					Text.NL();
					parse["skin"] = function() { return player.SkinDesc(); }
					Text.Add("You gaze in wonder at the mystical pattern that’s taking shape on both your bodies - Asche’s touch is like warm syrup flowing across your [skin], leaving a trail of glowing gold in its wake, hot and cool at the same time. Stretching from forehead to chin, then down your neck and over your heart before spreading outwards across your limbs, it reminds you of a golden tree with curled branches, with not a single straight line to be found anywhere.", parse);
					Text.NL();
					Text.Add("<i>“Please, will [handsomepretty] customer not help a poor little jackaless like Asche out?”</i> Asche says with an evil grin, her fingers lingering on certain parts of your body, perhaps a little longer than strictly necessary to get the golden ointment applied. <i>“It has been a while since Asche has had been having a proper fucking from a partner who is not pathetic and limp-wristed.”</i>", parse);
					Text.NL();
					Text.Add("Well, you reply with an equally evil glint in your eye, even if you hadn’t been intending to help before, you sure are now.", parse);
					Text.NL();
					Text.Add("<i>“Mm, which is just nice,”</i> Asche replies, the jackaless finishing up the pattern by drawing a series of concentric circles about your groin. Done, she screws the lid back on the ointment pot before licking her fingertips with exaggerated relish. <i>“Now, what kind of educational experience was [handsomepretty] customer wanting?”</i>", parse);
					Text.Flush();
					
					AscheSexScenes.Prompt();
				}, enabled : true
			});
			options.push({ nameStr : "Money",
				tooltip : "The money will be just fine.",
				func : function() {
					Text.Clear();
					Text.Add("Asche looks a little disappointed when you tell her you’ll just have the money, but the jackaless’ usual easygoing demeanor returns in a matter of moments. <i>“Well, Asche is being respecting [handsomepretty] customer’s choice - coin is [hisher] desire, and coin [heshe] will have.”</i>", parse);
					Text.NL();
					Text.Add("With that, Asche pulls out a small purse from under the counter. <i>“Was thinking that you would be saying this, so Asche prepared money ahead of time. Please to be taking both it and candle as wages for hard work, and thus settling debt that Asche is owing to you.”</i>", parse);
					Text.NL();
					Text.Add("You nod, taking your candle and the purse. Counting the contents, you decide it’s not too bad of a sum for the work you’ve put in.", parse);
					
					var coin = 500;
					
					party.coin += coin;
					Text.Add("You recieved [coin] coins.", {coin: Text.NumToText(coin)}, 'bold');
					
					party.Inv().AddItem(AccItems.GreenScentedCandle);
					
					Text.Flush();
					
					Gui.NextPrompt();
				}, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		}
	}



	export namespace Spring {
		export function IsEligable() {
			let asche = GAME().asche;
			let rigard = GAME().rigard;
			return asche.flags["Tasks"] < AscheFlags.Tasks.Spring_Started &&
				rigard.MagicShop.totalBought >= 1500 &&
				GAME().player.level >= 8;
		}
		export function IsOn() {
			let asche = GAME().asche;
			return asche.flags["Tasks"] >= AscheFlags.Tasks.Spring_Started &&
				asche.flags["Tasks"] < AscheFlags.Tasks.Spring_Finished;
		}
		export function IsSuccess() {
			let asche = GAME().asche;
			return asche.flags["Tasks"] & AscheFlags.Tasks.Spring_Visited;
		}
		export function IsCompleted() {
			let asche = GAME().asche;
			return asche.flags["Tasks"] >= AscheFlags.Tasks.Spring_Finished;
		}

		export function Initiation() {
			let player = GAME().player;
			let asche = GAME().asche;

			var parse : any = {
				HandsomePretty: player.mfFem("Handsome", "Pretty"),
				handsomepretty: player.mfFem("handsome", "pretty"),
				hisher : player.mfFem("his", "her"),
				himher : player.mfFem("him", "her"),
				HisHer : player.mfFem("His", "Her"),
				heshe  : player.mfFem("he", "she")
			};
			
			Text.Clear();
			Text.Add("<i>“Oh? [HandsomePretty] customer is being having curse of itchy feet again? Alas, Asche is not being having potion or spell for such problem, but she can still be helping. If customer is having nothing to do with [hisher] time, then maybe Asche can be giving [himher] something to be doing, yes?”</i>", parse);
			Text.NL();
			Text.Add("Naturally, you’d have to hear what it is before committing yourself to the task.", parse);
			Text.NL();
			Text.Add("<i>“Of course. Asche is not being one to snare others with tricksy words, yes yes.”</i> The jackaless flicks her ears and smiles up at you. <i>“Two days ago, minotaur traveler is being coming into Asche’s shop. This jackaless is not seeing many travelers from Highlands of late, what with rules about entering city. She is encouraging minotaur to be staying a while and chatting some, giving her knowledge of what is going on at home, yes. Amongst things traveler is telling Asche is knowledge of certain hot spring in mountains. Asche was thinking that she is knowing all the springs in her homeland, but this is being new one.</i>", parse);
			Text.NL();
			Text.Add("Just throwing out a guess there - she would like you to investigate, right?", parse);
			Text.NL();
			Text.Add("The jackaless’ smile widens into a toothy grin. <i>“[HandsomePretty] customer is being completely right. Is true that Asche is quite interested - source of hot springs is drawn from deep within earth, and is often being containing strange and unique magics.</i>", parse);
			Text.NL();
			Text.Add("<i>“While Asche would be going to take a look-see herself, now is not best time to be leaving her shop. Many threads of fate are being converging on this plane… she must make sure that shop is adequately fortified, and in sad case it is being necessary, make ready path for escape.”</i>", parse);
			Text.NL();
			Text.Add("Threads of fate converging on Eden? You’re about to frame the question on your lips, but Asche must’ve guessed what you’re intending to ask, for she waves off your concern with a clink of jewelery.", parse);
			Text.NL();
			Text.Add("<i>“Is nothing good customer needs to be concerning [himher]self with. [HisHer] fate is tied to Eden’s… to now be speaking of the matter at hand. This jackaless would like customer to be finding spring for her, and if possible, collecting samples of water for her.”</i> She reaches under the counter and draws out three small crystal vials. <i>“Asche is not sure if any magical nature of spring is being intrinsic property or can be passed along into the water, but she would like to be finding out. May be useful for specialty potion…”</i>", parse);
			Text.NL();
			Text.Add("Picking up the vials, you stow them away and turn back to Asche. So, how are you supposed to get to this place?", parse);
			Text.NL();
			Text.Add("<i>“Asche is managing to get directions to the place from traveler, and she will be telling you now. Is big surprise, really - although this jackaless knows craggy Highlands are holding many such hidden places, she is also thinking that she is knowing most of them. Hah… is always good to be getting nice surprise. Now to be listening up…”</i>", parse);
			Text.NL();
			Text.Add("Quickly, Asche sketches out a few directions, starting off from the main road leading from the crossroads to the Highlands, prodding the countertop every so often to emphasize a particular point.  You have the jackaless go over them a few times, then feel confident enough in them that if this spring really exists, you’ll be able to find it based on her directions.", parse);
			Text.NL();
			Text.Add("<i>“Good, good. Asche will be awaiting [handsomepretty] customer’s return, then. Is hard to get good help in the city these days, she thinks. Young people are being having no work ethic at all.”</i>", parse);
			Text.NL();
			Text.Add("Wait, wait. There’s still the matter of your reward… she doesn’t expect you to work for free, does she? It wouldn’t be traditional, after all. Gotta have one, even if it’s a cheap, battered old hat that’ll only be turned into vendor trash.", parse);
			Text.NL();
			Text.Add("<i>“Hmm…”</i> Asche tents her fingers, raising her golden eyes to meet your own. Your gaze is drawn to her fingers; her hand is running across the countertop until it worms its way onto your wrist, stroking and caressing. <i>“Well, there has been thing that Asche has been working on for some time now, quite exciting and educational it is being. Maybe [handsomepretty] customer might want to be helping this jackaless test it out when it is done? Of course, if this is not to customer’s liking, then [heshe] can always be wanting usual reward of some of Asche’s stock, or having educational experience with this jackaless. Is that being acceptable?”</i>", parse);
			Text.NL();
			Text.Add("Yes, it sounds like a very acceptable choice to you. You’ll be back shortly with your findings, then.", parse);
			Text.NL();
			Text.Add("<i>“Asche is being wishing you good luck, customer.”</i> A faint clink of gold, and she’s withdrawn her hand and settled back behind the counter. <i>“Perhaps you will be needing it.”</i>", parse);
			Text.Flush();
			
			TimeStep({hour: 1});
			
			asche.flags["Tasks"] |= AscheFlags.Tasks.Spring_Started;
			
			AscheScenes.Prompt();
		}

		//Select “spring” from Highlands menu.
		export function Highlands() {
			let player = GAME().player;
			let party : Party = GAME().party;
			let asche = GAME().asche;

			var parse : any = {
				feet : player.FeetDesc()
			};
			
			party.location = WORLD().loc.Highlands.Spring;
			
			Text.Clear();
			parse["season"] = WorldTime().season == Season.Summer ? ", even for summer" : "";
			Text.Add("Following Asche’s directions, you leave the beaten trail and head out into the rough, rocky terrain of Eden’s Highlands. The air is cool[season], the ground uneven with stony outcroppings thrusting through the mountain meadows, and small wildflowers poke through the grass, reaching for the sky. Barely half an hour into your hike, you’re already starting to feel the toll the off-trail journey is taking on you, but you forge on anyway - the open nature of your surroundings has you confident that you’ll be able to see any danger coming from far away.", parse);
			Text.NL();
			Text.Add("Sitting down on a nearby flat-topped boulder, you review Asche’s directions to the hot spring she mentioned. Considering how far you’ve already come, the spring she mentioned should be on that mountainside plateau over there to the east. It isn’t that far, but the climb up looks like a tough one and there’s no obvious trail leading to it. At least that explains why Asche, who claims to know much of the mystical mysteries of her homeland, wasn’t aware of the spring’s existence.", parse);
			Text.NL();
			parse["foot"] = player.IsNaga() ? "tail" : "foot"; 
			Text.Add("Well, nothing for it - time to earn your pay. You resolutely stand up and march off towards the mountainside at a brisk pace, doing your best to ignore the growing fatigue in your [feet]. Thankfully, when you get to the foot of the mountain, you discover there <i>is</i> a trail leading up to the plateau - albeit a steep, narrow one, but it’s better than having to climb hand over [foot] to your destination.", parse);
			Text.NL();
			Text.Add("At last, you make it and collapse to the ground in calf-high grass, exhausted by the climb. A perfect chance to take a breather and survey your surroundings - the plateau seems peaceful enough for you to let down your guard for a moment. Sheer drops surround it on three sides, and the wildflowers growing in small clumps of white and red only add to the sense of peace that blankets the plateau. In the middle, a large spring juts out from the earth, packed rocks and pebbles forming a lip of sorts around the water’s edge.", parse);
			if(WorldTime().season == Season.Winter)
				Text.Add(" Judging by the sheer amount of steam that’s pouring out from them, it’s evident that its heat is what’s allowed plants to grow so readily, even in the chill of highland winter.", parse);
			Text.NL();
			Text.Add("Hah, that was simple enough. Three vials, two pools - a simple enough matter for you to go and get some water and head back to Asche. Just as you’re about to stand and get to work, though, the pitter-patter of footsteps comes to you from the direction of the trail, enough to indicate that there’s more than one pair. Seems like someone else’s heading on their way here - you try and peer down the trail to catch a glimpse of who or what it might be, but the grasses and slant of the slope prevent you from seeing much that’s useful.", parse);
			Text.NL();
			Text.Add("Will you remain hidden where you are and wait this out, or step out and confront whoever may be coming down the trail?", parse);
			Text.Flush();
			
			TimeStep({minute: 30});
			
			//[Step Out][Hide]
			var options = new Array();
			options.push({ nameStr : "Step out",
				tooltip : "Taking the initiative might help if you need to get physical.",
				func : function() {
					Text.Clear();
					Text.Add("Working the last of the aches out of your body, you leave your hiding place and plant yourself at the end of the trail, ready to meet whoever it is who’s coming straight up to you. Soon enough, the newcomers emerge - a trio of husky dog-morphs, the biggest one a female, a male behind her, and a bound captive hefted between the two of them on a makeshift contraption of wood and vine that looks much like a stretcher. There’s a distinct resemblance between the former two, and you wonder if they’re related somehow.", parse);
					Text.NL();
					Text.Add("All of them wear little save for loincloths, body paint and the occasional string of colorful beads that passes for fashion in the Highlands, and when they spot you, the jovial air about them is instantly replaced with one of wary shock.", parse);
					Text.NL();
					Text.Add("<i>“You’re not Isla!”</i> the female shouts.", parse);
					Text.NL();
					Text.Add("With that, the two huskies turn tail and scoot down the treacherous trail as quickly as they’d come, carrying their captive between them as they bound from footing to precarious footing as if it were the easiest thing in the world. Your hindbrain tells you to give chase, but thankfully the rational part of you counters with the fact that if you did so, you’d likely end up splitting your skull on the rocky trail.", parse);
					Text.NL();
					Text.Add("Huh. That was odd, to say the least. Who was Isla, and why were they expecting him or her?", parse);
					Text.Flush();
					
					Gui.NextPrompt();
				}, enabled : true
			});
			options.push({ nameStr : "Hide",
				tooltip : "You don’t want trouble, just some of the spring water.",
				func : function() {
					Text.Clear();
					Text.Add("Choosing to remain hidden, you hunker down in the grasses, pressing yourself as flat as you can and willing your breathing to slow as the footsteps draw closer. Your patience is rewarded with the sight of a trio of husky dog-morphs bursting onto the plateau meadow - the biggest of them a female, a male behind her, and a bound captive hefted between the two of them on a makeshift contraption of wood and vine that looks much like a stretcher. There’s a distinct resemblance between the former two, and you wonder if they’re related somehow.", parse);
					Text.NL();
					Text.Add("All of them wear little save for loincloths, body paint and the occasional string of colorful beads that passes for fashion in the Highlands, and they come to a stop at the spring’s edge. With a peal of shared laughter, they tip their captive off the stretcher and into the spring’s softly bubbling waters, pinning his body under the surface with it. This clearly isn’t very welcome to the poor bastard being held there - his head easily breaks the surface, but he thrashes for all the good it’ll do, trying to fight both his captors and bonds.", parse);
					Text.NL();
					Text.Add("<i>“Oi! You! How many times do I have to tell you the spring’s not a damned toy, you layabouts!”</i>", parse);
					Text.NL();
					Text.Add("Without warning, a lithe woman dashes out from the other side of the plateau, spear in hand and barreling straight for the trio of huskies. You don’t immediately recognize what kind of morph she is - at a first glance, she looks like a ferret, but a closer inspection suggests that she’s more of a marten or a sable than that. Either way, she’s dressed much like the huskies are, loincloth, paint and all, and her rather flat chest allows her fur alone to preserve her modesty quite efficiently.", parse);
					Text.NL();
					Text.Add("<i>“Get out! Get out! And take your roughhousing elsewhere!”</i>", parse);
					Text.NL();
					Text.Add("The brother and sister duo run away laughing, clearly unfazed by the sable’s ire, only stopping to look back as she fishes their captive - now decidedly looking much less like a husky, or a him, at that - out of the bubbling waters by the scruff of his neck. With all the practice ease of someone who’s been doing this since they could walk, they bound down the rocky trail and are gone.", parse);
					Text.NL();
					Text.Add("<i>“Now, what am I going to do with the likes of you?”</i> the sable-morph says, shaking her head at the poor sop she’s fished out as she undoes his bindings. The husky’s head is still as it was, but he’s grown a small pair of breasts and definitely looks rather more feminine - and mustelid-like - than he was before he went in. He looks up at his savior, and whines pathetically.", parse);
					Text.NL();
					Text.Add("<i>“Youngsters and your pranks. Leastways they didn’t hold you under long enough for you to grow a cunt,”</i> the sable-morph mutters. <i>“C’mon, Isla here’ll take you back to where you belong - Sibil, she’ll put you back as you were and give that brother and sister of yours a good paddling. I know I’m going to regret this, since next week it’ll probably be you and your brother dumping her in, but I’m just too soft-hearted for that.”</i>", parse);
					Text.NL();
					Text.Add("Silence.", parse);
					Text.NL();
					Text.Add("<i>“You can still walk, I take it? Need some time getting used to these legs?”</i>", parse);
					Text.NL();
					Text.Add("A nod.", parse);
					Text.NL();
					Text.Add("<i>“Let’s go, then.”</i>", parse);
					Text.NL();
					Text.Add("Together, they set off down the trail, leaving you alone on the plateau.", parse);
					Text.Flush();
					
					Gui.NextPrompt();
				}, enabled : true
			});
			
			Gui.Callstack.push(function() {
				Text.Clear();
				Text.Add("Well, here’s your chance. Nipping along to the hot spring’s edge, you pull out Asche’s vials and fill them to the brim with spring water, careful not to get any of it on you. If it’s the water that’s magical, then who knows what it might do to you?", parse);
				Text.NL();
				Text.Add("Job done, you head back down the trail, eager to make yourself scarce before anyone else happens to burst in on the scene. The descent is much easier than climbing up was, and you’re back on the main highland roads within the hour. Time to return to Asche and see what she has to say about the water you collected.", parse);
				Text.Flush();
				
				TimeStep({minute: 30});
				
				asche.flags["Tasks"] |= AscheFlags.Tasks.Spring_Visited;
				
				Gui.NextPrompt(function() {
					party.location = WORLD().loc.Highlands.Hills;
					Gui.PrintDefaultOptions();
				});
			});
			
			Gui.SetButtonsFromList(options, false, null);
		}

		export function OnTask() {
			let player = GAME().player;

			var parse : any = {
				heshe  : player.mfFem("he","she"),
				himher : player.mfFem("him","her")
			};
			
			Text.Clear();
			Text.Add("<i>“Did good customer forget where [heshe] was supposed to be going? Asche is wanting [himher] to be investigating spring in Highlands. Directions have already been given, just are needing to follow them from main road, that is all.”</i>", parse);
			Text.Flush();
		}

		export function Complete() {
			let player = GAME().player;
			let party : Party = GAME().party;
			let asche = GAME().asche;

			var parse : any = {
				himher : player.mfFem("him", "her"),
				hisher : player.mfFem("his", "her"),
				heshe : player.mfFem("he", "she"),
				handsomepretty : player.mfFem("handsome", "pretty"),
				upperarmordesc : player.ArmorDesc(),
				lowerarmordesc : player.LowerArmorDesc()
			};
			parse = player.ParserTags(parse);
			parse = Text.ParserPlural(parse, player.NumCocks() > 1);
			
			asche.flags["Tasks"] |= AscheFlags.Tasks.Spring_Finished;
			
			Text.Clear();
			Text.Add("<i>“Ah, customer is being returning, and with scent of Highlands still on [himher],”</i> Asche says, her eyes trained on you eagerly. <i>“This jackaless is being sensing magics of a unique nature on customer’s person, is it related to task she has sent customer on?”</i>", parse);
			Text.NL();
			Text.Add("Of course it is. With a flourish, you pull out the three vials of spring water and set them down on the counter before the jackaless. Asche’s gaze lights up at the sight, and her tongue runs over her muzzle as she packs them away under the counter. <i>“Ah, very good, very good. It is seeming that water is still retaining small portion of power, even when it is being removed from source. While this jackaless is being requiring some experimenting to be determining in what way she can safely make use of spring water, [handsomepretty] customer has more than earned [hisher] reward.”</i>", parse);
			Text.NL();
			Text.Add("Ah, right, your reward. You take it the usual’s on offer, then?", parse);
			Text.NL();
			Text.Add("<i>“Hmm…”</i> Asche looks up at you and quirks an eyebrow. <i>“To be telling this jackaless, is customer feeling adventurous today?”</i>", parse);
			Text.NL();
			Text.Add("What kind of adventure does she have in mind?", parse);
			Text.NL();
			Text.Add("<i>“One which is being involving some interesting hanky-panky, of course.”</i> Winking at you, Asche leans forward on the counter, bringing her scent of jasmine ever so slightly closer to your person. <i>“Asche has recently being coming into possession of a unique charm, and would be liking to see if its powers are being really as strong as she thinks they are. While she is to be one wearing it, nature of magic is also needing someone else to help in experiment… not to be worrying, this jackaless is thinking it is perfectly safe.</i>", parse);
			Text.NL();
			Text.Add("<i>“Of course, if [handsomepretty] customer is not wanting adventure, there is always option of educational experience or traditional reward.”</i>", parse);
			Text.Flush();
			
			TimeStep({minute: 15});
			
			//[Reward][Education][Adventure]
			var options = new Array();
			options.push({ nameStr : "Reward",
				tooltip : "You’ll just take the goods, thank you very much.",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Ah,”</i> Asche replies, just the barest hint of disappointment in the jackaless’ voice. <i>“Customer is going for safe option? Well, there is always being next time.”</i>", parse);
					Text.NL();
					Text.Add("Rising from her seat, Asche sashays over to the shelves and gathers a small assortment of merchandise in her arms before returning and setting the spread down onto the counter. <i>“There, proper reward for good hard worker like customer is. Asche is not being having such committed help for some time now… hopefully customer will be offering help when she is next needing it.”</i>", parse);
					Text.Flush();
					
					party.Inv().AddItem(IngredientItems.BeeChitin);
					party.Inv().AddItem(IngredientItems.AntlerChip);
					party.Inv().AddItem(IngredientItems.BlackGem);
					party.Inv().AddItem(IngredientItems.Feather);
					party.Inv().AddItem(IngredientItems.RawHoney);
					party.Inv().AddItem(IngredientItems.Ramshorn);
					party.Inv().AddItem(IngredientItems.Letter, 3);
					party.Inv().AddItem(IngredientItems.DogBiscuit);
					party.Inv().AddItem(IngredientItems.MDust);
					party.Inv().AddItem(IngredientItems.TreeBark);
					
					Gui.NextPrompt();
				}, enabled : true
			});
			options.push({ nameStr : "Education",
				tooltip : "You wouldn’t mind yet another educational experience with the lovely jackaless.",
				func : function() {
					Text.Clear();
					Text.Add("The moment the words leave your mouth, Asche’s demeanor changes completely. It’s but a small shift in her posture, how she carries herself, but is more than enough to hint at what’s bubbling under the surface. <i>“Ah, [handsomepretty] customer is being wanting to learn, is [heshe]? Asche shall teach, then; she shall make customer into best student she is ever being having.”</i>", parse);
					Text.NL();
					Text.Add("Drawn by some strange magnetism, your gaze falls upon Asche’s weighty breasts, noting their rise and fall beneath the silken white fabric of her sari.", parse);
					Text.NL();
					Text.Add("<i>“And it is seeming like there is no lack of desire to be learning on [handsomepretty] customer’s part, too,”</i> Asche continues. <i>“Now, customer is knowing where back room is, so maybe to be going there and waiting while Asche is closing up shop for a bit, yes yes?”</i>", parse);
					Text.NL();
					Text.Add("Eagerly, you step past the counter and into the back room, settling down on one of the mats to wait. Moments tick by - is it just you, or is the scent of jasmine and mint intensifying by the moment? You don’t rightly remember - time seems to be passing in a warm incoherent haze, then out of nowhere, the mists part and a soft, golden figure is striding towards you, her distinct gait only made more so by her heart-shaped bum.", parse);
					Text.NL();
					//TODO ARMOR
					parse["ar"] = player.Armor() ? Text.Parse("[upperarmordesc] and [lowerarmordesc]", parse) : "clothes";
					Text.Add("<i>“This jackaless is sorry that she took so long in coming. There was a rather… insistent customer whom she had to shoo away, but it is all right now.”</i> Deft, nimble fingers begin picking away at your [ar], easily divesting you of them and tossing the offending articles out of sight. <i>“By way of apology, Asche will ensure that lesson is being extra interesting today.”</i>", parse);
					Text.NL();
					Text.Add("You would nod, but it’s hard to think clearly in the warm, scented fog that surrounds you. With a final pass of her hands, Asche strips you down to your [skin], then there’s a cool touch to her fingers as she begins tracing patterns on your body. It’s the golden paint again, you dimly recall, the one that lets you share sensations with her, and move to lean back to enjoy her touch when she stops you with a firm but gentle hand.", parse);
					Text.NL();
					Text.Add("<i>“Not quite to be relaxing yet - this is table, after all, Asche is being eating here. As saying goes, is best not to fuck where you eat; bed is being much better place for such things, yes?”</i>", parse);
					Text.NL();
					parse["c"] = player.FirstCock() ? Text.Parse(", Asche grabbing you by[oneof] your shaft[s] and stroking you off by way of encouragement", parse) : "";
					Text.Add("You mumble something that’s neither here nor there, but allow yourself to be led to the soft silken mattress on the other side of the room[c]. Once you’re settled into the mattress’ soft folds, the jackaless clambers onto you on all fours and works industriously at finishing the pattern on both your bodies - instead of the swirls she used the last time, this one is shaped more like a branching river, or perhaps a tree… or at least, you can tell that much from the movements of her fingers. Asche’s generous lady lumps swing and sway slightly under her as she works away, the teardrop-shaped mammaries grazing your [breasts], and soft, hot whuffs of breath cover your face and neck as her chest and stomach heave in and out slightly under her fur.", parse);
					Text.NL();
					Text.Add("She finishes up far too soon, though, and gently sets down the ointment pot a little distance away from you. Instinctively, you reach out for the jackaless, but she’s already atop you before you know it, a delightful contrast of warm fur and cold, heavy jewelery pressing against your body. Looking down at you, Asche licks her muzzle in the most exaggerated, salacious manner, and her tail wags impatiently from side to side; covered in branching golden lines that radiate outwards from her heart, she looks to be the exact picture of exquisite exoticness.", parse);
					Text.NL();
					Text.Add("<i>“Now… which lesson would [handsomepretty] customer be liking to be taking today?”</i>", parse);
					Text.Flush();
					
					AscheSexScenes.Prompt();
				}, enabled : true
			});
			options.push({ nameStr : "Adventure",
				tooltip : "An adventure? Why, that sounds like a whole barrel of fun! What could go wrong?",
				func : AscheSexScenes.MagicalThreesome, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		}
	}
}
