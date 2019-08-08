/*
 * Outlaws flags
 */
import * as _ from 'lodash';

import { GetDEBUG } from '../../../app';
import { OCavalcadeScenes } from './cavalcade';
import { Stat } from '../../stat';
import { Time } from '../../time';
import { WorldTime, TimeStep } from '../../GAME';
import { Gui } from '../../gui';
import { Text } from '../../text';
import { Jobs } from '../../job';
import { EncounterTable } from '../../encountertable';
import { OutlawsFlags } from './outlaws-flags';

let OutlawsScenes = {
	Cavalcade : OCavalcadeScenes,
};

// Class to handle global flags and logic for outlaws
function Outlaws(storage) {
	this.flags = {};
	
	this.flags["Met"] = 0;
	this.flags["BT"] = 0; // Bitmask
	this.flags["BullTower"] = 0;
	this.flags["events"] = 0; // Bitmask
	
	this.relation = new Stat(0);
	
	this.mainQuestTimer = new Time();
	this.factTimer = new Time();
	
	if(storage) this.FromStorage(storage);
}

Outlaws.prototype.ToStorage = function() {
	var storage = {};
	
	storage.flags = this.flags;
	if(this.relation.base != 0)
		storage.rep = this.relation.base.toFixed();
	
	storage.Qtime = this.mainQuestTimer.ToStorage();
	storage.Ftime = this.factTimer.ToStorage();
	
	return storage;
}

Outlaws.prototype.FromStorage = function(storage) {
	storage = storage || {};
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
	this.relation.base = !isNaN(parseInt(storage.rep)) ? parseInt(storage.rep) : this.relation.base;
	
	this.mainQuestTimer.FromStorage(storage.Qtime);
	this.factTimer.FromStorage(storage.Ftime);
}

Outlaws.prototype.Update = function(step) {
	this.mainQuestTimer.Dec(step);
	this.factTimer.Dec(step);
}


// TODO
Outlaws.prototype.TurnedInBinder = function() {
	return false;
}

Outlaws.prototype.BullTowerCompleted = function() {
	return this.flags["BullTower"] >= OutlawsFlags.BullTowerQuest.Completed;
}

Outlaws.prototype.RetrievedBlueRoses = function() {
	return this.flags["BT"] & OutlawsFlags.BullTower.BlueRoses;
}

Outlaws.prototype.AlaricSaved = function() {
	return this.BullTowerCompleted() && (this.flags["BT"] & OutlawsFlags.BullTower.AlaricFreed);
}

Outlaws.prototype.BullTowerCanGetReward = function() {
	return this.AlaricSaved() && (this.flags["BT"] & OutlawsFlags.BullTower.ContrabandStolen) && (this.flags["BT"] & OutlawsFlags.BullTower.SafeLooted);
}
Outlaws.prototype.Rep = function() {
	return this.relation.Get();
}
Outlaws.prototype.CompletedPathIntoRigard = function() {
	return this.flags["Met"] >= OutlawsFlags.Met.MetBelinda;
}
//TODO
Outlaws.prototype.MetPenPam = function() {
	return false;
}

/*
#Require that PC have introduced self to all outlaws available from start. (Aquilius, Maria at present)
#Trigger upon trying to find Maria in the outlaws’ camp. (I.E, clicking on her button)
#Possibly require some rep with outlaws first (helping Maria/Aquilius for a bit)
 */
Outlaws.prototype.MariasBouqetAvailable = function() {
	let outlaws = GAME().outlaws;
	let aquilius = GAME().aquilius;
	//Only in the initial phase
	if(outlaws.flags["Met"] != OutlawsFlags.Met.Met) return false;
	//Only when meeting the correct relation requirements TODO
	if(aquilius.flags["Met"] < Aquilius.Met.Met) return false;
	//Only when meeting total Outlaws rep
	return outlaws.Rep() >= 0;
}

OutlawsScenes.MariasBouquet = function() {
	let player = GAME().player;

	var parse = {
		playername : player.name,
		afternoonevening : WorldTime().hour >= 16 ? "evening" : "afternoon"
	};
	
	Text.Clear();
	Text.Add("Odd; Maria isn’t at any of her usual posts today. Although the sentries at the gate are quite clear that her group wasn’t slated to be out on patrol today, you nevertheless can’t seem to find her where you’d normally expect to see the ebony beauty, and the camp is too large to go scouring the place for a single person.", parse);
	Text.NL();
	Text.Add("You’re just about to give up when a small cough sounds from behind you. <i>“I’ve been told that you were looking for me, [playername]. Was there any particular reason?”</i>", parse);
	Text.NL();
	Text.Add("Maria sure does move silently when the mood takes her, doesn’t she? You turn to see the buxom archer standing behind you, clad in her usual outfit of white shirt and leather pants - the deep, earthy smell of the forest is still heavy on her, the scent of dirt, leaves and sap. Instead of bow and quiver, though, she holds a large bouquet of freshly-picked wildflowers of all colors, wrapped up in a sheaf of white linen fabric and tied with a purple ribbon.", parse);
	Text.NL();
	Text.Add("To see Maria with a bunch of flowers is slightly out of place, to make an understatement. Perhaps it’s due to the way she introduced herself to you, but you’d never figure her for being one for pretty petals. Nevertheless, you quickly explain your reasons for wanting to find her, and she eyes you, her lips moving as she thinks.", parse);
	Text.NL();
	Text.Add("<i>“Well, then. I’m sorry for keeping you waiting, but I had something important to do just now.”</i> She indicates the bouquet in her hands. <i>“Actually, it’s probably for the best that you showed up right now, [playername].”</i>", parse);
	Text.NL();
	Text.Add("How so?", parse);
	Text.NL();
	Text.Add("<i>“I know you’ve been going around camp, making your face known, talking to people.”</i> Put like that, her words sound like more of an accusation than a statement… <i>“Despite the way you ended up here, you’ve been trying to get chummy with folk in camp and making yourself useful to boot, and I appreciate that.”</i>", parse);
	Text.NL();
	Text.Add("Why, she should think nothing of it. It was only polite, of course.", parse);
	Text.NL();
	Text.Add("<i>“There’re good people here with us,”</i> Maria continues. <i>“Admittedly, there’re also those who aren’t that good, but we see to it that the former keep the latter under control. But everyone’s in this together, [playername], and I think it best that you might want to come along with me for a little while. It shouldn’t take more than an hour or two, and if you want to understand us better, I think it’ll do more for that than wandering around camp and schmoozing with people who’re supposed to be on duty.”</i>", parse);
	Text.NL();
	Text.Add("Does it have anything to do with the bouquet in her hands?", parse);
	Text.NL();
	Text.Add("Maria turns her gaze away from you. <i>“Yes.”</i>", parse);
	Text.NL();
	Text.Add("Oh.", parse);
	Text.NL();
	Text.Add("<i>“We may not have gotten off on the best foot, [playername], so I’m asking if you’ll come along - weren’t you looking for me, anyway? I’m sure you agree it’s probably a better way of extending an invitation than holding you hostage and frogmarching you along the forest trails.”</i>", parse);
	Text.NL();
	Text.Add("Well, when she puts it like that, yes, it is. Where does she intend to bring you?", parse);
	Text.NL();
	Text.Add("<i>“Back out into the forest. I had to head back to camp for a moment - flowers are abundant here in the forest, but cloth and ribbons aren’t.”</i>", parse);
	Text.NL();
	Text.Add("That… doesn’t really tell you anything of use. Wondering why Maria’s being evasive, you shrug and prepare to follow her out - considering the serious bent of her expression and the fact that she was nice enough to ask you, saying no at this juncture is probably a bad idea. She clearly doesn’t intend you any harm, anyway.", parse);
	Text.NL();
	Text.Add("<i>“No objections? Nothing you suddenly remembered you’ve to do right now?”</i> Hearing none from you, Maria gives you a nod and starts off towards the gates. <i>“Let’s go, then.”</i>", parse);
	Text.NL();
	Text.Add("The trip through the outlaws’ camp and the forest is brisk and uneventful. Snapping to attention at the sight of Maria, the gate sentries lower the drawbridge to let the both of you through, and from there it’s a short walk along the forest trails, shafts of [afternoonevening] sunlight piercing the canopy and illuminating the way forward. This part of the forest isn’t familiar to you - now that you think about it, you left the major trails some time ago.", parse);
	Text.NL();
	Text.Add("Before long, though, the trail widens out into a small forest clearing, surrounded on all sides by evergreen trees; silence reigns all about you, enough for you to hear the soft crunch of pine needles underfoot as the two of you draw close to the rocky mound in the glade’s center.", parse);
	if(WorldTime().season != Season.Winter)
		Text.Add(" Small white wildflowers and tall poppies grow in clumps amidst tall blades of grass, letting loose a faint floral fragrance into the air.", parse);
	Text.NL();
	Text.Add("Maria strides up to the mound, her feet chewing up the distance in broad, easy steps, and as you draw closer you see that someone’s set a rectangular stone slab - no, <i>two</i> such stone slabs atop its crest. Rows upon rows of names have been neatly etched into the otherwise blank, smooth stone, running its entire length with nary a single jot of space wasted. The second slab is slightly smaller, but still similarly adorned with some room left over. There are bouquets, too, laid at the foot of the slabs - the flowers wilted and fabric decaying as they return to nature, making for a most poignant scene.", parse);
	Text.NL();
	Text.Add("Slowly, Maria steps up onto the mound, kneels before the slab, and sets her bouquet with the others. Moments tick by, the only sound in the glade being that of breathing and a faint breeze that winds its way in through the trees.", parse);
	Text.NL();
	Text.Add("At last, she speaks. <i>“Do you know why I brought you here, [playername]?”</i>", parse);
	Text.Flush();
	
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "You can probably hazard a guess, yes.",
		func : function() {
			Text.Clear();
			Text.Add("With the bouquets and names, it’s not too hard to guess what this is supposed to be - a memorial of some sort, isn’t it? And the names… you’re guessing that they were outlaws who died while out and about outlaw business, right?", parse);
			Text.NL();
			Text.Add("Maria laughs, although there is no joy in the sound. <i>“If only we had the numbers to warrant this many forays in order to lose all these people, [playername]. No, these aren’t those who died fighting. The names here are of those who died all those years back, and only live on in our memories.</i>", parse);
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "No",
		tooltip : "While you can guess, you’re not a mind-reader.",
		func : function() {
			Text.Clear();
			Text.Add("Hmm… you can probably guess that this is a memorial of some sort, but as to <i>why</i> Maria brought you here… well, part of it’s probably that she wants to impress upon you the numbers of the dead. Beyond that, though, it’s anyone’s guess. Perhaps she could be so kind as to tell you?", parse);
			Text.NL();
			Text.Add("<i>“This is where we remember those who died in the civil war all those years back, [playername]. Nameless in the official records, remembered only by those they were close to, their bodies never found.</i>", parse);
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	
	Gui.Callstack.push(function() {
		Text.NL();
		Text.Add("<i>“Trampled underfoot by horses, cut down in the streets and in their homes, just ordinary people caught up in something they had no hand in creating and wanted no part of. Their bodies never found, in all likelihood thrown onto bonfires or into mass graves. Those who escaped with their lives were left to wonder until they could accept that the missing were never coming home.”</i>", parse);
		Text.NL();
		Text.Add("Maria stops a moment to let her words sink in, breathing heavily as she considers her next words. <i>“Each time someone joins the outlaws, [playername], we ask them if they have anyone whom they lost in the war. It doesn’t matter what the exact relation was, so long as whoever it was was cherished by another - we take the name given and chisel it onto the list here.”</i>", parse);
		Text.NL();
		Text.Add("It’s sobering, when you think about it. There must be about a thousand names etched into the stone - each slab is almost as tall as Maria is, and twice as wide. You resist the urge to reach out and run your fingers along the cold stone, and instead settle for running your gaze across the names of the deceased:", parse);
		Text.NL();
		Text.Add("<i>Rolf “Smiley” Erikson</i><br>", parse);
		Text.Add("<i>Michael</i><br>", parse);
		Text.Add("<i>Angela Nestrus</i><br>", parse);
		Text.Add("<i>Reina, daughter of Valerie</i><br>", parse);
		Text.Add("<i>Enrico</i><br>", parse);
		Text.Add("...", parse);
		Text.NL();
		Text.Add("They just stretch on and on, spidery scrawl across grey stone, and you swallow hard. <i>“Beyond these are the nameless thousands who didn’t have someone to remember them, whole family lines wiped out and forgotten.”</i> The huntress turns to look at you, her eyes filled with sadness.", parse);
		Text.NL();
		Text.Add("<i>“As to why I asked you to accompany me while I paid my respects, [playername]... I had hoped to impress upon you what we’re fighting for here.”</i> Maria’s voice trembles. <i>“There were mass graves, everyone knows that - there simply wouldn’t have been enough time or money to give all the bodies on the streets a proper burial before they began to rot - but no one can remember just where they were sited. This is all we’ve left - names upon names, brought to us by those who still remember. This is part of why we fight - so that they won’t be forgotten, so that more won’t have to join them.”</i>", parse);
		Text.NL();
		Text.Add("You feel like you should say something at this point, but what?", parse);
		Text.Flush();
		
		OutlawsScenes.MariasBouquetPrompt({});
	});
	
	Gui.SetButtonsFromList(options, false, null);
}

OutlawsScenes.MariasBouquetPrompt = function(opts) {
	let player = GAME().player;
	let outlaws = GAME().outlaws;

	var parse = {
		playername : player.name
	};
	
	//[Respects][Monument][Bouquets]
	var options = new Array();
	if(!opts.Respects) {
		options.push({ nameStr : "Respects",
			tooltip : "Since she’s paying her respects here, you take it she lost someone?",
			func : function() {
				Text.Clear();
				Text.Add("Trying not to phrase your words too bluntly, you ask Maria if there’s someone here that she remembers.", parse);
				Text.NL();
				Text.Add("<i>“Not someone, [playername],”</i> she corrects you. <i>“Someones. My family didn’t know what was going on at the time, and answered a knock at the door. The Royal Guard dragged them out into the street screaming - my father, mother, and elder brother - and I never saw them again. They searched the place but not very thoroughly, because I got away by hiding under a basket.”</i>", parse);
				Text.NL();
				Text.Add("That must have been horrible for the young girl that she must have been to go through. Are… are their names carved here, too?", parse);
				Text.NL();
				Text.Add("<i>“No. I don’t know their names, [playername]. I had no need of them; they were always ‘Papa’, ‘Mama’, and ‘Brother’ to me. And while I still remember something of their faces, the memory grows dimmer with each passing year.”</i> Maria’s voice is strangely quiet. <i>“If I were to die tomorrow, there’d be no one in all the planes who remembers them anymore.</i>", parse);
				Text.NL();
				Text.Add("<i>“In the beginning, I used to wonder if at least one of them still lived, since I never saw any bodies. I’ve long since grown out of such fancies - Zenith is my only family now, has been since I was… four? Five? I’m not even sure how old I was when it all happened. All my memories from that time are so hazy…”</i>", parse);
				Text.NL();
				Text.Add("Maria falls silent, and you realize that it’s probably not too good an idea to push her too hard on this subject right now. She’ll tell you more when she’s ready.", parse);
				Text.Flush();
				
				opts.Respects = true;
				
				OutlawsScenes.MariasBouquetPrompt(opts);
			}, enabled : true
		});
	}
	if(!opts.Monument) {
		options.push({ nameStr : "Monument",
			tooltip : "So, is there anything she can tell you about this monument? Who built it?",
			func : function() {
				Text.Clear();
				Text.Add("<i>“I don’t know,”</i> she replies flatly. <i>“It was one of the earliest outlaws who set it up, I think - back then, we weren’t even calling ourselves by that name, let alone taking pride instead of shame from it. The first time I came across it was when Zenith took me here and asked me if I remembered my family’s names, so he could get them down on the stone. Back then, there was only one of them, and as many sides in use.”</i>", parse);
				Text.NL();
				Text.Add("Things have changed a lot since then, haven’t they?", parse);
				Text.NL();
				Text.Add("Maria nods. <i>“And we do have many more comrades-in-arms with us now, many of them adding their share to the list. Yet no matter how many names are gathered here, they only represent but a small portion of all the death that Rewyn has caused. But back to the point - as you can see, we eventually used up the entirety of both sides about five years back, so Zenith asked one of the stoneworkers in camp if he’d put up another one.</i>", parse);
				Text.NL();
				Text.Add("<i>“There’s really not much I can tell you about it; history’s not a subject that’s held my interest if it doesn’t involve me. You’d have to ask Zenith in order to get the full story as it stands.”</i>", parse);
				Text.NL();
				Text.Add("All right, then. Maybe you’ll ask him if you ever get the chance to do so.", parse);
				Text.Flush();
				
				opts.Monument = true;
				
				OutlawsScenes.MariasBouquetPrompt(opts);
			}, enabled : true
		});
	}
	if(!opts.Bouquets) {
		options.push({ nameStr : "Bouquets",
			tooltip : "Judging by the other bouquets, she’s not the only one to come here, is she?",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Most of us who’ve been here for a long time lost someone or the other to the war,”</i> Maria replies, her gaze steely and trained on the names that line the monument. <i>“It’s only more recently that we’ve had those who’d the good fortune to escape the worst of it by being born after the fact.</i>", parse);
				Text.NL();
				Text.Add("<i>“Seeing those you care for die or even worse, wondering what happened to them for years on end… or being thrown out of your home on trumped-up charges on account of what you are… it’s not much of a consolation.”</i>", parse);
				Text.NL();
				Text.Add("You have to agree with Maria - it’s not very much of a choice.", parse);
				Text.NL();
				Text.Add("<i>“We’re all busy back at the camp, but I come when I can. Others, too… although even I don’t get the chance to make bouquets very often - not that I know very much about doing so, I just take some flowers and wrap them up. Fabric can be in short supply sometimes, too short to waste it on the dead when the living still need it.”</i>", parse);
				Text.Flush();
				
				opts.Bouquets = true;
				
				OutlawsScenes.MariasBouquetPrompt(opts);
			}, enabled : true
		});
	}
	if(options.length > 0)
		Gui.SetButtonsFromList(options, false, null);
	else {
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("At long last, Maria sighs, and you realize that you’ve been standing here talking for quite a while now. <i>“After coming to this place, [playername], I hope you’ve a deeper understanding of what we’re fighting for here. I don’t want you to throw your lot in with us and then get cold feet because you didn’t realize what you were getting yourself into, or if you disagree with us on a few points here and there. If you choose to lend us your strength, then we’ll be relying on you - and the other way around, too.</i>", parse);
			Text.NL();
			Text.Add("<i>“I want you to know how important being part of Zenith’s outfit is to at least some of us; it’s the only remotely feasible chance we have of changing things as they stand in the kingdom. I also want you to know what all of this means to us, above and beyond the cut-and-dried attitude towards morphs you can find on the streets of Rigard, or when it comes to pure humans like me. All of us have our own stories of how we ended up in this forest, [playername], but the tales all come from the same source: the bloodshed in the streets of Rigard all those years ago.”</i>", parse);
			Text.NL();
			Text.Add("You lick your lips, a little unsure of what to say.", parse);
			Text.NL();
			Text.Add("<i>“I think I’ll stay here a little longer. Why don’t you go on ahead back to the camp?”</i> Maria tosses her hair and settles into a more comfortable kneeling position, her hands on her kneecaps. She’s clearly into this for the long haul. <i>“I trust you’re familiar enough with the forest and our signs that you can find your way back.”</i>", parse);
			Text.NL();
			Text.Add("Indeed, you can. You’re about to turn and leave when Maria clears her throat.", parse);
			Text.NL();
			Text.Add("<i>“One last thing, [playername].”</i>", parse);
			Text.NL();
			Text.Add("Yes?", parse);
			Text.NL();
			Text.Add("<i>“Since you’ve been so accommodating, I’ll put in a good word for you with Zenith. He’s not one to give his trust easily - letting you know where our camp is was already a huge gesture of goodwill on his part - but I’m sure we can come up with a way to determine if you’re truly interested in our cause or not. Now, I’d like to be alone.”</i>", parse);
			Text.NL();
			Text.Add("Nodding, you start on your way out of the glade, a soft rustling echoing in the air as you make your way through the tall grass field. The last sight you have of Maria is that of the archer prostrating herself before the memory of the deceased, her head bowed and eyes closed even as a stiff breeze carries red and white petals through the air.", parse);
			Text.Flush();
			
			TimeStep({hour: 3});
			outlaws.mainQuestTimer = new Time(0,0,1,0,0);
			outlaws.flags["Met"] = OutlawsFlags.Met.Bouqet;
			
			Gui.NextPrompt();
		});
	}
}

OutlawsScenes.PathIntoRigardInitiation = function() {
	let player = GAME().player;
	let party = GAME().party;
	let outlaws = GAME().outlaws;

	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("As you step over the trench and through the camp gates, you’re about to be on your way into the camp proper when you’re stopped just beyond the walls. It’s the very same fox-morph who was scrutinizing you on the way in when you first arrived. Gone is the greatsword, and he’s wearing a flat, broad-brimmed hat of black felt that matches his vest and leggings, and touches its brim in greeting as he steps forward.", parse);
	Text.NL();
	Text.Add("<i>“[playername], was it? Got a bit of business with you on behalf of the boss-man.”</i> He holds out a hand-paw covered in russet fur towards you - or at least, the parts that aren’t covered by his open-fingered leather gloves. <i>“First things first, though; I don’t think we’ve been properly introduced. My name’s Vaughn, no last name, and I’m in charge of keeping this camp safe for everyone living inside these walls.”</i>", parse);
	Text.NL();
	Text.Add("You take Vaughn’s hand and shake it; his grip is sturdy and firm, but not crushing. So, if he’s responsible for camp security, you take it that the stake-filled trench and broad walls were his doing?", parse);
	Text.NL();
	Text.Add("<i>“More along the lines of patrols, guard rotations and maintenance,”</i> Vaughn replies. <i>“The beginnings of the wall and trench were already there when I first arrived; I just helped out a bit in getting them up to snuff. I was in His Majesty’s first engineering corps, you see.”</i>", parse);
	Text.NL();
	Text.Add("Sensing a story in the waiting, you urge him to continue. Vaughn looks appropriately contemplative for a moment or so, then shrugs, an easygoing roll of his shoulders. <i>“Not much of a story, really. Still remember the day - order came down from above to utterly destroy the Merchant’s Guild guildhall through the most vicious means possible, and when you have alchemy at your side, vicious can get pretty much so. Naturally, we protested; you simply don’t do that sort of thing in a place like Rigard where so many people are packed together. That got us threatened with charges of insubordination.</i>", parse);
	Text.NL();
	Text.Add("<i>“One-quarter of us, me included, deserted on the spot. Another quarter took the insubordination charge. And even with half of His Majesty’s first and finest combat engineers tying their hands, there’s a reason why no one remembers what the old guildhall looks like. I drifted out and about for a while, tried my hand as a mason and a carpenter, then someone I was working for knew these outlaw people and here I am. That was years ago.”</i>", parse);
	Text.NL();
	Text.Add("You wonder just what Vaughn meant by ‘most vicious means possible’; by the sound of it, what went down was a pretty nasty piece of work. First things first, though - you ask the fox-morph just what business he had with you.", parse);
	Text.NL();
	Text.Add("<i>“Right.”</i> He perks up. <i>“The boss-man wanted to see you in the map room - that’s the place where you were brought first time you were marched in here by Maria. You still remember how to get there?”</i>", parse);
	Text.NL();
	Text.Add("Yes, you do.", parse);
	Text.NL();
	Text.Add("<i>“Well then, don’t let me hold you up. I’ll admit that I was a tad leery of you when you first came in, but you can’t be all bad if the boss-man’s taken a shine to you. He’s got a sixth sense that way.”</i> With that, Vaughn gives you a wave, touches the brim of his hat once more, then turns back to the gates.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("The trip to the map room, as Vaughn termed it, is short and sweet. Even if you’d forgotten the way - something that’s not likely considering the memories associated with it - it’s not hard to find, being one of the few actual buildings in the camp instead of a tent of some sort. Plain and utilitarian, yet sturdily constructed, it sits amidst a sea of tents, awaiting your approach.", parse);
		Text.NL();
		Text.Add("The outlaws’ camp itself is busy at all times - day or night, there’s always someone digging, cooking, cleaning, chopping, singing and eating at any moment. You pass by a couple of lizard-morphs doing their laundry in the river, engrossed in their work and not even giving you a second glance as you pass by the riverbank. Several individuals of various species have gathered in a circle, playing a game of cavalcade as they drink moonshine out of old glass bottles, while at a nearby woodpile, some others split timber and fashion planks. Being an outlaw is a full-time job, it seems, even in one’s leisure time.", parse);
		Text.NL();
		Text.Add("At last, though, you arrive in front of the door, and give it a sharp rap with your knuckles. It isn’t long before it swings open, revealing Zenith in the doorway; the outlaw leader eyes you, staring intently at your face as if the mysteries of the planes are etched into your features. At length, his serious expression breaks into a small smile. <i>“Welcome, [playername]. I take it that you’re here about the job?”</i>", parse);
		Text.NL();
		Text.Add("Yes, you are. Vaughn told you as much when he stopped you at the gates.", parse);
		Text.NL();
		Text.Add("<i>“Well then, do come in. I’ll tell you more about it inside.”</i>", parse);
		Text.NL();
		Text.Add("You see no reason to refuse Zenith’s invitation, and allow the outlaw leader to usher you inside, the room dim with shutters and windows drawn. The table is still there, with its map and papers, and Zenith pulls up a seat for you before rummaging about in the mess.", parse);
		Text.NL();
		Text.Add("<i>“Ah, here we go,”</i> the badger-morph says, pulling out a small envelope with a grin and flourish. <i>“Maria’s told me that you’ve been putting in the effort to make yourself useful around camp and understand what we’re all about, [playername]. People notice things like that, big and small, and if you want to prove yourself, it’d be wrong of me to not give you an opportunity to do just that.”</i>", parse);
		Text.NL();
		Text.Add("He waves the plain, unsealed envelope in the air. <i>“I would like you to deliver this missive to one of our operatives stationed in Rigard - it holds a freshly-prepared set of directives concerning our future movements.”</i>", parse);
		Text.NL();
		if(!rigard.Visa()) {
			Text.Add("There’s a small problem with that, though. You can’t get into Rigard without a visa.", parse);
			Text.NL();
			Text.Add("<i>“That shouldn’t be a problem.”</i>", parse);
			Text.NL();
		}
		Text.Add("Oh?", parse);
		Text.NL();
		Text.Add("Zenith nods. <i>“You won’t need to get into the city proper. By the gates, there’s a small inn - the Spitting Lion Inn - meant to house poor bastards who get locked out after dark and have to wait to dawn to get into Rigard. Place’s been doing booming business since the latest restrictions on getting in and out of the city came into effect, but that’s beside the point. Every day at noon, one of our operatives comes in to pick up information from those sympathetic to our cause. All you need to do is to deliver this letter to her, a simple task; show it to her and she’ll take it from there. Go into one of the booths, order a drink, and wear this while you’re at it.”</i>", parse);
		Text.NL();
		Text.Add("He hands you a white neckerchief, which you stow away in your pocket. <i>“Now, you’ll probably want to know how to recognize her - you won’t. She’ll approach you and give you our symbol.”</i> He then sketches a brief pattern in the air, that of a three-fingered paw; you quickly commit it to memory.", parse);
		Text.NL();
		Text.Add("<i>“There is one thing I must stress - the contents are for her eyes only, so I don’t think you need telling as to how you’re to handle the letter.</i>", parse);
		Text.NL();
		Text.Add("<i>“That’s all I have for you,”</i> Zenith says, pressing the letter into your hands. <i>“I think I’ve made myself clear enough on what’s to be done; Maria asked if I could give you something to do in order to show that you could be trusted, and here we have it. Now if you’ll excuse me, I have a few disputes to settle in the next hour, so if you’d give me a few moments to myself, that’d be most appreciated.”</i>", parse);
		Text.NL();
		Text.Add("All right, you get the hint. Standing from your seat and stowing away the letter with your other possessions, you make to excuse yourself and step out of the building back into fresh, open air. Well, you’ve been assigned a simple courier task, nothing more. How hard could it be? You’ll probably be there and back before too long.", parse);
		Text.Flush();
		
		//TODO quest log
		
		party.Inv().AddItem(Items.Quest.OutlawLetter);
		
		TimeStep({hour: 1});
		
		outlaws.mainQuestTimer = new Time(0,0,2,0,0);
		outlaws.flags["Met"] = OutlawsFlags.Met.Letter;
		
		Gui.NextPrompt();
	});
}

OutlawsScenes.PathIntoRigardBelinda = function() {
	let player = GAME().player;
	let party = GAME().party;
	let outlaws = GAME().outlaws;
	let miranda = GAME().miranda;
	let belinda = GAME().belinda;

	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	parse["season"] = WorldTime().Season == Season.Winter ? "hot drinks to warm oneself up on a cold day" : "cool drinks to help one beat the noon heat";
	Text.Add("Realizing it’s nearing noon and remembering the task Zenith sent you off on, you seek out the inn that Zenith mentioned. Close enough to the city but far enough from the gates that it’s not worth the watchmen’s time to go harass them, the road is lined with those seeking the crowds that the city draws, but are unable or unwilling to enter the city to get at the marketplaces proper. Makeshift stands have been set up by the wayside, peddling everything from homemade blankets and fresh fruit to [season], hoping to catch an impulse purchase from those coming to and from Rigard.", parse);
	Text.NL();
	Text.Add("What you’re more interested in, though, is this Spitting Lion Inn that Zenith mentioned. The buildings in sight of the road are well-spaced, mostly catering to travelers - these aren’t the slums, after all - and you scan the wayhouses and watering holes as you pass them by, hoping to find your point of contact with a minimum of fuss. Alas, that’s not to be - you’re practically in the shadow of the walls and up against them by the time it draws into view.", parse);
	Text.NL();
	Text.Add("The inn’s a little out of the way along the walls and out of sight from the gates - some minutes’ walk along a dirt path from the entrance and around a bend in the wall - which explains why you didn’t notice it before on your earlier approaches to Rigard. A three-story affair of stone and brick, it’s nestled comfortably in Rigard’s shadow like a mushroom on the roots of a tree. As you approach, the first thing that calls your attention to the inn is the miniature lion’s-head fountain by the entrance, no doubt the establishment’s namesake. Water gushes from the figurehead’s bronze maw and into a basin in which patrons wash their hands before entering the building.", parse);
	Text.NL();
	Text.Add("Zenith wasn’t wrong, either: business is booming. Courtyard and common room alike are practically packed with people from all walks of life, bustling and jostling against each other; a few caravans stand stabled against the walls while those in the train seek a hot meal, either to celebrate the end of a successful trip or to steel oneself for the road that lies ahead. The tables of the common room may be somewhat clean and the straw and sawdust replaced with reasonable regularity, but it’s nowhere near high-class and frankly, it shouldn’t be.", parse);
	Text.NL();
	Text.Add("Ignoring the scent of greasy, heart-stopping food and freshly brewed drink being served, you make your way to the rear where the booths are, standing on a raised platform and offering whatever little privacy they have to afford in a place like this. Only one of them is occupied at the moment, and after a cursory pat to make sure the letter’s still on your person, you slip in and settle yourself down on the cushioned seats to wait for your contact, tying the neckerchief about your collar.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		if(belinda.Met()) {
			Text.Add("<i>“Oh-ho, look at who it is. This is quite the surprise.”</i>", parse);
			Text.NL();
			Text.Add("The voice is unmistakably Belinda’s, but the face isn’t - or at least, not the Belinda you know from The Shadow Lady. Perhaps it’s the shadows and dim lighting in the booth, the peasant’s shift that she’s wearing, or the way that she’s done up her lovely long curls in a bun - the Belinda that enters the booth, drink in hand, has put on at least ten years and more than a few blemishes befitting someone who might have spent years working the fields and herding sheep under the hot sun. She looks older, harder, more rough around the edges.", parse);
			Text.NL();
			Text.Add("What <i>is</i> she doing here? It can’t be… can it? Your question’s answered when she dips a finger in her glass, draws the outlaws’ symbol on the table, then quickly rubs it out with the heel of her hand.", parse);
			Text.NL();
			Text.Add("And you never suspected.", parse);
			Text.NL();
			Text.Add("<i>“Oh, don’t look so shocked,”</i> the dobie says, a small smile crossing her muzzle. <i>“Makeup isn’t only used to accentuate one’s looks, you know. Most people rely too heavily on faces, and even then they don’t pay very much attention; all I have to do is give them a few cues on what they ought to be seeing. You didn’t think that I’d be visiting this kind of place straight off work, did you?”</i>", parse);
			Text.NL();
			Text.Add("No, admittedly not.", parse);
			Text.NL();
			Text.Add("<i>“Now, then. If you knew to find me here and are wearing the badger’s collar to boot, then undoubtedly you have some business with me that’s quite… special. Foreplay’s over, let’s get down to business.”</i>", parse);
		}
		else {
			Text.Add("The dobie woman who enters the booth is… well, not quite Miranda, but close enough. There’s the same cut of the face, chin and muzzle, those striking green eyes, but other than that… no, they’re not the same person, but very definitely related. Perhaps a cousin, close enough to be a sibling if you squint and look at her from the right angle. Clad in a simple peasant’s shift, she holds a glass in her hands; the prim, proper bun she’s done her hair into, coupled with her serious expression and beginnings of wrinkles about her eyes, leads you to guess that she’s probably in her early or mid-thirties, with a life of hard work behind her.", parse);
			Text.NL();
			Text.Add("Neither is she built like Miranda - there’s a softer feel about her, although considering Miranda, that isn’t saying much - a little shorter, not obviously so but enough one to notice if one thinks about it.", parse);
			Text.NL();
			Text.Add("Eyeing your neckerchief, the dobie woman dips a finger into her mug and draws the outlaws’ symbol on the table, quickly rubbing it out with the heel of her hand as she seats herself. Yes, she’s your contact all right, for better or for worse.", parse);
			Text.NL();
			Text.Add("<i>“You’re a new face.”</i>", parse);
			Text.NL();
			Text.Add("Odd. There’s something about the dobie’s voice - deep and husky - that doesn’t quite mesh with her appearance, but you can’t quite put your finger on it. Yes, you reply, you’re indeed a new face.", parse);
			Text.NL();
			if(miranda.Nice()) {
				if(party.Num() == 2) {
					var p1 = party.Get(1);
					parse["comp"]  = p1.name;
					parse["heshe"] = p1.heshe();
					parse["was"]   = p1.plural() ? "were" : "was";
				}
				else if(party.Num() > 1) {
					parse["comp"]  = "your companions";
					parse["heshe"] = "they";
					parse["was"]   = "were";
				}
				parse["c"] = party.Num() > 1 ? Text.Parse(", ignoring [comp] as if [heshe] [was]… [heshe] [was]… well, something that wasn’t important", parse) : "";
				Text.Add("<i>“And who might you be?”</i> Her deep green eyes are focused on you[c].", parse);
				Text.NL();
				Text.Add("You quickly introduce yourself, and she nods. <i>“Well then, [playername], it’s a pleasure to meet you in the flesh. I’ve been observing you on the side ever since you got to know Miranda. Don’t worry - you’ve done nothing that would give me reason to think ill of you.”</i>", parse);
				Text.NL();
				Text.Add("Wait. So your suspicions were right - they <i>are</i> related.", parse);
				Text.NL();
				Text.Add("<i>“Oh, my name is Belinda; I’m Miranda’s sister. The resemblance is there, isn’t it?”</i> Belinda raises a hand to her cheek and tests it with her fingers. <i>“Not so much that others can’t tell us apart, but still distinct. Yes, she’s my sister, as… ah… impulsive as she is.”</i>", parse);
				Text.NL();
				Text.Add("Well, that’s one way of describing Miranda.", parse);
				Text.NL();
				Text.Add("<i>“We don’t really get together anymore, especially since the differences in our chosen professions often keep us apart. Quite different working hours, as you’d imagine. Still, I try to watch out for her when I can, repay what she did for me when we were younger, you know?</i>", parse);
			}
			else {
				Text.Add("<i>“I know about you, too.”</i> The dobie woman’s voice drops several degrees - not quite icy cold, but very definitely chilly. <i>“You didn’t have to be a complete ass to Miranda. She was quite upset about you walking out on her.”</i>", parse);
				Text.NL();
				Text.Add("Oh. They’re related.", parse);
				Text.NL();
				Text.Add("She nods. <i>“My name’s Belinda, and I’m Miranda’s sister; even if we don’t get together very often anymore, I try to watch out for her from where she’s not looking. You’re not the first one who’s done just that after her confessing her little secret to you. Nor the second. Nor the third. After a while, the sight gets… tiring.</i>", parse);
				Text.NL();
				Text.Add("<i>“As the sister with the more level head, I had to talk her out of finding you and beating you to a pulp. In my current capacity however, I’m not about to let my emotions get in the way of my duties. Besides, Zenith must see <b>something</b> in you, or else he wouldn’t have sent you to me.</i>", parse);
				Text.NL();
				Text.Add("<i>“All this said, though, don’t imagine that she’s let you off the hook, or that I’ll have any sympathy for what she might do to you.”</i>", parse);
				Text.NL();
				Text.Add("<i>Oh.</i>", parse);
				
				belinda.relation.DecreaseStat(-100, 5);
			}
			Text.NL();
			Text.Add("<i>“Now,”</i> Belinda continues, <i>“if you’re sitting here, I trust that there’s something you have to hand over.”</i>", parse);
		}
		Text.NL();
		Text.Add("Why yes, you do have business with her. Drawing Zenith’s envelope out from amidst your possessions, you pass it along to Belinda without any further commentary. The doberwoman sets down her drink, peels open the envelope…", parse);
		Text.NL();
		Text.Add("…And tips it over to reveal a small sheaf of papers. Your breath catches in your throat as Belinda stretches open the envelope’s mouth to get a better look at what’s inside, the stiff brown paper folding under her fine, delicate fingers, then draws out the lot and rips them to pieces without even so much as looking at them. Tiny scraps of paper float to the floor, dotting the straw-and-sawdust floor like new snow.", parse);
		Text.NL();
		
		party.Inv().RemoveItem(Items.Quest.OutlawLetter);
		
		Text.Add("Wait, what’s going on? Wasn’t that supposed to be a missive about -", parse);
		Text.NL();
		Text.Add("<i>“Congratulations,”</i> Belinda says dryly, interrupting your thoughts. <i>“You can follow instructions, and therefore pass.”</i>", parse);
		Text.NL();
		Text.Add("The doberwoman lowers her voice to a whisper before continuing. <i>“It was a test, and quite a basic one at that. All you had to do was to deliver the missive here in a punctual fashion, while obeying the simple instruction to not tamper with the envelope or its contents. In so doing, you’ve managed to prove some measure of trustworthiness, although exactly how much will be revealed in the days to come.”</i>", parse);
		Text.NL();
		Text.Add("And… the papers inside, with all those words and things? And how could she tell, anyway?", parse);
		Text.NL();
		Text.Add("<i>“Plausible but utterly false information,”</i> Belinda replies with a smile. <i>“Had you decided to snitch us out to our enemies, you’d be walking whoever acted on your tip-off into quite the nasty trap. Then you’d have to deal with us <i>and</i> whoever you decided to sell us out to. As for how I could tell whether the letter was tampered with… well, that’s for me to know and for you to find out. Maybe you could ask Zenith, although I doubt he’d let that slip either. Perhaps if you prove yourself trustworthy over a long period of time… maybe you’ll be here in my place someday, vetting a new hire.”</i>", parse);
		Text.NL();
		Text.Add("Right. So… what happens now? Does she give you something to take back to Zenith?", parse);
		Text.NL();
		Text.Add("<i>“By sending you to me, Zenith probably wants you to act as an operative in Rigard for him. While it’s never been formalized, I’m in charge of overseeing most of our agents in the city for the moment, while Elodie sees to the palace.”</i>", parse);
		Text.NL();
		if(belinda.Met()) {
			Text.Add("From the brothel?", parse);
			Text.NL();
			Text.Add("The doberwoman nods and takes another sip of her drink. <i>“Why, yes. It’s in quite the central location, all sorts and shapes of people come in and go out from dawn to dusk… bringing in all sorts of gifts for their favorite whores, and departing with keepsakes. Besides, the Royal Guard never harasses The Shadow Lady, and that’s a very big plus for the likes of us.”</i>", parse);
			Text.NL();
			Text.Add("They don’t? Does Lucille pay them off so they leave her alone, or perhaps she gives them special rates or favors? Even if it’s patronized by the well-to-do, a place like The Shadow Lady would at least have garnered some interest from the more zealous Royal Guards.", parse);
			Text.NL();
			Text.Add("Belinda looks thoughtful at this, her eyes drawn into the distance as she scratches her chin. <i>“You by far underestimate the pull Madame Lucille has with Rigard’s upper crust, [playername]. If the Royal Guard were to raid The Shadow Lady any night of the week, they’d find no less than a dozen important personages rutting away in the upstairs rooms, not to speak of those on the floor. Well, maybe not that many - rutting might be too weak a word for some of the things they get up to - I should know. Trust me, my workplace isn’t going to see a single Royal Guard, except maybe as customers.</i>", parse);
		}
		else {
			Text.Add("All right, so when you’re in the city on outlaw business, you’re under her thumb.", parse);
			Text.NL();
			Text.Add("<i>“That’s more or less right, although it’s less of being under my thumb and more in my view. I don’t dictate how anyone should do something, so long as it doesn’t sully our name and gets the job done to satisfaction. Most operatives in Rigard are given much autonomy to do as they please, and report to me at regular intervals, or when something crops up.</i>", parse);
			Text.NL();
			Text.Add("<i>“You, however, are more of a borderline case, since you don’t actually live in the city. Since you can move freely, you’ll likely report back to Zenith and company back at the camp. I think that’s the best arrangement of things as they stand.”</i>", parse);
			Text.NL();
			Text.Add("Come to think of it, where is she situated in the city?", parse);
			Text.NL();
			Text.Add("<i>“The brothel. I’m a whore.”</i>", parse);
			Text.NL();
			Text.Add("<i>What?</i>", parse);
			Text.NL();
			Text.Add("<i>“You know, a whore. A hussy, a prostitute, a practitioner of the world’s oldest profession, one who spreads her legs for money, a tag, an escort…”</i> The dobie whistles innocently and flicks her ears. <i>“Why do you look so surprised, [playername]? The names for those in my line of work are endless.”</i>", parse);
			Text.NL();
			Text.Add("It’s not that. It’s just that she… well, she doesn’t look like one. Too rough around the edges for that, if she gets your meaning…", parse);
			Text.NL();
			Text.Add("<i>“Ah,”</i> Belinda replies, raising a finger to her lips. <i>“How did the saying go again? ‘You only really control something when you can both bestow it on others and take it away, not just one or the other’? Knowing how to dress in order to draw attention and please the eye is considerably well-studied, but less so is the art of dressing in order to avoid notice. Trust me, you won’t find me working the floor with Nikki and the lot of them. My shows and services are only available via…”</i> she pauses a moment for effect, and runs her tongue salaciously across her muzzle; the mask and makeup slip away for a fraction of a second, and you see her as she is. <i>“Special request.”</i>", parse);
			Text.NL();
			Text.Add("What kind of special requests would these be?", parse);
			Text.NL();
			Text.Add("<i>“Oh, some - admittedly not all - nobles need good, private sex, a place where they can let their deviancy run free without fear of backlash. Can’t have the cream of the city rutting with animals like me, can we? Madame Lucille has her theme rooms, but there’s nothing quite like the pull of actual flesh and blood, especially those who know how to work what they have.</i>", parse);
			Text.NL();
			Text.Add("<i>“Of course, Madame Lucille assures her patrons utmost privacy when they visit her establishment. Although unsurprising, it does complicate my job somewhat, needing to be careful about how I convey what pillow talk I hear, maintaining a shield of plausible deniability. I rather enjoy what I do, and it’d be a shame if Madame Lucille had to dismiss me for indiscretion.</i>", parse);
		}
		Text.NL();
		Text.Add("<i>“Now, there are a few things you must know about our operations in Rigard. Are you aware of two field mice by the names of Pendrim and Pamela?”</i>", parse);
		Text.NL();
		if(outlaws.MetPenPam()) {
			Text.Add("Yes, you know the owners of the sex shop.", parse);
			Text.NL();
			Text.Add("<i>“That makes things easier, then. Hidden on the premises of their shophouse is a tunnel that stretches under the walls and opens up in a grated culvert on the other side; we use this passageway to move materiel and people whom we’d really, really not have the City Watch - or, spirits forbid, the Royal Guard - see.</i>", parse);
			Text.NL();
			Text.Add("<i>“Since you have a visa, I’d strongly suggest that you not use the passageway unless absolutely necessary. The more we use it, the more likely that route into the city will be discovered, and I’d rather keep it open for our use as long as possible.”</i>", parse);
		}
		else {
			Text.Add("No, you’ve never heard these names before. Who are they?", parse);
			Text.NL();
			if(!rigard.Visa()) {
				Text.Add("Belinda rolls her eyes and slaps her forehead in the most theatrical fashion, then shows you her teeth. <i>“Of course, that’s right. You haven’t managed to enter the city yet, of course you wouldn’t know them.</i>", parse);
				Text.NL();
			}
			Text.Add("<i>“Well, they run what they call ‘the Odde Shoppe’ in the seedier parts of Rigard’s merchant district. They’re selling sex toys and aids, to put it simply. What makes them important is that hidden on the premises of their shophouse is a tunnel that stretches under the walls and opens up in a grated culvert on the other side; we use this passageway to move materiel and people whom we’d really, really not have the City Watch - or, spirits forbid, the Royal Guard - discover.</i>", parse);
			Text.NL();
			Text.Add("<i>“However, I’d strongly suggest that you not use the passageway unless absolutely necessary. The more we use it, the more likely that route into the city will be discovered, and I’d rather keep it open for our use as long as possible.”</i>", parse);
			if(!rigard.Visa()) {
				Text.NL();
				Text.Add("But you don’t have a pass to get in through the gates, you explain.", parse);
				Text.NL();
				Text.Add("<i>“Oh, that’s a simple matter,”</i> Belinda replies. <i>“Can’t be an operative in the city without a visa, so I’ll just get you one.”</i>", parse);
				Text.NL();
				Text.Add("She makes it sound so easy.", parse);
				Text.NL();
				Text.Add("Belinda shakes her head. <i>“The laws and ordinances coming out of the palace are becoming more and more inane with each passing year. The longer this goes on, the more likely we’re going to end up with another civil war on our hands, and trust me, no one wants that. But I have a favor or two I can call in.”</i>", parse);
			}
		}
		Text.NL();
		if(rigard.Visa()) {
			Text.Add("All right, hidden passage, don’t show anyone, don’t use unless absolutely necessary, got it.", parse);
			Text.NL();
			Text.Add("<i>“Very well. Off with you back to Zenith.”</i> The doberwoman dismisses you with a wave of her hand. <i>“I’ll make my own report to him.”</i>", parse);
			Text.NL();
			Text.Add("Seems like that’s the end of this, then. Standing from your seat, you extend your hand to Belinda, who ", parse);
			if(miranda.Nice())
				Text.Add("grasps it and gives it a half-hearted shake. <i>“I’m sure I’ll be able to get the measure of your fortitude in time to come, [playername].”</i>", parse);
			else
				Text.Add("scowls, ignoring it. <i>“Duty demands that I tolerate your presence, [playername], but touching you is not involved in my work for Zenith. You’ll have to pay quite the sum to gain that privilege. Reflect on your churlish actions, apologize to my sister, and we’ll see if she’ll forgive you.”</i>", parse);
			Text.NL();
			Text.Add("Well, that’s one way to be dismissed. Easing yourself out of the booth without another word, you make your way out of the inn and back to the gates.", parse);
		}
		else {
			Text.Add("Well, if you can get that visa… why question it too deeply? Eyeing you, Belinda pushes away her drink and stands. <i>“Come along, [playername]. Let’s get you into the city.”</i>", parse);
			Text.NL();
			if(miranda.Nasty()) {
				Text.Add("You can’t help but notice her grinning as she’s saying those words, and wonder aloud just why she’s so eager to help if you offended her sister…", parse);
				Text.NL();
				Text.Add("<i>“Oh, you could figure it out if you had a little more sense and conscience, instead of acting as if everyone thinks like you do. You are going to get a gate pass. Miranda is often assigned gate duty. The both of you are going to see each other a <b>lot</b>, and I’m not responsible if a spark or two happens to fly here and there. Come now, didn’t you want that visa?”</i>", parse);
				Text.NL();
			}
			Text.Add("Without further ado, Belinda steps out of the booth and leads you out of the inn, weaving her way through the lunchtime crowd with ease and heading for the gates. She’s a surprisingly fast walker - you have to make a conscious effort to keep up with her - and before long, the two of you are up in front of two bored-looking guards. Thankfully, neither of them happens to be Miranda, and they wave both of you through when Belinda produces her papers and whispers something into one of the guards’ ears.", parse);
			Text.NL();
			Text.Add("From there, it’s smooth sailing a little way past the gates to a booth near the wall, manned by a bureaucrat who looks every bit as bored as the gate guards. Without even waiting for you to explain why you’re here, he thrusts a sheaf of paperwork at you from the mountain behind him.", parse);
			Text.NL();
			Text.Add("Belinda helps you fill out the necessary paperwork, signing the application and showing her own visa in order to vouch for you. The official takes his time looking through the documents, eventually accepting them and writing out your visa.", parse);
			Text.NL();
			if(miranda.Nasty())
				Text.Add("<i>“Well, you got what you wanted,”</i> the doberwoman says, shrugging her eyebrows at you a few times. <i>“I’d love it if you came in and out of the city every day, maybe twice if you’re feeling up to it. Now, shoo back to Zenith, he’ll take care of you.”</i>", parse);
			else
				Text.Add("<i>“And that appears to be that,”</i> the doberwoman says, giving you a nod and wink. <i>“Remember, I’ll be busy most of the time and don’t work the floor, so you probably won’t be able to get to me even if you show up at The Shadow Lady. While I wouldn’t rule out getting my hands involved here and there, it’s likely that you’ll be getting your jobs back at the camp. Now, I think you should head back - getting yourself in order should come before taking in the sights of the city. Believe me, you’ll have plenty of time to look around.”</i>", parse);
			Text.NL();
			Text.Add("<b>Citizen’s visa obtained!</b>", parse);
			
			rigard.flags["Visa"] = 1;
		}
		Text.Flush();
		
		//Note, don't set Belinda's regular met flag, to get a custom meeting at the brothel
		outlaws.flags["Met"] = OutlawsFlags.Met.MetBelinda;
		
		TimeStep({hour: 1});
		
		Gui.NextPrompt();
	});	
}


//
// RANDOM EVENTS
//

OutlawsScenes.Exploration = {};

OutlawsScenes.Exploration.RandName = function() {
	var text = ["a lanky young man", "a mangy bear-morph", "a well-armed sentry", "a haggard-looking hunter", "an overworked young woman", "a well-maned wolf-morph", "a scarred ruffian", "a bearded, elderly morph", "a one-eyed woman", "a rough-looking outlaw"];
	return _.sample(text);
}


OutlawsScenes.Exploration.ChowTime = function() {
	let player = GAME().player;
	let outlaws = GAME().outlaws;

	var parse = {
		lad : player.mfFem("laddie", "lassie")
	};
	
	var first = !(outlaws.flags["events"] & OutlawsFlags.Events.ChowTime);
	
	outlaws.flags["events"] |= OutlawsFlags.Events.ChowTime;
	
	parse["chow"] = WorldTime().hour < 10 ? "Breakfast" :
	                WorldTime().hour < 15 ? "Lunch" : "Dinner";
	
	Text.Clear();
	if(first) {
		Text.Add("Wandering the camp and trying not to get into anyone’s way, your attention is gradually drawn by the smell of something cooking. Nothing fancy, but it’s definitely broth-based, and the faint scent grows stronger as you draw closer to its source. A little distance by the river where it flows into the camp is a grey-furred wolf-morph tending to a number of large cauldrons. Children flit between the cauldrons and any number of benches, chopping, slicing, scrubbing, scouring, stirring and more. No, the smell rising with the smoke and steam isn’t exactly delicious, but it does promise a full belly and sound sleep.", parse);
		Text.NL();
		Text.Add("The wolf-morph turns her head in your direction as you approach, studying you through crinkled eyes even as she continues working at one of the cauldrons with a long wooden stirrer. While she might have once been pretty, perhaps even beautiful, age and hard work haven’t been the kindest to her, nor have the large streaks of white in her hair and fur. The short work shift and apron on her only serve to dull things even more - what a pity.", parse);
		Text.NL();
		Text.Add("<i>“[chow] isn’t ready yet.”</i>", parse);
		Text.NL();
		Text.Add("No, you weren’t looking for a free meal. All you wanted was to see what was going on…", parse);
		Text.NL();
		Text.Add("<i>“Then that’s even worse. I’ve got to play both cook and nanny, and you’re getting in the way of both without a good reason.”</i> She holds your gaze for a moment, and then her expression softens. <i>“Look, you’re new here, aren’t you? It’s the first time I’ve seen you around, at any rate.”</i>", parse);
		Text.NL();
		Text.Add("Well yes, you could suppose that you are relatively new in this place.", parse);
		Text.NL();
		Text.Add("<i>“Fine. Name here’s Raine. I cook, and mind the children by putting them to work helping me cook. My job’s to take whatever that comes in for the day and figure out how to stretch it thin enough that whoever comes in for a bowl can have some <b>and</b> not complain that it doesn’t taste like burnt flour and salt.”</i>", parse);
		Text.NL();
		Text.Add("This, you suppose, involves stretching it thin with water, judging by all the cauldrons around?", parse);
		Text.NL();
		Text.Add("<i>“Don’t knock soup, [lad]. There’s more goodness in a pile of broth-bones than what you’ll ever find in a box full of candies. And of course, there’s bread and things and…”</i> Raine’s voice trails off for a moment, then she sighs. <i>“All right, I can’t tell you what the day’s menu will be until we figure out what’s been brought in and what I’ve got to work with for the day. But the point is that most folks are encouraged to do their own meals, and what’s being whipped up here is for those who don’t have the time or ability to do so. And of course, if you don’t work, you don’t eat.</i>", parse);
		Text.NL();
		Text.Add("<i>“It’s a job truly worthy of a legendary hero, [lad], so my suggestion to you is if you like fixing things to your taste, then you oughta be seeing to your own chow. Now, I got work to do, so if you’re so minded, I’d like you to leave me alone. And I know your type - don’t go around offering to help me out, because if you want to do that then the best thing you can do for me is to stay out of my way.”</i>", parse);
		Text.NL();
		Text.Add("With that, she turns her attention downwards as a girl comes running up with a basketful of chopped spring onions. Grabbing a handful, Raine scatters the lot onto the broth’s bubbling surface, stirring the lot into the uniform white-brown mixture. Yeah, it seems like she’s busy right now - slowly, you back away from the lot and retreat in as hasty a fashion as is polite.", parse);
	}
	else {
		var recipes = ["bone soup", "watery gruel", "cabbage soup", "vegetable stew", "salted porridge", "tough, gamey meat", "the medley of wild vegetables", "floury, overboiled potatoes", "viscous soup", "clear broth"];
		var recipe = _.sample(recipes);
		parse["recipe"] = recipe;
		
		Text.Add("As you make your way through the camp, your nose leads you to Raine’s little impromptu cookhouse once more. The wolfess is there as usual, stirring, chopping, tasting, stoking - when was the last time you ever saw her sleep or take a rest? Not anytime soon, as far as your memory goes.", parse);
		Text.NL();
		Text.Add("Then again, what she’s cooking up would wake the dead. Peering into the nearest of the bubbling cauldrons, you’re rewarded with an eyeful of [recipe] that’s to become the camp’s next public meal.", parse);
		Text.NL();
		Text.Add("<i>“Oi!”</i> Raine’s voice rings out from across the clearing. ", parse);
		if(outlaws.Rep() < 20) {
			Text.Add("<i>“[chow]’s not done yet, [lad], and if you start pestering me then it’ll never be finished! Clear out, clear out, you’re looking well-to-do enough to be looking after your own meals, anyways.”</i>", parse);
		}
		else if(outlaws.Rep() < 50) {
			Text.Add("<i>“You don’t wanna be here right now, [lad]. Mealtime isn’t going to be coming around for a bit yet, and I’d appreciate it if you didn’t keep on sticking your nose in around these parts. There are children working here, you know. Don’t want to be getting in their way when they’re already accident-prone enough on their own. You want a meal, you wait your turn.”</i>", parse);
			Text.NL();
			Text.Add("Just when exactly <i>are</i> mealtimes, anyways?", parse);
			Text.NL();
			Text.Add("<i>“When they need to be,”</i> Raine replies without a single shred of irony. <i>“Folk coming back into camp after being out in the forest, they want to eat now, and where the sun is in the sky doesn’t have much to do with it. If you’re wanting regular meals, then my suggestion is that you do them yourself.”</i>", parse);
		}
		else {
			Text.Add("<i>“C’mon, you’re a nice enough [lad], but I’m sure you know enough by now than to go and bother an old woman like me. C’mon, don’t you have some big mission or the other handed down by the boss? Go do that instead of bothering poor old me, and I’ll gladly serve you some of what’s cooking when it’s done.”</i>", parse);
			Text.NL();
			Text.Add("Well, yeah… about that, you never seem to be around when she’s actually done cooking and started serving. In fact, you’re starting to wonder if there’s some sort of conspiracy about to never serve you any camp food…", parse);
			Text.NL();
			Text.Add("<i>“Don’t be ridiculous,”</i> Raine mutters as she puts her back into her work. <i>“Isn’t any good in doing that, is there? As I said, if you’re so concerned about eating well and regularly, this isn’t the place for you. ‘Sides, you ought to count yourself lucky that you’ve never had to taste anything I’ve cooked.”</i>", parse);
		}
		Text.NL();
		Text.Add("Uh-huh. Well, you’ll leave it at that, then. Slowly, you withdraw, leaving Raine to her culinary matters. No… you don’t really envy those who have to eat her cooking, even if she <i>is</i> doing the best with what she’s got. ", parse);
	}
	Text.Flush();
	
	TimeStep({minute: 30});
	
	Gui.NextPrompt();
}

OutlawsScenes.Exploration.Cavalcade = function() {
	let party = GAME().party;
	let outlaws = GAME().outlaws;

	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("<i>“Hey!”</i>", parse);
	Text.NL();
	Text.Add("Your stroll through the camp is interrupted by a sudden shout, clearly directed at you. Turning to face whoever’s addressing you, you find a small group gathered ", parse);
	if(WorldTime().IsDay())
		Text.Add("under the shade of a large willow tree", parse);
	else
		Text.Add("about a small fire under a large willow tree", parse);
	Text.Add(", a deck of cards in their midst. Four of them are seated in a circle right in the middle, while the remainder cluster about the players, content to merely spectate for now.", parse);
	Text.NL();
	Text.Add("<i>“That’s right, you there!”</i> The speaker’s a lizan, and he waves you over to the group. <i>“Fancy a game of Cavalcade? My luck’s running a bit thin and I’m thinking of calling it quits, but we don’t have another player just yet. You want in?”</i>", parse);
	Text.NL();
	Text.Add("You look down at the game in question. Sure, it doesn’t seem like there’s too much of a difference from the version you’ve seen played at the nomads’ camp, but as with games of chance in unfamiliar settings, there’s always that twinge of doubt…", parse);
	Text.NL();
	Text.Add("<i>“Don’t worry about cheating. Doesn’t make sense to cheat when you know where the other guy lives, and it’s just a short stroll through the camp. So… you want in, or not?”</i>", parse);
	Text.Flush();
	
	outlaws.flags["events"] |= OutlawsFlags.Events.Cavalcade;
	
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "Sure, why not?",
		func : function() {
			Text.Clear();
			Text.Add("Yeah, sure. You shrug your shoulders, push through the small crowd and step forward to take the lizan’s place, settling in with a minimum of fuss. One of the other players deals out the hand, and the game begins.", parse);
			Text.NL();
			OutlawsScenesCavalcade.PrepRandomCoinGame();
		}, enabled : party.coin >= OutlawsScenesCavalcade.Bet()
	});
	options.push({ nameStr : "No",
		tooltip : "Nah, not now.",
		func : function() {
			Text.Clear();
			Text.Add("You shake your head and tell the lizan you’ve got better things to do at the moment.", parse);
			Text.NL();
			Text.Add("He shrugs. <i>“Well, we’ve more or less got a game constantly going on here, what with people going off-duty at all times of day. You want in on a game, all you have to do is come back here with a coin or two.”</i>", parse);
			Text.NL();
			Text.Add("Assuring the lizan that you will if you ever feel like it, you turn and make to leave.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

OutlawsScenes.Exploration.Archery = function() {
	let player = GAME().player;
	let outlaws = GAME().outlaws;

	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("Your journey through the camp eventually brings you to the gates, where a small gathering is taking place. Wandering closer to get a better look, it quickly becomes apparent that there’s some sort of archery event going on - several straw dummies have been set up on the far end of a field, and another line has been marked out on the grass perhaps a hundred and twenty paces away from the dummies.", parse);
	Text.NL();
	Text.Add("Behind said line, a number of outlaws are busy either waiting their turn to have a go at the dummies, or busy loosing arrows downrange. Numbering about thirty to forty individuals in total, it certainly looks like quite the lively event, made even more so by the not inconsiderable amount of boasting, bragging and being called on said boasts and brags that’s going on.", parse);
	Text.NL();
	Text.Add("Maria and Vaughn are present, too, a little off to one side - the former is keeping score with a wooden board and piece of charcoal, while the latter takes drags on a cigarette in between retrieving fallen arrows from the range and in dummies. The former looks up at you as you approach, and gives you a curt nod.", parse);
	Text.NL();
	Text.Add("<i>“Oh, it’s you. We’re having a bit of a friendly competition right now.”</i>", parse);
	Text.NL();
	Text.Add("<i>“An archery competition,”</i> Vaughn adds. <i>“The lovely lass here is staying out of it, because she’d sweep the competition otherwise, and it’s no fun trying if you already know who’s going to win beforehand.”</i>", parse);
	Text.NL();
	Text.Add("Maria nods. <i>“That, and Vaughn and I are the only two whom everyone trusts fully not to try and change everyone’s scores on the sly or do something equally stupid, especially with the prize involved.”</i>", parse);
	Text.NL();
	Text.Add("You let your gaze roam around the scene once more - first to the dummies, then to the hopefuls taking potshots at said dummies, then at the small crate of bottled moonshine sitting by Maria’s feet. Ah, that makes more sense now.", parse);
	Text.NL();
	Text.Add("<i>“Vaughn’s right, too. Not that I don’t practice myself on my own time - and get plenty of opportunities to use said skills out there - but it would really kill the mood if I did join in. Then again…”</i> you’re suddenly aware of the fact that she’s studying you quite intently. <i>“I’d make an exception if you were to join, too. Just a small competition between us - and Vaughn, too. Isn’t that right, Vaughn?”</i>", parse);
	Text.NL();
	Text.Add("The fox-morph pushes up the brim of his hat and coughs up some smoke. <i>“Eh?”</i>", parse);
	Text.NL();
	Text.Add("<i>“I said, you’d be more than willing to join in were [playername] willing to take part in our little contest, wouldn’t you?”</i>", parse);
	Text.NL();
	Text.Add("Vaughn shrugs. <i>“If you want. Not as if we’ll be needing score kept for us - all eyes are going to be pinned on our butts if we take the plate. All righty then, if [playername]’s in, I’m in. So… are you in, [playername]?”</i>", parse);
	Text.Flush();
	
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "Sure, why not? A bit of friendly competition couldn’t hurt.",
		func : function() {
			Text.Clear();
			Text.Add("Sure, why not? Pitting yourself against Maria and Vaughn sounds like a bit of fun.", parse);
			Text.NL();
			Text.Add("<i>“Well then,”</i> Maria replies. <i>“Why don’t I just go explain to the boys that there’ll be one more detail after everyone’s done - and that no, we won’t be competing for the moonshine. In the meantime, why don’t you sit tight and let Vaughn explain the rules to you? I’ll be back before it’s your turn.”</i>", parse);
			Text.NL();
			Text.Add("With that, the ebony beauty saunters off, leaving you with Vaughn. The fox-morph clears his throat and jabs a furry finger at the targets.", parse);
			Text.NL();
			Text.Add("<i>“Yeah, rules are pretty simple; we’re trying to make sure that our people can loose an arrow straight and actually get it to hit something. So, shortbow or longbow’s up to you, you get five arrows, go ahead and stick them into the target. Arrow in the body’s worth one point, arrow through the head’s worth two. Personally found it better myself to aim for the center of mass, but kids these days want to be fancy, and I gotta admit, an arrow to the head’s much more lethal than an arrow to the knee is.”</i>", parse);
			Text.NL();
			Text.Add("Okay, five arrows, head two points, body one point. Anything else?", parse);
			Text.NL();
			Text.Add("<i>“That’s about it. We’re keeping it as simple as possible so that even an idiot can figure it out, and I’d like to think we all are just a tiny bit smarter than idiots.”</i>", parse);
			Text.NL();
			Text.Add("Ah. Right. Well, nothing to do but to wait for your turn; you stick around and watch the competition as it proceeds, various details coming up one after the other to loose their arrows at the targets. Vaughn counts and takes down the hits, Maria records the score; arrows are cleared from the range and pulled from the dummies, and the process repeats itself with the next detail. The outlaws are actually quite good shots - not that you’d expected them to be terrible at aiming, but it’s still quite remarkable, considering that they’ve had not much formal training, if any.", parse);
			Text.NL();
			Text.Add("Eventually, though, it’s your turn, and the three of you step forward to the line. Maria and Vaughn look at each other for a moment, then as one, turn to you. Though you’re not facing them, you can <i>feel</i> the collective gaze of everyone else on the back of your neck, more than a little expectant.", parse);
			Text.NL();
			Text.Add("<i>“Visitors first,”</i> Maria says, her lips turning upwards in a smile.", parse);
			Text.NL();
			Text.Add("Very well. You pick up the bow offered to you, give the string a few test draws, then prepare to nock an arrow in earnest, eyes fixed on your target. What will you aim your arrows for?", parse);
			Text.Flush();
			
			var goal = 50;
			var goal2 = 70;
			var dex = player.Dex() + player.Str();
			if(Jobs.Ranger.Unlocked(player)) dex += 2*player.jobs["Ranger"].level;
			
			//[Head][Body]
			var options = new Array();
			options.push({ nameStr : "Head",
				tooltip : "Score high! Show off a bit and aim for the head.",
				func : function() {
					dex += _.random(0,20);
					
					Text.Clear();
					Text.Add("Well, you’re feeling like showing off today - why not go for the head? It’d definitely make for an impressive show… hopefully you have the skills to back it up, though.", parse);
					Gui.PrintDefaultOptions();
				}, enabled : true
			});
			options.push({ nameStr : "Body",
				tooltip : "Go for the more reliable center of mass.",
				func : function() {
					dex += _.random(10,25);
					
					Text.Clear();
					Text.Add("Deciding to go for a conservative approach, you decide to aim for the dummy’s centre. One bird in hand is worth two in the bush and all that, right?", parse);
					Gui.PrintDefaultOptions();
				}, enabled : true
			});
			
			Gui.Callstack.push(function() {
				Text.NL();
				Text.Add("Holding your breath, you take aim, and loose the arrows at your target in turn, watching them arc as they whistle through the air. At length, Maria and Vaughn take their turns at the line, loosing their arrows much like you have, and after it’s all over the latter ambles down the range to count the number of hits everyone’s landed.", parse);
				Text.NL();
				if(GetDEBUG()) {
					Text.Add("DEBUG: dex+str [dex] (vs [goal], [goal2])", {dex: dex, goal: goal, goal2: goal2}, 'bold');
					Text.NL();
				}
				if(dex >= goal2) {
					Text.Add("<i>“[playername] comes in first, with Maria in second. I’m dead last,”</i> Vaughn drawls as he turns back to everyone. <i>“Come up and see for yourself, if you want.”</i>", parse);
					Text.NL();
					Text.Add("Maria waves off the offer even as a few more curious outlaws accept Vaughn’s invitation and wander up to the targets. <i>“Well, [playername]. Seems like you managed to beat the both of us fair and square - congratulations.”</i>", parse);
					Text.NL();
					Text.Add("Aw, shucks. It could’ve gone any way.", parse);
					Text.NL();
					Text.Add("<i>“Well, we’ll see about that next time. We’ll be doing this again in a little while when the next batch of moonshine gets cooked up, so I’d like it if you could turn up again when that happens. I expect Vaughn and I will have improved by then, of course, and I hope you’ll have done the same, too.”</i>", parse);
					
					outlaws.flags["events"] |= OutlawsFlags.Events.BeatMaria;
					
					maria.relation.IncreaseStat(50, 2);
					outlaws.relation.IncreaseStat(30, 2);
				}
				else if(dex >= goal) {
					Text.Add("<i>“Maria’s in first, with [playername] second. Naturally, I’m dead last,”</i> Vaughn drawls from down the rage. <i>“Not a big surprise, really; come up and see if you want.”</i>", parse);
					Text.NL();
					Text.Add("By and large, a few of the outlaws wander down the range to where Vaughn’s standing, poring over the target dummies. <i>“Maria won?”</i>", parse);
					Text.NL();
					Text.Add("<i>“Well, of course, nitwit. She wins every time. That’s why she sits out these days and referees.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Sure, but there was that new [guygirl]…”</i>", parse);
					Text.NL();
					Text.Add("Coming up to you, Maria punches you lightly on the back of your shoulder. <i>“I wouldn’t feel too off about it if I were you. I am, after all, quite good at this.”</i>", parse);
					Text.NL();
					Text.Add("That’s a bit of an understatement, isn’t it?", parse);
					Text.NL();
					Text.Add("<i>“There’s a difference between giving credit where it’s due and bragging. Zenith frowns on the latter.”</i> Maria pauses a moment, her lips moving silently, then clears her throat. <i>“Well, at least you’ve demonstrated what you’re capable of. I hope you’ll keep improving - I plan to do so, at any rate.”</i>", parse);
					
					maria.relation.IncreaseStat(30, 1);
					outlaws.relation.IncreaseStat(20, 1);
				}
				else {
					Text.Add("<i>“Maria’s first, I’m next, and [playername] came in last,”</i> Vaughn calls out from down the range. <i>“See for yourself if you want.”</i>", parse);
					Text.NL();
					Text.Add("A few outlaws take him up on his offer, ambling down to take a look-see at the target dummies. Maria smiles, shrugs, and pats you on the shoulder. <i>“Hey, at least you were a good sport. That counts for something, so don’t sweat it. Not everyone’s made to draw a bowstring.”</i>", parse);
					Text.NL();
					Text.Add("Maybe. Maybe not.", parse);
					Text.NL();
					Text.Add("<i>“Well, if you intend to brush up on your archery skills, you’re more than welcome to join in on the next one - we should be having another competition when the next batch of moonshine’s been brewed up. Of course, don’t imagine that I won’t be practicing myself, either.”</i>", parse);
				}
				Text.NL();
				Text.Add("Well, she’ll just have to wait for the next time to find out, won’t she?", parse);
				Text.NL();
				Text.Add("<i>“Of course.”</i> She quirks an eyebrow at you. <i>“Hope you enjoyed yourself, because I know I did. I’ll see you around.”</i>", parse);
				Text.NL();
				Text.Add("With that, Maria gives you a small wave and departs to join her men, who’ve taken to enthusiastically emptying the moonshine crate of its contents. Well, seems like that wraps this little event up, then - you can see why it’s help, let the poor saps blow off some steam every now and then - but whether you’d like to get rip-roaringly drunk or not, it doesn’t look like the other outlaws are inclined to share.", parse);
				Text.NL();
				Text.Add("Oh well, there’s always another time. You take a moment to gather yourself, then turn to leave.", parse);
				Text.Flush();
				
				TimeStep({hour: 1});
				
				Gui.NextPrompt();
			});
			
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true
	});
	options.push({ nameStr : "No",
		tooltip : "You don’t feel like it today. Maybe not.",
		func : function() {
			Text.Clear();
			Text.Add("You shake your head, declining Maria’s offer to join the archery competition - whatever your reasons, you just don’t feel like it today. Maria looks a little surprised at your refusal, but shrugs it off with a little more nonchalance than strictly necessary.", parse);
			Text.NL();
			Text.Add("<i>“Suit yourself. Detail three, you’re up next!”</i>", parse);
			Text.NL();
			Text.Add("You linger to watch the competition for a little while - despite the varying quantities of watered-down beer being passed around, the outlaws are actually quite competent shots with shortbow and longbow alike, with at least more arrows actually finding their mark rather than going wide. Vaughn counts and takes down the hits, Maria records the score, and the process repeats itself until the last detail’s done.", parse);
			Text.NL();
			Text.Add("At the end of it all, the winner’s a three-way tie between a pure human and two morphs, and to the victors, the spoils: the crate of moonshine is quickly divided up and hauled away, presumably to be enjoyed somewhere else. A few of the competitors hang around to gather up the loose arrows and take down the dummies from the range, and out of the corner of your eye you spy Maria coming up to you, a small smile on her face.", parse);
			Text.NL();
			Text.Add("<i>“Enjoy yourself?”</i>", parse);
			Text.NL();
			Text.Add("Her men certainly did, that’s for sure.", parse);
			Text.NL();
			Text.Add("<i>“It’s true that we would like to do these more often, but since we don’t have that much moonshine - and can’t afford that many days where a whole squad can be rip-roaringly drunk - we settle for some measure of regularity. Besides, it’s another reason for everyone to keep their skills sharp.</i>", parse);
			Text.NL();
			Text.Add("<i>“Maybe you’ll compete next time, won’t you?”</i>", parse);
			Text.NL();
			Text.Add("She sure seems set on seeing what you’ve got, doesn’t she?", parse);
			Text.NL();
			Text.Add("Maria shrugs and tosses her hair. <i>“You’re officially one of our operatives now, you know. Do you think it strange that I’m interested in seeing what you can do?”</i>", parse);
			Text.NL();
			Text.Add("And there’s absolutely no other reason for her pestering you to join in?", parse);
			Text.NL();
			Text.Add("<i>“Pestering? I only brought it up twice. If that’s the way you want it, suit yourself; your skills will out in time to come. Me, I’ve got bigger fish to fry.”</i> She gives you a nod and smile. <i>“Enjoy the rest of your day, [playername]. I’ll see you around.”</i>", parse);
			Text.Flush();
			
			TimeStep({hour: 1});
			
			Gui.NextPrompt();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

OutlawsScenes.Exploration.CampFollowers = function() {
	let player = GAME().player;

	var parse = {
		s : player.sexlevel >= 4 ? "familiar" : "odd"
	};
	
	Text.Clear();
	Text.Add("As you pick your way through the sea of tents that make up the camp, a rather… [s] noise reaches your ears. Wondering where it’s originating from - the sea of tents is quite terribly packed, after all - you stop and listen for a moment, and yes, there it is again, coming from one of the tents just ahead of you. As you pass it by, perhaps meandering a little closer than what’s strictly required, the grunts and moans coming from within leave little doubt as to the nature of the activity that’s going on inside.", parse);
	Text.NL();
	Text.Add("You’ve heard of buildings and thin walls, but a thin sheet of canvas has got to take the cake. Ah well, all camps have their followers, and it seems like the outlaws are no different. Swords have to have sheaths of varying sorts and all that.", parse);
	Text.NL();
	Text.Add("Shaking your head, you continue on your way.", parse);
	Text.Flush();
	
	TimeStep({minute: 10});
	
	Gui.NextPrompt();
}

OutlawsScenes.Exploration.Feeding = function() {
	var parse = {
		outlaw1 : OutlawsScenes.Exploration.RandName(),
		outlaw2 : OutlawsScenes.Exploration.RandName()
	};
	
	Text.Clear();
	Text.Add("Passing by the river, you catch wind of two outlaws chatting away by the stand of willow trees. Since you’re headed in their direction anyway, you can’t help but overhear something of their conversation - not that they’re doing anything to disguise it, of course:", parse);
	
	var scenes = new EncounterTable();
	
	scenes.AddEnc(function() {
		Text.Add(" <i>“So, guess what Raine just served up from the cookpot?”</i> [outlaw1] says.", parse);
		Text.NL();
		Text.Add("The other outlaw, [outlaw2], sighs. <i>“No. Should I guess?”</i>", parse);
		Text.NL();
		Text.Add("<i>“Don’t bother. Lemongrass boiled with wild cabbage and carrots, then served up as soup.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Ugh. Still, you have to hand it to the old wolf. She does what she can with the things everyone brings in, and let’s face it - eating from her cookpot is supposed to be a punishment of sorts, if you can’t scrape together your own lunch.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I know. It wasn’t good, but at least I could stomach it. Still…”</i>", parse);
		Text.NL();
		Text.Add("<i>“If we could still afford to eat well we’d still be living in Rigard, and you know it.”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add(" <i>“...Well, there’s the food situation,”</i> [outlaw1] says.", parse);
		Text.NL();
		Text.Add("<i>“Huh.”</i> The other outlaw, [outlaw2], looks thoughtful at this. <i>“I dunno, if you’re going to be worrying about this all the time, you might as well ask Zenith to be made quartermaster or something and at least get some credit for it.”</i>", parse);
		Text.NL();
		Text.Add("<i>“This isn’t about me, it’s about what there is to eat. Sure, the forest has given us enough to get by for the moment, but that can’t last forever. Every day pickers are having to go further, while game’s learning to avoid us. And with that slow but steady trickle of people coming in from the slums, we’re going to hit the point where there just isn’t enough to go around.”</i>", parse);
		Text.NL();
		Text.Add("<i>“The vegetable garden idea worked out kinda well.”</i>", parse);
		Text.NL();
		Text.Add("<i>“It’s still not enough. Forest soil is pretty poor, to be honest, and if we cleared out the land required to produce enough to feed everyone we might as well head up to the Royal Guard and tell them where we are. No, what we should do is make some friends out of the plains farmers…”</i>", parse);
		Text.NL();
		Text.Add("<i>“Only problem is, what do we have that they’d risk associating with folk like us to get?”</i>", parse);
		Text.NL();
		Text.Add("<i>“I’m still working on that problem…”</i>", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add(" One of them, [outlaw1], grins. <i>“Did you see that thing that got built the other day?”</i>", parse);
		Text.NL();
		Text.Add("<i>“No, what do you mean?”</i> The other outlaw, [outlaw2], looks appropriately skeptical.", parse);
		Text.NL();
		Text.Add("<i>“That thing with planters stacked like a stepladder. Idea’s that we can grow a few things on the side, and with them stacked on each other like that they won’t take up that much space. Same principle as mushroom logs, really.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Dunno, I’ll believe it when I see it…”</i>", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.NL();
	Text.Add("It’s then that they realize you’re listening in, and quickly pipe down, eyeing you cautiously. Well, you’d heard enough anyway - passing them by, you pace along the riverside in as nonchalant a fashion as you can even as you feel their gazes on the back of your neck.", parse);
	Text.Flush();
	
	TimeStep({minute: 20});
	
	Gui.NextPrompt();
}

OutlawsScenes.Exploration.Carpentry = function() {
	let player = GAME().player;
	let outlaws = GAME().outlaws;

	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("Your meanderings through the outlaw camp bring you close to the Map Room this time around. Oddly enough, no one’s in at the moment - there’s no light filtering out from between the window shutters - which is interesting in itself. With how much time Zenith seems to spend in there, he might as well live in the place. Does he? You’ve never really had the chance to peek into any of the adjoining rooms in the building -", parse);
	Text.NL();
	Text.Add("<i>“Free time?”</i>", parse);
	Text.NL();
	Text.Add("You turn at the familiar voice, and find Vaughn round the back of the building, sanding a plank with a large square of sandpaper. A few beautifully smoothed planks are laid out on the wall beside him, and there’re a couple more waiting to receive the treatment. The fox-morph has shed his hat, having hung it up on a nail on the wall, his kerchief is soaked with sweat, and there’s a distinct smell of sawdust about his person.", parse);
	Text.NL();
	Text.Add("Pardon?", parse);
	Text.NL();
	Text.Add("<i>“Free time’s precious ‘round these parts,”</i> he grunts as he continues to rub away at the splinters. <i>“Precious, ‘cause you only get it when you’ve finished work. Got a folding table here which needs making, but the planks aren’t going to smooth themselves and a single pair of arms gets tired really easy.</i>", parse);
	Text.NL();
	Text.Add("<i>“I guess what I’m saying is that I’m asking for your help, if you’ve got a moment to spare. Just smoothing out a couple of planks and all…”</i>", parse);
	Text.Flush();
	
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "Sure, why not? You weren’t doing anything of import, after all.",
		func : function() {
			Text.Clear();
			Text.Add("Nodding, you accept a square of sandpaper and freshly-hewn plank from Vaughn, and set to work. Even though you quickly fall into a steady scrubbing rhythm, using your back rather than your arm to work the plank’s surface, the effort still takes the wind out of your sails surprisingly quickly. Vaughn himself has his head bowed and gaze pinned on his own work, eyes hard and narrow as he sands both sides of the plank in turn.", parse);
			Text.NL();
			Text.Add("Eventually, though, he straightens himself and wipes the sweat off his brow with the back of his hand. <i>“Whew. You holding up all right there, [playername]?”</i>", parse);
			Text.NL();
			Text.Add("Yeah, you’ll be fine. You have the lingering suspicion that you’ll be sore for a bit later on, but you’re fine for now. Just need to get the other side done.", parse);
			Text.NL();
			Text.Add("<i>“Thanks for agreeing to help out. It’s hard work, and you didn’t have to say yes.”</i>", parse);
			Text.NL();
			Text.Add("Oh, it’s no bother. It’s a good workout, after all; you feel stronger already!", parse);
			Text.NL();
			Text.Add("<i>“Well, glad you’re feeling all great about it. More people could use a dose of hard work with their hands every now and then, I think. It makes for better people.”</i>", parse);
			Text.NL();
			Text.Add("Really? That’s an interesting way to put it.", parse);
			Text.NL();
			Text.Add("<i>“Yep.”</i> Vaughn flips his plank over and starts sanding the other side. <i>“I think that if all the nobs were required to do an actual hour’s worth of hard work a week, they’d all be in much better shape, and so would we. I mean, Riordane at least held his own sword and did his own killing, now the nobs don’t even lower themselves to do that. No, they’ve got the Royal Guard for that.</i>", parse);
			Text.NL();
			Text.Add("<i>“As I said, it doesn’t have to be a lot, an hour a week to get them sweating. Just enough to impress upon them what hard work’s for. It’s why I make sure my people get a regular dose of working with their hands, and they can’t complain because I’m doing the same thing right by their side.”</i>", parse);
			Text.NL();
			Text.Add("Like now?", parse);
			Text.NL();
			Text.Add("<i>“Nah, this here’s a more personal project. But you’re right, it’s hard work all the same.”</i> Vaughn wipes off his brow once more, then straightens up and stretches. <i>“I think we’re about done here; thanks for the help. It’s about time I headed indoors and started putting this folding table together.”</i>", parse);
			Text.NL();
			Text.Add("Oh. You hand over the plank you were sanding, as well as the sandpaper. While you weren’t really that experienced at the job, at least you did your best. Could he use any help?", parse);
			Text.NL();
			Text.Add("<i>“Thanks for the offer, but no. It’s more brains than brawn from here on out. Gotta keep in practice with the carpentry and all, and odd jobs like these are the best for that. You look like you could use a wipe-off, [playername] - why don’t you do that before you catch a chill, and get a drink while you’re about it?”</i>", parse);
			Text.NL();
			Text.Add("Yeah, maybe you’ll do that.", parse);
			Text.NL();
			Text.Add("<i>“I’ll see you around then,”</i> Vaughn calls out over his shoulder as he heads into the map building, a stack of planks under each arm. <i>“And thanks again for the help.”</i>", parse);
			Text.Flush();
			
			outlaws.relation.IncreaseStat(20, 1);
			TimeStep({hour: 1});
			
			Gui.NextPrompt();
		}, enabled : true
	});
	options.push({ nameStr : "No",
		tooltip : "You’ll pass, thanks. It’s his job, not yours.",
		func : function() {
			Text.Clear();
			Text.Add("Nah, thanks. You were just passing by, anyway.", parse);
			Text.NL();
			Text.Add("Vaughn dips his head in acknowledgement. <i>“Yeah, I understand. Folks value their rest time and all, I know my people do. Well, I’ve got to keep on the job if I’m going to get this done before sundown. You just enjoy your time off and don’t drink too much moonshine, all right?”</i>", parse);
			Text.NL();
			Text.Add("All right - not that you were planning to drink any of the outlaws’ moonshine, anyway. You return Vaughn’s nod, leave him to his work, and are gone from sight before long.", parse);
			Text.Flush();
			
			TimeStep({minute: 20});
			
			Gui.NextPrompt();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}

OutlawsScenes.Exploration.FactFinding = function() {
	let player = GAME().player;
	let outlaws = GAME().outlaws;

	var parse = {
		playername : player.name
	};
	
	var first = !(outlaws.flags["events"] & OutlawsFlags.Events.FactFind);
	outlaws.flags["events"] |= OutlawsFlags.Events.FactFind;
	
	Text.Clear();
	if(first) {
		Text.Add("Deciding to take a quick stroll through the outlaw camp, your ambling brings you to the gates and an interesting sight: Zenith himself is by the camp’s exit, chatting with one of the sentries on duty while Maria waits by his side. A number of morphs are coming up with the drawbridge, so it’s quite clear that the outlaw leader and his aide are planning to make a trip of some sort.", parse);
		Text.NL();
		Text.Add("That’s curious in and of itself: as far as you can remember, Zenith doesn’t leave the map building for casual jaunts, let alone a trip out of the camp for pleasure’s sake. Noticing your arrival, he breaks off the conversation and dismisses the sentry, then turns to you.", parse);
		Text.NL();
		Text.Add("<i>“[playername]. To what do I owe the honor of your arrival?”</i>", parse);
		Text.NL();
		Text.Add("Oh, nothing much. You just noticed that he’s out and about. Something important turn up?", parse);
		Text.NL();
		Text.Add("<i>“It’s important all right, but it didn’t just ‘turn up’, as it were,”</i> Zenith replies. <i>“Maria and I are going on what I like to call a fact-finding trip.”</i>", parse);
		Text.NL();
		Text.Add("A fact-finding trip?", parse);
		Text.NL();
		Text.Add("Zenith doesn’t say anything, but looks down at Maria, who hesitates for a moment before explaining. <i>“It’s where we go out and just observe. Watch the people about their lives, as it were, and take their pulse, as Aquilius would put it. Sometimes we go to the slums, sometimes we go out into the plains and watch the farms, and sometimes we even sneak into Rigard. It’s a bit of a mixed bag.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Maria has the succinct version of events, yes,”</i> Zenith adds. <i>“But there’s more to it than just going and looking. There are a number of reasons for this, but there’re a number of reasons why I’m currently seeking allies who aren’t outlaws in and of themselves, but have reason to resent Rigard and the insanity that comes out of it. Acting in and of ourselves will only bring limited success - we need to cast further abroad for like minds. You’re one such example.”</i>", parse);
		Text.NL();
		Text.Add("All right, you understand. But you’re not quite sure why he does this himself.", parse);
		Text.NL();
		Text.Add("<i>“Should there be a problem with that?”</i>", parse);
		Text.NL();
		Text.Add("Well, he <i>is</i> exposing himself unnecessarily, isn’t he?", parse);
		Text.NL();
		Text.Add("<i>“As opposed to Rewyn standing up on a balcony a handful of times a year and giving a twenty-minute speech before disappearing into that castle he calls home? That’s hardly a way to live, is it?”</i> Scratching the stubble on his chin, Zenith smiles wryly at you. <i>“Nor, I think, is it a very useful or persuasive way to rule.</i>", parse);
		Text.NL();
		Text.Add("<i>“Then, of course, there’s the matter of me liking to see things for myself and making my own judgements based on my own observations, as opposed to overly relying on the reports of others. We all color our thoughts, [playername], but some do it more than others.”</i>", parse);
		Text.NL();
		Text.Add("That’s quite the speech.", parse);
		Text.NL();
		Text.Add("<i>“I’m quite open about what I intend, [playername]. I find it rather freeing, after a young spent in apprenticeship at the guild. Well then, I hope you understand more about our motivations now, but Maria and I really have to be going if we’re to do anything useful on our little trip. Watch your back if you’re going to heading out there.”</i>", parse);
		Text.NL();
		Text.Add("You nod and watch as the gate sentries finally get the drawbridge in place. Zenith and Maria cross and quickly slip into the forest’s dense growth, and the drawbridge is pulled back once more.", parse);
	}
	else {
		Text.Add("Passing by the gates again as you explore the camp, you notice Zenith and Maria preparing to head out once more, presumably on another of their so-called fact-finding excursions. You call out to them as you approach, and they greet you with a nod.", parse);
		Text.NL();
		Text.Add("<i>“We’re about to head out again, yes. Was there something you needed?”</i>", parse);
		Text.NL();
		Text.Add("Oh no, not really. You were wondering if their trip the last time bore any fruit. Where did they go, and did they learn anything useful?", parse);
		Text.NL();
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("<i>“We went out with a cart and talked to some farmers on the plains. Bought some grain and preserves in bulk, had a chat about the policies coming out of Rigard,”</i> Zenith taps his chin and chews in silence. <i>“They haven’t reached the tipping point yet, when their anger is greater than their fear of the Crown and its arms. Certainly not enough to want to give our people work as farmhands. They’ve still got enough to lose that they think that if they keep their heads down they’ll come out of the other side unscathed. I’m not so sure about that myself.”</i>", parse);
			Text.NL();
			Text.Add("He thinks it’ll get that bad?", parse);
			Text.NL();
			Text.Add("<i>“It’s just common sense. The plains are Rigard’s breadbasket, and when things get bad in there, it’ll get bad for the farmers, too. Food confiscations, at the very least.”</i>", parse);
			Text.NL();
			Text.Add("Hopefully he’ll be able to talk one or two of them into coming around to his point of view.", parse);
			Text.NL();
			Text.Add("Zenith nods. <i>“I don’t blame them. They’ve got roots that they’d rather not see pulled out, and their farms make them an obvious and large target. Not like us scheming vagabonds.”</i> He says it with such a completely straight face that you aren’t sure if he’s joking or not. <i>“For now, though, them being willing to sell to us under the table and look the other way is good enough for us. We can’t live off the forest completely, and they get to avoid taxes on sales. It’s a win-win situation.”</i>", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>“We took a day trip down to Orsineau,”</i> Maria tells you. <i>“There’re some interesting developments going on down in that little town which might turn out to be quite significant down the line.”</i>", parse);
			Text.NL();
			Text.Add("Oh? Might you ask what these would be, or is this information not for you?", parse);
			Text.NL();
			Text.Add("<i>“Not the details,”</i> Zenith grunts. <i>“I don’t want to count my chickens before they’re hatched. But it’s where the estate of the Queen’s family lies, and everyone knows that she’s been more partial to morphs than most, much to her husband’s ire.”</i>", parse);
			Text.NL();
			Text.Add("You see.", parse);
			Text.NL();
			Text.Add("<i>“If we’re successful, you’ll hear about it. If we’re not… well, you won’t hear about it,” Maria adds. <i>“Fishing for potential allies doesn’t often turn out much success, so we often do those things as an afterthought. There’s something else we still need to do in Orsineau, don’t we?”</i>", parse);
			Text.NL();
			Text.Add("Zenith eyes Maria sternly. <i>“We’ll need to speak about that later, yes. But not now.”</i>", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>“Down in the slums, of course,”</i> Zenith mutters. <i>“Picking up pieces from our eyes and ears on the ground, and doing what we can for the aggrieved.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Or at least, for those who want to be helped.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Yes. They’ve always been downtrodden, but some just want to give up. It’s been so long since the civil war…I don’t know if it’s for better or for worse that the younger ones haven’t known better times. They don’t have the past to pine for, at the very least, but at the same time, no one should have to live in such conditions unless they really deserved it. I can tell you from experience, at least three quarters of all who live in the slums don’t.”</i>", parse);
			Text.NL();
			Text.Add("Ah, you see.", parse);
			Text.NL();
			Text.Add("<i>“A stop by the Maiden’s Bane to pick up some goods, and another stop in the Spitting Lion to take stock of who’s going in and out of the city these days.”</i>", parse);
			Text.NL();
			Text.Add("<i>“He likes to have a proper drink, anything that tastes better than the moonshine brewed up here,”</i> Maria adds, smiling. <i>“But he’ll never admit it.”</i>", parse);
			Text.NL();
			Text.Add("Zenith frowns. <i>“Would you rather I sit down nursing a glass of water, and draw unwanted attention to myself?”</i>", parse);
			Text.NL();
			Text.Add("<i>“See what I mean?”</i>", parse);
			Text.NL();
			Text.Add("<i>“That’s enough,”</i> Zenith says with a frown, cutting Maria off with a quick slice of his hand.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>“Just some sundry work in Rigard,”</i> Zenith tells you. <i>“Checking in on our operatives in the merchants’ district and in the brothel, hearing the latest news for ourselves…”</i>", parse);
			Text.NL();
			Text.Add("<i>“Leading the city watch on a silly chase…”</i>", parse);
			Text.NL();
			Text.Add("<i>“You did that, not me.” Zenith grunts and rolls his shoulders. “I’m getting a little too old to start wasting my energy for the sake of doing so.”</i>", parse);
			Text.NL();
			Text.Add("You know they’ve been doing this a long time, but still, you can’t help but worry.", parse);
			Text.NL();
			Text.Add("<i>“And of course, check up on what latest insanity is pouring out from the castle on the hill. The best we can hope for these days is for things not to get worse, but I’m often surprised - and not in a good way,”</i> Zenith continues. <i>“I wouldn’t be surprised if Rewyn suddenly ordered everyone to start wearing red on Tuesdays on pain of a day in the stocks, for example.”</i>", parse);
			Text.NL();
			Text.Add("It’s that bad? Mightn’t he be exaggerating just a little?", parse);
			Text.NL();
			Text.Add("<i>“It is that bad.”</i>", parse);
		}, 1.0, function() { return true; });
		
		scenes.Get();
		
		Text.NL();
		Text.Add("There’s a brief moment while the both of them look thoughtfully at each other, and at length, Zenith shrugs.", parse);
		Text.NL();
		Text.Add("<i>“Well, we ought to be heading on out again. There’re only so many hours in a day, after all. And what do you intend to do with the rest of today, [playername]? Something productive, I hope?”</i>", parse);
		Text.NL();
		Text.Add("Without waiting for a reply, he turns and strides for the gates - the drawbridge is already down, and both Zenith and Maria cross before quickly disappearing amidst the trees of the forest, leaving you to consider what was just said.", parse);
	}
	Text.Flush();
	
	TimeStep({hour: 1});
	
	outlaws.factTimer = new Time(0,0,3,0,0);
	
	Gui.NextPrompt();
}

OutlawsScenes.Exploration.DailyLife = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("The camp’s at peace today, as far as you can tell. Be it day or night, there’s always something to be done, some chore to be taken care of, and of course, someone up and about to do it.", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("Today, a good proportion of the camp’s involved in preparing fresh game brought in from the forest. Skinning, gutting, butchering take enough hands and are but the first steps in the chain of jobs that goes down the line; meat is set aside to be salted or smoked, bones are collected for soup and meal, and hides and pelts carefully scraped free of flesh, washed, and hung out to dry before heading for the curing tubs.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("You pass by a number of folk busy splitting firewood - green logs and branches, still fresh with moisture from the forest, have to be hacked up into regular, more manageable pieces and laid out to dry. It’s back-breaking labor, but someone has to do it, and with firewood it’s far better to get it chopped in advance than to do so when one actually needs the stuff.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["day"] = WorldTime().IsDay() ? "in the shade of the willow grove" : "by the light of several large torches";
		Text.Add("On your trip by the river, you find a number of folk hanging about on the riverbank [day]. A small pond of sorts has been dug into the riverbank with a net stretched across its mouth, and it seems that several large catfish and freshwater prawns are being raised inside, fed scraps from the camp’s meals.", parse);
		Text.NL();
		Text.Add("That’s not the only thing going on about these parts, of course. Several fish traps of woven wicker have been set in the river’s fast-flowing current, and as you watch, several morphs go about the business of emptying them of their catch and setting new bait. A little further downstream, a small team of outlaws tends to one of the bridges that spans the stream, ripping out rotted planks and replacing them with fresh, pitch-soaked ones under Vaughn’s watchful eye.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("In a corner of the camp, you find a small kitchen garden tended to by a handful of young, dirty children in patched clothes. They give you suspicious looks as you pass by, but say nothing, being too busy with weeding and watering. Watched over by a bored-looking fox kit, a flock of chickens wanders through the garden, scratching at the soft soil for bugs and worms.", parse);
		Text.NL();
		Text.Add("You take stock of the plants - tomatoes, ginger, garlic, carrots, to name a few. Not the sort of vegetables which would make a meal - not in the quantities they’re served in - but at least they’ll give a little flavor to whatever watery broth they’ve the misfortune of being added to.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("Wandering through the sea of tents, you come by a small gaggle of women busy making preserves from sun-dried fruit - small red berries of some sort, it seems. Without the luxuries of salt and sugar, they’ve resorted to vinegar for their pickling needs, and the sharp, acrid tang of such is heavy in the air as they sit on the grass in a circle, sharing the latest gossip.", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.NL();
	Text.Add("It seems that no matter where one goes, some things just don’t change, despite the circumstances and surroundings in which they take place in. Almost as if the outlaws are trying to cling to some small part of their former lives and a sense of normalcy, regardless of their current position.", parse);
	Text.NL();
	Text.Add("Which makes sense. If you were in their position and kept on thinking about it, it’d be really easy to give in to despair. Shaking your head, you turn from the scene and head back, wondering just how long this can go on.", parse);
	Text.Flush();
	
	TimeStep({minute: 30});
	
	Gui.NextPrompt();
}

export { Outlaws, OutlawsScenes };
