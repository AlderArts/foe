/*
 * 
 * Define Kyna
 * 
 */
function Kyna(storage) {
	Entity.call(this);
	
	
	// Character stats
	this.name = "Kyna";
	
	this.avatar.combat = Images.kyna;
	
	this.maxHp.base        = 30;
	this.maxSp.base        = 40;
	this.maxLust.base      = 20;
	// Main stats
	this.strength.base     = 10;
	this.stamina.base      = 11;
	this.dexterity.base    = 22;
	this.intelligence.base = 17;
	this.spirit.base       = 19;
	this.libido.base       = 18;
	this.charisma.base     = 16;
	
	this.level = 1;
	this.sexlevel = 1;
	
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 12.5;
	this.Butt().buttSize.base = 6;
	this.body.SetRace(Race.ferret);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"]  = 0;

	if(storage) this.FromStorage(storage);
}
Kyna.prototype = new Entity();
Kyna.prototype.constructor = Kyna;

Kyna.MetFlags = {
	NotMet     : 0,
	Left       : 1,
	LentJoin   : 2,
	LentNoJoin : 3,
	Sexed      : 4
};

Kyna.prototype.FromStorage = function(storage) {
	this.Butt().virgin     = parseInt(storage.avirgin) == 1;
	this.FirstVag().virgin = parseInt(storage.virgin)  == 1;
	
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
}

Kyna.prototype.ToStorage = function() {
	var storage = {
		avirgin : this.Butt().virgin ? 1 : 0,
		virgin  : this.FirstVag().virgin ? 1 : 0
	};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	this.SaveSexStats(storage);
	
	return storage;
}

Scenes.Kyna = {};

// Schedule
Kyna.prototype.IsAtLocation = function(location) {
	return true;
}

// Party interaction
Kyna.prototype.Interact = function(switchSpot) {
	Text.Clear();
	var that = kyna;
	
	that.PrintDescription();
	
	var options = new Array();
	//Equip, stats, job, switch
	that.InteractDefault(options, switchSpot, true, true, true, true);
	
	Gui.SetButtonsFromList(options, true, PartyInteraction);
}

Scenes.Kyna.Intro = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Finding an empty table, you sit and look around at everyone in the tavern, maybe taking too long a look at some of the more pleasing patrons. Suddenly there's a loud crash as someone falls over a stool, landing on your table. As you get up to stand over the drunken and oddly clad figure slumped over the table, you judge by the body shape and the back-length, red, plaited ponytail that the person is probably female. Grabbing hold of her shoulder, you roll her over to face you.", parse);
	Text.NL();
	Text.Add("Stunned, she gathers her wits and sees you looming above her. <i>“Oh.... ’ello there, sorry bout landin’ on your table mate, but that stool came outta nowhere.”</i>", parse);
	Text.NL();
	Text.Add("Now that you can get a better look at her, you realize she’s some sort of ferret-morph, going by her appearance. Her armor is pretty cheap and simple, made up of a single leather shoulder pad and a leather belt holding her kilt and sword. She rolls to try righting herself, making the top of her kilt slip and giving you a glimpse of what look to be D-cup mounds. The drunken ferret doesn’t seem to notice that she’s giving you a free show, until you give a polite cough and motion to her chest.", parse);
	Text.NL();
	Text.Add("After sitting down at the table and covering herself up, the drunken and embarrassed ferret introduces herself. <i>“Me name’s Kyna… Moran, from the Moran clan of mercenaries. I left home to make ma name in the trade, like my dad and the others.”</i> she says proudly, trying to salvage what little remains of her spilt drink and dignity.", parse);
	Text.NL();
	Text.Add("It looks like times have not been kind to the disheveled ferret-girl sitting across from you.", parse);
	Text.NL();
	Text.Add("You ask her what happened to get her into such a sorry-looking state, pointing out that her long red ponytail has what appears to be dirt and twigs in it and that her leather armor doesn’t look like something a successful mercenary would wear.", parse);
	Text.NL();
	Text.Add("<i>“W-well... Ya see, I’ve had ta sleep rough for a bit after my last couple jobs went a bit sour, and because of a little misunderstanding, I didn’e get paid. But it’s not MY fault that the bleedin’ box ah was carryin’ fell offa cliff!”</i> she says with a sulky tone.", parse);
	Text.NL();
	Text.Add("…Is she a mercenary or a delivery girl? Curious, you ask her why she would take on such a menial job.", parse);
	Text.NL();
	Text.Add("<i>“Ah... umm... well...”</i> She stammers, while looking into her mug as if trying to find an answer. After a short, uncomfortable silence <i>“I was in bad need of the money, okay?”</i> she says quite bluntly. <i>“I’ve only had two jobs since I left home, and all the money I started with was spent on fixing things that got broken during ‘em! And when I got here ah felt like I might as well drink away the last of it... I’ll be okay sleepin’ outside again, before I go into town tomorrow.”</i>", parse);
	Text.NL();
	Text.Add("The sorry state of the unlucky merc does make you feel bad for her. But all you could really do to help her at the moment is lend her enough money for a room for the night. Then again, she is a mercenary; maybe with a little pushing she’d be willing to do some “wet” work.", parse);
	Text.Flush();
	
	//[Lend] [Sex] [Leave]
	var options = new Array();
	options.push({ nameStr : "Lend",
		func : function() {
			Text.Clear();
			Text.Add("After a bit of thought you ask Kyna how long she’s staying in the area. If she intends to stay a while, you could lend her enough money to take care of herself for a short while, so long as she pays you back. Stunned, Kyna replies, <i>“Really? Thank you! I only really need enough for the next few days and ah’ll pay ya back somehow!”</i>  she says happily. <i>“Oh I know! How’s about when I get my next contract, I ask if ah can bring you in as a partner? I-if you don’t mind doing a little work that is.”</i> she asks with a hopeful smile.", parse);
			Text.NL();
			Text.Add("How do you reply?", parse);
			Text.Flush();
			
			kyna.relation.IncreaseStat(100, 3);
			
			party.coin -= 100;
			
			Scenes.Kyna.IntroTalkedPlans  = false;
			Scenes.Kyna.IntroTalkedFamily = false;
			Scenes.Kyna.IntroTalkedLife   = false;
			
			//[Yes] [No] 
			var options = new Array();
			options.push({ nameStr : "Yes",
				func : function() {
					Text.Clear();
					Text.Add("You tell her that you don’t mind joining her on next job as a partner, but she has to remember to pay you back from the earnings. <i>“Deal!”</i> she says happily, looking on with a beaming smile as you take out the money for her room and food. After you hand her the money, making note of the amount, the smiling ferret shouts, <i>“Fantashtic!”</i> jumping up in excitement... and knocking your drinks flying across the table.", parse);
					Text.NL();
					Text.Add("<i>“Oh shite!”</i> she exclaims, looking down and mourning her fallen pint. You get the feeling that the money you just lent her won’t last very long with this ferret’s klutzy demeanour.", parse);
					Text.NL();
					Text.Add("After you and Kyna replace the lost drinks, you sit and chat with her, asking a few questions you have for her.", parse);
					Text.Flush();
					kyna.relation.IncreaseStat(100, 3);
					
					kyna.flags["Met"] = Kyna.MetFlags.LentJoin;
					
					Scenes.Kyna.IntroChatPrompt();
				}, enabled : true,
				tooltip : "Join Kyna on her next job to make sure she pays you back."
			});
			options.push({ nameStr : "No",
				func : function() {
					Text.Clear();
					Text.Add("Looking Kyna in the eye, you tell her that you don’t like the idea of having to work for money you’re owed. But you do want her to reimburse you as soon as possible. <i>“O-oh ok, well it was just an idea. It would’a been nice to have some company, is all,”</i> she says dejectedly. After handing her the money, you decide that you may as well finish your drinks and stay to talk with the klutzy ferret.", parse);
					Text.NL();
					Text.Add("Looking up from your drink, you mull over a few questions you have for her.", parse);
					Text.Flush();
					
					kyna.flags["Met"] = Kyna.MetFlags.LentNoJoin;
					
					Scenes.Kyna.IntroChatPrompt();
				}, enabled : true,
				tooltip : "Don’t join her on her next job."
			});
			Gui.SetButtonsFromList(options);
		}, enabled : party.coin >= 100,
		tooltip : "Offer money, provided she pays it back. (100 coins)"
	});
	options.push({ nameStr : "Sex",
		func : function() {
			Text.Clear();
			Text.Add("After slight pause, you ask her if she would be willing to take on a more “intimate” type of job, in exchange for enough money to look after herself for a few days. Kyna looks at you with a confused expression for a minute as she tries to figure out what you mean, and then her face drops. <i>“I-I’m a mercenary! Not a prostitute!”</i> she says to you defiantly. <i>“A-ah don’t need ta sell myself to survive!”</i> she states confidently while holding her head up, which is shortly followed by the sound of her stomach growling.", parse);
			Text.NL();
			Text.Add("Kyna’s face immediately drops again, and she buries her face in her folded arms, trying to hide it against the table. <i>“Um... I guess a meal and a decent bed would be nice. But… I dunno,”</i> she says uncertainly as she slowly looks up at you, her face wearing an increasingly embarrassed expression. After a little pushing and a quiet moment of thought, Kyna looks you in the eye and says <i>“... Okay, but nothin’... funny, and be gentle! I-I’m only doing it for the money, okay?”</i>", parse);
			Text.NL();
			Text.Add("Agreeing to her terms, you both finish your drinks and set out to complete your deal. The nervous ferret insists on getting a room, which you somewhat dubiously ask the barkeep about. He eyes the two of you knowingly, agreeing to let you rent a room. Curious, you didn’t think the Maidens’ Bane had rooms for hire.", parse);
			Text.NL();
			Text.Add("A few coins change hands - since she is the one insisting on it, you take it out of Kyna’s payment - and the two of you head up a rickety staircase. The barkeep lets you into your room - barely a storage closet with only a single bed in it. The ferret jumps onto it eagerly, lying down on her back as the bed gives off alarmed squeaks.", parse);
			Text.NL();
			Text.Add("<i>“Ohh, it’s been too long since ah slept in a proper bed,”</i> Kyna says drowsily, apparently oblivious to the poor condition of the room. No matter. The sounds of you striding over to her, your clothes dropping to the floor piece by piece, wakes her from her daze.", parse);
			Text.NL();
			Text.Add("<i>“W-well... uh, I guess you want tah get started then? So, umm... where do we start?”</i> she asks shyly, clutching her tail in her lap.", parse);
			Text.NL();
			Text.Add(player.mfFem("<i>“I’m still not sure about this; I’ve never done anythin’ like this before. Just don’t be rough with me, okay?”</i> she says shakily.", "<i>“I’m not sure about this; I don’t know if I’m into women and I’ve certainly never done anything with anyone before. So... Be careful with me... Please!”</i> she says nervously."));
			Text.NL();
			Text.Add("<b>Paid Kyna 200 coins for her services.</b>", parse);
			Text.Flush();
			
			party.coin -= 200;
			
			kyna.flags["Met"] = Kyna.MetFlags.Sexed;
			
			Scenes.Kyna.IntroSexPrompt();
		}, enabled : party.coin >= 200 && (player.FirstCock() || player.FirstVag()),
		tooltip : "Offer money for sex. (200 coins)"
	});
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			Text.Add("Even though you do feel sorry for her, you worry that getting friendly with Kyna may cause problems for you. A mercenary with a run of bad luck like her could likely draw you into a bad situation if you get too involved. You stay a little while for a drink and polite chat, before saying goodnight to the young ferret, wondering if you’ll see her again.", parse);
			Text.Flush();
			
			kyna.flags["Met"] = Kyna.MetFlags.Left;
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Leave her alone for now."
	});
	Gui.SetButtonsFromList(options);
}
			
Scenes.Kyna.IntroChatPrompt = function() {
	var parse = {
		
	};
	
	//[Her plans][Her family][Her life]
	var options = new Array();
	if(!Scenes.Kyna.IntroTalkedPlans) {
		options.push({ nameStr : "Her plans",
			func : function() {
				Text.Clear();
				Text.Add("<i>“My plans? Well, after I got here, I got a letter from ma family telling me that I might find work if I talk to a couple old contacts of theirs in town. Me dad even got me a pass to get through the gates.”</i>", parse);
				Text.NL();
				Text.Add("She smiles. <i>“With any luck ah can get a nice an easy job scoutin’ for bandits or something,”</i> she says, taking a large swig of her drink. <i>“Hopefully I’ll get enough to look after myself and cover my expenses, long as ah’ can stop every bloody thing from going wrong.”</i> She says quietly, the last part so faint you nearly didn’t hear it; her face burying itself in her mug with a solemn expression.", parse);
				Text.Flush();
				
				Scenes.Kyna.IntroTalkedPlans = true;
				
				Scenes.Kyna.IntroChatPrompt();
			}, enabled : true,
			tooltip : "Ask about what she’s planning to do now?"
		});
	}
	if(!Scenes.Kyna.IntroTalkedFamily) {
		options.push({ nameStr : "Her family",
			func : function() {
				Text.Clear();
				Text.Add("<i>“The clan? We’ve been mercenaries for as long as anyone in our family can remember, and we’ve been among the best for just about as long,”</i> she says proudly. <i>“Me dad is the clan leader at the moment; he even personally taught me how tah use my sword. He said I had the best reflexes and awareness out of everyone he’s taught,”</i> she says with a smile. Kyna begins to raise her mug to her lips when a drunken patron knocks her arm, causing her to spill most of it down her chest.", parse);
				Text.NL();
				Text.Add("<i>“Oh bollocks!”</i> she exclaims in annoyance at her mishap, reaching down to clean herself up, giving you another glimpse of her breasts in the process. You’re not entirely sure the last part of her statement was true, or if it was her father telling a few white lies to save his daughter’s self-respect.", parse);
				Text.Flush();
				
				Scenes.Kyna.IntroTalkedFamily = true;
				
				Scenes.Kyna.IntroChatPrompt();
			}, enabled : true,
			tooltip : "Ask about her and her family?"
		});
	}
	if(!Scenes.Kyna.IntroTalkedLife) {
		options.push({ nameStr : "Her life",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Not much to tell really; I grew up in my family’s stronghold. It’s a lovely place in a valley with heathlands as far as ya’ can see, and they look so beautiful in the misty mornings, ”</i> she says fondly. <i>“Dad wanted me to grow up safe after we lost my mum. So we moved in with the clan till ah got old enough to learn to fend for myself.”</i>", parse);
				Text.NL();
				Text.Add("<i>“After a while though, when I got older, ah wanted to go out and see the world, to travel and fight battles like in the stories I’d heard growin’ up. But my father wouldn’e have it. I guess he was worried I’d get hurt or something. So I snuck out one night; ah left a note to em saying I was on my way to the city looking for adventure. But my money started running out a short way into the trip. So I had to do a few jobs on the way, when I got here one of my father’s friends was already here waiting for me with a letter from him.”</i>", parse);
				Text.NL();
				Text.Add("<i>“I was half expecting he’d drag me off back to my clan, but he just made sure ah was ok, gave me the letter, and left for home,”</i> she says with a bewildered tone. <i>“When ah read the letter, my dad was… Well, more than slightly annoyed at what I’d done, but he wasn’t gonna force me to come home against my will. He said that if this was my decision, he’d respect it, as long as ah keep in touch to let em know I’m ok,”</i> Kyna says with a happy smile.", parse);
				Text.Flush();
				
				Scenes.Kyna.IntroTalkedLife = true;
				
				Scenes.Kyna.IntroChatPrompt();
			}, enabled : true,
			tooltip : "Ask about her life?"
		});
	}
	
	if(options.length == 0) {
		options.push({ nameStr : "Goodnight",
			func : function() {
				Text.Clear();
				Text.Add("Noticing how late into the night it’s getting, you decide that it may be best to say goodnight to the klutzy ferret mercenary. After you both finish your drinks, Kyna leaves to pay for her room, thanking you and smiling as she goes.", parse);
				Text.NL();
				if(kyna.flags["Met"] == Kyna.MetFlags.LentNoJoin) {
					Text.Add("<i>“I’ll be in Regard tomorrow, so come back here in a day or two and I’ll let you know how I’m gonna pay ya back.”</i> She says on her way up the stairs to her room.", parse);
				}
				else if(kyna.flags["Met"] == Kyna.MetFlags.LentJoin) {
					Text.Add("<i>“I’ve gotta talk tah me dad’s mates in Regard tomorrow. So I’ll see ya back ‘ere in a few days”</i> She says on her way up the stairs to her room.", parse);
				}
				Text.Flush();
				
				world.TimeStep({hour: 1});
				
				Gui.NextPrompt();
			}, enabled : true,
			tooltip : "Say goodnight to her."
		});
	}
	
	Gui.SetButtonsFromList(options);
}

Scenes.Kyna.IntroSexPrompt = function() {
	var cocksInVag = player.CocksThatFit(kyna.FirstVag());
	var p1Cock = player.BiggestCock(cocksInVag);
	
	var parse = {
		multiCockDesc : function() { return player.MultiCockDesc(); },
		cockDesc      : function() { return p1Cock.Short(); },
		cockTip       : function() { return p1Cock.TipShort(); },
		oneof         : player.NumCocks() > 1 ? " one of" : "",
		s             : player.NumCocks() > 1 ? "s" : "",
		notS          : player.NumCocks() > 1 ? "" : "s",
		breastDesc    : function() { return player.FirstBreastRow().Short(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		clitDesc      : function() { return player.FirstVag().ClitShort(); }
	};
	
	//[Fuck her][Scissoring][Oral][Female 69]
	var options = new Array();
	if(player.FirstCock()) {
		options.push({ nameStr : "Fuck her",
			func : function() {
				Text.Clear();
				Text.Add("You step up to Kyna and pull her into a gentle embrace, slowly locking your lips with the uneasy ferret to relax her. As she steadily calms down in your arms, you let your hands carefully pick at her clothing, undoing her armour and letting it fall to the bed. Kyna squirms slightly from the feeling of being undressed by someone else, but from how she’s getting into kissing you, it’s obvious that she is much more relaxed now.", parse);
				Text.NL();
				parse["vag"] = player.FirstVag() ? Text.Parse(" while her other hand finds and slips along your [vagDesc]", parse) : "";
				Text.Add("She slowly moves her hands up to feel your [breastDesc], and tentatively moves down until she finds[oneof] your [multiCockDesc], carefully rubbing it up and down[vag].", parse);
				Text.NL();
				Text.Add("Spurred on by her ministrations, you quickly finish undressing her, and move a step back to take in the sight of the now-nude ferret girl. You look down at her soft, furred breasts and admire them. When she moves to get comfortable, you spot a shiny glint much lower and in a very intimate place.", parse);
				Text.NL();
				Text.Add("Just above her feminine entrance is an elaborately patterned silver piercing, passing through her mons to above her clit. Kyna looks at you for a second, then follows your gaze down to her very unexpected jewelry.", parse);
				Text.NL();
				Text.Add("<i>“Oh… umm, that! I-I’ll explain that later.”</i> she says, her ears blushing brightly. Her hands renew their attention toward you, their movements increasing their efforts. You move down to kiss her again as your hands start to explore her now-naked body, tweaking her nipple with one hand, while the other goes down to cup her ass.", parse);
				Text.NL();
				Text.Add("Kyna moans softly as you play with her body, but her hands don’t let go of your [cockDesc] or cease their teasing strokes. Bringing your hand back around, you rub your fingers over her feminine entrance, slowly pushing the tip of your finger in to her dampening snatch, earning you a soft moan as her hand relinquishes its hold on your [cockDesc] as she falls back onto the bed.", parse);
				Text.NL();
				Text.Add("You gently tease her entrance with a finger for a few moments, testing her passage’s wetness, making her moan with desire. <i>“S-stop teasing me, AH! I-I can’t t-taaaAAAAAke it anymore!”</i> she pleads breathlessly.", parse);
				Text.NL();
				Text.Add("The feeling of your [cockDesc] throbbing with need is more than you can take. Relenting, you roll the horny ferret onto her hands and knees and rub the tip of your [cockDesc] against her dripping pussy. Kyna grinds her quivering opening against you, trying desperately to draw you in. Eager to get to the main event yourself, you take hold of her hips and slowly push your [cockDesc] into her.", parse);
				Text.NL();
				
				Sex.Vaginal(player, kyna);
				kyna.FuckVag(kyna.FirstVag(), p1Cock, 3);
				player.Fuck(p1Cock, 10);
				
				Text.Add("The feeling of penetrating her warm, wet, velvety folds is exquisite, until you meet some slight resistance inside her. Determined to get as much of yourself into her as you can, you push  harder, causing Kyna to cry out loud as you take her virginity. Only when your hips meet her own do you realise the gravity of your actions, making you stop for a moment to ask your partner if she is ok.", parse);
				Text.NL();
				Text.Add("<i>“I-I’m fine… J-just be a bit more gentle for a little, please.”</i> she says with an air of discomfort in her voice. Silently acknowledging her wish, you slowly pull out of her, until only the head of your cock is inside her. Kyna sighs with a sense of pleasured relief, when you re-insert yourself her sigh turns into a pained moan.", parse);
				Text.NL();
				Text.Add("You carry on drawing out your strokes at a steady pace, letting her to get used to the experience. When one of your thrusts makes her cry out higher than before, you take this as a sign that she’s getting used to being fucked, increasing your pace and making her moan even louder this time.", parse);
				Text.NL();
				Text.Add("Your rutting gradually gets faster and faster, slamming your hips into hers harder and harder as she screams to the heavens in a mix of pleasure and distress. Her first fucking has turned out to be much more intense than she might have imagined, making her juices run down her thighs in a sexual salute to your dominance of this unfortunate mercenary.", parse);
				Text.NL();
				Text.Add("The feeling of her shivering snatch on your [cockDesc], betrays her repeated orgasms as you continue to pound her senseless. Suddenly, you feel a hand on each side of your head as a pair of lips lock with yours, and a tongue forces its way in. Looking down, you realise that she has used an incredible amount of flexibility to bend backwards, all in order to kiss you out of lust.", parse);
				Text.NL();
				Text.Add("This is the last sensation you need as you slam your [cockDesc] home one last time and release your load deep into the former virgin's womb, causing her to have the largest orgasm of her life to date and pass out beneath you.", parse);
				Text.NL();
				
				world.TimeStep({hour: 1});
				var load = player.OrgasmCum();
				
				Text.Add("Exhausted yourself, you forgo pulling out, cuddle up to the sleeping ferret, and fall asleep until morning.", parse);
				Text.Flush();
				
				Gui.NextPrompt(Scenes.Kyna.IntroMorningAfter);
			}, enabled : p1Cock,
			tooltip : "Have sex with her."
		});
		options.push({ nameStr : "Blowjob",
			func : function() {
				p1Cock = player.BiggestCock();
				
				Text.Clear();
				Text.Add("Stepping forward, you close the distance between you and Kyna, bringing your [cockDesc] just in front of her face while stroking yourself with a free hand, telling her to blow you. <i>“W-Wha?”</i> She stammers nervously, <i>“I-I’ve never… It’s so... Oh f-fine!”</i> she says, resigning herself to the task as you stare down at her.", parse);
				Text.NL();
				Text.Add("<i>“But you’ll owe me for this!”</i> she states defiantly. Cautiously, Kyna edges forward and tentatively licks the head of your [cockDesc], tasting cock for the first time in her life. Grimacing slightly, she takes another lick, and then slowly takes the tip into her mouth. Sighing at the warm feeling of her mouth surrounding the [cockTip] of your cock, you put a hand on the back of her head and guide her movements along your shaft.", parse);
				Text.NL();
				
				Sex.Blowjob(kyna, player);
				kyna.FuckOral(kyna.Mouth(), p1Cock, 2);
				player.Fuck(p1Cock, 2);
				
				Text.Add("You feel the urge to ferociously rut her face, but decide that as it’s Kyna’s first blowjob, you’ll let her set her own pace. She continues to suckle on your [cockDesc], then lets out a subtle moan; perplexed, you look down and see that she’s freed herself from most of her clothes and armor. The only things covering her nimble body are a pair of panties that are quickly becoming wet as her hand rubs her pussy through them.", parse);
				Text.NL();
				Text.Add("Turning to sit on the bed, you open your legs and let Kyna access your manhood, which the now-relaxed and aroused ferret does with increased enthusiasm. Her renewed suckling on your cock makes you breathe sharply, amazed at how her attitude has changed so drastically. Every time she moans, fingers dancing between her legs, the vibrations travel along your dick, edging you closer to release and enhancing the sensations.", parse);
				Text.NL();
				Text.Add("The zeal of Kyna’s ministrations more than make up for her lack of experience, and by the sound of it, she’s even enjoying herself. Her bra and panties are missing now, letting her D-cup breasts jiggle freely each time her body shudders from the feeling of her fingers rubbing her dripping cunt. You look down at her face and notice that she’s worked herself up so much that she’s sucking on you just out of instinct, the need to taste your [cockDesc] overwhelming her.", parse);
				Text.NL();
				Text.Add("Inevitably, the sustained fellatio you’ve been receiving is too much for you to take anymore. You instinctively put a hand on the back of her head and hold her down, spraying your cum right down her gullet. Kyna immediately snaps out of her cock-induced daze, the feeling of your cum being injected into her making her gag and swallow in order to breathe. As your orgasm tapers off, you realise what you’ve done, quickly taking your hand off of Kyna’s head.", parse);
				Text.NL();
				
				world.TimeStep({hour: 1});
				var load = player.OrgasmCum();
				
				Text.Add("Springing upright, Kyna coughs several times before looking at you. <i>“YOU COULD HAVE WARNED ME!”</i> she exclaims, <i>“You almost fecking suffocated me!”</i> Coughing again, she looks down and sees her hand still gently rubbing against her feminine entrance. <i>“U-umm, could ya help me with this?”</i> she asks, looking up to see you’ve laid back on the bed, staring at her expectantly. <i>“W-what are ya oglin’ me like that for? Y-you don’t want me to… Finish meself do ya?”</i> She looks to you nervously, and you nod in reply.", parse);
				Text.NL();
				Text.Add("Sighing, she climbs up on the bed next to you and continues to rub herself in front of you. Her breathing steadily growing more ragged; her eyes close, the ferret-girl focusing on the sensations of her masturbation. Her fingers dance over her labia and clit, but she only ever lets the very tip of her fingers tease her entrance. Unable to take it anymore, you’re amazed to watch her bend right over, bringing her face level with her clit and start desperately licking it.", parse);
				Text.NL();
				Text.Add("You lie there, watching in fascination as she eats herself out, noisily lapping at her own juices while barely stopping to breathe or moan. After a few more moments, her voice rises and she flops back onto the bed and arches her back. One hand dives down to finger her clit as her orgasm washes over her body. As she comes down from her high, Kyna looks over at you with an embarrassed expression plastered over her face. <i>“That was mean… but…”</i> she tries to say, before drifting off to sleep. Covering you both with a blanket, you join her in sleep.", parse);
				Text.Flush();
				
				Gui.NextPrompt(Scenes.Kyna.IntroMorningAfter);
			}, enabled : true,
			tooltip : "Put her mouth to work."
		});
	}
	if(player.FirstVag()) {
		options.push({ nameStr : "Female 69",
			func : function() {
				Text.Clear();
				Text.Add("Gracefully walking up to the nervous ferret, you lean in and kiss her on the lips. Squeaking in shock and surprise, she falls back on to the bed, taking you with her as she goes. You break the kiss and start undressing her, making her wiggle uncomfortably, not used to doing something like this with someone else.", parse);
				Text.NL();
				Text.Add("Wiggling the last of her armor free, you sit up atop her and begin to explore her body, making her fidget nervously. The feeling of someone else’s hands roaming her furred form stimulates her body in ways she had not yet experienced. Kyna resists your actions less and less, slowly getting used to being in the arms of a stranger.", parse);
				Text.NL();
				Text.Add("Feeling that she’s more relaxed now, you grope her soft, furry D-cups. You caress them gently, tweaking her nipples and making her whimper softly while her head rolls back onto the bed. Your free hand gently slides down her silky furred, yet firmly muscled belly. Kyna gasps and looks back down at you in surprise to see your hand slowly dipping between her legs, your fingers gliding against her dampening folds.", parse);
				Text.NL();
				Text.Add("Looking up at her, you see she’s trying to hide her moans, but failing to hide the expression on her face. Smiling, you teasingly circle your fingers around her moist entrance, bringing out more sounds of excitement, when you feel something small and metallic above her clit. Inquisitively, you move down to see what it is. <i>“W-wait!”</i> she gasps desperately, her voice filled with embarrassment. Kyna’s hands grab at you in a vain effort to stop you.", parse);
				Text.NL();
				Text.Add("You’re too intrigued by your discovery to take notice, continuing down until you’re face to face with a shiny silver piercing. Passing from her mons to just above her clit, it consists of three elongated ovals overlapping in a triangle, with a single green gem in the middle.<i>“I-I can explain that!”</i> she says with embarrassment, her tail flicking up to cover her face and leaving only a pair of blushing ears poking out from behind it. Grinning to yourself, you take a slow lick from the bottom of her folds to the top, giving her clit a vigorous flick when you reach it. <i>“AH! AH! AHHHH!!!!”</i> Kyna screams into her tail, cumming hard from the teasing and her first oral encounter.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("<i>“That was fast!”</i> you say to her happily, looking at the panting ferret laid out on the bed. <i>“I… Told you… I’d never… Done that before.”</i> she puffs breathlessly. You’re happy to have introduced the young ferret to feminine pleasures, yet you can’t help but feel left out. Your nethers tingle in a heated need for release. Feeling that one good turn deserves another, you lift yourself onto the bed and position your moist womanhood above her face.", parse);
					if(player.FirstCock())
						Text.Add(" Your erect cock[s] juts[notS] out eagerly, casting a shadow on her breasts.", parse);
					Text.NL();
					Text.Add("Kyna lies there panting for a few moments longer before she stirs and notices your intimate parts hovering above her. <i>“Umm, ah dunno…”</i> she mumbles nervously. Growing impatient, you lower your dripping cunt to her mouth, insistently rubbing it against her muzzle. Getting the message, Kyna tentatively licks your folds, tasting pussy juices for the first time in her life.", parse);
					Text.NL();
					
					Sex.Cunnilingus(kyna, player);
					Sex.Cunnilingus(player, kyna);
					player.Fuck(null, 2);
					kyna.Fuck(null, 2);
					
					Text.Add("She stops for a moment, analyzing your flavor. Deciding that she needs more encouragement, you bend down and slide your tongue along her dripping pussy. Kyna gasps at the second oral assault she’s ever felt, her womanhood still quivering and sensitive from the first. You pull your face away, telling her that if she wants more, she’ll have to work harder.", parse);
					Text.NL();
					Text.Add("<i>“Ah! Oh, ohhhkaay!”</i> the ferret-girl moans again as you continue to eat her out. She breathlessly forces herself up to return your attention, breathing heavily against your opening as often as she licks. Her oral skills leave something to be desired, but you carefully guide her onto your more sensitive areas by using your fingers to target her. It’s not hard for you to reduce the young mercenary to a soppy, shivering mess instinctively nibbling on your privates.", parse);
					Text.NL();
					Text.Add("Lapping at her fountaining juices, you feel her muscles twitching more and more, getting closer and closer to her second release. You’re growing near to your climax as well, her tongue and fingers persistent at probing your depths. Sealing your lips around her clit, you tease it fiercely, bringing Kyna to a wet and heavy orgasm. Her tongue dances against your dripping muff, stroking your clit and making you squeal as you cum over Kyna’s face.", parse);
					Text.NL();
					
					world.TimeStep({hour: 1});
					var load = player.OrgasmCum();
				
					Text.Add("Exhausted, you cuddle up to the barely conscious ferret, and kiss her good night before sleeping yourself.", parse);
					Text.Flush();
					
					Gui.NextPrompt(Scenes.Kyna.IntroMorningAfter);
				});
			}, enabled : true,
			tooltip : "Eat each other out."
		});
		options.push({ nameStr : "Scissoring",
			func : function() {
				Text.Clear();
				Text.Add("Approaching Kyna, you push her down on the bed, making her squeal in surprise. Giggling to yourself, you reach for her clothes and pick them away from her body piece by piece. Kyna wiggles nervously with each item removed, but you continue until you’re left with the uneasy ferret lying naked on the bed.", parse);
				Text.NL();
				Text.Add("You plant your hands on either side of her, holding yourself closely above her, inspecting every visible inch of her svelte little body. Your eyes roam all over, from her well shaped D-cups right down to her hidden nethers, her hands covering the glistening prize protectively. <i>“U-umm, I-i’m not sure about this,”</i> she stammers, uncomfortable being naked with another woman, especially with one so close and looking at her intimate areas.", parse);
				Text.NL();
				Text.Add("Grinning inwardly, you set one of your hands upon her belly, slowly letting it feel its way up to her shivering chest. The flustered ferret cautiously shies away from your touches, only starting to relax when you grope and massage her bosom. Kyna sighs and looks at a spot on the wall, trying to think of other things. But you’ll have none of that; seating yourself atop her, you tweak and fondle her modest breasts.", parse);
				Text.NL();
				Text.Add("Your sexually unpracticed partner tries to hide her reactions, unsure about the sensations she’s feeling at the hands of another woman. Deciding that it’s time your partner joined in more, you turn her face towards you and kiss her on the lips. Squealing from surprise, she tries in vain to push you away, moving her hands from their stalwart defence of her nethers.", parse);
				Text.NL();
				Text.Add("Seizing the opportunity, you quickly slide a hand between her legs, surprising her with gentle rubs on her untouched pussy. Breaking the kiss, you give her a moment to breathe, then resume playing with her feminine parts. Her moans and writhing limbs expose the stimulation she’s feeling.", parse);
				Text.NL();
				Text.Add("The sight of her pleasured expressions makes your loins tingle with need, but Kyna seems too distracted to answer your desire. An idea pops into your head, one which you both will enjoy. Removing your hand from between her legs, Kyna looks down to see why you stopped, still panting softly, only to notice you sliding between her legs.", parse);
				Text.NL();
				Text.Add("<i>“Wha-what’re ya doing!?”</i> She asks, confused as to what you’re planning. Once you hook your leg over her, bringing your moist [vagDesc] alongside hers, your plan quickly becomes apparent. Biting her lip, she quietly moans for more while rolling her hips in an effort to entice you on.", parse);
				Text.NL();
				Text.Add("While you are surprised at her sudden burst of enthusiasm, you don’t hesitate to lower yourself onto her, grinding your pussies together eagerly. The writhing of your ferrety partner beneath you spurs you to mash your [clitDesc] against hers. With your ministrations making her scream in appreciation of the increased friction of your combined nethers, her increasing wetness lets you move your hips faster and faster against her own excited gyrations.", parse);
				Text.NL();
				Text.Add("The sounds of Kyna’s moans and screams very quickly grow to the point where you’re sure that she’s about to cum, and you want to draw out her first experience. Lifting your hips away teasingly, you look down at the panting ferret-wench who’s looking back up at you so dejectedly. <i>“WHA! wh… why did you stop!?”</i> she exclaims. <i>“I… I was… so close! Please! More!”</i> she pleads breathlessly.", parse);
				Text.NL();
				Text.Add("You tell her that she can’t cum until after you do, shaking your hips from side to side just above her own. You stroke yourself with a finger to illustrate your point.", parse);
				Text.NL();
				Text.Add("Kyna lies there looking at you for a few seconds more, then launches herself at you, flipping you onto the bed beneath her. Shocked at the ferret’s dominant actions, you have no time to try taking the top back again as she vigorously grinds against your feminine entrance. The pair of you start to moan and scream louder than before while your wet and dripping sexes slide atop each other.", parse);
				Text.NL();
				Text.Add("Knowing that she’ll likely finish first, Kyna bends practically in half to being herself face-to-face with your sex. She then proceeds to take your [clitDesc] into her mouth, gently sucking on it and flicking it with her tongue. Pinned beneath her as you are, and unable to bend in such a way, you have little choice but to lie there and suffer the whims of your flexible partner.", parse);
				Text.NL();
				Text.Add("Your cries grow louder under her attack on your nethers, very quickly approaching your climax. Hearing this, her ears perk and her lips pop off of your painfully stiff clit. But you don’t get the chance to complain, as she then grinds her clit upon yours. This final bit of stimulation causes both of you to cry out in orgasm, your back arching up in hard-fought release. Kyna, now thoroughly exhausted, flops down onto you bonelessly.", parse);
				Text.NL();

				world.TimeStep({hour: 1});				
				var load = player.OrgasmCum();
				
				Text.Add("Giggling softly, you kiss her once more, and pull the blanket up over both of you.", parse);
				Text.Flush();
				
				Gui.NextPrompt(Scenes.Kyna.IntroMorningAfter);
			}, enabled : true,
			tooltip : "Have some girl-on-girl fun with her."
		});
	}
	
	Gui.SetButtonsFromList(options);
}

Scenes.Kyna.IntroMorningAfter = function() {
	var parse = {
		skinDesc  : function() { return player.SkinDesc(); },
		armorDesc : function() { return player.ArmorDesc(); }
	};
	
	party.Sleep();
	world.StepToHour(8);
	
	Text.Clear();
	Text.Add("Feeling a brush of fur against your [skinDesc], you slowly wake from your sleep to find a furred arm draped across you. Realizing that it’s now morning and you should be moving on, you try to free yourself from the sleeping ferret. With her arm around you, that’s difficult to do without waking her.", parse);
	Text.NL();
	Text.Add("After a little wriggling, you feel like you may be able to slip out of her grasp. But, when you look at her to check if she’s still asleep, you notice she’s starting to wake up. <i>“Hmmm, so warm,”</i> she says groggily, clutching you a little tighter. Slowly it dawns on her that she’s cuddling something. She opens her eyes and sees your face right in front of hers, with an initial reaction of shock.", parse);
	Text.NL();
	Text.Add("<i>“Ah! … oh, umm. Hello.”</i> Kyna says nervously, blinking as the events of last night come back to her. <i>“Oh god… we... we did, didn’t we?!”</i> She stammers. If it wasn’t for the fur, you’d be sure she was blushing. <i>“Ah can’t believe I got so drunk I let someone talk me into… Oh god!”</i> she says to herself as her head vanishes beneath the covers. Giggling, you say good morning to her, and ask if last night was that bad.", parse);
	Text.NL();
	Text.Add("A pair of ears peek up from below the covers, shortly followed by a pair of blue eyes looking through red hair. <i>“It wasn’t… bad. But I don’t think I should have done that! I’m a merc for fuck’s sake!”</i> she states quite bluntly. You’re about to apologize, when she suddenly throws the covers up and over you, exclaiming <i>“Shite! It’s morning! I’m supposed to meet dad’s mates about that job today!”</i> as she gathers up her scattered clothes.", parse);
	Text.NL();
	Text.Add("<i>“Fuck! Where are me knickers!?”</i> she asks, annoyed. Coughing to get her attention, you hold up the requested garment. <i>“GAH! Give em here!”</i> she demands, jumping after them. Laughing, you resist for a few moments, planting a sneaky kiss on her cheek. Kyna hops back in surprise, unaware that she managed to free her panties from your grasp. After a brief pause, she comes out of her daze and starts to get dressed.", parse);
	Text.NL();
	Text.Add("You slide out of the bed and put your [armorDesc] on, occasionally looking up to watch Kyna dress. Buckling up the last straps of her armor, Kyna turns to you and says <i>“Look, I’m thankful for the money. Ah needed it, but I am goin’ tah find a job in Regard today. It’ll probably mean I’ll have to travel for a while, but I’ll be coming back here for mah pay anyway. Maybe I’ll see ya again.”</i> Nodding, you say goodbye, and she leaves you to gather the last of your gear and head out yourself.", parse);
	Text.NL();
	Text.Add("Leaving the rather questionable accommodation behind you - you’ve slept better while out in the wilds - you return down into the tavern, stretching your aching limbs.", parse);
	Text.Flush();
	
	Gui.NextPrompt();
}
