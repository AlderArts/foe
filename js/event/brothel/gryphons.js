

function Gryphons(storage) {
	Entity.call(this);
	
	this.flags["State"] = Gryphons.State.NotViewed;
	
	if(storage) this.FromStorage(storage);
}
Gryphons.prototype = new Entity();
Gryphons.prototype.constructor = Gryphons;

Gryphons.State = {
	NotViewed : 0,
	S1WorldsEdge : 1,
};

Gryphons.prototype.Cost = function() {
	return 200;
}
Gryphons.prototype.First = function() {
	return this.flags["State"] == Gryphons.State.NotViewed;
}


Gryphons.prototype.FromStorage = function(storage) {
	// Load flags
	this.LoadFlags(storage);
}

Gryphons.prototype.ToStorage = function() {
	var storage = {};
	
	this.SaveFlags(storage);
	
	return storage;
}

Scenes.Brothel.Gryphons = {};

Scenes.Brothel.Gryphons.IntroEntryPoint = function() {
	var parse = {
		armor : player.ArmorDesc(),
		skin : player.SkinDesc()
	};
	
	var choice = 0;
	var gender = Gender.male;
	
	var func = function(c, gen) {
		return function() {
			choice = c;
			gender = gen;
			Text.Clear();
			PrintDefaultOptions();
		}
	};
	
	Gui.Callstack.push(function() {
		Text.Add("Stripping out of your [armor], you secure it on the hook on the door, then turn your attention to the magic circle on the floor. Made to look as if it’d been gouged out of a stone slab by the claws of some powerful beast, it shimmers faintly as you step over the runes and into its center. Giving your naked form one last look-over, you close your eyes, steady yourself, and say <i>enter</i> as instructed.", parse);
		Text.NL();
		Text.Add("Your [skin] feels fluid and oily for a moment, oddly pliable…", parse);
		Text.NL();
		Text.Add("When you reopen your eyes, reflected in the mirror before you is the spitting image of a gryphon-morph.", parse);
		Text.NL();
		/*
		 * TODO ? 
#if PC is already a full gryphon-morph
Not that it changes too much about you, since you were already one, but the finer details of your body have changed a little to suit the fantasy.

		Text.Add("", parse);
		Text.NL();
#converge
		 */
		if(gender == Gender.male) {
			Text.Add("You are a male gryphon-morph, standing tall and proud; the tops of most people’s heads would barely reach your shoulders. While your body above your chest is covered in feathers of a dun brown color, your groin and legs bear the tawny golden fur of your leonine half, the two colors highlighted by the white streaks that run across your feathers. Hard, narrow eyes gaze back at you in the mirror, their irises such a dark brown that they’re almost black; a scar across your right eye completes your grim visage. A mane of deep brown hair falls from your head and ends between your white-tipped wings, slightly wild and unkempt, and you click your short, cruel beak in satisfaction.", parse);
			Text.NL();
			Text.Add("Battle, hunger and survival have turned your body hard and rugged, the muscles more for use rather than show; save for the bulging pecs needed to power your wide wings, your body is more lean than large. Your arms and hands are human-like, save for the small claws that cap each finger, while your feet are digitigrade feline paws with talons that click on hard surfaces. Extending from your tailbone is a long, leonine tail, the tufted end swaying to and fro idly.", parse);
			Text.NL();
			Text.Add("On your groin is a sheath that hides your cock, jet black and somewhere between ten and eleven inches long and two and a half inches thick - not counting the knot that lies near its base. Held tightly against your body by your scrotum are a pair of fist-sized testicles, and between your hard asscheeks, you have a virgin anus.", parse);
			Text.NL();
			Text.Add("All in all, you look hard, grim, commanding - perfectly suited for the role that you’re supposed to be playing out in this fantasy. There’s nothing left for it, now - taking a bold stride forward, you pass through the mirror’s surface, which accepts you with but a few ripples along its silvery surface.", parse);
		}
		else {
			Text.Add("You are a female gryphon-morph, sleek and swift; standing tall on your digitigrade stance, you’re perhaps a half-head taller than the average person on the streets of Rigard. Covered from chest to legs in luxurious silvery-grey fur, your head and shoulders are clothed in soft, white feathers and down; fur and feathers alike sport small dark speckles evenly interspersed amidst your fine coat. Your hair falls between your scythe-shaped wings and down your back, tickling the base of your leonine tail and causing your tufted tail-tip to twitch of its own accord.", parse);
			Text.NL();
			Text.Add("Gazing at yourself in the mirror, you note that your eyes are wide with dark pupils, gleaming orbs that drink in the world about them with a curious innocence. The beak that sits under them is short, hard and graced with a sharp tip, made for killing prey and tearing meat. With the talons that protrude from your feline feet and small claws that tip your human-like hands, your entire body is a weapon in and of itself - equally suited to destruction as it is to creation.", parse);
			Text.NL();
			Text.Add("Sitting on your chest, on the border of fur and feathers, is a pair of generous breasts, perhaps a large C-cup. Held high and firm by the underlying flight muscles, they look just made to be filled with warm goodness. While your nipples aren’t blatant enough to jut through your fur, there are two tiny peaks betraying their presence to all who would look closely. Past your sleek waist, you sport a set of motherly hips and a generous ass - but as inviting as they are, they can’t compare to the glimpse of your pussy between your thighs and just under your fur, its heat and puffiness advertising your prodigious fertility.", parse);
			Text.NL();
			Text.Add("All in all, you are as dangerous as you are alluring, perfectly suited for the role you’re intended to play in this chapter of the fantasy. Placing a hand on the mirror’s surface and watching the silvered glass ripple, you steady yourself and step through before you have second thoughts.", parse);
		}
		Text.NL();
		if(lucille.ThemeroomFirst()) {
			Text.Add("It’s a strange feeling stepping through the mirror. Like entering a pool, but without getting wet.", parse);
		}
		else {
			Text.Add("You’ll never get used to the feeling of stepping through the mirror…", parse);
		}
		lucille.flags["Theme"] |= Lucille.Themeroom.Gryphons;
		
		Gui.NextPrompt(function() {
			Scenes.Brothel.Gryphons.SceneSelect(choice);
		});
	});
	
	Text.Clear();
	
	//TODO
	var options = new Array();
	options.push({ nameStr : "World's Edge",
		tooltip : "",
		func : func(Gryphons.State.S1WorldsEdge, Gender.male), enabled : true
	});
	
	
	if(gryphons.First()) {
		Text.Add("Carefully closing and latching the door behind you, you take a moment to examine the room you’ve stepped into. It’s not very large - perhaps the size of two combined broom closets - and various pictures of mountain vistas and rolling valleys have been hung on the walls. In what is perhaps an attempt to try and fit the room’s theme, someone’s dragged in a small boulder for you to sit on if need be.", parse);
		Text.NL();
		Text.Add("The rest of the room is sparsely furnished; a hook on the door on which to hang your possessions, a full-body mirror, an elaborate magic circle set into the floor, and just beside the mirror’s frame, a small dial that appears to have various settings listed at an equal number of positions. Attempts to turn the dial fail - seems like you’re going to have to play out this story from the beginning.", parse);
		Text.NL();
		choice = Gryphons.State.S1WorldsEdge;
		
		PrintDefaultOptions();
	}
	else {
		Text.Add("The confines of this particular theme room are a familiar sight to you by now, and you know what to do once the door is closed and latched. The only choice you really need to make is which chapter to play.", parse);
		Text.Flush();
		Gui.SetButtonsFromList(options, false, null);
	}
}

Scenes.Brothel.Gryphons.SceneSelect = function(choice) {
	
	Gui.Callstack.push(function() {
		if(gryphons.flags["State"] < choice)
			gryphons.flags["State"] = choice;
		PrintDefaultOptions();
	});
	
	switch(choice) {
		default:
		case Grypons.State.S1WorldsEdge: Scenes.Brothel.Gryphons.WorldsEdge(); break;
		//TODO new scenes
	}
}

Scenes.Brothel.Gryphons.Outro = function(gender) {
	var parse = {
		
	};
	
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	var TFapplied = false;
	
	Text.Clear();
	Text.Add("As the illusion fades, you feel… odd, your gem pulsing with a strange light. A quick examination of yourself reveals that you have indeed changed, perhaps some effect of the mirror’s magic.", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	
	var func = function(obj) {
		scenes.AddEnc(function() {
			TFapplied = true;
			return _.isFunction(obj.tf) ? obj.tf() : "";
		}, obj.odds || 1, obj.cond);
	};
	
	
	//TODO TFS, use gender == Gender.male/female
	/*
	 * 
	func({
		tf: function() {
			var breasts = player.AllBreastRows();
			for(var i = 0; i < breasts.length; i++) {
				breasts[i].size.IncreaseStat(40, 2);
			}
			return "Your [breasts] feel a bit heavier. It seems like your [breasts] have increased in size.";
		},
		odds: 2,
		cond: function() { return player.SmallestBreasts().Size() < 40; }
	});
	 */
	
	var text = [];
	_.times(_.random(0, 3), function() {
		text.push(scenes.Get());
	});
	
	if(TFapplied) {
		_.each(text, function(t) {
			Text.Add(t, parse);
			Text.NL();
		});
	}
	else {
		Text.Add("Huh. You thought you’d changed, but after a thorough examination, it seems like you’re still your old self. It must be the disorienting effect of the mirror magic playing tricks on your mind…", parse);
		Text.NL();
	}
	
	Text.Add("Stretching your stiff limbs, you work the kinks out of your joints until you feel like you’re ready to head out into the real world once more. While you can’t have been out there for more than half an hour, it feels like much, much longer. Dressing yourself, you push open the door and leave the closet.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		world.TimeStep({hour: 3});
		Scenes.Lucille.WhoreAftermath(null, gryphons.Cost());
	});
}

//Chapter one - World’s Edge
Scenes.Brothel.Gryphons.WorldsEdge = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("The first thing that strikes you about your new surroundings is the air, crisp and fresh in your lungs, chilly and heavy as it runs through your fur and feathers. Gone are the stuffy confines of the room; instead, a vast expanse lies before you, land and sky stretching out in all directions. Mighty cliffs and crags thrust themselves out of the ground, snow-capped peaks rising up against the greenery of the lowlands.", parse);
	Text.NL();
	Text.Add("And before you, the valley. Lush and fertile, its abundance is laid out for you to see. From your perch, you can smell the distant tang of ripe fruit and fat game, of dark soil and gushing water. This is a good, unsullied place, and although there are other such valleys less than a day’s flight from this place, this particular one is the best.", parse);
	Text.NL();
	Text.Add("You know why you’ve come to this place, flown across plains and rode the winds through storm and lightning to get here. First, to escape the wyverns, those cruel raiders who have incessantly attacked your people. Though as quarrelsome amongst themselves as gryphons are, their love of plunder unites them in their raids on your mountainside homes. Where there is no plunder, they come anyway; they love to kill and eat as much as they love to steal. The tribes should have united against them, but getting two gryphon tribes to agree on anything is like herding cats; divided as they were, each one stood no chance against the marauding scaled hordes.", parse);
	Text.NL();
	Text.Add("There are not many of your kind left. The fact that the wyverns are likely to eventually turn on each other gives you little comfort, when you know they will only do so when the last gryphon is gone.", parse);
	Text.NL();
	Text.Add("A month ago, they came for your tribe. You fought as well as you could with spear, beak and claw - you have the scars to prove it - but it was scarcely enough. Where are the rest of your people, your aunts, uncles, cousins? They may live still, but to you, they are as good as dead. But here, across the strait, past the mountains, here is a place where the wyverns will not follow. Refuge, no matter how temporary it is, is welcomed by your weary body.", parse);
	Text.NL();
	Text.Add("The tribes fell because each one was small and divided. No… another attempt to unite the tribes by politics and negotiation would be folly; it has been tried time and time again, only to dissolve in dissent and squabbling. It is time to try a new approach.", parse);
	Text.NL();
	Text.Add("If no existing gryphon tribe is big enough to withstand the wyvern raiders, perhaps it would serve to <i>create</i> one. And since tribes are strictly familial… that brings you to the second reason why you are here in this valley:", parse);
	Text.NL();
	Text.Add("A mate.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("It has been four days since you caught her scent in the wind, two since you determined the direction of its origin. As you once stalked raiders, now you stalk your prey; you have yet to lay eyes on her, but the sweet, musky scent tells you all you need to know. Young, fertile, and most importantly, unclaimed by another male. The hows and whys are anyone’s guess - although there are now many more lone gryphons since the fall of the tribes - but the fact that she exists is enough to drive you on with a dogged single-mindedness.", parse);
		Text.NL();
		Text.Add("With that in mind, you descend to the valley floor, a short glide on your wings through the canopy and onto the forest undergrowth. The air is hot and muggy with moisture trapped in the valley; you stop a while to pick a fruit off a low bough and eat, doing your best to soothe your tired muscles and pick up the trail once more. If fortune smiles upon you, you’ll need all your strength soon. A more primal part of you rebels against making a meal of something as mundane as fruit and seeds. You should be hunting game - even though you no longer have so much as a loincloth to your name, a gryphon’s talons and beak should be enough to make a kill with.", parse);
		Text.NL();
		Text.Add("You silence that part of you with a snort. You control your instincts, not the other way around; the only time when they will run free is when you <i>let</i> them. There will be time enough for hunting and feasting later.", parse);
		Text.NL();
		Text.Add("Bit by bit, the fruit’s soft, sweet flesh and hard seeds disappear and you carefully bury the rind in the soft soil, not wishing to risk drawing undue attention. While the aches in your wings and limbs persist, you feel somewhat revitalized and press on. Even if you cannot sight your prey today, you still want to make good time before sundown.", parse);
		Text.NL();
		Text.Add("It doesn’t take you long to pick up the scent once more. It has teased and tormented you, invaded your dreams and fantasies with fancies of what its owner might look like… three nights ago, you woke to find your cock out of its sheath and your knot swollen, a large puddle of cum dampening your fur and feathers. You don’t remember the dream you had, but it must have been good.", parse);
		Text.NL();
		Text.Add("Over roots and under branches. Through the trees and out by the river. As the sun begins to sink towards the horizon, numerous glowbugs emerge from their hiding places near the water’s edge, lighting your way; your fatigue is forgotten as you follow the mysterious musk, blown downstream by the river’s movements. Hanging vines and woody lianas block your path, but they are a minor nuisance compared to your recent tribulations. Nevertheless, you offer up a short murmured prayer to the Sky Mother. The patron spirit of your kind is notoriously silent, but it can’t hurt to hope that she’s actually listening at the moment.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("How long have you traveled now? The sky is dark, the sun’s brilliance replaced by the moon’s softer light, and the river is beginning to narrow as one approaches the end of the valley. Your feet begin to ache, and you’re tempted to make camp for the night and get some much-needed rest.", parse);
			Text.NL();
			Text.Add("Your man-meat, though, has other ideas. With your elusive quarry so close - the lascivious scent of potential sex filling your nostrils and egging you on - you daren’t take the risk of letting her slip away. How much longer can this valley stretch?", parse);
			Text.NL();
			Text.Add("Just as you’re about to call it a day, you’re greeted by the roar of running water. A waterfall? Indeed, the jungle parts into a clearing occupied by a large, clear pool that feeds the valley river, in turn fed by a high waterfall that carries fresh snowmelt down from the high peaks. Glow bugs and luminescent water plants light up the pool with an unearthly yellowish-green light, and there, <i>there</i> by the foam and froth of the plunge pool, she sits.", parse);
			Text.NL();
			Text.Add("Even knowing that the only females you have ever seen are your mother, aunts and cousins, as well as the rare outsider from another tribe, you should have expected your quarry to be different. Nevertheless, nothing could have prepared you for the exotic beauty that bathes in the pool before your very eyes. Her fur and feathers are a silvery gray and pale white respectively, flecked with spots of deep black; her silvery-gray hair flowing like water as she washes it in the roaring waterfall. Her beak is short, solid and hook-tipped for tearing flesh, her eyes wide, bright and alert. This one is definitely a soarer, judging by the long, scythed shape of her wings; the way her muscles shift under her wet fur make your breath catch in your throat.", parse);
			Text.NL();
			Text.Add("You remember your mother’s words on the most important traits to look for in a potential mate: generous breasts for nourishing young, a narrow waist for quick conceiving, and wide hips for easy laying. She doesn’t merely meet those expectations, but surpasses them in all aspects - truly a solid foundation on which you will seed your new designs, a mother of a new people.", parse);
			Text.NL();
			Text.Add("The only way this one could have remained unclaimed is if there were no males around to do the honor.", parse);
			Text.NL();
			Text.Add("As if meaning to betray you, your cock stirs in its sheath, wanting to take this wondrous beauty here and now. Squeezing your eyes shut, you focus and push those lustful thoughts from your mind - you can entertain them <i>after</i> you’ve caught your prey. You may be a predator, but so is she; her lithe form and sharp beak and talons are enough proof of that. Seven wyvern horns you have taken in your name, but those trophies of battle are probably splinters and dust now, trampled underfoot by the raiders who took your tribe in turn. No, your past is nothing now; it is time to start anew.", parse);
			Text.NL();
			Text.Add("It seems almost a shame, to have to despoil such a beautiful figure of femininity, yet you cannot risk her not yielding to you. Does this make you any better than the wyvern raiders? Desperate times call for desperate measures; you are willing to bear this burden of sin if it will yield the promise of a future for your people.", parse);
			Text.NL();
			Text.Add("So be it. If necessary, you will give the accounting of your life to the Sky Mother at its end, and only she may judge you. Thusly resolved, you decide on the best approach to move in for the kill.", parse);
			Text.Flush();
			
			//[Undergrowth][Waterfall][Sky]
			var options = new Array();
			options.push({ nameStr : "Undergrowth",
				tooltip : "Move from the cover of vegetation, and strike when the time is right.",
				func : function() {
					Text.Clear();
					Text.Add("Yes… yes. That could work. The undergrowth is thick and will cover your approach; even after you leave the tree-line, reeds and rushes grow tall and thick, more than enough to hide your person. With the waterfall masking your scent, you will remain hidden so long as she does not catch sight of you.", parse);
					Text.NL();
					Text.Add("There is no time to lose, then. Sinking down to all fours like a primal beast, you tuck your wings in close to your body and slink through the grass and fallen leaves. Each step, each movement is carefully measured and soundless, your gaze fixed on your goal with a burning intensity. The cover of darkness wraps about you like a cloak as you pad forward, taking care to avoid the glowing plants and insects.", parse);
					Text.NL();
					Text.Add("All of a sudden, your quarry looks up from her bath, eyes wide and alert with worry. What have you done? Freezing in place, your breath no more than the slightest gasp, you eye her as she twists her head this way and that. No… you have done nothing. She is startled, her instincts trying to tell her something, but she cannot see, hear or scent you. Perhaps it is the intensity of your gaze, of your will, that has done this…", parse);
					Text.NL();
					Text.Add("Choosing to trust her senses over her instincts, your quarry calms down and returns to bathing herself, although she’s far more jumpy than before. Nevertheless, it gives you just enough time to slide noiselessly through the long reeds and get within range to pounce.", parse);
					Text.NL();
					Text.Add("She should have trusted her instincts. By the time she notices you, it is far too late - you have your hands on your prey’s shoulders and are pressing down on her with your weight.", parse);
					Text.NL();
					Scenes.Brothel.Gryphons.WorldsEdgeCaught();
				}, enabled : true
			});
			options.push({ nameStr : "Waterfall",
				tooltip : "Circle around to the water’s source and take the initiative from high ground.",
				func : function() {
					Text.Clear();
					Text.Add("You decide that a frontal approach is too risky and that it would be better to strike from where she thinks it’s safe. The cliff that the waterfall careens down may be high, but that means little to one capable of flight. Withdrawing from the water’s edge, you skirt around the clearing, making for the rise in the land; you don’t have to get up very high, just high enough to avoid notice. Ignoring the protests of your aching muscles, you dig your talons into the limestone wall and begin to climb.", parse);
					Text.NL();
					Text.Add("A quick glance down at your prey reveals that she’s still engrossed in cleaning herself; in an act of surprising flexibility, she’s stretched one of her wingtips up to her face such that she can preen the long, stiff flight feathers with her beak. As you watch, she finishes up with her wing and moves onto those powerful legs of hers, giving you just a glimpse of her snatch in the process.", parse);
					Text.NL();
					Text.Add("You shudder, and have to restrain yourself to avoid losing grip on your handhold. Clenching your beak tight, you press on upward with rekindled determination. After seeing that display, there is <i>no way</i> you’re not going to have it all for yourself and knot yourself well and deep inside her. Your cock twitches inside its sheath in agreement, and you shake your head to clear it before continuing your ascent. Finally, you spy a small perch by the water’s fall - a perfect place to spy on without being spied yourself. Easing yourself onto the ledge with precise balance, you squat and consider what you have to do next. Taking a deep breath to calm your thoughts and blood, you remind yourself that this time your aim is not to kill, but to merely subdue. She is not a meal or an enemy, but hope, and you do not wish to crush her… you need her mind and body whole and healthy for your aims.", parse);
					Text.NL();
					Text.Add("With that in mind, you leap, wings half-spread to slow your fall.", parse);
					Text.NL();
					Text.Add("Droplets of water spatter against your body as you cross the stream, become one with the roar of froth and foam in your descent. She notices the sudden thinning of the water’s flow, looks up wide-eyed - but it is far too late for her to escape. Already, you’ve turned your landing into a roll, roughly hooking one arm about her waist and throwing her off-balance, pinning her down with weight and muscle alike.", parse);
					Text.NL();
					Scenes.Brothel.Gryphons.WorldsEdgeCaught();
				}, enabled : true
			});
			options.push({ nameStr : "Sky",
				tooltip : "Soar high and dive for the pool, making the most of speed and surprise.",
				func : function() {
					Text.Clear();
					Text.Add("Looking around, you can’t find a path to your prey that you feel would adequately conceal your approach. While it is true that you are experienced in stalking and stealth, it will never do to underestimate your quarry, not when the crux of your plans hinges on your success here. If you fail here, who knows if you will ever be allowed a second chance, let alone one as wondrous as this…", parse);
					Text.NL();
					Text.Add("No, stealth is not going to be your chosen approach this time around. You have one more option: to strike hard and fast from the darkness, making up for lack of surprise with swiftness. Slowly, you withdraw to a safe distance from the water’s edge, then find the tallest tree you can to take flight from, leaping from bough to bough with agile grace.", parse);
					Text.NL();
					Text.Add("Taking off from a standing start is much, much harder than it would be had you a cliff to dive off or at least a running start, but mere flesh is not going to stop your burning resolve here. Though you're already fatigued, wings and chest crying out at being mistreated in such a manner, you will yourself aloft, rising above the treetops and into the night sky, with only the stars and moon as your companions.", parse);
					Text.NL();
					Text.Add("You wonder if the Sky Mother is watching you, and if so, what she must be thinking.", parse);
					Text.NL();
					Text.Add("The pool is still there, and so is your quarry, a faint speck of light far below. The winds tug at your feathers, caress your fur, and you take a split second to listen to what they have to say -", parse);
					Text.NL();
					Text.Add("- then pull yourself into a straight stoop. The air shrieks, gusts tear at your face, and you have to keep on reminding yourself, you do not intend to kill as you would do on an ordinary hunt, that this is no gazelle to end up spitted and roasted -", parse);
					Text.NL();
					Text.Add("You are screaming, you are howling, you are -", parse);
					Text.NL();
					Text.Add("- The winds -", parse);
					Text.NL();
					Text.Add("- The air -", parse);
					Text.NL();
					Text.Add("- The light -", parse);
					Text.NL();
					Text.Add("- Slowing just enough to catch her from under her arms and carry her aloft, letting your combined weight slow your landing. She shrieks in surprise and anger, a spray of cool water rising from the impact, the two of you skim the water’s surface before coming to an undignified stop amongst the lakeshore reeds. Before she can recover, you are upon her, pressing down upon her form with yours.", parse);
					Text.NL();
					Scenes.Brothel.Gryphons.WorldsEdgeCaught();
				}, enabled : true
			});
			Gui.SetButtonsFromList(options, false, null);
		});
	});
}

Scenes.Brothel.Gryphons.WorldsEdgeCaught = function() {
	var parse = {
		
	};
	
	Text.Add("Her gaze meets yours, and her eyes narrow in fury; she parts her beak to screech, and her enraged cry is beautiful death.", parse);
	Text.NL();
	Text.Add("You care for none of that.", parse);
	Text.NL();
	Text.Add("In a way, it is good that she has fight in her; now you know your sons and daughters will not be weak-willed cowards. The scent of a nubile, unclaimed female such as this one… it is beyond compare. Your body draws on wells of strength you never knew you had, your chest heaving and breath heavy, spilling from your beak and onto her face as the two of you struggle like beasts. She is sharp, her body well-formed and powerfully muscled, but she has not the knowledge nor the experience to wield it as you do; you’d wager that she’s never fought anything more than perhaps the occasional predatory beast that wandered into the valley. The finest spear in the hands of a child may as well be kindling.", parse);
	Text.NL();
	Text.Add("Still, she fights, biting with her beak, lashing out with her talons, hoping to catch you unawares. Pinned with her back to the ground, she nevertheless flaps her wings desperately, beating them against the ground as if trying to take flight. You do your best to restrain her without hurting her, subduing her thrashing limbs with your own.", parse);
	Text.NL();
	Text.Add("So close to you… warm flesh in your hands, pressed against your knees and shins. With every breath, her exotic scent fills your nostrils and lungs, and you can feel your man-meat pressing insistently against the insides of your sheath…", parse);
	Text.NL();
	Text.Add("You have to end this fast.", parse);
	Text.NL();
	Text.Add("<i>“Submit,”</i> you say.", parse);
	Text.NL();
	Text.Add("Perhaps she does not understand the meaning of the word, but she recognizes the tone with which it is said. Screaming defiance, she lashes out and catches you momentarily off-guard, claws raking the side of your head and drawing blood. In a flash, you have the offending hand seized with your own and pinned against the ground like the rest of her.", parse);
	Text.NL();
	Text.Add("<i>“Submit.”</i> Blood seeps into your feathers, drips down your beak; you test the warm liquid with your tongue, no stranger to the salty, coppery tang. Your eyes meet hers once more, an immovable stone cliff against a maelstrom of emotions. The winds batter and howl, lightning flashes and storm swirls, but your face remains cold and resolute. You have not tracked her this far, fought so hard, to be put off by a mere temper tantrum.", parse);
	Text.NL();
	Text.Add("Slowly, you spread your wings, casting a deep shadow over her.", parse);
	Text.NL();
	Text.Add("<i>“Submit,”</i> you say for the third and last time.", parse);
	Text.NL();
	Text.Add("Her eyes meet yours, but you do not move your gaze. Blood wells up on your chin, your feathers soaked with that rich, dark fluid, and begins to drip onto her chest between her generous breasts, creating a spreading rust-red patch on her white feathers.", parse);
	Text.NL();
	Text.Add("Something breaks behind those wide eyes, and she lets out a frightened chirp. Her body is still poised to fight, but is that so different from being ready to mate? Her eyes dart this way and that, seeking escape, but you keep a firm grip on her.", parse);
	Text.NL();
	Text.Add("<i>“S-submit,”</i> she mewls. Your quarry has been caught.", parse);
	Text.NL();
	Text.Add("Remembering the dirty tricks of wyverns, your body reflexively expects a surprise attack after you loosen your hold on her wrists, but no such thing comes. If your thoughts had been any clearer, perhaps you would have felt ashamed for expecting such from one of your kind, but here and now, all the beast in your mind wants is to claim your hard-fought prize.", parse);
	Text.NL();
	Text.Add("Already halfway out of its sheath, your cock throbs and twitches in anticipation; a hard thrust of your hips and its glistening length is fully extruded, glans, knot and all. Your body screams its desire to take her here and now on the bed of stone and mud, to fuck her senseless and fill her womb with your seed, but your father has trained you to be better than that. You’ll want to leave a good first impression, after all, if you’re going to make her want to stick around.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("A predatory - and perhaps lewd - gleam enters your eye as you inch up her body to straddle her waist with your legs, letting your raging, pre-oozing erection wave in her face, the tip of your glans just above her beak. You lean back a little to present it better to her, then reach down with both hands to gently knead her firm breasts. The full orbs fill your palms and then some; it’s a delight to finally have all that full, warm flesh in your hands and beneath your fingers.", parse);
		Text.NL();
		Text.Add("The effect is immediate. She has tormented you day and night with that alluring scent of hers; it’s now time for you to turn the tables. A needy wail escapes her beak as she takes in the entirety of your pulsing man-meat with wide, innocent eyes; has she never seen a cock before? No time for that; the first wail is soon joined by a second, far more urgent one as your fingers work their way up to her nipples, feeling them swell and stiffen while her body grows hot under yours. Wings beating, she squirms under your weight, her rich, feminine musk only intensifying; whether she understands it or not, her body knows what it wants and is preparing itself accordingly.", parse);
		Text.NL();
		Text.Add("Not that yours isn’t doing much the same, either. You can <i>feel</i> your balls churning in preparation for their inevitable release, growing slightly bigger even as the dribble of pre lubricating the length of your shaft grows into a trickle. Her breath grows heavy, her breasts heaving and jiggling slightly in your hands; deep breaths, deep breaths, taking in the scent of your cock, of sex…", parse);
		Text.NL();
		Text.Add("Father always swore by this; according to him, it’s how he convinced your mother to conceive you. Well, you’ve seen how well it works for yourself.", parse);
		Text.NL();
		Text.Add("A strangled squawk rises from her throat as her body convulses under yours, and she reaches up to give the length of your cock an experimental nip, a pinprick of sensation on your sensitive member. The ensuing rush of pressure within your member is intense, thick rough veins bulging against skin as it tries in vain to get even fuller than it already is.", parse);
		Text.NL();
		Text.Add("You can’t take much more of this, and by the looks of her vacant expression and pink, swollen pussy, slick and dripping with girl-cum, neither can she. It takes all your presence of mind to get up, pry her off her back, and force her on her hands and knees doggy-style, brushing aside her tufted tail to get a good view of her snatch from this angle. Without further ado, you grab hold of her hips - it’s easy to get ahold of them, they’re so wide and pleasant - rumble in satisfaction, and thrust.", parse);
		Text.NL();
		Text.Add("Here, by the roar of the waterfall, in the light of the moon and stars alike, you claim your first mate, your queen, the first step of your grand plan for the future of your people.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("She whimpers in pain as you take her virginity, then cries out once more as your knot slips past her entrance; the difference between the two only makes hilting her all the more satisfying. With a savage pull of the sort usually reserved for retrieving spearheads from wyvern corpses, you withdraw, then ram into her again, your balls slapping against her delightful asscheeks. Rough and undignified, perhaps, but you’ve never had a mate yourself either, not with all your cousins spoken for. There had been talk of an exchange between tribes, but… no, that is all past. Forget it.", parse);
			Text.NL();
			Text.Add("Here and now… fuck. Fuck, yes. You can <i>feel</i> your knot bulging, swelling; it takes more and more effort to pull out each time, until you can’t do it anymore, tied well and deep inside your new mate. That doesn’t stop you from pounding away like a frenzied rutting beast, releasing all the pent-up aggression and frustration that you’ve accumulated over the last few days in one fell swoop. The fur about your thighs and groin is sodden - sweat, cum, who cares - and you have to dig your fingers into her waist, seeking better purchase for your more… vigorous efforts.", parse);
			Text.NL();
			Text.Add("On her part, she responds with as much energy as you give. Her body knows what it wants, even if she doesn’t; she bucks her hips against you in rhythm with your thrusts, trying to take as much of you as she can inside of herself. Panting, her tongue lolling out of her beak and wings drooping, breasts swaying back and forth under her with her motions, your new mate has been greater heights.", parse);
			Text.NL();
			Text.Add("Growling, you push yourself further until you can feel your sheath grind against her wet lips, the tip of your cock pushing insistently against the entrance to her womb. Slowly, you coax her cervix into loosening, dilating just enough to admit your glans so you can spread your seed directly reduced to as much of a rutting animal as you are. Her inner walls, slick and slippery, press tightly against your cock, a snug and warm sleeve that only serves to spur your arousal to where it’s going to take root. The act is enough to send her over the edge, screaming and screeching breathlessly, claws and talons scrabbling against the ground for purchase even as her feminine honey seeps out onto the base of your shaft in great gouts.", parse);
			Text.NL();
			Text.Add("There isn’t much time left - you can feel an insistent pressure gathering at the base of your shaft, your balls churning and throbbing as they prepare to fill your new mate with your virile load. Shuddering, tingles rushing across your skin and through your muscles, you steady yourself against her and ram yourself one last time inside her with everything you’ve got.", parse);
			Text.NL();
			Text.Add("A final act to consummate the hunt.", parse);
			Text.NL();
			Text.Add("Still reeling from her last orgasm, she squawks weakly, a mixture of pleasure and protest. Fire flashes through your veins, ensuring that your body is ready - and then at last, sweet, sweet release. You breed your new mate and breed her good; spurt after spurt of your thick, gooey seed erupts from your shaft to settle into her thoroughly plowed fields. Your body’s clearly been saving up for this, for the flow of baby batter keeps on coming and coming, seemingly without end; each rope of cum that emerges from you is accompanied by a savage grunt or growl, your body doing its best to ensure the best chances of your seed taking hold in your new mate.", parse);
			Text.NL();
			Text.Add("For a moment, you worry that your cum is going to escape - considering the fullness of the load that’s being expelled - but your knot does its job and plugs her snatch nicely, preventing any of your virile treasure from escaping. Slowly, your new mate’s womb begins to swell and distend from all the baby batter that’s going into it, rounding out gently as if she were already pregnant and beginning to show.", parse);
			Text.NL();
			Text.Add("At last, it’s nearly over. With a final shudder that sends you to shaking all over, you squeeze a final rope of seed out of your shaft, and the flow ceases. Panting, shivering as the heat rises from your body, the mind-fogging haze of lust that obscures you from your fatigue and aches slowly begins to lift. As for her, you’ve quite literally fucked her senseless - though her ass and tail are still high in the air where you’ve knotted her, she’s practically collapsed in front, head on her feathered hands, unable to hold her arms straight. She pants and chirps weakly and deliriously; the moment your knot subsides enough to allow an exit, she slides off your slowly softening shaft and collapses to the ground with a whimper, a trickle of cum running down her thighs.", parse);
			Text.NL();
			Text.Add("She smells different now; although traces of her maiden musk still linger, they will soon blow away with the wind and be washed clean by the rain. Another male catching her new scent will know that he’ll have to get through you if he wants to claim her.", parse);
			Text.NL();
			Text.Add("Though you want little more than to join your mate in rapidly approaching slumber, with your new position come new responsibilities. The pool and its surroundings look safe enough; the light from the glowing water plants should dissuade any threats from harassing the both of you. Reaching down for some of the clear water, you splash it on yourself and your receding shaft in a bid to clean off the worst of the sticky mess that coats your fur and feathers; the cold snowmelt bites into your aches and pains, making them a little more bearable, but what you need is rest.", parse);
			Text.NL();
			Text.Add("At last, you’re satisfied that you’re relatively safe for now. With the waterfall’s roar to soothe your thoughts, you curl up with your new mate and wrap your feathered hands about her belly; she murmurs and wriggles in your grasp, but a gentle nip on her collarbone soon calms her. She feels so soft and warm, especially when contrasted with the cold clarity of the pool, and you rumble happily at the thought of being able to hold this exquisite, exotic beauty every night from now on.", parse);
			Text.NL();
			Text.Add("There will be tomorrow to deal with, but that can wait.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("Daylight beckons.", parse);
				Text.NL();
				Text.Add("A shaft of sunlight falls from the heavens, and the rainbow created by its passage through the waterfall’s mists is the first sight to meet your bleary eyes. Come to think of it, grandmother once told you that rainbows were supposed to be a sign of good luck, but you don’t think that this was the kind of rainbow she meant. Still, you’ll need all the luck you can get, and offer up a quick, silent prayer of thanks to the Sky Mother. First, for the previous night, and now for the sleek, warm shape that lies in your grasp.", parse);
				Text.NL();
				Text.Add("She’s awake, if not quite completely so; those dark, wide eyes of hers peer back at you from her half-turned head as she lies beside you, watching your every movement. The fact that she hasn’t tried to escape or kill you while you slept is probably a good sign, but she isn’t watching you with fear or anger, but rather… curiosity?", parse);
				Text.NL();
				Text.Add("Stretching the stiffness from your chest and wings, you release her and sit up, slowly sliding your hands free by running them through her silvery-grey fur. You note with a little satisfaction that it’s still splattered with patches of dried and drying cum from last night’s breeding, and wonder if the mating took. It doesn’t seem to bother her, but perhaps you should clean up the both of you in a bit.", parse);
				Text.NL();
				Text.Add("Well, time to try and introduce yourself properly…", parse);
				Text.Flush();
				
				Scenes.Brothel.Gryphons.WorldsEdgeQuestions({});
			});
		});
	});
}

Scenes.Brothel.Gryphons.WorldsEdgeQuestions = function(opts) {
	var parse = {
		
	};
	
	//[Name][Others][Land]
	var options = new Array();
	if(!opts.Name) {
		options.push({ nameStr : "Name",
			tooltip : "What’s her name?",
			func : function() {
				opts.Name = true;
				
				Text.Clear();
				Text.Add("She looks up blankly at your question, eyes as wide and inquiring as before, but makes no sound. You repeat your question again, slower this time, but she remains as silent as before.", parse);
				Text.NL();
				Text.Add("Does she have no name? That’s not right… does she even understand what a name is?", parse);
				Text.Flush();
				
				Scenes.Brothel.Gryphons.WorldsEdgeQuestions(opts);
			}, enabled : true
		});
	}
	if(!opts.Others) {
		options.push({ nameStr : "Others",
			tooltip : "Are there any other gryphons in this valley?",
			func : function() {
				opts.Others = true;
				
				Text.Clear();
				Text.Add("She furrows her brow at your question, then shakes her head. What’s that supposed to mean? That there aren’t any others of your kind here in the valley, or that she doesn’t understand your words?", parse);
				Text.Flush();
				
				Scenes.Brothel.Gryphons.WorldsEdgeQuestions(opts);
			}, enabled : true
		});
	}
	if(!opts.Land) {
		options.push({ nameStr : "Land",
			tooltip : "Is this her land? Her territory?",
			func : function() {
				opts.Land = true;
				
				Text.Clear();
				Text.Add("This seems to spark some recognition in her at least. She nods, then spreads an arm towards the pool and trees before lowering the gesture and gazing at you curiously. It’s more than you expected, perhaps, but still awfully vague. Why the reluctance to say anything?", parse);
				Text.Flush();
				
				Scenes.Brothel.Gryphons.WorldsEdgeQuestions(opts);
			}, enabled : true
		});
	}
	if(options.length > 0)
		Gui.SetButtonsFromList(options, false, null);
	else {
		Gui.NextPrompt(Scenes.Brothel.Gryphons.WorldsEdgeSexytimes);
	}
}

Scenes.Brothel.Gryphons.WorldsEdgeSexytimes = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("A cold knot forms in the pit of your stomach. If she’s so perfectly formed in every way, yet at the very last turns out to be a blank simpleton… doing your best not to let your panic show, you gently take hold of your new mate’s shoulders and ask if she can even speak. She can, right? You <i>heard</i> her last night!", parse);
	Text.NL();
	Text.Add("<i>“Speak… yes, can speak.”</i>", parse);
	Text.NL();
	Text.Add("You suppress the urge to heave a sigh of relief. Who taught her?", parse);
	Text.NL();
	Text.Add("<i>“Mother.”</i>", parse);
	Text.NL();
	Text.Add("And where is her mother?", parse);
	Text.NL();
	Text.Add("She flinches and turns away, unable to meet your stony gaze. <i>“Mother… go. Not come back. Long time.”</i>", parse);
	Text.NL();
	Text.Add("Well, that would explain her poor diction. It’s probably not the best idea to press her on the finer points of her past right now, but going a long time without anyone to talk to and perhaps not having learned to speak very well before her mother vanished… well. She’s not stupid; you’ll just have to add teaching her to talk properly on the list of things to do.", parse);
	Text.NL();
	Text.Add("Back to the point. You soften your tone a little, tousle her hair. If she doesn’t grasp the meaning of a name, then what did her mother call her?", parse);
	Text.NL();
	Text.Add("<i>“Mother calls…”</i> her brow furrows in concentration. <i>“Aurora. Name?”</i>", parse);
	Text.NL();
	Text.Add("Yes, that’s her name, you explain to her, taking care to emphasize each word; a name is what others call you. It isn’t one that’s familiar to you, though, neither your tribe nor the nearby ones used such a name.", parse);
	Text.NL();
	Text.Add("<i>“Name?”</i> she asks, pointing at you.", parse);
	Text.NL();
	Text.Add("You tell her. It was your grandfather’s name, and while it may be hard on the beak and tongue, you’re still proud of it.", parse);
	Text.NL();
	Text.Add("<i>“Et-hel-berd.”</i> She says it hesitantly, trying to enunciate the strange sounds with care. Aurora looks blank for a moment, clearly trying to marshal her thoughts. It makes her look so childlike, the way her thoughts are written on her face so unguardedly… <i>“Name.”</i>", parse);
	Text.NL();
	Text.Add("Yes, that’s your name; it’s what others call you. A twinge runs up your back, and you’re reminded of how sore you are. That and you’re not exactly clean yourself, either - the roar of the waterfall invades your consciousness, and your eyes wander over to foam and spray, a reminder that you really ought to wash the both of you. After that, you should really see to getting food -", parse);
	Text.NL();
	Text.Add("Something tickles the inside of your thigh, and you turn back to find Aurora on all fours and sniffing at your crotch, her beak almost touching your sheath. You can’t scent it yourself, no more than she can sense her own feminine musk, but her intentions - and curiosity - are clear. Firmly, and perhaps a little more roughly than strictly necessary, you cup her chin in your palm and lift her head out of there. Sure, you’re more than willing to give it to her if she likes it so much, but now’s not the time for that.", parse);
	Text.NL();
	Text.Add("<i>“Thing. Not there?”</i>", parse);
	Text.NL();
	Text.Add("Hah. Fine. <i>Maybe</i> you’ll indulge her just a little, as a reward for being such an obedient girl thus far. Reaching down with two fingers, you spread your sheath just far enough for her to glimpse the tip of your shaft nestled inside, then shake your head and sigh as her gaze travels between your cock and balls. You know the answer - it’s painfully obvious, if the only other of her kind she’s known is her mother - but the question still has to be asked. Letting go of your sheath, you lean in close enough to Aurora so that she can’t evade your gaze, and ask her if you’re the first male she’s ever seen, or if she even understands what a male is.", parse);
	Text.NL();
	Text.Add("She squirms uncomfortably at the intensity of your presence, and yet the desperation to understand and anger at her ignorance is written not just in her eyes, but the sudden change in the way she carries herself. Deciding to spare her the agony of asking, you think back to all the talks both your father and mother had with you about the importance of choosing a proper wife and begin…", parse);
	Text.NL();
	Text.Add("…By the time you’re done, Aurora is staring at you. Now that’s a curious look, and seeing it plastered all over her face without any attempt at restraint is more than a little amusing. You’re not sure that she’s grasped all of what you’ve tried to convey, but she’s certainly understood enough to be bashful about it.", parse);
	Text.NL();
	Text.Add("<i>“What mate?”</i>", parse);
	Text.NL();
	Text.Add("You explain that it was what you did to her last night. It was something that all creatures know, although some need a little more help than others. Did she like it?", parse);
	Text.NL();
	Text.Add("<i>“Yes. Yes. It is like… learning to fly. Pain at first. And then…”</i> Aurora’s gaze turns dreamy as her voice trails off.", parse);
	Text.NL();
	Text.Add("Well, you note to yourself with a little amusement, that’s probably why she didn’t try to sneak off or kill you in your sleep. Now that the formalities are done with, it’s time to get cleaned up before the sun gets too high.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("The water is colder than you remember it being, gushing down the cliff and over the rocks before crashing down into the pool. Snowmelt brought in from the peaks, far different from the muddy watering holes of your ancestral lands - the pool is deep, clear and refreshing.", parse);
		Text.NL();
		Text.Add("Aurora has no problem with the water’s chill, and looking at the way her wet fur and feathers stick to her curves, her nipples stiff with the cold, and most importantly, the gentle bulge on her once-flat belly where your freshly spent seed resides - come to think of it, you suddenly don’t feel that cold anymore. She glides gracefully into the water, dunking her head under the surface, and comes up again with a loud gasp.", parse);
		Text.NL();
		Text.Add("What a delightfully wild little thing. You’re content to lean back and soak for a moment, watching her scrub away the worst of last night’s excess from her body, noting the muscles in her arms and back flex and shift with sinuous grace. The flowing water runs through your fur and feathers, carrying away the dirt and weariness of travel and leaving you calm and refreshed.", parse);
		Text.NL();
		Text.Add("Almost as if your body’s taken on a life of its own, you find yourself wading out from the shallows towards her, into the mist and spray of the waterfall. Aurora’s eyes flick open when your arm snakes around her midriff, but soon sink closed with a gentle chirp as your free hand reaches for that spot between her wings and begins to scrub away. Nothing blatant, nothing overtly sexual, just a good washing in those hard-to-reach areas which make one very grateful that someone else is around to help. After all, you’ll have to show her how it’s done if you want her to reciprocate the favor.", parse);
		Text.NL();
		Text.Add("Well, you linger a little longer than strictly necessary about her inner thighs, but don’t go any further.", parse);
		Text.NL();
		Text.Add("Her shoulders, her back, the thin layer of fat just under her skin and on her muscle - compared to last night’s savage mating, this is slow, soothing, subtle. She reaches for your legs, but you gently slap her hands away - she can wait until you’re done if she wants a go.", parse);
		Text.NL();
		Text.Add("Lowering your voice to a whisper, you ask if it isn’t very nice to have someone else to wash your back for you. She hums in the back of her throat, a soft, joyous sound, and that’s all the answer you need. You run your claws run through Aurora’s fur and feathers, loosening tangles and savoring the touch of warm flesh contrasted against cold water.", parse);
		Text.NL();
		Text.Add("Eventually, you’re done, and help her up onto a rock jutting out from the water’s surface. Yes, she cleans up pretty, but you already knew that.", parse);
		Text.NL();
		Text.Add("<i>“Clean?”</i> Aurora asks, wide-eyed and eager to please.", parse);
		Text.NL();
		Text.Add("Stretching out face-down in the rocky shallows, you give her question a half-hearted, dismissive wave of a hand, and she begins, getting down on all fours to better clean you. Aurora’s claws dig a little too deeply into your back as she scrubs away and grooms your fur, but you can tell that she’s doing her best to imitate your motions. Half-wild as she is, you can’t expect her to get it right on her first try, can you? Folding your wings against your back, tail swishing about in the shallows, you recline in as dignified a position as you can and settle down to enjoy the sensation of letting her wash you. It’s endearing, the way she tests the firmness of your muscles with her fingertips or tries to get a better handle on your scent when she thinks you’re not paying attention.", parse);
		Text.NL();
		Text.Add("The next time she gently pinches your shoulder, you reach out and grab her thumb and forefinger with your own. Not enough to cause discomfort, but just enough to inform her that you know. Aurora chirps, the undertones of her voice betraying her embarrassment at being caught out, and you sit up and give her a pat on the head.", parse);
		Text.NL();
		Text.Add("Even if she can’t speak well, it doesn’t matter. No words were needed, anyway.", parse);
		Text.NL();
		Text.Add("She slinks around you, and a gentle nibble at your wings draws your attention - Aurora is preening your wings, the tip of her beak searching amidst long flight feathers and setting right the misplaced ones. The pinpricks of touch at her gentle nibbling on sensitive skin and bone sends shivers running along the length of your spine; there’s a reason why flying is considered such an enjoyable activity, and another as to why only mates and mothers preen wings this way. You’d hoped to take this a little slow, to gradually introduce her to your expectations, but it seems her instincts have led her thus far.", parse);
		Text.NL();
		Text.Add("Still, you feign disinterest at Aurora’s tender ministrations, acting as if what she’s doing is only expected of her and no more; it takes a considerable effort to not focus on how satisfying it feels to have another of your kind by your side, let alone to bathe with. It’s been too long…", parse);
		Text.NL();
		Text.Add("How long has it been, exactly? More than two months, less than a season. The days and nights blended together, first out of rage, later from determination, then at the very last, from lust.", parse);
		Text.NL();
		Text.Add("And now…", parse);
		Text.NL();
		Text.Add("Tail swishing lazily, you ease yourself onto your feet and announce that you’re done, striding past Aurora with renewed strength and determination. With a leap, you dive into the pool and are barreling through the water as if you were flying, schools of tiny fish scattering from the ferocity of your passage. The sudden chill tears at your feathers, your skin, and the air is exquisite when you come up for breath.", parse);
		Text.NL();
		Text.Add("Emerging from the pool, water cascading off your naked form, you stretch your entire body from head to toe, fully aware that Aurora is watching you intently. The aches have dissolved, the hurts - both within and without - gone. For the first time in a long while, you feel… feel… what’s the word for it?", parse);
		Text.NL();
		Text.Add("Hopeful? Happy? Powerful? No, those fail to capture the fullness of what you’re feeling right now. You feel like you could face an onslaught of marauding wyverns and emerge victorious on a mountain of their corpses, you could soar to the stars and bring them down with a flick of your wrist, could level mountains and fill in valleys. Who cares about words? Your new mate seems to have survived well enough without needing to articulate her every thought. The fact that you feel, and more importantly, <i>know</i> it is enough; the next step is to channel that energy towards reshaping the world around you and making it more to your liking.", parse);
		Text.NL();
		Text.Add("Gently but firmly, you catch Aurora by the arm and help her to her feet, water dripping from her legs and hindquarters as she rises from the pool. Your blood still hasn’t washed off her chest feathers yet, leaving a rust-brown stain on the snowy white, but maybe it’ll do her some good to have that mark for a little longer. In any case, this valley is a good place. Together, the two of you will build a home.", parse);
		Text.NL();
		Text.Add("She looks confused by your words. <i>“Home? Already live here.”</i>", parse);
		Text.NL();
		Text.Add("You laugh, a loud, screeching sound that echoes off the waterfall cliff. No, not home. <i>A</i> home. She’ll understand in due time.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Scenes.Brothel.Gryphons.Outro(Gender.male);
		});
	});
}

