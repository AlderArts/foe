/*
 * 
 * Define Jeanne
 * 
 */
Scenes.Jeanne = {};

function Jeanne(storage) {
	Entity.call(this);
	
	// Character stats
	this.name = "Jeanne";
	
	//this.avatar.combat = new Image();
	
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
	
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 9;
	this.Butt().buttSize.base = 7;
	this.body.SetRace(Race.elf);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = 0;

	if(storage) this.FromStorage(storage);
}
Jeanne.prototype = new Entity();
Jeanne.prototype.constructor = Jeanne;


Jeanne.prototype.FromStorage = function(storage) {
	// Personality stats
	this.subDom.base         = parseFloat(storage.subDom)  || this.subDom.base;
	this.slut.base           = parseFloat(storage.slut)    || this.slut.base;
	this.relation.base       = parseFloat(storage.rel)     || this.relation.base;
	
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
}

Jeanne.prototype.ToStorage = function() {
	var storage = {};
	if(this.subDom.base   != 0) storage.subDom = this.subDom.base;
	if(this.slut.base     != 0) storage.slut   = this.slut.base;
	if(this.relation.base != 0) storage.rel    = this.relation.base;
	storage.flags = this.flags;
	
	return storage;
}


// Schedule
Jeanne.prototype.IsAtLocation = function(location) {
	return true;
}

// Party interaction
Jeanne.prototype.Interact = function() {
	Text.Clear();
	
	//TODO
	
	Text.Add("PLACEHOLDER");
	
	if(DEBUG) {
		Text.NL();
		Text.Add(Text.BoldColor("DEBUG: relation: " + jeanne.relation.Get()));
		Text.NL();
		Text.Add(Text.BoldColor("DEBUG: subDom: " + jeanne.subDom.Get()));
		Text.NL();
		Text.Add(Text.BoldColor("DEBUG: slut: " + jeanne.slut.Get()));
		Text.NL();
	}
	
	Text.Flush();
	
	Gui.NextPrompt(function() {
		PrintDefaultOptions();
	});
}

Scenes.Jeanne.First = function() {
	var parse = {
		playername : player.name,
		name       : function() { return kiakai.name; },
		hisher     : function() { return kiakai.hisher(); }
	};
	
	Text.Clear();
	Text.Add("You make the trek up the final set of stairs into a large laboratory, every nook and cranny the home of some strange arcane device or alchemical concoction. Parchments and books are strewn about on tables and chairs, and a half-eaten meal is growing cold, forgotten on a bookshelf.", parse);
	Text.NL();
	Text.Add("At any other time, you might be fascinated to look closer at the various artifacts, find out what they are for, but right now, they form but a pale backdrop to the person standing in the middle of the room, poring over some documents thoughtfully. She is quite obviously not human; her unreal, exotic beauty visible in her long, pink hair and pointed ears. She is wearing a flimsy robe that does little to hide her shapely body, barely able to contain her huge breasts.", parse);
	Text.NL();
	Text.Add("The elven magician finally notices you, looking up and down at you through her thick lashes. She frowns slightly, clearly not expecting visitors. Turning to face you, her breasts bounce seductively.", parse);
	Text.NL();
	Text.Add("<i>”I do not recognize you,”</i> she says, her melodious voice sounding puzzled, <i>”are you from the castle?”</i> You tell her that you’re not, and explain why you are here, and who you are.", parse);
	Text.NL();
	Text.Add("<i>”I am indeed the court magician, Jeanne,”</i> the elf tells you, smoothing her dress. <i>”And how can I help you, [playername]?”</i>", parse);
	if(party.InParty(kiakai)) {
		Text.NL();
		Text.Add("Behind you, [name] peeks out, looking at the beautiful elf shyly. The magician smiles warmly at your companion, acknowledging [hisher] presence.", parse);
	}
	Text.Flush();
	
	Scenes.Jeanne.talkedGolem  = false;
	Scenes.Jeanne.talkedJeanne = false;
	Scenes.Jeanne.talkedGem    = false;
	
	Scenes.Jeanne.FirstPrompt();
}

Scenes.Jeanne.FirstPrompt = function() {
	var parse = {};
	//[Golem][Jeanne][Gem]
	var options = new Array();
	if(Scenes.Jeanne.talkedGolem == false) {
		options.push({ nameStr : "Golem",
			func : function() {
				Text.Clear();
				Text.Add("<i>”I was sure I sealed the tower,”</i> the elf says, looking perplexed. <i>”You say that you were attacked by a golem…?”</i> It looks like understanding slowly dawns on her, and she looks a bit apprehensive.", parse);
				Text.NL();
				Text.Add("<i>”Tell me, it did not… do anything to you, did it?”</i>", parse);
				Text.NL();
				if(golem.flags["Met"] == Scenes.Golem.State.Won_prevLoss) {
					Text.Add("Your blush must speak volumes, as the magician looks apologetic. <i>”I was afraid of that,”</i> she says in a small voice. <i>”I must have forgotten to deactivate the carnal spell on it.”</i>", parse);
				}
				else {
					Text.Add("You recount how you were attacked, but managed to defeat the guardian. To your surprise, the magician looks almost relieved.", parse);
					Text.NL();
					Text.Add("<i>”Ah, good, good. I think I have figured out what it was.”</i>", parse);
				}
				Text.NL();
				Text.Add("<i>”I do apologize for that,”</i> she bows her head, looking genuinely sorry. <i>”I have so much to do these days… but I still should not let stray magic linger. Especially not of that kind.”</i>", parse);
				Text.NL();
				Text.Add("<i>”If you wish, we can speak more about her later.”</i>", parse);
				Text.Flush();
				
				Scenes.Jeanne.talkedGolem = true;
				Scenes.Jeanne.FirstPrompt();
			}, enabled : true,
			tooltip : "Ask Jeanne about the golem guarding the tower."
		});
	}
	if(Scenes.Jeanne.talkedJeanne == false) {
		options.push({ nameStr : "Jeanne",
			func : function() {
				Text.Clear();
				Text.Add("<i>”It matters little to me who rules in Rigard, I have been here longer than they.”</i> The beautiful elf gestures to the laboratory around her. <i>”I’ve lived here for centuries, long before the current king came along with his silly ideas. And I will stay here, long after he is gone. There is so very much to learn about the world, and as long as the royals provide me with materials and stay out of my way, I give them advice.”</i>", parse);
				Text.NL();
				Text.Add("For centuries? The woman looks like she is in her thirties, mature but still possessing a stunning beauty. Once again, you are reminded that the age of elves cannot be judged by their looks. There is an iron glint in the magician's eyes as she adds: <i>”And if they do not like it, getting rid of me is going to be more trouble than it is worth.”</i>", parse);
				Text.NL();
				Text.Add("<i>”My research spans many fields, but I mainly study the properties of magic and alchemy.”</i>", parse);
				Text.Flush();
				
				Scenes.Jeanne.talkedJeanne = true;
				Scenes.Jeanne.FirstPrompt();
			}, enabled : true,
			tooltip : "Ask why an elf is serving the king of Rigard."
		});
	}
	if(Scenes.Jeanne.talkedGem == false) {
		options.push({ nameStr : "Gem",
			func : function() {
				Text.Clear();
				Text.Add("When you pull out the purple gemstone you carry, Jeanne’s eyes almost bulge in surprise.", parse);
				Text.NL();
				Text.Add("<i>”W-where in the… How- how did you find something like this?”</i> The solemn magician is suddenly giddy like a little girl. <i>”This is an amazing device… and a very important one too.”</i>", parse);
				Text.NL();
				Text.Add("In response to your puzzled look, she explains: <i>”This gem is a key. It has very little power left, but filled with enough magic, it could reopen the pathways to other realms!”</i> The magician quickly clears a spot on a nearby table, reverently placing the gemstone on it.", parse);
				Text.NL();
				Text.Add("<i>”I have seen something like this before, I would recognize the craftsmanship anywhere. This jewel was crafted by Alliser, the sage. He lived on Eden long, long ago, but suddenly disappeared while exploring a portal. I have never met the man, but his work is legendary.”</i> You confirm that the gem does indeed seem to have the power to open portals, but that you have no idea how it works. And from your previous experiences, you are not sure that you’d like to do so.", parse);
				Text.NL();
				Text.Add("<i>”You have met Uru and Aria? Those are very powerful spirits, you should be happy to still be alive! I am just glad that the old one has been sealed, and can no longer enter our world.”</i>", parse);
				Text.NL();
				Text.Add("You ask her what you can do with the gem.", parse);
				Text.NL();
				Text.Add("<i>”Right now, not much I am afraid. The gem can store large amounts magical power, but for it to be useful, you will need a more permanent energy source.”</i> She quickly scrawls down some notes on a parchment. <i>”You seem to be a resourceful person. I need you to go to the dryads glade in the forest and talk to the Mother Tree. She should be able to help you if you explain your cause.”</i> Jeanne briefly explains how to find the hidden glade.", parse);
				Text.NL();
				Text.Add("<i>”It is very important that you keep the gem safe. While it is invaluable, trying to sell it would not be a good idea. I sense a strong bond between you and this stone… I do not think anyone other than you could bring out its full potential. Another thing that I am afraid of is that should the gem falls into the wrong hands, it may even bring harm to you.”</i>", parse);
				Text.NL();
				Text.Add("Hmm. Perhaps you should stop just showing this thing to everyone you meet.", parse);
				Text.Flush();
				
				Scenes.Jeanne.talkedGem = true;
				Scenes.Jeanne.FirstPrompt();
			}, enabled : true,
			tooltip : "Ask the magician about the gemstone you carry."
		});
	}
	if(options.length > 0)
		Gui.SetButtonsFromList(options);
	else
		Gui.NextPrompt(Scenes.Jeanne.FirstCont);
}

Scenes.Jeanne.FirstCont = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>”Right now, getting a source of power for the gem is vital. I have been observing the recent events concerning the portals on Eden. Their disappearance is very worrying… and could have dire consequences. Something is stirring on Eden, and it seems to be absorbing magical power at a frightening rate. I have tried finding out what is causing this, but certain avenues previously available to me are no longer open since the portals closed.”</i>", parse);
	Text.NL();
	Text.Add("<i>”I would like more time to study the gem, and study you, but time is short. Once you have found a source of power for the keystone, meet me at the monument near the crossroads. It is a place of power, and might make summoning a portal easier. Please hurry, [playername].”</i>", parse);
	Text.NL();
	Text.Add("You thank her for her help, she’s given you a lot to think about.", parse);
	Text.Flush();

	world.TimeStep({minute: 30});
	Gui.NextPrompt();
}
