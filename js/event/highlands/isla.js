
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
