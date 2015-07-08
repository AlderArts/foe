/*
 * Outlaws flags
 */

Scenes.Outlaws = {};

// Class to handle global flags and logic for outlaws
function Outlaws(storage) {
	this.flags = {};
	
	this.flags["Met"] = 0;
	this.flags["BT"] = 0; // Bitmask
	this.flags["BullTower"] = 0;
	
	this.relation = new Stat(0);
	
	this.mainQuestTimer = new Time();
	
	if(storage) this.FromStorage(storage);
}

Outlaws.Met = {
	NotMet     : 0,
	Met        : 1,
	Bouqet     : 2,
	Letter     : 3,
	MetBelinda : 4
};

Outlaws.prototype.ToStorage = function() {
	var storage = {};
	
	storage.flags = this.flags;
	if(this.relation.base != 0)
		storage.rep = this.relation.base.toFixed();
	
	storage.Qtime = this.mainQuestTimer.ToStorage();
	
	return storage;
}

Outlaws.prototype.FromStorage = function(storage) {
	storage = storage || {};
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
	this.relation.base = !isNaN(parseInt(storage.rep)) ? parseInt(storage.rep) : this.relation.base;
	
	this.mainQuestTimer.FromStorage(storage.Qtime);
}

Outlaws.prototype.Update = function(step) {
	this.mainQuestTimer.Dec(step);
}


// TODO
Outlaws.prototype.TurnedInBinder = function() {
	return false;
}

Outlaws.prototype.BullTowerCompleted = function() {
	return this.flags["BullTower"] >= Outlaws.BullTowerQuest.Completed;
}

Outlaws.prototype.AlaricSaved = function() {
	return this.BullTowerCompleted() && (this.flags["BT"] & Outlaws.BullTower.AlaricFreed);
}

Outlaws.prototype.BullTowerCanGetReward = function() {
	return this.AlaricSaved() && (this.flags["BT"] & Outlaws.BullTower.ContrabandStolen) && (this.flags["BT"] & Outlaws.BullTower.SafeLooted);
}
Outlaws.prototype.Rep = function() {
	return this.relation.Get();
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
	//Only in the initial phase
	if(outlaws.flags["Met"] != Outlaws.Met.Met) return false;
	//Only when meeting the correct relation requirements TODO
	if(aquilius.flags["Met"] < Aquilius.Met.Met) return false;
	//Only when meeting total Outlaws rep
	return outlaws.Rep() >= 0;
}

Scenes.Outlaws.MariasBouquet = function() {
	var parse = {
		playername : player.name,
		afternoonevening : world.time.hour >= 16 ? "evening" : "afternoon"
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
	if(world.time.season != Season.Winter)
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
			PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "No",
		tooltip : "While you can guess, you’re not a mind-reader.",
		func : function() {
			Text.Clear();
			Text.Add("Hmm… you can probably guess that this is a memorial of some sort, but as to <i>why</i> Maria brought you here… well, part of it’s probably that she wants to impress upon you the numbers of the dead. Beyond that, though, it’s anyone’s guess. Perhaps she could be so kind as to tell you?", parse);
			Text.NL();
			Text.Add("<i>“This is where we remember those who died in the civil war all those years back, [playername]. Nameless in the official records, remembered only by those they were close to, their bodies never found.</i>", parse);
			PrintDefaultOptions();
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
		
		Scenes.Outlaws.MariasBouquetPrompt({});
	});
	
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Outlaws.MariasBouquetPrompt = function(opts) {
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
				Text.Add("<i>“Not someone, [playername],”</i> she corrects you. <i>“Someones. My family didn’t know what was going on at the time, and answered a knock at the door. The royal guard dragged them out into the street screaming - my father, mother, and elder brother - and I never saw them again. They searched the place but not very thoroughly, because I got away by hiding under a basket.”</i>", parse);
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
				
				Scenes.Outlaws.MariasBouquetPrompt(opts);
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
				
				Scenes.Outlaws.MariasBouquetPrompt(opts);
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
				
				Scenes.Outlaws.MariasBouquetPrompt(opts);
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
			
			world.TimeStep({hour: 3});
			outlaws.mainQuestTimer = new Time(0,0,1,0,0);
			outlaws.flags["Met"] = Outlaws.Met.Bouqet;
			
			Gui.NextPrompt();
		});
	}
}

Scenes.Outlaws.PathIntoRigardInitiation = function() {
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
		
		world.TimeStep({hour: 1});
		
		outlaws.mainQuestTimer = new Time(0,0,2,0,0);
		outlaws.flags["Met"] = Outlaws.Met.Letter;
		
		Gui.NextPrompt();
	});
}

Scenes.Outlaws.PathIntoRigardBelinda = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	parse["season"] = world.time.Season == Season.Winter ? "hot drinks to warm oneself up on a cold day" : "cool drinks to help one beat the noon heat";
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
			Text.Add("The doberwoman nods and takes another sip of her drink. <i>“Why, yes. It’s in quite the central location, all sorts and shapes of people come in and go out from dawn to dusk… bringing in all sorts of gifts for their favorite whores, and departing with keepsakes. Besides, the royal guard never harasses The Shadow Lady, and that’s a very big plus for the likes of us.”</i>", parse);
			Text.NL();
			Text.Add("They don’t? Does Lucille pay them off so they leave her alone, or perhaps she gives them special rates or favors? Even if it’s patronized by the well-to-do, a place like The Shadow Lady would at least have garnered some interest from the more zealous royal guards.", parse);
			Text.NL();
			Text.Add("Belinda looks thoughtful at this, her eyes drawn into the distance as she scratches her chin. <i>“You by far underestimate the pull Madame Lucille has with Rigard’s upper crust, [playername]. If the royal guard were to raid The Shadow Lady any night of the week, they’d find no less than a dozen important personages rutting away in the upstairs rooms, not to speak of those on the floor. Well, maybe not that many - rutting might be too weak a word for some of the things they get up to - I should know. Trust me, my workplace isn’t going to see a single royal guard, except maybe as customers.</i>", parse);
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
		}
		Text.Flush();
		
		//Note, don't set Belinda's regular met flag, to get a custom meeting at the brothel
		outlaws.flags["Met"] = Outlaws.Met.MetBelinda;
		
		world.TimeStep({hour: 1});
		
		Gui.NextPrompt();
	});	
}
