
import { Scenes } from '../../event';
import { Entity } from '../../entity';

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
	
	this.flags["Met"] = Isla.Met.NotMet;
	this.flags["Talk"] = 0;
	this.flags["Figure"] = Isla.Figure.Girly;
	this.flags["Kids"] = 0; //Number of kids birthed (by the PC)

	this.springTimer = new Time();
	
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
	Sex    : 2, //First time fucked
	SexVag : 4 //First time pitch vag
};

Isla.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
	
	this.springTimer.Dec(step);
}

Isla.Available = function() {
	return asche.flags["Tasks"] & Asche.Tasks.Spring_Visited;
}

// Number of kids Isla birthed by the PC
Isla.prototype.Kids = function() {
	return this.flags["Kids"];
}

Isla.prototype.Figure = function() {
	return this.flags["Figure"];
}

Isla.prototype.FromStorage = function(storage) {
	this.LoadPregnancy(storage);
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
	
	if(this.flags["Talk"] & Isla.Talk.Sex)
		this.FirstVag().virgin = false;
	
	this.springTimer.FromStorage(storage.ST);
}

Isla.prototype.ToStorage = function() {
	var storage = {
	};
	
	this.SavePregnancy(storage);
	this.SavePersonalityStats(storage);
	this.SaveFlags(storage);
	
	storage.ST = this.springTimer.ToStorage();
	
	return storage;
}

// Schedule
Isla.prototype.IsAtLocation = function(location) {
	return true;
}

Isla.prototype.PregnancyTrigger = function(womb, slot) {
	// Use unshift instead of push to make sure pregnancy doesn't interfere with scene progression
	Gui.Callstack.unshift(function() {
		womb.pregnant = false;
		
		isla.flags["Kids"] += womb.litterSize;
	});
}

//SCENES

Scenes.Isla.Impregnate = function(father, cum) {
	isla.PregHandler().Impregnate({
		slot   : PregnancyHandler.Slot.Vag,
		mother : isla,
		father : father,
		race   : Race.Ferret,
		num    : _.random(1,3),
		time   : 24*24,
		load   : cum
	});
}

Scenes.Isla.Introduction = function() {
	var parse = {
		
	};
	
	isla.flags["Met"] = Isla.Met.Met;
	
	Text.Clear();
	Text.Add("As you explore the Highlands, you find yourself in the general area of the strange spring Asche sent you to investigate last time. Yes, there’s the mountainside, and if you strain your eyes a little, you can make out the plateau on its side. Last time, you were there on business, and as they say, going somewhere on your own time is bound to be plenty different than going someplace on business… at least this time you’ll get to see the sights.", parse);
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
			Text.Add("<i>“Lost? You’re a long way from any of the proper roads, friend - or at least, what passes for roads in the Highlands. Just how long have you been wandering around?”</i>", parse);
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
			Text.Add("Isla raises an eyebrow at you, her tiny black nose twitching as she sniffs in mild distaste. <i>“Oh, come on. There’re hundreds of little pools in the Highlands, and you chose this particular one to take a look-see at?”</i>", parse);
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
			Text.Add("<i>“Can’t say I’m surprised, lowlander. This is <b>a</b> magic spring, to use that term, but whether it’s the one you’re looking for or not… well, that’s anyone’s guess. The Highlands are full of little pools like these, touched by a spot of magic or the other. Don’t know if it’s the one you were looking for, but the fact that you’re admitting it so readily means that you probably aren’t up to any mischief. Probably.”</i>", parse);
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
		Text.Add("You see. Both of you lapse into silence for a bit, and Isla takes the chance to have another swig from the waterskin. At last, you’re the one to speak - she doesn’t seem like she’s enjoying the job very much, is she? While you’re not overly familiar with the ins and outs of all the Highlands’ little tribes, “spring guardian” sounds like something fairly prestigious.", parse);
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

Scenes.Isla.Prompt = function() {
	var parse = {
		
	};
	
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
	options.push({ nameStr : "Sex",
		tooltip : "Proposition Isla for sex.",
		func : function() {
			if(isla.flags["Talk"] & Isla.Talk.Sex)
				Scenes.Isla.Sex.Repeat();
			else
				Scenes.Isla.Sex.First();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“Well, see you around!”</i>", parse);
		Text.Flush();
		Gui.NextPrompt();
	});
}

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
	Text.Add("Finished with surveying the generalities, you shift your attention to the details. Although graced with long, flexible fingers, Isla’s hands look more like an animal’s than a human’s, her palms possessed to paw-pads of sorts, each digit capped with a small, hooked claw instead of nails. Her toes aren’t too different, too, and you can see how such would be an advantage in the rough, uneven terrain of the Highlands, considering she goes about barefoot with no problems at all. Of course, that long fluffy tail of hers has a practical use in helping her keep balance, but that doesn’t stop you from wanting to pet and stroke it.", parse);
	Text.NL();
	Text.Add("<i>“You done? Standing still is so tiring.”</i>", parse);
	Text.NL();
	Text.Add("Well, actually you weren’t, but if you asked her to hold her place any longer she might just get bored and leave anyway. Reluctantly, you nod, and Isla immediately rolls back onto the balls of her feet, her body sagging slightly with released effort.", parse);
	Text.NL();
	Text.Add("<i>“Phew! So now that that’s over with, what you want to get done today?”</i>", parse);
	Text.Flush();
	
	isla.relation.IncreaseStat(30, 1);
	
	world.TimeStep({minute: 15});
	
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
			Text.Add("<i>“About me? I can’t really say much. I guess I’ve had a pretty good life so far… peaceful childhood, was sometimes a bit hungry but never actually starved, the neighboring tribes never actually bothered us… that’s how it is in the Highlands. Little scattered tribes of morphs living beyond the reach of the kingdom in the mountains, just doing their own thing and staying out of peoples’ way.”</i>", parse);
			Text.NL();
			Text.Add("You weren’t asking about the polity of the Highlands, you were asking her about herself.", parse);
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
			Text.Add("Isla looks you up and down, then returns the grin. <i>“Yeah, I guess. But there we have it. I like to think I’m a pretty down-to-earth girl.”</i>", parse);
			Text.Flush();
			
			isla.relation.IncreaseStat(40, 2);
			world.TimeStep({minute: 15});
			
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
			
			isla.relation.IncreaseStat(40, 2);
			world.TimeStep({minute: 15});
			
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
			
			isla.relation.IncreaseStat(40, 2);
			world.TimeStep({minute: 15});
			
			Scenes.Isla.TalkPrompt();
		}, enabled : true
	});
	options.push({ nameStr : "Tribe",
		tooltip : "So, what are her people like, anyway?",
		func : function() {
			Text.Clear();
			Text.Add("So, what are her people like, anyway? With all the small tribes that dot the Highlands, it’s hard to run into any particular one, whether it be intentional or by accident.", parse);
			Text.NL();
			Text.Add("<i>“Y’know, that word always trips me up. ‘Like’. Sure, a lowlander like you’s probably seen much, but when walking anywhere either means going ‘round a mountain or climbing it, you don’t tend to see much.”</i> She thinks a moment. <i>“Don’t know if I’m rightly answering your question, but we’re doing as we’ve always done, so long as anyone can remember. Couple hundred folks living in a hidey-hole between two hills out of the wind and rain, digging out land good dirt won’t wash off from during the rains and finding spots to graze the herds.”</i>", parse);
			Text.NL();
			Text.Add("It sounds like the rather idyllic life.", parse);
			Text.NL();
			Text.Add("<i>“I didn’t like it.”</i> Isla continues. <i>“Thought it was too boring - the only thing that really happened was the twice yearly clan get-together where folks would pair off, prevent blood from getting too stale? There were times when I thought I’d have a better life if I snuck down to the lowlands and went to ‘seek my fortune’, as some would put it.</i>", parse);
			Text.NL();
			Text.Add("<i>“Of course, now that I’ve been here a while, I’ve been rethinking things,”</i> she finishes with a small sigh. <i>“Long stretches of absolutely nothing punctuated with moments of sheer terror - it’s enough to make me think that once all this is over and I head back, I should be just grateful to be tending to the herds. If I want excitement, a spot of gossip will do just fine.”</i>", parse);
			Text.NL();
			Text.Add("Right. Coming back to the point, though, so her tribe is mostly like the others in the Highlands?", parse);
			Text.NL();
			Text.Add("<i>“Most are, to be honest. What we are aside, this place has a tendency to mold people into its liking. The old stories had it that when many of the peoples first arrived, they brought with them their own ways of doing things from the places they’d come from. Over time, though, living up in these mountains, they changed to suit the land rather than the other way around.</i>", parse);
			Text.NL();
			Text.Add("<i>“My tribe, we’ve got a stone circle. The zebras, they’ve got a spring. We mustelids dance to bring the rain, and the jackals dance to drive it away. I’m sure the minotaur do their own rituals and have their own sacred places, too, although I’ve never stopped to ask those three whelps about it. Point I’m getting at, though, is that all the highland tribes are quite the same in what we do. It’s what we do it <b>with</b> and why we do it that’s the important difference.”</i>", parse);
			Text.NL();
			Text.Add("Ah.", parse);
			Text.NL();
			Text.Add("<i>“I guess I haven’t really answered your question,”</i> Isla continues. <i>“But what <b>do</b> you expect me to say about us? Anything you’ve heard about the highland tribes that’s true, you could probably apply it to mine and you wouldn’t be too far off the mark.”</i>", parse);
			Text.NL();
			Text.Add("Well, while she may think it completely mundane, perhaps others who aren’t so familiar with the Highlands and the local cultures might think otherwise. You can see where she’s coming from, though - familiarity breeds contempt, as the saying goes, and maybe she’s too close to things to see them clearly. Guess you’ll just have to wander the Highlands some more and hope you bump into the locals to be able to judge for yourself.", parse);
			Text.NL();
			Text.Add("Isla sniffs, wrinkling her nose. <i>“Well, if you really want to. I don’t know if I’d feel the same way if I were in your place, but I’m obviously not you. Can we move onto something else, please?”</i>", parse);
			Text.Flush();
			
			isla.relation.IncreaseStat(40, 2);
			world.TimeStep({minute: 15});
			
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
					Text.Add("With a single nimble movement, Isla slips her body under the water’s surface, everything from her chin down submerged in the spring’s magic. Her soft fur clings to her skin, outlining her somewhat boyish figure for a clean and clear appraisal; with any luck, it won’t be boyish for very much longer. Now it’s just a waiting game - you settle down on the pool’s edge to wait… and watch, of course.", parse);
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
					
					isla.relation.IncreaseStat(100, 10);
					world.TimeStep({hour: 1});
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
					
					isla.relation.IncreaseStat(100, 10);
					world.TimeStep({hour: 1});
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
	
	isla.relation.IncreaseStat(100, 5);
	
	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.Highlands.Hills);
	});
}

Scenes.Isla.Sex = {};

Scenes.Isla.Sex.First = function() {
	var p1cock = player.BiggestCock(null, true);
	var strapon = p1cock ? p1cock.isStrapon : null;
	var knot = p1cock ? p1cock.Knot() : null;
	
	var parse = {
		playername : player.name
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	isla.flags["Talk"] |= Isla.Talk.Sex;
	
	Text.Clear();
	Text.Add("<i>“What?”</i> Isla says as you broach the subject with her. The sable-morph’s round eyes grow - well, rounder, she looks pensively down at the remains in the fire pit, poking at it agitatedly. <i>“C’mon, [playername], you know better than to tease me like that.”</i>", parse);
	Text.NL();
	Text.Add("Well, that’s your cue to muster your most shocked expression. Tease her? Whatever does she mean by that? You’re completely and absolutely serious about your proposition.", parse);
	Text.NL();
	Text.Add("<i>“See, there you go again, being sarcastic and all.”</i> Isla licks her muzzle, that little pink tongue of her running over her lips, although she still isn’t looking at you. <i>“You keep on being like this, I’ll have to get mad, and I’d rather not get mad. Would spoil my day <b>and</b> yours to boot.”</i>", parse);
	Text.NL();
	Text.Add("Well… nah. You reach up to Isla’s head and muss her dark fur a little, pet those little round ears of hers. She squirms under your touch, but doesn’t pull away. What’s her hang-up?", parse);
	Text.NL();
	Text.Add("<i>“You damn well know what it is.”</i>", parse);
	Text.NL();
	Text.Add("Then it’s their loss for rejecting such a perfectly good specimen of a nice young woman like her. She may not be the prettiest face around, yes, but it’s not as if she’s some kind of hideous troll, either.", parse);
	Text.NL();
	Text.Add("<i>“It was just a bad time,”</i> Isla mumbles, although she’s clearly trying to convince herself more than tell you anything. <i>“Too many marriage alliances those couple of years amongst the clans and not enough suitable men to go around. Meanwhile, I’m not getting any younger.”</i>", parse);
	Text.NL();
	Text.Add("Well, she should just relax and enjoy her time as the spring’s guardian - since she’s going to be here for a while and there’s no changing that, she might as well be happy, shouldn’t she? Although there is one thing you do want to ask…", parse);
	Text.NL();
	Text.Add("<i>“What’s that?”</i> Isla sighs as she sinks into your arms, not knowing or caring that she’s quite literally fallen into your embrace. Her silken fur is smooth and sleek to the touch, her braid tickles your [skin], and you find yourself running your hands through her luxuriant coat as you try to frame the words properly in your mind before letting them loose.", parse);
	Text.NL();
	Text.Add("Well, there’s the spring, right?", parse);
	Text.NL();
	Text.Add("<i>“Yeah…”</i>", parse);
	Text.NL();
	Text.Add("And it does change people in certain ways, doesn’t it?", parse);
	Text.NL();
	Text.Add("<i>“That’s true… what’cha getting at?”</i>", parse);
	Text.NL();
	Text.Add("Well, if she doesn’t like how she looks, why doesn’t she just use the spring to change herself to her liking?", parse);
	Text.NL();
	Text.Add("<i>“Uh, uh, I shouldn’t.”</i>", parse);
	Text.NL();
	Text.Add("You asked for a reason. She didn’t give you a reason.", parse);
	Text.NL();
	Text.Add("Isla looks a little unsure, and you comfort the sable-morph with a series of rubs to that fuzzy tummy of hers; toned and lithe… not that you’d expect anything less from someone as active as her. <i>“Well, I <b>am</b> the guardian of the spring and all, y’know. I shouldn’t be - be using it for my own selfish wants. Wouldn’t be right.”</i>", parse);
	Text.NL();
	Text.Add("But according to her own story, wasn’t the whole point of the spirit putting it here to be for morphs of her kind to go and have a soak? Doesn’t that just make it using it for its intended purpose?", parse);
	Text.NL();
	Text.Add("Silence. As you continue stroking Isla’s front, you note that her heartbeat is speeding up, her usually slow and easy breathing coming in short huffs. Making a pleased noise in the back of your throat, you assure Isla that you know that it’s hard, and that you don’t mind if she doesn’t give an answer upfront… but it’s still something she should consider deeply.", parse);
	Text.NL();
	Text.Add("<i>“Yeah… I’ll do that.”</i>", parse);
	Text.NL();
	Text.Add("Yes, she should. Slowly nuzzling the nape of her neck, you run your palms down and across Isla’s slim hips, one hand lingering on the gentle swell thereof while the other inches closer and closer to her mound. You can feel her shivering slightly - the poor thing is so tense as your fingers dig into the soft fur between her legs and easily find the hot, bare flesh of her virgin pussy. Isla arches her back into you, whimpering uncertainly at the strange sensations coursing through her limber body, her fluffy tail wrapping itself about your waist as you spread her legs wide to get unfettered access to her nethers.", parse);
	Text.NL();
	Text.Add("Best not to ruin the moment, then. Grinning, you decide to break in Isla slowly; while she may be adept at scaling cliffs and navigating the wilds, this is a completely different kettle of fish for the sable-morph altogether, and hence uncharted territory. Best to give her some space to adjust… tracing your fingers along the outside of her netherlips, you dig into her chest fur for the nipple you know will be there. Indeed, it is, and she lets out a surprised squeak as you gently roll the soft nub of flesh between thumb and forefinger until it swells and stiffens into a hard, pink pearl in response to the stimulation.", parse);
	Text.NL();
	Text.Add("Why, what’s so surprising?", parse);
	Text.NL();
	Text.Add("<i>“N-nothing,”</i> Isla manages to choke out. <i>“It’s just that… well, I’ve done this sort of thing for myself before, and I could never get myself to feel like what you’re doing to me right now… wait, why am I admitting this to you? What am I saying?”</i>", parse);
	Text.NL();
	Text.Add("She <i>is</i> so much cuter when flustered and embarrassed than when she’s all serious, isn’t she?", parse);
	Text.NL();
	Text.Add("<i>“H-hey! I’m not stupid, I’m just not ready, I think…”</i>", parse);
	Text.NL();
	Text.Add("No one’s ever truly ready for anything; you have just to roll with the punches as they come. If she likes, she can just think of this as another kind of exploration… she does like to explore, doesn’t she?", parse);
	Text.NL();
	Text.Add("Isla doesn’t reply, instead mewling piteously as you slide a finger into her virgin passage, invading the tight, heat-filled tunnel and wiggling about within. <i>“Ngh!”</i>", parse);
	Text.NL();
	Text.Add("Was that pain, or was that pleasure? It’s a little hard to tell, so you’ll just have to experiment a little more… she’d like that, wouldn’t she? You don’t give Isla the opportunity to manage a reply before sliding a second finger into her wet pussy, followed by a third.", parse);
	Text.NL();
	Text.Add("<i>“Ngggh!”</i> she cries, and you feel powerful muscles clamping down on your invading digits, a movement accompanied by the soft squelching sensation of fluids being squeezed. Heh, that athletic body of hers is good for something, after all. The sable-morph wriggles in your embrace, strong enough for her to feel the latent power in her muscles, and you’re curious at just how far the slightest sensation can take her. Is she really that much of a hair trigger?", parse);
	Text.NL();
	Text.Add("Only one way to find out. Your fingers still suffused in the heat of Isla’s womanly flower, you begin caressing her slick inner walls with your fingertips, feeling them pulse and undulate in response to your tender ministrations. Slowly, you turn that into a steady, rhythmic motion as you finger the sable-morph, digits pumping in and out of her snatch even as you wiggle them about inside her.", parse);
	Text.NL();
	Text.Add("She’s as much of a hair trigger as you hoped, heh. With a short, sharp yip that echoes off the mountainside, Isla forces the air from her lungs and convulses, her body wriggling against yours.", parse);
	Text.NL();
	Text.Add("<i>“C’mon… be gentle!”</i>", parse);
	Text.NL();
	Text.Add("What does she mean? You’re already being gentle - it’s her who’s being oversensitive. Besides, if she’s getting so much enjoyment out of just a little teasing, then you can only wonder what will happen when the main course arrives.", parse);
	Text.NL();
	Text.Add("Isla lets out a plaintive mewl at that, but another thrust of your fingers into her fresh, needy cunt shuts her up well enough. With the top of your palm mashed against her wet, dripping lips, you can feel her hymen with your fingertips, stretched out inside her. The temptation is there, but you decide to hold off for now - it’ll be so much more satisfying to claim her properly later. Instead, you continue fingering her - as your fingers slide in and out of the sable-morph’s gash, your thumb is also busy at work, caressing her outer lips in smooth, gentle touches in contrast to the increasingly frenzied nature of your thrusts. On her part, Isla sure is responding well to your tender ministrations, her body working to fulfill a need it didn’t realize it had until a few moments ago.", parse);
	Text.NL();
	Text.Add("All of a sudden, the sable-morph stiffens against you, her entire form trembling ever so slightly; with a smile, you search with your thumb under her hood and caress the throbbing clit you know you’ll find there.", parse);
	Text.NL();
	Text.Add("It’s too much for her. Isla twists and writhes, then a loud wail comes unbidden from her muzzle as streams of hot nectar flow freely from her honeypot and collect in your hand. Moaning and panting to catch her breath after the orgasm, Isla leans into you as you rub her slick nectar all over her inner thighs, spreading it evenly into her fur like jam on a slice of bread.", parse);
	Text.NL();
	Text.Add("Has she always been so… ah, sensitive?", parse);
	Text.NL();
	Text.Add("<i>“Ah, well…”</i> Is that a flush of heat you feel in her body? <i>“I wouldn’t rightly know, y’know… not as if I go round comparing this sort of thing with the other ladies, right? And it doesn’t feel the same way when I go about touching myself…”</i>", parse);
	Text.NL();
	Text.Add("It shouldn’t, and that’s a good thing.", parse);
	Text.NL();
	Text.Add("<i>“So, uh, I guess I really <b>am</b> more sensitive than most, like you said? I dunno how I feel ‘bout that…”</i>", parse);
	Text.NL();
	Text.Add("Oh, that’s not too pressing a question. Besides, you get the feeling that she’ll have made up her mind by the time you’re done with her.", parse);
	Text.NL();
	Text.Add("<i>“W-wait, there’s - oh. Ohh.”</i> Her words are cut of as one of your hands snakes over to engulf one of her baby feeders, massaging away at firm breastflesh. Hmm… they’re not <i>small</i>, the word wouldn’t do her bust justice - more firm and <i>compact</i>. Either way, they’re still very fun to play with, and Isla herself is more than willing to help out, pushing her chest forward and into your hands so you can get a good feel of her.", parse);
	Text.NL();
	Text.Add("Time to get to the meat of the matter, though. ", parse);
	if(p1cock) {
		Text.Add("Slowly, you rise from your sitting position, letting Isla fall out of your lap and onto all fours like the animal she is. She’s too far gone to even think of protesting as you grab ahold of her hips, tail instinctively lifting to display her wet cunt winking at you. The sable-morph’s breasts heave as she pants, tiny tongue and sharp little teeth clearly visible in her open mouth as she looks pleadingly over her shoulder.", parse);
		Text.NL();
		Text.Add("Time to break her in, then; it’s not as if she’s unwilling. ", parse);
		parse["biggest"] = player.NumCocks() > 1 ? " biggest" : "";
		if(strapon) {
			Text.Add("Working as quickly as you can to seize the moment, you pull out your strap-on from your gear and fasten it against your groin.", parse);
		}
		else {
			Text.Add("Taking hold of your[biggest] shaft and whipping it out, you stroke your member to full attention and get ready to do the deed.", parse);
		}
		parse["c"] = strapon ? "" : " mixing in with your own pre";
		Text.Add(" It’s not as if you need any encouragement on your part, not with all that foreplay and the sight of sexy sable snatch drooling at you. Moving up to Isla’s presented ass, you lean in and grind your shaft along the folds of her honeypot, smearing nectar all along its length, a glistening layer of lubricant[c]. A tremble runs through her form, and she nestles her head in her hands, muffling the mewl that escapes her muzzle.", parse);
		Text.NL();
		Text.Add("<i>“C’mon…”</i> Isla’s words are strained, her voice breathless. <i>“Don’t keep a girl like me waiting already…”</i>", parse);
		Text.NL();
		parse["knot"] = knot ? "knot" : "hilt";
		Text.Add("Oh fine, if that’s what she wants. Reaching forward and grabbing the sable-morph by the waist, you forcefully slide the entirety of your shaft into her offered pussy. Halfway through, there’s a brief resistance, but it gives way with a bit of insistent pushing, and you’re in up to the [knot].", parse);
		Text.NL();
		
		Sex.Vaginal(player, isla);
		isla.FuckVag(isla.FirstVag(), p1cock, 5);
		player.Fuck(p1cock, 5);
		
		Text.Add("<i><b>“Ngggggh!</b></i> The cry is more pained than the others, and you quickly realize that you’ve deflowered the poor girl. Well, time to make up for it - securing your hold on Isla, you begin jackhammering yourself in and out of her, doing your best impression of a mindless, rutting beast, your bodies moving involuntarily against each other. She can’t see what you’re doing, and neither can you see her face, but with how enthusiastically she’s responding, she can definitely <i>feel</i> it.", parse);
		Text.NL();
		if(player.NumCocks() > 1) {
			Text.Add("Your other shaft[s2] slap[notS2] heavily against her thin ass and slick thighs, spanking her in time with your thrusts. Isla yelps, and soon you’re dribbling pre from [itThem2] too, smearing her calves and feet with your sticky slime.", parse);
			Text.NL();
		}
		if(player.HasBalls()) {
			Text.Add("At the same time, your [balls] heave and jiggle against her soft, silken fur, beginning to churn in preparation for their eventual release into the sable-morph’s warm insides.", parse);
			Text.NL();
		}
		if(strapon) {
			Text.Add("While it’s not as good as a real cock might be, you nevertheless get no small amount of satisfaction from the feeling of the strap-on’s base mashing and pounding against your groin in your frenzied mating, all that vigor soon causing warmth to well up in your groin.", parse);
			Text.NL();
		}
		parse["c"] = strapon ? " even though you’re wearing a strap-on," : "";
		Text.Add("With how sensitive she is, it doesn’t take long before Isla starts losing it. The sable-morph is propped up on a forearm, one of her hands busy rubbing at her small breasts and stiff nipples, teasing them and feeling how they’ve become taut with arousal. Her breathing comes as small whines and wails, and[c] you feel her pussy squeeze at your stiff shaft.", parse);
		Text.NL();
		Text.Add("<i>“Ngh… I said be gentle!”</i> Isla gasps. <i>“You’re… you’re going to make me scream!”</i>", parse);
		Text.NL();
		Text.Add("Hey, maybe that’s exactly what you’re gunning to do. Not that you can hold yourself back, not with surges of pleasure overwhelming your thoughts and forcing your hips back and forth. Isla’s words soon become realized as her entire body trembles, and she presses her ass all the way up against you, trying to take as much of you into her even as her insides clench tight against your shaft. Pained squeals escape her muzzle, quickly turning into muffled screams as she presses her face against the ground.", parse);
		Text.NL();
		if(strapon) {
			Text.Add("With all the grinding against your netherlips, you can feel yourself growing more than a little aroused, a thin, slimy layer of honey gathering between your skin and the strap-on’s base. Though you’re nowhere as much of a hair trigger as Isla is, you get no small measure of enjoyment from the motions, especially when you’ve a partner as enthusiastic and flexible as the sable-morph.", parse);
			Text.NL();
			Text.Add("<i>“I can’t believe I’m losing my virginity to a girl…”</i> Isla pants as sweat gathers in her fur.", parse);
			Text.NL();
			Text.Add("Well, seeing is believing, as they say. Or in her case, maybe it’s more of a feeling. Either way, it’s happening, so it doesn’t matter whether she believes in it or not.", parse);
			Text.NL();
			Text.Add("The only reply you get is a lusty moan as Isla’s pleasure mounts again.", parse);
			Text.NL();
			Text.Add("Besides, isn’t it better this way? Then she won’t have to worry about accidentally getting pregnant.", parse);
			Text.NL();
			Text.Add("<i>“C’mon, don’t joke…<b>ngh</b>!”</i>", parse);
		}
		else {
			Text.Add("It’s too much for you as well. With a final throb, your cock twitches in her tight, sensitive cunt and sends forth a flood of baby batter to complete her deflowering. You pump and pump away, and Isla moans as she feels your seed wash into her, hot and slippery.", parse);
			Text.NL();
			
			var cum = player.OrgasmCum();
			Scenes.Isla.Impregnate(player, cum);
			
			if(player.NumCocks() > 1) {
				Text.Add("Your other shaft[s2] blast[notS2] away, too, jetting string after string of sperm down the back of her thighs to mix with her juices. It gets all over her legs and tail, marring that beautiful, dark fur of hers, but at least it’ll wash off well later. You hope.", parse);
				Text.NL();
			}
			parse["knot"] = knot ? " and neatly tied to your knot" : "";
			Text.Add("<i>“Spirits above,”</i> Isla gasps, the sable-morph utterly exhausted. Her body isn’t, though, and you feel pressure mounting about your shaft yet again as Isla’s powerful inner walls clamp down tight in preparation for yet another mind-blowing orgasm. When she’s finally done twisting and squealing, she sags to the ground, still impaled on your prick[knot].", parse);
			Text.NL();
			Text.Add("<i>“Ngh. Oh. Nggh.”</i> Clumsily, Isla tries to struggle back onto all fours, then gives up and just lets go of her body, allowing herself to slump to the ground. <i>“You came in me! I can’t believe… you came in me!”</i>", parse);
			Text.NL();
			Text.Add("What? What else was she expecting?", parse);
			Text.NL();
			Text.Add("<i>“I dunno, for you to pull out or something…<b>nggh</b>!”</i>", parse);
		}
		Text.NL();
		
		parse["knot"] = knot ? "your knot" : "the base of your shaft";
		Text.Add("Seems like that last blow was a particularly nasty one. Isla squeaks and squeals, fingers clawing at the thin soil and grass in a fit of desperate need. Her slender body wriggles this way and that as more and more of her fluids force their way out of her, spurting forth to stain [knot]. As the tremors of her final orgasm die down, she slumps onto the ground, held up only by your hands about her warm midriff and your rod keeping her rear up high.", parse);
		Text.NL();
		Text.Add("Seems like you’ve truly gone and fucked the brains out of Isla, reduced the sable-morph to a pliant mound of putty that’s currently engulfing your shaft. With slow deliberation, you withdraw yourself from her, letting her hindquarters down on the grassy ground with the rest of her while that freshly broken, well-used gash of hers gapes up at you.", parse);
		Text.NL();
		Text.Add("A job well done, then.", parse);
	}
	else {
		Text.Add("Slowly, so as not to alarm her, you begin spreading your fingers, forcing Isla’s gash wider and wider apart. Her nectar glistens on your fingers as cool air sweeps over it, and she squeaks in surprise as she realizes what you’re up to.", parse);
		Text.NL();
		Text.Add("<i>“What-what are you doing?”</i>", parse);
		Text.NL();
		Text.Add("Preparing to enter her, of course. Whatever did she think you were about to do? It may not be the so-called best way to introduce her to this whole business - if you had a real cock on you, perhaps you could start with the common and work your way up to the exotic - but it definitely is one of the safer ways of breaking her into this whole sex thing.", parse);
		Text.NL();
		Text.Add("<i>“B-but-”</i> the sable-morph begins, but is cut off by you bunching your fingers together and moving to slide your entire hand into her widened gash. Isla bites back a cry as her virgin insides struggle to take the strain, testing the limits of their stretchiness as your entire fist invades her cunt, your wrist grinding against her increasingly heat-swollen lips and rigid love-button.", parse);
		Text.NL();
		
		isla.FuckVag(isla.FirstVag(), null, 5);
		player.Fuck(null, 5);
		
		Text.Add("It wouldn’t hurt so much if she were more accommodating, but that’s her prerogative. As before, you begin feeling out Isla’s slick insides, your fingers spreading out and exploring those wet, heated walls. Impaled as she is on your forearm, the sable-morph herself makes little squeaking noises and wriggles atop your wrist as her delicate insides react to your presence.", parse);
		Text.NL();
		Text.Add("<i>“Ngh! No! I never dared…”</i>", parse);
		Text.NL();
		Text.Add("She never dared to what? If you stretch your fingers just right, you can feel her hymen, stretched tight across her love-tunnel. All it would take to break it would be a forceful push… but for now, you settle for prodding that fragile barrier with your fingertips again and again, rolling your palms all the while so her insides are always tightly pressed against your hand.", parse);
		Text.NL();
		Text.Add("Isla summons up enough strength to twist her body around and look at you, eyes wide and uncertain as she realizes what you intend to do; her small breasts heave with her labored breathing as a soft squeak escapes her muzzle. You give her a reassuring pat on the head with your free hand, then thrust quick and hard.", parse);
		Text.NL();
		Text.Add("<i><b>“Nggh!”</b></i> Isla whimpers as you deflower her in one swift move. You can <i>feel</i> her hymen tear and give way under your fingers, and the moment truly is one to be savored. There’s a little blood, but nothing out of the ordinary for a young, sprightly girl like her.", parse);
		Text.NL();
		Text.Add("Bet her own “experiments” never felt like this, did they?", parse);
		Text.NL();
		Text.Add("<i>“N-no…”</i>", parse);
		Text.NL();
		Text.Add("Nothing for it now. You need to do deeper! Keen as her cunt is, Isla is all too aware of your continued invasion into her depths, and the sable-morph practically yowls as you hit rock bottom, knuckles bumping against her cervix. From there, you start up a steady rhythm, pulling your fist out until the glistening appendage is barely prodding her labia, then ramming it in again. Back and forth, back and forth your arm goes, while the other roams about Isla’s body, exulting in how luxurious the sable-morph’s dark coat of fur is, how glossy her braid…", parse);
		Text.NL();
		Text.Add("On her part, Isla responds to your fist-fucking eagerly, her body running on automatic as she moves in time with your thrusts, trying to take as much of it into herself as she can, as if your forearm were a particularly thick cock. It’s quite the feat, really, considering how slim she is, but the squeaks and squeals coming from her muzzle assure you she’s having a good time.", parse);
		Text.NL();
		Text.Add("At last, the poor sable-morph can’t take it anymore - for the second time, or was it the third? Throwing back her head, her entire body stiffens as her cunt clamps down hard on your wrist, nectar bubbling and oozing out of her folds and crawling down your wrist as she screams, her voice echoing off the mountainside.", parse);
		Text.NL();
		Text.Add("Now, now, there’s a good girl. As an exhausted Isla sags against you, you gently kiss the back of her neck and finally extract your utterly soaked fingers from within her, wiping them off on the most luxurious sable fur you’ve ever seen.", parse);
	}
	Text.NL();
	Text.Add("Panting and heaving, her maw open to reveal her small pink tongue and sharp little teeth, Isla pushes herself away from you and lies spread-eagled on the grassy ground for a moment to recover. Eyes trained on the sky above, chest heaving, she lies there for a good five minutes under your gaze as she waits for life to flow back into her limbs.", parse);
	Text.NL();
	Text.Add("<i>“Ooh. Ow.”</i>", parse);
	Text.NL();
	Text.Add("Did she like it?", parse);
	Text.NL();
	Text.Add("<i>“I feel all weird inside.”</i>", parse);
	Text.NL();
	Text.Add("That’s only to be expected, considering this was her first time.", parse);
	Text.NL();
	Text.Add("<i>“You’d know, I guess.”</i> Isla flicks her eyes to you, then refocuses her gaze upon the sky. <i>“Y’know, about what you said earlier?”</i>", parse);
	Text.NL();
	Text.Add("Yes?", parse);
	Text.NL();
	Text.Add("<i>“I’ll think deeply about it.”</i>", parse);
	Text.NL();
	Text.Add("You chuckle. Glad to have changed her mind on the issue.", parse);
	Text.NL();
	Text.Add("<i>“I didn’t say nothing about changing my mind, just that I’d give thought to it.”</i>", parse);
	Text.NL();
	Text.Add("In that case, she should think about it really deeply. She’s not that bad inside, both figuratively and literally… she’s just got to change her wrapping so that people will get past the outside and into the warm, gooey inside.", parse);
	Text.NL();
	Text.Add("<i>“Shucks… don’t talk dirty, you. I thought we were already done.”</i>", parse);
	Text.NL();
	Text.Add("Hey, you could go for another if she’s up for it.", parse);
	Text.NL();
	Text.Add("<i>“Ngh! No… not just yet. Need a little time… and got other stuff to do, too. Like cleaning up. And… and maybe when I don’t feel so odd.”</i>", parse);
	Text.NL();
	Text.Add("All right, then. You’ll give her a little alone time, but you’ll be back. That’s a promise.", parse);
	Text.NL();
	Text.Add("<i>“Oh, and [playername]?”</i>", parse);
	Text.NL();
	Text.Add("Yes?", parse);
	Text.NL();
	Text.Add("<i>“Thanks.”</i>", parse);
	Text.NL();
	Text.Add("Nah, it was your pleasure. With that, you stand up and are on your way off the plateau and down the mountain, giving a freshly deflowered sable-morph some time to ponder her fate.", parse);
	Text.Flush();
	
	isla.relation.IncreaseStat(100, 10);
	
	world.TimeStep({hour: 4});
	
	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.Highlands.Hills);
	});
}

Scenes.Isla.Sex.Repeat = function() {
	var parse = {
		
	};
	
	var womb = isla.PregHandler().Womb();
	var preg = womb && womb.pregnant;
	var stage = preg ? womb.progress : 0;
	
	Text.Clear();
	if(world.time.hour >= 8 && world.time.hour < 17) {
		if(stage >= 0.75) {
			Text.Add("Isla looks away, rubbing her pregnant midsection. <i>“You sure ‘bout this? Even with me looking as I am?”</i>", parse);
			Text.NL();
			Text.Add("Of course you are. Honestly, she doesn’t need to be so conscious about her appearance; there’s no one else besides the two of you -", parse);
			Text.NL();
			Text.Add("<i>“That’s what I mean -”</i>", parse);
			Text.NL();
			Text.Add("- And since you’re the one who put that in there, what should it matter to you? If anything, it should make her all the <i>more</i> attractive in your eyes, as the mother of your cubs.", parse);
			Text.NL();
			Text.Add("<i>“Gee…”</i>", parse);
			Text.NL();
			Text.Add("Well?", parse);
			Text.NL();
			Text.Add("She smiles, twitching her small, round ears. <i>“Sure, but not now. I’m kinda busy at the moment, and gotta make sure there’s enough to eat tomorrow. I’m just kinda feeling always hungry and - no, I don’t want you to help me out on this. Gotta get some things done myself. Why don’t you come back after sundown? That’ll be a good time for us.”</i>", parse);
		}
		else {
			Text.Add("<i> “Sorry,”</i> Isla replies. <i>“Don’t rightly have the time for that at the moment, too busy making the most of my daylight and seeing to it that I’ve something to eat tomorrow, amongst other things.</i>", parse);
			Text.NL();
			Text.Add("<i>“But if you’re really interested… ask again after sundown, ‘kay? I’ll be around; it’s not as if there’s anywhere to go in these mountains.”</i>", parse);
		}
		Text.Flush();
		
		Scenes.Isla.Prompt();
	}
	else {
		if(stage >= 0.75) {
			Text.Add("<i>“Heh. You sure?”</i> Raising both hands to cradle her swollen tummy, Isla runs her delicate fingers over the taut skin and thin fur. <i>“Not that I’m not willing, but with this in the way…”</i>", parse);
			Text.NL();
			Text.Add("There are ways of having fun even when she’s in her condition. Besides, with someone as lithe and flexible as she is, that shouldn’t be a problem at all.", parse);
			Text.NL();
			Text.Add("<i>“Hah. Lithe.”</i> Closing her eyes, Isla closes her eyes and cradles her swollen tummy, and when she opens them again a new light’s crept into them. <i>“So! You feeling like anything special tonight?”</i>", parse);
		}
		else {
			Text.Add("Isla looks pensive at the suggestion. <i>“Huh. Well, guess I’ve got a bit of time to burn at the moment. ‘S better than just waiting and staring while guarding, so, what’re you interested in doing?”</i>", parse);
			Text.NL();
			Text.Add("Heh. Her nonchalant act isn’t fooling anyone, not with her own body betraying her - the way her tail got agitated all of a sudden isn’t lost on you, and nor is the glint in those beady eyes of hers.", parse);
			Text.NL();
			Text.Add("Well, it’s as she said. What are you interested in doing today?", parse);
		}
		Text.Flush();
		
		Scenes.Isla.Sex.Prompt();
	}
}

Scenes.Isla.Sex.Prompt = function() {
	var p1cock = player.BiggestCock(null, true);
	
	var parse = {
		
	};
	
	//[PitchVaginal] //TODO
	var options = new Array();
	options.push({ nameStr : "Pitch Vaginal",
		tooltip : "Pound her sensitive insides until she screams.",
		func : Scenes.Isla.Sex.PitchVaginal, enabled : p1cock
	});
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“Such a tease,”</i> she complains.", parse);
		Text.Flush();
		
		Scenes.Isla.Prompt();
	});
}

Scenes.Isla.Sex.PitchVaginal = function() {
	var p1cock = player.BiggestCock(null, true);
	var strapon = p1cock ? p1cock.isStrapon : null;
	var knot = p1cock ? p1cock.Knot() : null;
	
	var parse = {
		playername : player.name,
		lowerarmordesc : player.LowerArmorDesc()
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	var womb = isla.PregHandler().Womb();
	var preg = womb && womb.pregnant;
	var stage = preg ? womb.progress : 0;
	var num = womb.litterSize;
	
	var figure = isla.Figure();
	
	Text.Clear();
	if(stage >= 0.75) {
		Text.Add("<i>“Ooof.”</i> The sable-morph cradles her massively swollen midsection, rubbing the stretched skin and feeling the cubs within squirm. <i>“Ya know you aren’t going to knock me up any further than you have already, right?”</i>", parse);
		Text.NL();
		Text.Add("Well, yes. It’s not as if you’re not aware of how these things work.", parse);
		Text.NL();
		Text.Add("<i>“Yeah, yeah, just checking. There’s all sorts of weird stuff and strange folks out there, y’know… I once heard of a bird who could get knocked up even while she was already carrying. Kept herself perpetually pregnant… silly bint got off on it.</i>", parse);
	}
	else if(preg) {
		Text.Add("At your suggestion, Isla moves both hands down to her small baby bump. <i>“Ya still going through with it?”</i>", parse);
		Text.NL();
		Text.Add("Of course. It just makes her more attractive - and horny, of course. Did she think that’s escaped you?", parse);
		Text.NL();
		Text.Add("<i>“Gee, I think you’re only saying that ‘cause you’re the father, but hey.</i>", parse);
	}
	else if(strapon) {
		Text.Add("<i>“Sure. I’ll take what ya’ve got, even if it isn’t real.”</i>", parse);
		Text.NL();
		Text.Add("So nice of her to be a good sport. She won’t regret this, you promise.", parse);
		Text.NL();
		Text.Add("<i>“Hey, it’s not as if I’m particularly hard to please. You oughta know that by now.”</i>", parse);
	}
	else { //real cock
		Text.Add("<i>“I guess you’re looking to knock me up, huh?”</i>", parse);
		Text.NL();
		Text.Add("She sure is direct about it, huh? No, you’re looking to turn her into a quivering mound of fur and flesh, fucked senseless thanks to her incredibly sensitive insides. Whatever else happens… well, it’ll be a bonus on the side.", parse);
		Text.NL();
		Text.Add("Isla merely rolls her eyes and grins. <i>“Hah.</i>", parse);
	}
	Text.NL();
	Text.Add("<i>“Well, any particular preference ya got?”</i>", parse);
	Text.NL();
	Text.Add("Why, you’ll go for the tried and true method of going about things - you’ll stick something long and hard into her, then pound away at her until she screams. After all, you know from personal experience that this is quite the surefire way to please her.", parse);
	Text.NL();
	parse["f"] = figure == Isla.Figure.Girly ? "small" :
		figure == Isla.Figure.Womanly ? "generous" : "hefty";
	Text.Add("Isla says nothing, but licks her muzzle, her stare growing more intense. Smiling, you push her tongue back into her mouth, then trail that finger down her chin, between her [f] breasts, down ", parse);
	if(preg)
		Text.Add("the fecund, womanly swell of her pregnancy", parse);
	else
		Text.Add("her trim, muscular tummy", parse);
	Text.Add(" and eventually ending up on her loincloth. With exaggerated slowness, you circle her cunt a few times through the fabric with your finger, then begin tugging at the waistband of her loincloth.", parse);
	Text.NL();
	Text.Add("Isla doesn’t need telling twice. The sable-morph is more than willing to help you divest herself of her simple clothing, kicking it out of the way as it falls to the ground. Now it’s time for her to help you.", parse);
	Text.NL();
	Text.Add("Moving both eagerly and predatorily, Isla kneels before you and begins dealing with your [lowerarmordesc]. Her fingers aren’t really used to such things, but you give her the time she needs to get things going. ", parse);
	if(strapon)
		Text.Add("It takes longer than it should, your [lowerarmordesc] falls away, and you reach into your possessions and draw out your toy. Fake as it might be, Isla’s beady little eyes glint mischievously at the thought of that delightful, ramrod shaft plowing deep into her, and she hastens her movements in helping you affix the strap-on properly.", parse);
	else
		Text.Add("Finally, your [lowerarmordesc] falls to the ground, and you eagerly thrust your semi-hard shaft[s] into the sable-morph’s face. She deftly catches [itThem] between quick, nimble paws, and begins stroking you off energetically. It’s for her benefit, after all - the harder you get, the more fun she’ll be getting out of this whole exercise.", parse);
	Text.NL();
	Text.Add("All readied up now, you reach for the sable-morph’s arms and haul her upwards. Despite her strength, she’s quite light, and it’s not long before you’re staring each other eye-to-eye; wasting no more time, you lean forward and lock your lips with hers in a long, delightful kiss. Her muzzle may not be made for tongue-wrestling, but she tries to make up for it with sufficient enthusiasm in nuzzling you, that tiny nose of hers cool against your [skin].", parse);
	Text.NL();
	if(player.FirstBreastRow().Size() >= 2) {
		Text.Add("At the same time, Isla worms her hands up to your chest and slides them against your [breasts], her strong yet delicate fingers squeezing and caressing away to the point that you moan straight into her face - and she hasn’t even reached your nipples yet.", parse);
		Text.NL();
		Text.Add("When she does, though, you feel it immediately. Her clever little fingers tweak, squeeze and press, and though she’s not as experienced as some, your body nevertheless reacts well enough, your already stiff nipples swelling even further as a flush of arousal radiates outwards from your chest.", parse);
		Text.NL();
	}
	if(stage >= 0.4) {
		Text.Add("Greedily, you gently rub Isla’s baby bump, feeling the life inside kick at your touch. Oof. Seems like the cub, or cubs, are going to be every bit as strong as she is… and does she remember how she got to be like this?", parse);
		Text.NL();
		Text.Add("<i>“Yeah, and you’re gonna do it to me again, aren’t ya?”</i>", parse);
		Text.NL();
		Text.Add("Every bit as thoroughly for the mommy that she’s going to be. It’ll be as much a delight for her as it will be for you.", parse);
		Text.NL();
	}
	Text.Add("Sighing softly into Isla’s face, you move your hands down to the sable-morph’s tail. ", parse);
	if(figure == Isla.Figure.Girly)
		Text.Add("Her slender hips are firm and solid, and as you press down with your fingers on skin and fur you can feel muscle shift underneath. She may not look it, but there’s no doubt the sable-morph is a fine girl in her own right and has the strength to be just as vigorous when the situation calls for it.", parse);
	else if(figure == Isla.Figure.Womanly)
		Text.Add("Her widened hips and rounded butt have definitely improved her overall figure, and the difference is distinct under your fingertips as you reach for her firm, fleshy butt for a squeeze and pinch. No matter how many times you do it, it’s always worth that flustered squeak that it elicits from her muzzle.", parse);
	else //curvy
		Text.Add("Her broodmother-worthy hips and swollen rump are a delight to grope, testament to how the spring’s changed her. Feeling your fingers at her crack, the sable-morph thrusts her ass firmly into your grasp, giving you a delightful handful of tail.", parse);
	Text.NL();
	Text.Add("Ah, right. Now that she’s all softened up and ready, how do you want to proceed?", parse);
	Text.Flush();
	
	world.TimeStep({minute: 30});
	
	Scenes.Isla.Sex.PitchVaginalPrompt(parse, {
		p1cock  : p1cock,
		strapon : strapon,
		knot    : knot,
		preg    : preg,
		stage   : stage,
		figure  : figure
	});
}

Scenes.Isla.Sex.PitchVaginalPrompt = function(parse, opts) {
	//[Against Wall][Mount Her][Go Under]
	var options = new Array();
	options.push({ nameStr : "Against Wall",
		tooltip : "Pin the slippery sable to a wall and nail her good.",
		func : function() {
			Text.Clear();
			if(opts.stage >= 0.75) {
				opts.nowall = true;
				Text.Add("As much as you might want to try, there’s no way you’re going to have standing sex with Isla, not with her massive pregnancy low, heavy, and wedged between the two of you. Maybe you should hurry up and figure out something else before your momentum is broken…", parse);
				Text.Flush();
				
				Scenes.Isla.Sex.PitchVaginalPrompt(parse, opts);
			}
			else {
				Scenes.Isla.Sex.PitchVaginalWall(parse, opts);
			}
		}, enabled : !opts.nowall
	});
	options.push({ nameStr : "Mount Her",
		tooltip : "Get that slinky sable on all fours and breed her like the animal she is.",
		func : function() {
			Scenes.Isla.Sex.PitchVaginalMount(parse, opts);
		}, enabled : true
	});
	options.push({ nameStr : "Go Under",
		tooltip : "Let her get on top and ride you.",
		func : function() {
			Scenes.Isla.Sex.PitchVaginalUnder(parse, opts);
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Isla.Sex.PitchVaginalUnder = function(parse, opts) {
	Text.Clear();
	Text.Add("You give Isla a wink and ease yourself to the ground, stretching languidly and making sure the sable-morph is taking in your every motion. The soft grass is cool against your [skin] with dew, and your [cocks] jut[notS] proudly into the night air.", parse);
	Text.NL();
	if(player.FirstCock()) {
		Text.Add("[ItThey] throb[notS] with anticipation, veins standing out thickly on [itsTheir] surface, a bead of pre already beginning to form on your [cockTip]. You can’t see it that well, but you can definitely <i>feel</i> it as it overflows and runs down your length, wet and slippery and upset about having gone to waste.", parse);
		Text.NL();
	}
	Text.Add("Come on, then, there’s no need to be shy. She’s a spry, energetic young lass; if she wants to get fucked, she’ll have to work for it. There it is, waiting for her - all she has to do is to come and get nailed.", parse);
	Text.NL();
	parse["cl"] = opts.p1cock.Len() >= 25 ? Text.Parse(" taking in [itsTheir] sheer length,", parse) : "";
	Text.Add("Isla looks down at your [cocks],[cl] and swallows hard. Slowly, she gets down on her knees, her legs straddling you, and shuffles up until your cock is poking against her ", parse);
	if(opts.stage >= 0.75) {
		Text.Add("heavily pregnant tummy. She has to hoist it above your stiff shaft in order to align her cunt with your [cockTip], and heaves a sigh of relief as she lets its weight rest on your chest. You have to admit it doesn’t feel half bad, the warm fullness of her firm, fur-covered and life-filled womb, your seed rapidly growing inside.", parse);
		Text.NL();
		Text.Add("<i>“Hunh,”</i> she says. <i>“I know I’m young an’ all, but this is starting to take it out of me.”</i>", parse);
		Text.NL();
		Text.Add("It’s a good thing she’s going to be popping soon, then. In the meantime, why doesn’t she get a little relief from her daily stresses?", parse);
		Text.NL();
		Text.Add("<i>“Relief… yeah, I sure could do with some of that.”</i>", parse);
	}
	else if(opts.preg) {
		Text.Add("rounded baby bump. It’s not large to the point where it’s getting in the way, but staring you in the eyes as it is, it’s rather noticeable in all its budding glory. Isla settles on top of you, her hands on your shoulders for support, the petals of her womanly flower resting lightly on your [cockTip], and she gives you a very definitive look.", parse);
		Text.NL();
		Text.Add("<i>“My eyes are up here, hon.”</i>", parse);
		Text.NL();
		Text.Add("Of course they are, but you’re not exactly admiring her eyes, are you? No, you’re far too busy admiring your handiwork - that part of her is much more eye-catching than her eyes.", parse);
		Text.NL();
		Text.Add("<i>“Ya cheeky bastard.”</i>", parse);
		Text.NL();
		Text.Add("Well, if she doesn’t like it, then she’ll just have to <i>make</i> you pay attention, and there’s one certain way to do that.", parse);
	}
	else {
		Text.Add("cunt. You can distinctly feel the moistness contained within, the hot slipperiness of her girl-cum already providing more than adequate lube for the furious fucking that you’re about to impart to her, and to say it’s arousing would be a terrible understatement of tragic proportions.", parse);
		Text.NL();
		Text.Add("She looks tense. She shouldn’t; this should be a fun exercise for everyone involved, right?", parse);
		Text.NL();
		Text.Add("<i>“Mind if I make the opening move?”</i>", parse);
		Text.NL();
		Text.Add("Why, you’d practically <i>invited</i> her to do it. The conclusion’s never really in doubt… with how much of a hair trigger her cunt is, the only question is how many times she’ll be mewling and squeaking as you fuck her brains out.", parse);
		Text.NL();
		Text.Add("Something flashes in Isla’s beady eyes. <i>“Here I go, then!”</i>", parse);
	}
	Text.NL();
	Text.Add("Arching her back and pushing her hips forward, Isla grinds her cunt along[oneof] your length[s]. The sable-morph’s crotch fur brushes against your [skin], her increasingly wet and puffy folds a delight against your [cock]. You can feel them throb and pulse as they kiss your [cock], those petals of her womanly flower, painting her girl-cum all over your shaft. You ache to thrust away, your instincts raring to get going already, but you make an effort to hold back and wait until the going gets good to unleash your full fury.", parse);
	Text.NL();
	Text.Add("When you’re sufficiently lubed up, Isla slowly leans her weight on you, guiding you into the tight walls of her pussy. Slowly, she takes your [cockTip] into her, then withdraws until you’re almost completely out, then plunges in onto your shaft again. In such a manner is the entirety of your [cock] consumed - bit by bit, inch by inch, Isla’s cunt devours your man-meat until you’re almost hilted into her.", parse);
	if(opts.figure >= Isla.Figure.Womanly) {
		parse["f"] = opts.figure == Isla.Figure.Womanly ? "wide" : "broodmother-worthy";
		Text.Add(" Her [f] hips easily accommodate your length and girth - a happy side-effect of their widening thanks to the transformative spring’s powers.", parse);
	}
	Text.NL();
	
	Sex.Vaginal(player, isla);
	isla.FuckVag(isla.FirstVag(), opts.p1cock, 3);
	player.Fuck(opts.p1cock, 3);
	
	if(opts.knot) {
		Text.Add("A furious downthrust, and her netherlips gape wide to admit your knot, eliciting a short, sharp exhalation on Isla’s part.", parse);
		Text.NL();
		Text.Add("<i>“Ngh!”</i>", parse);
		Text.NL();
		parse["f"] = opts.figure == Isla.Figure.Girly ? "slender" : opts.figure == Isla.Figure.Womanly ? "curvaceous" : "luscious";
		Text.Add("You pant and rock under the [f] sable-morph, electric tingles travelling through the base of your shaft as you feel your knot swell and tie her neatly. Isla squeals as she rocks back and forth on your cock, gripping your shoulders tightly to steady herself.", parse);
	}
	else {
		Text.Add("A savage downthrust, and she’s taken in every last bit of rod you have to offer, her velvety pussy walls clenching down hard on your [cock] as the tingles of the sudden penetration fade, allowing her to regain some of her breath.", parse);
		Text.NL();
		Text.Add("<i>”Ngh!”</i>", parse);
	}
	Text.NL();
	Text.Add("Now, it’s time for you to make your move. Working up a passionate, powerful rhythm, you begin to drill into Isla from below, feeling her love-juices seep down and out from her tight, muscular cunt and stain your [skin]. Isla yelps openly, her fingers clenching tight about your shoulders, which only encourages you to go faster.", parse);
	Text.NL();
	parse["f"] = opts.figure == Isla.Figure.Girly ? "small" : opts.figure == Isla.Figure.Womanly ? "generous" : "hefty";
	Text.Add("Up and down. Up and down. Her [f] breasts jiggle with the motions, ", parse);
	if(opts.stage >= 0.75)
		Text.Add("her massive baby bump heaves in time with your movements, sending her nipples to leaking, ", parse);
	Text.Add("her cunt begins to reflexively milk your [cock], pulsating and shivering along the entirety of the impaled length. As Isla’s pleasure mounts, you can see her gaze grow distant and jaws slack, until she’s completely lost in the heat of the moment, lithe, wiry muscles keeping her balanced while her mind is elsewhere.", parse);
	Text.NL();
	Text.Add("Her first orgasm comes readily enough; almost as if in preparation, her whole body tenses, then she squeezes her eyes shut and lets out a loud squeal that echoes out over the Highlands. You can feel her insides desperately milking your [cock], convulsing with the throes of pleasure that’re rippling through her body.", parse);
	Text.NL();
	Text.Add("Not that you’re going to give her any time to recover. Encouraged by your lover’s enthusiastic response, you redouble your efforts, jackhammering away into her cunt, an effort that’s made all the easier by gravity.", parse);
	
	var cockSize = opts.p1cock.Volume();
	
	if(cockSize >= 400)
		Text.Add(" With your [cock] as large as it is, it creates a distinct rise in Isla’s lower belly. It visibly squirms about in her like a live thing as she continues to ride you, causing the poor sable-morph no small amount of consternation.", parse);
	else if(cockSize >= 100)
		Text.Add(" Churning about within Isla’s heated depths, your [cock] creates a bulge in the sable-morph’s lower belly as she rides you. She may not be able to see it like you can, but she can definitely <i>feel</i> how your size’s amplifying your every motion, turning her into a wriggling mess of pleasure.", parse);
	Text.NL();
	Text.Add("Seems like she didn’t get very far, despite having had the initiative. Or then again, was she planning on losing from the outset?", parse);
	Text.NL();
	Text.Add("<i>“Ngh!”</i>", parse);
	Text.NL();
	Text.Add("Well, was she?", parse);
	Text.NL();
	Text.Add("<i>“Ngh…”</i>", parse);
	Text.NL();
	Text.Add("You’ll take that as a yes, then. With a final burst of energy, you try and get poor Isla back to climaxing again as quickly as you can, putting your back into it. Isla yowls like a… well, she <i>is</i> a stuck animal, nailed on your [cock] as she is, so that’s hardly surprising. Squelching and slapping noises rise from the both of you as you quickly gather momentum once more, furiously assaulting her insides.", parse);
	Text.NL();
	Text.Add("<i>“Ngh… no! Slow down!”</i>", parse);
	Text.NL();
	Text.Add("Her protests only encourage you to do just the opposite, and with the sable-morph being the hair trigger she is, it can’t have been more than another five minutes before she’s screaming her lungs out again, writhing on you as her second orgasm wracks her body.", parse);
	Text.NL();
	if(player.FirstCock()) {
		Text.Add("<i>“Fuck,”</i> Isla gasps, sweat soaking her dark, lustrous fur. <i>“Fuuuuck. Just cum in me already, I want to fucking feel your cum in me.", parse);
		if(opts.preg)
			Text.Add(" No reason not t’ do it… you’ve knocked me up good already.", parse);
		Text.Add("”</i>", parse);
		Text.NL();
		Text.Add("Her wish is your command - well, judging by the ominous feeling welling up at the base of your [cocks], looks like she’s going to see her desires realized whether she likes it or not. With a grunt, you expel your seed straight into Isla’s heated cunt, the sable-morph gripping your hips with her thighs and pulling you in close to her.", parse);
		Text.NL();
		
		var cum = player.OrgasmCum();
		Scenes.Isla.Impregnate(player, cum);
		
		if(opts.preg) {
			parse["knot"] = opts.knot ? "knot" : "shaft";
			Text.Add("Your seed hits her cervix, then floods outwards of her cunt, oozing out around your [knot] and mixing with her honeypot’s nectar to create the stickiest, slipperiest mess you’ve made in some time. The stuff flows over your join crotches, down onto the ground, and leaves you lying in a puddle of… stuff. Seems like you’ll be needing a wash-up later.", parse);
		}
		else if(cum > 6) {
			parse["knot"] = opts.knot ? "your knot" : "the base of your shaft";
			Text.Add("You gasp as you feel your seed rushing up your [cocks], your hips bucking of their own accord as you send shot after shot of cum straight into Isla’s cunt and womb. Slowly, her belly starts to swell outwards, growing bigger and bigger; eventually, she’s ended up with a large, rounded tummy, giving you a lovely preview of what might very well happen should your seed take hold. With so much of it blasted straight into her womb, it’s hard to imagine it <i>not</i> doing so. The leftovers, unable to fit into her insides, spurt out and about [knot], splattering onto your crotch and oozing down your hips, leaving you lying in a small puddle of your own spunk and her feminine juices.", parse);
		}
		else if(cum > 3) {
			Text.Add("With a groan, you feel your cock twitch inside Isla one last time, and begin shooting off your copious load directly into her cunt and womb. There’s no small amount of satisfaction as you see her belly begin to swell, rounding outwards in a nice little paunch, a preview of how she’ll end up should your seed take.", parse);
		}
		else {
			Text.Add("Panting, you groan, tingles of electricity running down your spine, and begin pumping your load straight into Isla’s baby-making hole. It’s not a ridiculous amount, but it’s definitely more than enough to knock her up should she happen to be fertile right now. The sensation of release, of pumping your baby batter straight into a receptive womb - it’s all you can do not to gasp too loudly as Isla’s muscular inner walls milk you for all you’re worth.", parse);
		}
		Text.NL();
		if(player.NumCocks() > 1)
			Text.Add("Your other shaft[s2] erupt[notS2] at the same time as well, spraying strings of thick cum all over Isla’s front and painting her dark, luxurious fur with your essence, leaving the poor thing an utter mess. ", parse);
		Text.Add("At last, though, you’re done, and you’re utterly spent. She clearly takes no small measure of delight in feeling your cum inside her, hot and slippery, and sags against you with a sigh of relief.", parse);
		Text.NL();
		Text.Add("<i>“Damn. No matter how many times y’ go and cum inside me, it still makes me feel really damn satisfied.”</i>", parse);
		Text.NL();
		Text.Add("You… you’re glad you could please.", parse);
	}
	else {
		Text.Add("Mashing and grinding against your own petals, the base of your strap-on has your own juices flowing freely from your [vag] with wanton abandon. The sheer amount of energy that Isla is putting into this effort only makes it all the better - breathlessly so, if you might say.", parse);
		Text.NL();
		Text.Add("The climax, when it comes, takes you completely by surprise; one moment, a great prickling surge is running through your body from head to toe, and the next thing you know, copious amounts of girl-cum are oozing out from the straps holding your shaft in place, making the mess even larger. You moan like the whore you are, shuddering under Isla as the both of you ride out the storm together.", parse);
		
		var cum = player.OrgasmCum();
	}
	Text.NL();
	
	Scenes.Isla.Sex.PitchVaginalExit(parse, opts);
}

Scenes.Isla.Sex.PitchVaginalMount = function(parse, opts) {
	var figure = opts.figure;
	
	Text.Clear();
	Text.Add("Placing your hands on her shoulders, you push gently and guide Isla to her knees, then to all fours. Isla is only more than eager to please, and soon she’s on her hands and knees, tail swishing from side to side as you run your fingers along her spine.", parse);
	if(opts.stage >= 0.75)
		Text.Add(" Her heavily swollen baby bag hangs under her, so heavy that it almost touches the ground. It wobbles and jiggles slightly as she moves, the weight of the cubs within continually testing the firm muscle of her womb.", parse);
	else if(opts.preg)
		Text.Add(" The sable-morph’s pregnancy hangs under her noticeably, a round bump that protrudes downward from her midriff. You smile and reach down to caress it, eliciting a happy purring sound from the back of her throat.", parse);
	Text.Add(" Greedily, you grab one of her taut asscheeks and give it a firm squeeze, which only serves to arouse her further.", parse);
	Text.NL();
	Text.Add("<i>“Wanna count how many times you can make me scream in one sitting?”</i>", parse);
	Text.NL();
	parse["f"] = figure == Isla.Figure.Girly ? "firm" : figure == Isla.Figure.Womanly ? "rounded" : "lush";
	parse["c"] = player.NumCocks() > 1 ? Text.Parse("the largest of your [cocks]", parse) : Text.Parse("your [cock]", parse);
	Text.Add("From how the juices are running from her cunt and soaking her crotch fur, you’re pretty sure she’s already well on her way to the next one. Giving your lover’s [f] behind a firm swat, you get down behind her and inspect what’s to be had. Isla backs up a little, thrusting her ass towards you to present herself better, and it’s only when you’re satisfied with her tight little asshole and glistening, swollen cunt that you get [c] lined up, ready to drill into her at any moment.", parse);
	Text.NL();
	Text.Add("You tease your [cockTip] against her puffy, wet lips - back and forth, back and forth - and grin as she moans and begs to get fucked, wriggling about like the slinky thing that she is. ", parse);
	if(opts.preg)
		Text.Add("Being as pregnant as she is hasn’t diminished the sable-morph’s libido any - if nothing else, it’s made her even more horny than ever. Wriggling in your grasp, Isla squeaks pleadingly, her little pink tongue hanging out of her open maw even as she grabs a milk-laden breast with a hand, shamelessly groping away until drops of pearly white goodness leak from her swollen nipples and seep into her fur. ", parse);
	Text.Add("Seems like she’s really worked up and ready, then - grunting softly, you thrust into your needy lover. She arches her back and stiffens her muscles, crying out as your [cockTip] pushes its way past her folds and into her heated depths, burying itself well and deep as you finally mount her like she deserves.", parse);
	Text.NL();
	
	Sex.Vaginal(player, isla);
	isla.FuckVag(isla.FirstVag(), opts.p1cock, 3);
	player.Fuck(opts.p1cock, 3);
	
	Text.Add("<i>“Nggh!”</i>", parse);
	Text.NL();
	Text.Add("No need to hold back, you reassure the poor girl. Just scream… but she’ll have to keep count, since you won’t be.", parse);
	Text.NL();
	Text.Add("With that, you begin to drill her furiously, putting as much animalistic enthusiasm and vigor into the exercise as befits the position. Isla yowls, pausing only to gasp before wordless, animal noises start coming from the back of her throat. Her mouth is open, exposing those sharp little teeth of hers, and her little pink tongue is hanging out of her mouth as she pants in ecstasy, oozing a thin strand of drool onto the grassy ground.", parse);
	Text.NL();
	Text.Add("<i>“Ngh! Ngh!”</i>", parse);
	Text.NL();
	Text.Add("Why hold back? She’s already a hopeless mess. Just let it go. Let it all go…", parse);
	Text.NL();
	parse["f"] = figure == Isla.Figure.Girly ? "perky" : figure == Isla.Figure.Womanly ? "rounded" : "heavy";
	parse["c"] = player.NumCocks() > 1 ? Text.Parse(", your unused cock[s2] slapping against the backs of her thighs as you continue drilling into her", parse) : "";
	parse["k"] = opts.knot ? "r knot" : "";
	parse["ks"] = opts.knot ? "s" : "";
	Text.Add("Her hips are moving in time with yours to take as much of you into her as she can, her [f] breasts sway under her as you fuck her with everything you’ve got[c]. Her cunt squeezes and clenches about your shaft as you[k] grind[ks] against the lips of her womanly flower, the entirety of her body responding to the bestial fucking she’s receiving.", parse);
	Text.NL();
	Text.Add("Heh, the fact that she’s so firm and athletic only makes the fucking all the better - you can’t imagine a frail wallflower having the kind of energy she’s putting into being fucked by you. Bending a little further over her, you catch hold of the sable-morph’s swaying braid, tugging insistently on it until she half-turns about to look at you.", parse);
	Text.NL();
	Text.Add("Isla’s dark, beady eyes are half-glazed over, but what’s left of her wits that isn’t already addled looks back at you pleadingly. Hmm… maybe you’ve teased her enough… or maybe not. Pulling her flexible body up to you by her braid, you lean in and plant a kiss on Isla’s muzzle before letting her fall back onto all fours. That done, you gather yourself and begin drilling her fast and furiously, trying to push her to the finish line as quickly as you can.", parse);
	Text.NL();
	parse["f"] = figure == Isla.Figure.Girly ? "slim" : figure == Isla.Figure.Womanly ? "protruding" : "prominent";
	Text.Add("The effect is immediate. Unable to withstand the relentless assault on her delicate, sensitive pussy, Isla wails like she’s been caught in a trap, her paws scrabbling at the ground and throwing up little crumbs of earth in the throes of her passion. Her body is flush with heat that you can distinctly feel, even as you grab her [f] hips to steady yourself in your assault.", parse);
	Text.NL();
	Text.Add("She’s the first one to orgasm yet again; her entire body locks up and stiffens about your [cock], a drop of blood welling up at her muzzle where she’s bitten it in a bid not to cry out.", parse);
	Text.NL();
	if(player.FirstCock()) {
		Text.Add("<i>“Fuuuuuck,”</i> Isla moans. <i>“Damn ya, just finish it and cum inside me already. I… I dunno if I can take it a third time without passing out o’ something.", parse);
		if(opts.preg)
			Text.Add(" Damn it, there’s no reason for you not to, I’m already knocked up, so just hurry up and get it done.", parse);
		Text.Add("”</i>", parse);
		Text.NL();
	}
	Text.Add("You stay like that for a few seconds, hips locked together as she rides out her orgasm, then as she sags with exhaustion and exhilaration, it’s your turn to take things to their natural conclusion.", parse);
	Text.NL();
	parse["k"] = opts.knot ? ", her pussy giving only the most token of resistances before your knot pops in, tying her" : "";
	Text.Add("Bashing your hips against her ass, you thrust into her one last time[k]. ", parse);
	if(player.FirstCock()) {
		Text.Add("As the last of her girl-cum slides down her thighs, it’s your turn to shoot off your thick, heated load into her, letting the sable-morph get a distinct taste of your virility.", parse);
		Text.NL();
		
		var cum = player.OrgasmCum();
		Scenes.Isla.Impregnate(player, cum);
		
		if(opts.preg) {
			Text.Add("Since she’s already carrying your cubs, though, Isla’s cervix holds tight against the flood of spunk that’s battering against it. With nowhere else to go, it eventually creeps out of her cunt by way of seeping in between your rod and dripping onto the ground between her knees, forming a large, sticky puddle.", parse);
		}
		else if(cum > 6) {
			Text.Add("Isla moans as your spunk rapidly floods her cunt and womb, pushing past her cervix to invade her well and good. With each shot of seed you send into her, the sable-morph’s belly swells further and further outwards until she’s rounded like a ball and barely able to keep touch with the ground to maintain her balance.", parse);
			Text.NL();
			Text.Add("Heh, with how virile this load of yours must be, hopefully she doesn’t swell up with your cubs to this extent. It’d certainly be a load on her…", parse);
		}
		else if(cum > 3) {
			Text.Add("Isla gasps as you blast off your sperm into her, quickly filling her cunt and womb with your baby batter. Slowly, her flat belly begins to push outward until she’s sporting a nice, rounded tummy swollen with your cum, letting you get a preview of how she’s going to end up in the event your seed takes root in her waiting womb.", parse);
			Text.NL();
			Text.Add("You do have to admit, she looks better this way.", parse);
		}
		else {
			Text.Add("With a loud grunt, you blast of wave after wave of seed into Isla’s waiting cunt. The sable-morph squeaks and squeals as she feels the hot slipperiness enter her body, and you can feel her insides milking you for all you’re worth. With such encouragement, it doesn’t take you long to drain everything you’ve got into your lover, who is more than willing to accept what you’ve got.", parse);
		}
	}
	else {
		Text.Add("Even though your shaft isn’t real, the sensations which it’s causing are very much so. Pummeling and grinding against your own crotch even as you pound away into Isla’s cunt, it’s with some reluctance that you let yourself slow down. Sure, you might not have gotten off like she did - to be fair, she <i>is</i> a hair trigger - but you still nevertheless enjoyed yourself quite thoroughly.", parse);
	}
	Text.NL();
	Text.Add("Alas, all good things must come to an end, and it seems like forever before you can gather the strength to slide out of her. ", parse);
	if(opts.knot)
		Text.Add("Your knot pulls free of Isla with an audible squelch and pop, and she slumps onto her side, panting and heaving in her utterly worn-out state.", parse);
	else
		Text.Add("You pull free of an exhausted Isla with a soft squelch, cum slowly oozing from her well-used hole. The sable-morph lets out a gentle sigh of satisfaction, and slumps onto her side on the grass.", parse);
	Text.NL();
	
	Scenes.Isla.Sex.PitchVaginalExit(parse, opts);
}

Scenes.Isla.Sex.PitchVaginalWall = function(parse, opts) {
	Text.Add("Grabbing Isla by the shoulders, you whirl her around, leading her to the nearest mountain face and pinning her against the cool, mossy rock.", parse);
	if(opts.preg)
		Text.Add(" The sable-morph’s small baby bump protrudes from her midriff, but it isn’t large enough yet to be too much of an impediment for what you’re intending to do to her. Having blatant proof of her fertility - or conversely, your virility - so close only serves to excite you more, and you lean in to plant another kiss on her muzzle.", parse);
	Text.NL();
	Text.Add("Isla makes a bit of a show pretending to escape, wriggling this way and that as she squeaks in mock terror, her braid swaying in time with the motions of her head. Hah. There’s no escape for a juicy little morsel like her, you tell her, and you’re going to nail her straight through and into the rock face beyond.", parse);
	Text.NL();
	Text.Add("<i>“Oh no! Anything but that!”</i>", parse);
	Text.NL();
	Text.Add("She sure is a slippery little thing, but now you’ve caught her well and good. Time for her punishment!", parse);
	Text.NL();
	Text.Add("Another squeak escapes Isla’s muzzle, and she involuntarily moves her hips up against the stiffness of your rod, grinding the petals of her womanly flower across its head and leaving a faint sheen of moistness in its wake. You smile at the steady warmth building in your groin, then reach down and slide a finger into her sensitive cunt. Isla responds immediately, her breath quickening and inner walls tensing at your invading digit, and she whimpers softly as you withdraw, wanting more.", parse);
	Text.NL();
	Text.Add("Shouldn’t keep her waiting, then. Moving closer until there’s but an inch or two separating your bodies, you work your stiff rod in between her thighs, teasing lightly at her increasingly swollen lips. Isla shudders, clenching the pit of her stomach, and barely stifles a loud squeal as you thrust forward and nail her squarely where it counts.", parse);
	Text.NL();
	
	Sex.Vaginal(player, isla);
	isla.FuckVag(isla.FirstVag(), opts.p1cock, 3);
	player.Fuck(opts.p1cock, 3);
	
	Text.Add("Pressed against the wall as she is, Isla’s whimpers turn to moans as you start up a steady rhythm, spreading her legs ever further to encourage your furious thrusts.", parse);
	Text.NL();
	parse["f"] = opts.figure == Isla.Figure.Girly ? "small" :
		opts.figure == Isla.Figure.Womanly ? "shapely" : "generous";
	Text.Add("<I>“Ya may have me pinned down, but you’ll never break me!”</i> Isla gasps, even as you press her further against the wall until her hands are spread out and head is thrown back against it. Each firm movement of your hips sends her [f] breasts jiggling, and you can’t help but smile at the mock bravado she’s putting on despite the orgasmic sensations that must be coursing through her body at the moment.", parse);
	Text.NL();
	Text.Add("Oh? Is that an invitation for you to do your best, then? Well, since she asked so nicely, guess you’ll just have to oblige her wishes. Even from up here, you can get a good whiff of the scents carried by the sable-morph’s crotch fur and leaking pussy, and it only serves to excite you more.", parse);
	if(!opts.strapon) {
		Text.Add(" Your [cocks] begin[notS] to feel painfully full with all the blood that’s rushing into them - you can practically <i>feel</i> your pulse making your man-meat[s] twitch in anticipation, eager to blast off a full load already.", parse);
		Text.NL();
		Text.Add("Patience, patience. Good things come to those who wait.", parse);
		Text.NL();
	}
	Text.Add("Isla’s sensitive pussy doesn’t fail you, quick to betray her with its hair trigger nature. Wailing, her entire body convulses as her first orgasm washes over her, and she whips her hands forward to grab your shoulder as she rides out the wave of pleasure. Squeezing and clenching about your shaft, her cunt only encourages you to keep up the pounding you’re giving the poor sable-morph.", parse);
	Text.NL();
	Text.Add("So much for not breaking her, eh?", parse);
	Text.NL();
	Text.Add("She gasps. <i>“Ya shouldn’t underestimate me. I’m still in the fight.”</i>", parse);
	Text.NL();
	Text.Add("All right, then. Let’s see how she deals with <i>this</i>!", parse);
	Text.NL();
	parse["c"] = player.NumCocks() > 1 ? Text.Parse(" your unused shaft[s2] slapping against her soaked thighs,", parse) : "";
	Text.Add("Greedily, you pick up the pace,[c] your midriff pounding against ", parse);
	if(opts.preg)
		Text.Add("her small baby bump", parse);
	else
		Text.Add("hers", parse);
	parse["knot"] = opts.knot ? "to your knot" : "in";
	Text.Add(" as you mash your crotch against hers, hilting yourself all the way [knot] as you seek to breed her as thoroughly as possible. ", parse);
	var cockSize = opts.p1cock.Volume();
	if(cockSize >= 400)
		Text.Add("The phallic bulge from your massive member is blatant on her lower belly as her cunt struggles to contain as much cock as it can, and although she’s fairly flexible as a sable-morph, she’s not <i>that</i> flexible.", parse);
	else if(cockSize >= 100)
		Text.Add("You can’t help but notice that your member is creating a gentle bulge on Isla’s lower belly with each downstroke, her insides seeking to accommodate your hefty shaft as best as they can. Sure, she’s a sable-morph and hence quite flexible, but even she doesn’t go <i>that</i> far.", parse);
	else
		Text.Add("Isla squeaks and wriggles as she moves herself into a better position to serve as your sheath. She feels wonderfully tight and juicy with powerful muscles equipped to clench, suck and squeeze, no doubt the result of her rather active lifestyle.", parse);
	Text.NL();
	Text.Add("When Isla finally climaxes for the second time, her pussy goes into overdrive, squeezing and milking at your cock as she cries out for you to breed her. Pressing her firmly against the wall, you drive hard into her a few more times, making sure she gets her wish good and hard.", parse);
	Text.NL();
	if(player.FirstCock()) {
		Text.Add("With a grunt of effort, you throw your head back, feeling your groin clench at the familiar sensation of cum welling up at the base of your cock. Before you know it, you’re blasting spurt after spurt of hot seed into Isla’s cunt, seeking to fill the sable-morph with delicious baby batter. ", parse);
		
		var cum = player.OrgasmCum();
		Scenes.Isla.Impregnate(player, cum);
		
		if(opts.preg) {
			Text.Add("Considering that she’s stuffed with your cubs, though, it doesn’t look like any of your spunk’s forcing its way in, even considering the high pressure it’s under. Instead, your seed forces its way out of her cunt, her folds stretching just enough to let it seep out and drip onto the ground.", parse);
			Text.NL();
			Text.Add("Bah, no matter. Not as if it wasn’t going to waste anyway, was it?", parse);
		}
		else if(cum > 6) {
			Text.Add("Isla moans and lets out a scream of delight, going limp against the rock face behind her. Deep inside, you feel her womb preparing itself to accept your load, and accept it she does - you keep on pumping and pumping away, your massive load leaving the poor sable girl so bloated and full with all that hot seed locked inside her womb.", parse);
			Text.NL();
			Text.Add("Once you finally manage to withdraw, she flops to the floor, too stuffed to do anything but lie against the wall and rub her paws over her overstuffed womb as your sperm slowly leaks out of her cunt.", parse);
		}
		else if(cum > 3) {
			Text.Add("Isla gasps and squeals out loud, her knees buckling as her poor, sensitive cunt finally gives in and orgasms yet another time. Deep within her, you can feel her cervix stretch wide to accept the torrent’s of hot seed you’re unleashing into her - although the pressure is such that a little escapes and trickles down her thighs, most of it gets where it needs to go and stays there.", parse);
			Text.NL();
			Text.Add("Your large load leaves the sable-morph with a full and bloated tummy that she happily strokes as the throes of orgasm begin to die down, panting with unfocused eyes as she struggles to catch her breath.", parse);
		}
		else {
			Text.Add("You may not have that much cum to spare, but Isla’s body is determined to not let a single drop go to waste. Her insides clench and unclench as she milks your shaft for all it’s worth, her body instinctively doing everything it can to get itself pregnant.", parse);
			Text.NL();
			Text.Add("Seeing her so enthusiastic, you drive into her hard a few more times, trying to save your seed a little travelling distance, then slowly withdraw from her wet, oozing pussy.", parse);
		}
		if(player.NumCocks() > 1) {
			Text.NL();
			Text.Add("Your other shaft[s2] explode[notS2] with sperm, spraying [itsTheir2] load all over your lover’s groin and thighs, staining her fur.", parse);
		}
	}
	else {
		Text.Add("Without a real shaft, you don’t have any seed with which to fill Isla up with, but at least you can still savor the satisfaction of driving your lover to cum over and over again until she’s utterly spent and exhausted, a limp meat-puppet impaled on your strap-on. When you’re certain she’s had enough, you reluctantly withdraw from her dripping cunt, leaving her to slump against the rock face behind the two of you.", parse);
	}
	Text.NL();
	
	Scenes.Isla.Sex.PitchVaginalExit(parse, opts);
}

Scenes.Isla.Sex.PitchVaginalExit = function(parse, opts) {
	Text.Add("<i>“Oog… enough…”</i>", parse);
	Text.NL();
	Text.Add("Yeah, now that the rush is beginning to die down, you’re starting to feel more than a little spent, too. Isla displays no shame in sprawling out on the ground beside you, making little happy noises in the back of her throat as she catches her breath. You see no reason not to join her, running your hands through what little clean fur she has left, toying with the adornments tied therein.", parse);
	Text.NL();
	Text.Add("Out of nowhere, Isla sighs out loud and hugs you, ", parse);
	if(opts.stage >= 0.4)
		Text.Add("pressing her baby bump against your midriff and ", parse);
	Text.Add("making more happy noises in the back of her throat. You feel her soft little tongue run against your neck as the sable-morph licks you, and it’s hard not to feel warm and fuzzy inside as the both of you bask in the afterglow of sex. Isla still smells of herself, but you’ve definitely added something of your scent to hers, still lingering on her body… or at least, until she goes to wash herself off.", parse);
	Text.NL();
	if(player.FirstCock() && !opts.preg) {
		Text.Add("<i>“Welp. Chances are you probably just knocked me up, ya bastard,”</i> Isla whispers softly.", parse);
		Text.NL();
		if(!(isla.flags["Talk"] & Isla.Talk.SexVag)) {
			Text.Add("Is that going to be a problem?", parse);
			Text.NL();
			Text.Add("<i>“Naah, else I wouldn’t have agreed to fuck you.”</i> Isla sighs again and presses her body against you, trying to get comfortable. <i>“To be honest, since a number of the marriage alliances have been out of the clan the last few rounds, we do need some fresh blood… I’ll just keep the little tykes ‘round till they’re weaned and bring them back to the tribe when I next pop by to get stuff. Know plenty of older folk who’d love another cub, but can’t have one anymore.”</i>", parse);
			Text.NL();
			Text.Add("Well, if she’s sure about it. Won’t that injure her chances of being paired off at the next gather, though?", parse);
			Text.NL();
			Text.Add("Isla chuckles. <i>“What, a young lady like me with proof of her fertility injure her chances? Waving the fact that I can have cubs in their face would actually <b>improve</b> them.”</i>", parse);
			Text.NL();
			Text.Add("All right, then. She’s set your mind at ease.", parse);
		}
		else {
			Text.Add("That’s a good thing. Eden could use a whole lot more adorable sable-morphs like her.", parse);
			Text.NL();
			Text.Add("<i>“Hey, you’ve already gotten into my pants. There’s no need t’ flatter me anymore.”</i>", parse);
			Text.NL();
			Text.Add("What, does she think so lowly of herself that the only reason someone might flatter her would be to fuck her and knock her up?", parse);
			Text.NL();
			Text.Add("<i>“I know, I know…”</i>", parse);
		}
		Text.NL();
		
		isla.flags["Talk"] |= Isla.Talk.SexVag;
	}
	Text.Add("Now, she really ought to be getting some sleep. Tomorrow’s still going to come along, and work isn’t going to get itself done.", parse);
	Text.NL();
	Text.Add("<i>“Yeah, but stay with me a moment, ‘kay?”</i>", parse);
	Text.NL();
	Text.Add("Sure, you can do that. Reaching up to give Isla an affectionate pat on the head, you gather her into your arms, and she’s fast asleep before long. Her soft, silky fur is the best blanket one could hope for against the cold Highland nights, and before too long you’ve drifted off yourself, too.", parse);
	Text.Flush();
	
	isla.relation.IncreaseStat(100, 5);
	
	world.StepToHour(6);
	
	Gui.NextPrompt();
}

// Isla's spring

Isla.Bathing = {
	Quick  : 0,
	Medium : 1,
	Long   : 2
};

Scenes.Isla.Bathe = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	Text.Clear();
	if(!isla.springTimer.Expired()) {
		Text.Add("You consider taking another dip in the transformative spring, but it’s probably not a good idea when you’re still all raw and tingly from your last soak. Sure, Isla might pull you out if you faint from the heat, but who knows how long she might take getting to you?", parse);
		Text.Flush();
		
		Gui.NextPrompt();
		
		return;
	}

	Text.Add("You step out over the spring’s clear waters and peer into its depths. Are you sure you want to have anything to do with it at the moment? If you soak in this, it’s likely that you’ll come out different than when you went in.", parse);
	Text.Flush();
	
	//[name]
	var options = new Array();
	options.push({ nameStr : "Quick Dip",
		tooltip : "Take a quick dip in the spring.",
		func : function() {
			Text.Clear();
			Text.Add("Deciding to take just a quick dip, you remove your [armor] and wade out into the hot spring. The waist-high water is delightfully warm, and it’s a pleasure to be able to wash off the dust and dirt of your journey - and of course, any other things which you might’ve picked up along the way. You dunk your head in a few times, making sure you’re thoroughly rinsed all over, and a strange warm tingling creeps into your [skin] as the spring’s transformative magic takes effect…", parse);
			
			world.TimeStep({minute: 10});
			
			isla.springTimer = new Time(0,0,1,0,0);
			
			Scenes.Isla.BatheTF(parse, Isla.Bathing.Quick);
		}, enabled : true
	});
	options.push({ nameStr : "Relax",
		tooltip : "Have a longer, more relaxing and transformative soak.",
		func : function() {
			Text.Clear();
			Text.Add("Since you’re here, you might as well settle in and relax for a while. Stripping yourself of your [armor], you toe the spring’s bubbling surface - delightfully warm, as expected. Even the best bathhouses in Rigard don’t compare to this… or at least, when it comes to the water.", parse);
			Text.NL();
			Text.Add("In you go, up to your neck; you find a nice spot to lie against with your head out of the water, and close your eyes to relax. The water churns and swirls about your body, running across every nook and cranny of your form, seeking out the dust and sweat of your travels and carrying it away.", parse);
			Text.NL();
			Text.Add("Then you feel it - a pleasant buzz against your [skin] as the spring’s transformative magic begins, seeping through your limbs and into your bones…", parse);
			
			world.TimeStep({minute: 30});
			
			isla.springTimer = new Time(0,0,1,0,0);
			
			Scenes.Isla.BatheTF(parse, Isla.Bathing.Medium);
		}, enabled : true
	});
	options.push({ nameStr : "Long Soak",
		tooltip : "Take a long soak in the spring, letting its magic take full effect.",
		func : function() {
			Text.Clear();
			Text.Add("Ah… you’ve come all the way up here to use this thing, and you’re getting the most out of it. Yes, you’re not getting out of this little spring until you’re thoroughly clean and every bit of you has been scrubbed clean and raw. Throwing off your [armor] without a care in the world, you lower yourself into the water, feeling the bubbles fizz delightfully against your body and the rising steam work its way into your lungs, leaving you feeling refreshed both inside and out.", parse);
			Text.NL();
			Text.Add("Once you’re somewhat adjusted to the hot spring’s waters, you wade out towards the middle, crouching a little such that the water comes up to your chin, and begin scrubbing. Being able to take a bath rivaling that offered by Rigard’s finest bathhouses is a treat, to make an understatement, and you close your eyes and lose yourself in the simple wonder of being able to feel <i>clean</i>.", parse);
			Text.NL();
			Text.Add("Of course, getting clean isn’t the only thing happening to you. With such a vigorous and enthusiastic scrubbing taking place, it isn’t long before you feel the transformative tingle of the spring’s magic at work…", parse);
			
			world.TimeStep({hour: 1});
			
			isla.springTimer = new Time(0,0,1,0,0);
			
			Scenes.Isla.BatheTF(parse, Isla.Bathing.Long);
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("On second thought, you’d rather avoid the spring for the moment. It’s not going anywhere, should you change your mind.", parse);
		Text.Flush();
		
		Gui.NextPrompt();
	});
}

Scenes.Isla.BatheTF = function(parse, level) {
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	var scenes = new EncounterTable();
	
	scenes.AddEnc(function() {
		Text.NL();
		Text.Add("A warm tingling sensation envelopes your form, tendrils of heat working their way into your body from the water. It’s not an unpleasant feeling - in fact, quite the opposite, and you feel renewed and rejuvenated by the experience.", parse);
		Text.NL();
		Text.Add("Which is not surprising, considering that the spring’s magic has given you an entirely new body - that of a long, slinky ferret, complete with fur and limbs to match.", parse);
		var body = player.LowerBodyType();
		parse["odd"] = (body == LowerBodyType.Taur) ? "tauric" : player.IsNaga() ? "serpentine" : "odd";
		if(body != LowerBodyType.Humanoid)
			Text.Add(" Gone is your [odd] lower half, replaced by a wiry pair of legs and light feet.", parse);
		
		player.body.torso.race = Race.Ferret;
		player.body.legs.race = Race.Ferret;
		player.body.arms.race = Race.Ferret;
		
		return true;
	}, 1.0, function() {
		return !player.body.torso.race.isRace(Race.Ferret) ||
			!player.body.legs.race.isRace(Race.Ferret) || 
			!player.body.arms.race.isRace(Race.Ferret); });
	scenes.AddEnc(function() {
		Text.NL();
		Text.Add("As you dunk your head beneath the water’s surface to scrub at your [hair], your head’s overcome by a strange sensation. A cursory examination, followed by a look at your reflection in the spring confirms your suspicions - your ears now sit on top of your head, the very likeness of a ferret.", parse);
		var ant = player.HasAntenna();
		var horns = player.HasHorns();
		if(ant || horns) {
			var h = "";
			if(ant) h += "antennae";
			if(ant && horns) h += " and ";
			if(horns) h += "horns";
			parse["h"] = h;
			Text.Add(" Even as you look on, your [h] shrink and dwindle, receding into your head with the most queer sensation until they’re completely gone.", parse);
		}
		
		player.Ears().race = Race.Ferret;
		TF.RemoveAppendage(player.Appendages(), AppendageType.horn, -1);
		TF.RemoveAppendage(player.Appendages(), AppendageType.antenna, -1);
		
		return true;
	}, 1.0, function() {
		return !player.Ears().race.isRace(Race.Ferret) ||
			player.HasAntenna() || player.HasHorns(); });
	scenes.AddEnc(function() {
		Text.NL();
		Text.Add("Basking in the steam rising from the hot spring, you feel it gather on your face, wetting your skin. And then there’s a strange tightness, not altogether unpleasant…", parse);
		Text.NL();
		Text.Add("Wait, a tightness? You open your eyes and study your reflection in the spring’s surface to find that your face has stretched into a long, pointed muzzle - a ferret’s, to be exact.", parse);

		player.body.head.race = Race.Ferret;
		
		return true;
	}, 1.0, function() { return !player.body.head.race.isRace(Race.Ferret); });
	scenes.AddEnc(function() {
		Text.NL();
		Text.Add("As you continue your soak in the pool, a sudden intense warmth builds up at the base of your spine. Before you realize it, you’re sporting a furry new tail, soaked from the spring’s water.", parse);
		
		TF.SetAppendage(player.Back(), AppendageType.tail, Race.Ferret, Color.brown);
		
		return true;
	}, 1.0, function() { var tail = player.HasTail(); return !tail || !tail.race.isRace(Race.Ferret); });
	
	var IncompleteCockTf = function() {
		var changed = false;
		_.each(player.AllCocks(), function(c) {
			if(!c.race.isRace(Race.Ferret)) changed = true;
			if(c.Knot()) changed = true;
		});
		if(player.Genitalia().Sheath()) changed = true;
		return changed;
	}
	
	scenes.AddEnc(function() {
		var knot = false;
		_.each(player.AllCocks(), function(c) {
			if(c.Knot()) knot = true;
			c.race = Race.Ferret;
			c.knot = 0;
		});
		var sheath = player.Genitalia().Sheath();
		player.Genitalia().SetCover(Genitalia.Cover.NoCover);
		
		Text.NL();
		Text.Add("Gently, the water churns about your [cocks] - if you didn’t know better, you’d have imagined the spring itself was giving you a slow-paced handjob. It certainly <i>feels</i> that way, with your [cocks] stiff and at attention - without warning, your [cocks] [isAre] suddenly infused with a burst of heat, and you watch with your breath in your throat as the spring’s magic has its way with your shaft[s]. ", parse);
		if(knot || sheath) {
			var ks = "";
			if(knot) ks = "your knot deflating";
			if(knot && sheath) ks = " and ";
			if(sheath) ks = "your sheath receding into your body with a soft slurp";
			parse["ks"] = ks;
			Text.Add("You can’t help but let out a moan, [ks]. ", parse);
		}
		parse["c"] = player.NumCocks() > 1 ? "several fine specimens of" : "a fine specimen of";
		Text.Add("When the changes are finally over, you’re left with [c] mustelid manhood, just waiting to be used.", parse);
		
		return true;
	}, 1.0, function() { return player.FirstCock() && IncompleteCockTf(); });
	scenes.AddEnc(function() {
		Text.NL();
		Text.Add("The spring’s warm flow soothes your body, and you lie back to better enjoy the mineral-rich waters and their touch against your [skin]. As you do, though, you can’t help but notice that the spring’s magic is working away on your figure, progressively trading bulk for lean, wiry mass that’s no less powerful.", parse);
		
		player.body.muscleTone.DecreaseStat(0, 0.25, true);
		
		return true;
	}, 1.0, function() { return player.body.muscleTone.Get() > 0; });
	
	if(level >= Isla.Bathing.Medium) {
		var IncompleteCockLenTf = function() {
			var changed = false;
			_.each(player.AllCocks(), function(c) {
				if(c.Len() < 23) changed = true;
			});
			return changed;
		}
		
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("With a gasp of pleasure, you feel the magical spring’s currents take hold of your [cocks], quickly stroking [itThem] to attention and sending tingles running down [itsTheir] length[s]. Before long, [itsTheyre] painfully erect, struggling to contain the exquisite sensations within - then a loud moan of release escapes your lips as your [cocks] surge[notS] forward, gaining an inch or thereabouts in length.", parse);
			
			_.each(player.AllCocks(), function(c) {
				c.length.IncreaseStat(23, 2.5);
			});
			
			return true;
		}, 1.0, function() { return IncompleteCockLenTf(); });
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("For a moment, you feel your scrotum grow a little tighter. At first, you think it might just be the heat, but no - your balls have indeed plumped up a little with a surge of extra virility, rendering your seed more apt to take root in a welcoming womb.", parse);
			player.Balls().size.IncreaseStat(6, level);
			
			return true;
		}, 1.0, function() { return player.HasBalls() && player.Balls().BallSize() < 6; });
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("As you lie in the delightfully warm water, tingles begin to spread across your chest, and a strange sensation of pressure begins to build behind your [nips]. As you look down, you catch sight of your breasts swelling, maturing before your very eyes. Bigger and bigger, rounder and rounder - slow but steady, the growth and pressure doesn’t stop until you’re a cup size bigger than you were when you went in.", parse);
			player.FirstBreastRow().size.IncreaseStat(12.5, 2.5);
			
			return true;
		}, 1.0, function() { return player.FirstBreastRow().Size() < 12.5; });
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("You shudder as a shiver runs up your spine, and some things shift around in your lower belly. Shortly after, a sudden wave of lust races over you, and when you’ve finally recovered, you notice that your pussy lips have swollen and thickened - probing your insides with a finger reveals that you’re definitely more stretchy than before.", parse);
			
			player.FirstVag().capacity.IncreaseStat(8, 2);
			
			return true;
		}, 1.0, function() { return player.FirstVag() && player.FirstVag().Capacity() < 8; });
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("With a sudden rush of heat, a faint itching sensation grows in your lower body, slowly reaching around to envelop your [butt]. Reaching down to grab your hips, you can <i>feel</i> them growing wider, your stance widening even as your bones reshape themselves to better allow for things both coming in and going out of your pelvis.", parse);
			Text.NL();
			Text.Add("Not to be outdone, your butt swells a little, working with your newly-endowed hips to give you a more fertile appearance courtesy of the spring.", parse);
			
			player.body.torso.hipSize.IncreaseStat(HipSize.VeryWide, 5);
			player.Butt().buttSize.IncreaseStat(9, 3);
			
			return true;
		}, 1.0, function() { return player.body.torso.hipSize.Get() < HipSize.VeryWide || player.Butt().Size() < 9; });
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("As you lean back to relax in the water, a queer sensation of tingling change washes over you, leaving your head spinning. It only lasts for a moment or two, but when you’ve righted yourself and gathered your senses, you catch sight of yourself in the water - yeah, you definitely look more girly than you did moments ago.", parse);
			player.body.femininity.IncreaseStat(1, 0.25);
			
			return true;
		}, 1.0, function() { return player.body.femininity.Get() < 1; });
		scenes.AddEnc(function() {
			Text.NL();
			if(player.PregHandler().BellySize() < 0.1) {
				Text.Add("The longer you stay in the pool’s waters, the hotter your body seems to become, especially in your lower belly where it’s the most prominent, forming a subtle warm glow. At the same time, you can feel a small hard lump pushing outward, and a tingling grows deep within your [breasts]…", parse);
				Text.NL();
				Text.Add("Curious, you let your hands wander down to your waist, and discover that your once flat belly has grown into a slight swell - barely perceptible, but still there. Uh-oh - seems like that last sexual encounter you had wasn’t as safe as you thought it’d be. You’re going to be a mommy now, and the spring’s magic was just kind enough to let you know.", parse);
			}
			else {
				Text.Add("With a contented sigh, you lean back into the hot spring and let the water lap over your [belly]. The soothing warmth is absolutely divine, with the way it’s working all the aches and pains out of your body, and filling it with vitality. So much vitality, in fact, that you soon become aware of a gentle pressure within your lower belly. As your hands run over your midsection, you feel it swelling and growing, your womb becoming a little heavier with life. Seems like you’re going to be giving birth a little sooner than expected…", parse);
			}
			_.each(player.PregHandler().PregnantWombs(), function(womb) {
				var oldProgress = womb.progress;
				womb.progress += 0.15;
				var hours = 0.15 * womb.hoursToBirth / (1-oldProgress);
				womb.hoursToBirth -= hours;
			});
			
			return true;
		}, 1.0, function() { return player.PregHandler().IsPregnant(); });
	}
	if(level >= Isla.Bathing.Long) {
		scenes.AddEnc(function() {
			Text.NL();
			var cock;
			if(player.FirstVag()) {
				Text.Add("All of a sudden, a strange surge of energy pulses within your groin - maybe you’ve dallied in the spring too long. Before you can finish that thought, though, you feel the energy gather and dive straight into your clit, which then trembles uneasily. You groan, clutching at your groin as your love button begins to pulse and grow, rapidly enlarging into a phallus of no small size and breaking away from your cunt.", parse);
				Text.NL();
				Text.Add("With a final surge of lust, your now fully-erect cock displays its functionality by blasting off a couple strings of cum, even as a new clit grows in your cunt to occupy the recently-vacated space.", parse);
				
				cock = player.FirstVag().CreateClitcock();
			}
			else {
				Text.Add("The spring’s magic finally takes hold, and the changes begin. You moan and squirm as the skin on your groin bulges and shifts, erupting into a sensitive new phallus of considerable size. Thick and painfully erect, it announces its arrival by firing off a few strings of cum to land sloppily in the pool, then lets up a little, although you can still feel it pulsing with excitement.", parse);
				
				cock = new Cock();
			}
			cock.length.base = 18;
			cock.thickness.base = 4;
			cock.race = Race.Ferret;
			player.body.cock.push(cock);
			
			return true;
		}, 1.0, function() { return !player.FirstCock(); });
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("You moan and pant as a churning sensation gathers beneath your [cocks]. Without warning, a sudden build-up of pressure has you gasping for breath, and then a pair of freshly-grown balls pop out forcefully to hang heavy on your groin.", parse);
			Text.NL();
			Text.Add("Gingerly, you reach down and cup your new balls. Yep, they’re real all right - goodly-sized, sensitive, and ready to get down to business.", parse);
			
			player.Balls().count.base = 2;
			
			return true;
		}, 1.0, function() { return player.FirstCock() && !player.HasBalls(); });
		scenes.AddEnc(function() {
			Text.NL();
			Text.Add("Heat slowly gathers in your groin, and you wriggle and squirm in place as the sensations become more intense. Without warning, a line of tender flesh rises in your groin, followed by a tremendous wave of pleasure as it parts, your feminine flower opening for business and ready to receive seed.", parse);
			Text.NL();
			Text.Add("The changes aren’t over, though. Your lower belly clenches and twists as internal changes begin taking place, and by the end of it all you’re feeling quite horny, flush with the desire to have a child growing in your new womb.", parse);
			
			player.body.vagina.push(new Vagina());
			
			return true;
		}, 1.0, function() { return !player.FirstVag(); });
		scenes.AddEnc(function() {
			Text.NL();
			
			if(player.PregHandler().BellySize() < 0.1) {
				Text.Add("Without warning, a small, hard knot forms in the pit of your stomach, and your insides churn most unsettlingly. The sensation travels up your torso, too, and rapidly wells up in your chest as a warm tingling.", parse);
				Text.NL();
				Text.Add("Then it all fades away, and nothing happens for a second or two before your [belly] and [breasts] begin pushing outwards, ballooning up until you’re left with a small but noticeable potbelly and a perkier, fuller chest.", parse);
				Text.NL();
				Text.Add("Huh. Guess that last sexual encounter you had took, and the spring was nice enough to notify you of it…", parse);
			}
			else {
				Text.Add("Out of nowhere, you get the sudden need to rub your [belly]. It doesn’t make any sense at first, but the urge is practically overwhelming, and before long you’re running your hands over the stretched skin of your midriff, delighting in how good it feels to be stroking and caressing the swell of your pregnancy.", parse);
				Text.NL();
				Text.Add("As your pleasure peaks, you become vaguely aware of a faint pressure coming from within your womb; you watch in amazement as your pregnancy advances rapidly, the spring’s magic pushing the moment of birth nearer and nearer. At last, though, the pleasure fades, and with it the strange growth, leaving you considerably more pregnant than when you got into the spring.", parse);
			}
			_.each(player.PregHandler().PregnantWombs(), function(womb) {
				var oldProgress = womb.progress;
				womb.progress += 0.3;
				var hours = 0.3 * womb.hoursToBirth / (1-oldProgress);
				womb.hoursToBirth -= hours;
			});
			
			return true;
		}, 1.0, function() { return player.PregHandler().IsPregnant(); });
	}
	
	var changed = false;
	//1-5 effects
	_.times(_.random(1,3) + level, function() {
		changed |= scenes.Get();
	});
	
	if(!changed) {
		parse["man"] = player.mfTrue("man", "woman");
		Text.Add("Ah, that was quite the fine soak! Although you don’t look any different, you definitely feel like a new [man] inside and out, completely rejuvenated thanks to the spring’s therapeutic waters. In a decidedly better mood than you went in with, you get dressed and gather your things.", parse);
	}
	
	Text.Flush();
	Gui.NextPrompt();
}

export { Isla };
