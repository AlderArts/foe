
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
	
	this.FirstVag().virgin = false;
	this.Butt().virgin = false;
	
	this.flags["Met"] = Isla.Met.NotMet;
	this.flags["Talk"] = 0;
	this.flags["Figure"] = Isla.Figure.Girly;

	if(storage) this.FromStorage(storage);
}
Isla.prototype = new Entity();
Isla.prototype.constructor = Isla;

Isla.Met = {
	NotMet : 0,
	Met    : 1
};

Isla.Figure = {
	Girly      : 0,
	Womanly    : 1,
	Voluptuous : 2
};

Isla.Talk = { //Bitmask
	Spring : 1,
	Sex : 2 //First time fucked
};

/* TODO
Isla.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
}
*/

Isla.Available = function() {
	return asche.flags["Tasks"] & Asche.Tasks.Spring_Visited;
}

// Number of kids Isla birthed by the PC
Isla.prototype.Kids = function() {
	//TODO Use flag
	return 0;
}

Isla.prototype.Figure = function() {
	return this.flags["Figure"];
}

Isla.prototype.FromStorage = function(storage) {
	this.LoadPregnancy(storage);
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Isla.prototype.ToStorage = function() {
	var storage = {
	};
	
	this.SavePregnancy(storage);
	this.SavePersonalityStats(storage);
	this.SaveFlags(storage);
	
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

Scenes.Isla.Approach = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("You step towards the shelter in the north face of the mountainside. Isla’s temporary home consists of a shallow cleaned-out cave, extended out front by means of a few simple wooden structures and stretched-out hides to provide shelter. A small fire pit out front provides heat and warmth, and there’s a simple sleeping mat laid out in the back. Considering the spartan living conditions and remote location, it’s little wonder why the job of spring guardian doesn’t have people lining up to fill it.", parse);
	Text.NL();
	Text.Add("As you draw close, you note that Isla is ", parse);
	
	var kids = isla.Kids();

	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("sitting cross-legged out front, doing a bit of fletching. A number of finished arrows lie by her side, tipped with flint heads and guided with large, white feathers from a bird of some sort, and it’s clear that she’s very serious about this job, if nothing else.", parse);
		Text.NL();
		Text.Add("Noticing your approach, Isla puts down her flint knife and places the finished arrows into a nearby quiver. <i>“Oh, it’s you, [playername]. Come up all the way to see me?”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("halfway up a rock face leading off the trail, hot in pursuit of the nest of some mountain bird or the other. As you watch, the sable-morph agilely pulls herself hand over foot to the nest and pockets the eggs with ease, then makes the descent with half the difficulty with which she went up.", parse);
		Text.NL();
		Text.Add("Seeing you standing up on the plateau, she nods at you and comes over. <i>“Don’t mind me, was just getting tomorrow’s breakfast. Came to visit?”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("boiling some water in a small iron pot over the fire pit. She’s mostly done and the fire is but embers now, and as you watch, she covers the pot with a stone lid and stands to face you.", parse);
		Text.NL();
		Text.Add("<i>“Sure, the spring’s usually good enough to drink from, but I’m not one to be taking chances, especially when I can’t count on anyone else sticking around to look after me if I eat anything bad. Now, was there something you needed, or did you just come to visit?”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("skinning and gutting a rabbit with deadly efficiency. Whistling a merry tune to herself, the sable-morph works away with flint knife and bloody hands, preparing her latest catch for the pot. It’s only when she’s finally done that she deigns to notice you, putting aside both pelt and carcass and washing her hands to get the blood out of her fur.", parse);
		Text.NL();
		Text.Add("<i>“Well, if it isn’t you. It’s nice to have company on a day like this - you <b>are</b> just visiting, aren’t you?”</i>", parse);
	}, 1.0, function() { return true; });
	//only use if she’s actually had at least one of your kids.
	scenes.AddEnc(function() {
		parse["latest"] = kids > 1 ? " latest" : "";
		Text.Add("taking care of the[latest] child you’ve fathered on her, the tiny fluffy ball dozing away quietly in her arms. She may not have been very maternal at the outset, but it looks like she’s learning quickly, and without too many hiccups, too.", parse);
		Text.NL();
		Text.Add("<i>“Cute little ‘un, don’t you think?”</i> she whispers, careful not to wake the sleeping infant. <i>“Probably have to send the little tyke back to the rest of the clan before too long… but until it happens, I’ll enjoy this time together.”</i>", parse);
	}, 1.0, function() { return kids > 0; });
	scenes.Get();
	Text.Flush();
	
	Scenes.Isla.Prompt();
}

//TODO
Scenes.Isla.Prompt = function() {
	var parse = {
		
	};
	
	//[name]
	var options = new Array();
	options.push({ nameStr : "Appearance",
		tooltip : "Take a once over of the sable-girl.",
		func : Scenes.Isla.Appearance, enabled : true
	});
	
	options.push({ nameStr : "Talk",
		tooltip : "Have a chat with Isla.",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Aye?”</i>", parse);
			Text.Flush();
			Scenes.Isla.TalkPrompt();
		}, enabled : true
	});
	
	var womb = isla.PregHandler().Womb();
	var preg = womb && womb.pregnant;
	var stage = preg ? womb.progress : 0;
	
	if(stage >= 0.4) {
		options.push({ nameStr : "Tummy Rub",
			tooltip : "Is that big tummy of hers weighing her down? Maybe you can help out with that.",
			func : Scenes.Isla.TummyRub, enabled : true
		});
	}
	/* TODO
	options.push({ nameStr : "name",
		tooltip : "",
		func : Scenes.Isla.Appearance, enabled : true
	});
	*/
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“Well, see you around!”</i>", parse);
		Text.Flush();
		Gui.NextPrompt();
	});
}


/*
 * 
[] - 
//Requires Isla to be visibly pregnant. Else, hide.

 */

Scenes.Isla.Appearance = function() {
	var parse = {
		
	};
	
	var figure = isla.Figure();
	
	Text.Clear();
	if(figure == Isla.Figure.Girly) {
		Text.Add("Seeing your eyes rove over her, Isla folds her arms across her flat chest and snorts. <i>“You looking at me?”</i>", parse);
		Text.NL();
		parse["dom"] = player.SubDom() >= 20 ? "Does she have a problem with that" : "Why, does it bother her";
		Text.Add("Yeah, you are. [dom]?", parse);
		Text.NL();
		Text.Add("She doesn’t reply and turns her head away from you, clearly acting fed up with you. Though she doesn’t look like she cares - you do spot her stealing glances at you out from the corner of her eyes. Fine, you can live with that.", parse);
	}
	else if(figure == Isla.Figure.Womanly) {
		Text.Add("Noticing you looking at her, Isla shakes her head and turns her gaze skyward, but there’s a small smile on her muzzle as she does so. <i>“Really? You’re gonna ogle me? I’m still not anything special, you know.”</i>", parse);
		Text.NL();
		Text.Add("Well, if she’s not anything special, then she certainly can’t object to you taking a look-see, can she?", parse);
		Text.NL();
		Text.Add("<i>“Weeeellllll…”</i>", parse);
		Text.NL();
		Text.Add("Silence means consent; she knows that.", parse);
		Text.NL();
		Text.Add("Isla makes an exasperated noise, which you take as a go-ahead. You look her up and down, making sure she feels your eyes on her soft, silky fur, then start paying attention to the details.", parse);
	}
	else {
		Text.Add("Catching you eyeing her, Isla smirks and plants her hands on her now generous hips. She’s still not very good at posing, not having had many opportunities to practice, but she’s definitely getting better at it.", parse);
		Text.NL();
		Text.Add("<i>“Look away, you bastard. I haven’t got anything to hide.”</i>", parse);
		Text.NL();
		Text.Add("Now that’s an invitation if you ever heard one. Well, don’t mind if you do!", parse);
	}
	Text.NL();
	Text.Add("Isla is a sable-morph - related to the more common ferret-morphs, and as you continue to look over her, you have to admit she could be mistaken for one at a distance. Save for two patches of brown about her eyes and cheeks, her form is clothed in a glossy, luxuriant coat of blue-black fur that just begs to stroked and petted - assuming she’s in the mood for such, of course. A short, rounded muzzle juts out the front of her face, capped with an absolutely adorable black button of a nose, and black, beady eyes and a pair of triangular, round-tipped ears complete her visage. The latter are constantly on the alert for sounds, swiveling this way and that - it doesn’t seem to be a conscious thing on Isla’s part, though.", parse);
	Text.NL();
	Text.Add("The only true clothing on her consists of a short skirt of tough fabric, designed to allow for some amount of modesty while allowing for a free range of movement - a huntress’ garb, and a crude string belt to hold it all in place. No, what actually clothes her is the body paint that’s been smeared on much of her fur in intricate patterns that resemble knotwork, equal parts vibrant hues of red and blue. This is accentuated by the string of the same color she’s tied into her fur and the plaited braid of dark black hair that runs down to the small of her back.", parse);
	Text.NL();
	Text.Add("She’s not that tall - perhaps five foot three, give or take an inch - but judging from the way she moves, there’s certainly a lot of energy in that short frame of hers. ", parse);
	if(figure == Isla.Figure.Girly) {
		Text.Add("Slender and lithe, her form moves with the sure-footed grace that comes with a mustelid’s natural flexibility, tempered by years upon years of navigating treacherous highland trails. Her natural thinness, flat ass and narrow hips - for a girl, at least - make her furry arms and legs look a little too long for her body, resulting in a somewhat gangly look to her; while her chest fur is pretty fluffy, you’re also quite sure that she’s either flat-chested, or almost so.", parse);
		Text.NL();
		Text.Add("The movements of Isla’s wiry muscles under her skin are clear when she leaps and jumps, and you faintly wonder if that same athleticism and flexibility could be put to better use elsewhere.", parse);
	}
	else if(figure == Isla.Figure.Womanly) {
		Text.Add("Improved by the extended soak she took in the spring, Isla’s figure is now easier on the eyes than before. While her body is still wiry and athletic - simply watching her slinking, stalking movements leave little doubt as to that - the spring’s mystical power has filled out her form, rendering her much more like the traditional concept of a woman. She’s still a little abashed by the attention, but doesn’t resist as you step up and place your hands on the sides of her waist, sliding your palms down to the noticeable curves of her hips and taking pleasure in the sleek feel of her lovely fur.", parse);
		Text.NL();
		Text.Add("<i>“Oy! There’s no need to get all touchy-feely…”</i>", parse);
		Text.NL();
		Text.Add("Need is one thing, but want is another, isn’t it? She should know that by now. She does <i>want</i> plenty of things that she doesn’t <i>need</i>, right?", parse);
		Text.NL();
		Text.Add("<i>“Maybe…”</i>", parse);
		Text.NL();
		Text.Add("Rising gently from her chest, two rolling mounds of glossy fur mark the spots where her baby feeders are hidden, perky bumps that amount to large B-cups or thereabouts. They’re still not large enough to push through the veil of fur that shrouds her chest, but at least you don’t have to guess if you wanted to grab ahold of them.", parse);
	}
	else {
		Text.Add("Now that Isla’s hourglass figure is truly voluptuous, she has no hang-ups about flaunting it in your face. Despite the apparent softness she’s gained as her body’s filled out, the muscles under her skin and fur are just as powerful as ever - a fact which becomes evident as she pushes her hips against your hands.", parse);
		Text.NL();
		Text.Add("<i>“There, doesn’t that feel good?”</i>", parse);
		Text.NL();
		Text.Add("Indeed, it does - you take your own sweet time exploring Isla’s delicious bubble butt and wide, fertile hips, so different from the assets she started out with. No regrets, eh?", parse);
		Text.NL();
		Text.Add("<i>“Aye, none,”</i> the sable-morph replies with a small smile. <i>“Seriously, I dunno why I waited so long to take the plunge… I guess I was more afraid of what might happen than what I was, you know?”</i>", parse);
		Text.NL();
		Text.Add("Well, that’s all in the past now. Slowly, you slide your hands upwards past Isla’s waist to her chest and the band of tough fabric that she uses to support her now-generous baby feeders. For all their firm perkiness, at a low D-cup, they still need all the support they can get in her active lifestyle. That said, maybe she <i>is</i> tying the cloth a little too tight - you can clearly see the outline of Isla’s nipples against the fabric, fat little nubs of sensitive flesh.", parse);
	}
	Text.NL();
	
	
	var womb = isla.PregHandler().Womb();
	var preg = womb && womb.pregnant;
	var stage = preg ? womb.progress : 0;
	var num = womb.litterSize;
	
	//Belly +pregnancy block
	Text.Add("Her overall figure dealt with, you sweep your eyes down to her belly. ", parse);
	if(!preg || stage < 0.2) {
		Text.Add("Isla’s tummy is flat and trim, the result of the active lifestyle her vocation as the spring’s guardian demands of her. Not that she has abs, but there’s a certain muscularity to her midsection that’s hidden away underneath her skin, and a good amount of ticklishness too - you catch her stifling a giggle or two as your fingertips run through her fur. No extra fat on this sable, that’s for sure.", parse);
		if(preg) {
			Text.NL();
			Text.Add("There’s something about the feel of her tummy, though… carefully, you probe at Isla’s lower belly some more, ignoring her giggles and twitching. Yes, it’s meant to be hard, but that little hard bump right there… you might be wrong, but it’s not likely. Isla’s going to be a mommy, and it’s you who made her one.", parse);
		}
	}
	else if(stage < 0.4) {
		Text.Add("Isla’s now sporting a small baby bump, proof of your virility and recent coupling. It wouldn’t have been that obvious on another woman, but her lean form only makes it stick out all the more; a gentle rise in her midsection that can’t be ignored, marking her beyond all doubt as an impending mother.", parse);
		Text.NL();
		Text.Add("Maybe it’s her proximity to the spring or just her fit body, but she doesn’t seem too adversely affected by her pregnancy - if anything, she seems to be in a slightly better mood than her usual terse self. All the better for you, then.", parse);
	}
	else if(stage < 0.6) {
		Text.Add("Isla’s pregnancy is growing just nicely, her tummy rounded and protruding from her front in quite the obvious manner, her breasts ever so slightly swollen as they prepare themselves for their intended purpose. ", parse);
		if(num <= 1)
			Text.Add("If she’s having cravings, at least she knows better than to trouble you with them, and you have to admit that having undeniable proof of her fertility only serves to make her look more womanly and attractive. She may be pregnant, but that’s no reason not to have some fun…", parse);
		else if(num <= 2)
			Text.Add("Odd, though… you’re no expert on these matters, but it seems to you that her belly’s a little bigger that it ought to be. Maybe this cub of hers is just growing extra large and healthy in her, or maybe there’s a bit more fluid than usual. Nothing to worry about.", parse);
		else //triplets
			Text.Add("It’s obvious by now that more than one cub has taken root within the fertile confines of Isla’s womb - the swell of her pregnancy is far too big too soon to be anything but multiples, although it’s too early to tell just how many are in there by sight alone. The proof of both her fertility and your virility combined causes no end of delight in her, and she’s always sneaking in a belly rub or two when she thinks you’re not looking.", parse);
	}
	else if(stage < 0.8) {
		Text.Add("It’s been getting bigger and bigger, filling steadily with new life as the moment of birthing draws closer with each day. Her lean body only makes her big belly even more pronounced - she’s drawn an intricate pattern of body-paint on it centered about her navel, ostensibly to help the cubs inside grow big and healthy. As hormones have flooded her body, so have her nipples darkened, and you find yourself wondering just how her milk tastes like…", parse);
		Text.NL();
		if(num <= 1)
			Text.Add("All in all, though, you know that it’s not going to be too long before Isla’s fully ripened and ready to bear fruit. Before that happens, though, her tummy’s only going to get bigger, her cub more vigorous…", parse);
		else if(num <= 2)
			Text.Add("Besides, there’s little doubt now that she’s carrying more than one cub inside her - with how big she is, she’d be ready to pop soon if she were carrying but one. Instead of being grouchy or resentful, Isla seems to take a certain glee in this proof of her above-average fertility, a smug smile on her muzzle as she tenderly caresses the tender girth of her burgeoning belly.", parse);
		else {
			Text.Add("Isla is starting to get really heavy - her belly’s bigger than that of a full-term singleton pregnancy, and the fur about her midsection is starting to thin out due to all the area it has to cover now. It’s a good thing that she usually has plenty of energy to spare, because her tummy is only going to get even bigger before she finally pops out her cubs.", parse);
			Text.NL();
			Text.Add("She’s even had to loosen her makeshift bra with how milky and jiggly her swelling tits are becoming, jostling for space on her chest.", parse);
		}
	}
	else { // progress > 0.8
		Text.Add("She’s now in the final stages of her pregnancy; her tummy enormously swollen and rounded, ready to pop any moment, her belly button turned into an outie from the sheer pressure within her overstuffed womb. Her nipples have darkened into a rich brown, just waiting for the opportunity to be put to good use.", parse);
		Text.NL();
		Text.Add("More and more patterns have been added to the one on Isla’s big belly, deep reds and ochres of body paint - to ensure an easy birth, or so she tells you. It’s an easy birth that she’ll be needing, considering how active the life within her is - constantly squirming and shifting, causing bumps to rise on the rounded surface of her pregnancy. She certainly makes a far better mother than a guardian.", parse);
		Text.NL();
		if(num <= 1) {
			Text.Add("Heavy with new life, Isla’s the very picture of a radiant mother-to-be. Smiling at you, she runs a hand across the thin fur of her stretched belly and shakes her head.", parse);
			Text.NL();
			Text.Add("<i>“Gotta admit, it feels like I’m lugging around a bag of rocks, but a bag of rocks isn’t going to slow me down none.”</i>", parse);
		}
		else if(num <= 2) {
			Text.Add("You have to admit, she’s doing very well considering how the cubs inside her have stretched her tummy to the point it’s turned into an elongated dome. As energetic and athletic as she is, she can’t help but walk with a waddle now.", parse);
			Text.NL();
			Text.Add("<i>“They’re big and strong, all right. Can’t stop kicking me at night.”</i>", parse);
			Text.NL();
			Text.Add("They certainly take after their mother, don’t they?", parse);
			Text.NL();
			Text.Add("<i>“Aye, it’s true.”</i>", parse);
		}
		else {
			Text.Add("With how massively swollen Isla’s tummy is by way of harboring three full-grown cubs inside her, it’s a small wonder that she hasn’t popped already. Even with the sable-morph’s abundant vitality, she’s finding herself running out of breath and having to sit down and rest often - it’s almost as if she’s giving her excess energy to help her little ones grow.", parse);
			Text.NL();
			Text.Add("Still, that doesn’t stop her from being happy about the whole thing, especially since she’s a figure to match. Every so often, you find her hugging her bare, massive belly, basking in the glow of maternity - and you yourself can’t help but feel proud at having concrete proof of your considerable virility in knocking her up so thoroughly.", parse);
		}
	}
	Text.NL();
	Text.Add("Finished with surveying the generalities, you shift your attention to the details. Although graced with long, flexible fingers, Isla’s hands look more like an animal’s than a human’s, her palms possessed to paw-pads of sorts, each digit capped with a small, hooked claw instead of nails. Her toes aren’t too different, too, and you can see how such would be an advantage in the rough, uneven terrain of the highlands, considering she goes about barefoot with no problems at all. Of course, that long fluffy tail of hers has a practical use in helping her keep balance, but that doesn’t stop you from wanting to pet and stroke it.", parse);
	Text.NL();
	Text.Add("<i>“You done? Standing still is so tiring.”</i>", parse);
	Text.NL();
	Text.Add("Well, actually you weren’t, but if you asked her to hold her place any longer she might just get bored and leave anyway. Reluctantly, you nod, and Isla immediately rolls back onto the balls of her feet, her body sagging slightly with released effort.", parse);
	Text.NL();
	Text.Add("<i>“Phew! So now that that’s over with, what you want to get done today?”</i>", parse);
	Text.Flush();
	
	Scenes.Isla.Prompt();
}

Scenes.Isla.TalkPrompt = function() {
	var parse = {
		
	};
	
	//[name]
	var options = new Array();
	options.push({ nameStr : "Herself",
		tooltip : "Ask Isla about herself.",
		func : function() {
			Text.Clear();
			Text.Add("<i>“About me? I can’t really say much. I guess I’ve had a pretty good life so far… peaceful childhood, was sometimes a bit hungry but never actually starved, the neighboring tribes never actually bothered us… that’s how it is in the highlands. Little scattered tribes of morphs living beyond the reach of the kingdom in the mountains, just doing their own thing and staying out of peoples’ way.”</i>", parse);
			Text.NL();
			Text.Add("You weren’t asking about the polity of the highlands, you were asking her about herself.", parse);
			Text.NL();
			Text.Add("<i>“What <i>is</i> there to say? My tribe may once have had a patron spirit like the minotaurs do with Horkan, but that’s so many generations ago that even the stories are faded. We were so small that everyone tended to do a bit of everything, so that’s what I did, too. We don’t have the luxury of having, say, the village shaman sit in a dank cave and smoke strange herbs all day long - no, fellow’s out there catching fish and drying beans from dawn to dusk with the rest of us.</i>", parse);
			Text.NL();
			Text.Add("<i>“I suppose that’s how I’d have lived, much like my mother and grandmother and great-grandma and… well, you get the point. There was always the option of heading out, I suppose, but if you think it through, going out for no better reason than to seek your fortune is a really stupid and irresponsible thing to do.”</i>", parse);
			Text.NL();
			Text.Add("Huh. You’ll have to ask her to explain that later, maybe. For now, though, you indicate that she should go on.", parse);
			Text.NL();
			Text.Add("<i>“I was about sixteen when my parents decided it was about time for me to help do my part in perpetuating the tribe, if you know what I mean. That first time didn’t go around too well, all of the eligible fellows already were paired up with womenfolk who were more eligible than I was.”</i> Her small, beady eyes stare straight ahead unblinkingly. <i>“Hey, it was just a setback; we’d try again next year… with much the same result. It’s not that I was against it or anything - I mean, I’ve been raised my entire life to expect as such. And to be fair, when it didn’t happen, I did feel kinda disappointed… maybe, what’s the word for it…”</i>", parse);
			Text.NL();
			Text.Add("Unwanted?", parse);
			Text.NL();
			Text.Add("Isla winces. <i>“Not quite, but I guess it’s close enough. My parents were thinking of actually seeing if there was anyone reputable from our neighbors who’d take me, then the shaman, bless him, says maybe it’s better if I take a few years off and play the part of spring guardian, since the position’s been vacant for a bit too long for comfort. And well, here I am while they decide what to do with my future marriage prospects.”</i>", parse);
			Text.NL();
			Text.Add("Hmm. You don’t know… she just seems like the kind of girl who would protest such a thing.", parse);
			Text.NL();
			Text.Add("<i>“Why, am I too mellow about it? Maybe it seems that way to a lowlander, but I’ve a bit more common sense than to kick up a fuss for its own sake. Things could be better, sure, but they could always be worse. I really wouldn’t mind this spring guardian job on a permanent basis if it didn’t mean I’d to be all by myself most of the time. Just a visit every now and then would be fine…”</i> she glances at you. <i>“It’s a little - well, more than a little ironic that a lowlander would be visiting me more than my own folks.”</i>", parse);
			Text.NL();
			Text.Add("You grin. Probably because you don’t know how important her job is and hence cheerfully disturbs her seclusion, eh? ", parse);
			Text.NL();
			Text.Add("Isla looks you up and down, then returns the grin. “Yeah, I guess. But there we have it. I like to think I’m a pretty down-to-earth girl, so there we have it.”</i>", parse);
			Text.Flush();
			
			Scenes.Isla.TalkPrompt();
		}, enabled : true
	});
	options.push({ nameStr : "Spring",
		tooltip : "So, what’s so special about this spring, anyway?",
		func : function() {
			isla.flags["Talk"] |= Isla.Talk.Spring;
			
			Text.Clear();
			Text.Add("<i>“Well, all we have are legends and hearsay… no one from that time’s still alive, so that’s what we’ve got to work on.”</i>", parse);
			Text.NL();
			Text.Add("That’s fine with you - there’s a grain of truth in every story, after all. You just need to tease it out and see if it’s useful.", parse);
			Text.NL();
			Text.Add("Isla shrugs. <i>“Well, if you say so; as I said, dunno how much truth there is to it. As the tale goes - thousand years ago or so, there was this really big war on Eden that ate up most of the land, leaving us with what we have today. During that time, there was this spirit who looked after ferrets, otters, weasels, and of course, sables… we’d go out, do battle with the demons, and inevitably come back with an odd arm or leg if we were lucky.</i>", parse);
			Text.NL();
			Text.Add("<i>“That kinda upset my people of the time, so the spirit was nice enough to give us a way to get our bodies back to what they were for free - this spring, that is. You’d go in with tentacles and creepy limbs and whatnot from the demons’ magics, and come out without all that nonsense sticking to you. It was a small gesture, but it did wonders for morale.</i>", parse);
			Text.NL();
			Text.Add("<i>“Nowadays, that spirit is gone, and so is much of Eden, but this here spring remains,”</i> Isla continues. <i>“And that’s how the story goes. How much of it is real, and how much of it is hearsay passed down from old, I dunno. Only thing I know for sure is that if ya go for a dip, you start changing into a must- musta - something like me. Longer you sit in the water, more you change, although as with all hot springs it’s probably not a good idea to stay in too long lest ya pass out and drown. Now that’d be downright embarrassing - to drown in a pool you can stand in.”</i>", parse);
			Text.NL();
			Text.Add("Changing into a mustelid aside, is there anything else you ought to know about it?", parse);
			Text.NL();
			Text.Add("Isla reaches up and scratches her ears as she thinks. <i>“Well… what exactly you turn into is different for different folks. If ya were born a morph like me, then you’d turn into your old self. If you weren’t, then it’s a toss-up what you’ll end up as. And if you’re already fully one…", parse);
			if(isla.Figure() == Isla.Figure.Girly) {
				Text.Add("”</i>", parse);
				Text.NL();
				Text.Add("Yes? She was about to say something?", parse);
				Text.NL();
				Text.Add("<i>“Well, then some other things can happen,”</i> she replies, before breaking into a rather severe coughing fit. <i>“Sorry. It’s just not really something that you say out loud in public.”</i>", parse);
				Text.NL();
				Text.Add("Aah, you see. <i>That</i> kind of transformation.", parse);
				Text.NL();
				Text.Add("Isla has another coughing fit, although it’s not as strong as the first one. <i>“It’s not very… extreme, but still quite noticeable nonetheless. Would have gotten me out of being spring guardian, but that’s kinda an extreme step to take.”</i>", parse);
				Text.NL();
				Text.Add("It’d have gotten her out of this gig? You might have to ask her about that sometime, but for now you just nod and let it go.", parse);
			}
			else {
				Text.Add(" well, ya can see the effects for yourself right here,”</i> she says with a grin, jabbing a finger that stops just shy of her ample chest.", parse);
			}
			Text.NL();
			Text.Add("Hmm. So if there were ever the need to, she wouldn’t mind if you had a soak in the spring?", parse);
			Text.NL();
			Text.Add("<i>“So long as you’re serious about it and don’t take it for a toy like those three brats do? Knock yourself out - Eden could do with more of us running about with their heads screwed on the right way.”</i>", parse);
			Text.NL();
			Text.Add("What does she mean by that?", parse);
			Text.NL();
			Text.Add("<i>“Think about it for a moment. Eden’s a pretty small place, or at least that’s what I’ve been told; there’s not much of it left after what happened ‘bout a thousand years ago. Unless you’re a fox or wolf or one of the more populous morphs, there’s not that much chance of you finding someone who looks like you…”</i>", parse);
			Text.NL();
			Text.Add("Does that really matter?", parse);
			Text.NL();
			Text.Add("<i>“Sorta. Coulda. Woulda. Shoulda. Just forget I said anything, right? Let’s move on.”</i>", parse);
			Text.Flush();
			
			Scenes.Isla.TalkPrompt();
		}, enabled : true
	});
	options.push({ nameStr : "Guardian",
		tooltip : "Ask her about her job as the spring’s guardian.",
		func : function() {
			Text.Clear();
			Text.Add("So… what exactly <i>does</i> she do as the spring’s guardian, anyway?", parse);
			Text.NL();
			Text.Add("Isla’s lips stretch into a long, thin line. <i>“Well, as it was explained to me, I’m supposed to keep the place clear of anyone or anything that might have designs on fouling the spring’s waters. Do anything that’s required of me to keep it clean and flowing, that kind of thing. Protect it, and make sure everyone who comes in to use it isn’t going to pull any shenanigans.</i>", parse);
			Text.NL();
			Text.Add("<i>“Me myself, I mostly think of it as an extended camping trip. It’s not an actual exile - I still head back to leave off these pelts and get some of the things I can’t make myself up here, but it still does get pretty lonely. You aside, the only people who come visit me are those three brats - and more often than not they’re up to some sort of mischief.</i>", parse);
			Text.NL();
			Text.Add("<i>“So yes, it’s a whole lot of nothing. The spring cleans itself out pretty well, and it’s not like it’s used very often in this day and age… so it wouldn’t be wrong to say that it looks after itself pretty well.”</i>", parse);
			Text.NL();
			Text.Add("Huh. Sounds like a pretty boring job.", parse);
			Text.NL();
			Text.Add("<i>“Boring, maybe, but not idle. Keeping myself fed and warm is more than enough to keep me busy for most of the day. Before I got stuck with this post, I never quite realized just how much work being by myself would be.”</i> She looks around for a bit, then heaves a sigh. <i>“I know, I know. It’s just a ceremonial position nowadays… there’s a reason why it’s the last of the leftovers who ends up chosen for the spot. Can we talk about something else, please? ", parse);
			if(isla.Figure() == Isla.Figure.Girly)
				Text.Add("This is getting to me. I know I should count my blessings, that having a plain face isn’t by far the worst thing that could’ve happened to me, but still…”</i>", parse);
			else
				Text.Add("I don’t like to look back on things behind me that’re done and over with - rather move ahead, y’know?”</i>", parse);
			Text.NL();
			Text.Add("That’s a surprisingly stark admission, and you agree to drop the issue.", parse);
			Text.Flush();
			
			Scenes.Isla.TalkPrompt();
		}, enabled : true
	});
	options.push({ nameStr : "Tribe",
		tooltip : "So, what are her people like, anyway?",
		func : function() {
			Text.Clear();
			Text.Add("So, what are her people like, anyway? With all the small tribes that dot the highlands, it’s hard to run into any particular one, whether it be intentional or by accident.", parse);
			Text.NL();
			Text.Add("<i>“Y’know, that word always trips me up. ‘Like’. Sure, a lowlander like you’s probably seen much, but when walking anywhere either means going ‘round a mountain or climbing it, you don’t tend to see much.”</i> She thinks a moment. <i>“Don’t know if I’m rightly answering your question, but we’re doing as we’ve always done, so long as anyone can remember. Couple hundred folks living in a hidey-hole between two hills out of the wind and rain, digging out land good dirt won’t wash off from during the rains and finding spots to graze the herds.”</i>", parse);
			Text.NL();
			Text.Add("It sounds like the rather idyllic life.", parse);
			Text.NL();
			Text.Add("<i>“I didn’t like it.”</i> Isla continues. <i>“Thought it was too boring - the only thing that really happened was the twice yearly clan get-together where folks would pair off, prevent blood from getting too stale? There were times when I thought I’d have a better life if I snuck down to the lowlands and went to ‘seek my fortune’, as some would put it.</i>", parse);
			Text.NL();
			Text.Add("<i>“Of course, now that I’ve been here a while, I’ve been rethinking things,”</i> she finishes with a small sigh. <i>“Long stretches of absolutely nothing punctuated with moments of sheer terror - it’s enough to make me think that once all this is over and I head back, I should be just grateful to be tending to the herds. If I want excitement, a spot of gossip will do just fine.”</i>", parse);
			Text.NL();
			Text.Add("Right. Coming back to the point, though, so her tribe is mostly like the others in the highlands?", parse);
			Text.NL();
			Text.Add("<i>“Most are, to be honest. What we are aside, this place has a tendency to mold people into its liking. The old stories had it that when many of the peoples first arrived, they brought with them their own ways of doing things from the places they’d come from. Over time, though, living up in these mountains, they changed to suit the land rather than the other way around.</i>", parse);
			Text.NL();
			Text.Add("<i>“My tribe, we’ve got a stone circle. The zebras, they’ve got a spring. We mustelids dance to bring the rain, and the jackals dance to drive it away. I’m sure the minotaur do their own rituals and have their own sacred places, too, although I’ve never stopped to ask those three whelps about it. Point I’m getting at, though, is that all the highland tribes are quite the same in what we do. It’s the what it do it <b>with</b> and why we do it that’s the important difference.”</i>", parse);
			Text.NL();
			Text.Add("Ah.", parse);
			Text.NL();
			Text.Add("<i>“I guess I haven’t really answered your question,”</i> Isla continues. <i>“But what <b>do</b> you expect me to say about us? Anything you’ve heard about the highland tribes that’s true, you could probably apply it to mine and you wouldn’t be too far off the mark.”</i>", parse);
			Text.NL();
			Text.Add("Well, while she may think it completely mundane, perhaps others who aren’t so familiar with the highlands and the local cultures might think otherwise. You can see where she’s coming from, though - familiarity breeds contempt, as the saying goes, and maybe she’s too close to things to see them clearly. Guess you’ll just have to wander the highlands some more and hope you bump into the locals to be able to judge for yourself.", parse);
			Text.NL();
			Text.Add("Isla sniffs, wrinkling her nose. <i>“Well, if you really want to. I don’t know if I’d feel the same way if I were in your place, but I’m obviously not you. Can we move onto something else, please?”</i>", parse);
			Text.Flush();
			
			Scenes.Isla.TalkPrompt();
		}, enabled : true
	});
	if(isla.flags["Talk"] & Isla.Talk.Spring &&
		!isla.PregHandler().IsPregnant() &&
		isla.flags["Talk"] & Isla.Talk.Sex) {
		
		var figure = isla.Figure();
		
		var enabled = true;
		if(figure == Isla.Figure.Womanly)
			enabled = isla.Relation() >= 50;
		
		options.push({ nameStr : "Figure",
			tooltip : "Propose that Isla should use the spring herself, to enhance her womanly figure.",
			func : function() {
				Text.Clear();
				
				if(figure == Isla.Figure.Girly) {
					isla.flags["Figure"] = Isla.Figure.Womanly;
					
					Text.Add("You have to admit, you’re curious. Since Isla knows what the spring does, why doesn’t she just use it herself?", parse);
					Text.NL();
					Text.Add("<i>“Much good it’ll do me <b>after</b> I got thrust with the job of guardian, will it? So what if I turned into a looker, when there’s no one to look at me save those three troublemakers?”</i>", parse);
					Text.NL();
					Text.Add("And you, of course.", parse);
					Text.NL();
					Text.Add("<i>“And you, of course…”</i>", parse);
					Text.NL();
					Text.Add("It’s not so much showing off for others than a show of strength on her part, you explain. If she resents being so bony -", parse);
					Text.NL();
					Text.Add("<i>“Wouldn’t say bony’s the right word,”</i> Isla cuts in with a twitch of her nose. <i>“Not like I’m underfed.”</i>", parse);
					Text.NL();
					Text.Add("Well, lithe. Slender. This isn’t really the time to get caught up in euphemisms and semantics. This spring guardian gig <i>is</i> going to end in a handful of years, and what then? She doesn’t get picked again, and then ends up here again until she’s an old maid? She ought to think towards the future. If she <i>does</i> end up changing herself, then the more time to get used to her new proportions, the better.", parse);
					Text.NL();
					Text.Add("<i>“We’ve had this talk before, right? I told you why I don’t want to use it. Besides, it’s too easy to end up in there for too long and wind up changing in ways I’d rather not have… dicks are all fine and lovely, just not on me, thank you very much.”</i>", parse);
					Text.NL();
					Text.Add("If that’s her problem, you’ll stand by to make sure she doesn’t pass out from the heat. <i>Maybe</i> it’s just your imagination, but is she just making excuses for herself?", parse);
					Text.NL();
					Text.Add("Isla scowls, her beady black eyes flashing. <i>“I-I’m not making excuses, I’m just -”</i>", parse);
					Text.NL();
					Text.Add("Yes? She’s what?", parse);
					Text.NL();
					Text.Add("<i>“Well, I can’t be sure what’s going to happen, and whether this is going to end up well or not…”</i>", parse);
					Text.NL();
					Text.Add("Ah, she’s afraid of change and what it might bring. Better the demon you know that the dark road ahead - even though you know the demon is making you miserable, and the dark road only <i>might</i> do the same?", parse);
					Text.NL();
					Text.Add("<i>“Oh, all right,”</i> she says at last, moving to lean her spear against a nearby boulder. Her face might be perfectly straight, but you can hear the edge of relief in her voice, a sound like a soft sigh punctuating her words. <i>“I’ll do it.”</i> ", parse);
					Text.NL();
					Text.Add("She won’t regret it.", parse);
					Text.NL();
					Text.Add("Isla doesn’t reply, instead focusing in untying the knots bound into her hair and fur. Small pieces of thick, colored string fall into her paw-like hands to be carefully set aside, then she undoes her braid. Sure, it looked tightly knotted and compact, but you just hadn’t realized how much so until the sable-morph tosses her head and dark waterfall of glossy hair cascades down to her butt.", parse);
					Text.NL();
					Text.Add("<i>“Only thing I’d going for me was my hair and fur,”</i> Isla admits sheepishly when she notices you watching. <i>“Had to play up to my strengths, as Mama told me, but even that wasn’t enough.”</i>", parse);
					Text.NL();
					Text.Add("Mm, yes. Sure, you can understand why it’s necessary for her to keep it tied up, but she should really let it down more.", parse);
					Text.NL();
					Text.Add("Isla sniffs as she pulls off her loincloth, then steps into the steaming spring, pausing a moment to let the waters lap at her feet. <i>“I’ll think ‘bout it. Gotten better at it over the years, but it still can be a bitch to do up on a bad fur day.”</i> At least it seems that the banter’s taking her mind off what she’s about to do… she doesn’t seem that nervous anymore.", parse);
					Text.NL();
					Text.Add("With a single, nimble movement, Isla slips her body under the water’s surface, everything from her chin down submerged in the spring’s magic. Her soft fur clings to her skin, outlining her somewhat boyish figure for a clean and clear appraisal; with any luck, it won’t be boyish for very much longer. Now it’s just a waiting game - you settle down on the pool’s edge to wait… and watch, of course.", parse);
					Text.NL();
					Text.Add("Not that you have too long to wait, of course. Scarcely a handful of minutes have passed before Isla’s breathing grows hot and heavy, and then the sable-morph’s openly panting, her little pink tongue hanging out of her muzzle as she’s stricken by a sudden wave of lust. A soft whimper escapes her lips as her hands rise to her dainty tits, rubbing away shamelessly, her fingers digging into her chest fur to get at the small hard nipples beneath.", parse);
					Text.NL();
					Text.Add("Looks like the spring’s magic is starting to take hold. As you watch, Isla’s soft A-cup breasts begin to swell outwards like buns left to leaven, each stroke of her fingers across firm breastflesh evoking soft mewls of pleasure from her lips and a small surge of growth in her chest. The accompanying arousal only encourages her to grope her own rapidly maturing breasts even more eagerly, beginning the cycle anew. Every now and then, she brushes her fur aside to let you get a glimpse of the pink pearl of a nipple, ever so elusive.", parse);
					Text.NL();
					Text.Add("While this is going on, you note the other changes that’re taking place, too: your eye trails down Isla’s body to her mound and the pink gash of her sex, starkly outlined against her dark fur. Could it…? Is it…? Why yes, it’s swelling, the lips getting puffier, stretchier, more prominent by the second, her love-button stiff, erect and peeking out of the hood where it usually remains hidden. It’s so tempting, you can’t help but reach down and give it a light caress.", parse);
					Text.NL();
					Text.Add("The effect is immediate. Gritting her teeth, Isla bites back the wanton cry of pleasure bubbling in her throat. Her hips, though, betray her as she thrusts them towards your probing fingers, causing her heat-filled folds to momentarily slide around your fingertips. Yes, she’s definitely stretchier down there… and it looks like there’s more on her that’s maturing, too. Her hips, her ass, her thighs - all of them are filling out into firm, delicious curves worthy of the woman she ought to be.", parse);
					Text.NL();
					Text.Add("All right, that’s probably enough. Isla is practically half-delirious with pleasure, her flexible body splashing about in the water as she masturbates furiously, and you wonder why the spring is having a particularly strong effect on her. Maybe it’s because she’s its guardian? Nevertheless, it’s time for you to get her out, and hooking your hands under her shoulders, proceed to do just that, dragging a panting Isla out of the steamy water and onto dry land. The spring’s waters have washed the sable-morph clean of her body paint, leaving behind nothing but her birthday suit.", parse);
					Text.NL();
					Text.Add("<i>“Hee… hoo…”</i> A few lungfuls of chill highland air, and Isla groans. It’s no cold shower, but at least she looks a little more coherent now. <i>“Ugh. I’ve seen people in the pool before, but I wasn’t quite expecting <b>that</b>.”</i>", parse);
					Text.NL();
					Text.Add("It does seem to have paid a little more attention to her transformation, yes. You reach down with a hand, which Isla gratefully accepts, and once she’s standing, she gives herself a gentle pat-down all over, as if not quite believing the transformation she’s undergone. Well, you can help with that - with a well-placed pinch on the rear. Acceptably juicy, yet firm; Isla yelps, then glowers at you with no small amount of embarrassment.", parse);
					Text.NL();
					Text.Add("Yeah, you’d say she’s looking quite fine. So long as she keeps this up, she’ll be scooped up once this spring guardian gig is done.", parse);
					Text.NL();
					Text.Add("<i>“I guess I just needed that push to take the plunge,”</i> Isla replies as she studies her reflection in the spring, her ire fading into contentment at the sight, perhaps even a little surprise at how effective the changes were. Slowly, the sable-morph cups one furry breast in the palm of her hand and gives it a gentle squeeze, sighing softly at the pressure. <i>“Suppose I should thank you.”</i>", parse);
					Text.NL();
					Text.Add("No worries. If she ever feels the need to… ah, explore her improved figure, you’ll be more than happy to help.", parse);
					//TODO Rel
				}
				else if(figure == Isla.Figure.Womanly) {
					isla.flags["Figure"] = Isla.Figure.Voluptuous;
					
					Text.Add("Isla grins at your suggestion, and cocks her head at you. <i>“Heh… I honestly think I don’t look too bad like this. But you’ve got a point… and it’d be worth it to see the look on their faces when they discover how favored I’ve been by the spirits.”</i>", parse);
					Text.NL();
					Text.Add("Of course.", parse);
					Text.NL();
					Text.Add("<i>“Hah, don’t think I don’t know that you’ll be getting something out of this,”</i> Isla replies, wrinkling that tiny black button-nose of hers. <i>“Not that I mind, I suppose. Come along, then - should get started soon. Still remember how it felt the last time…”</i>.", parse);
					Text.NL();
					parse["day"] = world.time.LightStr("sunshine", "moonlight");
					parse["skin"] = player.SkinDesc();
					Text.Add("Ha, yeah. Together, the two of you step out into the [day] and make a beeline for the spring, its aura of warmth hitting your [skin] from quite the distance. Without hesitation, Isla sets aside her spear and quiver, setting them down on a nearby boulder, then makes a show of pulling off her loincloth. Flexible sable thumbs slide into the string waistband of her loincloth, and a gentle tug has her sliding the garment over her ample hips and down her legs. Isla doesn’t say anything, but makes sure you’re watching as she sends away her loincloth with a lazy kick and takes a step toward the spring. Although the body-paint patterns are identical to the ones she’d been wearing on her once-girlish figure, the way they interact with her now more ample physique are much more pleasing to the eye.", parse);
					Text.NL();
					Text.Add("<i>“I will say,”</i> she says with a sigh of pleasure as she removes her strings and undoes her braid, <i>“it does feel very good to be wanted, as opposed to the alternative.”</i>", parse);
					Text.NL();
					Text.Add("Indeed, indeed. You find a nearby rock to seat yourself upon, and wait for Isla to saunter up to the spring. She toes the steaming water twice, then slinks in with a purr of contentment, her luxurious dark fur clinging wetly to her womanly curves as the waters close in up to her neck.", parse);
					Text.NL();
					Text.Add("How does she feel?", parse);
					Text.NL();
					Text.Add("<i>“All warm and wet. Wonder if that’s how cubs feel when they’re in mommy’s tummy.”</i>", parse);
					Text.NL();
					Text.Add("You’re about to give your reply when a soft moan escapes Isla’s muzzle, and her tiny pink tongue runs over her lips. She draws in a deep breath, moans louder this time, and shudders from head to toe. Looks like it’s starting!", parse);
					Text.NL();
					Text.Add("As with her previous dip in the spring, the first changes begin in Isla’s breasts. Already a large B, they begin ballooning outwards, hemispherical lady lumps turning teardrop-shaped as more and more mass flows into them, the growth occurring in small spurts. Stiff and erect, her nipples peek out from her chest fur, followed quickly by deep pink areolae. Cupping the generous amounts of breastflesh she’s gained - now maybe a low D, large enough for her hands to cover but not fully engulf - Isla begins fondling her nipples eagerly, her fingers seeming to move of their own accord. Small whines escape the sable-morph’s muzzle as she teases the sensitive nubs of flesh, reveling in the enhancements that the spring’s magic is giving her.", parse);
					Text.NL();
					Text.Add("Slowly, the changes sweep over Isla’s body, accentuating her hourglass figure and rendering it even more blatant. Centered about her womanhood, the magic runs its course - it wasn’t that obvious the last time, but it seems like her body is transforming much more earnestly now. As you watch in rapt fascination, Isla’s cleft grows more pronounced and defined, her feminine folds thickening before puffing up with heat, advertising her fertility and sexual readiness. She closes her eyes and throws her head back as her hips widen again, giving her room to take much thicker cocks - and birth bigger, healthier cubs, if it comes to that. They were womanly before, but coupled with her swelling ass, they’re now truly juicy and voluptuous.", parse);
					Text.NL();
					Text.Add("Even her face is changing, her eyes growing wider and rounder, her cheeks and jaw more delicate, her muzzle and lips softer. They look just perfect for kissing… or sucking and licking, for that matter.", parse);
					Text.NL();
					Text.Add("Panting, Isla gazes down at her cunt needily, but doesn’t seem quite willing to let go of her newly enhanced rack. You’re only more than willing to take over breast duty, leaving the sable-morph’s fingers free to slip between her lush thighs and explore her most intimate place. Mm, her boobs sure are still firm and perky, but she’s now got enough heft to her chest that she’s definitely going to be needing some form of support now.", parse);
					Text.NL();
					Text.Add("Her face is heated, her eyes glazed, her body trembling, and she cries out loud in orgasm as the most important changes begin taking place - the internal ones. You can’t rightly tell what’s going on inside the sable-morph, but she is desperately pumping her fingers to the hilt into her snatch at a furious pace. Then, without warning, her normally concave belly swells slightly, leaving you to wonder what just happened back there.", parse);
					Text.NL();
					Text.Add("Still, it looks like this is a good enough point to get her out of there. Though riddled with lust, Isla still responds to your urging, and shakily steps out of the steamy waters - with more than a little help from you, of course. She’s still unused to her new stance and proportions, and leans against the boulder with her spear as she gets a hold on her new form. Her recovery is a lot quicker this time around, and before long she’s her old self.", parse);
					Text.NL();
					Text.Add("Does she like it?", parse);
					Text.NL();
					Text.Add("Isla takes her time in replying, instead running her hands across her lush, childbearing hips, over her narrow waist and ending up at cupping her luscious breasts. Slowly, she bends over and picks up her loincloth, testing her full range of motion and showing off to you while about it. <i>“Oh, aye. Very much indeed. Although I’ll need something to hold these puppies up, and it seems like this won’t fit my bottom any more…”</i> She stretches out the fabric between her fingers for emphasis. <i>“Guess I’ll just have to learn a lot more needlework fast.”</i>", parse);
					Text.NL();
					Text.Add("Well, if she ever needs help adjusting to her new body…", parse);
					Text.NL();
					Text.Add("Isla’s muzzle splits into a grin. <i>“Yeah, yeah, I know. Don’t worry.”</i>", parse);
					//TODO Rel
				}
				else { //Curvies
					Text.Add("<i>“Heh. Much as I’d like to be the best looker on the whole of Eden, the spring does have its limits, you know,”</i> Isla says with a chuckle and sultry grin. <i>“‘Sides, I’m already pretty smashing like this. Can’t improve on a figure of perfection, can ya? Being balanced and all that.”</i>", parse);
					Text.NL();
					Text.Add("Looking over Isla again, you have to admit that she’s already where she needs to be - the spring isn’t going to be “enhancing” her any further. Well, on the bright side, it does mean she’ll be able to enjoy a relaxing soak without having to worry about waking up to a new body.", parse);
					Text.NL();
					Text.Add("<i>“Right, and I don’t have to trek down all the way to bathe, which makes dealing with my hair and fur quite a bit easier. Hey, maybe <b>you</b> should have a go instead.”</i>", parse);
					Text.NL();
					Text.Add("You’ll consider it deeply.", parse);
				}
				Text.Flush();
				
				Scenes.Isla.TalkPrompt();
			}, enabled : enabled
		});
	}
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“Something else on your mind?”</i>", parse);
		Text.Flush();
		Scenes.Isla.Prompt();
	});
}

Scenes.Isla.TummyRub = function() {
	var parse = {
		playername : player.name
	};
	
	var figure = isla.Figure();
	
	var womb = isla.PregHandler().Womb();
	var preg = womb && womb.pregnant;
	var stage = preg ? womb.progress : 0;
	var num = womb.litterSize;
	
	Text.Clear();
	Text.Add("Cuddling up to the sable-morph, you wrap one arm about her back, easing the both of you into a half-sitting, half-lying position with your backs to the mountainside. She instinctively tenses at the touch, but soon relaxes as you trail one finger down the fertile swell of her midriff.", parse);
	Text.NL();
	Text.Add("Heh, she’s starting to get big, isn’t she? How’s she holding up under that weight?", parse);
	Text.NL();
	if(stage < 0.6) {
		Text.Add("<i>“Doing quite well,”</i> Isla replies with a sigh as your finger lingers by her belly button, drawing small circles in her luxuriant fur. <i>“Hey, that feels tingly.”</i>", parse);
		Text.NL();
		Text.Add("Tingly? Why, does that mean you should do more of it?", parse);
		Text.NL();
		Text.Add("<i>“Wouldn’t mind if ya did. It feels really good. All satisfying-like, what with being knocked up and all… actually, come to think of it, I’ve been feeling a little stretched round those parts lately.”</i>", parse);
		Text.NL();
		Text.Add("Well, if she’s in need of a little relief, you’ll just go ahead and make her feel comfortable, then.", parse);
		Text.NL();
		Text.Add("<i>“Yeah, I could use as much. Go ahead, warrior. Let’s see what you’ve got.”</i>", parse);
	}
	else if(num <= 1) {
		Text.Add("<i>“Starting to get a little weighed down here,”</i> Isla replies, a little huff of breath escaping her small nose. <i>“Still holding up pretty good, though.”</i>", parse);
		Text.NL();
		Text.Add("As she should be, you reply as you slowly caress her burgeoning baby bump, feeling the gentle throbbing and pulsing of her womb at work. The fact that your fingers are running through her luxuriant fur at the same time only makes things better for you, and you linger for a little while on the rounded peak of her belly, teasing her popped-out belly button for a bit.", parse);
		Text.NL();
		Text.Add("How <i>does</i> she keep her fur like that, anyway? With all the running around she does, you’d have expected tangles and snarls to run rampant in it.", parse);
		Text.NL();
		Text.Add("<i>“By being very careful. Now, hold that spot for me - right, ah. That one was particularly sore…”</i>", parse);
	}
	else { //twins/triplets
		Text.Add("<i>“Oof. I get around okay, but at times the skin feels so stretched that I wonder if I’m going to actually pop. Like really, just burst…”</i>", parse);
		Text.NL();
		Text.Add("Psh, she knows she doesn’t need to worry about that. Such a silly sable she is.", parse);
		Text.NL();
		Text.Add("Isla pouts. <i>“Yeah, I know, but that doesn’t stop me from <b>feeling</b> that way. Thought you said you were going to give me a hand with that?”</i>", parse);
		Text.NL();
		Text.Add("But of course. Digging your fingers deep into Isla’s warm fur, you slide your fingers across the full, fertile swell of her baby bump, feeling the shifting and squirming of the cubs within. Her skin’s stretched over her womb, taut as a drum, and Isla closes her eyes and murmurs under her breath as you pet away with extreme prejudice.", parse);
		Text.NL();
		Text.Add("<i>“Spirits above, that’s much better,”</i> she breathes. <i>“I’m certainly looking forward to being able to see my feet again, for one. It’s been a while since they vanished, and I wouldn’t mind knowing where they are. Come to think of it, I wouldn’t mind being able to see my tummy button again, too.”</i>", parse);
	}
	Text.NL();
	Text.Add("Back and forth, back and forth, your fingers ply up and down the rise of Isla’s growing pregnancy, sidling up to just beneath her cleavage to stopping mere inches from her mound. You pay a little extra attention to the underside of her lower belly, feeling for the spot where the heat of her womb is the most intense, then apply pressure and start rubbing in circles.", parse);
	Text.NL();
	Text.Add("It’s not long before you’re rewarded with a kick from within, faint but distinctly present. Isla squeaks in surprise, then looks up at you.", parse);
	Text.NL();
	Text.Add("<i>“Oi! Don’t do that!”</i>", parse);
	Text.NL();
	Text.Add("You raise your eyebrows and whistle innocently. Don’t do what?", parse);
	Text.NL();
	Text.Add("<i>“That!”</i> Breathing deeply, Isla reaches for her bump, soothingly rubbing the firm, swollen swell, but winces again when another kick comes from within, this time strong enough to cause a distinct, if momentary bump on her midriff.", parse);
	Text.NL();
	Text.Add("<i>“Oy, it’s not fair! You’re not supposed to gang up on me like that, one on the inside, one on the outside…”</i>", parse);
	Text.NL();
	Text.Add("Oh ho ho, it certainly wasn’t intentional, but you’ll take what you can get. Moving your hands to the sides of Isla’s baby bump, you start off with a number of smooth, easy strokes, but change those to tickles without warning. It certainly catches Isla by surprise; she squeals and kicks feebly in a mock attempt to fight you off, giggling all the while.", parse);
	Text.NL();
	if(stage < 0.6) {
		Text.Add("To be honest, she puts up a pretty good fight even while play-acting - her tummy isn’t <i>that</i> weighty to the point of being severely cumbersome yet, especially for someone like her. Nevertheless, you decide to leave nothing to chance, clambering atop her and pinning her down with your weight even as you shower her delicate midriff with tickles.", parse);
		Text.NL();
		Text.Add("<i>“Hee hee!”</i> she manages to blurt out between giggles. <i>“C’mon, [playername]… ya can stop now, please? Please?”</i>", parse);
		Text.NL();
		Text.Add("As Isla wriggles about under you, she definitely puts on quite the show of slinky slipperiness that her kind’s so famed for. There’s little doubt that had she been really trying, she’d have had no problem getting out from under you, but it looks like she’s having too much fun for that.", parse);
	}
	else if(num <= 1) {
		Text.Add("Her large tummy does get in the way some, but she nevertheless remains quite agile as you continue eliciting fits of laughter from her. Of course, you’re not alone in the endeavor - little bumps rise on the surface of Isla’s stretched womb, helpfully letting you know that your cub’s decided to join in the fun by tickling his or her mother from the other side, too.", parse);
		Text.NL();
		Text.Add("<i>“Hee hee!”</i> Isla wheezes breathlessly, gasping for air between giggles. <i>“C’mon, double teaming me like this isn’t fair, you’re already tiring me out…”</i>", parse);
		Text.NL();
		Text.Add("Of course it’s not fair. It’s not remotely supposed to be fair. Wherever did she get that quaint idea that this was supposed to be so-called fair, whatever that word means? Another series of noogies and tickles to the sable-morph’s sensitive belly has her utterly in your power, squealing and giggling away; seems like her hair trigger nature isn’t only reserved for sex.", parse);
	}
	else { //twins/triplets
		Text.Add("<i>“‘S not fair!”</i> she mewls again, feebly trying to slap away your hands as you assault her prodigiously swollen baby bump with tickly fingers. <i>“You lot, you’re ganging up on me!”</i>", parse);
		Text.NL();
		Text.Add("Why, indeed you are. How perceptive she is!", parse);
		Text.NL();
		Text.Add("Isla squeals, then breaks out into another giggling fit as you pet and tickle her tummy. With how big her pregnancy has become, there’s a lot of tummy for you to tend to - it’s a good thing that your cubs are helping out, nudging and squirming from the other side with enough force that bumps and bulges emerge on the taut, rounded surface of her midriff.", parse);
		Text.NL();
		Text.Add("Isla moans softly, her mouth hanging open loosely to reveal sharp little teeth as she gasps for breath. Her breasts heave, her huge pregnancy rises and falls, and yet she can’t stop giggling thanks to your naughty, ticklish fingers. Seems like the bigger her tummy gets, the more sensitive it becomes, which would only make sense.", parse);
		Text.NL();
		Text.Add("<i>“Okay, okay, you win. You’re tirin’ me out in no time flat at all.”</i> She stops to catch her breath a moment, then continues. <i>“Just you wait till I don’t have this in the way, I’ll make you squeal like a pig. Squeal, y’ hear me?”</i>", parse);
		Text.NL();
		Text.Add("You’ll hold her to that, then.", parse);
	}
	Text.NL();
	Text.Add("<i>“Spirits above,”</i> Isla sighs as you finally stop the tickling, slumping back and letting her head loll on the plateau’s soft grass. <i>“You’ve gone and tired me out good…”</i>", parse);
	Text.NL();
	Text.Add("Wasn’t it fun, though, and doesn’t her tummy feel better now?", parse);
	Text.NL();
	Text.Add("<i>“Yeah, but I’m not letting you off like that.”</i> ", parse);
	Text.NL();
	Text.Add("Well, maybe you could pay that debt with a backrub, too. Now that you’ve dealt with her front, why not her behind, too?", parse);
	Text.NL();
	if(stage < 0.6) {
		Text.Add("<i>“Eh… sure wouldn’t mind someone taking the knots out of my back. Been losing a bit of sleep lately because of them - nothing to worry too much about, though. Y’ gotta promise one thing, though.”</i>", parse);
		Text.NL();
		Text.Add("What would that be?", parse);
		Text.NL();
		Text.Add("<i>“No more surprise tickles, ‘kay? That last bout just about did me in.”</i>", parse);
		Text.NL();
		Text.Add("Hah, is that what she’s worried about? Well, she needn’t have worried; any surprise tickles you might deliver will be very, <i>veeery</i> gentle so as not to exhaust her. Heh.", parse);
		Text.NL();
		Text.Add("<i>“Oy, I mean it!”</i> she begins, but you’ve already laid your hands on her back and gotten to work.", parse);
	}
	else if(num <= 1) {
		Text.Add("Isla looks a little uncertain, no doubt with the memory of your relentless tickle assault still fresh in her mind, but she finally gives in and rolls onto her side, presenting her back to you. <i>“If ya don’t mind, then. Hey, you made me like this; least ya can do is to help me feel a little better.”</i>", parse);
		Text.NL();
		Text.Add("It’ll be your pleasure, then. Laying your hands on the firm muscles of Isla’s back, you push your fingers in and begin.", parse);
	}
	else { //twins/triplets
		Text.Add("<i>“Oh, tryin’ to make up for running poor old me out of breath? You’re more than welcome t’ do so.”</i> That said, the sable-morph eagerly thrusts her back out at you. <i>“Not that I’m resenting these little ones, but at times they can get so damned heavy… yer more than welcome to work out the knots in my back, they’re driving me crazy.”</i>", parse);
		Text.NL();
		Text.Add("She’s really very eager for that backrub, isn’t she?", parse);
		Text.NL();
		Text.Add("Isla looks at you over her shoulder, smiles, and rolls her eyes at you. <i>“What part of ‘driving me crazy’ did you not understand back there? Now put your effort where your mouth is an’ get to it!”</i>", parse);
		Text.NL();
		Text.Add("As she wishes. Positioning your hands along either side of Isla’s back, you dig your fingers in, getting a good feel for the firm muscles.", parse);
	}
	Text.Add(" Slowly, you begin kneading away, putting your back into it as you roll your knuckles into the small of Isla’s back. A small sigh of relief escapes her muzzle, the sable-morph clearly enjoying the amateur massage you’re delivering to her. Her soft, furry tail swings from side to side, idly batting at you as you continue working away; it’s not a wholly unpleasant feeling, much like being dusted by a very soft feather duster.", parse);
	Text.NL();
	Text.Add("How does she feel?", parse);
	Text.NL();
	Text.Add("<i>“Much better, thank ye.”</i>", parse);
	Text.NL();
	Text.Add("Good, good. You’ll get to the rest of her in good time. For now, she should just lie back and relax.", parse);
	Text.NL();
	Text.Add("<i>“So long’s you don’t start anything funny…”</i>", parse);
	Text.NL();
	Text.Add("Who, you? Whatever would give her that idea? Spirits forbid, you’re so hurt that she would accuse you of such a thing!", parse);
	Text.NL();
	Text.Add("<i>“Hah.”</i>", parse);
	Text.NL();
	Text.Add("Bit by bit, you start moving away from the small of her back, alternating between kneading and pounding as you soothe the muscles to either side of her spine. Isla squeaks happily and appreciatively as you work away, and pushes her back against your touch, eager to be rid of the tenderness the weight of her cubs has imposed on her. It’s cute - once you know which buttons to push, you can play her like a fiddle, but then again isn’t that the same of most people anyway?", parse);
	Text.NL();
	Text.Add("<i>“Ah, that sure feels great…”</i>", parse);
	Text.NL();
	Text.Add("Isn’t it? Smiling, you push her braid aside and roll your knuckles against her shoulders, eliciting a few small, happy noises from the back of her throat, then slide them down her back until they’re just above her tailbone.", parse);
	Text.NL();
	if(figure != Isla.Figure.Girly) {
		Text.Add("Your eyes are drawn to the pert, rounded form of Isla’s butt, so much more improved than the flat ass cheeks she’d started out with when you first met her. On impulse, you give one of them a light smack, watching with no small amount of satisfaction the firm jiggle that ripples outward from your touch.", parse);
		Text.NL();
		Text.Add("<i>“Eep! Oy!”</i>", parse);
		Text.NL();
		Text.Add("Aww. She was just so tempting and womanly that you couldn’t help yourself.", parse);
		Text.NL();
		Text.Add("She looks over her shoulder at you. <i>“Y-ya really mean it?”</i>", parse);
		Text.NL();
		Text.Add("Of course. Now, why doesn’t she just relax so you can finish up?", parse);
		Text.NL();
	}
	Text.Add("You run your fingers down Isla’s back in one last pass, focusing your efforts on her waist and sides, then move up to her shoulders once more. When you’re finally done, the sable-morph heaves a huge sigh of relief and rolls her shoulders in satisfaction.", parse);
	Text.NL();
	Text.Add("How does she feel?", parse);
	Text.NL();
	Text.Add("<i>“Much better now, thank ye. I’ll be sleeping much better t’night.”</i>", parse);
	Text.NL();
	Text.Add("Glad you could help. Is there any other part of her body which’s still aching?", parse);
	Text.NL();
	Text.Add("<i>“Well, these dugs o’ mine have been getting all heavy of late…”</i>", parse);
	Text.NL();
	Text.Add("What, is that an invitation you hear? Does she need some relief for those aching jugs of hers?", parse);
	Text.NL();
	Text.Add("<i>“Wait, I never said -”</i> Isla begins, but her words are cut off by a soft squeal as you embrace her from behind, wrapping your arms around her squarely to cup her breasts with your hands. She wriggles a little, but you soon put a stop to that by rubbing your thumbs against her nipples, coaxing a soft moan from her mouth. ", parse);
	if(figure == Isla.Figure.Girly) {
		Text.Add("Mm, wonderful. Her breasts may be nothing to look at normally, but their milky swelling has caused them to grow into perfectly palmable orbs that fit snugly into your cupped hands. As you begin your gentle massaging, beads of pearly white milk begin leaking from her nipples, slowly seeping into her fur.", parse);
	}
	else if(figure == Isla.Figure.Womanly) {
		Text.Add("Now that’s more like it; all she has to do is lie back and enjoy things as they happen. Not too much to ask, is it? The effects of the spring on Isla’s physique are readily apparent - engorged with production in preparation for the eventual birth, the sable-morph’s baby feeders are large enough such that your hands can’t engulf all of their warm, slightly jiggly goodness.", parse);
		Text.NL();
		Text.Add("Another moan, more impassioned this time, sounds in the air as you apply pressure to her tender boobflesh. Slowly but surely, heat rises into her chest as her nipples harden even further, and a steady dribble of warm milk flows into your palm.", parse);
	}
	else { //curvy
		Text.Add("<i>“Ngh… oh! Oh!”</i>", parse);
		Text.NL();
		Text.Add("Did that feel good? Sure sounds like it did.", parse);
		Text.NL();
		Text.Add("Isla pants and moans whorishly, her little pink tongue hanging out of her maw as you slide your fingers off her nipples and work on circling her fat areolae. The spring’s certainly worked a wonderful magic on her body - large and warm, the load of baby food within causing just a bit of sag, Isla’s milk-jugs have matured to the point where you can hardly hope to hold all of her breastflesh in your hands alone. Even just trying as you are, cupping the rounded ends of her boobs with your palms, you can <i>feel</i> her firm cans and the payload within roll about in your grasp, desperate to get out.", parse);
		Text.NL();
		Text.Add("That’s just the beginning, though. You can definitely feel a flush of heat welling up in Isla’s chest, delightfully warm as it firms up her breastflesh and causes her nipples to protrude even further, but the best part of it all are the twin streams of thick pearly milk which erupt from her nipples, squirting into the grass.", parse);
		Text.NL();
		Text.Add("Mm… delicious.", parse);
	}
	Text.NL();
	Text.Add("Once you’re sure you have a firm hold on Isla’s breasts, you begin to milk her by hand, gently pulling on each boob in a rhythmic up-down motion. Your efforts are soon paid off: gentle squirts of milk start flowing freely from each darkened nipple as you massage her baby feeders, relieving the aching things of their excess milk.", parse);
	Text.NL();
	Text.Add("On her part, Isla cringes and closes her eyes, instinctively thrusting her chest out so you can get complete, unfettered access to the entirety of her chest, oh-so-eager to have her tenderness soothed. You’re only more than willing to comply, and soon the air is heavy with the sweet smell of warm, fresh milk, growing ever stronger as her milk lets down in earnest.", parse);
	Text.NL();
	Text.Add("<i>“Ngh! Oh! Ohhhh…”</i>", parse);
	Text.NL();
	Text.Add("You stop your milking for a moment to turn Isla’s head and gaze into her eyes, unfocused and addled with a mixture of pleasure and wonder. She mewls plaintively, clearly wondering why you’ve stopped, then starts panting again as you start up your efforts once more.", parse);
	Text.NL();
	if(figure == Isla.Figure.Girly) {
		Text.Add("With how enthusiastically you’re milking her, it doesn’t take long for Isla’s small breasts to be completely drained. Small streams quickly dry up to dribbles, and then into drops.", parse);
		Text.NL();
		Text.Add("Nevertheless, you make sure that you give her a full massage, else she’ll be complaining about an aching chest again before long. You wouldn’t want that, would you? Or maybe you do…", parse);
	}
	else if(figure == Isla.Figure.Womanly) {
		Text.Add("Enthusiastic as you are, it still takes a little while for Isla’s milkiness to start tapering off. The magical spring’s certainly done its job, that’s for sure - not just outside, but inside as well. By the time you’re done draining her tits with a full massage, the grass and ground underneath her are absolutely sodden with sweet-smelling milk - streams slowly become dribbles, and from there drops until the she’s well and truly emptied.", parse);
		Text.NL();
		Text.Add("Not that your efforts weren’t welcome, of course. Isla’s body readily betrays her arousal, her breasts having perked up even more, the flush in her chest burning away, her breath heated and heavy. Savoring the last of the experience, you shower every last square inch of breastflesh with light, tender caresses, making sure that all her tensions are soothed and her stresses relieved.", parse);
		Text.NL();
		Text.Add("You finish up by drawing small circles about her slightly bulging areolae, fingertips moistened with milk, then flick her nipples a final time before letting go of that firm deliciousness.", parse);
	}
	else { //curvy
		Text.Add("Isla’s milk makers are as productive as their size would suggest. Fat and prominent as they stick out stiffly from her chest fur, her nipples cap bulging areolae and breasts that are completely unrecognizable from the practically flat chest she once had, testament to the transformative spring’s power. Rivers of milk stream from her milk cans, practically bursting forth from the sheer pressure within, their flow seemingly without end.", parse);
		Text.NL();
		Text.Add("Unable to hold back any longer, the sable-morph lets out a whorish wail as you pull and squeeze away, crying out and bucking against you as an orgasm washes through her body. Messy sexual fluids stain her crotch fur and loincloth, and you let her catch her breath for a moment or two before continuing.", parse);
		Text.NL();
		Text.Add("<i>“Ngh… oh. Ah!”</i>", parse);
		Text.NL();
		Text.Add("Why, did you hit a particularly tender spot?", parse);
		Text.NL();
		Text.Add("She just pants in reply, breath heated thanks to her flushed, burning chest.", parse);
		Text.NL();
		Text.Add("Slowly but methodically, you drain Isla of what milk remains in her baby feeders. Firm yet heavy, her breastflesh is a delight to touch, and you play your fingers all over them, feeling just the slightest bit of give form as more and more milk is drained from her. It soaks her fur, wets your fingers - which is just perfect for you to caress her bulging areolae and engorged teats with, drawing small circles in them until her breathing grows quick and she looks like another climax’s coming on her.", parse);
		Text.NL();
		Text.Add("For better or for worse, it doesn’t happen, though. When she does run dry, it happens all of a sudden - gushing rivers of white cream easing up into dribbles and dying out within moments. Slowly, you give her ample chest one last squeeze, then turn to survey your handiwork.", parse);
		Text.NL();
		Text.Add("Emptied from their reserves, all that mustelid milk hasn’t just soaked the ground sodden, it’s actually pooled into puddles of considerable size. Wow, generous as they were, you didn’t think that Isla’s milk jugs could be filled to that extent. She’ll have no problem feeding the cubs when she finally pops, that’s for sure.", parse);
	}
	Text.NL();
	Text.Add("Groaning and squirming, Isla slinks out of your grasp and collapses to the ground, still panting away like a bitch in heat. Your run your fingers through one of the few spots in her fur that’re still relatively dry, and ask her if she’s still sore anywhere.", parse);
	Text.NL();
	Text.Add("<i>“No, but you’ve done gone and tired me out…”</i>", parse);
	Text.NL();
	Text.Add("So she’s not sore any more, eh? It looks like your full-body massage was a rousing success, then. Would she mind if - your thoughts are stopped halfway by a gentle snore coming from the ground. Oh. Looks like she’s curled up in on herself and gone to sleep, hugging her baby bump protectively, soft mountain grass pillowing her head.", parse);
	Text.NL();
	Text.Add("Well, if that isn’t the cutest thing ever…", parse);
	Text.NL();
	Text.Add("Still, guess that leaves you to your own devices. You give Isla a pat on her brow, and after making sure that the plateau is safe, head on back down the trail. Best to give her a little alone time, yes?", parse);
	Text.Flush();
	
	world.TimeStep({hour: 4});
	//TODO REL
	
	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.Highlands.Hills);
	});
}


/* TODO Rel boosts

 */
