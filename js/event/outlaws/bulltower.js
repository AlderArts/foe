/*
 * Contains the "Blue roses" quest
 * 
 * Flags in outlaws
 * stats in outlaws.BT
 */

function BullTowerStats() {
	this.suspicion = new Stat(0);
	this.suspicion.debug = function() { return "Suspicion"; };
};
BullTowerStats.prototype.Suspicion = function() {
	return this.suspicion.Get();
}
//TODO add this to all move states
BullTowerStats.prototype.IncSuspicion = function(max, inc) {
	this.suspicion.IncreaseStat(max, inc);
	
	//TODO check for exit states
}
BullTowerStats.prototype.DecSuspicion = function(min, dec) {
	this.suspicion.DecreaseStat(min, dec);
}


Outlaws.BullTower = {
	AlaricFreed     : 1,
	StatueDestroyed : 2,
	CaravansIgnited : 4,
	CaravanGuardsDown : 8,
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


// TODO
//[Animal Pens][Caravan][Enter][Statue][Slip Out]
world.loc.BullTower.Courtyard.Yard.links.push(new Link(
	"", true, true,
	null,
	function() {
		
	}
));
world.loc.BullTower.Courtyard.Yard.links.push(new Link(
	"Animal Pens", true, true,
	null,
	function() {
		MoveToLocation(world.loc.BullTower.Courtyard.Pens, {minute: 5});
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
					
					//TODO Suspicion +20
				}
				Text.Flush();
				
				world.TimeStep({minute: 20});
				outlaws.flags["BT"] |= Outlaws.BullTower.StatueDestroyed;
				
				Gui.NextPrompt();
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
		
		//TODO suspicion - 20
		
		Gui.NextPrompt();
	}
));


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
	
	party.RemoveMember(cveta);
	party.LoadActiveParty();
	
	//TODO
	MoveToLocation(world.loc.Outlaws.Camp, {hour: 3});
}

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
		if(outlaws.flags["BT"] & Outlaws.BullTower.CaravanGuardsDown) {
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


world.loc.BullTower.Courtyard.Yard.description = function() {
	Text.Add("");
	Text.NL();
	Text.Add("");
}

world.loc.BullTower.Courtyard.Yard.links.push(new Link(
	"", true, true,
	null,
	function() {
		
	}
));

world.loc.BullTower.Courtyard.Yard.events.push(new Link(
	"", true, true,
	null,
	function() {
		
	}
));

