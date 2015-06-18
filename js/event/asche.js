/*
 * 
 * Define Asche
 * 
 */

Scenes.Asche = {};

function Asche(storage) {
	Entity.call(this);
	
	// Character stats
	this.name = "Asche";
	
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 6;
	this.body.SetRace(Race.Jackal);
	
	this.FirstVag().virgin = false;
	this.Butt().virgin = false;
	
	this.flags["Met"]   = Asche.Met.NotMet;
	this.flags["Talk"]  = 0; //Bitmask
	this.flags["Magic"] = 0;
	this.flags["Tasks"] = 0; //Bitmask
	
	if(storage) this.FromStorage(storage);
}
Asche.prototype = new Entity();
Asche.prototype.constructor = Asche;

Asche.FortuneCost = function() {
	return 10;
}

Asche.Met = {
	NotMet : 0,
	Met    : 1
};
Asche.Talk = {
	Shop    : 1,
	Herself : 2,
	Sister  : 4,
	Stock   : 8
};
Asche.Magic = {
	Components : 1,
	Rituals    : 2
};
Asche.Tasks = {
	Ginseng_Started : 1,
	Ginseng_Failed : 2,
	Ginseng_Succeeded : 4,
	Ginseng_Finished : 8,
	Nightshade_Started  : 16,
	Nightshade_Aquilius : 32,
	Nightshade_Succeeed : 64,
	Nightshade_Finished : 128
};

Asche.prototype.Update = function(step) {
	
}

Asche.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	this.body.FromStorage(storage.body);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
}

Asche.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	this.SaveBodyPartial(storage, {ass: true, vag: true});
	
	this.SaveFlags(storage);
	this.SaveSexFlags(storage);
	
	return storage;
}

Scenes.Asche.FirstEntry = function() {
	var parse = {
		heshe : player.mfFem("he","she"),
		handsomepretty : player.mfFem("handsome", "pretty")
	};
	
	asche.flags["Met"] = Asche.Met.Met;
	
	Text.Clear();
	Text.Add("A gentle jingle of chimes greets you as you push open the hardwood door, followed by a strong, heady aroma of incense that’s practically overpowering. Still, you forge ahead into the small store, and are greeted by the proprietor behind the counter, a jackal-morph of slender build. Her large ears perk up as she sees you, and she adjusts her clothing - an exotic-looking garment consisting of a white drape, mostly wrapped about her waist and with one end hung loosely over a shoulder, baring her furry midriff. Her dark eyes look as if she’s gone way overboard with the eyeliner and shadow, and she’s adorned from head to toe in jewellery - some of it tasteful, but most of it absolutely tacky, with bangles, earrings, and all.", parse);
	Text.NL();
	Text.Add("<i>“Asche welcomes you to her store, new customer,”</i> she says, flashing you a toothy canine grin. <i>“You have a strange aura about you that Asche cannot quite place. Perhaps you have come seeking a solution to one of your problems? Asche’s shop is here to solve problems for customers, yes.”</i>", parse);
	Text.NL();
	Text.Add("Asche? Who… oh, right, that must be her, she’s referring to herself in the third person; that <i>is</i> an unconventional manner of speech. No, you just saw the store and thought it interesting, so you came in to browse. Something like that, anyway.", parse);
	Text.NL();
	Text.Add("<i>“Ah, carried in by the winds of fate! Even better, then!”</i>", parse);
	Text.NL();
	Text.Add("So… what exactly does she sell here? Looking around you, you kind of have an idea, but it’s best to ask anyway.", parse);
	Text.NL();
	Text.Add("<i>“Customer wants to know what Asche sells? Anything and everything, so long as it bears some relation to the magical.”</i> The jackaless waggles her fingers. <i>“Truly, that is making for some degree of clutter, but it makes better chances that customer who comes in will be able to find something to buy, yes?</i>", parse);
	Text.NL();
	Text.Add("<i>“Asche has for sale some books, trinkets, staves - and of course, clothes to match.”</i> She gestures at the shelves, then at herself. <i>“Is very important to not just stay in style, but also character. Customers expect certain appearances when they are coming in, and Asche hopes to please; in same way, people are expecting certain things of magic workers.</i>", parse);
	Text.NL();
	Text.Add("<i>“Other things that Asche has in stock are potions for many ailments - when those who are too poor to see healers get sick, they come to Asche, for she has very reasonable prices and effective cures. Not for sale are things that transform others - Asche has enough problems with guards that she does not need to be giving them more reason to be knocking on her door.</i>", parse);
	Text.NL();
	Text.Add("<i>“Finally, Asche can also do some things for you, although not things [handsomepretty] customer may be having in mind.”</i> She winks at you slyly. <i>“For example, Asche is very skilled in the art of fortune-telling, and can read your palm for a few coins. No crystal balls for this jackaless, yes.”</i>", parse);
	Text.NL();
	Text.Add("Well, that’s certainly a bit to digest all at once.", parse);
	Text.NL();
	Text.Add("<i>“World of magic is very wide and varied, both in good and evil, so long-winded tale is only to be expected. If good customer has questions about any of the merchandise, [heshe] should not hesitate to ask Asche for details. Safe customer is happy customer is repeat customer.”</i> With that, she gives you one last canine smile and turns back to her own devices.", parse);
	Text.Flush();
	Gui.NextPrompt();
}

Scenes.Asche.Prompt = function() {
	var parse = {
		handsomepretty : player.mfFem("handsome", "pretty"),
		heshe: player.mfFem("he", "she"),
		hisher: player.mfFem("his", "her"),
		himher: player.mfFem("him", "her")
	};
	
	var options = new Array();
	options.push({ nameStr : "Appearance",
		tooltip : "Study the jackal-morph.",
		func : Scenes.Asche.Appearance,
		enabled : true
	});
	options.push({ nameStr : "Talk",
		tooltip : "Chat up Asche.",
		func : function() {
			Text.Clear();
			Text.Add("Asche looks around the her shop for a bit, craning her neck this way and that. Once the jackaless is content that business isn’t too brisk to prevent a bit of chit-chat, she lounges on the counter with all the nonchalance of a lazy cat and smiles at you.", parse);
			Text.NL();
			Text.Add("<i>“Well, it seems like Asche has a little time for making small talk with [handsomepretty] customer like you. Maybe call it customer relations? Maybe with enough luck, can be called customer service, too.”</i> She chuckles at her own joke. <i>“Well, what does good customer wish to gossip about?”</i>", parse);
			Text.Flush();
			
			Scenes.Asche.TalkPrompt();
		}, enabled : true
	});
	options.push({ nameStr : "Buy",
		tooltip : "Ask to see her wares.",
		func : function() {
			Text.Clear();
			Text.Add("The jackaless nods and beams at you. <i>“Asche is happy to be able to service customer! Please to be browsing, perusing, going through. If customer is finding anything to [hisher] liking, then is but small matter of money to be bringing it away with [himher].”</i>", parse);
			
			rigard.MagicShop.Buy(function() {
				Text.Clear();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>“Oh? There is being nothing here that is interesting customer?”</i> Heaving a small sigh, Asche shrugs and spreads her hands, palms upward. <i>“Well, it is being what it is, so maybe customer should be looking at something else?”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("Licking her muzzle, Asche proceeds to smack her lips. <i>“Eh? Nothing is catching customer’s eye? Is not big problem, Asche would rather have customer be buying useful thing rather than just buying for the sake of making Asche happy. This jackaless is not so hard up that she is needing others to be buying everything she is putting on the shelves.”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Is pity that customer is not fancying anything right now, but maybe [heshe] has not come across right item yet,”</i> Asche says as she puts her goods away. <i>“Is not big deal, anyway - these days Asche is doing this more for practice and amusement than actually needing to feed her face. To be coming again another time, when she has different things?”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.Get();
				
				Text.Flush();
				Scenes.Asche.Prompt();
			}, true);
		}, enabled : true
	});
	options.push({ nameStr : "Sell",
		tooltip : "Get rid of some of your surplus.",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Customer is wanting to sell something to Asche?”</i> The jackaless rubs her hands together, a movement accompanied by the clinking of bangles. <i>“Let Asche see item, and she will tell you how much she thinks she will buy it for.”</i>", parse);
			
			rigard.MagicShop.Sell(function() {
				Text.Clear();
				Text.Add("<i>“Customer come back to Asche if [heshe] wants to sell things, yes?”</i>", parse);
				Text.Flush();
				Scenes.Asche.Prompt();
			}, true);
		}, enabled : true
	});
	options.push({ nameStr : "Fortune Telling",
		tooltip : "Ask Asche to see what the future has in store for you.",
		func : function() {
			Text.Clear();
			parse["coin"] = Text.NumToText(Asche.FortuneCost());
			Text.Add("<i>Ah, you are wanting Asche to be divining what future holds for you?”</i> the jackaless says with a smirk and wink. <i>“Can be done, for the price of [coin] coins.”</i>", parse);
			Text.Flush();
			
			Scenes.Asche.FortuneTellingPrompt();
		}, enabled : true
	});
	options.push({ nameStr : "Sex",
		tooltip : "Propose a romp in the hay with the exotic shopkeeper.",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Mm…”</i> Asche licks her muzzle, then leans up close to you. Nonchalantly, she cups her breasts, one in each hand, then pushes her lady lumps forward such that the hand-filling mounds seem even bigger and fuller than they already are - you can practically see them through the fabric of her sari. Making sure you’re looking, the jackaless begins kneading gently, a small whine escaping her muzzle before she stops and grins at you. <i>“Asche thinks… not. Asche is a good girl, a nice girl, and does not give freebies to get others hooked, unlike her big sister.”</i>", parse);
			Text.NL();
			Text.Add("She’s such a tease.", parse);
			Text.NL();
			Text.Add("<i>“Is merely practical,”</i> the jackaless replies. <i>“Customers are buying more when they are being served by pretty girl; bad hair day for Asche means bad business day, too. But sometimes they are getting ahead of themselves, [handsomepretty] customer is not the first one to have invited Asche to the back room.</i>", parse);
			Text.NL();
			Text.Add("<i>“Nevertheless, if customer is determined… maybe there may come a time when there are things [heshe] can do that may make Asche change her mind,”</i> she adds with a wink.", parse);
			Text.Flush();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("<i>“Bye bye now,”</i> Asche says, flicking a softly-furred ear in your direction. <i>“Asche is hoping that customer is being in one piece when [heshe] is next returning to her shop… but if not, there are things she has which can be solving that little problem, too…”</i>", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("Asche glances up at you as you move towards the door. <i>“Asche is wishing you good health until you next return, customer. Is very easy to be not feeling well while out there, so to be coming back if you have need of her potions.”</i>", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("As you make for the door, you hear Asche chuckle behind you, the jackaless’ soft voice more than a little disquieting. <i>“So, does brave customer possess the courage to move on and face [hisher] fateful fate? Or will the sound of [hisher] screams mark the end of [hisher] adventure? This jackaless would offer customer escape, but even her shop is probably not enough to stand against the powers that are hunting customer…to be staying safe until next return.”</i>", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>“Asche is saying farewell to you, customer,”</i> the jackaless says, stifling a yawn as her gaze follows you to the door. <i>“When being out there, customer is to be remembering: everything is having its price, even if not visible all at once…”</i>", parse);
		}, 1.0, function() { return true; });
		scenes.Get();

		Text.Flush();
		Gui.NextPrompt();
	});
}

Scenes.Asche.Appearance = function() {
	var parse = {
		handsomepretty : player.mfFem("handsome", "pretty")
	};
	
	Text.Clear();
	Text.Add("Asche is a lusciously full-bodied jackal-morph, her limbs and figure slender, her chest and hips exotically full. Clothed in a pure white sari that exposes her midriff’s soft deep golden-brown fur, the jackaless is quite the sight to behold. Large, pointy ears peek out from the hood of her snow-white shawl, constantly alert and swivelling this way and that. Stray strands of dirty blond hair streaked with black gather around her chin and shoulders as she levels her narrow, dark eyes at you.", parse);
	Text.NL();
	Text.Add("Illuminated by the crystal lamp on the counter, the jackaless’ fur looks absolutely soft and strokable, lustrous, and appropriately mystical. To say it’s practically spun gold wouldn’t be too far off the mark - Asche clearly puts a lot of work into ensuring she’s presentable for her clientele. A faint scent of jasmine hangs about her person, alluring and exotic.", parse);
	Text.NL();
	Text.Add("True to her customers’ expectations, Asche wears far too much makeup - particularly in the eyeshadow and liner department - and has adorned herself with gold and silver jewellery to the point that she clinks and clanks when she moves. Bangles line her wrists and ankles, numerous small rings have been set into her large ears, and there’s even an exquisite chain of gold filigree resting on her hips, tiny shards of topaz and amber worked into some of the links.", parse);
	Text.NL();
	Text.Add("<i>“Is [handsomepretty] customer done admiring Asche?”</i> she asks slyly, her muzzle splitting in a canine grin even as her long, fluffy tail begins wagging eagerly. <i>“Asche loves to feel treasured, yes yes, but even though she is magical, she is not for sale.”</i>", parse);
	Text.Flush();
}

Scenes.Asche.TalkPrompt = function() {
	var parse = {
		handsomepretty : player.mfFem("handsome", "pretty"),
		heshe: player.mfFem("he", "she"),
		hisher: player.mfFem("his", "her"),
		himher : player.mfFem("him", "her")
	};
	
	//[Shop][Magic][Herself][Sister][Stock][Tasks][Back]
	var options = new Array();
	options.push({ nameStr : "Shop",
		tooltip : "That’s a nice shop she has there.",
		func : function() {
			Text.Clear();
			Text.Add("The shop’s a pretty nice place, you mention, looking around. It definitely has that feel that one gets when entering one of those tiny antique shops, or perhaps an old bookstore - the kind in which forgotten treasures are found, treasures which have entire stories revolving about them.", parse);
			Text.NL();
			Text.Add("Asche beams. <i>“Did not happen by accident, Asche spent years cultivating atmosphere, you know. Was not very good at first, customers would come in, take a look, then go; long time getting the jasmine scent correct, to help customers be at ease while not sending them to sleeping or driving them away.”</i>", parse);
			Text.NL();
			Text.Add("Years, huh. Just how long has she had the shop?", parse);
			Text.NL();
			Text.Add("<i>“Oh, long, long time. As you can guess, Asche is older than she looks, yes?”</i> The jackaless’ muzzle parts in a sly smile, her tail wagging back and forth even more vigorously now. <i>“Maybe not by so much by way some are reckoning time, but she is not afraid to admit it. Lying to oneself is quick way to meet sticky end in her line of work.</i>", parse);
			Text.NL();
			Text.Add("<i>“But since you are wanting to know… if you are asking old man in streets how long Asche’s shop has been around, then he will remember it being there as a small boy. Owner was also jackaless named Asche, but the one running shop today must be her daughter, also named Asche… no one is young forever, right?”</i>", parse);
			Text.NL();
			Text.Add("So… is she <i>really</i> that old, or is she the daughter of the former proprietor? Or maybe she really isn’t a jackal-morph and something else masquerading as one? The possibilities are endless!", parse);
			Text.NL();
			Text.Add("The jackaless raises a finger to her lips. <i>“I cannot be so easily telling that. Is part of shop’s mystique, and am afraid much of it would be gone if you are knowing answer. Maybe nice customer can be earning knowledge of that later on, maybe not.</i>", parse);
			Text.NL();
			Text.Add("<i>“But all customer needs to be knowing is that Asche is here running her shop, selling safe solutions to customers’ problems. That is all that is really needed, yes?”</i>", parse);
			Text.NL();
			Text.Add("Well, from a business standpoint, you suppose it is. From a more personal point of view, though, it’s hardly enough. Nevertheless, it’s probably not good to press her for too much in one go…", parse);
			Text.Flush();
			
			asche.flags["Talk"] |= Asche.Talk.Shop;
			
			Scenes.Asche.TalkPrompt();
		}, enabled : true
	});
	options.push({ nameStr : "Magic",
		tooltip : "Discuss Asche’s particular brand of magic with her.",
		func : function() {
			Text.Clear();
			// Lesson one - Components
			if(asche.flags["Magic"] < Asche.Magic.Components) {
				Text.Add("You’d like to discuss the nature of magic with her. It seems quite different from what is usually practiced on Eden.", parse);
				Text.NL();
				Text.Add("<i>“Oh-ho,”</i> the jackaless replies, eyeing you with a raised eyebrow, her tail swishing from side to side. <i>“Customer is wanting to know the secrets of highlander witch doctors, herb women, and shamans? Is taking many years to truly understand, as well as good memory; Asche spent her whole time as girl learning basics of such magic.”</i>", parse);
				Text.NL();
				Text.Add("Well, maybe she could give you a condensed version of the idea?", parse);
				Text.NL();
				Text.Add("<i>“Yes, yes. Well, to be simply saying, basics of magic is not too different from that of lowlanders with their staves and fancy clothes and sparkling crystals. Is all about energy. But just as one can be choosing to be carrying water in barrel or bucket, so can these energies be moved in different ways.</i>", parse);
				Text.NL();
				Text.Add("<i>“Differences between lowlander and highlander magic are being many, but most important one is this: highlander magic is often - but not always - being employing the use of magical components, as if brewing potion. These components are being items which are representing facets of natural world which is having magic in them; by using these components in casting of spell, shaman is being able to draw much energy to fuel spell.”</i>", parse);
				Text.NL();
				Text.Add("So, it’s like brewing a potion… you kind of get it, yet at the same time, there’s something off about Asche’s explanation you can’t quite put a finger on…", parse);
				Text.NL();
				Text.Add("<i>“Good point about using magic component in casting of spell is that is allowing skilled herb woman or witch doctor to harness far more magic than self can draw. Bad point is that if caster is not having component, spell is weaker or even worse, not working. In such case, highlander magician is having to fall back on spells which are being not so powerful.”</i>", parse);
				Text.NL();
				Text.Add("Yeah, it sounds like an obvious tradeoff to you. So, what are some of these components? You’d imagine they’d be pretty rare and mystical…", parse);
				Text.NL();
				Text.Add("Asche shrugs. <i>“It is really being depending on what customer has in mind. For example, best item for drawing forth power of sea is being black pearl, which is being incredibly rare. Pearl is also working, but not as powerful, to be needing more of them as compared to black ones. To be representing life and growth is very simple, just needing pinch of common basil herb. Invoking fire and light is requiring volcanic ash from deep underground, but coal can also be sufficing if simple magic is what is needed.</i>", parse);
				Text.NL();
				Text.Add("<i>“Rituals is also being important in working of highlander magic, but maybe is discussion best saved for another time, is it not? Asche’s tongue is getting dry from so much talking, maybe is wanting something to drink.”</i> The jackaless chuckles.", parse);
				
				asche.flags["Magic"] = Asche.Magic.Components;
				
				Text.Flush();
				Scenes.Asche.TalkPrompt();
			}
			// Lesson two - Ritual
			else if(asche.flags["Magic"] < Asche.Magic.Rituals && asche.flags["Tasks"] >= Asche.Tasks.Ginseng_Finished) {
				Text.Add("<i>“Now that customer has had chance to see shamanistic power for [himher]self, Asche is thinking that maybe [heshe] is ready for deeper explanation. But… really, this jackaless is curious - she cannot be teaching customer to be doing highlander magic, so why is customer being asking so many questions?”</i>", parse);
				Text.NL();
				Text.Add("Curiosity, nothing more.", parse);
				Text.NL();
				Text.Add("Asche considers that a moment, a soft rustle accompanying movements under her snow-white sari. <i>“Well, if it is curiosity that customer is giving as reason, then Asche shall be giving answer that is fitting. Let us be moving onto next portion of highlander magic: ritual.</i>", parse);
				Text.NL();
				Text.Add("<i>“You may be already knowing that lowlander magicians may be speaking words to help concentrate their focus; others are being making gestures to same effect. Both are not being strictly necessary, but are helping to sharpen mind and direct intent. Lowlanders is often seeing it as crutch, sign of weakness to be discarded.”</i>", parse);
				Text.NL();
				Text.Add("The jackaless looks at you to make sure you’re still listening, then continues. <i>“Ritual being used in highlander magic is same basic idea, to use actions and symbols to be focusing mind. Difference is that is very tricky. Even Asche does not use it much, only when true power is being called for.”</i>", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("<i>“Maybe best explanation is being through example. Say there is not being rain for some time, and shaman is asked to summon rain so that crops may have water. First thing shaman does is to retreat into cave and start preparing large amount of woad. During this time, shaman is also fasting from dawn to dusk to prepare mind for ritual, this period is being lasting two days.</i>", parse);
					Text.NL();
					Text.Add("<i>“When this is being over, shaman is taking prepared woad to standing stones, which are being arranged in circle. With this, he is to be pouring woad dye and connecting all stones in one unbroken line. Is being very important that stream is unbroken, if shaman is being stopping pouring even once and resuming, ritual is not working. After circle is joined, is time to draw patterns.</i>", parse);
					Text.NL();
					Text.Add("<i>“Patterns on stones are to be made in woad, patterns on shaman’s body are to be made in henna. Red of henna is being contrasting with blue of woad to produce opposites between animate and inanimate, which is becoming during dance.”</i>", parse);
					Text.NL();
					Text.Add("Wow, that’s quite a speech, and she’s not done yet. Asche brings out a small flask of what looks like milk tea from under the counter and takes a deep, long swig, running her tongue over her muzzle to wet her lips.", parse);
					Text.NL();
					Text.Add("<i>“Now where was Asche? Ah, yes, actual dance to be summoning rain. Too complicated for Asche to be describing right here, but is quite intricate and is consisting of many steps. Also, better if many people are watching. Not just many people, but many people whom shaman is knowing and caring for. This is usually meaning tribe.</i>", parse);
					Text.NL();
					Text.Add("<i>“To be sure, is not easy thing. Many steps must be done in right order, with right movements, in right place and at right time for magic to be correctly worked. But when it is working, result of ritual can be incredibly powerful. If given three days to prepare, single shaman can summon rain over entire mountain with rain dance. What many people are seeing is end result - dance that is lasting maybe half an hour, but much preparation is going into ritual magic.”</i>", parse);
					Text.NL();
					Text.Add("Wow. That certainly is a lot.", parse);
					Text.NL();
					Text.Add("Asche shakes her head, soft clinks of gold against gold accompanying the movement. <i>“What Asche has told good customer is being very, very summarised. There is reason why next herb woman is almost certainly being daughter of previous one, as training is beginning from moment child is able to walk and speak. Maybe even before, if customer is seeing it that way.</i>", parse);
					Text.NL();
					Text.Add("<i>“Now, Asche has said enough, and has shop to tend to. Maybe you buy something to make up for Asche telling you long grandmother story, yes?”</i>", parse);
					
					asche.flags["Magic"] = Asche.Magic.Rituals;
					
					Text.Flush();
					Scenes.Asche.TalkPrompt();
				});
			}
			//TODO more lessons
			else {
				Text.Add("The jackaless makes a show of looking contemplative, leaning on the counter as she taps her chin and rolls her eyes in an exaggerated display of thoughtfulness. <i>“Hmm… customer is wanting to be talking more magic with Asche? This jackaless is thinking not so quickly… maybe good customer is getting one step ahead of [himher]self, yes? Perhaps is best to be contemplating and internalizing things which are being told, lessons which are being taught, having some time to be seeing it in action.</i>", parse);
				Text.NL();
				Text.Add("<i>“Maybe it is being best for good customer if [heshe] is coming back after Asche is finding opportunity to be sending [himher] to experience it in field.”</i>", parse);
				Text.Flush();
				Scenes.Asche.TalkPrompt();
			}
			
		}, enabled : true
	});
	options.push({ nameStr : "Herself",
		tooltip : "Ask the jackaless about herself.",
		func : function() {
			Text.Clear();
			Text.Add("Perhaps she could tell you something about herself.", parse);
			Text.NL();
			Text.Add("<i>“Customer is wanting to know about Asche? To be commended, for most are merely interested in what she can do for them. Oh, do not worry. Asche can tell you many things about herself that are true, but do not make shop look more mundane than it should be.”</i>", parse);
			Text.NL();
			Text.Add("Well then, you say, settling down for a long talk. You’re all ears.", parse);
			Text.NL();
			Text.Add("<i>“Asche grew up in highlands of Eden,”</i> the jackaless begins, idly drumming the fingers of one hand on the counter. <i>“Was pretty much shithole, as much as she remembers it. Returned to visit family few years back, still is much of a shithole, was reminded why she came to city.</i>", parse);
			Text.NL();
			Text.Add("<i>“Highlands may be shithole, but still is mystical shithole. Magic there is not like magic of coasts and lowlands, and Asche’s mother was herb woman for tribe; did pretty well for herself by taking chieftain as mate. Was not long before big sister and Asche were born; big sister was intended to take on mother’s mantle, but Asche learned too anyway - mostly in secret. Still, only room for one herb woman in a tribe. Asche is not stupid, so she left before big sister arranged for accident to happen to her. Later on, sister is also deciding that tribe is too small for her, you know? Wants to see world? So everything is for nothing.”</i>", parse);
			Text.NL();
			Text.Add("Ouch. That’s nasty.", parse);
			Text.NL();
			Text.Add("Asche shakes her head. <i>“Is only natural for those who scheme to think others are scheming too; they are always imagining that others also thinking like them. Now, where were we? Right! Asche comes to city. Was long and tiring walk, also some interesting things happened, but best to save those for later.”</i>", parse);
			Text.NL();
			Text.Add("What happened next?", parse);
			Text.NL();
			Text.Add("<i>“Asche makes living casting small spells,”</i> the jackaless replies. <i>“Keep bugs away from grain bin and sleeping place, get rid of rats, soothe mild fever, that kind of thing. Many swindlers in those days, so is hard to get started, but once people are knowing that you are not cheating them by talking nonsense and passing off colored water as potions, they are the ones who are finding you rather than other way round.</i>", parse);
			Text.NL();
			Text.Add("<i>“Soon enough, Asche is having enough money to rent out small place in merchants’ district - rent of this place was very much cheaper back then, so easier to do. When she is earning enough money later on, she is buying place and making it her own. Is very nice story, no?”</i>", parse);
			Text.Flush();
			
			asche.flags["Talk"] |= Asche.Talk.Herself;
			
			Scenes.Asche.TalkPrompt();
		}, enabled : true
	});
	//Requires having asked about herself and shop
	options.push({ nameStr : "Sister",
		tooltip : "So, this sister she mentioned…",
		func : function() {
			Text.Clear();
			Text.Add("The jackaless’ ears flick at your question. <i>“Why yes, Asche has one big sister. Much lovelier than Asche, too - and much more nasty. Big sister also runs shop much like Asche’s, only with much fewer scruples; while Asche is careful not to sell things that harm customers unless misused, big sister does not think twice about doing so. That is why while Asche can remain in one place, big sister was always having to move shop before shop was moved for her, if you are understanding Asche’s meaning.”</i>", parse);
			Text.NL();
			Text.Add("Sounds like she doesn’t like that sister of hers very much.", parse);
			Text.NL();
			Text.Add("<i>“Of course not. When Asche was little, big sister was always making Asche do things for her; Asche, fetch this, Asche, carry that. Later on, was also always tricking customers into doing things for her, often because she sells them bad things, cursed things, things which have hidden prices. She is doing it even when simple paying of money would be easier; habits are hard in dying. There was this time when she was having this monkey’s paw…”</i>", parse);
			Text.NL();
			Text.Add("You clear your throat, interrupting the jackaless before she gets drawn off on a tangent. And… <i>was</i> having to move shop? One can only take it karma caught up with Asche’s elder sister?", parse);
			Text.NL();
			Text.Add("<i>“In a sense of speaking, yes.”</i> Asche chuckles, the jackal-morph’s grin growing wider. <i>“Last Asche heard of sister, she was bragging how she had made customer into good little slave with magical ankhs, help her get rare items she is too lazy to get herself. Have not had news from her since, but one has come across rumors…”</i>", parse);
			Text.NL();
			Text.Add("Asche laughs, not even bothering to hide the undertones of dark glee in her voice. She raises an eyebrow and cozies up to the counter, gazing straight into your eyes.", parse);
			Text.NL();
			Text.Add("<i>“Nevertheless, if you are finding in your travels shop much like Asche’s, and also owner who looks like Asche, only she has black and silver fur instead… customer is not to be buying anything and leaving immediately. But there is little to fear from Asche, good customer. Asche is a nice girl, and knows not to salt earth. None of Asche’s merchandise will harm you - unless you mean to do evil with it.”</i>", parse);
			Text.Flush();
			
			asche.flags["Talk"] |= Asche.Talk.Sister;
			
			Scenes.Asche.TalkPrompt();
		}, enabled : (asche.flags["Talk"] & Asche.Talk.Shop) && (asche.flags["Talk"] & Asche.Talk.Herself)
	});
	options.push({ nameStr : "Stock",
		tooltip : "Where does she get all the stuff she sells?",
		func : function() {
			Text.Clear();
			Text.Add("You’ll admit to being a bit curious - just where does Asche get her stock? Some of the things she sells are positively odd; you don’t think the likes of them can be found in any other shop in Rigard - in fact, you’re pretty sure some of her goods would be more at home in the Academy of Higher Arts rather than sitting on her shelves.", parse);
			Text.NL();
			Text.Add("Asche whistles innocently and rolls her eyes in the most exaggerated fashion, then gives you a toothy grin. <i>“Oh, little bit here, little bit there, many a mickle makes a muckle, as saying goes. Some of it is coming from customers like you, wanting to sell things and not knowing what they truly are - for example, once had a fellow come in who was using pretty powerful artifact to help grow pumpkins, and wanted to get rid of it because he was selling farm and moving to Afaris. Such waste; Asche was more than willing to buy from him. More yet is also coming from dealers Asche trusts, although she is not going to be revealing their names.</i>", parse);
			Text.NL();
			Text.Add("<i>“Other stock, Asche admits, is being pulled out of box, although she is making sure that everything is safe to use; some things are disguising themselves and slipping through box’s protections. After being victim of many of big sister’s pranks, Asche has good skill at scenting dark magic.”</i> The jackaless taps her nose for emphasis. <i>“If she cannot be destroying item, she knows enough to at least send it back where it is coming from.</i>", parse);
			Text.NL();
			Text.Add("<i>“As for potions, all are brewed by Asche. Simple ones anyone who studies can make, but some are Asche’s special recipe and she is not letting such secrets slip easily.”</i> With that, the jackaless clears her throat and gestures at her store. <i>“Asche has not stayed in business for so long by being stupid or careless; she is having many loyal customers who be relying on her not to make mistake.”</i>", parse);
			Text.Flush();
			
			asche.flags["Talk"] |= Asche.Talk.Stock;
			
			Scenes.Asche.TalkPrompt();
		}, enabled : true
	});
	// TODO Default response:
	options.push({ nameStr : "Tasks",
		tooltip : "Does she perchance need the services of an adventurer?",
		func : function() {
			if(Scenes.Asche.Tasks.Ginseng.IsEligable())
				Scenes.Asche.Tasks.Ginseng.Initiation();
			else if(Scenes.Asche.Tasks.Ginseng.IsOn()) {
				if(Scenes.Asche.Tasks.Ginseng.IsFail())
					Scenes.Asche.Tasks.Ginseng.Failed();
				else if(Scenes.Asche.Tasks.Ginseng.IsSuccess())
					Scenes.Asche.Tasks.Ginseng.Complete();
				else
					Scenes.Asche.Tasks.Ginseng.OnTask();
			}
			else if(Scenes.Asche.Tasks.Nightshade.IsEligable())
				Scenes.Asche.Tasks.Nightshade.Initiation();
			else if(Scenes.Asche.Tasks.Nightshade.IsOn()) {
				if(Scenes.Asche.Tasks.Nightshade.IsSuccess())
					Scenes.Asche.Tasks.Nightshade.Complete();
				else
					Scenes.Asche.Tasks.Nightshade.OnTask();
			}
			else
				Scenes.Asche.Tasks.Default();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“Customer is having enough of chit-chat, maybe mouth is getting dry?”</i> Leaning forward on the counter, Asche grins at you playfully. <i>“Asche has many nice teas for long conversations, maybe customer can be purchasing some. But is there anything else customer wishes to have to do with Asche before this meeting is over?”</i>", parse);
		Text.Flush();
		
		Scenes.Asche.Prompt();
	});
}


Scenes.Asche.FortuneTellingPrompt = function() {
	var parse = {
		handsomepretty : player.mfFem("handsome", "pretty"),
		HeShe: player.mfFem("He", "She"),
		heshe: player.mfFem("he", "she"),
		hisher: player.mfFem("his", "her"),
		himher : player.mfFem("him", "her")
	};
	
	var cost = Asche.FortuneCost();
	
	//[Fortune][Fate][Explain][Never Mind]
	var options = new Array();
	options.push({ nameStr : "Fortune",
		tooltip : "Ask for a quick, light and easy reading.",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Mm.”</i> The jackaless pulls at her shawl as you pass her the money, then dips her head. <i>“All right. Good customer is to be holding out hand, please.”</i>", parse);
			Text.NL();
			Text.Add("Obediently, you do as Asche requests. Her fingers tickle as they ply along the contours of your palm, while she mumbles all the while. There’s no obvious indication of worked magic, but she seems to be concentrating furiously, her eyes narrowed and face set; it’s a minute or so before she finally relaxes her grip on your hand.", parse);
			Text.NL();
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("<i>“Hmm. Asche is thinking that you are being having romantic problems in near future.”</i> The jackaless looks up from your palm, her expression serious. <i>”Maybe is being a bit of a headache.”</i>", parse);
				Text.NL();
				Text.Add("Is there anything you can do to avoid it?", parse);
				Text.NL();
				Text.Add("The jackaless thinks a moment, then grins, her dark eyes glinting in the shop’s light. <i>“Actually, Asche is suggesting that customer should be lying back and accepting [hisher] fate.”</i>", parse);
				Text.NL();
				Text.Add("What? Isn’t the whole point of knowing a bad fortune to try and avert it?", parse);
				Text.NL();
				Text.Add("<i>“Is only headache, and looks like will have no really bad consequences for customer. Will make [himher] stronger for real trouble, does [heshe] not agree?”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("The jackaless looks up from your palm, her expression contemplative. <i>“Am thinking that you may not want to be overindulging if you are ever visiting Lady Blessing’s inn.”</i>", parse);
				Text.NL();
				Text.Add("Why? Is someone going to pick your pocket when you’re passed out? The inn seems like too nice a place for that kind of riff-raff…", parse);
				Text.NL();
				Text.Add("<i>“Is not coming from another living thing.”</i> Asche looks truly worried, a rare thing for the shopkeeper. <i>“Asche… is not sure. But unless you are being thrill-seeker, Asche is asking you nicely not to be tempting fate.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Hmm. Fortune for near future is being indeterminate.”</i>", parse);
				Text.NL();
				Text.Add("What’s the matter?", parse);
				Text.NL();
				Text.Add("<i>“Other would simply make up nonsense for customer to hear, but I think is more important to tell truth. Next few days for you… is wrapped in chaos. Like highland mist or fog… hard to see clearly. Asche advises you to be cautious, that is all; is but period of uncertainty.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Is customer fond of swimming?”</i>", parse);
				Text.NL();
				Text.Add("You might be, or might not, you reply. Is there something up?", parse);
				Text.NL();
				Text.Add("<i>“Asche is suggesting that maybe you are staying away from large bodies of water tomorrow,”</i> the jackaless replies. <i>“That, and you are best to be avoiding seafood and letting sleeping dogs lie. Is best for your own safety, and is only for one day, so maybe little is being lost if customer follows advice?”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Asche is thinking that today Lady Luck is being smiling on you. If good customer is wanting to play games of chance, then is probably best to be doing it before midnight.</i>", parse);
				Text.NL();
				Text.Add("<i>“Of course, always to be warned that Lady Luck can get tired of carrying same person around for too long, so while to be taking advantage of good fortune, best not to be abusing it.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Asche is remembering good saying: that is important to be learning from mistakes. This jackaless is hoping that customer will be remembering that.”</i>", parse);
				Text.NL();
				Text.Add("Well, it’s solid enough advice in general, but why bring that up in particular?", parse);
				Text.NL();
				Text.Add("<i>“Because Asche is thinking that customer will be having chance to be learning very much, very soon, in very short time.”</i> She flashes you a cheerful grin. <i>“To be wishing good luck upon customer.”</i>", parse);
				Text.NL();
				Text.Add("But… but shouldn’t she give you some sort of advice on how to deal with whatever’s coming up?", parse);
				Text.NL();
				Text.Add("Asche shrugs, the motion causing more than a little clinking on her part. <i>“What is customer wanting Asche to do? To be telling [himher] to be buying clothing or furniture in effort of ward off ill fortune? Customer must act accordingly and appropriately.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("The jackaless looks up from your palm and thinks a moment. <i>“Hmm. Asche is suggesting that customer is to be finding a peaceful place where [heshe] may be making plans for future.”</i>", parse);
				Text.NL();
				Text.Add("And… well, you’re curious. What if one doesn’t exist?", parse);
				Text.NL();
				Text.Add("<i>“Then customer is to be creating one,”</i> Asche replies matter-of-factly. <i>“Is being simple as that. Will be doing [himher] much good in the future, so is strong recommendation that customer be following Asche’s advice.”</i>", parse);
			}, 1.0, function() { return true; });
			/*
			scenes.AddEnc(function() {
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
			}, 1.0, function() { return true; });
			 */
			scenes.Get();
			Text.Flush();
			
			party.coin -= cost;
			rigard.MagicShop.totalBought += cost;
			
			Scenes.Asche.FortuneTellingPrompt();
		}, enabled : party.coin >= cost
	});
	options.push({ nameStr : "Fate",
		tooltip : "So, you’re serious about asking Asche to read what the future has in store for you…",
		func : function() {
			Text.Clear();
			Text.Add("All trace of nonchalance drops from the jackaless’ face. Her eyes harden, her lips thin, and you notice that she’s begun fiddling with the hem of her shawl. <i>“So, you are being serious about this, then.”</i>", parse);
			Text.NL();
			Text.Add("If she can really tell you of your fate, then yes, you’d like to hear what she has to say; forewarned is forearmed, after all. You place your money on the counter, and watch as Asche sweeps the coins into her palm.", parse);
			Text.NL();
			Text.Add("<i>“Very well. Customer is to be holding out hand.”</i>", parse);
			Text.NL();
			Text.Add("You do as instructed, and Asche takes hold of your hand, tracing her fingers along the contours of your palm, exploring the ridges of your thumb and fingers. You half-wonder if she’s going to feel your knuckles as well, but thankfully she’s only interested in the top of your hand.", parse);
			Text.NL();
			Text.Add("As the jackaless chants softly under her breath, you sense a growing tension in the air, like static electricity gathering - and then it’s released in an instant, a popping sensation against your skin, just as she releases your hand and looks up at you.", parse);
			Text.NL();
			Text.Add("<i>“Asche is ready to be telling you what she is seeing in your fate.</i>", parse);
			Text.NL();
			
			var scenes = new EncounterTable();
			
			//Fate readings for first phase of game
			
			scenes.AddEnc(function() {
				// Referencing Uru at portal opening.
				Text.Add("<i>“Customer is to be wary; an old adversary is to be turning up soon. While customer is knowing that [heshe] will eventually have to confront this enemy, meeting will be far sooner than expected.</i>", parse);
				Text.NL();
				Text.Add("<i>“Asche is seeing that there is no escaping this fate, so customer must be finding way to deal with it and pass through unharmed. Maybe a safe path will be revealing itself.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				// If player rejected Kiai at the start.
				Text.Add("<i>“Asche sees that one whom you rejected will be eventually returning to your side. Your destinies are intertwined like roots twisting about each other; more you try to tear apart, more they cleave back together. Rejecting this one has only made the inevitable stronger; there is not much customer can be doing to fight it, and maybe is better that way.”</i>", parse);
			}, 1.0, function() { return !party.InParty(kiakai, true); });
			scenes.AddEnc(function() {
				// References Corruption, Malice and Lust.
				Text.Add("<i>“Before customer’s quest is over, [heshe] will be meeting three foes who will be standing out against the many others that [heshe] will meet along [hisher] travels. Customer may already have heard of or even met them, although [heshe] will not know who they are. These three foes may be seeming to be disconnected at first, but they are being sharing common goal, and struggle against them will be no easy task. Asche suggests that you be steeling yourself for what is lying ahead.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				// References gemstead.
				Text.Add("<i>“Customer must be careful about who [heshe] is making friends with,”</i> Asche says. <i>“Is more than just friendship. The more who are knowing of your cause, the more are gathering their energies to aid it; the way these energies are being manifesting will soon make themselves clear as customer proceeds towards [hisher] chosen fate. Of course, customer does not want to be making the wrong friends, trusting the wrong people…“</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				//Requires that PC has met Layla.
				Text.Add("<i>“The creature that customer is being calling a chimaera…”</i> Asche looks strangely intent. <i>“Is old. Very, very old, but not in shape that customer now knows; body is old, but mind to be like that of a newborn. She is very pliable thing… Asche is hoping that you are making wise decisions in choosing to mold her.”</i>", parse);
			}, 1.0, function() { return party.InParty(layla, true); });
			scenes.AddEnc(function() {
				//Requires that player have recruited Terry.
				Text.Add("<i>“Perhaps may be coming time when you will not be needing collar around foxy companion’s neck, good customer,”</i> Asche says. <i>“May be some time off yet, but is still being possible… provided wise choices are being made. But where to be making wise choices… that is not clear to Asche. This jackaless is sorry, but the mists are being clouding your future, and seeing through them is hard.”</i>", parse);
			}, 1.0, function() { return party.InParty(terry, true); });
			scenes.AddEnc(function() {
				Text.Add("<i>“Customer must be seeking out spirits.”</i>", parse);
				Text.NL();
				Text.Add("Huh?", parse);
				Text.NL();
				Text.Add("<i>“Customer is already being in possession of one spirit, is [heshe] not?”</i> Asche jabs a finger in the direction of your gem, as if she can see it directly in your pocket. <i>“This jackaless is sensing presence of such with customer; [heshe] has done well to gain such an ally, but more are being required.”</i>", parse);
				Text.NL();
				Text.Add("Can she give you an idea of how many more?", parse);
				Text.NL();
				Text.Add("<i>“All customer can be having. More the merrier, as saying goes; customer will be requiring everything that [heshe] can be bringing to bear.”</i>", parse);
			}, 1.0, function() { return glade.flags["Visit"] >= DryadGlade.Visit.DefeatedOrchid; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Asche recognizes this place where customer is standing, is minotaur village in highlands. Barricades, they are being there, but are likely to be of not much use against foe customer faces, a fearsome man-beast. Behind each, two evenly matched forces.”</i> The jackaless scratches her muzzle. <i>“Asche will say that she is finding customer’s fate disturbing. Is not liking to think that old tribe may be caught up in strife, too.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Asche is seeing customer wandering across endless hot sands, seeking something that [heshe] cannot see with the eye alone. Customer is to be speaking with two siblings on that plane, a brother and sister, a jeweller and tailor. They are being telling customer something of great importance.”</i>", parse);
				Text.NL();
				Text.Add("The desert?", parse);
				Text.NL();
				Text.Add("<i>“Not here. Not on Eden. This desert being different… a red hot forge inhabited by gargantuan metallic beasts… is very odd. Asche has never heard of this place.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Asche is seeing customer walking amidst ruins belonging to a lost people of the sky. [Heshe] is being flying through clouds, walking on air, carried by wings of wind.”</i> The jackaless concentrates furiously. <i>“There is being a spirit, whispering, pleading. Customer is being piecing together memories belonging to ancient people of sky plane. [Heshe] is being requiring one of their number as companion to do so…”</i>", parse);
			}, 1.0, function() { return true; });
			/* TODO Jin
			scenes.AddEnc(function() {
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
			}, 1.0, function() { return true; });
			
#scene
//References Jin.

<i>“If in future you are being caught in magical trap and cat-morph is making bargain with you, Asche is strongly suggesting that customer be accepting deal.”</i>

What? Why?

<i>“Asche is not sure of the details…”</i> The jackaless concentrates furiously, her eyes aglow. <i>“But Asche is completely certain that if customer is not accepting, only other outcome is being a bad ending. Asche is thinking that customer is wanting to avoid that, yes?”</i>

#converge
*/
			// SECOND PHASE
			if(gameCache.flags["Portals"] >= 1) {
				scenes.AddEnc(function() {
					Text.Add("The jackaless throws you a suspicious glare. <i>“All muddy. Customer is messing things up! Things Asche saw before are still being there, still connected, but in different way… is confusing.”</i>", parse);
					Text.NL();
					Text.Add("That… sounds more like an accusation than a prediction.", parse);
					Text.NL();
					Text.Add("<i>“It is all being very strange,”</i> Asche shrugs. <i>“Foe is friend and friend is foe, the child is being the corruptor, the void is awaking. Customer is to be traveling back to journey forth.”</i> She gives your palm another affronted glance. <i>“Customer’s fate is all mixed like casserole, [heshe] is better being fixing it,”</i> she advises.", parse);
				}, 1.0, function() { return true; });
			}
			/*
			 * 
//TODO
//Third phase

//Fourth phase

			scenes.AddEnc(function() {
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
			}, 1.0, function() { return true; });
			*/
			scenes.Get();
			
			party.coin -= cost;
			rigard.MagicShop.totalBought += cost;
			
			Text.Flush();
			
			Scenes.Asche.FortuneTellingPrompt();
		}, enabled : party.coin >= cost
	});
	options.push({ nameStr : "Explain",
		tooltip : "How does this fortune-telling of her work, anyway?",
		func : function() {
			Text.Clear();
			Text.Add("Eyeing Asche, you tell the jackaless you’d probably be interested in having your fortune told, but perhaps if you knew a little more about what you were getting yourself into, you could be more enthusiastic about the prospect…", parse);
			Text.NL();
			Text.Add("Asche smiles and holds out her hands palms skyward, the movement setting her jewellery clinking. <i>“Certainly. Asche has little to hide.</i>", parse);
			Text.NL();
			Text.Add("<i>“To be starting at beginning, there is belief amongst some clans in highlands that is possible to foretell future of person by seeing length and shape of fingers and palm lines. Each combination is having meaning and way it is impacting bearer’s life and can be used to paint hazy picture of what is to come.”</i>", parse);
			Text.NL();
			Text.Add("It does sound rather incredible, you have to admit. It seems as difficult to make sense of as reading the future in the entrails of birds and other such practices. Besides, with alchemy letting anyone change one’s body - and one presumes, hands - how is it that one’s fate can stay the same when one’s palm changes?", parse);
			Text.NL();
			Text.Add("<i>“It is what it is; not all things are being seen by eye alone.”</i> The jackaless shrugs. <i>“If you are doubting usefulness of fortune, then maybe you are not to be basing your decisions on it and just taking what Asche says for fun. Good money is being spent on more trivial entertainments.</i>", parse);
			Text.NL();
			Text.Add("<i>“That aside, Asche can tell customer [hisher] fate, or fortune. Latter is light and easy to do, maybe small prediction of what is going to be happening later when customer goes to bed, or whether customer is going to be lucky in love. Fate is…”</i> The jackaless grows more somber, her lips pulling into a thin, straight line. <i>“More important, for lack of better word to be describing it. Asche knows what she is saying just now, but fate is not so easily brushed off, is not something done for fun. If you are taking such things lightly or not believing what this jackaless is saying, please not to be asking Asche to read your fate.”</i>.", parse);
			Text.Flush();
			
			Scenes.Asche.FortuneTellingPrompt();
		}, enabled : true
	});
	options.push({ nameStr : "Never Mind",
		tooltip : "Maybe another time.",
		func : function() {
			Text.Clear();
			Text.Add("<i>“As customer is wishing.”</i> Is that a hint of sourness you hear in her voice? <i>“Is there any other business that [heshe] has with Asche?”</i>", parse);
			Text.Flush();
			
			Scenes.Asche.Prompt();
		}, enabled : true
	});
	
	Gui.SetButtonsFromList(options, false, null);
}
