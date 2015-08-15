
Scenes.Vaughn.Tasks = {};

Scenes.Vaughn.Tasks.OnTask = function() {
	return Scenes.Vaughn.Tasks.Lockpicks.OnTask(); //TODO add tasks
}

Scenes.Vaughn.Tasks.AnyTaskAvailable = function() {
	return Scenes.Vaughn.Tasks.Lockpicks.Available(); //TODO add tasks
}

Scenes.Vaughn.Tasks.StartTask = function() { //TODO add tasks
	if(Scenes.Vaughn.Tasks.Lockpicks.Available())
		Scenes.Vaughn.Tasks.Lockpicks.Start();
}

Scenes.Vaughn.Tasks.TaskPrompt = function() {
	var parse = {
		
	};
	
	Text.Clear();
	if(Scenes.Vaughn.Tasks.AnyTaskAvailable()) {
		Text.Add("<i>“So, you’re interested in seeing some action? Young people, full of drive and fire… well, I’m not about to stop you from doing what an operative’s supposed to do.”</i> Vaughn thinks a moment, then smiles. <i>“Just so it happens, there’s something that came up which needs handling, and it has to be done the next day. You interested? Remember, you’ll be on the clock if I hand the assignment to you, so don’t accept responsibility for anything that you’re not willing to see through. You’re still thinking of going out there?”</i>", parse);
		Text.Flush();
		
		//[Yes][No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			tooltip : "Yes, you’ll take it.",
			func : function() {
				Text.Clear();
				Text.Add("<i>“All right, then. Let’s see what the boss-man wants me to hand down to you today…”</i>", parse);
				Text.Flush();
				
				Gui.NextPrompt(Scenes.Vaughn.Tasks.StartTask);
			}, enabled : true
		});
		options.push({ nameStr : "No",
			tooltip : "No, you’re not sure if you can see the task through.",
			func : function() {
				Text.Clear();
				Text.Add("Vaughn nods and shrugs at your words. <i>“Better that you say upfront that you can’t do it, rather than accept the job and get creamed, then leave everyone else to pick up the pieces. It’s no big deal; I’ll just pass along the task to someone who’s in the clear. You get points in my book for being honest about it.”</i>", parse);
				Text.NL();
				Text.Add("Points? Is he keeping score?", parse);
				Text.NL();
				Text.Add("<i>“Might be, might not be,”</i> Vaughn replies with a completely straight face. <i>“Now, was there something else you wanted of me?”</i>", parse);
				Text.Flush();
				
				Scenes.Vaughn.Prompt();
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		Text.Add("<i>“Hmm.”</i> Vaughn takes his gaze off you and thinks for a moment. <i>“Don’t imagine I’ve got anything for you at the moment; the other operatives pretty much have all our bases covered and the boss-man’s been in a thinking mood, as opposed to a doing one. Maybe you should go out there and move things along - stir up the hive, as they say. That should create all sorts of opportunities for us to get our fingers into some more pies.”</i>", parse);
		Text.NL();
		Text.Add("All right, then. You’ll ask later.", parse);
		Text.NL();
		Text.Add("<i>“Don’t just come calling around these parts,”</i> Vaughn calls out after you as you leave. <i>“I’m just one fellow, you know. Pretty sure there’re other folks in camp who could use a hand or two anytime - just have to ask around until you find them.”</i>", parse);
		Text.Flush();
		
		Scenes.Vaughn.Prompt();
	}
}


Scenes.Vaughn.Tasks.Lockpicks = {};
Scenes.Vaughn.Tasks.Lockpicks.Available = function() {
	if(vaughn.flags["Met"] >= Vaughn.Met.OnTaskLockpicks) return false;
	return true;
}
Scenes.Vaughn.Tasks.Lockpicks.OnTask = function() {
	return vaughn.flags["Met"] == Vaughn.Met.OnTaskLockpicks;
}
Scenes.Vaughn.Tasks.Lockpicks.Completed = function() {
	return vaughn.flags["Met"] >= Vaughn.Met.CompletedLockpicks;
}

//No special requirements. Player should already have access to castle grounds.
//Note to Alder: refer to castle grounds docs. Create flag to see if player has inadvertently met Elodie via castle grounds exploration for use in this.
//Block that exploration scene if this scene has been viewed.
//TODO Note for far future: Do not enable this if/when Majid has been run out of Rigard.
Scenes.Vaughn.Tasks.Lockpicks.Start = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>“Right, then.”</i> Vaughn pulls down the brim of his hat, turns, and heads for a door at the base of the watchtower. <i>“The boss-man’s decided to let you cut your teeth on something straightforward and simple, so give me a moment here.”</i>", parse);
	Text.NL();
	Text.Add("With that, Vaughn boots open the door and heads inside, lighting a candle in a holder by the doorway as he does so. The base of the watchtower is occupied by a storeroom of sorts, and as you look on, Vaughn picks out a leather pouch from one of the shelves before tossing it to you in a lazy arc.", parse);
	Text.NL();
	Text.Add("<i>“Here, catch.”</i>", parse);
	Text.NL();
	Text.Add("You do so. Whatever’s in the pouch is cold and hard, clearly made from metal, and they jingle as they hit the palm of your hand.", parse);
	Text.NL();
	Text.Add("<i>“Fresh from upriver,”</i> Vaughn explains as he closes the storeroom door behind him with a flourish and adjusts his hat. <i>“Quality thieves’ tools.”</i>", parse);
	Text.NL();
	Text.Add("Oh? You undo the string that holds the pouch closed, and are faced with quite the menagerie of interesting implements: various pieces of metal bent in interesting ways, a sharp, silent glass cutter, a hammer no longer than the width of your palm, and other more… exotic-looking things.", parse);
	Text.NL();
	if(party.InParty(terry)) {
		parse["foxvixen"] = terry.mfPronoun("fox", "vixen");
		parse["himher"] = terry.himher();
		
		Text.Add("<i>“Hmph,”</i> Terry says with a disdainful sniff, the [foxvixen] peering over your shoulder to scrutinize the toolset. <i>“Amateurs.”</i>", parse);
		Text.NL();
		Text.Add("Is that supposed to mean anything?", parse);
		Text.NL();
		Text.Add("<i>“Weeelll… I suppose they’ll do - assuming that you aren’t actually going after a mark that’s got any serious security. Yeah, they’ll get the job done in most cases. Most. And if they’re not going to be enough, then you’d be wanting a professional handling it.”</i>", parse);
		Text.NL();
		Text.Add("Like [himher], then?", parse);
		Text.NL();
		Text.Add("<i>“You know what? Forget I said anything.”</i>", parse);
		Text.NL();
		Text.Add("Maybe you will, and maybe you won’t. You’ll be keeping that in mind for later…", parse);
		Text.NL();
	}
	Text.Add("<i>“Anyway,”</i> Vaughn continues, <i>“we need these delivered to one of our people in the castle. Word’s had it that you’ve recently gained access to the castle grounds, so you’re the most obvious courier we have on hand.”</i>", parse);
	Text.NL();
	Text.Add("How would he know that, anyway?", parse);
	Text.NL();
	Text.Add("<i>“We have eyes and ears in the city that most overlook. Now, while it’s not a matter of life and death, we’d still like these delivered promptly. Just for this first task, you get a little leeway when it comes to time, but I hope that you don’t abuse said leeway. We’d all like to get off to a good start here, get moving on the right foot.”</i>", parse);
	Text.NL();
	Text.Add("Oh, so he’s going easy on you, is he?", parse);
	Text.NL();
	Text.Add("Vaughn shrugs and pulls the brim of his hat over his eyes. <i>“Could be. Learn to walk before you try to run, as the old saying goes.”</i>", parse);
	Text.NL();
	Text.Add("All right, you get his point. Now, who are you supposed to pass these along to, where are you going to meet him or her, and how will you recognize each other?", parse);
	Text.NL();
	Text.Add("<i>“We’ve got someone in the castle proper, girl by the name of Elodie; that’s who you need to hand these to. Every day in the evening, she gets let out of the castle for an hour or so to settle her personal affairs in the city. Get yourself to the small park to the west of the castle, and she’ll be on the bench by the pond. As for recognizing each other… there’s a reason we have a sign, you know.”</i>", parse);
	Text.NL();
	Text.Add("Right, right. You’re just getting used to this whole outlaw business yourself.", parse);
	Text.NL();
	Text.Add("<i>“Which is why we’re trying to ease you in all nice-like.”</i> Vaughn thinks a moment, then shakes his head. <i>“That’s the long and short of it, [playername]. Go there in the evening, small park to the west of the castle. Girl by the name of Elodie, pretty young, likely to be dressed all formal-like, because castle servant, you see. Hand her the thieves’ tools, then come back to me for a debrief.”</i>", parse);
	Text.NL();
	Text.Add("All right, that sounds straightforward enough. You’ll be there and back without too much trouble.", parse);
	Text.NL();
	Text.Add("<i>“Right. High Command is counting on you to work hard in forwarding the cause, and all that other motivational stuff I’m supposed to be saying, but I honestly think is a bunch of crap. Have fun out there, and don’t come back to me before the job is done.”</i>", parse);
	Text.Flush();
	
	world.TimeStep({hour: 1});
	
	vaughn.taskTimer = new Time(0, 0, 3, 0, 0);
	
	party.Inv().AddItem(Items.Quest.OutlawLockpicks);
	
	vaughn.flags["Met"] = Vaughn.Met.OnTaskLockpicks;
	
	Gui.NextPrompt();
	//#add “Tools” option to castle grounds.
}

Scenes.Vaughn.Tasks.Lockpicks.ElodieAvailable = function() {
	return world.time.hour >= 16 && world.time.hour < 21;
}

//Triggered in castle grounds
Scenes.Vaughn.Tasks.Lockpicks.MeetingElodie = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	//Correct time
	if(!Scenes.Vaughn.Tasks.Lockpicks.ElodieAvailable()) {
		Text.Add("You arrive at the park and spy the bench by the pond, but there’s currently no one sitting on it at the moment, let alone someone who could be your contact. What was the meeting time again? Sometime in the evening? Maybe you should come back then.", parse);
		Text.Flush();
		
		world.TimeStep({minute: 10});
		
		Gui.NextPrompt();
		return;
	}
	
	var metElodie = rigard.flags["Nobles"] & Rigard.Nobles.Elodie;
	
	Text.Add("Evening lends a calm air to the castle grounds, and you arrive at the park as instructed. With the day drawing to a close, servants and nobles alike are enjoying what small amount of free time there’s to be had - this close to the castle proper, extra care is taken by the groundskeepers to ensure the flowerbeds are pristine and the lakes clear.", parse);
	Text.NL();
	Text.Add("<b>“No walking on the grass”</b> - elsewhere, that might be a joke, but it wouldn’t do to test the resolve of the patrols that’re charged with enforcing such.", parse);
	Text.NL();
	Text.Add("After a little looking around, you spy the bench that Vaughn singled out - an elegantly carved two-seater facing a small pond. Seated on it is a young woman, a small brown bag full of breadcrumbs in her hands as she reaches into it and scatters them onto the water’s surface, much to the local ducks’ delight.", parse);
	Text.NL();
	if(metElodie) {
		Text.Add("You recognize her immediately: the maid who was staring at you on the streets of the castle grounds some time back. She’s with the outlaws? Well, it would explain why she was eyeing you, or how she managed to blend into the crowd so effortlessly. The result of plenty of practice, no doubt.", parse);
		Text.NL();
		Text.Add("Well, it seems like you’ll get the chance to confront her, regardless of how either of you feels about it.", parse);
		Text.NL();
		Text.Add("Clearly, she’s felt your gaze upon her, for she looks up and meets your eyes, brushing a few stray strands of rust-brown hair out of the way. You do your best to be discreet in quickly sketching the outlaws’ symbol in the air, then let out the breath you’d been holding when she quickly sketches the three-fingered paw back at you and picks up her headdress from the bench.", parse);
		Text.NL();
		Text.Add("<i>“Ah, so my suspicions were right. You <b>are</b> with us, then.”</i>", parse);
		Text.NL();
		Text.Add("What kind of suspicions did she have about you that she was staring at you in the street?", parse);
		Text.NL();
		Text.Add("<i>“The kind someone in my position should have when an unknown quantity turns up. Now hurry, beside me. And don’t be so self-conscious, you’re drawing attention.”</i>", parse);
	}
	else {
		Text.Add("You take a moment to size up the young woman. Dressed in a long-sleeved blouse, apron and long skirts all dyed in the royal colors, there’s little doubt that she’s a servant of some sort - her outfit just screams “maid”, although to whom and in what standing, you’re not completely sure.", parse);
		Text.NL();
		Text.Add("Judging by the white linen gloves she’s wearing and the headdress lying on the bench beside her, though, you’re guessing that she does serve someone quite important for her daily dress to require such. Neat and clean, but deliberately muted, her attire’s clearly designed to be presentable and elegant without running the risk of outshining any important personages nearby.", parse);
		Text.NL();
		Text.Add("All in all, she looks really young - couldn’t be more than eighteen or nineteen, which only makes her ample bosom stand out on her still maturing frame. A touch of morph blood in her veins, perhaps? A silvered brooch pinned on her breast marks her as being in the castle’s employ which is probably why she’s been left largely alone while waiting for you. Raucous though the local lads may be, they presumably know enough to run the risk of displeasing someone within the castle.", parse);
		Text.NL();
		Text.Add("Clearly, she’s felt your gaze upon her, for she looks up and meets your eyes, brushing a few stray strands of rust-brown hair out of the way. You do your best to be discreet in quickly sketching the outlaws’ symbol in the air, then let out the breath you’d been holding when she quickly sketches the three-fingered paw back at you and picks up her headdress from the bench.", parse);
		Text.NL();
		Text.Add("<i>“Hurry, beside me. And don’t be so self-conscious, you’re drawing attention.”</i>", parse);
	}
	Text.NL();
	Text.Add("Well, that’s an invitation if you ever had one. Easing yourself onto the bench beside her, you lean back and try to look nonchalant as she continues feeding the ducks.", parse);
	Text.NL();
	Text.Add("She’s Elodie?", parse);
	Text.NL();
	Text.Add("<i>“Yes, and you’re [playername], the one who came through the portal. You have them?”</i>", parse);
	Text.NL();
	Text.Add("Wordlessly, you produce the bag of thieves’ tools and slide them across to Elodie. She palms the bag, draws it open and peers inside, scrutinizing its contents before tying it closed and tucking it away into her apron.", parse);
	Text.NL();
	Text.Add("<i>“Send the badger my regards.”</i>", parse);
	Text.NL();
	Text.Add("Brusque, isn’t she? Since there’s the possibility that you’re going to be working together from now on, shouldn’t you at least introduce yourselves properly?", parse);
	Text.NL();
	Text.Add("Elodie doesn’t reply immediately, instead looking about her for… well, you’re not sure what it is she’s looking for. The ducks quack happily as she throws another handful of breadcrumbs onto the lake’s surface. <i>“Right. The next person I’m supposed to meet this evening isn’t here yet, so I’ve some time to spare. I’m Elodie, handmaiden to the Queen - or rather, one of the many handmaidens to the Queen.”</i>", parse);
	Text.NL();
	Text.Add("Right. That would explain the fancy outfit.", parse);
	Text.NL();
	Text.Add("<i>“This isn’t ‘fancy’. Trust me, you haven’t seen fancy when it comes to what goes on within the castle.”</i>", parse);
	Text.NL();
	Text.Add("Fine, fine. Still, it surprises you that the outlaws would have someone so close to the royal family. With someone in Elodie’s position, you’d have thought they’d have made a move by now. Is that what the thieves’ tools are for?", parse);
	Text.NL();
	Text.Add("<i>“How much do you know about Majid?”</i> Elodie replies. <i>“Do you know, for example, that before he became vizier to our good king Rewyn, he was a common criminal?”</i>", parse);
	Text.NL();
	Text.Add("No… you didn’t know that. Come to think about it, you don’t really know that much about his past, even though everything you’ve heard about him tends to be bad news.", parse);
	Text.NL();
	Text.Add("<i>“Oh, he was somewhat high up, as criminals reckon themselves. Nevertheless, our dear vizier was a criminal all the same, and I have little doubt he still is.”</i> She jangles the pouch in her apron. <i>“The evidence I need is close, I’m sure of that. All I have to do is actually get my hands on it…”</i>", parse);
	Text.NL();
	Text.Add("Well, good luck with that.", parse);
	Text.NL();
	Text.Add("<i>“Yes.”</i> She looks around once more, then eyes you. <i>“I suggest that you be on your way soon. My next contact is about to arrive. Say hello to the people in the forest for me.”</i>", parse);
	Text.NL();
	Text.Add("Right. You just need to ask one more thing… there isn’t any way that she could help get you into the castle, is there?", parse);
	Text.NL();
	Text.Add("<i>“No. Let’s put it in perspective: it took me seven years to work my way up from scullery girl to handmaiden to the Queen, during which I took more than a few liberties which I realize could have gone very, very badly for me had I been less lucky. Getting into the castle isn’t something that’s easily done. You’re obviously resourceful to worm your way into the grounds on such short notice, but I can’t help you with this one.”</i>", parse);
	Text.NL();
	Text.Add("All right. Well, there doesn’t seem like there’s anything else for you here. Standing up, you dust off your seat and leave the park just in time to see a well-dressed man take a seat besides Elodie and strike up a conversation, just like you did. As you look on, her previously hard demeanor quickly melts away into one of shy, girlish innocence at the drop of a hat, a changing of masks. The last glimpse you have of Elodie is that of her squeaking in surprise and giggling nervously as her contact pinches her butt.", parse);
	Text.NL();
	Text.Add("Seems like her evenings are quite busy… well, it’s none of your business. Time to head back and report in, then.", parse);
	Text.Flush();
	
	party.Inv().RemoveItem(Items.Quest.OutlawLockpicks);
	
	vaughn.flags["Met"] = Vaughn.Met.LockpicksElodie;
	
	world.TimeStep({hour: 1});
	
	Gui.NextPrompt();
}

//Automatically triggers when approaching Vaughn after completing the task.
Scenes.Vaughn.Tasks.Lockpicks.Debrief = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>“Ah, you’re back.”</i> Vaughn tips his hat at you as you approach. <i>“Passed them along just fine, didn’t you?”</i>", parse);
	Text.NL();
	Text.Add("Yes, you did.", parse);
	Text.NL();
	if(vaughn.taskTimer.Expired()) {
		Text.Add("<i>“Right, right. Remember what I said about not taking your time and acting as if everything’s going to wait forever until you go and start things? Well, perhaps you didn’t, because those picks arrived later than they ought to have.</i>", parse);
		Text.NL();
		Text.Add("<i>“It’s not too much of a problem now - better late than never, as some say - but from here on out, late is going to be never. You’ll want to be punctual, because if you act like someone who can’t be relied upon, don’t be surprised when people don’t rely on you to get the job done.”</i>", parse);
		Text.NL();
		Text.Add("Right, right, you’ll be punctual from here on out.", parse);
		Text.NL();
		Text.Add("<i>“As I said, it’s better to not accept and let others do the job than accept and not show up. I mean it - people are going to be very, <b>very</b> upset if you waste all their hard work just because you showed up late. Consider this fair warning; this isn’t your family’s business, as the saying goes. Now, back to the point. What were you about to say?”</i>", parse);
		Text.NL();
	}
	Text.Add("Seems like even the castle isn’t free of the shenanigans that’re sweeping the kingdom.", parse);
	Text.NL();
	Text.Add("Vaughn removes his hat and wipes his brow, swivelling his ears in your direction. <i>“What? You mean the place where the people responsible for all this crap live is supposed to be free of the crap itself? Spirits forbid, you’d have expected them to know not to shit where they eat, but hey, seems like it’s just the opposite. I don’t envy Elodie, but that girl’s got some fire within her. She’s the only person we’ve got inside the castle, and that took years to set up.”</i>", parse);
	Text.NL();
	Text.Add("You were told as much, yes.", parse);
	Text.NL();
	Text.Add("<i>“Well, that seems to wrap it up. I do hope that girl doesn’t get in over her head - she has a thing for anything remotely related to the vizier, but there’s no stopping her.</i>", parse);
	Text.NL();
	Text.Add("<i>“As for you, [playername], I can’t give you much in return, but maybe you should head down to Raine’s and get something hot to eat. I’ll indent a bottle of moonshine in your name; it’s the least I can do. Amazing what you can do with water, wild fruit and a little sugar - just remember to turn in the bottles when you’re done. Glass is hard to come by these days.”</i>", parse);
	Text.NL();
	Text.Add("With that, he plonks his hat onto his head once more, and lights up a cigarette before heading into the watchtower’s confines.", parse);
	Text.Flush();
	
	vaughn.flags["Met"] = Vaughn.Met.CompletedLockpicks;
	
	outlaws.relation.IncreaseStat(100, 3);
	
	world.TimeStep({hour: 1});
	
	Gui.NextPrompt();
}

