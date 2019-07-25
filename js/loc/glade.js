/*
 * 
 * Dryads' glade
 * 
 */

import { Event, Link } from '../event';
import { WorldTime, MoveToLocation } from '../GAME';
import { Season } from '../time';
import { SetGameState, GameState } from '../gamestate';
import { Gui } from '../gui';
import { Text } from '../text';
import { Encounter } from '../combat';
import { Party } from '../party';

let world = null;

export function InitGlade(w) {
	world = w;
	world.SaveSpots["Dryads"] = GladeLoc;
};

let DryadGladeScenes = {};

function DryadGlade(storage) {
	this.flags = {};
	
	this.flags["Visit"] = DryadGlade.Visit.NotVisited;
	
	if(storage) this.FromStorage(storage);
}

DryadGlade.Visit = {
	NotVisited     : 0,
	Visited        : 1,
	DefeatedOrchid : 2
};

DryadGlade.prototype.ToStorage = function() {
	var storage = {};
	storage.flags = this.flags;
	return storage;
}

DryadGlade.prototype.FromStorage = function(storage) {
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
}

DryadGlade.prototype.Update = function(step) {
	
}

//TODO
DryadGlade.prototype.OrchidSlut = function() {
	return false;
}

let GladeLoc = new Event("Dryads' glade");

GladeLoc.SaveSpot = "Dryads";
GladeLoc.safe = function() { return true; };
GladeLoc.description = function() {
	var parse = {
		
	};
	
	Text.Add("As always, there is a serene stillness to the dryads’ glade. A few nymphs are playing around in the spring, their peals of laughter a pure song of joy. More forest creatures lounge about the flower field, waving to you when they see you. A soft glow that seems to emanate from the spring itself spreads warmth throughout the area.", parse);
	Text.NL();
	Text.Add("At the center of the glade stands the old Mother Tree, the voluptuous dryad herself resting on some of the low roots.", parse);
	Text.NL();
	if(orchid.Relation() > 50)
		Text.Add("Her daughter Orchid is playing around with some of her friends in what looks like an intense game of tag, using the full range of her tentacles. Both she and the other forest creatures are laughing merrily.", parse);
	else
		Text.Add("Her daughter Orchid is playing around with some of her friends, though she is cautious about where she waves her tentacles.", parse);
	Text.Flush();
}

GladeLoc.links.push(new Link(
	"Leave", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Forest.Outskirts, {minute: 15});
	}
));
GladeLoc.events.push(new Link(
	"Mother tree", true, true,
	null,
	function() {
		DryadGladeScenes.MotherTree();
	}
));
GladeLoc.events.push(new Link(
	"Orchid", true, true,
	null,
	function() {
		Scenes.Orchid.Interact();
	}
));

GladeLoc.onEntry = function() {
	if(glade.flags["Visit"] >= DryadGlade.Visit.DefeatedOrchid) {
		PrintDefaultOptions();
		return;
	}
	
	var parse = {
		
	};
	
	Text.Clear();
	if(glade.flags["Visit"] == DryadGlade.Visit.NotVisited) {
		Text.Add("You’ve never been quite as deep into the forest as this before, and you can’t help but feel uneasy as the trees around you grow larger and larger. By now, you are beneath the canopy of the Great Tree itself, an oppressive shadow looming thousands of feet above you. In comparison, the trees around you seem small, but you have no doubt that they are very old. The deeper you delve, the harder it is to pass through the dense undergrowth, and thick tree trunks seem to be almost cutting off your path. If not for the court magician’s directions, you would have been hopelessly lost long ago.", parse);
		Text.NL();
		Text.Add("Just as you are beginning to wonder if Jeanne has sent you on a wild goose chase, you notice the trees thinning ahead.", parse);
		glade.flags["Visit"] = DryadGlade.Visit.Visited;
	}
	else {
		Text.Add("You begin to recognize the path to the dryad glade that Jeanne told you about. Once again, you approach the clearing deep within the forest.", parse);
	}
	Text.NL();
	Text.Add("Though you know this might be the only way to power up the gemstone, you can’t help but feel that there is danger ahead.", parse);
	Text.NL();
	Text.Add("Do you continue toward the glade?", parse);
	Text.Flush();
	
	//[Enter][Leave]
	var options = new Array();
	options.push({ nameStr : "Enter",
		func : DryadGladeScenes.First, enabled : true,
		tooltip : "There is no time to lose. Go forth, steeling yourself against whatever danger awaits."
	});
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			Text.Add("You divert your course, staying clear of the glade for now. You should return when you are better prepared.", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				MoveToLocation(world.loc.Forest.Outskirts, {minute: 15})
			});
		}, enabled : true,
		tooltip : "Return once you are better prepared."
	});
	Gui.SetButtonsFromList(options, false, null);
}

DryadGladeScenes.First = function() {
	var parse = {
		playername : player.name
	};
	
	if(party.Num() <= 1)
		parse["comp"] = "";
	else if(party.Num() == 2)
		parse["comp"] = " and " + party.Get(1).name;
	else
		parse["comp"] = " and your companions";
	
	Text.Clear();
	Text.Add("Quickening your step, you[comp] soldier on, making for the clearing. You enter a meadow filled with flowers of every shape and color, illuminated by an eerie glow. For a moment, your senses are almost overwhelmed as a thousand different smells enter your nostrils. ", parse);
	if(WorldTime().season == Season.Winter)
		Text.Add("It is somehow getting a lot warmer, and you can’t spy even a single flake of snow in the field of flowers. It’s as if supernatural forces watch over the glade, keeping it in a state of perpetual summer. ", parse);
	Text.Add("At the center of the clearing - beyond a spring of clear water - there is a huge tree; easily the largest one you have ever seen - not counting the hulking giant above. The goal of your quest, the Mother Tree, awaits you.", parse);
	Text.NL();
	Text.Add("Deer and rabbits watch you without fear as you make your way into the beautiful glade. You can also spy more unnatural creatures peeking out behind the trees, watching you curiously. They stay just at the edge of your perception, giving you only vague glimpses of the fae creatures of the forest. A few look like humans or elves, but there is an eerie quality to them. Yet more have only vaguely human features. You think you see what looks like a deer, but when she peeks out from behind a tree, her upper body is that of a beautiful, naked woman. As soon as you spot her, the centaur giggles and hops away, disappearing into the forest.", parse);
	Text.NL();
	Text.Add("You gulp uncertainly, but none of the creatures seem to be showing any hostile intent toward you. You stride forward, trusting the elven magician’s word that this is where you’ll find the power you need. The creatures of the forest veer clear of you, allowing you to approach the huge tree at the center of the glade.", parse);
	Text.NL();
	Text.Add("As you draw closer, skirting around the spring, you are startled to find someone waiting for you - a tall woman with skin brown as bark, her long hair a flowing mass of green entwined with flowers and leaves. She is ‘clothed’ in vines and leaves, though they do little to cover her voluptuous form and enormous breasts. She is perched partway up the trunk of the tree, resting on top of a thick root. The woman waves at you to come closer.", parse);
	Text.NL();
	Text.Add("<i>“Approach, Lifegiver,”</i> she calls to you, her voice throaty and reassuring, like that of a loving mother. The smell around you is that of rich, fertile soil. <i>“I have been waiting for you.”</i> You shake yourself to break away from her deep almond gaze, finally noticing the branches weaving into her back. The woman is clearly a dryad, part of the Mother Tree itself.", parse);
	Text.NL();
	Text.Add("A little unnerved by the title she gave you, you introduce yourself and tell her that you were sent here by Jeanne.", parse);
	Text.NL();
	Text.Add("<i>“Yes, my little elven sister has spoken to me of this. I know why you are here, [playername].”</i> Her voice carries a heavy sense of sadness. You can only imagine how old this creature is if she refers to the ancient magician in those terms. <i>“I have many names - Oak, Amaryllis, Doe, Spring. Most call me the Mother Tree.”</i>", parse);
	Text.NL();
	Text.Add("...And? Can she help you? As you speak, you notice a young dryad, hardly more than a child, peeking out behind the thick trunk of the tree. She blushes and hides herself again when she notices that you’ve seen her.", parse);
	Text.NL();
	Text.Add("<i>“I’m afraid I cannot,”</i> the Mother Tree sighs sorrowfully. <i>“In my youth, perhaps, but that is ages upon ages past. Now, the Tree and I are one, my spirit bonded tightly with it. I am old, though young when compared to the Great One.”</i> The last is spoken reverently, as she gazes loving on the gargantuan trunk towering high above even her own tree.", parse);
	Text.NL();
	Text.Add("Her… spirit?", parse);
	Text.NL();
	Text.Add("<i>“Yes, the only thing that can return life to the stone you carry.”</i> For a moment, her eyes glow with a soft golden light and a wave of warmth sweeps over you. <i>“For centuries upon centuries, I have nurtured my tree, my glade and my daughters, but in doing so I have forever bound myself to this place. I am sorry that I cannot give you what you seek.”</i>", parse);
	Text.NL();
	Text.Add("You are about to respond when the forest suddenly stirs around you, and you hear the cries of surprised and terrified nymphs. They break from the treeline; dozens of strange and alluring creatures, dryads, nymphs and satyrs fleeing for their lives. You see the deertaur from before bounding and leaping toward you, glancing over her shoulder in terror. Before she reaches you, a mass of long, snaking tentacles whips out from the forest, wrapping themselves around the screaming doe and pulling her back into the shadow of the forest.", parse);
	Text.NL();
	Text.Add("<i>“W-what is this?”</i> the Mother Tree cries out in distress, anxiously biting her lip. You hear the centaur’s screams turn to muffled moans as the betentacled assaulter presumably violates her. <i>“Who could-?”</i> The old dryad cuts off, gasping as the attacker enters the glade, striding toward you confidently.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("The newcomer is another dryad; a creature of the forest, though she is very different from the one beside you. Her skin is green and her wild hair a yet darker green, though you can see pulsing purple veins spreading like a spider web over her lithe form. Her back is a mass of vile, squirming tentacles, spreading out behind her many times her length. Somewhere behind her, you see the centaur being dragged into the clearing, spit roasted with at least three tentacles in every one of her holes.", parse);
		Text.NL();
		Text.Add("<i>“Is… is that you, Orchid?”</i> the Mother Tree whimpers, her voice breaking in a pained mixture of fear and sorrow. <i>“P-please stop this, my daughter! What has happened to you?!”</i>", parse);
		Text.NL();
		Text.Add("The betentacled dryad only gives her mother a feral grin, the deep black wells of her eyes sending shudders down your spine. There is no compassion there, only a dark, all-consuming lust.", parse);
		Text.NL();
		parse["selfSelves"] = party.Num() > 1 ? "selves" : "self";
		Text.Add("You[comp] ready your[selfSelves] for battle. Just in time, as the monster charges you, baring her fangs. Tentacles sweep past you, trying to ensnare you[comp] and only barely missing. The old dryad is not so lucky, as countless of thick vines wrap around her, beginning to ravage her.", parse);
		Text.NL();
		Text.Add("<i>“F-fuck! Gonna fuck all of you!”</i> the corrupted dryad cries, turning toward you.", parse);
		Text.NL();
		Text.Add("It’s a fight!", parse);
		Text.Flush();
		
		var enemy = new Party();
		enemy.AddMember(orchid);
		var enc = new Encounter(enemy);
		
		orchid.RestFull();
		
		enc.canRun = false;
		
		enc.onLoss = DryadGladeScenes.FirstLoss;
		enc.onVictory = DryadGladeScenes.FirstWin;
		
		Gui.NextPrompt(function() {
			enc.Start();
		});
	});
}

DryadGladeScenes.FirstLoss = function() {
	SetGameState(GameState.Event, Gui);
	
	var parse = {
		armor : function() { return player.ArmorDesc(); }
	};
	
	if(party.Num() <= 1)
		parse["comp"] = "";
	else if(party.Num() == 2)
		parse["comp"] = " and " + party.Get(1).name;
	else
		parse["comp"] = " and your companions";
		
	
	Text.Clear();
	Text.Add("You[comp] fall to the ground, thoroughly defeated by the corrupted Orchid.", parse);
	Text.NL();
	Text.Add("<i>“Why, my daughter, why?”</i> the Mother Tree wails, struggling weakly as she climaxes yet another time from the tentacles railing her. It’s the last intelligible thing you hear from her before she deteriorates into uncontrollable moaning, somewhat muffled by another throng of thick vines plugging her mouth. By now, you can hardly tell that the dryad is dark skinned, so thick is the coat of cum covering her shuddering body.", parse);
	Text.NL();
	Text.Add("At the edge of your vision, you see the young child you saw before. Her eyes are wide with horror at what is happening, and she quickly runs away before the creature can grab hold of her.", parse);
	Text.NL();
	Text.Add("The corrupted dryad ignores her mother - by now reduced to nothing but a lust-drunk slut - and steps over to you, her hips swaying back and forth. Her tentacles hover above menacingly, their dripping, bulbous tips looking very much like cockheads.", parse);
	Text.NL();
	Text.Add("<i>“Mmm… so much more fun when they wriggle,”</i> she gloats, looking down on you with malice. <i>“Makes me want to play with them...”</i> Tentacles whip out, grabbing hold of your struggling form, and easily lift you into the air. She’s strong… so strong. With little to no effort, she all but rips away the remaining scraps of your [armor], leaving you nude. You squirm desperately, trying to get away from the slimy tentacles wrapping around your limbs, but in the end you are powerless to stop her.", parse);
	Text.NL();
	
	if(party.Num() > 1) {
		var count = 1;
		var total = party.Num();
		
		if(party.Num() == 2)
			parse["comp"] = party.Get(1).name;
		else
			parse["comp"] = "your companions";
		
		Text.Add("<i>“I’ll get to you in a moment, okay?”</i> Orchid says, turning to [comp].", parse);
		Text.NL();
		if(party.InParty(kiakai)) {
			var parse = {
				name : kiakai.name,
				possessive : kiakai.possessive(),
				boyGirl : kiakai.mfTrue("boy", "girl"),
				legsDesc : function() { return kiakai.LegsDesc(); },
				cocks : function() { return kiakai.MultiCockDesc(); }
			}
			parse = kiakai.ParserPronouns(parse);
			
			Text.Add("<i>“Elves… I just found a few elves in the forest on my way here,”</i> the dryad says coyly as she wraps [name] in tentacles, raising up the elf beside you. <i>“Let’s find out if you squeal as much as they did!”</i>", parse);
			Text.NL();
			Text.Add("<i>“S-stay back, monster!”</i> [name] whimpers, too weak to put up a fight anymore. [HeShe] shudders as tentacles begin snaking their way up [hisher] [legsDesc], leaving large swatches of corrupt, glistening seed wherever they touch. The elf puts up a final effort of resistance, but it’s quickly extinguished as tentacles force themselves on [himher], plunging deep within [hisher] body.", parse);
			Text.NL();
			if(kiakai.FirstVag()) {
				Text.Add("[name] cries out as [hisher] virgin pussy is roughly laid bare, tentacles thicker than [hisher] arm worming their way inside in search for [hisher] womb. You did not think this would be the way the elf lost [hisher] virginity.", parse);
				Text.NL();
				
				Sex.Vaginal(orchid, kiakai);
				kiakai.FuckVag(kiakai.FirstVag(), orchid.FirstCock(), 3);
				orchid.Fuck(orchid.FirstCock(), 3);
			}
			Text.Add("A mass of writhing vines spreads the elf’s butt cheeks, penetrating [himher] one after another, each one pushing the poor [boyGirl] more and more beyond [hisher] limits.", parse);
			if(kiakai.flags["AnalExp"] > 20)
				Text.Add(" Hopefully, the extensive anal training you have given [himher] helps [himher] a little, but it’s a small consolation.", parse);
			Text.NL();
			
			Sex.Anal(orchid, kiakai);
			kiakai.FuckAnal(kiakai.Butt(), orchid.FirstCock(), 3);
			orchid.Fuck(orchid.FirstCock(), 3);
			
			if(kiakai.FirstCock()) {
				Text.Add("A set of thinner vines wrap themselves around [hisher] [cocks], trying to milk the elf from both directions.", parse);
				Text.NL();
			}
			Text.Add("Another tentacle forces itself down [possessive] throat, sealing [hisher] last remaining free orifice.", parse);
			Text.NL();
			
			Sex.Blowjob(kiakai, orchid);
			kiakai.FuckOral(kiakai.Mouth(), orchid.FirstCock(), 3);
			orchid.Fuck(orchid.FirstCock(), 3);
			
			count++;
			if(count < total) {
				Text.Add("<i>“I’m going to enjoy breaking you down,”</i> Orchid shudders ecstatically before turning to the next member of your party.", parse);
				Text.NL();
			}
		}
		if(party.InParty(terry)) {
			var parse = {
				playername : player.name,
				foxvixen : terry.mfPronoun("fox", "vixen")
			};
			parse = terry.ParserPronouns(parse);
			
			Text.Add("<i>“And what do we have here?”</i> the dryad quips, looking Terry up and down with interest. <i>“What a cute little vixen!”</i>", parse);
			Text.NL();
			if(terry.Relation() < 30) {
				Text.Add("<i>“S-stay back!”</i> Terry groans, by some miracle managing to wriggle free of the tentacles restraining [himher]. <i>“Sorry, [playername], I’m out of here,”</i> the [foxvixen] whimpers, promptly turning tail and running away. The betrayal stings a bit, but in your current situation, you can hardly blame [himher].", parse);
				Text.NL();
				Text.Add("Unfortunately for the [foxvixen], the magic collar has no consideration for [hisher] antics. The spell activates as it senses Terry running away from you, sending the [foxvixen] sprawling to the ground moaning with lust.", parse);
			}
			else {
				Text.Add("<i>“You stay away from [playername], you monster!”</i> Terry cries out, somehow managing to wriggle free of the tentacles restraining [himher]. Shouting a wordless battlecry, the rogue jumps at the dryad, only to be entangled in tentacles again.", parse);
				Text.NL();
				Text.Add("<i>“Mmm, such a feisty one,”</i> the dryad moans appreciatively. <i>“Let’s see how you fight this!”</i> With that, Terry gets a faceful of aphrodisiac administered by tentacle, sending the poor [foxvixen] into a lusty haze.", parse);
			}
			Text.NL();
			Text.Add("<i>“Now… let’s see what you’re packing,”</i> Orchid says, licking her lips. In short order, the [foxvixen] is stripped down to [hisher] fur.", parse);
			Text.NL();
			
			if(terry.FirstCock()) {
				if(terry.HorseCock()) {
					Text.Add("<i>“Woah! Where were you hiding this thing, pet?”</i> the dryad exclaims, marveling at Terry’s impressive horsecock. The knotted monster is at full mast, throbbing with need. <i>“Why would such a pretty little thing have a vulgar cock like this?”</i> she muses, trailing the shaft with one of her tentacles.", parse);
					Text.NL();
					Text.Add("Terry gasps as [hisher] sensitive dick all but explodes at the dryad’s light touch, spraying its seed all over the ground. <i>“What a slut!”</i> Orchid gloats, laughing at the rogue’s hair trigger sensitivity. <i>“Don’t worry, I’m barely getting started with you!”</i>", parse);
				}
				else {
					Text.Add("<i>“What is this now? I thought you were a girl!”</i> the dryad exclaims at the sight of Terry’s rock hard member, amused by her discovery.", parse);
					if(terry.FirstVag())
						Text.Add(" <i>“Well, I guess you have those parts too,”</i> she adds, splaying Terry’s legs wide in order to expose [hisher] pussy.", parse);
					Text.Add(" <i>“I won’t go easy on you, rebellious little fox,”</i> Orchid purrs, her tentacles swaying into position.", parse);
				}
			}
			else {
				Text.Add("<i>“Such a soft and petite body you have, little pet!”</i> the dryad purrs as she feels up Terry’s body with her tentacles. <i>“Mmm… makes me want to ruin it...”</i>", parse);
			}
			Text.NL();
			parse["vag"] = terry.FirstVag() ? " pussy and" : "";
			Text.Add("True to her word, Orchid presses her tentacles against Terry’s[vag] butt, roughly impaling the lithe [foxvixen]. ", parse);
			if(terry.HorseCock())
				Text.Add("Within seconds after the dryad starts railing [hisher] prostate, the rogue’s fat horsedong is erect again, still drooling with cum. ", parse);
			parse["again"] = terry.HorseCock() ? " again" : "";
			parse["c"] = terry.FirstCock() ? Text.Parse(", blowing [hisher] load[again]", parse) : "";
			Text.Add("Seconds later, Terry orgasms[c]. Orchid shows little concern for the [foxvixen], increasing her pace and the number of tentacles she’s shoving into [himher]. The rogue begins to spout a final defiant protest, but [hisher] mouth is quickly plugged with additional tentacles.", parse);
			Text.NL();
			
			if(terry.FirstVag()) {
				Sex.Vaginal(orchid, terry);
				terry.FuckVag(terry.FirstVag(), orchid.FirstCock(), 3);
				orchid.Fuck(orchid.FirstCock(), 3);
			}
			
			Sex.Anal(orchid, terry);
			terry.FuckAnal(terry.Butt(), orchid.FirstCock(), 3);
			orchid.Fuck(orchid.FirstCock(), 3);
			
			Sex.Blowjob(terry, orchid);
			terry.FuckOral(terry.Mouth(), orchid.FirstCock(), 3);
			orchid.Fuck(orchid.FirstCock(), 3);
			
			Text.Add("Despite [hisher] lust addled state, you can tell that Terry is doing everything [heshe] can to resist the dryad, but eventually the rogue’s struggles cease as [heshe]’s overwhelmed by the corrupted creature’s rough penetration.", parse);
			Text.NL();
			count++;
			if(count < total) {
				Text.Add("<i>“I’ll definitely have to play with this one later,”</i> Orchid chuckles, turning to your next companion.", parse);
				Text.NL();
			}
		}
		if(party.InParty(roa)) {
			Text.Add("<i>“This one looks like he’s all stretched out already!”</i> the dryad exclaims, splaying out the struggling Roa and spreading his pliant cheeks. <i>“I could fit dozens of juicy tentacle cocks into this slut!”</i> As if to prove her point, Orchid pushes one veiny tentacle cock after another into the rabbit’s accommodating behind, stretching him more and more.", parse);
			Text.NL();
			
			Sex.Anal(orchid, roa);
			roa.FuckAnal(roa.Butt(), orchid.FirstCock(), 3);
			orchid.Fuck(orchid.FirstCock(), 3);
			
			Text.Add("Thanks to his extensive experience and submissive nature, the trappy lagomorph hardly even protests, moaning whorishly as his belly fills with squirming tentacles. Roa’s cock twitches pitifully, responding eagerly to the viny violation.", parse);
			Text.NL();
			Text.Add("<i>“M-more!”</i> the slutty bunny moans, completely controlled by his lust. <i>“F-fuck me deeper!”</i>", parse);
			Text.NL();
			Text.Add("<i>“I think he likes this!”</i> the dryad squeals joyfully, thoroughly enjoying her new plaything. It doesn’t look like you can expect any help from him anytime soon. Just to shut him up, the dryad stuffs the moaning lagomorph’s mouth too.", parse);
			Text.NL();
			
			Sex.Blowjob(roa, orchid);
			roa.FuckOral(roa.Mouth(), orchid.FirstCock(), 3);
			orchid.Fuck(orchid.FirstCock(), 3);
			
			count++;
			if(count < total) {
				Text.Add("<i>“This one is a keeper,”</i> Orchid purrs as she turns to the next one of your companions.", parse);
				Text.NL();
			}
		}
		if(party.InParty(momo)) {
			Text.Add("Momo’s eyes widen in horror as the vines close in. <i>“N-no! Stay away!”</i> she pleads, breathing out a puff of flames in a desperate effort to ward off the writhing tentacles advancing on her.", parse);
			Text.NL();
			Text.Add("But there are far too many; even as some of them recoil instinctively, others are creeping around on her from behind, launching at her whilst she’s distracted. The dragonette’s legs and tail are wrapped in perverse vines, their phallic tips vanishing into her clothing and roughly thrusting into her unexpecting holes.", parse);
			Text.NL();
			
			Sex.Vaginal(orchid, momo);
			momo.FuckVag(momo.FirstVag(), orchid.FirstCock(), 3);
			orchid.Fuck(orchid.FirstCock(), 3);
			
			Sex.Anal(orchid, momo);
			momo.FuckAnal(momo.Butt(), orchid.FirstCock(), 3);
			orchid.Fuck(orchid.FirstCock(), 3);
			
			Text.Add("A squeal escapes the dragon-girl’s lips, her flame snuffed like a candle in her shock, and that’s what Orchid is waiting for; in the blink of an eye, more vines pounce upon Momo, ensnaring her arms and stuffing themselves down her throat, cutting off her flame with an abundance of writhing plant-cocks.", parse);
			Text.NL();
			
			Sex.Blowjob(momo, orchid);
			momo.FuckOral(momo.Mouth(), orchid.FirstCock(), 3);
			orchid.Fuck(orchid.FirstCock(), 3);
			
			Text.Add("<i>“Such a naughty girl,”</i> Orchid croons, almost leisurely adding more and more tentacles to the assault, stuffing the writhing dragon-girl until her holes are so crammed with cocks that her belly bulges from the wriggling lengths. <i>“Well, don’t worry, we’ll fix that nasty attitude of yours,”</i> the corrupt dryad promises, giggling with glee. Muffled moaning echoes from Momo’s throat in response, the helpless girl unable to do anything but put up a token struggle.", parse);
			Text.NL();
			count++;
			if(count < total) {
				Text.Add("<i>“I’m going to enjoy quenching that fire of yours; hope you like the taste of cum!”</i> Orchid gloats as she turns to your next party member.", parse);
				Text.NL();
			}
		}
		//TODO possible others
		
		// Fallback
		if(count < total) {
			var plural = total - count > 1;
			var rest   = plural && count > 1;
			var p1     = party.Get(count);
			var parse = {
				bodyBodies : plural ? "bodies" : "body",
				hisher     : plural ? "their" : p1.hisher()
			};
			
			if(rest)
				parse["comp"] = "your other companions";
			else if(plural)
				parse["comp"] = "your companions";
			else
				parse["comp"] = party.Get(1).name;
			
			Text.Add("In record time, Orchid has strung up [comp], penetrating [hisher] helpless [bodyBodies] with her squirming mass of tentacles. With a sinking feeling, you realize that none of you are going to make it out of this; you can not resist the creature any longer.", parse);
			Text.NL();
		}
		
		if(party.Num() == 2)
			parse["comp"] = party.Get(1).name;
		else
			parse["comp"] = "your companions";
				
		Text.Add("You yell for the corrupted dryad to stop, which just gains you a slap on the face with one of her cock-tentacles.", parse);
		Text.NL();
		Text.Add("<i>“Now, no need to get greedy!”</i> she tuts. <i>“I know! I’ll let Mommy handle you!”</i> Saying so, her tentacles whip you around face to face with Mother Tree, repressing any further concerns about [comp] for the time being.", parse);
	}
	else {
		Text.Add("<i>“All alone… but you can be with Mommy!”</i> Orchid quips happily, manhandling you in front of Mother Tree.", parse);
	}
	
	Text.Add(" The voluptuous dryad has been reduced to a shadow of her former self, broken in body, mind and spirit by the countless tentacles continuously ravaging her. Given time, this is what you too will turn into, you realize with a sinking heart.", parse);
	Text.NL();
	
	parse = {
		playername : player.name
	};
	parse = player.ParserTags(parse);
	
	if(player.FirstCock()) {
		parse["thatThose"] = player.NumCocks() > 1 ? "those" : "that";
		parse["s"]         = player.NumCocks() > 1 ? "s" : "";
		Text.Add("<i>“Why not put [thatThose] to use?”</i> Orchid moans sultrily in your [ear], stroking your [cocks] from behind. <i>“Can’t you see Mother needs you to fuck her?”</i> The corrupted dryad lines you up against her mother’s gaping cunt, lubing up your tip[s] in her sticky seed.", parse);
		Text.NL();
		Text.Add("<i>“I… I… fuck… breed,”</i> Mother Tree moans as her daughter pushes your shaft[s] in to the hilt, filling up her recently vacated vagina. You are quickly losing the battle of willpower as your [hips] begin to buck on their own, thrusting into the chocolate milf with abandon. Whatever your original intent was, your rapidly fading memories of an important quest, right now you exist only to pollinate this beautiful flower.", parse);
		Text.NL();
	}
	else if(player.FirstVag()) {
		Text.Add("<i>“Now, don’t get greedy, Mother, you are not the only one who needs to be fucked!”</i> Orchid admonishes the older dryad, teasing your pussy lips apart and digging into your cunt. <i>“If you still want to help, why don’t we try something a bit different?”</i>", parse);
		Text.NL();
		Text.Add("Half a dozen thin tendrils snake out from around your back, baring tiny stingers dripping with corrupt venom of some kind. Mother Tree moans and thrashes helplessly as each one dashes in, stinging her sensitive clit again and again. The more venom Orchid pours into her, the longer and thicker it grows, until she’s staring down through clouded eyes at her new twenty inch clit-cock. Without any means of stopping her, you can only struggle weakly against your bonds as the dryad lowers you onto the monstrous shaft.", parse);
		Text.NL();
		
		Sex.Vaginal(orchid, player);
		player.FuckVag(player.FirstVag(), orchid.FirstCock(), 3);
		orchid.Fuck(orchid.FirstCock(), 3);
	}
	Text.Add("<i>“I know the two of you will be the best of friends!”</i> Orchid exclaims happily, caressing your shoulders, her lithe hands trailing down your back, feeling up your [hips] and [butt]. You moan softly as you feel a number of thick tentacle cocks invading your [anus], worming their way inside you rapidly.", parse);
	Text.NL();
	
	Sex.Anal(orchid, player);
	player.FuckAnal(player.Butt(), orchid.FirstCock(), 3);
	orchid.Fuck(orchid.FirstCock(), 3);
	
	Text.Add("<i>“Aww yeah!”</i> she moans, railing you like a jackhammer. <i>“You’ll be my favorite fucktoy, right next to Mother!”</i> Saying so, she thrusts your head in-between Mother Tree’s heavy breasts, rubbing your face in her seed. <i>“Lick!”</i> Orchid commands, grinding into you.", parse);
	Text.NL();
	Text.Add("At this point, you’ve all but given in. You dutifully lap up the corrupted semen, feeling it burning as it goes down your throat. You find one of the older dryad’s nipples and suckle on it, hungrily drinking up her sweet sap. The three of you continue rocking against each other in intense coitus, though there is no question about who is in charge of the situation.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum();
	parse["cum"] = cum > 6 ? "exploding" :
	               cum > 3 ? "pouring" :
	               "shooting";
	Text.Add("Your stomach bulges as the corrupted dryad unloads inside you, pushing you to your own climax. ", parse);
	if(player.FirstCock())
		Text.Add("Mother Tree cries out as you fill her up, your seed [cum] into her pussy even as you yourself are filled. ", parse);
	else if(player.FirstVag())
		Text.Add("You cry out as you orgasm from the dryad double penetration. No, you can’t call it double, you aren’t even sure you could count how many tentacles are stuck up your ass at this point, each one going off like a volcano. ", parse);
	Text.Add("Shuddering, you collapse between the mother-daughter pair, your senses fading out.", parse);
	if(party.Num() > 1) {
		if(party.Num() == 2)
			parse["comp"] = party.Get(1).name;
		else
			parse["comp"] = "your companions";
		Text.NL();
		Text.Add("Dimly, you hear the cries of [comp], but you can no longer tell if they are cries of pain or pleasure.", parse);
	}
	Text.Flush();
	
	Gui.NextPrompt(function() {
		TimeStep({ season : 2 });
		
		if(party.Num() <= 1)
			parse["comp"] = "";
		else if(party.Num() == 2)
			parse["comp"] = " and " + party.Get(1).name;
		else
			parse["comp"] = " and your companions";
		
		Text.Clear();
		Text.Add("You lose all sense of time as the tireless tentacle monster continues raping you[comp], her own mother and just about anything else that comes inside her reach. By now, you hardly even care; you couldn’t see yourself wanting to do anything other than this, being Orchid’s willing sex slave.", parse);
		Text.NL();
		Text.Add("You are dimly aware that the glade is changing around you, the pure spring growing murky as it is slowly defiled with corrupted cum. Where previously there was a field of beautiful, fragrant flowers, strange thorny plants are spreading, colored black, red and a sickly yellow. The inhabitants of the glade are changing, too, as Orchid’s lust addled insanity creeps into them.", parse);
		Text.NL();
		Text.Add("The mind broken nymphs seduce travelers and other forest creatures, ever increasing the number of slaves partaking in the massive orgy now a constant part of your life. Those closest to Orchid; you, Mother Tree[comp] and the centauress are changed creatures, thoroughly corrupted and broken. You no longer even remember why you came here in the first place, and even if you could walk away at any time, the thought to do so never occurs to you.", parse);
		Text.NL();
		Text.Add("Somewhere on the bottom of the corrupted spring, the last fickle light in your discarded gemstone goes out, signaling the end of Eden’s hope. When Uru finally arrives, she will be welcomed to an already fallen world.", parse);
		Text.Flush();
		
		SetGameOverButton();
	});
}

DryadGladeScenes.FirstWin = function(enc) {
	SetGameState(GameState.Event, Gui);
	
	var enc = this;
	
	var parse = {
		playername : player.name,
		name       : kiakai.name
	};
	parse = kiakai.ParserPronouns(parse);
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("Orchid finally falls back, eyeing you hatefully. She lets go of Mother Tree, letting the exhausted dryad slump back against the trunk of her tree, dripping with corrupted cum. The defeated dryad looks like she still has some fight in her, but she can no longer muster the energy to move her tentacles and grab you.", parse);
		Text.NL();
		Text.Add("<i>“P-please, have mercy on her,”</i> Mother Tree pleads weakly, coughing up seed. <i>“Orchid is not herself; I do not know what has happened to her.”</i> Even if she says that, you’re not sure how long the corrupted dryad will stay down, nor if you could stop her if she regains her strength.", parse);
		Text.NL();
		Text.Add("<i>“Come on, do your worst!”</i> Orchid pants, her eyes still defiant. <i>“Fuck me while you can. As soon as I can use my tentacles again, I’m going to spit roast you and fuck your brains out!”</i> The offer is tempting, as despite her obvious corruption, the dryad is a very pretty girl.", parse);
		Text.NL();
		Text.Add("Before you have time to contemplate your options further, you notice the little girl from before peeking out from behind the trunk of the huge tree. Her skin is a light green, covered by a modest dress of twined grass and leaves. Her deep brown eyes are big as saucers as she silently observes the scene in front of her.", parse);
		Text.NL();
		Text.Add("<i>“Spirit! You are safe!”</i> Mother Tree cries out, relieved. <i>“Don’t worry, the danger has passed.”</i> The little dryad girl hops forward, her steps light as the wind. Her long, dark green hair flutters as she settles down next to Orchid. For a moment, the corrupted dryad’s eyes change, as she looks confused.", parse);
		Text.NL();
		Text.Add("<i>“...little sister?”</i> she falters, grasping at her head as if she’s in pain. Without saying a word, the little girl hunches down beside Orchid, placing a hand on her brow. The effect is gradual, but you can slowly see the purple veins straining beneath the dryad’s skin recede as the corruption drains from her. When Orchid looks up again, the hateful frenzy in her eyes has been replaced by despairing sadness as she realizes what she has done.", parse);
		Text.NL();
		Text.Add("<i>“S-sister! Oh, Mother, I’m so sorry, I’m so sorry!”</i> the dryad wails, hugging the little girl tightly. <i>“What have I-”</i> The corruption that clouded her mind seems to have left her, though the dryad’s tentacles still remain.", parse);
		Text.NL();
		Text.Add("The creatures of the forest that fled have returned, cautiously peering out between the trees and approaching you. Orchid turns to you, tears in her eyes. <i>“H-how can I ever repay you? If you hadn’t stopped me...”</i>", parse);
		Text.NL();
		Text.Add("<i>“You were not yourself, Daughter,”</i> Mother Tree consoles her. <i>“Tell me, what happened?”</i> The exhausted dryad wearily starts to clean herself up. <i>“Do not worry about me, I am made of sturdy wood,”</i> she declares stoically.", parse);
		Text.NL();
		Text.Add("It takes a while longer before everything is returned to normality and you can begin to piece together Orchid’s story. The creatures of the forest gather around you, still eyeing the betentacled dryad warily.", parse);
		Text.Flush();
		
		TimeStep({ hour : 1 });
		
		Gui.NextPrompt(function() {
			Text.Clear();
			Text.Add("Orchid sniffles, wiping away her tears as she tries to compose herself.", parse);
			Text.NL();
			Text.Add("<i>“It’s all fuzzy, I don’t… I was playing around deeper within the forest, when I saw a strange creature. It looked like a person, but it was huddled in a cape and it looked suspicious… so I followed it.”</i> She sniffles again, shuddering.", parse);
			Text.NL();
			Text.Add("<i>“It was heading for one of the clear springs, and the way it was moving, I thought it was hurt. When it got there though, it didn’t drink, it… it took a big stone… a gem of some kind I think, and put it into the water, which turned all murky and icky.”</i> The child called Spirit pats her sister on the head consolingly, urging her to go on.", parse);
			Text.NL();
			Text.Add("<i>“That’s when they ambushed me, half a dozen… creatures. Pointy ears.”</i> The dryad whimpers, wiping her tears with a sodden tentacle. <i>“They were elves, but really really nasty ones! Their skins were all purple and veiny, and they had sharp, pointy teeth!”</i>", parse);
			Text.NL();
			if(party.InParty(kiakai)) {
				Text.Add("[name] looks very troubled by all this, stepping up beside you.", parse);
				Text.NL();
				Text.Add("<i>“This… sounds familiar, [playername],”</i> [heshe] says, brow furrowed. <i>“In my youth, I met such creatures; elves corrupted by dark forces from beyond the portals. I almost became one of them, if not for Yrissa and the priests of Lady Aria...”</i> The elf shakes [himher]self. <i>“But what this girl is saying is impossible! No trace of the taint was left after the Lady purified the village, and the portals have been closed for decades!”</i>", parse);
				Text.NL();
				Text.Add("The dryad shrinks back, suddenly fearful of possibly the least intimidating person you’ve ever met. Whatever those elves were, they clearly left an impression on her. You admonish [name] with a stern glance. You can discuss this later, for now you should both listen to the rest of her tale.", parse);
				Text.NL();
			}
			Text.Add("<i>“T-they dragged me to the spring, and threw me in front of the robed creep. He… I didn’t see, but I think it was some sort of lizard, with scales and a thin tail. He had a staff… like a snake, with burning eyes. He made my skin crawl,”</i> she whimpers, shuddering as she hugs herself.", parse);
			Text.NL();
			Text.Add("<i>“Then, they made me… they made me drink the water. After that, it’s all fuzzy. I grew these… <b>things</b> too,”</i> she adds, waving at her tentacles. The dryad slumps down, tired. <i>“I… I don’t even want to consider what I did after that, but I somehow came back here. I came back to… to...”</i> she breaks down wailing again, and you let the little girl comfort her.", parse);
			Text.NL();
			Text.Add("<i>“I am truly grateful for your help, [playername],”</i> Mother Tree bows her head wearily. <i>“Please forgive my errant daughter.”</i> There is nothing to forgive, you insist, she was clearly not in control of her own mind. The dryad gives you a weak but warm smile, bowing her head again.", parse);
			Text.NL();
			Text.Add("<i>“I am worried about this spring that Orchid spoke of. It must be further investigated,”</i> she continues, absently wiping some corrupted cum off her breasts, leaving a glistening shine. You somehow manage to drag your eyes back to her face, focusing on what she’s saying.", parse);
			Text.NL();
			Text.Add("<i>“It pains me that our hero must leave empty handed, but neither I nor Orchid can give you what you seek,”</i> she admits sadly. <i>“I cannot ask this of any of my other daughters either-”</i> she pauses as the little girl returns, tugging on a twig hanging from Mother Tree’s hair. <i>“Yes, child? How is Orch-”</i> she falls silent as her daughter gives her another insistent tug, glancing at you. The old dryad’s eyes slowly widen as she realizes what Spirit wants.", parse);
			Text.NL();
			Text.Add("<i>“My daughter, do you know what this will mean?”</i> Mother Tree asks. The little girl nods, a determined look on her face. The dryad slowly turns back to you, sighing. <i>“Spirit has decided to aid you,”</i> she explains. <i>“To you she may look only a child, but she is powerful. Time will only make her more so. She says to tell you that it is her way of thanking you for saving her sister and the entire glade.”</i>", parse);
			Text.NL();
			Text.Add("You take a closer look at the little girl. She shares some of her looks with her older sister, though you’d say she looks to be about ten years old. She distinctly lacks tentacles. <i>“Hold out the gem, Lifegiver,”</i> Mother Dryad intones, oddly formal. You obey her, unsure what's about to happen. Spirit gives you a happy little smile as she reaches out to touch it…", parse);
			Text.NL();
			Text.Add("There is a sudden flash of light, and then the little girl is gone. The stone in your hand is warm, pulsing with newfound power. <i>“Do not fear for her, she is alive and well, just in a different form,”</i> Mother Tree assures you. <i>“Still, I cannot help but feel saddened that she must leave me so soon… but a mother cannot hold on to her children forever.”</i>", parse);
			Text.NL();
			Text.Add("<i>“There is yet much to speak about, but I understand it if you are in a hurry. Return later, for I very much would like to speak with my savior more. I am sure Orchid feels the same way,”</i> she adds, looking over to the betentacled dryad. She notices you watching and blushes prettily.", parse);
			Text.NL();
			Text.Add("You thank Mother Tree for her help, the warm stone grasped tightly in your hand. You hope the little girl is all right, as you’re still not sure of the properties of the gem. The best person to ask would be Jeanne, and she awaits you near the crossroads.", parse);
			Text.Flush();
			
			glade.flags["Visit"] = DryadGlade.Visit.DefeatedOrchid;
			
			Gui.NextPrompt();
		});
	});
	
	Encounter.prototype.onVictory.call(enc);
}

DryadGladeScenes.MotherTree = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("At the base of the thick tree trunk at the center of the glade, the Mother Tree awaits. Though the dryad is old, she is fair to look upon; her voluptuous body, chocolate skin and deep green hair giving her a very exotic appearance. Her massive breasts and fertile pussy are barely covered by leaves and branches twining together, leaving very little to your imagination.", parse);
	Text.NL();
	Text.Add("The dryad smiles at you, her almond eyes joyous at seeing her savior once more.", parse);
	Text.NL();
	Text.Add("<i>“Welcome, Lifegiver!”</i> she greets you. <i>“How may I aid you?”</i>", parse);
	Text.Flush();
	
	DryadGladeScenes.MotherTreePrompt();
}

DryadGladeScenes.MotherTreePrompt = function() {
	var parse = {
		playername : player.name
	};
	if(party.Num() == 2)
		parse["comp"] = " and " + party.Get(1).name;
	else if(party.Num() > 2)
		parse["comp"] = " and your companions";
	else
		parse["comp"] = "";
	
	//[Talk][Sex][Healing]
	var options = new Array();
	options.push({ nameStr : "Talk",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Ask, and I shall answer as well as I can.”</i>", parse);
			Text.Flush();
			
			DryadGladeScenes.MotherTreeTalk();
		}, enabled : true,
		tooltip : "You wish to ask the dryad some questions."
	});
	/* TODO: Sex
	options.push({ nameStr : "name",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
		}, enabled : true,
		tooltip : ""
	});
	*/
	options.push({ nameStr : "Healing",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Gladly, [playername],”</i> the dryad nods, instructing you to take a seat on her lower roots. Warmth suffuses you as you feel all your worries and fatigue wash away, and when you step away, you feel purified.", parse);
			Text.NL();
			Text.Add("You thank the dryad, feeling fully capable of continuing your journey again.", parse);
			Text.Flush();
			
			TimeStep({minute: 15});
			party.RestFull();
		}, enabled : true,
		tooltip : Text.Parse("Ask her to use her powers to heal you[comp].", parse)
	});
	Gui.SetButtonsFromList(options, true, PrintDefaultOptions);
}

DryadGladeScenes.MotherTreeTalk = function() {
	var parse = {
		playername : player.name
	};
	
	//[Herself][Orchid][Spirit][Lifegiver]
	var options = new Array();
	options.push({ nameStr : "Herself",
		func : function() {
			Text.Clear();
			Text.Add("<i>“When you get to be as old as I am, you perceive time in a different manner,”</i> Mother Tree responds. <i>“There is much to tell, but I fear that much of it would bore you. Most of my life has been rather uneventful from your perspective; I give birth to daughters and sons, I nourish the glade, and I watch the lives of mortals pass by my eyes like candles flickering in and out.”</i> She looks at you sadly. <i>“A long life is sometimes more a burden than a boon.”</i>", parse);
			Text.NL();
			Text.Add("<i>“Once in a while, I would meet someone like Alliser or Jeanne, people whose flames - though their lives are much shorter than mine - shine brighter than any star.”</i> She sighs. <i>“Things would be so much simpler if it was only this,”</i> she concludes, caressing her tree fondly.", parse);
			Text.Flush();
			DryadGladeScenes.MotherTreeTalk();
		}, enabled : true,
		tooltip : "Ask her for her story."
	});
	options.push({ nameStr : "Orchid",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Orchid was always so carefree and happy, but she has changed after you saved her from the corruption. She is very self concious, and I fear she blames herself for what happened, even though she is innocent.”</i> Mother Tree looks out into the peaceful glade, watching over her daughter. <i>“The others try to be kind to her, but many cannot get over her new appearance.”</i>", parse);
			Text.NL();
			Text.Add("<i>“I think that you visiting her helps a lot. She looks up to you; nay, I dare say she’s infatuated with you. You might be the only one that can help her through this.”</i> You nod thoughtfully.", parse);
			Text.Flush();
			DryadGladeScenes.MotherTreeTalk();
		}, enabled : true,
		tooltip : "Ask her about her betentacled daughter."
	});
	options.push({ nameStr : "Spirit",
		func : function() {
			Text.Clear();
			if(Scenes.Global.PortalsOpen()) {
				Text.Add("<i>“It really surprised me when Spirit said she was going with you. Then again, she’s always been a headstrong child. Though she looks young, she does so because she wishes to; it’s well over two decades since her birth.”</i>", parse);
				Text.NL();
				Text.Add("<i>“I truly believe she can aid you, though. She is at least as strong as I was before I took root.”</i>", parse);
			}
			else {
				Text.Add("<i>“I’m glad that you and Spirit have grown close. Just be sure to treat my daughter well, [playername]. As I told you, she is strong.”</i> The last is said with a mother’s pride.", parse);
			}
			Text.NL();
			Text.Add("<i>“Either way, I miss her dearly, but a mother cannot always cling tightly to her little ones,”</i> the dryad concludes sorrowfully.", parse);
			Text.Flush();
			DryadGladeScenes.MotherTreeTalk();
		}, enabled : true,
		tooltip : "Ask her about her younger daughter Spirit, who resides in your Gem."
	});
	if(false) { //TODO Unlocks after being to the Spring for the first time.
		options.push({ nameStr : "Spring",
			tooltip : "Ask Mother Tree if she knows a way you could get past the thorns and get to the spring.",
			func : function() {
				Text.Clear();
				Text.Add("You tell Mother Tree about your expedition to the Spring using the directions Orchid gave you, and ask about the seemingly invincible canopy of thorns that block your path. Is there any way you could get past those thorny trees?", parse);
				Text.NL();
				Text.Add("Mother Tree looks in deep-thought for a moment, then replies, <i>“A powerful dryad might be able to force the thorns apart and let you slip through, but taking one there would be a problem...”</i>", parse);
				Text.NL();
				Text.Add("Problem? What kind of problem?", parse);
				Text.NL();
				Text.Add("<i>“I can feel the corruption spreading from that side of the forest, and I fear that if we send any my daughters, they might be corrupted like Orchid was.”</i>", parse);
				Text.NL();
				Text.Add("That is a problem… Perhaps sometime you’ll find a way of taking a dryad over there, but for now there doesn’t seem to be anything either of you could do. You thank Mother Tree all the same.", parse);
				Text.NL();
				Text.Add("<i>“I’m sorry, [playername]. Is there anything else you’d like to talk about?”</i>", parse);
				Text.Flush();
				DryadGladeScenes.MotherTreeTalk();
			}, enabled : true
		});
	}
	options.push({ nameStr : "Lifegiver",
		func : function() {
			Text.Clear();
			Text.Add("<i>“It is who you are and who you will be,”</i> she replies. <i>“All will be revealed in time, if you persevere. Much rests on you, according to the sage.”</i>", parse);
			Text.Flush();
			DryadGladeScenes.MotherTreeTalk();
		}, enabled : true,
		tooltip : "Why does she insist on calling you by that name?"
	});
	Gui.SetButtonsFromList(options, true, DryadGladeScenes.MotherTreePrompt);
}

export { DryadGlade, GladeLoc, DryadGladeScenes };
