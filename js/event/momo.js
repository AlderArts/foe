/*
 * 
 * Define Momo
 * 
 */

Scenes.Momo = {};

function Momo(storage) {
	Entity.call(this);
	
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
	this.body.SetRace(Race.dragon);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"]  = Momo.Met.NotMet;
	
	this.wanderTimer = new Time();

	if(storage) this.FromStorage(storage);
}
Momo.prototype = new Entity();
Momo.prototype.constructor = Momo;

Momo.Met = {
	NotMet    : 0,
	Wandering : 1,
	Camp      : 2
};

Momo.prototype.Wandering = function() {
	return this.flags["Met"] < Momo.Met.Camp && this.wanderTimer.Expired();
}
Momo.prototype.AtCamp = function() {
	return this.flags["Met"] == Momo.Met.Camp;
}

Twins.prototype.Update = function(step) {
	this.wanderTimer.Dec(step);
}

Momo.prototype.FromStorage = function(storage) {
	this.Butt().virgin     = parseInt(storage.avirgin) == 1;
	this.FirstVag().virgin = parseInt(storage.virgin)  == 1;
	
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
	
	//TODO combat stats
	
	this.wanderTimer.FromStorage(storage.wTime);
}

Momo.prototype.ToStorage = function() {
	var storage = {
		avirgin : this.Butt().virgin ? 1 : 0,
		virgin  : this.FirstVag().virgin ? 1 : 0
	};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	this.SaveSexStats(storage);
	
	storage.wTime = this.wanderTimer.ToStorage();
	
	return storage;
}

// Schedule
Momo.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Plains.Nomads.Fireplace && this.AtCamp() && world.time.hour >= 7 && world.time.hour < 21) {
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
	Text.Add("As you explore the [area] you come upon a curious sight. There appears to be a woman sitting down on the ground, she’s slumped over and hugging her knees. You can’t make out much detail at this time, but you do note that she seems to bear a reptilian tail and horns. You decide to approach.", parse);
	Text.NL();
	Text.Add("The feminine figure stirs as you come closer - evidently having heard you - lifting her head and partially turning to reveal attractively female, human-like features. Two sapphire blue eyes blink as she takes in your form, unconsciously lifting a hand to brush aside a lock of wavy blonde hair that's fallen over her face.", parse);
	Text.NL();
	Text.Add("<i>“Oh! Ah - Hello? Are you from around these parts?“</i> she asks politely, a faint but friendly smile on her lips. <i>“I'm terribly sorry to bother you, I've just gotten myself a little lost...“</i> A deep sonorous rumble emanates from her midriff, making her pale cheeks flush pink in embarrassment, a hand going to her belly. <i>“Sorry, I'm hungry,“</i> she adds unnecessarily.", parse);
	Text.NL();
	Text.Add("You do your best to stifle your laughter; if she’s just feigning being harmless, she’s a pretty damn good actor. Curious, you ask her what she’s doing out all alone in a place like this.", parse);
	Text.NL();
	Text.Add("Smiling pleasantly, the strange tailed woman rolls forward slightly, pushing herself up off the ground and taking to her feet. Standing about five and three quarters feet tall, she's a pretty tall girl. This close to her, you can see another oddity on her body besides the tail and the horns and the scaly patches - small, dragon-like wings poke through slits in the back of her shirt. They're tiny things, maybe about a handspan in length and width, but perfectly formed. All in all, she looks like some strange melding of human girl and dragon.", parse);
	Text.NL();
	Text.Add("If the stranger notices you studying her body, she doesn’t mention it. <i>“I've been out traveling for a while - not heading anywhere in particular, just traveling for the sake of traveling, you know? I set my supplies down a while ago to go hunting - spotted a nice juicy rabbit that I wanted to catch for dinner.”</i>", parse);
	Text.NL();
	Text.Add("She sighs and shakes her head, looking embarrassed as she confesses, <i>”But he got away from me, and by the time I gave up, I couldn't remember where I'd come from. So I've been wandering around ever since.”</i> she shrugs haplessly at the admission. <i>”First couple of hours, I was trying to find my things. After that, I was looking for someone who could help me. You're the first person I've seen in the last day.“</i>", parse);
	Text.NL();
	Text.Add("<i>“So... I don't suppose you know some place where a girl can get some food around here, do you? I don't have a lot of money, but I'd be happy to offer my services in exchange,“</i> she adds, looking you over with a hopeful expression.", parse);
	Text.NL();
	Text.Add("Services?", parse);
	Text.NL();
	Text.Add("<i>”Yes! I’m a cook!”</i> she boasts proudly.", parse);
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
			Text.Add("<i>“That would be perfect! Thank you so much!“</i> she says enthusiastically. <i>“Maybe they need a new camp cook!“</i> she suggests excitedly. <i>“They might even have new recipes for me to learn. Come on, let's - oh!“</i> She stops suddenly, slapping her forehead with her palm as an expression of realisation dawns on her face. <i>“Silly thing, I got so worked up that I went and forgot my manners - my mother would have spanked me for that back home,“</i> she giggles sheepishly. <i>“My name's Monareth Kindling - but my friends call me Momo. What's your name?“</i> she asks, extending a hand for you to shake.", parse);
			Text.NL();
			Text.Add("You take her hand and offer her your name.", parse);
			Text.NL();
			Text.Add("<i>“Nice to meet you, [playername],“</i> she cheerfully declares, giving your hand a firm squeeze and a few pumps before letting you go. <i>“So, where's this camp you were telling me about?“</i>", parse);
			Text.NL();
			Text.Add("You assure her that it isn’t too far from here; if she’ll follow you, the both of you will be there soon.", parse);
			Text.NL();
			Text.Add("<i>”Okey-dokey!”</i>", parse);
			Text.NL();
			Text.Add("With the beaming dragon-girl hot on your trail, you set about confidently, retracing your steps.", parse);
			Text.Flush();
			
			momo.flags["Met"] = Momo.Met.Camp;
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Plains.Nomads.Fireplace, {hour : 1});
			});
		}, enabled : true,
		tooltip : "Take the strange woman back to the Nomads’ camp, she clearly needs the help."
	});
	options.push({ nameStr : "Leave her",
		func : function() {
			Text.Clear();
			Text.Add("With a shake of your head, you tell her that she can forget it;  she’s probably just trying to lead you into an ambush.", parse);
			Text.NL();
			Text.Add("<i>”B-but I’m not!”</i> she protests feebly, eyes wide in shock, mouth actually hanging open in her surprise at the accusation.", parse);
			Text.NL();
			Text.Add("You cut her off, saying it doesn’t matter; either she’s trying to lull you into a false sense of security, or else she’s an idiot; either way, you don’t want anything to do with her.", parse);
			Text.NL();
			Text.Add("The dragon-girl’s face flushes red, brows furrowing in rage, lips pressing together into thin lines, fingers curling into fists that quiver with her emotion. <i>”You... well, you’re a... a big <b>jerk</b>! Fine, who needs you! I’ll find someone else to help me!”</i>", parse);
			Text.NL();
			Text.Add("With an indignant “hmph!” noise she sticks her nose up in the air, a poor imitation of a regal mannerism, and spins forcefully on her heel. You narrowly avoid her tail slapping you across the face as it 'coincidentally' whips through the air behind her, whereupon she storms off into the wilderness.", parse);
			Text.NL();
			Text.Add("Shaking your head, you turn around and head back to the nomad’s camp. You run into all kinds of lunatics out on the roads, it looks like.", parse);
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
	Text.Add("Off in the distance you spot a familiar blur. Upon closer inspection you realize that it’s that dragon girl you met a while ago. Seems like she’s still lost…", parse);
	Text.Flush();
	
	//[HelpHer][Leave]
	var options = new Array();
	options.push({ nameStr : "Help her",
		func : function() {
			Text.Clear();
			Text.Add("Heaving a sigh, you decide to approach her.", parse);
			Text.NL();
			Text.Add("The dragon-girl has her back to you as you approach, but you see her twitch, little wings flapping as she clearly hears you. <i>”Oh, hi! Can you help... oh, it’s you,”</i> she notes, her initial tone of excited relief changing to a grumpy, sullen groan as she excitedly turns around, only to see you standing before. It’s clear she recognizes you. With a pout, she folds her arms over her chest and sulkily asks, <i>”What do you want?”</i>", parse);
			Text.NL();
			Text.Add("You simply tell her that you’ve decided to help her.", parse);
			Text.NL();
			Text.Add("She blinks in surprise; that’s clearly not what she expected to hear from you. <i>”I...um, okay. Thanks, I guess?”</i> Her tone is tentative, as if she’s not really sure what to say. She shakes her head as if clearing her mind of whatever mental fog has befallen it and looks at you, this time with sincere hope in her eyes. <i>”Sorry, that was rude of me - you really want to help? Please, I’d be most grateful!”</i>", parse);
			Text.NL();
			Text.Add("Of course, that’s what you said, wasn’t it?", parse);
			Text.NL();
			Text.Add("Her eyes go wide, face lighting up in joy as she excitedly clasps her hands together. <i>”Oh, thank you, thank you! I was wondering if I’d ever find someone to help me...”</i>", parse);
			Text.NL();
			Text.Add("You introduce yourself to her, asking her what’s her name.", parse);
			Text.NL();
			Text.Add("<i>”Monareth Kindling! But please, call me Momo - all my friends do!”</i> The smile she gives you as she says this is open, honest and sincere, eyes closing happily and a grin completely devoid of guile spreading wide over her lips.", parse);
			Text.NL();
			Text.Add("Well, it’s nice to finally meet her. You offer her a handshake and inform her that the encampment isn’t far.", parse);
			Text.NL();
			Text.Add("<i>”Then lead the way, [playername]!”</i> she chirps merrily, shaking your hand with a powerful set of pumps - she’s got quite a grip, actually.", parse);
			Text.NL();
			Text.Add("With the beaming dragon-girl hot on your trail, you set about confidently, retracing your steps.", parse);
			Text.Flush();
			
			momo.flags["Met"] = Momo.Met.Camp;
			
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
