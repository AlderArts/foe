/*
 * 
 * Define Cale
 * 
 */
import { Entity } from '../../entity';
import { Shop } from '../../shop';
import { GetDEBUG } from '../../../app';
import { Gender } from '../../body/gender';

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



/* CALE SEX SCENES */


Scenes.Cale.Impregnate = function(mother, slot, cum) {
	mother.PregHandler().Impregnate({
		slot   : slot || PregnancyHandler.Slot.Vag,
		mother : mother,
		father : cale,
		race   : Race.Wolf,
		num    : 1,
		time   : 27 * 24,
		load   : cum
	});
}

Scenes.Cale.TentSex = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Add("The two of you duck inside the small cloth enclosure, even smaller than your own tent among the nomads. It still holds enough space to house a set of warm bedrolls, which is all you are interested in either way.", parse);
	Text.NL();
	Text.Add("Cale shrugs out of his clothes, pulling you into a close embrace, his fur tickling you. <i>“Why don’t we get started, [playername]?”</i> he murmurs, nipping your neck playfully.", parse);
	Text.Flush();
	
	var cocksInAss = player.CocksThatFit(cale.Butt());
	
	//[Oral]
	var options = new Array();
	options.push({ nameStr : "Give BJ",
		func : function() {
			Scenes.Cale.SexSuckHim();
		}, enabled : true,
		tooltip : "Offer to suck his cock."
	});
	if(player.FirstCock()) {
		options.push({ nameStr : "Get BJ",
			func : function() {
				Scenes.Cale.SexGetBJ();
			}, enabled : true,
			tooltip : "Have him blow your cock."
		});
		if(player.FirstVag()) {
			options.push({ nameStr : "Trick BJ",
				func : function() {
					Scenes.Cale.SexGetTrickBJ();
				}, enabled : true,
				tooltip : "Lure him into eating you out, then switch to getting a blowjob."
			});
		}
	}
	if(player.FirstVag()) {
		options.push({ nameStr : "Get eaten",
			func : function() {
				Text.Clear();
				Text.Add("<i>“It’d be my pleasure,”</i> Cale grins, licking his lips wolfishly.", parse);
				Text.NL();
				Scenes.Cale.SexGetEatenEntrypoint();
			}, enabled : true,
			tooltip : "Have him eat you out."
		});
		
		options.push({ nameStr : "Catch Vaginal",
			func : function() {
				Scenes.Cale.SexCatchVag();
			}, enabled : true,
			tooltip : "You want that hot wolf dick inside you, now!"
		});
	}
	options.push({ nameStr : "Catch anal",
		func : function() {
			Scenes.Cale.SexCatchAnal();
		}, enabled : true,
		tooltip : "Because Rogues do it from behind."
	});
	if(player.FirstCock() || player.Strapon()) {
		options.push({ nameStr : "Fuck him",
			func : function() {
				Text.Clear();
				if(cale.sex.rAnal == 1) {
					Text.Add("<i>“You know, I’ve been thinking about before. You know. When you did the thing.”</i> You sweetly ask him whatever he could be talking about. The wolf looks slightly pained. <i>“I… uh, I never let anyone fuck me before. Not like that.”</i>", parse);
					Text.NL();
					Text.Add("Enjoying teasing him immensely, you remind him that he <i>did</i> say he wanted to try it again.", parse);
					Text.NL();
					Text.Add("<i>“I guess I did.”</i> Cale scratches his head uncertainly, his face flushed.", parse);
					Text.NL();
					Text.Add("How about right here, right now?", parse);
					Text.NL();
					Text.Add("<i>“O-okay,”</i> the wolf yips nervously. You twirl your finger, motioning for the wolf to turn around.", parse);
				}
				else if(cale.sex.rAnal < 5) {
					Text.Add("You tell Cale that you want some more of that ass.", parse);
					Text.NL();
					Text.Add("<i>“Ah, just be gentle, okay [playername]?”</i> The wolf looks a bit nervous, but turns around on his own volition.", parse);
				}
				else if(cale.Slut() < 60) {
					Text.Add("<i>“I’m always up for a romp, you know me,”</i> Cale quips, grinning uncertainly. Whatever lingering doubts he has about this form of sex, he is quick enough to swirl around, eager for you to make your move.", parse);
				}
				else {
					Text.Add("<i>“Come on, just take me already!”</i> the needy wolf growls, grinding his butt against your crotch.", parse);
				}
				parse["tight"] = cale.Slut() >= 60 ? "pliant" : "tight";
				Text.Add(" Guided by your hand, Cale gets down on his knees, bending over one of the bedrolls in his tent. Not wasting any time, you pull down his pants, baring his round butt and [tight] rosebud.", parse);
				Text.NL();
				Text.Add("His tail is wagging back and forth in excitement, conveniently raised high to allow you full access.", parse);
				Text.NL();
				
				Scenes.Cale.SexFuckHim();
			}, enabled : cale.Butt().virgin == false && cocksInAss.length > 0,
			tooltip : "Tell him that you are going to fuck him."
		});
	}
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“What, getting cold feet? Can’t handle the wolf goodness?”</i> Cale seems a bit miffed at you getting him all riled up, but shrugs and follows you outside again.", parse);
		Text.Flush();
		
		Scenes.Cale.Prompt();
	});
}

Scenes.Cale.OutsideSex = function() {
	var parse = {
		playername : player.name
	};
	parse = rosalin.ParserPronouns(parse);
	
	if(cale.Slut() < 60) {
		Text.Add("<i>“In front of everyone?”</i> he asks a bit nervously.", parse);
		Text.NL();
		Text.Add("Why not? He doesn’t seem to mind the audience when it’s him and Rosalin making the beast with two backs.", parse);
		Text.NL();
		Text.Add("<i>“Well, Rosie is a bit different. I’m sure you noticed. [HeShe] does whatever [heshe] wants, whenever and wherever [heshe] wants. It’s not a good idea to say no to [himher], so I don’t really have an option. I just accept it. But you though… wouldn’t it be more comfortable to go back to my tent?”</i> he offers tentatively.", parse);
		Text.NL();
		Text.Add("You shake your head; no, you want to do it here and now.", parse);
		Text.NL();
		Text.Add("The wolf sighs with a shrug. <i>“Okay, fine. Have it your way. What’re we doing?”</i>", parse);
	}
	else {
		Text.Add("<i>“Feel like putting on a show?”</i> he asks teasingly.", parse);
		Text.NL();
		Text.Add("With a flirtatious smirk, you strike a seductive pose and playfully ask what he thinks the answer is.", parse);
		Text.NL();
		Text.Add("<i>“Well, what are you waiting for? A written invitation?”</i>", parse);
	}
	Text.Flush();
	
	var cocksInAss = player.CocksThatFit(cale.Butt());
	
	var options = new Array();
	options.push({ nameStr : "Give BJ",
		func : function() {
			Scenes.Cale.SexSuckHim(true);
		}, enabled : true,
		tooltip : "Offer to suck his cock."
	});
	if(player.FirstCock()) {
		options.push({ nameStr : "Get BJ",
			func : function() {
				Scenes.Cale.SexGetBJ(true);
			}, enabled : true,
			tooltip : "Have him blow your cock."
		});
		if(player.FirstVag()) {
			options.push({ nameStr : "Trick BJ",
				func : function() {
					Scenes.Cale.SexGetTrickBJ(true);
				}, enabled : true,
				tooltip : "Lure him into eating you out, then switch to getting a blowjob."
			});
		}
	}
	if(player.FirstVag()) {
		options.push({ nameStr : "Get eaten",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Sure, I was getting a bit hungry anyways,”</i> Cale grins, licking his lips. <i>“Hope you don’t mind an audience!”</i>", parse);
				Text.NL();
				Scenes.Cale.SexGetEatenEntrypoint(true);
			}, enabled : true,
			tooltip : "Have him eat you out."
		});
		options.push({ nameStr : "Catch Vaginal",
			func : function() {
				Scenes.Cale.SexCatchVag(true);
			}, enabled : true,
			tooltip : "You want that hot wolf dick inside you, now!"
		});
	}
	options.push({ nameStr : "Catch anal",
		func : function() {
			Scenes.Cale.SexCatchAnal(true);
		}, enabled : true,
		tooltip : "Because Rogues do it from behind."
	});
	if(player.FirstCock() || player.Strapon()) {
		options.push({ nameStr : "Fuck him",
			func : function() {
				Text.Clear();
				Text.Add("You twirl your finger, motioning for him to turn around. ", parse);
				if(cale.Slut() >= 60)
					Text.Add("Cale eagerly obeys, crawling on all fours as he leans over the log, wiggling his butt invitingly.", parse);
				else
					Text.Add("Throwing a few furtive glances around him, the wolf nonetheless obeys, his lust for cock bigger than his shame at being taken by you in public. Besides, how is this any different from all the times he fucked Rosalin?", parse);
				parse["tight"] = cale.Slut() >= 60 ? "pliant" : "tight";
				Text.Add(" Not wasting any time, you pull down his pants, baring his round butt and [tight] rosebud.", parse);
				Text.NL();
				Text.Add("His tail is wagging back and forth in excitement, conveniently raised high to allow you full access. ", parse);
				
				Scenes.Cale.SexFuckHim(true);
			}, enabled : cale.Butt().virgin == false && cocksInAss.length > 0 && cale.Slut() >= 30,
			tooltip : "Bend him over the log and take him right there."
		});
	}
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“You are such a tease, [playername],”</i> Cale complains.", parse);
		Text.Flush();
		
		Scenes.Cale.Prompt();
	});
}


Scenes.Cale.SexSuckHim = function(outside) {
	var parse = {
		masterMistress : player.mfTrue("master", "mistress")
	};
	
	Text.Clear();
	if(outside)
		Text.Add("<i>“My meat is always available for you, if you don’t mind the prying eyes,”</i> Cale grins, hefting his bulge.", parse);
	else
		Text.Add("<i>“Can’t go without the taste of wolf for long, eh?”</i> Cale grins, hefting his bulge.", parse);
	Text.NL();
	parse["legs"] = player.LowerBodyType() != LowerBodyType.Single ? " on your knees" : "";
	Text.Add("His bravado aside, you urge him to get out of those pants before you rip them off yourself. <i>“As my [masterMistress] commands,”</i> he replies glibly, a mocking grin on his lips as he undoes his britches, pulling them off. You get down[legs] between his legs, looking up expectantly.", parse);
	Text.NL();
	
	Scenes.Cale.SexSuckHimEntryPoint(outside);
}


Scenes.Cale.SexSuckHimEntryPoint = function(outside) {
	var virgin = cale.Butt().virgin;
	
	var parse = {
		log        : outside ? "log" : "bedroll",
		playername : player.name,
		girlBoy    : player.mfTrue("boy", "girl"),
		cAnusDesc  : function() { return cale.Butt().AnalShort(); },
		tight      : cale.Slut() >= 60 ? "pliant" : "tight"
	};
	parse = player.ParserTags(parse);
	
	Text.Add("The wolf’s crimson member is already starting to poke out of its furry sheath, roused at the promise of a wet mouth to bury itself into. You fondly caress his heavy balls as you rile him up, whispering that you can’t wait to release all that pent up wolf seed. He responds accordingly, his canine shaft giving a visible twitch as it swells bigger and bigger, further urged on by the light touch of your fingers grasping it.", parse);
	Text.NL();
	Text.Add("Settling down on the [log], Cale leans back, grunting as you coax him to full hardness with your fingers and a few quick licks of your tongue. At this range, his nine inch cock is very impressive - thick and veiny, with the massive knot lurking at its base. A drop of pre is forming on his tip, leaking out of his cumslit down his tapered glans.", parse);
	Text.NL();
	Text.Add("With his musky taste still lingering on your tongue, you are eager to dig in, to wrap your lips around his meaty wolf-hood. Starting low, you slowly lick your way up his shaft, lathering him from root to tip in your saliva.", parse);
	Text.NL();
	Text.Add("<i>“Come on, stop teasing,”</i> Cale pants, shifting his hips slightly, rubbing his cock against your upturned face. He gently caresses your [hair], not so gently urging you to get to sucking. Grasping him just above the knot, you give him a few more licks before rising to the level of his head. Your puckered lips hover a fraction of an inch from his trembling glans.", parse);
	Text.Flush();
	
	var finger = false;
	
	//[Suck][Tease][Finger]
	var options = new Array();
	options.push({ nameStr : "Suck",
		func : function() {
			Text.Clear();
			Text.Add("There are a lot of things you could do to mess with the cocky wolf, but in truth you just want his cock. Closing your eyes in bliss, you wrap your lips around the magnificent member and sink down on it, taking almost half of it on your first try.", parse);
			Text.NL();
			
			Sex.Blowjob(player, cale);
			player.FuckOral(player.Mouth(), cale.FirstCock(), 2);
			cale.Fuck(cale.FirstCock(), 2);
			
			Text.Add("<i>“That’s my [girlBoy]!”</i> Cale moans, praising you for your zeal. <i>“Can’t resist playing with my bone, eh?”</i> His caressing hand on the back of your head nudges you to go on - and while still no more than a gentle suggestion, his firm hold prevents you from completely escaping his shaft. Not that you’d want to.", parse);
			Text.NL();
			Text.Add("Setting a slow, rhythmic pace, you start sucking on Cale’s meat. As if his encouraging moans weren’t sign enough of his approval, the wolf’s canine member twitches each time you lower yourself further on it, bouncing against the roof of your mouth and splattering drops of pre all over your busy tongue.", parse);
			Text.NL();
			Text.Add("You still have a ways to go before you are deepthroating all of his impressive cock, but you let your hands busy themselves with the parts of him that are still in the open. You swap between stroking the lower end of his shaft - taking particular note of his sensitive knot - and fondling his sack, imagining yourself hearing the seed sloshing within.", parse);
			Text.NL();
			Text.Add("As if reading your mind, the wolf groans appreciatively. <i>“Got a very special gift building up for you, my dear,”</i> he whispers, breathing heavily. <i>“A big, fat lupine load meant to knock some lucky girl up with my pups. Instead, I’m gonna pour it down your throat, ain’t I nice?”</i>", parse);
			Text.NL();
			if(cale.Slut() >= 60) {
				Text.Add("<i>“Not promising it’ll be as big as when I’ve got a cock stuck up my butt, but I promise to do my best,”</i> he adds, grinning.", parse);
				Text.NL();
			}
			Text.Add("Egged on by his words, you redouble your efforts, your bobbing mouth sinking farther and farther down his shaft. The wolf’s pointed glans make the entry into your throat somewhat easier, letting you rush the final stretch in one go. Your nose rubs against his crotch as your lips wrap around his large knot, planting a kiss at the base of his sheath.", parse);
			Text.NL();
			Text.Add("<i>“That’s some technique you got there,”</i> Cale groans. ", parse);
			if(cale.sex.gBlow >= 5 && cale.Slut() >= 30)
				Text.Add("<i>“Care to give me some pointers for later?”</i>", parse);
			else
				Text.Add("<i>“Not many chicks I’ve been with can deepthroat like that!”</i>", parse);
			Text.NL();
			Text.Add("You are just getting started.", parse);
			Text.NL();
			
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "You can’t resist any longer, just dive in and take him!"
	});
	options.push({ nameStr : "Tease",
		func : function() {
			Text.Clear();
			Text.Add("With a smile playing on your lips, you hover there, your hot breath wafting on Cale’s cock. You place a single kiss on his glans, letting a strand of pre trail from his cumslit to your mouth, but that is as far as you’ll go for the moment. The wolf gives you a confused glance as you begin to stroke him slowly, your fingers dancing lightly across his veined shaft. Your other hand cradles his balls, squeezing them gently.", parse);
			Text.NL();
			Text.Add("<i>“How about that blowjob, [playername]?”</i> he asks uncertainly, wincing as you tighten your grip slightly. Instead of responding, you jerk him more strongly, trying to push a reaction from him. The lips he so desire hovers a fraction of an inch from the tip of his cock, but never touching it. Your smile widens as the wolf whimpers, his dick throbbing in your hand.", parse);
			Text.NL();
			Text.Add("Several times you make as if to wrap your lips around his girth, even going as far as opening your mouth, your tongue almost touching his head. Try as he might, Cale has no choice but to take things at your pace as you tighten your grip around his sensitive scrotum each time he tries to urge you on by rocking his hips, or to guide your head with his hand.", parse);
			Text.NL();
			Text.Add("<i>“Aah… j-just suck it! S-stop teasing me!”</i> the wolf moans pitifully. Ignoring him, you move your [hand]s higher - one encircling his knot as well as you are able, the other thumbing at his tapered tip. Cale gives another shudder at your rougher teasing, a bead of pre-cum forming on the head of his cock.", parse);
			Text.NL();
			Text.Add("<i>“Please?”</i> he huffs, panting as you blow on his sensitive glans, your open mouth hovering just above his dick. Your diligent jerking seems to be paying off as Cale’s throbbing intensifies. <i>“Ah, that feels good~”</i> he groans, closing his eyes in pleasure. They shoot right back open again when you finally decide to make your move.", parse);
			Text.NL();
			Text.Add("In one fell swoop, you dive down on his cock, almost swallowing it whole. The wolf gasps as he is pushed to the edge, shooting a small wad of pre deep down your throat. You bob your head up until only his tip remains in your mouth, only to push down all the way, taking him knot and all.", parse);
			Text.NL();
			
			Sex.Blowjob(player, cale);
			player.FuckOral(player.Mouth(), cale.FirstCock(), 2);
			cale.Fuck(cale.FirstCock(), 2);
			
			Text.Add("<i>“T-totally worth the wait,”</i> Cale moans as you place a kiss at the base of his sheath.", parse);
			Text.NL();
			
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Drag it out for as long as you can to tease him."
	});
	options.push({ nameStr : "Finger",
		func : function() {
			Text.Clear();
			Text.Add("Oh, you’ll show him teasing. He’s in for way more than he bargained for. You give his tip a swipe before you go lower down his shaft, lathering it up with long licks of your tongue. Oblivious to your plans, the wolf leans back, sighing in pleasure. You give his sack a few encouraging rubs before wetting your fingers, sliding them up his inner thigh. Simultaneously, you wrap your lips around his cock, starting to suck.", parse);
			Text.NL();
			
			Sex.Blowjob(player, cale);
			player.FuckOral(player.Mouth(), cale.FirstCock(), 2);
			cale.Fuck(cale.FirstCock(), 2);
			
			Text.Add("If Cale suspects your intentions, he’s way too busy enjoying your blowjob to protest. Slowly, ever so slowly, your slick fingers trace their way up his inner thigh, sliding in under his sack. You watch the wolf carefully, but he doesn’t react until you start teasing his [cAnusDesc].", parse);
			Text.NL();
			if(virgin)
				Text.Add("<i>“H-hey! What are you-?”</i> Cale starts, at first looking more confused than alarmed. Here. We. <i>Go</i>.", parse);
			else if(cale.Slut() >= 60)
				Text.Add("<i>“Mm, just shove it in!”</i> he gasps, spreading his legs further to allow easier access.", parse);
			else if(cale.Slut() >= 30)
				Text.Add("<i>“Mm, that feels nice...”</i> he moans, shifting slightly.", parse);
			else
				Text.Add("<i>“H-hey!”</i> Quizzically, you ask him if he wants you to stop - the unspoken implication being that he won’t be getting that blowjob either. <i>“I- uh, I guess it’s fine,”</i> he replies, looking a bit uncomfortable.", parse);
			Text.Add(" The wolf’s [tight] rosebud opens up to your probing finger, offering little resistance to the invading object. Whether due to willingness or to your simultaneous blowjob, neither does Cale. Further emboldened, you add a second digit to your anal teasing, searching for and quickly finding his sensitive prostate.", parse);
			Text.NL();
			Text.Add("You start to enthusiastically blow the wolf, going deeper and deeper on his cock; all the while, you keep up your fingering of his butt. Before long, you plant a kiss on his furred sheath, his nine inch erection halfway down your throat and his thick knot resting on your [tongue].", parse);
			Text.NL();
			
			var max = virgin ? 25 : 40;
			cale.slut.IncreaseStat(max, 1);
			
			finger = true;
			
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Give him some action on both fronts, distracting him with a blowjob while you plow his rear with your fingers."
	});
	Gui.SetButtonsFromList(options, false, null);
	
	Gui.Callstack.push(function() {
		Text.Add("You suppress your gag reflex at the long lupine dick thrusting down your throat, its conical tip helping Cale to plunge farther inside of you. Lapping at his knot with your [tongue], you moan softly, sending delightful vibrations along his member as you coax him slowly and steadily deeper. You worm your tongue inside his sheath as far as you can, further teasing him as it slides against the sensitive flesh.", parse);
		Text.NL();
		Text.Add("<i>“Damn, [playername]. If you keep this up, I’m gonna blow!”</i>", parse);
		Text.NL();
		Text.Add("Well, that just won’t do, now will it? You draw your tongue from his sheath and slowly pull your head back, letting his member glide out between your lips until it is bobbing wetly in the air before you. You kiss him gently on the very tip of his glans, stealing a quick lick at his urethra, and then move your mouth down to his knot. Slowly and luxuriantly, you stroke the very tip of your [tongue] over his knot, then lick him again just above it. In a series of smooth, gliding motions, you gently lap your way back up to his cockhead, then open your maw and envelop him once more. You suckle his length with smooth, soft gulping motions, making Cale moan and buck against you.", parse);
		Text.NL();
		if(finger) {
			Text.Add("You slowly withdraw your finger from Cale’s used tailhole, easing up on the pressure you’re exerting. With teasing strokes, you trace circles around his flexing ring, even making the occasional tantalizing thrust inside, but your motions are always light, and you avoid going so deep as to stroke his prostate. He won’t get off that easily...", parse);
			Text.NL();
		}
		Text.Add("Unhappy with his moving around, you gently but firmly take hold of his swollen balls, rolling the fur-covered orbs around with your fingers, kneading the sensitive flesh even as you continue to almost lazily suck his cock.", parse);
		Text.NL();
		Text.Add("Up above, Cale is completely helpless to your ministrations, panting and drooling like a dog. His knees are shaking and you can hear the thumping of his tail as it wags erratically about. At this point, you’re totally in control, and you have a feeling that submitting him to any more attention would surely make him empty his balls. Now… how to end this...", parse);
		Text.Flush();
		
		var mess = false;
		
		//[Swallow][Facial][Reverse]
		var options = new Array();
		options.push({ nameStr : "Swallow",
			func : function() {
				Text.Clear();
				if(finger) {
					Text.Add("You line your finger up and - in a single, smooth motion - you push it inside of Cale’s used tailhole to the knuckle, twisting as you do so in order to better grind against his prostate.", parse);
					Text.NL();
				}
				Text.Add("Your hand leaves the wolf’s balls alone, fingers curling into a ring behind his knot so strong that you’re practically pinching him, sealing his cumvein closed good and tight. You open your mouth and gulp down his cock, letting it slide down your throat until you can kiss the bulging mass of his bulb, which you do, wetly slurping it with your lips. You can feel it virtually explode, a strangled, gasping moan erupting from Cale’s lips as he goes slack; only your squeezing digits around his dick keep him from falling over.", parse);
				Text.NL();
				parse["finger"] = finger ? ", now removed from his ass" : "";
				Text.Add("Once he’s managed to get a more stable stance, you start to glide your head back until only his glans remains sealed between your lips. With your other hand[finger], you curl your fingers into a firm ring around his dick and begin sliding it up and down his length. As your hand moves toward you, you squeeze down; as it slides back, you release, almost as if you were milking him.", parse);
				Text.NL();
				Text.Add("Cale wriggles and whimpers, soft barks of pleasure escaping his lips as he thrashes around. Eventually, the pressure building behind his knot is so great that you doubt you can hold him back any longer - and you release him, holding on with both hands to keep his dick from escaping your mouth. Thick strands of hot, salty wolf-spunk gush into your maw, gurgling down into your belly as you gulp with all your might, audibly slurping and sucking until you have swallowed every last drop the now-spent wolf has to give you.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("You lick your lips, snatching up a few lingering strands that leaked out despite your best efforts.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("You press your lips together, doing your best to stifle a burp from your protesting belly.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("A last strand of semen oozes sluggishly from Cale’s cock, prompting you to swipe it up with a finger that you then make a show of sucking clean.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("Grinning contentedly, you praise Cale on being so tasty.", parse);
				}, 1.0, function() { return true; });
				
				scenes.Get();
				
				Text.Add("<i>“Ugh. I-I think I need to rest a bit.”</i> Cale slides down the log, sitting on the ground, completely drained. <i>“Damn, [playername]. My balls hurt!,”</i> he growls, gently fondling his abused orbs. <i>“I don’t think I’ve ever been dry before today. How do you even do that?”</i>", parse);
				Text.NL();
				if(player.sexlevel <= 2)
					Text.Add("You simply shrug, explaining you merely did what came to you naturally.", parse);
				else if(player.sexlevel <= 4)
					Text.Add("Grinning, you confess that this is far from your first rodeo; you’ve picked up quite a few tricks, and it looks like he’s happy about that.", parse);
				else
					Text.Add("A smug smirk adorns your features as you boast that with your level of expertise in the carnal arts, you could probably torture someone with pure ecstasy... wouldn’t he agree, hmm?", parse);
				Text.NL();
				Text.Add("<i>“I think I’m going to stick here for a while… yeah… maybe take a nap.”</i> He opens his maw wide for a drawn-out yawn. <i>“'Scuse me, [playername].”</i>", parse);
				Text.NL();
				Text.Add("That’s Cale alright; he really needs to work on his stamina. Seeing no reason to disrupt him from his nap, you get up and start to gather your things, slipping back into your [armor]. By the time you’re finished dressing up again, the wolf-morph is out like a snuffed candle. You can’t resist a grin and gently petting him between the ears before you wander off, leaving him to his sleep.", parse);
				Text.NL();
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Gulp down his load."
		});
		options.push({ nameStr : "Facial",
			func : function() {
				Text.Clear();
				Text.Add("You give the wolf’s shaft a final round of polishing before releasing it from your hungry lips, grasping it in both hands. Pointing his cumslit right at your open mouth, you enthusiastically jerk him off, looking up into his eyes.", parse);
				Text.NL();
				Text.Add("<i>“Mmm, keep going... just like that,”</i> Cale pants, his cock twitching erratically in your hands. <i>“It’s gonna be a big one - don’t say I didn’t warn you!”</i> Grinning, you tell him that you expect no less from a big, bad wolf like him. You can hardly wait to taste his fertile seed, to have him splash it all over your body and cover you in his jizz.", parse);
				Text.NL();
				parse["breast"] = player.FirstBreastRow().Size() > 3 ? Text.Parse(", between your [breasts]", parse) : "";
				Text.Add("Egged on by your sultry, encouraging whispers, it’s not long before the wolf lets out a howl, his pent-up reserve of semen rushing from his sloshing balls and through his swelling knot. The first volley hits you squarely on your [tongue], a thick serving of wolf-spunk for your starving taste buds. The following shots stray to your [face], your [hair] and down your front[breast].", parse);
				Text.NL();
				Text.Add("Hobbling slightly, the wolf-morph leans down and scratch you behind your [ears], commending you for a job well done. <i>“Damn, you look a right mess now, [playername],”</i> Cale grins at you. <i>“How do you like the new coat of paint I gave you? You look just <b>lovely</b> in white.”</i>", parse);
				Text.NL();
				
				mess = true;
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Take a shower of cum from the wolf."
		});
		if(finger) {
			options.push({ nameStr : "Reverse",
				func : function() {
					Text.Clear();
					Text.Add("With drops of his pre still lingering on your [tongue], you pull off his cock, rising in one smooth motion to give the wolf a big, fat kiss. He sputters, losing his balance in a vain effort to get away from you, which makes pushing him on his back all the more easy. A sharp shove and the confused Cale is prone, ass propped up in the air by the [log]. He gasps as you shove your fingers back into his [cAnusDesc], spreading him wide.", parse);
					Text.NL();
					if(virgin)
						Text.Add("<i>“N-no,”</i> he pants, deep down realizing what you are building up toward. Regardless, he makes no move to stop you, too caught up with pleasure to offer more than a token resistance.", parse);
					else if(cale.Slut() >= 60)
						Text.Add("<i>“Ah yeah, keep it up, [playername]! Make me cum all over myself!”</i> he pants, your domination arousing the slutty wolf beyond measure. He even willingly pulls his cheeks apart, urging you to do him harder. Grinning, you add your remaining fingers, his pliant, well-trained butt able to easily take you.", parse);
					else
						Text.Add("<i>“Ngh… caught me by surprise there!”</i> he pants, shuddering as you simultaneously jerk him off and finger him.", parse);
					Text.NL();
					Text.Add("Pushing your fingers up to the knuckle and twisting, it’s an easy feat to find the wolf’s sensitive prostate, and you set to rubbing against it insistently. Cale squirms and moans, his cock throbbing erratically. Smirking, you ease up on your handjob, giving his knot a squeeze before grabbing his member right below the tip, aiming it straight at his face. You are going to get him off with only his ass.", parse);
					Text.NL();
					parse["fingering"] = cale.Slut() >= 60 ? "fisting" : "fingering";
					Text.Add("The wolf’s expression is a delightful mixture of shame and lust. He just whimpers: <i>“P-please,”</i> but the exact meaning of his words is lost in the heat of the moment. Not that you are about to stop at this point. Funneling all your effort into [fingering] Cale, you go to town on his ass.", parse);
					Text.NL();
					Text.Add("<i>“Fuuuck!”</i> he groans as you mash his prostate, trying your best to milk him for cum. Trying and succeeding, the wolf explodes in an impressive cascade of thick seed, spraying in almost opaque white strands across his body. Your aim is true, and the brunt of Cale’s load hits him right in the face, splattering all over his tongue and hair. Finally, his climax abates, and he goes limp in your hands, his swollen knot twitching uselessly. Grinning, you pull your fingers out of his butt, asking if he liked it.", parse);
					Text.Add("<i>“Fuuuck!”</i> he groans as you mash his prostate, trying your best to milk him for cum. Trying and succeeding, as the wolf explodes in an impressive cascade of thick seed, spraying in almost opaque white strands across his body. Your aim is true, and the brunt of Cale’s load hits him right in the face, splattering all over his tongue and hair. Finally, his climax abates, and he goes limp in your hands, his swollen knot twitching uselessly. Grinning, you pull your fingers out of his butt, asking if he liked it.", parse);
					Text.NL();
					if(cale.Slut() < 30)
						Text.Add("The wolf is too spent to do anything but whimper, drained of all energy. You take that as a yes.", parse);
					else
						Text.Add("<i>“That was great!”</i> the wolf pants, totally spent.", parse);
					Text.NL();
					
					mess = true;
					player.AddLustFraction(0.5);
					
					var max = virgin ? 25 : cale.flags["Met2"] >= Cale.Met2.Goop ? 100 : 50;
					cale.slut.IncreaseStat(max, 1);
					
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Complete your humiliation of him by turning him on his back and making him eat his own seed."
			});
		}
		Gui.SetButtonsFromList(options, false, null);
		
		Gui.Callstack.push(function() {
			parse["mess"] = mess ? " somehow manage to" : "";
			Text.Add("You[mess] clean yourselves up, restoring your clothes and gear. ", parse);
			if(outside)
				Text.Add("Cale stretches a bit before returning to his seat on the log, thanking you for helping him relieve some tension.", parse);
			else
				Text.Add("Before you leave the tent, you cuddle a bit with the big, fluffy wolf.", parse);
			Text.Flush();
			
			cale.relation.IncreaseStat(100, 2);
			world.TimeStep({hour : 1});
			
			Gui.NextPrompt();
		});
	});
}


Scenes.Cale.SexGetTrickBJ = function(outside) {
	var virgin = cale.Butt().virgin;
	
	var parse = {
		
	};
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Text.Clear();
	Text.Add("<i>“Sure, I don’t mind giving a lady some head,”</i> Cale grins. <i>“Drop ‘em and spread ‘em!”</i>", parse);
	Text.NL();
	if(virgin) {
		Text.Add("<i>“Just… keep [thatThose] cock[s] out of my face, okay? I’m not gay,”</i> he adds. Heh, you’ll see if he sings the same tune when you’re done with him.", parse);
		Text.NL();
		
		if(cale.flags["trickBJ"] == 0)
			cale.relation.DecreaseStat(0, 5);
		else
			cale.relation.DecreaseStat(0, 1);
		player.subDom.IncreaseStat(40, 1);
	}
	
	Scenes.Cale.SexGetBJSneakyEntry(outside, true);
}


Scenes.Cale.SexGetBJ = function(outside) {
	var parse = {
		
	};
	
	Text.Clear();
	if(cale.Butt().virgin) {
		if(player.FirstVag()) {
			Text.Add("<i>“I’m not into cocks, but if you want to get eaten out, I’m game.”</i> The wolf licks his lips, throwing you a quick grin.", parse);
			
			if(cale.flags["trickBJ"] != 0) {
				Text.NL();
				Text.Add("<i>“And no funny business like before, okay?”</i> There is a slight crack of uncertainty in Cale’s usually macho facade, but at least he seems willing to play with your female parts.", parse);
			}
			Text.Flush();
			
			//[Eat out][Trick]
			var options = new Array();
			options.push({ nameStr : "Eat out",
				func : function() {
					Text.Clear();
					Text.Add("<i>“That’s my girl,”</i> Cale grins, his eyes shining brightly at the prospect of a nice meal.", parse);
					Text.NL();
					
					Scenes.Cale.SexGetEatenEntrypoint(outside);
				}, enabled : true,
				tooltip : "Well, alright. Tell him you’ve changed your mind."
			});
			options.push({ nameStr : "Trick",
				func : function() {
					Text.Clear();
					Text.Add("Sure… you might start out that way, but you have some other intentions for the wolf’s mouth. You nod amiably, telling him that you’ve changed your mind.", parse);
					Text.NL();
					Text.Add("<i>“That’s my girl,”</i> Cale grins, his eyes shining brightly at the prospect of a nice meal. He is about to get a little more than he bargained for.", parse);
					Text.NL();
					
					if(cale.flags["trickBJ"] == 0)
						cale.relation.DecreaseStat(0, 5);
					else
						cale.relation.DecreaseStat(0, 1);
					player.subDom.IncreaseStat(40, 1);
					
					Scenes.Cale.SexGetBJSneakyEntry(outside, true);
				}, enabled : true,
				tooltip : "You are getting that blowjob, the wolf just needs a bit more enticing first."
			});
			Gui.SetButtonsFromList(options, false, null);
		}
		else {
			Text.Add("<i>“No offense, but this wolf doesn’t swing that way, ya know?”</i> Cale waves off your suggestive remark. <i>“Now if <b>you</b> want to suck <b>my</b> cock, that’d be a different story.”</i> The cocksure wolf grins, winking at you.", parse);
			Text.Flush();
			
			Scenes.Cale.Prompt();
		}
	}
	else if(cale.Slut() < 30 && outside) {
		Text.Add("<i>“No way,”</i> he shakes his head firmly. <i>“I’m not about to get on my knees and blow you out here.”</i> The wolf looks around himself nervously to see if anyone heard him.", parse);
		Text.Flush();
		
		Scenes.Cale.Prompt();
	}
	else {
		parse["s"] = player.NumCocks() > 1 ? "s" : "";
		if(cale.sex.gBlow == 0)
			Text.Add("The wolf starts to protest when you suggest he polish your cock[s] a bit, but he goes quiet when you remind him what the two of you have done before. <i>“Alright, alright! No need to bring up the past. S’pose blowing you is better than taking it up the ass.”</i>", parse);
		else if(cale.Slut() < 30)
			Text.Add("<i>“Eh… alright, I guess,”</i> the wolf nods uncertainly, throwing a quick glance at your bulge. <i>“Think you can return the favor later?”</i> he adds hopefully, still not too keen on being on the receiving end. Well, nothing that a little training can’t fix.", parse);
		else
			Text.Add("<i>“Mmm, I’m always up for a tasty treat, and perhaps we can put your cock[s] to some other use after, hmm?”</i> the wolf grins, slapping his butt for good measure.", parse);
		Text.Flush();
		
		Scenes.Cale.SexGetBJSneakyEntry(outside);
	}
}

Scenes.Cale.SexGetBJSneakyEntry = function(outside, sneaky) {
	var p1cock = player.BiggestCock();
	var virgin = cale.Butt().virgin;
	
	var parse = {
		playername     : player.name,
		stutterName    : player.name[0] + "-" + player.name
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	var sneakyFirst = (cale.flags["trickBJ"] == 0);
	
	Text.Add("<i>“Now, let's get started on you, shall we?”</i> Quickly shrugging out of your [botarmor], you pull out your [cocks]. ", parse);
	
	if(sneaky) {
		cale.flags["trickBJ"]++;
		
		parse["legs"] = player.LowerBodyType() != LowerBodyType.Single ? ", spreading your legs," : "";
		parse["b"] = player.HasBalls() ? Text.Parse(" and [balls]", parse) : "";
		Text.Add("Cale gulps at the sight of your slick shaft[s], but is still enticed with the promise of your pussy. Feeling that he needs some encouragement, you lie down[legs] and shift your cock[s][b] aside to reveal your [vag].", parse);
		Text.NL();
		Text.Add("Taking your invitation, the wolf greedily digs into your folds, lapping at your labia with his long, flexible tongue. You sigh in pleasure, leaning back. ", parse);
		if(player.HasBalls())
			Text.Add("Your new position requires that you prop yourself up, however, which means that your now unattended sack flop down on Cale’s nose. He looks up at you, a flash of irritation clear on his obscured features, but you just whistle innocently. ", parse);
		parse["b"] = player.HasBalls() ? ", inadvertently filling his nose with your scent as you rub your sack against it" : "";
		Text.Add("Deciding to take a more active part, you start grinding against you lover’s snout[b].", parse);
		Text.NL();
		
		Sex.Cunnilingus(cale, player);
		cale.Fuck(null, 1);
		player.Fuck(null, 1);
		
		Text.Add("As you lean back even further, you are going to need both arms to prop yourself up. Stretching languidly, you put your weight on your elbows, smiling faintly when you see the wolf wince as your [cocks] flops onto his face. You let him keep up his lapping for a while, chuckling internally as he unsuccessfully tries to ignore your erection[s] rubbing his forehead.", parse);
		Text.NL();
		Text.Add("<i>“How about we change positions?”</i> Cale suggests, surfacing for air. The wolf tries to avoid looking directly at your stiff member[s] - a feat that is hard to pull off as [itThey] [isAre] hovering a mere inch from his face. You nod, appearing to humor him. You instruct the soon-to-be-cocksucker to roll over on his back, and shuffle around so your bared crotch is hovering over his face. Cale seems happy as he doesn’t have to worry about your [cocks] from this angle. How naive.", parse);
		Text.NL();
		Text.Add("Taking the initiative, you sink down on the wolf’s raised snout, letting his long tongue drill into your cooch. He’s doing a very good job of it - almost making you lose your flow - but your [cocks] is quick to remind you of your plan. You let him settle into it, luring him in with a false sense of security - not that you don’t enjoy yourself - before setting your plan into motion.", parse);
		Text.NL();
		Text.Add("Moaning encouragingly, you start grinding your [hips] erratically, rubbing your cunt on the canine’s face. Spurred on by your enthusiasm, Cale redoubles his lapping, raking his flexible organ over and inside your folds. Bit by bit, your movements grow more inconsistent, your swaying becoming wider. Pretty soon, the wolf only has to hold out his tongue as you eagerly ride him, rubbing the entire length of your [vag] on his face.", parse);
		Text.NL();
		parse["b"] = player.HasBalls() ? " balls and" : "";
		Text.Add("You start hearing muffled protests from Cale as you turn your grinding into long strokes, rubbing not only your cunt but also your[b] [cocks] against him. Every time he grows too agitated, you let him have some more of your cooch before returning to grinding your shaft[s] on his mouth. Before long, he stops complaining altogether, and even starts to actively lick the undercarriage of your cock[s] when you present him with [itThem].", parse);
		Text.NL();
		Text.Add("Purring, you tell the wolf what a good job he’s doing, your words emphasized by twitches in your [cocks]. Pushing down, you give Cale something to do other than worry about his own sexuality, pretty much impaling yourself on his snout. Once he’s sufficiently mollified, you turn back to your grinding, slowly shifting the focus from your pussy to your erect shaft[s]. The wolf obediently lathers you up, doing just about as good a job with his tongue on his new target as he did on your female parts.", parse);
		Text.NL();
		Text.Add("As you grind against him, Cale licks you from root to tip, only realizing what he’s doing when you pull back, the [cockTip] of[oneof] your [cocks] poised in front of his open mouth, a splatter of pre dripping onto his extended tongue.", parse);
		Text.NL();
		if(virgin) {
			if(sneakyFirst) {
				Text.Add("<i>“[stutterName], what- when?”</i> the wolf stutters, struggling to regain control of the situation. Smiling down on him hypnotically, you tell him that he was just about to suck your cock, like you asked him to. <i>“W-what? No! I’m not gay!”</i> Cale struggles, trying to avoid contact with the offending shaft bobbing in front of his mouth.", parse);
			}
			else {
				Text.Add("<i>“We said no funny business!”</i> the wolf whines desperately, struggling to regain control of the situation. <i>“I told you, I’m not gay, I’m not!”</i> he protests loudly, his eyes transfixed on the bobbing [cockTip] of your [cock]. Who said he was? You just need him to suck your cock, that doesn’t make him gay, does it? He did it before, so…", parse);
			}
			Text.NL();
			parse["len"] = p1cock.length.Get() >= 20 ? " and down his throat" : "";
			Text.Add("<i>“Now listen here-”</i> he says hurriedly, trying to argue his way out of the situation. Not his brightest move, as it leaves him wide open for you to thrust into his mouth[len]. The wolf’s eyes widen incredulously as you start feeding him inch after inch of throbbing flesh, rubbing your pre onto his diligent tongue.", parse);
		}
		else {
			Text.Add("<i>“Why you naughty...”</i> the wolf quips, grinning at your trickery. <i>“You just had to ask, you know.”</i> You chuckle at how eager he is to please, but he’d best get to it before you grow bored and flip him over.", parse);
			Text.NL();
			if(cale.Slut() < 30)
				Text.Add("<i>“Okay, okay, no need to get your panties in a bunch,”</i> he hurriedly agrees.", parse);
			else
				Text.Add("<i>“Who says that isn’t exactly what I want?”</i> he retorts glibly. As fun as that would be...", parse);
		}
		Text.NL();
		Text.Add("<i>“Suck,”</i> you repeat your previous command more forcefully, pinning him down. His will is faltering, and you can feel his tongue moving around uncertainly, inadvertently licking your [cock]. To give him that extra push over the edge, your hand trails down his furry stomach to his stiff, crimson erection, insinuating that if he’s a good boy, maybe you’ll return the favor.", parse);
		Text.NL();
		if(virgin)
			Text.Add("Cale lets out a muffled sigh as he capitulates, unable to resist the urges of his body. The wolf closes his eyes in defeat as he allows you to have your way with him.", parse);
		else
			Text.Add("If he needed any more motivation, that seems to have done it. No longer putting up even a semblance of resistance, he heartily starts sucking.", parse);
	}
	else {
		parse["slut"] = cale.Slut() < 30 ? " nervously" : "";
		Text.Add("<i>“Woah, pent up, aren’t we,”</i> Cale chuckles[slut], getting down on his knees and prodding the offered dick[s] experimentally. Seeing [itThem] twitch in response, he grows bolder, grabbing[oneof] your [cocks] in his paw. A moan slips out of your lips as the wolf starts jerking you off. The soft skin on his palms feels really good on your sensitive flesh, but the main course has yet to come.", parse);
		Text.NL();
		Text.Add("Eager to get going, you place a [hand] on his shoulder, slowly pushing the wolf down on his back, erratically rubbing your [cock] against his tight grip. ", parse);
		if(cale.Slut() < 30)
			Text.Add("<i>“Alright,”</i> Cale gulps, giving your shaft a tentative lick, sending a shiver up your spine. You let him take his time, stretching languidly while the wolf drags his tongue along the underside of your cock, lathering you up.", parse);
		else
			Text.Add("<i>“Give me a taste of that delicious cock,”</i> Cale breathes, putting a paw on your butt and pulling you in, guiding you toward his open mouth. A drop of your pre lands on his outstretched tongue, quickly lapped up by the slutty wolf.", parse);
		Text.NL();
		Text.Add("After teasing you some more, the wolf finally gets to the meat of it and wraps his lips around your [cock], taking you into his mouth.", parse);
	}
	Text.NL();
	
	Sex.Blowjob(cale, player);
	cale.FuckOral(cale.Mouth(), player.FirstCock(), 2);
	player.Fuck(player.FirstCock(), 2);
	
	parse["macho"] = cale.Slut() < 30 ? " macho" : "";
	Text.Add("You let Cale set the pace, grinning as the[macho] wolf goes down on you. Unable to help yourself, you taunt and tease him, trying to use some of his own corny lines and throw them right back at him. ", parse);
	if(cale.Slut() < 30)
		Text.Add("He looks a bit shamefaced as you feed him his own bad jokes, but can’t help but to see the irony in the situation.", parse);
	else
		Text.Add("Humoring you, the wolf pulls off your cock for a moment to commend you on your good taste. Shaking your head in defeat, you just gesture for him to get back to business.", parse);
	Text.NL();
	parse["len"] = p1cock.length.Get() >= 20 ? " until you are pressing against the entrance to his throat" : "";
	Text.Add("Grasping your [cock] by its base, Cale gets back to sucking you, his bobbing mouth taking more and more of you each stroke[len]. ", parse);
	if(p1cock.length.Get() >= 20) {
		Text.Add("Figuring the wolf could use some help, you start rocking your hips slowly, building up a rhythm intended to plunge your cock even further into your slut. You’ve already gotten the taste of his skilled tongue; you’re not going to be satisfied until you’ve buried every inch of your [cock] into his tight throat.", parse);
		Text.NL();
		Text.Add("Progress is slow, but each thrust pushes a little farther down his esophagus, triggering a delightful gag reflex. You let him surface for air now and then - a few gasping breaths before you plunge your cock back in, plugging his mouth again. Finally, much to the surprise of the wolf, your entire [cock] is firmly lodged down his throat, his muzzle pressed against your crotch.", parse);
	}
	else {
		Text.Add("You inadvertently moan as his tongue laps at your sensitive glans, greedily licking up your pre. The wolf’s mouth is tight as a vice around your man-meat, his lips caressing every vein on your shaft.", parse);
	}
	Text.NL();
	Text.Add("You caress the back of Cale’s head, twirling his fur with your fingers as he sucks on your [cock]. Your touch is light, yet a constant reminder of just who is in charge here.", parse);
	Text.NL();
	Text.Add("Steadily, you can feel your orgasm building as your wolf-slut really gets into it. You briefly consider warning him about his approaching protein addition, but it’ll be much more fun if he finds out about it for himself.", parse);
	Text.NL();
	if(cale.Slut() >= 60) {
		Text.Add("Cale seems to want nothing else than to milk you, however, as you suddenly feel a probing finger rubbing against your taint, searching for your [anus]. As a veteran of anal sex - though usually as the one on the receiving end - the wolf knows exactly how to drive you crazy, his thick digit quickly penetrating your colon and pressing against your prostate. If you weren’t close to cumming already, this sure as hell would do it.", parse);
		Text.NL();
		
		player.AddLustFraction(0.3);
	}
	Text.Add("Placing a firm hand on the back of Cale’s head, you take charge - quickly thrusting into his mouth as your orgasm grows steadily closer. Crying out loudly in a voice that probably alerted everyone in camp to your coitus, you unload directly down the wolf’s throat, shooting wad after wad of thick cum splattering into his stomach.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum();
	
	if(cum > 6) {
		Text.Add("Before you’re even halfway done, the wolf is completely filled with your cum - mouth, throat and stomach. His eyes widen as he pats your [hips] urgently, pushing you off him before his belly inflates even further. Taking mercy on him, you pull out and let the rest of your load splash all over his face and body. When you are done, Cale looks like he is more cum than wolf, thoroughly painted white in your spunk. ", parse);
	}
	else if(cum > 3) {
		Text.Add("Cale gets more than he bargained for as your excessive load is enough to bloat the wolf’s belly to levels resembling pregnancy. When you finally pull out, the wolf is filled to the brim with cum, a slow trickle dribbling out his mouth. ", parse);
	}
	else {
		Text.Add("Whether due to his horniness or from sheer surprise, Cale swallows your entire load, his eyes widening slightly as he feels the thick cream pouring down his throat. ", parse);
	}
	
	if(sneaky) {
		Text.Add("He looks accusingly at you while wiping the semen from his lips.", parse);
		Text.NL();
		if(virgin) {
			Text.Add("<i>“What the fuck?!”</i> Cale coughs and sputters, growling. <i>“I told you to keep the cock[s] out of my face and you didn’t listen!”</i>", parse);
			Text.NL();
			Text.Add("Come now, a trickster like him should be able to appreciate your little prank. Besides, if he saw himself five minutes ago, he would have a hard time arguing that he wasn’t enjoying himself.", parse);
			Text.NL();
			Text.Add("<i>“N-no! I told you I’m not into cocks, okay?”</i> he mutters, his eyes trying to avoid the particular cock he was very much into just moments ago.", parse);
			Text.NL();
			Text.Add("You ask him if it was really that bad.", parse);
			Text.NL();
			Text.Add("<i>“Well...”</i> he trails off thoughtfully. <i>“Don’t do it again, I guess? Or at least return the favor some time, okay?”</i>", parse);
		}
		
		if(cale.Slut() < 30) {
			Text.Add("<i>“What the hell, [playername]?!”</i> Cale coughs and sputters, trying to clear his throat. <i>“At least warn me before you do that.”</i>", parse);
		}
		else if(cale.Slut() < 60) {
			Text.Add("Cale licks his lips, swallowing the last of your load. <i>“Y’know. If you wanted me to blow you, you could just have asked instead of tricking me into switching from your tasty cooch to your man-meat.”</i>", parse);
			Text.NL();
			Text.Add("True, but doing things this way is much more fun, you reply with a grin.", parse);
		}
		else {
			Text.Add("<i>“Hmm, tasty,”</i> he remarks, licking his lips and sneaking a last flick of the tongue on your [cockTip]. <i>“If you’re hurting for attention on both ends, I’m happy to oblige. I’d have paid more attention to your [cocks] from the get-go if you had told me you wanted me to play with [itThem]. Not that I mind a surprise now and then.”</i>", parse);
			Text.NL();
			Text.Add("It was a sporadic decision, really, you quip back.", parse);
			Text.NL();
			Text.Add("<i>“Sporadic my ass, you planned this!”</i> he accuses you jokingly. <i>“Well, in either case, I enjoyed it. So thanks for both the taco and the sausage[s]. A wolf’s gotta watch his diet,”</i> he chuckles.", parse);
		}
	}
	else {
		if(cale.Slut() < 30)
			Text.Add("<i>“This is gonna take a while to get used to,”</i> Cale grumbles, wiping some stray cum off his chin.", parse);
		else if(cale.Slut() < 60)
			Text.Add("<i>“This isn’t so bad, you know,”</i> Cale muses, licking his lips thoughtfully. <i>“I’ve never sucked a cock before you showed up. Guess you learn something new every day, yeah?”</i>", parse);
		else
			Text.Add("<i>“Your cum tastes so good,”</i> Cale purrs as he licks his lips hungrily. <i>“I just wish you could have pounded and shot your load in my ass instead. You are up for some of that later, right? Sucking you off has gotten me quite horny.”</i> As if to prove his point, his stiff erection bobs in agreement.", parse);
	}
	Text.NL();
	if(outside) {
		Text.Add("You both clean yourselves up, replacing your gear and clothing. A few of the camp denizens are looking at Cale in a funny way, though no one approaches you.", parse);
		Text.NL();
		if(cale.Slut() < 30)
			Text.Add("The poor wolf tries to avoid their curious stares the best he can, but can’t hide the burning blush on his cheeks.", parse);
		else
			Text.Add("The wolf looks relatively blasé about the whole thing. Everyone already knows he’s your slut, what’s another blowjob?", parse);
	}
	else
		Text.Add("You both clean yourselves up, replacing your gear and clothing before heading back into camp. If anyone heard you crying out when you shot your load down the wolf’s throat, they don’t bring it up.", parse);
	Text.Flush();
	
	cale.relation.IncreaseStat(100, 2);
	cale.slut.IncreaseStat(25, 1);
	
	world.TimeStep({minute : 30});
	
	Gui.NextPrompt();
}


Scenes.Cale.SexGetEatenEntrypoint = function(outside) {
	var virgin = cale.Butt().virgin;
	var biggestCock = player.BiggestCock();
	
	var parse = {
		playername     : player.name,
		stutterName    : player.name[0] + "-" + player.name,
		biggest        : player.NumCocks() > 1 ? " biggest" : ""
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	if(player.FirstCock() && virgin) {
		Text.Add("<i>“Just… keep [thatThose] cock[s] out of my face, okay? I’m not gay,”</i> he adds hurriedly. You roll your eyes.", parse);
		Text.NL();
	}
	parse["legs"] = player.LowerBodyType() != LowerBodyType.Single ? " and spreading your legs" : "";
	Text.Add("Swaying your [hips] seductively, you twirl around, showing him the goods. The wolf-morph all but jumps you, quickly tearing off your [botarmor] and exposing your wet netherlips. You shy back for a brief second as he flashes his sharp teeth in a wide predatory smile. His long canine tongue is lolling hungrily, eager to dig in. The wolf looks like he could eat more than your pussy, given the chance. Still, you try to trust him and relax, reclining on your back[legs].", parse);
	if(player.FirstCock())
		Text.Add(" You pull your [cocks] out of the way, giving him full access to your crotch.", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“Just lie back and relax, and let this big, bad wolf eat you up whole~”</i> Cale quips as he hovers over your spread labia, hot saliva dripping from his fangs on your [skin].", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Ah, my favorite snack, juicy pussy,”</i> Cale teases, caressing your [thigh] as he eyes his meal.", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Sure you don’t want a blowjob too? I don’t mind, and your little Wolfie wants some meat~”</i> Cale coos, eyeing your equipment longingly. Relenting, you let him give your shaft[s] a few long licks, sating his craving for cock before he goes back to his original target.", parse);
		Text.NL();
		
		player.AddLustFraction(0.3);
	}, 1.0, function() { return player.FirstCock(); });
	
	scenes.Get();
	
	Text.Add("Wasting no further time, the wolf digs in, burying his snout in your crotch. You gasp as his flexible tongue forces its way inside your [vag], lapping up your juices greedily. <i>“Wanna know why my tongue is so big? It is to...”</i> Cale murmurs, the rest of his pun muffled by your muff. You squirm as the vibrations spread into your nethers, the quaking setting off cascading spikes of pleasure racing up your spine.", parse);
	Text.NL();
	
	Sex.Cunnilingus(cale, player);
	cale.Fuck(null, 2);
	player.Fuck(null, 2);
	
	Text.Add("Letting him handle the reins, you close your eyes, basking in the ecstasy roused by the wolf’s experienced tongue. Rosalin has certainly given him plenty opportunity to practice at this. ", parse);
	if(player.FirstCock()) {
		Text.Add("Cale’s ministrations haven’t gone unnoticed by your [cocks] - roused by the intense feelings of his flexible organ eating out your cunt, the shaft[s] stand[notS] erect, bobbing proudly.", parse);
		if(cale.Slut() >= 30) {
			Text.Add(" Not wanting to let [itThem] feel left out, the wolf wraps his paw around your[biggest] [cock], stroking it sensuously.", parse);
		}
	}
	else {
		parse["past"] = cale.flags["rosPast"] != 0 ? "turning into" : "him being";
		Text.Add("Then again, perhaps [past] a wolf gives him some handy natural instincts.", parse);
	}
	Text.NL();
	
	var clitcock = player.FirstVag().clitCock;
	var clitlen  = player.FirstVag().clit.Get();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("As much as you enjoy his current lapping, there is a dark lust rising in you, demanding something more. Finally, you can’t take it anymore and struggle upright, wrestling the surprised Cale to the ground.", parse);
		Text.NL();
		parse["legs"] = player.LowerBodyType() == LowerBodyType.Single ? " wrapping your lower body around him and" : "";
		Text.Add("<i>“Kinky. Hungry for some wolf cock perhaps?”</i> he grins hopefully, wiping your femcum from his lips. Oh no, he still has work left to do, you retort,[legs] straddling his face. The wolf quickly gets the idea, digging right back in from his new, more submissive position. Your need for domination still burning brightly, you grind your crotch against his snout, riding the wolf.", parse);
		Text.NL();
	}, 1.0, function() { return player.SubDom() >= 50; });
	scenes.AddEnc(function() {
		parse["clit1"] = clitlen > 4 ? " the base of" : "";
		parse["clit2"] = clitlen > 4 ? " engorged" : "";
		Text.Add("<i>“And what do we have here, hmm?”</i> Cale purrs, giving your [clit] a flick with the tip of his tongue. A shock runs up your spine, triggered by the sudden stimuli, racking your brains as you try to hold in a gasp. <i>“Seems like I found a tasty spot, I’ll have to explore further.”</i> Spurred by your reaction, the wolf focuses his attention on[clit1] your[clit2] clit, sending stars across your field of vision every times his tongue rakes your sensitive organ.", parse);
		Text.NL();
		Text.Add("<i>“Good reaction,”</i> the wolf chuckles. He goes back to pleasuring your folds, but often swaps back to your [clit] to tease you further, keeping you dancing on a fine edge.", parse);
		Text.NL();
		
		player.AddLustFraction(0.3);
	}, 1.0, function() { return (cale.Slut() >= 30) || clitcock == null; });
	scenes.AddEnc(function() {
		parse["b"] = player.HasBalls() ? Text.Parse(" and [balls]", parse) : "";
		Text.Add("Despite Cale’s enthusiastic lapping, you feel him stray sometimes. The wolf sneaks in a few licks and kisses on your [cocks][b]. You flick one of his triangular ears, chastising him for not focusing on his job.", parse);
		Text.NL();
		parse["c"] = (player.NumCocks() > 1 || player.FirstCock().Size() > 75) ? " so much" : "";
		Text.Add("<i>“Wolves are carnivores, you can’t expect me to hold myself back with[c] meat on display,”</i> he chuckles, sneaking a lick on the [cockTip] of[oneof] your [cock].", parse);
		Text.NL();
		Text.Add("Well, if he’s a good boy and gets you off, you might consider throwing him a bone later.", parse);
		Text.NL();
		Text.Add("<i>“Deal!”</i> he exclaims, digging his way back into your muff.", parse);
		Text.NL();
	}, 1.0, function() { return cale.Slut() >= 60 && player.FirstCock(); });
	
	scenes.Get();
	
	Text.Add("Pretty soon, it is impossible to hold your moans in. Reduced to a panting heap by Cale’s skilled tongue, you try to hold out as long as you can, but to no avail. The rough texture of his flexible muscle against your folds just feels too good, not to mention the possibilities his impressive reach offers him.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum();
	
	Text.Add("It isn’t long before the wolf has pushed you to orgasm, forcing a lustful cry out of you as your dam breaks and you buck your [hips], spraying his muzzle with your feminine juices. You bite your lip in an effort to not rouse the whole camp with your cries, one hand inadvertently straying to twist one of your [nips].", parse);
	if(player.FirstCock()) {
		parse["isntArent"] = player.NumCocks() > 1 ? "aren't" : "isn't";
		parse["cum1"] = cum > 6 ? "unleashing on" :
		                cum > 3 ? "splashing" :
		                "spraying";
		parse["cum2"] = cum > 6 ? " massive" :
		                cum > 3 ? " considerable" :
		                "";
		Text.Add(" Your [cocks] [isntArent] far behind, [cum1] the wolf with [itsTheir][cum2] load.", parse);
		Text.NL();
		if(cale.Slut() >= 60)
			Text.Add("<i>“Mm… so tasty,”</i> he sighs as he laps up your cum, reveling in the taste.", parse);
		else if(cale.Slut() >= 30)
			Text.Add("He greedily laps up your sticky offering, looking at you somewhat guiltily.", parse);
		else
			Text.Add("He looks slightly irritated, wiping off the cum from his face, but he isn’t about to let a bit of semen ruin his mood.", parse);
		Text.NL();
	}
	if(outside)
		Text.Add("Cale licks his lips appreciatively, thanking you for the tasty treat before returning to his seat by the campfire.", parse);
	else
		Text.Add("Cale flops down on the bedroll, languidly thanking you for the tasty treat before he slips outside.", parse);
	Text.Add(" You shakily restore your gear, getting ready to return to your journey.", parse);
	Text.Flush();
	
	cale.relation.IncreaseStat(100, 2);
	world.TimeStep({minute : 30});
	
	Gui.NextPrompt();
}


Scenes.Cale.SexFuckHim = function(outside, opts) {
	opts = opts || {};
	
	var cocksInAss = player.CocksThatFit(cale.Butt());
	var p1cock = player.BiggestCock(cocksInAss);
	var virgin = cale.Butt().virgin;
	var knotted = p1cock.knot != 0;
	
	var allCocks = player.AllCocksCopy();
	for(var i = 0; i < allCocks.length; i++) {
		if(allCocks[i] == p1cock) {
			allCocks.remove(i);
			break;
		}
	}
	
	var parse = {
		log            : outside ? "wooden log" : "bedroll",
		playername     : player.name,
		cocks2 : function() { return player.MultiCockDesc(allCocks); },
		stiffening     : p1cock.isStrapon ? "" : " stiffening",
		artificial     : p1cock.isStrapon ? " artificial" : "",
		cAnusDesc      : function() { return cale.Butt().AnalShort(); }
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	parse["virgin"] = virgin ? " virgin" : "";
	if(cale.Slut() >= 60)
		Text.Add("With Cale’s peculiar attributes, there is no need for additional lube. His hole is as ready for you as it’ll ever be. You remove your [botarmor], itching to start pounding the wolf into oblivion.", parse);
	else
		Text.Add("As you fumble with your [botarmor], you fish out a bottle of lube, pouring its contents on Cale’s tight[virgin] hole. He yips as the cool liquid splashes between his cheeks, shivering in anticipation of what's to come. You rub it in with your thumb, probing and teasing his anus.", parse);
	Text.Add(" Once he’s ready, you pull out your[stiffening] [cocks], rubbing [itThem] in the sloppy lubricating mess between the wolf’s butt cheeks. Just to tease him even more, you grasp him by the hips, hotdogging your[artificial] shaft[s] and coating [itsTheir] length in the slippery liquid.", parse);
	Text.NL();
	if(virgin)
		Text.Add("<i>“I’ve changed my mind, I’ve changed my mind!”</i> he yips desperately, trying to scramble away but hindered by his pants wrapping around his knees.", parse);
	else
		Text.Add("<i>“Just take me already!”</i> Cale whines, eager to get some dick. He tries pushing back against you, forcing your cock[s] to rub against his sensitive [cAnusDesc].", parse);
	Text.NL();
	Text.Add("Ignoring the wolf, you grasp[oneof] your [cocks] and press it against his back door. The [cockTip] of your [cock] popping inside him does wonders for shutting him up - unless you count the loud moaning.", parse);
	Text.NL();
	
	Sex.Anal(player, cale);
	cale.FuckAnal(cale.Butt(), player.FirstCock(), 3);
	player.Fuck(player.FirstCock(), virgin ? 10 : 3);
	
	parse["protestingWelcoming"] = cale.Slut() >= 60 ? "welcoming" : "protesting";
	Text.Add("Cale groans as you thrust forward, sinking half of your [cock] inside his [protestingWelcoming] bowels. The wolf’s anal walls wrap themselves tightly around your shaft, almost sucking you inside. ", parse);
	if(virgin) {
		Text.Add("The rogue is panting heavily, apparently at a loss for words over his lost virginity.", parse);
		Text.NL();
		Text.Add("<i>“Do you like it?”</i> you tease him, shifting your [hips] slightly, sending another tremble through the paralyzed wolf.", parse);
		Text.NL();
		Text.Add("<i>“N-no, of course not!”</i> he gasps defiantly, squirming under your gaze. A rather bad plan, considering his current position.", parse);
		Text.NL();
		Text.Add("<i>“I know someone who disagrees with you,”</i> you whisper, reaching down between his furred legs to grasp his rock hard canid member, an erect monument of his confused sexuality. Merely touching it causes it to twitch, sending a splattering of pre onto the ground. Curious at his extreme reaction, you rock your hips slowly, sending another twitch through the crimson member.", parse);
		Text.NL();
		Text.Add("The wolf is <i>definitely</i> enjoying this… but there is so much more you can show him. You tell him that you are going to start moving, and this time he doesn’t even protest, just offering a low whimper in response as he raises his tail to allow you easier access.", parse);
	}
	else {
		Text.Add("He accommodates to your [cock] easily enough, this being far from his first time taking it in the butt.", parse);
		Text.NL();
		if(cale.Slut() >= 60)
			Text.Add("<i>“Fuck me, [playername]!”</i> he begs, pushing his hips back against yours in an attempt to further impale himself on you. Such a well trained little slut.", parse);
		else
			Text.Add("<i>“Ngh… you are so rough,”</i> he pants, his legs trembling as he gets used to the feeling. Oh, this isn’t rough. You haven’t started with rough yet.", parse);
	}
	Text.NL();
	parse["vag"] = player.FirstVag() ? function() { return player.FirstVag().Short(); } : "crotch";
	parse["real"] = p1cock.isStrapon ? Text.Parse("pressure of the toy grinding against your [vag]", parse) : "snug pressure around your dick";
	Text.Add("Starting out slow, you rock your [hips] back and forth, establishing a rhythm. Your [cock] is glistening with moisture as you pull out, leaving only the [cockTip] inside Cale’s hole, making pushing it inside again all that much easier. With each slow, determined thrust, you bury yourself deeper and deeper inside the wolf, sighing in pleasure at the [real].", parse);
	Text.NL();
	if(cale.Slut() >= 60)
		Text.Add("From his moans, you guess that the horny wolf has gone into heat again, but you know just the cure for that condition: a hot, deep dicking, applied roughly and repeatedly.", parse);
	else
		Text.Add("Soon, Cale falters, too overwhelmed by the sensations to offer more futile complaints. No matter how much he tries though, he is unable to stifle his increasingly loud moaning.", parse);
	Text.NL();
	if(allCocks.length > 0) {
		parse["isAre"] = allCocks.length > 1 ? "are" : "is";
		Text.Add("Your remaining [cocks2] [isAre] rubbing snugly between the wolf’s spread cheeks, tickled by the soft fur of his raised tail. Speaking of cocks...", parse);
		Text.NL();
	}
	Text.Add("The wolf pants for breath, letting out a lewd howl as a shudder goes through his entire body, his legs giving out. If he wasn’t already propped up by the convenient [log], he’d probably collapse. Reaching down to confirm your suspicion, you feel Cale’s rigid member twitching, the knot at the base twice his usual size.", parse);
	Text.NL();
	parse["hornyEmbarrassed"] = cale.Slut() >= 40 ? "horny" : "embarrassed";
	Text.Add("<i>“Cumming so soon? But I’ve barely gotten started,”</i> you say teasingly, never skipping a beat in your steady rhythm. Cupping your hand under his still fountaining cock, you gather a [hand]ful of his hot seed, presenting the sticky mess to the [hornyEmbarrassed] wolf.", parse);
	Text.NL();
	if(cale.Slut() >= 60) {
		Text.Add("Without hesitation, the slutty morph sticks out his tongue, lapping up his own seed from your outstretched [hand], cleaning it thoroughly. You egg him on encouragingly, praising him for being such a good bitch. You’ll make sure he gets more cum to drink down before long.", parse);
	}
	else {
		Text.Add("Cale glances around furtively, as if anyone could have missed your shenanigans, before giving it an experimental lick.", parse);
		Text.NL();
		Text.Add("<i>“Ew, gross,”</i> he complains unconvincingly. You roll your eyes at his bad theatrics. He winces as you place your still sticky [hand] on his back, painting his dark fur white.", parse);
	}
	Text.NL();
	Text.Add("The wolf’s long, shaggy fur and fluffy tail provides excellent grasping points for you; not that he is going somewhere anytime soon. Even minutes later, he still looks completely spent from his first orgasm, moaning weakly as you rail him at an increasingly rough pace.", parse);
	if(virgin)
		Text.Add(" After this, there is no way he can dispute that he loves this new form of sex.", parse);
	Text.NL();
	
	var breakpoint = false;
	if(outside) {
		breakpoint = Scenes.Cale.SexFuckingHimOutsideComments(p1cock, opts);
	}
	else {
		Text.Add("It’d be pretty amusing if someone walked in on you now. Fortunately for the wolf, it doesn’t seem like anyone in camp has taken note of you yet.", parse);
		Text.NL();
	}
	
	Gui.Callstack.push(function() {
		Text.Add("Time to decide how you want to finish this.", parse);
		Text.Flush();
		
		parse["log"] = outside ? "log" : "bedroll";
		
		var cum;
		
		//[Doggy][R.Cowgirl]
		var options = new Array();
		options.push({ nameStr : "Doggy",
			func : function() {
				Text.Clear();
				Text.Add("You lean forward, nuzzling the pliant wolf and burying your head in the fluffy fur of his neck. His insides feel <i>so</i> good, you can barely contain your rutting. Cale is mumbling something about you being his alpha, though it’s difficult to make out between his cries of pleasure.", parse);
				Text.NL();
				Text.Add("Damn straight you are. Caught up in the moment, you redouble your efforts, ramming your [cock] into the poor wolf for all you’re worth. You wrap your arms around his chest, playing with his nipples hidden between his fur, and reach down between his spread legs once more. Cale is rock hard, his bobbing cock still leaking a thick trail of cum. He probably isn’t very far from another climax, and neither are you.", parse);
				Text.NL();
				if(player.SubDom() > 25) {
					parse["real"] = p1cock.isStrapon ? "" : " as you unleash your seed into his bowels";
					Text.Add("It is close now, so very close… On pure instinct, you bite down on his shoulder, making the canid howl[real]. Cale’s back arches, as he completely embraces his role as your beta. ", parse);
				}
				else {
					Text.Add("Just a little more… you groan as you feel your orgasm building, increasing your pace to a wild rut. ", parse);
					if(!p1cock.isStrapon)
						Text.Add("You can feel your seed surging, the faucet turned to fully open as you pour your load into your bitch. ", parse);
				}
				if(knotted)
					Text.Add("With one final push forward, you pop your swollen knot inside Cale, making the wolf gasp in surprise. ", parse);
				Text.Add("That serves as the final trigger, as his cock once again throbs in your hand as the two of you cum together.", parse);
				Text.NL();
				
				cum = player.OrgasmCum();
				
				if(p1cock.isStrapon)
					Text.Add("<i>“You, ah, know how to handle that thing pretty well,”</i> Cale pants, still trying to recover from his orgasm.", parse);
				else {
					if(cum > 6) {
						Text.Add("<i>“W-woah! What are you, a minotaur?”</i> Cale whines as your torrential orgasm floods his back door, rapidly expanding his poor tummy. <i>“Look, I’m a guy, I can’t get pregnant, okay?!”</i> Well, not for lack of trying, certainly. ", parse);
						if(knotted)
							Text.Add("Not even your knot can contain the massive amount of cum you are pouring into the wolf, and large splashes of white seed seep out through the tight seal of his colon, having nowhere else to go.", parse);
						else
							Text.Add("Most of your cum ends up on the ground behind you, pouring out in great gouts as you unload.", parse);
					}
					else if(cum > 3) {
						Text.Add("<i>“Damn, that’s more than I shoot - hah - I feel so full,”</i> Cale whimpers as his stomach slowly swells from your massive amount of cum.", parse);
					}
					else {
						Text.Add("<i>“Ah, you just had to cum inside, did you?”</i> Cale whines as he feels your load splatter inside his well-used back door.", parse);
					}
				}
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Keep railing him from behind, you are so close to cumming..."
		});
		options.push({ nameStr : "R.Cowgirl",
			func : function() {
				Text.Clear();
				Text.Add("You’ve already made him cum, how about asking him to return the favor? Grabbing the wolf by the armpits, you haul him into an upright position, shifting him around as you sit down on the [log] again, with Cale riding you reverse cowgirl.", parse);
				Text.NL();
				Text.Add("<i>“Now, bounce for me,”</i> you purr, holding his arms behind his back in a light grip. He whimpers and whines, but complies quickly enough. The wolf leans back against you to support himself while he strains his powerful legs, pushing himself up until only your [cockTip] remains inside his stretched butt. Either by design or his legs giving out, the wolf then slides down your [cock], letting gravity handle the rest.", parse);
				Text.NL();
				Text.Add("You grab hold of his hips, helping him repeat the motion. ", parse);
				if(knotted)
					Text.Add("Every time the wolf reaches the root of your [cock], his stretched colon meets further resistance in the form of your knot. At first, he has trouble taking it, but as he continues riding you, he manages to push himself lower and lower. ", parse);
				Text.Add("Cale is doing most of the work, with you gently guiding him - one hand raising his butt and the other on the small of his back, keeping him upright. There is no doubt at this point that he likes this new position even more, as his own canid member is standing at attention in all its nine inch glory. Drops of cum are still dangling from his pointed tip, remnants of his last orgasm.", parse);
				Text.NL();
				parse["knot"] = knotted ? ", knot and all" : "";
				Text.Add("Time to end this. In a show of strength, you hoist Cale’s legs into the air, holding him by the back of his knees. Without any support for his lower body, the morph helplessly slides down your slick length, taking you to the root[knot]. The wolf howls as he cums, spraying his seed all over himself as his balls keep up with the demands of his battered prostate.", parse);
				Text.NL();
				
				cum = player.OrgasmCum();
				
				if(p1cock.isStrapon)
					Text.Add("A tremor goes through your body as the base of your artificial member hits in <i>just</i> the right spot, sending white electricity down your spine as you reach your climax.", parse);
				else {
					Text.Add("You aren’t far behind, grunting as you pour your seed into your canid lover, your bitch. Cale moans as he feels the splatter of white semen painting him both inside and out, marking him for the buttslut he is.", parse);
					Text.NL();
					if(cum > 6) {
						Text.Add("<i>“Aah! There is so much!”</i> he groans, clutching feebly at his rapidly growing tummy.", parse);
						if(knotted)
							Text.Add(" Not even your thick knot can hold your massive load, and a majority of it ends up gushing out in large gouts, pressing past the tight seal of Cale’s sphincter.", parse);
					}
					else if(cum > 3) {
						Text.Add("<i>“Haah… there is so much...”</i> he whimpers, clutching at his swollen belly.", parse);
					}
					else {
						Text.Add("<i>“H-hot,”</i> he gasps, arching his back as you unload inside him.", parse);
					}
				}
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Put the wolf in your lap and make him ride you."
		});
		
		Gui.SetButtonsFromList(options, false, null);
		
		Gui.Callstack.push(function() {
			Text.NL();
			if(allCocks.length > 0) {
				parse["notS"]     = allCocks.length > 1 ? "" : "s";
				parse["itsTheir"] = allCocks.length > 1 ? "their" : "its";
				Text.Add("Your remaining [cocks2] spray[notS] [itsTheir] load on Cale’s back, drenching him even further. At the end of this, the wolf is going to need a long and thorough bath.", parse);
				Text.NL();
			}
			Text.Add("You sigh contentedly, collapsing beside your lupine companion.", parse);
			if(knotted) {
				Text.Add(" Tied as he is, Cale has no choice but to follow your movements, yelping as he tumbles on top of you. It takes quite some time before you’re able to finally pull out of the spent wolf.", parse);
				if(!p1cock.isStrapon) {
					parse["meagerHugeMassive"] = cum > 6 ? "massive" :
					                             cum > 3 ? "huge" :
					                             "meager";
					parse["dripsLeaksSplashes"] = cum > 6 ? "splashes" :
					                              cum > 3 ? "leaks" :
					                              "drips";
					Text.Add(" When you do, the trapped remains of your [meagerHugeMassive] load [dripsLeaksSplashes] out of his gaping anus, falling to the ground below.", parse);
				}
				Text.NL();
				parse["cum"] = player.FirstCock() ? " both your and" : "";
				Text.Add("Finally released, Cale drops into a panting heap, soaking his fur in[cum] his own seed.", parse);
				
				world.TimeStep({minute : 30});
			}
			Text.Flush();
			
			
			var virginPrompt = function() {
				Text.Flush();
				if(virgin) {
					cale.slut.IncreaseStat(50, 5);
					//[BeForward] [Neutral] [Comfort]
					var options = new Array();
					options.push({ nameStr : "Be forward",
						func : function() {
							Text.Clear();
							Text.Add("Smirking to yourself, you nuzzle the wolf-morph, who visibly restrains himself from flinching. Your hand reaches around and presses itself gently against his stomach, feeling the soft fur. With slow, sensuous motions, your fingers start to rub up and down, trailing the contour of his nicely muscled abs.", parse);
							Text.NL();
							Text.Add("As you continue stroking him, you casually ask what he was thinking about. You feign ignorance of his discomfort, but really you are drinking in every reaction, delight flooding you as you see the tip of his crimson member poke out from its sheath again.", parse);
							Text.NL();
							
							player.AddLustFraction(0.3);
							
							Text.Add("He swallows audibly. <i>“I was thinking about what we did…”</i> he trails off. <i>“What <b>you</b> did to <b>me</b>,”</i> he adds, as if that wasn’t obvious. Just to mess with him, you nudge him in the back with your [cocks].", parse);
							Text.NL();
							Text.Add("You know he's not going to say he didn't like it, you declare, your hand slowly creeping downward, toward his loins. Enjoying every moment of it, you wrap your fingers possessively around the warmth of his now-erect cock. Up and down, you stroke him in slow, languid pumps, your thumb rubbing circles over his pointy, cum-soaked glans.", parse);
							Text.NL();
							Text.Add("He thrusts in tandem with your stroking, wary of disturbing your pace lest you stop your ministrations. He moans softly as he begins gyrating his hips. <i>“I didn’t… I mean, I didn’t say I didn’t like it,”</i> he replies, humping your hand softly. Considering the way his face is scrunching up in pleasure, you’d guess this simple handjob is feeling nearly as good as Rosalin’s pussy.", parse);
							Text.NL();
							Text.Add("Smirking, you ask if he wants another go so soon after your last romp, rubbing your [cock] against his back suggestively.", parse);
							Text.NL();
							Text.Add("<i>“I… kinda wish I could, but I’m spent,”</i> Cale sighs, shuddering as you keep jerking him off. <i>“I… hah… I’ve never felt like this before, not once…”</i> he trails off, moaning softly as you stroke him. In record time, another throb runs through the stiff cock in your hands as Cale’s third, significantly weaker, orgasm splatters uselessly on the ground.", parse);
							Text.NL();
							Text.Add("<i>“J-just let me catch my breath,”</i> the wolf gasps, <i>“I need some rest before next time, okay?”</i> Though it is tempting to take him again then and there, you need some time to recover yourself, so you regretfully take mercy on him. At least he wants a next time...", parse);
							
							cale.slut.IncreaseStat(50, 5);
							
							PrintDefaultOptions();
						}, enabled : true,
						tooltip : "Looks like he liked it. Why not tease him a little?"
					});
					options.push({ nameStr : "Neutral",
						func : function() {
							Text.Clear();
							Text.Add("You ask if he would be willing to try things your way again.", parse);
							Text.NL();
							parse["swollen"] = cum > 3 ? " swollen" : "";
							Text.Add("He scratches his[swollen] stomach, looking more than a little flustered at your bluntness. <i>“I guess... I mean… I’ve never done anything like that. Actually, I’d never even considered it, but yeah. I guess it felt pretty good in the end,”</i> he admits. Seems like he’s confused about what to make of this whole situation.", parse);
							Text.NL();
							Text.Add("Shrugging your shoulders, you ask what the problem is then; he enjoyed it, he admits he enjoyed it, he thinks he could enjoy doing it again. What's to worry about it?", parse);
							Text.NL();
							Text.Add("<i>“You… have a point. This isn’t so bad after all,”</i> the wolf replies, nuzzling back against you. <i>“Going to need some time after that last one,”</i> he grimaces.", parse);
							
							PrintDefaultOptions();
						}, enabled : true,
						tooltip : "Let's just cut to the chase, this isn’t such a big deal."
					});
					options.push({ nameStr : "Comfort",
						func : function() {
							Text.Clear();
							Text.Add("Smiling gently, you ask if he's alright, and apologize for how you treated him.", parse);
							Text.NL();
							Text.Add("He looks a bit surprised at the apology. <i>“Huh? Oh, right. Sure, no problem. It’s not like I didn’t enjoy it,”</i> he examines you, a bit unsure of himself. <i>“A bit, just a bit,”</i> he hurriedly adds.", parse);
							Text.NL();
							Text.Add("You tell him that you're glad to hear that. You'll try to give him more of a choice in the matter in the future. If there is one, you quickly add.", parse);
							Text.NL();
							Text.Add("<i>“Right, though I should hope the terms are different. I’m a guy, and I’m sure I don’t swing that way. My thing is pitching, not catching,”</i> he states, you’re not sure if to reassure you or himself. <i>“I… perhaps wouldn’t mind it once in a while though,”</i> he adds, tail wagging slightly.", parse);
							Text.NL();
							Text.Add("You tell him that you're grateful that he's so understanding, and certainly wouldn’t mind giving him another taste of this kind of sex.", parse);
							
							cale.relation.IncreaseStat(100, 10);
							cale.slut.DecreaseStat(0, 5);
							
							PrintDefaultOptions();
						}, enabled : true,
						tooltip : "He's obviously uncertain about how he feels; why not be nice to him?"
					});
					Gui.SetButtonsFromList(options, false, null);
					
					Gui.Callstack.push(function() {
						Text.NL();
						Text.Add("<i>“I don’t think I’ll be able to walk for a while after this though,”</i> he groans, rubbing his sore bum. You give him a kiss, leaving him to recover while you clean yourself up before heading out on your journey again. Cale looks like he wouldn’t mind another one of these ‘visits’ from you.", parse);
						Text.Flush();
						
						world.TimeStep({hour : 1});
						
						Gui.NextPrompt();
					});
				}
				else {
					Text.Add("Cale shakily thanks you for showing him such a good time. You smile knowingly, giving him a fond kiss. Leaving him to recover, you clean yourself up before heading out on your journey again.", parse);
					Text.Flush();
					
					var slut = outside ? 4 : 3;
					var max  = (cale.flags["Met2"] >= Cale.Met2.Goop) ? 100 : 50;
	
					cale.slut.IncreaseStat(max, slut);
					
					world.TimeStep({hour : 1});
					
					Gui.NextPrompt();
				}
			};
			
			
			Gui.NextPrompt(function() {
				Text.Clear();
				
				cale.relation.IncreaseStat(100, 3);
				
				if(opts.cheat) {
					if(cale.flags["cCheat"] == 0) {
						Text.Add("<i>“You… you rigged the game,”</i> he states with the hint of a frown.", parse);
						Text.NL();
						Text.Add("Yeah, you and the satyr set it up. Is he really going to complain now though, of all times? The deed is done and you’ve already claimed your <i>just</i> reward.", parse);
						if(cale.flags["maxPast"] > 0)
							Text.Add(" Plus you thought he was a more ‘in the moment’ kind of guy.", parse);
						Text.NL();
						Text.Add("<i>“Oh, I’m not really mad at you. Sure, it was underhanded of you, but honestly? I should’ve seen it coming. So this one is on me, for not keeping an eye out for cheating. Serves me right.”</i>", parse);
						Text.NL();
						Text.Add("...That’s a bit surprising, you imagined he’d be a bit more of a sore loser once he figured out you cheated your way into his butt.", parse);
						Text.NL();
						Text.Add("<i>“Make no mistake, sore describes my situation pretty accurately right now,”</i> he says, rubbing his butt. <i>“But if I may be honest, I’m kinda flattered you thought you had to cheat your way into winning,”</i> he says, grinning confidently. <i>“Hope you enjoyed your victory, 'cuz next time I’mma keep an eye out and catch you red-handed.”</i>", parse);
						Text.NL();
						Text.Add("Those are fighting words. Alright then, challenge accepted. You’ll just have to find new ways of winning.", parse);
					}
					else {
						Text.Add("So, whatever happened to keeping an eye out for cheating?", parse);
						Text.NL();
						if(cale.Slut() >= 60) {
							Text.Add("<i>“I must’ve gotten distracted; had something else in my mind.”</i> He looks at your crotch, licking his lips salaciously.", parse);
							Text.NL();
							Text.Add("The excuses of a wolf-slut, you sigh. He’s not even trying to hide it anymore, not that you mind seeing him brazenly admit his fetishes.", parse);
						}
						else {
							Text.Add("<i>“Umm… I… got a bit distracted. Y’see, I’ve been drinking and I guess I’m still a bit sluggish.”</i>", parse);
							Text.NL();
							Text.Add("You roll your eyes. At this point, you’re not sure if he’s trying to lie to you or himself. In either case, it matters not. You both know he enjoyed that, and if he doesn’t want to get his butt reamed, all he has to do is say <i>no</i> next time you challenge him.", parse);
						}
						Text.NL();
						Text.Add("<i>“Next time, I’ll show ya. Got a few tricks up my sleeve.”</i> He rubs his paws together, smiling mischievously.", parse);
						Text.NL();
						if(cale.flags["cLoss"] >= 5) {
							Text.Add("Considering his track record? You seriously doubt that. You half-expect the wolf to admit he’d rather jump to the part where you dig your way into his [cAnusDesc] than continue this charade. For now though, you think you’ll humor him.", parse);
							Text.NL();
						}
						Text.Add("Alright then, if he thinks he can have you beat, all he has to do is say the word and you’ll be happy to accept any challenges he may impose.", parse);
					}
					Text.NL();
					
					cale.flags["cCheat"]++;
					
					if(virgin) {
						Text.Add("So, how did he feel about his first anal fuck?", parse);
						Text.NL();
						Text.Add("<i>“I… uh, not sure, to be honest.”</i> The wolf looks confused about the whole ordeal.", parse);
						Text.NL();
					}
				}
				else if(opts.cavalcade) {
					Text.Add("<i>“Damnit, I’ll get you next time,”</i> Cale grunts as he rubs his aching behind.", parse);
					Text.NL();
					if(cale.Slut() >= 30)
						Text.Add("You ask if he’s sure he didn’t lose on purpose? It sure looked like he bet his ass on some really weak hands… The wolf flashes you a quick grin. <i>“Well, it’s no big deal if I lose, and winning has a whole lot of perks to it.”</i>", parse);
					else
						Text.Add("Was it really that bad though? <i>“I got what I deserved, I guess,”</i> he grimaces. <i>“Shouldn’t have bet on that one hand, but I thought I really had you there. Besides, folding wouldn’t have made things any better.”</i>", parse);
					Text.NL();
					if(cale.flags["cLoss"] <= 1) {
						Text.Add("<i>“Tell me though, how come you didn’t pick Rosie?”</i>", parse);
						Text.NL();
						Text.Add("Well, for one you thought it would be fun to see his reaction. <i>“I bet,”</i> he groans, remembering just what kind of reaction he had. You tell him not to worry about it too much.", parse);
					}
					else {
						Text.Add("<i>“Well played, anyways,”</i> he congratulates you.", parse);
					}
					Text.NL();
					if(virgin) {
						Text.Add("So, how did he feel about his first anal fuck?", parse);
						Text.NL();
						Text.Add("<i>“I… uh, not sure, to be honest.”</i> The wolf looks confused about the whole ordeal.", parse);
						Text.NL();
					}
				}
				else if(virgin) {
					Text.Add("The wolf is unusually silent as the two of you recover from the intense romp. It looks like he’s quite embarrassed about the whole deal. When you ask him what’s on his mind, he avoids your gaze.", parse);
					Text.NL();
					Text.Add("<i>“You know… just thinking,”</i> he mumbles vaguely.", parse);
				}
				
				virginPrompt();
			});
		});
	});
	if(!breakpoint) PrintDefaultOptions();
}

Scenes.Cale.SexCatchVag = function(outside) {
	var parse = {
		log           : outside ? "log" : "bedroll",
		playername    : player.name
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Text.Clear();
	if(cale.Slut() < 60)
		Text.Add("<i>“Music to my ears,”</i> he says, already starting to undo his pants.", parse);
	else
		Text.Add("<i>“Feel like some wolf cock after all the wolf butt you got? I can oblige!”</i> he says, grinning happily as he begins stripping.", parse);
	Text.NL();
	Text.Add("Needing no further encouragement yourself, you start to strip as well, placing your gear side so it’s not likely to get messy or kicked away. By the time you’re finished, Cale is naked and seated with his legs sprawled open, letting you watch him jiggling and stroking his balls, a half-erect wolf-cock bobbing above his sheath at the motions.", parse);
	Text.NL();
	Text.Add("<i>“How about helping me get prepped for the taking?”</i> He suggests.", parse);
	Text.NL();
	Text.Add("Looks like he needs some priming first... now, what to do...?", parse);
	Text.Flush();
	
	//[Handjob] [Blowjob] [StrokeSelf]
	var options = new Array();
	options.push({ nameStr : "Handjob",
		func : function() {
			Text.Clear();
			Text.Add("With a grin, you saunter toward him and kneel down before him, gently but insistently pushing his hands away before wrapping your own fingers around his dick. The warm, semi-turgid flesh pulsates gently in your grip as you start to rhythmically stroke up and down. You squeeze and release as you go, alternating the pressure in time with your motions, sliding Cale’s wolfhood through your digits and across your palm before glancing up and seeing how he’s enjoying this.", parse);
			Text.NL();
			Text.Add("<i>“Yeah… touch my balls too. Get me nice and hard for you,”</i> he says, beginning to pant.", parse);
			Text.NL();
			Text.Add("With your free hand, you do as asked, rolling and kneading the full, fluffy orbs against your palm. You can feel his shaft growing harder in your grasp, a distinctive roundness at its base signaling his knot coming into play; it’s still deflated, but you and he both know it’s already aching to be used. As wetness starts to dampen your fingers, you smile to yourself, playfully making an idle comment to Cale about him leaking pre-cum already. You keep stroking, letting his fluids seep over your digits until they drip with it, and then let him go.", parse);
			Text.NL();
			if(player.Slut() >= 25) {
				Text.Add("Holding your hand up so that Cale’s pre-cum glistens on your fingers, you grin at him as you roll it gently back and forth before lifting your palm to your face and starting to lap it clean with your tongue. Eyes half-hooded in desire, you slowly clean your digits off, noisily sucking on them until you’ve licked up every drop.", parse);
				Text.NL();
				Text.Add("Cale swallows audibly, and you think you see his cock throb at the sight. <i>“Damn if you don’t know how to get a guy going, [playername]...”</i> he says in admiration.", parse);
			}
			else {
				Text.Add("You idly shake your hand, waving so as to fling the worst of the excess juices aside and make it a little cleaner. Looks like he’s all ready, you note.", parse);
				Text.NL();
				Text.Add("<i>“I sure am.”</i> Cale grins.", parse);
			}
			Text.NL();
			Text.Add("Cale motions to the [log] beside the two of you. <i>“Get comfy and we can get started then.”</i>", parse);
			Text.NL();
			Text.Add("Glancing at the [log], you look back at him and shake your head; you have a different position in mind. You tell him to lie back and get comfortable. Cale tilts his head, looking a little bemused, but shrugs his shoulders and complies readily enough. Rising up, you move to straddle his waist, repositioning him slightly so he’ll be more comfortable, slowly dropping your way down his belly so he fully understands what it is you intend to do, halting just before he can penetrate you.", parse);
			Text.NL();
			
			Scenes.Cale.SexCatchVagEntrypoint(outside);
		}, enabled : true,
		tooltip : "Bat his hands away and show him how it’s done, firsthand."
	});
	options.push({ nameStr : "Blowjob",
		func : function() {
			Text.Clear();
			Text.Add("Smirking seductively, you sashay your way over to Cale and kneel with exaggeratedly demure motions before him. You slowly run your tongue over your lips in a tantalizing motion that makes the wolf move his hands, allowing you to lower your [face] toward his groin.", parse);
			Text.NL();
			Text.Add("Your [tongue] glides out and then slowly strokes up his half-erect shaft, starting just above his sheath and moving up to his tip. You circle his glans with the tip of your tongue, then release him before applying your [tongueTip] back at his base and gliding up again, smooth, even strokes up and down.", parse);
			Text.NL();
			Text.Add("<i>“Shit! Just don’t go overboard on it. Don’t wanna disappoint and cum before I’ve had a chance at your pussy.”</i>", parse);
			Text.NL();
			Text.Add("You keep that thought in mind, but you’re not done with him yet. You let your tongue trail back down his shaft, licking at the base of his sheath as best you can before moving down to lap at his balls. You trace patterns over them with your tongue-tip, then glide your way back up to his now-dribbling tip, sucking gently at it and letting his pre-cum wash over your senses. When you pull your mouth away, Cale’s cock is sticking out like an accusing finger, pointing straight between your eyes, almost visibly throbbing in arousal.", parse);
			Text.NL();
			Text.Add("<i>“I’m almost sad that you stopped, almost. Now the main course, aye?”</i> You nod. <i>“Alright, bend over this [log] yonder, m’lady.”</i> He makes a flourish at the [log] beside the two of you.", parse);
			Text.NL();
			Text.Add("You shake your head with a smile; nope, that’s not how it’s going to work. Standing up, you place a gentle hand on his shoulders and guide him into leaning back against the [log], maneuvering to straddle his waist, your hands still on his shoulders, grinning as you look right into his eyes. As if he needs further explanation of what you have in mind, you start to bend down, resting more of your weight on him, sliding down his trim belly until he can just barely feel the heat of your aroused womanhood on the head of his dick.", parse);
			Text.NL();
			
			Scenes.Cale.SexCatchVagEntrypoint(outside);
		}, enabled : true,
		tooltip : "A little tongue action should get that dick of his nice and ready for you."
	});
	if(cale.Slut() >= 60 && (player.FirstCock() || player.Strapon()))
	{
		options.push({ nameStr : "Stroke self",
			func : function() {
				Text.Clear();
				Text.Add("Grinning cockily back at him, you shift your pose slightly to more prominently display your [cocks], hands on your [hips].", parse);
				Text.NL();
				var biggestCock = player.BiggestCock();
				if(biggestCock) {
					parse["cockBiggestDesc"] = function() { return biggestCock.Short(); }
					Text.Add("Curling your thumb and forefinger into a circular pattern, you reach for your [cockBiggestDesc] and slide its glans through the hole of your palm, squeezing softly as you trail down its length until your [hand] is resting against your groin. You twist your wrist slightly, pulling back against your shaft, and then curl your other hand around your cock in the same manner, pulling back up your member to your glans.", parse);
					Text.NL();
					Text.Add("Your skin tickles at the friction, blood rushing into your shaft[s] as you repeat the milking motion again with your first [hand], the second [hand] taking its place around the base of your dick. With smooth, even strokes, you rhythmically pull and stroke, moaning softly in your arousal, eyes hooded in lust as you glance at your wolfy slut and see if he’s enjoying the show.", parse);
				}
				else {
					Text.Add("Adjusting the straps around your loins to make sure it’s properly fixed, you grab your prosthetic [cocks] and slot it home, checking to see that it’s set properly with slow, purposeful motions. Once satisfied that it’s secure, you smirk at Cale and begin to caress the faux-dick with your fingers, a lewd groan of appreciation bubbling from your lips as they dance up and down across the dildo’s length, acting as if you can truly feel yourself upon the imitation phallus.", parse);
				}
				Text.NL();
				Text.Add("Cale watches the spectacle unfold, tongue lolling out as he pants and strokes his own cock with a hand. His other hand is busy teasing his entrance. The slutty wolf lets out a wanton moan as he finally pierces his tight ring with his middle fingers, masturbating as he dreams of your [cocks] entering him.", parse);
				Text.NL();
				Text.Add("<i>“Damn, [playername]. That’s playing dirty, teasing me with the promise of buttsex,”</i> he says, stifling a moan as he wills himself to stop masturbating. His cock is already throbbing at full mast, the veins bulging out as a droplet of pre slides down his length.", parse);
				Text.NL();
				Text.Add("Maybe so, you concede, but it certainly got him in the mood, now didn’t it? Now, you’ve a hungry pussy here just waiting for some stuffing of its own; if he does a good job, you’ll see about stuffing his ass in turn, you promise.", parse);
				Text.NL();
				Text.Add("<i>“Deal! Now, why don’t you see about settling on that [log]-”</i> You stop him with a finger on his lips. Smiling, you shake your head and move to take his shoulders, pushing him down and leaning him back against the [log] before moving to straddle him. Deliberately letting your [cocks] rest against his chest, you grind your hips into his torso and slowly glide down until your [vag] is hovering just above his hot erection.", parse);
				Text.NL();
				
				Scenes.Cale.SexCatchVagEntrypoint(outside);
			}, enabled : true,
			tooltip : "You know your wolfy slut loves your dick; playing with it should be all he needs to get him fired up."
		});
	}
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Cale.SexCatchVagEntrypoint = function(outside, fromAnal, customIntro) {
	var cocksInAss = player.CocksThatFit(cale.Butt(), true);
	var cock = player.BiggestCock(null, true);
	
	var parse = {
		log           : outside ? "log" : "bedroll",
		playername    : player.name,
		guygal        : player.mfTrue("guy", "gal")
	};
	parse = player.ParserTags(parse, "", cock);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	//Note, use custom intro instead if applicable
	if(!customIntro) {
		Text.Add("Cale grins widely when he sees what you have in mind. ", parse);
		if(cale.Relation() < 40) {
			Text.Add("<i>“Keep doing this and you’ll have a very happy wolf pretty soon,”</i> he comments, licking his lips.", parse);
			Text.NL();
			Text.Add("Maybe so, but let’s see if he can make you a happy [guygal] first, you reply.", parse);
		}
		else {
			Text.Add("<i>“Aw, [playername]. Now you’re just spoiling me,”</i> he says, batting his eyes teasingly at you.", parse);
			Text.NL();
			Text.Add("Grinning back, you reach out and gently pat his head, assuring him that only the best is good enough for your favorite wolf. Your grin widens as you hear an arrhythmic thumping noise; Cale’s tail is wagging so hard that he’s drumming on the [log] behind him.", parse);
		}
		Text.NL();
		Text.Add("Now that the foreplay is over with, it’s time to have some real fun. With a final breath, you finish your descent, allowing his cock to close the distance between you and push into your folds. The feeling of him spearing into your needy [vag] sends jolts of both pain and pleasure coursing throughout your body. A groan escapes your throat at the stimulus, only enticing you to sink yourself downward further, refusing to stop until you have reached to just above his knot.", parse);
		Text.NL();
	}
	
	Sex.Vaginal(cale, player);
	player.FuckVag(player.FirstVag(), cale.FirstCock(), 3);
	cale.Fuck(cale.FirstCock(), 3);
	
	Text.Add("Cale’s hands immediately fly to your hips, and you can see his muscles tense as he works to lift you.", parse);
	Text.NL();
	Text.Add("You push with your [legs], helping Cale to lift you up and down, your breathing coming in short pants as you feel his fat dick grinding away inside of you with each rise and fall. Your [vag] clamps down as you rise up his length, clenching him as best you can to make it as hard as possible to remove you, slackening only when gravity starts to bring you back down to delicious fullness.", parse);
	Text.NL();
	Text.Add("It doesn’t take long for you to feel Cale’s cold nose bumping against your [nip], and for him to begin licking you slowly and carefully.", parse);
	if(player.Lactation())
		Text.Add(" When a droplet of your milk touches his tongue, he simply chuckles and envelops your nipple in his wolfish muzzle, and begins draining your [breasts] of their precious cream.", parse);
	Text.NL();
	
	if(outside)
		Scenes.Cale.SexGettingFuckedOutsideComments();
	
	Text.Add("Your excitement building, you don’t even think before upping the pace, lifting and falling with greater enthusiasm until your hips are audibly slapping against his own. Lust and pleasure chase each other through your brain, clouding your vision - but you don’t need eyes to feel that Cale is similarly lost in his reverie. You can feel his knot, fat and swollen with his arousal, beating against your netherlips with each descent you make, so engorged that it’s almost too big to freely slip in and out anymore.", parse);
	Text.NL();
	if((cale.Slut() >= 60) && cock && (cock.length.Get() >= 20)) {
		Text.Add("The sight of your cock bouncing in front of him is too much for the slutty wolf. Without nary a second thought, he leans into your bobbing mast of manflesh and begins lavishing your [cockTip] with licks from his broad tongue.", parse);
		Text.NL();
		Text.Add("You moan unthinkingly as Cale starts to suck your dick. ", parse);
		if(player.FirstCock())
			Text.Add("The pleasurable tingles race down your shaft’s length and crackle up your spine, contrasting most wonderfully with the feelings of your cunt being pounded, stoking your pleasure ever higher with each slurping lick.", parse);
		else
			Text.Add("Though you naturally can’t feel anything from the action itself, the sight of it and the knowledge that this cocky lady-killer is now eagerly sucking your favorite toy for all he’s worth simply goads your pleasure higher and higher.", parse);
		Text.NL();
		parse["pre"] = cock.isStrapon ? "" : ", draining it of your pre";
		Text.Add("He takes your [cock] into his mouth, sucking it like a teat[pre] as you work toward your inevitable high. The ever increasing tempo of your fucking drawing a howling moan from the wolf as he releases your [cock] to let it slap noisily against his chest.", parse);
		Text.NL();
	}
	
	var cum = player.OrgasmCum();
	
	Text.Add("It’s all too much to hold onto anymore, and you echo Cale’s cry with one of your own as you climax, feminine fluids drooling down his shaft and over his balls.", parse);
	if(player.FirstCock()) {
		Text.Add(" Your cock[s] follow[notS] your womanhood in erupting, sending streamers of lady-spunk flying through the air toward Cale’s chest and face. ", parse);
		if(cum > 6) {
			Text.Add("Thick and furious your geyser of semen flies, drenching the wolf from head to belly in your spooge, painting him semen-white before you finish. ", parse);
			if(cale.Slut() >= 60)
				Text.Add("Cale opens his mouth eagerly, gulping down the flying feast of seed being blasted all over his face, swallowing until his stomach protests enough to make him settle for simply reveling in his perverse shower.", parse);
			else
				Text.Add("Face screwed up in a grimace, Cale accepts the torrential bath with discontent, trying desperately to keep from swallowing anything as best he can.", parse);
		}
		else if(cum > 3) {
			Text.Add("Great ropes of white smear themselves over the wolf-morph’s face, drooling down to paint his neck and shoulders in more of the same.", parse);
			if(cale.Slut() >= 60)
				Text.Add(" He opens his mouth, trying to catch some of the flying treat, playfully catching as much of it as he can.", parse);
		}
		else {
			Text.Add("Pearly strands paint themselves over the wolf’s cheeks and throat.", parse);
			if(cale.Slut() >= 60)
				Text.Add(" His tongue unthinkingly darts out to lap some up with a lewd slurp.", parse);
		}
	}
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“Fuck! I’m gonna blow! Quick, [playername], can I knot or not?”</i> he asks, panting in desperation.", parse);
		Text.Flush();
		
		//[Yes] [No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				Text.Clear();
				Text.Add("Cale’s thrusts increase in potency, each slap loosening you just a tiny bit as he works to force that huge knot of his inside. With a triumphant howl, he finally pops it in and proceeds to dump his considerable load within you.", parse);
				Text.NL();
				
				Scenes.Cale.Impregnate(player, PregnancyHandler.Slot.Vag, 4);
				
				Text.Add("You cry out, deep and low, as you feel his thick knot forcing its way through your netherlips, blindly clamping down to wring every last drop from his balls, grinding his bulbous flesh with the walls of your cunt. Liquid warmth bubbles and seethes inside of you as his seed races up, the seal of his knot so tight that his sperm has nowhere to go but inside your womb, your stomach visibly bulging before he shudders and goes slack.", parse);
				Text.NL();
				Text.Add("Cale collapses, tongue lolling out as he groans due to his recent activities, his knot pulling to lay atop him. <i>“Damn, [playername]. Hell of a pussy you’ve got there,”</i> he compliments you with a lopsided grin.", parse);
				if(cale.Slut() >= 60)
					Text.Add(" <i>“Between this and getting a hard cock up my arse, I dunno what feels better.”</i>", parse);
				Text.NL();
				Text.Add("Smirking back, you thank him for the compliment. He’s not bad himself.", parse);
				Text.NL();
				Text.Add("<i>“Well, we’d better comfy. It’ll be a while before my knot shrinks, till then nothing to do but relax… and enjoy a few extra spurts of Cale goodness,”</i> he adds, groaning as you feel another spurt shooting inside you. <i>“Hope y’don’t mind if I take a short nap?”</i> he asks, suddenly looking pretty worn out.", parse);
				Text.NL();
				Text.Add("Resting yourself comfortably atop him, you yawn softly and tell him that’s fine, if he doesn’t mind letting you take one as well...", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("Stretching yourself, enjoying the tingles racing through your nerves, you finish pulling on your [armor], looking back to see Cale just making the final adjustments to his own clothes.", parse);
					Text.NL();
					Text.Add("<i>“Thanks for the awesome ride, [playername]. Glad to play pony for your cowgirl fantasies anytime,”</i> he teases.", parse);
					if(cale.Slut() >= 60)
						Text.Add(" <i>“Tho I hope you’ll let <b>me</b> play cowboy sometime soon,”</i> he adds with a smirk.", parse);
					Text.NL();
					Text.Add("You assure him that the feeling is mutual; you enjoyed every moment of it. Grinning for emphasis, you twitch your hips a little, noting you still feel a tingle from having his knot stretching you out so much. You wave him a final goodbye and set off again.", parse);
					Text.Flush();
					
					cale.relation.IncreaseStat(100, 4);
					world.TimeStep({hour : 2});
					
					Gui.NextPrompt();
				});
			}, enabled : true,
			tooltip : "You want him inside you, all the way; let’s have that knot!"
		});
		options.push({ nameStr : "No",
			func : function() {
				Text.Clear();
				Text.Add("Cale’s thrust double in speed as he becomes a blur, trying his best to not let his knot slip into your used [vag]. With a triumphant howl, the wolf cums! Spurt after spurt of his lupine spunk painting your walls white, even as some of his copious load escapes your entrance to drench his knot and balls. You can feel him throbbing inside, his hips still moving, or perhaps just trembling, in pleasure until he finally collapses in a panting heap of satisfied wolf.", parse);
				Text.NL();
				
				Scenes.Cale.Impregnate(player, PregnancyHandler.Slot.Vag, 2);
				
				parse["cum"] = cum > 3 ? " cum-slickened" : "";
				Text.Add("With a great heaving sigh of satisfaction, you allow yourself to slowly sink atop him, cuddling him like a fluffy[cum] pillow as you rest on his form, bathing in your own warm glow of pleasure. Cheek to cheek, you nuzzle him softly, content to lie here until you feel like your [legs] won’t just give if you try to stand.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("Having finished getting back into your [armor], you turn to Cale and thank him for the nice time, but you have to go now.", parse);
					Text.NL();
					Text.Add("Cale, still nonchalantly naked, simply smiles a crooked smile back and waves a hand lightly. <i>“Sure thing, [playername]. Me, I’m gonna stick around a little longer; enjoy the fresh night air.”</i> He closes his eyes and stretches luxuriantly, a soft groan escaping him, then smirks and gently pats at his balls. <i>“Not to mention the tingles my balls get after a great fuck,”</i> he quips.", parse);
					Text.NL();
					Text.Add("That’s Cale for you; never going to change. You give him a final polite goodbye and then return to your business.", parse);
					Text.Flush();
				
					cale.relation.IncreaseStat(100, 3);
					world.TimeStep({hour : 1});
					
					Gui.NextPrompt();
				});
			}, enabled : true,
			tooltip : "You can’t take the time to wait for it to deflate; make him leave it out."
		});
		Gui.SetButtonsFromList(options, false, null);
	}, 1.0, function() { return true; });
	if(!fromAnal) {
		scenes.AddEnc(function() {
			Text.Add("Cale’s thrusting slows to a halt, the wolf regarding you for a bit, before a smirk spreads his muzzle.", parse);
			Text.NL();
			Text.Add("Still enjoying the warm fuzz of your afterglow, it takes you a moment to pick up on Cale’s lack of movement. He hasn’t cum yet, so why did he stop? Something wrong?", parse);
			Text.NL();
			Text.Add("<i>“Think I’d like to try another hole.”</i>", parse);
			Text.NL();
			Text.Add("Giving him a slightly dopey grin, you nod and assure him that you’re okay with that idea; you feel far too good to protest the idea of more sex. Add in that Cale hasn’t cum yet and, well, that’s even more reason.", parse);
			Text.NL();
			parse["is"] = player.HasLegs() ? "are" : "is";
			Text.Add("When the wolf attempts to lift you from his lap, you comply as well as you can, using his shoulders to help rise out of his lap. Your [legs] [is] still too wobbly to have a hope of standing up, but that’s alright; it doesn’t seem like Cale has any plans to move too far as he helps you to sprawl across the [log] behind him.", parse);
			Text.NL();
			Text.Add("Once you are properly positioned to his liking, he gives your shoulder a friendly pat and moves behind you, where you can feel his hands coming down to rest on your ass.", parse);
			Text.NL();
			Text.Add("<i>“What a nice view we got from back here,”</i> he comments, chuckling as he caresses your [butt].", parse);
			Text.NL();
			if(player.HasPrehensileTail()) {
				Text.Add("You roll your eyes in exaggerated annoyance; does he have to always throw around those cheesy lines of his? Your [tail] flicks around in a half-playful reprimand to slap his cheek, firmly enough that he can feel it, yet not so hard as to actually hurt him.", parse);
				Text.NL();
				Text.Add("<i>“Hey!”</i> he protests weakly at your tail slap.", parse);
			}
			else
				Text.Add("You don’t even bother trying to hide the fact you are rolling your eyes, heaving an exaggerated sigh at hearing yet another lame line of his. Doesn’t he have any better material than that?", parse);
			Text.NL();
			Text.Add("Clicking your tongue in the iconic 'tsk-tsk' noise, you teasingly ask if he really has to use those same corny lines all the time. If he’s going to be that lame that he has to keep yapping like that, well, then you’re done - you got what you wanted, after all. Smirking to yourself, you start to push yourself up off of the [log] with your arms as if you're intending to rise to your [feet] and leave.", parse);
			Text.NL();
			parse["dudelady"] = player.mfTrue("dude", "lady");
			Text.Add("<i>“W-wait, I’m not done yet!”</i> He grasps your [butt], firmly holding you in position. <i>“Hold on there, [dudelady]. Geez, no need to be so pushy; never heard of foreplay?”</i> he teases.", parse);
			Text.NL();
			Text.Add("You wouldn’t call what he was doing foreplay, you promptly shoot back. You have higher standards than that, you declare, a playful smirk on your lips.", parse);
			Text.NL();
			if(player.HasPrehensileTail()) {
				Text.Add("<i>“...Somehow, that hurts a lot more than the tail slap you gave me earlier.”</i>", parse);
				if(player.FirstCock()) {
					Text.NL();
					Text.Add("Well, if he didn’t like the tail slap, you could always give him a cock slap instead, you immediately retort.", parse);
					Text.NL();
					if(cale.Slut() >= 60) {
						Text.Add("<i>“That would have actually hurt a lot less, plus it’d give me a chance to sneak a little lick off your meat lollipop,”</i> he chuckles.", parse);
						Text.NL();
						Text.Add("Always the opportunist, isn’t he? Still, you’d be lying if you said you didn’t find the thought enjoyable.", parse);
					}
					else
						Text.Add("<i>“No thanks,”</i> he immediately quips back.", parse);
				}
			}
			else {
				Text.Add("<i>“Ouch! Now you’re just being cruel, [playername].”</i> He feigns hurt, but you know he’s actually enjoying this. Still… you’d like to get things going; after all, you can only humor him for so long. ", parse);
			}
			Text.NL();
			parse["ass"] = cale.Slut() >= 30 ? Text.Parse(" and up your ass crack, making sure to tease your [anus]", parse) : "";
			Text.Add("<i>“Okay then, I suppose there are better things I could do with my mouth than keep talking.”</i> He leans over to give a long lick over your pussy[ass].", parse);
			Text.NL();
			parse["sf"] = player.body.SoftFeet() ? ", your toes curling at the sensation" : "";
			Text.Add("You groan deep and loud[sf], a shiver of pleasure racing up your spine. ", parse);
			if(player.Slut() >= 50)
				Text.Add("You mewl unabashedly like the whore you are, audibly reveling in the treatment the lupine tongue is giving you.", parse);
			else
				Text.Add("You fight to keep yourself from moaning like a whore in heat at Cale’s ministrations, struggling to retain some dignity under his pleasurable onslaught.", parse);
			Text.NL();
			if(cale.Slut() >= 30)
				Text.Add("Cale has no reservations about sticking his nose up your ass and licking you to stretch and prepare you for his cock. He rims you with gusto, enjoying each squirm or moan of pleasure he manages to draw from you.", parse);
			else
				Text.Add("Cale sets about fingering you, ensuring you’re wet and horny again.", parse);
			Text.Add(" Once he’s done with that, he aligns his cock with your pussy once more and thrusts in, grinding and stirring up your insides to ensure your juices cling to his dick.", parse);
			Text.NL();
			Text.Add("<i>“This should be enough.”</i>  Pulling out, he aligns his cock with your [anus] and grins. <i>“Ready?”</i>", parse);
			Text.NL();
			Text.Add("You grin to yourself and wriggle your ass enticingly at the wolf-morph, playfully asking what he thinks the answer is.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Scenes.Cale.SexCatchAnalEntrypoint(outside, true);
			});
		}, 1.0, function() { return true; });
		
		scenes.AddEnc(function() {
			Text.Add("Without so much as a warning, Cale pulls out of your used vagina and nests his knotty wolf-pecker between the cheeks of your [butt]. He presses them together as he fucks your ass cleavage, rubbing his length against your rosebud.", parse);
			Text.NL();
			
			Scenes.Cale.SexCaleShowerEntrypoint(outside);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			var p1cock = player.BiggestCock(cocksInAss);
			parse["cock"] = function() { return p1cock.Short(); }
			parse["cockTip"]  = function() { return p1cock.TipShort(); }
			
			Text.Add("<i>“[playername]?”</i>", parse);
			Text.NL();
			Text.Add("You lift your head to look Cale in the eye quizzically, letting out a wordless noise of acknowledgement.", parse);
			Text.NL();
			Text.Add("<i>“Since you’re properly equipped,”</i> he flicks your [cockTip] with a finger, gathering some spunk on his digit, <i>“and you’ve already had your fun, how about throwing me a bone?”</i> he grins, lapping your cum off his finger.", parse);
			Text.NL();
			Text.Add("With a weak grin and a faint chuckle, you point out that the spirit may be willing, but the flesh is weak; indicating your spent [cock], you point out you’re not exactly properly set up to give him his bone.", parse);
			Text.NL();
			Text.Add("<i>“No worry, [playername]. Don'cha know that wolves always lick their bones before the grind?”</i> he suggests with a smirk, hands gripping your hips as he slowly moves you off of his shaft and closer to his maw. Realizing what he has in mind, smirking back, you wriggle a little to help him bring your dick into reach of his mouth.", parse);
			Text.NL();
			Text.Add("Cale wastes no time and engulfs your cock, quickly lathering it with saliva before pulling out and nosing your [cockTip] while his tongue laps at the underside. Tingles race up your spine, your lips pouting in a soft moan as your already sensitive flesh responds to his tender licks and suckles. In your state, he has you at half-mast within moments, your dick throbbing in time with your heartbeat as it rests against his flexible organ.", parse);
			Text.NL();
			if(player.HasBalls()) {
				Text.Add("He moves under your [cocks] to lap at your [balls], sucking on them until they’re nice and plump. Then he moves back to your [cock], returning to his mission.", parse);
				Text.NL();
			}
			parse["sh"] = player.Genitalia().Sheath() ? "your sheath" : "the base of your cock";
			Text.Add("Cale nuzzles your [cock] amorously, kissing [sh] in the process. Under such treatment, it doesn’t take long for your erection to become as hard as it can get, throbbing and ready for some Wolfie ass. <i>“Now ain’t that a sight for sore eyes?”</i> Cale chuckles.", parse);
			Text.NL();
			Text.Add("You simply grin back, happy to let Cale make his bad jokes when you know what’s coming to you. Besides, you have to agree with him a little anyway.", parse);
			Text.NL();
			parse["legs"] = player.LowerBodyType() != LowerBodyType.Single ? "legs are spread and your " : "";
			Text.Add("<i>“A’ight, let’s get down to business.”</i> He maneuvers you off him and seats you on the [log], ensuring your [legs][cock] is in plain sight. He saunters up to you and aligns you with his needy boypussy. He grins at you expectantly, daring you to take the next step. Certainly not one to back away from this challenge, you grab his hips for leverage and roughly pull him down, plunging your cock into the wolf’s greedy ass in a single swift, powerful thrust.", parse);
			Text.NL();
			
			Scenes.Cale.SexCaleButtslutEntrypoint(cocksInAss, outside);
		}, 1.0, function() { return cale.Slut() >= 60 && cocksInAss.length > 0; });
	}
	
	scenes.Get();
}

Scenes.Cale.SexCaleShowerEntrypoint = function(outside) {
	var parse = {
		log        : outside ? "log" : "bedroll",
		playername : player.name
	};
	parse = player.ParserTags(parse);
	
	if(player.SubDom() > 0)
		Text.Add("Hey! You’re not done yet! What the hell is he doing?", parse);
	else
		Text.Add("You whimper in protest, asking what’s going on; why did he take his sweet, fat dick out of your needy hole?", parse);
	Text.NL();
	Text.Add("<i>“Just feel like showering you with my appreciation, [playername]. Plus you’ve got a really nice butt,”</i> he slaps your ass. <i>“Can ya blame me for wanting to take it for a spin?”</i>", parse);
	Text.NL();
	parse["t"] = player.HasTail() ? Text.Parse("[tail], ", parse) : "";
	parse["wing"] = player.HasWings() ? Text.Parse("[wings], ", parse) : "";
	Text.Add("Before you can answer that, the wolf-morph shudders, and cums right then and there. Jets of hot lupine jism raining down upon your back, splattering your [t][wing][hair], and your butt. Cale pumps in-between your butt cheeks a few times more and showers you with a fresh batch. The process continues until he’s spent and you’re absolutely plastered in white wolf sperm.", parse);
	Text.NL();
	Text.Add("<i>“Hehe, that’s a nice look for you,”</i> Cale comments, leaning back against the [log] to rest. <i>“You’re now officially marked as my territory.”</i>", parse);
	Text.NL();
	if(player.SubDom() >= 35)
		Text.Add("You bite back an indignant growl; give the cocky bastard an inch and he takes a mile. No point complaining over spilt cum, though. You’ll just have to show him who belongs to who next time...", parse);
	else if(player.SubDom() >= -25)
		Text.Add("You roll your eyes sarcastically. You’d be lying if you said it completely bothered you to get marked this way, but still, you can’t shake the feeling Cale might be starting to get a little big for his proverbial boots...", parse);
	else
		Text.Add("You smile happily, shifting slightly to better let the semen on your back flow down your sides and properly coat your [skin]. You feel quite content to let a stud like Cale mark you as his own; this is what you were meant for, after all.", parse);
	Text.NL();
	Text.Add("<i>“That sure hit the spot,”</i> Cale chuckles, leaning onto the [log] for a quick rest. ", parse);
	if(cale.Slut() >= 60)
		Text.Add("<i>“Just remember to return the favor sometime. My ass is aching for a decent fuck, and I could use a bath of my own.”</i> He gives you a gentle slap on your [butt].", parse);
	else if(cale.Slut() >= 30)
		Text.Add("<i>“How’d you enjoy your bath? Feels good, doesn’t it? I heard it was good for your skin,”</i> Cale teases, chuckling.", parse);
	else
		Text.Add("<i>“You’re my territory now, so I expect to see you around more often. Don’t be a stranger now,”</i> he teases.", parse);
	Text.NL();
	Text.Add("You toss an idle quip back to him, even as you grab your gear. After a moment’s recollection, you head for the nearest stream, intending to clean yourself up before getting dressed.", parse);
	Text.Flush();
	
	cale.relation.IncreaseStat(100, 3);
	world.TimeStep({hour : 1, minute : 30});
	
	Gui.NextPrompt();
}

Scenes.Cale.SexCaleCleanCockEntrypoint = function(cock, outside) {
	var parse = {
		
	};
	parse = player.ParserTags(parse, "", cock);
	
	Text.Add("<i>“Hey, let me take care of that for you,”</i> he points at your messy belly and chest. <i>“No sense letting good seed go to waste, right?”</i> he licks his lips.", parse);
	Text.NL();
	Text.Add("No, there most certainly isn’t, you agree, grinning as you lean back to better let him have access to the mess he made.", parse);
	Text.NL();
	Text.Add("Cale immediately sets to work, starting off by cleaning your belly. He laps along your navel, playfully teasing you by inserting his tongue into your belly button. Then he moves upward, licking your [breasts] of their fine layer of wolf-cum.", parse);
	if(player.Lactation())
		Text.Add(" 'Course, being the cocky bastard he is, he just can’t resist getting a taste of your nutritious milk along the way. <i>“What? You keep them on display,”</i> he grins.", parse);
	Text.NL();
	Text.Add("As soon as he’s done, he moves to lick your [cock]. <i>“Some tasty meat for the big, bad wolf,”</i> he quips.", parse);
	Text.NL();
	Text.Add("You roll your eyes at the cheesy pun, noting to yourself that he certainly wasn’t so bad earlier.", parse);
	Text.NL();
	Text.Add("He licks the entirety of your shaft clean", parse);
	if(player.HasBalls())
		Text.Add(", even making a detour to suck on your [balls]", parse);
	Text.Add(". Not satisfied, he immediately moves to kiss your [cockTip], stimulating your urethra with his tongue and drawing just a tiny bit of extra cum. <i>“Oy! You were holding out of me? That’s not cool!”</i> he playfully chides you.", parse);
	Text.NL();
	Text.Add("Looks like you both missed that bit. You’ll just have to try harder next time.", parse);
	Text.NL();
	Text.Add("He simply chuckles at your reply and gives your cock a parting kiss. <i>“Cale’s seal of approval, good for another run.”</i> He flicks your shaft, letting it sway before his eyes.", parse);
	Text.NL();
	Text.Add("You smirk at him and then pat him on the head, playfully calling him a <i>“good boy.”</i>", parse);
	Text.NL();
	Text.Add("Cale chuckles before replying, <i>“Woof, woof. Where’s my treat?”</i>", parse);
	Text.NL();
	Text.Add("Grinning, you point out he just had one. But maybe you’ll give him another one later.", parse);
	Text.NL();
	Text.Add("He whines playfully, but acquiesces. <i>“Alright, I’ll hold you to that. Don’t be a stranger,”</i> he replies, gathering his own clothes.", parse);
}

Scenes.Cale.SexCaleButtslutEntrypoint = function(cocks, outside) {
	var p1cock = player.BiggestCock(cocks);
	var knotted = p1cock.knot != 0;
	
	var parse = {
		log        : outside ? "log" : "bedroll",
		playername : player.name
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Text.Add("<i>“Hehe, I knew you’d come around. Now, why don’t you relax and let me milk your cock[s] of all its tasty spunk? Not that you have to restrain yourself, I like it rough,”</i> he grins.", parse);
	Text.NL();
	Text.Add("Sounds good to you, and your [hand]s slide down Cale’s back so you can squeeze his ass cheeks appreciatively, one hand moving to stroke the base of his tail.", parse);
	Text.NL();
	Text.Add("Cale’s legs bulge with exertion as he flexes them in order to rise, letting his quivering sphincter deform around the contour of your [cock]. As soon as only your head remains embedded in his slutty ass Cale stops, there is a brief delay as he lets gravity take over to impale himself back on your flesh pole with a wet squelch. His anal juices cover your shaft with his hot excitement, his trained butt contracts powerfully, giving the impression he’s sucking you in. Cale only stops his descent when he reaches ", parse);
	if(knotted)
		Text.Add("your knot, already fully inflated and ready to tie your bitch.", parse);
	else
		Text.Add("the base of your cock, having nothing more to take inside himself.", parse);
	Text.NL();
	Text.Add("As he stops with a resounding wet slap, you watch his own shaft bobbing to plop wetly against your belly. Some of his wolfy pre leaves an imprint of his tip on your [skin].", parse);
	Text.NL();
	Text.Add("You’d have to be a fool to deny Cale’s considerable charms when he decides he wants to be the good cockhungry slut you trained him to be. As great as it feels to have him wrapped around your meat, you can’t simply sit back and let him do it all himself. If he wants to be a proper bitch-boy and take it rough, who are you to deny him?", parse);
	Text.NL();
	Text.Add("Sitting up, you wrap your arms around his neck to hold him in place for a wet, rough kiss, bluntly thrusting your [tongue] through his lips to dance and tangle with his own broad, flat tongue. Noisily, you slurp and moan into each other’s mouths before he breaks the lip-lock with a gasp.", parse);
	Text.NL();
	Text.Add("Playfully, your head moves to the crook of his neck and you give him a gentle bite, the wolf shuddering in your arms at the gesture. He starts to lift himself back up off of your cock, and you use the motion to help you plant a trail of soft kisses down his neck and over his broad chest until you are level with the exposed pink nub of his nipple. Your tongue playfully flicks out, trailing circles around its expanse before you carefully close your teeth on it in a pleasure-inducing nip that makes him quake.", parse);
	Text.NL();
	Text.Add("You feel his legs giving out and release your grip on his nipple, hands moving to his hips and pushing down, the combined momentum allowing you to roughly shove yourself inside of Cale’s ass ", parse);
	if(knotted)
		Text.Add("until your knot nearly pops in.", parse);
	else
		Text.Add("as deep as you can.", parse);
	Text.Add(" He moans like a whore, and your hands move to his thighs, lifting at him, coaxing him to rise again until you shove him back down again as hard and fast as before. Cale practically sings in his pleasure as you hammer him up and down upon your dick, rutting the lupine buttslut until you can feel the tension boiling up inside of you. You’re going to blow any moment now; you can feel your [cock] throbbing madly with the need to cum, your breathing coming quicker and harder as it grows and builds within...", parse);
	Text.NL();
	Text.Add("<i>“Yeah! Give it to me, give it to me good, [playername]! Mate me like a bitch in heat!”</i> he shamelessly begs.", parse);
	Text.NL();
	Text.Add("Like you need the encouragement, pounding the wolf’s butt for all you can, increasingly consumed by your need for release.", parse);
	if(knotted)
		Text.Add(" You dimly feel your knot grinding against his tight ring and realize you need to decide what to do with it before you blow your load.", parse);
	Text.Flush();
	
	var slut = outside ? 4 : 3;
	var max = (cale.flags["Met2"] >= Cale.Met2.Goop) ? 100 : 50;
	
	//[Tie Him][Nah]
	var options = new Array();
	if(knotted) {
		options.push({ nameStr : "Tie Him",
			func : function() {
				Text.Clear();
				Text.Add("With a roar of effort, you drive Cale and your cock together as hard as you possibly can, jamming the swollen bulb of your flesh through his tight boypussy until he is wedged against you. The feel of his flesh enveloping your knot, grinding it fit to burst, is the last straw for you; you are barely aware of Cale’s cries of pleasure, or the warm semen splattering over your chest and running down your [skin] as your own seed erupts inside of him.", parse);
				Text.NL();
				
				var cum = player.OrgasmCum();
				
				if(cum > 6) {
					Text.Add("Like a perverse fountain, your cock explodes, sending a veritable tsunami of semen coursing through Cale’s bowels and into his stomach. With your knot wedged inside of him like it is, what little leaks out is literally a few drips in comparison. His belly bloats outward, like a pregnancy on fast forward, the wolf moaning and shuddering as his skin stretches around his titanic liquid suppository.", parse);
					Text.NL();
					Text.Add("By the time you finally - blessedly - finish, Cale looks ready to drop a whole litter of full-grown pups of his own, rivulets of semen seeping around the ring and running down your [thighs], but unnoticeable by comparison.", parse);
					Text.NL();
					Text.Add("<i>“Yesh, letsh have lots of puppiesh, honey,”</i> he says, drunk with pleasure. Then he promptly passes out. You chuckle at his reaction as you get yourself comfortable to wait for your knot to deflate.", parse);
				}
				else if(cum > 3) {
					Text.Add("A titanic torrent of semen floods Cale’s guts, your knot ensuring not a single drop of it escapes from inside of him. With nowhere else to go, it crams itself relentlessly into his stomach, which swells before your very eyes into an almost pregnant-looking swell. By the time you are finished, it bulges blatantly between you, almost pushing you both apart with its considerable girth.", parse);
					Text.NL();
					Text.Add("<i>“Ah, yes… That hit the spot. Thanks a lot, [playername].”</i>", parse);
					Text.NL();
					Text.Add("It was no problems, you assure him; indeed, it was most definitely your pleasure.", parse);
					Text.NL();
					Text.Add("<i>“Y’can come to me whenever you feel like yer gettin case of blue balls and I’ll be happy to milk ‘em for ya. Now if ye’ll excuse me, I’m gonna take a nap.”</i> He nuzzles you and just like that, he’s out like a light.", parse);
					Text.NL();
					Text.Add("You chuckle and playfully rub his ears like the overgrown puppy he resembles before settling back and making yourself comfortable as you wait for your knot to shrink down again.", parse);
				}
				else {
					Text.Add("Cale’s belly almost visibly bulges from the size of your deposit inside of him, every last warm drop locked away inside of him by your knot.", parse);
					Text.NL();
					Text.Add("<i>“Yeah… Fuck, I was really aching for a good shag. Thanks for the treat, [playername].”</i>", parse);
					Text.NL();
					Text.Add("It was your pleasure, you assure him.", parse);
					Text.NL();
					Text.Add("<i>“Really ‘preciate your efforts. But I’m feeling a little worn out. D’you mind if I rest my eyes for a moment?”</i>", parse);
					Text.NL();
					Text.Add("Of course you don’t mind, and you quickly tell him so.", parse);
					Text.NL();
					parse["b"] = player.HasBalls() ? " balls deep" : "";
					Text.Add("<i>“Thanks.”</i> He nuzzles you and closes his eyes, his breathing stabilizing as he falls asleep with your cock still buried[b] inside him.", parse);
					Text.NL();
					Text.Add("You can’t help but smile; that’s Cale for you, alright. Shifting him to be a little more comfortable against you, you try to shuffle a little to make yourself more comfortable as well. It's going to take a while for your knot to deflate, after all.", parse);
				}
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("It takes the better part of an hour till your knot’s shrunk down enough to let you unplug Cale’s ass. By then, the wolf’s already woken up.", parse);
					Text.NL();
					
					Scenes.Cale.SexCaleCleanCockEntrypoint(p1cock, outside);
					
					Text.Flush();
					
					cale.relation.IncreaseStat(100, 4);
					
					cale.slut.IncreaseStat(max, slut);
					
					world.TimeStep({hour : 2});
					
					Gui.NextPrompt();
				});
			}, enabled : true,
			tooltip : "He’s your bitch, treat him as such and give him what he’s begging for."
		});
	}
	options.push({ nameStr : "Nah",
		func : function() {
			Text.Clear();
			Text.Add("You thrust into Cale’s colon as deeply as you can, the two of you crying out in mutual pleasure as your limits are breached and the both of you climax in unison. Cale’s seed sprays across your stomach and [breasts], trickling strands of off-white running down your [skin], even as your cum floods inside of his ass.", parse);
			Text.NL();
			
			var cum = player.OrgasmCum();
			
			if(cum > 6) {
				Text.Add("Veritable rivers of semen spurt out around the imperfect seal of your cock, but such is the sheer cascade of your spooge flooding inside of Cale that his stomach still begins to grow and grow, ballooning out into a pregnant-looking swell. Even after your member finally goes slack, allowing sperm to pour freely between his thighs, he can’t drain fast enough to shrink his new gut.", parse);
				Text.NL();
				Text.Add("<i>“Hehe, someone had a serious case of blue balls… or was it just that good?”</i> he teases.", parse);
				Text.NL();
				Text.Add("Maybe a little from column A and a little from column B, you quip right back, tapping him playfully on his newly expanded stomach.", parse);
			}
			else if(cum > 3) {
				Text.Add("Thick ropes of semen pour into Cale’s stomach, swelling his gut out into a blatant potbelly. Though some of your seed is drawn back down by gravity, oozing sluggishly around the ring of his ass, most of it floods inside of him, leaving him with a nicely pregnant-looking bulge by the time you finish.", parse);
				Text.NL();
				Text.Add("<i>“Ah, nice and sloppy. Just the way I like it,”</i> he grins, gripping your cock with his sphincter.", parse);
				Text.NL();
				Text.Add("You’re glad he approves; you like it nice and sloppy as well, after all.", parse);
			}
			else {
				Text.Add("Your efforts paint Cale’s boypussy with thick, sloppy semen, leaving him nice and goopy with your seed as it rolls and squishes delightfully with each motion either of you make.", parse);
				Text.NL();
				Text.Add("<i>“Hmm, yeah… good enough for round one,”</i> he teases.", parse);
				Text.NL();
				Text.Add("If he’ll give you a moment to catch your breath, you’ll see about round two, you promptly shoot back.", parse);
			}
			
			Text.NL();
			
			Scenes.Cale.SexCaleCleanCockEntrypoint(p1cock, outside);
			
			Text.Flush();
			
			cale.relation.IncreaseStat(100, 3);
			
			cale.slut.IncreaseStat(max, slut);
			
			world.TimeStep({hour : 1});
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "You don’t feel like being glued to Cale’s boypussy right now, so just finish."
	});
	if(options.length > 1)
		Gui.SetButtonsFromList(options, false, null);
	else
		Gui.NextPrompt(options[0].func);
}

Scenes.Cale.SexCatchAnal = function(outside) {
	var parse = {
		log : outside ? "log" : "bedroll",
		playername : player.name
	};
	parse = player.ParserTags(parse);
	
	Text.Clear();
	Text.Add("<i>“It’d be my pleasure,”</i> he says, wagging his tail.", parse);
	Text.NL();
	Text.Add("You start out by approaching him and deftly sticking your hand inside his pants to fondle his rapidly filling sheath and balls. <i>“You got me!”</i> he says jokingly. You simply roll your eyes and begin to undo his garments. He just looks at you with a smile, fumbling with his top. In no time at all, the sound of rustling clothes is pointed by the sound of said clothes hitting the ground, and you’re left to look at the athletic wolf in all his naked glory.", parse);
	Text.NL();
	Text.Add("Orange eyes glitter with amusement as he watches you, lips curved in a wolfish grin. His lupine ears flick atop his head in visible impatience, tail wagging over a toned butt. Though his body is covered in dark fur, it isn't dense enough to stop you from making out that he has a trim build: solid and graceful, with some visible muscle, but not swollen and hulking - a runner, more than a weightlifter. Jutting between his legs, his nine inches of wolf-cock practically throbs before your eyes, eager to be buried inside of you.", parse);
	Text.NL();
	Text.Add("Putting an end to your scrutiny, Cale moves to work on your [botarmor] himself. You don’t wait to get started on your top, shrugging out of your clothes in record speed. Cale loops an arm around your lower back and motions to the [log]. His intentions clear, you bend over and await the wolf’s next move.", parse);
	Text.NL();
	Text.Add("<i>“Let’s prep you first. I dunno 'bout you, but I’m not a fan of painful intrusions.”</i> He moves to his discarded top, fumbling about with a pouch to draw a small vial containing what look to be a clear gel.", parse);
	Text.NL();
	Text.Add("You shiver unconsciously as the cool gel oozes over your flesh, tingling against the skin as he applies it. Once he judges the amount sufficient, an expert digit moves to massage the lube into your [anus], slow and deliberate motions stirring it around and around. Once he judges your ring has been sufficiently coated, he starts to work his way inside your pucker with a fingertip, thrusting in and out with the same tantalizing purposefulness. Slowly, he adds a second finger, pumping them deeper inside of you as he does. Blissfully, he adds a third, painstakingly reaming your ass with all three.", parse);
	Text.NL();
	Text.Add("<i>“How ya doing up there? Feel ready yet?”</i> he asks continuing to pump his three fingers inside you.", parse);
	Text.NL();
	if(player.Slut() >= 60)
		Text.Add("You arch your back and moan in desire, too incoherent with pleasure and anticipation to think of anything more meaningful. Damn, you can't wait for him to get those fingers out and put something more satisfying inside you!", parse);
	else if(player.Slut() >= 30)
		Text.Add("You shudder in pleasure, eyes fluttering unconsciously as he massages your innards, dreamily assuring him that you feel ready for him.", parse);
	else
		Text.Add("Trembling with a cocktail of emotions you can't describe, you slowly confirm that you're ready as you're going to get.", parse);
	Text.NL();
	Text.Add("<i>“Alright, let’s get down to business then.”</i> Cale moves to mount you, aligning his canine pecker with your [anus] and gently prodding your entrance. <i>“Hey, [playername]?”</i>", parse);
	Text.NL();
	if(cale.flags["sneakAtk"] < 5) {
		Text.Add("Yes? What is it?", parse);
		Text.NL();
		parse["gen"] = player.HasBalls() ? "own" :
		               player.FirstVag() ? player.FirstVag().Short() :
		               player.ThighsDesc();
		Text.Add("<i>“Sneak Attack!”</i> he yells, shoving all his nine inches inside you in at once, stopping only when you feel his balls slap noisily against your [gen].", parse);
	}
	else if(cale.flags["sneakAtk"] == 5) {
		Text.Add("Ugh, not again. You roll your eyes in contempt and cut him off, telling him to drop the stupid ‘sneak attack’ joke, it's really gotten old. Just stick his dick in your ass and let's get down to what you're both here for.", parse);
		Text.NL();
		Text.Add("<i>“Aw, you’re no fun,”</i> he protests weakly, but complies. After some minor adjusting, he spears himself into you, all nine inches, until he’s balls deep inside your [anus].", parse);
	}
	else {
		Text.Add("<i>“Here I come~”</i> He thrusts into you, burying all of his nine inch wolfhood balls deep into your rectum.", parse);
	}
	cale.flags["sneakAtk"]++;
	
	Text.NL();
	
	Scenes.Cale.SexCatchAnalEntrypoint(outside);
}

Scenes.Cale.SexCatchAnalEntrypoint = function(outside, fromVag) {
	var cocksInAss = player.CocksThatFit(cale.Butt(), true);
	
	var parse = {
		log : outside ? "log" : "bedroll",
		playername    : player.name
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Text.Add("You cry out as the wolf's cock so forcibly spears inside of you without hesitation. In seconds, he’s briskly thrusting back and forth, pumping away at your ass with every ounce of enjoyment, roughly pistoning your [anus] like a man possessed.", parse);
	Text.NL();

	Sex.Anal(cale, player);
	player.FuckAnal(player.Butt(), cale.FirstCock(), 3);
	cale.Fuck(cale.FirstCock(), 3);

	if(outside)
		Scenes.Cale.SexGettingFuckedOutsideComments();

	parse["w"] = player.HasWings() ? Text.Parse(" being careful with your [wings],", parse) : "";
	parse["p"] = player.FirstCock() ? ", including your prostate" : "";
	Text.Add("Cale bends over your back,[w] as he hugs your from behind. His position is reminiscent of a wolf mounting his bitch, a detail that probably passes him by as he’s too busy thrusting away into your ass. The position does allow him to go a bit deeper than before and though erratic, his thrusts manage to hit all the right spots inside you[p].", parse);
	Text.NL();
	Text.Add("You groan and growl, deep and low, in your throat as you feel him gyrating and grinding against your inner walls; he’s rough - but in a good way. Stirred by his efforts, you shift yourself around slightly, allowing you to start meeting his humping with backwards bucks of your own, swallowing each thrusting of his cock with eager ease. Even in your increasingly addled state, you’re aware of the thick, swollen girth of his excited knot as it sometimes forces its way inside of you, stretching you a few delicious extra inches when it does.", parse);
	Text.NL();
	Text.Add("<i>“So tight and hot…”</i> you hear Cale comment, his pumping slowly becoming a bit more well paced. Now that you’re actively fucking him back, he doesn’t feel the need to be so… desperate in his taking of your [anus]. Short strokes become long ones, and with each synced thrust and buck, the resulting impact sends ripples along your [butt]. His knot has inflated enough that he can’t just idly push it inside you anymore, and you can feel its girth whenever Cale grinds into your butt. It feels like he might push in at a moment’s notice, but he always withdraws in the last second.", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“Hey, [playername]. You ready for this?”</i> he asks, grinding against your [anus] so you can feel his inflated knot. <i>“So how about it? Can you take all that Cale has to offer,”</i> he pants, waiting for your reply.", parse);
		Text.NL();
		Text.Add("You realize he’s giving you the final say; you better make a decision quickly...", parse);
		Text.Flush();
		
		//[Yes][No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				Text.Clear();
				Text.Add("Rather than waste time with words, you let your body do the talking, grinding back against Cale’s hips as best you can from your present position. You will your clenching asshole to open further, stretching yourself out with each inch you force yourself back over Cale’s bulging knot. Gritting your teeth from the effort, you strain with all your might, crying out in triumph as you finally force him inside of you to the hilt, anchoring him within your ass.", parse);
				Text.NL();
				Text.Add("<i>“Knew you had it in you,”</i> he chuckles, switching from his long thrusts to smaller one as his knot stirs your insides. It doesn’t take long before he tightens his grip on your flanks and howls. The distinct warmth of Cale’s hot seed floods your insides as the wolf orgasms.", parse);
				Text.NL();
				
				Scenes.Cale.Impregnate(player, PregnancyHandler.Slot.Butt, 4);
				
				var cum = player.OrgasmCum();
				
				Text.Add("Even as Cale’s seed gushes inside of you, your own limit is reached and you cry out, echoing the wolf-morph’s howl of ecstasy as your own body quakes and shudders with orgasm.", parse);
				if(player.FirstCock()) {
					parse["cum"] = cum > 6 ? "flooding" :
					               cum > 3 ? "pooling" :
					               "spattering";
					Text.Add(" Your sperm splashes onto the earth below you, [cum] where it lands and filling the air with its distinctive musk.", parse);
				}
				if(player.FirstVag()) {
					Text.Add(" Your womanhood drools its nectar down your [legs], soaking into the thirsty ground below.", parse);
				}
				Text.NL();
				Text.Add("Cale’s seed continues its assault, plowing deep inside you to settle in your belly. With nowhere to go, all of it winds up inside you. You can feel his liquid burden stretching your stomach, slowly inflating you as his powerful jets are reduced to a faint trickle. <i>“F-fuck. That’s one sweet ass you got there, [playername]. My balls are even sore now,”</i> he chuckles.", parse);
				Text.NL();
				Text.Add("Like he didn’t enjoy every moment of it, you smirk to yourself. You wriggle a little to better adjust to your new weight, confirming that you are well and truly stuck to his crotch.", parse);
				Text.NL();
				Text.Add("<i>“It’ll be a while before I can let ya go, so let’s get ya in a more comfortable position.”</i> The wolf grabs you around your waist, just below the paunch his seed’s given you and hauls you up into a sitting position on his lap. The motions send the liquid inside you sloshing, and you react by tightening your sphincter around his knot. Cale spurts a fresh rope of wolf-seed in reply.", parse);
				Text.NL();
				Text.Add("You grunt a little at the treatment, your [legs] wobbling a little, but manage to shift in Cale’s lap to find a position that you feel comfortable in. That done, you settle back against his furry chest and allow yourself to relax.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("It takes the better part of an hour for his knot to deflate, a time that he spent being nothing but gentlemanly. Although he’s shrunk enough that he could pull out, he’s too engrossed in his current task to actually do so. The wolf is busy grooming you with licks around your collarbone, drinking in the sweat resulting of your taking.", parse);
					Text.NL();
					Text.Add("Sighing softly, you tell him that as enjoyable as this is, you can’t stay here forever; there’s things you need to do. You allow him a last cuddle and then, once he’s let you go, you pull yourself free of his lap. Naturally, without his cock plugging your ass anymore, a cascade of semen falls down your [legs] and splatters messily over his own crotch before you manage to close your asshole again, but he doesn’t seem to care in the slightest.", parse);
					Text.NL();
					Text.Add("<i>“Y’know where to find me - anytime you need,”</i> he says with a cocky smile, waving you away as he leans back against the [log], enjoying his afterglow too much to even bother putting his clothes back for now.", parse);
					Text.NL();
					Text.Add("You finish cleaning yourself off as best you can, then grab your [armor] and get dressed again before leaving the happy wolf-morph to his relaxation.", parse);
					Text.Flush();
					
					cale.relation.IncreaseStat(100, 4);
					world.TimeStep({hour : 2});
					
					Gui.NextPrompt();
				});
			}, enabled : true,
			tooltip : "You can take anything he can throw at you!"
		});
		options.push({ nameStr : "No",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Aw, too bad. But it’s alright, I still got a lot. To. Give. You,”</i> he says, punctuating each word with a rough thrust.", parse);
				Text.NL();
				Text.Add("You groan wordlessly, clenching down against his shaft. He’s picked up his pace to the speed he was using when you began, reaming you hard and fast as he can. You quake and heave, bucking beneath him; you can’t take much more of this...", parse);
				Text.NL();
				Text.Add("With one last push, Cale hilts himself inside you, or as far as he can without pushing his fat knot inside you. He howls and you feel the distinct warmth of his wolf seed painting the walls of your abused ass.", parse);
				Text.NL();
				
				Scenes.Cale.Impregnate(player, PregnancyHandler.Slot.Butt, 2);
				
				Text.Add("That’s the last straw for you as well; you sing out as if in counterpoint to his howl of ecstasy as pleasure surges through your body.", parse);
				if(player.FirstCock())
					Text.Add(" Your [cocks] erupt[notS] in climax, painting the ground beneath you with your seed.", parse);
				if(player.FirstVag())
					Text.Add(" Your neglected womanhood rains down juices, smearing your [thighs] before splattering onto the earth below.", parse);
				Text.NL();
				
				var cum = player.OrgasmCum();
				
				Text.Add("Without his knot to hold the seed in, most of it winds up leaking around the seal of your ass, splattering your butt with white. Only when the jets are reduced to a trickle does Cale pull away, sputtering a couple weak ropes onto your [butt]. <i>“Ah, that hit the spot. Too bad y’ wouldn’t let me tie,”</i> he says, panting as he sits down beside you and leans on the [log].", parse);
				Text.NL();
				Text.Add("You simply pant, regaining your strength. Once you can move again, you gather your gear and thank Cale for the nice time, already absently looking for a place to properly clean yourself up.", parse);
				Text.NL();
				Text.Add("<i>“You’re welcome; if you want any more, y’know where to find me,”</i> he grins, waving you away.", parse);
				Text.Flush();
				
				cale.relation.IncreaseStat(100, 3);
				world.TimeStep({hour : 1});
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "He can just forget about shoving that knot up your ass!"
		});
		Gui.SetButtonsFromList(options, false, null);
	}, 1.0, function() { return true; });
	
	if(fromVag == null) {
		scenes.AddEnc(function() {
			Text.Add("You find yourself growling in frustration, so close to the edge that you can nearly taste it. As Cale pulls his hips back again, you find him suddenly withdrawing his cock out entirely, leaving your [anus] squeezing in vain on empty air and you asking what’s wrong - doesn’t he want to finish this?", parse);
			Text.NL();
			Text.Add("<i>“Don’t worry, I wanna get off as much as ya do - just thought I’d mix things up a bit.”</i>", parse);
			Text.NL();
			Text.Add("Twisting around to look back over your shoulder at him, you raise an eyebrow and ask what he has in mind.", parse);
			Text.NL();
			if(cale.Slut() >= 60 && player.FirstCock())
				Text.Add("<i>“Normally, I’d home in on [thisThese] juicy cock[s] of yours,”</i> he says, giving your [cocks] an appreciative stroke. <i>“But this time, I think I’ll try this bit.”</i> He runs a finger along the moist slit of your [vag].", parse);
			else
				Text.Add("<i>“Well, you got such a pretty pussy down here,”</i> he runs a finger along your moist slit, <i>“that I can’t help but want to give it a shot. So I’mma do just that.”</i> He grins.", parse);
			Text.NL();
			Text.Add("A shiver of appreciation races down your spine at his touch, and you find yourself grinning wickedly. Well, if that’s what he has in mind, why say no? But you think this requires a more... delicate touch.", parse);
			Text.NL();
			Text.Add("You push yourself upright, whirling around to face the startled wolf before pulling him into a possessive kiss, authoritatively thrusting your [tongue] in between his lips and molesting his mouth. His legs slacken at your surprise burst of aggressiveness, and so he offers no resistance as you gently spin him around so that your positions are reversed.", parse);
			Text.NL();
			parse["br"] = player.FirstBreastRow().Size() >= 5 ? ", smothering him in your cleavage" : "";
			parse["c"] = player.FirstCock() ? Text.Parse(", your hard [cocks] rubbing against his belly", parse) : "";
			Text.Add("Your hands reach for his shoulders and you push down, firmly and insistently, sending him thumping softly to the ground below. You break the kiss at last, leaving him panting for breath, and close the distance between you by straddling him, arms pulling his face against your [breasts][br][c]. You slide downwards until you can feel your [vag] in proper alignment with his straining wolfhood, smirking as you look into his eyes. Cale licks his lips, eager to begin.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Scenes.Cale.SexCatchVagEntrypoint(outside, true);
			});
		}, 1.0, function() { return player.FirstVag(); });
		
		scenes.AddEnc(function() {
			Text.Add("Without so much as a warning, Cale pulls out of your abused ass and nests his knotty wolf-pecker between the cheeks of your [butt]. He presses them together as he fucks your ass cleavage, rubbing his length against your rosebud.", parse);
			Text.NL();
			
			Scenes.Cale.SexCaleShowerEntrypoint(outside);
		}, 1.0, function() { return true; });
		
		scenes.AddEnc(function() {
			Text.Add("<i>“Hey, [playername]?”</i>", parse);
			Text.NL();
			Text.Add("You give Cale an idle grunt of acknowledgement back, more concerned with the feeling of his lupine fuckmeat plowing your asshole.", parse);
			Text.NL();
			Text.Add("<i>“No offense, but I really need this.”</i>", parse);
			Text.NL();
			Text.Add("That statement is enough to make you blink in surprise. You open your mouth, intending to ask him what he means, but all that escapes you is a drawn-out blissful moan as he smoothly extracts himself from you. This gives way to a surprised grunt when he suddenly grabs you by the hips and spins you around, leaving you sitting back against the [log] you were previously leaning over. You shake your head, but any attempt to gather your thoughts are cut off when Cale, having moved to squat over you, suddenly drops ass-first into your lap, audibly squelching wetly as[oneof] your [cocks] plunges meatily into the well-trained tailhole of your lupine buttslut.", parse);
			Text.NL();
			Text.Add("<i>“Yes! This is the best. Nothing quite like a hard cock to plug up my needy behind.”</i>", parse);
			Text.NL();
			Text.Add("Groaning softly as Cale’s not inconsiderable weight smacks into your belly, you can’t resist commenting that this certainly wasn’t what you expected when you offered to let him fuck your ass instead.", parse);
			Text.NL();
			Text.Add("<i>“Hey, for one, it’s your fault for making me like this. Second, did you really think I wouldn’t notice [thisThese] juicy cock[s] of yours bouncing down below as I took you? Finally, don’t act like you don’t like Cale’s butt,”</i> he teases.", parse);
			Text.NL();
			Text.Add("Reaching your arms around Cale’s waist, you pull him closer, allowing you to nuzzle your face into the crook of his neck. No, you certainly can’t say that you don’t like his butt... his tight, soft, wet, welcoming butt! You buck your hips rhythmically, punctuating each descriptive word with a powerful thrust of your own shaft into Cale’s ass, feeling the slut grip and squeeze you with each motion you make.", parse);
			Text.NL();
			
			Scenes.Cale.SexCaleButtslutEntrypoint(cocksInAss, outside);
		}, 1.0, function() { return cale.Slut() >= 60 && cocksInAss.length > 0; });
	}
	
	scenes.Get();
}

Scenes.Cale.SexGettingFuckedOutsideComments = function() {
	var parse = {
		
	};
	
	var scenes = new EncounterTable();
	/* TODO: Special
	scenes.AddEnc(function() {
		Text.Add("", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	*/
	scenes.AddEnc(function() {
		if(cale.flags["xedOut"] >= 15)
			Text.Add("By now, the sight of the two of you going at it is so commonplace that nobody casts so much as a glimpse your way.", parse);
		else if(cale.flags["xedOut"] >= 5)
			Text.Add("Though your actions still attract a few glances and stares, far more people ignore you than pay attention. It seems the novelty or shock value of your sexual escapades is wearing off.", parse);
		else
			Text.Add("You can hear a chorus of whispers, chuckles and comments as the sounds of your fucking draw the attention of others in the camp. You can feel the eyes wandering over your naked forms in a variety of expressions, from desire to appreciation, humor to disapproval, but if Cale feels the slightest shame in being a spectacle, he certainly doesn't let it slow him down.", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	cale.flags["xedOut"]++;
}


Scenes.Cale.SexFuckingHimOutsideComments = function(cock, opts) {
	var goopFirst = opts.goop;
	var cavalcade = opts.cavalcade;
	var cheat     = opts.cheat;
	
	var racescore = new RaceScore(rosalin.body);
	var compScore = rosalin.origRaceScore.Compare(racescore);
	
	var parse = {
		playername : player.name,
		racedesc       : function() { return rosalin.raceDesc(compScore); }
	};
	parse = rosalin.ParserPronouns(parse);
	parse = rosalin.ParserTags(parse, "r");
	parse = player.ParserTags(parse, "", cock);
	
	var breakpoint = false;
	
	if(goopFirst) {
		Text.Add("<i>“Sometimes, I amaze myself with my own genius. How’s your ass doing Cale?”</i> Rosalin asks curiously. The wolf doesn’t even react to [hisher] teasing, and even if he noticed he’s too busy moaning like a bitch in heat to reply anyway.", parse);
		Text.NL();
		Text.Add("<i>“That’s good,”</i> [heshe] says, fetching a notepad nearby and jotting down some notes. <i>“[playername], go a bit deeper, I want to see his reaction.”</i>", parse);
		Text.NL();
		Text.Add("You nod at [hisher] request. Not like you weren’t planning on doing so anyway. Drawing back your [cock] until only your [cockTip] remains planted inside the wolf’s quivering rosebud, you thrust inside with all your strength.", parse);
		Text.NL();
		Text.Add("Cale’s butt yields easily, practically sucking you in as your hips connect with his in a perverted slap. The wolf’s moans quickly devolve into a short howl as you feel his butt contracting all over your [cock], milking you for your seed in what you could only classify as an ass-gasm.", parse);
		Text.NL();
		Text.Add("<i>“Yeaaaah… do that again!”</i> Cale exclaims, panting in delirious pleasure.", parse);
		Text.NL();
		Text.Add("<i>“Good, very good. I need to do some further research,”</i> the [racedesc] says, absentmindedly patting Cale on the head as [heshe] walks away.", parse);
		Text.NL();
	}
	else if(cheat && cale.flags["cCheat"] == 0) {
		Text.Add("Some time during your friendly ‘talk’ with Cale, Rosalin wanders back to the campfire, settling down beside you and studying the wolf with some interest. Cale sputters indignantly when he notices [himher], but he’s hardly in a position to do anything about it.", parse);
		Text.NL();
		Text.Add("<i>“I was thinking, why was Estevan shuffling the deck so much during the card game?”</i> Rosalin muses, poking at the fire with a stick. <i>“Now that I think of it, I’m not even sure there <b>is</b> a card named ‘Stud of Light’.”</i>", parse);
		Text.NL();
		Text.Add("Cale looks over his shoulder accusingly, his heart sinking even further when you whistle innocently. Then again, how he got into his current position hardly matters at this point.", parse);
		Text.NL();
	}
	else if(cavalcade) {
		Text.Add("<i>“Nicely done, [playername],”</i> Estevan comments, grinning at the show you are providing.", parse);
		Text.NL();
		Text.Add("<i>“Should I prepare something to improve his stamina?”</i> Rosalin asks, a strange light shining in [hisher] eyes. Grinning wickedly, you shake your head and assure the [racedesc] that you know <i>just</i> how to really get him going...", parse);
		Text.NL();
		Text.Add("<i>“What a slut you are, Wolfie,”</i> the satyr hunter teases, unable to resist the opportunity to take Cale down a peg or two.", parse);
		Text.NL();
		if(cale.Slut() >= 60)
			Text.Add("<i>“Bet you’re just jealous you’re not getting any - ngh - action, goat-boy. Butt, cock or muzzle. Everyone wants a - haah - piece of Cale, while you’re stuck using your hands. Betcha those calluses y’got aren’t from using a bow.”</i>", parse);
		else if(cale.Slut() >= 30)
			Text.Add("<i>“Shut it, goat-boy. We all know what you’ll be - aahn! - jerking off to later in the evening. Take a good look and see how a real man - ngh - takes it.”</i> Cale grinds back against you for emphasis.", parse);
		else
			Text.Add("<i>“Better gloat while - ack! - y’can, goat-boy. We all know you can’t play for shit. And at least I’m man - ooh! - enough to honor my bets,”</i> Cale quips back indignantly.", parse);
		Text.NL();
		Text.Add("<i>“Watch that tongue, Wolfie,”</i> Estevan responds, unperturbed. <i>“Wag that mouth of yours too much and I might be tempted to fill it with something.”</i>", parse);
		Text.NL();
		if(cale.Slut() >= 60)
			Text.Add("<i>“Bring it, goat-boy. I’ll take pity on you and let you get some action!”</i> Cale sputters back with a smirk.", parse);
		else
			Text.Add("<i>“Hold yer horses, goat-boy! You ain’t even in the game, so keep your little goat dick in your pants,”</i> Cale shoots back.", parse);
		Text.NL();
		Text.Add("You won, so you are calling the shots here. Do you want to egg them on?", parse);
		Text.Flush();
		
		var first = (cale.flags["eBlow"] == 0);
		
		//[Hell yeah!][No]
		var options = new Array();
		options.push({ nameStr : "Hell yeah!",
			func : function() {
				cale.flags["eBlow"]++;
				
				Text.Clear();
				Text.Add("Smirking to yourself, you tell the satyr that if he wants to play with your wolf, you’ll give him the okay. Let’s see how well he can fill that smart mouth of Cale’s. Estevan, more than a little drunk at this point, doesn’t look like he’s about to complain.", parse);
				Text.NL();
				if(cale.Slut() >= 60)
					Text.Add("<i>“Alright, y’heard the boss, goat-boy. Get over here and whip out that little dick of yours, and let Cale show you how it’s done,”</i> the wolf says with a grin, licking his lips. ", parse);
				else if(cale.Slut() >= 30)
					Text.Add("<i>“Well, y’heard the boss, goat-boy. Lucky you,”</i> the wolf sticks his nose out, trying to look like he isn’t looking forward to some spit roasting.", parse);
				else
					Text.Add("<i>“Alright, but I’m only doing this because [playername] said so,”</i> the wolf glowers at the grinning satyr.", parse);
				Text.NL();
				if(first)
					Text.Add("<i>“It’ll be my pleasure,”</i>", parse);
				else
					Text.Add("<i>“Open wide, my slutty little friend, you have a returning customer,”</i>", parse);
				parse["first"] = first ? "he’s going to be privy to it very soon" : "he already has first hand experience of it";
				Text.Add("Estevan chuckles as he undoes his loincloth, releasing his rather impressive erection. Bigger than Cale’s, for sure, a fact that probably doesn’t slip the wolf by. If nothing else, [first]. Below it hangs a pair of large balls, swollen with seed.", parse);
				Text.NL();
				parse["reluctantly"] = cale.Slut() < 30 ? " reluctantly" : "";
				Text.Add("Cale[reluctantly] opens his maw and lets his broad tongue roll out. You resolve to simply slow down and appreciate the show before you resume giving Cale’s butt the treatment it deserves.", parse);
				Text.NL();
				Text.Add("Estevan wastes no time in taking the wolf’s invitation. He jams the first few inches in a single thrust, muffling a surprised yelp from the wolf. You grind against Cale’s butt, watching as Estevan grabs Cale’s scalp and pulls him toward himself. The wolf has no choice but to comply; at the same time his muzzle is impaled onto Estevan’s cock, his ass is drawn away from your [cock] until only the [cockTip] is left inside.", parse);
				Text.NL();
				Text.Add("You can’t be having that; your hands lock onto the wolf’s boyish hips and you pull backwards, firmly dragging his ass back down the length of your [cock]. The satyr catches on quickly, grinning as he throws himself into this new game. The poor wolf is pulled back and forth between you, helpless to stop either of you from ravaging his holes.", parse);
				Text.NL();
				Text.Add("<i>“Mmm, nice and tight! How is your end, [playername]?”</i> the satyr quips, scratching Cale behind the ear as one would a dog. ", parse);
				if(cale.Slut() >= 60)
					Text.Add("Tight and wet, as usual. You’ve marked Cale’s butt as your territory so many times that his ass is pretty much shaped to your [cock].", parse);
				else if(cale.Slut() >= 30)
					Text.Add("Nice and tight as well. Cale’s butt is familiar territory, and you know just how to push his buttons when you want him tighter or looser for the taking.", parse);
				else
					Text.Add("Bit too much on the tight side. This here’s an ass that hasn’t seen enough action yet. A fact you plan to rectify as soon as possible.", parse);
				Text.NL();
				Text.Add("<i>“Sounds like I’ll have to try it out later. Perhaps if I find him in one of my traps some day... You’d like that, wouldn’t you, doggie?”</i> Estevan grins down at his rival. Cale’s expression is a mixture of defiance, tinged with a touch of fear. The satyr is still his usual jovial self, but the look in his eyes suggests he isn’t joking.", parse);
				Text.NL();
				Text.Add("As long as he remembers that Cale is <i>your</i> bitch and brings him home in one piece, you’ve got no objections.", parse);
				Text.NL();
				Text.Add("<i>“And don’t tire him out too much, I need him to run errands for me,”</i> Rosalin adds, reminding Cale that [heshe]’s also there.", parse);
				Text.NL();
				Text.Add("<i>“Don’t worry, I’ll keep that in mind,”</i> the satyr replies with a chuckle.", parse);
				Text.NL();
				Text.Add("Cale - bullied from every side - finally gives up his pretense to resistance, rocking his hips in rhythm with you and Estevan. His surrender hasn’t escaped the satyr, who doubles his pace, deepthroating the wolf in almost a frenzy. From your perspective, it’s quite clear he’s just about to cum, though the slut with his lips wrapped around the satyr’s cock is still blissfully unaware.", parse);
				Text.NL();
				Text.Add("The wolf’s eyes bulge wide open as the satyr suddenly reaches his climax, pouring a load worthy of his hefty balls down Cale’s throat. The process goes on for quite a bit longer than the wolf is comfortable with, and you can feel him struggle weakly against his rival. You give him an admonishing slap on the butt, taking the chance to shove your [cock] home to remind him of his place.", parse);
				Text.NL();
				Text.Add("When he’s finally done, the satyr pulls out his sloppy cock, still draped in thick strands of goat cream. To add further insult to insult, he takes his time wiping his member in the wolf’s fur, soaking the coughing canine.", parse);
				Text.NL();
				if(first)
					Text.Add("<i>“Thanks for the ride, [playername]!”</i> Estevan thanks you, still eyeing his rival mockingly. <i>“Who knew, there <b>is</b> something that you’re good at, Wolfie!”</i>", parse);
				else
					Text.Add("<i>“Thanks for another go at the camp slut, [playername]!”</i> Estevan thanks you, scratching the wolf behind his ears. <i>“I don’t know, Wolfie, you seemed more into it than last time. Are you maybe starting to like me? Well, my cock, that is.”</i>", parse);
				Text.Add(" With that, he leaves you alone with a Cale stuffed full of spunk. Well, you’ve still got business to take care of with the wolf...", parse);
				Text.NL();
				
				var max = cale.flags["Met2"] >= Cale.Met2.Goop ? 100 : 50;
				cale.slut.IncreaseStat(max, 2);
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Why not? Let the satyr have some fun with his wolf rival."
		});
		options.push({ nameStr : "No",
			func : function() {
				Text.Clear();
				Text.Add("You tell the satyr to back off for now. Cale looks relieved, but you remind him to not get too comfortable, you are <i>far</i> from done with him.", parse);
				Text.NL();
				if(!first) {
					Text.Add("<i>“No worries, I got my fill of mutt the last time,”</i> Estevan replies, waving goodbye to his rival as he returns to the campfire.", parse);
					Text.NL();
				}
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Nah, as amusing as that would be, Cale is <i>your</i> prize."
		});
		Gui.SetButtonsFromList(options, false, null);
		
		breakpoint = true;
	}
	else {
		var scenes = new EncounterTable();
		/* TODO: Special
		scenes.AddEnc(function() {
			Text.Add("", parse);
			Text.NL();
			Text.Add("", parse);
		}, 1.0, function() { return true; });
		*/
		// ROSALIN
		scenes.AddEnc(function() {
			
			Text.Add("<i>“Hiii Cale!”</i> Rosalin waves as [heshe] notices the two of you going at it. [HeShe] wanders over, seemingly oblivious to the wolf’s current situation. The [racedesc] carries a few bottles, and [heshe] looks very preoccupied. <i>“Listen, do you think you could get a few dozen canis roots for me? I need some for an experiment.”</i>", parse);
			Text.NL();
			if(rosalin.FirstCock()) {
				Text.Add("Though [heshe] might act coyly nonchalant, [hisher] body is more than aware of what is going on as you can see [hisher] [rcocks] straining against [hisher] skirt, aching for release. Cale himself must have an even better view of it from his front-row seat.", parse);
				Text.NL();
			}
			Text.Add("<i>“I- Ah! - now is a b-bad time, Rosie,”</i> the wolf whimpers, wincing as you drive into him with undiminished fervor.", parse);
			Text.NL();
			if(player.FirstCock() || rosalin.FirstCock())
				Text.Add("<i>“You see, I was thinking of making a potion that could give someone a nice big knot, or significantly expand an already existing one. I dunno, would you like that?”</i> Cale just moans, not even sure if [heshe]’s teasing him or being serious. Probably both.", parse);
			else
				Text.Add("<i>“Ah, all right. I had a recipe in mind that could increase the size of your knot a bit, but on second thought I guess you don’t need it anymore.”</i>", parse);
			Text.Add(" The alchemist pats [hisher] lover on the head fondly before returning to [hisher] work, leaving you free to continue violating the wolf.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			if(cale.flags["xOut"] >= 15)
				Text.Add("The business of the camp goes on as usual around you, the sight of the macho wolf being fucked no longer a surprise to anyone. The two of you get a few snickers and yearning looks, but you are mostly left to yourselves.", parse);
			else if(cale.flags["xOut"] >= 5)
				Text.Add("Quite a few of the other nomads are throwing glances as you have your way with your slut, unused to seeing the macho rogue be on the receiving end.", parse);
			else
				Text.Add("People around you have stopped to look, talking among themselves jovially and snickering at the wolf. He lowers his head in shame, but he’s not about to give up on this feeling now.", parse);
		}, 1.0, function() { return true; });
		
		scenes.Get();
		Text.NL();
	}
	
	cale.flags["xOut"]++;
	
	return breakpoint;
}



export { Cale, CaleScenes };
