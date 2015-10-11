
Scenes.Isla = {};


function Isla(storage) {
	Entity.call(this);
	this.ID = "isla";

	// Character stats
	this.name = "Isla";
	
	// TODO: Set body
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 6;
	this.Butt().buttSize.base = 4;
	this.body.SetRace(Race.Ferret);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.Ferret, Color.brown);
	
	this.flags["Met"] = 0;

	if(storage) this.FromStorage(storage);
}
Isla.prototype = new Entity();
Isla.prototype.constructor = Isla;

Isla.Met = {
	NotMet : 0,
	Met    : 1
};

/* TODO
Isla.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
}
*/

Isla.Available = function() {
	return asche.flags["Tasks"] & Asche.Tasks.Spring_Visited;
}

Isla.prototype.FromStorage = function(storage) {
	//this.LoadPersonalityStats(storage); TODO
	
	// Load flags
	this.LoadFlags(storage);
}

Isla.prototype.ToStorage = function() {
	var storage = {
	};
	
	//this.SavePersonalityStats(storage); TODO
	
	storage.flags   = this.flags;
	
	return storage;
}

// Schedule
Isla.prototype.IsAtLocation = function(location) {
	return true;
}


//SCENES

Scenes.Isla.Introduction = function() {
	var parse = {
		
	};
	
	isla.flags["Met"] = Isla.Met.Met;
	
	Text.Clear();
	Text.Add("As you explore the highlands, you find yourself in the general area of the strange spring Asche sent you to investigate last time. Yes, there’s the mountainside, and if you strain your eyes a little, you can make out the plateau on its side. Last time, you were there on business, and as they say, going somewhere on your own time is bound to be plenty different than going someplace on business… at least this time you’ll get to see the sights.", parse);
	Text.NL();
	Text.Add("The mountain trail is as treacherous as you remember it being, but you manage to struggle up the steep slope with but a few minor scrapes from a thorny bush. At last, the ground levels out, and you’re greeted with the sight of the spring plateau once again. Yeah, it’s definitely more peaceful now that you’re not under pressure to get a job done or stay hidden… and neither is the husky trio anywhere to be seen.", parse);
	Text.NL();
	parse["dt"] = world.time.LightStr("warm sunlight", "cool moonlight");
	Text.Add("Seems like you have the whole place to yourself, then! Bathed in [dt], you take a good look around the spring plateau’s flat, wide expanse - there really aren’t many places for anything to hide, save the tall grass, and it really does lend a sense of safety to the place in that you’ll be able to see anything or anyone coming at you from quite some distance.", parse);
	Text.NL();
	Text.Add("Something near the west end of the plateau catches your eye, and you wander over to take a closer look. Surprisingly, there’re signs of life to be had - a simple shelter stands over a cave mouth, wood tied together with twine, a fire pit dug out in front, the ashes gathered at its bottom still not more than a couple of days old at most. Yeah, someone lives here, but it looks like he or she isn’t in at the moment…", parse);
	Text.NL();
	Text.Add("<i>“Oy! You down there!”</i>", parse);
	Text.NL();
	Text.Add("You turn your gaze up the cliff face to see who it is who’s hailing you, and perched precariously on a high ledge is a mustelid girl of some sort… or it could be a really pretty boy. It’s quite hard to tell at this distance, and his? Her? body shape is quite ambiguous. What isn’t ambiguous, though, is the dark pelt of fur she’s sporting, crisscrossed with intricate knotwork figures of bright red and blue body paint. The only actual clothes she’s wearing is a simple loincloth about her waist, but the paint more than makes up for any lack of clothing on her.", parse);
	Text.NL();
	Text.Add("Slowly, she reaches for the quiver slung across her back, then thinks better of it and lets her slender arm fall to her side, her braided hair falling across a shoulder. <i>“Who’re you?”</i>", parse);
	Text.NL();
	Text.Add("Well, she doesn’t seem immediately hostile, so you step towards the foot of the cliff and introduce yourself. Now able to get a closer look at the newcomer, you’re pretty sure she’s a girl, despite her lean, boyish frame, and… you’re not completely sure, but she looks like a sable. Either that, or a really dark-furred marten. Your introduction must’ve satisfied her, for she gives you a nod and begins climbing down the sheer cliff face as if it were no more than a ladder, easily dropping onto the grassy ground beside you.", parse);
	Text.NL();
	Text.Add("<i>“Sorry about that,”</i> she says, reaching around to pat the quiver and bow on her back. </i>“I just got a bit… excitable. No one ever really comes up here save for troublemakers, and you were sniffing around just a little too close for comfort.”</i>", parse);
	Text.NL();
	Text.Add("This place’s hers?", parse);
	Text.NL();
	Text.Add("<i>“Well, it’s mine for now. Before me, it belonged to the last spring guardian, and the last one before that, and the last one… yeah, as I said, it’s mine for now. ‘Fore I forget, though… name’s Isla. Why’re you here, anyway?”</i>", parse);
	Text.Flush();
	
	world.TimeStep({hour: 1});
	
	//[Lost][Curious][Spring]
	var options = new Array();
	options.push({ nameStr : "Lost",
		tooltip : "Tell her you got lost and stumbled upon this place.",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Lost? You’re a long way from any of the proper roads, friend - or at least, what passes for roads in the highlands. Just how long have you been wandering around?”</i>", parse);
			Text.NL();
			Text.Add("You’re not sure, you reply. You’ve been walking for some time, trying to keep in a straight line, then you saw a trail that looked like it might lead to a road - or at least, somewhere where there might be people who could direct you to one.", parse);
			Text.NL();
			Text.Add("<i>“Well, you got that second part down right, at least.”</i> Isla replies, eyeing you up and down. <i>“Pah, you look too poorly to be much of a threat, unlike those three troublemakers. If you’ve been meandering around for as long as you say you’ve been, it wouldn’t be in good conscience to just send you down without at least something to drink.”</i>", parse);
			PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Curious",
		tooltip : "Tell her you saw the plateau from afar and went to investigate.",
		func : function() {
			Text.Clear();
			Text.Add("Isla raises an eyebrow at you, her tiny black nose twitching as she sniffs in mild distaste. <i>“Oh, come on. There’re hundreds of little pools in the highlands, and you chose this particular one to take a look-see at?”</i>", parse);
			Text.NL();
			Text.Add("It’s pretty high up here, the air’s good, and you were passing by, anyway. It’s not as if you knew this place was inhabited until you saw her little camp.", parse);
			Text.NL();
			Text.Add("<i>“Psh, lowlanders. No sense of danger at all - see something pretty, and then risk life and limb to go take a gander at it. If you were from around here, I’d accuse you of lying, but this is so ridiculous that it’s hard to deny it. Even those three troublemakers can cook up a better excuse than that, and all they’ve got in their brains is air.”</i> She looks you up and down and sighs. <i>“Well, guess you must be thirsty. You look too poorly to be much of a threat at the moment - wouldn’t send you down the trail in good conscience without offering a drink first.”</i>", parse);
			PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "Spring",
		tooltip : "There was this spring you were looking for…  ",
		func : function() {
			Text.Clear();
			Text.Add("Honesty is the best policy, you guess. You tell Isla that you were looking for a magic spring in the vicinity, and to your surprise, the sable-morph just folds her arms, rolls her eyes and smiles.", parse);
			Text.NL();
			Text.Add("<i>“Can’t say I’m surprised, lowlander. This is <b>a</b> magic spring, to use that term, but whether it’s the one you’re looking for or not… well, that’s anyone’s guess. The highlands are full of little pools like these, touched by a spot of magic or the other. Don’t know if it’s the one you were looking for, but the fact that you’re admitting it so readily means that you probably aren’t up to any mischief. Probably.”</i>", parse);
			Text.NL();
			Text.Add("Nice to see she took it so well.", parse);
			Text.NL();
			Text.Add("<i>“Truth be told, I haven’t had actual company for some time now, lowlander or otherwise, so I guess you’re not unwelcome. It’s at least a change from those three troublemakers who keep on bothering me because they think I’m too free or something. Want a drink? The trail up here can be quite tiring.”</i>", parse);
			Text.NL();
			Text.Add("Well, refusing would be kind of rude, and you guess you could do with a drink.", parse);
			Text.NL();
			Text.Add("<i>“Great. Just give me a moment.”</i>", parse);
			PrintDefaultOptions();
		}, enabled : true
	});
	
	Gui.Callstack.push(function() {
		Text.NL();
		Text.Add("Isla gestures for you to take a seat by the fire pit, which you do, then nips off into the cave. Her thin bottom and fluffy tail are on display as she bends over to grab a waterskin, then returns to you with it in her arms.", parse);
		Text.NL();
		Text.Add("<i>“Lug this thing and many others like it up the trail every day,”</i> she says, her words punctuated with a grunt of effort. <i>“Hey, it keeps one’s blood flowing.”</i>", parse);
		Text.NL();
		Text.Add("There’s a spring right there, though, you point out innocently. Why get water from somewhere else when there’s a source right here?", parse);
		Text.NL();
		Text.Add("Isla chuckles and shakes her head. <i>“Nah, that wouldn’t work. Water that comes out of there keeps the spring’s magic for days, and I don’t have that many waterskins to let it sit that long. And as for drinking the water before then… I’d rather stay the same shape that I am right now, thank you very much.”</i>", parse);
		Text.NL();
		Text.Add("Now you’re curious. What does she mean by that?", parse);
		Text.NL();
		Text.Add("<i>“Me? If I got into the water, I’d likely remain as a sable, with a few changes in my proportions. You? Who knows what you’d end up as?”</i> She looks around her, deliberately breaking eye contact with you, then unstoppers the waterskin and takes a swig, careful not to let her lips touch the spout. Refreshed, she passes it to you. <i>“Here, have some. Sorry I don’t have a cup or anything - like I said, I don’t have many visitors up here.”</i>", parse);
		Text.NL();
		Text.Add("Cautiously, you take a swig of your own. The water does taste a bit off, but that’s only to be expected after sitting in what amounts to a leather bag. Still, it’s not that bad, and you do feel somewhat refreshed for the drink.", parse);
		Text.NL();
		Text.Add("So, she mentioned that she was a spring guardian of some sort?", parse);
		Text.NL();
		Text.Add("Isla nods and sighs as she retrieves the waterskin. <i>“That’s about the long and short of it. This place is part of my tribe’s lands, and I’ve been chosen to watch over them.”</i>", parse);
		Text.NL();
		Text.Add("Does that mean you’re not supposed to be here? That would explain the welcome you got.", parse);
		Text.NL();
		Text.Add("<i>“Oh, no no. In fact, custom dictates that anyone who wishes to use the spring can freely do so, and I’m not to stop them. I’m just here to stop anyone from messing with the water… although there’s not much call for that these days, either.”</i>", parse);
		Text.NL();
		Text.Add("Except those three troublemakers she mentioned just now, that is.", parse);
		Text.NL();
		Text.Add("<i>“Trio of husky brats from the minotaur village of Horkan, that’s all,”</i> Isla replies with a shake of her head. <i>“No one to actually worry about. They just make my life more annoying than it has to be, but they don’t do anything actually <b>bad</b>.”</i>", parse);
		Text.NL();
		Text.Add("You see. Both of you lapse into silence for a bit, and Isla takes the chance to have another swig from the waterskin. At last, you’re the one to speak - she doesn’t seem like she’s enjoying the job very much, is she? While you’re not overly familiar with the ins and outs of all the highlands’ little tribes, “spring guardian” sounds like something fairly prestigious.", parse);
		Text.NL();
		Text.Add("The sable-morph rolls her eyes skyward. <i>“Guess it might’ve been once. I know it wasn’t my first choice of what to do with my life.”</i>", parse);
		Text.NL();
		Text.Add("What was, then?", parse);
		Text.NL();
		Text.Add("<i>“Anything but this.”</i>", parse);
		Text.NL();
		Text.Add("Yeah, she’s definitely evading the question, and somehow, you get the feeling that pushing sensitive issues on someone you just met isn’t going to fly well. Nice place she has here, though.", parse);
		Text.NL();
		Text.Add("<i>“It’s pleasant enough, although I really wouldn’t mind a proper roof over my head. But I’ve learned to deal.”</i>", parse);
		Text.NL();
		Text.Add("The conversation lapses into silence once more, and you take the opportunity to get up and prepare to leave. It’s been nice meeting her, but you do need to get going.", parse);
		Text.NL();
		Text.Add("Isla sighs and looks away. <i>“All right. Need directions to the nearest proper road?”</i>", parse);
		Text.NL();
		Text.Add("Sure, if she doesn’t mind.", parse);
		Text.NL();
		Text.Add("With quite a bit of pointing and gesturing, the sable-morph gives you quick directions to a nearby road - she’s quite familiar with the lay of the land, you didn’t even know there was one this close. <i>“There… there’s also something I’d like to add.”</i>", parse);
		Text.NL();
		Text.Add("Yes?", parse);
		Text.NL();
		Text.Add("Isla looks around a bit, then squares her shoulders and takes a deep breath. <i>“I wouldn’t mind it if you came back every now and then, even if you don’t need to have anything to do with the spring.”</i>", parse);
		Text.NL();
		Text.Add("Oh? Is that an invitation you’re hearing?", parse);
		Text.NL();
		Text.Add("<i>“If you want to take it that way. I’d just like someone to talk to from time to time. Even when I head back to the tribe for a bit, only my family will really talk to me. Look, you’ve got to go, so just go, okay?”</i>", parse);
		Text.NL();
		Text.Add("Hey, now you’re getting conflicting signals here -", parse);
		Text.NL();
		Text.Add("<i>“Just go!”</i>", parse);
		Text.NL();
		Text.Add("Without another word, Isla shoves you in the back with surprising force for someone so slender; you can get a hint when it’s freely given like that. Well, you’ll be back later, then. Isla’s gaze bores into the back of your neck all the way to the trail, and when you turn around - yes, she’s still there and watching intensely.", parse);
		Text.NL();
		Text.Add("You shrug. She’ll come around sooner or later, especially since she asked you to come back another time… for now, though, it’s probably best to make yourself scarce. Following Isla’s instructions, you head down the trail and push through the rocks, finding yourself on the road before too long.", parse);
		Text.Flush();
		
		world.TimeStep({hour: 1});
		
		Gui.NextPrompt(function() {
			party.location = world.loc.Highlands.Hills;
			PrintDefaultOptions();
		});
	});
	
	Gui.SetButtonsFromList(options, false, null);
}
