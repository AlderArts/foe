/*
 * 
 * The Burrows, Lagomorph dungeon
 * 
 */



// Create namespace
world.loc.Burrows = {
	Enterance : new Event("The Burrows"),
	Pit       : new Event("The Pit"),
	Lab       : new Event("Lab"),
	Throne    : new Event("Throne room")
}


Scenes.Burrows = {};

// Class to handle global flags and logic for dungeon
function Burrows(storage) {
	this.flags = {};
	
	this.flags["Access"]      = Burrows.AccessFlags.Unknown;
	this.flags["HermTrait"]   = Burrows.TraitFlags.Inactive;
	this.flags["BrainyTrait"] = Burrows.TraitFlags.Inactive;
	this.flags["BruteTrait"]  = Burrows.TraitFlags.Inactive;
	
	if(storage) this.FromStorage(storage);
}

Burrows.AccessFlags = {
	Unknown           : 0, //TODO: maybe redo burrows intro
	KnownNotVisited   : 1,
	Visited           : 2, //talked to Lagon
	Stage1            : 3, //turned in first ingredient
	Stage2            : 4, //turned in second ingredient
	Stage3            : 5, //turned in final ingredient
	Stage4            : 6, //talked to Roa about scepter
	Stage5            : 7, //confronted Gol
	QuestlineComplete : 8  //confronted Lagon and sided with him or Ophelia
};

Burrows.TraitFlags = {
	Inactive         : 0,
	Gathered         : 1,
	Active           : 2
};

Burrows.prototype.Access = function() {
	return this.flags["Access"] >= Burrows.AccessFlags.Visited;
}
Burrows.prototype.HermActive = function() {
	return this.flags["HermTrait"] >= Burrows.TraitFlags.Active;
}
Burrows.prototype.BrainyActive = function() {
	return this.flags["BrainyTrait"] >= Burrows.TraitFlags.Active;
}
Burrows.prototype.BruteActive = function() {
	return this.flags["BruteTrait"] >= Burrows.TraitFlags.Active;
}

Burrows.prototype.ToStorage = function() {
	var storage = {};
	
	storage.flags = this.flags;
	
	return storage;
}

Burrows.prototype.FromStorage = function(storage) {
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
}


//
// Burrows entrance
//
world.loc.Burrows.Enterance.description = function() {
	Text.AddOutput("");
}

world.loc.Burrows.Enterance.links.push(new Link(
	"Plains", true, true,
	function() {
		Text.AddOutput("Behind you is the way back to the plains.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Plains.Crossroads, {minute: 30});
	}
));

world.loc.Burrows.Enterance.endDescription = function() {
	Text.AddOutput("");
}

world.loc.Burrows.Enterance.onEntry = function() {
	if(burrows.flags["Access"] == Burrows.AccessFlags.KnownNotVisited) {
		var parse = {};
		
		if(party.Two())
			parse["comp"] = " and " + party.Get(1).name;
		else if(!party.Alone())
			parse["comp"] = " and your companions";
		else
			parse["comp"] = "";
		
		Text.Clear();
		
		Text.Add("You hide a fair distance from the large mob of rabbits surrounding the burrows. There doesn’t seem to be any way for you to approach without getting overwhelmed and captured in the process, and who knows what they have in mind for you...", parse);
		Text.NL();
		Text.Add("Still, you’ll never know what is going on in this place unless you enter... perhaps you could try to negotiate with them?", parse);
		Text.Flush();
		
		//[Leave][Approach]
		var options = new Array();
		options.push({ nameStr : "Leave",
			func : function() {
				Text.NL();
				Text.Add("You still have some second thoughts about approaching the unpredictable mob. You decide to head back towards the crossroads.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Plains.Crossroads, {minute: 30});
				})
			}, enabled : true,
			tooltip : "Go back where you came from."
		});
		options.push({ nameStr : "Approach",
			func : function() {
				Text.Clear();
				Text.Add("Well, time to get to the bottom of this. Hopefully this won’t turn out to be a really bad idea...", parse);
				Text.NL();
				Text.Add("You[comp] cautiously approach the edge of the mob, wary of getting surrounded. A few rabbits notice you, pointing excitedly, but they don’t seem to be aggressive. Feeling slightly more confident, you stride forward to meet them. Your initial attempts at conversation leave the lagomorphs looking rather confused, though one of them hops away, presumably to fetch someone important. The others form a small circle around you, watching you curiously, occasionally hopping closer to prod at you.", parse);
				Text.NL();
				
				// Create a new alpha
				var alpha = new LagomorphAlpha();
				parse["m1HeShe"]  = function() { return alpha.HeShe(); };
				parse["m1heshe"]  = function() { return alpha.heshe(); };
				parse["m1HisHer"] = function() { return alpha.HisHer(); };
				parse["m1hisher"] = function() { return alpha.hisher(); };
				parse["m1himher"] = function() { return alpha.himher(); };
				
				Text.Add("After enduring their odd behavior for a few minutes, the messenger returns with one of the lagomorph alphas, a ", parse);
				if(alpha.Gender() == Gender.male)
					Text.Add("lean, strapping male, his rather impressive manhood on full display.", parse);
				else if(alpha.Gender() == Gender.herm)
					Text.Add("pretty hermaphrodite, her decently sized cock contrasting nicely with her feminine curves and full breasts.", parse);
				else //female
					Text.Add("pretty female with a lean, slightly toned body. She makes no attempt to hide her full breasts and the damp patch between her legs from you.", parse); 
				Text.Add(" [m1HeShe] approaches, hopping around you[comp], trying to evaluate if you are a threat, or perhaps something fun. The rabbit puffs up [m1hisher] chest, asking you imperiously:", parse);
				Text.NL();
				Text.Add("<i>“Friend? Foe?”</i> The intended intimidation is somewhat dulled by [m1hisher] kindergarten communication skills. You reply that you mean no harm, you just want to be taken to whoever is in charge.", parse);
				Text.NL();
				Text.Add("<i>“Friend, yes? Join colony, yes?”</i> The alpha looks excited, and the mood seems to be spreading. Dimly, you notice that quite a large number of rabbits have gathered around you, whispering to each other and pointing at you. You nod, a bit uncertain, which seems to delight [m1himher].", parse);
				Text.NL();
				Text.Add("<i>“Big party! Come, come!”</i> Before you even have a chance to respond, you[comp] are whisked up by the mob, hoisted on the paws of dozens of lagomorphs. Ignoring your protests, the alpha leads the way towards the hills, with you in tow.", parse);
				Text.NL();
				Text.Add("Perhaps this wasn’t the most well thought out plan.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Scenes.Burrows.Arrival(alpha);
				});
			}, enabled : true,
			tooltip : "Try to approach peacefully."
		});
		Gui.SetButtonsFromList(options);
	}
	else
		PrintDefaultOptions();
}

world.loc.Plains.Crossroads.links.push(new Link(
	"Burrows", function() { return burrows.flags["Access"] != Burrows.AccessFlags.Unknown; }, true,
	function() {
		if(burrows.flags["Access"] != Burrows.AccessFlags.Unknown)
			Text.AddOutput("You know how to find the Burrows, should you want to.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Burrows.Enterance, {minute: 30});
	}
));


Scenes.Burrows.Arrival = function(alpha) {
	var parse = {
		skinDesc   : function() { return player.SkinDesc(); },
		p1name     : function() { return party.Get(1).name; },
		m1HeShe    : function() { return alpha.HeShe(); },
		m1heshe    : function() { return alpha.heshe(); },
		m1HisHer   : function() { return alpha.HisHer(); },
		m1hisher   : function() { return alpha.hisher(); },
		m1himher   : function() { return alpha.himher(); },
		m1cockDesc : function() { return alpha.FirstCock().Short(); }
	};
	if(party.Two())
		parse["comp"] = " and " + party.Get(1).name;
	else if(!party.Alone())
		parse["comp"] = " and your companions";
	else
		parse["comp"] = "";
	
	party.location = world.loc.Burrows.Pit;
	
	burrows.flags["Access"] = Burrows.AccessFlags.Visited;
	
	Scenes.Burrows.ArrivalTime = world.time.hour;
	
	Text.Add("You pass through a crowd of curious onlookers, though many are too distracted to notice you, caught up in a shameless impromptu orgy which seems to have suddenly formed. Lithe hands reach up, touching your body as you walk by, voices tittering and whispering to each other. There is a single phrase they chant, growing louder and louder, until your progress is heralded by a multitude of piping voices shouting: <i>“The Pit! The Pit!”</i>", parse);
	Text.NL();
	Text.Add("Although you aren’t sure what “the Pit” is, you suspect it’s not good for your continued well-being. You are quickly carried into a large tunnel, dimly lit by small earthenware pots holding a faintly glowing powder. Passages split off to each side, and your sense of direction is soon thoroughly confused by the maze.", parse);
	Text.NL();
	Text.Add("Lewd moans from many of the shady paths leave you with little doubt what the main pastime is in this little community, with your guess confirmed by the fact that most if not all of the females you see are in various stages of pregnancy.", parse);
	Text.NL();
	Text.Add("Your troupe slows down, apparently closing in on its destination. You stare as you are carried into an immense chamber, so large that you are unable to see the opposite side in the dim light. Haphazard structures of piled-up wood act as supporting pillars, presumably preventing the roof from crashing in. Exactly how they manage to do this is bewildering, as the collective engineering skill of the rabbits seems about equal to that of a five-year old. A five-year old with broken arms.", parse);
	Text.NL();
	Text.Add("The room is packed with more of the small creatures, engaged in undoubtedly the largest orgy you have ever witnessed. There must be hundreds of them in there. The air is thick with the smells and sounds of sex; lustful moans and grunts so numerous they meld into a continuous drone.", parse);
	Text.NL();
	Text.Add("You are carried down a slope, presumably towards the center of the chamber. Sneaking a look to the side, you see what almost looks like irrigation canals carrying sticky sexual fluids downstream. Everywhere your eye can see, large clusters of rabbits are fornicating, driven by their frantic lust and seemingly endless supply of energy. It doesn’t seem just for reproduction either, as you see plenty of already pregnant females, a well as a large number of males, being on the receiving end.", parse);
	Text.NL();
	Text.Add("The small streams of the intricate irrigation system join together into larger streams, finally seeping into what looks like a pool - a very sticky, cream-colored pool. You idly wonder how long this has been going on to gather this much... fluids. Knee-deep in the accumulated spooge is without a doubt the largest lagomorph specimen you have seen so far.", parse);
	Text.NL();
	Text.Add("She is immense, so swollen with child that you don’t doubt that her eventual litter will number at least a dozen. Her heaving breasts continually leak of milk, adding to the mess she wallows in. The matriarch is attended by a group of males, at least four of them filling her at any given moment. The remaining ones wait their turn, taking out their frustrated sexual urges on lesser females, or on each other. The focus of the orgy is in constant rapture, her eyes rolled back in her head.", parse);
	Text.NL();
	Text.Add("The chant of your entourage has turned into “mother, mother, mother”, their voices reverent. You are unceremoniously dumped into the lake of spooge, coughing desperately as you involuntarily ingest a mouthful of the salty liquid. You try to stand up, but find that you are held in place by your captors, head barely above the surface of the pool.", parse);
	if(party.Two())
		Text.Add("Dimly, you notice [p1name], gasping for air in the sludge beside you.", parse);
	else if(!party.Alone())
		Text.Add("Dimly, you notice your companions, gasping for air in the sludge beside you.", parse);
	Text.NL();
	Text.Add("<i>“Just what is the meaning of this?”</i> Surprised, you look up, finding yet another lagomorph standing in front of you. Unlike her brothers and sisters, she is actually clothed, her curvy figure and generous bosom covered by a long white coat. A pair of glasses rest on the bridge of her tiny pink nose, lending her an almost scholarly appearance.", parse);
	Text.NL();
	Text.Add("<i>“Good catch! Reward!”</i> The agitated alpha who brought you hops up and down excitedly. The woman sighs, exasperated, burying her face in her palms. She goes on to berate your captor for acting like thugs and assaulting random travelers. Her elaborate rhetoric seems to go way over the alpha’s head, though [m1heshe] is just bright enough to know [m1heshe] is being chastised, [m1hisher] ears drooping in remorse.", parse);
	Text.NL();
	Text.Add("The strange orator shoos your entourage away, and offer you a hand up. The entire situation is quite bizarre, as she doesn’t seem to mind the rampant orgy that is going on only a few feet away, but you are more than happy to grasp onto even a semblance of normality. Besides, she seems to be the only person here capable of forming sentences longer than two words, and that has to count for something, right?", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		
		Text.Add("<i>“Terribly sorry about this, they get a bit carried away at times,”</i> the strange lagomorph laments, shaking her head. <i>“I am Ophelia, nice to meet you!”</i> You nod uncertainly, offering your own name.", parse);
		Text.NL();
		Text.Add("<i>“A pleasure, I’m sure,”</i> she smiles ruefully. <i>“Mind moving somewhere else? I have trouble thinking whenever I’m here.”</i> You[comp] hurry after her, relieved to be saved from being turned into a mindless slave.", parse);
		Text.NL();
		Text.Add("<i>“You’ve already met my mother,”</i> Ophelia waves at the grossly pregnant matriarch, all her holes still stuffed by her worshippers. <i>“Her name is Vena, though she hardly even responds to it anymore,”</i> the woman tells you sadly as she walks a winding path out of the Pit.", parse);
		Text.NL();
		Text.Add("You are plagued with questions, but for now, you are happy just to get away from this place. You[comp] walk in silence, following the rabbit intellectual. After passing through some more serpentine tunnels, you end up in a larger room, cluttered with various bottles, vials and alchemical instruments.", parse);
		Text.Flush();
		
		party.location = world.loc.Burrows.Lab;
		world.TimeStep({minute: 30});
		
		Gui.NextPrompt(Scenes.Burrows.ArrivalOphelia);
	});
}

Scenes.Burrows.ArrivalOphelia = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("Unlike the rest of the underground complex, the room is brightly lit, though the unidentified lightsource casts a greenish tinge to everything you see. Near the back of the room, three lagomorphs are chained to the wall, one of them sleeping and the other two locked together in intercourse.", parse);
	Text.NL();
	Text.Add("<i>“Please, don’t mind them,”</i> Ophelia waves at them dismissively, <i>“they help me with my work. Have a seat.”</i> You are ushered onto a narrow bench along one wall, taking your seat carefully to avoid breaking something. The woman hands you a relatively clean towel, gesturing for you to get the worst of the Pit off yourself. She takes off her own coat, shamelessly revealing her nude body. You get a good display of everything she’s got, as she twirls around and hops over to a nearby closet, bending inside to fetch another identical coat.", parse);
	Text.NL();
	Text.Add("<i>“Visiting mother is always such a messy business,”</i> Ophelia complains as she fastens the garment, fitting it snugly across her chest. She adjusts her glasses and purses her lips, scrutinizing you. <i>“Now, what do we have here? You said your name was [playername]?”</i>", parse);
	Text.NL();
	Text.Add("You nod, and tell her that the rabbits accosted you while you were travelling to the city to visit the market. She doesn’t seem entirely convinced, but nods amiably.", parse);
	Text.NL();
	Text.Add("<i>“You must have questions of your own...”</i>", parse);
	Text.Flush();
	
	Scenes.Burrows.OpheliaTalkBurrows = false;
	Scenes.Burrows.OpheliaTalkOphelia = false;
	Scenes.Burrows.OpheliaTalkVena    = false;
	Scenes.Burrows.OpheliaTalkLab     = false;
	
	Scenes.Burrows.ArrivalOpheliaTalk();
}

Scenes.Burrows.ArrivalOpheliaTalk = function() {
	var parse = {
		playername : player.name
	};
	if(party.Two())
		parse["comp"] = " and " + party.Get(1).name;
	else if(!party.Alone())
		parse["comp"] = " and your companions";
	else
		parse["comp"] = "";
	
	
	//[Burrows][Ophelia][Vena][Lab]
	var options = new Array();
	if(!Scenes.Burrows.OpheliaTalkBurrows) {
		options.push({ nameStr : "Burrows",
			func : function() {
				Text.Clear();
				Text.Add("You ask her about this place, and about her species.", parse);
				Text.NL();
				Text.Add("<i>“I can see we are still relatively unknown outside. That is good,”</i> Ophelia nods, jotting down a note on a piece of paper. <i>“Sorry, I rarely talk to people from outside,”</i> she apologizes. <i>“Father is not quite ready to announce our presence yet.”</i>", parse);
				Text.NL();
				Text.Add("She purses her lips. <i>“I only know how the colony started through stories, since it happened before I was born. Years ago, we were nothing but a feral species, hardly capable of communication, and only barely cooperating.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Father changed that. He united the various smaller tribes under his rule, and gathered them here. He is... you could say he is a mutation, much more intelligent than your average lagomorph. I’ve put some time into studying the matter, especially since the same condition has manifested in me as well.”</i>", parse);
				Text.NL();
				Text.Add("<i>“I’ve been noticing a gradual change in my siblings too, a good sign that the trait is propagating.”</i>", parse);
				Text.Flush();
				Scenes.Burrows.OpheliaTalkBurrows = true;
				Scenes.Burrows.ArrivalOpheliaTalk();
			}, enabled : true,
			tooltip : "Ask about this place. Why are so many lagomorphs gathered in one place?"
		});
	}
	if(!Scenes.Burrows.OpheliaTalkOphelia) {
		options.push({ nameStr : "Ophelia",
			func : function() {
				Text.Clear();
				Text.Add("You ask Ophelia how it is that she is so different from every other lagomorph you’ve met so far.", parse);
				Text.NL();
				Text.Add("<i>“I carry a rare mutation, inherited from my father. It significantly increases my intelligence and rational thinking abilities, and I’ve been sure to cultivate this gift as well as I can.”</i> She gestures around the room. Besides the alchemical instruments, there is a large number of books packed on shelves, ranging across a multitude of topics.", parse);
				Text.NL();
				Text.Add("<i>“Father got them for me,”</i> she beams proudly, <i>“I’ve read all of them several times, though father insists I should only focus on those pertaining to alchemy.”</i> The lagomorph hops over to one of the shelves, touching the backs of the books fondly.", parse);
				Text.NL();
				Text.Add("<i>“I... sometimes rebel, though,”</i> she admits, <i>“I’ve taken a liking to tales of adventure and romance. It’s just too bad I so rarely get to go outside to expand my collection, since my work here keeps me too busy. You wouldn’t happen to have such books, would you?”</i> she asks hopefully.", parse);
				Text.NL();
				Text.Add("You shake your head.", parse);
				Text.Flush();
				Scenes.Burrows.OpheliaTalkOphelia = true;
				Scenes.Burrows.ArrivalOpheliaTalk();
			}, enabled : true,
			tooltip : "Ask her about herself. Why is she so different from the rest of the rabbits?"
		});
	}
	if(!Scenes.Burrows.OpheliaTalkVena) {
		options.push({ nameStr : "Vena",
			func : function() {
				Text.Clear();
				Text.Add("You ask her about her... mother, Vena, whom you saw in the Pit.", parse);
				Text.NL();
				Text.Add("<i>“Mom... she... didn’t use to be like that.”</i> Ophelia looks sad, reminiscing of better times. <i>“It... it’s important for father to quickly expand the colony, so... so I...”</i>", parse);
				Text.NL();
				Text.Add("You try to keep your expression neutral, as she is clearly conflicted on the matter. How can one woman make such a huge difference, though? And... what about Ophelia’s father?", parse);
				Text.NL();
				Text.Add("<i>“Mother is... different.”</i> Ophelia points to several large earthenware jugs lining one side of the room. <i>“My early experiments didn’t have the same potency as they do now, but at times I would hit gold. Though the effect is rare, I managed to brew a potion that would increase the fertility and lower the gestation period of females. On most subjects, it caused sterility, but on mother it proved more than effective. She can produce a litter in less than a day.”</i>", parse);
				Text.NL();
				Text.Add("<i>“The process is... exhausting, however.”</i> She bows her head. <i>“She barely knows anything other than the pleasure of breeding and birthing. Her dedication to the colony is truly admirable.”</i>", parse);
				Text.NL();
				Text.Add("You repeat your last question.", parse);
				Text.NL();
				Text.Add("<i>“What about my father?”</i> she asks, confused, <i>“he mates with her at times, but there are many others vying for his attention. It is the highest of honors to be bred by him.”</i>", parse);
				Text.Flush();
				Scenes.Burrows.OpheliaTalkVena = true;
				Scenes.Burrows.ArrivalOpheliaTalk();
			}, enabled : true,
			tooltip : "Ask about Ophelia’s mother."
		});
	}
	if(!Scenes.Burrows.OpheliaTalkLab) {
		options.push({ nameStr : "Lab",
			func : function() {
				Text.Clear();
				Text.Add("<i>“This is my workplace. Neat, isn’t it?”</i> Ophelia looks proudly at the rather dank laboratory, filled with odd jars and vials. Her workbench is a jumble of scribbled notes and bubbling concoctions.", parse);
				if(rosalin.flags["Met"] == 1)
					Text.Add(" By comparison, Rosalin runs a tight ship. That, if anything, should be a huge warning sign.", parse);
				Text.NL();
				Text.Add("<i>“I’ve gotten much better lately, though I need better ingredients. There are so many useful things that I want to brew!”</i>", parse);
				Text.NL();
				Text.Add("And the... slaves? Why are they here?", parse);
				Text.NL();
				Text.Add("<i>“Ah, they are volunteers,”</i> Ophelia explains, <i>“the shackles are for their own safety, so that they don’t eat something bad. They help me by testing out my experiments. Just this week, I’ve created a new potion that boosts strength. I’m keeping a watch on them for side effects.”</i>", parse);
				Text.NL();
				Text.Add("Live test subjects. Just what is being done here? And to what end?", parse);
				Text.Flush();
				Scenes.Burrows.OpheliaTalkLab = true;
				Scenes.Burrows.ArrivalOpheliaTalk();
			}, enabled : true,
			tooltip : "Ask about the lab you are in, and the slaves being kept there."
		});
	}
	if(options.length > 0)
		Gui.SetButtonsFromList(options);
	else {
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("You have one more question... who exactly is her father?", parse);
			Text.NL();
			Text.Add("<i>“Ah... perhaps I have said too much already.”</i> Ophelia looks a bit worried.", parse);
			Text.NL();
			Text.Add("Your discussion is interrupted by the arrival of a breathless messenger, hopping anxiously from foot to foot.", parse);
			Text.NL();
			Text.Add("<i>“Yes?”</i> Ophelia asks the newcomer. ", parse);
			Text.NL();
			parse["s"] = party.Alone() ? "" : "s";
			Text.Add("<i>“King Lagon! Bring captive[s]!”</i> he announces, pulling on your arm. You notice several more decidedly martial-looking lagomorphs waiting in the shadows outside.", parse);
			Text.NL();
			Text.Add("<i>“Captive[s]? See, they are still not very good with language,”</i> Ophelia tuts. <i>“I’m sure he means honored guests.”</i> She smiles at you. <i>“Well, shall we go and meet my father?”</i>", parse);
			Text.Flush();
			
			//[Go along][Resist]
			var options = new Array();
			options.push({ nameStr : "Go along",
				func : function() {
					Text.Clear();
					Text.Add("You nod uncertainly, not seeing much choice in the matter. As you[comp] head outside together with Ophelia, the regiment of guards close ranks around you, leading you off to who knows where. These are a different breed of rabbits than the simple mob milling around on the surface; disciplined, alert, and carrying a variety of weapons. A quick look tells you their equipment is in poor shape, as if its owners don’t know how to care for it. It shows signs of relatively recent combat, giving you the sinking feeling that most of it is probably looted from unlucky adventurers such as yourself.", parse);
					Text.NL();
					Text.Add("Ophelia maintains a cheerful air as you walk together, chatting with you and asking you about the outside world. The rest of your guard largely ignore you, though they look ready to pounce into action, should you show any signs of resistance.", parse);
					Text.Flush();
					
					party.location = world.loc.Burrows.Throne;
					world.TimeStep({hour: 1});
					
					Gui.NextPrompt(Scenes.Burrows.ArrivalLagon);
				}, enabled : true,
				tooltip : "You are not in a good position to mount a resistance, surrounded as you are. You aren’t even sure that you could find your way out on your own."
			});
			options.push({ nameStr : "Resist",
				func : function() {
					Text.Clear();
					Text.Add("You make your decision quickly. Bouldering past the hapless messenger, you overpower two of the guards with the element of surprise on your side. You find your intended escape route blocked, however, as there appear to be enough rabbits on hand to make any progress down the tunnel impossible. It looks like you have to find another way. There should be several exits to the laboratory...", parse);
					Text.NL();
					Text.Add("Before you have time to make your next move, you feel a sharp prick on the side of your neck. Ophelia lithely hops back as you twirl around to face your attacker. There is a dripping needle in one of her hands.", parse);
					Text.NL();
					Text.Add("<i>“Sorry, but you’ll have to go meet father,”</i> Ophelia tells you. You take a step towards her, but you are growing weak, your vision blurring as the substance injected into your veins starts to take effect. Sound fades as the world spins, the ground speeding in from the side, connecting with your skull in a dull thud.", parse);
					Text.NL();
					Text.Add("...", parse);
					Text.NL();
					Text.Add("When you come to, you are being dragged through the tunnels, surrounded on all sides by armed lagomorph guards. Still weak from the sedative, you have no choice but to go along. You vaguely notice Ophelia walking beside you, though she remains quiet, looking a little guilty.", parse);
					Text.NL();
					Text.Flush();
					
					party.location = world.loc.Burrows.Throne;
					world.TimeStep({hour: 1});
					
					Gui.NextPrompt(Scenes.Burrows.ArrivalLagon);
				}, enabled : true,
				tooltip : "Screw this! Try to fight your way out before it’s too late!"
			});
			Gui.SetButtonsFromList(options);
		});
	}
}

Scenes.Burrows.ArrivalLagon = function() {
	var parse = {
		playername : player.name,
		heshe      : player.mfFem("he", "she")
	};
	
	Text.Clear();
	Text.Add("After walking through the winding underground tunnels for a while, you reach a large room, on the same scale with the Pit. Flaming braziers light the center of the chamber, leaving the areas near the walls in perpetual shadow. Guards line the entrance, standing at attention on both sides.", parse);
	Text.NL();
	Text.Add("In the middle of the hall, a large - if somewhat ramshackle - throne of wood, stone, and metal stands. Reclining on it, looking rather bored, is the most athletic lagomorph you’ve yet to see in the burrows. Significantly taller than the average rabbit, he is about the height of a regular human. There doesn’t seem to be an ounce of fat on his body, only wiry sinews and perfectly toned muscles.", parse);
	Text.NL();
	Text.Add("Perhaps a dozen or so young lagomorph women are attending him, serving him food and scurrying about tending to lazily given commands. Two are kneeling between his legs, worshipping his stiff, almost knee-length cock.", parse);
	Text.NL();
	Text.Add("<i>“Now, what do we have here?”</i> He drawls. The self-proclaimed king of the rabbits - Lagon, if you recall correctly - has a deep, rumbling voice. His sharp, cruel eyes glow red in the flickering light of the roaring flames, locked on you as if on a tasty morsel. You squirm a bit uncomfortably. Rabbits <i>are</i> herbivores, right?", parse);
	Text.NL();
	Text.Add("<i>“Father,”</i> Ophelia greets him and curtsies. <i>“This is [playername], a traveler from outside.”</i>", parse);
	Text.NL();
	Text.Add("<i>“I can damn well see that [heshe]’s from outside, you think I’m blind, girl?”</i> Lagon snaps. <i>“The question is, why is [heshe] here?”</i> Ophelia explains the circumstances in which you arrived at the burrows, and how she took you in.", parse);
	Text.NL();
	Text.Add("<i>“Marvellous.”</i> The muscular rabbit sounds less than pleased. You grab this moment to ask some questions of your own, like why he is amassing and slowly transforming what could only be an army. Lagon stares at you blankly, then makes a small gesture to the guards.", parse);
	Text.NL();
	Text.Add("Though the guards’ feet are padded, they still hurt like hell. <i>“Don’t get the wrong idea,”</i> Lagon growls. <i>“You are in the presence of a king, show respect.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Father...”</i> Ophelia starts, as if to interject.", parse);
	Text.NL();
	Text.Add("<i>“And you,”</i> the patriarch snaps, <i>“you let your tongue wag way too freely.”</i> Almost casually, he sweeps the two girls massaging his cock away to the side. <i>“Your sisters bore me. Attend your father, Ophelia, put that mouth of yours to proper use,”</i> he drawls. She looks reluctant, but obeys, crawling to his side.", parse);
	Text.NL();
	Text.Add("<i>“Now then,”</i> Lagon muses, leaning back as Ophelia wraps her lips around his member, <i>“what am I to do with you? Are you a dog of the kingdom?”</i> With another gesture, your restraints are lifted, allowing you to get up again.", parse);
	Text.NL();
	Text.Add("Irritated, you deny that you work for the kingdom, you are not even from this world!", parse);
	Text.NL();
	Text.Add("<i>“What nonsense is this?”</i> he growls. Pulling off his cock for a moment, Ophelia gasps that it may not be nonsense, that there used to be portals leading to other worlds on Eden.", parse);
	Text.NL();
	Text.Add("<i>“Did I tell you to stop?”</i> Chastised, the lagomorph alchemist dutifully continues her blowjob, bobbing her head up and down on his engorged beast. <i>“Reading old books and thinking it somehow relates to the real world, womenfolk are too naive... still, there may be something to this. Even in my youth, I heard rumors of this, and you are... different, somehow.”</i> As he speaks, one paw rests lightly on Ophelia’s head, guiding her mouth.", parse);
	Text.NL();
	Text.Add("<i>“This puts you in a somewhat interesting position,”</i> Lagon continues. <i>“If you are who you claim, you should have little to no loyalty to the kingdom. If you are interested in taking on a job for me...”</i>", parse);
	Text.Flush();
	
	Scenes.Burrows.ArrivalLagonTalkAssault = false;

	Scenes.Burrows.ArrivalLagonTalk();
}

Scenes.Burrows.ArrivalLagonTalk = function() {
	var parse = {
		
	};
	if(party.Two())
		parse["comp"] = " and " + party.Get(1).name;
	else if(!party.Alone())
		parse["comp"] = " and your companions";
	else
		parse["comp"] = "";
	
	//[Assault][Job]
	var options = new Array();
	if(!Scenes.Burrows.ArrivalLagonTalkAssault) {
		options.push({ nameStr : "Assault",
			func : function() {
				Text.Clear();
				Text.Add("<i>“I thought you a more pragmatic person,”</i> the large lagomorph growls. <i>“If you think I’ve been rough with you so far, perhaps you’d like to take this slut’s place for the rest of our discussion?”</i> He shifts his hips slightly forward pointedly. With her head firmly held in place by the larger rabbit, Ophelia has no choice but to deepthroat her father. She doesn’t seem to be particularly enjoying it.", parse);
				Text.NL();
				Text.Add("Catching his drift, you back down.", parse);
				Text.Flush();
				
				Scenes.Burrows.ArrivalLagonTalkAssault = true;
				
				lagon.relation.DecreaseStat(-100, 5);
				
				Scenes.Burrows.ArrivalLagonTalk();
			}, enabled : true,
			tooltip : "Complain about your rough handling."
		});
	}
	options.push({ nameStr : "Job",
		func : function() {
			Text.Clear();
			Text.Add("Guardedly, you ask what the job would entail. So far, you have nothing to lose, and this may be the only way for you to get out of here alive.", parse);
			Text.NL();
			Text.Add("<i>“I need to acquire some particular items from the outside world, and I can’t send my people to do it,”</i> Lagon explains. <i>“You’d be rewarded, of course.”</i>", parse);
			Text.NL();
			Text.Add("With what?", parse);
			Text.NL();
			Text.Add("<i>“Ophelia could perhaps offer you some alchemical recipes or potions,”</i> the king muses, <i>“I’d give you a choice pick among my sons and daughters to do with as you wish, as well.”</i> He waves a hand at his harem.", parse);
			Text.NL();
			Text.Add("<i>“Ask Ophelia about the objects you need to retrieve,”</i> Lagon grunts, assuming your acceptance. As she seems to be otherwise occupied at the moment, you ask to be excused. The king nods impatiently, for the moment less interested in you than in pouring his seed down his daughter’s throat.", parse);
			Text.NL();
			Text.Add("<i>“Oh, and don’t go spreading information about this place,”</i> the patriarch adds, <i>“especially not to the kingdom.”</i>", parse);
			Text.NL();
			Text.Add("You[comp] are ushered into an antechamber, and spend a few tense minutes under the vigilant watch of Lagon’s guards, waiting for him to finish with his daughter. Soon enough, Ophelia joins you again, wiping sticky fluids from her lips.", parse);
			Text.NL();
			Text.Add("<i>“Let us talk as I show you the way out,”</i> she tells you, hopping along. She isn’t moving quite as confidently as she was just minutes ago. <i>“Really, I am sorry about all of this. I should have led you outside the moment I came across you.”</i> You[comp] follow the bunny as she rapidly weaves through the dank tunnels, making a beeline for the exit.", parse);
			Text.NL();
			Text.Add("<i>“Should you wish to take my father up on his offer, the items he needs are for my alchemical research,”</i> Ophelia explains. <i>“I need specimens from the desert, the forest and the lake. Bring three of each, so I have some to experiment with.”</i>", parse);
			Text.NL();
			Text.Add("<i>“I’ll need <b>three Cactoids</b> from the desert. They kinda look like baby turtles, only they have needles on their backs. Be careful handling them.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Second, I’ll need some samples from the forest creatures known as the Gol. <b>Three Gol husks</b> should do. Just don’t try to take them from a live Gol... they aren’t the friendliest of critters, I gather.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Finally, I need <b>three samples of a special red algae</b> from the lake, close to the city. This last one should be relatively easy.”</i>", parse);
			Text.NL();
			if(world.time.hour >= 6 && world.time.hour < 19)
				Text.Add("As you listen to her instructions, you finally notice that the illumination of the tunnel has been growing gradually brighter. Finally, she stops just short of the exit, the light from the surface stinging your eyes.", parse);
			else {
				parse["time"] = (Scenes.Burrows.ArrivalTime >= 6 && world.time.hour < 19) ? "completely failed to notice" : "almost forgotten";
				Text.Add("You walk along, listening to her instructions, and are somewhat surprised when she stops in front of a dark opening. Looking carefully, you realize that this must be the exit. It’s night outside - you had [time], with the faint but constant illumination in the Burrows.", parse);
			}
			Text.NL();
			Text.Add("<i>“Bring me three of each kind, and do be careful.”</i> Ophelia concludes. She shuffles from foot to foot in front of the exit. <i>“I’m not allowed to go outside,”</i> she explains sheepishly. Nodding farewell to the bunny alchemist, you step out into the open air.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Burrows.Enterance, {hour: 1});
			});
		}, enabled : true,
		tooltip : "Ask him about the job he mentioned."
	});
	Gui.SetButtonsFromList(options);
}

Burrows.prototype.GenerateLagomorph = function(gender) {
	if(gender == null) {
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			gender = Gender.male;
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			gender = Gender.female;
		}, 1.0, function() { return true; });
		scenes.Get();
	}
	
	return new Lagomorph(gender);
}


Burrows.prototype.GenerateLagomorphAlpha = function(gender) {
	if(gender == null) {
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			gender = Gender.male;
		}, 3.0, function() { return true; });
		scenes.AddEnc(function() {
			gender = Gender.female;
		}, 2.0, function() { return true; });
		scenes.Get();
	}
	
	return new LagomorphAlpha(gender);
}

