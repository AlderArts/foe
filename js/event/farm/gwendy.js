/*
 * 
 * Define Gwendy
 * 
 */
import { Link } from '../../event';
import { Entity } from '../../entity';
import { world } from '../../world';

let GwendyScenes = {};

// TODO: FIX STATS
function Gwendy(storage) {
	Entity.call(this);
	this.ID = "gwendy";
	// Character stats
	this.name = "Gwendy";
	
	this.avatar.combat     = Images.gwendy;
	
	this.maxHp.base        = 80;
	this.maxSp.base        = 50;
	this.maxLust.base      = 20;
	// Main stats
	this.strength.base     = 10;
	this.stamina.base      = 11;
	this.dexterity.base    = 14;
	this.intelligence.base = 18;
	this.spirit.base       = 20;
	this.libido.base       = 13;
	this.charisma.base     = 13;
	
	this.level = 1;
	this.sexlevel = 1;
	this.SetExpToLevel();
	
	// Note, since kia has no fixed gender, create body later
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 11;
	this.Butt().buttSize.base  = 8;
	this.body.height.base      = 173;
	this.body.weigth.base      = 65;
	this.body.head.hair.color  = Color.blonde;
	this.body.head.hair.length.base = 90;
	this.body.head.hair.style  = HairStyle.braid;
	this.body.head.eyes.color  = Color.blue;
	
	this.FirstVag().virgin = false;
	this.Butt().virgin = false;
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"]  = 0;
	this.flags["Market"] = 0;
	this.flags["Toys"] = 0; // seen/used toys
	
	this.flags["WorkMilked"] = 0;
	this.flags["WorkFeed"]   = 0;
	// Note: refers to how many times the player won/lost
	this.flags["WonChallenge"]  = 0;
	this.flags["LostChallenge"] = 0;
	// Refers to number of scenes unlocked
	this.flags["ChallengeWinScene"]  = 0;
	this.flags["ChallengeLostScene"] = 0;
	
	if(storage) this.FromStorage(storage);
}
Gwendy.prototype = new Entity();
Gwendy.prototype.constructor = Gwendy;

Gwendy.Market = {
	NotAsked : 0,
	Asked    : 1,
	GoneToMarket : 2
}

Gwendy.Toys = {
	Strapon  : 1,
	RStrapon : 2,
	Beads    : 3,
	DDildo   : 4
}

Gwendy.prototype.Sexed = function() {
	for(var flag in this.sex)
		if(this.sex[flag] != 0)
			return true;
	if(this.flags["ChallengeWinScene"]  != 0) return true;
	if(this.flags["ChallengeLostScene"] != 0) return true;
	return false;
}

Gwendy.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
}

Gwendy.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	this.SaveSexFlags(storage);
	
	return storage;
}

// Schedule
Gwendy.prototype.IsAtLocation = function(location) {
	// Numbers/slacking/sleep
	if     (location == world.loc.Farm.Loft)   return (world.time.hour >= 19 || world.time.hour < 5);
	// Morning routine
	else if(location == world.loc.Farm.Barn)   return (world.time.hour >= 5  && world.time.hour < 9);
	// Workday
	else if(location == world.loc.Farm.Fields) return (world.time.hour >= 9 && world.time.hour < 19); //TODO conditional?
	return false;
}

// Party interaction
Gwendy.prototype.Interact = function(switchSpot) {
	Text.Clear();
	var that = gwendy;
	
	that.PrintDescription();
	
	var options = new Array();
	options.push({ nameStr: "Release",
		func : function() {
			Text.Clear();
			Text.Add("[Placeholder] Gwendy masturbates fiercely, cumming buckets.");
			
			world.TimeStep({minute : 10});
			
			that.AddLustFraction(-1);
			Text.Flush();
			Gui.NextPrompt(function() {
				that.Interact(switchSpot);
			});
		}, enabled : true,
		tooltip : "Pleasure yourself."
	});
	//Equip, stats, job, switch
	that.InteractDefault(options, switchSpot, true, true, true, true);
	
	Gui.SetButtonsFromList(options, true, PartyInteraction);
}



GwendyScenes.LoftPrompt = function() {
	Text.Clear();
	
	var parse = {
		
	};
	
	Text.Add("PLACEHOLDER: Loft.", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	
	Text.Flush();
	//[Talk][Work]
	var options = new Array();
	options.push({ nameStr : "Talk",
		func : GwendyScenes.Talk, obj : GwendyScenes.LoftPrompt, enabled : true,
		tooltip : "Chat with Gwendy."
	});
	options.push({ nameStr : "Sex",
		func : GwendyScenes.LoftSexPrompt, obj : GwendyScenes.LoftPrompt, enabled : gwendy.Sexed(),
		tooltip : "Proposition her for sex."
	});
	Gui.SetButtonsFromList(options, true);
}

GwendyScenes.LoftSexPrompt = function(back, disableSleep) {
	var parse = {};
	var options = new Array();
	GwendyScenes.ChallengeSexWonPrompt(true, options, disableSleep);
	GwendyScenes.ChallengeSexLostPrompt(true, options, disableSleep);
	if(!disableSleep) {
		options.push({ nameStr : "Sleep",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Ah, could use to work out some of my kinks - if you know what I mean - but if you are tired, fair enough.”</i> Gwendy yawns, stretching. <i>“I guess I need some sleep as well, running this farm is tiring work.”</i>", parse);
				Text.NL();
				Text.Add("With that said, the farm girl undresses, putting on quite a show for you. There is a slight sheen of perspiration on her freckled skin, and she dries herself off with a towel before heading for her bed, stark naked. She sways her butt enticingly as she walks, showing off the horseshoe tattoo on her lower back.", parse);
				Text.NL();
				Text.Add("<i>“Sure you haven’t changed your mind?”</i> Gwendy asks sultrily, noticing your stare. You shake your head a bit, trying to clear it. Undressing, you join her in bed. You fall asleep to the calm beat of her heart, her skin warm against you.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					world.loc.Farm.Loft.SleepFunc();
				});
			}, enabled : true,
			tooltip : "Just sleep for now."
		});
	}
	
	if(back)
		Gui.SetButtonsFromList(options, true, back);
	else
		Gui.SetButtonsFromList(options);
}

GwendyScenes.BarnPrompt = function() {
	Text.Clear();
	
	var parse = {
		
	};
	
	// TODO: Initial talk
	Text.Add("PLACEHOLDER: Barn.", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.Flush();
	
	
	//[Talk][Work]
	var options = new Array();
	options.push({ nameStr : "Talk",
		func : GwendyScenes.Talk, obj : GwendyScenes.BarnPrompt, enabled : true,
		tooltip : "Chat with Gwendy."
	});
	options.push({ nameStr : "Work",
		func : GwendyScenes.Work, enabled : true,
		tooltip : "Be a little productive, and lend an able hand."
	});
	Gui.SetButtonsFromList(options, true);
}

GwendyScenes.FieldsPrompt = function() {
	Text.Clear();
	
	var parse = {
		
	};
	
	Text.Add("PLACEHOLDER: Fields.", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.Flush();
	
	//[Talk][Work]
	var options = new Array();
	options.push({ nameStr : "Talk",
		func : GwendyScenes.Talk, obj : GwendyScenes.FieldsPrompt, enabled : true,
		tooltip : "Chat with Gwendy."
	});
	options.push({ nameStr : "Work",
		func : GwendyScenes.Work, enabled : true,
		tooltip : "Be a little productive, and lend an able hand."
	});
	Gui.SetButtonsFromList(options, true);
}

GwendyScenes.Talk = function(backfunc) {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	//TODO
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	
	//[Sure][Nah]
	var options = new Array();
	options.push({ nameStr : "Chat",
		func : function() {
			Text.Clear();
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("<i>“D’you know anything about those rabbit people that’ve been showing up lately?”</i> Gwendy asks you. <i>“They come in groups, usually at dusk or dawn when there isn’t anyone on watch. I’ve had to chase them off several times, but they still managed to steal a lot of goods.”</i> The farmer grimaces. <i>“Not to mention they ruin the crops with all their hopping about, the dumb things.”</i>", parse);
				Text.NL();
				if(burrows.flags["Access"] == Burrows.AccessFlags.Unknown) {
					Text.Add("You admit that you don’t know much about them, although you think you’ve seen some of them while traveling.", parse);
					Text.NL();
					Text.Add("<i>“Nasty critters,”</i> the girl mutters.", parse);
				}
				else {
					Text.Add("You tell Gwendy about the large colony of lagomorphs you have discovered.", parse);
					Text.NL();
					Text.Add("<i>“Really now? Do you think they might become a problem? I’ll fight the bastards off any time, but I can’t guard the farm day and night.”</i> The girl suddenly looks very tired. <i>“So much work to do, and these critters aren’t making my life any easier.”</i>", parse);
				}
			}, 1.0, function() { return true; });
			/* TODO
			scenes.AddEnc(function() {
				Text.Add("", parse);
				Text.NL();
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("", parse);
				Text.NL();
			}, 1.0, function() { return true; });
			*/
			scenes.Get();
			
			Text.Flush();
			
			Gui.NextPrompt(function() {
				GwendyScenes.Talk(backfunc);
			});
		}, enabled : true,
		tooltip : "Talk about random things."
	});
	
	if(gwendy.flags["Market"] == Gwendy.Market.NotAsked) {
		options.push({ nameStr : "Rigard",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Looking to get inside Rigard are you? I don’t see why. That place is full of pompous jerks and bigots,”</i> she says, sighing. <i>“I don’t go near the place, myself, if I can avoid it. I do have to head there at times in order to sell my crops and produce, however. You could tag along when I head for the market, I guess.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Just make sure to catch me early, it usually takes most of the day before I finish. Of course, with your help it will hopefully be quicker.”</i>", parse);
				Text.Flush();
				gwendy.flags["Market"] = Gwendy.Market.Asked;
				
				Gui.NextPrompt(function() {
					GwendyScenes.Talk(backfunc);
				});
			}, enabled : true,
			tooltip : "Ask her for a way to get into the city of Rigard."
		});
	}
	else if(gwendy.flags["Market"] == Gwendy.Market.Asked) {
		options.push({ nameStr : "Market",
			func : function() {
				Text.Clear();
				if(world.time.hour >= 7) {
					Text.Add("<i>“[playername], can we talk about this tomorrow morning? I’m busy right now, and just not in the mood to talk about the city, okay?”</i>", parse);
					Text.Flush();
					Gui.NextPrompt(function() {
						GwendyScenes.Talk(backfunc);
					});
					return;
				}
				else if(gwendy.Relation() < 30) {
					Text.Add("<i>“While I do have a pass to get within the gates, you wouldn’t believe what I had to go through just to get one. No offense, [playername], but I think we should get to know each other a little more before I’m willing to vouch for you. If you do something bad within the city limits, I’d be the one taking the fall.</i>", parse);
					Text.NL();
					Text.Add("You nod in understanding. That seems reasonable.", parse);
					Text.NL();
					Text.Add("<i>“Good, anything else you’d like to talk about? There is so much work to do, but I can spare some time to chat if you want,”</i> she smiles.", parse);
					Text.Flush();
					
					Gui.NextPrompt(function() {
						GwendyScenes.Talk(backfunc);
					});
					return;
				}
				
				var humanity = player.Humanity();
				
				Text.Add("<i>“You’d like to help me? Great, but you should know this first: Rigard isn’t a particularly nice city, just warning you. There is a reason I usually do this alone and don’t bring Adrian along.”</i>", parse);
				Text.NL();
				if(humanity < 0.95)
					Text.Add("<i>“That place is going to give you a hard time, [playername]. They’re not very fond of morphs, or anything that doesn’t look… well… human in general. Are you sure you want to go?”</i>", parse);
				else
					Text.Add("<i>“You being a ‘pure’ human helps, but I wouldn’t expect any kind of niceties from that lot. I think they might hate on you just for associating, given my reputation.”</i> She sighs. <i>“You still wanna go?”</i>", parse);
				Text.Flush();
			
				//[Yes][No]
				var options = new Array();
				options.push({ nameStr : "Yes",
					func : Scenes.Farm.GoToMarketFirst, enabled : true,
					tooltip : "Despite all adversities, you still want to go. Besides, if it‘s that bad, she probably needs some company, right?"
				});
				options.push({ nameStr : "No",
					func : function() {
						Text.Clear();
						Text.Add("Gwendy smiles as she hears your reply.", parse);
						Text.NL();
						Text.Add("<i>“Good choice! They’re a bunch of hypocrites, if you ask me. They hate on morphs, but sure don’t see to have a problem using their wool or drinking their milk when I go there to ship my produce,”</i> she comments angrily. <i>“Trust me, you’re doing yourself a favor by staying away from that place.”</i>", parse);
						Text.NL();
						Text.Add("<i>“Anyway, anything else you’d like to talk about?”</i>", parse);
						Text.Flush();
						
						Gui.NextPrompt(function() {
							GwendyScenes.Talk(backfunc);
						});
					}, enabled : true,
					tooltip : "On second thought, you’ve changed your mind."
				});
				Gui.SetButtonsFromList(options);
			}, enabled : true,
			tooltip : "Ask her if the two of you can make a trip to the market in Rigard."
		});
	}
	
	/* TODO
	options.push({ nameStr : "Placeholder",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
		}, enabled : false,
		tooltip : ""
	});
	*/
	Gui.SetButtonsFromList(options, true, backfunc);
}

GwendyScenes.Work = function() {
	Text.Clear();
	
	gwendy.relation.IncreaseStat(40, 1);
	
	var parse = {
		
	};
	
	var p1 = party.Get(1);
	if(p1) {
		parse["p1name"] = p1.name;
	}
	
	Text.Add("You tell her you'd like to help her out on the farm for a bit. She seems happy to hear it, and accepts your aid. <i>“Alright, let's put you to work then!”</i>", parse);
	if(party.Two())
		Text.Add(" You tell [p1name] to get help with work as well, as there's more than enough for you two to pitch a hand in.", parse);
	else if(!party.Alone())
		Text.Add(" You tell the group to get to work as well, seeing as there's enough to do for everyone to pitch a hand in.", parse);
	
	// Random scenes
	var scenes = new EncounterTable();
	// MILKING
	scenes.AddEnc(GwendyScenes.WorkMilking, 1.0, function() { return true; });
	// FEEDING
	scenes.AddEnc(GwendyScenes.WorkFeedingDanie, 1.0, function() { return true; });
	// TODO
	/*
	scenes.AddEnc(function() {
		Text.Add("", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	*/
	/*
	scenes.AddEnc(function() {
		Text.Add("", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	*/
	scenes.Get();
	Text.Flush();
}

GwendyScenes.WorkFeedingDanie = function() {
	
	var parse = {
		playername : player.name
	};
	
	Text.Add("She looks up into the sky while deciding what you should do on the farm, finally instructing you to go out to the fields and feed the animals.", parse);
	Text.NL();
	Text.Add("<i>“Shouldn’t be too hard, but there’s plenty to feed. Might want to work a little faster if you don’t want the rowdier ones trying to chase you down.”</i> She motions for you to follow her to where the feed is kept.", parse);
	Text.NL();
	
	if(gwendy.flags["WorkFeed"] == 0) {
		Text.Add("Arriving before a large shed with a padlock keeping intruders out, Gwendy pulls a key out of her back pocket and undoes the lock, revealing to you two bags containing oats and other grains.", parse);
		Text.NL();
		Text.Add("<i>“Fortunately, all we really need to feed the critters here are vegetables and such. Saves a lot of money on meats - for the most part, I make the food from some of the crops here and mix it with grains I buy.”</i>", parse);
		Text.NL();
		Text.Add("You mention the pigs and wonder if she just feeds them vegetables all the time. The girl shakes her head. <i>“If I did, they’d be in pretty poor health. So...”</i> Gwendy turns on her heels and shows you what looks to be buckets filled with slop. <i> “Give these to the pigs along with the feed. They should be alright. Well, I’ve got things to do, see you later!”</i>", parse);
	}
	else
		Text.Add("After undoing the lock on the shed, Gwendy smiles slightly before going off to take care of her own work. You don’t really have the time to flirt with her since the assignment is rather time-consuming.", parse);
	Text.NL();
	Text.Add("Fetching a wheelbarrow from the shed, you put what you think you’ll need into it when you suddenly see Danie skipping along, singing her song, oblivious to the world around her. You hold your breath, wondering if she’s going to trip... ", parse);
	if(Math.random() < 0.5)
		Text.Add("but she spots you, changing her direction.", parse);
	else
		Text.Add("and sure enough, the lovable little goofball falls flat on her face. You hurry over and help her to her feet.", parse);
	Text.NL();
	Text.Add("<i>“[playername], how are you? Are you going around the barn with food?”</i>", parse);
	Text.NL();
	Text.Add("You nod, before pushing the wheelbarrow forward and handing her an apple. <i>“Oh, can I come with you? I like spending time with you!”</i> You tell her yes, and the ovine girl joins your side as the two of you set off.", parse);
	Text.NL();
	Text.Add("In due time, you end up singing and humming simple melodies together with the sheep-girl while spreading happiness and food to the waiting, hungry denizens. You note that some of the animals and morphs look expectantly at you, and wonder if it's your voice, face, or the food that have caught their attention. Still, you carry on without complaint, trying to keep up with Danie.", parse);
	Text.NL();
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("Moving through the stables, one of the stallions dips his head down, nuzzling the surprised sheep.", parse);
		Text.NL();
		Text.Add("<i>“E-eep! Hold on, horsie!”</i> she giggles, pulling a sack of grains from the wheelbarrow, pouring its contents into the trough in the horse’s pen. Given the option, the stallion stops munching on sheep and digs into his meal.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("You head over to the sheep paddock, where Danie briefly leaves you to frolic with her kin. Well, now it looks like you have to feed all of them yourself. Eventually, she comes back to you, apologizing for dallying.", parse);
		world.TimeStep({minute:20});
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("While feeding a group of rowdy bovine-morphs, Danie manages to trip, waving her arms wildly as she falls. The clumsy sheep-girl also somehow manages to upend the bag of feed on top of herself. Without missing a beat, the friendly cow-girls and boys continue their meal, eating it straight off the flustered sheep. Before you’ve reached her, they have finished all the food, licking the scraps from her pale skin. Danie is a bit unsteady on her feet as you help her up, fidgeting a bit before cleaning herself off.", parse);
		player.AddLustFraction(0.1);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.NL();
	Text.Add("Like all good things, your time with the cute sheep-girl comes to an end, and she parts ways with you to return to her paddock. With her help, you’ve finished your task relatively quickly. Returning the borrowed equipment to the shed, you go to find Gwendy again. When you do, you see she’s still taking care of her own chores. Although you’d rather not leave without saying anything to her, you respect that she’s still busy and head out on your travels again.", parse);
	Text.NL();
	Text.Add("Spending time with Danie ", parse);

	// Boost stats
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("left you feeling a little more peppy, especially with all the singing. As you head off, you begin humming on the last tune, wondering if Danie will show up next time too.", parse);
		player.spirit.IncreaseStat(30, 1);
		return true;
	}, 1.0, function() { return player.spirit.base < 30; });
	scenes.AddEnc(function() {
		Text.Add("has you singing more lately, which seems to attract a few more glances your way. Either for better or worse, your voice has added a bit more charm to your usual swagger.", parse);
		player.charisma.IncreaseStat(30, 1);
		return true;
	}, 1.0, function() { return player.charisma.base < 30; });
	if(scenes.Get() == null) {
		Text.Add("is always pleasant, even though she is a bit of a klutz at times.", parse);
	}
	
	gwendy.flags["WorkFeed"]++;
	danie.relation.IncreaseStat(50, 5);
	
	if(party.Two()) {
		parse["name"]   = party.Get(1).name;
		parse["himher"] = party.Get(1).himher();
		Text.Add(" [name] waits for you patiently at the entrance to the farm, smiling as you join [himher] and set off.", parse);
	}
	else if(!party.Alone())
		Text.Add(" Your companions are chatting among themselves while waiting for you at the entrance to the farm, smiling as you join them and set off.", parse);
		
	Text.Flush();
	
	world.TimeStep({hour: 4});
	
	Gui.NextPrompt();
}

GwendyScenes.WorkMilking = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Add("She looks up into the sky while deciding what you should do on the farm and instructs you to follow her into the barn. <i>“I'm milking the cows today and could use some help, if you don't mind.”</i> You wouldn't mind spending some more time with the lovely farmer, so you agree to help her. <i>“Great, let's go!”</i>", parse);
	Text.NL();
	Text.Add("Upon entering the section where the cows are kept, you see the bovine creatures look up expectantly as you and Gwendy head down the aisle to where the milk pails are stored, neatly stacked one atop another. Gwendy lets out a small sigh as she hands you two buckets before taking two herself. <i>“I hope you're not expecting to do too much today because we have to drain all of these cows and the cowgirls here, and then the goats, and a few sheep. And we only have so many buckets, so we've got to store the milk as we go.”</i>", parse);
	Text.NL();
	Text.Add("It's sounding like hard work so far, and to top it all off, it seems this is to be done by hand, no less. You might be cramping before the day's done. Still, the two of you get to it, starting with the cows and cow-like girls.", parse);
	Text.NL();
	
	if(gwendy.flags["WorkMilked"] == 0) {
		Text.Add("Gwendy tells you to join her for a quick lesson, since it seems it's your first time milking. <i>“Just so you don't do anything reckless, it'd be best to show you instead of telling you how to milk a cow.”</i> Before she starts teaching you, she has you fetch a bucket of soapy and clean water, and prepares a cloth and some type of lubricant. She explains that these are the basic tools of the trade, while you quietly wonder what they're for.", parse);
		Text.NL();
		Text.Add("With a sly chuckle, she takes the pail from you and sets it down. <i>“It may seem odd, but when this is all said and done, you'll be thanking me.”</i>  She gives you a brief tutorial on what to do, going over ways to get milk the fastest and how to make sure the attendee won't get upset. It's a bit complicated, but you get the gist of it, and ask questions whenever confused. She even lets you milk the cow in the stable to make sure you understood what she said.", parse);
		Text.NL();
		Text.Add("<i>“And that's all there is to it! Do all of that, and you should be good to go!”</i> Gwendy announces as she removes the half-filled bucket from under the cow. <i>“Mind, if you want to be bold and skip a step or two, you might wind up with a knot. Cows don't like it when you pull the wrong way... just like I'm sure you wouldn't either.”</i>", parse);
		Text.NL();
		Text.Add("That last part is said with heavy sexual overtones, followed by a lascivious chuckle. <i>“I wouldn't worry about anything like that for now, though. Just stick to what I said, and you'll be a-okay.”</i> With that, she hands you back your supplies and heads off to milk the other denizens, even if the way to do it brings quite a few suggestive thoughts to your mind.", parse);
		Text.NL();
		Text.Add("Just as you enter another stable, Gwendy calls out your name, though she wears a mischievous expression. <i>“Say, [playername], do you feel up to a little challenge to spice things up? Why don't we see who can get the most milk the fastest, hm? Winner gets a nice li'l treat from the loser, of course! What do you say?”</i>", parse);
	}
	else if(gwendy.flags["WorkMilked"] < 10) {
		Text.Add("No matter how many times you do it, you still find the prospect of milking teats a bit iffy. Still, it is a task that needs doing, and you square your shoulders in preparation.", parse);
		Text.NL();
		Text.Add("Before the two of you part to work in your separate areas, Gwendy taps your shoulder. Turning, you're met with a cat-like grin and playful look that tells you she's up to no good. <i>“I've seen your work, and I gotta say it's rather impressive for someone who's still wet behind the ears. So, why don't we make a little bet? Whoever can gather the most buckets of milk the fastest gets a treat from the loser, rightly speaking. Do you think you can handle it?”</i>", parse);
	}
	else {
		Text.Add("By now, you are a practiced hand at this, due to your many hours working with Gwendy. You are no longer particularly bothered by the notion, either, even finding yourself looking forward to relieving some poor cowgirl of her stress.", parse);
		Text.NL();
		Text.Add("Before the two of you part to work in your separate areas, your eyes meet Gwendy's. <i>“So, what do you say we add a bit of excitement to work? Fastest milker gets a treat from the loser, up for it?”</i> The farmer cracks her knuckles. <i>“And don't think I'll go easy on you - I've seen you work, and you've gotten pretty good!”</i>", parse);
	}
	
	Text.Flush();
	var challenge = true;
	var lose = false;
	//[Yeah!][No][Lose]
	var options = new Array();
	options.push({ nameStr : "Yeah!",
		func : function() {
			Text.Clear();
			Text.Add("You tell Gwendy you wouldn't mind taking her on, especially considering what winning seems to entail. <i>“I figured you'd say something like that, but don't think I'm gonna go easy on you, either.”</i> The two of you stare at one another for a moment, adopting challenging smiles on your faces before dashing off to try and best one another!", parse);
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Sounds like fun!"
	});
	options.push({ nameStr : "No",
		func : function() {
			challenge = false;
			Text.Clear();
			Text.Add("You decline, saying with the workload before the two of you, a challenge should be the last thing on her mind. She sucks her teeth at that, but admits you have a point. <i>“Oh well, in any event, we probably will be more productive without the added stuff. Alright, I'll see you when we're finished then, okay?”</i> With a nod, you go back to what you were doing, though you notice that Gwendy has a slight pout on her face. While cute, she seems disappointed with you, but what's done is done. Now, time to get to work!", parse);
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Isn't there too much work to do to be playing around?"
	});
	options.push({ nameStr : "Lose",
		func : function() {
			lose = true;
			Text.Clear();
			Text.Add("You accept her challenge, but in the back of your mind you decide to just lose for the sake of it. Given her demeanor and allure, a part of you wants to see what the losing side is like!", parse);
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Who gives a damn, you'll be with Gwendy! Lose on purpose."
	});
	Gui.SetButtonsFromList(options);
	
	Gui.Callstack.push(function() {
		Text.NL();
		
		// Random milking scene
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("You get ready to work, placing your tools beside a cow in one of the pens. The animal moos appreciatively as you ease her heavy burden.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("Your first customer of the day is a busty cowgirl, her breasts heavy with milk. She blushes brightly as you get into position, grabbing hold of her puffy nipples.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("You hear a moan from a nearby pen as you prepare your tools. Curiosity kindled, you head over and peek inside, blushing slightly at the scene before you. One of the cowgirls seems to have gotten started early, milk dripping from her immense knockers. She has her back propped up against the back of the stall, one hand massaging her freely lactating breasts and the other busy between her spread legs.", parse);
			Text.NL();
			Text.Add("At your arrival, she moans pleadingly, shuddering as you pull on her teats, letting the milk flow into one of your buckets.", parse);
			Text.NL();
			Text.Add("<i>“Hey! No playing around with the livestock, you have work to do!”</i> Gwendy shouts to you, already getting started on her second customer. You regretfully finish your task, leaving the girl to take care of her desires herself as you move on to the next one in line.", parse);
		}, 1.0, function() { return true; });
		scenes.Get();
		Text.NL();
		
		// Skill check
		var skillcheck = (player.dexterity.Get() + player.intelligence.Get() + player.libido.Get()) / 3;
		skillcheck += Math.random() * 10 - 5;
		skillcheck -= Math.min(gwendy.flags["WorkMilked"], 10);
		
		if(skillcheck < 20) {
			Text.Add("Despite following Gwendy's instructions, you struggle to make anywhere near as much progress as you'd like. Still, you press on without complaint, though you see Gwendy moving at a slightly faster pace than you. You wonder if she's just trying to match you for now until you hear an annoyed groan, which immediately brings you back to work. Milking is hard!", parse);
		}
		else if(skillcheck < 40) {
			Text.Add("Given you rather quick reflexes and reactions, you manage to fill a good amount of buckets, even surpassing Gwendy from time to time. Still, it's hard and you make mistakes too often, letting Gwendy get ahead of you while you correct them.", parse);
		}
		else if(skillcheck < 60) {
			Text.Add("While the work is hard, you carry on with deft skill, sometimes leaving Gwendy a bucket or two behind. However, it seems your attendees aren't the best you've had, as they often kick your precious cargo down. Oh well, you've the speed to make up for it, at least.", parse);
		}
		else { // +60
			Text.Add("With your skill, it takes little to no time at all to fill your buckets, making Gwendy's efforts look meager. Time and again, you spot her looking at you as you pass by her to grab more buckets. Even when a stray kick threatens to spill one of your buckets, you quickly react, managing to save the milk. Sometimes, you even lend Gwendy a hand, just to keep her up to speed.", parse);
		}
		Text.NL();
		
		// Calculate time it takes to finish
		var numHours = Math.round(5 - skillcheck/20);
		if(numHours > 4) numHours = 4;
		if(numHours < 1) numHours = 1;
		parse["numhr"] = Text.NumToText(numHours);
		parse["s"] = numHours > 1 ? "s" : "";
		
		Text.Add("It takes about [numhr] hour[s], but the two of you manage to milk those in need. Your hands feel a little raw, but it's nothing that'll stop you from performing your everyday tasks.", parse);
		Text.NL();
		Text.Add("On the up side, ", parse);
		
		// Boost stats
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("you could swear your hands work and move more deftly than before, which is always an improvement.", parse);
			player.dexterity.IncreaseStat(30, 1);
			return true;
		}, 1.0, function() { return player.dexterity.base < 30; });
		scenes.AddEnc(function() {
			Text.Add("your time with milking the cow populace has left you slightly more educated about how to handle these situations, which could prove useful down the road.", parse);
			player.intelligence.IncreaseStat(30, 1);
			return true;
		}, 1.0, function() { return player.intelligence.base < 30; });
		scenes.AddEnc(function() {
			Text.Add("you smile a little as you think back to kneading the teats of a particularly well-endowed cowgirl, and the numerous other breasts you fondled while working. Maybe this isn't so bad.", parse);
			player.libido.IncreaseStat(30, 1);
			return true;
		}, 1.0, function() { return player.libido.base < 30; });
		if(scenes.Get() == null) {
			Text.Add("you had a good time, and the farmer really appreciated your help.", parse);
		}
		
		Text.NL();
		Text.Add("Gwendy stretches as she lets out a small yawn. <i>“Well, I don't know about you but I still have a farm to handle. Thanks for the help, [playername], you saved me quite some time. So, help yourself to a bottle of milk, if you'd like.”</i> You thank her, admitting you were a little parched. <i>“It's fine, I have gallons of the stuff.”</i>", parse);
		Text.NL();
		
		// TODO: Gain milk item
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("She hands you a bottle of milk.", parse);
			party.inventory.AddItem(Items.CowMilk);
		}, 8.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("She hands you a bottle of goat milk.", parse);
			party.inventory.AddItem(Items.GoatMilk);
		}, 8.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("She hands you a bottle of sheep milk.", parse);
			party.inventory.AddItem(Items.SheepMilk);
		}, 8.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("She hands you a bottle of Bovia.", parse);
			party.inventory.AddItem(Items.Bovia);
		}, 1.0, function() { return true; });
		/* TODO: other items
		scenes.AddEnc(function() {
			Text.Add("", parse);
			Text.NL();
		}, 1.0, function() { return true; });
		*/
		scenes.Get();
		Text.NL();
		
		gwendy.relation.IncreaseStat(40, 3);
		world.TimeStep({hour: numHours});
		gwendy.flags["WorkMilked"]++;
		
		if(challenge) {
			GwendyScenes.ChallengeSex(skillcheck, lose);			
		}
		else {
			Text.Add("With that, the two of you part, her heading to the barnyard, and you going your own way.", parse);
			if(party.Two()) {
				parse["himher"] = party.Get(1).himher();
				Text.Add(" Your companion waits for you patiently at the entrance to the farm, and smiles as you join [himher] and set off.", parse);
			}
			else if(!party.Alone())
				Text.Add(" Your companions are chatting among themselves while waiting for you at the entrance to the farm, smiling as you join them and set off.", parse);
			Text.Flush();
			Gui.NextPrompt();
		}
	});
}

world.loc.Farm.Loft.events.push(new Link(
	"Gwendy", function() { return gwendy.IsAtLocation(world.loc.Farm.Loft); }, true,
	function() {
		if(gwendy.IsAtLocation(world.loc.Farm.Loft)) {
			Text.Add("Gwendy is here.");
		}
		else
			Text.Add("Gwendy doesn't seem to be in at the moment.");			
		Text.NL();
	},
	GwendyScenes.LoftPrompt
));
world.loc.Farm.Barn.events.push(new Link(
	"Gwendy", function() { return gwendy.IsAtLocation(world.loc.Farm.Barn); }, true,
	function() {
		if(gwendy.IsAtLocation(world.loc.Farm.Barn)) {
			Text.Add("Gwendy is here.");
		}
		else
			Text.Add("Gwendy doesn't seem to be here at the moment.");			
		Text.NL();
	},
	GwendyScenes.BarnPrompt
));
world.loc.Farm.Fields.events.push(new Link(
	"Gwendy", function() { return gwendy.IsAtLocation(world.loc.Farm.Fields); }, true,
	function() {
		if(gwendy.IsAtLocation(world.loc.Farm.Fields)) {
			Text.Add("Gwendy is here.");
		}
		else
			Text.Add("Gwendy doesn't seem to be here at the moment.");			
		Text.NL();
	},
	GwendyScenes.FieldsPrompt
));

export { Gwendy, GwendyScenes };
