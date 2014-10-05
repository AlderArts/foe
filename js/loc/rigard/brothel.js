
Scenes.Brothel = {};
Scenes.Brothel.IsOpen = function() {
	return !rigard.UnderLockdown(); // No closed hours
}

//
// Brothel
//
world.loc.Rigard.Brothel.brothel.description = function() {
	Text.Add("The main area of the Shadow Lady is a large open room, two stories high. In stark contrast with the city outside, the interior of the brothel is like a lush oasis of luxury; brilliantly colored cushions of rich cloth piled on divans and couches. An assortment of customers and concubines lounge in the room, talking to each other in smaller groups, or pursuing other forms of entertainment.");
	Text.NL();
	Text.Add("Dominating the hall is a large stage for performers to show off their assets. A number of second story balconies give the richer clientele a nice overview of the hall, in addition to allowing for some measure of privacy.");
	Text.NL();
	Text.Add("Near the back of the hall, you can see a set of stairs leading up to the second floor, where the rooms that house the brothel’s main business are located. Another set of stairs leads down to the basement.");
	Text.NL();
}

world.loc.Rigard.Brothel.brothel.links.push(new Link(
	"Outside", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Residental.street, {minute: 5});
	}
));

world.loc.Rigard.Brothel.brothel.events.push(new Link(
	"Bouncer", true, false,
	function() {
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
world.loc.Rigard.Brothel.brothel.events.push(new Link(
	"Lucille", true, false,
	function() {
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

world.loc.Rigard.Brothel.brothel.endDescription = function() {
	Text.Flush();
}

world.loc.Rigard.Brothel.brothel.onEntry = function() {
	if(rigard.Brothel["Visit"] == 0)
		Scenes.Brothel.First();
	else
		PrintDefaultOptions();
}

Scenes.Brothel.First = function() {
	var parse = {
		handsomePretty : player.mfFem("handsome", "pretty"),
		vagDesc : function() { return player.FirstVag().Short(); },
		playername : player.name,
		gender : Gender.Desc(player.Gender())
	};
	
	rigard.Brothel["Visit"] = 1;
	
	Text.Clear();
	Text.Add("Warmth and light wash over you as you step inside the Shadow Lady. You are immediately struck by the rich interior decoration - a telltale sign that the brothel is a really profitable business. Your attention, however, is quickly diverted by the breathtaking, scantily clad staff. It is quickly apparent how this place can bring in so much cash - there is someone here for every preference, be it male or female. This isn’t some common whorehouse either, the establishment oozes style and raw erotic tension.", parse);
	Text.NL();
	Text.Add("Your view is obstructed by a wall of muscle and teeth, as a large, blocky shark-morph steps in front of you, eyeing you suspiciously. ", parse);
	Text.Add(player.mfFem("He doesn’t look particularly happy to see you. Perhaps he doesn’t like your clothes.", "He quickly changes his expression as he gets a proper look at you, a wide, toothy grin slowly spreading across his face."));
	Text.NL();
	Text.Add("<i>“Now now, I’ll not have you take that attitude towards potential customers!”</i> The owner of the throaty voice, a stunning woman with dusky skin and curly jet black hair, makes her way over to you, her hips swaying alluringly. The blocky bouncer turns to face her, nodding slowly. He steps aside, returning his attention to the room at large.", parse);
	Text.NL();
	Text.Add("<i>“Pardon me for that, [handsomePretty],”</i> the lady gushes, adjusting a stray lock of her hair. <i>“Now, what can I do to help you? The Shadow Lady provides many services for one such as you… and perhaps opportunities as well.”</i>", parse);
	Text.NL();
	Text.Add("You take a moment to study the beauty, taking in her tall stature, dark skin and midnight hair. Her voluptuous curves are barely contained in the silky dress she is wearing, leaving very little to your imagination. Her eyes are deep dark pools which a [gender] could drown in, framed by thick lashes. If she wears makeup, it is very subtle, but you doubt a woman like this would need any extra enhancement to make anyone fall for her.", parse);
	Text.NL();
	Text.Add("<i>“The name is Lucille, Madam Lucille to most, but you can call me Lucy. I am the owner of this establishment. Now tell me, what is your pleasure?”</i> The last is said in a sultry voice, a faint seductive smile on her full, red lips. You shake your head, trying to clear the fog in your mind. There is an almost hypnotic quality to her voice, loaded with unspoken intimate promises.", parse);
	Text.Flush();
	
	player.AddLustFraction(1);
	
	//[Resist][Lucille]
	var options = new Array();
	options.push({ nameStr : "Resist",
		func : function() {
			Text.Clear();
			Text.Add("You open your mouth to reject her… but who are you kidding? You want... no. You need her!", parse);
			Text.NL();
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Despite your arousal, attempt to resist temptation."
	});
	options.push({ nameStr : "Lucille",
		func : function() {
			Text.Clear();
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "You want her."
	});
	Gui.SetButtonsFromList(options, false, null);
	
	Gui.Callstack.push(function() {
		Text.Add("Dreamily, you say that you are here for her. What possible other reason could you have for coming here? The madame gives you an artful titter, covering her mouth with a delicate hand. Playing coy with you.", parse);
		if(player.FirstCock())
			Text.Add(" You are almost unbearably hard, to the point that you are sure everyone in the room can notice. Not that you care.", parse);
		if(player.FirstVag())
			Text.Add(" Your [vagDesc] is practically dripping with juices, aching for release.", parse);
		Text.Add(" How can this tempress be so unbelievably sexy?", parse);
		Text.NL();
		Text.Add("<i>“I promise you this, if you only perform a few small tasks for me, I shall be yours,”</i> she whispers, leaning in so close that you can smell her intoxicating breath. <i>“You would show me a good time, would you not?”</i> Her hand hovers a fraction of an inch from your crotch. It takes all of your self control to not cum then and there. Abruptly, the woman steps away from you.", parse);
		Text.NL();
		Text.Add("<i>“The Shadow Lady has much to offer for someone like you, [playername],”</i> Lucille murmurs as she sweeps away, her long silky dress falling like a waterfall from her wide hips, dragging behind her. <i>“For you, in particular. Come see me later, we have much to speak of.”</i>", parse);
		Text.NL();
		Text.Add("You wipe some drool off your chin. As her spell on you lifts, you realize that you never told her your name.", parse);
		Text.Flush();
		
		world.TimeStep({minute: 30});
		
		Gui.NextPrompt();
	});
}




