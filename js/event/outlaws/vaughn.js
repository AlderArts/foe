/*
 * 
 * Define Vaughn
 * 
 */
import { Scenes } from '../../event';
import { Entity } from '../../entity';

function Vaughn(storage) {
	Entity.call(this);
	this.ID = "vaughn";

	// Character stats
	this.name = "Vaughn";
	
	this.body.DefMale();
	this.SetSkinColor(Color.brown);
	this.SetHairColor(Color.brown);
	this.SetEyeColor(Color.brown);
	
	this.body.SetRace(Race.Fox);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"]  = 0;
	this.flags["Talk"] = 0; //Bitmask
	this.flags["TWar"] = 0;
	this.flags["Sex"]  = 0;
	
	this.flags["T3"] = 0; //Bitmask
	
	this.taskTimer = new Time();
	
	if(storage) this.FromStorage(storage);
}
Vaughn.prototype = new Entity();
Vaughn.prototype.constructor = Vaughn;

Vaughn.Met = {
	NotAvailable : 0,
	Met : 1,
	//Task 1
	OnTaskLockpicks : 2,
	LockpicksElodie : 3,
	CompletedLockpicks : 4,
	//Task 2
	OnTaskSnitch : 5,
	SnitchMirandaSuccess : 6,
	SnitchWatchhousFail : 7,
	SnitchWatchhousSuccess : 8,
	CompletedSnitch : 10,
	//Task 3
	OnTaskPoisoning : 11,
	PoisoningFail : 12,
	PoisoningSucceed : 13,
	CompletedPoisoning : 14
	//TODO: tasks
};
Vaughn.Talk = { //Bitmask
	Himself : 1,
	Past    : 2,
	Fiancee : 4,
	Sex     : 8,
	Confront : 16,
	ConfrontFollowup : 32
};
Vaughn.TalkWar = {
	Beginnings : 1,
	Wartime    : 2,
	Desertion  : 3,
	Afterwards : 4
};
Vaughn.Sex = {
	Titfuck : 1
};

Vaughn.prototype.Met = function() {
	return this.flags["Met"] >= Vaughn.Met.Met;
}

Scenes.Vaughn = {};

Vaughn.prototype.FromStorage = function(storage) {
	// Load flags
	this.LoadFlags(storage);
	
	this.taskTimer.FromStorage(storage.Ttime);
}

Vaughn.prototype.ToStorage = function() {
	var storage = {
	};
	
	this.SaveFlags(storage);
	
	storage.Ttime = this.taskTimer.ToStorage();
	
	return storage;
}


Vaughn.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
	if(Scenes.Vaughn.Tasks.OnTask())
		this.taskTimer.Dec(step);
}

// Schedule
Vaughn.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Outlaws.Camp)
		return (world.time.hour >= 18 || world.time.hour < 6);
	return false;
}

//Trigger after having completed either outlaws into Rigard
// TODO OR after Belindaquest has been done (in the case the PC ignores the outlaws all the way up till then).
//Also requires that player have access to castle grounds.
Vaughn.prototype.IntroAvailable = function() {
	if(this.Met()) return false;
	if(!outlaws.CompletedPathIntoRigard()) return false;
	if(!rigard.RoyalAccess()) return false;
	return true;
}

Scenes.Vaughn.Introduction = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("Ah, the outlaws’. How long ago was it that you were first frogmarched into this place by Maria? It seems like just yesterday, and yet the gate sentries on duty recognize you well enough to let down the drawbridge without being asked. One of them even gives you a cautious wave, which is frankly more than you expected.", parse);
	Text.NL();
	Text.Add("Well, at least it proves that you’re becoming more of a familiar face around these parts. Marching across the drawbridge and letting the sentries pull it in after you, you sweep past the gates and are about to head in proper when you’re stopped by someone calling your name.", parse);
	Text.NL();
	Text.Add("Oh. It’s Vaughn, taking the stairs two at a time as he bounds down from the gate watchtower. Is there something you can do for him?", parse);
	Text.NL();
	Text.Add("<i>“Yes,”</i> the fox-morph replies matter-of-factly. <i>“Just heard from High Command that you’ve been cleared.”</i>", parse);
	Text.NL();
	Text.Add("The congratulations are much appreciated, yes.", parse);
	Text.NL();
	Text.Add("<i>“Right. Zenith’s quite busy these days, what with the spike in our operations, and Maria’s out a good portion of the time, so it seems like I’ve been assigned to your case. Long story short, [playername], we could always use an extra operative who can travel freely, especially into Rigard. That, and our people in the city are already becoming a little too well-known for our liking. Suspicion is sort of like jam - the thinner you spread it, the less likely you’re going to end up with sticky fingers.</i>", parse);
	Text.NL();
	Text.Add("<i>“Anyway.”</i> He clears his throat. <i>“My point is that every so often, there might be something for you that Zenith’s asked me to pass along, so do drop by and check in with me every now and then. Make sure that you’ve got the time to spare if you do ask about taking on jobs - some of the things we need our operatives to handle can be quite urgent, and if you don’t accept, I’ll have to pass it along to someone else who will. Did you get all that?”</i>", parse);
	Text.NL();
	Text.Add("Yeah. Check in with him with regards to jobs if you’re free at the moment. Sounds simple enough.", parse);
	Text.NL();
	Text.Add("Vaughn scratches his head. <i>“It may sound simple, but trust me, too many people these days think they can take their time going about things. Why, one would imagine that those idiots believe that nothing important’s going to happen unless they make it so! In any case, I’ve said what I came to say, so thanks for hearing me out. Don’t be a stranger now, okay?”</i>", parse);
	Text.NL();
	Text.Add("Yeah, you won’t. Giving Vaughn a wave and receiving a tip of his hat in return, you head off into the camp proper.", parse);
	Text.Flush();
	
	vaughn.flags["Met"] = Vaughn.Met.Met;
	
	world.TimeStep({minute: 30});
	
	Gui.NextPrompt();
}

Scenes.Vaughn.CampDesc = function() {
	var parse = {};
	
	Text.Add("Vaughn should be on watch around this time, if you wish to seek out the fox.", parse);
	Text.NL();
}

Scenes.Vaughn.CampApproach = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	// Trigger the one-shot confront scene
	if(vaughn.flags["Talk"] & Vaughn.Talk.Confront && !vaughn.Confronted()) {
		Scenes.Vaughn.ConfrontFollowup();
		return;
	}
	else if(vaughn.flags["Met"] == Vaughn.Met.LockpicksElodie) {
		Scenes.Vaughn.Tasks.Lockpicks.Debrief();
		return;
	}
	else if(Scenes.Vaughn.Tasks.Snitch.DebriefAvailable()) {
		Scenes.Vaughn.Tasks.Snitch.Debrief();
		return;
	}
	else if(Scenes.Vaughn.Tasks.Snitch.OutOfTime()) {
		Scenes.Vaughn.Tasks.Snitch.DebriefOutOfTime();
		return;
	}
	else if(vaughn.flags["Met"] == Vaughn.Met.PoisoningSucceed) {
		Scenes.Vaughn.Tasks.Poisoning.DebriefSuccess();
		return;
	}
	else if(vaughn.flags["Met"] == Vaughn.Met.PoisoningFail) {
		Scenes.Vaughn.Tasks.Poisoning.DebriefFailure();
		return;
	}
	else if(Scenes.Vaughn.Tasks.Poisoning.OutOfTime()) {
		Scenes.Vaughn.Tasks.Poisoning.DebriefOutOfTime();
		return;
	}
	//TODO: Need to account for correctly completed tasks
	else if(Scenes.Vaughn.Tasks.OnTask()) {
		//#else (player is currently on a task that hasn’t been resolved, either through success or failure)
		Text.Add("You consider approaching Vaughn at the moment, but he did quite explicitly say not to bother him on duty until you’ve something to report. Thinking better of it, you turn and pace away - maybe you should just get the job done already, if you need to speak to him that badly.", parse);
		Text.Flush();
		Gui.NextPrompt();
		return;
	}
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("Vaughn turns his head up to look at you, then pulls the cigarette he’s smoking out of his muzzle and stomps it out on the ground. <i>“Evening, [playername]. There something I can do for you, or did you just drop by?”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("As you approach the gates, you spy Vaughn quite animatedly speaking to a couple of the sentries. He dismisses them with a wave of a hand, then turns to you and tips his hat in your direction.", parse);
		Text.NL();
		Text.Add("<i>“Don’t mind them,”</i> he says. <i>“Just a bit of a disciplinary issue, really. Now, is there a reason you’re looking for me this evening?”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("You find Vaughn in the watchtower’s nest, staring out into the thick darkness of the forest beyond, his features cast in flickering torchlight. The faraway look in the fox-morph’s eyes vanishes as you emerge into the nest through the hatch in the floor, and he helps you up the last few rungs before giving you a nod.", parse);
		Text.NL();
		Text.Add("<i>“It’s quiet out there, [playername]. Too quiet… except for the times when you hear strange noises out from amongst the trees, and start wondering. Well, what can I do for you this evening?”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("As you approach, you find Vaughn fanning himself with his hat, although the fox-morph stops and clears his throat as he notices you drawing close.", parse);
		Text.NL();
		Text.Add("<i>“Bit of weather we’ve been having of late,”</i> he mumbles.", parse);
		Text.NL();
		if(world.time.season == Season.Winter) {
			Text.Add("Seriously? He <i>does</i> know it’s the middle of winter, doesn’t he?", parse);
			Text.NL();
			Text.Add("<i>“Yes,”</i> Vaughn replies in all seriousness.", parse);
			Text.NL();
		}
		Text.Add("Well, fine, you suppose.", parse);
		Text.NL();
		Text.Add("<i>“Well. Did you need me for something? Most people don’t come up to me to make small talk, you know.”</i>", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.Flush();
	
	Scenes.Vaughn.Prompt();
}

Scenes.Vaughn.Prompt = function() {
	var parse = {
		playername : player.name
	};
	
	//[Appearance][Tasks]
	var options = new Array();
	options.push({ nameStr : "Appearance",
		tooltip : "Give the fox a once-over.",
		func : function() {
			Text.Clear();
			parse["w"] = world.time.season == Season.Winter ? ", and he’s let his winter coat grow out a bit to better ward off the cold" : "";
			Text.Add("Standing at about five foot seven, Vaughn is a fox-morph of middling stature and disposition. His russet coat of fur has seen better days, what with the whole war thing and all[w]. Had life been kinder to him - and if he could be bothered to care for it, of course - Vaughn might have had a sleek and glorious coat of fur, but as it is, he’s a lost cause. Not <i>dirty</i>, of course, just coarse and rough.", parse);
			Text.NL();
			Text.Add("His clothes are simple and utilitarian - a short, sleeveless vest, followed by a cotton undershirt and leggings cut from coarse fabric. Since he’s on the clock at the moment, the above has been supplemented with various odds and ends of protective gear: scraps of ringmail and leather, and of course, a pair of padded, open-fingered gloves over his hands and sturdy boots on his feet, covering the natural “socks” of deep black fur that cap his limbs.", parse);
			Text.NL();
			Text.Add("The only truly distinguishing pieces of clothing on him might be the flat, broad-brimmed felt hat perched on his head to keep the sun off and his ears against his head, as well as the plain white neckerchief that sits on his collarbone. You get the feeling that those have a bit of history attached to them, and perhaps you should ask about them when he’s in a chatty mood. Crinkled brown eyes stare out from beneath the brim of his hat, and they follow you inquisitively as you continue taking him in.", parse);
			Text.NL();
			Text.Add("<i>“Eh, I’m nothing fit to look at,”</i> Vaughn says with a sigh, rubbing his muzzle and the rough, silvery patches of fur that he’s been trying to cultivate as stubble of sorts. <i>“Gone hungry one too many times in my life, broken a few too many bones that never set completely right, too many scrapes. The years in between me being branded as a deserter and ending up here… well, they were hard, to say the least. No one wants to hire a deserter, even if it happened years ago. Don’t blame them.”</i>", parse);
			Text.NL();
			Text.Add("You dismiss his concerns with a wave and continue studying him. Vaughn’s body is slightly toned, as should be expected of anyone accustomed to physical labor, but he’s anything but buff. Actually, it’s more the kind of muscle that one might expect from someone who would ordinarily be lithe and lanky, built from overuse and slight underfeeding.", parse);
			Text.NL();
			Text.Add("All in all, Vaughn is quite the kind of fellow you wouldn’t take an extra gander at if you met him on the street, and would be hard-pressed to describe later if asked to. Mild and placid to the point of being occasionally being soft-spoken, one can never be entirely sure if he’s just at peace with the world at large, or if he’s just saving up to be extremely nasty when the situation calls for such.", parse);
			Text.NL();
			Text.Add("<i>“All right, really now,”</i> he snaps, breaking the silence. <i>“You and I, we’ve got better things to do than staring at each other all night, so if you don’t mind, I’d like to not waste my time here. Was there something you needed, [playername]?”</i>", parse);
			Text.Flush();
		}, enabled : true
	});
	options.push({ nameStr : "Talk",
		tooltip : "Chat up the grizzled veteran.",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Doesn’t seem like much’s happening at the moment. I suppose I’ll take a small smoke break… I know I’m on the clock, but it can’t hurt to be a little flexible on a quiet night.”</i> With that, Vaughn pulls a cigarette and box of matches out of his vest. After some fumbling, he eventually gets his smoke lit and sticks it in his muzzle, stamping out the match stub under his boot. <i>“Right. You wanted to talk?”</i>", parse);
			Text.Flush();
			
			Scenes.Vaughn.TalkPrompt();
		}, enabled : true
	});
	options.push({ nameStr : "Tasks",
		tooltip : "Ask him if he has any work for you.",
		func : Scenes.Vaughn.Tasks.TaskPrompt, enabled : true
	});
	options.push({ nameStr : "Sex",
		tooltip : "Proposition Vaughn for sex.",
		func : Scenes.Vaughn.Sex, enabled : true
	});
	/* TODO
	options.push({ nameStr : "name",
		tooltip : "",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
			Text.Flush();
		}, enabled : true
	});
	*/
	Gui.SetButtonsFromList(options, true);
}

Scenes.Vaughn.TalkPrompt = function() {
	var parse = {
		playername : player.name
	};
	
	//[Himself][War][Engineer][Back]
	var options = new Array();
	options.push({ nameStr : "Himself",
		tooltip : "Ask Vaughn about himself.",
		func : function() {
			Text.Clear();
			
			var first = !(vaughn.flags["Talk"] & Vaughn.Talk.Himself);
			vaughn.flags["Talk"] |= Vaughn.Talk.Himself;
			
			if(first)
				Text.Add("<i>“Me? You want to talk about little old me? Well, that so happens to be my favorite subject.”</i> Vaughn pauses for a second to let his words sink in, then lets out a short, yipping laugh. <i>“No one’s asked about me for a long, long while. Last time that happened, I was being trundled into the camp, although in a much friendlier manner than you were, and Zenith was asking me why I wanted to be here. Go on, ask to your heart’s content. I won’t mind.”</i>", parse);
			else
				Text.Add("<i>“You want to hear about me again? Was it really that interesting the first time? Well, I don’t mind talking about me. I love talking about me. So go ahead, ask away. Again.”</i>", parse);
			Text.Flush();
			
			Scenes.Vaughn.TalkHimself();
		}, enabled : true
	});
	options.push({ nameStr : "War",
		tooltip : "Ask Vaughn about the civil war.",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Hmph. I can tell you a bit about it.”</i> Vaughn says. <i>“No one has the entirety of the picture, of course, but all of us hold our own bits and pieces, and with enough effort you can start putting together a story that makes sense. To be honest? I’m kinda flattered that you’d ask me.”</i>", parse);
			Text.NL();
			Text.Add("Well, if it makes him feel better. So, what can he tell you?", parse);
			Text.NL();
			Text.Add("<i>“Go ahead and ask. It’s not as if I’ve got a story all prepared just in case someone asks for it, you know. Those days… they were all one jumbled mess, with things happening one after another. Doesn’t help that most folks who lived through those times don’t want to think back to them…”</i>", parse);
			Text.Flush();
			
			Scenes.Vaughn.TalkWar();
		}, enabled : true
	});
	options.push({ nameStr : "Engineer",
		tooltip : "So, as an engineer, what does he do around here?",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Like I told you before, I’m responsible for the gate and walls, and their upkeep. Those stakes there in the pit - tarring and treating them makes them as hard as stone, but even stone doesn’t stay sharp forever, especially in this forest. The mobile bridges you come in on - those actually came from the army’s own designs, given a few modifications by me, of course. Ten years and some change, and I think I’ve done the camp some good; while there aren’t too many willing to learn, I’ve found a couple of lads with the right head for the numbers involved and having more hands about is always great.</i>", parse);
			Text.NL();
			Text.Add("<i>“There’re other things, of course. The bridges that folks use to cross the river, the map building… for things like a chair or table leg breaking, I send out the lads to get it done, they need the experience. Sawing wood, sanding planks.”</i>", parse);
			Text.NL();
			Text.Add("He sure picked up a lot from his time in the army, didn’t he?", parse);
			Text.NL();
			Text.Add("<i>“Aw, shucks - but yeah, it’s the truth. There’s nothing much else we could do - since we were press-ganged into service, they obviously weren’t about to give us any liberties for fear that we’d book it at the first chance. When the others went out to Rigard to get drinks and maybe a little horizontal action, the ten of us were just cooped inside with the old diagrams and books, reading to pass the time until lights out. It’s not that hard, really. Once you get the basics down right, you can come up with your own designs lickety-split and while it may not be perfect, at least it won’t come crashing down at the slightest bit of tension.</i>", parse);
			Text.NL();
			Text.Add("<i>“There’re other things I still remember, of course. Even after all this years, I could probably mix up a batch of alchemical fire… of course, I’ve no way of getting my hands on the components. Such a pity.”</i> Vaughn sighs and rubs his chin. <i>“After those years spent wandering, [playername], this isn’t so bad a life. Wake up in mid-afternoon, do the routine inspections before the sun sets, make necessary repairs, then settle in at the gates as dusk arrives. Watch the darkness, then go to Raine’s when dawn arrives and head to bed with breakfast in my belly.</i>", parse);
			Text.NL();
			Text.Add("<i>“I dunno. I just feel useful - not just to some folk whom I might never see again, but to the people around me, y’know? The boss-man gave me a chance at a fresh start, something I’d been trying to find for years, and it wouldn’t do if I weren’t appropriately grateful and made myself useful around these parts.”</i>", parse);
			Text.NL();
			Text.Add("You nod, and tell Vaughn he certainly looks like he’s settled down.", parse);
			Text.NL();
			Text.Add("<i>“Not completely,”</i> the fox-morph replies with a small sigh, <i>“but at least I’m not doomed to wander the plains any more. C’mon, [playername]. Anything else you want to ask before our little smoke break is up?”</i>", parse);
			Text.Flush();
			
			world.TimeStep({minute: 10});
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("Vaughn looks askance at you, then tosses his cigarette onto the ground and stamps it out underfoot. <i>“Right. Break time’s over, then - while I’m still here, you got anything else you’d like to discuss with me?”</i>", parse);
		Text.Flush();
		
		Scenes.Vaughn.Prompt();
	});
}

Scenes.Vaughn.TalkHimself = function() {
	var parse = {
		playername : player.name
	};
	
	//[Past][Arrival][Watch][Fiancee][Back]
	var options = new Array();
	options.push({ nameStr : "Past",
		tooltip : "So, where’d he come from, who is he, and where is he going?",
		func : function() {
			Text.Clear();
			Text.Add("<i>“I thought I told you that already.”</i>", parse);
			Text.NL();
			Text.Add("Not about his time in the war, although you might ask about that later, too. His personal life.", parse);
			Text.NL();
			Text.Add("Vaughn snorts and coughs out a small plume of smoke. <i>“You taking a fancy to me, or what?”</i>", parse);
			Text.NL();
			Text.Add("No, you’re just trying to get on better terms with everyone in camp. It seems like a good idea, if you’re going to be spending any length of time about these parts.", parse);
			Text.NL();
			Text.Add("<i>“All right, that’s reas’nable…”</i> The fox-morph mutters something under his breath that you don’t quite catch, then launches into his tale. <i>“Don’t have much to tell you, to be honest. Third out of seven kids, little farmstead near Orsineau - folk like my line pop out plenty of sprogs, could always use the hands around the house. In my case, the hands were used for hammering and holding, and when I got old enough to start eating a little too much, my folks decided that it was time for me to make my own way in the world. Uncle knew a shipwright, you see, and so they sent me to Rigard to be a carpenter’s apprentice. Was maybe nine or ten back then. Uncle took me to the big city in his wagon, dropped me off with my things at the shipwright’s, and that was the last I saw of my folks for a long time.</i>", parse);
			Text.NL();
			Text.Add("<i>“I shan’t bother you with the next few years, save that there was a lot of tarring, caulking, sawing, sanding and measuring. Don’t remember when it happened, but someone must’ve noticed that I was pretty good at the latter, for next thing I know, I’m being asked to join the carpenter when he’s discussing things with the shipwright… not that I minded, of course. Those were great evenings, and all I had to do was sit down and listen about how much load different timbers in various structures would bear, how much tar they’d soak up, the perfect lengths, quality versus cost versus time…”</i>", parse);
			Text.NL();
			Text.Add("You thought he said he wouldn’t bother you? Vaughn soundly ignores you, caught up in the trance of someone given the opportunity to speak of what he loves best.", parse);
			Text.NL();
			Text.Add("<i>“I was so excited to finally be able to read a blueprint, to understand what all those lines and numbers meant. Pulleys and ropes, axles and winches, how to create seemingly barebones structures that would stand against immense forces. It might not have been a nob’s life, but at least I was kinda happy. Then the civil war happened.”</i>", parse);
			Text.NL();
			Text.Add("Then the civil war happened, yes.", parse);
			Text.NL();
			Text.Add("Vaughn removes the stub of his cigarette from his muzzle and flicks it to the ground, where he stamps it out before lighting another. <i>“Ee-yup. Then it happened. My fiancee, poor thing that she was, I never saw her again.”</i>", parse);
			Text.NL();
			Text.Add("The two of you stare at each other in silence until it’s clear that he’s not going to say any more. Well, what now?", parse);
			Text.Flush();
			
			world.TimeStep({minute: 10});
			
			vaughn.flags["Talk"] |= Vaughn.Talk.Past;
			
			Scenes.Vaughn.TalkHimself();
		}, enabled : true
	});
	options.push({ nameStr : "Arrival",
		tooltip : "Did he have to look so menacing when you first came in?",
		func : function() {
			Text.Clear();
			Text.Add("<i>“It’s kinda expected. I’m responsible for the gate. You were brought in as Maria’s prisoner. It was my duty to give you an appropriate welcome, and while it may have been unwarranted - now that I know your circumstances - I’m not going to apologize for it.”</i> He folds his arms and broadens his stance just a little. <i>“As far as I’m concerned, you were just a prisoner, and that’s the end of the discussion.”</i>", parse);
			Text.NL();
			Text.Add("So, it’s official policy to be mean and nasty to those whom the outlaws take in?", parse);
			Text.NL();
			Text.Add("<i>“What did you expect? They’re <b>prisoners</b>. It’s not like we take very many, anyway. Zenith doesn’t do the whole ransom thing, and we’ve enough mouths to feed without taking on one which doesn’t do any work for the nosh we put into it. What’re you getting at, anyway? I’ve already said you’re not going to be wrangling an apology out of me, and I intend to stick to my words.”</i>", parse);
			Text.NL();
			Text.Add("Fine, fine. There’s not much point in discussing it with him if he’s going to get all defensive about it anyway. Perhaps you could find another topic to discuss… ", parse);
			Text.Flush();
			
			world.TimeStep({minute: 10});
			
			Scenes.Vaughn.TalkHimself();
		}, enabled : true
	});
	options.push({ nameStr : "Watch",
		tooltip : "How’s his shift on the gates coming along?",
		func : function() {
			Text.Clear();
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Vaughn grimaces and shakes his head. <i>“Bad.”</i>", parse);
				Text.NL();
				Text.Add("What’s that supposed to mean?", parse);
				Text.NL();
				Text.Add("<i>“Bad. I mean, like bad, bad. I-can-feel-it-in-my-water bad. I’ve been looking after the gates in some fashion for more than a handful of years now, and it’s only of late that I’ve gotten these bad feelings when I look into the darkness beyond the walls and moat.”</i>", parse);
				Text.NL();
				Text.Add("Well, the forest <i>is</i> quite thick, and the shadows do play on the imagination…", parse);
				Text.NL();
				Text.Add("<i>“No, you don’t get it. That’s just scary. This is bad. And worst thing is, I don’t have any evidence that’s worth a spit, which means my head and gut are at odds with each other, and <b>that</b> makes it even worse. Trust me, I can tell the difference; I’ve been into the deep forest, the lands under the shade of the Great tree, and even then that was just unsettling. Not bad.”</i>", parse);
				Text.NL();
				Text.Add("Well, maybe it’s just a feeling.", parse);
				Text.NL();
				Text.Add("<i>“I damn well hope so.”</i> Fumbling with his matchbook, Vaughn finally gets another cigarette lit and stuffs it in his mouth without further hesitation. <i>“I damn well hope so.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Usually quiet, but it never hurts to stay sharp. Every now and then, some kingdom road patrol gets the bright idea of beating around the trees a little, tromping through the undergrowth trying to find us. Make the big break, find the evil rebels hiding out in the forest, bring home honor and glory. Needless to say, they never do. Closest they ever came was finding the remains of one of our forward camps, but we’d long taken it down and moved on.</i>", parse);
				Text.NL();
				Text.Add("<i>“Still, every now and then they do get a little too close for comfort, and then it’s up to Maria to do a little misdirection, lead them on a chase to nowhere and get them hopelessly lost.”</i> He chuckles. <i>“That girl, she’s as full of energy as always. Would love to see if she’s got that much energy in bed… but that’s just an old man dreaming.”</i>", parse);
				Text.NL();
				Text.Add("Well, maybe it couldn’t hurt to try and follow his dreams…", parse);
				Text.NL();
				Text.Add("Vaughn snorts, which tells you without a doubt what he thinks of that idea.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Slowly. Looking forward to the sun coming up and digging into Raine’s breakfast.”</i>", parse);
				Text.NL();
				Text.Add("Does he mean the cookhouse? But… isn’t the food served there unpredictable?", parse);
				Text.NL();
				Text.Add("<i>“That’s what makes it so amazing! You never know what you’re going to get, and Raine herself doesn’t know what she’s going to be cooking until she does it. Yet somehow, some way, it doesn’t manage to poison anyone who has so much as a taste. I’m always duly impressed when I come in every morning. The broth was very nice.”</i>", parse);
				Text.NL();
				Text.Add("Is he sure he’s feeling all right? Maybe he has a headache, or is he running a fever?", parse);
				Text.NL();
				Text.Add("<i>“I assure you, kid, I’ve got my head screwed on straight, so you don’t need to worry about that. I just like the surprise of Raine’s cooking, that’s all. And if she were, say, thirty years younger…”</i>", parse);
				Text.NL();
				Text.Add("Yes?", parse);
				Text.NL();
				Text.Add("<i>“Well, it’s not just her food. She reminds me of my fiancee, too.”</i>", parse);
				Text.NL();
				Text.Add("Oh.", parse);
				Text.NL();
				Text.Add("<i>“Good times, good times.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“It’s nice. Gives you time to open up your head and let your mind walk around while your eyes stay here and do the watching.”</i>", parse);
				Text.NL();
				Text.Add("Huh. Well, given that he’s in charge of the upkeep of the wall and moat, it stands to reason that he’s got plenty to apply his brain to.", parse);
				Text.NL();
				Text.Add("He waggles a hand at you. <i>“Oh, come on. I’m not a caricature - I don’t just think about woodworking all day long.”</i>", parse);
				Text.NL();
				Text.Add("Well then, what <i>does</i> go on in that head of his when he’s on the clock?", parse);
				Text.NL();
				Text.Add("<i>“Sex. That gnawing feeling you get when you think there’s someone or something watching you, yet there’s no one in sight. What’s likely going on in the boss-man’s head, and whether that means he’s going to require mobilizing us anytime soon. Where the hell all the tar went, and how soon we can get some more from upriver. Sex.”</i>", parse);
				Text.NL();
				Text.Add("He sure thinks of sex a lot, doesn’t he?", parse);
				Text.NL();
				Text.Add("<i>“It was a joke.”</i>", parse);
				Text.NL();
				Text.Add("Well, it wasn’t obvious that it was one. The way he said it with a complete straight face and tone of voice, he could’ve been serious.", parse);
				Text.NL();
				Text.Add("<i>“Hah, don’t get much of it these days, but yeah, dreaming about rolls in the hay probably isn’t the best idea while on duty. Those thoughts… well, they tend to take up a little more attention than most.”</i>", parse);
			}, 1.0, function() { return true; });
			
			scenes.Get();
			
			Text.Flush();
			
			world.TimeStep({minute: 10});
			
			Scenes.Vaughn.TalkHimself();
		}, enabled : true
	});
	if((vaughn.flags["Talk"] & Vaughn.Talk.Past) || (vaughn.flags["TWar"] >= Vaughn.TalkWar.Desertion)) {
		options.push({ nameStr : "Fiancee",
			tooltip : "So, he mentioned a fiancee…",
			func : function() {
				Text.Clear();
				Text.Add("You’re aware that this might bring up some bad memories, but nevertheless, curiosity gets the better of you and you have to ask. He never saw his fiancee again… did he lose her in the war?", parse);
				Text.NL();
				Text.Add("Vaughn catches your expression and shakes his head. <i>“Nah, there’s no need to be all upright about it. It happened so long ago, and I’m… I guess I’m past all that.</i>", parse);
				Text.NL();
				Text.Add("<i>“But yeah, back then, I was engaged to a cooper’s daughter, little establishment just off the merchants’ district in Rigard. Sabrina was her name, and back then young old me thought she was the prettiest vixen I’d ever laid eyes on. Her mother’s side of the family was of highland stock, and she did knotwork in her grey fur after the traditional highlander fashion… sure, there’re many fish in the ocean and many girls on the girl tree, but every now and then you find one who’s riper and fresher than most, you know?”</i>", parse);
				Text.NL();
				Text.Add("You nod and tell Vaughn to go on.", parse);
				Text.NL();
				Text.Add("<i>“Heh… Sabrina had the best pair of tits ever. I’d fantasize about them being fuller and firmer than they already were, her nipples swollen as our kits suckled from those dugs of hers… then I’d do some sucking myself once they were put to bed. Hah… her daddy wasn’t so enthusiastic at first when he learned I lived about the docks, but quickly changed his tune when he found out I was slated to be a shipwright’s carpenter instead of the dockhand he thought I was.</i>", parse);
				Text.NL();
				Text.Add("<i>“Those were the days, [playername]. I was young, and couldn’t believe my luck when we started going out together… ha ha, pawing at her blouse furtively under her daddy’s nose, dipping my hand down her front while she had hers in my trousers… it always ended up with me titfucking her and messing up her face. Ha ha…”</i>", parse);
				Text.NL();
				Text.Add("Is he all right?", parse);
				Text.NL();
				Text.Add("<i>“Yeah, I’m fine, I’m fine.”</i> Vaughn throws his head back, then lets out a couple of hacking coughs, smoke spewing from his muzzle in great gouts. <i>“Damn it, almost swallowed my smoke there.”</i>", parse);
				Text.NL();
				Text.Add("So what happened next? The war?", parse);
				Text.NL();
				Text.Add("<i>“After a little bit, yeah, the war happened - but not before I’d saved up and went and bought her a plain silver ring and gone and proposed. Three days later, I was heading back home from the Maidens' Bane when the press gangs appeared and informed me that I was in His Majesty’s service as of that moment, and resisting was tantamount to treason.</i>", parse);
				Text.NL();
				Text.Add("<i>“So there we have it. It was months before I managed to head down to Sabrina’s, but her family had fled long ago with the rest of the morphs on the street, getting away from Rigard and its troubles, and no one knew where they’d gotten to. I don’t blame her, ‘cause word on the street was that if you got press-ganged you were as good as dead, and the way most conscripts were treated, that wasn’t too far off the mark. As far as she was concerned, I might as well be skinned and turned into a fur coat, so why should she risk herself and her folks waiting for me?”</i>", parse);
				Text.NL();
				Text.Add("Wow, that’s quite the sad tale.", parse);
				Text.NL();
				Text.Add("<i>“Yeah, but it was one which no doubt played out plenty of times with many people during those years. There’re people in this camp with better tear-jerkers than mine, [playername]. May not be so free with their words, though.”</i> With that, Vaughn drags deeply on his smoke and exhales in a long sigh. <i>“It’s been years, [playername]. I’ve moved on since then. Sabrina’s probably long forgotten me, if she’s still alive, and the engagement ring I bought all those years ago gone - or more likely, she’s saying it was handed down from her grandma. Roll with the punches, [playername]; that’s all I have to say.”</i>", parse);
				Text.Flush();
				
				world.TimeStep({minute: 10});
				
				vaughn.flags["Talk"] |= Vaughn.Talk.Fiancee;
				
				Scenes.Vaughn.TalkHimself();
			}, enabled : true
		});
	}
	
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“Right. Anything else you’d like to flap your gums on about?”</i>", parse);
		Text.Flush();
		
		Scenes.Vaughn.TalkPrompt();
	});
}

Scenes.Vaughn.TalkWar = function() {
	var parse = {
		playername : player.name
	};
	
	//[Beginnings][Wartime][Desertion][Afterwards]
	var options = new Array();
	options.push({ nameStr : "Beginnings",
		tooltip : "How did it all get started, from his point of view?",
		func : function() {
			Text.Clear();
			Text.Add("His cigarette firmly in his mouth, Vaughn leans back against one of the watchtower’s supports, removes his hat, and fans himself with it. <i>“I know it didn’t happen all at once, although it does seem that way at times. Most of the little people don’t stand very tall to be able to see very far, you know? Still, I heard things coming out from behind the city walls, rumors and the like that the Crown and the various merchant’s guilds were at loggerheads once more. Supposedly, it was all due to the portal trouble, but I never paid any attention to it ‘cause it didn’t affect the shipwrighting business any. Despite there being just the wall between the docks and the city proper, it might as well all have been going down on another place as far as I was concerned.”</i>", parse);
			Text.NL();
			Text.Add("Right. So when did he get involved?", parse);
			Text.NL();
			Text.Add("<i>“What’s the rush? The night’s long, and we’ve got time to talk. Right. So one day when I was out drinking with the other guys - the Maiden’s Bane had a special that evening, and someone got the bright idea to celebrate the fact that I’d gotten engaged. If I’d gone a little earlier like I’d wanted to… if I’d stayed in and worked on the new hull design… if we’d ordered that last round of drinks… would everything have been different? And if so, would it have been for the better, or for the worse?</i>", parse);
			Text.NL();
			Text.Add("<i>“It’s kept me awake at night sometimes, you know. There I was, down with the other lads, half-drunk and stumbling our way back to the docks from the Maidens’ Bane - that’s when the press-gangers came for us. We must’ve looked like easy meat, and that’s what we were; when they came a-calling, we split like the winds and tried to lose them in the alleyways, but all we really ended up losing was our own feet. I remember… someone grabbed me by the shoulders, pulled me up roughly, and told me, ‘congratulations, you’re in His Majesty’s service now.’ And that was that.”</i>", parse);
			Text.NL();
			Text.Add("Were things that bad that people were being pulled off the streets to be forced to serve? While you may or may not have heard of this before, it definitely wasn’t as serious as Vaughn’s tale suggests. Or was it?", parse);
			Text.NL();
			Text.Add("Vaughn looks away and tugs at his neckerchief. <i>“I keep forgetting you’re not from these parts. Eden’s tended to be a fairly peaceful place, [playername]. Sure, we’ve always had rogues and brigands, and there’ve been nasties in the Bone Yard since forever, but you don’t need an army to deal with the first and the second keeps well enough to itself so long as you’re not stupid enough to wander in. The Free Cities aren’t dumb enough to take the Kingdom head-on militarily, so that’s not a problem, either.</i>", parse);
			Text.NL();
			Text.Add("<i>“What I’m getting at is that a standing army costs money to feed, train and equip, and with little need for one, things get pared down over the generations. The Royal Guard was always part of the army, and they stepped in to fill some of the gaps left behind when people and places were decommissioned.</i>", parse);
			Text.NL();
			Text.Add("<i>“Now, all of a sudden, there’s a civil war exploding out of nowhere, and Rewyn desperately needs warm bodies to fill the rank and file. The Royal Guard definitely isn’t going to be doing it, so what <b>else</b> was he supposed to do but pick folks off the streets, especially those from the slums who most likely wouldn’t be missed? Throw them a cheap spear and shield, then send them out to die for the Crown.</i>", parse);
			Text.Flush();
			
			world.TimeStep({minute: 10});
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("<i>“Get this straight. I don’t like what happened. I’m not making excuses for him, but if I were in Rewyn’s shoes… as far as I know the situation, I’m not sure if there’s much I could’ve done differently.”</i>", parse);
				Text.NL();
				Text.Add("Silence. Vaughn’s breath is heavy in the dark of night, and the fox-morph takes a small repose to gather his thoughts, pulling a small hip flask from a pants pocket before taking a swig.", parse);
				Text.NL();
				Text.Add("<i>“Thinking back makes me tetchy, and talking makes me thirsty.”</i> He holds out the flask to you. <i>“Want a drink?”</i>", parse);
				Text.Flush();
				
				//[Sure][Nah]
				var options = new Array();
				options.push({ nameStr : "Sure",
					tooltip : "Why not? It’s a cold night.",
					func : function() {
						Text.Clear();
						Text.Add("You accept the hip flask from Vaughn and take a swig. Whatever’s inside, it’s smooth and silky, without any hint of foam and fizz. Sweet enough to be on the level of sugar water, yet there’s a hint of wild fruit somewhere in it, and of course, plenty of alcohol. A flush of heat courses through your veins as the drink enters you, and you take another swig before handing the hip flask back to Vaughn.", parse);
						Text.NL();
						Text.Add("<i>“Good stuff, eh? I take it you like Mister Hip Flask?”</i>", parse);
						Text.NL();
						Text.Add("Yeah, Mister Hip Flask’s an enjoyable friend to have around. You’ve just met him, and already you’d like to get to know him a lot better.", parse);
						Text.NL();
						Text.Add("<i>“Mister Hip Flask and I have been friends for a long time,”</i> Vaughn replies as he pockets the flask. <i>“He’s a loyal companion, still has to let me down. Doesn’t talk much, but he’s there when you need him.”</i>", parse);
						Text.NL();
						Text.Add("Yeah, you reply with a grin. Everyone could do with a friend like Mister Hip Flask.", parse);
						PrintDefaultOptions();
					}, enabled : true
				});
				options.push({ nameStr : "Nah",
					tooltip : "Not right now.",
					func : function() {
						Text.Clear();
						Text.Add("You don’t feel like having a drink right at the moment, and wave off Vaughn’s offer. The fox-morph shrugs and takes a couple more swigs from the flask. <i>“Sure, that just means more for me. Don’t mind if I do, then.</i>", parse);
						PrintDefaultOptions();
					}, enabled : true
				});
				
				Gui.Callstack.push(function() {
					Text.NL();
					Text.Add("<i>“Right. Now, where was I? Ah, yes. We got taken inside the walls to the barracks - that’s where the City Watch’s headquartered these days. The Royal Guard had set up some sort of booth or something, and was processing people like crazy - it didn’t matter if you were a full human or morph, clean or reeking of cheap beer like I was. If you were there, you weren’t fast enough on your feet.</i>", parse);
					Text.NL();
					Text.Add("<i>“We were stood in groups of sixty, got told once more that we were now the king’s men and that if we tried to escape, we’d be branded deserters and shot on the spot. One guy didn’t take them seriously, or maybe he was desperate -  I don’t know which - and tried to make a break for it when he thought the Royal Guard weren’t looking. Poor bastard ended up being carted out to the morgue with several crossbow bolts in his back.”</i>", parse);
					Text.NL();
					Text.Add("That’s… quite forceful.", parse);
					Text.NL();
					Text.Add("<i>“They were afraid, [playername]. Most of them took on the job ‘cause you got a nice breastplate with swirly engravings and stood around by the king looking important all day. Serious threat like this hasn’t come up for a long time, and next thing they know they’re having to fulfill the ‘guard’ part of ‘Royal Guard’.”</i> Vaughn laughs, though there’s no humor in his voice. <i>“Listen to me, defending them.</i>", parse);
					Text.NL();
					Text.Add("<i>“In any case, someone must’ve recognized my name, or otherwise figured that I wasn’t just a dockhand or drifter, because I’m taken from the line meant for the meat grinder and told to shove off to one side. Couple of hours of nerve-wracking, half-drunk waiting later, I’m told to get up and go with a handful of other guys to be trained as combat engineers. And that’s the end of my tale on how it all got started. I… I never asked for any of this. It just happened; I got swept up, and by the time I managed to get off, I was in a worse place than where I started off from.”</i>", parse);
					Text.NL();
					Text.Add("Sounds much like how you got onto Eden, then. Patting Vaughn on the shoulder, you thank him for reciting the rather lengthy tale to you.", parse);
					Text.NL();
					Text.Add("<i>“My pleasure,”</i> Vaughn replies, the fox-morph pulling his shoulders together with a sigh. <i>“Like I said, I’m my favorite subject to talk about. Anything else about the war you want to ask?”</i>", parse);
					Text.Flush();
					
					world.TimeStep({minute: 10});
					
					if(vaughn.flags["TWar"] < Vaughn.TalkWar.Beginnings)
						vaughn.flags["TWar"] = Vaughn.TalkWar.Beginnings;
					
					Scenes.Vaughn.TalkWar();
				});
				
				Gui.SetButtonsFromList(options, false, null);
			});
		}, enabled : true
	});
	if(vaughn.flags["TWar"] >= Vaughn.TalkWar.Beginnings) {
		options.push({ nameStr : "Wartime",
			tooltip : "So… just how did it go down? The civil war, that is.",
			func : function() {
				Text.Clear();
				Text.Add("<i>“It was messy, that’s for sure. As a trainee in the engineering corps, I didn’t get out that often - we were taken from the city to one of the country forts and given a crash course on machines of war. Bridges you could put together and take apart on the spot, ballistae, catapults, building proper fortifications, that sort of stuff. All ten of us had backgrounds in either masonry or woodworking of some sort, so they didn’t have to go over the basics like loading and tensile strength with us. Like the others, I tried to apply myself as best as I could without lingering on just <i>why</i> we were being told to study this stuff, or that we might have to use it on our own people at some point.</i>", parse);
				Text.NL();
				Text.Add("<i>“Those were the basics, of course. There was really old stuff that was being dragged out and dusted off, too - mostly involving alchemy, like I told you before. Rewyn was pulling out all the stops when it came to the merchant guilds… they must’ve done something really serious to piss him off that badly, but no one knew just what and everyone was too afraid to ask. Keep our heads down and look to ride out the storm, and perhaps things would blow over before we were actually mobilized into action.</i>", parse);
				Text.NL();
				Text.Add("<i>“Didn’t turn out that way.”</i>", parse);
				Text.NL();
				Text.Add("Few things in life ever turn out exactly like one expects them to. This is where things get interesting, don’t they?", parse);
				Text.NL();
				Text.Add("<i>“Interesting.”</i> Vaughn puffs on his cigarette. <i>“You could call it that. Things would come to us, you know… one day, we hear rumors that the merchants are trying to rile up morphs, use us as shock troops when what’s left of their mercenaries are leaving left and right. The next morning, we’re hearing of massacres in the streets and patrols sweeping from door to door in the slums. With shit like that going down, I don’t blame my fiancee for leaving with her folks… many people would’ve fled if not for the lack of somewhere to go. Didn’t stop some from running to the Free Cities with nothing but the clothes on their backs, but I think most people were like us: hiding and hoping that this would all blow over. People have roots. People have <b>inertia</b>. And sometimes, they think the demon you know is better than the demon you don’t.</i>", parse);
				Text.NL();
				Text.Add("<i>“The stories got to us, though. We began talking amongst ourselves… what we’d do if we were ordered to turn what we knew on our own people. Don’t get me wrong - you use siege engines during a siege. You don’t turn a catapult on people, that’s just dumb if you’re talking about creating casualties - but it does scare the shit out of most folks who think that being squashed under a big rock is a terrible way to go.The ten of us who were press-ganged, we made a promise to desert together if that’s what happened.”</i>", parse);
				Text.NL();
				Text.Add("That’s quite the promise, considering what he just told you about the penalty for desertion. Talk comes cheaply, as the saying goes; how’d he know none of them would crack when push came to shove?", parse);
				Text.NL();
				Text.Add("<i>“We didn’t, but the fact that the words had been said made us feel all the better about our situation. Got put to the test soon enough - the day came, perhaps two or three months after I’d arrived at the engineering corps, that the order came from above for us to move out to Rigard. By then, the worst of the fighting was over; while there was still some street skirmishes going on with some of the more determined morphs, the guilds and their hirelings had been largely beaten bloody and were at the end of their tether. They knew that even if they surrendered and gave in to every last one of Rewyn’s demands, it’d be their necks on the chopping block.</i>", parse);
				Text.NL();
				Text.Add("<i>“We didn’t know what was going on or what was really expected of us, so we tethered the rakhs to their stations and marched down the King’s Road to Rigard like we were asked to. The siege engines we left at the gates, and we <b>felt</b> the eyes on us as we reported in at the merchants’ district.”</i>", parse);
				Text.NL();
				Text.Add("By now, Vaughn isn’t looking at you, his gaze trained on some distant point beyond your shoulder as the memories flow unimpeded, his mouth running on automatic.", parse);
				Text.Flush();
				
				world.TimeStep({minute: 10});
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("<i>“I remember… Rewyn was angry. No, he was mad. Insane. There was blood on his sword; it was a little thick, but still fresh and glistening in the evening light. I remember being shocked at his appearance, that he looked so young, about my age if not even younger. The Royal Guards flanking him were frightened of him, though they made a good show of not letting it slip. There were tears on his cheeks, and murder on his face.</i>", parse);
					Text.NL();
					Text.Add("<i>“My commanding officer, he went up and asked for his orders. Poor man. Poor, brave man. Rewyn wanted the entire merchants’ guild leveled to the ground. He wanted the entire guildhall eradicated, wiped off the face of Eden, and it was to be our siege engines that were to do the job, coupled with the… rather dubious things we’d taken out of the old books. And I quote the man, ‘if there’s so much as a brick standing on another brick when you’re done, I’ll have your fucking head.’ Aria bless, what kingly words.”</i>", parse);
					Text.NL();
					Text.Add("What happened? Why was Rewyn behaving the way he was?", parse);
					Text.NL();
					Text.Add("Vaughn slowly shakes his head, the fox-morph’s expression turning grim at the recollection. <i>“I… don’t know. The man was plainly hurting, but no one I’ve ever compared notes with knows for sure why he snapped. As I said, it was the end of the line for the merchants; if they could use us morphs as meat shields for their plans and still sleep at night, they’d have done anything to save their hides from Rewyn’s wrath. If that was what happened… well, whatever they tried backfired terribly on them. I myself was standing in formation, watching all this unfold while quaking in my boots and about ready to piss my pants.</i>", parse);
					Text.NL();
					Text.Add("<i>“My CO, bless him, tried to talk Rewyn out of this madness. That there’d be too much collateral damage if we used the explosives. That the ballistae would be a bitch to get through the streets. That if we used the alchemical fire we’d just dug up out of the books, it could very well spread beyond control in the crowded district and burn down the whole of Rigard, and all the water in the ocean wouldn’t douse it. If we exacted the kind of destruction he wanted, there’d be too many innocent lives lost. He was a king, he needed to look out for his subjects, so on and so forth.</i>", parse);
					Text.NL();
					Text.Add("<i>“It didn’t work. Rewyn just stood there, growing angrier and angrier under the surface, and then without warning, he thrusts his blade and runs my CO straight through the guts. We just stared in silence for the whole of five seconds, then he lets the still-warm body slide off his sword and calls for the second-in-command to step up. ‘Congratulations, you’ve been promoted; I need a man who can actually follow orders instead of trying to contradict me at every turn.’”</i>", parse);
					Text.NL();
					Text.Add("Pausing a moment in his tale, Vaughn looks up at the night sky, dimly visible through the forest canopy. The fox-morph’s fur is standing on end, despite it not being cold, and he shudders before exhaling a large cloud of cigarette smoke.", parse);
					Text.NL();
					Text.Add("<i>“If not for my friends, if not for that promise we’d made a couple weeks ago, [playername], I’d never have had the courage to make a break for it. But I caught sight of Leon beside me, and he stares at me, and then all the others, too… and that’s when I said ‘screw this, I’m out of here.’ I dropped my spear, as did Leon, and we ran. All ten of us fucking broke ranks and ran, rather than follow that crazy boy-king’s orders. The others… they didn’t stop us. No, some of them even joined us and just hoofed it, dropping their shields and shit in the process. No one tried to stop us; some even moved aside to let us through.</i>", parse);
					Text.NL();
					Text.Add("<i>“It was a fucking sight to behold, [playername]. Of His Majesty’s first engineering corps, a whole quarter of us deserted in that very moment, with our commanding officer’s blood still pooling on the cobblestones and his dead eyes staring up at the sky; it just took one of us to show enough guts, one of us to show the others they weren’t alone, and the show got on the road. I think the sight of all of us running for it finally hammered home into Rewyn just what he’d done, that he’d crossed a line that day… too bad he chose to double down instead of back off. At least, though, he didn’t order his Royal Guard to hunt us down and make examples of us.</i>", parse);
					Text.NL();
					Text.Add("<i>“Leon and I, we ran and ran and ran through the streets even as the yellow-green flames of alchemical fire started up behind us and the screaming began. Ditched the uniform first chance we got, left it in exchange for the clothes off someone’s washing. Made it out of the gates, agreed that we’d be harder to track down if we split up… and that was it.</i>", parse);
					Text.NL();
					Text.Add("<i>“The merchants’ guild building… it’s gone today. Razed to the last block and wiped from memory; in the end, Rewyn got his wish. Something else’s been built over it - don’t rightly remember what, haven’t dared sneak into Rigard proper for a long, long time. And that was that.”</i>", parse);
					Text.NL();
					Text.Add("A long story indeed.", parse);
					Text.NL();
					Text.Add("<i>“Aye, a long and bitter one,”</i> Vaughn agrees, <i>“but what else could I have done that’d have allowed me to live with myself? You want to change the topic? It’s not as if I’ve got anything else to say on the subject.”</i>", parse);
					Text.Flush();
					
					world.TimeStep({minute: 10});
					
					if(vaughn.flags["TWar"] < Vaughn.TalkWar.Wartime)
						vaughn.flags["TWar"] = Vaughn.TalkWar.Wartime;
					
					Scenes.Vaughn.TalkWar();
				});
			}, enabled : true
		});
	}
	if(vaughn.flags["TWar"] >= Vaughn.TalkWar.Wartime) {
		options.push({ nameStr : "Desertion",
			tooltip : "What was life as a deserter like?",
			func : function() {
				Text.Clear();
				Text.Add("Vaughn draws on his cigarette and tugs at his collar as he reminisces. <i>“It wasn’t easy, but it wasn’t as hard as some would make it out to be, either. I knew I had to get away from Rigard, but I doubled back into the slums anyways, hoping to at least say goodbye to Sabrina… but of course, neither she nor her folks were there anymore. I did get to see my old master, though, snuck in even though the shipwright’s was boarded up and said goodbye, had my last hot meal for a long time. After that, I trekked straight out into the plains, where I thought there’d be a good chance of someone like me just vanishing into thin air.</i>", parse);
				Text.NL();
				Text.Add("<i>“As for that, well, I already told you the rest of the story. Worked for a bit doing odd jobs, a bit of woodworking, a bit of masonry, but people’d always know I was a deserter. Or more likely they didn’t know, but could guess that letting me stay on for too long would be a bad idea. ‘Vaughn, you do good work, but we simply can’t keep you on past the end of this season, you gotta go.’ Something in the way I walked and talked, I guess. For a while, I tried using a different name, but I just couldn’t get it to stick. My lips would speak the lie, but the rest of my body didn’t follow, if you get what I mean.”</i>", parse);
				Text.NL();
				Text.Add("The kind of thing tends to stick with people, yes. Weren’t deserters supposed to be hunted down and put to death, or something equally grim?", parse);
				Text.NL();
				Text.Add("<i>“Technically, yeah. That was the official line, but the Crown didn’t seem to have its heart in enforcing it. Maybe Rewyn realized that he’d gone just a bit too far, maybe he was busy getting a grip on power and whipping everyone in line, maybe… well, who knows? Officially, deserters were to be dragged back and hanged to make an example of them, but the zeal in pursuing that particular command was quite lacking. Still, I wasn’t about to go around declaring that I was a deserter, and presented myself as someone who’d just gotten uprooted during the troubles and hadn’t settled down since then. Not as if I didn’t try, though.”</i>", parse);
				Text.NL();
				Text.Add("That sounds reasonable. How long has he been with the outlaws, now?", parse);
				Text.NL();
				Text.Add("<i>“Little over ten and a few years. There were times while I was drifting when I thought of packing it in and heading for the Free Cities, but something always stopped me from going… guess I’ve got roots in the kingdom, even if it may not be the one I remember growing up in. Good thing I didn’t, eh?”</i>", parse);
				Text.NL();
				Text.Add("Yes, or else he wouldn’t be here now.", parse);
				Text.NL();
				Text.Add("Vaughn nods. <i>“As I said, the last smallholder who took me on to fix his roof, he was selling part of his harvest to the boss-man to avoid taxes on his melons… I’d heard of the outlaws, of course, but had no idea where to sign up and wasn’t about to go wandering in the forest all by my lonesome. After I’m done tiling his roof, he comes up to me and says, ‘Vaughn, I know you’re running from something. Is it Rigard?’ I tell him yes, and he asks me to stay with him a week more, he knows some people who can help folk like me.</i>", parse);
				Text.NL();
				Text.Add("<i>“He set up a meeting between me and Maria, and well, here I am. It’s been a long, strange trip, but I have the feeling that the road ahead’s going to be even more fucked up than it already is.”</i>", parse);
				Text.NL();
				Text.Add("Why?", parse);
				Text.NL();
				Text.Add("<i>“Well, look at you. Scarcely a portal opened in ten years, and then one appears, barfs you out, and here you are. That’s quite the happenstance in and of itself, and I’m not counting the shit we’ve set into motion that’s about to collide every day now. You don’t think we’ve been stewing in the forest hunting deer for the last twenty years, right?”</i>", parse);
				Text.NL();
				Text.Add("Right, right. You wait a while for Vaughn to continue, but it seems like he’s reached the end of his little tale. What else should you ask him?", parse);
				Text.Flush();
				
				world.TimeStep({minute: 10});
				
				if(vaughn.flags["TWar"] < Vaughn.TalkWar.Desertion)
					vaughn.flags["TWar"] = Vaughn.TalkWar.Desertion;
				
				Scenes.Vaughn.TalkWar();
			}, enabled : true
		});
	}
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“Sure. You got anything else you want to talk about?”</i>", parse);
		Text.Flush();
		
		Scenes.Vaughn.TalkPrompt();
	});
}

export { Vaughn };
