import { TasksScenes } from './vaughn-tasks';
import { WorldTime, TimeStep, GAME, StepToHour } from '../../GAME';
import { VaughnFlags } from './vaughn-flags';
import { Text } from '../../text';
import { Gui } from '../../gui';
import { EncounterTable } from '../../encountertable';
import { Season } from '../../time';

let VaughnScenes : any = {
	Tasks : TasksScenes,
};

VaughnScenes.Introduction = function() {
	let player = GAME().player;
	let vaughn = GAME().vaughn;

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
	
	vaughn.flags["Met"] = VaughnFlags.Met.Met;
	
	TimeStep({minute: 30});
	
	Gui.NextPrompt();
}

VaughnScenes.CampDesc = function() {
	var parse = {};
	
	Text.Add("Vaughn should be on watch around this time, if you wish to seek out the fox.", parse);
	Text.NL();
}

VaughnScenes.CampApproach = function() {
	let player = GAME().player;
	let vaughn = GAME().vaughn;

	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	// Trigger the one-shot confront scene
	if(vaughn.flags["Talk"] & VaughnFlags.Talk.Confront && !vaughn.Confronted()) {
		VaughnScenes.ConfrontFollowup();
		return;
	}
	else if(vaughn.flags["Met"] == VaughnFlags.Met.LockpicksElodie) {
		VaughnScenes.Tasks.Lockpicks.Debrief();
		return;
	}
	else if(VaughnScenes.Tasks.Snitch.DebriefAvailable()) {
		VaughnScenes.Tasks.Snitch.Debrief();
		return;
	}
	else if(VaughnScenes.Tasks.Snitch.OutOfTime()) {
		VaughnScenes.Tasks.Snitch.DebriefOutOfTime();
		return;
	}
	else if(vaughn.flags["Met"] == VaughnFlags.Met.PoisoningSucceed) {
		VaughnScenes.Tasks.Poisoning.DebriefSuccess();
		return;
	}
	else if(vaughn.flags["Met"] == VaughnFlags.Met.PoisoningFail) {
		VaughnScenes.Tasks.Poisoning.DebriefFailure();
		return;
	}
	else if(VaughnScenes.Tasks.Poisoning.OutOfTime()) {
		VaughnScenes.Tasks.Poisoning.DebriefOutOfTime();
		return;
	}
	//TODO: Need to account for correctly completed tasks
	else if(VaughnScenes.Tasks.OnTask()) {
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
		if(WorldTime().season == Season.Winter) {
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
	
	VaughnScenes.Prompt();
}

VaughnScenes.Prompt = function() {
	let player = GAME().player;

	var parse : any = {
		playername : player.name
	};
	
	//[Appearance][Tasks]
	var options = new Array();
	options.push({ nameStr : "Appearance",
		tooltip : "Give the fox a once-over.",
		func : function() {
			Text.Clear();
			parse["w"] = WorldTime().season == Season.Winter ? ", and he’s let his winter coat grow out a bit to better ward off the cold" : "";
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
			
			VaughnScenes.TalkPrompt();
		}, enabled : true
	});
	options.push({ nameStr : "Tasks",
		tooltip : "Ask him if he has any work for you.",
		func : function() { VaughnScenes.Tasks.TaskPrompt(VaughnScenes.Prompt); }, enabled : true
	});
	options.push({ nameStr : "Sex",
		tooltip : "Proposition Vaughn for sex.",
		func : VaughnScenes.Sex, enabled : true
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

VaughnScenes.TalkPrompt = function() {
	let player = GAME().player;
	let vaughn = GAME().vaughn;

	var parse = {
		playername : player.name
	};
	
	//[Himself][War][Engineer][Back]
	var options = new Array();
	options.push({ nameStr : "Himself",
		tooltip : "Ask Vaughn about himself.",
		func : function() {
			Text.Clear();
			
			var first = !(vaughn.flags["Talk"] & VaughnFlags.Talk.Himself);
			vaughn.flags["Talk"] |= VaughnFlags.Talk.Himself;
			
			if(first)
				Text.Add("<i>“Me? You want to talk about little old me? Well, that so happens to be my favorite subject.”</i> Vaughn pauses for a second to let his words sink in, then lets out a short, yipping laugh. <i>“No one’s asked about me for a long, long while. Last time that happened, I was being trundled into the camp, although in a much friendlier manner than you were, and Zenith was asking me why I wanted to be here. Go on, ask to your heart’s content. I won’t mind.”</i>", parse);
			else
				Text.Add("<i>“You want to hear about me again? Was it really that interesting the first time? Well, I don’t mind talking about me. I love talking about me. So go ahead, ask away. Again.”</i>", parse);
			Text.Flush();
			
			VaughnScenes.TalkHimself();
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
			
			VaughnScenes.TalkWar();
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
			
			TimeStep({minute: 10});
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("Vaughn looks askance at you, then tosses his cigarette onto the ground and stamps it out underfoot. <i>“Right. Break time’s over, then - while I’m still here, you got anything else you’d like to discuss with me?”</i>", parse);
		Text.Flush();
		
		VaughnScenes.Prompt();
	});
}

VaughnScenes.TalkHimself = function() {
	let player = GAME().player;
	let vaughn = GAME().vaughn;

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
			
			TimeStep({minute: 10});
			
			vaughn.flags["Talk"] |= VaughnFlags.Talk.Past;
			
			VaughnScenes.TalkHimself();
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
			
			TimeStep({minute: 10});
			
			VaughnScenes.TalkHimself();
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
			
			TimeStep({minute: 10});
			
			VaughnScenes.TalkHimself();
		}, enabled : true
	});
	if((vaughn.flags["Talk"] & VaughnFlags.Talk.Past) || (vaughn.flags["TWar"] >= VaughnFlags.TalkWar.Desertion)) {
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
				
				TimeStep({minute: 10});
				
				vaughn.flags["Talk"] |= VaughnFlags.Talk.Fiancee;
				
				VaughnScenes.TalkHimself();
			}, enabled : true
		});
	}
	
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“Right. Anything else you’d like to flap your gums on about?”</i>", parse);
		Text.Flush();
		
		VaughnScenes.TalkPrompt();
	});
}

VaughnScenes.TalkWar = function() {
	let player = GAME().player;
	let vaughn = GAME().vaughn;

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
			
			TimeStep({minute: 10});
			
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
						Gui.PrintDefaultOptions();
					}, enabled : true
				});
				options.push({ nameStr : "Nah",
					tooltip : "Not right now.",
					func : function() {
						Text.Clear();
						Text.Add("You don’t feel like having a drink right at the moment, and wave off Vaughn’s offer. The fox-morph shrugs and takes a couple more swigs from the flask. <i>“Sure, that just means more for me. Don’t mind if I do, then.</i>", parse);
						Gui.PrintDefaultOptions();
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
					
					TimeStep({minute: 10});
					
					if(vaughn.flags["TWar"] < VaughnFlags.TalkWar.Beginnings)
						vaughn.flags["TWar"] = VaughnFlags.TalkWar.Beginnings;
					
					VaughnScenes.TalkWar();
				});
				
				Gui.SetButtonsFromList(options, false, null);
			});
		}, enabled : true
	});
	if(vaughn.flags["TWar"] >= VaughnFlags.TalkWar.Beginnings) {
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
				
				TimeStep({minute: 10});
				
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
					
					TimeStep({minute: 10});
					
					if(vaughn.flags["TWar"] < VaughnFlags.TalkWar.Wartime)
						vaughn.flags["TWar"] = VaughnFlags.TalkWar.Wartime;
					
					VaughnScenes.TalkWar();
				});
			}, enabled : true
		});
	}
	if(vaughn.flags["TWar"] >= VaughnFlags.TalkWar.Wartime) {
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
				
				TimeStep({minute: 10});
				
				if(vaughn.flags["TWar"] < VaughnFlags.TalkWar.Desertion)
					vaughn.flags["TWar"] = VaughnFlags.TalkWar.Desertion;
				
				VaughnScenes.TalkWar();
			}, enabled : true
		});
	}
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“Sure. You got anything else you want to talk about?”</i>", parse);
		Text.Flush();
		
		VaughnScenes.TalkPrompt();
	});
}


/* VAUGHN SEX SCENES */

VaughnScenes.Sex = function() {
	let player = GAME().player;
	let vaughn = GAME().vaughn;

	var parse : any = {
		breasts : function() { return player.FirstBreastRow().Short(); }
	};
	
	var first = !(vaughn.flags["Talk"] & VaughnFlags.Talk.Sex);
	vaughn.flags["Talk"] |= VaughnFlags.Talk.Sex;
	
	Text.Clear();
	if(first) {
		Text.Add("Vaughn snorts at the suggestion, a corner of his muzzle curling - although you can’t tell whether it’s with wryness or disgust in the dim light. <i>“Why, you wanting something from me?”</i>", parse);
		Text.NL();
		Text.Add("No, he just seems a little… how should you put it? Pent-up, that’s the word. And so are you.", parse);
		Text.NL();
		Text.Add("<i>“No favors? No questions? Not even a good word in edgeways?”</i>", parse);
		Text.NL();
		Text.Add("No, no, and for the final time, no.", parse);
		Text.NL();
		Text.Add("Vaughn scratches his head. <i>“Gotta admit, it’s the first time in a long, long while that someone’s said something like that to me without wanting anything in return. You sure you’re feeling okay?”</i>", parse);
		Text.NL();
		Text.Add("Does he really think that lowly of himself, or is he just making excuses for something else?", parse);
		Text.NL();
		Text.Add("<i>“Oh snap, you got me,”</i> the fox-morph replies with a short bark of laughter, a plume of cigarette smoke rising from his muzzle. <i>“I’m secretly still in love with my mom, and can’t wait to get back to her grave so I can dig her out of the ground and fuck her rotting body six ways to saturday. Been saving myself up for <b>years</b> just for that.”</i>", parse);
		Text.NL();
		Text.Add("Really?", parse);
		Text.NL();
		Text.Add("<i>“Nah.”</i> With a flick of his fingers, Vaughn sends the remains of his cigarette cartwheeling away into the darkness. <i>“Seriously, though. Not a big fan of poopers, and I know better than to be leaving a trail of bastards in my wake at this age.", parse);
		Text.NL();
		if(player.FirstBreastRow().Size() > 10) {
			Text.Add("Although I’ll say, I’ve always been partial to a good titfuck myself. Wouldn’t matter if it were a trap sporting them, since with tits, what you see is what you get, unlike some other things I’d rather not mention here and in present company.”</i> He runs his eyes over your [breasts] and sighs, his gaze turning to some distant point well beyond your shoulder.", parse);
			Text.NL();
			Text.Add("<i>“Look, I guess if you’re really determined, we can work something out. Ask me again when I’m nearing the end of my shift - maybe sometime after midnight, okay?”</i>", parse);
		}
		else {
			parse["b"] = player.FirstBreastRow().Size() > 5 ? " Well, maybe a passable one, but not a <b>good</b> one." : "";
			Text.Add("Now, I’ll admit that I do enjoy the occasional titfuck, since that fits both criteria, but you’ve got to admit not everyone has the assets for one.”</i> Vaughn cups his hands illustratively and smiles wryly. <i>“Wouldn’t matter if you slapped them onto something with a dick or two or three, since with tits, what you see is what you get and it’s no good whining; they’re honest that way, and I like it. And if I may be blunt: you don’t really have the kind of assets for a good titfuck.[b]”</i>", parse);
		}
		Text.NL();
		Text.Add("He really likes big tits, doesn’t he?", parse);
		Text.NL();
		Text.Add("<i>“Well, you know how there’s that saying where the first someone you fall in love with always ends up being the yardstick by which everyone else you’ll ever be with is measured? Yeah… sorta happened that way. I suppose it’s just something that won’t come off, like glue or a tick or something…”</i> he’s clearly rambling now, and you wonder if he isn’t doing just that to skirt around something he’d rather not bring up.", parse);
		Text.NL();
		parse["b"] = player.FirstBreastRow().Size() > 10 ? "" : " - I don’t care if you’ve to grow them yourself or what -";
		Text.Add("<i>“Look, the less said about this, the better. If you’re really that desperate to throw yourself at a has-been like me, then by all means, do so. Bring along a good plush pair[b] and I’ll consider it deeply. Now, what were we talking about when this came out of nowhere?”</i>", parse);
		
		TimeStep({minute: 30});
		
		VaughnScenes.Prompt();
	}
	else if(!vaughn.SexTime()) {
		Text.Add("<i>“Not here and now,”</i> Vaughn replies with a sigh and roll of his eyes. <i>“Taking a moment to chat is one thing, but quickies are frankly unsatisfying and the real deal takes far too long. Wouldn’t want to be literally caught with my pants down if something happened, aye?</i>", parse);
		Text.NL();
		Text.Add("<i>“Like I said, come back when I’m about to come off my shift, try for sometime after midnight. We’ll see about that then.”</i>", parse);
	}
	else {
		Text.Add("<i>“You sure are persistent, aren’t you? Not even Leon was that persistent when it came to -”</i> Vaughn catches himself mid-sentence, and shakes his head. <i>“What did you have in mind?”</i>", parse);
		
		//[Titfuck][T. Roleplay]
		var options = new Array();
		options.push({ nameStr : "Titfuck",
			tooltip : "Offer him a titfuck. That seems to be his thing.",
			func : VaughnScenes.SexTitfuck, enabled : true
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
		Gui.SetButtonsFromList(options, true, function() {
			Text.Clear();
			Text.Add("<i>“Bah, stringing a guy on like that,”</i> Vaughn grunts. <i>“Well, was there anything else you wanted, besides toying with me?”</i>", parse);
			Text.Flush();
			
			VaughnScenes.Prompt();
		});
	}
	Text.Flush();
}

VaughnScenes.SexTitfuck = function() {
	let player = GAME().player;

	var parse = {
	};
	
	Text.Clear();
	Text.Add("<i>“Fine. Let’s see if you remembered to bring what I asked you to the table.”</i>", parse);
	Text.NL();
	Text.Add("Turning a practiced eye upon your chest, he quickly assesses your assets - he’s obviously quite the experienced connoisseur when it comes to lady lumps.", parse);
	Text.NL();
	
	var breastSize = player.FirstBreastRow().Size();
	
	if(breastSize > 10) // E-cup
		VaughnScenes.SexTitfuckBig();
	else if(breastSize > 5) // C-cup
		VaughnScenes.SexTitfuckAverage();
	else {
		Text.Add("<i>“Well, seems like you don’t have the goods,”</i> he says drolly. <i>“Can’t have a titfuck without tits worth having, you know?”</i>", parse);
		Text.NL();
		Text.Add("You’re about the say that’s obvious, but then again, you were the one who asked for it…", parse);
		Text.NL();
		Text.Add("Vaughn pats you on the shoulder and turns his lips upwards in a sad smile. <i>“Everyone has their own particular tastes, and I’m no exception here. Since you’re the one throwing yourself at me, I get to set the house rules. Check back later when you’ve brought over a nice pair of tits, okay? Doesn’t have to be yours, or even real.</i>", parse);
		Text.NL();
		Text.Add("<i>“Now, if we could turn our attention back to important matters?”</i>", parse);
		Text.Flush();
		
		TimeStep({minute: 5});
		
		VaughnScenes.Prompt();
	}
}

VaughnScenes.SexTitfuckBig = function() {
	let player = GAME().player;
	let vaughn = GAME().vaughn;

	var parse : any = {
		playername : player.name,
		boygirl : player.mfFem("boy", "girl"),
		upperarmordesc : function() { return player.ArmorDesc(); },
		lowerarmordesc : function() { return player.LowerArmorDesc(); }
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	vaughn.flags["Sex"] |= VaughnFlags.Sex.Titfuck;
	
	Text.Clear();
	Text.Add("It’s a few moments before he’s able to speak again, an edge of raw emotion in his voice. <i>“All right, all right, I give. That <b>is</b> quite the rack you’ve got there, and it <b>would</b> be a pity for the both of us if it went unused. That’ll do, [playername]. That’ll do.”</i>", parse);
	Text.NL();
	Text.Add("Certainly not here and now, though, right?", parse);
	Text.NL();
	Text.Add("<i>“Of course not, although I somehow don’t think you’d mind if I did you right in the open. Come along, now.”</i>", parse);
	Text.NL();
	parse["l"] = player.HasLegs() ? "to your knees" : "downward"; 
	Text.Add("Without further ado, the fox-morph trots over to the other side of the watchtower, circling the wooden walls until he steps into a pocket of deep shadow, ushering you in along with him. Cast by the tower itself, it’s practically so dark that you can’t see your own fingers, although the lights of the camp proper are still visible in the distance. Of course, Vaughn is still there - you can hear his steady breathing in the darkness, feel his presence in the form of coarse fur and rugged warmth. Without warning, you find Vaughn’s hands on your shoulders, a firm, steady pressure urging you [l], and you’re only too willing to oblige.", parse);
	Text.NL();
	Text.Add("<i>“There’s a good [boygirl],”</i> Vaughn mutters as the sound of cloth rustling grow louder and a sudden sexual musk rises into the air, followed by a heavy, pulsing heat that erupts just under your chin. While you can’t see much in the near-complete darkness, you can definitely <i>feel</i> the damp, slick head of his foxhood as it trails across your [skin] for a second or two.", parse);
	Text.NL();
	Text.Add("<i>“There’s a good [boygirl].”</i>", parse);
	Text.NL();
	Text.Add("Without warning, hands are tugging hungrily, urgently at your [upperarmordesc], working it free with an insistent need. You’re more than willing to oblige, helping him out with the occasional shrug and squirm until your [breasts] eventually pop free of their constraints, cool night air caressing the ripe, pillowy mounds as your [upperarmordesc] falls about your waist.", parse);
	Text.NL();
	if(!vaughn.HaveDoneTerryRoleplay()) {
		Text.Add("<i>“Not as good as I remember it. Never as good,”</i> Vaughn mutters to himself wistfully - although you’re pretty sure the words weren’t meant for you. <i>“But still pretty damned fine nevertheless.”</i>", parse);
		Text.NL();
	}
	parse["lact"] = player.Lactation() ? Text.Parse(", a thin trickle of milk oozing freely down your [breasts] and dripping onto the ground", parse) : "";
	Text.Add("Slowly, his fingers make themselves known on your [breasts], pinpricks of warmth against cool air as they dance upon the soft surface, leaving trails of warmth in their wake as they work their way to your [nips]. Pausing to run circles around the areolae, Vaughn takes each of your nipples between thumb and forefinger, slowly rubbing them until they’re nice, fat and stiff[lact].", parse);
	Text.NL();
	Text.Add("Butterflies erupt in your stomach at the motion, filling your insides with a tingly, gooey sensation as he flips his palms and tickles the undersides of your nipples with his fingertips. The soft, intermittent touching is far more sensual and arousing than any rough pawing could ever be, and your breath catches in your throat as warmth blossoms in your breastbone.", parse);
	Text.NL();
	
	var gen = "";
	if(player.FirstCock())
		gen += "cock[s] grow stiff";
	if(player.FirstCock() && player.FirstVag())
		gen += " and ";
	if(player.FirstVag())
		gen += "[vag] begins wettening in earnest";
	parse["gen"] = Text.Parse(gen, parse);
	
	Text.Add("Unthinkingly, you thrust your chest forward, putting yourself on offer, hungry for more. While Vaughn’s hands aren’t large enough to be able to fully cup your lady lumps, he’s still able to run his palms across the entirety of their surface in a few broad strokes. The coarse fur on his hands runs rough over your flush, sensitive breasts and tender, engorged nipples, and you stifle a cry in your throat as your [gen].", parse);
	Text.NL();
	Text.Add("It’s only now that Vaughn starts turning up the heat: his fingers find purchase in your soft, plentiful boobflesh and begin kneading away in a steady rhythm - firm enough to have just the barest hint of discomfort to top off the pleasure with, but not enough to be actually painful. You tremble and moan unreservedly - you can’t remember the last time your [breasts] were so sensitive to touch, the flush of heat growing to fill the entirety of your chest with a fluid fullness.", parse);
	Text.NL();
	Text.Add("While you’re certainly well-endowed at the moment, there’s something about Vaughn’s tender caressing that makes them feel so <i>weighty</i>, so <i>ripe</i> - here in the darkness, it’s easy for your imagination to fill in the blanks with what your body is telling you, daydreaming of your plush mounds swelling and firming under his magical fingers.", parse);
	Text.NL();
	Text.Add("Vaughn’s maleness is near, too; you can smell its scent, more and more heated and intense as his own arousal grows. Every gentle squeeze has you desperately wishing there was a way for you to be further on display, even though you’ve always proffered yourself in whole, your back arched and tits thrust proudly forward.", parse);
	Text.NL();
	Text.Add("At last, though, he decides that you’re ready. Quick and nimble, his hands dart around to the underside of your full, heavy tits, cupping them and moving them into position. Instinctively, your hands take over from his, holding your [breasts] in place, and before you know it, the tip of his cock is pushing eagerly at your cleavage. Sure, your milk makers might be firm when squeezed like that, but Vaughn’s hard-on is positively <i>solid</i>, easily parting your boobflesh. Slick with pre that mixes in with your sweat, his glans trails across your bare breasts, seeking purchase in your cleavage before sinking in with a hard thrust and soft squelch.", parse);
	Text.NL();
	Text.Add("Clearly no stranger to the motions, Vaughn pumps steadily and powerfully in and out of your generous cleavage, saying little save for the occasional grunt of effort. Despite the fact that you’re using both hands to steady your [breasts], the motion is more than enough to set them jiggling; your achingly sensitive nipples scrape the fur of his legs more than once, eliciting soft moans from your lips. Pressed together to form a channel for him to fuck, your breasts are painfully aware of every ridge and vein on his girthy manhood, the slapping of his swelling knot against their top and that of his generous balls below.", parse);
	Text.NL();
	Text.Add("Slowly, his hands - those wonderful hands - come to rest on your shoulders for support, and Vaughn’s thrusts come wilder and faster as he picks up the pace. Supporting is no longer enough - you’re practically squeezing your [breasts] together in a bid to contain the enthusiastic fucking they’re receiving, each pulse and throb of Vaughn’s manhood keenly felt by your tender breasts and aching nipples. Heat rises from your enthusiastic lovemaking to caress your face, and his breath comes in ragged gasps as he tries to pick up the pace even more, pounding away with wild abandon.", parse);
	if(player.Lactation())
		Text.Add(" Small squirts of milk accompany his frantic movements as the pressure against your [breasts] grows; it’s almost as if you’re being purposefully milked in the most unorthodox manner.", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“Spirits above, Sabrina,”</i> Vaughn groans, just on the edge of your hearing. <i>“Fucking your beautiful breasts always feels amazing - I bet even Aria herself couldn’t compare. I want to stay like this for-fucking-ever.”</i>", parse);
		Text.NL();
		Text.Add("Wait… is he calling out someone else’s name while fucking you?", parse);
		Text.Flush();
		
		//[Confront][Let it go]
		var options = new Array();
		options.push({ nameStr : "Confront",
			tooltip : "Stop right there. Is he fantasizing about someone else?",
			func : VaughnScenes.SexConfront, enabled : true
		});
		options.push({ nameStr : "Let it go",
			tooltip : "Just let him have his way, the poor thing.",
			func : function() {
				Text.Clear();
				Text.Add("You consider stopping right now and asking Vaughn about it, but decide not to ruin the moment with your little hold-up. So what if he’s dreaming about someone else while fucking your tits - are you going to try and control what he thinks? What sort of petty control freak would you be, then?", parse);
				Text.NL();
				Text.Add("Nah, best to let it go and enjoy this titfuck to the fullest. If the pretense gives Vaughn some relief and a little happiness, who are you to deny him that?", parse);
				VaughnScenes.SexTitfuckBigCont(parse);
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}, 1.0, function() { return !vaughn.HaveDoneTerryRoleplay() && !vaughn.Confronted(); }); //TODO CHECK LOGIC. MAYBE REMOVE TERRY ROLEPLAY (IF IT DEPENDS ON CONFRONT)
	scenes.AddEnc(function() {
		Text.Add("<i>“Have to… admit,”</i> Vaughn groans in between breaths. <i>“You’re pretty good, [playername]. Pretty damned good, and that’s… a lot, coming from me.”</i>", parse);
		VaughnScenes.SexTitfuckBigCont(parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
}

VaughnScenes.SexTitfuckBigCont = function(parse : any) {
	let player = GAME().player;
	let vaughn = GAME().vaughn;

	Text.NL();
	Text.Add("With the way his shaft is twitching in between your milk makers, it’s clear that he’s going to cum soon. Closing your eyes, you arch yourself backwards as far as you dare, surrendering to the sheer pleasure emanating from your chest in those last few moments with Vaughn’s cock twisting in your cleavage, clearly trying to knot you.", parse);
	Text.NL();
	Text.Add("Then it comes.", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("Vaughn does his best to stifle the shout that accompanies his release, but only manages to turn it into a muffled grunt. Before you know it, he’s painting you with his seed - copious gobbets of thick, hot spunk hit your face with force, getting all over your mouth and eyes. Thick and sticky, the liquid warmth oozes down your cheeks and chin; it gushes thickly over your forehead and lips, creeping down your neck before dripping off onto your [breasts] and the ground.", parse);
		Text.NL();
		Text.Add("You take a moment to savor the sheer delight of being coated in seed, then wipe yourself off the the back of your hand. Not that you won’t need a proper wash-up later on, but at least you won’t be oozing all over the place.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("With a long, frustrated groan of release, Vaughn sends a flood of thick, potent seed erupting from the tip of his cock, thoroughly inseminating the entirety of your chest. The nook of your cleavage fills up in seconds, and then the hot, quivering spunk overflows outward, coating the outsides of your pillowy mounds; you have to bite back a cry of delight as the slippery warmth reaches your nipples, gliding over them before sliding down to your [belly].", parse);
		Text.NL();
		Text.Add("Despite how much cum he’s already dumped onto you, his balls still haven’t emptied - more and more and more just keeps coming, and you can’t help but wonder in the back of your mind just how long he’s been pent up for.", parse);
		Text.NL();
		Text.Add("Slowly, though, the torrent slows to a stream, and the stream to a dribble. Your [breasts] and [belly] are utterly swamped in a thick coat of Vaughn’s seed - it almost seems a hopeless task to try and clean yourself up like this, but you try anyway.", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.Add("His breathing heavy and movements trembling, Vaughn withdraws his still-solid manhood from your breasts with one final yank, and you hear the sound of flesh and cloth hitting wood.", parse);
	Text.NL();
	Text.Add("<i>“Fuuck,”</i> he pants.", parse);
	Text.NL();
	Text.Add("See? Now, is he going to admit that you were right - that he needed a bit of relief, that’s all?", parse);
	Text.NL();
	Text.Add("The only reply you get is a half-growl, half-whine. The air is redolent with the scent of sex and sweat, and even in the darkness you can feel Vaughn’s gaze on you - or at least, where he thinks you should be. Slowly, you do up your [upperarmordesc] while he recovers, waiting for him to make the next move.", parse);
	Text.NL();
	Text.Add("He doesn’t; the words, when they come, are slow and hesitant. <i>“Just give me a little alone time, okay? Sun’s almost up, you should go get cleaned up and all. I’m still expected here for a bit… probably see you at sundown earliest.”</i>", parse);
	Text.NL();
	Text.Add("He’s just going to shoo you away like that?", parse);
	Text.NL();
	Text.Add("<i>“Duty calls… you know.”</i>", parse);
	Text.NL();
	Text.Add("Well, fine. Did he at least enjoy himself?", parse);
	Text.NL();
	if(!vaughn.HaveDoneTerryRoleplay())
		Text.Add("Now <i>that</i> gets him all clammed up. Seems like there really isn’t anything you can do about his situation for now… more’s the pity, then. Deciding to follow Vaughn’s advice, you quickly rise and nip off in search of a proper clean-up before your tacky condition’s exposed by the sun.", parse);
	else {
		Text.Add("He smiles exhaustedly. <i>“Yeah, sure did. I’ll be fine, really. You just go on ahead and do your thing, and don’t let an old man like me hold you back.”</i>", parse);
		Text.NL();
		Text.Add("Well, if he insists. You quickly rise and nip off in search of a proper wash-up, preferably before the sun rises proper.", parse);
	}
	Text.Flush();
	
	player.AddSexExp(2);
	player.AddLustFraction(.5);
	
	TimeStep({hour: 1});
	
	Gui.NextPrompt();
}

VaughnScenes.SexTitfuckAverage = function() {
	let player = GAME().player;
	let vaughn = GAME().vaughn;

	var parse : any = {
		playername : player.name,
		boygirl : player.mfFem("boy", "girl"),
		upperarmordesc : function() { return player.ArmorDesc(); },
		lowerarmordesc : function() { return player.LowerArmorDesc(); }
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	vaughn.flags["Sex"] |= VaughnFlags.Sex.Titfuck;
	
	Text.Clear();
	Text.Add("The long silence that follows is awkward and anything but encouraging. The blatant way Vaughn is studying you is reminiscent of a housewife watching the scales at market, and you - well, it wouldn’t be wrong to say that you <i>did</i> put yourself on sale in a sense.", parse);
	Text.NL();
	Text.Add("<i>“I’ll be blunt. Less than satisfactory in terms of what I have to work with, but I won’t stop you if you insist on it.”</i>", parse);
	Text.NL();
	Text.Add("Does he have to be so insulting about it? It’s almost as if he’s purposefully trying to drive you away - <i>is</i> he trying to get you to storm off in a huff? Looking up at Vaughn, the fox morph’s face has assumed a careful, guarded expression of utter blankness - one which some might call a “cavalcade face”.", parse);
	Text.NL();
	Text.Add("Yeah… that lack tells you what you need to know. He’s hiding something, but this probably isn’t the time to confront him about it.", parse);
	Text.NL();
	Text.Add("<i>“Well? Got nothing to say? Too pissed off at me to speak? I’ll be going, then.”</i>", parse);
	Text.NL();
	Text.Add("No, not so fast! You just needed a little time to think, that’s all.", parse);
	Text.NL();
	Text.Add("Shaking his head, Vaughn peels your hand off his shoulder. <i>“So, I really can’t get rid of you, eh? You’re really bloody persistent, you know that?”</i>", parse);
	Text.NL();
	Text.Add("And proud of it.", parse);
	Text.NL();
	Text.Add("A sigh. <i>“Fine, fine. Let’s get somewhere out of the way. Wouldn’t want to create any more of a scene than we already have, would we?”</i>", parse);
	Text.NL();
	Text.Add("With that, Vaughn leads you around to the other side of the watchtower, its long, dark shadow consuming the both of you to the point where you can’t see a thing. Nevertheless, his grip on your wrist is firm and insistent, and you follow him into a muted corner. From here, you can see the lights of the outlaw camp proper in the distance, but are safely shrouded from prying eyes in the darkness.", parse);
	Text.NL();
	Text.Add("Which is just how Vaughn wants it - without a word, he pushes down firmly on your shoulders, urging you down in front of him. You’re only more than willing to obey, and let out a soft sigh as there’s a rustle of cloth and a sudden surge of sexual musk fills the air. Instinctively, you reach out for the masculine heat that fills the air before you, and your fingers close about Vaughn’s girthy shaft, still slick from its sheath. It stiffens and engorges in your hand, a process that only quickens from your touch, and soon it’s powerfully hard as it throbs and pulses in your palm, each ridge and vein distinct to your skin as your hand explores its length.", parse);
	Text.NL();
	Text.Add("Before you know it, his own hands are off your shoulders and at your [breasts], roughly caressing them through your [upperarmordesc]. Even without needing to see them, you know Vaughn’s rough hands are no stranger to hard work and manual labor - the coarse fur and tough skin of his palms send shivers running down your front as he ham-fistedly gropes you without shame. There’s power in those callused fingers all right - restrained power that’s proven as he easily loosens your [upperarmordesc] and strips you down to your waist, leaving your milk makers exposed to the cool night air.", parse);
	Text.NL();
	Text.Add("Psht. Not to be outdone, you pump your fingers up and down rhythmically, seeking to jerk him off. The base of your hand brushes against Vaughn’s weighty balls, and you feel them tighten involuntarily at your attentions. Nevertheless, he quickly moves a hand to catch your wrist and stop you cold.", parse);
	Text.NL();
	Text.Add("<i>“Don’t get ahead of yourself,”</i> he whispers before letting go. <i>“Plenty of time to get things done the proper way.”</i>", parse);
	Text.NL();
	Text.Add("Of course, that leaves the question of what the ‘proper way’ is, but fine, if that’s the way he wants it. You settle for just holding Vaughn’s meaty shaft in place while he works on your [breasts], his hands working their bases while he moves his hips such that the bulbous head of his cock rubs against each of your nipples in turn, leaving a hot, musky layer of pre-cum on the sensitive nubs of flesh. Working in tandem, his hands and shaft send waves of pleasure cascading through your lady lumps, and you unthinkingly arch your back and thrust out your chest in response, a clear invitation for more of what he’s doing.", parse);
	Text.NL();
	parse["l"] = player.Humanoid() ? ", your thighs rubbing against each other as you kneel before him" : "";
	Text.Add("Despite his raging, throbbing erection and labored breathing - clear signs of his growing lust - Vaughn still has plenty of control over himself. Assisted by the occasional brush of his manhood, his fingers ply up and down your [breasts], occasionally lingering on your areolae and drawing slow, languid circles. His touch sends a constant stream of tingles into your body and you moan aloud[l].", parse);
	if(player.FirstVag())
		Text.Add(" Unable to restrain yourself any longer, you reach into your [lowerarmordesc] with a hand and part the petals of your womanly flower, pumping your fingers in and out of its heat until the urgent need fades to more bearable levels.", parse);
	Text.NL();
	Text.Add("In near-complete darkness, it’s easy to fantasize about what your body is telling you - the flush of heat rushing outward from your chest to fill your [breasts], how full and heavy they feel at the moment, how painfully hypersensitive they are - Vaughn’s manhood is now slapping against your [breasts] as his hips buck back and forth. There’s a momentary surge of warmth as his thickset cock tip presses against your cleavage - before you know it, he thrusts and the entirety of his cock slides between your [breasts], lubricated with an arousing mixture of sweat and pre.", parse);
	Text.NL();
	Text.Add("Right, so <i>this</i> is the ‘proper way’, if how he’s behaving is any indication of his approval. Grabbing the underside of your [breasts] to support them, you squeeze your lady lumps about Vaughn’s girthy man-meat as best as you can. Although you’re far from flat-chested, you can feel you simply don’t have enough in the way of volume to give him a comfortable titfuck, and try your best to compensate by rolling and kneading your breasts about his shaft, moving your body up and down to slide his erection through your cleavage.", parse);
	Text.NL();
	Text.Add("On his part, Vaughn works enthusiastically away at making love to your tits, his rough, powerful hands moving once more to your shoulders as he steadies himself. Balls slapping against your tits, his shaft quivering with the copious energy of his fucking, the fox-morph pounds away at you with unparalleled vigor. Giving in to the display of raw energy, you cry out as you feel the heat of his thick cock dive in and out of your cleavage, easily spearing it through with each movement of his hips; it’s all you can do to hold on tight to your [breasts] and support their quivering mass through the ferocious fucking they’re receiving.", parse);
	if(player.Lactation()) {
		parse["l"] = player.Humanoid() ? "your knees" : "the ground";
		Text.Add(" Coaxed forth from all the activity, dribbles of milk ooze from your nipples to run down your fingers and drip onto [l].", parse);
	}
	Text.NL();
	parse["c"] = player.FirstCock() ? Text.Parse(" and cock[s] stiff", parse) : "";
	Text.Add("Made sensitive and delicate from Vaughn’s rough groping, you’re treated to a medley of exquisite sensations, each one more intense than the last. Your breath is heated, your jaw slack[c], and it’s all you can do to keep yourself from collapsing onto the ground as your eyes roll back into your head from the sheer exhilaration of it all.", parse);
	Text.NL();
	Text.Add("Vaughn let out a grunt followed by a long stretched out groan; his shaft seems to swell between your [breasts] for a moment, and you quickly realize he’s going to orgasm all over you.", parse);
	Text.NL();
	Text.Add("And he does. Without warning, an enormous load spews forth from Vaughn’s manhood, utterly drenching ", parse);
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("your modest breasts in copious amounts of his baby batter. String after string of hot, sticky seed splatters onto your [skin] and pools in your cleavage until your [breasts] are thoroughly drenched. The warm flow quickly moves to coat the entirety of your chest with its slippery goodness, then moves on to your [belly] in a rich, gooey waterfall.", parse);
		Text.NL();
		Text.Add("Just how much seed do his balls hold? Far too much to be humanly possible - or maybe it’s just your mind playing tricks on you in the darkness, making you misjudge just how long blast after blast of cum founts onto your breasts. A heady, slightly salty smell surrounds you, and your heart skips a beat.", parse);
		Text.NL();
		Text.Add("All good things must come to an end, though. Streams turn to splatters, which in turn become dribbles. Utterly spent, Vaughn sags against you for a second or so, but quickly rights himself and withdraws his cock from your [breasts].", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("your face with glorious amounts of his baby batter. Fired in quick succession, shot after shot of hot fox cum blasts from his cock to land squarely on your face - on your forehead, your cheeks, your lips. You have to open your mouth to breathe, and naturally, some of his seed gets in and onto your tongue, hot and salty. It’s not exactly foul, but neither is it titillating, either; you’d much rather have it <i>on</i> you rather than <i>in</i> you.", parse);
		Text.NL();
		Text.Add("From your face onto your [breasts], then from your lady lumps onto your [belly], the torrent of cum that’s directed on you seems never-ending. It’s almost like having a bath, only much warmer and stickier and you have to concentrate on actually getting air into you - a task made more difficult by the haze of pleasure that swirls about you in the darkness.", parse);
		Text.NL();
		Text.Add("You don’t rightly remember the next few moments, but when your senses do come back to you you’re soaked and dripping all over, your [armor] utterly ruined by all the seed that’s on it. No point in trying to clean yourself up like this, not when you’re practically standing in a pool of the stuff.", parse);
		Text.NL();
		Text.Add("Gee, how pent-up <i>was</i> this guy anyway?", parse);
		Text.NL();
		Text.Add("Vaughn himself must be satisfied with the facial he’s given you, for he shudders and pulls his hips away from you, withdrawing his still-hard shaft with a squelch.", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.NL();
	Text.Add("<i>“Gah,”</i> he groans after a moment’s heavy breathing. <i>“That was…”</i>", parse);
	Text.NL();
	Text.Add("Amazing? Mind-blowing? Incredible?", parse);
	Text.NL();
	Text.Add("<i>“Passable.”</i>", parse);
	Text.NL();
	Text.Add("Only passable? After he’s completely and utterly spent himself on you? Come on, you know you’re better than that.", parse);
	Text.NL();
	Text.Add("<i>“You can have… the best wine in the world, but that doesn’t mean… a whit to someone who doesn’t drink. Like our old sawbones, for one.”</i>", parse);
	Text.NL();
	Text.Add("Hrrmph. And just what was lacking?", parse);
	Text.NL();
	Text.Add("<i>“Could do with bigger tits,”</i> Vaughn replies bluntly.", parse);
	Text.NL();
	Text.Add("Well, if he’s going to be like that…", parse);
	Text.NL();
	Text.Add("<i>“You asked. I answered.”</i> There’s a shuffle of feet in the darkness, and you hear a soft thud of flesh against wood. <i>“You know, maybe you ought to be going. Sun’s going to be coming up soon, and I can guess at how you’re looking at the moment. You probably want to get properly cleaned up before showing your face to others.”</i>", parse);
	Text.NL();
	Text.Add("And him? He’s just going to stay here?", parse);
	Text.NL();
	Text.Add("<i>“I need… I need a moment. To catch my breath and… recover. You’d make better time without waiting on me.”</i>", parse);
	Text.NL();
	Text.Add("Hah, so he’s just looking for an excuse to send you away after you’re done. Fine. Did he at least enjoy himself?", parse);
	Text.NL();
	if(vaughn.HaveDoneTerryRoleplay()) {
		Text.Add("<i>“It was alright.”</i> You note that he doesn’t look you in the eye when saying it. <i>“Given what you had to work with, that is.”</i>", parse);
		Text.NL();
		Text.Add("You do suppose he’d like it if you were sporting a better rack the next time you dropped by, would he?", parse);
		Text.NL();
		Text.Add("<i>“Hey, I hear there’s a potion for everything these days. Might want to consider it, you know. Anyways, sun’s coming up soon. I’m sure you don’t want to be seen walking around without getting cleaned up first.”</i>", parse);
		Text.NL();
		Text.Add("Yeah, he’s right. Rising, you quickly nip off in search of a wash-up before it’s too late.", parse);
	}
	else {
		Text.Add("Now <i>that</i> gets him all clammed up. Seems like there really isn’t anything you can do about his situation for now… more’s the pity, then. Deciding to follow Vaughn’s advice, you quickly rise and nip off in search of a proper clean-up before your tacky condition’s exposed by the sun.", parse);
	}
	Text.Flush();
	
	player.AddSexExp(2);
	player.AddLustFraction(.3);
	
	TimeStep({hour: 1});
	
	Gui.NextPrompt();
}

// Confront Vaughn about calling you Sabrina
VaughnScenes.SexConfront = function() {
	let player = GAME().player;
	let vaughn = GAME().vaughn;

	var parse = {
		playername : player.name
	};
	parse = player.ParserTags(parse);
	
	Text.Clear();
	Text.Add("Whoa, whoa, whoa. Wait just a minute there. Did he just call you Sabrina? It takes some strength of will, but you tear your mind off the titfuck you’re giving Vaughn and look up at him. His eyes are closed, and little yips and moans escape his muzzle as he continues fucking your [breasts] - well, first thing is to get his attention. With a jerk of your body, you pull your sweaty breasts away from his shaft, leaving its girthy length exposed to the cool night air. You can see it twitch and pulse, a dribble of seed leaking its way from the tip as it desperately tries to find that warm, snug place to thrust in once more. Slowly, you back away from the shadow of the watchtower such that there’s at least a little dim light to see by, even if it’s still unlikely that anyone will spy the both of you from a distance.", parse);
	Text.NL();
	Text.Add("The spell broken, Vaughn’s eyes flick open, and he rounds on you in a mixture of both anger and upset. <i>“Hey! Why’d you pull away?”</i>", parse);
	Text.NL();
	Text.Add("There are some things you need to talk to him about.", parse);
	Text.NL();
	Text.Add("The corner of Vaughn’s mouth twists. <i>“Seriously, are you kidding me? You throw your rack straight in my face and get me to give in and fuck you, and now you’re trying to blueball me? What the fuck is this?”</i>", parse);
	Text.NL();
	Text.Add("It’s where you’re asking him just why he’s crying out someone else’s name when his cock is buried in your rack, that’s all.", parse);
	Text.NL();
	Text.Add("<i>“Why, you got a problem with that? I was just indulging in a little fantasy while fucking, that’s all. Don’t tell me you’ve never done it before.”</i>", parse);
	Text.NL();
	Text.Add("It’s got to be a problem when the name he’s shouting for all to hear is that of his lost fiancee. Surely he can see what’s wrong with that?", parse);
	Text.NL();
	Text.Add("<i>“No.”</i>", parse);
	Text.NL();
	Text.Add("Really?", parse);
	Text.NL();
	Text.Add("<i>“I get my work done on time, don’t mope around, treat my folks decently, and even if I’m not the biggest bestest friend to everyone in the whole damned camp, I’d like to think I’m bearable to have around. So yeah, if I want to dream that the tits I’m fucking belong to Sabrina, then that’s my fucking business. Why, are <b>you</b> so bloody insecure that hearing another name during a quick fuck is going to turn your world upside-down? You’re not my wife, [playername], thank fucking Aria for that small mercy, because that spot’s already taken.”</i>", parse);
	Text.NL();
	Text.Add("So, despite all his protestations to the contrary, he hasn’t moved on. And he can’t hide it forever - it <i>is</i> tearing him apart, even if it’s not all at once. Sooner or later, he’s got to deal with the problem, and running away from it like he has been has only made things worse down the line. Sure, you’ve no doubt that he can get no end of one night stands, but when’s the last time in the past twenty years that he’s actually managed to keep a steady relationship? He’s damaged goods, and even if it may be no fault of his own, he’s got to fix himself.", parse);
	Text.NL();
	Text.Add("Vaughn spits on the ground. <i>“Answer my questions, damn you.”</i>", parse);
	Text.NL();
	Text.Add("Not when those questions are trying to draw you away from the point at hand. First step to solving a problem is admitting that there’s a problem. Letting go isn’t going to be easy, but he’s got to dump the baggage.", parse);
	Text.NL();
	Text.Add("No reply. Vaughn just stands there, his breath coming in ragged gasps, his shoulders heaving. You wonder if you should say something, provoke a response out of him, but then he grabs his slowly softening dick and shoves it back in his pants - not an easy task - and storms away from you, soon turning around a corner and disappearing from sight.", parse);
	Text.NL();
	Text.Add("Gee, this sure went well… but you’re sure that you made the right decision. Entertaining Vaughn’s fantasy might have been the easy way out, but it wouldn’t been good for anyone in the long run. It’s probably fine to let him fume for a while, but you ought to talk to him again tomorrow evening once he’s calmed down somewhat. Maybe he’ll be less defensive and more open to reason then…", parse);
	Text.Flush();
	
	vaughn.flags["Talk"] |= VaughnFlags.Talk.Confront;
	
	StepToHour(6);
	
	Gui.NextPrompt();
}

//Trigger this when the player next approaches Vaughn in the outlaws’ camp.
VaughnScenes.ConfrontFollowup = function() {
	let vaughn = GAME().vaughn;

	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Spotting Vaughn in his usual spot by the gates, you surreptitiously watch him from afar, trying to gauge the fox-morph’s mood. It’s a little hard, considering he’s wearing his usual stoic face, and - what the heck, you’re just making up excuses for you to put off finishing this. Putting on your sternest expression, you stride up to where he’s standing.", parse);
	Text.NL();
	Text.Add("The two of you eye each other for several moments, then it’s Vaughn who speaks. <i>“Look, about that -”</i>", parse);
	Text.NL();
	Text.Add("You shouldn’t have pushed that hard, yes, but you still stand by the points you made.", parse);
	Text.NL();
	Text.Add("<i>“Yeah. Fine. Not that I still don’t think it was a low blow, but I should be used to those by now. Anyways, I went ahead and slept on it, and… like it or not, you’re right.”</i>", parse);
	Text.NL();
	Text.Add("Huh, now that’s something more people could stand to say more often.", parse);
	Text.NL();
	Text.Add("<i>“Don’t get full of yourself,”</i> Vaughn continues with a scowl. <i>“I know the whole talk by now, all right? Let it go, move on, your time is running out, plenty more girls on the girl tree, that kind of stuff, okay? Knowing something in your head is one thing, following it is another; it’s not as if my head is the only part of me which has anything to do with it.”</i>", parse);
	Text.NL();
	Text.Add("As opposed to his other head?", parse);
	Text.NL();
	Text.Add("<i>“Oh ha ha, very funny. I’m trying to be serious here, and you go make a stupid joke. You damn well know perfectly what I mean.”</i>", parse);
	Text.NL();
	Text.Add("All right, you’re sorry. You were just trying to lighten the mood a little.", parse);
	Text.NL();
	Text.Add("Vaughn glares at you. <i>“Just… just don’t do it again. Please. I’ve been trying to let go for a while now, at least since I felt secure enough in this place that I wouldn’t end up on the road again. In some ways… it’d have been better if I knew for sure Sabrina were dead. If she made it to, say, the highlands or the Free Cities, I could reasonably assume that she was alive. But with what happened? She could be alive which would be good, she could be dead which would be a blow.</i>", parse);
	Text.NL();
	Text.Add("<i>“As long as she’s missing, I’m experiencing both sides of this. Hope that she still lives, dread that she’s dead. And I’m not hoping that fate is going to be so kind as to provide me with closure any time soon.”</i>", parse);
	Text.NL();
	Text.Add("He does know that if she’s still alive -", parse);
	Text.NL();
	Text.Add("<i>“I <b>know</b>, damn it. What sort of idiot thinks that a woman is going to wait for him twenty years, when it’s far more likely she’ll spread her legs for another guy twenty minutes after she thinks her previous squeeze’s croaked? I know I need to move on. I know how to move on. Actually doing it is a lot harder than saying it. And when you just stop in the middle of a titfuck to give me a high and mighty lecture on something I’ve been struggling with, it makes a man more than a little pissed, you know?”</i>", parse);
	Text.NL();
	Text.Add("If he’s been struggling with this for that long without any success, then it’s more than likely that he can’t do this alone. There’s no shame in getting a little help where it’s warranted.", parse);
	Text.NL();
	Text.Add("Silence. Then Vaughn looks away and snorts. <i>“Well, got any ideas?”</i>", parse);
	Text.NL();
	Text.Add("No, not at the moment, but you’ll let him know if you come up with something.", parse);
	Text.NL();
	Text.Add("<i>“Good luck cooking something up I haven’t already tried before.”</i>", parse);
	Text.NL();
	Text.Add("But if you <i>do</i>, he’ll have to try in earnest, okay?", parse);
	Text.NL();
	Text.Add("Vaughn mumbles something that’s neither here nor there, then sighs and lets his shoulders sag. <i>“Fine. Can we talk about something else now?”</i>", parse);
	Text.Flush();
	
	vaughn.flags["Talk"] |= VaughnFlags.Talk.ConfrontFollowup;
	
	TimeStep({hour: 1});
	
	VaughnScenes.Prompt();
}

export { VaughnScenes };
