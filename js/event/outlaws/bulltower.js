/*
 * Contains the "Blue roses" quest
 * 
 * Flags in outlaws
 */




/*
 * 
 * Bull tower area
 * 
 */

// Create namespace
world.loc.BullTower = {
	Courtyard : 
	{
		Yard : new Event("Courtyard"),
		Pens : new Event("Animal pens"),
		Caravans : new Event("Caravans")
	},
	Building : {
		Hall       : new Event("Main hall"),
		Cell       : new Event("Secure cell"),
		Office     : new Event("Small office"),
		Warehouse  : new Event("Warehouse"),
		Watchtower : new Event("Watchtower")
	}
};

// TODO areas

Scenes.BullTower = {};



/* TODO
 * #Initiates when Cveta is at 60 rel. (Consider rel requirements for Zenith as well?)

#Triggers when the player enters the outlaw camp in the evening.
 */
Scenes.BullTower.Initiation = function() {
	var parse = {
		playername: player.name
	};
	
	Text.Clear();
	Text.Add("The outlaw camp is always calmest at dawn and at dusk - the camp may never sleep, but it does have lulls when one shift of workers - be they hunters, sentries or otherwise - replaces another. It’s at one of these shift rotations that you arrive in the camp, feeling momentarily calmed by the brief surfeit of activity before you’re grabbed by the shoulder from behind.", parse);
	Text.NL();
	Text.Add("<i>“[playername].”</i> Zenith’s familiar, deep voice comes from behind you. <i>“What a pleasant surprise to find that you’ve arrived in our camp. In fact, I was just thinking of you when one of the lookouts spotted you coming. Do you have a moment to talk?”</i>", parse);
	Text.NL();
	Text.Add("It seems rather impolite to decline the outlaw leader, so you nod.", parse);
	Text.NL();
	Text.Add("<i>“Everyone’s waiting,”<i> he rumbles. <i>“Let’s go.”</i>", parse);
	Text.NL();
	Text.Add("What Zenith means by ‘everyone’ soon becomes clear: you’re led to his tent, and a small group has gathered within, clustered around the map table, sitting on anything and everything that can serve as a seat. You recognize Maria, Cveta, and a few others, but most of those present aren’t known to you. It seems like a pretty lively conversation’s going on, too.", parse);
	Text.NL();
	Text.Add("<i>“Well, the twins are said to be better than their father on the issue…”</i>", parse);
	Text.NL();
	Text.Add("<i>“And it’ll take decades for Rewyn to die and be succeeded, assuming he doesn’t do us the favor of getting killed off. You really want to live in the woods that long on a rumor that the children are going to be more fair-minded than their father? Even if they started working on reversing his policies before his body’s cold, the damage will have been done.”</i>", parse);
	Text.NL();
	Text.Add("<i>“I’m not convinced…”</i>", parse);
	Text.NL();
	Text.Add("<i>“Few with power ever actually want to give it up. You think that once Rewyn’s given the lands of us exiled nobles to his favorites, the new owners are just going to hand them over because Rumi or Rani say so?”</i>", parse);
	Text.NL();
	Text.Add("Zenith clears his throat. <i>“Ladies. Gentlemen.”</i>", parse);
	Text.NL();
	Text.Add("As one, morphs and pure humans alike turn their heads to acknowledge the outlaw leader’s arrival.", parse);
	Text.NL();
	Text.Add("<i>“Maria. Aquilius. Friends,”</i> he continues, motioning for you to find a seat, which you do. <i>“Thank you for being here on such short notice this evening. I would have asked you to come earlier, but I only received news on the matter a few hours ago.”</i>", parse);
	Text.NL();
	Text.Add("<i>“As most of you know, the royal guard blames us for the disappearance of Alaric two days ago. Of course, we had no hand in it, but these accusations necessisated our involvement in order to clear our name. I set Maria to the task immediately, with a little fieldwork of my own, and our discoveries were interesting, to say the least.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Hey, I don’t know any Alaric,”</i> someone calls from the back.", parse);
	Text.NL();
	Text.Add("<i>“I do,”</i> a well-dressed cat-morph replies. <i>“Bean-counter in the King’s Treasury, supposedly discovered someone was pocketing coins on the sly, was going to make a fuss about it. Is what I heard some little birds whisper, in any case.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Yes, Lady Radigaz, you’re very well-informed,”</i> Zenith says coolly. <i>“But if we can avoid further interruptions? Maria?”</i>", parse);
	Text.Flush();
	
	world.TimeStep({ minute : 30 });
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("Rising from her seat, Maria glances about the tent before speaking. <i>“I gathered my team and went to take a look around the place where he supposedly disappeared, close to the King’s Road. To make a long story short, we did find some leads… which brought us straight to Bull Tower. It’s supposed to have been abandoned for decades, but the place is crawling with guards. They seem to be trying to keep a low profile, but there’s no hiding that many men.”</i>", parse);
		Text.NL();
		Text.Add("<i>“And did you manage to take a look at these guards? Were they mercenaries? Did they seem competent?”</i> asks one of the assembly.", parse);
		Text.NL();
		Text.Add("<i>“Calm down, I’m getting there.”</i> Maria clears her throat. <i>“At first we considered the possibility of them being mercenaries, but they seemed too well disciplined. So I had one of my men take a closer look, and he recognized lieutenant Corishev of the royal guard talking to one of the sentries at the wall.”</i>", parse);
		Text.NL();
		Text.Add("The royal guard? What are they doing so far away from the castle district, let alone Rigard? Zenith looks down at his assembled audience, and nods.", parse);
		Text.NL();
		Text.Add("<i>“For those of you less learned in law, Bull Tower, abandoned though it is, is still Crown land. When it was decommissioned, responsibility for its care passed to the royal guard, although it was not to be  be manned, so far as I know… the sudden influx of guards posed an interesting question which we bent our minds to.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Lieutenant Corishev? He’s one of Preston’s head flunkies, there’s no way he’d be there without his commander knowing.”</i>", parse);
		Text.NL();
		Text.Add("<i>“The Shining doesn’t want to step any farther than the good end of the Merchants’ Street lest he get a smidge of dust on that breastplate of his,”</i> someone pipes up from the back.", parse);
		Text.NL();
		Text.Add("<i>“Not true. Didn’t he lead that band of his into the warehouse district to catch-”</i>", parse);
		Text.NL();
		Text.Add("Zenith claps his hands once, and the discussion is immediately shushed. <i>“Please, let’s have some respect for those who are speaking.</i>", parse);
		Text.NL();
		Text.Add("<i>“Well, I won’t bore you. Long story short, Maria and I think our man is in there. We will free him, clear our name, and sully the King’s <b>and</b> the royal guard’s - the former’s for having embezzlers in his employ, and the latter’s for trying to cover it up and pin the blame on us.</i>", parse);
		Text.NL();
		Text.Add("<i>“Yes, I know Bull Tower was built to be impregnable. However, we’ve come up with an idea that might work. If we can pull it off, we move another step toward the moral high ground, my friends. Amongst other things. That is all I wish of you today, my friends - to keep you informed. You may leave now.”</i>", parse);
		Text.Flush();
		
		world.TimeStep({ minute : 10 });
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("As you stand and make to leave with the small crowd flowing out of Zenith’s tent, though, another hand falls on your shoulder - smaller and lighter this time, but no less firm.", parse);
			Text.NL();
			parse["handsomebeautiful"] = player.mfFem("handsome", "beautiful");
			Text.Add("<i>“Going somewhere, [handsomebeautiful]?”</i>", parse);
			Text.NL();
			Text.Add("You half-turn, and Maria is there, smiling with apparent sweetness - and you’re pretty sure she hasn’t suddenly become taken with you. <i>“Zenith would appreciate it if you stayed a little longer.”</i>", parse);
			Text.NL();
			Text.Add("Well, it makes sense. He wouldn’t go to all the trouble of seeking you out just to have you hear him speak, right? A faint sense of foreboding welling up in the pit of your stomach, you sit back down and wait for the tent to empty of everyone save you, Zenith, Maria, and oddly enough, Cveta, who’s been seated near the back all the while, unruffled as always.", parse);
			if(party.Num() > 1) {
				var p1 = party.Get(1);
				parse["comp"]  = party.Num() == 2 ? p1.name : "Your companions";
				parse["s"]     = party.Num() == 2 ? "s" : "";
				parse["has"]   = party.Num() == 2 ? "has" : "have";
				parse["heshe"] = party.Num() == 2 ? p1.heshe() : "they";
				
				Text.Add(" [comp] look[s] about, clearly wondering if [heshe] should be here, then come[s] to the conclusion that if you’ve been invited, then so [has] [heshe].", parse);
			}
			Text.NL();
			Text.Add("Apparently, this still isn’t enough privacy for the outlaw leader. Gesturing for you to follow, he leads you to a corner and speaks in a low whisper.", parse);
			Text.NL();
			parse["t"] = party.InParty(terry) ? "-”</i> he gestures at Terry with a nonchalant wave of his hand - <i>“" : "";
			parse["b"] = outlaws.TurnedInBinder() ? " That your coming across Krawitz’s binder was no accident - which is why I didn’t question you when you passed it along to us." : "";
			Text.Add("<i>“I know that you probably don’t want this to be public knowledge, which is why I called you over. [playername], I know that you were involved in the heist on Krawitz’s place, that the Masked Fox [t]wasn’t the only one present that night.[b]”</i>", parse);
			Text.NL();
			Text.Add("You swallow hard. Just how long has he known?", parse);
			Text.NL();
			Text.Add("<i>“In such a place as Rigard, nothing goes unnoticed, for there are always eyes and ears about. Beggars. Street urchins. Laborers. Those beneath notice. Many willingly tell us what they’ve seen and heard, while others need their tongues loosened with a hot meal.”</i>", parse);
			Text.NL();
			Text.Add("With a pat on your shoulder and a smile, he walks you back as if nothing had happened, speaking in normal tones once more. <i>“[playername], you have a skill that we are in need of - that of infiltration. Our dear songstress here is also in the same position, albeit with a different ability we can bring to bear. Maria and I have come up with a plan to get through Bull Tower’s defenses, and it will require the both of you.</i>", parse);
			Text.NL();
			Text.Add("<i>“Bull Tower was designed to be impregnable and would normally be impossible to enter by stealth, especially since Preston has put a good number of his lackeys on perimeter guard. We’ll create a diversion, draw as much attention as we can and throw them off edge so you can enter. Once inside, it should be far easier for you to move about and find our man.”</i>", parse);
			Text.NL();
			Text.Add("Surely it can’t be that simple. Maybe you should ask for the details later.", parse);
			Text.NL();
			Text.Add("<i>“What does he look like?”</i> Cveta asks, and you realize it’s the first time she’s spoken throughout this whole exchange.", parse);
			Text.NL();
			Text.Add("Zenith scratches his chin. <i>“Small. Thin. Balding. Maria will draw you a sketch before you leave; she will also provide precise directions to the tower. Are there any questions?”</i>", parse);
			Text.Flush();
			
			world.TimeStep({ minute : 20 });
			
			Scenes.BullTower.InitiationQuestions();
		});
	});
}

Scenes.BullTower.InitiationQuestions = function(opts) {
	opts = opts || {};
	
	var parse = {
		playername : player.name
	};
	
	
	//[Presence][Plan][Binder][Leave]
	var options = new Array();
	if(!opts.presence) {
		options.push({ nameStr : "Presence",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Some sort of smuggling is my guess,”</i> Maria pipes up. <i>“I’ve spotted some of the royal guard hanging around the old fort from time to time since the beginning of the year, almost always escorting folk transporting goods or lugging the stuff themselves. I managed to jump one of the caravan parties after they’d left the tower, made it look like your standard highway holdup. Most of what they were carrying were luxury goods from outside Rigard. Cheeses, wine, fine fabrics, smokes, other odds and ends. None of them illegal, but all of them highly taxed.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Guards do not search their own,”</i> Cveta states flatly. <i>“Especially those that outrank them.”</i>", parse);
				Text.NL();
				Text.Add("Zenith nods. <i>“Or those who claim to be under the protection of such. It does seem like an open-and-shut case of tax evasion. If Bull Tower is being used as a waystation, it would make sense for them to hold Alaric there until one of the smugglers turns up to take him away.”</i>", parse);
				Text.Flush();
				
				world.TimeStep({ minute : 5 });
				
				opts.presence = true;
				Scenes.BullTower.InitiationQuestions(opts);
			}, enabled : true,
			tooltip : "Why is the royal guard out along the King’s Road, anyway?"
		});
	}
	if(!opts.plan) {
		options.push({ nameStr : "Plan",
			func : function() {
				Text.Clear();
				Text.Add("Zenith nods at your question. <i>“Our eyes and ears have informed us that there are a number of shipments slated to come in that night; we’ll divert the guards by attacking the last of the convoys along the King’s Road within sight of the tower. ", parse);
				if(party.Num() > 1) {
					parse["s"] = party.Num() == 2 ? "" : "s";
					Text.Add("Your companion[s] can join in if they like; we could use the help, especially if we’re to effect a good fighting retreat. ", parse);
				}
				Text.Add("The fact that it’s a diversion is something only Maria, I, and a few others know; everyone else will be informed it’s a raid - which it is as well.</i>", parse);
				Text.NL();
				Text.Add("<i>“Once they’re preoccupied with us, the two of you can waltz on in.”</i>", parse);
				Text.NL();
				Text.Add("You guess that means Cveta asks them nicely to let you pass.", parse);
				Text.NL();
				Text.Add("<i>“That’s correct. Since every pair of eyes still on the walls is going to be facing outwards toward us, things will be much easier for you. You’re not going to pass as a royal guard - I’m willing to wager everyone knows everyone - so don’t even try disguising yourself.</i>", parse);
				Text.NL();
				Text.Add("<i>“After you’re in, though, you’re on your own. No one has cared about the inside of Bull Tower for the last generation, and the royal guard has had time to make their own unofficial changes, if they’ve so desired. I’ve managed to acquire a copy of the floor plans, but they’re at least sixty years out of date.</i>", parse);
				Text.NL();
				Text.Add("<i>“What probably hasn’t changed, though, is that there’ll be a central yard and somewhere to stable animals. Everything else will be centered about the main watchtower. Cells below to hold troublemakers on the road - almost certainly where Alaric is being held, although you may have some searching to do. I’m afraid I can’t be of more help, [playername].”</i>", parse);
				Text.NL();
				Text.Add("You think a moment, and agree that from the way this fortress sounds, Zenith’s information is probably the best you’ll be getting. It’s not much, but it sounds like only the royal guard would have more.", parse);
				Text.Flush();
				
				world.TimeStep({ minute : 5 });
				
				opts.plan = true;
				Scenes.BullTower.InitiationQuestions(opts);
			}, enabled : true,
			tooltip : "So, what’s the plan? In detail, that is."
		});
	}
	if(!opts.obj && opts.presence) {
		options.push({ nameStr : "Objectives",
			func : function() {
				Text.Clear();
				Text.Add("Zenith and Maria look at each other for a moment, then the former shrugs and smiles. <i>“By all means, [playername]. Opportunities to screw Preston over are hard to come by, so feel free to be creative. Although I must remind you to focus on your primary goal and to take no unnecessary risks. Alaric comes first; everything else is secondary.</i>", parse);
				Text.NL();
				Text.Add("<i>“Concrete evidence of what the royal guard is up to within those walls - evidence that we can hang out in the street for all to see - now that would be a nice catch, if you can find any. Bring down Preston a peg or two.”</i>", parse);
				if(outlaws.TurnedInBinder()) {
					Text.NL();
					Text.Add("Zenith grunts, then looks thoughtful as he turns to you. <i>“Well, [playername], there is one more thing I need to mention. When we caught wind of this, I thought it would be prudent to give that binder of Krawitz’s - the one you so thoughtfully obtained for us - a detailed look-through. As it turns out, the contents of one of the inbound shipments written off as lost matched the wagons that Maria and her team took that night, down to the wine’s vintage. It’s circumstantial evidence, but it’s a lead as to why the royal guard is aiding and abetting smugglers.</i>", parse);
					Text.NL();
					Text.Add("<i>“I’m certain there’s more evidence to be found in Bull Tower itself, and with the numbers involved, as well as the fact that one only works with smugglers with payment on delivery… well, there’s likely to be some coin on hand in there, too.</i>", parse);
					Text.NL();
					Text.Add("<i>“Not that it tells us <b>where</b> it is, more’s the pity, but it’s better than stumbling around in the dark.”</i>", parse);
					Text.NL();
					Text.Add("Evidence, payoff. All right, you’ll keep an eye out for those while you’re sneaking about.", parse);
				}
				Text.Flush();
				
				world.TimeStep({ minute : 5 });
				
				opts.obj = true;
				Scenes.BullTower.InitiationQuestions(opts);
			}, enabled : true,
			tooltip : "If the royal guards have been lurking about for some time now, surely that means there’s more you can do…"
		});
	}
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			Text.Add("You decide you’re as ready as you’ll ever be, and say so.", parse);
			Text.NL();
			Text.Add("<i>“I will require a little time to make my preparations,”</i> Cveta says, turning to you. <i>“Meet me at nine in the evening, [playername], and we can be on our way.”</i>", parse);
			Text.NL();
			Text.Add("Woman of few words as ever, isn’t she?", parse);
			Text.NL();
			Text.Add("<i>“Well then,”</i> Zenith says, striding over to the tent flaps and undoing them to let you through, <i>“don’t let me keep you up. Good night, [playername]. Feel free to rest in our camp; you’ll need all your strength. No, Cveta, please sit down. I would have further words with you and Maria concerning the events of two evenings ago…”</i>", parse);
			Text.NL();
			Text.Add("Well, it seems that you’re done here. Once you’re ready, you should see Cveta about setting off.", parse);
			Text.Flush();
			
			world.TimeStep({ minute : 5 });
			
			Gui.NextPrompt();
			//TODO Set flag
		}, enabled : true,
		tooltip : "You’re about done here."
	});
	Gui.SetButtonsFromList(options, false, null);
}

