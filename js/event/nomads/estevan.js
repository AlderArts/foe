/*
 * 
 * Define Estevan
 * 
 */
function Estevan(storage) {
	Entity.call(this);
	this.ID = "estevan";
	
	
	this.name         = "Estevan";
	
	this.body.DefMale();
	this.body.legs.race = Race.Satyr;
	this.SetSkinColor(Color.olive);
	this.SetHairColor(Color.black);
	TF.SetAppendage(this.Back(), AppendageType.horn, Race.Satyr, Color.black, 2);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"]    = 0;
	this.flags["Ranger"] = Estevan.Ranger.NotTalked;
	this.flags["Cheat"]  = Estevan.Cheat.NotTalked;
	this.flags["cav"]    = 0; //cavalcade explanation
	this.flags["Gay"]    = Estevan.GaySex.No;
	
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
Estevan.GaySex = {
	No        : 0,
	First     : 1,
	Blowjob   : 2,
	FuckedBy  : 4,
	FuckedHim : 8
}

Estevan.prototype.Met = function() {
	return this.flags["Met"] != 0;
}

Estevan.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	this.body.FromStorage(storage.body);
	// Load flags
	this.LoadFlags(storage);
}

Estevan.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	this.SaveBodyPartial(storage, {ass: true});
	this.SaveFlags(storage);
	
	return storage;
}

Scenes.Estevan = {};

Scenes.Estevan.Impregnate = function(mother, slot) {
	mother.PregHandler().Impregnate({
		slot   : slot || PregnancyHandler.Slot.Vag,
		mother : mother,
		father : estevan,
		race   : Race.Satyr,
		num    : 1,
		time   : 26 * 24,
		load   : 3
	});
}

// Schedule
Estevan.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Plains.Nomads.Fireplace)
		return (world.time.hour >= 15 || world.time.hour < 3);
	return false;
}

Estevan.prototype.HadGaySex = function() {
	return this.flags["Gay"] >= Estevan.GaySex.First;
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
		Text.Add("<i>“Did you speak with Rosie and Wolfie yet? I wouldn’t mind another hand at cards, spice things up a bit.”</i>", parse);
	}
	
	if(DEBUG) {
		Text.NL();
		Text.Add("DEBUG: relation: " + estevan.relation.Get(), null, 'bold');
		Text.NL();
		Text.Add("DEBUG: subDom: " + estevan.subDom.Get(), null, 'bold');
		Text.NL();
		Text.Add("DEBUG: slut: " + estevan.slut.Get(), null, 'bold');
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
			Text.Add("<i>“Sure, as long as you don’t spread my secrets to Wolfie, I can teach you a few tricks,”</i> the satyr agrees.", parse);
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
					Text.Add("<i>“Cale is always bragging how he’s a ladies’ man. It’d be really amusing to see him on the receiving end for once, might crack his manly facade a bit. If nothing else, it’ll give me something to tease him with. You’d have to be the one to administer the punishment though, but I’m sure you wouldn’t have anything against that, right? I’m sure a rough buttfucking will get him off my case for a while.”</i>", parse);
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
					Text.Add("<i>“As fun as it was the first time, I don’t think Wolfie’s gonna fall for that one again. I dunno, perhaps if you just happened to find some matching cards and swap them yourself during the game, who’d be the wiser?”</i> He grins mischievously.", parse);
					Text.Flush();
					
					world.TimeStep({minute: 15});
					Scenes.Estevan.Prompt();
				}
			}, enabled : true,
			tooltip : "Ask him if he’d like to help you play a prank on Cale, wrecking him in a rigged game of Cavalcade."
		});
	}
	//Sex
	if(player.Gender() == Gender.male) {
		var tooltip = estevan.HadGaySex() ? "Split a few drinks with Estevan. Wine isn’t the only cork the satyr likes to pop when he’s drunk." : "The satyr seem to be a ladies man. Try to… convince him to make an exception.";
		options.push({ nameStr : "Sex",
			func : Scenes.Estevan.SexGay, enabled : true,
			tooltip : tooltip
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

Scenes.Estevan.SexGay = function() {
	var p1cock = player.BiggestCock();
	
	var parse = {
		playername    : player.name
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	var first = !estevan.HadGaySex();
	
	estevan.flags["Gay"] |= Estevan.GaySex.First;
	
	Text.Clear();
	if(first) {
		Text.Add("You offer to split a bottle of wine, or ten, with Estevan and the satyr eagerly accepts, though not before raising an eyebrow. <i>“You wouldn't happen to be trying to get me drunk, would you?”</i>", parse);
		Text.NL();
		Text.Add("You were under the impression that satyrs liked nothing better than getting drunk and you tell him as much. Estevan crosses his arms over his chest and seems quite insulted, but he can only keep up the front for a moment before a snicker sneaks through his angry demeanor and the satyr breaks into full on laughter.", parse);
		Text.NL();
		Text.Add("<i>“Pour the first glass,”</i> he says, then, <i>“wait. That will take too long. We'll drink from the bottle unless you object to sharing a little spit.”</i> Estevan's words get you thinking about the other fluids you might share with the affable satyr, but you keep that to yourself for now.", parse);
		Text.NL();
		Text.Add("It takes a few bottles split between the two of you before you start openly eyeing the goat-man’s physique. His athletic upper half fills out his shirt nicely, especially the flat ridges of his lean stomach and his tight biceps. Estevan’s lower half is all animal strength, able to pivot and dash at a moment’s notice. You compliment him on his lean, powerful form. Maybe it’s just drunken enthusiasm but Estevan seems to warm to your appreciative stare by the moment.", parse);
		Text.NL();
		Text.Add("<i>“Like what you see, eh? Don’t get me wrong; I’m no Cale.”</i> He makes a dumb, leering face. <i>“But if you like a little bit of brain with your brawn then you can’t beat this. Not to mention that I don’t reek of wet dog.”</i>", parse);
		Text.NL();
		Text.Add("A handful of bottles - you have thoroughly lost count of exactly how many - later, Estevan's eyes get bright and he starts grinning at you. He squints one eye, and says, ", parse);
		if(player.Femininity() > 0.3)
			Text.Add("<i>“in the right light you could kind of make a decent woman. You have a really nice body. It’s kind of...”</i> The drunk satyr grasps for words, eventually settling on: <i>“nice.”</i>", parse);
		else
			Text.Add("<i>“you’re not quite the sort that I usually go for. A little too, uh, male? But I have been drinking. A lot.”</i>", parse);
		Text.NL();
		Text.Add("Estevan giggles. It's surprisingly boyish and light.", parse);
		Text.NL();
		Text.Add("The satyr seems to be in a good mood when he spontaneously decides to show you a trick: he puts the bottle of wine on the ground and nudges it quickly with one of his hooves. This maneuver happens so fast that the bottle eases onto his hoof, then without warning he kicks it into the air and positions himself beneath it. The wine bottle comes down and he catches it with his teeth. He simulates applause and when you start clapping he does a little bow; he manages all this while the wine drains down his throat. He burps and throws the bottle away when the drink is all gone.", parse);
		Text.NL();
		Text.Add("You have him show you the trick a few more times and he puts new spins on it. He kicks one bottle behind him and he has you throw one into the air. He drains both.", parse);
		Text.NL();
		Text.Add("You mention that he seems pretty good at getting stuff down his throat.", parse);
		Text.NL();
		Text.Add("<i>“Do you want to see how good I am at fitting big things in tight spaces?”</i> Estevan asks, as he tosses away the latest empty.", parse);
		Text.NL();
		Text.Add("You tell him that you’re very much interested in a hands-on demonstration and his ears perk up at the suggestion of shared debauchery.", parse);
		Text.NL();
		Text.Add("<i>“Follow me out behind those tents, [playername], and I can show you some of my harder tricks.”</i>", parse);
		Text.NL();
		Text.Add("Estevan's tone is still playful, but there's an edge to it now as if he's the only one in on the joke. You follow Estevan. He leads you behind an empty tent at the furthest edge of the camp. He grins at you in a dazed manner as if the wine has finally caught up with him.", parse);
		Text.NL();
		Text.Add("<i>“Take off your [armor],”</i> the satyr whispers. He comes in close and one of his hands wanders down your lower back and over your [butt]. His wine-sweetened breath is hot and close. <i>“My greatest trick requires a hole. Would you like to volunteer yours? I bet it’d be the perfect fit.</i>", parse);
	}
	else {
		Text.Add("<i>“Back for a little more Estevan, huh? Can’t say I blame you. Who wouldn’t want a repeat performance once they see what I’ve got up my sleeves?</i>", parse);
		Text.NL();
		Text.Add("<i>“But first we should have a drink, right? To celebrate!”</i>", parse);
		Text.NL();
		Text.Add("You aren’t sure what you’re supposed to be celebrating, but you’re wise enough not to argue with a satyr about his liquor. You uncork the first bottle of wine and take turns passing it as Estevan tells you stories of his pranks and sexual conquests: both of which he seems to take equal pride in. One bottle turns into three or twelve more. Once the satyr is nice and sloshed, he suggests that you head over to the edge of camp where he has his ‘special vintage’ hidden. You mention that you wouldn’t mind sampling it.", parse);
		Text.NL();
		Text.Add("Once the two of you are alone, Estevan grins at you.", parse);
		Text.NL();
		Text.Add("<i>“So, [playername], how should we pass the time?”</i>", parse);
		Text.NL();
		Text.Add("You’re not shy about letting him know that you’re interested in doing more than just drinking.", parse);
		Text.NL();
		Text.Add("<i>“Oh?”</i> he asks, his cock already stirring in the dense fur surrounding it. <i>“Well, if you’re offering, I wouldn’t mind fucking your ass.”</i>", parse);
	}
	Text.Flush();
	
	world.TimeStep({minute: 30});
	
	//[Oblige Estevan][Taunt Estevan]
	var options = new Array();
	options.push({ nameStr : "Oblige Estevan",
		func : function() {
			Text.Clear();
			Text.Add("The satyr ‘helps’ you strip and then turns you around so that you're facing the camp. You turn your head and find him staring at your ass. He whistles. <i>“That's some [butt]. Not a pussy, but it’ll do: a hole’s a hole, after all.”</i> ", parse);
			Text.NL();
			Text.Add("Estevan squats down on his haunches behind you, bringing his face right up to your [anus]. ", parse);
			if(first) {
				Text.Add("His face is so close to your puckered hole and his breath is so hot against it that you ask if he intends to tongue-fuck you.", parse);
				Text.NL();
				Text.Add("<i>“If you had juicy snatch, maybe,”</i> he says, laughing. <i>“I bet you’d enjoy me, too. My tongue is legendarily dexterous.”</i>", parse);
			}
			else {
				Text.Add("His breath is warm between the mounds of your ass as he spreads it open, but you doubt that Estevan has any intention of eating you out.", parse);
			}
			Text.NL();
			Text.Add("The ranger presses a cool, oily finger against your back passage. He clearly came prepared. He grunts his approval as his finger pushes past the meager resistance of your sphincter. ", parse);
			if(player.Butt().virgin) {
				Text.Add("<i>“Tight as a virgin. But I couldn’t be the first to plow this field, could I?”</i> he asks.", parse);
				Text.NL();
				Text.Add("When you tell him that you’ve never taken a cock before you can hear the smile split his face. He replies, <i>“I’m a lucky boy!”</i>", parse);
			}
			else if(player.Butt().Tightness() >= Orifice.Tightness.loose)
				Text.Add("<i>“Nice and sloppy. I don’t mind being second or third or fiftieth.”</i>", parse);
			else
				Text.Add("<i>“Almost ready. Just a little bit…”</i> He continues pushing his finger inside you. <i>“...further.”</i>", parse);
			Text.NL();
			Text.Add("Estevan makes sure that your [anus] is thoroughly lubricated. He slaps your backside and sidles up behind you. You can feel his dense, soft fur as his legs brush against you. His huge cock stiffens up and rubs against your butt.", parse);
			Text.NL();
			Text.Add("<i>“You ready to take all of me?”</i>", parse);
			Text.Flush();
			
			//[Yes!][Uh…]
			var options = new Array();
			options.push({ nameStr : "Yes!",
				func : function() {
					Text.Clear();
					Text.Add("<i>“There’s a good boy,”</i> Estevan says.", parse);
					Text.NL();
					Text.Add("He presses his dick up against your [anus] and pushes the head into your lubed-up butt. The pressure is intense as the satyr works his thick cock into your asshole.", parse);
					Text.NL();
					if(player.Butt().Tightness() >= Orifice.Tightness.loose)
						Text.Add("<i>“Mmm...I don’t need to hold back with you, do I? I could fuck your loose hole all day and you’d probably just beg for more,”</i> he growls in your ear.", parse);
					else
						Text.Add("<i>“I have to take it easy on you, but you’re so tight that I just want to wreck your hole,”</i> he says, between grunts.", parse);
					Text.NL();
					Text.Add("Estevan has a little over half of his impressive length inside of you when you feel him shudder and he starts to unload in your ass. Estevan pushes forward with a hard thrust and plants himself firmly inside you as continues to spurt his hot juice inside you. The abrupt assault makes you cry out, but your own [cocks] twitch[notEs] pleasurably in response to his rough treatment.", parse);
					Text.NL();
					
					Sex.Anal(estevan, player);
					player.FuckAnal(player.Butt(), estevan.FirstCock(), 3);
					estevan.Fuck(estevan.FirstCock(), 3);
					
					Text.Add("<i>“Ah, that takes the edge off. Now I’m really ready to fuck you.”</i>", parse);
					Text.NL();
					Text.Add("After the massive load he just buried in your butt, you wonder if Estevan could possibly continue. Instead of getting softer inside you, however, he seems to be getting harder. He starts thrusting again and you prepare for a long, hard fuck.", parse);
					Text.NL();
					Text.Add("Estevan uses his previous load as lube and fucks your [anus] with abandon. He grabs your hips and pulls you back roughly onto his cock, which is growing fatter still. By the time the satyr’s cock has fully stiffened your ring has been brutally stretched to accommodate his thickness. Unintelligible noises pour out of you as he punishes your [butt] with hard, fast shoves of his oversized shaft.", parse);
					Text.NL();
					Text.Add("<i>“Your ass has got me fully hard, [playername]. I’d like to go easy on you, but I don’t think that’s gonna’ happen now.”</i>", parse);
					Text.NL();
					Text.Add("Balancing on his hooves and widening his stance Estevan manages to push deeper inside of you than before. The relentless fucking makes you tremble and groan. His big balls slap against you and you can feel the slickness between your legs where his earlier load drips and splashes out with each thrust. The satyr seems to relish the raunchy, wet fucking. He starts alternating rapid humping with torturously long strokes that tease out the deeply planted seed and cause the spunk to run down your [butt] in rivulets when he pulls out.", parse);
					Text.NL();
					Text.Add("<i>“Don’t my babies feel good inside you?”</i> Estevan asks, and chuckles. He watches his seed drip out of you for a while before snuggling his cockhead back up against your battered hole. <i>“Well, back to work.”</i>", parse);
					Text.NL();
					Text.Add("Estevan slams his cock back into you, squatting slightly to get a better angle and further stimulate the walls of your anus. You get hot enough to press back against his upward plunge into your bowels and your reward is a hard slap to your ass. He remarks on your insatiability as he continues to make himself at home in your stretched hole.", parse);
					Text.NL();
					Text.Add("With you now contributing to the pace of the fuck, Estevan doesn't have to grip you around the waist with both hands, and instead uses his newly free hand to ", parse);
					if(player.HasBalls())
						Text.Add("fondle your [balls].", parse);
					else
						Text.Add("alternate grabbing handfuls of both your ass cheeks.", parse);
					Text.Add(" He grunts appreciatively at the size and shape of them before moving on to your [cocks]. ", parse);
					if(player.NumCocks() > 1)
						Text.Add("He gropes your cocks, giving them equal and loving attention while he plows your ass.", parse);
					else
						Text.Add("He runs his hand up the shaft and and over the [cockTip] before he starts masturbating you in earnest.", parse);
					Text.Add(" The doubled attention, a cock relentlessly plowing your ass and a hand jerking you off, nearly sends you over the edge. Your sphincter tightens against the anal intrusion and[eachof] your [cocks] spasm[notS], producing a heavy splash of cum, but you manage to pull back before the orgasm hits you with its full force. ", parse);
					Text.NL();
					Text.Add("Estevan just uses the newly produced fluid to lubricate your [cocks]. He continues his enthusiastic handjob while doubling the power of each individual thrust.", parse);
					Text.NL();
					Text.Add("<i>“You're driving me crazy! I want to fill you up again so bad!”</i>", parse);
					Text.NL();
					Text.Add("You tell Estevan that you want that, too. You want to feel him filling you up again with his horny satyr juice. He scoots so close to you that you can feel his sweaty skin against yours and he gives you the length of his dick. Between his hand clamped hard on your shoulder and his shallow breathing, you guess that he’s about to cum and he proves you right by blowing another hot load inside you.", parse);
					Text.NL();
					
					Scenes.Estevan.Impregnate(player, PregnancyHandler.Slot.Butt);
					
					Text.Add("One hot blast comes hard after another; his balls seem to have an infinite capacity, as this orgasm is much longer than his first. Estevan pumps so much seed into you that you feel it dribbling out of your loosened butt and onto his erection.", parse);
					Text.NL();
					Text.Add("There is a vast amount of cum inside you between the leftovers of Estevan’s first orgasm and the heavy volume of his second. You can feel it pressing up into your bowels. There’s no chance of alleviating the pressure either with Estevan still fucking your sloppy hole. Both the fullness of your gut and the feeling of Estevan trampling your prostate trigger your own release.", parse);
					Text.NL();
					
					var cum = player.OrgasmCum();
					
					Text.Add("You shower the ground in front of you with your seed, slightly amazed by how hard you’re shooting. Meanwhile Estevan whoops and growls as your tensing anus coaxes yet more cum out of his still-throbbing prick.", parse);
					Text.NL();
					Text.Add("<i>“Now, let's see the damage,”</i> Estevan says, and pulls out. A stream of the satyr’s cum drips down your [leg] when he unplugs your [anus].", parse);
					Text.NL();
					Text.Add("Estevan watches this display with humorous interest. It takes a while, but once you think you've gotten all of the goat-man's cum out, you get dressed in your [armor] only to find more of it leaking out and staining your clothes.", parse);
					Text.NL();
					Text.Add("Estevan shrugs. <i>“The perils of doing business with a satyr, I guess.”</i>", parse);
					Text.NL();
					Text.Add("He starts to leave, but then adds: <i>“If you want to do this again, you know where to find me. Just remember to bring six or ten bottles of wine. And something for yourself, too.”</i>", parse);
					Text.NL();
					Text.Add("You know that you'll see him around later, but for now you should probably go wash up. You reek of goat fur, wine, and cum.", parse);
					Text.Flush();
					
					player.AddLustFraction(0.3);
					player.slut.IncreaseStat(50, 1);
					player.subDom.DecreaseStat(-50, 1);
					
					estevan.flags["Gay"] |= Estevan.GaySex.FuckedBy;
					
					world.TimeStep({minute: 30});
					
					Scenes.Estevan.Prompt();
				}, enabled : true,
				tooltip : "You’re committed to taking all Estevan has to offer."
			});
			options.push({ nameStr : "Uh…",
				func : function() {
					var firstBlow = (estevan.flags["Gay"] & Estevan.GaySex.Blowjob) == 0;
					
					Text.Clear();
					Text.Add("You explain to Estevan that you're not quite up to an extended plowing considering the acreage of cock that he is offering. ", parse);
					var fucks = estevan.flags["Gay"] & Estevan.GaySex.FuckedBy;
					if(firstBlow)
						Text.Add("The satyr isn't thrilled with the change-up at first, clearly having anticipated using his bruiser-sized cock to do some damage to your [butt],", parse);
					else if(fucks)
						Text.Add("The satyr would rather burrow into your pliable, obliging asshole again,", parse);
					else
						Text.Add("It's clear the satyr has more than just a blowjob on his mind,", parse);
					Text.Add(" but when you turn around and start fondling his hairy balls, he doesn’t take long to warm up to the idea. You sink down to your knees and get a face full of Estevan's deeply masculine scent. His dick is drooling badly before you even touch it. The thick pre-ejaculate that the satyr leaks is more fragrant than you might imagine, making you wonder at the ranger's diet.", parse);
					Text.NL();
					Text.Add("<i>“Kiss it. Make friends with it,”</i> he says jokingly.", parse);
					Text.NL();
					Text.Add("He thrusts his hips forward slightly as you work your hands around the thick shaft. The head of his member oozes its juice liberally into your palm and between your fingers. The wetness makes it harder for you to keep hold of his prick, especially with Estevan using the lubrication to slide his massive erection through your slippery hands. The impromptu handjob makes him squirm and paw the hard packed ground with an impatient hoof.", parse);
					Text.NL();
					Text.Add("<i>“C'mon... suck it, [playername],”</i> he urges you on pleadingly.", parse);
					Text.NL();
					Text.Add("You almost want to keep the horny satyr aroused and begging, ", parse);
					if(firstBlow)
						Text.Add("but you did promise him your mouth in lieu of your ass.", parse);
					else
						Text.Add("but the veritable river of precum he's producing is an indication that Estevan needs to get off, and soon.", parse);
					Text.NL();
					Text.Add("As soon as you start to suckle the head of Estevan's cock, the amount of fluid coming out of his cumslit rapidly increases. You've barely started to blow him and already you're swallowing mouthfuls of his precum.", parse);
					Text.NL();
					
					Sex.Blowjob(player, estevan);
					player.FuckOral(player.Mouth(), estevan.FirstCock(), 2);
					estevan.Fuck(estevan.FirstCock(), 2);
					
					if(firstBlow)
						Text.Add("<i>“Ah, sorry. This happens when I get turned on. You're handling it like a professional, though. Don't stop. Keep drinking it down!”</i>", parse);
					else
						Text.Add("<i>“You know how it is,”</i> he says, as a half-hearted apology. <i>“Don’t stop, though. Your mouth feels so good!”</i>", parse);
					Text.NL();
					Text.Add("Estevan is reckless with his fat dick. He slides entirely too much of it into your mouth and down your throat, then groans excitedly, clearly taking pleasure when you gag. He apologizes each time, but his tone is mocking. You'd have a wry insult to answer his brutal play if your mouth wasn't full of his cock. And though he is getting off on handling you roughly, your [cocks] [isAre] nice and hard as well.", parse);
					Text.NL();
					Text.Add("It takes a few long strokes of Estevan’s long, hefty prick before you get used to the girth and length of it creeping down your throat. Your mouth stretches wide to accommodate the massive instrument and Estevan abuses every inch that you give him.", parse);
					Text.NL();
					Text.Add("<i>“You’re so good at this. You could teach some of the girls around this camp a thing or two. Maybe we could do a demonstration: you, on your knees, sucking my cock in front of the whole camp? That could be... instructive,”</i> he jokes, laughing. You lick his shaft and suck harder to cut his laughter short. <i>“Mmm...are you doing that on purpose? I-I don’t know how long I can hold back with you teasing me like this.”</i>", parse);
					Text.NL();
					Text.Add("Estevan humps your face like the world is ending and the only safe place left is somewhere just past your esophagus. His prodigious leakage coats your mouth and throat in his surprisingly sweet precum. He forces your face into his furry crotch with each stroke; the combined smell of his sweat-drenched pelt and the feeling of him fucking your face makes your [cocks] jump. You give yourself a few tugs just to help alleviate the near painful hardness ", parse);
					if(player.HasBalls())
						Text.Add("and the needy ache in your balls.", parse);
					else
						Text.Add("but nothing short of blowing your load is going to help.", parse);
					Text.NL();
					Text.Add("<i>“I’m gonna’ blow, [playername]!”</i> Estevan bellows loudly, not caring who’s listening.", parse);
					Text.NL();
					Text.Add("The satyr shoots volley after volley of salty-sweet cum into your mouth. You can hardly keep up with the heavy flow that escapes with each contraction. His fat balls churn with the effort of providing fodder for Estevan’s messy, seemingly endless orgasm, but he doesn’t stop cumming when you expect him to. Your belly swells with the sudden intake of liquid.", parse);
					Text.NL();
					Text.Add("He yanks his cock out of your mouth and several shots of spunk splash into your face. You jerk back and Estevan snorts. He spurts a few weaker shots on the ground between you, but you can tell that the grand spectacle of his orgasm is starting to peter out.", parse);
					Text.NL();
					Text.Add("He grins at you.", parse);
					Text.NL();
					Text.Add("<i>“You look great wearing my kids on your face, [playername],”</i> he jokes. <i>“Maybe next time you’ll let me ‘knock you up’ properly.”</i>", parse);
					Text.NL();
					Text.Add("You shoot back a joking remark of your own as you clean off your face and put your [armor] back on. Estevan thanks you for helping to get him off and you part ways.", parse);
					if(Math.random() < 0.5) {
						Text.NL();
						Text.Add("Your [cocks] jut[notS] out of your [armor] as you walk back to the camp. You rehash the intense blowjob you just gave and pat your slightly swollen belly, quite a bit hornier than you were before.", parse);
						player.AddLustFraction(0.75);
					}
					Text.Flush();
					
					estevan.flags["Gay"] |= Estevan.GaySex.Blowjob;
					
					world.TimeStep({minute: 15});
					
					Scenes.Estevan.Prompt();
				}, enabled : true,
				tooltip : "If you let the riled up satyr fuck you, you’ll be hobbling around camp for the next few days at least! Maybe you could convince him to accept a blowjob... though your jaw won’t be happy."
			});
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true,
		tooltip : "Give the horny satyr full access to your ass."
	});
	options.push({ nameStr : "Taunt Estevan", //TODO
		func : function() {
			var firstSex = (estevan.flags["Gay"] & Estevan.GaySex.FuckedHim) == 0;
			var fuckedBy = (estevan.flags["Gay"] & Estevan.GaySex.FuckedBy)  != 0;
			
			Text.Clear();
			if(firstSex) {
				Text.Add("Estevan seems taken aback by the suggestion, but his slowly spreading smile might mean that he’s coming around to it.", parse);
				Text.NL();
				Text.Add("<i>“It’s not impossible that we could work something out.”</i>", parse);
			}
			else
				Text.Add("<i>“Again?”</i> Estevan complains, then shakes his head and laughs. <i>“Well, who could blame you? I do have a magnificent ass.”</i>", parse);
			Text.NL();
			Text.Add("He gradually lifts his shirt, delighting in your hungry stare, and swaying drunkenly on his cloven hooves. His hands move up and down his lean chest and casually toy with both nipples. Your erection[s] throb[notS] a little painfully in your [armor].", parse);
			Text.NL();
			Text.Add("<i>“Well, are you going to fuck me or not?”</i> the satyr says, leering.", parse);
			Text.NL();
			Text.Add("You approach Estevan and touch his flat stomach, which he seems to take great pride in, and he hisses as if your touch was searing hot. He takes your hand and guides it between his legs where his burly cock is gaining size.", parse);
			Text.NL();
			Text.Add("He grumbles, briefly, <i>“you should be on the other end of this monster. ", parse);
			if(fuckedBy)
				Text.Add("I bet your hole still remembers me. Doesn’t it get lonely? Does it ask about me?”</i>", parse);
			else
				Text.Add("I bet your hole gets warm and wet, like a real pussy does.”</i>", parse);
			Text.NL();
			Text.Add("You don’t intend to give Estevan the chance to weasel his way into your [butt], not this time anyway. You move close enough that you can smell the floral notes of the light red wine you’ve both been drinking. After a few more tugs on his cock, you slip your hand further between his legs to prick the bud of his ass with your finger.", parse);
			Text.NL();
			Text.Add("Estevan snorts derisively at your efforts to penetrate him, but you can feel him pushing back against your finger, presumably to let you get more than just the tip inside. You’re close enough to kiss ", parse);
			Text.NL();
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("and the satyr leans in, pressing his mouth to yours as you finger his asshole. He whimpers softly while licking your bottom lip, then searches out your tongue with his own. When he pulls away, Estevan is blushing slightly.", parse);
				Text.NL();
				Text.Add("<i>“Tell anybody I did that and I’ll fill your tent with bear traps,”</i> he warns.", parse);
			}, 15.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("but the satyr pulls away.", parse);
				Text.NL();
				Text.Add("<i>“Let’s not get ahead of ourselves, [playername]: we can fuck, but my tongue is into girls.”</i>", parse);
			}, 85.0, function() { return true; });
			
			scenes.Get();
			
			Text.NL();
			Text.Add("Estevan produces a jar of oil and insists that if he’s going to take your [cocks] then he ought to be well-prepared. You apply the unguent to his horny butt and though the satyr is clearly trying to act like your fingers inside him aren’t a big deal, he squirms and grunts under his breath when you push them deeper.", parse);
			Text.NL();
			Text.Add("His hole is prepped, pried open, and drooling with lube; you figure he’s ready for you. He takes one more apprehensive look at it before you turn him around and place the tip of[oneof] your [cocks] against his hole. His willing backside opens up for you as you push forward, sending thrilling jolts of pleasure down your shaft[s]. You take it slow at first, using controlled thrusts to ease the satyr into the fuck, but Estevan mocks you for it.", parse);
			Text.NL();
			
			Sex.Anal(player, estevan);
			estevan.FuckAnal(estevan.Butt(), p1cock, 3);
			player.Fuck(p1cock, 3);
			
			Text.Add("<i>“Don’t hold back on my account. I can take whatever you throw at me,”</i> Estevan taunts.", parse);
			Text.NL();
			Text.Add("Well, in that case…", parse);
			Text.NL();
			Text.Add("You pull the entire length of your [cock] out of him and slam the entire thing back up his fuckhole. The satyr throws back his head and yowls, out of the raw pleasure of rough usage and probably from a bit of pain as well. Now that you’ve established that his rear-end is pliable enough to take you, it’s time to really start plowing him.", parse);
			Text.NL();
			Text.Add("Each time you slam into him, the ranger’s legs shake but the goat man stands up admirably to your brutal fucking. ", parse);
			if(player.NumCocks() > 1)
				Text.Add("You give each of your cocks a turn with his increasingly loose ass and tease him by placing[allof] them against his sphincter and giving it just the slightest push.", parse);
			else
				Text.Add("You fuck his ass until it’s loose enough to swallow you up with each thrust without resistance.", parse);
			Text.Add(" Estevan pants and pleads incoherently, his hair is matted down with sweat, which also runs freely down his back. He’s a mess, but his hole feels great around you and you intend to get some more use out of him yet.", parse);
			Text.NL();
			Text.Add("You command him down to his knees in the dirt and you can tell that you’ve pushed him out of his comfort zone because he complies with a half-hearted grumble instead of his usual jokes and mockery. Estevan gets down on his knees and presses his chest to the ground, he uses his hands to spread his ass-cheeks and his gaping hole awaits you.", parse);
			Text.NL();
			Text.Add("It takes one hard shove and your dick is back inside him. He bleats out a note of surprise, but the walls of his anus squeeze against you anyway. You growl into the goat-slut’s ear, letting him know how much you enjoy fucking him into the dirt. He tugs at his meaty cock, liberally dripping precum between his legs while you slam his back door. The satyr’s copious leakage gives you an idea and you brush his hand away from his cock, replacing his grip with your own. You squeeze down on his shaft while seeking out the hard nub of his prostate with your prick. The effect is instant: he gushes thick seminal fluid, groaning and squirming while you milk him like livestock.", parse);
			Text.NL();
			Text.Add("The handfuls of cum you extract from his rock-hard cock go straight onto your own. You plunge it back into him and he lets slip a grunt that turns into a long, hungry moan. You continue plowing him, using his own spunk as lube, and he pushes back against you as wanton and horny as ever.", parse);
			Text.NL();
			Text.Add("Maybe it’s the wine or maybe it’s Estevan’s sloppy butthole, but you’re starting to feel the lusty churn of need ", parse);
			if(player.HasBalls())
				Text.Add("in your [balls].", parse);
			else
				Text.Add("spreading through your crotch.", parse);
			Text.Add(" You’re almost ready to blow your load, but where?", parse);
			Text.Flush();
			
			world.TimeStep({minute: 30});
			
			estevan.flags["Gay"] |= Estevan.GaySex.FuckedHim;
			
			//[Facial][Inside]
			var options = new Array();
			options.push({ nameStr : "Facial",
				func : function() {
					Text.Clear();
					Text.Add("You give it a half-dozen more thrusts, just enough to push yourself to the absolute limit, before pulling out of Estevan’s butt. He makes a noise that’s either disappointment or gratitude, or maybe a bit of both. He’s still face-down in the dirt with his freshly-fucked ass wagging in front of you. It’s not his ass that you’re after though, is it?", parse);
					Text.NL();
					Text.Add("You order him to come clean you off and he scrambles up on to his knees, his mouth and tongue instinctively go to your [cocks]. He spit-shines your messy knob[s] while you pump the length of[oneof] your dick[s] with one hand.", parse);
					Text.NL();
					Text.Add("You give him a warning, but your load arrives hot and fast. You blast your first shot up over Estevan’s head, but the second lands square on his forehead and the thick cum slides down over the bridge of his nose. You push your erupting prick[s] right up to the satyr’s face and dump your hot cum right on his skin. The pleasure of your orgasm is intense, but the real satisfaction comes out of seeing the smirking satyr take a hot cum skin treatment straight from your engorged cock[s].", parse);
					Text.NL();
					
					var cum = player.OrgasmCum();
					
					Text.Add("He licks the thick spooge off of his lips while you pant and come down from your sexual high. His hands are busy between his legs, one jerking his fat organ and the other disappearing into his prised-open fuckhole. The satyr’s member spurts more precum by the second and he repurposes it as lube to coat his swollen head.", parse);
					Text.NL();
					Text.Add("<i>“You’d better not...I’m not usually...I mean…”</i> he mutters, while cramming his sloppy hole with another finger or two. He tightens his grip around the shaft, and hisses, <i>“fuck!”</i>", parse);
					Text.NL();
					Text.Add("Estevan twitches and contorts in pleasure as his cock produces a veritable shower of spunk. The wild, directionless torrent ends up everywhere including your [armor]. When it almost seems that Estevan won’t stop cumming, he starts to jerk his dick and the flood of semen slows to a trickle. He sighs and lets go of himself, but his still-hard rod continues to leak into the dirt.", parse);
					Text.NL();
					
					var cum = estevan.OrgasmCum();
					
					Text.Add("<i>“Usually I’m on the other side of this equation,”</i> Estevan jokes. <i>“Maybe I’ll have more empathy for the poor souls who have to wash my cum out of their hair?”</i> He ponders the proposition for a while, then shrugs. <i>Nah…”</i>", parse);
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "The satyr <i>would</i> look pretty hot with your spunk running down his face, wouldn’t he?"
			});
			options.push({ nameStr : "Inside",
				func : function() {
					Text.Clear();
					Text.Add("There’s no reason to stop fucking Estevan, after all he’s willing, and—from the size of his cock and how madly it’s precumming as you bang his butt—he seems to be into it. Your lower half is nestled close against the satyr’s rump with just enough room to allow your [hips] to piston back and forth, driving[oneof] your cock[s] into his hole. He uses one of his hands to keep his ass cheeks spread open while yanking his own chain, getting himself off to the insistent rhythms of your aggressive fucking.", parse);
					Text.NL();
					Text.Add("You approach the point of no return and then go barrelling past it like a chariot on fire careening off of a cliff. Your [cock] plunges deep into Estevan’s hole as you plant your first burst of cum inside him. ", parse);
					if(player.NumCocks() > 1)
						Text.Add("Your remaining cock[s2] spew[notS2] cum up between Estevan’s butt cheeks, splashing your hot seed on the hand he’s using to keep his hole open and available to you. ", parse);
					Text.Add("The abrupt thrust of your entire dick into his depths stretches Estevan’s hole and brutalizes his prostate into orgasm. His anus clamps down on your spasming dick and milks your remaining load as the two of you press your sweating bodies together and ride out the waves of pleasure.", parse);
					Text.NL();
					
					var cum = player.OrgasmCum();
					estevan.OrgasmCum();
					
					Text.Add("The ranger leaves a wet mess in the dirt beneath him where he unburdened himself: it’s a puddle of semen that his cock adds to as it dribbles out a seemingly never ending trickle of cum. You add to his sticky dilemma when your [cock] uncorks his ass and the sodden hole spits your cum back in creamy fits and starts.", parse);
					Text.NL();
					
					if(cum > 6) {
						Text.Add("Estevan is speechless, but moans intermittently as his pregnant-seeming belly expels its contents through his back door. Your titanic load spews wetly and noisily out of his ass in a gradual flow that soaks the fur of his quivering legs and makes for an incredibly raunchy sight.", parse);
					}
					else if(cum > 3) {
						Text.Add("<i>“Did you have to cum inside me?</i> Estevan complains. Your cum emerges from his ass in thick splashes as he works to push it all out.", parse);
					}
					else {
						Text.Add("<i>“Uhhhh…”</i> Estevan groans unintelligibly, as your spunk bubbles out of him.", parse);
					}
					
					Text.NL();
					Text.Add("It takes a few minutes before he manages to gather his wits and come out of his jizz-soaked reverie. If you have any question that the satyr enjoyed the thorough fucking, it’s answered when he swipes a finger across his oozing orifice then sucks the cum from his finger.", parse);
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "You’ve already committed to fucking his ass, why give up before the grand finale?"
			});
			Gui.SetButtonsFromList(options, false, null);
			
			Gui.Callstack.push(function() {
				Text.NL();
				Text.Add("Estevan wipes his face with his sleeve and shakes his head.", parse);
				Text.NL();
				Text.Add("<i>“I don’t know why I even agreed to that,”</i> he wonders aloud, more to himself than to you. But then he grins and winks. <i>“Not that I wouldn’t consider doing it again, assuming you bring enough wine.”</i>", parse);
				Text.NL();
				Text.Add("The satyr looks at you and shakes his head again before wandering back to camp. You get dressed and follow, you’ll have to clean yourself up; the goat-man’s animal musk is all over you.", parse);
				Text.NL();
				Text.Add("Not that it’s necessarily a bad thing.", parse);
				Text.Flush();
				
				world.TimeStep({minute: 10});
				
				player.subDom.IncreaseStat(75, 1);
				
				Scenes.Estevan.Prompt();
			});
		}, enabled : true,
		tooltip : "Convince the satyr that he ought to let you have a turn at his ass. After all, he drank all your wine."
	});
	Gui.SetButtonsFromList(options, false, null);
}

