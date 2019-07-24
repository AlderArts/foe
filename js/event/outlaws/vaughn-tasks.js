
import { GetDEBUG } from '../../../app';
import { Vaughn } from './vaughn';
import { WorldTime } from '../../worldtime';

let TasksScenes = {};

TasksScenes.OnTask = function() { //TODO add tasks
	return TasksScenes.Lockpicks.OnTask() ||
		TasksScenes.Snitch.OnTask() ||
		TasksScenes.Poisoning.OnTask();
}

TasksScenes.AnyTaskAvailable = function() { //TODO add tasks
	return TasksScenes.Lockpicks.Available() ||
		TasksScenes.Snitch.Available() ||
		TasksScenes.Poisoning.Available();
}

TasksScenes.StartTask = function() { //TODO add tasks
	if(TasksScenes.Lockpicks.Available())
		TasksScenes.Lockpicks.Start();
	else if(TasksScenes.Snitch.Available())
		TasksScenes.Snitch.Start();
	else if(TasksScenes.Poisoning.Available())
		TasksScenes.Poisoning.Start();
}

TasksScenes.TaskPrompt = function() {
	var parse = {
		
	};
	
	Text.Clear();
	if(TasksScenes.AnyTaskAvailable()) {
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
				
				Gui.NextPrompt(TasksScenes.StartTask);
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


TasksScenes.Lockpicks = {};
TasksScenes.Lockpicks.Available = function() {
	if(vaughn.flags["Met"] >= Vaughn.Met.OnTaskLockpicks) return false;
	return true;
}
TasksScenes.Lockpicks.OnTask = function() {
	return vaughn.flags["Met"] == Vaughn.Met.OnTaskLockpicks;
}
TasksScenes.Lockpicks.Completed = function() {
	return vaughn.flags["Met"] >= Vaughn.Met.CompletedLockpicks;
}

//No special requirements. Player should already have access to castle grounds.
//Note to Alder: refer to castle grounds docs. Create flag to see if player has inadvertently met Elodie via castle grounds exploration for use in this.
//Block that exploration scene if this scene has been viewed.
//TODO Note for far future: Do not enable this if/when Majid has been run out of Rigard.
TasksScenes.Lockpicks.Start = function() {
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

TasksScenes.Lockpicks.ElodieAvailable = function() {
	return WorldTime().hour >= 16 && WorldTime().hour < 21;
}

//Triggered in castle grounds
TasksScenes.Lockpicks.MeetingElodie = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	//Correct time
	if(!TasksScenes.Lockpicks.ElodieAvailable()) {
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
TasksScenes.Lockpicks.Debrief = function() {
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
	else {
		outlaws.relation.IncreaseStat(100, 1);
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


TasksScenes.Snitch = {};
TasksScenes.Snitch.Available = function() {
	if(vaughn.flags["Met"] >= Vaughn.Met.CompletedSnitch) return false;
	return true;
}
TasksScenes.Snitch.OnTask = function() {
	return vaughn.flags["Met"] == Vaughn.Met.OnTaskSnitch;
}
TasksScenes.Snitch.Completed = function() {
	return vaughn.flags["Met"] >= Vaughn.Met.CompletedSnitch;
}

//Disable this and jump ahead to task 3 if Miranda has been permanently recruited.
TasksScenes.Snitch.Start = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>“All right, then. Let’s see how good you are at a little sneaking about, then.”</i>", parse);
	Text.NL();
	Text.Add("What does he have in mind? Is he going to ask you to filch something?", parse);
	Text.NL();
	Text.Add("Vaughn grins. <i>“Actually, just the opposite. The boss-man would like you to put something where it shouldn’t be.”</i>", parse);
	Text.NL();
	Text.Add("That does sound interesting. Why, he should tell you more about what he has in mind.", parse);
	Text.NL();
	Text.Add("<i>“We’ve had a little problem with a certain constable in the City Watch shaking down the beggars on the streets, keeping them from even the usual spots which by tacit agreement, they’re allowed to ply their trade. Fellow by the name of Terrell… seriously, what kind of guy shakes down beggars for two coins’ worth of protection money?</i>", parse);
	Text.NL();
	Text.Add("<i>“Needless to say, the beggars are rather fed up with the situation, and since they’re our eyes and ears on the streets, it’s behooved the boss-man to step in and offer his support. Stand up for the poor and dispossessed, you know? Play the noble spirit and dish out a little justice?”</i>", parse);
	Text.NL();
	Text.Add("What a lofty goal. Vaughn and you lock eyes for a moment, then his grin twists into a smirk as he reaches into his vest and pulls out a folded slip of rough, stained paper. He thrusts it at you, and you catch it. Unfolding the paper, it’s a hand-drawn map of several blocks in the residential district, with lines drawn in the streets and times scribbled on the margins. You look up at Vaughn, and he shrugs.", parse);
	Text.NL();
	Text.Add("<i>“Funny thing about a corrupt fellow, I’ve noticed, is how he can’t keep it contained to just one or two instances. No, once a bastard goes on the take, he tends to grab as much as he can get. What you’re holding in your hands shows a number of surprise inspections on various establishments which took place place in the last week, establishments which were suspected of running illegal, untaxed games of chance. Oddly enough, despite the information they had, the City Watch turned up nothing in their raids.”</i>", parse);
	Text.NL();
	Text.Add("Terrell?", parse);
	Text.NL();
	Text.Add("<i>“Now you’re catching on. He sold out the watch, gave away the patrol route, and for what? A handful of coins? Frankly, we’re doing the watch a favor. If he’d kept to pushing around the poor and homeless, no one’d given a fuck. As it is, though… fellow’s overextended himself, and that makes it so much easier for us to take him down. As it stands, getting his bill of sale to the gambling dens was tricker than we’d expected, but we have him now.</i>", parse);
	Text.NL();
	parse["num"] = (WorldTime().hour < 12) ? "two" : "three";
	Text.Add("<i>“There’s going to be a locker inspection at the City Watch headquarters at six in the evening [num] days from now. Now, we aren’t about to show our faces around the City Watch headquarters, but they don’t know you. Get in there before then, plant this evidence in his locker, and step back to watch the fireworks. Now, I don’t know how to find his locker or how you’ll get into his things, so you’ll be alone in that regard. Nevertheless, it’s the best way for his superiors to sniff him out in a natural fashion, and we’d prefer that by far.”</i>", parse);
	Text.NL();
	Text.Add("If the evidence is solid, then why shouldn’t you just walk into the commander’s office and slam it down on the desk? It should stand on its own merits, shouldn’t it?", parse);
	Text.NL();
	Text.Add("Quirking an eyebrow, Vaughn stares at you for a good half-minute or so, then bursts out in laughter. <i>“Oh, that’s a good one, [playername]. For a moment there, I thought you were actually serious. I mean, who thinks the watch is going to take some stranger’s word over one of their own? Really really good joke, you nearly got me.”</i>", parse);
	Text.NL();
	Text.Add("Um… okay.", parse);
	Text.NL();
	Text.Add("<i>“All right, then. You’ve got your orders, don’t come back to me until you’ve got something to report.”</i> Vaughn dismisses you with a wave of a hand. <i>“Oh, and stay out of trouble. Things have been getting worse and worse in Rigard of late, and I’d rather not see you end up on the inside of a cell - or worse. Good luck.”</i>", parse);
	Text.NL();
	//TODO: This kinda doesn't work with recruited Miranda
	Text.Add("As you walk away, though, you can’t help but wonder about what Vaughn said. Sure, you may not know many of the watch personally, but you’re pretty sure Miranda’s on the straight and narrow. If the map is as solid evidence as Vaughn claims it is, then you should be able to talk Miranda around to your point of view. The more you consider the idea, the more it sounds like a viable alternative to sneaking into the City Watch headquarters - and probably easier, too, especially if you’re not confident that you’re skilled enough to not get caught in the act.", parse);
	Text.NL();
	if(miranda.Nasty()) {
		Text.Add("Of course, given that the two of you aren’t on the best of terms at the moment, you might have to do more than just talk her into listening to you.", parse);
		Text.NL();
	}
	Text.Add("Well, what happens next is up to you. It’s not as if you don’t know where to find the City Watch headquarters… that, or Miranda when she’s off-duty.", parse);
	Text.Flush();
	
	world.TimeStep({hour: 1});
	
	vaughn.flags["Met"] = Vaughn.Met.OnTaskSnitch;
	
	var step = WorldTime().TimeToHour(18);
	if(WorldTime().hour < 12)
		vaughn.taskTimer = new Time(0, 0, 2, step.hour, step.minute);
	else
		vaughn.taskTimer = new Time(0, 0, 3, step.hour, step.minute);
	
	//#add Evidence option to Miranda at the Maidens' Bane.
	//#add Evidence option to City Watch grounds.
	
	Gui.NextPrompt();
}

TasksScenes.Snitch.MirandaTalk = function(options, onDuty) {
	if(vaughn.taskTimer.Expired()) return;
	if(vaughn.flags["Met"] == Vaughn.Met.OnTaskSnitch && miranda.flags["Snitch"] == 0) {
		options.push({ nameStr : "Snitch",
			tooltip : "Present your evidence against Terrell to Miranda and ask the dobie if anything can be done.",
			func : function() {
				TasksScenes.Snitch.Miranda(onDuty);
			}, enabled : true
		});
	}
}

TasksScenes.Snitch.Miranda = function(onDuty) {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	if(onDuty) {
		Text.Add("You take a look around, spotting several of Miranda’s colleagues nearby. Perhaps you should try to find somewhere more private to present her with Vaughn’s evidence. It’ll definitely be easier to sway her if she’s on her own, if it comes to that.", parse);
		Text.Flush();
		//Just leave it at that, the old menu stays
		return;
	}
	//else #else, Triggered at the Maidens’ Bane
	
	parse = player.ParserTags(parse);
	
	Text.Add("Well, you’re here, Miranda’s here, and no one’s looking directly at the both of you. You’ve decided on doing this, might as well get it over with. Convincing Miranda to take action without asking too many inconvenient questions might not be the easiest of tasks, but it’s still more appealing than tampering with someone’s possessions in the City Watch headquarters.", parse);
	Text.NL();
	Text.Add("Let’s see whether you get off on the right foot, then. Calling over a serving wench, you order a couple of drinks, then settle in as they’re brought to your table.", parse);
	Text.NL();
	if(miranda.Nice()) {
		Text.Add("<i>“Ho!”</i> Miranda exclaims as you pull the evidence out of your possessions. <i>“What’s this we have here?”</i>", parse);
		Text.NL();
		Text.Add("Slowly, you unfold the paper and explain to Miranda what all this is supposed to mean. Does she have any memory of the most recent crackdown on illegal gambling dens?", parse);
		Text.NL();
		Text.Add("<i>“I’m not surprised that you heard about it - everyone down at the yard’s been grumbling about it day and night. Of course I still remember it clear as day - my feet still hurt from tramping up and down the streets, rushing from place to place. And for what? Nothing at all. We had good info. We’d been watching each one for a week at least. And when we finally come in to shut them down and round them up, suddenly everything’s just hunky-dory.”</i> The dobie makes a show of spitting onto the table. <i>“All that time wasted, and for what? They’ll move their shows somewhere else, and we’ll have to find them all over again. Could take weeks. Months.”</i>", parse);
		Text.NL();
		Text.Add("Right, right. Seeing as how Miranda’s exhausted all her vitriol for now, you deem it safe to draw her attention to the paper. Does that handwriting seem familiar? Maybe the times scribbled in the margins? Or the city block - or at least, you think that’s what it is - depicted here in crudely-drawn squares and rectangles?", parse);
		Text.NL();
		Text.Add("The dobie frowns at you over her drink. <i>“What’re you getting at, [playername]? That’s -”</i>", parse);
		Text.NL();
		Text.Add("All of a sudden, Miranda’s eyes harden, and she pushes her drink away, the entirety of her attention focused on the little scrap of paper laid out in front of her. She reads it all the way through, then once more, and a final time. Taking her tankard in hand, Miranda slowly tightens her grip - you can actually see the dobie’s knuckles tighten under skin and fur until the tankard crumples and folds in her hand. Cheap beer spills out from the container’s remains, wetting the table - you rush to pull Vaughn’s evidence out of the way and urge her to calm down before she breaks the table, too.", parse);
		Text.NL();
		Text.Add("Miranda clearly chafes at the thought of calming herself, but acquiesces while you call for someone to clean up the mess and add the broken tankard to your tab. <i>“I knew it. One might’ve been chance. Two would’ve been suspicious - but every single sting we were supposed to make that day being bummed out like that? Someone sold us out!”</i>", parse);
		Text.NL();
		Text.Add("Right. Does she have an idea of who it is?", parse);
		Text.NL();
		Text.Add("<i>“Think so.”</i> Miranda looks down at the paper again and claps one meaty fist against the other’s palm. <i>“Look, the bastard even had the times when we were expected to arrive - since the times were only mentioned at last week’s muster, that narrows it down to those present then, and there’s only one bastard amongst those who writes like that. I never liked him… bastard. Can I have this thing?”</i>", parse);
		Text.NL();
		Text.Add("Why, of course. You’re more than willing to let her have the evidence - you were supposed to plant it anyway, so it’s not as if Vaughn’s expecting you to return it to him. Smiling, you tell Miranda she’s more than welcome to have it. She’ll need something to show her superiors, after all.", parse);
		Text.NL();
		Text.Add("Miranda growls and pockets the paper. <i>“First thing once I get back to the yard, I’m kicking down the door to the commander’s office and planting this straight on the desk, but first, a drink for the nerves. Feel fit to bust one any moment now - you kind of expect thugs and their sort to have no sense of decency, but when it’s one of our own…</i>", parse);
		Text.NL();
		Text.Add("<i>“Got to ask you, though. Where’d you find this? Doesn’t seem like it’s the sort of thing one finds lying around. I know you wandering types have your ways - I used to find all sorts of crazy shit back in my time with the Black Hounds - but I still gotta ask.”</i>", parse);
		Text.NL();
		Text.Add("And right on cue, the inconvenient question. While Miranda might be more reasonable than most of the City Watch, you’re not quite about to confess to her you’re with the outlaws - even if she didn’t want to lock you up, she’d be obligated to, and you know her well enough to bet on her fulfilling that obligation. That leaves either refusing to answer the question, or outright lying to her, regrettable as it may be.", parse);
		Text.NL();
		Text.Add("Decisions, decisions…", parse);
		Text.Flush();
		
		//[Refuse][Lie]
		var options = new Array();
		options.push({ nameStr : "Refuse",
			tooltip : "You’re not going to deceive her, but you’re not going to tell the whole truth, either.",
			func : function() {
				Text.Clear();
				Text.Add("A friend, you tell Miranda. You can’t reveal his name because that would get him into trouble - he spoke to you trusting that he wouldn’t be snitched on. The evidence is good, and you’re willing to stake your reputation on it.", parse);
				Text.NL();
				Text.Add("<i>“Snitches get stitches, as they say in the slums,”</i> Miranda agrees morosely. Her replacement drink arrives, and throwing back her head, she gulps down half the tankard in one go. <i>“I understand, but that means if the commander starts asking questions, I’ll have to name you as the snitch instead of whoever passed this to you - no problems there, right?”</i>", parse);
				Text.NL();
				Text.Add("You <i>did</i> just say you were willing to stake your reputation on it. To be frank, if it weren’t for the fact that another watchman would have greater clout and a better grip on the situation, you’d have walked into the yard yourself instead of seeking her out.", parse);
				Text.NL();
				Text.Add("<i>“Yeah, I get what you’re saying. Good old doggy here, she’ll carry your papers where they need to go. Y’know, what with you not knowing who was selling us out, I’m kinda glad you came to me.”</i>", parse);
				Text.NL();
				Text.Add("You reply that while she may be many things, you know that Miranda isn’t a sell-out.", parse);
				Text.NL();
				Text.Add("<i>“Aw, shucks. Flattery isn’t going to get you anywhere with me, you know.”</i> Miranda polishes off the rest of her drink, then slams the empty tankard on the table. It takes a couple of tries for her to get Vaughn’s evidence folded up again, but at last she manages it. <i>“Thanks for passing this along and thinking of me, though. I’ll definitely remember this.”</i>", parse);
				
				miranda.relation.IncreaseStat(100, 5);
				
				PrintDefaultOptions();
			}, enabled : true
		});
		options.push({ nameStr : "Lie",
			tooltip : "What’s a little white lie? Justice is served, and you don’t want to see the inside of a cell.",
			func : function() {
				Text.Clear();
				Text.Add("Right. You quickly try and think of a plausible lie, and tell Miranda that you got the evidence off one of the den’s employees who’s harboring a grudge against his current boss. Now, you have to watch out for your informants, so you’re not going to tell Miranda just <i>who</i> it is, but suffice to say that while it took a little effort, it certainly wasn’t impossible for said informant to get the bill of sale.", parse);
				Text.NL();
				Text.Add("<i>“That’s it?”</i> Miranda’s replacement drink arrives, and the dobie takes it in hand, peering into the beer’s murky, foamy depths before quaffing half the tankard in one go. <i>“And here I was, thinking you were going to cook up some cock-and-bull story full of details, instead of just that.”</i>", parse);
				Text.NL();
				Text.Add("What? Were you supposed to have done that? You thought to keep it short and to the point, since you know that she’s not the kind to take nicely to any kind of bullshitting on anyone’s part.", parse);
				Text.NL();
				Text.Add("<i>“No, no. That’s actually how a good number of stakeouts get started in the first place - someone we know and trust comes up and tips us off. Much like what you’re doing right now, although of course I haven’t known you as long as some of those ‘good citizens’ we know.”</i>", parse);
				Text.NL();
				Text.Add("But she believes that your information is good?", parse);
				Text.NL();
				Text.Add("<i>“The times, the locations… right down to the patrol route, it all checks out. You couldn’t have come up with this on your own, [playername], you weren’t at the muster when we all discussed these. You must’ve gotten your hands on this somehow, and it wasn’t from one of us.”</i> Miranda nods, then polishes off the rest of her drink. <i>“Although I’ll say, if I get egg - or worse - on my face because of you, then you know who I’m going to be looking for…”</i>", parse);
				
				miranda.relation.IncreaseStat(100, 3);
				
				PrintDefaultOptions();
			}, enabled : true
		});
		
		Gui.Callstack.push(function() {
			Text.NL();
			Text.Add("Right. You sip at your drink, and watch Miranda shuffle out of her seat. She’s going already?", parse);
			Text.NL();
			Text.Add("<i>“Terrell, the bastard…I’d love to stay and drink some more, [playername], but this is more important than you’d imagine. Aria’s tits, we’re the <b>City Watch</b>, not the Royal Guard. We may not have fancy livery or talk all fancy, but we’ve got what counts. Our swords may not be shiny, but they’re damn well sharp - and most importantly, we’re supposed to have each others’ backs.”</i>", parse);
			Text.NL();
			Text.Add("With that, Miranda reaches into her pockets and draws out a handful of coins. <i>“For you,”</i> the dobie says, muttering to herself. <i>“Pay for my drink and the broken crap, and buy yourself a couple of drinks, okay? You’ve just done me a big favor. Now, if you don’t mind, I’ve got some heads to crack…”</i>", parse);
			Text.NL();
			Text.Add("You watch Miranda storm off, and the palpable heaviness in the air lifts with her passing. Yeah… regardless of what happens next, Terrell’s fate isn’t one that you’d wish upon anyone. By the look of things, you can probably head back to Vaughn and tell him of your success, even if you didn’t come by it the way he expected.", parse);
			Text.Flush();
			
			if(miranda.Attitude() < Miranda.Attitude.Nice)
				miranda.flags["Attitude"] = Miranda.Attitude.Nice;
			
			world.TimeStep({hour: 1});
			
			vaughn.flags["Met"] = Vaughn.Met.SnitchMirandaSuccess;
			miranda.flags["Snitch"] |= Miranda.Snitch.SnitchedOnSnitch;
			
			miranda.snitchTimer = vaughn.taskTimer.Clone();
			
			Gui.NextPrompt();
		});
		
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		Text.Add("<i>“Why’re you being so nice to me all of a sudden?”</i> Miranda practically snarls, the dobie eyeing you suspiciously as a serving wench brings the both of you your drinks - tankards of cheap beer, by the looks of it. <i>“You want something from me, don’t you?”</i>", parse);
		Text.NL();
		Text.Add("Well, it’s not that you <i>want</i> something from her, but if she could give you her attention for a moment… biting your lip, you draw out Vaughn’s evidence and hope that she’s in an accepting mood this evening.", parse);
		Text.NL();
		Text.Add("Unfortunately, she isn’t. Miranda turns away from you without even so much as looking at what’s in your hands or touching her drink. <i>“Not interested.”</i>", parse);
		Text.NL();
		Text.Add("Damn it, can she just get over it for a moment and pay you mind for ten minutes? She can go straight back to being ornery after hearing you out and you can take things from there, but this is important!", parse);
		Text.NL();
		Text.Add("<i>“Oh? Important?”</i>", parse);
		Text.NL();
		Text.Add("Yes, important.", parse);
		Text.NL();
		Text.Add("<i>“How important?”</i>", parse);
		Text.NL();
		Text.Add("<i>Very</i> important.", parse);
		Text.NL();
		Text.Add("Miranda snorts, the dobie folding her arms under her bosom. <i>“That important, eh? Well, if it’s so important to you, I’m sure you wouldn’t mind sucking me off. Can’t think straight, not with an itch in my dick, and if this crap is so important to you, then you can put up with it for a little while.”</i>", parse);
		Text.NL();
		Text.Add("Hey, wait a minute -", parse);
		Text.NL();
		Text.Add("<i>“Thought you said it was important,”</i> Miranda replies, the dobie’s muzzle twisting in a crude leer. <i>“So you can put up with your distaste of my dick and suck me off under the table here and now, or you can forget about whatever it is you want to bother me about.”</i>", parse);
		Text.NL();
		Text.Add("Seems like Miranda’s in a positively foul mood, and entreating with her any further is probably only going to make things worse; she’s clearly intent on punishing you for walking out of her. So… what are you going to do now? Are you going to give in to the dobie’s demand for you to blow her, or not?", parse);
		Text.Flush();
		
		//[Yes][No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			tooltip : "If that’s what she wants…",
			func : function() {
				Text.Clear();
				Text.Add("You wait in stony silence for a few minutes, the hubbub of the Maiden’s Bane swirling about the two of you, but Miranda really isn’t going to relent.", parse);
				Text.NL();
				Text.Add("Fine. If this is what it’ll take, then you’ll do it.", parse);
				Text.NL();
				Text.Add("<i>“So, it <b>is</b> that important to you,”</i> Miranda sneers. <i>“Get under and start sucking, slut.”</i>", parse);
				Text.NL();
				parse["l"] = player.HasLegs() ? "on all fours - the table’s not even high enough for you to sit on your knees -" : "and dirty";
				Text.Add("Blowing a canid guardswoman under the table in a crowded bar… somehow, you get a distinct sense of deja vu about this whole thing. Well, you’ve decided to do this, time to get it over with; the less you dwell on it, the less it’ll hurt. You push aside your chair, get down [l] and crawl under the table. The floor of the Maiden’s Bane, while not exactly filthy, isn’t what you’d call clean, and it’s dark and ever so slightly damp under the old table. While all you can see from here is other peoples’ feet, you get the distinct impression that everyone else in the barroom can see you - and even if they couldn’t, it’s not as if they’re not going to figure out what’s going on.", parse);
				Text.NL();
				Text.Add("Before you know it, Miranda already has her shaft out, emerging from her uniform like a thick, juicy sausage. Guess she’s no stranger to the motions - with a lazy grunt, she spreads her legs wide open, letting you take in the full implications of what you’ve just agreed to do. Pushing forward her throbbing shaft, Miranda rubs it against your lips, letting you get a good taste of dobie dick, complete with a bead of pre-cum at the top. Is the thought of getting back at you making her <i>that</i> excited?", parse);
				Text.NL();
				parse["h"] = player.Hair().Bald() ? "head" : "hair";
				if(player.Slut() < 50) {
					Text.Add("You instinctively try to turn your head away at the sheer size of that massive member, but Miranda reaches under the table and grabs you by the [h], forcing your attention back where she wants it.", parse);
					Text.NL();
					Text.Add("<i>“Open up, you wimp. You picked the fight with me, now accept your punishment,”</i> she snarls, then yanks hard on your [h]. As you open your mouth to gasp from the sudden movement, the dobie guardswoman thrusts forward, plunging her cock between your lips and ramming it against the back of your throat, making you gag. Your eyes bulge at the sheer <i>girth</i> you’re forced to take in your maw, its taste coating your tongue and filling your nose, but Miranda doesn’t care. <i>“There, now suck! I'll beat you if you try to bite!”</i>", parse);
					Text.NL();
					Text.Add("Judging by the sheer vindictive edge in her voice, she clearly means every word of it, too. Feeling Miranda’s ramrod-straight shaft slip in and out of your gullet, you hold your proverbial nose and begin.", parse);
				}
				else {
					Text.Add("Despite how massive it is, your eyes can’t help but be drawn to Miranda’s member. While the more sensible portion of your mind - or at least, what’s left of it - helpfully suggests that putting that in your mouth probably isn’t the best of ideas, the rest of you has other ideas. Besides, if you’re going to have to do this, you might as well enjoy it.", parse);
					Text.NL();
					Text.Add("Seizing hold of that dobie dong, you let your fingers play over its heated, pulsating length even as Miranda pats you on the head like an animal.", parse);
					Text.NL();
					Text.Add("<i>“I thought you hated dick?”</i> the guardswoman jeers. <i>“Or is it just my dick that’s so disgusting to you? I don’t know whether I should be even more disgusted with you, or just plain honored.</i>", parse);
					Text.NL();
					Text.Add("<i>“Now start sucking, slut.”</i>", parse);
					Text.NL();
					Text.Add("She wants you to suck? Fine, you’ll suck alright.", parse);
				}
				Text.NL();
				Text.Add("With a muffled moan, you relax your mouth and throat as best as you can to get the job done and give your tongue space to at least try and do <i>something</i>. It’s hard, considering that it’s hard to even breathe, ", parse);
				if(player.sexlevel >= 3) {
					Text.Add("but you at least manage to get some wiggle room around Miranda’s mountainous shaft and run your tongue along the base of her shaft as she thrusts back and forth.", parse);
					Text.NL();
					Text.Add("<i>“Not too shabby,”</i> Miranda grunts as she works away, her words punctuated by small gasps of breath. <i>“Knew you’d come around to my way of thinking sooner or later, slut.”</i>", parse);
				}
				else {
					Text.Add("and it’s quite the futile endeavor - your mouth simply isn’t flexible enough for that. Not as if you could protest, even if you’d the mind to - all you can do is to go with the flow and try your best to prevent yourself from choking, or even worse, throwing up.", parse);
				}
				Text.NL();
				Text.Add("Miranda stifles a moan, her doggy dick hardening even more until you can distinctly feel every ridge and pulsing vein against your tongue and the roof of your mouth. There’s little doubt her intention is to make this short and sharp, but even so, you’re surprised when she picks up the pace, steady pounding turning into a frenzied ramming as if she were in a race to get herself off as quickly as possible.", parse);
				Text.NL();
				Text.Add("Clearly, Miranda’s decided that your grace period is over, and begins to skullfuck you vigorously, taking this opportunity to vent her accumulated frustrations on your person. You can’t quite see anything above the dobie’s waist, but by the way the chair she’s sitting on is creaking and the occasional thumping from the table’s surface above, she’s trying to steady herself; judging by how hard your head is being slapped back with each of Miranda’s thrusts, you’re not surprised.", parse);
				Text.NL();
				Text.Add("There’s not much you can do now but ride this one out - slightly disoriented by the rapid, violent movements your head and neck are being subjected to, you’re taken by surprise when Miranda cums hard and fast. Next thing you know, a meaty hand is pressing into your face, separating you from Miranda’s shaft with an audible pop.", parse);
				Text.NL();
				Text.Add("<i>“Oh no, you don’t get to swallow and hide it,”</i> the dobie growls. <i>“I want everyone in the barroom to see you painted all over. That should be a laugh.”</i>", parse);
				Text.NL();
				parse["arm"] = player.Armor() ? Text.Parse(" and gets into your [armor]", parse) : "";
				Text.Add("Not that you have the time or presence of mind to reply - you can actually hear the drinks rattle on the table above you as Miranda blasts load after load of thick, steaming cum all over your face and [breasts]. It seeps into your clothing[arm], leaving a distinct slippery stickiness all over your [skin] before dripping onto the wooden floor. Whoever’s slated to clean this up afterwards is going to have a nasty time dealing with the thick pool of spunk that’s gathering about the table legs.", parse);
				Text.NL();
				Text.Add("<i>“Fine, we’re done. Get up. Clean yourself off if you want - there’s no way you’re making yourself look good now.”</i>", parse);
				Text.NL();
				Text.Add("It’s over already? That was quicker than you’d expected, if rather more intense. Still reeling from the intensity of the facefuck you’ve just received, cum dribbling from your chin and neck, you shuffle out from under the table and wipe yourself off with the back of your hand. As Miranda predicted, the effort is pretty much useless at actually getting you to anywhere nearing presentable, and it results in is more people staring at you. Thankfully - or not - the onlookers have the good graces to turn away quickly when they realize what’s happening, leaving you and Miranda to stew in the aftermath of your hasty blowjob.", parse);
				Text.NL();
				Text.Add("<i>“Right.”</i> Miranda grins nastily at you, then leans back in her seat before polishing off the last of her beer. You note that she hasn’t bothered to put her dick back in her pants yet, perhaps to mock you. <i>“Let’s see what you’ve got for me, then. This is going to be good.”</i>", parse);
				Text.NL();
				Text.Add("What? Oh, right. What you came here for in the first place. Grimacing, you pull out Vaughn’s evidence once more, and slap it down on the table. By some miracle, it’s managed to escape unscathed, and Miranda takes it in her hands before unfolding it. The dobie’s lips move silently as she scans the paper - you hadn’t thought it possible that she could be any madder than she was already, but her expression steadily darkens like an ominous stormcloud. By the time she’s finished poring over the paper, Miranda looks practically rabid and ready to kill at the drop of a hat.", parse);
				Text.NL();
				Text.Add("<i>“Another drink!”</i> she barks at the closest serving wench. <i>“Not the cheap crap, but give me the distilled stuff from the cellar. And make it quick.”</i>", parse);
				Text.NL();
				Text.Add("As the poor girl scurries off, Miranda reads through Vaughn’s evidence once more, only pausing to shoot you the occasional suspicious glance through narrowed eyes. When the drink arrives, Miranda waves off the girl as she attempts to serve, snatches the freshly opened bottle and chugs several mouthfuls in one go.", parse);
				Text.NL();
				Text.Add("<i>“No. This can’t be right. It can’t be... but it explains so much. How each and every one of the dens we hit had managed to pack in their stuff by the time we came. The damn bastards, they seemed overly smug… there was a snitch amongst those who’d turned up at muster for the briefing the other day, and I think I damn well know who.</i>", parse);
				Text.NL();
				Text.Add("<i>“How the fuck did you get your hands on this?”</i>", parse);
				Text.NL();
				Text.Add("The only thing that’d probably make Miranda any more pissed than she currently is would be to tell her that you’re with the outlaws, and yet you know she’s got a nose for bullshit. You pare down the story as much as you think’s necessary, saying that your source would rather stay unnamed, but you’ll take responsibility for the evidence’s veracity if needed. Miranda doesn’t look wholly convinced, but at last she nods with a soft growl. It’s a little surprising at how easily she swallowed your words, but you <i>did</i> just blow her, and it’s clear she’s not exactly balanced at the moment.", parse);
				Text.NL();
				Text.Add("<i>“Fine. I get it. Most people who tip us off don’t want to be named, because snitches get stitches, as everyone knows - and I’m going to personally give some to that snitch the moment I get back to the yard. Them gambling dens have enough problems with those crooks squabbling over who gets to be top dog, this is probably one of those again. If you’re going to take responsibility for this…”</i> Miranda lets her voice trail off for a moment. <i>“Fuck it. I can’t believe this, but there’s no doubt it’s his handwriting. I’d recognize that chicken scrawl anywhere.”</i>", parse);
				Text.NL();
				Text.Add("You put on your most innocent face. Whose handwriting?", parse);
				Text.NL();
				Text.Add("<i>“That’s for me to know and for you to shut the fuck up about. This is watch business now, and it goes all the way up to the commander.”</i> By now, Miranda’s dick has softened enough for her to shove it back into her pants, which she does before standing up. <i>“I’m getting back to the watch house. No time to waste.”</i>", parse);
				Text.NL();
				Text.Add("With that, the dobie kicks in her chair and makes to leave, but not before turning back to you.", parse);
				Text.NL();
				Text.Add("<i>“You know, [playername], you sucked me off and you gave me a lead into why our stings have been coming up empty all the time of late. If this goes down right… well, this is bigger than just you and me. I’m willing to call it even between us if you are.", parse);
				Text.NL();
				Text.Add("Huh, now that’s a surprise. You wouldn’t have imagined it’d be like Miranda to let you off this easily, but she did say the words loud and clear. It’s an opportunity that you might not get easily again, should you pass it up…", parse);
				Text.Flush();
				
				vaughn.flags["Met"] = Vaughn.Met.SnitchMirandaSuccess;
				miranda.flags["Snitch"] |= Miranda.Snitch.SnitchedOnSnitch;
				miranda.flags["Snitch"] |= Miranda.Snitch.Sexed;
				
				miranda.snitchTimer = vaughn.taskTimer.Clone();
				
				world.TimeStep({hour: 2});
				
				//[Yes][No]
				var options = new Array();
				options.push({ nameStr : "Yes",
					tooltip : "Yeah, you’ve had enough of this. Time to call the score even… for now.",
					func : function() {
						Text.Clear();
						Text.Add("Fine, fine. Having Miranda mad at you all the time was exhausting on the nerves, anyways - getting her off your back would be a small relief.", parse);
						Text.NL();
						Text.Add("<i>“Hmph. Don’t think that this means I’m going to start wagging my tail when you get close. All we’re now is even - and hopefully, you’ve learned better than to piss me off again.”</i> Miranda smacks one meaty fist against a palm. <i>“Now, if you’ll excuse me, I have some business to take care of.”</i>", parse);
						Text.NL();
						Text.Add("With that, she turns and storms away, leaving you alone in the Maiden’s Bane.", parse);
						Text.Flush();
						
						miranda.flags["Attitude"] = Miranda.Attitude.Neutral;
						
						miranda.relation.IncreaseStat(100, 5);
						
						Gui.NextPrompt();
					}, enabled : true
				});
				options.push({ nameStr : "No",
					tooltip : "Refuse to call it quits.",
					func : function() {
						Text.Clear();
						Text.Add("Miranda shows you her teeth. <i>“Well, if that’s the way you want it, asshole. More fun for me, I suppose. Guess I’ll be facefucking your slutty little mouth for a little while longer, or maybe that’s what you want? Not now, though. I’ll deal with you later, after I’ve finished cracking some skulls back at the yard.”</i>", parse);
						Text.NL();
						Text.Add("With that, the dobie turns and storms off, leaving you wondering if continuing to receive Miranda’s enmity was the best of ideas.", parse);
						Text.Flush();
						
						Gui.NextPrompt();
					}, enabled : true
				});
				Gui.SetButtonsFromList(options, false, null);
			}, enabled : true
		});
		options.push({ nameStr : "No",
			tooltip : "No. You’re not standing for this. You’ll take your chances at the watch headquarters.",
			func : function() {
				Text.Clear();
				Text.Add("Screw this. While you might have expected that Miranda would be a hard sell, you hadn’t expected her to be <i>this</i> vindictive. Leaving your drink untouched, you quickly pay for it and stand up, making for the door.", parse);
				Text.NL();
				Text.Add("<i>“Running away again?”</i> Miranda jeers from behind you. You don’t look back. <i>“You’re really that afraid of a dick? It’s not as if it’ll bite you.”</i>", parse);
				Text.NL();
				Text.Add("No, it might not bite you, but it’ll damn well do worse. Ah, fuck - this was a bad idea, anyway. You’ll just take your chances at the watch headquarters.", parse);
				Text.Flush();
				
				world.TimeStep({minute: 30});
				
				miranda.flags["Snitch"] |= Miranda.Snitch.RefusedSex;
				
				Gui.NextPrompt();
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
}

//Triggered via [Evidence] - Break into the watchmens’ lockers and plant the evidence. while in the City Watch area.
TasksScenes.Snitch.PlantEvidence = function() {
	var parse = {
		playername : player.name
	};
	
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	Text.Add("Right. No moment like the present. To say that trying to get up to shenanigans here makes one tense, when the place is crawling with watchmen day and night - well, that’s an understatement if you ever heard of one. Still, you’ve got to keep your cool - if anyone starts asking what you’re doing here, you’ll probably say… hmm… that’s you’re looking for Miranda. Yeah, that sounds about as good a cover story as you’ll be able to pass off.", parse);
	Text.NL();
	Text.Add("Finding the locker room isn’t too hard, though. You figure that it’s got to be reasonably close to the barracks for easy access by the watchmen coming on and off shift, so that’s where you begin. Thankfully, most of the off-duty watchmen are currently taken in by a running game of Cavalcade, so it’s relatively easy to slip past them and deeper into the building. Sure, you may not have done anything yet, but the fewer people remember that you were here, the better. With that thought in mind, you nip into the locker room, doing your best to look like you have every right to be there even though you aren’t formally with the City Watch.", parse);
	Text.NL();
	Text.Add("The room itself is plain and sparse. Clearly, it was built when the watch was much smaller in strength than it’s today. While the lockers aren’t actually rusting - the City Watch has at least <i>that</i> much discipline - they’ve nevertheless gained a tarnish with age that no amount of metal polish and lemon juice will remove. This, of course, might have something to do with how closely they’re packed together in neat rows, with barely enough space for one to move between them comfortably.", parse);
	Text.NL();
	Text.Add("The middle of the room is occupied by a number of benches, on which several off-duty watchmen are lounging and chatting.", parse);
	Text.NL();
	Text.Add("You weigh your odds as you scan the names on the lockers, trying to find Terrell’s - no such luck yet, although you do spot one with the name “Miranda” stenciled on it. The cramped conditions in the locker room probably mean that you’ll have some modicum of cover while trying to break into his things, although how effective it’ll be when the place is crawling with watchmen coming and going is another matter.", parse);
	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
	if(party.Num() > 1)
		Text.Add(" You could use [comp] to obscure the view along the long, narrow lines of lockers, too.", parse);
	Text.NL();
	Text.Add("Then there’s the matter of actually getting into Terrell’s things. By the looks of it, each locker is uniform in both make and lock, and a brief inspection of the locks reveals them to be of a simple turnbolt mechanism. There’s enough space that you might be able to slide a card or something between frame and door to jimmy the lock both ways, or if you’ve the aptitude to do so, you could try picking the lock proper. Either that, or maybe if you had enough skill, you could magic the lock open, will the bolt to rise or play with a bit of air…", parse);
	Text.NL();
	if(party.InParty(terry)) {
		Text.Add("Of course, why bother with all this when you’ve got Terry with you? [HeShe]’s a professional thief, you could just ask [himher] to do the job for you and get it over with.", parse);
		Text.NL();
	}
	Text.Add("While most of the off-duty watchmen might be occupied with the dice game out in the barracks, anyone might come around any time and start asking inconvenient questions. You probably don’t have too much time to make your move, so you ought to choose your next action carefully.", parse);
	Text.Flush();
	
	var rogue = Jobs.Rogue.Unlocked(player);
	
	//[Lock][Magic][Terry]
	var options = new Array();
	options.push({ nameStr : "Lock",
		tooltip : Text.Parse("[Jimmy] the lock.", {Jimmy: rogue ? "Pick" : "Jimmy"}),
		func : function() {
			Text.Clear();
			if(rogue) {
				Text.Add("Well, no time to waste. You stoop and quickly inspect the lock one last time, then get to work. Having been trained in the ways of the rogue, you find the attempt easier than most might expect, but success is by no means guaranteed.", parse);
			}
			else {
				Text.Add("Well, you aren’t making any progress standing around like this. Stooping to give the lock one last inspection, you work as best as you can to get the bolt lifted. The locker may not be the most sturdily made, but it’s still a worthy enough opponent that it might give you a little trouble.", parse);
			}
			Text.NL();
			
			var dex = player.Dex() + Math.random() * 20;
			dex += rogue ? 20 : 0;
			
			var check = 60;
			
			if(GetDEBUG()) {
				Text.Add("Dex check: [dex][r] vs [check]", {dex:dex, check:check, r:rogue?" (bonus for Rogue)":""}, 'bold');
				Text.NL();
			}
			//#lock success
			if(dex >= check) {
				Text.Add("Moments tick by, and with each one that passes, your heart beats a little faster. Is someone going to look down the line of lockers and see what you’re up to? Your fingers begin to shake a little, but you get things under control, and at last, at last - there’s a faint but satisfying <i>thunk</i> of the bolt lifting and you take hold of the locker door and pull it open.", parse);
				Text.NL();
				Text.Add("Right. Where to put the evidence so that it looks natural? You eye the locker’s contents - a few sets of uniforms, cleaning tools for said uniforms, what looks like a dried snack in a tied paper bag - ah, looks like there’re some notebooks near the back. You flip through them, hoping to find something incriminating, but Terrell clearly isn’t enough of an idiot to leave something like that in his locker moments before the inspection. Boy, is he going to be surprised.", parse);
				Text.NL();
				Text.Add("Stuffing Vaughn’s evidence between the notebook’s pages, you quickly set everything back as it was - slipping the deadbolt down is far easier than lifting it, and you waste no time slipping out of the locker room and from the watch headquarters altogether. The resulting fireworks might be fun to watch, but they’re probably much safer when viewed at a distance - you don’t want to risk anyone remembering that you were around earlier in the day.", parse);
				Text.NL();
				Text.Add("With nothing left for you here, perhaps it’d be best to report back to Vaughn and let him know the job’s done.", parse);
				
				vaughn.flags["Met"] = Vaughn.Met.SnitchWatchhousSuccess;
			}
			else {
				Text.Add("Perhaps too worthy an opponent, in fact. Fumbling leads to frustration, which only leads to more fumbling - while you manage to lift the bolt slightly on a couple of tries, it always evades your efforts at the last moment and falls down onto the latch.", parse);
				Text.NL();
				Text.Add("You’re running out of time, and keenly aware of that fact. The watchmen in the barracks outside are going to be finishing their game soon, judging by the sound of their raised voices and enthusiastic whoops, and your breath whistles through your gritted teeth as your final attempt subsides into failure.", parse);
				Text.NL();
				Text.Add("Footsteps. The locker room will be flooded with tired, exhilarated watchmen in a matter of moments - even if you’d the locker door open before you right now, there’d be no time to plant the evidence. Quickly, you nip away from the line and slip out just in time to avoid a dog-tired patrol stomping in from the streets.", parse);
				Text.NL();
				Text.Add("You’re probably not going to get another chance to be alone in the barracks for some time now… but at least you tried. Best to head back to Vaughn and hope he isn’t too hard on you for your failure.", parse);
				
				vaughn.flags["Met"] = Vaughn.Met.SnitchWatchhousFail;
			}
			Text.Flush();
			
			world.TimeStep({minute: 30});
			
			Gui.NextPrompt();
		}, enabled : true
	});
	var mage = Jobs.Mage.Unlocked(player);
	if(mage) {
		options.push({ nameStr : "Magic",
			tooltip : "Try and get the bolt to lift with a bit of magic.",
			func : function() {
				Text.Clear();
				parse["phisher"] = player.mfTrue("his", "her");
				Text.Add("Right. Getting a bolt to move quietly and silently… that should be child’s play for someone who can conjure up fire with a snap of [phisher] fingers, right? You size up your opponent one last time - while it would be easier to blast the door open as opposed to the finesse required to stealthily lift the bolt, it’d also create no end of unfortunate repercussions you’d rather avoid.", parse);
				Text.NL();
				Text.Add("Well, you’re wasting time standing around here. Narrowing your eyes, you focus your concentration and begin.", parse);
				Text.NL();
				
				var mag = player.Int() + Math.random() * 20;
				var magStage2 = Scenes.Global.MagicStage2();
				if(magStage2) mag += 20;

				var check = 50;
				
				if(GetDEBUG()) {
					Text.Add("Int check: [mag][m] vs [check]", {mag:mag, check:check, m:magStage2?" (bonus for tier 2 magic)":""}, 'bold');
					Text.NL();
				}
				if(mag >= check) {
					Text.Add("The going is slow but steady. Too quickly and you’ll make a whole lot of noise, too slow and you might lost your grip, sending the bolt clattering back into place. Through the narrow slit between door and frame, you watch a glint of metal rise and finally, a gentle tug on the door has the locker open and bare for your perusal.", parse);
					Text.NL();
					Text.Add("Great. Time to find a good place to plant the evidence before you’re discovered - Terrell’s locker is full of spare uniform sets, a boot-cleaning kit, a small tin of brass polish, what looks like an oily snack in a brown paper bag - entirely mundane and boring stuff. You’re just about considering whether to simply slip the papers into the breast pocket of his uniform when you notice a small stack of notebooks buried near the back. ", parse);
					Text.NL();
					Text.Add("Now <i>those</i> look interesting. While flipping through them doesn’t reveal anything incriminating in and of itself amidst the pages - mostly old patrol logs and notes - it’d make a good and believable place for you to plant Vaughn’s papers. Wasting no time, you slip them between the notebooks’ pages, then do your best to arrange everything like it was before closing the door. Turning the bolt down is easy - all you need is a little push, and it falls back into the latch with a clang.", parse);
					Text.NL();
					Text.Add("Maybe a little too loud for comfort, but you don’t need to be too worried about that anymore. Quickly, you nip out of the locker room and through the barracks, and not one moment too soon; the watchmen are just about done with their game of dice, and various whoops of excitement denote the conclusion of the last round. You don’t look back - best that everyone forget that you were ever here today…", parse);
					Text.NL();
					Text.Add("Well, that seems to be that. You’re not about to hang around when the fireworks go off - perhaps you should head back to the outlaws’ and report in to Vaughn. It’d probably be safer for you that way.", parse);
					
					vaughn.flags["Met"] = Vaughn.Met.SnitchWatchhousSuccess;
				}
				else {
					Text.Add("Try as you might, your concentration keeps slipping - that damned bolt will rise just a little, then teasingly plonk straight back onto the latch. Not that the mounting frustration is doing any wonders for your concentration, and that in turn causes more mistakes until your breath is coming through your gritted teeth. You don’t have much time to do this, and you’re keenly aware of that fact - the locker room being sparsely occupied right now is probably a lucky fluke, all things considered.", parse);
					Text.NL();
					Text.Add("All of a sudden, there’s a loud clang from the lock, the sound of the bolt striking something with considerable force. Had you meant to do that? You don’t remember so, but you must have - and with quite the amount of noise, too.", parse);
					Text.NL();
					Text.Add("Footsteps, not just from the barracks, but within the room itself - perhaps you ought to have been paying more attention to your surroundings, but it’s too late for that now as you nip out from the line of lockers and out of the locker room even as the footsteps begin to converge upon Terrell’s locker. Damn it! For a second or two, blowing the locker’s door wide open seems like a good idea in retrospect…", parse);
					Text.NL();
					Text.Add("No time to lose, though - the watchmen know something’s up, and you’d rather not have anyone inconveniently remember that you were snooping about today. It’s only when you’re out of the watch house and on the street by the walls that you dare to catch your breath and look back.", parse);
					Text.NL();
					Text.Add("Well, fireworks sure’ve went off, but not quite the ones you expected. Seems like there’s no hope of successfully getting the job done now, not with the City Watch alerted to your shenanigans - perhaps it’d be best if you headed back to Vaughn and see what he has to say.", parse);
					
					vaughn.flags["Met"] = Vaughn.Met.SnitchWatchhousFail;
				}
				Text.Flush();
			
				world.TimeStep({minute: 30});
				
				Gui.NextPrompt();
			}, enabled : true
		});
	}
	if(party.InParty(terry)) {
		options.push({ nameStr : "Terry",
			tooltip : "Have Terry open the locker for you.",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Really?”</i> Terry moans in an exaggerated display of exasperation. <i>“That? You want me to work on that flimsy old thing? My talents are wasted here, I tell you.”</i>", parse);
				Text.NL();
				Text.Add("Well, if it’s that simple, [heshe] should have no trouble getting it done. Or do you have to command [himher] to do it?", parse);
				Text.NL();
				parse["bitterly"] = terry.Relation() < 30 ? " bitterly" : "";
				parse["MasterMistress"] = player.mfTrue("Master", "Mistress");
				parse["foxvixen"] = terry.mfPronoun("fox", "vixen");
				Text.Add("<i>“Yeah, yeah,”</i> Terry replies, unshouldering [hisher] pack, chuckling[bitterly]. <i>“Your wish is my command, <b>[MasterMistress]</b>. Only problem would be all these eyes about, they’re making me nervous. Cover me while I work, will you?”</i>", parse);
				Text.NL();
				Text.Add("You stand on one side, hopefully obscuring Terry from anyone happening to peek down the long row of lockers. The [foxvixen] works away industriously, and in about half a minute, there’s a faint click and the locker door swings open.", parse);
				Text.NL();
				Text.Add("<i>“All done. As I said, child’s play to anyone who knows what [heshe]’s doing.”</i>", parse);
				Text.NL();
				Text.Add("You pet Terry on the head and praise [himher] for being such a clever little [foxvixen]. Certainly, choosing to take [himher] along on this little field trip was a good decision.", parse);
				Text.NL();
				Text.Add("<i>“Yeah, yeah.”</i> Terry shrugs off the praised with feigned indifference. <i>“Hurry up before someone notices that we’re not supposed to be here, will you?”</i>", parse);
				Text.NL();
				Text.Add("Right, right. Flinging open the locker, you’re greeted with a - well, it’s not a mess, but you wouldn’t call it neat, either. A couple sets of uniform take up most of the space, along with some needle and thread, boot polish, a brush… pretty standard for a watchman’s locker, really.", parse);
				Text.NL();
				Text.Add("You root around a bit, trying to find where Terrell keeps his personal belongings, and find a small corner in which a couple of notebooks have been stashed, along with a couple of letters of a more personal nature. Flipping through the notebooks reveals nothing incriminating in and of itself - mostly that the fellow’s pretty good at writing reports - but it looks like as good a place as any to plant Vaughn’s evidence.", parse);
				Text.NL();
				Text.Add("<i>“Hurry up!”</i> Terry whispers from beside you. <i>“Make up your mind!”</i>", parse);
				Text.NL();
				Text.Add("[HeShe] has a point. Seeing no better spot, you stick the evidence in between the notebook’s pages and quickly and quietly shut the locker door. Terry works [hisher] magic with [hisher] tools once more, and the door’s firmly locked again.", parse);
				Text.NL();
				Text.Add("Mission accomplished, time to get out of here - bringing Terry and [hisher] expertise along really made this a whole lot smoother than it could’ve been otherwise. Some of the watchmen still at their dice game look up at you as you leave, and you give them what you hope is a friendly smile and wave before slipping out of the watch headquarters. You shouldn’t be anywhere nearby when the sparks start to fly - best to head back to Vaughn and see what he has to say.", parse);
				Text.Flush();
				
				vaughn.flags["Met"] = Vaughn.Met.SnitchWatchhousSuccess;
				
				world.TimeStep({minute: 30});
				
				Gui.NextPrompt();
			}, enabled : true
		});
	}
	Gui.SetButtonsFromList(options, false, null);
}

TasksScenes.Snitch.DebriefAvailable = function() {
	return vaughn.flags["Met"] > Vaughn.Met.OnTaskSnitch &&
		vaughn.flags["Met"] < Vaughn.Met.CompletedSnitch;
}

TasksScenes.Snitch.Debrief = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	if(vaughn.flags["Met"] == Vaughn.Met.SnitchMirandaSuccess) {
		Text.Add("<i>“Right! So you’re back,”</i> Vaughn says, greeting you with a tip of his hat. <i>“I heard from our eyes on the street that quite the raucous caucus took place down at the Watch headquarters a little while ago. Quite the magnificent one, by all accounts. I wish I’d been there to see it myself, but duty calls and all.”</i>", parse);
		Text.NL();
		Text.Add("Why, there was some kind of shake-up? Oh dear. It certainly had nothing to do with you; it’s not as if you were even anywhere near the place when things went down.", parse);
		Text.NL();
		Text.Add("Vaughn chortles, a sharp yipping sound. <i>“Oh, that’s true all right. Seems like one of their members somehow managed to get her hands on a certain piece of evidence, then made a beeline for the commander’s office. I hear there was a bit of a dust-up involved, and Terrell, the poor bastard, is currently stuck with the drunks and shifts in a holding cell while his case is being looked at.”</i>", parse);
		Text.NL();
		Text.Add("Corruption in the City Watch? How terrible. Good thing that they were willing to clean up their act, and all the better that it was one of their own who did the unmasking.", parse);
		Text.NL();
		Text.Add("<i>“Either way, the bastard’s not going to be harassing the poor and downtrodden for a while yet. Permanently, I hope.”</i> Vaughn takes a deep breath, and lets it all out in a huge, contented sigh. <i>“You know, [playername], that was quite unexpected of you. I wouldn’t have gone to the City Watch myself, even if they’re less crooked than the Royal Guard.”</i>", parse);
		Text.NL();
		Text.Add("Oh, but you didn’t just go to the watch. You went to one of them whom you trusted to keep to the straight and narrow. That’s a big difference there.", parse);
		Text.NL();
		Text.Add("<i>“Indeed. Watchmen who don’t take bullshit were never that many to begin with, and they’re practically a dying breed nowadays.</i>", parse);
		
		TasksScenes.Snitch.DebriefSuccess(parse);
	}
	//Use this if the player opted to go to the watch headquarters and succeeded in planting the evidence.
	else if(vaughn.flags["Met"] == Vaughn.Met.SnitchWatchhousSuccess) {
		Text.Add("<i>“Ah, you’re back,”</i> Vaughn says, greeting you with a tip of his hat. The fox-morph seems uncharacteristically merry, and you have a guess as to why. <i>“Did you have a good time?”</i>", parse);
		Text.NL();
		Text.Add("It was quite the wonderful time. You didn’t dare to hang around to watch the fireworks like he suggested, but unless Terrell got back to his locker, found where you’d hidden the evidence and disposed of it - quite the unlikely case - then one could consider this mission accomplished.", parse);
		Text.NL();
		Text.Add("<i>“And so it was. We gave instructions to our people on the street to keep our dear friend busy for the day, up to the point where he was almost late for the inspection. Good times, good times. By all accounts, the reaction was quite… intense on both sides. No one likes a snitch, and that goes double for watchmen. Our people didn’t manage to find out what happened afterwards, but one can only assume he’s going to be off the streets for a little while yet, or at least until the investigation’s concluded.</i>", parse);
		
		TasksScenes.Snitch.DebriefSuccess(parse);
	}
	//Failure (Caught at Watch HQ)
	else {
		Text.Add("As you approach, Vaughn tilts his head up to look you in the eye. <i>“Welcome back, [playername]. Allow me to extend my condolences.”</i>", parse);
		Text.NL();
		Text.Add("What, does he know already?", parse);
		Text.NL();
		Text.Add("<i>“We had people watching the watch house for activity, good or bad. They’re rather quick and reliable at what they do - I got word a couple hours before you arrived.”</i>", parse);
		Text.NL();
		Text.Add("Ugh. That’s fast.", parse);
		Text.NL();
		Text.Add("<i>“And perhaps now you understand why a son of a bitch like Terrell pissing off the little people we rely on is such a big deal to us.”</i>", parse);
		Text.NL();
		Text.Add("Yeah, about that…", parse);
		Text.NL();
		Text.Add("Vaughn shrugs and waves off your imminent apology. <i>“Eh, the job was a crapshoot anyways. Getting into the watch house and planting it… Maria could’ve managed it, but some of the watchmen know her face. Still, I’d have hoped that you’d be able to do it, but you tried and failed. Yeah, sure, the boss-man would say that you failed anyway, but you didn’t chicken out, and that’s a point in your favor.”</i>", parse);
		Text.NL();
		Text.Add("How nice of him. Well, what happens now?", parse);
		Text.NL();
		Text.Add("<i>“We find another way to use this damning evidence. Either that, or if it takes too long… as I said, corrupt bastards like Terrell will take all that they think they can grab, and he’s not the kind who’s smart enough to cover his tracks consistently. I have a feeling that he’ll slip up again before long.</i>", parse);
		
		TasksScenes.Snitch.DebriefFailure(parse);
	}
}

TasksScenes.Snitch.OutOfTime = function() {
	return TasksScenes.Snitch.OnTask() && vaughn.taskTimer.Expired();
}

TasksScenes.Snitch.DebriefOutOfTime = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("By the time you can see Vaughn’s face, it’s clear that he’s not happy with you. The fox-morph is practically fuming as he eyes your approach, his hat shifting slightly as the ears underneath swivel this way and that.", parse);
	Text.NL();
	Text.Add("<i>“So, finally decided to turn up, did you?”</i>", parse);
	Text.NL();
	Text.Add("Now, wait a second here. If -", parse);
	Text.NL();
	Text.Add("<i>“Either you chickened out, or you couldn’t be bothered, <b>or</b> you’re the kind who thinks that nothing important will ever happen if you don’t personally go there and make it happen,”</i> Vaughn snaps in reply, cutting off your words. <i>“I’d rather believe the first of you rather than the third, ‘cause while I can understand a coward, I’ve no patience for assholes.”</i>", parse);
	Text.NL();
	Text.Add("Yeah, he’s not in a listening mood, and to be fair, he has every right to be mad with you.", parse);
	Text.NL();
	Text.Add("<i>“If you couldn’t turn up, you needn’t have given your word. All it’d have taken would be to say ‘hey, I don’t think I can do this, pass it along to someone else.’ That’s all it’d have taken. Now, we’ve got to clean up your mess, and I don’t like it one bit.</i>", parse);
	Text.NL();
	Text.Add("<i>“Sure, as I said, corrupt bastards like Terrell will take all that they think they can grab, and he’s not the kind who’s smart enough to cover his tracks consistently. I have a feeling that he’ll slip up again before long. Still, that doesn’t excuse you not showing up - we had people watching the watchmen for hours on end, waiting to see the fireworks, and they never got the show that they were promised.”</i>", parse);
	Text.NL();
	Text.Add("He had people watching?", parse);
	Text.NL();
	Text.Add("<i>“Well, yes, and they were more than willing to come, ‘cause they thought that the bastard was going to get his dues. Seems like they were disappointed, but them’s the breaks.</i>", parse);
	
	outlaws.relation.DecreaseStat(0, -4);
	
	TasksScenes.Snitch.DebriefFailure(parse);
}

TasksScenes.Snitch.DebriefSuccess = function(parse) {
	Text.NL();
	Text.Add("<i>“Well, that seems like that’s that,”</i> Vaughn says. <i>“Your help’s much appreciated, and with any luck, Terrell’s going to find himself in quite a bit of hot soup for the foreseeable future. Justice is served, righteousness prevails, and all that other stuff I’m supposed to say but I was never really very good at.”</i>", parse);
	Text.NL();
	Text.Add("Oh, it was a pleasure.", parse);
	Text.NL();
	Text.Add("<i>“Dunno if it’s a pleasure or not, but it damn well felt good to receive the news of the bastard’s demise. Here, it’s not much, but I set these aside for you from the last consignment which came in. We don’t have any actual <b>money</b> to spare at the moment, so goods is all that I can reward you with.”</i>", parse);
	Text.NL();
	
	Text.Add("Received 5x Energy Potions.<br>", parse, 'bold');
	Text.Add("Received 5x Speed Potions.", parse, 'bold');
	
	Text.NL();
	
	party.Inv().AddItem(Items.Combat.EPotion, 5);
	party.Inv().AddItem(Items.Combat.SpeedPotion, 5);
	
	outlaws.relation.IncreaseStat(100, 3);
	
	Text.Add("<i>“I think that’s all I have for you at the moment, [playername]. Stay safe out there, and check back in sometime with me. I may have something else for you later on.”</i>", parse);
	Text.Flush();
	
	vaughn.flags["Met"] = Vaughn.Met.CompletedSnitch;
	
	world.TimeStep({hour: 1});
	
	Gui.NextPrompt();
}

TasksScenes.Snitch.DebriefFailure = function(parse) {
	Text.NL();
	Text.Add("<i>“One more thing. You still have the evidence, don’t you?”</i>", parse);
	Text.NL();
	Text.Add("Well, yes, at least you still have that. Vaughn sticks out his hand, and you press the paper into his gloved palm. He mumbles something that’s neither here nor there, then snorts.", parse);
	Text.NL();
	Text.Add("<i>“Fine. At least we still can probably put this to good use in due time… although that time should be soon, and the plan probably won’t involve you, [playername]. You had your break and you blew it, so that’s that; at least we’re more than capable of rolling with the punches here.</i>", parse);
	Text.NL();
	Text.Add("<i>“Now, I’ve got nothing else for you, so just move along. Maybe in the future you’ll be given the opportunity to get back into the boss-man’s good graces, but right now, I’ve got to get Maria over and discuss how to best go about cleaning up your mess.”</i>", parse);
	Text.NL();
	Text.Add("With that, he turns away from you and storms into the darkness of the camp, leaving you to stew in your failure.", parse);
	Text.Flush();
	
	vaughn.flags["Met"] = Vaughn.Met.CompletedSnitch;
	
	world.TimeStep({hour: 1});
	
	Gui.NextPrompt();
}



//Bitmask
Vaughn.Poisoning = {
	Poison : 1,
	Aphrodisiac : 2,
	Success : 4,
	LeftItToTerry : 8,
	LeftItToTwins : 16,
	JoinedOrgy : 32,
	Used69 : 64,
	LeftItToLei : 128
}

TasksScenes.Poisoning = {};
TasksScenes.Poisoning.Available = function() {
	if(vaughn.flags["Met"] >= Vaughn.Met.CompletedPoisoning) return false;
	return true;
}
TasksScenes.Poisoning.OnTask = function() {
	return vaughn.flags["Met"] == Vaughn.Met.OnTaskPoisoning;
}
TasksScenes.Poisoning.Completed = function() {
	return vaughn.flags["Met"] >= Vaughn.Met.CompletedPoisoning;
}

TasksScenes.Poisoning.Start = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>“This one’s a little more dangerous than your previous assignment,”</i> Vaughn tells you after a moment’s contemplation. <i>“You’d be in considerable personal risk - we’re looking at an extended stay inside of a cell if you’re nicked, at least. I wouldn’t blame you if you wanted to back out and leave it to our more experienced operatives.”</i>", parse);
	Text.NL();
	Text.Add("Well, what’s the big deal? Or is he telling you this to lure you in with the temptation of forbidden fruit?", parse);
	Text.NL();
	Text.Add("Vaughn chuckles. <i>“Please, [playername]. I’m not so devious - Maria or the boss-man might be, but I’m as stiff and straight as a stick in the mud. No, here you’ll actually be committing quite the serious crime, so I’d rather you know what you’re getting yourself into before I send you out to do it.”</i>", parse);
	Text.NL();
	Text.Add("For the last time, you wouldn’t have said yes if you didn’t mean it. What’s he plotting, anyway? Assassination? Grand robbery? High treason?", parse);
	Text.NL();
	Text.Add("The easygoing smile vanishes from Vaughn’s face at those words. <i>“I’ve got that last one covered well enough, so please don’t joke around like that. No, I’d simply like you to poison someone. Want to hear the details?”</i>", parse);
	Text.NL();
	Text.Add("Oh. Uh… yeah, sure…", parse);
	Text.NL();
	Text.Add("Snorting, Vaughn leads you over to the opposite side of the watchtower and clear his throat. <i>“Right, let’s begin. Are you familiar with a certain Lady Katara Heydrich?”</i>", parse);
	Text.NL();
	Text.Add("Can’t say you’ve heard of her before, no. Should you?", parse);
	Text.NL();
	Text.Add("<i>“Probably not. Very minor personage in court, according to what Elodie’s passed along to us. Still, we need her out of the way. See, thing is that our good friend the King’s Vizier has drafted a number of rather… disturbing laws regarding morphs and those marked as traitors to the crown, allowing Preston and his little posse to circumvent the usual warrants and due process accorded all of the king’s subjects. As you can imagine, we don’t like this one bit.”</i>", parse);
	Text.NL();
	Text.Add("Right. How does the good Lady Heydrich come into play?", parse);
	Text.NL();
	Text.Add("<i>“She’s set to present the arguments for those laws at the next court session, when the nobs intend to debate their merits and see if they’re to be passed,”</i> Vaughn replies. <i>“It’s supposed to be the big break Majid’s giving to her, allowing her to speak for him.</i>", parse);
	Text.NL();
	Text.Add("<i>“I want you to make sure that she never turns up.”</i>", parse);
	Text.NL();
	Text.Add("That sounds… sinister.", parse);
	Text.NL();
	Text.Add("Vaughn’s muzzle twists into a sneer. <i>“As it should be. Don’t worry, I’m not going to ask you to kill anyone. That’d put far too much heat on us, and too soon at that. No, I just want you to cause her to be… indisposed, and to that effect, our good surgeon has prepared a couple of options for you.”</i>", parse);
	Text.NL();
	Text.Add("As you watch, Vaughn digs about in his pants pockets and draws out a couple of slender vials, one marked with a blue label, the other with a red one. Looking closely at them, their contents may as well have been water, for all you can tell - thin and runny, colorless and likely odorless, too. Vaughn makes a show of waving them in your face and smiles.", parse);
	Text.NL();
	Text.Add("<i>“The blue vial, or the red vial? Blue one’s going to give anyone unfortunate to taste a few drops a terrible case of the runs. The good lady won’t die, but she’ll wish she were dead for a couple of days. Red one’s… ah… let’s just say that she’ll jump the bones of the next living, breathing thing and fuck the poor sop silly, then move on to the next until she’s tired out… <b>then</b> continue like that for a day or two.</i>", parse);
	Text.NL();
	Text.Add("<i>“Care to pick your poison?”</i>", parse);
	Text.Flush();
	
	//[Poison][Aphrodisiac]
	var options = new Array();
	options.push({ nameStr : "Poison",
		tooltip : "The poison sounds cruel enough, thank you very much.",
		func : function() {
			Text.Clear();
			Text.Add("Vaughn nods and hands you the vial. <i>“I’m not going to envy the poor bitch when this gets into her system, but she really ought to have chosen a better bastard to throw her weight behind. I mean, I’ve never seen Majid in the flesh, but what I’ve heard of him makes me glad I’ve never had the chance for such. Well, since she enjoys spending so much time with dirty characters, I’m sure a case of the squealing shits won’t raise any eyebrows. The poison will take effect the following morning, so you’ll have plenty of time to make a getaway without raising too much suspicion.</i>", parse);
			Text.NL();
			Text.Add("<i>“Now, be careful with that thing. The glass shouldn’t shatter easily, but you don’t want to tempt fate any more than you need to. If you want to open it, just pull hard on the cork and it’ll pop free.</i>", parse);
			
			vaughn.flags["T3"] |= Vaughn.Poisoning.Poison;
			party.Inv().AddItem(Items.Quest.OutlawPoison);
			
			PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Aphrodisiac",
		tooltip : "Why not? It might be fun to watch.",
		func : function() {
			Text.Clear();
			parse["gen"] = player.mfFem("fellow", "girl");
			Text.Add("Vaughn grins at you and hands you the vial. <i>“Oh, looking to create a roof-raising scene, are we? That should be fun… as well as bring down a whole lot of disrepute upon our good lady. She certainly won’t be doing any speaking at court, then. Maybe some moaning… ha. Seriously, though, you’re quite the naughty [gen], [playername].”</i>", parse);
			Text.NL();
			Text.Add("This stuff is strong, isn’t it?", parse);
			Text.NL();
			Text.Add("<i>“The base recipe’s illegal, so I hear. Our good surgeon’s made a few additions of his own, some changes here and there, which should make it all the more amusing. When you’re ready to open this, just pull and twist hard on the cork, although I’d recommend holding your breath when you do so. Don’t want to accidentally sniff any of the fumes. This stuff will take effect almost immediately, but it need a couple of hours for the full effects to kick in. That should give you enough time to make a getaway before people start asking inconvenient questions.</i>", parse);
			
			vaughn.flags["T3"] |= Vaughn.Poisoning.Aphrodisiac;
			party.Inv().AddItem(Items.Quest.OutlawAphrodisiac);
			
			PrintDefaultOptions();
		}, enabled : true
	});
	
	Gui.Callstack.push(function() {
		Text.NL();
		Text.Add("<i>“Now, as for how much you want to use - just a thimbleful will do, really, but there’s enough in here to spike a full-course meal for a whole bunch of folks, which is what it’ll probably come to.”</i>", parse);
		Text.NL();
		Text.Add("Ah, right. Now he’s getting to the details - should you be taking notes?", parse);
		Text.NL();
		Text.Add("Vaughn shrugs and tucks away the vial you didn’t pick into his pocket. <i>“Well, if you want to. Fact is, our eyes and ears have learned that Heydrich’s going to be entertaining some of her fellow nobs in one of the suites at the Lady’s Blessing tomorrow evening; it’ll be quite the event, starting at five in the evening up till midnight. Supposedly, it’s for some kind of business deal or the other, but I personally think that they just want an excuse to stuff their faces. Whatever, it’s all the better for us. Suite number’s thirty-three, keep that in mind.</i>", parse);
		Text.NL();
		Text.Add("<i>“The entire staff of the Lady’s Blessing is going to be busy with catering to them <b>and</b> their usual clientele, so they’re bound to be overworked and understaffed. Mistakes happen, that sort of thing… there’s your chance. Again, you’ll be on your own for this, but an opportunity should show its face. And if one doesn’t… well, you’ll just have to make things happen, if you get what I mean.”</i>", parse);
		Text.NL();
		Text.Add("All right.", parse);
		Text.NL();
		Text.Add("<b>To recap - tomorrow from five to midnight at the Lady’s Blessing. Lady Heydrich, suite thirty-three, spike the food and make sure she doesn’t turn up at court.</b>", parse);
		Text.NL();
		Text.Add("<i>“That’s the long and short of it,”</i> Vaughn says with a nod. <i>“Remember, we’re counting on you. Don’t. Be. Fucking. Late. The clock’s a-ticking, and as I’m sure you know by now, the world doesn’t stop to wait for you to be ready.</i>", parse);
		Text.NL();
		Text.Add("<i>“All right then, [playername]. You’ve your orders - good luck and all that other lovely stuff. Success or failure, I’ll be here when you’re ready to report in.”</i>", parse);
		Text.Flush();
		
		world.TimeStep({hour: 1});
		
		vaughn.flags["Met"] = Vaughn.Met.OnTaskPoisoning;
		
		var step = WorldTime().TimeToHour(0);
		vaughn.taskTimer = new Time(0, 0, 1, step.hour, step.minute);
		
		Gui.NextPrompt();
	});
	
	Gui.SetButtonsFromList(options, false, null);
}


TasksScenes.Poisoning.InnAvailable = function() {
	//Trigger this upon stepping into the Lady’s Blessing with this task active (Allotted time, 17-24 the next day, ie timer not expired, and <= 7 hours).
	if(!TasksScenes.Poisoning.OnTask()) return false;
	if(vaughn.taskTimer.Expired()) return false;
	if(vaughn.taskTimer.ToHours() > 7) return false;
	return true;
}

TasksScenes.Poisoning.ArrivalAtInn = function(onWait, oldLocation) {
	var parse = {
		Orvin : Rigard.LB.KnowsOrvin() ? "Orvin" : "the innkeeper"
	};
	
	Text.Clear();
	if(onWait) {
		Text.Add("There's a sudden influx of activity as you overhear a conversation between [Orvin] and his staff. Apparently, the Lady Heydrich and her entourage are about to arrive any minute. As if summoned, small groups of chattering nobles wearing fancy clothes start filtering in through the front doors, quickly greeted by the waiters and ushered into a back room. Meanwhile, the rest of the staff busy themselves with their tasks, working with feverish determination.", parse);
	}
	else {
		parse["start"] = (oldLocation == world.loc.Rigard.Plaza) ? "Pushing open the door of the Lady’s Blessing" : "Walking down the stairs";
		Text.Add("[start], you find the the common room a whirl of activity. Not with patrons - the evening crowd is thin today - but with numerous staff, almost all of them darting between the kitchen and the stairs leading up to the rooms. The few patrons who are present are almost exclusively gathered about the gambling tables, keeping themselves out of the way of the busy waiters darting to and fro.", parse);
	}
	Text.NL();
	Text.Add("An organized scene indeed… but teetering on the edge of confusion, an insidious current of chaos under the rushing surface. All it’d take is a push in the right direction to create a situation you could take advantage of… ", parse);
	Text.NL();
	if(!lei.Recruited()) {
		Text.Add("Lei is sitting in his usual corner, ever faithful to his charge. You meet the mercenary’s eyes, and he gives you a silent nod before turning his gaze away from you. He’s a small circle of calm in the whirlwind of activity, but he wouldn’t be Lei otherwise, you guess.", parse);
		Text.NL();
	}
	Text.Add("Even [Orvin] is working overtime today, helping out with the serving and cooking - just how many people is this Lady Heydrich entertaining today? The weight of the glass vial makes itself known in your pocket, and you focus your thoughts. You’re here on a task, after all… ", parse);
	Text.NL();
	Text.Add("Now, how will you go about doing this?", parse);
	Text.Flush();
	
	TasksScenes.Poisoning.InnPrompt({});
}

TasksScenes.Poisoning.InnPrompt = function(opts) {
	var parse = {
		Orvin : Rigard.LB.KnowsOrvin() ? "Orvin" : "the innkeeper",
		playername : player.name
	};
	
	//[Orvin][Kitchen][Waiters][Lei][Twins]
	var options = new Array();
	if(Rigard.LB.KnowsOrvin() && !opts.Orvin) {
		options.push({ nameStr : "Orvin",
			tooltip : "Chat with Orvin and try to find out more about the situation.",
			func : function() {
				Text.Clear();
				Text.Add("You wait for an opening when Orvin doesn’t look <i>too</i> busy, then step in and greet the innkeeper. He hesitates a moment, then returns your greeting with a smile, looking perhaps a little too happy to have an excuse to set down the empty dishes he’s carrying and take a breather.", parse);
				Text.NL();
				Text.Add("<i>“Oh, hello, [playername]. I’m afraid that we’re quite busy today - if you’re intending to eat here today, you’ll have to wait a little while for your order. Not too long, of course, since the busy spot’s about to clear up, but we were quite harried for most of the morning and afternoon.”</i>", parse);
				Text.NL();
				Text.Add("You put on your most innocent face and contrive to look surprised. Busy? What with?", parse);
				Text.NL();
				Text.Add("<i>“We’re quite honored to have one of the city’s fine ladies host her events here - the Lady Heydrich is entertaining some business contacts from the farther reaches of the kingdom, and has paid us quite the sum to put on our best face for them. As you can imagine, it’s been quite the endeavor getting ready for fifty-odd people in all of the four suites she’s booked for the occasion. All of my people and I, we’ve been preparing since last night for the big event, even if we’ve tried to not let it affect our usual business any.”</i>", parse);
				Text.NL();
				Text.Add("Looking at Orvin, he seems so proud and happy to be doing the catering - it’s almost a pity what you’re going to have to do here. Keeping a straight face, you look towards the kitchen. What was that he said about the busy spot being about to clear up? Does that mean he’s about finished, and you could place an order soon?", parse);
				Text.NL();
				Text.Add("<i>“Almost there. Almost there. It’s why I’m letting myself take a quick break, talking to you.”</i> Orvin replies. <i>“It’s just one more round of food and drinks to be sent up to their suites, and our part is done. I’ve served up only the best, and they can enjoy themselves all night long in peace.”</i>", parse);
				Text.NL();
				Text.Add("Judging by the wonderful smells coming out of the kitchen’s open door… yeah. You thank Orvin, then suggest that perhaps you’ll order something once the kitchens are less harried. In the meantime, maybe you’ll watch the cavalcade game or something… sorry about troubling him with your questions.", parse);
				Text.NL();
				Text.Add("<i>“Oh no, it was my pleasure.”</i> Orvin picks up his burden once more with a grunt, rolling his clearly aching shoulders. <i>“I needed to take a breather, anyway.”</i>", parse);
				Text.NL();
				Text.Add("You nod and give Orvin a little wave as the innkeeper disappears. Last round of food and drinks to be brought up, eh? Seems like you’ve arrived in the nick of time, then - you don’t have time to dither around, and will have to act quickly. What do you intend?", parse);
				Text.Flush();
				
				opts.Orvin = true;
				
				TasksScenes.Poisoning.InnPrompt(opts);
			}, enabled : true
		});
	}
	options.push({ nameStr : "Kitchen",
		tooltip : "Sneak into the kitchen and get up to some mischief.",
		func : function() {
			TasksScenes.Poisoning.Kitchen(opts);
		}, enabled : true
	});
	if(!opts.Waiters) {
		options.push({ nameStr : "Waiters",
			tooltip : "Waylay one of the waiters with your charm and try to create an opening.",
			func : function() {
				Text.Clear();
				Text.Add("Hmm. If the kitchen’s a no-go, then that leaves you with the only option of waylaying the food en route to its destination. <i>That</i> in turn means having to deal with one of the many waiters plying up and down the staircase leading to the inn’s upper stories, and you get the distinct feeling that whatever shenanigans you’re going to cook up to distract the waiters with, they’re going to have to be good. Really good.", parse);
				Text.NL();
				Text.Add("Although heading over to the stairwell and trying your best to get their attention, not a single one stops to give you so much as a moment. ", parse);
				if(player.Cha() > 45)
					Text.Add("Some of them do glance in your direction for a bit, but quickly snap back to the task at hand. ", parse);
				Text.Add("Is Lady Heydrich’s little get-together that important? Sure seems like it, for so many of the staff to be dedicated to serving her. Or maybe there’s something more to it, judging from how nervous they look…", parse);
				Text.NL();
				Text.Add("There’s no time to sit around and ponder the issue at length, though. If this isn’t going to work, then you need to find another way to get at the food… maybe someone you know could help? Two minds are better than one, after all.", parse);
				Text.Flush();
				
				opts.Waiters = true;
				
				TasksScenes.Poisoning.InnPrompt(opts);
			}, enabled : true
		});
	}
	if(!opts.Lei) {
		options.push({ nameStr : "Lei",
			tooltip : "Ask Lei and see if you can learn more about the situation.",
			func : function() {
				opts.Lei = true;
				
				Text.Clear();
				Text.Add("You settle down across the table from Lei, and he inclines his head at you ever so slightly in acknowledgement.", parse);
				Text.NL();
				Text.Add("That gives you an idea. Lei is quite the skilled mercenary, isn’t he? Perhaps you could hire him to do a small side job, since his current one isn’t that demanding? Subcontract your work out, in a manner of speaking? It <i>is</i> an option, one that you needn’t automatically quash out of hand… nothing ventured, nothing gained, right?", parse);
				Text.NL();
				Text.Add("Well, will you ask, or not?", parse);
				Text.Flush();
				
				//[Yes][No]
				var options = new Array();
				options.push({ nameStr : "Yes",
					tooltip : "Ask Lei if he’s willing to moonlight for you.",
					func : function() {
						Text.Clear();
						Text.Add("<i>“Yes, [playername]? What is it?”</i>", parse);
						Text.NL();
						Text.Add("You quickly explain the situation to him, leaving out the obviously illicit bits regarding your information about the outlaws - he’s a mercenary, surely he’ll understand the whole ‘discretion’ thing. Lei doesn’t so much as move a muscle, but you can tell he’s listening intently to each and every one of your words.", parse);
						Text.NL();
						Text.Add("When you finish, there’s what seems like a long silence, and Lei finally speaks again. <i>“So, you wish to subcontract out the job to me.”</i>", parse);
						Text.NL();
						Text.Add("That’s the idea, yes. Will he do it?", parse);
						Text.NL();
						if(lei.Relation() >= Lei.Rel.L3) {
							Text.Add("Lei closes his eyes and thinks a moment. <i>“An interesting proposal. As luck would have it, I am certain that my employers will not be in need of my services for the next couple of hours. It appears a suitable opportunity to practice some of my more subtle skills.</i>", parse);
							Text.NL();
							Text.Add("<i>“Show me this vial of yours.”</i>", parse);
							Text.NL();
							Text.Add("You do so, palming it as you pull it out of your possessions and carefully hand it over to Lei. He turns it over in his fingers for a couple of moments, studying the flow of the liquid within, then nods at you.", parse);
							Text.NL();
							Text.Add("<i>“A most appropriate choice. I haven’t seen this for some time. Very well, I will do it - for a price.”</i>", parse);
							Text.NL();
							Text.Add("And what’s his asking fee?", parse);
							Text.NL();
							Text.Add("<i>“First, that you sit here in my stead until I return, lest someone attempt to take advantage of my absence. I should not be long, but vigilance is demanded. Secondly, a small fee of two hundred and fifty coins.”</i>", parse);
							Text.NL();
							Text.Add("Huh.", parse);
							Text.NL();
							Text.Add("Lei shows you a small smile. <i>“I can’t let word get out that I work for free, can I? There would be no end to the line of those seeking favors from me. I assure you, [playername], two hundred and fifty coins is a very reasonable price for a few minutes of my time.”</i>", parse);
							Text.NL();
							Text.Add("Well, it’s come to this. He’s a mercenary, what did you expect? Will you pay Lei or not?", parse);
							Text.Flush();
							
							//[Yes][No]
							var options = new Array();
							options.push({ nameStr : "Yes",
								tooltip : "Pay his asking price.",
								func : function() {
									Text.Clear();
									Text.Add("<i>“Delightful.”</i> Lei’s expression doesn’t change as he counts your money, then without warning, he stands from his seat.", parse);
									Text.NL();
									Text.Add("He’s got all the details, right?", parse);
									Text.NL();
									Text.Add("<i>“I have. Don’t worry. Keep watch over the approach to my wards’ suite for me, and I will return shortly.”</i> He passes a few coins back to you. <i>“Purchase a drink for yourself, such that you do not appear obtrusive.”</i>", parse);
									Text.NL();
									Text.Add("With that, Lei vanishes into the milling crowd of busy inn staff, leaving you all alone at his table. You do as he says, quickly ordering a drink from one of the few less busy-looking waiters, then sit down to savor it and look alert. True to his word, perhaps fifteen minutes have passed before Lei returns to your table and takes his seat once more.", parse);
									Text.NL();
									Text.Add("<i>“It is done.”</i>", parse);
									Text.NL();
									Text.Add("Wow. He must be really good at his job.", parse);
									Text.NL();
									Text.Add("<i>“A small matter of sleight of hand, nothing more,”</i> Lei replies matter-of-factly. <i>“When another’s attention is on your face, he or she scarcely notices what the hands are doing. Similarly, drawing attention to one hand means the other is often overlooked. My only concern is that my wards’ sleep will be disturbed tonight with the effects of your clever concoction.”</i>", parse);
									Text.NL();
									Text.Add("Well, that seems to be that. Thanking Lei one last time, you make to take your leave. Best to head back to Vaughn and report your success.", parse);
									Text.Flush();
									
									party.coin -= 250;
									
									vaughn.flags["T3"] |= Vaughn.Poisoning.LeftItToLei;
									
									party.Inv().RemoveItem(Items.Quest.OutlawPoison);
									party.Inv().RemoveItem(Items.Quest.OutlawAphrodisiac);
									
									vaughn.flags["Met"] = Vaughn.Met.PoisoningSucceed;
									vaughn.flags["T3"] |= Vaughn.Poisoning.Success;
									
									world.TimeStep({hour: 1});
									
									if(vaughn.flags["T3"] & Vaughn.Poisoning.Aphrodisiac)
										Gui.NextPrompt(TasksScenes.Poisoning.AphrodisiacEntry);
									else
										Gui.NextPrompt(function() {
											MoveToLocation(world.loc.Rigard.Plaza);
										});
								}, enabled : party.coin >= 250
							});
							options.push({ nameStr : "No",
								tooltip : "You can’t or won’t pay.",
								func : function() {
									Text.Clear();
									Text.Add("You shake your head and say that on second thought, maybe you’ll do it yourself. Lei shows no displeasure at your words, but simply nods.", parse);
									Text.NL();
									Text.Add("<i>“I wish you the best of luck, [playername]. If there is nothing else, I must return to my duties.”</i>", parse);
									Text.NL();
									Text.Add("You push out your chair, stand, and survey the room as you consider your remaining options. What now? The clock’s a-ticking if you want to have any chance at success here.", parse);
									Text.Flush();
									
									TasksScenes.Poisoning.InnPrompt(opts);
								}, enabled : true
							});
							Gui.SetButtonsFromList(options, false, null);
						}
						else {
							Text.Add("Lei shakes his head slowly. <i>As you know full well, my services are currently engaged. I will wish you the best of luck, for the cause your task is serving seems to be a worthy one - I am full aware of the disturbing nature of some of the laws passed of late - but I’m sure you understand that I cannot simply abandon my post to aid you. That would be highly remiss of me.”</i>", parse);
							Text.NL();
							Text.Add("Oh well. You thought you’d ask, anyway.", parse);
							Text.NL();
							Text.Add("<i>“Asking is all well and good. I’ve witnessed many an agreement which could be reached had one party thought to simply open his or her mouth and put forward the proposal. Of course, one must consider the current circumstances in which the question is framed - something which you neglected to attend to.</i>", parse);
							Text.NL();
							Text.Add("<i>“Now, if that is all, I must return to my vigil.”</i>", parse);
							Text.NL();
							Text.Add("You nod, and rise from the seat. Seems like enlisting Lei’s help didn’t work out - you’ll have to find another avenue to achieve your goals here.", parse);
							Text.Flush();
							
							TasksScenes.Poisoning.InnPrompt(opts);
						}
					}, enabled : true
				});
				options.push({ nameStr : "No",
					tooltip : "Nah, you’ll pass.",
					func : function() {
						Text.Clear();
						Text.Add("Lei glances at you as you make yourself comfortable in the seat. <i>“[playername]. What brings you to me today?”</i>", parse);
						Text.NL();
						Text.Add("The inn seems busy today, doesn’t it?", parse);
						Text.NL();
						Text.Add("<i>“Some event or the other, hosted by someone small trying to make herself look bigger,”</i> Lei replies drolly. <i>“A common enough strategy amongst both animals and people, but wholly ineffective against someone who easily sees through the illusion. It is of little consequence, since it does not interfere in my ability to carry out my charge, although I will admit that the extended delay in getting a drink once ordered is turning quite intolerable.”</i>", parse);
						Text.NL();
						Text.Add("Quite the situation indeed. What did he say about not interfering, though? Wouldn’t the crowd of harried staff provide cover for anyone trying to sneak upstairs, or something on those lines?", parse);
						Text.NL();
						Text.Add("<i>“With those uniforms? No, anyone not dressed as the staff would stand out, and I daresay the good innkeeper’s people all know each other. All I need to do is watch.”</i>", parse);
						Text.NL();
						Text.Add("Hmm…", parse);
						Text.NL();
						Text.Add("<i>“I’m not in the mood to make small talk today, [playername]. If there’s no particular reason for you to seek me out, I request that you please leave me be for now.”</i>", parse);
						Text.NL();
						Text.Add("Lei’s voice distinctly implies that this isn’t open to negotiation, and you decide that it’s probably best not to pester him any further, lest he take it as provocation. You rise from your seat, nod, and start weighing your remaining options.", parse);
						Text.Flush();
						
						TasksScenes.Poisoning.InnPrompt(opts);
					}, enabled : true
				});
				Gui.SetButtonsFromList(options, false, null);
			}, enabled : true
		});
	}
	if(!opts.Twins) {
		options.push({ nameStr : "Twins",
			tooltip : "Could the Twins possibly lend a hand here?",
			func : function() {
				Text.Clear();
				
				opts.Twins = true;
				
				Text.Add("A thought strikes you: sure, the task set before you may not be the easiest one, but it’s not as if you’re completely on your own here. You <i>do</i> have friends in high places close by, and you might as well bring all the resources you have to bear, right?", parse);
				Text.NL();
				Text.Add("With that thought in mind, you start off towards the stairs leading up. Some of the waiters cast suspicious looks at you when you pass by them, but soon settle down when it becomes clear you’re not heading for the suites, but rather the penthouse up top. The suspicion is a bit off - it’s not as if you’ve done anything just yet, right? - but you nevertheless emerge up into the Twins’ penthouse. Rumi - or at least, this is how the twin that greets you introduced herself - ushers you in, and by the looks of it they were sharing a bottle of wine and a moment of relaxation when you so thoughtlessly barged in on them. Both of them have donned gowns, but there’s no time for cute mind games this evening; there’s work to be done.", parse);
				Text.NL();
				Text.Add("<i>“Welcome, [playername].”</i> Rani - or at least, you’re taking Rumi’s word that she’s who she is - says, raising his glass in a small salute. <i>“Decided to drop by? You look quite pale - why don’t you have a little merlot? It’ll do wonders for your complexion.”</i>", parse);
				Text.NL();
				Text.Add("No, not right at the moment. You’re busy, and was wondering if the two of them could lend a little assistance.", parse);
				Text.NL();
				Text.Add("Rumi glides over behind her brother and places her hands on the chair’s backrest. <i>“Oh? This I must hear.”</i>", parse);
				Text.NL();
				Text.Add("Quickly, you summarize the salient details of your mission here, conveniently forgetting to include anything and everything about the outlaws, of course. The twins listen intently as you speak, and when you finish, Rani grins from ear to ear.", parse);
				Text.NL();
				Text.Add("<i>“Ah, so that’s what all that fuss was all about, and why it took so long for the wine to arrive. A full half-hour late, if I remember correctly.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Shame,”</i> his sister agrees with a vigorous nod of her head. <i>“Someone of noble blood throws a big party for ‘business ends’, and no one thought to invite the prince and princess?”</i>", parse);
				Text.NL();
				Text.Add("What? Haven’t they bothered to look outside their door since afternoon?", parse);
				Text.NL();
				Text.Add("<i>“No,”</i> Rumi replies flatly. <i>“We were… preoccupied.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Quite so.”</i> Rani runs his tongue over his lips.", parse);
				Text.NL();
				Text.Add("Right. Whatever floats their boat, but now that they’re appraised of the situation, could their royal personages possibly consider lending a hand in your venture? Any ideas would be welcome.", parse);
				Text.NL();
				Text.Add("The twins glance at each other, their expressions suddenly serious, and you can practically see the gears turning in their heads. Rumi drums her fingers on the table as she thinks, chewing her lip in the process. <i>“Lady Heydrich, Lady Heydrich… name rings a bell, but can’t quite remember why…”</i>", parse);
				Text.NL();
				Text.Add("<i>“She was the one who went up against us on the proposal to start work on expanding the sewage system last week, remember?”</i>", parse);
				Text.NL();
				Text.Add("<i>“Ah, that’s it. Come to think of it, she’s been throwing her weight around a little too much of late - having Majid’s patronage would certainly drive someone petty like her into a bout of preening. Give power to the undeserving, and that’s what happens. I wonder just what Majid can get out of a small-timer like Heydrich.”</i> Rumi takes a sip of her drink and thinks for a little longer, eyes staring into empty space.", parse);
				Text.NL();
				if(twins.Relation() >= 80) {
					Text.Add("<i>“Another layer of obfuscation between him and his goals, of course. Lady Heydrich <b>has</b> been a thorn in our side for a while, wouldn’t you say, Sister?”</i>", parse);
					Text.NL();
					Text.Add("<i>“Yes. Yes, she has. I haven’t forgotten that last time she made a whole fuss about that bill. Quite desperate, if I remember.”</i> A smile breaks out on the princess’ face. <i>“I suppose we could lend a hand, grant a royal favor… within reason, of course. We do have reputations to maintain, and couldn’t be caught dealing with all sorts of shady characters.”</i>", parse);
					Text.NL();
					Text.Add("Like you, of course. Right. All you really need to do is to get at the feast before it’s served, so anything they could do to let you get close to the grub before it’s brought into suite thirty-three would be a great help. Or if they’d rather handle the vial themselves…?", parse);
					Text.NL();
					Text.Add("Rumi extends her hand. <i>“May I see this potion your friend has prepared?”</i>", parse);
					Text.NL();
					Text.Add("Why not, if it means a better chance they’ll help out? Digging through your possessions, you draw out Vaughn’s vial and pass it over to the princess. She turns it over in the light of a lamp, examining it from every angle, but the frown on her face remains where it is.", parse);
					Text.NL();
					Text.Add("<i>“I don’t recognize this,”</i> she murmurs, her face serious.", parse);
					Text.NL();
					Text.Add("<i>“Let me try, please.”</i> Rani receives the vial from his sister and pulls out the stopper with a flourish before using one hand to waft over the vapors to his nose. Nothing happens for a moment or two, and then he turns his head and sucks in a deep breath of fresh air, coughing to clear his airways.", parse);
					Text.NL();
					parse["hisher"] = player.mfFem("his", "her");
					Text.Add("<i>“Whoo, that’s strong! There’s no smell, as I expected, but… phew. You can <b>feel</b> it. You certainly have quite the talented friend, [playername]. I wouldn’t mind if you introduced me to him sometime.”</i> He turns to Rumi. <i>“It’s all right, sister. I think I know what this is - it’s just been strengthened considerably. No one’s going to die or even hurt really badly, but I think we’re going to see quite some fun if we help [playername] with [hisher] little prank. And if it’ll get Heydrich out of our hair at court… ”</i>", parse);
					Text.NL();
					Text.Add("<i>“All right, I’m in. What do we do?”</i>", parse);
					Text.NL();
					Text.Add("Actually, you were hoping that since they do open up more options, they’d have an idea of what those options were. Or at least, better options than the one you had.", parse);
					Text.NL();
					Text.Add("Rumi arches an eyebrow. <i>“What <b>were</b> you going to ask us to do, then?”</i>", parse);
					Text.NL();
					Text.Add("Ideally? Distract one of the waiters with their stunning personalities while you get up to mischief. But…", parse);
					Text.NL();
					Text.Add("<i>“But what?”</i> The princess smiles sweetly. <i>“It’s a simple plan, and these things should be no more complicated than they need to be. As for holding someone’s attention, don’t worry about that. We were born to it.”</i>", parse);
					Text.NL();
					Text.Add("Rani nods as he hands the vial back to you. <i>“And of course, Father’s education was not completely useless. On top of that, Orvin’s people may not know exactly who we are, but they’ve gathered that we’re people of some import over the course of our extended stay here. After all, with these rates only someone with plenty of money could afford to rent out our penthouse for as long as we have.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Agreed. They may not want to blow this event Heydrich’s had them cater, but there’s no guarantee that she’ll come back to them the next time she throws a party. We, on the other hand… we’re quite the steady source of income. They’ll give us the  time of day. Leave it to my brother and I.”</i>", parse);
					Text.NL();
					Text.Add("Good, good. That’s all you needed. How long will they need to be ready?", parse);
					Text.NL();
					Text.Add("Rumi smiles sweetly. <i>“Just let us get changed. If you’d wait outside, we’ll be with you in a minute or two.”</i>", parse);
					Text.NL();
					Text.Add("The twins are good to their word. Scarcely have a few minutes passed before they emerge into the hallway in their usual clothes, head for the opposite wall, and signal for you to wait in the recently vacated doorway. It doesn’t take too long before another handful of waiters appear in the stairwell with their carts, and the twins quickly round on the last in line, the playful air about them vanishing like mist with the dawn. It’s not too unlike the movements of predators dragging a straggler away from the safety of the herd, and despite the waiter’s fine uniform and prim dress, you can see it’s having much the same effect on the poor sop.", parse);
					Text.NL();
					Text.Add("<i>“You. Yes, you!”</i> Rani shouts, beckoning the waiter over with an outstretched finger. He obeys with a bowed head and downcast eyes, and no sooner has he come to a stop in front of the twins that they lay into him with savage abandon. <i>“We want to complain about the quality of service here of late!”</i>", parse);
					Text.NL();
					Text.Add("You can’t help but feel a twinge of pity for the poor waiter as the twins maneuver him right in front of the open doorway - right, the placard on the cart denotes that it’s for suite thirty-three. No problems there, then. Still, you wait for the angry barrage of insults to reach its zenith, completely absorbing the waiter’s attention before daring to make a move.", parse);
					Text.NL();
					Text.Add("The stony expression on Rumi’s face could stop a charging Rakh - her eyes hard and unflinching, her lips set into a thin, straight line. <i>“Face us when we’re speaking - or have you forgotten your manners? Tell Orvin that we won’t stand for this horrible quality of service here! Half an hour to get up to us - who knows how long it’s been sitting around for? The taste, it’s completely ruined, and…”</i>", parse);
					Text.NL();
					Text.Add("You quickly realize what they’re doing - diverting the waiter’s attention further away from the cart in front of him. This is your chance, then - while your mark’s back is turned to you, you quickly creep forward and introduce the vial’s contents into both the pitcher and dessert bowl. The watery fluid rushes in without a sound, mingling with dew and condensation as it creeps down the glassware’s sides.", parse);
					Text.NL();
					Text.Add("<i>“And remember, we want the wine properly chilled this time,”</i> Rumi huffs, looking every bit the spoiled princess, right down to the indignant air that’s practically palpable about her. <i>“I mean, half an hour! I know that you folk are busy today, but seriously, half an hour to bring up a bottle and ice bucket? What is this, Rirvale? I’ve half a mind to find better accommodations elsewhere - I hear there’s a new place near the castle grounds. Well, off with you! And don’t be tardy this time!”</i>", parse);
					Text.NL();
					Text.Add("Finally released, the poor waiter takes off at a run, his little food cart trundling along at an impressive pace, and both twins give you a wink as you emerge from the doorway to their penthouse.", parse);
					Text.NL();
					Text.Add("<i>“So, how were my sister and I?”</i>", parse);
					Text.NL();
					Text.Add("Oh, very convincing, you assure Rani. Very indignant indeed.", parse);
					Text.NL();
					Text.Add("Rumi smiles and shrugs, hooking an arm about her brother’s waist. <i>“Father did tell us that being overly open with one’s feelings is dangerous for a monarch, and I have to agree with him on that. In any case, should I be expecting lots of noise from downstairs tomorrow morning?”</i>", parse);
					Text.NL();
					Text.Add("Perhaps even earlier. Well, you ought to scoot before things get a little too heated up.", parse);
					Text.NL();
					Text.Add("<i>“We’ll see you around, then.”</i> With that, the Twins disappear into their room, and the door shuts with a good, solid thump. Time to make like a tree and leave.", parse);
					Text.Flush();
					
					vaughn.flags["T3"] |= Vaughn.Poisoning.LeftItToTwins;
					
					party.Inv().RemoveItem(Items.Quest.OutlawPoison);
					party.Inv().RemoveItem(Items.Quest.OutlawAphrodisiac);
					
					vaughn.flags["Met"] = Vaughn.Met.PoisoningSucceed;
					vaughn.flags["T3"] |= Vaughn.Poisoning.Success;
					
					world.TimeStep({hour: 1});
					
					if(vaughn.flags["T3"] & Vaughn.Poisoning.Aphrodisiac)
						Gui.NextPrompt(TasksScenes.Poisoning.AphrodisiacEntry);
					else
						Gui.NextPrompt(function() {
							MoveToLocation(world.loc.Rigard.Plaza);
						});
				}
				else {
					parse["himher"] = player.mfFem("him", "her");
					Text.Add("<i>“[playername] <b>has</b> been of quite some help to us of late,”</i> Rani pipes up. <i>“We should really repay [himher] with a favor or two sometime. Money only goes so far, and getting rid of Lady Heydrich’s influence for some time would certainly be a breath of fresh air for once.”</i>", parse);
					Text.NL();
					Text.Add("<i>“True, but we’ve been extending ourselves quite dangerously of late. Father is beginning to notice something’s up.”</i> Rumi turns away from her brother and to you. <i>“I’m sorry, [playername], but you’ve come at a bad time. If she does show up in court, we’ll fight her to the utmost for you - not as if it wasn’t in our interests to do as much anyway, if she really is fronting for Majid - but asking us to play a direct hand in your rather illegal escapades would bring more scrutiny down upon us than we’d care for at the moment.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Royal rank doesn’t matter much when it’s Father doing the hectoring,”</i> Rani adds. <i>“Sorry, [playername].”</i>", parse);
					Text.NL();
					Text.Add("Aah, that’s all right. It’s perfectly understandable - you’ll just have to find a way to deal with Lady Heydrich on your own, and they did say that they’d help you fight her during court if you fail here. Bidding farewell to the twins, you leave their penthouse and wind up back in the common room of the Lady’s Blessing.", parse);
					Text.Flush();
					
					TasksScenes.Poisoning.InnPrompt(opts);
				}
			}, enabled : true
		});
	}
	Gui.SetButtonsFromList(options, false, null);
}

TasksScenes.Poisoning.Kitchen = function() {
	var parse = {
		playername: player.name
	};
	
	Text.Clear();
	Text.Add("The wonderful aroma of the fare to be had in the Lady’s Blessing hits you once more, and your thoughts drift towards the busy kitchens. Getting into the suites is out of the question, so your best bet is to spike the food either after it’s been cooked or when it’s en route to its final destination. Of the two approaches, you decide that the former offers the best chance of success. Sneaking in, spiking the food and then hightailing it out of there - much easier said than done…", parse);
	Text.NL();
	if(party.InParty(terry)) {
		parse = terry.ParserPronouns(parse);
		
		Text.Add("…Of course, you do have with you someone who’s uniquely suited to the job of sneaking around, and if Terry can take things from where they belong, then putting things where they <i>don’t</i> belong should be just as easy. Right? Right?", parse);
		Text.NL();
		Text.Add("Seriously, though, are you going to ask Terry to do the job for you, or get up to mischief yourself?", parse);
		Text.Flush();
		
		//[Terry][Yourself]
		var options = new Array();
		options.push({ nameStr : "Terry",
			tooltip : Text.Parse("The thief's experience should really pay off here; you doubt [heshe]'ll have any trouble getting it done.", parse),
			func : function() {
				Text.Clear();
				
				parse["boygirl"] = terry.mfPronoun("boy", "girl");
				parse["foxvixen"] = terry.mfPronoun("fox", "vixen");
				
				vaughn.flags["T3"] |= Vaughn.Poisoning.LeftItToTerry;
				
				parse["rel"] = terry.Relation() >= 60 ? ", although you can tell it’s more teasing than indignant" : "";
				Text.Add("<i>“What?”</i> Terry exclaims[rel]. <i>“I’m to do your dirty work?”</i>", parse);
				Text.NL();
				Text.Add("Well, of course. That’s why you keep [himher] around, to do the things that you can’t manage alone. ", parse);
				if(terry.Sexed()) {
					Text.Add("Why, did [heshe] think you just kept [himher] around for the petting and fucking?", parse);
					Text.NL();
					parse["rel"] = terry.Relation() >= 60 ? Text.Parse(" before sticking [hisher] tongue out at you", parse) : "";
					Text.Add("<i>“Sometimes it seems that way,”</i> Terry replies[rel].", parse);
				}
				else {
					Text.Add("Why, did [heshe] think you just kept [himher] around for [hisher] charming personality?", parse);
					Text.NL();
					Text.Add("<i>“Don’t you try flattery on me,”</i> Terry replies, looking suspicious.", parse);
				}
				Text.NL();
				Text.Add("Hmph. In any case, you’re in need of someone who can do some sneaking, [heshe]’s really good at sneaking, and that should be enough reason. Besides, it’s not like [heshe]’s unfamiliar with the Lady’s Blessing - you have to admit, [heshe] really did look quite fetching in that waitress’ outfit… come to think of it, perhaps you could get your hands on a similar one for [himher] sometime…", parse);
				Text.NL();
				Text.Add("Resigned to [hisher] fate, Terry throws [hisher] hands in the air and sighs. <i>“All right, all right. I’ll see what I can do. No promises, though.”</i>", parse);
				Text.NL();
				Text.Add("That’s a good [boygirl]. Of course you know that [heshe] will do [hisher] best, right?", parse);
				Text.NL();
				Text.Add("Terry just skulks. You give the [foxvixen] an amused pat, and hand over Vaughn’s vial to [himher]. Come on now, it can’t be that hard, right? [HeShe] should be familiar with the kitchens’ layout and how things are run in there… who knows, [heshe] might even bump into an old friend or two. There’s no need to feel guilty - it’s all for a higher cause, yeah?", parse);
				Text.NL();
				Text.Add("<i>“All right, all right, all right,”</i> Terry groans. <i>“Let’s just get it over with.”</i>", parse);
				Text.NL();
				
				party.Inv().RemoveItem(Items.Quest.OutlawPoison);
				party.Inv().RemoveItem(Items.Quest.OutlawAphrodisiac);
				
				Text.Add("Without another word, Terry slinks out the front door, leaving you alone to bide your time in the barroom while the [foxvixen] works [hisher] magic. You find an empty table to relax at, order a couple of drinks from a harried-looking waiter, and settle down to nurse it as moments tick by.", parse);
				Text.NL();
				Text.Add("At length, Terry reappears at your side, looking positively exhausted and drained. How long has it been? No more than twenty minutes or half an hour, but you’d have thought it’d be more by how hard the [foxvixen]’s breathing. You pull out the chair across you, and Terry gladly slumps into it, eagerly digging into the spare drink on the table.", parse);
				Text.NL();
				Text.Add("How’d it go?", parse);
				Text.NL();
				Text.Add("<i>“Done,”</i> Terry replies, then wipes [hisher] muzzle with the back of [hisher] hand. <i>“It was very rough, but the job’s done.”</i>", parse);
				Text.NL();
				Text.Add("Really? For a master thief like [himher]?", parse);
				Text.NL();
				Text.Add("<i>“C’mon, cut me some slack here,”</i> Terry replies in a low hiss. <i>“They were looking out for trouble in the kitchen - I’m not guessing, I <b>know</b> it. Someone tipped them off. The constant looking over shoulders, second-guessing themselves, checking the dishes over and over again… I know Orvin and his people, and they don’t do this unless they’ve good reason to think someone’s going to mess with the food.”</i>", parse);
				Text.NL();
				Text.Add("Huh. Now that’s an interesting way of looking at things, and you’re doubly glad you asked Terry to go in your stead, but [heshe]’s absolutely sure?", parse);
				Text.NL();
				Text.Add("Terry nods. <i>“You get a feel for these things, and then have to decide whether you want to go through with the heist anyways. Still, it may have taken most of what I had, but hey, I still got the job done. I don’t think they were looking for someone like me, though, so that helped, even if there were so many eyes in the kitchen…”</i>", parse);
				if(terry.PregHandler().IsPregnant())
					Text.Add(" The [foxvixen] pats [hisher] rounded tummy. <i>“Didn’t help that I had to lug around this little one too, although I think they enjoyed it.”</i>", parse);
				Text.NL();
				Text.Add("The two of you sit around for a few more minutes, then Terry sighs. <i>“We ought to get out of here before the show begins. I don’t want to see the inside of a cell again, and especially not with you beside me.”</i>", parse);
				Text.NL();
				Text.Add("You’ve to agree with that - perhaps it’d be best if you reported back to Vaughn and told him about your presence being expected at the inn. Standing, you quickly pay for your drinks and make to leave.", parse);
				Text.Flush();
				
				vaughn.flags["Met"] = Vaughn.Met.PoisoningSucceed;
				vaughn.flags["T3"] |= Vaughn.Poisoning.Success;
				
				world.TimeStep({hour: 1});
				
				if(vaughn.flags["T3"] & Vaughn.Poisoning.Aphrodisiac)
					Gui.NextPrompt(TasksScenes.Poisoning.AphrodisiacEntry);
				else
					Gui.NextPrompt(function() {
						MoveToLocation(world.loc.Rigard.Plaza);
					});
			}, enabled : true
		});
		options.push({ nameStr : "Yourself",
			tooltip : "If you want something done properly, you’ll have to do it yourself.",
			func : function() {
				Text.Clear();
				TasksScenes.Poisoning.KitchenYourself();
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		TasksScenes.Poisoning.KitchenYourself();
	}
}

TasksScenes.Poisoning.KitchenYourself = function() {
	var parse = {
		Orvin : Rigard.LB.KnowsOrvin() ? "Orvin" : "the innkeeper"
	};
	
	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
	parse["c"] = party.Num() > 1 ? Text.Parse(" ask [comp] to wait for you in the barroom, and", parse) : "";
	Text.Add("Right. No time like the present, then. With the constant stream of staff heading in and out of the kitchen’s main door, just waltzing on in probably isn’t the best of ideas. There doesn’t seem to be any other way of getting into the kitchen from the common room, so you[c] leave the Lady’s Blessing proper and nip around to the back of the building. There ought to be someplace where deliveries are made and the staff enter the inn by, at the very least… it’s too much to imagine that you’d find a pie set out on the windowsill to cool or something of the likes, but at least you might find an alternative approach here.", parse);
	Text.NL();
	Text.Add("Indeed, there’s a back door, and a pretty large one at that, clearly made to accept the large quantities of food and drink the Lady’s Blessing must receive every day. It’s locked, but the window beside it isn’t, and you push it open and climb into a back room of sorts. As your eyes adjust to the dim light, you take in the scene that lies before you: silvered trays with cutlery and dishes already laid out on them, pitchers waiting to be filled, small casks of brandy lined up against a wall. Beyond a door set into the far wall, the sounds of the kitchen at work, and it certainly <i>sounds</i> crowded enough that you’d rather not risk entering it at all if possible.", parse);
	Text.NL();
	Text.Add("It seems like [Orvin]’s had his people prepare as far ahead as possible for the event - it’s clear that once the food’s cooked, it’ll be ready to go with the minimum of fuss. They’ve even marked out the carts bearing the dishes with small placards numbering thirty-one to thirty five… these must be the suites which Heydrich’s rented for the occasion.", parse);
	Text.NL();
	Text.Add("The casks seem like the only reasonable avenue available to you, but try as you might, you can’t see a way of undoing the wax seals without giving away that they’ve been tampered with. Then it strikes you: if you can’t spike the food, then maybe the dishes will do just as well. Vaughn did mention that a few drops would be more than enough for the vial’s contents to take effect, so hopefully that’ll work.", parse);
	Text.NL();
	Text.Add("Wasting no time, you uncork the vial and begin tainting the bowls, pitchers and serving dishes slated for suite thirty-three, smearing a few drops on each one in turn.", parse);
	Text.NL();
	
	var check = (player.Dex() + player.Int()) / 2 + Math.random() * 20;
	var goal = 50;
	
	if(GetDEBUG()) {
		Text.Add("Dex+Int check: [val] vs [goal]", {val: check, goal: goal}, 'bold');
		Text.NL();
	}
	if(check >= goal) {
		Text.Add("It’s a tiring job, ensuring that everything is as unnoticeable as possible, but the liquid does dry quickly - hopefully that doesn’t reduce its efficacy any. If the cooks or waiters spot it, hopefully they’ll just mistake it for dampness or something and won’t wipe it off… or worse.", parse);
		Text.NL();
		Text.Add("It seems like forever, but you finish off the last of the vial’s contents and pop the stopper back in place. And just in time, too - you can hear voices coming to you from beyond the far wall, amidst the din of the kitchen’s activity. Even with the speakers shouting, you can’t quite make out what’s being said, but you know you don’t want to be here when they come in. Sprinting on tiptoe, you vault over the windowsill with a sudden burst of panic-fuelled energy and land in the street outside, just managing to shut the window before the door creaks open and light spills into the back room.", parse);
		Text.NL();
		Text.Add("Once you’re sure no alarm has been raised, you cautiously risk sneaking a peek into the back room. Waiters busy themselves amongst the carts, filling soup tureens from a huge pot, loading the casks onto the serving carts, pouring sweet nectar into the pitchers, and arranging chilled cut fruits on small toothpicks upon the platters.", parse);
		Text.NL();
		parse["p"] = vaughn.flags["T3"] & Vaughn.Poisoning.Poison ? "poison" : "aphrodisiac";
		parse["c"] = party.Num() > 1 ? Text.Parse("rejoin [comp] in", parse) : "re-enter";
		Text.Add("The last course’s coming up, and it promises to be a good one. Hopefully, the [p] takes - with one last glance at the waiters pushing the carts back out through the kitchen’s steamy confines, you slip back to the front entrance and [c] the inn, although you don’t intend to stay long. Best to head back to Vaughn and report your success.", parse);
		Text.Flush();
		
		party.Inv().RemoveItem(Items.Quest.OutlawPoison);
		party.Inv().RemoveItem(Items.Quest.OutlawAphrodisiac);
		
		vaughn.flags["Met"] = Vaughn.Met.PoisoningSucceed;
		vaughn.flags["T3"] |= Vaughn.Poisoning.Success;
		
		world.TimeStep({hour: 1});
		
		if(vaughn.flags["T3"] & Vaughn.Poisoning.Aphrodisiac)
			Gui.NextPrompt(TasksScenes.Poisoning.AphrodisiacEntry);
		else
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Rigard.Plaza);
			});
	}
	else {
		Text.Add("You work as fast as you can, but it clearly isn’t quick enough. About halfway through the process, numerous footsteps ring out from amidst the din and clatter of the kitchens, clearly heading for the door on the far end of the room.", parse);
		Text.NL();
		Text.Add("Your breath catches in your throat, and you quickly stuff the vial and its contents into your pocket as you make a mad dash for the window. You’ve one hand on the windowsill and are about to vault over when the click of the handle turning sounds out from behind you, followed by shouts of surprise and anger - but more the latter than the former.", parse);
		Text.NL();
		Text.Add("No time to look back - and they might see your face if you did. With one hand on the windowsill, you vault through the window and hit the street outside running. While you don’t think whoever it was behind you managed to get a good look at your back before you took off, it’s probably for the best that you don’t show your face about the Lady’s Blessing for a little bit.", parse);
		Text.NL();
		Text.Add("Thankfully, whoever it was who discovered your intrusion doesn’t seem too interested in pursuing you, and you slow your pace a little as you circle around to the inn’s front, keeping a wide berth from the actual entrance.", parse);
		if(party.Num() > 1) {
			parse["s"] = party.Num() > 2 ? "" : "s";
			Text.Add(" Presently, [comp] emerge[s] from the inn’s front and rejoins you, having figured out what the sudden hullabaloo was all about.", parse);
		}
		Text.NL();
		Text.Add("It’s not very likely that they’re going to use those dishes which you tainted, so there’s nothing you can do but head back to Vaughn and report your failure.", parse);
		Text.Flush();
		
		party.Inv().RemoveItem(Items.Quest.OutlawPoison);
		party.Inv().RemoveItem(Items.Quest.OutlawAphrodisiac);
		
		vaughn.flags["Met"] = Vaughn.Met.PoisoningFail;
		
		world.TimeStep({hour: 1});
		
		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.Plaza);
		});
	}
}

TasksScenes.Poisoning.AphrodisiacEntry = function() {
	var parse = {
		Orvin : Rigard.LB.KnowsOrvin() ? "Orvin" : "the innkeeper"
	};
	
	Text.Clear();
	Text.Add("Mission accomplished, time to leave before the fireworks - uh oh. Passing the stairway leading up to the rooms on your way out, you catch the faint sounds of laughter from suite thirty-three, and more - there’s a clear sexual undertone to it all. Yes, it’s faint, but you’re pretty sure you heard a moan there. At least all the food seems to have been served and you’re sure that the staff are taking a well-deserved break, but it probably isn’t going to be too long before [Orvin] or someone else notices what’s up?", parse);
	Text.NL();
	Text.Add("The aphrodisiac wasn’t supposed to take effect this quickly, was it? Or did you add more than you ought to have? Well, what’s done is done. You <i>should</i> leave soon, yes, but then again, there’s the temptation to take in your handiwork and see just what you’ve wrought…", parse);
	Text.Flush();
	
	//[Peek][Leave]
	var options = new Array();
	options.push({ nameStr : "Peek",
		tooltip : "Face it, you just want to know what’s going on inside.",
		func : function() {
			TasksScenes.Poisoning.AphrodisiacPeek();
		}, enabled : true
	});
	options.push({ nameStr : "Leave",
		tooltip : "You don’t want to linger here any more than necessary.",
		func : function() {
			TasksScenes.Poisoning.AphrodisiacLeave();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

TasksScenes.Poisoning.AphrodisiacLeave = function() {
	var parse = {};
	
	Text.Clear();
	Text.Add("Shaking your head, you turn your back and hurry down and out of the Lady’s Blessing. Things should be getting heated up soon, if Vaughn’s description of the aphrodisiac’s effects were accurate, and since you know for sure that the job’s taken care of, you don’t want to be here any longer than necessary. There’s nothing left for you now but to report back to Vaughn and hear what he has to say.", parse);
	Text.Flush();
	
	Gui.NextPrompt();
}

TasksScenes.Poisoning.AphrodisiacPeek = function() {
	var parse = {
		Orvin : Rigard.LB.KnowsOrvin() ? "Orvin" : "the innkeeper"
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	var p1cock = player.BiggestCock();
	
	Text.Clear();
	Text.Add("Curiosity gets the better of you, and you can’t help but crack open the suite door and take a little peek. The scene that greets your eyes isn’t quite the roof-roaring orgy yet, but it’s certainly getting more than a little steamy for the occupants of suite thirty-three, numbering about twelve to fifteen in total. While the aphrodisiac hasn’t had enough time to kick in fully, undone clothes and rumpled fabrics are the order of the day, and there’s plenty of making out going on between the various people within.", parse);
	Text.NL();
	Text.Add("Of course, some are more enthusiastic than others - in particular, a rather striking woman with the telltale red hair of the nobility lies on her back upon the suite’s plush carpeted floor, her hair making a halo about her head. There’s a huge, throbbing cock in her mouth and one in each of her hands as men in various states of undress cluster about her, eagerly awaiting their turn, and another finely-dressed lady grinds at her mound through her dress in a fit of unbridled lust.", parse);
	Text.NL();
	Text.Add("Lady Heydrich, you assume. Well, if this keeps up for as long as the aphrodisiac lasts, she’ll definitely be in no shape to turn up in court anytime soon, let alone debate. You turn your eye to the exquisite dishes arrayed out in the buffet, all in various states of consumption, and shake your head. The only regret, perhaps, is how [Orvin]’s going to take a pretty bad fall for this, what with it happening at his establishment and all.", parse);
	Text.NL();
	Text.Add("Even in this short moment, the air’s begun to heat up noticeably - more and more garments are falling discarded to the ground, while whimpers and soft moans turn to grunts and cries of passion, the rustle of addled fingers pawing desperately at fabric clear in the air. Is there more you need to get done here, or should you just get out while you can?", parse);
	Text.Flush();
	
	//[Join][69][Leave]
	var options = new Array();
	options.push({ nameStr : "Join",
		tooltip : "Why let a good orgy go to waste? Join in the fun!",
		func : function() {
			Text.Clear();
			parse["ar"] = player.Armor() ? Text.Parse("[armor] and ", parse) : "";
			Text.Add("Screw this, you could never resist a good orgy, and the fact that it’s an impromptu one comprised of the upper crust makes it all the more dangerous and appealing. Wading through the mess of fabric and bodies, skin rubbing against skin and hands grasping at your calves and thighs, you allow yourself to embrace the increasingly cloying atmosphere of sweet sex growing in the inn suite, hurriedly stripping off your [ar]clothes as you approach the epicenter of the fuck-pile - Lady Heydrich.", parse);
			Text.NL();
			Text.Add("The other merchants and traders can do themselves; you’re going straight for the prize! Without hesitation, you shove the young man currently occupying her face off; his cock emerges with an audible pop, trailing a small string of seed, and you send him on his way with a good slap on his rump. Hazy and unfocused, Heydrich’s eyes roll this way and that, perhaps wondering who you are or where that delicious cock went. What a greedy little slut, considering that she’s still got one rod of man-meat in each hand.", parse);
			Text.NL();
			if(p1cock) {
				parse["mc"] = player.NumCocks() > 1 ? "whole lot of replacements" : "replacement";
				Text.Add("Well, you’ve got a [mc] right here, so no need to worry about that. Straddling the lusty noblewoman’s chest, you prodigiously apply your elbow to make a little space for yourself and make yourself comfortable.", parse);
				Text.NL();
				if(p1cock.Len() > 25) {
					Text.Add("With how heavy your [cocks] [isAre], you need plenty of space, and waste no time in literally cock-slapping the nearby orgy-goers into clearing a path for your ponderous rod. Heydrich’s eyes widen as she takes in the impressive length and girth of your man-meat[s], but apprehension soon turns to delight as the aphrodisiac’s hold strengthens. With a renewed urgency, she gobbles up[oneof] your [cocks] without hesitation, trying to cram all she can fit into that mouth of hers and leaving barely enough space to breathe.", parse);
				}
				else {
					parse["a"] = player.NumCocks() > 1 ? "a" : "your";
					Text.Add("While your [cocks] might not be as endowed as it might have been, it doesn’t faze Heydrich any. With all of her other extremities quite occupied, all it takes is an open mouth for you to ram [a] member into it with great gusto. The addled noblewoman’s eyes widen in surprise at first, then resume their usual glazed-over look as the aphrodisiac’s hold strengthens.", parse);
				}
				Text.NL();
				parse["b"] = player.HasBalls() ? " balls slapping at her chin and" : "";
				Text.Add("Without further ado, you buck your hips forward and start pounding away in a steady, instinctive rhythm,[b] rutting away without a care in the world. Now you’re just another warm body in the midst of the glorious orgy that’s taking place here, flushed and steadily getting slick with sweat as you give in to your desires even without the need of an alchemical aid.", parse);
				if(player.NumCocks() > 1) {
					Text.NL();
					Text.Add("Your other shaft[s2] flop[notS2] and bat[notS2] this way and that, sometimes bumping against Lady Heydrich’s chin, sometimes against other warm things which identity you’re not exactly sure of. At length, you become vaguely aware of other fingers grasping for [itThem2], pumping along [itsTheir2] length with hungry, desperate strokes. It could be any number of the writhing bodies which‘ve drawn closer to the massive pile of copulation since you arrived, but hey, it’s not polite to look a gift horse in the mouth. That mouth’s much better used elsewhere, after all.", parse);
					Text.NL();
					Text.Add("Groaning, you lean back and savor the delightful sensations from being sucked and stroked at the same time, the subtle contrast only making the whole that much more pleasurable.", parse);
				}
			}
			else { //Vag
				Text.Add("While you might not have a shaft, you’ve something even better than that for Heydrich to busy her tongue with. Smirking, you blatantly shove your [vag] into the addled noblewoman’s face, letting her get a good scent of your muff. It takes a few urgent grinds before she finally gets the message and starts licking away, that dainty little tongue of hers darting in and out from between her full lips. It soon becomes clear that Heydrich’s no stranger to eating out another woman, and you briefly wonder where and how she learned as much before the first wave of pleasure hits you and you arch backwards, wrapping your fingers around someone’s - it’s hard to tell exactly whose - shoulders to keep balance.", parse);
				Text.NL();
				Text.Add("Aww. It’s so cute, the sight of her lapping at your cunt like a kitten at a saucer of milk, and the way her tongue-tip reaches for your button and runs along it sends tingles arcing down your spine, triggering a fresh flow of feminine nectar to ooze upon her face. Straightening yourself, you reach for your [breasts] and work away, fingers teasing your [nips] while Heydrich works away beneath you and the others in the room jostle against your bodies. Instinctively drawn by the heat and tension in the air that’s the result of sweet, sweet sex, it’s not long before you have a moaning, wriggling mass of limbs all about you, all sorts of things hard at work stuffing various holes.", parse);
				Text.NL();
				Text.Add("You’re vaguely aware of a few details about you - a fat, balding merchant being spit roasted by two younger men while his ass is stuffed by a particularly thick and oily sausage, a once stately lady barking like a dog as she’s mounted and reamed on all fours like one - but your attention is always drawn back to slut supreme Heydrich. The more the noblewoman gives into her lusts, the more predatory and urgent her licking becomes, the deeper her tongue thrusts - so vigorous and enthusiastic she is, that she’s moved her hands to your hips, grabbing you as an anchor while she bucks and undulates beneath you.", parse);
			}
			Text.NL();
			Text.Add("While it’d have been nice for this to see the orgy to its end, hurried words reach your ears from downstairs, followed by shouts and footsteps pounding on the staircase leading up. Seems like the inn staff’s caught onto your shenanigans - as upsetting as it is to pull out before due time, you hurriedly stand on shaky legs and do up your clothing as best as you can while dashing for the window.", parse);
			Text.NL();
			Text.Add("The plush carpet is already soaking up plenty of sexual fluids, and as you vault over the windowsill and onto the roof tiles outside, you can’t help but pity whoever’s going to have to clean this up afterwards. Shouts erupt from behind you as the door’s flung open, and there’s more than one scream at the sight of glistening, rutting orgy-goers, but you don’t dare look back for fear of risking someone getting a glimpse of your face.", parse);
			Text.NL();
			parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
			parse["c"] = party.Num() > 1 ? Text.Parse(" where [comp] rejoin you", parse) : "";
			Text.Add("Yeah… maybe staying to partake wasn’t the best of ideas, but it sure <i>felt</i> good while it lasted. Down the roof and round the back[c] - there’s no way you’re heading into the Lady’s Blessing for a while now, not while [Orvin] and his people sort out this mess and are still casting suspicious eyes on everyone and everything. Your nethers still tingling from your rudely interrupted repast, you do your best to clear your head and gather your thoughts. Since there’s nothing left for you to do here, perhaps it’d be best if you headed back to Vaughn and reported in.", parse);
			Text.Flush();
			
			vaughn.flags["T3"] |= Vaughn.Poisoning.JoinedOrgy;
			
			player.slut.IncreaseStat(100, 5);
			
			world.TimeStep({hour: 1});
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Rigard.Plaza);
			});
		}, enabled : player.FirstCock() || player.FirstVag()
	});
	if(room69.flags["Rel"] >= Room69.RelFlags.GoodTerms) {
		options.push({ nameStr : "69",
			tooltip : "Come to think of it, you know someone who might keep them occupied for a while…",
			func : function() {
				Text.Clear();
				Text.Add("An idea comes to your mind, and a very nasty grin spreads out on your face as it takes form. Yes… you may need to get out of here soon, but there’s someone else who might do a better job of keeping an eye on these fine people, and you know just who it is.", parse);
				Text.NL();
				Text.Add("Quickly, you take a glance down the corridor; now that the buffet’s been served up, the staff are taking a break, and there aren’t any other guests wandering the halls at the moment. Great, this is the opening you need. Quickly throwing open the door of suite thirty-three, you grab the closest sucker - a young man with his undershirt unbuttoned down to his navel and stiff cock hanging out of his trousers - and begin manhandling him in the direction of room 369. Glassy-eyed and in quite the sex-filled pink haze, he’s quite compliant, especially when you give his rod a few encouraging tugs to get him going. Seeing one of their number depart - and with a newcomer at that - the other members of the nascent orgy begin stumbling out after the two of you, perhaps seeking more exhilarating delights.", parse);
				Text.NL();
				Text.Add("Well, they’re going to get some soon enough. Slowly, gingerly, your fingers close upon the know of 69’s door, giving it a little stroke with your fingertips as if it were a knob of an entirely different sort.", parse);
				Text.NL();
				Text.Add("<i>“Ooh, who is it?”</i> a muffled voice calls out from behind the door. <i>“You’re certainly daring to be visiting a lady-gentleman at this hour, and with such forward behavior, too! I can’t entirely say I dislike it, though. Perhaps you should come inside and let us get to know each other a little better?”</i>", parse);
				Text.NL();
				Text.Add("Well, here goes nothing. Throwing open the door, you usher the young man into Sixtynine; the rest of the parade trailing out behind him, smelling perfume and the promise of sating their lusts, quickly follow him in. Lady Heydrich is the last one in, tottering a little from both lust and the rough dogpiling she took, but lets out a more than enthusiastic squeal as you shove her in with a slap on her pert rump. The moment everyone’s in, the door slams of its own accord, and the squeals - first of fear, then of delight - resound through the walls as the room sets to entertaining the delightful playmates you’ve sent along.", parse);
				Text.NL();
				Text.Add("It won’t be long before someone <i>does</i> come up to investigate, though. Much as you’d like to stay and savor the fruits of your hard work, you don’t want to be here when inconvenient questions are asked. Ignoring the cries of ecstasy ringing through the walls, you slip out of the Lady’s Blessing and are out the door. Time to head back to Vaughn and get his debrief, then.", parse);
				Text.Flush();
				
				player.subDom.IncreaseStat(100, 2);
				vaughn.flags["T3"] |= Vaughn.Poisoning.Used69;
				world.TimeStep({hour: 1});
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Plaza);
				});
			}, enabled : true
		});
	}
	options.push({ nameStr : "Leave",
		tooltip : "All right, you know the the job is done. Get out!",
		func : function() {
			TasksScenes.Poisoning.AphrodisiacLeave();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

TasksScenes.Poisoning.OutOfTime = function() {
	return TasksScenes.Poisoning.OnTask() && vaughn.taskTimer.Expired();
}

TasksScenes.Poisoning.DebriefSuccess = function() {
	var parse = {
		Orvin : Rigard.LB.KnowsOrvin() ? "Orvin" : "the innkeeper",
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>“Ah, you’re back,”</i> Vaughn says as he notices you approach. The fox-morph is taking a small break with a couple of his men, passing a small hip flask amongst the three of them; he dismisses his men and takes a final swig from the flask before pocketing it and turning to you. <i>“How was it? I was quite worried.”</i>", parse);
	Text.NL();
	Text.Add("You managed to get it done, yes, and pass the now-empty vial to Vaughn. But worried? You’re flattered, but why was it that he was worried about you?", parse);
	Text.NL();
	Text.Add("<i>“Well, you notice anything out of shape while you were there? People extra vigilant, on the edge, that sort of thing?”</i>", parse);
	Text.NL();
	Text.Add("Hmm, not really. The waiters did seem rather harried, as did [Orvin] himself, but that was only to be expected with all the catering they had to do. Was there supposed to be something amiss?”</i>", parse);
	Text.NL();
	Text.Add("Vaughn shakes his head. <i>“I’ve had word from our eyes and ears that the staff were told to expect someone to try and mess with the food. That they were to be right by their food carts at all times, that no one was allowed to be in the kitchens, and that sort of good stuff. Someone told them we were coming, [playername], and I don’t like that one bit.”</i>", parse);
	Text.NL();
	Text.Add("That… yes, it would explain why the waiters wouldn’t stop for anyone, but he’s sure?", parse);
	Text.NL();
	Text.Add("<i>“Positive. I don’t like the thought any more than you do, but even the boss-man agrees that there’s got to be a traitor somewhere in our camp.”</i> Vaughn rubs his face. <i>“I suppose it had to happen sooner or later, with some of the shadier folks who nevertheless manage to get in here, but…”</i>", parse);
	Text.NL();
	Text.Add("The fox-morph falls silent, and the two of you stare at each other for a few moments until he collects himself once more. <i>“You just ought to keep this in mind. Get your stuff done, and we’ll handle the mole in our midst. In the meantime, we should probably get back to the problem at hand.”</i>", parse);
	Text.NL();
	if(vaughn.flags["T3"] & Vaughn.Poisoning.Poison) {
		Text.Add("Well, you got the poison into the food. You didn’t stop to check if the stuff had actually been eaten, though, and by the Lady herself…", parse);
		Text.NL();
		Text.Add("<i>“You did what you could,”</i> Vaughn says with a sigh. <i>“It’s the best we can hope for - if everyone around Heydrich but her comes down with the squealing shits, then it’s just our bad luck. You can’t win them all, as Maria says.”</i>", parse);
		Text.NL();
		Text.Add("Right. So, what now?", parse);
		Text.NL();
		Text.Add("<i>“What happens now is that you take a good breather and rest up for the inevitable next task the boss-man’s going to hand down sooner or later. Or heck, I might even take up some initiative like he’s been pushing us to do and ask you of my own accord.</i>", parse);
		Text.NL();
		Text.Add("<i>“Seriously, though. Just take a break, do whatever you do when you’re not with us; I’m sure that you’ve got plenty to be done. You’ll be busy again soon enough.”</i>", parse);
	}
	else { // (Success via aphrodisiac)
		Text.Add("Right. About that - when you left the party, the orgy was still going on in full force, and you doubt that anything less than the direct intervention of a great spirit would bring it to a halt. Well, maybe not that much, but he knows what you mean.", parse);
		Text.NL();
		Text.Add("<i>“Hah,”</i> Vaughn replies, a corner of his mouth curling upwards in utter contempt. <i>“I can imagine, all right. Bird-brains there assured me that a reasonable dose’ll last all day, and won’t wear off even after a nap. Worst thing that could happen is that someone finds the orgy and forcibly breaks it up, but it’s not as if Heydrich will be in any shape to attend court for quite some time.”</i>", parse);
		Text.NL();
		Text.Add("Great! So… mission accomplished, then?", parse);
		Text.NL();
		Text.Add("<i>“That would be it, yes. Go and get some rest, take a breather, do whatever you do when you’re not with us. The boss-man has plenty of ideas in that head of his, and I’m sure it won’t be too long before he thinks another one of them’s good enough to put into action. Or perhaps I might even take initiative like the boss-man’s always pushing us to do and ask something of you myself.</i>", parse);
		Text.NL();
		Text.Add("<i>“That’s it for now, [playername]. Good work. Wish I could’ve been there to see it for myself, those nobs rutting up and down like a bunch of beasts, but them’s the breaks.”</i>", parse);
	}
	Text.NL();
	Text.Add("If he says so, then. You half-turn to go, but Vaughn gently catches you by the shoulder and clears his throat. <i>“Ahem. There’s still something I have to give you for your time.”</i>", parse);
	Text.NL();
	Text.Add("Why, a reward?", parse);
	Text.NL();
	Text.Add("Vaughn nods. <i>“You stuck your neck out for us, so I think it’s fitting. Let me go in and get it.”</i>", parse);
	Text.NL();
	Text.Add("Without another word, Vaughn spins on his heel and enters the watchtower, reappearing shortly with a case in his hands. <i>“Here, for you. Came in from upriver. Meant for the boss-man, but he doesn’t hold truck with such things. Maybe you’ll make better use out of it.”</i>", parse);
	Text.NL();
	Text.Add("What’s inside, though?", parse);
	Text.NL();
	Text.Add("A wink and tip of Vaughn’s hat. <i>“Open it up in a bit and find out, that’s all I’ll say. All right, then - if there’s nothing else, I’ve got to get back on duty. Have a good one, [playername].”</i>", parse);
	Text.NL();
	Text.Add("You unwrap the package. It contains a razor sharp but very fragile looking glass sword.", parse, 'bold');
	Text.Flush();
	
	world.TimeStep({hour: 1});
	
	vaughn.flags["Met"] = Vaughn.Met.CompletedPoisoning;
	
	outlaws.relation.IncreaseStat(100, 3);
	
	party.Inv().AddItem(Items.Combat.GlassSword);
	
	Gui.NextPrompt();
}

TasksScenes.Poisoning.DebriefFailure = function() {
	var parse = {
		Orvin : Rigard.LB.KnowsOrvin() ? "Orvin" : "the innkeeper",
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>“You’re back,”</i> Vaughn says as he notices you approach. The fox-morph is sharing a small break with a couple of his men, passing a hip flask between the three of them, and he dismisses them with a wave of a hand-paw as you draw close. <i>“I was worried you wouldn’t turn up - our eyes and ears reported of quite the commotion at the Lady’s Blessing a little while ago.”</i>", parse);
	Text.NL();
	Text.Add("Yes, yes. Didn’t take him too long to put two and two together, did he?", parse);
	Text.NL();
	Text.Add("Vaughn shakes his head and spits on the ground. <i>“Nope, and neither was the news of the good kind. After you set off, I got word that Orvin and his people down at the Lady’s Blessing were particularly on edge. Somehow, someone managed to get across the message that someone would be trying to mess with the catering for Heydrich’s little party, and that they ought to be extra careful.</i>", parse);
	Text.NL();
	Text.Add("<i>“You look like shit. Tell me what kind of trouble you ran into.”</i>", parse);
	Text.NL();
	Text.Add("Hey, you didn’t think you looked <i>that</i> bedraggled. Still, you do your best to adjust your clothing while you recount to Vaughn what happened in the back room of Lady’s Blessing. The ex-soldier listens intently, his ears twitching under his hat, then eyes you.", parse);
	Text.NL();
	Text.Add("<i>“Hah. They made sure that no one could get at the food proper, but failed to consider someone might try to mess with the glassware instead. Linear thinking, as the boss-man would say. Still, seems like they realized their mistake halfway through.”</i>", parse);
	Text.NL();
	Text.Add("Come to think of it, you can’t help but feel a little bad for [Orvin]. He was just trying to preserve the good name of his inn, that’s all.", parse);
	Text.NL();
	Text.Add("Vaughn looks at you askance. <i>“I’m not going to lie, [playername]. Most peoples’ lives aren’t sticking closely to the straight and narrow already… but what we do is even less peachy keen than that. Orvin’s got a good business going, he’s got a reputation and history, and he’ll recover in time. This isn’t so bad. Who knows what’ll come down the line, though?</i>", parse);
	Text.NL();
	Text.Add("<i>“I’ve had to make choices which I’m not exactly proud of, but were necessary back then. You gotta keep that in mind and know what you can do and sleep at night.”</i>", parse);
	Text.NL();
	Text.Add("All right, you will.", parse);
	Text.NL();
	Text.Add("<i>“Good. If I were you, I’d get some rest. From your tale, you’ve had quite the close shave, and it’s only due to the spirits’ providence that you weren’t recognized.”</i> He claps you on the shoulder. <i>“Watch your back from here on out; there’s a snitch in our midst and it may take some time to root the bastard out just yet. Get a move along, soldier. There’ll be work to be done soon enough, so hold your horses.”</i>", parse);
	Text.Flush();
	
	world.TimeStep({hour: 1});
	
	vaughn.flags["Met"] = Vaughn.Met.CompletedPoisoning;
	
	Gui.NextPrompt();
}

TasksScenes.Poisoning.DebriefOutOfTime = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("<i>“You’re back,”</i> Vaughn states dryly as you draw close. <i>“Finally decided to show your face, or did you forget the meaning of the word ‘punctual’? No, I don’t want to hear your excuses. Or did you know to stay away from the Lady’s Blessing?”</i>", parse);
	Text.NL();
	Text.Add("What? What’s that about staying away from the Lady’s Blessing?", parse);
	Text.NL();
	Text.Add("<i>“Oh, so you were just being tardy. I get it, I get it. And here I was, thinking that you might’ve been a no-show because you know it somehow got leaked that someone was going to try and mess with the food that evening. At least that would’ve been understandable; I would’ve come back and said ‘hey, something unexpected happened, maybe we should call it off’. Well, guess I was wrong.</i>", parse);
	Text.NL();
	Text.Add("<i>“Give me back the vial. Not as if you’re going to be using it anyway. Guess there’s a small ray of light in all of this - at least you aren’t the bloody traitor. I think.”</i>", parse);
	Text.NL();
	Text.Add("Wordlessly, you hand over the vial to Vaughn, who storms away. Best not to talk to him again for a little while, or at least until he’s stopped fuming…", parse);
	Text.Flush();
	
	party.Inv().RemoveItem(Items.Quest.OutlawPoison);
	party.Inv().RemoveItem(Items.Quest.OutlawAphrodisiac);
	
	outlaws.relation.DecreaseStat(0, 5);
	
	vaughn.flags["Met"] = Vaughn.Met.CompletedPoisoning;
	
	world.TimeStep({hour: 1});
	
	Gui.NextPrompt();
}

export { TasksScenes };
