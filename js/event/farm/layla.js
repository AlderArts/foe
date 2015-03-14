/*
 * 
 * Define Layla
 * 
 */
function Layla(storage) {
	Entity.call(this);

	// Character stats
	this.name = "Layla";
	
	//this.avatar.combat = Images.maria;
	
	/* TODO
	this.maxHp.base        = 100;
	this.maxSp.base        = 80;
	this.maxLust.base      = 50;
	// Main stats
	this.strength.base     = 20;
	this.stamina.base      = 22;
	this.dexterity.base    = 16;
	this.intelligence.base = 17;
	this.spirit.base       = 15;
	this.libido.base       = 20;
	this.charisma.base     = 18;
	
	this.level = 5;
	this.sexlevel = 3;
	
	*/
	
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 5;
	this.SetSkinColor(Color.blue);
	this.SetHairColor(Color.black);
	this.SetEyeColor(Color.red);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = Layla.Met.NotMet;

	if(storage) this.FromStorage(storage);
}
Layla.prototype = new Entity();
Layla.prototype.constructor = Layla;

/*
 * TODO Stats
 * Combat mob
 * Act AI
 * Avatar (2?)
 */


Layla.Met = {
	NotMet : 0,
	First : 1,
	Won : 2
};

Scenes.Layla = {};

Layla.prototype.FromStorage = function(storage) {
	this.FirstVag().virgin   = parseInt(storage.virgin) == 1;
	this.Butt().virgin       = parseInt(storage.avirgin) == 1;
	
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Layla.prototype.ToStorage = function() {
	var storage = {
		virgin  : this.FirstVag().virgin ? 1 : 0,
		avirgin : this.Butt().virgin ? 1 : 0
	};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

// Schedule
Layla.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Farm.Fields)
		return (world.time.hour >= 7 && world.time.hour < 22);
	return false;
}

/*
 * TODO Trigger meetings:
 * 
 * 1. First meeting. On approaching farm from plains. On waking up from sleep on farm.
 * 2. Repeat meeting (if you lost). Same as above.
 * 3. Meeting after defeating Layla.
 * 
 */

//approaching/sleeping
Scenes.Layla.FirstMeeting = function(approach) {
	var parse = {
		playername : player.name
	};
	
	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
	parse["c"] = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
	
	layla.flags["Met"] = Layla.Met.First;
	
	Text.Clear();
	if(approach) {
		Text.Add("As you[c] make your way across the fields towards the farmhouse, your ears are filled with a great furor. Shouts, curses, screams, bleats; a cacophony of distress torn from throats animal and otherwise.", parse);
		Text.NL();
		Text.Add("Instinctively, you pick up your pace, racing to investigate. As you approach the barn, you see Gwendy pelting over the turf, swearing to herself. She lunges for a pitchfork that was left leaning against the side of the barn and spins on her heel to start back the way she had come.", parse);
		Text.NL();
		Text.Add("Running as fast as you can, you intercept the angry farmer, asking her just what is going on.", parse);
		Text.NL();
		Text.Add("<i>“Some kind of wild animal is raiding my storage. Gave the sheep quite a scare,”</i> she says, pointing toward a group of sheep huddled together.", parse);
		Text.NL();
		Text.Add("Without thinking, you nod your understanding. Caught up in the heat of the moment, you ask her if she’d like you[c] to handle this for her; you have a bit more combat experience than her.", parse);
	}
	else { // Sleeping at the farm
		Text.Add("As you lie curled up on your bed, a great clamoring rouses you[c] from your slumber. Startled, you grab your things and drop from the hayloft down into the barn proper, only to be nearly trampled as a flock of sheep charge inside, huddling together for shelter wherever they find a convenient nook.", parse);
		Text.NL();
		Text.Add("You race outside of the barn, almost running into Gwendy, who has just grabbed a nearby pitchfork. You ask her what is going on.", parse);
		Text.NL();
		Text.Add("<i>“Ah, [playername]. Good to see you’re awake. Some kind of wild animal is raiding my storage. I could use some help getting rid of it.”</i>", parse);
		Text.NL();
		Text.Add("Without stopping to think, you immediately blurt out that you’re happy to give her a hand. You probably have more combat experience than she does anyway.", parse);
	}
	Text.NL();
	Text.Add("<i>“Sure thing!”</i> she says with a smile. <i>“That thing is in the storage down this way!”</i> Gwendy hastily adds, dashing away. You[c] immediately take off after the sprinting farmer.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("When you arrive, you immediately take notice of the trail of destruction left by the so called creature. The sturdy door to the storage room has been knocked clean from its hinges, pieces of the wooden frame lying spread across the floor. From inside come the obvious sounds of munching and swallowing, as well as the occasional tinkle of shattering glass. Whoever tore down the door is clearly gorging themselves on Gwendy’s precious food, without the slightest care about being caught.", parse);
		Text.NL();
		if(party.Num() < 4) {
			Text.Add("<i>“Let’s go, [playername], while I still have food left!”</i> Gwendy says, stepping inside. You follow on the heels of farmer.", parse);
			
			gwendy.RestFull();
			party.SaveActiveParty();
			party.AddMember(gwendy);
			
			Text.NL();
			Text.Add("Gwendy temporarily joins your party.", parse, "bold");
		}
		else {
			Text.Add("<i>“You and your friends look capable enough, but if you need me, I’ll be right here.”</i>", parse);
			Text.NL();
			Text.Add("You thank Gwendy for her offer, but assure her that you and your companions can handle this. The four of you ready yourselves and step through the broken door into the storage room.", parse);
		}
		Text.NL();
		Text.Add("Once inside, you get a brief glimpse of the wreckage. Broken preserve jars, torn sacks, discarded scraps of food. But your attention is fixed on the creature responsible. Standing roughly five and a half feet tall, it’s a strange creature. Its features are elfin - you can see the distinctive ears from where you stand - but it’s darkly colored and has a long, lashing, lizard-like tail.", parse);
		Text.NL();
		Text.Add("As you step closer, glass crunches under your weight, making it wheel to face you. Red eyes narrow into a ferocious glare, and the lips, set in a surprisingly female face, curl into a teeth-baring snarl. She tosses a half-eaten apple away and you catch a glimpse of her teardrop shaped breasts and carelessly exposed pussy.", parse);
		Text.NL();
		Text.Add("The creature’s long tail whips restlessly from side to side, and her fingers curl into makeshift claws. Her body shifts, adopting a low-slung stance with legs primed to send her springing forward in a pounce. A bestial hiss slithers past her lips. It’s a fight!", parse);
		Text.Flush();
		
		Gui.NextPrompt(Scenes.Layla.FarmCombat);
	});
}


//TODO
//In case you let her get away. This happens 3 days after that. And continue repeating every 3 days till you win.
Scenes.Layla.RepeatMeeting = function(approach) {
	var parse = {
		playername : player.name
	};
	
	var num = party.Num();
	
	if(party.Num() < 4) {
		gwendy.RestFull();
		party.SaveActiveParty();
		party.AddMember(gwendy);
	}
	
	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
	parse["c"]    = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
	
	Text.Clear();
	if(approach) {
		Text.Add("As you[c] cross the fields to Gwendy’s farm, you hear a chorus of shouting, screaming and swearing. You race for the storage, urged on by a sinking feeling in your stomach about what’s going on. ", parse);
		Text.NL();
		parse["g1"] = party.InParty(gwendy) ? " and Gwendy" : "";
		parse["g2"] = party.InParty(gwendy) ? "" : ", followed by Gwendy";
		Text.Add("Meeting a cursing Gwendy armed with a pitchfork there, and seeing that the door has been knocked down again, only confirms your suspicions. Without the need for words, you[g1] burst into the storage[g2]. The creature chokes, spitting a glob of half-chewed cheese on the floor, and whirls to again fight you off.", parse);
	}
	else {
		Text.Add("<i>“[playername]! Wake up!”</i>", parse);
		Text.NL();
		Text.Add("You grunt and force your protesting eyes to open, blinking to try to bring the world into focus.", parse);
		if(num > 2)
			Text.Add(" Around you, your companions likewise stir from their slumber, complaining in their own ways about the rude awakening.", parse);
		else if(num > 1) {
			parse["name"] = party.Get(1).name;
			parse["heshe"] = party.Get(1).heshe();
			Text.Add(" [name] grumbles audibly as [heshe] is likewise forced back into the waking world.", parse);
		}
		Text.NL();
		Text.Add("You turn a slightly irritated gaze on  Gwendy. In your state, it takes a moment to notice the grim set of her jaw.", parse);
		Text.NL();
		Text.Add("<i>“She’s back! Get up and help me catch her!”</i>", parse);
		Text.NL();
		Text.Add("The words burn through the fog still lingering in your sleep-fuddled brain. Grabbing your gear, you[c] hasten to join the farmer as she races to the storage room.", parse);
		Text.NL();
		Text.Add("Just like the first time, the recently repaired door has been knocked off its hinges, much to Gwendy’s evident frustration. You charge on in, intent on this time preventing the creature’s escape. It drops the jar of milk it was guzzling with a strangled belch of surprise, once again immediately moving to defend itself.", parse);
	}
	
	if(party.InParty(gwendy)) {
		Text.NL();
		Text.Add("Gwendy temporarily joins your party.", parse, "bold");
	}
	
	Text.Flush();
	
	Gui.NextPrompt(Scenes.Layla.FarmCombat);
}

Scenes.Layla.FarmCombat = function() {
	var enemy = new Party();
	enemy.AddMember(new LaylaMob());
	var enc = new Encounter(enemy);
	
	enc.canRun = false;
	
	enc.onLoss = Scenes.Layla.FarmCombatLoss;
	enc.onVictory = Scenes.Layla.FarmCombatWin;
	/* TODO
	enc.LossCondition = ...
	*/
	enc.Start();	
}

Scenes.Layla.FarmCombatLoss = function() {
	var enc = this;
	SetGameState(GameState.Event);
	
	if(party.InParty(gwendy))
		party.LoadActiveParty();
	
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>“Dammit!”</i> you hear Gwendy curse as the creature dashes past her in a single leap. You give chase, but by the time you exit the storehouse she’s already gone.", parse);
	Text.NL();
	Text.Add("<i>“Fuck!”</i> Gwendy curses again. <i>“Look at this mess!”</i>", parse);
	Text.NL();
	Text.Add("As if you could miss it. By herself, that thing, whatever it was, seems to have eaten easily a third of all the food Gwendy had stored here. Shelves are torn down, broken or discarded containers lie everywhere, and the floor is covered in puddles of brine, honey, jam, broken eggs, flour and spilt milk.", parse);
	Text.NL();
	Text.Add("<i>“I-Is the monster gone?”</i> A familiar sheep asks, peeking in from outside.", parse);
	Text.NL();
	Text.Add("<i>“Yes, it’s gone. Danie, be a dear and fetch Adrian for me. I’m going to need some help cleaning this up. Plus, the door needs fixing.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Sure!”</i> Danie replies, darting away.", parse);
	Text.NL();
	Text.Add("Taking in the damage again, you tap Gwendy on her shoulder to get her attention. When she turns to you, you point out that this probably won’t be the last raid. That creature looked hungry, and now that she knows where there’s food to be had, you’d lay money on her coming back for more when she wants it.", parse);
	Text.NL();
	Text.Add("<i>“Yeah, I’m pretty sure she will. But when she does, we’ll be ready.”</i>", parse);
	Text.NL();
	Text.Add("You nod firmly, assuring Gwendy that if you can, you’ll try and be here to help her with the next raid.", parse);
	Text.NL();
	Text.Add("<i>“Thanks, [playername],”</i> the farmer says, getting up on her feet and offering you a smile. <i>“If you want, you can stay over and I’ll call you when we spot that creature again.”</i>", parse);
	Text.NL();
	Text.Add("You thank Gwendy for her offer, and tell her you’ll consider it. For now, you should figure out what you want to do.", parse);
	Text.Flush();
	
	world.TimeStep({minute: 30});
	
	Gui.NextPrompt();
}

Scenes.Layla.FarmCombatWin = function() {
	var enc = this;
	SetGameState(GameState.Event);
	
	if(party.InParty(gwendy))
		party.LoadActiveParty();
	
	var parse = {
		playername : player.name
	};
	
	layla.flags["Met"] = Layla.Met.Won;
	
	Text.Clear();
	Text.Add("With a great hissing sigh, the creature staggers before collapsing onto the ground into a pile of scraps. Her formerly lashing tail goes limp and she lies motionless, clearly out cold.", parse);
	Text.NL();
	Text.Add("<i>“Good job!”</i> Gwendy exclaims triumphantly. <i>“Quick, [playername]. There’s some rope on that shelf. Tie this thing up before she wakes up.”</i>", parse);
	Text.NL();
	Text.Add("You hasten to grab the indicated ropes. Between the two of you, the creature is soon trussed up like a troublesome calf; she won’t be getting out of these bindings anytime soon. Once the creature is secured, you ask Gwendy what you should do next.", parse);
	Text.NL();
	Text.Add("<i>“There’s an empty tool shed that way. We can keep her locked in there until we can figure out what to do with her. I’ll go get someone to watch her.”</i>", parse);
	Text.NL();
	Text.Add("With a nod of understanding, you haul your new captive along in the direction Gwendy indicated. She’s pretty heavy... but then, after how much she ate, you’re not surprised.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("<i>“Thanks a lot for the help, [playername]. You’re a life saver.”</i> Gwendy smiles.", parse);
		Text.NL();
		Text.Add("It was nothing, really, you assure her. The two of you head back toward the barn, chatting about the encounter. Gwendy seems rather impressed by your performance, and she’s definitely grateful for your help. The farmer invites you up to her loft for some refreshments, and you graciously accept, following her up the ladder and taking a seat at her table.", parse);
		Text.NL();
		Text.Add("<i>“Can I get you anything? Tea? Coffee?”</i> Gwendy wipes the sweat from her brow, a single drop escaping her attention and dripping down into her generous cleavage.", parse);
		Text.Flush();
		
		var hadSex = false;
		
		//[Tea] [Coffee] [You’re fine] [Sex]
		var options = new Array();
		options.push({ nameStr : "Tea",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Alright, take a seat and I’ll prepare you some tea.”</i>", parse);
				Text.NL();
				Text.Add("Thanking her for her kindness, you make yourself comfortable and settle back to wait for your drink.", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Some tea would be lovely."
		});
		options.push({ nameStr : "Coffee",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Okay, sit down while I prepare some.”</i>", parse);
				Text.NL();
				Text.Add("Thanking her for her kindness, you make yourself comfortable and settle back to wait for your drink.", parse);
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Coffee would be great."
		});
		options.push({ nameStr : "You’re fine",
			func : function() {
				Text.Clear();
				Text.Add("<i>“You sure? Alright then. Hope you don’t mind if I fix some coffee for myself.”</i>", parse);
				Text.NL();
				Text.Add("You smile and shake your head, assuring her that it’s fine. As she disappears into the kitchen to fix herself something, your make yourself comfortable.", parse);
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "You’re not thirsty, but you appreciate the offer."
		});
		options.push({ nameStr : "Sex",
			func : function() {
				Text.Clear();
				Text.Add("You tell her that if she wants to show you her gratitude, you can think of a more enjoyable way for her to do that...", parse);
				Text.NL();
				Text.Add("<i>“I see, and what way would that be?”</i> Gwendy asks with a knowing smile.", parse);
				Text.Flush();
				
				hadSex = true;
				
				Scenes.Gwendy.LoftSexPrompt(function() { //TODO back
					hadSex = false;
					
					Text.Clear();
					Text.Add("Uhh… actually, never mind. You shouldn’t have brought it up.", parse);
					Text.NL();
					Text.Add("<i>“And what would ‘it’ be?”</i> Gwendy queries, eyebrow raised. The girl seems pretty amused as you squirm under her gaze. <i>“If you are feeling a bit antsy… I’m not one to be ungrateful,”</i> she adds suggestively.", parse);
					Text.NL();
					Text.Add("She’s sharper than she lets on. Stumbling a bit over your words, you quickly decline, managing to get out something about having that drink.", parse);
					Text.NL();
					Text.Add("<i>“Sure,”</i> Gwendy shrugs, heading for her kitchen downstairs. <i>“Tea? Coffee? Milk?”</i>", parse);
					Text.NL();
					Text.Add("Goddamnit. She’s chuckles to herself, disappearing from view.", parse);
					Text.Flush();
					Gui.NextPrompt();
				}, true); //disable sleep
			}, enabled : true, //TODO //Only available if you can normally access her Sex menu, otherwise disable this button.
			tooltip : "If she wants to show you her gratitude, you can think of a more enjoyable way for her to do that..."
		});
		Gui.SetButtonsFromList(options, false, null);
		
		Gui.Callstack.push(function() { //TODO
			Text.Clear();
			
			world.TimeStep({hour: 2});
			
			if(hadSex) {
				Text.Add("Quite some time later, when both of you have become a bit more presentable again and are sipping on some refreshments, you’re interrupted by a cowgirl poking her head up from the ladder leading to the loft. There’s a slight flush on her cheeks when she perceives the mood, but she shakes herself back to reality.", parse);
				Text.NL();
				Text.Add("<i>“Uhh… boss? She’s awake.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Alright, thanks,”</i> Gwendy replies, unfaced by the farmhand’s discomfort. The farmer turns to you, flashing you a quick grin. <i>“Shall we go see what this little intruder is up to, then? Or are you still feeling antsy?”</i> The cowgirl disappears down the ladder, ears burning.", parse);
			}
			else {
				Text.Add("You relax and chat with Gwendy for a while, until a cowgirl pokes up over the edge of the loft, interrupting you.", parse);
				Text.NL();
				Text.Add("<i>“Boss? She’s awake.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Alright, thanks,”</i> Gwendy replies. She nods at the cowgirl, dismissing her. <i>“Alrighty then. Let’s figure out what to do with our little intruder, shall we?”</i> she says, smiling at you.", parse);
			}
			Text.NL();
			Text.Add("Setting your shoulders, you rise from your seat and ask her to lead the way.", parse);
			Text.NL();
			Text.Add("Having set off at a brisk pace, you arrive at the toolshed shortly. The door is closed and one of the farm’s tougher-looking cowgirls is standing guard. At a gesture from Gwendy, the cowgirl nods, stepping aside to let the two of you pass.", parse);
			Text.NL();
			Text.Add("Gwendy is the first into the shed, and her sudden, sharp curse brings you racing to join her.", parse);
			Text.NL();
			Text.Add("Inside, you find that your captive has somehow gotten out of her bonds and is now loose. The she-beast is huddled in a corner, hissing like a giant snake, fingers curled into claws and tail lashing behind her.", parse);
			Text.NL();
			Text.Add("And yet... the creature’s eyes are wide and staring, darting all around the room in search of an exit. Her teeth are bared, but her body trembles feverishly. Despite her threatening display, you’re sure that the creature is scared of you.", parse);
			Text.NL();
			Text.Add("The stand off lasts for several long seconds. And then, the silence is cut by a plaintive gurgling grumble. Unthinkingly, the creature wraps her hands over her belly, whimpering softly in hunger. From panicked and threatening, she now just looks pitiful.", parse);
			Text.NL();
			Text.Add("Gwendy sighs. <i>“[playername], keep an eye on her, will you? I’ll be right back.”</i>", parse);
			Text.NL();
			Text.Add("You nod your assent and step past Gwendy, pointedly blocking the door as Gwendy ducks back outside.", parse);
			Text.NL();
			Text.Add("The farmer returns moments later with an armful of apples nestled against her bosom. She walks past you and crouches next to the strange girl, offering one to her.", parse);
			Text.NL();
			Text.Add("At first, the creature is suspicious, her red eyes drifting between you, Gwendy and the proffered apple. After what seems like an eternity, she reaches out a hand and snatches the fruit, practically devouring it on the spot. The others follow in suit.", parse);
			Text.NL();
			Text.Add("<i>“There you go. Better?”</i> Gwendy asks.", parse);
			Text.NL();
			Text.Add("<i>“...Thank you...”</i> the girls say in a hushed voice.", parse);
			Text.NL();
			Text.Add("<i>“So, you can talk...”</i> the farmer girl says.", parse);
			Text.NL();
			Text.Add("The creature simply nods, finally relaxing; her face loses some of its fearfulness and she stops holding herself quite so tensely. Gently, she sinks to the ground, seating herself on the earthen floor, leaning against the wall for support. Her hands lay themselves in her lap, her tail curling defensively around her body.", parse);
			Text.NL();
			Text.Add("<i>“Okay then, what’s your name?”</i>", parse);
			Text.NL();
			Text.Add("The creature looks at Gwendy for a moment, then shrugs.", parse);
			Text.NL();
			Text.Add("<i>“You got no name?”</i>", parse);
			Text.NL();
			Text.Add("The girl simply shakes her head.", parse);
			Text.NL();
			Text.Add("<i>“Then where do you come from?”</i>", parse);
			Text.NL();
			Text.Add("The creature looks at Gwendy for a moment, then shrugs once more.", parse);
			Text.NL();
			Text.Add("<i>“Oh boy… you’re not making this easy are you?”</i> the farmer sighs, then looks at you. From her expression, she’s obviously asking you for ideas.", parse);
			Text.NL();
			Text.Add("Hmm... you could always try and take the creature along with you. She could be useful in your party.", parse);
			Text.Flush();
			
			var take = false;
			
			//[Take] [Don’t take]
			var options = new Array();
			options.push({ nameStr : "Take",
				func : function() {
					Text.Clear();
					Text.Add("<i>“That’s not a half-bad idea. But...”</i> She turns her gaze back to the strange girl. <i>“There’s the matter of broken storage doors, the shelves, pots and crates. Not to mention my frightened animals and workers.”</i>", parse);
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Offer to take the creature with you; that should keep her out of mischief, at least."
			});
			options.push({ nameStr : "Don’t take",
				func : function() {
					Text.Clear();
					Text.Add("Gwendy shrugs, then turn back to the girl. <i>“Alright then, we’ll figure that part out some other time. For now there is a little matter you and I have to settle first, missy.”</i>", parse);
					Text.NL();
					Text.Add("The girls simply tilts her head to the side, eyeing the farmer with confusion.", parse);
					Text.NL();
					Text.Add("<i>“The broken storage doors, the shelves, pots and crates. Not to mention my frightened animals and workers.”</i>", parse);
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Tell Gwendy that you don’t have any ideas what to do with the creature."
			});
			Gui.SetButtonsFromList(options, false, null);
			
			Gui.Callstack.push(function() {
				Text.NL();
				Text.Add("The girl cowers as Gwendy lists all the damage she’s caused.", parse);
				Text.NL();
				Text.Add("<i>“Well? What are you going to do about it?”</i>", parse);
				Text.NL();
				Text.Add("The girl, whatever she is, is clearly at a loss for words. She looks so pathetic that you just have to intervene. Before you have the chance to, however, Gwendy puts a hand on your shoulders and winks. Seems like she has a plan. You close your mouth and wait to see what she has in mind.", parse);
				Text.NL();
				Text.Add("<i>“I… I’m sorry,”</i> the girl says.", parse);
				Text.NL();
				Text.Add("<i>“You can’t just go about entering any farm you see around, scaring everyone, then pilfering their food. Everyone worked really hard for the fruit and produce you just carelessly gobbled up.”</i>", parse);
				Text.NL();
				Text.Add("<i>“I’m sorry. I was hungry...”</i> she says, now on the verge of tears.", parse);
				Text.NL();
				Text.Add("<i>“I don’t think you understand how hard they all worked...”</i> Gwendy adds. <i>“But not to worry, you soon will. You say you were hungry? Well, we can’t have that either.”</i>", parse);
				Text.NL();
				Text.Add("The girl stops crying for a moment, just looking at the farmer with curiosity and fear in her eyes.", parse);
				Text.NL();
				if(take) {
					Text.Add("<i>“You will work and repair the doors you broke, clean up the storage and apologize to everyone you scared. Then I’ll let [playername] take you. Agreed?”</i>", parse);
					Text.NL();
					Text.Add("The creature nods slowly.", parse);
					Text.NL();
					Text.Add("<i>“Good, now let’s get up and get you fed. Can’t work on an empty stomach.”</i>", parse);
					Text.NL();
					Text.Add("<i>“T-Thank you,”</i> she replies, wiping the tears off her eyes and getting on her feet.", parse);
					Text.NL();
					Text.Add("<i>“[playername]. Come back in a couple days, okay? I’m going to give this one a schooling. If you take her with you as she is, I’m afraid she’ll only cause trouble.”</i>", parse);
					Text.NL();
					Text.Add("Nodding your head, you muse aloud that Gwendy does raise a valid point. You don’t think that the girl is fit to be taken to a city yet; sounds like a recipe for disaster. You’re happy to leave her here until Gwendy is done schooling her.", parse);
				}
				else {
					Text.Add("<i>“You will work here, until you’ve paid everyone back for the damage you caused. Then, I’ll let you go. Understand?”</i>", parse);
					Text.NL();
					Text.Add("The girl nods slowly.", parse);
					Text.NL();
					Text.Add("<i>“And if you prove you can work well enough. Who knows… I might even consider letting you stay. It’s hard work, but at least you won’t go hungry, right?”</i>", parse);
					Text.NL();
					Text.Add("At this, the creature smiles a little. <i>“T-Thank you...”</i>", parse);
					Text.NL();
					Text.Add("<i>“See? You’re a good girl after all. C’mon, get up and let’s get you fed. You can’t work on an empty stomach.”</i>", parse);
					Text.NL();
					Text.Add("The strange girl nods again and wipes the tears from her eyes.", parse);
					Text.NL();
					Text.Add("Gwendy turns to look at you next. <i>“Hey, [playername]. Don’t worry about it. I’ll keep this girl here, school her and put her to work. This way, we know she won’t cause trouble. Plus, she can intimidate other petty thieves.”</i>", parse);
					Text.NL();
					Text.Add("You confess that Gwendy’s idea sounds like a solid plan to you. This is probably the best place for her at the moment.", parse);
				}
				Text.Flush();
				
				world.TimeStep({hour: 1});
				
				Gui.NextPrompt();
			});
		});
	});
}

