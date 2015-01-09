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
	this.flags["Herself"] = Cveta.Herself.None;

	if(storage) this.FromStorage(storage);
}
Cveta.prototype = new Entity();
Cveta.prototype.constructor = Cveta;

Cveta.Met = {
	NotMet       : 0,
	MariaTalk    : 1,
	FirstMeeting : 2
};
Cveta.Herself = {
	None     : 0,
	Outlaws  : 1,
	Nobility : 2,
	Mandate  : 3
}

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
Cveta.prototype.BlueRoses = function() { //TODO
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

Scenes.Cveta.Approach = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("Brushing aside the flaps, you step into Cveta’s tent, leaving behind the hubbub of the rest of the outlaw camp behind. As always, the songstress is perched on her stool, the picture of elegant composure as she acknowledges your entrance with a dip of her head.", parse);
	if(cveta.Violin())
		Text.Add(" The violin you bought for her rests in its case by her trunk, carefully sealed against dust and damp alike.", parse);
	if(cveta.BlueRoses())
		Text.Add(" A small pot with the stem cutting the two of you took from the estate sits by the tent’s entrance; the plant obviously well-cared for and wants for nothing. It’ll be a while before it can bring forth any blossoms, but it certainly isn’t going to wither on Cveta’s watch.", parse);
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
	
	Scenes.Cveta.Prompt();
}

Scenes.Cveta.Prompt = function() {
	var parse = {
		
	};
	
	//[Talk][Music][Play][Leave]
	var options = new Array();
	options.push({ nameStr : "Talk",
		func : function() {
			Scenes.Cveta.TalkPrompt();
		}, enabled : true,
		tooltip : "Speak with Cveta. She’s not one for small talk, though."
	});
	/* TODO
	options.push({ nameStr : "name",
		func : function() {
			
		}, enabled : true,
		tooltip : ""
	});
	options.push({ nameStr : "name",
		func : function() {
			
		}, enabled : true,
		tooltip : ""
	});
	*/
	Gui.SetButtonsFromList(options, true); //TODO Leave
}

Scenes.Cveta.TalkPrompt = function() {
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
					Scenes.Cveta.TalkPrompt();
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
					Scenes.Cveta.TalkPrompt();
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
					Text.Add("<i>“Do I ever wear anything else? Well, of course! I have in my trunk a set of attire I don when I wish to be more discreet. You do not imagine I travelled the length of the King’s Road in my gown, did you?”</i>", parse);
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
						Text.Add("<i>“I did not leave home unprepared. It was a calculated move, planned two months in advance - stories of young people leaving home aimlessly to seek their fortunes or such rot are just that, stories, and rarely do they have good endings.", parse);
						Text.NL();
						Text.Add("“Still, it has been harder than I expected - theory is always easier than practical - and the best laid plans of even the most meticulous mouse-morphs tend to go awry, to use the proverb. I count myself fortunate to have met Zenith.”</i>", parse);
					}, 1.0, function() { return true; });
					scenes.AddEnc(function() {
						Text.Add("<i>“You have to have something to work towards, I believe. ‘Not dying’ is an essential part of life, but what do you do past that? Animals strive not to perish. Plants do the same. What is it that separates the lives of us thinking people from animals, if not an enhanced appreciation of the future?”</i>", parse);
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
			
			Scenes.Cveta.HerselfPrompt();
		}, enabled : true,
		tooltip : "Try to get to know the songstress a little better."
	});
	Gui.SetButtonsFromList(options, true, Scenes.Cveta.Prompt);
}

Scenes.Cveta.HerselfPrompt = function() {
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
			if(cveta.flags["Herself"] < Cveta.Herself.Outlaws)
				Text.Add("You point out to Cveta that she was quite remiss on the details that last time, when she asked you to buy a violin for her. What happened after her encounter with the gate guards?", parse);
			else
				Text.Add("You say that you’d like to hear it again. Cveta sighs, but it’s a good-natured one and she clears her throat.", parse);
			Text.NL();
			Text.Add("<i>“Well, as I told you, Zenith was passing by Rigard on his own business - we have our own ways into the city, after all - and happened to spot me in trouble. Gathering a few of his men, he created a small diversion in order to convince the guard to take their eyes off me for a moment, whereupon I - to use the common term for the action - booked it.", parse);
			Text.NL();
			Text.Add("“I hadn’t gotten very far back down the road, though, when he approached me, explained what he had done, and extended an invitation for me to join him here in his camp. Understand that I was not exactly in the best of situations, [playername] - one of the reasons that I risked using my voice to gain passage to Rigard was that I was running dangerously low on provisions, amongst other problems. Here was someone who had just demonstrated considerable goodwill in risking himself to help me, and the least I could do was to hear him out. It could be reasonably inferred that he was not about to do something like… hmm… hold me hostage for ransom from my father. Yes.”</i>", parse);
			Text.NL();
			Text.Add("Cveta levels her gaze at you to make sure you’re still listening, then continues. <i>“Our arrangement has worked out fairly well, [playername]. Officially, I am here so Zenith can attempt to use me to gain leverage and legitimacy with the Free Cities, as well as keeping the morale of everyone in check with a spot of entertainment. Unofficially, Zenith knows of my power to sway others with my words - he witnessed the whole spectacle at the gate, after all - and he would be a poor leader if he did not immediately recognize the value of such an asset. That, and if it ever comes to negotiation with the nobles of Rigard, it would be an asset to have someone versed in courtly manners and decorum to conduct any talks that may come to pass. The outcast nobles may rightly be seen to have conflicting interests in such a situation; best that a neutral party mediate.”</i>", parse);
			Text.NL();
			Text.Add("And her? What does she get out of this?", parse);
			Text.NL();
			Text.Add("<i>“Look about you, [playername],”</i> Cveta replies curtly, her expression growing dark. <i>“Look beyond the confines of this tent, and tell me what you see. Many of those in this camp have been thrown out of hearth and home for not being human. Of those who have broken laws, many of those laws are either cruel or frivolous. Yes, there are those who are of a more criminal disposition amongst them. No, they are not allowed to make trouble on Zenith’s watch. Ordinary people mostly want to live from day to day, [playername]. They desire for tomorrow to be the same as today, because they know that however hard today has been, they have lived through it. How poor do you imagine things must be that they take up arms in hopes of changing tomorrow?", parse);
			Text.NL();
			Text.Add("“By virtue of being of aristocratic descent, one is entrusted with a legacy, certain privileges, and duties to go with them. The nobles of Rigard have forgotten their duties to those whom they have been entrusted with stewardship over - court consists of infantile bickering and posturing instead of serious discussion over matters of economy, culture and policy. Those who should conduct themselves better engage in the sort of activities only lowlifes should stoop to. Rumors abound about the impropriety of the royal family, about the king and queen, about the royal twins running about the city causing mischief when they should be preparing for their eventual reign. Every step in the system has broken down - the king absconds from his duty to rein in wayward nobles, the nobles refuse to do anything about their underlings, and the underlings themselves turn a blind eye to rogues and ruffians in exchange for a palm greased with coin.", parse);
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
			if(cveta.flags["Herself"] < Cveta.Herself.Outlaws)
				cveta.flags["Herself"] = Cveta.Herself.Outlaws;
			Scenes.Cveta.HerselfPrompt();
		}, enabled : true,
		tooltip : "Ask her how she ended up with the outlaws."
	});
	if(cveta.flags["Herself"] >= Cveta.Herself.Outlaws) {
		options.push({ nameStr : "Nobility",
			func : function() {
				Text.Clear();
				Text.Add("<i>“Mmm…”</i> Cveta’s uncovered eye flicks this way and that. <i>“Are you sure you wish to hear my opinion on this subject, [playername]? It can get quite unorthodox.”</i>", parse);
				Text.NL();
				Text.Add("You assure her that you do want to hear it - you wouldn’t have asked otherwise, would you?", parse);
				Text.NL();
				Text.Add("<i>“Very well,” she begins, easing herself into a more comfortable position on her seat. <i>“Allow me to begin with what I have already let slip. Nobility is more than just blood, [playername]. While it can tend to run in lines, there are times when it does not manifest in such illustrious families for generations at a time, yet crops up from time to time in personages unknown. It is… hard to describe, yet all who come into contact with it are immediately struck by its presence, for better or for worse.", parse);
				Text.NL();
				Text.Add("“Zenith, as I have mentioned before, is someone who is possessed of a form of this elusive trait. It is why I am not as concerned about the true lowlifes and criminals that dot his merry band as one imagines I should be - those who can be redeemed are inspired by him to turn their lives around. Those who are set in their ways at least have their evil curtailed by his watchful eye, and are thus rendered harmless.", parse);
				Text.NL();
				Text.Add("“Contrast this with the degenerates of Rigard. For all the trappings of nobility they clothe themselves and prance around in, they are hardly given to any true elevation of the mind, body or spirit. No, one need not be perfect to be noble, but they are not merely indifferent at the negligence of their duties to their subjects, but actively revel in their ability to get away with it.", parse);
				Text.NL();
				Text.Add("“Excuse me a moment. All this talking has made me a little thirsty.”</i> Leaning forward to reach into her trunk, Cveta pulls out a small metal canteen and unscrews the top, dipping her beak in to sip daintily at the contents.", parse);
				Text.NL();
				Text.Add("<i>“Ah. Now where were we?", parse);
				Text.NL();
				Text.Add("“A noble soul, when given power over a lesser, does not seek to abuse that power, but uses it to guide and serve as much as a parent would a child.", parse);
				Text.NL();
				Text.Add("“A noble body, when relieved from the fear of want, does not render him or herself insensate in a gluttonous fit of hedonism as most would do, but uses the newfound time to improve on one’s faculties.", parse);
				Text.NL();
				Text.Add("“A noble mind, possessed of the ability to perceive the truth, freely shares it with those who are not as gifted.", parse);
				Text.NL();
				Text.Add("“My father taught me that because of who we are, what we are, we are held to a higher standard than others with greater expectations laid upon our shoulders, and to do otherwise is a betrayal of the trust people have laid in us. It is the way of the Mandate of the Spirits.", parse);
				Text.NL();
				Text.Add("“What do you think?”</i>", parse);
				Text.Flush();
				if(cveta.flags["Herself"] < Cveta.Herself.Nobility)
					cveta.flags["Herself"] = Cveta.Herself.Nobility;
				
				//[Naive][Idealistic][No Comment]
				var options = new Array();
				options.push({ nameStr : "Naive",
					func : function() {
						Text.Clear();
						Text.Add("Surely she can’t be so naive as to be blind the to the way the world really is?", parse);
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
						Text.Add("<i>“Well, of course it is,”</i> Cveta remarks dryly. <i>“It is an ideal, and thus I do not realistically expect it to be attained by anyone without immense effort, if attaining it is possible at all. Yet all things ought to strive, [playername], and it helps and inspires when one has something in mind to strive for. Aimless wandering can hardly be expected to produce results, and time is too precious to be wasted on games of chance.", parse);
						Text.NL();
						Text.Add("“Eden can be a harsh place, and I know my way of seeing things can be hard to swallow by those weary with the world. At least you did not insult my intelligence by suggesting I had no knowledge of the ‘real’ world, as some would put it.”</i>", parse);
						Text.NL();
						PrintDefaultOptions();
					}, enabled : true,
					tooltip : "That sounds a little idealistic."
				});
				options.push({ nameStr : "No comment",
					func : function() {
						Text.Clear();
						Text.Add("<i>“That is all right,”</i> Cveta replies. clicking her beak. <i>“The less people have to think about politics in their day-to-day lives, the better the system is working to serve them in accordance with the Mandate of the Spirits. It is like… ah, air, money, or maybe love. Perfectly unimportant when all is proper and in place, a desperately pressing need when something has gone awry.”</i>", parse);
						Text.NL();
						PrintDefaultOptions();
					}, enabled : true,
					tooltip : "You haven’t really thought about it either way."
				});
				Gui.Callstack.push(function() {
					Text.Add("<i>“Well then,”</i> Cveta says. <i>“Is there another subject you would like to explore?”</i>", parse);
					Text.Flush();
					
					Scenes.Cveta.HerselfPrompt();
				});
				Gui.SetButtonsFromList(options, false, null);
			}, enabled : true,
			tooltip : "Ask Cveta about her curious ideas on nobility."
		});
	}
	if(cveta.flags["Herself"] >= Cveta.Herself.Nobility) {
		options.push({ nameStr : "Mandate",
			func : function() {
				Text.Clear();
				Text.Add("Cveta blinks, then composes herself. <i>“I am surprised you caught that, [playername]. The Mandate of the Spirits is but a saying from where I come from. The idea goes as such: if the monarch and aristocracy of a land rule it well and justly, their reign will be blessed with peace and prosperity.", parse);
				Text.NL();
				Text.Add("“Conversely, once they forget their duties and descend into decadence and misrule, divine wrath will be visited upon the land in the forms of plagues, floods, droughts, demons running amok, milk turning bad, birds flying backwards, disasters natural and unnatural alike in that vein. Those are to be taken as signs that their rule is no longer legitimate, and it is time for the people to depose them and install more competent rulers in their place.", parse);
				Text.NL();
				Text.Add("“It may not be wholly true, but the actual truth of the legend needs not have bearing on the lessons one can take away from it. Does that answer your question?”</i>", parse);
				Text.Flush();
				if(cveta.flags["Herself"] < Cveta.Herself.Mandate)
					cveta.flags["Herself"] = Cveta.Herself.Mandate;
				Scenes.Cveta.HerselfPrompt();
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
				Text.Add("<i>“They were all lovely, but the blue roses were the best. Not just because of their scent or appearance, but in the way they were cultivated with extreme care in order to bring out the best in them, [playername]. Cross a blue rose with another, and it is no longer blue. They represented… generations upon generations of single-minded dedication to a craft, the passing down of the proverbial torch with the trust that it would not be cast aside.", parse);
				Text.NL();
				Text.Add("“That made them so much more than oddly-colored flowers.”</i>", parse);
			}
			else if(cveta.Relation() < 70) {
				Text.Add("<i>“I remember…”</i>", parse);
				Text.NL();
				Text.Add("Yes? What does she remember?", parse);
				Text.NL();
				Text.Add("Cveta’s gaze grows distant and glassy. <i>“I remember that Father used to take me to court. Twice every month, he would tell me to get dressed, and we would make the flight from home to the City, Father, Mother, and I. Each session lasted two days; we would stay the night in the City before flying back the next day.", parse);
				Text.NL();
				Text.Add("“Mother did not like it; she said that court was no place for a child to be. That just made me all the more determined to get what I could out of those trips.”</i> The songstress pauses her music, idly strumming the strings of her lyre as she’s lost in thought, then starts up the tune again. <i>“We argued a lot. Most of our disagreements only ended because I did not want my voice to wear thin.", parse);
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
			Scenes.Cveta.HerselfPrompt();
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
			Text.Add("<i>“Very well, [playername]. First and foremost, I can sway the emotions of others, but this is hardly anything special in and of itself. Anyone skilled in the arts of oration or music can do that, and without the need for some mystical gift at that.", parse);
			Text.NL();
			Text.Add("“The other thing I can do is tell someone they ought to do or believe something. Understand that this is not as easy as it looks, [playername]. To go against someone of strong will and firm beliefs, and make them act in a way they would not, is… well, I would not say it is impossible. Father or Mother might be able to manage it over a period of time, perhaps two months. However, I think it out of my reach until I practice some more, and I do not wish to practice frivolously.", parse);
			Text.NL();
			Text.Add("“The unfortunate thing is, many people do not have strong wills, if only from lack of opportunity to cultivate such. And even if they did, their desires are often hidden from them, such that they often do not realize it until it is too late. A man covets his neighbour’s land and house for years while appearing respectable; a few words in the right place can awaken that desire and incite him to murder. But to turn someone against her lifelong friend is to ask the impossible.", parse);
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
			Scenes.Cveta.HerselfPrompt();
		}, enabled : true,
		tooltip : "Just what is this strange power of Cveta’s?"
	});
	options.push({ nameStr : "Music",
		func : function() {
			Text.Clear();
			Text.Add("Cveta doesn’t reply immediately upon hearing your question, instead half-lidding her eyes as she thinks. Slowly, she lets the current tune fade into silence and begins anew, a little ditty springing from the strings of her lyre, sharp and lively, yet with a strange yearning, a distant longing buried in the undertones, a longing for… something, but you don’t know what.", parse);
			Text.NL();
			Text.Add("Then as suddenly as it begun, the music’s mood changes in quick succession, turning hard and fast, then slowing to a sad crawl. One moment it gushes like a stream swollen with spring rain, then turns immovable, stolid, forbidding the next.", parse);
			Text.NL();
			Text.Add("This emotional play goes on for a few minutes before she finishes with a flourish, letting the last of the improvised tune sink in over a moment of silence before starting up the quiet backdrop to your conversation once more.", parse);
			Text.NL();
			Text.Add("<i>“Music is the only escape, [playername],”</i> Cveta says, and it’s a few moments before you realize that she’s actually speaking and not singing. <i>“It easily conveys meanings and messages that words have a hard time articulating. How else, after understanding this, could I not leverage my natural talents and bend them towards the practitioning of the art of music? How could I, who has had the privilege of not needing to worry where my next meal will come from, not use the opportunity to cultivate myself above and beyond the mundane?”</i>", parse);
			Text.NL();
			Text.Add("Yeah, that’s true, but at the same time, you get the sense that there’s something she’s not telling you. Knowing her, though, you won’t be wrangling it from her beak until she’s ready.", parse);
			Text.NL();
			Text.Add("<i>“What else? Mother first taught me all she knew on the subject, then Father hired the best tutors his money could purchase. The Academy of Higher Arts is a school of magical learning first and foremost, which may have explained why the few musicians present were so desperate for any sort of patron to throw a handful of coin their way.", parse);
			Text.NL();
			Text.Add("“Given such opportunity, [playername], I worked to learn all I could. Voice, string, keyboard… I miss the deep, regal music of a proper pipe organ. Everything but wind and brass, the reason for which should be plain-”</i> she snaps her beak with an audible click- <i>“and percussion, which my small frame was not entirely suited for. It is why I keep Ernest around to play the drums where they are needed, a task he takes great joy in.", parse);
			Text.NL();
			Text.Add("“Surprisingly, it was possible for me to make a living from music even in these times, [playername]. You might imagine that folk would save their coin for the basic necessities of life, but I discovered that people will pay dearly for a few moments’ respite from their burdens and troubles. Far from enough to live the luxuriant life I once did, but sufficient to keep myself fed and clothed without digging into my reserves.", parse);
			Text.NL();
			Text.Add("“And that is the story of my music, [playername],”</i> Cveta finishes, bobbing her head at you. <i>“Would you like to move on from here?”</i>", parse);
			Text.Flush();
			Scenes.Cveta.HerselfPrompt();
		}, enabled : true,
		tooltip : "Ask Cveta about her interest in music."
	});
	Gui.SetButtonsFromList(options, true, Scenes.Cveta.TalkPrompt);
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
	}
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

Scenes.Cveta.DreamRoses = function() {
	var parse = {

	};
	
	Text.Add("Roses.", parse);
	Text.NL();
	Text.Add("They stretch away from you in all directions as far as the eye can see, rosebushes dotting the grassy earth, woody vines that creep along the ground, petals that drift through the air, carried in from some unknown source by the stiff breeze that blows across the fields unimpeded. Red, white and blue, roses, roses everywhere.", parse);
	Text.NL();
	Text.Add("And in the midst of it all, Cveta. She stands stiffly in the warm sunlight, head bowed and wings spread as she sings. There is no one to hear her save you and a raven perched on one of the thorny rosebushes, yet she sings anyway, the melancholy melody of the bird-morph’s divine soprano filling the air.", parse);
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


Scenes.Cveta.DreamBrood = function() {
	var parse = {
		skinDesc : function() { return player.SkinDesc(); },
		playername : player.name
	};
	
	Text.Add("<i>“Wake up, beloved.”</i>", parse);
	Text.NL();
	Text.Add("You groan and roll over in the grass, the warmth of gentle spring sunlight on your [skinDesc] and against your lidded eyes. A breeze blows, bringing with it the scent of wildflowers and unripe fruit.", parse);
	Text.NL();
	Text.Add("<i>“Please, wake up.”</i> The voice drips so much honey, it’s practically impossible to disobey. Slowly, you open your eyes to find Cveta kneeling over you, wearing absolutely nothing but her gloves. Gone is the thin, waifish creature that you first met in the outlaws’ camp, now replaced by this curvy, full-bodied goddess and her equally alluring voice. As her brood has swelled, so have her breasts and hips to better provide for her many chicks; the feathers upon her chest can no longer hide the rise of her nipples, small bumps beneath her glorious, vibrant feathers, just waiting to be uncovered and teased.", parse);
	Text.NL();
	Text.Add("Not quite gone is the prudish demeanor, but it’s nice to know that she can be an absolute slut just for you. To be honest, it makes it feel a bit special.", parse);
	Text.NL();
	Text.Add("Judging by her flat belly, mischievous glint in her eye and the fact that the feathers about her groin are utterly soaked and glistening, it’s clear what your beautiful bird wants, and she wants it now. Off in the distance, high above the two of you, a raven circles in the air, its dark feathers starkly contrasting against the colorful scene. You can’t quite make it out, but does it look… jealous?", parse);
	Text.NL();
	Text.Add("<i>“I’ve been practicing my mating song again, [playername],”</i> Cveta croons, even as you reach up to run your fingers through her luscious feathers and across her wide, sumptuous, and above all, <i>fertile</i> hips. She tosses her head in that way only she can, and the way the waterfall of her crimson locks flows back into place is a sight to behold. <i>“Want to hear it?”</i>", parse);
	Text.NL();
	Text.Add("Without waiting for your reply, she opens her beak and begins to sing…", parse);
	Text.NL();
	Text.Add("You wake in a cold sweat, feeling slightly disappointed that you didn’t manage to remember any of the song.", parse);
}

