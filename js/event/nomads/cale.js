/*
 * 
 * Define Cale
 * 
 */
import { Entity } from '../../entity';
import { world } from '../../world';
import { Shop } from '../../shop';
import { GetDEBUG } from '../../../app';

let CaleScenes = {};

function Cale(storage) {
	Entity.call(this);
	this.ID = "cale";
	
	// Character stats
	this.name = "Wolfie";
	
	this.shop = new Shop();
	
	this.body.DefMale();
	this.body.SetRace(Race.Wolf);
	this.SetSkinColor(Color.gray);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.Wolf, Color.gray);
	this.FirstCock().length.base = 20;
	this.FirstCock().thickness.base = 4;
	
	this.flags["Met"]      = Cale.Met.NotMet;
	this.flags["Met2"]     = 0;
	this.flags["Sexed"]    = 0;
	this.flags["Rogue"]    = 0;
	this.flags["sneakAtk"] = 0;
	this.flags["trickBJ"]  = 0;
	
	this.flags["xOut"]     = 0;
	this.flags["xedOut"]   = 0;
	this.flags["cLoss"]    = 0; // cavalcade loss
	this.flags["cCheat"]   = 0; // cavalcade cheat
	this.flags["eBlow"]    = 0;
	
	this.flags["rotPast"]  = 0;
	this.flags["maxPast"]  = 0;
	this.flags["rosPast"]  = 0;
	
	// Shop
	this.flags["shop"]     = 0;
	this.shopItems = [];
	this.shopItems.push(Items.HorseHair);
	this.shopItems.push(Items.HorseShoe);
	this.shopItems.push(Items.HorseCum);
	this.shopItems.push(Items.RabbitFoot);
	this.shopItems.push(Items.CarrotJuice);
	this.shopItems.push(Items.Lettuce);
	this.shopItems.push(Items.Whiskers);
	this.shopItems.push(Items.HairBall);
	this.shopItems.push(Items.CatClaw);
	this.shopItems.push(Items.SnakeOil);
	this.shopItems.push(Items.LizardScale);
	this.shopItems.push(Items.LizardEgg);
	this.shopItems.push(Items.GoatMilk);
	this.shopItems.push(Items.SheepMilk);
	this.shopItems.push(Items.Ramshorn);
	this.shopItems.push(Items.CowMilk);
	this.shopItems.push(Items.CowBell);
	this.shopItems.push(Items.FreshGrass);
	this.shopItems.push(Items.CanisRoot);
	this.shopItems.push(Items.DogBone);
	this.shopItems.push(Items.DogBiscuit);
	this.shopItems.push(Items.WolfFang);
	this.shopItems.push(Items.Wolfsbane);
	this.shopItems.push(Items.FoxBerries);
	this.shopItems.push(Items.Foxglove);
	this.shopItems.push(Items.BlackGem);
	this.shopItems.push(Items.Hummus);
	this.shopItems.push(Items.SpringWater);
	this.shopItems.push(Items.Feather);
	this.shopItems.push(Items.Trinket);
	this.shopItems.push(Items.FruitSeed);
	this.shopItems.push(Items.MFluff);
	this.shopItems.push(Items.MDust);
	this.shopItems.push(Items.Stinger);
	this.shopItems.push(Items.SVenom);
	this.shopItems.push(Items.SClaw);
	this.shopItems.push(Items.TreeBark);
	this.shopItems.push(Items.AntlerChip);
	this.shopItems.push(Items.GoatFleece);
	this.shopItems.push(Items.FlowerPetal);
	this.shopItems.push(Items.RawHoney);
	this.shopItems.push(Items.BeeChitin);
	//TODO: More item ingredientss
	
	this.SetLevelBonus();
	this.RestFull();
	
	if(storage) this.FromStorage(storage);
	
	if(this.Slut() >= 60) {
		this.Butt().capacity.base = 15;
	}
	else {
		this.Butt().capacity.base = 5;
	}
}
Cale.prototype = new Entity();
Cale.prototype.constructor = Cale;

Cale.Met = {
	NotMet : 0,
	First  : 1,
	YouTookRosalin  : 1,
	CaleTookRosalin : 2,
	SharedGotFucked : 3,
	SharedFuckedHim : 4,
	SharedOnlyRosie : 5
};
Cale.Met2 = {
	NotMet     : 0,
	Talked     : 1,
	TalkedSlut : 2,
	Goop       : 3
}
Cale.Rogue = {
	Locked : 0,
	First  : 1,
	Ret    : 2,
	Taught : 3
}

Cale.prototype.Met = function() {
	return this.flags["Met2"] >= Cale.Met2.Talked;
}

Cale.prototype.Buttslut = function() {
	return this.flags["Met2"] >= Cale.Met2.Goop;
}

Cale.prototype.FromStorage = function(storage) {
	this.Butt().virgin       = parseInt(storage.virgin) == 1;
	
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
	
	if(this.flags["Met2"] != Cale.Met2.NotMet)
		this.name = "Cale";
}

Cale.prototype.ToStorage = function() {
	var storage = {
		virgin : this.Butt().virgin ? 1 : 0
	};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	this.SaveSexFlags(storage);
	
	return storage;
}

// Schedule
Cale.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Plains.Nomads.Fireplace)
		return cale.flags["Met"] != 0 && (world.time.hour >= 15 || world.time.hour < 3);
	return false;
}

// interaction
CaleScenes.Interact = function() {
	var parse = {
		playername : player.name
	};
	
	if(cale.flags["Met2"] == Cale.Met2.NotMet) {
		cale.name = "Cale";
		cale.flags["Met2"] = Cale.Met2.Talked;
		CaleScenes.FirstApproach();
		return;
	}
	else if((cale.flags["Met2"] == Cale.Met2.Talked) && cale.Slut() >= 50) {
		cale.flags["Met2"] = Cale.Met2.TalkedSlut;
		CaleScenes.TalkSlut();
		return;
	}
	else if((rosalin.flags["Anusol"] >= Rosalin.Anusol.AskedForCalesHelp) &&
		(rosalin.flags["Anusol"] < Rosalin.Anusol.DeliveryFromCale)) {
		
		rosalin.flags["Anusol"] = Rosalin.Anusol.DeliveryFromCale;
		
		Text.Clear();
		Text.Add("<i>“Hey, [playername]. Got your goods!”</i> the wolf announces as you approach. <i>“I delivered it to Rosie already, so just go talk to her when you want to run your experiment.”</i>", parse);
		Text.NL();
		Text.Add("With a grateful smile, you thank the wolf for his efforts.", parse);
		Text.NL();
		if(cale.Buttslut()) {
			Text.Add("<i>“Say, since I did such a good job, how about you show me your appreciation? I have an itch that’s tough to scratch, and last time I checked, you had the proper equipment to help me,”</i> he says, eyeing you predatorily and licking his chops.", parse);
			Text.NL();
			Text.Add("You can’t help but chuckle at the wolf’s words; he really is such a slut now, isn’t he?", parse);
			Text.NL();
			Text.Add("<i>“Can’t help what feels good. Personally, I just like what I like, and I like what you can do,”</i> he grins.", parse);
			Text.NL();
			Text.Add("Smirking back, you tell him that you’ll think about it; you do have other business to take care of as well.", parse);
		}
		else {
			Text.Add("<i>“Nice doing business, bud. Now, something else you want with me?”</i>", parse);
		}
		Text.Flush();
		CaleScenes.Prompt();
		return;
	}
	
	Text.Clear();
	if(cale.Relation() >= 40)
		Text.Add("<i>“Hey there, chief!”</i> Cale greets you excitedly.”</i>", parse);
	else
		Text.Add("<i>“Hey there, [playername],”</i> Cale greets you politely.", parse);
	Text.NL();
	Text.Add("You return the greeting and ask him how he is.", parse);
	Text.NL();
	Text.Add("<i>“I’m fine, thanks for asking,”</i> he replies.", parse);
	Text.NL();
	if(cale.Slut() >= 60)
		Text.Add("He glances at you sideways with an expectant look, a seductive smirk plastered on his canine muzzle. <i>“Every time I see you around, I get a nice tingling in my butt. You here to do something about that or is there something else you want?”</i>", parse);
	else if(cale.Slut() >= 30)
		Text.Add("He averts his gaze for a moment, an awkward silence settling between the two of you before he breaks the ice. <i>“So… you here for another go at me, or is it something else you want?”</i>", parse);
	else
		Text.Add("He glances at you with a smile on his wolfish muzzle. <i>“What’s up? Here for business or pleasure?”</i>", parse);
	
	if(GetDEBUG()) {
		Text.NL();
		Text.Add("DEBUG: relation: " + cale.relation.Get(), null, 'bold');
		Text.NL();
		Text.Add("DEBUG: slut: " + cale.slut.Get(), null, 'bold');
		Text.NL();
	}
	Text.Flush();
	
	CaleScenes.Prompt();
}

CaleScenes.Desc = function() {
	var parse = {
		
	};
	if(cale.flags["Met2"] == 0) {
		Text.Add("The wolf-morph from the time with Rosalin is seated near the fire, staring idly into the flames.", parse);
	}
	else {
		if(cale.Slut() >= 60)
			Text.Add("Cale is sitting by the fire. He glances at you with a lecherous look and an evil smirk. You note that he’s idly pawing his butt, while his tail wags above. The moment he spots you staring, he calls you over with a crooked finger. No doubt he’s thinking about all the fun you’ve had together.", parse);
		else if(cale.Slut() >= 30)
			Text.Add("Cale sits by the fire, idly looking at the flames dance. He sometimes glances your way and when your eyes meet, he casts you a lopsided grin.", parse);
		else
			Text.Add("Cale is sitting by the fire, staring idly into the flames.", parse);
	}
	Text.NL();
}

CaleScenes.FirstApproach = function() {
	var parse = {
		playername : player.name,
		guyGal     : player.mfTrue("guy", "gal")
	};
	parse = player.ParserTags(parse);
	
	Text.Clear();
	
	world.TimeStep({minute: 30});
	
	Text.Add("You approach the wolf-morph, calling out a greeting to him as you join him at the fireside.", parse);
	Text.NL();
	if(cale.flags["Met"] == Cale.Met.SharedFuckedHim) {
		Text.Add("Your eyes roam appreciatively over the wolf's form until they focus on the sweet ass you fucked before, and you can't help but lick your lips at the memory.", parse);
		Text.NL();
		Text.Add("He jumps a little at your greeting, looking to the sides nervously as he finally lets his gaze settle on you. <i>“Oh, umm… H-hey there,”</i> he greets you back with a nervous grin. <i>“How you doing… err…”</i> He trails off realizing he didn’t quite catch your name.", parse);
		Text.NL();
		Text.Add("You tell him that your name is [playername]. So, how about him? How has he been doing since the two of you... met?", parse);
		Text.NL();
		Text.Add("He looks down, a bit flustered. <i>“You know… just thinking,”</i> he offers tentatively.", parse);
		Text.Flush();
		
		//[BeForward] [Neutral] [Comfort]
		var options = new Array();
		options.push({ nameStr : "Be forward",
			func : function() {
				Text.Clear();
				Text.Add("Smirking to yourself, you saunter closer to the wolf-morph, who visibly restrains himself from flinching. Your hand reaches out and presses itself gently against his thigh, feeling the soft fur underneath. With slow, sensuous motions, your fingers start to rub up and down, trailing the contour of his nicely muscled legs.", parse);
				Text.NL();
				Text.Add("As you continue stroking his thigh, you casually ask what he was thinking about. You feign ignorance of his growing arousal, but really you are drinking in every reaction, delight flooding you as you see the bulge between his legs growing ever more pronounced.", parse);
				Text.NL();
				
				player.AddLustFraction(0.5);
				
				Text.Add("He swallows audibly, looking at your hand rubbing his thigh. <i>“I was thinking about what we did…”</i> he trails off. <i>“Not with Rosie. That’s run of the mill. But what <b>we</b> did over there. Or rather, what <b>you</b> did to <b>me</b>,”</i> he adds, averting his gaze with a slight frown.", parse);
				Text.NL();
				Text.Add("You know he's not going to say he didn't like it, you declare, your hand slowly creeping inwards, over his thigh and toward his loins. You dexterously flick the button holding his pants closed, exposing the tip of his canine member and drawing a shudder from the wolf. Enjoying every moment of this exchange, you wrap your fingers possessively around the warmth of his now-erect cock. Up and down, you stroke him in slow, languid pumps, your thumb rubbing circles over his pointy glans.", parse);
				Text.NL();
				Text.Add("He thrusts in tandem with your stroking, wary of disturbing your pace lest you stop your ministrations. He moans softly as he begins gyrating his hips. <i>“I didn’t… I mean, I didn’t say I didn’t like it,”</i> he replies, humping your hand softly. Considering the way his face is scrunching up in pleasure, you’d guess this simple handjob is feeling nearly as good as Rosalin’s pussy.", parse);
				Text.NL();
				Text.Add("Smirking, you ask if he remembers asking for another go after your last encounter, continuing to pump and rub as you do so. His eyes force themselves open and he looks at you, nodding mutely. In reply, you remove your hand from his dick.", parse);
				Text.NL();
				if(player.FirstCock())
					Text.Add("Before he can protest, you take his hand and place it against your own loins. With a grin, you tell him that you came to grant him his request.", parse);
				else if(player.Strapon())
					Text.Add("Leaning toward him, you stage whisper into his ear that you have just the thing for him, despite your current lack of a cock.", parse);
				else
					Text.Add("Leaning toward him, you stage whisper into his ear that it might not be the same as before, but you're looking for another round yourself.", parse);
				Text.Add(" He begins panting at your declaration. After a quick look around, he points to a tent nearby. <i>“That’s my tent,”</i> he says, getting up on his feet and walking over, not caring that his erect wolf prick is bobbing in the wind for all the world to see. He looks over his shoulder to see if you’re coming or not.", parse);
				Text.NL();
				Text.Add("Chuckling, you remark that he’s in quite a hurry to be used isn’t he? Well, you’d like to at least know the name of your beta before going any further.", parse);
				Text.NL();
				Text.Add("He slaps his forehead with an open palm. Clearly, he forgot his manners in his eagerness to get you inside his tent. <i>“S-sorry,”</i> he apologizes in embarrassment. <i>“I’m Cale,”</i> he says, tail wagging as he bows slightly. <i>“Umm… [playername].”</i>", parse);
				Text.NL();
				Text.Add("Now, that’s better. You get up on your [feet] and approach him, deftly buttoning his pants up. Can’t have the whole world sizing up your beta now, can you? Then you turn him toward the tent he pointed at earlier, and send him on his way with an audible slap on his butt. He yelps in surprise, but quickly moves to comply as you follow in tow.", parse);
				Text.Flush();
				
				cale.slut.IncreaseStat(50, 5);
				
				Gui.NextPrompt(function() {
					Text.Clear();
					CaleScenes.TentSex();
				});
			}, enabled : true,
			tooltip : "Looks like you definitely left the right sort of impression on him. Why not tease him a little?"
		});
		options.push({ nameStr : "Neutral",
			func : function() {
				Text.Clear();
				Text.Add("You ask if he meant what he said before - about wanting to try things your way again.", parse);
				Text.NL();
				Text.Add("He scratches the back of his head, looking more than a little flustered at your bluntness. <i>“I guess I did. I mean… I’ve never done anything like that. Actually, I’d never even considered it, but yeah. I guess it felt pretty good in the end,”</i> he explains. Seems like he’s confused about what to make of this whole situation.", parse);
				Text.NL();
				Text.Add("Shrugging your shoulders, you ask what the problem is then; he enjoyed it, he admits he enjoyed it, he thinks he could enjoy doing it again. What's to worry about it?", parse);
				Text.NL();
				Text.Add("But anyway, you were hoping he might tell you his name? You didn't catch it when you two were... ‘introduced’ by Rosalin.", parse);
				Text.NL();
				Text.Add("His ears twitch in realization. <i>“Yeah, that’s right,”</i> he clears his throat. <i>“I’m Cale. I suppose it’s a bit late, but nice to meet you… umm… [playername].”</i> He offers you a hand in a friendly gesture. <i>“I said I’d get you back for what you did when we were with Rosie, but I guess it’s fine. Let bygones be bygones.”</i>", parse);
				Text.NL();
				Text.Add("You reach out and take his hand, shaking it firmly as you return the sentiment.", parse);
				Text.NL();
				Text.Add("<i>“Great, so is there anything you’d like to talk about? Or is there anything I can do for you?”</i>", parse);
				Text.Flush();
				
				CaleScenes.Prompt();
			}, enabled : true,
			tooltip : "Let's just cut to the chase."
		});
		options.push({ nameStr : "Comfort",
			func : function() {
				Text.Clear();
				Text.Add("Smiling gently, you ask if he's alright, and apologize for how you treated him that time with Rosalin.", parse);
				Text.NL();
				Text.Add("He looks a bit surprised at the apology. <i>“Huh? Oh, right. Sure, no problem. It’s not like I didn’t enjoy it,”</i> he examines you, a bit unsure of himself. <i>“A bit, just a bit,”</i> he hurriedly adds.", parse);
				Text.NL();
				Text.Add("You tell him that you're glad to hear that; you didn't realize he was a virgin when you picked to take him that way. You'll try to give him more of a choice in the matter in the future. If there is one, you quickly add.", parse);
				Text.NL();
				Text.Add("<i>“Right, though I should hope the terms are different. I’m a guy, and I’m sure I don’t swing that way. My thing is pitching, not catching,”</i> he states, you’re not sure if to reassure you or himself. <i>“I said I’d get you back for doing that to me, but you seem like a pretty cool [guyGal]. So you can forget about that threat,”</i> he adds, tail wagging slightly.", parse);
				Text.NL();
				
				cale.relation.IncreaseStat(100, 10);
				cale.slut.DecreaseStat(0, 10);
				
				Text.Add("You tell him that you're grateful that he's so understanding. Now, since that's behind the two of you; perhaps he wouldn't mind telling you his name? Since he never mentioned it earlier.", parse);
				Text.NL();
				Text.Add("<i>“Oh? Sure, my bad,”</i> he clears his throat, <i>“I’m Cale, and I’ve taken it upon myself to be around anytime Rosie needs a quick shag. Nice to meet you, [playername].”</i> He extends a hand in greeting.", parse);
				Text.NL();
				Text.Add("You grip his hand and tell him that it's nice to meet him as well.", parse);
				Text.NL();
				Text.Add("<i>“Now that we’ve been properly introduced, something I can do for you?”</i>", parse);
				Text.Flush();
				
				CaleScenes.Prompt();
			}, enabled : true,
			tooltip : "He's obviously uncertain about how he feels; why not be nice to him?"
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else if(cale.flags["Met"] == Cale.Met.SharedGotFucked) {
		Text.Add("You swallow hard, mind replaying the memories of him as he fucked you earlier, a pang of equal parts lust and intimidation momentarily rocking through you.", parse);
		Text.NL();
		parse["thigh"] = player.LowerBodyType() == LowerBodyType.Single ? parse["hip"] : parse["thigh"];
		Text.Add("His ears perk up as he catches your greeting, looking you over with a big grin. <i>“Hello, how you doing?”</i> the wolf asks, wagging his tail. <i>“What brings you my humble spot by the bonfire?”</i> he flirts, placing a hand on your [thigh].", parse);
		Text.NL();
		Text.Add("You wanted to talk to him, you reply, doing your best to ignore his hand as it rests upon your [skin].", parse);
		Text.NL();
		Text.Add("<i>“Well… now you have my undivided attention,”</i> he flirts back with a lopsided smile, as he moves his hand to caress your side.", parse);
		Text.Flush();
		
		//[Reassert] [Ignore] [Enjoy]
		var options = new Array();
		options.push({ nameStr : "Reassert",
			func : function() {
				Text.Clear();
				parse["dom"] = player.SubDom() > 50 ? ", lest he lose it" : "";
				Text.Add("Bristling indignantly, you look the amorous wolf right in the eye and snap at him to remove his paw[dom], glaring fiercely and making it clear from tone and posture that you won't brook any refusal.", parse);
				Text.NL();
				
				player.subDom.IncreaseStat(50, 2);
				player.slut.DecreaseStat(0, 2);
				
				if(player.Femininity() > 0.3)
					Text.Add("<i>“Frisky one, aren’t you? But fair enough. I can take a hint.”</i>", parse);
				else
					Text.Add("<i>“Didn’t like getting done by me, huh?”</i> he chortles. <i>“That’s alright then. I can take a hint.”</i>", parse);
				Text.Add(" He takes a moment clear his throat, then offers you a hand. </i>”The name’s Cale. Bit late for greeting, I think, but nice to meetcha,”</i> Cale grins, tail wagging behind him.", parse);
				Text.NL();
				Text.Add("You take his hand and shake it, sharing your own name in turn.", parse);
				Text.NL();
				Text.Add("<i>“So, now that we’ve met. What can I do ya for?”</i> he smirks.", parse);
				Text.Flush();
				
				CaleScenes.Prompt();
			}, enabled : true,
			tooltip : "Tell him to keep his paws to himself."
		});
		options.push({ nameStr : "Ignore",
			func : function() {
				Text.Clear();
				Text.Add("Your eyes flick casually to his hand, but then you look back at him nonchalantly, making no show of any feelings you may have about it being there.", parse);
				Text.NL();
				Text.Add("<i>“It might be a bit late for introductions, but the name’s Cale. Nice to meetcha,”</i> he gives you a friendly tap on the shoulder.", parse);
				Text.NL();
				Text.Add("You nod in acknowledgement, returning the greeting and providing your own name in return.", parse);
				Text.NL();
				Text.Add("<i>“So, what brings you? Came to take me up on my offer or is there something else you want?”</i> he asks with a lopsided grin.", parse);
				Text.Flush();
				
				CaleScenes.Prompt();
			}, enabled : true,
			tooltip : "Eh, it's not hurting you, let him rub."
		});
		options.push({ nameStr : "Enjoy",
			func : function() {
				Text.Clear();
				
				parse["ears"] = player.HasFlexibleEars() ? Text.Parse(" your [ears] flattened against your skull,", parse) : "";
				Text.Add("Eyes sinking half closed,[ears] you smile in pleasure and let out a soft coo of delight. You lean deliberately against his hand, stretching slightly to let him touch you however he wants.", parse);
				Text.NL();
				
				player.subDom.DecreaseStat(-50, 2);
				player.slut.IncreaseStat(50, 2);
				
				Text.Add("He chuckles at your reaction, growing bolder as he hooks his arm around your waist and pulls you closer against himself. This close to him, you can easily smell his musk, a mixture of grass, earth and man. Very intoxicating. You find yourself closing your eyes and leaning over him to catch a better whiff of his scent.", parse);
				Text.NL();
				parse["fem"] = player.mfFem("", ", my pretty");
				Text.Add("<i>“Enjoying this, are you?”</i> he asks, chuckling at your submissive demeanor. <i>“I feel like we should at least introduce ourselves before going further though.”</i> He places his hands on your shoulders and pushes you away to look into your eyes, <i>“My name is Cale. What is yours[fem]?”</i>", parse);
				Text.NL();
				Text.Add("You can't help pouting at being pushed away like that, but you smile at the attention he's showing you, chirping your own name in response.", parse);
				Text.NL();
				parse["fem"] = player.mfFem("", ", pretty");
				Text.Add("<i>“[playername], huh? That name suits you. Now tell me[fem], why did you come to my little spot by the bonfire? Maybe you wanted to make good on my offer?”</i> he chuckles. Then he points to a nearby tent. <i>“That’s my tent. Why don’t we head inside and get a bit more comfortable?”</i> he asks, giving your [butt] a slap in the process.", parse);
				Text.Flush();
				
				//[Yes][No]
				var options = new Array();
				options.push({ nameStr : "Yes",
					func : function() {
						Text.Clear();
						
						player.slut.IncreaseStat(100, 3);
						
						Text.Add("<i>“Good. Come with me,”</i> he says, giving your [butt] a quick grope. He gets up, adjusting his trousers to make his bulge just a bit more pronounced. You find your eyes homing in on said bulge and the promise it holds. <i>“My eyes are up here,”</i> he chuckles, breaking you out of your reverie. He extends a hand to help you stand.", parse);
						Text.NL();
						Text.Add("Eagerly, you reach out and take it, happily accepting his help and pulling yourself right up against him once you are upright again.", parse);
						Text.NL();
						Text.Add("Looping an arm around your waist to grab your butt and pull you close, he leads you toward his tent. <i>“This is gonna be fun.”</i>", parse);
						Text.Flush();
						
						Gui.NextPrompt(function() {
							Text.Clear();
							CaleScenes.TentSex();
						});
					}, enabled : true,
					tooltip : "Well, you were practically asking for it, why not go all the way?"
				});
				options.push({ nameStr : "No",
					func : function() {
						Text.Clear();
						Text.Add("<i>“Too bad. But my offer stands. Come to me whenever you feel like you need some good wuffie lovin,”</i> he chuckles. Slowly, he releases you and gives you some distance. <i>“Now then, since you don’t want to visit my tent, what can I do for you?”</i>", parse);
						Text.Flush();
						
						CaleScenes.Prompt();
					}, enabled : true,
					tooltip : "This is getting a little too far, you didn't come here to fuck. Well, not just yet anyway."
				});
				Gui.SetButtonsFromList(options, false, null);
			}, enabled : true,
			tooltip : "This feels nice; why not let him see that you're enjoying it?"
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else if(cale.flags["Met"] == Cale.Met.CaleTookRosalin) {
		Text.Add("<i>“Hey there! Didn’t catch your name last time,”</i> the wolf grins, reminiscing of his romp with Rosalin. <i>“I was a bit preoccupied.”</i>", parse);
		Text.NL();
		Text.Add("You introduce yourself, wondering if he and the alchemist are a couple.", parse);
		Text.NL();
		Text.Add("<i>“Rosie? Hah! Nah, she just likes me for my cock.”</i> He certainly seems sure of himself. <i>“Name’s Cale, by the way. A pleasure.”</i> He pats the wooden log he’s sitting on. <i>“Have a seat, [playername].”</i>", parse);
		Text.NL();
		Text.Add("He goes on to explain that he and Rosalin are fuckbuddies, if more by happenstance than design. <i>“I just happened to be around when she went into heat, and she’s consistently come back for more ever since. If you have your eyes set on her, I don’t mind, though. She’s a bit crazy, but a really nice fuck.”</i>", parse);
		Text.NL();
		Text.Add("<i>“So, what did you want to talk about?”</i>", parse);
		Text.Flush();
		
		CaleScenes.Prompt();
	}
	else { // You took Rosalin
		Text.Add("You explain that you were wondering if he's alright with what happened back with Rosalin.", parse);
		Text.NL();
		Text.Add("He turns to look at you, chuckling, he replies, <i>“Sure. I like Rosie, but it’s not like we’re attached on the hips or anything. She just does her thing with whomever is handy at the time,”</i> he shrugs. <i>“I just make sure to be handy most of the time,”</i> he adds with a grin.", parse);
		Text.NL();
		Text.Add("You nod as you digest that fact. Then, prompted by curiosity, you ask how he knows Rosalin - it looks and sounds like the two of them are pretty close.", parse);
		Text.NL();
		Text.Add("<i>“Rosie and I got a thing going… well, I do anyway. But it’s nothing serious. She needs to get laid sometimes, and I like getting laid. She needs a stud, and I like pussy. Simple math. ", parse);
		if(cale.flags["Met"] == Cale.Met.YouTookRosalin)
			Text.Add("Not gonna lie, I’m not happy that you beat me to the punch last time, but I won’t hold it against you either. So rest easy, there’s always next time,”</i> he gives you a lopsided grin.", parse);
		else
			Text.Add("I don’t mind sharing her from time to time. So long as you don’t hog all of her for yourself.”</i> The wolf gives you a lopsided grin.", parse);
		Text.NL();
		Text.Add("You nod to show that you understand what he's saying, and then ask what his name is, politely offering your own in exchange.", parse);
		Text.NL();
		Text.Add("<i>“Oh, yeah. Sorry 'bout my manners. I’m Cale, pleased to meetcha [playername].”</i> He offers you a friendly hand.", parse);
		Text.NL();
		Text.Add("You take his hand and shake it.", parse);
		Text.NL();
		Text.Add("<i>“So, got any business with me?”</i>", parse);
		Text.Flush();
		
		CaleScenes.Prompt();
	}
}

CaleScenes.TalkSlut = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("When you approach him, Cale winces visibly. You ask him what’s up.", parse);
	Text.NL();
	Text.Add("<i>“I, uh… you are not planning on fucking me again, are you?”</i> he looks at you apprehensively. What, he’s getting cold feet <i>now</i>? That seems just a little bit too late. <i>“Well, you can, if you want, I guess,”</i> he still looks a bit uncomfortable, so you tell him to just spit it out.", parse);
	Text.NL();
	Text.Add("<i>“Ah, well, it feels good and all, taking you, but I was wondering if there was something for the pain… maybe you could try to find something? It isn’t that bad,”</i> he hurriedly adds, <i>“just at the start.”</i>", parse);
	Text.NL();
	Text.Add("Perhaps you could ask Rosalin about it. Out loud, you tell him that you’ll find something. Cale nods, feeling reassured. <i>“So, what did you want?”</i>", parse);
	Text.Flush();
	
	CaleScenes.Prompt();
}

CaleScenes.Prompt = function() {
	var parse = {
		
	};
	
	//[Talk][Tent][Sex][Shop][Rogue][Anal]
	var options = new Array();
	options.push({ nameStr : "Talk",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Just chat then? Sure, whatcha wanna talk about?”</i>", parse);
			Text.Flush();
			CaleScenes.TalkPrompt();
		}, enabled : true,
		tooltip : "Have a chat with Cale."
	});
	options.push({ nameStr : "Tent",
		func : function() {
			Text.Clear();
			if(cale.Slut() >= 60)
				Text.Add("<i>“Why, are you getting shy all of a sudden?”</i> Cale teases you with a grin. <i>“You can take me for a ride anytime, any place.”</i> Eager to get started, the wolf pulls you along, heading for his tent.", parse);
			else if(cale.Slut() >= 30)
				Text.Add("<i>“Sure, I don’t mind,”</i> Cale nods, licking his lips. <i>“My butt is always ready for action!”</i> He motions for you to follow, heading for his tent.", parse);
			else
				Text.Add("<i>“If you’re offering, I’m game,”</i> he replies, grinning. <i>“This dog is always ready for action.”</i> You roll your eyes, but follow him as he heads for his tent.", parse);
			Text.NL();
			Text.Flush();
			
			CaleScenes.TentSex();
		}, enabled : true,
		tooltip : "Ask if he’s up for a quick skirmish in his tent."
	});
	options.push({ nameStr : "Sex",
		func : function() {
			Text.Clear();
			CaleScenes.OutsideSex();
		}, enabled : true,
		tooltip : "Ask the wolf if he's up for a fuck - right here, right now."
	});
	options.push({ nameStr : "Shop",
		func : function() {
			Text.Clear();
			Text.Add("<i>“You're interested in buying what I got, huh? Well, sure, I can let you take a look,”</i> the wolf-morph notes. From his various pockets and pouches, he brings out his most recent gathering results, displaying them for you. <i>“What do you think of these?”</i>", parse);
			Text.NL();
			Text.Flush();
			
			CaleScenes.Shop();
		}, enabled : true,
		tooltip : "See what alchemical ingredients Cale can offer you today."
	});
	if(cale.flags["Rogue"] > 0) {
		options.push({ nameStr : "Rogue",
			func : CaleScenes.Rogue, enabled : true,
			tooltip : "Ask him to teach you about the finer points of being a rogue."
		});
	}
	Gui.SetButtonsFromList(options, true, PrintDefaultOptions);
}

CaleScenes.Shop = function() {
	var parse = {
		
	};
	
	CaleScenes.Shopbought = false;
	
	var backPrompt = function() {
		Text.Clear();
		if(CaleScenes.Shopbought)
			Text.Add("<i>“Knew I'd have something you wanted, thanks for buying!”</i> he quips, giving you a toothy grin of appreciation.", parse);
		else
			Text.Add("<i>“Nothing of interest right now? Alright, come back tomorrow. I should have some new things then,”</i> he assures you.", parse);
		Text.Flush();
		
		CaleScenes.Prompt();
	}
	
	var buyFunc = function() {
		CaleScenes.Shopbought = true;
		return false;
	}
	
	var timestamp = Math.floor(world.time.ToDays());
	if(cale.flags["shop"] < timestamp || cale.shop.inventory.length == 0) {
		// Randomize inventory
		cale.shop.inventory = [];
		
		var num = Math.round(4 + 8 * Math.random());
		for(var i = 0; i < num; i++) {
			var it = cale.shopItems[Math.floor(Math.random() * cale.shopItems.length)];
			var found = false;
			for(var j = 0; j < cale.shop.inventory.length; j++) {
				if(it == cale.shop.inventory[j].it) {
					found = true;
					break;
				}
			}
			if(found) continue;
			cale.shop.AddItem(it, 5, null, buyFunc);
		}
		
		cale.flags["shop"] = timestamp;
	}
	
	cale.shop.Buy(backPrompt, true);
}

CaleScenes.TalkPrompt = function() {
	var parse = {
		playername : player.name
	};
	parse = player.ParserTags(parse);
	parse = cale.ParserTags(parse, "c");
	
	//[Himself][His Past][Goals][Rosalin]
	var options = new Array();
	options.push({ nameStr : "Himself",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Myself? Eh, I’m not really that interesting,”</i> he says nonchalantly.", parse);
			Text.NL();
			Text.Add("You assure him that you still want to hear about him; please, won't he share a little with you?", parse);
			Text.NL();
			Text.Add("Smiling, he replies, <i>“Well, if you insist. I’m called Cale, I’m a wolf, and my job is currently Rosie’s fetcher of alchemical goods and convenient fuckbuddy. Though I really go out there to get stuff for Rosie, I set a few interesting catches aside for selling. Rosie doesn’t seem to mind, as long as I meet her demands, so why not make some money on the side, right?”</i>", parse);
			Text.NL();
			Text.Add("You give him a politely neutral response, mentally tucking that little tidbit away as being potentially helpful.", parse);
			Text.NL();
			Text.Add("<i>“I’m not a very deep or thoughtful guy. Life is short, so I prefer to live in the moment. My interests lie in eating, drinking, gambling and sex, of course. Then again, who doesn’t enjoy a good shagging, right?”</i> he laughs at his own statement.", parse);
			Text.NL();
			Text.Add("Very few people that you can think of, you confess - especially here in Eden.", parse);
			Text.NL();
			Text.Add("<i>“Elaborating on the sex part, I like pussy. Wet, tight, slippery and hot pussies. The taste, the scent, the feel and the sound of my dick scraping against their walls as they work to milk me, I simply love it. ", parse);
			if(cale.Slut() >= 60) {
				Text.Add("Though I admit that since you’ve showed me a good time, I’ve been thinking that cocks aren’t so bad either. The way they throb, how hot they are, how hard they are, and how a big, fat dick can stir up my insides...”</i> he shudders in a sudden influx of arousal. <i>“ That feeling is just… great. I don’t mind putting out for a good meat if they can show me a good time,”</i> he explains.", parse);
				Text.NL();
				Text.Add("So, he hasn't had any problems with his new kink?", parse);
				Text.NL();
				Text.Add("<i>“Not at all. I’m a sexy wolf. Some people fantasize about my cock tying them and filling them up with my hot seed. Others think about my [canus] milking their dicks for all its worth as they flood my guts with their hot jizz. I can appreciate one just as much as the other. All in all, I should be thanking you for broadening my horizons. I seriously would never have imagined anal would feel this good.”</i>", parse);
				Text.NL();
				Text.Add("You tell him that it's perfectly alright; you're happy to have helped him out. You always knew he'd love catching if he only gave it a try.", parse);
			}
			else if(cale.Slut() >= 30) {
				Text.Add(" I… lately I’ve been thinking that fooling around and getting my ass stuffed might not be so bad. Y’know? Not that I’d rather be stuffed rather than being the stuffee. But… let’s just say it’s not so bad. At least, it feels good when we do it.”</i> He coughs awkwardly, trying to mask his bashfulness at broaching the subject.", parse);
				Text.NL();
				Text.Add("You simply smile happily. Sounds like your wolf-slut is coming along nicely; now he's starting to admit he enjoys having your [cocks] in his ass, it's time to start pushing him to really relish it. A bit more tutelage and he should be a ripe, ready buttslut for you.", parse);
			}
			else {
				Text.Add("I don’t really like men, but if they’re craving some hot wolf stuffing I don’t mind obliging. It’d be a sin to keep all this,”</i> he motions toward himself with a flourish, <i>“off the playing field.”</i> He grins, full of confidence.", parse);
				Text.NL();
				Text.Add("Cocky bastard, isn't he? Of course, you don't say so to his face.", parse);
				if(player.FirstCock())
					Text.Add(" Maybe you should show him that it can be fun to be the stuffed as well as the stuffer; you're certainly equipped for it. Yeah, some proper training with your [cocks] and you're certain he'll start singing a different tune...", parse);
			}
			Text.NL();
			Text.Add("<i>“I guess that’s pretty much it. Like I said, I’m a simple guy who enjoys simple pleasures, nothing more. Anything else you wanna talk about or did you have enough Cale for the time being?”</i> he jokingly asks.", parse);
			Text.Flush();
			
			cale.relation.IncreaseStat(100, 2);
			world.TimeStep({minute : 15});
			CaleScenes.TalkPrompt();
		}, enabled : true,
		tooltip : "Ask Cale to tell you a little about himself."
	});
	options.push({ nameStr : "His Past",
		func : CaleScenes.TalkPast, enabled : true,
		tooltip : "See if Cale will share something about his past with you."
	});
	options.push({ nameStr : "Goals",
		func : function() {
			Text.Clear();
			Text.Add("<i>“I’m sorta a guy living in the moment,”</i> Cale says, scratching his chin. <i>“I guess I don’t really think about stuff like that too much. When you get right down to it, I’m in it for the ladies.”</i> He stretches languidly, flexing his muscles.", parse);
			Text.NL();
			Text.Add("<i>“When you got a body like this, you gotta share, you know?”</i>", parse);
			Text.NL();
			if(cale.sex.rAnal > 0) {
				Text.Add("Yeah, you know a thing or two about him sharing. And not only that cock of his you add, grinning.", parse);
				Text.NL();
				if(cale.Slut() >= 60)
					Text.Add("<i>“You sure do,”</i> Cale purrs. <i>“Cale doesn’t mind sharing all his naughty bits, if you know what I mean.”</i>", parse);
				else if(cale.Slut() >= 30)
					Text.Add("<i>“Heh, guess I swing both ways,”</i> he chuckles. <i>“No one can resist this, am I right?”</i>", parse);
				else
					Text.Add("<i>“Well, gotta try new things, right?”</i> The wolf looks unperturbed.", parse);
				Text.NL();
			}
			Text.Add("<i>“Anyways, I just want to get by. Right now, I’ve got a nice thing going here. Good company, I get food and a place to sleep in exchange for relatively little work… and I got pussy on beck and call.”</i> From his wide grin, you guess that last part is the most important.", parse);
			Text.NL();
			Text.Add("<i>“Not really sure where I want to go from here. I think I’ll stick around for a while.”</i>", parse);
			Text.Flush();
			
			cale.relation.IncreaseStat(100, 1);
			world.TimeStep({minute : 5});
			CaleScenes.TalkPrompt();
		}, enabled : true,
		tooltip : "What is he looking for in life?"
	});
	options.push({ nameStr : "Rosalin",
		func : function() {
			Text.Clear();
			
			if(cale.flags["rosPast"] < 1)
				cale.flags["rosPast"] = 1;
			
			Text.Add("<i>“Rosie is a very… carefree girl. She took me in and invited me to her tent when I was wandering the countryside after leaving home. She was nice to me, so I help her out.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Be careful when asking Rosalin to mix something up for you, though.”</i>", parse);
			Text.NL();
			Text.Add("Why would he say that?", parse);
			Text.NL();
			Text.Add("<i>“That's how I became a wolf.”</i>", parse);
			Text.NL();
			Text.Add("Oh...", parse);
			Text.NL();
			Text.Add("<i>“Don't take this the wrong way. I love being a wolf, but I had originally asked just for heightened senses. She likes experimenting; always giving things an ‘extra punch’,”</i> he chuckles, shaking his head. <i>“In the end, I guess I got what I wanted, but the tail took some getting used to,”</i> he smiles, wagging his tail for emphasis.", parse);
			Text.NL();
			if(cale.Relation() > 30)
				Text.Add("<i>“To tell you the truth, I’ll always have a soft spot for her. She’s kinda crazy, but she has her heart in the right place.”</i>", parse);
			else
				Text.Add("<i>“All in all, she’s harmless. Well, basically harmless - as long as you don’t accept any food or drinks she offers you.”</i>", parse);
			Text.NL();
			if(rosalin.flags["PrefGender"] == Gender.male) {
				Text.Add("He, you point out.", parse);
				Text.NL();
				Text.Add("<i>“Ugh, that’s going to take some time getting used to,”</i> Cale mutters, scratching his head.", parse);
			}
			Text.Flush();
			cale.relation.IncreaseStat(100, 1);
			world.TimeStep({minute : 5});
			CaleScenes.TalkPrompt();
		}, enabled : true,
		tooltip : "So, what is the story between him and Rosalin?"
	});
	if(cale.Butt().virgin == false) {
		options.push({ nameStr : "Anal",
			func : function() {
				Text.Clear();
				if(cale.flags["Met2"] == Cale.Met2.TalkedSlut) {
					Text.Add("<i>“Ah, don’t worry about what I said before, I like it, I like it,”</i> the wolf hurriedly assures you. <i>“A lot, actually,”</i> he adds, blushing faintly.", parse);
					Text.NL();
					Text.Add("<i>“...Still, if you could find something for the pain, perhaps some potion…?”</i>", parse);
				}
				else {
					if(cale.Slut() >= 60) {
						Text.Add("<i>“Ever since Rosie gave me that cream, I’ve hardly been able to think of anything else!”</i> Cale moans sultrily. <i>“I go out foraging for ingredients, but all I hope for is to be ambushed by some big-cocked monster who’ll fuck me.”</i> He looks hopeful. <i>“You’ll fuck me, right [playername]?”</i>", parse);
					}
					else if(cale.Slut() >= 30) {
						Text.Add("<i>“That should be obvious by now, I’d think,”</i> Cale grins lecherously. <i>“Never knew being on the receiving end could feel so good, so thanks for showing me that, [playername].”</i>", parse);
						Text.NL();
						Text.Add("You live to serve.", parse);
					}
					else {
						Text.Add("<i>“You just love rubbing it in, don’t you?”</i> Cale growls accusingly. <i>“Guess I can’t complain too much, it’s rather new to me, but it doesn’t feel that bad.”</i> He scratches his bum absently.", parse);
						Text.NL();
						Text.Add("From what you remember of his last romp, ‘not that bad’ is a bit of an understatement. Fine, let him keep his pride, for whatever it’s worth.", parse);
					}
				}
				Text.Flush();
				cale.relation.IncreaseStat(100, 1);
				world.TimeStep({minute : 5});
				CaleScenes.TalkPrompt();
			}, enabled : true,
			tooltip : "Ask him about how it feels to be the one on the receiving end."
		});
	}
	if((rosalin.flags["Anusol"] >= Rosalin.Anusol.OnTask) &&
		(rosalin.flags["Anusol"] < Rosalin.Anusol.AskedForCalesHelp)) {
		//[name]
		options.push({ nameStr : "Anal experiment",
			tooltip : "Cale goes on frequent runs for Rosalin, maybe he could get some stuff for you on the side?",
			func : function() {
				
				var first = (rosalin.flags["Anusol"] < Rosalin.Anusol.TalkedToCale);
				rosalin.flags["Anusol"] = Rosalin.Anusol.TalkedToCale;
				
				var coin = 200;
				parse["coin"] = Text.NumToText(coin);
				
				Text.Clear();
				if(first) {
					Text.Add("<i>“Sure, I wouldn’t mind some extra cash. What do you need?”</i>", parse);
					Text.NL();
					Text.Add("Recalling what Rosalin told you, you explain to the lupine hunter what you need him to keep an eye out for.", parse);
					Text.NL();
					if(cale.Buttslut()) {
						Text.Add("<i>“Alright, I can get these for you, but let’s talk about business...”</i>", parse);
						Text.NL();
						Text.Add("Curious, you ask Cale what he means.", parse);
						Text.NL();
						Text.Add("<i>“The price for this stuff usually goes for about [coin], give or take. Depends on how much I like you,”</i> he says with a lopsided smile, <i>“but luckily for you, I happen to like you a lot. I’m willing to tone the price down if you show me a good time.”</i>", parse);
						Text.NL();
						Text.Add("Despite yourself, you find yourself being a little surprised at Cale’s words; who knew he had gotten so... <i>attached</i> to you? Maybe you ought to take him up on his offer; [coin] coins isn’t chicken feed by any stretch of the imagination...", parse);
						Text.NL();
						Text.Add("<i>“Do this for me and I’ll give you a fifty off my services, but only if you do me good. I’ve been aching for a good buttfucking,”</i> he chuckles.", parse);
					}
					else {
						Text.Add("<i>“Alright, I can get these for you, but let’s talk cash. These ingredients shouldn’t be too hard to find. So let’s say… [coin].”</i>", parse);
					}
				}
				else {
					Text.Add("<i>“Oh yeah, I remember this. Got the cash yet?”</i>", parse);
				}
				Text.Flush();
				
				//[name]
				var options = new Array();
				if(cale.Buttslut()) {
					//[Deal][No sex][No deal]
					options.push({ nameStr : "Deal",
						tooltip : "Fuck Cale’s butt <i>and</i> get a discount? Sounds like a bargain!",
						func : function() {
							Text.Clear();
							Text.Add("<i>“Knew you’d see things my way. After all, who doesn’t like Cale?”</i> he grins.", parse);
							Text.NL();
							Text.Add("<i>“Alright, fork over the coins and meet me back at my tent. I think my pants are getting too tight for comfort,”</i> he says, extending his hand.", parse);
							Text.NL();
							Text.Add("Your lips curl into a smirk as you take the coins from your belongings and reach for his hand, fingers brushing his as you drop the money into his palm. Before he can move to transfer them to his pocket, your fingers wrap around his hand and the coins alike and you start leading Cale towards his tent. The wolf catches on in an instant and keeps up, tail wagging happily all the way.", parse);
							Text.NL();
							
							rosalin.flags["Anusol"] = Rosalin.Anusol.AskedForCalesHelp;
							
							party.coin -= (coin - 50);
							
							CaleScenes.TentSex();
						}, enabled : (party.coin >= coin - 50) && player.BiggestCock(null, true)
					});
					options.push({ nameStr : "No sex",
						tooltip : "You’d rather pay the full price than take his wolfy butt.",
						func : function() {
							Text.Clear();
							Text.Add("<i>“Ouch, you really know how to hurt a wolf’s feelings...”</i> he replies with a grimace.", parse);
							Text.NL();
							Text.Add("Feeling a twinge of guilt, you start to apologize for what you said.", parse);
							Text.NL();
							Text.Add("He bursts out laughing at your reaction. <i>“Just pulling your leg, bud. No hard feelings!”</i> he grins. <i>“But seriously, if you don’t want some wolf-tail, then you gotta pay full. That’ll be [coin],”</i> he extends his hand for you.", parse);
							Text.NL();
							Text.Add("That’s only fair. After a few moments of searching, you fish out the money that Cale requested and it tinkles into his open palm before he makes it vanish with a smirk.", parse);
							Text.Flush();
							
							rosalin.flags["Anusol"] = Rosalin.Anusol.AskedForCalesHelp;
							
							party.coin -= coin;
							
							CaleScenes.Prompt();
						}, enabled : (party.coin >= coin)
					});
					options.push({ nameStr : "No deal",
						tooltip : "Unfortunately, you can’t afford to pay for his services at this time.",
						func : function() {
							Text.Clear();
							Text.Add("<i>“Having a hard time getting your coin? No problem, if you change your mind you could always come back to me.”</i>", parse);
							Text.NL();
							Text.Add("You nod in understanding; you’ll have to see about filling your pockets if you want Cale’s help in acquiring Rosalin’s ingredients.", parse);
							Text.Flush();
							
							CaleScenes.Prompt();
						}, enabled : true
					});
				}
				else {
					//[Deal][No deal]
					options.push({ nameStr : "Deal",
						tooltip : "Sounds fair, he’s got himself a deal!",
						func : function() {
							Text.Clear();
							Text.Add("<i>“Alright then, just hand me the money and I’ll get you everything you need in three days time tops!”</i> he says with a confident smirk.", parse);
							Text.NL();
							Text.Add("With a smile of your own, you count out the gold he needs and pass it to him, watching as the wolf-morph makes it disappear into one of his pockets.", parse);
							Text.Flush();
							
							rosalin.flags["Anusol"] = Rosalin.Anusol.AskedForCalesHelp;
							
							party.coin -= coin;
							
							CaleScenes.Prompt();
						}, enabled : party.coin >= coin
					});
					options.push({ nameStr : "No deal",
						tooltip : "You can’t afford to pay for his services at this moment...",
						func : function() {
							Text.Clear();
							Text.Add("<i>“Having a hard time getting your coin? No problem, if you change your mind you could always come back to me.”</i>", parse);
							Text.NL();
							Text.Add("You nod in understanding; you’ll have to see about filling your pockets if you want Cale’s help in acquiring Rosalin’s ingredients.", parse);
							Text.Flush();
							
							CaleScenes.Prompt();
						}, enabled : true
					});
				}
				Gui.SetButtonsFromList(options, false, null);
			}, enabled : true
		});
	}
	Gui.SetButtonsFromList(options, true, CaleScenes.Prompt);
}

CaleScenes.TalkPast = function() {
	var parse = {
		playername : player.name
	};
	parse = player.ParserTags(parse);
	parse = cale.ParserTags(parse, "c");
	
	Text.Clear();
	Text.Add("<i>“My past? Why worry about the past? Better focus on the present, unless you happen to dislike what you see right in front of you.”</i> He puffs his chest. <i>“But we both know that’s impossible. ", parse);
	if(cale.Slut() >= 60) {
		Text.Add("After all the times you’ve plowed my [canus], it’s fair to say that you enjoy me plenty.”</i> He grins confidently. <i>“And you should know I enjoy you a lot too.”</i> He licks his lips with a predatory leer.", parse);
		Text.NL();
		Text.Add("You simply smirk back, reaching around to give his [cbutt] an appreciative slap, squeezing his butt cheek through his pants before removing your hand.", parse);
	}
	else if(cale.Slut() >= 30) {
		Text.Add("Don’t know if I care much for you buggering me. After all the times you’ve done it tho, it’d be a lie to say you don’t enjoy a good Cale.”</i>", parse);
		Text.NL();
		Text.Add("You just give him a cocky look back, remembering his ecstatic howls and moans as you ravaged his [canus] with your [cocks]. ”I don't know if I care much for it?” Hah! He'll be admitting the truth soon enough.", parse);
	}
	else if(cale.Sexed()) {
		Text.Add("We’ve had sex already. You wouldn’t bother if you didn’t find me sexy at all.”</i> He grins confidently.", parse);
		Text.NL();
		Text.Add("A calm, quiet look is all the answer you give him, waiting patiently. You have your reasons for asking, after all.", parse);
	}
	else {
		Text.Add("I’ve even been asked out by guys, y’know?”</i>", parse);
		Text.NL();
		Text.Add("What an ego. Still, you keep your mouth shut, hoping he'll get done with the bluster and tell you what you wished to hear.", parse);
	}
	Text.NL();
	Text.Add("He stretches himself, gazing into the sky for a bit before turning his gaze back to you. You just eye him expectantly.", parse);
	Text.NL();
	Text.Add("<i>“Guess you’re not gonna budge till I blab about my past, are you?”</i>", parse);
	Text.NL();
	Text.Add("You shake your head and confirm that's correct; you wouldn't have asked if you weren't interested, after all.", parse);
	Text.NL();
	
	var scenes = [];
	
	// Long
	scenes.push(function() {
		Text.Add("<i>“Okay then, but fair warning - I’m no storyteller. My past is hardly that interesting; it’s just the story of a guy scraping by and enjoying himself when he could. Now, where do I begin...”</i> he furrows his brows in thought.", parse);
		Text.NL();
		Text.Add("<i>“I guess I’ll just go ahead and say that I wasn’t always such a nice guy. Back in the day, I was running with some rather… unsavory sorts. Thugs, thieves, robbers and the likes. The wrong crowd, if you will. I wasn’t born in a very golden cradle. In fact, I don’t think I actually had a cradle to begin with, but life was good - as good as it could be for a kid living in the slums. Never met my mum, and Dad worked hard at the docks to keep us fed.”</i> He smiles softly, remembering the good old days.", parse);
		Text.NL();
		Text.Add("<i>“But yeah… might be a little cliché, but my dad was involved in an accident. Box full of iron fittings fell right over him. Got his leg smashed to bits. After that, life got harder 'cuz Dad couldn’t work anymore and we didn’t have enough coins to afford a decent healer to look at his leg. So, that’s about when I started looking for work. I should have been so lucky to find actual work… but in my case, work found me.”</i>", parse);
		Text.NL();
		Text.Add("You have two really good ideas about what that 'work' might have been, but you ask him to explain what happened.", parse);
		Text.NL();
		Text.Add("<i>“I was inside a bar, trying to get a job as a dishwasher or something, when a fight broke out. Now, this asshole was just about to hit a really pretty lady, and I wasn’t going to have any of that. That was the one lesson my dad made sure I learnt. You must always treat them ladies right. Anyway, big bully was about to punch the girl and I intervened, delivered a kick right on his family jewels.”</i> He grins.", parse);
		Text.NL();
		Text.Add("You can just see Cale doing that, and you give him a nod of recognition at the fact.", parse);
		Text.NL();
		Text.Add("<i>“Then came the surprise. The guy didn’t let out a single peep after I kicked him. He just… fell over on his back. And I was wondering how the fuck could that guy get a kick like that and not even grab his nuts, or at least turn around to deck me right on the face. As the big bully fell, I saw that he had no less than three knives sticking to his chest. Lady was some kind of gang boss or something. I nearly pissed myself when her eyes darted to me and she smiled.”</i>", parse);
		Text.NL();
		Text.Add("You can't blame him for being surprised in a situation like that.", parse);
		Text.NL();
		Text.Add("<i>“If you think the dead guy was surprising, that’s because you haven’t heard the next part. Lady was standing there, all smiles, after just having killed a guy and I’m frozen in fear as she strides over. She reaches out and pats my head, sayin: 'Boy, you got fire. I like you. Come work for me.'”</i>", parse);
		Text.NL();
		Text.Add("Definitely not how a person would expect to get a job, and certainly not what he must have expected for playing the knight in shining armor.", parse);
		Text.NL();
		Text.Add("<i>“Well, I wasn’t about to say anything that could get her mad, so I just nodded and followed after her. And that’s how I started walking with the wrong crowd,”</i> he finishes.", parse);
		Text.NL();
		Text.Add("You nod your head thoughtfully as you digest the tale, and then thank him for sharing it with you.", parse);
		Text.NL();
		Text.Add("<i>“Yeah, maybe I’ll tell you about the rest some other time. Anything else you’d like to talk about?”</i>", parse);
	});
	scenes.push(function() {
		Text.Add("<i>“Where did I leave off last time? I told you about the Lady, didn’t I?”</i> You nod, urging for him to continue the story. <i>“Prettiest woman I’ve ever met, but deadly as a viper. Never got her real name. The underworld is a bit weird like that.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Joining the gang was a spur of the moment thing, but I stayed on for quite a while. Back then, I thought I had hit the jackpot. Suddenly, I had cash I could spend, and people were throwing me fearful glances on the streets. Some proper respect ‘n all, you know?”</i>", parse);
		Text.NL();
		Text.Add("<i>“’Course, Dad wanted to know where the money came from, but he didn’t dig too deep. Beggars can’t be choosers, and deep down I think he suspected what was going on.”</i>", parse);
		Text.NL();
		Text.Add("<i>“At first, things weren’t so bad. Small jobs, like standing guard or fetching things from contacts and so on. I had to shake some people down, but I didn’t hurt anyone, just scared ‘em, you know.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Life got rougher. As I started to become someone on the street, I got into fights with rival gangs. Scuffles, ending in some bruises and perhaps a few knicks. Nothing major. Looking back on it, I think people were scared of the Lady.”</i> He looks troubled. <i>“With good reason.”</i>", parse);
		Text.NL();
		Text.Add("The wolf trails off. <i>“Can we talk about something else for a while?”</i>", parse);
	});
	scenes.push(function() {
		Text.Add("<i>“During the time I was in the gang, I made many… I dunno if ‘friends’ is the right word? Comrades. People I could trust not to stab me in the back, you know? One in particular became sort of a mentor to me, a guy called Brawler. Yeah, I know, the silly names again. He taught me how to fight dirty, how to survive on the streets. Pretty good guy, all things considered.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I became a common thug in Lady’s gang, as I showed promise as a fighter. A swift kick here, a dagger held to the throat there - I had a knack for ending fights quickly, a talent much appreciated in that business. Still have use of the stuff old Brawler taught me up to this day.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Anyway, I kept training until the Lady and Brawler decided I was good enough to start going on missions for real. This was more dangerous than the basic grunt stuff that I had been doing for them before, but it got me noticed. Soon, people would talk about me with respect when they said my name,”</i> he smiles proudly at the thought. <i>“I tell you, nothing felt so good back then as to have people notice me like that and talk about me that way. A lot of muscleheads would have started throwing their weight around, picking fights so they could get more and more of a reputation. Me? I was smarter than that,”</i> he smirks.", parse);
		Text.NL();
		Text.Add("<i>“I never picked a fight just for the hell of it; I realized a pointless fight was just going to get people to see me as another stupid, violent thug. I got more respect for not fighting unless I had to than any of those bad-tempered dimwits ever did,”</i> he brags.", parse);
		Text.NL();
		Text.Add("<i>“Of course, even when I made a name for myself, Brawler would never leave off on his training. He made it a habit to always pick me out to spar with at least once a week, and he just loved to announce a surprise match whenever he could. He always said it was good training, kept me on my toes. Me? I think he just liked fighting,”</i> Cale grins, clearly amused at the memories. <i>“I certainly can’t complain, not with all the moves I picked up because of his little matches.”</i>", parse);
		Text.NL();
		Text.Add("He shakes his head good-naturedly and sighs softly. <i>“Yeah, those were the good times,”</i> he pronounces. <i>“Challenging, yeah, but it always paid off, no matter the risk, and I had real friends at my back when things went down. Yeah, I’d say those were the golden days of my life... but they’re gone now, and they aren’t coming back,”</i> he sighs.", parse);
		Text.NL();
		Text.Add("From the melancholic look on his face, he’s clearly drifting away amongst old memories. Doesn’t look like he’s in any mood to talk further; you’ll need to come back later.", parse);
		
		//Unlock Rogue training
		if(cale.flags["Rogue"] == Cale.Rogue.Locked)
			cale.flags["Rogue"] = Cale.Rogue.First;
	});
	if(cale.Relation() >= 50) {
		scenes.push(function() {
			Text.Add("<i>“Right, where were we? I’d gotten established in the underworld of Rigard, met comrades and someone I still consider my mentor. I was living the life, the money kept flowing and I was on the good side of several girls my age living in the slums.”</i>", parse);
			Text.NL();
			Text.Add("<i>“That’s when things started to turn sour. A new rival gang showed up, invading our turf, quickly turning the streets into a warzone. Real glad I never had to face down their boss, that guy was a monster. Eight feet tall and almost as wide. Meanest scars I’ve ever seen on a guy. Called himself Malice, and wasn’t that a fitting name.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Lost a lot of buddies during that time. Saw a lot of people die. Things came to a head when Lady and a group of her best men were going to raid the enemy hideout, a warehouse in the docks district. Brawler was one of them.”</i> Cale looks troubled.", parse);
			Text.NL();
			Text.Add("<i>“No one ever figured out what really happened that night. There were a few dead bodies, but they were… their wounds were strange, not caused by any weapon I’ve ever seen. They looked like they’d been mauled by some wild animal. Neither Lady nor the rival gang leader were among them, and there were a whole lot of men missing on both sides. To this day, neither hide nor hair has been seen of any of them.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Even the Watch were stumped as to what had happened, but with the two largest roughnecks of the slums out of the way, they weren’t exactly complaining. Never saw Brawler after that, either.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Things got kind of chaotic, with everyone in the gang running around like headless chickens, the whole underworld was kinda messed up for a while, with a lot of new folks running in to fill the power gap.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Around that time, I figured that this line of work perhaps wasn’t healthy for me after all.”</i> He trails off, reminiscing about the past.", parse);
			Text.NL();
			Text.Add("You figure this was enough talking for the time being...", parse);
		});
		scenes.push(function() {
			Text.Add("<i>“So, things had just gone south, so to speak.”</i> The wolf clears his throat.", parse);
			Text.NL();
			Text.Add("<i>“Leaderless, my old gang started in-fighting, caught up in who would be the next head-honcho. I didn’t want to get into any of that, so I dropped out during the confusion. Dad was getting older, and he’d fallen ill. Money was suddenly scarce again, and I had to use all my contacts to get work.”</i>", parse);
			Text.NL();
			Text.Add("<i>“At that point, I don’t think there was anything I wouldn’t do, no job I wouldn’t take. I never killed anybody, but I think I might have, if I had to. That was a few really bad years.”</i> Cale looks very different from his usual cock-sure self. <i>“All my efforts turned to nothing when winter came one year. Dad finally kicked the bucket, and I was left without a penny to my name. Figuring things could hardly get any worse, I left Rigard for good.”</i>", parse);
			Text.NL();
			Text.Add("The pain in his voice is still raw, and you guess that this happened only months before you first arrived on Eden. You place a comforting [hand] on his shoulder.", parse);
			Text.NL();
			Text.Add("<i>“Sorry. There is only a little bit left, but could we talk about something else for a bit?”</i> Taking pity on the wolf, you nod understandingly.", parse);
		});
		scenes.push(function() {
			Text.Add("<i>“I drifted for a while, before happening across the nomads. Meeting up with Rosie here was the best thing that had happened to me in years. We hit it off pretty well, and here we are. I might not look the same as when I first came here, but that is a story for another time.”</i>", parse);
			Text.NL();
			Text.Add("<i>“And that is the story of Cale, as it is. A bit of it letdown toward the end, I know. This place isn’t too bad though, I kinda fit in. I found something to do in fetching stuff for Rosalin and helping Estevan hunt, but I mostly just lay around, enjoying the free life.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Things are much simpler here, no gangs, no plots, no killer thugs. As a wolf, I get plenty of pussy too, so life is finally being good to me.”</i>", parse);
			if(cale.Slut() >= 30) {
				Text.NL();
				Text.Add("<i>“After that, a certain [playername] came around and showed me the pleasures of buttsex. Not that I’m complaining, mind you. But I have a feeling you already know that story,”</i> he chuckles.", parse);
			}
		});
	}
	
	var sceneId = cale.flags["rotPast"];
	if(sceneId >= scenes.length) sceneId = 0;
	
	cale.flags["rotPast"] = sceneId + 1;
	
	if(cale.flags["rotPast"] > cale.flags["maxPast"])
		cale.flags["maxPast"] = cale.flags["rotPast"];
	
	// Play scene
	scenes[sceneId]();
	
	cale.relation.IncreaseStat(100, 3);
	
	Text.Flush();
	
	world.TimeStep({minute : 30});
	
	CaleScenes.TalkPrompt();
}

CaleScenes.Rogue = function() {
	var parse = {
		playername : player.name
	};
	parse = player.ParserTags(parse);
	
	Text.Clear();
	Text.Add("<i>“I never get in a fight unless I can avoid it, and when I do, I fight to win.”</i> The wolf looks a bit more serious than usual. <i>“If the streets taught me anything, it’s that fighting fair doesn’t mean shit if you don’t win, and winning is all that matters. All the nobles and their fancy duels may look impressive, but they aren’t expecting the other guy to jump and shank ‘em when they’re down.”</i>", parse);
	Text.NL();
	
	var cocksInAss = player.CocksThatFit(cale.Butt());
	
	if(cale.flags["Rogue"] == Cale.Rogue.First) {
		cale.flags["Rogue"] = Cale.Rogue.Ret;
		Text.Add("Cale scratches himself thoughtfully. <i>“Teach you, huh? Never was the pedacolalogical type. I guess I could show you a few moves though.”</i> He jumps to his feet, warming up his sinewy limbs to get some flexibility.", parse);
		Text.NL();
		Text.Add("<i>“The key is to do what the opponent doesn’t expect-”</i> ", parse);
		if(Jobs["Rogue"].Unlocked() || player.Int() >= 40) {
			Text.Add("Even if he’s doing his best to hide it, his posture gives his intent away to your perceptive eyes an instant before he springs to action. You barely sidestep the wolf’s lunge, somehow managing to keep your balance. The opportunity is too good to pass up, and you deftly grab his exposed tail and pull, toppling him over.", parse);
			Text.NL();
			Text.Add("Cale curses and sputters as he crashes into a pile, propped over the log with his ass poking out. <i>“G-guess I don’t need to tell you about always keeping a watchful eye,”</i> he chuckles, still a bit out of breath. <i>“Nice work on taking the free shot, didn’t see that one coming… uh, [playername]?”</i>", parse);
			Text.NL();
			Text.Add("With a start, you realize that you still have a firm hold on the base of his tail, your other hand hovering inches from his butt.", parse);
			if(cale.Slut() >= 30)
				Text.Add("<i>“Ah… in the situation that you have your enemy at your mercy - um - the best move would be to deliver the - uh - finishing blow,”</i> Cale quips quickly as he reads the situation, wiggling his butt helpfully.", parse);
			else if(cale.Butt().virgin)
				Text.Add("<i>“Alright, alright, no more funny business, I promise!”</i> Cale tries to wriggle free, but winces as he tries to pull his tail free of your grip. He whimpers, waiting for you to let him go.", parse);
			else
				Text.Add("<i>“N-now, I was just having a bit of fun, I promise!”</i> Cale’s voice falters, not sure if you are going to take advantage of the situation or not.", parse);
			Text.Flush();
			
			//[Let go][Fuck him]
			var options = new Array();
			options.push({ nameStr : "Let go",
				func : function() {
					Text.Clear();
					if(cale.Slut() >= 30) {
						Text.Add("<i>“Ah… okay.”</i> The wolf sounds a bit disappointed.", parse);
						Text.NL();
					}
					Text.Add("<i>“Sorry about that, guess I really don’t have it in me to be a teacher,”</i> Cale groans as he gets back on his feet, rubbing his sore bum. ", parse);
					CaleScenes.RogueTeach();
				}, enabled : true,
				tooltip : "Have mercy on him."
			});
			options.push({ nameStr : "Fuck him",
				func : function() {
					Text.Clear();
					Text.Add("You grin widely. The opportunity is just too good to pass up. Wasn’t those his words? All that matters in a fight is that you win? Still keeping a firm grip on his tail, you caress his round butt, sending a shiver up the wolf’s spine. The loser can’t be going expecting the victor to take any mercy on him, now can he?", parse);
					Text.NL();
					if(cale.Slut() >= 30) {
						parse["eager"] = cale.Slut() >= 60 ? " eager" : "";
						Text.Add("<i>“Mmm...”</i> Cale moans, lost in the sensations as you grope him. <i>“N-no mercy!”</i> he yips happily, rubbing back against your hand. He sighs languidly as you hook your thumb into the hem of his pants, pulling them down and exposing his[eager] rosebud.", parse);
					}
					else {
						parse["virgin"] = cale.Butt().virgin ? " virgin" : "";
						parse["virgin2"] = cale.Butt().virgin ? "perhaps" : "you know from experience";
						Text.Add("<i>“W-what are you doing, [playername]?!”</i> Cale whimpers, trying and failing to scramble away. In one smooth motion, you grab hold of the wolf’s pants and pull them down to his knees, baring his[virgin] rosebud for all to see. You console the struggling morph that you are just following his lesson. Besides, [virgin2] he’ll like it.", parse);
						if(cale.Butt().virgin) {
							Text.NL();
							Text.Add("<i>“I… ah… b-be gentle?”</i> he manages to stammer out. Looks like he actually might secretly want it?", parse);
						}
					}
					Text.NL();
					Text.Add("In the middle of the nomad camp, you might have a bit of an audience, but you don’t really care. What matters now is putting the wolf in his place.", parse);
					Text.NL();
					
					cale.slut.IncreaseStat(50, 5);
					
					CaleScenes.SexFuckHim(true);
				}, enabled : (cocksInAss.length > 0),
				tooltip : "All that matters is winning, wasn’t it?"
			});
			Gui.SetButtonsFromList(options, false, null);
		}
		else { // He got the drop on you
			Text.Add("Before you can react, the wolf is on you, lunging violently. You brace yourself for impact, but the impact never comes. Cale slides underneath you and kicks your [legs], tripping you and sending you crashing onto the ground. You struggle to get up as fast you can, but the wolf has you pinned down before you can accomplish much. He twists your body in a way that even ", parse);
			if(player.Str() >= 40)
				Text.Add("with your superior strength you can’t break his hold.", parse);
			else
				Text.Add("if you were stronger, you wouldn’t be able to break his hold.", parse);
			Text.NL();
			Text.Add("He further subdues you by using your own weight to slam you into the ground. It doesn’t really hurt, but the impact manages to knock the air right out of your lungs. As you gasp to catch your breath, you can feel a distinct bulge grinding against your [butt]. Looks like this little rough-housing’s gotten Cale excited…", parse);
			Text.NL();
			Text.Add("<i>“Now that I have you under control, I would deliver the finishing blow. From this position, I could pull a knife and stab you before you had the chance to fight back, or I could choke you to knock you out, or...”</i> he grinds against your butt again, making sure you can feel his growing hardness. <i>“I could take you right here, right now. But since I’m such a nice guy, if you give up now I’ll let you go. How about it?”</i>", parse);
			Text.Flush();
			
			//[Yield][Take it]
			var options = new Array();
			options.push({ nameStr : "Yield",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Good choice,”</i> he comments, releasing you. Relieved from your awkward hold, you take a moment to stretch out and work out the kinks in your muscles before you get back up. <i>“One of the most important rules is if you wanna live to see the next day is to know your limits. There’s always someone better than you out there. And surrendering might save your life or give you an opportunity to fight back.”</i> He grins.", parse);
					Text.NL();
					
					CaleScenes.RogueTeach();
				}, enabled : true,
				tooltip : "You give, you give."
			});
			options.push({ nameStr : "Take it",
				func : function() {
					Text.Clear();
					parse["vag"] = player.FirstVag() ? Text.Parse("and [vag]", parse) : "";
					Text.Add("Cale chuckles, <i>“Alright then, no mercy it is!”</i> He wrestles with your [botarmor] and somehow manages to rip it off your, exposing your naked [anus] [vag] to his appreciative eyes.", parse);
					Text.NL();
					Text.Add("<i>“One final lesson, [playername]. Us rogues do it from behind.”</i> With that, Cale thrusts forward, driving his point and his cock home. A groan escapes your throat at the stimulus, enticing you to thrust back and refusing to stop until you have reached to just above his knot.", parse);
					Text.NL();
					
					if(player.FirstVag())
						CaleScenes.SexCatchVagEntrypoint(true, false, true); // Use the customIntro flag to repress the usual initial dialogue
					else
						CaleScenes.SexCatchAnalEntrypoint(true);
				}, enabled : true,
				tooltip : "It wouldn’t be a proper lesson if he stopped here, would it?"
			});
			Gui.SetButtonsFromList(options, false, null);
		}
	}
	else {
		Text.Add("The two of you spend some time reviewing some dirty fighting techniques, this time without shenanigans, and at the end of it you feel that you have a more solid grasp of the subject.", parse);
		Text.NL();
		
		if(!Jobs["Rogue"].Unlocked()) {
			cale.relation.IncreaseStat(100, 4);
			Text.Add("<b>Unlocked the Rogue job.</b>", parse);
			Text.NL();
		}
		Text.Add("<i>“Just pray you never get into a situation where you have to use this,”</i> Cale concludes.", parse);
		Text.Flush();
		
		cale.relation.IncreaseStat(100, 1);
		world.TimeStep({hour : 1});
		
		cale.flags["Rogue"] = Cale.Rogue.Taught;
		
		CaleScenes.Prompt();
	}
}

CaleScenes.RogueTeach = function() {
	var parse = {
		
	};
	
	Text.Add("<i>“Thought I’d try show don’t tell, guess that didn’t work out too well.”</i> He flashes you a friendly grin. Well, his intentions were good enough, you suppose. Still, you’ll keep a more careful eye on him from now on.", parse);
	Text.NL();
	Text.Add("The wayward rogue goes on to describe a few other moves in his arsenal, this time without trying to demonstrate them on you.", parse);
	Text.NL();
	if(Jobs["Rogue"].Unlocked()) {
		Text.Add("None of this is news to you, but hearing the techniques described from a new source is enlightening.", parse);
	}
	else {
		Text.Add("You quickly see the advantage of this fighting style, and start musing on how you could incorporate the techniques he’s describing into your own battles. It’ll probably require quite a bit of practice.", parse);
		Text.NL();
		Text.Add("<b>Unlocked the Rogue job.</b>", parse);
	}
	Text.NL();
	Text.Add("<i>“Just pray you never get into a situation where you have to use this,”</i> Cale concludes.", parse);
	Text.Flush();
	
	cale.relation.IncreaseStat(100, 3);
	world.TimeStep({hour : 1});
	
	cale.flags["Rogue"] = Cale.Rogue.Taught;
	
	CaleScenes.Prompt();
}

export { Cale, CaleScenes };
