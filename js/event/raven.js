/*
 * 
 * Define Raven mother
 * 
 */

import { Scenes } from '../event';

Scenes.RavenMother = {};

function RavenMother(storage) {
	Entity.call(this);
	this.ID = "ravenmother";
	
	this.name              = "RavenMother";
	this.maxHp.base        = 3000;
	this.maxSp.base        = 500;
	this.maxLust.base      = 500;
	// Main stats
	this.strength.base     = 100;
	this.stamina.base      = 120;
	this.dexterity.base    = 150;
	this.intelligence.base = 90;
	this.spirit.base       = 100;
	this.libido.base       = 100;
	this.charisma.base     = 80;
	
	this.level             = 20;
	this.sexlevel          = 15;
	
	this.combatExp         = 800;
	this.coinDrop          = 1500;
	
	this.body.DefMale();
	// TODO: Special avatar
	//this.avatar.combat     = Images.lago_male;
	
	this.Butt().buttSize.base = 2;
	
	this.body.SetRace(Race.Avian);
	
	TF.SetAppendage(this.Back(), AppendageType.wing, Race.Avian, Color.black);
	
	this.body.SetBodyColor(Color.white);
	
	this.body.SetEyeColor(Color.green);
	
	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Stage"]     = 0;
	this.flags["Met"]       = 0;
	this.flags["KeptRaven"] = 0;
	this.flags["RBlock"]    = 0;
	
	if(storage) this.FromStorage(storage);
}
RavenMother.prototype = new Entity();
RavenMother.prototype.constructor = RavenMother;

RavenMother.Stage = {
	ravenstage2 : 8,
	ravenstage3 : 12
}

RavenMother.prototype.Ravenness = function() {
	return Math.floor(this.flags["Stage"] / 100);
}

// Increase ravenness and return trigger
RavenMother.prototype.RavenTrigger = function() {
	var oldVal = this.Ravenness();
	this.flags["Stage"] += Math.floor(10 + Math.random() * 70);
	var newVal = this.Ravenness();
	
	return newVal > oldVal;
}

RavenMother.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

RavenMother.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

Scenes.RavenMother.TheHunt = function(func) {
	var parse = {};
	
	Scenes.RavenMother.theHuntWakeup = func;
	
	if(party.NumTotal() <= 1) {
		parse["person"] = "your darling";
		if(Math.random() < 0.5) {
			parse["pheshe"]  = "he";
			parse["phisher"] = "his";
		}
		else {
			parse["pheshe"]  = "she";
			parse["phisher"] = "her";
		}
	}
	else {
		var person = party.GetRandom(true);
		parse["person"]  = person.name;
		parse["pheshe"]  = person.heshe();
		parse["phisher"] = person.hisher();
	}
	
	ravenmother.flags["Met"] = 1;
	
	Text.Clear();
	Text.Add("Not quite sure what to expect, you focus your mind on the crystal. At first, nothing seems to happen, and you feel a little foolish, but after a few moments, you feel the gemstone tugging at you. It does not draw you in, but instead grasps hold of you, and guides you, almost enveloping you in a crystalline armor. Despite your intense concentration, with its pull, you have no trouble slipping into dream...", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("...Pancakes sizzle in your frying pan, as [person] waters the plants around your cozy cottage. Have you done this before? You can’t seem to quite recall.", parse);
		Text.NL();
		Text.Add("You feel a pull toward the table, the current of the dream dragging you to the next step. The pancakes should be on the plates, and then you’ll eat. You allow yourself to move along with the flow, but now it actually is a decision for you. You feel you can stop if you wish, now that the gem shields and anchors you.", parse);
		Text.NL();
		Text.Add("At the table, you notice the design of a raven painted on your plate. That’s right, that’s what you’re here for. Picking the plate up, you glare at it, and tell the raven to come out and explain itself. Blessedly, you don’t even feel too foolish doing it - probably a positive side-effect of the dream.", parse);
		Text.NL();
		Text.Add("<i>“What are you doing?”</i> [person] asks, smiling. <i>“The plate cannot talk, you know. Just have a seat - these pancakes are delicious.”</i> With the words, you feel the current of the dream snatch at you more insistently, but you shrug it off.", parse);
		Text.NL();
		Text.Add("Well, if it won’t come out, you’ll have to resort to more drastic measures. You lift up the plate up, and throw it to the ground. As it falls, a pitch black raven springs out with a desperate flap of its wings, a moment before the now unadorned plate shatters on the floor.", parse);
		Text.NL();
		Text.Add("You’re unsure what to do next, but the bird is not so uncertain. With an outraged croak, it flies straight at the corner of the room, but instead of crashing into the wall, it somehow shifts through it, and with a blur in the air it is gone.", parse);
		Text.Flush();
		
		var prompt = function(asked) {
			//[Ask][Investigate]
			var options = new Array();
			options.push({ nameStr : "Ask",
				func : function() {
					Text.Clear();
					Text.Add("You ask [person] if [pheshe] knows where the raven went or how to follow it.", parse);
					Text.NL();
					Text.Add("<i>“A raven? Now you are just being ridiculous,”</i> [pheshe] answers. <i>“How could a raven possibly be in here? Now come and eat these pancakes with me before they get cold.”</i>", parse);
					Text.NL();
					Text.Add("Well, you’re not sure why you thought that might work.", parse);
					Text.Flush();
					
					prompt(true);
				}, enabled : !asked,
				tooltip : Text.Parse("Ask [person] for help.", parse)
			});
			options.push({ nameStr : "Investigate",
				func : function() {
					Text.Clear();
					Text.Add("Ignoring [person]’s bemused entreaties, you carefully examine the corner where the raven disappeared. There’s something different about it. Reality - for lack of a better term - feels thinner there, easier to penetrate. Is it simply because it’s such an unimportant part of the dream?", parse);
					Text.NL();
					Text.Add("There’s something more as well. You look carefully, your vision refocusing with the aid of the crystal and see something shimmer with worry. Tracing your hand over the sensation, you feel it push through the soft spot of the dream, and enter a tunnel to somewhere else.", parse);
					Text.NL();
					Text.Add("You will your body through the corner. The dreamscape stretches, pushing back harder as you try to get through, but as you call for the gem to assist you, the weak fabric of the dream proves no match for you...", parse);
					Text.Flush();
					
					Gui.NextPrompt(Scenes.RavenMother.TheHuntWolf);
				}, enabled : true,
				tooltip : "Examine the spot the raven disappeared."
			});
			Gui.SetButtonsFromList(options);
		}
		prompt(false);
	});
	
}


Scenes.RavenMother.TheHuntWolf = function() {
	var parse = {};
	
	Text.Clear();
	Text.Add("...You run on all fours, as a hunter, chasing a deer. This time, however, you’re prepared, and slow to a walk, looking around at the trees above. You feel more in control of the dream now. You think you could change into a human if you tried, but there’s no need.", parse);
	Text.NL();
	Text.Add("Everything is quiet. Your pack walks a few steps behind you, the deer a little ways ahead. You wonder for a moment about the mechanics of this dream, when you spot a raven above. You’re not quite sure if it’s the same one as before, but it doesn’t matter.", parse);
	Text.NL();
	Text.Add("You spring up, jumping easily from tree to tree, until you perch at the canopy. You aim your jump for a moment and spring for the raven, flying swift as an arrow through the air. At the last moment, the raven spots you, and flaps its wings with a desperate cry.", parse);
	Text.NL();
	Text.Add("You just miss it, snatching a few of its tail feathers, as it vanishes from the dream. Deciding you’re not going to fall here, you push off the air gently, and delve into the raven’s tunnel, the scent trail of its anxiety clear to your canid nose...", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("...You are running, stalked by flickering shadows and an all-encroaching fire. Mindless panic swirls through your mind, urging you forward. You blink your eyes, focusing, remembering why you’re here, and you calm.", parse);
		Text.NL();
		Text.Add("Fire licks at your back, but you come to a stop and ignore it. It cannot harm you in a dream. <i>“Has the little ant found some small bit of courage?”</i> Uru demands, floating above you. <i>“But you should run, little ant. Your feet will serve you much better here.”</i>", parse);
		Text.NL();
		Text.Add("Paying the demon no mind, you scan the sky, and finally spot the raven behind her. This time, you realize there is no reason for you to jump or fly. It’s your dream, and you can be anywhere you want in it.", parse);
		Text.NL();
		Text.Add("You stand behind the raven in the air, your arms already extended, your hands grabbing a firm hold of the bird. A smile crosses your lips - you’ve finally got it.", parse);
		Text.NL();
		Text.Add("The warm bundle of feathers squirms in your hands, and screams loudly, apparently realizing its predicament. You hold fast, and after another rumbling croak of desperation assaults your ears, you feel a tunnel opening. Looks like it’s trying to drag you into another dream.", parse);
		Text.NL();
		Text.Add("Well, this time you’re not letting it go. Even if it goes somewhere, it’s not getting away from you...", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("...You stand in a forest, the squirming raven still clutched in your hands. Something is strange here. It’s not quite like the dreams you’ve had before. Thinking about it for a moment, you realize what it is - there is no pull. This dream doesn’t seem to want you to do anything, doesn’t have a role set out for you.", parse);
			Text.NL();
			Text.Add("The raven in your hands screams again, and a cacophony of croaks answers it from all around you. You glance around in concern as the air fills with the sound of hundreds of wingbeats, apparently roused to action by the cries of your captive. They seem to be surrounding you.", parse);
			Text.NL();
			Text.Add("You clamp a hand over the bird’s mouth so it can’t give away where you are anymore, and rush forward. There has to be a place to hide somewhere, and this particular raven is the only one you’re sure has been spying on you. It might be the only route you have to answers.", parse);
			Text.NL();
			Text.Add("You will yourself to run faster, imagining yourself darting through the trees like the wind, but there is hardly any effect. Your feet are a little lighter, but this dream resists. You’re probably confined to something resembling your normal abilities here.", parse);
			Text.NL();
			Text.Add("The beat of wings still pursues you, and you hear loud croaks from birds who have apparently spotted you, calling the rest of the conspiracy after you. You look around you, watching for black shapes flying at you as you run, so you are caught completely off-guard when you dart past a line of thick gnarled trees and find yourself in the middle of a shadowed glade.", parse);
			Text.Flush();
			
			Gui.NextPrompt(Scenes.RavenMother.TheHuntGlade);
		});
	});
}

Scenes.RavenMother.TheHuntGlade = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("The circular clearing is two dozen steps across, with tall, ancient oaks marking its perimeter. The trees across from you are more black than green, their limbs covered in scores of ravens, a countless number of beaks turned toward you by the watchers.", parse);
	Text.NL();
	parse["int"] = player.Int() > 30 ? " Well, all bird hearts beat fast, so that really doesn’t mean much." : "";
	Text.Add("You spin around and see ravens landing on the trees you just passed. It seems you were not escaping from them. They were herding you. You clutch your prisoner tight to your chest, holding it firm, feeling its heart beating fast.[int] Maybe it would serve as a hostage, at least. Although you wonder how much they would care about the life of one of them when you are surrounded by thousands.", parse);
	Text.NL();
	Text.Add("<i>“Release her,”</i> a crackling voice speaks from behind you. You turn and see a girl facing you, sitting on an enormous stump in the middle of the glade. You somehow managed to overlook her when your eyes had met those of the watching birds.", parse);
	Text.NL();
	Text.Add("She sits on the stump naked, leaning back on her arms, her posture relaxed, face turned toward the sky. Her small B-cup breasts are carelessly thrust toward you. Instead of hair, soft black feathers cascade from her head down to her shoulderblades, outlining her face. A tracery of feathers also runs from her shoulders, down her arms, and along her sides to her hips. Her fingers and toes end in sharp-looking talons.", parse);
	Text.NL();
	Text.Add("<i>“Now.”</i> Her throaty voice cracks, apparently unused to speech, but her intonation leaves no doubt that she expects to be obeyed.", parse);
	Text.Flush();
	
	//[Comply][Don’t]
	var options = new Array();
	options.push({ nameStr : "Comply",
		func : function() {
			Text.Clear();
			Text.Add("It cost you a lot of effort to catch the bird, but this seems for the best. As you release your hold, the raven’s claws dig into your hands as it... no, as she jumps up and takes wing with a croak of indignation. In a moment, you lose track of her among the multitude of her kin.", parse);
			Text.NL();
			Text.Add("The feathered girl turns her head toward you. Her eyes are pools of gray from edge to edge, black pupils examining you from top to bottom. <i>“Good. You show hints of promise.”</i>", parse);
			Text.NL();
			Text.Add("There are a few moments of silence as it becomes increasingly clear that she doesn’t intend to say anything more. You venture forward a little, and take a seat at the foot of the great stump. ", parse);
			
			Scenes.RavenMother.TheHuntGladeCont();
		}, enabled : true,
		tooltip : "Release the raven."
	});
	options.push({ nameStr : "Don’t",
		func : function() {
			Text.Clear();
			Text.Add("It cost you a lot of effort to catch the bird. You’re not going to letting it go this easily. You tell the girl that if she wants it back, she’ll have to explain what this is all about, and explain well.", parse);
			Text.NL();
			Text.Add("The feathered girl turns her head toward you, a small frown on her lips. <i>“You fail to understand,”</i> she says. You feel cool air brushing past your hands, where a moment earlier you held the squirming bird. The bird itself - at least you guess it’s the same one - flies low by your head, emitting an outraged croak before joining its kin. <i>“I only asked to see.”</i>", parse);
			Text.NL();
			Text.Add("To see what? There are a few moments of silence as it becomes increasingly clear that she doesn’t intend to say anything more. Well, at least she doesn’t seem angry with you, and it’s probably not that important. You venture forward a little, and take a seat at the foot of the great stump. ", parse);
			
			ravenmother.flags["KeptRaven"] = 1;
			
			Scenes.RavenMother.TheHuntGladeCont();
		}, enabled : true,
		tooltip : "Hold on to the raven. Maybe it could be useful as a hostage."
	});
	Gui.SetButtonsFromList(options);
}

Scenes.RavenMother.TheHuntGladeCont = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Add("Tentatively, you introduce yourself, telling the girl that you are called [playername].", parse);
	Text.NL();
	Text.Add("<i>“I have not found a use for names,”</i> she rasps. <i>“I care not what sounds you tie yourself with. I already know you.”</i>", parse);
	Text.NL();
	Text.Add("You wait a beat, but again there’s no follow up. Giving in, you ask whether there’s a name she’s called by.", parse);
	Text.NL();
	Text.Add("<i>“A name? No.”</i> There’s a pause, and you are opening your mouth to ask your next question, when the girl speaks again. <i>“I have seen some use a title, however. The Raven Mother. It fits well enough.”</i>", parse);
	Text.NL();
	Text.Add("Finally, with the huge conspiracy of birds watching, you gather your courage and ask the question you came here for. Why have the ravens been entering your dreams?", parse);
	Text.NL();
	Text.Add("<i>“I asked them to.”</i>", parse);
	Text.NL();
	Text.Add("And why did she ask?", parse);
	Text.NL();
	Text.Add("<i>“I wished to know the kind of person you are.”</i>", parse);
	Text.NL();
	Text.Add("This may be one of the more frustrating conversations you’ve ever had. The worst part is that it doesn’t feel like she’s being deliberately obtuse. Her face is open, and she seems to respond readily enough. If your guess is right, it’s more that she just doesn’t understand what you want from her.", parse);
	Text.Flush();
	
	//[Rephrase][Keep going]
	var options = new Array();
	options.push({ nameStr : "Rephrase",
		func : function() {
			Text.Clear();
			Text.Add("You take a few moments to phrase your question. Can you help me understand what information and reasoning led you to believe that it’s desirable to send ravens to observe my dreams?", parse);
			Text.NL();
			Text.Add("She tilts her head to the side curiously, and thinks for a few moments before finally replying. <i>“Yes.”</i>", parse);
			Text.NL();
			Text.Add("Well, looks like your question wasn’t quite there, but at least it came close. You ask her to please do so.", parse);
			Text.NL();
			Text.Add("<i>“Very well.”</i>", parse);
			Text.NL();
			Text.Add("She’s silent, and you wonder if she’s misunderstanding something, but taking another look, you realize she’s concentrating intently. Even your raven observers have gone silent on the trees, apparently expecting something.", parse);
			Text.NL();
			Text.Add("Finally, the Raven Mother waves her hand and a vision appears, overlaying the glade. The illusion is as clear as life at the center, and fades out to translucence at the edges. You feel a little disoriented, as beside the real Raven Mother, a duplicate now sits, and a copy of yourself stands beside you.", parse);
			Text.NL();
			Text.Add("Something’s different, though. The feathered girl is identical, and sits in the same way, but the vision you is not quite the same. It’s not a dream version, for one. In the dream, your clothing shimmers, never quite retaining a constant form, but in the vision the clothing looks more real, oddly enough. But there’s more - the appearance is off. You don’t look quite like that.", parse);
			Text.NL();
			Text.Add("<i>“This I saw,”</i> the real girl tells you. You can’t make out words, but somehow the vision conveys impressions to you, projecting emotions instead of sounds into your mind.", parse);
			Text.NL();
			Text.Add("You see yourself appeal desperately to the Raven Mother. You need something from her, and you need it now. It’s not something big, but it is something important. Something that can change the world.", parse);
			Text.NL();
			Text.Add("You can’t quite tell what <i>she</i> feels about all this in the vision. What you feel from her seems to twist and loop onto itself, overlapping, weaving, twisting. And all of it alien. There is a desire to feed, to observe, some sort of aversion, or maybe fear, some combination of protectiveness and anger, and a dozen other things you can’t quite discern.", parse);
			Text.NL();
			Text.Add("You glance away, rubbing your eyes, a tingling pain threatening to spill out in your head. How she can experience all that at once and stay sane is beyond you.", parse);
			Text.NL();
			Text.Add("While you’ve been looking aside, the vision has remained the same. The vision you argues and pleads, and the Raven Mother sits, listening impassively. Eventually, the vision fades, nothing having changed.", parse);
			Text.NL();
			Text.Add("<i>“In time, I will have to decide,”</i> the girl tells you when you look at her again.", parse);
			Text.NL();
			Text.Add("What do I ask for?", parse);
			Text.NL();
			Text.Add("<i>“I don’t know.”</i>", parse);
			Text.NL();
			Text.Add("So - you reason aloud - this is a vision of the future, and in it you come to her and ask for something. The girl doesn’t make any sign and you take that for assent. So she sent the ravens to spy on you to find out what kind of person you are, so she’d have a better idea whether to help you or not?", parse);
			Text.NL();
			Text.Add("<i>“That is so.”</i>", parse);
			Text.NL();
			Text.Add("Will she help you, then?", parse);
			
			Scenes.RavenMother.TheHuntTalk();
		}, enabled : player.Int() + player.Cha() > 50,
		tooltip : "Actually, now that you think about, there’s a better way to ask her."
	});
	options.push({ nameStr : "Keep going",
		func : function() {
			Text.Clear();
			Text.Add("Well, you’ll get there eventually. You ask why she needed to know what kind of person you are.", parse);
			Text.NL();
			Text.Add("<i>“To help me make a decision.”</i> There’s a hint of something like amusement in her voice. Maybe she’s actually caught on to what you want and just isn’t cooperating.", parse);
			Text.NL();
			Text.Add("And what is it that she’s going to be deciding?", parse);
			Text.NL();
			Text.Add("<i>“Whether I should help you.”</i>", parse);
			Text.NL();
			Text.Add("You blink in puzzlement. Why does she think you want her help? But first, help you with what?", parse);
			Text.NL();
			Text.Add("The Raven Mother tilts her head to the side, regarding you curiously. <i>“I don’t know.”</i>", parse);
			Text.NL();
			Text.Add("Then how does she know you want help?", parse);
			Text.NL();
			Text.Add("<i>“I’ve seen you ask me,”</i> she says.", parse);
			Text.NL();
			Text.Add("You exchange a few more questions and answers, and what you arrive at is that she saw you ask her at some point in time - you imagine in the future. She wasn’t sure whether she should help you or not, so she wanted to know more about you.", parse);
			Text.NL();
			Text.Add("You ask if she’s going to help you.", parse);
			
			Scenes.RavenMother.TheHuntTalk();
		}, enabled : true,
		tooltip : "It might take a while, but you’ll get to the bottom of this eventually."
	});
	Gui.SetButtonsFromList(options);
}

Scenes.RavenMother.TheHuntTalk = function() {
	var parse = {
		
	};
	
	Text.NL();
	Text.Add("<i>“I don’t know,”</i> she tells you. <i>“Come to me when the time is right and we will see.”</i>", parse);
	Text.NL();
	Text.Add("It seems like she’s told you everything she’s willing to tell about this. Maybe everything she can tell. It’s time to decide your next step.", parse);
	Text.Flush();
	
	var prompt = function() {
		//[Questions][Nah]
		var options = new Array();
		options.push({ nameStr : "Questions",
			func : function() {
				Scenes.RavenMother.TheHuntQuestions(prompt);
			}, enabled : true,
			tooltip : "There are a few things you want to ask her..."
		});
		options.push({ nameStr : "Ravens",
			func : function() {
				Scenes.RavenMother.RavenPrompt(prompt);
			}, enabled : true,
			tooltip : "Ask her to do something about the ravens."
		});
		options.push({ nameStr : "Leave",
			func : function() {
				Text.Clear();
				Text.Add("You rise to your feet, feeling a thousand stares follow your movement suspiciously. Your eyes meet the Raven Mother’s and you tell her that it’s time you went. If you are going to ask her for something, you don’t know what it is yet.", parse);
				Text.NL();
				Text.Add("<i>“Are you sure? There is much you have yet to learn. Many things to experience.”</i> She looks at you, and apparently concludes the decision is final. <i>“Go then. Know that you are welcome back. For now.”</i>", parse);
				Text.NL();
				parse["raven"] = ravenmother.flags["RBlock"] == 0 ? "since following the ravens again would be a lot of trouble" : "since following the ravens won’t be an option anymore";
				Text.Add("You hesitate for a moment and ask how to find your way back, [raven].", parse);
				Text.NL();
				Text.Add("<i>“The reason you could come here was not the raven. It was the <b>focus</b> you possess.”</i> You think for a moment and realize she must mean the gemstone. <i>“It protects you from the currents of this world. Simply use it again and think of this place, and you should be able to come.”</i>", parse);
				Text.NL();
				Text.Add("That was a bit vague, but you’ll probably be able to figure it out. You wave at the Raven Mother in farewell, and stand in place feeling foolish. How do you leave, exactly? You try to open your eyes, but they’re already open and simply go wider. You just end up looking startled for the ravens.", parse);
				Text.NL();
				Text.Add("Trying the feathered girl’s advice, you concentrate on the gemstone, and find that you can readily find its essence around you. You think at it that you want to return to your physical body, and to your surprise it listens. With an odd compressing sensation, you’re back. You feel your muscles stiff from disuse, blood pumping through your veins.", parse);
				Text.NL();
				Text.Add("You open your eyes, and the real world lies before you, somehow a little duller after your excursion in dreams. Well, at least you came back safe, and mostly figured out what’s going on. And you got out before you completely embarrassed yourself in front of the birds.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Scenes.RavenMother.theHuntWakeup(true);
				});
			}, enabled : true,
			tooltip : "It’s time to say your goodbyes and wake up."
		});
		
		Gui.SetButtonsFromList(options);
	}
	prompt();
}

Scenes.RavenMother.TheHuntQuestions = function(back) {
	var parse = {
		
	};
	
	//[Herself][Ravens][Dreams]
	var options = new Array();
	options.push({ nameStr : "Herself",
		func : function() {
			Text.Clear();
			Text.Add("You ask the Raven Mother what she is.", parse);
			Text.NL();
			Text.Add("<i>“I don’t know.”</i> Her voice sounds smoother and more confident than before - perhaps she’s getting more used to speaking. She pauses for a moment, closing her eyes meditatively. <i>“Even I don’t remember when I was born.”</i>", parse);
			Text.NL();
			Text.Add("<i>“There were more of my kind, once, but that was long ago. I can’t even remember what they were like. Like me, I suppose.”</i> Her face remains undisturbed while she speaks, even emotion apparently smoothed away by time.", parse);
			Text.NL();
			Text.Add("<i>“I’m a little like the ravens, I think.”</i> She looks up at the conspiracy observing you from the trees, her eyes lingering on their high perches. <i>“But there are more things different than the same even with them.”</i>", parse);
			Text.Flush();
			
			Scenes.RavenMother.TheHuntQuestions(back);
		}, enabled : true,
		tooltip : "Just what is she exactly?"
	});
	options.push({ nameStr : "Ravens",
		func : function() {
			Text.Clear();
			Text.Add("Feeling a little foolish, you ask the Raven Mother how she's connected to ravens.", parse);
			Text.NL();
			Text.Add("<i>“Do not be mistaken. I do not give birth to them,”</i> she says, smiling at you, her mouth full of small pointed teeth. <i>“Ravens existed long before I found them. Some tell me stories older than I am.”</i>", parse);
			Text.NL();
			Text.Add("<i>“But they did not exist in the realm of the World Tree. Some of them wanted to move, and I moved them here.”</i>", parse);
			Text.NL();
			Text.Add("Moved them how?", parse);
			Text.NL();
			Text.Add("She looks at you in puzzlement, and after a moment you find yourself sitting on the stump, closer to her. <i>“Moved them.”</i>", parse);
			Text.NL();
			Text.Add("<i>“So now they like me,”</i> she concludes.", parse);
			Text.NL();
			Text.Add("That was probably the most understated explanation you’ve heard in some time, but you think you get the gist of it.", parse);
			Text.Flush();
			
			Scenes.RavenMother.TheHuntQuestions(back);
		}, enabled : true,
		tooltip : "What's her connection to the ravens?"
	});
	options.push({ nameStr : "Dreams",
		func : function() {
			Text.Clear();
			Text.Add("You ask the Raven Mother if she’s has some special link to dreams. After all, she sent ravens to spy on you in dreams, and this meeting is taking place in a dream as well.", parse);
			Text.NL();
			Text.Add("She looks puzzled at first, then understands as you give your examples. <i>“Ah! That is what the word means. The soft side.”</i>", parse);
			Text.NL();
			Text.Add("Soft side?", parse);
			Text.NL();
			parse["mage"] = Scenes.Global.MagicStage1() ? "She must be a natural mage. Apparently capable of shaping the world with her will, even if it is ‘difficult’." : "She pauses for a moment to gather her thoughts.";
			Text.Add("<i>“Here, things are easy to change. On the hard side, it is difficult. Sometimes I forget which is which until I try,”</i> she confides. [mage] <i>“You are usually gone, and only come to the soft side sometimes. But I am always here.”</i>", parse);
			Text.NL();
			Text.Add("She is always sleeping?", parse);
			Text.NL();
			Text.Add("<i>“Sleeping?”</i> She waves the word aside. <i>“I am always here, but I am always on the hard side too. Right now, I’m eating a rabbit. Its warm flesh is delicious.”</i> She smiles a predatory smile, and you swear for a moment you see blood on her teeth.", parse);
			Text.Flush();
			
			Scenes.RavenMother.TheHuntQuestions(back);
		}, enabled : true,
		tooltip : "Does she have some special connection to dreams?"
	});
	Gui.SetButtonsFromList(options, true, back);
}

Scenes.RavenMother.RavenPrompt = function(back) {
	var parse = {};
	
	Text.Clear();
	
	if(ravenmother.flags["RBlock"] == 0)
		Text.Add("The ravens are currently watching your dreams.", parse);
	else
		Text.Add("The ravens are currently banned from watching your dreams.", parse);
	Text.Flush();
	
	//[Stop][Send them]
	var options = new Array();
	options.push({ nameStr : "Stop",
		func : function() {
			Text.Clear();
			Text.Add("The birds are really quite annoying. You tell the Raven Mother that she’s probably learned all she’s going to learn from your dreams by now, so she should stop sending her winged spies.", parse);
			Text.NL();
			Text.Add("<i>“But they have fun,”</i> she responds. She looks at you for a moment, and apparently deciding you won’t change your mind, bows her head in agreement. <i>“Very well, I will ask them to stay out of your dreams.”</i>", parse);
			Text.NL();
			Text.Add("Good. You’re pretty sure she’ll keep her word.", parse);
			Text.Flush();
			ravenmother.flags["RBlock"] = 1;
			Gui.NextPrompt(function() {
				Scenes.RavenMother.RavenPrompt(back);
			});
		}, enabled : ravenmother.flags["RBlock"] == 0,
		tooltip : "Ask her to stop sending ravens to watch your dreams."
	});
	options.push({ nameStr : "Send them",
		func : function() {
			Text.Clear();
			Text.Add("Somehow, your dreams feel a little better with the birds there. You tentatively explain that perhaps you wouldn’t mind seeing ravens in your dreams after all.", parse);
			Text.NL();
			Text.Add("<i>“That’s good,”</i> the Raven Mother says, smiling slightly. <i>“They told me your dreams are some of the most fun. I’ll tell them to visit you again.”</i>", parse);
			Text.NL();
			Text.Add("Well, sounds like you can look forward to receiving feathered visitors again.", parse);
			Text.Flush();
			ravenmother.flags["RBlock"] = 0;
			Gui.NextPrompt(function() {
				Scenes.RavenMother.RavenPrompt(back);
			});
		}, enabled : ravenmother.flags["RBlock"] != 0,
		tooltip : "Ask her to send ravens to your dreams again."
	});
	Gui.SetButtonsFromList(options, true, back);
}

