/*
 * 
 * Define Vaughn
 * 
 */
function Vaughn(storage) {
	Entity.call(this);

	// Character stats
	this.name = "Vaughn";
	
	this.body.DefMale();
	this.SetSkinColor(Color.brown);
	this.SetHairColor(Color.brown);
	this.SetEyeColor(Color.brown);
	
	this.body.SetRace(Race.Fox);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = 0;
	this.flags["Talk"] = 0;
	
	if(storage) this.FromStorage(storage);
}
Vaughn.prototype = new Entity();
Vaughn.prototype.constructor = Vaughn;

Vaughn.Met = {
	NotAvailable : 0,
	Met : 1
	//TODO: tasks
};

Vaughn.prototype.Met = function() {
	return this.flags["Met"] >= Vaughn.Met.Met;
}

Scenes.Vaughn = {};

Vaughn.prototype.FromStorage = function(storage) {
	// Load flags
	this.LoadFlags(storage);
}

Vaughn.prototype.ToStorage = function() {
	var storage = {
	};
	
	this.SaveFlags(storage);
	
	return storage;
}


Vaughn.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
}

// Schedule
Vaughn.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Outlaws.Camp)
		return (world.time.hour >= 18 || world.time.hour < 6);
	return false;
}

Vaughn.prototype.OnTask = function() {
	return false; //TODO
}


//TODO link
//Trigger after having completed either outlaws into Rigard OR after Belindaquest has been done (in the case the PC ignores the outlaws all the way up till then).
//Also requires that player have access to castle grounds.
//#unlock Vaughn in outlaws camp menu. He will be available from 6 pm to 6 am.
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

//TODO LINK
Scenes.Vaughn.CampApproach = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	if(vaughn.OnTask()) {
		//TODO: Need to account for correctly completed tasks
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
