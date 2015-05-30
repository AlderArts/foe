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
	
	this.flags["Met"] = 0;

	if(storage) this.FromStorage(storage);
}
Aquilius.prototype = new Entity();
Aquilius.prototype.constructor = Aquilius;

Aquilius.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Aquilius.prototype.ToStorage = function() {
	var storage = {
		
	};
	
	this.SavePersonalityStats(storage);
	this.SaveFlags(storage);
	
	return storage;
}

// Schedule TODO
Aquilius.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Outlaws.Camp)
		return (world.time.hour >= 7 && world.time.hour < 22);
	return false;
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

