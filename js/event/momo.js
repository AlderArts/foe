/*
 * 
 * Define Momo
 * 
 */

Scenes.Momo = {};

function Momo(storage) {
	Entity.call(this);
	this.ID = "momo";
	
	// Character stats
	this.name = "Momo";
	
	this.avatar.combat = Images.momo;
	
	// TODO Stats
	this.maxHp.base        = 30;
	this.maxSp.base        = 40;
	this.maxLust.base      = 20;
	// Main stats
	this.strength.base     = 10;
	this.stamina.base      = 11;
	this.dexterity.base    = 22;
	this.intelligence.base = 17;
	this.spirit.base       = 19;
	this.libido.base       = 18;
	this.charisma.base     = 16;
	
	this.level = 1;
	this.sexlevel = 1;
	
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 6;
	this.body.SetRace(Race.Dragon);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"]     = Momo.Met.NotMet;
	this.flags["tSelf"]   = 0;
	this.flags["tFamily"] = 0;
	this.flags["tCook"]   = Momo.TalkCook.First;
	this.flags["tSkills"] = 0;
	
	this.wanderTimer = new Time();

	if(storage) this.FromStorage(storage);
}
Momo.prototype = new Entity();
Momo.prototype.constructor = Momo;

Momo.Met = {
	NotMet    : 0,
	Wandering : 1,
	CampFirst : 2,
	Camp      : 3,
	Follower  : 4,
	Ascended  : 5
};

Momo.TalkCook = {
	First       : 0,
	BigFamily   : 1,
	SmallFamily : 2,
	OnlyChild   : 3
};

Momo.prototype.Wandering = function() {
	return this.flags["Met"] < Momo.Met.CampFirst && this.wanderTimer.Expired();
}
Momo.prototype.AtCamp = function() {
	return this.flags["Met"] >= Momo.Met.CampFirst && this.flags["Met"] <= Momo.Met.Camp;
}
Momo.prototype.Ascended = function() {
	return this.flags["Met"] >= Momo.Met.Ascended;
}
Momo.prototype.IsFollower = function() {
	return this.flags["Met"] >= Momo.Met.Follower;
}

Momo.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
	
	this.wanderTimer.Dec(step);
}

Momo.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	this.body.FromStorage(storage.body);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
	
	//TODO combat stats
	
	this.wanderTimer.FromStorage(storage.wTime);
}

Momo.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	this.SaveBodyPartial(storage, {ass: true, vag: true});
	
	this.SaveFlags(storage);
	this.SaveSexFlags(storage);
	
	storage.wTime = this.wanderTimer.ToStorage();
	
	return storage;
}

// Schedule
Momo.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Plains.Nomads.Fireplace && this.AtCamp() && world.time.hour >= 4 && world.time.hour < 21) {
		return true;
	}
	return false;
}

Scenes.Momo.MomoEnc = function() {
	if(momo.flags["Met"] == Momo.Met.NotMet)
		Scenes.Momo.FindingMomo();
	else
		Scenes.Momo.WanderingMomo();
}

Scenes.Momo.FindingMomo = function() {
	var parse = {
		playername : player.name
	};
	
	parse["area"] = party.location == world.loc.Forest.Outskirts ? "forest" :
	                party.location == world.loc.Desert.Drylands  ? "desert" :
	                party.location == world.loc.Highlands.Hills  ? "highlands" :
	                party.location == world.loc.Lake.Shore       ? "lake" : "plains";
	
	Text.Clear();
	Text.Add("As you explore the [area], you come upon a curious sight. There appears to be a woman sitting down on the ground; she’s slumped over and hugging her knees. You can’t make out much detail at this time, but you do note that she seems to bear a reptilian tail and horns. You decide to approach.", parse);
	Text.NL();
	Text.Add("The feminine figure stirs as you come closer - evidently having heard you - lifting her head and partially turning to reveal attractive female, human-like features. Two sapphire blue eyes blink as she takes in your form, unconsciously lifting a hand to brush aside a lock of wavy blonde hair that's fallen over her face.", parse);
	Text.NL();
	Text.Add("<i>“Oh! Ah - Hello? Are you from around these parts?”</i> she asks politely, a faint but friendly smile on her lips. <i>“I'm terribly sorry to bother you, I've just gotten myself a little lost...”</i> A deep, sonorous rumble emanates from her midriff, making her pale cheeks flush pink in embarrassment, a hand going to her belly. <i>“Sorry, I'm hungry,”</i> she adds unnecessarily.", parse);
	Text.NL();
	Text.Add("You do your best to stifle your laughter; if she’s just feigning being harmless, she’s a pretty damn good actor. Curious, you ask her what she’s doing out all alone in a place like this.", parse);
	Text.NL();
	Text.Add("Smiling pleasantly, the strange tailed woman rolls forward slightly, pushing herself up off the ground and taking to her feet. Standing about five and three quarters feet tall, she's a pretty tall girl. This close to her, you can see another oddity on her body besides the tail and the horns and the scaly patches - small, dragon-like wings poke through slits in the back of her shirt. They're tiny things, maybe about a handspan in length and width, but perfectly formed. All in all, she looks like some strange melding of human girl and dragon.", parse);
	Text.NL();
	Text.Add("If the stranger notices you studying her body, she doesn’t mention it. <i>“I've been out traveling for a while - not heading anywhere in particular, just traveling for the sake of traveling, you know? I set my supplies down a while ago to go hunting - spotted a nice, juicy rabbit that I wanted to catch for dinner.”</i>", parse);
	Text.NL();
	Text.Add("She sighs and shakes her head, looking embarrassed as she confesses, <i>“But he got away from me, and by the time I gave up, I couldn't remember where I'd come from. So I've been wandering around ever since.”</i> She shrugs haplessly at the admission. <i>“First couple of hours, I was trying to find my things. After that, I was looking for someone who could help me. You're the first person I've seen in the last day.”</i>", parse);
	Text.NL();
	Text.Add("<i>“So... I don't suppose you know some place where a girl can get some food around here, do you? I don't have a lot of money, but I'd be happy to offer my services in exchange,”</i> she adds, looking you over with a hopeful expression.", parse);
	Text.NL();
	Text.Add("Services?", parse);
	Text.NL();
	Text.Add("<i>“Yes! I’m a cook!”</i> she boasts proudly.", parse);
	Text.NL();
	Text.Add("...Why would a cook be here, of all places? You ask yourself, but nevermind. You should still figure out what to do with her.", parse);
	Text.Flush();
	
	//[HelpHer][LeaveHer]
	var options = new Array();
	options.push({ nameStr : "Help her",
		func : function() {
			Text.Clear();
			Text.Add("Seeing no reason not to aid her, you decide to show her to the Nomads’ camp. While you can’t really help her yourself, you’re pretty sure someone there will be able to.", parse);
			Text.NL();
			Text.Add("<i>“That would be perfect! Thank you so much!”</i> she says enthusiastically. <i>“Maybe they need a new camp cook!”</i> she suggests excitedly. <i>“They might even have new recipes for me to learn. Come on, let's - oh!”</i> She stops suddenly, slapping her forehead with her palm as an expression of realization dawns on her face. <i>“Silly thing, I got so worked up that I went and forgot my manners - my mother would have spanked me for that back home,”</i> she giggles sheepishly. <i>“My name's Monareth Kindling - but my friends call me Momo. What's your name?”</i> she asks, extending a hand for you to shake.", parse);
			Text.NL();
			Text.Add("You take her hand and offer her your name.", parse);
			Text.NL();
			Text.Add("<i>“Nice to meet you, [playername],”</i> she cheerfully declares, giving your hand a firm squeeze and a few pumps before letting you go. <i>“So, where's this camp you were telling me about?”</i>", parse);
			Text.NL();
			Text.Add("You assure her that it isn’t too far from here; if she’ll follow you, the both of you will be there soon.", parse);
			Text.NL();
			Text.Add("<i>“Okey-dokey!”</i>", parse);
			Text.NL();
			Text.Add("With the beaming dragon-girl hot on your trail, you set about confidently, retracing your steps.", parse);
			Text.Flush();
			
			momo.flags["Met"] = Momo.Met.CampFirst;
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Plains.Nomads.Fireplace, {hour : 1});
			});
		}, enabled : true,
		tooltip : "Take the strange woman back to the Nomads’ camp, she clearly needs the help."
	});
	options.push({ nameStr : "Leave her",
		func : function() {
			Text.Clear();
			Text.Add("With a shake of your head, you tell her that she can forget it; she’s probably just trying to lead you into an ambush.", parse);
			Text.NL();
			Text.Add("<i>“B-but I’m not!”</i> she protests feebly, eyes wide in shock, mouth actually hanging open in her surprise at the accusation.", parse);
			Text.NL();
			Text.Add("You cut her off, saying it doesn’t matter. Either she’s trying to lull you into a false sense of security, or else she’s an idiot; in any case, you don’t want anything to do with her.", parse);
			Text.NL();
			Text.Add("The dragon-girl’s face flushes red, brows furrowing in rage, lips pressing together into thin lines, fingers curling into fists that quiver with her emotion. <i>”You are a jerk!”</i> she proclaims angrily. <i>”You don’t want to help me? Fine! I’ll find someone who does!”</i>", parse);
			Text.NL();
			Text.Add("With an indignant “hmph!”, she sticks her nose up in the air, a poor imitation of a regal mannerism, and spins forcefully on her heel. You narrowly avoid her tail slapping you across the face as it 'coincidentally' whips through the air behind her, whereupon she storms off into the wilderness.", parse);
			Text.NL();
			Text.Add("Shaking your head, you turn around and head back to the Nomads’ camp. You run into all kinds of lunatics out on the roads it looks like.", parse);
			Text.Flush();
			
			momo.flags["Met"] = Momo.Met.Wandering;
			
			world.TimeStep({hour: 1});
			
			momo.wanderTimer = new Time(0, 0, 3, 0, 0);
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "You’re not going to trust some random stranger with the location of the Nomads’ camp."
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Momo.WanderingMomo = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("Off in the distance, you spot a familiar blur. Upon closer inspection, you realize that it’s that dragon girl you met a while ago. Seems like she’s still lost…", parse);
	Text.Flush();
	
	//[HelpHer][Leave]
	var options = new Array();
	options.push({ nameStr : "Help her",
		func : function() {
			Text.Clear();
			Text.Add("Heaving a sigh, you decide to approach her.", parse);
			Text.NL();
			Text.Add("The dragon-girl has her back to you as you approach, but you see her twitch, little wings flapping as she clearly hears you. <i>“Oh, hi! Can you help... oh, it’s you,”</i> she notes, her initial tone of excited relief changing to a grumpy, sullen groan as she excitedly turns around, only to see you standing before. It’s clear she recognizes you. With a pout, she folds her arms over her chest and sulkily asks, <i>“What do you want?”</i>", parse);
			Text.NL();
			Text.Add("You simply tell her that you’ve decided to help her.", parse);
			Text.NL();
			Text.Add("She blinks in surprise; that’s clearly not what she expected to hear from you. <i>“I... um, okay. Thanks, I guess?”</i> Her tone is tentative as if she’s not really sure what to say. She shakes her head as if clearing her mind of whatever mental fog has befallen it and looks at you, this time with sincere hope in her eyes. <i>“Sorry, that was rude of me - you really want to help? Please, I’d be most grateful!”</i>", parse);
			Text.NL();
			Text.Add("Of course, that’s what you said, wasn’t it?", parse);
			Text.NL();
			Text.Add("Her eyes go wide, face lighting up in joy as she excitedly clasps her hands together. <i>“Oh, thank you, thank you! I was wondering if I’d ever find someone to help me...”</i>", parse);
			Text.NL();
			Text.Add("You introduce yourself to her, asking her what’s her name.", parse);
			Text.NL();
			Text.Add("<i>“Monareth Kindling! But please, call me Momo - all my friends do!”</i> The smile she gives you as she says this is open, honest and sincere, eyes closing happily and a grin completely devoid of guile spreading wide over her lips.", parse);
			Text.NL();
			Text.Add("Well, it’s nice to finally meet her. You offer her a handshake and inform her that the encampment isn’t far.", parse);
			Text.NL();
			Text.Add("<i>“Then lead the way, [playername]!”</i> she chirps merrily, shaking your hand with a powerful set of pumps - she’s got quite a grip, actually.", parse);
			Text.NL();
			Text.Add("With the beaming dragon-girl hot on your trail, you set about confidently, retracing your steps.", parse);
			Text.Flush();
			
			momo.flags["Met"] = Momo.Met.CampFirst;
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Plains.Nomads.Fireplace, {hour : 1});
			});
		}, enabled : true,
		tooltip : "Let your pity win over and help the girl."
	});
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			Text.Add("She mustn’t have noticed you yet, perfect. You’d rather avoid contact with her, so you walk away, leaving her to her own devices.", parse);
			Text.Flush();
			
			world.TimeStep({minute: 10});
			
			momo.wanderTimer = new Time(0, 0, 3, 0, 0);
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "You’d best not get involved with her any further..."
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Momo.Interact = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	if(momo.flags["Met"] <= Momo.Met.CampFirst) {
		momo.flags["Met"] = Momo.Met.Camp;
		Text.Add("<i>“Oh, come on! Where is it? Couldn’t just get up and walk away!”</i>", parse);
		Text.NL();
		Text.Add("As you approach the tent by the fire where Momo now lives, you hear the dragonette complaining about something. You see a great variety of pots, pans and other cooking implements scattered around the entry into the tent, whilst Momo herself is currently bent over rummaging through something in its interior. Her hips wriggle and twitch restlessly as she browses, making her ass jiggle quite nicely. The dragon-girl’s long, swaying tail above it draws your eyes to her shapely rump.", parse);
		Text.NL();
		Text.Add("<i>“Ahah! There you are, you little rascal!”</i> Humming to herself in satisfaction, Momo’s top half emerges from the tent, half-turning to reveal a large, worn-looking journal clasped in her arms. Upon seeing you, she grins widely in delight.", parse);
		Text.NL();
		Text.Add("<i>“Why, hello, [playername]! Welcome to my little kitchen... well, kitchen to be,”</i> she amends herself chipperly, nodding toward the various utensils scattered around.  <i>“That nice old man said he’d let me set up shop here... course, that means I gotta set up the shop first.”</i>", parse);
		Text.NL();
		Text.Add("You recall she mentioned in passing when you first met that she’s a cook.", parse);
		Text.NL();
		Text.Add("<i>“What? You don’t believe me?”</i> There’s a playful smile on the dragon-girl’s face as she says this. <i>“I’ll have you know I trained at the Golden Belly chef’s guild, under Master Aleegro himself! I learned patissiere from the esteemed Munchausen, sauceries from the famed Lionel, and vegetable preparation from Madame Gwendolyn.”</i>", parse);
		Text.NL();
		Text.Add("You just listen as Momo throws a string of names you’ve never heard of before and boasts proudly of her training as a chef. Eventually, she tires of her boasting and regards you with a smile. Before you can so much as utter a single syllable, she’s already started again.", parse);
		Text.NL();
		Text.Add("<i>“But of course, I need to show you what I’m capable of! I mean, any idiot can just run their mouth off; the proof is in the pudding, as we said back at the guild.”</i>", parse);
		Text.NL();
		Text.Add("With a cheerful smile, Momo starts to grab her utensils, barely pausing to lay the book she was so desperate to find earlier aside where it won’t get in the way. The first thing she grabs is a large pot, which she fills with water from a nearby bucket. A metal grill on legs is placed over the fire, some extra logs added to stoke it up, and then she places the water-filled pot atop it.", parse);
		Text.NL();
		Text.Add("<i>“Always handy to boil the water first,”</i> she quips to you in idle explanation before snapping her attention back to the task she has at hand.", parse);
		Text.NL();
		Text.Add("<i>“Let’s see... pasta, pasta, pasta, where did I put it? I didn’t throw it all out because of weevils, did I...? Ah! There we are! Now, meat, butter, garlic, onions, capsicum, carrot, celery... mushrooms? Eh, why not? Can’t do any harm, can they? Tomatoes... oh, ew!”</i>", parse);
		Text.NL();
		Text.Add("One tomato has just burst in Momo’s hand, and she grimaces as she flicks the pulped fruit from her fingers. <i>“Don’t tell me they’re all... phew, no, just that one; getting a bit squashy, though, so good thing I’m making spaghetti while I can.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Now, was it the tomatoes that go on first...? No, no, no, use your head, you ninny! Tomatoes cook really quickly; it’ll burn first. Get your other vegetables on first.”</i>", parse);
		Text.NL();
		Text.Add("Bustling briskly along, she sets up her vegetables on a cutting board and then starts to rummage amongst her gear yet again. To your bemusement, she pulls out a bottle full of some sort of potion, which she pours generously over her hands before awkwardly holding it in her armpit and rubbing her hands together. She catches you looking and grins innocently.", parse);
		Text.NL();
		Text.Add("<i>“Well, since I come with knives built in...”</i>", parse);
		Text.NL();
		Text.Add("She rinses her hands off in another bucket of water and then approaches the vegetables. True to her words, they slice into the vegetables almost effortlessly, nimbly stripping away leaves, peels, stems and other inedible pieces of the food. Pushing her scraps aside, she starts to scratch and claw, peeling off thin, fine strips of everything with each nimble flick of her nails.", parse);
		Text.NL();
		Text.Add("<i>“Vegetables ready, now where’d I - whoops!”</i> She casts a guilty glance at a kettle she just knocked over with her tail. <i>“Still do that, after all these years... ooh! There’s my frying pan!”</i>", parse);
		Text.NL();
		Text.Add("Cheerfully, she snatches up the deep-dished skillet and starts to rub the bottom with butter before she places it over the fire. As the butter starts to bubble, she brings over the cutting board and starts pushing the vegetables inside of it until the last scraps have tumbled in and are sizzling away.", parse);
		Text.NL();
		Text.Add("<i>“There we are... but why do I feel I’m missing something?”</i> Her fingers flex as if she is stopping herself from tapping her chin in thought. Her eyes flick across the disorganized mess of her kitchen, then light up. <i>“Garlic!”</i>", parse);
		Text.NL();
		Text.Add("She snatches what looks like a quarter of a bulb and strips off its peel, then hesitates for a moment. <i>“...Do I need this much? ...Ah, what's the worst that could happen?”</i> With that, she dances nimbly back over to the pan and crushes the garlic, kneading it between her fingers so that juice and pulped vegetable falls into the frying mix.", parse);
		Text.NL();
		Text.Add("Humming in satisfaction, she grabs a wooden spoon and starts to stir with smooth, even strokes, nimbly turning and shifting the vegetables so that they cook evenly.", parse);
		Text.NL();
		Text.Add("Seeing this, you decide to settle down and make yourself comfortable. This is going to take a little while...", parse);
		Text.NL();
		Text.Add("Once she judges the vegetables cooked, Momo grabs some mince, sniffing it inquisitively, then scooping a small piece of raw meat into her mouth. Her face contorts in disgust and she spits. <i>“Yep, that’s still edible,”</i> she confirms to you. Then she unceremoniously carries it over and adds it to the frying pan, carefully stirring it into the seared vegetable-stuff to let it brown.", parse);
		Text.NL();
		Text.Add("Next go the tomatoes, which she painstakingly skins - biting back a few profanities that you can just make out - before gleefully crushing them into the sauce with her bare hands, eyes wide with childish glee and giggling as they squish between her fingers.", parse);
		Text.NL();
		Text.Add("<i>“Okey-dokey! Now we just simmer that and pop the pasta in to boil,”</i> she notes, already tipping the dried noodles into the bubbling pot of water. <i>“Thank you for waiting so patiently, [playername]; my siblings would be bugging me all the time about when dinner will be ready. Just a little longer and it’ll be all ready for you, I promise.”</i>", parse);
		Text.NL();
		Text.Add("True to her words, soon after she is proudly passing you a plate of spaghetti noodles in her quite literally handmade bolognaise sauce, offering you a spork and a knife with an expectant look.", parse);
		Text.NL();
		Text.Add("You eye the dish she’s just served you. It looks fine, but you’re not sure you trust her culinary skills just yet… well, they say you only live once, right? Steeling yourself, you stab the pasta and roll up a few strands then pop them into your mouth.", parse);
		Text.NL();
		Text.Add("Hmm… hmm! Not bad! You eagerly grab another sporkful and eat it with gusto.", parse);
		Text.NL();
		Text.Add("Momo grins widely at the sight of you tucking in, arms folding themselves triumphantly over her chest, tail swishing merrily. It’s clear she never doubted you’d like it for a moment. <i>“I admit, there’s limits to what I can do with just a campfire and the stuff I have, but even so, once I have everything set up, I’ll be able to cook all kinds of tasty, nutritious meals! Just drop on by whenever you’re feeling peckish and I’ll be happy to rustle up something to fill your belly; like all good chefs, I get up early and go to bed late, so don’t be shy, okay?”</i>", parse);
		Text.NL();
		Text.Add("You’ll remember that. You thank her for the meal and pass her the dish, bidding her farewell for the moment.", parse);
		Text.NL();
		Text.Add("<i>“See you later, [playername]! Hmm... that smells pretty good; maybe I should have a bowl myself...”</i>", parse);
		Text.Flush();
		
		world.TimeStep({hour: 1});
		
		Gui.NextPrompt();
	}
	else {
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("Momo is lounging on a spare blanket, laid out in an out-of-the-way patch of sunlight, basking in the sunlight like a great lizard. As she hears you approach, though, she sits up and rises to her feet, smiling as she does.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("Momo is busy with something near the burnt-down coals of the campfire. As you get closer, you can see that she is sweeping the ashes and coals aside with her bare hands, the tough scales clearly unbothered by the heat. She digs out a camping oven and pulls it aside, opening the lid - whatever's in there smells good. Placing it down to cool, she stands up and nonchalantly dusts off her hands, smiling at you.", parse);
		}, 1.0, function() { return world.time.hour < 19; });
		scenes.AddEnc(function() {
			Text.Add("Momo is leisurely stirring some kind of stew in a pot hung low over the fire. It's evidently merely simmering, considering that she doesn't hesitate to place the spoon aside and move to join you.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			if(Math.random() < 0.5) {
				parse["hisher"] = "his";
				parse["himher"] = "him";
			}
			else {
				parse["hisher"] = "her";
				parse["himher"] = "her";
			}
			Text.Add("One of the many residents of the camp is already there, chattering away with Momo - from what you overhear as you approach, they're discussing various recipes and cooking tips. Seeing you, the nomad finishes [hisher] discussion and leaves, Momo thanking [himher] before turning to greet you.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("Momo is seated by the fire, a great, tattered-looking journal open on her knees as she pours industriously over its contents. As you approach, she closes it and carefully puts it aside before standing up, a welcoming smile on her face.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("Momo has a huge, tattered-looking journal draped carefully over her knees and is busily scribbling through it. She glances aside at you, but doesn't stop what she's doing. <i>“Just a moment, please,”</i> she begs you, and you wait patiently as she finishes jotting down whatever she is writing, marks her place, and sets the book aside before standing up.", parse);
		}, 1.0, function() { return true; });
		
		scenes.Get();
		
		Text.NL();
		Text.Add("<i>“Well, hello there, [playername]! What can I do for you?”</i> she asks happily, a bright smile on her face.", parse);
		Text.Flush();
		
		Scenes.Momo.Prompt();
	}
}

world.loc.Plains.Nomads.Fireplace.events.push(new Link(
	"Momo", 
	function() { return momo.IsAtLocation(world.loc.Plains.Nomads.Fireplace); }, true,
	function() {
		if(momo.AtCamp()) {
			Text.Add("A rather tatty tent has been set up close by the central cookfires for Momo, the dragon-girl.");
			if(!momo.IsAtLocation())
				Text.Add(" The tent's flaps are closed, its owner having retired for the night.");
			Text.NL();
		}
	},
	Scenes.Momo.Interact
));

//TODO
Scenes.Momo.Prompt = function() {
	var parse = {
		playername : player.name
	};
	
	//[Talk] [Cook] [Flirt]
	var options = new Array();
	options.push({ nameStr : "Talk",
		func : function() {
			Text.Clear();
			Text.Add(" <i>“You'd like to talk?”</i> Momo repeats, furrowing her brow curiously at the notion. When you nod your head, she beams in delight.  <i>“Why, certainly! I'd love to talk, [playername] - what's on your mind?”</i>", parse);
			Text.Flush();
			
			Scenes.Momo.TalkPrompt();
		}, enabled : true,
		tooltip : "Why not talk with Momo for a while?"
	});
	options.push({ nameStr : "Cook",
		func : function() {
			Text.Clear();
			Text.Add("<i>“You want me to cook you something? Why, sure! Be happy to!”</i> she smiles proudly. <i>“Anything in particular you wanted to eat? Something nice and tasty, to give you a recharge? Or perhaps you want me to do a little gastronomic magic?”</i> she suggests with a mischievous grin.", parse);
			Text.Flush();
			
			Scenes.Momo.CookPrompt();
		}, enabled : true,
		tooltip : "Ask Momo to cook you something."
	});
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
	Gui.SetButtonsFromList(options, true, PrintDefaultOptions);
}

Scenes.Momo.CookPrompt = function() {
	var parse = {
		playername : player.name,
		girlMorph  : momo.Ascended() ? "morph" : "girl",
		dragonette : momo.Ascended() ? "dragon" : "dragonette",
		guyGal : player.mfTrue("guy", "gal")
	};
	
	//[Nice Meal][Gastroalchemy][Experiment]
	var options = new Array();
	options.push({ nameStr : "Nice Meal",
		func : function() {
			Text.Clear();
			Text.Add("<i>“One hearty, wholesome, filling meal coming right up,”</i> the chef declares proudly, puffing out her ample chest for emphasis. <i>“Just take a seat over there and be patient, I’ll have something whipped up for you in a jiffy,”</i> she assures you, already starting to gather ingredients and utensils for her latest dish.", parse);
			Text.NL();
			
			var tempParty = [player];
			var num = 2;
			for(var i=1, j=party.Num(); i<j; ++i) {
				var c = party.Get(i);
				if(c == momo)
					num = 3;
				else
					tempParty.push(c);					
			}
			if(num == 3)
				tempParty.push(momo);
			
			if(tempParty.length == num)
				parse["comp"] = " and " + tempParty[1].name;
			else if(tempParty.length > num)
				parse["comp"] = " and your companions";
			else
				parse["comp"] = "";
			parse["all"] = tempParty.length > num ? " all" : "";
			parse["partynumber"] = Text.NumToText(tempParty.length);
			parse["s"] = tempParty.length > 1 ? "s" : "";
			
			Text.Add("You[comp] follow her lead, settling down as you watch the [dragonette] move about setting up a small fire to cook. She ensures that the flames won’t spread and promptly ignites it with a small puff of fire. She smiles as the fire gets going and begins cooking, the delicious scent of cooked food wafting around you within instants.", parse);
			Text.NL();
			if(world.time.hour >= 6 && world.time.hour < 11)
				Text.Add("When she’s ready, Momo approaches you with a beaming smile, bearing [partynumber] bowl[s] from which steam is gently wafting, placing them before you[comp] along with serving spoons. <i>“Oatmeal, just like we used to have it back on the farm; plenty of mixed, dried fruit, a good dollop of honey, and a little milk to make it extra creamy,”</i> she brags. <i>“Just the sort of thing to give you the energy for a hard day.”</i>", parse);
			else if(world.time.hour >= 11 && world.time.hour < 19)
				Text.Add("Momo returns to your side bearing a massive platter piled with sandwiches of all kinds, which she places where you[comp] can easily reach it. <i>“A little variety makes even the simple things more fun,”</i> she notes happily. <i>“Bon appetit.”</i>", parse);
			else {
				if(tempParty.length >= num)
					parse["comp2"] = Text.Parse(" She wastes no time in doling up a serving for [comp] as well.", {comp: tempParty.length == num ? tempParty[1].name : "your companions"});
				else
					parse["comp2"] = "";
				Text.Add("At last, Momo approaches you[all], carrying a huge iron pot with her. She places a serving bowl and a spoon and fork before you, then starts ladling out the contents: a hearty stew-like meal of fried beans, bacon, mushrooms, jerky strips, onions, carrots, potatoes and other assorted pieces, all bubbling in thick gravy.[comp2] <i>“Dad’s own special potluck recipe,”</i> she notes proudly, a wistful smile on her lips. <i>“Go on, dig in before it gets cold,”</i> she encourages you.", parse);
			}
			Text.Add(" You quickly wolf down the offered meal, praising Momo’s culinary skills.", parse);
			Text.NL();
			Text.Add("The [dragonette] beams proudly, chest puffed out unconsciously and tail wagging in her delight at your appreciation of her efforts. <i>“Why, thank you kindly, [playername],”</i> she giggles with delight.", parse);
			Text.NL();
			Text.Add("By the time you’re done, there’s not even a crumb left over. You pat your full belly and sigh. That sure hit the spot - you feel revitalized. With a smile, you thank Momo for the great meal.", parse);
			Text.NL();
			Text.Add("<i>“It was my pleasure, sugar; I love a [guyGal] who can appreciate good cooking,”</i> Momo replies, tail flicking to and fro in her pleasure, a satisfied grin on her face. <i>“Now, don’t worry about the mess, I’ll take care of that myself. But if you’re ever hungry, please, drop on by - my kitchen’s always open, especially for you,”</i> she assures you, already moving to collect her utensils.", parse);
			Text.Flush();
			
			world.TimeStep({hour: 1});
			
			for(var i = 0; i < tempParty.length; ++i) {
				var c = tempParty[i];
				c.AddHPFraction(0.3);
				c.AddSPFraction(0.3);
				Status.Full(c, {hours: 8, exp: 1.1});
			}
			
			Scenes.Momo.Prompt();
		}, enabled : true,
		tooltip : "Momo will prepare a delicious meal to replenish your energies and restore your vitality."
	});
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
	Gui.SetButtonsFromList(options, true, Scenes.Momo.Prompt);
}

Scenes.Momo.TalkPrompt = function() {
	var parse = {
		playername : player.name,
		girlMorph  : momo.Ascended() ? "morph" : "girl",
		dragonette : momo.Ascended() ? "dragon" : "dragonette"
	};
	parse = player.ParserTags(parse);
	//[Chat] [Herself] [Family] [Cooking] [Skills]
	var options = new Array();
	options.push({ nameStr : "Chat",
		func : function() {
			Text.Clear();
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("<i>“The oddest thing I encountered on my travels? Hmm...”</i> Momo trails off, looking thoughtful as she rubs under her chin with one hand.  <i>“Well, a lot of places I went to recently had these great big signs scattered all over the place. They all looked important, but they all said the same thing. In big block-print letters, they all said 'Placeholder'... now, whyever would someone be running around sticking up signs like that? What's supposed to be there? ”</i> Momo wonders, giving you a quizzical expression as if hoping you might know the answer.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Is there something I particularly like to cook?”</i> Momo repeats. Without hesitation, she grins broadly and states,  <i>“Anything that's got peaches in it - especially if it's a pastry, or has sugar or cream, mm-hmm,”</i> she licks her lips with a rather inhuman-looking tongue, lost in memories of meals long-eaten. <i>“My family had this huge peach orchard on the farm, and every year I used to harvest the biggest, sweetest, juiciest peaches there... oh, I just <b>loved</b> it! I would eat and eat until my belly felt like it was going to burst,”</i> she pats her stomach with both hands as if in emphasis.", parse);
				Text.NL()
				Text.Add("<i>“Peaches and cream, peach pie, peach cobbler, peach crumble, peach cake, peach syrup, peach wine...”</i> She suddenly trails off in thought. <i>“You know, I don't remember if I ever really did tried fried peach blossom salad, or if that was just a dream,”</i> she comments idly.", parse);
				Text.NL()
				Text.Add("You briefly consider interrupting her peach-induced reverie, but you doubt she’s even aware of your presence...", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Do I enjoy traveling? Oh, yes, I certainly do!”</i> she gushes, nodding her head for emphasis. <i>“There's so many fascinating places to go, foods to eat, and people to talk to - that's what I really love about traveling, actually: the food and the people.”</i>", parse);
				Text.NL()
				Text.Add("<i>“Oh, some people might be nasty and horrible - like those savages who wanted to chop off my tail and fry it because they thought it'd be some kind of delicacy,”</i> she indignantly curls her prehensile appendage around her hip for protection at the thought, <i>“Or those suspicious people who ran me out of town when I asked about their cake recipe - but for the most part, the people I meet are just lovely to talk to. Like you!”</i> she giggles, grinning you a beaming smile.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“What foods don't I like? That's easy - seafood,”</i> she replies, gagging at the thought. <i>“I mean fish, crabs, shellfish - I hate the smell, I hate the feel, and I certainly can't stand the taste,”</i> she shudders.", parse);
				Text.NL()
				Text.Add("<i>“Nothing, absolutely nothing, makes me sicker than actually eating fish - I can prepare it, if I absolutely have to, but the thought of actually eating it...”</i> she chokes and slaps a hand over her mouth, pointedly looking away from you until she manages to suppress her gag reflex.", parse);
				Text.NL()
				Text.Add("<i>“Yeah, I don't like fish. Other than that...? Probably boiled cabbage. It's not so bad fried up with bacon, onions, sausage, and cheese - like Dad used to make - but boiled cabbage is just... bleugh. Maybe it's because of the smell...”</i> she wonders, tapping her chin contemplatively.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Do I hunt and forage often? Oh, yes, whenever I have the time!”</i> she replies with a smile. <i>“Only thing better than homegrown ingredients are things you took from nature. Nothing like running down a deer or snaring yourself a rabbit to add that bit of extra spice to the meat, I think, and wild picked fruits, herbs, vegetables, they all just taste so much nicer than the market bought ones. Maybe it's because you know that you got them yourself, I don't know. I always go out and get my own ingredients when I can - used to love slipping away to join my brothers or mother hunting back on the farm.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Meat or veg? Well...”</i> she trails off contemplatively. <i>“I know that veggies are supposed to be better for you, and I certainly know enough recipes to know they can be tasty, but honestly? I'm a carnivore at heart. I <b>love</b> eating meat. I swear, I'd go crazy if you tried to put me on a low-meat diet,”</i> she shakes her head at the thought.", parse);
			}, 1.0, function() { return true; });
			
			scenes.Get();
			Text.Flush();
			
			world.TimeStep({minute: 15});
			
			momo.relation.IncreaseStat(25, 2);
			
			Scenes.Momo.TalkPrompt();
		}, enabled : true,
		tooltip : "Just have a nice chat with the pretty dragon-girl."
	});
	options.push({ nameStr : "Herself",
		func : function() {
			Text.Clear();
			Text.Add("<i>“You wanna know about little old me?”</i> Momo asks, fingers pressed against her ample chest, an exaggerated look of surprise on her features. <i>“Well, aren't you just the charmer?”</i> she playfully notes. <i>“Okay, it's not really anything exciting, but... I'm Monareth Kindling, or Momo to my friends. I'm twenty-five years old, and I come from the... was it northwestern parts of the country? I don't recall,”</i> she confesses, looking a little sheepish as she admits that.", parse);
			Text.NL();
			Text.Add("Shaking the matter off with a glib smile, she continues, <i>“The name is something of a giveaway, but I'm part of the Kindling family, an old farming family from out that way. It's a family business, and business is booming... then again, so's the family,”</i> she giggles. <i>“I'm the third of thirteen kids - I have six sisters and six brothers... or was it seven sisters and five brothers?”</i> she muses, looking a little upset that she can't seem to recall the precise details.", parse);
			Text.NL();
			Text.Add("...She can’t even recall basic details about her own family? Just how airheaded <b>is</b> she? Still, you resolve not to say anything and motion for her to keep going. She’s from a farm, so what exactly are they known for? You admit that you aren’t exactly from around <i>here</i> so you’re unfamiliar with the name.", parse);
			Text.NL();
			Text.Add("<i>“Well, we're known for a lot of things, really - we harvest livestock, sell wool, milk, meat and eggs, and fruits and vegetables... we do a lot of different kinds of farming,”</i> Momo explains, chest puffed out with pride as she does so. She then looks thoughtful, rubbing her chin. <i>“Of course, I guess what we're most famous for is our dragon blood...”</i> she slowly admits.", parse);
			Text.NL();
			Text.Add("Dragon blood? You ask her to elaborate on that. Sure, she looks dragony enough, but she means to say it’s an entire farm run by half-dragons like herself?", parse);
			Text.NL();
			Text.Add("<i>“Not exactly like me,”</i> she quickly corrects you. <i>“I'm the first of us to be born looking like this in about four generations - it's been a <b>long</b> time since Great-Great-something-or-other grandma's day,”</i> she notes. <i>“Fact of the matter is, you pretty much never see anyone who looks like me these days - dragons have been gone for a <b>long</b> time,”</i> she confesses.", parse);
			Text.NL();
			Text.Add("You nod as you digest this information. Well, then her dragon-bits are all-natural rather than some form of magic or alchemy?", parse);
			Text.NL();
			Text.Add("<i>“That's right,”</i> she chirps. <i>“I'm one hundred percent all natural, from the tips of my pretty little horns to the tip of my long, curly tail. Scales and skin and hair, claws and teeth and... well, pretty much everything,”</i> she giggles. She then makes a show out of groping her bustline and feeling at her butt, then pouts. <i>“Despite what people keep asking, these are all natural too. It's really not fair; everyone looks at them and thinks I got them out of a bottle. I wouldn't do something like that!”</i> she huffs, stamping her foot indignantly.", parse);
			Text.NL();
			Text.Add("<i>“...Actually, I couldn't get them out of a bottle even if I wanted to,”</i> she notes absently, looking thoughtful. <i>“It's the oddest thing, but transformatives? They basically don't work on me. Like, at all. It's really weird - none of the rest of my family are like that. Poor Uncle Ernie,”</i> she notes.", parse);
			Text.NL();
			Text.Add("Shaking her head, she gives you a winning smile. <i>“So, anyway, yeah! I'm completely all natural, the one and only Momo - accept no substitutes!”</i> She giggles at her own cheesiness.", parse);
			Text.NL();
			Text.Add("<i>“Anywho, I left the farm when I was... ooh, about eighteen, nineteen years old? I went off to the big city and got into one of the chefs’ guilds there. Got my official member’s license and everything!”</i> she brags gleefully. <i>“Ever since then, I've been on a journey, looking for new and unusual recipes and ingredients, traveling all over to hone my skills and be the best chef I can be!”</i>", parse);
			Text.NL();
			Text.Add("<i>“Well, that's all I can think of when it comes to talking about little old me,”</i> Momo giggles. <i>“Drop on by anytime, [playername].”</i>", parse);
			Text.Flush();
			
			world.TimeStep({minute: 30});
			
			momo.relation.IncreaseStat(25, 2);
			
			momo.flags["tSelf"] = 1;
	
			Scenes.Momo.TalkPrompt();
		}, enabled : true,
		tooltip : "Learn more about Momo."
	});
	if(momo.flags["tSelf"] != 0) {
		options.push({ nameStr : "Family",
			func : function() {
				Text.Clear();
				Text.Add("<i>“You want to know about my family?”</i> Momo repeats, brow furrowed in surprise. <i>“Well, sure, I can tell you a little about them if you really want to know.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Well, the Kindling farm is a family business that dates back centuries - I think over a thousand years. We've been growing crops and livestock for a looong time,”</i> she notes with a smile. <i>“Fruits, vegetables, meat, milk, wool, cheese, butter, eggs... we produce it all. Boy, let me tell you, looking after the place is a full time job! I guess that's part of the reason why we're such a big family - it's the only way to look after everything,”</i> she muses.", parse);
				Text.NL();
				Text.Add("<i>“I've got twelve brothers and sisters.  I was Mum's third, so I grew up with a big brother, a big sister, and a gaggle of little ones following me around, chasing my tail - sometimes literally,”</i> she chirps, smiling happily at the memory. <i>“Oh, I had one brother who just adored my tail, he always wanted to hold it and stroke it and cuddle with it. He's going out with a lizard-morph now, would you believe?”</i> she asks cheerfully, seeming quite proud of the fact.", parse);
				Text.NL();
				Text.Add("Then her expression changes to a more irritated look. <i>“Of course, the attention wasn't always good. Like that little brat Veran - she bit me! More than once!”</i> Momo pouts indignantly at the thought.", parse);
				Text.NL();
				Text.Add("She’s really quite a mood swinger, isn’t she? Still, you choose to be polite and keep your thoughts to yourself.", parse);
				Text.NL();
				Text.Add("<i>“Oh, I should probably tell you about the dragon, right? I mean, I mentioned that when you asked me about myself,”</i> Momo suddenly realizes, looking at you inquisitively. At your confirmation, she inhales and starts to explain.", parse);
				Text.NL();
				Text.Add("<i>“Now, the story's a very old one, and I have to admit, I didn't always pay a lot of attention to it,”</i> she confesses, tail curling nervously around her legs as she gives you a sheepish smile. <i>“But I do remember the gist of it. Hundreds of years ago, there was this dragon who made a real nuisance of himself around the farm - he kept stealing cattle and sheep and goats. Not too often, thankfully, maybe a beast or two every few months, but it really annoyed my ancestors. I mean, he was stealing our livelihood to feed his own belly! Wouldn't you be angry?”</i> she asks indignantly, tail lashing as she does so.", parse);
				Text.NL();
				Text.Add("Anyone would, you reply.", parse);
				Text.NL();
				Text.Add("<i>“See? I told you so! Anyway, finally, Super-Great-grandma had enough of it and decides she's going to put a stop to it. No passing hero wants to tangle with a dragon over a single farm and a few sheep, so she figured she'd do it herself.”</i> Momo smiles with familial pride at the idea.", parse);
				Text.NL();
				Text.Add("<i>“Supposedly, super-great-grandma Lily Kindling was known for being really smart. Also for having a tongue sharp as a boning knife, and for being as stubborn as an ox and twice as strong, but mostly for being smart,”</i> the dragon-girl brags. <i>“She finds out where the dragon's cave is and she hauls up several barrels of really, really potent booze there. 'Bold as you please' she shouts out to him and invites him to come out and be neighborly and share a drink, and out he comes.”</i>", parse);
				Text.NL();
				Text.Add("You can see where this is going… and that’s certainly an interesting plan. But considering Momo’s existence, you wonder what went so wrong, or so right, with her plan that her bloodline wound up mixing with dragons.", parse);
				Text.NL();
				Text.Add("<i>“I’m getting there,”</i> Momo playfully chides you. <i>“Now, Lily's plan was to get him drunk and then chop his head off while he was helpless,”</i> Momo confesses to you, looking suitably torn between horror and pride at her ancestor's wicked cunning. <i>“But to convince him to drink, she had to share the ale and stuff herself, and she forgot just how potent the brew was - she wound up getting blind stinking drunk herself!”</i> the dragon-girl laughs.", parse);
				Text.NL();
				Text.Add("<i>“Now, the two of them are both really drunk at this point, and it's a warm spring night, and the dragon's not so bad when she's talking to him - really polite and smart and funny and... well, I think you can guess what happened,”</i> Momo declares, trying to smile mischievously even as her cheeks flush red with embarrassment.", parse);
				Text.NL();
				Text.Add("...You can probably guess, but you still ask that she continue her tale.", parse);
				Text.NL();
				Text.Add("<i>“So, ah, yeah,”</i> Momo starts, fighting back a giggle. <i>“Grandma wakes up the next morning with a nasty hangover and some rather pleasant feelings from down there,”</i> she indicates in the direction of her loins with a pointing finger, <i>“and the dragon - who you might have guessed is my super-great grandpa - he's cooking her breakfast, all smiles and jokes.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Well, Grandma decides it's better to take the food than let him find the axe, so the two of them have a nice meal together - and he's all flirting and grins and Grandma, well, she starts to think that maybe he's not so bad...”</i> Momo grins knowingly, still looking a little flushed.", parse);
				Text.NL();
				Text.Add("<i>“He's the first boy who's ever treated her so nice, so, once breakfast is over, she offers him another round before she leaves. And he takes it. So, she comes back again next month, the day before he usually comes around to steal something from the farm, and she just so happens to have some more ale...”</i> Momo giggles wickedly. <i>“Started out once a month, then it's twice a month, then a weekly thing, and then, next thing Lily knows, she's waddling up to the cave with a great big belly hanging off of her; she demands to know what he's going to do about it, and he just whips out this huge diamond-studded ring and asks her to marry him!”</i> she cheerfully squeals, bursting out laughing at the thought, slapping her stomach to try and contain her mirth.", parse);
				Text.NL();
				Text.Add("So, if you get this straight, her grandma set out to slay a dragon but wound up laying it?", parse);
				Text.NL();
				Text.Add("<i>“That's most certainly what happened,”</i> she snickers. <i>“They had a long and happy life together, big gaggle of kids. Grandpa flew away after Grandma died, of course, but by then the farm was well and truly in good hands,”</i> she explains.", parse);
				Text.NL();
				Text.Add("That was a pretty interesting story. And a pretty naughty one too. Maybe you should take advantage of Momo’s giddy mood and see if you can take this somewhere?", parse);
				Text.Flush();
				
				world.TimeStep({minute: 30});
				
				if(momo.flags["tFamily"] == 0)
					momo.flags["tFamily"] = 1;
				
				momo.relation.IncreaseStat(25, 2);
				
				//[Flirt][Nope]
				var options = new Array();
				options.push({ nameStr : "Flirt",
					func : function() {
						Text.Clear();
						Text.Add("You slowly look Momo over, making it blatantly apparent that you’re checking her out. Then with a smirk, you suggest that you happen to know a thing or two about <i>feeling good down there</i>. Maybe she’d like you to show her?", parse);
						Text.NL();
						if(momo.IsFollower()) {
							Text.Add("Momo's eyes widen at your innuendo, before her lips curl into a grin, the dragon-[girlMorph] strutting toward you. A hint of the old shyness shows through in the redness dusting her cheeks, but the smile curving her face is pure predator, eyes hooded in her sultriest expression.", parse);
							Text.NL();
							Text.Add("<i>“That sounds like an invitation I just <b>have</b> to accept,”</i> she purrs, gently folding her arms around you, long tongue flicking out to slurp playfully over your cheek in a quick motion, tail curling around your [legs]. Leaning her head in to bring it closer to your [ear], she stage whispers, <i>“Step into my parlor,”</i> and then releases you, swaying enticingly as she vanishes into her tent, her prehensile appendage flicking toward you in a “come hither” gesture before it's gone.", parse);
							Text.Flush();
							
							//TODO Momo Sex
							Scenes.Momo.TalkPrompt();
						}
						else if(momo.Relation() < 20) {
							Text.Add("A lighthearted laugh bubbles from the dragon-girl’s lips. <i>“Oh! Stop, you’re making me blush,”</i> she says, clapping her hands over her cheeks for emphasis, a giddy smile on her lips all the same.", parse);
							Text.NL();
							Text.Add("You’re not saying anything that’s not true - no reason to be embarrassed about that.", parse);
							Text.NL();
							Text.Add("<i>“I bet you say that to all the girls... but doesn’t make it any less nice,”</i> she giggles, tail curling playfully around her calves. <i>“Really, [playername], that’s very flattering, and you’re kinda cute yourself, but I don’t think we know each other that well yet,”</i> she insists. She’d probably sound a lot more convincing if she wasn’t still grinning in delight.", parse);
							Text.NL();
							Text.Add("<i>Kinda</i> cute? Now she’s just breaking your heart…", parse);
							Text.NL();
							Text.Add("<i>“Okay, okay. You’re <b>very</b> cute. Better now?”</i> she quips, playfully poking her tongue out at you.", parse);
							Text.NL();
							Text.Add("...It’s a start, you grin.", parse);
							Text.NL();
							Text.Add("<i>“You really are a cheeky bastard, [playername],”</i> Momo declares. She actually sounds approving of the fact. <i>“But I have things I need to do now, so I really should be getting back to them,”</i> the dragon-girl notes, approaching the bevvy of cooking utensils and ingredients that she keeps around. <i>“It was lovely talking to you, though; drop by any time,”</i> she assures you, even as she wrestles out a cutting board and starts peeling some vegetables.", parse);
							Text.Flush();
							
							world.TimeStep({minute: 5});
							
							momo.relation.IncreaseStat(20, 3);
							
							Scenes.Momo.TalkPrompt();
						}
						else { //#Med RL (Momo.RL >=20)
							Text.Add("<i>“Well...”</i> Momo slowly starts, openly checking you out, cheeks reddened but clearly liking what she's seeing. <i>“I think you just might be my type... but I'd like a little wining and dining first; a girl likes to feel special,”</i> she grins. <i>“How about it, [playername]? Up for a little dinner date before we think about the... 'dessert', hmm?”</i>", parse);
							Text.NL();
							Text.Add("Sounds like a plan!", parse);
							Text.NL();
							Text.Flush();
							
							// TODO Flirt
							Scenes.Momo.TalkPrompt();
						}
					}, enabled : true,
					tooltip : "She did just regale you with a rather raunchy tale, why not take advantage of it and see if you can take this somewhere?"
				});
				options.push({ nameStr : "Nope",
					func : function() {
						Text.Clear();
						if(momo.flags["tFamily"] == 1)
							Text.Add("You thank Momo for the story; you’d never have guessed that this was exactly how a human-dragon hybrid would come to be.", parse);
						else
							Text.Add("No matter how many times you hear it, this story never gets old. You thank Momo for retelling it.", parse);
						Text.NL();
						if(momo.flags["tFamily"] == 1)
							momo.flags["tFamily"] = 2;
						Text.Add("<i>“It was my pleasure, [playername],”</i> she assures you. <i>“I wouldn't normally tell this to just anyone. I had my fill of people poking and prying about it when I left the farm, but you... you're different. I felt I could talk to you and tell you the truth,”</i> she notes absently.", parse);
						if(momo.IsFollower())
							Text.Add(" <i>“And I was certainly right to think so,”</i> she notes, grinning rather smugly as she does.", parse);
						Text.Flush();
						
						Scenes.Momo.TalkPrompt();
					}, enabled : true,
					tooltip : Text.Parse("Nah, this is a stupid idea. Now is not the time to be flirting with the dragon-[girlMorph].", parse)
				});
				Gui.SetButtonsFromList(options, false, null);
			}, enabled : true,
			tooltip : "Why not ask and see if Momo will tell you a little about her origins."
		});
	}
	options.push({ nameStr : "Cooking",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Ooh, I love telling this story,”</i> Momo notes happily, grinning a toothy grin of glee at you at the topic. <i>“Well, I come from a really big farming family, and that means two things. Firstly, we need a <b>lot</b> of food when it's meal time. Secondly, cooking meals is a full-time job. So, the way my family sorts it out is that we have these team schedules - some of us are doing chores in the yards, some of us are cooking and cleaning, all that sort of thing. You know what I mean?”</i>", parse);
			Text.NL();
			Text.Add("That seems like an interesting way to run a family.", parse);
			Text.NL();
			Text.Add("<i>“Maybe it's not how everyone would handle it,”</i> Momo admits, <i>“but it worked for us well enough.”</i>", parse);
			Text.NL();
			
			Gui.Callstack.push(function() {
				Text.Add("Shaking her head, Momo returns her attention to her original story.", parse);
				Text.NL();
				Text.Add("<i>“Well, from the beginning, I always looked forward to when it was my turn on the cooking team,”</i> Momo smiles nostalgically as she says this. <i>“I just loved the way I could take a bunch of things and turn it into something delicious. Nothing more rewarding than a nice, juicy roast or a lush cake or a succulent pie coming out of the oven and knowing it's all your own work that made it possible,”</i> she trails off, licking her lips at mental images of delicacies past and future.", parse);
				Text.NL();
				Text.Add("<i>“So, yeah, I always volunteered when I could; I offered to take over when any of my siblings didn't want to do it, and I kept trying to learn all the new recipes I could. And my parents noticed,”</i> she notes proudly. <i>“When I was about eighteen, nineteen, they sat me down and had a big talk with me. Told me how much they could see I loved to cook, and how proud they were of me for having such a talent in the kitchen. They said they wanted me to go out and chase my dreams, to be the best chef ever. They had all my brothers and sisters to help run the farm, after all. I was torn up about it, but they knew me better than I knew me; I wanted to be a real cook <b>so</b> badly,”</i> she sighs happily.", parse);
				Text.NL();
				Text.Add("<i>“So, with their blessing, I packed up my stuff and I went from the farm to the nearest big city. Mom and Dad got me tutelage in a cooking school. I studied there a couple of years, graduated with honors, too. Ever since then, I've been exploring, hoping to really make my mark on the culinary world,”</i> she concludes proudly.", parse);
				Text.NL();
				Text.Add("<i>“So, did you have any other questions?”</i> she asks brightly, a chipper look on her face as she looks at you.", parse);
				Text.Flush();
				
				momo.relation.IncreaseStat(25, 2);
				
				world.TimeStep({minute: 20});
				
				Scenes.Momo.TalkPrompt();
			});
			
			
			if(momo.flags["tCook"] == Momo.TalkCook.First) {
				Text.Add("Head tilting to the side, she directs an inquisitive look at you. <i>“What about you, [playername]? What kind of family did you come from?”</i> she asks, her tone innocent and sincerely interested.", parse);
				Text.Flush();
				
				//[Big family][Small family][Only Child]
				var options = new Array();
				options.push({ nameStr : "Big family",
					func : function() {
						Text.Clear();
						Text.Add("It was a big family. Not as big as hers, of course. There were times when you thought you were going to go insane, and you bickered with your siblings a lot. But there were also times you were glad to have everyone backing you up. It was a noisy family, but once you got used to it you wouldn’t exchange that for anything. This talk actually made you feel a little homesick... you wonder how they’re doing now...", parse);
						Text.NL();
						Text.Add("The dragon-[girlMorph] moves to place her hand comfortingly across your shoulder and then smiles fondly. <i>“Yeah, I know; everyone bickers all the time, but really, you love each other and you wouldn't dream of having it any other way. That's how I grew up; I really miss my siblings too...”</i> ", parse);
						Text.NL();
						Text.Add("She sighs hugely and shakes her head. <i>“I've heard people talk about how noisy or confusing it would be to live like that, and I've never been able to understand it. Okay, maybe I can kind of see the point in not having a really huge family, but I definitely want my kids to have a good number of siblings to play with when they grow up. Six to eight maybe. Twelve or thirteen wouldn't be too bad... anything more than twenty is getting a bit out of hand, though,”</i> she notes, more to herself than to you.", parse);
						Text.NL();
						if(player.Gender() == Gender.female && momo.IsFollower()) {
							Text.Add("<i>“Don't worry about me getting any funny ideas, lover mine, I was planning on adopting!”</i> she hastens to reassure you, then pokes her tongue out at you playfully.", parse);
							Text.NL();
						}
						
						momo.flags["tCook"] = Momo.TalkCook.BigFamily;
						
						PrintDefaultOptions();
					}, enabled : true,
					tooltip : "Your family was a lot like hers: big and noisy."
				});
				options.push({ nameStr : "Small family",
					func : function() {
						Text.Clear();
						Text.Add("Unlike hers, you have a small family. Everyone kinda stuck in their own corner for the most part, so it was easy to live with them. But there were times when you all gathered together for a reason or another, and you lived knowing you always had people you could count on nearby. 'Course there’s always the usual bickering in the family, but in the end of the day you’d all sit together and laugh it out over dinner. You can’t help but wonder how your siblings are doing…", parse);
						Text.NL();
						Text.Add("Reaching out and patting your shoulder in a friendly way, Momo smiles. <i>“You know, I'll be honest, I did sometimes wonder what it'd be like to have a few less siblings,”</i> she confesses. <i>“Don't get me wrong, I love all my brothers and sisters, but there are times that I definitely wouldn't have minded having a little more family space, or personal attention. Honestly? I think I'd rather have a nice medium-sized family, all in all; about five to seven kids, perhaps.”</i>", parse);
						Text.NL();
						if(player.Gender() == Gender.female && momo.IsFollower()) {
							Text.Add("<i>“I'm sure the two of us will find a few orphans looking for a pair of moms to give them a good home,”</i> she giggles.", parse);
							Text.NL();
						}
						
						momo.flags["tCook"] = Momo.TalkCook.SmallFamily;

						PrintDefaultOptions();
					}, enabled : true,
					tooltip : "You had some siblings, but not as many as she did."
				});
				options.push({ nameStr : "Only Child",
					func : function() {
						Text.Clear();
						Text.Add("You didn’t have any siblings. For the longest time, it was just you - not that you minded much. You kind of get used to it. It was a bit lonely at times, you admit, but you aren’t sure how you’d handle having to deal with any sort of siblings.", parse);
						Text.NL();
						Text.Add("The dragon-[girlMorph] stares at you, then slowly shakes her head. <i>“I'm not sure I could imagine living like that,”</i> she confesses. <i>“Don't get me wrong, I fought with my siblings all the time, but still, I always knew I could trust them,”</i> she shivers. <i>“I definitely wouldn't want my son or daughter to be an only child...”</i>", parse);
						Text.NL();
						if(player.Gender() == Gender.female && momo.IsFollower()) {
							Text.Add("<i>“Don't worry, I was thinking adoption, not gender-bending,”</i> she hastily assures you.", parse);
							Text.NL();
						}
						
						momo.flags["tCook"] = Momo.TalkCook.OnlyChild;
						
						PrintDefaultOptions();
					}, enabled : true,
					tooltip : "You never had any siblings."
				});
				Gui.SetButtonsFromList(options, false, null);
			}
			else if(momo.flags["tCook"] == Momo.TalkCook.BigFamily) {
				Text.Add("Momo chuckles and shakes her head. <i>“I tell you, I never had any problems learning to cope with customers; my kitchen back on the farm was busy as any restaurant ever gets,”</i> she declares, sounding perversely proud of that fact. <i>“Breakfast, lunch, dinner, it was like a battle every time, and the washing up... you could have had a bath in the tub we used for all our plates and stuff...”</i>", parse);
				Text.NL();
				Text.Add("She trails off, looking baffled, clearly trying to recall something. Then, a dopey grin stretches her face into a beam of delight and she bursts out giggling. <i>“Actually, there was this one time, when Veran was four, when that’s exactly what I did! I just whisked her up off the floor and plunged her into the tub and started scrubbing her with the washcloths,”</i> Momo declares.", parse);
				Text.NL();
				Text.Add("You can just imagine what it’d have been like. If you pulled a stunt like that in your house, your parents would scold you hard.", parse);
				Text.NL();
				Text.Add("<i>“Scold me? My mom pulled me over my knee and spanked me!”</i> Momo corrects you, laughing at the memory. Then, she blinks and pouts, looking wounded. <i>“Honestly, I don’t know why... I mean, Veran loved it! She was happy playing in the bubbles, and she was going to get a bath anyway... besides, she kept pulling my tail,”</i> the [dragonette] huffs, folding her arms defensively over her chest.", parse);
				Text.NL();
				Text.Add("Mercurial as always, Momo’s indignation lasts marginally longer than a soap bubble before she sighs, shakes her head and smiles absently. <i>“You know, despite it all, I still really miss my family. Not just my folks, but my brothers and sisters, too. I’d love to go back and see them some day,”</i> she confesses to you.", parse);
				if(momo.IsFollower())
					Text.Add(" <i>“I can’t wait to see their faces when they see you walk in through the door with me,”</i> she titters. <i>“I just know they’d love to meet you.”</i>", parse);
				if(momo.Ascended())
					Text.Add(" She pauses suddenly, nibbling thoughtfully at a crooked finger. <i>“I wonder if they’d be more surprised at seeing you, or at seeing me,”</i> she mumbles, more to herself than to you.", parse);
				Text.NL();
				PrintDefaultOptions();
			}
			else if(momo.flags["tCook"] == Momo.TalkCook.SmallFamily) {
				Text.Add("Momo looks thoughtful for a moment, staring wistfully off into space. <i>“You want to know the truth? There are times I kind of wished my family was a little smaller. I mean, don’t get me wrong, I loved having brothers and sisters! It’s just... well, sometimes I wouldn’t have minded a little more attention from Mom and Dad, or just a little less noise in general.”</i>", parse);
				Text.NL();
				Text.Add("A frown crosses her face now. <i>“Not to mention there’s always been some little brats I wouldn’t have minded not having around,”</i> she grumbles, but it’s the half-hearted grumble of an exasperated older sibling; no venom to it at all.", parse);
				Text.NL();
				PrintDefaultOptions();
			}
			else { // if(momo.flags["tCook"] == Momo.TalkCook.OnlyChild)
				Text.Add("Momo purses her lips, tapping them in thought. <i>“Well, I guess there’s some good things to say about being an only child. You never have to worry about your parents not having time for you, you don’t have to share all your stuff, you don’t have bratty siblings stealing your things or making kites out of your panties or pulling your tail...”</i>", parse);
				Text.NL();
				Text.Add("<i>“Yeah, you were lucky, [playername]; brothers and sisters can be a real pain in the ass... but then again, you never got any of the good stuff, either. You never had siblings help you out when you scraped your knee, or got your tail caught in a door. You never got to listen to your bigger siblings telling you stories, or have your little ones bring you presents they found out on the farm either. No playing together in the bath, no games together, no hiding from thunder under the covers...”</i>", parse);
				Text.NL();
				Text.Add("She’s smiling wistfully now. <i>“I guess, really, I’m not cut out to be a single child. They bug me sometimes, but I love my brothers and my sisters.”</i>", parse);
				Text.NL();
				PrintDefaultOptions();
			}
		}, enabled : true,
		tooltip : "So, what made her so fascinated with cooking, anyway?"
	});
	if(momo.flags["tCook"] != Momo.TalkCook.First) {
		options.push({ nameStr : "Skills",
			func : function() {
				Text.Clear();
				if(momo.flags["tSkills"] == 0)
					Text.Add("<i>“You want to know what sort of things I can cook? Why, certainly, I'd be happy to tell you that,”</i> Momo grins with delight, eager to show off.", parse);
				else
					Text.Add("<i>“Need a little reminder, do you? It's okay, [playername], we all can forget things sometimes. That's why I have recipe books,”</i> the dragon-[girlMorph] giggles.", parse);
					
				momo.flags["tSkills"] = 1;
				
				Text.NL();
				Text.Add("Clearing her throat and drawing herself up straight, Momo puts a hand on her chest and launches into her explanation. <i>“Well, first and foremost, I know a lovely variety of tasty and nutritious dishes, all guaranteed to give you the energy you need,”</i> she brags. <i>“Whether it's soups or cakes, roasts or stir-fries, I guarantee it'll have you fighting fit in no time flat.”</i>", parse);
				Text.NL();
				Text.Add("<i>“While I was at the chef's guild, I dabbled a little in gastroalchemy. Now, I'm not a proper alchemist,”</i> she hastens to explain to you, <i>“but if you give me an alchemical potion or some other transformative, I can try and cook up a dish from it that should be more likely to cause the effect you want it to cause. I can't guarantee it'll work, this is a tricky business, but the odds will be much better than just taking it naturally,”</i> she assures you earnestly.", parse);
				Text.NL();
				Text.Add("<i>“Finally, there's my most favorite thing to do: experiment,”</i> she giggles, rubbing her hands together eagerly. <i>“This world is full of all sorts of weird and magical ingredients, and I'm determined to figure out how they can revolutionize cooking. If you've found anything in your travels that you want to let me try and cook with, I'd be more than happy to see what I can make from it. No guarantees what'll work, but then, that's why it's experimenting!”</i>", parse);
				Text.NL();
				Text.Add("<i>“Well... I think that about sums it up,”</i> she notes, pausing thoughtfully. Nodding her head, she looks back at you. <i>“Anything else you wanted?”</i>", parse);
				Text.Flush();
				
				momo.relation.IncreaseStat(25, 2);
				
				world.TimeStep({minute: 10});
				
				Scenes.Momo.TalkPrompt();
			}, enabled : true,
			tooltip : "Ask about Momo's talents and abilities when it comes to being a chef."
		});
	}
	/*
	options.push({ nameStr : "name",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
			
			momo.relation.IncreaseStat(20, 2);
			
			Scenes.Momo.TalkPrompt();
		}, enabled : true,
		tooltip : ""
	});
	*/
	Gui.SetButtonsFromList(options, true, Scenes.Momo.Prompt);
}
/*
Scenes.Momo.FindingMomo = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
}
*/
