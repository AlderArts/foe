/*
 * 
 * Krawitz's Estate (located in Rigard plaza)
 * 
 */

import { world } from '../../world';
import { Event, Link, Scenes, EncounterTable } from '../../event';
import { GetDEBUG } from '../../../app';

world.loc.Rigard.Krawitz =
{
	street    : new Event("Krawitz's Estate"),
	servants  : new Event("Servants' Quarters"),
	grounds   : new Event("Grounds"),
	bathhouse : new Event("Bathhouse"),
	Mansion   :
	{
		hall      : new Event("Mansion"),
		study     : new Event("Study"),
		kitchen   : new Event("Kitchen"),
		storeroom : new Event("Storeroom")
	}
}

Scenes.Krawitz = {};
Scenes.Krawitz.EncType = {
	Guard   : 0,
	Servant : 1
}

Scenes.Krawitz.Flags = {
	Clothes        : 1,
	Binder         : 2,
	Sword          : 4,
	SpikedLadies   : 8,
	Sex            : 16,
	SpikedServants : 32,
	Orgy           : 64,
	TF             : 128
}

Scenes.Krawitz.SetupStats = function() {
	Scenes.Krawitz.stat = {};
	
	rigard.KrawitzWorkDay = null;
	
	Scenes.Krawitz.stat.IsServant         = rigard.Krawitz["Work"] == 2;
	Scenes.Krawitz.stat.HasServantClothes = Scenes.Krawitz.stat.IsServant;
	Scenes.Krawitz.stat.HasWine           = false;
	Scenes.Krawitz.stat.LustPotion        = false;
	Scenes.Krawitz.stat.ServantFood       = 0;
	Scenes.Krawitz.stat.KrawitzFood       = 0;
	Scenes.Krawitz.stat.ChestLocKnown     = false;
	Scenes.Krawitz.stat.TFItem            = false;
	Scenes.Krawitz.stat.TFdKrawitz        = false;
	Scenes.Krawitz.stat.BathhouseVisit    = false;
	Scenes.Krawitz.stat.BathhouseWine     = false;
	Scenes.Krawitz.stat.BathhouseSpiked   = false;
	Scenes.Krawitz.stat.SexedGirls        = false;
	Scenes.Krawitz.stat.MansionVisit      = false;
	Scenes.Krawitz.stat.KitchenVisit      = false;
	Scenes.Krawitz.stat.ServantWine       = false;
	Scenes.Krawitz.stat.ServantSpikedWine = false;
	Scenes.Krawitz.stat.ServSantOrgySetup = false;
	Scenes.Krawitz.stat.Orgy              = false;
	Scenes.Krawitz.stat.HasSword          = false;
	Scenes.Krawitz.stat.HasBinder         = false;
	
	Scenes.Krawitz.stat.Swiped            = false;
	
	Scenes.Krawitz.stat.Suspicion         = 0;
	Scenes.Krawitz.stat.AlarmRaised       = false;
	Scenes.Krawitz.stat.guardRot          = 0;
	Scenes.Krawitz.stat.servantRot        = 0;
	
	party.SaveActiveParty();
	party.ClearActiveParty();
	party.SwitchIn(player);
}

Scenes.Krawitz.GuardDex = function(entity, num) {
	num = num || 1;
	var dex = (entity == Scenes.Krawitz.EncType.Guard) ? 10 : 15;
	return num * dex;
}
Scenes.Krawitz.GuardAtk = function(entity, num) {
	num = num || 1;
	var str = (entity == Scenes.Krawitz.EncType.Guard) ? 40 : 20;
	return num * str;
}
Scenes.Krawitz.GuardCha = function(entity, num) {
	num = num || 1;
	var cha = (entity == Scenes.Krawitz.EncType.Guard) ? 15 : 10;
	if(entity == Scenes.Krawitz.EncType.Guard) {
		if(Scenes.Krawitz.stat.HasServantClothes) cha /= 2;
	}
	else { //Servants
		if(Scenes.Krawitz.stat.IsServant) cha /= 4;
		else if(Scenes.Krawitz.stat.HasServantClothes) cha *= 1.5;
	}
	
	return num * cha;
}
Scenes.Krawitz.ServantSuspicion = function() {
	if(Scenes.Krawitz.stat.IsServant) return 1;
	else if(Scenes.Krawitz.stat.HasServantClothes) return 3;
	else return 2;
}
Scenes.Krawitz.GuardSuspicion = function() {
	if(Scenes.Krawitz.stat.HasServantClothes) return 1;
	else return 3;
}
Scenes.Krawitz.EntitySuspicion = function(entity) {
	if(entity == Scenes.Krawitz.EncType.Guard)
		return Scenes.Krawitz.GuardSuspicion();
	else
		return Scenes.Krawitz.ServantSuspicion();
}

//
// Mansion
//
world.loc.Rigard.Krawitz.street.description = function() {
	Text.Add("You are in front of Krawitz's estate.<br>");
}

world.SaveSpots["Krawitz"] = world.loc.Rigard.Krawitz.street;
world.loc.Rigard.Krawitz.street.SaveSpot = "Krawitz";

world.loc.Rigard.Krawitz.street.onEntry = function() {
	Scenes.Krawitz.Scouting();
}

world.loc.Rigard.Krawitz.street.links.push(new Link(
	"Plaza", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Plaza, {minute: 10});
	}
));
world.loc.Rigard.Krawitz.street.links.push(new Link(
	"Back street", function() { return rigard.Krawitz["Work"] == 1;}, true,
	function() {
		if(rigard.Krawitz["Work"] == 1) {
			Text.Add("Enter the servants' quarters through the back entrance?");
			Text.NL();
		}
	},
	function() {
		Scenes.Krawitz.WorkWork();
	}
));
world.loc.Rigard.Krawitz.street.links.push(new Link(
	"Grounds", true, function() { return world.time.hour >= 20; },
	function() {
		Text.Add("Sneak into the main grounds? Better do this in the late hours of the day, though not too late. You suspect you'll need all the time you can get once inside.<br>");
	},
	function() {
		Scenes.Krawitz.ApproachGates();
	}
));

//
// Grounds
//
world.loc.Rigard.Krawitz.grounds.enc = new EncounterTable();
world.loc.Rigard.Krawitz.grounds.enc.AddEnc(function() { return Scenes.Krawitz.PatrollingGuards;}, 1.0, function() { return !Scenes.Krawitz.stat.Orgy; });
world.loc.Rigard.Krawitz.grounds.enc.AddEnc(function() { return Scenes.Krawitz.WanderingServants;}, 1.0, function() { return !Scenes.Krawitz.stat.ServantSpikedWine; });

world.loc.Rigard.Krawitz.grounds.description = function() {
	Text.Add("There is a lush garden spreading out before you, providing many hiding spots, should you need to avoid patrolling guardsmen or servants. Three buildings line the side of the grounds; if your guesses are correct, the one to your left houses the servants and the one on the right is some sort of bathhouse. ");
	if(!Scenes.Krawitz.stat.Orgy)
		Text.Add("Sounds of decidedly feminine laughter echo between the stone pillars. Clearly, someone has a party going on.");
	else
		Text.Add("Sounds of fornication emanating from the bathhouse echo throughout the district. You should probably stay clear of it for now.");
	Text.NL();
	Text.Add("At the back of the estate stands the main building, a two story mansion.");
}

world.loc.Rigard.Krawitz.grounds.onEntry = function() {
	var enc = new EncounterTable();
	enc.AddEnc(Scenes.Krawitz.PatrollingGuards,  1.0, function() { return !Scenes.Krawitz.stat.Orgy; });
	enc.AddEnc(Scenes.Krawitz.WanderingServants, 1.0, function() { return !Scenes.Krawitz.stat.ServantSpikedWine; });
	enc.AddEnc(PrintDefaultOptions, 1.0, true);
	enc.Get();
}

world.loc.Rigard.Krawitz.grounds.links.push(new Link(
	"Servants'", true, true,
	null,
	function() {
		var parse = {
			
		};
		party.location = world.loc.Rigard.Krawitz.servants;
		
		var ServantPrompt = function() {
			Text.Clear();
			//[Grounds]
			var options = new Array();
			options.push({ nameStr : "Grounds",
				func : function() {
					MoveToLocation(world.loc.Rigard.Krawitz.grounds);
				}, enabled : true,
				tooltip : "Move back to the grounds"
			});
			
			if(Scenes.Krawitz.stat.ServantOrgySetup) {
				Text.Add("The servants’ quarters are just about deserted, with everyone off somewhere to revel. Perhaps you should head over to the bathhouse to see what they are doing? Lewd noises from some of the bunks in the back indicate that at least some of the staff are still present, though quite busy at the moment.", parse);
			}
			else if(Scenes.Krawitz.stat.ServantSpikedWine) {
				Text.Add("The servants’ quarters are a mess of sexual sounds and smells as the drug you fed them runs its course. At this point, you doubt you could even get them to understand you until they’ve cum themselves dry and had a few cold showers.", parse);
			}
			else {
				if(Scenes.Krawitz.stat.ServantWine)
					Text.Add("The servants wave at you amiably, lulled by the good wine you gave them. Most of them seem to have gone to sleep it off.", parse);
				else
					Text.Add("Not much is going on in the servants’ quarters. The decor is rather sparse, and from what you can gather, men and women share the same rooms. Some people have tucked in for the night, sleeping restlessly on stacked bunk beds, while a few sit around a wooden table, playing cards.", parse);
				Text.NL();
				if(Scenes.Krawitz.stat.IsServant)
					Text.Add("There shouldn’t be any problems with you visiting. You have a legitimate reason for being here, and there shouldn’t be any suspicion raised so long as you don’t do anything weird.", parse);
				else
					Text.Add("While your clothes are probably enough to fool people at a distance, wandering around the servants’ quarters is likely to get you caught quickly. Better be very careful.", parse);
				
				if(Scenes.Krawitz.stat.ServantFood == 2) {
					options.push({ nameStr : "Food",
						func : function() {
							Text.Clear();
							parse["brotherSister"] = player.mfFem("brother", "sister");
							Text.Add("<i>“Many thanks, [brotherSister]!”</i> one of the resting servants calls out. He and his friends gather around, digging into the food. You feel as if a bit of the suspicion surrounding you has dissipated, and that the servants act slightly more trusting toward you.", parse);
							Scenes.Krawitz.stat.ServantFood = 3;
							Scenes.Krawitz.AddSuspicion(-25, true);
							Text.Flush();
							
							Gui.NextPrompt(ServantPrompt);
						}, enabled : true,
						tooltip : "Deliver the servants' food."
					});
				}
				if(Scenes.Krawitz.stat.HasWine && !Scenes.Krawitz.stat.ServantWine) {
					options.push({ nameStr : "Wine",
						func : function() {
							Text.Clear();
							Text.Add("<i>“Hey, what do you have there?”</i> A half-dressed servant asks you, pointing to the bottle of wine sticking out of your pack. You pull it out and show it to him, and he almost reverently cradles the bottle.", parse);
							Text.NL();
							Text.Add("<i>“Where did you get this?”</i> he asks, looking at you suspiciously. <i>“This is from the master’s stock, and a hell of a good one too!”</i> Thinking on your feet, you explain that the bottle is a gift to all the servants from the ladies of the house.", parse);
							Text.NL();
							Text.Add("<i>“Really now.”</i> He still looks a bit suspicious, but shrugs it off when some of the others gather around, too pleased at the treat to bother about its origins. It seems you are in the clear as the servants begin a celebration, calling a few sleepy maids from their beds to join the fun. There isn’t much to go around, but everyone gets at least a cup of the rich red wine.", parse);
							Text.NL();
							Text.Add("<i>“Such a kingly gift,”</i> one of them sighs. <i>“Perhaps this place isn’t so bad after all.”</i> The servants thank you, slightly drowsy after the potent wine.", parse);
							
							Scenes.Krawitz.AddSuspicion(-25, true);
							Scenes.Krawitz.stat.ServantWine = true;
							Text.Flush();
							
							Gui.NextPrompt(ServantPrompt);
						}, enabled : true,
						tooltip : "Offer the servants some wine."
					});
				}
				if(Scenes.Krawitz.stat.LustPotion && Scenes.Krawitz.stat.HasWine && !Scenes.Krawitz.stat.ServantSpikedWine) {
					options.push({ nameStr : "Spiked Wine",
						func : function() {
							Text.Clear();
							
							Scenes.Krawitz.stat.ServantWine = true;
							
							if(Scenes.Krawitz.stat.ServantWine) {
								Text.Add("<i>“Ah, the generous lord has seen fit to offer us even more wine? I’m not complaining!”</i> The servants give a great whooping cheer as you pass around the bottle of spiked wine.", parse);
							}
							else {
								Text.Add("<i>“Hey, what do you have there?”</i> A half-dressed servant asks you, pointing to the bottle of wine sticking out of your pack. You pull it out and show it to him, and he almost reverently cradles the bottle.", parse);
								Text.NL();
								Text.Add("<i>“Where did you get this?”</i> he asks, looking at you suspiciously. <i>“This is from the master’s stock, and a hell of a good one too!”</i> Thinking on your feet, you explain that the bottle is a gift to all the servants from the ladies of the house.", parse);
								Text.NL();
								Text.Add("<i>“Really now.”</i> He still looks a bit suspicious, but shrugs it off when some of the others gather around, too pleased at the treat to bother about its origins. It seems you are in the clear as the servants begin a celebration, calling a few sleepy maids from their beds to join the fun. There isn’t much to go around, but everyone gets at least a cup of the rich red wine.", parse);
								Scenes.Krawitz.AddSuspicion(-25, true);
							}
							Text.NL();
							Text.Add("<i>“Oh, this packs quite a punch!”</i> one of the servants exclaims, eyes blinking blearily as he tries to stay on his feet. After swaying unsteadily for a few moments, he topples over on his back, confused. <i>“Must ‘ave tripped on something,”</i> he mutters drunkenly. Splayed out on the floor as he is, the tent in his pants is clearly visible to everyone in the room.", parse);
							Text.NL();
							Text.Add("You notice that everyone around you is breathing heavily as the potent drug you gave them begins to set in. In a few moments, one of the maids has thrown herself over the fallen servant, desperately clawing at his pants. She quickly frees his stiff member, giving it a long lick before she starts sucking on it, her hands busy between her legs. The wordless impromptu orgy quickly spreads around you as the inebriated staff try to sate their drug-induced arousal.", parse);
							Text.NL();
							Text.Add("You could leave them like this, or...", parse);
							Text.Flush();
							
							Scenes.Krawitz.stat.ServantSpikedWine = true;
							
							//[Leave][Bathhouse]
							var options = new Array();
							options.push({ nameStr : "Leave",
								func : function() {
									Text.Clear();
									Text.Add("Satisfied that you won’t have to run into any more of the servants, you quickly leave the quarters before you are tempted to join. You have more important business to tend to here tonight.", parse);
									Text.Flush();
									
									Gui.NextPrompt(function() {
										MoveToLocation(world.loc.Rigard.Krawitz.grounds);
									});
								}, enabled : true,
								tooltip : "Leave them to it; they likely won’t bother you for the rest of the night."
							});
							options.push({ nameStr : "Bathhouse",
								func : function() {
									Text.Clear();
									Text.Add("You slyly suggest that they ought to thank the kind ladies who provided such a fine gift for them. Some of them are too far gone in their lust to hear you, but you manage to gather a substantial group to listen to your plan. They nod eagerly as you tell them of the ladies partying in the bathhouse, their clouded minds trying to process your words.", parse);
									Text.NL();
									Text.Add("They set off into the garden, swaying slightly and singing lewd tunes. In their state, it will probably take them a substantial time to even <i>find</i> the bathhouse, but it will be pretty interesting when they do. Among their number, you see both men and women, and hulking above them all, two huge equine handymen packing rather significant erections.", parse);
									Text.NL();
									Text.Add("This is turning out pretty well… now, where should you go to wreak havoc next?", parse);
									Text.Flush();
									
									Scenes.Krawitz.stat.ServantOrgySetup = true;
									
									Gui.NextPrompt(function() {
										MoveToLocation(world.loc.Rigard.Krawitz.grounds);
										Scenes.Krawitz.AddSuspicion(5, true);
									});
								}, enabled : true,
								tooltip : "Why not direct the mob somewhere else?"
							});
							Gui.SetButtonsFromList(options);
						}, enabled : true,
						tooltip : "Offer the servants some wine spiked with aphrodisiac."
					});
				}
			}
			
			Text.Flush();
			
			Gui.SetButtonsFromList(options);
			
			//[Street]
			Input.buttons[11].Setup("Street", function() {
				Text.Clear();
				Text.Add("Are you sure you would like to leave? You will not be able to return later.");
				Text.Flush();
				
				var options = new Array();
				options.push({ nameStr : "Yes",
					func : function() {
						Text.Clear();
						Text.Add("You’ve managed to avoid discovery so far, but you can feel your luck growing thin. Perhaps it’s time to call it quits. You methodically shed your servants’ garb, returning it to the storeroom before you step out the back door into the street, just another wanderer in the night.", parse);
						Text.NL();
						Text.Add("While it might take a while before the mansion discovers your activities, you decide it’s better to make yourself scarce, and quickly leave the area. Returning at a later time will likely be impossible.", parse);
						Text.Flush();
						
						Gui.NextPrompt(Scenes.Krawitz.Aftermath);
					}, enabled : true,
					tooltip : "Leave the estate, you've done enough for one night."
				});
				options.push({ nameStr : "No",
					func : ServantPrompt, enabled : true,
					tooltip : "Stay for a while longer."
				});
				Gui.SetButtonsFromList(options);
			}, true, null, "You’ve caused enough trouble for one night, time to call it quits. You won’t be able to return again as people will be a lot more suspicious of newcomers now.");
		}
		if(!Scenes.Krawitz.stat.HasServantClothes)
			Scenes.Krawitz.StealingClothes();
		else
			ServantPrompt();
	}
));
world.loc.Rigard.Krawitz.grounds.links.push(new Link(
	"Mansion", true, true,
	null,
	function() {
		Text.Clear();
		if(!Scenes.Krawitz.stat.MansionVisit) {
			Text.Add("You cautiously approach the large mansion at the back of the estate, knowing you might raise the alarm if you get caught in a place you are not supposed to be. The main entrance is out of the question as it is plainly visible to the guards patrolling the garden.");
			Text.NL();
			Text.Add("Noticing a small side entrance partially shrouded in darkness, you head closer to investigate. As you draw near, the door opens slightly. A cat-morph maid peeks out, glancing around furtively. Counting on the cover of night, you wait patiently for her to leave.");
			Text.NL();
			Text.Add("Being rather short, she stands on tiptoes to reach a nearby windowsill, extracting a large iron key from behind a potted plant. Once the door is securely locked, she glances around again, returns the key, gathers her skirts, and hurries off.");
			Text.NL();
		}
		Text.Add("You wait until nobody is around before approaching the side entrance, and procuring the key from its hiding place. You replace the key before slipping in, leaving as little trace of your passage as you can.");
		Scenes.Krawitz.stat.MansionVisit = true;
		Text.Flush();
		
		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.Krawitz.Mansion.hall, {minute: 10});
		});
	}
));
world.loc.Rigard.Krawitz.grounds.links.push(new Link(
	"Bathhouse", true, function() { return !Scenes.Krawitz.stat.Orgy; },
	null,
	function() { Scenes.Krawitz.Bathhouse(); }
));
world.loc.Rigard.Krawitz.grounds.links.push(new Link(
	"Street", true, true,
	function() {
		Text.NL();
		Text.Add("If you feel you’ve caused enough trouble for one night, you could leave over the fence. You won’t be able to return again as people will be a lot more suspicious of newcomers now.");
	},
	function() {
		Text.Clear();
		Text.Add("Are you sure you would like to leave? You will not be able to return later.");
		Text.Flush();
		
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				Text.Clear();
				Text.Add("You’ve managed to avoid detection so far, but you can feel your luck growing thin. Perhaps it is time to call it quits. Eyeing your surroundings carefully, you confirm that no guards are around at the moment. Silently, you slip over the fence, back into the streets. You shed your servants’ garb, hiding it in an alley.");
				Text.NL();
				Text.Add("While it might take a while before the mansion discovers your activities, you decide it’s better to make yourself scarce, and quickly leave the area. Returning at a later time will likely be impossible.");
				Text.Flush();
				
				Gui.NextPrompt(Scenes.Krawitz.Aftermath);
			}, enabled : true,
			tooltip : "Leave the estate; you've done enough for one night."
		});
		options.push({ nameStr : "No",
			func : PrintDefaultOptions, enabled : true,
			tooltip : "Stay for a while longer."
		});
		Gui.SetButtonsFromList(options);
	}
));

//
// Mansion: Hall
//
world.loc.Rigard.Krawitz.Mansion.hall.description = function() {
	if(Math.random() < 0.3) {
		Text.Add("As you step inside the main building of the Krawitz estate, a shiver crawls up your spine and you have a distinct feeling that something is amiss. You quickly scan your surroundings and spot a shadow out of the corner of your eye. On pure reflex, you give chase! Upon turning toward the hallway from which the phantasm disappeared to, you’re baffled and somewhat relieved when you don’t find anything… was that just your imagination?");
		Text.NL();
		
		Scenes.Krawitz.stat.Swiped = true;
	}
	var parse = {
		vase : Scenes.Krawitz.stat.Swiped ? "The huge staircase nearby is in disrepair, with visibly flaky paint." : "It’s a rather jarring contrast to see an ornate antique statue, no doubt very expensive, standing beside a huge staircase with visibly flaky paint."
	}
	Text.Add("You are in the main building of the Krawitz estate. The interior of the mansion, while richly decorated, has clearly seen better days. [vase] Though the main hallway is spotless, you can see tufts of dust gathering in the more dimly lit side corridors. The intricately designed carpet you are standing on exudes a faint smell of mold. Either Krawitz has been a massive cheapskate with maintenance lately, or the servants aren’t doing a very good job keeping this place in shape.", parse);
	Text.NL();
	Text.Add("The hallway you are in is currently deserted, but a servant or maid could probably come by at any moment. Best not linger.");
	Text.NL();
	Text.Flush();
}

world.loc.Rigard.Krawitz.Mansion.hall.links.push(new Link(
	"Grounds", true, true,
	function() {
		Text.Add("Go outside?<br>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.grounds);
	}
));
world.loc.Rigard.Krawitz.Mansion.hall.links.push(new Link(
	"Kitchen", true, true,
	null,
	function() {
		party.location = world.loc.Rigard.Krawitz.Mansion.kitchen;
		Text.Clear();
		Text.Add("The kitchen is relatively quiet during the dark hours, with only one cook being up and about, working on some leftover dishes. The rafters are bulging with delicious-looking foods, fresh spices hanging in rows along one wall, lending a pleasant aroma to the room.");
		Text.NL();
		Text.Add("The cook is a small middle-aged man with a small, oily moustache, dressed in white clothes bearing Krawitz’ emblem. He is bustling about, masterfully handling every minor task in the kitchen by himself.");
		Text.NL();
		if(!Scenes.Krawitz.stat.KitchenVisit) {
			Text.Add("<i>“Halt!”</i> For a moment, you freeze, thinking you are caught, but you relax a bit when he continues: <i>“Don’t bring the dirt in here, peon!”</i> He fusses about, waving you away from delicate tools and ingredients.");
			Text.NL();
			Text.Add("<i>“Well, what did you want?”</i> He doesn’t give you any opportunity to respond, continuing briskly.");
			Text.NL();
			if(Scenes.Krawitz.stat.HasServantClothes)
				Text.Add("<i>“If I need a servant to tend to some task, <b>I</b> send for <b>you</b>. You are <b>not</b> to waltz around here like you own the place.”</i>");
			else
				Text.Add("<i>“Judging by your rather uncouth dress, I assume you are one of the new guards. I swear, the master goes through them at a frightening rate.”</i> His eyes narrow disapprovingly. <i>“In to grab a midnight snack, are you? Not on my watch!”</i>");
			Scenes.Krawitz.stat.KitchenVisit = true;
		}
		else {
			Text.Add("<i>“What are you doing here again? Didn’t I tell you I don’t want anyone meandering around my workplace?”</i>");
		}
		Text.NL();
		if(Scenes.Krawitz.stat.ServantFood == 1) {
			Text.Add("You explain that you have orders to bring food for the night staff. <i>“Ah, yes, yes,”</i> the cook waves dismissively to a set of bundles laying on a table at the back. <i>“It should still be warm. Now run along.”</i>");
			Text.NL();
			Scenes.Krawitz.stat.ServantFood = 2;
		}
		else if(Scenes.Krawitz.stat.KrawitzFood == 1) {
			Text.Add("You explain that Krawitz wishes to have his dinner served, and you are here to bring it to him.");
			Text.NL();
			Text.Add("<i>“At this hour? Truly, the master works diligently.”</i> The cook shakes his head, waving toward a covered dish. <i>“Be quick about it, the master likes his food hot!”</i> You grab the warm dish, balancing it on one arm.");
			if(Scenes.Krawitz.stat.TFItem)
				Text.Add(" You are suddenly reminded of the vial with the alchemical solution that you are carrying… perhaps it would go well with the flavor?");
			Text.NL();
			Scenes.Krawitz.stat.KrawitzFood = 2;
		}
		else if(Scenes.Krawitz.stat.BathhouseVisit && !Scenes.Krawitz.stat.HasWine) {
			Text.Add("<i>“The ladies want even <b>more</b> wine?”</i> The chef looks crestfallen when you explain that you were sent by the ladies of the house. <i>“They are going through our stocks at quite the pace. At this rate, we will run dry by the end of the month!”</i>");
			Text.NL();
			Text.Add("He waves at a side door, leading into a small wine storage. You grab a few expensive looking bottles, hoping it will be enough.");
			if(Scenes.Krawitz.stat.LustPotion)
				Text.Add(" Perhaps the aphrodisiac you found could be put to an interesting use here...");
			Text.NL();
			Scenes.Krawitz.stat.HasWine = true;
		}
		Text.Add("You excuse yourself and leave the bristling chef, before you arouse further suspicion.");
		Text.Flush();
		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.Krawitz.Mansion.hall, {minute: 10});
			Scenes.Krawitz.AddSuspicion(3, true);
		});
	}
));
world.loc.Rigard.Krawitz.Mansion.hall.links.push(new Link(
	"Storeroom", true, true,
	function() {
		Text.Add("Go to the storeroom?<br>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.storeroom);
	}
));

world.loc.Rigard.Krawitz.Mansion.hall.links.push(new Link(
	"Study", true, function() { return Scenes.Krawitz.stat.Orgy || (!Scenes.Krawitz.stat.TFdKrawitz && Scenes.Krawitz.stat.KrawitzFood != 3); },
	function() {
		Text.Add("Go to Krawitz' study?<br>");
	},
	function() {
		party.location = world.loc.Rigard.Krawitz.Mansion.study;
		var parse = {
			
		};
		Text.Clear();
		Text.Add("The study is a cozy, if slightly derelict, room. Books and binders bulging with scrawled notes are stuffed into packed shelves. There is a fire going in the fireplace, adding a bit of warmth and light to the room during the dark hours of the night.");
		Text.NL();
		if(!Scenes.Krawitz.stat.HasSword) {
			Text.Add("Above the fireplace, a lavish rapier hangs. It is an exquisite work of metalcraft, in good shape despite its significant age. It is, without a doubt, the most valuable object in the entire mansion.");
			Text.NL();
		}
		
		
		if(Scenes.Krawitz.stat.Orgy) {
			Text.Flush();
			PrintDefaultOptions(true);
			return;
		}
		
		if(Scenes.Krawitz.stat.KrawitzFood == 0) {
			Scenes.Krawitz.stat.KrawitzFood = 1;
			Text.Add("The master of the estate nestles in a worn armchair by the fireplace, deeply embroiled in some document. Lord Krawitz is a man who has seen better years, the passage of time clearly evident in his odd wardrobe, his balding hair and his slightly sagging body. By the looks of it, this isn’t the first all-nighter that he has pulled during the last week as the deep, dark pockets below his tired eyes glisten starkly in the light of the fire.");
			Text.NL();
			if(rigard.Krawitz["Duel"] > 0) {
				Text.Add("You freeze, wondering if going in here was such a good idea. He might recognize you, which wouldn’t be a good thing, considering the outcome of your last meeting.");
				Text.NL();
			}
			Text.Add("Krawitz jumps to his feet as soon as you enter the room, clutching the documents he is reviewing close to his chest. He looks a harried man, cornered and desperate.");
			Text.NL();
			if(Scenes.Krawitz.stat.HasServantClothes) {
				Text.Add("Upon seeing your servants garb, he visibly sags, his mood turning from startled to irritated.");
				Text.NL();
				var humanity = player.Humanity();
				parse["human"] = humanity < 0.95 ? ", face contorting in disgust as he sees your non-human features" : "";
				Text.Add("<i>“I expressly told that oaf I was <b>not</b> to be disturbed tonight!”</i> he mutters, more to himself than to you. He gives you a brief glance[human], shaking his head.", parse);
				Text.NL();
				Text.Add("<i>“That old fool hires anyone these days.”</i> The thought that you might take offense doesn’t seem to have passed through his mind, and if it did, he doesn’t care. The old lord gets back into his seat, gathering a few sheets that had tumbled to the floor.");
				Text.NL();
				Text.Add("<i>“I’m busy with work tonight - do not disturb me further.”</i> As an afterthought, he turns back, adding: <i>“As long as you are here… bring me my dinner from the kitchen, and be quick about it!”</i>");
				Text.NL();
				Text.Add("With that, you are dismissed.");
				Text.Flush();
				
				var options = Scenes.Krawitz.KrawitzPrompt();
				Gui.SetButtonsFromList(options);
			}
			else {
				Scenes.Krawitz.FightKrawitz();
			}
		}
		else {
			if(Scenes.Krawitz.stat.KrawitzFood == 3)
				Text.Add("<i>“Do not bother me further, if you wish to keep your job.”</i>");
			else
				Text.Add("<i>“Did you bring my food? If not, why do you bother me again?”</i>");
			Text.NL();
			Text.Add("The old man doesn’t lift his eyes from the document he is reviewing, dismissing your presence.");
			Text.Flush();
			
			var options = Scenes.Krawitz.KrawitzPrompt();
			
			if(Scenes.Krawitz.stat.KrawitzFood == 2) {
				
				var foodFunc = function() {
					Text.Clear();
					Text.Add("You wordlessly place the dish on the table, lifting away the covering to reveal a small but delicious-looking meal, exquisitely prepared and presented. Krawitz is drawn from his brooding by the smells wafting up from the food, and he hurriedly puts down whatever it is that he’s working on.");
					Text.NL();
					Text.Add("<i>“Took long enough,”</i> he complains nasally, though he is more focused on the food than on you. The haughty lord sets into his meal, waving you away.");
					Scenes.Krawitz.stat.KrawitzFood = 3;
				};
				
				options.push({ nameStr : "Food",
					func : function() {
						foodFunc();
						Text.Add(" <i>“I have no further need for you tonight, leave me,”</i> he mumbles between mouthfuls. Krawitz ushers you out of the study, locking the door behind you to prevent further interruption.", parse);
						Text.NL();
						Text.Add("<b>The study is locked for the time being.</b>", parse);
						Text.Flush();
						
						Gui.NextPrompt(function() {
							MoveToLocation(world.loc.Rigard.Krawitz.Mansion.hall, {minute: 10});
							Scenes.Krawitz.AddSuspicion(1, true);
						});
					}, enabled : true,
					tooltip : "Serve the lord his food."
				});
				if(Scenes.Krawitz.stat.TFItem) {
					options.push({ nameStr : "Spiked Food",
						func : function() {
							foodFunc();
							Text.Add(" You stand back, observing curiously as Krawitz digs into his slightly modified meal, wondering what the effects will be. He looks like he is enjoying the taste at the very least.", parse);
							Text.NL();
							Text.Add("After a dozen mouthfuls or so, the old man suddenly twitches as a shudder runs through his body. He looks like he is about to be very ill. <i>“What in the-”</i> he starts, before his irritated complaint suddenly cuts off, and he staggers backwards, gasping. The lord’s pitiful cry turns into a curious mewling as a pair of feline ears sprout from his balding scalp. A ripping noise from his bottom precedes the appearance of a long, fluffy tail, which sways about erratically. The confused lord scrabbles about on the floor, panicking as fur starts to grow on the back of his hands, turning them to paws.", parse);
							Text.NL();
							Text.Add("<i>“O-out!”</i> he yowls, terrified of letting anyone see his new appearance. You’ve barely cleared the room when you hear the lock clicking behind you, muffling desperate hacks and coughs as Krawitz tries to retch up the food to prevent further transformation.", parse);
							Text.NL();
							Text.Add("That, or he is trying to cough up his first hairball.", parse);
							Text.NL();
							Text.Add("<b>The study is locked for the time being.</b>", parse);
							Text.Flush();
							
							Scenes.Krawitz.stat.TFdKrawitz = true;
							
							Gui.NextPrompt(function() {
								MoveToLocation(world.loc.Rigard.Krawitz.Mansion.hall, {minute: 10});
								Scenes.Krawitz.AddSuspicion(3, true);
							});
						}, enabled : true,
						tooltip : "Serve the lord his food, but pour a bit of the alchemical vial onto the dish first."
					});
				}
			}
			
			Gui.SetButtonsFromList(options);
		}
	}
));

Scenes.Krawitz.KrawitzPrompt = function() {
	var parse = {};
	//[Challenge][Leave]
	var options = new Array();
	options.push({ nameStr : "Challenge",
		func : function() {
			Text.Clear();
			Text.Add("You tell him that he presumes too much, not bothering to sugarcoat your words. Krawitz looks at you incredulously, hardly believing his ears.", parse);
			Text.NL();
			Text.Add("<i>“What did you say?!”</i> he sputters, eyes bulging in anger. Laughing, you shrug your way out of your servants’ garb, revealing your regular gear below it.", parse);
			Text.NL();
			
			Scenes.Krawitz.FightKrawitz();
		}, enabled : true,
		tooltip : "Confront the old bugger, shedding your disguise."
	});
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			Text.Add("You pardon yourself, leaving the room.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Rigard.Krawitz.Mansion.hall, {minute: 10});
				Scenes.Krawitz.AddSuspicion(1, true);
			});
		}, enabled : true,
		tooltip : "Excuse yourself."
	});
	return options;
}

Scenes.Krawitz.FightKrawitz = function() {
	var parse = {};
	if(rigard.Krawitz["Duel"] > 0) {
		Text.Add("<i>“It- it’s you!”</i> Krawitz gasps, recognizing you from your previous encounter. <i>“Why have you come here?!”</i>");
	}
	else {
		Text.Add("<i>“You… you are no servant of mine!”</i>");
	}
	Text.NL();
	Text.Add("You tell him you are here to teach him a lesson in humility. The old man thinks quickly on his feet, though. Almost before you’ve opened your mouth, he’s jumped from his chair to the fireplace, grabbing the sword hanging above it. He whirls around, facing you with his rapier at the ready.");
	Text.NL();
	Text.Add("<i>“Uncouth peon, prepare yourself!”</i> he shouts. You only have moments before he springs on you.");
	Text.Flush();
	
	//[Fight][Binder][Flee]
	var options = new Array();
	options.push({ nameStr : "Fight",
		func : function() {
			Text.Clear();
			Text.Add("Surely, the old man can’t be that tough. Confidently, you prepare yourself for battle.", parse);
			Text.NL();
			if(player.Dex() + player.Str() + Math.random() * 20 > 80) {
				Text.Add("Krawitz looks surprised as you narrowly dodge his first blows, backing away slightly as you make a grab for him. You are rewarded with a stabbing pain in your hand for your efforts. Grimacing, you adjust your stance, licking your wounds.", parse);
				Text.NL();
				Text.Add("The lord hasn’t called for guards yet; either he is too intent on the fight, or he is confident he can bring you down on his own. His defense is a maze, hardly leaving any openings for you as he struts, foppish but deadly.", parse);
				Text.NL();
				Text.Add("Luck is on your side, however, as a brief stumble opens a hole in his guard. Acting quickly, you lunge forward, crashing into him. The two of you roll on the floor, fighting for the upper hand, but when you regain your footing, you are the one holding the sword.", parse);
				Text.NL();
				Text.Add("Krawitz gives you one last look of pure disgust before he makes his escape, no doubt running to fetch the guards.", parse);
				Text.NL();
				Text.Add("Before you leave, you make sure to grab the documents he was poring through. Who knows, there might be some dirt on him in there.", parse);
				Text.NL();
				Text.Add("On the way out of the mansion, you wisely use the side entrance, avoiding the guards running toward the study. You’ve somehow avoided your pursuers, but you’d better make yourself scarce quickly. Vaulting over a wall, you find yourself on the street, and quickly melt away into the night before the guards think to search outside.", parse);
				
				Scenes.Krawitz.stat.HasSword  = true;
				Scenes.Krawitz.stat.HasBinder = true;
				Text.Flush();
				
				Scenes.Krawitz.stat.AlarmRaised = true;
				Gui.NextPrompt(Scenes.Krawitz.Aftermath);
			}
			else {
				Text.Add("Your plan quickly changes as you narrowly avoid getting skewered. Krawitz means business, and he’s out for blood. Never mind overpowering him, you are scrambling to hang on to your life! You quickly understand how it is that this man is considered a master of the sword, despite his less than imposing physique.", parse);
				Text.NL();
				Text.Add("Your best bet for now seems to be to leg it while you can, no matter how much it hurts your pride.", parse);
				Text.NL();
				Scenes.Krawitz.Flee();
			}
		}, enabled : true,
		tooltip : "Try to overpower him."
	});
	options.push({ nameStr : "Binder",
		func : function() {
			Text.Clear();
			Text.Add("You glance at the documents that Krawitz was poring over. He seemed worried that someone might see them… Before he can react, you lunge for them.", parse);
			Text.NL();
			if(player.Dex() + Math.random() * 20 > 40) {
				Text.Add("Grabbing hold of the binder, you narrowly roll out of the way, avoiding Krawitz stabs. The old man curses you as you dash from the room, a slightly frightened note in his voice.", parse);
				Text.NL();
				Scenes.Krawitz.stat.HasBinder = true;
				Scenes.Krawitz.Flee(true);
			}
			else {
				Text.Add("You freeze as the rapier stabs down at the pack of documents, spearing it to the floorboards. Realizing that you’ve lost your opportunity, you make your escape before the old fart has time to stab you too.", parse);
				Text.NL();
				Scenes.Krawitz.Flee();
			}
		}, enabled : true,
		tooltip : "Grab hold of the documents and run for it!"
	});
	options.push({ nameStr : "Flee",
		func : function() {
			Text.Clear();
			Scenes.Krawitz.Flee();
		}, enabled : true,
		tooltip : "This isn’t the time to fight Krawitz. Make your escape."
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Krawitz.Flee = function(entryPoint) {
	var parse = {};
	if(!entryPoint) {
		Text.Add("This wasn’t a very good plan to start with. You curse yourself as you dash through the dark corridors of the mansion, the sound of alarms rising around you, the livid lord hot on your heels. You hear him groaning in pain as you throw down various vases and statues to block his path, though you don’t stop to find out if the pain is physical or merely monetary.", parse);
		Text.NL();
	}
	Text.Add("You dodge past a pair of surprised guards, rushing out into the yard. With your pursuers close behind you, you somehow manage to make a mad dash through the garden, leaping over the sharp fence surrounding the mansion.", parse);
	Text.NL();
	Text.Add("You’ve barely managed to flee, and you quickly make yourself scarce, shaking off the tailing guards. Looks like you won’t lead any more adventures into this place for a while.", parse);
	Text.Flush();
	
	Scenes.Krawitz.stat.AlarmRaised = true;
	Gui.NextPrompt(Scenes.Krawitz.Aftermath);
}

//
// Mansion: Storeroom
//
world.loc.Rigard.Krawitz.Mansion.storeroom.description = function() {
	Text.Add("You are in a rather dusty storeroom, filled with boxes, crates and chests. A quick survey of the room reveals nothing of immediate value. A small glass cabinet filled with various flasks, partly obscured by a rolled up carpet, looks like it could be interesting.");
	if(!Scenes.Krawitz.stat.TFItem) {
		if(Scenes.Krawitz.stat.ChestLocKnown) {
			Text.NL();
			Text.Add(" Recalling the conversation you overheard, you make your way to the back of the room, uncovering a small ornate chest hidden behind a drapery.");
		}
		else if(player.Int() > 40) {
			Text.NL();
			Text.Add(" Where could the good stuff be hidden? Scanning the room once more, your eyes hone in on a drapery hanging at the very back of the room. Pulling it aside, you uncover a small ornate chest. Too easy.");
		}
	}
	Text.Flush();
}

world.loc.Rigard.Krawitz.Mansion.storeroom.links.push(new Link(
	"Hall", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.hall);
	}
));

world.loc.Rigard.Krawitz.Mansion.storeroom.events.push(new Link(
	"Cabinet", function() { return !Scenes.Krawitz.stat.LustPotion; }, true,
	null,
	function() {
		Scenes.Krawitz.stat.LustPotion = true;
		Text.Clear();
		Text.Add("You open the cabinet, surveying the vials within. They seem to be different types of perfume, ranging from red to pink in color. Curious, you pick one at random and open the stopper. Just a sniff...");
		Text.NL();
		Text.Add("<i>...Uncalled for perverse visions of depravity roll over your unprepared senses. It is more than the smell - you want to <b>taste</b> it, to bathe in it, to have it enter your pores. You can already feel the taste on your [tongue], a mixture of salty cum and sweet nectar, the pure essence of sin. A burning heat is rising within you, wanting to fuck, to be fucked, to join in the orgy, a writhing mass of flesh and sweat...</i>", { tongue: player.TongueDesc() });
		Text.NL();
		Text.Add("...Wow. Hurriedly replacing the stopper, you shake your head, trying to clear your thoughts. That is some potent stuff. Pursing your lips, you pocket the vial and a few similar ones. This could be used for a great distraction...");
		Text.NL();
		Text.Add("As to why Krawitz got it hidden here in the storeroom, or if he uses them for something, who knows?");
		if(Scenes.Krawitz.stat.HasWine) {
			Text.NL();
			Text.Add("...Actually, this could be a great addition to the wine. The perfect way to spice up the evening a bit.");
		}
		player.AddLustFraction(0.5);
		Text.Flush();
		Gui.NextPrompt();
	}
));

world.loc.Rigard.Krawitz.Mansion.storeroom.events.push(new Link(
	"Chest", function() { return !Scenes.Krawitz.stat.TFItem && (Scenes.Krawitz.stat.ChestLocKnown || player.Int() > 40); }, true,
	null,
	function() {
		Scenes.Krawitz.stat.TFItem = true;
		Text.Clear();
		Text.Add("The chest isn’t locked, its well-oiled hinges making no noise as you open the lid. Inside, you find a curious collection of vials, jars and bottles, marked with strange symbols. Each object is placed with meticulous care in a padded slot, protecting the contents from harm. The vials themselves are quite curious as well - some of elaborate blown glass, others looking like they were cut from some sort of crystal. Whatever these are, they look very expensive.");
		Text.NL();
		Text.Add("You pocket one of the bottles, bearing the symbol of a cat on it. Perhaps it has some sort of transformative effects? The fluid inside seems reminiscent of an alchemical solution.");
		if(Scenes.Krawitz.stat.KrawitzFood == 2) {
			Text.NL();
			Text.Add("You wonder what would happen if you mixed it with Krawitz' food...");
		}
		Text.Flush();
		Gui.NextPrompt();
	}
));

//
// Mansion: Study
//
world.loc.Rigard.Krawitz.Mansion.study.description = function() {
	Text.Add("The room is empty, though the fireplace is still blazing merrily. On a nearby table, a half eaten meal is growing cold.");
}

world.loc.Rigard.Krawitz.Mansion.study.links.push(new Link(
	"Hall", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.hall, {minute: 10});
	}
));

world.loc.Rigard.Krawitz.Mansion.study.events.push(new Link(
	"Sword", function() { return !Scenes.Krawitz.stat.HasSword; }, true,
	null,
	function() {
		Text.Clear();
		Text.Add("You take the opportunity to take Krawitz’ prized sword, hiding it in your pack. The old man will surely feel this loss.");
		Text.Flush();
		Scenes.Krawitz.stat.HasSword = true;
		Gui.NextPrompt();
	}
));
world.loc.Rigard.Krawitz.Mansion.study.events.push(new Link(
	"Binder", function() { return !Scenes.Krawitz.stat.HasBinder; }, true,
	null,
	function() {
		Text.Clear();
		Text.Add("You grab the binder of documents from the table, glancing through them briefly before pocketing them. They seem to be records of financial transactions, and while you don’t recognize the names of the various companies and individuals, the numbers make your eyes widen slightly.");
		Text.NL();
		Text.Add("Time enough to decipher this later.");
		Text.Flush();
		Scenes.Krawitz.stat.HasBinder = true;
		Gui.NextPrompt();
	}
));

Scenes.Krawitz.Scouting = function() {
	var parse = {
		
	};
	Text.Clear();
	Text.Add("Following the directions of the red-haired man, you follow the network of side streets, a few blocks away from the main plaza. Seems that the man was right; even though he goes by the monicker of lord, Krawitz’ estate isn’t all that large. The main mansion is an old building constructed of stone, the grounds in front forming a small garden with lush greenery and a small fountain in the center. Connected to the main house, which stands two stories high, is a building with an open roof that looks to be a bathhouse.", parse);
	Text.NL();
	Text.Add("On the opposite side of the garden, a low building of cheaper make covers one side of the garden, probably intended for servants. The grounds are surrounded by a stone wall on the sides and a metal fence in front, barring unauthorized entry. The gates seems to be locked, but you guess that the servants probably have a back entrance.", parse);
	
	if(rigard.Krawitz["Work"] == 0 && world.time.hour >= 6 && world.time.hour < 20) {
		Text.NL();
		Text.Add("As you approach the estate, you become aware of a commotion down a side street. Curious, you peek down the alleyway that seems to lead to the servants’ entrance. There is a small gathering of people there, most of them morphs of various kinds, embroiled in an argument.", parse);
		Text.NL();
		Text.Add("<i>“I keep tellin’ ya, it’s not worth the pay, not this shit!”</i> The speaker, a dog-morph in his twenties, spits on the ground. <i>“I’m used to people lookin’ down dere noses at me in this city, but lord-fucking-almighty is a cut above the rest.”</i> There is some grudging agreement from the people around him, all of them dressed in blue servants’ livery. Most likely, they all work for Krawitz.", parse);
		Text.NL();
		Text.Add("Well, almost all of them, as the agitated dog-morph tosses aside his blue tunic, leaving it in a crumpled heap in the gutter. <i>“I’ve had it, I’m out.”</i> Looking furious, he strides past you, muttering under his breath. The remaining servants eye each other uneasily.", parse);
		Text.NL();
		Text.Add("<i>“He's got a point,”</i> someone grumbles. <i>“With that shit with Jigo last winter, Krawitz made it pretty clear none of us are safe.”</i>", parse);
		Text.NL();
		Text.Add("A girl with rabbit ears poking out of her wiry brown hair hesitantly steps forward. <i>“What are you talking about? I haven’t spoke to the master, as I started last week, but the Lady and the young Miss both treat me nice.”</i>", parse);
		Text.NL();
		Text.Add("The person who spoke first, a wiry old man with bushy side whiskers, steps forward. <i>“They would, a pretty thing like you,”</i> he grumbles, making the servant girl blush. <i>“It’s okay, dear, just keep your head down and don’t get on their bad side. I’m not sure about this new one, but the old wife was a nasty piece of work, perfect fit for her husband.”</i>", parse);
		Text.NL();
		Text.Add("<i>“In any case, last winter was particularly harsh. There was barely any food for us, and someone went and pilfered the storeroom. Never found out who actually did it, but Jigo, the stable boy, took the fall for it. Lord Krawitz was mighty angry, and ordered his mercs to whip the poor boy within an inch of his life before throwing him out into the street. Someone helped him, fortunately, or he would’ve frozen to death right there. He was this close to skewering the lad on that prized sword of his too, t’was all I could do to convince him not to. A bad winter, that was.”</i> An uncomfortable silence falls over the gathering.", parse);
		Text.NL();
		Text.Add("<i>“Work is work, I’ll take his money even if he spits at my feet as I walk by,”</i> another of the servants counters. <i>“The pay may not be good, but it’s way more than I would get working the fisheries.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Work is going to get rougher too, with one gardener short,”</i> the old man complains. <i>“Don’t suppose any of you know your way about a garden, do you? These old bones can’t climb trees like they used to...”</i>", parse);
		Text.NL();
		Text.Add("An opening, huh... this could actually be a golden opportunity for you to get access to the mansion and snoop a bit.", parse);
		Text.Flush();
		
		//[Work][Leave]
		var options = new Array();
		options.push({ nameStr : "Work",
			func : function() {
				Text.Clear();
				Text.Add("Joining the group, you explain that you overheard them, and are currently looking for work. The old man, who seems to be some sort of administrator, eyes you critically.", parse);
				Text.NL();
				
				var humanity = player.Humanity();
				
				if(humanity < 0.5 || player.LowerBodyType() != LowerBodyType.Humanoid) {
					Text.Add("<i>“Sorry kiddo, no offense, but with your looks, Krawitz would have my head if I let you on the grounds, twenty years of service or no.”</i> The old man shakes his head sadly. <i>“Trust me, it is for the best. Find work elsewhere.”</i>", parse);
					Text.NL();
					Text.Add("Shrugging, you leave the gathering. Seems you aren’t welcome.", parse);
					
					rigard.Krawitz["Work"] = 3;
				}
				else {
					Text.Add("<i>“Well, we are short on people,”</i> he mutters, <i>“you’ll do as good as any, I suppose.”</i> He goes on to question you about your skills and previous experience. Apparently satisfied with what he hears, he gives you a curt nod.", parse);
					Text.NL();
					Text.Add("<i>“Come by tonight at eight o'clock; I’ll let you in the back entrance and show you around while the house sleeps.”</i> The other servants briefly introduce themselves before moving on to their tasks, their break finished. <i>“You get two meals a day, a bunk to sleep in and some coin to spend. Stay on for a week without messing up and I’ll put you on the payroll.”</i>", parse);
					Text.NL();
					Text.Add("His short briefing concluded, the old man heads back inside the estate. <i>“Remember, meet me here at eight o’clock tonight. I’ll be up until midnight, but you don’t want to be late for your first day on the job, eh?”</i>", parse);
					Text.NL();
					Text.Add("With that, you are left to your own devices.", parse);
					Text.NL();
					Text.Add("<b>You should return to Krawitz’ mansion between 20-24 tonight.</b>", parse);
					
					rigard.Krawitz["Work"]       = 1;
					rigard.KrawitzWorkDay        = world.time.Clone();
					rigard.KrawitzWorkDay.hour   = 0;
					rigard.KrawitzWorkDay.minute = 0;
					rigard.KrawitzWorkDay.Inc({day: 1});
					
					Gui.NextPrompt();
				}
				Text.Flush();
			}, enabled : true,
			tooltip : "Take the chance that is presented to you - getting access to the estate should be way easier if you have a legitimate reason for it. Talking to the servants may also give you some ideas on how to humiliate Krawitz."
		});
		options.push({ nameStr : "Leave",
			func : function() {
				Text.Clear();
				Text.Add("Shrugging, you move on before you are noticed. At least you got some interesting information out of it.", parse);
				Text.Flush();
				
				rigard.Krawitz["Work"] = 3;
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "You might be letting this one slip out of your grasp as the position will likely be filled soon. Still, you don’t intend to wear a servants’ garb for Krawitz. There are other ways."
		});
		Gui.SetButtonsFromList(options);
	}
	else {
		Text.NL();
		Text.Flush();
		PrintDefaultOptions(true);
	}
}

Scenes.Krawitz.WorkWork = function() {
	var parse = {
		
	};
	
	Text.Clear();
	
	if(world.time.hour < 6) {
		Text.Add("There doesn’t seem to be anyone at the back door at the moment, and it is locked shut.", parse);
		Text.Flush();
		Gui.NextPrompt();
	}
	else if(rigard.KrawitzWorkDay.Leq(world.time)) { // Late
		rigard.KrawitzWorkDay = null;
		Text.Add("<i>“And what do you think you are doing here?”</i> the old manservant greets you gruffly. <i>“I don’t have any use for people who can’t keep track of time.”</i> Before you can mouth an excuse, he curtly dismisses you, locking the door behind him as he returns inside the estate.", parse);
		Text.NL();
		Text.Add("<b>It seems you lost your chance on this one. You should try to get in some other way.</b>", parse);
		Text.Flush();
		
		rigard.Krawitz["Work"] = 3;
		
		Gui.NextPrompt();
	}
	else if(world.time.hour < 20) {
		Text.Add("It isn’t time to go to work yet. You decide to return later.", parse);
		Text.NL();
		Text.Add("<b>The old man said you should show up at the back entrance between 20 and 24 tonight.</b>", parse);
		Text.Flush();
		Gui.NextPrompt();
	}
	else {
		Text.Add("You get a feeling you’ll only get one shot at this, so you’d best be prepared.", parse);
		Text.NL();
		Text.Add("<b>Do you want to save before entering?</b>", parse);
		Text.Flush();
		
		//[Yes][No][Wait]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				LimitedDataPrompt(Scenes.Krawitz.EnteringTheWork);
			}, enabled : true, tooltip : ""
		});
		options.push({ nameStr : "No",
			func : Scenes.Krawitz.EnteringTheWork, enabled : true, tooltip : ""
		});
		options.push({ nameStr : "Wait",
			func : function() {
				Text.NL();
				Text.Add("Deciding that you still need to prepare, you hold off on entering the estate.", parse);
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "You are not quite ready to enter the estate yet."
		});
		Gui.SetButtonsFromList(options);
	}
}

Scenes.Krawitz.EnteringTheWork = function() {
	var parse = {
		name : function() { return party.Get(1).name; }
	};
	
	Text.Clear();
	if(party.Num() == 2) {
		Text.Add("Figuring that one person can move around easier than two, you ask [name] to wait for you outside the estate.", parse);
		Text.NL();
	}
	else if(party.Num() > 2) {
		Text.Add("Figuring that one person can move around easier than a group, you ask your companions to wait for you outside the estate.", parse);
		Text.NL();
	}
	
	Text.Add("The old man from before shuffles over and unlocks the servants’ entrance on your third knock. He impatiently waves you inside, closing the door behind you.", parse);
	Text.NL();
	Text.Add("<i>“Now then, here is a small advance payment,”</i> he says, handing you a small bag of coins. <i>“Go to the back room and find yourself some livery, then return to me and I shall explain your duties for the night.”</i> You are directed to a small storeroom near the door leading to the grounds. Inside, you find a number of blue tunics and dresses, just like the ones you saw the servants wearing earlier.", parse);
	Text.NL();
	Text.Add("You take your time finding one that fits, glad you’ll be able to move around comfortably. Once properly dressed, you return to the old man. He briefly goes through your basic duties, stressing a few key points.", parse);
	Text.NL();
	Text.Add("<i>“Understand? Once you are done tending the grounds, go to the kitchens and fetch food for the night staff. The ladies of the house are currently in the bathhouse, so stay clear of that. At this time of the night, Master Krawitz is probably in his study; you are not to disturb him under any circumstances.”</i>", parse);
	Text.NL();
	Text.Add("You nod amiably, leaving the servants' quarters for the grounds. This is going to be almost too easy...", parse);
	Text.NL();
	Text.Add("<b>You received 50 coins!</b>", parse);
	Text.Flush();
	
	rigard.Krawitz["Work"] = 2;
	
	Scenes.Krawitz.SetupStats();
	
	Scenes.Krawitz.stat.ServantFood = 1;
	
	party.coin += 50;
	
	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 30});
	});
}

Scenes.Krawitz.ApproachGates = function() {
	var parse = {
		
	};
	
	Text.Clear();
	if(world.time.hour >= 4 && world.time.hour < 20) {
		Text.Add("The guards at the gate don’t look too friendly. You’d best wait until the cover of night if you want to covertly enter the estate.", parse);
		Text.Flush();
		Gui.NextPrompt();
	}
	else {
		Text.Add("The gate in the fence surrounding the estate is lit by a torch, and you see a bored guard posted outside. Approaching that way seems out of the picture. You note, however, that the light of the torch doesn’t reach very far. You should be able to slip over the fence without anyone noticing.", parse);
		Text.NL();
		Text.Add("You get a feeling you’ll only get one shot at this, so you’d best be prepared.", parse);
		Text.NL();
		Text.Add("<b>Do you want to save before entering?</b>", parse);
		
		Text.Flush();
		
		//[Yes][No][Wait]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				LimitedDataPrompt(Scenes.Krawitz.SneakingIn);
			}, enabled : true, tooltip : ""
		});
		options.push({ nameStr : "No",
			func : Scenes.Krawitz.SneakingIn, enabled : true, tooltip : ""
		});
		options.push({ nameStr : "Wait",
			func : function() {
				Text.NL();
				Text.Add("Deciding that you still need to prepare, you hold off on entering the estate.", parse);
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "You are not quite ready to enter the estate yet."
		});
		Gui.SetButtonsFromList(options);
	}
}

Scenes.Krawitz.SneakingIn = function() {
	var parse = {
		name : function() { return party.Get(1).name; }
	};
	
	Text.Clear();
	if(party.Num() == 2) {
		Text.Add("Figuring that one person can move around easier than two, you ask [name] to wait for you outside the estate.", parse);
		Text.NL();
	}
	else if(party.Num() > 2) {
		Text.Add("Figuring that one person can move around easier than a group, you ask your companions to wait for you outside the estate.", parse);
		Text.NL();
	}
	
	Text.Add("You take a breath to prepare yourself. Confirming once again that the guard isn’t looking, you quietly approach the metal fence. This shouldn’t be much of a problem.", parse);
	Text.NL();
	
	Scenes.Krawitz.SetupStats();
	
	// Skillcheck
	if(player.Dex() + Math.random() * 20 > 30) {
		Text.Add("You scale the fence, taking care to avoid the sharp spikes crowning each steel rod, and vault over into the grounds. You quickly hide behind some bushes, and glance around.", parse);
		Text.NL();
		Text.Add("So far so good - seems like no one noticed your entry.", parse);
	}
	else {
		Text.Add("The way up is no problem, but as you vault over the fence, something catches on one of the sharp tips crowning the metal rods. Cursing under your breath, you wobble slightly before completely losing your balance and crashing down into a bush in the garden with a loud noise.", parse);
		Text.NL();
		Text.Add("You quickly scamper off, finding yourself a place to hide before the guard arrives. He takes his sweet time searching, but you manage to avoid him without much trouble.", parse);
		Text.NL();
		Scenes.Krawitz.GuardLost(Gender.male);
		
		Scenes.Krawitz.AddSuspicion(30, true);
	}
	
	Text.Flush();
	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 10});
	});
}

Scenes.Krawitz.GuardLost = function(gender) {
	var parse = {
		HeShe  : gender == Gender.male ? "He" : "She",
		heshe  : gender == Gender.male ? "he" : "she",
		hisher : gender == Gender.male ? "his" : "her"
	}
	
	var texts = [
	"<i>“Huh, must have been nothing,”</i> the guard mutters, returning to [hisher] post.",
	"<i>“I could have sworn I heard something,”</i> the guard mutters, looking around.",
	"<i>“Probably just a rat,”</i> the guard shrugs.",
	"<i>“I must be imagining things,”</i> the guard mutters, shaking [hisher] head."
	];
	var text = texts[Math.floor(Math.random() * texts.length)];
	
	return Text.Add(text, parse);
}

Scenes.Krawitz.GuardConvinced = function(gender) {
	var parse = {
		HeShe  : gender == Gender.male ? "He" : "She",
		heshe  : gender == Gender.male ? "he" : "she",
		hisher : gender == Gender.male ? "his" : "her"
	}
	
	var texts = [
	"<i>“Huh, new faces every day,”</i> the guard mutters.",
	"<i>“They all look the same,”</i> the guard mutters under [hisher] breath as [heshe] wanders off.",
	"<i>“Thought I had met all of the servants...”</i> the guard mutters."
	];
	var text = texts[Math.floor(Math.random() * texts.length)];
	
	return Text.Add(text, parse);
}

Scenes.Krawitz.ServantLost = function(gender) {
	var parse = {
		HeShe   : gender == Gender.male ? "He" : "She",
		heshe   : gender == Gender.male ? "he" : "she",
		hisher  : gender == Gender.male ? "his" : "her",
		servant : gender == Gender.male ? "servant" : "maid"
	}
	
	var texts = [
	"<i>“Probably nothing,”</i> the [servant] shrugs, continuing on [hisher] errands.",
	"<i>“Hate working late at night, I start seeing things,”</i> the [servant] mutters.",
	"<i>“I’ll... just move along then,”</i> the [servant] shuffles away, looking about nervously.",
	"The [servant] peers into the shadows, but doesn’t seem to spot you."
	];
	var text = texts[Math.floor(Math.random() * texts.length)];
	
	return Text.Add(text, parse);
}

Scenes.Krawitz.ServantConvinced = function(gender) {
	var parse = {
		HeShe   : gender == Gender.male ? "He" : "She",
		heshe   : gender == Gender.male ? "he" : "she",
		hisher  : gender == Gender.male ? "his" : "her",
		servant : gender == Gender.male ? "servant" : "maid",
		guygirl : player.mfFem("guy", "girl")
	}
	
	var texts = [
	"<i>“Oh yeah, I remember you now!”</i> the [servant] exclaims, <i>“Silly me, go on.”</i>",
	"<i>“Ah, you are the new [guygirl],”</i> the [servant] says, nodding. <i>“Sorry I didn’t recognize you.”</i>.",
	"<i>“Hm.”</i> The [servant] looks at you suspiciously, but lets you get on your way."
	];
	var text = texts[Math.floor(Math.random() * texts.length)];
	
	return Text.Add(text, parse);
}


Scenes.Krawitz.FoundOut = function(entity, num, gender) {
	var parse = {
		entity : entity == Scenes.Krawitz.EncType.Guard ? "the guard" : "the servant",
		spiked : Scenes.Krawitz.stat.LustPotion && Scenes.Krawitz.stat.HasWine ? "spiked " : ""
	};
	parse = Text.ParserPlural(parse, num > 1);
	gender = gender || Math.random() > 0.5 ? Gender.male : Gender.female;
	
	if(num > 1) {
		parse["HeShe"]  = "They";
		parse["heshe"]  = "they";
		parse["hisher"] = "their";
	}
	else if(gender == Gender.male) {
		parse["HeShe"]  = "He";
		parse["heshe"]  = "he";
		parse["hisher"] = "his";
	}
	else {
		parse["HeShe"]  = "She";
		parse["heshe"]  = "she";
		parse["hisher"] = "her";
	}
	
	//[Run][Hide][Charm][Attack!][Wine]
	var options = new Array();
	options.push({ nameStr : "Run",
		func : function() {
			Text.Clear();
			Text.Add("You leg it, somehow managing to hide from [entity][s].", parse);
			Text.Flush();
			
			Scenes.Krawitz.AddSuspicion(Scenes.Krawitz.EntitySuspicion(entity) * 3);
		}, enabled : true,
		tooltip : Text.Parse("Avoid [entity][s], potentially raising the alarm.", parse)
	});
	options.push({ nameStr : "Hide",
		func : function() {
			Text.Clear();
			Text.Add("Quickly, you fade into the shadows, avoiding detection.", parse);
			Text.NL();
			
			if(entity == Scenes.Krawitz.EncType.Guard)
				Scenes.Krawitz.GuardLost(gender);
			else
				Scenes.Krawitz.ServantLost(gender);
			Text.Flush();
			
			Scenes.Krawitz.AddSuspicion(Scenes.Krawitz.EntitySuspicion(entity));
		}, enabled : player.Dex() >= Scenes.Krawitz.GuardDex(entity, num),
		tooltip : Text.Parse("Use your cunning to hide from [entity][s].", parse)
	});
	options.push({ nameStr : "Charm",
		func : function() {
			Text.Clear();
			Text.Add("With your charm and wit, you try to convince [entity][s] that you are one of the staff.", parse);
			Text.NL();
			
			if(entity == Scenes.Krawitz.EncType.Guard)
				Scenes.Krawitz.GuardConvinced(gender);
			else
				Scenes.Krawitz.ServantConvinced(gender);
			Text.Flush();
			
			Scenes.Krawitz.AddSuspicion(Scenes.Krawitz.EntitySuspicion(entity));
		}, enabled : true,
		tooltip : Text.Parse("Use your guile to convince [entity][s] you belong there.", parse)
	});
	options.push({ nameStr : "Attack!",
		func : function() {
			Text.Clear();
			var s = 1;
			if(Math.random() > 0.5) {
				Text.Add("With some stealth and a few precise strikes, you manage to incapacitate [entity][s] without raising an alarm.", parse);
			}
			else {
				Text.Add("There is a slight scuffle, but you manage to knock out [entity][s].", parse);
				s = 4;
			}
			
			Text.NL();
			Text.Add("You quickly hide the unconscious bod[yIes] before anyone has a chance to find you.", parse);
			
			Text.Flush();
			
			Scenes.Krawitz.AddSuspicion(s);
		}, enabled : (player.Str() + player.Dex() + player.Sta()) >= Scenes.Krawitz.GuardAtk(entity, num),
		tooltip : Text.Parse("Incapacitate [entity][s].", parse)
	});
	if(Scenes.Krawitz.stat.HasWine) {
		options.push({ nameStr : Scenes.Krawitz.stat.LustPotion && Scenes.Krawitz.stat.HasWine ? "Spiked Wine" : "Wine",
			func : function() {
				var s = Scenes.Krawitz.EntitySuspicion(entity);
				Text.Clear();
				Text.Add("Brushing aside any questions, you offer a cup of spiked wine to [entity][s]. [HeShe] seem a little surprised, but accept gladly. With the the friendlier mood, you manage to slip away while [heshe] enjoy[notS] [hisher] drink[s].", parse);
				if(Scenes.Krawitz.stat.LustPotion && Scenes.Krawitz.stat.HasWine) {
					Text.NL();
					Text.Add("<i>“Ooh! That one went right to the groin,”</i>[oneof] the [entity][s] chuckles, the potent drugged wine quickly taking effect.", parse);
					s = 0;
				}
				Text.Flush();
				
				Scenes.Krawitz.AddSuspicion(s);
			}, enabled : true,
			tooltip : Text.Parse("Offer [entity][s] some [spiked]wine.", parse)
		});
	}
	
	Gui.SetButtonsFromList(options);
}

// TODO: Trigger found out
Scenes.Krawitz.AddSuspicion = function(num, surpressNext) {
	Scenes.Krawitz.stat.Suspicion += num;
	
	if(Scenes.Krawitz.stat.Suspicion > 100) Scenes.Krawitz.stat.Suspicion = 100;
	if(Scenes.Krawitz.stat.Suspicion < 0) Scenes.Krawitz.stat.Suspicion = 0;
	
	if(GetDEBUG()) {
		Text.NL();
		Text.Add("<b>Suspicion + " + num + ": " + Scenes.Krawitz.stat.Suspicion + "/100</b>");
		Text.NL();
		Text.Flush();
	}
	
	if(Scenes.Krawitz.stat.Suspicion >= 100) {
		Scenes.Krawitz.stat.AlarmRaised = true;
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("As you move along, you hear confused shouting, and the shuffling of boots running rapidly in your direction. Seems like your actions have finally caught up to you, and from the sounds of it, you have managed to rouse the entire mansion. And you were just causing some peaceful mayhem, how rude.");
			Text.NL();
			Text.Add("You throw one last look of regret toward the mansion grounds as you vault over the fence and onto the street. There is no way you could avoid detection in the pandemonium inside. Before long, the City Watch will probably arrive as well, so you’d best leave the area while you still can.");
			Text.Flush();

			Scenes.Krawitz.stat.AlarmRaised = true;
			Gui.NextPrompt(Scenes.Krawitz.Aftermath);
		});
	}
	
	if(!surpressNext)
		Gui.NextPrompt();
}


Scenes.Krawitz.PatrollingGuards = function() {
	var parse = {
		
	};
	
	var gender = Math.random() > 0.5 ? Gender.male : Gender.female;
	
	if(gender == Gender.male) {
		parse["HeShe"]  = "He";
		parse["heshe"]  = "he";
		parse["hisher"] = "his";
		parse["himher"] = "him";
	}
	else {
		parse["HeShe"]  = "She";
		parse["heshe"]  = "she";
		parse["hisher"] = "her";
		parse["himher"] = "her";
	}
	
	Text.Clear();
	Text.Add("You spot a pair of guards treading along a pathway, patrolling the garden in front of the mansion. As they walk past you, you catch part of their discussion.", parse);
	Text.NL();
	
	var scenes = [];
	
	// Long
	scenes.push(function() {
		//this.Krawitz["Duel"] = 0; // 0 = no, 1 = superwin, 2 = win, 3 = loss
		if(rigard.Krawitz["Duel"] == 3) { //loss
			Text.Add("<i>“I heard some moron tried to challenge Krawitz to a duel,”</i> one of the guards tells [hisher] buddy.", parse);
			Text.NL();
			Text.Add("<i>“Ouch, can’t imagine that ended well,”</i> the other guard winces. <i>“No one died this time though, right?”</i>", parse);
			Text.NL();
			Text.Add("<i>“They got their ass handed to them, but managed to keep their skin at least. Krawitz seems to be in a good mood since then - I think he’s working on something in his study right now.”</i>", parse);
		}
		else if(rigard.Krawitz["Duel"] == 1 || rigard.Krawitz["Duel"] == 2) { //win
			Text.Add("<i>“Hah! Did you hear about what happened when Krawitz visited the plaza earlier?”</i> one of the guards retells the story of Krawitz’ drubbing at your hands, which has become much more dramatic than what you recall.", parse);
			Text.NL();
			Text.Add("<i>“Really? Wish I could’ve been there,”</i> the other guard chortles. <i>“That ass deserves to be knocked down a peg or two.”</i> He looks about nervously. <i>“Sure it’s alright to talk about it though?”</i>", parse);
			Text.NL();
			Text.Add("<i>“Who’s gonna care?”</i> The guard shrugs dismissively. <i>“He’s been holed up in his study on the second floor ever since, biting his nails about the whole thing.”</i>", parse);
		}
		else { //didn't duel
			Text.Add("<i>“One of the servants got chewed out by Krawitz down by the plaza,”</i> one of the guards tells [hisher] buddy. <i>“He was sent to buy something, but apparently they just sold out. Master was furious with him.”</i>", parse);
			Text.NL();
			Text.Add("<i>“What was it that he wanted anyways?”</i> the other guard asks.", parse);
			Text.NL();
			Text.Add("<i>“I dunno, perhaps some expensive wine - he keeps quite the collection. One of the maids told me that she brings at least three cups a night to him in his study.”</i>", parse);
		}
	});
	// Long
	scenes.push(function() {
		Text.Add("<i>“Hear that?”</i> The two pause, listening to the peals of laughter coming from the bathhouse. <i>“Wouldn’t mind joining them,”</i> one of the guards says, grinning lecherously.", parse);
		Text.NL();
		Text.Add("<i>“You’ll be thrown out on your ass the moment Krawitz hears of you peeping on his wife and daughter,”</i> the other one warns [himher].", parse);
		Text.NL();
		Text.Add("<i>“Almost worth it. The new wife is a looker, and the young lady is a fair flower, just waiting to be plucked,”</i> the guard looks longingly toward the stone pillars, [hisher] view blocked by some offending bushes. More giggling and splashing ensue. <i>“Damn old lecher,”</i> one of them mutter. <i>“I heard the new wife is actually a friend of his daughter, almost the same age too.”</i>", parse);
	});
	// Long
	scenes.push(function() {
		Text.Add("<i>“What’s the deal with that sword Krawitz totes around anyways?”</i> one of the guards asks the other. <i>“I know he isn’t exactly the wealthiest noble around, but he treats it like it’s some priceless treasure.”</i>", parse);
		Text.NL();
		Text.Add("<i>“It is, you dolt,”</i> the other guard replies, <i>“I hear that blade has been in the family for generations. Probably the single most valuable thing in his possession, save this estate.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Then why does that moron carry it with him everywhere he goes? Someone’s gonna steal it from him one of these days.”</i>", parse);
	});
	// Long
	scenes.push(function() {
		Text.Add("<i>“Bah, sure could use some grub right now,”</i> one of the guards grumbles.", parse);
		Text.NL();
		Text.Add("<i>“We still got another hour left on this shift; you can stuff your fat gut after that,”</i> [hisher] partner taunts.", parse);
		Text.NL();
		Text.Add("<i>“Come on, one can dream, right?”</i> the first complains. <i>“Krawitz may be a massive cheapskate when it comes to hiring, but that cook is amazing. Have you tried his cherry pies? Delicious.”</i>", parse);
		Text.NL();
		Text.Add("<i>“And how would you know? Only the servants are allowed in the kitchens, and I doubt he’d feed something like that to you.”</i>", parse);
	});
	
	var sceneId = Scenes.Krawitz.stat.guardRot;
	if(sceneId >= scenes.length) sceneId = 0;
	
	Scenes.Krawitz.stat.guardRot = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();

	Text.NL();
	
	var rand = Math.random();
	if(rand < 0.2) {
		Text.Add("The guards pass by you, apparently not noticing you.", parse);
		
		Text.Flush();
		Gui.NextPrompt();
	}
	else if(Scenes.Krawitz.stat.HasServantClothes && rand < 0.5) {
		Text.Add("The guards pass by you, apparently assuming you are one of the regular servants.", parse);
		
		Text.Flush();
		Gui.NextPrompt();
	}
	else {
		Text.Add("<i>“Hey, who goes there!”</i> one of the guards calls in your direction, noticing someone hiding in the bushes.", parse);
		
		Text.Flush();
		Scenes.Krawitz.FoundOut(Scenes.Krawitz.EncType.Guard, 2, gender);
	}
}

//Overhear servants (grounds/servants/mansion)
Scenes.Krawitz.WanderingServants = function() {
	var parse = {
		
	};
	var gender = Math.random() > 0.5 ? Gender.male : Gender.female;
	
	if(gender == Gender.male) {
		parse["HeShe"]  = "He";
		parse["heshe"]  = "he";
		parse["hisher"] = "his";
		parse["himher"] = "him";
	}
	else {
		parse["HeShe"]  = "She";
		parse["heshe"]  = "she";
		parse["hisher"] = "her";
		parse["himher"] = "her";
	}
	
	Text.Clear();
	Text.Add("A small group of servants pass your hiding spot, carrying an assortment of wares. They banter and gossip like a bunch of old wives.", parse);
	Text.NL();
	
	var scenes = [];
	
	// Long
	scenes.push(function() {
		Text.Add("<i>“Hey, the master’s been holed up in his study for a really long time now... what’s he doing up there?”</i> one of the maids asks her companions.", parse);
		Text.NL();
		Text.Add("<i>“Probably working the numbers,”</i> one of the servants replies, <i>“Krawitz doesn’t have as much money as he used to. I hear he is trying to get into trading, and it isn’t really paying off.”</i>", parse);
		Text.NL();
		Text.Add("<i>“What, really? I thought he was really, really rich!”</i>", parse);
		Text.NL();
		Text.Add("<i>“Look, why do you think he pays us so little? What little he still has goes to satisfying the whims of his little princess and his trophy wife.”</i>", parse);
		Text.NL();
		Text.Add("The group is nearing your hiding spot.", parse);
	});
	// Long
	scenes.push(function() {
		Text.Add("<i>“So, like I said, I was fetching some beddings from the storeroom,”</i> one of the servants narrates. <i>“There was this chest, way in the back, and it was slightly open, see?”</i>", parse);
		Text.NL();
		parse["s2hisher"] = Math.random() > 0.5 ? "his" : "her";
		Text.Add("<i>“You are going to get hurt if someone catches you doing that,”</i> another one of the servants warns [himher], <i>“Lord Krawitz doesn’t appreciate people snooping around. ‘Specially not people like us.”</i> The servant sweeps [s2hisher] bushy tail back and forth to emphasize [s2hisher] point.", parse);
		Text.NL();
		Text.Add("<i>“Never mind that - don’t you want to know what I found?”</i> the adventurous servant continues, lowering [hisher] voice. <i>“I looked inside it, and there were all these vials of strange liquids in there.”</i>", parse);
		Text.NL();
		Text.Add("<i>“So you found a perfume stash,”</i> one of the servants dismisses [himher].", parse);
		Text.NL();
		Text.Add("<i>“No! It really was something weird; there were strange markings on it and all. Looked mysterious!”</i> [heshe] exclaims.", parse);
		Text.NL();
		Text.Add("<i>“Can you even read?”</i> one of the others mutters.", parse);
		Text.NL();
		Text.Add("<i>“The next time I went there, the chest was moved. I think it’s somewhere in the back, hidden behind the drapes.”</i>", parse);
		Text.NL();
		Text.Add("Hmm. Maybe it could be worth checking out.", parse);
		
		Scenes.Krawitz.stat.ChestLocKnown = true;
	});
	// Long
	scenes.push(function() {
		Text.Add("<i>“How much can those damn women drink?”</i> one of the maids exclaims. She waves two empty flagons at her companions. <i>“Third time I have to fetch more tonight! Not to mention...”</i> she looks around, lowering her voice.", parse);
		Text.NL();
		Text.Add("<i>“Just now, I swear I caught the young lady copping a feel! On her own mother!”</i>", parse);
		Text.NL();
		Text.Add("<i>“Stepmother,”</i> one of the others points out. <i>“She’s the daughter of the old wife, you know. Still, doesn’t surprise me.”</i>", parse);
		Text.NL();
		Text.Add("The maid looks at her companion in shock.", parse);
		Text.NL();
		Text.Add("<i>“The way I hear it, those two knew each other before she married into the family. Might even be the young lady was the one who introduced the new wife to her father.”</i>", parse);
		Text.NL();
		Text.Add("The maid huffs a bit, shaking her head disapprovingly. <i>“Still not right, that.”</i>", parse);
	});
	// Long
	scenes.push(function() {
		Text.Add("<i>“So, you got something going with Ibben, that sullen looking brute of a guard?”</i> one of the servants quips. It seems to hit home as one of the maids starts blushing furiously, blabbering as she tries to change the subject.", parse);
		Text.NL();
		Text.Add("<i>“No use denying it, girl, I overheard the two of you ‘talking’ behind the shed the other day. It sounded pretty serious.”</i> The servant purses [hisher] lips, pretending to think carefully about the matter. <i>“What did he say now... ‘I’ll plow your fertile fields and plant my seed’. I didn’t know you were planning to start a farm!”</i>", parse);
		Text.NL();
		Text.Add("<i>“N-not true! Stop that!”</i> the girl squeaks in panic.", parse);
		Text.NL();
		Text.Add("<i>“As I recall, you answered ‘fuck my horny cunt with your throbbing dick’. More straightforward, though not quite as poetic,”</i> the servant teases, changing the pitch of [hisher] voice to match the girl’s.", parse);
		Text.NL();
		Text.Add("<i>“I... I don’t know none of that flowery stuff!”</i> The poor girl squirms. She looks at the others, a little worried. <i>“Do you think he would like that?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Your blunt approach seems to be working, don’t worry about it,”</i> the third servant consoles her. They continue chatting as they walk past you.", parse);
	});
	
	var sceneId = Scenes.Krawitz.stat.servantRot;
	if(sceneId >= scenes.length) sceneId = 0;
	
	Scenes.Krawitz.stat.servantRot = sceneId + 1;
	
	// Play scene
	scenes[sceneId]();
	
	Text.NL();
	
	var rand = Math.random();
	if(rand < 0.4) {
		Text.Add("They are so engrossed in their conversation, they pass by your hiding spot without noticing you.", parse);
		
		Text.Flush();
		Gui.NextPrompt();
	}
	else if((Scenes.Krawitz.stat.IsServant && rand < 0.8) || (Scenes.Krawitz.stat.HasServantClothes && rand < 0.3)) {
		Text.Add("<i>“Hey there, want to come help us out?”</i> one of them asks, noticing your servant livery. You decline, explaining you have some other duties to tend to.", parse);
		
		Text.Flush();
		
		Scenes.Krawitz.AddSuspicion(Scenes.Krawitz.ServantSuspicion());
	}
	else {
		Text.Add("<i>“Is there someone there?”</i> one of the maids peers into the shadows nervously.", parse);
		
		Text.Flush();
		Scenes.Krawitz.FoundOut(Scenes.Krawitz.EncType.Servant, Math.random() < 0.5 ? 3 : 4, gender);
	}
}

Scenes.Krawitz.StealingClothes = function() {
	var parse = {
		
	};
	Text.Clear();
	Text.Add("You carefully sneak up to the door leading into what you assume is the servants’ quarters, a plain low building in the back of the garden hidden behind rows of bushes. There seems to be some activity inside. You hear unintelligible snatches of dialogue, and someone apparently snoring extremely loudly.", parse);
	Text.NL();
	Text.Add("Nudging the door open a crack, you spot a storeroom close to the entrance. Perhaps you could find something useful inside, but you run the risk of being found out.", parse);
	Text.Flush();
	
	//[Scavenge][Leave]
	var options = new Array();
	options.push({ nameStr : "Scavenge",
		func : function() {
			Text.Clear();
			Text.Add("You slip inside the building, quickly entering the storeroom.", parse);
			Text.NL();
			if(player.Dex() + Math.random() * 20 > 30) {
				Text.Add("As it happens, no one seems to have noticed you. Not wishing to push your luck too far, you grab one of the blue servants’ garbs from a nearby bin, and make your exit.", parse);
			}
			else {
				Scenes.Krawitz.AddSuspicion(10, true);
				Text.Add("In your haste, you stumble and almost fall, causing a little noise.", parse);
				Text.NL();
				Text.Add("<i>“Who’s there?”</i> You hear a voice from inside the building. Cursing under your breath, you snatch a garment at random and race out of the building. A sleepy servant peers out of the doorway, blinking the sand from his bleary eyes.", parse);
				Text.NL();
				Scenes.Krawitz.ServantLost(Gender.male);
			}
			Text.NL();
			Text.Add("Once you have found a safe place to hide, you try on the clothes you snatched up. They aren’t the right size, but you manage to make them fit. This should give you an easier time moving around; the regular staff could probably mistake you for one of them in the dark.", parse);
			Text.Flush();
			
			Scenes.Krawitz.stat.HasServantClothes = true;
			
			MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 10});
		}, enabled : true,
		tooltip : "Perhaps you could find some servants’ garb in the storeroom, to better blend in?"
	});
	options.push({ nameStr : "Leave",
		func : function() {
			Text.NL();
			Text.Add("You carefully withdraw from the servants’ quarters, judging it too difficult to sneak in unnoticed.", parse);
			Text.Flush();
			
			MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 10});
		}, enabled : true,
		tooltip : "There is too much risk of getting caught."
	});
	Gui.SetButtonsFromList(options);
}

Scenes.Krawitz.Bathhouse = function() {
	var parse = {
		cock2     	  : function() { return player.AllCocks()[1].Short(); },
		cockTip2      : function() { return player.AllCocks()[1].TipShort(); }
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, null, "2");
		
		
	var humanity = player.Humanity();
	
	parse["human"] = humanity < 0.9 ? ", a non-human" : "";
	
	parse["gen"] = player.FirstCock() ? function() { return player.MultiCockDesc(); } :
				player.FirstVag() ? function() { return player.FirstVag().Short(); } :
				"featureless crotch";
	
	party.location = world.loc.Rigard.Krawitz.bathhouse;
	
	Text.Clear();
	if(!Scenes.Krawitz.stat.BathhouseVisit) {
		Scenes.Krawitz.stat.BathhouseVisit = true;
		Text.Add("Lured in by the sounds of carousing, you sneak closer to the open air bathhouse, peeking through the pillars to the lit pool beyond. Two young women are having some sort of private party, involving a lot of tickling, groping and giggling, not to mention copious amounts of wine. The water is clear, and you see that both of the submerged beauties are completely nude. Licking your lips, you draw closer, wanting to get a closer look at the noble ladies.", parse);
		Text.NL();
		Text.Add("You are betrayed by the fickle winds, a sudden gust causing the hanging oil lamps to sway, stripping you of the cover of shadows. ", parse);
		if(Scenes.Krawitz.stat.HasServantClothes) {
			Text.Add("<i>“Don’t tarry about in the shadows,”</i> the older of the women calls out. Her voice carries authority, even if it’s slightly slurred in her drunken state. Though she looks very young, you would guess this woman is Lord Krawitz’ wife, which would make the other one his daughter. The two seems to be almost of an age.", parse);
			Text.NL();
			Text.Add("Slightly nervous at getting caught, you step forward, trying to maintain the appearance of a humble servant. The ladies, however, seem too far gone to care about your voyeurism, or their own compromising state.", parse);
			Text.NL();
			Text.Add("<i>“Servant, bring us wine!”</i> she cries out as she stands up, revealing herself in her full glory and drawing peals of laughter from her younger companion. <i>“Haven’t you had enough, ‘Lene?”</i> she murmurs, caressing the older woman's hip familiarly.", parse);
			Text.NL();
			Text.Add("<i>“Nonsense, Ginny!”</i> the woman called Lene - Helen? Marlene? - scoffs, swaying slightly, her breasts bouncing hypnotically. She definitely has had a few too many, and a misstep causes her to topple over her companion, causing loud splashes, gasps and peals of laughter as the two women disentangle themselves. To you, it seems the last part involves a lot of unnecessary groping from both parties. Apparently, they have a quite friendly relationship.", parse);
			Text.NL();
			Text.Add("<i>“Wine!”</i> they chorus, waving you away. You probably won’t get much more from them until you bring them something to drink. Shaking your head and blushing slightly, you leave them to their carousing.", parse);
			Text.Flush();
			
			player.AddLustFraction(0.2);
			
			Gui.NextPrompt(function () {
				MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 15});
				Scenes.Krawitz.AddSuspicion(3, true);
			});
		}
		else {
			Text.Add("The younger of the noblewomen looks at you blearily, whispering something to her companion. The older woman, presumably the lady of the house, gasps when she sees you there wearing street clothes.", parse);
			Text.NL();
			Text.Add("You dash away over the grounds as she cries out in alarm, calling guards to the bathhouse. Curse your thoughtlessness! You manage to scramble over the fence, stinging yourself on the sharp spikes along its top. Limping slightly, you scurry off into the dark, leaving the roused manor behind you.", parse);
			Text.NL();
			Text.Add("Drunk though they may have been, the ladies of the house have probably warned the guards to be on the lookout for you now. It's unlikely you'll have the opportunity to go back anytime soon.", parse);
			Text.Flush();
			
			Scenes.Krawitz.stat.AlarmRaised = true;
			Gui.NextPrompt(Scenes.Krawitz.Aftermath);
		}
	}
	else if(Scenes.Krawitz.stat.Orgy) {
		Text.Add("The big orgy is still going on. As much as you’d like to join in, the wiser move is to leave now and explore the mansion while you still have the chance.", parse);
		Text.Flush();
		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 10});
		});
	}
	else if(Scenes.Krawitz.stat.BathhouseSpiked) {
		Text.Add("The ladies are still recovering, reclining in the pool cuddling up next to each other, though the effects of the drug you gave them still have a firm hold.", parse);
		Text.Flush();
		if(Scenes.Krawitz.stat.ServantOrgySetup) {
			Text.Add(" They are about to receive all the company they can handle as you hear the sounds of the drunken servants closing in on the bathhouse. Things are about to become very interesting. You settle down, deciding to enjoy the show for a bit.", parse);
			Text.NL();
			
			Scenes.Krawitz.OrgyEntrypoint();
		}
		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 10});
		});
	}
	else if(Scenes.Krawitz.stat.BathhouseWine) {
		Text.Add("The ladies seems deeply engrossed in each other, cuddling in the big pool. You don’t think they’d appreciate the intrusion.", parse);
		Text.Flush();
		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 10});
		});
	}
	else {
		Text.Add("The ladies are cuddled close together in the big pool, and look a bit irritated as you return. Seems like you interrupted something.", parse);
		Text.Flush();
		
		//[Leave][Wine]
		var options = new Array();
		options.push({ nameStr : "Leave",
			func : function() {
				Text.Clear();
				Text.Add("You quickly retreat, catching Lady Krawitz’ command: <i>“Fetch that wine, pronto!”</i>", parse);
				Text.Flush();
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 10});
					Scenes.Krawitz.AddSuspicion(1, true);
				});
			}, enabled : true,
			tooltip : "Leave the two alone for now."
		});
		if(Scenes.Krawitz.stat.HasWine) {
			options.push({ nameStr : "Wine",
				func : function() {
					Text.Clear();
					Scenes.Krawitz.BathhouseWine();
					Text.NL();
					Text.Add("<i>“Why… you are right!”</i> Krawitz’ wife, apparently named Marlene, acknowledges you, shooing you away impatiently, her hand never leaving her companions nethers. As you hastily retreat, Gina cries out in pleasure loudly enough to wake the entire neighborhood.", parse);
					Text.NL();
					Text.Add("What a family.", parse);
					Text.Flush();
					
					player.AddLustFraction(0.2);
					Gui.NextPrompt(function() {
						MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 10});
						Scenes.Krawitz.AddSuspicion(1, true);
					});
				}, enabled : true,
				tooltip : "Serve them wine."
			});
		}
		if(Scenes.Krawitz.stat.HasWine && Scenes.Krawitz.stat.LustPotion) {
			options.push({ nameStr : "Spiked Wine",
				func : function() {
					Text.Clear();
					Scenes.Krawitz.BathhouseWine();
					Scenes.Krawitz.stat.BathhouseSpiked = true;
					Text.NL();
					Text.Add("<i>“Hah… yes, how… rude of me,”</i> Krawitz’ wife, apparently named Marlene, throws a lustful gaze in your direction. It seems that, even diluted, the aphrodisiac is very potent. <i>“Why don’t you come join us?”</i> She motions you over seductively, stifling Gina’s protests with a kiss full on the lips. Her hand returns to its previous task, rubbing the inebriated young woman between her legs.", parse);
					Text.Flush();
					
					player.AddLustFraction(0.3);
					
					var aftermath = function() {
						if(!Scenes.Krawitz.stat.ServantOrgySetup) {
							Text.Add("About half of the neighborhood ought to be alerted to the semi-incestous coitus happening in Krawitz’ front yard. Better leg it before you attract undue attention.", parse);
							Text.Flush();
							Gui.NextPrompt(function() {
								MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 20});
								Scenes.Krawitz.AddSuspicion(5, true);
							});
						}
						else {
							Text.Add("From the sound of it, it seems like the young noblewomen will get exactly what they crave as you hear a group of carousing servants heading toward the bathhouse. It sure took them a while to find their way across the yard… though this wine is potent stuff, perhaps they had to make a few stops on the way.", parse);
							Text.NL();
							
							Scenes.Krawitz.OrgyEntrypoint();
						}
					}
					
					//[Sex][Leave]
					var options = new Array();
					options.push({ nameStr : "Leave",
						func : function() {
							Text.Clear();
							Text.Add("You respectfully decline her offer. For a brief moment, Marlene looks disappointed, but she’s soon forgotten you were even there, focusing all of her attention on her companion, lavishing her body with kisses as a lusty haze clouds her mind.", parse);
							Text.NL();
							Text.Add("The two women are panting heavily, their bodies grinding against each other, dripping water and sweat. Gina has been pushed onto her back in the shallow end of the pool, legs spread invitingly as she lets the older woman take control, sighing languidly as fingers spread her netherlips, probing her depths.", parse);
							Text.NL();
							Text.Add("Although you were about to leave, you give in to temptation and settle down to watch the show. The ladies don’t seem to mind either way - if they even notice. Wife and daughter are sinking deeper and deeper into the drug-induced fog of rampant lust, Marlene’s lips closing around one of Gina’s puffy nipples. The young woman’s mouth hangs open in rapture as her stepmother thrusts several digits into her sex, making her legs tremble with pleasure.", parse);
							Text.NL();
							Text.Add("The younger woman cries out in ecstasy as she cums, her legs clenching tightly around Marlene’s arm. Impatient to get her own pleasure, ‘Lene climbs on top of Gina, grinding her labia on the limp girl’s face. With no hesitation, the raven-haired girl sticks out her tongue, burying it in her stepmother’s folds.", parse);
							Text.NL();
							Text.Add("<i>“Haaah… G-Ginny...”</i> A throaty moan seems to be all that Lady Krawitz can muster, her muddled mind no longer capable of forming rational thought. It isn’t long before the two of them collapse in each others arms, exhausted for the moment, but raring to have another go.", parse);
							Text.NL();
							player.AddLustFraction(0.5);
							
							aftermath();
						}, enabled : true,
						tooltip : "Decline her offer - you have to keep your cool if you are going to stay out of trouble tonight."
					});
					options.push({ nameStr : "Sex",
						func : function() {
							Text.Clear();
							Scenes.Krawitz.stat.SexedGirls = true;
							Text.Add("Marlene’s clouded gaze is firmly fixed on you as you saunter over to the two inebriated women, hastily removing your gear. She pulls you down into a lusty kiss, and as your lips lock, you taste a blend of her, Gina, and the alluring taste of the potent wine. This last hits you like a wall of hot air, making your heart skip a beat as it takes effect.", parse);
							Text.NL();
							Text.Add("At this point, neither of the Krawitz ladies seem to have a care in the world for who you are, whether you are a servant, a thief[human] or a noble. They both moan eagerly as you let your [hand]s trace their curves, grinding their bodies against each other urgently, pleading for you to join with them quickly. Not one to keep a lady waiting, you present them with your [gen], urging them to get to work.", parse);
							Text.NL();
							if(player.FirstCock()) {
								Text.Add("Marlene coos in delight as she comes face to face with your [cocks], eyes full of need as she basks in the heat emanating from your erect meatstick[s]. Her hands trembling slightly, she leans forward to cradle[oneof] [itThem], eyes fixed on the bead of pre forming on the [cockTip] as if hypnotized.", parse);
								Text.NL();
								parse["b"] = player.HasBalls() ? Text.Parse(" and joyfully fondling your [balls]", parse) : "";
								Text.Add("You sigh languidly as the beautiful woman wraps her mouth around your throbbing [cock], her hands busy working the shaft[b]. She looks like the happiest little slut in the world, eagerly trying to milk you of your seed, craving to have it pour down her throat. ", parse);
								if(player.NumCocks() > 1)
									Text.Add("Gina looks desperate to join in, and happily for her, you are well-equipped to handle the needy duo. The young woman eagerly grasps another of your [cocks], lathering the length in her saliva before greedily closing her lips around its [cockTip2].", parse);
								else
									Text.Add("Gina whines piteously at being left out, and Marlene grudgingly concedes, allowing her stepdaughter to offer worship to your [cock]. The two women take turns sucking you off, each throwing jealous looks at the other while waiting for her turn.", parse);
								Text.NL();
								
								player.Fuck(player.FirstCock(), 2);
								Sex.Blowjob(null, player);
							}
							if(player.FirstVag()) {
								Text.Add("Lady Krawitz gives your [vag] a long lick with her dainty tongue, sighing blissfully as she tastes you. She places her hands on your hips, holding you in place as if she’s afraid you might suddenly run away, unwilling to let as much as a drop of your juices escape her predatory lapping.", parse);
								Text.NL();
								if(player.FirstCock()) {
									Text.Add("With Marlene’s attention focused elsewhere, Gina is quick to monopolize your [cocks], using both her mouth and soft breasts to pleasure you.", parse);
								}
								else {
									parse["kn"] = player.SkinType() != Race.Human ? Text.Parse(", marveling at the unfamiliar feel of your [skin]", parse) : "";
									Text.Add("Gina crawls up behind you, pressing her nude, dripping figure against your bare back. Her stiff nipples grind against you insistently as her hands caress and explore your body[kn]. Slowly, she works her way down your form, falling to her knees as she kneads your [butt]. You gasp in surprise as you feel her fingers prying your cheeks apart, her tongue slipping inside your [anus], probing the sensitive passage.", parse);
								}
								Text.NL();
								
								player.Fuck(player.FirstCock(), 2);
								Sex.Cunnilingus(null, player);
							}
							Text.Add("You sigh contentedly as both of the Krawitz ladies work your nethers, hands and tongues exploring every nook and cranny of your aroused body. You lean down and pat their heads, commending them for being such good sluts, telling them how pleased Lord Krawitz would be if he saw them now.", parse);
							if(Scenes.Krawitz.stat.TFdKrawitz)
								Text.Add(" Idly, you wonder what the lord is up to, and if he’s enjoying his dinner.", parse);
							Text.Flush();
								
							Gui.NextPrompt(function() {
								var playerCock = player.FirstCock() || (player.strapOn ? player.strapOn.cock : Items.StrapOn.LargeStrapon.cock);
								parse = player.ParserTags(parse, "", playerCock);
								Text.Clear();
								
								player.Fuck(playerCock, 10);
								Sex.Vaginal(player, null);
								
								Text.Add("Well, time to move on to the main course. ", parse);
								if(player.FirstCock()) {
									Text.Add("The ladies have been kind enough to prepare your [cocks] for penetration, lathering your length[s] generously with their hungry tongues.", parse);
								}
								else {
									parse["cock"] = function() { return playerCock.Short(); };
									parse["cocks"] = parse["cock"];
									if(player.strapOn) {
										Text.Add("You’ve come well prepared, and the ladies give coos of delight as you equip your [cock], eyeing your artificial member with desire burning in their eyes.", parse);
									}
									else {
										Text.Add("Wordlessly, Gina leaves the pool, staggering slightly as she moves over to a nearby chest, her hands shaking as she opens it. She fetches something from its depths, swaying unsteadily as she returns to your side. The young noblewoman’s eyes are clouded with lust as she presents you with her treasure: a fairly large strap-on dildo.", parse);
										Text.NL();
										Text.Add("You grin and take her offering, praising her for being such a good, thoughtful girl as you secure the fastenings around your [hips]. You suspect this won’t be the first time this particular toy has been put to use.", parse);
									}
								}
								if(playerCock.Size() > 150)
									Text.Add(" You are a bit worried that you’ll hurt them with the sheer size of your equipment, but the horny women don’t seem to have a care in the world.", parse);
								Text.NL();
								parse["towering"] = (playerCock.Size() > 150) ? " towering" : "";
								Text.Add("Gina and Marlene pull you down on your back, rubbing their wet crotches against your stiff [cocks], each eager to be the first one taken. The younger of the two eventually wins out, her tongue lolling as she eases herself down on[oneof] your[towering] pillar[s].", parse);
								Text.NL();
								if(player.NumCocks() > 1) {
									player.Fuck(player.AllCocks()[1], 10);
									Sex.Vaginal(player, null);
								
									Text.Add("Krawitz’ wife doesn’t tarry in mounting[oneof2] your remaining cock[s2], hugging her stepdaughter tightly as she impales herself on your [cock2]. The two women moan in ecstasy as they bounce in time on top of you, their breasts mashing against each other as stepmother and stepdaughter lock lips.", parse);
									Text.NL();
									Text.Add("Before long, both of the cocks drilling into the noblewomen are glistening with their sweet cuntjuices. Marlene and Gina are seemingly locked in a competition to see who can pleasure you most, their round buttocks jiggling delightfully as they bounce up and down on your stiff rods.", parse);
								}
								else {
									Text.Add("Krawitz’ wife throws her a jealous glare, letting out a moaning complaint at her stepdaughter’s greed. The raven-haired girl is oblivious to them, however, too busy enjoying your [cock] to take notice. Sweat drips from her trembling body as she rides your cock, pushing it into her depths.", parse);
									Text.NL();
									if(player.HasBalls()) {
										Text.Add("Marlene doesn’t let her defeat last long though as she bows down below the root of your [cock], worshipping your [balls] with her tongue while Gina bounces up and down on your slick length.", parse);
									}
									else {
										Text.Add("Marlene has to be sated waiting for her turn, glowering sullenly while her younger companion enjoys herself. With a spiteful grin on her lust-filled face, she slips in behind Gina and roughly pinches her nipples, drawing ragged moans from the girl.", parse);
									}
								}
								Text.NL();
								Text.Add("The air is thick with the smell of your copulation. Even if you haven’t ingested any of the aphrodisiac yourself, you can still feel its effects. It is almost possible to taste it in the air, as if the young noblewomen are secreting it from their pores, transformed into living, breathing incarnations of lust. You can no longer reach through to them, so far gone are the ladies, only capable of understanding simple commands from you. Left to their own devices, they merely rut against you mindlessly, desperate to relieve their insatiable desire.", parse);
								Text.NL();
								
								var cum = player.OrgasmCum();
								
								if(player.FirstCock()) {
									Text.Add("You grunt as the two women milk you of your seed, not letting your [cocks] rest for more than a second before bearing down on you again. ", parse);
									if(cum > 6)
										Text.Add("If the ladies are surprised at your unnatural output, they don’t show it - if anything, they seem delighted, moaning excitedly as you pump your plentiful sperm into their willing cunts. Excess semen drools from their overfilled orifices, dripping into the pool.", parse);
									else if(cum > 3)
										Text.Add("The Krawitz ladies moan as your throbbing member[s] unload[notS], pouring [itsTheir] contents into their eager cock-sheath[s].", parse);
									else
										Text.Add("Perhaps they simply didn’t notice it, with your meager cum output, or perhaps they are eager to drain all that they can out of you.", parse);
								}
								else {
									Text.Add("Despite them doing all the work, you feel yourself caught up in their almost continuous body-wracking orgasms. Due to the artificial nature of your [cocks], you won’t tire from cumming, but you are still having to mount an effort to keep up with the ladies’ boundless energy. Finally, it becomes too much for you, and your body shudders in throes of bliss.", parse);
								}
								Text.NL();
								Text.Add("Eventually, you manage to disentangle yourself from the two horny, young noblewomen, putting some distance between you. They are still breathing heavily, and they look a bit petulant as you retreat from them, finally coming to your senses. You were very close to forgetting your actual purpose here, but if nothing else, you’ll definitely leave this place with some nice memories.", parse);
								Text.NL();
								Text.Add("Gina and Marlene are still under the spell of the drugged wine, though. They seem to have already forgotten about you, eyes and lips locked as they grind against each other.", parse);
								Text.NL();
								
								aftermath();
							});
						}, enabled : true,
						tooltip : "Don’t mind if I do!"
					});
					Gui.SetButtonsFromList(options);
				}, enabled : true,
				tooltip : "Serve them the wine, but add some of the aphrodisiac you found."
			});
		}
		Gui.SetButtonsFromList(options);
	}
}

Scenes.Krawitz.BathhouseWine = function() {
	var parse = {
	};
	
	Scenes.Krawitz.stat.BathhouseWine = true;
	
	Text.Add("Krawitz’ wife coos in delight as you show her the wine you brought, hurrying quickly to the side of the basin, not even attempting to hide her nudity as she rises to meet you. The younger woman remains were she is, eyes drowsy with drink, following the movements of her companion’s jiggling ass attentively.", parse);
	Text.NL();
	Text.Add("You get a good look at the woman as she pours wine into two large cups, dripping water from her well-shaped body. She looks to be in her early twenties, with auburn hair cascading in pretty curls, framing her beautiful face. You feel a bit sorry for her, having to be holed up with someone like Krawitz. A political marriage, perhaps? She leans down as she hands a cup to her younger companion, curving her back and leaving nothing to your imagination.", parse);
	Text.NL();
	Text.Add("<i>“Marlene, you are indecent!”</i> the daughter exclaims, giggling. She takes a sip of the rich wine and sighs in pleasure. Slightly younger than the wife, she is also quite the beauty, with straight, raven hair reaching down her back. Both the women have soft C-cup breasts, crowned by pert nipples.", parse);
	Text.NL();
	Text.Add("<i>“Oh, I’ll show you indecent, Gina,”</i> the older woman purrs, downing a cup of wine in a single draft before pouring herself a new one. Swaying slightly, she glides into the water, curling up next to the black-haired girl. She put an arm around the younger woman, still carefully holding the wine cup in her hand, while her other arm dips beneath the waters, reaching between her companion’s legs.", parse);
	Text.NL();
	Text.Add("<i>“’L-Lene, we have… ah… company,”</i> Gina gasps, noting your presence.", parse);
}

Scenes.Krawitz.OrgyEntrypoint = function() {
	var parse = {
		
	};
	
	Scenes.Krawitz.stat.Orgy = true;
	
	Text.Add("Gina and Marlene whimper as they become aware of the encroaching servants, though they look expectant rather than frightened. Any inhibitions they might have had about being fucked by their entire staff - half of them morphs at that - disappeared about two glasses ago. You settle down, finding a good vantage point in the shadows. This should be fun to watch.", parse);
	Text.NL();
	Text.Add("Four particularly ballsy servants close in on the lady of the house, shrugging their way out of their clothes. Krawitz’ wife quickly gets presented with all the cock she can handle, and she eagerly dives into the task, using both hands and mouth. Gina, meanwhile, is looking wild-eyed at the two beasts heading her way. Even in her drugged state, the young girl still looks slightly worried as the two stable-boys uncover their large, sheathed members, but her lust quickly overcomes her fear. The allure of the two horsecocks is too great for her to resist, and she reaches for them, trembling slightly as her lips lock around one of them, savoring the taste.", parse);
	Text.NL();
	Text.Add("Things are progressing rather quickly as neither party has any interest in foreplay. Marlene lets out a muffled moan of contentment as each of her orifices gets crammed full of dick, her pussy, ass, and mouth filled to the brim by throbbing erections. The servants move like men possessed, rutting desperately as they race toward the brief respite that orgasm grants them. The young noblewomen are more than willing receptacles for their seed, squirming as white spooge floods their used holes.", parse);
	Text.NL();
	Text.Add("Gina is in ecstasy as she is impaled back-and-front by the twin equine rods, each at least twenty inches in length. Her stomach bulges dangerously from the strain, distending unnaturally from the massive insertions. She doesn’t seem to be in any pain, however, as her stretched passages wrap themselves around the horsecocks accomodatingly.", parse);
	Text.NL();
	Text.Add("As soon as one of the servants finishes inside or on one of the ladies, he is replaced by another of his peers. Soon, everyone has gotten a turn with both of the young noblewomen, spent seed dripping out of used holes, and trailing down heaving breasts.", parse);
	Text.NL();
	Text.Add("The participants of the orgy make no attempt to conceal the sounds of their copulation - by now, most of the neighborhood is probably alerted to just what is going on within the walls of the estate. In this town, word is likely to travel quickly too...", parse);
	Text.NL();
	Text.Add("There seems to be some sort of commotion going on in the main building, a lot of shouting and clamoring. You withdraw further into the shadows, debating whether this is a good time to make yourself scarce.", parse);
	Text.NL();
	if(Scenes.Krawitz.stat.TFdKrawitz) {
		Text.Add("<i>“D-dearest?! H-help me!”</i> The pitiful call for help comes from the lord of the mansion who hobbles onto the scene unsteadily, clutching his hands over his head. Krawitz stares bleary-eyed at the orgy before him, his brain unable to process this new information. His arms fall limply to his sides, revealing a pair of feline ears spouting from the balding man’s head. You can hardly keep from laughing as you see a tail swaying from the xenophobic lord’s behind.", parse);
		Text.NL();
		Text.Add("<i>“Marlene? Gina?!”</i> Krawitz falls to his knees, trying to understand what he’s seeing. One of his hands, significantly more furred than it previously was, paws ineffectually at his belt, searching for a sword that isn’t there. The lord looks like he has no idea what to do next, overwhelmed by the events of this night. He limply follows along as two lusty maids pull him toward the orgy, caressing his cat-like ears.", parse);
		Text.NL();
		Text.Add("Looks like most of the staff will be occupied for quite some time. This should be an excellent opportunity to explore the mansion further before you leave.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			MoveToLocation(world.loc.Rigard.Krawitz.grounds, {minute: 20});
			Scenes.Krawitz.AddSuspicion(5, true);
		});
	}
	else {
		Text.Add("<i>“W-what is going on here?!”</i> A ragged and enraged little man bursts onto the scene, sword in hand. Lord Krawitz’ eyes almost jump from their sockets as they take in the situation - his wife and daughter being gangbanged by his entire staff, and begging for more. The small, balding man lunges forward, launching a flurry of blows with his rapier. He scatters the servants left and right while shouting, <i>“Scum! Filth! Plebeians!”</i> Fortunately for the servants, in his rage, his aim is a bit off, and they all manage to retreat from the scene without major injuries.", parse);
		Text.NL();
		Text.Add("<i>“Off my estate - you are all fired! You will hang for this!”</i> the lord yowls, ranting and waving his sword in the air. At his feet, the ladies of his household lie panting, semen dripping from their well-used bodies. This seems like a good time to leave, so you take advantage of the confusion as the former staff scramble to escape the wrath of their master.", parse);
		Text.NL();
		Text.Add("You throw one last look of regret toward the mansion grounds as you vault over the fence and onto the street. There is no way you could avoid detection in the pandemonium inside. Before long, the City Watch will probably arrive as well, so you’d best leave the area while you still can.", parse);
		Text.Flush();
		
		Gui.NextPrompt(Scenes.Krawitz.Aftermath);
	}
}

Scenes.Krawitz.Aftermath = function() {
	var parse = {
		playername : player.name
	};
	
	Scenes.Krawitz.stat = Scenes.Krawitz.stat || {};
	party.location = world.loc.Rigard.Krawitz.street;
	
	var points = 0;
	if     (rigard.Krawitz["Duel"] == 1)    points += 2;
	else if(rigard.Krawitz["Duel"] == 2)    points += 1;
	if(Scenes.Krawitz.stat.HasSword)        points += 2;
	if(Scenes.Krawitz.stat.HasBinder)       points += 1;
	if(Scenes.Krawitz.stat.TFdKrawitz)      points += 2;
	if(Scenes.Krawitz.stat.BathhouseSpiked) points += 1;
	if(Scenes.Krawitz.stat.Orgy)            points += 2;
	
	if(rigard.Krawitz["Duel"] <= 0) rigard.Krawitz["Duel"] = 0;
	rigard.Krawitz["Q"] = Rigard.KrawitzQ.HeistDone;
	
	// Save flags
	rigard.Krawitz["F"] = 0;
	if(Scenes.Krawitz.stat.HasServantClothes) rigard.Krawitz["F"] |= Scenes.Krawitz.Flags.Clothes;
	if(Scenes.Krawitz.stat.HasBinder) rigard.Krawitz["F"] |= Scenes.Krawitz.Flags.Binder;
	if(Scenes.Krawitz.stat.HasSword) rigard.Krawitz["F"] |= Scenes.Krawitz.Flags.Sword;
	if(Scenes.Krawitz.stat.BathhouseSpiked) rigard.Krawitz["F"] |= Scenes.Krawitz.Flags.SpikedLadies;
	if(Scenes.Krawitz.stat.SexedGirls) rigard.Krawitz["F"] |= Scenes.Krawitz.Flags.Sex;
	if(Scenes.Krawitz.stat.ServantSpikedWine) rigard.Krawitz["F"] |= Scenes.Krawitz.Flags.SpikedServants;
	if(Scenes.Krawitz.stat.Orgy) rigard.Krawitz["F"] |= Scenes.Krawitz.Flags.Orgy;
	if(Scenes.Krawitz.stat.TFdKrawitz) rigard.Krawitz["F"] |= Scenes.Krawitz.Flags.TF;
	
	Text.Clear();
	Text.Add("<b>Final Score:</b><br>", parse);
	Text.Add("Suspicion raised: " + Scenes.Krawitz.stat.Suspicion + "/100<br>", parse);
	Text.Add("Mayhem spread: " + points + "/10<br>", parse);
	Text.Add("Alarm raised: " + (Scenes.Krawitz.stat.AlarmRaised ? "yes" : "no"), parse);
	Text.Flush();
	
	if(!Scenes.Krawitz.stat.AlarmRaised) points += 1;
	
	lei.relation.IncreaseStat(100, points*3);
	
	Gui.NextPrompt(function() {
		world.TimeStep({hour: 2});
		party.location = world.loc.Rigard.Inn.common;
		
		party.LoadActiveParty();
		
		Text.Clear();
		Text.Add("You make your way back to the inn, snaking through alleyways to shake any possible pursuers. As you’re about to step inside the Lady’s Blessing, you’re surprised to bump into the vixen waitress you normally see cleaning tables.", parse);
		Text.NL();
		parse["sir"] = player.mfFem("sir", "ma’am");
		Text.Add("<i>“Good evening, [sir],”</i> she greets you.", parse);
		Text.NL();
		Text.Add("You return the greeting absently, still somewhat preoccupied with the recent events. Not so much, however, that you fail to notice the bulging pack she's carrying. Well, 'carrying' is a bit of an overstatement; it looks so heavy that she doesn't even try to hold it in her arms or support it on her shoulder. Instead, she settles for dragging it awkwardly over the ground.", parse);
		Text.Flush();
		
		//[OfferHelp][IgnoreIt]
		var options = new Array();
		options.push({ nameStr : "Offer help",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Oh? Thank you for the offer, [sir], but I don’t wish to trouble you with my own affairs,”</i> she smiles.", parse);
				Text.Flush();
				
				terry.relation.IncreaseStat(100, 1);
				
				//[Insist][HoldDoor][Leave]
				var options = new Array();
				options.push({ nameStr : "Insist",
					func : function() {
						Text.Clear();
						parse["fem"] = player.mfFem("handsome", "beautiful");
						parse["gender"] = player.mfFem("man", "lady");
						Text.Add("<i>“Umm, if you insist, then I’d be very glad to have the aid of a such a [fem] [gender] such as yourself,”</i> she says, bowing out of respect.", parse);
						Text.NL();
						Text.Add("As she hands you the neck of the bag, you move it to hoist it up onto your own shoulders. ", parse);
						if(player.Str() > 35)
							Text.Add("Despite your own considerable strength, you are surprised at the sheer weight of the sack. Whatever could she be carrying around in it to make it so heavy? No wonder she was having such a problem with it.", parse);
						else
							Text.Add("You almost topple over at the sheer weight of it! Damn, this is heavy! What in the world does she have in this thing? It takes a few moments to re-adjust yourself, and you almost drop it in the process, but finally you have it safely balanced over your back and are confident you can move with it.", parse);
						Text.Flush();
						
						//[Ask] [Don'tAsk]
						var options = new Array();
						options.push({ nameStr : "Ask",
							func : function() {
								Text.Clear();
								Text.Add("<i>“Old tools and crafts from my recently deceased father,”</i> she explains, ears drooping in sadness. <i>“I’m just clearing out his things before I move back to my hometown,”</i> she adds.", parse);
								Text.Flush();
								
								//[Sympathize] [Continue]
								var options = new Array();
								options.push({ nameStr : "Sympathize",
									func : function() {
										Text.Clear();
										Text.Add("<i>“Thank you, I appreciate it [sir],”</i> she smiles a bit under her grimace.", parse);
										Text.NL();
										PrintDefaultOptions();
									}, enabled : true,
									tooltip : "Express your sympathies for her loss."
								});
								options.push({ nameStr : "Continue",
									func : function() {
										Text.Clear();
										PrintDefaultOptions();
									}, enabled : true,
									tooltip : "Time you both were getting inside the inn."
								});
								Gui.SetButtonsFromList(options, false, null);
								
								Gui.Callstack.push(function() {
									Text.Add("With the package taking up both hands, you ask her to mind the door, and step inside the inn as she holds it open for you.", parse);
									Text.NL();
									Text.Add("The first signs of morning have appeared before you step inside the Lady’s Blessing, which seems to be dormant at this time of day. Someone who never seems to be asleep, however, is Lei. He stares at the vixen with his sharp eyes as she makes her way inside, then immediately turn his gaze to you and motions for you to follow him upstairs.", parse);
									Text.NL();
									Text.Add("<i>“Thanks a lot for your help. I can take things from here.”</i> She glances at Lei, not wanting to keep you from your business. ", parse);
									Text.NL();
									Text.Add("You bid her farewell and trudge after him wordlessly, feeling the long night in your joints. Your eyebrows rise slightly as the two of you enter the landing to the fourth floor, and head toward the penthouse suite at the end of the hallway.", parse);
									
									terry.relation.IncreaseStat(100, 6);
									
									PrintDefaultOptions();
								});
							}, enabled : true,
							tooltip : "Your curiosity is piqued; you just have to know what she's carrying to make it so heavy."
						});
						options.push({ nameStr : "Don’t ask",
							func : function() {
								Text.Clear();
								Text.Add("With the package taking up both hands, you ask her to mind the door, and step inside the inn as she holds it open for you.", parse);
								Text.NL();
								Text.Add("The first signs of morning have appeared before you step inside the Lady’s Blessing, which seems to be dormant at this time of day. Someone who never seems to be asleep, however, is Lei. He stares at the vixen with his sharp eyes as she makes her way inside, then immediately turn his gaze to you and motions for you to follow him upstairs.", parse);
								Text.NL();
								Text.Add("You trudge after him wordlessly, feeling the long night in your joints. Your eyebrows rise slightly as the two of you enter the landing to the fourth floor, and head toward the penthouse suite at the end of the hallway.", parse);
								
								terry.relation.IncreaseStat(100, 4);
								
								PrintDefaultOptions();
							}, enabled : true,
							tooltip : "You don’t want to pry, so you resolve to remain silent."
						});
						Gui.SetButtonsFromList(options, false, null);
					}, enabled : true,
					tooltip : "You can't just let her brush you off that easily; she really does look like she needs help."
				});
				options.push({ nameStr : "Hold door",
					func : function() {
						Text.Clear();
						Text.Add("“Thank you very much, [sir],” she replies pleasantly, tail wagging as she drags the bag through the door.", parse);
						Text.NL();
						Text.Add("The first signs of morning have appeared before you step inside the Lady’s Blessing, which seems to be dormant at this time of day. Someone who never seems to be asleep, however, is Lei. He stares at the vixen with his sharp eyes as she makes her way inside, then immediately turn his gaze to you and motions for you to follow him upstairs.", parse);
						Text.NL();
						Text.Add("You trudge after him wordlessly, feeling the long night in your joints. Your eyebrows rise slightly as the two of you enter the landing to the fourth floor, and head toward the penthouse suite at the end of the hallway.", parse);
						
						terry.relation.IncreaseStat(100, 2);
						PrintDefaultOptions();
					}, enabled : true,
					tooltip : "Even if she doesn't want you to carry it for her, you could at least make it easier for her to get through with it."
				});
				options.push({ nameStr : "Leave",
					func : function() {
						Text.Clear();
						Text.Add("Accepting her wishes, you push on through the door and head inside the inn yourself.", parse);
						Text.NL();
						Text.Add("The first signs of morning have appeared before you step inside the Lady’s Blessing, which seems to be dormant at this time of day. Someone who never seems to be asleep, however, is Lei.", parse);
						Text.NL();
						Text.Add("His sharp eyes find you the moment you step inside, and he motions for you to follow him upstairs. You trudge after him wordlessly, feeling the long night in your joints. Your eyebrows rise slightly as the two of you enter the landing to the fourth floor, and head toward the penthouse suite at the end of the hallway.", parse);
						
						PrintDefaultOptions();
					}, enabled : true,
					tooltip : "Alright, if that's how she wants it. You may as well go on in ahead of her."
				});
				Gui.SetButtonsFromList(options, false, null);
				
			}, enabled : true,
			tooltip : "The poor thing's clearly struggling with that load of hers; why not ask if you can help her?"
		});
		options.push({ nameStr : "Ignore her",
			func : function() {
				Text.Clear();
				Text.Add("Not keen on being questioned about your nightly activities, you quickly excuse yourself and step into the inn. The first signs of morning have appeared before you step inside the Lady’s Blessing, which seems to be dormant at this time of day. Someone who never seems to be asleep, however, is Lei.", parse);
				Text.NL();
				Text.Add("His sharp eyes find you the moment you step inside, and he motions for you to follow him upstairs. You trudge after him wordlessly, feeling the long night in your joints. Your eyebrows rise slightly as the two of you enter the landing to the fourth floor, and head toward the penthouse suite at the end of the hallway.", parse);
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "What she does in her own time is none of your business. Bid farewell and get on with your <b>own</b> business."
		});
		Gui.SetButtonsFromList(options, false, null);
		
		Gui.Callstack.push(function() {
			party.location = world.loc.Rigard.Inn.penthouse;
				
			twins.flags["Met"] = Twins.Met.Access;
			
			Text.Add(" Renting this place must cost a fortune.", parse);
			Text.NL();
			parse["hotcold"] = world.time.season == Season.Winter ? "a cozy fire warming up the interior" : "though at the moment it isn’t lit";
			Text.Add("Even for the Lady’s Blessing, the interior of the room is lavish, well beyond the usual fare at the inn. There are several pieces of antique furniture that look to have been made in a florid old style, decorated with elaborate carved patterns. Richly embroidered carpets and hangings abundantly adorn the room, the crowning jewel being a large tapestry hanging on one wall. While it is very well made, the images depicted on it are decidedly vulgar, showing a series of couples involved in suggestive or outright sexual acts. The room has its own stone fireplace connected to the central chimney, [hotcold].", parse);
			Text.NL();
			Text.Add("Lei motions you inside, closing the door behind you and leaving you alone with the red-headed couple from before. You can spy the woman resting on the gigantic bed in the next room, while the man is lounging on a couch. He waves you over, eager to hear of your exploits. The woman puts on a robe and joins you on the couch, her hair in sleepy, scarlet tousles.", parse);
			Text.NL();
			parse["duel"] = rigard.Krawitz["Duel"] > 0 ? " met Krawitz for a duel, and then" : "";
			Text.Add("You recount the events of the night, describing how you[duel] got inside the Krawitz estate, and what you did there.", parse);
			Text.NL();
			if(rigard.Krawitz["Duel"] == 1) {
				Text.Add("<i>“No need to tell me - word has already spread across town,”</i> the young man replies as you tell him about your duel against Krawitz. <i>“I can hardly believe it - you wiped the floor with him! Even I have some trouble besting him!”</i> The two look at you admiringly.", parse);
				Text.NL();
			}
			else if(rigard.Krawitz["Duel"] == 2) {
				Text.Add("<i>“Hah, I can’t believe that you managed to best the old fool at his own game!”</i> The man laughs as you tell him about your duel against Krawitz. <i>“I didn’t know you were such a fighter!”</i>", parse);
				Text.NL();
			}
			else if(rigard.Krawitz["Duel"] == 3) {
				Text.Add("The red-haired man shakes his head as you tell him of your fight against Krawitz. <i>“Taking him head-on might be a few years too soon for you,”</i> he grudgingly admits. <i>“Just be glad that you escaped relatively unscathed.”</i>", parse);
				Text.NL();
			}
			if(rigard.Krawitz["Work"] == 2)
				Text.Add("<i>“You entered into his service as a servant?”</i> the man chortles. <i>“So let me get this straight, on top of it all, he paid you from his own coffers? Brilliant!”</i>", parse);
			else
				Text.Add("<i>“Sneaking in like a thief in the night, how exciting!”</i> the woman exclaims. <i>“Wait for the rest of it, pet,”</i> the man tells her, though there is a spark in his eyes.", parse);
			Text.NL();
			if(Scenes.Krawitz.stat.HasBinder) {
				Text.Add("You hand over the binder you found in Krawitz’ study. The man leafs through it idly as you speak, his eyes growing wider and wider. He whistles as he finds something particularly interesting.", parse);
				Text.NL();
				Text.Add("<i>“Do you know what this is? We always suspected the old fart was low on money, but this tells quite an interesting tale… According to his own book, the Krawitz estate is just about bankrupt.”</i> The red-haired man leans over to his companion showing a section to her. <i>“What is even more interesting is where he gets the money to fund his lifestyle. What kind of moron would put this stuff in ink… half of this stuff is borderline illegal.”</i>", parse);
				Text.NL();
				Text.Add("<i>“And a quarter quite a bit more than borderline!”</i> the woman adds.", parse);
				Text.NL();
				Text.Add("He closes the binder, putting it on the table. <i>“Spreading the information in this book to the right people could make life for Lord Krawitz very… uncomfortable. His name will still protect him to a certain extent, mind you, but this is still going to strike a hard blow against him.”</i>", parse);
				Text.NL();
			}
			if(Scenes.Krawitz.stat.HasSword) {
				Text.Add("Grinning, you pull out Lord Krawitz’ blade and present it to the pair. <i>“How in… oh, this is going to sting him something fierce!”</i> the man chuckles, admiring the sword. <i>“One almost feels a bit bad for him… This sword is just about the most valuable thing in his possession, an heirloom that has been in his family for generations. Until now, that is.”</i> He hands it back to you. <i>“You’ve earned it. Make good use of it - it is a fine blade.”</i>", parse);
				Text.NL();
				Text.Flush();
				party.inventory.AddItem(Items.Weapons.KrawitzSword);
			}
			if(Scenes.Krawitz.stat.TFdKrawitz) {
				Text.Add("You tell them how you slipped something extra into the lord’s food. <i>“Oh, that is too rich!”</i> the man laughs out loud, slapping his knees in mirth. <i>“I look forward to seeing that bastard trying to show up in court with animal ears and a tail on him. That ought to lend less credence to his damn xenophobic politics!”</i>", parse);
				Text.NL();
				Text.Add("...Court? Just who are these two?", parse);
				Text.NL();
			}
			if(Scenes.Krawitz.stat.BathhouseSpiked) {
				Text.Add("<i>“You didn’t!”</i> the woman exclaims when you tell them of your escapades with the Krawitz ladies. <i>“I mean, they are kinda known for being sluts, but really?”</i> Her eyes widen when you tell her about the aphrodisiac, and where you found it.", parse);
				Text.NL();
				Text.Add("<i>“Now, why would he have something like that?”</i> the man muses thoughtfully.", parse);
				Text.NL();
			}
			if(Scenes.Krawitz.stat.Orgy) {
				Text.Add("You’re not done yet though, and you continue to explain what happened after the drugged servants arrived at the scene. The pair are blushing fiercely by the end of it, looking slightly apprehensive. <i>“I, uh, I hope they are alright,”</i> the woman looks a bit worried.", parse);
				Text.NL();
			}
			if(!Scenes.Krawitz.stat.AlarmRaised)
				Text.Add("You finish by explaining how you slipped out without alerting anyone of your presence - a ghost in the night. The pair compliment you on your craftiness.", parse);
			else
				Text.Add("You finish by telling of your daring escape from the mansion, dodging pursuing guards through the streets of Rigard. This gains you a whooping round of applause.", parse);
			Text.Flush();
			
			
			Gui.NextPrompt(function() {
				Text.Clear();
				if(points <= 1)
					Text.Add("<i>“Though I expected more, you’ve still shown your dedication,”</i> the man grudgingly admits. <i>“If nothing else, you <b>did</b> risk yourself by sneaking into the mansion. I guess that we can see that as proof of your loyalty, at least.”</i>", parse);
				else if(points <= 5)
					Text.Add("<i>“This isn’t a night the old man Krawitz is likely to forget soon,”</i> the man chuckles. <i>“You’ve done us a great service, [playername], and earned our trust.”</i> The woman nods her agreement.", parse);
				else if(points <= 9)
					Text.Add("<i>“This will be one for the bards, [playername],”</i> the man chortles, <i>“I’d be surprised if the old fart dares show his face after your actions tonight. He’ll be the laughingstock of Rigard!”</i> He shakes your hand heartily, very pleased with your efforts.", parse);
				else {
					Text.Add("After you have finished, the pair sits in stunned silence, gawking at your story. At last, the man clears his throat.", parse);
					Text.NL();
					Text.Add("<i>“Remind me to never get on your bad side, [playername],”</i> the man breathes, amazed. <i>“To have accomplished all this in a single night… you’ve all but ruined Krawitz reputation. Truly, you went above and beyond. You have earned our trust.”</i> The woman nods in agreement, looking at you slightly apprehensively.", parse);
				}
				Text.NL();
				if(points > 0) {
					Text.Add("<i>“As a bonus for your service,”</i> the man motions to a purse on the table in front of him.", parse);
					Text.NL();
					twins.rumi.relation.IncreaseStat(100, points * 2);
					twins.rani.relation.IncreaseStat(100, points * 3);
					var coin = 100 * points;
					party.coin += coin;
					Text.Add("<b>You earned [coin] coins!</b>", {coin: coin});
					if(points >= 6) {
						Text.NL();
						Text.Add("<i>“I think an additional reward is in order,”</i> the woman declares, pulling out an elaborate silver necklace with a rose at its center.", parse);
						Text.NL();
						Text.Add("<b>Received woman’s favor!</b>", parse);
						Text.NL();
						party.inventory.AddItem(Items.Accessories.RaniFavor);
					}
					if(points >= 10) {
						Text.Add("<i>“Why, I’d say you’ve made quite the impression on my companion,”</i> the man grins. <i>“If you are looking for more ‘favors’, I’m sure she wouldn’t mind providing them.”</i> The woman blushes deeply at this, but nods nervously.", parse);
						
						twins.flags["SexOpen"] = 1;
						
						var options = new Array();
						
						//[Sure][Nah]
						if(player.FirstCock()) {
							Text.NL();
							Text.Add("She is eyeing the bulge at your crotch with a slightly hungry look in her eyes.", parse);
							options.push({ nameStr : "Blowjob",
								func : function() {
									Text.Clear();
									Text.Add("<i>“While that would be really amusing, I think we should get the introductions out of the way first,”</i> the man interjects, grinning as he ruffles his blushing companion’s hair.", parse);
									Text.Flush();
									Gui.NextPrompt(Scenes.Krawitz.TwinsTalk);
								}, enabled : true,
								tooltip : "Have the woman give you a blowjob as a reward."
							});
						}
						if(player.FirstVag()) {
							options.push({ nameStr : "Cunnilingus",
								func : function() {
									Text.Clear();
									Text.Add("<i>“You don’t bandy words, do you,”</i> the man laughs merrily, his voice light and melodical. <i>“How about we get the introductions out of the way first?”</i>", parse);
									Text.Flush();
									Gui.NextPrompt(Scenes.Krawitz.TwinsTalk);
								}, enabled : true,
								tooltip : "Have the woman eat you out as a reward."
							});
						}
						options.push({ nameStr : "Not now",
							func : function() {
								Text.Clear();
								Text.Add("<i>“Well, the offer is standing.”</i> Both of them look slightly disappointed when you turn them down.", parse);
								Text.Flush();
								Gui.NextPrompt(Scenes.Krawitz.TwinsTalk);
							}, enabled : true,
							tooltip : "Not right now."
						});
						Text.Flush();
						Gui.SetButtonsFromList(options);
					}
					else {
						Text.Flush();
						Gui.NextPrompt(Scenes.Krawitz.TwinsTalk);
					}
				}
				else {
					Text.Flush();
					Gui.NextPrompt(Scenes.Krawitz.TwinsTalk);
				}
			});
		});
	});
}

Scenes.Krawitz.TwinsTalk = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>“Now that business is out of the way, let's drop the subterfuge.”</i> The man rises to his feet, stretching as he undoes his pony-tail, letting out his long hair. As he speaks, his voice changes, becoming lighter, more feminine.", parse);
	Text.NL();
	Text.Add("<i>“Lei already told us your name, [playername]. I am Rumi, daughter of King Rewyn, heir to the throne of Rigard. And this here, is my twin brother, Rani.”</i> She gestures to the blushing woman - man - sitting beside her. Rumi grins at your surprise. <i>“Had you fooled, did we? My brother and I were always so similar, and we quite enjoy masquerading as each other...”</i>", parse);
	Text.NL();
	Text.Add("This pair is the prince and princess of Rigard? They do match the descriptions you’ve heard while walking the streets of the city, but why would they be here?", parse);
	Text.Flush();
	
	Scenes.Krawitz.TwinsTalkRoyals   = false;
	Scenes.Krawitz.TwinsTalkKrawitz  = false;
	Scenes.Krawitz.TwinsTalkDisguise = false;
	Scenes.Krawitz.TwinsTalkLei      = false;
	
	Scenes.Krawitz.TwinsPrompt();
}

Scenes.Krawitz.TwinsPrompt = function() {
	var parse = {
		
	};

	//[Royals][Krawitz][Disguise][Lei]
	var options = new Array();
	if(!Scenes.Krawitz.TwinsTalkRoyals) {
		options.push({ nameStr : "Royals",
			func : function() {
				Text.Clear();
				Text.Add("<i>“You say our city, but it really isn’t, not yet anyways.”</i> Rumi pouts a bit. <i>“Father can be very overprotective at times. We just want to see our kingdom with our own eyes, experience new things, that sort of thing.”</i> She seems a bit vague on what those things might be, exactly.", parse);
				Text.NL();
				Text.Add("<i>“Neither of us agree with the policies our father has set in place discriminating against morphs and closing the city to outsiders,”</i> Rani continues. <i>“Father would never let us out into the city, however, so that is why it is as you see.”</i>", parse);
				Text.NL();
				Text.Add("How come they can stay here though? Won’t they be missed?", parse);
				Text.NL();
				Text.Add("<i>“We make our occasional appearance at court, but we are usually sequestered with our teachers. Well, that is what father believes, anyways. It’s amazing how a small bribe can sweeten someone's tongue to say whatever you want,”</i> Rumi smiles, pleased at their clever scheme. <i>“There is only so much you can learn by reading books, stuck in some dusty tower with a withered old man. Besides, none of the stuff they give us is challenging!”</i>", parse);
				Text.NL();
				Text.Add("The princess walks over to a window, looking out into the streets of Rigard. <i>“This place can teach us so much more,”</i> she says, almost under her breath.", parse);
				Text.Flush();
				Scenes.Krawitz.TwinsTalkRoyals = true;
				Scenes.Krawitz.TwinsPrompt();
			}, enabled : true,
			tooltip : "What in the world are the royal prince and princess doing hiding in disguise in their own city?"
		});
	}
	if(!Scenes.Krawitz.TwinsTalkKrawitz) {
		options.push({ nameStr : "Krawitz",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Oh, don’t get us wrong, we don’t <b>hate</b> him, per se,”</i> the princess assures you. <i>“He is our fencing instructor at court, though we can both best him at this point. He is a xenophobic old fart who is way too full of himself. We wanted to teach him a lesson, sort of.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Your services are much appreciated,”</i> Rani chimes in, showing a fierce edge behind his usually meek demeanor.", parse);
				Text.Flush();
				Scenes.Krawitz.TwinsTalkKrawitz = true;
				Scenes.Krawitz.TwinsPrompt();
			}, enabled : true,
			tooltip : "What is their gripe with Krawitz?"
		});
	}
	if(!Scenes.Krawitz.TwinsTalkDisguise) {
		options.push({ nameStr : "Disguise",
			func : function() {
				Text.Clear();
				Text.Add("<i>“It should seem rather obvious we’d want to keep our presence here in the city low-key,”</i> the princess looks a bit confused until she understands what it is that you are asking. <i>“Ah, you mean why do I dress and act as a man while Rani poses as a woman?”</i>", parse);
				Text.NL();
				Text.Add("Rumi leans over and caresses her brother’s cheek. <i>“Don’t you think he is prettier this way?”</i> The young prince shies away from her touch, throwing uncertain looks in your direction. The red-haired woman laughs, a pleasant sound, though there is more than a hint of mischief there.", parse);
				Text.NL();
				Text.Add("<i>“It’s not something we always do, but switching things around now and then can be fun.”</i> The princess throws a naughty smirk at her brother, who blushes slightly, lowering his eyes. You’ll probably have to get to know the pair better before they‘ll tell you more.", parse);
				Text.Flush();
				Scenes.Krawitz.TwinsTalkDisguise = true;
				Scenes.Krawitz.TwinsPrompt();
			}, enabled : true,
			tooltip : "Why are they dressed the way they are?"
		});
	}
	if(!Scenes.Krawitz.TwinsTalkLei) {
		options.push({ nameStr : "Lei",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Lei is the best at his job, though unfortunately a bit too dedicated to it for our tastes.”</i> Rumi replies to your question. <i>“Mother figured out that we were sneaking into the city, and hired a bodyguard for us rather than telling father.”</i> She smiles wickedly. <i>“Mother’s plan might have backfired a bit though. Though Lei is known for completing his missions to the letter, a bit of persuasion and some cash convinced him to take on some additional duties when he isn’t busy protecting us.”</i>", parse);
				Text.NL();
				Text.Add("She doesn’t seem to want to tell you more about what those duties are, exactly. Perhaps you could ask Lei about it later.", parse);
				Text.Flush();
				Scenes.Krawitz.TwinsTalkLei = true;
				Scenes.Krawitz.TwinsPrompt();
			}, enabled : true,
			tooltip : "Ask about their taciturn bodyguard."
		});
	}
	if(options.length > 0)
		Gui.SetButtonsFromList(options);
	else
		Gui.NextPrompt(Scenes.Krawitz.TwinsMoreTalk);
		
}

Scenes.Krawitz.TwinsMoreTalk = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>“If you don’t have any more questions, how about getting down to business? We have an offer for you.”</i> Rumi gestures toward the closed door. <i>“Lei is certainly an able bodyguard, protecting us always, whether we want it or not.”</i> There is a slightly guilty silence from the door.", parse);
	Text.NL();
	Text.Add("<i>“There are certain services that he cannot provide for us, however. One of the terms in his contract with our mother strictly forbids us to leave the city. For this, we want to hire you. Be our agent outside the city, and we will reward you richly.”</i>", parse);
	Text.NL();
	Text.Add("You ask them what kind of work you’d be doing, and why they want to put this trust in you.", parse);
	Text.NL();
	Text.Add("<i>“Lei likes you, and he has an eye for the strong,”</i> Rani pipes in. Likes you? The silent swordsman has a peculiar way of showing it, if so. <i>“You’ve shown your mettle by taking on Krawitz for us - this is enough to start. We are sure you won’t disappoint us in the future.”</i>", parse);
	Text.NL();
	Text.Add("<i>“As to what you would be asked to do… nothing bad, certainly. You’d pass messages along, bring us certain objects or people… stuff like that. We can talk about the details later.”</i> The princess waves off any further inquiries.", parse);
	Text.NL();
	Text.Add("<i>“As a show of our appreciation, we will grant you a favor. Word on the street is that you tried to get past the Royal Guard and inside the inner walls. We can get you in there.”</i> Rumi hands you a sealed envelope. <i>“This should get you past the guards, though it won’t let you enter the castle unless you have a direct invitation.”</i>", parse);
	Text.NL();
	Text.Add("<b>Received royal pass.</b>", parse);
	
	rigard.flags["RoyalAccess"] = 1;
	
	Text.NL();
	Text.Add("<i>“Now, if you don’t mind, we have a celebration to attend to, don’t we, brother?”</i> The princess nudges her twin playfully, though there is a naughty look in her eyes. <i>“Leave us for now, [playername]. Talk to Lei if our offer is of interest to you.”</i>", parse);
	Text.NL();
	if(twins.flags["SexOpen"] == 1) {
		Text.Add("<i>“Ah, and you would consider our… other offer too, yes?”</i> Rani blushes, and his sister giggles at him.", parse);
		Text.NL();
	}
	Text.Add("You excuse yourself, meeting Lei at the door. <i>“You may have earned their trust, but know that I am watching you,”</i> he says gruffly, before leading you back down the stairs.", parse);
	Text.Flush();

	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.Rigard.Inn.common, {hour: 2});
	});
}

Scenes.Krawitz.Duel = function() {
	SetGameState(GameState.Event);
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("As you’re walking through the plaza, the voice of a man shouting in anger catches your attention. It is shrill and nasal at once, oozing arrogance and presumption. Feeling morbidly curious, you cross the street to get a closer look at what’s going on.", parse);
	Text.NL();
	Text.Add("You see a richly dressed, if deeply unstylish, nobleman yelling at a morph servant who was apparently accompanying him. You can’t quite tell what exactly he has done to offend him as the noble roundly curses him for being a total incompetent and a disgusting beast.", parse);
	Text.NL();
	Text.Add("The noble is on the short side, and his stomach shows something of a paunch. He is visibly balding, his gray hair leaving a shiny spot at the top of his head. His velvet clothing looks like it was cut to fit him when he was a fitter man, but is still in good condition. Well, that is, unless its purple and orange coloration somehow developed with age. You fervently hope that the garish combination is just an eccentricity of the man, although it is conceivable that it may have simply gone out of style years ago. At his hip hangs a long, slender fencing blade, at odds with his portly stature.", parse);
	Text.NL();
	Text.Add("As you examine him, you realize that his appearance matches what you were told of Lord Krawitz. Luck seems to be on your side in finding the man. Perhaps you could use this opportunity to challenge him to a fencing match and humiliate him in front of the crowds passing by. You recall that you were told he was an excellent fencer, but given his appearance you can’t help but wonder if maybe the description was a little overblown...", parse);
	Text.NL();
	Text.Add("Besides, you were quite fortunate to stumble upon him out and about. You get the feeling that if you leave now, it won’t happen again.", parse);
	Text.Flush();
	
	//[Challenge][Leave]
	var options = new Array();
	options.push({ nameStr : "Challenge",
		func : function() {
			Text.Clear();
			Text.Add("You approach Krawitz, placing yourself between him and his servant. He pauses in his tantrum and glares at you. With a sardonic smile, you remark to the lord that he must be paying quite a bonus to his servants so they would let him yell at them. Otherwise, they’d probably just beat him up for being so obnoxious.", parse);
			Text.NL();
			var humanity = player.Humanity();
			parse["morph"] = humanity < 0.95 ? " filthy morph!" : "";
			Text.Add("<i>“Why... you...[morph]”</i> he sputters, his faces growing redder with rage. <i>“I will have you pay for this!”</i>", parse);
			Text.NL();
			Text.Add("You tell him that you’ll be glad to pay if he can make you. You’ll fight him here and now if he wants.", parse);
			Text.NL();
			parse["race"] = (player.Race() != Race.Human) ? player.Race().Short(player.Gender()) : player.mfFem("man", "woman");
			parse["himher"] = player.mfFem("him", "her");
			Text.Add("He visibly concentrates, regaining a modicum of composure. His brow is still covered in deep furrows, but he forces his breathing to grow steadier. <i>“Very well, I accept. Since you challenged me, I choose the method - fencing blades to first blood. Since you don’t have a suitable sword, I’ll have my servants fetch you one. Rufio, bring this... [race]... something, so none may say that I carved [himher] up unjustly.”</i>", parse);
			Text.NL();
			Text.Add("You wait awkwardly, half-turned away from Krawitz, for the servant to return. The man seems confident and has managed to regain his cool, and you can’t help but wonder if this was a good idea.", parse);
			Text.NL();
			Text.Add("Finally, the servant comes jogging back, carrying a plain fencing blade. It is unadorned, but seems sturdy enough. Hefting it, you find that it has a good balance.", parse);
			Text.NL();
			Text.Add("<i>“Well then, it’s time to end this charade. You’ve got your weapon, now prepare to lose with it.”</i> Krawitz sounds like he’s eagerly anticipating the fight.", parse);
			Text.NL();
			Text.Add("A space has cleared around the two of you with a densely packed crowd of onlookers marking its limits. You face each other, and Krawitz takes two steps away from you and you do the same. The two of you turn around and face each other, the tips of your foils just barely crossing. He assumes an en garde stance, one foot facing toward you, the other perpendicular, and you awkwardly mimic his posture, deciding he probably knows what he’s doing.", parse);
			Text.NL();
			var dex = Math.floor(player.Dex() + Math.random() * 20);
			if(GetDEBUG()) {
				Text.Add("<b>Dex([pcdex]) + rand(20) = [dex] (vs 80/60)</b>", {pcdex : player.Dex(), dex : dex});
				Text.NL();
			}
			Text.Add("The servant Krawitz called Rufio does a countdown for you before raising his arm to indicate the start of the fight. ", parse);
			
			if(dex > 80) {
				Text.Add("You bat Krawitz’ blade aside with a quick movement. Looking closely, it seems like he’s actually able to follow your motions - anticipate them, even - but you are so much faster than him that it makes little difference.", parse);
				Text.NL();
				Text.Add("You could have won easily in the first instants of the duel, but you are here to humiliate him. That calls for something more... To gasps of shock from the crowd, you dance circles around Krawitz, your blade a continuous blur in the air. Its tip never quite touches Krawitz’ flesh, but you tear his clothing into strips, leaving his pale body peaking through the gaps.", parse);
				Text.NL();
				Text.Add("Finally, when his dress is reduced to an unrecognizable rag, you decide to finish the ‘duel’. You knock his foil out from his hand with one motion, and draw a wide, jagged line of red across his cheek with the next. That should make the event a little more memorable for him.", parse);
				Text.NL();
				Text.Add("You make a small bow to the crowd and, handing the foil to Rufio, walk off. They seem to have no attention left for you, however, as they are busy jeering at Krawitz, whose clothes have come apart fully, leaving him quite exposed to the elements and their eyes.", parse);
				Text.NL();
				Text.Add("That should cover his humiliation nicely. Still, you wonder if perhaps you shouldn’t play with him a bit more...", parse);
				
				rigard.Krawitz["Duel"] = 1;
			}
			else if(dex > 60) {
				Text.Add("You quickly gauge the balance of the weapon, and exchange a few experimental clashes with Krawitz. You’re definitely faster than him, but he seems to read your movements as you’re starting to make them, and return the perfect answer every time.", parse);
				Text.NL();
				Text.Add("You put on quite a show for the crowd. Your sheer speed is met with precise technique as you hear gasps of amazement from around you. The people draw back and give you space as the fight turns to a contest of footwork as much as of swords.", parse);
				Text.NL();
				Text.Add("After a couple of minutes of trading blows, you can feel yourself tiring. You’re being forced to make extra movements to counter Krawitz’ elegant motions, and it’s a drain on your stamina, but you can also feel yourself improving. At the start, you were keeping up with him only by sheer speed, but you slowly gain an edge as your motions grow more precise, and your understanding of the strategy in this combat improves.", parse);
				Text.NL();
				Text.Add("Finally, after a series of exchanges drawing him to favor his right more and more, you attack the right again, only to pull back at the last moment and go for a straight lunge. He realizes your intention too late to correct his parry, and your blade connects, barely nicking him along the ribs.", parse);
				Text.NL();
				parse["scum"] = humanity < 0.95 ? "scum" : "nobody";
				Text.Add("Krawitz stares at you in bewilderment, his hand pressed to the thin trickle of blood from his side. <i>“A fluke... it was a fluke. There’s no way I’d lose to some [scum] like you!”</i> Gathering his anger like a cloak about him, he strides off, the silent crowd parting for him.", parse);
				Text.NL();
				Text.Add("You give a small bow, and the crowd breaks into rapturous applause. Handing the bloodied foil back to Rufio, you continue on your way.", parse);
				Text.NL();
				Text.Add("It wasn’t really a humiliating defeat as such for Krawitz, but that should help prune his pride a little. Still, perhaps you should do something more to really put him in his place...", parse);
				
				rigard.Krawitz["Duel"] = 2;
			}
			else if(dex > 40) {
				Text.Add("You warily weave the tip of your foil back and forth, testing Krawitz’ reactions, trying to keep your distance.", parse);
				Text.NL();
				Text.Add("You lack experience and try to feel out how the bout is likely to go before committing yourself to any irreversible move. Krawitz seems to sense your uncertainty, and when you take an instant to glance up at him, you see a malicious grin spread across his face.", parse);
				Text.NL();
				Text.Add("His blade darts around your guard to the left and comes at you from below. You barely manage to react in time, twisting your blade to deflect his, leaving only a tiny nick on your clothes.", parse);
				Text.NL();
				Text.Add("Krawitz, however, instantly recovers, seeming to start moving his foil away even before your blade makes contact. He takes a half step back as his blade snakes around yours and, before you can reverse your own foil to counter, he steps in, lunging at you. You desperately try to twist aside, but all you succeed in doing is minimizing the impact, as the point of his blade draws a long line of red across your ribs. Fortunately, it fails to pierce into your flesh, and the wound is relatively minor.", parse);
				rigard.Krawitz["Duel"] = 3;
				player.AddHPFraction(-0.08);
				if(player.curHp == 0) player.curHp = 1;
			}
			else {
				Text.Add("You are not quite sure how to handle the slender blade, and decide your best bet would be a gamble on a direct assault.", parse);
				Text.NL();
				Text.Add("You bat at Krawitz’ blade to shove it aside, and immediately lunge for him, trying to end this in the first blow. Unfortunately, Krawitz seems to read your intentions perfectly and starts moving even before you do. He shifts to the side, and takes half a step back, bringing his blade back to nudge yours past him.", parse);
				Text.NL();
				Text.Add("Your momentum carries you forward before you can stop your motion, and you find yourself frozen in a fully extended lunge, your side completely exposed to your opponent. Krawitz smiles cruelly as he extends his own arm, apparently aiming to push the blade cleanly through you. At the last moment, you barely manage to twist aside, so the blade only goes through muscle, avoiding internal organs.", parse);
				Text.NL();
				Text.Add("You groan in pain, but it seems like you’ll be mostly alright.", parse);
				rigard.Krawitz["Duel"] = 3;
				player.AddHPFraction(-0.25);
				if(player.curHp == 0) player.curHp = 1;
			}
			
			if(rigard.Krawitz["Duel"] == 3) {
				Text.NL();
				Text.Add("<i>“Was that all? I think you bored the crowd. You’ve never even handled a fencing blade before, have you?”</i> Krawitz turns his back on you disdainfully, and walks away. Rufio shrugs apologetically, looking down at you pitifully, before taking the plain foil from your hands and following his master.", parse);
				Text.NL();
				Text.Add("Well, that fell through quite badly, judging by the contemptuous looks you get from the rapidly dispersing crowd. You’ll have to come up with some other plan to get back at Krawitz.", parse);
			}
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Challenge Krawitz to a fencing duel."
	});
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			Text.Add("You decide challenging the man at the one thing he’s best at is not the smartest of plans, and walk away, leaving the servant to his mercy.", parse);
			Text.Flush();
			rigard.Krawitz["Duel"] = -1;
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Leave the servant to his own devices. Though you might not be able to find the lord by just walking around again..."
	});
	Gui.SetButtonsFromList(options);
}
