/*
 * 
 * Define Cveta
 * 
 */
function Cveta(storage) {
	Entity.call(this);

	// Character stats
	this.name = "Cveta";
	/*
	//this.avatar.combat = Images.maria;
	
	this.maxHp.base        = 100;
	this.maxSp.base        = 80;
	this.maxLust.base      = 50;
	// Main stats
	this.strength.base     = 20;
	this.stamina.base      = 22;
	this.dexterity.base    = 16;
	this.intelligence.base = 17;
	this.spirit.base       = 15;
	this.libido.base       = 20;
	this.charisma.base     = 18;
	
	this.level = 5;
	this.sexlevel = 3;
	*/
	this.body.DefFemale();
	this.FirstBreastRow().size.base = 5;
	this.Butt().buttSize.base = 3;
	this.SetSkinColor(Color.red);
	this.SetHairColor(Color.red);
	this.SetEyeColor(Color.green);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = Cveta.Met.NotMet;

	if(storage) this.FromStorage(storage);
}
Cveta.prototype = new Entity();
Cveta.prototype.constructor = Cveta;

Cveta.Met = {
	NotMet    : 0,
	MariaTalk : 1,
	FirstMeeting : 2
};

Scenes.Cveta = {};

Cveta.prototype.FromStorage = function(storage) {
	this.FirstVag().virgin   = parseInt(storage.virgin) == 1;
	this.Butt().virgin       = parseInt(storage.avirgin) == 1;
	
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Cveta.prototype.ToStorage = function() {
	var storage = {
		virgin  : this.FirstVag().virgin ? 1 : 0,
		avirgin : this.Butt().virgin ? 1 : 0
	};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

// Schedule TODO
Cveta.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	return true;
}


/* TODO

#Add time-dependent “Performance” option to the outlaw camp’s main menu.

#Add description of Cveta’s tent to the outlaw camp’s description, but do not add the option to approach her yet.

 */

/* TODO
 * 
#Requires that the player have completed the Krawitz sequence
 */
Scenes.Cveta.MariaTalkFirst = function() {
	var parse = {
		playername : player.name
	};
	
	cveta.flags["Met"] = Cveta.Met.MariaTalk;
	
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
	
	world.TimeStep({minute: 15});
	
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
			Scenes.Cveta.FirstMeeting();
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

/* TODO
 * #Add “princess” option to Maria for if and when the player wants to pick this up again.

[Princess] - You've changed your mind. If Maria really can't sort out this so-called princess, maybe you can.
 */
Scenes.Cveta.MariaTalkRepeat = function() {
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
	Scenes.Cveta.FirstMeeting();
}

Scenes.Cveta.FirstMeeting = function() {
	var parse = {
		playername : player.name
	};
	
	cveta.flags["Met"] = Cveta.Met.FirstMeeting;
	
	Text.Add("Approaching the tent Maria pointed out, the faint sound of music reaches you as you draw close, that of a slow, dolorous piece being played on a string instrument of some sort. The music is strangely haunting, and reminds you of home, your life before you picked that gem from the mirror, of better times…", parse);
	Text.NL();
	if(Math.log(player.Spi()) < 4)
		Text.Add("Before you know it, you realize you've been standing in the same spot for a good five minutes, entranced by the strange melody emanating from the tent flaps. Wondering what just happened, you gather your wits and take the last few steps towards the tent.", parse);
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
	
	Scenes.Cveta.FirstMeetingPrompt(opts);
}

Scenes.Cveta.FirstMeetingPrompt = function(opts) {
	var parse = {
		
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
				Scenes.Cveta.FirstMeetingPrompt(opts);
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
				Scenes.Cveta.FirstMeetingPrompt(opts);
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
				Scenes.Cveta.FirstMeetingPrompt(opts);
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
				Text.Add("Whether the weather be fine<br/>", parse);
				Text.Add("Or whether the weather be not,<br/>", parse);
				Text.Add("We'll weather the weather,<br/>", parse);
				Text.Add("Whatever the weather,<br/>", parse);
				Text.Add("Whether we like it or not.”</i>", parse);
				Text.NL();
				Text.Add("Well. That seems to have put paid to <b>that</b> line of conversation.", parse);
				Text.Flush();
				Scenes.Cveta.FirstMeetingPrompt(opts);
			}, enabled : true,
			tooltip : "A desperate fallback for the conversationally deprived, but it's got to be something to talk about, right?"
		});
	}
	//TODO
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
			Text.Add("You're about to protest, but Cveta shakes her head. <i>“This is a camp of outlaws, of people of disparate walks of life who have banded together to oppose the cruel policies of Rigard's aristocracy. It is certainly not expected for a stranger to ask to come into another's abode within this camp and make small talk of little consequence. Trust between neighbours is… varied.", parse);
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
					Scenes.Cveta.FirstMeetingCont();
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
					Scenes.Cveta.FirstMeetingCont();
				}, enabled : true,
				tooltip : "Refuse to tell Cveta Maria sent you."
			});
			Gui.SetButtonsFromList(options, false, null);
		}, enabled : true,
		tooltip : "This clearly isn't going anywhere. Cveta clearly isn't the chatty sort, and you're beating your head against a brick wall."
	});
	Gui.SetButtonsFromList(options, false, null);
}

Scenes.Cveta.FirstMeetingCont = function() {
	var parse = {
		
	};
	parse["SunlightMoonlight"] = world.time.LightStr("Sunlight", "Moonlight");
	
	Text.Add("<i>“And with that, I think this brings our introduction to an end. It has a pleasure, I assure you, despite the circumstances under which we have been acquainted,”</i> Cveta says, rising from the stool and making a sweeping gesture towards the tent flaps. <i>“Allow me to show you out.”</i>", parse);
	Text.NL();
	Text.Add("Always so painfully polite, isn't she? The bird-morph takes your hand in hers and practically flows towards the exit, gently but firmly making it clear that she no longer desires your presence in her tent. [SunlightMoonlight] greets your face as you step out into the open and you make to return to the main body of the outlaws' camp, but you suddenly feel Cveta's hand on your shoulder.", parse);
	Text.NL();
	Text.Add("<i>“Before you depart, there is one last thing,”</i> Cveta says. <i>“Zenith has agreed to let me play for his merry band at dawn and dusk; he believes that some music will serve to inspire them and do something for morale, which could be better of late. If you care to hear some music aside from bawdy tavern songs, I would recommend that you make yourself present.", parse);
	Text.NL();
	Text.Add("“That is all.”</i>", parse);
	Text.NL();
	Text.Add("With that, the bird-morph retreats into her tent, and you hear the faint shuffling of string being tied from within. Seems like she doesn't want to be disturbed any further, and the reason for that becomes clear once the music begins to pick up again, its faint melody wafting through the air of the outlaws' camp.", parse);
	Text.Flush();
	
	world.TimeStep({hour: 1});
	
	Gui.NextPrompt();
}
