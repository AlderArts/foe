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
	
	this.maxHp.base        = 100;
	this.maxSp.base        = 10;
	this.maxLust.base      = 50;
	// Main stats
	this.strength.base     = 23;
	this.stamina.base      = 19;
	this.dexterity.base    = 19;
	this.intelligence.base = 12;
	this.spirit.base       = 11;
	this.libido.base       = 24;
	this.charisma.base     = 14;
	
	this.level    = 1;
	this.sexlevel = 1;
	
	this.body.DefHerm(true);
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 7;
	this.FirstCock().length.base = 28;
	this.FirstCock().thickness.base = 7;
	this.FirstVag().virgin = false;
	this.Butt().virgin = false;
	this.body.SetRace(Race.dog);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"]      = Miranda.Met.NotMet;
	this.flags["Attitude"] = Miranda.Attitude.Neutral;
	this.flags["Thief"]    = 0;
	this.flags["RotGuard"] = 0;
	this.flags["Forest"]   = 0;
	
	//Peasants' gate antics
	this.flags["gBJ"]      = 0;
	this.flags["gAnal"]    = 0;
	this.flags["gBribe"]   = 0;

	this.flags["public"]   = 0;
	this.flags["Dates"]    = 0;
	
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

Miranda.prototype.FromStorage = function(storage) {
	this.subDom.base         = parseFloat(storage.subDom)  || this.subDom.base;
	this.slut.base           = parseFloat(storage.slut)    || this.slut.base;
	this.relation.base       = parseFloat(storage.rel)     || this.relation.base;
	
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
	for(var flag in storage.sex)
		this.sex[flag] = parseInt(storage.sex[flag]);
}

Miranda.prototype.ToStorage = function() {
	var storage = {};
	if(this.subDom.base   != 0) storage.subDom = this.subDom.base;
	if(this.slut.base     != 0) storage.slut   = this.slut.base;
	if(this.relation.base != 0) storage.rel    = this.relation.base;
	storage.flags = this.flags;
	storage.sex   = this.SaveSexStats();
	
	return storage;
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

// Party interaction
Miranda.prototype.Interact = function() {
	Text.Clear();
	Text.AddOutput("Woof Imma doggie.");
	
	
	if(DEBUG) {
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: relation: " + miranda.relation.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: subDom: " + miranda.subDom.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: slut: " + miranda.slut.Get()));
		Text.Newline();
	}
	
	Gui.NextPrompt(function() {
		PartyInteraction();
	});
}

// Events
Scenes.Miranda = {};

Scenes.Miranda.RigardGatesDesc = function() {
	Text.Add("<i>”Ho!”</i> Miranda greets you as you approach the gate. The dog-morph is lounging beside the gatehouse, ");
	
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
		Text.Add("<i>”Still no luck getting a pass? Sorry, but you know I can’t let you in without one,”</i> Miranda tells you bluntly.", parse);
		Text.NL();
	}
	
	if(miranda.Attitude() > Miranda.Attitude.Neutral)
		Text.Add("<i>”If you feel brave enough, I could treat you to another night on the town,”</i> the guardswoman suggests, winking at you. <i>”Meet me at the tavern in the slums after dark and we’ll party hard!”</i>", parse);
	else if(miranda.Attitude() < Miranda.Attitude.Neutral)
		Text.Add("<i>”So you come crawling back here, eh?”</i> The guardswoman looks at you dismissively. <i>”I really don’t have the time for you right now, but meet me in the slums later if you are feeling brave. Brave or stupid.”</i>", parse);
	else
		Text.Add("<i>”Head over to the Maidens’ Bane tavern in the slums once in a while, we can have a drink and chat a bit.”</i>", parse);
	Text.Flush();
	
	// TODO: Add interactions (sex)
	Gui.NextPrompt();
}

Scenes.Miranda.RigardGatesEnter = function() {
	var parse = {
		playername : player.name
	};
	
	if(miranda.Attitude() < Miranda.Attitude.Neutral) { // bad
		Text.Add("<i>”What now?”</i> Miranda asks shortly as you approach the gates.", parse);
		if(miranda.Relation() < 25)
			Text.Add(" She doesn’t look too happy to see you.");
		if(rigard.GatesOpen())
			Text.Add(" <i>”You are not getting inside the city during night hours, pass or no pass,”</i> she growls. <i>”Not through this gate.”</i>", parse);
		else if(rigard.Visa()) {
			Text.Add("You show her your visa to enter the city, but she seems unwilling to let you in either way. <i>”Come over here, standard procedure,”</i> she growls. During the next hour or so, she hounds you with questions about your business in the city, though you can tell she is clearly just fucking with you and wasting time.", parse);
			Text.NL();
			Text.Add("Something tells you that you are lucky though, as you suspect that if not for the other guard posted there, you’d be up for a cavity search. Eventually, the vindictive guardswoman lets you through the gates into Rigard.", parse);
			Text.NL();
			Text.Add("<i>”Why not come by the peasants’ gate more?”</i> Miranda calls after you. <i>”It’s a much more… comfortable environment.”</i>", parse);
			if(miranda.flags["gBJ"] > 0)
				Text.Add(" Your cheeks burn, but at least she let you inside, and with less humiliation than usual.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Rigard.Gate, {hour: 1});
			});
			return;
		}
		else {
			Text.Add("<i>”You know damn well you aren’t getting through here without a pass,”</i> she growls. There is a dangerous glint in her eyes as she adds: <i>”Come by the slum-side gate when I’m on duty sometime, I might show mercy on you.”</i>", parse);
		}
	}
	else if(miranda.Attitude() > Miranda.Attitude.Neutral) { // good
		Text.Add("<i>”Heading in?”</i> Miranda asks you as you approach the gates. <i>”Don’t be a stranger now!”</i>", parse);
		Text.NL();
		if(rigard.Visa()) {
			if(rigard.GatesOpen()) {
				Text.Add("The guardswoman waves you through, feeling you up familiarly as you pass her. <i>”Come join me for a drink or two later, okay?”</i>", parse);
			}
			else { // !open
				Text.Add("The guardswoman looks around her quickly, studying her half asleep companion. She quickly gestures for you to come with her, leading you to a side gate. <i>”Don’t tell anyone I let you in, okay? The gates are supposed to be shut at this hour.”</i>", parse);
			}
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Rigard.Gate, {minute: 5});
			});
			return;
		}
		else
			Text.Add("<i>”Sorry, I can’t let you through without a pass, [playername]. Come by the pub when I’m off duty, perhaps I can help you get one.”</i>", parse);
	}
	else { // neutral
		if(rigard.GatesOpen()) {
			Text.Add("<i>”Pass please,”</i> the guardswoman drones as you inquire about entry to the city.", parse);
			if(rigard.Visa()) {
				Text.Add("<i>”All seem to be in order, welcome to Rigard.”</i> She ushers you through the gates, already busy with the next person in line.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Gate, {minute: 5});
				});
				return;
			}
			else
				Text.Add("<i>”No pass, no entry. Sorry, those are the rules.”</i> She adds that she’s still up for a drink after work at the pub.", parse);
		}
		else
			Text.Add("<i>”Gates are closed, ‘m afraid. Come back during daytime. Check in between eight in the morning and five in the evening.”</i>", parse);
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
	
	Text.Add("<i>”[playername],”</i> Miranda nods in your direction as you approach. The dog-morph is seated at a wooden table beside the peasants’ gate, ", parse);
	
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
	
	Text.Add("<i>”Quite the rural neighbourhood, isn’t it?”</i> Miranda grunts, waving at the muddy streets near the gate. <i>”Still, I grew up in these parts, so I’ll always have a soft spot for it, no matter how much of a cesspit it is.”</i>", parse);
	if(miranda.Attitude() == Miranda.Attitude.Neutral) {
		Text.NL();
		Text.Add("<i>”If you haven’t already, you should check out the local tavern, the Maidens’ Bane,”</i> Miranda suggests, <i>”I hang around there after work. Cozy little place.”</i>", parse);
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
			Text.Add("Miranda looks around, trying to see if any of her comrades overheard you. <i>”Keep it down will you?!”</i> she hisses, <i>”I’m not supposed to let you in without a pass, you know. Meet me at the tavern after work and we’ll talk.”</i>", parse);
		else if(miranda.Attitude() < Miranda.Attitude.Neutral) { // nasty
			Text.Add("The dog-morph eyes you flatly. <i>”Why should I take that risk for you? There’d better be something in it for me if you want inside.”</i>");
			Text.Flush();
			
			Scenes.Miranda.RigardGatesBribe();
			return;
		}
		else
			Text.Add("<i>”Why should I let you in?”</i> the dog-morph replies flatly. <i>”I’m sure you’re a nice [guygal], but I’m not risking my job for someone I barely know. Come back with a pass.”</i>", parse);
		Text.NL();
		Text.Flush();
		PrintDefaultOptions(true);
	}
	else { //Visa
		if(miranda.Attitude() < Miranda.Attitude.Neutral) { // nasty
			Text.Add("<i>”Aww… you want to get in? What’s in it for me?”</i> Miranda asks, toying with you.", parse);
			Text.Flush();
			
			Scenes.Miranda.RigardGatesBribe();
		}
		else if(miranda.Attitude() > Miranda.Attitude.Neutral) { // nice
			Text.Add("<i>”Sure, come right through, honey,”</i> Miranda grins as you pass her, giving your [buttDesc] a familiar slap. <i>”Come see me at the tavern later, okay?”</i>", parse);
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
				Text.Add("<i>”It looks to be in order,”</i> Miranda concludes after looking over your papers. She waves you through the gates, adding that you should come visit her at the tavern after work some time.", parse);
				Text.NL();
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Gate, {minute: 5});
				});
			}
			else {
				Text.Add("<i>”Sorry, I can’t let you in while the gate is shut. Come back during the open hours, eight in the morning to five in the evening.”</i>", parse);
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
				Text.Add("<i>”Cute, [playername],”</i> the guardswoman scoffs. <i>”Things work a bit differently here in the slums, though. This is my turf, my rules. Pass or no pass.”</i>", parse);
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
				Text.Add("<i>”Fuck off,”</i> she curtly dismisses you, not interested in your money.", parse);
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
				Text.Add("<i>”Now you’re talking!”</i> The dog-morph gets up from her post, motioning for you to follow her. The curious looks from the other guards bore into your back as you trot along behind the herm.", parse);
				Text.NL();
				Text.Add("You reach the entrance of a dark alley, and Miranda firmly grabs you, pulling you inside. Pushing you down easily - the bitch is frightfully strong - she grinds her bulge against your face. <i>”Feel that?”</i> she grunts. You definitely can, as her cock strains against her leather pants, striving to be free.", parse);
				Text.NL();
				Text.Add("Holding your head in place with one hand, the other expertly undoes her britches, releasing her thick slab of meat, which promptly slaps you.", parse);
				Text.NL();
				Text.Add("<i>”Little Miranda is antsy, why don’t you try to soothe her,”</i> the grinning dog-herm says mockingly. To make her point clear, she nudges your lips with her stiffening [mcockDesc]. Uncertainly, you open your mouth, completely caught off guard when she roughly shoves her way inside.", parse);
				Text.NL();
				
				Sex.Blowjob(player, miranda);
				player.FuckOral(player.Mouth(), miranda.FirstCock(), 2);
				
				Text.Add("<i>”Yeeeees, good little slut, so eager,”</i> Miranda encourages you, her hips slowly pushing forward as she forces more of her monster cock past your lips. Your senses are overwhelmed by her smell, her taste, your [tongueDesc] lathered in her pre as she rubs the [mcockTip] of her dick on it repeatedly. <i>”You are going to have to do better if you want your reward, though,”</i> she grins. <i>”Only dedicated cocksuckers get inside on my watch!”</i>", parse);
				Text.NL();
				Text.Add("Dedicated or not, it is clear that the dickgirl intends to make as much of this opportunity as possible, grabbing hold of your head with both hands to get a firm grip. With her prey secured, Miranda starts to fuck you in earnest, thrusting her cock into your poor throat to the hilt. Once in a while, she pauses for a while, holding you in place with her shaft firmly lodged in your throat, making sure you realize that she is in full control.", parse);
				Text.NL();
				Text.Add("<i>”Now suck!”</i> she barks, loud enough for her voice to carry into the street. Dejectedly, you obey her, seeing no other way out of the situation. <i>”Ngh, that’s the way, bitch,”</i> Miranda grunts, moaning as you service her member. <i>”Keep it up now, and you’ll get your just reward!”</i>", parse);
				Text.NL();
				Text.Add("True to her word, it’s not long before the dog-herm’s breath grows short, her rutting hip-movements becoming more erratic. With both her hands keeping your head firmly in place, you have little choice but to accept whatever is coming, through you grow worried as you feel her knot swelling in your mouth. Thankfully, the guardswoman pulls it out just in time, narrowly saving you from death through suffocation.", parse);
				Text.NL();
				Text.Add("<i>”Take my load, bitch!”</i> the herm yells, pouring her thick cum down your throat and into your [stomachDesc]. You swallow dutifully, but you can feel her seed rising in your throat, the pressure being too high. Despite your efforts, some of it leaks out, trailing down your chin. Finally, the sadistic dog-herm pulls out, allowing you to breathe again.", parse);
				Text.NL();
				
				player.AddLustFraction(0.3);
				miranda.AddLustFraction(-1);
				miranda.relation.IncreaseStat(100, 3);
				miranda.subDom.IncreaseStat(100, 5);
				player.subDom.DecreaseStat(-50, 1);
				player.slut.IncreaseStat(100, 2);
				
				if(!rigard.Visa()) {
					Text.Add("<i>”Now then,”</i> Miranda says while you are still reeling and coughing from your rough face fuck, <i>”why don’t we go ahead and get you that pass?”</i> Almost feeling as if you’ve been drugged, you tag along after the guardswoman, who enters a side gate and lets you into the city.", parse);
					Text.NL();
					Text.Add("<i>”That wasn’t so hard now was it?”</i> Miranda smirks at your blush. <i>”You should come by and suck my cock more often, make it a regular thing. At least if you want to enter the city again.”</i> Before you can contemplate what she means by that, you’ve arrived at a small booth, manned by a bored-looking city official.", parse);
					Text.NL();
					Text.Add("The guardswoman explains that you are here to write out a pass for you, and that she’ll vouch for you. The administrator eyes you curtly, disapproval clear in his furrowed brow. With a start, you realize that Miranda’s cum is still trailing down from your lips, and you promptly wipe it off, blushing.", parse);
					Text.NL();
					Text.Add("The procedure is rather arduous, but at last you stand there with your visa in hand, and stomach full of semen. <i>”Later!”</i> Miranda waves dismissively as she walks back to her post, chuckling to herself.", parse);
					Text.NL();
					Text.Add("Well, at least you got a pass now, you tell yourself.", parse);
					Text.NL();
					Text.Add("<b>Acquired citizen’s visa!</b>", parse);
					
					rigard.flags["Visa"] = 1;
				}
				else {
					Text.Add("<i>”Enjoy your visit to Rigard, citizen,”</i> Miranda snickers, opening the gates for you. Staggering through, you enter the streets of the city. With a sinking heart, you realize this will probably be a regular theme for your visits.", parse);
				}
				
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Residental.street, {hour: 1});
				});
			}
			else { // Repeat blowjob
				if(miranda.flags["gBJ"] < 5)
					Text.Add("<i>”You know the drill, come with me.”</i> Miranda leads you into a back alley, pushing  your head down to her crotch and pulling out her [mcockDesc]. <i>”I’m sure you remember what to do.”</i> Meekly, you grasp her member, licking the [mcockTip] demurely. In your [hand]s, the hermaphrodite grows stiff, her rock-hard cock point right at you.", parse);
				else {
					parse["Bewildered"] = miranda.flags["public"] == Miranda.Public.Nothing ? "Bewildered, y" : "Y";
					Text.Add("You wait for Miranda to get up, but she just leans back languidly. <i>”Well, what are you waiting for?”</i> she asks, annoyed, <i>”start sucking, slut.”</i> She parts her legs, exposing her bulge to you. [Bewildered]ou glance around at the other guards, but Miranda redirects your attention to her crotch.", parse);
					Text.NL();
					Text.Add("<i>”Don’t mind them, this is the reason you came here anyways, isn’t it?”</i> By now, you might as well conceed her point… there are other ways for you to get into Rigard at this point, and yet here you are, back to get another mouthful of her [mcockDesc]. The others have most likely gotten a good idea of what is going on already anyways.", parse);
					if(miranda.flags["public"] < Miranda.Public.Oral)
						miranda.flags["public"] = Miranda.Public.Oral;
				}
				Text.NL();
				parse["head"] = player.HasHorns() ? player.HasHorns().Short() : player.Hair().Short();
				Text.Add("<i>”Suck,”</i> she commands, taking a firm hold of your [head]. Swallowing your pride - and her pre - you start bobbing your head up and down on her shaft, spreading your saliva along the thick pillar of cockmeat. The guardswoman lets you set your own pace for a while, before she takes charge, setting her own rhythm. Like always, the dominant herm is rough with you, showing little care for your well-being as she ravages your throat.", parse);
				Text.NL();
				
				Sex.Blowjob(player, miranda);
				player.FuckOral(player.Mouth(), miranda.FirstCock(), 2);
				
				player.AddLustFraction(0.3);
				miranda.AddLustFraction(-1);
				miranda.subDom.IncreaseStat(50, 1);
				player.subDom.DecreaseStat(-50, 1);
				
				world.TimeStep({minute: 30});
				
				Text.Add("Once more, you’re rewarded with a stomach-full of Miranda’s thick spunk, the excess slowly trickling down your chin, marking you for the slut you are.", parse);
				Text.NL();
				if(miranda.flags["gBJ"] < 5) {
					Text.Add("<i>”You’re starting to get the hang of this, [playername],”</i> she congratulates you. <i>”How about making it a career of being my bitch?”</i>", parse);
					Text.NL();
					if(rigard.GatesOpen()) {
						Text.Add("<i>”Well, what are you waiting for?”</i> Miranda tugs you to a side gate, out of sight from the main one. <i>”Now, remember that pass or no pass, you are here on <b>my</b> whim. Don’t let me catch you messing around in my town, or I might get some ideas.”</i> Coming from her, you have no doubt that it’s a serious threat.", parse);
						Text.NL();
						Text.Add("Wiping the remaining droplets of the dog-herm’s cum from your lips, you enter the city of Rigard.", parse);
						
						Gui.NextPrompt(function() {
							MoveToLocation(world.loc.Rigard.Residental.street, {minute: 5});
						});
					}
					else {
						Text.Add("<i>”Oh… that’s right, look at the time,”</i> Miranda grins lecherously. <i>”Sorry, the gates are closed at this hour, please come back later.”</i> With that, she summarily dismisses you. You are left standing there, feeling rather foolish.", parse);
						Gui.NextPrompt();
					}
				}
				else {
					Text.Add("<i>”Putting on such a good show for the masses, [playername],”</i> she praises you, gesturing to her grinning colleagues. Quite a few of them have their own cocks out, stroking themselves. <i>”Thanks for the blowjob, bitch,”</i> Miranda grins. <i>”Now shove off, I got work to do.”</i> When you protest that you had a deal, she only laughs at you.", parse);
					Text.NL();
					Text.Add("<i>”You agreed to that way too quickly. I’ve been going too easy on you it seems. If you want to negotiate for entry, you better bring something different to the table...”</i> The hermaphrodite gives your [buttDesc] a sound slap as she passes you, making her meaning clear.", parse);
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
					Text.Add("<i>”Mmm… depends on how good you are,”</i> she purrs at your offer. <i>”But I’m not one to say no to such an offer. Come along here, my little slut.”</i> She leads you to a narrow back alley close to the barracks. For the slums, the smell isn’t so bad. <i>”C’mon, show me the goods,”</i> Miranda murmurs, licking her lips hungrily.", parse);
					Text.NL();
					Text.Add("Turning around, you blush as you lean against the wall of one of the nearby shacks, shivering as her rough hands quickly relieve you of your [bottomArmorDesc], groping the [skinDesc] of you [buttDesc]. You jolt and whimper in surprise when the herm places the tip of her [mcockDesc] against your [anusDesc]. R-really? Not even any preparation?", parse);
					Text.NL();
					Text.Add("<i>”What? You did offer it yourself, did you not?”</i> You feel a wet splatter against your back door as she applies some spit. <i>”There, feel better now? You might want to bite down for this though...”</i>", parse);
					Text.NL();
					if(virgin) {
						Text.Add("Caught in a bout of panic, you blabber on about how this is your first time, and please, please be gentle. The sincerity catches the dominant herm off-guard, though her hold on your butt remains firm.", parse);
						Text.NL();
						Text.Add("<i>”You’d give your first to me…?”</i> Miranda’s voice sounds uncharacteristically small and hesitant. <i>”I’ll take it, but lets drop the pretense that you are doing this just to get into the city, will you? You have a slutty streak running as deep as the roots of the Great Tree!”</i>", parse);
						Text.NL();
						Text.Add("Her brief vulnerable moment over, she continues more confidently: <i>”As for me being gentle… you are asking the wrong girl. How about this? I’ll start with just the tip… followed by the knot. Repeatedly.”</i>", parse);
						
						miranda.relation.IncreaseStat(100, 10);
					}
					Text.NL();
					Text.Add("No sooner has she uttered the words than she acts on them, her hips pushing forward, ramming through whatever defenses you are able to scrape together with ease. You are too shocked at the sudden intrusion to even voice a protest, gasping for air as you feel her thick rod sliding into your [anusDesc].", parse);
					Text.NL();
					
					Sex.Anal(miranda, player);
					player.FuckAnal(player.Butt(), miranda.FirstCock(), 4);
					miranda.Fuck(miranda.FirstCock(), 3);
					
					Text.Add("<i>”See, not too bad, is it?”</i> The guardswoman grunts, shoving another few inches inside you.", parse);
				}
				else if(miranda.flags["gAnal"] < 5) { // repeat < 5
					Text.Add("<i>”Back for another rough buttfucking? You really are a slut, you know that right?”</i> You bow your head a bit shamefully, unable to deny her accusation. <i>”Be my guest,”</i> she shrugs, gesturing for you to enter the alleyway. <i>”I’ll be right back, guys, just need to ram a long, thick cock up this little bitch’ ass,”</i> Miranda tells her grinning companions. You can feel their gazes burning into your back as you follow the herm.", parse);
					Text.NL();
					Text.Add("<i>”Bend over for me,”</i> she growls, her breath quickening as she fumbles with her britches, freeing her monster cock. You obey, gasping as she all but tears through your gear, exposing your [buttDesc] and your soon-to-be-fucked hole. <i>”If last time didn’t break you, I’ll just have to try harder this time, won’t I?”</i> Hardly words to settle your uneasy mind, especially with her [mcockTip] pressing against your [anusDesc]. You feel something cold and slippery pouring down your taint, lubing you up for the coming anal assault.", parse);
					Text.NL();
					Text.Add("Even if she gives you that courtesy, it is the only one you’ll get. In one smooth motion, the hermaphrodite canine rams her cock home with all her strength, roughly impaling you on her stiff pole.", parse);
					Text.NL();

					Sex.Anal(miranda, player);
					player.FuckAnal(player.Butt(), miranda.FirstCock(), 4);
					miranda.Fuck(miranda.FirstCock(), 3);
					
					Text.Add("<i>”Not sure you’ll be able to walk after this one,”</i> the guardswoman grunts as she slams her hips against yours. <i>”Would be a shame, wouldn’t it, going through all of this only to be unable to enter the city afterwards!”</i>", parse);
				}
				else { // repeat >= 5
					parse["hisher"] = player.mfTrue("his", "her");
					Text.Add("<i>”Everyone, meet [playername], town slut,”</i> Miranda dramatically introduces you to the other guards, <i>”about to get [hisher] ass fucked by me. I might even allow sloppy seconds.”</i>", parse);
					Text.NL();
					if(miranda.flags["public"] < Miranda.Public.Sex) {
						Text.Add("You start protesting - surely this is too much, even for her - but she cuts you off with a sharp bark.", parse);
						Text.NL();
						Text.Add("<i>”Wouldn’t want to be caught obstructing the long, thick, veiny cock of the law now, would you [playername]?”</i> Miranda growl menacingly. <i>”The guys know all about our little deal, so don’t go looking to them for help. You might play hard to get, but deep down you know you are a total slut for my cock, and you want nothing more than for me to fuck your brains out.”</i>", parse);
						Text.NL();
						Text.Add("Dejectedly, you give in. She’s going to have things go her way, whatever you say or do.", parse);
						Text.NL();
						
						miranda.subDom.IncreaseStat(100, 5);
						player.subDom.DecreaseStat(-100, 5);
						
						miranda.flags["public"] = Miranda.Public.Sex;
					}
					parse["himher"] = player.mfTrue("him", "her");
					Text.Add("Cheeks burning slightly under the scrutiny of the other guardsmen - most of them male, and quite obviously throwing you lecherous glances - you disrobe, bending over the table obediently. <i>”See how well I’ve trained [himher],”</i> Miranda brags.", parse);
					Text.NL();
					if(miranda.SubDom() - player.SubDom() > 50 && Math.random() < 0.5) {
						Text.Add("<i>”Now beg for my cock. Show them how much you need it.”</i>", parse);
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
					Text.Add("<i>”Tell me, [playername],”</i> she grunts in your ear, her breasts pressing against your back, <i>”[cock] ever see any action? Or are you too busy getting nailed by everyone you meet?”</i>", parse);
					Text.NL();
				}, 1.0, function() { return player.FirstCock() && !virgin; });
				scenes.AddEnc(function() {
					Text.Add("<i>”Perhaps next time, I’ll try out that cunt of yours, hmm?”</i> she grunts, one hand trailing down to probe your wet nether lips.", parse);
					Text.NL();
				}, 1.0, function() { return player.FirstVag(); });
				scenes.AddEnc(function() {
					Text.Add("<i>”Nice tits,”</i> she compliments you, <i>”bet they are good cushions, with all the time you spend on your stomach getting railed!”</i>", parse);
					Text.NL();
				}, 1.0, function() { return player.FirstBreastRow().Size() > 3; });
				scenes.AddEnc(function() {
					Text.Add("<i>”Found your true calling, boy?”</i> she mocks you. <i>”If it makes you feel any better, you are not the first guy to get a full dose of Miranda, not by a long shot.”</i>", parse);
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
				Text.Add("<i>”Better hope you are ready for this,”</i> Miranda grunts.", parse);
				Text.NL();
				if(first)
					Text.Add("It quickly becomes very apparent what she is referring to, as the next push brings a new experience. You didn’t think that your ass could be stretch any more than it already is, but the guardswoman is eager to prove you wrong.", parse);
				else
					Text.Add("Once again, you feel an old friend probing your back door, spreading your colon further.", parse);
				Text.Add(" Even before it has begun to swell, her knot is formidable - quite a bit thicker than her already girthy shaft. It takes some effort to ram the ball home, but Miranda isn’t one who is going to let that hinder her. With a final slam of her hips, she pushes it inside, buried to the root in your tortured anus.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>”Another cherry popped, score one Miranda!”</i> the herm boasts, pumping her fist.", parse);
				}, 1.0, function() { return virgin; });
				scenes.AddEnc(function() {
					Text.Add("<i>”Does that hurt? Knot my problem, slut,”</i> she says, mockingly.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>”Feel comfortable? Cause I’m not going anywhere any time soon.”</i> No doubt she’s right - once that knot starts to swell, there is no way you are getting it out.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					parse["heshe"] = player.mfTrue("he", "she");
					Text.Add("<i>”Told you [heshe] could take it,”</i> Miranda boasts to her colleagues.", parse);
				}, 1.0, function() { return audience; });
				
				scenes.Get();

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
					Text.Add("<i>”Better settle in, we’ll be here for a while,”</i> Miranda pants, lying down on your back. <i>”For some reason, I never have anyone run out on me. Must be my charisma.”</i> That and the knot currently sealing your asshole shut. Damn thing feels like its the size of a melon.", parse);
				else if(audience) {
					Text.Add("You yelp loudly as Miranda sits back down on her bench, dragging you with her by your ravaged sphincter. She lets you lie back and rest, chatting with the other guards as you wait for her knot to deflate. You are too exhausted to glean much from the conversation, though you can tell that they are talking about you. Perhaps deciding who gets to go next.", parse);
					if(Math.random() < 0.5) {
						Text.NL();
						Text.Add("<i>”Sure, but you owe me one,”</i> you hear Miranda saying. Flicking your eyes open, you see the fuzzy outline of one of the guards standing in front of you. Before you really have any time to contemplate what he is doing, you feel the hot splatter of spunk landing on your [breastDesc].", parse);
						Text.NL();
						Text.Add("By the time the entire patrol has deposited their loads, you are covered in cum, both inside and out. Humiliated beyond belief, yet unable to will your tired limbs into action, you have no choice but to lie there and take it.", parse);
					}
				}
				else
					Text.Add("<i>”I wonder how many times I have to come before it comes out the other end,”</i> Miranda ponders, rubbing your [stomachDesc]. From the tone in her voice, you can tell it isn’t just her making a jab at you, she really wants to know. You just hope she doesn’t decide to test it.", parse);
				Text.Flush();
				
				miranda.relation.IncreaseStat(50, 1);
				miranda.subDom.IncreaseStat(100, 1);
				player.subDom.DecreaseStat(-100, 1);
				player.slut.IncreaseStat(80, 1);
				world.TimeStep({hour: 1});
				
				miranda.flags["gAnal"]++;
				
				Gui.NextPrompt(function() {
					Text.Clear();
					
					Text.Add("Eventually, Miranda’s knot shrinks down again to merely unmanageable size. With a grunt and a rough shove, the herm dislodges herself from your abused anus, laughing as you fall to the ground. What feels like several gallons of her semen pours out of your gaping butt. You still feel weak and extremely sore after the rough fuck, but you should be able to move again shortly.", parse);
					Text.NL();
					Text.Add("<i>”This time is for free. Ain’t I a generous soul?”</i> The dommy doggie wipes herself off on you before pulling on her pants again, trying to restore her disheveled uniform.", parse);
					Text.NL();
					if(rigard.GatesOpen()) {
						Text.Add("<i>”Well, go ahead, enter. Unless you want to stay for another round,”</i> Miranda waves you toward the gates, not even bothering to get up and open them for you. Hobbling slightly, you make your way inside the city.", parse);
						Text.Flush();
						
						Gui.NextPrompt(function() {
							MoveToLocation(world.loc.Rigard.Residental.street, {minute : 10});
						});
					}
					else {
						Text.Add("<i>”Oh right, look at the time,”</i> Miranda grins widely as she adjusts her clothes. <i>”Gates are closed, bitch, better luck next time.”</i> She pats her package fondly. <i>”If you don’t have anything else on your agenda, little Miranda will soon be up for another round...”</i>", parse);
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
		Text.AddOutput("<i>\"I have heard that there is some difficulty entering the city,\"</i> the elf informs you, <i>\"but since I am a servant of Lady Aria, there should be no problem getting in. The rulers of the kingdom have always been good friends of the order.\"</i>", parse);
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
	Text.AddOutput("<i>\"Reason for visiting Rigard? Carrying any illegal substances? Planning to kill any important officials?\"</i> she drones mechanically, going through her routine while allowing her gaze to unabashedly roam your body. Not to be outdone, you return the gesture.", parse);
	Text.Newline();
	Text.AddOutput("She is tall and athletic, her movements suggesting powerful muscles beneath her short fur - mostly black or dark brown, with patches of a bright orange on her hands, legs, chest and face. Her long black hair is pulled back in a loose braid hanging down to her waist. Strangely enough, you note that it is held together by a pink ribbon, very much at odds with her otherwise martial outfit.", parse);
	Text.Newline();
	Text.AddOutput("Said outfit does a poor job of containing her generous bust, which seems to be ready to spring out at any moment. Her uniform is made from tight-fitting studded leather, with a short leather skirt that ends just above the knees. As the guardswoman shifts her hips, something seems to move under the skirt.", parse);
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.AddOutput("<i>\"Hey, eyes up here,\"</i> she barks sharply, slightly amused. <i>\"Well?\"</i> she challenges, holding out her hand. A bit embarrassed, you realize that you completely spaced out for a second there. <i>\"Visitor's pass?\"</i> she repeats her question.", parse);
		Text.Newline();
		
		if(party.InParty(kiakai)) {
			Text.AddOutput("<i>\"Ah, madam, excuse me?\"</i> [name] piques in. The guardswoman turn her icy stare on the elf. [HeShe] shrinks back a little, swallowing. <i>\"Um, you see, I am from the order-\"</i>", parse);
			Text.Newline();
			Text.AddOutput("<i>\"Do you have a pass?\"</i> the dog-morph cuts [himher] off. The elf looks crestfallen, shaking [hisher] head miserably. <i>\"Then I'm afraid I can't let you in.\"</i>", parse);
		}
		else
			Text.AddOutput("You shake your head, bewildered. This is the first you've heard of this.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Look, I'm sorry,\"</i> the guard apologizes. <i>\"New directives from above, I can't let anyone into the city without a valid pass.\"</i> You ask her where one would get such a pass. <i>\"From the identification bureau, corner of Bankers' and Minstrel street.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("What? It is <i>inside</i> the city?", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Look, I didn't say it made sense, but it's the law,\"</i> she sighs, exasperated, <i>\"I'd like to let you in, but I just can't. You've shown up in times of unrest, the royals and noble families are very suspicious of strangers, what with the outlaw insurgency going on.\"</i>", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Is there a problem, Miranda?\"</i> The dog-morph's partner, a muscular guardsman sporting feline ears.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Nosir, no problem sarge,\"</i> the woman - apparently named Miranda - replies languidly. She somehow manages to make this sound mocking. Grumbling, her superior shrugs, heading inside again. The dog-morph rolls her eyes.", parse);
		Text.Newline();
		Text.AddOutput("<i>\"Well, you got mine, what's yours?\"</i>", parse);
		Text.Newline();
		Text.AddOutput("Seeing as you don't seem to be getting anywhere, you introduce yourself[comp].", parse);
		Text.Newline();
		Text.AddOutput("<i>\"A pleasure,\"</i> Miranda grins.", parse);

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
				Text.AddOutput("<i>\"As I said, the only way to legitimately obtain a pass is to apply for one inside the city itself. That can be quite a bothersome process, though,\"</i> Miranda explains. <i>\"Another way to get inside is to have someone reputable vouch for you. There are a great number of traders and farmers entering and leaving the city daily, and any one of those could provide you entry.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("She shakes her head at your brightening expression.", parse);
				Text.Newline();
				Text.AddOutput("<i>\"Don't get your hopes up too high. Due to the harsh punishment for harboring outlaws, knowingly or not, don't expect people to open up that easily to you. I'm sure you're a nice [guygirl], but these are suspicious times.\"</i>", parse);
				
				Scenes.Miranda.WelcomeToRigardPASS = false;
				Scenes.Miranda.WelcomeToRigardQnA();
			}, enabled : true,
			tooltip : "Ask where one could acquire a pass."
		});
	if(Scenes.Miranda.WelcomeToRigardOUTLAWS)
		options.push({ nameStr : "Outlaws",
			func : function() {
				Text.Clear();
				Text.AddOutput("<i>\"You really aren't from around here, are you?\"</i> the dog-morph looks at you suspiciously. <i>\"I'd have a hard time believing there's someone who isn't familiar with the war and the current tension resulting from it.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("<i>\"I say war, but it was really more of an insurgency, rich merchant families and their allies standing up against the authority of the king. It was an ugly, ugly mess, and though most of the ringleaders were rounded up, there are still some active today. More than that, others have joined their ranks. Deserters from the army, men with prices on their heads, common criminals and murderers, the list goes on. Most of these ‘freedom fighters' are little more than bandits.\"</i>", parse);
				Text.Newline();
				Text.AddOutput("<i>\"From what I've heard, there is a large group of them holed up somewhere in the forest,\"</i> she tells you, motioning toward the dark trees off in the distance. <i>\"That said, by the amount of unrest in Rigard right now, you'd almost suspect their base was in the city!\"</i>", parse);
				
				Scenes.Miranda.WelcomeToRigardOUTLAWS = false;
				Scenes.Miranda.WelcomeToRigardQnA();
			}, enabled : true,
			tooltip : "Ask her about this outlaw insurgency she mentioned."
		});
	if(Scenes.Miranda.WelcomeToRigardMIRANDA)
		options.push({ nameStr : "Miranda",
			func : function() {
				Text.Clear();
				Text.AddOutput("<i>\"Me?\"</i> She purses her lips, studying you thoughtfully. <i>\"I'm not anyone that special... well, besides being the best fighter the watch's got.\"</i> Her confident stance and athletic build give you the impression that this isn't just bravado. Still... curiously, you ask why she is posted watching the gates if she is so important?", parse);
				Text.Newline();
				Text.AddOutput("<i>\"Nice comeback,\"</i> she grins. <i>\"You could say I haven't exactly made many friends upstairs. That, and people of my kind aren't really appreciated in Rigard as of late.\"</i> People of her... kind?", parse);
				Text.Newline();
				Text.AddOutput("<i>\"Fur, ears, tail, tell you nothing?\"</i> she waves at her appearance, a little annoyed. <i>\"I'm a dog-morph, not a human. In Rigard, that makes a large difference.\"</i> Clearly not a topic she wants to linger on, so you drop it.", parse);
	
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
	Text.AddOutput("<i>\"I enjoyed talking with you, believe it or not, but I've got a job to do here,\"</i> she walks back to her post, looking at you over her shoulder. <i>\"If you'd like to continue this conversation in a more... casual setting,\"</i> she quips, hips swaying suggestively, <i>\"meet me after work in the slums. There is a tavern there called the Maidens' Bane. We can hit the town, get to know each other a bit, eh?\"</i>", parse);
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
	Text.Add("Just as you begin to process all of this, three pursuers dash by, dressed in the uniforms of the Rigard city guard. While they look determined, the thief is lighter on his feet, unencumbered by armor as it were. For a while, it seems certain that he will escape their clutches and disappear down some alley, when his hopes are suddenly dashed by a whirling tornado of dark fur and hard muscle.", parse);
	Text.NL();
	Text.Add("Just as the man is passing by a shady passageway, Miranda the dog-morph guardswoman intercepts him, easily wrestling the thief to the ground despite his greater weight. He struggles a bit, but quiets down when the dobie tightens her hold, threatening to dislocate his shoulder.", parse);
	Text.NL();
	Text.Add("<i>”You’ve been a bad boy,”</i> Miranda murmurs, a gleeful smile playing on her lips, <i>”didn’t your mommy tell you not to steal?”</i> The poor thief grunts an unflattering remark, summarily ignored by the guardswoman. Laughing, she hoists the criminal over her shoulder like a sack of grains. As the procession of guards heads towards the barracks, the victor cups a feel on her captive’s butt, shamelessly groping the poor man.", parse);
	Text.NL();
	Text.Add("<i>”Caught red-handed with his fingers in the cookie jar eh?”</i> the guard chuckles. <i>”You are lucky that you weren’t caught by the royal guard, they’d likely have chopped your hands off for this transgression. Now, you’ll just have to endure a few nights in our comfy cells awaiting your trial.”</i> The dobie pats the thief’s bum possessively, ignoring his whimpering protests. <i>”Look forward to a few visits from me. I know <b>just</b> the punishment for bad boys.”</i> You almost feel bad for the guy.", parse);
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
		Text.Add("<i>\"Well, he <b>was</b> a thief,\"</i> she says defensively, <i>\"can't be too lenient now, can we.\"</i> She sips a bit at her booze thoughtfully. <i>\"Though I enjoyed that a bit more than what I should have maybe... was a while since I had a really good time,\"</i> she says quizzically. She shifts around uncomfortably in her seat.", parse);
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
				Text.Add("<i>\"What do you mean?\"</i> you ask her. She gives you a long look, weighing you up, before deciding what to say.", parse);
				Text.NL();
				Text.Add("<i>\"It means that I get a bit randy at times and sometimes lose control a bit. Nothing to worry about though.\"</i> She reaches over and squeezes your butt a bit. <i>\"Might be fun though.\"</i> She grins as you blush.", parse);
				
				player.AddLustFraction(0.1);
				miranda.AddLustFraction(0.1);
				
				Scenes.Miranda.HeyThereCont();
			}, enabled : true,
			tooltip : "What does she mean by ‘good time’?"
		});
		options.push({ nameStr : "Flirt",
			func : function() {
				Text.Clear();
				Text.Add("The booze is getting a bit to your head, and you are finding it more difficult to keep your eyes to the more civilized parts of the shapely woman sitting beside you. You shift a bit closer to her until you touch her thigh with you leg, and murmur softly: <i>\"<b>I</b> could show you a good time.\"</i>", parse);
				Text.NL();
				Text.Add("Miranda, in the middle of chugging down a mug of booze, almost chokes as she starts coughing and wheezing uncontrollably. When she eventually winds down, you realize that she is giggling drunkenly. She leans over to get another bottle, the side of her huge breasts brushing against your arm as she reaches past you. ", parse);
				Text.NL();
				Text.Add("<i>\"Down, [boygirl]!\"</i> she says jokingly, <i>\"and be careful what you wish for!\"</i> You can tell she is turned on though, and she doesn't move away from you.", parse);
				
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
	Text.Add("The booze starts to stack up as you continue to talk into the night. You tell her a bit about yourself and your adventures so far, while she quips in witty comments and suggestive remarks.", parse);
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
	Text.Add("<i>\"I like thish place,\"</i> she expresses loudly, <i>\"sure it’s a shithole, but there is great booze to be had, and good company!\"</i> She coos and points over into a corner. <i>\"And sometimes, raunchy entertainment!\"</i>", parse);
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
		Text.Add("<i>\"Ooh... now you've gonesh and done itsh!\"</i> There is a hungry look in her eyes. The dog-girl is trembling slightly, and her hands are busy below the table, buried between her legs.", parse);
		Text.Flush();
		
		//[Comfort][Check]
		var options = new Array();
		options.push({ nameStr : "Comfort",
			func : function() {
				Text.Clear();
				Text.Add("You shuffle closer and puts an arm around her.", parse);
				Text.NL();
				Text.Add("<i>\"What's wrong?\"</i> you ask innocently.", parse);
				Text.NL();
				Text.Add("<i>\"'s jusht... haaaah... a little hot, dear, I'll be fine,\"</i> she pants, <i>\"all of this made me a bit exschited.\"</i> She is shamelessly pawing herself between her thighs, though her hands are covered in shadows by the dim lighting inside the tavern.", parse);
				Text.NL();
				Text.Add("You are not quite sure what's going on, but you hold onto her as she gasps and rides out her small orgasm. She leans against your chest contently, tired from the ordeal. After she has rested a bit, she reaches up and give your cheek a quick kiss.", parse);
				Text.NL();
				Text.Add("<i>\"Thanks honey, that wash sweet of you,\"</i> she is a bit unsteady on her feet when she gets up, so she leans on your shoulder for support. The two of you walk out into the cool night together.", parse);
				Text.NL();
				Text.Add("The breeze seems to revive Miranda a bit, and she bids you goodbye, heading home.", parse);
				Text.NL();
				Text.Add("<i>\"Ah had a really good time, we should do this again later!\"</i> she exclaims to you. She gives you a last nuzzle, squeeze your arm and unsteadily walks of into the night. A faintly glistening trail of sticky liquid slowly drops down one of her legs, forming small pools behind her.", parse);
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
				Text.Add("About a third of it is covered by a furry sheet, but the rest is out in the air, in all its glory. Large veins pulse along the very large member, from the thick knotted base, where her apple-sized testicles hang, heavy with seed, to the pointed tip. Miranda is excitedly pumping on the dick with both hands, her ragged gasps growing exceedingly more urgent. Alarmed, you realize that you are right in the line of fire.", parse);
				Text.NL();
				Text.Add("<b>You now know Miranda is a herm (duh).</b>", parse);
				Text.Flush();
				
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
						Text.Add("<i>\"Well, you certainly took that better than I expected,\"</i> she murmurs into your ear. Suddenly you realize that everyone in the bar is staring at you. Blushing furiously, the two of you hastily pick yourselves up and head towards the exit. Outside, Miranda gives you a hug and smiles at you.", parse);
						Text.NL();
						Text.Add("<i>\"We have to do that again sometime honey... sometime soon.\"</i> She grins wickedly, <i>\"you should probably get yourself cleaned up for now though.\"</i> She tucks her now softening member back into her tight leather pants, its size making you wonder how it could ever fit there in the first place. She leaves you standing in the dark street, covered in sticky girl-cum.", parse);
						Text.Flush();
						
						miranda.flags["Attitude"] = Miranda.Attitude.Nice;
						miranda.relation.IncreaseStat(100, 5);
						miranda.subDom.IncreaseStat(100, 10);
						
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
						Text.Add("<i>\"Wow, forward, aren’t we?\"</i> She blushes slightly, withdrawing her hands from her crotch. She spread her legs wider to give you room, as you position yourself between her thighs before the rigid monster. First slowly, then more confidently, you start to stroke her shaft, hands moving up and down the massive length, a touch here, a squeeze there.", parse);
						Text.NL();
						Text.Add("You begin to slowly pump her with one hand, while exploring her body with the other. Lovingly, you touch the insides of her thighs, fondle her large balls, play with her sopping pussy and rub her thick knot at the base of her cock. The lustful hermaphrodite is definitely aware of all your efforts, softly goading you on.", parse);
						Text.NL();
						Text.Add("<i>\"Oooh, you are good!\"</i> she huffs, one of her hands starts to play with her large breasts, teasing the nipples below the rough fabric of her dress into alertness. The other one reaches down to you head and gently guides you forward until your lips are touching the tip of her cock. <i>\"Do a girl a favor?\"</i> she looks down at you, her ragged breath making her breasts heave.", parse);
						Text.NL();
						Text.Add("You look into her eyes for a long moment. There is a spark there, but of what? Slowly, you open your mouth and lick the tip. The taste is salty and delicious, raising your own arousal even more. Hungrily you wrap your lips around it and start giving the dog the blowjob of her life.", parse);
						Text.NL();
						
						Sex.Blowjob(player, miranda);
						player.FuckOral(player.Mouth(), miranda.FirstCock(), 3);
						miranda.Fuck(miranda.FirstCock(), 3);
						
						if(player.FirstVag()) {
							Text.Add("The moistness between your thighs is maddening, and you reach down to fondle your nether lips while happily slurping at the cock in front of you. Your fingers play around with your labia for a bit, before finding your clit and massaging it. You moan around the beast in your throat as your masturbation brings you closer to your own climax. Miranda notices you, and pants:", parse);
							Text.NL();
							Text.Add("<i>\"Don't worry about that, honey, I can help you out... just as soon as you are finished down there.\"</i>", parse);
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
						Text.NL();
						Text.Add("You eagerly lick your lips and gives the cock before you a few more slurps, cleaning it up. Miranda smiles down on you with a very satisfied look on her face as you greedily swallow every ounce of thick sperm you can get your lips on. As you climb up from your kneeling position, you realize that the room is silent and everyone's eyes are honed at the two of you. Quite a few of the patrons are openly stroking themselves.", parse);
						Text.NL();
						Text.Add("<i>\"I think we just outmatched the felines from earlier, honey,\"</i> Miranda says as she leans over, hugging you tightly. One of her hands reach down behind you and grabs your butt, squeezing it tightly. <i>\"You were wonderful dear,\"</i> she murmurs into your ears as she leans against you, wrecked by exhaustion.", parse);
						Text.NL();
						Text.Add("The bartender, a gruff equine clad in a dark tunic, comes over to your table with two jugs of mead.", parse);
						Text.NL();
						Text.Add("<i>\"For the show,\"</i> he explains grinning, <i>\"we could use some more of that around here, it draws a crowd. You think you two can come more often?\"</i> The two of you blush deeply as he returns to the bar, laughing. The conversations starts to pick up again around you.", parse);
						Text.NL();
						if(player.FirstVag())
							Text.Add("<i>”As much as I like an audience, do you think you can hold out until next time?</i> she murmurs, lightly caressing your wet crotch.", parse);
						else
							Text.Add("<i>”Too bad we are the center of attention, I’d love to… continue this,”</i> she grins, caressing your [buttDesc] fondly.", parse);
						Text.NL();
						Text.Add("You snuggle with Miranda for a while longer, enjoying the mead, until the two of you decide to leave for the night. Before the two of you part on the street outside, Miranda pulls you close into a deep kiss, her hands groping your ass roughly. <i>\"I think I'll be seeing more of you, and better sooner than later,\"</i> she announce as she saunters of into the night, <i>\"you know where to find me.\"</i>", parse);
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
				Text.Add("<i>”Walking the beat keeps the coin coming, though it isn’t as exciting as mercenary work. Believe it or not, usually things are pretty quiet here.”</i> She shrugs irritably. <i>”I hate doing paper work, give me a thug to beat up any day of the week.”</i>", parse);
				if(miranda.Relation() >= 25) {
					Text.NL();
					Text.Add("She brightens up a bit. <i>\"You could show up at the barracks sometime and keep me company!\"</i> she suggests. <i>\"You know... take my mind of things for a while,\"</i> she grins wickedly.", parse);
					player.AddLustFraction(0.1);
					miranda.AddLustFraction(0.1);
				}
			});
			scenes.push(function() {
				Text.Add("She tells you a few tidbits of information about her comrades in the guard and their peculiarities. You are particularly surprised about that the gruff wolf usually standing guard at the main gates is into writing sleazy erotic poetry, and has quite the following in the female population of the town.", parse);
				Text.NL();
				Text.Add("<i>\"He is way too shy to tell anyone about it though, so he writes under an alias\"</i>, she grins. <i>\"You didn't hear that from me, though.\"</i>", parse);
			});
			scenes.push(function() {
				Text.Add("She tells you a bit more about her guard troupe.", parse);
				Text.NL();
				Text.Add("<i>\"Did you meet the centaur yet?\"</i> she asks you. <i>\"He is the strongest guy around here, and a really good archer too.\"</i> She brings up a few stories about the two of them hunting together in the forest. Seems like a dependable guy.", parse);
			});
			if(miranda.Relation() >= 25) {
				scenes.push(function() {
					Text.Add("<i>\"Well, it has been a lot more entertaining with you around, I'll tell you that!\"</i> she giggles. <i>\"The other guys there are complaining that my mind is not on the job any more, due to... distractions,\"</i> she grins as you blush faintly.", parse);
					Text.NL();
					Text.Add("<i>\"It's not a problem though, I can do this job in my sleep... not that you ever let me sleep, honey,\"</i> she places a big sloppy kiss on your cheek.", parse);
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
				Text.Add("<i>\"You said you have been in the big forest, didn't you?\"</i> She asks you. <i>\"Not that you could miss it, it's practically crawling over our walls.\"</i> You nod and tell her about the various strange creatures you've heard inhabits it. <i>\"It's a very wild place, where one shouldn't walk around unprepared,\"</i> she notes, <i>\"you might get some nasty surprises otherwise.\"</i>", parse);
				Text.Flush();
				
				//[Sure][Nah]
				var options = new Array();
				options.push({ nameStr : "Like what?",
					func : function() {
						Text.NL();
						Text.Add("She giggles at you.", parse);
						Text.NL();
						Text.Add("<i>\"There are creatures in that forest who stalks unwitting prey and captures travellers for fun and for their own release.\"</i> She begins to describe more and more extravagant beasts and how they violate passers by, <i>just like you</i>. You gasp at some of the more lurid ones, making her laugh out loud.", parse);
						Text.Flush();
						
						// Force callstack
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : "Ask her to explain what she means."
				});
				options.push({ nameStr : "Hunting",
					func : function() {
						Text.NL();
						Text.Add("<i>\"I'm a bit different,\"</i> she says, <i>\"I've walked those woods for years hunting game, I know which creatures to avoid.\"</i> She gives you a playful glance and places a hand on your thigh.", parse);
						Text.NL();
						Text.Add("<i>\"...And I know which ones are good in the sack, if you want some tips.\"</i> She howls with laughter at your shocked expression.", parse);
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
					Text.Add("<i>\"Ok,\"</i> she begins, <i>\"you know those big wolves that prowl around there? Did you know that some of them used to be people?\"</i> She goes on to explain that overuse of certain substances enhancing their animal attributes can change a persons body and mind so much that they lose themselves.", parse);
					Text.NL();
					Text.Add("<i>\"As long as you keep your wits about you you should be fine,\"</i> she finishes, ordering another mug of mead. <i>\"Who knows, I might like having a pet around though...\"</i> she adds teasingly. <i>\"Just be careful ok?\"</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>\"The goblin tribes of the deeper woods are a weird bunch,\"</i> she muses, taking a long draft of the strong mead in her cup. <i>\"They are so constantly mad with lust that they fuck like rabbits. Yet they somehow keep their numbers down with a surprisingly high fatality rate,\"</i> she ponders that a bit. <i>\"It is probably because they are really, really stupid,\"</i> she decides, <i>\"just be careful that they don't gang up on you.\"</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>\"There are some wild feline beasts running around the forest,\"</i> she informs you, <i>\"they may look cute, but be very careful around them. Unlike the domesticated house cats you might see here in the city, these are natural predators, and are very dangerous. Don't head into their territory unless you have some kind of death wish.\"</i>", parse);
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
				Text.Add("The two of you chat a bit about the castle town. <i>\"Well, it's a nice enough place,\"</i> Miranda concedes, <i>\"the bar is nice, I have a decent job that brings the dough in.\"</i> She grins widely, <i>\"and though the place might now be as interesting as the feline home town, I have you around now to keep me entertained!\"</i>", parse);
				player.AddLustFraction(0.1);
				miranda.AddLustFraction(0.1);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("You ask Miranda about the royal family living in the castle. Her mood darkens immediately, and she spits on the floor besides the table.", parse);
				Text.NL();
				Text.Add("<i>”Rigard may be my home, but don’t think for a second I’ve got anything but scorn for that bunch. Fucking aristocrats...”</i>", parse);
				Text.NL();
				Text.Add("When you ask her why she thinks that way, she gives you a deadpan stare. <i>”Try living in Rigard for a week as a morph, might give you an idea why I left to be a merc.”</i>", parse);
				Text.NL();
				Text.Add("Well, what about the rest of the royals?", parse);
				Text.NL();
				Text.Add("<i>”Heh, they are a right depraved bunch,”</i> Miranda laughs, a wicked grin playing across her features. <i>”There is plenty a rumour about our dear queen, and don’t get me started on the kids. It’s common knowledge they hit the sack together, and you’d have to look hard to find a girlier prince than Rani.”</i>", parse);
				Text.NL();
				Text.Add("<i>”...Still, I’d tap that,”</i> she adds after a thoughtful pause.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>\"You should have a look around the farmlands,\"</i> Miranda tells you, <i>\"there is some work to be had at the farms, if you are into that, and you can also find the rabbit burrows around that area. You could see it like a hub area, from there you can reach every location on the island pretty quickly.\"</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>\"Watch your back if you head to the mountains,\"</i> Miranda warns you, <i>\"I've heard that there are bandits hiding out somewhere there, and it is very close to the boneyard, and that place you should <b>really</b> avoid.\"</i>", parse);
				Text.NL();
			}, 1.0, function() { return true; });
			
			scenes.Get();
			Text.Flush();
			
			// Force callstack
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Just chat for a while."
	});
	
	if(miranda.flags["Met"] >= Miranda.Met.TavernAftermath) {
		options.push({ nameStr : "Date",
			func : Scenes.Miranda.DatingEntry, enabled : true,
			tooltip : "Ask her out on a walk."
		});
	}
	
	Gui.SetButtonsFromList(options);
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
		Text.Add("<i>”Well, I honestly didn't think I would see you again after last time,”</i> she laughs softly as you squirm a bit, then pats the bench beside her. Miranda seems very happy that you decided to return, which she makes more clear as she reaches over and whispers in your ear:", parse);
		Text.NL();
		Text.Add("<i>”If you decided to come back, I guess that means you liked my extra equipment. Perhaps you are yearning for round two?”</i> She gently reaches down into your pants, ", parse);
		if(player.FirstCock())
			Text.Add("fondling your now aroused [multiCockDesc].", parse);
		else if(player.FirstVag())
			Text.Add("lightly rubbing your moist [vagDesc].", parse);
		else
			Text.Add("fondling you.", parse);
		Text.Add(" Her probing fingers traces lower, drawing soft moans from you as she slowly circles your [anusDesc]. She slowly starts to push her middle finger up your rectum, feeling around for a while before withdrawing. She winks at you and pats the hidden monster between her legs.", parse);
		Text.NL();
		Text.Add("<i>”Just know that I'd be more than happy to help you with that, if you ever feel you need to let off some steam.”</i> She chuckles at your discomfort and orders some drinks for you.", parse);
		Text.NL();
		
		miranda.relation.IncreaseStat(100, 5);
		miranda.subDom.IncreaseStat(100, 5);
		player.AddLustFraction(0.5);
		miranda.AddLustFraction(0.5);
		
		Scenes.Miranda.Chat();
		
		// TODO: Push sexy
	}
	else if(miranda.flags["Attitude"] == Miranda.Attitude.Dismiss) {
		Text.Add("<i>”I.. uh.. I'm sorry about last time,”</i> she says, a bit defensively. <i>”Of course you weren't expecting... that, to, uh, show up.”</i> She rolls her shoulders. <i>”Well, that's my little secret, I'm a hermaphrodite, got both parts and all,”</i> she smiles, back to her old assertive self.", parse);
		Text.NL();
		Text.Add("<i>”Twice the fun though, if you care to try it out.”</i> The dog-morph is obviously waiting for you to say something.", parse);
		
		Text.Flush();
		
		//[Apologize][Leave]
		var options = new Array();
		options.push({ nameStr : "Apologize",
			func : function() {
				Text.Clear();
				Text.Add("You apologize to her for running out, giving her a weak smile. Miranda’s expression softens up a bit.", parse);
				Text.NL();
				Text.Add("<i>”You are not such a bad sort, you know,”</i> she says, <i>”I guess I should have hinted at it a bit more, I...”</i> she looks at you admiringly and shyly adds, <i>”I just couldn't help myself, you are quite the catch, you know.”</i> She places a hand your hip and moves in a bit closer.", parse);
				Text.NL();
				Text.Add("<i>”So... now what, pet?”</i> she asks, looking into your eyes. You suggest that the two of you grab a few drinks and have a chat. <i>”Well… a good start, I guess,”</i> she smirks.", parse);
				Text.NL();
				
				miranda.flags["Attitude"] = Miranda.Attitude.Neutral;
				
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
				Text.Add("<i>”Fine then,”</i> she snaps after you. <i>”Be that way. You’ll regret that if I ever catch you in the streets!”</i> As you glance over your shoulder, she is furiously chugging down a large bottle of booze. She probably won't appreciate seeing you around any more.", parse);
				Text.Flush();
				
				miranda.flags["Attitude"] = Miranda.Attitude.Hate;
				
				miranda.relation.DecreaseStat(-25, 100);
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Not interested. Find an excuse to ditch her."
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.Add("Miranda is lost in thought as you grab a seat next to her. She takes a deep breath and turns to you.", parse);
		Text.NL();
		Text.Add("<i>”Look, I haven't been entirely honest with you. I get a feeling that you like me, and there is something that you need to know before we take this any further.”</i> She heads off to an empty back room, motioning for you to follow. Curious, you go with her. She grabs a bottle of booze from the bar on the way, muttering she needs something to brace herself. You notice that she is already pretty drunk.", parse);
		Text.NL();
		Text.Add("<i>”Please close the door, hun,”</i> she tells you over her shoulder, placing the booze on the table. Turning around, she gives you a measuring look. <i>”I think the best way to do this is to show you,”</i> she murmurs with an sultry look on her face. With her eyes still fixed on you, Miranda reaches for her belt and starts undoing it. When she is done, she turns around, slowly pulling down her tight pants over her curvy hips, exposing more and more dark fur.", parse);
		Text.NL();
		Text.Add("You are thoroughly enjoying the show, but is a bit unsure where this is going. With her back to you, she pulls her pants down to her knees, giving you a glimpse of her tight anus and moist pussy lips. Then... she turns around to face you. Between her long fur-clad legs, just above her juicy slit, you see something you definitely didn't expect. Half hidden in a soft sheath is a very large canid cock, complete with a pointed tip, a set of apple-size balls and a thick knot at the base.", parse);
		Text.NL();
		Text.Add("Even soft, it’s still almost nine inches long and as thick as her arm. You unconsciously lick your lips nervously, contemplating this new development. Miranda takes a challenging pose, legs wide and member jutting out aggressively.", parse);
		Text.NL();
		Text.Add("<i>”Well?”</i> she looks at you, cocking her eyebrow.", parse);
		Text.NL();
		Text.Add("<b>You now know Miranda is a herm (duh).</b>", parse);
		Text.Flush();
		
		//[Accept][Leave][Touch it]
		var options = new Array();
		options.push({ nameStr : "Accept",
			func : function() {
				Text.Clear();
				Text.Add("You declare that it doesn’t matter what she has between her legs, you’ll still be her friend, even if her revelation startled you a little bit. Miranda makes a happy yip and gives you a quick hug, her soft member hitting your thigh with a wet slap. A bit embarrassed, she shoves her cock back into her pants, then leads you back to the benches. As you walk she leans on your shoulder and fondles your butt playfully.", parse);
				Text.NL();
				Text.Add("<i>”Friendship accepted,”</i> the guardswoman murmurs. <i>”And who knows, perhaps something more down the line?”</i> she adds playfully.", parse);
				Text.NL();
				
				miranda.flags["Attitude"] = Miranda.Attitude.Neutral;
				
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
				Text.Add("<i>”Fine then,”</i> she snaps after you. <i>”Be that way. You’ll regret that if I ever catch you in the streets!”</i> As you glance over your shoulder, she is furiously chugging down a large bottle of booze. She probably won't appreciate seeing you around any more.", parse);
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
				Text.Add("<i>”Oh no. You can't just leave it like that!”</i> she exclaims drunkenly. The guardswoman makes a flailing grab for you, but loses her footing and falls down on top of you. Surprised, you catch her and set her down in your lap.", parse);
				Text.NL();
				Text.Add("<i>”Please!”</i> she pants urgently, her hands paws at you inefficiently. <i>”I need to fuck. <b>Now!</b>”</i>", parse);
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
							Text.Add("<i>”I-I'm gonna come!”</i> she gasps. You quickly reach down and grasp her shaft and start jerking her off. As she explodes in a fountain of dog-girl cum, thoroughly drenching the both of you, you glance up and notice that you have a small audience. Seems like two shocked customers just walked in on you, but you are not really in a position to do anything about it. Miranda rams herself down hard, fully impaling herself on your cock[s] as you unload into the depths of her pussy[butt].", parse);
							Text.NL();
							Text.Add("As the both of you ride out your climax, the spectators chuckle to each other and head to another room. They leave the door open for all to see, as you rest in each others arms in an expanding pool of mixed love juices. After resting up a bit, the two of you decide that it is probably best to leave for today. As you walk out into the night, Miranda gives you an peck on the cheek. She seems a bit more demure than her usual abrasive self.", parse);
							Text.NL();
							Text.Add("<i>”That was great, hun...”</i> she whispers into your ear. <i>”You can do that to me again aaanytime you like.”</i> Miranda sways off into the night, leaving you alone.", parse);
							Text.Flush();
							
							miranda.relation.IncreaseStat(100, 10);
							miranda.subDom.DecreaseStat(-100, 10);
							
							player.AddLustFraction(-1);
							miranda.AddLustFraction(-1);
							
							Gui.NextPrompt(function() {
								MoveToLocation(world.loc.Rigard.Slums.gate, {hour: 4});
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
						
						Text.Add("<i>”See? That wasn't so bad, was it honey?”</i> She slaps your butt drunkenly. <i>”Now, are you going to start moving or will I have to do all the work?”</i> Blushing slightly, you slide up and down her length, your tunnel clenching tightly around the hermaphrodite’s bright red pillar.", parse);
						Text.NL();
						Text.Add("Fuck, she is in so deep! The dog-girl roughly grabs hold of your hips, shoving you down on her member. Before long, you are driven to the edge by the wild romp.", parse);
						if(player.FirstBreastRow())
							Text.Add(" Your breasts heave as you bounce up and down, the pleasure making you moan like crazy.", parse);
						if(player.FirstVag())
							Text.Add(" Juices flow freely from your ravaged cunt, clinging to the sides of her dick as you ride her.", parse);
						if(player.FirstCock())
							Text.Add(" Your cock[s] convulse[notS] and start[notS] pumping semen all over your lover.", parse);
						Text.Add(" She grins as you cum, rocking on top of her.", parse);
						Text.NL();
						parse["butt"] = player.FirstCock() ? ", grinding against your prostate" : "";
						Text.Add("<i>”Oh, I'm not done quite yet, my cute little pet,”</i> she coos. Sitting up and holding you in her lap, she starts to guide you up and down her shaft with her strong hands. Picking up speed, she bounces you wildly[butt].", parse);
						Text.NL();
						Text.Add("Pretty soon you convulse in yet another intense orgasm, making you gasp as she continues to fuck you. You become aware that some of the bar patrons are peeking in through the open door, watching the two of you. Miranda notices them too and grins at them over your shoulder, as she pushes you so far down on her cock that her thick knot pops inside you.", parse);
						Text.NL();
						Text.Add("Your body rests limply against hers as she starts pumping you full of her seed, putting up a show for the audience. As you lean against her, totally exhausted, she whispers in your ear, <i>”Not bad for the first time, I think I’ve found myself a keeper!”</i> Once her knot has shrunk enough and you finally are able to separate, the two of you head out into the night, too tired to keep up the drinking game. Miranda has a thoughtful look on her face.", parse);
						Text.NL();
						Text.Add("<i>”Did you enjoy performing in front of an audience?”</i> she asks playfully. <i>”Maybe I shouldn't have been so greedy, and let them join in?”</i> She laughs loudly at your blushing face and saunters off into the night.", parse);
						Text.NL();
						Text.Add("<i>”See you around, pet!”</i>", parse);
						Text.Flush();
						
						miranda.relation.IncreaseStat(100, 10);
						miranda.subDom.IncreaseStat(100, 10);
						
						player.AddLustFraction(-1);
						miranda.AddLustFraction(-1);
						
						Gui.NextPrompt(function() {
							MoveToLocation(world.loc.Rigard.Slums.gate, {hour: 4});
						});
					}, enabled : true,
					tooltip : "Give her relief by riding her thick cock."
				});
				options.push({ nameStr : "Let her",
					func : function() {
						Text.Clear();
						Text.Add("You blush a bit, eyeing her throbbing member nervously. Unsure if you are doing the right thing, you ask if she’ll be gentle with you.", parse);
						Text.NL();
						Text.Add("<i>”Gentle?”</i> the dog-morph growls, <i>”I don’t know the meaning of the word!”</i> Before you have time to react, she wrestles you to the ground. Totally surprised by her lunge, you stumble back on your ass as she falls on top of you. Squirming around you somehow end up on your stomach, butt in the air. Faintly alarmed, you try to crawl away, but she has you pinned to the ground, rutting her huge cock against your back. She hungrily pulls off your [lowerArmor], revealing your naked [buttDesc]. She reaches down, whispering in your ear as she starts probing at your back door.", parse);
						Text.NL();
						Text.Add("<i>”I'm sorry, but I <b>need</b> this,”</i> she almost seems a bit embarrassed about her essentially planning to rape you, but she is too aroused to back down now. <i>”You brought this upon yourself you know, my cute little slut,”</i> she moans, trying to justify her actions. <i>”You were practically <b>asking</b> for it!”</i>", parse);
						Text.NL();
						Text.Add("You start to gasp that it wasn't like that, but you are suddenly cut off by a rowdy intruder in your [anusDesc]. Your world is suddenly reduced to your butt, and the huge log stretching it wider and wider. You can feel each bulging vein as the pointy red giant slowly presses deeper and deeper into your bowels, completely disregarding your own opinions on the matter.", parse);
						Text.NL();
						
						Sex.Anal(miranda, player);
						miranda.Fuck(miranda.FirstCock(), 6);
						player.FuckAnal(player.Butt(), miranda.FirstCock(), 6);
						
						parse["butt"] = player.FirstCock() ? " brushing up against your prostate and" : "";
						Text.Add("Finally, the head is firmly lodged inside your [anusDesc]. Your lover sighs in deep contentment as you rasp a few ragged breaths, trying to accommodate for her girth. Miranda is not going to let you have any rest though, as she mercilessly pushes deeper and deeper into your colon,[butt] making you gasp in mixed pleasure and pain.", parse);
						Text.NL();
						Text.Add("<i>”You like that, huh?”</i> the horny dog grunts through her teeth. She gets up on her knees and firmly grab your buttocks, preparing to go down on you in earnest. <i>”Then I think you will just love this,”</i> she murmurs, she slowly pulls out of you, until the widest part of the head stretch your distended anus.", parse);
						if(player.FirstVag())
							Text.Add(" Your cunt is flooding over, but Miranda is too focused on her current target to notice.", parse);
						if(player.FirstCock())
							Text.Add(" Your own [multiCockDesc] [isAre] twitching in anticipation, a small pool of pre forming on the floor beneath you.", parse);
						Text.NL();
						Text.Add("<i>”Here I come, brace yourself, slut!”</i> she roars, thrusting forward hard with her hips. The intense sensation of being completely filled up almost makes you come then and there. You can feel the incessant prodding of her even thicker knot at your back door, demanding entry. She grunts a bit as she realizes that it won't fit the way it is now, but decides that she'll give it her best try anyway. She proceeds to roughly slam your colon, first pulling out almost all the way before ramming it back as deep as it will go.", parse);
						if(player.FirstCock())
							Text.Add(" Your prostate definitely is mashed every time she trusts her hips, making you yelp in unwilling pleasure.", parse);
						Text.NL();
						Text.Add("After what feels like hours of intense fucking, you can't take it any more.", parse);
						if(player.FirstVag())
							Text.Add(" Your cunt sprays juices all over the floor as you collapse, only held up by the hermaphrodite’s strong hands.", parse);
						if(player.FirstCock())
							Text.Add(" Your cock[s] violently erupt[notS] on the hard wooden floor, making you cry out in ecstasy.", parse);
						Text.NL();
						parse["butt"] = player.FirstCock() ? " by repeatedly hitting your prostate" : "";
						Text.Add("Miranda is far from done however, and continues to ram away at your poor abused rectum, quickly building up another anal orgasm for you[butt]. The massive rod moves more easily now, slick with her precum. The constant stretching pain in your butt does not recede, however, and you realize that she is forcing more and more of her knot into you with every push.", parse);
						Text.NL();
						parse["butt"] = player.FirstCock() ? " as a great force is exerted on your prostate" : "";
						Text.Add("<i>”Almost there, pet, almost, almoooost...”</i> she coos, her breath drawing short. Finally she pulls out, only the pointed tip of her cock poking against your stretched taint. She pulls back her hips as you brace yourself again. When she rams into you, she pushes deeper than ever before, making your eyes bulge in pain. Your body is rocked by another heavy orgasm[butt], increasing the size of the pool of love juices between your knees.", parse);
						Text.NL();
						Text.Add("You incredulously realize that she somehow made it, all of her swollen knot is trapped inside your distended bowels, throbbing as it announces her coming orgasm. You try to pull away, but find it impossible, her thick bulge is trapping you and preventing you from moving even a fraction of an inch. The intense pressure causes your rectal muscles to convulse as yet another anal orgasm wrecks your body, the tightness pushing Miranda well past her own limits.", parse);
						Text.NL();
						Text.Add("<i>”FUUUUUUCK!!!”</i> she loudly cries out, as you feel wave after wave of potent cum fill your belly. The knot is preventing any sperm from escaping, leaving her immense load only one way to go. After what feels like an eternity, she is finally spent. Your belly is stretched beyond what you thought possible, making you look heavily pregnant. Miranda collapses on top of you, the weight of her breasts pressing down on your back.", parse);
						Text.NL();
						Text.Add("This, of course, is the time that the bartender decides to check in on you. He surveys the scene clinically: you lie pressed on the floor with your butt sticking out, completely filled by the hermaphrodite dog’s knotted cock. Trickles of the guardswoman’s cum somehow flows past the knot and join the pool of your fluids on the floor. The tall equine sighs and mutters that this will be a mess to clean up, shaking his head as he walks out. The flushed and tired Miranda sits up and pulls you into her lap.", parse);
						Text.NL();
						Text.Add("<i>”Well, I don’t think you have much choice but to stay like this for a while,”</i> she purrs. You have to admit it’s true, the knot is holding you firmly in place. Resigned to your fate, you snuggle up against your canid lover, making the best of the situation. You stay that way for about a quarter of an hour, Miranda whispering dirty pillow talk in your ears. Her words leave you no doubt that she’ll want to do this again, and often. Finally she is able to pull out her softened member from your bowels, releasing a torrent of her cum down your [legs].", parse);
						Text.NL();
						Text.Add("You have a little trouble walking, and don't think you'll be able to sit properly for a few days. The both of you drunkenly stagger out into the night together. Before you part, Miranda pulls you down to your knees, and makes you give her a blowjob right in the middle of the street.", parse);
						Text.NL();
						
						Sex.Blowjob(player, miranda);
						miranda.Fuck(miranda.FirstCock(), 2);
						player.FuckOral(player.Mouth(), miranda.FirstCock(), 2);
						
						Text.Add("<i>”Remember that your ass belongs to me now, little slut!”</i> she drunkenly proclaims as she fills your bowels with another batch of dog cum, this time pouring from the other direction. It seems you have brought out a really dominant streak in Miranda.", parse);
						Text.NL();
						Text.Add("<i>”Can't wait for our next fuck, love,”</i> she purrs as she swaggers off into the night.", parse);
						Text.Flush();
						
						miranda.relation.IncreaseStat(100, 15);
						miranda.subDom.IncreaseStat(100, 20);
						
						player.AddLustFraction(-1);
						miranda.AddLustFraction(-1);
						
						Gui.NextPrompt(function() {
							MoveToLocation(world.loc.Rigard.Slums.gate, {hour: 4});
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
					tooltip : "Ask her out on a walk."
				});
			}
			
			Gui.SetButtonsFromList(options, true);			
		}
	}
}

world.loc.Rigard.Tavern.common.events.push(new Link("Miranda", function() { return world.time.hour >= 17 || world.time.hour < 2; }, true,
function() {
	if(world.time.hour >= 17 || world.time.hour < 2)
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
			Text.Add("<i>”You coming on to me, [playername]?”</i> Miranda looks amused, but nods. <i>”Sure, I’m game. Let’s ditch this place.”</i> Saying so, she drains her beer in one go, slamming the empty cup to the table.", parse);
		else {
			Text.Add("<i>”You are certainly singing a different tune now than when we first met.”</i> Miranda growls suspiciously. <i>”What’s your game?”</i> Grudgingly, she agrees to go with you, draining her beer and slamming the empty cup to the table.", parse);
			if(miranda.flags["gBJ"] > 0) {
				Text.NL();
				Text.Add("<i>”If nothing else, at least I’ll get to fuck you at the end of it,”</i> she mutters to herself.", parse);
			}
		}
		Text.NL();
		Text.Add("<i>”I’m quite picky with who I date, you should know. Put on your best face, or whatever other bodypart you’d like to flaunt.”</i>", parse);
		Text.NL();
		Text.Add("You leave the sordid tavern behind, walking aimlessly through the pittoresque slums on the large city. For once, Miranda isn’t very talkative, seeming to be preoccupied with her own thoughts. Just when the silence is starting to get uncomfortable, she yips in surprised joy.", parse);
		Text.NL();
		Text.Add("<i>”Oh, this place! Haven’t been through here in a while.”</i> You follow the excited canine through an archway into what looks like a small secluded park of sorts, containing a few trees and bushes, a cracked stone table and a few simple wooden benches. The small space would easily fit inside the common room of the Maidens’ Bane.", parse);
		Text.NL();
		Text.Add("<i>”This is the place I lost my virginity,”</i> Miranda gestures around the place with sparkling eyes like if it was a grand ball room. <i>”Oh how young I was… Both me and my boyfriend were rather drunk. Still, I enjoyed myself greatly.”</i> She looks thoughtful for a moment. <i>”My boyfriend, not so much.”</i>", parse);
		Text.NL();
		if(miranda.Sexed()) {
			Text.Add("<i>”As you may have noticed, I have a hard time holding back,”</i> the herm blushes faintly. You’ve sort of gotten that impression.", parse);
			Text.NL();
		}
		Text.Add("<i>”So, what do you think, [playername]?”</i>", parse);
		
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
				Text.Add("<i>”Aww, you are no fun.”</i> Miranda looks disappointed.", parse);
				Text.NL();
				Scenes.Miranda.DatingFirstDocks();
			}, enabled : true,
			tooltip : "Very nice. No, really."
		});
		options.push({ nameStr : "Rude",
			func : function() {
				Text.Clear();
				Text.Add("<i>”Nostalgia is what it is. I have some good memories here, and I’m not ashamed of that.”</i> Miranda looks grumpy at your reaction.", parse);
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
				Text.Add("<i>”Several times. My first relationship didn’t last very long, but me and my boyfriend stole back here quite often while it did.”</i>", parse);
				Text.NL();
				Text.Add("<i>”Was a while since last time, though. You offering?”</i> Before you can respond, she shakes her head, grinning at you. <i>”My tastes have refined over time. I’d prefer to ram you in my own bed instead. Consider it an offer.”</i>", parse);
				Text.NL();
				if(miranda.flags["gAnal"] != 0) {
					Text.Add("<i>”Who knows, perhaps you’ll prefer it over a dirty alleyway,”</i> she adds, jabbing you in the ribs with her elbow.", parse);
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
	else {
		// TODO: repeat dates
		Text.Add("PLACEHOLDER", parse);
		Text.NL();
		Text.Flush();
		Gui.NextPrompt();
	}
}

Scenes.Miranda.DatingFirstDocks = function() {
	
	var parse = {
		
	};
	
	party.location = world.loc.Rigard.Slums.docks;
	world.TimeStep({minute: 20});
	
	Text.Add("Leaving the small garden behind, the two of you head down a well-trodden road, not quite deserted, even at this hour. After a while, you begin to notice the smell of brine and fish, as your steps takes you closer to the dock area. There are large crates lining the sides of large warehouses, mostly empty but sure to be filled with a new catch the next morning. Along the riverside, a minor fleet of small fishing boats lie tied.", parse);
	Text.NL();
	Text.Add("<i>”Fish is a major food supply for Rigard,”</i> Miranda explains. <i>”Not only that, but the river provides other treasures.”</i> She points toward a larger barge moored near a giant warehouse, bustling with activity. <i>”It is one of the safer ways to reach the other nations on Eden, and the ocean cities. Traders make regular journeys there, though with the recent surge in attacks from outlaws, they need to hire escorts.”</i>", parse);
	Text.NL();
	Text.Add("The guardswoman looks to be in her element. <i>”I used to run around here all the time when I was a kid, talking with the sailors and exploring abandoned warehouses. Such good adventures!”</i>", parse);
	Text.Flush();
	
	//[Polite][Rude][Sultry]
	var options = new Array();
	options.push({ nameStr : "Polite",
		func : function() {
			Text.Clear();
			Text.Add("<i>”Hey, you making fun of me?”</i> Miranda growls playfully, nudging you. <i>”I know it doesn’t look like much, but for a kid, there was so much to see and learn. The sailors may seem a bit rough around the edges, but they had much to teach.”</i>", parse);
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
			Text.Add("<i>”Well… true,”</i> Miranda grudgingly admits. <i>”Still, it’s not that bad. For a little eight-year old, this place was cool as fuck.”</i>", parse);
			Text.NL();
			Scenes.Miranda.DatingFirstMercs();
		}, enabled : true,
		tooltip : "It stinks of fish and worse."
	});
	options.push({ nameStr : "Sultry",
		func : function() {
			Text.Clear();
			Text.Add("<i>”Hey… I think of things other than sex, you know.”</i> Miranda frowns at you. <i>”’Sides, I was just a kid at the time.”</i> Seems like you upset her a bit.", parse);
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
	
	Text.Add("<i>”I mentioned escorts, didn’t I?”</i> Miranda murmurs thoughtfully. <i>”Which brings us to this place.”</i> You are standing before a large two-story building at the edge of the docks district, far enough away from it to alleviate the smell slightly, but close enough to have the local water holes within close distance. It looks to be in relatively good shape for the slums, though the thick wooden door is marred with what looks like sword slashes.", parse);
	Text.NL();
	Text.Add("<i>”This is home to one of the larger mercenary guilds in Rigard, the Black Hounds. I used to work for them, before I became all nice and proper.”</i> Proper? What was she like before? <i>”As you can see, it’s a rough business. Pay is decent and you get to travel a lot though. All in all, this building probably holds some of the worst scum Rigard has to offer.”</i> You can tell that she means it, but there is a small touch of fondness and pride in her voice.", parse);
	Text.Flush();
	
	//[Polite][Rude][Sultry]
	var options = new Array();
	options.push({ nameStr : "Polite",
		func : function() {
			Text.Clear();
			Text.Add("<i>”Nice?”</i> Miranda scoffs. <i>”Did you listen to a word I just said? This place is a cesspool for the lowest criminal scum in the city, anyone who can handle a weapon is welcome to join. Only reason they didn’t try to rape the pretty young doggie’s brains out when she entered was that I had already gotten a bit of a reputation at that point. Anyone brave enough to assault me would end up with a broken arm or two, and be unable to sit properly for a few weeks. I was strong, even back then.”</i>", parse);
			Text.NL();
			Text.Add("<i>”I was glad to leave this shithole behind when better opportunities opened up.”</i>", parse);
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
			Text.Add("<i>”My thoughts exactly. It was nice work. Shame about the crowd I had to hang with though.”</i> There is a wicked smile playing on Miranda’s lips. <i>”I still bump into some of them these days, but usually in work-related matters. Being the law has its perks at times.”</i>", parse);
			Text.NL();
			Text.Add("<i>”Let’s ditch this place anyways, I got better things to do than chat about the old days.”</i>", parse);
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
			Text.Add("<i>”Very funny, asshole,”</i> she chuckles. <i>”True, though. Not much else to do between missions. Of course, I gave as much as I took, if not more.”</i> The guardswoman looks thoughtful.", parse);
			Text.NL();
			Text.Add("<i>”Then there was the matter of the reward for finished jobs. Coming from the slums, I didn’t really have a good hand with money anyways, so I tended to accept substitutes at times.”</i> She grins widely at your raised eyebrow. <i>”Got problems with bandits? I’ll fuck them up. Then I’ll come back and fuck you… probably a lot more and a lot rougher than you were hoping for.”</i>", parse);
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
	
	Text.Add("<i>”Seen enough of the slums to last you for tonight?”</i> The two of you are nearing the outer walls of Rigard, close to the peasants’ gate. ", parse);
	if(rigard.Visa()) {
		if(miranda.Attitude() < Miranda.Attitude.Neutral)
			Text.Add("<i>”That piece of paper they give you won’t help at this hour, but I know a way.”</i> Miranda grins. <i>”’Course, if we run into a patrol, you are on your own buddy.”</i>", parse);
		else
			Text.Add("<i>”You have a pass, right? Not that it matters at this hour. Don’t worry, we’ll use a back gate, bypass the security.”</i>", parse);
	}
	else {
		if(miranda.Attitude() < Miranda.Attitude.Neutral)
			Text.Add("<i>”You’ll be an interloper, prowling around town illegally,”</i> Miranda almost purrs, a dangerous glint in her eyes. <i>”One could say you are at my mercy...”</i>", parse);
		else
			Text.Add("<i>”I’ll sneak you in. Don’t worry about the guards, I know a gate that isn’t guarded at this time.”</i>", parse);
	}
	Text.Add(" The guardswoman seems excited as she covertly leads you through a small inconspicuous door - one which you would have never found on your own. A short twisting tunnel later, you make your way into the inner city.", parse);
	Text.NL();
	Text.Add("<i>”One of the perks of working for the city watch is that I can afford a house inside the walls. Saves me from most of the regular thugs and thieves that prowl the slums. Then again, the inner city houses a different class of thugs and thieves. Worst of em all up there.”</i> The herm points to the castle looming atop the hill at the center of the city.", parse);
	Text.NL();
	Text.Add("<i>”It ain’t easy to get a posh job in a town like this as a morph, but I happen to be very good at what I do. And what I do is take out the trash.”</i> She flashes an evil grin full of sharp, pointy teeth. <i>”’Course, someone like me could never get work as an officer. Not that I’d want to sit at a desk pushing papers all day anyways.”</i>", parse);
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
				Text.Add("<i>”Listen, I might have been a bit harsh on you before,”</i> Miranda grudgingly admits. <i>”I don’t take negative feedback very well… You think I could make it up to you by getting you a city visa? The procedure is rather quick. We can save the fun stuff for later.”</i> She smiles, winking at you.", parse);
				
				miranda.flags["Attitude"] = Miranda.Attitude.Nice;
			}
			else {
				Text.Add("<i>”Now I’ve got you here, deep within the city and without a visa,”</i> Miranda grins evilly at you. <i>”Wouldn’t it just be shame if one of the guards caught word of this? A good thing you have such a <b>nice</b> friend as me helping you out, isn’t it?”</i>", parse);
			}
		}
		else { // Nice
			if(Scenes.Miranda.DatingScore < 0) {
				Text.Add("<i>”I had planned on getting you a city visa while we were here, but I’ve been thinking,”</i> Miranda tells you bluntly. <i>”I’m not really impressed by your performance so far. Frankly, I think you’re a bit of an ass. You can still salvage this if you want to, though.”</i>", parse);
			}
			else {
				Text.Add("<i>”While we are passing through, I’ll help you get a city visa. It’ll allow you to pass the guards into the city any time you want. The procedure is rather quick. We can save the fun stuff for later.”</i> She smiles, winking at you.", parse);
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
			Text.Add("<i>”Now, be sure to come visit often,”</i> your friendly guide urges you. <i>”Lets head somewhere more… comfortable, shall we?”</i>", parse);
			Text.Flush();
			
			Gui.NextPrompt(Scenes.Miranda.DatingFirstHome);
		}
		else { // nasty or bad score
			Text.Add("Rather than leading you to the booth, Miranda pulls you into a nearby alleyway. She steps in close, trapping you with her full breasts, a dangerous glint in her eyes.", parse);
			Text.NL();
			Text.Add("<i>”Now, listen close. If you’d like me to do you this favor, you’d better do <b>me</b> a favor.”</i> the herm grabs hold of your hand and moves it to her crotch. You can feel her thick cock straining against the leather of her pants.", parse);
			Text.NL();
			if(miranda.Attitude() >= Miranda.Attitude.Neutral && Scenes.Miranda.DatingScore < 0) {
				Text.Add("<i>”Last chance to get on my good side, [boyGirl],”</i> she whispers through clenched teeth, grinding against you. <i>”Get down on your knees and suck like a good little slut, and all is forgiven.”</i>", parse);
			}
			else {
				Text.Add("<i>”You know what I want, my little slut,”</i> she whispers through clenched teeth, grinding against you. <i>”If you ever hope to get that visa, why don’t you try to convince me of your good intentions? Don’t bother with words, your mouth can be put to far better use.”</i>", parse);
			}
			Text.Flush();
			
			//[Blow her][Fuck no]
			var options = new Array();
			options.push({ nameStr : "Blow her",
				func : function() {
					Text.Clear();
					Text.Add("<i>”That’s the spirit,”</i> Miranda purrs as you lower yourself into position. <i>”Swallow your pride. Swallow a lot more.”</i> As she’s talking, she undoes her britches, releasing her stiff red cock. You gulp, getting second thoughts. It looks a lot bigger up close…", parse);
					Text.NL();
					Text.Add("The dommy herm doesn’t give you a lot of time to contemplate your hastily made choice, quickly prying the pointed tip of her shaft past your lips. <i>”Now, suck!”</i> Not that you have much to say in the matter. She inches her cock further in, leaving a trail of salty pre along your [tongueDesc]. Though you can sense that she’s eager to go all out and fuck your throat, she eases up, letting you do the work.", parse);
					Text.NL();
					
					Sex.Blowjob(player, miranda);
					miranda.Fuck(miranda.FirstCock(), 2);
					player.FuckOral(player.Mouth(), miranda.FirstCock(), 2);
					
					Text.Add("You dutifully bob your head up and down Miranda’s dick, struggling slightly with her girth. <i>”Yeees, keep it up my little slut. You do want your reward, don’t you? Suck that cock like you mean it!”</i> She keeps up a steady stream of mocking commentary, a bit louder than necessary. You suddenly realize that considering how close you are, the administrator can probably hear everything that she’s saying.", parse);
					Text.NL();
					Text.Add("<i>”Feel how it throbs?”</i> the guardswoman moans softly, breathing heavily. <i>”I’ve got a big fat load stored up in these balls of mine, bet you want it, don’t you?”</i> She’s not lying. Her large sack is hot to the touch, her cream ready to shoot down your throat. Her shaft is rock hard, twitching as she approaches the height of pleasure. <i>”...Too bad for you!”</i>", parse);
					Text.NL();
					Text.Add("Before you have time to react, Miranda withdraws from your mouth, grabbing the back of your head with one hand and jerking herself off with the other. The first blast splashes onto your [tongueDesc], but the following stream is less discriminatory, drenching your face and splattering on your [breastDesc]. The herm rubs the last drops of cum off the tip of her cock on your cheek, before hastily pulling up her pants again.", parse);
					Text.NL();
					Text.Add("Huffing slightly, Miranda pulls you out of the alleyway, smiling disarmingly at the city official as she drags you over to the booth. The guardswoman talks as if nothing is amiss, explaining that you need a visa and that she’ll vouch for you. When the flustered administrator starts to protest, she shows her identification as a member of the city watch, which speeds up the process considerably. From the burning in your cheeks, you are probably wearing a blush at least as deep as the clerk - though you doubt he can see it through the thick layer of cum dripping down your face.", parse);
					Text.NL();
					Text.Add("<b>Acquired citizen’s visa!</b>");
					rigard.flags["Visa"] = 1;
					Text.NL();
					Text.Add("<i>”Here you go, a city visa with Miranda’s compliments.”</i> The guardswoman hands over your prize, grinning mockingly. <i>”There is more where that came from too.”</i> Showing mercy on the poor official, she drags you off, heading toward the residential district. Swallowing your shame, you wipe off your face - though after this, you’ll need a long shower before you feel clean again.", parse);
					Text.Flush();
					
					Scenes.Miranda.DatingScore++;
					
					Gui.NextPrompt(Scenes.Miranda.DatingFirstHome);
				}, enabled : true,
				tooltip : "Fine, lets do this."
			});
			options.push({ nameStr : "Fuck no",
				func : function() {
					Text.Clear();
					Text.Add("<i>”Your choice.”</i> She shrugs, stepping back. <i>”Just for your information, it was the wrong one.”</i> Looking disappointed, the guardswoman heads off, motioning for you to follow her. Still affronted, you follow her into the residential district.", parse);
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
		Text.Add("<i>”All good nights come to an end, but this one doesn’t have to end here.”</i> Miranda looks at you suggestively. <i>”You are my kind of [guyGirl], [playername]. Would you like to come inside for a bit of fun?”</i>", parse);
		Text.Flush();
		
		//[Take charge][Passive][Decline]
		options.push({ nameStr : "Take charge",
			func : function() {
				Text.Clear();
				Text.Add("In response, you go in for a kiss, pushing the surprised woman inside. <i>”I wouldn’t do this for just anyone, you know,”</i> Miranda huffs, a faint blush visible on her cheeks. You close the door with your shoulder, glancing around the room.", parse);
				Scenes.Miranda.HomeDommySex();
			}, enabled : miranda.SubDom() - (miranda.Relation() + player.SubDom()) < 0,
			tooltip : "Heck yeah! Take her for a ride she won’t forget."
		});
		options.push({ nameStr : "Passive",
			func : function() {
				Text.Clear();
				Text.Add("You nod, smiling demurely and waiting for her to make a move. <i>”Just what I want to hear,”</i> Miranda grins as she pulls you inside, slamming the door behind you.", parse);
				Scenes.Miranda.HomeSubbySex();
			}, enabled : true,
			tooltip : "Let her call the shots."
		});
		options.push({ nameStr : "Decline",
			func : function() {
				Text.Clear();
				Text.Add("<i>”You don’t know what you’re missing.”</i> Miranda gives you a kiss before seeing you off, adding: <i>”You know where to find me, should you change your mind. I had a good time tonight, [playername], I want to show you my appreciation...”</i>", parse);
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
		Text.Add("<i>”I don’t know about you, but I’m up for a romp. How do you feel about biting the pillow for a few hours?”</i> For all of her nasty talk, you guess she still likes you enough to fuck you. Or perhaps she wants another chance to humiliate you, who knows.", parse);
		Text.Flush();
		
		//[Get fucked][Decline]
		var options = new Array();
		options.push({ nameStr : "Get fucked",
			func : function() {
				Text.Clear();
				Text.Add("<i>”Of course you are.”</i> She grins as she pulls you inside, slamming the door behind her. <i>”Had you pinned for a bitch from the moment I saw you.”</i>", parse);
				Scenes.Miranda.HomeSubbySex();
			}, enabled : true,
			tooltip : "If she’s offering, you’re willing."
		});
		options.push({ nameStr : "Decline",
			func : function() {
				Text.Clear();
				Text.Add("<i>”You are no fun,”</i> she huffs, <i>”as if I wanted to hang out with you just for your company. Well, fuck off then.”</i> With that, she slams the door in your face. From what you can tell, she’s not used to being turned down.", parse);
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
		Text.Add("<i>”You know, I think I’ve actually changed my mind about you,”</i> Miranda declares, smiling sweetly. <i>”I’ve had <b>such</b> a <b>good</b> time tonight, I’d just <b>love</b> to have you stay over.”</i>", parse);
		Text.NL();
		Text.Add("<i>”I’m so horny right now,”</i> she breathes, pulling you close, <i>”get inside and make love to me, make me scream!”</i> Her cock is straining against her insufficient clothes, rubbing against your thigh.", parse);
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
				Text.Add("<i>”Well this was a lousy day,”</i> Miranda grumbles. <i>”Ditched on my own doorstep. Well, fuck you too.”</i> She slams the door in your face, leaving you alone on the street. That could have gone better, you suppose. You’re just about to walk off, a bit unfamiliar with the neighbourhood, when you hear a bell ringing loudly. Glancing up, you see that Miranda is watching you from her window, grinning widely as she clangs a small brass bell.", parse);
				Text.NL();
				Text.Add("<i>”Bit of a send-off gift,”</i> she purrs. <i>”I’d say the guard will be here in a minute or two. You still got a bit of a head start, if you don’t want to spend the night in a cell.”</i> ", parse);
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

Scenes.Miranda.HomeDommySex = function() {
	var parse = {
		
	};
	
	party.location = world.loc.Rigard.Residental.miranda;
	
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

Scenes.Miranda.HomeSubbySex = function() {
	
	var parse = {
		
	};
	
	party.location = world.loc.Rigard.Residental.miranda;
	
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
