/*
 * 
 * Define Twins (fighting entity)
 * 
 */
function Twins(storage) {
	this.rumi = new Rumi();
	this.rani = new Rani();
	
	this.flags = {};
	this.flags["Met"] = Twins.Met.NotMet;
	this.flags["SexOpen"] = 0;
	
	this.terryTimer = new Time();
	
	if(storage) this.FromStorage(storage);
}

Twins.Met = {
	NotMet : 0,
	Met    : 1,
	Access : 2
};

Twins.prototype.Update = function(step) {
	this.terryTimer.Dec(step);
}

Twins.prototype.FromStorage = function(storage) {
	if(storage.rumi) this.rumi.FromStorage(storage.rumi);
	if(storage.rani) this.rani.FromStorage(storage.rani);
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
		
	this.terryTimer.FromStorage(storage.Ttime);
}

Twins.prototype.ToStorage = function() {
	var storage = {
	};
	storage.rumi  = this.rumi.ToStorage();
	storage.rani  = this.rani.ToStorage();
	storage.flags = this.flags;
	
	storage.Ttime = this.terryTimer.ToStorage();
	
	return storage;
}

Scenes.Twins = {};

// Schedule
Twins.prototype.IsAtLocation = function(location) {
	return true;
}






function Rumi() {
	Entity.call(this);
	
}
Rumi.prototype = new Entity();
Rumi.prototype.constructor = Rumi;

Rumi.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Rumi.prototype.ToStorage = function() {
	var storage = {
		
	};
	
	this.SavePersonalityStats(storage);
	this.SaveFlags(storage);
	
	return storage;
}

function Rani() {
	Entity.call(this);
	
	
}
Rani.prototype = new Entity();
Rani.prototype.constructor = Rani;

Rani.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Rani.prototype.ToStorage = function() {
	var storage = {
		
	};
	
	this.SavePersonalityStats(storage);
	this.SaveFlags(storage);
	
	return storage;
}

// TODO
Scenes.Twins.Interact = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Flush();
	
	//[Talk]
	var options = new Array();
	options.push({ nameStr : "Talk",
		func : Scenes.Twins.TalkPrompt, enabled : true,
		tooltip : "Talkie talkie."
	});
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Leave."
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Twins.TalkPrompt = function() {
	var parse = {
		playername : player.name
	};
	
	//[Thief]
	var options = new Array();
	if(rigard.Krawitz["Q"] >= Rigard.KrawitzQ.CaughtTerry) {
		options.push({ nameStr : "Thief",
			func : function() {
				Text.Clear();
				if(terry.flags["Saved"] <= Terry.Saved.TalkedMiranda) {
					Text.Add("You explain to them that you have been feeling guilty about the sentence of death decreed for the vulpine thief who inadvertently took the blame for your own raid on the Krawitz estate, as well as his own crimes there. You ask if they couldn't intervene somehow - at least to lighten his sentence, if they can't arrange a pardon?", parse);
					Text.NL();
					Text.Add("<i>“Well, I appreciate the fact that he robbed Krawitz, but it’s not so simple, [playername]. I don’t think-”</i>", parse);
					Text.NL();
					Text.Add("<i>“Sis?”</i> Rani interrupts his sister, looking at her. There is an unspoken conversation between the two before Rumi turns to you.", parse);
					Text.NL();
					Text.Add("<i>“We’ll see what we can do, but no promises,”</i> Rumi says. <i>“Meet us here tomorrow.”</i>", parse);
					Text.NL();
					Text.Add("You thank them for their efforts and excuse yourself, heading back to the main room of the inn.", parse);
					
					twins.terryTimer = new Time(0, 0, 0, 24 - world.time.hour);
					
					terry.flags["Saved"] = Terry.Saved.TalkedTwins1;
				}
				else if(terry.flags["Saved"] == Terry.Saved.TalkedTwins1) {
					Text.Add("You asked them how it went with helping that thief.", parse);
					Text.NL();
					Text.Add("<i>“We managed to work something out, but pardoning the thief is completely out of question, and there are a few terms to this deal,”</i> Rumi says.", parse);
					Text.NL();
					Text.Add("You had expected a full-pardon to be out of even their reach, and say as much. Still, at least he has his life; what are the terms they mentioned?", parse);
					Text.NL();
					Text.Add("Rumi clears her throat. <i>“We’ve arranged for him to be released under your care for you to instruct him and ensure he offers reparations for his misdeeds, so whatever he does once out will be your responsibility.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Of course we can’t expect him to just not run away once he’s free, so we had the court wizard prepare a special collar to aid you. A collar like this one,”</i> Rani adds, pointing at his neck.", parse);
					Text.NL();
					Text.Add("Rumi grins mischievously. <i>“The collar’s enchanted and will prevent him from running away or disobeying your orders, as long as you don’t order to him to do something that would purposefully harm himself.”</i>", parse);
					Text.NL();
					Text.Add("<i>“And he can’t harm you either. If he breaks one of these rules, the collar will unleash its magic and... disable him,”</i> Rani adds.", parse);
					Text.NL();
					Text.Add("<i>“We’ll let you figure out exactly how it does that,”</i> Rumi says, as the twins grin mischievously. <i>“Go to the jail in the castle grounds and present a guardsmen with this letter,”</i> Rumi says, handing you a sealed letter.", parse);
					Text.NL();
					Text.Add("<i>“And don’t forget to attach the collar,”</i> Rani adds, presenting you with the collar.", parse);
					Text.NL();
					Text.Add("You take the letter and the collar from the prince's hands. Tucking the letter away safely, you turn the collar around in your hands, looking it over. It certainly doesn't look as impressive as it sounds; it's nothing more than a simple leather band, with metallic tips for fixing it into place.", parse);
					Text.NL();
					Text.Add("<i>“Put this around his neck and say the activation word, 'Featherfall',”</i> Rumi says.", parse);
					Text.NL();
					Text.Add("Nodding your understanding, you carefully stow the collar away before thanking the royal twins for their efforts. That said, you make your excuses and depart.", parse);
					Text.NL();
					Text.Add("<b>Received enchanted collar!</b><br/>", parse);
					Text.Add("<b>Received royal letter!</b>", parse);
					terry.flags["Saved"] = Terry.Saved.TalkedTwins2;
				}
				// TODO
				else {
					Text.Add("PLACEHOLDER", parse);
					Text.NL();
					Text.Add("", parse);
					Text.NL();
					Text.Add("", parse);
					Text.NL();
					Text.Add("", parse);
				}
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : twins.terryTimer.Expired(),
			tooltip : Text.Parse("Ask them if they can intervene on behalf of the thief[death].", {death: terry.flags["Saved"] >= Terry.Saved.TalkedMiranda ? " on death row" : ""})
		});
	}
	Gui.SetButtonsFromList(options, true, Scenes.Twins.Interact);
}
