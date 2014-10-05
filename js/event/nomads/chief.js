/*
 * 
 * Define Nomad chief
 * 
 */
function Chief(storage) {
	Entity.call(this);
	
	this.name         = "Chief";
	this.body.DefMale();
	
	this.flags["Met"] = 0;

	if(storage) this.FromStorage(storage);
}
Chief.prototype = new Entity();
Chief.prototype.constructor = Chief;


Chief.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Chief.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}


Scenes.Chief = {};

Scenes.Chief.Interact = function() {
	parse = {
		elfname   : kiakai.name,
		elfhimher : kiakai.himher(),
		playerName: player.name
	};
	
	Text.Clear();
	
	if(chief.flags["Met"] == 0) {
		chief.flags["Met"] = 1;
		Text.AddOutput("You approach the old man. He turns his weathered face and fixes a pair of sharp eyes on you. Fingers strokes his iron gray beard thoughtfully as he scrutinizes you, puffing on the long pipe and spreading a foul-smelling, acrid smoke around him. You wrinkle your nose in distaste, trying to keep your distance without seeming rude.", parse);
		Text.Newline();
		Text.AddOutput("<i>“So you're the one the elf talked about,”</i> the old man rasps curtly. <i>“Not exactly what I expected.”</i>", parse);
		Text.Newline();
		
		
		//[Polite][Rude]
		var options = new Array();
		options.push({ nameStr : "Polite",
			func : function() {
				chief.relation.IncreaseStat(100, 10);
				Text.AddOutput("You politely ask what he means, not sure what [elfname] has promised, or who the old man is, for that matter. The second question is answered almost immediately, as the grizzled man speaks. <i>“I'm the chief, herding these here folks in about the same direction, looking out for their interests so to speak.”</i> The old man takes a deep draft from his pipe before continuing.", parse);
				Text.Newline();
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Remain polite."
		});
		options.push({ nameStr : "Rude",
			func : function() {
				Text.AddOutput("Not intending to take any sass from the old fart, your snide reply is cut short as the old man pokes the air from your lungs with a sharp stab of his pipe to the sternum. Instinctively sucking in air, your indignant protests turn to uncontrollable coughing as you breathe in a mouthful of blue-black smoke.", parse);
				Text.Newline();
				Text.AddOutput("<i>“No reason to take that tone, young one,”</i> the old man grins at you. <i>“I'm the chief around these parts, and whatever magical maguffin you carry around, that isn't going to change. Show some respect for your elders.”</i>", parse);
				Text.Newline();
				Text.AddOutput("Magical what?", parse);
				Text.Newline();
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Take the old man down a notch."
		});
		Gui.SetButtonsFromList(options);
		
		Gui.Callstack.push(function() {
			Text.AddOutput("<i>“The elf spoke of a gem you carry, one that has the power to connect to other realms,”</i> the old man replies to your query. <i>“Such a thing could be of much use to us if it works as advertised, that is.”</i>", parse);
			Text.Newline();
			Text.AddOutput("The chief waves at the other nomads, <i>“Many of us are not originally from this world. We, or our ancestors, came through portals to Eden many years ago.”</i> His expression darkens slightly, <i>“Lately, the locals haven't been kind to our sort, however. I feel it would be best to make ourselves scarce before things get ugly, if you know what I mean.”</i>", parse);
			Text.Newline();
			Text.AddOutput("Why can't the nomads just return the way they came here in the first place?", parse);
			Text.Newline();
			Text.AddOutput("<i>“Something has changed,”</i> the chief thoughtfully puffs on his pipe. <i>“Used to be portals were commonplace. Nowadays, you don't see none around, anymore. Dunno why.”</i>", parse);
			Text.Newline();
			
			if(!party.InParty(kiakai)) {
				Text.AddOutput("Explaining that the elf is no longer with you, the chief dismisses your worries. <i>“I have no interest in the elf. Our agreement is with you, not with [elfhimher].”</i>", parse);
				Text.Newline();
			}
			
			Text.AddOutput("The chief scratches his tangled beard. <i>“The agreement is simple. If you ever get that thing to work, you will allow us passage to a suitable world, preferably before you meet your inevitable end on this blasted rock. In return, we provide you with safe haven here.”</i> You are not sure you are going to be able to meet his expectations, and say as much.", parse);
			Text.Newline();
			Text.AddOutput("<i>“Either way, you're welcome to use that tent over there for as long as you wish,”</i> the old man grunts, concluding your discussion.", parse);

			Gui.NextPrompt();
		});
	}
	else
	{
		Text.AddOutput("<i>“Ah, our wayward adventurer,”</i> the chief grunts as you approach. <i>“Gotten that rock to work proper, yet?”</i>", parse);
		Text.Newline();
		
		
		if(DEBUG) {
			Text.Newline();
			Text.AddOutput(Text.BoldColor("DEBUG: rep: " + chief.relation.Get()));
			Text.Newline();
		}
		
		//[Portal][Nomads]
		var options = new Array();
		options.push({ nameStr : "Portal",
			func : function() {
				Text.Clear();
				chief.relation.IncreaseStat(30, 5);
				Text.AddOutput("Wishing to know more about portals in general, you query the old man about their properties.");
				Text.Newline();
				
				var scenes = [];
				// KEYSTONE
				scenes.push(function() {
					Text.AddOutput("<i>“If you want to know more about portals, you should check out the strange monument over at the crossroads,”</i> the chief tells you. <i>“Back when the portals used to open fairly often, they usually did so around there.”</i>", parse);
					Text.Newline();
					Text.AddOutput("Huffing at his pipe, the old man adds thoughtfully, <i>“I have seen many things in my day, but never something like the inscriptions on that rock. Sometimes they glow red, like embers from a raging fire. I'm sure they're some kind of magic, but as to what, I have no clue.”</i>", parse);
					
					Gui.NextPrompt(Scenes.Chief.Interact);
				});
				// OLD TIMES
				scenes.push(function() {
					Text.AddOutput("<i>“Used to be portals appeared often, here in Eden,”</i> the old chief reminisces, <i>“Those were the days... always strange folks showing up, exotic creatures, beauties like you wouldn't believe!”</i>", parse);
					Text.Newline();
					Text.AddOutput("<i>“Of course, some of them led to bad places, dangerous places. Once a portal opened up, a delegation from the capital would show up and cordon the place off, but if you were lucky enough to find it first...”</i> the old man drifts off, as if recalling an ancient memory, perhaps of his youth.", parse);
					Text.Newline();
					Text.AddOutput("After some time has passed, he continues, <i>“But the portals came fewer and fewer between, until they stopped entirely. Far as I know, you are the first off-worlder to show up in decades.”</i> When you question him why this changed, the old man only shrugs.", parse);
					
					Gui.NextPrompt(Scenes.Chief.Interact);
				});
				// ORIGINS
				if(chief.relation.Get() >= 50) {
					scenes.push(function() {
						Text.AddOutput("<i>“[playerName], I might have told you before, but I am not originally from this world,”</i> the chief confesses. <i>“I must have been, what, eight? So many decades ago now... A portal opened up near my home village, and being the nosy little brat that I was, of course I stepped through it.”</i>", parse);
						Text.Newline();
						Text.AddOutput("<i>“Problem is,”</i> he continues, old pains apparent in his voice, <i>“As soon as I stepped through, I was nabbed up by troops from the kingdom. When they had finished questioning me and threw me out on the street several days later, the portal had already closed, and I've never seen my home since then.”</i> The chief hunches up, the weight of many years on his tired shoulders.", parse);
						Text.Newline();
						Text.AddOutput("<i>“Surviving those first years were tough, but I somehow managed. Every time word of a portal opening came around, I was the first there,”</i> he stares of into the distance solemnly. <i>“Of course, it never led me back home, but I have some of my best memories from those hidden away realms, long since sealed off. For some reason, I always returned, perhaps hoping against hope to see home once more.”</i>", parse);
						Text.Newline();
						Text.AddOutput("You ask him what his home was like. <i>“Green meadows, low hills, the small village sitting on the side of a creek... I'm sorry, it was so long ago, I doubt I would even recognize the place now.”</i>", parse);
						
						Gui.NextPrompt(Scenes.Chief.Interact);
					});
				}
				
				var scene = scenes[Rand(scenes.length)];
				
				scene();
			}, enabled : true,
			tooltip : "Ask the chief about the properties of portals."
		});
		options.push({ nameStr : "Nomads",
			func : function() {
				Text.Clear();
				chief.relation.IncreaseStat(30, 5);
				Text.AddOutput("Wishing to know more about the other inhabitants of the camp, you ask the old man about them.");
				Text.Newline();
				
				var scenes = [];
				// ROSALIN
				scenes.push(function() {
					var parse = {
						heshe   : rosalin.heshe(),
						hisher  : rosalin.hisher(),
						himher  : rosalin.himher(),
						girlboy : (rosalin.body.Gender() == Gender.male) ? "boy" : "girl"
					};
					
					if(rosalin.flags["Met"] == 0) {
						Text.AddOutput("<i>“If you haven't spoken to our resident alchemist yet, perhaps you should,”</i> the chief suggests. <i>“She's a bit of a ditz, but maybe she can help you with that gem of yours.”</i> The old man indicates a girl with cat ears, currently busy at a nearby tent. Standing at a wooden table cluttered with strange devices, she seems to be mixing various fluids together in elaborate glass bottles, a look of concentration on her face.", parse);
					}
					else {
						Text.AddOutput("<i>“Rosalin came here quite recently,”</i> the chief comments on the alchemist, currently bustling about with [hisher] experiments. <i>“Apparently [heshe] was apprenticed to some fancy-pansy alchemist in the capital, but got thrown out on [hisher] tail. You'll have to ask [himher] about the details yourself.”</i>", parse);
					}
					Text.Newline();
					
					var rChanged = rosalin.origRaceScore.Compare(new RaceScore(rosalin.body));
					if(rChanged < 0.9)
						Text.AddOutput("<i>“Youngsters these days,”</i> the old man mutters, <i>“That silly [girlboy] needs to watch what [heshe] eats better.”</i>", parse);
					
					Gui.NextPrompt(Scenes.Chief.Interact);
				});
				// ESTEVAN
				scenes.push(function() {
					Text.AddOutput("<i>“Have you met our huntsman, Estevan?”</i>", parse);
					Text.Newline();
					if(world.time.hour >= 14 || world.time.hour < 2) {
						Text.AddOutput("The old man points at a strange man tending to some equipment, sat near the fire pit. Estevan seems to be a satyr; curved goat horns peeking out from his curly black hair. His furred, digitigrade legs end in goat hooves, well suited for traversing rough terrain. The satyr has olive skin and some light facial hair.", parse);
						Text.Newline();
						Text.AddOutput("<i>“Estevan usually takes his hunt to the forest,”</i> the chief explains, <i>“And you might run across him there. Just be careful to not get stuck in one of his traps. He is a pleasant enough fellow, but be wary of him when he's had too much drink.”</i>", parse);
					}
					else {
						Text.AddOutput("The chief looks around, <i>“Hm, I was sure I saw him just now...”</i> he mutters, <i>“Either he is sleeping or out on a hunt. Check back later I guess.”</i>", parse);
					}
					Gui.NextPrompt(Scenes.Chief.Interact);
				});
				// PATCHWORK
				scenes.push(function() {
					Text.AddOutput("<i>“If you need anything, why don't you check out Patchwork's shop?”</i> the old man suggests, indicating an odd pile of clothes in front of the only wagon in the camp. It is barely possible to distinguish that a person is hidden somewhere inside the multicolored robes, which seems to be made from sewn-together pieces of colored cloth. <i>“Patches scavenges stuff from all around. If you aren't too particular about the origins of an item, or its price, you might find something of interest.”</i>", parse);
					Text.Newline();
					
					// TODO: Conditional, later when patches is implemented 
					
					Text.AddOutput("Trying to not sound impolite, you ask the chief what Patchwork is exactly. Is it a woman, a man? The old man considers the immobile pile of cloth, puffing on his pipe. <i>“Trying to keep together this bunch for a few decades has had me seeing a lot weirder things than Patchwork,”</i> he finally grunts. <i>“If it matters so much to you, why don't you ask them?”</i>", parse);
					Gui.NextPrompt(Scenes.Chief.Interact);
				});
				// CHIEF
				if(chief.relation.Get() >= 50) {
					scenes.push(function() {
						Text.AddOutput("You ask the old man how he came to be chief among the nomads.", parse);
						Text.Newline();
						Text.AddOutput("<i>“A long, surprisingly uninteresting story, I'm afraid,”</i> the old man tells you. <i>“I'll try to keep it short, so as not to bore you.”</i> Settling down comfortably beside him, you urge him to begin.", parse);
						Text.Newline();
						Text.AddOutput("<i>“I was a vagrant in my youth, a street rat hanging around the poorer parts of the capital. I hung out with the wrong sorts, or so the city watch felt about it, anyway”</i> he looks around the camp fondly. <i>“Those wrong sorts are now my family,”</i> he waves broadly at the nomad camp.", parse);
						Text.Newline();
						Text.AddOutput("<i>“As time went by, I managed to find more people like me, those who came from other worlds and had no place to stay. We formed a commune of sorts in the slums of the capital, but the city watch soon drove us out. Over the years, we traveled to every place on Eden, visiting the desert oasis, the strange city hidden among the branches of the Great Tree, the hidden glades of the dryads, and many others.”</i>", parse);
						Text.Newline();
						Text.AddOutput("<i>“As to why I became chief...? It just turned out that way, I guess,”</i> the old man shrugs. <i>“Many joined us for a time, before making their own homes and starting their own families somewhere on Eden. I never wanted to give up what I had started, and I could never give up my grudge against the kingdom. In my youth, my hate burned too brightly, and in my old age, my ways are too set.”</i>", parse);
						Text.Newline();
						Text.AddOutput("<i>“I often wonder if there was another path I could have walked,”</i> the chief sighs, <i>“But I'm now dedicated to my flock, and I plan to spend the rest of my time tending to them.”</i>", parse);
						
						Gui.NextPrompt(Scenes.Chief.Interact);
					});
				}
				
				var scene = scenes[Rand(scenes.length)];
				
				scene();
			}, enabled : true,
			tooltip : "Ask about the other nomads."
		});
		options.push({ nameStr : "Jobs",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Learning a new trade takes dedication and experience,”</i> the old man explains. <i>“If you focus and apply yourself, you can eventually master new skills, given that you have the proper knowledge.”</i>", parse);
				Text.NL();
				Text.Add("<i>“You may change what your current job - or that of your companions - is at any time. Try talking to the person in question to see what jobs he or she can learn. Unlocking new jobs may require experience, a good foundation to build on. For example, if you aspire to one day become a knight, you need first train as a squire for some time. In addition to that, you must have proper guidance - either with the help of a master or a skill manual.”</i>", parse);
				Text.NL();
				Text.Add("<i>“As you gain experience in your current job, your mastery may increase, allowing you to use your skills even if you pursue some other trade. Additionally, applying yourself diligently will strengthen your body and mind. Book learning only takes you so far, you will need combat experience to truly improve.”</i>", parse);
				Text.NL();
				Text.Add("The old man puffs on his pipe thoughtfully. <i>“Beware becoming a jack of all trades, a master of none. There are only so many years you have available to you, youngster.”</i>", parse);
				Text.NL();
				Text.Add("With that, you leave the chief to his musings.", parse);
				Text.Flush();
				Gui.NextPrompt(Scenes.Chief.Interact);
			}, enabled : true,
			tooltip : "Ask the chief about various professions and how you can learn them (tutorial on job system)."
		});
		
		Gui.SetButtonsFromList(options, true);
	}
}

world.loc.Plains.Nomads.Fireplace.events.push(new Link(
	"Chief", function() { return (world.time.hour >= 8 && world.time.hour < 22); }, true,
	function() {
		if(!(world.time.hour >= 8 && world.time.hour < 22)) return;
		
		if(chief.flags["Met"] == 0)
			Text.Add("On a log by the fire pit sits an old man smoking a pipe. His sharp eyes quickly find you and he gives you an uninterested look before returning to the pipe.");
		else if(chief.relation.Get() >= 50)
			Text.Add("On a log by the fire pit the nomad chief sits, smoking his pipe. His attention quickly turns to you and you are given a wide grin, the chief acknowledging your presence before returning to the pipe.");
		else
			Text.Add("On a log by the fire pit the nomad chief sits, smoking his pipe. His sharp eyes quickly find you and he gives you a short nod before returning to the pipe.");
			
		Text.NL();
	},
	Scenes.Chief.Interact
));
