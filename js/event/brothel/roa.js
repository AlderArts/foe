/*
 * 
 * Define Roa
 * 
 */

Scenes.Roa = {};

function Roa(storage) {
	Entity.call(this);
	
	// Character stats
	this.name = "Roa";
	
	this.avatar.combat = Images.roa;
	
	this.maxHp.base        = 30;
	this.maxSp.base        = 40;
	this.maxLust.base      = 20;
	// Main stats
	this.strength.base     = 10;
	this.stamina.base      = 11;
	this.dexterity.base    = 22;
	this.intelligence.base = 17;
	this.spirit.base       = 19;
	this.libido.base       = 18;
	this.charisma.base     = 16;
	
	this.level = 1;
	this.sexlevel = 1;
	
	this.body.DefMale();
	this.FirstBreastRow().size.base = 2;
	this.Butt().buttSize.base = 3;
	this.Butt().virgin = false;
	this.body.SetRace(Race.rabbit);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = Roa.Met.NotMet;
	this.flags["Lagon"] = Roa.Lagon.No;

	if(storage) this.FromStorage(storage);
}
Roa.prototype = new Entity();
Roa.prototype.constructor = Roa;

Roa.Met = {
	NotMet : 0,
	Met    : 1
};

Roa.Lagon = {
	No       : 0,
	Talked   : 1,
	Defeated : 2
};

//TODO
Roa.prototype.Cost = function() {
	return 100;
}

Roa.prototype.Met = function() {
	return this.flags["Met"] >= Roa.Met.Met;
}

Roa.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Roa.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

// Schedule //TODO
Roa.prototype.IsAtLocation = function(location) {
	return true;
}

// Party interaction //TODO
Roa.prototype.Interact = function() {
	Text.Clear();
	Text.AddOutput("Rawr Imma bunny.");
	
	
	if(DEBUG) {
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: relation: " + roa.relation.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: subDom: " + roa.subDom.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: slut: " + roa.slut.Get()));
		Text.Newline();
	}
	
	Gui.NextPrompt(function() {
		PartyInteraction();
	});
}

Scenes.Roa.BrothelApproach = function() {
	var parse = {
		playername : player.name,
		legDesc : function() { return player.LegDesc(); }
	};
	
	if(roa.Met()) {
		Text.Clear();
		Text.Add("You make your way to the couch where the lusty lapin is lounging.", parse);
		Text.NL();
		if(roa.flags["Lagon"] >= Roa.Lagon.Defeated) {
			Text.Add("He gasps once he sees you approach, and immediately gets down on his knees, bowing respectfully as he looks up at you with gleaming eyes. <i>”It’s my champion! [playername]! What brings you to my humble corner? Is there something I can do to serve you?”</i>", parse);
			Text.NL();
			Text.Add("Smiling, you lay a hand on his shoulder and tell him that he can start by getting up. If you wanted him down on his knees, you’d tell him that.", parse);
			Text.NL();
			Text.Add("<i>”Okay, sure!”</i> he yips, getting back on his feet.", parse);
			Text.NL();
			Text.Add("That’s better, you declare, tapping his shoulder affectionately. You’re not saying you can’t have some fun when he’s down on his knees like that, but you’ll decide when it’s time for that.", parse);
			Text.NL();
			Text.Add("<i>”Whatever you say, mighty champion!”</i> he says, giggling. <i>”So… what can I do for you? Want to take me to the back rooms? I’ll do my best to pleasure you!”</i>", parse);
		}
		else if(roa.Relation() < 20) {
			parse["fem"] = player.mfFem("handsome", "beautiful");
			Text.Add("<i>”Hey there, [fem]. Fancy some bunny love?”</i>", parse);
			Text.NL();
			Text.Add("Though sincere, there’s a certain mechanical tone to the lagomorph’s voice; you know he genuinely is hoping for sex, but that’s just because he likes to fuck in general.", parse);
		}
		else if(roa.Relation() < 50) {
			Text.Add("<i>”Hi, [playername]. Came back for more?”</i>", parse);
			Text.NL();
			Text.Add("Even if it weren’t for the grin on his face, Roa’s tone makes it clear he’s happy to see you. There’s more here than just his general lustiness, he sincerely enjoys the fact you’ve come to see him again.", parse);
			Text.NL();
			Text.Add("Not to say that there’s not a genuine tang of lust in his words, too.", parse);
		}
		else {
			Text.Add("<i>”[playername]! My favorite customer!”</i> he exclaims jumping from his seat to hug you. <i>”Hi! What brings you to my little corner of the room? Want to plug my bum?”</i>", parse);
			Text.NL();
			Text.Add("With a smile and a chuckle, you hug the bunny-boy back, feeling his cock rubbing against your [legDesc]. He’s just never going to change, is he?", parse);
		}
		Text.Flush();
		
		Scenes.Roa.BrothelPrompt();
	}
	else
		Scenes.Roa.First();
}

Scenes.Roa.BrothelPrompt = function() {
	var parse = {
		cost : Text.NumToText(roa.Cost()),
		armorDesc : function() { return player.ArmorDesc(); },
		cockDesc : function() { return player.BiggestCock().Short(); }
	};
	
	//[name]
	var options = new Array();
	options.push({ nameStr : "Buy",
		func : function() {
			Text.Clear();
			Text.Add("Roa giggles with glee as you pull him close possessively and start leading the way to the backrooms. Finding a free room, you open it and push the lagomorph inside before locking the door behind you.", parse);
			Text.NL();
			Text.Add("The lapin immediately sets about removing his clothes in a strip tease, showing off his butt and throbbing pink pucker right in the middle of his bubble butt. <i>”I’m all ready!”</i> he declares with a grin.", parse);
			Text.NL();
			if(player.Slut() >= 45) {
				Text.Add("That’s great; now, how about he comes over here and give you a hand with your [armorDesc]? As you say this, you smirk knowingly, crooking a finger to entice the whore to attend you.", parse);
				Text.NL();
				parse["fem"] = player.mfFem("sir", "ma’am");
				Text.Add("<i>”Right away, [fem]!”</i> he replies excitedly, hopping over toward you to being stripping you out of your [armorDesc].", parse);
				Text.NL();
				Text.Add("You lick your lips appreciatively, twisting and turning to help Roa remove your gear, and to show off your increasingly visible assets to their best. When he gets close enough, you can’t resist sending your fingers dancing teasingly over his bobbing erection, feeling the soft, warm flesh under your fingertips.", parse);
				Text.NL();
				Text.Add("<i>”Ooh!”</i> he moans sluttily. <i>”Careful, I might wind up blowing all over your stuff. Don’t wanna get your belonging covered in bunny cream now, do you?”</i> he asks teasingly.", parse);
				Text.NL();
				Text.Add("Not until after you’re done playing with him, you immediately shoot back, pinching his butt gently for emphasis.", parse);
				Text.NL();
				Text.Add("<i>”Oh! You’re so naughty!”</i> he giggles.", parse);
			}
			else {
				Text.Add("You nod your head and quickly move to remove your own [armorDesc], placing it carefully aside once you’re also naked.", parse);
			}
			Text.NL();
			Text.Add("With both of you now totally undressed, you consider what you want Roa to do to you.", parse);
			if(player.FirstCock())
				Text.Add(" Roa has already sunk to his knees, clearly expecting you to want him to put his mouth to work lubing up your [cockDesc] before you bury it into his willing ass.", parse);
			Text.Flush();
			
			//[Pitch Anal] [Catch Vaginal]
			var options = new Array();
			options.push({ nameStr : "name",
				func : function() {
					Text.Clear();
					Text.Add("", parse);
					Text.NL();
					Text.Flush();
				}, enabled : true,
				tooltip : ""
			});
			options.push({ nameStr : "name",
				func : function() {
					Text.Clear();
					Text.Add("", parse);
					Text.NL();
					Text.Flush();
				}, enabled : true,
				tooltip : ""
			});
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true,
		tooltip : Text.Parse("What else do you do with a whore in a brothel? Take him back and let’s have some fun! If you remember correctly, his fee is [cost] coins.", parse)
	});
	
	/*
	options.push({ nameStr : "name",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
		}, enabled : true,
		tooltip : ""
	});
	 */
	Gui.SetButtonsFromList(options, true, function() {
		PrintDefaultOptions();
	}); // TODO leave?
}

Scenes.Roa.First = function() {
	var cost   = roa.Cost();
	var p1cock = player.BiggestCock();
	
	var parse = {
		cost : Text.NumToText(cost),
		hand : function() { return player.HandDesc(); },
		feet : function() { return player.FeetDesc(); },
		lowerArmorDesc : function() { return player.LowerArmorDesc(); },
		tongueDesc     : function() { return player.TongueDesc(); },
		multiCockDesc  : function() { return player.MultiCockDesc(); },
		cockDesc       : function() { return p1cock.Short(); }
	};
	
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Text.Clear();
	Text.Add("As you make your way through the crowds and couches, you’re able to get a better look at the bunny. She’s a dainty little thing, as you’d expect a rabbit-morph to be; petitely built, but feminine, and covered in pink-tinged white fur. Her hair is long and kind of messy, falling forward over beautiful baby-blue eyes, but it’s an interesting sort of disheveled look.", parse);
	Text.NL();
	Text.Add("Close enough, you realise that this is no bunny-girl... it’s a bunny-<b>boy</b>. Though you had initially thought him to be a flat-chested girl, the tightness of the clothes he’s wearing - little more than an array of straps and patches of brown leather - reveals his fundamental masculinity. The fact it’s crotchless and exposes his not so little dick, pink and jutting against his girly thighs, certainly doesn’t hurt.", parse);
	Text.NL();
	parse["fem"] = player.mfFem("mister", "ma’am");
	Text.Add("<i>”Hey there, [fem]. Looking for some fun?”</i> he asks with a shy smile.", parse);
	Text.NL();
	Text.Add("You can’t help but note that despite the shyness of his smile, and the timid tone of his voice, those blue eyes are fixated on you, open wide so he can practically drink in every part of you. Especially your crotch. Smiling politely, you tell him that might be the case, and ask him who he is.", parse);
	Text.NL();
	Text.Add("<i>”My name is Roa. I haven’t been here very long, to be honest. So I’m still adjusting, but I’ll try my best to fulfill any desire you got,”</i> he smiles again.", parse);
	Text.NL();
	Text.Add("He certainly has the attitude right; he genuinely sounds enthusiastic about it.", parse);
	if(burrows.flags["Access"] >= Burrows.AccessFlags.Stage3)
		Text.Add(" Roa... why does that name sound familiar...?", parse);
	Text.NL();
	if(player.FirstCock()) {
		Text.Add("<i>”I’m not going to lie to you [fem], but [thatThose] cock[notS] you’re hiding in there,”</i> he points at your crotch. <i>”They smell delicious...”</i> he sniffs the air with a smile, taking in your scent and relishing in it. <i>”Mouthwatering, really,”</i> he licks his lips. <i>”It’s a bit hard for me to contain myself. I keep wondering how [itThey]’d feel inside. Care to show me?”</i>", parse);
		Text.NL();
		Text.Add("The rabbit’s little tongue dabs nervously at his lips, and he rubs his thighs together impatiently. His cock is fully erect, jutting like a defiant pillar of pinkness against his white fur. He’s clearly not acting; he means every word he just said. What a slut...", parse);
		Text.NL();
		if(player.Slut() >= 45)
			Text.Add("You lick your own lips appreciatively at his enthusiasm. He may be your kind of guy. Playfully,", parse);
		else
			Text.Add("You can’t help but shuffle nervously at his enthusiasm. You know he’s a... well, a whore, but it’s still a little overwhelming. Nervously,", parse);
		Text.Add(" you ask if he likes cocks.", parse);
		Text.NL();
		Text.Add("<i>”Uhum,”</i> he replies, nodding emphatically. <i>”I love cocks. The hardness, the taste, the cum. How it throbs when it impales me...”</i> he trails off dreamily. <i>”Oh please [fem]! Can we do it now?”</i> he asks, biting his lip. Just how needy is this rabbit!?", parse);
		Text.NL();
		Text.Add("Well, with such clear enthusiasm, it’s hard to think of anything else to ask him. Maybe you should consider buying a round with him...", parse);
	}
	else {
		Text.Add("<i>”So, how about it? You buy me and we duck out in one of them rooms for some fun. I’ll admit I’m better at catching than pitching, but for someone as good looking as you,”</i> he looks you over again, grinning. <i>”Well, I wouldn’t mind doing some pitching,”</i> he adds, showing off his erect cock.", parse);
		Text.NL();
		Text.Add("Bemused, although a little flattered, you ask what he means about being better at catching; does he prefer his partners to have cocks?", parse);
		Text.NL();
		Text.Add("<i>”To be honest, yes. Of course, I’m also into girls that like pegging...”</i> he trails off into a giggle.<i>” But you’re the customer, and I’ve been told the customer is always right. So, I’ll do whatever you want. Just consider buying me, please, I haven’t had action in a while...”</i> he says, trembling a little in pent-up lust.", parse);
		Text.NL();
		Text.Add("The sight really is kind of pitiful, and it’s pretty clear he’s not in much of a mood for further conversation. You should probably make up your mind if you want to fuck him or not.", parse);
	}
	Text.NL();
	Text.Add("<i>”I’m pretty cheap, since I just started working here. A mere [cost] coins will be enough. You can spare that, can’t you?”</i>", parse);
	Text.Flush();
	
	//[Buy] [Leave]
	var options = new Array();
	options.push({ nameStr : "Buy",
		func : function() {
			Text.Clear();
			Text.Add("<i>”Great! Come with me!”</i> he says, springing to his feet and grabbing your [hand].", parse);
			Text.NL();
			Text.Add("You can’t hold back a smile at the sight of his enthusiasm, and hurry to keep up with the quick-moving little lapin. For someone so dainty, he sure can be insistent when he wants to be.", parse);
			Text.NL();
			Text.Add("Roa leads you through a hallway, clearly where the Shadow Lady keeps the bulk of its private rooms. The corridor is fairly long, and lined with doors, all of them sporting numbers and in one of three states. Some of the doors are open with their interior exposed - maids move hastily into those, so they must be rooms that have been used and are being cleaned up. Other doors are closed; some of these have keys hanging from delicate chains around the knobs, and others don’t.", parse);
			Text.NL();
			Text.Add("When Roa leads you to one of the closed, key-bearing doors and unlocks it before leading you inside, your suspicions are confirmed; the keys signify rooms ready to be used by the customers.", parse);
			Text.NL();
			Text.Add("The inside is not at all what you expected. It’s a small, neatly kept room, the bulk given over to a large bed underneath a shining-clean ceiling mirror. Another door on the opposite wall leads to what you presume is a bathroom. Lush carpeting lays under your [feet], and the walls are covered in tasteful wallpaper, embroidered with heart print pattern. A small bedside table sports a single colorful candle, the likely source of the faint herbal scent that permeates the room.", parse);
			Text.NL();
			Text.Add("The eager lapin wastes no time, undoing the binding of his clothing with practiced ease. In no time at all, he’s stark-naked and his fetish clothes are strewn about the room’s carpeted floor. <i>”Want me to help you undress?”</i> he offers tentatively, kneeling beside you to grip your [lowerArmorDesc].", parse);
			Text.NL();
			Text.Add("Unthinkingly, you dab at your lips with your [tongueDesc]. Well, since he’s so eager, why not? You nod, and tell him that you would like that.", parse);
			Text.NL();
			Text.Add("Roa’s eyes practically glint at your reply. He begins stripping you, bit by bit, taking advantage of the situation and exploring your body with his eager handpaws. His cock bobs with his movement, throbbing in excitement. If you didn’t know better, you’d say he’s ready to blow from excitement alone…", parse);
			Text.NL();
			Text.Add("<i>”There, all done,”</i> he declares, tucking your clothes inside the wardrobe.", parse);
			
			var herm = player.FirstCock() && player.FirstVag();
			
			var options = new Array();
			
			if(player.NumCocks() > 1) {
				Text.NL();
				Text.Add("The horny rabbit turns to face you, a giggle bubbling from his grinning lips. <i>”All that, for me? You shouldn’t have...”</i> he says, kneeling in front you, sniffing your [multiCockDesc]. <i>”May I?”</i> he asks, laying a hand on your [cockDesc].", parse);
				if(herm) {
					options.push({ nameStr : "Fuck him",
						func : Scenes.Roa.TSLPitchAnal, enabled : true,
						tooltip : "Give the needy bunny a rough anal ride."
					});
				}
				else {
					Text.NL();
					Text.Add("Smirking, you can’t help but tell him to go right ahead.", parse);
					Text.Flush();
					
					Gui.NextPrompt(Scenes.Roa.TSLPitchAnal);
					return;
				}
			}
			else if(player.FirstCock()) {
				Text.NL();
				Text.Add("The horny rabbit turns to face you, a giggle bubbling from his grinning lips. <i>”Now, let’s get to know that hard [cockDesc] of yours,”</i> he says, kneeling in front of you and sniffing your musk. <i>”So enticing… May I?”</i> he asks, laying a hand on your [cockDesc].", parse);
				
				if(herm) {
					options.push({ nameStr : "Fuck him",
						func : Scenes.Roa.TSLPitchAnal, enabled : true,
						tooltip : "Give the needy bunny a rough anal ride."
					});
				}
				else {
					Text.NL();
					Text.Add("A grin of anticipation crosses your lips, and you nod your head, assuring him that he may.", parse);
					Text.Flush();
					
					Gui.NextPrompt(Scenes.Roa.TSLPitchAnal);
					return;
				}
			}
			else {
				Text.NL();
				Text.Add("<i>”So, umm, how would you like to have me? Like I said, I don’t mind pitching, tho I prefer catching. If you don’t have a dildo, I can ask one of the workers to bring you one. Don’t worry, I’ll make sure to make it squeaky clean for you,”</i> he giggles, licking his lips.", parse);
				Text.NL();
				Text.Add("You lick your lips idly as you consider your answer. Do you want to peg the willing little bunny-slut? Or would you rather enjoy a nice bunny-cock in your needy cunt?", parse);
				Text.Flush();
				//[Peg]
				var tooltip = player.Strapon() ? "He’s just begging to get pegged, and you have the proper equipment to give him what he wants. So why not give this bunny-boy a good butt-fucking?" : "Come on, he’s begging for it; have him call in a toy for you so you can ream his ass.";
				options.push({ nameStr : "Peg",
					func : function() {
						Scenes.Roa.TSLPitchAnal(true);
					}, enabled : true,
					tooltip : ""
				});
			}
			Text.Flush();
			
			//Vaginal
			options.push({ nameStr : "Vaginal",
				func : function() {
					Scenes.Roa.TSLCatchVaginal();
				}, enabled : true,
				tooltip : "Nope, you’ve got an itch you need scratching, and he’s just the one to do it for you. Let’s see just how good he is with his dick instead of his ass."
			});
			
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true,
		tooltip : Text.Parse("You’re in a brothel, he’s clearly willing, why not enjoy a little mutual fun? [cost] coin is hardly a fortune.", parse)
	});
	options.push({ nameStr : "Leave",
		func : function() {
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : Text.Parse("You’re not in the mood for this one.", parse)
	});
	Gui.SetButtonsFromList(options, false, null);
}

//TODO
Scenes.Roa.TSLPitchAnal = function(strapon) {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
}

//TODO
Scenes.Roa.TSLCatchVaginal = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
}
