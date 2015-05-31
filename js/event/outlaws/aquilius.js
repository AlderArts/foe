/*
 * Aquilius, Outlaw Avian healer
 */
Scenes.Aquilius = {};

function Aquilius(storage) {
	Entity.call(this);

	// Character stats
	this.name = "Aquilius";
		
	this.body.DefMale();
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"]   = Aquilius.Met.NotMet;
	this.flags["Herbs"] = Aquilius.Herbs.No;
	this.herbIngredient = null;
	
	this.helpTimer  = new Time();

	if(storage) this.FromStorage(storage);
}
Aquilius.prototype = new Entity();
Aquilius.prototype.constructor = Aquilius;

Aquilius.Met = {
	NotMet : 0,
	Met    : 1,
	Helped : 2
};
Aquilius.Herbs = {
	No       : 0,
	Known    : 1,
	OnQuest  : 2,
	Finished : 3
};
Aquilius.ExtraHerbs = function() {
	return [
		Items.Lettuce,
		Items.SnakeOil,
		Items.FreshGrass,
		Items.Foxglove,
		Items.FruitSeed
	];
}

Aquilius.prototype.FromStorage = function(storage) {
	if(storage.herb)
		this.herbIngredient = ItemIds[storage.herb];
	this.helpTimer.FromStorage(storage.Htime);
	
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Aquilius.prototype.ToStorage = function() {
	var storage = {
		
	};
	
	if(this.herbIngredient)
		storage.herb = this.herbIngredient.id;
	storage.Htime = this.helpTimer.ToStorage();
	
	this.SavePersonalityStats(storage);
	this.SaveFlags(storage);
	
	return storage;
}

Aquilius.prototype.Update = function(step) {
	this.helpTimer.Dec(step);
}

// Schedule TODO
Aquilius.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Outlaws.Infirmary)
		return (world.time.hour >= 7 && world.time.hour < 22);
	return false;
}

Aquilius.prototype.OnHerbsQuest = function() {
	return this.flags["Herbs"] >= Aquilius.Herbs.OnQuest;
}
Aquilius.prototype.OnHerbsQuestFinished = function() {
	return this.flags["Herbs"] >= Aquilius.Herbs.Finished;
}
Aquilius.prototype.HelpCooldown = function() {
	return new Time(0,0,0,12,0);
}
Aquilius.prototype.QualifiesForAnyJob = function(entity) {
	return aquilius.QualifiesForHerbs(entity); //TODO
}
Aquilius.prototype.QualifiesForHerbs = function(entity) {
	return Jobs.Ranger.Unlocked(entity);
}
Aquilius.prototype.SetHerb = function(override) {
	var item = override || _.sample(Aquilius.ExtraHerbs());
	this.herbIngredient = item;
	return item;
}

Scenes.Aquilius.FirstMeeting = function() {
	var parse = {
		playername : player.name
	};
	
	aquilius.flags["Met"] = 1;
	
	Text.Clear();
	Text.Add("The moment you push apart the tent flaps and step into the tent’s expansive confines, it becomes readily apparent what the place is: an infirmary. Several bandaged morphs lie on the cots laid out before you, while a couple more mill amongst them, the latter making sure the former are comfortable.", parse);
	Text.NL();
	if(party.InParty(kiakai)) {
		parse["name"] = kiakai.name;
		parse["hisher"] = kiakai.hisher();
		Text.Add("<i>“A place of healing and recovery,”</i> [name] breathes, [hisher] voice almost reverent. <i>“It is good that even in this place, there is-”</i>", parse);
		Text.NL();
	}
	Text.Add("The aura of peace that envelops the infirmary is shattered by a loud, piercing scream from behind a curtain near the back of the tent. Oddly, no one seems very much disturbed by the sudden cry, but you decide to investigate anyway, pushing your way through the cots and peering through a gap in the curtains. From where you stand, you spy a horse and eagle-morph within, the latter working on the former with… yes, with a needle and thread. Well, that would explain the screaming.", parse);
	Text.NL();
	Text.Add("<i>“Aria’s tits, Zevran,”</i> the eagle-morph mutters. <i>“Don’t be such a wimp. Hold still and don’t yell so much - other folks need their rest. The sooner I can sew you up, the sooner I can throw you out of here - or do you want a leather strop to bite on so you won’t chew your tongue off?”</i>", parse);
	Text.NL();
	Text.Add("The horse-morph mumbles something that you can’t quite make out.", parse);
	Text.NL();
	Text.Add("<i>“Good, because I usually only have to get out the leather when I’m doing amputations. Now, this is going to be the last bit… there. You’ll need to come back a few days later to have the stitches removed; I’ll put you on light duty in the meantime. Now… this is going to sting a little.”</i>", parse);
	Text.NL();
	Text.Add("The eagle-morph pours something onto a clean cloth and swabs away; the horse morph screams again, louder than the first.", parse);
	Text.NL();
	Text.Add("<i>“Psh. All right, now, off with you. Maybe the pain will remind you not to risk bursting those stitches.”</i>", parse);
	Text.NL();
	Text.Add("Throwing back the curtains with an elbow, the horse-morph stumbles past you, through the cots, and out of the tent - all while clutching his bloodied arm. Your eyes follow him on his way out, and some of the invalids do the same, craning their necks to watch his passage.", parse);
	Text.NL();
	Text.Add("<i>“Well, that one was certainly one of the louder folks of late. And who might you be?”</i>", parse);
	Text.NL();
	Text.Add("The eagle-morph’s voice is clear and crisp, and you turn to find him staring intently at you with weathered eyes, dousing his hands with clear, strong-smelling liquid from a small pewter jug. A pair of bloodied gloves lie on the table behind him - no doubt he was wearing them while working on the horse-morph - and the coarse cloth vest he has on over his shirt has a few stains in it, too.", parse);
	Text.NL();
	Text.Add("Bit of a messy job he’s doing there. Careful not to appear like you’re staring too much, you introduce yourself.", parse);
	Text.NL();
	Text.Add("<i>“[playername]. I’ll remember it. That said, my name is Aquilius. Now, you don’t look very injured to me, so are you ill?”</i>", parse);
	Text.NL();
	Text.Add("What? No, you aren’t ill, you just-", parse);
	Text.NL();
	Text.Add("<i>“If you’re not injured or ill, then you really don’t have much business in here.”</i> He points up at a sign hanging from one of the tent’s support beams. <i>“And a warning, since you’re a new face. If you’re going to report sick, make sure you’re ill. I can’t stand malingerers.”</i>", parse);
	Text.NL();
	Text.Add("Well excuse me, you were just going to introduce yourself-", parse);
	Text.NL();
	Text.Add("<i>“Yes, you’ve introduced yourself. I’ve also introduced myself. This has been a very good conversation,”</i> Aquilius replies drolly, wiping his hands before corking the flask and putting it away in a pocket. That done, he draws out a beautifully carved wooden case from his shirt’s breast pocket, and from that, a pipe. With no small satisfaction, he sticks it in his beak and lights up, a sweet scent filling the air as he begins to puff away. <i>“If there’s nothing else, there are others who need my time. Have a good day, but please don’t loiter here.”</i>", parse);
	Text.NL();
	Text.Add("With that, he walks away, leaving you to fume.", parse);
	Text.Flush();
	
	world.TimeStep({minute: 30});
	
	Gui.NextPrompt();
}

Scenes.Aquilius.Approach = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	//#If the player is on herbs quest, returns with herbs
	if(aquilius.OnHerbsQuestFinished()) {
		Text.Add("<i>“Ah, you’re back,”</i> Aquilius says, looking up from his work as you approach. <i>“Did you have a productive outing?”</i>", parse);
		Text.NL();
		Text.Add("That’s a way to phrase it. You present him with the armful of flowers, roots, leaves and other assorted plant bits that constitute the results of today’s work, and he begins to sift through them like a chicken scratching at dirt, occasionally discarding a specimen that he doesn’t feel is up to par. Nevertheless, most of what you picked is good enough to satisfy the surgeon, and he gives you a nod as one of his assistants hurries over to pack the lot away.", parse);
		Text.NL();
		Text.Add("<i>“Plenty of sunny days of late,”</i> Aquilius remarks. <i>“We’ll spread them out to dry, they keep pretty well that way. Well, [playername], your help is very much appreciated. Keep it up, and I’m sure everyone around camp will hear of how helpful you’re being.</i>", parse);
		Text.Flush();
		
		outlaws.relation.IncreaseStat(30, 1);
		aquilius.relation.IncreaseStat(100, 2);
		
		aquilius.flags["Herbs"] = Aquilius.Herbs.Known;
		
		//#Set timer on helping out at infirmary for the rest of the day.
		aquilius.helpTimer = aquilius.HelpCooldown();
		
		var item = aquilius.herbIngredient;
		aquilius.herbIngredient = null;
		
		if(item && party.Inv().QueryNum(item)) {
			Text.NL();
			parse["ingredient"] = item.sDesc();
			Text.Add("You note that you have some [ingredient] with you, and remember that Aquilius was on the particular lookout for it. Would you like to give a measure of it to him?", parse);
			Text.Flush();
			
			//[Yes][No]
			var options = new Array();
			options.push({ nameStr : "Yes",
				tooltip : Text.Parse("Yes, hand over a measure of [ingredient].", parse),
				func : function() {
					Text.Clear();
					Text.Add("Digging about in your possessions, your hands close about a measure of [ingredient] and you hand it over to Aquilius without further ado. The surgeon looks slightly surprised at first, then quickly moves to produce a small square of waxed paper to wrap it up in.", parse);
					Text.NL();
					if(aquilius.Relation() >= 50)
						Text.Add("<i>“Excellent work as always, [playername]. I knew I could count on you to go above and beyond the call of duty.”</i>", parse);
					else
						Text.Add("<i>“Oh. You actually managed to find some. I was worried that - never mind. The extra effort’s very much appreciated.”</i>", parse);
					Text.NL();
					Text.Add("Aquilius clicks his beak, finishes wrapping up your gift, then stows it away out of sight. <i>“Well, I promised you a little something, and it’d be remiss for me to go back on my word. Here, have this.”</i> He pushes a small portion of fragrant dried leaves and grasses into your hands, wrapped in that same waxed paper. <i>“My very own blend; you won’t find a more relaxing smoke on the face of Eden. I’m sure you’ll enjoy.”</i>", parse);
					Text.Flush();
					
					party.Inv().RemoveItem(item);
					party.Inv().AddItem(Items.PipeLeaf);
					
					outlaws.relation.IncreaseStat(30, 1);
					aquilius.relation.IncreaseStat(100, 1);
					
					Scenes.Aquilius.Prompt();
				}, enabled : true
			});
			options.push({ nameStr : "No",
				tooltip : "You have better uses for it.",
				func : function() {
					Text.Clear();
					Text.Add("While Aquilius may be in need of it, you decide that you’d rather save the ingredient for your own ends.", parse);
					Text.Flush();
					
					Scenes.Aquilius.Prompt();
				}, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		}
		else
			Scenes.Aquilius.Prompt();
	}
	//#Else If the player is on herbs quest, returns unfinished
	else if(aquilius.OnHerbsQuest()) {
		Text.Add("Aquilius looks up at you, notes your empty hands, then shrugs. <i>“Still here, [playername]? I wouldn’t wait too long to head out into the woods - they can get quite dangerous at night. Best you do all the flower picking while it’s light out.”</i>", parse);
		Text.NL();
		Text.Add("You assure him that you’ll get him his herbs soon enough.", parse);
		Text.Flush();
		Scenes.Aquilius.Prompt();
	}
	else {
		Text.Add("Pushing your way through the rows of cots and their occupants, you approach the surgeon. ", parse);
		var scenes = new EncounterTable();
		
		var day = world.time.hour < 17;
		
		if(day) {
			scenes.AddEnc(function() {
				Text.Add("He’s currently busy with mortar and pestle, pounding away at a mixture of various grasses. As you watch, he mixes the lot with a cupful of warm water, then strains the lot with a fine cloth; the resultant foul-smelling mixture is then poured into a basin of water in which several bandages have been left to soak. Done with this task, he finally turns and pays attention to you.", parse);
			});
			scenes.AddEnc(function() {
				Text.Add("Aquilius is enjoying a quick smoke break, his pipe clenched in his beak as he stares out a window at the rest of the camp. Noticing you watching him, the surgeon removes his pipe and knocks out the ashes with a quick swat of his hand.", parse);
			});
			scenes.AddEnc(function() {
				Text.Add("<i>“You’re not ill. You just overstuffed yourself and lazed about too much, and it’s gotten to you. Eat less and do more useful work, and you’ll be fine.”</i> With a shake of his head, the surgeon sends his current patient storming out of the tent, then turns to you.", parse);
			});
			scenes.AddEnc(function() {
				Text.Add("He’s currently swabbing the operating table with a harsh-smelling mixture, based in alcohol if your nose isn’t wrong. Eyes furrowed and face grim, he doesn’t notice your approach at all, not until the last square inch has been scrubbed to satisfaction. It’s a good fifteen minutes before he’s done, but when he is, he lets out a slow sigh and turns to you.", parse);
			});
		}
		else {
			scenes.AddEnc(function() {
				Text.Add("He’s currently cloistered himself in the back of the tent, leaning back in a chair with his eyes closed and wings folded as he draws deeply from a large, ornate pipe carved from hardwood. Even at this distance, you can smell the psychedelic smoke rising from it - whatever’s in there, it certainly isn’t tobacco. As you approach, though, he opens an eye to regard you, although his gaze is clearly more than a little glazed.", parse);
			});
			scenes.AddEnc(function() {
				Text.Add("Even at this late hour, the surgeon is at work, having picked a handful of yellow mushrooms from the log and drying them on a grill over the low heat of the burner. Odd… come to think of it, you’ve never seen him <i>use</i> the mushrooms for anything.", parse);
				Text.NL();
				Text.Add("He tilts his head to regard you as you draw close.", parse);
			});
			scenes.AddEnc(function() {
				Text.Add("He’s seated in the back, puffing away at a fragrant mix of various flowers and leaves in his pipe, a half-eaten dinner cooling on a small folding table at his side. Perched in his lap is a book - one filled with thin, spidery writing and many sketched diagrams - and it’s from this that he peers up as you approach.", parse);
			});
		}
		scenes.Get();
		
		Text.NL();
		
		if(day) {
			if(aquilius.Relation() >= 75)
				Text.Add("<i>“Oh, it’s you, [playername]. You may linger and watch, so long as you don’t get in anyone’s way.”</i>", parse);
			else if(aquilius.Relation() >= 50)
				Text.Add("<i>“[playername]. I trust you are healthy today? Have you come to help out?”</i>", parse);
			else
				Text.Add("<i>“[playername]. What brings you here today?”</i>", parse);
		}
		else {
			if(aquilius.Relation() >= 75)
				Text.Add("<i>“Welcome, [playername],”<i> Aquilius says with a cordial nod of his head. <i>“I trust that you’ve had a very safe and fruitful day? Not that I have much in the way of entertaining others, but it’s nice to have a pleasant soul to talk to.”</i>", parse);
			else if(aquilius.Relation() >= 50)
				Text.Add("<i>“It’s you, [playername]. What brings you to me at this late hour? I hope you haven’t suffered any hurts.”</i>", parse);
			else
				Text.Add("<i>“Oh. [playername]. For a moment I thought it was…”</i> Aquilius is clearly suppressing a tic in his face. <i>“No, never mind. I don’t usually get visitors at this hour. Is there something you need?”</i>", parse);
		}
		Text.Flush();
		Scenes.Aquilius.Prompt();
	}
}

//TODO
Scenes.Aquilius.Prompt = function() {
	var parse = {
		
	};
	
	//[name]
	var options = new Array();
	options.push({ nameStr : "Appearance",
		tooltip : "Give the good surgeon a look-over.",
		func : Scenes.Aquilius.Appearance, enabled : true
	});
	//Player may only help out once a day. Ish.
	options.push({ nameStr : "Help out",
		tooltip : "Help out at the infirmary.",
		func : Scenes.Aquilius.HelpOut, enabled : !aquilius.OnHerbsQuest()
	});
	/*
	options.push({ nameStr : "name",
		tooltip : "",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
			Text.Flush();
		}, enabled : true
	});
	*/
	Gui.SetButtonsFromList(options, true);
}

Scenes.Aquilius.Appearance = function() {
	var parse = {};
	
	Text.Clear();
	Text.Add("You give the good surgeon a look-over.", parse);
	Text.NL();
	Text.Add("Aquilius is the kind of person who looks comfortable right where he is, in this tent that smells of antiseptic. At just under six feet tall, his shoulders slightly hunched, the eagle-morph is neither here nor there when it comes to build. He’s clearly capable of physical exertion when need be, yet disdainful of it for its own sake.", parse);
	Text.NL();
	Text.Add("Dressed in a thick vest of coarse cloth over a plain cotton shirt, he’s a man of simple tastes. Numerous other such vests lie stacked in a shelf near the back of the tent, which suggests that he doesn’t so much wash these as dispose of them when they get too stained. Even with the outlaws being squeezed for supplies most of the time, it stands to reason - he spends much of his time about the sick, after all. Tough cloth pants and leather boots complete the rest of his ensemble, well-worn and showing their age.", parse);
	Text.NL();
	Text.Add("Your eyes flicker over his, and he meets your gaze evenly, black pupils set in deep amber sclera. It’s a hard look, and he appears to be staring <i>through</i> you, giving you the impression that he’s not all quite there. With a shake of his head, he breaks the gaze and turns back to his duties. ", parse);
	if(world.time.hour < 17)
		Text.Add("The ornate pipe so beloved to him is in its case and wedged in the breast pocket of his shirt, a bulge on his vest betraying its presence. Within easy reach should he need a quick smoke break, a faint scent of aromatic smoke lingers about it, discernable even through the case.", parse);
	else
		Text.Add("Aquilius’ precious pipe is firmly clenched in his beak, a thin wisp of aromatic smoke rising from the bowl as he takes drags from it, the eagle-morph sighing in satisfaction each time he inhales.", parse);
	Text.NL();
	Text.Add("The rest of him, though, is in what might be charitably called “the prime of his life”. Aquilius’ feathers, while mostly a mixture of brown, gold and black, have begun to grey in patches; it’s most obvious in the wings that he usually keeps folded neatly on his back. Contrasting the usual hustle and bustle of the camp, the good surgeon moves with a relaxed demeanor; his hands - which while covered with feathers, are still humanlike - are steady, his motions deliberate and unhurried as he goes about his tasks with practiced ease. What vitality has left the surgeon as the years wear him down has been replaced with experience, and he’s clearly managed to leverage it to its full extent.", parse);
	Text.NL();
	Text.Add("All in all, Aquilius is the very picture of a genial, middle-aged man who’s decided to put down roots, even if they’re not exactly in firm ground.", parse);
	Text.Flush();
}

Scenes.Aquilius.HelpOut = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("You ask Aquilius if there’s anything you can do to help out around the infirmary.", parse);
	Text.NL();
	if(aquilius.helpTimer.Expired()) {
		if(aquilius.flags["Met"] < Aquilius.Met.Helped)
			Text.Add("Aquilius eyes you uncertainly. <i>“I’m not exactly sure, [playername]. After all, I’m ultimately responsible for those under my care, and you’re a bit of an unknown - but on the other hand, it’d be stupid of me to turn away good help. Tell you what - why don’t I get you started on the simple tasks first, then move onto the others when you prove yourself capable of not fouling up?”</i>", parse);
		else
			Text.Add("<i>“There’s always work to be done here; I’ll gladly accept any help you’re willing to offer. What did you have in mind, [playername]?”</i>", parse);
		Text.Flush();
		Scenes.Aquilius.HelpOutPrompt();
	}
	else if(aquilius.QualifiesForAnyJob(player)) {
		Text.Add("<i>“Your thoughtfulness and enthusiasm are appreciated, but I’d rather not get into the habit of relying on others to do my work for me,”</i> Aquilius tells you. <i>“Come back later if you’d like to continue helping out.”</i>", parse);
		Text.Flush();
	}
	else {
		Text.Add("<i>“No, no, no. There’re already enough hands helping out with the menial tasks; too many people trying to do the same thing only ends up in everyone getting in each others’ way. I’m sorry, but unless you have a skilled trade to ply, we’re quite well-staffed here. The thought is appreciated - I’m personally overworked - but more hands to a job doesn’t necessarily mean less work.”</i>", parse);
		Text.Flush();
	}
}

//TODO
Scenes.Aquilius.HelpOutPrompt = function() {
	var parse = {
		playername : player.name
	};
	
	//[name]
	var options = new Array();
	options.push({ nameStr : "Gather herbs",
		tooltip : "Offer to go herb picking.",
		func : function() {
			Text.Clear();
			if(aquilius.flags["Herbs"] < Aquilius.Herbs.Known) {
				Text.Add("<i>“This is the first time you’ve offered to go flower picking for me. Do you know what I’m looking for?”</i>", parse);
				Text.NL();
				Text.Add("You admit that no, you don’t.", parse);
				Text.NL();
				Text.Add("<i>“Canis root, willow bark - I’d rather not strip the trees in camp - feverfew, a few others… if you give me a moment, I’ll have a list written up for you in a flash.”</i>", parse);
				Text.NL();
				Text.Add("Aquilius is as good as his word. He retreats to the back of the infirmary tent, and it’s not long before you’re holding a small scrap of paper with a hastily scrawled list of ingredients on it. Seems like the stereotype about doctors and their handwriting also applies to the good surgeon.", parse);
				Text.NL();
				Text.Add("<i>“One important thing you must note, [playername]. Please refrain from being overzealous in your gathering. While the forest is very kind in sharing its bounty with us, I’d rather not get too ahead and pick the usual herb patches clean. Space for cultivation is very limited -”</i> he points at the few potted plants and mushroom log in the back - <i>“and a lot of my requirements are met from gathering.”</i>", parse);
				Text.NL();
				Text.Add("You reassure Aquilius that you’ll be careful, and prepare to head on out.", parse);
			}
			else {
				Text.Add("<i>“Well, I wouldn’t mind the help. I can’t keep asking Maria to keep an eye out for herbs when she’s supposed to be keeping an eye out for intruders instead; having someone dedicated to the task will take a load off everyone. Since you know what I’m generally after and what precautions to take, I won’t insult your intelligence and will just leave you to it, then.”</i>", parse);
				Text.NL();
				Text.Add("You give Aquilius a nod and prepare to head on out.", parse);
			}
			Text.NL();
			
			parse["ingredient"] = aquilius.SetHerb().sDesc();
			
			Text.Add("<i>“There is one thing. Today, I’m looking out for some [ingredient] in particular. If you could get your hands on some before you come back, I’d be glad to give you a little something in return for the extra effort. Happy hunting.”</i>", parse);
			Text.Flush();
			
			aquilius.flags["Herbs"] = Aquilius.Herbs.OnQuest;
			
			world.TimeStep({minute: 10});
			
			Gui.NextPrompt();
		}, enabled : aquilius.QualifiesForHerbs(player)
	});
	/* TODO
	options.push({ nameStr : "name",
		tooltip : "",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
			Text.Flush();
		}, enabled : true
	});
	 */
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("On second thought, you’ll have to abstain for now.", parse);
		Text.NL();
		Text.Add("<i>“Hrmp, getting my hopes up,”</i> Aquilius grunts surlily.", parse);
		Text.Flush();
		
		Scenes.Aquilius.Prompt();
	});
}

// [Herbs] - Go flower picking like Aquilius asked you to.
Scenes.Aquilius.PickHerbs = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("You set off on your flower hunt, eyes peeled for anything that might interest Aquilius. Happily, your ranger’s training in the lay of the land and its environs serves you well, your sharp gaze roaming from stand to stand and patch to patch as you wander off the beaten trails of the forest in search of the herbs Aquilius needs. ", parse);
	if(world.time.IsDay())
		Text.Add("Shafts of sunlight pierce through the forest’s thick canopy, lighting your way as you pick your way over gnarled roots and thick undergrowth, wandering as deep as you dare without running the risk of getting lost.", parse);
	else
		Text.Add("Shaded during the day, the forest is pitch-black at night. There’s practically no natural light to be had, and even with your ranger’s training the fear of getting lost amidst the trees lurks in the back of your mind, ready to spring out at you at any moment.", parse);
	Text.NL();
	Text.Add("Unseen, things rustle about and above you; you do your best to ignore them and focus on the task at hand. By and large, the task proceeds at a smooth pace - while the forest does not freely give away its treasures, neither is it overly stingy to those who work hard.", parse);
	if(party.Num() > 1) {
		parse["comp"] = party.Num() == 2 ? party.Get(1).name :
		                "your companions";
		Text.Add(" The fact that you have [comp] around to help doesn’t hurt, either.", parse);
	}
	Text.NL();
	Text.Add("Despite the forest being a dangerous place, you’re fortunate enough that nothing jumps you while you’re preoccupied with digging up roots and pulling mushrooms off tree roots. Still, the heat and humidity are beginning to get to you, and constantly wading through the thick, tangled undergrowth is taxing. Eventually, you decide that you’ve had enough, and call it a day.", parse);
	Text.NL();
	Text.Add("With all that nastiness behind you, you sort through today’s pickings - a medley of grasses, roots, bits of bark and the occasional odd mushroom. There’s about enough to fill a hand basket, which should be enough to appease Aquilius for a day’s worth of work; time to head back and see what he has for you.", parse);
	Text.Flush();
	
	world.TimeStep({hour: 5});
	
	aquilius.flags["Herbs"] = Aquilius.Herbs.Finished;
	
	Gui.NextPrompt();
}
