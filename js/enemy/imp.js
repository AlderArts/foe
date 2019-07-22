/*
 * 
 * Imp
 * 
 */

import { Entity } from '../entity';
import { Intro } from '../event/introduction';

function Imp() {
	Entity.call(this);
	this.ID = "imp";
	
	this.avatar.combat     = Images.imp;
	
	this.name              = "Imp";
	this.monsterName       = "the imp";
	this.MonsterName       = "The imp";
	this.maxHp.base        = 30;
	this.maxSp.base        = 10;
	this.maxLust.base      = 10;
	// Main stats
	this.strength.base     = 6;
	this.stamina.base      = 8;
	this.dexterity.base    = 8;
	this.intelligence.base = 6;
	this.spirit.base       = 8;
	this.libido.base       = 18;
	this.charisma.base     = 4;
	
	this.elementDef.dmg[Element.mFire] = 0.5;
	this.elementDef.dmg[Element.mDark] = 0.5;
	
	this.level             = 1;
	this.sexlevel          = 1;
	
	this.combatExp         = 1;
	this.coinDrop          = 1;
	
	this.body.DefMale();
	this.Butt().virgin = false;
	
	this.body.SetRace(Race.Demon);
	
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.Demon, Color.red);
	TF.SetAppendage(this.Appendages(), AppendageType.horn, Race.Demon, Color.red);
	
	var col = Math.random();
	if(col < 0.3)
		this.body.SetBodyColor(Color.red);
	else if(col < 0.7)
		this.body.SetBodyColor(Color.gray);
	else
		this.body.SetBodyColor(Color.green);
	
	this.body.SetEyeColor(Color.yellow);
	
	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
Imp.prototype = new Entity();
Imp.prototype.constructor = Imp;

// Intro scenes

Intro.ImpsWinPrompt = function() {
	Text.Clear();
		
	Text.Add("A quick, cursory glance tells you that the imps carry nothing of value. In fact, they carry nothing at all, not even clothes.");
	Text.NL();
	Text.Add("The words of the demon return to you... why should you not claim your rightful price? You thoughtfully consider the fallen group of scrawny imps - hardly an appealing lot, but maybe they can relieve that itch in your loins?");
	Text.NL();
	
	var imp = new Imp();
	
	var genDesc = (player.Gender() == Gender.male) ?
		function() { return player.FirstCock().Short(); } :
		function() { return player.FirstVag().Short(); };
		
	var parse = {genDesc: genDesc};
	
	Text.Flush();
	//[No][Use][Ride][Group]
	var options = new Array();
	options.push({ nameStr : "No",
		func : function() {
			Text.Add("With a shake of your head, you regain your composure, leaving the pile of imps to their own devices. You catch the demon throwing you a disappointed glance before he returns to his own thoughts.");
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Eww, what were you thinking!?"
	});
	options.push({ nameStr : "Use",
		func : function() {
			if(player.Gender() == Gender.male)
				Intro.ImpsWinUseMale();
			else
				Intro.ImpsWinUseFemale();
		}, enabled : true,
		tooltip : Text.Parse("You need to find a release for your [genDesc], perhaps the imps are up to the task?", parse)
	});
	options.push({ nameStr : "Ride",
		func : Intro.ImpsWinRide, enabled : true,
		tooltip : "One of those imp dicks could surely sate you..."
	});
	options.push({ nameStr : "Group",
		func : Intro.ImpsWinGroup, enabled : true,
		tooltip : "Why settle for one imp when you can have all of them? Better get ready for being stretched, though..."
	});
	Gui.SetButtonsFromList(options);
}

Intro.ImpsWinUseMale = function() {
	var imp = new Imp();
	
	var parse = {
		cockDesc : function() { return player.FirstCock().Short(); },
		cockLen  : function() { return player.FirstCock().Desc().len; }
	};
	
	Text.Clear();
	
	Text.Add("Prodding one of the exhausted imps into a wakeful state, you manage to pull him unto his knees, putting him face to face with your stiff [cockDesc]. His feeble protests are quickly overruled by [cockLen] of hot meat stuffed into his tight mouth. You settle into a rough face-fucking rhythm, only interested in your own release.", parse);
	Text.NL();
	Text.Add("The poor creature tries to pull back, but you insistently hold his head in place with both hands. The imp's muffled moans sounds pretty pitiful - to think that this creature attempted to assault you! Not like he has anything to complain about, he surely would have attempted to do the same to you.");
	Text.NL();
	Text.Add("The sounds coming from the imp suddenly turn from moans to choking noises - seems you are a bit too rough on him...");
	Text.Flush();
	
	//[Gentle][Rough][Anal]
	var options = new Array();
	options.push({ nameStr : "Gentle",
		func : function() {
			Text.Clear();
			Text.Add("Showing mercy on the imp, you pull out of his mouth, allowing him to draw breath. Before he can get too comfortable though, you insistently prod his cheek with your [cockDesc], coaxing him.", parse);
			Text.NL();
			Text.Add("<i>“Don't think you are getting away that easily, now get sucking!”</i> you taunt the red-skinned creature. The defiance flees from the imp's eyes and he dejectedly starts licking and stroking your member. <i>“Put in a bit more effort,”</i> you murmur, eyes half closed, as the imp swallows your [cockDesc] whole, letting his rough tongue play along the stem.", parse);
			Text.NL();
			Text.Add("<i>“Good... unf, you must get a lot of practice to be this good,”</i> you croon as your demonic cocksleeve really gets down to business. As you feel your release coming closer, the imp pulls out until only the head of your [cockDesc] remains inside his mouth, resting on his tongue. Intent to get you off quickly, the demonic slut starts to lap at your tip while simultaneously jacking you off with both hands.", parse);
			Text.NL();
			Text.Add("Overcome by pleasure, you lustfully cry out as you unload wad after wad into the mouth of the imp, letting your sticky spunk splatter on his tongue and pour down his throat. The creature dutifully swallows every drop, panting as you pull out, hard with lust himself.");
			Text.NL();
			Text.Add("You give the aroused imp a slight snicker, leaving him to his own devices.");
			
			Sex.Blowjob(imp, player);
			imp.FuckOral(imp.Mouth(), player.FirstCock(), 1);
			player.Fuck(player.FirstCock(), 1);
			
			Text.Flush();
			Gui.NextPrompt(Intro.DemonGift);
		}, enabled : true,
		tooltip : "Let him show off his cock sucking skills."
	});
	options.push({ nameStr : "Rough",
		func : function() {
			Text.Clear();
			Text.Add("...Who cares about imps, anyway? Ignoring the creature's increasingly desperate pleas, you resume your skull-fucking with undiminished vigor, only occasionally letting the imp draw air to keep it from passing out.");
			Text.NL();
			
			if(player.FirstCock().length.Get() >= 15)
				Text.Add("Due to its length, your [cockDesc] is soon prodding at the entrance of the imp's throat and by applying a final push, you force the head inside the tight passage. The imp, not used to such treatment, involuntarily constricts his throat, trying to force out the invader. This only further entices you, milking a few drops of pre from your [cockDesc].", parse);
			else
				Text.Add("You are not quite big enough to stuff his throat, but if you push as far as you can, you can just manage to touch his uvula. Taking this as a challenge, you grab the imp's head and, roughly and repeatedly, feed him your length, mashing your hips against his face and bruising his nose in the process. Each time your [cockDesc] brushes against the back of his maw, you are rewarded with a shuddering moan and a twitching caress from his tongue. Slamming in as far as you can, you insistently rub against the roof of his mouth.", parse);
			
			Text.NL();
			Text.Add("You rest there, a firm hand keeping the imp in place as his convulsions bring you to your peak. Moaning with pleasure, you release a stream of white semen down the throat of the poor imp, forcing it to swallow.");
			Text.NL();
			Text.Add("Spent, you pull out of your cumdump, only to find that the imp has passed out. Shrugging, you leave it where it is, wheezing and leaking cum.");
			
			Sex.Blowjob(imp, player);
			imp.FuckOral(imp.Mouth(), player.FirstCock(), 2);
			player.Fuck(player.FirstCock(), 2);
			
			Text.Flush();
			Gui.NextPrompt(Intro.DemonGift);
		}, enabled : true,
		tooltip : "Fuck being gentle, you are almost there!"
	});
	options.push({ nameStr : "Anal",
		func : function() {
			Text.Clear();
			Text.Add("You pull out of the imp's mouth, absently rubbing your saliva and pre-covered [cockDesc] against his cheek. The creature takes the opportunity to take a few wheezing breaths before trying to scramble away from you. Effortlessly grabbing his tail and sweeping his legs away from under him, you chide him.", parse);
			Text.NL();
			Text.Add("<i>“Come on now. Can't have you running away before I get off, can we? If you are going to be such a baby and not allow me to use your mouth, I'm just going to have to find another hole to stuff.”</i> Comprehension slowly dawns on the scrawny imp, and it begins to plead for you to use its mouth again, but your attention is focused on its plump rear. You give the demonic butt a few gentle caresses, keeping the struggling imp in place with a steady grip on its tail.");
			Text.NL();
			Text.Add("With your other hand, you guide your [cockDesc] up against the struggling runt's taint, sighing with content as the dark red rosebud gives way. The imp yelps in a mix of pain and pleasure as you set your pace, plunging your stiff [cockDesc] deeper and deeper inside him.", parse);
			Text.NL();
			
			Sex.Anal(player, imp);
			imp.FuckAnal(imp.Butt(), player.FirstCock(), 3);
			player.Fuck(player.FirstCock(), 3);
			
			Text.Add("Before long, you bottom out");
			if(player.FirstCock().length.Get() >= 15)
				Text.Add(", your increased length reaching previously untouched depths");
			Text.Add(". The imp's anal muscles constrict wildly, trying to force the unfamiliar invader out of its body. You hardly have to move at all to bring yourself to your orgasm, but nonetheless you roughly buck against the imp's ass, painting his insides white with your seed.");
			Text.NL();
			Text.Add("Planting a slap on the panting imp's behind, you pull out and tell it to run off. It tries, but after a few wobbling steps, its knees give out and it drops in a quivering heap, leaking semen.");
			
			Text.Flush();
			Gui.NextPrompt(Intro.DemonGift);
		}, enabled : true,
		tooltip : "If his mouth can't handle your cock, maybe his ass can."
	});
	Gui.SetButtonsFromList(options);
}

Intro.ImpsCuntBlock = function(parse) {
	Intro.cuntBlocked = true;
	Text.Add("<i>“Fuah, I... I need more!”</i> Stepping on the imp's shoulder, you push him to the ground. <i>“Now, be a good boy and stay like that,”</i> you breathe lustily, working him to full arousal with the sole of your foot. Straddling the imp's cock, you rub your wet labia against the tip, but when you try to sink down on the impressive tool, something blocks you. Moaning in frustration, you try to press down again, but the imp's [impCockDesc] just slides to the side, harmlessly.", parse);
	Text.NL();
	Text.Add("<b>YOUR VIRGINITY IS <i>MINE</i>,</b> the demon rumbles maliciously, <b>THESE TRASH CAN MAKE DO WITH YOUR OTHER HOLES.</b>", parse);
	Text.NL();
	Text.Add("Grumbling, you give it one more try, but the invisible barrier opposes you once more. Frustrated, you adjust your aim, placing your ass over the raised imp-cock.", parse);
}

Intro.ImpsWinUseFemale = function() {
	
	var imp = new Imp();
	
	var parse = {
		cuntDesc   : function() { return player.FirstVag().Short(); },
		breastDesc : function() { return player.FirstBreastRow().Short(); },
		clitDesc   : function() { return player.FirstVag().ClitShort(); },
		anusDesc   : function() { return player.Butt().AnalShort(); },
		//Imp
		impCockDesc   : function() { return imp.FirstCock().Short(); },
		cockName   : function() { return imp.FirstCock().noun(); }
	};
	
	Text.Clear();
	
	Text.Add("You rouse one of the imps by prodding him with your foot. Imperiously, you command him to eat you out. The eager creature quickly scrambles to comply, kneeling before you and burying his tongue in your [cuntDesc].", parse);
	Text.NL();
	Text.Add("Thoroughly enjoying yourself, you play with your [breastDesc] while the imp laps at your labia, his pointy nose accidentally brushing up against your stiff [clitDesc]. Something stirs inside you... are you really satisfied with only this?", parse);
	Text.Flush();

	// Intro.cuntBlocked

	//[No][Use][Ride][Group]
	var options = new Array();
	options.push({ nameStr : "Oral ride",
		func : function() {
			Text.Clear();
			Text.Add("With a rough shove, you push the surprised imp flat on his back. Smirking, you turn around and lower yourself, presenting your pussy to the confused creature. Licking your lips, you survey the imp's [impCockDesc], giving it a friendly squeeze.", parse);
			Text.NL();
			Text.Add("Due to the difference in height, you have to contort yourself quite a bit to be able to suck the little demon's dick, but you are not going to let that stop you. The imp can hardly believe his luck as you suck away at his [impCockDesc], and redoubles his efforts to get you off.", parse);
			Text.NL();
			Text.Add("The creature may be small, but his cock certainly isn't. Getting the whole thing into your mouth is quite the challenge, but you somehow manage. Juices are streaming freely from your [cuntDesc], and you grind your hips against your demonic lover, your moans muffled by the shaft rammed into your mouth.", parse);
			Text.NL();
			Text.Add("Both of you cum simultaneously, salty semen lathering your tongue as you ride out your own trembling orgasm. When your legs have finished shaking, you get up, wiping the remains of the imp's ejaculate from your lips.", parse);
			
			Sex.Blowjob(player, imp);
			player.FuckOral(player.Mouth(), imp.FirstCock(), 2);
			imp.Fuck(imp.FirstCock(), 2);
			
			Text.Flush();
			Gui.NextPrompt(Intro.DemonGift);
		}, enabled : true,
		tooltip : "Your legs are getting a bit wobbly, and you realize it would be much comfier to straddle the imp's face, and maybe give him a blowjob while you are at it."
	});
	options.push({ nameStr : !Intro.cuntBlocked ? "Vaginal ride" : "Anal ride",
		func : function() {
			Text.Clear();
			
			if(!Intro.cuntBlocked) {
				Intro.ImpsCuntBlock(parse);
			}
			else {
				Text.Add("<i>“Mm,”</i> licking your lips, you motion for the excited imp to lie down on his back. He complies, watching expectantly as you fondle yourself, teasing a finger inside your [anusDesc]. You get down on your knees, straddling the imp's erect member and guiding it to your ass.", parse);
			}
			Text.NL();
			
			Intro.ImpsWinRideEntrypoint();
		}, enabled : true,
		tooltip : !Intro.cuntBlocked ? "Push the imp down on his back and ride his cock." : "Knowing that the demon will probably stop you again, you might as well use your ass from the get-go."
	});
	options.push({ nameStr : "Get fucked",
		func : function() {
			Text.Clear();
			Text.Add("You step back from the eager imp's cunnilingus and twirl around. Getting down on your knees, you spread your legs, exposing your bare crotch. <i>“Come on, big boy, spear me on that impaler!”</i>", parse);
			Text.NL();
			Text.Add("The imp scrambles to his feet, practically throwing himself over you. Clawed hands grab your raised hips, and you moan lustfully as the imp's [impCockDesc] rubs against your [cuntDesc], only for him to plant it squarely against your [anusDesc].", parse);
			Text.NL();
			Text.Add("<i>“Th-the fuck do you think you are do-aah!”</i> your protest is rudely cut off by the head of the imp's cock forcing its way inside your rectum. <i>“S-sorry,”</i> the imp squeaks in an embarrassed apology. <i>“The boss won't let me use the front,”</i> he explains, shoving a few inches inside you.", parse);
			Text.NL();
			
			Sex.Anal(imp, player);
			player.FuckAnal(player.Butt(), imp.FirstCock(), 3);
			imp.Fuck(imp.FirstCock(), 3);
			
			Text.Add("Being fucked by the imp is like having an erratic rabbit humping you, no finesse or care, just pure bestial rutting. He probably will not last long at this pace, and you wonder if you are even going to get off at this rate. Without any lubricant, your stretched ass is a flare of pain, ", parse);
			if(player.Butt().capacity.Get() >= 6)
				Text.Add("though your increased capacity makes it much easier.");
			else
				Text.Add("forced open to the breaking point by the imp.");
			Text.NL();
			Text.Add("You yowl in pain as you feel the imp's already impressive [cockName] swelling inexorably, at least doubling in length and gaining considerably in girth.", parse);
			Text.NL();
			Text.Add("<b>THE SLUT CAN'T WAIT TO GET FUCKED, ASK AND YE SHALL RECEIVE,</b> the amused voice of the demon rolls over you. <i>“F-fuuuck!”</i> you groan as the imp somehow bottoms out in your butt, filling you completely. Even while growing, the imp does not slow one bit, continuing to rail you like there is no tomorrow.", parse);
			Text.NL();
			Text.Add("Pain slowly gives way to pleasure as the imp repeatedly hilts his impaler in your guts, stretching you to your limit. With a high-pitched yelp, the imp unloads inside you, painting your back passage white with unnatural amounts of warm spunk. It seemed the cursed demon increased his capacity too!", parse);
			Text.NL();
			Text.Add("You have other things to worry about, however, as the copious amounts of sperm being deposited inside you finally push you over the edge. Your arms give way, and you fall forward exhausted, dislodging the still shooting cock from your rear. Several generous servings of hot semen splatter over your back, until the imp finally gives up and drops on his back, blacked out from the biggest orgasm in his life.", parse);
			Text.NL();
			Text.Add("Sore, you massage your aching and leaking butt, grumbling a bit about those damned demons.", parse);
			Text.Flush();
			Gui.NextPrompt(Intro.DemonGift);
		}, enabled : true,
		tooltip : "Fuck this, you need to be filled, now!"
	});
	Gui.SetButtonsFromList(options);
}

Intro.ImpsWinRide = function() {
	var imp = new Imp();
	
	var parse = {
		cuntDesc    : function() { return player.FirstVag().Short(); },
		breastDesc  : function() { return player.FirstBreastRow().Short(); },
		clitDesc    : function() { return player.FirstVag().ClitShort(); },
		anusDesc    : function() { return player.Butt().AnalShort(); },
		cockDesc    : function() { return player.FirstCock().Short(); },
		//Imp
		impCockDesc : function() { return imp.FirstCock().Short(); }
	};
	
	Text.Clear();
	
	Text.Add("You walk over to one of the prone imps and prod it into a wakeful state. <i>“On your back,”</i> you imperiously order it, <i>“I have need of your cock.”</i> The imp is quick to follow your command, its [impCockDesc] rising to attention as he looks up at you expectantly.", parse);
	Text.NL();
	
	if(player.FirstVag()) {
		if(!Intro.cuntBlocked) {
			Intro.ImpsCuntBlock(parse);
		}
		else // Female repeat
			Text.Add("Knowing that the demon will just stop you if you try to use your [cuntDesc], you lower your ass down and press your other hole against the still pole the imp is presenting you with.", parse);
	}
	else {// Male
		Text.Add("Licking your lips hungrily, you give your own [cockDesc] a few strokes before lowering yourself to straddle the imp, rubbing your taint against his [impCockDesc].", parse);
	}
	Text.NL();
	
	Intro.ImpsWinRideEntrypoint();
}


Intro.ImpsWinRideEntrypoint = function() {
	var imp = new Imp();
	
	var parse = {
		cuntDesc    : function() { return player.FirstVag().Short(); },
		breastDesc  : function() { return player.FirstBreastRow().Short(); },
		clitDesc    : function() { return player.FirstVag().ClitShort(); },
		anusDesc    : function() { return player.Butt().AnalShort(); },
		cockDesc    : function() { return player.FirstCock().Short(); },
		//Imp
		impCockDesc : function() { return imp.FirstCock().Short(); }
	};
	
	Text.Add("You slowly spear yourself on the imp's [impCockDesc], groaning as the thick member forces your anal tunnel open. Not wishing to make it needlessly painful, you take some time growing used to his girth before starting to move. That was your plan, anyway, but the imp immediately starts bucking his hips wildly, somehow managing to hilt himself inside you within moments.", parse);
	Text.NL();
	
	Sex.Anal(imp, player);
	player.FuckAnal(player.Butt(), imp.FirstCock(), 3);
	imp.Fuck(imp.FirstCock(), 3);
	
	Text.Add("<i>“Why you little-”</i> you pull yourself off the panting imp, but something makes you lose your footing, causing you to fall on your butt. This, in turn, fills said butt with several inches of imp cock. Once you have regained your composure, you find that you are now comfortable taking his cock this way. Might as well make the best of it.", parse);
	Text.NL();
	Text.Add("Planting your hands on the ground behind you, you start to repeatedly drive the imp's cock into your butt, attempting to match your rhythm to your partners frenzied rutting.");
	if(player.FirstCock())
		Text.Add(" Your [cockDesc] is bucking wildly, dripping pre all over the creature, and a tightening in your scrotum tells you that you are not far from your peak.", parse);
	if(player.FirstVag())
		Text.Add(" Even untouched, your [cuntDesc] is flowing with feminine juices, itching for release.", parse);
	Text.NL();
	Text.Add("A slight twitch and a loud yelp is all the warning you get before your ass is flooded with hot imp-sperm. Shuddering, you collapse on top of your diminutive lover, ");
	if(player.FirstCock())
		Text.Add("your own [cockDesc] unloading across his stomach.", parse);
	else
		Text.Add("squashing the imp's head with your [breastDesc].", parse);
	Text.NL();
	Text.Add("Once you have recovered, you gather yourself up, leaking seminal fluids.", parse);
	
	Text.Flush();
	Gui.NextPrompt(Intro.DemonGift);
}

Intro.ImpsWinGroup = function() {
	var imp = new Imp();
	
	var parse = {
		cuntDesc    : function() { return player.FirstVag().Short(); },
		breastDesc  : function() { return player.FirstBreastRow().Short(); },
		clitDesc    : function() { return player.FirstVag().ClitShort(); },
		anusDesc    : function() { return player.Butt().AnalShort(); },
		cockDesc    : function() { return player.FirstCock().Short(); },
		//Imp
		impCockDesc : function() { return imp.FirstCock().Short(); },
		
		another     : (player.Gender() == Gender.male) ? "a" : "another"
	};
	
	Text.Clear();
	Text.Add("<i>“All right, boys! Time to wake up!”</i> The groaning imps, still sore from your fight, quickly perk up when they realize your intentions. They all gather around you, cocks quickly stiffening.");
	Text.NL();
	
	// Male/female split
	if(player.Gender() == Gender.male) {
		Text.Add("<i>“You, on all fours,”</i> you point to one of the imps, grinning widely. The chosen imp whimpers, but complies with your order, drawing amused snickers from the other imps. They quickly quiet down when you add, <i>“And you two, get my cock ready.”</i>", parse);
		Text.NL();
		Text.Add("The two reluctant imps take turns sucking your [cockDesc], coating it with saliva, preparing it for penetration. Enjoying your power over the defeated imps, you lick a few of your fingers and grab hold of the prone imp in front of you, shoving three fingers up to the knuckles in his butt.", parse);
		Text.NL();
		Text.Add("<i>“Enough,”</i> you call off your two cocksuckers, waving them to the side. <i>“Mm... prepare for penetration!”</i> You firmly grab the butt cheeks of the imp beneath you, shoving your [cockDesc] deep inside the imp slut. The other imps stand to one side, uncertainly stroking themselves while you rail their buddy, not sure if you are going to use them next. Pausing your thrusts momentarily, you look at them, annoyed. <i>“Well, what are you waiting for?”</i> You slap your own rear meaningfully.", parse);
		Text.NL();
		Text.Add("The two have a brief scuffle about who gets to go first - apparently ending in a draw - as you soon feel one of them jump on top of your back, pushing you down on the ground, while the other positions himself behind you. Not one, but two fat imp cocks prod at your [anusDesc], insistently demanding entry.", parse);
		Text.NL();
		Text.Add("Soon, your four-man contraption is rocking steadily, your twitching [cockDesc] buried deep inside the imp in front of you while the two imps sharing your ass alternate their thrusts.", parse);
		Text.NL();
		
		Sex.Anal(player, imp);
		imp.FuckAnal(imp.Butt(), player.FirstCock(), 2);
		player.Fuck(player.FirstCock(), 2);
	}
	else // female
	{
		Text.Add("<i>“I want you to fuck me, all of you!”</i> Getting down on your knees, you motion to them seductively. The imps share excited glances and quickly crowd in around you, providing you with plenty of cocks to suck.", parse);
		Text.NL();
		Text.Add("Once the imps have been suitably lathered up, you drag one of them down and straddle him in a sixty-nine position, continuing to work on his cock with your [breastDesc]. The remaining two imps have a brief scuffle about who gets to go first - apparently ending in a draw - as you soon feel one of them jump on top of your back, while the other positions himself behind you. Not one, but two fat imp cocks prod at your [anusDesc], insistently demanding entry.", parse);
		Text.NL();
		Text.Add("Moaning happily around your imp popsicle, you reach back and spread your cheeks wider, trying to accommodate the twin cocks stuffing your [anusDesc]. Meanwhile, the imp underneath you is working at your [cuntDesc], licking and lapping obediently.", parse);
		Text.NL();
	}
	
	Sex.Anal(imp, player);
	player.FuckAnal(player.Butt(), imp.FirstCock(), 2);
	imp.Fuck(imp.FirstCock(), 2);
	
	Text.Add("The writhing mass of flesh soon gets more additions, as you find additional imps closing in around you - surely they were not this many? - one taking position in front of you, presenting you with [another] cock to suck. Two more gather on your sides, and you grab their cocks, stroking them furiously.", parse);
	Text.NL();
	
	// Male/female split
	if(player.Gender() == Gender.male)
		Text.Add("You can feel your release building up, as your [cockDesc] excitedly twitches, pumping the imp at the end of the butt-fuck train full of sticky spunk.", parse);
	else // female
		Text.Add("The multiple penetration finally becomes too much for you, and you buck your hips into the face of the imp buried in your crotch, dripping the juices from your release all over him.", parse);
		
	Text.NL();
	Text.Add("The two imps sharing your [anusDesc] change their rhythm subtly, so that instead of alternating, they are thrusting into you at the same time. Thankfully, they do not last long, soon pouring their corrupted seed into your stomach.", parse);
	Text.NL();
	Text.Add("To top off your little orgy, the remaining imps gather around you, jerking themselves off and covering every part of you in white, sticky fluids. It would probably be best to get cleaned up before moving on.", parse);
	Text.Flush();
	
	//[Yourself][Imp]
	var options = new Array();
	options.push({ nameStr : "Yourself",
		func : function() {
			Text.Clear();
			Text.Add("Methodically, you start the process of getting yourself cleaned up, using your tongue to gather up the largest wads of spunk from your body. You are slightly impeded by one of the imps deciding to have a round two, ruining most of your work so far, but eventually you manage to get yourself cleaned up.");
			Text.Flush();
			Gui.NextPrompt(Intro.DemonGift);
		}, enabled : true,
		tooltip : "Try to lick as much of that delicious cum from your body as you can."
	});
	options.push({ nameStr : "Imp",
		func : function() {
			Text.Clear();
			Text.Add("<i>“You got me messed up like this,”</i> you complain to the tired imps around you, <i>“you get to clean me up!”</i> The dismayed protests of the imps are quickly cut off by threatening to beat them up again, and they dejectedly get down to business. You lean back and relax, turning around at the appropriate times to give them better access. Eventually, you are as clean as you are likely to become without taking a proper bath.");
			Text.Flush();
			Gui.NextPrompt(Intro.DemonGift);
		}, enabled : true,
		tooltip : "Why bother when you have imps to do it for you? They created this mess, after all."
	});
	Gui.SetButtonsFromList(options);
}

Intro.ImpsLossPrompt = function() {
	Text.Clear();
	
	Text.Add("You carefully approach the snickering imps, a bit daunted by their taunts. <i>“Does the little missy want another go?”</i> one of the little devils holler, making rude gestures at you.");
	Text.Flush();
	
	//[No][Oral][Get fucked]
	var options = new Array();
	options.push({ nameStr : "No",
		func : function() {
			Text.NL();
			Text.Add("You have had quite enough of <i>that</i> to last you the day. As you back away, you are hounded by their jeers, promising to give you a good time.");
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Hell no! Get away from them."
	});
	options.push({ nameStr : "Oral",
		func : Intro.ImpsLossOral, enabled : true,
		tooltip : "Pleasure some of the imps and get your filling of delicious cum."
	});
	options.push({ nameStr : "Get fucked",
		func : Intro.ImpsLossFucked , enabled : true,
		tooltip : "You need more, you need to be fucked!"
	});
	Gui.SetButtonsFromList(options);
}
			
Intro.ImpsLossOral = function() {
	var imp = new Imp();
	
	var parse = {
		cuntDesc    : function() { return player.FirstVag().Short(); },
		breastDesc  : function() { return player.FirstBreastRow().Short(); },
		clitDesc    : function() { return player.FirstVag().ClitShort(); },
		anusDesc    : function() { return player.Butt().AnalShort(); },
		cockDesc    : function() { return player.FirstCock().Short(); },
		//Imp
		impCockDesc : function() { return imp.FirstCock().Short(); }
	};
	
	Text.Clear();
	
	Text.Add("<i>“M-maybe just a little?”</i> you shuffle around uncomfortably, trying to not seem too eager but failing miserably.");
	if(player.FirstCock())
		Text.Add(" Your erect [cockDesc] give your intentions away, even if you awkwardly try to hide it.", parse);
	if(player.FirstVag())
		Text.Add(" Your wet [cuntDesc] gives your intentions away, even if you awkwardly try to hide it.", parse);
	Text.NL();
	Text.Add("<i>“Sure, why don't ya come over here and suck my dick?”</i> one of the imps taunts you, quite surprised when you shuffle over to comply. <i>“Hey, are you seeing this bitch?”</i> he chortles as you get down on your knees, planting a kiss on his hard [impCockDesc]. You go at your task with vigor, any previous embarrassment wiped away by the salty taste of imp pre-cum on your tongue.", parse);
	Text.NL();
	Text.Add("You are so focused on your task that you do not notice the other imps closing in on you, not until their cocks grind up against your face, at least, demanding attention. It is a little tricky to split your love among the three - no, five? - cocks, but you find a rhythm of alternating between sucking and stroking them.", parse);
	Text.NL();
	Text.Add("<i>“C'mon slut, you can take more!”</i> To accentuate his proclamation, one of the imps shoves another dick into your mouth, stuffing your cheeks. Sucking enthusiastically, you coax the imps toward your reward, a stomach full of tasty cock-cream.", parse);
	Text.NL();
	Text.Add("It is not long before your efforts are successful, as twin jets of white spunk fills your mouth to the brim, forcing you to swallow. Despite giving it your best, droplets are soon streaming down your cheeks, tainting your chest with pearly strands. Grunts from the surrounding imps give you fair warning of their impending orgasms, and you close your eyes blissfully, happily receiving your cum-shower.", parse);
	Text.NL();
	Text.Add("<i>“You are pretty good for a slut!”</i> one of the imps praises you, <i>“Come back later and we'll fuck ya good!”</i> Wiping the sticky fluids from your skin and hair, you gather up your possessions.", parse);
	
	Sex.Blowjob(player, imp);
	player.FuckOral(player.Mouth(), imp.FirstCock(), 2);
	imp.Fuck(imp.FirstCock(), 2);
	
	Text.Flush();
	Gui.NextPrompt(Intro.DemonGift);
}

Intro.ImpsLossFucked = function() {
	var imp = new Imp();
	
	var parse = {
		cuntDesc    : function() { return player.FirstVag().Short(); },
		breastDesc  : function() { return player.FirstBreastRow().Short(); },
		clitDesc    : function() { return player.FirstVag().ClitShort(); },
		anusDesc    : function() { return player.Butt().AnalShort(); },
		cockDesc    : function() { return player.FirstCock().Short(); },
		//Imp
		impCockDesc : function() { return imp.FirstCock().Short(); }
	};
	
	Text.Clear();
	
	Text.Add("<i>“I... I want you to fuck me!”</i> you can hardly believe that you uttered the words yourself, but the imps are more than happy to oblige. You are quickly pushed down on all fours, held down by two imps while a third on mounts you from behind. Your request is quickly filled as the imp roughly shoves his entire length inside your [anusDesc] and begins to rut wildly.", parse);
	Text.NL();
	
	Sex.Anal(imp, player);
	player.FuckAnal(player.Butt(), imp.FirstCock(), 2);
	imp.Fuck(imp.FirstCock(), 2);
	
	if(player.FirstCock())
		Text.Add("<i>“Why ya have that pitiful little thing?”</i> the imp teases your [cockDesc] between his thrusts, <i>“Not like you ever gonna use it, here!”</i>", parse);
	else
		Text.Add("<i>“The boss won't let me use the other hole, so this one will have to do!”</i> the imp grunts.", parse);
		
	Text.NL();
	Text.Add("The imp is done sooner than you would have liked, basting your insides with sticky seminal fluids, but he is quickly replaced by another, picking up where the first left off. One after the other, the imps have a go at your poor [anusDesc], reaming you into a whimpering mess.", parse);
	Text.NL();
	Text.Add("<i>“Hey, look what the boss gave me!”</i> you dimly hear one of the imps exclaim. There is a bit of a shuffle behind you and your ass is momentarily free of imp cock, only to be stuffed with what feels like a battering ram. Damn demon! It seems like he at least doubled the length and girth of the imp's cock!", parse);
	Text.NL();
	Text.Add("Thankfully, the imp seems to last a bit shorter than the others, but he is quickly replaced by another, and then another, and then another. Somehow, each cock that pierces you feels like it is a bit bigger than the last, until you could swear that they are shoving beasts the size and girth of your arm up there.", parse);
	Text.NL();
	Text.Add("<i>“Meet the Impaler!”</i> one of the diminutive devils snickers, presenting you with a phallus so big it almost looks comical on his slight frame, if you did not know that it would soon be lodged deep in your colon. You give it a few licks, hoping the saliva will make the entry easier.", parse);
	Text.NL();
	
	Text.Add("The orgy continues, each imp now equipped with a fifteen-inch monster. ");
	if(player.FirstCock())
		Text.Add("You have lost count of how many times you have spilled your own seed on the ground, orgasm after orgasm coaxed from your brutalized prostate.");
	else
		Text.Add("Feminine juices from countless orgasms drip down your legs, mixing with the leaking seminal fluids from your ravaged [anusDesc].", parse);
	Text.Add(" Your stomach is filled to the brim with imp spunk, each new load deposited leaking out harmlessly.", parse);
	
	Text.NL();
	
	imp.FirstCock().length.base = 40;
	imp.FirstCock().thickness.base = 8;
	Sex.Anal(imp, player);
	player.FuckAnal(player.Butt(), imp.FirstCock(), 2);
	imp.Fuck(imp.FirstCock(), 2);
	
	Text.Add("Finally, you can take no more and black out, still being fucked by the frenzied imps.", parse);
	Text.NL();
	Text.Add("You wake up some time later in a pile of snoring imps. Somehow, you seem to have absorbed a ridiculous amount of cum, as your stomach is now relatively normal in size. Carefully disentangling yourself from the imps, you get up.", parse);
	
	Text.Flush();
	Gui.NextPrompt(Intro.DemonGift);
}


// Intro.timesTakenDemonGift
Intro.DemonGift = function() {
	world.TimeStep({minute: 30});
	
	// Only allow 3 times
	if(Intro.timesTakenDemonGift >= 3) {
		PrintDefaultOptions();
		return;
	}
	
	var parse = {
		msmr        : (player.Gender() == Gender.male) ? "MISTER" : "MISS",
		hisher      : (player.Gender() == Gender.male) ? "HIS" : "HER",
		cuntDesc    : function() { return player.FirstVag().Short(); },
		cockDesc    : function() { return player.FirstCock().Short(); },
		cockLen     : function() { return player.FirstCock().Desc().len; },
		breastDesc  : function() { return player.FirstBreastRow().Short(); }
	};
	
	Text.Clear();
	
	Text.Add("<b>AND SO, [msmr] HIGH AND MIGHTY GIVES IN TO [hisher] URGES,</b> the demon gloats as you gather up your possessions. Your cheeks burn slightly under the scrutinizing gaze. What business is that of his anyway!", parse);
	Text.NL();
	Text.Add("<b>HOW WOULD YOU LIKE IT IF I MADE SOME CHANGES?</b>", parse);
	Text.NL();
	Text.Flush();
	
	//[No][Big breasts][Vaginal cap][Bigger load][Larger cock][Anal cap]
	var options = new Array();
	options.push({ nameStr : "No",
		func : function() {
			Text.Add("You shake your head, refusing the demon's temptations.");
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "No way you are letting that demon play around with your parts!"
	});
	if(player.Gender() == Gender.female) {
		options.push({ nameStr : "Vaginal cap",
			func : function() {
				Text.Add("You let out a shuddering gasp as you feel your insides shift around. You feel you could probably take a lot bigger cocks now...");
				
				player.FirstVag().capacity.base++;
				
				Intro.timesTakenDemonGift++;
				
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Increasing your capacity would allow you to take even bigger dicks..."
		});
	}
	if(player.Gender() == Gender.male) {
		options.push({ nameStr : "Bigger load",
			func : function() {
				Text.Add("Before you even utter the words, you can feel your sack churning, growing larger and more virile. You are filled with an urge to deposit your seed in something, anything.");
				
				player.Balls().size.base++;
				player.Balls().cumProduction.base++;
				player.Balls().cumCap.base += 5;
				
				Intro.timesTakenDemonGift++;
				
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Cumming feels so good..."
		});
		options.push({ nameStr : "Larger cock",
			func : function() {
				player.FirstCock().thickness.base++;
				player.FirstCock().length.base += 5;
				
				Text.Add("You have hardly uttered the words before you feel your cock swell, gaining a solid two inches. Even though you just got off, your new [cockLen] long cock is stiff and aches for release.", parse);
				
				Intro.timesTakenDemonGift++;
				
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Another few inches couldn't hurt..."
		});
	}
	options.push({ nameStr : "Anal cap",
		func : function() {
			Text.Add("Groaning, you feel your insides shift around, allowing for larger things to be put in your butt!");
			
			player.Butt().capacity.base++;
			
			Intro.timesTakenDemonGift++;
			
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Increasing your capacity would allow you to take even bigger dicks..."
	});
	options.push({ nameStr : "Big breasts",
		func : function() {
			Text.Add("You moan as your chest fills out, gaining at least a few cup sizes. You carefully touch your stiff nipples; apparently they grew a bit too.");
			
			player.FirstBreastRow().size.base += 5;
			player.FirstBreastRow().nippleLength.base += 0.5;
			player.FirstBreastRow().nippleThickness.base += 0.5;
			
			Intro.timesTakenDemonGift++;
			
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : Text.Parse("You consider your [breastDesc] - a bit bigger couldn't hurt, right?", parse)
	});
	Gui.SetButtonsFromList(options);
}

export { Imp };
