
import { GetDEBUG } from '../../../app';
import { Gender } from '../../body/gender';
import { MoveToLocation, GAME, TimeStep, WORLD } from '../../GAME';
import { Text } from '../../text';
import { Gui } from '../../gui';
import { LagonFlags } from './lagon-flags';
import { Sex } from '../../entity-sex';
import { LagomorphElite } from '../../enemy/rabbit';
import { Party } from '../../party';
import { AlchemySpecial } from '../../items/alchemyspecial';

export namespace LagonDScenes {
	export function RoomApproach() {
		let party : Party = GAME().party;
		let lagon = GAME().lagon;
		
		let parse : any = {
			
		};
		
		party.location = WORLD().loc.Burrows.LagonCell;
		TimeStep({minute: 15});
		
		Text.Clear();
		Text.Add("Decision made, you set off through the maze of tunnels leading out of the throne room. It doesn’t take long before you find yourself in front of Lagon’s new home; two bunnies stand watch beside an actual door, a surprisingly solid-looking thing set into one of the dug-out chambers.", parse);
		Text.NL();
		Text.Add("The guards give you a once-over, and then unlock the door and step aside, allowing you to slip through before they seal it shut behind you.", parse);
		Text.NL();
		Text.Add("Lagon’s cell is, by bunny standards, not that bad. A mattress laden with some pillows and blankets lays against one wall; all sport tears, clearly having been recovered from some garbage dump or other, but are clean and dry. On the opposite wall, a primitive basin of carved stone is filled with clean water, a small opening nearby clearly leading to a primitive toilet.", parse);
		Text.NL();
		Text.Add("Near the center of the room, a slightly lopsided table sits, and a few chairs next to it. One looks to have come from some noble’s house, with its high back and solid armrests, while another is notably larger. Judging by its... somewhat squashed appearance, you have a feeling that Vena uses that one.", parse);
		Text.NL();
		Text.Add("Pride of place goes to a large piece of broken glass, which has been placed against the wall as a makeshift mirror.", parse);
		Text.NL();
		Text.Add("Lagon is currently lounging on his seat, chin in his palm and idly drumming on an armrest with his fingertips. His ear twitches at the sound of his door opening and closing, and he looks towards you, trying to keep any interest from his face. When he sees you, he scowls bitterly.", parse);
		Text.NL();
		Text.Add("<i>“Oh. It’s you. What do you want?”</i> he growls.", parse);
		if(lagon.flags["Usurp"] & LagonFlags.Usurp.NiceFlag) {
			//Remove nice flag
			lagon.flags["Usurp"] &= ~LagonFlags.Usurp.NiceFlag;
			let first = !(lagon.flags["Usurp"] & LagonFlags.Usurp.NiceReact);
			lagon.flags["Usurp"] |= LagonFlags.Usurp.NiceReact;
			if(first) {
				Text.NL();
				Text.Add("You are a bit taken aback by the sudden change - last time you left him, you thought he was a changed bunny. You comment on this too: did those sons of his deny him the buttfuck he was craving so?", parse);
				Text.NL();
				Text.Add("<i>“What the hell are you talking about, moron?”</i> Lagon spits back. It seems to be genuine too, he really doesn’t remember…", parse);
				Text.NL();
				Text.Add("Huh. For some reason, the effects of your mental adjustments doesn’t seem to be permanent. Might be since it was a very short exposure. Either way, you can just reapply it if you want a less surly lagomorph to talk to and fuck.", parse);
			}
			else { //Repeat
				Text.Add(" It looks like the scepter’s little personality adjustment has worn off again. Figures. Ah well, Vena would probably protest a more long-term transformation anyway, even if it <b>is</b> for the better.", parse);
			}
		}
		Text.Flush();
		
		LagonDScenes.Prompt();
	}

	export function Prompt() {
		let party : Party = GAME().party;
		let lagon = GAME().lagon;
		
		let parse : any = {
			scepter : "scepter" //TODO
		};
		
		let options = [];
		options.push({nameStr : "Sex",
			tooltip : Text.Parse("Put an end to Lagon's boredom and take him for a little romp in the hay.", parse),
			enabled : true,
			func : function() {
				LagonDScenes.SexPrompt();
			}
		});
		let first = !(lagon.flags["Usurp"] & LagonFlags.Usurp.NiceFirst);
		options.push({nameStr : "Scepter", //TODO
			tooltip : Text.Parse(first ? "If this [scepter] can affect minds so much, maybe it can give Lagon a little attitude adjustment? It's worth a shot." : "Time to give Lagon a little time with his inner feelings.", parse),
			enabled : true,
			func : function() {
				LagonDScenes.ScepterEntry();
			}
		});
		//TODO
		/*
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
			Text.Add("You state that you're finished with Lagon now.", parse);
			Text.NL();
			Text.Add("<i>“Typical peasant. Get out of here and stop wasting my time then.”</i> ", parse);
			Text.NL();
			Text.Add("With pleasure. You unceremoniously turn your back on Lagon - you can <i>feel</i> his bitter gaze boring holes in it - and head back to door. You give it a good hard thump with your knuckles and the guards spring to let you out.", parse);
			Text.NL();
			parse["s"] = party.Num() > 2 ? "s" : "";
			parse["c"] = party.Num() > 1 ? Text.Parse(", your friend[s] following in your wake", parse) : "";
			Text.Add("Once Lagon’s door slams shut behind you, you promptly make your way back to Vena’s throne room[c].", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(WORLD().loc.Burrows.Throne, {minute: 15});
			});
		});
	}


	export function SexPrompt() {
		let player = GAME().player;
		let lagon = GAME().lagon;
		
		let parse : any = {
			
		};
		parse = player.ParserTags(parse);
		
		let first = !(lagon.flags["Usurp"] & LagonFlags.Usurp.JailSexFirst);
		lagon.flags["Usurp"] |= LagonFlags.Usurp.JailSexFirst;
		
		Text.Clear();
		if(first) {
			Text.Add("You’re here to have sex with him. Why else would you come? It’s not like he’s good for anything else these days.", parse);
			Text.NL();
			Text.Add("<i>“And why should I even bother giving a traitor like you the time of the day? You want to fuck? Go throw yourself into the Pit and stop wasting my time!”</i> He spits back.", parse);
			Text.NL();
			Text.Add("Seems like Lagon’s not going to be reasonable about this. Well, there’s only one way you’re going to get through to him.", parse);
			Text.NL();
			Text.Add("Before the scowling bunny can realize what you’re thinking, you surge forward and grab him. Your fingers fasten themselves around his arms and you lift him into the air. Lagon squawks in shock, squirming in your grip and cursing you with the filthiest language he can muster, but you easily keep ahold of him.", parse);
			Text.NL();
			Text.Add("You stride over to Lagon’s bed and then swing him through the air, literally throwing him into the mattress. The shock of impact forces the air from his lungs in a loud grunt, and you promptly fall atop him. One hand slaps down against his breastbone, leaning the whole weight of your body into his chest and keeping him fixed in place like a bug, capable only of wriggling feebly.", parse);
			Text.NL();
			Text.Add("<i>“Nnngh! Get off of me, you worthless peasant!”</i> he roars, wrapping his fingers around your wrist and trying to pry your hand off of him with all his might.", parse);
			Text.NL();
			Text.Add("He can’t even budge you an inch. Even by lagomorph standards, that’s kind of pathetic...", parse);
			Text.NL();
			Text.Add("Scowling, you snap at him to sit down and <b>shut up</b>. He needs to get it through his thick head that he’s not king around here, not anymore. What authority does he think he has left? It’s all in his head, a daydream - and one that you’re not going to let him cling to anymore.", parse);
			Text.NL();
			Text.Add("Because there’s only one person in charge here now. And that person is <b>you</b>. And you want <b>him</b>. So, he can either cooperate with you, and get some fun out of it in turn, like all good boys... or he can keep fighting, and you’ll <b>take</b> what you want out of him - no matter how rough you have to be in the process.", parse);
			Text.NL();
			Text.Add("Leaning down until you are face to face with him, you look him in the eyes, cold and unblinking, and ask if he understands you, your tone an icy hiss of menace.", parse);
			Text.NL();
			Text.Add("His grip tightens on your wrist, but after a few moments of silence, he eventually relaxes. <i>“F-fine!”</i> he says through gritted teeth. <i>“But mark my words, I’ll remember this. And when I’m back in my rightful place, I’ll hunt you down and turn you into the Pit’s meat toilet!”</i>", parse);
			Text.NL();
			Text.Add("You chuckle in his ear, and stage whisper that you’re counting on him remembering what you’re about to do. Lagon visibly fumes, but he makes no effort to fight back, and so you finally shift your weight off of him.", parse);
		}
		else {
			Text.Add("He should know, you tell him.", parse);
			Text.NL();
			Text.Add("Lagon lets out a sigh. <i>“To have sex with me?”</i> he says, with as much contempt as he can pack in those five words.", parse);
			Text.NL();
			Text.Add("Yes, it’s good to see that he’s finally learning his place.", parse);
			Text.NL();
			Text.Add("<i>“My place!? I’ll tell you where <b>my</b> place i-”</i>", parse);
			Text.NL();
			Text.Add("You silence him with a glare, and though you don’t say a word, Lagon quiets down.", parse);
			Text.NL();
			Text.Add("<i>“Bah! It’s a waste to say anything to a peasant like you.”</i> He gets up from his chair and makes his way to his bed. <i>“Let’s get this over with then.”</i>", parse);
			Text.NL();
			Text.Add("You just smirk, watching him as he goes. For all his tough talk, he knows his place. Besides, from the flash of pink between his thighs before he turned around, you know that he’s looking forward to this despite himself.", parse);
		}
		Text.NL();
		Text.Add("With Lagon now safely settled in his bed, you quickly remove your [armor] and cast it onto the table in the center of the room. Now naked, you look over the nude form of the fallen tyrant and lick your lips, trying to decide what you’re going to do with him.", parse);
		Text.Flush();
		
		let options = [];
		
		options.push({nameStr : "Pitch anal",
			tooltip : Text.Parse("He’s just begging for your [cock] up his tight little bunny-butt.", parse),
			enabled : player.BiggestCock(null, true),
			func : function() {
				LagonDScenes.PitchAnal();
			}
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
			Text.Add("Shaking your head, you turn from the bed and head back to where you left your [armor], slowly pulling it back on without saying a word to the lapine still waiting on the bed.", parse);
			Text.NL();
			Text.Add("Lagon scoffs at you. ", parse);
			if(lagon.JailSexed())
				Text.Add("<i>“Not going through with it? Lost your nerve? How disappointing...”</i>", parse);
			else
				Text.Add("<i>“Is that it? After all that show you’ll simply walk away? So besides a traitor, you’re also a coward. What a disappointment...”</i>", parse);
			Text.NL();
			Text.Add("You throw a smirk over your shoulder, quipping back that you thought Lagon would much rather spend some quality time alone with his hand again. After all, that’s his favorite playmate, now isn’t it?", parse);
			Text.NL();
			Text.Add("He scowls at you, but remains otherwise silent.", parse);
			Text.Flush();
			
			LagonDScenes.Prompt();
		});
	}

	export function PitchAnal() {
		let player = GAME().player;
		let party : Party = GAME().party;
		let lagon = GAME().lagon;
		
		let p1cock = player.BiggestCock(null, true);
		let strapon = p1cock.isStrapon;
		
		let parse : any = {
			
		};
		parse = player.ParserTags(parse);
		parse = Text.ParserPlural(parse, player.NumCocks() > 1);
		parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
		
		let first = !(lagon.flags["JSex"] & LagonFlags.JailSex.PitchAnal);
		lagon.flags["JSex"] |= LagonFlags.JailSex.PitchAnal;
		
		Text.Clear();
		Text.Add("Looking at Lagon's supine form, your eyes trail over his naked body until they are drawn like magnets to the tantalizing hint of his rear.", parse);
		Text.NL();
		if(first)
			Text.Add("Lagon might not have the nicest of butts that you've seen, but you can't help but remember him squealing and moaning in bliss when you and Vena punished him in front of his children. It's a memory that makes you salivate hungrily; you know you have to have a repeat performance.", parse);
		else
			Text.Add("You know that, though he'd sooner die than admit it, Lagon loves the feeling of cock up his ass. He's not that different to his son at heart - though you have to admit that Roa has the sexier butt. Either way, you know you want another taste of that.", parse);
		Text.NL();
		Text.Add("Decision made, you reach down to your loins, ", parse);
		if(strapon)
			Text.Add("making sure that your trusty strap-on is firmly fixed in place and ready to be used.", parse);
		else
			Text.Add("stroking[oneof] your [cocks] until it rises proudly, ready to be buried into hot, little bunny-buns.", parse);
		Text.NL();
		Text.Add("Thus prepared, you sashay towards the bed, where Lagon watches you warily. He opens his mouth, probably to demand that you explain yourself, when you cut him off by draping yourself over him, gently squashing him under your upper torso.", parse);
		Text.NL();
		Text.Add("Now that he's pinned helplessly beneath you, you lean closer to his ear and whisper to him that you're going to fuck him like a little bitch. You assure him that you're going to pin him to the bed here and feed your [cock] up his tailhole until he's gagging on it.", parse);
		Text.NL();
		Text.Add("Lagon's eyes go wide in horror, making you giggle with glee before you continue.", parse);
		Text.NL();
		Text.Add("Crooning lasciviously, you ask if Lagon can feel it already, if he can picture your cock squeezing through his tight ring and sliding into the warmth of his ass. Purring, you tell him that you can already feel every nook and cranny of his asshole wrapped around your dick, slowly stretching around your girth until he fits you just perfectly, like a sex-toy custom-made for you.", parse);
		Text.NL();
		
		player.AddLustFraction(0.4);
		
		Text.Add("Your [tongue] flicks teasingly past your lips as you promise Lagon that you're gonna grind his prostate dry, wringing out every last drop of bunny-batter his aching balls can make until he's painted himself from head to toe in his own spunk.", parse);
		Text.NL();
		Text.Add("Can he picture it already? Because you sure can...", parse);
		Text.NL();
		Text.Add("Lagon shudders against you, and for a moment you think you hear the faintest of moans. <i>“That’s disgusting!”</i> he spews.", parse);
		Text.NL();
		Text.Add("You laugh mockingly at Lagon, even as you reach between the two of you with your free hand. Your fingers wrap themselves purposefully around the bunny's turgid erection, hot and hard in your palm. As you do, you taunt him; if he finds the idea so disgusting, then why is his cock all stiff like this, hmm? You squeeze his dick gently for emphasis, stroking its sensitive length in the process.", parse);
		Text.NL();
		Text.Add("<i>“That’s...”</i>", parse);
		Text.NL();
		Text.Add("Exactly right? The very thing he’s been dreaming of? Well, he doesn't need to worry, you won't keep him waiting anymore. Even as you say this, you start to ease your weight off of Lagon, sliding back down his body until you are looming above his legs.", parse);
		Text.NL();
		Text.Add("Sensing an opportunity presenting itself, Lagon prepares to kick you off, but when the actual kick comes, it’s slow, predictable, and far too easy to intercept.", parse);
		Text.NL();
		Text.Add("With a deft flick of your wrists, you capture Lagon's ankles and move his legs out of the way. Even for a wimpy lagomorph, this is way too slow, almost as if he had no intention of actually kicking you.", parse);
		Text.NL();
		Text.Add("<i>“Let go of me!”</i> He struggles vainly one more time, or rather, ‘struggles’.", parse);
		Text.NL();
		Text.Add("You just grin hungrily down at him. With a sing-song voice, you taunt the bunny about how he can’t lie to you, not when his body is screaming “yes” far louder than his mouth is screaming “no”. He <b>wants</b> you... and, lucky him, you’re ready to give yourself to him.", parse);
		Text.NL();
		Text.Add("<i>“I’m warning you, if you so much as...”</i>", parse);
		Text.NL();
		Text.Add("Smirking, you ask if you just heard the word ass, because you're about to enjoy a fine one. Even as you say this, you pull his legs tight so that you can align your [cockTip] with his tailhole.", parse);
		Text.NL();
		Text.Add("<i>“No! Sto- Ah!”</i>", parse);
		Text.NL();
		Text.Add("Ignoring Lagon’s cries, you press forward, cutting him off in mid-plead as you grind against the clenched ring of his asshole.", parse);
		Text.NL();
		Text.Add("<i>“D-damn yoooh!”</i>", parse);
		Text.NL();
		//#Lagon cums
		if(first)
			Text.Add("You stop in sheer surprise; you knew Lagon was a slut at heart, but you didn’t think he’d cum <b>this</b> early!", parse);
		else
			Text.Add("You chuckle and settle back to enjoy the show as Lagon’s body betrays the real him once again.", parse);
		Text.NL();
		Text.Add("Lagon arches his back until he nearly lifts himself off of the bed, his cock spewing seed at the ceiling above. Low as it is, even he doesn’t have enough energy to paint the roof white, with each arc of semen merely falling back on his body like perverse rain. A pity he was white to begin with, as the cum blends in so well with his fur.", parse);
		Text.NL();
		Text.Add("You watch in amusement as Lagon sprays himself from head to stomach in it, plastering himself so thickly that you can see the cum washing down his sides before his cock finally goes limp. As the winded lapin pants for air, you reach out and scoop a sizable clump of jism in your palm.", parse);
		Text.NL();
		Text.Add("You cheekily thank Lagon for being so thoughtful as to provide his own lube, even as you start to massage it into your [cock]. Eyeing your handiwork with a critical look, you reach out and scoop off a second handful, and then a third, not stopping until your dick is dripping with Lagon’s own seed.", parse);
		Text.NL();
		Text.Add("He doesn’t reply or otherwise react to your taunts; all he can do is pant as he looks at your action in equal parts abject horror and lust.", parse);
		Text.NL();
		Text.Add("Assured of your lubrication, you align your [cockTip] with Lagon’s tailhole again and start to push yourself inside.", parse);
		Text.NL();
		
		let timesFucked = lagon.sex.rAnal || 0;
		
		Sex.Anal(player, lagon);
		lagon.FuckAnal(lagon.Butt(), p1cock, 3);
		player.Fuck(p1cock, 3);
		
		parse["knothilt"] = p1cock.Knot() ? "knot" : "hilt";
		if(timesFucked < 5) {
			Text.Add("So. Fucking. <b>TIGHT</b>!", parse);
			Text.NL();
			Text.Add("That's the only thought going through your mind as you try to force yourself inside the near-virginal bunny bottom before you. Thankfully, Lagon seems to be afraid of being hurt if he actively tried to keep you out, but that's the only mercy you have.", parse);
			Text.NL();
			Text.Add("Not helping matters is that Lagon keeps trying to get away, vainly reaching back and clutching at the sheets in an attempt to drag himself back across the bedding to escape your probing [cock].", parse);
			Text.NL();
			Text.Add("You impatiently wrap your fingers around his boyish hips and pull him back, using that to lever yourself deeper inside. Thank the spirits you were able to score that lube earlier, you don't even want to <b>think</b> about what it'd be like to fuck him dry...", parse);
			Text.NL();
			Text.Add("The pace is almost excruciatingly slow, but you are persistent. With each heartbeat, another inch or so disappears under Lagon’s tail, until finally he has taken you ", parse);
			if(p1cock.Knot())
				Text.Add("up to your [knot].", parse);
			else
				Text.Add("to the hilt.", parse);
		}
		else if(timesFucked < 10) {
			Text.Add("Lagon tries to clench down, as much from instinct as from pure spite, but he cannot deny the effort that has gone into reshaping his once-virginal anus.", parse);
			Text.NL();
			Text.Add("With precise movements and careful pressure, you force yourself through his ring and start to slide yourself inside. Loose and smooth, all Lagon's clenching does is increase the friction you feel as you glide into his depths, sending tingles of pleasure racing up your spine.", parse);
			Text.NL();
			Text.Add("<i>“Ugh! Pull it out!”</i> he protests.", parse);
			Text.NL();
			Text.Add("Smirking, you ask why you would do that, when it looks like he's having so much fun. You tap the tip of his cock for emphasis, smearing the pre-cum already beading from its tip in the process.", parse);
			Text.NL();
			Text.Add("<i>“I am not! I demand you stop this now!”</i>", parse);
			Text.NL();
			Text.Add("You just shake your head and tune him out, focusing on pushing deeper and deeper into the warm, welcoming depths of his ass - no matter what he says, his body will always be honest.", parse);
			Text.NL();
			Text.Add("Lagon curses and squirms, but he can't hope to keep you from gliding inside until finally he has taken you ", parse);
			if(p1cock.Knot())
				Text.Add("to your [knot].", parse);
			else
				Text.Add("to the hilt.", parse);
		}
		else if(timesFucked < 20) {
			Text.Add("Lagon scowls up at you, defiantly clenching his asshole as tight as he can. He manages to deny your initial probing, but you won't be stopped by a feeble trick like that.", parse);
			Text.NL();
			Text.Add("In a single powerful thrust, you force yourself through. In anyone else, this might hurt, but Lagon's ass opens to receive you, allowing you to drag him almost completely down your length in one smooth motion.", parse);
			Text.NL();
			Text.Add("Despite his best efforts, Lagon moans like a slut as you finish burying yourself inside of him. He glares up at you, a mortified blush painting his cheeks red even through his fur, and tries to resist.", parse);
			Text.NL();
			Text.Add("His ass starts to clench down, rippling around you as he tries to push back from you... at least, that's his official intention. All he does by clenching his anus is surround your cock with tight, warm flesh, the rippling more like an attempt to milk you than anything. As for his attempts to push you out, it feels more like he's humping you back - from where you are.", parse);
			Text.NL();
			Text.Add("You just grin down at him smugly, resisting the urge to pet him on the head. He might bite you.", parse);
		}
		else if(timesFucked < 30) {
			Text.Add("With a loose bunny-butt like this, there's no need to hold yourself back. Grabbing Lagon by the hips so he can't even think of trying to get away, you slam your cock right up his ass in one mighty thrust.", parse);
			Text.NL();
			Text.Add("Lagon's tailhole opens up to welcome you, greedily sucking down your shaft. His eyes roll in their sockets, his jaw falling slack in an incoherent moan of pure pleasure.", parse);
			Text.NL();
			Text.Add("His stupor only lasts a few seconds, but the burning of his cheeks shows its impact. Scowling furiously, he glares up at you and clenches down in an effort to deny your advance.", parse);
			Text.NL();
			Text.Add("Supple as his tunnel is, all it does is add a delicious bit of extra tightness, enticing you press on in your quest to bury yourself to the [knothilt] in Lagon's ass.", parse);
			Text.NL();
			Text.Add("The last few inches of your shaft glide home, and Lagon lets out a half-sob of bliss, clenching down extra hard. You don't know if he's even trying to push you out now; all his efforts do is lock you firmly in place, ensuring you can't even try to back out.", parse);
			Text.NL();
			Text.Add("You chuckle at his enthusiasm, but you need a little room to move here. Slowly, at first, you start to gyrate your hips, each motion stirring his innards with teasing brushes of dickflesh. You know he can't hope to resist this...", parse);
			Text.NL();
			Text.Add("Lagon whimpers softly, face screwed up in pleasure and anguish, visibly fighting to keep his asshole clenched down tightly on your invading [cock]. But in the end, it's inevitable.", parse);
			Text.NL();
			Text.Add("A lapin mewl of desire echoes through the room as his anus starts to spasm, greedily milking your cock whilst still giving you the ability to move. Now you can start to <b>really</b> fuck his ass...", parse);
		}
		else {
			Text.Add("Denial is a thing well beyond Lagon's meager reach at this point. Trained and shaped by long, hard and rigorous fucking, the fallen tyrant's asshole has become a proper boy-pussy.", parse);
			Text.NL();
			Text.Add("No sooner has your [cockTip] slipped through the soft, pliant opening of his anus than it greedily sucks you in, its rippling walls pulling you into its depths with no effort on your own part.", parse);
			Text.NL();
			Text.Add("Lagon gasps sharply, a bitter expression falling into its comfortable place on his scowling face, and he furrows his brow. To an outside observer, he may look like he's trying to deny your attempts to invade his tailhole... but the truth couldn't be any more different.", parse);
			Text.NL();
			Text.Add("Lagon's body yearns for your cock, it <b>craves</b> your cock, and it will not be denied. Walls of soft, warm flesh ripple around you, milking your shaft even as it gobbles you down to the very [knothilt].", parse);
			Text.NL();
			Text.Add("The humiliated lapin cries out in dismay, but you pay his words no heed, too fascinated by the show before you. No sooner has he hilted you than his body starts to hump back and forth along your length, grinding into you with the fervor of an enamored slut.", parse);
			Text.NL();
			Text.Add("Truly, this is a wondrous experience to have, one you intend to savor as long as possible...", parse);
		}
		Text.NL();
		Text.Add("Now that you have yourself properly embedded in your unwilling lover's ass, it's time to enjoy yourself.", parse);
		Text.NL();
		Text.Add("With a little effort, you manage to find yourself a nice position - one that's comfortable for you, and which lets you have the room you need to start fucking, but which also allows you to pin Lagon's hips in place. Don't want your little boytoy getting any funny ideas about trying to escape whilst you're busy, after all.", parse);
		Text.NL();
		Text.Add("Squeezing Lagon's hips for luck, you slowly pull back, drawing yourself free until only your [cockTip] lingers inside. And then you thrust home, sheathing yourself again in a single fierce motion.", parse);
		Text.NL();
		Text.Add("Your expertly-aimed dick grinds right into Lagon's prostate as it goes, making his cock visibly bulge before it spurts pre into the air to splatter onto his already-sodden chest.", parse);
		Text.NL();
		Text.Add("You grin hungrily at Lagon, contemplating aloud just how many thrusts it will take before he cums again...", parse);
		Text.NL();
		Text.Add("Any protests the former tyrant might have are silenced under a flurry of gasps, groans and moans. The humiliation is clear in his face; he won’t even turn to look you in the eye as he scowls at the pleasure you’re forcing unto him.", parse);
		Text.NL();
		if(!strapon) { //Real
			Text.Add("You thrust eagerly into Lagon’s ass, savoring the feeling of his warm, tight tunnel rippling across the length of your [cock]. Pleasure washes through you, the visceral thrill of pounding a tight little bunny-butt. And a more than willing one at that; even through the haze of lust clouding your vision, you can see that Lagon’s feeble facade has finally fallen away in the face of what you are doing to him.", parse);
			Text.NL();
			Text.Add("Lagon writhes beneath you, an honest expression of naked bliss writ upon his face. Lost in the throes of his own lust, he mewls and coos with glee, humping back against you in his need to fill his ass with your cock.", parse);
			Text.NL();
			Text.Add("You can feel that selfsame [cock] throbbing with need, oozing pre-cum to fill Lagon’s asshole as you glide through its slickened depths. You start to pant, sharp and harsh, as the fire of lust roars through your body, seeping into your very bones and clouding your mind.", parse);
			Text.NL();
			if(p1cock.Knot()) {
				Text.Add("Your [knot] throbs in time with the racing of your heart, aching to be used. Driven by the need to breed this bunny-bitch, you pull on Lagon’s hips, struggling to drive your bulbous flesh through his tight ring.", parse);
				Text.NL();
				Text.Add("Lagon gasps and squeals, wriggling feverishly - not to get away, but to try and help you push your [knot] inside. The two of you pump and thrust, squirming together in a tangle of limbs. You bite your lip in exertion, a dim spike of pain and a faint taste of copper making it clear you’ve drawn blood, but you cannot stop now - not when you’re so close!", parse);
				Text.NL();
				Text.Add("With one last mighty push, a savage thrust that makes Lagon squeal in pain-tinged pleasure, you force the bloated bulb of flesh into the tight embrace of his ass, anchoring you both together.", parse);
			}
			else {
				Text.Add("On pure instinct, you angle your [cock] to grind against Lagon’s prostate, rewarding his honesty by ensuring the most tender part of him is stroked and caressed with each pass of your lustily thrusting maleness.", parse);
				Text.NL();
				Text.Add("You can feel him responding with the same eagerness, milking you with all the skill he possesses, tight walls of hot flesh clenching, releasing and rippling along your shaft in time with your thrusts.", parse);
			}
			Text.NL();
			//#Lagon cums
			Text.Add("Lagon’s face contorts in pleasure, and no amount of denial can hide the bliss he feels as his cock erupts like a volcano of jism, sending ropes of white arcing through the air to splatter on his fur. The smell of sex saturates the room, egging you on as the erotic scene plays before your eyes.", parse);
			Text.NL();
			Text.Add("You grind into the bunny’s used asshole with renewed vigor, Lagon’s butt matches your enthusiasm by milking you with each spasm of the blissed out lagomorph, and you find yourself rapidly approaching your inevitable climax.", parse);
			Text.NL();
			parse["k"] = p1cock.Knot() ? Text.Parse(", driven by pure instinct even despite your anchored [knot]", parse) : "";
			Text.Add("Huffing and panting, your control rapidly fraying, you squeeze Lagon tight and thrust home as deeply as you can[k]. A wordless cry of pleasure echoes through Lagon’s chamber as you let yourself fly into the welcoming warmth of his tailhole, spilling your seed with abandon.", parse);
			Text.NL();
			
			let cum = player.OrgasmCum();
			
			if(cum > 9) {
				if(p1cock.Knot())
					Text.Add("If you could spare the brainpower, you'd be so very thankful for your [knot] right now; it keeps Lagon from just flying off your dick from the sheer force of your orgasm.", parse);
				else
					Text.Add("You would marvel at how Lagon manages to stay atop your [cock] even as it erupts like a semen volcano, if you had the free thought processes to do so.", parse);
				Text.NL();
				Text.Add("A thick torrent of spooge rushes up Lagon's tailhole, visibly slamming into his guts. The lapin's stomach starts to swell like some obscenely rapid pregnancy, growing out thick and heavy as it fills with your cum. It visibly sloshes and ripples as he writhes on your cock, and it just keeps on growing, until it eclipses his straining, drooling bunny-dick and looms in your vision like a perverse moon.", parse);
				Text.NL();
				Text.Add("You wonder for one brief, terrifying second if Lagon is going to pop... but you were worried for nothing. Lagon is a bunny to the core; he's <b>born</b> to stretch like this around loads of gooey dick-cream. Even as you spurt your last splurt of seed, Lagon hugs his bloated belly tightly in his arms, crooning in bliss at being stuffed so full.", parse);
			}
			else if(cum > 6) {
				Text.Add("A tidal wave of cum roars up Lagon's ass, spraying with such vigor that it easily reaches his stomach. With deceptive sluggishness, Lagon's belly starts to grow, bulging outwards with each teeth-clenching spurt of seed from your straining cock.", parse);
				Text.NL();
				Text.Add("Rounder and riper, he grows, until he's cradling his belly in his arms like an expectant mother, crooning blissfully at being so full. He lets out a soft sigh of relief when he feels your exhausted cock going limp inside of his ass, sprawling limply back amongst his bedding.", parse);
				Text.NL();
				Text.Add("You can feel the occasional twitch from the bunny-butt wrapped around your dick, but it seems to be nothing but pure instinct, coming on the heels of such a well-given fucking.", parse);
			}
			else if(cum > 3) {
				Text.Add("Your [cock] spews a thick tide of hot, sticky jism up Lagon's hungry asshole, the moaning bunny greedily drinking up every last drop you have to spare. You can feel his ass working as you cum, milking you in order to ensure you give him all you have, and you happily comply.", parse);
				Text.NL();
				Text.Add("By the time you finally spend yourself, going limp even as Lagon involuntarily wriggles restlessly on the end of your dick, his belly visibly bulges, filled and heavy with your seed.", parse);
			}
			else {
				Text.Add("You happily empty yourself into Lagon's ass, hot and sticky semen slurping perversely around your dick. The bunny's ass ripples around you, greedily swirling your seed over your cock as it works it deeper inside, but once you've painted his tunnel white, you're completely out of cum.", parse);
			}
			
			Text.NL();
			
			if(player.NumCocks() > 1) {
				if(cum > 6) {
					Text.Add("Your other dick[s2] rain[notS2] down [itsTheir2] sticky payload all over the exhausted lagomorph’s face and chest. By the time you’re done, the former king is thoroughly glazed in your cock-cream, and his mattress is getting soggy from your excessive gift.", parse);
				}
				else if(cum > 3) {
					Text.Add("Not to be outmatched, your other dick[s2] shoot[notS2] [itsTheir2] sticky payload all over Lagon’s face and chest, providing him with a generous glaze of cock-cream.", parse);
				}
				else {
					Text.Add("Your other dick[s2] spurt[notS2] strands of hot seed all over the former lagomorph king’s front, further adding to his utter humiliation.", parse);
				}
				Text.NL();
			}
			
			Text.Add("You pant heavily, wiping some sweat from your brow with the back of your hand. When you can breathe clearly, you cheerfully announce to Lagon that you feel much better now, before mischievously asking how he feels.", parse);
			Text.NL();
			Text.Add("The bunny just groans, sprawling bonelessly on his bed. One ear twitches a little and a bleary eye flicks towards you, but he shows no sign of responding, or even that he recognizes what’s going on.", parse);
			Text.NL();
			parse["k"] = p1cock.Knot() ? Text.Parse(", struggling a little to free your [knot]", parse) : "";
			parse["c"] = cum > 6 ? "cascades" : cum > 3 ? "flows" : "trickles";
			Text.Add("You chuckle and proclaim that you knew he’d enjoy it if he just gave it a chance. When Lagon still says nothing coherent in response, you figure he’s had enough. Carefully, you pull yourself out of his ass[k], and watch proudly as seed [c] forth.", parse);
			Text.NL();
			Text.Add("You wipe the spooge dripping from your cock off on Lagon’s tail, which has miraculously managed to stay relatively dry during your fervent fuckfest, and then step away from the bed. You pull your [armor] back on and then knock on the door for the guards to let you out.", parse);
		}
		else { //strapon
			Text.Add("You may not be getting much physical pleasure out of this, but the sight of Lagon writhing helplessly on the end of your trusty [cock] more than satisfies you. The still-proud fallen king is teetering on the edge, clinging to what's left of his pride for dear life... but you won't stop until you've pushed him over.", parse);
			Text.NL();
			Text.Add("With methodical thrusts, you continue plowing Lagon's ass, each time angling your faux-dick to scrape and grind his most sensitive spots. Each time you press on his prostate, pre spurts vividly from his cocktip, drizzling back down his shaft or splattering on his belly. Smirking wickedly, you make a little game of counting the shots, loudly noting each jet of liquid pleasure.", parse);
			Text.NL();
			Text.Add("Any protest or witty response the former tyrant might be able to come up with is silenced by his gasps of pleasure as you hump him. Even so, he does his best to maintain the scowl of detestation plastered on his face, though you do note his expression changes to one of bliss every few thrusts. If only he were more honest with himself, you could see Lagon being a cute little bunbun, but since he wants to do this the hard way...", parse);
			Text.NL();
			Text.Add("You pick up the pace, thrusting quicker and harder with each pass, until you are really hammering Lagon’s butt. You have to stop your little counting game because you can’t keep up anymore, a constant stream of pre-cum flowing down Lagon’s dick like a perverse volcano.", parse);
			Text.NL();
			Text.Add("He writhes and squirms, moaning ecstatically, all attempts to hide his pleasure thrown from his brain. In his scramble-witted state, the real Lagon is exposed to you: an unabashed buttslut, who lives for the feeling of cock up his ass. His mewls reach a fever pitch - you know he can’t hold out much longer...", parse);
			Text.NL();
			
			//#Lagon cums
			
			Text.Add("Lagon’s cock explodes in a shower of jism, almost as much as the first time he came. It spatters down on his prone body, further messing up his already matted fur. You just watch in amusement as his constant spurts seemingly change in direction and intensity depending on how you grind your [cock] up his ass.", parse);
			Text.NL();
			Text.Add("You wait until Lagon’s dick makes one last shot, a feeble drizzle of semen that drips onto his drenched fur, before you carefully ease your [cock] back from his gaping anus.", parse);
			Text.NL();
			Text.Add("Smirking down at him, you contemplatively comment that it looks like Lagon had quite a lot of fun already.", parse);
			Text.NL();
			Text.Add("Lagon pants, too winded to throw back one of his normal curses, instead trying to glower at you through exhausted eyes.", parse);
			Text.NL();
			Text.Add("Still smirking, you tap your chin, feigning thoughtfulness, and cheerfully observe that you think he has it in him for at least one more round...", parse);
			Text.NL();
			Text.Add("He grits his teeth. <i>“F-fuck you...”</i>", parse);
			Text.NL();
			Text.Add("Well, if he insists!", parse);
			Text.NL();
			Text.Add("A hoarse grunt spills from Lagon’s lips as you drive your [cock] back inside. You keep your pace slow and even, a smoothly steady advance to avoid being painful on the weary bunny, but you can tell from the shudder that ripples across his body that he feels every inch of your passage.", parse);
			Text.NL();
			Text.Add("Not that he seems to really mind, overly much; you can feel him clenching down, squeezing your artificial dick so hard that you’re aware of the tightness. Not to be denied, you keep pushing onwards, refusing to stop until you’ve reach as deep as you can go.", parse);
			Text.NL();
			Text.Add("You hold yourself there for a moment, watching Lagon visibly struggle to compose himself, readjusting to being filled like this. And then you start to pull out again, sliding back until only your [cockTip] remains inside before thrusting home again. You keep the pace steady and smooth, not rough but making sure that he feels each surge of motion in a continuous loop of friction.", parse);
			Text.NL();
			Text.Add("Lagon moans and groans, twitching feebly on the end of your pseudo-prick as you relentlessly plow his ass. He’s clearly wracked with pleasure, but too tired to really respond to it - or to hold out against it.", parse);
			Text.NL();
			Text.Add("No sooner has the thought crossed your mind than Lagon arches his back, a shrill squeal echoing through his room as his cock explodes for a third time. Thin, watery jets of semen spurt from his cock, drizzling weakly across his torso. After the first half dozen or so twitches of his dick, he seems to run dry, but it keeps on jerking for a good half a minute more, running on pure instinct.", parse);
			Text.NL();
			Text.Add("You watch, fascinated, as it finally falls limply back against its host, splatting weakly in a puddle of semen. You try to tease Lagon about running out of spunk so quickly, but there’s no response. Looking closer, you realise that your playmate has gone and passed out on you!", parse);
			Text.NL();
			Text.Add("Well... there’s not a lot more that you can do, now. And while you wouldn’t say this was truly sating, it was certainly plenty of fun in its own right.", parse);
			Text.NL();
			Text.Add("You whistle to yourself cheerful as you pry your [cock] free of the fainted bunny’s butt. Leaving him sprawled in a heap, his own spooge slowly seeping into his bedding, you start making yourself presentable. Unscrewing your strap-on, you tuck it away with the rest of your gear, and then fetch your [armor] from the table.", parse);
			Text.NL();
			parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
			parse["c"] = party.Num() > 1 ? Text.Parse(" rejoin [comp] and", parse) : "";
			Text.Add("Once you’re fully dressed, you calmly approach the door and knock on it, until the guards let you out to[c] be on your way.", parse);
		}
		Text.Flush();
		
		player.subDom.IncreaseStat(75, 1);
		TimeStep({hour: 1});

		Gui.NextPrompt(function() {
			MoveToLocation(WORLD().loc.Burrows.Throne, {minute: 15});
		});
	}

	export function ScepterEntry() {
		let player = GAME().player;
		let lagon = GAME().lagon;
		
		let parse : any = {
			playername : player.name,
			scepter : "scepter" //TODO
		};
		
		let first = !(lagon.flags["Usurp"] & LagonFlags.Usurp.NiceFirst);
		lagon.flags["Usurp"] |= LagonFlags.Usurp.NiceFirst;
		// Set flag
		lagon.flags["Usurp"] |= LagonFlags.Usurp.NiceFlag;
		
		Text.Clear();
		if(first) {
			Text.Add("You study the sulking lapin idly, even as you reach into your belongings and retrieve the [scepter]. You don't know if this is going to work, but what's the worst that could happen, right? Besides, it might do him some good - certainly can’t do him any bad.", parse);
			Text.NL();
			Text.Add("<i>“What are you going to do with that?”</i> he asks, at least a little alarmed.", parse);
			Text.NL();
			Text.Add("Tapping the head of the [scepter] against your palm, you smirk at Lagon, casually quipping that you were thinking of giving him a little attitude adjustment - see if you can improve his disposition.", parse);
			Text.NL();
			Text.Add("Lagon just glares at you and gets ready to bolt, even though he has nowhere to run to in this cell, it seems he’s not above giving you a proper chase.", parse);
			Text.NL();
			let dex = player.Dex();
			let goal = 40;
			if(GetDEBUG()) {
				Text.Add("Dex check: [dex] (vs [goal])", {dex:dex, goal:goal}, 'bold');
				Text.NL();
			}
			if(dex >= goal) {
				Text.Add("Lagon may be quick, but you're quicker. Before he can even leap from his seat, you have crossed the distance between you, a hand snapping around his throat like a collar and forcing him back into the chair.", parse);
				Text.NL();
				Text.Add("Mockingly, you click your tongue at him as you shake your head in disapproval. That's no way for a prisoner to behave... but no mind, you'll teach him some better manners soon enough.", parse);
				Text.NL();
				Text.Add("<i>“I demand you release me this instant, you wretch!”</i>", parse);
				Text.NL();
				Text.Add("Idly, you reply that you’ll do so in good time. Even as you say this, you tune out his response, thrusting the tip of the [scepter] against Lagon’s forehead.", parse);
			}
			else {
				Text.Add("You try to lunge for the lagomorph, but even if he’s not as strong as he used to be, he’s certainly plenty quick. Lagon nimbly slips beneath you, weaving around his table and dashing for the door.", parse);
				Text.NL();
				Text.Add("You scramble upright and dash after him again, nearly knocking the table flying in your haste. Lagon's first thought proves his downfall; the guards locked it as soon as you were inside, and that gives you the opportunity to grab him by the throat and hoist him off of his feet as he vainly struggles to get it open.", parse);
				Text.NL();
				Text.Add("<i>“Let go of me, you stupid wretch!”</i>", parse);
				Text.NL();
				Text.Add("You angrily give him a shake, upset that he made even this much of a fool out of you. Still steamed at what he tried, you roughly march him back over to his seat and shove him into its waiting arms before pressing the tip of the [scepter] to his temple - somewhat rougher than he probably deserves, really.", parse);
			}
			Text.NL();
			Text.Add("Lagon yelps in shock as the [scepter] clangs into his head, glowering up at you... for all of a heartbeat, before the [scepter] does its work. He goes stiff as a board, quivering as its magic washes into his vulnerable mind. You see his face contort into one of anger, until it shifts to one of confusion, then he shudders as his eyes slowly sink shut and he goes limp.", parse);
			Text.NL();
			Text.Add("You wait a few seconds longer, just to be sure the magic has really seeped in, and then you remove the [scepter]. You stow it away amongst your belongings again, and then turn back to observing Lagon. He sits in his seat, slumped like a puppet whose strings have been cut, only the rise and fall of his chest indicating he still lives.", parse);
			Text.NL();
			Text.Add("For a moment, you wonder if you might have gone a little too far...", parse);
			Text.NL();
			Text.Add("It takes a bit longer than you’d like, but eventually Lagon seems to be coming to.", parse);
			Text.NL();
			Text.Add("Smirking, you ask if he doesn't feel silly now to have made such a fuss - that wasn't so bad after all, now was it?", parse);
			Text.NL();
			Text.Add("Lagon takes a moment to shake the confusion out of his eyes, then looks at you and smiles. <i>“Hi, [playername]! What brings you?”</i>", parse);
			Text.NL();
			Text.Add("This catches you off-guard. Not just the words, but the feelings behind them. Even as you suspiciously study him, Lagon just smiles innocently back. The rage and contempt that always seemed to be boiling under his skin is just... gone. He seems at peace now, for the first time you can ever recall.", parse);
			Text.NL();
			Text.Add("Cautiously, you reply that you wanted to spend some time with him.", parse);
			Text.NL();
			Text.Add("<i>“Oh? Okay! What do you want to do? Wanna have sex? Maybe you’d like to fuck my butt? I should have tried that much sooner... honestly didn’t know buttsex could feel this good.”</i> He chuckles.", parse);
			Text.NL();
			Text.Add("Grabbing for something to hold onto in the face of this verbal deluge, you start to compliment Lagon on admitting it, only for the excited bunny to cut you off.", parse);
			Text.NL();
			Text.Add("<i>“Of course, if you’d rather, I can also fuck you instead. I love getting fucked, but you’re a guest, so we’ll do whatever you want.”</i> He smiles.", parse);
			Text.NL();
			Text.Add("...Wow. Just... wow. You planned on something like this, but this level of change in personality is nothing short of miraculous. There’s, like, nothing at all in common between this Lagon and the Lagon you know. You wonder for a moment if this is Lagon as he used to be - whether this might be the bunny who won Vena’s love and loyalty. You certainly wish he’d stay like this; this version of Lagon is a lot more approachable.", parse);
			Text.NL();
			Text.Add("Friendlier or not, though, he’s still staring at you expectantly. So you better figure out what you want to do with him; no need to strain his new brain by making him wait.", parse);
		}
		else { //Repeat
			Text.Add("Paying no attention to Lagon's initial query, you stride directly towards the resentful rabbit. Although he glowers up at you, he clearly doesn't suspect anything until it's too late; the moment you get close enough, your hand shoots out and latches onto his shoulder, forcibly pressing him into his seat.", parse);
			Text.NL();
			Text.Add("<i>“What the hell do you think yo-”</i>", parse);
			Text.NL();
			Text.Add("Having reached into your belongings and retrieved the [scepter] with your free hand, you cut Lagon off in mid-outrage by jabbing it into his temple.", parse);
			Text.NL();
			Text.Add("His surprise and outrage gives way to anger, before its magic crashes into his mind with the fury of a tidal wave. He visibly twitches, quivering in his seat as he tries to wrestle against the foreign influence on his thoughts, but to no avail.", parse);
			Text.NL();
			Text.Add("His angry glower slowly shifts to an expression of confusion, the rage dimming from his eyes and being replaced with befuddlement. Still shuddering slightly, his eyelids slowly sweep shut, slamming closed with the inevitability of a sealed tomb.", parse);
			Text.NL();
			Text.Add("You wait until he goes limp in his chair, visibly slumping back against it, and then you delicately remove the [scepter] from his forehead and tuck it away in your belongings, then you turn your attention back to Lagon.", parse);
			Text.NL();
			Text.Add("He's still passed out in his seat, all innocent and vulnerable looking. Leaning closer, you start to pet him, gently running your palm over his scalp as if he were a faithful dog. Bending closer to his ears, you sing-song that it’s time to wake up.", parse);
			Text.NL();
			Text.Add("<i>“Hmm, oh?”</i> Lagon opens his eyes, looking at you in confusion for a moment before it registers who you are. <i>“Hi, [playername]! I’m so glad you came to visit! What brings you?”</i> He smiles.", parse);
			Text.NL();
			Text.Add("Smiling back, you consider your options; now that this improved version of Lagon is ready for you, what <b>do</b> you want to do with him?", parse);
		}
		Text.Flush();
		
		TimeStep({minute: 15});
		
		LagonDScenes.ScepterPrompt();
	}

	export function ScepterPrompt() {
		let player = GAME().player;
		let lagon = GAME().lagon;
		
		let parse : any = {
			manwoman : player.mfTrue("man", "woman"),
			playername : player.name
		};
		
		let options = [];
		options.push({nameStr : "Sex",
			tooltip : Text.Parse("Since he’s so eager to please, how about the two of you spend some quality time together?", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("With a grin, you tell Lagon that you’d love a nice fuckfest.", parse);
				Text.NL();
				Text.Add("<i>“Good choice, I love sex! What are we doing? You going to tap my bunny butt? Or do you want my carrot?”</i> He asks, spreading his legs and showing you his shaft, already in the process of getting hard.", parse);
				Text.NL();
				Text.Add("You can’t hold back a laugh; you thought his kids were eager, but Lagon puts them all to shame when it comes to sluttiness.", parse);
				Text.NL();
				Text.Add("<i>“Hmm, I’m feeling really pent up.”</i> He licks his lips. <i>“And you’re so sexy that I can barely hold back… hmm, I’m so lucky! Don’t take too long to decide!”</i>", parse);
				Text.NL();
				Text.Add("You better make your mind up quick, he doesn’t look like he can take waiting too long...", parse);
				Text.Flush();

				LagonDScenes.ScepterSexPrompt();
			}
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
			Text.Add("After a moment’s thought, you tell Lagon that you just wanted to say hello.", parse);
			Text.NL();
			Text.Add("<i>“Hi!”</i> he replies happily.", parse);
			Text.NL();
			Text.Add("Smiling, you tell him that it’s good to see he’s doing well, and that you really would like to spend some more time with him, but unfortunately you’re a busy [manwoman], so you can’t stay this time.", parse);
			Text.NL();
			Text.Add("<i>“Oh… that’s okay.”</i> He smiles, even though he looks at least a little disappointed.", parse);
			Text.NL();
			Text.Add("You assure him that you will come back when you have the time, and then turn towards the door. You knock on it for one of the guards to let you out.", parse);
			Text.NL();
			Text.Add("<i>“[playername], if you don’t mind, can you please send one of my sons in?”</i>", parse);
			Text.NL();
			Text.Add("You turn back towards Lagon. He looks at you with a hopeful expression, attempting innocence - but you can see the gleam of lust in his eyes. Well, if you’re not going to play with him, it would be a shame to let his good mood go to waste...", parse);
			Text.NL();
			Text.Add("Smiling, you assure him that you’ll send someone right along, just as the door swings open. The happy grin on Lagon’s face is enough to convince you; once you step through, you turn to one of the guards and tell him that his father would like to see him.", parse);
			Text.NL();
			Text.Add("The guards look at each other for a moment before one of them shrugs and goes inside, closing the door behind it. His brother locks the door behind him and salutes you.", parse);
			Text.NL();
			Text.Add("Amused, you salute him in return, and turn to leave. You haven’t gotten far down the tunnel when lapine moaning echoes back to you from Lagon’s chamber. Looking back over your shoulder, you see the other guard looking through the window in Lagon’s door, an expression of surprise giving way to one of envy. You chuckle to yourself in amusement and keep heading to the throne room.", parse);
			
			let guard : any = new LagomorphElite(Gender.male);
			
			Sex.Anal(guard, lagon);
			lagon.FuckAnal(lagon.Butt(), guard.FirstCock(), 0);
			guard.Fuck(guard.FirstCock(), 0);
			
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(WORLD().loc.Burrows.Throne, {minute: 30});
			});
		});
	}

	export function ScepterSexPrompt() {
		let player = GAME().player;

		let parse : any = {
			
		};
		
		let options = [];
		options.push({nameStr : "Pitch anal",
			tooltip : Text.Parse("If he’s that eager to get his ass tapped, why not oblige him?", parse),
			enabled : player.BiggestCock(null, true),
			func : function() {
				LagonDScenes.ScepterPitchAnal();
			}
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
			Text.Add("<i>“Okay! You’re the guest, so we should do whatever you want.”</i> He smiles.", parse);
			Text.Flush();
			LagonDScenes.ScepterPrompt();
		});
	}

	export function ScepterPitchAnal() {
		let player = GAME().player;
		let party : Party = GAME().party;
		let lagon = GAME().lagon;

		let p1cock = player.BiggestCock(null, true);
		let strapon = p1cock.isStrapon;
		let parse : any = {
			playername : player.name,
			stuttername : player.name[0] + "-" + player.name
		};
		parse = player.ParserTags(parse);
		parse = Text.ParserPlural(parse, player.NumCocks() > 1);
		parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
		
		lagon.flags["JSex"] |= LagonFlags.JailSex.PitchAnal;
		
		Text.Clear();
		Text.Add("Lasciviously licking your lips, you tell Lagon to spin around and let you get a good look at that cute little rump of his.", parse);
		Text.NL();
		Text.Add("Lagon grins. <i>“Sure thing!”</i> He hops up on his feet and turns around, bending over his chair as he does his best to push out his butt. <i>“Like this?”</i> he asks, wiggling his boyish ass and his bunny tail.", parse);
		Text.NL();
		parse["c"] = strapon ? Text.Parse(" you fix your [cock] in place and", parse) : "";
		Text.Add("You let out a wordless noise of approval, absently nodding your head even as you start to strip out of your [armor]. Your gear falls into a pile on the floor and is unceremoniously kicked aside before[c] you strut towards your eager playmate.", parse);
		Text.NL();
		Text.Add("Lagon's tail twitches as he manages to stick his ass out another inch or two, begging for you to take him. But you're in no hurry; you want a chance to savor this first.", parse);
		Text.NL();
		Text.Add("The bunny patriarch doesn't have much of an ass - not compared to his son Roa, anyway. It's small and tightly packed, a boyish butt. Still, when you reach out and run your hands over it, there's an appeal to the firmness of it. It may not be too big, but what spare flesh there is fits nicely into your squeezing mitts.", parse);
		Text.NL();
		Text.Add("<i>“How do you like my bunny-bum?”</i> He asks with a small chuckle. <i>“Good enough to eat?”</i>", parse);
		Text.NL();
		Text.Add("You chuckle and tell him that’s exactly what you were thinking. You squeeze his ass for luck, and then carefully lower yourself to the floor, bringing your face down to the proper level. The bunny’s butt cheeks gently held between your fingers, you carefully pry them apart, just enough to expose the little pink ring of his pucker.", parse);
		Text.NL();
		Text.Add("Your tongue slips past your lips, audibly slurping for Lagon’s benefit, and then you give him a big, wet, sloppy lick from the bottom of his taint, all the way to the base of his tail, smearing a glistening trail across his asshole as you go.", parse);
		Text.NL();
		Text.Add("<i>“Oh! I love that! It was such a thrill when Vena ate me out...”</i>", parse);
		Text.NL();
		Text.Add("Well, at least he took something away from that scene in the Pit. But you won’t allow that to distract you. Instead, you keep licking his ass, dragging your tongue slowly up his taint and over his pucker until you deem that he’s wet enough on the outside.", parse);
		Text.NL();
		Text.Add("Now, to take care of the inside... Drawing closer, you press the [tongueTip] of your [tongue] against his anus and start to push, gently but insistently. Despite himself, Lagon clenches down, but he can’t hope to keep you out. Your dexterous tongue slowly wriggles its way inside, tickling against the sensitive interior and then feeding through when Lagon flexes open.", parse);
		Text.NL();
		Text.Add("<i>“Yes, eat me out like I’m your slut. Ah… I feel like a bitch in heat… so good!”</i>", parse);
		Text.NL();
		Text.Add("With him cheering you on like that, you are more than happy to comply.", parse);
		Text.NL();
		if(player.body.LongTongue()) {
			Text.Add("Anyone else, you might be worried about going overboard, but if anyone can take it, this sluttybun can. Spurred on by that thought, you feed your [tongue] deeper and deeper into Lagon’s ass, twisting and twirling it as you caress every inch. The taste of him washes over your senses, driving you to fill him to the brink.", parse);
			Text.NL();
			Text.Add("<i>“Unf! You’re so deep!”</i> he cries out, bucking back against you. <i>“Mm, more!”</i>", parse);
		}
		else {
			Text.Add("With Lagon so blatantly on-board with this, you assault his ass mercilessly. You lap and suckle, twirling your tongue around as you eat out his boypussy with unrestrained enthusiasm. You don’t stop until you’ve wormed your way as deep inside as you can possibly get, leaving you pressed between his cheeks in a perverse kiss.", parse);
			Text.NL();
			Text.Add("<i>“Ah! Yes! This feels so good, [playername]. Go deeper! ”</i> he cries out, bucking back against you.", parse);
		}
		Text.NL();
		Text.Add("How can you possibly deny a request like that?", parse);
		Text.NL();
		if(player.sexlevel >= 3) {
			Text.Add("Fortunately for Lagon, you’re not some naïve little virgin. If he wants your tongue, you’re happy to give it to him, and then some. You pull out every trick you’re aware of, twisting your probing flesh with practiced expertise and caressing all of the most intimate nooks and crannies you can find.", parse);
			Text.NL();
			Text.Add("<i>“Ah yes! Yes! I’m gonna-”</i> Lagon never gets to finish as a cry of pleasure cuts his sentence short. Ropes of his spent seed fly through the air to spatter on his chair, but he’s too far gone to care. All he can do is clench his butt as you continue to eat him out, and spill every last drop of himself.", parse);
			Text.NL();
			//#Lagon cums
			Text.Add("When you’re sure that you’ve wrung the last drop from him, you pull your head away from his ass, your [tongue] linked by a thin strand of spittle for a second before it breaks.", parse);
		}
		else {
			Text.Add("Unfortunately, even you can’t make him cum with just your tongue. You’ll need to try something a little more... involved.", parse);
			Text.NL();
			Text.Add("Lagon whimpers in disappointment as your [tongue] slurps wetly from between his ass cheeks, his attempt to clench you in place only serving to push you free. His dismay is quickly lost when your hand reaches up between his legs and closes on his cock, already throbbing fit to burst.", parse);
			Text.NL();
			Text.Add("You eagerly start to pump away, squeezing and releasing as you glide back and forth along his shaft. Pre-cum drips onto your fingers, Lagon’s hips quivering at your touch, and you know he can’t hope to hold out much longer.", parse);
			Text.NL();
			Text.Add("<i>“Oh yes! You’re gonna make me cum! - Ah! - I-I’m aaah!”</i> Lagon never gets to finish as a cry of pleasure cuts his sentence short. Ropes of his spent seed fly through the air to spatter on his chair, but he’s too far gone to care. His cock continues to throb in your hand, painting it with some of his jism as the jets die down into a trickle.", parse);
			//#Lagon cums
		}
		Text.NL();
		Text.Add("Smiling, you admire your handiwork proudly. Patting Lagon’s ass, you tell him that you’re very proud of his efforts.", parse);
		Text.NL();
		Text.Add("<i>“Thanks a lot, [playername]. I’m happy that I’ve made you proud, but do you think you could find a nice carrot to fill my bum? Getting eaten out like that was so sexy that I’m super horny now.”</i>", parse);
		Text.NL();
		Text.Add("You chuckle at the bunny’s enthusiasm; you were almost worried for a second there that he wouldn’t be up to a second round. You would have hated to have to quit so early in the game.", parse);
		Text.NL();
		Text.Add("<i>“Of course not!”</i> He laughs. <i>“I spend most of my day here in this little room, bored to death, hoping for someone like you or my dear wife-queen to visit. I’d never quit on you without a few rounds at least.”</i>", parse);
		Text.NL();
		Text.Add("Well, that’s certainly reassuring. A far cry indeed from Lagon’s usual selfishness. Smiling to yourself, you affectionately pat the bunny’s boyish butt and tell him that he can have his carrot in a moment. You just need to make sure he’s properly lubed up first...", parse);
		Text.NL();
		Text.Add("Reaching around Lagon’s hip, you scoop his jism off of his chair, scraping off a nice thick wad into your palm. As quickly as possible, you transfer it to his ass, pushing two fingers into his dripping hole in order to massage his seed into his stretched ring.", parse);
		Text.NL();
		Text.Add("<i>“Oh! [playername], you’re so nice to me...”</i>", parse);
		Text.NL();
		Text.Add("Chuckling, you assure him that it's the least you can do for a little cutiebun like him. Even as you speak, you keep pumping and stroking his gaping pucker, rubbing every nook and cranny to get him nice and wet for you.", parse);
		Text.NL();
		Text.Add("Finally, you deem him wet enough; you pull your fingers free and playfully swat his ass, telling him that he's good to go now.", parse);
		Text.NL();
		Text.Add("<i>“Thanks, but what about you?”</i>", parse);
		Text.NL();
		Text.Add("Feigning innocence, you ask what he means by that.", parse);
		Text.NL();
		Text.Add("<i>“Surely, there’s something little old me could do for you,”</i> he suggests with a sultry gaze, taking your hand in his and sucking on your fingers provocatively, cleaning them of any remaining cum.", parse);
		Text.NL();
		Text.Add("You chuckle and remove your fingers from his mouth with a pop. Lightly, you quip that you suppose there is a thing or two he could do for you. As you say this, you tenderly brush his lips with your thumb, letting him puzzle out what you mean.", parse);
		Text.NL();
		Text.Add("<i>“Hehe, sure. I’m not very good at it, but I think I might’ve picked something up from when my daughters and Vena blew mine.”</i>", parse);
		Text.NL();
		Text.Add("Grinning, you reply that practice makes perfect.", parse);
		Text.NL();
		Text.Add("<i>“Alright then, just sit back and let me handle everything,”</i> he says, pushing you towards his bed.", parse);
		Text.NL();
		Text.Add("You’re more than happy to comply, letting him lead you to his makeshift nest. You casually drop down amongst the linen and pillows, wriggling around a little to make yourself comfortable, and then adjust your position so that your [cocks] [isAre] bared for Lagon’s perusal.", parse);
		Text.NL();
		if(!strapon) {
			if(player.NumCocks() > 1) {
				Text.Add("<i>“So many beautiful cocks to choose, I don’t know where to start,”</i> he says, licking his lips.", parse);
				Text.NL();
				parse["paircluster"] = player.NumCocks() == 2 ? "pair" : "cluster";
				Text.Add("You look down your waist at your [paircluster] of dicks, wondering which one to choose. Finally, you look him in the eye and meaningfully tap the [cockTip] of your [cock], telling him that he should start with the biggest, juiciest one of all.", parse);
				Text.NL();
				Text.Add("<i>“Yes, of course. Gives me more to work with.”</i> He grins.", parse);
				Text.NL();
			}
			Text.Add("Lagon crawls onto his bed, looking at you with hungry eyes fit for a true slut. He leans closer, sniffing your [cock] appreciatively.", parse);
			Text.NL();
			Text.Add("<i>“Such an exotic bouquet. Fitting for such a beautiful cock.”</i> He smiles.", parse);
			Text.NL();
			Text.Add("Mischievously, you clasp your cock and gently swish it through the air, lightly bopping the lusty lapin on the nose with it. He instinctively recoils, rubbing his little snout in confusion, and you teasingly chide him for getting carried away. After all, beautiful as it is, your dick’s not going to suck itself, now is it?", parse);
			Text.NL();
			Text.Add("<i>“Hehe, sorry about that. You’re right. I just never really stopped to appreciate a cock properly. I think I can see why Roa likes it so much.”</i>", parse);
			Text.NL();
			Text.Add("You tell him that it’s okay. But still, it’s time to get to work now; the real fun comes later.", parse);
		}
		else {
			Text.Add("<i>“Umm, I’m not sure how good it’ll feel for you since this isn’t a real cock,”</i> he says with a hint of disappointment, <i>“but if you still want me to blow it, I’ll happily do so,”</i> he offers with a smile. <i>“As you said, practice makes perfect, right?”</i>", parse);
			Text.NL();
			Text.Add("You nod your approval, telling him that’s exactly right. He doesn’t need to worry about you, you’ll get more than enough pleasure at of watching him work.", parse);
			Text.NL();
			Text.Add("<i>“Okay then.”</i>", parse);
		}
		Text.NL();
		Text.Add("Lagon strokes your length briefly before opening his mouth and extending his tongue, letting your [cockTip] slide inside past his lips.", parse);
		Text.NL();
		Text.Add("You purr your approval, resisting the urge to thrust your hips. This is Lagon’s chance to shine, and you tell him to show you what he’s got.", parse);
		Text.NL();
		Text.Add("Lagon tries to comply, truly he does. But... really, the best thing you can say about it is that he’s enthusiastic. He keeps gagging when he tries to deepthroat your dick, and whilst he can lick you quickly, or bob his head back and forth along your shaft, he can’t really manage to do both at the same time.", parse);
		Text.NL();
		if(strapon)
			Text.Add("Honestly, it’s probably for the best that he’s just doing this to give you a bit of extra lubing. To his credit, he’s leaving a pretty thick spitshine on your [cock]. Even with that in mind, it’s a little embarrassing to sit here and watch him struggling like this. A pity you can’t make his attitude adjustment permanent, give him a chance to really get some practice in...", parse);
		else
			Text.Add("He does manage to coax your [cock] erect, to his credit. He even manages to get some pre-cum beading off of your [cockTip]. But you’re not going to be getting off anytime soon, not from this. The faces he pulls as he tastes your pre only emphasizes that.", parse);
		Text.NL();
		Text.Add("Finally, Lagon slips off of your cock, licking his lips sheepishly. He can hardly bring himself to look at you.", parse);
		Text.NL();
		Text.Add("<i>“I guess this wasn’t very good for you?”</i>", parse);
		Text.NL();
		Text.Add("You don’t say a word; you just quietly shake your head and let the silence speak for you.", parse);
		Text.NL();
		Text.Add("<i>“Sorry, I thought I’d enjoy this more… but at least you’re still hard, and I’m sure you’re going to like my butt.”</i>", parse);
		Text.NL();
		Text.Add("You give him a small smile in return, and promise him that you’re confident that you’ll enjoy his ass a lot more.", parse);
		Text.NL();
		Text.Add("Lagon smiles and turns around, presenting himself to you. <i>“Here. Mount me hard and enjoy yourself to the fullest.”</i>", parse);
		Text.NL();
		Text.Add("Now grinning more sincerely, you push yourself up and reach out to clasp hold of Lagon’s tight little bunny buttocks. You loom over the kneeling lapine, bringing your [cock] nestling against his tail as you grip his hips. Drawing back a little, you align your [cockTip] with his pucker, looking for any sign of hesitation.", parse);
		Text.NL();
		Text.Add("When there is none, you start to press home.", parse);
		Text.NL();
		
		Sex.Anal(player, lagon);
		lagon.FuckAnal(lagon.Butt(), p1cock, 3);
		player.Fuck(p1cock, 3);
		
		let timesFucked = lagon.sex.rAnal;
		
		parse["knotbase"] = p1cock.Knot() ? "knot" : "base";
		
		if(timesFucked < 5) {
			Text.Add("Goddamn, but he’s fucking <b>tight</b>! You can tell he was a virgin until not too long ago because this is like trying to screw a frigging hole about two sizes too small for you! Despite Lagon’s wishes, his butthole squeezes itself as tightly shut as it can in an effort to keep you out, and once you get past that, there’s the too-narrow passage itself to deal with.", parse);
			Text.NL();
			Text.Add("Good thing you used so much lube; you’d hate to even think about what it’d be like trying to fuck him dry...", parse);
			Text.NL();
			Text.Add("Of course, even with all that lube easing you in, that doesn’t fix the other problem. Despite the way he’s clearly wincing at being spread open like this, Lagon keeps trying to push back against you as if to atone for his tightness with enthusiasm.", parse);
			Text.NL();
			Text.Add("You can appreciate the sentiment and all, but he’s going to hurt himself if he keeps it up. So, much as you’d rather not, you’re forced to pin him down and hold him still, allowing you to focus on taking it slowly and carefully.", parse);
			Text.NL();
			Text.Add("The pace is almost excruciatingly slow, but you are persistent. With each heartbeat, another inch or so disappears under Lagon’s tail, until finally he has taken you ", parse);
			if(p1cock.Knot())
				Text.Add("to just before your [knot].", parse);
			else
				Text.Add("to the very hilt.", parse);
		}
		else if(timesFucked < 10) {
			Text.Add("All this practice he’s getting is starting to pay off. Although he still clenches down on pure instinct when you first press your [cockTip] against his entrance, Lagon promptly takes a deep breath and palpably relaxes, allowing you to ease your way inside.", parse);
			Text.NL();
			Text.Add("Past his opening, his inexperience still shows in how tight he is; although you have to be careful, it’s still much easier to squeeze forward than it once was. In fact, you have to spend more energy holding him down than you do on wriggling through; he’s enthusiastic, but you don’t want him to hurt himself by getting carried away.", parse);
			Text.NL();
			Text.Add("With the thick coating of lube squelching over your shaft, you steadily push your way inside, not stopping until Lagon has taken you ", parse);
			if(p1cock.Knot())
				Text.Add("to just before your [knot].", parse);
			else
				Text.Add("to the hilt.", parse);
		}
		else if(timesFucked < 20) {
			Text.Add("Lagon has come a long way indeed from the days of his anal virginity. With all the practice he’s gotten, only the initial clenching of his anus around your intruding [cockTip] shows any sign of resistance. Even then, it’s merely a token display.", parse);
			Text.NL();
			Text.Add("In fact, Lagon promptly starts pushing back against you himself, and although you keep your hands on his hips just in case, between his experience and the thick layer of lube sliding across your length, there’s no need to worry.", parse);
			Text.NL();
			Text.Add("Quickly and easily, Lagon backs up into your hips, your cock rapidly vanishing up his tailhole until he has taken you ", parse);
			if(p1cock.Knot())
				Text.Add("to just before your [knot].", parse);
			else
				Text.Add("to the hilt.", parse);
		}
		else if(timesFucked < 30) {
			Text.Add("Lagon’s anal virginity is a thing of the past now. Almost pussy-like, his anus gapes to welcome you in, his tunnel speeding you through with such enthusiasm that you almost wonder if you needed to bother lubing him up in the first place.", parse);
			Text.NL();
			Text.Add("Over half your [cock] ends up inside of Lagon’s ass in the first thrust, and you’re positive that you could have hilted yourself if you were trying. Lagon moans - the deep, ecstatic lowing of a buttslut being filled - and gyrates his hips, grinding back against you and greedily gobbling down the rest of your dick. Only when your [knotbase] presses against his pucker does he stop pushing back, and even then he continues to grind impatiently against you.", parse);
		}
		else {
			Text.Add("There’s no need for the slightest hesitation on your part, no need for concern over hurting Lagon’s butt anymore. This is the ass of a true buttslut, trained to perfection. Even your efforts at lubing him were more foreplay than necessity.", parse);
			Text.NL();
			Text.Add("No sooner has your [cockTip] breached the warm, welcoming ring of Lagon’s anus than his tunnel starts to ripple. Muscles flex and twitch, striving to draw you deeper inside and sate his carnal hunger. Loosening your grip on his hips, you grin and let Lagon do all the work, the bunny’s ravenous boypussy sucking your shaft as he eagerly thrusts back.", parse);
			Text.NL();
			Text.Add("In a single powerful flex of his hips, he’s taken you as deep as ", parse);
			if(p1cock.Knot())
				Text.Add("your knot allows,", parse);
			else
				Text.Add("he possibly can,", parse);
			Text.Add(" but it’s not enough. His ass ripples and squeezes, trying to milk you even as he thrusts with his hips, pumping himself across your cock a couple of times before settling down, content he has you as far as he can take you.", parse);
		}
		Text.NL();
		Text.Add("<i>“Aah... I love your dick, [playername]. This feels wonderful; how about you? You liking my ass?”</i>", parse);
		Text.NL();
		Text.Add("Purring lustfully, you assure him that you’re <b>loving</b> his ass; it’s truly a piece of work, all warm and tight.", parse);
		Text.NL();
		Text.Add("<i>“Hehe, thank you! Now, you’re the guest, so you go at your own pace. It’s a bit difficult, but I’ll try to hold myself back. Fuck me as hard or as lightly as you want, and don’t worry about pulling out when you’re close to cumming. I don’t mind if you decide to fill me full of your dick-milk and make me your bitch. Enjoy yourself!”</i>", parse);
		Text.NL();
		if(!strapon) {
			Text.Add("You need no further encouragement. Hands wrapped around his hips, you start to thrust, slowly at first - to get a proper gauge of him - and then faster and faster. Hot, tight flesh wraps around you, stroking with velvety softness across your shaft each time you push in, then tightening as you try to pull out.", parse);
		}
		else {
			Text.Add("If he’s so eager to begin, you see no reason not to get started. Holding on to help yourself balance, you start to thrust with your hips; you need to be a little more careful than someone with a real cock might, but Lagon certainly doesn’t seem to care about the difference. He mewls and wriggles, squirming deliciously on the end of your trusty strap-on, a sight almost tailor-made to get you horny.", parse);
			player.AddLustFraction(0.4);
		}
		Text.NL();
		Text.Add("As you relentlessly pound Lagon’s ass, his moans of pleasure echo in your ears, bringing a smile of joy to your face. The once-proud and defiant tyrant, reduced to a slut writhing at having his ass filled. He begs you to fuck him like the whore he is, squealing in glee as you grind your [cock] into his prostate, making his own dick drool pre-cum all over his bedding. He’s having the time of his life, and you know that the old him would rather curl up and die than admit it.", parse);
		Text.NL();
		if(player.SubDom() <= -15)
			Text.Add("If you’re going to be honest, you kinda miss the old Lagon. Sure, he was an asshole and a tyrant, but at the same time you found a certain thrill in being bossed around by the bastard. This new Lagon is much nicer, more receptive, dare you say, even caring. However, the way he acts is not nearly as exciting as his old self.", parse);
		else
			Text.Add("The old Lagon was such an asshole, but his new self is much more receptive. Where the old Lagon would be cursing and making death threats, this one only moans and begs for more, as if having your [cock] up his ass was the greatest thing ever. It inflames you with a desire to own this bun-slut below, to make him your bitch, and you find yourself pounding him all the harder for that.", parse);
		Text.NL();
		Text.Add("<i>“Ahn! [stuttername], I think I’m gonna cum!”</i>", parse);
		Text.NL();
		Text.Add("Absently, you grunt that if that’s what he wants, then he can go ahead. You don’t mind.", parse);
		Text.NL();
		Text.Add("<i>“Is it really - Oh! - okay for me to cum now? You haven’t cum even once yet. Plus it’ll be - Ah! - m-messy and I- Eep!”</i>", parse);
		Text.NL();
		Text.Add("Impatient with Lagon’s feeble attempts at prevarication, on your next retreat you pull your [cock] completely free of his gaping ass. Before he can think to clench down and ruin your carefully-pounded hole, you snatch him up by the waist and haul him into the air, spinning him around and dropping him so that he bounces back to the mattress, this time facing up towards you.", parse);
		Text.NL();
		Text.Add("<i>“Oof!”</i>", parse);
		Text.NL();
		Text.Add("With a bestial growl, you lunge for him again, grabbing his thighs and spreading his legs wide before plunging your dick home again. He’s still so stretched out that you can easily stuff yourself back inside of him, making him moan as you crush his prostate.", parse);
		Text.NL();
		Text.Add("His throbbing cock deposits a thick smear of pre-cum on his belly, and once you’ve caught your breath, you tell him that this sorts out the mess. If he cums all over himself, he can just take a bath after you’re done with him and rinse off any <i>mess</i>.", parse);
		Text.NL();
		Text.Add("<i>“G-good call!”</i>", parse);
		Text.NL();
		Text.Add("You give him a feral grin, and then start to thrust again, this time able to drink in the sight of him as you ravage his ass. Lagon’s eyes are wide and staring, his mouth hanging open in pleasure, and this beautiful vision gives you a surge of vigor. Spurred on to new heights, you pound him even harder and faster than before, until both of you grunt and gasp with the effort.", parse);
		Text.NL();
		//#Lagon cums
		Text.Add("<i>“Aaah! [playername]!”</i> he cries out as his throbbing shaft spurts a jet of cum into the air.", parse);
		Text.NL();
		Text.Add("On pure instinct, you drive your dick into the rabbit-morph’s ass as deep as you can, allowing you to hold his hips up with your own. Your hands grab for Lagon’s cock, holding the pulsating organ steady as you aim its tip for Lagon’s torso.", parse);
		Text.NL();
		Text.Add("Most of the lusty bunny’s jism winds up on his chest, though a few strands miss their mark and wind up hitting the lagomorph’s face - not that he seems to mind.", parse);
		Text.NL();
		Text.Add("You keep Lagon’s cock on target, watching as he paints himself thoroughly with his own semen; if he wasn’t white already, he’d be pretty pale by the time he finally spurts his last splatter and goes limp. You can feel him trembling against you, and so you gently let go of his dick and take hold of his thighs, allowing him to recover from spending himself so thoroughly.", parse);
		Text.NL();
		Text.Add("He pants as he tries to catch his breath, looking at you as if he had just indulged in a guilty pleasure. <i>“Hmm, I already came twice, but you haven’t cum even once yet… I’m a terrible host.”</i>", parse);
		Text.NL();
		if(!strapon) {
			Text.Add("You tap your lips with a finger, making a show of thinking to yourself as you slowly note that it is true that you haven’t had a climax of your own yet... then - once Lagon’s had a chance to sweat it for a few seconds - you give him a mischievous grin, and add that you’re certain such a nice, little bunny will fix that problem for you.", parse);
			Text.NL();
			Text.Add("<i>“Of course!”</i> He says excitedly, wiping his face clean of his cum. <i>“Anything!”</i>", parse);
			Text.NL();
			Text.Add("Mischievous smile written across your face, you gently stroke Lagon's thighs and pull yourself free of his ass. The bunny can't hold back a quiet whimper of dismay at being emptied, but you don't stop until you're completely out.", parse);
			Text.NL();
			Text.Add("As the cool air tickles your sensitive shaft, you lazily recline back amongst the tangle of pillows and blankets. ", parse);
			if(player.IsNaga())
				Text.Add("You curl your [legs] into a makeshift cushion, looping your coils so that Lagon will have somewhere comfortable to sit. Without thighs to obscure it, your erection[s] jut[notS] boldly towards the ceiling, just waiting to be buried again.", parse);
			else if(player.IsGoo())
				Text.Add("With a thought, the amorphous mass of your legs resculpts itself into a makeshift seat, ensuring that Lagon has a comfy seat and that your cock[s] [isAre] ready to be used again.", parse);
			else
				Text.Add("You spread your [legs] wide, letting him ogle the treasure[s] nestled between your [thighs].", parse);
			Text.NL();
			Text.Add("Casting Lagon a sultry look, you purr that “his majesty's” throne is waiting for him.", parse);
			Text.NL();
			Text.Add("<i>“Oh...”</i> he shifts his gaze away for an instant, grinning nervously. <i>“I’m… not a king anymore you know, but thank you!”</i>", parse);
			Text.NL();
			Text.Add("Chuckling, you assure him that he's welcome, and then fix him with a playfully stern look, asking if he's going to just lie there and let you get cold, or is he going to be a good host and warm your cock up for you?", parse);
			Text.NL();
			Text.Add("<i>“Ah, sorry! Right away!”</i>", parse);
			Text.NL();
			Text.Add("Lagon scrambles up and crawls over your prone body, stopping when he’s in a good position to take your [cock]. He squats and aligns your [cockTip] with his entrance, purposefully lowering himself with the aid of gravity. As well fucked and lubed as he is, the entrance is quick and painless. In the short time you’ve spent inside him, his anus has already adapted and conformed to the shape of your dick.", parse);
			Text.NL();
			Text.Add("Chuckling, you note that fact to the slutty bunny and praise him for his prodigious booty. You can see where Roa got his good <i>ass</i> genes from.", parse);
			Text.NL();
			Text.Add("<i>“Hehe, thank you! You flatter me, [playername].”</i>", parse);
			Text.NL();
			Text.Add("Chuckling, you reply that it'd only be flattery if it wasn't true. Lagon simply beams proudly at your words and focuses on continuing his descent.", parse);
			Text.NL();
			parse["k"] = p1cock.Knot() ? " without him tying himself on your knot" : "";
			Text.Add("Only when he has you deeply embedded in his ass, as far as it’ll go[k], does he stop.", parse);
			Text.NL();
			Text.Add("<i>“There, warm enough?”</i>", parse);
			Text.NL();
			Text.Add("Feigning thoughtfulness, you note that you still feel a <i>little</i> chilly. It's time he started riding you; a bit of exercise with your favorite bunnyslut is just the thing to warm you up.", parse);
			Text.NL();
			Text.Add("<i>“Right away! Can’t get to the creamy insides without work, right?”</i>", parse);
			Text.NL();
			Text.Add("With a smirk, you agree that’s most certainly the case.", parse);
			Text.NL();
			Text.Add("Lagon might not be a very experienced ‘rider’ but with some instructions and your guiding hands on his hips, he’s well on his way towards getting you off.", parse);
			Text.NL();
			Text.Add("Your senses sing as your willing bunnyslut eagerly rides you, tightening down on each downstroke to heighten your pleasure. Even through the haze of lust starting to cloud your vision, you can see Lagon's enjoying himself as well; even after his last two orgasms, his cock is still at half-mast.", parse);
			Text.NL();
			Text.Add("It punctuates each pump along your shaft with a juicy, wet smack against his belly, growing harder and firmer until it can only bob hypnotically in time with his thrusting.", parse);
			Text.NL();
			Text.Add("<i>“Hehe, sorry about - ah! - that. Your dick feels too good, and you’re so hot that I can’t help myself.”</i>", parse);
			Text.NL();
			Text.Add("You let out a half-laugh, cut short as Lagon tightens deliciously around the base of your [cockTip], wringing down on the most sensitive part of your [cock]. When you can manage words again, you assure him that it's alright, just so long as he doesn't <b>stop</b>!", parse);
			Text.NL();
			Text.Add("<i>“I’ve - ahn! - no intention of doing so! By the way, how am I doing? Are you getting close yet?”</i>", parse);
			Text.NL();
			Text.Add("Panting harshly, vision starting to blur, you absently assure him that he’s doing great. You’re - oooh! - so close now...", parse);
			Text.NL();
			if(p1cock.Knot()) {
				Text.Add("<i>“Okay! Then let’s get this big knot of your inside. Bear with me for a bit.”</i> On his next bounce up, Lagon steels himself and then brings himself down with all the strength he can muster, painfully stretching his puckered hole around your knot.", parse);
				Text.NL();
				Text.Add("Even through your pleasure-haze, you can see the pain written on Lagon’s features. ", parse);
				if(timesFucked < 20)
					Text.Add("He must really be blinded by lust to do this. Taking a knot in one thrust is no trick for amateurs to try!", parse);
				else
					Text.Add("Lagon may not be a rookie at this anymore, but he just can’t seem to grasp the subtleties of taking a knot.", parse);
				Text.NL();
				Text.Add("Despite how much pain he's in, Lagon keeps trying, which more than outweighs what pleasure you may be feeling from having him grinding against your [knot].", parse);
				Text.NL();
				Text.Add("You reach up and take him by the hips, firmly pushing him higher up your [cock]. Lagon gives you a sheepish look, then takes a deep breath, allowing you to bring him down in a harder thrust.", parse);
				Text.NL();
				Text.Add("This time, you can feel him stretch around your bulbous flesh, his heroic ring gaping to swallow an inch or two of flesh. Levering him up, you bring him down, and again, until finally he stretches around and swallows your knot, his squeal of pleasure undercut by the most deliciously perverse <b>schlorp</b>.", parse);
				Text.NL();
				Text.Add("<i>“Ah! It’s in! It’s finally in! I feel so wonderfully full!”</i>", parse);
				Text.NL();
				Text.Add("Nothing but a primal howl of lust pours from your throat in return, the feel of Lagon’s muscles crushing your knot in its rapacious embrace too much to stand, pushing you over the edge and causing you to spill yourself into his waiting ass.", parse);
			}
			else {
				Text.Add("<i>“Okay! It’s the final stretch now! Please use my body to get off and rid yourself of all your load. I’ll do my best to take it all in!”</i>", parse);
				Text.NL();
				Text.Add("Growling like a beast, you assure Lagon that's exactly what you wanted to hear.", parse);
				Text.NL();
				Text.Add("You grip him by the thighs, squeezing tight as you start to thrust up to meet him, ensuring the smacking of hips echoes through his room. Your heart is pounding, your breathing heavy and ragged.", parse);
				Text.NL();
				Text.Add("Above you, Lagon groans and squeals, wriggling in delight to meet your every pump, face twisted in ecstasy. This sight, the knowledge of how thoroughly you've torn down Lagon's old self, spurs you on, heightening your pleasure to unbearable levels.", parse);
				Text.NL();
				Text.Add("With a feral roar of pleasure, you thrust yourself as deeply into Lagon's ass as you possibly can, your whole body twitching as you let fly.", parse);
			}
			Text.NL();
			
			let cum = player.OrgasmCum();
			
			if(cum > 9) {
				if(p1cock.Knot())
					Text.Add("If you could spare the brainpower, you'd be so very thankful for your [knot] right now; it keeps Lagon from just flying off your dick from the sheer force of your orgasm.", parse);
				else
					Text.Add("You would marvel at how Lagon manages to stay atop your [cock] even as it erupts like a semen volcano, if you had the free thought processes to do so.", parse);
				Text.NL();
				Text.Add("A thick torrent of spooge rushes up Lagon's tailhole, visibly slamming into his guts. The lapin's stomach starts to swell like some obscenely rapid pregnancy, growing out thick and heavy as it fills with your cum. It visibly sloshes and ripples as he writhes on your cock, and it just keeps on growing, until it eclipses his straining, drooling bunny-dick and looms in your vision like a perverse moon.", parse);
				Text.NL();
				Text.Add("You wonder for one brief, terrifying second if Lagon is going to pop... but you were worried for nothing. Lagon is a bunny to the core; he's <b>born</b> to stretch like this around loads of gooey dick-cream. Even as you spurt your last splurt of seed, Lagon hugs his bloated belly tightly in his arms, crooning in bliss at being stuffed so full.", parse);
			}
			else if(cum > 6) {
				Text.Add("A tidal wave of cum roars up Lagon's ass, spraying with such vigor that it easily reaches his stomach. With deceptive sluggishness, Lagon's belly starts to grow, bulging outwards with each teeth-clenching spurt of seed from your straining cock.", parse);
				Text.NL();
				Text.Add("Rounder and riper, he grows, until he's cradling his belly in his arms like an expectant mother, crooning blissfully at being so full. He actually mewls in disappointment when he feels your cock going limp inside of his ass, having completely exhausted itself.", parse);
				Text.NL();
				Text.Add("You can feel him trying absently to milk you, but it's no use; you've given him everything you have, and he seems to recognize it, given how half-hearted his efforts are.", parse);
			}
			else if(cum > 3) {
				Text.Add("Your [cock] spews a thick tide of hot, sticky seed up Lagon's greedy asshole, the mewling bunny greedily drinking up every last drop you have to spare. You can feel his ass working as you cum, milking you in order to ensure you give him all you have, and you happily comply.", parse);
				Text.NL();
				Text.Add("By the time you finally spend yourself, going limp even despite Lagon's attempts to milk just one last spurt from you, his belly visibly bulges, filled and heavy with your seed.", parse);
			}
			else {
				Text.Add("You happily empty yourself into Lagon's bowels, hot and sticky semen slurping perversely around your dick. The bunny's ass ripples around you, greedily swirling your seed over your cock as it works it deeper inside, but once you've painted his tunnel white, you're completely out of cum.", parse);
			}
			if(player.NumCocks() > 1) {
				Text.NL();
				Text.Add("Even as you unload inside the lagomorph king, your other dick[s2] throb[notS2] in climax, spending [itsTheir2] seed all over you and your fluffy buttslut. Rope after rope of sticky semen spatter on your [belly] and matten Lagon’s white fur, turning you both into sticky messes.", parse);
			}
			Text.NL();
			Text.Add("<i>“Aah! I feel so warm inside.”</i> He chuckles. <i>“Thanks for the creamy load, [playername]. You know you can always count on me to catch your semen when you’re feeling pent up, right?”</i>", parse);
			Text.NL();
			Text.Add("Chuckling back, you assure him that you'll remember that.", parse);
			Text.NL();
			Text.Add("<i>“Vena would love to have you as a partner too, I’m sure of it. Make sure you visit her too sometime. Unlike me, she has a proper pussy to milk your cock[s], and if you knock her up, I’m sure she won’t mind it. We’re a big family, but we still got room for more.”</i> He grins.", parse);
			Text.NL();
			Text.Add("You promise him that you'll keep that in mind for future visits.", parse);
			Text.NL();
			Text.Add("<i>“Now I think I should probably get off of you?”</i>", parse);
			Text.NL();
			Text.Add("You actually take a moment to consider that, then sigh and agree that's probably for the best.", parse);
			Text.NL();
			Text.Add("Lagon hauls himself off you, letting your cock plop out of his ass followed by a satisfying stream of jism. <i>“Oh no! It’s spilling!”</i> Lagon cries out, hurriedly clenching his ass shut. However, given his recent fucking, he’s unable to properly shut it and prevent some of your seed from running out of his well-fucked butt and down his thighs. Some of it does wind up dripping on your half-erect [cocks] though.", parse);
			Text.NL();
			Text.Add("<i>“Dammit! Hold on, I’ll clean that up.”</i>", parse);
			Text.NL();
			Text.Add("You watch with a mixture of pride, amusement and lust as Lagon dives for your smeared [cocks], shamelessly licking you clean. You groan softly in pleasure as his little tongue dabs wetly across your sensitive flesh, lapping your skin clean with efficient strokes.", parse);
			Text.NL();
			Text.Add("You tell him to stop after a few moments, assuring him that you're all clean now.", parse);
			Text.NL();
			Text.Add("<i>“Really? Are you sure? I didn’t get cum anywhere else, did I?”</i>", parse);
			Text.NL();
			Text.Add("Despite your treatment, you know that Lagon doesn't really like the taste of cum; this is being done for your benefit, not his enjoyment. Feeling sated, you decide to be merciful, assuring Lagon that he's taken care of absolutely everything; you're spotless. You just want to catch your breath before you consider leaving.", parse);
			Text.NL();
			parse["lbelly"] = cum > 9 ? " enormous" : cum > 6 ? " pregnant-looking" : cum > 3 ? " full" : "";
			Text.Add("<i>“Okay then. I guess a little rest wouldn’t be so bad. Will also give me some time to digest all of this,”</i> he says, patting his[lbelly] belly.", parse);
			Text.NL();
			Text.Add("You just smile and nod in response.", parse);
			Text.NL();
			Text.Add("<i>“Is there anything else I can do for you?”</i>", parse);
			Text.NL();
			parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your party";
			parse["c"] = party.Num() > 1 ? Text.Parse(" to rejoin [comp]", parse) : "";
			Text.Add("You shake your head to say no, and watch as Lagon happily settles back into his bedding. You lie there quietly, listening as he slowly dozes off, and then gently haul yourself out of bed. After checking to make sure he's still asleep, you pull on your [armor] and walk over to the door, where the guards let you out[c].", parse);
		}
		else {
			Text.Add("You smile and assure Lagon that it’s alright; watching him cumming his brains out is plenty of fun for you as well. Though... if he wants to be a better host, you wouldn’t mind watching him writhing in pleasure on your [cock] again. Not when, from this angle, you can really drink it in as he has himself some more fun.", parse);
			Text.NL();
			Text.Add("To emphasize your point, you run your fingers teasingly across his cock, savoring the way it shivers at your touch.", parse);
			Text.NL();
			Text.Add("<i>“Ah! R-really?”</i>", parse);
			Text.NL();
			Text.Add("Well, to be honest you wouldn’t be opposed if he could try and do something for you too, but you can’t really be angry at him when he’s being such a sweet bunbun. So, for now let’s focus on him.", parse);
			Text.NL();
			Text.Add("<i>“Okay! What do I do?”</i>", parse);
			Text.NL();
			Text.Add("Chuckling, you confess that you would have settled for just those adorable little noises he makes as you give him a proper reaming. But since he’s offering...", parse);
			Text.NL();
			Text.Add("You slide a little closer, allowing you to lean over him, bringing your [breasts] within reach. ", parse);
			let size = player.FirstBreastRow().Size();
			if(size <= 5) {
				parse["nearly"] = size <= 3 ? "" : " nearly";
				Text.Add("Your chest might be[nearly] flat, but Lagon still stares up at it as if hypnotized, his eyes locked onto your [nips] and his cock dribbling in excitement.", parse);
			}
			else {
				Text.Add("Your tits sway gently with the motion, and your grin widens as you watch Lagon’s eyes track their every swish, his cock striving to stand just that little bit straighter, a river of pre-cum running down its shaft.", parse);
			}
			Text.NL();
			Text.Add("Calmly, as if you hadn’t interrupted yourself, you continue that you want him to play with your [breasts]. That is, if he can remember to do that while you’re fucking him...", parse);
			Text.NL();
			Text.Add("<i>“I can at least try, but I don’t know how good I’ll be. When you fuck me, it feels so good that I kinda lose myself.”</i> He chuckles.", parse);
			Text.NL();
			Text.Add("Well, so long as he does his best, like a good host, then he’ll do just fine, you assure him.", parse);
			Text.NL();
			Text.Add("Lagon grins happily up at you, and responds by reaching for your chest with his boyish hands, his touch surprisingly soft even given his current state of mind.", parse);
			Text.NL();
			if(size <= 1)
				Text.Add("Taking your lack of bosom in stride, his fingers instead delicately wrap around your [nips]. With surprising dexterity, he starts to gently pinch and twiddle them, rolling his fingertips around in a caress that sends sparks of pleasure crackling over your body.", parse);
			else if(size <= 3)
				Text.Add("Lagon’s hands may be a little on the small side, but even so, you don’t have that much cleavage for him to play with. Still, he takes it in stride, cupping your perky little mounds and starting to knead them with his fingers.", parse);
			else if(size <= 5)
				Text.Add("Your boobs and his hands are practically made for each other; though you have enough breastflesh that he can really enjoy squishing it between his fingers, you’re not so big that he has to really struggle to encompass you. Each hand wraps itself lovingly around a tit and starts to caress you with dexterous twitches of his digits.", parse);
			else if(size <= 7.5)
				Text.Add("To someone as small as Lagon, your ample breasts are quite succulent indeed, and judging by the look on his face, the little lapin appreciates the chance to play with so much boobage. Struggling to encompass so much breastflesh in either palm, he avidly rubs and strokes you, using all of his hands to pleasure you.", parse);
			else
				Text.Add("Your magnificent mammaries are beyond Lagon’s ability to hold on his own, but that doesn’t stop him. Instead, he gamely wraps both hands around one of your [breasts], stroking the abundant titty-flesh with one whilst the other dexterously plays with your [nip].", parse);
			Text.NL();
			Text.Add("You shiver and purr appreciatively; who knew Lagon had this kind of skill? Maybe that’s one of the reasons his wife is so fond of him...", parse);
			Text.NL();
			Text.Add("<i>“Am I doing a good job?”</i>", parse);
			Text.NL();
			Text.Add("You languidly assure him that he’s doing a <b>great</b> job; just the bit of extra spice you need. Now, time to show how much you appreciate his skill as a host...", parse);
			Text.NL();
			Text.Add("You keep your thrusting slow and gentle; Lagon’s already climaxed twice, and although the spirit is willing, you know the flesh is probably weak. Even these tender pumps are enough to bring Lagon’s cock back out to play, gingerly rising to its full glory once more and starting to dribble pre-cum down its shaft.", parse);
			Text.NL();
			Text.Add("The scent of sex fills the air around you, and you greedily inhale it, drinking deep of the perverse perfume and letting it fill your body with heady warmth. Lagon’s hands dance across your [breasts], a constant tingle of pleasure that races down your spine and pools in your [vag], getting you closer and closer to the edge.", parse);
			Text.NL();
			Text.Add("<i>“Ahn! I’m getting close, [playername]!”</i>", parse);
			Text.NL();
			Text.Add("Panting harshly, you assure him that you know. You quicken your thrusts, steadily pushing back and forth through the lagomorph’s gaping asshole, exulting in every squirm and squeal you wring from your little playmate.", parse);
			Text.NL();
			Text.Add("With one last thrust, you push Lagon over the edge. The lagomorph cries out, screaming your name as his cock throbs and tenses. Even though this is his third orgasm, Lagon’s load is still quite prodigious; he shoots almost as much as the second time, maybe a little less, but still enough to ensure there’s not an inch of the former tyrant’s front that isn’t splattered with seed.", parse);
			Text.NL();
			//#Lagon cums
			Text.Add("Even as Lagon busily paints himself, you seize the moment; his hands have felt good - <b>real</b> good - as they played with your tits, but they just haven’t been enough for you. As Lagon groans and grunts, shuddering with the orgasm wracking his body, you pull yourself free of the confines of his ass.", parse);
			Text.NL();
			Text.Add("Reaching beneath your strap-on, your fingers dive for your quivering quim, plunging between your sopping wet folds as you eagerly reach for your g-spots. Spots dance in your vision as your digits close around your [clit], your body so primed that you just can’t...", parse);
			Text.NL();
			
			let cum = player.OrgasmCum();
			
			Text.Add("Arching your back, you squeal in pleasure as femcum gushes from between your folds, a river of perverse juices that runs down your [legs] and patters like raindrops as it puddles on Lagon’s floor. The world flickers, your mind unable to focus on what’s around you as pure pleasure storms through your brain, leaving you reeling as you struggle to ride out the wave.", parse);
			Text.NL();
			parse["d"] = player.HasLegs() ? "don’t" : "doesn’t";
			parse["g"] = player.IsGoo() ? " - at least, the kind of jelly that <b>can’t</b> support your weight" : "";
			Text.Add("And then, as suddenly as it appeared, it vanishes, leaving you gasping for breath and clinging to Lagon’s bed to keep you from falling over. When your [legs] [d] feel quite so much like jelly[g], you take a look back at Lagon, ready to compliment him on being such a good host.", parse);
			Text.NL();
			Text.Add("Your words die stillborn on your lips, swallowed by an amused grin; Lagon’s gone and passed out! Looks like that third orgasm was just too much for him. Heedless of the semen soaking his fur, he’s sprawled amongst his bedding and snoring softly, completely dead to the world.", parse);
			Text.NL();
			Text.Add("Even if he did need a little encouragement, he did treat you well. So, you spare the time to give his head an affectionate pat and pull some relatively dry sheets over him before you set about fixing yourself up.", parse);
			Text.NL();
			parse["comp"] = party.Num() == 2 ? party.Get(1).name : "";
			parse["c"] = party.Num() > 1 ? Text.Parse(" rejoin [comp] and", parse) : "";
			Text.Add("With your strap-on stowed away amongst your gear and your [armor] back on, you happily saunter over to the door and knock for the guards to let you out, allowing you to[c] head back to the throne room.", parse);
		}
		Text.Flush();
		
		TimeStep({hour: 1});
		
		Gui.NextPrompt(function() {
			MoveToLocation(WORLD().loc.Burrows.Throne, {minute : 15});
		});
	}

	export function Punishment() {
		let player = GAME().player;
		let party : Party = GAME().party;

		let parse : any = {
			playername : player.name
		};
		parse = player.ParserTags(parse);
		
		party.location = WORLD().loc.Burrows.Pit;
		
		Text.Clear();
		Text.Add("With the lapine queen leading you, it doesn’t take long for you to arrive at the warren’s central orgy room - the Pit. As she leads you out of one of the tunnels and onto the floor, you surreptitiously steal a look at your surroundings.", parse);
		Text.NL();
		Text.Add("Whilst the scent of sex still permeates everything - and probably won’t ever come out, at this point - the chamber actually looks a lot cleaner than usual. The bunnies must have given the place some sort of scrub down in preparation.", parse);
		Text.NL();
		Text.Add("As usual, the Pit is filled with lagomorphs - unusually, though, they’re not preoccupied with fucking their brains out. Oh, countless pink rabbit cocks salute you and Vena as you pass, and the dim light catches off of strings of drying cum plastered around mouths, on tits, or seeping from under tails and between thighs. But nobody’s screwing anybody at the moment. Instead, they all watch as their mother-queen strides past, eager to see what will happen.", parse);
		Text.NL();
		Text.Add("The audience just keeps getting bigger and bigger, and for the first time you have some understanding of just how <b>large</b> Vena and Lagon’s brood has grown. Maybe the crazy king’s plans of conquest weren’t so far-fetched after all...", parse);
		Text.NL();
		Text.Add("Your thoughts are stolen as one of Vena’s guards scurries up to her. She leans down to help it whisper into her ear, and then nods her understanding. You watch quietly as she regally strides to the center of the Pit, her own massive cock swishing hypnotically as she walks, dainty tail twitching atop her impressive butt cheeks.", parse);
		Text.NL();
		Text.Add("<i>“Children, long has your father held our home under his tyrannical rule, and today we gather here to judge him for his crimes against his own family.”</i>", parse);
		Text.NL();
		Text.Add("There’s some chatter between the lagomorphs, a few of the less interested ones leave the Pit, supposedly to find another place where they can continue fucking in peace.", parse);
		Text.NL();
		Text.Add("<i>“To preside over this trial, I’d like to call the hero who has defeated my husband, ending his tyrannical rule, and healed me from my drugged state. Please, let’s all give a round of applause to [playername], champion of the lagomorphs!”</i>", parse);
		Text.NL();
		Text.Add("Small hands suddenly shove hard against ", parse);
		if(player.IsTaur())
			Text.Add("your [butt]", parse);
		else
			Text.Add("the small of your back", parse);
		Text.Add(" and you instinctively stumble forward, pushed from the comparative anonymity of the rim to join Vena. The air rumbles like thunder as countless lapine hands enthusiastically clap together, lead in their applause by Vena herself.", parse);
		Text.NL();
		Text.Add("Recovering your dignity, you try and offer a regal wave to the assembly of clapping bunnies, even as a few appreciative cheers and whistles of approval start to add to the din. Now standing beside Vena, the matriarch leans slightly towards you to speak to you.", parse);
		Text.NL();
		Text.Add("<i>“Err… sorry for putting you on the spot like that.”</i>", parse);
		Text.NL();
		Text.Add("Smiling broadly, you keep waving to the crowd, even as you assure Vena that it’s alright.", parse);
		Text.NL();
		Text.Add("<i>“You don’t mind doing this, do you?”</i>", parse);
		Text.NL();
		Text.Add("You concede that it is a little overwhelming, but if she really thinks you need to be shown off to them first, then you understand. Besides, it’s probably the best way to get them into an appreciative mood for what’s to come.", parse);
		Text.NL();
		Text.Add("Vena turns to one of her guards. <i>“Bring in my husband.”</i>", parse);
		Text.NL();
		Text.Add("You watch as the guard nods solemnly, and then darts off towards Lagon’s makeshift cell.", parse);
		Text.NL();
		Text.Add("As the thunderous applause dies down, the guards soon return, the thick crowd parting like water to make a clear path for the prisoner being led along at spearpoint. With the power of his scepter taken from him, and the potions cleared from his system, Lagon has shrunk down to a more typical size for a lagomorph. Indeed, you think he’s on the short side even by their standards - Vena utterly dwarfs her husband, now. But the sheer hate burning in his eyes makes his children recoil, even if his uncanny strength is a thing of the past.", parse);
		Text.NL();
		Text.Add("With only slight trembles betraying them, the guards guide the tired, bitter-looking lapine to the center of the Pit. One bold soul darts forward and kicks Lagon squarely in his rear, knocking his father to his knees. Lagon turns to face his assailant, growling like a beast as he glowers at his son, but a swift poke with a speartip has him turning back to Vena.", parse);
		Text.NL();
		Text.Add("He’s still full of spite and viciousness... but that’s all he’s got left. He’s visibly drained, his powers are gone, and he’s outnumbered easily by a thousand to one. He’s nothing, now.", parse);
		Text.NL();
		Text.Add("<i>“Look what we have here. This is really cute, but don’t you think it’s about time you stopped this charade, Vena? If you give up now and release me, I promise to spare you. In fact, if you stop this farce you call a trial right now, I’d be happy to fuck you all you want. We both know what you are Vena, and how much you love it when you get used.”</i>", parse);
		Text.NL();
		Text.Add("Vena is unfazed by the former King’s taunting words. She takes a deep breath and steps closer to her husband, gently taking his chin in her hand and lifting his face to look up into her eyes. Looking at her, you don’t see a speck of anger; all you see is sadness.", parse);
		Text.NL();
		Text.Add("Lagon growls angrily at that, trying to lose her grip on his chin to no effect. <i>“How dare you, slut! You dare pity me? <b>Your</b> king!?”</i> He finally manages to free himself and looks to address the crowd. <i>“Have all of you lost your fucking mind!? I am Lagon! Your father! Your king! I order you all to stop this act this instant and imprison this slut!”</i>", parse);
		Text.NL();
		Text.Add("Despite his words, not a single lagomorph moves to do as he says. You do note a few of them seem to have visibly shrunk at his words, but they remain otherwise still as he barks like a cornered dog.", parse);
		Text.NL();
		parse["bastardBitch"] = player.mfTrue("bastard", "bitch");
		Text.Add("He then turns to look at you. <i>“And <b>you</b>! You traitorous [bastardBitch]! You, I will never forgive!”</i>", parse);
		Text.NL();
		Text.Add("You just smirk back; Lagon doesn’t frighten you, not in the sorry state he is now.", parse);
		Text.NL();
		Text.Add("Next, he turns to one of the guards. <i>“Arrest them!”</i> The guard looks down at the former King, then up at Vena.", parse);
		Text.NL();
		Text.Add("She simply shakes her head, approaching him and grabbing him by the muzzle, holding it shut as she speaks. <i>“That’s enough, honey. You’re only going to shame yourself further if you keep doing this. Stay quiet and face the punishment for your actions. I wish there was something I could do for you, but you brought this upon yourself.”</i>", parse);
		Text.NL();
		Text.Add("She releases him and looks at a nearby guard. <i>“If he speaks out of order again, shut him up for us, okay dear?”</i> The guard nods and grabs his father’s shoulder, giving him a warning squeeze. Vena takes another deep breath then turns to look at you with a slight smile. <i>“Champion, would you start the trial, please?”</i>", parse);
		Text.NL();
		Text.Add("You nod your acceptance and then turn to face Lagon, taking a deep breath as you muster your thoughts. You know what’s going to happen in the end, but why not make this look good, right? In your best formal voice, you officially declare that Lagon is charged with the crimes of treason, domestic abuse, and unlawful aggression.", parse);
		Text.NL();
		Text.Add("To wit, for the charge of treason; he betrayed his wife to steal the scepter and make himself king of the Burrows, then using alchemy to damage his wife’s mind, reducing her to an empty-minded cum-vessel.", parse);
		Text.NL();
		Text.Add("For the charges of domestic abuse, you elaborate how he has experimented upon his wife and his children with alchemical concoctions, without any concern for their health, safety or consent. He has physically and emotionally abused his children, to the point that at least one child ran away from home rather than suffer his touch anymore, and blackmailed another into helping his experiments by threatening harm to his wife.", parse);
		Text.NL();
		Text.Add("Finally, on the charge of unlawful aggression, he has sought to force his children to assume the role of an army, with intent to unleash this army upon his neighbors, without any justification beyond the desire for conquest.", parse);
		Text.NL();
		Text.Add("<i>“These are all terrible crimes. What do you have to say for yourself, honey?”</i>", parse);
		Text.NL();
		Text.Add("Lagon bursts out laughing. <i>“You’ve got to be joking! Really, this is priceless, but you can stop now. I’ve had enough, so get on with it! The sooner this is over, the sooner I can go back to pounding your pussy, ‘honey’,”</i> he says, voice dripping with venom.", parse);
		Text.NL();
		Text.Add("<i>“Very well, I will now declare your sentence.”</i> Vena turns to look at you. <i>“[playername]?”</i>", parse);
		Text.NL();
		Text.Add("In the same tone as before, you observe that many others would have counseled for Lagon’s exile, his transformation into an alchemically engineered cum-dumpster like his wife once was, or even his execution.", parse);
		Text.NL();
		Text.Add("You pause a moment, waiting to observe the reactions of the crowd and Lagon alike. There’s some hushed whispers between the lagomorphs gathered. You draw attention back to you with a firm, crisp declaration, continuing that despite the severity of Lagon’s crimes, his wife has pleaded for mercy.", parse);
		Text.NL();
		Text.Add("<i>“Typical...”</i> Lagon says, rolling his eyes.", parse);
		Text.NL();
		Text.Add("As imperiously as you can, you declare Lagon’s punishment will be a public fucking, to be carried out here in the Pit once sentencing is complete. After it is ended, the former King shall be placed under indefinite house arrest; he will be secured in a private chamber within the Burrows, guarded by Vena or those she chooses to entrust with the responsibility. Henceforth, he shall remain there, unless Vena deigns to escort him elsewhere.", parse);
		Text.NL();
		Text.Add("Lagon can barely contain his laughter once you give him his sentence. <i>“A public fucking!? Really!? This is hilarious!”</i> He laughs out loud. <i>“Fine then! Who do I have to fuck?”</i> he asks, still laughing.", parse);
		Text.NL();
		
		let p1cock = player.BiggestCock(null, true);
		player.subDom.IncreaseStat(10, 5);
		
		if(p1cock) {
			Text.Add("Smirking knowingly, you turn to Vena and casually ask if you can have first dibs on Lagon’s ass, or if she wants the honor of popping her husband’s black cherry.", parse);
			Text.NL();
			Text.Add("<i>“Wait, <b>what</b>!?”</i> Lagon yelps.", parse);
			Text.NL();
			if(p1cock.isStrapon) {
				Text.Add("<i>“I suppose I would have to do it, since you’re not really equipped for this kind of work.”</i>", parse);
				Text.NL();
				Text.Add("You clarify that you have a handy little toy just made for situations like this. Won’t be quite as messy as hers, but it’ll get the job done just fine.", parse);
				Text.NL();
				Text.Add("<i>“In that case, feel free to do the honors!”</i> She smiles. <i>“Or if you’d rather not get involved, I’m prepared to shoulder the task.”</i>", parse);
			}
			else {
				Text.Add("Vena looks in thought for a second. <i>“Hmm, I’ll let you decide, [playername]. To be honest, I’m not sure I’m very comfortable using my cock, so I would prefer if you did the honors; if you don’t feel like it, I’d be happy to fill my husband’s ass for you,”</i> she replies with a smile.", parse);
			}
			Text.Flush();
			
			let options = [];
			//[PC fuck] [Vena fuck]
			options.push({nameStr : "PC fuck",
				tooltip : Text.Parse("How can you pass up the chance to humiliate Lagon again?", parse),
				enabled : true,
				func : function() {
					Text.Clear();
					Text.Add("With a hungry smile, you tell Vena that you’d like to do the honors.", parse);
					Text.NL();
					Text.Add("Vena nods and steps aside so you can approach the baffled lagomorph.", parse);
					Text.NL();
					Text.Add("<i>“What is the meaning of this! I’m not-”</i>", parse);
					Text.NL();
					Text.Add("You snap for Lagon to shut up. He’s not getting out of this, and frankly he’s had this coming for a long time. Now, he can either bend over and try to enjoy it, or fight and make it hurt. Either way, he’s getting fucked.", parse);
					Text.NL();
					
					player.subDom.IncreaseStat(100, 4);
					
					LagonDScenes.PunishmentPC();
				}
			});
			options.push({nameStr : "Vena fuck",
				tooltip : Text.Parse("There’s just too much delicious irony to turn up the chance to watch Vena dicking her husband for once.", parse),
				enabled : true,
				func : function() {
					Text.Clear();
					Text.Add("With a mischievous smirk and a courtly bow, you ask Vena to do the honors. It would mean so much more if she did it.", parse);
					Text.NL();
					Text.Add("<i>“As you wish!”</i> She smiles happily, sashaying towards Lagon.", parse);
					Text.NL();
					Text.Add("<i>“What’s this!? Vena! I order you to stop this instant or I’ll-”</i>", parse);
					Text.NL();
					Text.Add("<i>“Save it, honey. It’s time for you to pay for your crimes!”</i>", parse);
					Text.NL();
					
					LagonDScenes.PunishmentVena();
				}
			});
			Gui.SetButtonsFromList(options, false, null);
		}
		else {
			Text.Add("With mischievous delight, you turn to Vena and tell her that the trial has ended; she may commence to fucking her husband’s ass whenever she feels ready.", parse);
			Text.NL();
			Text.Add("<i>“Thank you, [playername].”</i> Vena smiles.", parse);
			Text.NL();
			Text.Add("<i>“What!?”</i> Lagon exclaims. Even though his white fur, you’re pretty sure you see him go pale at the revelation.", parse);
			Text.NL();
			Text.Add("Vena giggles as she sashays towards him, gently grabbing his chin and moving his head to look up at her. <i>“What’s the problem, honey? Surely, you didn’t think you would be the one pitching?”</i>", parse);
			Text.NL();
			
			LagonDScenes.PunishmentVena();
		}
	}

	export function PunishmentPC() {
		let player = GAME().player;
		let vena = GAME().vena;

		let p1cock = player.BiggestCock(null, true);
		let strapon = p1cock.isStrapon;
		
		let parse : any = {
			playername : player.name
		};
		parse = player.ParserTags(parse);
		parse = Text.ParserPlural(parse, player.NumCocks() > 1);
		
		Text.Add("As you impatiently start pulling your [armor] from your frame, the panicked lagomorph tries to make a break for it, scrambling away on all fours like an animal in an effort to avoid his imminent dicking.", parse);
		Text.NL();
		Text.Add("Unfortunately for him, it’s no good. The guards block his path with their spears, keeping the deposed tyrant ringed in. As he tries to spot a way out, Lagon is blind to Vena coming from behind. The milfy she-brute bunny pounces on him, her considerably greater size and strength allowing her to pin him effortlessly to the floor.", parse);
		Text.NL();
		Text.Add("<i>“Gah! Get off me!”</i> he protests.", parse);
		Text.NL();
		Text.Add("With Vena having the situation well in hand, you leisurely resume removing your gear. ", parse);
		if(player.Slut() < 30)
			Text.Add("It’s embarrassing to be naked in front of so many hungry eyes, but somehow you manage to go through with it. You need to play your part in this... and, who are you kidding? You <b>want</b> this, or you wouldn’t have said yes to the offer.", parse);
		else
			Text.Add("You can feel the hungry stares from your lapine audience, and you smirk to yourself as you slowly peel off your things. You always did like having an audience, and where are you ever going to have one so large and appreciative of your... <i>talents</i>?", parse);
		Text.NL();
		Text.Add("Soon enough, you are naked as the day you were born, ready for the next step. ", parse);
		if(strapon)
			Text.Add("You fix your [cock] into place around your nethers, making sure it’s locked in good and tight,", parse);
		else
			Text.Add("You reach down and clasp[oneof] your cock[s] and start to pump, caressing yourself until you’re decently hard,", parse);
		Text.Add(" and then strut forward to join the wrestling rabbits. As you approach, you can spot something bobbing between Vena’s thighs, her monstrous maleness more than half-erect itself, and can’t resist the mischievous urge to ask Vena if she’s <i>sure</i> she doesn’t want to be the one fucking her husband this time.", parse);
		Text.NL();
		Text.Add("<i>“Yes, I’m sure. Don’t worry about me, [playername]. Just tell me when you’re ready and I’ll let you handle my husband.”</i>", parse);
		Text.NL();
		Text.Add("<i>“No one’s going to handle me! Let go, you stupid cunt!”</i> he protests.", parse);
		Text.NL();
		Text.Add("Ignoring Lagon’s vulgarity, you finish stepping over to Vena. Conversationally, you ask her if she wouldn’t mind preparing your [cock] for Lagon... that is, if she thinks he deserves it. Could always take him dry if she prefers.", parse);
		Text.NL();
		Text.Add("<i>“Oh, no. I’d be happy to take care of that for you!”</i> she replies eagerly, turning to her guards. <i>“My darlings, would you please hold on to your daddy for mommy?”</i> The guards nod and immediately move to pin the former King with a firm foot on his back.", parse);
		Text.NL();
		Text.Add("<i>“Gah! Let me go, you traitors!”</i>", parse);
		Text.NL();
		Text.Add("<i>“Oh, and keep him quiet, please?”</i> Vena adds, and the guards comply, gagging the king.", parse);
		Text.NL();
		Text.Add("As the kneeling bunnyzon turns back to you, you proudly present her with your [cock], patiently waiting for her to get started. Vena licks her lips and opens her muzzle, extending her tongue like a red carpet ready to welcome you into her maw.", parse);
		Text.NL();
		Text.Add("Without a second’s hesitation, you guide yourself into Vena’s open mouth. You can’t resist the thought that this would probably be icing on the humiliation cake if Lagon was emotionally capable of giving a fuck what Vena does.", parse);
		Text.NL();
		parse["c"] = strapon ? "sopping wet" : "at full mast and dripping pre";
		Text.Add("The lagomorph queen licks you with the unparalleled expertise that only someone who’s spent days sucking cocks is capable of. In moments, she has you [c]. She gives your [cockTip] a parting kiss before she stops, satisfied with her work.", parse);
		Text.NL();
		Text.Add("<i>“I think that’s enough?”</i>", parse);
		Text.NL();
		Text.Add("Taking a moment to admire the shine of your literally spit-polished cock, you nod your agreement and thank her for her efforts.", parse);
		Text.NL();
		Text.Add("<i>“Umm, before you start, maybe I should give my poor husband some help? I think you’re his first...”</i>", parse);
		Text.NL();
		Text.Add("As tempting as it is to say otherwise, you decide to be merciful - more for Vena’s sake than for Lagon’s. With an understanding smile, you graciously tell Vena that she can go and help Lagon however she wants to.", parse);
		Text.NL();
		Text.Add("<i>“Okay!”</i> She crawls towards Lagon’s rear end and grabs his butt cheeks, spreading them so she can gaze at his virginal asshole. There’s a muffled groan of protest from the former King as she does this.", parse);
		Text.NL();
		Text.Add("<i>“Yep, you’re going to be his first. Try not to be too rough on him; we don’t want to hurt him. Oh, and while I’m busy here, feel free to play with me back there,”</i> she says wiggling her hips. <i>“I’m sure my juices would make for better lube,”</i> she adds, before diving into her task.", parse);
		Text.NL();
		Text.Add("Lagon lets out a muffled cry of protest as he feels Vena’s tongue probe his ass, but it quickly turns into a moan as she begins truly rimming him.", parse);
		Text.NL();
		if(player.Slut() < 30)
			Text.Add("That’s an invitation you find hard to refuse. Besides that, it’s only fair Vena gets a bit of fun out of this too, no?", parse);
		else
			Text.Add("Mmm, now that’s an offer you can get behind. There’s just something delicious about the idea of taking wife and husband together, particularly when all their kids are watching you do it.", parse);
		Text.NL();
		Text.Add("As Vena busies herself eating out her husband’s ass, you approach from behind. As you run a finger along your slickened shaft, grinning in anticipation, you savor the opportunity to appreciate the view.", parse);
		Text.NL();
		Text.Add("Vena has proportions that would put any model to shame. She’s got wide flanks, a very spacious butt, thighs that are simply to die for, and strong, svelte legs tipped by surprisingly dainty feet, for a bunny anyway. Taking a closer look, you see that the lagomorph queen’s folds are puffy and dripping with anticipation, a clear sign she’s really looking forward to what you’ll do next, and since you hate to disappoint, you grab her motherly hips and align your [cock] with her entrance.", parse);
		Text.NL();
		Text.Add("She wiggles her hips in further invitation, bucking back just a little to let you know she can’t wait. You have no doubt that if her mouth weren’t otherwise occupied, she’d be making all kinds of cute noises too.", parse);
		Text.NL();
		Text.Add("Eager to please, you start to feed yourself inside of her. Warm, dripping wet folds spread effortlessly in welcome, the matriarch’s well-trained twat almost literally swallowing you down. After your first push, it feels like you don’t have to do anything; you can feel her petals rippling around your [cock], drawing you deeper inside until you bottom out.", parse);
		Text.NL();
		
		Sex.Vaginal(player, vena);
		vena.FuckVag(vena.FirstVag(), p1cock, 3);
		player.Fuck(p1cock, 3);
		
		Text.Add("Even with her mouth occupied, you can hear Vena’s moan of pleasure; this is truly what she lives for, and you’re happy to oblige. Squeezing her generous curves for leverage, you start to draw back, almost audibly squelching as you pull against the suction of her rapacious cunt.", parse);
		Text.NL();
		Text.Add("Only when the very tip of your dick remains inside, teasing the lusty lapin with its presence, do you thrust home again, a single swift push that sees you smacking into her rump as you bottom out again.", parse);
		Text.NL();
		Text.Add("A shiver of pleasure visibly ripples along Vena’s spine, her wooly tail twitching happily, and you gladly start the cycle over again. Pull out, thrust, and pull out again; you slam yourself home without hesitating. Vena takes it all like a champ, her slavering pussy slurping obscenely as you stir her folds. Even as your hips pound away on pure autopilot, your gaze sweeps across the room.", parse);
		Text.NL();
		Text.Add("All around you, bunnies are staring transfixed as you fuck their queen-mother, filling the air with a chorus of appreciative sighs and squeaks as they drink in the sight. Some are so heated up that they’re actually starting their own little gangbangs, but most are content to just enjoy the show.", parse);
		Text.NL();
		
		TimeStep({minute: 30});
		
		if(!strapon) {
			Text.Add("Soon, though, you have no attention to spare for your audience. Vena’s cunt milks away at you like a champ, the velvety touch of her petals threatening to scatter your wits and melt you into a puddle of mush.", parse);
			Text.NL();
			parse["b"] = player.HasBalls() ? Text.Parse(", pressure welling in your [balls]", parse) : "";
			Text.Add("You can feel the tension curling along your spine[b], and you know that you can’t hold it in much longer. From the strangled gasps and groans echoing from your partner, undercut by the obscene slapping as her own cock bounces against her belly, neither can Vena.", parse);
			Text.NL();
			Text.Add("You know that Vena would just love it if you were to give her ever-thirsty womb a good hosing of man-milk... but doing that means you have less cum to fill Lagon with, and drive his humiliation in good and hard.", parse);
			Text.NL();
			Text.Add("Decisions, decisions... but you better make your choice fast; you can’t hold it off much longer!", parse);
			Text.Flush();
			
			let options = [];
			//[Cum] [Don’t cum]
			parse["guygirl"] = player.mfTrue("guy", "girl");
			options.push({nameStr : "Cum",
				tooltip : Text.Parse("You’ve got plenty of dick-cream to spare for Lagon; fill Vena with your cum and let Lagon see how a real [guygirl] does it!", parse),
				enabled : true,
				func : function() {
					Text.Clear();
					Text.Add("More than confident in your capabilities, you see no reason to rob yourself of any pleasure, nor Vena for that matter. With your concerns squashed, you allow yourself to thrust away with reckless abandon, feeling your control fraying thinner and thinner.", parse);
					Text.NL();
					Text.Add("Caught up in your need to breed, you bury yourself as deeply into Vena as you possibly can and let yourself go. Sparks fill your vision, nerves afire with pleasure as you allow yourself to erupt into her waiting snatch, thick jets of seed pouring towards her greedy womb.", parse);
					Text.NL();
					
					let cum = player.OrgasmCum();
					
					if(player.Slut() < 30)
						Text.Add("In between the shudders of pleasure, you manage to muster a spark of concern; what if you get her pregnant? Then you brush it aside as meaningless; Vena wouldn’t care if you did, and really, what are a few more bunnies? Besides, a little freshening to the gene pool will do them some good.", parse);
					else
						Text.Add("The thought of your seed reaching Vena’s anxious eggs, filling her belly with a great big litter of baby bunnies, only fuels your delight. You want to see her huge with your young, the living proof that you’re a better lover than Lagon in <b>every</b> way that matters.", parse);
					Text.NL();
					Text.Add("The feeling of your [cock] pumping your baby batter deep into her hungry cunt is all the stimulation the lapine matron can take. With a squeal of pleasure, she climaxes.", parse);
					Text.NL();
					Text.Add("Caught in folds like a velvet-lined vice, you are trapped, helpless to do anything other than moan your pleasure as Vena’s cunt greedily takes all you have to give, and then some. With practiced ease, she ripples around your shaft, literally milking you as she clenches and releases, coaxing more spurts of cum into her depths.", parse);
					Text.NL();
					Text.Add("Only when she has had enough, her own orgasm having faded, does she release her death grip on your cock. Panting with the effort, you slowly pull your tender manhood away from her cunt, hissing softly as the cool air hits the overheated flesh.", parse);
					Text.NL();
					Text.Add("Once you have staggered upright, you can take in the sight of what you’ve done, and you smile proudly. A great puddle of mixed juices spreads under Vena’s soft belly, reaching up past her arms to where her husband has been pinned down throughout your efforts at making love to his wife. Her folds gape obscenely, temporarily molded into a perfect shape for your cock, and tiny streams of your seed ooze from between her quivering petals to drip down into the slick beneath her.", parse);
					Text.NL();
					LagonDScenes.PunishmentPCCont(true);
				}
			});
			options.push({nameStr : "Save it",
				tooltip : Text.Parse("Vena might be disappointed, but you want to give Lagon a stuffing he’ll remember for the rest of his days.", parse),
				enabled : true,
				func : function() {
					Text.Clear();
					Text.Add("The next time that you pull out, you hold there, breathing slowly and steadily in an effort to get yourself under control. Vena whimpers, squeezing down on your sensitive cock, but you have to take things carefully; you want to get her off too, you just want to make sure you don’t shoot your own load in the process.", parse);
					Text.NL();
					Text.Add("Once your heart no longer feels like it’s trying to beat its way out of your chest, you start to thrust again, slow and steady. You carefully angle your dick with each thrust, striving to hit the most sensitive spots you can find hidden amongst Vena’s folds. If you’re careful, precision will suffice.", parse);
					Text.NL();
					Text.Add("Vena certainly seems to appreciate your efforts; she moans and mewls, grinding back against your shaft. A spasm visibly ripples down her spine, and you quickly pull yourself free, just in the nick of time.", parse);
					Text.NL();
					Text.Add("Her pussy visibly grabs at the air where your cock was mere moments ago; clear fluids spill from between her folds. Lower down, Vena’s massive cock bulges and then explodes, a great gush of milky white seed pouring from its distended tip.", parse);
					Text.NL();
					Text.Add("Settling back out of spray radius - you hope - you watch in perverse amusement as Vena climaxes. Ropes of semen fountain from her cock and splash along the stone floor beneath her, droplets bouncing high enough to splatter her breasts as the fast-growing puddle spreads towards Lagon’s haunches. Female nectar spills down her folds, washing along her throbbing dick before dripping into the pooling fluids beneath her, making it flow back towards you.", parse);
					Text.NL();
					Text.Add("You can see Vena’s guards glancing at her growing mess, nervously smacking their lips, but miraculously their obedience outweighs their lust and they keep a tight grip on their father. Vena lets out a final, unladylike grunt and spills one last jet of cum into the pool, then goes limp with the blissful sigh of the truly sated.", parse);
					Text.NL();
					LagonDScenes.PunishmentPCCont(false);
				}
			});
			Gui.SetButtonsFromList(options, false, null);
		}
		else {
			Text.Add("Now, you might not quite be getting the same enjoyment out of this as Vena is. But the sight of her lovely rump jiggling as you pound her cunt, and the muffled sounds of pleasure escaping her otherwise occupied mouth are more than enough to keep you happy.", parse);
			Text.NL();
			Text.Add("All too soon, the meaty smack of hips is undercut by a new sound: the obscene wet slapping of the amazonian lagomorph’s clit-cock against her softly rounded belly. Each thrust and pull makes the monstrous male member bounce hard against her flesh, ensuring she can never be free of waves of pleasure rippling through her huge frame.", parse);
			Text.NL();
			Text.Add("You feel a shudder run through the lagomorph matriarch’s body. This combined with the increasingly desperate tone of her moans is all the indication you need of the queen’s impending orgasm.", parse);
			Text.NL();
			Text.Add("Spurred by the desperate need to see Vena cumming, you manage to muster up a burst of energy and start to really pound her cunt, thrusting with all your might, trying to grind the ever-elusive sweet spots as you do.", parse);
			Text.NL();
			Text.Add("This is all she can take; with a squeal of pleasure, you feel Vena’s pussy grab your [cock] in a vice-like grip, milking it for all it’s worth despite you not having anything to give. Her own cock veritably explodes cum onto the ground, painting it white as her seed pools below.", parse);
			Text.NL();
			Text.Add("Held fast by Vena’s cunt, you patiently sit and wait as she finishes emptying herself. Only when you feel the pressure slacken in her vice-like petals do you slowly pull yourself free and upright again. Even from here, you can see the massive pond of juices your efforts have produced, a thick swamp of cum that gently laps around Lagon’s feet, and you smile proudly at the result.", parse);
			Text.NL();
			LagonDScenes.PunishmentPCCont(false);
		}
	}

	export function PunishmentPCCont(came : boolean) {
		let player = GAME().player;
		let lagon = GAME().lagon;
		
		let p1cock = player.BiggestCock(null, true);
		let strapon = p1cock.isStrapon;
		
		let parse : any = {
			playername : player.name
		};
		parse = player.ParserTags(parse);
		parse = Text.ParserPlural(parse, player.NumCocks() > 1);
		
		Text.Add("Vena stops her ministration and gets back on her feet, licking her lips as she tries to balance herself on wobbly knees. <i>“Wow, I wasn’t expecting you to get me off too. You really are our champion!”</i> she says playfully, giggling.", parse);
		Text.NL();
		Text.Add("Smiling modestly, you assure her that it was nothing.", parse);
		Text.NL();
		if(came) {
			Text.Add("<i>“And you gave me such a huge load too. You sure you got enough saved up for my dear husband?”</i>", parse);
			Text.NL();
			Text.Add("You hear a muffled protest from Lagon, still subdued by the guards.", parse);
			Text.NL();
			Text.Add("You assure her that you have more than enough for Lagon. If maybe not quite as much as she just got, greedy thing that she is.", parse);
			Text.NL();
			Text.Add("Vena giggles in response. <i>“If I get pregnant from this, I hope my babies will take after their father. I’m sure we could use more of you around.”</i>", parse);
			Text.NL();
			Text.Add("Grinning, you reply that you’d be just as happy if they took after her; more of her around would be even better.", parse);
			Text.NL();
			Text.Add("<i>“You’re such a flatterer, champion.”</i> She giggles. <i>“But we should be moving ahead; my husband is ready, and after such a wonderful fuck, I’m sure you are ready too.”</i>", parse);
			Text.NL();
			Text.Add("You readily agree... but there’s just one little thing to take care of before you can get to work. You point meaningfully at your cock, now flaccid and spent.", parse);
			Text.NL();
			Text.Add("<i>“Oh? Of course, I’d be happy to help you get back to full mast - if you let me.”</i>", parse);
			Text.NL();
			Text.Add("Smiling in anticipation, you tell her to go right ahead.", parse);
			Text.NL();
			Text.Add("The moment you give her consent, Vena unceremoniously drops to her knees, taking your [cock] in her hands and nestling it between her full bosom. She looks up at you with a smile, and wraps your shaft in her pillowy breasts.", parse);
			Text.NL();
			Text.Add("A shiver of pleasure runs up your spine at just the feel of warm, soft, fuzzy boobflesh wrapped around your cock. You eagerly nod your head, anxious to see what she can really do.", parse);
			Text.NL();
			Text.Add("Vena quickly begins moving up and down, bobbing on your hardening dick as she massages you with her luscious orbs. It only takes a moment before you’re hard enough for your tip to poke from the velvety valley of her mounds, and she eagerly takes the tip into her mouth, suckling softly.", parse);
			Text.NL();
			Text.Add("You don’t even try to fight the coo of pleasure that escapes you. Within seconds, you feel hard as you’ve ever been, your shaft thick and throbbing in the matriarch’s cleavage.", parse);
			Text.NL();
			Text.Add("Vena doesn’t seem intent on stopping though, she abandons her breasts to deepthroat you in a single go, swallowing around your dick to further stimulate you.", parse);
			Text.NL();
			Text.Add("Uh-oh! You call for Vena to stop, that she’s going to set you off again, but the lusty lapin is lost to you. You try again, and when she still ignores you, you physically push her away, your cock slipping from between her lips with a wet pop that seems to echo around the Pit. You take a deep breath, and then manage to calmly tell Vena that she’s done enough for you now.", parse);
			Text.NL();
			Text.Add("<i>“Sorry about that.”</i> She giggles. <i>“Go on then, my husband is waiting... and please, be gentle.”</i>", parse);
			Text.NL();
			Text.Add("You bite back the first response to come to you. After a moment’s hesitation, you manage to neutrally tell her that you’ll try.", parse);
		}
		else {
			Text.Add("<i>“It’s too bad you didn’t cum too, but I take it you wanted to save yourself for my dear husband?”</i>", parse);
			Text.NL();
			Text.Add("You hear a muffled protest from Lagon, still subdued by the guards. ", parse);
			if(!strapon)
				Text.Add("Smirking, you tell her that’s right; petting your cock, you assure her that you’ll give him a load that he’ll never forget.", parse);
			else
				Text.Add("Smirking, you tell her that while you can - and intend to - give him a proper reaming, she’ll have to provide filling herself. There’s bound to be plenty of opportunity in the coming days.", parse);
			Text.NL();
			Text.Add("<i>“Alright, I’ll be counting on you. Lagon should be ready for you now, but still… please be gentle.”</i>", parse);
			Text.NL();
			Text.Add("You bite back the first response to come to you. After a moment’s hesitation, you manage to neutrally tell her that you’ll try.", parse);
		}
		Text.NL();
		Text.Add("Vena steps aside, and you stalk purposefully towards the former tyrant of the Burrows. He growls and wriggles, but his children have him held fast. You stop just behind the prone lapine and reach down to fondle his rump. You casually comment aloud that it’s not much of an ass, not like his son Roa’s, but you’ll just have to make the best of it.", parse);
		Text.NL();
		Text.Add("The mention of Roa’s name is enough to make him growl even as the guards restrain him.", parse);
		Text.NL();
		Text.Add("You pay no mind to Lagon’s little temper tantrum, instead leaning down so that you can wrap your arms around his chest, hooking up under his shoulders. You nod to the guards, and then hoist up with all your strength once they’ve let their father go, pulling Lagon off the floor and into your lap as you unceremoniously flop down on the floor.", parse);
		Text.NL();
		Text.Add("Lagon wriggles and squirms, but you have him well and truly hooked. Your hands seize his wrists, forcing him into your lap. Smirking, you look over his shoulder, to better judge where he’s settled, when you spot something that makes you grin wickedly.", parse);
		Text.NL();
		Text.Add("Loudly and deliberately, pitching your voice so all the audience can hear it, you comment on what a slutty little bunny Lagon is; he’s already hard as a rock! Looks like having his wife’s tongue up his ass was something he’s always dreamed of...", parse);
		Text.NL();
		Text.Add("<i>“Shut your mouth, traitor! What do you think you know! You are nothing! That’s what you are!”</i> he rambles on.", parse);
		Text.NL();
		Text.Add("Smirking, you retort loudly that if he liked his wife’s tongue, then he’s going to love <i>this</i>... And with that, you reach down and clasp his ass firmly, hoisting him into the air so that you can align your [cock] with his virginal pucker, and then allow him to sink down onto it. The [cockTip] of your dick slips inside, and then he jerks to a stop, the tight ring refusing to spread any further.", parse);
		Text.NL();
		
		Sex.Anal(player, lagon);
		lagon.FuckAnal(lagon.Butt(), p1cock, 20);
		player.Fuck(p1cock, 20);
		
		Text.Add("<i>“Wha! No! Stop! Aaaah!”</i> he cries out.", parse);
		Text.NL();
		Text.Add("Ignoring the former tyrant’s pleas, you shift your grip and start to push down. Damn, but he’s <b>tight</b>! You know Vena said he was a virgin, but still, this is even tighter than you expected...", parse);
		Text.NL();
		Text.Add("<i>“Get it - Ahg! - out!”</i>", parse);
		Text.NL();
		Text.Add("You do wish he’d stop that. You aren’t going to stop pushing, certainly not when it’s taken you so much to get the first half of your cock inside of him.", parse);
		Text.NL();
		Text.Add("<i>“Ahh! Oooh! Ahn!”</i>", parse);
		Text.NL();
		Text.Add("You smirk to yourself; you thought that he’d warm up to it. Even as he clenches down as if his life depends on it, you keep pushing. Inch by teeth-gritting inch, you manage to wriggle your way inside, until he has taken you to ", parse);
		if(p1cock.Knot())
			Text.Add("just above your bulging [knot].", parse);
		else
			Text.Add("the very hilt.", parse);
		Text.Add(" Looking over his shoulder, you can see that his own cock is throbbing like mad, visibly pulsating in his arousal.", parse);
		Text.NL();
		Text.Add("<i>“C-can’t! Ahn!”</i>", parse);
		Text.NL();
		Text.Add("The lagomorph arches his back, shouting as his cock explodes like a geyser. Semen fountains from his glans, spurting through the air to patter like perverse rain into the puddle his wife made earlier. His balls visibly clench down, pushing out a truly intense climax, stopping only when he runs himself dry. He slumps into your lap, panting like a dog.", parse);
		Text.NL();
		Text.Add("Cheerfully, you quip that it looks like he enjoyed that. Seems like somebody had a thing for getting fucked all along, hmm?", parse);
		Text.NL();
		Text.Add("<i>“N-no… Enjoy you? Not even a cock-hungry slut would enjoy this.”</i>", parse);
		Text.NL();
		Text.Add("Smirking, you comment that you’ve never seen someone cum that hard and that long without enjoying it before. Or was that some other bunny creaming themselves from having your cock up their ass?", parse);
		Text.NL();
		Text.Add("<i>“Eat a dick!”</i> he retorts with renewed strength.", parse);
		Text.NL();
		Text.Add("No. That’s what he’s going to do.", parse);
		Text.NL();
		Text.Add("And with that, you clasp hold of his thighs and pull him up your shaft, his next words cut off by a gasping groan. You draw him up until it almost seems like you’re about to pop him free of your cock... and then you thrust him back down again, firmly pushing yourself all the way back inside of him.", parse);
		Text.NL();
		Text.Add("And just like that, the once talkative king is reduced to a moaning slut as you push yourself back to the hilt inside his quivering asshole.", parse);
		Text.NL();
		Text.Add("Now that he’s shut up, you can devote yourself to truly appreciating what you have here. There might not be a lot of meat to cushion yourself with, not like his wife has, but inside - ah, that’s another story. He’s tight as a vice, even after you broke his cherry, making you work to move in even the slightest direction. He’s hot as a furnace inside, stretched so tight that you swear you can feel his heartbeat, hammering a tattoo against your intruding cock.", parse);
		Text.NL();
		Text.Add("Slowly and carefully, you start to pull him up again, and then push him down. All Lagon does is moan; whether it’s because you made him cum already or because he’s too humiliated to protest anymore, it looks like all the fight has gone out of him, at least for now.", parse);
		Text.NL();
		Text.Add("Which you can appreciate, because it means you can focus on enjoying yourself.", parse);
		Text.NL();
		Text.Add("Remembering what Vena asked, you keep your thrusts relatively slow. Although that’s pretty easy to do; Lagon clenches down like a vice, making you work to squeeze yourself in and to pull yourself out, even after Vena’s generous donations of lubricant.", parse);
		Text.NL();
		Text.Add("You pump and you thrust, grunting heavily as you work away at the bunny’s tight little butt. Lagon moans and mewls involuntarily, the cutest little noises of pleasure being forced from his throat as you work his ass, mercilessly grinding his prostate.", parse);
		Text.NL();
		let cum;
		if(!strapon) {
			Text.Add("You can feel your control fraying, the pleasure building up inside of you with each plunge of your hips. Your voice rough and grunting, you ask how Lagon feels to be taking the dick for once. Does it feel as good as when he was fucking his son? Does he enjoy being stuffed full of cock, knowing that there’s only one way this is going to end - with a thick, hot batch of baby batter stuffed up his rabbit hole?", parse);
			Text.NL();
			Text.Add("<i>“Shut up, traitor… Ooh!”</i>", parse);
			Text.NL();
			Text.Add("You cut him off with another powerful thrust. Your heart is pounding against your chest, it feels like it's going to burst, molten metal pouring through your veins. You can't... can't hold out...", parse);
			Text.NL();
			
			cum = player.OrgasmCum(2);
			
			parse["k"] = p1cock.Knot() ? " without knotting yourself" : "";
			Text.Add("With an ecstatic roar, you plunge yourself as deeply into Lagon's ass as you can[k] and let yourself cum. ", parse);
			if(cum > 6) {
				Text.Add("Your cock goes off like a perverse parody of a volcano, erupting with inhuman fury into the tight bunny butt wrapped around it. You'd be surprised you don't send him flying off your dick like a jism-propelled rocket if you had that much free thought to spare.", parse);
				Text.NL();
				Text.Add("The cascade of spunk hits Lagon like a tidal wave, visibly deforming his once-tight stomach as it slams into his guts. His midriff bulges out from the sheer quantity of semen rushing into it, then shrinks back as your first spurt ends... and then the next one hits. And then the next.", parse);
				Text.NL();
				Text.Add("Like a pregnancy on fast-forward, Lagon's stomach balloons outward, round and flush with your seed, packed so tight that the skin is stretched taut as a drum. By the time you finally run dry, his belly is enormous; he looks like his wife does when she's ready to pop out one of her bigger litters.", parse);
				if(player.KnowsRecipe(AlchemySpecial.Anusol)) {
					Text.NL();
					Text.Add("A brief flicker of breeder-lust flashes through the swirling stew of your thoughts, making you momentarily wish that were the case, just to really hammer it home who's the alpha here.", parse);
				}
			}
			else if(cum > 3) {
				Text.Add("Spooge geysers from your cock and pours like a tidal wave into Lagon's ass, flooding his innards with relentless intensity. Grinding your hips against his rear, you are lost to everything except the urge to make sure he's properly inundated.", parse);
				Text.NL();
				Text.Add("Spunk begins to pool in his stomach, slowly puffing out his waistline, making him grow rounder and fatter with each gush of cum. By the time you've spurted your last, he's sporting a potbelly to match his wife's, which looks almost obscene on his comparatively smaller frame.", parse);
			}
			else if(came) {
				Text.Add("It looks like you might have bitten off more than you can chew, tending to Vena before. She took the lion's share for herself, leaving just a trickle for her husband. But still, it's enough to paint the toppled tyrant's asshole white.", parse);
			}
			else {
				Text.Add("You're glad that you saved your cum up for this, ensuring that you can pack him nice and full of sloppy, sticky seed. If he weren't wrapped so tightly around your cock, you know he'd be drooling thick streamers of your jizz down his legs by the time you finish.", parse);
			}
			
			Text.NL();
			Text.Add("Your orgasm triggers Lagon’s second climax. He moans like the slut he is and cums, letting his seed splatter on the front row of his audience. They look a bit surprised at first, but quickly smile and begin licking their father’s semen off their fur - as expected of the lagomorphs, really.", parse);
			Text.NL();
			Text.Add("Lagon doesn’t seem to be done though; his cock spasms and forces out more ropes of white lapine jism, these following sputters weaker than the initial burst, but still impressive in volume.", parse);
			Text.NL();
			Text.Add("Wrapped in hot, tight flesh as you are, you are prey to every flutter and clench of the once-proud bunny’s ass. He squeezes down on your [cock] with incredible expertise for a former anal virgin, milking your shaft even after you have nothing left to give and ensuring your dick cannot go limp - no matter what.", parse);
			Text.NL();
			Text.Add("It’s truly a sight to behold. Even from where you are, you can see the naked bliss written all over Lagon’s face, the toppled tyrant reduced to nothing more than a buttslut. His ass is full of cock, his belly full of spunk, and he’s just <b>loving</b> it. Looks like Roa took after his dad more than you thought.", parse);
			Text.NL();
			Text.Add("As Lagon wriggles and squeals, weakly flailing in his delight, you watch your audience. Countless envious eyes stare at you, drinking in the sight, dozens of tongues dabbing hungrily or nervously at too dry lips. You are the center of attention for every bunny in the warren, even the impromptu fuckfests having stopped to watch their father’s humiliation, and you know that not a rabbit here doesn’t wish that they were down in the Pit instead.", parse);
			Text.NL();
			Text.Add("And not necessarily in Lagon’s place. Eyeing the myriad erections bobbing about, you just know that more than a few of his sons - and his specially gifted daughters - would relish being in your place, filling their father with hot, creamy bunny-spunk.", parse);
			Text.NL();
			Text.Add("More than anything else, that makes you smile. Your goal here was to shatter Lagon’s grip of fear on his offspring, to make them see that they didn’t have to obey him anymore. Now, they know he’s no better than the rest of them; just a horny slut, aching for a hole or a cock to play with. He won’t be able to bully them anymore.", parse);
			Text.NL();
			parse["seep"] = cum > 6 ? "pour" : cum > 3 ? "flow" : "seep";
			Text.Add("Lagon’s deep moan of bliss draws your attention back to him. As you watch, one final weak spurt of cum tries to clear his cock, only to simply dribble down his shaft and soak his balls. Satisfied that he’s had enough, you shift your grip to his thighs and start to pull him from your lap. He whimpers softly as you draw free of his gaping hole, allowing your seed to start to [seep] from his abused tailhole.", parse);
		}
		else {
			Text.Add("Listening to the sounds your little fuck-bunny is making has your blood pumping. Your teeth are bared in a feral smile of lust as excitement makes you quiver. Unconsciously, you start to hump him harder and faster, jackhammering the rabbit until he squeals in pleasure.", parse);
			Text.NL();
			Text.Add("To your great surprise, Lagon suddenly arches his back, his cock almost visibly bulging before it erupts, spraying semen in a great, sloppy arc through the air. He cums with such ferocity that he sprays right into the face of some of the closer lagomorphs, who squeak in surprise, then start to laugh, licking their father’s seed from their lips.", parse);
			Text.NL();
			Text.Add("The chorus wrings a heartfelt groan from Lagon, but it doesn’t seem to stop him. Indeed, his next climax is even stronger, sending great ropes of shimmering seed swirling through the air and spattering in streamers across the floor.", parse);
			Text.NL();
			Text.Add("Whispering and murmurs fill the air, Lagon’s vast brood unable to resist talking to each other about what they are seeing. You have a feeling they can hardly comprehend it; if it were a real cock ravaging their father’s ass, they might understand it, but your [cock] is just an imitation. And yet, there’s no question that Lagon is just loving your efforts at fucking him with it. Even to their eyes, he must look like a huge slut.", parse);
			Text.NL();
			Text.Add("As Lagon bucks and whimpers, spraying cum everywhere, you smirk, deep and hungry. You drink in the former alpha’s humiliation, feeling it stoke your ego, overwhelming you with your own kind of bliss. A hand creeps down beneath Lagon’s thigh, fingers diving eagerly into your own [vag], twisting and plunging just hard enough to... to...!", parse);
			Text.NL();
			
			cum = player.OrgasmCum();
			
			Text.Add("You cry out in pleasure as your own orgasm rips through you, letting Lagon’s mewling carry you to the heights of sexual bliss. The confines of the Pit fade away into warm, fuzzy darkness, and you happily ride the wave until it sweeps through, leaving you panting in the cool air of the dungeon.", parse);
			Text.NL();
			Text.Add("Only after you have caught your own breath do you notice the panting coming from your lap. It looks like Lagon finished blowing his load while you were creaming yourself. You smile at the sight; if he got off this hard just from your humble toy, how might he fare if one of his kin decides to show him what a real cock can do?", parse);
			Text.NL();
			Text.Add("But that’s a matter for the future. Right now, you think he’s had enough. So, you carefully take hold of his thighs and start to pull him off your strap-on. He moans softly, wriggling a little as you pull him free.", parse);
		}
		Text.NL();
		Text.Add("Settling him back down in your lap, your [cock] rubbing between his butt cheeks, you tell him that you just knew he’d come to love it. You keep your tone cheerful and affectionate, the better to rub your words in.", parse);
		Text.NL();
		Text.Add("<i>“F-fuck you...”</i> he mutters weakly, more than a little spent after being so wonderfully well-fucked and blowing his load not once, but twice. He might not be displaying it, but you have a sense of shock when you watch the former King’s face. Seems like even he is surprised at how hard he came.", parse);
		Text.NL();
		Text.Add("You point out you just got done doing that, but it seems he hasn’t had enough - especially when you look at his cock, still hard as a rock and throbbing.", parse);
		Text.NL();
		Text.Add("<i>“That’s-”</i>", parse);
		Text.NL();
		Text.Add("You shush him by grinding against his abused ass. You’re a bit tired, but if Lagon is raring for another go already, you’re sure you can find a way to <i>help</i>. Guess you just figured out who Roa <i>really</i> takes after.", parse);
		Text.NL();
		Text.Add("<i>“Don’t you dare compare me to that traitorous whelp!”</i> the former King spits back angrily, finding renewed strength as he struggles against your grip and manages to wiggle his way out of your lap and back onto his feet. Sadly, he only stays upright for a moment because as soon as he tries to take another step away from you, he winds up slipping on the pool of semen his dear wife left earlier.", parse);
		Text.NL();
		Text.Add("Lagon only has time for a surprised gasp before he crashes down, face-first, into the pool of mixed juices.", parse);
		Text.NL();
		parse["c"] = !strapon ? " dripping with your seed and" : "";
		Text.Add("A chorus of snickers echoes through the Pit, Lagon’s brood now feeling free to laugh at their father’s mishap. Even you can’t resist a chuckle at the sight of the once-proud tyrant now flat on his face in his wife’s cum-puddle, arms splayed weakly through the smeared juices and his still-gaping ass up in the air,[c] perfectly poised for another fuck.", parse);
		Text.NL();
		if(!strapon && player.Cum() >= 3) {
			parse["c"] = cum > 6 ? " and belly bulging with your last load" : "";
			Text.Add("Seeing him face-down like that, sweet ass up in the air as if begging for your cock, seed dripping over his balls[c] makes you lick your lips hungrily. A pang of hunger wells up within you, your dick pulsating anxiously at the sight. Unconsciously, you run a hand over your slick length, shivering slightly at your own touch.", parse);
			Text.NL();
			Text.Add("Yes... you think you have another round in you.", parse);
			Text.NL();
			Text.Add("You push yourself upright, and advance on Lagon while he’s too stunned to notice. You don’t think he’s got it in him to actually escape, but why put a perfectly good pose to waste? You grab his butt cheeks and give them a good squeeze. If Lagon wanted another round so badly, all he had to do was ask, but you’re not going to complain if he wants to give you some eye candy first.", parse);
			Text.NL();
			Text.Add("He simply groans in response. Seems like he can’t think of any retort at the moment, not that you blame him. It’s not everyday you discover a new fetish.", parse);
			Text.NL();
			Text.Add("You take the time to really appreciate the view before you claim your final victory on the former tyrant king. Seeing him so debased, so vulnerable fills you with lust, even Vena can’t contain herself anymore; she’s openly masturbating alongside her children, with a pair of fingers deep in her cunt and a guard nursing on her malehood.", parse);
			Text.NL();
			Text.Add("Savoring the approval of Lagon’s family, you decide that it’s time to give your adoring audience what they’re really hoping to see. Aligning your [cockTip] with his well-fucked hole, you start to push forward in a smooth, steady glide.", parse);
			Text.NL();
			Text.Add("Lagon verbally winces; even after all you did to him, he’s still so damn <i>tight</i>! But you’ve stretched him out enough that he can’t really stop you, allowing you to bottom out in a single stroke.", parse);
			Text.NL();
			
			Sex.Anal(player, lagon);
			lagon.FuckAnal(lagon.Butt(), p1cock, 5);
			player.Fuck(p1cock, 5);
			
			player.subDom.IncreaseStat(100, 1);
			
			Text.Add("Closing out the world around you, you let yourself be buried in pleasure as you start to thrust. Your earlier load squelches with delightfully obscenity, undercutting the meaty smack of hips on ass in a manner that’s music to your ears. You hold Lagon’s hips in a death grip, ensuring he doesn’t have a prayer of getting away as you fuck his rear for all you’re worth.", parse);
			Text.NL();
			Text.Add("The friction of flesh on flesh makes you shudder, pleasure welling up within you. The spirit is more than willing, but the flesh, alas, is weak. With all that you’ve already done with your unwilling little onahole, your ability to hold off a second orgasm is drastically reduced.", parse);
			Text.NL();
			Text.Add("All too soon, you can feel yourself nearing the brink, and you plow him all the harder for it. Your strokes grow rougher and harder, your patience wearing as thin as your control. Lagon’s mewls rise in pitch, climbing to an ecstatic squeal, and then give way to a thin sigh, but you are too caught up in your own bliss to pay much attention.", parse);
			Text.NL();
			Text.Add("Cock throbbing madly, you’re about to blow... when a thought manages to strike you, even through the veil of lust and pleasure crowding your mind.", parse);
			Text.NL();
			
			cum += player.OrgasmCum();
			
			Text.Add("With a primal roar of ecstasy, you fiercely pull your cock free of Lagon’s ass, grabbing it roughly in your hand and pumping to push yourself over the edge. Your whole body convulses as you climax again, thick jets of semen spraying over Lagon’s butt and back. You paint him with your seed, irrefutably marking him as your bitch, and then fall back with a sated sigh.", parse);
			Text.NL();
			Text.Add("You pant, slow and heavy, getting some energy back into your body after your latest fuck. Once you can think clearly, you lift your head, ready to taunt Lagon again, but hold your tongue; it would be a waste of a good witticism.", parse);
			Text.NL();
			Text.Add("Your fuck-bunny is out cold! Judging from the additions to the puddle he is now sprawled bonelessly in, he must have climaxed again while you were fucking him, and you were too preoccupied to notice.", parse);
			Text.NL();
			Text.Add("A smirk spreads across your lips; this, more than anything, should etch today’s punishment into Lagon’s memory forever. After all, you doubt he’s <b>ever</b> passed out even when fucking Vena, never mind when he was breeding his daughters or buggering his sons.", parse);
			Text.NL();
			Text.Add("With a soft grunt of effort, you haul yourself upright again, and then turn your attention to Vena. The lapine queen seems to have just finished with her second climax, one bloated-looking, cum-dripping guard works on licking her shaft clean, while the other does the same to her pussy.", parse);
			Text.NL();
			Text.Add("Mustering as much dignity as you can, you tell Vena that her husband’s punishment is done. She may send him to his new quarters whenever she wishes.", parse);
			Text.NL();
			Text.Add("<i>“Hmm… what? Oh! Of course!”</i> She pushes her guards away and takes a moment to recompose herself. <i>“My darlings, take my husband back to his cell and lock him in there.”</i>", parse);
			Text.NL();
			Text.Add("The guards look a bit disappointed, but obey their matron, grabbing Lagon’s limp form and dragging it out of view.", parse);
		}
		else {
			Text.Add("This is hilarious. The once-proud tyrant king reduced to a hapless, clumsy bunny, dripping with cum after slipping on his wife’s juices. Worst of all, you think he’s actually enjoying the attention.", parse);
			Text.NL();
			Text.Add("Now, you could give him another round… but you’re too tired for that right now, not to mention he hasn’t actually earned his second buttfuck. After all, this is supposed to be punishment, not reward.", parse);
			Text.NL();
			Text.Add("Lagon is too stunned to react to anything. Any teasing you could do right now would fall on deaf ears. So you turn to Vena and signal to her that her husband’s punishment is done. <i>“Alright, thank you, champion.”</i> She turns to her guards. <i>“Darlings, please take your father back to his room and lock him in.”</i>", parse);
			Text.NL();
			Text.Add("The guards nod and after a short bow, proceed to haul the silent Lagon up to his feet and drag him out of the Pit.", parse);
		}
		Text.NL();
		Text.Add("You approach Vena, who watches as her children carry their father into the darkness of the tunnels beyond, and ask her if she’s feeling alright.", parse);
		Text.NL();
		Text.Add("<i>“It’s sad that things had to end this way.”</i> She starts. <i>“Lagon and I… we could have built a wonderful family for ourselves. I just wonder what happened to make him lust after the world out there so much... what drove his ambition?”</i>", parse);
		Text.NL();
		Text.Add("You shrug your shoulders and confess that you don’t know. That’s something only Lagon can really hope to tell her. Trying to brighten her spirits, you suggest that maybe, in his own way, he wanted the same thing. He just let his ego determine what a ‘wonderful family’ meant to him.", parse);
		Text.NL();
		Text.Add("Vena smiles softly at that. <i>“Thank you, [playername]. Thank you for stopping him, and thank you for being easy on him.”</i>", parse);
		Text.NL();
		Text.Add("You quietly nod your head, wordlessly accepting her thanks.", parse);
		Text.NL();
		Text.Add("<i>“My husband may be a bit difficult, but I’m sure he would like it if you visited him once in a while. I’m sure what we did here today helped a bit, but I wouldn’t be surprised if most of our children are still scared of him, and for a lagomorph loneliness can be very painful.”</i> She takes a deep breath. <i>“Still, I never knew this side of him. Who would’ve guessed my dear husband enjoyed being taken so much?”</i>", parse);
		Text.NL();
		Text.Add("Smiling, you mischievously ask if that’s given her some ideas about spicing up her conjugal visits in the future.", parse);
		Text.NL();
		Text.Add("<i>“Well, I’m still a woman. Of course, I’ll still have him fuck me - like always. However, I wouldn’t mind pitching a few times either.”</i>", parse);
		Text.NL();
		Text.Add("You didn’t think she would, given how into it she seemed to get when she was watching. But you keep that thought to yourself, simply smiling knowingly.", parse);
		Text.NL();
		Text.Add("<i>“We should probably go back and let my children resume their fun. They must all be very horny after the spectacle.”</i>", parse);
		Text.NL();
		Text.Add("You nod your head, and indicate for her to lead the way, silently following her through the tunnels back to her throne room.", parse);
		Text.Flush();

		TimeStep({hour: 1, minute: 30});
		
		Gui.NextPrompt(function() {
			MoveToLocation(WORLD().loc.Burrows.Throne, {minute: 15});
		});
	}

	export function PunishmentVena() {
		let player = GAME().player;
		
		let parse : any = {
			playername : player.name
		};
		
		Text.Add("Lagon scrambles to his feet, trying to get away from Vena, but it’s useless. The amazonian lagomorph is bigger, stronger and faster. He barely takes two steps before Vena pounces him and pins him down on the ground, smearing his face with bit of leftover spunk one of the bunnies must’ve left there.", parse);
		Text.NL();
		Text.Add("You smirk and settle back against a convenient outcrop to relax. This is going to be fun to watch.", parse);
		Text.NL();
		Text.Add("<i>“Ugh! Get off me, you stupid cunt!”</i> Lagon cries, struggling to wiggle free of Vena’s grasp.", parse);
		Text.NL();
		Text.Add("Vena just smiles sweetly and gently shakes her head. <i>“Come now, darling, don’t make such a fuss. Being taken is not so bad; you might even like it if you give it a chance.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Like it!? Are you insane!? I am Lagon! King of the Lagomorphs and future ruler of the surface! I won’t be made into anyone’s bitch!”</i> He struggles with renewed effort.", parse);
		Text.NL();
		Text.Add("Vena just shifts her weight; being over twice her husband’s size now, she can easily keep him trapped on the floor, his efforts to wriggle free clearly futile. She sighs softly at his words. <i>“Dear, this has nothing to do with you being my ‘bitch’,”</i> she replies. <i>“Believe me, I’d rather be taking that yummy cock if I had the choice. But you haven’t given me the choice. You haven’t given me a choice since you wiped my mind and put me away down here, all because I wouldn’t give you what you wanted,”</i> she adds sadly. <i>“I’m sorry, husband, but you’ve been a very bad boy. And bad boys need to get punished. Please, this is for your own good.”</i>", parse);
		Text.NL();
		Text.Add("<i>“If you really cared about what was good for me, you’d release me this instant and put me back on the throne, instead you’re here trying to humiliate me, you hypocritical bitch!”</i> Lagon growls.", parse);
		Text.NL();
		Text.Add("<i>“That's not 'good for you', that's just you getting away with what you did,”</i> Vena replies, her usual sweetness giving way to a surprisingly dry tone. <i>“You wouldn't let one of our children get away if they did something wrong, so it's time to live up to your own example.”</i>", parse);
		Text.NL();
		Text.Add("Lagon has no answer for that, the self-centered bunny visibly seething at being verbally out-maneuvered - not something he’s used to from his cowed subordinates.", parse);
		Text.NL();
		Text.Add("Vena just lets him try, then smiles happily. <i>“Now, relax and stop struggling, dear. I'm not taking you dry. I'll make sure you're lubed up properly before I take you,”</i> she giggles.", parse);
		Text.NL();
		Text.Add("That certainly doesn’t reassure Lagon in the slightest. He starts to wriggle and squirm all the harder, but Vena is having none of it. She leans all of her weight on him until he grunts weakly, being quite firmly squashed to the floor even as she slips down his body to bring her face in line with his ass.", parse);
		Text.NL();
		Text.Add("Without the slightest hesitation, Vena opens her mouth and extends her tongue, slurping her way through Lagon’s ass crack once, and then a second time. Then she starts to slowly lap at his pucker, before trying to worm her way inside his doubtlessly clenched ring.", parse);
		Text.NL();
		Text.Add("<i>“The hell are you doing!? Stop!”</i>", parse);
		Text.NL();
		Text.Add("Vena ignores her husband’s protests, instead avidly licking away at his ass with every sign of enjoyment. Her eyes have rolled shut and she coos softly in pleasure as she does her best to lube Lagon up inside and out.", parse);
		Text.NL();
		Text.Add("Lagon repeats his demand, but his voice wavers, his fingers clenching weakly at the stone floor. From where you are, you can see that his cock is starting to stir, thrust from its sheath and bobbing drunkenly as Lagon shifts his hips, at least half-erect already.", parse);
		Text.NL();
		Text.Add("Vena’s tongue starts to drift lower, slowly lapping its way across Lagon’s taint, until she is starting to toy with his round, fuzzy balls. These she goes after with even greater enthusiasm, murmuring audibly as she licks, kisses and suckles with practiced ease.", parse);
		Text.NL();
		Text.Add("<i>“Y-you stupid, cu- ahn!”</i>", parse);
		Text.NL();
		Text.Add("Vena eventually lets Lagon’s ball fall from between her lips, having tried her best to leave a hickey on her husband’s nutsack, and resumes licking again. She takes advantage of Lagon’s distraction to adjust her grip; one arm curls around his waist, keeping him firmly pressed to her whilst freeing the other.", parse);
		Text.NL();
		Text.Add("With her spare hand, she reaches up between Lagon’s thighs, affectionately stroking his cock before she tenderly pulls it around, so it points back towards her - as much as it can do so, in its present state. Still caressing it with her fingers, she lowers her head, allowing her tongue to glide slowly across the exposed surface of Lagon’s shaft.", parse);
		Text.NL();
		Text.Add("Listening to Vena’s mewls of pleasure, watching the enthusiasm with which she licks her husband’s cock, you find yourself worried; what if Vena forgets the plan? She did make it clear that she prefers to catch rather than pitch; is it possible she’ll forget about needing to punish Lagon and she’ll let him fuck her instead?", parse);
		Text.NL();
		Text.Add("Vena languidly laps her way up Lagon's shaft, then lifts her face, a dreamy smile on her lips. <i>“Mmm, you taste just as sweet as ever, darling,”</i> she lovingly observes.", parse);
		Text.NL();
		Text.Add("<i>“If that’s the case, then go ahead and suck on my cock. We both know it’s what you love to do,”</i> Lagon replies with a weak grin.", parse);
		Text.NL();
		Text.Add("<i>“Mmm... any other time, I’d love to,”</i> Vena coos seductively. Then her brows furrow and she sadly shakes her head. <i>“But not this time. You need to be punished.”</i>", parse);
		Text.NL();
		Text.Add("Lagon growls at that. <i>“Punish this, punish that. Is that all you can say anymore? We both know you don’t want to do this, Vena, so why force yourself? Back down now and I’ll let you go back to your old position as the Pit’s centerpiece.”</i>", parse);
		Text.NL();
		Text.Add("Vena just shakes her head. <i>“And that is exactly why I <b>have</b> to do this,”</i> she replies.", parse);
		Text.NL();
		Text.Add("You can’t help but think that you should have given Vena more credit. She has more control than to just bend back over for her husband, no matter how much she still cares for him.", parse);
		Text.NL();
		Text.Add("She lets Lagon's cock go and shifts her hands to his hips. With a soft grunt of effort, she pushes herself upright, powerful limbs flexing as she stands straight. Their positions only exaggerate the size difference between the spouses; Lagon looks even smaller in contrast to his amazonian mate, particularly when she swings her monstrous maleness around and lays it on Lagon’s ass.", parse);
		Text.NL();
		Text.Add("<i>“You traitorous bitch! One more move and I’ll make sure you regret this for all your miserable life!”</i>", parse);
		Text.NL();
		Text.Add("Vena ignores her mate’s ranting, and focuses on adjusting her position, allowing her to bring the tip of her cock under Lagon’s tail.", parse);
		Text.NL();
		Text.Add("<i>“Now, if you’ll just take a deep breath and relax, dear, I know you’ll enjoy this. After all, you liked it when it was my tongue wriggling around in there, didn’t you?”</i> she observes, grinning at the observation.", parse);
		Text.NL();
		Text.Add("<i>“That was the most disgusting thing I’ve ever had happen to me!”</i> he replies.", parse);
		Text.NL();
		Text.Add("<i>“You were rock hard, my love - believe me, I know when you’re enjoying something,”</i> Vena giggles. <i>“Alright, try to relax, here I come...”</i> And with that, she starts to push, slowly pressing her huge cock into the former King’s tight, once-virginal anal ring.", parse);
		Text.NL();
		Text.Add("<i>“Argh! You traitorous bitch! I’ll get you for - gah!”</i>", parse);
		Text.NL();
		Text.Add("Vena stops pushing, smiling apologetically down at her husband. <i>“Shh, it’s alright, darling, you’re doing great. Just try to relax a little, that’s all - remember what it was like for Roa when it was his first time?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Don’t compare me to that pathetic whelp! - Guh! - Get your fucking dick out of my ass!”</i>", parse);
		Text.NL();
		Text.Add("<i>“I-I’m sorry, honey,”</i> Vena groans, <i>“but this would be a lot - nngh! - easier if you’d stop - haaah - wriggling!”</i> she hisses, even as she keeps on pushing deeper into Lagon’s tailhole. From the look on her face, though, the wriggling isn’t entirely unpleasant.", parse);
		Text.NL();
		Text.Add("From your position on the sidelines, you happily watch the amazing disappearing act that Vena is pulling. Even with everything, at least a third of her monstrous maleness has already vanished up under Lagon’s tail. It’s astonishing just how <b>stretchy</b> the toppled tyrant really is.", parse);
		Text.NL();
		Text.Add("Lagon spits a broken stream of curses, constantly cut off by strangled gasps of pleasure and pitiful moans as Vena picks up steam, pushing ever deeper into her husband. You’re positive you can see him bulging around the intruder by the time that, miraculously, Vena manages to lever the last few inches inside of him.", parse);
		Text.NL();
		Text.Add("Vena pants heavily, then weakly giggles. <i>“There we are, all done! See, dear? It’s not so bad...mmm, you feel really yummy wrapped around my cock like this,”</i> she confesses.", parse);
		Text.NL();
		Text.Add("<i>“Ack! Damn you, Vena!”</i>", parse);
		Text.NL();
		Text.Add("<i>“It’s okay, love, I know it feels weird - it felt weird for me too, the first time. But you’re really doing great at this; just give things a minute, and you’ll feel much better, I promise.”</i>", parse);
		Text.NL();
		Text.Add("As if to back up her assurances, Vena slowly and carefully shifts her position, gently moving her mammoth cock around inside of his straining hole, trying to help him stretch out more.", parse);
		Text.NL();
		Text.Add("<i>“S-stop moving! - Ah! - If you keep grinding, I’m gonna- Haa!”</i>", parse);
		Text.NL();
		Text.Add("Lagon lets out a howl of frustrated pleasure, arching his back as his own impressively sized cock throbs and then explodes. Thick, musky bunny seed spews across the smooth stone floor, a great puddle of slickness that rapidly spreads out around the humiliated rabbit.", parse);
		Text.NL();
		Text.Add("<i>“Oh! Oh my!”</i> Vena remarks, looking quite surprised at Lagon’s spontaneous climax. <i>“I knew you’d enjoy it if you gave it a chance, but I didn’t know you’d like it <b>this</b> much,”</i> she marvels.", parse);
		Text.NL();
		Text.Add("From your position on the sidelines, you can’t resist shouting that it looks like Lagon and Roa have more in common than he thought.", parse);
		Text.NL();
		Text.Add("<i>“Shut up! - Haa... - Both of you! I d-don’t like this! - Ahn... - I <b>hate</b> this! Pull out now!”</i>", parse);
		Text.NL();
		Text.Add("Smirking, you loudly ask why he’s still rock hard, if he hates it so much.", parse);
		Text.NL();
		Text.Add("Vena looks intrigued, and bends over her husband so she can grope under his belly for his cock. From your position on the sideline, you have a perfect view to watch as her hand closes gently around the throbbing member. She gently kneads it experimentally, shifting her hips slightly to grind his hole, and pre-cum seeps freely over her fingers.", parse);
		Text.NL();
		Text.Add("<i>“Oh, my! You really are enjoying yourself, aren’t you, dear? I can’t remember the last time you got ready again so quickly,”</i> Vena giggles.", parse);
		Text.NL();
		Text.Add("<i>“I-I’m no- Ahn!”</i>", parse);
		Text.NL();
		Text.Add("You smirk to yourself, as you think about where this is going. No matter how much he denies, it’s undeniable that Lagon enjoyed that very much; even his children can see through him. And if Lagon liked the insertion this much? You can only wonder how much harder he’ll cum when Vena’s actually fucking him.", parse);
		Text.NL();
		Text.Add("The lagomorph matron gives Lagon’s cock a playful squeeze, stroking it between her skilled fingers. <i>“Mmm, it’s good to see you’re getting into this, husband. Because I’m just getting started, darling,”</i> she giggles, winking mischievously at him.", parse);
		Text.NL();
		Text.Add("<i>“F-fuck you...”</i>", parse);
		Text.NL();
		Text.Add("Vena gives her husband’s cock a final stroke, and then straightens up again. Clasping him firmly by the hips, she starts to slowly lever herself out of his ass. Lagon’s deep groans echo through the Pit, though you can’t tell if they’re from pain, humiliation or just the loss of being so full. Heedless to her husband’s complaint, Vena keeps pulling out, and out, until only the tip remains inside of him.", parse);
		Text.NL();
		Text.Add("And then she starts to push home again, quicker than before, but still fairly slowly and steadily. Whether it is from concern for him or simply because of how tight he is, you can’t be sure. Whatever the reason, it doesn’t stop her from repeating the process again and again. Steadily, she starts to build up her pace, grunting and groaning indelicately as she starts to slam her hips into Lagon’s ass. Though she lacks balls for that extra meaty undertone to the slapping of flesh on flesh, the sound is still deliciously lewd.", parse);
		Text.NL();
		Text.Add("Stealing a glance around, you can see the other bunnies watching with rapt expressions. There’s no cheering, no calling for their mother to fuck their father good and hard, but that’s just because they don’t want to throw her off. A few are even starting to grope and make out with one another, little mini-orgies breaking out around the Pit.", parse);
		Text.NL();
		Text.Add("With nothing to do but watch, you settle back and enjoy the show, the big milfy amazon building her way up to rutting her smaller husband with the ferocity of a breeding bull. Embracing the atmosphere, you fondle yourself, feeling your own breath start to come quicker as Vena and Lagon remain locked in their perverse embrace.", parse);
		Text.NL();
		
		player.AddLustFraction(0.7);
		
		Text.Add("Lagon grunts and moans in sync with his wife, helpless to do anything under her onslaught. Hesitantly, at least at first, he starts to buck back against her, his drooling dick slapping wetly against his belly with each impact. His features are screwed up into an impenetrable mask, shame and lust visibly warring with each other for control.", parse);
		Text.NL();
		Text.Add("The once-proud patriarch of the warrens has been reduced to little better than a bitch-boy like his scorned son Roa, mewling and writhing as his wife unwittingly uses him as little more than a living cocksleeve. Thick jets of pre-cum spurt from his cock as she mercilessly crushes his prostate.", parse);
		Text.NL();
		Text.Add("Filled to the brim, it really isn’t any surprise when Lagon lifts his head and wails in pleasure, firing off another volley of cum into the puddle beneath him. This climax is even bigger and harder than the first, his whole body shaking madly as he spends himself shamelessly.", parse);
		Text.NL();
		Text.Add("Behind him, Vena moans, deep and throaty. <i>“I... oh, oh dear... I’m g-gonna cum,”</i> she whimpers. Her fingers clench down on Lagon’s rear, making him squeak in protest as she tries to pull out - emphasis on “tries”. Judging by the resistance she’s clearly meeting, Lagon isn’t in any hurry to let her go.", parse);
		Text.NL();
		Text.Add("It looks like Vena is going to lose her nerve at the final stretch. You promptly charge forward, racing for the matriarch, intent on ensuring that she really rubs her lesson in. Only question is, how are you going to do that?", parse);
		Text.Flush();
		TimeStep({hour: 1});
		
		let options = [];
		//[Cum inside] [Cum bath]
		options.push({nameStr : "Cum inside",
			tooltip : Text.Parse("Best way to humiliate Lagon is to show him what it’s like to be bred like a bitch.", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("Zipping around behind Vena, you place your hands on her gloriously full ass - too busy to even cop a feel - and firmly shove her forward, driving her back inside of Lagon to the hilt.", parse);
				Text.NL();
				Text.Add("Vena cries out in pleasure as her mate’s warm depths wrap around her again, his once tight asshole clenching down with all its might. Her whole body quakes as she goes off like a volcano, an almost literal eruption of cum going off inside of Lagon’s ass.", parse);
				Text.NL();
				Text.Add("Lagon squeals in shock and pleasure, a sound cut off by a liquid gurgle; Vena is cumming so hard and so much that some of her spunk has just gushed clean through her husband’s body and flown out his mouth! He clamps his lips together, on pure instinct, and holds on for dear life as Vena empties her load.", parse);
				Text.NL();
				Text.Add("And what a load... even from where you are, you can see Lagon’s sides quickly expanding outward, like an obscene pregnancy on super-speed. His gut stretches down to the floor, growing so full that it brushes the cool stone, and then it starts growing outward when it can’t go further down. Bigger, bigger... soon, Lagon’s belly actually lifts his feet a couple of inches off of the floor, leaving him wallowing on his own personal waterbed.", parse);
				Text.NL();
				Text.Add("You wonder for one awesome moment just how much Vena can make, hoping that it’s not more than Lagon can take, but your fears are unfounded. Vena groans and sighs, shuddering less violently as her mind-scrambling orgasm begins to ebb away, the cascade of cream cutting off.", parse);
				Text.NL();
				Text.Add("Eventually, she stands there, hands gently laying on Lagon’s butt for support, panting like a runner who just completed a marathon, almost steaming in the cool air of the Pit. On pure instinct, she gingerly pulls herself free of her husband’s ass, unleashing a waterfall of cum that cascades down over his balls and cock, pouring into the puddle beneath him.", parse);
				Text.NL();
				Text.Add("Vena staggers back a few steps, shaking her head as if to clear it, then stares dumbfounded at Lagon. <i>“...I did all that?!”</i> she squeaks in shock. When you nod in confirmation, she meekly rubs the back of her head. <i>“I guess I was a little more pent up than I thought,”</i> she confesses, nervously giggling at what she did.", parse);
				Text.NL();
				Text.Add("She shakes her head, draws herself up regally, and claps her hands. <i>“Alright! Children, take your father up to his room.”</i> She steals another disbelieving glance at him, then adds, <i>“I don’t think he can make it himself.”</i>", parse);
				Text.NL();
				Text.Add("The guards assigned to Lagon quickly scurry to obey, stealing awe-filled looks at their mother as they pass her by. Each slings one of their father’s arms over his shoulder, and then help him stumble to his feet. Straining a little under the weight, the threesome lurch away towards the tunnels, heading towards Lagon’s new home, where he will spend the rest of his life.", parse);
				Text.NL();
				Text.Add("Or at least until he learns his lesson and becomes a better bunny. Somehow, you don’t see that happening any time soon.", parse);
				Text.NL();
				LagonDScenes.PunishmentVenaCont();
			}
		});
		options.push({nameStr : "Cum bath",
			tooltip : Text.Parse("Lagon’s never going to live it down if his wife paints him in spooge.", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("Slipping over next to Vena, you watch her carefully, waiting for the moment to strike. As soon as her cock leaves the warm, tight confines of her husband’s ass, you pounce. Grappling the behemoth manhood, you roughly train it on the kneeling lagomorph, brushing the pulsating flesh with your hands.", parse);
				Text.NL();
				Text.Add("Vena moans deeply. You can <b>feel</b> her cock swelling with her climax - hells with it, you <b>see</b> it distend as the first massive gush of seed races up its length and spews forth, splashing down on the small of Lagon’s back like an almost physical mass. It splatters all over him, spraying up to soak his hair, flowing over his sides to pour into the puddle of his own cum.", parse);
				Text.NL();
				Text.Add("And then the next load is fired a heartbeat later. And then the next. And the next.", parse);
				Text.NL();
				Text.Add("Holding onto Vena’s cock as if it were a kicking calf, you do your best to aim it like a hose, utterly drenching Lagon from head to toe. Since he was all-white before, the color just blends in, but that he’s being soaked is undeniable from the way his fur mats together.", parse);
				Text.NL();
				Text.Add("By the time Vena finally dribbles her last few meager spurts of seed, Lagon looks like a drowned rat, seeming to have shrunk half his size with how closely his plastered fur clings to him. Whiteness spreads across the floor, a veritable lake of semen; if Lagon had been in some sort of tub, he could have easily taken a bath in his wife’s leavings.", parse);
				Text.NL();
				Text.Add("Seeing that Vena is finished, fully devoted to sucking in lungfuls of musky air, you let go of her cock and step back, allowing her to catch her bearings.", parse);
				Text.NL();
				Text.Add("Vena inhales deeply, exhales in a long sigh, and then straightens up, dusting herself off. She smiles gently at her husband, and gently pets his butt. <i>“There we are, dear; that wasn’t so bad, was it?”</i>", parse);
				Text.NL();
				Text.Add("Lagon glowers silently up at his wife, too beaten down to react verbally. He pointedly spits some stray cum out of his mouth, but otherwise doesn’t react.", parse);
				Text.NL();
				Text.Add("Vena’s smile falters a little, and she shakes her head softly. Turning back to the guards she picked out for Lagon, she gestures towards him. <i>“Take my husband to his new quarters. I’m sure he’d like to dry off a little.”</i>", parse);
				Text.NL();
				Text.Add("The snickering bunnies give Vena their best salutes and advance on their father. He scowls, and tries to stand up, only to nearly slip over in the thick puddle of cum he is standing in; only their timely intervention keeps him from falling flat on his face. Still glowering at anyone and everyone who tries to meet his eyes, Lagon is led away into the dark tunnels and his indefinite confinement.", parse);
				Text.NL();
				LagonDScenes.PunishmentVenaCont();
			}
		});
		Gui.SetButtonsFromList(options, false, null);
	}

	export function PunishmentVenaCont() {
		let player = GAME().player;
		
		let parse : any = {
			playername : player.name
		};
		
		Text.Add("With Lagon gone, Vena turns to you. <i>“Phew, that was tiring, but I think we made our point.”</i>", parse);
		Text.NL();
		Text.Add("Looking at the direction in which Lagon was taken, you smirk and agree that was most certainly what happened.", parse);
		Text.NL();
		Text.Add("<i>“Wasn’t counting on your intervention though.”</i> She smiles.", parse);
		Text.NL();
		Text.Add("You shrug casually and confess that it looked like she was a little lost on how to properly emphasize the point. You just wanted to make sure that Lagon <b>really</b> learnt his lesson. You’re sorry if she found that... upsetting.", parse);
		Text.NL();
		Text.Add("<i>“Hmm, but I still wonder if we weren’t a little too harsh on him.”</i>", parse);
		Text.NL();
		Text.Add("You immediately shake your head and disagree. There are countless worse punishments he could have received - that he would have received under a ruler less gentle than Vena herself. You tell her how he could have been branded, flogged, mutilated, exiled or even executed elsewhere. All he got here was a hot dicking in front of his kids from his loving wife.", parse);
		Text.NL();
		Text.Add("Smirking, you add as an afterthought that if he didn’t want to get fucked by his wife’s cock, he shouldn’t have given her one.", parse);
		Text.NL();
		Text.Add("<i>“I suppose you have a point. Didn’t expect him to like anal so much though.”</i>", parse);
		Text.NL();
		Text.Add("You agree that was a bit of a surprise. Then again, a lot of publically dominant types tend to have a bit of a submissive streak in private...", parse);
		Text.NL();
		Text.Add("<i>“I guess dear little Roa really takes after his father.”</i>", parse);
		Text.NL();
		Text.Add("Chuckling, you note that it certainly seems so.", parse);
		Text.NL();
		Text.Add("<i>“Well, umm, I suppose we should go and let my children have their pit back. I have a feeling they’re raring to return to their daily activities.”</i>", parse);
		Text.NL();
		Text.Add("You nod your agreement, and indicate for her to lead the way. The lagomorph queen pads off into the tunnels, heading towards the throne room, and you follow close behind.", parse);
		Text.Flush();
		
		TimeStep({hour: 1});
		
		Gui.NextPrompt(function() {
			MoveToLocation(WORLD().loc.Burrows.Throne, {minute: 15});
		});
	}
}
