/*
 * 
 * Define Layla
 * 
 */

import { Scenes } from '../../event';
import { Entity } from '../../entity';

Scenes.Layla = {};

function Layla(storage) {
	Entity.call(this);
	this.ID = "layla";

	// Character stats
	this.name = "Layla";
	
	this.avatar.combat = Images.layla;
	
	this.currentJob = Jobs.Fighter;
	this.jobs["Fighter"]   = new JobDesc(Jobs.Fighter);   this.jobs["Fighter"].mult   = 1.2;
	this.jobs["Scholar"]   = new JobDesc(Jobs.Scholar);   this.jobs["Scholar"].mult   = 1.2;
	this.jobs["Courtesan"] = new JobDesc(Jobs.Courtesan); this.jobs["Courtesan"].mult = 1.2;

	this.jobs["Bruiser"]   = new JobDesc(Jobs.Bruiser); this.jobs["Bruiser"].mult = 1.2;
	this.jobs["Rogue"]     = new JobDesc(Jobs.Rogue);   this.jobs["Rogue"].mult   = 1.2;
	this.jobs["Ranger"]    = new JobDesc(Jobs.Ranger);  this.jobs["Ranger"].mult  = 1.2;
	
	this.jobs["Mage"]      = new JobDesc(Jobs.Mage);   this.jobs["Mage"].mult   = 1.2;
	this.jobs["Mystic"]    = new JobDesc(Jobs.Mystic); this.jobs["Mystic"].mult = 1.2;
	this.jobs["Healer"]    = new JobDesc(Jobs.Healer); this.jobs["Healer"].mult = 1.2;
	
	this.jobs["Elementalist"] = new JobDesc(Jobs.Elementalist); this.jobs["Elementalist"].mult = 1.2;
	this.jobs["Warlock"]      = new JobDesc(Jobs.Warlock);      this.jobs["Warlock"].mult = 1.2;
	this.jobs["Hypnotist"]    = new JobDesc(Jobs.Hypnotist);    this.jobs["Hypnotist"].mult = 1.2;
	
	this.maxHp.base        = 100;
	this.maxSp.base        = 60;
	this.maxLust.base      = 80;
	// Main stats
	this.strength.base     = 20; this.strength.growth     = 1.3;
	this.stamina.base      = 22; this.stamina.growth      = 1.4;
	this.dexterity.base    = 30; this.dexterity.growth    = 1.5;
	this.intelligence.base = 30; this.intelligence.growth = 1.5;
	this.spirit.base       = 35; this.spirit.growth       = 1.8;
	this.libido.base       = 30; this.libido.growth       = 1.6;
	this.charisma.base     = 25; this.charisma.growth     = 1.5;
	
	this.level = 12;
	this.sexlevel = 1;
	this.SetExpToLevel();
	
	this.body.DefHerm();
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 5;
	this.SetSkinColor(Color.blue);
	this.SetHairColor(Color.black);
	this.SetEyeColor(Color.red);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = Layla.Met.NotMet;
	this.flags["Take"] = 0;
	this.flags["Skin"] = 0;
	this.flags["Talk"] = 0; //Bitmask

	this.farmTimer = new Time();

	if(storage) this.FromStorage(storage);
}
Layla.prototype = new Entity();
Layla.prototype.constructor = Layla;


Layla.Met = {
	NotMet : 0,//Never seen
	First  : 1,//Met at least once, not defeated
	Won    : 2,//Defeated
	Farm   : 3,//Talked to at farm, not in party
	Party  : 4,//Recruited to party
	Talked : 5 //Talked to her in party
};

Layla.Talk = {
	Sex    : 1, //Talked about sex
	Origin : 2
};


Layla.prototype.FromStorage = function(storage) {
	storage = storage || {};
	
	this.body.FromStorage(storage.body);
	this.LoadPersonalityStats(storage);
	this.LoadFlags(storage);
	
	this.LoadPregnancy(storage);
	this.LoadSexFlags(storage);
	this.LoadCombatStats(storage);
	this.LoadPersonalityStats(storage);
	
	this.LoadJobs(storage);
	
	this.RecallAbilities();
	this.SetLevelBonus();
	
	this.farmTimer.FromStorage(storage.ft);
}

Layla.prototype.ToStorage = function() {
	var storage = {};
	
	this.SaveBodyPartial(storage, {ass: true, vag: true, balls: true});
	this.SavePersonalityStats(storage);
	this.SaveFlags(storage);

	this.SavePregnancy(storage);
	this.SaveSexFlags(storage);
	this.SaveCombatStats(storage);
	this.SavePersonalityStats(storage);
	
	this.SaveJobs(storage);
	
	storage.ft = this.farmTimer.ToStorage();
	
	return storage;
}

Layla.prototype.Update = function(step) {
	Entity.prototype.Update.call(this, step);
	this.farmTimer.Dec(step);
}

// Schedule
Layla.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Farm.Fields)
		return (world.time.hour >= 7 && world.time.hour < 22);
	return false;
}

Layla.prototype.Virgin = function() {
	return this.FirstVag().virgin;
}


/* TODO
 * Act AI
 */

function LaylaMob() {
	Entity.call(this);

	// Character stats
	this.name = "Creature";
	this.monsterName       = "the creature";
	this.MonsterName       = "The creature";
	
	this.avatar.combat = Images.layla_f;
	
	// TODO
	this.maxHp.base        = 1000;
	this.maxSp.base        = 200;
	this.maxLust.base      = 350;
	// Main stats
	this.strength.base     = 20;
	this.stamina.base      = 22;
	this.dexterity.base    = 30;
	this.intelligence.base = 32;
	this.spirit.base       = 40;
	this.libido.base       = 34;
	this.charisma.base     = 25;
	
	this.level = 12;
	this.sexlevel = 1;
	
	this.body.DefHerm();
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 5;
	this.SetSkinColor(Color.blue);
	this.SetHairColor(Color.black);
	this.SetEyeColor(Color.red);
	
	this.SetLevelBonus();
	this.RestFull();
}
LaylaMob.prototype = new Entity();
LaylaMob.prototype.constructor = LaylaMob;

LaylaMob.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.Add(this.MonsterName + " acts! Rawr!");
	Text.NL();
	Text.Flush();
	
	// Pick a random target (go for lowest abs HP)
	var t = this.GetSingleTarget(encounter, activeChar, TargetStrategy.LowAbsHp);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.6)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.Bash.enabledCondition(encounter, this))
		Abilities.Physical.Bash.Use(encounter, this, t);
}


// Party interaction
Layla.prototype.Interact = function(switchSpot) {
	Scenes.Layla.PartyRegular(switchSpot);
}

Scenes.Layla.Prompt = function(switchSpot) {
	var parse = {
		
	};
	
	var that = layla;
	
	var options = new Array();
	
	options.push({ nameStr : "Talk",
		func : function() {
			Text.Clear();
			Text.Add("Layla tilts her head to the side, looking at you inquisitively. Her long tail sways behind her as she waits to hear what you want to talk to her about.", parse);
			Text.Flush();
			Scenes.Layla.TalkPrompt(switchSpot);
		}, enabled : true,
		tooltip : "You’d like to talk about some things with Layla, if she doesn’t mind."
	});
	var tooltip = layla.Virgin() ? "It’s time to make good on your promise and teach her about proper sex." : "You’re feeling a tad horny, and you doubt the pretty chimera would have anything against some intimacy.";
	var enabled = layla.flags["Talk"] & Layla.Talk.Sex;
	if(layla.Virgin()) enabled = enabled && (player.FirstCock() || player.Strapon());
	options.push({ nameStr : "Sex",
		func : function() {
			if(layla.Virgin())
				Scenes.Layla.SexFirstTime();
			else {
				Text.Clear();
				Text.Add("<i>“I’d love to!”</i> She exclaims, happily clinging onto you.", parse);
				Text.NL();
				Text.Add("You stroke her back and chuckle, remarking that you thought she’d be happy. Now, as for what you want to do to her this time...", parse);
				Text.Flush();

				Scenes.Layla.SexPrompt(switchSpot);
			}
		}, enabled : enabled,
		tooltip : tooltip
	});
	options.push({ nameStr : "Appearance",
		func : function() {
			Scenes.Layla.Appearance(switchSpot);
		}, enabled : true,
		tooltip : "You want to take a closer look at Layla’s body."
	});
	/*
	options.push({ nameStr: "Release",
		func : function() {
			Text.Clear();
			Text.Add("[Placeholder] Layla masturbates fiercely, cumming buckets.");
			
			world.TimeStep({minute : 10});
			
			that.AddLustFraction(-1);
			Text.Flush();
			Gui.NextPrompt(function() {
				that.Interact(switchSpot);
			});
		}, enabled : true,
		tooltip : "Pleasure yourself."
	});
	*/
	//Equip, stats, job, switch
	//Layla can't equip things
	that.InteractDefault(options, switchSpot, false, true, true, true);
	
	Gui.SetButtonsFromList(options, true, PartyInteraction);
}


//TODO
Scenes.Layla.TalkPrompt = function(switchSpot) {
	var parse = {
		playername : player.name
	};
	
	var options = new Array();
	
	
	var tooltip = layla.Virgin() ? "Despite her apparent innocence, Layla does have a nice body. So why not proposition the chimeric beauty for a little romp in the hay?" : "Now that Layla knows what it is, what does she think about sex?";
	options.push({ nameStr : "Sex",
		func : function() {
			Text.Clear();
			
			layla.flags["Talk"] |= Layla.Talk.Sex;
			
			if(layla.Virgin()) {
				Text.Add("<i>“What is sex?”</i> she asks in confusion.", parse);
				Text.NL();
				Text.Add("Okay... she’s a bit more innocent than she looks. Now, how to put this in terms she’ll understand?", parse);
				Text.NL();
				Text.Add("After a few moments of thought, you explain to Layla that sex is something that two people do together that brings them both pleasure.", parse);
				Text.NL();
				Text.Add("<i>“Pleasure? Like something I like?”</i>", parse);
				Text.NL();
				Text.Add("Well, yes, more or less.", parse);
				Text.NL();
				Text.Add("<i>“I like being with you!”</i> she states happily.", parse);
				Text.NL();
				Text.Add("Well, that is pleasing to hear. But, just being with someone you like isn’t the same thing as sex. That’s... well, it’s difficult to put into words. But you can show her, if she’s willing?", parse);
				Text.NL();
				Text.Add("<i>“Yes, please!”</i>", parse);
				Text.NL();
				Text.Add("Alright then, you promise to show her, but you’ll do so another time. Can she bear it and wait until you’re ready?", parse);
				Text.NL();
				Text.Add("<i>“Oh, okay.”</i>", parse);
				Text.NL();
				Text.Add("You muse to yourself that perhaps the best way to introduce her to the act would be something more traditional. ", parse);
				if(player.FirstCock() || player.Strapon())
					Text.Add("Luckily you’re already equipped for it, so it’s just a matter of approaching her at the right time.", parse);
				else
					Text.Add("You should probably get a toy or something - maybe a strap-on - to help you with the lesson. You could introduce her to lesbian sex, but you feel it’s best to explain how it’s supposed to go between a man and woman first.", parse);
			}
			else { //not virgin
				Text.Add("<i>“I love it! I hope we can do it again!”</i>", parse);
				Text.NL();
				Text.Add("You chuckle softly at her enthusiasm. Of course you can do it again, but you were hoping for a little more detail on what she thinks of it than that.", parse);
				Text.NL();
				Text.Add("She looks at you curiously, then stops to think about it for a moment. Finally, she shrugs. <i>“I love it. And I’d like to learn more about it, but I’m not sure what else to say...”</i>", parse);
				Text.NL();
				Text.Add("Not much for words, is she? But you smile and thank her, telling her that if that’s all she has to say on the matter, that’s good enough for you. You’re happy she trusts you enough to share her feelings with you.", parse);
				Text.NL();
				Text.Add("<i>“Sure, any time, [playername]. But...”</i>", parse);
				Text.NL();
				Text.Add("Yes?", parse);
				Text.NL();
				Text.Add("<i>“When can we do it again?”</i>", parse);
				Text.NL();
				Text.Add("Chuckling at the expression on her face, you promise her that it’ll be soon.", parse);
			}
			Text.Flush();
			Scenes.Layla.TalkPrompt(switchSpot);
		}, enabled : true,
		tooltip : tooltip
	});
	/* //TODO
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
	
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("On second thought, maybe you two could chat some other time…", parse);
		Text.NL();
		Text.Add("The chimera twists her head in confusion, but she smiles all the same, replying with a timid, <i>“Okay.”</i>", parse);
		Text.Flush();
		
		Scenes.Layla.Prompt(switchSpot);
	});
}

Scenes.Layla.Appearance = function(switchSpot) {
	var parse = {
		name : kiakai.name,
		playername : player.name
	};
	
	Text.Clear();
	if(layla.flags["Skin"] == 0) {
		Text.Add("You watch in amazement as Layla’s clothes seemingly shift off her body, becoming part of her skin and revealing her pert nipples and virgin pussy for you to gaze at.", parse);
		Text.NL();
		Text.Add("<i>“Is this good?”</i>", parse);
		Text.NL();
		
		Scenes.Layla.FirstTimeSkinShift();
	}
	else {
		Text.Add("Layla isn’t wearing any real clothing, and the 'clothing' she appears to wear is nothing but her own skin, shifted to appear as such. She wills it back to her <i>naked</i> appearance, exposing her assets to you without shame or embarrassment.", parse);
		Text.NL();
		Text.Add("<i>“Is this good?”</i>", parse);
		Text.NL();
		Text.Add("That’s perfect, you assure her, adding a nod of approval for emphasis. Layla’s lips curl into a proud smile and she stands just a little bit straighter. This gives you free rein to start looking her over.", parse);
	}
	Text.NL();
	if(layla.Virgin()) {
		Text.Add("You’d be lying if you claimed to know precisely what species she is. But, as far as you can tell, she’s female, complete with a virginal pussy lying between her thighs.", parse);
	}
	else {
		Text.Add("Though you’re still not sure what she is, you know that she’s more than she seems. She’s presenting herself as female now, but you’re intimately aware that she’s more than that. Hidden within a secret groove just above her vagina, concealed by her shifting skin, lies a retractable phallus. When exposed, it looks perfectly human, save perhaps its color, which is an indigo blue shade. She has demonstrated she can make its base swell into an impromptu knot as well. From what you’ve seen, you’d say it’s twelve inches long and two and a half inches thick.", parse);
		Text.NL();
		Text.Add("A second such phallus conceals itself within the tip of her long tail, like a lewd version of a stinger, although much smaller than the first phallus - only six inches long and an inch thick - it is otherwise identical.", parse);
		Text.NL();
		Text.Add("Highlighting her alien nature, you know for a fact that her control over her genitalia is uncanny. She can manipulate her vaginal walls, altering their capacity and texture, as well as moving them when you couple. Likewise, she can make her phalluses erect at will, whether they are exposed or not.", parse);
	}
	Text.NL();
	Text.Add("Having taken in her gender, you focus your attention on her head. In all honesty, looking at Layla’s face alone, you’d think she was an elf. At first glance, she has the same cast to her features as [name] does, especially when it comes to having the same long, slender, pointed ears. But the small horns sweeping back from her forehead quickly dash any notion of her being an elf.", parse);
	Text.NL();
	Text.Add("Layla’s skin is a dark gray. Not charcoal colored, but closer to black than white - something like very dark ashes. Naked as she is, you can easily take in that she has two-toned skin. While most of her skin is darker, starting in a small triangle on her chin and sweeping down her torso, widening to encompass her breasts before narrowing so that it ends on her inner thighs, the skin is a much lighter shade of gray. Almost a drab silver, really.", parse);
	Text.NL();
	Text.Add("Her eyes are human enough - with round pupils and white sclera - so long as you look past the deep crimson of her irises. Raven black hair falls in a shoulder-length mane from her head, trailing over her neck. When she grins, the teeth she reveals are perfectly human-like. Strangely, this seems to make her <b>more</b> unusual rather than less.", parse);
	Text.NL();
	Text.Add("Finished taking in her features, you allow your gaze to sweep down toward her chest.", parse);
	Text.NL();
	if(layla.Virgin()) {
		Text.Add("A perky set of dun-silver C-cups sit upon her chest, each adorned with a large, prominently erect nipple the same dark gray color as the rest of her skin. Other than their coloration and the size - and seemingly permanent erection - her nipples seem quite human.", parse);
		Text.NL();
		Text.Add("Layla watches you gazing at her breasts, but otherwise displays no reaction. You simply shrug and allow your eyes to drift down her body.", parse);
	}
	else {
		Text.Add("Layla’s boobs are a large C-cup, but that’s because she feels that’s the most comfortable, yet noticeable, of sizes. When she feels like it, she can expand them, inflating herself up to a large E-cup. If that isn’t alien enough, the large, permanently erect nipples she has can be teased open, revealing vagina-like orifices filled with slick lubricating juices. Her breast skin is dull silver in color, whilst her nipples are dark gray on the outside and blue like her cocks on the inside.", parse);
		Text.NL();
		Text.Add("She notices where you are gazing and puffs out her chest, moving her arms to push them together enticingly.", parse);
		Text.NL();
		Text.Add("You chuckle softly and shake your head; for now, you just want to look. Layla pouts and you allow your view to drift down her body.", parse);
	}
	Text.NL();
	// Pregnancy
	var womb = layla.PregHandler().Womb();
	var preg = womb && womb.pregnant;
	var stage = preg ? womb.progress : null;
	if(preg && stage > 0.8) {
		Text.Add("Layla’s stomach bulges out to an almost obscene degree, though her elastic skin shows not a single stretch-mark. The child within is nearly full-grown now, soon to make its entry into the world.", parse);
		Text.NL();
		Text.Add("<i>“Anytime now,”</i> she says, lightly rubbing her bulge.", parse);
	}
	else if(preg && stage > 0.6) {
		Text.Add("A great belly swells out from Layla’s midriff, easily comparable to a full-term human pregnancy. But you have a feeling she’s not done growing quite yet...", parse);
		Text.NL();
		Text.Add("<i>“Almost there,”</i> Layla says, gently rubbing her belly.", parse);
	}
	else if(preg && stage > 0.4) {
		Text.Add("Layla’s formerly trim stomach has grown considerably distended. A full orb of flesh hangs below her breasts now, sheltering a growing child within.", parse);
		Text.NL();
		Text.Add("Layla smiles softly but doesn’t say anything.", parse);
	}
	else if(preg && stage > 0.2) {
		Text.Add("Your inhuman lover has grown a very distinct potbelly. It’s not so large yet, but she’s visibly rounded at the waist. You have a strong suspicion that she’s pregnant.", parse);
		Text.NL();
		Text.Add("<i>“We should prepare,”</i> she says, rubbing her belly. Seems like your suspicion has just been confirmed.", parse);
	}
	else {
		Text.Add("Layla’s belly is trim and flat - not muscular, but clearly well-toned and slender. Strangely, she doesn’t have a bellybutton. With nothing in particular to hold your gaze there, you continue looking her over.", parse);
	}
	Text.NL();
	Text.Add("You ask Layla if she would turn around for you; you need a better look at her back.", parse);
	Text.NL();
	Text.Add("Her tail sways to and fro, and she starts turning for you, deliberately slow. There is an undeniable grace to her movements, as she finishes turning. <i>“Better?”</i>", parse);
	Text.NL();
	if(layla.Virgin())
		Text.Add("Much better, you assure her, nodding your thanks for emphasis. Since her tail is still swishing back and forth, it naturally draws your attention first.", parse);
	else
		Text.Add("Layla’s tail brushes its very tip tenderly against your cheek, making your smile fit to match the grin she herself is sporting. It’s certainly a flattering angle for her, you reply, and reach up to stroke the sensitive tip of her tail with your fingers. Needless to say, you resume your inspection with the appendage continuing to caress you.", parse);
	Text.NL();
	Text.Add("All in all, it’s fairly reptilian-looking - discounting that she has smooth skin as opposed to scales, of course. It’s clearly prehensile, starting with a broader base and ending in a narrow tip. You estimate its length to be about four and a half feet long, and it moves with an almost eel-like sinuousness.", parse);
	Text.NL();
	if(!layla.Virgin()) {
		Text.Add("Curious, you close your fingers around her tail tip and bring it in for a closer look. Even though you know she’s hiding a secondary cock inside her tail, there isn’t the slightest clue to its presence.", parse);
		Text.NL();
		Text.Add("Your inquisitive fingers try to disprove what your eyes are telling you, eliciting a moan of appreciation, but they find nothing. No hidden groove, no concealed slit, no muscle-lips, nothing to show where it emerges. You’re not even certain she doesn’t simply transforms her tail-tip when she needs her tail-cock.", parse);
		Text.NL();
		Text.Add("<i>“That feels pretty nice, [playername]. Do you want it?”</i> she asks with a smile.", parse);
		Text.NL();
		Text.Add("Not at the moment, no, you reply. You’re not quite done with what you’re doing yet. Petting her tail one last time, you let it go.", parse);
		Text.NL();
		Text.Add("<i>“Pity,”</i> she says, looking back at you with a smile.", parse);
		Text.NL();
	}
	Text.Add("Having followed her tail all the way to its base, you take this moment to admire Layla’s rear. It’s not huge, but it’s round and perky in its curviness, meshing perfectly with her build. ", parse);
	if(!layla.Virgin())
		Text.Add("You know she can plump it up at will - just like she can with her breasts, but she’s most comfortable with it as it is. ", parse);
	Text.Add("Her hips are similar in stature - wide enough to give her a feminine shapeliness, but not so wide as to look absurd on her slender build.", parse);
	Text.NL();
	if(layla.Virgin()) {
		Text.Add("Touching her is tempting, but you’re not sure how she would react. As you try to move away, her tail loops around a wrist, pulling you forward as she bends slightly forward. <i>“It’s okay,”</i> she says, looking back at you.", parse);
	}
	else {
		Text.Add("Layla’s butt is just begging to be touched. Almost without thinking, you reach out and grope one svelte cheek. As your fingers close around the curvaceous flesh, you can feel the tone of her muscles, firm and strong beneath the shapely exterior.", parse);
		Text.NL();
		Text.Add("You hear a sharp intake of breath from the chimeric girl, and a moment later she bends forward slightly, thrusting her buttcheeks into your palms. She looks back at you with a soft smile and nods.", parse);
	}
	Text.NL();
	Text.Add("Since she has given you such obvious permission, you see no reason to hold back. With both hands now, you start to explore her rear. Running your fingers over her hips, squeezing her butt-flesh between your fingers. Affectionately, you compliment the chimera on her butt; she’s got a very nice specimen indeed back here.", parse);
	Text.NL();
	Text.Add("She giggles softly at your compliment. <i>“Thank you. I like yours too!”</i>", parse);
	Text.NL();
	if(layla.Virgin()) {
		Text.Add("You can’t help a soft chuckle at her words and thank her for the compliment.", parse);
		Text.NL();
		Text.Add("She wags her tail a bit, then lets it rest on your shoulder.", parse);
	}
	else {
		Text.Add("For a moment, you ponder if that was an innocent compliment or if she meant something more by it. Your gaze sweeps over her swishing tail-tip and to the cleft between her legs, where you know her two cocks are hidden. It’s best not to think too hard about it...", parse);
	}
	Text.NL();
	Text.Add("You bend  slightly to get a better view, and your gaze falls upon the womanly flower lying hidden between Layla’s thighs. Even from this angle, you can make it out quite clearly. Visually, it looks perfectly human, so long as you ignore the dark gray of its labia against the dun-silver of her surrounding flesh.", parse);
	Text.NL();
		if(!layla.Virgin()) {
		Text.Add("As you’ve learned, there’s more than meets the eye to her womanhood. In addition to its colors - dark gray lips, indigo blue interior - Layla can also manipulate her walls at will, allowing her to milk, grip and even suckle without moving the rest of her body.", parse);
		Text.NL();
		Text.Add("It’s also impossibly elastic. There doesn’t seem to be any limit to how far she can stretch without feeling pain, handling even the biggest of insertions with pleasure and ease.", parse);
		Text.NL();
	}
	Text.Add("From where you are, it’s natural to move on to her legs. They’re human in shape, slender and shapely like a woman’s should be - and yet, there’s a sense of power to them, of muscle hidden beneath the curves. Without thinking about it, you reach out and place a hand on her calf, feeling the sinews ripple beneath her gray skin.", parse);
	Text.NL();
	Text.Add("Finally, your gaze ends up on Layla’s feet. Like her legs, they’re human at first glance, but the toes are just slightly... off. They’re a joint longer than they should be, and they’re capped in small claws. They’re feet designed for running and climbing.", parse);
	Text.NL();
	Text.Add("Satisfied with your inspection, you stand up straight again and thank Layla for satisfying your curiosity.", parse);
	Text.NL();
	Text.Add("<i>“Any time, [playername],”</i> she says, shifting her skin back into makeshift clothes.", parse);
	Text.Flush();
	
	Scenes.Layla.Prompt(switchSpot);
}

Scenes.Layla.PartyRegular = function(switchSpot) {
	var parse = {
		playername : player.name
	};
	
	var first = layla.flags["Met"] < Layla.Met.Talked;
	Text.Clear();
	if(first) {
		layla.flags["Met"] = Layla.Met.Talked;
		Text.Add("You ask if Layla has a moment, you’d like to talk to her.", parse);
		Text.NL();
		Text.Add("<i>“Sure!”</i> she replies enthusiastically. ", parse);
		Text.NL();
		Text.Add("She glances at you for a moment, then bites her lip. It seems she wants to say something, and you urge her with a gentle smile.", parse);
		Text.NL();
		Text.Add("She offers a timid <i>“Thank you.”</i>", parse);
		Text.NL();
		Text.Add("Curious, you ask her why she’s thanking you.", parse);
		Text.NL();
		Text.Add("<i>“I want to find out more about myself. I don’t know who I am, or where I’m from. And I don’t stand a chance out there on my own… So thanks for taking me with you,”</i> she says with a happy grin.", parse);
		Text.NL();
		Text.Add("You’re not sure if you’ll have any luck figuring out more about her, but she’s welcome to accompany you for as long as she wants. Granted she doesn’t cause trouble along the way, at least.", parse);
		Text.NL();
		Text.Add("<i>“No! Of course not!”</i> she says, waving her hands.", parse);
		Text.NL();
		Text.Add("You tell her to calm down, you’re not threatening her of anything - just teasing her a little bit.", parse);
		Text.NL();
		Text.Add("<i>“Oh… okay.”</i>", parse);
		Text.NL();
		Text.Add("Layla is a very strange creature; as you ponder this, it strikes you that you don’t know exactly <i>what</i> she is. You can’t just keep calling her <i>creature</i> or <i>thing</i>, so you decide to ask her if she knows her species.", parse);
		Text.NL();
		Text.Add("<i>“Umm… I’m Layla!”</i>", parse);
		Text.NL();
		parse["race"] = player.Race().aShort();
		Text.Add("Gently, you correct her that’s her name, not what she is. She’s not <i>a</i> Layla, she’s just Layla. You’re [race], but you are [playername]. Does she understand you?", parse);
		Text.NL();
		Text.Add("<i>“I guess. But I… hmm.”</i> She taps her chin with a claw, thinking. After a few moments, she looks to you and shrugs.", parse);
		Text.NL();
		Text.Add("So she doesn’t know what species she is. Maybe she could come up with a name for her species then? At least until you figure out what she actually is?", parse);
		var pNum = switchSpot ? party.NumTotal() : party.Num();
		if(pNum > 1) {
			parse["comp"] = pNum == 2 ? party.Get(1).name : "your companions";
			Text.Add(" Maybe [comp] can offer some insight.", parse);
			Text.NL();
			if(party.InParty(kiakai, switchSpot)) {
				parse["name"] = kiakai.name;
				parse["heshe"] = kiakai.heshe();
				Text.Add("[name] takes a moment to look over Layla’s features. <i>“She has elven ears, but she is no elf, I can tell you that,”</i> [heshe] offers.", parse);
				Text.NL();
			}
			if(party.InParty(terry, switchSpot)) {
				parse["hisher"] = terry.hisher();
				parse["heshe"] = terry.heshe();
				Text.Add("Terry scratches [hisher] head as [heshe] circles the confused girl. <i>“I’ve seen all kinds of people, but none like her. Her tail looks kinda like a lizan’s though...”</i>", parse);
				Text.NL();
			}
			if(party.InParty(momo, switchSpot)) {
				Text.Add("<i>“Well, I don’t really know a lot of races, but I think she looks like a mixed breed of some kind,”</i> Momo muses, tapping her chin thoughtfully.", parse);
				Text.NL();
			}
			if(party.InParty(miranda, switchSpot)) {
				Text.Add("<i>“Whatever she is, I’m pretty sure I haven’t fucked one before,”</i> Miranda shrugs.", parse);
				Text.NL();
			}
			if(party.InParty(roa, switchSpot)) {
				if(burrows.LagonDefeated()) { //Regular
					Text.Add("Roa and Ophelia look at each other in confusion, then shift their gazes back at Layla.", parse);
					Text.NL();
					Text.Add("<i>“I’m afraid I’ve never seen anything like her. I could run some tests if you want,”</i> Ophelia offers.", parse);
					Text.NL();
					Text.Add("It’s probably best if she doesn’t, at least for now, considering what you’ve seen of Layla’s knack for getting rid of bindings. Plus you’re pretty sure she wouldn’t take kindly to that kind of treatment…", parse);
					Text.NL();
					Text.Add("What about Roa?", parse);
					Text.NL();
					Text.Add("<i>“Sorry, [playername],”</i> he shrugs.", parse);
				}
				else { //Slut
					Text.Add("The lagomorph siblings share a glance, then stride up to Layla with determined looks. <i>“Ophelia… run tests!”</i> the former alchemist proclaims, while her brother starts eagerly pawing the strange specimen.", parse);
					Text.NL();
					Text.Add("You stop the lusty lapins before they have a chance to take things further. They probably wouldn’t figure out anything, even if they did <i>test</i> Layla...", parse);
				}
				Text.NL();
			}
			if(party.InParty(cveta, switchSpot)) {
				Text.Add("Quietly, Cveta takes a step back and eyes Layla, the songstress keeping a politely detached air as she examines her without obviously staring.", parse);
				Text.NL();
				Text.Add("<i>“It is unfortunate that anthropology was not my forte, or indeed, a field I paid much attention to. The nature of this… person eludes me, [playername].”</i>", parse);
				Text.NL();
			}
		}
		else
			Text.NL();
		Text.Add("Looking her over once more, she has a reptilian tail, but elven ears. Her hands and feet look human enough, save for the claws. Her eyes are red, and her skin has a very unique pattern and feel. It’s like she’s not really any one thing. So maybe that is what you should refer to her as.", parse);
		Text.NL();
		Text.Add("Layla looks at you in curiosity, wondering what you have in mind.", parse);
		Text.NL();
		Text.Add("Where you come from, there’s a legendary creature that has the parts of several different species, called a chimera. That’s what Layla reminds you of. So, until you both manage to figure out what she really is, you’ll call her a chimera. Does she mind if you call her that, you ask.", parse);
		Text.NL();
		Text.Add("<i>“Chimera… I like it!”</i> she says with a grin.", parse);
		Text.NL();
		Text.Add("Then that’s what you’ll call her, you reply. Her cheerful enthusiasm is infectious and you find yourself grinning back. It may only be a placeholder, but it feels like you just helped her find a piece of her missing identity.", parse);
	}
	else { //Repeat
		Text.Add("Layla is a… well, you’re not sure what she is exactly, so you’re just calling her a chimera for now. She stands at about 5’4” and looks about in curiosity, just taking in her surroundings. It’s not until you draw her attention to yourself that she notices you.", parse);
		Text.NL();
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("Layla smiles as you wave her over.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>“Hi!”</i> Layla says with a grin.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>“Hmm?”</i> Layla tilts her head to the side a little, wondering what you want with her.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("<i>“Yes, [playername]?”</i>", parse);
		}, 1.0, function() { return true; });
		if(!layla.Virgin()) {
			scenes.AddEnc(function() {
				Text.Add("Layla wraps you in a hug as soon as you are within reach.", parse);
				Text.NL();
				Text.Add("Smiling, you hug your chimeric lover back, feeling her warm, smooth skin under your fingers.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Hey, [playername]. You wanna do it again?”</i> she asks.", parse);
				Text.NL();
				Text.Add("You chuckle and tell her that maybe later.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("When you come closer, Layla playfully leaps into the air, crashing into you and nuzzling you affectionately.", parse);
				Text.NL();
				Text.Add("You stagger slightly at the impact, but manage to catch her. Wrapping your arms around her, you chuckle and stroke her hair. You’d ask if she was happy to see you, but the answer’s pretty obvious.", parse);
			}, 1.0, function() { return true; });
		}
		
		scenes.Get();
	}
	Text.Flush();
	
	Scenes.Layla.Prompt(switchSpot);
}

/*
 * Trigger meetings:
 * 
 * 1. First meeting. On approaching farm from plains. On waking up from sleep on farm.
 * 2. Repeat meeting (if you lost). Same as above.
 * 3. Meeting after defeating Layla.
 * 
 */

Scenes.Layla.FarmMeetingTrigger = function(approach) {
	if(glade.flags["Visit"] < DryadGlade.Visit.DefeatedOrchid) return false; //TODO: change to after portals open?
	if(layla.flags["Met"] == Layla.Met.NotMet) {
		if(approach) {
			if(world.time.hour >= 8 && world.time.hour < 18) {
				Scenes.Layla.FirstMeeting(true);
				return true;
			}
			else return false;
		}
		else {
			Scenes.Layla.FirstMeeting(false);
			return true;
		}
	}
	else if(layla.flags["Met"] == Layla.Met.First) {
		if(!layla.farmTimer.Expired()) return false;
		if(approach) {
			if(world.time.hour >= 8 && world.time.hour < 18) {
				Scenes.Layla.RepeatMeeting(true);
				return true;
			}
			else return false;
		}
		else {
			Scenes.Layla.RepeatMeeting(false);
			return true;
		}
	}
	else if(layla.flags["Met"] == Layla.Met.Won) {
		if(!layla.farmTimer.Expired()) return false;
		if(approach) {
			if(world.time.hour >= 4 && world.time.hour < 22) {
				Scenes.Layla.SecondMeeting();
				return true;
			}
		}
	}
	return false;
}

//approaching/sleeping
Scenes.Layla.FirstMeeting = function(approach) {
	var parse = {
		playername : player.name
	};
	
	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
	parse["c"] = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
	
	layla.flags["Met"] = Layla.Met.First;
	
	Text.Clear();
	if(approach) {
		Text.Add("As you[c] make your way across the fields toward the farmhouse, your ears are filled with a great furor. Shouts, curses, screams, bleats; a cacophony of distress torn from throats animal and otherwise.", parse);
		Text.NL();
		Text.Add("Instinctively, you pick up your pace, racing to investigate. As you approach the barn, you see Gwendy pelting over the turf, swearing to herself. She lunges for a pitchfork that was left leaning against the side of the barn and spins on her heel to start back the way she had come.", parse);
		Text.NL();
		Text.Add("Running as fast as you can, you intercept the angry farmer, asking her just what is going on.", parse);
		Text.NL();
		Text.Add("<i>“Some kind of wild animal is raiding my storage. Gave the sheep quite a scare,”</i> she says, pointing toward a group of sheep huddled together.", parse);
		Text.NL();
		Text.Add("Without thinking, you nod your understanding. Caught up in the heat of the moment, you ask her if she’d like you[c] to handle this for her; you have a bit more combat experience than her.", parse);
	}
	else { // Sleeping at the farm
		Text.Add("As you lie curled up on your bed, a great clamoring rouses you[c] from your slumber. Startled, you grab your things and drop from the hayloft down into the barn proper, only to be nearly trampled as a flock of sheep charge inside, huddling together for shelter wherever they find a convenient nook.", parse);
		Text.NL();
		Text.Add("You race outside of the barn, almost running into Gwendy, who has just grabbed a nearby pitchfork. You ask her what is going on.", parse);
		Text.NL();
		Text.Add("<i>“Ah, [playername]. Good to see you’re awake. Some kind of wild animal is raiding my storage. I could use some help getting rid of it.”</i>", parse);
		Text.NL();
		Text.Add("Without stopping to think, you immediately blurt out that you’re happy to give her a hand. You probably have more combat experience than she does anyway.", parse);
	}
	Text.NL();
	Text.Add("<i>“Sure thing!”</i> she says with a smile. <i>“That thing is in the storage down this way!”</i> Gwendy hastily adds, dashing away. You[c] immediately take off after the sprinting farmer.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("When you arrive, you immediately take notice of the trail of destruction left by the so called creature. The sturdy door to the storage room has been knocked clean from its hinges, pieces of the wooden frame lying spread across the floor. From inside come the obvious sounds of munching and swallowing, as well as the occasional tinkle of shattering glass. Whoever tore down the door is clearly gorging themselves on Gwendy’s precious food, without the slightest care about being caught.", parse);
		Text.NL();
		if(party.Num() < 4) {
			Text.Add("<i>“Let’s go, [playername], while I still have food left!”</i> Gwendy says, stepping inside. You follow on the heels of farmer.", parse);
			
			gwendy.RestFull();
			party.SaveActiveParty();
			party.AddMember(gwendy, true);
			
			Text.NL();
			Text.Add("Gwendy temporarily joins your party.", parse, "bold");
		}
		else {
			Text.Add("<i>“You and your friends look capable enough, but if you need me, I’ll be right here.”</i>", parse);
			Text.NL();
			Text.Add("You thank Gwendy for her offer, but assure her that you and your companions can handle this. The four of you ready yourselves and step through the broken door into the storage room.", parse);
		}
		Text.NL();
		Text.Add("Once inside, you get a brief glimpse of the wreckage. Broken preserve jars, torn sacks, discarded scraps of food. But your attention is fixed on the creature responsible. Standing roughly five and a half feet tall, it’s a strange creature. Its features are elfin - you can see the distinctive ears from where you stand - but it’s darkly colored and has a long, lashing, lizard-like tail.", parse);
		Text.NL();
		Text.Add("As you step closer, glass crunches under your weight, making it wheel to face you. Red eyes narrow into a ferocious glare, and the lips, set in a surprisingly female face, curl into a teeth-baring snarl. She tosses a half-eaten apple away and you catch a glimpse of her teardrop shaped breasts and carelessly exposed pussy.", parse);
		Text.NL();
		Text.Add("The creature’s long tail whips restlessly from side to side, and her fingers curl into makeshift claws. Her body shifts, adopting a low-slung stance with legs primed to send her springing forward in a pounce. A bestial hiss slithers past her lips. It’s a fight!", parse);
		Text.Flush();
		
		Gui.NextPrompt(Scenes.Layla.FarmCombat);
	});
}


//In case you let her get away. This happens 3 days after that. And continue repeating every 3 days till you win.
Scenes.Layla.RepeatMeeting = function(approach) {
	var parse = {
		playername : player.name
	};
	
	var num = party.Num();
	
	if(party.Num() < 4) {
		gwendy.RestFull();
		party.SaveActiveParty();
		party.AddMember(gwendy, true);
	}
	
	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
	parse["c"]    = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
	
	Text.Clear();
	if(approach) {
		Text.Add("As you[c] cross the fields to Gwendy’s farm, you hear a chorus of shouting, screaming and swearing. You race for the storage, urged on by a sinking feeling in your stomach about what’s going on. ", parse);
		Text.NL();
		parse["g1"] = party.InParty(gwendy) ? " and Gwendy" : "";
		parse["g2"] = party.InParty(gwendy) ? "" : ", followed by Gwendy";
		Text.Add("Meeting a cursing Gwendy armed with a pitchfork there, and seeing that the door has been knocked down again, only confirms your suspicions. Without the need for words, you[g1] burst into the storage[g2]. The creature chokes, spitting a glob of half-chewed cheese on the floor, and whirls to again fight you off.", parse);
	}
	else {
		Text.Add("<i>“[playername]! Wake up!”</i>", parse);
		Text.NL();
		Text.Add("You grunt and force your protesting eyes to open, blinking to try to bring the world into focus.", parse);
		if(num > 2)
			Text.Add(" Around you, your companions likewise stir from their slumber, complaining in their own ways about the rude awakening.", parse);
		else if(num > 1) {
			parse["name"] = party.Get(1).name;
			parse["heshe"] = party.Get(1).heshe();
			Text.Add(" [name] grumbles audibly as [heshe] is likewise forced back into the waking world.", parse);
		}
		Text.NL();
		Text.Add("You turn a slightly irritated gaze on  Gwendy. In your state, it takes a moment to notice the grim set of her jaw.", parse);
		Text.NL();
		Text.Add("<i>“She’s back! Get up and help me catch her!”</i>", parse);
		Text.NL();
		Text.Add("The words burn through the fog still lingering in your sleep-fuddled brain. Grabbing your gear, you[c] hasten to join the farmer as she races to the storage room.", parse);
		Text.NL();
		Text.Add("Just like the first time, the recently repaired door has been knocked off its hinges, much to Gwendy’s evident frustration. You charge on in, intent on this time preventing the creature’s escape. It drops the jar of milk it was guzzling with a strangled belch of surprise, once again immediately moving to defend itself.", parse);
	}
	
	if(party.InParty(gwendy)) {
		Text.NL();
		Text.Add("Gwendy temporarily joins your party.", parse, "bold");
	}
	
	Text.Flush();
	
	Gui.NextPrompt(Scenes.Layla.FarmCombat);
}

Scenes.Layla.FarmCombat = function() {
	var enemy = new Party();
	enemy.AddMember(new LaylaMob());
	var enc = new Encounter(enemy);
	
	enc.canRun = false;
	
	enc.onLoss = Scenes.Layla.FarmCombatLoss;
	enc.onVictory = Scenes.Layla.FarmCombatWin;
	/* TODO
	enc.LossCondition = ...
	*/
	enc.Start();	
}

Scenes.Layla.FarmCombatLoss = function() {
	var enc = this;
	SetGameState(GameState.Event);
	
	if(party.InParty(gwendy))
		party.LoadActiveParty();
	
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>“Dammit!”</i> you hear Gwendy curse as the creature dashes past her in a single leap. You give chase, but by the time you exit the storehouse she’s already gone.", parse);
	Text.NL();
	Text.Add("<i>“Fuck!”</i> Gwendy curses again. <i>“Look at this mess!”</i>", parse);
	Text.NL();
	Text.Add("As if you could miss it. By herself, that thing, whatever it was, seems to have eaten easily a third of all the food Gwendy had stored here. Shelves are torn down, broken or discarded containers lie everywhere, and the floor is covered in puddles of brine, honey, jam, broken eggs, flour and spilt milk.", parse);
	Text.NL();
	Text.Add("<i>“I-Is the monster gone?”</i> A familiar sheep asks, peeking in from outside.", parse);
	Text.NL();
	Text.Add("<i>“Yes, it’s gone. Danie, be a dear and fetch Adrian for me. I’m going to need some help cleaning this up. Plus, the door needs fixing.”</i>", parse);
	Text.NL();
	Text.Add("<i>“Sure!”</i> Danie replies, darting away.", parse);
	Text.NL();
	Text.Add("Taking in the damage again, you tap Gwendy on her shoulder to get her attention. When she turns to you, you point out that this probably won’t be the last raid. That creature looked hungry, and now that she knows where there’s food to be had, you’d lay money on her coming back for more when she wants it.", parse);
	Text.NL();
	Text.Add("<i>“Yeah, I’m pretty sure she will. But when she does, we’ll be ready.”</i>", parse);
	Text.NL();
	Text.Add("You nod firmly, assuring Gwendy that if you can, you’ll try and be here to help her with the next raid.", parse);
	Text.NL();
	Text.Add("<i>“Thanks, [playername],”</i> the farmer says, getting up on her feet and offering you a smile. <i>“If you want, you can stay over and I’ll call you when we spot that creature again.”</i>", parse);
	Text.NL();
	Text.Add("You thank Gwendy for her offer, and tell her you’ll consider it. For now, you should figure out what you want to do.", parse);
	Text.Flush();
	
	world.TimeStep({minute: 30});
	
	layla.farmTimer = new Time(0,0,3,0,0);
	
	Gui.NextPrompt();
}

Scenes.Layla.FarmCombatWin = function() {
	var enc = this;
	SetGameState(GameState.Event);
	
	if(party.InParty(gwendy))
		party.LoadActiveParty();
	
	var parse = {
		playername : player.name
	};
	
	layla.flags["Met"] = Layla.Met.Won;
	
	Text.Clear();
	Text.Add("With a great hissing sigh, the creature staggers before collapsing onto the ground into a pile of scraps. Her formerly lashing tail goes limp and she lies motionless, clearly out cold.", parse);
	Text.NL();
	Text.Add("<i>“Good job!”</i> Gwendy exclaims triumphantly. <i>“Quick, [playername]. There’s some rope on that shelf. Tie this thing up before she wakes up.”</i>", parse);
	Text.NL();
	Text.Add("You hasten to grab the indicated ropes. Between the two of you, the creature is soon trussed up like a troublesome calf; she won’t be getting out of these bindings anytime soon. Once the creature is secured, you ask Gwendy what you should do next.", parse);
	Text.NL();
	Text.Add("<i>“There’s an empty tool shed that way. We can keep her locked in there until we can figure out what to do with her. I’ll go get someone to watch her.”</i>", parse);
	Text.NL();
	Text.Add("With a nod of understanding, you haul your new captive along in the direction Gwendy indicated. She’s pretty heavy... but then, after how much she ate, you’re not surprised.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("<i>“Thanks a lot for the help, [playername]. You’re a life saver.”</i> Gwendy smiles.", parse);
		Text.NL();
		Text.Add("It was nothing, really, you assure her. The two of you head back toward the barn, chatting about the encounter. Gwendy seems rather impressed by your performance, and she’s definitely grateful for your help. The farmer invites you up to her loft for some refreshments, and you graciously accept, following her up the ladder and taking a seat at her table.", parse);
		Text.NL();
		Text.Add("<i>“Can I get you anything? Tea? Coffee?”</i> Gwendy wipes the sweat from her brow, a single drop escaping her attention and dripping down into her generous cleavage.", parse);
		Text.Flush();
		
		var hadSex = false;
		
		//[Tea] [Coffee] [You’re fine] [Sex]
		var options = new Array();
		options.push({ nameStr : "Tea",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Alright, take a seat and I’ll prepare you some tea.”</i>", parse);
				Text.NL();
				Text.Add("Thanking her for her kindness, you make yourself comfortable and settle back to wait for your drink.", parse);
				Text.Flush();
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Some tea would be lovely."
		});
		options.push({ nameStr : "Coffee",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Okay, sit down while I prepare some.”</i>", parse);
				Text.NL();
				Text.Add("Thanking her for her kindness, you make yourself comfortable and settle back to wait for your drink.", parse);
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Coffee would be great."
		});
		options.push({ nameStr : "You’re fine",
			func : function() {
				Text.Clear();
				Text.Add("<i>“You sure? Alright then. Hope you don’t mind if I fix some coffee for myself.”</i>", parse);
				Text.NL();
				Text.Add("You smile and shake your head, assuring her that it’s fine. As she disappears into the kitchen to fix herself something, your make yourself comfortable.", parse);
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "You’re not thirsty, but you appreciate the offer."
		});
		options.push({ nameStr : "Sex",
			func : function() {
				Text.Clear();
				Text.Add("You tell her that if she wants to show you her gratitude, you can think of a more enjoyable way for her to do that...", parse);
				Text.NL();
				Text.Add("<i>“I see, and what way would that be?”</i> Gwendy asks with a knowing smile.", parse);
				Text.Flush();
				
				hadSex = true;
				
				Scenes.Gwendy.LoftSexPrompt(function() {
					hadSex = false;
					
					Text.Clear();
					Text.Add("Uhh… actually, never mind. You shouldn’t have brought it up.", parse);
					Text.NL();
					Text.Add("<i>“And what would ‘it’ be?”</i> Gwendy queries, eyebrow raised. The girl seems pretty amused as you squirm under her gaze. <i>“If you are feeling a bit antsy… I’m not one to be ungrateful,”</i> she adds suggestively.", parse);
					Text.NL();
					Text.Add("She’s sharper than she lets on. Stumbling a bit over your words, you quickly decline, managing to get out something about having that drink.", parse);
					Text.NL();
					Text.Add("<i>“Sure,”</i> Gwendy shrugs, heading for her kitchen downstairs. <i>“Tea? Coffee? Milk?”</i>", parse);
					Text.NL();
					Text.Add("Goddamnit. She’s chuckles to herself, disappearing from view.", parse);
					Text.Flush();
					Gui.NextPrompt();
				}, true); // disable sleep (or this can potentially trigger the scene with Layla again...)
			}, enabled : gwendy.Sexed(), //Only available if you can normally access her Sex menu, otherwise disable this button.
			tooltip : "If she wants to show you her gratitude, you can think of a more enjoyable way for her to do that..."
		});
		Gui.SetButtonsFromList(options, false, null);
		
		Gui.Callstack.push(function() {
			Text.Clear();
			
			world.TimeStep({hour: 2});
			
			if(hadSex) {
				Text.Add("Quite some time later, when both of you have become a bit more presentable again and are sipping on some refreshments, you’re interrupted by a cowgirl poking her head up from the ladder leading to the loft. There’s a slight flush on her cheeks when she perceives the mood, but she shakes herself back to reality.", parse);
				Text.NL();
				Text.Add("<i>“Uhh… boss? She’s awake.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Alright, thanks,”</i> Gwendy replies, unfazed by the farmhand’s discomfort. The farmer turns to you, flashing you a quick grin. <i>“Shall we go see what this little intruder is up to, then? Or are you still feeling antsy?”</i> The cowgirl disappears down the ladder, ears burning.", parse);
			}
			else {
				Text.Add("You relax and chat with Gwendy for a while, until a cowgirl pokes up over the edge of the loft, interrupting you.", parse);
				Text.NL();
				Text.Add("<i>“Boss? She’s awake.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Alright, thanks,”</i> Gwendy replies. She nods at the cowgirl, dismissing her. <i>“Alrighty then. Let’s figure out what to do with our little intruder, shall we?”</i> she says, smiling at you.", parse);
			}
			Text.NL();
			Text.Add("Setting your shoulders, you rise from your seat and ask her to lead the way.", parse);
			Text.NL();
			Text.Add("Having set off at a brisk pace, you arrive at the toolshed shortly. The door is closed and one of the farm’s tougher-looking cowgirls is standing guard. At a gesture from Gwendy, the cowgirl nods, stepping aside to let the two of you pass.", parse);
			Text.NL();
			Text.Add("Gwendy is the first into the shed, and her sudden, sharp curse brings you racing to join her.", parse);
			Text.NL();
			Text.Add("Inside, you find that your captive has somehow gotten out of her bonds and is now loose. The she-beast is huddled in a corner, hissing like a giant snake, fingers curled into claws and tail lashing behind her.", parse);
			Text.NL();
			Text.Add("And yet... the creature’s eyes are wide and staring, darting all around the room in search of an exit. Her teeth are bared, but her body trembles feverishly. Despite her threatening display, you’re sure that the creature is scared of you.", parse);
			Text.NL();
			Text.Add("The stand off lasts for several long seconds. And then, the silence is cut by a plaintive gurgling grumble. Unthinkingly, the creature wraps her hands over her belly, whimpering softly in hunger. From panicked and threatening, she now just looks pitiful.", parse);
			Text.NL();
			Text.Add("Gwendy sighs. <i>“[playername], keep an eye on her, will you? I’ll be right back.”</i>", parse);
			Text.NL();
			Text.Add("You nod your assent and step past Gwendy, pointedly blocking the door as Gwendy ducks back outside.", parse);
			Text.NL();
			Text.Add("The farmer returns moments later with an armful of apples nestled against her bosom. She walks past you and crouches next to the strange girl, offering one to her.", parse);
			Text.NL();
			Text.Add("At first, the creature is suspicious, her red eyes drifting between you, Gwendy and the proffered apple. After what seems like an eternity, she reaches out a hand and snatches the fruit, practically devouring it on the spot. The others follow in suit.", parse);
			Text.NL();
			Text.Add("<i>“There you go. Better?”</i> Gwendy asks.", parse);
			Text.NL();
			Text.Add("<i>“...Thank you...”</i> the girls say in a hushed voice.", parse);
			Text.NL();
			Text.Add("<i>“So, you can talk...”</i> the farmer girl says.", parse);
			Text.NL();
			Text.Add("The creature simply nods, finally relaxing; her face loses some of its fearfulness and she stops holding herself quite so tensely. Gently, she sinks to the ground, seating herself on the earthen floor, leaning against the wall for support. Her hands lay themselves in her lap, her tail curling defensively around her body.", parse);
			Text.NL();
			Text.Add("<i>“Okay then, what’s your name?”</i>", parse);
			Text.NL();
			Text.Add("The creature looks at Gwendy for a moment, then shrugs.", parse);
			Text.NL();
			Text.Add("<i>“You got no name?”</i>", parse);
			Text.NL();
			Text.Add("The girl simply shakes her head.", parse);
			Text.NL();
			Text.Add("<i>“Then where do you come from?”</i>", parse);
			Text.NL();
			Text.Add("The creature looks at Gwendy for a moment, then shrugs once more.", parse);
			Text.NL();
			Text.Add("<i>“Oh boy… you’re not making this easy are you?”</i> the farmer sighs, then looks at you. From her expression, she’s obviously asking you for ideas.", parse);
			Text.NL();
			Text.Add("Hmm... you could always try and take the creature along with you. She could be useful in your party.", parse);
			Text.Flush();
			
			//[Take] [Don’t take]
			var options = new Array();
			options.push({ nameStr : "Take",
				func : function() {
					layla.flags["Take"] = 1;
					
					Text.Clear();
					Text.Add("<i>“That’s not a half-bad idea. But...”</i> She turns her gaze back to the strange girl. <i>“There’s the matter of broken storage doors, the shelves, pots and crates. Not to mention my frightened animals and workers.”</i>", parse);
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Offer to take the creature with you; that should keep her out of mischief, at least."
			});
			options.push({ nameStr : "Don’t take",
				func : function() {
					Text.Clear();
					Text.Add("Gwendy shrugs, then turn back to the girl. <i>“Alright then, we’ll figure that part out some other time. For now there is a little matter you and I have to settle first, missy.”</i>", parse);
					Text.NL();
					Text.Add("The girls simply tilts her head to the side, eyeing the farmer with confusion.", parse);
					Text.NL();
					Text.Add("<i>“The broken storage doors, the shelves, pots and crates. Not to mention my frightened animals and workers.”</i>", parse);
					PrintDefaultOptions();
				}, enabled : true,
				tooltip : "Tell Gwendy that you don’t have any ideas what to do with the creature."
			});
			Gui.SetButtonsFromList(options, false, null);
			
			Gui.Callstack.push(function() {
				Text.NL();
				Text.Add("The girl cowers as Gwendy lists all the damage she’s caused.", parse);
				Text.NL();
				Text.Add("<i>“Well? What are you going to do about it?”</i>", parse);
				Text.NL();
				Text.Add("The girl, whatever she is, is clearly at a loss for words. She looks so pathetic that you just have to intervene. Before you have the chance to, however, Gwendy puts a hand on your shoulders and winks. Seems like she has a plan. You close your mouth and wait to see what she has in mind.", parse);
				Text.NL();
				Text.Add("<i>“I… I’m sorry,”</i> the girl says.", parse);
				Text.NL();
				Text.Add("<i>“You can’t just go about entering any farm you see around, scaring everyone, then pilfering their food. Everyone worked really hard for the fruit and produce you just carelessly gobbled up.”</i>", parse);
				Text.NL();
				Text.Add("<i>“I’m sorry. I was hungry...”</i> she says, now on the verge of tears.", parse);
				Text.NL();
				Text.Add("<i>“I don’t think you understand how hard they all worked...”</i> Gwendy adds. <i>“But not to worry, you soon will. You say you were hungry? Well, we can’t have that either.”</i>", parse);
				Text.NL();
				Text.Add("The girl stops crying for a moment, just looking at the farmer with curiosity and fear in her eyes.", parse);
				Text.NL();
				if(layla.flags["Take"] != 0) {
					Text.Add("<i>“You will work and repair the doors you broke, clean up the storage and apologize to everyone you scared. Then I’ll let [playername] take you. Agreed?”</i>", parse);
					Text.NL();
					Text.Add("The creature nods slowly.", parse);
					Text.NL();
					Text.Add("<i>“Good, now let’s get up and get you fed. Can’t work on an empty stomach.”</i>", parse);
					Text.NL();
					Text.Add("<i>“T-Thank you,”</i> she replies, wiping the tears off her eyes and getting on her feet.", parse);
					Text.NL();
					Text.Add("<i>“[playername]. Come back in a couple days, okay? I’m going to give this one a schooling. If you take her with you as she is, I’m afraid she’ll only cause trouble.”</i>", parse);
					Text.NL();
					Text.Add("Nodding your head, you muse aloud that Gwendy does raise a valid point. You don’t think that the girl is fit to be taken to a city yet; sounds like a recipe for disaster. You’re happy to leave her here until Gwendy is done schooling her.", parse);
				}
				else {
					Text.Add("<i>“You will work here, until you’ve paid everyone back for the damage you caused. Then, I’ll let you go. Understand?”</i>", parse);
					Text.NL();
					Text.Add("The girl nods slowly.", parse);
					Text.NL();
					Text.Add("<i>“And if you prove you can work well enough. Who knows… I might even consider letting you stay. It’s hard work, but at least you won’t go hungry, right?”</i>", parse);
					Text.NL();
					Text.Add("At this, the creature smiles a little. <i>“T-Thank you...”</i>", parse);
					Text.NL();
					Text.Add("<i>“See? You’re a good girl after all. C’mon, get up and let’s get you fed. You can’t work on an empty stomach.”</i>", parse);
					Text.NL();
					Text.Add("The strange girl nods again and wipes the tears from her eyes.", parse);
					Text.NL();
					Text.Add("Gwendy turns to look at you next. <i>“Hey, [playername]. Don’t worry about it. I’ll keep this girl here, school her and put her to work. This way, we know she won’t cause trouble. Plus, she can intimidate other petty thieves.”</i>", parse);
					Text.NL();
					Text.Add("You confess that Gwendy’s idea sounds like a solid plan to you. This is probably the best place for her at the moment.", parse);
				}
				Text.Flush();
				
				world.TimeStep({hour: 1});
				
				layla.farmTimer = new Time(0,0,3,0,0);
				
				Gui.NextPrompt();
			});
		});
	});
}

//Automatically happens 3 days after you won against Layla. As soon as the PC steps on the field.
Scenes.Layla.SecondMeeting = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("As you reach the fields, you spot Gwendy’s recent ‘houseguest’ as she busies herself stacking some firewood for later use. After placing the last logs, she wipes her brow with a forearm, letting out a tired sigh. Feeling inquisitive, you decide to see how she’s doing.", parse);
	Text.NL();
	Text.Add("As you get closer, you wonder why Gwendy doesn’t seem to have had any luck teaching her how to wear clothes yet. She’s still totally naked, just as she had been when you found her. It’s only when you get right up to her that you can see that you were wrong. She <b>is</b> clothed, wearing a simple dress that shows not the slightest ornamentation, but quite effectively preserves her modesty. It’s just that it’s so tight, and so closely matches her own gray and dull silver coloration, that it blends in with her skin.", parse);
	Text.NL();
	Text.Add("She turns at your approach  and jumps a little in surprise. A timid smile creeps onto her face as she greets you with a simple, <i>“Hello.”</i>", parse);
	Text.NL();
	Text.Add("Smiling encouragingly back at her, you return her greeting and ask her how she’s doing now that Gwendy’s taken her in.", parse);
	Text.NL();
	Text.Add("<i>“Oh, I’m doing fine,”</i> she says, then lowers her head. <i>“Sorry for attacking you...”</i>", parse);
	Text.NL();
	Text.Add("You wave it off, assuring her that it’s fine. You were kind of threatening her, after all.", parse);
	Text.NL();
	Text.Add("<i>“Oh, miss Gwendy said I should always introduce myself when I meet someone new,”</i> she clears her throat. <i>“Hello, I’m Layla. Nice to meet you… umm...”</i>", parse);
	Text.NL();
	Text.Add("[playername], you reply. Your name is [playername]. So, she’s called Layla now? That’s a pretty name.", parse);
	Text.NL();
	Text.Add("<i>“Thank you! I picked it myself. Your name is pretty too!”</i> she says with a smile.", parse);
	Text.NL();
	Text.Add("You thank her for the compliment. Then, curious, you ask how long she thinks it will take for her to work off the cost of the damage she did to Gwendy’s storeroom.", parse);
	Text.NL();
	Text.Add("<i>“It’s already paid for. I’m just helping around a bit.”</i> She smiles.", parse);
	Text.NL();
	Text.Add("You figured Gwendy was generous, but all the same, you’re surprised to see Layla’s already paid off her debt.", parse);
	Text.NL();
	if(layla.flags["Take"] != 0) {
		Text.Add("Pushing that thought aside, you ask Layla if she remembers what you and Gwendy had in mind - about her coming with you once her debt was paid off?", parse);
		Text.NL();
		Text.Add("<i>“Yes. I’ve been waiting for you. I just want to say goodbye to everyone and we can go.”</i>", parse);
		Text.NL();
		Text.Add("So, she’s made some friends here? Of course she can have some time to say goodbye; you can wait for her to do that.", parse);
		Text.NL();
		
		Scenes.Layla.LaylaLeavesGwendy();
	}
	else {
		Text.Add("Dismissing the thought, you ask Layla what she intends to do now that she’s free of her debt to Gwendy.", parse);
		Text.NL();
		Text.Add("The alien-looking girl stops to think for a moment. <i>“I’d like to find out where I come from, or even who I am. But I don’t stand a chance traveling alone, and everyone has been so nice to me here, even after I was so bad.”</i> She looks down for a moment, but quickly perks up. <i>“So I guess I’ll stay here.”</i>", parse);
		Text.NL();
		Text.Add("Well, if she’s found herself a home of sorts here, then that’s probably the smartest choice, you tell her. Privately, you consider her words. Maybe she’d be willing to come along with you if you ever offered her a place in your party? It’s something to keep in mind in the future.", parse);
		Text.Flush();
		//TODO
		//#Layla can now be visited on Gwendy’s Farm Fields. From 8:00 to 19:00
		layla.flags["Met"] = Layla.Met.Farm;
	
		Gui.NextPrompt();
	}
	world.TimeStep({minute: 30});
}

Scenes.Layla.LaylaLeavesGwendy = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Add("<i>“Okay! I’ll be right back!”</i> she says, dashing off at an impressive speed. It takes only a few minutes before she returns, with Gwendy in tow.", parse);
	Text.NL();
	Text.Add("<i>“So you’re taking Layla away,”</i> Gwendy states.", parse);
	Text.NL();
	Text.Add("You nod and tell her that you are. Was there something she wanted to say to Layla before she left? Or to you, for that matter?", parse);
	Text.NL();
	Text.Add("<i>“Just wanted to tell you to watch out for her. She’s a good girl,”</i> she says, then turns to Layla and embraces her in a hug. <i>“Gonna miss having you around, don’t forget to visit, ‘kay?”</i>", parse);
	Text.NL();
	Text.Add("<i>“‘Kay!”</i> Layla replies, hugging back.", parse);
	Text.NL();
	Text.Add("Well, look at that; certainly not what you would have expected given how they met. The sight brings a smile to your lips.", parse);
	Text.NL();
	Text.Add("<i>“Bye, Miss Gwendy. Thank you for everything,”</i> Layla says with a smile.", parse);
	Text.NL();
	Text.Add("<i>“Bye, Layla. [playername]. You two take care.”</i> Gwendy waves you off.", parse);
	Text.NL();
	Text.Add("Layla has joined your party.", parse, "bold");
	
	party.SwitchIn(layla);
	
	Text.Flush();
	
	layla.flags["Met"]  = Layla.Met.Party;
	layla.flags["Take"] = 0; //Remove variable from save
	
	Gui.NextPrompt(function() {
		MoveToLocation(world.loc.Plains.Crossroads, {minute: 30});
	});
}

export { Layla };
