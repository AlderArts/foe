/*
 * Outlaws flags
 */

Scenes.Outlaws = {};

// Class to handle global flags and logic for outlaws
function Outlaws(storage) {
	this.flags = {};
	
	this.flags["BT"] = 0; // Bitmask
	this.flags["BullTower"] = 0;
	
	this.relation = new Stat(0);
	
	this.BTRewardTimer = new Time();
	
	if(storage) this.FromStorage(storage);
}

Outlaws.prototype.ToStorage = function() {
	var storage = {};
	
	storage.flags = this.flags;
	if(this.relation.base != 0)
		storage.rep = this.relation.base.toFixed();
	
	storage.BTtime = this.BTRewardTimer.ToStorage();
	
	return storage;
}

Outlaws.prototype.FromStorage = function(storage) {
	storage = storage || {};
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
	this.relation.base = !isNaN(parseInt(storage.rep)) ? parseInt(storage.rep) : this.relation.base;
	
	this.BTRewardTimer.FromStorage(storage.BTtime);
}

Outlaws.prototype.Update = function(step) {
	this.BTRewardTimer.Dec(step);
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




/* TODO
 * 
#Require that PC have introduced self to all outlaws available from start. (Aquilius at present)
#Trigger upon trying to find Maria in the outlaws’ camp. (I.E, clicking on her button) 
#Possibly only trigger in the late morning to early evening, say 11 am to 7 pm.
#Possibly require some rep with outlaws first (helping Maria/Aquilius for a bit)
 */
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
		Text.Add("They just stretch on and on, spidery scrawl across grey stone, and you swallow hard. <i>“Beyond these are the nameless thousands who didn’t have someone to remember them, whole familiy lines wiped out and forgotten.”</i> The huntress turns to look at you, her eyes filled with sadness.", parse);
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
				Text.Add("<i>“No. I don’t know their names, [playername]. I had no need of them; they were always ‘Papa’, ‘Mama’, and ‘Brother’ to me. And while I still remember something of their faces, the memory grows dimmer with each passing year.”</i> Maria’s voice is strangely quiet. <i>“If I were to die tomorrow, there’d be no one in all the planes who remembers them any more.</i>", parse);
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
			
			//TODO flag
			world.TimeStep({hour: 3});
			
			Gui.NextPrompt();
		});
	}
}
