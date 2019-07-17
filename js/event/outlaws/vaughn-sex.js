import { Scenes } from '../../event';
import { Vaughn } from './vaughn';

Vaughn.prototype.SexTime = function() {
	return world.time.hour < 12;
}

Vaughn.prototype.HaveDoneTerryRoleplay = function() {
	return false; //TODO
}

Vaughn.prototype.Confronted = function() {
	return this.flags["Talk"] & Vaughn.Talk.ConfrontFollowup;
}


Scenes.Vaughn.Sex = function() {
	var parse = {
		breasts : function() { return player.FirstBreastRow().Short(); }
	};
	
	var first = !(vaughn.flags["Talk"] & Vaughn.Talk.Sex);
	vaughn.flags["Talk"] |= Vaughn.Talk.Sex;
	
	Text.Clear();
	if(first) {
		Text.Add("Vaughn snorts at the suggestion, a corner of his muzzle curling - although you can’t tell whether it’s with wryness or disgust in the dim light. <i>“Why, you wanting something from me?”</i>", parse);
		Text.NL();
		Text.Add("No, he just seems a little… how should you put it? Pent-up, that’s the word. And so are you.", parse);
		Text.NL();
		Text.Add("<i>“No favors? No questions? Not even a good word in edgeways?”</i>", parse);
		Text.NL();
		Text.Add("No, no, and for the final time, no.", parse);
		Text.NL();
		Text.Add("Vaughn scratches his head. <i>“Gotta admit, it’s the first time in a long, long while that someone’s said something like that to me without wanting anything in return. You sure you’re feeling okay?”</i>", parse);
		Text.NL();
		Text.Add("Does he really think that lowly of himself, or is he just making excuses for something else?", parse);
		Text.NL();
		Text.Add("<i>“Oh snap, you got me,”</i> the fox-morph replies with a short bark of laughter, a plume of cigarette smoke rising from his muzzle. <i>“I’m secretly still in love with my mom, and can’t wait to get back to her grave so I can dig her out of the ground and fuck her rotting body six ways to saturday. Been saving myself up for <b>years</b> just for that.”</i>", parse);
		Text.NL();
		Text.Add("Really?", parse);
		Text.NL();
		Text.Add("<i>“Nah.”</i> With a flick of his fingers, Vaughn sends the remains of his cigarette cartwheeling away into the darkness. <i>“Seriously, though. Not a big fan of poopers, and I know better than to be leaving a trail of bastards in my wake at this age.", parse);
		Text.NL();
		if(player.FirstBreastRow().Size() > 10) {
			Text.Add("Although I’ll say, I’ve always been partial to a good titfuck myself. Wouldn’t matter if it were a trap sporting them, since with tits, what you see is what you get, unlike some other things I’d rather not mention here and in present company.”</i> He runs his eyes over your [breasts] and sighs, his gaze turning to some distant point well beyond your shoulder.", parse);
			Text.NL();
			Text.Add("<i>“Look, I guess if you’re really determined, we can work something out. Ask me again when I’m nearing the end of my shift - maybe sometime after midnight, okay?”</i>", parse);
		}
		else {
			parse["b"] = player.FirstBreastRow().Size() > 5 ? " Well, maybe a passable one, but not a <b>good</b> one." : "";
			Text.Add("Now, I’ll admit that I do enjoy the occasional titfuck, since that fits both criteria, but you’ve got to admit not everyone has the assets for one.”</i> Vaughn cups his hands illustratively and smiles wryly. <i>“Wouldn’t matter if you slapped them onto something with a dick or two or three, since with tits, what you see is what you get and it’s no good whining; they’re honest that way, and I like it. And if I may be blunt: you don’t really have the kind of assets for a good titfuck.[b]”</i>", parse);
		}
		Text.NL();
		Text.Add("He really likes big tits, doesn’t he?", parse);
		Text.NL();
		Text.Add("<i>“Well, you know how there’s that saying where the first someone you fall in love with always ends up being the yardstick by which everyone else you’ll ever be with is measured? Yeah… sorta happened that way. I suppose it’s just something that won’t come off, like glue or a tick or something…”</i> he’s clearly rambling now, and you wonder if he isn’t doing just that to skirt around something he’d rather not bring up.", parse);
		Text.NL();
		parse["b"] = player.FirstBreastRow().Size() > 10 ? "" : " - I don’t care if you’ve to grow them yourself or what -";
		Text.Add("<i>“Look, the less said about this, the better. If you’re really that desperate to throw yourself at a has-been like me, then by all means, do so. Bring along a good plush pair[b] and I’ll consider it deeply. Now, what were we talking about when this came out of nowhere?”</i>", parse);
		
		world.TimeStep({minute: 30});
		
		Scenes.Vaughn.Prompt();
	}
	else if(!vaughn.SexTime()) {
		Text.Add("<i>“Not here and now,”</i> Vaughn replies with a sigh and roll of his eyes. <i>“Taking a moment to chat is one thing, but quickies are frankly unsatisfying and the real deal takes far too long. Wouldn’t want to be literally caught with my pants down if something happened, aye?</i>", parse);
		Text.NL();
		Text.Add("<i>“Like I said, come back when I’m about to come off my shift, try for sometime after midnight. We’ll see about that then.”</i>", parse);
	}
	else {
		Text.Add("<i>“You sure are persistent, aren’t you? Not even Leon was that persistent when it came to -”</i> Vaughn catches himself mid-sentence, and shakes his head. <i>“What did you have in mind?”</i>", parse);
		
		//[Titfuck][T. Roleplay]
		var options = new Array();
		options.push({ nameStr : "Titfuck",
			tooltip : "Offer him a titfuck. That seems to be his thing.",
			func : Scenes.Vaughn.SexTitfuck, enabled : true
		});
		/* TODO
		options.push({ nameStr : "name",
			tooltip : "",
			func : function() {
				Text.Clear();
				Text.Add("", parse);
				Text.NL();
				Text.Add("", parse);
				Text.Flush();
			}, enabled : true
		});
		*/
		Gui.SetButtonsFromList(options, true, function() {
			Text.Clear();
			Text.Add("<i>“Bah, stringing a guy on like that,”</i> Vaughn grunts. <i>“Well, was there anything else you wanted, besides toying with me?”</i>", parse);
			Text.Flush();
			
			Scenes.Vaughn.Prompt();
		});
	}
	Text.Flush();
}

Scenes.Vaughn.SexTitfuck = function() {
	var parse = {
	};
	
	Text.Clear();
	Text.Add("<i>“Fine. Let’s see if you remembered to bring what I asked you to the table.”</i>", parse);
	Text.NL();
	Text.Add("Turning a practiced eye upon your chest, he quickly assesses your assets - he’s obviously quite the experienced connoisseur when it comes to lady lumps.", parse);
	Text.NL();
	
	var breastSize = player.FirstBreastRow().Size();
	
	if(breastSize > 10) // E-cup
		Scenes.Vaughn.SexTitfuckBig();
	else if(breastSize > 5) // C-cup
		Scenes.Vaughn.SexTitfuckAverage();
	else {
		Text.Add("<i>“Well, seems like you don’t have the goods,”</i> he says drolly. <i>“Can’t have a titfuck without tits worth having, you know?”</i>", parse);
		Text.NL();
		Text.Add("You’re about the say that’s obvious, but then again, you were the one who asked for it…", parse);
		Text.NL();
		Text.Add("Vaughn pats you on the shoulder and turns his lips upwards in a sad smile. <i>“Everyone has their own particular tastes, and I’m no exception here. Since you’re the one throwing yourself at me, I get to set the house rules. Check back later when you’ve brought over a nice pair of tits, okay? Doesn’t have to be yours, or even real.</i>", parse);
		Text.NL();
		Text.Add("<i>“Now, if we could turn our attention back to important matters?”</i>", parse);
		Text.Flush();
		
		world.TimeStep({minute: 5});
		
		Scenes.Vaughn.Prompt();
	}
}

Scenes.Vaughn.SexTitfuckBig = function() {
	var parse = {
		playername : player.name,
		boygirl : player.mfFem("boy", "girl"),
		upperarmordesc : function() { return player.ArmorDesc(); },
		lowerarmordesc : function() { return player.LowerArmorDesc(); }
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	vaughn.flags["Sex"] |= Vaughn.Sex.Titfuck;
	
	Text.Clear();
	Text.Add("It’s a few moments before he’s able to speak again, an edge of raw emotion in his voice. <i>“All right, all right, I give. That <b>is</b> quite the rack you’ve got there, and it <b>would</b> be a pity for the both of us if it went unused. That’ll do, [playername]. That’ll do.”</i>", parse);
	Text.NL();
	Text.Add("Certainly not here and now, though, right?", parse);
	Text.NL();
	Text.Add("<i>“Of course not, although I somehow don’t think you’d mind if I did you right in the open. Come along, now.”</i>", parse);
	Text.NL();
	parse["l"] = player.HasLegs() ? "to your knees" : "downward"; 
	Text.Add("Without further ado, the fox-morph trots over to the other side of the watchtower, circling the wooden walls until he steps into a pocket of deep shadow, ushering you in along with him. Cast by the tower itself, it’s practically so dark that you can’t see your own fingers, although the lights of the camp proper are still visible in the distance. Of course, Vaughn is still there - you can hear his steady breathing in the darkness, feel his presence in the form of coarse fur and rugged warmth. Without warning, you find Vaughn’s hands on your shoulders, a firm, steady pressure urging you [l], and you’re only too willing to oblige.", parse);
	Text.NL();
	Text.Add("<i>“There’s a good [boygirl],”</i> Vaughn mutters as the sound of cloth rustling grow louder and a sudden sexual musk rises into the air, followed by a heavy, pulsing heat that erupts just under your chin. While you can’t see much in the near-complete darkness, you can definitely <i>feel</i> the damp, slick head of his foxhood as it trails across your [skin] for a second or two.", parse);
	Text.NL();
	Text.Add("<i>“There’s a good [boygirl].”</i>", parse);
	Text.NL();
	Text.Add("Without warning, hands are tugging hungrily, urgently at your [upperarmordesc], working it free with an insistent need. You’re more than willing to oblige, helping him out with the occasional shrug and squirm until your [breasts] eventually pop free of their constraints, cool night air caressing the ripe, pillowy mounds as your [upperarmordesc] falls about your waist.", parse);
	Text.NL();
	if(!vaughn.HaveDoneTerryRoleplay()) {
		Text.Add("<i>“Not as good as I remember it. Never as good,”</i> Vaughn mutters to himself wistfully - although you’re pretty sure the words weren’t meant for you. <i>“But still pretty damned fine nevertheless.”</i>", parse);
		Text.NL();
	}
	parse["lact"] = player.Lactation() ? Text.Parse(", a thin trickle of milk oozing freely down your [breasts] and dripping onto the ground", parse) : "";
	Text.Add("Slowly, his fingers make themselves known on your [breasts], pinpricks of warmth against cool air as they dance upon the soft surface, leaving trails of warmth in their wake as they work their way to your [nips]. Pausing to run circles around the areolae, Vaughn takes each of your nipples between thumb and forefinger, slowly rubbing them until they’re nice, fat and stiff[lact].", parse);
	Text.NL();
	Text.Add("Butterflies erupt in your stomach at the motion, filling your insides with a tingly, gooey sensation as he flips his palms and tickles the undersides of your nipples with his fingertips. The soft, intermittent touching is far more sensual and arousing than any rough pawing could ever be, and your breath catches in your throat as warmth blossoms in your breastbone.", parse);
	Text.NL();
	
	var gen = "";
	if(player.FirstCock())
		gen += "cock[s] grow stiff";
	if(player.FirstCock() && player.FirstVag())
		gen += " and ";
	if(player.FirstVag())
		gen += "[vag] begins wettening in earnest";
	parse["gen"] = Text.Parse(gen, parse);
	
	Text.Add("Unthinkingly, you thrust your chest forward, putting yourself on offer, hungry for more. While Vaughn’s hands aren’t large enough to be able to fully cup your lady lumps, he’s still able to run his palms across the entirety of their surface in a few broad strokes. The coarse fur on his hands runs rough over your flush, sensitive breasts and tender, engorged nipples, and you stifle a cry in your throat as your [gen].", parse);
	Text.NL();
	Text.Add("It’s only now that Vaughn starts turning up the heat: his fingers find purchase in your soft, plentiful boobflesh and begin kneading away in a steady rhythm - firm enough to have just the barest hint of discomfort to top off the pleasure with, but not enough to be actually painful. You tremble and moan unreservedly - you can’t remember the last time your [breasts] were so sensitive to touch, the flush of heat growing to fill the entirety of your chest with a fluid fullness.", parse);
	Text.NL();
	Text.Add("While you’re certainly well-endowed at the moment, there’s something about Vaughn’s tender caressing that makes them feel so <i>weighty</i>, so <i>ripe</i> - here in the darkness, it’s easy for your imagination to fill in the blanks with what your body is telling you, daydreaming of your plush mounds swelling and firming under his magical fingers.", parse);
	Text.NL();
	Text.Add("Vaughn’s maleness is near, too; you can smell its scent, more and more heated and intense as his own arousal grows. Every gentle squeeze has you desperately wishing there was a way for you to be further on display, even though you’ve always proffered yourself in whole, your back arched and tits thrust proudly forward.", parse);
	Text.NL();
	Text.Add("At last, though, he decides that you’re ready. Quick and nimble, his hands dart around to the underside of your full, heavy tits, cupping them and moving them into position. Instinctively, your hands take over from his, holding your [breasts] in place, and before you know it, the tip of his cock is pushing eagerly at your cleavage. Sure, your milk makers might be firm when squeezed like that, but Vaughn’s hard-on is positively <i>solid</i>, easily parting your boobflesh. Slick with pre that mixes in with your sweat, his glans trails across your bare breasts, seeking purchase in your cleavage before sinking in with a hard thrust and soft squelch.", parse);
	Text.NL();
	Text.Add("Clearly no stranger to the motions, Vaughn pumps steadily and powerfully in and out of your generous cleavage, saying little save for the occasional grunt of effort. Despite the fact that you’re using both hands to steady your [breasts], the motion is more than enough to set them jiggling; your achingly sensitive nipples scrape the fur of his legs more than once, eliciting soft moans from your lips. Pressed together to form a channel for him to fuck, your breasts are painfully aware of every ridge and vein on his girthy manhood, the slapping of his swelling knot against their top and that of his generous balls below.", parse);
	Text.NL();
	Text.Add("Slowly, his hands - those wonderful hands - come to rest on your shoulders for support, and Vaughn’s thrusts come wilder and faster as he picks up the pace. Supporting is no longer enough - you’re practically squeezing your [breasts] together in a bid to contain the enthusiastic fucking they’re receiving, each pulse and throb of Vaughn’s manhood keenly felt by your tender breasts and aching nipples. Heat rises from your enthusiastic lovemaking to caress your face, and his breath comes in ragged gasps as he tries to pick up the pace even more, pounding away with wild abandon.", parse);
	if(player.Lactation())
		Text.Add(" Small squirts of milk accompany his frantic movements as the pressure against your [breasts] grows; it’s almost as if you’re being purposefully milked in the most unorthodox manner.", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“Spirits above, Sabrina,”</i> Vaughn groans, just on the edge of your hearing. <i>“Fucking your beautiful breasts always feels amazing - I bet even Aria herself couldn’t compare. I want to stay like this for-fucking-ever.”</i>", parse);
		Text.NL();
		Text.Add("Wait… is he calling out someone else’s name while fucking you?", parse);
		Text.Flush();
		
		//[Confront][Let it go]
		var options = new Array();
		options.push({ nameStr : "Confront",
			tooltip : "Stop right there. Is he fantasizing about someone else?",
			func : Scenes.Vaughn.SexConfront, enabled : true
		});
		options.push({ nameStr : "Let it go",
			tooltip : "Just let him have his way, the poor thing.",
			func : function() {
				Text.Clear();
				Text.Add("You consider stopping right now and asking Vaughn about it, but decide not to ruin the moment with your little hold-up. So what if he’s dreaming about someone else while fucking your tits - are you going to try and control what he thinks? What sort of petty control freak would you be, then?", parse);
				Text.NL();
				Text.Add("Nah, best to let it go and enjoy this titfuck to the fullest. If the pretense gives Vaughn some relief and a little happiness, who are you to deny him that?", parse);
				Scenes.Vaughn.SexTitfuckBigCont(parse);
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}, 1.0, function() { return !vaughn.HaveDoneTerryRoleplay() && !vaughn.Confronted(); }); //TODO CHECK LOGIC. MAYBE REMOVE TERRY ROLEPLAY (IF IT DEPENDS ON CONFRONT)
	scenes.AddEnc(function() {
		Text.Add("<i>“Have to… admit,”</i> Vaughn groans in between breaths. <i>“You’re pretty good, [playername]. Pretty damned good, and that’s… a lot, coming from me.”</i>", parse);
		Scenes.Vaughn.SexTitfuckBigCont(parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
}

Scenes.Vaughn.SexTitfuckBigCont = function(parse) {
	Text.NL();
	Text.Add("With the way his shaft is twitching in between your milk makers, it’s clear that he’s going to cum soon. Closing your eyes, you arch yourself backwards as far as you dare, surrendering to the sheer pleasure emanating from your chest in those last few moments with Vaughn’s cock twisting in your cleavage, clearly trying to knot you.", parse);
	Text.NL();
	Text.Add("Then it comes.", parse);
	Text.NL();
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("Vaughn does his best to stifle the shout that accompanies his release, but only manages to turn it into a muffled grunt. Before you know it, he’s painting you with his seed - copious gobbets of thick, hot spunk hit your face with force, getting all over your mouth and eyes. Thick and sticky, the liquid warmth oozes down your cheeks and chin; it gushes thickly over your forehead and lips, creeping down your neck before dripping off onto your [breasts] and the ground.", parse);
		Text.NL();
		Text.Add("You take a moment to savor the sheer delight of being coated in seed, then wipe yourself off the the back of your hand. Not that you won’t need a proper wash-up later on, but at least you won’t be oozing all over the place.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("With a long, frustrated groan of release, Vaughn sends a flood of thick, potent seed erupting from the tip of his cock, thoroughly inseminating the entirety of your chest. The nook of your cleavage fills up in seconds, and then the hot, quivering spunk overflows outward, coating the outsides of your pillowy mounds; you have to bite back a cry of delight as the slippery warmth reaches your nipples, gliding over them before sliding down to your [belly].", parse);
		Text.NL();
		Text.Add("Despite how much cum he’s already dumped onto you, his balls still haven’t emptied - more and more and more just keeps coming, and you can’t help but wonder in the back of your mind just how long he’s been pent up for.", parse);
		Text.NL();
		Text.Add("Slowly, though, the torrent slows to a stream, and the stream to a dribble. Your [breasts] and [belly] are utterly swamped in a thick coat of Vaughn’s seed - it almost seems a hopeless task to try and clean yourself up like this, but you try anyway.", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.Add("His breathing heavy and movements trembling, Vaughn withdraws his still-solid manhood from your breasts with one final yank, and you hear the sound of flesh and cloth hitting wood.", parse);
	Text.NL();
	Text.Add("<i>“Fuuck,”</i> he pants.", parse);
	Text.NL();
	Text.Add("See? Now, is he going to admit that you were right - that he needed a bit of relief, that’s all?", parse);
	Text.NL();
	Text.Add("The only reply you get is a half-growl, half-whine. The air is redolent with the scent of sex and sweat, and even in the darkness you can feel Vaughn’s gaze on you - or at least, where he thinks you should be. Slowly, you do up your [upperarmordesc] while he recovers, waiting for him to make the next move.", parse);
	Text.NL();
	Text.Add("He doesn’t; the words, when they come, are slow and hesitant. <i>“Just give me a little alone time, okay? Sun’s almost up, you should go get cleaned up and all. I’m still expected here for a bit… probably see you at sundown earliest.”</i>", parse);
	Text.NL();
	Text.Add("He’s just going to shoo you away like that?", parse);
	Text.NL();
	Text.Add("<i>“Duty calls… you know.”</i>", parse);
	Text.NL();
	Text.Add("Well, fine. Did he at least enjoy himself?", parse);
	Text.NL();
	if(!vaughn.HaveDoneTerryRoleplay())
		Text.Add("Now <i>that</i> gets him all clammed up. Seems like there really isn’t anything you can do about his situation for now… more’s the pity, then. Deciding to follow Vaughn’s advice, you quickly rise and nip off in search of a proper clean-up before your tacky condition’s exposed by the sun.", parse);
	else {
		Text.Add("He smiles exhaustedly. <i>“Yeah, sure did. I’ll be fine, really. You just go on ahead and do your thing, and don’t let an old man like me hold you back.”</i>", parse);
		Text.NL();
		Text.Add("Well, if he insists. You quickly rise and nip off in search of a proper wash-up, preferably before the sun rises proper.", parse);
	}
	Text.Flush();
	
	player.AddSexExp(2);
	player.AddLustFraction(.5);
	
	world.TimeStep({hour: 1});
	
	Gui.NextPrompt();
}

Scenes.Vaughn.SexTitfuckAverage = function() {
	var parse = {
		playername : player.name,
		boygirl : player.mfFem("boy", "girl"),
		upperarmordesc : function() { return player.ArmorDesc(); },
		lowerarmordesc : function() { return player.LowerArmorDesc(); }
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	vaughn.flags["Sex"] |= Vaughn.Sex.Titfuck;
	
	Text.Clear();
	Text.Add("The long silence that follows is awkward and anything but encouraging. The blatant way Vaughn is studying you is reminiscent of a housewife watching the scales at market, and you - well, it wouldn’t be wrong to say that you <i>did</i> put yourself on sale in a sense.", parse);
	Text.NL();
	Text.Add("<i>“I’ll be blunt. Less than satisfactory in terms of what I have to work with, but I won’t stop you if you insist on it.”</i>", parse);
	Text.NL();
	Text.Add("Does he have to be so insulting about it? It’s almost as if he’s purposefully trying to drive you away - <i>is</i> he trying to get you to storm off in a huff? Looking up at Vaughn, the fox morph’s face has assumed a careful, guarded expression of utter blankness - one which some might call a “cavalcade face”.", parse);
	Text.NL();
	Text.Add("Yeah… that lack tells you what you need to know. He’s hiding something, but this probably isn’t the time to confront him about it.", parse);
	Text.NL();
	Text.Add("<i>“Well? Got nothing to say? Too pissed off at me to speak? I’ll be going, then.”</i>", parse);
	Text.NL();
	Text.Add("No, not so fast! You just needed a little time to think, that’s all.", parse);
	Text.NL();
	Text.Add("Shaking his head, Vaughn peels your hand off his shoulder. <i>“So, I really can’t get rid of you, eh? You’re really bloody persistent, you know that?”</i>", parse);
	Text.NL();
	Text.Add("And proud of it.", parse);
	Text.NL();
	Text.Add("A sigh. <i>“Fine, fine. Let’s get somewhere out of the way. Wouldn’t want to create any more of a scene than we already have, would we?”</i>", parse);
	Text.NL();
	Text.Add("With that, Vaughn leads you around to the other side of the watchtower, its long, dark shadow consuming the both of you to the point where you can’t see a thing. Nevertheless, his grip on your wrist is firm and insistent, and you follow him into a muted corner. From here, you can see the lights of the outlaw camp proper in the distance, but are safely shrouded from prying eyes in the darkness.", parse);
	Text.NL();
	Text.Add("Which is just how Vaughn wants it - without a word, he pushes down firmly on your shoulders, urging you down in front of him. You’re only more than willing to obey, and let out a soft sigh as there’s a rustle of cloth and a sudden surge of sexual musk fills the air. Instinctively, you reach out for the masculine heat that fills the air before you, and your fingers close about Vaughn’s girthy shaft, still slick from its sheath. It stiffens and engorges in your hand, a process that only quickens from your touch, and soon it’s powerfully hard as it throbs and pulses in your palm, each ridge and vein distinct to your skin as your hand explores its length.", parse);
	Text.NL();
	Text.Add("Before you know it, his own hands are off your shoulders and at your [breasts], roughly caressing them through your [upperarmordesc]. Even without needing to see them, you know Vaughn’s rough hands are no stranger to hard work and manual labor - the coarse fur and tough skin of his palms send shivers running down your front as he ham-fistedly gropes you without shame. There’s power in those callused fingers all right - restrained power that’s proven as he easily loosens your [upperarmordesc] and strips you down to your waist, leaving your milk makers exposed to the cool night air.", parse);
	Text.NL();
	Text.Add("Psht. Not to be outdone, you pump your fingers up and down rhythmically, seeking to jerk him off. The base of your hand brushes against Vaughn’s weighty balls, and you feel them tighten involuntarily at your attentions. Nevertheless, he quickly moves a hand to catch your wrist and stop you cold.", parse);
	Text.NL();
	Text.Add("<i>“Don’t get ahead of yourself,”</i> he whispers before letting go. <i>“Plenty of time to get things done the proper way.”</i>", parse);
	Text.NL();
	Text.Add("Of course, that leaves the question of what the ‘proper way’ is, but fine, if that’s the way he wants it. You settle for just holding Vaughn’s meaty shaft in place while he works on your [breasts], his hands working their bases while he moves his hips such that the bulbous head of his cock rubs against each of your nipples in turn, leaving a hot, musky layer of pre-cum on the sensitive nubs of flesh. Working in tandem, his hands and shaft send waves of pleasure cascading through your lady lumps, and you unthinkingly arch your back and thrust out your chest in response, a clear invitation for more of what he’s doing.", parse);
	Text.NL();
	parse["l"] = player.Humanoid() ? ", your thighs rubbing against each other as you kneel before him" : "";
	Text.Add("Despite his raging, throbbing erection and labored breathing - clear signs of his growing lust - Vaughn still has plenty of control over himself. Assisted by the occasional brush of his manhood, his fingers ply up and down your [breasts], occasionally lingering on your areolae and drawing slow, languid circles. His touch sends a constant stream of tingles into your body and you moan aloud[l].", parse);
	if(player.FirstVag())
		Text.Add(" Unable to restrain yourself any longer, you reach into your [lowerarmordesc] with a hand and part the petals of your womanly flower, pumping your fingers in and out of its heat until the urgent need fades to more bearable levels.", parse);
	Text.NL();
	Text.Add("In near-complete darkness, it’s easy to fantasize about what your body is telling you - the flush of heat rushing outward from your chest to fill your [breasts], how full and heavy they feel at the moment, how painfully hypersensitive they are - Vaughn’s manhood is now slapping against your [breasts] as his hips buck back and forth. There’s a momentary surge of warmth as his thickset cock tip presses against your cleavage - before you know it, he thrusts and the entirety of his cock slides between your [breasts], lubricated with an arousing mixture of sweat and pre.", parse);
	Text.NL();
	Text.Add("Right, so <i>this</i> is the ‘proper way’, if how he’s behaving is any indication of his approval. Grabbing the underside of your [breasts] to support them, you squeeze your lady lumps about Vaughn’s girthy man-meat as best as you can. Although you’re far from flat-chested, you can feel you simply don’t have enough in the way of volume to give him a comfortable titfuck, and try your best to compensate by rolling and kneading your breasts about his shaft, moving your body up and down to slide his erection through your cleavage.", parse);
	Text.NL();
	Text.Add("On his part, Vaughn works enthusiastically away at making love to your tits, his rough, powerful hands moving once more to your shoulders as he steadies himself. Balls slapping against your tits, his shaft quivering with the copious energy of his fucking, the fox-morph pounds away at you with unparalleled vigor. Giving in to the display of raw energy, you cry out as you feel the heat of his thick cock dive in and out of your cleavage, easily spearing it through with each movement of his hips; it’s all you can do to hold on tight to your [breasts] and support their quivering mass through the ferocious fucking they’re receiving.", parse);
	if(player.Lactation()) {
		parse["l"] = player.Humanoid() ? "your knees" : "the ground";
		Text.Add(" Coaxed forth from all the activity, dribbles of milk ooze from your nipples to run down your fingers and drip onto [l].", parse);
	}
	Text.NL();
	parse["c"] = player.FirstCock() ? Text.Parse(" and cock[s] stiff", parse) : "";
	Text.Add("Made sensitive and delicate from Vaughn’s rough groping, you’re treated to a medley of exquisite sensations, each one more intense than the last. Your breath is heated, your jaw slack[c], and it’s all you can do to keep yourself from collapsing onto the ground as your eyes roll back into your head from the sheer exhilaration of it all.", parse);
	Text.NL();
	Text.Add("Vaughn let out a grunt followed by a long stretched out groan; his shaft seems to swell between your [breasts] for a moment, and you quickly realize he’s going to orgasm all over you.", parse);
	Text.NL();
	Text.Add("And he does. Without warning, an enormous load spews forth from Vaughn’s manhood, utterly drenching ", parse);
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("your modest breasts in copious amounts of his baby batter. String after string of hot, sticky seed splatters onto your [skin] and pools in your cleavage until your [breasts] are thoroughly drenched. The warm flow quickly moves to coat the entirety of your chest with its slippery goodness, then moves on to your [belly] in a rich, gooey waterfall.", parse);
		Text.NL();
		Text.Add("Just how much seed do his balls hold? Far too much to be humanly possible - or maybe it’s just your mind playing tricks on you in the darkness, making you misjudge just how long blast after blast of cum founts onto your breasts. A heady, slightly salty smell surrounds you, and your heart skips a beat.", parse);
		Text.NL();
		Text.Add("All good things must come to an end, though. Streams turn to splatters, which in turn become dribbles. Utterly spent, Vaughn sags against you for a second or so, but quickly rights himself and withdraws his cock from your [breasts].", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("your face with glorious amounts of his baby batter. Fired in quick succession, shot after shot of hot fox cum blasts from his cock to land squarely on your face - on your forehead, your cheeks, your lips. You have to open your mouth to breathe, and naturally, some of his seed gets in and onto your tongue, hot and salty. It’s not exactly foul, but neither is it titillating, either; you’d much rather have it <i>on</i> you rather than <i>in</i> you.", parse);
		Text.NL();
		Text.Add("From your face onto your [breasts], then from your lady lumps onto your [belly], the torrent of cum that’s directed on you seems never-ending. It’s almost like having a bath, only much warmer and stickier and you have to concentrate on actually getting air into you - a task made more difficult by the haze of pleasure that swirls about you in the darkness.", parse);
		Text.NL();
		Text.Add("You don’t rightly remember the next few moments, but when your senses do come back to you you’re soaked and dripping all over, your [armor] utterly ruined by all the seed that’s on it. No point in trying to clean yourself up like this, not when you’re practically standing in a pool of the stuff.", parse);
		Text.NL();
		Text.Add("Gee, how pent-up <i>was</i> this guy anyway?", parse);
		Text.NL();
		Text.Add("Vaughn himself must be satisfied with the facial he’s given you, for he shudders and pulls his hips away from you, withdrawing his still-hard shaft with a squelch.", parse);
	}, 1.0, function() { return true; });
	
	scenes.Get();
	
	Text.NL();
	Text.Add("<i>“Gah,”</i> he groans after a moment’s heavy breathing. <i>“That was…”</i>", parse);
	Text.NL();
	Text.Add("Amazing? Mind-blowing? Incredible?", parse);
	Text.NL();
	Text.Add("<i>“Passable.”</i>", parse);
	Text.NL();
	Text.Add("Only passable? After he’s completely and utterly spent himself on you? Come on, you know you’re better than that.", parse);
	Text.NL();
	Text.Add("<i>“You can have… the best wine in the world, but that doesn’t mean… a whit to someone who doesn’t drink. Like our old sawbones, for one.”</i>", parse);
	Text.NL();
	Text.Add("Hrrmph. And just what was lacking?", parse);
	Text.NL();
	Text.Add("<i>“Could do with bigger tits,”</i> Vaughn replies bluntly.", parse);
	Text.NL();
	Text.Add("Well, if he’s going to be like that…", parse);
	Text.NL();
	Text.Add("<i>“You asked. I answered.”</i> There’s a shuffle of feet in the darkness, and you hear a soft thud of flesh against wood. <i>“You know, maybe you ought to be going. Sun’s going to be coming up soon, and I can guess at how you’re looking at the moment. You probably want to get properly cleaned up before showing your face to others.”</i>", parse);
	Text.NL();
	Text.Add("And him? He’s just going to stay here?", parse);
	Text.NL();
	Text.Add("<i>“I need… I need a moment. To catch my breath and… recover. You’d make better time without waiting on me.”</i>", parse);
	Text.NL();
	Text.Add("Hah, so he’s just looking for an excuse to send you away after you’re done. Fine. Did he at least enjoy himself?", parse);
	Text.NL();
	if(vaughn.HaveDoneTerryRoleplay()) {
		Text.Add("<i>“It was alright.”</i> You note that he doesn’t look you in the eye when saying it. <i>“Given what you had to work with, that is.”</i>", parse);
		Text.NL();
		Text.Add("You do suppose he’d like it if you were sporting a better rack the next time you dropped by, would he?", parse);
		Text.NL();
		Text.Add("<i>“Hey, I hear there’s a potion for everything these days. Might want to consider it, you know. Anyways, sun’s coming up soon. I’m sure you don’t want to be seen walking around without getting cleaned up first.”</i>", parse);
		Text.NL();
		Text.Add("Yeah, he’s right. Rising, you quickly nip off in search of a wash-up before it’s too late.", parse);
	}
	else {
		Text.Add("Now <i>that</i> gets him all clammed up. Seems like there really isn’t anything you can do about his situation for now… more’s the pity, then. Deciding to follow Vaughn’s advice, you quickly rise and nip off in search of a proper clean-up before your tacky condition’s exposed by the sun.", parse);
	}
	Text.Flush();
	
	player.AddSexExp(2);
	player.AddLustFraction(.3);
	
	world.TimeStep({hour: 1});
	
	Gui.NextPrompt();
}

// Confront Vaughn about calling you Sabrina
Scenes.Vaughn.SexConfront = function() {
	var parse = {
		playername : player.name
	};
	parse = player.ParserTags(parse);
	
	Text.Clear();
	Text.Add("Whoa, whoa, whoa. Wait just a minute there. Did he just call you Sabrina? It takes some strength of will, but you tear your mind off the titfuck you’re giving Vaughn and look up at him. His eyes are closed, and little yips and moans escape his muzzle as he continues fucking your [breasts] - well, first thing is to get his attention. With a jerk of your body, you pull your sweaty breasts away from his shaft, leaving its girthy length exposed to the cool night air. You can see it twitch and pulse, a dribble of seed leaking its way from the tip as it desperately tries to find that warm, snug place to thrust in once more. Slowly, you back away from the shadow of the watchtower such that there’s at least a little dim light to see by, even if it’s still unlikely that anyone will spy the both of you from a distance.", parse);
	Text.NL();
	Text.Add("The spell broken, Vaughn’s eyes flick open, and he rounds on you in a mixture of both anger and upset. <i>“Hey! Why’d you pull away?”</i>", parse);
	Text.NL();
	Text.Add("There are some things you need to talk to him about.", parse);
	Text.NL();
	Text.Add("The corner of Vaughn’s mouth twists. <i>“Seriously, are you kidding me? You throw your rack straight in my face and get me to give in and fuck you, and now you’re trying to blueball me? What the fuck is this?”</i>", parse);
	Text.NL();
	Text.Add("It’s where you’re asking him just why he’s crying out someone else’s name when his cock is buried in your rack, that’s all.", parse);
	Text.NL();
	Text.Add("<i>“Why, you got a problem with that? I was just indulging in a little fantasy while fucking, that’s all. Don’t tell me you’ve never done it before.”</i>", parse);
	Text.NL();
	Text.Add("It’s got to be a problem when the name he’s shouting for all to hear is that of his lost fiancee. Surely he can see what’s wrong with that?", parse);
	Text.NL();
	Text.Add("<i>“No.”</i>", parse);
	Text.NL();
	Text.Add("Really?", parse);
	Text.NL();
	Text.Add("<i>“I get my work done on time, don’t mope around, treat my folks decently, and even if I’m not the biggest bestest friend to everyone in the whole damned camp, I’d like to think I’m bearable to have around. So yeah, if I want to dream that the tits I’m fucking belong to Sabrina, then that’s my fucking business. Why, are <b>you</b> so bloody insecure that hearing another name during a quick fuck is going to turn your world upside-down? You’re not my wife, [playername], thank fucking Aria for that small mercy, because that spot’s already taken.”</i>", parse);
	Text.NL();
	Text.Add("So, despite all his protestations to the contrary, he hasn’t moved on. And he can’t hide it forever - it <i>is</i> tearing him apart, even if it’s not all at once. Sooner or later, he’s got to deal with the problem, and running away from it like he has been has only made things worse down the line. Sure, you’ve no doubt that he can get no end of one night stands, but when’s the last time in the past twenty years that he’s actually managed to keep a steady relationship? He’s damaged goods, and even if it may be no fault of his own, he’s got to fix himself.", parse);
	Text.NL();
	Text.Add("Vaughn spits on the ground. <i>“Answer my questions, damn you.”</i>", parse);
	Text.NL();
	Text.Add("Not when those questions are trying to draw you away from the point at hand. First step to solving a problem is admitting that there’s a problem. Letting go isn’t going to be easy, but he’s got to dump the baggage.", parse);
	Text.NL();
	Text.Add("No reply. Vaughn just stands there, his breath coming in ragged gasps, his shoulders heaving. You wonder if you should say something, provoke a response out of him, but then he grabs his slowly softening dick and shoves it back in his pants - not an easy task - and storms away from you, soon turning around a corner and disappearing from sight.", parse);
	Text.NL();
	Text.Add("Gee, this sure went well… but you’re sure that you made the right decision. Entertaining Vaughn’s fantasy might have been the easy way out, but it wouldn’t been good for anyone in the long run. It’s probably fine to let him fume for a while, but you ought to talk to him again tomorrow evening once he’s calmed down somewhat. Maybe he’ll be less defensive and more open to reason then…", parse);
	Text.Flush();
	
	vaughn.flags["Talk"] |= Vaughn.Talk.Confront;
	
	world.StepToHour(6);
	
	Gui.NextPrompt();
}

//Trigger this when the player next approaches Vaughn in the outlaws’ camp.
Scenes.Vaughn.ConfrontFollowup = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("Spotting Vaughn in his usual spot by the gates, you surreptitiously watch him from afar, trying to gauge the fox-morph’s mood. It’s a little hard, considering he’s wearing his usual stoic face, and - what the heck, you’re just making up excuses for you to put off finishing this. Putting on your sternest expression, you stride up to where he’s standing.", parse);
	Text.NL();
	Text.Add("The two of you eye each other for several moments, then it’s Vaughn who speaks. <i>“Look, about that -”</i>", parse);
	Text.NL();
	Text.Add("You shouldn’t have pushed that hard, yes, but you still stand by the points you made.", parse);
	Text.NL();
	Text.Add("<i>“Yeah. Fine. Not that I still don’t think it was a low blow, but I should be used to those by now. Anyways, I went ahead and slept on it, and… like it or not, you’re right.”</i>", parse);
	Text.NL();
	Text.Add("Huh, now that’s something more people could stand to say more often.", parse);
	Text.NL();
	Text.Add("<i>“Don’t get full of yourself,”</i> Vaughn continues with a scowl. <i>“I know the whole talk by now, all right? Let it go, move on, your time is running out, plenty more girls on the girl tree, that kind of stuff, okay? Knowing something in your head is one thing, following it is another; it’s not as if my head is the only part of me which has anything to do with it.”</i>", parse);
	Text.NL();
	Text.Add("As opposed to his other head?", parse);
	Text.NL();
	Text.Add("<i>“Oh ha ha, very funny. I’m trying to be serious here, and you go make a stupid joke. You damn well know perfectly what I mean.”</i>", parse);
	Text.NL();
	Text.Add("All right, you’re sorry. You were just trying to lighten the mood a little.", parse);
	Text.NL();
	Text.Add("Vaughn glares at you. <i>“Just… just don’t do it again. Please. I’ve been trying to let go for a while now, at least since I felt secure enough in this place that I wouldn’t end up on the road again. In some ways… it’d have been better if I knew for sure Sabrina were dead. If she made it to, say, the highlands or the Free Cities, I could reasonably assume that she was alive. But with what happened? She could be alive which would be good, she could be dead which would be a blow.</i>", parse);
	Text.NL();
	Text.Add("<i>“As long as she’s missing, I’m experiencing both sides of this. Hope that she still lives, dread that she’s dead. And I’m not hoping that fate is going to be so kind as to provide me with closure any time soon.”</i>", parse);
	Text.NL();
	Text.Add("He does know that if she’s still alive -", parse);
	Text.NL();
	Text.Add("<i>“I <b>know</b>, damn it. What sort of idiot thinks that a woman is going to wait for him twenty years, when it’s far more likely she’ll spread her legs for another guy twenty minutes after she thinks her previous squeeze’s croaked? I know I need to move on. I know how to move on. Actually doing it is a lot harder than saying it. And when you just stop in the middle of a titfuck to give me a high and mighty lecture on something I’ve been struggling with, it makes a man more than a little pissed, you know?”</i>", parse);
	Text.NL();
	Text.Add("If he’s been struggling with this for that long without any success, then it’s more than likely that he can’t do this alone. There’s no shame in getting a little help where it’s warranted.", parse);
	Text.NL();
	Text.Add("Silence. Then Vaughn looks away and snorts. <i>“Well, got any ideas?”</i>", parse);
	Text.NL();
	Text.Add("No, not at the moment, but you’ll let him know if you come up with something.", parse);
	Text.NL();
	Text.Add("<i>“Good luck cooking something up I haven’t already tried before.”</i>", parse);
	Text.NL();
	Text.Add("But if you <i>do</i>, he’ll have to try in earnest, okay?", parse);
	Text.NL();
	Text.Add("Vaughn mumbles something that’s neither here nor there, then sighs and lets his shoulders sag. <i>“Fine. Can we talk about something else now?”</i>", parse);
	Text.Flush();
	
	vaughn.flags["Talk"] |= Vaughn.Talk.ConfrontFollowup;
	
	world.TimeStep({hour: 1});
	
	Scenes.Vaughn.Prompt();
}
