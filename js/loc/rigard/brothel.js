
import { Event, Link } from '../../event';

import { GryphonsScenes } from '../../event/brothel/gryphons';
import { FireblossomScenes } from '../../event/brothel/fireblossom';
import { ChesScenes } from '../../event/brothel/ches';
import { BelindaScenes } from '../../event/brothel/belinda';
import { BastetScenes } from '../../event/brothel/bastet';
import { Gender } from '../../body/gender';
import { MoveToLocation, TimeStep, GAME } from '../../GAME';
import { Text } from '../../text';
import { Gui } from '../../gui';

let BrothelLoc = {
	brothel  : new Event("Brothel"),
	cellar   : new Event("Brothel: Cellar")
};

let BrothelScenes = {
	Gryphons : GryphonsScenes,
	Fireblossom : FireblossomScenes,
	Bastet : BastetScenes,
	Ches : ChesScenes,
	Belinda : BelindaScenes,
};

BrothelScenes.IsOpen = function() {
	return !rigard.UnderLockdown(); // No closed hours
}

BrothelScenes.NewMStrap = function() {
	var cock = new Cock(Race.Human);
	//#PC now has a 9” by 2” thick human cock.
	cock.length.base = 23;
	cock.thickness.base = 5;
	return cock;
}

//
// Brothel
//
BrothelLoc.brothel.description = function() {
	Text.Add("The main area of the Shadow Lady is a large open room, two stories high. In stark contrast with the city outside, the interior of the brothel is like a lush oasis of luxury: brilliantly colored cushions of rich cloth piled on divans and couches. An assortment of customers and concubines lounge in the room, talking to each other in smaller groups, or pursuing other forms of entertainment.");
	Text.NL();
	Text.Add("Dominating the hall is a large stage for performers to show off their assets. A number of second story balconies give the richer clientele a nice overview of the hall, in addition to allowing for some measure of privacy.");
	Text.NL();
	Text.Add("Near the back of the hall, you can see a set of stairs leading up to the second floor, where the rooms that house the brothel’s main business are located. Another set of stairs leads down to the basement.");
	Text.NL();
}

BrothelLoc.brothel.links.push(new Link(
	"Outside", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Residential.street, {minute: 5});
	}
));

BrothelLoc.brothel.events.push(new Link(
	"Bouncer", true, false,
	function() {
		let ches = GAME().ches;
		if(ches.Met())
			Text.Add("Ches the shark-morph keeps a watchful eye on customers and employees alike, lounging by the wall and radiating a sense of quiet competence.");
		else
			Text.Add("A large sharkman built like a brick is standing near the entrance, keeping a keen eye on the customers. With a bouncer like that, you’d be surprised if anyone ever attempts to start anything in here.");
		Text.NL();
	},
	function() {
		//TODO
	}
));
BrothelLoc.brothel.events.push(new Link(
	"Lucille", function() {
		let lucille = GAME().lucille;
		return lucille.IsAtLocation();
	}, false,
	function() {
		let lucille = GAME().lucille;
		if(lucille.IsAtLocation())
			Text.Add("Lucille wanders the hall, starting conversations here and there, inserting her charm to subtly urge the customers to spends more, and settling deals, employing her concubines.");
		else
			Text.Add("Lucille isn’t currently in the main hall, but there is a perky young woman who looks to be fulfilling her duties roaming the room.");
		Text.NL();
	},
	function() {
		//TODO
	}
));
BrothelLoc.brothel.events.push(new Link(
	function() {
		let roa = GAME().roa;
		return roa.Met() ? "Roa" : "Bunny";
	}, true, true,
	function() {
		let roa = GAME().roa;
		if(roa.Met())
			Text.Add("Roa the lapin is at his usual spot, clad in his skimpy outfit. He looks around for a potential john or jill, visibly sighing at the apparent lack of interest.");
		else
			Text.Add("A petitely built feminine rabbit-morph is over near the corner, lounging amongst the pillows on a plush couch. She casts a hopeful eye toward any potential customers.");
		Text.NL();
	},
	function() {
		Scenes.Roa.BrothelApproach();
	}
));
BrothelLoc.brothel.events.push(new Link(
	"Themed rooms", function() {
		let lucille = GAME().lucille;
		return lucille.ThemeroomOpen();
	}, true,
	null,
	function() {
		Scenes.Lucille.Themerooms();
	}
));

BrothelLoc.brothel.onEntry = function() {
	let rigard = GAME().rigard;
	if(rigard.Brothel["Visit"] == 0)
		BrothelScenes.First();
	else
		Gui.PrintDefaultOptions();
}

BrothelScenes.First = function() {
	let player = GAME().player;
	let rigard = GAME().rigard;

	var parse = {
		handsomePretty : player.mfFem("handsome", "pretty"),
		playername : player.name,
		gender : Gender.Desc(player.Gender())
	};
	
	parse = player.ParserTags(parse);
	rigard.Brothel["Visit"] = 1;
	
	Text.Clear();
	Text.Add("Warmth and light wash over you as you step inside the Shadow Lady. You are immediately struck by the rich interior decoration - a telltale sign that the brothel is a really profitable business. Your attention, however, is quickly diverted by the breathtaking, scantily clad staff. It is quickly apparent how this place can bring in so much cash - there is someone here for every preference, be it male or female. This isn’t some common whorehouse either, considering that the establishment oozes style and raw erotic tension.", parse);
	Text.NL();
	Text.Add("Your view is obstructed by a wall of muscle and teeth, as a large, blocky shark-morph steps in front of you, eyeing you suspiciously. ", parse);
	Text.Add(player.mfFem("He doesn’t look particularly happy to see you. Perhaps he doesn’t like your clothes.", "He quickly changes his expression as he gets a proper look at you, a wide, toothy grin slowly spreading across his face."));
	Text.NL();
	Text.Add("<i>“Now now, I’ll not have you take that attitude toward potential customers!”</i> The owner of the throaty voice, a stunning woman with dusky skin and curly jet black hair, makes her way over to you, her hips swaying alluringly. The blocky bouncer turns to face her, nodding slowly. He steps aside, returning his attention to the room at large.", parse);
	Text.NL();
	Text.Add("<i>“Pardon me for that, [handsomePretty],”</i> the lady gushes, adjusting a stray lock of her hair. <i>“Now, what can I do to help you? The Shadow Lady provides many services for one such as you… and perhaps opportunities as well.”</i>", parse);
	Text.NL();
	Text.Add("You take a moment to study the beauty, taking in her tall stature, dark skin and midnight hair. Her voluptuous curves are barely contained in the silky dress she is wearing, leaving very little to your imagination. Her eyes are deep dark pools which a [gender] could drown in, framed by thick lashes. If she wears makeup, it is very subtle, but you doubt a woman like this would need any extra enhancement to make anyone fall for her.", parse);
	Text.NL();
	Text.Add("<i>“The name is Lucille, Madam Lucille to most, but you can call me Lucy. I am the owner of this establishment. Now, tell me, what is your pleasure?”</i> The last is said in a sultry voice, a faint seductive smile on her full, red lips. You shake your head, trying to clear the fog in your mind. There is an almost hypnotic quality to her voice, loaded with unspoken intimate promises.", parse);
	Text.Flush();
	
	player.AddLustFraction(1);
	
	//[Resist][Lucille]
	var options = new Array();
	options.push({ nameStr : "Resist",
		func : function() {
			Text.Clear();
			Text.Add("You open your mouth to reject her… but who are you kidding? You want... no. You need her!", parse);
			Text.NL();
			Gui.PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Despite your arousal, attempt to resist temptation."
	});
	options.push({ nameStr : "Lucille",
		func : function() {
			Text.Clear();
			Gui.PrintDefaultOptions();
		}, enabled : true,
		tooltip : "You want her."
	});
	Gui.SetButtonsFromList(options, false, null);
	
	Gui.Callstack.push(function() {
		Text.Add("Dreamily, you say that you are here for her. What possible other reason could you have for coming here? The madame gives you an artful titter, covering her mouth with a delicate hand, playing coy with you.", parse);
		if(player.FirstCock())
			Text.Add(" You are almost unbearably hard to the point that you are sure everyone in the room can notice. Not that you care.", parse);
		if(player.FirstVag())
			Text.Add(" Your [vag] is practically dripping with juices, aching for release.", parse);
		Text.Add(" How can this tempress be so unbelievably sexy?", parse);
		Text.NL();
		Text.Add("<i>“I promise you this: if you only perform a few small tasks for me, I shall be yours,”</i> she whispers, leaning in so close that you can smell her intoxicating breath. <i>“You would show me a good time, would you not?”</i> Her hand hovers a fraction of an inch from your crotch. It takes all of your self control to not cum then and there. Abruptly, the woman steps away from you.", parse);
		Text.NL();
		Text.Add("<i>“The Shadow Lady has much to offer for someone like you, [playername],”</i> Lucille murmurs as she sweeps away, her long silky dress falling like a waterfall from her wide hips, dragging behind her. <i>“For you, in particular. Come see me later - we have much to speak of.”</i>", parse);
		Text.NL();
		Text.Add("You wipe some drool off your chin. As her spell on you lifts, you realize that you never told her your name.", parse);
		Text.Flush();
		
		TimeStep({minute: 30});
		
		Gui.NextPrompt();
	});
}

BrothelScenes.MStrap = function() {
	let player = GAME().player;
	let rigard = GAME().rigard;

	var parse = {
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumLegs() > 1);
	
	var num = rigard.Brothel["MStrap"];
	
	Text.Clear();
	Text.Add("As you stride through the brothel’s halls, your [ears] twitch as you pass by one of the closed doors. Sounds like somebody’s having a <b>lot</b> of fun in there... As you register this, you feel a distinctly abnormal twitching from your loins, which brings you to a stark halt.", parse);
	Text.NL();
	Text.Add("You’re still wearing that enchanted strap-on that you borrowed! You had better take that off before you leave the brothel; it can’t have been cheap, and you’d rather not get banned from the place as a thief.", parse);
	Text.NL();
	Text.Add("Spotting an empty room that’s been used recently, you duck inside; just long enough to give you some privacy should be okay, right? Once inside, you remove your [botarmor] and expose the artificial dick. Boy, it sure feels natural; no wonder you pulled your [botarmor] on over the top of it without stopping to think. But then, that’s magic, you guess.", parse);
	Text.NL();
	if(num < 10) {
		Text.Add("It’s funny, but it is becoming a little harder to remove your fake cock than you remember it being to put it on in the first place. You get an odd twinge of pleasure as your hand brushes the artificial shaft, but you soon have it removed.", parse);
		Text.NL();
		Text.Add("Placing it on the bedside table for the inevitable maid to pick up, you pull your [botarmor] back on and set off again.", parse);
	}
	else if(num < 15) {
		Text.Add("...Wow, this strap-on you borrowed is <b>really</b> attached to you. You have to keep yanking and tugging before it finally pops free of its place at your nethers, sparks of pleasure dancing through your brain with each stroke of your hand over the increasingly erect shaft.", parse);
		Text.NL();
		Text.Add("You find yourself leaning against the bed as you recover, panting for breath. When your [legs] stop[notS] trembling, you carelessly drop the fake cock on the bed and start gingerly pulling your [botarmor] back on.", parse);
		Text.NL();
		Text.Add("As you set back off again, the thought will not leave you alone that it feels like that toy you keep borrowing is getting harder and harder to take off...", parse);
	}
	else {
		Text.Add("As your hand skids along the shaft in your effort to pull it free, you moan at the surge of pleasure that crawls up your spine. You pull and tug and rub, but you can’t seem to get the strap-on to come off. All you seem to be doing is making it harder and harder...", parse);
		Text.NL();
		Text.Add("Blinded by a haze of frustration and pleasure, your hands go to the fabric holding the strap-on to your body and you start to yank and pull. You want this damn thing off! You wrestle for a few moments, and then the air reverberates with the sound of tearing material as the strap-on’s bindings come apart, peeling off of your loins in a tattered mess of fabric shreds.", parse);
		Text.NL();
		Text.Add("But the cock part remains, jutting out proudly and firmly from its position on your loins as if you had always had it there. You gasp at it, dumbfounded; somehow, your magic toy shaft has merged with you to become a real one!", parse);
		Text.NL();
		Text.Add("Through the shock, you feel your new flesh throb impatiently, a great wave of lust washing over your mind and drowning it out. Visions whirl through your mind’s eye of lusty maidens with fertile pussies drooling in anticipation of seeding, of submissive little bitch-boys bent over and mewling with desire as your rod fucks their boycunts... Spirits, you <b>need</b> to <b>FUCK!</b> You don’t care who, or what, just give you a damn hole to fuck, and give it to you now!", parse);
		Text.NL();
		parse["fem"] = player.mfFem("sir", "ma’am");
		Text.Add("<i>“Oh, forgive me, [fem]. I thought this room wa-aah!”</i>", parse);
		Text.NL();
		Text.Add("Overwhelmed by the unbearable lust sweeping through your body, you pounce upon the maid who so foolishly entered the room. You only dimly register her surprise, more focused on the impressive bulges of her C-cup bosom stretching out her top. You swing her off of her feet and around onto the bed, flipping up her skirt and yanking down her panties before she even stops bouncing.", parse);
		Text.NL();
		Text.Add("In a surge of motion, you have clambered onto the bed, looming over her as you mercilessly spread her legs and all but dive between them. In a single fierce thrust, you have buried half your length into her cunt, your lips seizing her own plush, kissable lips to muffle her protests. Like one possessed, you start to swing your hips, breaking the kiss only to focus on rutting her like the animal you have become.", parse);
		Text.NL();
		Text.Add("<i>“Oh, yes! Fuck me! Harder! Faster!”</i> she begs as you continue to mercilessly pound her.", parse);
		Text.NL();
		Text.Add("You eagerly comply, the bed squeaking and squealing from the force of your thrusts, matching the mewls and moans of the two of you. Lost in the haze of pleasure and lust that envelops you, it’s impossible to say how long you last; you only know when the molten ice of climax spikes in your brain and you cum, the maid under you shrieking loudly in orgasm as her cunt milks your newfound dick of its cream.", parse);
		Text.NL();
		
		var cum = player.OrgasmCum();
		
		Text.Add("When you have spent yourself at last, you roll limply away, your recent bedmate panting as heavily as you. Dimly, you register her huge grin of satisfaction.", parse);
		Text.NL();
		Text.Add("<i>“T-thank you, [fem]. That was… amazing...”</i> she says before closing her eyes and passing out.", parse);
		Text.NL();
		Text.Add("Unthinkingly, you check on her to be sure she’s alright, then slowly rise from the bed. Looks like your new appendage is the real deal, then. Carefully, you pull your [botarmor] back on, then slip quietly out of the room, leaving your partner to sleep the sleep of the soundly fucked behind you.", parse);
		
		player.body.cock.push(BrothelScenes.NewMStrap());
	}
	Text.Flush();
	
	Gui.NextPrompt();
}

export { BrothelLoc, BrothelScenes };
