/*
 * Contains the "Blue roses" quest
 * 
 * Flags in outlaws
 * stats in outlaws.BT
 */
import { Event, Link, EncounterTable, MoveToLocation } from '../../event';
import { Outlaws } from './outlaws';
import { GetDEBUG } from '../../../app';
import { Stat } from '../../stat';
import { WorldTime } from '../../worldtime';
import { SetGameState, GameState } from '../../gamestate';
import { Gui } from '../../gui';
import { Text } from '../../text';
import { Encounter } from '../../combat';

let BullTowerScenes = {};

function BullTowerStats() {
	this.suspicion       = new Stat(0);
	this.suspicion.debug = function() { return "Suspicion"; };
	
	this.stoleLantern    = false;
	this.guardsDown      = false;
	this.towerGuardDown  = false;
	this.inspectedSafe   = false;
	this.unlockedSafe    = false;
	this.foughtCorishev  = false;
};
BullTowerStats.prototype.StoleSomething = function() {
	if(outlaws.flags["BT"] & Outlaws.BullTower.CaravansSearched) return true;
	if(outlaws.flags["BT"] & Outlaws.BullTower.SafeLooted)       return true;
	if(outlaws.flags["BT"] & Outlaws.BullTower.ContrabandStolen) return true;
	return false;
}
BullTowerStats.prototype.Suspicion = function() {
	return this.suspicion.Get();
}
BullTowerStats.MoveSuspicion = 4;
// outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
BullTowerStats.prototype.IncSuspicion = function(max, inc) {
	var parse = {
		
	};
	
	var oldSuspicion = this.Suspicion();
	this.suspicion.IncreaseStat(max, inc);
	var newSuspicion = this.Suspicion();
	
	if(newSuspicion >= 100 && oldSuspicion < 100) {
		Gui.Callstack.push(function() {
			if(outlaws.flags["BullTower"] >= Outlaws.BullTowerQuest.Completed) {
				PrintDefaultOptions();
				return;
			}
			Text.Clear();
			Text.Add("Sneaking through the fortress grounds, you suddenly hear a shout echoing across the old courtyard. Hoping that it’s just a fluke, you emerge to investigate, but the shout is quickly followed by the old bell in the tower being sounded, the steady bong-bong-bong of the striker hitting metal breaking the silence of night like a hammer against a window pane. Someone’s finally noticed what you’ve been up to, and the guards’ attention is turning inwards as they realize that the fortress has been infiltrated all this while.", parse);
			Text.NL();
			parse["two"] = outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed ? "three" : "two";
			Text.Add("No time to lose, then. Torches burst into life on the ramparts as the [two] of you break into a run across the courtyard, doing your best to avoid the scrambling guards.", parse);
			Text.NL();
			
			BullTowerScenes.EndingFailure();
		});
	}
	else if(newSuspicion >= 75 && oldSuspicion < 75) {
		Gui.Callstack.push(function() {
			if(outlaws.flags["BullTower"] >= Outlaws.BullTowerQuest.Completed) {
				PrintDefaultOptions();
				return;
			}
			Text.Clear();
			Text.Add("As you prowl through the shadows of the old fortress, you hear muttering and the distant trampling of boots from the King’s Road outside; it seems that the diversion has nearly run its course, and the game’ll be up once it has. You don’t have that much time left; if you have anything left to do, you’d best be about it - and quickly, too.", parse);
			Text.NL();
			PrintDefaultOptions(true);
		});
	}
	else if(newSuspicion >= 50 && oldSuspicion < 50) {
		Gui.Callstack.push(function() {
			if(outlaws.flags["BullTower"] >= Outlaws.BullTowerQuest.Completed) {
				PrintDefaultOptions();
				return;
			}
			Text.Clear();
			Text.Add("Even as you silently make your way through the old fortress, you sense that the entire compound is growing more and more restless, a collective consciousness, perhaps, becoming aware of your intrusion despite the diversion Zenith created for you. You should not linger any longer than is absolutely necessary to get the job done.", parse);
			Text.NL();
			PrintDefaultOptions(true);
		});
	}
	else if(newSuspicion >= 25 && oldSuspicion < 25) {
		Gui.Callstack.push(function() {
			if(outlaws.flags["BullTower"] >= Outlaws.BullTowerQuest.Completed) {
				PrintDefaultOptions();
				return;
			}
			Text.Clear();
			Text.Add("Moving through the grounds of the old fortress as silently as you can, you catch pieces and snatches of conversation from the front gate guard that Cveta “persuaded” to let the two of you through, carried to you by the wind. You’ve managed to remain undetected so far, but the longer you spend in here, the thinner your luck is going to stretch.", parse);
			Text.NL();
			PrintDefaultOptions(true);
		});
	}
}

// outlaws.BT.DecSuspicion(-100, 20);
BullTowerStats.prototype.DecSuspicion = function(min, dec) {
	this.suspicion.DecreaseStat(min, dec);
}

/*
 * 
 * Bull tower area
 * 
 */

// Create namespace
let BullTowerLoc = {
	Courtyard : 
	{
		Yard : new Event("Courtyard"),
		Pens : new Event("Animal pens"),
		Caravans : new Event("Caravans")
	},
	Building : {
		Hall       : new Event("Main hall"),
		Cell       : new Event("Secure cell"),
		Office     : new Event("Small office"),
		Warehouse  : new Event("Warehouse"),
		Watchtower : new Event("Watchtower")
	}
};

// Disable wait for all locations
BullTowerLoc.Courtyard.Yard.wait = function() { return false; };
BullTowerLoc.Courtyard.Pens.wait = function() { return false; };
BullTowerLoc.Courtyard.Caravans.wait = function() { return false; };
BullTowerLoc.Building.Hall.wait = function() { return false; };
BullTowerLoc.Building.Cell.wait = function() { return false; };
BullTowerLoc.Building.Office.wait = function() { return false; };
BullTowerLoc.Building.Warehouse.wait = function() { return false; };
BullTowerLoc.Building.Watchtower.wait = function() { return false; };

// Add onEntry, conversations to all locations (not Cell)
BullTowerLoc.Courtyard.Yard.onEntry = function() {
	if(Math.random() < 0.7) BullTowerScenes.Coversations(true);
	else PrintDefaultOptions();
}
BullTowerLoc.Courtyard.Pens.onEntry = function() {
	if(Math.random() < 0.7) BullTowerScenes.Coversations(true);
	else PrintDefaultOptions();
}
BullTowerLoc.Courtyard.Caravans.onEntry = function() {
	if(Math.random() < 0.7) BullTowerScenes.Coversations(true);
	else PrintDefaultOptions();
}
BullTowerLoc.Building.Hall.onEntry = function() {
	if(Math.random() < 0.7) BullTowerScenes.Coversations();
	else PrintDefaultOptions();
}
BullTowerLoc.Building.Office.onEntry = function() {
	if(Math.random() < 0.7) BullTowerScenes.Coversations();
	else PrintDefaultOptions();
}
BullTowerLoc.Building.Warehouse.onEntry = function() {
	if(Math.random() < 0.7) BullTowerScenes.Coversations();
	else PrintDefaultOptions();
}
BullTowerLoc.Building.Watchtower.onEntry = function() {
	if(Math.random() < 0.7) BullTowerScenes.Coversations();
	else PrintDefaultOptions();
}



BullTowerScenes.Initiation = function() {
	var parse = {
		playername: player.name
	};
	
	outlaws.flags["BullTower"] = Outlaws.BullTowerQuest.Initiated;
	
	Text.Clear();
	Text.Add("The outlaw camp is always calmest at dawn and at dusk - the camp may never sleep, but it does have lulls when one shift of workers - be they hunters, sentries or otherwise - replaces another. It’s at one of these shift rotations that you arrive in the camp, feeling momentarily calmed by the brief surfeit of activity before you’re grabbed by the shoulder from behind.", parse);
	Text.NL();
	Text.Add("<i>“[playername].”</i> Zenith’s familiar, deep voice comes from behind you. <i>“What a pleasant surprise to find that you’ve arrived in our camp. In fact, I was just thinking of you when one of the lookouts spotted you coming. Do you have a moment to talk?”</i>", parse);
	Text.NL();
	Text.Add("It seems rather impolite to decline the outlaw leader, so you nod.", parse);
	Text.NL();
	Text.Add("<i>“Everyone’s waiting,”</i> he rumbles. <i>“Let’s go.”</i>", parse);
	Text.NL();
	Text.Add("What Zenith means by ‘everyone’ soon becomes clear: you’re led to his tent, and a small group has gathered within, clustered around the map table, sitting on anything and everything that can serve as a seat. You recognize Maria, Cveta, and a few others, but most of those present aren’t known to you. It seems like a pretty lively conversation’s going on, too.", parse);
	Text.NL();
	Text.Add("<i>“Well, the twins are said to be better than their father on the issue…”</i>", parse);
	Text.NL();
	Text.Add("<i>“And it’ll take decades for Rewyn to die and be succeeded, assuming he doesn’t do us the favor of getting killed off. You really want to live in the woods that long on a rumor that the children are going to be more fair-minded than their father? Even if they started working on reversing his policies before his body’s cold, the damage will have been done.”</i>", parse);
	Text.NL();
	Text.Add("<i>“I’m not convinced…”</i>", parse);
	Text.NL();
	Text.Add("<i>“Few with power ever actually want to give it up. You think that once Rewyn’s given the lands of us exiled nobles to his favorites, the new owners are just going to hand them over because Rumi or Rani say so?”</i>", parse);
	Text.NL();
	Text.Add("Zenith clears his throat. <i>“Ladies. Gentlemen.”</i>", parse);
	Text.NL();
	Text.Add("As one, morphs and pure humans alike turn their heads to acknowledge the outlaw leader’s arrival.", parse);
	Text.NL();
	Text.Add("<i>“Maria. Aquilius. Friends,”</i> he continues, motioning for you to find a seat, which you do. <i>“Thank you for being here on such short notice this evening. I would have asked you to come earlier, but I only received news on the matter a few hours ago.”</i>", parse);
	Text.NL();
	Text.Add("<i>“As most of you know, the Royal Guard blames us for the disappearance of Alaric two days ago. Of course, we had no hand in it, but these accusations necessisated our involvement in order to clear our name. I set Maria to the task immediately, with a little fieldwork of my own, and our discoveries were interesting, to say the least.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Hey, I don’t know any Alaric,”</i> someone calls from the back.", parse);
	Text.NL();
	Text.Add("<i>“I do,”</i> a well-dressed cat-morph replies. <i>“Bean-counter in the King’s Treasury, supposedly discovered someone was pocketing coins on the sly, was going to make a fuss about it. Is what I heard some little birds whisper, in any case.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Yes, Lady Radigaz, you’re very well-informed,”</i> Zenith says coolly. <i>“But if we can avoid further interruptions? Maria?”</i>", parse);
	Text.Flush();
	
	world.TimeStep({ minute : 30 });
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("Rising from her seat, Maria glances about the tent before speaking. <i>“I gathered my team and went to take a look around the place where he supposedly disappeared, close to the King’s Road. To make a long story short, we did find some leads… which brought us straight to Bull Tower. It’s supposed to have been abandoned for decades, but the place is crawling with guards. They seem to be trying to keep a low profile, but there’s no hiding that many men.”</i>", parse);
		Text.NL();
		Text.Add("<i>“And did you manage to take a look at these guards? Were they mercenaries? Did they seem competent?”</i> asks one of the assembly.", parse);
		Text.NL();
		Text.Add("<i>“Calm down, I’m getting there.”</i> Maria clears her throat. <i>“At first we considered the possibility of them being mercenaries, but they seemed too well disciplined. So I had one of my men take a closer look, and he recognized lieutenant Corishev of the Royal Guard talking to one of the sentries at the wall.”</i>", parse);
		Text.NL();
		Text.Add("The Royal Guard? What are they doing so far away from the castle district, let alone Rigard? Zenith looks down at his assembled audience, and nods.", parse);
		Text.NL();
		Text.Add("<i>“For those of you less learned in law, Bull Tower, abandoned though it is, is still Crown land. When it was decommissioned, responsibility for its care passed to the Royal Guard, although it was not to be  be manned, so far as I know… the sudden influx of guards posed an interesting question which we bent our minds to.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Lieutenant Corishev? He’s one of Preston’s head flunkies, there’s no way he’d be there without his commander knowing.”</i>", parse);
		Text.NL();
		Text.Add("<i>“The Shining doesn’t want to step any farther than the good end of the Merchants’ Street lest he get a smidge of dust on that breastplate of his,”</i> someone pipes up from the back.", parse);
		Text.NL();
		Text.Add("<i>“Not true. Didn’t he lead that band of his into the warehouse district to catch-”</i>", parse);
		Text.NL();
		Text.Add("Zenith claps his hands once, and the discussion is immediately shushed. <i>“Please, let’s have some respect for those who are speaking.</i>", parse);
		Text.NL();
		Text.Add("<i>“Well, I won’t bore you. Long story short, Maria and I think our man is in there. We will free him, clear our name, and sully the King’s <b>and</b> the Royal Guard’s - the former’s for having embezzlers in his employ, and the latter’s for trying to cover it up and pin the blame on us.</i>", parse);
		Text.NL();
		Text.Add("<i>“Yes, I know Bull Tower was built to be impregnable. However, we’ve come up with an idea that might work. If we can pull it off, we move another step toward the moral high ground, my friends. Amongst other things. That is all I wish of you today, my friends - to keep you informed. You may leave now.”</i>", parse);
		Text.Flush();
		
		world.TimeStep({ minute : 10 });
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("As you stand and make to leave with the small crowd flowing out of Zenith’s tent, though, another hand falls on your shoulder - smaller and lighter this time, but no less firm.", parse);
			Text.NL();
			parse["handsomebeautiful"] = player.mfFem("handsome", "beautiful");
			Text.Add("<i>“Going somewhere, [handsomebeautiful]?”</i>", parse);
			Text.NL();
			Text.Add("You half-turn, and Maria is there, smiling with apparent sweetness - and you’re pretty sure she hasn’t suddenly become taken with you. <i>“Zenith would appreciate it if you stayed a little longer.”</i>", parse);
			Text.NL();
			Text.Add("Well, it makes sense. He wouldn’t go to all the trouble of seeking you out just to have you hear him speak, right? A faint sense of foreboding welling up in the pit of your stomach, you sit back down and wait for the tent to empty of everyone save you, Zenith, Maria, and oddly enough, Cveta, who’s been seated near the back all the while, unruffled as always.", parse);
			if(party.Num() > 1) {
				var p1 = party.Get(1);
				parse["comp"]  = party.Num() == 2 ? p1.name : "Your companions";
				parse["s"]     = party.Num() == 2 ? "s" : "";
				parse["has"]   = party.Num() == 2 ? "has" : "have";
				parse["heshe"] = party.Num() == 2 ? p1.heshe() : "they";
				
				Text.Add(" [comp] look[s] about, clearly wondering if [heshe] should be here, then come[s] to the conclusion that if you’ve been invited, then so [has] [heshe].", parse);
			}
			Text.NL();
			Text.Add("Apparently, this still isn’t enough privacy for the outlaw leader. Gesturing for you to follow, he leads you to a corner and speaks in a low whisper.", parse);
			Text.NL();
			parse["t"] = party.InParty(terry) ? "-”</i> he gestures at Terry with a nonchalant wave of his hand - <i>“" : "";
			parse["b"] = outlaws.TurnedInBinder() ? " That your coming across Krawitz’s binder was no accident - which is why I didn’t question you when you passed it along to us." : "";
			Text.Add("<i>“I know that you probably don’t want this to be public knowledge, which is why I called you over. [playername], I know that you were involved in the heist on Krawitz’s place, that the Masked Fox [t]wasn’t the only one present that night.[b]”</i>", parse);
			Text.NL();
			Text.Add("You swallow hard. Just how long has he known?", parse);
			Text.NL();
			Text.Add("<i>“In such a place as Rigard, nothing goes unnoticed, for there are always eyes and ears about. Beggars. Street urchins. Laborers. Those beneath notice. Many willingly tell us what they’ve seen and heard, while others need their tongues loosened with a hot meal.”</i>", parse);
			Text.NL();
			Text.Add("With a pat on your shoulder and a smile, he walks you back as if nothing had happened, speaking in normal tones once more. <i>“[playername], you have a skill that we are in need of - that of infiltration. Our dear songstress here is also in the same position, albeit with a different ability we can bring to bear. Maria and I have come up with a plan to get through Bull Tower’s defenses, and it will require the both of you.</i>", parse);
			Text.NL();
			Text.Add("<i>“Bull Tower was designed to be impregnable and would normally be impossible to enter by stealth, especially since Preston has put a good number of his lackeys on perimeter guard. We’ll create a diversion, draw as much attention as we can and throw them off edge so you can enter. Once inside, it should be far easier for you to move about and find our man.”</i>", parse);
			Text.NL();
			Text.Add("Surely it can’t be that simple. Maybe you should ask for the details later.", parse);
			Text.NL();
			Text.Add("<i>“What does he look like?”</i> Cveta asks, and you realize it’s the first time she’s spoken throughout this whole exchange.", parse);
			Text.NL();
			Text.Add("Zenith scratches his chin. <i>“Small. Thin. Balding. Maria will draw you a sketch before you leave; she will also provide precise directions to the tower. Are there any questions?”</i>", parse);
			Text.Flush();
			
			world.TimeStep({ minute : 20 });
			
			BullTowerScenes.InitiationQuestions();
		});
	});
}

BullTowerScenes.InitiationQuestions = function(opts) {
	opts = opts || {};
	
	var parse = {
		playername : player.name
	};
	
	
	//[Presence][Plan][Binder][Leave]
	var options = new Array();
	if(!opts.presence) {
		options.push({ nameStr : "Presence",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Some sort of smuggling is my guess,”</i> Maria pipes up. <i>“I’ve spotted some of the Royal Guard hanging around the old fort from time to time since the beginning of the year, almost always escorting folk transporting goods or lugging the stuff themselves. I managed to jump one of the caravan parties after they’d left the tower, made it look like your standard highway holdup. Most of what they were carrying were luxury goods from outside Rigard. Cheeses, wine, fine fabrics, smokes, other odds and ends. None of them illegal, but all of them highly taxed.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Guards do not search their own,”</i> Cveta states flatly. <i>“Especially those that outrank them.”</i>", parse);
				Text.NL();
				Text.Add("Zenith nods. <i>“Or those who claim to be under the protection of such. It does seem like an open-and-shut case of tax evasion. If Bull Tower is being used as a waystation, it would make sense for them to hold Alaric there until one of the smugglers turns up to take him away.”</i>", parse);
				Text.Flush();
				
				world.TimeStep({ minute : 5 });
				
				opts.presence = true;
				BullTowerScenes.InitiationQuestions(opts);
			}, enabled : true,
			tooltip : "Why is the Royal Guard out along the King’s Road, anyway?"
		});
	}
	if(!opts.plan) {
		options.push({ nameStr : "Plan",
			func : function() {
				Text.Clear();
				Text.Add("Zenith nods at your question. <i>“Our eyes and ears have informed us that there are a number of shipments slated to come in that night; we’ll divert the guards by attacking the last of the convoys along the King’s Road within sight of the tower. ", parse);
				if(party.Num() > 1) {
					parse["s"] = party.Num() == 2 ? "" : "s";
					Text.Add("Your companion[s] can join in if they like; we could use the help, especially if we’re to effect a good fighting retreat. ", parse);
				}
				Text.Add("The fact that it’s a diversion is something only Maria, I, and a few others know; everyone else will be informed it’s a raid - which it is as well.</i>", parse);
				Text.NL();
				Text.Add("<i>“Once they’re preoccupied with us, the two of you can waltz on in.”</i>", parse);
				Text.NL();
				Text.Add("You guess that means Cveta asks them nicely to let you pass.", parse);
				Text.NL();
				Text.Add("<i>“That’s correct. Since every pair of eyes still on the walls is going to be facing outwards toward us, things will be much easier for you. You’re not going to pass as a Royal Guard - I’m willing to wager everyone knows everyone - so don’t even try disguising yourself.</i>", parse);
				Text.NL();
				Text.Add("<i>“After you’re in, though, you’re on your own. No one has cared about the inside of Bull Tower for the last generation, and the Royal Guard has had time to make their own unofficial changes, if they’ve so desired. I’ve managed to acquire a copy of the floor plans, but they’re at least sixty years out of date.</i>", parse);
				Text.NL();
				Text.Add("<i>“What probably hasn’t changed, though, is that there’ll be a central yard and somewhere to stable animals. Everything else will be centered about the main watchtower. Cells below to hold troublemakers on the road - almost certainly where Alaric is being held, although you may have some searching to do. I’m afraid I can’t be of more help, [playername].”</i>", parse);
				Text.NL();
				Text.Add("You think a moment, and agree that from the way this fortress sounds, Zenith’s information is probably the best you’ll be getting. It’s not much, but it sounds like only the Royal Guard would have more.", parse);
				Text.Flush();
				
				world.TimeStep({ minute : 5 });
				
				opts.plan = true;
				BullTowerScenes.InitiationQuestions(opts);
			}, enabled : true,
			tooltip : "So, what’s the plan? In detail, that is."
		});
	}
	if(!opts.obj && opts.presence) {
		options.push({ nameStr : "Objectives",
			func : function() {
				Text.Clear();
				Text.Add("Zenith and Maria look at each other for a moment, then the former shrugs and smiles. <i>“By all means, [playername]. Opportunities to screw Preston over are hard to come by, so feel free to be creative. Although I must remind you to focus on your primary goal and to take no unnecessary risks. Alaric comes first; everything else is secondary.</i>", parse);
				Text.NL();
				Text.Add("<i>“Concrete evidence of what the Royal Guard is up to within those walls - evidence that we can hang out in the street for all to see - now that would be a nice catch, if you can find any. Bring down Preston a peg or two.”</i>", parse);
				if(outlaws.TurnedInBinder()) {
					Text.NL();
					Text.Add("Zenith grunts, then looks thoughtful as he turns to you. <i>“Well, [playername], there is one more thing I need to mention. When we caught wind of this, I thought it would be prudent to give that binder of Krawitz’s - the one you so thoughtfully obtained for us - a detailed look-through. As it turns out, the contents of one of the inbound shipments written off as lost matched the wagons that Maria and her team took that night, down to the wine’s vintage. It’s circumstantial evidence, but it’s a lead as to why the Royal Guard is aiding and abetting smugglers.</i>", parse);
					Text.NL();
					Text.Add("<i>“I’m certain there’s more evidence to be found in Bull Tower itself, and with the numbers involved, as well as the fact that one only works with smugglers with payment on delivery… well, there’s likely to be some coin on hand in there, too.</i>", parse);
					Text.NL();
					Text.Add("<i>“Not that it tells us <b>where</b> it is, more’s the pity, but it’s better than stumbling around in the dark.”</i>", parse);
					Text.NL();
					Text.Add("Evidence, payoff. All right, you’ll keep an eye out for those while you’re sneaking about.", parse);
				}
				Text.Flush();
				
				world.TimeStep({ minute : 5 });
				
				opts.obj = true;
				BullTowerScenes.InitiationQuestions(opts);
			}, enabled : true,
			tooltip : "If the Royal Guard have been lurking about for some time now, surely that means there’s more you can do…"
		});
	}
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			Text.Add("You decide you’re as ready as you’ll ever be, and say so.", parse);
			Text.NL();
			Text.Add("<i>“I will require a little time to make my preparations,”</i> Cveta says, turning to you. <i>“Meet me at nine in the evening, [playername], and we can be on our way.”</i>", parse);
			Text.NL();
			Text.Add("Woman of few words as ever, isn’t she?", parse);
			Text.NL();
			Text.Add("<i>“Well then,”</i> Zenith says, striding over to the tent flaps and undoing them to let you through, <i>“don’t let me keep you up. Good night, [playername]. Feel free to rest in our camp; you’ll need all your strength. No, Cveta, please sit down. I would have further words with you and Maria concerning the events of two evenings ago…”</i>", parse);
			Text.NL();
			Text.Add("Well, it seems that you’re done here. Once you’re ready, you should see Cveta about setting off.", parse);
			Text.Flush();
			
			world.TimeStep({ minute : 5 });
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "You’re about done here."
	});
	Gui.SetButtonsFromList(options, false, null);
}

BullTowerScenes.MovingOut = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	if(WorldTime().hour >= 21 || WorldTime().hour < 4)
		Text.Add("Although the flaps of Cveta’s tent are tightly drawn, you catch a glimpse of light at the seams. The songstress is still awake and presumably waiting for you so you can set off - would you like to do so?", parse);
	else
		Text.Add("You’ve arrived early, but you don’t think there are any more preparations you need to make. Maybe you could help Cveta or review the plan to make sure you’re in sync.", parse);
	Text.NL();
	Text.Add("<b>Remember that you will only have one try at this task; whether it meets with success or failure, there will be no retracing your steps, for what is done will remain done.</b>", parse);
	Text.Flush();
	
	var options = new Array();
	options.push({ nameStr : "Wait",
		func : function() {
			Text.Clear();
			Text.Add("You’re going to have only one shot at this. While time is of the essence here, it won’t do to head into the great unknown without making all the preparations you can; with that in mind, you step back and return to the middle of camp. You’ll be back when everything’s been taken care of.", parse);
			Text.NL();

			world.TimeStep({minute: 5});

			PrintDefaultOptions();
		}, enabled : true,
		tooltip : "You still need to make a few more preparations."
	});
	options.push({ nameStr : "Move out",
		func : function() {
			Text.Clear();
			if(WorldTime().hour >= 21 || WorldTime().hour < 4)
				Text.Add("There’s no need to wait any longer; time’s a-wasting. Stepping towards Cveta’s tent, you practically run into the songstress as she emerges from within.", parse);
			else {
				Text.Add("<i>“You are here early, [playername],”</i> Cveta says, greeting you with a nod as you approach her tent. <i>“There are still some hours left before our departure.”</i>", parse);
				Text.NL();
				Text.Add("You didn’t want to risk missing out on the action, you explain.", parse);
				Text.NL();
				Text.Add("<i>“Perhaps it is for the best; there are still preparations everyone needs to make. Might I trouble you to make yourself useful until dusk?”</i>", parse);
				Text.NL();
				Text.Add("Indeed, as evening nears, the camp becomes abuzz with activity - blades put to the whetstone, bowstrings tested and replaced, orders given and bootstraps tightened. The atmosphere is military - save that there are no banners or formations. The raiding party numbers about thirty, with Maria at its head; most of them look quite eager to set out and to scratch that itch with a bit of action. While the raid may be intended as a diversion, it goes without saying that they intend to make it as profitable as possible.", parse);
				Text.NL();
				Text.Add("<i>“I hope fate is kind to them. They may treat their task with levity, but I would rather not have Aquilius do much work as a result of tonight’s venture.”</i>", parse);
				Text.NL();
				Text.Add("You turn to find Cveta standing beside you, having changed into clothes more suited for sneaking about.", parse);
			}
			Text.NL();
			Text.Add("Seeing her without her gown for once throws you off a little - without all that fabric to hide her figure, it’s plain how thin and tiny she really is. You eye the simple blouse and leggings she’s donned, plain gray against an equally unremarkable brown, and have to concede that so long as Cveta doesn’t open her mouth or look anyone in the eye, she might pass for… well, someone of lower stature. Not a commoner - even when trying to hide it, she moves with far too much elegance for that - but perhaps a merchant’s daughter…", parse);
			Text.NL();
			Text.Add("Odd, though, that she’s kept the gloves. Come to think of it, there hasn’t been a single time that you’ve seen her without them.", parse);
			Text.NL();
			Text.Add("The songstress’ voice slices cleanly through your thoughts. <i>“Are we ready?”</i>", parse);
			Text.NL();
			if(party.Num() > 1) {
				var p1 = party.Get(1);
				parse["comp"]   = party.Num() == 2 ? p1.name     : "your companions";
				parse["himher"] = party.Num() == 2 ? p1.himher() : "them";
				parse["heshe"]  = party.Num() == 2 ? p1.heshe()  : "they";
				Text.Add("Just one more thing, you tell Cveta, then turn to [comp], asking [himher] to wait for you here in the outlaws’ camp; if [heshe]’d like, [heshe] can ask Zenith to join in on the raid. Sneaking around alone is already hard enough, two is a crowd, and any more would be impossible. With that out of the way, you turn back to the songstress.", parse);
				Text.NL();
			}
			Text.Add("You tell Cveta that you’re prepared, and she nods. <i>“I visited Maria earlier and got the requisite items.”</i> She produces two slips of paper, one with directions to the tower and the other a sketch of a sad-faced, balding man. <i>“Let us not tarry. The night is short.”</i>", parse);
			Text.NL();
			Text.Add("With that, she turns, leading the way. She’s careful to never venture more than a half-step ahead, politely allowing you the illusion that you know where you’re going too. The lookouts on duty lower the drawbridge, and crossing the  trenches, you’re on your way.", parse);
			Text.Flush();
			
			world.TimeStep({hour: 1});
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("The trip to the King’s Road is uneventful; the two of you slip through the thick undergrowth out of the forest. The road is clear, largely devoid of travelers, and well-lit under the clear, cloudless sky. Off in the distance, the many lights of Rigard flicker and twinkle, the city drowsy but never quite falling asleep.", parse);
				Text.NL();
				Text.Add("The further you get from Rigard, the less maintained and wilder the road becomes; it remains paved, but you notice the occasional pothole and missing flagstone, while the surrounding vegetation becomes coarser and more overgrown. You’d have guessed that the main route connecting Rigard and the Free Cities would be better maintained. Perhaps this is just a neglected patch, with no one living nearby to take responsibility for its upkeep.", parse);
				Text.NL();
				Text.Add("Another half-hour along the road and one sleepy-looking patrol later, the walls of Bull Tower draw into sight, thick and rising tall despite their age, clearly illuminated by the moonlight. Thin vines crisscross the old stone and mortar like veins across skin, and in the middle of it all, a singular watchtower stands above the walls, stiff and stout as it deeply penetrates the heavens.", parse);
				Text.NL();
				Text.Add("You’re not the only ones present, though. Even at this distance, you spot silhouettes moving atop the ramparts, and the gate - an immense archway a little ways away from the main trunk of the King’s Road - is flanked by two figures. From woodland cover to the thick, waist-high undergrowth to the shadow of the high, ancient walls, both of you creep closer and closer to the gate and its watchers. They are two pure humans, dressed in simple, unmarked clothes, with no visible armor, but by the way they carry themselves and handle their pikes, it’s clear that they’re used to handling their weapons.", parse);
				Text.NL();
				Text.Add("These must be the guards, then - you didn’t expect that they’d be in uniform, did you? Signaling for Cveta to wait, you take cover in the shadows and sneak as close as you dare, finding a good patch of undergrowth to crouch in and spy on the men. They’re clearly on edge and more than a little twitchy, constantly glancing around and fidgeting. After about ten minutes of waiting, you’re rewarded with the sound of faint clacking of hooves and wooden wheels on stone, growing steadily louder as its source draws closer: a single wagon. Its driver leans down and whispers something to the guards, receiving a reply in return; while you can’t make out the words at this distance, the tone is nevertheless urgent.", parse);
				Text.NL();
				Text.Add("<i>“...patrol... return later... give or take an hour or two... let you through first. Don’t drop that, it’s an important delivery.”</i>", parse);
				Text.NL();
				Text.Add("With that, the guards wave the wagon through and resume their vigil, peering intently into the night. Whatever it was that they were looking for, it wasn’t the wagon - and hopefully it’s not you. A knot twisting in the pit of your stomach, you stealthily withdraw from your hiding place and make your way back to Cveta, briefly relaying what you’ve seen. She folds her arms and clicks her beak impatiently, glancing down the road, into the distance.", parse);
				Text.NL();
				Text.Add("<i>“Where is Zenith?”</i>", parse);
				Text.NL();
				Text.Add("Cveta’s question is answered by an explosion that lights up a whole stretch of the King’s Road about two miles down the road from the tower. Even from ground level, it’s starkly visible - how much more it must be, then, for anyone watching from the ramparts. The flash of light is followed by a dull, thunderous roar that sweeps across the grasslands and plains, reminding you of an approaching thunderstorm.", parse);
				Text.NL();
				Text.Add("While you can’t tell if it’s of alchemical or magical origin, the enormous orange cloud of flame and smoke that rises into the air is conspicuous enough to do its job. Shouts erupt from within the fortress, followed by the clatter of boots on the ground. In less than five minutes, an entire squad of plainclothes guardsmen have pass you by at a quick march, heading directly for the source of the explosion, disappearing rapidly in the gloom. You’re not in any position to see any of the actual fighting that must be taking place, but the night air carries the shouts and screams well enough; it’ll only get worse when the squad arrives.", parse);
				Text.NL();
				Text.Add("This is it, then. You point at the guards posted by the gate, and Cveta nods in understanding. Though you know what the songstress can do, it’s still a little bizarre seeing her step out of the shadows and glide down the path to the tower on airy footsteps. To be frank, the whole thing feels  melodramatic, Cveta painting a stark silhouette in the silver moonlight.", parse);
				Text.NL();
				Text.Add("If she wanted to draw their attention, she’s definitely managed to do it - the gate guards straighten their backs and clutch their pikes with a little more vigor, practically standing at attention, but they evidently don’t think her a threat, or they’d be running off to raise the alarm.", parse);
				Text.NL();
				Text.Add("<i>“Halt! Who goes there?”</i>", parse);
				Text.NL();
				Text.Add("Cliched, but it gets the point across.", parse);
				Text.NL();
				Text.Add("<i>“Maybe she’s one of the things that Majid ordered and wandered over when the caravan blew up. You know...”</i> the other says, not taking his eyes off Cveta. <i>“You. State your name and business-”</i>", parse);
				Text.NL();
				Text.Add("<i><b>“We are familiar faces.”</b></i>", parse);
				Text.NL();
				Text.Add("The way Cveta says it… her voice is light and airy, rippling through the air. The effect it  have on the gate guards is immediate. Ready to spring out and aid the songstress at the first sign of trouble, you watch as they shake and grunt, clearly struggling against the compulsion.", parse);
				Text.NL();
				Text.Add("Then, after the pain, a release: <i>“My friend and I are amongst the smugglers expected here tonight; we are merely escaping the bandits who attacked our transport. The two of you desire to let us through, so you can return to your warm beds as soon as possible with a minimum of trouble. You are glad to have pulled guard duty instead of having to respond to the attack further down the road.”</i>", parse);
				Text.NL();
				Text.Add("The guards waste no time in taking the avenue of escape afforded to them; they visibly sag with relief, leaning on their pikes and waving Cveta onward through the gates. You step out of the shadows to join her, and the two of you quickly slip past the guards and through the ancient stone walls.", parse);
				Text.NL();
				Text.Add("<i>“Sometimes, it is easier to divert the flow of a river than to dam it,”</i> Cveta whispers to you as both of you pass through the old, crumbling gate. <i>“As my father said, it is often not a good idea to cut off an enemy from all avenues of retreat. They would have been much harder to sway if I had ordered them to let us through and not notice our presence at all.”</i>", parse);
				Text.NL();
				Text.Add("As opposed to seeing her and thinking she was expected?", parse);
				Text.NL();
				Text.Add("Cveta nods. <i>“Right. Nevertheless, we have limited time to act. The moment that squadron returns is the moment our game is up. We will have to move quickly, but not rashly.”</i>", parse);
				Text.NL();
				Text.Add("With that thought in mind, you step into the deserted main courtyard of Bull Tower, the main structure of the ancient outpost standing before you, a remnant of a time when Eden was wilder and yet more prosperous. The shadows cast by the walls are as thick on the inside as they are on the outside, and it is into the cover of these that the two of you dive, taking a moment to catch your breaths and plan your next move.", parse);
				Text.Flush();
				
				party.SaveActiveParty();
				party.ClearActiveParty();
				
				party.SwitchIn(player);
				party.AddMember(cveta, true);
				
				party.RestFull();
				
				outlaws.BT = new BullTowerStats();
				
				MoveToLocation(BullTowerLoc.Courtyard.Yard, {hour: 3});
			});
		}, enabled : true,
		tooltip : "You’re as ready as you’ll ever be."
	});
	Gui.SetButtonsFromList(options, false, null);
}


/*
 * Dungeon starts here
 */
BullTowerLoc.Courtyard.Yard.description = function() {
	Text.Add("You are standing in the main courtyard of Bull Tower, flanked by high walls on three sides and the old watchtower to the north. The gates - the only way in or out of the old fortress - lie to the south, watched over by the two guards whom Cveta ‘persuaded’ to let you in. The effects of age and neglect are clearly visible in the appearance of the grounds  - the old training field is overgrown with weeds and wildflowers, and while the walls are still solid, bits of crumbling masonry lie at the base.");
	Text.NL();
	if(outlaws.flags["BT"] & Outlaws.BullTower.StatueDestroyed) {
		Text.Add("The results of your heroic vandalism of Preston’s statue lie plain for all to see, and you can’t help but take a second or two to savor your handiwork. Toppled and smashed, only the feet remain attached to the plinth - the main body of the statue has been reduced to several chunks of marble, and the head has disappeared somewhere in the overgrown training field.");
		Text.NL();
		Text.Add("It’s a very poignant scene.");
	}
	else {
		Text.Add("Dumped not too far from the gate - perhaps due to its clearly hefty weight - is a gigantic marble statue of Preston, the bottom wrapped in canvas and secured with rope for transport. This clearly isn’t its final destination. The artist has embellished Preston quite a bit - well, a lot. The man’s apparently replaced a good fifteen pounds of fat with muscle since you last saw him, if the statue’s to be believed. However, the ground beneath it isn’t quite even - probably an oversight of whoever offloaded it here, one that could  perhaps be turned to your advantage…");
	}
	Text.NL();
	Text.Add("From your hiding spot, you can see a set of animal pens - to call them stables would be too generous - to the west, and a sheltered courtyard to the east.");
	Text.NL();
	if(outlaws.flags["BT"] & Outlaws.BullTower.CaravansIgnited) {
		Text.Add("Remains of the smugglers’ wagons you set aflame give off thin trails smoke that dissipate somewhere in the dark. While the courtyard’s roof is keeping it somewhat contained, someone is going to notice the smoke sooner or later.");
		Text.NL();
	}
	Text.Add("You take a moment to consider what you should do next.");
}


//[Animal Pens][Caravan][Enter][Statue][Slip Out]
BullTowerLoc.Courtyard.Yard.links.push(new Link(
	"Enter tower", true, true,
	null,
	function() {
		MoveToLocation(BullTowerLoc.Building.Hall, {minute: 5});
		outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
	}
));
BullTowerLoc.Courtyard.Yard.links.push(new Link(
	"Caravans", true, true,
	null,
	function() {
		MoveToLocation(BullTowerLoc.Courtyard.Caravans, {minute: 5});
		outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
	}
));
BullTowerLoc.Courtyard.Yard.links.push(new Link(
	"Animal Pens", true, true,
	null,
	function() {
		MoveToLocation(BullTowerLoc.Courtyard.Pens, {minute: 5});
		outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
	}
));

BullTowerLoc.Courtyard.Yard.events.push(new Link(
	"Statue", function() {
		return !(outlaws.flags["BT"] & Outlaws.BullTower.StatueDestroyed);
	}, true,
	null,
	function() {
		var parse = {
			playername: player.name
		};
		
		Text.Clear();
		Text.Add("You give Preston’s statue another look-over. If not for the fact that you know better, the depiction of the man could almost be called noble. The statue’s forward pose, the pure white marble it’s made of, the literally chiseled features… it’s absolutely nothing like the Preston who burst into the warehouse and claimed credit for Miranda’s catch for himself.", parse);
		Text.NL();
		Text.Add("A pretentious statue for a pretentious man. Very fitting. The more you look at it, though, the more you feel it would look, much, much better in several pieces. With the way it’s balanced right now, wrapped up and bound on uneven ground, it’s truly itching for a good hurting. Just a little push in the right direction…", parse);
		Text.NL();
		Text.Add("You hear Cveta click her beak as she steps up to your side. <i>“I take it that your thoughts and mine are aligned with regards to this pompous travesty?”</i>", parse);
		Text.NL();
		Text.Add("Why yes, you do believe they are. ", parse);
		if(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed) {
			Text.Add("Even Alaric appears grimly pleased at the prospect, the little bean counter’s lips thin and straight, his eyes hard.", parse);
			Text.NL();
			Text.Add("<i>“I’ll gladly help too,”</i> he says. <i>“I know I won’t get the chance to actually put a fist to Preston’s jaw, so this’ll have to do. And I daresay I deserve it.”</i>", parse);
			Text.NL();
			Text.Add("Well, since you’ve done what you came to do, there’d probably be no harm in you engaging in a little heroic vandalism. You’re on your way out already, and anything that distracts the Royal Guard from pursuit would be helpful. Will you do it?", parse);
		}
		else {
			Text.Add("It certainly is tempting to topple the statue and smash it into a thousand tiny pieces, but the resulting noise would probably attract a lot of attention. Nevertheless, if you’re really determined, you <i>could</i> do so anyway. Will you topple the statue?", parse);
		}
		Text.Flush();
		
		//[Yes][No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				Text.Clear();
				var sus;
				if(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed) {
					Text.Add("<i>“Let’s get started, then!”</i> Alaric says, a twinge of vindictive glee in his voice. Without further ado, the three of you stride up to the statue’s base and, on a count of three, give it an experimental push. It wobbles a little, which is all the encouragement you need to set it to rocking dangerously. The statue’s fate is sealed - one final shove, good and hard, and it tips off-balance and tumbles from its plinth. Weeks, perhaps months’ worth of work by an artisan sculptor ruined in a matter of minutes, Preston’s chiseled form shattering into an assortment of fragments both large and small when it hits the ground.", parse);
					Text.NL();
					Text.Add("It’s a while before the echoes fade, contained within the high walls as they are. Without anything to hold onto, the ropes and canvas that once bound the statue lie loose in the dirt, and Alaric’s found the statue’s disembodied head; as you watch, he punts it into the tall grass with a savage kick. There’s a surprising amount of strength in that small frame of his - won’t he hurt his foot like that?", parse);
					Text.NL();
					Text.Add("You turn to Cveta, but she shakes her head. <i>“Let him vent his frustration, [playername]. We should be leaving soon. I suppose I should do my part, too.”</i>", parse);
					Text.NL();
					Text.Add("As you watch, Cveta produces a small stick of charcoal from a pocket. Focusing her attention on the dim light, she sketches the outlaws’ symbol - a stylized paw - on the toppled plinth with a few broad strokes. <i>“That should suffice. With that, I suggest that we vacate the premises posthaste - better to leave on our own terms rather than being forced to flee.”</i>", parse);
				}
				else {
					Text.Add("To the wind with caution! You want to see Preston’s face smashed so badly that you’re willing to take this risk. Pressing your back against the marble statue, you give it an experimental push. The effort is rewarded when you find it rocks slightly on the uneven ground, and you note with grim satisfaction that it could probably be toppled. Maybe not by you alone, but with Cveta helping…", parse);
					Text.NL();
					Text.Add("Their carelessness, your gain. Cveta looks a little uneasy about the idea, but eventually gives in and follows your lead, pushing her slight frame against the statue. She doesn’t add very much, but it’s enough to tip the scales and send it careening to the ground where it shatters into a thousand pieces with a mighty crash. It takes a good while for the echoes to fade - while someone has definitely heard that and will eventually arrive to investigate, smashing that statue felt <i>good</i>, didn’t it?", parse);
					sus = true;
				}
				Text.Flush();
				
				world.TimeStep({minute: 20});
				outlaws.flags["BT"] |= Outlaws.BullTower.StatueDestroyed;
				
				Gui.NextPrompt();
				if(sus)
					outlaws.BT.IncSuspicion(100, 20);
			}, enabled : true,
			tooltip : "Time for some heroic vandalism!"
		});
		options.push({ nameStr : "No",
			func : function() {
				Text.Clear();
				Text.Add("Despite you being sorely tempted to send the likeness of that pompous ass careening to the ground, you stay your hand for now and step back from the statue. Now’s not the time to give in to impulses of petty vindictiveness.", parse);
				if(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed) {
					Text.NL();
					Text.Add("<i>“Oh?”</i> Cveta says, seeing you change your mind. <i>“Is there something you still need to accomplish in this place, [playername]? Time does grow short - we should keep backtracking to a minimum, lest we overstay our welcome.”</i>", parse);
				}
				Text.Flush();
				
				world.TimeStep({minute: 5});
				
				Gui.NextPrompt();
				outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
			}, enabled : true,
			tooltip : "Nah, it can wait."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
));

BullTowerLoc.Courtyard.Yard.links.push(new Link(
	"Slip out", true, true,
	null,
	function() {
		var parse = {
			
		};
		
		Text.Clear();
		if(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed) {
			Text.Add("With Alaric freed and the main objective of your mission completed, you could leave the fortress with a clean conscience - and it would be best to do so before the diversion runs its course and you’re forced to make a desperate escape. Best to quit while you’re ahead, as the saying goes.", parse);
			Text.NL();
			Text.Add("With that in mind, will you really leave the fortress now?", parse);
			Text.Flush();
			
			//[Yes][No]
			var options = new Array();
			options.push({ nameStr : "Yes",
				func : function() {
					BullTowerScenes.EndingSlipOut();
				}, enabled : true,
				tooltip : "Best leave while still ahead."
			});
			options.push({ nameStr : "No",
				func : function() {
					Text.Clear();
					Text.Add("The urge to leave the tower grounds is strong - the less you linger, the smaller the chance you’ll be detected, after all - but you fight the impulse to flee. There’s still work to be done here.", parse);
					Text.Flush();
					
					Gui.NextPrompt();
				}, enabled : true,
				tooltip : "There’s still work to be done here."
			});
			Gui.SetButtonsFromList(options, false, null);
		}
		else {
			Text.Add("You look at the open archway and drawn portcullis. It’s true you could leave now, but you still haven’t accomplished what you set out to do. Retreat is not an option at this point, especially not with Cveta watching you and the fact that if you left now, you’d have a really hard time trying to explain things to Zenith.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}
	}
));



BullTowerLoc.Courtyard.Caravans.description = function() {
	Text.Add("Off to the east of the main tower building, this small courtyard is roofed, presumably to keep the wind and rain off carts, carriages and wagons parked in it. However, age has caused the roof to fall apart in places, allowing moonlight to shine through holes in the old masonry work.");
	Text.NL();
	if(outlaws.flags["BT"] & Outlaws.BullTower.CaravansIgnited) {
		Text.Add("The wagons are still alight - all that wood, oilcloth and canvas will sustain a lovely low fire that’ll burn till dawn. You can only hope that no one will actually notice it until you and Cveta have made your escape, and that the guards won’t come to their senses from all the heat and smoke wafting over and raise the alarm.");
	}
	else {
		Text.Add("The dust on the wagons’ wheels is still fresh - you guess that they can’t have been here more than a few hours. With sides painted a dark gray, presumably to be less visible at night, it’s unlikely that this is just another trading caravan.");
		Text.NL();
		Text.Add("One of the wagons has its rear end facing toward you, and you can see that it’s largely empty - at least of any visible cargo. If anything was brought here, it’s been offloaded to who knows where.");
		Text.NL();
		if(outlaws.BT.guardsDown)
			Text.Add("Now that the guards have been dealt with, you can do as you please with the contraband caravan.");
		else
			Text.Add("Four guards have been posted by the wagons - clearly the home guard while everyone else’s out on the road; they fidget and glance about nervously from time to time, but don’t budge from their posts. If you want to get at the wagons, you’ll have to find a way to deal with them first.");
	}
}

BullTowerLoc.Courtyard.Caravans.links.push(new Link(
	"Courtyard", true, true,
	null,
	function() {
		MoveToLocation(BullTowerLoc.Courtyard.Yard, {minute: 5});
		outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
	}
));

BullTowerLoc.Courtyard.Caravans.events.push(new Link(
	"Guards", function() {
		return !(outlaws.BT.guardsDown);
	}, true,
	null,
	function() {
		var parse = {
			playername : player.name
		};
		
		Text.Clear();
		Text.Add("Creeping as close as the shadows will allow, you spy on the caravan guards. Like their fellows at the gates, none of them are actually in uniform, but the unmarked armor they wear is solid and they look comfortable with their weapons - it’d be reasonable to assume that they aren’t greenhorns. With them stretched out in a line across the entrance to the courtyard, it looks like there’s going to be no sneaking past them - you’ll have to take them out if you want to get to the wagons.", parse);
		Text.NL();
		Text.Add("A few possibilities present themselves; what will you do?", parse);
		Text.Flush();
		
		//[Sneak][Distract][Lull][Back]
		var options = new Array();
		options.push({ nameStr : "Sneak",
			func : function() {
				Text.Clear();
				Text.Add("You outline your plan to Cveta: sneak in as close as possible, wait for an opening and take out as many of the guards as you can before they can react. The songstress looks a little uncertain at the idea, but you reassure her of your confidence in your abilities.", parse);
				Text.NL();
				Text.Add("<i>“Well,”</i> she says at last. <i>“I shall trust you to know what you are doing. Please, make your move; I will be right behind you.”</i>", parse);
				Text.NL();
				Text.Add("Nodding, you creep closer and closer to the nearest guard until you’re at the very edge of the shadows; about thirty paces lie between you and him. Seconds tick by - although they may very well have been hours, for how slowly they pass - and the moment he turns his gaze, you burst out of your hiding place at a sprint, making a beeline for him.", parse);
				Text.NL();
				
				var enemy = new Party();
				enemy.AddMember(new Footman());
				enemy.AddMember(new Footman());
				
				var dex = player.Dex() + Math.random() * 20;
				if(dex >= 70) {
					Text.Add("Your feet are light, your steps like the wind; bursting out of the shadows like an arrow loosed from a bow, you manage to strike the guard closest to you on the head, taking him out. His friend whips around, eyes wide with surprise. Before he can manage to move, you take him out in the same fashion and are ready with your weapon drawn as the remaining two guards turn on you and Cveta.", parse);
					//#Start 2 guard combat
				}
				else {
					Text.Add("Unfortunately, you’re simply too slow to get the drop on the guards. Though you’re moving as fast as your feet will carry you, they’ve long noticed you coming and are ready to welcome you with their pikes. Gritting your teeth, you prepare yourself for battle.", parse);
					//#Start 4 guard combat
					enemy.AddMember(new Footman());
					enemy.AddMember(new Footman());
				}
				Text.Flush();
				
				var enc = new Encounter(enemy);
				
				enc.canRun = false;
				enc.onLoss = BullTowerScenes.GuardsLoss;
				enc.onVictory = BullTowerScenes.GuardsWin;
				
				Gui.NextPrompt(function() {
					enc.Start();
				});
			}, enabled : true,
			tooltip : "Sneak up to the guards and knock them out."
		});
		options.push({ nameStr : "Distract",
			func : function() {
				Text.Clear();
				Text.Add("You briefly outline your plan to Cveta: distract the guards so they’re looking the other way, then sneak up on them from behind and take them out with a minimum of fuss.", parse);
				Text.NL();
				Text.Add("<i>“And what do you hope to distract them with? I doubt that they are the sort to go chasing a thrown rock.”</i>", parse);
				Text.NL();
				Text.Add("Well, she can do it with her voice, can’t she?", parse);
				Text.NL();
				Text.Add("<i>“Pardon?”</i>", parse);
				Text.NL();
				Text.Add("She can circle around to the other side and make a little noise; since the guards are already on edge with one of the caravans under attack, it shouldn’t be too hard to ‘persuade’ them to investigate and draw them away from their posts. When they have their backs turned to you, you’ll come up from behind and take out as many of them as you can.", parse);
				Text.NL();
				Text.Add("<i>“Yes, I can do that. Give me a few moments, please.”</i>", parse);
				Text.NL();
				Text.Add("With that, Cveta creeps off, disappearing through the shadows and into the overgrown weeds that cover much of the tower grounds. It’s a minute or so before anything else happens, but it’s unmistakable when it does: a barely audible song tugs at your consciousness, beckoning you over.", parse);
				Text.NL();
				Text.Add("Even though you know it’s Cveta, it takes a noticeable effort to restrain yourself from wandering over to investigate the faint singing. Not that you have to hold back for long - the guards are already being drawn in by Cveta’s music, although they’re still cautious in approaching her hiding spot.", parse);
				Text.NL();
				Text.Add("Now that they have their backs turned, it’s time for you to make your move. Breaking into a light-footed run, you make a beeline for the guard closest to you, ready to knock him out.", parse);
				Text.NL();
				
				var enemy = new Party();
				enemy.AddMember(new Footman());
				enemy.AddMember(new Footman());
				
				var intel = player.Int() + Math.random() * 20;
				
				if(intel >= 70) {
					Text.Add("Distracted as they are, the guards don’t see or hear you coming. You strike the first guard on the head and bring him down with ease; the second is brought down with a bit of a scuffle and you’re ready for the third and fourth as they round on you. Gritting your teeth, you get ready for combat, Cveta emerging from the grass to back you up.", parse);
					//#Start 2 guard combat
				}
				else {
					Text.Add("Distracted as they are, the guards nevertheless manage to hear you coming and spin to face you, just barely drawing their weapons to mount a hasty defense. Seeing your ruse fail, you grit your teeth and prepare for battle, with Cveta emerging from the shadows to back you up.", parse);
					//#Start 4 guard combat
					enemy.AddMember(new Footman());
					enemy.AddMember(new Footman());
				}
				Text.Flush();
				
				var enc = new Encounter(enemy);
				
				enc.canRun = false;
				enc.onLoss = BullTowerScenes.GuardsLoss;
				enc.onVictory = BullTowerScenes.GuardsWin;
				
				Gui.NextPrompt(function() {
					enc.Start();
				});
			}, enabled : true,
			tooltip : "Try to trick the guards to turn the other way and jump them from behind."
		});
		options.push({ nameStr : "Lull",
			func : function() {
				Text.Clear();
				Text.Add("You quickly assess the situation and ask Cveta if she can put her talents to use here. Ordering these particular sentries away like she did with the gate guards might be useful.", parse);
				Text.NL();
				Text.Add("<i>“I am not sure that would be the best course of action,”</i> Cveta replies after studying the guards herself. <i>“It is unlikely that they are expecting anyone at this time… but I think they do look a little tired.”</i>", parse);
				Text.NL();
				Text.Add("Well, what does she intend, then?", parse);
				Text.NL();
				Text.Add("<i>“I will encourage them to give in to their fatigue. It is but Preston’s own fault if he overworks his men to the point that they fall asleep on the job. Would you please cover your ears, [playername]?”</i>", parse);
				Text.NL();
				Text.Add("Good idea. You don’t want to be falling asleep yourself. Covering your ears with your hands, you look on as Cveta takes a few breaths before launching into a soothing lullaby, projecting her voice directly at the sentries.", parse);
				Text.NL();
				
				var enemy = new Party();
				enemy.AddMember(new Footman());
				enemy.AddMember(new Footman());
				
				if(Math.random() >= 0.4) {
					Text.Add("It works like a charm. The two guards closest to your hiding spot are soon having trouble staying awake, yawning and swaying, before dropping where they stand in a snoozing heap. Their remaining fellows look absolutely shocked, but waste no time in drawing their weapons and advancing upon you and Cveta. It’s a fight!", parse);
					//#Start 2 guard combat
				}
				else {
					Text.Add("Either Cveta’s voice didn’t carry well enough or the guards are made of sterner stuff than you thought. While those closest to you look somewhat unsteady on their feet, they manage to resist the effects of Cveta’s voice and advance upon you in formation, weapons drawn. It’s a fight!", parse);
					//#Start 4 guard combat
					enemy.AddMember(new Footman());
					enemy.AddMember(new Footman());
				}
				Text.Flush();

				var enc = new Encounter(enemy);
				
				enc.canRun = false;
				enc.onLoss = BullTowerScenes.GuardsLoss;
				enc.onVictory = BullTowerScenes.GuardsWin;
				
				Gui.NextPrompt(function() {
					enc.Start();
				});
			}, enabled : true,
			tooltip : "Have Cveta attempt to lull the guards to slumber with a song."
		});
		Gui.SetButtonsFromList(options, true, function() {
			Text.Clear();
			Text.Add("You decide that messing with these guards isn’t worth it right now. With that thought in mind, you slink back into the safety of the shadows, Cveta in tow.", parse);
			Text.NL();
			PrintDefaultOptions(true);
			outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
		});
	}
));

BullTowerScenes.GuardsWin = function() {
	var enc  = this;
	SetGameState(GameState.Event, Gui);
	
	var parse = {
		
	};
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("The last of the sentries guarding the caravans collapses to the ground, succumbing to his wounds. Wasting no time, you hurry to hide your unconscious adversaries in an overgrown patch of weeds - the thigh-height grass conceals them nicely, and they should stay out cold for a good while.", parse);
		Text.NL();
		Text.Add("Naturally, you rifle through their pockets, but fail to find much of use. A box of matches, a few loose cigarettes - the sort of thing guards on duty might have on their person. One particular item stands out, though - a key that looks almost as ancient as the fortress. Wondering if it unlocks something in the tower, you pocket the thing. Maybe it’ll come in handy later.", parse);
		Text.Flush();
		
		outlaws.BT.guardsDown = true;
		
		Gui.NextPrompt();
		outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
	});
	Encounter.prototype.onVictory.call(enc);
}

BullTowerScenes.GuardsLoss = function() {
	var enc  = this;
	SetGameState(GameState.Event, Gui);
	
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Seems like this scuffle isn’t going as you planned. Deciding to disengage while you still can, you quickly signal to Cveta to beat a fighting retreat. The caravan guards break off pursuit after just a few more blows, and the reason for that soon becomes apparent: the two of you have barely crossed the courtyard when the loud clanging of a bell being rung echoes across the entirety of the ancient fortress - the alarm!", parse);
	Text.NL();
	
	BullTowerScenes.EndingFailure();
}

BullTowerLoc.Courtyard.Caravans.events.push(new Link(
	"Search Caravans", function() {
		return !(outlaws.flags["BT"] & Outlaws.BullTower.CaravansSearched) &&
		       !(outlaws.flags["BT"] & Outlaws.BullTower.CaravansIgnited);
	}, function() {
		return outlaws.BT.guardsDown;
	},
	null,
	function() {
		var parse = {
			playername : player.name
		};
		
		Text.Clear();
		Text.Add("With the guards out of the way, it’s a simple matter to saunter up to the caravan wagons and start searching; Cveta and you split up to look through everything as quickly as possible, rummaging away in the dim light.", parse);
		Text.NL();
		Text.Add("Most of the cargo has been unloaded, leaving just the caravaneers’ personal effects for the two of you to sift through. Spare clothing, cooking utensils, the odd keepsake - it’s not until you come to the lead wagon that you manage to find a small trunk lying beneath a couple of bedrolls. Opening it reveals a stack of invoices tied together with string, and a quick glance at the goods involved and the money that’s changed hands leaves little doubt that this is the evidence you need to prove the Royal Guard’s complicity in this smuggling operation. For them to be leaving this around, even if it was hidden… well, the guards may be cautious, but the caravaneers are certainly much less so.", parse);
		Text.NL();
		Text.Add("<i>“I recognize some of the buyers’ names,”</i> Cveta says from behind you. She’s clutching a small sheaf of receipts in her hands, each one signed very neatly. <i>“An assortment of the degenerates who call themselves Rigard’s high society. This is damning evidence, [playername]. I don’t doubt that they’ll be able to weasel their way out of the penalties for tax evasion, but the truth is powerful in and of itself.”</i>", parse);
		Text.NL();
		Text.Add("Hey, she’s right. Now that she’s brought it to your attention… Krawitz’s name <i>does</i> appear on a few of the invoices and receipts. The handwriting is small and spidery, but there’s no doubt about it - he’s listed as the buyer in no uncertain terms.", parse);
		Text.NL();
		Text.Add("If there weren’t already enough reason to dislike the little man…", parse);
		Text.NL();
		Text.Add("Well, you’ve seen enough to know that Zenith will very definitely be interested in these. Hastily bundling both receipts and invoices together, you stow them with your other belongings and turn to other matters.", parse);
		Text.Flush();
		
		outlaws.flags["BT"] |= Outlaws.BullTower.CaravansSearched;
		
		Gui.NextPrompt();
		outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
	}
));


BullTowerLoc.Courtyard.Caravans.events.push(new Link(
	"Burn Caravans", function() {
		return outlaws.BT.guardsDown && !(outlaws.flags["BT"] & Outlaws.BullTower.CaravansIgnited);
	}, true,
	null,
	function() {
		var parse = {
			
		};
		
		Text.Clear();
		if(Jobs["Mage"].Unlocked(player))
			Text.Add("As soon as the idea forms in your mind, so does a spark at your fingertips. Magic really makes things convenient, doesn’t it? Indeed, you could easily set the whole wagon train ablaze with a fireball; the canvas and oilcloth hoods should catch easily enough.", parse);
		else if(outlaws.BT.stoleLantern)
			Text.Add("You smile as the thought comes to mind. Maybe this oil lantern might actually come in useful. The canvas and oilcloth of the wagon hoods should catch fire easily, should you desire to set them ablaze.", parse);
		else {
			Text.Add("It <i>is</i> a nice thought, but you don’t have any means of starting a fire on hand. Can’t burn the wagons if you can’t set them alight, can you?", parse);
			Text.Flush();
			Gui.NextPrompt();
			return;
		}
		Text.NL();
		if(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed)
			Text.Add("Alaric catches your eye, and the injured dissident gives both you and Cveta a brisk nod. Torching the smuggling caravan would be a good way to cover your retreat and give the Royal Guard something to do other than hunt you down. Are you going to do it?", parse);
		else
			Text.Add("On the other hand, it’s very likely that once the sight and smoke of the burning wagons spreads beyond the confines of this small enclosure, you’re going to be feeling a lot of heat on your back. Are you sure you want to do this?", parse);
		Text.Flush();
		
		//[Yes][No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			func : function() {
				Text.Clear();
				Text.Add("Yes, the wagons are close enough that the fire should easily spread between them. You’re a bit surprised at how readily the canvas hoods catch flame - it’s almost as if they <i>want</i> to be destroyed - and just for good measure, you pay extra attention to the wooden frames, going over them carefully and making sure there’s going to be nothing salvageable after the intense heat has done its work.", parse);
				if(!(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed)) {
					Text.NL();
					Text.Add("With all the heat and smoke the burning wagons are creating, you’ve probably drawn plenty of attention to yourself. The roof will keep the inferno contained for a little while, but the smoke will spill out and someone is going to notice eventually - if the guards you took out aren’t roused by the flames first, that is.", parse);
				}
				Text.Flush();
				
				outlaws.flags["BT"] |= Outlaws.BullTower.CaravansIgnited;
				
				Gui.NextPrompt();
				if(!(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed))
					outlaws.BT.IncSuspicion(100, 30);
				else
					outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
			}, enabled : true,
			tooltip : "Light ‘em up!"
		});
		options.push({ nameStr : "No",
			func : function() {
				Text.Clear();
				Text.Add("Reconsidering, you step back from the wagons. If you burned them, there’d be no turning back if you decided that they could be useful later. Maybe you could return and finish the job just before you leave the tower grounds for good?", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "It can wait for now."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
));

BullTowerLoc.Courtyard.Pens.description = function() {
	Text.Add("These pens look like they used to be proper stables, but time and neglect have eaten away at the supporting timbers. A few serviceable stalls remain, but… well, it wouldn’t be right to call them stables without a single horse in it.");
	Text.NL();
	Text.Add("The prevailing smell in the air is one of mold and old dirt rather than that of animals; any feeding or water troughs have long since decayed into dust, with hooks for tack and other riding gear long rusted down to brown stubs. Even with the wealthy Royal Guard secretly occupying Bull Tower, the building is not getting much use - they must do most of their travel on foot.");
	Text.NL();
	Text.Add("The only part of these pens which could be considered relatively new are the latches on the stall doors, which although not exactly shiny, have yet to accumulate the thick coat of rust and grime that covers every other metal object in the vicinity.");
	Text.NL();
	if(outlaws.flags["BT"] & Outlaws.BullTower.AnimalsFreed)
		Text.Add("Having released the mules, there’s nothing else for you to do here. The beasts mill about the grounds placidly, creating a bit of noise but presenting no immediate difficulty that would require the attention of the guard. It’s quite a clever diversion, now that you think about it - any strange noises that you or Cveta inadvertently make would in all probability be blamed on the poor animals and not investigated until sunup.");
	else
		Text.Add("The twenty or so mules that have been housed here are rather docile. The animals are clearly used to human-ish presence and give no reaction to your entry save for faint whuffs of breath and the occasional flick of a ear or tail. It might be worthwhile to let them out of their pens as a diversion.");
	Text.NL();
	Text.Add("Well, what will you do?");
}

BullTowerLoc.Courtyard.Pens.links.push(new Link(
	"Courtyard", true, true,
	null,
	function() {
		MoveToLocation(BullTowerLoc.Courtyard.Yard, {minute: 5});
		outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
	}
));

BullTowerLoc.Courtyard.Pens.events.push(new Link(
	"Free Animals", function() {
		return !(outlaws.flags["BT"] & Outlaws.BullTower.AnimalsFreed);
	}, true,
	null,
	function() {
		var parse = {
			
		};
		
		Text.Clear();
		Text.Add("Looking at the placid beasts in their stalls, an idea comes to mind. Moving to each old stall - and trying not to think too hard about the moldy stench as you do so - you undo the latches on each of the pen doors in turn, throwing gates wide open for the mules to make their escape. After taking a few moments to notice that freedom and grazing is now within their reach, they trot out of the ancient building to the overgrown courtyard, which seems far more to their liking.", parse);
		Text.NL();
		Text.Add("Your actions don’t go unnoticed, though - not with all twenty-odd mules put to pasture. Soon enough, a pair of lights appear atop the section of wall closest to the animal pens, a trio of silhouettes peering down into the darkness below. Quickly, you duck behind the cover of a low, crumbling wall, Cveta following in your step.", parse);
		Text.NL();
		Text.Add("<i>“Crap, the mules got out again.”</i> The voice is faint as it floats down from the ramparts.", parse);
		Text.NL();
		Text.Add("<i>“That’s the third time this month. Damn it, Fred, we should really get better latches.”</i>", parse);
		Text.NL();
		Text.Add("<i>“It’s not a matter of the latches, dimwit. They hold well enough. The critters are just smarter than we give them credit for. I told you, I saw one of them nose it open couple of weeks ago, just like that.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Does that matter right now? The damned things are out and all over the courtyard. Who’s going to go down and get them back in?”</i>", parse);
		Text.NL();
		Text.Add("Silence. You hold your breath, not taking your eyes off the flickering lights.", parse);
		Text.NL();
		Text.Add("<i>“You know what? It’s far too dark for this crap.”</i>", parse);
		Text.NL();
		Text.Add("<i>“What?”</i>", parse);
		Text.NL();
		Text.Add("<i>“What I’m saying is that those dumb critters aren’t going to go anywhere, not unless they try to get through the gate, and it’s too dark to be romping around trying to herd them back in. If they want out, well, they can fucking well stay out. I say it can damn well wait till dawn.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I’m not so sure about that, Fred…”</i>", parse);
		Text.NL();
		Text.Add("<i>“Besides, don’t we have orders to be on the lookout for intruders while everyone else is out on the road? We should be looking out, not in. You really want to risk explaining to the lieutenant that we abandoned our posts for a few stupid animals? Let them make a bit of noise - that’s the most they’re going to be doing.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Is that really alright?..”</i>", parse);
		Text.NL();
		Text.Add("Fred must have won the argument, for the lights eventually disappear, leaving you and Cveta to be on your way.", parse);
		Text.Flush();
		
		outlaws.flags["BT"] |= Outlaws.BullTower.AnimalsFreed;
		
		world.TimeStep({ minute : 15 });
		
		Gui.NextPrompt();
		outlaws.BT.DecSuspicion(-100, 20);
	}
));


BullTowerLoc.Building.Hall.description = function() {
	Text.Add("The main hall of Bull Tower is just inside the archway of the main entrance. Walls where banners and tapestries once hung now lie bare, their only adornment dust gathering in the cracks between the stones. Built to accommodate the hundreds who were once garrisoned here, it now lies empty, its expansiveness causing even the lightest of your footsteps to echo in the darkness.");
	Text.NL();
	Text.Add("While most of the staircases are too precarious to navigate, you do note that there are footprints on two sets of steps: one spiraling upward into the darkness of the main watchtower, and one leading downward below ground level. Similarly, most of the doors have been boarded up and nailed shut, but there are a few which look like they’ve seen some use of late.");
	Text.NL();
	Text.Add("Behind you lies the exit to the main courtyard, should you need to beat a hasty retreat.");
}

//[Warehouse][Office][Watchtower][Cell][Courtyard]
BullTowerLoc.Building.Hall.links.push(new Link(
	"Courtyard", true, true,
	null,
	function() {
		MoveToLocation(BullTowerLoc.Courtyard.Yard, {minute: 5});
		outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
	}
));
BullTowerLoc.Building.Hall.links.push(new Link(
	"Warehouse", true, true,
	null,
	function() {
		var parse = {
			
		};
		
		Text.Clear();
		if(outlaws.BT.guardsDown) {
			if(outlaws.BT.warehouseRepeat) {
				Text.Add("Slipping through the now-unlocked door to the warehouse, you carefully close it behind you.", parse);
			}
			else {
				outlaws.BT.warehouseRepeat = true;
				Text.Add("The key that you found on the caravan guards looks like it might fit the lock on the door, and indeed, it slips in easily, the tumblers moving without so much as a squeak. Seems like this door is used often enough for the guards to keep the lock in good condition.", parse);
			}
			Text.NL();
			MoveToLocation(BullTowerLoc.Building.Warehouse, {minute: 5}, true);
		}
		else {
			if(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed)
				Text.Add("You try every one of the keys on the key ring that you picked off Corishev’s pants, but none of them fit the keyhole. Guess he wasn’t holding onto the key for this door, then. Where is it?", parse);
			else {
				parse["t"] = party.InParty(terry, true) ? "would have daunted even Terry" : "would daunt even the most skilled of thieves";
				Text.Add("You push and pull on the stout iron handle, but it’s no good - the door is locked by an impressive-looking mechanism that [t]. You’re not going to be getting into the warehouse without the proper key.", parse);
			}
			Text.Flush();
			Gui.NextPrompt();
		}
		outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
	}
));
BullTowerLoc.Building.Hall.links.push(new Link(
	"Office", true, true,
	null,
	function() {
		MoveToLocation(BullTowerLoc.Building.Office, {minute: 5});
		outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
	}
));
BullTowerLoc.Building.Hall.links.push(new Link(
	"Cell", true, true,
	null,
	function() {
		MoveToLocation(BullTowerLoc.Building.Cell, {minute: 5});
		outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
	}
));
BullTowerLoc.Building.Hall.links.push(new Link(
	"Tower", true, true,
	null,
	function() {
		MoveToLocation(BullTowerLoc.Building.Watchtower, {minute: 5});
		outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
	}
));

BullTowerLoc.Building.Cell.onEntry = function() {
	var parse = {
		playername : player.name,
		weapon : function() { return player.WeaponDesc(); }
	};
	
	Text.Clear();
	if(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed) {
		Text.Add("Now that Alaric’s been freed, there’s no reason for you to return to that horrible place, and neither is there any need to distress an already shaken Alaric by doing so. Besides, you’re not sure whether the lieutenant remains unconscious, and given the deafeningly loud silence that comes from within the cell, you’d rather not risk unlocking the door to find out.", parse);
		Text.NL();
		Text.Add("Best to let sleeping dog-morphs lie, as the saying goes. Quietly, you slip back to the main hall.", parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			MoveToLocation(BullTowerLoc.Building.Hall, {minute: 5});
			outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
		});
	}
	else {
		Text.Add("You creep down the cold stone stairs that lead into the darkness, with Cveta following closely behind, feeling your way down the forbidding passageway. This isn’t a true dungeon - Bull Tower was never meant to hold prisoners for any length of time - but the guards of old would have needed a secure place to lock up ruffians and miscreants they picked up off the King’s Road. As you proceed, a voice drifts up the stairwell, sounding not quite sane:", parse);
		Text.NL();
		Text.Add("<i>“Scream! Scream for me! So, are you going to sign it, or not? I have it ready in the office upstairs. All you need to do is sign, and I won’t have to whip you any more.”</i>", parse);
		Text.NL();
		Text.Add("You inch closer to the worm-eaten door that separates the hallway from the cell. While there’s no slit or window to allow you a glimpse of what lies within, at least there’s some form of light shining through the cracks in the wood.", parse);
		Text.NL();
		Text.Add("<i>“If… if I sign… you’ll just kill me anyway.”</i> A second voice, clearly pained. <i>“And I’m… not signing that which I know… isn’t true.”</i>", parse);
		Text.NL();
		Text.Add("The unmistakable crack of a whip as it sails through the air comes clearly through the door, and the voice erupts in a muffled scream.", parse);
		Text.NL();
		Text.Add("<i>“You mean you weren’t the one who was stealing from the treasury, my dear? Spirits forbid! We have plenty of evidence on you!”</i>", parse);
		Text.NL();
		Text.Add("<i>“You don’t… bastard…”</i>", parse);
		Text.NL();
		Text.Add("<i>“Guilty as charged - never knew my father. Now, it’s perfectly fine with me if you won’t confess, because I’ll get to whip you all night, and whip you good. However, Preston won’t be too pleased with your refusal. He doesn’t like it when crimes go unsolved, you know. Reflects badly on us. Ever since the Royal Guard took on more responsibility, we’ve had a yearly decrease in petty crime across the board, and I have targets to meet.”</i>", parse);
		Text.NL();
		Text.Add("Guess it must be Corishev and Alaric in there - time for you to make an entrance. Are you ready?", parse);
		Text.Flush();
		
		//[Yes][No]
		var options = new Array();
		options.push({ nameStr : "No",
			func : function() {
				Text.Clear();
				Text.Add("As much as you want to burst in right now, you realize that it’s better to prepare first. You can mostly guess what’s going on the other side of that door… but if you are missing something, you don’t want to be caught with your pants down.", parse);
				Text.NL();
				Text.Add("With that in mind, you head back up the stairs to the main hall.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(BullTowerLoc.Building.Hall, {minute: 5});
					outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
				});
			}, enabled : true,
			tooltip : "As much as you want to burst in right now, you realize that it’s better to prepare first."
		});
		options.push({ nameStr : "Yes",
			func : function() {
				outlaws.BT.foughtCorishev = true;
				
				Text.Clear();
				Text.Add("Well, this is it, then. Looking to Cveta, you ask her in a hurried whisper if she can do anything to give the two of you an edge.", parse);
				Text.NL();
				Text.Add("<i>“I could try, but success is unlikely,”</i> she whispers back. <i>“The torturer on the other side of the door is rather unhinged and maniacal. He would probably realize something was amiss before my voice could properly take hold.”</i>", parse);
				Text.NL();
				parse["w"] = player.Weapon() ? Text.Parse(", your [weapon] in hand and at the ready", parse) : "";
				Text.Add("Seems like there’s little else to be done, then. Steeling yourself, you grip the handle of the old door and push - to your surprise, it isn’t locked - then throw it open[w].", parse);
				Text.NL();
				Text.Add("What greets your eyes is a garish sight. The first thing you notice is that the stone floor is glistening with fluids. Most of the mess is clear - probably sweat - but there are faint traces of red and white in the slick mix that spreads outward from the centre. What little furniture there is in the room has been broken; what used to be a couple of wooden chairs lie in splinters, and even the bare-bones metal jail bed has been torn off its supports where it was once affixed on the wall.", parse);
				Text.NL();
				Text.Add("In the midst of it all is a set of chains and cuffs - chains hanging from the ceiling, cuffs affixed to the floor - and hanging naked on it, like a pelt on a curing rack, is a little man, perhaps in his late twenties or early thirties. His hairline is receding, and his skin glistens with sweat and a greenish, slimy substance. Several lash marks, thin, red and weeping blood, have been expertly applied to his back, and yet, despite the pain he must be feeling, he’s sporting a raging erection.", parse);
				Text.NL();
				Text.Add("This, you presume, must be Alaric.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("Though he hangs limply in the midst of the mess, he lifts his head weakly as Cveta and you enter, eyes widening in equal parts hope and fear. He looks frantic, and his lips move, the man clearly trying to mouth some words, but you don’t get what he’s trying to tell you.", parse);
					Text.NL();
					Text.Add("Nevertheless, you quickly discover why Alaric was mouthing words instead of speaking directly. Following his gaze, you turn to see a thin, lanky man standing at the far end of the room, applying the contents of a vial onto the cruel barbs of the whip he’s brandishing, no doubt the same weapon that’s been used on Alaric.", parse);
					Text.NL();
					
					var humanity = player.Humanity();
					
					parse["h"] = humanity > 0.95 ? ", not to mention a beast-lover, too" : "";
					
					Text.Add("<i>“Hello, my lovelies,”</i> he says in a little sing-song voice, turning to face you, his eyes bloodshot, a cheeky grin plastered onto his face. You note that the same green slime that was on Alaric and the whip is also plastered all over his exposed lower half, beads of pre dripping from his veined, throbbing dick. An aphrodisiac? The slime has seeped into the top of the Royal Guard uniform he has on, so you have little doubt that whatever the effects of this stuff, he’s gotten a strong dose of it, and his unfocused gaze only serves to confirm your suspicions. <i>“Come to share in my private stash of Gol venom? Preston told me to expect trouble on the road tonight, but I wasn’t expecting furbag scum to come straight to my doorstep[h]! Never mind, though, I’ve enough venom for everyone, even if it did cost me a pretty penny! Seems like I’ll have to whip the guards for letting you in here, though. They’re all very naughty boys, like our friend here.”</i> He cracks the whip in Alaric’s direction.", parse);
					Text.NL();
					
					parse["g"] = burrows.flags["Access"] < Burrows.AccessFlags.Stage5 ? ", from what you've heard" : "";
					Text.Add("Gol venom. Yes[g], that would certainly intoxicate - and arouse - the bastard into the crazed state he’s currently in.", parse);
					Text.NL();
					Text.Add("Cveta looks unimpressed. <i>“You filthy degenerate. How does even a man like Preston stand having you around?”</i>", parse);
					Text.NL();
					Text.Add("<i>“How does he, indeed? Simple: I get the job done, and ask no inconvenient questions, something our friend here-”</i> he cracks the whip again, sending Alaric cringing <i>“-apparently couldn’t do. Oh, but where are my manners? I am Lieutenant Corishev, and I oversee discipline amongst the Royal Guard; there are so many bad boys and girls who need the naughtiness beaten out of them these days, so I’ve had to work double-time. Now that we’ve been introduced, can we get down to business? I’ve planned a public flogging in the merchant’s square tomorrow, and all it needs to be perfect is for a furbag or two to be guests of honor at the event!”</i>", parse);
					Text.NL();
					Text.Add("With that, the perverse officer advances upon you.", parse);
					Text.NL();
					Text.Add("It’s a fight!", parse);
					Text.Flush();
					
					Gui.NextPrompt(function() {
						var enemy = new Party();
						var corishev = new Corishev();
						enemy.AddMember(corishev);
						var enc = new Encounter(enemy);
						
						enc.corishev = corishev;
						
						enc.canRun = false;
						enc.onLoss = BullTowerScenes.CorishevLoss;
						enc.onVictory = BullTowerScenes.CorishevWin;
						
						enc.Start();
					});
				});
			}, enabled : true,
			tooltip : "Well, this is it, then. Time to do what you came here for."
		});
		Gui.SetButtonsFromList(options, false, null);
	}
}

BullTowerScenes.CorishevLoss = function() {
	var enc  = this;
	SetGameState(GameState.Event, Gui);
	
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Despite success being right before your eyes, you’re quickly realizing why the Royal Guards are so terrified of Corishev’s whip. It’s not only the force of the blows or the barbs on the whip that make this so difficult. The venom makes it hard to think about anything other than sweet, sweet sex, which in turn allows him to land more blows on you, letting more venom mingle with your blood…", parse);
	Text.NL();
	Text.Add("As hard as it is to admit, you’re losing. It’s getting harder to concentrate, and you can feel your strength starting to flag; it’s best to beat a tactical retreat while you can and avoid ending up in irons alongside Alaric.", parse);
	Text.NL();
	Text.Add("You croak out an apology as you start a fighting retreat towards the door behind you, Cveta doing her best to cover your back. Alaric goes wide-eyed as he realizes his would-be saviors are abandoning him, and struggles against his chains.", parse);
	Text.NL();
	Text.Add("<i>“Don’t leave me here! ”</i> he cries.", parse);
	Text.NL();
	Text.Add("<i>“Where are you going, would-be heroes?”</i> Judging by Corishev’s maniacal giggling and the lewd undertones of his voice, it’s clear that he’s completely intoxicated by all the Gol venom he’s smeared on himself. The orgulous sight of him jacking off to your escape is enough to make Cveta’s face crumple in disgust. <i>“Come back! You forgot your damsel in distress!”</i>", parse);
	Text.NL();
	Text.Add("Trying your best to shut the sounds coming from behind you out of your mind, you throw open the door and fly up the stairs as quickly as your legs will carry you. The lieutenant doesn’t seem to be pursuing you - the reason for which soon becomes clear when the alarm sounds throughout the entirety of the ancient fortress. Seems like he’s leaving the chore of hunting you down to his underlings.", parse);
	Text.NL();
	BullTowerScenes.EndingFailure();
}

BullTowerScenes.CorishevWin = function() {
	var enc  = this;
	var corishev = enc.corishev;
	SetGameState(GameState.Event, Gui);
	
	var parse = {
		playername : player.name
	};
	
	outlaws.flags["BT"] |= Outlaws.BullTower.AlaricFreed;
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("That last blow did the trick. Still grinning madly - whether it’s the venom, or whether he’s just plain unhinged by now is anyone’s guess - Corishev staggers backward a few steps, perhaps to give himself a little breathing space. His wide, maniacal gaze darts this way and that, his breathing labored as you advance on him. Too bad there’s nowhere for him to run.", parse);
		Text.NL();
		Text.Add("<i>“Kids these days. Beaten by… a couple of young punks…”</i>", parse);
		Text.NL();
		parse["w"] = player.Weapon() ? "the blunt end of your weapon" : "your fist";
		Text.Add("Ducking under a desperate overhead lash, you slip within his guard and land a solid blow to his head with [w]. Giggling, he doesn’t seem to notice it at first, then the force of your blow finally registers and he crumples to the ground like a folded reed, his barbed whip falling out of his grasp and clattering on the floor. With a twitch, his cock ejects one last spurt of cum, a whitish streak mixing with the sweat and blood on the floor, then goes as limp as the rest of him.", parse);
		Text.NL();
		Text.Add("<i>“Very fitting,”</i> Cveta remarks dryly at the sight, doing her best to avoid stepping in any of the mess.", parse);
		Text.NL();
		Text.Add("<i>“Finally.”</i> Alaric’s been so quiet throughout the whole fight that you’d almost forgotten he was there. He pauses to catch his breath, summoning the strength to speak properly. <i>“Could you get me out of here? He’s got the keys in his pants - they’re hanging over by the door.”</i>", parse);
		Text.NL();
		Text.Add("Wasting no time, you tiptoe around the fallen lieutenant and reach for the pants Alaric mentioned. Searching the pockets unearths an empty coin purse, several vials of clear green liquid you try not to look at too closely, and a large iron keyring from which several keys hang. With the keys, it’s a small matter to unlock the chains and cuffs that hold Alaric in place, and he collapses to the ground, groaning.", parse);
		Text.NL();
		parse["m"] = player.mfFem("Mister", "Miss");
		Text.Add("<i>“Ow. Ow. Ow. Fucking. Ow. Thank you, um, [m]…?”<i/>", parse);
		Text.NL();
		Text.Add("You nod, and tell him your name.", parse);
		Text.NL();
		Text.Add("<i>“Right. Thank you, then, [m] [playername], and -”</i>", parse);
		Text.NL();
		Text.Add("<i>“My name is Cveta.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Cveta, then. I’m Alaric. For the record, I didn’t embezzle anything. In fact, the Royal Guards have been taking payoffs from anyone and everyone who has connections to turn a blind eye to tax evasion on imports! They’re keeping the money up top in a trapped safe - I overheard the lieutenant talking to one of his men about it - and the key should be on his keyring-”", parse);
		Text.NL();
		Text.Add("<i>“You do not need to prove your innocence to us, Alaric,”</i> Cveta replies. <i>“We know who you are, and were specifically sent to get you. Do you think you can walk?”</i>", parse);
		Text.NL();
		Text.Add("Alaric tries to rise, grimacing and wincing, then staggers back onto his knees. <i>“No. But I’m going to have to do it anyway, aren’t I? I’ll just have to walk it off,”</i> he replies with a forced laugh. <i>“I guess that’s enough for introductions and thanks - can we please get out of here before the crazy bastard comes to?”</i>", parse);
		Text.Flush();
		
		//[Fuck][Leave]
		var options = new Array();
		options.push({ nameStr : "Fuck",
			func : function() {
				Text.Clear();
				Text.Add("Just a minute, you tell Alaric. There’s some unfinished business you have to take care of - if Cveta would be kind enough to help him out? You’ll catch up with them in a moment.", parse);
				Text.NL();
				Text.Add("Cveta gives you an odd look, but agrees and helps Alaric to his feet. It takes her a little effort, considering her slight stature, but the songstress eventually gets a firm grip under Alaric’s arm and begins hefting him out of the cell and up the stairs.", parse);
				Text.NL();
				Text.Add("Now that you’re alone, you look down at the lieutenant. The bastard is still largely out cold, save for the occasional twitch and groan, and you’re certain that between the Gol venom and having the wind knocked out of him, he’s not going to put up much of a fight for what you have in mind for him.", parse);
				Text.NL();
				Text.Add("Come to think of it, what <i>did</i> you have in mind?", parse);
				Text.Flush();
				
				BullTowerScenes.CorishevFuck(corishev);
			}, enabled : true,
			tooltip : "The bastard lieutenant sure can dish it out; let’s see how well he can take it."
		});
		options.push({ nameStr : "Leave",
			func : function() {
				Text.Clear();
				Text.Add("You find yourself in total agreement with the little bean counter. Not wishing to spend one moment longer in the cell, you help Alaric to his feet, you and Cveta each grabbing him under a shoulder and lifting. Before stepping onto the stairs, you relieve the lieutenant of his venom-coated whip, which could make a good weapon. The little bean-counter is still bleeding from his lashes, but he summons the strength to keep pace with both of you. Together, the three of you hobble up the steps and to the main hall, but not before you lock the cell door with the keys you found. On the off-chance that the lieutenant comes to before dawn, he can stew there until his underlings come and get him out.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					MoveToLocation(BullTowerLoc.Building.Hall, {minute: 5});
				});
			}, enabled : true,
			tooltip : "Get out of here before things get any worse."
		});
		Gui.SetButtonsFromList(options, false, null);
	});
	Encounter.prototype.onVictory.call(enc);
}

BullTowerScenes.CorishevImpregnate = function(mother, father, slot) {
	mother.PregHandler().Impregnate({
		slot   : slot || PregnancyHandler.Slot.Vag,
		mother : mother,
		father : father,
		race   : Race.Human,
		num    : 1,
		time   : 30 * 24,
		load   : 2
	});
}

BullTowerScenes.CorishevFuck = function(corishev) {
	var p1cock = player.BiggestCock(null, true);
	
	var parse = {
		playername : player.name,
		lowerarmordesc : function() { return player.LowerArmorDesc(); }
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	
	//[Whip][Ride][Anal][Reconsider]
	var options = new Array();
	options.push({ nameStr : "Whip",
		func : function() {
			Text.Clear();
			Text.Add("An evil grin spreads across your lips as you reach down and pick up the lieutenant’s whip from the floor. While it looks quite nice as it is, you carefully pick off the barbs - you don’t want to kill the twisted bastard, as much as he deserves it, just bleed and humiliate him a little. It’s still got a thick coat of aphrodisiac venom on it, but you reach over for the vials you discovered and give the whip a second coating until it’s practically dripping with the stuff. Taking a step back to admire your handiwork, you shake your head at the poetic justice of the lieutenant becoming victim to the very same methods with which he tormented others.", parse);
			Text.NL();
			Text.Add("Well, time to administer justice. Lots and lots of justice. A good flick of your wrist sends the length of leather sailing through the air to land squarely on Corishev’s exposed ass. Droplets of viscous venom sail into the air as the coating on the whip’s length splatters, some of it landing on you. Oh well - you aren’t about to let it diminish your satisfaction at seeing a thin red welt rise up on his pale peaches. Pulling your arm back for a second stroke, you let loose with all your might, and by some quirk of fate or good fortune, the second lash lands in almost the same spot as the first.", parse);
			Text.NL();
			Text.Add("This one’s strong enough to cut through the lieutenant’s unconscious state, the bastard instinctively twitching and moaning at the pain, the original welt turning an angry red and beginning to seep blood. Wait, moaning? Then again, he was already pretty much hopped up on Gol venom when you came in. As you watch, his flaccid cock twitches as it pushes against the slick stone floor; you roll him over with a foot, and once given enough space, it stands at full mast, just begging to be used.", parse);
			Text.NL();
			Text.Add("Well. If he’s <i>enjoying</i> it…", parse);
			Text.NL();
			Text.Add("You’re feeling a little lightheaded yourself - maybe it’s the venom in the air? Can it be inhaled, or did some of it get onto you? Then again, who cares? Stifling the impulse to laugh, you let swing zealously with the whip, the whoosh of it traveling through the air, the crack of leather against skin music to your ears. Corishev accompanies it with grunts and moans, squirming in the mixture of sweat, blood and cum that covers the floor. The overdose of Gol venom has pretty much short-circuited his senses by now, turning pain and pleasure into one.", parse);
			Text.NL();
			parse["la"] = player.LowerArmor() ? Text.Parse(" rip off your [lowerarmordesc] and", parse) : "";
			Text.Add("You judge him guilty as charged on all counts! Of corruption! - a swipe, a lash, a splatter of viscous, cum-like venom. Of unlawful abduction! - you’re finding it hard not to giggle with glee, the weight of the whip’s handle the centre of your world. Of conspiracy against the good name of the crown! - the smell of the potent mixture rising from the floor is almost too much to bear now. Barely hesitating, you[la] begin to openly fondle yourself, ", parse);
			if(player.FirstCock() && player.FirstVag())
				Text.Add("alternating your free hand between both your [cocks] and [vag], sticky fluids dribbling down and adding to the mess on the floor as you try to get all the pleasure you can out of the strange situation.", parse);
			else if(player.FirstCock())
				Text.Add("jerking off your [cocks], pumping away at your shaft[s] furiously with your free hand.", parse);
			else
				Text.Add("fingering yourself at the sight of justice being dealt, girl-honey running down from your [vag], onto your fingers and into the palm of your free hand, making it nice and slick.", parse);
			Text.NL();
			Text.Add("Whip it! Whip it good! A misaimed blow rips apart the shirt of Corishev’s Royal Guard uniform, but you’re not too concerned. It’s sort of hard to aim with one hand, especially when you’re trying to get yourself off with the other. Too weak, dazed, or lustful - probably a combination of all three - to form any intelligible words at the tender ministrations of the whip, the lieutenant writhes and wriggles between moans and pants, beads of precum dribbling from the tip of his cock. He thrusts at the air feebly with his hips, grinding away at some invisible mate.", parse);
			Text.NL();
			Text.Add("Pain is pleasure, and pleasure is yet even more pleasure. And from the looks of it, justice is pleasure, too, which is a good thing for you. Criminals have got to be punished, after all, and doubly so if the crime is being a hypocritical bastard. By now, the whip is just an extension of your body. You move your hand just like <i>this</i>, and its very tip coils about the lieutenant’s raging erection like some kind of prehensile vine or tentacle, still infused with more than enough of the potent venom to do its work. The Gol venom seeps through skin and flesh, and you flash a triumphant smile as Corishev bucks against empty air, his member bulging and twitching against its restraints. Slowly, you ease the whip so that it unwinds like a snake climbing a tree - venom, venom everywhere - and the moment it slides off, you bring it down again onto his now tattered and torn uniform with everything you’ve got.", parse);
			Text.NL();
			Text.Add("It’s too much for the poor bastard to bear. With a cry of pleasure-pain, Corishev orgasms, an arc of cum shooting from the debased lieutenant’s coated cock to splatter on his legs and the floor. Despite all the fluids mixed in the mess, the only thing you can smell right now is Gol venom - a heady, heavy smell that feels synonymous with sex.", parse);
			Text.NL();
			
			var gen = "";
			if(player.FirstCock()) gen += "[cocks]";
			if(player.FirstCock() && player.FirstVag()) gen += " and ";
			if(player.FirstVag()) gen += "[vag]";
			parse["gen"] = Text.Parse(gen, parse);
			
			if(player.FirstCock() && player.FirstVag())
				parse["gen2"] = "working both sets of your equipment";
			else if(player.FirstCock())
				parse["gen2"] = "jerking yourself off";
			else
				parse["gen2"] = "fingering yourself";
			
			Text.Add("You aren’t done yet, though, and you decide there’s no need to feel remorse about it; this is what he’d have done to Alaric in the end, and it’s only right that he get a taste of his own medicine. Standing over the lieutenant, you let the whip fall to the ground and focus your attentions on your [gen], a trickle of drool hanging from your open mouth as you work yourself into a frenzy [gen2].", parse);
			Text.NL();
			
			var cum = player.OrgasmCum(2);
			
			Text.Add("It’s not long before you simply can’t hold back any more; with a groan that sets your knees trembling, you unload ", parse);
			if(player.FirstCock()) {
				if(cum > 4)
					Text.Add("a veritable torrent of nice, hot cum from your [cocks] onto the dazed lieutenant. There’s so much of it, more than enough to completely soak his tattered and torn uniform and give him a good glazing. String upon string of thick, ropy seed spurts from your [cockTip][s] in a seemingly never-ending cascade, an impossibly long orgasm helped along by all the Gol venom in the air and on your skin.", parse);
				else
					Text.Add("burst after burst of cum from your [cockTip][s] onto the dazed lieutenant, strings of your seed arcing through the air and splattering on him in the most ignoble fashion. Moaning, eyes unfocused, you jack off furiously, coaxing every last drop of seed out of your [balls] and onto Corishev.", parse);
				if(player.FirstVag()) {
					Text.NL();
					Text.Add("While your [cocks] may have had enough, the rest of your body is far from done, though. The sheer strength of the venom-assisted orgasm causes your [vag] to clench tightly about your fingers. An orgiastic spray of your girl-cum squirts from from your [vag], honey mixing in with the mess of cum your cock created.", parse);
				}
			}
			else {
				Text.Add("plentiful squirts of girl-cum from your [vag] onto the dazed lieutenant, panting in pleasure as you unload your honey onto him in a glistening sheen. Desperately fingering yourself until there’s nothing left, you shudder at the exquisite sensations of the last few warm trickles running down your thighs and down to your calves.", parse);
			}
			Text.NL();
			Text.Add("Well. That should quite thoroughly humiliate Preston’s lapdog. Doing your best - which, admittedly, isn’t very good - to clean yourself up, you get up on shaky feet and hurriedly dress yourself, trying to hide the worst of the cum stains. Once you’re certain you’re not going to slip on the slick floor, you stash the venom-coated whip with the rest of your belongings and hobble up the stairs to catch up with Cveta and Alaric, but not before locking the cell door behind you. Corishev will certainly be an interesting sight for his men when they get the door open and find him.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(BullTowerLoc.Building.Hall, {minute: 20});
			});
		}, enabled : true,
		tooltip : "Whip him. Whip him good."
	});
	parse["gen"] = player.FirstVag() ? "pussy" : "ass";
	options.push({ nameStr : "Ride",
		func : function() {
			Text.Clear();
			Text.Add("The sight of the lieutenant’s limp prick gives you an idea. Sure, it’s pretty dead at the moment, but with all that Gol venom on it getting the little soldier to stand to attention shouldn’t be too hard. Your suspicions are confirmed when you reach down and get a firm hold on his flaccid prick - a few strokes are all it takes to have it up and ready, as thick and vital as it was when you entered the cell.", parse);
			Text.NL();
			
			var pussy = player.FirstVag();
			if(pussy)
				parse["gen"] = Text.Parse("wet folds into your [vag]", parse);
			else
				parse["gen"] = Text.Parse("[anus]", parse);
			
			Text.Add("Perfect. Still not quite coherent, Corishev tries to fend you off with a weak flail of his arm, but you easily knock it away and lower yourself on top of him. Gripping his shoulders as you straddle him, you steady yourself and pin him down in one easy movement. Having positioned yourself, you’re ready now - with one violent movement, you let yourself drop, impaling yourself onto his veined, venom-slick shaft and feeling him push past your [gen].", parse);
			Text.NL();
			
			if(pussy) {
				Sex.Vaginal(corishev, player);
				player.FuckVag(player.FirstVag(), corishev.FirstCock(), 4);
				corishev.Fuck(corishev.FirstCock(), 4);
				
				BullTowerScenes.CorishevImpregnate(player, corishev, PregnancyHandler.Slot.Vag);
			}
			else {
				Sex.Anal(corishev, player);
				player.FuckAnal(player.Butt(), corishev.FirstCock(), 4);
				corishev.Fuck(corishev.FirstCock(), 4);
				
				BullTowerScenes.CorishevImpregnate(player, corishev, PregnancyHandler.Slot.Butt);
			}
			
			parse["target"] = Text.Parse(pussy ? "[vag]" : "[anus]", parse);
			
			Text.Add("Once he’s hilted to the base inside you, flashes of warmth creeping into your [target]’s inner walls as the Gol venom works its magic, you shift your weight forward and begin to ride his shaft roughly. As if eager to make sure that your fun isn’t spoiled halfway, your [target] grips his member tightly, ensuring that he isn’t going to be escaping anytime soon.", parse);
			Text.NL();
			Text.Add("Not that he intends to, of course. There’s not much behind those fogged eyes of his, but the lieutenant’s body responds eagerly enough to the rough, dominant fucking you’re giving him. Your grip on his shoulders tightens to the point that your knuckles are growing white. Corishev moans and struggles underneath you, the occasional crazed giggle slipping through his teeth as you administer a good heap of fucking justice upon him. There’s a certain thrill to fucking an intoxicated madman - perhaps due to the sheer danger of it all - that only makes things more exciting, and the venom encroaching upon your senses only serves to inflame that insane desire even further.", parse);
			Text.NL();
			Text.Add("Harder and faster you work your humiliated fucktoy, slamming your hips down on on his cock even as he instinctively rises to meet you, the pace of the grinding and slurping only quickening as sparks of pleasure erupt from the motions to send electric tingles down your spine. Perhaps remembering that he’s supposed to be trying to stop you, Corishev attempts to swat you off him from time to time, but you simply grin and quash his pathetic attempts to unseat you with ease. You give the bastard a good shaking by the shoulders and ask him how it feels to be utterly helpless and at the mercy of someone else who’s giving him a good thorough fucking.", parse);
			Text.NL();
			Text.Add("The only response you get is a shudder and moan as the lieutenant’s member throbs inside you, alternating between swelling and clenching as he nears his peak. Fuck that, can’t he last longer than two minutes? You’re not even halfway done! Unfortunately for you, Corishev picks that very moment to explode inside you, filling your [target] with meagre gobs of hot seed, barely enough to trickle out about the seal joining the two of you. Snarling, you keep pounding away mercilessly, the ground beneath the two of you squelching with your effort, but it seems like he’s all spent. Even with the venom aiding him, the lieutenant is softening rapidly inside you, leaving you feeling very much unsatisfied.", parse);
			Text.NL();
			parse["la"] = player.LowerArmor() ? Text.Parse(" and pull on your [lowerarmordesc]", parse) : "";
			Text.Add("This is the best of Preston’s men, an idiot who can’t even last five minutes? Having fucked your fucktoy senseless, you sniff disdainfully at his form sprawled out in the midst of the sticky, slimy mess on the cell floor. Levering yourself off the unconscious Corishev, you clean yourself as best you can[la] before heading for the door, picking up the dropped whip on the way. Hey, at least it might be a little more useful than this loser here. Taking a moment to lock the cell door behind you - best to make sure he stays in there until the rest of the guards have a chance to find him - you hurry along to catch up with Cveta and Alaric, hoping they didn’t miss you too much while you were gone.", parse);
			
			player.AddLustFraction(0.5);
			
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(BullTowerLoc.Building.Hall, {minute: 20});
			});
		}, enabled : true,
		tooltip : Text.Parse("Ride Corishev’s Cock with your [gen] and show him who’s boss.", parse)
	});
	options.push({ nameStr : "Anal",
		func : function() {
			var strapon = p1cock.isStrapon;
			
			Text.Clear();
			parse["c"] = Text.Parse(strapon ? "pull out and affix your strap-on, knowing that your toy will be more than enough to get the job done with maximal efficiency" : "whip out your package, feeling the venom do its work as your [cocks] swell[notS] and stiffen[notS] with alarming rapidity, internal pressure building up in your ramming rod", parse);
			parse["c2"] = player.NumCocks() > 1 ? " the biggest of your cocks" : "";
			Text.Add("A mad grin splitting your face from ear to ear, you grab Corishev roughly by the shoulders and flip him over, forcing him on his hands and knees, ass high in the air and presented nicely to you. He tries to fight you off, but to no avail, as you easily overpower him in his defeated state. Since he’s so used to giving, let’s see how good he is at receiving. With great gusto, you [c]. The lieutenant half-snarls, half-giggles, squirming in your grasp as he dimly realizes through his drug-fogged mind what’s about to happen, but you keep a firm hold on his thin, bony ass and thrust[c2] into him without so much as a second thought.", parse);
			Text.NL();
			parse["knot"] = p1cock.Knot() ? ", especially with all the whimpering and whining when you force your knot into him, its prodigious bulge grinding against his entrance" : "";
			Text.Add("Corishev is a tight fit - he yelps and growls wordlessly as you begin to pound his pucker rhythmically; you can’t help but wonder if that ass of his was virginal[knot]. All the more humiliating for him, then - you had thought that if he’s so into power games, he would have tried being on the receiving end as well. You had planned to start slow, but maybe it’s best to make it fast and hard, break him into it a little more quickly. Giving the lieutenant’s ass a good smack that leaves your palm stinging and a growing red mark on his rump, you grin and tell him in no uncertain terms how you’re going to very thoroughly use his hole even harder than you are doing already. His ass walls clench about your shaft as he wriggles, trying to escape your vicious thrusts, but you’re expecting it by now and pull him back.", parse);
			Text.NL();
			parse["c"] = player.NumCocks() > 1 ? Text.Parse(", your other cock[s2] waving about and leaking pre like some ecstatic tentacled monster", parse) : "";
			Text.Add("Just for that, you’re going to teach him even more of a lesson. Groping about on his skin for a good hold, you redouble your efforts, violating the lieutenant as best your [cock] will allow[c]. Corishev howls and yips like a mad dog at the repeated and forceful intrusions of your magnificent member, his protests growing even more forceful as you reach between his legs to jerk off his stiff cock. You touch gently at first, caressing the veins and glans with your fingertips, but before long you’ve grasped the shaft in your palm and are yanking away in tandem with the pounding you’re giving his ass.", parse);
			Text.NL();
			parse["c"] = strapon ? "elicit a moan of pleasure-pain from the lieutenant" : "cum over and over again into his bowels";
			parse["c2"] = player.NumCocks() > 1 ? Text.Parse(", your other cock[s2] spraying seed all over him to drip off and mix in with the mess on the floor", parse) : "";
			parse["knot"] = p1cock.Knot() ? " and knot" : "";
			Text.Add("It seems doubtful that he can take much more, and to be frank, neither can you. With a final, hard thrust, you [c][c2]. Corishev’s rectum instinctively clenches down hard about your shaft[knot], his cock simultaneously expelling the remainder of his seed. Satisfied that you’ve taught the bastard a lesson in humility, you begin the arduous task of retrieving your shaft from his ass, letting him slump off you and into the puddle of sexual fluids on the floor.", parse);
			Text.NL();
			
			var cum = player.OrgasmCum();
			
			parse["la"] = player.LowerArmor() ? Text.Parse(", don your [lowerarmordesc]", parse) : "";
			Text.Add("Finally, done! You clean yourself up as best you can[la] and head for the exit, stopping along the way to pick up Corishev’s whip, still on the floor where it had been dropped. Taking care, you lock the cell behind you - best to make sure he stays in there until the rest of the guards have a chance to find him - and hurry to rejoin Cveta and Alaric. Hopefully you haven’t taken too long in administering that much-needed dose of discipline.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(BullTowerLoc.Building.Hall, {minute: 20});
			});
		}, enabled : p1cock,
		tooltip : Text.Parse("Fuck that ass of his with your [cocks].", parse)
	});
	options.push({ nameStr : "Reconsider",
		func : function() {
			Text.Clear();
			Text.Add("Looking down at the defeated lieutenant, you shake your head. What were you thinking, wasting precious time on this? Turning heel on the scene, you stop on the way to pick up Corishev’s whip - it might be useful as a weapon - and lock the cell door behind you with the keys you found. Hopefully it’ll keep him from raising the alarm if he comes around too quickly.", parse);
			Text.NL();
			Text.Add("With that done, you hurry up the steps to rejoin Cveta and Alaric in the main hall.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(BullTowerLoc.Building.Hall, {minute: 5});
			});
		}, enabled : true,
		tooltip : "Nah, now’s not the time to be doing this."
	});
	Gui.SetButtonsFromList(options, false, null);
}


BullTowerLoc.Building.Office.description = function() {
	
	var parse = {
		t : terry.Recruited() ? ", perhaps so well that even Terry would find it quite the challenge" : ""
	};
	
	Text.Add("There’s no sign of what this room used to be, but what it is right now is a small office. As devoid of embellishments as the main hall, this small, musty room is adorned with a serviceable desk and chair, as well as a chest of drawers leaning against the wall; searching through the latter only turns up a number of carefully-wrapped quill pens, inkwells, and blank pieces of paper. The Royal Guard may do their paperwork here, but it’s clear that they’re smart enough to not leave incriminating evidence lying about for anyone passing by to swipe.", parse);
	Text.NL();
	Text.Add("The only other interesting detail in this room is a rather impressive-looking safe set into the wall, probably intended to be hidden behind a painting or somesuch. ", parse);
	if(outlaws.flags["BT"] & Outlaws.BullTower.SafeLooted)
		Text.Add("Now that you’ve defeated the trap and looted the safe’s contents, it lies open, the door hanging forlornly open in the air. There’s not much point in closing it to disguise that you were here - by the time the sun comes up, the fact that someone was in the tower grounds is going to be common knowledge.", parse);
	else
		Text.Add("At first glance, the safe looks very well crafted[t]. You’ll have to get closer in order to inspect it in the dim light, though.", parse);
}

BullTowerLoc.Building.Office.links.push(new Link(
	"Hall", true, true,
	null,
	function() {
		MoveToLocation(BullTowerLoc.Building.Hall, {minute: 5});
		outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
	}
));

BullTowerLoc.Building.Office.events.push(new Link(
	"Safe", function() {
		return !(outlaws.flags["BT"] & Outlaws.BullTower.SafeLooted);
	}, true,
	null,
	function() {
		var parse = {
			
		};
		
		Text.Clear();
		Text.Add("Gingerly, you step toward the wall safe, half-expecting a couple of guards to burst in through the entrance behind you, but thankfully nothing of the sort happens. Well, what will you do?", parse);
		Text.Flush();
		
		BullTowerScenes.SafePrompt();
	}
));

BullTowerScenes.SafePrompt = function() {
	var parse = {
		playername : player.name
	};
	
	//[Inspect][Unlock][Disarm][Fake Out][Leave]
	var options = new Array();
	options.push({ nameStr : "Inspect",
		func : function() {
			Text.Clear();
			Text.Add("Leaning closer in the dim light, you take a closer look at the safe and its mechanisms. About the size of a bedside stand, it’s newer than the masonry that surrounds it, having yet to gain the coat of tarnish or rust that covers most of the metal objects remaining in the tower. Rapping on the solid steel door with your knuckles fails to produce a hollow sound - it’s unlikely you’ll be able to break into it by brute force, then.", parse);
			Text.NL();
			parse["t"] = Jobs.Rogue.Master(player) ? "you know enough about thieving to know that this workmanship is beyond your abilities. Something really important must be stowed away in there" : terry.Recruited() ? "perhaps if Terry were here, the thief would be able to make some sense of this, but you definitely can’t" : "most likely beyond your abilities to pick";
			Text.Add("Set in the side of the safe’s door is a small, intricate keyhole - [t]. One thing’s certain: you’re not getting inside without the key. You wonder what the guards have in here that warrants such security… Just under the safe itself, framed by steel, is a thin slot at about thigh height - an obvious trap to make would-be thieves think twice about attempting to crack the safe.", parse);
			Text.NL();
			Text.Add("You look to Cveta to see if she has anything to say, but the songstress simply shakes her head. Should have expected as much - it’s not her area of expertise. Well, looks like it’s up to you to try and figure this one out.", parse);
			Text.Flush();
			outlaws.BT.inspectedSafe = true;
			
			BullTowerScenes.SafePrompt();
		}, enabled : true,
		tooltip : "Inspect the safe in detail."
	});
	if(outlaws.BT.inspectedSafe && !outlaws.BT.unlockedSafe) {
		if(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed) {
			options.push({ nameStr : "Unlock",
				func : function() {
					Text.Clear();
					Text.Add("Could it be? Is it? Steadying yourself, you take out the key you picked off the lecherous lieutenant and push it into the keyhole. It’s a perfect fit, the tumblers slide smoothly, and there’s an audible click from within as the latch moves. Unfortunately, there’s also a click from the slot beneath you, something sliding into place and poised to spring once triggered.", parse);
					Text.NL();
					Text.Add("<i>“Well, looks like I wasn’t wrong,”</i> Alaric mumbles from behind you, forcing a grin despite his pained expression. <i>“Watch out, though, [playername]. There’s still the trap to deal with, and I’ve no idea how to prevent it from triggering once you open the door.”</i>", parse);
					Text.Flush();
					outlaws.BT.unlockedSafe = true;
					
					BullTowerScenes.SafePrompt();
				}, enabled : true,
				tooltip : "Open the safe with the key you acquired from the lieutenant."
			});
		}
	}
	if(outlaws.BT.unlockedSafe && !(outlaws.flags["BT"] & Outlaws.BullTower.SafeLooted)) {
		options.push({ nameStr : "Disarm",
			func : function() {
				Text.Clear();
				Text.Add("Crouching down so you’re level with the slot, you do your best to take stock of the workings of the trap. Both Cveta and Alaric stand a healthy distance back as you begin to work, the latter looking distinctly nervous as you begin your fiddling.", parse);
				Text.NL();
				Text.Add("<i>“Be careful, friend.”</i>", parse);
				Text.NL();
				Text.Add("As if you needed telling. After some inspection, you’re fairly certain that this indeed is a spring-loaded blade trap, which would explain the second click you heard when unlocking the safe; the blade is designed to whip out in an arc when released, slash the would-be thief opening the safe door across the thighs, then retreat into the slot once more. As for options… you <b>could</b> try taking apart the frame that surrounds the slot and try to see if you can disarm the mechanism inside - it’s the only obvious way you could get at the trap’s inner workings, anyway. Standing, you briefly explain your findings to Cveta and Alaric.", parse);
				Text.NL();
				Text.Add("<i>“Are you sure you want to risk this, [playername]?”</i> the songstress whispers. <i>“If you are incapacitated here…”</i>", parse);
				Text.NL();
				Text.Add("Yes, you’re willing to risk this, and tell her as much. Cveta tilts her head at your words, but says nothing and steps back to watch as you kneel once more and begin your work in earnest.", parse);
				Text.NL();
				
				var check = (player.Int() + player.Dex())/2 + Math.random() * 20;
				check += player.jobs['Rogue'].level * 5;
				
				if(GetDEBUG()) {
					Text.Add("Int/Dex check (with bonuses for Rogue levels): [check] vs 80", {check: check}, 'bold');
					Text.NL();
				}
				
				if(check >= 80) {
					Text.Add("Loosening the screws on the frame with a small knife Cveta provides, you carefully ease it off the wall, widening the slot considerably. You suspected that both safe and trap weren’t here when the tower was first built, and the rectangular recess that’s been revealed makes it all but certain.", parse);
					Text.NL();
					if(Jobs.Rogue.Master(player))
						Text.Add("Your mastery of rogue skills serves you well here. ", parse);
					Text.Add("You get as close a look at the trap as you dare. Even though you can see both spring and blade glinting in the dark recess, you still have no idea how long their reach is - you study the mechanisms before making your move. It’s a surprisingly simple system; opening the safe releases a catch which allows the springs holding the blade in place to whip outward. There’s also a deadbolt that prevents the trap from triggering and must be how the lieutenant safely accesses the safe’s contents, but you see no obvious way to set it in place.", parse);
					Text.NL();
					Text.Add("Well, as the saying goes, there’s more than one way to skin a cat. Holding your breath and willing your fingers not to shake, you reach in with your knife and cut away at the springs. The catch looks solid, and so long as it isn’t released, you should be safe… you cut through the springs one at a time, setting them off with audible twangs until you’re sure you’re done and the trap is wholly disarmed.", parse);
					Text.NL();
					
					BullTowerScenes.SafeSuccess();
				}
				else {
					Text.Add("Things don’t go quite as planned, though. You must’ve fumbled somewhere, made a mistake; there’s a glint of light, the faintest of swishing sounds, and sudden, terrible pain flares up on your shoulder and across your collarbone. Just a little higher, and the blade - now wet and glistening with your blood - would have removed your head from your shoulders.", parse);
					Text.NL();
					
					BullTowerScenes.SafeFailure();
				}
			}, enabled : true,
			tooltip : "Attempt to disarm the trap."
		});
		options.push({ nameStr : "Fake Out",
			func : function() {
				Text.Clear();
				Text.Add("You think it better that you don’t actually attempt to disarm the trap and instead set it off safely.", parse);
				Text.NL();
				Text.Add("<i>“How do you intend to do that?”</i> Alaric whispers. <i>“Surely you don’t intend to just dance out of its path?”</i>", parse);
				Text.NL();
				Text.Add("Why, that <i>was</i> what you’d intended, save with a few extra precautions. While the desk is fixed to the floor and can’t be moved, the chair and drawers can - and no matter how sharp this blade is, surely they’d buy you some time at the very least.", parse);
				Text.NL();
				Text.Add("Alaric shakes his head and looks to Cveta, but the songstress has her all-too-familiar dispassionate face on, as readable as a brick wall. With a sigh, the bean-counter takes an unsteady step back. <i>“I’ll trust you to know what you’re doing, [playername]. It would be a horrible turn of fate if you ended up being the one needing rescuing.”</i>", parse);
				Text.NL();
				Text.Add("It’s a risk you’re willing to take, you assure him as you shift the small chest of drawers and chair up against the slot. With how long the slot is, the maximum arc of the blade would be this much, and you guess you’d need to be this far after the trap is sprung…", parse);
				Text.NL();
				Text.Add("Well, you’re as ready as you’ll ever be. Feeling both Cveta and Alaric’s gazes on the back of your neck and the tension building up in your muscles, you grasp the safe’s handle with both hands and heave. There’s a slight resistance which must be the triggering mechanism, a twang of released tension, and then a flash of light as a sharp blade slices through the air and sinks into the old furniture.", parse);
				Text.NL();
				
				var check = player.Dex() + Math.random() * 20;
				check += player.jobs['Rogue'].level * 5;
				
				if(GetDEBUG()) {
					Text.Add("Dex check (with bonuses for Rogue levels): [check] vs 90", {check: check}, 'bold');
					Text.NL();
				}
				
				if(check >= 90) {
					if(Jobs.Rogue.Master(player))
						Text.Add("Your mastery of a rogue’s reflexes comes in handy here. ", parse);
					Text.Add("Although the blade is fast, your movements are faster - by the time it’s cleaved through the dry rot of the old furniture you’ve placed in its path, you’re well out of its range. The drawer and chair were rickety to begin with, and they’re but so many splinters now, the blade having sheared them apart with its passage.", parse);
					Text.NL();
					Text.Add("<i>“Wow,”</i> Alaric says after the dust has settled. <i>“Impressive.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Perhaps, but we should not be wasting time. With the amount of noise this has created and how well sound carries in this place, I am sure someone will be coming to investigate before long. Please, [playername], would you finish opening the safe with all due haste?”</i>", parse);
					Text.NL();
					
					BullTowerScenes.SafeSuccess();
				}
				else {
					Text.Add("Things don’t go quite as planned, though. Weakened with years of neglect and dry rot, the chair and drawers don’t hold up as long as you’d hoped they would, nor are you as quick as you imagined you’d be. Tearing through the old wood in a shower of splinters, the blade flashes in the dim light as it sings through the air, sharp and serrated. Numbness comes first, then pain flares up on your outer thigh just under your hips. You’re vaguely aware through the sudden surge of dizziness that hits you that there’s now blood on the edge of the sprung blade - blood that used to be in your body.", parse);
					Text.NL();
					
					BullTowerScenes.SafeFailure();
				}
			}, enabled : true,
			tooltip : "Attempt to set off the trap safely."
		});
	}
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("Taking one last look at the safe, you shake your head and turn your back on it. You decide to leave the steel-bound thing for later - it’s not as if it’ll be going anywhere should you change your mind, after all.", parse);
		Text.Flush();
		
		Gui.NextPrompt();
	});
}

BullTowerScenes.SafeSuccess = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Add("Wasting no time, you fling open the safe and reach greedily into its recesses. Alaric’s eyes grow wide at the sight of the small fortune stashed inside, and even Cveta is impressed enough to raise an eyebrow. No wonder the guards went to such lengths to secure the safe - and it also explains how Preston managed to afford the statue, amongst other things.", parse);
	Text.NL();
	Text.Add("<i>“We should take these coin bags with us,”</i> Alaric says, grinning weakly. <i>“Shouldn’t leave valuables like that lying around. Someone might…uh, steal them.”</i>", parse);
	Text.NL();
	Text.Add("<i>“If that was a jest, it failed to provoke much amusement on my part,”</i> Cveta replies dryly. <i>“However, I am in agreement that we should purloin the Royal Guard’s ill-gotten gains. It will be valuable evidence that they have been ‘on the take’, as I believe it is called.”</i>", parse);
	Text.NL();
	Text.Add("Even consider leaving the lot after you went to so much trouble to get at it? Perish the thought! The money bags are as heavy as they look, but you’re certain that you can get out with them in tow. Even Alaric, injured as he is, manages to summon up the strength to heft one of the smaller bags over his shoulder.", parse);
	Text.NL();
	Text.Add("Well then. There’s nothing left for you in this room - time to move along before someone thinks to check in on all the noise.", parse);
	Text.NL();
	Text.Add("You loot a few bags of coins from the safe.", parse, 'bold')
	Text.Flush();
	
	outlaws.flags["BT"] |= Outlaws.BullTower.SafeLooted;
	
	Gui.NextPrompt();
}

BullTowerScenes.SafeFailure = function() {
	var parse = {
		playername : player.name,
		heshe : player.mfTrue("he", "she")
	};
	
	Text.Add("With how hard you’re clenching your teeth in a bid not to scream, it’s only through good fortune that you don’t bite off your tongue. Staggering away from the safe, blood seeping into your clothing, you manage to stay upright just long enough for Alaric and Cveta to catch you before you slump to the ground.", parse);
	Text.NL();
	Text.Add("<i>“[playername]! Alaric, your shirt.”</i> Is that Cveta speaking? It probably is, but it’s hard to be completely certain through the warm haze that’s creeping in around your senses. Everything feels lighter, fluffier…", parse);
	Text.NL();
	Text.Add("<i>“Huh?”</i>", parse);
	Text.NL();
	Text.Add("<i>“Your clothing is already mostly rags, and we need to staunch the bleeding. Your shirt, now.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Right!”</i>", parse);
	Text.NL();
	Text.Add("What happens afterward is a bit of a blur. Bursts of pain lance through your consciousness, providing sharp moments of clarity that rapidly sink back into the dull haze that shrouds your mind. Something tight is tied about your wound, staunching the pain a little, and you’re grateful for that. Support comes by way of a gentle pressure under your arms, and you inch forward, one step at a time, seeking the music.", parse);
	Text.NL();
	Text.Add("The music. Where did it come from? Where is it leading you? Such questions melt away into insignificance; the music fills the world, <i>is</i> the world. A small bird of golden orange light flutters on in the darkness, its aura trailing behind it; you do your best to follow the warm melody, your steps faltering but never failing.", parse);
	Text.NL();
	Text.Add("<i>“Is [heshe] going to bleed out? I knew trying to open that safe was a bad idea!”</i>", parse);
	Text.NL();
	Text.Add("<i>“…Hindsight… do not complain… keep moving…”</i>", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		BullTowerScenes.EndingInjured();
	});
}

BullTowerLoc.Building.Warehouse.description = function() {
	Text.Add("This must be where the guards are keeping the contraband until it’s eventually passed on to the high society of Rigard. Stacked in whatever open space is available, the Royal Guard has turned what was once a mess or meeting hall into a makeshift warehouse that’s surprisingly neat and orderly. There’s far too much in the way of ill-gotten gains for it to have come in with a single caravan - this has clearly been going on for some time.");
	Text.NL();
	Text.Add("<i>“I would not be surprised if some of this originated as confiscated property.”</i> Cveta muses. <i>“It is not unknown for confiscated goods to resurface now and again.”</i>");
	Text.NL();
	Text.Add("Wandering amidst the boxes, sacks and barrels - the vast majority of them holding luxury goods of the sort no commoner would have the means to buy, the sort that’s heavily taxed - it’s hard to guess exactly how much in the way of levies is going unpaid on all these.");
	if(!(outlaws.flags["BT"] & Outlaws.BullTower.BlueRoses)) {
		Text.NL();
		Text.Add("There’s even a small potted plant on top of one of the stacks of crates, looking a little unhealthy in the dim room. On closer inspection, it’s a stem cutting of some kind of plant with blue flower buds, and someone’s scrawled ‘Handle carefully! For Preston!’ on the pot in charcoal.");
	}
}

BullTowerLoc.Building.Warehouse.links.push(new Link(
	"Hall", true, true,
	null,
	function() {
		MoveToLocation(BullTowerLoc.Building.Hall, {minute: 5});
		outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
	}
));

BullTowerLoc.Building.Warehouse.events.push(new Link(
	"Contraband", function() {
		return !(outlaws.flags["BT"] & Outlaws.BullTower.ContrabandStolen);
	}, true,
	null,
	function() {
		var parse = {
			
		};
		
		Text.Clear();
		Text.Add("You look at all the crates with their contents clearly marked - finely aged wines, horrendously ostentatious fabrics, bits and bobs of extravagant jewelery are merely commonplace here. The crates are far too large and heavy for you to sneak out with, but you decide to pilfer the most valuable thing you see - a small bag of assorted gemstones the size of your fist, presumably destined to be set into some trinket or gewgaw. Surely the outlaws can use some extra funding, and they should have access to a fence…", parse);
		Text.NL();
		Text.Add("Cveta nods, clearly approving of your decision, but doesn’t pick out anything herself. Stowing away your acquisition with your other possessions, you return your attention to the task at hand.", parse);
		Text.Flush();
		
		outlaws.flags["BT"] |= Outlaws.BullTower.ContrabandStolen;
		
		Gui.NextPrompt();
		outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
	}
));

BullTowerLoc.Building.Warehouse.events.push(new Link(
	"Roses", function() {
		return !(outlaws.flags["BT"] & Outlaws.BullTower.BlueRoses);
	}, true,
	null,
	function() {
		var parse = {
			playername : player.name
		};
		
		Text.Clear();
		Text.Add("You inspect the stem cutting in the pot. While the blue flower buds haven’t bloomed yet, there is nevertheless a faint fragrance rising from the unopened petals, its sweetness just enough to hold the smell of stale air at bay. Whoever brought this in here, while careful, clearly had no idea how to care for a plant like this. It’s not quite dead yet, but it’s begun to wilt. As it is, it’s probably not going to be the showpiece that Preston probably hoped it would be.", parse);
		Text.NL();
		Text.Add("<i>“A pompous pig like Preston does not deserve to have these,”</i> Cveta declares, picking up the wrapped pot. <i>“You do not set treasures before those who will not fully appreciate them.”</i>", parse);
		Text.NL();
		Text.Add("Just what is this, anyway?", parse);
		Text.NL();
		Text.Add("<i>“Blue roses from the lands near the Tree, [playername]. They do not exist in nature, and are the fruit of many generations’ efforts in cultivating the finest blossoms. For Preston to be able to order these…”</i> she thinks a moment. <i>“It is conceivable that he might have done so on his own power, but I would wager that he had a helping hand. These are very rare and expensive, [playername], and furthermore, those who cultivate the plants do not part with them easily. For a Rigardian noble of middling stature like Preston to be in possession of these… if he were to display them in his garden, he would definitely enjoy the admiration of those as shallow as him for a while.”</i>", parse);
		Text.NL();
		Text.Add("Well, that stands to reason. If these are eventually going to end up in the hands of Rigard’s upper crust, then they would be inclined to do some favors for him, wouldn’t they?", parse);
		Text.NL();
		Text.Add("Cveta huffs and nods. <i>“However Preston managed to negotiate their sale, I will wager that he only sees the benefit of elevated status that these blossoms will bring him, and not the link they represent with those who came before us, and in turn, those who will come after our passing. He will not have these.”</i>", parse);
		Text.NL();
		Text.Add("And she will?", parse);
		Text.NL();
		Text.Add("<i>“Mother knew something of horticulture, yes. But now is not the time to get into extended discussions, [playername]. Suffice to say that I intend to take these with me. They do not deserve to wither for the sin of being sold to a brute. Do not worry; I will not be unduly burdened.”</i>", parse);
		Text.Flush();
		
		outlaws.flags["BT"] |= Outlaws.BullTower.BlueRoses;
		
		Gui.NextPrompt();
		outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
	}
));


BullTowerLoc.Building.Watchtower.description = function() {
	Text.Add("From the outside, the ancient watchtower of Bull Tower looks proud and strong in spite of its age. On the inside, it’s just dusty and claustrophobic. The long, spiral staircase up to the top is enough to take the wind out of anyone, and leads to a landing and a ladder that in turn leads up to the belfry. Flickering light filters down from above. A peek upward through the hatch reveals that ");
	if(outlaws.BT.towerGuardDown)
		Text.Add("the lookout you dealt with earlier is still out cold and unlikely to raise the alarm anytime soon.");
	else
		Text.Add("there’s a single guard posted in the watchtower, peering intently into the darkness that lies beyond the walls and certainly not looking for danger coming up from below. All the better for you, then, if you decided to take him out.");
	Text.NL();
	Text.Add("The remainder of the watchtower’s nest is visible from below if you angle yourself properly; the room’s not very big. A few flickering lanterns, an old but comfortable chair, an ancient steel hook from which an enormous bell hangs, complete with striker and clapper. Strictly functional and utilitarian, as it should be.");
}

BullTowerLoc.Building.Watchtower.links.push(new Link(
	"Hall", true, true,
	null,
	function() {
		MoveToLocation(BullTowerLoc.Building.Hall, {minute: 5});
		outlaws.BT.IncSuspicion(100, BullTowerStats.MoveSuspicion);
	}
));

BullTowerLoc.Building.Watchtower.events.push(new Link(
	"Guard", function() {
		return !outlaws.BT.towerGuardDown;
	}, true,
	null,
	function() {
		var parse = {
			
		};
		
		Text.Clear();
		Text.Add("You look up through the hatch at the guard above you. Yes, he’s definitely going to be a problem if you want to investigate the top of the tower in any detail, and considering his proximity to the bell, you’re going to have to take him out quickly - if you decide to actually do so, that is. The poor fellow looks extremely tired, although determined to stay awake, shifting his weight from one foot to the other and taking an occasional swig from a small flask on his belt.", parse);
		Text.NL();
		Text.Add("You think for a moment and weigh the possibilities that come to mind.", parse);
		Text.Flush();
		
		//[Sneak][Lull][Leave]
		var options = new Array();
		options.push({ nameStr : "Sneak",
			func : function() {
				Text.Clear();
				Text.Add("In a low whisper, you explain to Cveta that you’re going to sneak up the ladder and knock out the guard. She nods, and you begin your ascent.", parse);
				Text.NL();
				
				var check = player.Dex() + Math.random() * 20;
				
				if(GetDEBUG()) {
					Text.Add("Dex check, [check] vs 60", {check: check}, 'bold');
					Text.NL();
				}
				if(check >= 60) {
					Text.Add("The ladder might be old and creaky, but your feet are light and your hands nimble, hardly making a sound as you flit from rung to rung. Intently focusing outwards, the guard doesn’t notice the threat from behind until you’ve given him a good thump on the back of his head. With a soft sigh, his eyes roll up and he collapses to the floor in a heap.", parse);
				}
				else {
					Text.Add("However, your feet aren’t as light as you’d hoped. The ladder’s old, and one particularly worn rung creaks underfoot just as you’re almost at the top. Hearing the old wood groan, the guard turns, his eyes growing wide as he sees you and begins reaching for the striker.", parse);
					Text.NL();
					Text.Add("There’s no time to waste. Springing up the last few rungs and into the tower’s nest, you jump-tackle the guard just before he manages to reach the striker, both of you hitting the ground in a cloud of dust. The guard puts up a struggle, and in the tussle a potted plant tumbles from its place beside a window to shatter loudly on a rock below. Despite his resistance, you eventually get the upper hand and knock him out cold with a solid blow to the head.", parse);
					
					outlaws.BT.IncSuspicion(100, 15);
				}
				Text.NL();
				Text.Add("After you’ve dragged the unconscious guard into a corner of the room, you signal to Cveta to come up and join you, which she does, nimbly ascending the ladder. Now that you can search the room uninterrupted, this should be easier.", parse);
				Text.Flush();
				
				outlaws.BT.towerGuardDown = true;
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Sneak up the ladder and knock him out cold."
		});
		options.push({ nameStr : "Lull",
			func : function() {
				Text.Clear();
				Text.Add("As you watch the guard, an idea comes to mind. Since the guard is already struggling to stay awake, it shouldn’t take too much effort to send him to sleep, should it? You tell Cveta as much; the songstress steps back, studies the guard herself, then nods.", parse);
				Text.NL();
				Text.Add("<i>“I agree. It should not be too hard - perhaps Preston will learn to treat his underlings better, but I do not hold out hope for that. Allow me to compose myself, please.”</i>", parse);
				Text.NL();
				Text.Add("Cveta’s small breasts heave as she takes a deep breath, clearing her throat, then she opens her beak and sings. The music speaks to you of soft comfort, of warm blankets and warmer companions - even though you know it’s coming, you can’t help but feel a little drowsy yourself. The guard, though, has no such forewarning - you hear a soft thud from above within the minute. Climbing the ladder and peering around the tower nest, you drag the poor, overworked sop into a corner to sleep it off, then signal down for Cveta to follow you up.", parse);
				Text.Flush();
				
				outlaws.BT.towerGuardDown = true;
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Have Cveta lull the guard to sleep where he stands."
		});
		Gui.SetButtonsFromList(options, true, function() {
			Text.Clear();
			Text.Add("Looking at how close the guard and the bell are, you decide against taking him on for now. Maybe when you’re feeling more confident about it, or if the situation’s changed…", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		});
	}
));
BullTowerLoc.Building.Watchtower.events.push(new Link(
	"Lantern", function() {
		return outlaws.BT.towerGuardDown && !outlaws.BT.stoleLantern;
	}, true,
	null,
	function() {
		var parse = {
			
		};
		
		Text.Clear();
		Text.Add("Eyeing one of the lanterns hanging from the wall, you grab it off its hook. It’s small and portable, possessed of mirrored hoods that allow you to shut off most of the light when you hide, and the oil in the reservoir should sustain the flame that flickers within until dawn. It could certainly help you see better in the darkness without giving you away.", parse);
		Text.Flush();
		
		outlaws.BT.stoleLantern = true;
		
		Gui.NextPrompt();
	}
));

BullTowerScenes.Coversations = function(outside) {
	var parse = {
		a : outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed ? " and Alaric" : ""
	};
	
	Text.Clear();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("Lurking about in the deep shadows cast by the walls, you hear snatches of conversation drifting down from the ramparts:", parse);
	}, 1.0, function() { return outside; });
	scenes.AddEnc(function() {
		Text.Add("Crouched in the tall grass that surrounds the tower proper, you overhear two silhouettes chatting as they make their rounds:", parse);
	}, 1.0, function() { return outside; });
	scenes.AddEnc(function() {
		Text.Add("The interior of Bull Tower might be solid stone, but sound echoes easily through the ancient hallways. Cveta quickly ducks into a shadowed alcove and you[a] follow suit as footsteps pass by, their owners unseen:", parse);
	}, 1.0, function() { return !outside; });
	
	scenes.Get();
	
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“So… why’d you join up, anyway?”</i>", parse);
		Text.NL();
		Text.Add("<i>“You want to know? You really want to know?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Yeah.”</i>", parse);
		Text.NL();
		Text.Add("<i>“The outfit’s good, and it’s okay pay.”</i>", parse);
		Text.NL();
		Text.Add("<i>“What? That’s all?”</i>", parse);
		Text.NL();
		Text.Add("<i>“What did you expect? Work is hard to come by these days…”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“You think that blast down the road is what we were told to prepare for?”</i>", parse);
		Text.NL();
		Text.Add("<i>“What else would it be? Bloody forest-dwelling outlaws.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I dunno, I’m just glad I’m not the one who has to check it out.”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“So what’s up with the statue they brought in earlier today?”</i>", parse);
		Text.NL();
		Text.Add("<i>“I think it’s for his garden. That, and the blue roses, too. That second one came all the way from the Tree, I heard.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I knew Preston can be full of it, but what sort of ass has a damned <b>statue</b> of himself made? He’s worse than my mother-in-law!”</i>", parse);
		Text.NL();
		Text.Add("<i>“I wouldn’t let the lieutenant catch you saying that if I were you… he’ll take any excuse to use that whip of his.”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“This isn’t right, you know.”</i>", parse);
		Text.NL();
		Text.Add("<i>“What isn’t?”</i>", parse);
		Text.NL();
		Text.Add("<i>“This! We should be in the streets of Rigard, in the palace defending his Majesty and the rest of the royal family, not lurking about in this old dump. Calling it a ‘special assignment’ doesn’t change what it is. I feel like we’re just no-name bit-parters in some stage production. You know, the kind who’re just there to be a minor annoyance to the hero and are never remembered…”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Where’s the little guy?”</i>", parse);
		Text.NL();
		Text.Add("<i>“In the cells. Lieutenant’s interrogating him right now.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Ooh, nasty.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Standing orders are for him not to be disturbed, no matter what we hear coming from inside.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Anyone told him about the explosion down the road yet?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Fred went down earlier, although he took a lot of convincing.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I don’t blame him - I don’t want to be down there, either. Well, you can’t deny that he gets results, especially with that odd venom he uses…”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“You know that brothel we raided the other day? That one in the slums? You didn’t hear it from me, but I think someone high up was refused service and asked Preston to do something about it.”</i>", parse);
		Text.NL();
		Text.Add("<i>“You sure about that?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Everyone gets that his whole ‘The Shining’ schtick is as fake as a strap-on, and you ought to know better.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Not saying that it isn’t - armor should be too battered and dented to take a good shine - but how do you know that <b>this</b> raid wasn’t legit? We did see some weird shit in there…”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“I can’t believe we’re out here in the cold of night on some emergency. I was supposed to be off duty, damn it! Fuck Preston!”</i>", parse);
		Text.NL();
		Text.Add("<i>“You shouldn’t speak of him that way.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Why not? He certainly deserves it, and you know as much. Why, you gonna snitch on me, old man?”</i>", parse);
		Text.NL();
		Text.Add("<i>“It’s not that. He wasn’t always like that. His first assignment, during the rebellion... things didn’t go down the way it’s told in the books. Something happened to him… I was there when it happened, you know. Saw it with my own eyes. Preston was never the same man after that.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Ooh, tell me more…”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“So, everything’s in the warehouse?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Locked up tight; Jimmy has the key, and he’s on caravan duty. Spirits, my back aches, and it’s only going to get worse tomorrow.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Well, I said to lift with your knees, but would you listen?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Shut up, Fred. I didn’t sign on with the Royal Guard to be a stevedore.”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“…Taking down tough guys isn’t that bad. At least when you beat them, they’ve the brains to know when they’re beat. No, it’s the crazy ones you have to worry about.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Like that little guy we tried to pull for loitering the other day?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Yeah, or like the Lieutenant when he’s hopped up on Gol venom. He’s bearable otherwise, but let him get at the stuff… ugh. I saw what happened to Randell - and just for fidgeting during parade. Five lashes in front of everyone.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Y’know, for someone who calls himself the Shining, I wonder why Preston puts up with someone like that.”</i>", parse);
		Text.NL();
		Text.Add("<i>“That’s ‘cause he does all the stuff Preston won’t dirty his hands with…”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“Something is up tonight, and I don’t like it.”</i>", parse);
		Text.NL();
		Text.Add("<i>“You mean the explosion down the road?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Not just that… something’s up inside the fort. Feels like there’s eyes watching me from the shadows...”</i>", parse);
		Text.NL();
		Text.Add("<i>“You were always paranoid.”</i>", parse);
	}, 3.0, function() { return outlaws.BT.Suspicion() >= 50; });

	scenes.Get();
	
	Text.NL();
	
	PrintDefaultOptions(true);
}

BullTowerScenes.EndingSlipOut = function() {
	var parse = {
		
	};
	
	var stole = outlaws.BT.StoleSomething();
	
	party.LoadActiveParty();
	
	Text.Clear();
	Text.Add("Well, there’s nothing left for you here. Time to get out and go home - without further ado, you urge Cveta and Alaric into position, the three of you walking abreast. Alaric helped along between the two of you. The little bean-counter looks unsure at the idea of just sauntering by the gate guards, but you reassure him that Cveta’s voice will hold.", parse);
	Text.NL();
	Text.Add("And indeed, it does. Tromping through the archway as if you have every right to be there, the three of you don’t raise a single objection from the spellbound men as you slip across the King’s Road and disappear into the nearby woods. From there, it’s a long, slow walk back to the outlaws’ camp - despite the fact that there was still fighting going on on the road when you left, Zenith is there to receive you as you cross the drawbridge into the camp proper, arms folded as he waits to receive your report. The badger-morph is positively scruffy and reeks of dirt, blood and sweat, but remains composed as he greets you.", parse);
	Text.NL();
	Text.Add("<i>“You’ve returned,”</i> he says. <i>“And it seems you’ve brought back our friend, although he could use some attention from Aquilius. Someone send him over, please.”</i>", parse);
	Text.NL();
	parse["stole"] = stole ? " who also unburden you of your purloined goods," : "";
	Text.Add("As Alaric is led away by a couple of dog-morphs,[stole] you briefly recount the details of your little adventure, Cveta backing you up every so often with her version of events. Zenith listens intently to your story, then gives you a brisk nod when you’re done.", parse);
	
	BullTowerScenes.EndingDebrief();
}

BullTowerScenes.EndingFailure = function() {
	var freed = outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed;
	var parse = {
		two : freed ? "three" : "two",
		al : freed ? " and Alaric" : ""
	};
	
	var stole = outlaws.BT.StoleSomething();
	
	party.LoadActiveParty();
	
	Text.Add("Making a mad dash for the gates before someone has the chance to draw them shut, the [two] of you bowl past the gate guards. Fortunately, you take them by surprise and are out of reach before they can gather their senses enough to give pursuit; thankfully, the cover of night is deep, and the woods by the King’s Road close enough for you to slip between the trees and vanish into their shadows. A few minutes later, you hear the detachment of Royal Guards return, their lanterns lighting up the road as you watch from the treeline.", parse);
	Text.NL();
	Text.Add("<i>“That did not go as expected,”</i> Cveta mutters, finally able to stop and catch her breath.", parse);
	Text.NL();
	Text.Add("No, it didn’t.", parse);
	if(freed) {
		Text.Add(" You turn to Alaric - supported between the two of you, the little accountant has somehow managed to keep up on your flight out of the fortress and into the woods, despite his rapid, harried breathing on your run. Clearly unaccustomed to physical activity even at the best of times, Alaric wheezes and splutters as he gasps for breath, and it’s a good five minutes before he recovers enough to be able to speak. Some of his wounds have reopened from the exertion, and he rubs at them in a bid to staunch the blood trickling down his arms and back.", parse);
		Text.NL();
		Text.Add("<i>“Gah! First time I’ve had to run for my life, although knowing my luck, it won’t be the last.”</i>", parse);
	}
	Text.NL();
	Text.Add("From your hiding spot amongst the trees, you take one last look back at Bull Tower. With it being rife with activity - no doubt caused by the discovery of your presence - it’s going to be impossible to head back anytime soon, not with search parties fanning out from the fortress and the ramparts lit up like a festival day. For better or worse, it’s time for you to head back and report to Zenith. Cveta[al] in tow, you turn and begin the long journey back to the outlaws’ camp.", parse);
	Text.NL();
	Text.Add("It’s nearly dawn by the time you return, and the camp guards let down the drawbridge for you to enter. Zenith is already waiting for you by the entrance, the badger-morph standing with his arms folded and looking at you expectantly. ", parse);
	if(freed) {
		parse["stole"] = stole ? " who also relieve you of your purloined goods," : "";
		Text.Add("Alaric is led away by a couple of dog-morphs,[stole] and you", parse);
	}
	else {
		parse["stole"] = stole ? "relieve you of your purloined goods, and you" : "stand ready to take the material proceeds of your infiltration, and are left looking at you in bemusement as they realize you’ve returned with nothing. You";
		Text.Add("A couple of dog-morphs [stole]", parse);
	}
	Text.Add(" briefly recount the details of your little adventure, Cveta backing you up every so often with her version of events. Zenith listens intently to your story, then gives you a brisk nod when you’re done.", parse);
	
	BullTowerScenes.EndingDebrief();
}

BullTowerScenes.EndingInjured = function() {
	var parse = {
		playername : player.name,
		name : kiakai.name
	};
	
	party.LoadActiveParty();
	
	world.TimeStep({hour: 6});
	
	Text.Clear();
	Text.Add("When you eventually come to, you find yourself lying on a stretcher - no, it’s a cot - and at length the familiar hustle and bustle of the bandit camp comes to your ears. Muffled curses, the sounds of wood being chopped, a child laughing while dogs bark away; ah, it’s good to be back, even if you’re rather unclear on the how.", parse);
	Text.NL();
	Text.Add("<i>“Don’t sit up. I know you probably feel like you ought to, but with all the blood you’ve lost, you’ll probably just end up on the cot again. I don’t know what you did to earn that gash, and with it being as deep as it was, I don’t think I want to find out. Painfully close to a major artery there.”</i> The voice is gentle but distinctly masculine, and you turn your gaze to its source to find its owner: Aquillus.", parse);
	Text.NL();
	parse["k"] = party.InParty(kiakai) ? " with a little help from your elf friend there," : "";
	Text.Add("<i>“Nevertheless,[k] I was able to pull you out of danger. You’ll be weak for a while yet, but at least you’re no longer in danger of bleeding out. Zenith will want to know that you’ve come to - why don’t you make yourself comfortable while I go get him?”</i>", parse);
	Text.NL();
	if(party.InParty(kiakai)) {
		Text.Add("Scarcely has Aquilius left, though, than [name] comes practically bounding in through the flaps, coming to a stop by your bedside.", parse);
		Text.NL();
		Text.Add("<i>“[playername]! [playername]! You are awake!”</i>", parse);
		Text.NL();
		Text.Add("You reassure [name] that you’re still in one piece, and intend to stay that way for the foreseeable future. As for feeling fine… well, you’ve had better days, but you’ll be better once you’ve had a lie-down.", parse);
		Text.NL();
		Text.Add("<i>“I was shocked at the condition you were in when you were brought into the camp. Aquilius is a skilled surgeon, but his bedside manner leaves much to be desired. I had to plead with him at some length to persuade him to allow me to aid in your recovery.”</i>", parse);
		Text.NL();
		Text.Add("Your thoughts drift back to when you first arrived in Eden, and nod. Yes, you can definitely see Aquilius protesting [name]’s methods, regardless of their efficacy. After a few more reassurances and gently refused attempts of the poor elf to start fussing over you, you finally manage to convince [name] to give you some quiet time before Aquilius returns.", parse);
		Text.NL();
	}
	Text.Add("Finally, you have a little time alone to examine yourself. You tilt your head forward to get a look at Aquilus’ handiwork. The safe’s blade trap definitely did a number on you, judging by the extensive coverage of the bandages that Aquilius has dressed your wound with, and you’re pretty sure you can feel the gentle pull of thread against flesh at your slight movement. The bandages themselves have been soaked in something that smells vaguely antiseptic and completely awful, and with how much of your blood has found its way into them, are going to need changing soon.", parse);
	Text.NL();
	Text.Add("Just how did you manage to make it all the way back from Bull Tower? Certainly neither Cveta nor Alaric could have carried you such a long way… that train of thought is interrupted when the tent flaps are drawn once more, and Aquilius returns with Zenith in tow. The outlaw leader passes his firm gaze over you a couple times, then purses his lips.", parse);
	Text.NL();
	Text.Add("<i>“Bad, but I’ve seen worse in my time. I’ll agree with Aquilius here - you’ll live.”</i>", parse);
	Text.NL();
	Text.Add("Aquilius shrugs. <i>“You won’t have to come back later to get those stitches removed. The thread I used is a rare plant fiber - just leave them in, and they’ll melt into your flesh as you heal.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Thank you, Aquilius. Now, while Cveta gets Alaric settled in with us, let’s review the events of your evening, shall we? I’ve heard most of the story from Cveta, but I’d like to get your version of events.”</i>", parse);
	Text.NL();
	Text.Add("Although you find yourself getting quickly tired from talking, you do your best to recount the events as you remember them, careful to not leave out any details.", parse);
	
	BullTowerScenes.EndingDebrief(true);
}

BullTowerScenes.EndingDebrief = function(injured) {
	var parse = {
		playername : player.name
	};
	
	party.location = world.loc.Outlaws.Camp;
	world.TimeStep({hour: 3});
	
	Text.Flush();
	
	outlaws.flags["BullTower"] = Outlaws.BullTowerQuest.Completed;
	
	var foundOut = outlaws.BT.Suspicion() >= 100;
	if(outlaws.BT.foughtCorishev && !(outlaws.AlaricSaved()))
		foundOut = true;
	
	var score = 0;
	if(outlaws.flags["BT"] & Outlaws.BullTower.AlaricFreed)      score += 2;
	if(outlaws.flags["BT"] & Outlaws.BullTower.ContrabandStolen) score += 1;
	if(outlaws.flags["BT"] & Outlaws.BullTower.BlueRoses)        score += 1;
	if(outlaws.flags["BT"] & Outlaws.BullTower.StatueDestroyed)  score += 1;
	if(outlaws.flags["BT"] & Outlaws.BullTower.AnimalsFreed)     score += 1;
	if(outlaws.flags["BT"] & Outlaws.BullTower.SafeLooted)       score += 1;
	if(outlaws.flags["BT"] & Outlaws.BullTower.CaravansIgnited)  score += 1;
	if(outlaws.flags["BT"] & Outlaws.BullTower.CaravansSearched) score += 1;
	if(!foundOut) score += 1;
	//TOTAL: 10
	if(score >= 10) outlaws.flags["BT"] |= Outlaws.BullTower.PerfectScore;
	
	var relevant = false;
	if(outlaws.flags["BT"] & Outlaws.BullTower.ContrabandStolen) relevant = true;
	if(outlaws.flags["BT"] & Outlaws.BullTower.StatueDestroyed) relevant = true;
	if(outlaws.flags["BT"] & Outlaws.BullTower.SafeLooted) relevant = true;
	if(outlaws.flags["BT"] & Outlaws.BullTower.CaravansSearched) relevant = true;
	if(outlaws.flags["BT"] & Outlaws.BullTower.CaravansIgnited) relevant = true;
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("<b>Final Score:</b><br>", parse);
		Text.Add("Suspicion raised: " + outlaws.BT.Suspicion() + "/100<br>", parse);
		Text.Add("Mayhem spread: " + score + "/10<br>", parse);
		Text.Add("Alarm raised: " + (foundOut ? "yes" : "no"), parse);
		Text.Flush();
		
		Gui.NextPrompt(function() {
			Text.Clear();
			if(outlaws.AlaricSaved()) {
				Text.Add("<i>“Thank you for pulling this off without a hitch,”</i> Zenith says, a rare smile on the outlaw leader’s face. <i>“I confess that I had some doubts about your abilities and wondered if I should have sent Maria in your place, but it seems you and Cveta made a fine team and put Preston to shame. It’s not often that I’m glad to be proven wrong.</i>", parse);
				Text.NL();
				Text.Add("<i>“You don’t have to worry about Alaric. We’ll feed him, treat his wounds as best we can, and ask him to tell his tale. It’s unlikely that he’ll be able to go back to his old life now that he’s a wanted fugitive, but we should be able to set him up somewhere in the Free Cities. Honest accountants are hard to come by and in high demand.”</i>", parse);
				Text.NL();
				Text.Add("That makes sense. Even if there aren’t any official charges, it wouldn’t be hard for Preston to trump some up, you point out.", parse);
				Text.NL();
				parse["o"] = relevant ? " Now, let’s go over the other things you did…" : "";
				Text.Add("<i>“Exactly,”</i> Zenith replies. <i>“Most of us didn’t choose to be outlaws; I think of us as exiles, thrown out on one flimsy charge or another. But we make the most of the hand we’ve been dealt.[o]</i>", parse);
				Text.NL();
				if(outlaws.flags["BT"] & Outlaws.BullTower.StatueDestroyed) {
					Text.Add("<i>“Smashing Preston’s statue was a very appropriate touch. I knew the man was pompous - we’re reminded of the fact every time we get news out of Rigard - but this is something else altogether. An entire marble statue… how much did it cost him, and how much of that money was earmarked for his underlings’ pay and equipment, I wonder?”</i>", parse);
					Text.NL();
					Text.Add("It was Cveta who thought to leave the outlaws’ mark on the plinth, you point out.", parse);
					Text.NL();
					Text.Add("<i>“So she did, and she gets credit for that. I wish I could have been there to help you topple the thing.”</i> Zenith sounds a little wistful. <i>“Still, it’s important to remember that Preston is merely Rewyn’s hand. So long as the head remains, the snake lives on.”</i>", parse);
					Text.NL();
				}
				if(outlaws.flags["BT"] & Outlaws.BullTower.CaravansSearched) {
					Text.Add("<i>“If the invoices and receipts the two of you found are indeed what they seem, we have a potent weapon for proving to the people what Rigard’s nobles think of their own laws. To impose taxes on those who bake the very bread they stuff themselves with, while they evade their share… that’s unforgivable. It is just one of the ways they attempted to break the guilds back then… but I’m rambling.”</i>", parse);
					Text.NL();
					Text.Add("What does he intend to do with this knowledge, by the by? You get the feeling that reporting the lot to the guard isn’t going to do very much.", parse);
					Text.NL();
					Text.Add("<i>“Of course not,”</i> Zenith replies with a snort. <i>“I’ll go over the figures later and note down each and every one of the greedy pieces of filth. Then maybe we’ll have them copied, a few rumors spread in the right places… attacking or accusing them head-on isn’t going to do much, but the people of Rigard are already suspicious of their self-proclaimed leaders. It won’t take much effort on our part to turn that into hostility.”</i>", parse);
					Text.NL();
				}
				if(outlaws.flags["BT"] & Outlaws.BullTower.CaravansIgnited) {
					Text.Add("<i>“With those caravans you burned… well, perhaps they will think twice about consorting with the corrupt and decadent. I suspect that our friends will be having trouble finding someone to run their goods for them for a little while.”</i>", parse);
					Text.NL();
				}
				if(outlaws.flags["BT"] & Outlaws.BullTower.SafeLooted) {
					Text.Add("As he’s about to continue, a dog-morph comes running up to Zenith and salutes. <i>“Sir!”</i>", parse);
					Text.NL();
					Text.Add("<i>“Yes, Serana?”</i>", parse);
					Text.NL();
					Text.Add("<i>“We’ve counted the money [playername] brought back, as you requested.”</i>", parse);
					Text.NL();
					Text.Add("<i>“And the total is?”</i>", parse);
					Text.NL();
					Text.Add("<i>“I’d rather not say it in the open, sir.”</i>", parse);
					Text.NL();
					Text.Add("Zenith blinks, truly surprised, but leans in while the dog-morph whispers in his ear. His eyes grow wide for a second or two, until his features settle into a more composed, bemused expression.", parse);
					Text.NL();
					Text.Add("<i>“Thank you, Serana. You may take your leave now.”</i> As the dog-morph pads off, Zenith turns back to you and sighs. <i>“Well! It appears that our Royal Guards have been on the take for quite the sum. Ten thousand coins… considerable, but if caravans’ worth of goods are being regularly smuggled into Rigard, the price would have been worth it, from the nobles’ point of view.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Just how deep does the corruption run, I wonder? And Rewyn is always complaining that the treasury is empty, using that as an excuse to squeeze the people…”</i>", parse);
					Text.NL();
					Text.Add("Ten thousand, hmm?", parse);
					Text.NL();
					Text.Add("<i>“At least that much,”</i> Zenith says. <i>“Serana says they’re recounting right now, but some sums of money are such that past a certain point, the exact number becomes meaningless. This is one of them. Good work, [playername]. This news will soon find its way onto the streets of Rigard, I promise you that.”</i>", parse);
					Text.NL();
				}
				if(outlaws.flags["BT"] & Outlaws.BullTower.ContrabandStolen) {
					Text.Add("<i>“And finally, we come to the matter of the gemstones you brought back. Cut and polished, no less - we won’t be dumping these all at once, since even the best fences will have problems washing these clean. Still, it seems that we won’t be needing to worry about money for a while, and it’s all thanks to Preston and the incompetence of his little outfit. That’s what you get when you worry about polishing your armor more than how well your men are trained.”</i>", parse);
					Text.NL();
				}
				Text.Add("<i>“Once more, I’ll congratulate you on your success. The blow you struck might be small, but it is nevertheless important - after all, Eden wasn’t settled in a day. ", parse);
				if(score >= 10)
					Text.Add("The two of you did a most excellent job in there - I couldn’t have done better myself. Causing that much mayhem and yet managing to escape undetected; Preston is going to throw a fit once word of this gets to him. I knew I made the right choice in picking you and Cveta for this task.”</i>", parse);
				else if(score >= 6)
					Text.Add("The two of you performed admirably tonight - you certainly had an eye for spotting opportunities while not losing track of what you were there for. I expect to see a lot of unhappy Royal Guards tomorrow.”</i>", parse);
				else
					Text.Add("You two performed well tonight, nothing less than I expected of you. Congratulations on getting Alaric out safely.”</i>", parse);
				Text.NL();
				Text.Add("<i>“There is one more thing. They were prepared for us, [playername]. We still managed to pull off the diversion thanks to everyone’s grit and dedication, but the guards knew we were coming, even if the caravaneers didn’t. They turned up far sooner than we had expected them to. We didn’t get to claim much in the way of spoils from that attack, though since Alaric is free, I’ll nonetheless consider tonight a success. Still, it raises serious questions that I’ll have to look into later.</i>", parse);
				Text.NL();
				parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
				parse["c"] = party.Num() > 1 ? Text.Parse(", and perhaps reassure [comp] that you’re fine", parse) : "";
				parse["injured"] = injured ? "and that gash will take time to heal" : "and I’d rather not see you worn out";
				Text.Add("<i>“Now, I suggest that you get some rest[c]. You’ve had enough adventure for a single night, [injured].”</i> With that, Zenith gives you one final nod, then turns and stalks away, his wide, easy stride eating up distance until he disappears amidst the camp’s morning activity.", parse);
				var inc = 10;
				
				if(outlaws.flags["BT"] & Outlaws.BullTower.ContrabandStolen) inc += 2;
				if(outlaws.flags["BT"] & Outlaws.BullTower.SafeLooted) inc += 2;
				if(outlaws.flags["BT"] & Outlaws.BullTower.CaravansSearched) inc += 2;
				if(outlaws.flags["BT"] & Outlaws.BullTower.StatueDestroyed) inc += 2;
				if(outlaws.flags["BT"] & Outlaws.BullTower.BlueRoses) inc += 2;
				if(outlaws.BT.Suspicion() < 100) inc += 2;
				if(score >= 10) inc += 3;
	
				outlaws.relation.IncreaseStat(100, inc);
			}
			else {
				Text.Add("<i>“Well. You failed,”</i> Zenith states bluntly. <i>“And through no fault of Cveta’s, either - since you were de facto leader of this foray, she did all she could to aid you in your decisions, even if she didn’t agree with all of them. She did her part as a follower, but did you do yours as a leader?”</i>", parse);
				Text.NL();
				parse["c"] = outlaws.BT.foughtCorishev ? " You tried your best in attempting to save him, but alas, your best was not enough, and I won’t mince words: I don’t give points for effort." : "";
				Text.Add("The outlaw leader paces in a small circle, each step slow and measured. <i>“This is going to be troublesome. Yes, we have a contingency plan in case you should fail to bring Alaric to us, but clearing our name is going to be much harder without his testimony. That, and one can only wonder what the Royal Guard is going to do with the man; it’s likely that we’ll never see or hear of him again.[c]</i>", parse);
				Text.NL();
				Text.Add("<i>“Perhaps it would have been better if I’d sent Maria instead.”</i>", parse);
				Text.NL();
				if(score >= 4) {
					Text.Add("<i>“In the future, I suggest that you focus on the task at hand. Doing more than what’s strictly needed is appreciated, but not if it is a detriment to the main task.”</i>", parse);
					Text.NL();
				}
				Text.Add("<i>“There is one more thing. They were prepared for us, [playername]. We still managed to pull off the diversion thanks to everyone’s grit and dedication, but the guards knew we were coming, even if the caravaneers didn’t. They turned up far sooner than we had expected them to - we didn’t get to claim any spoils from that attack, which would at least have prevented this from being a complete loss.</i>", parse);
				Text.NL();
				Text.Add("<i>“All in all, [playername], we are a very fair people here in this camp. Your standing depends on the goods you bring to the table, and I’m afraid I may have to reconsider your help when it comes to other sensitive tasks. Not that I doubt your loyalty to us, but it’s better to match tasks to people by their abilities. Have a good rest - too much adventure in one night is bad for one’s health.”</i> With that, he turns on his heels and strides off, taking big, determined steps, leaving you to wallow in your failure.", parse);
				
				outlaws.relation.DecreaseStat(-100, 10);
			}
			Text.Flush();
			
			Gui.NextPrompt();
			
			outlaws.mainQuestTimer = new Time(0,0,3,0,0);
		});
		
	});
	
}


//#This will trigger three days after the event if the player saved Alaric.
BullTowerScenes.AftermathAlaric = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("A curious sight greets you as you enter the outlaw camp. Standing by the drawbridge is Alaric, the little bean-counter all dressed and with a single sackcloth bag in hand. He’s healed up decently - though some of the lash marks are going to leave scars, alas - and looks up at you in surprise when he sees you.", parse);
	Text.NL();
	Text.Add("<i>“[playername].”</i>", parse);
	Text.NL();
	Text.Add("Leaving already?", parse);
	Text.NL();
	Text.Add("<i>“Well, yes,”</i> he replies, a little flustered. <i>“I wanted to see you, to thank you properly for getting me out of the Royal Guard’s hands, but couldn’t find you anywhere in camp. People said you move around a lot and didn’t know when you’d be back, so I thought of leaving a note…”</i>", parse);
	Text.NL();
	Text.Add("Well, it seems like that won’t be necessary.", parse);
	Text.NL();
	Text.Add("<i>“Um. Well. Thanks. I’ve already told Zenith what I know of the whole matter, and he seemed satisfied with just that, so…”</i>", parse);
	Text.NL();
	Text.Add("You don’t need anything from him. You aren’t going to press Alaric when he’s already unsure about his future. But would he mind sharing his story with you as well before he goes? There wasn’t time for much conversation back in Bull Tower, after all, and you’d like to know his side of the tale.", parse);
	Text.NL();
	Text.Add("<i>“Well, I suppose it can’t hurt. What’s going over it one more time?”</i> he sits down on his luggage and hunches over, putting his chin in his hands, then invites you to sit beside him. <i>“I think I mentioned back there that I worked for the Treasury. Not as anyone important, just a number adder doing the incoming taxes and tariffs I was assigned, and handling the monthly balance account statement for my department. Both eventually got me into trouble.</i>", parse);
	Text.NL();
	Text.Add("<i>“I was just too good at my job, I guess. The first thing I noticed was that some of the income statements submitted by a number of nobles just didn’t match up with what their businesses were reporting. It’s not that they hadn’t tried to cook the books, but at the end of the day who’s going to believe that a cartload of chickens was sold at four or five times market price on every Tuesday?”</i>", parse);
	Text.NL();
	Text.Add("An honest accountant? Will wonders never cease? Next thing you know, an honest advocate will pop up in this neck of the woods.", parse);
	Text.Flush();
	
	world.TimeStep({minute: 10});
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("<i>“I’d rather you not belittle my profession,”</i> Alaric huffs. <i>“I know we don’t exactly have the best of reputations, there’s no need to press home the point.</i>", parse);
		Text.NL();
		Text.Add("<i>“Well, after a few pages’ worth of overpriced chickens, highly-valued fruit, and sweetmeats that must been gemstones the way they were priced, I went and reported my findings to my superiors. Sure, I was a little naive, but the Treasury is supposed to be under the direct purview of Rewyn himself and I had all the evidence down in black and white. All of it. He should have been happy to realize that he was been fleeced…”</i>", parse);
		Text.NL();
		Text.Add("But it didn’t work out that way, did it?", parse);
		Text.NL();
		Text.Add("<i>“No, it didn’t. I was told to keep quiet and forget all about it. Naturally, that only spurred me to dig deeper - and I guess I must’ve dug too deep too visibly, because next thing I know, I’m hearing unsettling rumors about Majid taking an interest in our affairs at the counting-house. You know. Rewyn’s advisor. That strange man.”</i>", parse);
		Text.NL();
		Text.Add("And that was important because…?", parse);
		Text.NL();
		Text.Add("<i>“Because while I had no concrete evidence, what I’d dug up strongly suggested that Majid had been siphoning off money from the treasury. His embezzlement was always careful - never too much at one time, and always attached to legitimate expenses. Nevertheless, a few hundred or thousand coins here and there, tacked onto the bills for many projects… it added up to a considerable sum.</i>", parse);
		Text.NL();
		Text.Add("<i>“Nevertheless, I got spooked. Thought I’d take an unpaid leave of absence, hide out at my sister’s in the countryside, lie low for a few weeks until this thing blew over. Then I got stopped on the King’s Road, and… well, you know the rest.”</i>", parse);
		Text.NL();
		Text.Add("Indeed, you do. Well then, what is he going to do now? It’s not as if he can waltz back into his old job at the treasury.", parse);
		Text.NL();
		Text.Add("Alaric turns away from you at your words. <i>“Yeah. I can’t go back. Zenith advised me against even trying to see any of my family - I’d only be putting them in danger, since the Royal Guard is likely to have someone watching them on the chance I turn up at their doorsteps. He said he’d sneak a message to them, though, so they aren’t left wondering what happened to me.", parse);
		Text.NL();
		Text.Add("<i>“I’m going to be shipped off near the Free Cities, where Zenith knows someone who needs a good accountant to do the bookkeeping and, more importantly, where Majid won’t be able to get at me.”</i>", parse);
		Text.NL();
		Text.Add("Is he certain it’s connected? That Majid set the Royal Guard on him, that is.", parse);
		Text.NL();
		Text.Add("Alaric shrugs. <i>“As I said, I don’t have any concrete evidence. But he had a motive, since I was snooping around his accounts, and he definitely has the authority to order around the Royal Guard and create the proclamations blaming the outlaws for my disappearance. It’s just a hunch, and yes, I could be wrong - but it were my hunches which led me to discovering the errors in both the nobles’ and Majid’s accounts.”</i>", parse);
		Text.NL();
		Text.Add("Hmm. Majid.", parse);
		Text.NL();
		Text.Add("<i>“Alaric!”</i> a rather gruff voice calls from the other side of the camp wall. <i>“You done? We’re about to set off!”</i>", parse);
		Text.NL();
		Text.Add("<i>“Well, it looks like I should be going now.”</i> Gritting his teeth with the effort, Alaric stands and hefts his luggage over his shoulder. <i>“I’ll have an escort to the Free Cities and we won’t be taking the King’s Road, so don’t worry about me. If you ever find yourself there, don’t hesitate to find me at this address.”</i> He hands you a slip of paper. <i>“Well then, [playername]. Thanks again, and keep yourself safe. Or at least, safer than I’ve been.”</i>", parse);
		Text.NL();
		Text.Add("One last thing. The Lieutenant clearly expected Cveta and you, which would explain why all the guards in the fortress were on high alert that night. Does he know anything about that?", parse);
		Text.NL();
		Text.Add("<i>“Sadly, I don’t. But if the information got out… [playername], usually that means someone passed it on. A spy, if you will. Well, that’s all I’ve got. Please, if you ever find yourself in the Free Cities, I’d like to extend my welcome again. I owe my life to you, after all.”</i>", parse);
		Text.NL();
		Text.Add("With that, the little bean-counter gives you a final wave and hobbles off. The camp guards hurry to lower the drawbridge so he can cross, and after a moment, he turns and is out of sight.", parse);
		Text.Flush();
		
		world.TimeStep({minute: 20});
		
		outlaws.mainQuestTimer = new Time(0,0,1,0,0);
		
		outlaws.flags["BullTower"] = Outlaws.BullTowerQuest.AlaricFollowup;
		
		Gui.NextPrompt();
	});
}


//#Triggers one day after the Alaric scene if the player has at least stolen the goods and payoff.
BullTowerScenes.AftermathZenith = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("As you approaching the outlaw camp, something about it strikes you as odd. Is it just you, or do the guards look a little on edge today? You don’t have long to wonder, though - the moment you step over the drawbridge and into the camp, one of the guards, the fox-morph - comes marching up to you.", parse);
	Text.NL();
	Text.Add("<i>“[playername]?”</i>", parse);
	Text.NL();
	Text.Add("That would indeed be you, yes.", parse);
	Text.NL();
	Text.Add("<i>“The chief’s made it known that he wants a word with you. If we see so much as your shadow, we’re to let you know you ought to wait in his place.”</i>", parse);
	Text.NL();
	Text.Add("What about, though?", parse);
	Text.NL();
	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
	parse["c"] = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
	parse["c2"] = party.Num() > 1 ? "yourselves" : "yourself";
	Text.Add("<i>“He didn’t say, although it sounded important. Guess you should go find out.”</i> With that, the fox-morph turns and heads back to his post, leaving you to find your own way to Zenith’s place. The building is easy to find - you’re not likely to forget the day you learned of the outlaws, after all - and no one stops you as you open the door and step inside. The table with the map is still there, the papers too; there are some chairs in a corner, and you[c] seat [c2] there, waiting for Zenith to turn up.", parse);
	Text.NL();
	Text.Add("You don’t have to wait long. The outlaw leader is in an uncharacteristically good mood, throwing the door open with a resounding slam as he enters the room. The grin on Zenith’s face grows even wider when he sees you, and he crosses the map room in a few easy strides to give you a generous, crushing hug.", parse);
	Text.NL();
	Text.Add("<i>“[playername]! I came the moment the guard told me you’d come visiting. I trust that you’ve not had too much adventure yet?”</i>", parse);
	Text.NL();
	Text.Add("Very nice, but if he’d let go of you…", parse);
	Text.NL();
	Text.Add("<i>“Right, right. Sorry about that.”</i> The hug is released as quickly as it’d engulfed you, and you feel good, clean air flowing into your lungs. <i>“I wanted you to know that we’ve managed to fence off a good number of the gemstones you brought back a few days ago. Combined with all the money you lifted off the Royal Guard, we’re definitely going to be able to purchase a number of much-needed supplies and maybe even make a few improvements to the camp.”</i>", parse);
	Text.NL();
	Text.Add("Well, that would explain why Zenith is feeling upbeat today. But why call you out?", parse);
	Text.NL();
	Text.Add("<i>“Well, you did a good job. Maria, Aquilius and I discussed it amongst ourselves and we’ve decided to give you a cut.”</i>", parse);
	Text.NL();
	Text.Add("A cut?", parse);
	Text.NL();
	Text.Add("<i>“Yes, a cut. A moment, please.”</i>", parse);
	Text.NL();
	Text.Add("Without another word, the badger-morph strides to the opposite corner of the room and reaches into the shadows, drawing out a rather large bundle wrapped in paper and cord. With much aplomb, he returns to you and thrusts the bundle into your hands. <i>“While Aquilius and I were out getting a good price for your gems from the fences, we spotted something you might like. Why don’t you open it and see?”</i>", parse);
	Text.NL();
	Text.Add("He’s so eager and expectant that it’d be a travesty to refuse. Carefully, you unwrap the cord and paper to draw out a small shortsword. It’s rather plain, save for the rubies set into either side of the crossguard. You peer into the gems’ depths, each ruby as large as an eyeball, and notice runes embedded in each.", parse);
	if(Jobs.Mage.Unlocked(player))
		Text.Add(" There’s little doubt about it; the sword is enchanted. It’s not a very potent spell, but it’s strong enough for you to sense the magical aura, concentrated about the gems and extending through the blade.", parse);
	Text.NL();
	
	//#Gain jeweled mageblade.
	party.Inv().AddItem(Items.Weapons.JeweledMageblade);
	
	Text.Add("<i>“I’d be careful with that, if I were you. All you need to do is to grab its hilt, think hard, and the blade bursts into flame. Then, think hard about it going out, and it does just that. The fence was going to charge us a pretty penny for it - with it being magic and all - but we haggled the price down to something more reasonable. I think you’ve earned that much.”</i>", parse);
	Text.NL();
	if(outlaws.flags["BT"] & Outlaws.BullTower.PerfectScore) {
		Text.Add("<i>“That’s not all, though.”</i> Zenith produces another wrapped package, flatter and rounder than the first, then presses it into your hands. <i>“We heard that Preston’s been in a terrible mood for the last few days, and it’s all thanks to our efforts. Thought we’d spread the extra cheer around. Go on, open it.”</i>", parse);
		Text.NL();
		Text.Add("Tearing apart cord and paper, you find a small buckler inside, polished and gleaming. No doubt there’s supposed to be some kind of irony here…", parse);
		Text.NL();
		Text.Add("<i>“Oh, I’m sure you’ll scratch and dent it soon enough so it won’t hold a proper shine,”</i> the badger-morph says, grinning as he claps you on the shoulder.", parse);
		Text.NL();
		
		//#Gain silvered buckler.		
		party.Inv().AddItem(Items.Accessories.SilverBuckler);
	}
	Text.Add("Putting away the gifts, you thank Zenith.", parse);
	Text.NL();
	Text.Add("He brushes off your words with an easy wave. <i>“You’ve earned them. Back in the day, the Guilds rewarded those who had ability and worked hard. They may no longer exist, but I’ve kept that tradition alive.</i>", parse);
	Text.NL();
	Text.Add("<i>“So long as you continue to prove your worth, friend, I’ll be more than happy to reward you. Now, if there’s nothing else, might I trouble you to step out? We’re going to have a little meeting here at the turn of the hour, discuss our strategy in light of recent events. Terribly boring stuff, I assure you,”</i> he adds, evidently noticing the question on your face.", parse);
	Text.NL();
	Text.Add("You nod and stand, thanking the badger-morph once again. He simply shrugs, grins, and ushers you out with your new possessions, leaving you to take in the cool, fresh air of the outlaw camp.", parse);
	Text.Flush();
	
	world.TimeStep({hour: 1});
	
	outlaws.flags["BullTower"] = Outlaws.BullTowerQuest.ZenithFollowup;
	
	Gui.NextPrompt();
}

export { BullTowerStats, BullTowerScenes, BullTowerLoc };
