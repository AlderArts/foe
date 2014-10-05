/*
 * 
 * Define Estevan
 * 
 */
function Estevan(storage) {
	Entity.call(this);
	
	
	this.name         = "Estevan";
	
	this.body.DefMale();
	this.body.legs.race = Race.satyr;
	this.SetSkinColor(Color.olive);
	this.SetHairColor(Color.black);
	TF.SetAppendage(this.Back(), AppendageType.horn, Race.satyr, Color.black, 2);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"]    = 0;
	this.flags["Ranger"] = Estevan.Ranger.NotTalked;
	this.flags["Cheat"]  = Estevan.Cheat.NotTalked;
	this.flags["cav"]    = 0; //cavalcade explanation
	
	if(storage) this.FromStorage(storage);
}
Estevan.prototype = new Entity();
Estevan.prototype.constructor = Estevan;

Estevan.Ranger = {
	NotTalked : 0,
	Taught    : 1
}
Estevan.Cheat = {
	NotTalked : 0,
	Talked    : 1,
	Setup     : 2,
	Triggered : 3
}

Estevan.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Estevan.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

Scenes.Estevan = {};

// Schedule
Estevan.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Plains.Nomads.Fireplace)
		return (world.time.hour >= 15 || world.time.hour < 3);
	return false;
}

Scenes.Estevan.Interact = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	
	if(estevan.flags["Met"] == 0) {
		estevan.flags["Met"] = 1;
		Text.Add("The satyr greets you jovially as you approach him, gesturing for you to take a seat beside him. Up close and personal, you get a better look at him.", parse);
		Text.NL();
		Text.Add("Half man, half goat, the satyr’s lower body is covered entirely in thick, dark brown fur, his legs ending in hooves. The man is quite tall, and well built to boot, the olive skin on his arms taut with sinewy muscle. Short horns poke out of his black, curly hair, further evidence of his non-humanity. On his chin, he - amusingly enough - has a small goatee. All in all, he has a roguish handsomeness to him, further enhanced by his open, friendly manner.", parse);
		Text.NL();
		parse["fem"] = player.mfFem("", " appreciatively");
		Text.Add("<i>“Name’s Estevan, stranger,”</i> he introduces himself, eyeing you up and down[fem]. <i>“Haven’t seen you around here before. You the new arrival?”</i>", parse);
		Text.NL();
		Text.Add("You confirm his suspicion, pointing out your tent. <i>“Thought so. Even for the oddballs that hang around here, you kinda stand out. Don’t take that in a bad way,”</i> he adds, flashing you a quick grin. <i>“As you might have guessed, I’m a hunter. I go into the forest and bring back game, feeding the camp. I’m decent with a bow, though I usually hunt with traps.”</i> He gestures to the odd contraption he’s working on.", parse);
		Text.NL();
		Text.Add("<i>“When I’m not out working, I usually hang around camp. Socialize, have a drink or five, play some cards and so on. Have you talked to Rosie and Wolfie yet? We could use a fourth player in our game.”</i>", parse);
		Text.NL();
		if(cale.flags["Met2"] > Cale.Met2.NotMet) {
			Text.Add("Sure, you’ve met them, assuming that he means Cale?", parse);
			Text.NL();
			Text.Add("<i>“Yeah, that’s right,”</i> he nods.", parse);
		}
		else if(cale.flags["Met"] > Cale.Met.NotMet) {
			Text.Add("Yeah, you’ve met them, though you didn’t talk with the wolf much. You were both kind of occupied at the time.", parse);
			Text.NL();
			Text.Add("<i>“I bet, though I doubt you’d have gotten much of an intelligent conversation out of the guy anyways.”</i>", parse);
		}
		else {
			Text.Add("No, you haven’t talked to anyone like that yet.", parse);
			Text.NL();
			Text.Add("<i>“Really? You should look around for them then. Rosalin’s usually poking around with her potions, trying to make Aria knows what.”</i>", parse);
		}
		Text.NL();
		Text.Add("<i>“Wolfie’s got a bit of an ego problem, but he’s easy to read, and easier to annoy. Riling him up is a pet project of mine.”</i> The satyr grins mischievously. <i>“Either way, pleased to make your acquaintance.”</i>", parse);
		Text.NL();
		Text.Add("With that, Estevan returns to his contraption.", parse);
		Text.Flush();
		
		Scenes.Estevan.Prompt();
		return;
	}
	
	Text.Add("<i>“Hey there, [playername]!”</i> Estevan greets you as you approach. <i>“What can I do for you?”</i>", parse);
	if(cale.flags["Met2"] == Cale.Met2.NotMet) {
		Text.NL();
		Text.Add("<i>“Did you speak with Rosie and wolfie yet? I wouldn’t mind another hand at cards, spice things up a bit.”</i>", parse);
	}
	
	if(DEBUG) {
		Text.NL();
		Text.Add(Text.BoldColor("DEBUG: relation: " + estevan.relation.Get()));
		Text.NL();
		Text.Add(Text.BoldColor("DEBUG: subDom: " + estevan.subDom.Get()));
		Text.NL();
		Text.Add(Text.BoldColor("DEBUG: slut: " + estevan.slut.Get()));
		Text.NL();
	}
	Text.Flush();
	
	Scenes.Estevan.Prompt();
}

Scenes.Estevan.Prompt = function() {
	var parse = {
		playername : player.name
	};
	
	//[Options]
	var options = new Array();
	/*
	options.push({ nameStr : "name",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
		}, enabled : true,
		tooltip : ""
	});
	*/
	options.push({ nameStr : "Ranger",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Sure, as long as you don’t spread my secrets to wolfie, I can teach you a few tricks,”</i> the satyr agrees.", parse);
			if(estevan.flags["Ranger"] == Estevan.Ranger.NotTalked) {
				Text.Add(" <i>“He figures himself to be something of an aspiring hunter. I’ll tell you, it’s rather fun to watch a city kid blundering about in the forest without a clue of what he’s doing.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Anyways, like I told you before, I have a good hand with a bow, but my favored method of hunting is using traps. With the correct preparation and enough knowledge of his prey, even a single hunter can take down a beast many times his size.”</i>", parse);
				Text.NL();
				Text.Add("<i>“The hunter must stalk his target and set up traps for it; either to capture it outright or slow it down. If you are caught off guard, whittle down your prey until they collapse of exhaustion.”</i>", parse);
				Text.NL();
				Text.Add("While you aren’t going to saddle up as a full time hunter, you can see how some of these things could be really useful, given that you have enough time to prepare yourself.", parse);
				Text.NL();
				if(Jobs["Ranger"].Unlocked())
					Text.Add("This seems familiar to you, though the satyr shows you a few things you hadn’t thought of yourself yet.", parse);
				else
					Text.Add("<b>Unlocked the Ranger job.</b>", parse);
			}
			else {
				Text.NL();
				Text.Add("The two of you spend some time going over some more advanced hunting techniques; the habitats and behaviors of certain prey, and you get a few good tips about how to set up traps.", parse);
			}
			Text.NL();
			Text.Add("<i>“Was there something else you were wondering about?”</i> Estevan asks, putting away his tools.", parse);
			Text.Flush();
			
			if(estevan.flags["Ranger"] == Estevan.Ranger.NotTalked)
				estevan.flags["Ranger"] = Estevan.Ranger.Taught;
			
			world.TimeStep({hour: 1});
			
			Scenes.Estevan.Prompt();
		}, enabled : true,
		tooltip : "Ask him about his job, and how you’d go about hunting."
	});
	if(estevan.flags["cav"] != 0) {
		options.push({ nameStr : "Cheat",
			func : function() {
				Text.Clear();
				
				var setupFunc = function() {
					//[Nope][Yeah!]
					var options = new Array();
					options.push({ nameStr : "Nope",
						func : function() {
							Text.Clear();
							Text.Add("<i>“Aww, but it's such a nice idea!”</i>", parse);
							Text.Flush();
							
							estevan.flags["Cheat"] = Estevan.Cheat.Talked;
							
							world.TimeStep({minute: 15});
							Scenes.Estevan.Prompt();
						}, enabled : true,
						tooltip : "On second thought… no."
					});
					options.push({ nameStr : "Yeah!",
						func : function() {
							Text.Clear();
							Text.Add("<i>“Knew I could count on you, partner!”</i> Estevan grins excitedly. <i>“Bring up the subject next time we run a game, and I’ll handle the rest. Poor wolf won’t know what hit him, and he’ll likely be butthurt about it for days after. Heh.”</i>", parse);
							Text.Flush();
							
							estevan.flags["Cheat"] = Estevan.Cheat.Setup;
							
							world.TimeStep({minute: 15});
							Scenes.Estevan.Prompt();
						}, enabled : true,
						tooltip : "Heck yeah, this is going to be fun!"
					});
					Gui.SetButtonsFromList(options, false, null);
				};
				
				if(estevan.flags["Cheat"] == Estevan.Cheat.NotTalked) {
					Text.Add("You have an idea, of sorts. Estevan wouldn’t mind helping you take Cale down a peg or two, right?", parse);
					Text.NL();
					Text.Add("<i>“What’d you have in mind?”</i> the satyr asks, looking intrigued.", parse);
					Text.NL();
					Text.Add("Well, Cavalcade is a simple enough game, right? It should be pretty easy to coax some money out of the wolf if the dealer was inclined to tip the scales a bit, hand out the right cards.", parse);
					Text.NL();
					Text.Add("<i>“Interesting idea, though it seems a bit of a waste, to do it for small change, seeing as you probably won’t get more than one shot at it.”</i> Estevan ponders for a bit, a wide grin slowly spreading on his face.", parse);
					Text.NL();
					Text.Add("<i>“You know… there is a variation of Cavalcade, sometimes played for laughs among close friends. In its more innocent form, you play with fake tokens representing money, and the winner gets to ask some sort of favor from one of the losers. It’s usually used when first learning the game.”</i>", parse);
					Text.NL();
					Text.Add("<i>“The fun part is what kind of stakes you are playing for. I’m sure we could figure something out that would slap that macho attitude right out of him.”</i>", parse);
					Text.NL();
					Text.Add("Such as…?", parse);
					Text.NL();
					Text.Add("<i>“Cale is always bragging how he’s a ladies man. I’d be really amusing to see him on the receiving end for once, might crack his manly facade a bit. If nothing else, it’ll give me something to tease him with. You’d have to be the one to administer the punishment though, but I’m sure you wouldn’t have anything against that, right? I’m sure a rough buttfucking will get him off my case for a while.”</i>", parse);
					Text.Flush();
					
					setupFunc();
				}
				else if(estevan.flags["Cheat"] == Estevan.Cheat.Talked) {
					Text.Add("<i>“So, what do you think about setting that prank in motion, [playername]? I deal the cards, you deal with the wolf afterward.”</i>", parse);
					Text.Flush();
					
					setupFunc();
				}
				else if(estevan.flags["Cheat"] == Estevan.Cheat.Setup) {
					Text.Add("<i>“So, how do you feel about our little prank, [playername]? Ready for the game?”</i>", parse);
					Text.Flush();
					
					setupFunc();
				}
				else { // Triggered
					Text.Add("<i>“As fun as it was the first time, I don’t think wolfie’s gonna fall for that one again. I dunno, perhaps if you just happened to find some matching cards and swap them yourself during the game, who’d be the wiser?”</i> He grins mischievously.", parse);
					Text.Flush();
					
					world.TimeStep({minute: 15});
					Scenes.Estevan.Prompt();
				}
			}, enabled : true,
			tooltip : "Ask him if he’d like to help you play a prank on Cale, wrecking him in a rigged game of Cavalcade."
		});
	}
	Gui.SetButtonsFromList(options, true, PrintDefaultOptions);
}

world.loc.Plains.Nomads.Fireplace.events.push(new Link(
	function() { return (estevan.flags["Met"] == 0) ? "Satyr" : "Estevan"; }, function() { return estevan.IsAtLocation(); }, true,
	function() {
		if(!estevan.IsAtLocation()) return;
		
		if(estevan.flags["Met"] == 0)
			Text.Add("You see a strange creature by the fire, a man half human, half goat. He seems to be working on a contraption of some sort, probably a hunting trap. ");
		else
			Text.Add("Estevan the satyr hunter is lounging by the campfire, working on something while taking occasional sips of wine. ");
		Text.NL();
	},
	Scenes.Estevan.Interact
));
