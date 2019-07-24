
import { Event, Link, EncounterTable } from '../../event';
import { WorldTime } from '../../worldtime';

let PlazaLoc = new Event("Plaza");

let PlazaScenes = {}

//
// Plaza
//
PlazaLoc.description = function() {
	Text.Add("You are in a large open square surrounded by posh houses.");
	Text.NL();
	Text.Add("In the middle of the plaza is a large fountain in white marble, full of clear water. In the middle of the fountain on a raised pedestal stands a stone statue of the Lady Aria, covered in robes of silk that sway in the wind.");
	Text.NL();
	if(rigard.Krawitz["Q"] == Rigard.KrawitzQ.HuntingTerry) {
		Text.Add("The place is absolutely swarming with people as frazzled guards, irate merchants and angry residents swarm and flock and mingle in the now surprisingly cramped-feeling square.");
		Text.NL();
		Text.Add("There's not a lot of hiding places here, as even a cursory glance tells you, but the confusion and roving groups of people could be used as a kind of mobile camouflage, so it might be worth checking out.");
		Text.NL();
	}
}

PlazaLoc.onEntry = function() {
	if(Math.random() < 0.15)
		Scenes.Rigard.Chatter(true);
	else if(Math.random() < 0.3)
		Scenes.Rigard.Chatter2(true);
	else
		PrintDefaultOptions();
}

PlazaLoc.enc = new EncounterTable();
PlazaLoc.enc.AddEnc(function() { return Scenes.Rigard.Chatter;});
PlazaLoc.enc.AddEnc(function() { return Scenes.Rigard.Chatter2;});
PlazaLoc.enc.AddEnc(function() { return Scenes.Rigard.CityHistory;}, 1.0, function() { return rigard.flags["CityHistory"] == 0; });
PlazaLoc.enc.AddEnc(function() { return PlazaScenes.LetterDelivery; }, 1.0, function() { return (WorldTime().hour >= 6 && WorldTime().hour < 21); });
PlazaLoc.enc.AddEnc(function() { return PlazaScenes.StatueInfo; }, 1.0, function() { return (WorldTime().hour >= 6 && WorldTime().hour < 21) && (rigard.flags["TalkedStatue"] == 0 || (party.InParty(kiakai) && kiakai.flags["TalkedStatue"] == 0)); });
PlazaLoc.enc.AddEnc(function() { return Scenes.Krawitz.Duel;}, 3.0, function() { return rigard.Krawitz["Q"] == 1 && rigard.Krawitz["Duel"] == 0 && (WorldTime().hour >= 10 && WorldTime().hour < 20);});
PlazaLoc.enc.AddEnc(function() { return Scenes.Terry.ExplorePlaza; }, 1000000.0, function() { return rigard.Krawitz["Q"] == Rigard.KrawitzQ.HuntingTerry; });

PlazaLoc.links.push(new Link(
	"Gate", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Gate, {minute: 20});
	}
));
PlazaLoc.links.push(new Link(
	"Residential", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Residential.street, {minute: 10});
	}
));
PlazaLoc.links.push(new Link(
	"Merchants", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.ShopStreet.street, {minute: 10});
	}
));
PlazaLoc.links.push(new Link(
	"Plaza", true, false
));

PlazaLoc.links.push(new Link(
	"Inn", true, function() { return !rigard.UnderLockdown(); },
	function() {
		// TODO
		Text.Add("There is a large building bustling with the activity, apparently an inn. The sign over the entrance says “The Lady's Blessing”. ");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Inn.common);
	}
));
PlazaLoc.links.push(new Link(
	"Castle", true, function() { return !rigard.UnderLockdown(); },
	function() {
		Text.Add("The outer walls of the royal grounds stand near, and the castle looms on the hill above. ");
	},
	function() {
		var parse = {
			stride : player.LowerBodyType() == LowerBodyType.Single ? "slither" : "stride"
		};
		if(rigard.flags["RoyalAccess"] == 0) {
			Text.Clear();
			if(rigard.flags["RoyalAccessTalk"] < 1) {
				Text.Add("The innermost tier of the city of Rigard rests on a large hilltop surrounded by tall stone walls, crowned by the Royal castle. You can see guards patrolling along the bulwarks, and more stationed at the main gates. The guards all wear a different livery from those you have seen walking the streets, so you guess they belong to a different order than the city watch.", parse);
				Text.NL();
				if(rosalin.flags["Met"] == 0)
					Text.Add("Though you don’t have a concrete objective at the moment, there are bound to be people inside those walls that would prove of use to you.", parse);
				else
					Text.Add("You need to find your way inside those walls if you are going to find the royal alchemist, and get to the bottom of the mystery behind the gem.", parse);
				Text.Add(" Confidently, you [stride] up to the pair of bored-looking guards manning the gates.", parse);
				Text.NL();
				Text.Add("Before you’ve had a chance to as much as open your mouth, you are faced with drawn swords.", parse);
				Text.NL();

				var humanity = player.Humanity();

				if(humanity < 0.95) {
					Text.Add("<i>“Stand back, filthy creature!”</i> one of the guards snarl, spitting at your feet.", parse);
					Text.NL();
					Text.Add("<i>“Your kind is not welcome here, run back to your master,”</i> the other one adds, his voice reeking with hostility.", parse);
				}
				else {
					Text.Add("<i>“Halt citizen! No one enters here without an invitation from the nobility.”</i> The guard eyes you up and down, and snidely adds, <i>“Which, by the looks of you, you don’t have.”</i>", parse);
				}
				Text.Add(" No matter how you try, the pair seems unwilling to budge. Seems like you need some form of identification or invitation to get through the checkpoint.", parse);
				Text.NL();
				Text.Add("From what you gather these men belong to the Royal Guard, whose only task is to protect the nobility and the royal family. It seems like you are causing a bit of a scene, and a few curious passersby stop to watch, whispering among themselves. Frustrated, you decide to back down for now.", parse);
				Text.NL();

				Text.Add("As you turn to leave, you spot a postern gate open in the wall a few hundred paces to your left, and two people come out. Both of them wear gray cloaks, their hoods drawn, so you cannot make out much of their features. They are of a height, and walk companionably side by side, heading out toward the city. You point them out, and ask the guards who they are, curiously.", parse);
				Text.NL();
				if(humanity < 0.95) {
					Text.Add("<i>“No one your kind need concern themselves with,”</i> you get for a response. You stubbornly look at the guard, and he rolls his eyes in annoyance. <i>“Look,”</i> he speaks slowly and clearly, as if to a child, <i>“there are esteemed personages for whom special allowances are made, and who may pass in or out wherever they please.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Even I do not know who those two were. All I can say for sure is that they are so far above the likes of you, they would not even look at you.”</i>", parse);
				}
				else {
					Text.Add("The guard sighs in exasperation. <i>“There are esteemed personages for whom special allowances are made, and who may pass in or out wherever they please. Even I don’t know who those two were.”</i> He sneers at you behind his visor. <i>“All I can say for sure is that they are so far above you, they would not even look at you.”</i>", parse);
				}
				Text.NL();
				Text.Add("You turn to go, leaving the unfriendly watchmen behind you. The pair you saw exit the wall are still barely in sight, and on impulse you hurry toward them. Of course the guard said they wouldn’t speak to you, but it’s not like you have any better leads to follow.", parse);
				Text.NL();
				Text.Add("Past the couple, you spot another figure heading slowly toward them. He seems almost innocuous, but after a few moments you spot what drew your attention to him. He carefully maintains a set distance from the couple, clearly following them. You can’t quite make out his face at the distance, but you notice that his right hand hovers at his hip, fingering the hilt of a sword.", parse);
				if(lei.flags["Met"] == Lei.Met.SeenInn)
					Text.Add(" You realize that you’ve seen him before, in the common room of the Lady’s Blessing inn.", parse);
				Text.NL();
				Text.Add("You try to hurry, wondering if the two are being pursued, but unfortunately, before you are even half way, they follow the street past a corner and you lose sight of them, their tail disappearing soon after. By the time you reach the corner yourself, ", parse);
				var hour = WorldTime().hour;
				if(hour >= 10 && hour < 19)
					Text.Add("you can’t spot them amidst the milling crowds.", parse);
				else if(hour >= 6)
					Text.Add("they don’t seem to be among the passersby in front of you.", parse);
				else
					Text.Add("the street in front of you is totally empty.", parse);
				Text.NL();
				Text.Add("Well, that was a little disappointing. Still, judging by their quick disappearance, they probably turned into one of the buildings around here. It could be one of the private residences, but ", parse);
				if(lei.flags["Met"] == Lei.Met.SeenInn) {
					Text.Add("perhaps the best course of action would be to seek out the stranger at the Lady’s Blessing inn.", parse);
				}
				else if(rigard.LB["Visit"] != 0) {
					Text.Add("there’s also the Lady’s Blessing inn. Even if they’re not there, someone might know something about them, or perhaps supply you with some other lead.", parse);
				}
				else {
					parse["noisy"] = (hour >= 10 && hour < 20) ? "noisy" : "well-lit";
					Text.Add("you also spot a [noisy] inn further down the street. That’s likely worth checking out - even if they’re not there, it seems like a well-off establishment. Someone there might know something about them, or perhaps supply you with some other lead.", parse);
				}
				Text.NL();
				Text.Add("You idly wonder if perhaps helping them with their stalker could get you a favor in return.", parse);

				rigard.flags["RoyalAccessTalk"] = 1;
			}
			else {
				Text.Add("You briefly consider trying to approach the gates to the royal grounds again, but the guards look no friendlier than they did the last time.", parse);
			}
			Text.Flush();
			world.TimeStep({minute: 10});
			Gui.NextPrompt();
		}
		else {
			if(rigard.flags["RoyalAccessTalk"] < 2) {
				Text.Clear();
				Text.Add("Once again, you approach the hostile Royal Guardsmen manning the entrance to the innermost parts of Rigard.", parse);
				Text.NL();

				var humanity = player.Humanity();

				parse["plebFilth"] = humanity > 0.95 ? "pleb" : "filth";

				Text.Add("<i>“I thought we told you not to come here, [plebFilth]!”</i> the officer in charge growls as you saunter up. You grin at him smugly as you present him with the sealed letter you received from the royal twins. The man looks suspiciously at the envelope, his eyebrows rising as he sees the seal. Wordlessly, he breaks the seal and opens it, mulling over the contents, his face paling as he goes down the page.", parse);
				Text.NL();
				Text.Add("He looks very confused as he hands back the piece of paper, muttering that you are free to enter, to the surprise of his companion. Whatever instructions the note contained, it seemed to have been enough to convince him. You pass through a smaller door just next to the closed main gates, and find yourself within the royal grounds.", parse);
				Text.NL();
				Text.Add("As you step through, it is like entering another world. From the busy hubbub of the streets of Rigard, the royal grounds are eerily quiet. There are relatively few people moving around, and those that do have an air of self-importance. You spot groups of noblemen and women walking the paved paths, servants in tow. The entire grounds is like a large park, snaking paths weaving through lush greenery, with posh estates scattered throughout.", parse);
				Text.NL();
				Text.Add("Far above, on top of the rocky hill at the back of the area, you can see the stone walls of the castle jutting out of the bedrock. The approach is quite steep, snaking back and forth up the hillside. From a military perspective, the fortress would be a nightmare to take, the rough terrain further fortified by the works of men. Bright pennants snap in the wind on top of the tall towers overlooking the city.", parse);
				Text.NL();
				Text.Add("Speaking of towers, you spy a strange structure close by. The tower looks very out of place compared to the rich estates dotting the grounds - a crumbling obelisk of rock, neglected and worn down over the course of centuries. There is an eerie glow emanating from the windows on its upper levels, flickering between strange colors that have no business coming from a natural fire. ", parse);
				if(rosalin.flags["Met"] == 0)
					Text.Add("Most likely, there is magic at work here.", parse);
				else
					Text.Add("Your search for the court magician should probably start here.", parse);
				Text.Flush();

				rigard.flags["RoyalAccessTalk"] = 2;
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Castle.Grounds, {minute: 10});
				});
			}
			else
				MoveToLocation(world.loc.Rigard.Castle.Grounds, {minute: 10});
		}
	}
));

PlazaLoc.links.push(new Link(
	"Krawitz", function() { return rigard.Krawitz["Q"] == 1; }, true,
	function() {
		if(rigard.Krawitz["Q"] == 1) {
			Text.Add("Krawitz's estate is nearby.");
			Text.NL();
		}
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.street, {minute: 10});
	}
));

PlazaLoc.links.push(new Link(
	"Orellos", function() {
		return Scenes.Lei.Tasks.Escort.OnTask();
	}, function() {
		var t = true;
		if(WorldTime().hour < 10 || WorldTime().hour >= 17) t = false;
		if(lei.taskTimer.ToHours() > 7) t = false;
		return t;
	},
	function() {
		if(Scenes.Lei.Tasks.Escort.OnTask()) {
			Text.Add("Ventos Orellos' estate is nearby.");
			Text.NL();
		}
	},
	function() {
		Scenes.Lei.Tasks.Escort.Estate();
	}
));

PlazaLoc.events.push(new Link(
	"Goldsmith", function() { return room69.flags["Hinges"] == Room69.HingesFlags.Asked; }, function() { return WorldTime().hour >= 9 && WorldTime().hour < 18; },
	function() {
		if(room69.flags["Hinges"] == Room69.HingesFlags.Asked) {
			Text.Add("You see a rich establishment nearby, claiming to be the best goldsmith in town. Perhaps you could as the owner about making hinges for Sixtynine's door?");
			Text.NL();
		}
	},
	function() {
		Text.Clear();
		Text.Add("You approach the luxurious building housing one of the city’s prominent goldsmiths. You’ve heard he dabbles in banking as well, and generally caters to the upper classes. Hopefully the charge for hinges won’t be too high.");
		Text.NL();
		Text.Add("A cadre of guards is spread around the interior, protecting the gold works on exhibit. There is a variety of coins, statues, jewelry, chandeliers... No hinges though. Maybe it’s not quite the right place, but it can’t hurt to ask. Well, unless they throw you out on your face.");
		Text.NL();
		Text.Add("You tentatively approach the counter and ask the owner if he can make you gold hinges. Gilded ones, that is.");
		Text.NL();
		Text.Add("<i>“Gilded? We don’t stoop to that here. This establishment handles only the pure metal,”</i> he tells you, frowning, <i>“and its alloys of course. Now if you wanted solid gold... But you would need a light door, or the hinges would not hold it. Perhaps silver wrought over a thin frysan frame...?”</i>");
		Text.NL();
		Text.Add("He glances over you, remembering himself. <i>“But you would not be able to afford it. Go visit that oaf Martello in the merchant district. He should be more appropriate to your level.”</i>");
		Text.NL();
		Text.Add("Hearing the dismissal in his words, you thank him and leave. A bit pompous, but he did direct you at least.");
		Text.Flush();

		room69.flags["Hinges"] = Room69.HingesFlags.TalkedToGoldsmith;

		world.TimeStep({minute: 10});
		Gui.NextPrompt();
	}
));

PlazaScenes.StatueInfo = function() {
	var parse = {
		playername : player.name,
		name   : kiakai.name,
		heshe  : kiakai.heshe(),
		HeShe  : kiakai.HeShe(),
		himher : kiakai.himher(),
		hisher : kiakai.hisher(),
		HisHer : kiakai.HisHer()
	};

	rigard.flags["TalkedStatue"] = 1;

	Text.Clear();
	Text.Add("Walking around, you eventually reach the base of the statue you've seen towering above the plaza. It's even more impressive up close, standing about twice the height of the surrounding three-story buildings. While walking over, you thought you saw the dress stirring gently in the mild breeze, but had decided it was just a trick of your eyes.", parse);
	Text.NL();
	Text.Add("Now, standing before it, you see that the statue is indeed wearing an enormous white dress with gold trim, not unlike the one you saw on Aria herself. The face of the Goddess, however, doesn't look anything like you remember, and you note, blushing slightly, that the statue's breasts are actually quite a bit smaller.", parse);
	Text.NL();
	Text.Add("As you stand there, looking at the enormous sculpture, a well-dressed old man comes up to you. You wonder if he caught you staring at the statue's breasts. <i>“You are new to the city, are you not?”</i> To your relief, he doesn't mention where you were looking. <i>“It's really a most grand statue we have, but those of us who have lived here our whole lives have grown used to it.”</i>", parse);
	Text.NL();
	Text.Add("You ask if the city follows Aria devoutly.", parse);
	Text.NL();
	Text.Add("<i>“Most of us certainly do. Although there are always certain elements...”</i> He shakes his head disapprovingly. <i>“And the youth these days seems more interested in entertainment and games than in learning the things that made this city strong!”</i>", parse);
	Text.NL();
	Text.Add("You quickly interrupt him before he has a chance to go on a rant about moral degeneration, and ask about the statue's clothing.", parse);
	Text.NL();
	Text.Add("<i>“Ah, now that is a tale worth telling. You see, it is said that the clothing was actually obtained first, and the statue was made to accommodate it.”</i>", parse);
	Text.NL();
	Text.Add("<i>“A long long time ago, when the kingdom was first founded and the castle was just being built, there was a great crisis on Eden. There are many tales of what occurred. Some say dragons came through a portal, attacking humans; others that a devastating disease swept the land; yet others that a massive storm buffeted the Great Tree, threatening to tip it over, sending gigantic branches tumbling across the land. Be that as it may, Lady Aria visited the world to aid us, for she appeared more often back then.”</i>", parse);
	Text.NL();
	Text.Add("<i>“And aid us she did, and then, as she rested, Riorbane the trickster came across her. He told the Goddess that he had seen a great evil resting in a cave in the roots of the Great Tree, begging for her aid, for, he said, the need was dire. Unfortunately, she had come to the world in giant stature, and her enormous form could not fit inside the small cave. So, she bid Riorbane face away and await her outside.”</i>", parse);
	Text.NL();
	Text.Add("<i>“She shrank down to a size that could pass inside, but her dress did not shrink, but instead collapsed where it was. As Aria entered the cave, Riorbane snatched up the dress, and carried it off, hiding it securely. When Aria re-emerged, bemused by the lack of anything but a stream in the grotto, he confronted her in her nakedness, and said he would only return the dress if she spent the night with him.”</i> The old man looks much happier telling the story, than a professed devout follower of Aria really should be.", parse);
	Text.NL();
	Text.Add("<i>“Though Lady Aria simply cloaked herself in mist and refused, she was still wroth with him. She told him, ‘Though you may keep my dress if you so wish, all clothing of yours shall be stolen or lost again and again.'”</i> The old man's imitation of Aria's voice makes you cringe a little. <i>“Now, Riorbane was none too happy to be denied his lay, though stories tell that he wasn't too upset at the curse that was bestowed upon him. Either way, he found himself in possession the Goddess's dress, not knowing what use to put it to.”</i>", parse);
	Text.NL();
	Text.Add("<i>“It was enormous and impervious to not only wear and water, but also shears and knife. In the end, he could do nothing with it, and traded it to his brother, Riordain, gaining a favor he had desired in exchange. With the dress in hand, before his castle, to show respect for the Goddess and ask for her blessing in the establishment of the kingdom, Riordain erected a statue for the Goddess in her exact likeness, and adorned it in her garment.”</i> The old man speaks with pride in his voice, and you decide not to disillusion him about how alike the statue is.", parse);
	Text.NL();
	Text.Add("<i>“Though it is told that Riorbane had some hand in the statue's construction also, and underneath the garment, it bears far more detail than is needful, if you understand what I mean,”</i> he adds, a lascivious grin splitting his wizened face.", parse);
	Text.NL();

	player.AddExp(10);

	Text.Add("A little embarrassed, you nonetheless thank him for telling you the story ", parse);
	if(!party.InParty(kiakai)) {
		Text.Add("and set off on your way, glad to have learned a little of the city's history.", parse);
		Text.Flush();
		Gui.NextPrompt();
	}
	else {
		kiakai.flags["TalkedStatue"] = 1;

		Text.Add("and are about to set off on your way when [name] speaks up.", parse);
		Text.NL();
		Text.Add("<i>“I hope you do not take that story seriously, [playername]!”</i> [name] exclaims. <i>“It is surely just something the humans made up. They probably enchanted the dress, forgot they did it, and then made up this story to explain the whole thing,”</i> the elf declares, sounding contemptuous.", parse);
		Text.NL();
		Text.Add("You tell [himher] that the story <i>does</i> sound a little far-fetched. Besides, you ask, did Aria even really come to Eden?", parse);
		Text.NL();
		Text.Add("<i>“W-well...”</i> [name] looks slightly embarrassed. <i>“That part is true enough. I was never told what happened, for it was not in the lore scrolls of my village, but I do know she manifested in this world around the time of the kingdom's founding. The rest is surely made up, however!”</i> [heshe] hastily adds.", parse);
		Text.Flush();

		//[Accept][Tease][Investigate]
		var options = new Array();
		options.push({ nameStr : "Accept",
			func : function() {
				Text.Clear();
				Text.Add("You tell the elf that from what you saw of Aria, the story indeed does not fit very well.", parse);
				Text.NL();
				Text.Add("<i>“That is so! She would not be tricked so easily by some mortal, and she could just shrink her dress, and...”</i> The elf goes on for some time about why nothing in the story makes sense. You smile - [heshe] looks quite cute when flustered.", parse);
				Text.NL();
				Text.Add("When [name] stops for breath, you gently interrupt [himher], pointing out that it's time you got going.", parse);
				//#+nice, +rel
				kiakai.relation.IncreaseStat(100,3);
				kiakai.subDom.IncreaseStat(0, 2);
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "The story did sound rather ridiculous..."
		});
		options.push({ nameStr : "Tease",
			func : function() {
				Text.Clear();
				Text.Add("You start telling the elf that the story does sound quite implausible, and as [heshe] starts nodding, you add how implausible it is that Aria would refuse to sleep with Riorbane. Despite your best efforts, you can't quite suppress your laughter, as [name]'s expression goes from open-mouthed astonishment, to red-faced embarrassment, to obvious consternation. [HisHer] mouth tries to start moving again and again, but no words come out for a good half minute.", parse);
				Text.NL();
				Text.Add("<i>“T-the Goddess is not as obsessed with sex as some people I know!”</i> [heshe] finally manages, and stalks off, with you following, still grinning with mirth.", parse);
				//#+naughty
				kiakai.subDom.DecreaseStat(-100, 2);
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "'Agree' that Aria refusing to sleep with Riorbane seems implausible."
		});
		options.push({ nameStr : "Investigate",
			func : function() {
				Text.Clear();
				Text.Add("You tell the elf that while many elements of the story sound implausible, clearly it does bear some resemblance to reality. Further study will be required to disentangle truth from myth.", parse);
				Text.NL();
				Text.Add("[name] looks thoughtful, mulling over your words. <i>“You know, you have a point, [playername]. Though I am sure the embarrassing trickery aspect is untrue, there are enough hints in the story that it bears looking into.”</i> [HeShe] smiles, [hisher] curiosity clearly piqued.", parse);
				Text.NL();
				Text.Add("You agree that the two of you can look into it when you have the chance, and set off on your way.", parse);
				//#+1 int, (+rel?)
				player.intelligence.IncreaseStat(100,1);
				kiakai.relation.IncreaseStat(100,1);
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "It might be true, it might not, you'll need more information to decide."
		});
		Gui.SetButtonsFromList(options);
	}
}

PlazaScenes.LetterDelivery = function() {
	var letters     = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var animals     = ["stallion", "dog", "eel", "python", "pony", "wildcat", "mare"];
	var colors      = ["green", "red", "blue", "purple", "pink", "gray", "orange"];
	var races       = ["fox", "dog", "cat", "horse", "rabbit"];
	var reactions   = ["shrug", "glance through the message a final time", "ponder over the message", "briefly consider the message", "smile in bemusement"];
	var residencies = ["a massive ornate building", "a three-story palatial structure", "a posh-looking house", "an out-of-place hovel of a building", "an old derelict mansion", "a fresco-covered house", "an odd [color] building"];
	var nobles      = ["a richly dressed noble[manwoman]", "a noble[manwoman] dressed in all [color]", "a haggard-looking noble[manwoman]", "an aged noble[manwoman]", "an excited young noble[manwoman]", "a foppish young noble[manwoman]", "a shady noble[manwoman]"];
	var recips      = ["an elderly noble[manwoman]", "a busy-looking [mp]atriarch", "a dusty librarian", "a badly underdressed [manwoman]", "a serious-looking [race]-morph", "a stern watch[manwoman]", "a priest[ess] of Aria"];

	var coin  = 5  + Rand(10);
	var coin2 = 10 + Rand(10);

	var parse = {
		name    : kiakai.name,
		heshe   : kiakai.heshe(),
		hisher  : kiakai.hisher(),
		BoyGirl : player.Femininity() > 0 ? "Girl" : "Boy",
		letter  : function() { return letters.charAt(Math.floor(Math.random() * letters.length)); },
		animal  : function() { return animals[Math.floor(Math.random() * animals.length)]; },
		color   : function() { return colors[Math.floor(Math.random() * colors.length)]; },
		race    : function() { return races[Math.floor(Math.random() * races.length)]; },
		playerReaction : function() { return reactions[Math.floor(Math.random() * reactions.length)]; },
		residenceDesc : function() { return Text.Parse(residencies[Math.floor(Math.random() * residencies.length)], parse); },
		lordLady : function() {return Math.random() < 0.5 ? "lord" : "lady"; },
		coin     : Text.NumToText(coin),
		coin2    : Text.NumToText(coin2)
	};

	// Sender
	if(Math.random() < 0.5) { // MALE
		parse["manwoman"]    = "man";
		parse["sheshe"]      = "he";
		parse["shisher"]     = "his";
		parse["shimher"]     = "him";
		parse["sHeShe"]      = "He";
		parse["sDaddyMommy"] = "daddy";
		parse["sCockPussy"]  = "cock";
	}
	else { // FEMALE
		parse["manwoman"]    = "woman";
		parse["sheshe"]      = "she";
		parse["shisher"]     = "her";
		parse["shimher"]     = "her";
		parse["sHeShe"]      = "She";
		parse["sDaddyMommy"] = "mommy";
		parse["sCockPussy"]  = Math.random() < 0.2 ? "cock" : "pussy"; // cause
	}
	parse["nobleDesc"] = Text.Parse(nobles[Math.floor(Math.random() * nobles.length)], parse);

	// Recipient
	if(Math.random() < 0.5) { // MALE
		parse["SirMadam"]    = "Sir";
		parse["manwoman"]    = "man";
		parse["rheshe"]      = "he";
		parse["rhisher"]     = "his";
		parse["rhimher"]     = "him";
		parse["rHeShe"]      = "He";
		parse["ess"]         = "";
		parse["mp"]          = "p";
	}
	else { // FEMALE
		parse["SirMadam"]    = "Madam";
		parse["manwoman"]    = "woman";
		parse["rheshe"]      = "she";
		parse["rhisher"]     = "her";
		parse["rhimher"]     = "her";
		parse["rHeShe"]      = "She";
		parse["ess"]         = "ess";
		parse["mp"]          = "m";
	}
	parse["recipient"] = Text.Parse(recips[Math.floor(Math.random() * recips.length)], parse);

	Text.Clear();
	Text.Add("You walk around the plaza district, looking around at the many grand residences competing for space around the wide streets. As you're about to walk past [residenceDesc], [nobleDesc] shouts at you from the entrance, waving a small envelope in [shisher] hand.", parse);
	Text.NL();
	Text.Add("<i>“[BoyGirl]! Deliver this for me!”</i>", parse);
	Text.NL();
	Text.Add("You decide it'd be better not to agitate the haughty noble, and approach [shimher].", parse);
	Text.NL();
	Text.Add("<i>“Good,”</i> [sheshe] tells you, <i>“here's some coin for you trouble.”</i> [sHeShe] gives you [coin] coins, and tells you the message's destination. <i>“Now, off you go!”</i> [sHeShe] waves at you dismissively.", parse);
	Text.NL();

	party.coin += coin;

	Text.Add("As you walk away from [shimher], you wonder if you should really bother with the job. After all, you didn't actually agree to anything. The crazy noble just assumed everything [shimher]self.", parse);
	Text.Flush();

	//[Deliver][Open]
	var options = new Array();
	options.push({ nameStr : "Deliver",
		func : function() {
			Text.Clear();
			Text.Add("The task is a little demeaning, but you decide it's worth a small effort to get a few more coins. Occasionally asking for directions, you quickly reach your destination, and hand over the note to the recipient, [recipient].", parse);
			Text.NL();
			Text.Add("[rHeShe] gives you [coin2] coins for your trouble, and you go on your way.", parse);

			party.coin += coin2;

			world.TimeStep({minute: 30});
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Deliver the note as the noble wants."
	});
	options.push({ nameStr : "Open",
		func : function() {
			Text.Clear();
			Text.Add("You decide people shouldn't assume others will do what they demand without consulting them. You break the plain wax seal, tossing it to the side of the road, and have a look at the note.", parse);
			Text.NL();

			var sexy = false;

			// RANDOM SCENE (USING ENCOUNTER TABLE)

			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("<i>“Dear [SirMadam],", parse);
				Text.NL();
				Text.Add("I feel grievously insulted by your allegation of my behavior with that [animal]. Please withdraw these slanderous words at once, and I may yet invite you with me next time! -[letter].[letter].”</i>", parse);
				sexy = true;
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“I am being held prisoner here. They are forcing me to learn to get along with people. Please send help!</i>", parse);
				Text.NL();
				Text.Add("<i>-[letter].[letter].”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“I fear they are on to me. Our rendezvous will have to be postponed. Let us try to meet tomorrow at the same place.</i>", parse);
				Text.NL();
				Text.Add("<i>-[letter].[letter].”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("The letter is written in a barely legible hand, but you manage to make it out:", parse);
				Text.NL();
				Text.Add("<i>“I hope ur asociates wil consider me for publicaton. I'll snd my manucrpit alng directli. It is qute heavi.</i>", parse);
				Text.NL();
				Text.Add("<i>-[letter].[letter].”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Why do you torment me so? You know I cannot visit you, so at least grace this tortured soul with a response.</i>", parse);
				Text.NL();
				Text.Add("<i>-[letter].”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Hello [SirMadam],</i>", parse);
				Text.NL();
				Text.Add("<i>I am considering starting a business helping people write letters. If you would like to help come up with stock letters to send, please contact Alder at your earliest convenience.”</i>", parse);
				Text.NL();
				Text.Add("The letter is oddly unsigned.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Hi, slut, [sDaddyMommy]'s expecting you, [shisher] [sCockPussy] drooling, waiting for your tongue. Come soon or I'll have to punish you.</i>", parse);
				Text.NL();
				Text.Add("<i>XOXO, [letter].”</i>", parse);
				sexy = true;
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“I have heard rumors that your son wishes to challenge that Lei man. I would advise you to stop him to avoid humiliation. -[letter].[letter].”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Meet me at the Lady's Blessing tonight. Their musicians are excellent, and I've rented a room upstairs. -[letter].”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“I have found companionship at the Shadow Lady. Come join me tonight, I am sure you will also grow to love how pleasurable it is. -[letter].[letter].”</i>", parse);
				sexy = true;
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Cannot make it to the party this night. Cancel the order we previously discussed. -[letter].[letter].”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("The note seems to be some written in some sort of code. You are unable to decipher it. Crafty.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Yesterday is still a blur... you are as skilled as ever. - love, [letter].”</i>", parse);
				sexy = true;
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Cannot stand to be apart from you for any longer, return quickly! -[letter].[letter].”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				// Recipient
				if(Math.random() < 0.5) { // MALE
					parse["lordLady"]    = "lord";
					parse["Lhisher"]    = "his";
				}
				else { // FEMALE
					parse["lordLady"]    = "lady";
					parse["Lhisher"]    = "her";
				}
				Text.Add("<i>“Did you hear about that [lordLady] who was found with [Lhisher] servants the other night? Such debauchery... -[letter].[letter].”</i>", parse);
				sexy = true;
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“You. Me. A bottle of the finest wine. Tonight under the stars in our usual spot. -love, [letter].[letter].”</i>", parse);
				sexy = true;
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				// Recipient
				if(Math.random() < 0.5) { // MALE
					parse["Sboygirl"]    = "boy";
					parse["Shimher"]    = "him";
				}
				else { // FEMALE
					parse["Sboygirl"]    = "girl";
					parse["Shimher"]    = "her";
				}
				Text.Add("<i>“The servant [Sboygirl] suspects. We may have to deal with [Shimher]. -[letter].[letter].”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Would you believe those Royal Guards? Paid the usual amount this month, yet they start snooping around the warehouse! Move the stock to a safe location as quickly as possible, or I fear we may be found out. -X”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“The stars are aligning in a peculiar pattern. Had word from the mother superior the other day. She says that strange things are afoot. We might have to leave for another expedition. -[letter].[letter].”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				parse["boygirl"] = Math.random() < 0.3 ? "boy" : "girl";
				Text.Add("<i>“Did you see the new [boygirl] at the Shadow Lady? Was a while since we had a [race]-morph... What say you we split the price, for old times' sake? -[letter].”</i>", parse);
				sexy = true;
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Candles. Leather straps. Whip (the big one!). Two fathoms of rope. Thirty gallons of syrup.”</i>", parse);
				Text.NL();
				Text.Add("If it is a shopping list, it is certainly a rather odd one...", parse);
				sexy = true;
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Rather than text, the note contains a hastily scribbled image of a horsecock. The hell...", parse);
				sexy = true;
			}, 1.0, function() { return true; });

			scenes.Get();

			Text.NL();
			if(party.InParty(kiakai) && sexy) {
				Text.Add("[name] leans over and reads the note along with you, curiously. As [hisher] eyes scan the lines, you see a deep crimson spread through [hisher] cheeks. <i>“O-oh!”</i> [heshe] exclaims, and turns away, biting [hisher] lower lip.", parse);
				Text.NL();
			}
			Text.Add("You [playerReaction], and pocket the letter.", parse);
			Text.NL();
			Text.Add("<b>You received a letter.</b>");

			party.Inv().AddItem(Items.Letter);

			world.TimeStep({minute: 15});
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Have a look at the note and throw it away."
	});
	Gui.SetButtonsFromList(options);
}

export { PlazaLoc, PlazaScenes };
