/*
 * 
 * Define Miranda
 * 
 */
function Miranda(storage) {
	Entity.call(this);
	
	// Character stats
	this.name = "Miranda";
	
	this.avatar.combat = Images.miranda;
	
	this.currentJob = Jobs.Bruiser;
	this.jobs["Fighter"]   = new JobDesc(Jobs.Fighter);
	this.jobs["Fighter"].level = 3;
	this.jobs["Bruiser"]   = new JobDesc(Jobs.Bruiser);
	
	this.maxHp.base        = 100;
	this.maxSp.base        = 10;
	this.maxLust.base      = 50; this.maxLust.growth      = 6;
	// Main stats
	this.strength.base     = 23; this.strength.growth     = 1.7;
	this.stamina.base      = 19; this.stamina.growth      = 1.4;
	this.dexterity.base    = 19; this.dexterity.growth    = 1.1;
	this.intelligence.base = 12; this.intelligence.growth = 1;
	this.spirit.base       = 11; this.spirit.growth       = 1.2;
	this.libido.base       = 24; this.libido.growth       = 1.5;
	this.charisma.base     = 14; this.charisma.growth     = 1.1;
	
	this.level    = 8;
	this.sexlevel = 3;
	this.SetExpToLevel();
	
	this.body.DefHerm(true);
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 7;
	this.FirstCock().length.base = 28;
	this.FirstCock().thickness.base = 7;
	this.FirstVag().virgin = false;
	this.Butt().virgin = false;
	this.Balls().size.base = 6;
	this.Balls().cumProduction.base = 4;
	this.body.SetRace(Race.dog);
	this.SetSkinColor(Color.black);
	this.SetHairColor(Color.blue);
	this.SetEyeColor(Color.green);
	this.body.height.base      = 180;
	this.body.weigth.base      = 75;
	
	this.weaponSlot   = Items.Weapons.GreatSword;
	this.topArmorSlot = Items.Armor.WatchChest;
	
	this.Equip();
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"]      = Miranda.Met.NotMet;
	this.flags["Herm"]     = 0; // Know she is a herm
	this.flags["Attitude"] = Miranda.Attitude.Neutral;
	this.flags["Thief"]    = 0;
	this.flags["RotGuard"] = 0;
	this.flags["Forest"]   = 0;
	this.flags["Floor"]    = 0;
	
	this.flags["Footjob"]  = 0;
	
	//Peasants' gate antics
	this.flags["gBJ"]      = 0;
	this.flags["gAnal"]    = 0;
	this.flags["gBribe"]   = 0;

	this.flags["public"]   = 0;
	this.flags["Dates"]    = 0;
	this.flags["bgRot"]    = 0;
	this.flags["bgRotMax"] = 0;
	this.flags["ssRot"]    = 0;
	this.flags["ssRotMax"] = 0;
	this.flags["dLock"]    = 0;
	this.flags["domCellar"] = 0; //player dom
	this.flags["subCellar"] = 0; //player sub
	
	if(storage) this.FromStorage(storage);
}
Miranda.prototype = new Entity();
Miranda.prototype.constructor = Miranda;

Miranda.Attitude = {
	Hate    : -2,
	Dismiss : -1,
	Neutral : 0,
	Nice    : 1
};

Miranda.Met = {
	NotMet : 0,
	Met    : 1,
	Tavern : 2,
	TavernAftermath : 3
}

Miranda.Public = {
	Nothing : 0,
	Oral    : 1,
	Sex     : 2,
	Other   : 3,
	Orgy    : 4
}

Miranda.prototype.Attitude = function() {
	return this.flags["Attitude"];
}

Miranda.prototype.Nice = function() {
	return this.flags["Attitude"] >= Miranda.Attitude.Neutral;
}
Miranda.prototype.Nasty = function() {
	return this.flags["Attitude"] < Miranda.Attitude.Neutral;
}

Miranda.prototype.FromStorage = function(storage) {
	this.LoadCombatStats(storage);
	this.LoadPersonalityStats(storage);
	this.LoadEffects(storage);
	this.LoadJobs(storage);
	this.LoadEquipment(storage);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
	
	this.RecallAbilities();
	this.SetLevelBonus();
	this.Equip();
}

Miranda.prototype.ToStorage = function() {
	var storage = {};
	
	this.SaveCombatStats(storage);
	this.SavePersonalityStats(storage);
	this.SaveEffects(storage);
	this.SaveJobs(storage);
	this.SaveEquipment(storage);
	
	// Save flags
	this.SaveFlags(storage);
	this.SaveSexStats(storage);
	
	return storage;
}

// Party interaction
Miranda.prototype.Interact = function(switchSpot) {
	Text.Clear();
	var that = miranda;
	
	that.PrintDescription();
	
	var options = new Array();
	options.push({ nameStr: "Release",
		func : function() {
			Text.Clear();
			Text.AddOutput("[Placeholder] Miranda masturbates fiercely, cumming buckets.");
			
			world.TimeStep({minute : 10});
			
			that.OrgasmCum();
			
			Gui.NextPrompt(function() {
				that.Interact(switchSpot);
			});
		}, enabled : true,
		tooltip : "Pleasure yourself."
	});
	//Equip, stats, job, switch
	that.InteractDefault(options, switchSpot, !rigard.UnderLockdown(), true, !rigard.UnderLockdown(), true);
	
	Gui.SetButtonsFromList(options, true, PartyInteraction);
}

// Schedule
Miranda.prototype.IsAtLocation = function(location) {
	if(party.InParty(miranda)) return false;
	location = location || party.location;
	if(world.time.hour >= 7 && world.time.hour < 19) {
		//Work
		if(world.time.day % 2)
			return (location == world.loc.Plains.Gate) || (location == world.loc.Rigard.Gate);
		else
			return (location == world.loc.Rigard.Slums.gate);
	}
	else if(world.time.hour >= 19 || world.time.hour < 2)
		return (location == world.loc.Rigard.Tavern.common);
	else
		return (location == world.loc.Rigard.Residental.miranda);
}

Miranda.prototype.OnPatrol = function() {
	if(party.InParty(this))
		return false;
	else
		return (world.time.hour >= 7 && world.time.hour < 17);
}

// Events
Scenes.Miranda = {};

Scenes.Miranda.RigardGatesDesc = function() {
	Text.Add("<i>“Ho!”</i> Miranda greets you as you approach the gate. The dog-morph is lounging beside the gatehouse, ");
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("toying with the pommel of her sword.");
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("stretching out sore muscles.");
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("sneaking a drink from a small hip flask while the commanding officer isn’t looking.");
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("her bored gaze drifting over the scenery.");
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.NL();
}

Scenes.Miranda.RigardGatesInteract = function() {
	var parse = {};
	
	Text.Clear();
	if(!rigard.Visa()) {
		Text.Add("<i>“Still no luck getting a pass? Sorry, but you know I can’t let you in without one,”</i> Miranda tells you bluntly.", parse);
		Text.NL();
	}
	
	if(miranda.Attitude() > Miranda.Attitude.Neutral)
		Text.Add("<i>“If you feel brave enough, I could treat you to another round,”</i> the guardswoman suggests, winking at you. <i>“Meet me at the tavern in the slums after dark and we’ll party hard!”</i>", parse);
	else if(miranda.Attitude() < Miranda.Attitude.Neutral)
		Text.Add("<i>“So you come crawling back here, eh?”</i> The guardswoman looks at you dismissively. <i>“I really don’t have the time for you right now. What do you want?”</i>", parse);
	else
		Text.Add("<i>“Head over to the Maidens’ Bane tavern in the slums once in a while, we can have a drink and chat a bit.”</i>", parse);
	Text.Flush();
	
	// TODO: Add interactions (sex)
	Gui.NextPrompt();
}

Scenes.Miranda.RigardGatesEnter = function() {
	var parse = {
		playername : player.name
	};
	
	if(miranda.Attitude() < Miranda.Attitude.Neutral) { // bad
		Text.Add("<i>“What now?”</i> Miranda asks shortly as you approach the gates.", parse);
		if(miranda.Relation() < 25)
			Text.Add(" She doesn’t look too happy to see you.");
		if(!rigard.GatesOpen())
			Text.Add(" <i>“You are not getting inside the city during night hours, pass or no pass,”</i> she growls. <i>“Not through this gate.”</i>", parse);
		else if(rigard.Visa()) {
			Text.Add("You show her your visa to enter the city, but she seems unwilling to let you in either way. <i>“Come over here, standard procedure,”</i> she growls. During the next hour or so, she hounds you with questions about your business in the city, though you can tell she is clearly just fucking with you and wasting time.", parse);
			Text.NL();
			Text.Add("Something tells you that you are lucky though, as you suspect that if not for the other guard posted there, you’d be up for a cavity search. Eventually, the vindictive guardswoman lets you through the gates into Rigard.", parse);
			Text.NL();
			Text.Add("<i>“Why not come by the peasants’ gate more?”</i> Miranda calls after you. <i>“It’s a much more… comfortable environment.”</i>", parse);
			if(miranda.flags["gBJ"] > 0)
				Text.Add(" Your cheeks burn, but at least she let you inside, and with less humiliation than usual.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Rigard.Gate, {hour: 1});
			});
			return;
		}
		else {
			Text.Add("<i>“You know damn well you aren’t getting through here without a pass,”</i> she growls. There is a dangerous glint in her eyes as she adds: <i>“Come by the slum-side gate when I’m on duty sometime, I might show mercy on you.”</i>", parse);
		}
	}
	else if(miranda.Attitude() > Miranda.Attitude.Neutral) { // good
		Text.Add("<i>“Heading in?”</i> Miranda asks you as you approach the gates. <i>“Don’t be a stranger now!”</i>", parse);
		Text.NL();
		if(rigard.Visa()) {
			if(rigard.GatesOpen()) {
				Text.Add("The guardswoman waves you through, feeling you up familiarly as you pass her. <i>“Come join me for a drink or two later, okay?”</i>", parse);
			}
			else { // !open
				Text.Add("The guardswoman looks around her quickly, studying her half asleep companion. She quickly gestures for you to come with her, leading you to a side gate. <i>“Don’t tell anyone I let you in, okay? The gates are supposed to be shut at this hour.”</i>", parse);
			}
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Rigard.Gate, {minute: 5});
			});
			return;
		}
		else
			Text.Add("<i>“Sorry, I can’t let you through without a pass, [playername]. Come by the pub when I’m off duty, perhaps I can help you get one.”</i>", parse);
	}
	else { // neutral
		if(rigard.GatesOpen()) {
			Text.Add("<i>“Pass please,”</i> the guardswoman drones as you inquire about entry to the city.", parse);
			if(rigard.Visa()) {
				Text.Add("<i>“All seem to be in order, welcome to Rigard.”</i> She ushers you through the gates, already busy with the next person in line.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Gate, {minute: 5});
				});
				return;
			}
			else
				Text.Add("<i>“No pass, no entry. Sorry, those are the rules.”</i> She adds that she’s still up for a drink after work at the pub.", parse);
		}
		else
			Text.Add("<i>“Gates are closed, ‘m afraid. Come back during daytime. Check in between eight in the morning and five in the evening.”</i>", parse);
	}
	Text.NL();
	Text.Flush();
	PrintDefaultOptions(true);
}


Scenes.Miranda.RigardSlumGatesDesc = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	
	Text.Add("<i>“[playername],”</i> Miranda nods in your direction as you approach. The dog-morph is seated at a wooden table beside the peasants’ gate, ", parse);
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("playing cards with some of her fellow guards.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("sipping at a mug of beer.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("sharpening her sword.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("watching the street with keen eyes.", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.Add("<i>“Quite the rural neighbourhood, isn’t it?”</i> Miranda grunts, waving at the muddy streets near the gate. <i>“Still, I grew up in these parts, so I’ll always have a soft spot for it, no matter how much of a cesspit it is.”</i>", parse);
	if(miranda.Attitude() == Miranda.Attitude.Neutral) {
		Text.NL();
		Text.Add("<i>“If you haven’t already, you should check out the local tavern, the Maidens’ Bane,”</i> Miranda suggests, <i>“I hang around there after work. Cozy little place.”</i>", parse);
	}
	Text.NL();
}

Scenes.Miranda.RigardSlumGatesEnter = function() {
	var parse = {
		playername : player.name,
		guygal : player.mfFem("guy", "gal"),
		buttDesc : function() { return player.Butt().Short(); }
	};
	
	Text.Clear();
	
	if(!rigard.Visa()) {
		if(miranda.Attitude() > Miranda.Attitude.Neutral) // nice
			Text.Add("Miranda looks around, trying to see if any of her comrades overheard you. <i>“Keep it down will you?!”</i> she hisses, <i>“I’m not supposed to let you in without a pass, you know. Meet me at the tavern after work and we’ll talk.”</i>", parse);
		else if(miranda.Attitude() < Miranda.Attitude.Neutral) { // nasty
			Text.Add("The dog-morph eyes you flatly. <i>“Why should I take that risk for you? There’d better be something in it for me if you want inside.”</i>");
			Text.Flush();
			
			Scenes.Miranda.RigardGatesBribe();
			return;
		}
		else
			Text.Add("<i>“Why should I let you in?”</i> the dog-morph replies flatly. <i>“I’m sure you’re a nice [guygal], but I’m not risking my job for someone I barely know. Come back with a pass.”</i>", parse);
		Text.NL();
		Text.Flush();
		PrintDefaultOptions(true);
	}
	else { //Visa
		if(miranda.Attitude() < Miranda.Attitude.Neutral) { // nasty
			Text.Add("<i>“Aww… you want to get in? What’s in it for me?”</i> Miranda asks, toying with you.", parse);
			Text.Flush();
			
			Scenes.Miranda.RigardGatesBribe();
		}
		else if(miranda.Attitude() > Miranda.Attitude.Neutral) { // nice
			Text.Add("<i>“Sure, come right through, honey,”</i> Miranda grins as you pass her, giving your [buttDesc] a familiar slap. <i>“Come see me at the tavern later, okay?”</i>", parse);
			if(!rigard.GatesOpen()) {
				Text.NL();
				Text.Add("The other guards doesn’t seem to care particularly much about Miranda letting people in during after hours. Things are a bit more laid back here, you guess.", parse);
			}
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Rigard.Gate, {minute: 5});
			});
		}
		else { // neutral
			if(rigard.GatesOpen()) {
				Text.Add("<i>“It looks to be in order,”</i> Miranda concludes after looking over your papers. She waves you through the gates, adding that you should come visit her at the tavern after work some time.", parse);
				Text.NL();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Gate, {minute: 5});
				});
			}
			else {
				Text.Add("<i>“Sorry, I can’t let you in while the gate is shut. Come back during the open hours, eight in the morning to five in the evening.”</i>", parse);
				Text.NL();
				Text.Flush();
				PrintDefaultOptions(true);
			}
		}
	}
}

Scenes.Miranda.RigardGatesBribe = function() {
	var parse = {
		playername : player.name,
		bottomArmorDesc : function() { return player.LowerArmorDesc(); },
		tongueDesc : function() { return player.TongueDesc(); },
		stomachDesc : function() { return player.StomachDesc(); },
		skinDesc : function() { return player.SkinDesc(); },
		buttDesc : function() { return player.Butt().Short(); },
		anusDesc : function() { return player.Butt().AnalShort(); },
		breastDesc : function() { return player.FirstBreastRow().Short(); },
		hand : function() { return player.HandDesc(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		vagDesc : function() { return player.FirstVag().Short(); },
		mcockDesc : function() { return miranda.FirstCock().Short(); },
		mcockTip  : function() { return miranda.FirstCock().TipShort(); }
	};
	
	//[Your job][Money][Blowjob][Sex]
	var options = new Array();
	if(rigard.Visa() && miranda.flags["gBribe"] < 1) {
		options.push({ nameStr : "Your job",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Cute, [playername],”</i> the guardswoman scoffs. <i>“Things work a bit differently here in the slums, though. This is my turf, my rules. Pass or no pass.”</i>", parse);
				Text.Flush();
				
				miranda.flags["gBribe"] = 1;
				miranda.relation.DecreaseStat(-100, 3);
				
				Scenes.Miranda.RigardGatesBribe();
			}, enabled : true,
			tooltip : "Indicate that it’s her job to let you through if you have a pass."
		});
	}
	if(miranda.flags["gBribe"] < 2) {
		options.push({ nameStr : "Money",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Fuck off,”</i> she curtly dismisses you, not interested in your money.", parse);
				Text.NL();
				Text.Flush();
				
				miranda.flags["gBribe"] = 2;
				miranda.relation.DecreaseStat(-100, 3);
				
				Scenes.Miranda.RigardGatesBribe();
			}, enabled : true,
			tooltip : "Offer her a bribe."
		});
	}
	options.push({ nameStr : "Blowjob",
		func : function() {
			Text.Clear();
			if(miranda.flags["gBJ"] == 0) { // First
				Text.Add("You suggest that you could perhaps... relieve her? Miranda’s sour expression slowly shifts to a wide grin.", parse);
				Text.NL();
				Text.Add("<i>“Now you’re talking!”</i> The dog-morph gets up from her post, motioning for you to follow her. The curious looks from the other guards bore into your back as you trot along behind the herm.", parse);
				Text.NL();
				Text.Add("You reach the entrance of a dark alley, and Miranda firmly grabs you, pulling you inside. Pushing you down easily - the bitch is frightfully strong - she grinds her bulge against your face. <i>“Feel that?”</i> she grunts. You definitely can, as her cock strains against her leather pants, striving to be free.", parse);
				Text.NL();
				Text.Add("Holding your head in place with one hand, the other expertly undoes her britches, releasing her thick slab of meat, which promptly slaps you.", parse);
				Text.NL();
				Text.Add("<i>“Little Miranda is antsy, why don’t you try to soothe her,”</i> the grinning dog-herm says mockingly. To make her point clear, she nudges your lips with her stiffening [mcockDesc]. Uncertainly, you open your mouth, completely caught off guard when she roughly shoves her way inside.", parse);
				Text.NL();
				
				Sex.Blowjob(player, miranda);
				player.FuckOral(player.Mouth(), miranda.FirstCock(), 2);
				
				Text.Add("<i>“Yeeeees, good little slut, so eager,”</i> Miranda encourages you, her hips slowly pushing forward as she forces more of her monster cock past your lips. Your senses are overwhelmed by her smell, her taste, your [tongueDesc] lathered in her pre as she rubs the [mcockTip] of her dick on it repeatedly. <i>“You are going to have to do better if you want your reward, though,”</i> she grins. <i>“Only dedicated cocksuckers get inside on my watch!”</i>", parse);
				Text.NL();
				Text.Add("Dedicated or not, it is clear that the dickgirl intends to make as much of this opportunity as possible, grabbing hold of your head with both hands to get a firm grip. With her prey secured, Miranda starts to fuck you in earnest, thrusting her cock into your poor throat to the hilt. Once in a while, she pauses for a while, holding you in place with her shaft firmly lodged in your throat, making sure you realize that she is in full control.", parse);
				Text.NL();
				Text.Add("<i>“Now suck!”</i> she barks, loud enough for her voice to carry into the street. Dejectedly, you obey her, seeing no other way out of the situation. <i>“Ngh, that’s the way, bitch,”</i> Miranda grunts, moaning as you service her member. <i>“Keep it up now, and you’ll get your just reward!”</i>", parse);
				Text.NL();
				Text.Add("True to her word, it’s not long before the dog-herm’s breath grows short, her rutting hip-movements becoming more erratic. With both her hands keeping your head firmly in place, you have little choice but to accept whatever is coming, through you grow worried as you feel her knot swelling in your mouth. Thankfully, the guardswoman pulls it out just in time, narrowly saving you from death through suffocation.", parse);
				Text.NL();
				Text.Add("<i>“Take my load, bitch!”</i> the herm yells, pouring her thick cum down your throat and into your [stomachDesc]. You swallow dutifully, but you can feel her seed rising in your throat, the pressure being too high. Despite your efforts, some of it leaks out, trailing down your chin. Finally, the sadistic dog-herm pulls out, allowing you to breathe again.", parse);
				Text.NL();
				
				var mCum = miranda.OrgasmCum();
				player.AddLustFraction(0.3);
				miranda.relation.IncreaseStat(100, 3);
				miranda.subDom.IncreaseStat(100, 5);
				player.subDom.DecreaseStat(-50, 1);
				player.slut.IncreaseStat(100, 2);
				
				if(!rigard.Visa()) {
					Text.Add("<i>“Now then,”</i> Miranda says while you are still reeling and coughing from your rough face fuck, <i>“why don’t we go ahead and get you that pass?”</i> Almost feeling as if you’ve been drugged, you tag along after the guardswoman, who enters a side gate and lets you into the city.", parse);
					Text.NL();
					Text.Add("<i>“That wasn’t so hard now was it?”</i> Miranda smirks at your blush. <i>“You should come by and suck my cock more often, make it a regular thing. At least if you want to enter the city again.”</i> Before you can contemplate what she means by that, you’ve arrived at a small booth, manned by a bored-looking city official.", parse);
					Text.NL();
					Text.Add("The guardswoman explains that you are here to write out a pass for you, and that she’ll vouch for you. The administrator eyes you curtly, disapproval clear in his furrowed brow. With a start, you realize that Miranda’s cum is still trailing down from your lips, and you promptly wipe it off, blushing.", parse);
					Text.NL();
					Text.Add("The procedure is rather arduous, but at last you stand there with your visa in hand, and stomach full of semen. <i>“Later!”</i> Miranda waves dismissively as she walks back to her post, chuckling to herself.", parse);
					Text.NL();
					Text.Add("Well, at least you got a pass now, you tell yourself.", parse);
					Text.NL();
					Text.Add("<b>Acquired citizen’s visa!</b>", parse);
					
					rigard.flags["Visa"] = 1;
				}
				else {
					Text.Add("<i>“Enjoy your visit to Rigard, citizen,”</i> Miranda snickers, opening the gates for you. Staggering through, you enter the streets of the city. With a sinking heart, you realize this will probably be a regular theme for your visits.", parse);
				}
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Residental.street, {hour: 1});
				});
			}
			else { // Repeat blowjob
				if(miranda.flags["gBJ"] < 5)
					Text.Add("<i>“You know the drill, come with me.”</i> Miranda leads you into a back alley, pushing  your head down to her crotch and pulling out her [mcockDesc]. <i>“I’m sure you remember what to do.”</i> Meekly, you grasp her member, licking the [mcockTip] demurely. In your [hand]s, the hermaphrodite grows stiff, her rock-hard cock point right at you.", parse);
				else {
					parse["Bewildered"] = miranda.flags["public"] == Miranda.Public.Nothing ? "Bewildered, y" : "Y";
					Text.Add("You wait for Miranda to get up, but she just leans back languidly. <i>“Well, what are you waiting for?”</i> she asks, annoyed, <i>“start sucking, slut.”</i> She parts her legs, exposing her bulge to you. [Bewildered]ou glance around at the other guards, but Miranda redirects your attention to her crotch.", parse);
					Text.NL();
					Text.Add("<i>“Don’t mind them, this is the reason you came here anyways, isn’t it?”</i> By now, you might as well conceed her point… there are other ways for you to get into Rigard at this point, and yet here you are, back to get another mouthful of her [mcockDesc]. The others have most likely gotten a good idea of what is going on already anyways.", parse);
					if(miranda.flags["public"] < Miranda.Public.Oral)
						miranda.flags["public"] = Miranda.Public.Oral;
				}
				Text.NL();
				parse["head"] = player.HasHorns() ? player.HasHorns().Short() : player.Hair().Short();
				Text.Add("<i>“Suck,”</i> she commands, taking a firm hold of your [head]. Swallowing your pride - and her pre - you start bobbing your head up and down on her shaft, spreading your saliva along the thick pillar of cockmeat. The guardswoman lets you set your own pace for a while, before she takes charge, setting her own rhythm. Like always, the dominant herm is rough with you, showing little care for your well-being as she ravages your throat.", parse);
				Text.NL();
				
				Sex.Blowjob(player, miranda);
				player.FuckOral(player.Mouth(), miranda.FirstCock(), 2);
				
				player.AddLustFraction(0.3);
				var mCum = miranda.OrgasmCum();
				miranda.subDom.IncreaseStat(50, 1);
				player.subDom.DecreaseStat(-50, 1);
				
				world.TimeStep({minute: 30});
				
				Text.Add("Once more, you’re rewarded with a stomach-full of Miranda’s thick spunk, the excess slowly trickling down your chin, marking you for the slut you are.", parse);
				Text.NL();
				if(miranda.flags["gBJ"] < 5) {
					Text.Add("<i>“You’re starting to get the hang of this, [playername],”</i> she congratulates you. <i>“How about making it a career of being my bitch?”</i>", parse);
					Text.NL();
					if(rigard.GatesOpen()) {
						Text.Add("<i>“Well, what are you waiting for?”</i> Miranda tugs you to a side gate, out of sight from the main one. <i>“Now, remember that pass or no pass, you are here on <b>my</b> whim. Don’t let me catch you messing around in my town, or I might get some ideas.”</i> Coming from her, you have no doubt that it’s a serious threat.", parse);
						Text.NL();
						Text.Add("Wiping the remaining droplets of the dog-herm’s cum from your lips, you enter the city of Rigard.", parse);
						
						Gui.NextPrompt(function() {
							MoveToLocation(world.loc.Rigard.Residental.street, {minute: 5});
						});
					}
					else {
						Text.Add("<i>“Oh… that’s right, look at the time,”</i> Miranda grins lecherously. <i>“Sorry, the gates are closed at this hour, please come back later.”</i> With that, she summarily dismisses you. You are left standing there, feeling rather foolish.", parse);
						Gui.NextPrompt();
					}
				}
				else {
					Text.Add("<i>“Putting on such a good show for the masses, [playername],”</i> she praises you, gesturing to her grinning colleagues. Quite a few of them have their own cocks out, stroking themselves. <i>“Thanks for the blowjob, bitch,”</i> Miranda grins. <i>“Now shove off, I got work to do.”</i> When you protest that you had a deal, she only laughs at you.", parse);
					Text.NL();
					Text.Add("<i>“You agreed to that way too quickly. I’ve been going too easy on you it seems. If you want to negotiate for entry, you better bring something different to the table...”</i> The hermaphrodite gives your [buttDesc] a sound slap as she passes you, making her meaning clear.", parse);
					if(miranda.flags["gAnal"] == 0) {
						Text.NL();
						Text.Add("W-what? No way!", parse);
					}
					
					miranda.relation.IncreaseStat(30, 1);
					miranda.subDom.IncreaseStat(70, 1);
					player.subDom.DecreaseStat(-70, 1);
					player.slut.IncreaseStat(50, 1);
				}
			}
			Text.Flush();
			
			miranda.flags["gBJ"]++;
		}, enabled : true,
		tooltip : "Offer to blow her."
	});
	if(miranda.flags["gBJ"] >= 5) {
		options.push({ nameStr : "Buttsex",
			func : function() {
				Text.Clear();
				var first    = miranda.flags["gAnal"] == 0;
				var virgin   = player.Butt().virgin;
				var audience = miranda.flags["gAnal"] >= 5;
				
				if(first) { // first
					Text.Add("<i>“Mmm… depends on how good you are,”</i> she purrs at your offer. <i>“But I’m not one to say no to such an offer. Come along here, my little slut.”</i> She leads you to a narrow back alley close to the barracks. For the slums, the smell isn’t so bad. <i>“C’mon, show me the goods,”</i> Miranda murmurs, licking her lips hungrily.", parse);
					Text.NL();
					Text.Add("Turning around, you blush as you lean against the wall of one of the nearby shacks, shivering as her rough hands quickly relieve you of your [bottomArmorDesc], groping the [skinDesc] of you [buttDesc]. You jolt and whimper in surprise when the herm places the tip of her [mcockDesc] against your [anusDesc]. R-really? Not even any preparation?", parse);
					Text.NL();
					Text.Add("<i>“What? You did offer it yourself, did you not?”</i> You feel a wet splatter against your back door as she applies some spit. <i>“There, feel better now? You might want to bite down for this though...”</i>", parse);
					Text.NL();
					if(virgin) {
						Text.Add("Caught in a bout of panic, you blabber on about how this is your first time, and please, please be gentle. The sincerity catches the dominant herm off-guard, though her hold on your butt remains firm.", parse);
						Text.NL();
						Text.Add("<i>“You’d give your first to me…?”</i> Miranda’s voice sounds uncharacteristically small and hesitant. <i>“I’ll take it, but lets drop the pretense that you are doing this just to get into the city, will you? You have a slutty streak running as deep as the roots of the Great Tree!”</i>", parse);
						Text.NL();
						Text.Add("Her brief vulnerable moment over, she continues more confidently: <i>“As for me being gentle… you are asking the wrong girl. How about this? I’ll start with just the tip… followed by the knot. Repeatedly.”</i>", parse);
						
						miranda.relation.IncreaseStat(100, 10);
					}
					Text.NL();
					Text.Add("No sooner has she uttered the words than she acts on them, her hips pushing forward, ramming through whatever defenses you are able to scrape together with ease. You are too shocked at the sudden intrusion to even voice a protest, gasping for air as you feel her thick rod sliding into your [anusDesc].", parse);
					Text.NL();
					
					Sex.Anal(miranda, player);
					player.FuckAnal(player.Butt(), miranda.FirstCock(), 4);
					miranda.Fuck(miranda.FirstCock(), 3);
					
					Text.Add("<i>“See, not too bad, is it?”</i> The guardswoman grunts, shoving another few inches inside you.", parse);
				}
				else if(miranda.flags["gAnal"] < 5) { // repeat < 5
					Text.Add("<i>“Back for another rough buttfucking? You really are a slut, you know that right?”</i> You bow your head a bit shamefully, unable to deny her accusation. <i>“Be my guest,”</i> she shrugs, gesturing for you to enter the alleyway. <i>“I’ll be right back, guys, just need to ram a long, thick cock up this little bitch’ ass,”</i> Miranda tells her grinning companions. You can feel their gazes burning into your back as you follow the herm.", parse);
					Text.NL();
					Text.Add("<i>“Bend over for me,”</i> she growls, her breath quickening as she fumbles with her britches, freeing her monster cock. You obey, gasping as she all but tears through your gear, exposing your [buttDesc] and your soon-to-be-fucked hole. <i>“If last time didn’t break you, I’ll just have to try harder this time, won’t I?”</i> Hardly words to settle your uneasy mind, especially with her [mcockTip] pressing against your [anusDesc]. You feel something cold and slippery pouring down your taint, lubing you up for the coming anal assault.", parse);
					Text.NL();
					Text.Add("Even if she gives you that courtesy, it is the only one you’ll get. In one smooth motion, the hermaphrodite canine rams her cock home with all her strength, roughly impaling you on her stiff pole.", parse);
					Text.NL();

					Sex.Anal(miranda, player);
					player.FuckAnal(player.Butt(), miranda.FirstCock(), 4);
					miranda.Fuck(miranda.FirstCock(), 3);
					
					Text.Add("<i>“Not sure you’ll be able to walk after this one,”</i> the guardswoman grunts as she slams her hips against yours. <i>“Would be a shame, wouldn’t it, going through all of this only to be unable to enter the city afterwards!”</i>", parse);
				}
				else { // repeat >= 5
					parse["hisher"] = player.mfTrue("his", "her");
					Text.Add("<i>“Everyone, meet [playername], town slut,”</i> Miranda dramatically introduces you to the other guards, <i>“about to get [hisher] ass fucked by me. I might even allow sloppy seconds.”</i>", parse);
					Text.NL();
					if(miranda.flags["public"] < Miranda.Public.Sex) {
						Text.Add("You start protesting - surely this is too much, even for her - but she cuts you off with a sharp bark.", parse);
						Text.NL();
						Text.Add("<i>“Wouldn’t want to be caught obstructing the long, thick, veiny cock of the law now, would you [playername]?”</i> Miranda growl menacingly. <i>“The guys know all about our little deal, so don’t go looking to them for help. You might play hard to get, but deep down you know you are a total slut for my cock, and you want nothing more than for me to fuck your brains out.”</i>", parse);
						Text.NL();
						Text.Add("Dejectedly, you give in. She’s going to have things go her way, whatever you say or do.", parse);
						Text.NL();
						
						miranda.subDom.IncreaseStat(100, 5);
						player.subDom.DecreaseStat(-100, 5);
						
						miranda.flags["public"] = Miranda.Public.Sex;
					}
					parse["himher"] = player.mfTrue("him", "her");
					Text.Add("Cheeks burning slightly under the scrutiny of the other guardsmen - most of them male, and quite obviously throwing you lecherous glances - you disrobe, bending over the table obediently. <i>“See how well I’ve trained [himher],”</i> Miranda brags.", parse);
					Text.NL();
					if(miranda.SubDom() - player.SubDom() > 50 && Math.random() < 0.5) {
						Text.Add("<i>“Now beg for my cock. Show them how much you need it.”</i>", parse);
						Text.NL();
						Text.Add("Eager to please your mistress, you spread your cheeks, begging for her to fuck you, deep and hard. You are nothing but a pitiful little slut, hungry for [hisher] mistress’ cum. The hermaphrodite pats you fondly, proud of her pet.", parse);
						Text.NL();
					}
					Text.Add("Perhaps as a kindness for you good behavior, Miranda pours some of her lube between your spread asscheeks, rubbing the tip of her cock in the sticky mess before ramming her hips home. Each time she fucks you, it feels more familiar, more <i>right</i>, though she doesn’t grow more gentle over time. The opposite, if anything.", parse);
					
					Sex.Anal(miranda, player);
					player.FuckAnal(player.Butt(), miranda.FirstCock(), 5);
					miranda.Fuck(miranda.FirstCock(), 4);
				}
				Text.NL();
				Text.Add("Miranda sets a wild pace, roughly slamming her hips into yours, fucking you with little care for your pleasure - or well-being for that matter. Her iron grip prevents any attempts at escape, once again reminding you how deceptively strong the canine woman is.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					parse["cock"] = player.NumCocks() > 1 ? "do those pitiful excuses for cocks" : "does that pitiful excuse for a cock";
					Text.Add("<i>“Tell me, [playername],”</i> she grunts in your ear, her breasts pressing against your back, <i>“[cock] ever see any action? Or are you too busy getting nailed by everyone you meet?”</i>", parse);
					Text.NL();
				}, 1.0, function() { return player.FirstCock() && !virgin; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Perhaps next time, I’ll try out that cunt of yours, hmm?”</i> she grunts, one hand trailing down to probe your wet nether lips.", parse);
					Text.NL();
				}, 1.0, function() { return player.FirstVag(); });
				scenes.AddEnc(function() {
					Text.Add("<i>“Nice tits,”</i> she compliments you, <i>“bet they are good cushions, with all the time you spend on your stomach getting railed!”</i>", parse);
					Text.NL();
				}, 1.0, function() { return player.FirstBreastRow().Size() > 3; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Found your true calling, boy?”</i> she mocks you. <i>“If it makes you feel any better, you are not the first guy to get a full dose of Miranda, not by a long shot.”</i>", parse);
					Text.NL();
				}, 1.0, function() { return player.Gender() == Gender.male; });
				
				scenes.Get();
				
				Text.Add("All you can do is bite down and take it, trying to ride out the violent storm. Her cock is pistoning your butt relentlessly, ignoring whatever feeble defense you are able to mount. You can see her wide grin in your minds eye as she uses you - mocking and fierce, almost feral. The dominant doggie continues her stream of humiliating banter, shaming you by calling you her bitch, her slut, her cocksleave.", parse);
				if(first)
					Text.Add("You tell yourself it isn’t true, but instinctively know that you are deceiving yourself.", parse);
				else
					Text.Add("All true, but it serves to remind you how low you’ve fallen.", parse);
				if(audience)
					Text.Add(" That your humiliation is public should make things worse, but somehow, you’ve ceased to care.", parse);
				Text.NL();
				if(first)
					Text.Add("Nothing could have prepared you for this, for her fierce ravaging.", parse);
				else {
					parse["audience"] = audience ? " the burning gazes of your audience," : "";
					Text.Add("You’ll take the mocking words,[audience] any verbal or physical abuse that your mistress dishes out, because one thing is clear to you. You love this.", parse);
				}
				Text.Add(" It hurts, yes.", parse);
				Text.NL();
				Text.Add("At first.", parse);
				Text.NL();
				Text.Add("But before long, the pain is swallowed by a far greater sensation, intense pleasure. Each time Miranda rams her immense rod home, it sends another jolt of blissful ecstasy up your spine. You find yourself moaning loudly, any shreds of defiance long reduced to dust by the inexorable thrusting of her hips.", parse);
				Text.NL();
				Text.Add("<i>“Better hope you are ready for this,”</i> Miranda grunts.", parse);
				Text.NL();
				if(first)
					Text.Add("It quickly becomes very apparent what she is referring to, as the next push brings a new experience. You didn’t think that your ass could be stretch any more than it already is, but the guardswoman is eager to prove you wrong.", parse);
				else
					Text.Add("Once again, you feel an old friend probing your back door, spreading your colon further.", parse);
				Text.Add(" Even before it has begun to swell, her knot is formidable - quite a bit thicker than her already girthy shaft. It takes some effort to ram the ball home, but Miranda isn’t one who is going to let that hinder her. With a final slam of her hips, she pushes it inside, buried to the root in your tortured anus.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>“Another cherry popped, score one Miranda!”</i> the herm boasts, pumping her fist.", parse);
				}, 1.0, function() { return virgin; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Does that hurt? Knot my problem, slut,”</i> she says, mockingly.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Feel comfortable? Cause I’m not going anywhere any time soon.”</i> No doubt she’s right - once that knot starts to swell, there is no way you are getting it out.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					parse["heshe"] = player.mfTrue("he", "she");
					Text.Add("<i>“Told you [heshe] could take it,”</i> Miranda boasts to her colleagues.", parse);
				}, 1.0, function() { return audience; });
				
				scenes.Get();
				
				world.TimeStep({hour: 1});

				Text.NL();
				Text.Add("The guardswoman is not quite done with you, further breaking down your anal defenses but repeatedly pulling her knot out of your [anusDesc], followed by slamming it home again. Just like with the initial penetration, the pain soon gives way to pleasure so intense you fear it will break your mind.", parse);
				if(player.FirstCock())
					Text.Add(" Even now, before it has swelled to its full size, her knot presses against your prostate with each violation.", parse);
				Text.NL();
				Text.Add("Just when you feel you can’t take any more without being torn apart, Miranda moans loudly, finally reaching her limit. Her hot seed flooding your insides, and her rapidly growing knot tying the the of you together, quickly triggers your own inevitable climax.", parse);
				if(player.FirstCock()) {
					Text.Add(" Your seed splatters harmlessly on the ground, pumped from your twitching [multiCockDesc].", parse);
					player.OrgasmCum();
				}
				if(player.FirstVag())
					Text.Add(" Even untouched, your [vagDesc] still tingles, flowing with your clear, glistening girlcum.", parse);
				Text.NL();
				Text.Add("Wrecked by waves of pleasure, you doubt you’d be able to stand upright if not for Miranda’s hands on your hips. You discover it to be impossible to move, firmly stuck and at her mercy until her knot shrinks down to manageable size again.", parse);
				Text.NL();
				if(first)
					Text.Add("<i>“Better settle in, we’ll be here for a while,”</i> Miranda pants, lying down on your back. <i>“For some reason, I never have anyone run out on me. Must be my charisma.”</i> That and the knot currently sealing your asshole shut. Damn thing feels like its the size of a melon.", parse);
				else if(audience) {
					Text.Add("You yelp loudly as Miranda sits back down on her bench, dragging you with her by your ravaged sphincter. She lets you lie back and rest, chatting with the other guards as you wait for her knot to deflate. You are too exhausted to glean much from the conversation, though you can tell that they are talking about you. Perhaps deciding who gets to go next.", parse);
					if(Math.random() < 0.5) {
						Text.NL();
						Text.Add("<i>“Sure, but you owe me one,”</i> you hear Miranda saying. Flicking your eyes open, you see the fuzzy outline of one of the guards standing in front of you. Before you really have any time to contemplate what he is doing, you feel the hot splatter of spunk landing on your [breastDesc].", parse);
						Text.NL();
						Text.Add("By the time the entire patrol has deposited their loads, you are covered in cum, both inside and out. Humiliated beyond belief, yet unable to will your tired limbs into action, you have no choice but to lie there and take it.", parse);
					}
				}
				else
					Text.Add("<i>“I wonder how many times I have to come before it comes out the other end,”</i> Miranda ponders, rubbing your [stomachDesc]. From the tone in her voice, you can tell it isn’t just her making a jab at you, she really wants to know. You just hope she doesn’t decide to test it.", parse);
				Text.Flush();
				
				player.AddLustFraction(-1);
				var mCum = miranda.OrgasmCum();
				miranda.relation.IncreaseStat(50, 1);
				miranda.subDom.IncreaseStat(100, 1);
				player.subDom.DecreaseStat(-100, 1);
				player.slut.IncreaseStat(80, 1);
				
				miranda.flags["gAnal"]++;
				
				Gui.NextPrompt(function() {
					Text.Clear();
					
					Text.Add("Eventually, Miranda’s knot shrinks down again to merely unmanageable size. With a grunt and a rough shove, the herm dislodges herself from your abused anus, laughing as you fall to the ground. What feels like several gallons of her semen pours out of your gaping butt. You still feel weak and extremely sore after the rough fuck, but you should be able to move again shortly.", parse);
					Text.NL();
					Text.Add("<i>“This time is for free. Ain’t I a generous soul?”</i> The dommy doggie wipes herself off on you before pulling on her pants again, trying to restore her disheveled uniform.", parse);
					Text.NL();
					if(rigard.GatesOpen()) {
						Text.Add("<i>“Well, go ahead, enter. Unless you want to stay for another round,”</i> Miranda waves you toward the gates, not even bothering to get up and open them for you. Hobbling slightly, you make your way inside the city.", parse);
						Text.Flush();
						
						Gui.NextPrompt(function() {
							MoveToLocation(world.loc.Rigard.Residental.street, {minute : 10});
						});
					}
					else {
						Text.Add("<i>“Oh right, look at the time,”</i> Miranda grins widely as she adjusts her clothes. <i>“Gates are closed, bitch, better luck next time.”</i> She pats her package fondly. <i>“If you don’t have anything else on your agenda, little Miranda will soon be up for another round...”</i>", parse);
						Text.Flush();
						
						Gui.NextPrompt();
					}
				});
			}, enabled : true,
			tooltip : "What if she gets to fuck you?"
		});
	}
	Gui.SetButtonsFromList(options, true);
}

Scenes.Miranda.WelcomeToRigard = function() {
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	miranda.flags["Met"] = Miranda.Met.Met;
	
	if(party.Two())
		parse["comp"] = " and " + party.Get(1).name;
	else if(!party.Alone())
		parse["comp"] = " and your companions";
	else
		parse["comp"] = "";

	Text.Clear();
	Text.AddOutput("You set out toward the large city of Rigard, announced by a weathered sign next to the road. The city is built on a tall hill, and a wide river snakes its way past the far side. On the top of the hill stands a castle, its thick walls jutting out from the bedrock and reaching for the heavens. The city itself spreads out below it, divided into several levels by the steep slope.", parse);
	Text.Newline();
	Text.AddOutput("Though you see stone walls surrounding Rigard, you notice that there is a large number of residencies beyond their limits, especially toward the waterfront, where a sprawling slum stretches along the river.", parse);
	Text.Newline();
	if(party.InParty(kiakai)) {
		Text.AddOutput("As you walk, [name] brings you up to date on the city. Rigard is the largest city on Eden, and the capital of the kingdom holding sway over a large part of the island.", parse);
		Text.Newline();
		Text.AddOutput("<i>“I have heard that there is some difficulty entering the city,”</i> the elf informs you, <i>“but since I am a servant of Lady Aria, there should be no problem getting in. The rulers of the kingdom have always been good friends of the order.”</i>", parse);
	}
	else {
		Text.AddOutput("While you don't really know much of the Rigard, other than it seems to be the largest city you have seen so far, possibly the largest on Eden, it is probably a good place to gather information.", parse);
	}
	Text.Newline();
	if(rosalin.flags["Met"] != 0) {
		Text.AddOutput("If you could get inside the city, there is a possibility you could get a hold of Rosalin's former teacher, a person who sounds like she could help you out with the gemstone.", parse);
		Text.Newline();
	}
	if(world.time.hour >= 22 || world.time.hour < 6)
		Text.AddOutput("As you come closer, you are guided by the light of torches, illuminating a large gate in the wall surrounding the city. It is currently shut for the night. You spot torches drifting along the top of the walls, carried by patrolling guards, another two of whom are posted outside the gatehouse.", parse);
	else // 6-22
		Text.AddOutput("As you come closer, you spot a short line of people, most of them farmers, waiting to be let into the city. There are a few guards posted on top of the walls, and another group guarding the gate. You patiently await your turn, as the last wagon in front of you is inspected and allowed inside.", parse);
	Text.Newline();
	Text.AddOutput("One of the guards, a striking female dog-morph with short dark fur, steps forward to meet you, toying with the pommel of a short sword strapped to her hip. She flicks a lock of black hair out of her eyes, looking you over curiously.", parse);
	Text.Newline();
	Text.AddOutput("<i>“Reason for visiting Rigard? Carrying any illegal substances? Planning to kill any important officials?”</i> she drones mechanically, going through her routine while allowing her gaze to unabashedly roam your body. Not to be outdone, you return the gesture.", parse);
	Text.Newline();
	Text.AddOutput("She is tall and athletic, her movements suggesting powerful muscles beneath her short fur - mostly black or dark brown, with patches of a bright orange on her hands, legs, chest and face. Her long black hair is pulled back in a loose braid hanging down to her waist. Strangely enough, you note that it is held together by a pink ribbon, very much at odds with her otherwise martial outfit.", parse);
	Text.Newline();
	Text.AddOutput("Said outfit does a poor job of containing her generous bust, which seems to be ready to spring out at any moment. Her uniform is made from tight-fitting studded leather, with a short leather skirt that ends just above the knees. As the guardswoman shifts her hips, something seems to move under the skirt.", parse);
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.AddOutput("<i>“Hey, eyes up here,”</i> she barks sharply, slightly amused. <i>“Well?”</i> she challenges, holding out her hand. A bit embarrassed, you realize that you completely spaced out for a second there. <i>“Visitor's pass?”</i> she repeats her question.", parse);
		Text.Newline();
		
		if(party.InParty(kiakai)) {
			Text.AddOutput("<i>“Ah, madam, excuse me?”</i> [name] piques in. The guardswoman turn her icy stare on the elf. [HeShe] shrinks back a little, swallowing. <i>“Um, you see, I am from the order-”</i>", parse);
			Text.Newline();
			Text.AddOutput("<i>“Do you have a pass?”</i> the dog-morph cuts [himher] off. The elf looks crestfallen, shaking [hisher] head miserably. <i>“Then I'm afraid I can't let you in.”</i>", parse);
		}
		else
			Text.AddOutput("You shake your head, bewildered. This is the first you've heard of this.", parse);
		Text.Newline();
		Text.AddOutput("<i>“Look, I'm sorry,”</i> the guard apologizes. <i>“New directives from above, I can't let anyone into the city without a valid pass.”</i> You ask her where one would get such a pass. <i>“From the identification bureau, corner of Bankers' and Minstrel street.”</i>", parse);
		Text.Newline();
		Text.AddOutput("What? It is <i>inside</i> the city?", parse);
		Text.Newline();
		Text.AddOutput("<i>“Look, I didn't say it made sense, but it's the law,”</i> she sighs, exasperated, <i>“I'd like to let you in, but I just can't. You've shown up in times of unrest, the royals and noble families are very suspicious of strangers, what with the outlaw insurgency going on.”</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>“Is there a problem, Miranda?”</i> The dog-morph's partner, a muscular guardsman sporting feline ears.", parse);
		Text.Newline();
		Text.AddOutput("<i>“Nosir, no problem sarge,”</i> the woman - apparently named Miranda - replies languidly. She somehow manages to make this sound mocking. Grumbling, her superior shrugs, heading inside again. The dog-morph rolls her eyes.", parse);
		Text.Newline();
		Text.AddOutput("<i>“Well, you got mine, what's yours?”</i>", parse);
		Text.Newline();
		Text.AddOutput("Seeing as you don't seem to be getting anywhere, you introduce yourself[comp].", parse);
		Text.Newline();
		Text.AddOutput("<i>“A pleasure,”</i> Miranda grins.", parse);

		Scenes.Miranda.WelcomeToRigardPASS    = true;
		Scenes.Miranda.WelcomeToRigardOUTLAWS = true;
		Scenes.Miranda.WelcomeToRigardMIRANDA = true;

		Scenes.Miranda.WelcomeToRigardQnA();
	});
}

Scenes.Miranda.WelcomeToRigardQnA = function() {
	
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer(),
		
		guygirl : player.body.femininity.Get() > 0 ? "girl" : "guy"
	};
		
	//[Pass][Outlaws][Miranda]
	var options = new Array();
	if(Scenes.Miranda.WelcomeToRigardPASS)
		options.push({ nameStr : "Pass",
			func : function() {
				Text.Clear();
				Text.AddOutput("<i>“As I said, the only way to legitimately obtain a pass is to apply for one inside the city itself. That can be quite a bothersome process, though,”</i> Miranda explains. <i>“Another way to get inside is to have someone reputable vouch for you. There are a great number of traders and farmers entering and leaving the city daily, and any one of those could provide you entry.”</i>", parse);
				Text.Newline();
				Text.AddOutput("She shakes her head at your brightening expression.", parse);
				Text.Newline();
				Text.AddOutput("<i>“Don't get your hopes up too high. Due to the harsh punishment for harboring outlaws, knowingly or not, don't expect people to open up that easily to you. I'm sure you're a nice [guygirl], but these are suspicious times.”</i>", parse);
				
				Scenes.Miranda.WelcomeToRigardPASS = false;
				Scenes.Miranda.WelcomeToRigardQnA();
			}, enabled : true,
			tooltip : "Ask where one could acquire a pass."
		});
	if(Scenes.Miranda.WelcomeToRigardOUTLAWS)
		options.push({ nameStr : "Outlaws",
			func : function() {
				Text.Clear();
				Text.AddOutput("<i>“You really aren't from around here, are you?”</i> the dog-morph looks at you suspiciously. <i>“I'd have a hard time believing there's someone who isn't familiar with the war and the current tension resulting from it.”</i>", parse);
				Text.Newline();
				Text.AddOutput("<i>“I say war, but it was really more of an insurgency, rich merchant families and their allies standing up against the authority of the king. It was an ugly, ugly mess, and though most of the ringleaders were rounded up, there are still some active today. More than that, others have joined their ranks. Deserters from the army, men with prices on their heads, common criminals and murderers, the list goes on. Most of these 'freedom fighters' are little more than bandits.”</i>", parse);
				Text.Newline();
				Text.AddOutput("<i>“From what I've heard, there is a large group of them holed up somewhere in the forest,”</i> she tells you, motioning toward the dark trees off in the distance. <i>“That said, by the amount of unrest in Rigard right now, you'd almost suspect their base was in the city!”</i>", parse);
				
				Scenes.Miranda.WelcomeToRigardOUTLAWS = false;
				Scenes.Miranda.WelcomeToRigardQnA();
			}, enabled : true,
			tooltip : "Ask her about this outlaw insurgency she mentioned."
		});
	if(Scenes.Miranda.WelcomeToRigardMIRANDA)
		options.push({ nameStr : "Miranda",
			func : function() {
				Text.Clear();
				Text.AddOutput("<i>“Me?”</i> She purses her lips, studying you thoughtfully. <i>“I'm not anyone that special... well, besides being the best fighter the watch's got.”</i> Her confident stance and athletic build give you the impression that this isn't just bravado. Still... curiously, you ask why she is posted watching the gates if she is so important?", parse);
				Text.Newline();
				Text.AddOutput("<i>“Nice comeback,”</i> she grins. <i>“You could say I haven't exactly made many friends upstairs. That, and people of my kind aren't really appreciated in Rigard as of late.”</i> People of her... kind?", parse);
				Text.Newline();
				Text.AddOutput("<i>“Fur, ears, tail, tell you nothing?”</i> she waves at her appearance, a little annoyed. <i>“I'm a dog-morph, not a human. In Rigard, that makes a large difference.”</i> Clearly not a topic she wants to linger on, so you drop it.", parse);
	
				Scenes.Miranda.WelcomeToRigardMIRANDA = false;
				Scenes.Miranda.WelcomeToRigardQnA();
			}, enabled : true,
			tooltip : "Ask Miranda about herself."
		});
	
	if(options.length > 0)
		Gui.SetButtonsFromList(options);
	else
		Gui.NextPrompt(Scenes.Miranda.WelcomeToRigardEnd);
}

Scenes.Miranda.WelcomeToRigardEnd = function() {
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};
	
	if(party.Two())
		parse["comp"] = " and " + party.Get(1).name;
	else if(!party.Alone())
		parse["comp"] = " and your companions";
	else
		parse["comp"] = "";
		
	Text.Clear();
	Text.AddOutput("<i>“I enjoyed talking with you, believe it or not, but I've got a job to do here,”</i> she walks back to her post, looking at you over her shoulder. <i>“If you'd like to continue this conversation in a more... casual setting,”</i> she quips, hips swaying suggestively, <i>“meet me after work in the slums. There is a tavern there called the Maidens' Bane. We can hit the town, get to know each other a bit, eh?”</i>", parse);
	Text.Newline();
	Text.AddOutput("Quite the bold vixen, Miranda. You say your goodbyes and tell her you'll think about it.", parse);
	Text.Newline();
	Text.AddOutput("Now... how should you proceed? Talking with Miranda has given you a few ideas on how to get into the capital.", parse);
	Text.Newline();
	Text.AddOutput("From what the dog-morph said, farmers should be able to bring in hired help, which might give you temporary access to the city. ", parse);
	if(gameCache.flags["FarmFound"] != 0)
		Text.AddOutput("Perhaps you could ask Gwendy about it.", parse);
	else
		Text.AddOutput("Perhaps you could find a friendly farmer on the great plains.", parse);
	Text.Newline();
	Text.AddOutput("Miranda herself seems like she isn't really the sort to bow to authority. She is at work now, but perhaps she could be persuaded to let you into the city if you meet up with her in the slums during the evening hours.", parse);
	Text.Newline();
	Text.AddOutput("Failing all else, if those outlaws are as crafty as the guardswoman made them out to be, they should have some way of accessing the city. ", parse);
	if(gameCache.flags["OutlawsRep"] != 0)
		Text.AddOutput("Asking Zenith or Maria could perhaps give you a clue on how to proceed.", parse);
	else
		Text.AddOutput("From what Miranda said, they are probably holed up somewhere in the forest... perhaps it's worth seeking them out.", parse);
	world.TimeStep({hour : 1});
	Gui.NextPrompt();
}

Scenes.Miranda.CatchThatThief = function() {
	miranda.flags["Thief"] = 1;

	parse = {};
	if(party.Two())
		parse["comp"] = " and " + party.Get(1).name;
	else if(!party.Alone())
		parse["comp"] = " and your companions";
	else
		parse["comp"] = "";
	Text.Clear();
	Text.Add("As you[comp] walk down the street, you become aware of a disturbance quickly moving your way. You deftly move out of the way as a man shoulders past you, running at full speed. He is dressed in cheap, dirty commoners clothes, probably just a thug from the waterfront district. In his hands, he is clutching a tightly wrapped bundle.", parse);
	Text.NL();
	Text.Add("Just as you begin to process all of this, three pursuers dash by, dressed in the uniforms of the Rigard city guard. While they look determined, the thief is lighter on his feet, unencumbered by armor as he is. For a while, it seems certain that he will escape their clutches and disappear down some alley, but his hopes are suddenly dashed by a whirling tornado of dark fur and hard muscle.", parse);
	Text.NL();
	Text.Add("Just as the man is passing by a shady passageway, Miranda the dog-morph guardswoman intercepts him, easily wrestling the thief to the ground despite his greater weight. He struggles a bit, but quiets down when the dobie tightens her hold, threatening to dislocate his shoulder.", parse);
	Text.NL();
	Text.Add("<i>“You’ve been a bad boy,”</i> Miranda murmurs, a gleeful smile playing on her lips, <i>“didn’t your mommy tell you not to steal?”</i> The poor thief grunts an unflattering remark, summarily ignored by the guardswoman. Laughing, she hoists the criminal over her shoulder like a sack of grains. As the procession of guards heads towards the barracks, the victor cups a feel on her captive’s butt, shamelessly groping the poor man.", parse);
	Text.NL();
	Text.Add("<i>“Caught red-handed with his fingers in the cookie jar eh?”</i> the guard chuckles. <i>“You are lucky that you weren’t caught by the royal guard, they’d likely have chopped your hands off for this transgression. Now, you’ll just have to endure a few nights in our comfy cells awaiting your trial.”</i> The dobie pats the thief’s bum possessively, ignoring his whimpering protests. <i>“Look forward to a few visits from me. I know <b>just</b> the punishment for bad boys.”</i> You almost feel bad for the guy.", parse);
	Text.NL();
	Text.Add("The group disappear around a corner, their continued conversation muffled by the sounds of the bustling city.", parse);
	Text.Flush();
	
	world.TimeStep({minute : 30});
	
	Gui.NextPrompt();
}

// Add catch thief as explorable event
world.loc.Rigard.Slums.gate.enc.AddEnc(function() { return Scenes.Miranda.CatchThatThief; }, 1.0, function() { return miranda.flags["Thief"] == 0 && miranda.OnPatrol(); });
world.loc.Rigard.Residental.street.enc.AddEnc(function() { return Scenes.Miranda.CatchThatThief; }, 1.0, function() { return miranda.flags["Thief"] == 0 && miranda.OnPatrol(); });
world.loc.Rigard.Gate.enc.AddEnc(function() { return Scenes.Miranda.CatchThatThief; }, 1.0, function() { return miranda.flags["Thief"] == 0 && miranda.OnPatrol(); });
world.loc.Rigard.ShopStreet.street.enc.AddEnc(function() { return Scenes.Miranda.CatchThatThief; }, 1.0, function() { return miranda.flags["Thief"] == 0 && miranda.OnPatrol(); });

Scenes.Miranda.HeyThere = function() {
	var parse = {
		boygirl : function() { return player.mfFem("boy", "girl"); }
	};
	
	miranda.flags["Met"] = Miranda.Met.Tavern;
	
	Text.Add("As you walk into the dimly lit bar your eyes find Miranda, the guardswoman, sitting in a corner by herself. The tall and curvy dog-morph is wearing tight leather pants laced with green cloth tucked into her high boots, and a very suggestive top piece exposing a fair amount of her cleavage. She notices you and motions you over, patting the bench beside her.", parse);
	Text.NL();
	Text.Add("You walk over and have a seat, while she calls for some more booze. You talk for a while, as she tells you about herself and her job in town.", parse);
	if(miranda.flags["Thief"] != 0) {
		Text.NL();
		Text.Add("When you mention her aggressive take down of the thief you saw earlier, she blush faintly and avoids your eyes.", parse);
		Text.NL();
		Text.Add("<i>“Well, he <b>was</b> a thief,”</i> she says defensively, <i>“can't be too lenient now, can we.”</i> She sips a bit at her booze thoughtfully. <i>“Though I enjoyed that a bit more than what I should have maybe... was a while since I had a really good time,”</i> she says quizzically. She shifts around uncomfortably in her seat.", parse);
		Text.Flush();
		
		//[Sure][Nah]
		var options = new Array();
		options.push({ nameStr : "Drop it",
			func : function() {
				Text.Clear();
				Text.Add("Moving on...", parse);
				
				Scenes.Miranda.HeyThereCont();
			}, enabled : true,
			tooltip : "Talk about something else."
		});
		options.push({ nameStr : "Inquire",
			func : function() {
				Text.Clear();
				Text.Add("<i>“What do you mean?”</i> you ask her. She gives you a long look, weighing you up, before deciding what to say.", parse);
				Text.NL();
				Text.Add("<i>“It means that I get a bit randy at times and sometimes lose control a bit. Nothing to worry about though.”</i> She reaches over and squeezes your butt a bit. <i>“Might be fun though.”</i> She grins as you blush.", parse);
				
				player.AddLustFraction(0.1);
				miranda.AddLustFraction(0.1);
				
				Scenes.Miranda.HeyThereCont();
			}, enabled : true,
			tooltip : "What does she mean by ‘good time’?"
		});
		options.push({ nameStr : "Flirt",
			func : function() {
				Text.Clear();
				Text.Add("The booze is getting a bit to your head, and you are finding it more difficult to keep your eyes to the more civilized parts of the shapely woman sitting beside you. You shift a bit closer to her until you touch her thigh with you leg, and murmur softly: <i>“<b>I</b> could show you a good time.”</i>", parse);
				Text.NL();
				Text.Add("Miranda, in the middle of chugging down a mug of booze, almost chokes as she starts coughing and wheezing uncontrollably. When she eventually winds down, you realize that she is giggling drunkenly. She leans over to get another bottle, the side of her huge breasts brushing against your arm as she reaches past you. ", parse);
				Text.NL();
				Text.Add("<i>“Down, [boygirl]!”</i> she says jokingly, <i>“and be careful what you wish for!”</i> You can tell she is turned on though, and she doesn't move away from you.", parse);
				
				player.AddLustFraction(0.3);
				miranda.AddLustFraction(0.3);
				
				Scenes.Miranda.HeyThereCont();
			}, enabled : true,
			tooltip : "Make a move on her."
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Scenes.Miranda.HeyThereCont();
	}
}

Scenes.Miranda.HeyThereCont = function() {
	var parse = {};
	
	Text.NL();
	Text.Add("The booze starts to stack up as you continue to talk into the night. You tell her a bit about yourself and your adventures so far, and she contributes witty comments and suggestive remarks.", parse);
	Text.NL();
	
	Scenes.Miranda.Chat();
	Gui.Callstack.push(Scenes.Miranda.HeyThereCatPorn);
	Gui.Callstack.push(Scenes.Miranda.Chat);
	Gui.Callstack.push(Scenes.Miranda.Chat);
}

Scenes.Miranda.HeyThereCatPorn = function() {
	var parse = {
		breastDesc    : function() { return player.FirstBreastRow().Short(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		buttDesc      : function() { return player.Butt().Short(); }
	};
	
	parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";
	parse["s"]        = player.NumCocks() > 1 ? "s" : "";
	parse["oneof"]    = player.NumCocks() > 1 ? " one of" : "";
	
	Text.Clear();
	
	Text.Add("It is growing late, and more customers are slowly streaming into the bar. In a back room you hear loud sounds of merriment and shouts of encouragement; there seems to be some kind of fight going on. Miranda sighs contently and cups her face in a fuzzy paw and surveys the room. ", parse);
	Text.NL();
	Text.Add("<i>“I like thish place,”</i> she expresses loudly, <i>“sure it’s a shithole, but there is great booze to be had, and good company!”</i> She coos and points over into a corner. <i>“And sometimes, raunchy entertainment!”</i>", parse);
	Text.NL();
	Text.Add("You glance over and see two cat-morphs snuggling in a corner booth, one male and one female. The male cat whispers something in his companions ear which makes her grin excitedly and reach down and squeeze his crotch. The slender feline bites at her lover's ear playfully, then starts to lower herself onto her knees, all the while caressing him. She undoes his pants and reveals his surprisingly large and very excited cock. He blissfully leans back as she starts to work on the shaft with both her hands and her mouth.", parse);
	Text.NL();
	Text.Add("The pair draw a few more spectators as the catgirl really starts to go down on her lover's manhood, deep-throating it while massaging his testicles. You and the dog-morph besides you are both mesmerized by the display. It only lasts for another minute, when the man moans loudly, grabbing the catgirl by her head and shoving it down on his cock. Slurping noises can be heard from across the room as she greedily drinks up load after load of his feline cum.", parse);
	Text.Flush();
	
	player.AddLustFraction(0.3);
	miranda.AddLustFraction(0.3);
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("You hear a loud thump behind you as you watch the aftermath of the show. Miranda is squirming in her seat a bit, hands under the table in front of her. She is looking very flushed and <i>very</i> drunk, her orange eyes half closed in bliss. She dizzily gazes your way, muttering below her breath.", parse);
		Text.NL();
		Text.Add("<i>“Ooh... now you've gonesh and done itsh!”</i> There is a hungry look in her eyes. The dog-girl is trembling slightly, and her hands are busy below the table, buried between her legs.", parse);
		Text.Flush();
		
		//[Comfort][Check]
		var options = new Array();
		options.push({ nameStr : "Comfort",
			func : function() {
				Text.Clear();
				Text.Add("You shuffle closer and puts an arm around her.", parse);
				Text.NL();
				Text.Add("<i>“What's wrong?”</i> you ask innocently.", parse);
				Text.NL();
				Text.Add("<i>“'s jusht... haaaah... a little hot, dear, I'll be fine,”</i> she pants, <i>“all of this made me a bit exschited.”</i> She is shamelessly pawing herself between her thighs, though her hands are covered in shadows by the dim lighting inside the tavern.", parse);
				Text.NL();
				Text.Add("You are not quite sure what's going on, but you hold onto her as she gasps and rides out her small orgasm. She leans against your chest contently, tired from the ordeal. After she has rested a bit, she reaches up and give your cheek a quick kiss.", parse);
				Text.NL();
				Text.Add("<i>“Thanks honey, that wash sweet of you,”</i> she is a bit unsteady on her feet when she gets up, so she leans on your shoulder for support. The two of you walk out into the cool night together.", parse);
				Text.NL();
				Text.Add("The breeze seems to revive Miranda a bit, and she bids you goodbye, heading home.", parse);
				Text.NL();
				Text.Add("<i>“Ah had a really good time, we should do this again later!”</i> she exclaims to you. She gives you a last nuzzle, squeeze your arm and unsteadily walks of into the night. A faintly glistening trail of sticky liquid slowly drops down one of her legs, forming small pools behind her.", parse);
				Text.Flush();
				
				miranda.relation.IncreaseStat(100, 5);
				miranda.subDom.DecreaseStat(-100, 5);
				
				world.TimeStep({hour : 4});
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Far be it for you to take advantage of the poor girl."
		});
		options.push({ nameStr : "Check",
			func : function() {
				Text.Clear();
				Text.Add("As you lean in closer, you notice that her hands are moving back and forth between her legs, stroking something. She is gasping now, short on breath and with her tongue sticking out. You drop under the table, curious about what she is doing. At first she squirms a bit and crosses her legs, but then concedes and spreads her legs.", parse);
				Text.NL();
				Text.Add("Even in the dim candlelight of the tavern, it’s quite a sight to behold: Miranda has undone her pants, her dripping vagina free for you to see, but that is not what draws your eyes. Between the distraught dog-girl's thighs is a huge and very erect cock, at least ten inches long and as thick as her arm.", parse);
				Text.NL();
				Text.Add("About a third of it is covered by a furry sheath, but the rest is out in the air, in all its glory. Large veins pulse along the very large member, from the thick knotted base, where her apple-sized testicles hang, heavy with seed, to the pointed tip. Miranda is excitedly pumping on the dick with both hands, her ragged gasps growing exceedingly more urgent. Alarmed, you realize that you are right in the line of fire.", parse);
				Text.NL();
				Text.Add("<b>You now know Miranda is a herm (duh).</b>", parse);
				Text.Flush();
				
				miranda.flags["Herm"] = 1;
				
				//[Flee!][Watch][Help her]
				var options = new Array();
				options.push({ nameStr : "Flee!",
					func : function() {
						Text.Clear();
						Text.Add("A slightly panicked look on your face, you exclaim that she needs another drink, and hurries over to the bar to get one. When you get back, Miranda has calmed down a little bit, looking slightly annoyed. After finishing half the drink, she declares that she has to go home. She stumbles away from you, heading for the exit.", parse);
						Text.NL();
						Text.Add("As she passes by, you could swear there is a spark of anger in her eyes, though she doesn’t act on it. You let out a ragged sigh of relief and go back to your drink.", parse);
						
						miranda.flags["Attitude"] = Miranda.Attitude.Dismiss;
						miranda.relation.DecreaseStat(-100, 10);
						
						Text.Flush();
						
						world.TimeStep({hour : 4});
						
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : "Nope the fuck out of there."
				});
				options.push({ nameStr : "Watch",
					func : function() {
						Text.Clear();
						Text.NL();
						Text.Add("Mesmerized by the bobbing rod in front of you, you can't decide what you should do; move out of the way or throw yourself at it. The slight dribble of drool from your mouth is matched by a growing bead of precum on the tip of Miranda's shaft.", parse);
						Text.NL();
						Text.Add("Dazed, you move in closer and study the massive erection if front of you. Miranda lovingly strokes her member, embarrassed at the show she is giving you, but too far gone to care. You notice that the knot at the base of her cock starts to swell, and that her hands are moving more rapidly.", parse);
						Text.NL();
						parse["hair"] = player.Hair().length.Get() > 3 ? " through your hair" : "";
						Text.Add("A slight moan escapes her lips as you violently get hurled back into reality by the first blast of cum. It hits you full in the face, making you to flinch as it splatters across your upturned features. The next two follow the first one, while the fourth load, as big and as powerful as the previous three, shoots slightly higher and leaves a long streak of canid love juice trailing[hair] and down your back. Miranda moans loudly as the next few blasts land on you chest, thoroughly hosing you.", parse);
						Text.NL();
						Text.Add("After what seems like two minutes, the torrent of semen finally slows down. Miranda looks down blissfully as you experimentally open your mouth and taste the thick substance. It’s salty, and burns on your tongue. A bit unsure of yourself, you look up at the hermaphrodite in front of you. She seems as surprised as you are, but she reaches down and pulls you up. She gives you a sloppy kiss, removing some of the spooge from your face.", parse);
						Text.NL();
						Text.Add("<i>“Well, you certainly took that better than I expected,”</i> she murmurs into your ear. Suddenly you realize that everyone in the bar is staring at you. Blushing furiously, the two of you hastily pick yourselves up and head towards the exit. Outside, Miranda gives you a hug and smiles at you.", parse);
						Text.NL();
						Text.Add("<i>“We have to do that again sometime honey... sometime soon.”</i> She grins wickedly, <i>“you should probably get yourself cleaned up for now though.”</i> She tucks her now softening member back into her tight leather pants, its size making you wonder how it could ever fit there in the first place. She leaves you standing in the dark street, covered in sticky girl-cum.", parse);
						Text.Flush();
						
						miranda.flags["Attitude"] = Miranda.Attitude.Nice;
						miranda.relation.IncreaseStat(100, 5);
						miranda.subDom.IncreaseStat(100, 10);
						var mCum = miranda.OrgasmCum();
						
						world.TimeStep({hour : 5});
						
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : "You can’t miss this show."
				});
				options.push({ nameStr : "Help her",
					func : function() {
						Text.Clear();
						Text.Add("In a haze of alcohol and arousal, you lean in closer and softly touch the bulging cock in front of you. After a slight hesitation, you grab it more firmly. Miranda's hands freeze, and she looks down at you, a bit surprised.", parse);
						Text.NL();
						Text.Add("<i>“Wow, forward, aren’t we?”</i> She blushes slightly, withdrawing her hands from her crotch. She spread her legs wider to give you room, as you position yourself between her thighs before the rigid monster. First slowly, then more confidently, you start to stroke her shaft, hands moving up and down the massive length, a touch here, a squeeze there.", parse);
						Text.NL();
						Text.Add("You begin to slowly pump her with one hand, while exploring her body with the other. Lovingly, you touch the insides of her thighs, fondle her large balls, play with her sopping pussy and rub her thick knot at the base of her cock. The lustful hermaphrodite is definitely aware of all your efforts, softly goading you on.", parse);
						Text.NL();
						Text.Add("<i>“Oooh, you are good!”</i> she huffs, one of her hands starts to play with her large breasts, teasing the nipples below the rough fabric of her dress into alertness. The other one reaches down to you head and gently guides you forward until your lips are touching the tip of her cock. <i>“Do a girl a favor?”</i> she looks down at you, her ragged breath making her breasts heave.", parse);
						Text.NL();
						Text.Add("You look into her eyes for a long moment. There is a spark there, but of what? Slowly, you open your mouth and lick the tip. The taste is salty and delicious, raising your own arousal even more. Hungrily you wrap your lips around it and start giving the dog the blowjob of her life.", parse);
						Text.NL();
						
						Sex.Blowjob(player, miranda);
						player.FuckOral(player.Mouth(), miranda.FirstCock(), 3);
						miranda.Fuck(miranda.FirstCock(), 3);
						
						if(player.FirstVag()) {
							Text.Add("The moistness between your thighs is maddening, and you reach down to fondle your nether lips while happily slurping at the cock in front of you. Your fingers play around with your labia for a bit, before finding your clit and massaging it. You moan around the beast in your throat as your masturbation brings you closer to your own climax. Miranda notices you, and pants:", parse);
							Text.NL();
							Text.Add("<i>“Don't worry about that, honey, I can help you out... just as soon as you are finished down there.”</i>", parse);
							Text.NL();
						}
						if(player.FirstBreastRow().size.Get() < 3) {
							Text.Add("Your tits heave with your ragged breath as you go down on Miranda. After a while, you stop for a breather, and playfully place the thick cock between your [breastDesc], stroking up and down slowly and drawing soft encouraging moans from Miranda. The dick is so soaked in your saliva that it’s glistening in the soft candlelight.", parse);
							Text.NL();
							Text.Add("After some intense tit-fucking, a hand tilts your chin up. Miranda looks down at you insistently, and you relent and get back down to business, your lips wrapping about her thick dong.", parse);
							Text.NL();
						}
						if(player.FirstCock()) {
							Text.Add("One of your hands sneak down to free your [multiCockDesc] from [itsTheir] confines. You realise that you are just as hard as Miranda is, and begin to pleasure yourself in time with your bobbing head, your hand moving rapidly up and down[oneof] your member[s].", parse);
							Text.NL();
						}
						
						Text.Add("Your continue to suck on her huge dog-dick, hands moving to pleasure the part of her length you simply cannot force down your throat. Dollops of precum leak down your from your lips, while inside your overfull mouth, Miranda's tool begins to swell even more. You can feel the heat radiating from her heaving scrotum and see the growing knot in front of you, and realise she is very close to the edge.", parse);
						Text.NL();
						Text.Add("Repressing your gag reflex, you grab her ample butt and push yourself forward until your nose rests in her furry crotch. Miranda cries out loudly in pleasure - probably alerting the few patrons not already aware of what was going on - and grabs the back of your head, holding you down. In short rapid strokes she fucks your ragged throat mercilessly, until she finally hits her peak.", parse);
						Text.NL();
						Text.Add("As her huge member begins to twitch violently in your mouth, you can feel the thick semen being deposited right into your stomach, load after hot load. Just before you black out from a lack of air, Miranda pulls out enough for you to breathe. You cough as a few more spurts hit your face, but you feel proud that most of her large load now resides in your slightly distended stomach.", parse);
						
						var mCum = miranda.OrgasmCum();
						
						Text.NL();
						Text.Add("You eagerly lick your lips and gives the cock before you a few more slurps, cleaning it up. Miranda smiles down on you with a very satisfied look on her face as you greedily swallow every ounce of thick sperm you can get your lips on. As you climb up from your kneeling position, you realize that the room is silent and everyone's eyes are honed at the two of you. Quite a few of the patrons are openly stroking themselves.", parse);
						Text.NL();
						Text.Add("<i>“I think we just outmatched the felines from earlier, honey,”</i> Miranda says as she leans over, hugging you tightly. One of her hands reach down behind you and grabs your butt, squeezing it tightly. <i>“You were wonderful dear,”</i> she murmurs into your ears as she leans against you, wrecked by exhaustion.", parse);
						Text.NL();
						Text.Add("The bartender, a gruff equine clad in a dark tunic, comes over to your table with two jugs of mead.", parse);
						Text.NL();
						Text.Add("<i>“For the show,”</i> he explains grinning, <i>“we could use some more of that around here, it draws a crowd. You think you two can come more often?”</i> The two of you blush deeply as he returns to the bar, laughing. The conversations starts to pick up again around you.", parse);
						Text.NL();
						if(player.FirstVag())
							Text.Add("<i>“As much as I like an audience, do you think you can hold out until next time?</i> she murmurs, lightly caressing your wet crotch.", parse);
						else
							Text.Add("<i>“Too bad we are the center of attention, I’d love to… continue this,”</i> she grins, caressing your [buttDesc] fondly.", parse);
						Text.NL();
						Text.Add("You snuggle with Miranda for a while longer, enjoying the mead, until the two of you decide to leave for the night. Before the two of you part on the street outside, Miranda pulls you close into a deep kiss, her hands groping your ass roughly. <i>“I think I'll be seeing more of you, and better sooner than later,”</i> she announce as she saunters of into the night, <i>“you know where to find me.”</i>", parse);
						Text.Flush();
						
						miranda.flags["Attitude"] = Miranda.Attitude.Nice;
						miranda.relation.IncreaseStat(100, 10);
						miranda.subDom.IncreaseStat(100, 15);
						
						world.TimeStep({hour : 5});
						
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : "Wow... that looks way too tasty pass on."
				});
				Gui.SetButtonsFromList(options);
				
			}, enabled : true,
			tooltip : "The naughty girl is masturbating! You gotta see this for yourself."
		});
		Gui.SetButtonsFromList(options);
	});
}

Scenes.Miranda.Chat = function() {
	var parse = {};
	Text.NL();
	Text.Add("What do you want to chat with Miranda about?", parse);
	Text.Flush();
	
	world.TimeStep({hour: 1});
	
	//[Sure][Nah]
	var options = new Array();
	options.push({ nameStr : "Guard",
		func : function() {
			Text.Clear();
			Text.Add("You ask Miranda about her job as a guard.", parse);
			Text.NL();

			var scenes = [];
			
			scenes.push(function() {
				Text.Add("<i>“Walking the beat keeps the coin coming, though it isn’t as exciting as mercenary work. Believe it or not, usually things are pretty quiet here.”</i> She shrugs irritably. <i>“I hate doing paper work, give me a thug to beat up any day of the week.”</i>", parse);
				if(miranda.Relation() >= 25) {
					Text.NL();
					Text.Add("She brightens up a bit. <i>“You could show up at the barracks sometime and keep me company!”</i> she suggests. <i>“You know... take my mind of things for a while,”</i> she grins wickedly.", parse);
					player.AddLustFraction(0.1);
					miranda.AddLustFraction(0.1);
				}
			});
			scenes.push(function() {
				Text.Add("She tells you a few tidbits of information about her comrades in the guard and their peculiarities. You are particularly surprised about that the gruff wolf usually standing guard at the main gates is into writing sleazy erotic poetry, and has quite the following in the female population of the town.", parse);
				Text.NL();
				Text.Add("<i>“He is way too shy to tell anyone about it though, so he writes under an alias”</i>, she grins. <i>“You didn't hear that from me, though.”</i>", parse);
			});
			scenes.push(function() {
				Text.Add("She tells you a bit more about her guard troupe.", parse);
				Text.NL();
				Text.Add("<i>“Did you meet the centaur yet?”</i> she asks you. <i>“He is the strongest guy around here, and a really good archer too.”</i> She brings up a few stories about the two of them hunting together in the forest. Seems like a dependable guy.", parse);
			});
			if(miranda.Relation() >= 25) {
				scenes.push(function() {
					Text.Add("<i>“Well, it has been a lot more entertaining with you around, I'll tell you that!”</i> she giggles. <i>“The other guys there are complaining that my mind is not on the job any more, due to... distractions,”</i> she grins as you blush faintly.", parse);
					Text.NL();
					Text.Add("<i>“It's not a problem though, I can do this job in my sleep... not that you ever let me sleep, honey,”</i> she places a big sloppy kiss on your cheek.", parse);
					player.AddLustFraction(0.1);
					miranda.AddLustFraction(0.1);
				});
			}
			
			var sceneId = miranda.flags["RotGuard"];
			if(sceneId >= scenes.length) sceneId = 0;
			
			miranda.flags["RotGuard"] = sceneId + 1;
			
			// Play scene
			scenes[sceneId]();
			
			Text.Flush();
			
			// Force callstack
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Ask her about her job as a city guard."
	});
	options.push({ nameStr : "Forest",
		func : function() {
			Text.Clear();
			// First
			if(miranda.flags["Forest"] == 0) {
				miranda.flags["Forest"] = 1;
				Text.Add("<i>“You said you have been in the big forest, didn't you?”</i> She asks you. <i>“Not that you could miss it, it's practically crawling over our walls.”</i> You nod and tell her about the various strange creatures you've heard inhabits it. <i>“It's a very wild place, where one shouldn't walk around unprepared,”</i> she notes, <i>“you might get some nasty surprises otherwise.”</i>", parse);
				Text.Flush();
				
				//[Sure][Nah]
				var options = new Array();
				options.push({ nameStr : "Like what?",
					func : function() {
						Text.NL();
						Text.Add("She giggles at you.", parse);
						Text.NL();
						Text.Add("<i>“There are creatures in that forest who stalks unwitting prey and captures travellers for fun and for their own release.”</i> She begins to describe more and more extravagant beasts and how they violate passers by, <i>just like you</i>. You gasp at some of the more lurid ones, making her laugh out loud.", parse);
						Text.Flush();
						
						// Force callstack
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : "Ask her to explain what she means."
				});
				options.push({ nameStr : "Hunting",
					func : function() {
						Text.NL();
						Text.Add("<i>“I'm a bit different,”</i> she says, <i>“I've walked those woods for years hunting game, I know which creatures to avoid.”</i> She gives you a playful glance and places a hand on your thigh.", parse);
						Text.NL();
						Text.Add("<i>“...And I know which ones are good in the sack, if you want some tips.”</i> She howls with laughter at your shocked expression.", parse);
						Text.Flush();
						
						player.AddLustFraction(0.2);
						miranda.AddLustFraction(0.2);
				
						// Force callstack
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : "How about her, didn’t she say she hunts?"
				});
				Gui.SetButtonsFromList(options);
			}
			// Repeat
			else {
				Text.Add("You ask Miranda about the creatures of the forest. She grins a bit and fills you in about some of the more exotic ones.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>“Ok,”</i> she begins, <i>“you know those big wolves that prowl around there? Did you know that some of them used to be people?”</i> She goes on to explain that overuse of certain substances enhancing their animal attributes can change a persons body and mind so much that they lose themselves.", parse);
					Text.NL();
					Text.Add("<i>“As long as you keep your wits about you you should be fine,”</i> she finishes, ordering another mug of mead. <i>“Who knows, I might like having a pet around though...”</i> she adds teasingly. <i>“Just be careful ok?”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“The goblin tribes of the deeper woods are a weird bunch,”</i> she muses, taking a long draft of the strong mead in her cup. <i>“They are so constantly mad with lust that they fuck like rabbits. Yet they somehow keep their numbers down with a surprisingly high fatality rate,”</i> she ponders that a bit. <i>“It is probably because they are really, really stupid,”</i> she decides, <i>“just be careful that they don't gang up on you.”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“There are some wild feline beasts running around the forest,”</i> she informs you, <i>“they may look cute, but be very careful around them. Unlike the domesticated house cats you might see here in the city, these are natural predators, and are very dangerous. Don't head into their territory unless you have some kind of death wish.”</i>", parse);
				}, 1.0, function() { return true; });
				
				scenes.Get();
				
				Text.Flush();
				// Force callstack
				Gui.NextPrompt();
			}
		}, enabled : true,
		tooltip : "Ask her about the forest surrounding Rigard."
	});
	options.push({ nameStr : "Chat",
		func : function() {
			Text.Clear();
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Miranda mentions that she like fish a lot, going on to dreamily explain great fish dishes that she has cooked over time. Funny, you didn't quite look at her like a gourmet cook.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Miranda talks for a while about her biggest hobby, hunting game in the woods. While she usually uses a two-handed blade, she is apparently also really proficient with a bow and arrow. She talks a bit about some of her conquests. You get the feeling that she is searching for something in the forest.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("The two of you chat a bit about the castle town. <i>“Well, it's a nice enough place,”</i> Miranda concedes, <i>“the bar is nice, I have a decent job that brings the dough in.”</i> She grins widely, <i>“and though the place might not be as interesting as the feline home town, I have you around now to keep me entertained!”</i>", parse);
				player.AddLustFraction(0.1);
				miranda.AddLustFraction(0.1);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("You ask Miranda about the royal family living in the castle. Her mood darkens immediately, and she spits on the floor besides the table.", parse);
				Text.NL();
				Text.Add("<i>“Rigard may be my home, but don’t think for a second I’ve got anything but scorn for that bunch. Fucking aristocrats...”</i>", parse);
				Text.NL();
				Text.Add("When you ask her why she thinks that way, she gives you a deadpan stare. <i>“Try living in Rigard for a week as a morph, might give you an idea why I left to be a merc.”</i>", parse);
				Text.NL();
				Text.Add("Well, what about the rest of the royals?", parse);
				Text.NL();
				Text.Add("<i>“Heh, they are a right depraved bunch,”</i> Miranda laughs, a wicked grin playing across her features. <i>“There is plenty a rumour about our dear queen, and don’t get me started on the kids. It’s common knowledge they hit the sack together, and you’d have to look hard to find a girlier prince than Rani.”</i>", parse);
				Text.NL();
				Text.Add("<i>“...Still, I’d tap that,”</i> she adds after a thoughtful pause.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“You should have a look around the farmlands,”</i> Miranda tells you, <i>“there is some work to be had at the farms, if you are into that, and you can also find the rabbit burrows around that area. You could see it like a hub area, from there you can reach every location on the island pretty quickly.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Watch your back if you head to the mountains,”</i> Miranda warns you, <i>“I've heard that there are bandits hiding out somewhere there, and it is very close to the boneyard, and that place you should <b>really</b> avoid.”</i>", parse);
				Text.NL();
			}, 1.0, function() { return true; });
			
			scenes.Get();
			Text.Flush();
			
			// Force callstack
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Just chat for a while."
	});
	if((rigard.Krawitz["Q"] >= Rigard.KrawitzQ.CaughtTerry) && (terry.flags["Saved"] == Terry.Saved.NotStarted)) {
		options.push({ nameStr : "Thief",
			func : function() {
				Text.Clear();
				Text.Add("<i>“The thief? Why do you care?”</i>", parse);
				Text.NL();
				Text.Add("<i>“Just curious,”</i> you reply.", parse);
				Text.NL();
				Text.Add("<i>“Little bastard’s been sentenced to death. He had a long list of infractions, plus he pissed off the higher-ups. And let’s not forget the fact that he’s a morph to boot, ”</i> Miranda explains.", parse);
				Text.NL();
				if(rigard.Krawitz["F"] != 0)
					Text.Add("...Okay, now you really feel guilty for shifting blame onto the fox, even if he <b>is</b> a thief himself. ", parse);
				Text.Add("You ask Miranda when he’s going to be executed.", parse);
				Text.NL();
				Text.Add("<i>“Not for a while, I s’pose they want to beat him up a bit before ending it all,”</i> she takes another swig and slams her mug down on the table. <i>“Bah, let’s talk about something else. I don’t wanna think about how those assholes from the royal guard stole my credit for catching the little bastard.”</i>", parse);
				Text.NL();
				Text.Add("Maybe you should do something about that fox’s execution. Perhaps the royal twins might be willing to help?", parse);
				Text.Flush();
				
				terry.flags["Saved"] = Terry.Saved.TalkedMiranda;
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Ask Miranda about the thief the two of you caught."
		});
	}
	
	// TODO: Restructure this...
	
	if(miranda.flags["Met"] >= Miranda.Met.TavernAftermath) {
		options.push({ nameStr : "Date",
			func : Scenes.Miranda.DatingEntry, enabled : true,
			tooltip : miranda.flags["Dates"] >= 1 ? "Ask her out on another date." : "Ask her out on a walk."
		});
		// TODO: Unlocked either after X dates or after reaching X level of relationship. Until the repeatable dates are written, this will have NO REQUIREMENT.
		if(miranda.flags["Dates"] >= 1) {
			options.push({ nameStr : "Take home",
				func : Scenes.Miranda.TakeHome, enabled : true,
				tooltip : "You both know where this is going to end, so why not skip straight to dessert?"
			});
		}
		options.push({ nameStr : "Sex",
			func : Scenes.Miranda.TavernSexPublicPrompt, enabled : true,
			tooltip : "Ask her if she's up for some sexy times, right here, right now."
		});
		options.push({ nameStr : "Backroom",
			func : Scenes.Miranda.TavernSexBackroomPrompt, enabled : true,
			tooltip : "Invite her to the backrooms for some fun."
		});
	}
	
	Gui.SetButtonsFromList(options);
}

Scenes.Miranda.TavernSexPublicPrompt = function() {
	var parse = {
		mastermistress : player.mfTrue("master", "mistress")
	};
	
	var dom = miranda.SubDom() - player.SubDom();
	var nasty = miranda.Attitude() < Miranda.Attitude.Neutral;
	
	Text.Clear();
	if(nasty || dom > 25)
		Text.Add("<i>“You truly have no shame, my little bitch,”</i> Miranda chuckles. <i>“But since I have an itch that needs scratching, I’ll indulge you.”</i>", parse);
	else if(dom > -50)
		Text.Add("<i>“Sure, I’m always up for a romp,”</i> Miranda grins. <i>“I don’t mind an audience either, I’ve got nothing to hide.”</i>", parse);
	else
		Text.Add("<i>“Of course, [mastermistress]!”</i> Miranda yips happily. <i>“What do you want to do?”</i>", parse);
	Text.Flush();
	
	//[BJ] TODO
	var options = new Array();
	options.push({ nameStr : "Blow her",
		func : function() {
			Text.Clear();
			
			Scenes.Miranda.TavernSexPublicBJ();
			
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Give Miranda a blowjob under the table."
	});
	//TODO: fix back
	Gui.SetButtonsFromList(options, true, Scenes.Miranda.Chat);
}

Scenes.Miranda.TakeHome = function() {
	var parse = {
		masterMistress : player.mfTrue("master", "mistress"),
		guyGirl : player.mfTrue("guy", "girl")
	};
	
	Text.Clear();
	if(miranda.Attitude() < Miranda.Attitude.Neutral) {
		Text.Add("</i>”Heh, craving some cock are you?”</i> Miranda chortles, draining the last of her drink and slamming the mug down on the table. </i>”Very well then, slut. Dating you is a waste of time anyway, so let’s get your sweet ass back to my den and skip straight to part you love above all else, my cock,”</i> she says grabbing your arm and dragging you after her as she exits the bar.", parse);
		Text.NL();
		if(player.SubDom() > 0)
			Text.Add("Whatever last-second doubts you may have, you can't do anything to stop her now. Her grip around your wrist is like iron and you have no choice but to follow her as she leads you towards her home.", parse);
		else
			Text.Add("Shame and excitement chase each other through your mind as your alpha bitch drags you back to her den. Lost in the throes of lust, you eagerly keep up with her, anxious to let her decide what to do with you.", parse);
		Text.NL();
		Text.Add("Once you’re at her doorstep, Miranda opens the door and hauls you inside, slamming the door shut and locking it behind her. <i>“Alright then, let’s begin,”</i> she grins, licking her lips.", parse);
		
		world.TimeStep({hour: 1});
		
		Scenes.Miranda.HomeSubbySex();
	}
	else {
		var dom = miranda.SubDom() - player.SubDom();
		if(dom < -25) {
			Text.Add("A smirk curling your lips, you reach around the table and run your hand appreciatively over the firmly toned cheeks of Miranda's ass, reaching through the hole in her pants to scratch at the base of her tail, eliciting a moan from the doberherm. Sliding yourself closer to her, your thigh touching hers, your other hand reaches up to her chest, caressing her tits as best you can through the studded leather armor she wears. An appreciative growl rumbles out of her throat, but it's not the reaction you're after.", parse);
			Text.NL();
			Text.Add("Your hand traces its way down her belly, to a much more vulnerable target. Her maleness is far less protected as you cup her between her legs, stroking and fondling her sheath and her bulging balls with abandon. Miranda's ears flick and she fidgets in her seat, and you can feel her bulging through her pants as her foot-long girlcock begins poking forth and tenting her pants.", parse);
			Text.NL();
			Text.Add("With a playful smile, you coyly scold your naughty bitch for getting so hot and bothered in a place like this. But, since you're such a nice [guyGirl], you'll take her home and let her have some fun. To emphasize your last word, you squeeze her, firmly but gently, through her pants.", parse);
			Text.NL();
			Text.Add("<i>“T-Thank you, [masterMistress],”</i> she whispers, holding back a moan at your ministrations.", parse);
			Text.NL();
			Text.Add("Grinning, you tell her to come on then, giving her one last squeeze to the ass before you remove your hands from her body and imperiously begin heading towards the door. Out of the corner of your eye, you watch the aroused morph eagerly following you, her blatantly tented pants attracting a chorus of whispers and smirks as she follows.", parse);
			Text.NL();
			Text.Add("Meeting her at the door, you sling your arm around her and blatantly grope her ass, squeezing her and worming your fingers between her cheeks. Miranda moans lustfully and wriggles her hips in delight, allowing you to lead her in the direction of her home without the slightest protest.", parse);
		}
		else {
			Text.Add("</i>”Hmm, on one hand I do like spending time with you. On the other hand I also like dessert. So which one should I pick? Should I make you wine and dine me before we get to the good bits?”</i> she muses with a mischievous grin.", parse);
			Text.NL();
			Text.Add("You casually quip to her that if she does skip straight to dessert, that leaves the both of you with a lot more time to have nookie.", parse);
			Text.NL();
			Text.Add("<i>“Sold!”</i> she exclaims, draining the last of her drink and slamming the mug down. She gets up and walks towards the door at a brisk pace. <i>“Come on, slowpoke,”</i> she signals for you to follow.", parse);
			Text.NL();
			Text.Add("With a smile and a shake of your head at Miranda's antics, you hasten to follow the eager morph.", parse);
		}
		Text.NL();
		parse["dom"] = dom < -25 ? "fumbles to open" : "opens";
		Text.Add("You reach her home in record time, where Miranda [dom] the door. Once she’s inside she looks at you expectantly, holding the door for you.", parse);
		Text.Flush();
		
		world.TimeStep({hour: 1});
		
		//[Take Charge][Let Her Lead]
		var options = new Array();
		options.push({ nameStr : "Take Charge",
			func : function() {
				Text.Clear();
				Text.Add("You lunge forward, wrapping your arms around her and pulling her into a passionate kiss. Idly you slam the door shut behind, blatantly squeezing her ass cheeks as you feel her tented erection rubbing against your midriff.", parse);
				Scenes.Miranda.HomeDommySex();
			}, enabled : true,
			tooltip : "This time you get to run this show."
		});
		options.push({ nameStr : "Passive",
			func : function() {
				Text.Clear();
				Text.Add("With a smile, you simply stand there on the doorstep and spread your arms, making it clear that you are welcoming Miranda to do with you as she wills. A hungry grin crosses the morph's lips, eyes alight as she promptly grabs you and bodily drags you in over the threshold, slamming the door shut behind you.", parse);
				Scenes.Miranda.HomeSubbySex();
			}, enabled : true,
			tooltip : "Why not let her take the lead this time?"
		});
		Gui.SetButtonsFromList(options);
	}
}

Scenes.Miranda.JustOneMore = function() {
	var parse = {
		multiCockDesc : function() { return player.MultiCockDesc(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		buttDesc      : function() { return player.Butt().Short(); },
		anusDesc      : function() { return player.Butt().AnalShort(); },
		breastDesc    : function() { return player.FirstBreastRow().Short(); },
		stomachDesc   : function() { return player.StomachDesc(); },
		hand          : function() { return player.HandDesc(); },
		lowerArmor    : function() { return player.LowerArmorDesc(); },
		legs          : function() { return player.LegsDesc(); }
	};
	
	
	parse["ItThey"]   = player.NumCocks() > 1 ? "They" : "It";
	parse["itThey"]   = player.NumCocks() > 1 ? "they" : "it";
	parse["isAre"]    = player.NumCocks() > 1 ? "are" : "is";
	parse["itsTheir"] = player.NumCocks() > 1 ? "their" : "its";
	parse["s"]        = player.NumCocks() > 1 ? "s" : "";
	parse["notS"]     = player.NumCocks() > 1 ? "" : "s";
	parse["oneof"]    = player.NumCocks() > 1 ? " one of" : "";
	parse["yourA"]    = player.NumCocks() > 2 ? " a" : "your";
	
	miranda.flags["Met"] = Miranda.Met.TavernAftermath;
	
	if(miranda.flags["Attitude"] == Miranda.Attitude.Nice) {
		Text.Add("<i>“Well, I honestly didn't think I would see you again after last time,”</i> she laughs softly as you squirm a bit, then pats the bench beside her. Miranda seems very happy that you decided to return, which she makes more clear as she reaches over and whispers in your ear:", parse);
		Text.NL();
		Text.Add("<i>“If you decided to come back, I guess that means you liked my extra equipment. Perhaps you are yearning for round two?”</i> She gently reaches down into your pants, ", parse);
		if(player.FirstCock())
			Text.Add("fondling your now aroused [multiCockDesc].", parse);
		else if(player.FirstVag())
			Text.Add("lightly rubbing your moist [vagDesc].", parse);
		else
			Text.Add("fondling you.", parse);
		Text.Add(" Her probing fingers traces lower, drawing soft moans from you as she slowly circles your [anusDesc]. She slowly starts to push her middle finger up your rectum, feeling around for a while before withdrawing. She winks at you and pats the hidden monster between her legs.", parse);
		Text.NL();
		Text.Add("<i>“Just know that I'd be more than happy to help you with that, if you ever feel you need to let off some steam.”</i> She chuckles at your discomfort and orders some drinks for you.", parse);
		Text.NL();
		
		miranda.relation.IncreaseStat(100, 5);
		miranda.subDom.IncreaseStat(100, 5);
		player.AddLustFraction(0.5);
		miranda.AddLustFraction(0.5);
		
		Scenes.Miranda.Chat();
		
		// TODO: Push sexy
	}
	else if(miranda.flags["Attitude"] == Miranda.Attitude.Dismiss) {
		Text.Add("<i>“I.. uh.. I'm sorry about last time,”</i> she says, a bit defensively. <i>“Of course you weren't expecting... that, to, uh, show up.”</i> She rolls her shoulders. <i>“Well, that's my little secret, I'm a hermaphrodite, got both parts and all,”</i> she smiles, back to her old assertive self.", parse);
		Text.NL();
		Text.Add("<i>“Twice the fun though, if you care to try it out.”</i> The dog-morph is obviously waiting for you to say something.", parse);
		
		Text.Flush();
		
		//[Apologize][Leave]
		var options = new Array();
		options.push({ nameStr : "Apologize",
			func : function() {
				Text.Clear();
				Text.Add("You apologize to her for running out, giving her a weak smile. Miranda’s expression softens up a bit.", parse);
				Text.NL();
				Text.Add("<i>“You are not such a bad sort, you know,”</i> she says, <i>“I guess I should have hinted at it a bit more, I...”</i> she looks at you admiringly and shyly adds, <i>“I just couldn't help myself, you are quite the catch, you know.”</i> She places a hand your hip and moves in a bit closer.", parse);
				Text.NL();
				Text.Add("<i>“So... now what, pet?”</i> she asks, looking into your eyes. You suggest that the two of you grab a few drinks and have a chat. <i>“Well… a good start, I guess,”</i> she smirks.", parse);
				Text.NL();
				
				miranda.flags["Attitude"] = Miranda.Attitude.Nice;
				
				miranda.relation.IncreaseStat(100, 5);
				
				Scenes.Miranda.Chat();
			}, enabled : true,
			tooltip : "Apologize for running out on her."
		});
		options.push({ nameStr : "Leave",
			func : function() {
				Text.Clear();
				Text.Add("Murmuring some excuse, you start to shuffle away. There is a slightly hurt look in her eyes.", parse);
				Text.NL();
				Text.Add("<i>“Fine then,”</i> she snaps after you. <i>“Be that way. You’ll regret that if I ever catch you in the streets!”</i> As you glance over your shoulder, she is furiously chugging down a large bottle of booze. She probably won't appreciate seeing you around any more.", parse);
				Text.Flush();
				
				miranda.flags["Attitude"] = Miranda.Attitude.Hate;
				
				miranda.relation.DecreaseStat(-25, 100);
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Not interested. Find an excuse to ditch her.<br/><br/>...On second thought, getting on the bad side of the law might have reprecussions."
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.Add("Miranda is lost in thought as you grab a seat next to her. She takes a deep breath and turns to you.", parse);
		Text.NL();
		Text.Add("<i>“Look, I haven't been entirely honest with you. I get a feeling that you like me, and there is something that you need to know before we take this any further.”</i> She heads off to an empty back room, motioning for you to follow. Curious, you go with her. She grabs a bottle of booze from the bar on the way, muttering she needs something to brace herself. You notice that she is already pretty drunk.", parse);
		Text.NL();
		Text.Add("<i>“Please close the door, hun,”</i> she tells you over her shoulder, placing the booze on the table. Turning around, she gives you a measuring look. <i>“I think the best way to do this is to show you,”</i> she murmurs with a sultry look on her face. With her eyes still fixed on you, Miranda reaches for her belt and starts undoing it. When she is done, she turns around, slowly pulling down her tight pants over her curvy hips, exposing more and more dark fur.", parse);
		Text.NL();
		Text.Add("You are thoroughly enjoying the show, but is a bit unsure where this is going. With her back to you, she pulls her pants down to her knees, giving you a glimpse of her tight anus and moist pussy lips. Then... she turns around to face you. Between her long fur-clad legs, just above her juicy slit, you see something you definitely didn't expect. Half hidden in a soft sheath is a very large canid cock, complete with a pointed tip, a set of apple-size balls and a thick knot at the base.", parse);
		Text.NL();
		Text.Add("Even soft, it’s still almost nine inches long and as thick as her arm. You unconsciously lick your lips nervously, contemplating this new development. Miranda takes a challenging pose, legs wide and member jutting out aggressively.", parse);
		Text.NL();
		Text.Add("<i>“Well?”</i> she looks at you, cocking her eyebrow.", parse);
		Text.NL();
		Text.Add("<b>You now know Miranda is a herm (duh).</b>", parse);
		Text.Flush();
		
		miranda.flags["Herm"] = 1;
		
		//[Accept][Leave][Touch it]
		var options = new Array();
		options.push({ nameStr : "Accept",
			func : function() {
				Text.Clear();
				Text.Add("You declare that it doesn’t matter what she has between her legs, you’ll still be her friend, even if her revelation startled you a little bit. Miranda makes a happy yip and gives you a quick hug, her soft member hitting your thigh with a wet slap. A bit embarrassed, she shoves her cock back into her pants, then leads you back to the benches. As you walk she leans on your shoulder and fondles your butt playfully.", parse);
				Text.NL();
				Text.Add("<i>“Friendship accepted,”</i> the guardswoman murmurs. <i>“And who knows, perhaps something more down the line?”</i> she adds playfully.", parse);
				Text.NL();
				
				miranda.flags["Attitude"] = Miranda.Attitude.Nice;
				
				miranda.relation.IncreaseStat(100, 5);
				
				Scenes.Miranda.Chat();
			}, enabled : true,
			tooltip : "Got no problem with that, you still want to hang out with her."
		});
		options.push({ nameStr : "Leave",
			func : function() {
				Text.Clear();
				Text.Add("Murmuring some excuse, you start to shuffle away. There is a slightly hurt look in her eyes.", parse);
				Text.NL();
				Text.Add("<i>“Fine then,”</i> she snaps after you. <i>“Be that way. You’ll regret that if I ever catch you in the streets!”</i> As you glance over your shoulder, she is furiously chugging down a large bottle of booze. She probably won't appreciate seeing you around any more.", parse);
				Text.Flush();
				
				miranda.flags["Attitude"] = Miranda.Attitude.Hate;
				
				miranda.relation.DecreaseStat(-25, 100);
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Not interested. Find an excuse to ditch her."
		});
		options.push({ nameStr : "Touch it",
			func : function() {
				miranda.flags["Attitude"] = Miranda.Attitude.Nice;
				
				Text.Clear();
				Text.Add("Fascinated by the long member, you move closer and study it meticulously.", parse);
				Text.NL();
				Text.Add("You ask her if you can touch it. Almost a bit flustered, she nods and leans back against the wall, shuffling her legs apart a bit to give you room. You get down on your knees to get closer to the object of your study. You softly move your hands up and down the shaft, lightly touching here and there, drawing increasingly loud moans from Miranda. Your caresses seem to bear fruit, as her cock is slowly hardening and rising up.", parse);
				Text.NL();
				Text.Add("Finally you lean back and admire your handiwork. Fully erect, Miranda's huge rod push out eleven inches from her crotch, even without the support of your hands. As you look up at the hermaphrodite, you see that she is very aroused, and is gazing at you with a wicked smile playing on her lips. Satisfied with your survey, you start to rise up to your feet.", parse);
				Text.NL();
				Text.Add("<i>“Oh no. You can't just leave it like that!”</i> she exclaims drunkenly. The guardswoman makes a flailing grab for you, but loses her footing and falls down on top of you. Surprised, you catch her and set her down in your lap.", parse);
				Text.NL();
				Text.Add("<i>“Please!”</i> she pants urgently, her hands paws at you inefficiently. <i>“I need to fuck. <b>Now!</b>”</i>", parse);
				Text.NL();
				Text.Add("What do you do?", parse);
				Text.Flush();
				
				//[Fuck her][Ride her][Let her]
				var options = new Array();
				if(player.FirstCock()) {
					options.push({ nameStr : "Fuck her",
						func : function() {
							Text.Clear();
							Text.Add("You envelop Miranda in your arms, hugging the horny doggy close and playfully nipping at her fluffy ears. She hugs you close as you lift her up so she sits in your lap, facing you. You reach down and pull out your [multiCockDesc] from [itsTheir] confines. [ItThey] [isAre] painfully hard as [itThey] snap[notS] up against her crotch, pressing between her ample testicles.", parse);
							Text.NL();
							Text.Add("The assertive guardswoman looks almost nervous as you adjust your aim, rubbing your [multiCockDesc] against her wet cunt, massaging her butt with your free [hand]. Miranda moans cutely, and you become very aware of the hard erection pressing against your stomach. You grunt a bit as you lift her up, positioning her over[oneof] your member[s].", parse);
							Text.NL();
							Text.Add("The two of you lock lips as Miranda slowly lowers herself down, impaling herself upon your spear[s]. Her raspy tongue plays around in your mouth as she begins to rock her hips slowly, adjusting to the cock[s] stretching her. You firmly grasp her hips and start helping her move up and down, ", parse);
							if(player.NumCocks() > 1)
								Text.Add("one of your dicks penetrating deep into her cunt, while [yourA] second one probes her back passage.", parse);
							else
								Text.Add("your cock pushing up into her cunt.", parse);
							Text.NL();
							
							Sex.Vaginal(player, miranda);
							player.Fuck(player.FirstCock(), 5);
							miranda.FuckVag(miranda.FirstVag(), player.FirstCock(), 5);
							
							if(player.NumCocks() > 1) {
								Sex.Anal(player, miranda);
								player.Fuck(player.FirstCock(), 5);
								miranda.FuckAnal(miranda.Butt(), player.AllCocks()[1], 5);
							}
							
							Text.Add("Miranda moans loudly as you fervently fuck her female genitalia, almost making you worry someone will walk in on the two of you. Her hard cock rubs against your chest", parse);
							if(player.FirstBreastRow().size.Get() > 3)
								Text.Add(", fitting neatly between your [breastDesc]", parse);
							Text.Add(", drooling precum all over you. You speed up your insistent rutting of the poor doggy, who is really starting to lose it. Her engorged penis is slapping wildly against your [stomachDesc], and the knot at her base is beginning to swell.", parse);
							Text.NL();
							parse["butt"] = player.NumCocks() > 1 ? ", simultaneously pouring your spunk inside her twitching colon" : "";
							Text.Add("<i>“I-I'm gonna come!”</i> she gasps. You quickly reach down and grasp her shaft and start jerking her off. As she explodes in a fountain of dog-girl cum, thoroughly drenching the both of you, you glance up and notice that you have a small audience. Seems like two shocked customers just walked in on you, but you are not really in a position to do anything about it. Miranda rams herself down hard, fully impaling herself on your cock[s] as you unload into the depths of her pussy[butt].", parse);
							Text.NL();
							Text.Add("As the both of you ride out your climax, the spectators chuckle to each other and head to another room. They leave the door open for all to see, as you rest in each others arms in an expanding pool of mixed love juices. After resting up a bit, the two of you decide that it is probably best to leave for today. As you walk out into the night, Miranda gives you an peck on the cheek. She seems a bit more demure than her usual abrasive self.", parse);
							Text.NL();

							var cum = player.OrgasmCum();
							var mCum = miranda.OrgasmCum();

							Text.Add("<i>“That was great, hun...”</i> she whispers into your ear. <i>“You can do that to me again aaanytime you like.”</i> Miranda sways off into the night, leaving you alone.", parse);
							Text.Flush();
							
							miranda.relation.IncreaseStat(100, 10);
							miranda.subDom.DecreaseStat(-100, 10);
							
							Gui.NextPrompt(function() {
								MoveToLocation(world.loc.Rigard.Slums.gate, {hour: 4});
								player.AddLustFraction(-1);
								miranda.AddLustFraction(-1);
							});
						}, enabled : true,
						tooltip : "While it might not be what she was hoping for, you got just the thing to fill her."
					});
				}
				options.push({ nameStr : "Ride her",
					func : function() {
						var target = BodyPartType.ass;
						if(player.FirstVag())
							target = BodyPartType.vagina;
						
						if(target == BodyPartType.vagina)
							parse["targetDesc"] = parse["vagDesc"];
						else
							parse["targetDesc"] = parse["anusDesc"];
						
						Text.Clear();
						Text.Add("Blushing slightly, you lay her down on the floor before you, on top of her discarded clothes. Straddling her, you position the tip of her cock at your [targetDesc], wondering if it will even fit inside you. You don't have to wonder very long, as Miranda gathers a bit of strength and pushes you down so far that your entrance touches the fur on her stomach. She grins up at you, growling playfully while you gasp for breath.", parse);
						Text.NL();
						
						if(target == BodyPartType.vagina) {
							Sex.Vaginal(miranda, player);
							miranda.Fuck(miranda.FirstCock(), 5);
							player.FuckVag(player.FirstVag(), miranda.FirstCock(), 5);
						}
						else {
							Sex.Anal(miranda, player);
							miranda.Fuck(miranda.FirstCock(), 5);
							player.FuckAnal(player.Butt(), miranda.FirstCock(), 5);
						}
						
						Text.Add("<i>“See? That wasn't so bad, was it honey?”</i> She slaps your butt drunkenly. <i>“Now, are you going to start moving or will I have to do all the work?”</i> Blushing slightly, you slide up and down her length, your tunnel clenching tightly around the hermaphrodite’s bright red pillar.", parse);
						Text.NL();
						Text.Add("Fuck, she is in so deep! The dog-girl roughly grabs hold of your hips, shoving you down on her member. Before long, you are driven to the edge by the wild romp.", parse);
						if(player.FirstBreastRow())
							Text.Add(" Your breasts heave as you bounce up and down, the pleasure making you moan like crazy.", parse);
						if(player.FirstVag())
							Text.Add(" Juices flow freely from your ravaged cunt, clinging to the sides of her dick as you ride her.", parse);
						if(player.FirstCock()){
							Text.Add(" Your cock[s] convulse[notS] and start[notS] pumping semen all over your lover.", parse);
							
							var cum = player.OrgasmCum();
						}
						Text.Add(" She grins as you cum, rocking on top of her.", parse);
						Text.NL();
						parse["butt"] = player.FirstCock() ? ", grinding against your prostate" : "";
						Text.Add("<i>“Oh, I'm not done quite yet, my cute little pet,”</i> she coos. Sitting up and holding you in her lap, she starts to guide you up and down her shaft with her strong hands. Picking up speed, she bounces you wildly[butt].", parse);
						Text.NL();
						Text.Add("Pretty soon you convulse in yet another intense orgasm, making you gasp as she continues to fuck you. You become aware that some of the bar patrons are peeking in through the open door, watching the two of you. Miranda notices them too and grins at them over your shoulder, as she pushes you so far down on her cock that her thick knot pops inside you.", parse);
						Text.NL();
						Text.Add("Your body rests limply against hers as she starts pumping you full of her seed, putting up a show for the audience. As you lean against her, totally exhausted, she whispers in your ear, <i>“Not bad for the first time, I think I’ve found myself a keeper!”</i> Once her knot has shrunk enough and you finally are able to separate, the two of you head out into the night, too tired to keep up the drinking game. Miranda has a thoughtful look on her face.", parse);
						
						var mCum = miranda.OrgasmCum();
						
						Text.NL();
						Text.Add("<i>“Did you enjoy performing in front of an audience?”</i> she asks playfully. <i>“Maybe I shouldn't have been so greedy, and let them join in?”</i> She laughs loudly at your blushing face and saunters off into the night.", parse);
						Text.NL();
						Text.Add("<i>“See you around, pet!”</i>", parse);
						Text.Flush();
						
						miranda.relation.IncreaseStat(100, 10);
						miranda.subDom.IncreaseStat(100, 10);
						
						Gui.NextPrompt(function() {
							MoveToLocation(world.loc.Rigard.Slums.gate, {hour: 4});
							player.AddLustFraction(-1);
							miranda.AddLustFraction(-1);
						});
					}, enabled : true,
					tooltip : "Give her relief by riding her thick cock."
				});
				options.push({ nameStr : "Let her",
					func : function() {
						Text.Clear();
						Text.Add("You blush a bit, eyeing her throbbing member nervously. Unsure if you are doing the right thing, you ask if she’ll be gentle with you.", parse);
						Text.NL();
						Text.Add("<i>“Gentle?”</i> the dog-morph growls, <i>“I don’t know the meaning of the word!”</i> Before you have time to react, she wrestles you to the ground. Totally surprised by her lunge, you stumble back on your ass as she falls on top of you. Squirming around you somehow end up on your stomach, butt in the air. Faintly alarmed, you try to crawl away, but she has you pinned to the ground, rutting her huge cock against your back. She hungrily pulls off your [lowerArmor], revealing your naked [buttDesc]. She reaches down, whispering in your ear as she starts probing at your back door.", parse);
						Text.NL();
						Text.Add("<i>“I'm sorry, but I <b>need</b> this,”</i> she almost seems a bit embarrassed about her essentially planning to rape you, but she is too aroused to back down now. <i>“You brought this upon yourself you know, my cute little slut,”</i> she moans, trying to justify her actions. <i>“You were practically <b>asking</b> for it!”</i>", parse);
						Text.NL();
						Text.Add("You start to gasp that it wasn't like that, but you are suddenly cut off by a rowdy intruder in your [anusDesc]. Your world is suddenly reduced to your butt, and the huge log stretching it wider and wider. You can feel each bulging vein as the pointy red giant slowly presses deeper and deeper into your bowels, completely disregarding your own opinions on the matter.", parse);
						Text.NL();
						
						Sex.Anal(miranda, player);
						miranda.Fuck(miranda.FirstCock(), 6);
						player.FuckAnal(player.Butt(), miranda.FirstCock(), 6);
						
						parse["butt"] = player.FirstCock() ? " brushing up against your prostate and" : "";
						Text.Add("Finally, the head is firmly lodged inside your [anusDesc]. Your lover sighs in deep contentment as you rasp a few ragged breaths, trying to accommodate for her girth. Miranda is not going to let you have any rest though, as she mercilessly pushes deeper and deeper into your colon,[butt] making you gasp in mixed pleasure and pain.", parse);
						Text.NL();
						Text.Add("<i>“You like that, huh?”</i> the horny dog grunts through her teeth. She gets up on her knees and firmly grab your buttocks, preparing to go down on you in earnest. <i>“Then I think you will just love this,”</i> she murmurs, she slowly pulls out of you, until the widest part of the head stretch your distended anus.", parse);
						if(player.FirstVag())
							Text.Add(" Your cunt is flooding over, but Miranda is too focused on her current target to notice.", parse);
						if(player.FirstCock())
							Text.Add(" Your own [multiCockDesc] [isAre] twitching in anticipation, a small pool of pre forming on the floor beneath you.", parse);
						Text.NL();
						Text.Add("<i>“Here I come, brace yourself, slut!”</i> she roars, thrusting forward hard with her hips. The intense sensation of being completely filled up almost makes you come then and there. You can feel the incessant prodding of her even thicker knot at your back door, demanding entry. She grunts a bit as she realizes that it won't fit the way it is now, but decides that she'll give it her best try anyway. She proceeds to roughly slam your colon, first pulling out almost all the way before ramming it back as deep as it will go.", parse);
						if(player.FirstCock())
							Text.Add(" Your prostate definitely is mashed every time she trusts her hips, making you yelp in unwilling pleasure.", parse);
						Text.NL();
						Text.Add("After what feels like hours of intense fucking, you can't take it any more.", parse);
						if(player.FirstVag())
							Text.Add(" Your cunt sprays juices all over the floor as you collapse, only held up by the hermaphrodite’s strong hands.", parse);
						if(player.FirstCock()){
							Text.Add(" Your cock[s] violently erupt[notS] on the hard wooden floor, making you cry out in ecstasy.", parse);

							var cum = player.OrgasmCum();
						}
						Text.NL();
						parse["butt"] = player.FirstCock() ? " by repeatedly hitting your prostate" : "";
						Text.Add("Miranda is far from done however, and continues to ram away at your poor abused rectum, quickly building up another anal orgasm for you[butt]. The massive rod moves more easily now, slick with her precum. The constant stretching pain in your butt does not recede, however, and you realize that she is forcing more and more of her knot into you with every push.", parse);
						Text.NL();
						parse["butt"] = player.FirstCock() ? " as a great force is exerted on your prostate" : "";
						Text.Add("<i>“Almost there, pet, almost, almoooost...”</i> she coos, her breath drawing short. Finally she pulls out, only the pointed tip of her cock poking against your stretched taint. She pulls back her hips as you brace yourself again. When she rams into you, she pushes deeper than ever before, making your eyes bulge in pain. Your body is rocked by another heavy orgasm[butt], increasing the size of the pool of love juices between your knees.", parse);
						Text.NL();
						Text.Add("You incredulously realize that she somehow made it, all of her swollen knot is trapped inside your distended bowels, throbbing as it announces her coming orgasm. You try to pull away, but find it impossible, her thick bulge is trapping you and preventing you from moving even a fraction of an inch. The intense pressure causes your rectal muscles to convulse as yet another anal orgasm wrecks your body, the tightness pushing Miranda well past her own limits.", parse);
						Text.NL();
						Text.Add("<i>“FUUUUUUCK!!!”</i> she loudly cries out, as you feel wave after wave of potent cum fill your belly. The knot is preventing any sperm from escaping, leaving her immense load only one way to go. After what feels like an eternity, she is finally spent. Your belly is stretched beyond what you thought possible, making you look heavily pregnant. Miranda collapses on top of you, the weight of her breasts pressing down on your back.", parse);
						
						var mCum = miranda.OrgasmCum();
						
						Text.NL();
						Text.Add("This, of course, is the time that the bartender decides to check in on you. He surveys the scene clinically: you lie pressed on the floor with your butt sticking out, completely filled by the hermaphrodite dog’s knotted cock. Trickles of the guardswoman’s cum somehow flows past the knot and join the pool of your fluids on the floor. The tall equine sighs and mutters that this will be a mess to clean up, shaking his head as he walks out. The flushed and tired Miranda sits up and pulls you into her lap.", parse);
						Text.NL();
						Text.Add("<i>“Well, I don’t think you have much choice but to stay like this for a while,”</i> she purrs. You have to admit it’s true, the knot is holding you firmly in place. Resigned to your fate, you snuggle up against your canid lover, making the best of the situation. You stay that way for about a quarter of an hour, Miranda whispering dirty pillow talk in your ears. Her words leave you no doubt that she’ll want to do this again, and often. Finally she is able to pull out her softened member from your bowels, releasing a torrent of her cum down your [legs].", parse);
						Text.NL();
						Text.Add("You have a little trouble walking, and don't think you'll be able to sit properly for a few days. The both of you drunkenly stagger out into the night together. Before you part, Miranda pulls you down to your knees, and makes you give her a blowjob right in the middle of the street.", parse);
						Text.NL();
						
						Sex.Blowjob(player, miranda);
						miranda.Fuck(miranda.FirstCock(), 2);
						player.FuckOral(player.Mouth(), miranda.FirstCock(), 2);
						
						Text.Add("<i>“Remember that your ass belongs to me now, little slut!”</i> she drunkenly proclaims as she fills your bowels with another batch of dog cum, this time pouring from the other direction. It seems you have brought out a really dominant streak in Miranda.", parse);
						Text.NL();
						Text.Add("<i>“Can't wait for our next fuck, love,”</i> she purrs as she swaggers off into the night.", parse);
						Text.Flush();
						
						miranda.relation.IncreaseStat(100, 15);
						miranda.subDom.IncreaseStat(100, 20);
						
						
						Gui.NextPrompt(function() {
							MoveToLocation(world.loc.Rigard.Slums.gate, {hour: 4});
							player.AddLustFraction(-1);
							miranda.AddLustFraction(-1);
						});
					}, enabled : true,
					tooltip : "Let her take the lead. Things might get a bit rough."
				});
				Gui.SetButtonsFromList(options);
			}, enabled : true,
			tooltip : "This requires further... investigation."
		});
		Gui.SetButtonsFromList(options);
	}
}

Scenes.Miranda.MaidensBaneTalk = function() {
	Text.Clear();
	
	if(miranda.flags["Met"] == Miranda.Met.Met) {
		Scenes.Miranda.HeyThere();
	}
	else
	{
		// TODO: Attitude
		if(miranda.flags["Attitude"] >= Miranda.Attitude.Neutral)
			Text.Add("You walk over to Miranda, who is lounging on one of the benches in the shady tavern. She’s already gotten started on her first few drinks, and waves you over when she notices you.");
		else
			Text.Add("You walk over to Miranda, who is lounging on one of the benches in the shady tavern. When she notices you, her eyes narrow dangerously. Looks like she isn't particularly happy about seeing you.");
		Text.NL();
		
		if(miranda.flags["Met"] == Miranda.Met.Tavern) {
			Scenes.Miranda.JustOneMore();
		}
		else if(miranda.flags["Attitude"] >= Miranda.Attitude.Neutral) {
			Scenes.Miranda.Chat();
		}
		else {
			Text.Add("[PLACEHOLDER] Bad interactions.");
			Text.Flush();
			
			
			var options = new Array();
			if(miranda.flags["Met"] >= Miranda.Met.TavernAftermath) {
				options.push({ nameStr : "Date",
					func : Scenes.Miranda.DatingEntry, enabled : true,
					tooltip : miranda.flags["Dates"] >= 1 ? "Ask her out on another date." : "Ask her out on a walk."
				});
				// TODO: Unlocked either after X dates or after reaching X level of relationship. Until the repeatable dates are written, this will have NO REQUIREMENT.
				if(miranda.flags["Dates"] >= 1) {
					options.push({ nameStr : "Take home",
						func : Scenes.Miranda.TakeHome, enabled : true,
						tooltip : "You both know where this is going to end, so why not skip straight to dessert?"
					});
				}
				
				options.push({ nameStr : "Sex",
					func : Scenes.Miranda.TavernSexPublicPrompt, enabled : true,
					tooltip : "Ask her if she's up for some sexy times, right here, right now."
				});
				options.push({ nameStr : "Backroom",
					func : Scenes.Miranda.TavernSexBackroomPrompt, enabled : true,
					tooltip : "Invite her to the backrooms for some fun."
				});
			}
			
			Gui.SetButtonsFromList(options, true);			
		}
	}
}

world.loc.Rigard.Tavern.common.events.push(new Link("Miranda", function() { return miranda.IsAtLocation(); }, true,
function() {
	if(miranda.IsAtLocation())
		Text.AddOutput("Miranda is lounging at a table in the shady tavern. ");
},
Scenes.Miranda.MaidensBaneTalk,
"Miranda is lounging at a table in the shady tavern."));

Scenes.Miranda.DatingEntry = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	if(miranda.flags["Dates"] == 0) { // first
		if(miranda.Attitude() >= Miranda.Attitude.Neutral)
			Text.Add("<i>“You coming on to me, [playername]?”</i> Miranda looks amused, but nods. <i>“Sure, I’m game. Let’s ditch this place.”</i> Saying so, she drains her beer in one go, slamming the empty cup to the table.", parse);
		else {
			Text.Add("<i>“You are certainly singing a different tune now than when we first met.”</i> Miranda growls suspiciously. <i>“What’s your game?”</i> Grudgingly, she agrees to go with you, draining her beer and slamming the empty cup to the table.", parse);
			if(miranda.flags["gBJ"] > 0) {
				Text.NL();
				Text.Add("<i>“If nothing else, at least I’ll get to fuck you at the end of it,”</i> she mutters to herself.", parse);
			}
		}
		Text.NL();
		Text.Add("<i>“I’m quite picky with who I date, you should know. Put on your best face, or whatever other bodypart you’d like to flaunt.”</i>", parse);
		Text.NL();
		Text.Add("You leave the sordid tavern behind, walking aimlessly through the picturesque slums of the large city. For once, Miranda isn’t very talkative, seeming to be preoccupied with her own thoughts. Just when the silence is starting to get uncomfortable, she yips in surprised joy.", parse);
		Text.NL();
		Text.Add("<i>“Oh, this place! Haven’t been through here in a while.”</i> You follow the excited canine through an archway into what looks like a small secluded park of sorts, containing a few trees and bushes, a cracked stone table and a few simple wooden benches. The small space would easily fit inside the common room of the Maidens’ Bane.", parse);
		Text.NL();
		Text.Add("<i>“This is the place I lost my virginity,”</i> Miranda gestures around the place with sparkling eyes like if it were a grand ball room. <i>“Oh how young I was… Both me and my boyfriend were rather drunk. Still, I enjoyed myself greatly.”</i> She looks thoughtful for a moment. <i>“My boyfriend, not so much.”</i>", parse);
		Text.NL();
		if(miranda.Sexed()) {
			Text.Add("<i>“As you may have noticed, I have a hard time holding back,”</i> the herm blushes faintly. You’ve sort of gotten that impression.", parse);
			Text.NL();
		}
		Text.Add("<i>“So, what do you think, [playername]?”</i>", parse);
		
		party.location = world.loc.Rigard.Slums.gate;
		world.TimeStep({minute: 20});
		
		Text.Flush();
		
		Scenes.Miranda.DatingScore = miranda.Attitude();
		
		//[Polite][Rude][Sultry]
		var options = new Array();
		options.push({ nameStr : "Polite",
			func : function() {
				Text.Clear();
				Text.Add("You rather guardedly tell her it’s a nice place, not really sure what she’s expecting you to say.", parse);
				Text.NL();
				Text.Add("<i>“Aww, you are no fun.”</i> Miranda looks disappointed.", parse);
				Text.NL();
				Scenes.Miranda.DatingFirstDocks();
			}, enabled : true,
			tooltip : "Very nice. No, really."
		});
		options.push({ nameStr : "Rude",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Nostalgia is what it is. I have some good memories here, and I’m not ashamed of that.”</i> Miranda looks grumpy at your reaction.", parse);
				Text.NL();
				
				miranda.relation.DecreaseStat(-100, 2);
				Scenes.Miranda.DatingScore--;
				
				Scenes.Miranda.DatingFirstDocks();
			}, enabled : true,
			tooltip : "A rather crude place to take someone on a date, isn’t it?"
		});
		options.push({ nameStr : "Sultry",
			func : function() {
				Text.Clear();
				Text.Add("Rather than being taken aback, Miranda takes your counter in a stride.", parse);
				Text.NL();
				Text.Add("<i>“Several times. My first relationship didn’t last very long, but me and my boyfriend stole back here quite often while it did.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Was a while since last time, though. You offering?”</i> Before you can respond, she shakes her head, grinning at you. <i>“My tastes have refined over time. I’d prefer to ram you in my own bed instead. Consider it an offer.”</i>", parse);
				Text.NL();
				if(miranda.flags["gAnal"] != 0) {
					Text.Add("<i>“Who knows, perhaps you’ll prefer it over a dirty alleyway,”</i> she adds, jabbing you in the ribs with her elbow.", parse);
					Text.NL();
				}
				
				miranda.relation.IncreaseStat(100, 3);
				Scenes.Miranda.DatingScore++;
				
				Scenes.Miranda.DatingFirstDocks();
			}, enabled : true,
			tooltip : "So… she took her first here, has she repeated the feat?"
		});
		Gui.SetButtonsFromList(options);
	}
	else if(miranda.flags["Dates"] == 1) {
		Scenes.Miranda.DatingScore = miranda.Attitude();
		
		if(miranda.flags["dLock"] == 1) {
			Text.Add("<i>“What, changed your mind? Ready to become my bitch?”</i> Miranda nods towards her crotch pointedly. <i>“Blow me. Right here, right now.”</i>", parse);
			Text.Flush();
			
			Scenes.Miranda.DatingBlockPrompt();
		}
		else {
			if(miranda.Attitude() >= Miranda.Attitude.Neutral)
				Text.Add("<i>“I’d love to, [playername],”</i> Miranda replies heartily. <i>“I had a good time before… but we need to talk first.”</i>", parse);
			else
				Text.Add("<i>“Just what is your game, [playername]?”</i> Miranda looks genuinely puzzled. <i>“You just don’t seem to take a hint… or maybe you get off on abuse. Is that it? Are you a masochist? Not that I’d mind...”</i>", parse);
			Text.NL();
			Text.Add("The doberherm takes another swipe of her mead, sighing contentedly.", parse);
			Text.NL();
			Text.Add("<i>“Look. If you want to hang with me, we need to set out some ground rules. Don’t think that this is going to be your lovey-dovey romance kind of thing. I don’t <b>do</b> relationships, I do fuckbuddies. I do a lot of them. If I want to fuck someone, I’m going to do it, regardless of what you think about it.”</i>", parse);
			Text.NL();
			Text.Add("Guess that is just something you have to accept about Miranda. She doesn’t look like she’s going to budge on it.", parse);
			Text.NL();
			Text.Add("<i>“Second thing. Expect to be on the receiving end of my cock. A lot.”</i> Your eyes unwittingly drift down to the bulge between her legs. When you glance back up, Miranda is grinning widely at you. <i>“I like being on top. Which means you like being my bottom.”</i>", parse);
			Text.NL();
			if(miranda.flags["public"] >= Miranda.Public.Oral) {
				Text.Add("<i>“Not that you seem to have a problem with that. Well then, shall we?”</i>", parse);
				Text.NL();
				Text.Add("You finish your drinks and head out into the slums.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Scenes.Miranda.DatingStage2();		
					miranda.flags["Dates"]++;
				});
			}
			else {
				Text.Add("You squirm a bit under her gaze.", parse);
				Text.NL();
				Text.Add("<i>“I’d like you to show your… dedication, [playername].”</i> Miranda points between her legs imperiously. <i>“Suck.”</i>", parse);
				Text.NL();
				Text.Add("What, here?", parse);
				Text.Flush();
				
				Scenes.Miranda.DatingBlockPrompt();
			}
		}
	}
	else { // 3+
		miranda.flags["Dates"]++;
		Scenes.Miranda.DatingScore = miranda.Attitude();
		
		parse["masterMistress"] = miranda.SubDom() - player.SubDom() > -50 ?
			player.name : player.mfTrue("master", "mistress");
		if(miranda.Attitude() >= Miranda.Attitude.Neutral)
			Text.Add("<i>“Sure, I’d love to, [masterMistress]!”</i> Miranda replies, eagerly swiping her tankard.", parse);
		else
			Text.Add("<i>“Just can’t get enough of my cock, can you?”</i> Miranda grins mockingly, draining her tankard. <i>“Sure, I’m game.”</i>", parse);
		Text.NL();
		Scenes.Miranda.DatingStage1();
	}
}

Scenes.Miranda.DatingBlockPrompt = function() {
	var parse = {
		name : miranda.Attitude() >= Miranda.Attitude.Neutral ?
			player.name : "slut"
	};
	
	//[Do it][Refuse]
	var options = new Array();
	options.push({ nameStr : "Do it",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Good, showing your true colors,”</i> Miranda purrs.", parse);
			Text.NL();
			
			Scenes.Miranda.TavernSexPublicBJ();
			
			miranda.flags["dLock"] = 0;
			
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("<i>“Thanks for that, [name],”</i> Miranda stretches languidly. <i>“Shall we go?”</i>", parse);
				Text.NL();
				Text.Add("You finish your drinks and head out into the slums.", parse);
				Text.NL();
				
				miranda.relation.IncreaseStat(100, 5);
				Scenes.Miranda.DatingScore++;
						
				miranda.flags["Dates"]++;
				Scenes.Miranda.DatingStage2();
			});
		}, enabled : true,
		tooltip : "Get down on your knees and give her a blowjob."
	});
	options.push({ nameStr : "Refuse",
		func : function() {
			Text.Clear();
			if(miranda.Attitude() >= Miranda.Attitude.Neutral) {
				Text.Add("<i>“Well, fuck. I’m sure you’ll come around sooner or later.”</i> Miranda sounds determined, if a bit disappointed. <i>“I’m not giving up on this, but you are off the hook until later tonight. Shall we go?”</i>", parse);
				Text.NL();
				Text.Add("You finish your drinks and head out into the slums.", parse);
				Text.NL();
				Scenes.Miranda.DatingScore--;
				miranda.relation.DecreaseStat(0, 5);		
				
				miranda.flags["Dates"]++;
				Scenes.Miranda.DatingStage2();
			}
			else {
				Text.Add("<i>“In that case, you can forget going out with me,”</i> she declares dismissively, going back to her drink. <i>“I don’t date sluts who aren’t honest with themselves.”</i>", parse);
				Text.Flush();
				
				miranda.flags["dLock"] = 1;
				
				Gui.NextPrompt();
			}
		}, enabled : true,
		tooltip : "No! You’re not going to do that!"
	});
	Gui.SetButtonsFromList(options, false, null);
}

// BAR HANGOUT
//TODO
Scenes.Miranda.DatingStage1 = function() {
	var parse = {
		
	};
	
	var contfunc = function() {
		Text.Add("<i>“How about we duck outside for a while?”</i> the guardswoman asks suggestively. Following her, the two of you head out into the slums of Rigard.", parse);
		Text.NL();
		
		Scenes.Miranda.DatingStage2();
	}
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“Wanna stick around for a few drinks first?”</i> before you have opportunity to respond, she calls for another round, asking for the ‘special’. The barkeep comes over with two mugs filled with a clear, colorless substance. <i>“Have a taste of this, it packs quite a punch!”</i> the guardswoman urges you on.", parse);
		Text.Flush();
		
		//[Drink][Don’t]
		var options = new Array();
		options.push({ nameStr : "Drink",
			func : function() {
				Text.Clear();
				Text.Add("You both down your mugs, your head swimming and throat burning from the incredibly strong liquid.", parse);
				Text.NL();
				
				var drunk = player.Drink(2, true); //Supress regular handler
				
				if(drunk) {
					Text.Add("Your vision is starting to blur, and things are becoming kinda fuzzy. Just as you start wondering what the hell was in the drink, you black out.", parse);
					Text.Flush();
					
					var remaining = player.drunkLevel - 0.8;
					var minutes   = Math.floor(remaining / player.DrunkRecoveryRate() * 60);
					
					world.TimeStep({minute: minutes});
					
					Gui.NextPrompt(function() {
						Text.Clear();
						Text.Add("When you finally come to, you are prone on the ground, your head pounding something fierce. You throw a quick accusatory glance at Miranda, who is still sitting at the table.", parse);
						Text.NL();
						Text.Add("<i>“I didn’t do anything to you!”</i> she scoffs, amused. <i>“Not my fault you can’t hold your drink.”</i>", parse);
						Text.NL();
						if(miranda.Nasty())
							Text.Add("<i>“Besides, if I <b>did</b> want to take advantage of you, it’d be much more fun if you were awake for it.”</i> You guess that you can, in a weird way, trust her on that at least.", parse);
						else
							Text.Add("<i>“Well… sorry anyways,</i> she apologizes a bit guiltily.", parse);
						Text.NL();
						Text.Add("<i>“I’ll see you around I guess. I think we can forget about the date until you can walk properly again.”</i>", parse);
						Text.Flush();
						Gui.NextPrompt();
					});
				}
				else {
					Text.Add("<i>“That’s the spirit!”</i> Miranda cheers you on. You somehow manage to keep up with the dobie, but <i>damn</i> she parties hard! The two of you have a few more drinks, but nothing as strong as the first one.", parse);
					Text.NL();
					Scenes.Miranda.DatingScore++;
					contfunc();
				}
			}, enabled : true,
			tooltip : "Bottoms up!"
		});
		options.push({ nameStr : "Don’t",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Come on, don’t be such a pussy,”</i> Miranda growls, downing her own mug in one go. You can almost taste the alcohol in her exhaled breath. <i>“Ahh, that hit the spot.”</i>", parse);
				Text.NL();
				Text.Add("You stay in the tavern for a while, Miranda taking a few more drinks while you politely refuse taking any. Finally, she seems to grow bored.", parse);
				Text.NL();
				Scenes.Miranda.DatingScore--;
				contfunc();
			}, enabled : true,
			tooltip : "Decline. You’re not quite sure what’s in that."
		});
		Gui.SetButtonsFromList(options, false, null);
	}, 1.0, function() { return true; });
	//TODO
	/*
	scenes.AddEnc(function() {
		Text.Add("", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	*/
	//Fallback
	scenes.AddEnc(function() {
		Text.Add("You make some small talk, but Miranda is beginning to look bored.", parse);
		Text.NL();
		contfunc();
	}, 0.2, function() { return true; });
	
	scenes.Get();
}

// TOWN EVENTS
//TODO
Scenes.Miranda.DatingStage2 = function() {
	var parse = {
		
	};
	
	world.TimeStep({hour: 1});
	
	Gui.Callstack.push(function() { //TODO
		Text.Add("After some time, the two of you have made your way to Miranda’s house. The dobie turns to look at you expectantly.", parse);
		Text.NL();
		Scenes.Miranda.DatingStage3();
	});
	
	var talkPrompt = function() {
		//[Her past][Sex stories][Her place]
		var options = new Array();
		options.push({ nameStr : "Her past",
			func : Scenes.Miranda.TalkBackstory, enabled : true,
			tooltip : "Ask her for her story."
		});
		options.push({ nameStr : "Sex stories",
			func : Scenes.Miranda.TalkConquests, enabled : true,
			tooltip : "Ask her for some raunchier stories. She’s bound to have some, right?"
		});
		options.push({ nameStr : "Her place",
			func : function() {
				Text.Clear();
				if(miranda.Nasty())
					Text.Add("<i>“Can hardly wait to get the dick, can you?”</i> Miranda laughs mockingly. <i>“Fine, let’s head to my place so I can bang your brains out, slut.”</i>", parse);
				else
					Text.Add("<i>“My, eager aren’t we?”</i> Miranda laughs, changing direction. <i>“Come along then, lover!”</i>", parse);
				Text.NL();
				Scenes.Miranda.DatingScore++;
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Just cut right to the chase and take her home."
		});
		
		Gui.SetButtonsFromList(options, false, null);
	}
	
	var scenes = new EncounterTable();
	//((Wandering around slums))
	scenes.AddEnc(function() {
		Text.Add("You wander the sprawling slums of the city, Miranda pointing out various of her old haunts as a kid, or places you should be wary of. These parts are to the vast majority filled with unfortunate souls, and desperation makes people do unsavoury things.", parse);
		Text.NL();
		Text.Add("The guardswoman walks the streets like if she owns them, confident in her stride. Now would be a good time to talk to her, when her head isn’t deep down a cup of booze.", parse);
		Text.Flush();
		
		talkPrompt();
	}, 1.0, function() { return true; });
	/* TODO
	scenes.AddEnc(function() {
		Text.Add("", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	*/
	
	scenes.Get();
}

Scenes.Miranda.TalkBackstory = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("As you walk, you ask if she could tell you a bit about her past and her life in the city.", parse);
	Text.NL();
	Text.Add("<i>“Talk about myself? I guess… now where to start.”</i>", parse);
	Text.NL();
	
	var scenes = [];
	
	// ((Story of growing up in Rigard))
	scenes.push(function() {
		Text.Add("<i>“Me and my family grew up here in Rigard,”</i> Miranda begins thoughtfully. <i>“We had a pretty nice house in the residential district - nothing posh, but bigger than the one I have now. Nice enough place, though I remember very little of it.”</i>", parse);
		Text.NL();
		if(miranda.flags["bgRotMax"] == 0) {
			Text.Add("You ask her why that is? Did they move?", parse);
			Text.NL();
			Text.Add("<i>“The rebellion is what happened,”</i> she answers shortly. <i>“I have about the same sob story as every other person in the damn city.”</i> You decide not to pry further until she tells you herself.", parse);
			Text.NL();
		}
		Text.Add("<i>“Back then, it was me, my sister Belinda, mom and dad. It was a cute and cozy little family, though I must have been a handful. Bel was always the prim and proper one. The irony of that.”</i> She chuckles bitterly.", parse);
		Text.NL();
		Text.Add("<i>“I guess I was kind of a brat back then, running around town and beating up other kids my age. Now that I think about it, that last part hasn’t changed much. I probably fit in much better in the slums, but my sister loved the city.”</i>", parse);
		Text.NL();
		Text.Add("She trails off a bit, unwilling or unable to go on.", parse);
		Text.NL();
		
		PrintDefaultOptions();
	});
	if(miranda.Relation() >= 25) {
		// ((Death of her parents))
		scenes.push(function() {
			Text.Add("<i>“Remember what I said about the rebellion? There was all sorts of bad stuff brewing in the city after that. Neither of my parents took part, but the city was rife with anti-morph sentiments. Just about everyone was scared and nobody knew what the recently crowned king was going to do next. Many who probably should have fled the city stayed, perhaps because they simply didn’t know anything else.”</i>", parse);
			Text.NL();
			Text.Add("<i>“I just remember hazy details of it, but me and my family were forced out into the slums, thrown out of our house and put in a small shed, like a kennel for common dogs.”</i>", parse);
			Text.NL();
			Text.Add("<i>“There was a big riot, a large mob of bigoted scum coming down hard on the slums. Bloody miracle the entire city didn’t burn to the ground. Perhaps it would have been better if it did.”</i>", parse);
			Text.NL();
			if(miranda.flags["bgRotMax"] == 1) {
				Text.Add("She is clearly coming up to a particularly painful part of her story, so you refrain from asking any questions for now.", parse);
				Text.NL();
			}
			Text.Add("<i>“Mom and dad were both killed - while blood flowed on the streets as the military clashed with the mob, some thugs broke into our house to take what little we had. My parents… protected me and my sister, but paid a horrible price for it.”</i>", parse);
			Text.NL();
			Text.Add("Miranda hangs her head. <i>“What am I thinking, this is hardly a good story for a date. Sorry, [playername], but my tale is what it is.”</i> You ask her if she’s fine. <i>“Don’t worry about me,”</i> she snaps back. <i>“I’ve gotten over it. No need to dig up old wounds.”</i>", parse);
			Text.NL();
			
			PrintDefaultOptions();
		});
		// ((The slums))
		scenes.push(function() {
			Text.Add("<i>“Life in the slums was tough for two orphaned kids. I don’t think I was older than ten when we had to start fending for ourselves, and my sister only eight. Bel took it particularly hard, so it was up to me to try and protect the little puppy. Fat thanks I got for that,”</i> she grumbles.", parse);
			Text.NL();
			Text.Add("<i>“I think I mentioned it before, but when we first moved to the slums, I spent a lot of time in the docks. I returned there to look for work after we buried our parents, as Bel was fat little use, just running around crying all the time. We were hardly the only ones in the same situation, so there was not going to be any charitable benefactor to help us survive. Not one that didn’t come with unbearable consequences.”</i>", parse);
			Text.NL();
			Text.Add("You look at her curiously. <i>“Trust me, you are better off not knowing about some of the offers me and my sister were given.”</i>", parse);
			Text.NL();
			Text.Add("<i>“We were able to get by thanks to my work anyways. I was strong for my size even back then, and hauling crates all day sure didn’t change that. I got to hang with the sailors who talked about distant lands on the other side of Eden, the free cities, and even the secret city hidden in the upper branches of the Great Tree. Not that anyone had actually visited the latter, but they all bragged about knowing someone who had.”</i>", parse);
			Text.NL();
			Text.Add("<i>“I used to dream I could go with them, but I couldn’t bring myself to leave my sister all alone.”</i>", parse);
			Text.NL();
			
			PrintDefaultOptions();
		});
		if(miranda.Relation() >= 50) {
			// ((Joining the mercs))
			scenes.push(function() {
				Text.Add("<i>“Years went by in the slums. Both me and Bel grew up into proper ladies - well, Bel did at least. It never quite caught on me,”</i> she grins. <i>“Plus, I had this little addition,”</i> she adds, patting her bulge fondly. <i>“While that sure as hell didn’t help me while growing up, I got a reputation for shutting people up who thought it a fair reason to try and bully me.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Even later, I found… different ways to get back at my tormentors, something that hurt their pride even more than a sound beating would.”</i> She grins lewdly. <i>“The best part is that they were all willing - almost all, after a bit of persuasion. Nothing better than breaking in some cocky ass who thinks the world revolves around him.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Anyways, that was a side note… unless you want to talk more about that, perhaps?”</i> she adds sweetly.", parse);
				Text.Flush();
				
				//[Sure!][No]
				var options = new Array();
				options.push({ nameStr : "Sure!",
				// ((Seduction supreme))
					func : function() {
						Text.Clear();
						parse["guyGirl"] = player.mfTrue("guy", "girl");
						parse["heshe"]   = player.mfTrue("he", "she");
						parse["hisher"]  = player.mfTrue("his", "her");
						parse["himher"]  = player.mfTrue("him", "her");
						
						Text.Add("<i>“Oh really now, then let’s find somewhere to discuss it further, why don’t we?”</i> The two of you walk together, Miranda chatting freely about her past conquests. <i>“You see, there was this [guyGirl], <b>really</b> pretty thing. Met [himher] pretty recently actually, while standing guard at the gates. Knew I had to tap that as soon as I saw [himher], so I invited them over to the Maidens’ Bane.”</i>", parse);
						Text.NL();
						
						var sexedCount = 0;
						for(var flag in miranda.sex)
							sexedCount += miranda.sex[flag];
						
						if(sexedCount >= 25) {
							Text.Add("The guardswoman goes on to describe all the lewd things she and her mystery lover have been up to. Just how would one find the hours in the day for all that?", parse);
						}
						else {
							Text.Add("<i>“Haven’t gotten [himher] in bed as much as I’d like yet, but I’m pretty certain I’m going to, <b>real</b> soon. ", parse);
							if(miranda.Nice())
								Text.Add("You wouldn’t believe the kind of stuff [heshe]’s into. Well, perhaps you would, at that.”</i>", parse);
							else
								Text.Add("Pretty sure they can’t wait to get fucked either, for all that they are playing coy.”</i>", parse);
						}
						Text.NL();
						parse["soon"] = sexedCount >= 25 ? " soon-to-be" : "";
						Text.Add("You are almost starting to feel a bit intimidated by this mystery flirt that she’s apparently courting on the side. And just where is this[soon] lover of hers, you ask a bit grumpily?", parse);
						Text.NL();
						Text.Add("<i>“Standing on my front porch, wearing a stupid look on [hisher] face,”</i> Miranda grins. With a start, you realize that you’ve arrived at her home.", parse);
						Text.NL();
						
						Scenes.Miranda.DatingScore++;
						
						Gui.Callstack.pop();
						Scenes.Miranda.DatingStage3();
						
						// Don't forward the convo until it has been revealed
						if(miranda.flags["bgRotMax"] == 3)
							sceneId--;
					}, enabled : true,
					tooltip : "That sounds interesting!"
				});
				options.push({ nameStr : "No",
					func : function() {
						Text.Clear();
						Text.Add("Seeing the trap coming from a mile away, you politely decline, asking her to continue the story.", parse);
						Text.NL();
						Text.Add("<i>“Bah, you are no fun!”</i> Miranda complains. <i>“...Where were I?”</i> Collecting her thoughts, she starts over again.", parse);
						Text.NL();
						Text.Add("<i>“As I said, me and Bel, grew up and filled out. It opened up new job opportunities for both of us. My body was built like a bar of iron, forged by working the docks. Hanging out with the sailors toned my tongue pretty damn rough too. Not to mention I could carry myself in a fight pretty well.”</i>", parse);
						Text.NL();
						Text.Add("<i>“I had grown pretty sick of the city, wanted to try new horizons, you know? Bel seemed to be able to handle herself, and there was a local mercenary guild that was hiring. Got a few complainers about a wee little girl joining their tough guy club, but a few broken teeth sorted that out well enough.”</i>", parse);
						Text.NL();
						Text.Add("<i>“The guild was the Black Hounds - I believe I showed you the guild hall earlier. Fucking scum the entire lot of them, but I sure as hell got what I wanted out of it.”</i>", parse);
						Text.NL();
						
						PrintDefaultOptions();
					}, enabled : true,
					tooltip : "Ah… no, you are fine. Please continue the story."
				});
				Gui.SetButtonsFromList(options, false, null);
			});
			// ((Time with the mercs))
			scenes.push(function() {
				Text.Add("<i>“The Black Hounds were a rowdy bunch, both on and off duty. How they still get contracts after some of the shit we did is beyond me. We usually got the job done either way, and it wasn’t like we had much competition in our price class.”</i>", parse);
				Text.NL();
				Text.Add("<i>“I got to spend a lot of time outside Rigard at the very least, travelling all over Eden. I’ve seen the free cities, visited the desert oasis, spent time among the highland tribes. Wherever there was trouble, the Black Hounds were there. Sometimes even before the fact.”</i>", parse);
				Text.NL();
				Text.Add("<i>“There are a lot of stories I could tell you about that time… We’d occasionally return to Rigard for some RnR, and I’d check in on my sister, drop of some money and so on. The rest of the gang burnt all their money on booze and whores as quickly as they could.”</i>", parse);
				Text.NL();
				Text.Add("Not her though?", parse);
				Text.NL();
				Text.Add("<i>“Sure, I may have taken a drink or two from time to time-”</i> Now that sounds like an understatement if ever you heard one. <i>“I’ve never had to pay for sex though. I just have this way with the ladies. With men too, actually. I saw plenty of that kind of action on our missions abroad.”</i>", parse);
				Text.NL();
				
				PrintDefaultOptions();
			});
			// ((Joining the guard))
			scenes.push(function() {
				Text.Add("<i>“Finally, I grew sick of the Hounds. One can only stand so much shit before seeking another line of work… but beating the crap out of people was kinda my thing. Still is. I looked around for something more… respectable, is perhaps the word.”</i> She doesn’t sound like she uses it very much. <i>“I found the guard. Marginally better, perhaps, but they pay well and I don’t have to feel guilty about the people I beat up.”</i>", parse);
				Text.NL();
				if(miranda.flags["bgRotMax"] == 5) {
					Text.Add("You hadn’t exactly suspected Miranda to have a conscience about the things she did, but the more you know.", parse);
					Text.NL();
				}
				Text.Add("<i>“With a nice little premium I got for joining, I was finally able to move out of the slums and back into the city proper. I kinda like my new place, it’s clean if nothing else. By that time, Belinda had already moved into the city, so there wasn’t really anything keeping me in that hovel anyways.”</i>", parse);
				Text.NL();
				if(miranda.flags["bgRotMax"] == 5) {
					Text.Add("You take note that she doesn’t mention where her sister got the money to do so, but you assume she would tell you if it was important.", parse);
					Text.NL();
				}
				Text.Add("<i>“Sure, it’s not very glamorous, but it’s about as good a job as a morph can get in this fucking town. Plus, it lets me do what I’m good at without me getting in trouble for it.”</i>", parse);
				Text.NL();
				Text.Add("Somehow you doubt that her career has been entirely without trouble. Call it a hunch.", parse);
				Text.NL();
				
				PrintDefaultOptions();
			});
			// ((Life in the guard))
			scenes.push(function() {
				Text.Add("<i>“I’ve been walking the streets of Rigard in uniform for years, cracking down hard on crime in this town,”</i> Miranda tells you, stretching languidly. <i>“Given my background, I’m privy to certain information most are not, namely an insight in how the lower layers of society <b>work</b> in this city. Makes me able to predict certain people’s behavior, and prevent any of their shenanigans. Or at the very least catch them in the act, so to speak.”</i> She grins. <i>“Always easier to slam them into a cell when they got a bag of loot slung over their shoulder. Makes people less likely to ask about why they’re walking funny too.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Rising to the upper ranks is pretty much impossible for someone like me; not that I’d want to be stuck pushing papers, mind you. If not for the fact that I’m a morph, I don’t bend over backwards to follow stupid orders from above. Still, it keeps me just where I want to be, prowling the streets. They might think I’m difficult to handle, but I’m just too damn good at what I do to get rid of.”</i>", parse);
				Text.NL();
				Text.Add("<i>“The higher ups don’t like me, but I’ve got respect where it matters. Not to mention that my current comrades are a hell of a better sort than my previous ones. Some of them are even nice people. I don’t really mind having a bit of city-backed authority either.”</i>", parse);
				Text.NL();
				Text.Add("<i>“I dunno what to say more, I think I’ll stick around with this for a while longer, don’t really have a reason to quit.”</i>", parse);
				Text.NL();
				
				PrintDefaultOptions();
			});
			if(miranda.Relation() >= 75) {
				// ((Belinda))
				scenes.push(function() {
					if(miranda.flags["bgRotMax"] == 7) {
						Text.Add("The guardswoman looks unusually thoughtful as she ponders where to pick up the story.", parse);
						Text.NL();
						Text.Add("<i>“Look, [playername], I haven’t been entirely honest with you. I think it’s time I tell you the whole story, without leaving out the bits about my sister. I rarely dwell on the past, and it’s a bit embarrassing, so I didn’t think it important. Thinking over things, I can’t really tell my story without it, though.”</i>", parse);
						Text.NL();
					}
					Text.Add("<i>“Like I said, both me and Bel found new work once we grew up. I joined the mercs and left my sister with enough cash to scrape by. Whenever I visited her, she seemed to be doing just fine, but I heard some strange rumors going around about her hanging out with strange sorts, and disappearing for long periods of time.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Little Belinda had grown up into a beautiful flower, and while I had been away, someone had plucked her. Quite a few someones, actually. My little sister had gone into prostitution.”</i> Her voice is a mixture of many emotions; anger, bitterness and more than a little guilt. <i>“We had a big fight when I confronted her about it, and next time I returned to the city, she had moved inside the walls. It was around this time I finally gave up on the Hounds and decided to join the guard.”</i>", parse);
					Text.NL();
					Text.Add("<i>“I… don’t really talk to my sister anymore. She’s working at some fancy brothel in the inner city and at least seems relatively well off.”</i> Miranda sighs. <i>“I guess I don’t really get her, talking to her just gets frustrating… least I can do is keep the streets clean.”</i>", parse);
					Text.NL();
					Text.Add("The dobie seems to have turned rather melancholy, and trails off.", parse);
					Text.NL();
					
					PrintDefaultOptions();
				});
				// ((Her feelings))
				scenes.push(function() {
					Text.Add("<i>“To be honest, I’m not sure what else to tell you,”</i> the dog-morph confesses. <i>“Spilling the beans about Belinda isn’t something I usually do with people, just so you know. Not that it’s a secret, exactly, but I never bring it up. And if they bring it up? Most likely it’ll earn them a punch in the face.”</i>", parse);
					Text.NL();
					Text.Add("<i>“It’s… frustrating, sure, but in the end she’s her own woman and can make her own decisions. She’s sure as hell better off than I am, in either case. I’m not entirely sure what I was thinking when I joined the guard; perhaps I wanted to clean up the streets to keep my little sister safe, but that isn’t really an issue anymore.”</i>", parse);
					Text.NL();
					Text.Add("<i>“I guess that as long as I can do what I like doing - drinking, fighting and having sex - it doesn’t really matter what job I have.”</i> She scratches her head. <i>“Well, this got all reflective and shit. Not really what I intended. Up for some of that sex perhaps?”</i>", parse);
					Text.NL();
					
					PrintDefaultOptions();
				});
			}
		}
	}
	
	var sceneId = miranda.flags["bgRot"];
	if(sceneId >= scenes.length) sceneId = 0;
	
	miranda.flags["bgRot"] = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
	
	if(miranda.flags["bgRotMax"] < sceneId)
		miranda.flags["bgRotMax"] = sceneId;
}
Scenes.Miranda.TalkConquests = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("<i>“You’d like to hear about some of my lovers? I don’t really mind but… wouldn’t you feel jealous?”</i> she asks, grinning suggestively. You assure her that you wouldn’t. <i>“Who to talk about then… so many to choose from.”</i>", parse);
	Text.NL();
	
	var scenes = [];
	
	// Long
	scenes.push(function() {
		Text.Add("<i>“Remember when I told you about my first time? This would be back in the slums, before I joined the mercs. I was working down the docks, hauling crates onto ships and so on. He was a cabin boy about my age on one of the ships that pulled in - pretty little thing too - so he wasn’t aware of my ‘extras’.”</i> She grins wolfishly.", parse);
		Text.NL();
		Text.Add("<i>“It was really nice to have someone hit on me for a change. The ship came in from the free cities, so he didn’t really have anything against morphs. Not against cocks either, as it turned out. Well, I had to persuade him a bit, but he eventually came around to seeing things my way. We tried many things together, but I found myself liking pitching way more than I did receiving.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Our thing didn’t last very long, as his ship returned home after a few weeks - I think they made a few short voyages out to the lake fishing or something. Doesn’t really matter. I wasn’t interested in why they were there anyways.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Pretty sure I had a large impact on him… if nothing else, I have fond memories of him. Couldn’t remember his name for the life of me though.”</i>", parse);
		Text.NL();
		
		PrintDefaultOptions();
	});
	scenes.push(function() {
		Text.Add("<i>“After my first time, I kept a steady stream of girlfriends and boyfriends. I was hooked on sex, but I could never keep myself in a relationship very long. Perhaps I’m not cut out for them. Even when I stuck together with someone for a longer period of time, I had flings on the side.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Wasn’t very long until I had my first threesome. Actually, there was a girl I had been fucking for a while - a cute catgirl, but a real beast in bed. I caught her cheating on me with some boy, and much to their surprise, rather than being angry with them, I joined in.”</i>", parse);
		Text.NL();
		Text.Add("The herm sighs, reminiscing of better times. <i>“Kept them up most of the night too; and when we had fucked the kitty silly for hours, using just about every hole she had, I switched over to her boyfriend.”</i> She gives you an evil grin. <i>“Neither of them were walking right the next day, let me tell you.”</i>", parse);
		Text.NL();
		Text.Add("And tell you she does, at some length and with flowery detail.", parse);
		Text.NL();
		
		PrintDefaultOptions();
	});
	scenes.push(function() {
		Text.Add("<i>“I’m usually quite forward about my sexuality, domineering even. It took quite a while until I really let someone else lead… not until I had joined the mercs.”</i> She sees your look and waves it off. <i>“No, not one of the Hounds. We were out on a mission to one of the free cities; don’t remember which one. I think it had a port.”</i>", parse);
		Text.NL();
		Text.Add("<i>“We had just pushed back a party of raiders, and had captured their leader. He was a minotaur of some kind - damn he was a big fellow, and in more ways than one! The elders wanted to throw him in prison, but I thought that it would be a waste… I had talked to him on the way back to the city, ”</i> Miranda explained. <i>“He wasn’t such a bad sort, really. He and his tribe had been driven out of the mountains, and were just trying to survive. He was quite impressed by the beating I had given him, and told me as much.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Since he was my catch, the others didn’t complain when I told the town elders to fuck off and kept him for myself instead. Having suffered public defeat, he had no reason to go back to his tribe, so he decided to follow the one who had beaten him instead. Man, what a beast tho!”</i> she whistles in appreciation. <i>“Our nights were like battles unto themselves, even I had trouble keeping him in check. I was quite surprised when he managed to overpower me and bend me over on all fours, shoving that immense cock of his into my poor pussy. My ass too, actually, he liked to experiment.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I found myself going easy on him on purpose, just to see what it felt like to be the one being dominated, for once. Can’t say that I didn’t enjoy being filled by a stud like him… not that it prevented me from returning the favor on occasion.”</i>", parse);
		Text.NL();
		Text.Add("<i>“We parted ways when our party eventually returned to Rigard. I assume he returned to the mountains to try and create a new tribe.”</i>", parse);
		Text.NL();
		
		PrintDefaultOptions();
	});
	scenes.push(function() {
		Text.Add("<i>“My promiscuity hasn’t exactly decreased since I joined the watch.”</i> Somehow, that seems an understatement. Had she been even hornier when she was younger, you doubt she would’ve been able to function. <i>“Being the law in town has its perks… I’ve let more than one criminal off easy in exchange for a few favors.”</i>", parse);
		Text.NL();
		Text.Add("She studies your reaction to this. <i>“Understand, I’m not going around letting murderers loose for blowjobs. I wouldn’t release anyone dangerous… but I’ve found that a thorough reaming provides <b>much</b> more incentive for a thief to stay on the right side of the law than a small fine. That, and they know that <b>I</b> know how to find them again.”</i>", parse);
		Text.NL();
		if(terry.flags["Met"] >= Terry.Met.Caught) {
			var req = terry.flags["Saved"] >= Terry.Saved.Saved;
			parse["t"] = req ? " - Terry, was it" : "";
			Text.Add("<i>“Case and point, remember that thief that we caught[t]?”</i> You nod. <i>“No one really gives a shit about Krawitz; he’s a small time noble without any real influence. He’s doesn’t exactly have a clear conscience himself, considering the things that were found when searching his mansion. I only intended to show him some… corrective action, perhaps throw him in a cell for a few days as payback for that note. That’d make sure he didn’t stir up trouble in my city again. The little fox would’ve been far better off in my care than in that of the royal guard, believe me.”</i>", parse);
			Text.NL();
			if(req)
				Text.Add("You’re not sure Terry would agree with that, but you let it slide. To be sure, he wasn’t in a very happy place when you let him out of prison, but you aren’t sure if he’d be much happier being fucked by Miranda for days on end.", parse);
			else
				Text.Add("You aren’t really sure if the fox would agree to that. Then again, if what she’s saying is true, he wouldn’t be locked in jail right now - potentially on death row.", parse);
			Text.NL();
		}
		Text.Add("<i>“It’s a peculiar kind of justice, for sure, but it works.”</i> Somehow, you suspect that Miranda is overstating her exploits at bit; if nothing else, you are really doubtful that anyone would let her keep her job for this long if she went around and raped the entire underworld of Rigard on a regular basis.", parse);
		Text.NL();
		
		PrintDefaultOptions();
	});
	/* TODO
	scenes.push(function() {
		Text.Add("", parse);
		Text.NL();
		
		PrintDefaultOptions();
	});
	*/
	Scenes.Miranda.DatingScore++;
	player.AddLustFraction(0.3);
	
	var sceneId = miranda.flags["ssRot"];
	if(sceneId >= scenes.length) sceneId = 0;
	
	miranda.flags["ssRot"] = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
}

// HOMECOMING
//TODO
Scenes.Miranda.DatingStage3 = function() {
	var dom = miranda.SubDom() - player.SubDom();
	
	var parse = {
		playername : player.name,
		stud : dom >= 50 ? player.mfTrue("master", "mistress") : player.mfTrue("stud", "beautiful")
	};
	
	world.TimeStep({hour: 1});
	
	if(Scenes.Miranda.DatingScore > 1) {
		Text.Add("<i>“Mm… I can’t wait to get my paws on you, sexy,”</i> Miranda purrs. <i>“Get inside, [stud]! This doggie’s got a bone for you to pick. Any way you want to roll, I’ll roll.”</i>", parse);
		Text.Flush();
		
		//[Take charge][Passive][Decline]
		var options = new Array();
		options.push({ nameStr : "Take charge",
			func : function() {
				Text.Clear();
				Text.Add("You catch the surprised Miranda in a deep kiss, fumbling with the door as you grope her. You twirl her around, giving her crotch a familiar grope before you push her into the house, closing the door behind you.", parse);
				
				miranda.relation.IncreaseStat(50, 2);
				
				Scenes.Miranda.HomeDommySex();
			}, enabled : miranda.SubDom() - (miranda.Relation() + player.SubDom()) < 0,
			tooltip : "You can’t wait to get a piece of her."
		});
		options.push({ nameStr : "Passive",
			func : function() {
				Text.Clear();
				Text.Add("<i>“In a subby mood today, pet?”</i> Miranda grins as you let yourself be led inside, pushing you through the open doorway. <i>“That’s how I like them.”</i> You can feel her stiff member poking you in the back, and suspect you might get into even closer contact with it shortly.", parse);
				
				miranda.relation.IncreaseStat(60, 2);
				
				Scenes.Miranda.HomeSubbySex();
			}, enabled : true,
			tooltip : "Let Miranda call the shots."
		});
		options.push({ nameStr : "Decline",
			func : function() {
				Text.Clear();
				Text.Add("<i>“That’s really a shame,”</i> Miranda pouts. <i>“Now how am I going to keep concentration on patrol tomorrow? Not even a quickie?”</i>", parse);
				Text.NL();
				Text.Add("You shake your head, saying your goodbyes. The herm heads back inside, probably making a beeline for her toy collection. ", parse);
				if(party.Alone()) {
					Text.Add("You are left standing in the street, wondering what to do next.", parse);
					Text.Flush();
					Gui.NextPrompt();
				}
				else {
					parse["name"]   = party.Two() ? party.Get(1).name     : "your party";
					parse["himher"] = party.Two() ? party.Get(1).himher() : "them";
					Text.Add("First, you need to rendezvous with [name]. You make your way outside the inner walls and meet up with [himher] outside the dingy old tavern.", parse);
					Text.Flush();
					
					Gui.NextPrompt(function() {
						MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 20});
					});
				}
			}, enabled : true,
			tooltip : "Not tonight."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else if(Scenes.Miranda.DatingScore >= -1) {
		Text.Add("<i>“You gotta step up your game, [playername]. Tell you what, you still have a shot at saving this date. It involves you, wrapped around my cock,”</i> the dommy herm gives you a sly grin.", parse);
		Text.Flush();
		
		//[Passive][Decline]
		var options = new Array();
		options.push({ nameStr : "Passive",
			func : function() {
				Text.Clear();
				Text.Add("You let yourself be led inside, pushed through the open door with Miranda close in tow. You can feel her stiff member poking you in the back, and suspect you might get into even closer contact with it shortly.", parse);
				
				miranda.relation.IncreaseStat(60, 1);
				
				Scenes.Miranda.HomeSubbySex();
			}, enabled : true,
			tooltip : "Follow her lead."
		});
		options.push({ nameStr : "Decline",
			func : function() {
				Text.Clear();
				Text.Add("<i>“If that’s the way you want it, fine. Come see me at the bar when you change your mind.”</i> With that, she turns and slams the door behind her, leaving you on the street outside.", parse);
				miranda.relation.DecreaseStat(0, 1);
				
				if(party.Alone()) {
					Text.Flush();
					Gui.NextPrompt();
				}
				else {
					parse["name"]   = party.Two() ? party.Get(1).name     : "your party";
					parse["himher"] = party.Two() ? party.Get(1).himher() : "them";
					Text.NL();
					Text.Add("First, you need to rendezvous with [name]. You make your way outside the inner walls and meet up with [himher] outside the dingy old tavern.", parse);
					Text.Flush();
					
					Gui.NextPrompt(function() {
						MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 20});
					});
				}
			}, enabled : true,
			tooltip : "...No."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		Text.Add("<i>“I have something <b>very</b> special in mind for you tonight, my little slut,”</i> Miranda growls through a grin that’s all teeth. <i>“I’m going to give you a ride your body isn’t likely to forget for weeks… are you coming?”</i>", parse);
		Text.Flush();
		
		//[Follow][Decline]
		var options = new Array();
		options.push({ nameStr : "Follow",
			func : function() {
				Text.Clear();
				Text.Add("You back away, shaking your head. ", parse);
				if(miranda.flags["subCellar"] != 0) {
					Text.Add("…It’s probably nothing, you tell yourself. And you are about to score, all right! Miranda leads you inside, smiling encouragingly. You have a few moments to look around the room before the floor rushes to meet you, and everything goes black.", parse);
				}
				else {
					Text.Add("Gulping, you meet her eyes and nod. There is a flicker of surprise in Miranda’s expression, quickly replaced by a wide predatory grin as she invites you inside. You both know what’s going to happen next.", parse);
					miranda.relation.IncreaseStat(60, 2);
				}
				Text.Flush();
				
				Scenes.Miranda.HomeSubbyDungeon();
			}, enabled : true,
			tooltip : miranda.flags["subCellar"] != 0 ? "You know very well what’s going to happen… and you look forward to it." : "Sure... what could go wrong?"
		});
		options.push({ nameStr : "Decline",
			func : function() {
				Text.Clear();
				if(miranda.flags["subCellar"] != 0)
					Text.Add("You’re not going back into her cellar again, no way!", parse);
				else
					Text.Add("You’re not really sure what she’s up to, but it’s bound to be bad news for you.", parse);
				Text.NL();
				Text.Add("<i>“Spoilsport,”</i> Miranda grunts, stepping inside and shutting the door behind her as you book it.", parse);
				
				miranda.relation.DecreaseStat(0, 2);
				
				if(party.Alone()) {
					Text.Flush();
					Gui.NextPrompt();
				}
				else {
					parse["name"]   = party.Two() ? party.Get(1).name     : "your party";
					parse["himher"] = party.Two() ? party.Get(1).himher() : "them";
					Text.NL();
					Text.Add("First, you need to rendezvous with [name]. You make your way outside the inner walls and meet up with [himher] outside the dingy old tavern.", parse);
					Text.Flush();
					
					Gui.NextPrompt(function() {
						MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 20});
					});
				}
			}, enabled : true,
			tooltip : "It’s a trap! Flee!"
		});
		Gui.SetButtonsFromList(options, false, null);
	}
}

Scenes.Miranda.DatingFirstDocks = function() {
	
	var parse = {
		
	};
	
	party.location = world.loc.Rigard.Slums.docks;
	world.TimeStep({minute: 20});
	
	Text.Add("Leaving the small garden behind, the two of you head down a well-trodden road, not quite deserted, even at this hour. After a while, you begin to notice the smell of brine and fish, as your steps takes you closer to the dock area. There are large crates lining the sides of large warehouses, mostly empty but sure to be filled with a new catch the next morning. Along the riverside, a minor fleet of small fishing boats lie tied.", parse);
	Text.NL();
	Text.Add("<i>“Fish is a major food supply for Rigard,”</i> Miranda explains. <i>“Not only that, but the river provides other treasures.”</i> She points toward a larger barge moored near a giant warehouse, bustling with activity. <i>“It is one of the safer ways to reach the other nations on Eden, and the ocean cities. Traders make regular journeys there, though with the recent surge in attacks from outlaws, they need to hire escorts.”</i>", parse);
	Text.NL();
	Text.Add("The guardswoman looks to be in her element. <i>“I used to run around here all the time when I was a kid, talking with the sailors and exploring abandoned warehouses. Such good adventures!”</i>", parse);
	Text.Flush();
	
	//[Polite][Rude][Sultry]
	var options = new Array();
	options.push({ nameStr : "Polite",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Hey, you making fun of me?”</i> Miranda growls playfully, nudging you. <i>“I know it doesn’t look like much, but for a kid, there was so much to see and learn. The sailors may seem a bit rough around the edges, but they had much to teach.”</i>", parse);
			Text.NL();
			Text.Add("She certainly seems to have picked up their language.", parse);
			Text.NL();
			
			miranda.relation.IncreaseStat(100, 2);
			Scenes.Miranda.DatingScore++;
			
			Scenes.Miranda.DatingFirstMercs();
		}, enabled : true,
		tooltip : "Seems like a nice place to grow up."
	});
	options.push({ nameStr : "Rude",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Well… true,”</i> Miranda grudgingly admits. <i>“Still, it’s not that bad. For a little eight-year old, this place was cool as fuck.”</i>", parse);
			Text.NL();
			Scenes.Miranda.DatingFirstMercs();
		}, enabled : true,
		tooltip : "It stinks of fish and worse."
	});
	options.push({ nameStr : "Sultry",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Hey… I think of things other than sex, you know.”</i> Miranda frowns at you. <i>“’Sides, I was just a kid at the time.”</i> Seems like you upset her a bit.", parse);
			Text.NL();

			miranda.relation.DecreaseStat(-100, 2);
			Scenes.Miranda.DatingScore--;
			
			Scenes.Miranda.DatingFirstMercs();
		}, enabled : true,
		tooltip : "You’re sure she had some ‘adventures’ here, alright."
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Miranda.DatingFirstMercs = function() {
	var parse = {
		
	};
	
	world.TimeStep({minute: 20});
	
	Text.Add("<i>“I mentioned escorts, didn’t I?”</i> Miranda murmurs thoughtfully. <i>“Which brings us to this place.”</i> You are standing before a large two-story building at the edge of the docks district, far enough away from it to alleviate the smell slightly, but close enough to have the local water holes within close distance. It looks to be in relatively good shape for the slums, though the thick wooden door is marred with what looks like sword slashes.", parse);
	Text.NL();
	Text.Add("<i>“This is home to one of the larger mercenary guilds in Rigard, the Black Hounds. I used to work for them, before I became all nice and proper.”</i> Proper? What was she like before? <i>“As you can see, it’s a rough business. Pay is decent and you get to travel a lot though. All in all, this building probably holds some of the worst scum Rigard has to offer.”</i> You can tell that she means it, but there is a small touch of fondness and pride in her voice.", parse);
	Text.Flush();
	
	//[Polite][Rude][Sultry]
	var options = new Array();
	options.push({ nameStr : "Polite",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Nice?”</i> Miranda scoffs. <i>“Did you listen to a word I just said? This place is a cesspool for the lowest criminal scum in the city, anyone who can handle a weapon is welcome to join. Only reason they didn’t try to rape the pretty young doggie’s brains out when she entered was that I had already gotten a bit of a reputation at that point. Anyone brave enough to assault me would end up with a broken arm or two, and be unable to sit properly for a few weeks. I was strong, even back then.”</i>", parse);
			Text.NL();
			Text.Add("<i>“I was glad to leave this shithole behind when better opportunities opened up.”</i>", parse);
			Text.NL();
			
			miranda.relation.DecreaseStat(-100, 1);
			Scenes.Miranda.DatingScore--;
			
			Scenes.Miranda.DatingFirstCity();
		}, enabled : true,
		tooltip : "How come she left if this is such a nice place?"
	});
	options.push({ nameStr : "Rude",
		func : function() {
			Text.Clear();
			Text.Add("<i>“My thoughts exactly. It was nice work. Shame about the crowd I had to hang with though.”</i> There is a wicked smile playing on Miranda’s lips. <i>“I still bump into some of them these days, but usually in work-related matters. Being the law has its perks at times.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Let’s ditch this place anyways, I got better things to do than chat about the old days.”</i>", parse);
			Text.NL();
			
			miranda.relation.IncreaseStat(100, 3);
			Scenes.Miranda.DatingScore++;
			
			Scenes.Miranda.DatingFirstCity();
		}, enabled : true,
		tooltip : "What a dungheap."
	});
	options.push({ nameStr : "Sultry",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Very funny, asshole,”</i> she chuckles. <i>“True, though. Not much else to do between missions. Of course, I gave as much as I took, if not more.”</i> The guardswoman looks thoughtful.", parse);
			Text.NL();
			Text.Add("<i>“Then there was the matter of the reward for finished jobs. Coming from the slums, I didn’t really have a good hand with money anyways, so I tended to accept substitutes at times.”</i> She grins widely at your raised eyebrow. <i>“Got problems with bandits? I’ll fuck them up. Then I’ll come back and fuck you… probably a lot more and a lot rougher than you were hoping for.”</i>", parse);
			Text.NL();
			
			miranda.relation.IncreaseStat(100, 1);
			
			Scenes.Miranda.DatingFirstCity();
		}, enabled : true,
		tooltip : " Lots of travel with a rowdy band of thugs? So she’s been around, so to speak?"
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Miranda.DatingFirstCity = function() {
	var parse = {
		boyGirl : player.mfTrue("boy", "girl"),
		tongueDesc : function() { return player.TongueDesc(); },
		breastDesc : function() { return player.FirstBreastRow().Short(); }
	};
	
	party.location = world.loc.Rigard.Residental.street;
	world.TimeStep({minute: 20});
	
	Text.Add("<i>“Seen enough of the slums to last you for tonight?”</i> The two of you are nearing the outer walls of Rigard, close to the peasants’ gate. ", parse);
	if(rigard.Visa()) {
		if(miranda.Attitude() < Miranda.Attitude.Neutral)
			Text.Add("<i>“That piece of paper they give you won’t help at this hour, but I know a way.”</i> Miranda grins. <i>“’Course, if we run into a patrol, you are on your own buddy.”</i>", parse);
		else
			Text.Add("<i>“You have a pass, right? Not that it matters at this hour. Don’t worry, we’ll use a back gate, bypass the security.”</i>", parse);
	}
	else {
		if(miranda.Attitude() < Miranda.Attitude.Neutral)
			Text.Add("<i>“You’ll be an interloper, prowling around town illegally,”</i> Miranda almost purrs, a dangerous glint in her eyes. <i>“One could say you are at my mercy...”</i>", parse);
		else
			Text.Add("<i>“I’ll sneak you in. Don’t worry about the guards, I know a gate that isn’t guarded at this time.”</i>", parse);
	}
	Text.Add(" The guardswoman seems excited as she covertly leads you through a small inconspicuous door - one which you would have never found on your own. A short twisting tunnel later, you make your way into the inner city.", parse);
	Text.NL();
	Text.Add("<i>“One of the perks of working for the city watch is that I can afford a house inside the walls. Saves me from most of the regular thugs and thieves that prowl the slums. Then again, the inner city houses a different class of thugs and thieves. Worst of em all up there.”</i> The herm points to the castle looming atop the hill at the center of the city.", parse);
	Text.NL();
	Text.Add("<i>“It ain’t easy to get a posh job in a town like this as a morph, but I happen to be very good at what I do. And what I do is take out the trash.”</i> She flashes an evil grin full of sharp, pointy teeth. <i>“’Course, someone like me could never get work as an officer. Not that I’d want to sit at a desk pushing papers all day anyways.”</i>", parse);
	Text.NL();
	if(DEBUG) {
		Text.Add("<b>TOTAL SCORE: [x]</b>", {x: Scenes.Miranda.DatingScore});
		Text.NL();
	}
	
	if(rigard.Visa()) {
		Text.Add("The two of you wander through the town, heading towards the residential district. Miranda points out a few of local water holes, and some places that serve decent food.", parse);
		Text.Flush();
		
		Gui.NextPrompt(Scenes.Miranda.DatingFirstHome);
	}
	else {
		if(miranda.Attitude() < Miranda.Attitude.Neutral) {
			if(Scenes.Miranda.DatingScore > 0) {
				Text.Add("<i>“Listen, I might have been a bit harsh on you before,”</i> Miranda grudgingly admits. <i>“I don’t take negative feedback very well… You think I could make it up to you by getting you a city visa? The procedure is rather quick. We can save the fun stuff for later.”</i> She smiles, winking at you.", parse);
				
				miranda.flags["Attitude"] = Miranda.Attitude.Nice;
			}
			else {
				Text.Add("<i>“Now I’ve got you here, deep within the city and without a visa,”</i> Miranda grins evilly at you. <i>“Wouldn’t it just be shame if one of the guards caught word of this? A good thing you have such a <b>nice</b> friend as me helping you out, isn’t it?”</i>", parse);
			}
		}
		else { // Nice
			if(Scenes.Miranda.DatingScore < 0) {
				Text.Add("<i>“I had planned on getting you a city visa while we were here, but I’ve been thinking,”</i> Miranda tells you bluntly. <i>“I’m not really impressed by your performance so far. Frankly, I think you’re a bit of an ass. You can still salvage this if you want to, though.”</i>", parse);
			}
			else {
				Text.Add("<i>“While we are passing through, I’ll help you get a city visa. It’ll allow you to pass the guards into the city any time you want. The procedure is rather quick. We can save the fun stuff for later.”</i> She smiles, winking at you.", parse);
			}
		}
		Text.NL();
		Text.Add("The two of you arrive at a small booth, manned by a bored-looking city official. A sign beside it announces it as a city identification office. You find it rather curious that it would be open at this hour, but shrug it off as an oddity of the city administration.", parse);
		Text.NL();
		if(miranda.Attitude() >= Miranda.Attitude.Neutral && Scenes.Miranda.DatingScore >= 0) {
			Text.Add("The guardswoman explains that you are here to write out a pass for you, and that she’ll vouch for you. The administrator eyes you curtly, disapproval clear in his furrowed brow. In the end you get your pass, though it takes some time for all the necessary papers to be filled out.", parse);
			Text.NL();
			Text.Add("<b>Acquired citizen’s visa!</b>");
			rigard.flags["Visa"] = 1;
			Text.NL();
			Text.Add("<i>“Now, be sure to come visit often,”</i> your friendly guide urges you. <i>“Lets head somewhere more… comfortable, shall we?”</i>", parse);
			Text.Flush();
			
			Gui.NextPrompt(Scenes.Miranda.DatingFirstHome);
		}
		else { // nasty or bad score
			Text.Add("Rather than leading you to the booth, Miranda pulls you into a nearby alleyway. She steps in close, trapping you with her full breasts, a dangerous glint in her eyes.", parse);
			Text.NL();
			Text.Add("<i>“Now, listen close. If you’d like me to do you this favor, you’d better do <b>me</b> a favor.”</i> the herm grabs hold of your hand and moves it to her crotch. You can feel her thick cock straining against the leather of her pants.", parse);
			Text.NL();
			if(miranda.Attitude() >= Miranda.Attitude.Neutral && Scenes.Miranda.DatingScore < 0) {
				Text.Add("<i>“Last chance to get on my good side, [boyGirl],”</i> she whispers through clenched teeth, grinding against you. <i>“Get down on your knees and suck like a good little slut, and all is forgiven.”</i>", parse);
			}
			else {
				Text.Add("<i>“You know what I want, my little slut,”</i> she whispers through clenched teeth, grinding against you. <i>“If you ever hope to get that visa, why don’t you try to convince me of your good intentions? Don’t bother with words, your mouth can be put to far better use.”</i>", parse);
			}
			Text.Flush();
			
			//[Blow her][Fuck no]
			var options = new Array();
			options.push({ nameStr : "Blow her",
				func : function() {
					Text.Clear();
					Text.Add("<i>“That’s the spirit,”</i> Miranda purrs as you lower yourself into position. <i>“Swallow your pride. Swallow a lot more.”</i> As she’s talking, she undoes her britches, releasing her stiff red cock. You gulp, getting second thoughts. It looks a lot bigger up close…", parse);
					Text.NL();
					Text.Add("The dommy herm doesn’t give you a lot of time to contemplate your hastily made choice, quickly prying the pointed tip of her shaft past your lips. <i>“Now, suck!”</i> Not that you have much to say in the matter. She inches her cock further in, leaving a trail of salty pre along your [tongueDesc]. Though you can sense that she’s eager to go all out and fuck your throat, she eases up, letting you do the work.", parse);
					Text.NL();
					
					Sex.Blowjob(player, miranda);
					miranda.Fuck(miranda.FirstCock(), 2);
					player.FuckOral(player.Mouth(), miranda.FirstCock(), 2);
					
					Text.Add("You dutifully bob your head up and down Miranda’s dick, struggling slightly with her girth. <i>“Yeees, keep it up my little slut. You do want your reward, don’t you? Suck that cock like you mean it!”</i> She keeps up a steady stream of mocking commentary, a bit louder than necessary. You suddenly realize that considering how close you are, the administrator can probably hear everything that she’s saying.", parse);
					Text.NL();
					Text.Add("<i>“Feel how it throbs?”</i> the guardswoman moans softly, breathing heavily. <i>“I’ve got a big fat load stored up in these balls of mine, bet you want it, don’t you?”</i> She’s not lying. Her large sack is hot to the touch, her cream ready to shoot down your throat. Her shaft is rock hard, twitching as she approaches the height of pleasure. <i>“...Too bad for you!”</i>", parse);
					Text.NL();
					Text.Add("Before you have time to react, Miranda withdraws from your mouth, grabbing the back of your head with one hand and jerking herself off with the other. The first blast splashes onto your [tongueDesc], but the following stream is less discriminatory, drenching your face and splattering on your [breastDesc]. The herm rubs the last drops of cum off the tip of her cock on your cheek, before hastily pulling up her pants again.", parse);
					
					var mCum = miranda.OrgasmCum();
					
					Text.NL();
					Text.Add("Huffing slightly, Miranda pulls you out of the alleyway, smiling disarmingly at the city official as she drags you over to the booth. The guardswoman talks as if nothing is amiss, explaining that you need a visa and that she’ll vouch for you. When the flustered administrator starts to protest, she shows her identification as a member of the city watch, which speeds up the process considerably. From the burning in your cheeks, you are probably wearing a blush at least as deep as the clerk - though you doubt he can see it through the thick layer of cum dripping down your face.", parse);
					Text.NL();
					Text.Add("<b>Acquired citizen’s visa!</b>");
					rigard.flags["Visa"] = 1;
					Text.NL();
					Text.Add("<i>“Here you go, a city visa with Miranda’s compliments.”</i> The guardswoman hands over your prize, grinning mockingly. <i>“There is more where that came from too.”</i> Showing mercy on the poor official, she drags you off, heading toward the residential district. Swallowing your shame, you wipe off your face - though after this, you’ll need a long shower before you feel clean again.", parse);
					Text.Flush();
					
					Scenes.Miranda.DatingScore++;
					
					Gui.NextPrompt(Scenes.Miranda.DatingFirstHome);
				}, enabled : true,
				tooltip : "Fine, lets do this."
			});
			options.push({ nameStr : "Fuck no",
				func : function() {
					Text.Clear();
					Text.Add("<i>“Your choice.”</i> She shrugs, stepping back. <i>“Just for your information, it was the wrong one.”</i> Looking disappointed, the guardswoman heads off, motioning for you to follow her. Still affronted, you follow her into the residential district.", parse);
					Text.Flush();
					
					Scenes.Miranda.DatingScore--;
					
					miranda.flags["Attitude"] = Miranda.Attitude.Hate;
					
					Gui.NextPrompt(Scenes.Miranda.DatingFirstHome);
				}, enabled : true,
				tooltip : "What does she think you are, a whore?"
			});
			Gui.SetButtonsFromList(options);
		}
	}
}

Scenes.Miranda.DatingFirstHome = function() {
	var parse = {
		guyGirl : player.mfTrue("guy", "girl"),
		playername : player.name
	};
	
	world.TimeStep({minute: 30});
	
	miranda.flags["Dates"]++;
	
	Text.Clear();
	Text.Add("After walking for a while longer, Miranda leads you down a cramped alleyway, stopping in front of a wooden doorway. Apparently, this is where the dog-morph lives. Your heart beats a bit faster.", parse);
	Text.NL();
	
	var options = new Array();
	
	if(Scenes.Miranda.DatingScore > 2) {
		Text.Add("<i>“All good nights come to an end, but this one doesn’t have to end here.”</i> Miranda looks at you suggestively. <i>“You are my kind of [guyGirl], [playername]. Would you like to come inside for a bit of fun?”</i>", parse);
		Text.Flush();
		
		//[Take charge][Passive][Decline]
		options.push({ nameStr : "Take charge",
			func : function() {
				Text.Clear();
				Text.Add("In response, you go in for a kiss, pushing the surprised woman inside. <i>“I wouldn’t do this for just anyone, you know,”</i> Miranda huffs, a faint blush visible on her cheeks. You close the door with your shoulder, glancing around the room.", parse);
				Scenes.Miranda.HomeDommySex();
			}, enabled : miranda.SubDom() - (miranda.Relation() + player.SubDom()) < 0,
			tooltip : "Heck yeah! Take her for a ride she won’t forget."
		});
		options.push({ nameStr : "Passive",
			func : function() {
				Text.Clear();
				Text.Add("You nod, smiling demurely and waiting for her to make a move. <i>“Just what I want to hear,”</i> Miranda grins as she pulls you inside, slamming the door behind you.", parse);
				Scenes.Miranda.HomeSubbySex();
			}, enabled : true,
			tooltip : "Let her call the shots."
		});
		options.push({ nameStr : "Decline",
			func : function() {
				Text.Clear();
				Text.Add("<i>“You don’t know what you’re missing.”</i> Miranda gives you a kiss before seeing you off, adding: <i>“You know where to find me, should you change your mind. I had a good time tonight, [playername], I want to show you my appreciation...”</i>", parse);
				Text.NL();
				if(party.Alone())
					parse["comp"] = "";
				else if(party.Two()) {
					parse["comp"] = ", joining up with " + party.Get(1).name;
				}
				else
					parse["comp"] = ", joining up with your companions";
				Text.Add("You decide to leave the inner city[comp], returning to the slums for time being.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 20});
				});
			}, enabled : true,
			tooltip : "Thank her for the evening, but politely decline her invitation."
		});
		Gui.SetButtonsFromList(options);
	}
	else if(Scenes.Miranda.DatingScore >= -2) {
		Text.Add("<i>“I don’t know about you, but I’m up for a romp. How do you feel about biting the pillow for a few hours?”</i> For all of her nasty talk, you guess she still likes you enough to fuck you. Or perhaps she wants another chance to humiliate you, who knows.", parse);
		Text.Flush();
		
		//[Get fucked][Decline]
		var options = new Array();
		options.push({ nameStr : "Get fucked",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Of course you are.”</i> She grins as she pulls you inside, slamming the door behind her. <i>“Had you pinned for a bitch from the moment I saw you.”</i>", parse);
				Scenes.Miranda.HomeSubbySex();
			}, enabled : true,
			tooltip : "If she’s offering, you’re willing."
		});
		options.push({ nameStr : "Decline",
			func : function() {
				Text.Clear();
				Text.Add("<i>“You are no fun,”</i> she huffs, <i>“as if I wanted to hang out with you just for your company. Well, fuck off then.”</i> With that, she slams the door in your face. From what you can tell, she’s not used to being turned down.", parse);
				Text.NL();
				if(party.Alone()) {
					Text.Add("You are left standing in the street, wondering what to do next.", parse);
					Text.Flush();
					Gui.NextPrompt();
				}
				else {
					parse["name"]   = party.Two() ? party.Get(1).name     : "your party";
					parse["himher"] = party.Two() ? party.Get(1).himher() : "them";
					Text.Add("First, you need to rendezvous with [name]. You make your way outside the inner walls and meet up with [himher] outside the dingy old tavern.", parse);
					Text.Flush();
					
					Gui.NextPrompt(function() {
						MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 20});
					});
				}
			}, enabled : true,
			tooltip : "No thanks."
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.Add("<i>“You know, I think I’ve actually changed my mind about you,”</i> Miranda declares, smiling sweetly. <i>“I’ve had <b>such</b> a <b>good</b> time tonight, I’d just <b>love</b> to have you stay over.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I’m so horny right now,”</i> she breathes, pulling you close, <i>“get inside and make love to me, make me scream!”</i> Her cock is straining against her insufficient clothes, rubbing against your thigh.", parse);
		Text.NL();
		Text.Add("You’d have to be dead drunk, or perhaps straight up dead, to miss the malevolence in the herm’s eyes. This could end really badly…", parse);
		Text.Flush();
		
		//[Follow][Decline]
		var options = new Array();
		options.push({ nameStr : "Follow",
			func : function() {
				Text.Clear();
				Text.Add("…It’s probably nothing, you tell yourself. And you are about to score, all right! Miranda leads you inside, smiling encouragingly. You have a few moments to look around the room before the floor rushes to meet you, and everything goes black.", parse);
				Scenes.Miranda.HomeDommyDungeonFirst();
			}, enabled : true,
			tooltip : "She is begging for it. After all, what could she do, knock you out and tie you up in her cellar?"
		});
		options.push({ nameStr : "Decline",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Well this was a lousy day,”</i> Miranda grumbles. <i>“Ditched on my own doorstep. Well, fuck you too.”</i> She slams the door in your face, leaving you alone on the street. That could have gone better, you suppose. You’re just about to walk off, a bit unfamiliar with the neighbourhood, when you hear a bell ringing loudly. Glancing up, you see that Miranda is watching you from her window, grinning widely as she clangs a small brass bell.", parse);
				Text.NL();
				Text.Add("<i>“Bit of a send-off gift,”</i> she purrs. <i>“I’d say the guard will be here in a minute or two. You still got a bit of a head start, if you don’t want to spend the night in a cell.”</i> ", parse);
				if(rigard.Visa())
					Text.Add("Even if you’ve done no wrong, better not take the chance of having to put your word against hers. You suspect the guards would be rather biased on the point.", parse);
				else
					Text.Add("Shit! You realize that since you don’t have a visa, the guards could well lock you up for wandering the city.", parse);
				Text.NL();
				Text.Add("Deciding that the best thing to do at the moment is to leg it, you leave the laughing dog behind, heading for the gates. It takes a bit of weaving into cramped alleyways to avoid your pursuers, but you are somehow able to find the door you entered through, and make your way outside the walls.", parse);
				Text.NL();
				Text.Add("Back in the relative safety of the slums, you allow yourself to rest for a bit. Most likely the exit you used will be locked or better guarded from now on.", parse);
				if(!party.Alone()) {
					parse["name"]   = party.Two() ? party.Get(1).name     : "your companions";
					parse["himher"] = party.Two() ? party.Get(1).himher() : "them";
					Text.Add(" You are able to reunite with [comp] shortly after, though you don’t feel particularly inclined to tell [himher] about tonight’s escapades.", parse);
				}
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 20});
				});
			}, enabled : true,
			tooltip : "You are getting seriously bad vibes here, better get out while you still can."
		});
		Gui.SetButtonsFromList(options);
	}
}





Scenes.Miranda.HomeDescFloor1 = function() {
	var parse = {
		
	};
	Text.NL();
	Text.Add("What you can see of Miranda’s home is spartan, simple furniture and only sparsely decorated. The stove that you glimpse in the kitchen looks barely used. You assume that she usually eats her food either at the barracks or at the pub. Straight ahead, there is a small living room with several couches arranged in front of a stone hearth. On the wooden floor, there is a large pelt from some huge animal, like a bear. Various weapons are littering around the room, the most conspicuous being the huge two-handed sword hanging over the fireplace.", parse);
	Text.NL();
	Text.Add("Directly on your left inside the hall, there is a locked door, presumably leading down to a cellar. Curiously, there is a heavy bar placed across the door, preventing anything or anyone from opening the door from inside.", parse);
	Text.NL();
	Text.Add("Next to the cellar door is a steep stairway leading up to the second floor, which presumably contains Miranda’s sleeping quarters.", parse);

	miranda.flags["Floor"] = 1;
}

Scenes.Miranda.HomeDescFloor2 = function() {
	var parse = {
		
	};
	Text.NL();
	Text.Add("You take a moment to survey Miranda’s bedroom. The room looks like it takes up most of the second floor of the building, barring a tiny study. It feels like you’re walking into a warzone. The floor is littered with discarded clothes - some of some of which don’t seem to belong to Miranda - and a generous selection of sex toys.", parse);
	Text.NL();
	Text.Add("<i>“See anything that catches your fancy? A girl gotta keep herself entertained, you know.”</i> The guardswoman picks up a particularly girthy dildo, over two inches thick and covered in tiny nubs. <i>“The Shop of Oddities has quite a selection.”</i>", parse);
	Text.NL();
	Text.Add("Pushed against the wall, there is a huge bed, able to easily hold four or five people. No doubt, it has seen much use during its lifetime. Investigating the room further, you see a small balcony facing the main street, and a window overlooking the alleyway.", parse);
	
	miranda.flags["Floor"] = 2;
}

Scenes.Miranda.HomeDommySexLeavingFuckedHer = function() {
	var parse = {
		playername : player.name
	};
	
	if(rigard.Krawitz["Q"] == Rigard.KrawitzQ.HuntingTerry) {
		Text.Add("The two of you set out, returning to your search for the elusive thief.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.Residental.street, {minute : 5});
		});
	}
	else if(party.InParty(miranda)) {
		Text.Add("The two of you set out, returning to your quest.", parse);
		Text.Flush();
		
		Gui.NextPrompt();
	}
	else {
		var dom = miranda.SubDom() - player.SubDom();
		if(dom > 0)
			Text.Add("<i>“Leaving already? I haven’t returned the favor yet,”</i> Miranda moans voluptuously. Perhaps another time. <i>“Stop by again some time… little Miranda is always up to fucking a tight hole.”</i>", parse);
		else
			Text.Add("<i>“Mmm… I like it when you’re rough, [playername],”</i> Miranda moans, fingering herself. <i>“You can come back for more of that <b>any</b> time!”</i>", parse);
		Text.NL();
		
		Gui.Callstack.push(function() {
			Text.NL();
			parse["night"] = world.time.DayTime();
			Text.Add("You bid Miranda farewell and step out into the [night].", parse);
			if(party.Num() > 1) {
				Text.NL();
				parse["comp"] = party.Num() > 2 ? "the rest of your party" : party.Get(1).name;
				Text.Add("Somehow, you make it out the gates in order to rejoin [comp].", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 30});
				});
			}
			else {
				Text.Flush();
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Residental.street, {minute: 5});
				});
			}
		});
		
		if(miranda.Attitude() >= Miranda.Attitude.Neutral && (world.time.hour > 20 || world.time.hour < 4)) {
			Text.Add("<i>“Ya know? It’s kinda late. Why don’t you stay over? I wouldn’t mind sharing my bed with you. Maybe we can squeeze in a quickie before I have to leave in the morning?”</i> she grins.", parse);
			Text.Flush();
			
			//[Stay][Don’t]
			var options = new Array();
			options.push({ nameStr : "Stay",
				func : function() {
					Text.Clear();
					Text.Add("Miranda scoots over and pats a relatively clean spot beside her. You strip down and join her, using her arm as a pillow. With a grin, she draws you close, resting your head against her breast as her breathing levels out. Soon enough you join her in a restful slumber.", parse);
					Text.NL();
					Text.Add("You sleep until morning.");
					Text.Flush();
					
					var func = function() {
						world.StepToHour(8);
						party.Sleep();
						
						PrintDefaultOptions();
					};
					
					Gui.NextPrompt(function() {
						Text.Clear();
						
						Scenes.Dreams.Entry(func);
					});
				}, enabled : true,
				tooltip : "Why not? You’re feeling pretty tired after all."
			});
			options.push({ nameStr : "Don’t",
				func : function() {
					Text.Clear();
					//TODO
					world.TimeStep({hour: 2});
					Text.Add("<i>“Pity, I guess I’ll see you around then,”</i> she says, turning to take a nap.", parse);
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Unfortunately the day isn’t over for you. You’ll have to decline."
			});
			Gui.SetButtonsFromList(options);
		}
		else {
			Text.Add("<i>“I’m going to rest for a while, you can see yourself out right?”</i> she asks, turning to settle herself in for a more comfortable nap.", parse);
			PrintDefaultOptions();
		}
	}
}

Scenes.Miranda.HomeDommySex = function() {
	var parse = {
		buttDesc : function() { return player.Butt().Short(); }
	};
	
	party.location = world.loc.Rigard.Residental.miranda;
	
	Text.NL();
	Text.Add("You are standing in the murky hallway just inside Miranda’s house, the doggie herself huffing and panting in your arms. She is really starting to get into it, kissing your neck and caressing your back and [buttDesc] with her hands.", parse);
	if(miranda.flags["Floor"] == 0) {
		Scenes.Miranda.HomeDescFloor1();
	}
	Text.NL();
	Text.Add("<i>“How do you want me?”</i> she moans softly in your ear. <i>“Decide quickly, or I might decide myself.”</i> One of her hands trail downwards, pawing at her britches in order to free her stiffening monster cock from its confines.", parse);
	Text.Flush();
	
	var cocksInVag = player.CocksThatFit(miranda.FirstVag(), false, 15);
	var cocksInAss = player.CocksThatFit(miranda.Butt(), false, 15);
	
	//[Fuck vag][Fuck anal][Ride vag][Ride anal][Cellar/Dungeon]
	var options = new Array();
	options.push({ nameStr : "Fuck vag",
		func : function() {
			Scenes.Miranda.HomeDommySexFuckDobieVag(cocksInVag);
		}, enabled : cocksInVag.length > 0,
		tooltip : "Take her upstairs and fuck her."
	});
	options.push({ nameStr : "Fuck anal",
		func : function() {
			Scenes.Miranda.HomeDommySexFuckDobieAss(cocksInAss);
		}, enabled : cocksInAss.length > 0,
		tooltip : "The dommy doggie likes giving, let’s see if she likes receiving."
	});
	options.push({ nameStr : "Ride anal",
		func : function() {
			Scenes.Miranda.HomeDommySexRideDobieCockAnal();
		}, enabled : true,
		tooltip : "Take that juicy cock of hers for a ride she won’t soon forget."
	});
	
	/*
	options.push({ nameStr : "Nah",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
		}, enabled : true,
		tooltip : ""
	});
	*/
	Gui.SetButtonsFromList(options);
}


Scenes.Miranda.HomeDommySexFuckDobieAss = function(cocks) {
	var pCock = cocks[0];
	
	var parse = {
		playername    : player.name,
		hairDesc      : function() { return player.Hair().Short(); },
		boyGirl       : player.mfTrue("boy", "girl"),
		buttDesc      : function() { return player.Butt().Short(); },
		hipsDesc      : function() { return player.HipsDesc(); },
		ballsDesc     : function() { return player.BallsDesc(); },
		breastDesc    : function() { return player.FirstBreastRow().Short(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		cockDesc      : function() { return pCock.Short(); },
		cockTip       : function() { return pCock.TipShort(); },
		s             : player.NumCocks() > 1 ? "s" : "",
		notS          : player.NumCocks() > 1 ? "" : "s",
		oneof         : player.NumCocks() > 1 ? " one of" : "",
		itsTheir      : player.NumCocks() > 1 ? "their" : "its",
		mvagDesc      : function() { return miranda.FirstVag().Short(); },
		mstomachDesc  : function() { return miranda.StomachDesc(); }
	};
	
	var dom = miranda.SubDom() - player.SubDom();
	
	if(pCock.isStrapon)
		parse["multiCockDesc"] = function() { return pCock.Short(); };
	
	Text.Clear();
	if(dom < -10)
		Text.Add("You twirl her around and grope her fuckable ass, whispering into her ear that you have a very special plan for her. Giving her a slap on the butt, you send her off in the direction of the stairs. Walking right behind her, you get a perfect view of your target as you make your way up to the bedroom.", parse);
	else
		Text.Add("Smiling coyly, you tease that you have something special in mind for the dommy herm. <i>“And what would that be?”</i> Miranda grins, making a grab for you. You deftly take a step back, luring her after you. Pulling her behind you and barely avoiding her caress, you make your way up the stairs and into her bedroom.", parse);
	if(miranda.flags["Floor"] < 2) {
		Text.NL();
		Scenes.Miranda.HomeDescFloor2();
	}
	else {
		Text.Add(" The room is in as big of a mess as usual, with scattered toys and articles of clothing spread on and around the unmade bed.", parse);
	}
	Text.NL();
	Text.Add("<i>“A bit messy, I know,”</i> Miranda says apologetically, gesturing at the disarray. <i>“Just the way I like it!”</i> She pulls you in for a kiss, fondling your [buttDesc] possessively.", parse);
	if(dom > 0) {
		Text.Add(" <i>“So what’s your special plan, hotness? Your lips wrapped around my cock?”</i>", parse);
		Text.NL();
		Text.Add("Not exactly.", parse);
	}
	else {
		Text.Add(" <i>“As long as your special plan involves me getting railed, I’m happy.”</i>", parse);
		Text.NL();
		Text.Add("She’s right on the money on this one.", parse);
	}
	Text.Add(" Pushing Miranda down onto the bed, you flip her over on all fours. In the blink of an eye, you’ve ripped off the dobie’s britches and panties, baring her well-shaped and gropable butt. Between her rounded cheeks rests your target, her tight little rosebud. May as well introduce yourself.", parse);
	Text.NL();
	Text.Add("<i>“O-oh!”</i> the guardswoman yelps as you press your thumb against her anus, announcing your intentions. ", parse);
	if(miranda.sex.rAnal < 5)
		Text.Add("<i>“Hng… I like anal, but I’m not usually on the receiving end,”</i> she pants.", parse);
	else
		Text.Add("<i>“You know how I like it, [playername],”</i> she pants, wiggling her butt enticingly, as she helps you work your finger in.", parse);
	Text.NL();
	if(!pCock.isStrapon)
		Text.Add("Whipping out your [multiCockDesc],", parse);
	else
		Text.Add("Securing the straps on your [cockDesc],", parse);
	parse["yourbiggest"] = player.NumCocks() > 1 ? " your biggest" : "";
	Text.Add(" you grind[yourbiggest] shaft between Miranda’s buttcheeks, a promise of what is to come. The herm squirms and whimpers as you hotdog her, your hands gripping her ass tightly.", parse);
	Text.NL();
	Text.Add("<i>“L-lube,”</i> she pants, fumbling with a bottle. ", parse);
	if(dom < 0 && Math.random() < 0.5)
		Text.Add("You swat it away, ignoring her growling complaints as you apply a generous amount of saliva to your [cockDesc], preparing Miranda for penetration with your own natural lubricant. She eye show a hint of hesitance, but she grits her teeth and accepts it.", parse);
	else
		Text.Add("You quickly swipe the bottle, pouring nearly all of its contents on your [cockDesc] and down Miranda’s crack. A bit more grinding has her ass ready for action, puckered and eager.", parse);
	Text.NL();
	parse["stud"] = dom < -25 ? player.mfTrue("master", "mistress") : "stud";
	Text.Add("<i>“Well, what are you waiting for, [stud]?”</i> she pants, peeking over her shoulder at you. Whether she’s ready or not, you don’t hesitate as you ram the [cockTip] of your [cockDesc] into her tight anus, quickly breaching her sphincter and thrusting inside. The dommy doberman lets out a squeal as you rub against her prostate on your way into her depths, her own cock twitching between her legs.", parse);
	Text.NL();
	
	Sex.Anal(player, miranda);
	player.Fuck(pCock, 3);
	miranda.FuckAnal(miranda.Butt(), pCock, 3);
	
	parse["boyGirl"] = player.mfTrue("boy", "girl");
	if(dom < 0)
		Text.Add("<i>“Mmm… claim me, you bad [boyGirl],”</i> the guardswoman moans. <i>“Fuck that ass like it belongs to you!”</i> Her wish is your command.", parse);
	else
		Text.Add("<i>“Don’t… get too cocky, [playername],”</i> the guardswoman moans. <i>“Next time, it’s your turn to be the - hngh! - bottom.”</i> We’ll see about that.", parse);
	Text.Add(" You ignore her muffled yips and groans as you plunge your [cockDesc] deeper into her, gritting your teeth as her colon clamps down on your shaft. ", parse);
	parse["balls"] = player.HasBalls() ? Text.Parse(" as your [ballsDesc] slap against hers", parse) : "";
	if(pCock.length.Get() < miranda.Butt().capacity.Get() - 10)
		Text.Add("Before long, your hips bump against her rear, and you sigh contentedly[balls].", parse);
	else if(pCock.length.Get() < miranda.Butt().capacity.Get() + 10)
		Text.Add("It’s going to take some work until you can hilt the herm, but she’s a big girl. You’re sure she can take it.", parse);
	else
		Text.Add("No amount of lube is going to help you hilt your monster cock inside the straining asshole of the herm, but you’ll be damned if you don’t try.", parse);
	Text.NL();
	Text.Add("You build up to a slow rhythm, showing more care than Miranda usually does to her victims.", parse);
	if(dom < -25)
		Text.Add(" Plenty of time to get rough later. You plan to, in fact.", parse);
	parse["dom"] = dom > 25 ? ", even if she won’t admit it" : "";
	Text.Add(" The guardswoman braces herself on her elbows, pushing back against you. Despite her usual attitude, she wants this - needs this. Now that you have scratched her itch, it’s not going to go away until she’s gotten a good railing, and she knows it[dom].", parse);
	Text.NL();
	Text.Add("Not one to keep a lady waiting, you increase your pace, rocking your [hipsDesc] as you rail the horny dog. She is gripping the sheets tightly, biting down on a cumstained pillow. There is no question about her liking her rough ride though, as her tail is wagging uncontrollably just above her impaled back door, silently urging you to continue, to fuck her until she cries out in ecstasy.", parse);
	if(!pCock.isStrapon)
		Text.Add(" You grunt as you deposit a generous load of precum into Miranda’s tight hole, slightly easing your passing. It’s going to be needed in the hours to come.", parse);
	Text.NL();
	Text.Add("Miranda is hardly a passive lover, and you have to constantly wrestle with her for control. After railing her from behind for ten minutes or so, she manages to twist around on her back, facing you. The herm’s monster cock is standing up like a mast, trickling precum. Her hands shaking slightly, the guardswoman tears off her top, unleashing her large tits.", parse);
	Text.NL();
	Text.Add("You know just the thing to keep her occupied.", parse);
	Text.Flush();
	
	var Target = {
		boobs : 0,
		cunt  : 1,
		cock  : 2
	};
	var target;
	
	//[Boobs][Cunt][Cock]
	var options = new Array();
	options.push({ nameStr : "Boobs",
		func : function() {
			Text.Clear();
			Text.Add("Before she can struggle further, you grasp her offered breasts, pinching and pulling at her erect nipples. The herm groans, gripping at the sheets as her cock twitches, bouncing on her stomach.", parse);
			target = Target.boobs;
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Massage her tits."
	});
	options.push({ nameStr : "Cunt",
		func : function() {
			Text.Clear();
			Text.Add("The herm got another hole that is unoccupied, no wonder she is being fiesty. Grinning, you play with her cunt, thrusting your fingers into her folds and teasing her clit. Her other, significantly bigger ‘clit’ twitches appreciatively.", parse);
			target = Target.cunt;
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Start working that pussy of hers."
	});
	options.push({ nameStr : "Cock",
		func : function() {
			Text.Clear();
			Text.Add("Without hesitating, you grasp Miranda’s erect cock, jerking it rapidly while your other hand fondles her heavy balls. The herm throws her head back, moaning loudly as you work her shaft.", parse);
			target = Target.cock;
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Jerk her off."
	});
	Gui.SetButtonsFromList(options);
	
	Gui.Callstack.push(function() {
		Text.NL();
		if(dom < -25) {
			Text.Add("The doberherm looks to be in absolute bliss, her tongue is lolling out while she pants, eyes rolling to the back of her head. <i>“Having fun?”</i> you ask her.", parse);
			Text.NL();
			Text.Add("<i>“You have no idea, [playername]. Oh! I love getting buggered by you.”</i>", parse);
			Text.NL();
			Text.Add("Spoken like a true bitch. Not that you expected any different at this point.", parse);
			Text.NL();
			Text.Add("<i>“Hey now, do me good. If I can still walk after this, it’s not a good fuck,”</i> she teases you with a grin. <i>“You made me your bitch, so I hope you’re ready to deal with the responsibility. Give it to me ha-ah!”</i> You silence her with a powerful thrust. That’s enough talking, you got the message already. She wants to get a limp? You’ll give it to her!", parse);
		}
		else if(dom < 25) {
			Text.Add("<i>“That all you’ve got? I expected more,”</i> she teases.", parse);
			Text.NL();
			Text.Add("Since when is she such a huge buttslut? You thought she liked giving more than taking.", parse);
			Text.NL();
			Text.Add("<i>“I don’t mind taking if you’re good at giving.”</i>", parse);
			Text.NL();
			Text.Add("If she’s asking for it, then you’re happy to comply! You adjust yourself and give her a wicked grin, to which she replies in kind.", parse);
		}
		else {
			Text.Add("Miranda tries to hide her pleasure, but her displeased mask cracks slightly each time you drive into her, plowing her prostate.", parse);
			Text.NL();
			Text.Add("<i>“T-think you are so good? I’ve - hngh! - had better,”</i> she pants, squirming and clenching around your [cockDesc]. <i>“If you don’t want to walk out of here bowlegged, you’d better do a thorough job of fucking me!”</i>", parse);
			Text.NL();
			Text.Add("Defiant to the end. No matter, you know how to turn her to putty in your hands. To the tune of her mocking, sometimes cursing commentary, you increase your pace.", parse);
		}
		Text.NL();
		Text.Add("The longer you keep going, the rougher you get, feeling your pleasure building steadily as you ram the herm for all you’re worth. You both lose track of time as you relish in the carnal, animalistic rapture of sex, your [cockDesc] in her ravaged anus all that matters anymore.", parse);
		Text.NL();
		
		var knotted = (pCock.knot != 0);
		var load;
		
		parse["knot"] = knotted ? " roughly shoving your knot against her entrance," : "";
		parse["dom"] = dom >= 25 ? " drops her tough girl facade and" : "";
		parse["balls"] = player.HasBalls() ? "balls churning" : 
		                 player.FirstCock() ? "prostate going into overdrive" : "climax rising";
		Text.Add("You pump into her as fast as you can,[knot] sure that she not only can take it, but that she’s enjoying every second of it. You won’t last long at this pace, but you do take note of her groans and barks of pleasure. At some point, she[dom] starts deliriously begging for more. You can feel your [balls] as your [cockDesc] throbs inside her. All you need is One. Last. Thrust.", parse);
		Text.NL();
		
		if(knotted) {
			parse["size"] = pCock.length.Get() > miranda.Butt().capacity.Get() ? " despite your size" : "";
			parse["real"] = !pCock.isStrapon ? " as it begins to swell" : "";
			Text.Add("You push yourself to the hilt[size], your significantly thicker knot popping inside her rectum and tying you to the horny dobie[real]. No longer able to hold back you let yourself go as you achieve your long-delayed climax.", parse);
			Text.NL();
			if(!pCock.isStrapon) {
				load = player.OrgasmCum();
				
				if(load > 6)
					parse["load"] = "tremendous";
				else if(load > 3)
					parse["load"] = "considerable";
				else
					parse["load"] = "meager";
				parse["load2"] = load > 3 ? " and bloating it" : "";
				Text.Add("You fill her backdoor with your [load] load. With your knot sealing her tightly, the cum has nowhere to go but her belly, filling it up[load2] under your continuous flood.", parse);
				if(load > 3) {
					parse["several"] = Text.NumToText(Math.max(Math.floor(2 + (load - 3)*2), 9));
					Text.Add(" By the time your seed reduces to a trickle she’s swollen as if [several] months pregnant.", parse);
					if(load > 6)
						Text.Add(" Some of your seed even manages to work around the seal of your knot. The pressure of your cum leaking out feels just amazing, if you weren’t spent you might just cum again.", parse);
				}
				if(player.NumCocks() > 1) {
					var allCocks = player.AllCocksCopy();
					for(var i = 0; i < allCocks.length; i++) {
						if(allCocks[i] == pCock) {
							allCocks.remove(i);
							break;
						}
					}
					
					parse["multiCockDesc2"] = player.MultiCockDesc(allCocks);
					parse["s"]              = allCocks.length > 1 ? "s" : "";
					parse["itsTheir"]        = allCocks.length > 1 ? "their" : "its";
					
					Text.Add(" Your other [multiCockDesc2] blow [itsTheir] load[s] all over the guardswoman, painting her in long, thick white stripes.", parse);
				}
			}
			else
				Text.Add("Your [hipsDesc] are shaking as you ride your pleasure high, causing Miranda to gasp as you grind the thick, knotted strapon in her ass.", parse);
		}
		else {
			parse["size"] = pCock.length.Get() > miranda.Butt().capacity.Get() ? "Despite your size, y" : "Y";
			Text.Add("[size]ou push yourself to the hilt inside her, triggering sparks of pleasure in both of you. No longer able to contain yourself, you cum.", parse);
			if(!pCock.isStrapon) {
				load = player.OrgasmCum();
				
				if(load > 6)
					parse["load"] = "tremendous";
				else if(load > 3)
					parse["load"] = "considerable";
				else
					parse["load"] = "meager";
				Text.Add(" The dominated dobie gasps as she feels the first splatters of your [load] load hit her inner walls, hot and sticky. You keep thrusting into her as you shoot wad after wad of thick cum, painting her anal passage white.", parse);
				if(load > 3) {
					parse["several"] = Text.NumToText(Math.max(Math.floor(2 + (load - 3)*2), 9));
					Text.Add(" The herm’s swells up rapidly as your seed rushes into her stomach, ending with her looking [several] months pregnant.", parse);
					if(load > 6) {
						Text.Add(" That which can’t fit inside her bloated belly splashes out around your throbbing member, staining her sheets as it dribbles out into a large pool beneath her ravaged ass.", parse);
					}
				}
			}
		}
		Text.NL();
		parse["cum"] = !pCock.isStrapon ? ", squirming as she feels your hot cum flow into her" : "";
		Text.Add("Miranda isn’t far behind you[cum]. ", parse);
		if(target == Target.boobs) {
			Text.Add("You seize the opportunity to mash her breasts together, leaning down to suck on one of her erect nipples. This proves to be the last straw. With a howl of pleasure you feel her cock throbbing against your belly as she orgasms.", parse);
			Text.NL();
			if(load > 3) {
				parse["inflatedBloated"] = load > 6 ? "bloated" : "inflated";
				Text.Add("Most of her cum winds up pooled between your bellies as streams form around the sides of Miranda’s [inflatedBloated] belly. ", parse);
			}
			else {
				parse["breast"] = player.FirstBreastRow().Size() > 3 ? Text.Parse(", and the underside of your [breastDesc],", parse) : "";
				Text.Add("Her spraying jets of cum splatter against your belly[breast] before raining back down upon her prone form. ", parse);
			}
			parse["cum"] = load > 6 ? ", despite there being no more room inside" : "";
			Text.Add("Her sphincter constricts your [cockDesc] with all her might, milking you for even more cum[cum]. It feels great, but at the same time it’s so tight it’s almost painful. The doberherm’s cunt, forgotten until now, constricts and contracts, spewing her female juices all over your lower body. From the looks of it, she came as hard as she’s ever done when pitching.", parse);
		}
		else if(target == Target.cunt) {
			Text.Add("You can feel her pussy contract around you fingers even as her ass does the same to your [cockDesc], trying to milk your fingers of their nonexistant seed.", parse);
			if(player.NumCocks() > 1) {
				var allCocks = player.AllCocksCopy();
				for(var i = 0; i < allCocks.length; i++) {
					if(allCocks[i] == pCock) {
						allCocks.remove(i);
						break;
					}
				}
				parse["s"]     = allCocks.length > 1 ? "s" : "";
				parse["oneof"] = allCocks.length > 1 ? " one of" : "";
				Text.Add(" No doubt she wishes you would ram[oneof] your other shaft[s] into her needy pussy and fill her up, but you’ve just gotten off, so the next best thing will have to do.", parse);
			}
			Text.Add(" Grabbing hold of one of the many dildos laying about on the bed, you shove the thick rod into Miranda’s moist nether lips, making the herm gasp as you push her over the edge.", parse);
			Text.NL();
			if(load > 6)
				parse["cum"] = "bloated";
			else if(load > 3)
				parse["cum"] = "inflated";
			else
				parse["cum"] = "";
			Text.Add("Her cock spray jets of canid cum all over her[cum] belly, mattening the dobie’s short dark fur with her own jizz. You grind the dildo into her cunt until her orgasm recedes, leaving the guardswoman a panting, sticky mess. The artificial cock is dripping with femcum when you finally pull it out, soaked in her juices.", parse);
		}
		else if(target == Target.cock) {
			Text.Add("Your vicious handjob ends when you grab both her balls and knot tightly, eliciting a sharp cry from the doberherm as her cock throbs, once, twice, and finally sends a powerful jet of doggy-spunk arcing through the air to splatter messily on her face.", parse);
			Text.NL();
			parse["strapon"] = pCock.isStrapon ? ", despite you being unable to give her any" : "";
			Text.Add("It’s quite an amusing sight, Miranda is so out of it that she barely notices when a few strands land on her open maw. Her cock sputters her heavy load for a good while, putting on quite an amazing show for you. You barely even notice that her feminine half has soaked your lower body in femcum, nor that her ass’ been milking you in an attempt to draw more cum all this time[strapon].", parse);
			Text.NL();
			Text.Add("You give her one last thrust, grinding against her prostate and drawing a groan as she shoots one last jet. It lands squarely inside her maw, making her gurgle slightly as she swallows it down. Score! You watch her lick her lips clean of her own cum, hands moving to stroke her creamy mounds. Miranda looks like an absolute mess, and she’s enjoying every second of it.", parse);
		}
		Text.NL();
		if(knotted) {
			if(dom < -25) {
				parse["masterMistress"] = player.mfTrue("master", "mistress");
				Text.Add("<i>“Knotted like a bitch. Ah, this feels great. ", parse);
				if(pCock.isStrapon)
					Text.Add("Even though pulling it out is going to be a bitch.”</i>", parse);
				else
					Text.Add("Gonna have to stay like this till you deflate tough. Not that I mind being stuck with you up my ass, [masterMistress].“</i>", parse);
			}
			else if(dom < 25) {
				Text.Add("<i>“Phew, you went all out on me didn’t you? Normally I’d be mad at you for making me ", parse);
				if(pCock.isStrapon)
					Text.Add("go through the pain of having this dildo extracted from my ass", parse);
				else
					Text.Add("stay like this till you deflate", parse);
				Text.Add(", but since the sex was pretty good, I’m gonna let it slide,“</i> she remarks.", parse);
			}
			else {
				Text.Add("<i>“Dammit, [playername]. You just had to go and tie me up didn’t you?”</i> she protests. <i>“That is my thing!”</i>", parse);
				Text.NL();
				Text.Add("You didn’t hear her complaining while pushing said knot inside. ", parse);
				if(pCock.isStrapon)
					Text.Add("<i>“Alright, just give me a chance to rest before you jank this thing out of me.“</i>", parse);
				else
					Text.Add("<i>“Heh, fair enough. I guess you won’t take long to deflate, but don’t get used to it.“</i>", parse);
			}
			Text.NL();
			parse["real"] = pCock.isStrapon ? "" : ", until your knot finally shrinks back to its usual size";
			Text.Add("You stay like that for a while[real]. Miranda grunts as you pull out, ", parse);
			if(pCock.isStrapon)
				Text.Add("wincing as the massive artificial knot pops out of her rectum.", parse);
			else
				Text.Add("unleashing the pent up seed trapped in her colon.", parse);
		}
		else {
			parse["sticky"] = pCock.isStrapon ? "" : " sticky";
			Text.Add("You pull your[sticky] member out of her, sighing contentedly. You are pretty sure she liked that as much as you did.", parse);
		}
		Text.NL();
		if(dom < -25)
			Text.Add("<i>“Oh I love it when you use me, [playername],”</i> Miranda purrs. <i>“You’ve really put this bitch in her place.”</i>", parse);
		else if(dom < 25)
			Text.Add("<i>“Mmm… just give me a call any time you have more ‘special’ plans for me, [playername],”</i> Miranda purrs. <i>“I could grow to like this.”</i>", parse);
		else
			Text.Add("<i>“Not too bad, I suppose,”</i> Miranda pants, trying to get her breath back. <i>“Not as good as I would do it, obviously.”</i> That sounds like a challenge.", parse);
		Text.NL();
		
		var mCum = miranda.OrgasmCum();
		
		player.subDom.IncreaseStat(75, 1);
		miranda.subDom.DecreaseStat(-75, 3);
		miranda.relation.IncreaseStat(40, 2);
		player.AddLustFraction(-1);
		
		Scenes.Miranda.HomeDommySexLeavingFuckedHer();
	});
}


Scenes.Miranda.HomeDommySexRideDobieCockAnal = function() {
	var parse = {
		playername    : player.name,
		masterMistress: player.mfTrue("master", "mistress"),
		hairDesc      : function() { return player.Hair().Short(); },
		earDesc       : function() { return player.EarDesc(); },
		boyGirl       : player.mfTrue("boy", "girl"),
		armorDesc     : function() { return player.ArmorDesc(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		buttDesc      : function() { return player.Butt().Short(); },
		anusDesc      : function() { return player.Butt().AnalShort(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		cockDesc      : function() { return player.FirstCock().Short(); },
		cockTip       : function() { return player.FirstCock().TipShort(); },
		s             : player.NumCocks() > 1 ? "s" : "",
		notS          : player.NumCocks() > 1 ? "" : "s",
		oneof         : player.NumCocks() > 1 ? " one of" : "",
		itThem        : player.NumCocks() > 1 ? "them" : "it",
		itsTheir      : player.NumCocks() > 1 ? "their" : "its",
		mvagDesc      : function() { return miranda.FirstVag().Short(); },
		mstomachDesc  : function() { return miranda.StomachDesc(); }
	};
	
	var dom = miranda.SubDom() - player.SubDom();
	
	Text.Clear();
	if(player.SubDom() < 0)
		Text.Add("With a coy smile, you close the distance between you, staring into Miranda's eyes as you tenderly stroke the prominent bulge between her legs, asking her if she doesn't think she's a little overdressed for things. If she were to slip into something more comfortable and join you upstairs, you promise her she'll enjoy what you have in mind. You give her cock a tender squeeze through her pants for emphasis, then turn and head for the stairs yourself. You smile as you hear the horny herm stripping herself off as fast as she can behind you and giving hot pursuit.", parse);
	else
		Text.Add("Without hesitation, you close the distance between you and begin peeling off Miranda's armour, hoisting her top up over her head and casting it aside carelessly before pulling down her pants. The morph happily complies with your actions, lifting her arms to facilitate the removal of her top, then almost daintily stepping out of her pants once they're on the floor, cock bobbing in the air before her as she does so. Straightening back up, you lecherously stroke her cock before ordering her up to her room, using her dick like a handle to draw her eagerly along as you head for the stairs.", parse);
	Text.NL();
	if(miranda.flags["Floor"] < 2)
		Scenes.Miranda.HomeDescFloor2();
	else {
		Text.Add("Messy… not that you expected any different by now.", parse);
	}
	Text.NL();
	if(player.SubDom() < 0) {
		Text.Add("Approaching the bed, you turn back to Miranda and, with a seductive smirk, indicate the bed with one hand, asking her to go ahead and make herself comfortable.", parse);
		Text.NL();
		Text.Add("<i>“I like where this is going… don’t keep me waiting now,”</i> she grins sitting down on the bed, legs spread to put her cock on full display.", parse);
		Text.NL();
		Text.Add("Smiling back at her, you lean in and kiss her gently, your fingers moving to tenderly stroke the jutting canine erection between her thighs. Then you place your hands on her shoulders and carefully push her down against the bed, the smile never leaving the morph's face as she immediately wriggles herself into a more comfortable position. You quickly move to undress, carefully placing your [armorDesc] at the base of the bed for easy retrieval, and then climb atop the bed in turn, moving to straddle Miranda.", parse);
	}
	else
		Text.Add("You don't hesitate in leading Miranda towards her bed; her cock really makes a good handle for controlling the dog-morph. Once her hip bumps against the side of the mattress, you release her penis and take her by the shoulders, giving her a gentle but firm push that sends her toppling over onto her back atop the bed. Reaching down, you maneuver her a little to ensure she's more properly on the bed, and then set about removing your own [armorDesc], tossing them casually aside to join the other piles of discarded gear already scattered about the room. Now naked, you waste no time in climbing atop of Miranda, straddling her.", parse);
	Text.NL();
	if(dom < -25)
		Text.Add("Miranda’s hands dart to your hips, gripping you tightly. <i>“You gonna get started or do I have to show you how to take cock?”</i>", parse);
	else if(dom < 25)
		Text.Add("<i>“Hey, [playername]? Don’t you think it’s about time you stopped with the teasing and got to good part? My cock is aching for your sweet bum,”</i> she grins.", parse);
	else
		Text.Add("<i>“Come on now, that’s enough teasing,”</i> she pants. <i>“Have mercy on me, [masterMistress]!”</i>", parse);
	Text.NL();
	parse["sorry"] = player.SubDom() < 0 ? " sorry, but for now" : "";
	Text.Add("You don't respond verbally to Miranda's comments. Instead, you reach back with one hand and begin to stroke her balls, running your fingers tenderly over the apple-sized cum factories before closing them firmly around one swollen nut. Not hard enough to actually hurt her, but definitely with enough force to make the doberherm's eyes widen in surprise. Patiently, you chastise her for rushing;[sorry] you're in charge here. She just needs to be a good doggie, lay back, and let you take care of everything...", parse);
	Text.NL();
	if(dom < -25)
		Text.Add("The doberman’s hands immediately release you, gripping the sheets instead. <i>“That’s a low blow [playername]. Hope you know what you’re doing, because payback can be a bitch.”</i>", parse);
	else if(dom < 25)
		Text.Add("<i>“Taking charge, are you? Alright then. I have a feeling I’m going to enjoy this even if you do,”</i> she grins.", parse);
	else
		Text.Add("<i>“Well, you know what I like. So enjoy yourself,”</i> she winks.", parse);
	Text.NL();
	Text.Add("Seeing as the morph is going to be obedient and lay still, you turn your attention to other matters of importance. Namely, how to properly prepare yourself to ride Miranda's cock...", parse);
	Text.Flush();
	
	//[GetLube] [Pre-Lube] [Blow-Lube] [Cunt-Lube]
	var options = new Array();
	options.push({ nameStr : "Get Lube",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Hang on,”</i> she says, reaching for a nearby drawer. She fumbles around with the contents before producing a jar. <i>“Catch!</i> she exclaims as she tosses the jar.", parse);
			Text.NL();
			Text.Add("You snag it deftly and give it a cursory glance. The brand-name on the bottle reads ‘Easy-in - for when you don't have time to take it easy’. Somehow, that motto is just so Miranda... With a little work, you manage to unscrew the jar-top with just one hand - it's very clear that Miranda uses it regularly. Placing it atop Miranda's stomach, you dig into the well-used interior of the jar, scooping out a generous dollop of pale green ointment, which you then reach around and start to work it into your anus.", parse);
			Text.NL();
			Text.Add("Closing your eyes to concentrate, you moan softly as you stroke and caress your anal ring, massaging the lube ointment into its surface, pushing your way inside to ensure a nice internal coating as well. Once satisfied with your own lubing, you remove your fingers from your ass and return them to the jar. This time, you start smearing the fresh dose of lube on Miranda's cock, rubbing up and down to ensure it's well-coated in the slick, smooth ointment.", parse);
			Text.NL();
			Text.Add("<i>“Come on! Ditch the lube and get on with it!”</i> the doberman protests impatiently. <i>“Keep teasing me like that and I’ll lose control and just rail you as hard as I can!”</i>", parse);
			Text.NL();
			Text.Add("You firmly squeeze her balls again to remind her just who is in charge, but you agree with her that it's time for the fun to begin. Placing the cap back atop the lube, you drop it onto a nearby pile of clothes and reposition yourself, slowly sinking down until you can feel Miranda's cock starting to push its way inside your newly lubed ass.", parse);
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "If Miranda likes anal as much as she says she does, she’s gotta have some around here."
	});
	options.push({ nameStr : "Pre-Lube",
		func : function() {
			Text.Clear();
			Text.Add("You reach back with your other hand, the other still grasping her balls to ensure her obedience. With your free hand, you start to stroke her cock, sliding up and down her length with smooth, even strokes, toying with her pointy glans with thumb and fingertips. Precum bubbles hot and wet from her urethra, spilling over your fingers, and you massage her cock until your hand is nice and slick. Deeming it sufficiently covered, you remove your fingers from Miranda's shaft, a soft whimper escaping the herm, and begin to massage your [anusDesc], tenderly rubbing the sexual fluids into your back passage. You allow your eyes to close and moan softly in pleasure as you stroke and play with your asshole, working a thumbtip inside to ensure a nice solid coating inside and out.", parse);
			Text.NL();
			Text.Add("Several times you repeat the process, stroking Miranda to get nice and slick with her precum, then massaging it into your anal ring, until you deem yourself sufficiently lubed. Playfully you apologise for keeping her waiting, but assure her that it will be well worth it.", parse);
			Text.NL();
			Text.Add("<i>“Finally, I was wondering how long you were going to keep me waiting,”</i> she licks her lips.", parse);
			Text.NL();
			Text.Add("Ready as you'll ever be, you reposition yourself slightly and start to descend, feeling the tip of Miranda's cock first touching, and then piercing your asshole as you drop further and further down.", parse);
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Why not play with her a little and see if you can't milk her enough to use her own juices for lube?"
	});
	options.push({ nameStr : "Blow-Lube",
		func : function() {
			Text.Clear();
			Text.Add("Still retaining your grip on the herm's balls, you swivel your hips around until you are reverse-straddling her, your face pointing towards Miranda's feet... and, more importantly, her cock. You allow yourself to be seated on her stomach and then lay down, pushing your rear up towards the dog-morph's face and bringing your own face down to be level with Miranda's jutting girl-cock. Sticking out your tongue, you start to gently lap at the ruddy flesh before you, running your tongue up and down its length with smooth motions, painstakingly coating it with your saliva.", parse);
			Text.NL();
			if(miranda.SubDom() < -25)
				Text.Add("<i>“Ah, yes! That feels great [playername]!”</i> she exclaims, tongue lolling out. She looks at your exposed [buttDesc]. An idea comes to her and she puts both hands on your buttcheeks. You consider giving her balls a little squeeze to dissuade her from whatever she’s thinking, but when you feel a wet tongue lapping your buttcrack as she spreads you, you relent. Seems she’s decide to help you lube yourself some too.", parse);
			else {
				Text.Add("<i>“Yes! Suck my cock like a proper slut!”</i> she exclaims.", parse);
				Text.NL();
				Text.Add("You promptly squeeze her balls firmly, reminding her to watch her language.", parse);
			}
			Text.NL();
			Text.Add("Licking isn't doing the job for you; you open your mouth and close your lips around the dog-dick in front of you, wetly gulping your way down its length until you can feel its tip poking at the back of your throat. Up and down you bob your head, audibly slurping and suckling, lathering spittle on Miranda's fuckmeat until you're satisfied it's nice and slick.", parse);
			if(miranda.SubDom() < -25)
				Text.Add(" You moan around Miranda's cock as you feel her tongue busily worming its way inside of your asshole, unthinkingly clenching down in an effort to keep it from penetrating you... ooh, or perhaps keeping it inside you would be better.", parse);
			Text.NL();
			
			Sex.Blowjob(player, miranda);
			player.FuckOral(player.Mouth(), miranda.FirstCock(), 1);
			miranda.Fuck(miranda.FirstCock(), 1);
			
			Text.Add("From the shudders and grunts of your canine body-pillow, you deem it time to stop sucking her cock, lest she end up blowing before the fun can really begin. With a wet pop you pull your mouth free and push yourself upright, slowly shifting yourself back into the proper position, facing back towards Miranda's face. One hand still on Miranda's balls, you align yourself with her newly-sucked dick and start lowering your hips, feeling the spit-slicked shaft slowly spearing up inside of you.", parse);
			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "Perhaps a pre-butt-sexing blowjob would kill two birds with one stone?"
	});
	if(player.FirstVag()) {
		options.push({ nameStr : "Cunt-Lube",
			func : function() {
				Text.Clear();
				Text.Add("Shifting your hips slightly, you align Miranda's cock not with your ass, but with your [vagDesc], lowering your body until the heat of it is wafting across her sensitive prickflesh.", parse);
				Text.NL();
				Text.Add("<i>“Whoa, I thought we were doing anal… not that I mind getting myself inside that hot pussy of yours.”</i>", parse);
				Text.NL();
				Text.Add("Ignoring her, you start to grind your folds against the hot, hard shaft below them, purposefully rubbing and stroking yourself against her, letting her slide through your womanhood but never penetrate you. Each motion smears your own feminine arousal over her dick, and you moan softly at the friction. The sensation gets you more and more excited, ensuring a steady flow of juices across the dog-dick.", parse);
				Text.NL();
				Text.Add("<i>“Shit! I need to fuck <b>now</b>! So quit with the teasing,”</i> Miranda pants. You have a feeling she won’t be able to take this much longer without snapping.", parse);
				Text.NL();
				Text.Add("Fortunately for her, you feel about ready to proceed yourself. On your next rise up, you move to position yourself so that when your hips lower again, it brings your asshole down to sink over her newly slickened dick.", parse);
				PrintDefaultOptions();
			}, enabled : !player.FirstVag().virgin,
			tooltip : "You're not some tender virgin; why not use your pussy to prep her dick for your ass?"
		});
	}
	Gui.SetButtonsFromList(options);
	
	Gui.Callstack.push(function() {
		Text.NL();
		if(player.Butt().virgin) {
			Text.Add("<i>“So tight! What the… are you a virgin back there by any chance?”</i>, Miranda asks.", parse);
			Text.NL();
			Text.Add("Gritting your teeth as you feel your virginal anus straining around the meaty intruder, you nod your head and confess that you are… or in this case were.", parse);
			Text.NL();
			Text.Add("<i>“A-And you picked me to pop your cherry?</i> she asks in disbelief.", parse);
			Text.NL();
			Text.Add("Forcing another inch of dickflesh inside of you, you moan softly and tell her that's true.", parse);
			Text.NL();
			Text.Add("<i>“Aw, now you’re making me embarrassed…”</i> she trails off. <i>“Hmm, alright then, I promise to show you a great time for your first, bring it on,”</i> she licks her lips.", parse);
			miranda.relation.IncreaseStat(100, 10);
		}
		else if(miranda.sex.gAnal < 5) {
			Text.Add("<i>“Aah! That’s quite the ass you got there [playername]. Damn! You’re gripping me so tightly it’s a wonder I can even move.”</i>", parse);
		}
		else {
			Text.Add("<i>“I’ve been inside your butt so many times, and it feels better every time. Careful or I could easily get addicted to your butt,”</i> she chortles jokingly.", parse);
		}
		Text.NL();
		
		Sex.Anal(miranda, player);
		player.FuckAnal(player.Butt(), miranda.FirstCock(), 3);
		miranda.Fuck(miranda.FirstCock(), 3);
		
		Text.Add("Finally, you have taken sufficient of Miranda's cock that all that remains is the final engorged bulb of her knot. Content to leave that untouched for the moment, and having given yourself the necessary moments to adjust to the feelings of nearly a foot of turgid flesh inside of you, you begin to rhythmically rise and fall atop of your partner.", parse);
		Text.NL();
		Text.Add("Clenching your anal muscles so as to feel every bulging vein scrape most deliciously inside of you, you sink and gyrate, grinding down to the knot and then teasingly raising yourself up again until you almost pop free, only to slide down again. Your eyes close in concentration so that you can fully focus on the feelings Miranda is giving you, hissing between your teeth as you find a particularly inviting spot inside of you and grind it into her cock.", parse);
		Text.NL();
		Text.Add("A lustful moan from in front of you reminds you of the other participant in your pleasure, and you open your eyes to look at Miranda. The sight of her with her eyes screwed shut, mouth hanging open to let her slobbering tongue loll forth freely, tits bouncing with each gyration of your mutual hips, brings a smile to your face.", parse);
		Text.NL();
		if(player.FirstCock()) {
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("The sight is just too tempting, and your free hand closes around[oneof] your bobbing [multiCockDesc]. Ceasing your riding, you lift yourself from Miranda's dick and settle further up her stomach before your fingers start to pump your own shaft fervently, gliding hard and smooth across the sensitive flesh.", parse);
				Text.NL();
				Text.Add("You can feel the flames of desire burning inside of you, growing stronger and hotter with every pump and touch and stroke. A welcome tingling sensation runs down your spine, and you give yourself over to what it entails, making sure to aim your cock[s] right at the open target of Miranda's face. Orgasm washes through you, and you cry out as your [multiCockDesc] fountains its seed.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Eyes fixated on the D-cup tits wobbling so enticingly atop your partner's chest, you push up and forward until Miranda's dick pops free of your ass. A dismayed whimper escape the morph beneath you, and your ass itself clenches in sympathy at having been so emptied, but you have another prize to attend to. Sliding along Miranda's stomach, you bring your [multiCockDesc] to bear in-between the morph's luscious breasts, your hands wrapping around the firmly toned, velvety-furred orbs and mashing them together around your shaft[s].", parse);
				Text.NL();
				Text.Add("You eagerly grind and thrust yourself through Miranda's breasts, your sensitive flesh prickling most deliciously at the warmth and soft fur that surrounds [itThem], a sensation that builds upon the feelings already stoked within you by your riding of Miranda's cock. Pleasure mounts and rises inside of you, battering down your will, until you arch your back and thrust as deeply into the morph's cleavage as you can, unleashing your seed without a care.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("One look at that lolling tongue and the wetness of the dog-morph's mouth is all you need to convince you of your next course of action. Miranda actually whines in protest as you suddenly pop your ass free of her cock, but you quickly stifle her complaints by sliding up her stomach so as to thrust[oneof] your [multiCockDesc] between her lips. Miranda wastes no time in engulfing it, wrapping her lips eagerly around its length as best she can, hungrily polishing its underside with slurping laps of her tongue.", parse);
				Text.NL();
				
				Sex.Blowjob(miranda, player);
				miranda.FuckOral(miranda.Mouth(), player.FirstCock(), 1);
				player.Fuck(player.FirstCock(), 1);
				
				Text.Add("A thrill courses down your spine at the sight of the normally fierce, proudly dominant doberherm reduced to a cock-hungry bitch, and you grip hold of her face, energetically thrusting your prick into her drooling maw. With as much fervor as you earlier rode Miranda's cock, you fuck the morph's face, ploughing back and forth over her lapping tongue and between her slick lips.", parse);
				Text.NL();
				Text.Add("As your pleasure grows, your thrusts grow more erratic; you can feel the pressure building inside you, and you know your climax is almost upon you. Just before you lose control, you pull yourself free of Miranda's mouth, ensuring that your orgasm erupts all over her face.", parse);
			}, 1.0, function() { return true; });
			
			scenes.Get();
			
			Text.NL();
			
			var load = player.OrgasmCum();
			
			if(load > 6)
				Text.Add("Gush after massive gush jets from your squirting [multiCockDesc], absolutely drenching the dog-morph's head and upper torso in your seed. Her face is liberally plastered in off-white spunk, her breasts similarly coated and a veritable river of semen drooling down the canyon of her cleavage and over her belly.", parse);
			else if(load > 3)
				Text.Add("Thick ropes of sperm plaster themselves over Miranda's face and tits, draping her in a veritable veil of streaks of off-white. The dickmilk is everywhere, coating her face and her breasts alike in your liquid climax.", parse);
			else
				Text.Add("Pearly strands spray across the morph's face and tits, giving her a perverse necklace of jism streamers by the time you are through.", parse);
			Text.NL();
			parse["sub"] = miranda.SubDom() < 0 ? " - in fact, I love it -" : "";
			Text.Add("Licking some of your seed from her snout, the panting morph says, <i>“You’ve had your fun. I don’t mind the face-paint[sub] but at least finishing me off, please?”</i>", parse);
			Text.NL();
			if(player.SubDom() > 0)
				Text.Add("Grinning in pleasure at Miranda's words and her face covered in semen, you leisurely slide your way back down her stomach to resume your former position.", parse);
			else
				Text.Add("You quickly move to comply, eager to bring your lover to her own climax in turn, your desire only fuelled by her words.", parse);
			Text.NL();
			Text.Add("Once more positioned with your ass over Miranda's jutting, drooling girl-cock, you reach back with your hand to fondle her apple-sized balls, bloated with the seed she so desperately wishes to release. A few caresses, an affectionate pat, and then you return to the matter at hand, sinking back down upon her shaft with a moan of pleasure at being filled once more.", parse);
		}
		else {
			Text.Add("On impulse, you suddenly pull yourself completely free of her dick, hovering your ass just above her jutting glans.", parse);
			Text.NL();
			Text.Add("<i>“Hey, get back here! It was just starting to feel good!”</i> Miranda protests, thrusting up in an attempt to penetrate you once more.", parse);
			Text.NL();
			Text.Add("You delicately lift your [buttDesc] up further, beyond her reach, and chastise her for the thrusts by squeezing her balls until she moans softly in pleasure-pain. Smiling sweetly at her, you instruct her to beg for it, caressing her bloated nuts as you do so.", parse);
			Text.NL();
			if(dom < -25) {
				Text.Add("<i>“Please…”</i>", parse);
				Text.NL();
				Text.Add("Please, what, you reply back to her, cupping a hand around one of your [earDesc] for emphasis.", parse);
				Text.NL();
				Text.Add("<i>“Please, [masterMistress]! Let me go back inside your tight, hot ass! I need it so bad!”</i> she whines.", parse);
				Text.NL();
				Text.Add("You purse your lips as if thinking it over, continuing to knead and stroke her balls. After a few long, tense moments, you smile and inform her that, since she asked so nicely, you'll grant her her wish.", parse);
			}
			else if(dom < 25) {
				Text.Add("<i>“Can’t believe you’re going to make me beg,”</i> she replies with a pout, but ultimately resigns. With a sigh she says, <i>“Please, let me fuck your ass.”</i>", parse);
				Text.NL();
				Text.Add("You ask if that's supposed to be her idea of begging.", parse);
				Text.NL();
				Text.Add("<i>“I can’t quite get on my knees here! How do you- ack!”</i> You silence her with a soft squeeze, not enough to hurt her just yet, but enough to silence her. Either she can beg like a good puppy, or she can get a serious case of blue balls.", parse);
				Text.NL();
				Text.Add("She looks at you with disdain for a few seconds, before inhaling and starting, <i>“Please, oh please! Great [playername]! Allow me to fuck your ass! If I don’t I think I’m going to die! So please have mercy!”</i>", parse);
				Text.NL();
				Text.Add("You can't help but roll your eyes at her melodrama, fingers tightening in warning against her nuts. But, you suppose it will have to do...", parse);
			}
			else {
				Text.Add("<i>“You gotta be kidding me! It’s enough that I’m letting you run this show, now you want me to beg? Not a chance!”</i> she protests.", parse);
				Text.NL();
				Text.Add("Then you simply won't finish her off, you reply.", parse);
				Text.NL();
				Text.Add("<i>“Oh, Fiiine! But I’m only doing this because you have a really fine ass.”</i>", parse);
				Text.NL();
				Text.Add("Your fingers tap a tattoo against her balls and you remind her that you're waiting to hear some begging.", parse);
				Text.NL();
				Text.Add("She clears her throat. <i>“Please, [playername]. Allow me to plow the depths of your [buttDesc]. I can’t stand not being able to deposit my huge load of doggie-cum up your backdoor.”</i>", parse);
				Text.NL();
				Text.Add("...Is that really supposed to be begging? You look at her, trying to gauge whether she truly was trying or was simply making a poor joke. You squeeze gently at her nuts, making her bite her lip, but decide to be magnanimous. Besides, your own form is quivering with desire, eager to achieve climax in turn.", parse);
			}
			Text.NL();
			Text.Add("Without further ado, you descend back upon Miranda's cock, allowing her to slide home into the welcoming depths of your ass once more.", parse);
		}
		Text.NL();
		Text.Add("The doggie-herm moans in pleasure at being engulfed by your warm tightness once more. No longer able to contain herself, she begins lightly thrusting into you, pressing her knot against your entrance.", parse);
		Text.NL();
		Text.Add("The experience is not unwelcome, and so you allow her this liberty, eagerly rising and falling in turn, grinding your entrance against her swelling knot and letting her feel you against it, but never allowing it to slip inside. Your sensitive muscles can feel every ripple, ridge and vein in Miranda's cock, and you are intimately aware of the thick, steady flow of precum oozing from her cock and spurting inside of you with each thrust the pair of you make.", parse);
		Text.NL();
		parse["second"] = player.FirstCock() ? " second" : "";
		Text.Add("You happily give yourself over to the sensations, content to ride the dober-morph for all you are worth. You can feel your[second] orgasm fast approaching, and from the growls and whimpers echoing from below you, Miranda herself can't be far off. As you sink down yet again, you feel her hugely swollen knot grinding against your anal ring...", parse);
		Text.Flush();
		
		var mCum = miranda.OrgasmCum();
		
		//[Take Knot] [Skip Knot]
		var options = new Array();
		options.push({ nameStr : "Take knot",
			func : function() {
				Text.Clear();
				Text.Add("Mind made up, your next sink is your last as you force yourself upon the bloated bulge of flesh at the base of Miranda's girl-cock. Your teeth clench and your whole body strains at the effort, it feels like you're trying to insert an apple up your ass, but your determination and sheer stubbornness prevails over the weakness of the flesh.", parse);
				Text.NL();
				parse["cock"] = player.FirstCock() ? " knot squeezing against your prostate," : "";
				Text.Add("You scream in a cocktail of pleasure, pain and triumph as Miranda's knot is forced inside of you, the swollen flesh stretching you out impossibly as it swells to anchor the two of you together. The feeling of being stretched so much, filled so full,[cock] is just too much to bear and your ass clamps down as you are wracked with the throes of climax.", parse);
				if(player.FirstCock()) {
					Text.Add(" Your [multiCockDesc] erupt[notS] for the second time, showering semen across Miranda's belly and breasts.", parse);
					var load = player.OrgasmCum();
				}
				if(player.FirstVag())
					Text.Add(" Your neglected womanhood rains its female fluids down onto Miranda's stomach, drooling wetly over her belly as you orgasm.", parse);
				Text.NL();
				Text.Add("Your orgasm promptly triggers Miranda's in turn. The doberherm throws her head back and bays like the dog she so resembles as her balls clench up and unleash their torrential cascade of semen inside of your defenseless guts. You can feel the tidal wave of hot bitch-spunk flooding up inside of you, forcing its way into your very stomach with its volume and energy, your belly beginning to swell from the volume.", parse);
				Text.NL();
				Text.Add("It's an indescribable experience as the near-endless cascade of girl-jizz stretches you out fatter and fuller; by the time Miranda shudders her last, your stomach could pass for a pregnant woman's somewhere in her third trimester. It's so big and heavy it almost reaches down to lay atop Miranda's own stomach, and unconsciously you lean back to better support yourself with your newly increased girth.", parse);
				Text.NL();
				Text.Add("The two of you lay there in silence, panting for breath, until Miranda speaks up.", parse);
				Text.NL();
				if(dom < -25)
					Text.Add("<i>“Ahh. You’re the best [playername]. I’d never thought getting used like a cheap dildo could feel this good. I’m so glad I get to be your plaything, come use me anytime, anyhow, and anywhere.”</i>", parse);
				else if(dom < 25)
					Text.Add("<i>“Phew, what a wild ride! You really know how to make a girl feel like a cheap sex toy, huh? Not that I mind. Hard to get mad over all this amazing sex.”</i>", parse);
				else
					Text.Add("<i>“Crap, I didn’t know getting used like that could feel this good. If this is your idea of domming you can dom me anytime, [playername].”</i>", parse);
				Text.Flush();
				
				world.TimeStep({minute: 30});
				player.AddLustFraction(-1);
				miranda.AddLustFraction(-1);
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("With a stretch to pop some of the aches out of your joints, you set about collecting your discarded [armorDesc], rubbing your sore ass as you bend over to retrieve it. Biting back a groan after straightening up, you slowly redress yourself. As you do all this, you have an audience; though evidently still too weak-kneed to get to her feet herself, you can feel Miranda's eyes as she watches you from her position on the bed.", parse);
					Text.NL();
					
					player.subDom.IncreaseStat(75, 1);
					miranda.subDom.DecreaseStat(-75, 3);
					miranda.relation.IncreaseStat(60, 3);
					
					Scenes.Miranda.HomeDommySexLeavingFuckedHer();
				});
			}, enabled : true,
			tooltip : "Miranda's clearly aching for it, why not let her tie you this time?"
		});
		options.push({ nameStr : "Skip knot",
			func : function() {
				Text.Clear();
				parse["secondOwn"] = player.FirstCock() ? "second" : "own";
				Text.Add("Abandoning Miranda's balls, you instead seize hold of her knot, squeezing it with your fingers even as your ass wrings down on her shaft, trying to milk her. The sensation is all that Miranda needs, the morph howling in ecstasy as she cums inside of you, the feeling of her hot semen geysering up into your sensitive ass enough to trigger your [secondOwn] climax in turn.", parse);
				if(player.FirstCock()) {
					Text.Add(" For the second time now, your [multiCockDesc] erupt[notS], painting Miranda's stomach and tits alike with ropes of pearly semen.", parse);
					var load = player.OrgasmCum();
				}
				if(player.FirstVag())
					Text.Add(" Female honey pours from your neglected womanhood, slopping wetly over Miranda's stomach as you climax.", parse);
				Text.NL();
				Text.Add("The dober-morph's cascade of semen forces itself inside of you, defying gravity with the sheer ferocity of its jets. Your stomach visibly bulges, even though the bulk of her seed pours back down from your used anus like a perverse waterfall, painting Miranda from the waist down in her own semen by the time she finally stops. With mutual groaning sighs of pleasure, you sink back down and settle yourself atop of Miranda's body, laying atop her like a great cushions.", parse);
				Text.NL();
				Text.Add("The two of you lay there in silence for several long moments, panting for breath.", parse);
				Text.NL();
				
				player.subDom.IncreaseStat(75, 1);
				miranda.subDom.DecreaseStat(-75, 3);
				miranda.relation.IncreaseStat(60, 3);
				player.AddLustFraction(-1);
				miranda.AddLustFraction(-1);
					
				Scenes.Miranda.HomeDommySexLeavingFuckedHer();
			}, enabled : true,
			tooltip : "You have other things to do, she'll just have to get off without knotting you."
		});
		Gui.SetButtonsFromList(options);
	});
	
	
}

Scenes.Miranda.HomeDommySexFuckDobieVag = function(cocks) {
	var pCock = cocks[0];
	
	var parse = {
		playername    : player.name,
		hairDesc      : function() { return player.Hair().Short(); },
		boyGirl       : player.mfTrue("boy", "girl"),
		buttDesc      : function() { return player.Butt().Short(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		cockDesc      : function() { return pCock.Short(); },
		cockTip       : function() { return pCock.TipShort(); },
		s             : player.NumCocks() > 1 ? "s" : "",
		notS          : player.NumCocks() > 1 ? "" : "s",
		oneof         : player.NumCocks() > 1 ? " one of" : "",
		itsTheir      : player.NumCocks() > 1 ? "their" : "its",
		mvagDesc      : function() { return miranda.FirstVag().Short(); },
		mstomachDesc  : function() { return miranda.StomachDesc(); }
	};
	
	var dom = miranda.SubDom() - player.SubDom();
	
	if(pCock.isStrapon)
		parse["multiCockDesc"] = function() { return pCock.Short(); };
	
	Text.Clear();
	Text.Add("You eagerly reply you want her splayed across her bed and moaning as you ram her with your [multiCockDesc]. Twirling her around, you give the doggie a slap on her butt, sending her in the direction of the stairs. Before she takes her first step, you ask her to slowly undress as she ascends the stairs. The guardswoman gives you a nice show, swaying her hips side to side as she slowly climb the stairs. Under her short tail and between her toned thighs, you catch glimpses of your target; her wet and eager pussy. Just beyond it, her heavy sack sways back and forth.", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“Like what you see?”</i> Miranda smirks over her shoulder, giving her hips a shake.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Huff… look at me, getting all hot and bothered,”</i> Miranda pants shamefully, squirming a bit under your close scrutiny.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Hehe… looks like I’m ready for you, love,”</i> Miranda shake her hips, spreading her cheeks with her cunt fully exposed.", parse);
	}, 1.0, function() { return miranda.SubDom() < 0; });
	scenes.Get();
	
	Text.Add(" She pauses on the entrance to her room, looking around before sashaying towards her bed with hips swaying side to side.", parse);
	
	if(miranda.flags["Floor"] < 2)
		Scenes.Miranda.HomeDescFloor2();
	else {
		Text.NL();
		Text.Add("Her room is in the same disarray as usual; clothes and toys of several varieties strewn all about.", parse);
	}
	Text.NL();
	Text.Add("The herm hops onto the bed, turning to face you with a sultry expression. <i>“Now what, bad [boyGirl]?”</i> she asks, parting her legs slightly. At this angle, all you can see of her crotch is her thick puppy-pecker - grown erect during her ascent - and her balls. This won’t do.", parse);
	Text.NL();
	
	var mode;
	var Mode = {
		back  : 0,
		doggy : 1
	};
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("Now, she is going to lie back and spread ‘em as wide as she can. With a heave, you push Miranda over on her back, grabbing her legs and pulling them to the sides. Splayed out, her red cock stands up like a thick pillar, throbbing with excitement. The herm quickly gets the idea, pulling her balls aside to reveal her wet slit. She watches you intently, idly stroking her member while she waits for you to act.", parse);
		
		mode = Mode.back;
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("She’s a doggie, so there is only one way to go. On all fours, naughty doggie!", parse);
		Text.NL();
		Text.Add("<i>“Doggy-style, huh? How clever.”</i> Her words are mocking, but she doesn’t waste time in rolling over, wiggling her butt at you. Miranda plants her knees wide on the bed, giving you full access to her nethers. Her wet slit looks as ready as it’ll ever be.", parse);
		
		mode = Mode.doggy;
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.NL();
	Text.Add("You take your time stripping off your gear, taking every chance to tease the guardswoman. Here you are, the high and mighty Miranda begging for you to fuck her. Quite different from her usual dominating facade, isn’t it?", parse);
	Text.NL();
	if(dom > 25)
		Text.Add("<i>“Hey, who’s begging?”</i> she growls, annoyed. <i>“Don’t leave me waiting, I’m getting bored here.”</i>", parse);
	else if(dom > -25)
		Text.Add("<i>“What I do in my bedroom is my own business,”</i> she retorts. <i>“We’ll, in this case, your business too, I guess.”</i>", parse);
	else
		Text.Add("<i>“J-just fuck me already,”</i> she growls, blushing fiercely.", parse);
	Text.NL();
	if(!pCock.isStrapon) {
		Text.Add("Freed from [itsTheir] confines, your [multiCockDesc] flop[notS] out, quickly becoming erect as you ravage the horny herm with your eyes. You can hardly wait to plunge inside her sopping wet pussy.", parse);
	}
	else {
		Text.Add("You quickly equip your [cockDesc], securing it carefully. It’s going to see a lot of action in the coming hours.", parse);
	}
	Text.Add(" Placing[oneof] your [multiCockDesc] at her entrance, you rub the tip in her juices. A shiver runs through the canid as you slowly push inside her, and she bites her lip, trying to suppress a moan.", parse);
	Text.NL();
	if(miranda.sex.rVag < 5)
		Text.Add("Miranda is deliciously tight, her seldom used pussy clamping down on your [cockDesc] like a warm, wet vice.", parse);
	else if(miranda.sex.rVag < 15)
		Text.Add("Miranda opens up, welcoming an old customer into her wet folds. No matter how many times you do her, it’s always a great feeling to thrust inside the sexy herm.", parse);
	else
		Text.Add("Miranda’s pussy is slick with her juices, still blissfully tight despite how many times you’ve taken her.", parse);
	Text.Add(" Her composure breaks when you adjust your stance and begin thrusting with vigor and ferocity.", parse);
	Text.NL();
	
	Sex.Vaginal(player, miranda);
	player.Fuck(pCock, 3);
	miranda.FuckVag(miranda.FirstVag(), pCock, 3);
	
	if(dom > 25)
		Text.Add("<i>“Hngh, you call that fucking?”</i> she moans between gritted teeth. <i>“By now, I’d have you - aah! - screaming for more!”</i>", parse);
	else if(dom > -25)
		Text.Add("<i>“I could - aah! - grow to like this,”</i> she moans. <i>“N-not too bad.”</i>", parse);
	else {
		Text.Add("<i>“Y-yes! You are way too good, [playername]!”</i> the slutty herm moans. <i>“Make me your bitch, fuck me senseless!”</i>", parse);
		miranda.subDom.DecreaseStat(-50, 1);
	}
	Text.NL();
	if(mode == Mode.back) {
		Text.Add("As you pick up speed, you grab her by the ankles, spreading her legs wide. Miranda has thrown her head back, tongue lolling about. Her paws are busy between her thighs, feverishly jerking on her leaking cock. The guardswoman moans and squirms as you jackhammer her tight pussy and her heavy tits bounce in rhythm with your movements.", parse);
	}
	else if(mode == Mode.doggy) {
		Text.Add("You adjust your hold on her hips, pulling her back onto your [cockDesc]. Soon, you’ve established a rhythm - rough and deep, just the way she likes it. The guardswoman is resting on her elbows, her tits bouncing back and forth each time you drive into her. Between her spread legs lie her pride and glory flopping about uselessly, staining the sheets with her pre.", parse);
	}
	Text.NL();
	var cap = pCock.length.Get() - miranda.FirstVag().capacity.Get();
	if(cap > 10) {
		Text.Add("Miranda grunts, gritting her teeth as your grind against her cervix. Before she met you, you doubt she had taken any cock bigger than her own, and certainly nothing like yours. It must be a humbling experience for her.", parse);
		miranda.subDom.DecreaseStat(-75, 1);
	}
	else if(cap > -5)
		Text.Add("You somehow manage to fit all of your [cockDesc] in her cunt, though it is pushing her limits. She’s a tough girl though, she can take it.", parse);
	else
		Text.Add("Each thrust slams your hips into her butt as you hilt your [cockDesc] in her accomodating vagina.", parse);
	Text.Add(" Beads of sweat - yours and hers - mat the doggie’s short, dark fur, giving her coat a glossy shine. Somehow, her hair had come undone and her pink ribbon discarded somewhere in the pile of clothes strewn across the rooms. Her long strands flow and pool onto the sheets, spreading out around the guardswoman.", parse);
	Text.NL();
	
	var widenButt = false;
	if(mode == Mode.doggy && player.SubDom() > 30) {
		Text.Add("Just above her ravaged pussy, Miranda’s tight rosebud winks at you. The opportunity is just too good to not take advantage of. Licking your fingers thoroughly, you coat them in a thick layer of saliva to ease your entry.", parse);
		Text.NL();
		Text.Add("<i>“Hey, what are you up to back th- Ahh!”</i> Miranda’s question is quickly answered by you thumb digging into her tunnel, prying her anus open. ", parse);
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("<i>“Hngh, think you’re so tough, I can take that easily!”</i> she grunts.", parse);
		}, 1.0, function() { return miranda.sex.rAnal > 10; });
		scenes.AddEnc(function() {
			Text.Add("<i>“Hey, that’s my schtick,”</i> she complains. <i>“If you keep doing that, you’ll get it back tenfold!”</i>", parse);
			player.subDom.IncreaseStat(0, 1);
		}, 1.0, function() { return miranda.sex.gAnal > 10; });
		scenes.AddEnc(function() {
			Text.Add("<i>“T-thank you for using my butt too,”</i> she pants. <i>“Will you fuck me there if I’m a good girl?”</i>", parse);
		}, 1.0, function() { return miranda.SubDom() < -25; });
		scenes.AddEnc(function() {
			Text.Add("<i>“S-such a naughty [boyGirl],”</i> she pants. <i>“I’ll get back at you for that.”</i>", parse);
		}, 1.0, function() { return true; });
		
		scenes.Get();
		
		Text.Add(" You ignore her banter, inserting your other thumb. The guardswoman groans wordlessly as you start slowly widening her sphincter, all while retaining the momentum of your rocking hips.", parse);
		Text.NL();
		
		widenButt = true;
	}
	Text.NL();
	if(dom < -25) {
		Text.Add("<i>“F-fuck, you are good, [playername]!”</i> Miranda moans. <i>“I need to come so bad, fuck me, hard and deep!”</i>", parse);
	}
	else if(dom < 25) {
		Text.Add("<i>“Just - haah - keep going like that, [playername],”</i> Miranda begs.", parse);
	}
	else {
		Text.Add("<i>“That all you got?”</i> she moans defiantly. <i>“At this rate, I’ll have to - haah! - do it myself!”</i> ", parse);
		if(mode == Mode.back)
			Text.Add("Keeping one hand busy on her cock, Miranda moves her other one to squeeze her boobs, sighing as she pinches her nipples.", parse);
		else if(mode == Mode.doggy)
			Text.Add("True to her word, the herm begins to rock her hips back against you, fucking herself on your [cockDesc].", parse);
	}
	parse["dommy"] = (dom >= 25) ? " - despite her words -" : "";
	Text.Add(" Her [mvagDesc] is clenching down on your shaft with a powerful grip, and[dommy] you can sense that the guardswoman is almost at her limit.", parse);
	Text.NL();
	
	parse["artificial"] = pCock.isStrapon ? " artificial" : "";
	var scenes = new EncounterTable();

	var mCum = miranda.OrgasmCum();
	
	scenes.AddEnc(function() {
		Text.Add("Just where you want her. Grinning widely, you slow down a bit, retaining the depth of your thrusts but keeping the dog-morph just a hairs-breadth away from the orgasm she so desperately craves. When Miranda realizes what you are up to, she growls, cursing you. Her complaints gradually turn to whines and pleas and finally into full on begging as you break down her will with your pistoning [cockDesc].", parse);
		Text.NL();
		Text.Add("After another ten minutes, she finally crack, her thighs twitching and pussy clamping down on your[artificial] shaft. The dog-morph throws back her head and howls, tongue lolling and eyes rolling back as she rides out her climax.", parse);
		miranda.subDom.DecreaseStat(-75, 1);
	}, 1.0, function() { return player.SubDom() > 0 && player.sexlevel > 3; });
	scenes.AddEnc(function() {
		Text.Add("With a final thrust, you send her over the edge, gripping the guardswoman’s hips tightly as you drive into her, triggering her climax. The doggie’s pussy clamps down on your[artificial] shaft, clenching you tightly even as it stains your pillar with its sweet nectar.", parse);
	}, 1.0, function() { return true; });
	
	var load;
	var LoadIn = {
		vag : 0,
		ass : 1,
		out : 2
	};
	var loadIn;
	
	var cont = function() {
		Text.Add(" The two of you collapse on top of each other, exhausted from your wild romp.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("You stay like that for a while, recovering in each others arms.", parse);
			if(loadIn == LoadIn.out || player.NumCocks() > 1) {
				if(dom > 0)
					Text.Add(" Miranda has you clean her up by licking your own cum from her matted fur. <i>“Good [boyGirl],”</i> she murmurs, stroking your [hairDesc] gently.", parse);
				else
					Text.Add(" Miranda sets to cleaning herself up, meticulously licking the cum from her matted fur. <i>“Would be a shame to have it go to waste,”</i> she murmurs, swallowing greedily.", parse);
			}
			Text.Add(" Eventually, you disentangle yourself and set to re-adorning your gear.", parse);
			Text.NL();
			
			player.subDom.IncreaseStat(75, 1);
			miranda.subDom.DecreaseStat(-75, 3);
			miranda.relation.IncreaseStat(40, 2);
			player.AddLustFraction(-1);
			miranda.AddLustFraction(-1);
			
			Scenes.Miranda.HomeDommySexLeavingFuckedHer();
		});
	}
	
	scenes.Get();
	if(mode == Mode.back)
		Text.Add(" Miranda’s cock violently erupts, spraying her plentiful seed all over her [mstomachDesc], face and hair.", parse);
	else if(mode == Mode.doggy)
		Text.Add(" Between her legs, Miranda’s cock sprays its load, making a sticky pool on her sheets. Laundry is probably in order after this.", parse);
	Text.Add(" The herm’s knot has swollen to its full size, mindlessly trying to tie her together with her non-existent mate’s cunt. Her tail is wagging uncontrollably, telling you just how far gone she is.", parse);
	Text.NL();
	if(!pCock.isStrapon) {
		Text.Add("Your own orgasm is not far behind. You have only seconds to decide where you are going to cum.", parse);
		Text.Flush();
		
		var loads = function() {
			if(loadIn == LoadIn.out) {
				if(load > 6) {
					Text.NL();
					Text.Add("Before you are even halfway done, Miranda is thoroughly coated in your semen, thick white stripes covering her short dark fur. You wipe your [multiCockDesc] off on her thigh, further adding to the mess.", parse);
				}
				else if(load > 3) {
					Text.NL();
					Text.Add("Your cum splatters all over the herm, painting her dark fur with thick white stripes.", parse);
				}
			}
			else { // vag/ass
				if(load > 6) {
					Text.NL();
					Text.Add("Within a few shots, Miranda’s belly is bulging with your seed. The excess fountains out around your [cockDesc], splattering on the bed and floor below.", parse);
				}
				else if(load > 3) {
					Text.NL();
					Text.Add("You remain inside her while you shoot your load, causing her belly to swell slowly as more and more cum is pumped into her body.", parse);
				}
				if(player.NumCocks() > 1) {
					var allCocks = player.AllCocksCopy();
					for(var i = 0; i < allCocks.length; i++) {
						if(allCocks[i] == pCock) {
							allCocks.remove(i);
							break;
						}
					}
					
					parse["other"]          = allCocks.length > 1 ? "The rest of" : "Your other";
					parse["multiCockDesc1"] = player.MultiCockDesc(allCocks);
					parse["s"]              = allCocks.length > 1 ? "s" : "";
					parse["notS"]           = allCocks.length > 1 ? "" : "s";
					parse["itTheir"]        = allCocks.length > 1 ? "their" : "it";
					Text.NL();
					Text.Add("[other] [multiCockDesc1] shoot[notS] [itTheir] load[s] all over her body, painting her dark fur with thick white stripes.", parse);
				}
			}
			Text.NL();
			Text.Add("<i>“Mmm… nice and thick,”</i> Miranda purrs contentedly.", parse);
			cont();
		};
		
		//[Inside][Outside][Ass]
		var options = new Array();
		options.push({ nameStr : "Inside",
			func : function() {
				Text.Clear();
				Text.Add("You are not about to stop here. With a rapid series of thrusts, you go over the edge and pour your cum into the horny herm.", parse);
				
				load = player.OrgasmCum();
				
				// TODO PREG
				
				loadIn = LoadIn.vag;
				loads();
			}, enabled : true,
			tooltip : "Pour your load into the dommy herm."
		});
		options.push({ nameStr : "Outside",
			func : function() {
				Text.Clear();
				load = player.OrgasmCum();
				if(mode == Mode.back) {
					if(dom > 25) {
						Text.Add("You try to pull out your [cockDesc], but quickly meet resistance.", parse);
						Text.NL();
						Text.Add("<i>“Oh no you don’t,”</i> she growls, locking her legs around your hips and pulling you back in. <i>“Finish what you started,”</i> she commands, gazing deep into your eyes as you cry out, unleashing your load inside her.", parse);
					}
					else
						Text.Add("You pull out your [cockDesc], just in time to unleash your cum all over the waiting herm. Your load mingles with her own, further coating her in thick, white stripes.", parse);
				}
				else if(mode == Mode.doggy) {
					Text.Add("Just before you blow, you manage to pull out of Miranda’s tight pussy, spending your load across her naked back, sticking to her hair.", parse);
				}
				loadIn = LoadIn.out;
				loads();
			}, enabled : true,
			tooltip : "Pull out and shoot your load all over her body."
		});
		if(widenButt) {
			options.push({ nameStr : "Ass",
				func : function() {
					Text.Clear();
					Text.Add("By now, you’ve worked your thumbs into her ass to the knuckle, giving her a thorough anal workout even as you rail her pussy. Just before you are about to blow, you pull out and plunge your [cockDesc] into Miranda’s butt. The guardswoman gives a surprised yelp, trailing off into a moan as you pour your hot cum inside her.", parse);
					
					load = player.OrgasmCum();
					
					loadIn = LoadIn.ass;
					loads();
				}, enabled : true,
				tooltip : "Change your target at the last instant."
			});
		}
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.Add("<i>“You know how to handle that thing pretty well,”</i> Miranda pants after she’s cooled down a bit. <i>“Perhaps I should add it to my collection.”</i>", parse);
		cont();
	}
}


Scenes.Miranda.HomeSubbySexLeavingFuckedHer = function() {
	var parse = {
		playername : player.name,
		lover : miranda.Attitude() < Miranda.Attitude.Neutral ? "bitch" : "lover"
	};
	
	if(player.sexlevel < 3)
		Text.Add("<i>“Hope I didn’t wear you out, [lover],”</i> she purrs, giving your butt a slap. <i>“I’m far from done with you.”</i>", parse);
	else if(player.sexlevel < 6)
		Text.Add("<i>“Pretty impressive the way you kept up with me back there, [lover],”</i> she says as she stretches. <i>“Been a while since I’ve had such an… energetic fuck buddy.”</i>", parse);
	else
		Text.Add("<i>“Wow, that was intense!”</i> she exclaims, praising your performance. <i>“We’ll be seeing more of each other, and soon.”</i>", parse);
	Text.NL();
	
	if(rigard.Krawitz["Q"] == Rigard.KrawitzQ.HuntingTerry) {
		Text.Add("The two of you set out, returning to your search for the elusive thief.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.Residental.street, {minute : 5});
		});
	}
	else if(party.InParty(miranda)) {
		Text.Add("The two of you set out, returning to your quest.", parse);
		Text.Flush();
		
		Gui.NextPrompt();
	}
	else {
		Gui.Callstack.push(function() {
			Text.NL();
			parse["night"] = world.time.DayTime();
			Text.Add("You bid Miranda farewell and step out into the [night].", parse);
			if(party.Num() > 1) {
				Text.NL();
				parse["comp"] = party.Num() > 2 ? "the rest of your party" : party.Get(1).name;
				Text.Add("Somehow, you make it out the gates in order to rejoin [comp].", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 30});
				});
			}
			else {
				Text.Flush();
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Residental.street, {minute: 5});
				});
			}
		});
		
		if(miranda.Attitude() >= Miranda.Attitude.Neutral && (world.time.hour > 20 || world.time.hour < 4)) {
			Text.Add("<i>“Ya know? It’s kinda late. Why don’t you take that off and come back to bed? Maybe we can squeeze in a quickie before I have to leave in the morning?”</i> she grins.", parse);
			Text.Flush();
			
			//[Stay][Don’t]
			var options = new Array();
			options.push({ nameStr : "Stay",
				func : function() {
					Text.Clear();
					Text.Add("Miranda scoots over and pats a clean spot beside her. You strip down and join her, using her arm as a pillow. With a grin, she draws you close, resting your head against her breast as her breathing levels out. Soon enough you join her in a restful slumber.", parse);
					Text.NL();
					Text.Add("You sleep for 8 hours.");
					Text.Flush();
					
					var func = function() {
						world.StepToHour(8);
						party.Sleep();
						
						PrintDefaultOptions();
					};
					
					Gui.NextPrompt(function() {
						Text.Clear();
						
						Scenes.Dreams.Entry(func);
					});
				}, enabled : true,
				tooltip : "Why not? You’re feeling pretty tired after all."
			});
			options.push({ nameStr : "Don’t",
				func : function() {
					Text.Clear();
					//TODO
					world.TimeStep({hour: 2});
					Text.Add("<i>“Pity, I guess I’ll see you around then,”</i> she says, turning to take a nap.", parse);
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Unfortunately the day isn’t over for you. You’ll have to decline."
			});
			Gui.SetButtonsFromList(options);
		}
		else {
			Text.Add("<i>“I’m going to rest for a while, you can see yourself out right?”</i> she asks, turning to settle herself in for a more comfortable nap.", parse);
			PrintDefaultOptions();
		}
	}
}


Scenes.Miranda.HomeSubbySex = function() {
	var nasty = miranda.Attitude() < Miranda.Attitude.Neutral;
	
	var parse = {
		armorDesc : function() { return player.ArmorDesc(); }
	};
	
	party.location = world.loc.Rigard.Residental.miranda;
	
	Text.NL();
	Text.Add("Miranda is breathing heavily as she paws at you, dragging and clawing at your gear. There is a fierce fire in her eyes, indicating that at least one of you is in for a <i>really</i> good time. How well this bodes for you, you are not sure.", parse);
	Text.NL();
	if(miranda.flags["Floor"] == 0) {
		Scenes.Miranda.HomeDescFloor1();
		Text.NL();
	}
	if(nasty)
		Text.Add("<i>“Don’t make me wait, slut,”</i> the horny herm growls. <i>“Naked, <b>now.</b>”</i> In her eagerness she practically rips your [armorDesc] apart, leaving you as nude as the day you were born. <i>“Naked suits you so much better. Only thing I think I’ll add is a pearly necklace.”</i>", parse);
	else
		Text.Add("<i>“Enough gawking, lets fuck!”</i> the horny herm exclaims, almost ripping apart your [armorDesc] in her eagerness. In short order, she has relieved you of your gear, leaving you standing nude in her foyer. ", parse);
	
	var Loc = {
		Upstairs   : 0,
		Downstairs : 1
	};
	var location = Loc.Upstairs;
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("She heads into the main living room, hips swaying seductively.", parse);
		Text.NL();
		if(world.time.season >= Season.Autumn)
			Text.Add("<i>“Let me start a fire, get the chill out of our bones,”</i> Miranda says as she pulls you along, throwing you on the fluffy pelt while she fumbles with flint and iron. In short order, the competent guardswoman has a merry fire going, quickly raising the temperature in the room.", parse);
		else
			Text.Add("<i>“Screw foreplay,”</i> Miranda growls, pulling you along and throwing you on top of the fluffy pelt in next to the hearth. <i>“I’m just going to take you here and now!”</i>", parse);
		Text.NL();
		Text.Add("<i>“Listen close,”</i> she says, stalking up to you while tearing her own clothes off, <i>“if you stain the rug, you are gonna lick it up. And trust me, you are going to stain the rug.”</i> She discards her top, letting her large breasts bounce freely. Downstairs, her cock is quickly rising to attention.", parse);
		Text.NL();
		Text.Add("The dobie has you in her sights, and she’s not going to take no for an answer.", parse);
		location = Loc.Downstairs;
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“This way!”</i> she motions imperiously, pulling you along up the stairs to her bedroom. The steep stairway gives you quite the view of Miranda’s supple behind, though it’s still obscured by her tight-fitting clothes. The dobie curses as she fumbles a bit with the door, her tail wagging with excitement. When the guardswoman finally manages to get it open, she practically throws you through the door and into her bedroom.", parse);
		
		if(miranda.flags["Floor"] < 2) {
			Text.NL();
			Scenes.Miranda.HomeDescFloor2();
		}
		else {
			Text.Add(" The room is a total mess; not that you expected any different by now.", parse);
		}
		Text.NL();
		Text.Add("<i>“Try to find a dry pillow to bite down on, you’ll need it,”</i> comes Miranda’s mocking voice from behind you, accompanied by a rustling as she sheds her clothes. Turning to face her, you gulp as you are hit by her stunning beauty. The doberman’s toned body has curves in all the right places; from top to toe she’s built like an athlete. Not that you’d expect any less from a guardswoman.", parse);
		Text.NL();
		Text.Add("Taut muscle hiding just below her short, shiny fur. Flat stomach and broad hips that flare out enticingly, giving her an attractive hourglass figure. Her ass is deliciously rounded, just begging to be groped. Up above, her pillowy breasts heave with her breathing, the shiny black nipples capping each mound stiff with arousal. If you had to guess, you’d say she’s about a D-cup. Of course, it’s not like you can hardly ignore the massive knotted shaft sticking out proudly between her legs either.", parse);
		Text.NL();
		Text.Add("<i>“Check out the goods all you like,”</i> Miranda quips sultrily, tossing her long hair over her shoulder. <i>“Don’t daydream for too long, though. As you can see, I’m getting kinda antsy.”</i>", parse);
		Text.NL();
		Text.Add("It seems like she has you within her sights, so you better speak up quickly unless you are going to just let her take you. If her wide grin and stiff cock are any judge, she’s itching to have a go at you.", parse);
		location = Loc.Upstairs;
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.Flush();
	
	parse["loc1"] = function() { return location == Loc.Upstairs ? "the bed" : "the rug" };
	parse["loc2"] = function() { return location == Loc.Upstairs ? "the soft sheets" : "the fluffy pelt" };
	
	//[Take anal][Take vag][Dommy ride]
	var options = new Array();
	options.push({ nameStr : "Take anal",
		func : function() {
			Scenes.Miranda.HomeSubbySexTakeAnal(location, Loc);
		}, enabled : true,
		tooltip : "You need her, offer your ass to the horny herm."
	});
	//TODO
	if(player.FirstVag()) {
		options.push({ nameStr : "Take vag",
			func : function() {
				
			}, enabled : false,
			tooltip : "Beg Miranda to fuck your pussy, you want to feel her doggy dick dig deep into your wet folds."
		});
	}
	
	var cocksInVag = player.CocksThatFit(miranda.FirstVag(), false, 15);
	var p1Cock     = player.BiggestCock(cocksInVag);
	
	if(p1Cock) {
		options.push({ nameStr : "Dommy ride",
			func : function() {
				
			}, enabled : false,
			tooltip : "Perhaps... she’d let you fuck her if you asked?"
		});
	}
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Miranda.HomeSubbySexTakeAnal = function(location, Loc) {
	var nasty = miranda.Attitude() < Miranda.Attitude.Neutral;
	
	var parse = {
		playername : player.name,
		lover : nasty ? "bitch" : "lover",
		boyGirl : player.mfTrue("boy", "girl"),
		guyGirl : player.mfTrue("guy", "girl"),
		manWoman : player.mfTrue("man", "woman"),
		masterMistress : player.mfTrue("master", "mistress"),
		multiCockDesc : function() { return player.MultiCockDesc(); },
		vagDesc : function() { return player.FirstVag().Short(); },
		ballsDesc : function() { return player.BallsDesc(); },
		buttDesc : function() { return player.Butt().Short(); },
		anusDesc : function() { return player.Butt().AnalShort(); },
		breastDesc : function() { return player.FirstBreastRow().Short(); },
		loc1 : function() { return location == Loc.Upstairs ? "the bed" : "the rug" },
		loc2 : function() { return location == Loc.Upstairs ? "the soft sheets" : "the fluffy pelt" },
		hand : function() { return player.HandDesc(); },
		tailDesc : function() { return player.HasTail().Short(); },
		legsDesc : function() { return player.LegsDesc(); },
		hipsDesc : function() { return player.HipsDesc(); },
		stomachDesc : function() { return player.StomachDesc(); }
	};
	
	var dom = miranda.SubDom() - player.SubDom();
	
	Text.Clear();
	if(player.Slut() >= 50) {
		Text.Add("You give her a seductive smile before turning around, bending over [loc1] and shaking your [buttDesc] enticingly. <i>“My, aren’t we eager,”</i> Miranda purrs, suddenly very close. You can feel her hot breath on your exposed behind as she kneels down, rubbing your cheeks possessively. <i>“And where do you want it?”</i> she asks sultrily.", parse);
		Text.NL();
		Text.Add("Moaning in need, you lick one of your fingers, reaching behind your back and thrusting it into your [anusDesc]. <i>“Can’t wait to have your hole reamed, can you, [lover]?”</i> she eggs you on. <i>“I just love slutty [boyGirl]s like you begging me to fuck them!”</i>", parse);
		Text.NL();
		Text.Add("You nod eagerly, holding your cheeks wide for the dobie to do with as she wishes.", parse);
	}
	else if(dom > 25) {
		Text.Add("You bow your head, turning around meekly and bending over [loc1]. Soft steps fall behind you as your mistress stalks closer, a hunter closing in on her prey. <i>“You know just what I want, don’t you?”</i> Miranda purrs, her voice hot on the back of your neck, full of sultry promises. As if it wasn’t clear, she gropes your [buttDesc], her throbbing cock depositing splatters of pre on your back as she grinds it between your cheeks.", parse);
		Text.NL();
		Text.Add("Nodding quickly, you reach back behind you, your [hand]s trembling slightly as you touch her, trailing down her toned stomach and gently caressing her stiff member. The crimson battering ram twitches in your grasp as the dommy dobie bucks her hips impatiently.", parse);
		Text.NL();
		Text.Add("<i>“What I want is what you want, so bend over and offer it, [lover],”</i> she growls between gritted teeth. Hurrying to please her, you bury your face in [loc2], spreading your buttcheeks wide for the herm.", parse);
	}
	else {
		Text.Add("She’s going to take what she wants either way, so why not humor her? Smiling seductively, you wave for her to come over, giving your [buttDesc] an inviting slap. <i>“A [manWoman] of my own tastes,”</i> Miranda chuckles, hips swaying as she closes in on you.", parse);
		Text.NL();
		Text.Add("<i>“Did you imagine this was what was going to happen when you followed me here?”</i> Miranda murmurs as she cups your cheeks, something wet and stiff poking you in the back. She rubs her breasts against your back, inexorably pushing your forward until you are bent over [loc1].", parse);
		Text.NL();
		Text.Add("Reaching back to spread your buttcheeks, you admit that you considered it a looming possibility. <i>“You won’t be disappointed, [lover].”</i>", parse);
	}
	Text.NL();
	Text.Add("Presented with such a tempting target, Miranda grasps one of your cheeks roughly while she guides herself to your puckered rosebud. ", parse);
	if(player.HasTail())
		Text.Add("Her hand pauses by your [tailDesc], squeezing it lightly and sending a shudder up your spine. ", parse);
	Text.Add("The tip of her mastiff molester pokes at your [anusDesc], rubbing in her sticky pre.", parse);
	Text.NL();
	if(nasty)
		Text.Add("<i>“Mm… seems you’re in luck, I happen to have a small dab of lube left. Who knows, had you come tomorrow I may have had to take you for a dry run, eh?”</i> she jokes - or so you hope - as she splashes a cool liquid along her shaft and leaking between your cheeks. <i>“That ought to be enough, no sense wasting this on someone like you.”</i>", parse);
	else
		Text.Add("<i>“Just give me a second… there!”</i> The dobie conjures a bottle of lube from somewhere, spreading a generous amount of its contents on her cock and between your cheeks. <i>“Wouldn’t do to ruin you right away, right? You need to be ready for round two later,”</i> she adds cheerfully.", parse);
	Text.NL();
	Text.Add("Deeming you as ready as you’re likely to be, the guardswoman lines herself up, slowly pushing her way inside your [anusDesc]. Thanks to the lube she applied and the pointed tip of her canine cock, the initial entry is somewhat eased. However, you know full well that it’s going to be followed by the better part of a foot of thick dog meat, and that Miranda isn’t one to hold back for the comfort of others.", parse);
	Text.NL();
	
	Sex.Anal(miranda, player);
	player.FuckAnal(player.Butt(), miranda.FirstCock(), 3);
	miranda.Fuck(miranda.FirstCock(), 3);
	
	Text.Add("Once her head has firmly established its breach in your protesting ass, the herm grabs you by the hips and sinks her knotted dick deeper into you, conquering your colon one inch at a time. You bite down, enduring her rough treatment. As she goes deeper, her cock stirs something within you, a inebriating pleasure roaring out all other thoughts. Overcome by the sensation, you let out a whimpering moan.", parse);
	Text.NL();
	if(nasty)
		Text.Add("<i>“Doesn’t it feel much better to give in to your true nature, my little slut?”</i> Miranda eggs you mockingly as she pushes forward. <i>“There is no one to hide it from here, you can yell at the top of your lungs how much you want to be fucked.”</i>", parse);
	else if(dom > 25) {
		Text.Add("<i>“How does it feel when your mistress dominates you, my little pet?”</i> Miranda quips, her breath coming in short bursts as she slowly pushes herself forward. <i>“Am I going too slow for you?”</i>", parse);
		Text.NL();
		Text.Add("You manage to moan an incoherent reply, which the herm probably interprets as encouragement.", parse);
	}
	else
		Text.Add("<i>“Mm, I just love sticking my cock in [guyGirl]s like you!”</i> Miranda moans. <i>“Ngh… just a little bit further… <b>that’s</b> the spot!”</i>", parse);
	Text.NL();
	Text.Add("<i>“Like that?”</i> she grunts, her even thicker knot finally knocking on your rear entrance. <i>“Tell me, [lover], how do you want it?”</i>", parse);
	Text.NL();
	Text.Add("You squirm a bit, knowing she’ll only accept one response.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("<i>“That’s my [boyGirl]!”</i> Miranda commends you, patting you on the butt. <i>“No regrets now, I’m not going to stop until I’m satisfied!”</i> With those words, your fate is sealed. Pulling back her hips, the doberman shifts her position, planting her legs to either side of you, her hands snaking their way in under your [breastDesc]. ", parse);
		Text.NL();
		if(player.FirstBreastRow().Size() > 3)
			Text.Add("She squishes your boobs together and rests her own on your back, pressing you down into [loc2]. ", parse);
		Text.Add("For a second, she hovers above you with only her tip lodged inside your stretched asshole, poised to strike.", parse);
		Text.NL();
		Text.Add("<i>“Here it comes,”</i> she whispers in your ear sweetly, slamming down her hips hard. You gasp helplessly as all the air is driven from your lungs, the immensely satisfying sense of being full spreading through your nethers.", parse);
		if(player.FirstCock()) {
			parse["notS"] = player.NumCocks() > 1 ? "" : "s";
			Text.Add(" Your [multiCockDesc] flop[notS] around wildly, roused to full mast through the herm’s repeated assault on your prostate.", parse);
		}
		if(player.FirstVag())
			Text.Add(" Your [vagDesc], feeling left out, aches for your attention. Almost without thinking about it, your [hand] sneaks its way down there, fingering your wet folds.", parse);
		Text.NL();
		Text.Add("Once Miranda has gotten started, there is no respite for your poor sphincter. Here in her own home, she doesn’t have to worry about being interrupted, which likely means she’ll continue fucking you until she collapses. Unfortunately for you, given her stamina, that is going to be a while. From the way she’s reaming you, it seems like she’s trying to fuck you through [loc1].", parse);
		Text.NL();
		Text.Add("<i>“Mm, good [boyGirl]! Clench down on my cock!”</i> the dobie growls. ", parse);
		var bt = player.Butt().Tightness();
		if(bt < Butt.Tightness.loose)
			Text.Add("<i>“Fuck you are tight! I love breaking in a new ass!”</i>", parse);
		else if(bt < Butt.Tightness.gaping)
			Text.Add("<i>“Heh, this isn’t the first time you’ve received a good fucking, is it?”</i>", parse);
		else
			Text.Add("<i>“Fuck, just what have you stuffed in here? You probably spend all your time as the town mount if you’re gaping as wide as this!”</i>", parse);
		parse["prostateColon"] = player.FirstCock() ? "prostate" : "colon";
		Text.Add(" Each word is underlined by another deep thrust, slamming into your [prostateColon] like a piledriver.", parse);
		Text.NL();
		parse["legs"] = player.LowerBodyType() != LowerBodyType.Single ? Text.Parse(", hoisting your [legsDesc] over her shoulder", parse) : "";
		Text.Add("You arch your back in pleasure; sure Miranda is rough, but you can’t ignore that this feels <i>good</i>. After ten minutes of straight fucking, she’s still not showing any signs of slowing down; only stopping briefly at one point to flip you on your back[legs].", parse);
		Text.NL();
		
		parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
		parse["isAre"] = player.NumCocks() > 1 ? "are" : "is";
		parse["s"]     = player.NumCocks() > 1 ? "s" : "";
		parse["notS"]  = player.NumCocks() > 1 ? "" : "s";
		parse["thatThose"] = player.NumCocks() > 1 ? "those" : "that";
		parse["itsTheir"]  = player.NumCocks() > 1 ? "their" : "its";
		parse["itThem"]    = player.NumCocks() > 1 ? "them" : "it";
		
		if(player.FirstCock()) {
			Text.Add("Your [multiCockDesc] [isAre] bobbing freely, fully rigid from your near constant prostate pounding. ", parse);
			if(nasty)
				Text.Add("<i>“Just look at [thatThose] pathetic cock[s] of yours, flopping uselessly,”</i> she sneers. <i>“Pity you won’t ever get to use them on me.”</i>", parse);
			else
				Text.Add("<i>“Looks like <b>someone</b> likes this,”</i> she huffs, grinning as she strokes your erection[s]. <i>“Would be a shame to let this go to waste, but it’ll have to wait until I’m satisfied.”</i>", parse);
			Text.NL();
		}
		
		if(player.FirstVag()) {
			Text.Add("<i>“Woah, you’re dripping down here!”</i> Miranda exclaims, remarking on your wet cunt. ", parse);
			if(nasty)
				Text.Add("<i>“How convenient, gives me another hole to fuck once I’ve ruined this one,”</i> she adds, her grin seething with playful malice.", parse);
			else
				Text.Add("<i>“We’ll have to see to this later; can’t have you hobbling around my city smelling like a bitch in heat.”</i>", parse);
			Text.NL();
		}
		Text.NL();
		Text.Add("Before long, you find yourself arching your back as lightning races down your spine. Your entire body tingles as it wavers on the brink of orgasm, suspended on the thick, crimson cock impaling you. What finally pushes you over the edge is Miranda ramming her knot inside your rectum, locking almost a foot of doberman dick in your butt. The two of you cry out in unison as you cum, burst after burst of cockcream pouring into your bowels.", parse);
		Text.NL();
		
		miranda.OrgasmCum(1.5);
		var cum = player.OrgasmCum(1.5);
		
		if(player.FirstCock()) {
			Text.Add("With a final twitch, your [multiCockDesc] explode[notS] in a fountain of white seed, splattering all over. ", parse);
			if(cum > 6) {
				Text.Add("Even for you, the discharge is impressive; by the time you’re spent, both of you are covered in thick ropes of sticky cum, and a small pool is spreading around you on [loc2].", parse);
				Text.NL();
				Text.Add("<i>“Fuck, that was intense!”</i> Miranda pants, wiping a large glob of your semen from her chin.", parse);
			}
			else if(cum > 3) {
				Text.Add("Your cock[s] make no distinction in [itsTheir] wanton hosing, spreading your semen on both yourself, Miranda and [loc2].", parse);
			}
			else {
				Text.Add("Most of it lands on your [stomachDesc] and [breastDesc], trickling down on [loc2].", parse);
			}
			if(location == Loc.Downstairs) {
				Text.NL();
				Text.Add("<i>“What did I tell you about staining the rug?”</i> the herm growls, a bit miffed at the mess you caused. <i>“Guess I’m not entirely blameless, but let’s continue this upstairs.”</i>", parse);
			}
		}
		else if(player.FirstVag()) {
			Text.Add("Your femcum gushes forth, clear drops trickling down around the base of Miranda’s fuckstick. While you may have gotten off from the intense anal fuck you just received, your loins are still aching, begging to be filled.", parse);
		}
		Text.NL();
		if(location != Loc.Upstairs) {
			parse["legs"] = player.LowerBodyType() != LowerBodyType.Single ? ", your legs wrapped around her" : "";
			Text.Add("Not even waiting for her knot to deflate, Miranda hoists you up[legs], patting you on the back as she strides towards the stairs. You gulp as you feel the cum inside you roiling about, but the canid buttplug holds, and just a little of it seeps out.", parse);
			Text.NL();
			Text.Add("<i>“I’m far from done with you,”</i> she murmurs in your ear, nipping you playfully. Once in her bedroom, she closes the door behind her, still carrying you around.", parse);
			
			if(miranda.flags["Floor"] < 2) {
				Text.NL();
				Scenes.Miranda.HomeDescFloor2();
			}
			else {
				Text.Add(" <i>“We’ll probably be at this for a while, let’s clear a space.”</i>", parse);
			}
			Text.NL();
			Text.Add("Sweeping her scattered toys to the side, the doberwoman throws you on top of the bed, still locked with you hip to hip.", parse);
			Text.NL();
			Text.Add("<i>“Now, where were we?”</i> She purrs as she looms over you, her eyes still filled with unsated lust.", parse);
			
			location = Loc.Upstairs;
		}
		
		world.TimeStep({hour : 1});
		
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Gui.Callstack.push(function() {
				miranda.relation.IncreaseStat(75, 1);
				world.TimeStep({hour : 4});
				
				Text.Flush();
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("Eventually, the two of you rouse from your afterglow and start to poke around with your gear. Miranda’s room is even more of a mess than before, and it reeks of sex.", parse);
					Text.NL();
					
					player.subDom.DecreaseStat(-75, 1);
					miranda.subDom.IncreaseStat(75, 3);
					
					Scenes.Miranda.HomeSubbySexLeavingFuckedHer();
				});
			});
			
			Text.Clear();
			Text.Add("It takes a few more minutes until Miranda’s knot finally deflates, though she’s still hard inside you. <i>“Mm… not bad for round one,”</i> she sighs, stretching luxuriously. As she shifts her hips, her knot plops out, the pointed tip of her dick rummaging around your sticky innards. <i>“How about we continue, [lover]?”</i>", parse);
			Text.NL();
			if(player.sexlevel < 3) {
				Text.Add("You’ve still barely recovered from the last bout, but the guardswoman isn’t about to let up for your comfort. She takes you through just about every sex position you can name, and quite a few that you can’t, though you are always on the receiving end.", parse);
				Text.NL();
				Text.Add("As you mate with Miranda, your senses gradually blur, dulled by near constant pleasure. Though she claimed that she’s only out to sate her own lusts, in the process of doing so the dommy dobie is showing you heights of ecstasy previously unknown to you… and beyond the capacity of your body.", parse);
				Text.NL();
				
				Sex.Anal(miranda, player);
				player.FuckAnal(player.Butt(), miranda.FirstCock(), 3);
				miranda.Fuck(miranda.FirstCock(), 3);
				
				miranda.OrgasmCum();
				player.OrgasmCum(3);
				
				Text.Add("By the time you pass out she has thoroughly drained you; herself spilling her seed in and on you several times. Even if your butt wasn’t constantly being stretched by the tireless herm, it would probably be gaping by now. The last thing you remember before you drift off is being pushed face-first into a very sticky pillow, Miranda’s massive cock drilling you feverously.", parse);
				Text.NL();
				Text.Add("Time passes…", parse);
				
				PrintDefaultOptions();
			}
			else if(player.sexlevel < 6) {
				Text.Add("You’re a bit winded, but not about to turn down more sex with the wild guardswoman. The two of you dive into an unrestrained bout of passion, going at each other like animals. ", parse);
				if(nasty)
					Text.Add("Despite her usually derogatory way of talking to you, Miranda is almost loving; rough, yes, but delighted at being able to fuck someone with a sexdrive matching her own.", parse);
				else
					Text.Add("Your rampant romp is in danger of wrecking Miranda’s bed, though it seems to be made of sturdy stuff. The horny doberman showers you with kisses as she goes down on you, showing her love in her own, rough way.", parse);
				Text.NL();
				parse["l"] = player.LowerBodyType() != LowerBodyType.Humanoid ? ", taking full advantage of your rather strange physique" : "";
				Text.Add("The two of you go through a series of largely improvised positions[l]. You lost count of how many times you climax, only pausing in your fervent love making while waiting for Miranda’s knot to deflate.", parse);
				if(player.FirstCock()) {
					parse["nice"] = !nasty ? Text.Parse(", even taking a ride on [itThem] once", parse) : "";
					Text.Add(" So as not to leave your [multiCockDesc] unattended, the dogmorph gives [itThem] some attention with her tongue[nice].", parse);
				}
				if(player.FirstVag()) {
					Text.Add("In order to relieve your aching [vagDesc], the dogmorph stuffs some of her toys into the wet cleft. She casually mentions that she’s going to use that hole instead next time, since you’re whimpering so much about it.", parse);
				}
				Text.NL();
				
				Sex.Anal(miranda, player);
				player.FuckAnal(player.Butt(), miranda.FirstCock(), 3);
				miranda.Fuck(miranda.FirstCock(), 3);
				
				miranda.OrgasmCum();
				player.OrgasmCum(3);
				
				Text.Add("<i>“Mm… you’ve got quite the stamina, [lover],”</i> the guardswoman purrs, hugging you tightly as she humps you. <i>“I think I’ll keep you.”</i> It’s several more hours before your coitus finally teter off, and both of you collapse from exhaustion in a sticky heap.", parse);
				
				PrintDefaultOptions();
			}
			else { // high sexp
				Text.Add("In response, you wrap your arms around her, pulling her into a tight embrace. If she looks a little surprised at your reaction, it’s nothing compared to when you flex your trained muscles, clamping down on her cock. ", parse);
				if(nasty)
					Text.Add("<i>“Woah, you sure got a slutty ass, [playername]! Can’t wait to get fucked, can you?”</i>", parse);
				else
					Text.Add("<i>“Oh!”</i> she exclaims. <i>“So eager! Can’t wait to have me pour another load in you?”</i>", parse);
				Text.Add(" Rather than waste more time on idle conversation, you urge her to get started, undulating your hips urgently.", parse);
				Text.NL();
				Text.Add("Now that she’s really gotten you going, you are an inexhaustible sex machine, moaning loudly as she slams her hips against yours. You grind your ass back against her, forcibly impaling yourself on her crimson rod. Miranda bites her lip, suddenly looking very focused. When she shows signs of slowing down, you wheel around hopping up on top of her and letting gravity do the work. The dobie cries out as you sink down, her knot slamming home in your overstuffed rectum. You are rewarded with another stomachful of dog seed, further bloating your already swollen belly.", parse);
				Text.NL();
				
				miranda.OrgasmCum();
				
				Text.Add("<i>“Ah, I haven’t cum like that in <b>days</b>,”</i> she pants, trembling as she collapses on her back. Still not satisfied, you start to roll your [hipsDesc], using her massive knot to stimulate you ass. <i>“H-hold on,”</i> she gasps, feeling the situation spiralling out of her control. <i>“I haven’t- Ah!”</i>", parse);
				Text.NL();
				Text.Add("Gyrating your hips wildly, you somehow manage to pull her knot loose again; only to slam yourself back down on it immediately. The guardswoman’s lubricating cum overflowing from your used hole makes the task way easier, but it’s still quite a feat. Using the prone dogmorph like a sex toy, you push yourself toward your second climax, clenching down on her cock like a vice.", parse);
				if(player.FirstCock())
					Text.Add(" Your own [multiCockDesc] throw[notS] out jets of pearly white cum, landing on your lover’s tits.", parse);
				if(player.FirstVag())
					Text.Add(" Your [vagDesc] constricts, squirting your clear juices onto Miranda’s stomach. Though you’ve come twice, it’s still aching - almost painfully so at this point. You <i>need</i> to be filled!", parse);
				Text.NL();
				
				Sex.Anal(miranda, player);
				player.FuckAnal(player.Butt(), miranda.FirstCock(), 2);
				miranda.Fuck(miranda.FirstCock(), 2);
				
				player.OrgasmCum(3);
				
				Text.Add("<i>“Wow, fuck!”</i> Miranda exclaims, tracing a shaking finger down your side. <i>“G-gimme a minute, okay?”</i> You pout a bit, but settle down, waiting for her to recover. Once the dobie gets going again, you do your best to milk her of as much cum as you can, using every technique you know to expertly drain her balls dry. In the end, the experienced herm is unable to keep up with you, reduced to a whimpering heap.", parse);
				Text.NL();
				Text.Add("You aren’t entirely sure how much time has passed, but you’ve probably been at it for at least a few hours… but you need more, and as you feel her overworked member soften inside your ass, you come to the frustrating realization that perhaps she’ll be unable to give you what you crave. She looks like she’s on the verge of passing out.", parse);
				Text.NL();
				Text.Add("What do you do?", parse);
				Text.Flush();
				
				//[Toys][Shower][Reversal]
				var options = new Array();
				options.push({ nameStr : "Toys",
					func : function() {
						Text.Clear();
						Text.Add("You make a token effort to rouse the exhausted herm, but it looks like you’ve outlasted her. Growling in frustration, your gaze wanders… falling on Miranda’s rather impressive collection of toys. A slow smile spreads on your lips.", parse);
						Text.NL();
						Text.Add("You flop off her, releasing a cascade of cum from countless orgasms as her knot is forcibly dislodged from your aching hole. The dobie moans, stirring weakly, but resigns to just watching you while she recovers. Through a haze of feverish lust, you single out a large dildo with a flared base. The thing is at least the size of Miranda’s impressive member, a fat slab of artificial cock just begging to be inside you.", parse);
						Text.NL();
						Text.Add("Considering just how much cum the herm pumped into you, there is hardly any need for lube; you just sink down on the massive toy, shuddering as you are once again filled to the brim.", parse);
						if(player.FirstCock())
							Text.Add(" Your [multiCockDesc] jump as the thick rod squeezes your prostate, eager to blow [itsTheir] final load.", parse);
						if(player.FirstVag())
							Text.Add(" Why stop at one when there is so many to choose from, though? Your [vagDesc] can no longer endure being left alone, and you shake as you grab onto another thick dildo, jamming it into your remaining orifice.", parse);
						Text.NL();
						parse["s"] = player.FirstVag() ? "s" : "";
						Text.Add("<i>“Wow… you are still going at it? You’re such a slut!”</i> Miranda exclaims, though from her tone, she meant it as a compliment rather than an insult. Flopping over on your side, you give her a show, thrusting the toy[s] into your hole[s] as rapidly as you can. Already, you feel your last, greatest climax building. You look up in a daze as the guardswoman crawls over to you, grabbing the base of the dildo firmly.", parse);
						Text.NL();
						parse["nasty"] = nasty ? ", suddenly acting uncharacteristically nice" : "";
						Text.Add("<i>“Here, let me… it’s the least I can do for you,”</i> she murmurs[nasty]. Even drained as she is, the herm can muster quite a bit of strength in her arms, and drills you even harder than you could yourself.", parse);
						if(player.FirstVag())
							Text.Add(" Biting your lip, you set to ramming your remaining toy into your [vagDesc], pushing it as deep as it will go.", parse);
						Text.NL();
						Text.Add("In relatively short order, you are a moaning mess - more so than you were before. Miranda doesn’t let up though, not that you would want her to. In a final feverish push, she throws you over the edge, shooting lightning down your spine as your entire body convulses.", parse);
						Text.NL();
						
						player.AddSexExp(3);
						
						player.OrgasmCum();
						
						Text.Add("The two of you collapse in a pile of your combined sexual fluids, too exhausted to even move.", parse);
						
						miranda.relation.IncreaseStat(75, 1);
						
						PrintDefaultOptions();
					}, enabled : true,
					tooltip : "Make use of some of her toys laying about in order to get off."
				});
				
				if(player.FirstCock()) {
					options.push({ nameStr : "Blowjob",
						func : function() {
							
							var p1Cock = player.BiggestCock();
							parse["cockDesc"] = function() { return p1Cock.Short(); }
							parse["cockTip"] = function() { return p1Cock.TipShort(); }
							
							Text.Clear();
							Text.Add("Damnit, you are so close, why can’t she get you off? This is all her fault, getting you worked up like that and not following through on it… she deserves to get punished for this. ", parse);
							if(nasty || dom > 25)
								Text.Add("You bite your lip uncertainly. Do you dare? Finally, your lust overrides your reason, though you fear that this may have repercussions for you later.", parse);
							else
								Text.Add("This has been a nice little game, but you need some action too, and the dommy dobie better just up and accept it.", parse);
							Text.NL();
							Text.Add("Wincing slightly as you dislodge Miranda’s knot from your rectum, you shift your body above her, a massive amount of cum gushing out from your gaping anus and splashing onto her furred stomach. Huffing, you present the herm with your [multiCockDesc].", parse);
							Text.NL();
							if(nasty) {
								Text.Add("<i>“You sly little bitch...”</i> Miranda grunts, averting her gaze when you grind your shaft[s] between her breasts. <i>“Fine,”</i> she mutters, grasping hold of [itThem]. <i>“I’ll get you off if it’ll get you out of my face, okay?”</i>", parse);
								Text.NL();
								Text.Add("...Huh. She sure agreed to that quickly enough.", parse);
							}
							else {
								Text.Add("<i>“Fuck… you are still hard,”</i> Miranda pouts. You detect a faint hint of… jealousy? Either way, it looks like she grasps the situation… and your cock[s].", parse);
							}
							Text.NL();
							Text.Add("A shiver runs down your body as Miranda’s tongue licks at the [cockTip] of[oneof] your dick[s], lapping up the cream from one of your myriad of previous orgasms. The guardswoman seems to have a little give in her, not just all take. Perhaps your performance convinced her to return the favor.", parse);
							Text.NL();
							
							Sex.Blowjob(miranda, player);
							miranda.FuckOral(miranda.Mouth(), player.FirstCock(), 2);
							player.Fuck(player.FirstCock(), 2);
							
							Text.Add("You sigh in pleasure as the dobie’s lips close around your cock, her tongue playing along its underside. Even though she’s usually all about being on top, this is clearly not the first dick she’s sucked, not by far. Getting your ass pounded by her for hours was pure bliss, and this blowjob is the perfect cherry on top. Even if you had the energy to do so, you wouldn’t for a second resist the surge of orgasmic heat rising in your loins.", parse);
							if(player.HasBalls())
								Text.Add(" Your [ballsDesc] are aching, but it feels like they are up for a final mission.", parse);
							Text.NL();
							
							var cum = player.OrgasmCum();
							
							parse["cum"] = cum < 3 ? "shooting" :
							               cum < 6 ? "pouring" : "gushing";
							Text.Add("Burying your [cockDesc] deep inside Miranda’s muzzle, you let your seed spill forth, [cum] down the herm’s throat. At first she looks surprised, but she nonetheless dutifully gulps it down.", parse);
							if(player.NumCocks() > 1) {
								var allCocks = player.AllCocksCopy();
								for(var i = 0; i < allCocks.length; i++) {
									if(allCocks[i] == p1Cock) {
										allCocks.remove(i);
										break;
									}
								}
								
								parse["multiCockDesc2"] = function() { return player.MultiCockDesc(allCocks); };
								parse["s2"] = allCocks.length > 1 ? "s" : "";
								parse["notS2"] = allCocks.length > 1 ? "" : "s";
								parse["itsTheir2"] = allCocks.length > 1 ? "their" : "its";
								
								Text.Add(" Your other [multiCockDesc2] spurt[notS2] [itsTheir2] load[s2] all over her face and hair, painting as her white as the inside of your bloated tummy.", parse);
							}
							Text.NL();
							Text.Add("Spent, you collapse beside her on the bed, the two of you cuddling together in a pool of your seminal fluids.", parse);
							
							miranda.relation.DecreaseStat(-75, 1);
							player.subDom.IncreaseStat(75, 1);
							
							PrintDefaultOptions();
						}, enabled : true,
						tooltip : "Take advantage of the situation and get a blowjob from Miranda. After all, she’s used you plenty, it’s only fair, right?"
					});
				}
				
				if(player.FirstCock() || player.Strapon()) {
					var cocksInAss = player.CocksThatFit(miranda.Butt(), false, 15);
					var p1Cock = player.BiggestCock(cocksInAss);
					
					parse["cockDesc"] = function() { return p1Cock.Short(); }
					
					options.push({ nameStr : "Reversal",
						func : function() {
							Text.Clear();
							Text.Add("You moan desperately, but you’ve thoroughly wrung out the dobie, you probably shouldn’t be expecting more action from her for a few hours… unless you want to turn the tables on her. ", parse);
							if(nasty || dom > 25)
								Text.Add("This is probably a <i>really</i> bad idea, and no doubt she’ll get back at you tenfold later… but your lust overrules your common sense and kicks it out the door. Time to turn the tables, and damn the consequences!", parse);
							else
								Text.Add("She’s already had her fun… now it’s your turn. This is give and take, after all, and you plan to take.", parse);
							Text.NL();
							if(p1Cock.isStrapon)
								Text.Add("Sliding off Miranda’s softening cock, you reach down for your pack, retrieving your [cockDesc]. The herm’s eyes slowly widen in dazed shock as you methodically strap it to your crotch, securing it tightly.", parse);
							else
								Text.Add("Sliding off Miranda’s softening cock, you make a great show off stroking your own [multiCockDesc], gazing down at her through eyes clouded with lust. If she doesn’t get what you’re planning to do, she’s sure to in just a moment.", parse);
							Text.NL();
							Text.Add("You coyly complain that it’s hardly fair for you to have all the fun… shouldn’t she get to have a good time too? ", parse);
							if(nasty)
								Text.Add("<i>“W-what? Why you little- ngh!”</i> she stutters, breaking off into a weak moan as you squeeze one of her tits. It doesn’t take much coaxing to convince her. Her eyes are drilling holes in the back of your head, but she’s not complaining anymore; in fact, she actually spreads her legs slightly. Let her keep up her theatrics, but you both know that she wants this as much as you do.", parse);
							else
								Text.Add("<i>“Fuck… taking advantage of me while I’m down huh,”</i> Miranda huffs grumpily. <i>“Fiiine, if it’ll get you off my ass.”</i> Yes, you’ll get her ass off, you assure her. <i>“Uh...”</i>", parse);
							Text.NL();
							Text.Add("Not wishing to waste any more time, you place[oneof] your [multiCockDesc] at the panting herm’s backdoor. You’re going to pay her back in plenty for the last few hours… and claim your own reward. Using some of her own cum from her slick member, you lube yourself up and thrust forward. ", parse);
							if(player.NumCocks() > 1) {
								parse["anotheroneof"] = player.NumCocks() > 2 ? " another one of" : "";
								parse["other"] = player.NumCocks() > 2 ? "" : " other";
								parse["s"] = player.NumCocks() > 2 ? "s" : "";
								Text.Add("Fuck it, if you are going to defy her, might as well go all the way. Pausing briefly, you line up[anotheroneof] your[other] cock[s] with her pussy, double-penetrating the dommy dobie.", parse);
								Sex.Vaginal(player, miranda);
								miranda.FuckVag(miranda.FirstVag(), player.FirstCock(), 2);
								player.Fuck(player.FirstCock(), 2);
							}
							else {
								Text.Add("You grab some of the toys scattered around and use them to tease the dommy dobie’s nether lips, finding that her hungry twat almost sucks them up. In short order, you have a thick dildo hilted in her gushing cunt.", parse);
								player.AddSexExp(2);
							}
							
							Sex.Anal(player, miranda);
							miranda.FuckAnal(miranda.Butt(), player.FirstCock(), 2);
							player.Fuck(player.FirstCock(), 2);
							
							Text.NL();
							if(dom > 25)
								Text.Add("<i>“You… cocky, fucking, bastard!”</i> she grunts in time with your thrusts. <i>“I’ll, get, you, back for this… if you don’t make me cum soon!”</i>", parse);
							else if(dom > -25)
								Text.Add("<i>“Mm… good, there’s still some fire left in you!”</i> she huffs, grinning at you. <i>“Just a bit more… ngh!”</i>", parse);
							else
								Text.Add("<i>“Yeah, give it to me, [masterMistress]!”</i> she moans unabashedly, gyrating her hips in order to meet your thrusts. <i>“Punish your little disobedient bitch!”</i>", parse);
							Text.NL();
							Text.Add("After a while, you filter out her voice and only listen to her body. In the language of rough sex, it’s screaming ‘fuck me!’ out loud, her hips grinding against yours and her legs wrapping tightly around your waist. You are only too happy to comply. With one final burst of energy, you push toward a mutual climax, rutting wildly into the guardswoman.", parse);
							Text.NL();
							
							miranda.OrgasmCum();
							var cum = player.OrgasmCum();
							
							Text.Add("It’s not long before Miranda ass clenches around your [cockDesc], and your vision goes white. You’re seeing stars - and the massive load she just shot in your face probably contributed too. Another blast shoots past, barely missing you. From the force behind it, it probably hit the ceiling. ", parse);
							if(p1Cock.isStrapon)
								Text.Add("Just a second behind her, you cry out in unison as the base of your toy grinds back against you, triggering your own orgasm.", parse);
							else {
								parse["cum"] = cum > 6 ? "fountains" :
								               cum > 3 ? "gushes" : "shoots";
								parse["cum2"] = cum > 3 ? ", swelling her stomach to the point where she looks pregnant" : "";
								Text.Add("The herm milks your [cockDesc] for all she’s worth, hungrily eating up your cum as it [cum] into her bowels[cum2].", parse);
							}
							Text.NL();
							Text.Add("Totally spent, the two of you collapse in each other’s arms.", parse);
							
							miranda.subDom.DecreaseStat(-75, 1);
							player.relation.IncreaseStat(75, 1);
							
							PrintDefaultOptions();
						}, enabled : p1Cock,
						tooltip : "Now is the perfect opportunity to get back at the dobie! Have a go at <i>her</i> ass for a while, and stuff a few toys in her pussy for good measure."
					});
				}
				Gui.SetButtonsFromList(options, false, null);
			}
		});
	}, "Rough", "Beg her to give it to you rough!");
}

Scenes.Miranda.HomeDommyDungeonFirst = function() {
	
	var parse = {
		
	};
	
	party.location = world.loc.Rigard.Residental.mDungeon;
	
	Text.NL();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	
	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.Rigard.Slums.gate);
	});
}

Scenes.Miranda.HomeDommyDungeon = function() {
	
	var parse = {
		
	};
	
	party.location = world.loc.Rigard.Residental.mDungeon;
	
	Text.NL();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	
	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.Rigard.Slums.gate);
	});
}

Scenes.Miranda.HomeSubbyDungeon = function() {
	
	var parse = {
		
	};
	
	party.location = world.loc.Rigard.Residental.mDungeon;
	
	Text.NL();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	
	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.Rigard.Slums.gate);
	});
}

Scenes.Miranda.TavernSexPrompt = function() {
	var parse = {
		
	};
	
	//[name]
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
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Miranda.TavernSexBackroomPrompt = function() {
	var parse = {
		playername : player.name,
		armorDesc  : function() { return player.ArmorDesc(); },
		tongueDesc : function() { return player.TongueDesc(); }
	};
	
	var dom = player.SubDom() - miranda.SubDom();
	
	Text.Clear();
	if(miranda.Attitude() > Miranda.Attitude.Neutral) {
		if(dom > 25)
			Text.Add("<i>“Feel like using your favorite chewing toy, huh? Let’s go then,”</i> Miranda says, getting up and shaking her butt teasingly at you as she walks towards the backrooms.", parse);
		else
			Text.Add("<i>“Sounds like a nice idea, come on,”</i> she says, patting your back and pushing you towards the backrooms. Grinding against your back so you can feel her hardening shaft.", parse);
	}
	else
		Text.Add("<i>“Can’t get enough of little Miranda, can you? Not a problem, I can accommodate.”</i> Miranda promptly hauls you off your seat and takes you to the back rooms.", parse);
	Text.Add(" Selecting an empty room, Miranda leads you inside and steps away, allowing you to close the door. Since there's no lock, you make do and grab a nearby chair, barricading the door as an impromptu privacy measure.", parse);
	if(miranda.Attitude() >= Miranda.Attitude.Neutral) {
		parse["m"] = dom > 50 ? player.mfTrue(", master", ", mistress") : "";
		Text.Add(" <i>“Well, here we are, so what now[m]?”</i>", parse);
		Text.Flush();
		
		var cocksInVag = player.CocksThatFit(miranda.FirstVag(), false, 15);
		
		//[BlowHer][TakeHer]
		var options = new Array();
		options.push({ nameStr : "Blow her",
			func : function() {
				Text.Clear();
				if(dom > 0)
					Text.Add("With a smirk, you tell her to strip down; you feel like a little protein in your diet.", parse);
				else
					Text.Add("You cast a hungry look towards her loins, lewdly sticking out your tongue and curling it in invitation, body language more than enough to convey your intentions.", parse);
				Text.Add(" You move to remove your [armorDesc], tossing it aside onto the table and then sauntering over to a cushioned corner of the room. As you adopt a kneeling position there, perfectly placed to let the fun begin, you watch Miranda eagerly yanking off her own gear, scattering it nonchalantly over the room even as she strides forward to stand before you, erection bobbing up and down.", parse);
				Text.NL();
				
				Scenes.Miranda.TavernSexDommyBJ();
			}, enabled : true,
			tooltip : "Give Miranda a blowjob."
		});
		options.push({ nameStr : "Take her",
			func : function() {
				Text.Clear();
				Text.Add("With a hungry smile, you close the distance between the two of you and cup Miranda's chin, pulling her into a passionate kiss, feeding the eager morph your [tongueDesc]. Pleasantly your tongues wrestle for several moments as your arms pull the pair of you together, letting you feel her erection grinding against you.", parse);
				Text.NL();
				Text.Add("After whetting your appetite, you break the kiss and reach down to cup her tent, fondling her drooling doggy-dick through her pants and telling her that you want her out of her clothes; you can't properly appreciate that pretty rump of hers while she's all dressed up.", parse);
				Text.NL();
				
				Scenes.Miranda.TavernSexBackroomSubbyVag(cocksInVag);
			}, enabled : cocksInVag.length > 0,
			tooltip : "Fuck the herm."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	// TODO: Variations for dommy sex (other scenes)
	else { // nasty
		Text.Add("<i>“Alright, slut. Strip up and get on your knees. Little Miranda wants a kiss.”</i>", parse);
		Text.NL();
		if(player.SubDom() > 0)
			Text.Add("...Does she really need to keep calling you a slut? How much dick do you need to suck before she'll forgive you? Still, you'd be lying if you said the thought was unattractive...", parse);
		else
			Text.Add("As always, your mistress's harsh words and strong demeanour wash over you, filling you with a heady, intoxicating mixture of shame and lust and desire. Stealing a glance at her bulging pants, swearing you can actually see her cock throbbing through the fabric, you lick your lips, unconsciously nodding in response.", parse);
		Text.NL();
		Text.Add("Without ceremony, moving quickly to keep Miranda in a good mood, you cast off your [armorDesc] and kneel upon a cushion over in the corner; you have a feeling you'll need it. In contrast to your haste, Miranda strips herself off with deceptively leisurely motions, her seeming indifference belied by the redness of her drooling cock as she stalks towards you.", parse);
		Text.NL();
		
		Scenes.Miranda.TavernSexDommyBJ();
	}
}

Scenes.Miranda.TavernSexBackroomSubbyVag = function(cocks) {
	var p1Cock = player.BiggestCock(cocks);
	var parse = {
		playername : player.name,
		cockDesc   : function() { return p1Cock.Short(); }
	};
	
	var knotted = p1Cock.knot != 0;
	
	var cum = Scenes.Miranda.TavernSexSubbyVag(cocks);
	var dom = player.SubDom() - miranda.SubDom();
	
	parse["masterMistress"] = player.mfTrue("master", "mistress");
	
	Text.NL();
	if(knotted) {
		Text.Add("When it’s finally over you can’t help but crash down atop the dog-morph herm. She groans, both with the pleasure of release and with your weight", parse);
		if(cum > 3) {
			parse["cum"] = cum > 9 ? "pregnant-like belly" :
			               cum > 6 ? "rounded tummy" :
			               "paunch";
			Text.Add(", not to mention the [cum] you gave her", parse);
		}
		Text.Add(". The two of you pant in unison, until Miranda finally breaks the silence.", parse);
		Text.NL();
		if(dom > 50) {
			Text.Add("<i>“Used and tied like a bitch,”</i> she groans. <i>“We should do that more often,”</i> she chuckles.", parse);
			if(cum > 3)
				Text.Add(" <i>“But damn, you really packed me full,”</i> she rubs her belly.", parse);
			Text.Add(" <i>“I guess no one is going to question my ownership after this one.”</i>", parse);
			Text.NL();
			parse["swollen"] = cum > 3 ? " swollen" : "";
			Text.Add("They most certainly aren't, you declare, and pat her[swollen] stomach possessively for emphasis.", parse);
			Text.NL();
			Text.Add("Miranda clenches around you, drawing a groan and a bit more of cum from you. <i>“Hey, I felt that. You’re not holding out on me are you, [masterMistress]?”</i>", parse);
			Text.NL();
			Text.Add("Certainly not, you assure her, you gave her everything you could give her. That's just a little something that slipped your notice.", parse);
			Text.NL();
			Text.Add("The doberherm chuckles at your statement. <i>“That better be so, cuz knot or no knot, you’re not going anywhere till your balls are drained dry,”</i> she clenches again for emphasis.", parse);
			Text.NL();
			Text.Add("Your whole body shudders in response. That's nothing less than what you'd expect of Miranda, you tell her.", parse);
		}
		else if(dom < -25) {
			Text.Add("<i>“Hmm, if anyone told me getting tied with a fat knot was good before, I’d have laughed them off, but I do say this feels great. You’re really stretching me up here, [playername].”</i>", parse);
			Text.NL();
			if(player.SubDom() > 0)
				Text.Add("Grinning to yourself at her statement, you give her thigh an affectionate pat and tell her that you always knew she'd like it if she gave it a chance.", parse);
			else
				Text.Add("Affectionately, you kiss the back of her neck and scratch the base of her ears, telling her how happy you are to make her feel good like this. It sure feels good to catch on occasion, now doesn't it?", parse);
			Text.NL();
			Text.Add("<i>“Hey, don’t get cocky now. I could always introduce <b>you</b> to <b>my</b> knot.”</i>", parse);
			Text.NL();
			Text.Add("She most certainly could do that... but not for a while, you note, shifting your hips to wriggle your swollen knot for emphasis, making her moan as the fleshy bulb tugs at her interior, but refuses to give even an inch.", parse);
			Text.NL();
			Text.Add("<i>“Lucky you,”</i> she comments with a grin.", parse);
		}
		else {
			Text.Add("Miranda sighs, <i>“I must say that I’m not used to being the one getting knotted.”</i>", parse);
			Text.NL();
			if(player.SubDom() > 0) {
				Text.Add("Well, a change is good for her, you quip. Besides, she's not really going to say she's not liking this, is she? Because you can feel the way she's clamping down, grinding your knot between her walls, and you know her body's just loving having this thick piece of meat stretching it out.", parse);
				Text.NL();
				parse["muffAss"] = player.FirstVag() ? "muff" : "ass";
				Text.Add("<i>“Fancy choice of words, [playername]. Don’t get used to this. Next time it might as well as be my knot up your [muffAss].”</i>", parse);
			}
			else {
				Text.Add("You ask her if it's really all that bad to have you tied to her like this, to having you pinned inside of her and at her mercy until your own flesh lets you go.", parse);
				Text.NL();
				Text.Add("<i>“Bad? No, I don’t think it’s bad. But I’d prefer to be the one doing the tying.”</i>", parse);
			}
			Text.Add(" You tell her that you'll keep that in mind, then nestle yourself against her, making yourself comfortable for the duration.", parse);
		}
		Text.NL();
		Text.Add("It takes the better part of an hour before you’ve finally shrunken enough to pull out of Miranda’s used cunt. A small stream of seed following after your cock as you withdraw with a wet squelch.", parse);
		Text.NL();
		Text.Add("<i>“Shit, now I feel empty.”</i>", parse);
		Text.NL();
		Text.Add("Well, if ever she decides she'd like to feel full again, you're certainly available to fill her up, you reply.", parse);
		
		world.TimeStep({minute: 40});
	}
	else {
		Text.Add("Miranda sighs in pleasure as she lays down on the cushions below. <i>“You really know how to treat a lady, [playername],”</i> she grins.", parse);
		Text.NL();
		if(dom > 50) {
			Text.Add("<i>“Like a cheap sex toy,”</i> she adds.", parse);
			Text.NL();
			Text.Add("Just how she loves being treated, you quip back, playfully tussling her ears for emphasis.", parse);
			Text.NL();
			Text.Add("<i>“Only by you, [masterMistress],”</i> she quips back. <i>“You should come use me more often. It’s kinda hard to go back to using dildos after tasting your [cockDesc].”</i>", parse);
			Text.NL();
			Text.Add("Your Miranda has gotten quite spoiled, hasn't she? Still, you tell her that you'll think about it...", parse);
		}
		else if(dom > -25) {
			Text.Add("<i>“My pussy’s gotten quite the workout, we should do this more.”</i>", parse);
			Text.NL();
			Text.Add("Well, you're certainly willing whenever she is, you reply.", parse);
		}
		else {
			Text.Add("<i>“Can’t say I’m used to not being in control, but it did feel nice. I wouldn’t be against a second round.”</i>", parse);
			Text.NL();
			Text.Add("Neither would you, you promptly respond.", parse);
		}
	}
	Text.NL();
	if     (party.Num() == 2) parse["comp"] = " gather your companion and";
	else if(party.Num() >  1) parse["comp"] = " gather your companions and";
	else                      parse["comp"] = "";
	Text.Add("Once the two of you are recovered from your recent exertions, you clean up the mess you made as best you can, then get back into your respective gear. Miranda casually unblocks the door and the two of you head back out into the bar. There, you[comp] say goodbye to the dober-morph before leaving her to resume her drinking.", parse);
	Text.Flush();
	Gui.NextPrompt();
}

Scenes.Miranda.TavernSexSubbyVag = function(cocks) {
	var p1Cock = player.BiggestCock(cocks);
	var allCocks = player.AllCocksCopy();
	for(var i = 0; i < allCocks.length; i++) {
		if(allCocks[i] == p1Cock) {
			allCocks.remove(i);
			break;
		}
	}
	
	var parse = {
		playername     : player.name,
		lordLady       : player.mfTrue("lord", "lady"),
		masterMistress : player.mfTrue("master", "mistress"),
		hairDesc       : function() { return player.Hair().Short(); },
		earDesc        : function() { return player.EarDesc(); },
		armorDesc      : function() { return player.ArmorDesc(); },
		buttDesc       : function() { return player.Butt().Short(); },
		anusDesc       : function() { return player.Butt().AnalShort(); },
		vagDesc        : function() { return player.FirstVag().Short(); },
		legsDesc       : function() { return player.LegsDesc(); },
		thighsDesc     : function() { return player.ThighsDesc(); },
		multiCockDesc  : function() { return player.MultiCockDesc(); },
		multiCockDesc2 : function() { return player.MultiCockDesc(allCocks); },
		cockDesc       : function() { return p1Cock.Short(); },
		cockTip        : function() { return p1Cock.TipShort(); },
		ballsDesc      : function() { return player.BallsDesc(); },
		breastDesc     : function() { return player.FirstBreastRow().Short(); },
		s              : player.NumCocks() > 1 ? "s" : "",
		notS           : player.NumCocks() > 1 ? "" : "s",
		oneof          : player.NumCocks() > 1 ? " one of" : "",
		itThem         : player.NumCocks() > 1 ? "them" : "it",
		itsTheir       : player.NumCocks() > 1 ? "their" : "its",
		mcockDesc      : function() { return miranda.FirstCock().Short(); }
	};
	
	var dom = player.SubDom() - miranda.SubDom();
	
	if(dom > 25) {
		miranda.relation.IncreaseStat(50, 1);
		miranda.subDom.DecreaseStat(-75, 2);
		player.subDom.IncreaseStat(75, 1);
		
		Text.Add("<i>“Pretty rump, huh? If that’s your wish I’ll gladly show you my ‘pretty rump’.”</i> Slowly she removes her leather pants. First she lets you catch a glimpse of her [mcockDesc], already rock hard from your earlier foreplay, but you don’t get to see much of it. Miranda rolls around, deliberately getting on all fours and raising her butt so you can see it being uncovered in all its glory. Her stubby tail wags as her leather pants fall to her knees, a pair of hands moving back to play with her buttcheeks. Her doggy snatch is already sopping wet, making her enjoyment crystal clear as she says, <i>“My pretty rump, as requested, my [lordLady],”</i> she says with a chuckle, clearly enjoying herself.", parse);
		Text.NL();
		Text.Add("Now that's an invitation you wouldn't dream of not accepting. In a few brisk motions you have covered the distance separating the pair of you, your hands reaching out to fondle her ass. Lecherously you stroke the firmly toned, delightfully rounded cheeks, your own arousal growing with each motion. Playfully, you swipe at her buttocks with the palms of your hands, mock-spanking her in order to feel the firmness under your hands, as well as eliciting a few moans from the dog-morph.", parse);
		Text.NL();
		Text.Add("With sincerity in your voice, you praise her for the hard work she must put into keeping her ass in such fine shape. Such efforts deserve a proper reward... once she's finished undressing, that is. Before she can make any movement to comply, though, you impatiently seize the leather pants hanging around her knees and pull down and out, all but tugging her legs out from under her as you roughly rip the garment free. As soon as her legs are out of it, you toss it carelessly aside, your attention fixated on the shapely rump before you.", parse);
		Text.NL();
		Text.Add("Roughly you pull her ass up against your crotch, letting her feel your [cockDesc] as it rubs and grinds through the canyon of her buttock cleavage, your own hands already moving to her studded leather top. Impatiently you pull at it, anxious to rid her off the unnecessary garment, and finally you manage to pull it free and hurl it aside to join her leather pants. Still hotdogging her ass, you hoist her back against your [breastDesc], letting her feel  your body pressed against hers even as your hands reach around her front and clutch at her tits. The large, rounded orbs squish most enticingly under your fingers, further spurring you to grope and squeeze. From the rumbling groan that vibrates against your chest, and the way Miranda's nipples pebble under your palms, she's enjoying your ministrations almost as much as you are.", parse);
		Text.NL();
		Text.Add("<i>“Ohm, that’s great but I’m hungry for something else, something meatier.”</i> She grinds back against you. <i>“You’re not thinking of making poor Miranda beg, are you?”</i> she playfully teases.", parse);
		Text.NL();
		parse["juicy"] = p1Cock.isStrapon ? " juicy" : "";
		Text.Add("Well, now that she mentions it... Your fingers reach for her pleasure-stiffened nipples, pinching them between forefinger and thumb and twisting them with purposeful motions, drawing a throaty moan from the dog-morph. With a smile on your lips, you lean closer to her doberman-like ears and croon into them, asking her who's a good little slut-puppy. Miranda wriggles against you, biting her lip and refusing to answer, but you don't let that stop you. Instead, you assure her in delight that she's a good slut-puppy, before asking if the horny bitch wants herself a nice[juicy] [cockDesc] treat.", parse);
		Text.NL();
		Text.Add("Whatever reservations she’s had about admitting her enjoyment of your teases disappears at the promise of a treat. She grinds back, panting as she declares, <i>“Oh yes! Miranda wants her treat! Please, please give me my treat, pleeeeease?”</i> she intones with a whine.", parse);
		Text.NL();
		Text.Add("Well, if she insists... Holding onto her breasts for support, you slide your hips back to line up your [cockTip] with her womanhood and then push forward. ", parse);
		if(miranda.sex.rVag == 0)
			Text.Add("The dober-morph's pussy is surprisingly tight, making you fight to make any headway inside of her, slowly wrapping her warm wet folds around your [cockDesc].", parse);
		else
			Text.Add("Miranda is as hot and as tight as ever, but you know how to squeeze your way inside of her.", parse);
	}
	else if(dom > -25) {
		miranda.relation.IncreaseStat(40, 1);
		miranda.subDom.DecreaseStat(-50, 1);
		player.subDom.IncreaseStat(50, 1);
		
		Text.Add("<i>“You have a point. Wouldn’t want to get anything on my armor,”</i> she grins. Without further ado she sets about undressing herself. First she discards her studded leather top, exposing her large mammaries for your viewing pleasure. You don’t have long to linger though as she kicks her leather pants off, showing off her rock hard [mcockDesc]. When she catches you looking she immediately remarks, <i>“See something you like?</i>", parse);
		Text.NL();
		Text.Add("You most certainly do, but today you have something else in mind. Without hesitating, your hand shoots out and latches onto the proudly bobbing doggy-dick jutting from her loins; not hard enough to hurt her, but hard enough that she won't try anything while you have hold of it. Ignoring Miranda's yelp of surprise, you concentrate on feeling the lust engorged flesh throbbing warmly under your fingers, and you use it like a makeshift handle. With a strong tug, you encourage her to spin around and present her back to you, whereupon you release her cock and push her over onto all fours.", parse);
		Text.NL();
		Text.Add("Before she can think to push back against you, you straddle her, nestling your [cockDesc] right on her butt-cleavage and draping yourself across her back, hands reaching around her front to grope and maul at her tits. You hold yourself there, playing with the dober-herm's D-cups, grinding your [cockDesc] through her ass-cheeks with each thrust of your hips.", parse);
		Text.NL();
		Text.Add("<i>“Hey now, we never agreed on buttsex! Especially with me on the receiving end!”</i> she protests playfully.", parse);
		Text.NL();
		Text.Add("Well, isn't she lucky that you had something else in mind, then? Moving your hips back, you draw your [cockTip] down her asscrack, over her puckered ring and into alignment with her womanhood, then start pushing yourself into the hot, tight folds.", parse);
	}
	else {
		miranda.relation.IncreaseStat(40, 1);
		miranda.subDom.DecreaseStat(-30, 1);
		player.subDom.IncreaseStat(25, 1);
		
		Text.Add("<i>“You want it, come and get it,”</i> she says crossing her arms.", parse);
		Text.NL();
		Text.Add("Now that's certainly not going to discourage you. Crossing the distance between you, you reach out and remove her armor. Fortunately, though she doesn't outright help you in doing so, Miranda certainly doesn't fight you either. In fact, as your fingers dart quickly over her bosom, stealing lustful caresses of her nipples, then glide down over her stomach to goose her ass, you can see her smirking in amusement at your antics.", parse);
		Text.NL();
		Text.Add("Once the dog-morph is naked, you move around behind her and give her a sharp push, toppling her over onto all fours with a surprised grunt. Quickly you step in, hands moving down between her thighs and raising her rump up, positioning it so that it is jutting out towards you, perfect for a doggy-style fucking.", parse);
		Text.NL();
		Text.Add("Miranda's evidently caught onto your plans because she shifts slightly for better support, tail wagging lazily as she does so even as she cranes her neck to look at you over her shoulder.", parse);
		Text.NL();
		Text.Add("<i>“You’re lucky I like you. I wouldn’t let anyone else push me around like that. So you’d better satisfy me or I’m going to have to pay you back,”</i> she says, wiggling her butt.", parse);
		Text.NL();
		Text.Add("That, you reply, certainly isn't going to be a problem. You know just how to give her what she's craving.", parse);
		if(player.SubDom() > 25)
			Text.Add(" With a smirk on your face, you give her ass a quick spank for emphasis.", parse);
		Text.Add(" Wasting no time, you move to bring your [cockDesc] to bear, aligning it with her womanhood and thrusting forward. Hot, tight folds greet your [cockDesc], making you work to push yourself inside as far as you can.", parse);
	}
	Text.NL();
	
	Sex.Vaginal(player, miranda);
	miranda.FuckVag(miranda.FirstVag(), player.FirstCock(), 3);
	player.Fuck(player.FirstCock(), 3);
	
	Text.Add("<i>“Yes! Oh yeah!”</i> she moans, tongue lolling out as you fill her with your [cockDesc].", parse);
	if(player.NumCocks() > 1)
		Text.Add(" Your other [multiCockDesc2] poking and sliding against her full balls.", parse);
	else if(player.HasBalls())
	Text.Add(" Your [ballsDesc] smacking right into Miranda’s own, sending both of your sacks jiggling.", parse);
	Text.NL();
	Text.Add("You give her a moment to adjust to the feeling of your girth stretching her out, and then get down to the matter at hand. Resting your own weight atop her for support, you draw your hips back as far as you can, making your [cockDesc] almost pop free of her cunt, and then slam it back home as far and as hard as you can, rocking her whole body with the impact.", parse);
	Text.NL();
	Text.Add("Your hands close around her tits, cupping and squeezing, pinching at her nipples even as your hips saw back and forth, plunging and thrusting as you fuck her as hard and as fast as you can. All Miranda can do is moan and bark in delight as you fuck her silly. Her tongue’s lolling out, drooling on the cushions below as you ram her unlike she’s ever been reamed. <i>“Yeah. Just like tha- Oh!”</i> she cries out as you hit her g-spot. <i>“Fuck! Right there! Don’t you dare stop [playername]!”</i>", parse);
	Text.NL();
	Text.Add("You have no intention of stopping, and do your best to pick up the pace as you ream her cunt for all you're worth. Struck by a mischievous impulse, your hands abandon her tits, sliding down her belly towards her jutting foot-long cock. Sure enough, it's drooling worse than her tongue is, and you soon find your cupped hands filled with thick, musky Miranda-precum. As quickly as you can, you transfer your dripping hands back to her tits, massaging her own sex-juices into the fur as a makeshift lotion, your hands sliding nicely over the slickened bosom.", parse);
	Text.NL();
	var knotted = p1Cock.knot != 0;
	if(knotted && !p1Cock.isStrapon) {
		Text.Add("You can feel your [cockDesc] pulsing in need, the wave of approaching climax building to its crescendo inside of you. Emphatically you are aware of your knot bulging with blood, bloated and ready to plug a bitch's pussy as you fill her with your seed. The situation couldn't be more right. Acting on purest instinct, you jam your hips as hard against Miranda's as possible, gritting your teeth as you press the swelling knot against her tight cunny in an effort to force the bulging flesh inside.", parse);
		Text.NL();
		Text.Add("A literal bark of surprise echoes up from beneath you, but you barely register it, your entire being consumed on your need to cram your knot inside Miranda. With a hiss of exertion, you finally heave your way inside, the sensation of her cunt clamping down like a vice on your knot the last your crumbling will can stand. Throwing your head back, you cry out as the dam breaks and you flood her depths with your seed.", parse);
		Text.NL();
		Text.Add("The doberman underneath you howls in ecstasy, pussy clamping down hard on your [cockDesc] as Miranda reaches her climax. ", parse);
		if(allCocks.length > 0 || player.HasBalls()) {
			parse["c"] = allCocks.length > 0 ? player.MultiCockDesc() : "";
			parse["and"] = (allCocks.length > 0 && player.HasBalls()) ? " and " : "";
			parse["balls"] = player.HasBalls() ? player.BallsDesc() : "";
			Text.Add("You can feel her balls churning against your [c][and][balls], as j", parse);
		}
		else
			Text.Add("J");
		Text.Add("et after jet of doggy-herm spunk splatters on the cushions below.", parse);
		Text.NL();
		Text.Add("Miranda's orgasm is something you barely notice, caught up in the throes of your own as you are. Sealed together by your knot as you are, your seed penetrates deeply inside her, flooding towards her very womb without mercy. ", parse);

		var mCum = miranda.OrgasmCum();
		var cum = player.OrgasmCum();

		if(cum > 6) {
			Text.Add("A veritable tidal wave of semen crashes upon Miranda's defenseless womb, her stomach inflating like a balloon as you just keep on pouring spunk inside of her. Down and down it grows until it brushes the floor, the herm so jammed full of your semen that even your knot can't keep it all inside, rivulets of seed leaking down her thighs wherever they manage to force their way out.", parse);
		}
		else if(cum > 3) {
			Text.Add("As your cum keeps on flowing and flowing, the dober-herm's gut begins to balloon from the amount of seed gushing into her womb. Out and out she grows, until a nicely pregnant-looking belly sways beneath her with every motion she makes. Thanks to the tightness of your knot-induced seal, not a single drop leaks out, ensuring she is well and truly bred.", parse);
		}
		else {
			Text.Add("Miranda's stomach starts to swell slightly, visibly rounding out from the huge gush of seed you packed away inside of her. But the two of you are too busy to care.", parse);
		}
		
		return cum;
	}
	else {
		Text.Add("As the dog-morph writhes and barks beneath you, your own excitement builds, a rising wave of anticipation and pleasure that you know will soon overwhelm you. Determined not to be the first to cum, you redouble your efforts, ramming away at watch-bitch's cunt as hard and as fast you can, grinding your [cockDesc] against any spot that seems to elicit a particular reaction from her. Unconsciously, one of your hands leaves her tits and reaches down to grasp the hot, slick, pulsing warmth of her shaft. You pump away at it busily, assaulting both sets of organs at the same time, knowing she'll just have to cum first this way.", parse);
		Text.NL();
		if(dom > 25) {
			Text.Add("As you stroke and hump, you tell Miranda that she belongs to you; she might be top dog among the guards, but to you, she's just your bitch. Now she's going to be a good little doggie and cum for you, nice and messy.", parse);
			Text.NL();
			Text.Add("A growl of pleasure rumbles out of Miranda's throat, her back arching under you. <i>“Nnng... y-yes, yes [masterMistress]!”</i> she barks gleefully in response.", parse);
		}
		else if(dom > -25) {
			Text.Add("And to think, she always goes on about being top dog. Well, it looks like there's a new top dog in town, you comment, even as you continue your ministrations.", parse);
			Text.NL();
			Text.Add("<i>“Don’t get cocky just because I’m letting you- Oooh! -do me.”</i>", parse);
			Text.NL();
			Text.Add("Just shut up and cum for me already, you retort, pinching the tip of her dripping dick between forefinger and thumb for emphasis, kneading the sensitive flesh with your digits.", parse);
		}
		else {
			Text.Add("As your fingers dance over her dick, you playfully plead with her to just let go already; you want her to cum, here and now, just for you. Won't she please cum for you?", parse);
			Text.NL();
			Text.Add("<i>“Nng… If you really want me to cum that bad, you’d best work those hips and your hands.”</i>", parse);
			Text.NL();
			Text.Add("You need no further encouragement, doing your best to pump for all you're worth with hands and hips, fingers seeking out every sensitive spot on her cock that you can find.", parse);
		}
		Text.NL();
		parse["prosthetic"] = p1Cock.isStrapon ? " prosthetic" : "";
		Text.Add("Miranda howls in pleasure as her cock throbs in your hand, a powerful jet of doggy-jism spraying the cushions below as her cunt clamps down on your[prosthetic] cock. Each jet that she blows feels like riding a wave, and you take advantage of her contracting pussy to really work her entrance.", parse);
		Text.NL();
		Text.Add("The sound of her howling in pleasure and of her semen spattering across the cushions below, the scent of sex in your nostrils, the feel of her writhing beneath you... it's too much for you to hold back any more. Throwing your own head back, you cry out as your own climax washes through you.", parse);
		
		var mCum = miranda.OrgasmCum();

		var cum = p1Cock.isStrapon ? -1 : player.OrgasmCum();
		player.AddLustFraction(-1);
		
		if(!p1Cock.isStrapon) {
			Text.NL();
			parse["ballsCockDesc"] = player.HasBalls() ? player.BallsDesc() : p1Cock.Short();
			parse["mc"] = player.NumCocks() > 1 ? " and all over her balls and thighs" : "";
			Text.Add("You can feel the tingling in your [ballsCockDesc] as your load begins bubbling up from inside you. Your [cockDesc] throbs before spraying your seed into her waiting entrance[mc]. ", parse);
			if(cum > 6)
				Text.Add("An eruption of spunk floods inside of Miranda's waiting womb, packing her with a belly-stretching load as you continue to cascade inside of her. Even as it squirts and sprays back out from the sheer pressure inside of her, most of it continues to flood inside of her, leaving her looking veritably pregnant with semen. The floor beneath your joined hips is a mess with excess semen that has leaked from inside of her.", parse);
			else if(cum > 3)
				Text.Add("As your cum keeps on flowing and flowing, the dober-herm's gut begins to balloon from the amount of seed gushing into her womb. Much of it spills freely back out, running down your thighs, but enough makes it inside to leave her with a nicely crammed pot-belly.", parse);
			else
				Text.Add("Thick ropes of seed slosh inside of her and squirt back out over your own dick-flesh, drooling around the imperfect seal of your cock in her cunt and leaking wetly onto the cushions below you.", parse);
		}
		if(player.FirstVag()) {
			Text.NL();
			parse["c"] = p1Cock.isStrapon ? "the vibrations as she clenches your fake cock for all she's worth" : Text.Parse("the feel of her wringing your [cockDesc]", parse);
			Text.Add("Your [vagDesc] clenches in sympathy, the excitement overwhelming you. Though neither of you have touched it, the smell and sounds of Miranda's climax, combined with [c], is more than enough to set off your own feminine orgasm in turn. Ropes of female honey flood from your pussy, falling wetly down your [thighsDesc] and staining your [legsDesc] with your climax.", parse);
		}
		Text.Flush();
		
		return cum;
	}
}

Scenes.Miranda.TavernSexPublicBJ = function() {
	var parse = {
		playername : player.name,
		mastermistress : player.mfTrue("master", "mistress"),
		boyGirl : player.mfTrue("boy", "girl"),
		pheshe : player.mfTrue("he", "she"),
		phimher : player.mfTrue("him", "her"),
		tongueDesc : function() { return player.TongueDesc(); },
		bellyDesc : function() { return player.StomachDesc(); },
		earDesc : function() { return player.EarDesc(); }
	};

	var dom = player.SubDom() - miranda.SubDom();
	
	Text.Add("You duck in under the table, kneeling between the guardswoman’s legs.", parse);
	Text.NL();
	
	var setPublic = false;
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“You know what to do, [playername],”</i> Miranda murmurs, sipping her mug while you unlace her britches, releasing the trapped beast. The meaty shaft smacks wetly against your forehead, depositing a splatter of pre on your upturned face. ", parse);
		if(dom < -25 || player.Slut() > 50)
			Text.Add("You lick your lips in anticipation. This is going to be quite a tasty treat.", parse);
		else
			Text.Add("The herm smiles innocently when you frown, tapping her finger against her thigh. Might as well get to it.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Mmm… you know just how to make a girl feel special,”</i> Miranda purrs. <i>“Who knows, perhaps I’ll return the favor later?”</i> The dobie is panting in anticipation as you undo her britches, pulling them down to reveal her aching cock.", parse);
		Text.NL();
		Text.Add("<i>“I… I don’t mind you being a bit rough,”</i> she murmurs.", parse);
	}, 1.0, function() { return miranda.SubDom() < -25; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Nice try, bitch, but it’s not going to be that easy,”</i> Miranda chuckles mockingly. Before you know it, she’s kicked the table out of the way, leaving you in quite a compromising position. It doesn’t seem like anyone have noticed you yet, though.", parse);
		Text.NL();
		Text.Add("<i>“I believe you were in the middle of something,”</i> the dommy herm purrs, leaning back and spreading her legs invitingly. ", parse);
		if(player.SubDom() < 25 || player.Slut() > 50)
			Text.Add("You have trouble hiding your eagerness as you undo her britches, revealing her tasty meatstick. You can’t wait to go down on her, regardless of if you gather an audience.", parse);
		else
			Text.Add("There is a glint of defiance in your eyes as you undo her britches, but you might as well go through with this now that you’ve started it. Miranda is bound to make trouble for you if you don’t.", parse);
		
		player.slut.IncreaseStat(50, 1);
		player.subDom.DecreaseStat(-50, 1);
		setPublic = true;
	}, 1.0, function() { return (miranda.Attitude() < Miranda.Attitude.Neutral) || miranda.SubDom() > 50; });
	
	scenes.Get();
	
	Text.NL();
	Text.Add("You give Miranda’s shaft a few tentative licks, enjoying the feeling of her member throbbing on your [tongueDesc] before you wrap your lips around it. Almost immediately, your mouth is filled with her musky taste.", parse);
	Text.NL();
	
	Sex.Blowjob(player, miranda);
	player.FuckOral(player.Mouth(), miranda.FirstCock(), 2);
	miranda.Fuck(miranda.FirstCock(), 2);
	
	Text.Add("<i>“Mmm… good [boyGirl],”</i> she sighs, putting her leg over your shoulder. Pulling you in with her foot on your lower back, the dommy dobie locks you in place, leaving you no way to go but down on her shaft. She shifts her position slightly, pushing her hips forward, spearheaded by several inches of canine cock.", parse);
	Text.NL();
	Text.Add("It doesn’t seem like you’re going anywhere until Miranda has had her fill - or until she’s given you your fill, as it were. Either way, you resign yourself to giving her what she wants, which right now is your lips on her crotch. You start bobbing your head slowly, sucking on her member.", parse);
	Text.NL();
	Text.Add("<i>“Come on, [playername], you are going to bore me if you don’t get going soon,”</i> Miranda complains, tightening her leghold. At her urging, you increase your pace, the guardswoman’s pointed cockhead poking at the entrance of your throat each stroke. The dobie yawns theatrically, though you can sense through the minute movements of her body that she’s definitely feeling this.", parse);
	Text.NL();
	if(Math.random() < 0.5 && miranda.SubDom() > 25) {
		Text.Add("<i>“Hey barkeep! Another drink over here!”</i> Miranda calls out across the room. She places one of her hands on the back of your head, keeping you firmly in place as she waits. ", parse);
		if(setPublic)
			Text.Add("You quickly realise your compromised position, but you can’t really do anything about it right now, so you continue sucking, trying to get the she-bitch off as quickly as you can.", parse);
		else
			Text.Add("You should still be relatively safe under the cover of the table as long as you manage to keep quiet - something you are not sure Miranda will let you get away with.", parse);
		parse["pub"] = setPublic ? "not that you think it will help much" : "though you wish that they had table cloths";
		Text.Add(" You suddenly appreciate the dim light in the tavern, [pub].", parse);
		Text.NL();
		Text.Add("Your heart is pounding loudly as you hear steps approaching, and a mug is placed on the table. Much to your aggravation, the barkeep stays to chat with the herm for a while. ", parse);
		if(setPublic)
			Text.Add("Neither of them acknowledge you, though you can almost feel them staring at you, stuck as you are more than halfway down Miranda’s cock. ", parse);
		else
			Text.Add("Even with the relative cover of the table, you are probably making enough lewd noises for the newcomer to suspect what’s going on. ", parse);
		if(player.Slut() > 50)
			Text.Add("Unconcerned with your audience, you dig in, deciding to give them a show.", parse);
		else
			Text.Add("Cheeks afire, you close your eyes and wait for the bartender to leave, imagining that they are unaware of you.", parse);
		Text.NL();
		Text.Add("Eventually, you are left alone again with the bitch.", parse);
		Text.NL();
		Text.Add("<i>“Ah, that hits the spot!”</i> Miranda sighs languidly. It’s not really clear if she’s referring to the drink.", parse);
		Text.NL();
	}
	else if(Math.random() < 0.5) {
		if(Math.random() < 0.5) {
			parse["HeShe"] = "He";
			parse["heshe"] = "he";
			parse["HisHer"] = "His";
			parse["hisher"] = "his";
			parse["himher"] = "him";
			parse["malefemale"] = "male";
		}
		else {
			parse["HeShe"] = "She";
			parse["heshe"] = "she";
			parse["HisHer"] = "Her";
			parse["hisher"] = "her";
			parse["himher"] = "her";
			parse["malefemale"] = "female";
		}
		
		Text.Add("You hear soft footsteps walking over to you, and a glance to the side tells you that one of the felines is approaching.", parse);
		Text.NL();
		Text.Add("<i>“Hey there kitty,”</i> Miranda huffs, greeting them. <i>“Sorry, but I can’t give you any cream right now, little Miranda is occupied.”</i> ", parse);
		if(setPublic) {
			Text.Add("As if that wasn’t obvious enough. <i>“Perhaps [pheshe] wants to share?”</i> the cat asks hopefully, [hisher] voice identifying [himher] as the [malefemale].", parse);
			Text.NL();
			Text.Add("<i>“Nah, something tells me [playername] wants this load all to [phimher]self,”</i> Miranda replies, patting you on the head.", parse);
			Text.NL();
			Text.Add("<i>“Aww...”</i> [HeShe] pouts a little bit at being left out.", parse);
		}
		else
			Text.Add("A curious cat peeks down under the table, giving you a purr when [heshe] sees you.", parse);
		Text.NL();
		Text.Add("<i>“I’ll come back later, okay?”</i> The cat gives you a few glances over [hisher] shoulder as [heshe] returns to [hisher] own table.", parse);
		Text.NL();
	}
	Text.Add("After a while, the dobie decides to take a more active part, grabbing hold of your head and not-so-gently guiding it. Deeper and deeper she pushes, until your lips are straining around her thick - if still deflated - knot. Somehow, you manage to keep pace with her, as she allows you the occasional chance to surface for air before forcing you back to the task at hand.", parse);
	Text.NL();
	if(party.Num() > 1) {
		var femcomp = [];
		if(party.InParty(kiakai)) femcomp.push(kiakai);
		if(party.InParty(terry))  femcomp.push(terry);
		if(party.InParty(roa))    femcomp.push(roa);
		if(party.InParty(gwendy)) femcomp.push(gwendy);
		if(party.InParty(momo))   femcomp.push(momo);
		
		parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
		Text.Add("Though she sounds like she’s getting a bit terse, Miranda keeps up a jovial conversation with [comp], acting as if nothing strange is going on. ", parse);
		if(femcomp.length > 0) {
			var comp = femcomp[Math.floor(Math.random() * femcomp.length)];
			parse["them"] = comp.name;
			parse["heshe"] = comp.heshe();
			parse["hisher"] = comp.hisher();
			parse["himher"] = comp.himher();
			Text.Add("She sounds like she’s making not so subtle innuendos to [them], asking if [heshe]’d be interested in giving it a try.", parse);
			Text.NL();
			if(comp == kiakai) {
				parse["name"] = kiakai.name;
				Text.Add("<i>“I… ah, I am not sure if-”</i> [name] stammers, flustered. Miranda just laughs at the elf’s cute response.", parse);
			}
			else if(comp == terry) {
				parse["foxvixen"] = terry.mfPronoun("fox", "vixen");
				Text.Add("<i>“In your dreams, watch-dog. I’d rather blow everyone on this bar rather than blow you!”</i> the [foxvixen] shoots back, perhaps a bit louder than [heshe] should…", parse);
				Text.NL();
				Text.Add("<i>“Oh ho! That sounds like an offer if I’ve heard any. Anyone up for some!?”</i> Miranda yells at the crowd. There’s more than a few guys, and even some females, that show interest.", parse);
				Text.NL();
				if(terry.Slut() >= 60)
					Text.Add("Smirking, Terry licks [hisher] lips. <i>“Sorry boys and girls. I meant what I said, but I’m not allowed to disobey my [mastermistress],”</i> [heshe] points at the collar around [hisher] neck. <i>“As much as I’d love to service you to prove my point to this dirty dog,”</i> [heshe] points at Miranda, who scowls in response. <i>“Can’t do anything unless my boss says so. Sorry to disappoint, but I’m claimed.”</i>", parse);
				else
					Text.Add("<i>“I-I don’t… I...”</i> Terry tries to stammer out a reply, but ultimately falls silent as the approaching crowd surrounds [himher]. You can hear Miranda laughing above, and while you’d love to see Terry get out of this one, right now you have your <i>own</i> problem to deal with.", parse);
			}
			else if(comp == gwendy) {
				Text.Add("<i>“Not likely,”</i> Gwendy sniffs.", parse);
				if(gwendy.FirstCock())
					Text.Add(" <i>“Perhaps you’d like to try mine though?”</i> the horsecocked herm adds mockingly.", parse);
			}
			else if(comp == roa) {
				Text.Add("<i>“Can I?”</i> the slutty rabbit asks hopefully. <i>“Later,”</i> Miranda promises, licking her lips.", parse);
			}
			else {
				parse["Poss"] = comp.Possessive();
				Text.Add("[Poss] reply is lost in the din of the tavern. Besides, you have other things to worry about.", parse);
			}
		}
		Text.NL();
	}
	if(setPublic)
		Text.Add("Your table is starting to gather attention as more and more of the shady tavern goers are made aware of your little show. There are some snide comments and chuckles, but no one is quite brave or drunk enough to approach you with the dommy herm around.", parse);
	else
		Text.Add("The table provides only partial cover at best, and by the whispered remarks you hear, more than a few of the tavern’s patrons seem to have noticed you.", parse);
	Text.NL();
	Text.Add("By now, you have Miranda’s full attention, as she completely abandons her cocky, indifferent facade. Panting like a bitch in heat, she pull your head up and down her shaft, roughly and repeatedly impaling you on the thick stick of meat. You can feel her throb deep down your throat, stretching you to your limits. As she nears her peak, the guardswoman eggs you on with mocking and suggestive comments, making no particular effort to keep her voice lowered.", parse);
	Text.NL();
	if(player.FirstCock()) {
		parse["mutliCockDesc"] = player.MultiCockDesc();
		parse["isAre"] = player.NumCocks() > 1 ? "are" : "is";
		Text.Add("Your [mutliCockDesc] [isAre] almost painfully hard, neglected and clamoring for attention.", parse);
		Text.NL();
	}
	if(player.FirstVag()) {
		parse["vagDesc"] = player.FirstVag().Short();
 		Text.Add("A trickle of femjuice drips from your [vagDesc], your puffy nether lips aroused by Miranda’s impressive member.", parse);
		Text.NL();
	}
	
	miranda.OrgasmCum();
	
	Text.Add("Miranda grunts loudly as she hilts herself in your throat, pouring her massive load down into your [bellyDesc]. Perhaps feeling merciful, the herm pulls out just as her knots starts to swell, saving you from being stuck on her cock. On the other hand, you gain a messy pearly necklace - more of a pearly ball gown, in truth - in exchange.", parse);
	Text.NL();
	Text.Add("Sated, the guardswoman pats you on the head, scratching you behind your [earDesc] while you clean her up.", parse);
	Text.NL();
	parse["lover"] = (miranda.Attitude() < Miranda.Attitude.Neutral) ? "bitch" : "lover";
	Text.Add("<i>“Not bad, [lover],”</i> she sighs, waving for another drink as you hurriedly clean yourself up.", parse);
	
	world.TimeStep({minute: 30});
	
	player.AddLustFraction(0.5);
	miranda.subDom.IncreaseStat(40, 1);
	player.subDom.DecreaseStat(-30, 1);
	miranda.relation.IncreaseStat(setPublic ? 70 : 40, 1);
	player.slut.IncreaseStat(25, 1);
}

Scenes.Miranda.TavernSexDommyBJ = function() {
	var parse = {
		playername : player.name,
		masterMistress : player.mfTrue("master", "mistress"),
		tongueDesc : function() { return player.TongueDesc(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		vagDesc : function() { return player.FirstVag().Short(); },
		clitDesc : function() { return player.FirstVag().ClitShort(); },
		buttDesc : function() { return player.Butt().Short(); },
		anusDesc : function() { return player.Butt().AnalShort(); },
		footDesc : function() { return player.FootDesc(); },
		skinDesc : function() { return player.SkinDesc(); },
		armorDesc : function() { return player.ArmorDesc(); }
	};
	
	var dom = player.SubDom() - miranda.SubDom();
	
	if(miranda.Attitude() >= Miranda.Attitude.Neutral)
		Text.Add("<i>“Alright, [playername]. You know what to do, so open up,”</i> she says, brandishing her hardening prick and nestling it against your lips.", parse);
	else
		Text.Add("<i>“Okay, slut. Your best friend is ready for some action, so be a good bitch and roll that carpet out, cuz I’m going in,”</i> Miranda says, slapping your face with her cock before forcefully shoving her pointed tip against your lips.", parse);
	Text.NL();
	Text.Add("You open your mouth to grant the dobie-dick access, extending your [tongueDesc] and gently lapping at the underside of Miranda's cock as you envelop it in your mouth. Closing your lips around the intruder, the taste of salty-sweet precum and flesh washing over your senses, you start to suckle, caressing her with your lips and tongue, bobbing your head slightly as you swallow further inches of girlcock into your mouth.", parse);
	Text.NL();
	
	Sex.Blowjob(player, miranda);
	player.FuckOral(player.Mouth(), miranda.FirstCock(), 2);
	miranda.Fuck(miranda.FirstCock(), 2);
	
	if(player.SubDom() > 0) {
		parse["nasty"] = miranda.Attitude() < Miranda.Attitude.Neutral ? ", and your expectations of Miranda's wrath," : "";
		Text.Add("Despite any feelings of reluctance you have about this, your pride[nasty] demands you do your best. You take Miranda's foot-long as far into your mouth as you can bear, then pull your head back before sliding back down again, washing the sensitive prickmeat with tongue and cheeks and lips as you go. You can't be called the most enthusiastic cock-sucker, but you do your best to be a good one, taking what pride you can in the grunts and growls of approval echoing down from above your head.", parse);
	}
	else {
		parse["Y"] = miranda.Attitude() < Miranda.Attitude.Neutral ? "Regardless of her opinion of you, y" : "Y";
		Text.Add("Eagerly you suck and swallow at Miranda's impressive piece of girldick, eyes closed in rapture as you savor the flavor of her washing over your tongue, her musk filling your nostrils. [Y]ou are determined to give her the best blowjob you can. Moaning in your aroused desire, you bob and lap and suckle for all you're worth, humming so as to better stir her dick with pleasure. You tease her by taking the first few inches of her shaft down your throat and then backing away, letting her crave the deepthroating you know she wants.", parse);
	}
	Text.NL();
	Text.Add("Suddenly, you feel a pair of paws grabbing the sides of your head. Darting your eyes up you see Miranda bearing an evil grin. ", parse);
	parse["handsomeBeautiful"] = player.mfFem("handsome", "beautiful");
	if(miranda.Attitude() >= Miranda.Attitude.Neutral)
		Text.Add("<i>“Come on, [handsomeBeautiful]. I know you can do better.”</i>", parse);
	else
		Text.Add("<i>“We both know you’re a cock hungry slut, so why not act the part and give me a proper blowjob.”</i>", parse);
	Text.NL();
	Text.Add("Before you can protest, the doberherm shoves all 11 inches of her knotted, canine pecker down your throat. You can feel your eyes tearing up as your lips come into contact with her sheath. You can feel the heat emanating from her balls as they slap your chin, the scent of Miranda’s musk threatens to overwhelm your senses as your gag reflex makes you choke on her dick. For a moment you feel like you might start suffocating, but Miranda soon withdraws. You inhale deeply, thankful for this momentary reprieve, but you don’t have long as Miranda’s hips lurch forward, impaling your throat back into her doggie-dong.", parse);
	Text.NL();
	Text.Add("<i>“Yeah, that’s how you do it,”</i> she comments, tongue lolling out as she becomes immersed in pleasure.", parse);
	Text.NL();
	var choices = 3;
	if(miranda.Attitude() < Miranda.Attitude.Neutral) {
		if(player.SubDom() > 0)
			Text.Add("Much as the rancor burns in your veins at the thought, you know that the consequences of trying to defy her just aren't worth the satisfaction you'd get at interrupting her ravaging of your throat. You'll just have to let her do what she wants… for now.", parse);
		else
			Text.Add("A potent cocktail of shame and lust burns down your gullet as the doberherm builds herself up to a proper facefucking assault on you, and your body grows warm with desire as you imagine her thick, strong girl-seed flooding down your throat and filling your stomach, marking you inside and out as hers. You wouldn't resist even if you could…", parse);
		
		choices = 1;
	}
	else {
		if(player.SubDom() > 25) {
			Text.Add("You bristle unthinkingly at her assumption that you're just going to meekly let her fuck your face like this. Lust-addled as she is, you could easily take control of the situation if you wanted, whether to make her give you some oral attention in turn, or get her off in some other way if she won't trust you to use your mouth.", parse);
			choices = 3;
		}
		else if(player.SubDom() > 0) {
			Text.Add("Looks like she's starting to get a bit too into this... maybe you should bring her back down to earth a little, it'd be easy to get her to start 69ing you if you wanted.", parse);
			choices = 2;
		}
		else {
			Text.Add("Your whole body quivers in excitement, anxious for this strong, virile she-stud bitch to claim you as her own. Your mouth waters, drooling avidly over her cock as you imagine her plunging it down your throat over and over again, fucking you like a living onahole... gods, why can't she get started for real already? You <b>want</b> this!", parse);
			choices = 1;
		}
	}
	Text.Flush();
	
	//[Take It][69][Footjob]
	var options = new Array();
	options.push({ nameStr : "Take it",
		func : function() {
			Text.Clear();
			
			miranda.relation.IncreaseStat(60, 1);
			miranda.subDom.IncreaseStat(50, 1);
			player.subDom.DecreaseStat(-60, 1);
			
			if(miranda.Attitude() >= Miranda.Attitude.Neutral)
				Text.Add("<i>“Damn, your mouth feels so good around my dick, [playername]. Better brace yourself, because I’m going all the way with you,”</i> the doberman says, tightening her grip on your head and thrusting with renewed vigor. Little by little she finds purchase, slipping her knotted doggie-dong inside your throat.", parse);
			else
				Text.Add("<i>“So, how do you like getting used like a fucktoy, slut? What is it? Not enough dick for you? Fine, I’ll make sure to shove all of my eleven inches down your tight cocksleeve,”</i> she teases, carelessly gripping your head and redoubling her efforts. Her cock rubs against the back of your throat, roughly bashing you until she finally slips inside your throat.", parse);
			Text.NL();
			Text.Add("Helpless before the morph's onslaught, all you can do is try and relax your throat as she digs her dick deeper and deeper inside of you. Inch after inch of drooling prickflesh vanishes down your gullet, roughly grinding against your throat's inner walls, until her knot is bumping insistently against your lips.", parse);
			Text.NL();
			Text.Add("You hold there for a few moments, unsure of her intent, but the forceful butting of the fleshy bulb prompts you to stretch your mouth the extra inches it needs to let her knot go inside. Miranda intends for you to take it all, come hell or high water, and you know better than to resist her.", parse);
			Text.NL();
			Text.Add("The swollen flesh grinds back and forth over your tongue as Miranda humps at your face, stretching your jaws but, thankfully, quiescent for now and thus easy enough to handle once you've adjusted to the mass of it. Almost as if in response to your thoughts, though, you can feel her knot starting to grow inside your mouth, pushing your tongue down and pinning it against the floor of your mouth. You are intimately aware of the back of the knot grinding against the interior of your lips with each thrust, but never popping free.", parse);
			Text.NL();
			if(miranda.sex.rBlow == 1)
				Text.Add("...Oh no. She wouldn't! She can't be serious! It looks like she's going to try and tie her dick to your mouth! Unconsciously you try and pull your head back, but the doberherm's grip simply pushes you back more firmly down on her shaft, grinding her shaft down your throat for emphasis. You're not going anywhere, it seems, and you have no choice but to try and relax your jaws as best you can for what you know is coming.", parse);
			else if(miranda.sex.rBlow <= 5)
				Text.Add("You have a sinking suspicion as to what she has in mind, and an experimental attempt to pull your head back from her knot confirms it. She wants to knot your mouth again. Sighing softly as best you can through your filled mouth, you relax your jaws as best you can.", parse);
			else {
				Text.Add("What is this thing that she has with knotting herself to your mouth? ", parse);
				if(miranda.Attitude() >= Miranda.Attitude.Neutral)
					Text.Add("Does she love your cocksucking skills that much? ", parse);
				else
					Text.Add("Does she get off on having you forced to suck her even after she comes so badly? ", parse);
				Text.Add("Whatever the case, you're certainly practiced enough to know just how to relax your jaws, though you know you'll be feeling a little numb-mouthed by the time she's done.", parse);
			}
			Text.NL();
			Text.Add("By the time she releases your head her knot is way too big to pull out, and you can do nothing but sit there as she drags your head with each powerful thrust of her hips. Her shaft throbs ominously inside your throat, you can tell she won’t last long like this. <i>“Hang in there, you’ll be getting your treat anytime,”</i> she says, stifling a grunt as she pats your head.", parse);
			Text.NL();
			Text.Add("A few moments later, she finally grabs you, shoving herself as deep inside your throat as she can. A loud groan of pleasure emanates from the doberherm as she floods your insides with her spunk. A ceaseless tsunami of white that batters your stomach until it’s full and beyond.", parse);
			Text.NL();
			
			var cum = miranda.OrgasmCum();
			
			if(player.SubDom() > 0) {
				if(miranda.Attitude() >= Miranda.Attitude.Neutral)
					Text.Add("Your guts roil and churn as the steaming cascade of salty she-spunk pours down your throat. You want to stop this, but with her knot, it's impossible; all you can do is open your throat and let her fill your protesting stomach. As your belly bloats out, hanging down heavily under its titanic liquid load, you repeat mentally to yourself that this is for Miranda; you want to make her happy... but she had better appreciate you doing this for her.", parse);
				else
					Text.Add("Oh, you <b>hate</b> this bitch! Damnation, your stomach... you want to whimper as you feel yourself distending from the cascade of jism flooding your guts, the eerie sensations of being stretched so full sending strange mixed signals to your brain. Your mind reels with the need for revenge, but there's nothing you can do except swallow spooge and stew in your frustration.", parse);
			}
			else {
				Text.Add("You do your best to moan in muffled ecstasy, eyes closing to fully savor the feeling of a tidal wave of hot girlseed coursing into your stomach. You can feel Miranda's spooge burning all the way down, your belly bloating as she fires spurt after spurt of semen inside of you. Your hand moves unthinkingly to caress your stomach, brain afire with pleasure from the swelling and the touching. You feel so wonderful to be claimed like this, and you can't resist the mental chant for her to give you more, and more; you're her cumdumpster, you want her to fill you with everything she has! ", parse);
				if(miranda.Attitude() >= Miranda.Attitude.Neutral)
					Text.Add("By all the gods of this place, you love your strong, sexy she-stud bitch!", parse);
				else
					Text.Add("Your love of what Miranda does for you and your mutual hate for each other war in your brain, the conflux of guilt and confusion and shame only stoking your pleasure to new heights.", parse);
			}
			Text.NL();
			Text.Add("It takes the better part of a hour for Mirana to shrink down enough to pull out of your used throat, and when she does you immediately cough and sputter, gobs of doggie-spunk flying from your mouth. You gasp, inhaling as much oxygen as you can, glad to finally be free from her and able to breathe easy again.", parse);
			Text.NL();
			if(miranda.Attitude() >= Miranda.Attitude.Neutral) {
				Text.Add("Miranda pats your back, helping you as you finally have a chance to catch your breath. <i>“There, there. Easy now, [playername]. You’re a real trooper y’know? If I tied anybody else I’d probably wind up cracking their jaws,”</i> she laughs. <i>“Just hang in there, I’ll go grab you a cup of water,”</i> she says.", parse);
				Text.NL();
				Text.Add("That... that would be great, you absently reply to her. Gingerly you settle yourself down, careful of your tender, cum-stretched stomach. Overwhelmed by what you've gone through, you allow your eyes to sink closed and lose yourself in torpor.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("The sensations of something warm and soft on your lips stirs you from your slumber, the feel of something wet and firm pressing gently between your lips fully rousing you as it tickles your own tongue. Your eyes open and you find yourself staring into the half-hooded eyes of Miranda as the dober-morph kisses you sweetly. Pleasantly surprised, you lay back and bask in the sensation of her unusually tender actions, allowing her to break it a few moments later, licking your lips unconsciously to chase the last lingering taste of her as she straightens up.", parse);
					Text.NL();
					Text.Add("<i>“A kiss to wake up the sleeping beauty, just like in the fairy tales,”</i> she laughs. <i>“Here,”</i> she passes you a mug filled with a sweet-scented tea. <i>“Drink this, it’ll make you feel better.”</i>", parse);
					Text.NL();
					Text.Add("Thanking her for her thoughtfulness, you gingerly lift the rim of the cup to your lips and carefully sip it. It's as sweet as it smells, but not strong enough to be overpowering; a very calm and neutral sensation that brings with it a soothing feeling. As you slowly drink it, you feel your stomach settling slightly, and your rather raw throat feeling less painful. You resist the urge to gulp it down and instead drain it smoothly; by the time you finish, your throat feels much better, and you thank her for her kindness, voice still a little raspy.", parse);
					
					PrintDefaultOptions();
				});
			}
			else {
				Text.Add("Miranda rolls her eyes as you try your best to catch your breath. <i>“Are you done yet? A slut like you should already be used to taking cock like that. So catch your breath and let’s get going.”</i>", parse);
				Text.NL();
				Text.Add("Queasy as you are, you simply nod your head absently. You really don't feel too good, overwhelmed by the recent fucking you received. Slowly you sink onto your side, head pressed against the nearest pillow, and find yourself fading into darkness.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("Something cold and wet drenches across your face, bringing you back to consciousness with gasping splutters, shaking your head to clear off the worst of the water. You quickly realise the source of your rude awakening as a smirking Miranda stares down at you, one hand holding an upturned mug.", parse);
					Text.NL();
					Text.Add("<i>“Woken up yet? Good. Drink this,”</i> she passes you a mug filled with a sweet-scented tea. <i>“This will help with your throat.”</i>", parse);
					Text.NL();
					Text.Add("Hesitant, but trusting that she wouldn't lie about something like this, you reluctantly accept the proffered mug and carefully take a sip. Sure enough, the fluid soothes your aching throat as it glides down into your belly, and even quenches some of the upset from your impromptu repast. Emboldened, you steadily drain the cup and carefully place it aside, meekly issuing a non-committed thanks to the morph.", parse);
					
					PrintDefaultOptions();
				});
			}
			Gui.Callstack.push(function() {
				Text.Add("Though you still feel a little tired thanks to your efforts and impromptu awakening, you know that you have no time to lay around any further. Noting that Miranda is already fully dressed in her uniform, you slowly pull yourself to your feet and grab your [armorDesc], struggling to get your newly-bloated form dressed up again. It takes a little work, but soon enough, you are ready to go as well.", parse);
				
				PrintDefaultOptions();
			});
		}, enabled : true,
		tooltip : "She’s having a good time and so are you. So let her fuck you and enjoy the ride."
	});
	if(choices >= 2) {
		options.push({ nameStr : "69",
			func : function() {
				Text.Clear();
				
				miranda.relation.IncreaseStat(50, 1);
				miranda.subDom.DecreaseStat(-25, 1);
				player.subDom.IncreaseStat(25, 1);
				
				Text.Add("You strike upwards and outwards with the backs of your hands, knocking Miranda's paws away from their grip on the sides of your head before pulling your head back and wetly popping your mouth free of her cock. The doberherm reels in surprise, and you take this opportunity to give her a hard shove in the hips, pushing her pointedly back with such force she loses her balance and falls flat on her rear. Seizing your chance, you cross the distance between you and take her by the hips, firmly pushing the lust-addled morph over onto her back before draping yourself over her torso in an impromptu pinning hold.", parse);
				Text.NL();
				if(player.SubDom() > 50) {
					Text.Add("You shuffle yourself around so that your head is pointing towards Miranda's straining erection, the canine cock an angry-looking red from her desire, and forcefully thrust your buttocks back towards the morph's face, wrapping her head in turn between your thighs. Bluntly you inform her that if she has so much energy she wants to facefuck you rather than being nice about it, then she had better start to return the favor if she wants you to keep sucking her off.", parse);
					Text.NL();
					Text.Add("To emphasize your point, you bend your head back down and slowly lick her cock from knot to glans, running your tongue up and down in slow, tantalizing strokes but never actually engulfing it again.", parse);
				}
				else {
					Text.Add("You can't resist coping a quick squeeze of Miranda's tits whilst you lay atop her, but do so in passing, already spinning yourself around on her stomach so that you are both pressed face to groin with each other, Miranda's girlcock practically glowing against your face. Wriggling your hips enticingly in the doberherm's face, you coyly comment on how Miranda is so very full of energy. Perhaps, if she thinks you're doing such a good job, she can return the favor, hmm? She likes what you're doing down here, doesn't she?", parse);
					Text.NL();
					Text.Add("For emphasis, you place a soft, tender kiss right on the swollen bulge of her knot, then trace a trail of featherlight kisses up to her glans before licking your way back down. With lips and tongue you tease her shaft, caressing the sensitive dickflesh but never deigning to start properly sucking it.", parse);
				}
				Text.NL();
				
				var Target = {
					Blowjob : 0,
					Cunn    : 1,
					Rim     : 2
				};
				var target;
				
				var scenes = new EncounterTable();
				if(player.FirstCock()) {
					scenes.AddEnc(function() {
						parse["sup"]   = miranda.SubDom() > 0 ? "Much to your surprise, " : "";
						parse["oneof"] = player.NumCocks() > 1 ? " one of" : "";
						parse["s"]     = player.NumCocks() > 1 ? "s" : "";
						Text.Add("[sup]Miranda doesn’t protest. Her hands move to your hips, adjusting your position until her nose touches your [multiCockDesc]. You can feel her hot breath caress you as she laps up a dollop of pre, then moves to engulf[oneof] your shaft[s]. ", parse);
						target = Target.Blowjob;
					}, 1.0, function() { return true; });
				}
				if(player.FirstVag()) {
					scenes.AddEnc(function() {
						Text.Add("Miranda moves to caress your [buttDesc], slowly she traces your behind until she arrives at your [vagDesc]. With her thumbs she spreads you open, shoving her snout inside you and inhaling deeply. She licks her lips and begins lapping at your labia. ", parse);
						target = Target.Cunn;
					}, 1.0, function() { return true; });
				}
				scenes.AddEnc(function() {
					Text.Add("Miranda grabs your buttcheeks, kneading them and spreading them open to reveal your [anusDesc]. It’s not long before you feel wetness lapping at your crack, tongue massaging your sphincter in hopes of being granted entrance. ", parse);
					target = Target.Rim;
				}, 1.0, function() { return true; });
				
				scenes.Get();
				
				parse["dom"] = player.SubDom() > 50 ? " That's a good bitch, you absently quip back to her." : "";
				Text.Add("A moan of pleasure escapes your throat as you feel Miranda's mouth and tongue going to work.[dom] Emboldened, you turn your attention back to her own throbbing dog-cock and open your mouth, swallowing her girldick as deeply as you can and noisily sucking on it. The turgid flesh throbs between your lips, salt-sweet precum oozing steadily over your tongue and vanishing down your throat with each suckle you make. Painstakingly you lick every crease and fold and vein, pumping her shaft in and out between your lips, wriggling your hips back to grant Miranda better access to your own nethers as you do so.", parse);
				Text.NL();
				parse["gen"] = target == Target.Blowjob ? function() { return player.MultiCockDesc(); } :
					           target == Target.Cunn ? function() { return player.FirstVag().Short(); } :
					           function() { return player.Butt().AnalShort(); };
				Text.Add("Even despite your pleasure as Miranda plays with your [gen], you can see her knot starting to bloat, pleasure fattening it into a nice big juicy anchor of flesh. As it bulges into something like an apple-sized bulb of dickmeat, you can feel her cock throbbing in your mouth like mad, a veritable volcanic eruption of girl-semen building inside her apple-sized balls.", parse);
				Text.NL();
				Text.Add("Well, no sense in delaying it...", parse);
				Text.NL();
				Text.Add("Your hands creep around between her legs, one stroking and caressing her bloated testes, the other moving to take her dick by the base of her knot and squeeze it nice and tight. Unclenching your throat, you plunge your mouth down her shaft, sinking it inside of you until your lips are just brushing her knot... and then you clamp your lips firmly and suck as hard as you can, even as you pull your head back up her long, thin prick until only her pointy glans remains locked inside your still-sucking lips.", parse);
				Text.NL();
				Text.Add("Miranda’s moans are muffled as she diligently works on your [gen]. From your advantageous spot, you can see, and feel, as every muscle in her body tenses. A thick spurt of pre heralds the oncoming eruption of doggie-cum that fills your mouth with nary but a single jet. You quickly move to swallow her thick load, just as she delivers another.", parse);
				Text.NL();
				
				var cum = miranda.OrgasmCum();  // the var 'cum' name is the same as the player (?)
				
				Text.Add("As the semen-fountain masquerading as doberherm beneath you keeps on erupting into your mouth, you diligently swallow each load, at least for a time. Having had enough, you relax your mouth and release her, allowing her cum to spray unabashedly over her thighs as you use your hand to continue milking her. Finally her spurts grow weaker and weaker, until she lets out a final groan and issues what you suspect is her final jet of this orgasm. Quickly you move, mouth diving in to capture her last load and hold it inside your lips, letting the thick stickiness of it roll across your tongue.", parse);
				Text.NL();
				if(target == Target.Blowjob) {
					var cum = player.OrgasmCum();
					
					if     (cum > 6) parse["cum"] = "cascade";
					else if(cum > 3) parse["cum"] = "streamer";
					else             parse["cum"] = "spurt";
					Text.Add("Even through her own climax, Miranda keeps sucking your cock for all she's worth, her ecstatic moans rattling through the sensitive flesh and sending sparks of pleasure crackling beneath your skin. You feel the pressure building up inside of you, even as her own thick cum stirs your senses and enflames your lust. The lewd slurping from behind you as she suckles finally pushes you over the end and you reward her efforts with your own [cum] of spooge.", parse);
				}
				else if(target == Target.Cunn) {
					Text.Add("Throughout her own climax, Miranda's tongue keeps slurping and squelching through your petals, lapping greedily for your feminine nectar, her fuzzy chin rubbing against your [clitDesc] seemingly by accident. Your hips twitch and sway, but she simply won't relent in her assault, and inevitably your womanhood releases its juices right into the morph's hungry jaws.", parse);
					
					var cum = player.OrgasmCum(); // ? why?
				}
				else {
					Text.Add("Miranda lewdly slurps and laps at your back passage, making you shudder and wriggle even through her own climax. As her cock slides limply back into her sheath, she continues her assault, but evidently you've worn her out, as her licks grow slower and slower until she stops entirely. As she lays back and pants, you're left glowing pleasantly in arousal.", parse);
					player.AddLustFraction(0.5);
				}
				Text.NL();
				if(dom > 25) {
					parse["masterMistress"] = player.mfTrue("master", "mistress");
					Text.Add("<i>“Ah...”</i> Miranda sighs in relief. <i>“Thank you, [masterMistress]. I really needed that.”</i> She licks her lips, still panting in exertion as she releases you and lays splayed on the floor.", parse);
					Text.NL();
					Text.Add("Leisurely, you shuffle yourself around atop her until you are face to face with the panting dobermorph. Smirking as best you can with your mouth full, you gently cup her chin and cheeks with your hands, subtly pinning her mouth open before opening your lips. A cascade of thick herm-seed leisurely flows from your mouth into Miranda's, the herm's eyes widening as it does so. You feed her every last drop that you saved earlier, and then swoop down to kiss her insistently on the lips.", parse);
					Text.NL();
					Text.Add("The subby doberherm has no choice but to swallow, not that she’d deny it in the first place. But forcing her own cum down her gullet while you kiss her feels pretty nice. You break the kiss just in time to hear her moan, a look of satisfaction plastered on her face. Miranda is a good girl, you remark patting her head as she pants.", parse);
				}
				else if(dom > -25) {
					Text.Add("<i>“Not bad, [playername],”</i> Miranda remarks, still panting after your little session. <i>“Doing and getting done feels kinda nice. I wouldn’t mind going for another round sometime,”</i> she grins. <i>“But first I think I need to clean up after myself.”</i>", parse);
					Text.NL();
					Text.Add("You have only a moment to consider what she’s said before she grabs you and spins you around to give you a forceful kiss, forcing some of her cum down your throat. She does, however, manage to steal some straight from your mouth. The two of you continue to kiss passionately for a few moments, before she withdraws with a grin, licking her lips.", parse);
					Text.NL();
					Text.Add("Smiling, you quip that it looks like you weren't the only one who enjoys her special milk.", parse);
					Text.NL();
					Text.Add("<i>“Can’t overfeed you now, can I? Gotta keep you coming back for more.”</i>", parse);
					Text.NL();
					Text.Add("You grin and shake your head playfully. Somehow, you don't think that keeping you coming back is going to be too hard... though you have doubts as to whether she can resist overfeeding you.", parse);
				}
				else {
					parse["gen"] = target == Target.Blowjob ? "own" :
					               target == Target.Cunn ? "pussy" : "ass";
					Text.Add("<i>“Ain’t I the nicest gal a guy like you could hope for? I gave you cock and even took care of your [gen],”</i> she says, licking her lips.", parse);
					Text.NL();
					Text.Add("Twisting around so that you are sitting atop her, you look her in the eye.", parse);
					if(player.SubDom() > 50)
						Text.Add(" You cast her your sultriest look, rolling her last shot of dickcream around in your mouth, letting her see you saved some, then noisily gulp it down. Your [tongueDesc] snakes out to lap daintily at the corner of your mouth.", parse);
					else
						Text.Add(" Eyes hooded in lust, you make a show of tilting your head to emphasize the lines of your neck, slowly swallowing the mouthful of Miranda's seed you retain with an audible sound. Moaning in desire, you lasciviously lick at your lips, as if still searching for more of that taste.", parse);
					Text.Add(" She certainly is a nice girl, you quip back. Nice and tasty, too.", parse);
					Text.NL();
					parse["hair"] = player.HasHair() ? "ruffling your hair" : "rubbing your head";
					Text.Add("<i>“Why, you little flirt!”</i> she quips back, grabbing you into an arm lock and [hair].", parse);
				}
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("You hasten to pull on the rest of your [armorDesc], the now-sated dobermorph having already clambered back into her own gear and now waiting for you by the door. Once dressed, you move to unbarricade the door and let her exit, following her as she goes.", parse);
					PrintDefaultOptions();
				});
			}, enabled : true,
			tooltip : Text.Parse("Since you’re fellating her, how about having her [ret] instead of facefucking you?", {ret: player.FirstCock() ? "return the favor" : "give you tongue"})
		});
	}
	if(choices >= 3) {
		options.push({ nameStr : "Footjob",
			func : function() {
				Text.Clear();
				
				miranda.relation.IncreaseStat(50, 1);
				miranda.subDom.DecreaseStat(-75, 2);
				player.subDom.IncreaseStat(75, 1);
				
				Text.Add("In one fell swoop, you knock Miranda's hands away and release her cock, then lunge forward in a powerful shove to the startled doberherm's hips. Already reeling from your initial surprise release, she loses her balance and promptly falls flat on her rear with a startled grunt. As quickly as you can, you clamber to your feet and stride forward, pushing Miranda over completely onto the floor, then move to step onto her cock; not hard enough to hurt her, but definitely firmly enough that she can feel your weight as you press it against her belly,", parse);
				Text.NL();
				if(dom > 50)
					Text.Add("Miranda moans in lust, moving to grind herself against your [footDesc]. She doesn’t even bother protesting about your sudden switch in positions. She’s your bitch and she knows it, better yet, she loves it. <i>“Mmm, [masterMistress],”</i> she pants.", parse);
				else
					Text.Add("<i>“Hey! What the- urk!”</i> you silence her by massaging her doggie-dong with your [footDesc]. Can’t have your bitch talking back to you like that, can you? She glares at you at first, but a quick increase in pressure has her frown turned upside down as her cock throbs under your feet. Despite whatever reservations she might have, the doberherm is incapable of hiding her enjoyment.", parse);
				Text.NL();
				Text.Add("Imperiously staring down at your prey, you chide Miranda for getting carried away.  But then you shake your head and smirk, noting it's not as if she can really help it, is it? She's just such a horndog, isn't she;  always chasing after you, looking to get her belly rubbed - you leisurely stroke her throbbing shaft with your [footDesc] - or to bury a bone. She just loves it when you choose to share yourself with her; you're her favorite fuckbuddy, the only one who really gets her off, aren't you?", parse);
				Text.NL();
				if(dom > 50)
					Text.Add("<i>“Damn right I am. You made me your bitch, made me like being your bitch. And now this bitch needs her [masterMistress] to give it to her good. So do it, just the way I like it,”</i> Miranda readily admits.", parse);
				else
					Text.Add("<i>“Don’t get cocky, [playername],”</i> she warns, propping herself up on her elbows. <i>“Our positions could easily be reversed.”</i>", parse);
				Text.NL();
				Text.Add("You press down a little harder with your foot, making her groan at the sensation, then tell her not to say such stupid things - she's not getting out of this, and you both know it. Then, smiling, you lift your foot from her cock and place it higher up her midriff, pushing down so that she flattens herself onto the floor again. Just relax, you instruct her, even as you return your [footDesc] to its former place on her erection. You know what she likes, and you're going to give it to her...", parse);
				Text.NL();
				Text.Add("Grinning, you begin to stroke and caress the doberherm's dick with your [footDesc], gliding up and down along the soft, sensitive skin. You gently pinch it between your toes, flexing to squeeze it against her belly with just the right amount of pressure. Grinding up its length to her glans, you roll the tip of your foot against her pointy prick-tip, rubbing it up and down with each flex of your foot.", parse);
				Text.NL();
				Text.Add("The morph growls throatily beneath you as you continue to toy with her cock. You look down and smile as you see her panting for breath, eyes screwed closed and tongue hanging out, whimpering softly as your stroking [footDesc] touches a sensitive spot. From the insistent grin her lips curl into, and the way you can feel her prickflesh throbbing beneath your foot, you know she can't hold out much longer.", parse);
				Text.NL();
				Text.Add("Faster and rougher you go, stroking and squeezing, caressing and gliding, rolling your foot back and forth from bulging knot to drooling tip and back again, stirring at her seed-bloated balls with the tip of your toes before sliding back up her length again. Over and over you go until, at last, Miranda reaches her limits.", parse);
				Text.NL();
				Text.Add("With a throaty howl of pleasure, the morph's cock erupts in a geyser of seed, spraying thick spurts of off-white all over her belly and tits, caking your [footDesc] in a thick, dripping layer of girlspunk in the process. You shiver slightly as the warm sticky fluid washes over your [skinDesc], dabbling at her glans with the tip of your toes to let further spurts wash over you. Inevitably, though, even Miranda's balls expend themselves, and the sodden morph goes flaccid, panting as she lays in a great puddle of her own making.", parse);
				Text.NL();
				
				var cum = miranda.OrgasmCum();
				
				if(dom > 50) {
					Text.Add("<i>“Ah this feels great,”</i> she remarks hands moving to rub her breasts, plastered with her own jism. ", parse);
					if(miranda.flags["Footjob"] == 0) {
						Text.Add("<i>“Didn’t know feet could feel this good. You’re pretty creative when showing your dominance, aren’t you [masterMistress]?”</i>", parse);
						Text.NL();
						Text.Add("You nod and agree, then playfully inform her that you aren't done yet. There's still one last thing she needs to do…", parse);
						Text.NL();
						Text.Add("<i>“Really? What is it?”</i> she asks, raising a brow.", parse);
						Text.NL();
						Text.Add("Rather than say anything, you gently reach out with your semen-dripping [footDesc] and stroke it against her cheek, smearing a line of seed over onto her lips. Why, she needs to clean you off, of course, you tell her.", parse);
						Text.NL();
						Text.Add("<i>“Clean you?”</i>", parse);
						Text.NL();
						Text.Add("Yes, she heard you the first time. So she’d best open wide and start licking, you want your foot completely clean of her spunk.", parse);
						Text.NL();
						Text.Add("She shudders in renewed lust, licking her lips as a wide grin parts her muzzle. <i>“Alright, [masterMistress]. I’ll try.”</i>", parse);
					}
					else {
						Text.Add("<i>“But we aren’t done yet are we, [masterMistress]?”</i>", parse);
						Text.NL();
						Text.Add("With grin and a shake of your head, you reply that you most certainly aren't.", parse);
						Text.NL();
						Text.Add("<i>“Great, I love this part too,”</i> she licks her lips. <i>“Do it like you always do, I want to feel it,”</i> she says excitedly.", parse);
						Text.NL();
						Text.Add("Smirking, you gently caress your bitch's mouth with your cum-dripping sole, painting a thick stripe of jism over her lips. As you do so, you tease her that here's her special treat; she made this mess, now she's going to be a good bitch and lick it all clean.", parse);
					}
				}
				else {
					Text.Add("<i>“Heh, not my kink, but this didn’t feel half-bad.”</i> Miranda slumps on the floor, relaxing in afterglow. ", parse);
					if(miranda.flags["Footjob"] == 0) {
						Text.Add("<i>“Just give me some time to recover and we can get going,”</i> she adds.", parse);
						Text.NL();
						Text.Add("You chide her not to be so impatient; there's still something she needs to do first. You move your semen-dripping foot and place it just before her nose with an imperious gesture, declaring that neither of you are leaving until she cleans up the mess she made of your foot.", parse);
						Text.NL();
						Text.Add("<i>“What? You want me to lick it clean?”</i>", parse);
						Text.NL();
						Text.Add("You tell her that's correct, and so she had better get started.", parse);
					}
					else {
						Text.Add("<i>“Phew, I’m beat,”</i> she adds.", parse);
						Text.NL();
						Text.Add("Not so beat she's going to get out of cleaning up her mess, you inform her, raising your foot to her mouth for emphasis.", parse);
						Text.NL();
						Text.Add("Miranda sighs. <i>“You’re not going to let me get away with it are you?”</i>", parse);
						Text.NL();
						Text.Add("You simply shake your head in response. You won't, and she knows it.", parse);
						Text.NL();
						Text.Add("<i>“Fiiiine, let’s get it over with,”</i> she rolls her eyes.", parse);
					}
				}
				Text.NL();
				parse["hesitantly"] = miranda.SubDom() > 50 ? " hesitantly" : "";
				parse["dom"] = miranda.SubDom() > 50 ? " despite her earlier protests" : "";
				Text.Add("Miranda[hesitantly] starts with a tentative lick on the tip of your toes, a process she repeats a few times before moving down to lick the rest of her jism. She starts on a more languid pace, as if savouring the act to its fullest[dom]. Then she moves to suckle on each of your toes, using her tongue clean each one diligently.", parse);
				Text.NL();
				Text.Add("You patiently watch her as she laps you clean, turning and moving your foot to better allow her lapping tongue access to every inch. Finally, she has you cleaned up, and you lower your foot back to the floor, gently petting her on the head and quipping what a good dog she is.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("You fix the last of your [armorDesc] into place and straighten up, looking over to the equally dressed form of Miranda, waiting for you by the door. Pushing aside the pangs of desire that seeing her so obediently licking you clean after you got her off with just your foot inspired in you, you move to remove the chair barring the door so that the two of you can head back out into the tavern's main room.", parse);
					Text.Flush();
					player.AddLustFraction(0.5);
					PrintDefaultOptions();
				});
				miranda.flags["Footjob"]++;
			}, enabled : player.body.SoftFeet(),
			tooltip : "Miranda is getting out of hand. Teach the doberherm who runs this show and why."
		});
	}
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Miranda.TerryTavernSexDommyBJ = function() {
	var parse = {
		
	};
	
	Gui.Callstack.push(function() {
		Text.NL();
		Text.Add("As the two of you move through the Maiden's Bane, ready to start hunting for this mystery thief, you can't fail to notice the number of knowing smiles directed between patrons - both at you and the watch-dog, and at each other. Coupled with the whispering and the occasional stifled laugh, it's pretty obvious they all know what happened whilst you and Miranda were in the backroom. You cast a sidelong glance at Miranda, but the dobermorph doesn't seem to care in the slightest, making no sign that she acknowledges the other patrons.", parse);
		Text.Flush();
		
		PrintDefaultOptions();
	});
	
	Scenes.Miranda.TavernSexDommyBJ();
}

Scenes.Miranda.TerryTavernSexSubbyVag = function(cocks) {
	var p1Cock = player.BiggestCock(cocks);
	var parse = {
		playername : player.name
	};
	
	var knotted = p1Cock.knot != 0;
	
	var cum = Scenes.Miranda.TavernSexSubbyVag(cocks);
	var dom = player.SubDom() - miranda.SubDom();
	
	Text.NL();
	if(knotted) {
		Text.Add("When it’s finally over you can’t help but crash down atop the dog-morph herm. She groans, both with the pleasure of release and with your weight", parse);
		if(cum > 3) {
			if     (cum > 9) parse["cum"] = "pregnant-like belly";
			else if(cum > 6) parse["cum"] = "rounded tummy";
			else             parse["cum"] = "paunch";
			Text.Add(", not to mention the [cum] you gave her", parse);
		}
		Text.Add(". The two of you pant in unison, until Miranda finally breaks the silence.", parse);
		Text.NL();
		if(dom > 25) {
			Text.Add("<i>“Used and tied like a bitch,”</i> she groans. <i>“We should do that more often,”</i> she chuckles. ", parse);
			if(cum > 3)
				Text.Add("<i>“But damn, you really packed me full,”</i> she rubs her belly. ", parse);
			Text.Add("<i>“I guess no one is going to question my ownership after this one.”</i>", parse);
			Text.NL();
			parse["swollen"] = cum > 6 ? " swollen" : "";
			Text.Add("They most certainly aren't, you declare, and pat her[swollen] stomach possessively for emphasis.", parse);
		}
		else if(dom > -25) {
			Text.Add("<i>“Ugh, I’m fine with you using me, but did you have to tie me?”</i> she asks in protest.", parse);
			Text.NL();
			if(player.SubDom() > 0) {
				Text.Add("Like she wouldn't have done the same thing if your positions were swapped, you retort casually.", parse);
				Text.NL();
				Text.Add("<i>“I might, if we didn’t have a job to do. But what’s done is done, and it feels pretty good for me.”</i> She constricts you slightly with her pussy muscles. <i>“Don’t think I’ve been so deliciously spread in a while.”</i>", parse);
			}
			else {
				Text.Add("You apologise to her; she just felt so good, you couldn't help yourself, you had to tie with her.", parse);
				Text.NL();
				Text.Add("<i>“Couldn’t get enough of my pussy, huh? I know the feeling,”<i> she chuckles. <i>“We have a job to do, but it’s fine. Guess we can spare a few moments, especially since you did such a good job spreading my tight pussy over your huge knot.”</i>", parse);
			}
			Text.NL();
			Text.Add("Well, if she likes it so much, all she has to do is ask; you'd be happy to split her again anytime, you reply.", parse);
		}
		else {
			Text.Add("<i>“[playername]! You dumbass. We’re supposed to be looking for a thief, how are we going to do that with you glued to my ass?”</i> she angrily protests.", parse);
			Text.NL();
			if(player.SubDom() > 0)
				Text.Add("You snap right back that you doubt she would have thought to do otherwise if she had been the one giving the dick instead.", parse);
			else
				Text.Add("Doubtful as you may be that she would have been anymore considerate if your positions had been reversed, you can't bring yourself to protest, instead meekly hanging your head and accepting her chastisement.", parse);
			Text.NL();
			if(cum > 3) {
				if     (cum > 9) parse["cum"] = "pregnant woman";
				else if(cum > 6) parse["cum"] = "blob";
				else             parse["cum"] = "fatty";
				Text.Add("<i>“As if that wasn’t enough, you packed me so full that I look like a [cum],”</i> she adds. ", parse);
			}
			Text.Add("<i>“Personally, if we didn’t have a job to do, I’d totally tie you. But as it stands, we’re stuck here and there’s no helping that,”</i> she huffs. <i>“It did feel pretty good though. So I’ll forgive you for thinking with your dick rather than your head this time, silly goose,”</i> she finishes with a smile.", parse);
			Text.NL();
			Text.Add("You can't help but smile back, and thank her for understanding. Besides, it's certainly not a bad thing, being tied to someone like her.", parse);
		}
		Text.NL();
		Text.Add("It takes a while before you’re finally able to pull out of Miranda’s well-used honeypot, and you’re somewhat loathe to do so, but you gotta get going. Cleaning up takes long, but you expected as much. The bigger the party the bigger the aftermath you gotta clean up afterwards.", parse);
		Text.NL();
		Text.Add("After scouting for a missing pants, you’re both fully dressed, if a bit sore. <i>“Let’s get going [playername],”</i> Miranda announces with a pat on your back.", parse);
		Text.NL();
		Text.Add("You nod your head and agree, moving to dislodge the chair that served as your impromptu doorlock. Once it's safely out of the way, the pair of you head out from the bar... though it looks like your deeds weren't that private after all; you get more than a few chuckles and accusing fingers from the customers that you pass, and when you head past some guards, they throw both of you knowing grins.", parse);
	}
	else {
		Text.Add("Spent for the moment you collapse atop the doberman-morph, sending both of you crashing down onto the cushions below. You can feel Miranda’s stubby tail tickling your belly as she pants. <i>“Phew, that was pretty good [playername],”</i> she says.", parse);
		Text.NL();
		if(dom > 25)
			Text.Add("<i>“I love it when you rail me like I’m your bitch, I never thought being dommed could feel this good,”</i> she adds with a smile.", parse);
		else if(dom > -25)
			Text.Add("<i>“You know? I think I’m starting to like being fucked like that more and more. You do a pretty good job of getting me off when you’re doing me,”</i> she comments.", parse);
		else
			Text.Add("<i>“Keep getting me off like this and I won’t mind letting you into my pussy,”</i> she adds.", parse);
		Text.NL();
		Text.Add("You tell her that you're glad she enjoyed herself. The two of you lay there for a few moments more, catching your respective breaths, and then set about cleaning up the mess you made as best you can before getting back into your clothes.", parse);
		Text.NL();
		Text.Add("<i>“Alright then, let’s bust ourselves a thief,”</i> Miranda says, cracking her knuckles. <i>“You lead the way.”</i>", parse);
		Text.NL();
		Text.Add("Seeing no reason not to, you promptly pull aside the chair that the pair of you set up as an impromptu doorlock and slip outside. From the chorus of chuckles that echo in your respective wake, it's pretty clear that the clamor in the tavern wasn't enough to keep the two of you from going unnoticed.", parse);
	}
	
	Text.Flush();
	PrintDefaultOptions();
}

Scenes.Miranda.TerryChaseHome = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("The two of you pause on the street near Miranda’s house, both of you more than a little tired of searching for the elusive thief. Perhaps you could head inside to relieve some stress? Miranda certainly seems to have that idea in mind.", parse);
	Text.NL();
	if(miranda.Attitude() < Miranda.Attitude.Neutral) {
		Text.Add("<i>“Stop for a quick fuck, [playername]?”</i> Miranda shoots, stretching languidly. <i>“All this searching has me aching for some action, if you catch my drift. If not, I’m sure you’ll get what I mean in a few minutes when you are biting the pillow.”</i> The herm closes in on you with a hungry look in her eyes, herding you towards her door.", parse);
		Text.Flush();
		
		//[Let her][Not now]
		var options = new Array();
		options.push({ nameStr : "Let her",
			func : function() {
				Text.Clear();
				Text.Add("<i>“No complaints? Good bitch,”</i> she murmurs as she twirls you around, pushing you ahead. You make no attempt to stop her as she manhandles you through the door and slams it shut behind you.", parse);
				Scenes.Miranda.HomeSubbySex();
			}, enabled : true,
			tooltip : "She’s going to have her way with you no matter what you say, why resist?"
		});
		options.push({ nameStr : "Not now",
			func : function() {
				Text.Clear();
				parse["himher"] = terry.flags["Met"] < Terry.Met.Found ? "him" : "her";
				Text.Add("<i>“C’mon, I need some relief here!”</i> Miranda complains, attempting to shove you inside. You barely manage to avoid her grab, dancing outside her reach. <i>“Fine,”</i> she growls, <i>“but I’m getting some action today <b>one</b> way or another.”</i> That doesn’t sound like it bodes well for the thief when you finally catch [himher].", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Residental.street, {minute: 5});
				});
			}, enabled : true,
			tooltip : "Point out that you should perhaps look for the thief instead."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else { // nice
		var dom = player.SubDom() - miranda.SubDom();
		parse["mastermistress"] = dom > 50 ? player.mfTrue(" master", " mistress") : "";
		if(dom > 25)
			Text.Add("<i>“Having trouble focusing on the task at hand[mastermistress]?”</i> Miranda quips, licking her lips. <i>“Why don’t we head inside and see if we can relieve your stress?”</i>", parse);
		else if(dom > -25)
			Text.Add("<i>“Good plan, I need something to distract me from this thief for a while. How about we go inside for a quick fuck, [playername]?”</i>", parse);
		else
			Text.Add("<i>“The thief can wait, I need to bury my cock in someone before I go insane with boredom. How about it, [playername]? Want to step inside and take a ride on little Miranda?”</i>", parse);
		Text.Flush();
		
		//[Take charge][Let her lead][Not now]
		var options = new Array();
		options.push({ nameStr : "Take charge",
			func : function() {
				Text.Clear();
				Text.Add("You order her to stop chatting and open the door, taking the chance to give her butt a grope before pushing the surprised herm inside. You step inside and close the door after you. Time to take both of your minds off chasing thieves for a while.", parse);
				
				Scenes.Miranda.HomeDommySex();
			}, enabled : true,
			tooltip : "Take her inside and fuck her."
		});
		options.push({ nameStr : "Let her lead",
			func : function() {
				Text.Clear();
				parse["boyGirl"] = player.mfTrue("boy", "girl");
				Text.Add("You nod eagerly, looking at her imploringly. <i>“Good [boyGirl],”</i> Miranda grins, twirling you around and pushing you through the doorway into her home. The dobie closes the door after you, sealing off your escape.", parse);
				Scenes.Miranda.HomeSubbySex();
			}, enabled : true,
			tooltip : "Let Miranda take you inside and relieve her stress."
		});
		options.push({ nameStr : "Not now",
			func : function() {
				Text.Clear();
				Text.Add("<i>“You are such a tease sometimes, you know that?”</i> Miranda complains. She grudgingly nods in agreement, leading the way as you try to figure out where to search next.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Residental.street, {minute: 5});
				});
			}, enabled : true,
			tooltip : "You should focus on catching the thief instead."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
}

world.loc.Rigard.Residental.miranda.description = function() {
	
}
world.loc.Rigard.Residental.miranda.onEntry = function() {
	if(rigard.Krawitz["Q"] == Rigard.KrawitzQ.HuntingTerry)
		Scenes.Miranda.TerryChaseHome();
	else
		PrintDefaultOptions();
}

