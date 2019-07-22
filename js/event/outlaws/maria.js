/*
 *
 * Define Maria
 *
 */
import { Entity } from '../../entity';
import { world } from '../../world';
import { GetDEBUG } from '../../../app';
import { DeadDropScenes } from './maria-dd';

let MariaScenes = {
	DeadDrops : DeadDropScenes,
};

function Maria(storage) {
	Entity.call(this);
	this.ID = "maria";

	// Character stats
	this.name = "Maria";

	this.avatar.combat = Images.maria;

	this.maxHp.base        = 100;
	this.maxSp.base        = 80;
	this.maxLust.base      = 50;
	// Main stats
	this.strength.base     = 20;
	this.stamina.base      = 22;
	this.dexterity.base    = 16;
	this.intelligence.base = 17;
	this.spirit.base       = 15;
	this.libido.base       = 20;
	this.charisma.base     = 18;

	this.level = 5;
	this.sexlevel = 3;
	this.SetExpToLevel();

	this.body.DefFemale();
	this.FirstVag().virgin = false;
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 5;
	this.SetSkinColor(Color.brown);
	this.SetHairColor(Color.black);
	this.SetEyeColor(Color.blue);

	this.SetLevelBonus();
	this.RestFull();

	this.flags["Met"] = 0; //Initial meeting. Bitmask
	this.flags["DD"] = 0; //Dead drops. Bitmask
	this.flags["Ranger"] = 0;

	this.DDtimer = new Time();

	if(storage) this.FromStorage(storage);
}
Maria.prototype = new Entity();
Maria.prototype.constructor = Maria;

Maria.Met = {
	ForestMeeting : 1,
	Fight         : 2,
	FightSexed    : 4,
	FightLost     : 8
};

Maria.Ranger = {
	NotTaught : 0,
	Taught    : 1
};

Maria.DeadDrops = {
	Alert     : 1,
	Talked    : 2,
	Completed : 4,
	PaidKid   : 8,
	SexedGuards : 16,
	ShowedRoyal : 32
	//TODO flag for repeat, specific things
};

// Add initial event, only trigger 6-20
world.loc.Forest.Outskirts.enc.AddEnc(
	function() {
		return MariaScenes.ForestMeeting;
	}, 3.0, function() {
		return Scenes.Global.VisitedRigardGates() &&
		       !Scenes.Global.VisitedOutlaws() &&
		       (world.time.hour >= 6 && world.time.hour < 20);
	}
);


Maria.prototype.FromStorage = function(storage) {
	this.Butt().virgin       = parseInt(storage.avirgin) == 1;

	this.LoadPersonalityStats(storage);

	// Load flags
	this.LoadFlags(storage);

	this.DDtimer.FromStorage(storage.DDtime);
}

Maria.prototype.ToStorage = function() {
	var storage = {
		avirgin : this.Butt().virgin ? 1 : 0
	};

	this.SavePersonalityStats(storage);

	this.SaveFlags(storage);

	storage.DDtime = this.DDtimer.ToStorage();

	return storage;
}


Maria.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
	this.DDtimer.Dec(step);
}

// Schedule
Maria.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Outlaws.Camp)
		return (world.time.hour >= 7 && world.time.hour < 22);
	return false;
}

Maria.prototype.EligableForDeaddropAlert = function() {
	//Only in the initial phase
	if(maria.flags["DD"] != 0) return false;
	//Only when meeting the correct conditions
	if(outlaws.flags["Met"] < Outlaws.Met.Bouqet) return false;
	//Only when meeting total Outlaws rep
	return true;
}

Maria.prototype.Act = function(encounter, activeChar) {
	// TODO: AI!
	Text.Add("The huntress hops around nimbly.");
	Text.NL();

	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var choice = Math.random();

	var trap = this.combatStatus.stats[StatusEffect.Counter];

	if(this.HPLevel() < 0.3 && this.pots > 0) {
		this.pots--;
		Items.Combat.HPotion.combat.Use(encounter, this, this);
	}
	else if(choice < 0.2 && Abilities.Physical.SetTrap.enabledCondition(encounter, this) && trap == null)
		Abilities.Physical.SetTrap.Use(encounter, this);
	else if(choice < 0.4 && Abilities.Physical.Hamstring.enabledCondition(encounter, this))
		Abilities.Physical.Hamstring.Use(encounter, this, t);
	else if(choice < 0.6 && Abilities.Physical.FocusStrike.enabledCondition(encounter, this))
		Abilities.Physical.FocusStrike.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.Ensnare.enabledCondition(encounter, this))
		Abilities.Physical.Ensnare.Use(encounter, this, t);
	else
		Abilities.Attack.Use(encounter, this, t);
}


// Camp interaction
MariaScenes.CampInteract = function() {
	if(outlaws.MariasBouqetAvailable()) {
		Scenes.Outlaws.MariasBouquet();
	}
	else if(maria.flags["DD"] & Maria.DeadDrops.Alert &&
	      !(maria.flags["DD"] & Maria.DeadDrops.Talked)) {
		MariaScenes.DeadDrops.Initiation();
	}
	else {
		var parse = {
			playername : player.name
		};
		
		Text.Clear();
		Text.Add("Maria suddenly coming to mind, you decide to go over and say hello to the ebony beauty. Problem is that even when she’s in camp, she’s never to be found in the same spot twice, and it takes you a little searching before you eventually find her.", parse);
		Text.NL();
		
		var scenes = new EncounterTable();
		
		if(world.time.hour >= 12) {
			scenes.AddEnc(function() {
				Text.Add("As it turns out, she’s currently doing a bit of fletching - tipping the arrow shafts with flint heads and making sure the feathers go on just right. It seems rather simple to you, but Maria’s brow is furrowed in an expression of furious concentration. There’s probably more to this fletching business than meets the eye… and it’s only natural that Maria pays great attention to it, since her life depends on her armaments.", parse);
				Text.NL();
				Text.Add("At length, though, she does set aside her materials and cocks her head at you. <i>“Come on, [playername]. If you’ve got something to say, spit it out already; there’s no need to be polite. We don’t have all day.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Maria’s preparing for her next foray into the forest, sharpening a flat-bladed dagger against an oiled whetstone. The monotonous scraping does get on the nerves after a minute or so of it, but you’ve come at a good time - she’s just finishing up, and after wiping off the last of the swarf, sets her kit aside and motions for you to sit on the ground beside her.", parse);
				Text.NL();
				Text.Add("<i>“So, you wanted to talk?”</i>", parse);
				Text.NL();
				Text.Add("Yeah. Does she have a bit of time?", parse);
				Text.NL();
				Text.Add("<i>“Shoot. I’m all ears.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("She’s dozing under the branches of one of the large riverside willow trees, getting a bit of shut-eye before heading out into the forest. True, she’s supposed to be one of the better outlaws… but she’s human too, and it’s not as if she’s sleeping on the job. Stopping a few feet from her, you clear your throat to announce your presence.", parse);
				Text.NL();
				Text.Add("One of her eyes rolls open lazily, but you aren’t fooled - you can see how fast the muscles tense under her skin. <i>“Oh. It’s you.”</i>", parse);
				Text.NL();
				Text.Add("Yeah, it’s you. Does she have a moment?", parse);
				Text.NL();
				Text.Add("Maria laughs. <i>“Does it look like I’m busy right now?”</i> With a soft grunt of effort, she pulls herself into a sitting position. <i>“Go on, I’ve never been more available. You wanted something?”</i>", parse);
			}, 1.0, function() { return true; });
		}
		else {
			scenes.AddEnc(function() {
				Text.Add("She’s at the river, or more precisely, down by where it meets the wall of palings and eventually flows out of camp. There’s a huge tub by Maria’s side, and on closer inspection - yes, there’s the washboard, the soap, and a huge pile of clothes. Most of them are Maria’s, but you do spot an article of Zenith’s here and there; they’re clearly far too large and of the wrong fitting for Maria herself.", parse);
				Text.NL();
				Text.Add("As you watch, Maria pounds away at the laundry, suds rising and covering her hands even as she starts sweating bullets from her brow. Slowly, she half-turns to you, still scrubbing away for dear life. <i>“Nothing surprising about this,”</i> she snaps. <i>“It’s a great workout for the forearms.”</i>", parse);
				Text.NL();
				Text.Add("Hey, you were just standing here without saying a single word.", parse);
				Text.NL();
				Text.Add("<i>“Except that I could feel your eyes burning into the small of my neck. If you think I’m an idiot-”</i> Maria slaps a shirt down on the board, rinses her hands in the river and sighs. <i>“Look, I didn’t come here to argue with you, and I don’t think you came down here to ogle at me. What did you want?”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("She’s got a handful of pelts stretched out on racks in front of her, the results of last night’s hunt. Some of them do look eerily similar to a number of the camp’s inhabitants… but then again, it’s just looks, right?", parse);
				Text.NL();
				Text.Add("As you look on, Maria carefully works away with a flensing knife, separating the last scraps of flesh from the hides and flicking them away into a reeking wooden bucket. It’s a grim job - there’re bloodstains up all the way to her wrists - but it’s probably better than the curing that awaits them…", parse);
				Text.NL();
				Text.Add("At length, Maria stands, rinses her hands in a small tub of water and turns to you, flicking the water off her fingers and onto the grassy ground. <i>“Thanks for waiting; guess I can take a break now. You were looking for me for something?”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Eventually, you do find Maria. The ebony beauty is slumped against one of the riverside willows, an unmarked bottle of clear liquid in her hands. You can smell the alcohol even from where you stand, and every now and then she raises the bottle to her lips and takes a swig.", parse);
				Text.NL();
				Text.Add("<i>“Hey, [playername],”</i> she says, waving you over. With how strong the stuff she’s imbibing must be, it’s a wonder she’s still coherent. <i>“Come over and have a chat. You’re not getting any of my ‘shine, though. It’s all mine. I earned it.”</i>", parse);
				Text.NL();
				Text.Add("You won’t question her on that. Stuff going out in the forest?", parse);
				Text.NL();
				Text.Add("Maria nods. <i>“I… I’m getting bad vibes these days. That shouldn’t be the case - supposed to know much of it like the back of my hand. But I’m noticing things wrong… too silent, too dark… that kinda thing… and while I’m not going to say I’m too chicken to head back out every night, maybe a nip of liquid courage can’t hurt, right?”</i>", parse);
				Text.NL();
				Text.Add("That’s more than a nip she’s having there.", parse);
				Text.NL();
				parse["mommydaddy"] = player.mfFem("daddy", "mommy");
				Text.Add("Maria snorts. <i>“Hey, I didn’t ask you to come and sit down with me so you could play [mommydaddy], all right? You had something on your mind before you started nagging?”</i>", parse);
			}, 1.0, function() { return true; });
		}
		scenes.Get();
		
		if(GetDEBUG()) {
			Text.NL();
			Text.Add("DEBUG: relation: " + maria.relation.Get(), null, 'bold');
			Text.NL();
		}
		Text.Flush();

		MariaScenes.CampPrompt();
	}
}

MariaScenes.CampPrompt = function() {
	var parse = {

	};

	//[name]
	var options = new Array();
	options.push({nameStr : "Talk",
		tooltip : Text.Parse("You have some things you want to talk with her about.", parse),
		enabled : true,
		func : function() {
			Text.Clear();
			
			var scenes = new EncounterTable();
			
			scenes.AddEnc(function() {
				Text.Add("<i>“Guess a little lip-flapping couldn’t hurt. At the very least, it’ll help take my mind off things that’ve been happening of late. I know that Zenith has a lid on it, but still, can’t help but want to help…”</i> Maria shakes her head, and then her gaze snaps back to you. <i>“Sorry about that. Yeah, you had something to say?”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“You want to talk?”</i> Maria squints at you. <i>“I guess… although I’ve never been a very good gossip. Having Zenith around all the time when I was growing up did that to me, I guess.”</i>", parse);
				Text.NL();
				Text.Add("Gossip? Oh no, perish the thought. You just wanted a bit of pleasant conversation, that’s all.", parse);
				Text.NL();
				Text.Add("Maria shrugs. <i>“Sure, if you wanna put it that way. What’s on your mind?”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Maria perks up at the suggestion. <i>“Sure, why not? It’s always great to stop and have a chat with you. Time flies while you’re having fun, as they say, and I’ve got a bit of it left over. You got something in mind?”</i>", parse);
			}, 1.0, function() { return maria.Relation() >= 50; });
			
			scenes.Get();
			
			Text.Flush();
			
			MariaScenes.TalkPrompt();
		}
	});
	if(cveta.flags["Met"] == Cveta.Met.MariaTalk) {
		options.push({ nameStr : "Princess",
			func : function() {
				Scenes.Cveta.MariaTalkRepeat();
			}, enabled : cveta.WakingTime(),
			tooltip : "You've changed your mind. If Maria really can't sort out this so-called princess, maybe you can."
		});
	}

	if(maria.flags["DD"] & Maria.DeadDrops.Talked)
	{
		options.push({ nameStr : "Dead-Drop",
			tooltip : "So, does she want to go on a little pick-up errand?",
			func : function() {
				if(maria.flags["DD"] & Maria.DeadDrops.Completed)
					MariaScenes.DeadDrops.Repeat();
				else
					MariaScenes.DeadDrops.First.Chat();
			}, enabled : maria.DDtimer.Expired()
		});
	}
	
	options.push({nameStr : "Ranger",
		tooltip : Text.Parse("Perhaps she could teach you something about forestry?", parse),
		enabled : true,
		func : function() {
			MariaScenes.RangerTraining();
		}
	});

	Gui.SetButtonsFromList(options, true);
}

MariaScenes.RangerTraining = function() {
	var parse = {
		
	};
	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
	
	var unlocked = Jobs.Ranger.Unlocked();
	var student = null;
	for(var i = 0; i < party.Num(); i++) {
		var c = party.Get(i);
		if(c.jobs["Fighter"].level >= 3) {
			student = c;
			break;
		}
	}
	
	Text.Clear();
	if(unlocked) {
		Text.Add("Maria frowns before looking you ", parse);
		if(party.Num() > 1) {
			Text.Add("and [comp] ", parse);
		}
		Text.Add("up and down. <i>“It’s true that you still have much to learn before you’re on my level, but there’s not much more I can impart to you by teaching. I can go through the basics with you again if you really wanted to, but I’ve got the lingering suspicion that it would be a waste of our time. There’s really only one way to improve from here on out, and that’s through experience, actually being out there and putting your knowledge to practice - knowing this, do you still want a rundown of the basics?”</i>", parse);
		Text.Flush();
		
		var options = [];
		//[Yes][No]
		options.push({nameStr : "Yes",
			tooltip : Text.Parse("Even experts must go over the fundamentals sometime.", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("You let Maria know that you’d like to have a little refresher course anyways. There’s no sense in getting overconfident - that’s how it gets you in the end, isn’t it? Overconfidence and thinking that you’re above the little basic things. Wasn’t there a saying about this? For want of a nail, or something?", parse);
				Text.NL();
				Text.Add("Maria raises an eyebrow at this, but thinks for a moment and shrugs. <i>“Guess I could use a bit of a break from the grind for the next hour or two. Let’s see what we can do about you, then…”</i>", parse);
				Text.NL();
				Text.Add("She leads you ", parse);
				if(party.Num() > 1) {
					Text.Add("and [comp] ", parse);
				}
				Text.Add("to a quiet spot near the palisade, and begins a quick refresher on wilderness survival, trap construction out of tools at hand, and keeping one’s equipment in good working order with easily harvestable resources from the forest.", parse);
				Text.NL();
				Text.Add("<i>“A lot of this knowledge is very specific to the land at hand,”</i> she admits. <i>“Stick me in the desert, and while I wouldn’t be completely helpless, I’d also be lost on a lot of things. On the other hand, the desert caravaners wouldn’t have an easy time walking amongst the trees, either.”</i>", parse);
				Text.NL();
				Text.Add("End of the day, though, a bow is a bow, right?", parse);
				Text.NL();
				Text.Add("<i>“True, but I’d imagine that a bowstring wouldn’t last as long near the coast or in the desert as it does here. As I said, it’s the lay of the land. Now… I think we’re just about done here; I’m running a bit short on time. Shall we wrap this up?”</i>", parse);
				Text.NL();
				Text.Add("All right, then. Maria quickly cleans up the area, then gives you a wave and small smile before vanishing into the camp, leaving you to ponder your next move.", parse);
				Text.Flush();
				
				maria.relation.IncreaseStat(100, 3);
				world.TimeStep({hour: 2});
				
				if(maria.flags["Ranger"] < Maria.Ranger.Taught)
					maria.flags["Ranger"] = Maria.Ranger.Taught;

				Gui.NextPrompt();
			}
		});
		options.push({nameStr : "No",
			tooltip : Text.Parse("Let’s not waste anyone’s time here.", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("You tell Maria that you’ll be fine, in that case. No point in going over ground well-trodden.", parse);
				Text.NL();
				Text.Add("She nods. <i>“Well then. Anything else you want to bring up?”</i>", parse);
				Text.Flush();
				
				MariaScenes.CampPrompt();
			}
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else if(student) {
		parse["student"] = student.nameDesc();
		parse["Student"] = student.NameDesc();
		parse = student.ParserPronouns(parse);
		parse = Text.ParserPlural(parse, student.plural());
		
		Text.Add("Maria looks [student] up and down, then a small smile plays on her lips. <i>“I think I can work with this. You’re not exactly star pupil material, but I won’t be wasting my time. Come along, then - I’ll see how much I can teach in the few hours I’ve got to spare.”</i>", parse);
		Text.NL();
		Text.Add("She takes [student] aside to a quiet spot by the palisade, then starts the lesson by emptying out her pockets and pouches, carefully explaining the use of each implement and its use. This is followed by some general advice in wilderness survival, especially out in the forest that surrounds the outlaws’ camp, after which [student] [isAre] quizzed on what [heshe] [hasHave] learned. Maria isn’t satisfied the first few times, but eventually [student] get[notS] it - or at least, well enough to placate her.", parse);
		Text.NL();
		Text.Add("This is followed up by a hands-on session of some simple campcraft - constructing shelters and other simple structures out of materials easily at hand in the forest. Traps, too - small ones for animals for the pot, and for people if need be.", parse);
		Text.NL();
		Text.Add("Finally, she finishes up with a quick lesson on tracking animals and people alike, and moving silently in the underbrush, painstakingly showing [student] how to push aside thorns and vines with without making noise. She goes through the motions herself, then shepherds [student] through them until she makes a whistling noise through her teeth.", parse);
		Text.NL();
		Text.Add("<i>“I’m still not completely satisfied, but it’ll do for you, I guess. My time’s running out, and I’ve got to see to the evening roll calls, make sure the lads are ready for patrol. Keep on practicing - you’ve got the fundamentals, but they all need a coat of polish and a lot more shine. Okay?”</i>", parse);
		Text.NL();
		Text.Add("[Student] assure[notS] Maria that [heshe]’ll keep at it, and she gives [himher] a nod before stepping away in the direction of the gates.", parse);
		Text.NL();
		Text.Add("<b>Ranger job unlocked!</b>", parse);
		Text.Flush();
		
		world.TimeStep({hour: 5});
		
		maria.relation.IncreaseStat(100, 7);
		
		if(maria.flags["Ranger"] < Maria.Ranger.Taught)
			maria.flags["Ranger"] = Maria.Ranger.Taught;
		
		Gui.NextPrompt();
	}
	else { //requirements not met
		Text.Add("Maria looks contemplative as she turns her gaze to you", parse);
		if(party.Num() > 1) {
			Text.Add(", then to [comp]", parse);
		}
		Text.Add(". She’s clearly thinking hard, then at last clears her throat and shakes her head.", parse);
		Text.NL();
		Text.Add("<i>“Sorry, can’t be done. I could try to explain it to you, but I get the feeling that it’d just be lost on you and we’d both be wasting our time.”</i>", parse);
		Text.NL();
		Text.Add("Harsh.", parse);
		Text.NL();
		Text.Add("<i>“I don’t have the time to coddle anyone with sweet words here; sometimes, it’s the only way to get things across without people cleverly reinterpreting what you have to say to hear what they want. I guess you can be taught, sure, but you need to go out there and get some experience of this world before coming back to me, okay? It’s not that I don’t want to, it’s that I can’t.”</i>", parse);
		Text.NL();
		Text.Add("Very well. You’ll be back.", parse);
		Text.NL();
		Text.Add("Maria folds her arms under her breasts. <i>“I expect you to be. Now, is there anything else I can help you with?”</i>", parse);
		Text.NL();
		Text.Add("<b>(You need Fighter level 3 on at least one of your current party members to be able to unlock the Ranger job)</b>", parse);
		Text.Flush();
		
		world.TimeStep({minute: 15});
		
		MariaScenes.CampPrompt();
	}
}

MariaScenes.TalkPrompt = function() {
	var parse = {
		playername : player.name
	};
	
	var options = [];
	//[Chat][Forest][Outlaws][Zenith][Family][Ranger]
	options.push({nameStr : "Chat",
		tooltip : Text.Parse("Just chat for a bit.", parse),
		enabled : true,
		func : function() {
			Text.Clear();
			Text.Add("You break out into a bit of small talk, chatting about this and that without any real direction to the conversation.", parse);
			Text.NL();
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Eventually, though, the topic turns to the time the two of you first met.", parse);
				Text.NL();
				Text.Add("<i>“To be honest,”</i> Maria begins, <i>“it’s a good thing that I was the one to catch you napping like that. Some of the other locals wouldn’t have bothered with the trouble. That mothgirl, for example - she’d just have robbed you blind while you were sleeping and left it at that.”</i>", parse);
				Text.NL();
				Text.Add("Well, she <i>does</i> make sense in a roundabout sort of way, but couldn’t she have just tapped you on the shoulder or coughed or something? An arrowhead mere inches away from the eye isn’t the sort of thing that puts people in an amicable mood; waking up is hard enough to deal with as it is.", parse);
				Text.NL();
				Text.Add("<i>“About that…”</i> Maria looks a little pensive. The ebony beauty surely isn’t about to up and say that she was in the wrong, but neither is she probably going to flat-out claim to be squeaky clean, either. <i>“Better safe than sorry. Didn’t know how you’d react.”</i>", parse);
				Text.NL();
				if(maria.flags["Met"] & Maria.Met.Fight) {
					Text.Add("Hmph. Judging by the way you reacted, you’d have been in more of a mood to simply talk if she hadn’t outright threatened you to begin with.", parse);
					Text.NL();
					Text.Add("<i>“It’s harsh, but it’s also the truth that I haven’t lived this long as an outlaw by assuming the best of strangers,”</i> Maria replies matter-of-factly. <i>“It is what it is; we’ve all had to live with it. For what it’s worth, I’ll say I’m sorry.”</i>", parse);
					Text.NL();
					Text.Add("You reacted badly too, you admit. It’s just one of those things which really could’ve been cleared up with a civil talk. She <i>did</i> have all her men in the trees as backup - that should’ve been enough to at least warrant some civility, yet have a fallback should things go sour.", parse);
				}
				else {
					Text.Add("Either way, it’s a good thing that you’d better control over your instincts and impulses, or there might’ve been a scuffle.", parse);
					Text.NL();
					Text.Add("<i>“Oh?”</i> Maria raises an eyebrow at you. <i>“And here I was thinking that you were quaking in your boots and going along so you didn’t get turned into a pincushion.”</i>", parse);
					Text.NL();
					Text.Add("Hey! You’re about to protest this clear disparagement of your character, but Maria laughs and waves off your complaints before you can even voice them. <i>“I was just needling you, no need to get mad. Seriously, though… thanks for taking a blow to your pride and making things easier on the both of us.”</i>", parse);
					Text.NL();
					Text.Add("Huh, guess that’s one way to deliver a compliment.", parse);
				}
				Text.NL();
				Text.Add("<i>“That’s all behind us now, anyway.”</i> Maria sighs, and shrugs. <i>“Water under the bridge. Come on, let’s not dwell on this stuff and talk about something cheerier.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Come to think of it, is there anything she likes to eat in particular?", parse);
				Text.NL();
				Text.Add("Maria huffs. <i>“What sort of question is that?”</i>", parse);
				Text.NL();
				Text.Add("Apparently, the kind of question you’d ask. Come on. Surely, she has one.", parse);
				Text.NL();
				Text.Add("<i>“You can’t afford to be picky about what you eat out here. No space for favorites - anything that Raine can serve up on your plate, you put in your stomach or go hungry.”</i>", parse);
				Text.NL();
				Text.Add("Aw, come on. Now you’re sure she’s evading the question - having favorites in no way necessarily means being a picky eater. Surely, she’s got -", parse);
				Text.NL();
				if(maria.Relation() >= 50) {
					Text.Add("<i>“I’ve always been a bit partial to wild honey, I suppose. The way you get subtle changes in flavor depending on where it comes from, the fact that you have to be smart enough to get it safely, and of course, the fact that it goes well with many things.”</i>", parse);
					Text.NL();
					Text.Add("See? That’s a perfectly normal and nice thing to like. When you can’t get chocolate, something else that’s sweet will suffice.", parse);
					Text.NL();
					Text.Add("Maria huffs. <i>“I like it best on its own, though. That way, you don’t get the taste of whatever it’s paired with creeping up on the palate.”</i>", parse);
				}
				else {
					Text.Add("<i>“I’m not letting you badger me into giving anything away, and that’s that.”</i>", parse);
					Text.NL();
					Text.Add("Aww… why so touchy about it, though?", parse);
					Text.NL();
					Text.Add("Maria reaches out with a finger and jabs you squarely on the chest. <i>“For me to know and for you to find out, buster. Maybe you should try getting in good with me, if you’d really like to know.”</i> ", parse);
				}
			}, 1.0, function() { return true; });
			scenes.Get();
			Text.Flush();
			
			world.TimeStep({minute: 15});
			maria.relation.IncreaseStat(100, 1);
			MariaScenes.TalkPrompt();
		}
	});
	options.push({nameStr : "Forest",
		tooltip : Text.Parse("How’ve things been out there in the woods?", parse),
		enabled : true,
		func : function() {
			Text.Clear();
			// TODO #If Vaughn task 4 completed
			if(false) {
				Text.Add("Maria looks down at her hands, then back up at you. <i>“A little more peaceful. Just a little more, but I’m grateful for it - and to you for helping out as well.”</i>", parse);
				Text.NL();
				Text.Add("Hey, it’s a job, and you did it. Nothing more, nothing less. Besides, she had her people backing you up against the bane, didn’t she?", parse);
				Text.NL();
				Text.Add("<i>“That’s true, but I’d still rather you accept the credit where it’s due. It’s not very often that I actually compliment anyone - folk around camp will tell you as much.”</i>", parse);
				Text.NL();
				Text.Add("So, you should feel all nice and special that she’s deigned to confer her approval on you? Does this call for a celebration?", parse);
				Text.NL();
				Text.Add("<i>“Don’t push your luck, buster.”</i> She punches you lightly on the shoulder. <i>“But yeah. You and I know that the bane wasn’t the end of our troubles, and I get the feeling that whatever it is that’s out there, it’s going to be way out of my league. Yours, though… that’s something else altogether. If there’s anything I can do to help - within reason, of course - just ask away, and I’ll see what I can do. I owe you as much; we all do.”</i>", parse);
			}
			else {
				Text.Add("<i>“Have you spoken with Vaughn and asked him what he thinks? If you haven’t, you should. I’m in agreement with him that something’s off about the forest.”</i>", parse);
				Text.NL();
				Text.Add("Off? What does she mean by that?", parse);
				Text.NL();
				Text.Add("Maria shakes her head. <i>“Just a general feeling of something being amiss. I can’t quite explain it, [playername]. The woods have always been treacherous to the unwary - especially the portion of that which lies in the shade of the Great Tree - but, well, to put it one way, I know in my gut that something’s wrong.”</i>", parse);
				Text.NL();
				Text.Add("You motion for her to go on.", parse);
				Text.NL();
				Text.Add("<i>“I’ve been walking these woods since I was a child, and in the last couple of years they’ve changed. Not outwardly, but more inwardly - the shadows seem longer, the trees huddle together as if for protection. It wasn’t obvious at first, but the changes have been coming faster and faster, more noticeable - I don’t doubt that it’s only a matter of time before whatever’s growing in the heart of the woods breaks out to encompass us as well.”</i>", parse);
				Text.NL();
				Text.Add("She does sound quite grim about this.", parse);
				Text.NL();
				Text.Add("<i>“Trust me, I’m grim because I’m being dead serious. And yet, neither Vaughn nor I have anything concrete to show Zenith on this - it’s fucking annoying, pardon my language. I can’t put everyone on alert just because I have a hunch I can’t prove.”</i>", parse);
				Text.NL();
				Text.Add("All right, you get the point. How about changing the topic to something a little more cheery to take her mind off it?", parse);
				Text.NL();
				Text.Add("She shrugs. <i>“Suits me.”</i>", parse);
			}
			Text.Flush();
			
			world.TimeStep({minute: 15});
			maria.relation.IncreaseStat(100, 1);
			MariaScenes.TalkPrompt();
		}
	});
	options.push({nameStr : "Outlaws",
		tooltip : Text.Parse("How’s the situation in camp?", parse),
		enabled : true,
		func : function() {
			Text.Clear();
			
			var scenes = new EncounterTable();
			
			scenes.AddEnc(function() {
				Text.Add("<i>“So-so. We just got another handful of people filtering in from the plains. Poor bastards didn’t see how they were going to pay the land taxes next year.”</i>", parse);
				Text.NL();
				Text.Add("Why, were the rates that bad?", parse);
				Text.NL();
				Text.Add("<i>“Oh, no, no. Rewyn might be a bastard, but he’s not stupid. <b>Completely</b> stupid, at any rate. He knows where his food comes from, and likes eating too much to see that spigot dry up. No, the problem is with the roads.”</i>", parse);
				Text.NL();
				Text.Add("You don’t quite follow.", parse);
				Text.NL();
				Text.Add("Maria sighs and leans against a nearby tree, motioning for you to join her in its shade. <i>“It’s a long story, [playername]. Long ago, the ruling monarchs of Rigard allowed the common people to pay their taxes in a share of what was produced on the land. That was simple, it was direct, and most people felt it was fair, so that remained the case for generations on end. Then Rewyn comes along and decides that the existing arrangement isn’t good enough, that the only way taxes are to be paid is in coin.</i>", parse);
				Text.NL();
				Text.Add("<i>“Now, I can see why he would do such a thing - coin doesn’t spoil, it has a much more stable value, and it’s easy to count and store, amongst other issues. Understanding someone’s motives, though, doesn’t necessarily mean agreeing with them, because this pigheaded move meant that people needed to go into town to sell their crops in order to pay their taxes. And if you don’t keep the roads safe…”</i>", parse);
				Text.NL();
				Text.Add("Ah. ", parse);
				if(gwendy.flags["Market"] >= Gwendy.Market.GoneToMarket) {
					Text.Add("You think back to your little trip with Gwendy, and instantly understand Maria’s point.", parse);
				}
				else {
					Text.Add("You see where this is going, and tell Maria as much.", parse);
				}
				Text.NL();
				Text.Add("<i>“Of course, it wouldn’t be peachy keen even if Rewyn managed to keep the roads perfectly safe,”</i> Maria continues. <i>“There’s always how much the harvest can be sold for depending on the season, the extra expense involved in getting a huge load there and back, and the problem of money… at the end of the day, there’re a lot more people off their land now, and some of them make their way here.</i>", parse);
				Text.NL();
				Text.Add("<i>“Which, naturally, translates to more mouths to feed. If the forest soil weren’t so naturally poor, we’d try expanding one of the clearings and growing something ourselves, but I know that isn’t going to work out. Something’s got to give eventually, though. It always does.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Nothing very much.”</i>", parse);
				Text.NL();
				Text.Add("Nothing?", parse);
				Text.NL();
				Text.Add("Maria shrugs and tosses her hair. <i>“Why, do you think our lives are filled with weeks upon weeks of constant exploits and derring-do? I’m not surprised, because that’s how a lot of new faces think things are going to be. Some of them leave when they hear we’re not going to take up arms and ride upon Rigard the next day. As much as I’d like that to happen, doing so would be suicide.”</i>", parse);
				Text.NL();
				Text.Add("Well, you didn’t mean that, but it’s still slightly surprising to hear her admit so readily that there’s nothing going on at the moment.", parse);
				Text.NL();
				Text.Add("<i>“Zenith has been here for more than a decade, [playername]. He plays the long game because there is none other. Rigard was not built in a day, and it won’t be taken in a day, either.</i>", parse);
				Text.NL();
				Text.Add("<i>“So, for now, we bide our time and try and create opportunities to make inroads.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				parse["fem"] = player.Femininity() >= 0.5 ? " I’m sure you understand, don’t you?" : "";
				Text.Add("<i>“I’m going out to look for a bit of game in a few hours. Personal thing on my own time - a lady needs some me time.[fem]”</i>", parse);
				Text.NL();
				Text.Add("How’s the hunting been of late?", parse);
				Text.NL();
				Text.Add("<i>“Not as good as I’d have liked. We don’t waste a single eatable bit of anything we bring in, but it’s still not enough. To make things worse, the local animals have smartened up and are staying away from this area, so we’re having to go deeper and deeper into the forest if we want to bring back anything substantial for the pot. It’s getting such that we’re skirting the really dangerous areas now, and I’ve expressly forbidden anything from going too deep in. I don’t want anyone being a hero here, especially not over so much meat.”</i>", parse);
				Text.NL();
				Text.Add("That sounds bad.", parse);
				Text.NL();
				Text.Add("<i>“It is. Raine does what she can to stretch out our rations, but days of nothing but watery broth and gruel drain morale faster than water in the desert. There’s no easy solution - we’ve tried a few things, but people are understandably cautious of having dealings with us.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Looking pretty good. Next batch of moonshine’s coming up quite nicely. It’s one of the small luxuries we have here, booze that isn’t taxed by the Crown - and it tastes a lot better, if I dare say so.”</i>", parse);
				Text.NL();
				Text.Add("Out of curiosity, what’s it made out of?", parse);
				Text.NL();
				Text.Add("<i>“Berries. Well, <b>mostly</b> berries. Wild fruit, when it’s in season. Oh, and a bit of sugar, too.”</i>", parse);
				Text.NL();
				Text.Add("You get the impression that there’s a lot more in that “mostly”, but the gleam in Maria’s eye suggests that she’s not going to elaborate any further - not without a great deal of coaxing and cajoling, at any rate.", parse);
				Text.NL();
				Text.Add("Living out here in the woods with so many things close by, drink must be the only thing standing between the Outlaws and sanity, eh?", parse);
				Text.NL();
				Text.Add("A laugh. <i>“I’m not denying it. It’s easier to have something to help forget on the darker nights. ‘Nags and bumps and ghouls in the eaves, shadow and spit and demons about the leaves,’ as the old song goes. Those old children’s tales, they aren’t completely wrong, you know. ", parse);
				if(false) { //TODO #if Vaughn task 4 completed - same line
					Text.Add("Guess we were proved right.”</i>", parse);
					Text.NL();
					Text.Add("The bane wasn’t a creature of the woods proper, you remind Maria. It was an outsider, summoned into a place not of its element.", parse);
					Text.NL();
					Text.Add("<i>“Doesn’t matter. Was still there. I know several of the lads who came with us needed several stiff drinks after we returned just to regain their composure, and those were folks who were no strangers to spilled blood.”</i>", parse);
					Text.NL();
					Text.Add("You feel perfectly fine.", parse);
					Text.NL();
					Text.Add("<i>“Yeah, but you’re special, aren’t you?”</i> Maria says with a scowl. <i>“The one who came through a portal and all that. Spirits know what kind of horrible things you see out there on other planes - something like a bane is probably nothing compared to them.”</i>", parse);
					Text.NL();
					Text.Add("Gee, there’s no need to take it that personally.", parse);
					Text.NL();
					Text.Add("<i>“Pfff.”</i> Maria makes a show of closing her eyes and rubbing her temples. <i>“Right, maybe I was a bit forceful there, but you could at least put your words through that head of yours before letting them out to your mouth.”</i>", parse);
				}
				else {
					Text.Add("I’ve never come across anything truly terrible out there amongst the trees, but there are signs.”</i>", parse);
					Text.NL();
					Text.Add("You’ll take her word for it.", parse);
					Text.NL();
					Text.Add("<i>“I’m just glad that if anything in this camp is working, it’s the stills. Let’s just leave it at that, okay?”</i>", parse);
				}
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“We just had to turn away a small group of people the other day.”</i>", parse);
				Text.NL();
				Text.Add("Interesting. Was there any particular reason?", parse);
				Text.NL();
				Text.Add("<i>“Oh, no, nothing special,”</i> Maria replies. <i>“They just couldn’t really contribute anything that we didn’t have in spades already, and it’s getting rather crowded in here. No one likes to have to do the turning away, but I dropped them a small bag of stuff and sent them back into the forest.”</i>", parse);
				Text.NL();
				Text.Add("Huh. Yeah, you can see how it would be hard to shoo away people down on their luck.", parse);
				Text.NL();
				Text.Add("A sigh. <i>“Most who manage to find this camp usually prove themselves resourceful enough in the doing, but those five folks just decided to wander around in the woods until they stumbled across us. Younglings from Rigard’s slums who decided they wanted to be merry thieves hiding out in the woods, and wore themselves out just coming here. If not for sheer luck, they’d be corpses in the underbrush by now.”</i>", parse);
				Text.NL();
				Text.Add("Grim.", parse);
				Text.NL();
				Text.Add("<i>“Grim, but true. We can’t have dead wood lounging around in camp. If they know what’s good for them, they’ll go back where they came from and try and make something of themselves <b>before</b> showing up again.”</i> ", parse);
			}, 1.0, function() { return true; });
			
			scenes.Get();
			
			Text.NL();
			Text.Add("You see.", parse);
			Text.NL();
			Text.Add("<i>“And that’s about that. News about these parts isn’t often very good, I’m afraid. Is there anything else you wanted to bring up?”</i>", parse);
			Text.Flush();
			
			world.TimeStep({minute: 15});
			maria.relation.IncreaseStat(100, 1);
			MariaScenes.TalkPrompt();
		}
	});
	options.push({nameStr : "Zenith",
		tooltip : Text.Parse("So, what does she think about the Outlaws’ leader?", parse),
		enabled : true,
		func : function() {
			Text.Clear();
			Text.Add("Maria looks at you oddly. <i>“Hey, [playername]. You know how it’s not polite to gossip about someone behind his or her back? Especially when it comes to someone you respect?”</i>", parse);
			Text.NL();
			Text.Add("Hey, hey, you weren’t asking Maria to snitch on Zenith behind his back. All you wanted to know was what she thought of him. Although come to think of it, her reaction to the question does tell you a lot in that regard.", parse);
			Text.NL();
			Text.Add("<i>“Well then, you’ve got your answer, don’t you? I mean, it’s hard to speak ill of the man who’s practically been your brother for years now.”</i>", parse);
			Text.NL();
			Text.Add("Yeah…", parse);
			Text.NL();
			Text.Add("<i>“Like I said, I respect Zenith enough to not talk about him when he’s not here, so draw what conclusions you will. Let’s talk about something else, shall we?”</i>", parse);
			Text.Flush();
			
			world.TimeStep({minute: 15});
			maria.relation.IncreaseStat(100, 1);
			MariaScenes.TalkPrompt();
		}
	});
	if(outlaws.flags["Met"] >= Outlaws.Met.Bouqet) {
		options.push({nameStr : "Family",
			tooltip : Text.Parse("Does she miss them?", parse),
			enabled : true,
			func : function() {
				Text.Clear();
				Text.Add("Maria sighs. <i>“Can’t get teary-eyed over when I don’t remember, [playername]. So no, I don’t miss them.”</i>", parse);
				Text.NL();
				Text.Add("That’s a rather blunt way of putting it.", parse);
				Text.NL();
				Text.Add("<i>“But it’s true, isn’t it? At least to some degree? All those things I said back there amidst the flowers… sure, [playername], it’s not to say I don’t feel for them, but I don’t <b>miss</b> them. Besides, Zenith, Vaughn, Raine, Aquilius, the lads, they’re my family now. That’s all I’ve got to say on the issue. I’m sure you’ll forgive me if I don’t want to dwell on the issue, because everything I’ve wanted to say on the matter I brought up that day.”</i>", parse);
				Text.NL();
				Text.Add("All right, then. You won’t press any further on the issue.", parse);
				Text.NL();
				Text.Add("<i>“Thank you. Now, is there anything you’d like to bring up? To take our minds off this?”</i>", parse);
				Text.Flush();
				
				world.TimeStep({minute: 15});
				maria.relation.IncreaseStat(100, 1);
				MariaScenes.TalkPrompt();
			}
		});
	}
	
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“Anything else on your mind?”</i>", parse);
		Text.Flush();
		
		MariaScenes.CampPrompt();
	});
}

MariaScenes.ForestMeeting = function() {
	Text.Clear();

	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	if(!party.Alone()) {
		var member = party.Get(1);
		parse.p1name = member.name;
		parse.HeShe  = member.HeShe();
	}

	if(maria.flags["Met"] == 0) {
		maria.flags["Met"] |= Maria.Met.ForestMeeting;
		Text.Add("Off in the distance, the massive tree at the center of Eden overlooks the entire verdant area, casting long shadows and slightly eclipsing the sun. This far into the woodland, the trees grow close together, and even the smallest is far too tall for you to climb. All around, the sounds of the forest pound against your ears. Up in the high branches, birds twitter at each other. Wind whistles through the limbs, brushing them against one another in a comforting melody. Dozens of unseen insects send mating songs through the air.", parse);
		Text.NL();
		Text.Add("The pleasant buzz distracts you from the soreness settling in your limbs. After a few more minutes of traveling, you decide to take a break, and sit down at the base of a tree. The rough bark rubs against you through your [armor]. Before long, you fall into a doze.", parse);
		Text.NL();
		Text.Add("The sound of creaking wood wakes you from your slumber. Cracking open an eye, the sight of an arrow greets you. Your eyes snap open, and you focus on the glinting tip of the arrowhead. Sliding up the shaft, then lingering on the gray-striped feathers, you look up toward the woman holding the bow. Her hands and arms are absolutely still, even under the massive tension of holding a nocked arrow.", parse);
		Text.NL();
		Text.Add("The woman's ebony skin seems to glow slightly under the dappled light. The white shirt she wears contrasts beautifully with her dark skin, and the belts holding the billowing material close to her body accentuate the curve of her bust. Stealthily eyeing her breasts, you assume them to be E-cup, and the low cut of her shirt shows a generous handful of cleavage.", parse);
		Text.NL();
		Text.Add("A cough raises your attention to the mysterious archer's face. Full, dark lips curve into a smile underneath her straight, sharp nose. Two ice-blue eyes stare back at you. Their light color almost startling you at first. A lock of black hair falls into her eyes, and she tosses her head to move it out of the way.", parse);
		Text.NL();
		if(player.Weapon()) {
			Text.Add("<i>“Throw your weapons to the side.”</i> With an arrow less than an inch from your eye, it seems safer to comply than resist. Tossing your [weapon] to the side, you stand and hold your hands up in a gesture of surrender.", parse);
			Text.NL();
		}

		if(party.Two()) {
			Text.Add("Out of the corner of your eye, you see other bandits, much like the one holding you hostage, holding [p1name] at weapon-point. [HeShe] has been neatly disarmed. Whoever these people are, they are well trained, and well prepared for anyone that crosses their borders.", parse);
			Text.NL();
		}
		else if(!party.Alone()) {
			parse.disarm = player.Weapon() ? ", just as you have" : "";
			Text.Add("Out of the corner of your eye, you see other bandits, much like the one holding you hostage, holding your companions at weapon-point. They've each been neatly disarmed[disarm]. Whoever these people are, they are well trained, and well prepared for anyone that crosses through their borders.", parse);
			Text.NL();
		}
		Text.Add("For a while, she walks around you, checking over your body for anything you might have hidden. Her gaze seems to hover on your ass a bit longer than needed, and you give it a slight wriggle. Satisfied that you can no longer defend yourself, the stranger steps away and lowers her bow.", parse);
		if(player.Weapon())
			Text.Add(" Grabbing your weapon, she hefts it over one shoulder.", parse);
		Text.NL();
		Text.Add("Glaring at you suspiciously, she challenges you: <i>“What are you doing here?”</i> Her voice reminds you of honey and cream, soft and luxurious.", parse);
		Text.NL();
		Text.Add("After you explain that you are simply exploring the forest, she glances at you sideways. For a while, she simply watches you, clearly debating what course of action to take. She turns the options over in her head for a few minutes before she seems to reach a decision. <i>“My name is Maria. Follow me, and I'll let Zenith decide what to do with you.”</i>", parse);
	}
	else {
		Text.Add("As you walk through the forest, the soothing sounds of bird calls dull your senses. A few clouds drift over a lazy, warm sun. After a while, a vague sense of deja vu overtakes you, and something sets off little alarms in your mind. Continuing through the thickly forested area, a sense of foreboding follows you.", parse);
		Text.NL();
		if(player.Weapon())
			Text.Add("Your hand is already hovering near the grip of your [weapon] when a sudden sharp crack grabs your attention.", parse);
		else
			Text.Add("Feeling on edge, you prepare for whatever may emerge from the forested growth. Muscles twitching and tense, the sudden cracking noise behind you nearly makes you jump.", parse);
		Text.NL();
		Text.Add("Turning around, you see the archer woman Maria, her chocolate skin stark against her white clothing. Her bow is only half-raised, but the arrow nocked in it draws your attention. She might have tried to shoot you if you hadn't turned around.", parse);
		Text.NL();
		Text.Add("<i>“You again?”</i> she asks. <i>“Do you make a habit of getting lost this deep in the forest, or did you just want to see me again?”</i> Chuckling at her own joke, Maria raises her bow. <i>“Once may be an accident, but more than once can't be. You're coming with me.”</i>", parse);
	}
	Text.Flush();
	MariaScenes.ForestConfront();
}

MariaScenes.ForestConfront = function() {
	var parse = {
		
	};
	var p1 = party.Get(1);
	parse = player.ParserTags(parse);

	//[Follow][Fight][Trick]
	var options = new Array();
	options.push({ nameStr : "Follow",
		func : MariaScenes.ForestFollow, enabled : true,
		tooltip : "Follow her."
	});
	options.push({ nameStr : "Fight",
		func : function() {
			Text.Clear();
			if(party.Alone())
				Text.Add("You've had just about enough of this presumptuous highwaywoman. Lunging forward, you tackle the archer to the ground before she has the chance to respond.", parse);
			else {
				parse.companion = party.Two() ? "companion is" : "companions are";
				parse.their     = party.Two() ? p1.hisher() : "their";
				Text.Add("You watch as your [companion] led away ahead of you, [their] captors apparently deciding on their course of action faster than Maria. You decide you've had just about enough of the presumptuous highwaywoman, and as soon as her allies are out of sight, take your chance.", parse);
				Text.NL();
				Text.Add("You lunge forward, tackling the archer to the ground before she has the chance to respond.", parse);
			}
			Text.NL();
			parse["lg"] = player.HasLegs() ? " to the shins" : ""
			if(player.Weapon())
				Text.Add("Wrenching your [weapon] from her hands, you jump back and prepare to fight!", parse);
			else
				Text.Add("With surprising strength, the archer shoves you to the side. You jump back, narrowly avoiding a swift kick[lg], and prepare to fight!", parse);
			Text.Flush();

			var enemy = new Party();
			enemy.AddMember(maria);
			var enc = new Encounter(enemy);

			maria.RestFull();

			enc.oldParty = party.members;
			party.members = [player];

			maria.pots = 2;

			enc.canRun = false;
			enc.onLoss = function() {
				SetGameState(GameState.Event, Gui);
				party.members = enc.oldParty;
				
				maria.flags["Met"] |= Maria.Met.FightLost;
				
				Text.Clear();
				Text.Add("You fall to the ground, utterly defeated. The archer kicks away your [weapon] and levels an arrow at you. Glaring at you, she orders you to stand. As you wobble to get up, she comes up behind you, binding your hands fast with some rope. Cold shivers run up your spine as you feel the sharp point of a knife dig into the soft flesh between your shoulder blades.", parse);
				Text.NL();
				if(maria.LustLevel() > 0.5) {
					Text.Add("Throwing you to the ground, Maria roughly pins you to the leaf-strewn forest floor. Holding you there with a foot, she strips off her laughably tiny shorts and kneels down over you. Pressing her steaming cunt into your mouth, she orders you, <i>“Lick.”</i>", parse);
					Text.NL();
					Text.Add("Without giving you a chance to answer, she presses her juicy snatch harder against your lips. As you begin lapping at her mound, she mewls quietly, clamping her thighs down around your ears and blocking out any more sound. Penetrating her warm walls with your tongue, you drill around, thrashing against the sides of her love-tunnel.", parse);
					Text.NL();
					Text.Add("Getting a wicked idea, you bump her clit with your nose, pressing and rolling it between your nose and the inflamed, red petals of her sex. After another moment, you locate her g-spot and mercilessly drive your tongue against it. You feel Maria shaking above you, and her juices fill your mouth.", parse);
					Text.NL();

					Sex.Cunnilingus(player, maria);
					player.Fuck(null, 2);
					maria.Fuck(null, 2);

					Text.Add("Standing back up, she shakily replaces her shorts. Giving you a lecherous smile, she hauls you from the ground and pushes you forward. Bound as you are, you have no choice but to follow.", parse);
				}
				else if(maria.LustLevel() > 0.25) {
					Text.Add("As she twists the ropes one more time, tugging them to make sure they're secure and won't come loose, you notice her hands straying to other parts of your form. Turning to face her, you notice her face is flushed. Whatever you did must have had quite the effect on her. Not enough of one to save you, though.", parse);
				}
				else {
					Text.Add("<i>“Move it!”</i>", parse);
				}

				Text.Flush();
				Gui.NextPrompt(MariaScenes.ForestFollow);
			};
			enc.onVictory = function() {
				SetGameState(GameState.Event, Gui);
				party.members = enc.oldParty;
				MariaScenes.ForestConfrontWin();
			}

			Gui.NextPrompt(function() {
				enc.Start();
			});
		}, enabled : true,
		tooltip : "Try to fight your captor."
	});
	options.push({ nameStr : "Trick",
		func : function() {
			Text.Clear();
			Text.Add("Though you can't fight back, you don't want to find out where this bandit wants to take you. Tossing about a few ideas, you finally decide that the best course of action is to follow her for now. As soon as you have the chance, you will slip away. For a while, she seems dead set on watching you, but eventually Maria's attention fades. Taking advantage of her lapse in vigilance, you easily dart the other way and escape.", parse);
			Text.NL();
			if(!party.Alone()) {
				parse.companions = party.Two() ? p1.name + " rejoins" : "your companions rejoin";
				parse.they       = party.Two() ? p1.heshe() : "they";
				Text.Add("At the edge of the forest, [companions] you. Through skill or daring, [they] escaped the archer and made it back to you. In high spirits and having successfully outwitted a cunning opponent, you leave the forest.", parse);
			}
			Text.Flush();
			// END ENCOUNTER
			world.TimeStep({hour:1});
			Gui.NextPrompt(PrintDefaultOptions);
		}, enabled : true,
		tooltip : "Try to trick Maria."
	});
	Gui.SetButtonsFromList(options);
}

MariaScenes.ForestConfrontWin = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	Text.Clear();
	maria.flags["Met"] |= Maria.Met.Fight;
	
	Text.Add("Maria collapses, unable to fight any further.", parse);
	if(maria.LustLevel() > 0.75)
		Text.Add(" The archer's hands reach down and pull off her ass hugging shorts. Two fingers dive into her honeypot and begin pumping fiercely.", parse);
	Text.Add(" Murder shines in her eyes, but she is unable to fight back against you.", parse);
	Text.NL();

	if(player.LustLevel() > 0.3) {
		Text.Add("The burning desire in your crotch only gets hotter as you stare down at Maria. You could use her to state your lust. Do you?", parse);
		Text.Flush();

		//[Yes][No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				maria.flags["Met"] |= Maria.Met.FightSexed;
				
				Text.Clear();
				parse["k"] = player.HasLegs() ? " Kneeling over her, you press a knee into her stomach" : Text.Parse(" Using your [foot], you press the weight of it on her stomach", parse);
				Text.Add("Already beaten, the archer can't rise from the ground. Quickly, you shuffle out of your [armor].[k] to keep her from moving. Reaching down, you shove two of your fingers into her mouth. Wriggling them around, you order Maria to slather them in spit. Her tongue deftly wraps around each digit and strokes up and down, jacking them off like miniature cocks.", parse);
				Text.NL();

				if(player.FirstCock()) {
					Text.Add("You think about how nice your dick would look between her lips instead. The thought makes your [cock] twitch and harden. Removing your fingers, you shove the head into her maw. Bracing yourself on the leafy ground, you thrust inside, her lips parting readily to admit you. Her tongue wrestles with the member in her mouth, running the rougher side across the bottom of your shaft.", parse);
					Text.NL();
					Text.Add("A few thrusts in, you pull out and admire the sheen of her saliva slathered on your [cock]. Turning around, you force your cock back into Maria's waiting maw. Pushing her supple legs apart with one hand, you use your spit-moistened fingers to probe her depths. At the first contact, she shudders and gasps around your [cock] in her mouth.", parse);
					Text.NL();
					Text.Add("Dipping your fingers further into her tight cunny, you probe around for all her most sensitive spots. Stroking along her soft, inner walls, you end up nearly so focused that you forget the squishy sensation focused around your throbbing [cock]. When she suddenly moans around you, the vibrations snap you back to the present.", parse);
					Text.NL();
					Text.Add("Pulling your digits from the archer's wanton hole, you notice her lift her legs, begging for more of the delicious friction. Tutting softly, you circle a finger around her clit. It pokes from its hood, red and engorged. She begins bucking underneath you, but you pull away before she can cum. Pulling your [cock] from her mouth, you turn around.", parse);
					Text.NL();					
					
					Text.Add("As juiced up as she is, you have no problem pounding straight into her core. Thrashing away at her slick pussy, you lose yourself in a haze of lust and feel yourself getting closer to the edge you had been skirting after her earlier oral assault. Her walls ripple around you convulsively as she cums under the assault. Moments later, you glaze her insides with your liquid lust.", parse);
					
					Sex.Vaginal(player, maria);
					maria.FuckVag(maria.FirstVag(), player.FirstCock(), 3);
					player.Fuck(player.FirstCock(), 3);

					var cum = player.OrgasmCum();

					if(player.FirstVag()) {
						Text.Add(" Your [vag] clenches in sympathy, and clear girl-cum runs down your [legs].", parse);
					}
					Text.NL();
					Text.Add("Hot semen fills her tunnel, and a tiny bit sprays back out, trailing down her inner thighs. Pulling out of the exhausted and beaten archer, you clean yourself up and put your [armor] back on.", parse);
					Text.NL();
				}
				else {
					Text.Add("Pushing her supple legs apart with one hand, you use your spit-moistened fingers to probe her depths. At the first contact, she shudders and gasps loudly. Moaning into the still forest air, she writhes under your gentle pressure.", parse);
					Text.NL();
					Text.Add("Dipping your fingers further into her tight cunny, you probe around for all her most sensitive spots. Stroking along her soft, inner walls, you curl your digits and press against the sides of her cunt. Scissoring your fingers open, you stretch her hole wide and lean down.", parse);
					Text.NL();
					Text.Add("Tutting softly, you circle a finger around her clit. It pokes from its hood, red and engorged. Curling your tongue around her pleasure buzzer, you flick your flexible organ across the little nub, reveling in her frenzied moans. Pulling your fingers from the archer's wanton hole, you notice her lift her legs, begging for more of the delicious friction. She begins bucking underneath you, but you pull away before she can cum.", parse);
					Text.NL();
					if(player.FirstVag()) {
						Text.Add("By now, your own cunt is sopping with need. Turning to face your conquest, you press your steaming honeypot into hers. Your lips slide together in just the right way, and you bump your clit against hers. The feeling shoots through you like lightning, and your mouth hangs open in an 'O' shape.", parse);
						Text.NL();
						Text.Add("Smiling, you use one hand to hold yourself steady ", parse);
						if(player.FirstBreastRow().size.Get() > 3)
							Text.Add("and the other to aggressively grope one of your [breasts].", parse);
						else
							Text.Add("while the other mauls one of Maria's perfect, chocolate orbs.", parse);
						Text.Add(" Bumping your clit against Maria's again, you slide down and slip your [clit] between her folds. Hot lust bubbles up in your body, and your cunny starts convulsing as you cum hard on the archer-woman's rosy folds.", parse);
						Text.NL();

						var cum = player.OrgasmCum();
						player.AddSexExp(3);
						maria.AddSexExp(3);
					}
					Text.Add("Standing up, you clean yourself up and put back on your [armor].", parse);
				}
				maria.relation.IncreaseStat(100, 5);

				Text.Flush();
				Gui.NextPrompt(function() {
					Text.Clear();
					MariaScenes.ForestAftermath();
				});
			}, enabled : true,
			tooltip : "Heck yeah! This bitch has it coming!"
		});
		options.push({ nameStr : "No",
			func : function() {
				Text.NL();
				Text.Add("You decide that now, in the middle of the forest, is perhaps not the best time for this.", parse);
				Text.NL();
				Gui.NextPrompt(MariaScenes.ForestAftermath);
			}, enabled : true,
			tooltip : "This isn't the time nor place."
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.NL();
		MariaScenes.ForestAftermath();
	}
}

MariaScenes.ForestAftermath = function() {
	var parse = {
		
	};
	parse = player.ParserTags(parse);
	
	Text.Add("Reaching for her chest, Maria pulls something small from her prodigious cleavage. As she brings it up to her mouth, you realize what it is. You lunge forward, but you're too slow to stop her from blowing into the whistle. The sharp sound cuts through the murmur of the forest. All the normal wildlife sounds cease, and you hear rustling in the undergrowth around you.", parse);
	Text.NL();
	Text.Add("As you're momentarily paralyzed with indecision, a spear flies through the air, nearly impaling you. As it smashes into the ground just to your left, the thrower emerges from the bushes. A huge, jackal-headed warrior steps into the clearing, and stares you down. Behind him, a group of animal-morphs and a few humans brandish their weapons threateningly. As strong as you are, you don't think you can beat them in a fight just now.", parse);
	Text.NL();
	parse["f"] = player.HasLegs() ? " ties your feet to your hands" : " binds you well and good"
	if(player.Weapon())
		Text.Add("Dropping your [weapon], you ", parse);
	else
		Text.Add("You ");
	Text.Add("step back and raise your hands non-threateningly. An orange cat-morph steps forward and ties your arms behind your back, then forces you down onto the ground and[f]. Shakily, the archer rises to her feet with the help of a red-armored, wolf-eared man. She takes the lead and heads... well, you don't know where she plans on taking you, but you're beginning to think it might not have been such a good idea to attack her.", parse);

	Text.Flush();
	Gui.NextPrompt(MariaScenes.ForestFollow);
}

MariaScenes.ForestFollow = function() {
	var parse = {};

	Text.Clear();
	Text.Add("You decide the best course of action is to follow Maria.", parse);
	Text.NL();
	Text.Add("Turning on her heel, Maria guides you through the massive oak trees, clambering over roots and around massive, tangled thickets with ease. She leads you through a labyrinthine assortment of vegetation, constantly switching back and forth between trails, seemingly at random. The ground under you begins turning softer, and the footing becomes harder to keep the longer you follow the bowwoman.", parse);
	Text.NL();
	Text.Add("As you watch her climb up and around the huge tree roots, you are treated to the lovely sight of her generous ass swaying back and forth. Her wide hips fill out the shorts she wears very tightly, emphasizing each curve of her body. Thinking it through, you realize that all her clothing is cut to accentuate her form, and draw your eyes to the more delectable parts of her body.", parse);
	Text.Flush();

	//[Silent][Talk][Flirt]
	var options = new Array();
	options.push({ nameStr : "Silent",
		func : function() {
			Text.Clear();
			Text.Add("Having nothing in particular to say to the archer, you simply follow her quietly. Instead of wasting your breath talking, you try to watch the path she follows in an attempt to memorize the way she's taking you. Even so, within twenty minutes you are hopelessly lost.", parse);

			MariaScenes.ForestCamp();
		}, enabled : true,
		tooltip : "Follow her silently."
	});
	options.push({ nameStr : "Talk",
		func : function() {
			Text.Clear();
			Text.Add("At first, you stay silent, wary of the archer's wrath, but eventually you decide that since you can do little else, you might as well ask her some questions. When you first speak, she jumps a little as if she didn't expect you to speak along the way. Most of your questions she either outright ignores, or answers vaguely at best until, that is, you ask her about precisely where she comes from.", parse);
			Text.NL();
			Text.Add("<i>“I'm part of the outlaws out here. We're forced to live in this forest because those xenophobic assholes up at the City don't want us around. Well, that and more than one of us have broken their laws. Either we choose to live by <b>their</b> rules, or we make do with our own codes out in the forest. Some of our band were actually evicted from the city for crimes, others simply for not being pure human.”</i>", parse);
			Text.NL();
			Text.Add("She does not say any more, and the rest of your questions are answered with silence. Though she hasn't killed you, it seems she doesn't trust you enough to tell you anything.", parse);

			maria.relation.IncreaseStat(100, 3);

			MariaScenes.ForestCamp();
		}, enabled : true,
		tooltip : "Ask her some questions as you walk."
	});
	options.push({ nameStr : "Flirt",
		func : function() {
			Text.Clear();
			Text.Add("Watching her move her body enticingly, you strike up a conversation with the buxom bandit. First, the topic stays on innocuous things. Before long, you begin talking about Maria, and you compliment her on her generous cleavage.", parse);
			Text.NL();

			if(maria.flags["Met"] & Maria.Met.FightSexed) {
				Text.Add("Scowling at you, the archer slaps you. Stinging pain explodes across your face, and you wince, blinking back tears at the unexpected force. Ordering you to stay silent, Maria refuses to even acknowledge your existence from that point forward. You do notice, however, that her cheeks became quite flushed at your comment. You resolve to try and win her affections later, when you've made up for your offense.", parse);
				maria.relation.IncreaseStat(100, 2);
			}
			else {
				Text.Add("Warming up slightly, Maria slows down a bit, exaggerating her motions. Each sway of her hips is accompanied by the jiggle of her breasts. Looking over at you, she smirks subtly. Though she put on this show to torment you, you notice a pink blush running up her cheeks. She likes that you're looking at her. Filing that information away for later, you take in the motion of her body, ogling her perky chest and curvaceous ass.", parse);
				maria.relation.IncreaseStat(100, 5);
			}

			MariaScenes.ForestCamp();
		}, enabled : true,
		tooltip : "You decide to flirt with the busty woman."
	});
	Gui.SetButtonsFromList(options);
}

MariaScenes.ForestCamp = function() {
	parse = {
		num        : Text.NumToText(party.Num() + 2),
		playername : player.name,
		HeShe      : player.mfTrue("He", "She"),
		himher     : player.mfTrue("him", "her"),
		hisher     : player.mfTrue("his", "her")
	};

	party.location = world.loc.Outlaws.Camp;

	Text.NL();
	Text.Add("She turns on you abruptly, her tits set to jiggling at the motion. She cautions you to wait here while she informs the guards of your arrival. Sitting down behind a rooty embankment, you lean against the dirt and consider your situation.", parse);
	Text.Flush();

	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("Waiting around, you wonder exactly how you got to this part of the forest. Thinking back on the trek, you realize that there is no way for you to find your way out of the forest without Maria's help.", parse);
		if(player.Weapon())
			Text.Add(" Without your weapon, you can't force her to help you either.", parse);
		Text.Add(" Unsettled by this sudden turn of events, you nonetheless eagerly await her return. It seems she's decided to bring you to the outlaw camp you heard about. Maybe they can get you inside of the city.", parse);
		Text.NL();
		Text.Add("Once Maria finally comes back, she's followed closely by a large fox-morph wielding a greatsword. It's slung across his shoulder, resting there easily. The muscles in his arms bulge as he adjusts the way it sits on him. His russet fur ruffles in the soft wind, and you can see his muscles rippling as he moves. His yellow eyes regard you suspiciously, and his hands shift across the hilt. Maria gestures for you to follow her again, and the three of you head up over the rooty embankment. Laying eyes on the 'camp', you gasp in surprise. When you had heard a few outlaws had taken up residence in the forest, you never imagined something like this.", parse);
		Text.NL();
		Text.Add("Trees larger than most others, even this deep in the forest, block out most of the sunlight. Shafts of light scatter down through the leaves, leaving everything in a constantly shifting twilight. In front of you, a trench at least five feet wide drops straight into the ground for a ways, and the bottom holds an uncountable number of sharpened stakes. Falling down there would certainly mean death for anyone. But more impressive than any of that is the wall.", parse);
		Text.NL();
		Text.Add("A massive wall surrounds the entire camp. It is made of whole tree trunks, wider than you are tall. Gnarled bark and huge knots cover the huge fortification. The tops of every beam are sharpened, much like those in the pit. A gap in the structure is covered by an iron grate, guarded on the outward side by a fox-morph very similar to the one glaring daggers at your back. From this far away, you can't tell what he's saying, but he shouts something to someone on the other side of the wall.", parse);
		Text.NL();
		Text.Add("Shortly after, the iron gate grinds upward, lifting just enough to let a person through. The guard by the gate and his new companion grab a large, wooden construct: a bridge. They place it over the spiked trench, and the [num] of you cross into the gateway. ", parse);
		Text.NL();
		Text.Add("The guards pick up the bridge and take it back through the gate. Inside, Maria hurries you through the camp. All around, all manner of morphs and non-morphs go about their business. The sheer number of different types astounds you. From lizard-morphs to wolf-morphs and everything between, it seems a representative of every race inhabits this bandit fort.", parse);
		Text.NL();
		Text.Add("Tents cover the ground everywhere you look. A small stream flows through the camp, and some small willow trees grow by its banks. You don't get a chance to look around further as the ebony beauty elbows you into one of the only two buildings in the camp.", parse);
		Text.NL();
		Text.Add("Inside, a large, round table dominates the room. Immediately, the map lying on it grabs your attention. Different figurines stand in seemingly random places. Paper is scattered across the map table and the floor, filled by an illegible scrawl. It almost looks like another language. A door to your left opens, and out walks a very peculiar looking badger-morph.", parse);
		Text.NL();
		Text.Add("It seems that at some point his body tried to figure out which parts of him should be badger and which should be human and simply gave up. His face is mostly human, save for his nose, but small, round, furry ears sit atop his head, nestled in a shock of dark black hair. The latter is divided by a single, silvery-white stripe, much like that of a badger. A day’s worth of stubble covers his square jaw, and you follow the scar that starts from his chin up to his eyes, pale grey irises that fix themselves upon you distrustfully.", parse);
		Text.NL();
		Text.Add("He wears what appears to be a weird mishmash of armor types: part of a leather hauberk here, cloth padding over there, a few straps and scraps of improvised plating sewn on and holding it all together. A long scar runs down the entirety of his right arm, bare of fur. Both the ring and pinky finger of that hand are missing, leaving the hand looking lopsided, especially with the sharp claws that protrude from his fingertips. A scabbard is affixed to his belt, bearing a sturdy short sword within.", parse);
		Text.NL();
		Text.Add("A deep, sonorous bass rumbles from his chest, bringing to mind storm clouds. <i>“Maria. I see you brought a stranger to our camp.”</i> His gaze pinions you to the floor and you unconsciously start thinking of excuses for why you entered his territory. Before you can speak, the archer begins explaining her actions.", parse);
		Text.Flush();

		//[Listen][Interrupt]
		var options = new Array();
		options.push({ nameStr : "Listen",
			func : function() {
				Text.Clear();
				Text.Add("<i>“[playername] is that one we heard about from Tez'rah. The one that came from a different plane. [HeShe] didn't look so tough, so I decided to try and take [himher] down.”</i>", parse);
				Text.NL();


				// 0 = no, 1 = won, 2 = won, sexed, 3 = lost
				// IF SEXED
				if(maria.flags["Met"] & Maria.Met.FightSexed) {
					Text.Add("<i>“Turns out I was wrong. [HeShe] hits pretty damn hard. After that ass-kicking, I couldn't just let [himher] go.”</i> Maria turns and glares pointedly at you. After a moment, a slight, dark flush works its way into her cheeks and she averts her eyes. <i>“What happens now is your business, Zenith.”</i>", parse);
				}
				// WON
				else if(maria.flags["Met"] & Maria.Met.Fight) {
					Text.Add("<i>“[HeShe] actually fought better than I expected.”</i> Maria gives Zenith a pointed stare and he nods back. <i>“I'm going to need to see Aquilius after a bout like that.”</i> She seems to genuinely admire your fighting prowess, and a part of you feels proud that you managed to gain a complete stranger's respect through combat. She even ambushed you, and you still managed to fight her off.", parse);
				}
				// LOST
				else if(maria.flags["Met"] & Maria.Met.FightLost) {
					Text.Add("<i>“And I was right. [HeShe] went down like a sack of potatoes. I admire [hisher] spirit, though. That's part of why I brought [himher] back to camp.”</i>", parse);
				}
				else {
					Text.Add("<i>“[HeShe] was already close enough to camp that one of the patrols would have found [himher] soon enough if I hadn't caught [himher] first.”</i>", parse);
				}
				Text.NL();
				Text.Add("Zenith, for his part, says nothing for a while. A hand kneads the pommel of his sword in thought. When he finally speaks, the words surprise you a bit. <i>“You can return when you like. For now, you should leave. Too much adventure in one day can be bad for you.”</i> To punctuate the point, he holds up his ravaged hand.  The edge of his mouth briefly twitches into a smile before he shoos you out the door.", parse);
				Text.Flush();

				Gui.NextPrompt(MariaScenes.ForestEnd);
			}, enabled : true,
			tooltip : "Let Maria do the explaining."
		});
		options.push({ nameStr : "Interrupt",
			func : function() {
				Text.Clear();
				Text.Add("You interrupt the busty archer with a question. Facing down Zenith, you demand he explain why he has agents capturing people in the forest. For a moment, he looks at you in surprise. It quickly passes, however, replaced by a far more intimidating look of annoyance.", parse);
				Text.NL();
				Text.Add("He turns to Maria, fixing her with his intense gaze. <i>“I don’t. This is an unusual case.”</i> Shrinking back, the archer looks at the floor. The badger-morph turns back to you. <i>“As for you in particular? Well... I will let you leave this time.”</i>", parse);
				Text.NL();

				if(maria.flags["Met"] & Maria.Met.Fight)
					Text.Add("<i>“You beat one of my best scouts. Not something every person can say, hm? You're not part of any law enforcement, are you?”</i> Shaking your head, you let Zenith continue. <i>“Come back later then. I'll have some things to discuss with you. For now, you should head back to wherever you call home.”</i>", parse);
				else if(maria.flags["Met"] & Maria.Met.FightLost)
					Text.Add("<i>“Seems there was a bit of a misunderstanding. We bear you no ill will, unless you decide to go against us.”</i> Shaking your head, you let Zenith continue. <i>“Come back later then. I'll have some things to discuss with you. For now, you should head back to wherever you call home.”</i>", parse);
				else
					Text.Add("<i>“Since you showed no violence towards myself or my people, you are free to return if you wish.”</i> As if that settles the entire matter, he shoos you from the room and shuts the door behind you and Maria.", parse);

				maria.relation.DecreaseStat(-100, 5);
				Text.Flush();

				Gui.NextPrompt(MariaScenes.ForestEnd);
			}, enabled : true,
			tooltip : "Demand an explanation for your capture."
		});
		Gui.SetButtonsFromList(options);
	});
}

MariaScenes.ForestEnd = function() {
	maria.RestFull();
	party.RestFull();

	Text.Clear();
	Text.Add("You prepare to leave, but remember that you lost your way when Maria showed you to the camp. Tapping her shoulder to get her attention, you mention the problem to her. She offers to take you back to where you met.");
	Text.NL();
	Text.Add("The journey back takes less time than the walk there had. Along the way, Maria points out small markings in the brush and on the trees, and explains how to use them to find the camp. Armed with the knowledge of the Outlaw's signs you are reasonably certain you can find your way back whenever you wish.");
	Text.Flush();

	party.location = world.loc.Forest.Outskirts;

	outlaws.flags["Met"] = Outlaws.Met.Met;

	world.TimeStep({hour: 3});
	Gui.NextPrompt();
}

export { Maria, MariaScenes };
