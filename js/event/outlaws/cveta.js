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
	NotMet       : 0,
	MariaTalk    : 1,
	FirstMeeting : 2,
	Accessible   : 3
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

Cveta.prototype.PerformanceTime = function() {
	return (world.time.hour >= 6 && world.time.hour < 8) || (world.time.hour >= 18 && world.time.hour < 20);
}
Cveta.prototype.WakingTime = function() {
	return (world.time.hour >= 6 && world.time.hour < 20);
}
Cveta.prototype.InTent = function() {
	return (world.time.hour >= 8 && world.time.hour < 10) || (world.time.hour >= 2 && world.time.hour < 6);
}
Cveta.prototype.Violin = function() { //TODO
	return false;
}

Scenes.Cveta.CampDesc = function() {
	var parse = {
		
	};
	
	Text.Add("Near the back of the outlaws' camp, you can make out the modest form of Cveta's tent.", parse);
	Text.NL();
	if(!cveta.WakingTime())
		Text.Add("The tent flaps are sealed at the moment, the songstress having set with the sun.", parse);
	else if(cveta.PerformanceTime())
		Text.Add("However, it is empty at the moment, Cveta herself having ventured out for her twice-daily performances. It's not too late to join in if you want to listen to her play.", parse);
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

[Princess] - 
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

//TODO Buffs
Scenes.Cveta.Performance = function() {
	var parse = {
		playername : player.name,
		skinDesc : function() { return player.SkinDesc(); },
		cocks : function() { return player.MultiCockDesc(); },
		vagDesc : function() { return player.FirstVag().Short(); }
	};
	
	var dawn = world.time.hour < 12;
	
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
		
		//TODO
		//#Party gains 10% strength for the next twelve hours.
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
		//TODO
		//#Party gains 10% stamina for the next twelve hours.
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
		Text.Add("Absolute silence reigns in the clearing before the fire pit, the expectation in the air palpable as Cveta brings her gloved hands upwards, clasping them before her bosom. Slowly, she closes her eyes as if meditating, then raises her bowed head and bursts into song.", parse);
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
		//TODO
		//#Party gains 10% spirit for the next 12 hours.
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("Satisfied that everyone who will be present is accounted for and paying attention, Cveta rises and acknowledges their presence with a dip of her head.", parse);
		Text.NL();
		Text.Add("<i>“Today, I will be performing ‘The Bells of Rigard’ by Alan Witt, serenade number three in D major. Please, calm yourself and enjoy the music.”</i>", parse);
		Text.NL();
		Text.Add("With that, the bird-morph reseats herself and lifting her lyre into her lap. She gives its strings a few experimental strums, then launches into the melody in earnest.", parse);
		Text.NL();
		Text.Add("Despite her telling you to calm yourself, it’s hard to follow that advice. The music that rings from her strings is sweet and cloying like a caramel confection, flowing through the air like syrup and moving across your [skinDesc] like a lover’s caress. Try as you might, you can’t help but feel your thoughts start drifting towards some of the more lusty dreams you’ve had of late, wondering how nice it would be if some of them could be made reality…", parse);
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
		//TODO
		//#Party gains 10% libido for the next 12 hours.
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
		//TODO
		//#Party gains 10% intelligence for the next 12 hours.
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
		//TODO
		//#Party gains 10% dexterity for the next 12 hours.
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
		//TODO
		//#Party gains 10% charisma for the next 12 hours.
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
	world.TimeStep({hour : 2});
	
	Gui.NextPrompt();
}
