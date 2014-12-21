/*
 * 
 * Define Lucille
 * 
 */

Scenes.Lucille = {};

function Lucille(storage) {
	Entity.call(this);
	
	// Character stats
	this.name = "Lucille";
	
	this.body.DefFemale();
	
	this.flags["buy"] = 0;
	
	if(storage) this.FromStorage(storage);
}
Lucille.prototype = new Entity();
Lucille.prototype.constructor = Lucille;

Lucille.Buy = {
	No    : 0,
	First : 1,
	Deal  : 2
};

Lucille.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Lucille.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

// Flags

// Schedule
Lucille.prototype.IsAtLocation = function(location) {
	return true;
}

Scenes.Lucille.WhoreAftermath = function(name, cost) {
	cost = cost || 0;
	
	var parse = {
		name       : name,
		playername : player.name,
		skinDesc   : function() { return player.SkinDesc(); },
		coin       : Text.NumToText(cost)
	};
	
	var payFunc = function() {
		Text.Add("You reach for your coin purse and count how many coins you owe her.", parse);
		Text.NL();
		Text.Add("<i>”Pleasure doing business with you, [playername].”</i> Lucille accepts the money and somehow vanishes it in her bodice. <i>”I will look forward to your continued patronage.”</i>", parse);
		Text.Flush();
		
		party.coin -= cost;
		
		Gui.NextPrompt();
	}
	
	Text.Clear();
	Text.Add("You make your way back into the main chamber of the brothel, where you are met up with madame Lucille.", parse);
	if(lucille.flags["buy"] == Lucille.Buy.No) {
		Text.NL();
		Text.Add("<i>”Did you have an enjoyable time, [playername]?”</i> the sultry raven-haired beauty asks you. <i>”You seem more relaxed than back when you came in here… did [name] help you relieve some stress?”</i>", parse);
		Text.NL();
		parse["c"] = party.coin < cost ? "; too late, you notice it’s too light to cover the expenses" : "";
		Text.Add("Realizing what she’s after, you stretch for your coin-purse[c]. Tittering, Lucille shakes her head.", parse);
		Text.NL();
		Text.Add("<i>”Here at the Shadow Lady, we value returning customers, so we take good care of our clientele. First time is on the house.”</i> She leans closer, whispering. <i>”Besides, I think [name] would be crushed if you didn’t come back for another visit.”</i>", parse);
		Text.NL();
		Text.Add("This isn’t the way you expected this place to run… But hey, why say no to a freebie?", parse);
		Text.Flush();
		
		lucille.flags["buy"] = Lucille.Buy.First;
		
		Gui.NextPrompt();
	}
	else if(lucille.flags["buy"] == Lucille.Buy.First) {
		if(party.coin >= cost) {
			Text.NL();
			payFunc();
		}
		else {
			Text.Add(" She greets you and makes some small talk, asking for bedside gossip. You reach down into your pouch to retrieve the coin to pay for your time with [name]… only to realize that you are short.", parse);
			Text.NL();
			Text.Add("<i>”Worry yourself not, [playername],”</i> Lucille waves away your concerns, though her sly grin in no way eases your mind. <i>”We all make the accidental slip once in a while… but do not make this a recurring occasion.”</i> She makes a sweeping gesture to her establishment, drawing your attention to the many whores working under her, to her impressive clientele.", parse);
			Text.NL();
			Text.Add("<i>”We value quality here at the Shadow Lady, and quality costs money. I would of course personally never dream of imposing on you, but we do have a reputation to maintain. Should word get out that you can just walk out after not paying, could you imagine what kind of depraved place this would become?”</i> Her eyes sparkle mischievously.", parse);
			Text.NL();
			Text.Add("<i>”I’ll let you off this once… but should this happen again, I’d have to administer punishment, you understand?”</i> You shake your head, saying you do not.", parse);
			Text.NL();
			Text.Add("<i>”If you cannot provide the coin, I need to be reimbursed for the lost upkeep in some way… and I think I know just the thing for you.”</i> Pursing her lips, she puts her arm around you, snuggling up close. <i>”A rather popular event here at the Shadow Lady are the dancing shows,”</i> the dame confides, indicating the big stage. <i>”We put them up for free, but they bring in quite a good amount in tips.”</i>", parse);
			Text.NL();
			Text.Add("You ask if she’s expecting you to perform on the stage for her.", parse);
			Text.NL();
			Text.Add("<i>”In a way. You do not have to be a great dancer… just be yourself.”</i> She seductively trails one finger down your front as she lays out her plan. <i>”We will make a deal. If you cannot pay the fees, you will be part of an act. A public display of punishment, to show the other customers what awaits them should they be short on cash.”</i>", parse);
			Text.NL();
			Text.Add("<i>”I do not know if you’ve been introduced to Chester yet,”</i> she points across the room, indicating the bulky shark-morph bouncer near the front entrance. <i>”Around here, he is the muscle, the enforcer. When people make trouble, he intervenes. I could use the occasional reminder of his authority, however,”</i> she smiles to herself.", parse);
			Text.NL();
			Text.Add("<i>”This is what will happen. If you do not provide the money for the services you’ve paid for - or if you want to make an alternative form of payment - Chester here will bring you to the stage and make an example of you.”</i>", parse);
			Text.NL();
			Text.Add("A public beating? You frown. Lucille gives out a peal of laughter, shaking her head hurriedly.", parse);
			Text.NL();
			Text.Add("<i>”You forget where this is, [playername]. People come here for fun… to explore the carnal, the sexual. And that’s what you’ll give them.”</i> She leans in, whispering in your ear. <i>”He’ll take you up on stage and strip you off everything. He’ll start with your clothes, your gear, until nothing but bare [skinDesc] hides you from the watchful eyes of the crowd. Last, he’ll rob you of your dignity as he takes you. You can make it an act, put on a facade. You can pour out what you feel unaltered. Either way, he’ll fuck you with his rock-hard twin cocks. He’ll fuck you, and he <b>will</b> break you, for the enjoyment of the audience.”</i>", parse);
			Text.NL();
			Text.Add("She pulls back, her dark eyes glittering. <i>”Deal? If this isn’t acceptable, my prices aren’t that steep, and you’ll just have to make sure you never end up short...”</i>", parse);
			Text.NL();
			Text.Add("You’re troubled as she sways away, not sure what to make of this strange ‘offer’ of hers.", parse);
			Text.Flush();
			
			lucille.flags["buy"] = Lucille.Buy.Deal;
			
			Gui.NextPrompt();
		}
	}
	else {
		Text.NL();
		Text.Add("<i>”I trust that [name] was to your liking?”</i> she smiles knowingly, winking.", parse);
		Text.Flush();
		
		//[Pay][Shark]
		var options = new Array();
		options.push({ nameStr : "Pay",
			func : function() {
				Text.Clear();
				payFunc();
			}, enabled : true,
			tooltip : Text.Parse("Pay the [coin] you owe her.", parse)
		});
		options.push({ nameStr : "Shark",
			func : function() {
				Text.Clear();
				Text.Add("<i>”I’m sure you remember our deal,”</i> Lucille slowly replies at your refusal, licking her lips in anticipation. Before you can even react, you find yourself paralyzed, unable to lift even a finger as you’re lost in the hypnotic depths of Lucille’s eyes. The madame slowly sways past you, heading toward Chester by the entrance. <i>”I’ll enjoy watching this,”</i> she whispers as she passes by you, <i>”as I’m sure the other customers will as well.”</i>", parse);
				Text.NL();
				Text.Add("This isn’t mere allure; there’s something otherworldly behind your invisible bonds, and you find yourself completely powerless as you watch the shark-morph descends on you. Chester effortlessly lifts you off the ground, throwing you over his muscular shoulder as he takes you backstage.", parse);
				Text.NL();
				//TODO #Goto Shark Punishment
				Text.Add("PLACEHOLDER", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Refuse to pay and face the sharks instead."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
}
