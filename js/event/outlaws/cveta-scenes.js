import { Cveta } from './cveta';
import { DateScenes } from './cveta-date';
import { WorldTime } from '../../GAME';
import { Text } from '../../text';
import { Gui } from '../../gui';
import { EncounterTable } from '../../encountertable';
import { CvetaFlags } from './cveta-flags';
import { OutlawsFlags } from './outlaws-flags';

let CvetaScenes = {
	Dates : DateScenes,
};

CvetaScenes.CampDesc = function() {
	let cveta = GAME().cveta;

	var parse = {
		
	};
	
	Text.Add("Near the back of the outlaws' camp, you can make out the modest form of Cveta's tent.", parse);
	Text.NL();
	if(!cveta.WakingTime())
		Text.Add("The tent flaps are sealed at the moment, the songstress having set with the sun.", parse);
	else if(cveta.PerformanceTime())
		Text.Add("However, you figure that Cveta will soon venture out for her twice-daily performances. It's not too late to join in if you want to listen to her play.", parse);
	else if(cveta.InTent()) {
		if(cveta.Violin())
			Text.Add("Music emanates from within, but you know that Cveta is amenable to entertaining your presence should you choose to visit.", parse);
		else
			Text.Add("Music emanates from within, and you think it best that you don't disturb Cveta at her practice.", parse);
	}
	else
		Text.Add("The tent's flaps are open, making it clear that the songstress has gone out about her daily business. Maybe you should come back later.", parse);
	Text.NL();
}

CvetaScenes.ViolinApproach = function() {
	let player = GAME().player;
	let party = GAME().party;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("As you’re making to leave from the fire pit with the rest of the outlaws, you hear light footsteps in the dirt behind you, and turn to find Cveta herself eating up the distance between the two of you in big strides - or at least, strides as big as her petite frame will allow.", parse);
	Text.NL();
	Text.Add("<i>“Excuse me, [playername]. Do you have a moment?”</i>", parse);
	Text.Flush();
	
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		func : function() {
			Text.Clear();
			Text.Add("You ask Cveta what it is she wants.", parse);
			Text.NL();
			Text.Add("<i>“I have noticed you often at my performances, [playername]; I take it you have developed an ear for my music. How would you like to help me improve on those little shows?”</i>", parse);
			Text.NL();
			Text.Add("Is she asking you to join in on her performances? Because you probably don’t have the time to-", parse);
			Text.NL();
			Text.Add("<i>“No, no,”</i> Cveta says hurriedly, waving both hands to emphasize her point. <i>“Well, that is what I get for trying to be subtle; so be it, I will not beat about the bush. I am reliably informed that there is a store in Rigard that possesses a certain instrument I wish to purchase. I have the coin, but there is a small problem…”</i>", parse);
			Text.NL();
			Text.Add("She can’t get into Rigard?", parse);
			Text.NL();
			Text.Add("<i>“Your guess is correct. I had neither a visa nor enough of a human appearance to satisfy the gate guards’ sensibilities, so I tried to persuade them to let me in.”</i>", parse);
			Text.NL();
			Text.Add("Persuade? How exactly did she attempt to “persuade” the guards? From your own experience with getting into Rigard, you know that they’re the most stubborn, hard-headed, blindly obedient-", parse);
			Text.NL();
			Text.Add("A strange look creeps into the songstress’ uncovered eye. <i>“Why, what anyone else would do, of course. I merely asked them politely if they would be so kind as to let me through, and reassured them that they probably would not get into trouble for doing so.”", parse);
			Text.NL();
			Text.Add("“It almost worked, too. They were just about to wave me through until the next shift decided they just had to come and relieve their fellows at that very moment. A matter of poor timing on my part.”</i>", parse);
			Text.NL();
			Text.Add("You frown and point out to Cveta that her story is too incredulous to be true. Why would the guards agree to let her into Rigard for no reason at all?", parse);
			Text.NL();
			Text.Add("At that question, Cveta suddenly grows serious and looks askance, seeming to shrink in on herself. <i>“[playername], since you are doing me a favor, I suppose it is only right that I tell you something about myself. A performer has to be able to read his or her audience, as you will understand. Music can work wonders - it can inflame passion or dull the senses, it can provoke or placate. This is common knowledge, and a feat any skilled bard can perform.”", parse);
			Text.NL();
			Text.Add("“However, my family has had a small gift that has been passed through the generations. The guards’ minds were weak, [playername]; their weakness of will was not their fault, but it did not serve them well. All I had to do was-”</i> the sweet song of Cveta’s voice shifts perceptibly, enough so you’re clearly aware of the discordance hidden beneath- <i><b>“-tell them that they really, really wanted to let me through, and as an extremely important and trustworthy individual, they should not doubt a single word I said.</b>”", parse);
			Text.NL();
			Text.Add("“Do you now understand how I ‘persuaded’ the guards?”</i>", parse);
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("You swallow hard, and nod.", parse);
				Text.NL();
				Text.Add("Cveta coughs to clear her throat, and her voice resumes its usual sweet demeanor. Still, she doesn’t look you in the eye. <i>“It is not a gift to be used lightly, [playername], and neither is it one to be publicized. I understand that having to continually doubt your own thoughts is a thoroughly unpleasant experience. I myself have resolved to use it sparingly, and only with good reason.”", parse);
				Text.NL();
				Text.Add("“Well. The guards were not too pleased with my actions, and declared me some sort of witch in short order. If Zenith had not been near the city on some business of his own, it is likely I would be rotting in some cell at the moment - a most daunting prospect, I am sure you can agree. Nevertheless, the fact remains that I am… what is the term for it? Persona non grata within Rigard for a while, and I need someone to run this errand for me.”", parse);
				Text.NL();
				parse["t"] = party.InParty(terry) ? ", enough to make Terry’s eyes instinctively light up at the mere sight of it" : "";
				Text.Add("“So here it is, then.”</i> Cveta reaches into her gown and draws out a sizable pouch of coin. It’s quite heavy[t], but should one really be surprised that a “princess” has money? <i>“It is my wish that you head to the merchant street within Rigard and seek out the establishment known as ‘Rintell’s’. They have in stock a Grameria violin, although the proprietor is not informed of the instrument’s true value. He will think he is getting the upper hand of the deal, while the reverse is true; pay his asking price for violin, bow and case, and return to me with them. A simple errand.”</i>", parse);
				Text.NL();
				Text.Add("It certainly sounds simple enough. You tuck away the money carefully and promise Cveta that you’ll return soon with her instrument.", parse);
				Text.NL();
				Text.Add("<i>“Please do not tarry.”</i> Cveta raises her eyes and looks quite wistful, even as she brushes past you and is on her way. <i>“It has been a while since I have had a proper violin to practice on. Good health to you, [playername], and remain safe in these troubled times. When you have it in your possession, simply come to me after one of my performances and hand it over.”</i>", parse);
				Text.Flush();
				
				party.coin += 500;
				
				cveta.flags["Met"] = CvetaFlags.Met.ViolinQ;
				
				Gui.NextPrompt();
			});
		}, enabled : true,
		tooltip : "You do have the time to hear what the songstress wants."
	});
	options.push({ nameStr : "No",
		func : function() {
			Text.Clear();
			Text.Add("You tell Cveta that you’ll be a little busy for the next few days. Is it important?", parse);
			Text.NL();
			Text.Add("<i>“Not exceedingly so,”</i> Cveta replies. <i>“But your help would be appreciated. Very well, I will ask again in a handful of days. Good health to you, [playername].”</i>", parse);
			Text.NL();
			Text.Add("With that, she turns and melds back into the departing crowd, quickly vanishing from sight.", parse);
			Text.Flush();
			cveta.violinTimer = new Time(0,0,3,0,0);
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "You’re a little busy right now. Can it wait?"
	});
	Gui.SetButtonsFromList(options, false, null);
}

CvetaScenes.ViolinPrompt = function() {
	let player = GAME().player;
	let party = GAME().party;
	let outlaws = GAME().outlaws;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("As you’re leaving the performance, you hear the sound of soft footsteps behind you and turn to find Cveta herself hurrying up to you as quickly as her short legs will carry her. The songstress has an expectant look about her, and you know what she’s going to ask even before the words are out of her beak:", parse);
	Text.NL();
	Text.Add("<i>“Did you get the violin, [playername]?”</i>", parse);
	Text.Flush();
	
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		func : function() {
			Text.Clear();
			Text.Add("She brightens immediately. <i>“You have it? Please, hand it over.”</i>", parse);
			Text.NL();
			Text.Add("Without further ado, you ease the violin, case and all, into Cveta’s gloved arms. She doesn’t seem to mind the musty smell of old leather - in fact, actively revels in the proof of its antiquity, opening the case like a child unwrapping a present, with much the same effect. With painstaking care and a little effort, she lifts the violin out of its case, cradling it like a newborn child even as she coos and fusses over it. Closing her eyes, the songstress plucks a few of the strings, listening to each note resonate softly in the air, then lets out an orgasmic sigh of pure satisfaction.", parse);
			Text.NL();
			Text.Add("<i>“It is wonderfully preserved,”</i> she says breathlessly. <i>“Oh, the strings and bow do need replacing, but I know where I can get my hands on some catgut and horsehair. With this in my hands, I can play a few more pieces at my performances; I hope you’ll show up regularly.”</i>", parse);
			Text.NL();
			Text.Add("With that, she replaces the violin in its case and leans it against a nearby tree, then looks around quickly, making sure no one’s around before fixing her gaze on you.", parse);
			Text.NL();
			Text.Add("<i>“You have done well, [playername], and ought to be rewarded.”</i>", parse);
			Text.NL();
			Text.Add("Without warning, she’s stepped forward and taken you into her embrace - or at least, as best as her tiny form can muster. You feel Cveta’s head nestling into the crook of your neck, the small mounds of her feathery breasts squashing just ", parse);
			if(player.FirstBreastRow().Size() > 3)
				Text.Add("below yours,", parse);
			else
				Text.Add("above your stomach,", parse);
			Text.Add(" and she chirps before releasing her hold on your waist and stepping back, all prim, proper and distant again. She wasn’t just warm, she was <i>extra</i> warm, and so very, very nice to touch. Why does she do so little of it?", parse);
			Text.NL();
			Text.Add("<i>“Again, thank you for the favor, [playername]. Should you need to seek me out when I am not otherwise occupied, I would be delighted to receive your presence in my tent. For now, I must attend to the hurts of this poor thing; it could do with some attention with a wine cork. Remain in good health, and until we meet again.”</i>", parse);
			Text.NL();
			Text.Add("Cveta gives you a final curtsey, then gathers her new possession into her arms and hefts it in the direction of her tent, leaving you to consider your options.", parse);
			Text.NL();
			Text.Add("<b>You may now visit Cveta in her tent, accessible from the outlaws’ camp.</b>", parse);
			Text.Flush();
			
			outlaws.relation.IncreaseStat(100, 3);
			
			cveta.relation.IncreaseStat(100, 5);
			cveta.flags["Met"] = CvetaFlags.Met.Available;
			party.Inv().RemoveItem(Items.Quest.Violin);
			
			Gui.NextPrompt();
		}, enabled : cveta.flags["Met"] >= CvetaFlags.Met.ViolinGet,
		tooltip : "Yes, you got the violin. Here it is, in all its glory."
	});
	options.push({ nameStr : "No",
		func : function() {
			Text.Clear();
			Text.Add("<i>“I see. Are the gate guards being an exceptionally noisome lot of late?”</i>", parse);
			Text.NL();
			Text.Add("It’s not that, really, you explain hurriedly. It’s just that you haven’t had the time to head out and get it. Cveta’s expression is completely calm and neutral as she listens, betraying absolutely no trace of whether she believes your words or not.", parse);
			Text.NL();
			Text.Add("<i>“Mm. Please be reminded that I would truly appreciate it if you would make haste, [playername]. It would simply not do if someone else were to come in and pick it up before you had the chance to. There are not many Grameria violins on Eden - there are some rumors that they came from other worlds, back when portals were common, but whatever their origin, they produce some of the richest music possible from a string instrument.”</i>", parse);
			Text.NL();
			Text.Add("Without waiting for a reply from you, she sweeps about and moves back into the crowd, her gown trailing behind her until it, too, vanishes from sight.", parse);
			Text.Flush();
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "You haven’t had the opportunity to enter Rigard yet and get it for her."
	});
	Gui.SetButtonsFromList(options, false, null);
}

CvetaScenes.Approach = function() {
	let player = GAME().player;
	let outlaws = GAME().outlaws;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name
	};
	
	if(outlaws.BullTowerCompleted() && !(cveta.flags["Intimate"] & CvetaFlags.Intimate.Introduced)) {
		CvetaScenes.PostBullTowerPerformance();
	}
	else if(cveta.InTent()) {
		Text.Clear();
		Text.Add("Brushing aside the flaps, you step into Cveta’s tent, leaving behind the hubbub of the rest of the outlaw camp. As always, the songstress is perched on her stool, the picture of elegant composure as she acknowledges your entrance with a dip of her head. The violin you bought for her rests in its case by her trunk, carefully sealed against dust and damp alike.", parse);
		if(cveta.BlueRoses())
			Text.Add(" A small pot with the stem cutting the two of you took from the estate sits by the tent’s entrance; the plant obviously well-cared for and wanting for nothing. It’ll be a while before it can bring forth any blossoms, but it certainly isn’t going to wither on Cveta’s watch.", parse);
		Text.NL();
		Text.Add("<i>“Welcome, [playername],”</i> she says, toning down the music from her lyre but not stopping, providing a faint musical backdrop to your conversation.", parse);
		if(cveta.Relation() >= 80)
			Text.Add(" Noticing your approach, the songstress swiftly and seamlessly changes the tune she’s playing to one she knows is better suited to your tastes.", parse);
		else if(cveta.Relation() >= 60)
			Text.Add(" The songstress raises her eyes to meet yours in acknowledgement, lingering a little longer than necessary before turning away in embarrassment.", parse);
		else if(cveta.Relation() >= 40)
			Text.Add(" The songstress raises her eyes to meet yours in acknowledgement, then bows her head once more to concentrate on her playing.", parse);
		Text.NL();
		Text.Add("<i>“What brings you here to me today?”</i>", parse);
		Text.Flush();
		
		CvetaScenes.Prompt();
	}
	else {
		Text.Clear();
		Text.Add("While Cveta isn’t in her tent at the moment, you’re pretty sure that she couldn’t have gone far. Indeed, you catch a glimpse of her signature red gown amidst the tents, and walk over to her in a few easy strides. The songstress notices your approach, and dips her head at you. <i>“[playername]. Was there something you needed?”</i>", parse);
		Text.NL();
		Text.Add("Does she have a moment? You’d like to talk to her.", parse);
		Text.NL();
		Text.Add("<i>“Not out in the open, if that is your wish.”</i> The skirts of her gown swishing, she quickly leads you back to her tent and ushers you in before heading under the shade herself. <i>“Now, was there something you needed?”</i>", parse);
		Text.Flush();
		
		CvetaScenes.Prompt();
	}
}

CvetaScenes.Prompt = function() {
	let outlaws = GAME().outlaws;
	let cveta = GAME().cveta;

	var parse = {
		
	};
	
	//[Talk][Music][Play][Leave]
	var options = new Array();
	options.push({ nameStr : "Talk",
		func : function() {
			CvetaScenes.TalkPrompt();
		}, enabled : true,
		tooltip : "Speak with Cveta. She’s not one for small talk, though."
	});
	options.push({ nameStr : "Music",
		func : function() {
			CvetaScenes.MusicPrompt();
		}, enabled : true,
		tooltip : "Have the beautiful bird give you a private performance."
	});
	options.push({ nameStr : "Play",
		func : function() {
			CvetaScenes.PlayPrompt();
		}, enabled : true,
		tooltip : "Play around with Cveta. Maybe you can break that prudish attitude of hers…"
	});
	if(cveta.flags["Music"] >= CvetaFlags.Music.Talked && cveta.flags["Bard"] < CvetaFlags.Bard.Taught && cveta.flags["Singer"] < CvetaFlags.Singer.Taught) {
		options.push({ nameStr : "Teach",
			func : function() {
				CvetaScenes.Teach();
			}, enabled : cveta.Relation() >= 25,
			tooltip : "Ask Cveta if she can teach you something of her craft."
		});
	}
	if(outlaws.BullTowerCompleted()) {
		options.push({ nameStr : "Get Intimate",
			func : function() {
				Text.Clear();
				parse["rel"] = cveta.Relation() >= 80 ? ", although you can tell she’s quite flustered at all the attention, judging from the hint of unease that’s crept into her usual composed demeanor" : "";
				Text.Add("You remember just how warm and comfortable Cveta’s body felt against yours, and are resolved to have just another taste of that delightful touch again. The songstress is still playing away, pretending not to notice your roving eyes[rel].", parse);
				Text.Flush();
				
				CvetaScenes.IntimatePrompt();
			}, enabled : true,
			tooltip : "Cveta is such a lonely bird. Things don’t need to be that way…"
		});
		
		options.push({ nameStr : "Date",
			func : CvetaScenes.Dates.Prompt, enabled : true,
			tooltip : "Ask Cveta if she’d like to go somewhere with you."
		});
	}
	
	/* TODO
	options.push({ nameStr : "name",
		func : function() {
			
		}, enabled : true,
		tooltip : ""
	});
	*/
	
	Gui.SetButtonsFromList(options, true); //TODO Leave
}

CvetaScenes.Teach = function() {
	let player = GAME().player;
	let party = GAME().party;
	let outlaws = GAME().outlaws;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name
	};
	
	var bardAvailable   = false;
	var singerAvailable = false;
	for(var i = party.Num()-1; i >= 0; i--) {
		var p = party.Get(i);
		var bard   = p.jobs["Bard"];
		var singer = p.jobs["Singer"];
		if(bard   && bard.job.Available(p))   bardAvailable = p;
		if(singer && singer.job.Available(p)) singerAvailable = p;
	}
	
	Text.Clear();
	if(singerAvailable && cveta.flags["Singer"] < CvetaFlags.Singer.Taught) {
		parse["name"] = singerAvailable.name;
		parse["poss"] = singerAvailable.possessive();
		parse = singerAvailable.ParserPronouns(parse);
		
		Text.Add("Setting down her lyre by her side, Cveta studies [name] for a good ten minutes, then brightens, her entire self perking up and becoming more animated. She’s clearly eager about this.", parse);
		Text.NL();
		Text.Add("<i>“Yes, I can definitely impart some of my knowledge on the use of voice, [playername]. It will take some time and there is much that must be learnt from personal experience after I am done, but I can certainly give instruction on the fundamentals.”</i>", parse);
		Text.NL();
		Text.Add("With that, she stands and gently corrects [poss] posture, instructing [name] to follow her in the most basic deep-breathing exercises to increase [poss] ability to hold a note. The songstress is an exacting teacher - it’s a good, long while before she’s satisfied with [hisher] form, and then she has [name] sing a few scales to better get a grip on [poss] vocal range.", parse);
		Text.NL();
		Text.Add("<i>“Well,”</i> she mutters to herself, clicking her beak. <i>“Now that I have a better idea of what I am to work with… let us see what can truly be done.”</i>", parse);
		Text.NL();
		parse["try"] = singerAvailable.plural() ? "try" : "tries";
		parse["s"]   = singerAvailable.plural() ? "" : "s";
		Text.Add("The next couple of hours are filled with her demonstrating the differences in resonance when one sings from the chest, the head, or even the nose. It’s quite a bit to swallow in one sitting, but [name] [try] to follow as best as possible. Cveta doesn’t hit, slap or strike, but the edge of disappointment in the songstress’ voice stings just as badly every time [name] fail[s] to sing on-key.", parse);
		Text.NL();
		Text.Add("<i>“Posture is important, as your voice is alive and reflects your mind and soul. Slouch and slump, and so will your voice - and more importantly, your audience. Breathe some life into those scales, [name]. I want to see you put some effort into it.”</i>", parse);
		Text.NL();
		Text.Add("Hours tick by, even as Cveta demonstrates how to practice the dynamics and agility of one’s voice, her divine soprano going from high to low and high again, entire scales and sequences of notes flowing from her beak like warm sunlight. More disappointment, more encouragement, more sips of water to soothe the throat - by the time the lessons are done, much of the day has passed.", parse);
		Text.NL();
		Text.Add("<i>“And there we have the basics. Perhaps in time, you will be able to truly control your voice and fully bring out the emotions of a song to sway your listeners, but that will be some ways down the road.”</i>", parse);
		Text.NL();
		Text.Add("Crossing the small space within the tent to her trunk, Cveta digs out a thick notebook, passing it over to [name]. <i>“Here. These are my notes from when I was a girl - everything I have taught you today may be found within its pages, plus so much more. I expect you to practice on your own and engage in much self-study if you are to make something of yourself.”", parse);
		Text.NL();
		Text.Add("<i>“Now, please leave me. You need to rest your voice, and so do I, especially when I still have to perform later. Good health, and fare well.”</i>", parse);
		Text.NL();
		Text.Add("<b>You now have access to the Singer job.</b>", parse);
		Text.Flush();
		
		cveta.flags["Singer"] = CvetaFlags.Singer.Taught;
		
		outlaws.relation.IncreaseStat(100, 2);
		
		TimeStep({hour : 8});
		Gui.NextPrompt();
	}
	else if(bardAvailable && cveta.flags["Bard"] < CvetaFlags.Bard.Taught) {
		parse["name"] = bardAvailable.name;
		parse["poss"] = bardAvailable.possessive();
		parse = bardAvailable.ParserPronouns(parse);
		
		Text.Add("At the request, Cveta stops playing and studies [name] for a good ten minutes, then brightens, nodding. She’s clearly eager about this, and more than willing to get started.", parse);
		Text.NL();
		Text.Add("<i>“It seems that you have been working hard. Since you understand the basics of harmony and rhythm, there is no need for me to go through them again and thus waste precious time. Very well, let us begin. Do understand that I am trusting you greatly by allowing you to use my instruments for these exercises.”</i>", parse);
		Text.NL();
		Text.Add("Without further ado, she crosses the space to her cot and bids [name] sit down beside her, handing over her lyre, although she’s ready to grab it should it fall. Once satisfied that nothing untoward is going to happen, she eases [name] into an easy playing position and begins her instruction.", parse);
		Text.NL();
		Text.Add("The first lessons are on coaxing notes and scales from the lyre strings, strumming out chords, and adjusting the tone of the resulting music. As always, Cveta is an exacting teacher, freely using the tone of her voice to castigate [name] for the slightest mistake, although her explanations are always detailed, and correction always swift.", parse);
		Text.NL();
		Text.Add("<i>“I understand that I have been naturally gifted and extensively trained, and thus do not expect that you arrive at my level in one short session. But please, please, I beseech you, put some effort into it.”</i>", parse);
		Text.NL();
		Text.Add("More hours pass, and finally, she appears to be content with [poss] performance, for she gestures for [name] to put away the lyre and digs about in her trunk, bringing out a handful of old sheet music, thick and clustered.", parse);
		Text.NL();
		Text.Add("<i>“You will need to know something of musical notation; it will make your life immensely easier. I do not expect you to sight-read complex pieces and then play them effortlessly in the short time we have together; however, I must grant you the basics so that you have a good foundation to build upon. Once this is achieved, then maybe you can think about instilling something other than irritation and disgust in your listeners.”</i>", parse);
		Text.NL();
		Text.Add("At last, Cveta looks somewhat content with [poss] performance, and hands over the sheet music, along with yet more notebooks from her trunk. <i>“The last of my notes from when I was younger. Since everything is safely up here - ”</i> she reaches up with a gloved hand to tap her head - <i>“I can pass these on to you. I am not entirely sure why I took them with me - out of nostalgia, perhaps - but better that they be used to benefit someone else than lie rotting amongst my possessions.", parse);
		Text.NL();
		Text.Add("“Now, if you will excuse me, this has exhausted me. Would you please show yourself out?”</i>", parse);
		Text.NL();
		Text.Add("<b>You now have access to the Bard job.</b>", parse);
		Text.Flush();
		
		cveta.flags["Bard"] = CvetaFlags.Bard.Taught;
		
		outlaws.relation.IncreaseStat(100, 2);
		
		TimeStep({hour: 8});
		Gui.NextPrompt();
	}
	else {
		Text.Add("Cveta stops playing, sets down her lyre and stares off into the distance. <i>“I’m afraid ", parse);
		if(party.Num() > 1)
			Text.Add("none of you", parse);
		else
			Text.Add("you do not", parse);
		Text.Add(" meet the prerequisites for me to usefully instruct you in what I have to teach, alas. You do not ask to run before you can walk, fly before you can glide. While I could attempt to impart my knowledge of the musical arts this very moment, I fear it would be simply met with incomprehension due to one having a poor grasp of the basics. Perhaps you could come back another time?”</i>", parse);
		Text.NL();
		Text.Add("<b>You need someone with a sense of music that is a ", parse);
		if(!singerAvailable)
			Text.Add("level 3 Courtesan", parse);
		else
			Text.Add("level 5 Courtesan and level 3 Singer", parse);
		Text.Add(" before Cveta can teach you more about music.</b>", parse);
		Text.Flush();
		
		TimeStep({minute: 5});
		
		CvetaScenes.Prompt();
	}
}

CvetaScenes.PlayPrompt = function() {
	let player = GAME().player;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("You take a long look at Cveta. The songstress is all calm and composed, distant and dignified - it’s little wonder that some might think her forever out of their reach. Not you, though.", parse);
	Text.NL();
	if(cveta.Relation() >= 60) {
		Text.Add("She tilts her head, feeling your gaze upon her form, then gives you a knowing nod as her eyes brighten a little.", parse);
		Text.NL();
	}
	Text.Add("Well, how do you want to handle your precious, petite pet today?", parse);
	Text.Flush();
	
	//[Flirt][Pet][Get Intimate][Date]
	var options = new Array();
	options.push({ nameStr : "Flirt",
		func : function() {
			Text.Clear();
			if(cveta.Relation() < 40) {
				Text.Add("The songstress looks you directly in the eye, both gaze and face as blank as a stone wall. <i>“Why yes, [playername]. I am acutely aware of the fact that I am quite a desirable specimen of beauty. After all, it is part of the image I am deliberately cultivating for my performances. It helps if the eyes are soothed in addition to the ears.”</i>", parse);
				Text.NL();
				Text.Add("Can’t she stop being so utterly serious for once? You’re trying to flirt with her, for - for Aria’s sake!", parse);
				Text.NL();
				Text.Add("<i>“Yes, I am aware that you are attempting to flatter me. You are scarcely the first to do so, after all; men and women alike have found the flimsiest of excuses to compliment me on my appearance, or on attributes which I either did not possess or should not have been immediately obvious within minutes of my meeting them. Flattery is a skill that needs to be honed, or at the very least do not make your attempts painfully obvious.”</i> She coughs daintily, rolling her eyes as she does so. <i>“You get points for effort, though. That was a better attempt than some not-quite-subtle propositions I received about court.”</i>", parse);
			}
			else if(cveta.Relation() < 70) {
				Text.Add("Cveta sighs and stops playing for a moment to bat at you with a gloved hand, but it’s a feeble, half-hearted swipe. <i>“Please, [playername]. I am acutely aware of the fact that I am, as some used to put it, ‘a pretty little thing’. I do not need reminding.”</i>", parse);
				Text.NL();
				Text.Add("She may not need reminding, but it’s fun to do just that.", parse);
				Text.NL();
				Text.Add("<i>“I am scarcely a toy for your amusement!”</i> she huffs, her vibrant feathers instinctively puffing up a little - which makes her look even <i>more</i> alluring. The whole “cute when mad” schtick may not always apply, but it certainly does in her case. A few moments pass in silence, tension palpable in the air, then she resumes playing.", parse);
				Text.NL();
				Text.Add("<i>“Look, [playername], this is awkward.”</i>", parse);
				Text.NL();
				Text.Add("You smile and feign ignorance. What is? She’s probably the only one who feels awkward about a simple compliment. Seeing as there’s nothing she can - or maybe, she wants - to do about the situation, Cveta shakes her head and resumes the little ditty she was playing.", parse);
			}
			else {
				Text.Add("Cveta fidgets uncomfortably. The large pupil of her uncovered eye darts this way and that, as if desperately seeking escape from the confines of her head; she definitely seems flightier than usual.", parse);
				Text.NL();
				Text.Add("And she missed a note. It’s barely noticeable, her fingers quickly compensating for the error, but yes, she clearly missed a note there. You <i>heard</i> it.", parse);
				Text.NL();
				Text.Add("<i>“Am I really that pleasing to the eye that you <b>must</b> comment on it, [playername]?”</i>", parse);
				Text.NL();
				Text.Add("Why yes, she is, and you say as much. There’s no shame in that any more, is there? Not since you know each other so well?", parse);
				Text.NL();
				Text.Add("Cveta doesn’t say anything, but she misses another note. And another, and another, until her music dissolves into a mess of noise and she’s forced to stop playing. Scowling at you - although you’re pretty sure there’s no true malice in the gesture - she takes a few deep breaths to calm herself, reseats her lyre upon her lap, and begins the melody anew.", parse);
				Text.NL();
				Text.Add("<i>“Please, [playername]... let us talk about something else? Please?”</i>", parse);
			}
			Text.Flush();
			
			if(cveta.flirtTimer.Expired()) {
				cveta.relation.IncreaseStat(50, 2);
				cveta.flirtTimer = new Time(0,0,0,8,0);
			}
			Gui.NextPrompt(CvetaScenes.Prompt);
		}, enabled : true,
		tooltip : "Well, why not flirt a bit with the beautiful bird?"
	});
	options.push({ nameStr : "Pet",
		func : CvetaScenes.Pet, enabled : true,
		tooltip : "Cveta’s feathers are so luxuriant, you can’t help but want to show her what a pretty petite pet she is."
	});
	/* TODO
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
	Gui.SetButtonsFromList(options, true, CvetaScenes.Prompt);
}



CvetaScenes.Pet = function() {
	let player = GAME().player;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("Eyeing Cveta’s pretty plumage and fluffy little body, you really, <i>really</i> want to touch those feathers of hers. Yes, yes, you definitely want to feel them in your fingers. What do you intend?", parse);
	Text.Flush();
	
	//[Scratch][Preen][Wings]
	var options = new Array();
	options.push({ nameStr : "Scratch",
		func : function() {
			Text.Clear();
			Text.Add("You tell Cveta that she’s been looking quite tense of late, and you’d love to help the beautiful bird work out a little stress. The songstress stops playing, but doesn’t set down her lyre and instead closes her eyes and takes a few deep breaths, the heaving of her chest noticeable from under her gown.", parse);
			Text.NL();
			Text.Add("<i>“Yes, [playername],”</i> she says after a few moments’ silence. <i>“I would appreciate that. Start with the back of my neck, please - I get so sore there.”</i>", parse);
			Text.NL();
			Text.Add("Well, since she asked so nicely, you’ll respect the lady’s wishes. Cveta bows her head as you approach, allowing you to easily reach into her wavy curtain of hair and dig deep into her feathers, past the outer guard layer and into the soft, fluffy down that lines her skin. It’s easy to guess where she must ache, at the base of her neck where it joins her spine, and your beautiful bird chirps when you begin kneading and scratching, letting you know you’ve found the right spot.", parse);
			Text.NL();
			Text.Add("<i>“Mmm… ohh,”</i> Cveta croons, her voice thick and rich as molten gold, betraying her pleasure. <i>“Your hands, [playername]... they are so warm. Back home, they say that good people have warm hands… “</i>", parse);
			Text.NL();
			Text.Add("If your hands are warm, then the songstress’ feathers are burning, smooth and silken as they slip between and beneath your fingers - you swear they glisten in what light filters into the tent. Just how does she keep it in such condition, considering that the outlaws’ camp is hardly the finest living to be had on Eden?", parse);
			Text.NL();
			Text.Add("Your thoughts are cut short by Cveta instinctively pushing back against your fingers, urging your fingers further down her back - it won’t be long until your hands are on the fabric of her gown.", parse);
			Text.NL();
			Text.Add("At last, it seems that she has enough presence of mind to set down her instrument. <i>“Do not stop, please… “</i>", parse);
			Text.NL();
			if(cveta.Relation() >= 50) {
				Text.Add("<i>“…I need someplace else scratched.”</i>", parse);
				Text.NL();
				Text.Add("As you continue to tend to the songstress, she reaches up to the satin-lined neck of her gown and picks at the buttons with her gloved hands. Bit by bit, the front of her gown gives way, revealing yet more and more of her body, the deep vermillion of her feathers paling as they approach her belly. Cveta wears no bra, the small, pert lumps of her breasts completely subsumed by her feathers; she throws upon her gown with a flourish, letting you gaze upon the gloss and shine of her glorious feathers as she settles back onto the stool.", parse);
				Text.NL();
				Text.Add("<i>“Tend to my tummy, please?”</i> she asks in a small voice. Well, what were you expecting? This <i>is</i> her, after all.", parse);
				Text.NL();
				Text.Add("Moving your fingers from the beautiful bird’s neck to her stomach, you find your hands in the softest, most delectable material you’ve ever felt - well, maybe not ever, but it comes pretty damned close. Briefly, you entertain thoughts of plucking her bare and stuffing a pillow - no, an entire mattress - with her feathers; you’d never have trouble falling asleep ever again. Cveta herself is definitely enjoying your ministrations as you continue to scratch her belly, crooning and chirping to herself, rendered speechless by sheer, simple pleasure.", parse);
				Text.NL();
				Text.Add("This goes on for a while, you playing your petite pet like a wind-up music box, finding the right places to scratch and knead that she chirps and sings just so with that beautiful voice of hers. On impulse, you work your hands through Cveta’s feathers and over her lower belly until you’re reasonably sure they’re above her womb, then press down gently. The effect is immediate, eliciting a rather undignified half-squawk, half-wail from your petite pet that isn’t one of pain.", parse);
				Text.NL();
				Text.Add("<i>“I… I think you can stop now…“</i>", parse);
				Text.NL();
			}
			Text.Add("Grinning, you give her what she wants and return to work on her neck, only this time reaching up and over to give the entirety of her head a good, lovely do-over. Her eyes closed, Cveta chirps and makes to nibble and nuzzle at your hand with her beak, savoring the last of the scratching session before sinking into her stool with a sigh, the songstress’ wings slightly splayed in an insensate stupor. Yes, she’s definitely a lot less uptight now.", parse);
			Text.NL();
			Text.Add("<i>“Thank you.”</i>", parse);
			Text.NL();
			Text.Add("No, it’s your pleasure to be able to place your hands on such fine feathers.", parse);
			Text.NL();
			Text.Add("<i>“Still, it was appreciated, [playername]. Finding someone you can trust to give you a good scratch is hard, and someone who will be discreet about it more so. I hope you can show yourself out, because-”</i> Cveta gestures at herself, ruffled all over from your fingers- <i>“I cannot be seen like this.”</i>", parse);
			Text.Flush();
			
			cveta.relation.IncreaseStat(70, 3);
			TimeStep({hour: 2});
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Give the fluffier bits of her body a good scratching. She needs to loosen up."
	});
	options.push({ nameStr : "Preen",
		func : function() {
			Text.Clear();
			Text.Add("You tell Cveta that you’d love to help her look her best for her twice-daily performances.", parse);
			Text.NL();
			Text.Add("<i>“I would like that very much, [playername],”</i> she replies, perking up immediately. <i>“Having a second pair of eyes and hands about makes it go so much more smoothly.”</i>", parse);
			Text.NL();
			Text.Add("Letting the last few notes fade away before setting down her instrument, the songstress then directs you to the trunk at the foot of her cot. Held within are a number of personal possessions and knick-knacks, but it’s a long-handled comb and brush that she directs your attention to - exquisite things with long handles coated with mother-of-pearl.", parse);
			Text.NL();
			Text.Add("<i>“Mementos of my previous life,”</i> she says offhandedly as she meets your questioning expression. <i>“They are ripe targets for theft, yes, but I was loath to sell them - and it is hard to get a decent brush these days.”</i>", parse);
			Text.NL();
			Text.Add("As with so many things she says, you get the feeling that there’s something more to her words - but then, it pops up often enough that there’s got to be a dud every so often, right? Shaking your head, you push that thought out of your mind and watch as Cveta sets up a small mirror on the trunk, making minute adjustments to its angle until she’s finally satisfied with her reflection.", parse);
			Text.NL();
			Text.Add("<i>“The comb, please.”</i>", parse);
			Text.NL();
			Text.Add("You hand Cveta the comb, and she stands briefly to undo the sash about her waist, letting it fall to the floor. You’re rewarded with the briefest flash of white silken panties as she loosens her skirts enough to bring out her tailfeathers, then uses her sash to cover what was just exposed. A tantalizing taste of the future, perhaps…", parse);
			Text.NL();
			Text.Add("<i>“There, you may start on my tail with the brush. No peeking any more than is absolutely necessary.”</i>", parse);
			Text.NL();
			Text.Add("You reassure Cveta that no, you’re not going to peek, even as you start the brush on the glorious plumage of the bird-morph’s tailfeathers - they’re so long that they must drag on the ground when she walks, and yet they’re clean and pristine. Does she have a pocket or fold in the inside of her skirts that keeps them off the dirt? There’s certainly enough space in the ankle-length fabric for such a thing, after all.", parse);
			Text.NL();
			Text.Add("Cveta seems entirely focused now on the task of doing her hair - as you watch, she tosses her head with a quick snap of her neck, sending the wavy waterfalls of her crimson locks loose to flow where they will, revealing her usually covered left eye. Her hair unfolds in smooth succession, reaching just below the small of her back, and she hums delightedly before gathering it in her hands and starting work with the brush. Judging by how animated she is as she admires herself in the mirror, there’s no doubt that Cveta knows she’s a pretty little lady in red, and intends to use that fact to her advantage.", parse);
			Text.NL();
			Text.Add("Time for you to get to work, too. Save for two long, stiff feathers that look like they belong more on her wings than her tail, Cveta’s tailfeathers are smooth and fluffy, the brush running through them easily without hitting any tangles. Bits of downy fluff come off on occasion as you continue to stroke away, but the songstress’ evident disinterest suggests that it’s not out of the ordinary.", parse);
			Text.NL();
			Text.Add("You’re not sure how much time passes like this, the two of you sharing a moment of silence while you work the make the beautiful bird more so. Idly, you find yourself wondering how it would be to brush the entirety of her body, and not just her tail…", parse);
			Text.NL();
			Text.Add("<i>“This will be sufficient, I believe.”</i>", parse);
			Text.NL();
			Text.Add("Snapping out of your daydream, you find the songstress putting her hair back in place, carefully shaping it with her fingers as best as she can with the aid of the mirror. She smooths it out a little, then lets her locks fall over her left eye, obscuring it from view.", parse);
			Text.NL();
			Text.Add("<i>“Wonderful, [playername]. Thank you for your help - please, leave the brush by my side, and I will deal with it once I am done. Your help has been very much appreciated, but I fear I must press upon you to show yourself out, for there is still a little more that needs to be done in preparation for this evening’s performance.”</i>", parse);
			Text.Flush();
			
			cveta.relation.IncreaseStat(70, 3);
			TimeStep({hour: 2});
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Help Cveta make sure she’s always looking regal and proper."
	});
	options.push({ nameStr : "Wings",
		func : function() {
			Text.Clear();
			if(cveta.Relation() < 50) {
				Text.Add("<i>“The offer is appreciated, but I believe that I will be fine with handling them on my own,”</i> Cveta tells you. <i>“My wings are very delicate things, as you might imagine, and quite sensitive, too. A deft touch is needed.”</i>", parse);
				Text.NL();
				Text.Add("Yeah, you can see why she’s reluctant to let you near her wings, and it’s not just because she needs them in good condition to be able to fly. Looking at the bird-morph’s wings, each and every one of her flight feathers is the rich vermillion of her body, barred with streaks of brown and tipped with a deep violet. It’s hard resist wanting to touch them, yet at the same time it seems so certain that doing so will only damage their beauty… or that you won’t be able to resist the temptation to filch a feather.", parse);
				Text.NL();
				Text.Add("<i>“Do not misconstrue my words,”</i> she says, meeting your gaze with a gentle one of her own. <i>“Having someone to deal with the locations I cannot reach would be lovely - my arms are only so long, after all - but I do not think there is anyone around whom I can trust to that degree yet.”</i>", parse);
				Text.NL();
				Text.Add("You nod, and back off. She stated as much - you’ll have to get her to trust you more before she’ll let you at her back.", parse);
				Text.Flush();
			}
			else {
				var first = cveta.flags["Wings"] == 0;
				cveta.flags["Wings"] = 1;
				
				Text.Add("Wordlessly, Cveta sets down her lyre, then rolls her shoulders a few times, loosening up her muscles before spreading her wings. There’s not enough space in the tent for her to extend them fully - they look like they might stretch about one and a half times as long as she is tall if you measured them from wingtip to wingtip, but it’s hard to be certain considering how well they can fold. Each glossy feather is a slightly darker shade of vermillion than her body is, and is barred with brown and tipped with a deep, rich violet.", parse);
				Text.NL();
				Text.Add("The songstress doesn’t complain when you unbutton her gown and ease it off her back, her wings instinctively moving in accordance with your hands as you guide them through the slits meant to accommodate them. She certainly doesn’t seem hung up about baring her top in front of you, which is probably because most of what could be seen is hidden under her lush coat of feathers. After instructing you to grab two mirrors from her trunk, she directs you in setting them up so she can see her back.", parse);
				Text.NL();
				if(first) {
					Text.Add("<i>“I presume this is your first time doing this sort of thing?”</i> Cveta asks, twisting her neck to look behind her at you.", parse);
					Text.NL();
					Text.Add("You admit that it is.", parse);
					Text.NL();
					Text.Add("<i>“Listen clearly, then. Flight feathers are very sensitive and delicate. You are not to use a brush or comb on any of them.”</i>", parse);
					Text.NL();
					Text.Add("Then how…?", parse);
					Text.NL();
					Text.Add("<i>“By hand,”</i> she replies matter-of-factly, then quickly outlines what you’re supposed to do - look for gaps in her feathers, pick out dirt, gently push back into place anything that’s misaligned, amongst a few other things. You nod, feeling reasonably secure about what you’re supposed to be doing here, and sit down on the cot behind her and set to work. Cveta watches you like a hawk for the first few minutes, then relaxes a little when you fail to make any serious mistakes.", parse);
				}
				else {
					Text.Add("You’ve done this before, and sit down on the cot to steady yourself before you get to work. Ever mindful of her appearance, Cveta watches you for a few moments, then chirps and relaxes when she’s satisfied that you remember how to go about the task.", parse);
				}
				Text.NL();
				Text.Add("Cveta’s flight feathers are long and stiff, yet smooth to the touch - your fingers glide over them as if they were oiled, and considering the soft, glossy sheen emanating from them, it wouldn’t be surprising if that happened to be the case. There isn’t much in the way of dirt or dust to pick out - as could be expected of a fastidious little thing like Cveta - but the bird-morph seems to truly enjoy someone else’s fingers in her sensitive wings.", parse);
				Text.NL();
				if(first) {
					Text.Add("Come to think of it, are they really as sensitive as she says they are? Wanting to find out, you dig your fingers a little deeper, reaching to the roots of her feathers and stroking the thin, muscular membranes beneath. The effect is immediate: a small half-gasp, half-chirp escapes Cveta’s beak, followed by a soft hum of pure contentment.", parse);
				}
				else {
					Text.Add("Knowing just what the songstress needs, you ease your fingers into her wings and begin stroking gently at the sensitive flesh beneath. Cveta hums in wordless contentment, her divine voice filling the tent’s confines as you begin to work on her flight feathers.", parse);
				}
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("You ask her if she’s enjoying herself, and she responds by arching her back into your grasp, giving you a good feel of the slight shivers running up her spine and into her wings. Now that’s definitely a yes - you’re tempted to be a little less delicate, add a little pressure here and there, but with how finely sculpted Cveta’s wings are - how great the pressures they must bear when she’s flying, and yet how easily it is for them to be broken or damaged when mishandled - the line that divides pleasure from pain is bound to be a fine one.", parse);
					Text.NL();
					Text.Add("<i>“Ah…lower, please. Lower!”</i> She’s practically begging for it, the need and desperation plain in her voice, so you give it to her good and hard, teasing the oh-so-sensitive flesh of her wings as you work. Cveta sucks in a sharp breath, her bosom visibly rising with the sheer effort of doing so, then after making a faint strangled noise in the back of her throat, lets it all out in a generous sigh, her hair falling free and cascading where it will.", parse);
					Text.NL();
					Text.Add("<i>“Ohhh…”</i>", parse);
					Text.NL();
					parse["hisher"] = player.mfFem("his", "her");
					Text.Add("At last, you think you’ve done all you can for the bird-morph, and tap her on the shoulder to let her know you’re done. Flicking open dreamy eyes that quickly snap back into focus, she studies herself in both mirrors and reaches behind her to fix a few spots you missed before turning and giving you a nod. <i>“Most satisfactory, for someone who has not been doing this for the entirety of [hisher] life.”</i>", parse);
					Text.NL();
					var inc = player.dexterity.IncreaseStat(40, 1);
					if(inc)
						Text.Add("Your fingers are aching like…well, something that aches a lot, but you have to admit, you did a good job. In fact, they’ll probably end up a little swifter and more nimble from all the exercise and contorting they’ve been through - once the soreness fades, of course.", parse);
					else
						Text.Add("Beaming, you step back and admire your handiwork. It really isn’t bad, considering how nimble your fingers were at the job. Besides, Cveta got an itch she needed scratched, so it’s all good.", parse);
					Text.NL();
					
					cveta.relation.IncreaseStat(70, 3);
					
					var wings = player.HasWings();
					
					if(wings && wings.Feathered()) {
						Text.Add("Slowly, shakily, Cveta gets up from the stool and shrugs her shoulders violently a few times, easing her wings back into their usual folded position on her back. When she’s done, she gives you and your own pair of wings an appraising look while she gathers up the top of her gown and folds it up neatly.", parse);
						Text.NL();
						Text.Add("<i>“Would you be so kind as to sit down? I wish to reciprocate the favor you have done for me.”</i>", parse);
						Text.NL();
						Text.Add("She truly means what she says - the moment you’re seated and ready, the bird-morph has you extend your wings and casts a critical eye upon them.", parse);
						Text.NL();
						Text.Add("<i>“Just what have you been getting yourself into, [playername]? No, do not tell me. I am sure you encounter all sorts of misadventures in your travels, but do remember that if you wish to actually use your power of flight in any effective capacity, you will need to keep your feathers in good condition. Please, even if you cannot get anyone else to do it for you, you can still reach behind your back a little, right?”</i>", parse);
						Text.NL();
						Text.Add("With that, she begins to work on your feathers with her nimble little fingers, doing for you what you did for her - with much greater proficiency, of course. Humming a joyous, lively tune to herself, she smooths out your feathers, sets them back in their proper places, and cleans out a good deal of wedged grime - how did that even get in there? Your wings aren’t as sensitive as Cveta’s, but it still feels good to have someone who knows what she’s doing to give them a run-through.", parse);
						Text.NL();
						Text.Add("Eventually, she’s done, and in much less time than you took, too. Stepping back from the mirrors to let you admire yourself, she beams at you, her eyes wide and bright, and you can’t deny that your wings look a great deal neater than they did before.", parse);
						Text.NL();
						cveta.relation.IncreaseStat(70, 1);
					}
					Text.Add("<i>“Well,”</i> Cveta says cheerily, putting away her top in her trunk, <i>“That is that. Please, do show yourself out when you are ready, for I am feeling somewhat…“</i> she hesitates a moment, seeking the right words. <i>“Unlike myself. Perhaps I need to lie down for a little while…”</i>", parse);
					Text.Flush();
					
					TimeStep({hour: 2});
					Gui.NextPrompt();
				});
			}
		}, enabled : true,
		tooltip : "Help Cveta take good care of those delicate and sensitive wings of hers."
	});
	Gui.SetButtonsFromList(options, false, null);
}

CvetaScenes.TalkPrompt = function() {
	let player = GAME().player;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name
	};
	
	//[Wellbeing][Chat][Herself][Back]
	var options = new Array();
	options.push({ nameStr : "Wellbeing",
		func : function() {
			Text.Clear();
			Text.Add("Cveta tilts her head slightly to the side and regards you. <i>“I am in fine health and of good disposition, [playername]. Your concern is appreciated. And do you fare well yourself?”</i>", parse);
			Text.Flush();
			
			//[Yes][No]
			var options = new Array();
			options.push({ nameStr : "Yes",
				func : function() {
					Text.Clear();
					Text.Add("You tell Cveta that things are going smoothly for you.", parse);
					Text.NL();
					Text.Add("<i>“Excellent,”</i> the songstress replies, tapping her beak. <i>”It is my hope that things continue to stay that way.”</i>", parse);
					Text.Flush();
					CvetaScenes.TalkPrompt();
				}, enabled : true,
				tooltip : "You’re doing just fine."
			});
			options.push({ nameStr : "No",
				func : function() {
					Text.Clear();
					Text.Add("You tell Cveta that you’ve seen better days.", parse);
					Text.NL();
					Text.Add("<i>“My commiserations, [playername],”</i> the songstress replies. <i>“If you need your spirits lifted, you may seek out me and my music. I would be delighted to let you listen in on my practice.”</i>", parse);
					Text.Flush();
					CvetaScenes.TalkPrompt();
				}, enabled : true,
				tooltip : "You’ve had better days."
			});
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true,
		tooltip : "Ask how Cveta is doing."
	});
	options.push({ nameStr : "Chat",
		func : function() {
			Text.Clear();
			if(cveta.Relation() < 50) {
				Text.Add("<i>“I am sorry, [playername]. I do not think very much of idle, inconsequential chatter, even if your intentions in doing so are good. Please, might we find a more serious topic of conversation?”</i>", parse);
			}
			else {
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>“I have been attempting to play nice with Maria,”</i> Cveta admits to you. <i>“Zenith believes it important that notable personages within his camp be shown to present a united front, and there is much truth in his words. The going has been slow, but we have made inroads from either side and I believe that we can meet each other in the middle, as the saying goes.”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Having a good sense for music aids immensely in playing it,”</i> Cveta tells you. <i>“I do not mean to brag, but allow me to listen to any composition a few times, and I will reproduce it for you with reasonably few errors.”</i>", parse);
					Text.NL();
					Text.Add("Any musical piece?", parse);
					Text.NL();
					Text.Add("<i>“Perhaps not any. But I have managed to passably recreate some of the symphonies played at court. I would like to believe that is an achievement of some note, especially since I only have one pair of hands and a single voice.”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Playing peasant is not something I would wish to do, as it appears to be popular for some of the nobles of Rigard. In any case, they only enjoy the relative lack of duty peasants have, and not the lack of material possessions. I would never deign to insult any of my vassals by pretending I could understand them by dressing in their clothes and making light of their struggles.”</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>“Do I ever wear anything else? Well, of course! I have in my trunk a set of attire I don when I wish to be more discreet. You do not imagine I traveled the length of the King’s Road in my gown, did you?”</i>", parse);
					Text.NL();
					Text.Add("Well, considering that it’s her… yeah, you can. It’s hard to imagine Cveta in anything <i>but</i> her trademark crimson gown. The songstress trying to be discreet? Spirits forbid!", parse);
					Text.NL();
					Text.Add("<i>“Hmph. I hope I tend to display more common sense than that.”</i>", parse);
				}, 1.0, function() { return true; });
				
				if(cveta.BlueRoses()) {
					scenes.AddEnc(function() {
						Text.Add("<i>“I miss the fruit from back home,”</i> Cveta says wistfully, her gaze distant. <i>“Delicious, delicious fruit… golden pears still wet with dew, berries that burst in the mouth and taste of the golden sun, winter melons that you could either eat raw or boil into soup. It seemed that no matter what time of year it was, there was always some delectable seasonal fruit waiting to be sampled.”</i>", parse);
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.Add("<i>“I did not leave home unprepared. It was a calculated move, planned two months in advance - stories of young people leaving home aimlessly to seek their fortunes or such rot are just that, stories, and rarely do they have good endings.”", parse);
						Text.NL();
						Text.Add("“Still, it has been harder than I expected - theory is always easier than practical - and the best laid plans of even the most meticulous mouse-morphs tend to go awry, to use the proverb. I count myself fortunate to have met Zenith.”</i>", parse);
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.Add("<i>“You have to have something to work toward, I believe. ‘Not dying’ is an essential part of life, but what do you do past that? Animals strive not to perish. Plants do the same. What is it that separates the lives of us thinking people from animals, if not an enhanced appreciation of the future?”</i>", parse);
					}, 1.0, function() { return true; });
				}
				scenes.Get();
			}
			Text.Flush();
		}, enabled : true,
		tooltip : "Just chat a bit."
	});
	options.push({ nameStr : "Herself",
		func : function() {
			Text.Clear();
			Text.Add("<i>“I see. Do be aware that while you are free to ask questions, [playername], I am equally free to attempt to evade them or refuse to answer outright.”</i>", parse);
			Text.NL();
			Text.Add("Well, at least that’s refreshingly honest.", parse);
			Text.NL();
			Text.Add("<i>“With that in mind,”</i> Cveta continues, <i>“Which issue of mine do you wish to take up?”</i>", parse);
			Text.Flush();
			
			CvetaScenes.HerselfPrompt();
		}, enabled : true,
		tooltip : "Try to get to know the songstress a little better."
	});
	Gui.SetButtonsFromList(options, true, CvetaScenes.Prompt);
}

CvetaScenes.HerselfPrompt = function() {
	let player = GAME().player;
	let party = GAME().party;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name
	};
	
	//[Outlaws][Nobility][Mandate][Past][Voice][Music]
	var options = new Array();
	options.push({ nameStr : "Outlaws",
		func : function() {
			Text.Clear();
			Text.Add("The songstress frowns at your question, moving to smooth out a few wrinkles on her faded gown. <i>“I believe I have already related this tale to you?”</i>", parse);
			Text.NL();
			if(cveta.flags["Herself"] < CvetaFlags.Herself.Outlaws)
				Text.Add("You point out to Cveta that she was quite remiss on the details that last time, when she asked you to buy a violin for her. What happened after her encounter with the gate guards?", parse);
			else
				Text.Add("You say that you’d like to hear it again. Cveta sighs, but it’s a good-natured one and she clears her throat.", parse);
			Text.NL();
			Text.Add("<i>“Well, as I told you, Zenith was passing by Rigard on his own business - we have our own ways into the city, after all - and happened to spot me in trouble. Gathering a few of his men, he created a small diversion in order to convince the guard to take their eyes off me for a moment, whereupon I - to use the common term for the action - booked it.”", parse);
			Text.NL();
			Text.Add("“I had not gotten very far back down the road, though, when he approached me, explained what he had done, and extended an invitation for me to join him here in his camp. Understand that I was not exactly in the best of situations, [playername] - one of the reasons that I risked using my voice to gain passage to Rigard was that I was running dangerously low on provisions, amongst other problems. Here was someone who had just demonstrated considerable goodwill in risking himself to help me, and the least I could do was to hear him out. It could be reasonably inferred that he was not about to do something like… hmm… hold me hostage for ransom from my father. Yes.”</i>", parse);
			Text.NL();
			Text.Add("Cveta levels her gaze at you to make sure you’re still listening, then continues. <i>“Our arrangement has worked out fairly well, [playername]. Officially, I am here so Zenith can attempt to use me to gain leverage and legitimacy with the Free Cities, as well as keeping the morale of everyone in check with a spot of entertainment. Unofficially, Zenith knows of my power to sway others with my words - he witnessed the whole spectacle at the gate, after all - and he would be a poor leader if he did not immediately recognize the value of such an asset. That, and if it ever comes to negotiation with the nobles of Rigard, it would be an asset to have someone versed in courtly manners and decorum to conduct any talks that may come to pass. The outcast nobles may rightly be seen to have conflicting interests in such a situation; best that a neutral party mediate.”</i>", parse);
			Text.NL();
			Text.Add("And her? What does she get out of this?", parse);
			Text.NL();
			Text.Add("<i>“Look about you, [playername],”</i> Cveta replies curtly, her expression growing dark. <i>“Look beyond the confines of this tent, and tell me what you see. Many of those in this camp have been thrown out of hearth and home for not being human. Of those who have broken laws, many of those laws are either cruel or frivolous. Yes, there are those who are of a more criminal disposition amongst them. No, they are not allowed to make trouble on Zenith’s watch. Ordinary people mostly want to live from day to day, [playername]. They desire for tomorrow to be the same as today, because they know that however hard today has been, they have lived through it. How poor do you imagine things must be that they take up arms in hopes of changing tomorrow?", parse);
			Text.NL();
			Text.Add("“By virtue of being of aristocratic descent, one is entrusted with a legacy, certain privileges, and duties to go with them. The nobles of Rigard have forgotten their duties to those whom they have been entrusted with stewardship over - court consists of infantile bickering and posturing instead of serious discussion over matters of economy, culture and policy. Those who should conduct themselves better engage in the sort of activities only lowlifes should stoop to. Rumors abound about the impropriety of the royal family, about the king and queen, about the royal twins running about the city causing mischief when they should be preparing for their eventual reign. Every step in the system has broken down - the king absconds from his duty to rein in wayward nobles, the nobles refuse to do anything about their underlings, and the underlings themselves turn a blind eye to rogues and ruffians in exchange for a palm greased with coin.”", parse);
			Text.NL();
			Text.Add("“They are a group of disgusting, decadent degenerates and it is only right that anyone with a shred of actual nobility should encourage them to get their act together, lest they lose even the thin facade of legitimacy they have left.”</i>", parse);
			Text.NL();
			parse["binder"] = rigard.Krawitz["F"] & Scenes.Krawitz.Flags.Binder ? " and the binder you stole - uh, found in his study. That was pretty damning of the man" : "";
			Text.Add("Well, you can’t help but admit that there was the whole matter of Lord Krawitz[binder]. Neither can you deny that the royal twins <i>are</i> running around Rigard creating mischief, and with all the new laws against non-humans in place, let alone the inane ones that apply to everyone… ", parse);
			Text.NL();
			Text.Add("Oh, and the patrol by the crossroads which seems to never be able to root out any bandits, no matter how many times they receive reports of such.", parse);
			Text.NL();
			Text.Add("<i>“Ah, if only Father were here,”</i> Cveta says with a small sniff, pulling at the neck of her gown absent-mindedly. <i>“He would outshine each and every piece of scum Rigard could throw at him, then flog them several ways in places they did not know they had before throwing them into the stocks.”</i>", parse);
			Text.Flush();
			if(cveta.flags["Herself"] < CvetaFlags.Herself.Outlaws)
				cveta.flags["Herself"] = CvetaFlags.Herself.Outlaws;
			CvetaScenes.HerselfPrompt();
		}, enabled : true,
		tooltip : "Ask her how she ended up with the outlaws."
	});
	if(cveta.flags["Herself"] >= CvetaFlags.Herself.Outlaws) {
		options.push({ nameStr : "Nobility",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Mmm…”</i> Cveta’s uncovered eye flicks this way and that. <i>“Are you sure you wish to hear my opinion on this subject, [playername]? It can get quite unorthodox.”</i>", parse);
				Text.NL();
				Text.Add("You assure her that you do want to hear it - you wouldn’t have asked otherwise, would you?", parse);
				Text.NL();
				Text.Add("<i>“Very well,”</i> she begins, easing herself into a more comfortable position on her seat. <i>“Allow me to begin with what I have already let slip. Nobility is more than just blood, [playername]. While it can tend to run in lines, there are times when it does not manifest in such illustrious families for generations at a time, yet crops up from time to time in personages unknown. It is… hard to describe, yet all who come into contact with it are immediately struck by its presence, for better or for worse.”", parse);
				Text.NL();
				Text.Add("“Zenith, as I have mentioned before, is someone who is possessed of a form of this elusive trait. It is why I am not as concerned about the true lowlifes and criminals that dot his merry band as one imagines I should be - those who can be redeemed are inspired by him to turn their lives around. Those who are set in their ways at least have their evil curtailed by his watchful eye, and are thus rendered harmless.", parse);
				Text.NL();
				Text.Add("“Contrast this with the degenerates of Rigard. For all the trappings of nobility they clothe themselves and prance around in, they are hardly given to any true elevation of the mind, body or spirit. No, one need not be perfect to be noble, but they are not merely indifferent at the negligence of their duties to their subjects, but actively revel in their ability to get away with it.”", parse);
				Text.NL();
				Text.Add("“Excuse me a moment. All this talking has made me a little thirsty.”</i> Leaning forward to reach into her trunk, Cveta pulls out a small metal canteen and unscrews the top, dipping her beak in to sip daintily at the contents.", parse);
				Text.NL();
				Text.Add("<i>“Ah. Now, where were we?", parse);
				Text.NL();
				Text.Add("“A noble soul, when given power over a lesser, does not seek to abuse that power, but uses it to guide and serve as much as a parent would a child.", parse);
				Text.NL();
				Text.Add("“A noble body, when relieved from the fear of want, does not render him or herself insensate in a gluttonous fit of hedonism as most would do, but uses the newfound time to improve on one’s faculties.”", parse);
				Text.NL();
				Text.Add("“A noble mind, possessed of the ability to perceive the truth, freely shares it with those who are not as gifted.”", parse);
				Text.NL();
				Text.Add("“My father taught me that because of who we are, what we are, we are held to a higher standard than others with greater expectations laid upon our shoulders, and to do otherwise is a betrayal of the trust people have laid in us. It is the way of the Mandate of the Spirits.”", parse);
				Text.NL();
				Text.Add("“What do you think?”</i>", parse);
				Text.Flush();
				if(cveta.flags["Herself"] < CvetaFlags.Herself.Nobility)
					cveta.flags["Herself"] = CvetaFlags.Herself.Nobility;
				
				//[Naive][Idealistic][No Comment]
				var options = new Array();
				options.push({ nameStr : "Naive",
					func : function() {
						Text.Clear();
						Text.Add("Surely, she can’t be so naive as to be blind the to the way the world really is?", parse);
						Text.NL();
						Text.Add("<i>“Of course,”</i> the songstress spits, venom twisting the music of her voice. <i>“Be a monster. It’s what everyone is doing. The beasts always win in the end anyway and only the good die young; struggle is meaningless. Only those ruthless enough to be enslaved to nothing but their will to power can claim any sort of prize.”</i> She draws a few ragged breaths to calm herself, clenches and unclenches her gloved hands. <i>“I am not unaware of stupid games of political musical chairs, [playername], considering how I was raised. Nor am I unaware of the state of affairs in which such games tend to end up. But the strange thing is that once the music stops and all the players are dragged out of the shadows with swords at their dainty necks, the degenerates bleed just as well as any other. The Mandate of the Spirits is always fulfilled, one way or another.”</i>", parse);
						Text.NL();
						Text.Add("At length, Cveta closes her eyes and holds her breath; she’s making a clear effort to calm herself. When she speaks again, her voice is flat and measured. <i>“Forgive me, [playername]. I nearly lost my composure there, a most unseemly prospect. Please, I think it best if we continued this conversation some time else. Now, away with you.”</i>", parse);
						Text.Flush();
						
						cveta.relation.DecreaseStat(0, 5);
						Gui.Callstack.pop();
						Gui.NextPrompt();
					}, enabled : true,
					tooltip : "Sounds like this bird is overly romantic… does she know the way the real world works?"
				});
				options.push({ nameStr : "Idealistic",
					func : function() {
						Text.Clear();
						Text.Add("<i>“Well, of course it is,”</i> Cveta remarks dryly. <i>“It is an ideal, and thus I do not realistically expect it to be attained by anyone without immense effort, if attaining it is possible at all. Yet all things ought to strive, [playername], and it helps and inspires when one has something in mind to strive for. Aimless wandering can hardly be expected to produce results, and time is too precious to be wasted on games of chance.”", parse);
						Text.NL();
						Text.Add("“Eden can be a harsh place, and I know my way of seeing things can be hard to swallow by those weary with the world. At least you did not insult my intelligence by suggesting I had no knowledge of the ‘real’ world, as some would put it.”</i>", parse);
						Text.NL();
						Gui.PrintDefaultOptions();
					}, enabled : true,
					tooltip : "That sounds a little idealistic."
				});
				options.push({ nameStr : "No comment",
					func : function() {
						Text.Clear();
						Text.Add("<i>“That is all right,”</i> Cveta replies. clicking her beak. <i>“The less people have to think about politics in their day-to-day lives, the better the system is working to serve them in accordance with the Mandate of the Spirits. It is like… ah, air, money, or maybe love. Perfectly unimportant when all is proper and in place, a desperately pressing need when something has gone awry.”</i>", parse);
						Text.NL();
						Gui.PrintDefaultOptions();
					}, enabled : true,
					tooltip : "You haven’t really thought about it either way."
				});
				Gui.Callstack.push(function() {
					Text.Add("<i>“Well then,”</i> Cveta says. <i>“Is there another subject you would like to explore?”</i>", parse);
					Text.Flush();
					
					CvetaScenes.HerselfPrompt();
				});
				Gui.SetButtonsFromList(options, false, null);
			}, enabled : true,
			tooltip : "Ask Cveta about her curious ideas on nobility."
		});
	}
	if(cveta.flags["Herself"] >= CvetaFlags.Herself.Nobility) {
		options.push({ nameStr : "Mandate",
			func : function() {
				Text.Clear();
				Text.Add("Cveta blinks, then composes herself. <i>“I am surprised you caught that, [playername]. The Mandate of the Spirits is but a saying from where I come from. The idea goes as such: if the monarch and aristocracy of a land rule it well and justly, their reign will be blessed with peace and prosperity.”", parse);
				Text.NL();
				Text.Add("“Conversely, once they forget their duties and descend into decadence and misrule, divine wrath will be visited upon the land in the forms of plagues, floods, droughts, demons running amok, milk turning bad, birds flying backwards, disasters natural and unnatural alike in that vein. Those are to be taken as signs that their rule is no longer legitimate, and it is time for the people to depose them and install more competent rulers in their place.”", parse);
				Text.NL();
				Text.Add("“It may not be wholly true, but the actual truth of the legend needs not have bearing on the lessons one can take away from it. Does that answer your question?”</i>", parse);
				Text.Flush();
				if(cveta.flags["Herself"] < CvetaFlags.Herself.Mandate)
					cveta.flags["Herself"] = CvetaFlags.Herself.Mandate;
				CvetaScenes.HerselfPrompt();
			}, enabled : true,
			tooltip : "What is this “Mandate of the Spirits” she speaks of?"
		});
	}
	options.push({ nameStr : "Past",
		func : function() {
			Text.Clear();
			if(cveta.Relation() < 30) {
				Text.Add("<i>“I do not wish to discuss it.”</i>", parse);
				Text.NL();
				Text.Add("Is she sure? Because-", parse);
				Text.NL();
				Text.Add("<i>“I. Do. Not. Wish. To. Discuss. It,”</i> Cveta replies once more, making sure to slowly and carefully enunciate every word. Suddenly, the hooked tip of her beak looks a lot sharper than it did a moment ago… <i>“Is it a habit of yours to ask someone to spill out the story of their life to you the moment you meet them?”</i>", parse);
				Text.NL();
				Text.Add("Actually, it <b>is</b> something you do on quite a common basis. Cveta clicks her beak in distaste, then mutters something under her breath.", parse);
				Text.NL();
				Text.Add("<i>“Well, others are others, I suppose. But please remember this, [playername]. If there is something I wish to tell you about my past, I will do so of my own accord.”</i>", parse);
			}
			else if(cveta.Relation() < 50) {
				Text.Add("The songstress mumbles and mutters at your question, voicing her displeasure. Yet by the way her uncovered eye is flicking this way and that, her suddenly soured mood doesn’t appear to be directed at you… hopefully.", parse);
				Text.NL();
				Text.Add("<i>“I miss the roses.”</i>", parse);
				Text.NL();
				Text.Add("Come again?", parse);
				Text.NL();
				Text.Add("<i>“They were all lovely, but the blue roses were the best. Not just because of their scent or appearance, but in the way they were cultivated with extreme care in order to bring out the best in them, [playername]. Cross a blue rose with another, and it is no longer blue. They represented… generations upon generations of single-minded dedication to a craft, the passing down of the proverbial torch with the trust that it would not be cast aside.”", parse);
				Text.NL();
				Text.Add("“That made them so much more than oddly-colored flowers.”</i>", parse);
			}
			else if(cveta.Relation() < 70) {
				Text.Add("<i>“I remember…”</i>", parse);
				Text.NL();
				Text.Add("Yes? What does she remember?", parse);
				Text.NL();
				Text.Add("Cveta’s gaze grows distant and glassy. <i>“I remember that Father used to take me to court. Twice every month, he would tell me to get dressed, and we would make the flight from home to the City, Father, Mother, and I. Each session lasted two days; we would stay the night in the City before flying back the next day.”", parse);
				Text.NL();
				Text.Add("“Mother did not like it; she said that court was no place for a child to be. That just made me all the more determined to get what I could out of those trips.”</i> The songstress pauses her music, idly strumming the strings of her lyre as she’s lost in thought, then starts up the tune again. <i>“We argued a lot. Most of our disagreements only ended because I did not want my voice to wear thin.”", parse);
				Text.NL();
				Text.Add("“Mother was right, though. Court is not a place for a child to be. Therefore, I could not be one while I was there. It was a lesson in and of itself, and I hope I paid enough attention.”</i>", parse);
			}
			else {
				Text.Add("<i>“Hmm…”</i>", parse);
				Text.NL();
				Text.Add("Hmm?", parse);
				Text.NL();
				Text.Add("<i>“I would not be lying if I said that some days, [playername], I am tempted to go home.”</i>", parse);
				Text.NL();
				Text.Add("Well, everyone wants to go home, that’s only natural. Even you are going to make it off Eden at some point… well, maybe. That remains to be seen.", parse);
				Text.NL();
				Text.Add("<i>“That is the problem, [playername]. Zenith’s cause is fine and noble, but some days I miss my piano. I miss Father. And I miss being where I should be, where my roots are, and where those I should be serving reside. Oh, do not get me wrong. I am not about to pack up and leave on a whim. But we all are possessed of emotions that are not entirely rational, no matter how we try to reason with them. It is not wrong… but still, one works better when both heart and mind are aligned in intent.”</i>", parse);
				Text.NL();
				Text.Add("So what’s stopping her from heading back once the whole outlaw business is concluded, anyway?", parse);
				Text.NL();
				Text.Add("<i>“Mother and I had a disagreement.”</i>", parse);
				Text.NL();
				Text.Add("A massive understatement, one presumes by the way she’s being elusive on the subject. You try and wrangle a few more details out of Cveta, but she’s clammed up and pretends not to hear your questions.", parse);
			}
			Text.NL();
			Text.Add("<i>“Now, I have said everything I desire to say,”</i> Cveta states, her voice low and very clear on the fact that she won’t be badgered on the subject. <i>“Please allow us to change the topic of conversation.”</i>", parse);
			Text.Flush();
			CvetaScenes.HerselfPrompt();
		}, enabled : true,
		tooltip : "Ask Cveta about her past."
	});
	options.push({ nameStr : "Voice",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Even I do not know much about it myself, I must confess,”</i> Cveta admits, staring into the distance past your shoulder. <i>“Father told me that it has always been in our family line, just as we have always been bird-morphs of one kind or another. Our voices manifest themselves differently in accordance to who we are - for example, one of my cousins simply commands with brute force and expects to be obeyed, while I myself prefer to be more… subtle.”</i>", parse);
			Text.NL();
			Text.Add("You nod, and urge her to continue. This is getting to be quite interesting. Although you must ask - if it started with one of her ancestors, certainly it has been watered down considerably since? After all, the main pretext for all the repressive laws against non-humans is the purity of the royal bloodline.", parse);
			if(momo.flags["Met"] >= Momo.Met.Camp)
				Text.Add(" Then there’s the matter of Momo - her draconic heritage was diluted to the point where she was the only one in a long while to manifest some of her family’s traits. Surely something like this should have happened?", parse);
			Text.NL();
			Text.Add("<i>“Like nobility, inheritance is more than simply blood. If it were, then the outlaws would not need to exist,”</i> Cveta replies. <i>“It is true that what you said should have happened, yet interestingly, it has not. Some of my ancestors have suggested that such failure of our gift to diminish itself through the generations is evidence it was a divine gift from a spirit - perhaps even the Lady Aria herself, or one of her subordinates - but where they see an avenue to puff up pompously, I see only wishful thinking. I do not countenance taking pride in non-achievements like these.”</i>", parse);
			Text.NL();
			Text.Add("And what can she do? She’s already told you about the incident with Rigard’s gate guards, and it’s not too much to imagine she uses her voice to embellish her performances, but aside from that?", parse);
			Text.NL();
			Text.Add("Cveta lowers her gaze into her lap for a moment, wringing her fingers, then shrugs, fluttering her wings in the process. <i>“Oh, why am I being reluctant about it? I have already entrusted you with so much. It is in the best interest of our mutual understanding that you know,”</i> she says, although it seems to be more to herself than to you.", parse);
			Text.NL();
			Text.Add("<i>“Very well, [playername]. First and foremost, I can sway the emotions of others, but this is hardly anything special in and of itself. Anyone skilled in the arts of oration or music can do that, and without the need for some mystical gift at that.”", parse);
			Text.NL();
			Text.Add("“The other thing I can do is tell someone they ought to do or believe something. Understand that this is not as easy as it looks, [playername]. To go against someone of strong will and firm beliefs, and make them act in a way they would not, is… well, I would not say it is impossible. Father or Mother might be able to manage it over a period of time, perhaps two months. However, I think it out of my reach until I practice some more, and I do not wish to practice frivolously.”", parse);
			Text.NL();
			Text.Add("“The unfortunate thing is, many people do not have strong wills, if only from lack of opportunity to cultivate such. And even if they did, their desires are often hidden from them, such that they often do not realize it until it is too late. A man covets his neighbor’s land and house for years while appearing respectable; a few words in the right place can awaken that desire and incite him to murder. But to turn someone against her lifelong friend is to ask the impossible.”", parse);
			Text.NL();
			Text.Add("“The gate guards on duty that day were simple creatures, [playername],”</i> Cveta muses, tapping her beak. <i>“Their purposes in life were to stuff their holes and sate their hungers, their minds full of the petty power with which they tormented those who wished entrance to Rigard. It was but a simple matter to pick them apart, make a good guess as to their innermost fears and desires, and turn those against them. They feared punishment, so I made them believe that I was an important envoy from the Free Cities, and they really, really wanted to let me through if they did not want to get into trouble.”</i>", parse);
			Text.NL();
			if(party.InParty(miranda)) {
				Text.Add("<i>“Pretty words from someone who hasn’t done a day’s work of labor in her life,”</i> Miranda mutters to herself contemptuously. You throw her a meaningful glance, silencing her.", parse);
				Text.NL();
			}
			Text.Add("Too bad the shifts just had to change at that time, eh?", parse);
			Text.NL();
			Text.Add("<i>“Just so.”</i> Cveta plucks out a sad chord from her lyre to emphasize the point. <i>“And that is all I have to tell you about my gift, [playername]. Is there anything else?”</i>", parse);
			Text.Flush();
			CvetaScenes.HerselfPrompt();
		}, enabled : true,
		tooltip : "Just what is this strange power of Cveta’s?"
	});
	options.push({ nameStr : "Music",
		func : function() {
			Text.Clear();
			
			if(cveta.flags["Music"] < CvetaFlags.Music.Talked)
				cveta.flags["Music"] = CvetaFlags.Music.Talked;
			Text.Add("Cveta doesn’t reply immediately upon hearing your question, instead half-lidding her eyes as she thinks. Slowly, she lets the current tune fade into silence and begins anew, a little ditty springing from the strings of her lyre, sharp and lively, yet with a strange yearning, a distant longing buried in the undertones, a longing for… something, but you don’t know what.", parse);
			Text.NL();
			Text.Add("Then as suddenly as it begun, the music’s mood changes in quick succession, turning hard and fast, then slowing to a sad crawl. One moment it gushes like a stream swollen with spring rain, then turns immovable, stolid, forbidding the next.", parse);
			Text.NL();
			Text.Add("This emotional play goes on for a few minutes before she finishes with a flourish, letting the last of the improvised tune sink in over a moment of silence before starting up the quiet backdrop to your conversation once more.", parse);
			Text.NL();
			Text.Add("<i>“Music is the only escape, [playername],”</i> Cveta says, and it’s a few moments before you realize that she’s actually speaking and not singing. <i>“It easily conveys meanings and messages that words have a hard time articulating. How else, after understanding this, could I not leverage my natural talents and bend them toward the practitioning of the art of music? How could I, who has had the privilege of not needing to worry where my next meal will come from, not use the opportunity to cultivate myself above and beyond the mundane?”</i>", parse);
			Text.NL();
			Text.Add("Yeah, that’s true, but at the same time, you get the sense that there’s something she’s not telling you. Knowing her, though, you won’t be wrangling it from her beak until she’s ready.", parse);
			Text.NL();
			Text.Add("<i>“What else? Mother first taught me all she knew on the subject, then Father hired the best tutors his money could purchase. The Academy of Higher Arts is a school of magical learning first and foremost, which may have explained why the few musicians present were so desperate for any sort of patron to throw a handful of coin their way.”", parse);
			Text.NL();
			Text.Add("“Given such opportunity, [playername], I worked to learn all I could. Voice, string, keyboard… I miss the deep, regal music of a proper pipe organ. Everything but wind and brass, the reason for which should be plain-”</i> she snaps her beak with an audible click- <i>“and percussion, which my small frame was not entirely suited for. It is why I keep Ernest around to play the drums where they are needed, a task he takes great joy in.”", parse);
			Text.NL();
			Text.Add("“Surprisingly, it was possible for me to make a living from music even in these times, [playername]. You might imagine that folk would save their coin for the basic necessities of life, but I discovered that people will pay dearly for a few moments’ respite from their burdens and troubles. Far from enough to live the luxuriant life I once did, but sufficient to keep myself fed and clothed without digging into my reserves.”", parse);
			Text.NL();
			Text.Add("“And that is the story of my music, [playername],”</i> Cveta finishes, bobbing her head at you. <i>“Would you like to move on from here?”</i>", parse);
			Text.Flush();
			CvetaScenes.HerselfPrompt();
		}, enabled : true,
		tooltip : "Ask Cveta about her interest in music."
	});
	Gui.SetButtonsFromList(options, true, CvetaScenes.TalkPrompt);
}

CvetaScenes.MusicPrompt = function() {
	let player = GAME().player;
	let party = GAME().party;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name,
		skinDesc : function() { return player.SkinDesc(); }
	};
	
	Text.Clear();
	Text.Add("<i>“You would like to hear me practice?”</i> the songstress says. <i>“It will not be a proper performance, just so you know. This is the time when I choose to experiment with various styles and moods, amongst other things; it is improvisation, only worse. Composition was amongst the aspects of my craft I was merely passable in, as opposed to achieving the excellence I sought.”</i>", parse);
	Text.NL();
	Text.Add("You assure Cveta that you do indeed wish to hear her play, even if it’s but at practice. What better way to gain a greater appreciation for the final product than to watch it being crafted before one’s very eyes?", parse);
	Text.NL();
	Text.Add("With great deliberation, Cveta closes her eyes, draws a breath, then opens them again. Whether it’s in response to your flattery, or if it’s just her getting ready - well, you might as well try to read a brick wall. <i>“Very well then, [playername]. What would you have me practice?”</i>", parse);
	Text.NL();
	Text.Add("<b>You will not get buffs from a private performance.</b>", parse);
	Text.Flush();
	
	//[Sing][Play Lyre][Play Violin]
	var options = new Array();
	options.push({ nameStr : "Sing",
		func : function() {
			Text.Clear();
			Text.Add("You tell Cveta that you’d like to hear her lovely voice at work.", parse);
			Text.NL();
			Text.Add("<i>“Very well. I shall acquiesce to your request - it is high time I did some voice work of my own, in any case. Please, allow me some space.”</i>", parse);
			Text.NL();
			Text.Add("You waste no time in taking a few steps back and Cveta stands, setting down her lyre on her cot before working on a few vocal exercises to warm up her voice, some familiar to you, others you don’t remember. Those take but a handful of minutes to get through, and when she’s had a moment more to collect herself and adjust her posture, the songstress parts her beak and unleashes her voice upon the confines of her tent. Without lyrics or accompaniment, the song nevertheless sweeps you along like a handful of rose petals in a gale…", parse);
			Text.NL();
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("In your mind’s eye, you envision yourself as a mighty tree, deeply rooted in the earth - perhaps even the very tree at the heart of Eden itself, strong, solid, immovable. Your bark is rough and rugged, your heartwood stronger than the finest steel. Power seeps in through your feet - no, your roots - and wells up in your body, filling you right to your crown and the tips of your branches.", parse);
				Text.NL();
				Text.Add("You know that you will not be pushed aside. It is impossible, inconceivable. You have no heart, but the flow of the sap within you is drawn from the land itself. So long as it does not fall, then neither will you.", parse);
				Text.NL();
				Text.Add("Everything that transpires in and about you does not escape your notice, from the birds nesting in your boughs to the worms that crawl about your roots. Each and every one of the tiny creatures turns to you for sustenance and shelter, and this you dole out freely, allowing the little people to partake of your boundless energy. As you, the mighty tree, shield them from the dangers they cannot face alone, so do they trust you, dedicating their lives to defending you from worm and rot.", parse);
				Text.NL();
				Text.Add("Everything is within your control, within your grasp. You shall not ask nor demand of the little creatures; you shall <i>tell</i> them what needs to be done, and they will believe as deeply as you do in your success. So long as you will it with the core of your being, failure is impossible, and reality easily shaped to your desire.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("All around you, the fragrance of scented candles, the rustle of fine silks and linens. Jasmine, lavender, oleander - sweet but not cloying, the air cool but not uncomfortably cold, just enough to encourage one to seek out the presence of another warm body.", parse);
				Text.NL();
				Text.Add("You know that this is but an illusion, that somewhere in the distance, Cveta is still singing and her song is what has brought you to this place. Is this supposed to be one of your innermost desires… or is it one of your deepest fears? Surely something this calm and pleasurable can’t be a nightmare, can it? Yet that thought is distant, you are here, and it might as well be enjoyed while it lasts, should it not?", parse);
				Text.NL();
				Text.Add("Whispers echo in the black void that surrounds you, fragments of sweet nothings that tease and tempt you just on the edge of your hearing. An invisible hand glides across your [skinDesc] - with a sudden start, you realize that you are naked - leaving a flush of decidedly arousing warmth in its wake. This is quickly followed by another, and another, and another, until you’re suffused from head to toe in growing desire, rapidly approaching release.", parse);
				Text.NL();
				Text.Add("It is then that you realize that not only are you naked, but you are decidedly lacking in genitals, nipples, or any body part capable of effecting a release, doll-like smooth skin covering those portions of your body where they should be. You have to release, have to cum the buckets - no, the barrels that your body feels like letting loose, desire fogging your mind to the point where you can’t even remember your own name, all scents and sensations narrowing down to that single point of debilitating lust-", parse);
				Text.NL();
				Text.Add("Yes, a nightmare, very much a nightmare.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("You are walking over a road of burning coals, the sheer heat rising from them enough to set the air above to wavering and shimmering. Cinders and ashes leap from the ground, throw up by the wind; you do your best to ignore them and press on.", parse);
				Text.NL();
				if(party.InParty(kiakai)) {
					parse["name"] = kiakai.name;
					parse = kiakai.ParserPronouns(parse);
					Text.Add("You are not alone, though. [name] travels down the fiery road by your side, the elf’s bare feet quickly eating up distance with nimble, graceful steps. Yet for all this, [heshe] never seems to fall ahead or behind you, instead content to press on as your companion. Every now and then, [heshe] turns to you and says something in an encouraging tone of voice, although you can’t quite make out the words.", parse);
					Text.NL();
				}
				Text.Add("Slow and steady is the way to go; that way, there’s no chance that your feet will catch painfully on the coals or trip on the uneven surface. You know that so long as you move at an even pace and do not freeze or run, the flames are powerless to hurt you. Each step must be taken carefully but without lingering.", parse);
				Text.NL();
				Text.Add("How long is the road? It stretches on forever into the distance, as far as the eye can see. To either side is a sea of blank darkness, its surface inky and promising of vast depths hidden beneath. Above you, a black sky devoid of stars or moon. No, there is nothing here to distract you. If you are burned, you have no one but yourself to blame.", parse);
				Text.NL();
				if(Math.log(player.Spi()) >= 4) {
					Text.Add("How far do you travel? Without landmarks, telling distance is impossible. Yet your spirit surges and your steps never falter. Surely there must be something waiting for you at the end of the road…", parse);
					Text.NL();
					Text.Add("And indeed there is. Gradually, the path of burning coals widens to form a circular island in the middle of the inky sea. Standing in the middle of the island is a single tree of indeterminate species, and perched upon its branches is Cveta. No, it isn’t her - but someone who looks distinctly like the songstress, with burning flames where her feathers should be, red and blue and green and gold.", parse);
					Text.NL();
					Text.Add("The flaming creature flutters down to stand before you, then draws you into her embrace without hesitation, arms and wings wrapping about you and ushering you into the center of the inferno. You know that you are being burned alive by her immense heat, that you are being reduced to little more than a handful of black ash, but it doesn’t seem to matter…", parse);
				}
				else {
					Text.Add("Alas, somehow, your toe catches on a wayward coal, and a lance of flame runs up your leg. The pain causes you to stagger and falter, which only means the flames finally manage to find purchase on your body, consuming you from the bottom up with wanton glee. With blackened stumps for legs, you can no longer stand, and fall upon the burning coals: your last memory of the vision is the sight of the dark waves encroaching upon the burning road, waiting for you to be fully consumed so they can carry away your ashes…", parse);
				}
			}, 1.0, function() { return true; });
			
			scenes.Get();
			
			Text.NL();
			Text.Add("At length, the song fades, and reality comes rushing back to you in a dizzy spell, leaving you more than a little disoriented. Instinctively, you reach for the first thing that comes to hand to steady yourself, and it just so happens that it’s Cveta’s sash. With perfect elegance, she eases your grasp away from her clothing and transfers it to her hand, then gives you a few moments to recover.", parse);
			Text.NL();
			Text.Add("<i>“Did you enjoy the performance?”</i>", parse);
			Text.NL();
			Text.Add("You’re not sure if you <i>enjoyed</i> it, but it was certainly a new experience, and not just in the musical sense.", parse);
			Text.NL();
			Text.Add("<i>“There is a reason why I do not use the full force of my voice when I sing to entertain, [playername]. This, however, was an improvised practice session. I did tell you.”</i>", parse);
			Text.NL();
			Text.Add("Right, right. Can someone please stop the world so you can get off?", parse);
			Text.NL();
			Text.Add("Ever the gracious hostess, Cveta tugs at your arm, guiding your path so you can shuffle your way out of her tent. <i>“I suggest that you do not undertake any strenuous activity for the next half-hour, please.”</i>", parse);
			Text.Flush();
			
			TimeStep({hour: 2});
			cveta.relation.IncreaseStat(100, 2);
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Do you know why the caged bird sings?"
	});
	options.push({ nameStr : "Play lyre",
		func : function() {
			Text.Clear();
			Text.Add("You indicate that you’d like to hear her play something on her lyre.", parse);
			Text.NL();
			Text.Add("<i>“Easily done,”</i> she replies, cutting off her current tune with a quick chord. <i>“Give me a few moments, please.”</i>", parse);
			Text.NL();
			Text.Add("She’s silent for a minute or so, and you can imagine the gears turning in her head, working furiously away to come up with something that will satisfy the both of you. At last, she’s done thinking and tosses her head back, getting a few stray hairs out of her vision. When she’s done, the songstress looks positively energized, humming to herself before giving you a nod.", parse);
			Text.NL();
			Text.Add("<i>“Let us see what we can do with this experimental piece, then…”</i>", parse);
			Text.NL();
			
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Cveta’s fingers gingerly test the strings of her lyre as if she were toeing the surface of a pool - the hesitation is brief, but it doesn’t go unnoticed.", parse);
				Text.NL();
				Text.Add("<i>“Spirits, I hate improv,”</i> she mutters to herself. Still, she begins anyway, tracing out familiar territory with a few scales before she launches into the great unknown, her fingers dancing across her instrument with utmost elegance and grace, the songstress herself in miniature.", parse);
				Text.NL();
				Text.Add("The change is nothing less than dramatic - the melody jitters back and forth like a metronome, alternating from fast to slow, turning and weaving its way through the air like a maddened acrobat. Cveta wasn’t joking when she said this would be experimental - what you’re hearing is nothing like the usual stuff she plays during performances. One verse seems completely disconnected from the other, others set your skin to crawling and teeth on edge.", parse);
				Text.NL();
				Text.Add("Still, it is music. Barely so, and of a particularly disjointed kind, but it is music. Even then, it’s not long before Cveta stops abruptly, clearly unsatisfied with her performance. A lesser musician might have smashed their instrument in distaste, but not her. Never her.", parse);
				Text.NL();
				Text.Add("<i>“That left a lot to be desired,”</i> she states flatly.", parse);
				Text.NL();
				Text.Add("If you might inquire… what exactly inspired that bout of barely-not-noise?", parse);
				Text.NL();
				Text.Add("<i>“I witnessed Maria arguing with someone else the other day,”</i> Cveta replies. <i>“I was hoping to be able to capture that intense energy she possessed, and the attempt did not go as well as expected. Perhaps I am going about things the wrong way.”</i>", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Taking a deep breath, Cveta easily pierces the veil of silence that has gathered with quick measure. Even though you know the songstress was born and trained to this, she nevertheless makes it look so easy - as Cveta works the strings with finger and pick, it’s not too hard to imagine the songstress as a seamstress; the notes her threads and the lyre her loom, sheets upon sheets of fine-woven meter and verse pouring off the edge. This raw material still needs to be cut and sewn, dyed and hued into a garment of music that might be conceivably passable for one of her performances, but the idea is still there, and it seems like she’s approaching it from the right direction. It <i>is</i> quite impressive, and you ask Cveta what happened to spark this particular burst of inspiration.", parse);
				Text.NL();
				Text.Add("<i>“Oh, how I came up with this?”</i> she replies, not stopping the ebb and flow of the music. <i>“I just went for a walk in the forest. If you listen closely, nature is full of rhythms that one can find inspiring. It’s certainly worked for me.”</i>", parse);
				Text.NL();
				Text.Add("And what about the natural dangers of the forest?", parse);
				Text.NL();
				Text.Add("She tosses her head and winks at you. <i>“Why, those? They have never been a problem for me, [playername]. After I made the first few mothgirls imagine that the yellow-spotted mushrooms under the fir trees were something else quite similar in shape but completely different altogether, most of the forest creatures have been loathe to harass me.”</i>", parse);
				Text.NL();
				Text.Add("And what <i>exactly</i> did she make them imagine the mushrooms were, then?", parse);
				Text.NL();
				Text.Add("<i>“Oh,”</i> she replies airily. <i>“This and that, something or the other. Let’s just say that morels have a very distinctive shape and texture.”</i>", parse);
				Text.NL();
				Text.Add("Cveta’s tune continues on its way, merry and full of life. It’s definitely reminiscent of some of the more tranquil and beautiful spots you’ve come across while wandering the wilds, and you gradually find your eyes growing heavier…", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("What Cveta tries today is neither here nor there; the songstress flits from tune to tune like a butterfly from flower to flower, perhaps seeking out something that will fit her mood and sate her desires. She did warn you it was going to be experimental, after all. Sometimes she hums along with the music her instrument brings forth; at others, she is deathly still and silent, her eyes closed and the only accompaniment to her music the skillful movement of her dexterous fingers.", parse);
				Text.NL();
				Text.Add("The sudden burst of energy, when it comes, is as tremendous as it is unexpected. Something’s definitely inspired her - while the bird-morph can’t smile thanks to her beak, you can definitely <i>feel</i> a warm glow emanating from her, her gown seeming to shift and swirl of its own accord despite the still air within the tent.", parse);
				Text.NL();
				Text.Add("The piece, whatever it is, peters out to something approaching a slow waltz, and it’s with great focus and deliberation that the songstress keeps the melody in time and prevents it from running amok with her emotions. Still, as you listen on, you can’t help but envision the sound and fury of a gale, compressed and funnelled down before being used to drive a windmill.", parse);
				Text.NL();
				Text.Add("Music is the only escape.", parse);
				Text.NL();
				Text.Add("Cveta chirps in time with her music, a mother singing to her child - and with the way she handles her lyre, cradling the instrument against her side and on her lap, that description isn’t too far off the mark. Echoing with the soft sounds of song and string, the canvas walls of the tent seem more and more distant, more and more incorporeal…", parse);
			}, 1.0, function() { return true; });
			
			scenes.Get();
			
			Text.NL();
			Text.Add("The sound of Cveta’s closing notes jerks you back to the here and now, and after a moment’s pause, she sets down her lyre. <i>“I think I learned a few things back there.”</i>", parse);
			Text.NL();
			Text.Add("Well, as you’re not exactly a musician of her stature and experience, you’ll take her word for it.", parse);
			Text.NL();
			Text.Add("<i>“Perhaps, but thank you for being here today. Having an audience changes the dynamics of things. I think your presence helped in no small measure.”</i>", parse);
			Text.NL();
			Text.Add("Well, if she thinks that’s the case, you’ll be more than happy to sit in on another of her practice sessions some other time.", parse);
			Text.NL();
			Text.Add("<i>“Just so. Now, if you will please excuse me, I do have a few other matters to attend to. It may not be exceedingly gracious to ask you to leave right now, but would you not mind doing so anyway?”</i>", parse);
			Text.Flush();
			
			TimeStep({hour: 2});
			cveta.relation.IncreaseStat(100, 2);
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Have Cveta work those slender, nimble fingers of hers… on her lyre."
	});
	if(cveta.Violin()) {
		options.push({ nameStr : "Play violin",
			func : function() {
				Text.Clear();
				Text.Add("You tell Cveta that you’d love to hear her play the violin.", parse);
				Text.NL();
				Text.Add("<i>“Ask, and you shall receive,”</i> Cveta replies, standing to put away her lyre and drawing the violin case out of her trunk. <i>“You went to the trouble of getting it for me; it is only right and proper that you should have a private taste of the fruits of your labors.”</i>", parse);
				Text.NL();
				Text.Add("It certainly is a fine instrument.", parse);
				Text.NL();
				Text.Add("<i>“Only a fine instrument for the fine,”</i> Cveta replies. <i>“Either you play the violin well, or you make others fear for their sanity. Normally, I would condone only polite displays of disapproval when a performance is poor, but I would not blame an audience for the traditional hail of rotten fruit for subjecting them to such horrors.”</i>", parse);
				Text.NL();
				Text.Add("Why, you get the impression that she’s bragging just a little.", parse);
				Text.NL();
				Text.Add("<i>“Me? Brag?”</i> the songstress replies with a sniff and plenty of mock indignation to go around. Hey, she can do the haughty noblewoman schtick quite well; it’s probably a good thing she doesn’t act that way all the time. <i>”Perish the thought! Do I look like someone who condones such uncouth behavior?”</i>", parse);
				Text.NL();
				Text.Add("With that, the songstress hefts the instrument to her shoulder, securing it against her chin, and begins to play, letting the music take a life of its own.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("It’s hard to deny that bringing together musician and instrument was a good thing for everyone involved. Tuned and restored by the bird-morph’s loving hands, the instrument sounds as if it was practically made for her - Cveta appears to be experimenting with some of the more traditional classical styles today, and you recognize dribs and drabs of solo virtuoso pieces that you’ve heard before at her performances, this seamstress of sound and song piecing together a cloak of many colors in the hopes that it’ll turn out well. Like an actual cloak made this way, not all of it is very coherent or practical, but it certainly is a sight to behold.", parse);
					Text.NL();
					Text.Add("A deft touch of the bow as the songstress turns to more familiar ground, and the gentle, yearning melody turns almost as rich as her singing voice, each line of music flowing unbroken from one to the other. Hugging her wings close to her body, Cveta sways her body in time, the movement slight but noticeable under the gown that rests lightly on her petite frame. It’s rare that she actually plucks the strings, instead preferring to use the bow for almost all of the musical heavy lifting.", parse);
					Text.NL();
					Text.Add("Accompanying the haunting melody is the sound of silence. The daily noises of work and labor about the outlaw camp have all but quietened, and gone is the laughter, the chattering, the curses. All that remains is Cveta and the music of her violin, a free spirit as it twists and twirls in the air-", parse);
					Text.NL();
					Text.Add("And then she stops, the very last few notes quick and staccato before she sets down her bow and gives you an inquiring look. What sort of outro was that? Was there even one?", parse);
					Text.NL();
					Text.Add("<i>“Well?”</i> she says. <i>“How was it?”</i>", parse);
					Text.Flush();
					
					//[Great!][Bad][Eh…]
					var options = new Array();
					options.push({ nameStr : "Great!",
						func : function() {
							Text.Clear();
							Text.Add("Cveta sniffs at your answer. <i>“You do not have to flatter me, you know. That outro was deliberately bad. Whoever ends like that and lets an audience down on their expectations? They end up feeling empty and unfulfilled, you know. I am not so full of myself that I cannot bear someone pointing out a flaw in my playing, especially when the entire point of this session is to improve.”</i>", parse);
							Text.NL();
							Gui.PrintDefaultOptions();
						}, enabled : true,
						tooltip : "Tell Cveta it was pretty good."
					});
					options.push({ nameStr : "Bad",
						func : function() {
							Text.Clear();
							Text.Add("Cveta nods. <i>“Well, at least you are honest about it. Yes, I did that poorly on purpose. I suppose I should not have sought to test you, [playername], but you have not disappointed me. It gets very tiring when the only thing that comes out of another’s mouth is praise - not because it is deserved, but because one seeks to flatter.”</i>", parse);
							Text.NL();
							Gui.PrintDefaultOptions();
						}, enabled : true,
						tooltip : "No, that wasn’t acceptable, especially that last bit."
					});
					options.push({ nameStr : "Eh…",
						func : function() {
							Text.Clear();
							Text.Add("The songstress listens to your explanation and waves it off. <i>“That you are trying to be tactful in your honesty speaks well of you, [playername], but feel free to be blunt with me, especially when it comes to the matter of critique. Now, be direct.”</i>", parse);
							Text.NL();
							Text.Add("As she wishes. You tell Cveta that while most of today’s session was here and there, the outro was pretty bad.", parse);
							Text.NL();
							Text.Add("<i>“Yes, it was bad, and that was the case because I made it so on purpose. My apologies for testing you this way, [playername], but I have heard enough honeyed words to last me a lifetime.”</i>", parse);
							Text.NL();
							Gui.PrintDefaultOptions();
						}, enabled : true,
						tooltip : "Tell the truth, but be diplomatic about it."
					});
					Gui.SetButtonsFromList(options, false, null);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("Cveta goes about today’s practice slowly and methodically, easing her way into the music like someone into a particularly stiff set of new clothes. Fingering the strings, easing the bow, she carefully draws out each note of what sounds like a funeral march. The bird-morph is definitely in the mood for sad things today; the languid music creeping from the violin strings being always in one minor key or the other. You cast a glance at her, wondering if this choice of pieces was simply a flight of fancy or indicative of some deeper emotion.", parse);
					Text.NL();
					Text.Add("Alas, the songstress’ face is carefully genteel and neutral, as always - as unreadable as a smooth stone wall.", parse);
					Text.NL();
					Text.Add("Flat and rolling, yet sad and depressed at the same time, the melody brings to mind a dim, misty bog, its atmosphere somber and weighty, yet calm and peaceful in equal measure. Cveta’s movements mirror her music, the songstress’ posture low and subdued, the flowing of her arms and fingers light and ethereal.", parse);
					Text.NL();
					Text.Add("Thin and easily snatched away by the wind, yet all is so calm that it settles and refuses to leave.", parse);
					Text.NL();
					Text.Add("Quiet and lonely to the point where a single voice could break the pallor that lies upon the land, yet all is bleak and blank.", parse);
					Text.NL();
					Text.Add("A sensation of vastness all about, yet one cannot even glimpse one’s own hands.", parse);
					Text.NL();
					Text.Add("The promise of something great hidden behind a veil, yet all that meets the eye is utter desolation.", parse);
					Text.NL();
					Text.Add("At long last, Cveta coaxes out the final note from the violin, and lets her bow come to rest at her side. She doesn’t raise her head or move otherwise, and considering how slow the final moments of her melody was, it’s a few seconds before you realize that she’s stopped for good and that wasn’t simply part of her performance.", parse);
					Text.NL();
					Text.Add("Perhaps you should ask if she’s feeling all right… even for a sad tune, this is different from her usual fare.", parse);
					Text.Flush();
					
					//[Ask][Let it be]
					var options = new Array();
					options.push({ nameStr : "Ask",
						func : function() {
							Text.Clear();
							Text.Add("You gently reach out to tap Cveta on the shoulder, and ask if anything happened to inspire today’s performance. The bird-morph doesn’t reply at first, but eventually looks up at you and shakes her head. <i>“No, I am myself today. I merely wished to experiment with a few styles I remember hearing in the distant past. It has been so long that my memories of them are not the sharpest… I merely wished to test myself to see if I could recall them satisfactorily.”</i>", parse);
							Text.NL();
							Text.Add("That sounds like what she would say if she were hiding something, but then by the same measure, that would be what she’d say if she <i>weren’t</i> hiding something, too. Out of curiosity, where <i>did</i> she hear the pieces that she was trying to recreate? Judging by how depressing they were, it’s unlikely that it was any sort of public performance.", parse);
							Text.NL();
							Text.Add("<i>“I do not remember,”</i> the songstress admits. <i>“I only remember the music, not where it was played, or even who the musician was. Memory is a fickle thing that way.”</i>", parse);
							Text.NL();
							Gui.PrintDefaultOptions();
						}, enabled : true,
						tooltip : "Question Cveta if she’s feeling all right."
					});
					options.push({ nameStr : "Let it be",
						func : function() {
							Text.Clear();
							Text.Add("Knowing how much the songstress respects her own space, you decide to keep your concerns to yourself. After all, she’ll tell you of her own accord if and when she wants to - trying to pry words from her is harder than a yarn ball from a cat-morph, which everyone knows is almost impossible.", parse);
							Text.NL();
							Gui.PrintDefaultOptions();
						}, enabled : true,
						tooltip : "If she’s feeling out of sorts, she’ll want to keep it to herself. Respect her privacy and let her be."
					});
					Gui.SetButtonsFromList(options, false, null);
					Gui.Callstack.push(function() {
						Text.Add("<i>“Well.”</i> she says, assuming her usual pleasant demeanor as the melancholy mood lifts from her like mist with the sun. <i>“It was not the most jovial of pieces I could come up with, but it takes all kinds to make a world. Without sorrow, we would not be equipped to appreciate joy; without pain, pleasure would be meaningless.”</i>", parse);
						Text.NL();
						Gui.PrintDefaultOptions();
					});
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("Without further ado, Cveta launches head-first into a serious, somber piece, the first few lines of music barely having left the violin strings before she accompanies it with a powerful, resonant humming from the back of her throat. It’s not something that could be projected across the outlaws’ fire pit, but at this distance you’re subjected to every ebb and flow, every push and pull of the two forces at play.", parse);
					Text.NL();
					Text.Add("The solemn timbre of the violin strings resonates beautifully with Cveta’s voice; at times they work together, other times they push against the other, just like a pair of dancers with the violin leading and the vocals trailing along in accompaniment. It’s something that only she would be able to pull off - skill has little to do with it, for that voice… those strings… yes, some things have to be gifted first, and only then can they be honed to sharp perfection.", parse);
					Text.NL();
					Text.Add("Caught up in the music, you get a sense of immenseness - no, it isn’t simple physical size that the music impresses upon you, but a sense of imminentness, of looming. It is a giant boulder balanced on the thinnest of precipices, poised in that final moment before being unleashed upon the mountainside, of the shadow of a wave before it breaks onto the surf. As you would expect, it hold you enraptured, entranced, enthralled until the very moment when it all comes crashing down-", parse);
					Text.NL();
					Text.Add("Yet, it never does.", parse);
					Text.NL();
					Text.Add("How long she can keep it up, you have no idea, yet Cveta continues to play away with exquisite finesse - you catch her gaze in one of your more lucid moments, and there’s a knowing glint in the large, dilated pupil of her uncovered eye. With one definitive pull of the bow, she lets it all go, holding the note for as long as it will last before it finally fades away into silence.", parse);
					Text.NL();
					Text.Add("<i>“I must say,”</i> she adds after you’ve recovered enough of your wits to pay attention, <i>“I am particularly pleased with the results of today’s practice.”</i>", parse);
					Text.NL();
					Gui.PrintDefaultOptions();
				}, 1.0, function() { return true; });
				Gui.Callstack.push(function() {
					Text.Add("<i>“And that will be it for today’s session,”</i> Cveta says, setting down the violin on her cot and giving you a small curtsey in her usual fashion. “Would you mind showing yourself out, [playername]?”</i>", parse);
					Text.NL();
					Text.Add("Why, of course. It’s always a pleasure to hear her play.", parse);
					Text.NL();
					Text.Add("<i>“Then drop by tomorrow, and I will see what I can do for you,”</i> is the genial reply. <i>“Good health to you, my friend, and fare well.”</i>", parse);
					Text.Flush();
					
					TimeStep({hour: 2});
					cveta.relation.IncreaseStat(100, 2);
					
					Gui.NextPrompt();
				});
				scenes.Get();
			}, enabled : true,
			tooltip : "You’re certainly able to appreciate the finer things in life. The violin, please."
		});
	}
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("<i>“Very well.”</i>", parse);
		Text.Flush();
		CvetaScenes.Prompt();
	});
}

CvetaScenes.MariaTalkFirst = function() {
	let player = GAME().player;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name
	};
	
	cveta.flags["Met"] = CvetaFlags.Met.MariaTalk;
	
	Text.Clear();
	Text.Add("As you step into the now-familiar confines of the outlaws' camp, the first sight you see is that of Maria pacing up to you, a scowl on her face. Something's clearly set her on edge, and hopefully it isn't your presence.", parse);
	Text.NL();
	Text.Add("<i>“Hey, [playername],”</i> the archer says through clenched teeth. <i>“You got a moment? We've got a princess who needs looking after, and I just don't have the time to put up with this crap at the moment.”</i>", parse);
	Text.NL();
	Text.Add("Princess? The outlaws actually managed to get their hands on one of the-", parse);
	Text.NL();
	Text.Add("<i>“No, no, not one of the royal twins, as much as we'd love to get our hands on that bitch so we can string her up on a short rope from a tall tree,”</i> Maria says upon seeing your expression. <i>“We just call the bird that because… well, damned if she don't act as if she were one. I mean, she's not acting like she owns the place or demanding that her tea be served just three shades of warm, but she's acting like she's too good for us and that's setting some of the lads on edge. Just… talk to the bird, all right? I mean, damn, you're an outsider from another plane, and she’s clearly not from around Rigard, so maybe you'll be able to get through. I've got much to do today, and can't waste my time playing schoolmarm getting some girl to play nice.”</i>", parse);
	Text.NL();
	Text.Add("It seems that Maria wants you to try and talk some sense into whoever this “princess” is and get her to drop her airs. Do you feel up to the task?", parse);
	Text.Flush();
	
	TimeStep({minute: 15});
	
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		func : function() {
			Text.Clear();
			Text.Add("Maria visibly sags at your assent, letting out a sigh of relief. <i>“Oh, thank the stars and spirits. Zenith may have set me to the task, but she drives me crazy. And it's not just how stuck up she is - she uses all those strange words and I can barely understand her. Wouldn't have bothered with such an odd one myself, but he thinks he can use the bird to get leverage from the Free Cities…”</i>", parse);
			Text.NL();
			Text.Add("You wait for another tirade from Maria, but she seems to have spent herself on that last outburst. She jabs a finger off to her side, clears her throat, and continues.", parse);
			Text.NL();
			Text.Add("<i>“Look, I'm not going to waste more of your time than necessary, [playername]. Our princess is in that tent over there. Just talk some sense into her, okay? The rest is up to you. Oh, and I'd strongly suggest that you knock or something before heading in. She takes poorly to unannounced visitors dropping in.”</i>", parse);
			Text.NL();
			Text.Add("You glance in the direction of Maria's finger, and note a square tent amongst all the others - larger than the average outlaw's, but still modest. Maria gives you an encouraging wave, then quickly sidles off before you can change your mind.", parse);
			Text.NL();
			CvetaScenes.FirstMeeting();
		}, enabled : true,
		tooltip : "Take on the job, no matter how momentary, of playing camp counselor."
	});
	options.push({ nameStr : "No",
		func : function() {
			Text.Clear();
			Text.Add("You shake your head and reply that you don't have the time, either. Besides, you point out to her, considering how “convincing” she was in your first meeting, if she can't take a mere girl in hand, who else can?", parse);
			Text.NL();
			Text.Add("Maria lets out an exasperated groan and rolls her eyes. <i>“Oh no, not you, too. Look, I'm at my wits' end with that girl. Maybe you're having an off day - I'll ask again another time. This goes on any longer, and I'll tell Zenith to deal with his harebrained ideas himself.”</i> Before you can reply, she's already turned tail and stormed off.", parse);
			Text.Flush();
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "If Maria doesn't have the time, then neither do you."
	});
	Gui.SetButtonsFromList(options, false, null);
}

CvetaScenes.MariaTalkRepeat = function() {
	let player = GAME().player;

	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>“Really? You're not kidding me? I was about to tell Zenith to stuff it and look after the brat himself. I've got to take the boys out on patrol today, and it's hard to hold a steady aim when you're as pissed she can make me.”</i>", parse);
	Text.NL();
	Text.Add("You quickly reassure Maria that yes, you're serious, no, you're not pulling her leg, and all she has to do is tell you what she has in mind.", parse);
	Text.NL();
	Text.Add("<i>“Look, I'm not going to waste more of your time than necessary, [playername]. Our princess is in that tent over there. Just talk some sense into her, okay? The rest is up to you. Oh, and I'd strongly suggest that you knock or something before heading in. She takes poorly to unannounced visitors dropping in.”</i>", parse);
	Text.NL();
	Text.Add("You glance in the direction of Maria's finger, and note a square tent amongst all the others - larger than the average outlaw's, but still modest. Maria gives you an encouraging wave, then quickly sidles off before you can change your mind.", parse);
	Text.NL();
	CvetaScenes.FirstMeeting();
}

CvetaScenes.FirstMeeting = function() {
	let player = GAME().player;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name
	};
	
	cveta.flags["Met"] = CvetaFlags.Met.FirstMeeting;
	
	Text.Add("Approaching the tent Maria pointed out, the faint sound of music reaches you as you draw close, that of a slow, dolorous piece being played on a string instrument of some sort. The music is strangely haunting, and reminds you of home, your life before you picked that gem from the mirror, of better times…", parse);
	Text.NL();
	if(Math.log(player.Spi()) < 4)
		Text.Add("Before you know it, you realize you've been standing in the same spot for a good five minutes, entranced by the strange melody emanating from the tent flaps. Wondering what just happened, you gather your wits and take the last few steps toward the tent.", parse);
	else
		Text.Add("The otherworldly melody fills you with a lingering, sad longing, but you shake off the strange mood and step up to the tent flaps.", parse);
	Text.NL();
	Text.Add("Remembering what Maria said about uninvited visitors, you stop at the entrance and clear your throat, loud enough to be heard from anyone within. Nothing happens for a moment or two, and then the music ends, punctuated by a quick chord.", parse);
	Text.NL();
	Text.Add("<i>“Please, come in.”</i>", parse);
	Text.NL();
	Text.Add("Well, seems like you've been invited. The moment you step into the canvas confines, you're greeted with the juxtaposition of the elegance of the figure that sits before you, and the simplicity of the furnishings that surround her. There's but a simple wooden cot, a stool and a crude iron-bound trunk within, but the elegant, avian figure poised on the stool is their exact opposite, a lyre in her hands as she studies you with the single large, pale green eye that isn't obscured by the waterfall of her flowing, crimson hair.", parse);
	Text.NL();
	Text.Add("As small as she is thin and waifish - perhaps about five feet, give or take an inch - the long, flowing gown that hangs upon her frame looks more in place in Rigard's castle district than out here in the wilds. Both it and the vermillion feathers that cover her body are slightly ruffled and stained, further drawing attention to the fact that they're painfully out of place in this camp of outlaws.", parse);
	Text.NL();
	Text.Add("It's clear why Maria has chosen to give this girl the moniker of “princess”.", parse);
	Text.NL();
	Text.Add("<i>“Well?”</i> the bird of paradise says in that soft, melodious voice of hers, leaning to put the lyre away in the trunk. When she's done, she eases herself back into the stool, folding her broad wings behind her back in the process. <i>“Should introductions not be proper?”</i>", parse);
	Text.NL();
	Text.Add("What? Oh, yes. Introductions. That sounds like a good start. You quickly introduce yourself, eliciting a nod from the beautiful bird.", parse);
	Text.NL();
	Text.Add("<i>“Well met, [playername]. I am Cveta Antonova.”</i>", parse);
	Text.NL();
	Text.Add("Yes… you're beginning to see what Maria was getting at. You'd better keep this conversation rolling, lest it lapse into awkward silence.", parse);
	Text.Flush();
	
	var opts = {
		wellbeing : false,
		outlaws   : false,
		music     : false,
		weather   : false
	};
	
	CvetaScenes.FirstMeetingPrompt(opts);
}

CvetaScenes.FirstMeetingPrompt = function(opts) {
	let player = GAME().player;
	
	var parse = {
		playername : player.name
	};
	
	//[Wellbeing][Outlaws][Music][Weather][Give Up]
	var options = new Array();
	if(opts.wellbeing == false) {
		options.push({ nameStr : "Wellbeing",
			func : function() {
				opts.wellbeing = true;
				Text.Clear();
				Text.Add("<i>“I am doing well, thank you very much. There are areas in my life and condition that could use improvement, but all things strive.”</i>", parse);
				Text.Flush();
				CvetaScenes.FirstMeetingPrompt(opts);
			}, enabled : true,
			tooltip : "Ask how Cveta is doing."
		});
	}
	if(opts.outlaws == false) {
		options.push({ nameStr : "Outlaws",
			func : function() {
				opts.outlaws = true;
				Text.Clear();
				Text.Add("You ask Cveta what she thinks of the outlaws.", parse);
				Text.NL();
				Text.Add("<i>“It is unseemingly to spread gossip, especially when it concerns one's benefactors,”</i> Cveta replies curtly, a swift, cutting motion of a gloved hand indicating that the matter is not up for discussion. <i>“Please, let us speak of another subject.”</i>", parse);
				Text.Flush();
				CvetaScenes.FirstMeetingPrompt(opts);
			}, enabled : true,
			tooltip : "As what she thinks of the outlaws."
		});
	}
	if(opts.music == false) {
		options.push({ nameStr : "Music",
			func : function() {
				opts.music = true;
				Text.Clear();
				Text.Add("<i>“So you heard me play? It was Lady Felicia Kobert's Song without Words in A minor, opus four. Or a variant of it adapted for a solo performance, considering it was originally meant for a proper string quartet. It's quite the moving piece, when played as the composer intended.”</i>", parse);
				Text.NL();
				Text.Add("It certainly had a melancholy feel about it, that's for sure.", parse);
				Text.NL();
				Text.Add("Cveta taps the hook-tipped end of her beak in thought. <i>“Lady Kobert was of the Free Cities, you see, and as chance would have it, was betrothed to one of the Dukes of Rigard to cement a political alliance, as is the duty of those who occupy such privileged stations. Such, however, meant making a trip across the length of Eden to her new home, leaving behind everything she knew, everything that was familiar, everything that she held dear.", parse);
				Text.NL();
				Text.Add("“Lady Kobert's original intent was to write a poem for her family, but could not find the words to adequately express her feelings at said departure. Hence, she resorted to the language known as music to convey the message she desired to bring forth.”</i>", parse);
				Text.NL();
				Text.Add("Leaving behind everything you knew, everything that was familiar, everything that you held dear. At least unlike this Lady Kobert, you have a shot at getting home - or at least, hopefully so. You turn back to Cveta, hoping she'll continue the conversation on her own, but the bird-morph's said her piece and is returning your expectant look with one of her own.", parse);
				Text.Flush();
				CvetaScenes.FirstMeetingPrompt(opts);
			}, enabled : true,
			tooltip : "Ask Cveta about the music she was playing just now."
		});
	}
	if(opts.weather == false) {
		options.push({ nameStr : "Weather",
			func : function() {
				opts.weather = true;
				Text.Clear();
				Text.Add("Cveta shrugs, letting out a slight rustle as her feathers move over the fabric of her once-glorious gown.", parse);
				Text.NL();
				Text.Add("<i>“[playername]…", parse);
				Text.NL();
				Text.Add("Whether the weather be fine<br>", parse);
				Text.Add("Or whether the weather be not,<br>", parse);
				Text.Add("We'll weather the weather,<br>", parse);
				Text.Add("Whatever the weather,<br>", parse);
				Text.Add("Whether we like it or not.”</i>", parse);
				Text.NL();
				Text.Add("Well. That seems to have put paid to <b>that</b> line of conversation.", parse);
				Text.Flush();
				CvetaScenes.FirstMeetingPrompt(opts);
			}, enabled : true,
			tooltip : "A desperate fallback for the conversationally deprived, but it's got to be something to talk about, right?"
		});
	}
	if(options.length == 0) {
		options.push({ nameStr : "Give up",
			func : function() {
				Text.Clear();
				Text.Add("There's nothing left. You're all out of options for making small talk, and Cveta here is remaining as uncooperative as ever. Maybe it would be best to just leave the entire bad situation and tell Maria to-", parse);
				Text.NL();
				Text.Add("<i>“[playername].”</i>", parse);
				Text.NL();
				Text.Add("What?", parse);
				Text.NL();
				Text.Add("<i>“Who set you up to this?”</i>", parse);
				Text.NL();
				Text.Add("You're about to protest, but Cveta shakes her head. <i>“This is a camp of outlaws, of people of disparate walks of life who have banded together to oppose the cruel policies of Rigard's aristocracy. It is certainly not expected for a stranger to ask to come into another's abode within this camp and make small talk of little consequence. Trust between neighbors is… varied.", parse);
				Text.NL();
				Text.Add("“So, I must ask again: will you please tell me who set you up to this? Rest assured that I do not mean to castigate whoever it happens to be.”</i>", parse);
				Text.Flush();
				
				//[Truth][Silence]
				var options = new Array();
				options.push({ nameStr : "Truth",
					func : function() {
						Text.Clear();
						Text.Add("You sigh and admit that Maria was getting worried about her putting on airs, and the effect it was having on some of the outlaws. Cveta listens intently to your words, then nods.", parse);
						Text.NL();
						Text.Add("<i>“I was beginning to suspect as much, [playername]. It has not escaped my attention that Maria has begun calling me ‘princess’ behind my back. What she mistakes for pompousness and haughtiness is merely simple decorum.", parse);
						Text.NL();
						Text.Add("“Nobility is more than just blood, [playername]. It is of the spirit, it is an ethos, it is what you are, not what you can buy or sell. It is… hard to put into words, yet all who see this elusive thing instinctively recognize it, either as peers, or as subordinates. You have seen Zenith, I presume; he possesses much of it. The form his nobility takes is more palatable to those unacquainted with refinement. The same cannot be said of me.”</i>", parse);
						Text.NL();
						Text.Add("Her piece said, Cveta closes her eyes a moment, humming to herself, and when she reopens them her gaze is a little more animated.", parse);
						Text.NL();
						Text.Add("<i>“Do not worry, [playername]. Believe me, I am at times tempted to be as aggravated with Maria and her ilk as they are with me; it would be strange if it were otherwise, since we come from ways of life that are vastly different. Nevertheless, I believe I can effect a reconciliation over time. Thank you for bringing this to my attention.”</i>", parse);
						Text.NL();
						CvetaScenes.FirstMeetingCont();
					}, enabled : true,
					tooltip : "Tell Cveta that Maria sent you to talk to her, and why."
				});
				options.push({ nameStr : "Silence",
					func : function() {
						Text.Clear();
						Text.Add("Since Cveta's already figured out someone sent you, it'd do little good to claim you just came in for a stroll of your own accord. Shrugging, you opt to stay silent, which seems to be the best way to cover for Maria. After a few moments, Cveta realizes you aren't going to spill the beans and brushes the hair away from her usually covered eye, raising her gaze to meet your own.", parse);
						Text.NL();
						Text.Add("<i>“Such loyalty is impressive. I am sorry. Please forgive me… ”</i>", parse);
						Text.NL();
						Text.Add("As the bird-morph speaks, something changes in her eyes and the melody of her voice shifts subtly. Suddenly, you're more aware than ever of how pitiful and waifish Cveta looks, how utterly helpless she is, and how kind it would be to just give her what she wants…", parse);
						Text.NL();
						Text.Add("<i>“… But will you not please tell me who sent you on this errand?”</i>", parse);
						Text.NL();
						if(Math.log(player.Spi()) >= 4) {
							Text.Add("Strange. That feeling… it's similar to what you felt when you approached Cveta's tent and heard the music she was playing, only this had a stronger quality to it. You rub your face, clearing your thoughts, and continue your silence until it's clear to Cveta that you really aren't going to surrender this information. If the bird-morph is upset by this, she certainly doesn't show it, keeping a stiff upper - right, she doesn't have lips.", parse);
							Text.NL();
							Text.Add("<i>“Very well. Hold your tongue, as you will. But please inform whoever sent you that in the future, he or she would be best suited to bring any grievances directly to my face instead of hiding behind a proxy.”</i> She looks askance. <i>“As for you, [playername]…  your actions speak well of you.”</i>", parse);
						}
						else {
							Text.Add("Of course! That's what you'd been meaning to do all along! The words flow from your lips almost unbidden - Maria worrying about the “princess” putting on airs, and how she asked you to try and get Cveta to open up. After you've finished your little tale, Cveta looks satisfied and dismisses the concerns with a small wave of a gloved hand.", parse);
							Text.NL();
							Text.Add("<i>“So, it was her. Do not worry, [playername]. I am comfortable as who I am; since Maria's ilk and I come from very different backgrounds, it would be amiss if there were no friction at all between our kind. It will merely take some time for them to get used to me, and for me to reciprocate the favor; I believe I can effect a reconciliation over time and get them to understand the importance of decorum in dealing with others. Thank you for bringing this to my attention.”</i>", parse);
						}
						Text.NL();
						CvetaScenes.FirstMeetingCont();
					}, enabled : true,
					tooltip : "Refuse to tell Cveta Maria sent you."
				});
				Gui.SetButtonsFromList(options, false, null);
			}, enabled : true,
			tooltip : "This clearly isn't going anywhere. Cveta clearly isn't the chatty sort, and you're beating your head against a brick wall."
		});
	}
	Gui.SetButtonsFromList(options, false, null);
}

CvetaScenes.FirstMeetingCont = function() {
	let outlaws = GAME().outlaws;
	
	var parse = {
		
	};
	parse["SunlightMoonlight"] = WorldTime().LightStr("Sunlight", "Moonlight");
	
	Text.Add("<i>“And with that, I think this brings our introduction to an end. It has a pleasure, I assure you, despite the circumstances under which we have been acquainted,”</i> Cveta says, rising from the stool and making a sweeping gesture toward the tent flaps. <i>“Allow me to show you out.”</i>", parse);
	Text.NL();
	Text.Add("Always so painfully polite, isn't she? The bird-morph takes your hand in hers and practically flows toward the exit, gently but firmly making it clear that she no longer desires your presence in her tent. [SunlightMoonlight] greets your face as you step out into the open and you make to return to the main body of the outlaws' camp, but you suddenly feel Cveta's hand on your shoulder.", parse);
	Text.NL();
	Text.Add("<i>“Before you depart, there is one last thing,”</i> Cveta says. <i>“Zenith has agreed to let me play for his merry band at dawn and dusk; he believes that some music will serve to inspire them and do something for morale, which could be better of late. If you care to hear some music aside from bawdy tavern songs, I would recommend that you make yourself present.", parse);
	Text.NL();
	Text.Add("“That is all.”</i>", parse);
	Text.NL();
	Text.Add("With that, the bird-morph retreats into her tent, and you hear the faint shuffling of string being tied from within. Seems like she doesn't want to be disturbed any further, and the reason for that becomes clear once the music begins to pick up again, its faint melody wafting through the air of the outlaws' camp.", parse);
	Text.Flush();
	
	outlaws.relation.IncreaseStat(100, 1);
	
	TimeStep({hour: 1});
	
	Gui.NextPrompt();
}

CvetaScenes.Performance = function() {
	let player = GAME().player;
	let party = GAME().party;
	let outlaws = GAME().outlaws;
	let cveta = GAME().cveta;
	
	var parse = {
		playername : player.name,
		skinDesc : function() { return player.SkinDesc(); },
		cocks : function() { return player.MultiCockDesc(); },
		vagDesc : function() { return player.FirstVag().Short(); }
	};
	
	var dawn = WorldTime().hour < 12;
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		parse["audience"] = "outlaws coming in from their watch shift";
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["audience"] = "exiled morph nobles";
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["audience"] = "a few ragtag individuals who've come for the entertainment";
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		parse["audience"] = "a sizeable crowd, graced by none other than Zenith himself";
	}, 1.0, function() { return true; });
	scenes.Get();
	
	Text.Clear();
	parse["comp"] = party.Num() == 2 ? party.Get(1).name :
	                party.Num() >  2 ? "your companions" : "";
	parse["c"] = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
	parse["dawn"] = dawn ? "last night's dying embers" : "the freshly lit bonfire";
	Text.Add("Hurrying to the enormous fire pit that serves as the central gathering grounds of the outlaws' camp, you[c] arrive just in time to find Cveta seated by the edge of [dawn], warming up for the upcoming performance. A number of outlaws have gathered to hear her play, the audience this time being primarily comprised of [audience].", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("Satisfied with the turnout, Cveta stands, taking a moment to dust off the seat of her gown before addressing the audience.", parse);
		Text.NL();
		Text.Add("<i>“Today, I will be playing 'Spirit of the Storm', Grahm's solo Violin Sonata number six in G major. Please, enjoy.”</i>", parse);
		Text.NL();
		Text.Add("With those few words, the bird-morph secures the violin you purchased for her against her shoulder and neck and begins to play, bow moving against strings in fluid, practiced movements. It quickly becomes obvious why this particular composition has been named such: the notes that emerge from Cveta's violin start off slow and languid at first, but rapidly gain in pace and energy, the bird-morph's fingers moving furiously to keep in time with the music that drives her.", parse);
		Text.NL();
		if(party.Num() > 1) {
			var comp = party.GetRandom();
			parse["name"]  = comp.name;
			parse["heshe"] = comp.heshe();
			parse["c"]     = Text.Parse(" cast a glance at [name], and [heshe] is utterly captivated by the tremendous energy of Cveta's music, while you yourself", parse);
		}
		else
			parse["c"] = "";
		
		Text.Add("Even as the music itself rises to a crescendo, Cveta herself seems to slow, her eyes half-lidded in sheer concentration, her breathing slow and shallow. All around her, the whirl and frenzy of maddened music, she herself the eye of the storm, calm, peaceful, perfectly centered. It's impossible not to feel the charged atmosphere building up amongst the audience; you[c] feel invigorated, energized, and ready to go out into the rest of Eden to take names and kick asses. Thunder roars in your heart and lightning flashes through your veins to the pulse of Cveta's music, and for a moment, just for a fleeting moment, you think you could gain so much strength that you could take on anyone - even Uru herself - and come out on top…", parse);
		Text.NL();
		Text.Add("All good things must come to an end, though, and music and storm alike begin to die down, the last few raindrops petering out as Cveta strikes the final chord with a flourish. Carefully, she sets both violin and bow back into their case, and turns to face her audience.", parse);
		
		Text.NL();
		Text.Add("You feel stronger.", parse, 'bold');
		
		_.each(party.members, function(ent) {
			Status.Buff(ent, {hours: 24, Str: 1.1});
		});
	}, 1.0, function() { return cveta.Violin(); });
	scenes.AddEnc(function() {
		Text.Add("Once everyone is seated and quiet, Cveta stands, brushing away the locks of hair that usually obscure her left eye. Off to one side, you notice a dog-morph dragging in a set of large drums fashioned from wood and cured hide, and once the instruments are set up by the fire pit, Cveta gives him a nod and directs him to take up position with a pair of drumsticks.", parse);
		Text.NL();
		Text.Add("<i>“Welcome, everyone,”</i> she says, dipping her head. <i>“Today, Ernest and I will be performing 'March of the Summer Solstice' by Major Cernovitz of the Free Cities. Please, relax and enjoy what we have to offer. It is but a pared-down version of the original, but we have worked hard to make it enjoyable.”</i>", parse);
		Text.NL();
		Text.Add("At Cveta's signal, the dog-morph starts up a marching beat on the crude drum set, the rhythm of his pounding akin to the pulsing of a giant heart in the centre of the outlaw camp. Cveta herself waits for him to steady his tempo, then sits back down and launches into her own accompaniment on her lyre, supporting the instrument in her lap while she works away at the strings with both her fingers and pick. You wouldn't have expected such disparate instruments to play well together but they surprisingly do - the end result is a gritty piece with a distinct martial motif, definitely something a number of the outlaws can relate to.", parse);
		Text.NL();
		Text.Add("Pity there isn’t a trumpet or bugle for accompaniment, but where would the outlaws get their hands on one?", parse);
		Text.NL();
		parse["breakfastdinner"] = dawn ? "breakfast" : "dinner";
		Text.Add("You have to admit, it's quite catchy. Several of the outlaws in the audience must agree with you, since they're following the beat in any way they can - stamping on the ground with their boots or banging their [breakfastdinner] utensils together with varied results.", parse);
		Text.NL();
		if(party.Num() > 1) {
			var comp = party.GetRandom();
			parse["name"]   = comp.name;
			parse["hisher"] = comp.hisher();
			Text.Add("Even [name] has given in to the urge to follow the music, bobbing [hisher] head in time with the drums.", parse);
			Text.NL();
		}
		Text.Add("You can't quite put what you're feeling into words - there's something raw and primal about the drumbeat and underlying tones of the music that speak directly to the soul. You can practically envision in your mind's eye columns upon columns of troops in full regalia, rows upon rows marching past a cheering populace in triumphant glory… or if you interpreted it another way, the same soldiers marching in battered breastplates down dusty roads to their inescapable doom.", parse);
		Text.NL();
		Text.Add("Oblivious to the cacophony about them, both Cveta and the dog-morph dutifully continue to hammer out that marching beat, the latter's teeth clenched and sweat beading on his forehead even as he pounds away furiously on the drum. Yet he doesn't seem to show any signs of tiring - and come to think of it, neither do you or anyone else present in the audience. With this sort of beat at your back, you could probably march on forever…", parse);
		Text.NL();
		Text.Add("…Fatigue is an irritation to be cast aside like so much old trash. Sleep a weakness that one must be weaned off. Forward, onward, and only victory or death can stop you…", parse);
		Text.NL();
		Text.Add("Alas, all good things must eventually come to an end. As the pounding of the drums grows louder and louder as the music approaches its zenith, Cveta coaxes a few more notes out of the tortured strings of her lyre and with three, final, thunderous notes, brings the entire beat to a stop. The effect is immediate: it feels as if the heart had been ripped out of a living body. It's only then that the dog-morph seems to realize how utterly exhausted - and exhilarated - he is, mopping off his damp fur with a paw.", parse);
		Text.NL();
		Text.Add("<i>“Thank you, Ernest,”</i> Cveta says as she carefully sets down her lyre. <i>“I believe I speak for everyone present when I say that you performed admirably just now. Please, do not trouble yourself; I will have someone else bring back your instruments.”</i> With that, she stands and takes in her cheering audience with a satisfied air.", parse);

		Text.NL();
		Text.Add("You feel tougher.", parse, 'bold');
		
		_.each(party.members, function(ent) {
			Status.Buff(ent, {hours: 24, Sta: 1.1});
		});
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("Once everyone has seated themselves and quieted down, Cveta stands and acknowledges her audience with a brisk nod. She's brought nothing but herself this time round, but has made every effort to doll herself up, her hair and feathers preened to perfection, the worst of the blemishes on her gown hidden from view. The bird-morph opens and shuts her beak a few times in what looks like a silent set of vocal exercises, then finally speaks.", parse);
		Text.NL();
		Text.Add("<i>“Today, I will be performing ‘The Prophet’.”</i>", parse);
		Text.NL();
		if(party.InParty(kiakai)) {
			parse["name"] = kiakai.name;
			Text.Add("<i>“‘The Prophet’,”</i> [name] says in a hushed whisper. <i>“I would never have expected to hear that sung here, so far away from the shrine. The hymn is sacred to Lady Aria, [playername]. Please, if nothing else, show the proper respect and remain silent while she sings.”</i>", parse);
			Text.NL();
		}
		Text.Add("Absolute silence reigns in the clearing before the fire pit, the expectation in the air palpable as Cveta brings her gloved hands upward, clasping them before her bosom. Slowly, she closes her eyes as if meditating, then raises her bowed head and bursts into song.", parse);
		Text.NL();
		Text.Add("Her voice is divine.", parse);
		Text.NL();
		Text.Add("The melody is slow and rolling, soft and sad as it reaches the ears of everyone present. It doesn't stop there, though, worming its way into your mind and permeating every single fiber of your being. You close your eyes and let Cveta's unearthly soprano wash over you and carry you away into another world…", parse);
		Text.NL();
		Text.Add("In your mind's eye, the music evokes images of pain. Of loss. Of long-lasting suffering, and of shining hope.", parse);
		Text.NL();
		Text.Add("It speaks of roads long-travelled, of destiny, of endings. Of struggle, and divine providence to face the trials that await you.", parse);
		Text.NL();
		Text.Add("It reminds you of the beauty and peace of Aria's temple, unspoiled and eternal. Of things that are worth fighting and dying for.", parse);
		Text.NL();
		Text.Add("There are no lyrics to the hymn, yet it says so much a language all can understand, even though the exact words heard differ from one to another.", parse);
		Text.NL();
		if(party.InParty(kiakai)) {
			parse["name"] = kiakai.name;
			parse = kiakai.ParserPronouns(parse);
			Text.Add("A soft sniffle comes from [name] beside you; it seems that [heshe], too, has heard the music calling out to [himher]. Vaguely, you wonder just what memories Cveta's music has stirred up in [himher].", parse);
			Text.NL();
			Text.Add("<i>“I-I am all right,”</i> [heshe] says when [heshe] notices you looking at [himher], trying to wipe away [hisher] tears without being obvious about it. <i>“I just… ”</i> [HeShe] seems to have forgotten [hisher] request for you to keep quiet during the performance. <i>“‘The Prophet’ was composed to honor one of the first high priestesses to serve Aria, long before my time; it represents her journey, and the trials and tribulations she faced in serving the lady. Yet through all the hardships she endured, Aria guided her when she became lost, lent her strength when her own failed. Enough such that nothing was impossible, but not so that she was not tested.", parse);
			Text.NL();
			Text.Add("“It may be that the hymn reflects what we ourselves will have to face before peace can return to Eden once more,”</i> [heshe] says, suddenly contemplative.", parse);
			Text.NL();
		}
		Text.Add("Cveta's song continues to flow through the outlaws' camp, surging and growing as it nears its conclusion. The hope of the hymn fills your spirit, and in that moment you feel stronger, more focused, more determined to go on; the bird-morph herself has raised her voice to the heavens, her wings spread slightly, and you can't help but think she does resemble an angel quite a fair bit…", parse);
		Text.NL();
		Text.Add("Finally, the music stops, but it takes a few moments for most of the audience to register that fact. Most of them are sniffling openly, and even the most hardened of the outlaws look slightly less curmudgeonly after sitting through the performance. Taking a few deep breaths to calm her voice, Cveta slowly opens her eyes and unclasps her hands from her breast.", parse);

		Text.NL();
		Text.Add("You feel more stoic.", parse, 'bold');
		
		_.each(party.members, function(ent) {
			Status.Buff(ent, {hours: 24, Spi: 1.1});
		});
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("Satisfied that everyone who will be present is accounted for and paying attention, Cveta rises and acknowledges their presence with a dip of her head.", parse);
		Text.NL();
		Text.Add("<i>“Today, I will be performing ‘The Bells of Rigard’ by Alan Witt, serenade number three in D major. Please, calm yourself and enjoy the music.”</i>", parse);
		Text.NL();
		Text.Add("With that, the bird-morph reseats herself and lifting her lyre into her lap. She gives its strings a few experimental strums, then launches into the melody in earnest.", parse);
		Text.NL();
		Text.Add("Despite her telling you to calm yourself, it’s hard to follow that advice. The music that rings from her strings is sweet and cloying like a caramel confection, flowing through the air like syrup and moving across your [skinDesc] like a lover’s caress. Try as you might, you can’t help but feel your thoughts start drifting toward some of the more lusty dreams you’ve had of late, wondering how nice it would be if some of them could be made reality…", parse);
		Text.NL();
		Text.Add("A light breeze has picked up in the camp, and your gaze wanders back to Cveta. The songstress is huddled in on herself as she plays, and your eyes are drawn to the ruffled beauty of her vermillion feathers, the flow of her gown, and those long, dexterous fingers working away with both strings and pick, fingers that could easily be put to much, much better use…", parse);
		Text.NL();
		if(party.InParty(kiakai) || party.InParty(terry) || party.InParty(momo)) {
			var comp;
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				comp = kiakai;
			}, 1.0, function() { return party.InParty(kiakai); });
			scenes.AddEnc(function() {
				comp = terry;
			}, 1.0, function() { return party.InParty(terry); });
			scenes.AddEnc(function() {
				comp = momo;
			}, 1.0, function() { return party.InParty(momo); });
			scenes.Get();
			parse["name"] = comp.name;
			parse = comp.ParserPronouns(parse);
			Text.Add("A slow panting from beside you draws your attention, and you turn to find [name] breathing heavily, eyes slightly glazed over. [HeShe] notices you looking at [himher], and cracks a weak smile. <i>”You know, [playername]… have I ever told you how attractive you are?”</i>", parse);
			Text.NL();
		}
		Text.Add("There’s no doubt about it, not with your breath growing ragged, ", parse);
		if(player.FirstCock())
			Text.Add("[cocks] throbbing and growing painfully stiff, ", parse);
		if(player.FirstVag())
			Text.Add("[vagDesc] becoming noticeably moist, ", parse);
		Text.Add("and the prickling of a flush creeping over your [skinDesc] as it spreads through your body. Sure, music can set the mood, but surely it can’t go that far on its own! Yet the sweet, honeyed notes continue to gush from Cveta’s lyre, working their magic on everyone present in the audience. You can hear a few stifled groans - perhaps it’s only propriety that’s keeping some of the more raunchy outlaws from masturbating right there and then.", parse);
		Text.NL();
		Text.Add("The bird-morph herself is seemingly the only one unaffected by the strange qualities of her music, her eyes closed in concentration as the piece slowly comes to an end, her fingers slowing to coax out the last few chords from her lyre. With impeccable grace, Cveta sets down her lyre and stands, and there’s a definite glint of satisfaction in her eye as she surveys her handiwork.", parse);
		Text.NL();
		Text.Add("After sitting through all that, you definitely feel more seductive, for the lack of a better word to describe it. Well, at least until that melody gets out of your head…", parse);
		
		player.AddLustFraction(0.5);

		Text.NL();
		Text.Add("You feel more horny.", parse, 'bold');
		
		_.each(party.members, function(ent) {
			Status.Buff(ent, {hours: 24, Lib: 1.1});
		});
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("When everyone is seated - be it on stools dragged in, fallen logs or on the dirt ground, Cveta stands, adjusts the silken sash about her waist, and addresses her audience.", parse);
		Text.NL();
		Text.Add("<i>“Today, I will be playing ‘The Magister’s Aurora’, composer unknown, three movements in G Major. Please, relax and enjoy yourselves.”</i>", parse);
		Text.NL();
		Text.Add("With that, she gathers her lyre in her arms and begins, supporting the instrument with her petite frame as she plays. The music is slow and crystal-clear, an amorphous, ethereal quality to it as she works the strings with her fingers. Each note is deliberately drawn out, allowed to ring through the air and fade away before it’s followed by the next, the slow tempo occasionally punctuated by bursts of liveliness that link the verses together like the chains of a necklace link gemstones.", parse);
		Text.NL();
		Text.Add("Gradually, you can’t help but feel your eyes growing heavier, and even though you know it would be poor form to fall asleep during a performance, the world about you seems darkened and muted. In its place, a sense of vastness, of countless stars in the sky, of enormous, immortal suns. Each one is visible to your mind’s eye in perfect detail, and though you know the intervening distance must be immense, all you’d need to do to touch them would be to simply reach out…", parse);
		Text.NL();
		Text.Add("The pace of the music quickens, and you’re vaguely aware that Cveta has begun to accompany her instrument with her voice, the music of birdsong melding with that of the lyre.", parse);
		Text.NL();
		Text.Add("There is more to existence than can ever be perceived. Taste the colors of music. Feel the song of light upon your skin. The more you learn, the less you can truly say you know as your awareness of the whole’s immense vastness expands.", parse);
		Text.NL();
		Text.Add("The music slows again once more; even though there are no lyrics, the tale within unfolds before your ears. The magister sees the aurora - a splash of light in the winter sky - and wonders of the origins of such beauty. He crafts an elaborate system of lenses and mirrors to study it, makes charts and notes as to when the phenomenon appears, eventually ends up devoting his life to uncovering the secret the mysterious light display holds.", parse);
		Text.NL();
		Text.Add("Even unto his death, the magister never discovers the source of the aurora, yet through chasing its origins, learns so much to pass on to the next generation.", parse);
		Text.NL();
		Text.Add("Gradually, the melody begins to fade, the pause between each note lengthening, the movements of Cveta’s fingers still smooth and practiced. With great deliberation, she plucks the strings of her lyre for the final time, then closes her eyes and bows her head even as the veil begins to lift from your own thoughts, now sharp, refreshed and possessed of a clarity you’d scarcely thought possible.", parse);

		Text.NL();
		Text.Add("You feel more quick-witted.", parse, 'bold');
		
		_.each(party.members, function(ent) {
			Status.Buff(ent, {hours: 24, Int: 1.1});
		});
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("Once everyone is calmed - a few of the more unruly outlaws shushed into silence by their peers - Cveta stands and hefts her violin from its case, no simple undertaking for her small frame.", parse);
		Text.NL();
		parse["dawn"] = dawn ? "morning" : "evening";
		Text.Add("<i>“Thank you all for being present this [dawn],”</i> she says. <i>“Today, I will be playing ‘Defiance’ by Fenris Alwyn. Do enjoy; I believe it represents well what we all feel about the excesses of Rigard.”</i>", parse);
		Text.NL();
		Text.Add("Without further ado, the songstress launches into a blitz of music, an explosive start that only grows more intense as tortured notes are wrung out of her violin’s strings like water out of a stone. The furious melody that results is quick and lithe, as slippery as greased lightning, and possessed of a rampant, resilient energy that seeks release by… well, practically anything, in fact. If you calm your mind and slow your breathing, you can practically <i>feel</i> it seeping into you, tying your muscles in knots, coiling tight your thoughts, waiting for sudden release.", parse);
		Text.NL();
		parse["comp"] = party.Num() == 2 ? party.Get(1).name :
		                party.Num() >  2 ? "your companions" : "";
		parse["c"] = party.Num() > 1 ? Text.Parse(", even [comp],", parse) : "";
		Text.Add("You’re not the only one to fall under the spell of Cveta’s music - practically everyone else present[c] is looking increasingly alert and wound-up. The watch and patrols aren’t going to be napping on the job today, that’s for sure.", parse);
		Text.NL();
		Text.Add("Your heart is pounding, your blood fire and lightning in your veins. Even Cveta herself isn’t impervious to her own performance - the songstress’ arms and fingers are a blur as she plays, and you wonder if she’s going to have to replace the strings on her violin when she’s done. Listening to Cveta, you could run forever, leap over walls and chasms, swim the mightiest ocean - and all without breaking a sweat.", parse);
		Text.NL();
		Text.Add("As impossible as it sounds, the screaming from Cveta’s violin can only intensify, most of the outlaws shouting and chanting along to the music, fists, paws and claws alike pumping in the air, the resultant rabble of noise a twin to the screeching or Cveta’s violin up to the point she finishes with a brazen flourish, and lets the bow in her hand hang limply by her side.", parse);
		Text.NL();
		Text.Add("The sudden silence hits like a ton of bricks, a deathly quietness hanging about the fire pit like a thick blanket. Then, and only then, is the inferno in your body allowed to slow.", parse);

		Text.NL();
		Text.Add("You feel swifter.", parse, 'bold');
		
		_.each(party.members, function(ent) {
			Status.Buff(ent, {hours: 24, Dex: 1.1});
		});
	}, 1.0, function() { return cveta.Violin(); });
	scenes.AddEnc(function() {
		parse["dawn"] = dawn ? "morning" : "evening";
		Text.Add("It’s a little while before everyone is seated and settled down - seems like everyone in camp is a little restless this [dawn] for some reason - but at last, relative silence falls over the fire pit, and the show can go on.", parse);
		Text.NL();
		Text.Add("<i>“Today,”</i> Cveta announces as she stands and dusts off the seat of her gown, <i>“I will be singing ‘Golden Aeons’, by Lady Thera of the equally Golden Plains. Please, calm yourselves and enjoy what I have to offer.”</i>", parse);
		Text.NL();
		Text.Add("With that, she takes a deep breath, hums a little, and bursts into song.", parse);
		Text.NL();
		Text.Add("Instead of the high pitch of Cveta’s usual soprano, the songstress intentionally depresses her voice, projecting forth a rich, mellow melody and letting it sweep over her audience like a wave of gold over a shoreline. It’s a salve for the ears, and you can’t help but feel more relaxed as she continues to sing, letting your aches and worries be lifted away by the tide of her music.", parse);
		Text.NL();
		if(party.InParty(momo)) {
			Text.Add("<i>“She’s pretty good, don’t you think?”</i> Momo says cheerfully, her tail swaying in time with Cveta’s singing. <i>“Although you’ve got to wonder how she crams a voice like that into her itty bitty self. You think she’d appreciate a nice meal? Poor thing could definitely use some meat on her bones.”</i>", parse);
			Text.NL();
		}
		Text.Add("There’s warmth in the music, ridiculous as it sounds. It’s in the air, filling your lungs with each breath you take, thick and cloying to the touch as it seeps through your skin and flesh, right down to the bone. It fills the little world that consists of the fire pit in the middle of the outlaws’ camp, which so just happens to be the entirety of the world at the moment. Hardened and weary as each and every outlaw in the audience is - and as they have every right to be - at least they look less resentful, less downtrodden after the ministrations of Cveta’s smooth, silken voice.", parse);
		Text.NL();
		Text.Add("The songstress herself is lost in the effort of bringing forth her music, her single uncovered eye locked onto something unseen in the far distance, her bosom heaving with each breath she draws to turn into song. This is her gift, which she has shared with you, the warmth of the slow, drawling music filling you up and reminding you of sweet summer scents and fruit fresh from the bough, a warmth that lingers in the core of your chest and makes you want to share it with others…", parse);
		Text.NL();
		Text.Add("At long last, Cveta’s song begins to fade, the songstress lingering on her last few notes before letting the music trail off into nothingness. With careful deliberation, she folds in upon herself, takes a step back, then casts her gaze over her audience to survey her handiwork.", parse);

		Text.NL();
		Text.Add("You feel more charming.", parse, 'bold');
		
		_.each(party.members, function(ent) {
			Status.Buff(ent, {hours: 24, Cha: 1.1});
		});
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.NL();
	parse["dawn"] = dawn ? "morning" : "evening";
	Text.Add("<i>“I am done,”</i> the bird-morph states flatly, taking a full curtsey to a smattering of applause. <i>“Thank you for being here this [dawn].”</i> With that, she gathers herself and steps away from the fire pit, quickly slipping away into the audience and out of sight. One by one, the outlaws rise from their feet and wander off, throwing glances back to the fire pit, as if hoping there'll be an encore.", parse);
	Text.NL();
	parse["dawn"] = dawn ? "risen" : "set";
	Text.Add("It's with reluctance that you pry yourself from your seat and head off about your business, the melody of Cveta's music still ringing in your head. Above you, the sun has already [dawn] - goodness, has so much time really passed?", parse);
	Text.Flush();
	
	cveta.relation.IncreaseStat(25, 2);
	outlaws.relation.IncreaseStat(25, 1);
	TimeStep({hour : 2});
	
	if(cveta.flags["Met"] >= CvetaFlags.Met.ViolinQ && cveta.flags["Met"] < CvetaFlags.Met.Available)
		Gui.NextPrompt(CvetaScenes.ViolinPrompt);
	else if(cveta.flags["Met"] < CvetaFlags.Met.ViolinQ && cveta.Relation() >= 10 && cveta.violinTimer.Expired())
		Gui.NextPrompt(CvetaScenes.ViolinApproach);
	else
		Gui.NextPrompt();
}

CvetaScenes.DreamRoses = function(ravenTrigger) {
	var parse = {
		raven : Scenes.Dreams.RavenText(ravenTrigger, " and a raven perched on one of the thorny rosebushes", " and the familiar form of a raven perched on one of the rosebushes, something you should remember")
	};
	
	Text.Add("Roses.", parse);
	Text.NL();
	Text.Add("They stretch away from you in all directions as far as the eye can see, rosebushes dotting the grassy earth, woody vines that creep along the ground, petals that drift through the air, carried in from some unknown source by the stiff breeze that blows across the fields unimpeded. Red, white and blue, roses, roses everywhere.", parse);
	Text.NL();
	Text.Add("And in the midst of it all, Cveta. She stands stiffly in the warm sunlight, head bowed and wings spread as she sings. There is no one to hear her save you[raven], yet she sings anyway, the melancholy melody of the bird-morph’s divine soprano filling the air.", parse);
	Text.NL();
	Text.Add("You step forward to approach Cveta, but run face-first into an invisible barrier extending about an arm’s length from her. Testing the barrier only reveals that it encircles her completely with its confines - around, over, even under when you try to dig into the soft, loamy soil of the rose fields. Neither does trying to call to her from without the barrier work - even if she could hear you from within, she’s completely insensate to anything and everything.", parse);
	Text.NL();
	Text.Add("Everything, but her music.", parse);
	Text.NL();
	Text.Add("It is then you realize why the caged bird sings.", parse);
	Text.NL();
	Text.Add("<i>Music is my only escape,</i> the melody speaks to you. <i>Without it, I will wither and die, trapped in this shell as I am.</i>", parse);
	Text.NL();
	Text.Add("You wake, feeling strangely saddened.", parse);
}


CvetaScenes.DreamBrood = function(ravenTrigger) {
	let player = GAME().player;

	var parse = {
		skinDesc : function() { return player.SkinDesc(); },
		playername : player.name,
		raven : Scenes.Dreams.RavenText(ravenTrigger, " Off in the distance, high above the two of you, a raven circles in the air, its dark feathers starkly contrasting against the colorful scene. You can’t quite make it out, but does it look… jealous?", " There’s that raven again, spying on the two of you from up high in the clouds, the voyeuristic little thing. You should really remember it when you wake up.")
	};
	
	Text.Add("<i>“Wake up, beloved.”</i>", parse);
	Text.NL();
	Text.Add("You groan and roll over in the grass, the warmth of gentle spring sunlight on your [skinDesc] and against your lidded eyes. A breeze blows, bringing with it the scent of wildflowers and unripe fruit.", parse);
	Text.NL();
	Text.Add("<i>“Please, wake up.”</i> The voice drips so much honey, it’s practically impossible to disobey. Slowly, you open your eyes to find Cveta kneeling over you, wearing absolutely nothing but her gloves. Gone is the thin, waifish creature that you first met in the outlaws’ camp, now replaced by this curvy, full-bodied Goddess and her equally alluring voice. As her brood has swelled, so have her breasts and hips to better provide for her many chicks; the feathers upon her chest can no longer hide the rise of her nipples, small bumps beneath her glorious, vibrant feathers, just waiting to be uncovered and teased.", parse);
	Text.NL();
	Text.Add("Not quite gone is the prudish demeanor, but it’s nice to know that she can be an absolute slut just for you. To be honest, it makes it feel a bit special.", parse);
	Text.NL();
	Text.Add("Judging by her flat belly, mischievous glint in her eye and the fact that the feathers about her groin are utterly soaked and glistening, it’s clear what your beautiful bird wants, and she wants it now.[raven]", parse);
	Text.NL();
	Text.Add("<i>“I have been practicing my mating song again, [playername],”</i> Cveta croons, even as you reach up to run your fingers through her luscious feathers and across her wide, sumptuous, and above all, <i>fertile</i> hips. She tosses her head in that way only she can, and the way the waterfall of her crimson locks flows back into place is a sight to behold. <i>“Want to hear it?”</i>", parse);
	Text.NL();
	Text.Add("Without waiting for your reply, she opens her beak and begins to sing…", parse);
	Text.NL();
	Text.Add("You wake in a cold sweat, feeling slightly disappointed that you didn’t manage to remember any of the song.", parse);
}


//Trigger this the next time the player attempts to approach Cveta in her tent after the quest is over, regardless of success or failure.
CvetaScenes.PostBullTowerPerformance = function() {
	let player = GAME().player;
	let outlaws = GAME().outlaws;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name,
		skin : function() { return player.SkinDesc(); }
	};
	
	Text.Clear();
	Text.Add("Approaching the familiar sight of Cveta’s tent, you note the flaps have been thrown wide open, allowing light to pour into its interior. Almost as if someone knew you were coming and wanted to invite you in - and sure enough, Cveta appears at the entrance, beckoning you forward. She’s evidently made more of an effort to doll up today; the differences are subtle but noticeable - an extra shine to her hair, the intense gaze that her uncovered eye holds, the smoothness of her gown. You mustn’t be moving fast enough for her liking, because she steps out into the sunlight and catches hold of your arm, gently wrapping her gloved hands about it.", parse);
	Text.NL();
	Text.Add("<i>“[playername]. I was rather hoping you would come.”</i> She rubs her gloved hands along your arms, her fingers playing on your [skin], and eases you into the tent with a minimum of fuss.", parse);
	Text.NL();
	Text.Add("Well, you did, and here you are. What’s the special occasion?", parse);
	Text.NL();
	Text.Add("<i>“I…”</i> she hesitates a moment, scratching her chin before leading you into her tent. </i>“I have composed a short piece of music, and would like you to evaluate its merits.”</i>", parse);
	Text.NL();
	Text.Add("Well, you can do that, but what’s so special about this particular composition that’s gotten her all antsy?", parse);
	Text.NL();
	Text.Add("<i>“Ah, well, I composed it specifically for you.”</i>", parse);
	Text.NL();
	Text.Add("For you?", parse);
	Text.NL();
	Text.Add("<i>“Yes. Ever since we left for Bull Tower together, I have been doing a little self-reflection. You have not just done me, but also those I care for, a favor, and it is the least I can do to repay you. Please?”</i>", parse);
	Text.NL();
	Text.Add("Oh, all right.", parse);
	Text.NL();
	if(outlaws.flags["BT"] & OutlawsFlags.BullTower.BlueRoses) {
		Text.Add("<i>“Before that, though, there is something else I would like to show you,”</i> she says, reaching into a corner by the entrance and drawing out something with both hands - the small pot that holds the rose plant you filched from Bull Tower. <i>“See?”</i>", parse);
		Text.NL();
		Text.Add("Yes, you see. On closer inspection, it’s evident that the plant is perking up, looking far less wilted than it was back in the warehouse. Goodness knows what Preston would have done with such a treasure - nothing good, that’s for sure.", parse);
		Text.NL();
		Text.Add("It’s doing very well, you agree.", parse);
		Text.NL();
		Text.Add("<i>“I will have to move it somewhere where it can truly grow and flourish, but that is a little while off yet,”</i> she says with a sigh. <i>“Maybe by the willow trees, if nothing else, but I do hope a more suitable location will present itself.</i>", parse);
		Text.NL();
		Text.Add("<i>“Enough banter, though. Allow me to show you what I have prepared.”</i>", parse);
		Text.NL();
	}
	Text.Add("Ushering you to your seat on her bed, Cveta opens her trunk and brings out her violin before closing it and seating herself on the lid. Checking over both instrument and bow a few times to make sure the strings are in tune and the wood in good condition, the songstress clears her throat and takes a deep breath.", parse);
	Text.NL();
	Text.Add("You ask if the piece has a title yet.", parse);
	Text.NL();
	Text.Add("<i>“I am afraid not,”</i> she replies. <i>“Nothing I managed to come up with sounded suitable.”</i>", parse);
	Text.NL();
	Text.Add("Well, that can come later. For now, could she please play?", parse);
	Text.NL();
	Text.Add("Nodding silently, Cveta brings her instrument to her shoulder and begins.", parse);
	Text.NL();
	
	var Stats = {
		Str : 0,
		Spi : 1,
		Dex : 2,
		Cha : 3,
		MAX_NUM : 4
	};
	var stats = [
		player.Str(),
		player.Spi(),
		player.Dex(),
		player.Cha()
	];
	
	var maxstat = stats[Stats.Str];
	var stat_idx = Stats.Str;
	for(var i = 1; i < Stats.MAX_NUM; i++) {
		if(stats[i] > maxstat) {
			maxstat = stats[i];
			stat_idx = i;
		}
	}
	
	if(stat_idx == Stats.Str) {
		Text.Add("The first impression you get from the opening verses is how <i>steady</i> they are. Unflinching, possessed of a immense power that yet lies unseen; a strong current hidden beneath a river’s calm surface, invisible to the eye yet able lift barges and roll mighty boulders.", parse);
		Text.NL();
		Text.Add("There are no vocals this time, just Cveta and her violin; the way she shifts and sways is as much a part of the tune as the actual music is. The songstress’ eyes are wide as she stares into empty space, alternating between torturing and coaxing the instrument into producing the low-pitched notes just so.", parse);
		Text.NL();
		Text.Add("Slowly, you become aware of your heart pounding in your chest, of your pulse rushing through your fingers - and with it, the power of your gem.", parse);
		Text.NL();
		Text.Add("You are aware of a similar yet different pulse that courses through the fabric of this world.", parse);
		Text.NL();
		Text.Add("Waves and winds break across your body, yet fail to topple you.", parse);
		Text.NL();
		Text.Add("You are part of it, one with it.", parse);
		Text.NL();
		Text.Add("Forever.", parse);
		Text.NL();
		Text.Add("Immortal.", parse);
		Text.NL();
		Text.Add("Cveta’s fingers tremble, as does her bow, but the music holds; no notes are missed, each and every one holding in tune.", parse);
	}
	else if(stat_idx == Stats.Spi) {
		Text.Add("The first thing that strikes you about the music is how <i>large</i> it is. No, maybe large isn’t the proper word  - <i>weighty</i> would be more appropriate, for there’s definitely a sense of gravitas about the deep, somber notes that fill the tent and pour out into the daylight. It brings to mind someone larger than his or her body, someone who fills a room with their presence, someone who fills others - be it one way or the other…", parse);
		Text.NL();
		Text.Add("Accompanying this is a slow, rhythmic chanting, perhaps something that might be heard in a particularly pious temple. Contrasting with the timbre of the violin’s melody, the songstress’ beautiful soprano gives rise to quiet vocals - not trying to disappear or go unheard, but rather focusing the power of her voice into a smaller space such that it stands out against the strings.", parse);
		Text.NL();
		Text.Add("Reverent - no, perhaps even mystical; that is the outcome of the duality instrument and voice present. Images of vast skies, of stars twinkling in an eternal cosmos, of a void that stretches in all directions come to mind unbidden, a blank canvas waiting for you to fill it with life and color -", parse);
	}
	else if(stat_idx == Stats.Dex) {
		Text.Add("The first thing you notice about the tune is how quickly it <i>rolls</i>, a magnificent vivace that skips and leaps from verse to verse like an acrobat from perch to perch. Cveta’s fingers and bow slip across the violin strings like greased quicksilver, capering hither and thither to effect her performance.", parse);
		Text.NL();
		Text.Add("Even the vocals, though wordless, are tongue-twisting sequences - and yet Cveta manages to enunciate each and every one of them in quick succession. They should be nonsense - you <i>know</i> they mean nothing and form no proper words, yet you can’t help but get the impression the songstress is speaking in some foreign language, that it would all make sense if only you could find the key -", parse);
		Text.NL();
		Text.Add("With the music comes a sensation of quickness, of alacrity. Of flexibility and malleability, such that you feel like you are little more than a faint breeze in the air, slipping through cracks and slits with ease. You rush through the air, bounding from rooftop to rooftop and from there into the clouds, with little able to bar your path.", parse);
		Text.NL();
		Text.Add("Thousands of feet belonging to as many people, dancing about a pole while dressed in their best colors.", parse);
		Text.NL();
		Text.Add("A rhythm, a beat, a quickening of one’s pulse, a sensation of limberness in wit and limb that never seems to stop.", parse);
	}
	else { // Cha
		Text.Add("The music starts off somewhat slow and remains that way - a languid waltz that smacks of refinement and sensuality alike. There are no actual vocals this time around, but Cveta hums along to the music of her violin, the gentle caress of her voice emanating from somewhere deep within her breast. The movements of her fingers are tender and precise, coaxing the strings to produce the tones that she needs.", parse);
		Text.NL();
		Text.Add("In your mind’s eye, you dream of coy smiles and subtle gestures, of overwhelming self-assurance and confident gazes. A flattering outfit that obscures and leaves the imagination to fill in the gaps, more powerful than bare skin itself.", parse);
		Text.NL();
		Text.Add("And behind the music, a force that grasps, sways and entangles, a force that does not act upon the world, but rather, those with the capability to do so. To draw others to you, to repel them, to compel them with nothing, save your presence and force of will…", parse);
		Text.NL();
		Text.Add("A force that Cveta herself is very well acquainted with, too.", parse);
	}
	Text.NL();
	Text.Add("Once the final note sounds in the air, Cveta lets out the breath she’d been holding in, wings and shoulders sagging at the sudden release as she lowers her violin and set it back in its case. <i>“What do you think, [playername]? Does it suit you, who you think you are? I am not very good at words, so… I thought this would be the best way to express myself.”</i>", parse);
	Text.Flush();
	
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "Yes, it does quite fit you.",
		func : function() {
			Text.Clear();
			Text.Add("Why yes, you tell the songstress - it does sound a lot like you.", parse);
			Text.NL();
			Text.Add("A click of her beak. <i>“Thank goodness. I was a little worried - perhaps it is just my perspective, but you can be hard to read at times.”</i>", parse);
			Text.NL();
			Text.Add("Hard to read?", parse);
			Text.NL();
			Text.Add("<i>“Think of a book. It is not that the words are missing, but one cannot be completely sure what has been put to paper is what is meant…”</i> she steps back and casts an appraising eye on you. <i>“Well, it is good that I achieved what I set out to do.</i>", parse);
			Text.NL();
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	options.push({ nameStr : "No",
		tooltip : "No, that’s not how you see yourself.",
		func : function() {
			Text.Clear();
			Text.Add("Cveta looks a little worried for a moment, then the mood passes and her expression reasserts itself to her usual calm demeanor. <i>“Well, maybe I was wrong and misread you,”</i> she admits. <i>“But there is a difference between how one sees oneself and what one <b>is</b>. I can only read the latter, not the former.”</i>", parse);
			Text.NL();
			Text.Add("Why, is she accusing you of lacking self-awareness?", parse);
			Text.NL();
			Text.Add("<i>“Either that, or as I said, I misread you.”</i> She thinks a moment. <i>“It is not often that I distrust my own judgement and start to second-guess myself.</i>", parse);
			Text.NL();
			Gui.PrintDefaultOptions();
		}, enabled : true
	});
	
	Gui.Callstack.push(function() {
		Text.Add("<i>“Either way, thank you for being a good audience today.”</i>", parse);
		Text.NL();
		Text.Add("Considering that she composed the piece specifically for you, would you have done anything else?", parse);
		Text.NL();
		Text.Add("<i>“No… I suppose not. It still needs a title, though.”</i>", parse);
		Text.NL();
		Text.Add("You reach up and pat her on the head. She’s a clever girl, she’ll think of something soon enough.", parse);
		Text.NL();
		Text.Add("Cveta squirms a little under your touch, breaking away gently and giving you a nod. <i>“Well, [playername], I was hoping… well…”</i>", parse);
		Text.NL();
		Text.Add("Looks like she’s got something that needs saying, but can’t quite articulate it - quite a change from the usually frank bird that she is. Although what exactly it is, you can hazard a guess. Standing up, you announce that you’ll be going now, but should come back another time.", parse);
		Text.NL();
		Text.Add("<i>“Another time, then,”</i> Cveta says, standing herself and seeing you to the exit. <i>“I will see you later.”</i>", parse);
		Text.NL();
		Text.Add("<b>You may proposition Cveta for more kinds of interactions from now on.</b>", parse);
		Text.Flush();
		
		TimeStep({hour: 1});
		
		cveta.flags["Intimate"] |= CvetaFlags.Intimate.Introduced;
		
		Gui.NextPrompt();
	});
	
	Gui.SetButtonsFromList(options, false, null);
}

CvetaScenes.IntimatePrompt = function() {
	var parse = {
		
	};
	
	//[Nuzzle][Cuddle][Grope]
	var options = new Array();
	options.push({ nameStr : "Nuzzle",
		tooltip : "She may not be able to kiss you, but this is pretty good, too.",
		func : function() {
			CvetaScenes.IntimateNuzzle();
		}, enabled : true
	});
	options.push({ nameStr : "Cuddle",
		tooltip : "Embrace the beautiful bird’s warmth.",
		func : function() {
			CvetaScenes.IntimateCuddle();
		}, enabled : true
	});
	options.push({ nameStr : "Grope",
		tooltip : "Yes, you want to feel more of that flesh under her feathers.",
		func : function() {
			CvetaScenes.IntimateGrope();
		}, enabled : true
	});
	
	Gui.SetButtonsFromList(options, true, function() {
		Text.Clear();
		Text.Add("However, the small flirtation aside, you decide that you’re not quite in the mood for touchy-feely right now. Maybe later.", parse);
		Text.NL();
		Text.Add("Is it just you, or does Cveta look relieved? The expression flickers so quickly on her face that you can’t be sure it was even there…", parse);
		Text.Flush();
		
		CvetaScenes.Prompt();
	});
}

CvetaScenes.IntimateNuzzle = function() {
	let player = GAME().player;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name,
		hairLong : player.Hair().Long()
	};
	parse = player.ParserTags(parse);
	
	Text.Clear();
	Text.Add("Stepping forward, you gently move to ease Cveta’s lyre away from her; the songstress puts up a token resistance, then sighs lightly and allows you to set it by the foot of her bed. The music hasn’t stopped, though; faint as it is, she’s still humming gently in the back of her throat, and the hint of warmth in her music grows as you gather your pretty little pet up in your arms and press her against you.", parse);
	Text.NL();
	Text.Add("Cveta chirps, her touch warm and fluffy as she nestles against you, those wide, round eyes of hers closing in contentment, all sense of detached propriety melting away in an instant. The sharp tip of her beak nips and nibbles away instinctively, pinpricks of touch upon your [skin]. You run your hands down the small of her back and along the curves of her hips, feeling the fine fabric of her skirts bunch in your hands; it takes a while, but Cveta eventually does loosen up and nuzzles against your chest with the curved portion of her beak, letting out a childlike, happy chirp.", parse);
	Text.NL();
	Text.Add("There, doesn’t that feel much better?", parse);
	Text.NL();
	Text.Add("The songstress was never one for words, but her chirping and the faint fluttering of her wings tells you all you need to know. Running your fingers through Cveta’s long, flame-red hair, you press your face against her forehead and repay the favor. How she manages to always smell so clean and fresh while living amongst the outlaws may be one of Eden’s unsolved mysteries, but the warmth that she exudes, her body pressed firmly against yours, needs no explaining.", parse);
	Text.NL();
	if(player.HasLongHair()) {
		Text.Add("A shift of Cveta’s head, and a gentle nibble at your [hairLong] gets your attention - still in your embrace, the songstress has one of your locks in her beak, trying to tuck it away. Is she trying to preen you? She doesn’t seem to realize what she’s doing, though, so you’re more than content to let her continue the harmless gesture.", parse);
		Text.NL();
	}
	Text.Add("At length, Cveta is the first one to pull away, although there’s a little - all right, more than a little - reluctance in her movements. Her feathers and hair are a little mussed, but you’re sure they’ll fall right back into place soon with the kind of neatness magic that seems to happen about her.", parse);
	Text.NL();
	Text.Add("<i>“Come now, [playername],”</i> she says, wriggling out of your grasp. <i>“We both have more important things to do. I do not suppose you would mind showing yourself out, though? I feel a little woozy…”</i>", parse);
	Text.NL();
	Text.Add("Really? Because you hadn’t planned for anything else today.", parse);
	Text.NL();
	Text.Add("<i>“Yes, you do. Even if you do not know it. That may have been pleasant, but duty calls, [playername]. Work before pleasure.”</i>", parse);
	Text.Flush();
	
	TimeStep({hour: 1});
	
	CvetaScenes.Prompt();
	
	cveta.relation.IncreaseStat(100, 2);
	
	Gui.NextPrompt();
}

CvetaScenes.IntimateCuddle = function() {
	let player = GAME().player;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name,
		skin : function() { return player.SkinDesc(); }
	};
	
	Text.Clear();
	Text.Add("Just a cuddle can’t hurt, can it? Can it?", parse);
	Text.NL();
	Text.Add("Well, there’s no way to find out but to try. Slowly, carefully - almost like a cat sneaking up on unsuspecting prey - you inch your way closer to the proud and regal bird-morph, until you’re well into the bubble of personal space that she keeps about her. This close to her, the faint scent of sun-warmed grass and sweet ripe fruit reaches your nose, and you wonder if it’s some kind of perfume that she uses…", parse);
	Text.NL();
	Text.Add("Cveta hasn’t leaned in towards you - but she hasn’t shied away, either. That’s got to be a good sign. Sitting down next to her, you snake an arm about her slender waist, feeling the velvety material of her gown slide against your [skin]. The bird-morph shivers and stiffens under your touch, her music fading away as she stops playing, but eventually a small sigh escapes her beak and she allows you to support her weight. Even through her gown, you can sense the glorious warmth that radiates outwards from her heart - a warmth of which only a fraction reaches her feathers, but even that tiny amount is enough to give you the warm fuzzies just by holding her.", parse);
	Text.NL();
	Text.Add("<i>“This is not right,”</i> Cveta murmurs. <i>“It is not proper…”</i>", parse);
	Text.NL();
	Text.Add("Well, why not? What one does in public and in private are two completely different things, after all. Cveta chirps a bit, perhaps trying to articulate an answer, but gives up and snuggles up to you, resting her head on your shoulder.", parse);
	Text.NL();
	Text.Add("There, isn’t that much better? Even if propriety demands that she be all prim and proper in public, isn’t it good to let one’s hair down for a moment?", parse);
	Text.NL();
	Text.Add("Another chirp, and Cveta turns her head away from you this time, taking care to hide her expression. Will she ever be able to get over the hurdle of her self-consciousness? Perhaps she just needs a little encouragement - gently, you slide your hand down to the bird-morph’s skirts to caress her fluffy ass, eliciting an immediate reaction from her. You can imagine soft, silken down giving way under your touch, and although her butt isn’t the most shapely or grabbable you’ve encountered, it nevertheless has its own appeal - that, and you wonder if it might improve with keeping…", parse);
	Text.NL();
	Text.Add("<i>“[playername]…”</i>", parse);
	Text.NL();
	Text.Add("Yes?", parse);
	Text.NL();
	if(cveta.Relation() < 85) {
		Text.Add("<i>“N-no. Never mind.”</i>", parse);
	}
	else {
		Text.Add("A musical hum emanating from her throat, the songstress finally gives in and snuggles close, her elegance remaining unspoiled as she unabashedly shares all the warmth her body can muster.", parse);
		Text.NL();
		Text.Add("It feels very, very nice.", parse);
		Text.NL();
		Text.Add("Coming from someone more outgoing, the gesture would have been great in and of itself. Coming from Cveta, knowing she won’t do it for just anyone… well, that just makes it extra special.", parse);
	}
	Text.NL();
	Text.Add("The two of you stay that way for the next few… minutes? Hours? It’s hard to keep track of the passage of time when cuddled up with your beautiful bird, possessing her completely like the petite little thing she is - she was practically <i>made</i> to be held like this. Eventually, though, you become aware of the passage of time, and give Cveta a final pat on the butt before slowly withdrawing your arm, taking care to let it slide against her waist as you do so.", parse);
	Text.NL();
	Text.Add("There, wasn’t that better?", parse);
	Text.NL();
	Text.Add("<i>“Perhaps…”</i> she won’t look you in the eye while saying it, though. It’s a start, at the very least. Even if Cveta’s not the talkative type, at least she knows she has more than her music with which to express herself; perhaps it would be best to let her work things out for herself for a little while. Standing, you give the songstress one last appreciative pat on the head and tell her not to worry, then excuse yourself from her tent, leaving her staring at your retreating form.", parse);
	Text.NL();
	Text.Add("After all, just like music, a simple touch can indeed speak so much more than mere words.", parse);
	Text.Flush();
	
	TimeStep({hour: 1});
	
	CvetaScenes.Prompt();
	
	cveta.relation.IncreaseStat(100, 2);
	
	Gui.NextPrompt();
}

CvetaScenes.IntimateGrope = function() {
	let player = GAME().player;
	let cveta = GAME().cveta;

	var parse = {
		playername : player.name
	};
	parse = player.ParserTags(parse);
	
	var first = !(cveta.flags["Intimate"] & CvetaFlags.Intimate.Groped);
	
	Text.Clear();
	if(cveta.Relation() >= 80) {
		cveta.flags["Intimate"] |= CvetaFlags.Intimate.Groped;
		
		if(first) {
			Text.Add("Cveta looks unsure at your proposition, her playing coming to an abrupt stop as she reaches up to brush away her hair from her eyes. She’s clearly trying to buy time for her to think things through, but all the time in the world won’t save her, not with the jumbled, warring thoughts and desires that must be going through her head.", parse);
			Text.NL();
			Text.Add("<i>“I…”</i>", parse);
			Text.NL();
			Text.Add("Yes?", parse);
			Text.NL();
			Text.Add("She sets down her instrument a little hesitantly. <i>“If this is your desire, [playername], then let us begin posthaste.”</i>", parse);
			Text.NL();
			Text.Add("The songstress might be reluctant now, but you’re sure she’ll change her attitude once you’re done with her.", parse);
		}
		else {
			Text.Add("A small, contented chirp escapes Cveta’s throat as she stops playing and sets down her instrument. With a soft flutter of her wings, she closes the short distance between the two of you, then rubs her beak against your shoulder eagerly. You pat Cveta on the head and tousle her hair in return, feeling her breath quicken against your [skin].", parse);
			Text.NL();
			Text.Add("Well, she was never the best at expressing herself with words, so this is probably the best way to go about it.", parse);
		}
	}
	else {
		Text.Add("The moment the words leave your mouth, there’s an uncomfortable silence in the tent, the music coming to an abrupt stop. While Cveta doesn’t get all indignant at you bringing up the idea, she does seem quite reluctant… while you’ve done your best to break down her inhibitions, it’s not quite enough - yet.", parse);
		Text.NL();
		Text.Add("After all the two of you have been through together, you’re almost there. All you need to do is to nudge the songstress a little to send her careening over the edge, get a little closer to her. You’ve waited this long; a little more isn’t going to hurt.", parse);
		Text.Flush();
		CvetaScenes.IntimatePrompt();
		return;
	}
	Text.Add(" Yes… this is what you want. Your desire is to hold your fluffy little pet, run your fingers through her feathers and hair… and get to know the flesh that lies underneath. There’s no reason to dawdle any more - a quick twist of your fingers has the clasp that holds up her top undone. Cveta shrugs, a single elegant motion of shoulders and wings alike, and the fabric cascades off her like a waterfall to land in her cot.", parse);
	Text.NL();
	Text.Add("The songstress wears no bra - her chest is hardly large enough to warrant any need for support - and so her front is exposed for you to admire, two small mounds of fluff sitting upon her chest, her torso narrowing down to her painfully thin waist. Easing her into your embrace, you reach around her and run an exploratory hand down her skirts. She’s as flat behind as she is in front, and the songstress wriggles in your grasp as you cup her ass through her skirts, fingers tickling the plumage of her tailfeathers through the skirt of her gown.", parse);
	Text.NL();
	Text.Add("You have to ask, are all the women in her line so - ah - unendowed?", parse);
	Text.NL();
	Text.Add("<i>“Mostly,”</i> Cveta admits, not looking you in the eye. <i>“Although Nana Nadia was the exception. When I was younger, she used to tell me that she practically swelled up when carrying my aunts and uncles, and never quite went down after that.”</i>", parse);
	Text.NL();
	Text.Add("Well, you’ll just have to work doubly hard, then. Best to start from familiar territory and ease her in that way - breaking away from Cveta, you place your hands on the sides of your petite pet’s waist, running your palms up and down in wide circles, closing in on her sensitive tummy. She chirps with increasing urgency and hunger as you continue to stroke her, clearly unused to this sort of physical contact. When you think she’s had enough to be nice and pliable, you slide your hands upwards through her warm feathers, your fingers trailing along the rise of her ribs and chest to find her breasts.", parse);
	Text.NL();
	Text.Add("With how flat Cveta is, she doesn’t even fill your cupped hands - you have to squeeze down to feel the rigid tips of her nipples brush your palms through her fluff and feathers - but that doesn’t diminish the need with which your petite pet pushes her chest forward, presenting herself in a bid to try and make up for her lack of titflesh.", parse);
	Text.NL();
	Text.Add("Soothing her with a hushed murmur, you press down and begin kneading gently, Cveta’s heavy breathing turning into quick pants as she feels your fingers exploring her sensitive mounds. Taking her right nipple between finger and thumb, you tease the small, hard nub of flesh, feeling it stiffen even further under your ministrations.", parse);
	Text.NL();
	Text.Add("<i>“A-ah!”</i>", parse);
	Text.NL();
	Text.Add("One wonders how she’s meant to feed a hungry brood with these if they’re so sensitive, but here and now, that fact is all the better for you. She’s so waifish and delicately formed, you feel like you could accidentally snap her with a wrong move.", parse);
	Text.NL();
	Text.Add("Cveta whimpers, leaning in and craning her head upwards to nip at your neck with the tip of her beak, pinpricks of sensation erupting on your [skin] with each nip and nibble. With her this close to you, you can smell a distinctly floral scent rising from her person - does she use perfume? - as she eagerly presses herself against you. You can’t see it, but you can definitely <i>feel</i> the flush of heat that continues to blossom in her chest, a fruitful warmth that escapes with her breath.", parse);
	Text.NL();
	Text.Add("Almost done with her petite bosom, you work away at each breast in turn with one hand, doing your best to milk her like a barn animal. There’s barely enough to grasp there, but barely is the key word here. The songstress is unable to hold back the moan that escapes her beak, rubbing the gentle concave of her midriff against you, desperate to assuage the ache that’s crept into it. It keeps her occupied while you undo the knot that keeps her sash tied, at the very least - the long vermillion ribbon of silk and satin drifts to the ground swimming and twirling, leaving you free to stick the now-free hand past her waistband and into the skirts of her gown.", parse);
	Text.NL();
	if(first)
		Text.Add("Is that silk you feel beneath your fingers? You can’t see it, but you can definitely feel the exquisite fabric, sodden with her feminine honey. Silken panties… well, did you expect anything different? She <i>is</i> who she is, after all.", parse);
	else
		Text.Add("Just as you expected, Cveta’s silken panties are sopping wet; you can feel the distinctive slickness of all that pussy juice that’s causing the fabric to stick to her mound.", parse);
	Text.Add(" At least there’s no doubt she wants it, and badly at that. Gradually, you ease up on Cveta’s chest, sliding that hand down to your pretty bird’s waist while reaching for her crotch with the one already in her skirts. She sings as you rub away, her gloved fingers digging into your back, small breasts heaving…", parse);
	Text.NL();
	Text.Add("…Come to think of it, you’re vaguely aware of a faint warmth growing in the songstress’ lower belly, pressed against your [skin]…", parse);
	Text.NL();
	Text.Add("You’re half-tempted to finger Cveta, to strip off those delicate silken underclothes and stick your fingers into her oozing gash, but maybe that would be pushing your luck - and besides, it’s not like she’ll be going anywhere in a hurry. Even without making direct contact, you can sense the petals of her womanly flower swelling up in anticipation.", parse);
	Text.NL();
	Text.Add("<i>“No… that is enough,”</i> she moans. <i>“I… I…”</i>", parse);
	Text.NL();
	Text.Add("From the way her eyes are practically bulging and unfocused to her trembling legs, it seems she’s on the verge of cumming all over you. All it would take is a gentle touch in the right place to set off your petite pet - but will you do it?", parse);
	Text.Flush();
	
	cveta.relation.IncreaseStat(100, 3);
	
	TimeStep({minute: 45});
	
	//[Yes][No]
	var options = new Array();
	options.push({ nameStr : "Yes",
		tooltip : "Screw that, she’s too far gone. Full steam ahead!",
		func : function() {
			Text.Clear();
			Text.Add("Stop? Screw that, even if you stopped now she’d probably just push herself over the edge anyway. A few deft strokes of your fingers against your broody bird’s pussy is all it takes to send Cveta over the edge, a series of sharp trills rising from her throat as her feminine honey overflows; her pussy lips clench, desperately seeking something to draw into her. Unable to keep standing, Cveta collapses against you, cum stains starting to spread on the skirt of her gown, and you carefully set her down on her bed.", parse);
			Text.NL();
			Text.Add("<i>“N-no.”</i> Burying her face in her gloved hands, the songstress begins to sob in shame. You move in to comfort her, but she waves you off. <i>“L-leave me be for now.”</i>", parse);
			Text.NL();
			Text.Add("It did feel good, didn’t it?", parse);
			Text.NL();
			Text.Add("Her voice trembles. <i>“Just go. Please.”</i>", parse);
			Text.NL();
			Text.Add("If she’s acting like this, there’s probably some kind of hang-up she’s having. Maybe it’s just that she’s a prude, but that would be too easy… turning that question over in your mind, you excuse yourself. There’s got to be some way you can break whatever’s holding her back…", parse);
			Text.Flush();
			
			TimeStep({minute: 15});
			
			Gui.NextPrompt();
		}, enabled : true
	});
	options.push({ nameStr : "No",
		tooltip : "Let her calm down. Pushing her too far now may make her clam up later.",
		func : function() {
			Text.Clear();
			Text.Add("Carefully, you withdraw your hand from Cveta’s skirts and set her down on her bed, giving her time to calm her thoughts. It takes a good while, but eventually her panting slows as the heat subsides, her gaze becoming focused once more.", parse);
			Text.NL();
			Text.Add("<i>“Oh…”</i>", parse);
			Text.NL();
			Text.Add("That felt nice, did it not?", parse);
			Text.NL();
			Text.Add("<i>“Well, it did. But I was…”</i> she looks down at her top, splayed out beside her on the bed, then at her sash still on the floor. <i>“I made a promise, you see… I need to sort some things out, think some things through. Would you mind leaving for the moment?”</i>", parse);
			Text.NL();
			Text.Add("It doesn’t look like Cveta is actually pushing you away, but there’s clearly some kind of hang-up she’s having over this whole thing. There’s got to be some way you can break whatever’s holding her back… even if the opportunity may not be here just yet. Shrugging, you wipe yourself off with a nearby cloth and promise to be back later after she’s calmed herself.", parse);
			Text.Flush();
			
			TimeStep({minute: 15});
			
			Gui.NextPrompt();
		}, enabled : true
	});
	Gui.SetButtonsFromList(options, false, null);
}


export { CvetaScenes };
