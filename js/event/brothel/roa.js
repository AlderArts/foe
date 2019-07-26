/*
 * 
 * Define Roa
 * 
 */

import { Entity } from '../../entity';
import { GetDEBUG } from '../../../app';
import { Images } from '../../assets';
import { Race } from '../../body/race';
import { PregnancyHandler } from '../../pregnancy';
import { Text } from '../../text';
import { Gui } from '../../gui';

let RoaScenes = {};

function Roa(storage) {
	Entity.call(this);
	this.ID = "roa";
	
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
	this.body.SetRace(Race.Rabbit);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"]   = Roa.Met.NotMet;
	this.flags["Lagon"] = Roa.Lagon.No;
	this.flags["sFuck"] = 0; //strapon fuck
	this.flags["snug"]  = 0; //snuggle

	if(storage) this.FromStorage(storage);
}
Roa.prototype = new Entity();
Roa.prototype.constructor = Roa;

Roa.Met = {
	NotMet : 0,
	Met    : 1,
	Sexed  : 2
};

Roa.Lagon = {
	No        : 0,
	Talked    : 1,
	Defeated  : 2,
	Restored  : 3,
	SidedWith : 4
};

//TODO
Roa.prototype.Cost = function() {
	return 100;
}

Roa.prototype.Met = function() {
	return this.flags["Met"] >= Roa.Met.Met;
}

//TODO (Met flag?)
Roa.prototype.Recruited = function() {
	return false;
}

Roa.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
}

Roa.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	this.SaveSexFlags(storage);
	
	return storage;
}

// Schedule //TODO
Roa.prototype.IsAtLocation = function(location) {
	return true;
}

RoaScenes.Impregnate = function(mother, load, slot) {
	mother.PregHandler().Impregnate({
		slot   : slot || PregnancyHandler.Slot.Vag,
		mother : mother,
		father : roa,
		race   : Race.Rabbit,
		num    : 3,
		time   : 20 * 24,
		load   : 2 * load
	});
}

// Party interaction //TODO
Roa.prototype.Interact = function() {
	Text.Clear();
	Text.Add("Rawr Imma bunny.");
	
	
	if(GetDEBUG()) {
		Text.NL();
		Text.Add("DEBUG: relation: " + roa.relation.Get(), null, 'bold');
		Text.NL();
		Text.Add("DEBUG: subDom: " + roa.subDom.Get(), null, 'bold');
		Text.NL();
		Text.Add("DEBUG: slut: " + roa.slut.Get(), null, 'bold');
		Text.NL();
	}
	
	Text.Flush();
	Gui.NextPrompt(function() {
		PartyInteraction();
	});
}

RoaScenes.BrothelApproach = function() {
	var parse = {
		playername : player.name
	};
	
	if(roa.Met()) {
		Text.Clear();
		Text.Add("You make your way to the couch where the lusty lapin is lounging.", parse);
		Text.NL();
		if(roa.flags["Lagon"] >= Roa.Lagon.Defeated) {
			Text.Add("He gasps once he sees you approach, and immediately gets down on his knees, bowing respectfully as he looks up at you with gleaming eyes. <i>“It’s my champion! [playername]! What brings you to my humble corner? Is there something I can do to serve you?”</i>", parse);
			Text.NL();
			Text.Add("Smiling, you lay a hand on his shoulder and tell him that he can start by getting up. If you wanted him down on his knees, you’d tell him that.", parse);
			Text.NL();
			Text.Add("<i>“Okay, sure!”</i> he yips, getting back on his feet.", parse);
			Text.NL();
			Text.Add("That’s better, you declare, tapping his shoulder affectionately. You’re not saying you can’t have some fun when he’s down on his knees like that, but you’ll decide when it’s time for that.", parse);
			Text.NL();
			Text.Add("<i>“Whatever you say, mighty champion!”</i> he says, giggling. <i>“So… what can I do for you? Want to take me to the back rooms? I’ll do my best to pleasure you!”</i>", parse);
		}
		else if(roa.Relation() < 20) {
			parse["fem"] = player.mfFem("handsome", "beautiful");
			Text.Add("<i>“Hey there, [fem]. Fancy some bunny love?”</i>", parse);
			Text.NL();
			Text.Add("Though sincere, there’s a certain mechanical tone to the lagomorph’s voice; you know he genuinely is hoping for sex, but that’s just because he likes to fuck in general.", parse);
		}
		else if(roa.Relation() < 50) {
			Text.Add("<i>“Hi, [playername]. Came back for more?”</i>", parse);
			Text.NL();
			Text.Add("Even if it weren’t for the grin on his face, Roa’s tone makes it clear he’s happy to see you. There’s more here than just his general lustiness, he sincerely enjoys the fact you’ve come to see him again.", parse);
			Text.NL();
			Text.Add("Not to say that there’s not a genuine tang of lust in his words, too.", parse);
		}
		else {
			Text.Add("<i>“[playername]! My favorite customer!”</i> he exclaims jumping from his seat to hug you. <i>“Hi! What brings you to my little corner of the room? Want to plug my bum?”</i>", parse);
			Text.NL();
			Text.Add("With a smile and a chuckle, you hug the bunny-boy back, feeling his cock rubbing against your [leg]. He’s just never going to change, is he?", parse);
		}
		Text.Flush();
		
		RoaScenes.BrothelPrompt();
	}
	else
		RoaScenes.First();
}

RoaScenes.BrothelPrompt = function() {
	var parse = {
		cost : Text.NumToText(roa.Cost())
	};
	parse = player.ParserTags(parse);
	
	//[name]
	var options = new Array();
	options.push({ nameStr : "Buy",
		func : function() {
			Text.Clear();
			Text.Add("Roa giggles with glee as you pull him close possessively and start leading the way to the backrooms. Finding a free room, you open it and push the lagomorph inside before locking the door behind you.", parse);
			Text.NL();
			Text.Add("The lapin immediately sets about removing his clothes in a strip tease, showing off his butt and throbbing pink pucker right in the middle of his bubble butt. <i>“I’m all ready!”</i> he declares with a grin.", parse);
			Text.NL();
			if(player.Slut() >= 45) {
				Text.Add("That’s great; now, how about he comes over here to give you a hand with your [armor]? As you say this, you smirk knowingly, crooking a finger to entice the whore to attend you.", parse);
				Text.NL();
				parse["fem"] = player.mfFem("sir", "ma’am");
				Text.Add("<i>“Right away, [fem]!”</i> he replies excitedly as he hops over to you and begins to strip you out of your [armor].", parse);
				Text.NL();
				Text.Add("You lick your lips appreciatively, twisting and turning to help Roa remove your gear, and to show off your increasingly visible assets to their best. When he gets close enough, you can’t resist sending your fingers dancing teasingly over his bobbing erection, feeling the soft, warm flesh under your fingertips.", parse);
				Text.NL();
				Text.Add("<i>“Ooh!”</i> he moans sluttily. <i>“Careful, I might wind up blowing all over your stuff. Don’t wanna get your belonging covered in bunny cream now, do you?”</i> he asks teasingly.", parse);
				Text.NL();
				Text.Add("Not until after you’re done playing with him, you immediately shoot back, pinching his butt gently for emphasis.", parse);
				Text.NL();
				Text.Add("<i>“Oh! You’re so naughty!”</i> he giggles.", parse);
			}
			else {
				Text.Add("You nod your head and quickly move to remove your own [armor], placing it carefully aside once you’re also naked.", parse);
			}
			Text.NL();
			Text.Add("With both of you now totally undressed, you consider what you want Roa to do to you.", parse);
			if(player.FirstCock())
				Text.Add(" Roa has already sunk to his knees, clearly expecting you to want him to put his mouth to work lubing up your [cock] before you bury it into his willing ass.", parse);
			Text.Flush();
			
			var options = new Array();
			options.push({ nameStr : "Fuck him",
				func : RoaScenes.TSLPitchAnal, enabled : true,
				tooltip : "Well he does have a nice-looking butt. So why not do as he wishes and plug it for him?"
			});
			if(player.FirstVag()) {
				options.push({ nameStr : "Vaginal",
					func : RoaScenes.TSLCatchVaginal, enabled : true,
					tooltip : "Give the bunny a shot at your pussy."
				});
			}
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true,
		tooltip : Text.Parse("What else do you do with a whore in a brothel? Take him back and let’s have some fun! If you remember correctly, his fee is [cost] coins.", parse)
	});
	options.push({ nameStr : "Talk",
		func : function() {
			Text.Clear();
			Text.Add("PLACEHOLDER", parse); //TODO
			Text.NL();
			Text.Flush();
			
			RoaScenes.TalkPrompt(RoaScenes.BrothelPrompt);
		}, enabled : true,
		tooltip : ""
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
		Gui.PrintDefaultOptions();
	}); // TODO leave?
}

//TODO
RoaScenes.TalkPrompt = function(backPrompt) {
	var parse = {
		
	};
	
	//[name]
	var options = new Array();
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
	
	/*
	if(burrows.LagonAlly() && roa.flags["Lagon"] < Roa.Lagon.SidedWith) {
		options.push({ nameStr : "",
			func : function() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Flush();
				
				roa.flags["Lagon"] = Roa.Lagon.SidedWith;
				
				roa.relation.DecreaseStat(-100, 50);
				
				RoaScenes.TalkPrompt(backPrompt);
			}, enabled : true,
			tooltip : "" //TODO
		});
	}
	else*/ if(burrows.flags["Access"] >= Burrows.AccessFlags.Stage3 && roa.flags["Lagon"] < Roa.Lagon.Talked) {
		options.push({ nameStr : "Scepter",
			func : function() {
				burrows.flags["Access"] = Burrows.AccessFlags.Stage4;
				roa.flags["Lagon"]      = Roa.Lagon.Talked;
				rigard.flags["Scepter"] = 1;
				
				Text.Clear();
				parse["Ches"] = ches.Met() ? "Ches" : "the huge shark-morph bouncer";
				Text.Add("<i>“Y-you weren’t sent here by my father, were you?”</i> The little bunny visibly shrinks back, looking frightened. You hurriedly assure him that’s not the case, not wanting [Ches] to throw you out for harassing the employees. It takes some convincing and explaining, but Roa eventually calms down.", parse);
				Text.NL();
				Text.Add("<i>“That is right, I’m Ophelia’s brother… and Lagon’s my dad.”</i> Roa shudders, hugging himself. You wonder what the story behind him leaving the Burrows is, but you suppress the urge to ask, letting the bunny continue.", parse);
				Text.NL();
				Text.Add("<i>“So big sis asked you to come...”</i> His ears droop down, and he fidgets nervously. <i>“H-how is she?”</i> There is a twinge of guilt in his voice.", parse);
				Text.NL();
				Text.Add("The little bunny’s expression turns from guilty to aghast as you tell him what has transgressed in the Burrows in his absence. ", parse);
				if(burrows.LagonDefeated()) {
					roa.flags["Lagon"] = Roa.Lagon.Defeated;
					Text.Add("His surprise knows no bounds when you tell him that you’ve defeated Lagon.", parse);
					Text.NL();
					Text.Add("<i>“Impossible!”</i> he spouts. <i>“T-there was no one who could even lay a finger on him in the Burrows! Just how strong are you?!”</i>", parse);
					Text.NL();
					Text.Add("You go on to tell him about the events that transpired after Lagon’s fall, and the search that Ophelia sent you on to help their mother. Roa still seems a bit overwhelmed at all of this, but nods slowly.", parse);
					Text.NL();
					Text.Add("<i>“Well… at least my sister will finally have peace. I should visit her some time… I’ve grown quite attached to this place though.”</i> The lagomorph scratches his head, blushing. You notice that he’s looking at you with new eyes, brimming with respect.", parse);
					roa.relation.IncreaseStat(50, 10);
				}
				else {
					Text.Add("Ophelia is in a really bad spot right now, and she’s convinced that the only thing that could help is to get the scepter back in order to restore Vena.", parse);
					Text.NL();
					Text.Add("<i>“I-I didn’t know it had such value,”</i> Roa pipes guiltily. <i>“Ah… I’ve made a real mess of things...”</i>", parse);
					Text.NL();
					Text.Add("It’s not a problem, he didn’t know about it after all. Besides, the situation might have been considerably more difficult if you had to wrest it from Lagon’s clutch instead. The rabbit doesn’t look very mollified by your reassurance, but he flashes you a quick smile.", parse);
				}
				Text.NL();
				Text.Add("<i>“...Thank you for telling me about this,”</i> Roa whispers, almost too low for you to hear.", parse);
				Text.Flush();
				
				roa.relation.IncreaseStat(50, 10);
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("<i>“...I took the scepter with me when I left. I don’t know why I did it, perhaps to spite dad. It’s not like he was using it anyways, it just laid around the throne room gathering dust.”</i>", parse);
					Text.NL();
					Text.Add("And? Where is it now?", parse);
					Text.NL();
					Text.Add("<i>“I don’t have it anymore,”</i> Roa confesses. <i>“Back when I first got here, I didn’t have any money… I don’t really know why you need money, either. Humans complicate things so much.”</i> He shakes his head, expressing his doubts about economics. <i>“I got a few coins from this guy in the merchant district for it; enough to get some food at least.”</i>", parse);
					Text.NL();
					Text.Add("If the scepter is as valuable as you’ve heard, he probably got the short end of that deal. In fact, it was probably close to highway robbery.", parse);
					Text.NL();
					Text.Add("<i>“I don’t really understand how it works anyways.”</i> The bunny suddenly brightens up. <i>“Imagine how lucky I was to find the Shadow Lady! They give me food and a place to sleep, <b>and</b> I get to fuck all the time! Just like home!”</i> Roa beams, happy to have found his place in the world.", parse);
					Text.NL();
					Text.Add("Focus. The scepter, where is that merchant now?", parse);
					Text.NL();
					Text.Add("<i>“Ah, yes, of course.”</i> Roa gives you instructions on where to find the establishment of the merchant.", parse);
					Text.NL();
					Text.Add("<i>“I heard that he might be going away soon though, a business trip to the free cities. I don’t remember which one.”</i>", parse);
					Text.NL();
					Text.Add("You thank the little lagomorph for the information, and assure him that you’ll do your best in ", parse);
					if(burrows.LagonDefeated()) {
						Text.Add("restoring his mother.", parse);
						Text.NL();
						Text.Add("<i>“I should be thanking <b>you</b>, mighty champion.”</i> Roa blushes, fidgeting. <i>“No reward is enough for what you’ve done already, but I shall give it my all to satisfy your desires!”</i>", parse);
					}
					else {
						Text.Add("bringing down his father.", parse);
						Text.NL();
						Text.Add("<i>“Give this up before you get hurt,”</i> Roa pleads with you. <i>“You don’t know how strong he is!”</i>", parse);
					}
					Text.Flush();
					
					RoaScenes.TalkPrompt(backPrompt);
				});
			}, enabled : true,
			tooltip : "Ask if he’s Ophelia’s brother; and if that’s so, what he’s done with Lagon scepter."
		});
	}
	else if(burrows.LagonDefeated() && roa.flags["Lagon"] < Roa.Lagon.Defeated) {
		options.push({ nameStr : "Lagon",
			func : function() {
				Text.Clear();
				roa.flags["Lagon"] = Roa.Lagon.Defeated;
				Text.Add("<i>“Y-you did what?”</i> Roa looks shocked at your revelation, disbelief clear in his eyes. <i>“That’s impossible! No one in the Burrows could even touch my father! J-just how strong are you?!”</i>", parse);
				Text.NL();
				Text.Add("Once he has accepted your tale, the lagomorph’s expression changes to one brimming with respect; it’s almost worshipful. He hesitantly puts a trembling hand on your chest, poking at you to make sure you are really flesh and blood and not some demigod come down to Eden.", parse);
				Text.NL();
				Text.Add("<i>“Tell me, what of my sister?”</i> he asks. You fill him in on what happened after Lagon’s fall, the bunny listening to you attentively.", parse);
				Text.NL();
				
				roa.relation.IncreaseStat(50, 10);
				
				if(burrows.flags["Access"] >= Burrows.AccessFlags.QuestlineComplete)
					RoaScenes.RestoredVenaTalk();
				else {
					Text.Add("<i>“I cannot thank you enough.”</i> Roa bows his head humbly. <i>“You have freed my sister, and for that, you have my eternal gratitude.”</i>", parse);
				}
				Text.Flush();
				
				RoaScenes.TalkPrompt(backPrompt);
			}, enabled : true,
			tooltip : "Tell him about how you defeated Lagon."
		});
	}
	else if(burrows.VenaRestored() && roa.flags["Lagon"] < Roa.Lagon.Restored) {
		options.push({ nameStr : "Vena",
			func : function() {
				Text.Clear();
				RoaScenes.RestoredVenaTalk();
				Text.Flush();
				
				RoaScenes.TalkPrompt(backPrompt);
			}, enabled : true,
			tooltip : "Tell him about how you restored Vena."
		});
	}
	
	Gui.SetButtonsFromList(options, true, function() {
		backPrompt();
	});
}

RoaScenes.RestoredVenaTalk = function() {
	var parse = {
		
	};
	
	Text.Add("<i>“Y-you even got mother back to her old self?!”</i> There’s tears in Roa’s eyes, and he gives out a happy whoop as he jumps you, hugging you tightly. You let him be, patting his head awkwardly as he showers you in praise and kisses. Before his carnal instincts kick in, you disentangle yourself from the excited rabbit. Enough time for that later.", parse);
	Text.NL();
	Text.Add("<i>“I must visit sister and mother sometime...”</i> the bunny ponders, looking a bit guilty at having run away. He may find Vena a changed person from who she was before...", parse);
	Text.NL();
	Text.Add("<i>“I really cannot thank you enough.”</i> Roa bows his head humbly. <i>“You have freed my sister and cured my mother, and for that, you have my eternal gratitude.”</i>", parse);
	
	roa.relation.IncreaseStat(50, 10);
}

RoaScenes.First = function() {
	var cost   = roa.Cost();
	var p1cock = player.BiggestCock();
	
	var parse = {
		cost : Text.NumToText(cost)
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	roa.flags["Met"] = Roa.Met.Met;
	
	Text.Clear();
	Text.Add("As you make your way through the crowds and couches, you’re able to get a better look at the bunny. She’s a dainty little thing, as you’d expect a rabbit-morph to be; petitely built, but feminine, and covered in pink-tinged white fur. Her hair is long and kind of messy, falling forward over beautiful baby-blue eyes, but it’s an interesting sort of disheveled look.", parse);
	Text.NL();
	Text.Add("Close enough, you realize that this is no bunny-girl... it’s a bunny-<b>boy</b>. Though you had initially thought him to be a flat-chested girl, the tightness of the clothes he’s wearing - little more than an array of straps and patches of brown leather - reveals his fundamental masculinity. The fact it’s crotchless and exposes his not so little dick, pink and jutting against his girly thighs, certainly doesn’t hurt.", parse);
	Text.NL();
	parse["fem"] = player.mfFem("mister", "ma’am");
	Text.Add("<i>“Hey there, [fem]. Looking for some fun?”</i> he asks with a shy smile.", parse);
	Text.NL();
	Text.Add("You can’t help but note that despite the shyness of his smile, and the timid tone of his voice, those blue eyes are fixated on you, open wide so he can practically drink in every part of you. Especially your crotch. Smiling politely, you tell him that might be the case, and ask him who he is.", parse);
	Text.NL();
	Text.Add("<i>“My name is Roa. I haven’t been here very long, to be honest. So I’m still adjusting, but I’ll try my best to fulfill any desire you got,”</i> he smiles again.", parse);
	Text.NL();
	Text.Add("He certainly has the attitude right; he genuinely sounds enthusiastic about it.", parse);
	if(burrows.flags["Access"] >= Burrows.AccessFlags.Stage3)
		Text.Add(" Roa... why does that name sound familiar...?", parse);
	Text.NL();
	if(player.FirstCock()) {
		Text.Add("<i>“I’m not going to lie to you [fem], but [thatThose] cock[notS] you’re hiding in there,”</i> he points at your crotch. <i>“[ItThey] smell[notS] delicious...”</i> he sniffs the air with a smile, taking in your scent and relishing in it. <i>“Mouthwatering, really,”</i> he licks his lips. <i>“It’s a bit hard for me to contain myself. I keep wondering how [itThey]’d feel inside. Care to show me?”</i>", parse);
		Text.NL();
		Text.Add("The rabbit’s little tongue dabs nervously at his lips, and he rubs his thighs together impatiently. His cock is fully erect, jutting like a defiant pillar of pinkness against his white fur. He’s clearly not acting; he means every word he just said. What a slut...", parse);
		Text.NL();
		if(player.Slut() >= 45)
			Text.Add("You lick your own lips appreciatively at his enthusiasm. He may be your kind of guy. Playfully,", parse);
		else
			Text.Add("You can’t help but shuffle nervously at his enthusiasm. You know he’s a... well, a whore, but it’s still a little overwhelming. Nervously,", parse);
		Text.Add(" you ask if he likes cocks.", parse);
		Text.NL();
		Text.Add("<i>“Uhum,”</i> he replies, nodding emphatically. <i>“I love cocks. The hardness, the taste, the cum. How it throbs when it impales me...”</i> he trails off dreamily. <i>“Oh please [fem]! Can we do it now?”</i> he asks, biting his lip. Just how needy is this rabbit!?", parse);
		Text.NL();
		Text.Add("Well, with such clear enthusiasm, it’s hard to think of anything else to ask him. Maybe you should consider buying a round with him...", parse);
	}
	else {
		Text.Add("<i>“So, how about it? You buy me and we duck out in one of them rooms for some fun. I’ll admit I’m better at catching than pitching, but for someone as good looking as you,”</i> he looks you over again, grinning. <i>“Well, I wouldn’t mind doing some pitching,”</i> he adds, showing off his erect cock.", parse);
		Text.NL();
		Text.Add("Bemused, although a little flattered, you ask what he means about being better at catching; does he prefer his partners to have cocks?", parse);
		Text.NL();
		Text.Add("<i>“To be honest, yes. Of course, I’m also into girls that like pegging...”</i> he trails off into a giggle.<i>“ But you’re the customer, and I’ve been told the customer is always right. So, I’ll do whatever you want. Just consider buying me, please, I haven’t had action in a while...”</i> he says, trembling a little in pent-up lust.", parse);
		Text.NL();
		Text.Add("The sight really is kind of pitiful, and it’s pretty clear he’s not in much of a mood for further conversation. You should probably make up your mind if you want to fuck him or not.", parse);
	}
	Text.NL();
	Text.Add("<i>“I’m pretty cheap, since I just started working here. A mere [cost] coins will be enough. You can spare that, can’t you?”</i>", parse);
	Text.Flush();
	
	//[Buy] [Leave]
	var options = new Array();
	options.push({ nameStr : "Buy",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Great! Come with me!”</i> he says, springing to his feet and grabbing your [hand].", parse);
			Text.NL();
			Text.Add("You can’t hold back a smile at the sight of his enthusiasm, and hurry to keep up with the quick-moving little lapin. For someone so dainty, he sure can be insistent when he wants to be.", parse);
			Text.NL();
			Text.Add("Roa leads you through a hallway, clearly where the Shadow Lady keeps the bulk of its private rooms. The corridor is fairly long, and lined with doors, all of them sporting numbers and in one of three states. Some of the doors are open with their interior exposed - maids move hastily into those, so they must be rooms that have been used and are being cleaned up. Other doors are closed; some of these have keys hanging from delicate chains around the knobs, and others don’t.", parse);
			Text.NL();
			Text.Add("When Roa leads you to one of the closed, key-bearing doors and unlocks it before leading you inside, your suspicions are confirmed; the keys signify rooms ready to be used by the customers.", parse);
			Text.NL();
			Text.Add("The inside is not at all what you expected. It’s a small, neatly kept room, the bulk given over to a large bed underneath a shining-clean ceiling mirror. Another door on the opposite wall leads to what you presume is a bathroom. Lush carpeting lays under your [feet], and the walls are covered in tasteful wallpaper, embroidered with heart print pattern. A small bedside table sports a single colorful candle, the likely source of the faint herbal scent that permeates the room.", parse);
			Text.NL();
			Text.Add("The eager lapin wastes no time, undoing the binding of his clothing with practiced ease. In no time at all, he’s stark-naked and his fetish clothes are strewn about the room’s carpeted floor. <i>“Want me to help you undress?”</i> he offers tentatively, kneeling beside you to grip your [botarmor].", parse);
			Text.NL();
			Text.Add("Unthinkingly, you dab at your lips with your [tongue]. Well, since he’s so eager, why not? You nod, and tell him that you would like that.", parse);
			Text.NL();
			Text.Add("Roa’s eyes practically glint at your reply. He begins stripping you, bit by bit, taking advantage of the situation and exploring your body with his eager handpaws. His cock bobs with his movement, throbbing in excitement. If you didn’t know better, you’d say he’s ready to blow from excitement alone…", parse);
			Text.NL();
			Text.Add("<i>“There, all done,”</i> he declares, tucking your clothes inside the wardrobe.", parse);
			
			var herm = player.FirstCock() && player.FirstVag();
			
			var options = new Array();
			
			if(player.NumCocks() > 1) {
				Text.NL();
				Text.Add("The horny rabbit turns to face you, a giggle bubbling from his grinning lips. <i>“All that, for me? You shouldn’t have...”</i> he says, kneeling in front you, sniffing your [cocks]. <i>“May I?”</i> he asks, laying a hand on your [cock].", parse);
				if(herm) {
					options.push({ nameStr : "Fuck him",
						func : RoaScenes.TSLPitchAnal, enabled : true,
						tooltip : "Give the needy bunny a rough anal ride."
					});
				}
				else {
					Text.NL();
					Text.Add("Smirking, you can’t help but tell him to go right ahead.", parse);
					Text.Flush();
					
					Gui.NextPrompt(RoaScenes.TSLPitchAnal);
					return;
				}
			}
			else if(player.FirstCock()) {
				Text.NL();
				Text.Add("The horny rabbit turns to face you, a giggle bubbling from his grinning lips. <i>“Now, let’s get to know that hard [cock] of yours,”</i> he says, kneeling in front of you and sniffing your musk. <i>“So enticing… May I?”</i> he asks, laying a hand on your [cock].", parse);
				
				if(herm) {
					options.push({ nameStr : "Fuck him",
						func : RoaScenes.TSLPitchAnal, enabled : true,
						tooltip : "Give the needy bunny a rough anal ride."
					});
				}
				else {
					Text.NL();
					Text.Add("A grin of anticipation crosses your lips, and you nod your head, assuring him that he may.", parse);
					Text.Flush();
					
					Gui.NextPrompt(RoaScenes.TSLPitchAnal);
					return;
				}
			}
			else {
				Text.NL();
				Text.Add("<i>“So, umm, how would you like to have me? Like I said, I don’t mind pitching, though I prefer catching. If you don’t have a dildo, I can ask one of the workers to bring you one. Don’t worry, I’ll make sure to make it squeaky clean for you,”</i> he giggles, licking his lips.", parse);
				Text.NL();
				Text.Add("You lick your lips idly as you consider your answer. Do you want to peg the willing little bunny-slut? Or would you rather enjoy a nice bunny-cock in your needy cunt?", parse);
				Text.Flush();
				//[Peg]
				var tooltip = player.Strapon() ? "He’s just begging to get pegged, and you have the proper equipment to give him what he wants. So why not give this bunny-boy a good butt-fucking?" : "Come on, he’s begging for it; have him call in a toy for you so you can ream his ass.";
				options.push({ nameStr : "Peg",
					func : RoaScenes.TSLPitchAnal, enabled : true,
					tooltip : tooltip
				});
			}
			Text.Flush();
			
			//Vaginal
			options.push({ nameStr : "Vaginal",
				func : function() {
					RoaScenes.TSLCatchVaginal();
				}, enabled : true,
				tooltip : "Nope, you’ve got an itch you need scratched, and he’s just the one to do it for you. Let’s see just how good he is with his dick instead of his ass."
			});
			
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true,
		tooltip : Text.Parse("You’re in a brothel, he’s clearly willing, why not enjoy a little mutual fun? After all, [cost] coin is hardly a fortune.", parse)
	});
	options.push({ nameStr : "Leave",
		func : function() {
			Gui.PrintDefaultOptions();
		}, enabled : true,
		tooltip : Text.Parse("You’re not in the mood for this one.", parse)
	});
	Gui.SetButtonsFromList(options, false, null);
}

RoaScenes.TSLPitchAnal = function() {
	if(roa.flags["Met"] < Roa.Met.Sexed)
		roa.flags["Met"] = Roa.Met.Sexed;
	
	var p1cock = player.BiggestCock(null, true);
	
	var parse = {
		playername : player.name
	};
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = player.ParserTags(parse);
	
	var mStrap  = false;
	var strapon = p1cock ? p1cock.isStrapon    : false; //Regular
	var knot    = p1cock ? p1cock.knotted != 0 : false;
	
	Text.Clear();
	if(player.FirstCock()) {
		Text.Add("Since Roa has so nicely gotten into the proper position, it would be a shame to waste it. Crossing the distance between you, your hand reaches out to possessively clutch at his head, guiding his mouth to[oneof] your bobbing [cocks] until his nose is rubbing along the sensitive flesh of your [cock].", parse);
		Text.NL();
		if(p1cock.Thickness() >= 8)
			Text.Add("<i>“Ooh...”</i> he shivers at the sight of your massive cock. <i>“I need you inside me!”</i>", parse);
		else
			Text.Add("<i>“Mm… nice and juicy,”</i> he moans.", parse);
		Text.Add(" The lapin whore needs no prompting to start sucking and licking your shaft with abandon. His technique is pretty good and his enthusiasm unabated. He blows you with a deep hunger that only serves to make the act more erotic.", parse);
		Text.NL();
		Text.Add("Sparks of pleasure crackle along your [skin], and you can’t help but moan your satisfaction with the lagomorph’s oral skills. For a moment, you are sorely tempted to just give yourself over to the hungry wetness of his mouth, to let him suck and gulp and swallow until you have emptied yourself into his waiting belly. But the moment passes and, with a final shudder, you push him away, his mouth popping as it leaves your now-dripping dick.", parse);
		Text.NL();
		Text.Add("Inhaling deeply to keep yourself under control, shaft[s] dripping precum onto the carpet below, you instruct the lapin to get up on the bed and present himself, lest you simply take him right here on the floor...", parse);
		Text.NL();
		Text.Add("<i>“Hmm, that sounds like an enticing idea, but you’re the boss.”</i> He gets up and turns on his heels, hopping onto the bed and raising his butt high up into the air. The bunny then pops two fingers inside his pucker, stretching it out and holding it open for you.", parse);
		Text.NL();
		Text.Add("Eager little slut... Grinning at Roa’s antics, you quickly move to join him on the bed, springs squeaking slightly in protest at your added weight as you crawl up behind him, already bringing your [cock] in line with his ass.", parse);
		Text.NL();
		Text.Add("<i>“Come on! Jam it in!”</i> he begs, releasing his ass and bucking back against you.", parse);
		Text.NL();
		Text.Add("You scold him to wait for you like a good little bunny, eliciting a quiet grumble of protest from the rabbit-morph. Your hands reach out for his waist, circling his hips and taking hold as he moans anticipation. Seeing no reason to tease him further, you shuffle your hips forward and start to push your [cockTip] against his anus...", parse);
		Text.NL();
		Text.Add("The bunny’s butthole opens up to receive you as readily as his mouth did earlier, warm flesh wrapping around your intruding shaft in welcome. He’s a little loose, but mostly there’s just plenty of give to him; Roa’s got an ass just made for fucking, it seems, and it makes for an effortless penetration.", parse);
	}
	else if(player.Strapon()) {
		Text.Add("Fishing amongst your belongings, you draw forth your [cock] and strap it into its proper place about your loins. Double-checking that it’s properly assembled, you cast your best bedroom eyes at the lapin whore, instructing him to get on his knees and open his mouth.", parse);
		Text.NL();
		Text.Add("Roa does what you say without hesitation, licking his lips before opening his mouth as wide as he can and closing his eyes, just waiting for his bounty.", parse);
		Text.NL();
		Text.Add("Since Roa has so nicely gotten into the proper position, it would be a shame to waste it. Crossing the distance between you, your hand reaches out to possessively clutch at his head, guiding his mouth to your [cockTip] and carefully sliding it through his lips.", parse);
		Text.NL();
		Text.Add("The rabbit needs no input before he starts licking and sucking on your [cock]. He bobs his head as if your [cock] was real, stopping only when he deems you sufficiently lubed.", parse);
		Text.NL();
		Text.Add("<i>“There we go, now how about you put it in my bum?”</i> he suggests, turning on his heels and hopping onto the bed. He shakes his butt enticingly as he looks back at you, tail lifted up to provide easy access.", parse);
		Text.NL();
		Text.Add("Eager little slut... Grinning at Roa’s antics, you quickly move to join him on the bed, springs squeaking slightly in protest at your added weight as you crawl up behind him, already bringing your artificial [cock] in line with his ass.", parse);
		Text.NL();
		Text.Add("<i>“Come on! Jam it in!”</i> he begs, bucking back against you.", parse);
		Text.NL();
		Text.Add("You scold him to wait for you like a good little bunny, eliciting a quiet grumble of protest from the rabbit-morph. Your hands reach out for his waist, circling his hips and taking hold as he moans anticipation. Seeing no reason to tease him further, you shuffle your hips forward and start to push your [cockTip] against his anus...", parse);
		Text.NL();
		Text.Add("A sighing moan of appreciation fills your [ears] as you slide inside. With your artificial toy, you can’t feel what he’s like inside properly, but clearly there’s plenty of give to him; your [cock] glides in smooth and steady, not the slightest effort needed to get yourself inside.", parse);
	}
	else { //No strap-on
		Text.Add("<i>“Alright, I’ll go fetch your strap-on. Don’t move an inch, beautiful!”</i> he finishes, dashing off the door, not caring that he’s completely naked.", parse);
		Text.NL();
		Text.Add("Gone too quickly for you to even admire the fine ass you’ll soon be fucking, you settle back against the bed and wait for Roa to return.", parse);
		Text.NL();
		Text.Add("You don’t have to wait long, as the bunny-boy returns with said strap-on. <i>“Here you go! I made sure it was clean,”</i> he says, licking his lips.", parse);
		Text.NL();
		if(rigard.Brothel["MStrap"] == 0) {
			Text.Add("When you see what Roa has brought you, the first emotion you feel is confusion. The dildo he’s brought is clearly made of rubber, but it’s been designed to resemble a still-flaccid cock - it’s useless!", parse);
			Text.NL();
			Text.Add("Baffled, you look at Roa, expecting an answer for this.", parse);
			Text.NL();
			Text.Add("He simply stares expectantly at you. <i>“Go on, put it on!”</i> he says excitedly.", parse);
			Text.NL();
			Text.Add("Feeling a little stupid, you relent and decide to humor him. Once it’s in place about your waist, you can look it over better, seeing that it’s been designed to look like a human cock.", parse);
			Text.NL();
			Text.Add("Shrugging your shoulders, you ask Roa what happens now.", parse);
			Text.NL();
			Text.Add("<i>“Just relax and let me handle this,”</i> he grins, getting down on his knees and setting his hands on your [hips].", parse);
			Text.NL();
			Text.Add("You stare at Roa in confusion, then let out a yelp of surprise as you feel something warm and wet slide ticklishly over something down there. Looking closer, you can see Roa opening his mouth to lick again at the dildo hanging at your waist, and you quiver as the warm wetness alerts you again. Pleasure tingles along your spine, and you realize that, somehow, you’re actually feeling what Roa is doing!", parse);
			Text.NL();
			Text.Add("The lapin whore looks up at you, smiling as he gently takes the tip of dildo inside his mouth, sucking lightly on the glans, sending unfamiliar pleasure coursing through your body.", parse);
			Text.NL();
			Text.Add("You moan quietly in appreciation, a shiver racing under your skin at Roa’s efforts. This feels so good... Without thinking, a hand rests on Roa’s head, gripping him softly as you babble encouragement at him to work his mouth harder. You can feel yourself growing stiffer with each lick and suckle, your very own erection blooming between your thighs.", parse);
			Text.NL();
			Text.Add("Releasing your prosthetic shaft, Roa licks his lips and grins up at you. <i>“Ready?”</i>", parse);
			Text.NL();
			Text.Add("Swallowing hard, you look down at your loins, seeing the saliva-slick nine inches of enchanted faux-cock bobbing there. With an anticipatory grin, you assure Roa that you’re more than ready.", parse);
			Text.NL();
			Text.Add("Without missing a beat, the bunny-boy turns around and hops on the bed, bending over to lift his butt high up in the air.", parse);
			Text.NL();
			Text.Add("Clambering on up behind Roa, your hands take him by the hips to keep him steady. You line your pseudo-cock with his twitching little bunny-bum and start to push forward. Warm flesh wraps around your fake shaft welcomingly, the little slut’s ass stretching effortlessly to fit your intruding cock, and the enchantments let you feel every inch of silky flesh gliding over your dick as if it really were your own.", parse);
		}
		else {
			Text.Add("You immediately recognize the same enchanted dildo that Roa gave you before, and waste no effort in strapping it on. Your fingers glide over the length of enchanted rubber, a quiver running up your spine at the unfamiliar and yet so delicious sensations. By the time Roa is on his knees, you’re already partially erect, ready to slide it into his welcoming mouth.", parse);
			Text.NL();
			Text.Add("The bunny-boy grins up at you, opening his mouth to welcome your prosthetic shaft.", parse);
			Text.NL();
			Text.Add("You need no further encouragement and slide it in, moaning in pleasure as Roa starts to suckle away with all the enthusiasm of a baby at the teat. Your nerves spark and sing with pleasure, and a tiny voice raises a quiet wish about keeping this feeling before you swat it aside, basking in the comforts of Roa’s eager ministrations.", parse);
			Text.NL();
			Text.Add("Once the lapin whore judges you sufficiently lubricated, he releases you and gets back onto his feet. With a seductive leer, he turns on his heels and hops on the bed, lifting his bum high up in the air to welcome your twitching shaft.", parse);
			Text.NL();
			Text.Add("You waste no time in springing up to join him. Clutching him by the waist, you line your pseudo-cock up and start sinking it into the warm, welcoming embrace of his asshole, moaning in pleasure as he gives so readily to your thrust.", parse);
		}
		
		p1cock = Scenes.Brothel.NewMStrap();
		rigard.Brothel["MStrap"]++;
		mStrap = true;
		
		parse["cock"] = function() { return p1cock.Short(); }
	}
	Text.NL();
	
	Sex.Anal(player, roa);
	roa.FuckAnal(roa.Butt(), p1cock, 3);
	player.Fuck(p1cock, 3);
	
	if(roa.Relation() < 20) {
		Text.Add("<i>“Oooh!”</i> he moans lewdly. <i>“No need to hold yourself back, stud. I’m well trained. So go ahead and fuck me as hard as you want,”</i> he says, clenching his pucker for emphasis.", parse);
		Text.NL();
		Text.Add("Well, if that’s what he really wants, you’ll give it to him alright...", parse);
	}
	else if(roa.Relation() < 40) {
		Text.Add("<i>“Come now, [playername]. You know I love getting a hard dick up my ass. No need to hold back. Give it to me hard, give it to me good!”</i> he exclaims, clenching his butthole.", parse);
		Text.NL();
		Text.Add("You’re more than willing to please him, so if that’s what he wants...", parse);
	}
	else {
		Text.Add("<i>“[playername], you know me. I love your sweet side, but I also love getting railed like crazy. So go ahead, let loose. Fuck my ass like you mean it. You know I can take it. We can cuddle afterward,”</i> he says, bucking back against you and clenching his ass.", parse);
		Text.NL();
		Text.Add("You can’t hold back a chuckle; doesn’t little Roa know you better than that? You’re going to give him what he needs, you just need a moment to get warmed up...", parse);
	}
	Text.NL();
	parse["knothilt"] = knot ? "knot" : "hilt";
	Text.Add("With a grunt of effort, you draw yourself back until you almost pop free, and then slam home, burying yourself nearly to the [knothilt] in a single powerful motion. Roa rocks at the force of your impact, a squeak escaping him, before you pull out and slam in again. Rough and firm, you start to build up steam, humping the lapin’s ass as strongly as you can.", parse);
	Text.NL();
	if(p1cock.Thickness() >= 8)
		Text.Add("<i>“Ah! Fuck yes! Take me!”</i> Roa moans unabashedly, humping back against you as he tries to jam your massive member into his ass. <i>“You’re so - unf - <b>big</b>!”</i> he groans. <i>“F-filling me up, s-so good!”</i> <i>Someone</i> is a bit of a size queen.", parse);
	else
		Text.Add("<i>“Ah! Yeah! This is paradise...”</i> Roa says airily, humping back against you, intent on taking everything that you have and more.", parse);
	Text.NL();
	Text.Add("You can’t hold back a satisfied smirk at that. If he’s so enamored with just your efforts back here, then what if...? Your hand creeps up under his waist, fingers feeling for the warm, pre-slick length of throbbing fuckflesh there. Finding your target, you wrap your fingers around it, squeezing it possessively.", parse);
	Text.NL();
	parse["fem"] = roa.Relation() >= 20 ? player.name : player.mfFem("sir", "ma’am");
	Text.Add("The bunny-slut moans at your touch. <i>“Aaah! You are so kind, [fem]. Most people won’t even bother giving me a reacharound,”</i> he says.", parse);
	Text.NL();
	Text.Add("You stretch yourself over Roa’s back, your teeth closing over one floppy earlobe. They bite down just hard enough to let him feel the pressure, but without inflicting any damage. Releasing it, you stage-whisper into the ear you just bit that you aren’t most people, your free hand tucking itself possessively around his chest. Feeling for the pebbled pearl of his nipple.", parse);
	Text.NL();
	Text.Add("Roa grips the sheets below, thrusting into your [hand] and then bucking back into your own pumping hips. The smell of sex and wet slapping of flesh on flesh permeates the room; the lapin whore’s delighted moans joining your own grunts of pleasure. <i>“M-More!”</i> he pleads between gasps. <i>“Harder!”</i> he moans. <i>“Faster!”</i> he cries.", parse);
	Text.NL();
	if(player.FirstCock() || mStrap) {
		Text.Add("You moan in desire, even as you do your best to fuck the lagomorph the way he’s begging you to. It’s not easy, even with how badly you want to; the little bunny-slut’s asshole is like a vice lined in hot velvet, almost audibly sucking your [cock] in. Pleasure races up your spine, tingling underneath your skin, shivering through your body as Roa’s tailhole milks you greedily, determined to make you cum so badly it’s almost impossible to pull yourself free.", parse);
	}
	else {
		Text.Add("You’d just love to comply, but it’s proving a little trickier than you’d expect. Roa’s butt is clenching your [cock] so tightly that you have to struggle just to pull it out with each thrust. Determined to get your money’s worth, you grit your teeth and redouble your efforts, squelching and slurping as you rut Roa with all your might.", parse);
	}
	Text.NL();
	Text.Add("Your efforts pay off beautifully, Roa’s moans of pleasure filling your ears like the sweetest of symphonies as he writhes in pure rapture beneath you. The lapin whore has abandoned any sense of restraint, just totally consumed in pleasure at your hands, a cock-worshipper who has found his own perverse nirvana.", parse);
	Text.NL();
	if(player.SubDom() >= 20) {
		Text.Add("You lick your lips in delight. This, this is what you long for in a partner. Someone who knows how helpless they are before you, yet who loves you for it. The petite little bunny-boy’s pleading eyes, just begging you to take him and show that you own him. His moans are those of the purest of pleasures, echoing through every fiber of his being as you pound him into the bed, staking your ownership of his person. He’s nothing more than a toy for your pleasure, prey fit for you to hunt... and he knows it. He craves it.", parse);
		Text.NL();
		if(roa.Relation() >= 40)
			Text.Add("Gods, that’s why you love him so much.", parse);
		else
			Text.Add("You could really love a partner like him.", parse);
		
		player.subDom.IncreaseStat(50, 1);
		roa.relation.IncreaseStat(50, 1);
	}
	else if(player.SubDom() >= -20) {
		Text.Add("You don’t really considered yourself a dominant sort of person. But there’s just something about Roa... his eager writhing beneath you, the whimpers of pure pleasure, the pleading for ‘more!’ and ‘harder!’...", parse);
		Text.NL();
		Text.Add("It’s as if the very crux of his existence has boiled down to be about you, as if he is nothing more than an outlet for your own pent-up sexual frustrations. You desire release, and he desires nothing more than to give you that release.", parse);
		Text.NL();
		Text.Add("You feel like you own Roa, like you can do anything you want to him, fuck him without care or mercy, and he’ll not only let you do it, he’ll love you for doing it.", parse);
		Text.NL();
		Text.Add("You realize that you like this feeling...", parse);
		
		player.subDom.IncreaseStat(50, 1);
	}
	else {
		Text.Add("Nervously, your tongue dabs at your lips as you take in Roa’s writhing form, lost in the depths of slutty passion. There’s no angst here, no complaints, just pure submission and self acceptance. The bunny is nothing more than a sleeve for your cock, a tool for your pleasure, and his face shows the bliss he feels in welcoming this role.", parse);
		Text.NL();
		Text.Add("It’s a feeling you know all too well, a sensation that you have shared in the past, and though the wish it were you enjoying this comes to mind, you push yourself harder nonetheless. Aware of the pleasure that he is feeling, how can you not give him your all so you can bring your lapin slut the true pleasure of submission? For him, you’ll be his master... this time, at least.", parse);
	}
	Text.NL();
	parse["Master"] = player.mfFem("Master", "Mistress");
	Text.Add("<i>“Ahn! [Master]! I’m going to cum!”</i> he cries out. And by the way his cock is throbbing in your grasp, you have no doubt of the veracity of his claims.", parse);
	Text.NL();
	if(player.FirstCock() || mStrap) {
		Text.Add("At once, your fingers move, tightening their grip to pinch Roa’s cumvein shut. As he squeals pitifully, you chastise him; <b>you</b> cum first. <b>Then</b> he gets to cum.", parse);
		Text.NL();
		parse["master"] = player.mfFem("master", "mistress");
		Text.Add("<i>“Ahn! Yes, [master]!”</i> he cries out excitedly. Enjoying being denied as you take your pleasure, no doubt.", parse);
		Text.NL();
		Text.Add("Feeling the nervous trembling between your fingers, despite Roa’s desire to be a good boy, is all of the encouragement you needed. You ravage his ass mercilessly, crushing his prostate like an egg under a guardsman’s boot as you buck and thrust. You’re so close you can almost taste it...", parse);
		Text.NL();
		Text.Add("Finally, with a cry of pleasure, you slam yourself as deeply into Roa’s guts as you can and let fly, practically exploding in his ass as spurts of seed gush forth from your [cock]. Your hand abandons Roa’s cock to hold him close, ensuring he can’t escape your efforts at flooding his stomach with seed.", parse);
		Text.NL();
		
		var cum = player.OrgasmCum();
		
		if(cum > 6) {
			Text.Add("Roa moans plaintively as your creamy cascade erupts inside him. The little bunny’s stomach grows like a watermelon in fast forward, bloating up and out with each heartbeat as you fire shot after gushing shot into his ass. Rivers of seed flow out around your shaft, soaking his thighs, and still he balloons, lifting clear off the bed from the sheer volume of cum crammed inside him. By the time you finish, you feel certain he’d be the envy of any female broodmother wannabe among his own kind with how swollen he is.", parse);
		}
		else if(cum > 3) {
			Text.Add("Thick ropes of cream fill Roa, flooding into his stomach with such vigor and volume that he begins to swell like the condom you’ve used him as. With liquid groans, the lapin wriggles beneath you in pleasure even as his belly bulges out, looking well and truly stuffed with cum by the time you finish.", parse);
		}
		else {
			Text.Add("The lapin’s greedy little ass swallows every last drop you unleash without so much as a hiccup, barely a hint of pudge on his tight little belly left for show in result of your efforts. Indeed, even as you finish spending yourself, his ass still milks you rhythmically, as if hoping to coax more from you.", parse);
		}
		Text.NL();
		
		roa.OrgasmCum();
		
		Text.Add("The bunny-whore moans as the last of his seed escapes him, having achieved orgasm as you were filling him with your own payload. His strength gives out and he collapses atop the puddle of cum of his own making, a sigh of relief escaping his lips. <i>“Ahh… this is paradise...”</i> he says airily, turning to look at you with a smile.", parse);
		Text.NL();
		Text.Add("Well, you mightn’t go quite that far... but, he’s not exaggerating too much, you add, smirking back at him.", parse);
		Text.NL();
		Text.Add("<i>“Can I clean this up for you?”</i> he asks, turning on his back and pointing at your [cock].", parse);
		Text.NL();
		Text.Add("You drum your fingers thoughtfully against your chest for a moment, making a show of thinking it over. As the lapin’s eyes widen in a pleading expression, you finally decide to show mercy, and tell him to get started. You think he did good enough that he deserves an extra treat.", parse);
		Text.NL();
		Text.Add("<i>“Thank you,”</i> he smiles, clambering up to crawl toward you.", parse);
		Text.NL();
		Text.Add("You roll over onto your side, laying on your back and making yourself comfortable, positioning yourself so the lagomorph has unrestricted access to your crotch.", parse);
		Text.NL();
		Text.Add("Roa sniffs your crotch and licks his lips, then begins lapping your [cock].", parse);
		Text.NL();
		Text.Add("You favor Roa’s efforts with an appreciative moan, verbally guiding him through his ministrations, praising him for his adeptness when you feel he warrants it.", parse);
		Text.NL();
		Text.Add("He sucks on you like a straw, stroking you to make sure he’s got every last drop you have to offer. He only stops drinking to lick the remainder of your shaft, ensuring you’re completely clean.", parse);
		if(player.NumCocks() > 1)
			Text.Add(" Your other cock[notS] receive the same treatment. He even goes back to the first one, alternating between each shaft with a happy smile.", parse);
		Text.NL();
		if(player.HasBalls()) {
			Text.Add("Once he’s finished, Roa ducks lower to lick your [balls] next. Seems like the lapin wants to make sure he does a thorough job. You simply lay back and let him finish cleaning you up. You groan when he stops to massage your balls with his tongue. Looking down at him, all you see is a mischievous smile as he gives one of your nuts a kiss.", parse);
			Text.NL();
		}
		if(player.FirstVag()) {
			Text.Add("A surprised yelp of pleasure escapes you as you feel a familiar tongue touch your [vag]. Seems like not even your womanhood is safe from the lusty rabbit...", parse);
			Text.NL();
		}
		Text.Add("<i>“There, I think I got everything. Though if you want me to be more thorough, I’d be happy to oblige,”</i> he says with a grin, falling back on his haunches and licking his finger.", parse);
		Text.NL();
		Text.Add("You make a show of looking yourself over, then slowly shake your head, proclaiming your satisfaction with what Roa has done.", parse);
	}
	else if(strapon) {
		var first = 
		
		Text.Add("Your hand abandons its place at the bunny’s cock to instead trail down lower. As your other hand toys with Roa’s nipples, you bend closer to his ear and whisper to him, telling him to cum, then. As you do so, you plunge your [cock] ", parse);
		if(knot)
			Text.Add("as far as it’ll go without knotting the lapin whore,", parse);
		else
			Text.Add("to the very hilt in his ass,", parse);
		Text.Add(" your fingers curling around his bulging nuts and squeezing them sharply.", parse);
		Text.NL();
		
		roa.OrgasmCum();
		
		Text.Add("Roa cries out as his cock trembles, spewing forth a small jet of cum. The first jet is followed by more as he shoots rope after rope, matting the sheets below with his lapin spunk. Each new spurt brings forth a shaky moan from the subby bunny whore, tingles running up his spine.", parse);
		Text.NL();
		Text.Add("The scent of cum flooding your nostrils, you wriggle your hips a little, purposefully grinding your artificial [cock] into the lapin’s prostate, twisting in order to alter the pitch of his moans and whimpers. Finally, Roa collapses limply into the puddle he has created on the sheets, panting heavily. Withdrawing your hands, you smirk as you pet his messy locks, asking if he thinks he’s done now.", parse);
		Text.NL();
		parse["fem"] = roa.Relation() >= 20 ? player.name : player.mfFem("sir", "ma’am");
		Text.Add("<i>“Yeah, thank you,”</i> he replies with a happy smile. <i>“I hope you enjoyed yourself, [fem].”</i>", parse);
		Text.NL();
		Text.Add("Well... you tap your chin thoughtfully, letting the lagomorph sweat over your opinion. After a few moments, you smirk and proclaim that he was acceptably entertaining, writhing like a little slut on the end of your [cock].", parse);
		Text.NL();
		Text.Add("The lapin chuckles softly. <i>“I’m happy you’re pleased,”</i> he says, turning on his back. <i>“But you haven’t cum yet, have you?”</i>", parse);
		Text.NL();
		Text.Add("Not as such, no, you confess.", parse);
		Text.NL();
		Text.Add("<i>“Would you like me to lick you off? Maybe also clean you up?”</i> he offers.", parse);
		Text.NL();
		Text.Add("A smile writes itself across your face and you reach out to pet his cheek approvingly. Such a good boy, to know his place - and just what you need, too.", parse);
		Text.NL();
		Text.Add("<i>“Aww, you flatter me,”</i> he replies, smiling timidly and nuzzling your hand.", parse);
		Text.NL();
		Text.Add("Flattery, you playfully chide him, is when a person doesn’t deserve it. Your finger gently taps him on the nose to emphasize your point, and then you turn your attention to unfastening your strap-on from around your waist. Once the stained sex-toy has been tossed lightly aside, you push yourself over to straddle Roa’s prone form.", parse);
		Text.NL();
		Text.Add("Leisurely, you crawl your way over the lapin’s petite body, wrapping your [legs] around his chest for balance, thrusting your muff boldly into his face. Now, it’s time he got to work on cleaning you up, you declare.", parse);
		Text.NL();
		Text.Add("Roa immediately sets to work, startinig on your [clit] and licks along your slit. He hums in pleasure as he tastes your juices, tiny nose sniffing, drinking in your pheromones as he prepares to really start.", parse);
		Text.NL();
		Text.Add("You coo in pleasure as the bunny-boy’s tongue busies itself in your [vag]. Quick and nimble, the supple length of silky-soft flesh works expertly through your folds, stroking your more sensitive spots with repeated dabblings and tantalizing flicks.", parse);
		Text.NL();
		Text.Add("As worked up as he got you before, writhing and moaning under you like the total slut he is, he doesn’t need to work too hard. Soon enough, you’re crying out in pleasure as orgasm rocks you in turn, fluids pouring from your feminine flower. You do your best to cover Roa’s face in your nectar, even as he tries to suckle it all.", parse);
		Text.NL();
		Text.Add("When it’s over, you sigh in pleasure, but remain where you are, feeling too good to be in any hurry to move at this moment.", parse);
		Text.NL();
		if(roa.flags["sFuck"] == 0) {
			Text.Add("Laughing softly to yourself, you verbally note that maybe you ought to consider keeping Roa for yourself. It’s not every day you find a boy who not only loves being pegged ", parse);
			if(player.SubDom() >= 25)
				Text.Add("even more than you love pegging them,", parse);
			else
				Text.Add("so badly,", parse);
			Text.Add(" but who’s also quite impressive at eating pussy.", parse);
			Text.NL();
			parse["fem"] = roa.Relation() >= 20 ? player.name : player.mfFem("mister", "ma’am");
			Text.Add("He giggles happily at your compliment. <i>“You’re too kind [fem],”</i> he replies batting his eyes innocently.", parse);
		}
		else {
			Text.Add("Roa certainly hasn’t lost his touch, you tell him. How such a super buttslut can be so good at eating a lady out is still a source of marvel to you.", parse);
			Text.NL();
			if(roa.Relation() < 20)
				Text.Add("<i>“I get a lot of practice,”</i> he replies, winking at you.", parse);
			else if(roa.Relation() < 40)
				Text.Add("<i>“It’s because you’re so sexy, [playername],”</i> he says, giggling happily.", parse);
			else
				Text.Add("<i>“I’ll always do my best to pleasure you, [playername],”</i> he says with a huge smile.", parse);
		}
		roa.flags["sFuck"]++;
	}
	Text.NL();
	parse["fem"] = player.mfFem("sir", "ma’am");
	if(roa.Relation() < 20)
		Text.Add("<i>“So… anything else I can do for you, [fem]?”</i>", parse);
	else if(roa.Relation() < 40)
		Text.Add("<i>“Wanna do something else, [playername]?”</i>", parse);
	else
		Text.Add("<i>“Might I offer some other service to you, [playername]? Maybe a post-sex cuddle to enjoy the afterglow?”</i> he asks hopefully.", parse);
	Text.Flush();
	
	roa.relation.IncreaseStat(50, 1);
	TimeStep({hour : 1});
	
	RoaScenes.TSLPostSexPrompt(mStrap);
}

RoaScenes.TSLCatchVaginal = function() {
	if(roa.flags["Met"] < Roa.Met.Sexed)
		roa.flags["Met"] = Roa.Met.Sexed;
	
	var parse = {
		playername : player.name,
		lipsDesc   : function() { return player.LipsDesc(); }
	};
	parse = player.ParserTags(parse);
	
	var first  = (roa.sex["gVag"]  == 0);
	var noanal = (roa.sex["rAnal"] == 0);
	
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Text.Clear();
	Text.Add("Moving decisively, you take the lead, sweeping Roa off of his feet and into your arms in a bridal carry. The petite lapin lets out a squeak of surprise at your reaction, unthinkingly clinging to you, his little body warm, soft and delightfully fluffy in your arms. You could enjoy this... but you have bigger plans.", parse);
	Text.NL();
	Text.Add("Crossing the distance to the bed, you toss him onto the mattress and clamber up to join him, the springs creaking at the sudden weight. You stretch your body over his, one [hand] pressing against his shoulder to half-pin him down, the other moving to possessively caress his jutting cock. As your fingers languidly stroke from his balls up his shaft, you airily inform him that he has a very nice cock for such a little rabbit.", parse);
	Text.NL();
	parse["fem"] = player.mfFem("sir", "ma’am");
	if(player.FirstCock()) {
		if(roa.Relation() < 40) {
			Text.Add("<i>“I take it this means you don’t want to fuck my butt?”</i>", parse);
			Text.NL();
			Text.Add("Not this time, you inform him.", parse);
			Text.NL();
			Text.Add("<i>“I see...”</i> he replies with a hint of disappointment, but he quickly gets over it and spread his legs. <i>“Very well, [fem]. You’re in charge, so do with me as you will.”</i>", parse);
		}
		else {
			Text.Add("<i>“Aww, no cock for poor Roa?”</i> he teasingly asks.", parse);
			Text.NL();
			Text.Add("Chuckling you inform him that this time you’re interested in his dick, not his butt. But who knows? If he’s a good boy you might give him what he wants later.", parse);
			Text.NL();
			Text.Add("<i>“Alright, it’s a promise,”</i> he giggles, spreading his legs to give you better access.", parse);
		}
	}
	else {
		if(roa.Relation() < 40)
			Text.Add("<i>“Thank you, [fem],”</i> he says shyly, spreading his legs for better access.", parse);
		else
			Text.Add("<i>“Yes, and it’s all yours, [playername],”</i> he says, giggling softly as he spreads his legs further apart.", parse);
	}
	Text.NL();
	Text.Add("Still pinning him down, your gaze shifts to the jutting manhood you are fondling. Thick streams of precum are starting to well from its tip, rolling lazily down its length, and your fingers move to intercept. You smear his juices back and forth, coating every inch until it gleams wetly in the light. Roa tries to hold still, but your touches make him wriggle and moan, despite his efforts.", parse);
	Text.NL();
	Text.Add("When you are satisfied with your impromptu lubing, you shift your position to straddle his hips, raising yourself aloft to align your [vag] with his cock. Your hand brushes itself tenderly against his cheek, a single stroke of comfort, and then you allow yourself to descend.", parse);
	Text.NL();
	var virgin = player.FirstVag().virgin;
	if(virgin) {
		Text.Add("You try to show no hesitation, even though this will be your first time. As Roa’s impressively sized cock begins spearing inside you, the unfamiliar sensations washing over you, you bite your lip to keep from betraying anything.", parse);
		Text.NL();
		Text.Add("As best you can, you attempt to take it slowly and steadily, inch after inch carefully disappearing inside you, but you can’t negate the pain of your hymen breaking entirely. Despite your efforts, a groan escapes your lips as you feel something tear away inside you, a liquid warmth that you know is blood blossoming below.", parse);
		Text.NL();
		
		Sex.Vaginal(roa, player);
		player.FuckVag(player.FirstVag(), roa.FirstCock(), 3);
		roa.Fuck(roa.FirstCock(), 10);
		
		Text.Add("<i>“H-Hey! You alright?”</i> Roa asks, concerned.", parse);
		Text.NL();
		Text.Add("Gritting your teeth, you grunt that you’re fine. You just need a moment to get used to this. You inhale deeply, setting up a slow, steady your breathing as you try to master yourself. Once the painful tingling fades away down below, you declare yourself ready to begin.", parse);
	}
	else {
		Text.Add("Pleasure crackles along your spine as Roa’s girth spreads your [vag], and you drop down faster and faster, anxious to be filled as full as you possibly can. You don’t stop until you have taken the lapin’s manhood to the hilt, your hips meatily smacking into his own girlish curves.", parse);
		Text.NL();
		
		Sex.Vaginal(roa, player);
		player.FuckVag(player.FirstVag(), roa.FirstCock(), 3);
		roa.Fuck(roa.FirstCock(), 3);
		
		Text.Add("With a swivel of your pelvis, you grind purposefully into his loins, making sure he’s crammed as deeply inside of you as physically possible. As you do, you grip and release with your cunt, squeezing him experimentally and allowing yourself to feel every inch of his warm flesh inside of you.", parse);
		Text.NL();
		Text.Add("<i>“Ah, yes! So warm...”</i> he notes with a smile.", parse);
		Text.NL();
		Text.Add("Of course; he’s very lucky that you chose him for your pleasure today.", parse);
	}
	Text.NL();
	Text.Add("Squeezing with your netherlips as best you can, you start to rise from your position, dragging your hips with tantalizing slowness back up Roa’s shaft until only the very tip remains inside. You pause there, letting the cool breeze tingle on your partner’s exposed cock flesh, and then lower yourself again with the same slow, deliberate motions. Pussy wrinkling as you flex and release, you repeat the cycle, tormenting Roa with your almost leisurely pace, moaning in pleasure as his girth slides back and forth through your depths.", parse);
	Text.NL();
	Text.Add("The bunny-slut moans in desire, his eyes casting a pleading look from below you. You feel his hands gently settle on your [hips], careful, almost reverent. When he sees that you aren’t rebuking him, he begins to slowly move his own hips, pumping into you in tandem with your own motions. Roa is such a good boy...", parse);
	Text.NL();
	if(first) {
		Text.Add("As you both continue to hump away, you slowly begin to increase your pace. Roa’s eyes flicker in desire as you start grinding him harder and faster. Though he tries his best to please you, you can tell that his heart really isn’t into it.", parse);
		Text.NL();
		if(noanal)
			Text.Add("Hmm... as you recall, he mentioned a certain preference for anal. Perhaps there’s a way to give him some ‘inspiration’?", parse);
		else
			Text.Add("Well you should’ve expected as much. It seems that if you want a good fucking you’ll have to fill his butt. You figure that while it may not be as good as a proper cock, this should be enough to make him try a little harder...", parse);
	}
	else {
		Text.Add("As expected, he doesn’t seem to be too into it yet. But thankfully you know how to fix that little problem...", parse);
	}
	Text.NL();
	Text.Add("With a purposeful flourish, you raise your index and middle fingers where Roa can see them, then lift them to your mouth. Your [lipsDesc] wrap around the digits and you noisily begin to suckle, exaggeratedly moaning and slurping as you pump them back and forth, [tongue] caressing the skin.", parse);
	Text.NL();
	Text.Add("Roa eyes you with curiosity, too focused on the feeling of your velvety walls to make sense of your intentions.", parse);
	Text.NL();
	Text.Add("Feeling your fingers are wet enough, you release them with a loud, lewd pop of air. Smirking knowingly at your bedmate, you bend slightly and start reaching behind you, searching for the plush, velvety-textured curves of Roa’s fuckable ass. Soft fur parts before your probing digits as you explore, stroking his tail before finding your way toward your prize.", parse);
	Text.NL();
	Text.Add("Against your fingertips, you can feel the distinctive texture of Roa’s anus, wrinkled flesh opening and closing shallowly at the pressure of your touch. With your index and middle finger, you push for the center, pressing firmly as you try and work your way inside. With an ease that bespeaks his enviable practice, Roa’s tailhole begins to open, allowing your probing fingers to push inside, twisting and turning slightly in order to dig deeper, intent on burrowing up to his prostate.", parse);
	Text.NL();
	Text.Add("<i>“Ooooh!”</i> The bunny-whore moans, his pumping hips speeding up as his excitement grows.", parse);
	Text.NL();
	Text.Add("You echo Roa’s moan with one of your own, arching your back as his enthusiasm sees him pushing deeper inside of you. To reward him for his efforts, you start to push your fingers in deeper, curling about in an effort to touch his prostate. So busy are you with this that your own efforts at thrusting back against Roa slacken. Not that it matters overmuch; Roa’s pumping good enough for both of you.", parse);
	Text.NL();
	Text.Add("Through the cloud of your pleasure, blinking your eyes at ethereal spots, you feel something distinctive in the depths of the lapin’s ass. Happily, you start to stroke it, pushing firmly against Roa’s prostate with each back-and-forth motion.", parse);
	Text.NL();
	Text.Add("The bunny-slut’s cock throbs within you, his pre-ejaculate mixing with your juices, forming a layer of extra-slick lube. The lapin-slut, moaning whorishly, begins to truly hammer you. His hips working overtime to thrust into you, each impact of his hips against yours resounding in a wet slap.", parse);
	Text.NL();
	Text.Add("Your world boils away into the delicious slapping of flesh on flesh, the pumping of your wrist as you manipulate Roa’s prostate, and the feel of bunnydick pounding you into a veritable puddle of mush. So caught up are you that you barely register it when he speaks, panting as he continues to hammer you without ceasing.", parse);
	Text.NL();
	Text.Add("<i>“Gonna cum!”</i> he warns. You feel as his cock appears to grow bigger and harder inside you. It’s clear that the rabbit is teetering on the edge of climax, what should you do?", parse);
	Text.Flush();
	
	var cameinside = 0;
	
	//[Inside] [Outside]
	var options = new Array();
	options.push({ nameStr : "Inside",
		func : function() {
			cameinside++;
			Text.Clear();
			Text.Add("You thrust back against Roa, forcing him down so hard he gets mashed into the mattress, pinned under your weight as you grind his prostate for all you’re worth. The lapin lets out a high-pitched squeal of pleasure, fingers grabbing at you for dear life as he bucks one last time and explodes messily inside you. Liquid warmth floods your loins as he cums, surging up inside of you for several long, pleasant moments.", parse);
			Text.NL();
			Text.Add("By the time Roa shudders and sighs long and low in pleasure, you feel distinctly full, jampacked with thick sloppy bunny-cream. As he goes limp under you, you slowly pry your fingers free of his ass, which attempts to cling to them even despite his sated state. Once they are free, you slide your weight off of the panting lagomorph, letting his semen-stained shaft slide slowly from your well-used [vag] before hopping off of the bed entirely.", parse);
			
			var cum = roa.OrgasmCum();
			//Impreg
			RoaScenes.Impregnate(player, cameinside, PregnancyHandler.Slot.Vag);
			
			Gui.PrintDefaultOptions();
		}, enabled : true,
		tooltip : Text.Parse("You’re a big [boygirl], let him give you a nice creamy filling.", {boygirl: player.mfFem("boy", "girl")})
	});
	options.push({ nameStr : "Outside",
		func : function() {
			Text.Clear();
			Text.Add("You pull your fingers free of Roa’s ass with an audible popping sound, using your hands to help you push yourself up until Roa’s cock slides free of your used pussy. The startled lapin looks at you with wide, innocent eyes, looking honestly tearful as you slide yourself off of the bed.", parse);
			Text.NL();
			Text.Add("You smile at him, and then take his dick in your hand. It throbs and pulses in time with his heartbeat, twitching rapidly against your palm as you start to stroke and caress. With your other hand, you reach for his ass again, pushing your fingers back up his welcoming tailhole.", parse);
			Text.NL();
			Text.Add("Roa bucks and heaves, crying out in ecstasy as your hands finish what your hips began; bowing his back, his throbbing dick begins spraying great arching globs of semen into the air. Though most of this splatters back down on Roa himself, drenching his stomach and even drenching his face, some of it sprays back across your fingers and wrist.", parse);
			Text.NL();
			Text.Add("When the panting lagomorph slumps back across the bed, you release his cock and pull your fingers free of his ass.", parse);
			
			var cum = roa.OrgasmCum();
			
			Gui.PrintDefaultOptions();
		}, enabled : true,
		tooltip : "You know better than to let a bunny-boy cum inside your cunt."
	});
	Gui.SetButtonsFromList(options, false, null);
	
	Gui.Callstack.push(function() {
		Text.NL();
		parse["fem"] = roa.Relation() >= 40 ? player.name : player.mfFem("sir", "ma’am");
		Text.Add("<i>“Wow,”</i> he pants. <i>“That was amazing, thank you, [fem].”</i>", parse);
		Text.NL();
		parse["cum"] = cameinside > 0 ? " cum-dripping" : "";
		Text.Add("With a click of your tongue, you tell him not to be thanking you yet. At the lagomorph’s wide-eyed innocence, you trail one finger along your[cum] netherlips and remind him that you haven’t had a chance to cum yet.", parse);
		Text.NL();
		Text.Add("<i>“Of course. Just give me a moment and I’ll be ready for another round.”</i>", parse);
		Text.NL();
		Text.Add("You have little reason to doubt he’s quite capable of getting himself ready. But... maybe you should consider giving him a hand?", parse);
		Text.Flush();
		
		//[Help] [Don’t help]
		var options = new Array();
		options.push({ nameStr : "Help",
			func : function() {
				Text.Clear();
				Text.Add("A smirk on your lips, you proclaim you’ll give Roa more than a ‘moment’. Your hand reaches out and closes around the trembling bunny-boy’s half-erect shaft, tenderly brushing it twice. Then, leaning over the bed, you open your mouth and extend your [tongue], licking along its length, tasting the mixture of cum and sweat and your own sexual fluids coating the soft skin.", parse);
				Text.NL();
				Text.Add("<i>“Ooh, yes...”</i> he says, trembling in pleasure at your ministrations.", parse);
				Text.NL();
				Text.Add("Opening your mouth, you wrap your lips tenderly around the tip of his glans, eyes closing as you suckle, savoring the taste of him filling your mouth. With lewd slurps echoing in your ears, you gulp your way slowly along his length, feeling him hardening in your mouth.", parse);
				Text.NL();
				Text.Add("When you gauge him hard enough, you pop your mouth free, lasciviously licking your lips and smirking at the look Roa is throwing you. Adoration and arousal war in the rabbit-morph’s eyes, his whole body trembling with desire for you.", parse);
				
				player.slut.IncreaseStat(50, 1);
				
				Gui.PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Why not enjoy yourself by giving him an extra ‘hand’?"
		});
		options.push({ nameStr : "Don’t help",
			func : function() {
				Text.Clear();
				Text.Add("You nod to show you understand and wait patiently for Roa.", parse);
				Text.NL();
				Text.Add("The lapin whore closes his eyes, steading his breathing as he relaxes. After a few moments, he reaches for his shaft, giving it a few strokes to get himself back to full erection. You simply watch as he masturbates, until a bead of pre forms at his tip.", parse);
				Text.NL();
				if(first) {
					Text.Add("Impressive, he’s really quick to recover, isn’t he? Much faster than you’re used to, at any rate.", parse);
				}
				else {
					Text.Add("As quick to recover as ever...", parse);
				}
				
				Gui.PrintDefaultOptions();
			}, enabled : true,
			tooltip : "He doesn’t need your help, so just sit back and watch."
		});
		Gui.SetButtonsFromList(options, false, null);
		
		Gui.Callstack.push(function() {
			Text.NL();
			Text.Add("With a smile, you clap your hands together. Alright, now that Roa’s all ready for you, there’s just one last thing you need. Where does he keep his favorite dildo?", parse);
			Text.NL();
			Text.Add("<i>“Oh? Should I go get it?”</i> he asks with a soft smile.", parse);
			Text.NL();
			Text.Add("Your only answer is an imperious nod; of course he should go and fetch it. It’s for his benefit, after all.", parse);
			Text.NL();
			Text.Add("<i>“I’ll be right back!”</i> He dashes out the door, not caring that he’s totally naked, nor that he has a massive boner bobbing in front of him as he hops away.", parse);
			Text.NL();
			Text.Add("You wait a few moments, before the bunny-slut returns, nearly crashing through the door. <i>“Here!”</i> he exclaims, holding up a big purple dildo.", parse);
			Text.NL();
			Text.Add("You cast a quick glance over it; aside from its color, and the fact it’s clearly made of rubber, it looks like an ordinary human cock. Quite a big one, though; at least a foot long, and nearly three inches thick. Reaching out, you take it from his hand, nodding in approval as you test the weight of it in your palm.", parse);
			Text.NL();
			Text.Add("Good boy, Roa, you tell him, reaching out to affectionately stroke his ears with your free hand. Now, he just has to get back on the bed, and you’ll both be in for some real fun.", parse);
			Text.NL();
			Text.Add("The lapin nods emphatically and hops on the bed, lying on his back as he awaits your next move with a smile.", parse);
			Text.NL();
			parse["cum"] = cameinside > 0 ? " dripping" : "";
			Text.Add("A hungry grin spreads across your lips as you impatiently climb onto the bed in turn. Dragging yourself over Roa’s petite form, you press your hands against his shoulders, pinning him thoroughly to the bed as your[cum] pussy hungrily envelops his cock for the second time. You moan in pleasure, arching your back as he fills you once more, lifting your hands from his shoulders to properly balance atop him. Now, it’s your turn to find satisfaction.", parse);
			Text.NL();
			Text.Add("Roa’s hands settled themselves back on your hips, gripping for support as he begins to move his hips.", parse);
			Text.NL();
			Text.Add("Although your lapin lover is enthusiastic, you both know what he’s really after. With a smirk, you brandish the dildo that Roa so helpfully brought you, lifting it to your mouth and starting to lap at it. Your [tongue] glides across the purple rubber, lewdly slurping and sucking until it shines with the layer of lubrication you have provided. Roa groans in desire, picking up speed in eager anticipation of what you have in mind.", parse);
			Text.NL();
			Text.Add("Once you judge your toy sufficiently wet, you twist around as best you can and lean over, doing your best to line the dildo up with Roa’s wiggling buttocks despite the pleasure already hazing your vision. One enthusiastic buck from the bunny causes you to jolt forward, rubbing the toy firmly against Roa’s own slapping balls, but you finally manage to line it up. Unceremoniously, you drive it home, even as Roa thrusts as deeply into you as he can, eliciting matching moans of pleasure at being filled so full from the pair of you.", parse);
			Text.NL();
			Text.Add("<i>“Ahn! Yeah!”</i> the bunny-slut moans. Inside, you can feel his cock throb, seemingly growing harder as he doubles his efforts to pump himself in and out of you.", parse);
			Text.NL();
			parse["cum"] = cameinside > 0 ? " his cum slurping and squelching perversely with each thrust he makes," : "";
			Text.Add("Groaning in your own pleasures, you meet him thrust for thrust, alternating between focusing on the wonderful slapping of flesh on flesh and grinding Roa’s prostate with his favorite dildo. With the stimulation he gave you before already fresh in your mind,[cum] you don’t need much to get in the mood. You can feel the wall of pleasure building inside of you, like sparks crackling under your [skin], dancing through your brain. Oh, yes, you’re close, you’re so close...", parse);
			Text.NL();
			Text.Add("Roa is oblivious to your oncoming orgasm, all he can focus on is the dildo filling his butt and the feeling of your moist folds wrapping around his own cock. His eyes are rolled back, tongue lolling out as his hips move on their own. Right now he’s nothing more but a toy himself, to be directed and used as you please.", parse);
			Text.NL();
			Text.Add("This realization is the final straw for you. With a cry of pleasure, you grind yourself as forcibly into Roa’s cock as you possibly can. You buck and heave as the dam in your mind breaks, orgasm washing through your body like a wave of liquid pleasure. Your fluids cascade onto Roa’s thighs, smearing over his belly as you arc above him, whole body writhing with the pleasure that you feel.", parse);
			if(player.FirstCock())
				Text.Add(" Your [cocks] throb[s], sending jet after jet of cum in sympathetic orgasm.", parse);
			Text.NL();
			Text.Add("Your climax stretches on for what feels like a blissful eternity... then seeps away, leaving you panting with exertion atop of your lapin lover.", parse);
			Text.NL();
			
			var cum = player.OrgasmCum();
			
			Text.Add("The bunny-whore moans lavishly as your tunnel constricts him, but shows no sign of slowing down despite your vice-like grip. He continues to pump into you as you ride out your climax, trying your best to milk his shaft as your walls contract.", parse);
			Text.NL();
			Text.Add("You don’t have long to enjoy your afterglow, as Roa’s bucks intensify. <i>“C-Cumming!”</i> he shouts in warning.", parse);
			Text.NL();
			parse["cum"] = cameinside > 0 ? " again" : "";
			Text.Add("You only have a second to make your choice. Do you want to let him cum inside you[cum]?", parse);
			Text.Flush();
			
			//[Inside] [Outside]
			var options = new Array();
			options.push({ nameStr : "Inside",
				func : function() {
					cameinside++;
					
					Text.Clear();
					Text.Add("You wrap your [legs] around Roa pointedly, squeezing your hips to his own and forcing him to the mattress. The lagomorph lets out a surprisingly girlish cry of pleasure and then writhes as he explodes within your waiting pussy, thick ropes of bunny-seed spurting up inside of you.", parse);
					Text.NL();
					Text.Add("After a few moments of adding molten heat to your cunt, Roa sighs and goes limp, clearly spent from his climax. Affectionately petting his head, you slowly lift yourself from his body. A thick stream of off-white flows from your loins as you pull out and slide out of the bed.", parse);
					
					var cum = roa.OrgasmCum();
					RoaScenes.Impregnate(player, cameinside, PregnancyHandler.Slot.Vag);
					
					Gui.PrintDefaultOptions();
				}, enabled : true,
				tooltip : cameinside > 0 ? "Double your pleasure, double your cum, right? What could another helping of Roa-spooge hurt?" : "Well, since he was good enough to let you cum this time, why not reward him by letting him shoot it where it belongs?"
			});
			options.push({ nameStr : "Outside",
				func : function() {
					Text.Clear();
					Text.Add("You all but throw yourself backward, nearly rolling yourself off of the bed to escape Roa’s impending orgasm. Unbothered by your departure, Roa squeals in pleasure, arcing his back until he almost lifts himself off the bed before firing great spurts of semen toward the ceiling. They make a valiant effort, but he just can’t reach that far, and so they simply curl back down, splattering heavily across his belly, his chest, even his face. By the time he goes limp, panting heavily, he’s visibly painted with his own juices, and you are watching him from the bedside, having slid off to avoid being painted yourself.", parse);
					
					var cum = roa.OrgasmCum();
					
					Gui.PrintDefaultOptions();
				}, enabled : true,
				tooltip : cameinside > 0 ? "Oh no, once was enough for you; you know what they say about bunny-boys, after all..." : "Not a chance, you didn’t do it before, why would you do it this time?"
			});
			Gui.SetButtonsFromList(options, false, null);
			
			Gui.Callstack.push(function() {
				Text.NL();
				Text.Add("As Roa labors to catch his breath, you decide to occupy yourself with a little stretching exercise. Just to work out all of the little kinks this last go built up in your body. Not that it wasn’t worth it, you amend to yourself, smiling as you do.", parse);
				Text.NL();
				var wings = player.HasWings();
				parse["wingsDesc"] = wings ? wings.Short() : "";
				parse["wings"] = wings ? Text.Parse(", and spread your [wingsDesc] as far as they can go", parse) : "";
				Text.Add("You stretch out your arms over your head, rotate your shoulders[wings]. ", parse);
				if(player.LowerBodyType() != LowerBodyType.Single)
					Text.Add("Your legs receive a similar treatment.", parse);
				else
					Text.Add("Your [legs] take a bit more work to stretch out, but you do so all the same.", parse);
				Text.NL();
				Text.Add("After you’re done you sigh in satisfaction. That was pretty good. Looking at Roa, you notice that he seems to have finally caught his breath. Walking over to his side, you ask if he’s alright now.", parse);
				Text.NL();
				Text.Add("<i>“Y-Yeah...”</i> he replies, still panting a bit. <i>“That was great!”</i>", parse);
				Text.NL();
				Text.Add("Smiling, you agree that he did a pretty good job. Especially once you gave him some proper encouragement...", parse);
				Text.NL();
				Text.Add("He giggles softly. <i>“Speaking of which, think you could pull it out for me? I still can’t quite move my hips.”</i>", parse);
				Text.NL();
				Text.Add("Playfully, you remark that you would have thought he’d prefer to leave it in. Even as you say this, though, your hand reaches for his butt. Teasingly, you cup the fluffy bulbous form of his tail, puffing it gently with your fingers, then take hold of the well-used dildo and steadily pull it free of his gripping anus.", parse);
				Text.NL();
				Text.Add("<i>“Don’t take me wrong, I love having my butt filled. But there’s a big difference between a hard cock that can give you a delicious cream-pie, and the same old dildo I use whenever there’s no action. Plus, I have to clean it,”</i> he explains, extending his hand toward you.", parse);
				Text.NL();
				Text.Add("You confess that you can see why that takes some of the fun out it, taking his hand and helping the still somewhat wobbly lagomorph up. Once you’re sure he’s seated properly, you release his hand and offer him back his dildo.", parse);
				Text.NL();
				Text.Add("Roa takes the dildo and immediately sets about cleaning it, with his mouth. He sucks on the tip, lavishes the length with practiced licks and rubs it lovingly against his cheek. It’s quite a lewd display, you admit.", parse);
				Text.NL();
				Text.Add("<i>“There, all clean!”</i> he declares, setting the dildo down beside him. <i>“Any other way I may be of service, [fem]?”</i>", parse);
				Text.Flush();
				
				roa.relation.IncreaseStat(25, 1);
				TimeStep({hour : 1});
				
				RoaScenes.TSLPostSexPrompt();
			});
		});
	});
}

RoaScenes.TSLPostSexPrompt = function(mStrap) {
	var parse = {
		playername  : player.name,
		lipsDesc    : function() { return player.LipsDesc(); }
	};
	parse = player.ParserTags(parse);
	parse["fem"] = roa.Relation() >= 40 ? player.name : player.mfFem("sir", "ma’am");
	
	//[Snuggle] [Bathe] [Kiss] [Dismiss]
	var options = new Array();
	options.push({ nameStr : "Snuggle",
		func : function() {
			var first = roa.flags["snug"] == 0;
			roa.flags["snug"]++;
			
			parse["own"] = player.HasFur() ? " own" : "";
			
			Text.Clear();
			if(first) {
				Text.Add("<i>“Snuggle? I’m sorry [fem]. But I’m afraid I’m not familiar with that,”</i> he smiles apologetically.", parse);
				Text.NL();
				Text.Add("Smirking, you assure him that it’s easy. All he has to do is stay quiet and let you hold him.", parse);
				Text.NL();
				Text.Add("<i>“And...”</i> he says twirling his hand. <i>“That’s all?”</i>", parse);
				Text.NL();
				Text.Add("That’s all he has to do, you assure him, and then forcefully beckon him to approach you.", parse);
				Text.NL();
				Text.Add("Shrugging, he does as instructed. <i>“Alright, if that’ll bring you pleasure, [fem].”</i>", parse);
				Text.NL();
				Text.Add("You don’t answer him verbally, instead wrapping your arms possessively around him and pulling this pillow-to-be bunny close, locking your grip to keep your catch right where you want him. You smile in satisfaction and rub your cheek gently against his own, basking in the feel of warm, soft, fluffy fur in your arms, rubbing against your[own] [skin].", parse);
			}
			else {
				Text.Add("The lapin whore smiles timidly and approaches you tentatively.", parse);
				Text.NL();
				Text.Add("Spreading your arms, you welcome Roa into your embrace, folding your arms around the bunny boy and holding him fit to never let go.", parse);
				Text.NL();
				Text.Add("Roa lets out a sigh of relaxation, avidly wriggling as close to you as he can get. His little arms wrap around you the best he can, and you return the favor, savoring the feel of being so close.", parse);
			}
			Text.NL();
			Text.Add("With the two of you curled front to front, it’s easy to fit the pair of you together. Roa’s petite body seems to be just made for tucking into your arms, silky-soft fur brushing lightly against your[own] [skin]. Although he wriggles a little as his cock grows hard, poking insistently against your [belly], Roa himself is as content as you to just enjoy being together like this. Your breath stirs his hair, and his own breaths puff lightly over your [breasts], tickling with each exhalation.", parse);
			Text.NL();
			Text.Add("The two of you lay there in each other’s arms, enjoying one another’s company in quiet contentment... All good things must come to an end, however, and eventually you are forced to let Roa go and tell him that you have to be off now.", parse);
			Text.NL();
			Text.Add("<i>“Aww, just when I was starting to enjoy it,”</i> he grins.", parse);
			Text.NL();
			Text.Add("Well, if he’s lucky, maybe you’ll do it again when you next hire him, you tease back. Rolling off of the bed, you start hunting for your belongings; you need to get dressed before you go anywhere, after all...", parse);
			Text.NL();
			if(roa.Relation() < 20) {
				Text.Add("<i>“I hope to see you again soon, [fem],”</i> he says with a genuine smile.", parse);
				Text.NL();
				Text.Add("You nod to show you heard, making a mental note that maybe you should consider dropping by again.", parse);
			}
			else if(roa.Relation() < 40) {
				Text.Add("<i>“Come visit me soon, [playername]. You’re my favorite customer,”</i> he says with a smile.", parse);
				Text.NL();
				Text.Add("With a grin, you thank him for the flattery, assuring him that you’ll definitely consider purchasing him again.", parse);
			}
			else {
				Text.Add("<i>“I’m gonna miss you… Please don’t take too long to come visit me again. Nobody is as kind to me as you are, [playername].”</i>", parse);
				Text.NL();
				Text.Add("You shake your head and tut in disapproval; your Roa deserves better than that. You promise that you’ll come back as soon as it’s possible.", parse);
			}
			Text.NL();
			Text.Add("Having dressed yourself again, you head back out.", parse);
			Text.Flush();
			
			roa.relation.IncreaseStat(50, 1);
			TimeStep({minute: 30});
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : roa.Relation() < 20 ? "The little bunny’s actually kind of cuddly. Maybe a nice hug to unwind after sex wouldn’t be so bad?" :
		          roa.Relation() < 40 ? "Why not spend some time snuggling with your favorite bunny?" : "You know Roa would just love if you stayed and snuggled awhile; why not indulge him?"
	});
	options.push({ nameStr : "Kiss",
		func : function() {
			Text.Clear();
			Text.Add("The only warning you give the lapin is a predatory smile. Roa lets out a delicious little squeak of shock before you swoop down on him like the proverbial bird of prey. Your arms crush him against your [breasts], folding tightly around velvety white fur and holding him fast as your [lipsDesc] devour his own. His softness envelops your senses, prickling across your skin, his taste enrapturing your [tongue] as it washes across its surface.", parse);
			Text.NL();
			Text.Add("You squeeze Roa as if determined to never let him go, so tight you can feel his little heart racing inside his chest, beating a rapid-fire tattoo against your skin. Your kiss deepens as if you could drink the lagomorph’s very essence; only when the need for oxygen becomes inescapable do you finally break the kiss with a noisy gasp, letting the puffing bunny fall back onto the bed.", parse);
			Text.NL();
			if(roa.Relation() < 40)
				Text.Add("Roa is so surprised he can only blink and look up at you slackjawed.", parse);
			else
				Text.Add("Roa pants as you let him go, fingers touching his lips as he smiles at you.", parse);
			Text.NL();
			Text.Add("Looking down between his legs you can tell that he really liked the kiss, if his throbbing, pre-seeping shaft is any indication.", parse);
			Text.NL();
			Text.Add("Smirking down at him, your finger reaches out to tenderly stroke the very tip of his glans, tapping lightly against the oozing cum-slit. In your best casual tone, you tell him that was just a little something to remember you by. Another tap on his glans, and then you shuffle yourself off the bed, reaching for your gear and starting to dress yourself again.", parse);
			Text.NL();
			if(roa.Relation() < 40) {
				Text.Add("<i>“R-Right… umm… I think I’ll go use the bathroom then...”</i> he says, sprinting and closing the door behind him. A moan of pleasure echoing through the door soon after.", parse);
			}
			else {
				Text.Add("He pouts cutely and sighs. <i>“That’s mean, [playername]. You give me a boner and you’re not even going to take responsibility for it?”</i>", parse);
				Text.NL();
				Text.Add("Oh, you’d be happy to take responsibility for it, you insist sweetly. But, right now, you don’t have the time. He’ll just have to save it for when you can come back again - not that it’ll be too hard to make time for a sweetie like him.", parse);
				Text.NL();
				Text.Add("He chuckles. <i>“Oh, we both know I can’t wait that long. I’ll just have to take care of this by myself then, but I promise to have an even bigger boner next time we meet,”</i> he says, ducking out inside the bathroom. A moan of pleasure following in his wake moments afterward.", parse);
			}
			Text.NL();
			Text.Add("With a chuckle, you finish dressing yourself again. Blowing a kiss in the direction of the bathroom, you call out for Roa to take care of himself. Stepping through the door, you start making your way out.", parse);
			Text.Flush();
			
			roa.relation.IncreaseStat(50, 2);
			TimeStep({minute: 30});
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : roa.Relation() < 20 ? "Hey, you are paying for this, and he’s kind of cute. Why not enjoy a goodbye kiss before you go?" :
		          roa.Relation() < 40 ? "You’re sure Roa would just love a little memento before you leave." : "How can you possibly leave without giving your favorite bunny boy-slut a goodbye kiss?"
	});
	options.push({ nameStr : "Dismiss",
		func : function() {
			Text.Clear();
			if(roa.Relation() < 20)
				Text.Add("<i>“Very well, thank you for your patronage, [fem],”</i> he says, bowing with a smile.", parse);
			else if(roa.Relation() < 40)
				Text.Add("<i>“That’s too bad. I guess I’ll see you some other time then, [playername],”</i> he says with a disappointed sigh.", parse);
			else {
				Text.Add("<i>“Aww. Not even a kiss?”</i> he asks with pleading eyes.", parse);
				Text.NL();
				Text.Add("Your hand shoots out and grab a particularly bushy puff of fur on his chest, hauling him in close to you. Your lips crash down like waves on a shore, your [tongue] plunging shamelessly into Roa’s mouth. The lapin voices a muffled moan, sucking greedily as you feed him your tongue, before you break the kiss as sharply as you gave it.", parse);
				Text.NL();
				Text.Add("Smirking, you ask him how he could have possibly thought you’d let your favorite bunny go without a kiss, even as you release him and playfully push him a step back for measure.", parse);
				Text.NL();
				Text.Add("<i>“Now you’re making me blush!”</i> he giggles.", parse);
			}
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : roa.Relation() < 20 ? "You have better things to do, it’s time to get going." :
		          roa.Relation() < 40 ? "You don’t really have the time to spare. Maybe next time, you can stay longer?" : "You’re sorry, you really are, but you just can’t stay this time."
	});
	Gui.SetButtonsFromList(options, false, null);
	
	Gui.Callstack.push(function() {
		Scenes.Lucille.WhoreAftermath("Roa", roa.Cost());
	});
	
	if(mStrap) {
		Gui.Callstack.push(Scenes.Brothel.MStrap);
	}
}

export { Roa, RoaScenes };
