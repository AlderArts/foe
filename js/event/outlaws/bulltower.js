/*
 * Contains the "Blue roses" quest
 * 
 * Flags in outlaws
 * stats in outlaws.BT
 */

function BullTowerStats() {
	this.suspicion = new Stat(0);
	this.suspicion.debug = function() { return "Suspicion"; };
	
	this.stoleLantern = false;
	this.guardsDown = false;
};
BullTowerStats.prototype.Suspicion = function() {
	return this.suspicion.Get();
}
// outlaws.BT.IncSuspicion(100, 2.5);
BullTowerStats.prototype.IncSuspicion = function(max, inc) {
	this.suspicion.IncreaseStat(max, inc);
	
	//TODO check for exit states
}
// outlaws.BT.DecSuspicion(-100, 20);
BullTowerStats.prototype.DecSuspicion = function(min, dec) {
	this.suspicion.DecreaseStat(min, dec);
}


Outlaws.BullTower = {
	AlaricFreed     : 1,
	StatueDestroyed : 2,
	CaravansIgnited : 4,
	CaravansSearched : 8,
	AnimalsFreed    : 16
	
};


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

world.loc.BullTower.Courtyard.Yard.wait = function() { return false; };
world.loc.BullTower.Courtyard.Pens.wait = function() { return false; };
world.loc.BullTower.Courtyard.Caravans.wait = function() { return false; };
world.loc.BullTower.Building.Hall.wait = function() { return false; };
world.loc.BullTower.Building.Cell.wait = function() { return false; };
world.loc.BullTower.Building.Office.wait = function() { return false; };
world.loc.BullTower.Building.Warehouse.wait = function() { return false; };
world.loc.BullTower.Building.Watchtower.wait = function() { return false; };

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

/*
 * TODO
 * Moving Out

[Tower] - Head off to Bull Tower with Cveta.
 */
Scenes.BullTower.MovingOut = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	if(world.time.hour >= 21 || world.time.hour < 4)
		Text.Add("Although the flaps of Cveta’s tent are tightly drawn, you catch a glimpse of light at the seams. The songstress is still awake and presumably waiting for you so you can set off - would you like to do so?", parse);
	else
		Text.Add("You’ve arrived early, but you don’t think there are any more preparations you need to make. Maybe you could help Cveta or review the plan to make sure you’re in sync.", parse);
	Text.NL();
	Text.Add("<b>Remember that you will only have one try at this task; whether it meets with success or failure, there will be no retracing your steps, for what is done will remain done.</b>", parse);
	Text.Flush();
	
	var options = new Array();
	options.push({ nameStr : "Wait",
		func : function() {
			Text.Clear();
			Text.Add("You’re going to have only one shot at this. While time is of the essence here, it won’t do to head into the great unknown without making all the preparations you can; with that in mind, you step back and return to the middle of camp. You’ll be back when everything’s been taken care of.", parse);
			Text.NL();

			world.TimeStep({minute: 5});

			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "You still need to make a few more preparations."
	});
	options.push({ nameStr : "Move out",
		func : function() {
			Text.Clear();
			if(world.time.hour >= 21 || world.time.hour < 4)
				Text.Add("There’s no need to wait any longer; time’s a-wasting. Stepping towards Cveta’s tent, you practically run into the songstress as she emerges from within.", parse);
			else {
				Text.Add("<i>“You are here early, [playername],”</i> Cveta says, greeting you with a nod as you approach her tent. <i>“There are still some hours left before our departure.”</i>", parse);
				Text.NL();
				Text.Add("You didn’t want to risk missing out on the action, you explain.", parse);
				Text.NL();
				Text.Add("<i>“Perhaps it is for the best; there are still preparations everyone needs to make. Might I trouble you to make yourself useful until dusk?”</i>", parse);
				Text.NL();
				Text.Add("Indeed, as evening nears, the camp becomes abuzz with activity - blades put to the whetstone, bowstrings tested and replaced, orders given and bootstraps tightened. The atmosphere is military - save that there are no banners or formations. The raiding party numbers about thirty, with Maria at its head; most of them look quite eager to set out and to scratch that itch with a bit of action. While the raid may be intended as a diversion, it goes without saying that they intend to make it as profitable as possible.", parse);
				Text.NL();
				Text.Add("<i>“I hope fate is kind to them. They may treat their task with levity, but I would rather not have Aquilius do much work as a result of tonight’s venture.”</i>", parse);
				Text.NL();
				Text.Add("You turn to find Cveta standing beside you, having changed into clothes more suited for sneaking about.", parse);
			}
			Text.NL();
			Text.Add("Seeing her without her gown for once throws you off a little - without all that fabric to hide her figure, it’s plain how thin and tiny she really is. You eye the simple blouse and leggings she’s donned, plain gray against an equally unremarkable brown, and have to concede that so long as Cveta doesn’t open her mouth or look anyone in the eye, she might pass for… well, someone of lower stature. Not a commoner - even when trying to hide it, she moves with far too much elegance for that - but perhaps a merchant’s daughter…", parse);
			Text.NL();
			Text.Add("Odd, though, that she’s kept the gloves. Come to think of it, there hasn’t been a single time that you’ve seen her without them.", parse);
			Text.NL();
			Text.Add("The songstress’ voice slices cleanly through your thoughts. <i>“Are we ready?”</i>", parse);
			Text.NL();
			if(party.Num() > 1) {
				var p1 = party.Get(1);
				parse["comp"]   = party.Num() == 2 ? p1.name     : "your companions";
				parse["himher"] = party.Num() == 2 ? p1.himher() : "them";
				parse["heshe"]  = party.Num() == 2 ? p1.heshe()  : "they";
				Text.Add("Just one more thing, you tell Cveta, then turn to [comp], asking [himher] to wait for you here in the outlaws’ camp; if [heshe]’d like, [heshe] can ask Zenith to join in on the raid. Sneaking around alone is already hard enough, two is a crowd, and any more would be impossible. With that out of the way, you turn back to the songstress.", parse);
				Text.NL();
			}
			Text.Add("You tell Cveta that you’re prepared, and she nods. <i>“I visited Maria earlier and got the requisite items.”</i> She produces two slips of paper, one with directions to the tower and the other a sketch of a sad-faced, balding man. <i>“Let us not tarry. The night is short.”</i>", parse);
			Text.NL();
			Text.Add("With that, she turns, leading the way. She’s careful to never venture more than a half-step ahead, politely allowing you the illusion that you know where you’re going too. The lookouts on duty lower the drawbridge, and crossing the  trenches, you’re on your way.", parse);
			Text.Flush();
			
			world.TimeStep({hour: 1});
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("The trip to the King’s Road is uneventful; the two of you slip through the thick undergrowth out of the forest. The road is clear, largely devoid of travellers, and well-lit under the clear, cloudless sky. Off in the distance, the many lights of Rigard flicker and twinkle, the city drowsy but never quite falling asleep.", parse);
				Text.NL();
				Text.Add("The further you get from Rigard, the less maintained and wilder the road becomes; it remains paved, but you notice the occasional pothole and missing flagstone, while the surrounding vegetation becomes coarser and more overgrown. You’d have guessed that the main route connecting Rigard and the Free Cities would be better maintained. Perhaps this is just a neglected patch, with no one living nearby to take responsibility for its upkeep.", parse);
				Text.NL();
				Text.Add("Another half-hour along the road and one sleepy-looking patrol later, the walls of Bull Tower draw into sight, thick and rising tall despite their age, clearly illuminated by the moonlight. Thin vines crisscross the old stone and mortar like veins across skin, and in the middle of it all, a singular watchtower stands above the walls, stiff and stout as it deeply penetrates the heavens.", parse);
				Text.NL();
				Text.Add("You’re not the only ones present, though. Even at this distance, you spot silhouettes moving atop the ramparts, and the gate - an immense archway a little ways away from the main trunk of the King’s Road - is flanked by two figures. From woodland cover to the thick, waist-high undergrowth to the shadow of the high, ancient walls, both of you creep closer and closer to the gate and its watchers. They are two pure humans, dressed in simple, unmarked clothes, with no visible armor, but by the way they carry themselves and handle their pikes, it’s clear that they’re used to handling their weapons.", parse);
				Text.NL();
				Text.Add("These must be the guards, then - you didn’t expect that they’d be in uniform, did you? Signaling for Cveta to wait, you take cover in the shadows and sneak as close as you dare, finding a good patch of undergrowth to crouch in and spy on the men. They’re clearly on edge and more than a little twitchy, constantly glancing around and fidgeting. After about ten minutes of waiting, you’re rewarded with the sound of faint clacking of hooves and wooden wheels on stone, growing steadily louder as its source draws closer: a single wagon. Its driver leans down and whispers something to the guards, receiving a reply in return; while you can’t make out the words at this distance, the tone is nevertheless urgent.", parse);
				Text.NL();
				Text.Add("<i>“...patrol... return later... give or take an hour or two... let you through first. Don’t drop that, it’s an important delivery.”</i>", parse);
				Text.NL();
				Text.Add("With that, the guards wave the wagon through and resume their vigil, peering intently into the night. Whatever it was that they were looking for, it wasn’t the wagon - and hopefully it’s not you. A knot twisting in the pit of your stomach, you stealthily withdraw from your hiding place and make your way back to Cveta, briefly relaying what you’ve seen. She folds her arms and clicks her beak impatiently, glancing down the road, into the distance.", parse);
				Text.NL();
				Text.Add("<i>“Where is Zenith?”</i>", parse);
				Text.NL();
				Text.Add("Cveta’s question is answered by an explosion that lights up a whole stretch of the King’s Road about two miles down the road from the tower. Even from ground level, it’s starkly visible - how much more it must be, then, for anyone watching from the ramparts. The flash of light is followed by a dull, thunderous roar that sweeps across the grasslands and plains, reminding you of an approaching thunderstorm.", parse);
				Text.NL();
				Text.Add("While you can’t tell if it’s of alchemical or magical origin, the enormous orange cloud of flame and smoke that rises into the air is conspicuous enough to do its job. Shouts erupt from within the fortress, followed by the clatter of boots on the ground. In less than five minutes, an entire squad of plainclothes guardsmen have pass you by at a quick march, heading directly for the source of the explosion, disappearing rapidly in the gloom. You’re not in any position to see any of the actual fighting that must be taking place, but the night air carries the shouts and screams well enough; it’ll only get worse when the squad arrives.", parse);
				Text.NL();
				Text.Add("This is it, then. You point at the guards posted by the gate, and Cveta nods in understanding. Though you know what the songstress can do, it’s still a little bizarre seeing her step out of the shadows and glide down the path to the tower on airy footsteps. To be frank, the whole thing feels  melodramatic, Cveta painting a stark silhouette in the silver moonlight.", parse);
				Text.NL();
				Text.Add("If she wanted to draw their attention, she’s definitely managed to do it - the gate guards straighten their backs and clutch their pikes with a little more vigor, practically standing at attention, but they evidently don’t think her a threat, or they’d be running off to raise the alarm.", parse);
				Text.NL();
				Text.Add("<i>“Halt! Who goes there?”</i>", parse);
				Text.NL();
				Text.Add("Cliched, but it gets the point across.", parse);
				Text.NL();
				Text.Add("<i>“Maybe she’s one of the things that Majid ordered and wandered over when the caravan blew up. You know...”</i> the other says, not taking his eyes off Cveta. <i>“You. State your name and business-”</i>", parse);
				Text.NL();
				Text.Add("<i><b>“We are familiar faces.”</b></i>", parse);
				Text.NL();
				Text.Add("The way Cveta says it… her voice is light and airy, rippling through the air. The effect it  have on the gate guards is immediate. Ready to spring out and aid the songstress at the first sign of trouble, you watch as they shake and grunt, clearly struggling against the compulsion.", parse);
				Text.NL();
				Text.Add("Then, after the pain, a release: <i>“My friend and I are amongst the smugglers expected here tonight; we are merely escaping the bandits who attacked our transport. The two of you desire to let us through, so you can return to your warm beds as soon as possible with a minimum of trouble. You are glad to have pulled guard duty instead of having to respond to the attack further down the road.”</i>", parse);
				Text.NL();
				Text.Add("The guards waste no time in taking the avenue of escape afforded to them; they visibly sag with relief, leaning on their pikes and waving Cveta onward through the gates. You step out of the shadows to join her, and the two of you quickly slip past the guards and through the ancient stone walls.", parse);
				Text.NL();
				Text.Add("<i>“Sometimes, it is easier to divert the flow of a river than to dam it,”</i> Cveta whispers to you as both of you pass through the old, crumbling gate. <i>“As my father said, it is often not a good idea to cut off an enemy from all avenues of retreat. They would have been much harder to sway if I had ordered them to let us through and not notice our presence at all.”</i>", parse);
				Text.NL();
				Text.Add("As opposed to seeing her and thinking she was expected?", parse);
				Text.NL();
				Text.Add("Cveta nods. <i>“Right. Nevertheless, we have limited time to act. The moment that squadron returns is the moment our game is up. We will have to move quickly, but not rashly.”</i>", parse);
				Text.NL();
				Text.Add("With that thought in mind, you step into the deserted main courtyard of Bull Tower, the main structure of the ancient outpost standing before you, a remnant of a time when Eden was wilder and yet more prosperous. The shadows cast by the walls are as thick on the inside as they are on the outside, and it is into the cover of these that the two of you dive, taking a moment to catch your breaths and plan your next move.", parse);
				Text.Flush();
				
				party.SaveActiveParty();
				party.ClearActiveParty();
				
				party.SwitchIn(player);
				party.AddMember(cveta, true);
				
				party.RestFull();
				
				outlaws.BT = new BullTowerStats();
				
				MoveToLocation(world.loc.BullTower.Courtyard.Yard, {hour: 3});
			});
		}, enabled : true,
		tooltip : "You’re as ready as you’ll ever be."
	});
	Gui.SetButtonsFromList(options, false, null);
}


/*
 * Dungeon starts here
 */
world.loc.BullTower.Courtyard.Yard.description = function() {
	Text.Add("You are standing in the main courtyard of Bull Tower, flanked by high walls on three sides and the old watchtower to the north. The gates - the only way in or out of the old fortress - lie to the south, watched over by the two guards whom Cveta ‘persuaded’ to let you in. The effects of age and neglect are clearly visible in the appearance of the grounds  - the old training field is overgrown with weeds and wildflowers, and while the walls are still solid, bits of crumbling masonry lie at the base.");
	Text.NL();
	if(outlaws.flags["BT"] & Outlaws.BullTower.StatueDestroyed) {
		Text.Add("The results of your heroic vandalism of Preston’s statue lie plain for all to see, and you can’t help but take a second or two to savor your handiwork. Toppled and smashed, only the feet remain attached to the plinth - the main body of the statue has been reduced to several chunks of marble, and the head has disappeared somewhere in the overgrown training field.");
		Text.NL();
		Text.Add("It’s a very poignant scene.");
	}
	else {
		Text.Add("Dumped not too far from the gate - perhaps due to its clearly hefty weight - is a gigantic marble statue of Preston, the bottom wrapped in canvas and secured with rope for transport. This clearly isn’t its final destination. The artist has embellished Preston quite a bit - well, a lot. The man’s apparently replaced a good fifteen pounds of fat with muscle since you last saw him, if the statue’s to be believed. However, the ground beneath it isn’t quite even - probably an oversight of whoever offloaded it here, one that could  perhaps be turned to your advantage…");
	}
	Text.NL();
	Text.Add("From your hiding spot, you can see a set of animal pens - to call them stables would be too generous - to the west, and a sheltered courtyard to the east.");
	Text.NL();
	if(outlaws.flags["BT"] & Outlaws.BullTower.CaravansIgnited) {
		Text.Add("Remains of the smugglers’ wagons you set aflame give off thin trails smoke that dissipate somewhere in the dark. While the courtyard’s roof is keeping it somewhat contained, someone is going to notice the smoke sooner or later.");
		Text.NL();
	}
	Text.Add("You take a moment to consider what you should do next.");
}


//[Animal Pens][Caravan][Enter][Statue][Slip Out]
world.loc.BullTower.Courtyard.Yard.links.push(new Link(
	"Enter tower", true, true,
	null,
	function() {
		MoveToLocation(world.loc.BullTower.Building.Hall, {minute: 5});
		outlaws.BT.IncSuspicion(100, 2.5);
	}
));
world.loc.BullTower.Courtyard.Caravans.links.push(new Link(
	"Caravans", true, true,
	null,
	function() {
		MoveToLocation(world.loc.BullTower.Courtyard.Caravans, {minute: 5});
		outlaws.BT.IncSuspicion(100, 2.5);
	}
));
world.loc.BullTower.Courtyard.Yard.links.push(new Link(
	"Animal Pens", true, true,
	null,
	function() {
		MoveToLocation(world.loc.BullTower.Courtyard.Pens, {minute: 5});
		outlaws.BT.IncSuspicion(100, 2.5);
	}
));

world.loc.BullTower.Courtyard.Yard.events.push(new Link(
	"Statue", function() {
		return !outlaws.flags["BT"] & Outlaws.BullTower.StatueDestroyed;
	}, true,
	null,
	function() {
		var parse = {
			playername: player.name
		};
		
		Text.Clear();
		Text.Add("You give Preston’s statue another look-over. If not for the fact that you know better, the depiction of the man could almost be called noble. The statue’s forward pose, the pure white marble it’s made of, the literally chiseled features… it’s absolutely nothing like the Preston who burst into the warehouse and claimed credit for Miranda’s catch for himself.", parse);
		Text.NL();
		Text.Add("A pretentious statue for a pretentious man. Very fitting. The more you look at it, though, the more you feel it would look, much, much better in several pieces. With the way it’s balanced right now, wrapped up and bound on uneven ground, it’s truly itching for a good hurting. Just a little push in the right direction…", parse);
		Text.NL();
		Text.Add("You hear Cveta click her beak as she steps up to your side. <i>“I take it that your thoughts and mine are aligned with regards to this pompous travesty?”</i>", parse);
		Text.NL();
		Text.Add("Why yes, you do believe they are. ", parse);
		if(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed) {
			Text.Add("Even Alaric appears grimly pleased at the prospect, the little bean counter’s lips thin and straight, his eyes hard.", parse);
			Text.NL();
			Text.Add("<i>“I’ll gladly help too,”</i> he says. <i>“I know I won’t get the chance to actually put a fist to Preston’s jaw, so this’ll have to do. And I daresay I deserve it.”</i>", parse);
			Text.NL();
			Text.Add("Well, since you’ve done what you came to do, there’d probably be no harm in you engaging in a little heroic vandalism. You’re on your way out already, and anything that distracts the royal guards from pursuit would be helpful. Will you do it?", parse);
		}
		else {
			Text.Add("It certainly is tempting to topple the statue and smash it into a thousand tiny pieces, but the resulting noise would probably attract a lot of attention. Nevertheless, if you’re really determined, you <i>could</i> do so anyway. Will you topple the statue?", parse);
		}
		Text.Flush();
		
		//[Yes][No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				Text.Clear();
				var sus;
				if(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed) {
					Text.Add("<i>“Let’s get started, then!”</i> Alaric says, a twinge of vindictive glee in his voice. Without further ado, the three of you stride up to the statue’s base and, on a count of three, give it an experimental push. It wobbles a little, which is all the encouragement you need to set it to rocking dangerously. The statue’s fate is sealed - one final shove, good and hard, and it tips off-balance and tumbles from its plinth. Weeks, perhaps months’ worth of work by an artisan sculptor ruined in a matter of minutes, Preston’s chiseled form shattering into an assortment of fragments both large and small when it hits the ground.", parse);
					Text.NL();
					Text.Add("It’s a while before the echoes fade, contained within the high walls as they are. Without anything to hold onto, the ropes and canvas that once bound the statue lie loose in the dirt, and Alaric’s found the statue’s disembodied head; as you watch, he punts it into the tall grass with a savage kick. There’s a surprising amount of strength in that small frame of his - won’t he hurt his foot like that?", parse);
					Text.NL();
					Text.Add("You turn to Cveta, but she shakes her head. <i>“Let him vent his frustration, [playername]. We should be leaving soon. I suppose I should do my part, too.”</i>", parse);
					Text.NL();
					Text.Add("As you watch, Cveta produces a small stick of charcoal from a pocket. Focusing her attention on the dim light, she sketches the outlaws’ symbol - a stylized paw - on the toppled plinth with a few broad strokes. <i>“That should suffice. With that, I suggest that we vacate the premises posthaste - better to leave on our own terms rather than being forced to flee.”</i>", parse);
				}
				else {
					Text.Add("To the wind with caution! You want to see Preston’s face smashed so badly that you’re willing to take this risk. Pressing your back against the marble statue, you give it an experimental push. The effort is rewarded when you find it rocks slightly on the uneven ground, and you note with grim satisfaction that it could probably be toppled. Maybe not by you alone, but with Cveta helping…", parse);
					Text.NL();
					Text.Add("Their carelessness, your gain. Cveta looks a little uneasy about the idea, but eventually gives in and follows your lead, pushing her slight frame against the statue. She doesn’t add very much, but it’s enough to tip the scales and send it careening to the ground where it shatters into a thousand pieces with a mighty crash. It takes a good while for the echoes to fade - while someone has definitely heard that and will eventually arrive to investigate, smashing that statue felt <i>good</i>, didn’t it?", parse);
					sus = true;
				}
				Text.Flush();
				
				world.TimeStep({minute: 20});
				outlaws.flags["BT"] |= Outlaws.BullTower.StatueDestroyed;
				
				Gui.NextPrompt();
				if(sus)
					outlaws.BT.IncSuspicion(100, 20);
			}, enabled : true,
			tooltip : "Time for some heroic vandalism!"
		});
		options.push({ nameStr : "No",
			func : function() {
				Text.Clear();
				Text.Add("Despite you being sorely tempted to send the likeness of that pompous ass careening to the ground, you stay your hand for now and step back from the statue. Now’s not the time to give in to impulses of petty vindictiveness.", parse);
				if(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed) {
					Text.NL();
					Text.Add("<i>“Oh?”</i> Cveta says, seeing you change your mind. <i>“Is there something you still need to accomplish in this place, [playername]? Time does grow short - we should keep backtracking to a minimum, lest we overstay our welcome.”</i>", parse);
				}
				Text.Flush();
				
				world.TimeStep({minute: 5});
				
				Gui.NextPrompt();
				outlaws.BT.IncSuspicion(100, 2.5);
			}, enabled : true,
			tooltip : "Nah, it can wait."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
));

world.loc.BullTower.Courtyard.Yard.links.push(new Link(
	"Slip out", true, true,
	null,
	function() {
		var parse = {
			
		};
		
		Text.Clear();
		if(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed) {
			Text.Add("With Alaric freed and the main objective of your mission completed, you could leave the fortress with a clean conscience - and it would be best to do so before the diversion runs its course and you’re forced to make a desperate escape. Best to quit while you’re ahead, as the saying goes.", parse);
			Text.NL();
			Text.Add("With that in mind, will you really leave the fortress now?", parse);
			Text.Flush();
			
			//[Yes][No]
			var options = new Array();
			options.push({ nameStr : "Yes",
				func : function() {
					Scenes.BullTower.SlipOut();
				}, enabled : true,
				tooltip : "Best leave while still ahead."
			});
			options.push({ nameStr : "No",
				func : function() {
					Text.Clear();
					Text.Add("The urge to leave the tower grounds is strong - the less you linger, the smaller the chance you’ll be detected, after all - but you fight the impulse to flee. There’s still work to be done here.", parse);
					Text.Flush();
					
					Gui.NextPrompt();
				}, enabled : true,
				tooltip : "There’s still work to be done here."
			});
			Gui.SetButtonsFromList(options, false, null);
		}
		else {
			Text.Add("You look at the open archway and drawn portcullis. It’s true you could leave now, but you still haven’t accomplished what you set out to do. Retreat is not an option at this point, especially not with Cveta watching you and the fact that if you left now, you’d have a really hard time trying to explain things to Zenith.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}
	}
));



world.loc.BullTower.Courtyard.Caravans.description = function() {
	Text.Add("Off to the east of the main tower building, this small courtyard is roofed, presumably to keep the wind and rain off carts, carriages and wagons parked in it. However, age has caused the roof to fall apart in places, allowing moonlight to shine through holes in the old masonry work.");
	Text.NL();
	if(outlaws.flags["BT"] & Outlaws.BullTower.CaravansIgnited) {
		Text.Add("The wagons are still alight - all that wood, oilcloth and canvas will sustain a lovely low fire that’ll burn till dawn. You can only hope that no one will actually notice it until you and Cveta have made your escape, and that the guards won’t come to their senses from all the heat and smoke wafting over and raise the alarm.");
	}
	else {
		Text.Add("The dust on the wagons’ wheels is still fresh - you guess that they can’t have been here more than a few hours. With sides painted a dark gray, presumably to be less visible at night, it’s unlikely that this is just another trading caravan.");
		Text.NL();
		Text.Add("One of the wagons has its rear end facing toward you, and you can see that it’s largely empty - at least of any visible cargo. If anything was brought here, it’s been offloaded to who knows where.");
		Text.NL();
		if(outlaws.BT.guardsDown)
			Text.Add("Now that the guards have been dealt with, you can do as you please with the contraband caravan.");
		else
			Text.Add("Four guards have been posted by the wagons - clearly the home guard while everyone else’s out on the road; they fidget and glance about nervously from time to time, but don’t budge from their posts. If you want to get at the wagons, you’ll have to find a way to deal with them first.");
	}
}

world.loc.BullTower.Courtyard.Caravans.links.push(new Link(
	"Courtyard", true, true,
	null,
	function() {
		MoveToLocation(world.loc.BullTower.Courtyard.Yard, {minute: 5});
		outlaws.BT.IncSuspicion(100, 2.5);
	}
));

world.loc.BullTower.Courtyard.Caravans.events.push(new Link(
	"Guards", function() {
		return !(outlaws.BT.guardsDown);
	}, true,
	null,
	function() {
		var parse = {
			playername : player.name
		};
		
		Text.Clear();
		Text.Add("Creeping as close as the shadows will allow, you spy on the caravan guards. Like their fellows at the gates, none of them are actually in uniform, but the unmarked armor they wear is solid and they look comfortable with their weapons - it’d be reasonable to assume that they aren’t greenhorns. With them stretched out in a line across the entrance to the courtyard, it looks like there’s going to be no sneaking past them - you’ll have to take them out if you want to get to the wagons.", parse);
		Text.NL();
		Text.Add("A few possibilities present themselves; what will you do?", parse);
		Text.Flush();
		
		//[Sneak][Distract][Lull][Back]
		var options = new Array();
		options.push({ nameStr : "Sneak",
			func : function() {
				Text.Clear();
				Text.Add("You outline your plan to Cveta: sneak in as close as possible, wait for an opening and take out as many of the guards as you can before they can react. The songstress looks a little uncertain at the idea, but you reassure her of your confidence in your abilities.", parse);
				Text.NL();
				Text.Add("<i>“Well,”</i> she says at last. <i>“I shall trust you to know what you are doing. Please, make your move; I will be right behind you.”</i>", parse);
				Text.NL();
				Text.Add("Nodding, you creep closer and closer to the nearest guard until you’re at the very edge of the shadows; about thirty paces lie between you and him. Seconds tick by - although they may very well have been hours, for how slowly they pass - and the moment he turns his gaze, you burst out of your hiding place at a sprint, making a beeline for him.", parse);
				Text.NL();
				
				var enemy = new Party();
				enemy.AddMember(new Footman());
				enemy.AddMember(new Footman());
				
				var dex = player.Dex() + Math.random() * 20;
				if(dex >= 70) {
					Text.Add("Your feet are light, your steps like the wind; bursting out of the shadows like an arrow loosed from a bow, you manage to strike the guard closest to you on the head, taking him out. His friend whips around, eyes wide with surprise. Before he can manage to move, you take him out in the same fashion and are ready with your weapon drawn as the remaining two guards turn on you and Cveta.", parse);
					//#Start 2 guard combat
				}
				else {
					Text.Add("Unfortunately, you’re simply too slow to get the drop on the guards. Though you’re moving as fast as your feet will carry you, they’ve long noticed you coming and are ready to welcome you with their pikes. Gritting your teeth, you prepare yourself for battle.", parse);
					//#Start 4 guard combat
					enemy.AddMember(new Footman());
					enemy.AddMember(new Footman());
				}
				Text.Flush();
				
				var enc = new Encounter(enemy);
				
				enc.canRun = false;
				enc.onLoss = Scenes.BullTower.GuardsLoss;
				enc.onVictory = Scenes.BullTower.GuardsWin;
				
				Gui.NextPrompt(function() {
					enc.Start();
				});
			}, enabled : true,
			tooltip : "Sneak up to the guards and knock them out."
		});
		options.push({ nameStr : "Distract",
			func : function() {
				Text.Clear();
				Text.Add("You briefly outline your plan to Cveta: distract the guards so they’re looking the other way, then sneak up on them from behind and take them out with a minimum of fuss.", parse);
				Text.NL();
				Text.Add("<i>“And what do you hope to distract them with? I doubt that they are the sort to go chasing a thrown rock.”</i>", parse);
				Text.NL();
				Text.Add("Well, she can do it with her voice, can’t she?", parse);
				Text.NL();
				Text.Add("<i>“Pardon?”</i>", parse);
				Text.NL();
				Text.Add("She can circle around to the other side and make a little noise; since the guards are already on edge with one of the caravans under attack, it shouldn’t be too hard to ‘persuade’ them to investigate and draw them away from their posts. When they have their backs turned to you, you’ll come up from behind and take out as many of them as you can.", parse);
				Text.NL();
				Text.Add("<i>“Yes, I can do that. Give me a few moments, please.”</i>", parse);
				Text.NL();
				Text.Add("With that, Cveta creeps off, disappearing through the shadows and into the overgrown weeds that cover much of the tower grounds. It’s a minute or so before anything else happens, but it’s unmistakable when it does: a barely audible song tugs at your consciousness, beckoning you over.", parse);
				Text.NL();
				Text.Add("Even though you know it’s Cveta, it takes a noticeable effort to restrain yourself from wandering over to investigate the faint singing. Not that you have to hold back for long - the guards are already being drawn in by Cveta’s music, although they’re still cautious in approaching her hiding spot.", parse);
				Text.NL();
				Text.Add("Now that they have their backs turned, it’s time for you to make your move. Breaking into a light-footed run, you make a beeline for the guard closest to you, ready to knock him out.", parse);
				Text.NL();
				
				var enemy = new Party();
				enemy.AddMember(new Footman());
				enemy.AddMember(new Footman());
				
				var intel = player.Int() + Math.random() * 20;
				
				if(intel >= 70) {
					Text.Add("Distracted as they are, the guards don’t see or hear you coming. You strike the first guard on the head and bring him down with ease; the second is brought down with a bit of a scuffle and you’re ready for the third and fourth as they round on you. Gritting your teeth, you get ready for combat, Cveta emerging from the grass to back you up.", parse);
					//#Start 2 guard combat
				}
				else {
					Text.Add("Distracted as they are, the guards nevertheless manage to hear you coming and spin to face you, just barely drawing their weapons to mount a hasty defense. Seeing your ruse fail, you grit your teeth and prepare for battle, with Cveta emerging from the shadows to back you up.", parse);
					//#Start 4 guard combat
					enemy.AddMember(new Footman());
					enemy.AddMember(new Footman());
				}
				Text.Flush();
				
				var enc = new Encounter(enemy);
				
				enc.canRun = false;
				enc.onLoss = Scenes.BullTower.GuardsLoss;
				enc.onVictory = Scenes.BullTower.GuardsWin;
				
				Gui.NextPrompt(function() {
					enc.Start();
				});
			}, enabled : true,
			tooltip : "Try to trick the guards to turn the other way and jump them from behind."
		});
		options.push({ nameStr : "Lull",
			func : function() {
				Text.Clear();
				Text.Add("You quickly assess the situation and ask Cveta if she can put her talents to use here. Ordering these particular sentries away like she did with the gate guards might be useful.", parse);
				Text.NL();
				Text.Add("<i>“I am not sure that would be the best course of action,”</i> Cveta replies after studying the guards herself. <i>“It is unlikely that they are expecting anyone at this time… but I think they do look a little tired.”</i>", parse);
				Text.NL();
				Text.Add("Well, what does she intend, then?", parse);
				Text.NL();
				Text.Add("<i>“I will encourage them to give in to their fatigue. It is but Preston’s own fault if he overworks his men to the point that they fall asleep on the job. Would you please cover your ears, [playername]?”</i>", parse);
				Text.NL();
				Text.Add("Good idea. You don’t want to be falling asleep yourself. Covering your ears with your hands, you look on as Cveta takes a few breaths before launching into a soothing lullaby, projecting her voice directly at the sentries.", parse);
				Text.NL();
				
				var enemy = new Party();
				enemy.AddMember(new Footman());
				enemy.AddMember(new Footman());
				
				if(Math.random() >= 0.4) {
					Text.Add("It works like a charm. The two guards closest to your hiding spot are soon having trouble staying awake, yawning and swaying, before dropping where they stand in a snoozing heap. Their remaining fellows look absolutely shocked, but waste no time in drawing their weapons and advancing upon you and Cveta. It’s a fight!", parse);
					//#Start 2 guard combat
				}
				else {
					Text.Add("Either Cveta’s voice didn’t carry well enough or the guards are made of sterner stuff than you thought. While those closest to you look somewhat unsteady on their feet, they manage to resist the effects of Cveta’s voice and advance upon you in formation, weapons drawn. It’s a fight!", parse);
					//#Start 4 guard combat
					enemy.AddMember(new Footman());
					enemy.AddMember(new Footman());
				}
				Text.Flush();

				var enc = new Encounter(enemy);
				
				enc.canRun = false;
				enc.onLoss = Scenes.BullTower.GuardsLoss;
				enc.onVictory = Scenes.BullTower.GuardsWin;
				
				Gui.NextPrompt(function() {
					enc.Start();
				});
			}, enabled : true,
			tooltip : "Have Cveta attempt to lull the guards to slumber with a song."
		});
		Gui.SetButtonsFromList(options, true, function() {
			Text.Clear();
			Text.Add("You decide that messing with these guards isn’t worth it right now. With that thought in mind, you slink back into the safety of the shadows, Cveta in tow.", parse);
			Text.NL();
			PrintDefaultOptions(true);
			outlaws.BT.IncSuspicion(100, 2.5);
		});
	}
));

Scenes.BullTower.GuardsWin = function() {
	var enc  = this;
	SetGameState(GameState.Event);
	
	var parse = {
		
	};
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("The last of the sentries guarding the caravans collapses to the ground, succumbing to his wounds. Wasting no time, you hurry to hide your unconscious adversaries in an overgrown patch of weeds - the thigh-height grass conceals them nicely, and they should stay out cold for a good while.", parse);
		Text.NL();
		Text.Add("Naturally, you rifle through their pockets, but fail to find much of use. A box of matches, a few loose cigarettes - the sort of thing guards on duty might have on their person. One particular item stands out, though - a key that looks almost as ancient as the fortress. Wondering if it unlocks something in the tower, you pocket the thing. Maybe it’ll come in handy later.", parse);
		Text.Flush();
		
		outlaws.BT.guardsDown = true;
		
		Gui.NextPrompt();
		outlaws.BT.IncSuspicion(100, 2.5);
	});
	Encounter.prototype.onVictory.call(enc);
}

Scenes.BullTower.GuardsLoss = function() {
	var enc  = this;
	SetGameState(GameState.Event);
	
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Seems like this scuffle isn’t going as you planned. Deciding to disengage while you still can, you quickly signal to Cveta to beat a fighting retreat. The caravan guards break off pursuit after just a few more blows, and the reason for that soon becomes apparent: the two of you have barely crossed the courtyard when the loud clanging of a bell being rung echoes across the entirety of the ancient fortress - the alarm!", parse);
	Text.NL();
	
	Scenes.BullTower.Failure();
}

world.loc.BullTower.Courtyard.Caravans.events.push(new Link(
	"Search Caravans", function() {
		return !(outlaws.flags["BT"] & Outlaws.BullTower.CaravansSearched) &&
		       !(outlaws.flags["BT"] & Outlaws.BullTower.CaravansIgnited);
	}, function() {
		return outlaws.BT.guardsDown;
	},
	null,
	function() {
		var parse = {
			playername : player.name
		};
		
		Text.Clear();
		Text.Add("With the guards out of the way, it’s a simple matter to saunter up to the caravan wagons and start searching; Cveta and you split up to look through everything as quickly as possible, rummaging away in the dim light.", parse);
		Text.NL();
		Text.Add("Most of the cargo has been unloaded, leaving just the caravaneers’ personal effects for the two of you to sift through. Spare clothing, cooking utensils, the odd keepsake - it’s not until you come to the lead wagon that you manage to find a small trunk lying beneath a couple of bedrolls. Opening it reveals a stack of invoices tied together with string, and a quick glance at the goods involved and the money that’s changed hands leaves little doubt that this is the evidence you need to prove the royal guards’ complicity in this smuggling operation. For them to be leaving this around, even if it was hidden… well, the guards may be cautious, but the caravaneers are certainly much less so.", parse);
		Text.NL();
		Text.Add("<i>“I recognize some of the buyers’ names,”</i> Cveta says from behind you. She’s clutching a small sheaf of receipts in her hands, each one signed very neatly. <i>“An assortment of the degenerates who call themselves Rigard’s high society. This is damning evidence, [playername]. I don’t doubt that they’ll be able to weasel their way out of the penalties for tax evasion, but the truth is powerful in and of itself.”</i>", parse);
		Text.NL();
		Text.Add("Hey, she’s right. Now that she’s brought it to your attention… Krawitz’s name <i>does</i> appear on a few of the invoices and receipts. The handwriting is small and spidery, but there’s no doubt about it - he’s listed as the buyer in no uncertain terms.", parse);
		Text.NL();
		Text.Add("If there weren’t already enough reason to dislike the little man…", parse);
		Text.NL();
		Text.Add("Well, you’ve seen enough to know that Zenith will very definitely be interested in these. Hastily bundling both receipts and invoices together, you stow them with your other belongings and turn to other matters.", parse);
		Text.Flush();
		
		outlaws.flags["BT"] |= Outlaws.BullTower.CaravansSearched;
		
		Gui.NextPrompt();
		outlaws.BT.IncSuspicion(100, 2.5);
	}
));


world.loc.BullTower.Courtyard.Caravans.events.push(new Link(
	"Burn Caravans", function() {
		return !(outlaws.flags["BT"] & Outlaws.BullTower.CaravansIgnited);
	}, true,
	null,
	function() {
		var parse = {
			
		};
		
		Text.Clear();
		if(Jobs["Mage"].Unlocked(player))
			Text.Add("As soon as the idea forms in your mind, so does a spark at your fingertips. Magic really makes things convenient, doesn’t it? Indeed, you could easily set the whole wagon train ablaze with a fireball; the canvas and oilcloth hoods should catch easily enough.", parse);
		else if(outlaws.BT.stoleLantern)
			Text.Add("You smile as the thought comes to mind. Maybe this oil lantern might actually come in useful. The canvas and oilcloth of the wagon hoods should catch fire easily, should you desire to set them ablaze.", parse);
		else {
			Text.Add("It <i>is</i> a nice thought, but you don’t have any means of starting a fire on hand. Can’t burn the wagons if you can’t set them alight, can you?", parse);
			Text.Flush();
			Gui.NextPrompt();
			return;
		}
		Text.NL();
		if(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed)
			Text.Add("Alaric catches your eye, and the injured dissident gives both you and Cveta a brisk nod. Torching the smuggling caravan would be a good way to cover your retreat and give the royal guard something to do other than hunt you down. Are you going to do it?", parse);
		else
			Text.Add("On the other hand, it’s very likely that once the sight and smoke of the burning wagons spreads beyond the confines of this small enclosure, you’re going to be feeling a lot of heat on your back. Are you sure you want to do this?", parse);
		Text.Flush();
		
		//[Yes][No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				Text.Clear();
				Text.Add("Yes, the wagons are close enough that the fire should easily spread between them. You’re a bit surprised at how readily the canvas hoods catch flame - it’s almost as if they <i>want</i> to be destroyed - and just for good measure, you pay extra attention to the wooden frames, going over them carefully and making sure there’s going to be nothing salvageable after the intense heat has done its work.", parse);
				if(!outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed) {
					Text.NL();
					Text.Add("With all the heat and smoke the burning wagons are creating, you’ve probably drawn plenty of attention to yourself. The roof will keep the inferno contained for a little while, but the smoke will spill out and someone is going to notice eventually - if the guards you took out aren’t roused by the flames first, that is.", parse);
				}
				Text.Flush();
				
				outlaws.flags["BT"] |= Outlaws.BullTower.CaravansIgnited;
				
				Gui.NextPrompt();
				if(!outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed)
					outlaws.BT.IncSuspicion(100, 30);
				else
					outlaws.BT.IncSuspicion(100, 2.5);
			}, enabled : true,
			tooltip : "Light ‘em up!"
		});
		options.push({ nameStr : "No",
			func : function() {
				Text.Clear();
				Text.Add("Reconsidering, you step back from the wagons. If you burned them, there’d be no turning back if you decided that they could be useful later. Maybe you could return and finish the job just before you leave the tower grounds for good?", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "It can wait for now."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
));

world.loc.BullTower.Courtyard.Pens.description = function() {
	Text.Add("These pens look like they used to be proper stables, but time and neglect have eaten away at the supporting timbers. A few serviceable stalls remain, but… well, it wouldn’t be right to call them stables without a single horse in it.");
	Text.NL();
	Text.Add("The prevailing smell in the air is one of mold and old dirt rather than that of animals; any feeding or water troughs have long since decayed into dust, with hooks for tack and other riding gear long rusted down to brown stubs. Even with the wealthy royal guard secretly occupying Bull Tower, the building is not getting much use - they must do most of their travel on foot.");
	Text.NL();
	Text.Add("The only part of these pens which could be considered relatively new are the latches on the stall doors, which although not exactly shiny, have yet to accumulate the thick coat of rust and grime that covers every other metal object in the vicinity.");
	Text.NL();
	if(outlaws.flags["BT"] & Outlaws.BullTower.AnimalsFreed)
		Text.Add("Having released the mules, there’s nothing else for you to do here. The beasts mill about the grounds placidly, creating a bit of noise but presenting no immediate difficulty that would require the attention of the guard. It’s quite a clever diversion, now that you think about it - any strange noises that you or Cveta inadvertently make would in all probability be blamed on the poor animals and not investigated until sunup.");
	else
		Text.Add("The twenty or so mules that have been housed here are rather docile. The animals are clearly used to human-ish presence and give no reaction to your entry save for faint whuffs of breath and the occasional flick of a ear or tail. It might be worthwhile to let them out of their pens as a diversion.");
	Text.NL();
	Text.Add("Well, what will you do?");
}

world.loc.BullTower.Courtyard.Pens.links.push(new Link(
	"Courtyard", true, true,
	null,
	function() {
		MoveToLocation(world.loc.BullTower.Courtyard.Yard, {minute: 5});
		outlaws.BT.IncSuspicion(100, 2.5);
	}
));

world.loc.BullTower.Courtyard.Pens.events.push(new Link(
	"Free Animals", function() {
		return !outlaws.flags["BT"] & Outlaws.BullTower.AnimalsFreed;
	}, true,
	null,
	function() {
		var parse = {
			
		};
		
		Text.Clear();
		Text.Add("Looking at the placid beasts in their stalls, an idea comes to mind. Moving to each old stall - and trying not to think too hard about the moldy stench as you do so - you undo the latches on each of the pen doors in turn, throwing gates wide open for the mules to make their escape. After taking a few moments to notice that freedom and grazing is now within their reach, they trot out of the ancient building to the overgrown courtyard, which seems far more to their liking.", parse);
		Text.NL();
		Text.Add("Your actions don’t go unnoticed, though - not with all twenty-odd mules put to pasture. Soon enough, a pair of lights appear atop the section of wall closest to the animal pens, a trio of silhouettes peering down into the darkness below. Quickly, you duck behind the cover of a low, crumbling wall, Cveta following in your step.", parse);
		Text.NL();
		Text.Add("<i>“Crap, the mules got out again.”</i> The voice is faint as it floats down from the ramparts.", parse);
		Text.NL();
		Text.Add("<i>“That’s the third time this month. Damn it, Fred, we should really get better latches.”</i>", parse);
		Text.NL();
		Text.Add("<i>“It’s not a matter of the latches, dimwit. They hold well enough. The critters are just smarter than we give them credit for. I told you, I saw one of them nose it open couple of weeks ago, just like that.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Does that matter right now? The damned things are out and all over the courtyard. Who’s going to go down and get them back in?”</i>", parse);
		Text.NL();
		Text.Add("Silence. You hold your breath, not taking your eyes off the flickering lights.", parse);
		Text.NL();
		Text.Add("<i>“You know what? It’s far too dark for this crap.”</i>", parse);
		Text.NL();
		Text.Add("<i>“What?”</i>", parse);
		Text.NL();
		Text.Add("<i>“What I’m saying is that those dumb critters aren’t going to go anywhere, not unless they try to get through the gate, and it’s too dark to be romping around trying to herd them back in. If they want out, well, they can fucking well stay out. I say it can damn well wait till dawn.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I’m not so sure about that, Fred…”</i>", parse);
		Text.NL();
		Text.Add("<i>“Besides, don’t we have orders to be on the lookout for intruders while everyone else is out on the road? We should be looking out, not in. You really want to risk explaining to the lieutenant that we abandoned our posts for a few stupid animals? Let them make a bit of noise - that’s the most they’re going to be doing.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Is that really alright?..”</i>", parse);
		Text.NL();
		Text.Add("Fred must have won the argument, for the lights eventually disappear, leaving you and Cveta to be on your way.", parse);
		Text.Flush();
		
		outlaws.flags["BT"] |= Outlaws.BullTower.AnimalsFreed;
		
		world.TimeStep({ minute : 15 });
		
		Gui.NextPrompt();
		outlaws.BT.DecSuspicion(-100, 20);
	}
));


world.loc.BullTower.Building.Hall.description = function() {
	Text.Add("The main hall of Bull Tower is just inside the archway of the main entrance. Walls where banners and tapestries once hung now lie bare, their only adornment dust gathering in the cracks between the stones. Built to accommodate the hundreds who were once garrisoned here, it now lies empty, its expansiveness causing even the lightest of your footsteps to echo in the darkness.");
	Text.NL();
	Text.Add("While most of the staircases are too precarious to navigate, you do note that there are footprints on two sets of steps: one spiraling upward into the darkness of the main watchtower, and one leading downward below ground level. Similarly, most of the doors have been boarded up and nailed shut, but there are a few which look like they’ve seen some use of late.");
	Text.NL();
	Text.Add("Behind you lies the exit to the main courtyard, should you need to beat a hasty retreat.");
}

//[Warehouse][Office][Watchtower][Cell][Courtyard]
world.loc.BullTower.Building.Hall.links.push(new Link(
	"Warehouse", true, true,
	null,
	function() {
		var parse = {
			
		};
		
		Text.Clear();
		if(outlaws.BT.guardsDown) {
			if(outlaws.BT.warehouseRepeat) {
				Text.Add("Slipping through the now-unlocked door to the warehouse, you carefully close it behind you.", parse);
			}
			else {
				outlaws.BT.warehouseRepeat = true;
				Text.Add("The key that you found on the caravan guards looks like it might fit the lock on the door, and indeed, it slips in easily, the tumblers moving without so much as a squeak. Seems like this door is used often enough for the guards to keep the lock in good condition.", parse);
			}
			Text.NL();
			MoveToLocation(world.loc.BullTower.Building.Warehouse, {minute: 5}, true);
		}
		else {
			if(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed)
				Text.Add("You try every one of the keys on the key ring that you picked off Corishev’s pants, but none of them fit the keyhole. Guess he wasn’t holding onto the key for this door, then. Where is it?", parse);
			else {
				parse["t"] = party.InParty(terry, true) ? "would have daunted even Terry" : "would daunt even the most skilled of thieves";
				Text.Add("You push and pull on the stout iron handle, but it’s no good - the door is locked by an impressive-looking mechanism that [t]. You’re not going to be getting into the warehouse without the proper key.", parse);
			}
			Text.Flush();
			Gui.NextPrompt();
		}
		outlaws.BT.IncSuspicion(100, 2.5);
	}
));
/* TODO more locations
world.loc.BullTower.Building.Hall.links.push(new Link(
	"", true, true,
	null,
	function() {
		
	}
));
*/


world.loc.BullTower.Building.Cell.onEntry = function() {
	var parse = {
		playername : player.name,
		weapon : function() { return player.WeaponDesc(); }
	};
	
	Text.Clear();
	if(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed) {
		Text.Add("Now that Alaric’s been freed, there’s no reason for you to return to that horrible place, and neither is there any need to distress an already shaken Alaric by doing so. Besides, you’re not sure whether the lieutenant remains unconscious, and given the deafeningly loud silence that comes from within the cell, you’d rather not risk unlocking the door to find out.", parse);
		Text.NL();
		Text.Add("Best to let sleeping dog-morphs lie, as the saying goes. Quietly, you slip back to the main hall.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.BullTower.Building.Hall, {minute: 5});
			outlaws.BT.IncSuspicion(100, 2.5);
		});
	}
	else {
		Text.Add("You creep down the cold stone stairs that lead into the darkness, with Cveta following closely behind, feeling your way down the forbidding passageway. This isn’t a true dungeon - Bull Tower was never meant to hold prisoners for any length of time - but the guards of old would have needed a secure place to lock up ruffians and miscreants they picked up off the King’s Road. As you proceed, a voice drifts up the stairwell, sounding not quite sane:", parse);
		Text.NL();
		Text.Add("<i>“Scream! Scream for me! So, are you going to sign it, or not? I have it ready in the office upstairs. All you need to do is sign, and I won’t have to whip you any more.”</i>", parse);
		Text.NL();
		Text.Add("You inch closer to the worm-eaten door that separates the hallway from the cell. While there’s no slit or window to allow you a glimpse of what lies within, at least there’s some form of light shining through the cracks in the wood.", parse);
		Text.NL();
		Text.Add("<i>“If… if I sign… you’ll just kill me anyway.”</i> A second voice, clearly pained. <i>“And I’m… not signing that which I know… isn’t true.”</i>", parse);
		Text.NL();
		Text.Add("The unmistakable crack of a whip as it sails through the air comes clearly through the door, and the voice erupts in a muffled scream.", parse);
		Text.NL();
		Text.Add("<i>“You mean you weren’t the one who was stealing from the treasury, my dear? Spirits forbid! We have plenty of evidence on you!”</i>", parse);
		Text.NL();
		Text.Add("<i>“You don’t… bastard…”</i>", parse);
		Text.NL();
		Text.Add("<i>“Guilty as charged - never knew my father. Now, it’s perfectly fine with me if you won’t confess, because I’ll get to whip you all night, and whip you good. However, Preston won’t be too pleased with your refusal. He doesn’t like it when crimes go unsolved, you know. Reflects badly on us. Ever since the royal guard took on more responsibility, we’ve had a yearly decrease in petty crime across the board, and I have targets to meet.”</i>", parse);
		Text.NL();
		Text.Add("Guess it must be Corishev and Alaric in there - time for you to make an entrance. Are you ready?", parse);
		Text.Flush();
		
		//[Yes][No]
		var options = new Array();
		options.push({ nameStr : "No",
			func : function() {
				Text.Clear();
				Text.Add("As much as you want to burst in right now, you realize that it’s better to prepare first. You can mostly guess what’s going on the other side of that door… but if you are missing something, you don’t want to be caught with your pants down.", parse);
				Text.NL();
				Text.Add("With that in mind, you head back up the stairs to the main hall.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.BullTower.Building.Hall, {minute: 5});
					outlaws.BT.IncSuspicion(100, 2.5);
				});
			}, enabled : true,
			tooltip : "As much as you want to burst in right now, you realize that it’s better to prepare first."
		});
		options.push({ nameStr : "Yes",
			func : function() {
				Text.Clear();
				Text.Add("Well, this is it, then. Looking to Cveta, you ask her in a hurried whisper if she can do anything to give the two of you an edge.", parse);
				Text.NL();
				Text.Add("<i>“I could try, but success is unlikely,”</i> she whispers back. <i>“The torturer on the other side of the door is rather unhinged and maniacal. He would probably realize something was amiss before my voice could properly take hold.”</i>", parse);
				Text.NL();
				parse["w"] = player.Weapon() ? Text.Parse(", your [weapon] in hand and at the ready", parse) : "";
				Text.Add("Seems like there’s little else to be done, then. Steeling yourself, you grip the handle of the old door and push - to your surprise, it isn’t locked - then throw it open[w].", parse);
				Text.NL();
				Text.Add("What greets your eyes is a garish sight. The first thing you notice is that the stone floor is glistening with fluids. Most of the mess is clear - probably sweat - but there are faint traces of red and white in the slick mix that spreads outward from the centre. What little furniture there is in the room has been broken; what used to be a couple of wooden chairs lie in splinters, and even the bare-bones metal jail bed has been torn off its supports where it was once affixed on the wall.", parse);
				Text.NL();
				Text.Add("In the midst of it all is a set of chains and cuffs - chains hanging from the ceiling, cuffs affixed to the floor - and hanging naked on it, like a pelt on a curing rack, is a little man, perhaps in his late twenties or early thirties. His hairline is receding, and his skin glistens with sweat and a greenish, slimy substance. Several lash marks, thin, red and weeping blood, have been expertly applied to his back, and yet, despite the pain he must be feeling, he’s sporting a raging erection.", parse);
				Text.NL();
				Text.Add("This, you presume, must be Alaric.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("Though he hangs limply in the midst of the mess, he lifts his head weakly as Cveta and you enter, eyes widening in equal parts hope and fear. He looks frantic, and his lips move, the man clearly trying to mouth some words, but you don’t get what he’s trying to tell you.", parse);
					Text.NL();
					Text.Add("Nevertheless, you quickly discover why Alaric was mouthing words instead of speaking directly. Following his gaze, you turn to see a thin, lanky man standing at the far end of the room, applying the contents of a vial onto the cruel barbs of the whip he’s brandishing, no doubt the same weapon that’s been used on Alaric.", parse);
					Text.NL();
					
					var racescore = new RaceScore(player.body);
					var humanScore = new RaceScore();
					humanScore.score[Race.human] = 1;
					var humanity = racescore.Compare(humanScore);
					
					parse["h"] = humanity > 0.95 ? ", not to mention a beast-lover, too" : "";
					
					Text.Add("<i>“Hello, my lovelies,”</i> he says in a little sing-song voice, turning to face you, his eyes bloodshot, a cheeky grin plastered onto his face. You note that the same green slime that was on Alaric and the whip is also plastered all over his exposed lower half, beads of pre dripping from his veined, throbbing dick. An aphrodisiac? The slime has seeped into the top of the royal guard uniform he has on, so you have little doubt that whatever the effects of this stuff, he’s gotten a strong dose of it, and his unfocused gaze only serves to confirm your suspicions. <i>“Come to share in my private stash of Gol venom? Preston told me to expect trouble on the road tonight, but I wasn’t expecting furbag scum to come straight to my doorstep[h]! Never mind, though, I’ve enough venom for everyone, even if it did cost me a pretty penny! Seems like I’ll have to whip the guards for letting you in here, though. They’re all very naughty boys, like our friend here.”</i> He cracks the whip in Alaric’s direction.", parse);
					Text.NL();
					
					parse["g"] = burrows.flags["Access"] < Burrows.AccessFlags.Stage5 ? ", from what you've heard" : "";
					Text.Add("Gol venom. Yes[g], that would certainly intoxicate - and arouse - the bastard into the crazed state he’s currently in.", parse);
					Text.NL();
					Text.Add("Cveta looks unimpressed. <i>“You filthy degenerate. How does even a man like Preston stand having you around?”</i>", parse);
					Text.NL();
					Text.Add("<i>“How does he, indeed? Simple: I get the job done, and ask no inconvenient questions, something our friend here-”</i> he cracks the whip again, sending Alaric cringing <i>“-apparently couldn’t do. Oh, but where are my manners? I am Lieutenant Corishev, and I oversee discipline amongst the royal guard; there are so many bad boys and girls who need the naughtiness beaten out of them these days, so I’ve had to work double-time. Now that we’ve been introduced, can we get down to business? I’ve planned a public flogging in the merchant’s square tomorrow, and all it needs to be perfect is for a furbag or two to be guests of honor at the event!”</i>", parse);
					Text.NL();
					Text.Add("With that, the perverse officer advances upon you.", parse);
					Text.NL();
					Text.Add("It’s a fight!", parse);
					Text.Flush();
					
					Gui.NextPrompt(function() {
						var enemy = new Party();
						var corishev = new Corishev();
						enemy.AddMember(corishev);
						var enc = new Encounter(enemy);
						
						enc.corishev = corishev;
						
						enc.canRun = false;
						enc.onLoss = Scenes.BullTower.CorishevLoss;
						enc.onVictory = Scenes.BullTower.CorishevWin;
						
						enc.Start();
					});
				});
			}, enabled : true,
			tooltip : "Well, this is it, then. Time to do what you came here for."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
}

Scenes.BullTower.CorishevLoss = function() {
	var enc  = this;
	SetGameState(GameState.Event);
	
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Despite success being right before your eyes, you’re quickly realizing why the royal guards are so terrified of Corishev’s whip. It’s not only the force of the blows or the barbs on the whip that make this so difficult. The venom makes it hard to think about anything other than sweet, sweet sex, which in turn allows him to land more blows on you, letting more venom mingle with your blood…", parse);
	Text.NL();
	Text.Add("As hard as it is to admit, you’re losing. It’s getting harder to concentrate, and you can feel your strength starting to flag; it’s best to beat a tactical retreat while you can and avoid ending up in irons alongside Alaric.", parse);
	Text.NL();
	Text.Add("You croak out an apology as you start a fighting retreat towards the door behind you, Cveta doing her best to cover your back. Alaric goes wide-eyed as he realizes his would-be saviors are abandoning him, and struggles against his chains.", parse);
	Text.NL();
	Text.Add("<i>“Don’t leave me here! ”</i> he cries.", parse);
	Text.NL();
	Text.Add("<i>“Where are you going, would-be heroes?”</i> Judging by Corishev’s maniacal giggling and the lewd undertones of his voice, it’s clear that he’s completely intoxicated by all the Gol venom he’s smeared on himself. The orgulous sight of him jacking off to your escape is enough to make Cveta’s face crumple in disgust. <i>“Come back! You forgot your damsel in distress!”</i>", parse);
	Text.NL();
	Text.Add("Trying your best to shut the sounds coming from behind you out of your mind, you throw open the door and fly up the stairs as quickly as your legs will carry you. The lieutenant doesn’t seem to be pursuing you - the reason for which soon becomes clear when the alarm sounds throughout the entirety of the ancient fortress. Seems like he’s leaving the chore of hunting you down to his underlings.", parse);
	Text.NL();
	Scenes.BullTower.Failure();
}

Scenes.BullTower.CorishevWin = function() {
	var enc  = this;
	var corishev = enc.corishev;
	SetGameState(GameState.Event);
	
	var parse = {
		playername : player.name
	};
	
	outlaws.flags["BT"] |= Outlaws.BullTower.AlaricFreed;
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("That last blow did the trick. Still grinning madly - whether it’s the venom, or whether he’s just plain unhinged by now is anyone’s guess - Corishev staggers backward a few steps, perhaps to give himself a little breathing space. His wide, maniacal gaze darts this way and that, his breathing labored as you advance on him. Too bad there’s nowhere for him to run.", parse);
		Text.NL();
		Text.Add("<i>“Kids these days. Beaten by… a couple of young punks…”</i>", parse);
		Text.NL();
		parse["w"] = player.Weapon() ? "the blunt end of your weapon" : "your fist";
		Text.Add("Ducking under a desperate overhead lash, you slip within his guard and land a solid blow to his head with [w]. Giggling, he doesn’t seem to notice it at first, then the force of your blow finally registers and he crumples to the ground like a folded reed, his barbed whip falling out of his grasp and clattering on the floor. With a twitch, his cock ejects one last spurt of cum, a whitish streak mixing with the sweat and blood on the floor, then goes as limp as the rest of him.", parse);
		Text.NL();
		Text.Add("<i>“Very fitting,”</i> Cveta remarks dryly at the sight, doing her best to avoid stepping in any of the mess.", parse);
		Text.NL();
		Text.Add("<i>“Finally.”</i> Alaric’s been so quiet throughout the whole fight that you’d almost forgotten he was there. He pauses to catch his breath, summoning the strength to speak properly. <i>“Could you get me out of here? He’s got the keys in his pants - they’re hanging over by the door.”</i>", parse);
		Text.NL();
		Text.Add("Wasting no time, you tiptoe around the fallen lieutenant and reach for the pants Alaric mentioned. Searching the pockets unearths an empty coin purse, several vials of clear green liquid you try not to look at too closely, and a large iron keyring from which several keys hang. With the keys, it’s a small matter to unlock the chains and cuffs that hold Alaric in place, and he collapses to the ground, groaning.", parse);
		Text.NL();
		parse["m"] = player.mfFem("Mister", "Miss");
		Text.Add("<i>“Ow. Ow. Ow. Fucking. Ow. Thank you, um, [m]…?”<i/>", parse);
		Text.NL();
		Text.Add("You nod, and tell him your name.", parse);
		Text.NL();
		Text.Add("<i>“Right. Thank you, then, [m] [playername], and -”</i>", parse);
		Text.NL();
		Text.Add("<i>“My name is Cveta.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Cveta, then. I’m Alaric. For the record, I didn’t embezzle anything. In fact, the royal guards have been taking payoffs from anyone and everyone who has connections to turn a blind eye to tax evasion on imports! They’re keeping the money up top in a trapped safe - I overheard the lieutenant talking to one of his men about it - and the key should be on his keyring-”", parse);
		Text.NL();
		Text.Add("<i>“You do not need to prove your innocence to us, Alaric,”</i> Cveta replies. <i>“We know who you are, and were specifically sent to get you. Do you think you can walk?”</i>", parse);
		Text.NL();
		Text.Add("Alaric tries to rise, grimacing and wincing, then staggers back onto his knees. <i>“No. But I’m going to have to do it anyway, aren’t I? I’ll just have to walk it off,”</i> he replies with a forced laugh. <i>“I guess that’s enough for introductions and thanks - can we please get out of here before the crazy bastard comes to?”</i>", parse);
		Text.Flush();
		
		//[Fuck][Leave]
		var options = new Array();
		options.push({ nameStr : "Fuck",
			func : function() {
				Text.Clear();
				Text.Add("Just a minute, you tell Alaric. There’s some unfinished business you have to take care of - if Cveta would be kind enough to help him out? You’ll catch up with them in a moment.", parse);
				Text.NL();
				Text.Add("Cveta gives you an odd look, but agrees and helps Alaric to his feet. It takes her a little effort, considering her slight stature, but the songstress eventually gets a firm grip under Alaric’s arm and begins hefting him out of the cell and up the stairs.", parse);
				Text.NL();
				Text.Add("Now that you’re alone, you look down at the lieutenant. The bastard is still largely out cold, save for the occasional twitch and groan, and you’re certain that between the Gol venom and having the wind knocked out of him, he’s not going to put up much of a fight for what you have in mind for him.", parse);
				Text.NL();
				Text.Add("Come to think of it, what <i>did</i> you have in mind?", parse);
				Text.Flush();
				
				Scenes.BullTower.CorishevFuck(corishev);
			}, enabled : true,
			tooltip : "The bastard lieutenant sure can dish it out; let’s see how well he can take it."
		});
		options.push({ nameStr : "Leave",
			func : function() {
				Text.Clear();
				Text.Add("You find yourself in total agreement with the little bean counter. Not wishing to spend one moment longer in the cell, you help Alaric to his feet, you and Cveta each grabbing him under a shoulder and lifting. Before stepping onto the stairs, you relieve the lieutenant of his venom-coated whip, which could make a good weapon. The little bean-counter is still bleeding from his lashes, but he summons the strength to keep pace with both of you. Together, the three of you hobble up the steps and to the main hall, but not before you lock the cell door with the keys you found. On the off-chance that the lieutenant comes to before dawn, he can stew there until his underlings come and get him out.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.BullTower.Building.Hall, {minute: 5});
				});
			}, enabled : true,
			tooltip : "Get out of here before things get any worse."
		});
		Gui.SetButtonsFromList(options, false, null);
	});
	Encounter.prototype.onVictory.call(enc);
}

Scenes.BullTower.CorishevFuck = function(corishev) {
	var p1cock = player.BiggestCock(null, true);
	
	var parse = {
		playername : player.name,
		lowerarmordesc : function() { return player.LowerArmorDesc(); }
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	
	//[Whip][Ride][Anal][Reconsider]
	var options = new Array();
	options.push({ nameStr : "Whip",
		func : function() {
			Text.Clear();
			Text.Add("An evil grin spreads across your lips as you reach down and pick up the lieutenant’s whip from the floor. While it looks quite nice as it is, you carefully pick off the barbs - you don’t want to kill the twisted bastard, as much as he deserves it, just bleed and humiliate him a little. It’s still got a thick coat of aphrodisiac venom on it, but you reach over for the vials you discovered and give the whip a second coating until it’s practically dripping with the stuff. Taking a step back to admire your handiwork, you shake your head at the poetic justice of the lieutenant becoming victim to the very same methods with which he tormented others.", parse);
			Text.NL();
			Text.Add("Well, time to administer justice. Lots and lots of justice. A good flick of your wrist sends the length of leather sailing through the air to land squarely on Corishev’s exposed ass. Droplets of viscous venom sail into the air as the coating on the whip’s length splatters, some of it landing on you. Oh well - you aren’t about to let it diminish your satisfaction at seeing a thin red welt rise up on his pale peaches. Pulling your arm back for a second stroke, you let loose with all your might, and by some quirk of fate or good fortune, the second lash lands in almost the same spot as the first.", parse);
			Text.NL();
			Text.Add("This one’s strong enough to cut through the lieutenant’s unconscious state, the bastard instinctively twitching and moaning at the pain, the original welt turning an angry red and beginning to seep blood. Wait, moaning? Then again, he was already pretty much hopped up on Gol venom when you came in. As you watch, his flaccid cock twitches as it pushes against the slick stone floor; you roll him over with a foot, and once given enough space, it stands at full mast, just begging to be used.", parse);
			Text.NL();
			Text.Add("Well. If he’s <i>enjoying</i> it…", parse);
			Text.NL();
			Text.Add("You’re feeling a little lightheaded yourself - maybe it’s the venom in the air? Can it be inhaled, or did some of it get onto you? Then again, who cares? Stifling the impulse to laugh, you let swing zealously with the whip, the whoosh of it travelling through the air, the crack of leather against skin music to your ears. Corishev accompanies it with grunts and moans, squirming in the mixture of sweat, blood and cum that covers the floor. The overdose of Gol venom has pretty much short-circuited his senses by now, turning pain and pleasure into one.", parse);
			Text.NL();
			parse["la"] = player.LowerArmor() ? Text.Parse(" rip off your [lowerarmordesc] and", parse) : "";
			Text.Add("You judge him guilty as charged on all counts! Of corruption! - a swipe, a lash, a splatter of viscous, cum-like venom. Of unlawful abduction! - you’re finding it hard not to giggle with glee, the weight of the whip’s handle the centre of your world. Of conspiracy against the good name of the crown! - the smell of the potent mixture rising from the floor is almost too much to bear now. Barely hesitating, you[la] begin to openly fondle yourself, ", parse);
			if(player.FirstCock() && player.FirstVag())
				Text.Add("alternating your free hand between both your [cocks] and [vag], sticky fluids dribbling down and adding to the mess on the floor as you try to get all the pleasure you can out of the strange situation.", parse);
			else if(player.FirstCock())
				Text.Add("jerking off your [cocks], pumping away at your shaft[s] furiously with your free hand.", parse);
			else
				Text.Add("fingering yourself at the sight of justice being dealt, girl-honey running down from your [vag], onto your fingers and into the palm of your free hand, making it nice and slick.", parse);
			Text.NL();
			Text.Add("Whip it! Whip it good! A misaimed blow rips apart the shirt of Corishev’s royal guard uniform, but you’re not too concerned. It’s sort of hard to aim with one hand, especially when you’re trying to get yourself off with the other. Too weak, dazed, or lustful - probably a combination of all three - to form any intelligible words at the tender ministrations of the whip, the lieutenant writhes and wriggles between moans and pants, beads of precum dribbling from the tip of his cock. He thrusts at the air feebly with his hips, grinding away at some invisible mate.", parse);
			Text.NL();
			Text.Add("Pain is pleasure, and pleasure is yet even more pleasure. And from the looks of it, justice is pleasure, too, which is a good thing for you. Criminals have got to be punished, after all, and doubly so if the crime is being a hypocritical bastard. By now, the whip is just an extension of your body. You move your hand just like <i>this</i>, and its very tip coils about the lieutenant’s raging erection like some kind of prehensile vine or tentacle, still infused with more than enough of the potent venom to do its work. The Gol venom seeps through skin and flesh, and you flash a triumphant smile as Corishev bucks against empty air, his member bulging and twitching against its restraints. Slowly, you ease the whip so that it unwinds like a snake climbing a tree - venom, venom everywhere - and the moment it slides off, you bring it down again onto his now tattered and torn uniform with everything you’ve got.", parse);
			Text.NL();
			Text.Add("It’s too much for the poor bastard to bear. With a cry of pleasure-pain, Corishev orgasms, an arc of cum shooting from the debased lieutenant’s coated cock to splatter on his legs and the floor. Despite all the fluids mixed in the mess, the only thing you can smell right now is Gol venom - a heady, heavy smell that feels synonymous with sex.", parse);
			Text.NL();
			
			var gen = "";
			if(player.FirstCock()) gen += "[cocks]";
			if(player.FirstCock() && player.FirstVag()) gen += " and ";
			if(player.FirstVag()) gen += "[vag]";
			parse["gen"] = Text.Parse(gen, parse);
			
			if(player.FirstCock() && player.FirstVag())
				parse["gen2"] = "working both sets of your equipment";
			else if(player.FirstCock())
				parse["gen2"] = "jerking yourself off";
			else
				parse["gen2"] = "fingering yourself";
			
			Text.Add("You aren’t done yet, though, and you decide there’s no need to feel remorse about it; this is what he’d have done to Alaric in the end, and it’s only right that he get a taste of his own medicine. Standing over the lieutenant, you let the whip fall to the ground and focus your attentions on your [gen], a trickle of drool hanging from your open mouth as you work yourself into a frenzy [gen2].", parse);
			Text.NL();
			
			var cum = player.OrgasmCum(2);
			
			Text.Add("It’s not long before you simply can’t hold back any more; with a groan that sets your knees trembling, you unload ", parse);
			if(player.FirstCock()) {
				if(cum > 4)
					Text.Add("a veritable torrent of nice, hot cum from your [cocks] onto the dazed lieutenant. There’s so much of it, more than enough to completely soak his tattered and torn uniform and give him a good glazing. String upon string of thick, ropy seed spurts from your [cockTip][s] in a seemingly never-ending cascade, an impossibly long orgasm helped along by all the Gol venom in the air and on your skin.", parse);
				else
					Text.Add("burst after burst of cum from your [cockTip][s] onto the dazed lieutenant, strings of your seed arcing through the air and splattering on him in the most ignoble fashion. Moaning, eyes unfocused, you jack off furiously, coaxing every last drop of seed out of your [balls] and onto Corishev.", parse);
				if(player.FirstVag()) {
					Text.NL();
					Text.Add("While your [cocks] may have had enough, the rest of your body is far from done, though. The sheer strength of the venom-assisted orgasm causes your [vag] to clench tightly about your fingers. An orgiastic spray of your girl-cum squirts from from your [vag], honey mixing in with the mess of cum your cock created.", parse);
				}
			}
			else {
				Text.Add("plentiful squirts of girl-cum from your [vag] onto the dazed lieutenant, panting in pleasure as you unload your honey onto him in a glistening sheen. Desperately fingering yourself until there’s nothing left, you shudder at the exquisite sensations of the last few warm trickles running down your thighs and down to your calves.", parse);
			}
			Text.NL();
			Text.Add("Well. That should quite thoroughly humiliate Preston’s lapdog. Doing your best - which, admittedly, isn’t very good - to clean yourself up, you get up on shaky feet and hurriedly dress yourself, trying to hide the worst of the cum stains. Once you’re certain you’re not going to slip on the slick floor, you stash the venom-coated whip with the rest of your belongings and hobble up the stairs to catch up with Cveta and Alaric, but not before locking the cell door behind you. Corishev will certainly be an interesting sight for his men when they get the door open and find him.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.BullTower.Building.Hall, {minute: 20});
			});
		}, enabled : true,
		tooltip : "Whip him. Whip him good."
	});
	parse["gen"] = player.FirstVag() ? "pussy" : "ass";
	options.push({ nameStr : "Ride",
		func : function() {
			Text.Clear();
			Text.Add("The sight of the lieutenant’s limp prick gives you an idea. Sure, it’s pretty dead at the moment, but with all that Gol venom on it getting the little soldier to stand to attention shouldn’t be too hard. Your suspicions are confirmed when you reach down and get a firm hold on his flaccid prick - a few strokes are all it takes to have it up and ready, as thick and vital as it was when you entered the cell.", parse);
			Text.NL();
			
			var pussy = player.FirstVag();
			if(pussy)
				parse["gen"] = Text.Parse("wet folds into your [vag]", parse);
			else
				parse["gen"] = Text.Parse("[anus]", parse);
			
			Text.Add("Perfect. Still not quite coherent, Corishev tries to fend you off with a weak flail of his arm, but you easily knock it away and lower yourself on top of him. Gripping his shoulders as you straddle him, you steady yourself and pin him down in one easy movement. Having positioned yourself, you’re ready now - with one violent movement, you let yourself drop, impaling yourself onto his veined, venom-slick shaft and feeling him push past your [gen].", parse);
			Text.NL();
			
			if(pussy) {
				Sex.Vaginal(corishev, player);
				player.FuckVag(player.FirstVag(), corishev.FirstCock(), 4);
				corishev.Fuck(corishev.FirstCock(), 4);
			}
			else {
				Sex.Anal(corishev, player);
				player.FuckAnal(player.Butt(), corishev.FirstCock(), 4);
				corishev.Fuck(corishev.FirstCock(), 4);
			}
			
			parse["target"] = Text.Parse(pussy ? "[vag]" : "[anus]", parse);
			
			Text.Add("Once he’s hilted to the base inside you, flashes of warmth creeping into your [target]’s inner walls as the Gol venom works its magic, you shift your weight forward and begin to ride his shaft roughly. As if eager to make sure that your fun isn’t spoiled halfway, your [target] grips his member tightly, ensuring that he isn’t going to be escaping anytime soon.", parse);
			Text.NL();
			Text.Add("Not that he intends to, of course. There’s not much behind those fogged eyes of his, but the lieutenant’s body responds eagerly enough to the rough, dominant fucking you’re giving him. Your grip on his shoulders tightens to the point that your knuckles are growing white. Corishev moans and struggles underneath you, the occasional crazed giggle slipping through his teeth as you administer a good heap of fucking justice upon him. There’s a certain thrill to fucking an intoxicated madman - perhaps due to the sheer danger of it all - that only makes things more exciting, and the venom encroaching upon your senses only serves to inflame that insane desire even further.", parse);
			Text.NL();
			Text.Add("Harder and faster you work your humiliated fucktoy, slamming your hips down on on his cock even as he instinctively rises to meet you, the pace of the grinding and slurping only quickening as sparks of pleasure erupt from the motions to send electric tingles down your spine. Perhaps remembering that he’s supposed to be trying to stop you, Corishev attempts to swat you off him from time to time, but you simply grin and quash his pathetic attempts to unseat you with ease. You give the bastard a good shaking by the shoulders and ask him how it feels to be utterly helpless and at the mercy of someone else who’s giving him a good thorough fucking.", parse);
			Text.NL();
			Text.Add("The only response you get is a shudder and moan as the lieutenant’s member throbs inside you, alternating between swelling and clenching as he nears his peak. Fuck that, can’t he last longer than two minutes? You’re not even halfway done! Unfortunately for you, Corishev picks that very moment to explode inside you, filling your [target] with meagre gobs of hot seed, barely enough to trickle out about the seal joining the two of you. Snarling, you keep pounding away mercilessly, the ground beneath the two of you squelching with your effort, but it seems like he’s all spent. Even with the venom aiding him, the lieutenant is softening rapidly inside you, leaving you feeling very much unsatisfied.", parse);
			Text.NL();
			parse["la"] = player.LowerArmor() ? Text.Parse(" and pull on your [lowerarmordesc]", parse) : "";
			Text.Add("This is the best of Preston’s men, an idiot who can’t even last five minutes? Having fucked your fucktoy senseless, you sniff disdainfully at his form sprawled out in the midst of the sticky, slimy mess on the cell floor. Levering yourself off the unconscious Corishev, you clean yourself as best you can[la] before heading for the door, picking up the dropped whip on the way. Hey, at least it might be a little more useful than this loser here. Taking a moment to lock the cell door behind you - best to make sure he stays in there until the rest of the guards have a chance to find him - you hurry along to catch up with Cveta and Alaric, hoping they didn’t miss you too much while you were gone.", parse);
			
			player.AddLustFraction(0.5);
			
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.BullTower.Building.Hall, {minute: 20});
			});
		}, enabled : true,
		tooltip : Text.Parse("Ride Corishev’s Cock with your [gen] and show him who’s boss.", parse)
	});
	options.push({ nameStr : "Anal",
		func : function() {
			var strapon = p1cock.isStrapon;
			
			Text.Clear();
			parse["c"] = Text.Parse(strapon ? "pull out and affix your strap-on, knowing that your toy will be more than enough to get the job done with maximal efficiency" : "whip out your package, feeling the venom do its work as your [cocks] swell[notS] and stiffen[notS] with alarming rapidity, internal pressure building up in your ramming rod", parse);
			parse["c2"] = player.NumCocks() > 1 ? " the biggest of your cocks" : "";
			Text.Add("A mad grin splitting your face from ear to ear, you grab Corishev roughly by the shoulders and flip him over, forcing him on his hands and knees, ass high in the air and presented nicely to you. He tries to fight you off, but to no avail, as you easily overpower him in his defeated state. Since he’s so used to giving, let’s see how good he is at receiving. With great gusto, you [c]. The lieutenant half-snarls, half-giggles, squirming in your grasp as he dimly realizes through his drug-fogged mind what’s about to happen, but you keep a firm hold on his thin, bony ass and thrust[c2] into him without so much as a second thought.", parse);
			Text.NL();
			parse["knot"] = p1cock.Knot() ? ", especially with all the whimpering and whining when you force your knot into him, its prodigious bulge grinding against his entrance" : "";
			Text.Add("Corishev is a tight fit - he yelps and growls wordlessly as you begin to pound his pucker rhythmically; you can’t help but wonder if that ass of his was virginal[knot]. All the more humiliating for him, then - you had thought that if he’s so into power games, he would have tried being on the receiving end as well. You had planned to start slow, but maybe it’s best to make it fast and hard, break him into it a little more quickly. Giving the lieutenant’s ass a good smack that leaves your palm stinging and a growing red mark on his rump, you grin and tell him in no uncertain terms how you’re going to very thoroughly use his hole even harder than you are doing already. His ass walls clench about your shaft as he wriggles, trying to escape your vicious thrusts, but you’re expecting it by now and pull him back.", parse);
			Text.NL();
			parse["c"] = player.NumCocks() > 1 ? ", your other cock[s2] waving about and leaking pre like some ecstatic tentacled monster" : "";
			Text.Add("Just for that, you’re going to teach him even more of a lesson. Groping about on his skin for a good hold, you redouble your efforts, violating the lieutenant as best your [cock] will allow[c]. Corishev howls and yips like a mad dog at the repeated and forceful intrusions of your magnificent member, his protests growing even more forceful as you reach between his legs to jerk off his stiff cock. You touch gently at first, caressing the veins and glans with your fingertips, but before long you’ve grasped the shaft in your palm and are yanking away in tandem with the pounding you’re giving his ass.", parse);
			Text.NL();
			parse["c"] = strapon ? "elicit a moan of pleasure-pain from the lieutenant" : "cum over and over again into his bowels";
			parse["c2"] = player.NumCocks() > 1 ? Text.Parse(", your other cock[s2] spraying seed all over him to drip off and mix in with the mess on the floor", parse) : "";
			parse["knot"] = p1cock.Knot() ? " and knot" : "";
			Text.Add("It seems doubtful that he can take much more, and to be frank, neither can you. With a final, hard thrust, you [c][c2]. Corishev’s rectum instinctively clenches down hard about your shaft[knot], his cock simultaneously expelling the remainder of his seed. Satisfied that you’ve taught the bastard a lesson in humility, you begin the arduous task of retrieving your shaft from his ass, letting him slump off you and into the puddle of sexual fluids on the floor.", parse);
			Text.NL();
			
			var cum = player.OrgasmCum();
			
			parse["la"] = player.LowerArmor() ? Text.Parse(", don your [lowerarmordesc]", parse) : "";
			Text.Add("Finally, done! You clean yourself up as best you can[la] and head for the exit, stopping along the way to pick up Corishev’s whip, still on the floor where it had been dropped. Taking care, you lock the cell behind you - best to make sure he stays in there until the rest of the guards have a chance to find him - and hurry to rejoin Cveta and Alaric. Hopefully you haven’t taken too long in administering that much-needed dose of discipline.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.BullTower.Building.Hall, {minute: 20});
			});
		}, enabled : p1cock,
		tooltip : Text.Parse("Fuck that ass of his with your [cocks].", parse)
	});
	options.push({ nameStr : "Reconsider",
		func : function() {
			Text.Clear();
			Text.Add("Looking down at the defeated lieutenant, you shake your head. What were you thinking, wasting precious time on this? Turning heel on the scene, you stop on the way to pick up Corishev’s whip - it might be useful as a weapon - and lock the cell door behind you with the keys you found. Hopefully it’ll keep him from raising the alarm if he comes around too quickly.", parse);
			Text.NL();
			Text.Add("With that done, you hurry up the steps to rejoin Cveta and Alaric in the main hall.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.BullTower.Building.Hall, {minute: 5});
			});
		}, enabled : true,
		tooltip : "Nah, now’s not the time to be doing this."
	});
	Gui.SetButtonsFromList(options, false, null);
}



//TODO
Scenes.BullTower.SlipOut = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	
	Scenes.BullTower.Cleanup();
	
	//TODO
	MoveToLocation(world.loc.Outlaws.Camp, {hour: 3});
}


//TODO
Scenes.BullTower.Failure = function() {
	var parse = {
		
	};
	
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	
	Scenes.BullTower.Cleanup();
	
	//TODO
	MoveToLocation(world.loc.Outlaws.Camp, {hour: 3});
}

Scenes.BullTower.Cleanup = function() {
	party.RemoveMember(cveta);
	party.LoadActiveParty();
}
