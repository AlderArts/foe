/*
 * 
 * Define Magnus
 * 
 */
import { Entity } from '../../entity';
import { world } from '../../world';
import { GetDEBUG } from '../../../app';

let MagnusScenes = {};

function Magnus(storage) {
	Entity.call(this);
	this.ID = "magnus";
	
	this.name         = "Magnus";
	
	this.body.DefMale();
	this.body.SetRace(Race.Human);
	this.SetSkinColor(Color.white);
	this.FirstCock().length.base    = 80;
	this.FirstCock().thickness.base = 6;
	this.FirstCock().race           = Race.Demon;
	this.body.cock.push(this.FirstCock().Clone());
	this.body.cock.push(this.FirstCock().Clone());
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = 0;
	this.flags["Talked"] = 0;
	this.flags["Sexed"] = 0;
	this.flags["Teach"] = Magnus.Teaching.None;
	this.flags["Confronted"] = 0;
	
	if(storage) this.FromStorage(storage);
}
Magnus.prototype = new Entity();
Magnus.prototype.constructor = Magnus;

Magnus.Teaching = {
	None : 0,
	Wait : 1,
	Done : 2,
	Jeanne : 3
};

Magnus.Confront = {
	Not      : 0,
	Comfort  : 1,
	Complain : 2,
	Condemn  : 3
};

Magnus.prototype.Met = function() {
	return this.flags["Met"] != 0;
}

Magnus.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
}

Magnus.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	this.SaveSexFlags(storage);
	
	return storage;
}

MagnusScenes.Impregnate = function(mother, slot) {
	mother.PregHandler().Impregnate({
		slot   : slot || PregnancyHandler.Slot.Vag,
		mother : mother,
		father : magnus,
		race   : Race.Demon,
		num    : 1,
		time   : 15 * 24,
		load   : 4
	});
}

MagnusScenes.Interact = function() {
	Text.Clear();
	
	var parse = {
		upDown     : player.Height() >= 185 ? " up" : player.Height() <= 165 ? " down" : "",
		playername : player.name
	};
	
	if(magnus.flags["Met"] == 0) {
		Text.Add("Curious as to what could be so interesting about the dusty old book, you sneak up behind the young man to peek over his shoulder. The tome is filled with strange runes, scrawled willy-nilly all over the pages without any kind of system. At first glance they look like pure gibberish, but something about them calls out to you, though you cannot put your finger on what.", parse);
		Text.NL();
		Text.Add("Suddenly aware of his hidden audience, the young man looks up at you, adjusting his thick glasses to get better focus. He looks like he hasn’t shaved in a few days, but the stray scraggle on his chin doesn’t bode well for his chances of ever growing a beard. Behind the thick spectacles, you see dark pouches under his bleary eyes, presumably from lack of proper sleep. You’d gauge him to be in his early twenties.", parse);
		Text.NL();
		Text.Add("<i>“Yes?”</i> he mutters, somewhat irritated at being pulled out of his reverie. You tell him you were just curious as to what he was so focused on, and who he is for that matter. From all the strange people you’ve seen among the nomads so far, he seems a bit out of place.", parse);
		Text.NL();
		Text.Add("<i>“Oh, I’m a recent arrival,”</i> suddenly mindful of his ragged appearance, the young man puts down the tome and rises to face you, trying in vain to smooth out the wrinkles on his robe. <i>“My name is Magnus,”</i> he introduces himself, stretching out his hand, peering[upDown] at you curiously.", parse);
		Text.NL();
		Text.Add("You somewhat reluctantly shake hands with him, and present yourself.", parse);
		Text.NL();
		Text.Add("<i>“[playername], eh?”</i> He examines you closely, blushing slightly when you raise your eyebrows at his scrutiny. <i>“Ahem!”</i> Magnus coughs uncomfortably, his eyes wandering back to his tome. <i>“Well… I’m a student, of sorts. I study magic.”</i> He waves noncommittally to the large book.", parse);
		Text.NL();
		Text.Add("<i>“As to why I am here… I was recently expelled from the academy.”</i> He looks a bit bewildered and slightly hurt about this. <i>“I never really figured out why, they kicked me out and refused to let me back in. I wandered for quite a while until these fine folk took me in.”</i> He gestures to the nomads around the two of you.", parse);
		Text.NL();
		Text.Add("<i>“Ah, as much as I would like to chat with you more, I just think I understood something from my book, I need to check something quickly.”</i> With that, he once again sticks his nose into the dusty old tome, poring over the strange symbols therein. Looks like you are dismissed.", parse);
		
		magnus.flags["Met"] = 1;
		
		Text.Flush();
		
		Gui.NextPrompt();
	}
	else {
		if(GetDEBUG()) {
			Text.NL();
			Text.Add("DEBUG: relation: " + magnus.relation.Get(), null, 'bold');
			Text.NL();
		}
		
		Text.Add("You wave at Magnus as you pull up beside the young magician, flopping down on the log. He seems to register that you’re trying to talk to him, and briefly put his book down on his lap.", parse);
		Text.NL();
		if(!Scenes.Global.MagicStage1())
			Text.Add("<i>“Yes, [playername]? How can I help you?”</i>", parse);
		else
			Text.Add("<i>“[playername]! Great to see you again, how fare your studies?”</i>", parse);
		Text.Flush();
		
		var TalkPrompt = function() {
			//[Talk][Magic][Sex][Meditate]
			var options = new Array();
			options.push({ nameStr : "Talk",
				func : function() {
					Text.Clear();
					if(magnus.flags["Talked"] == 1) {
						Text.Add("<i>“Truly, you wish to hear my story again?”</i> Magnus seems happy about this, and clears his throat to reiterate his tale. ", parse);
					}
					else {
						Text.Add("<i>“Ah, there isn’t really much to tell,”</i> the young man scratches his scraggly attempt at a beard thoughtfully. ", parse);
					}
					
					Text.Add("<i>“I come from the other side of Eden, beyond the mountains. The power of the kingdom doesn’t reach there, and there are a number of free cities that govern themselves.”</i>", parse);
					Text.NL();
					Text.Add("<i>“The largest center of study on Eden is found there, the Academy of Higher Arts. Though they study all sorts of subjects, my interest has always been in magic. It is such a fickle and playful force, yet more powerful than anything you could imagine if wielded correctly.”</i>", parse);
					Text.NL();
					Text.Add("He goes on to tell you various things about his studies of the art of magic, and you are amazed at how dry and boring he can make conjuring fireballs sound. Despite yourself, you sort of drowse off, shaking yourself in order to not fall asleep.", parse);
					Text.NL();
					if(magnus.flags["Confronted"] != 0) {
						Text.Add("<i>“One day, I was no longer welcome there anymore.”</i> Magnus sighs sadly. <i>“If what you told me is true, I have my suspicions to what the cause may have been.”</i> The magician shakes his head despairingly. <i>“I- I must remain strong, and not let this entity become my master. I must study more...”</i> He waves toward his books uncertainly, grasping for the one constant in his troubled existence.", parse);
					}
					else {
						Text.Add("<i>“But alas, one day I was not welcome at the academy anymore.”</i> Magnus sighs to himself, despairing at the unfair nature of the world. <i>“I couldn’t even get a rational statement out of my teachers, they just chucked me out on the street and told me to never come back. They seemed almost… afraid. I’m not sure why, I mostly studied and meditated, never harmed a fly.”</i> The apprentice shrugs and gestures to the old tome he is currently reading.", parse);
						Text.NL();
						Text.Add("<i>“This and a few others were books I had borrowed from the library. Since they didn’t seem to want them back, I brought them with me to further my studies. For every page I read, I feel like I know less and less about how the world really works.”</i>", parse);
					}
					Text.NL();
					Text.Add("Him bringing it up seems to have rekindled his drive for learning. Magnus dives back down into his book, poring over the strange symbols, having seemingly forgotten about you.", parse);
					Text.Flush();
					
					magnus.flags["Talked"] = 1;
					
					world.TimeStep({hour: 1});
					
					Gui.NextPrompt(TalkPrompt);
				}, enabled : true,
				tooltip : "Ask him to tell his story."
			});
			if(magnus.flags["Talked"] == 1) {
				options.push({ nameStr : "Magic",
					func : function() {
						Text.Clear();
						
						if(gameCache.flags["LearnedMagic"] >= 2) {
							if(magnus.flags["Teach"] < Magnus.Teaching.Jeanne) {
								if(magnus.flags["Teach"] == Magnus.Teaching.Done) {
									Text.Add("<i>“Now that you mention it...”</i> Magnus peers at you curiously. <i>“I sense a change in your magic, as if you are much stronger now. Did you come to some insight, [playername]?”</i>", parse);
									Text.NL();
									Text.Add("You confide that you asked Jeanne to help you out with your studies, and that it helped you understand things better.", parse);
								}
								else {
									if(magnus.flags["Teach"] == Magnus.Teaching.None)
										Text.Add("<i>“Ah, does the subject of magic interest you?”</i> Magnus seems to brighten up, no longer the only nerd in the gathering. You nod.", parse);
									else if(magnus.flags["Teach"] == Magnus.Teaching.Wait)
										Text.Add("<i>“Ah, have you decided to give it another try, [playername]?”</i> Magnus peers at you suspiciously. <i>“I would really appreciate it if you could stay awake this time.”</i>", parse);
									Text.NL();
									Text.Add("Excited, he starts to quickly line out abstract concepts and ideas pertaining to the nature of magic. He scribbles magical symbols on the ground, explaining their origins and meaning. It’s not long before you feel yourself drowsing off. Let’s see if this shuts him up.", parse);
									Text.NL();
									Text.Add("Magnus’ tirade about the third theorem of the Ether falters and tapers off as you nonchalantly summon a ball of magical energy, hovering above your palm.", parse);
									Text.NL();
									Text.Add("<i>“Y-you can use magic?!”</i> the scrawny student exclaims, peering at your apparition of power. <i>“Tell me, where did you learn this?”</i>", parse);
									Text.NL();
									Text.Add("Dismissing the glowing orb, you explain that Jeanne showed you a few pointers.", parse);
								}
								Text.NL();
								Text.Add("<i>“<b>J-Jeanne?!?</b>”</i> he stutters as soon as you mention the elf. <i>“You studied under the court magician?!”</i>", parse);
								Text.NL();
								Text.Add("You go on to explain the circumstances of your lessons, and mention the gem that you carry.", parse);
								Text.NL();
								Text.Add("<i>“I… this is amazing, [playername]! Jeanne was the one who founded the academy where I studied, long ago. Meeting her would be a dream come true!”</i> He slumps a bit. <i>“Not that I think she’d have much interest in me...”</i>", parse);
								Text.NL();
								Text.Add("Perhaps. Maybe you could ask her.", parse);
								Text.NL();
								Text.Add("<i>“I… I’d very much like that,”</i> Magnus mumbles. <i>“Either way… I don’t think I can be of any use to you as a teacher anymore. Jeanne is a legend, I’m a mere apprentice...”</i> he trails off, his mind wandering.", parse);
								Text.NL();
								Text.Add("You leave the magician to his thoughts. Plenty of time to talk about this later.", parse);
							}
							else {
								Text.Add("<i>“Ah, I’m afraid I can’t really teach you anything that you don’t already know,”</i> Magnus confides, hanging his head sheepishly. <i>“I could perhaps be of some help in aiding you with meditation, if you’d like. Tell me, did you talk more with Jeanne? There is so much I want to ask her...”</i>", parse);
							}
							magnus.flags["Teach"] = Magnus.Teaching.Jeanne;
							Text.Flush();
						}
						else if(magnus.flags["Teach"] == Magnus.Teaching.None) {
							Text.Add("<i>“Ah, does the subject of magic interest you?”</i> Magnus seems to brighten up, no longer the only nerd in the gathering. You nod uncertainly, not really sure what you are getting yourself into.", parse);
							Text.NL();
							Text.Add("Excited, he starts to quickly line out abstract concepts and ideas pertaining to the nature of magic. He scribbles strange symbols on the ground, explaining their origins and meaning.", parse);
							Text.NL();
							
							if(player.jobs["Scholar"].level >= 3) {
								Text.Add("Somehow, you manage to somewhat follow what he is talking about, though you can feel your eyelids drooping dangerously.", parse);
								Text.NL();
								
								MagnusScenes.LearnMagic();
								return;
							}
							else {
								Text.Add("Despite your initial enthusiasm, you are unable to keep focused, and find your head dropping as sleep overcomes you. When you come to, Magnus is looking at you disapprovingly, slightly hurt over that you fell asleep during his tira-<i>lecture.</i>", parse);
								Text.NL();
								Text.Add("<i>“Come back once you’ve learned how to focus properly,”</i> Magnus admonishes you.", parse);
								Text.NL();
								Text.Add("<b>You will need to be at least a level 3 scholar to avoid falling asleep.</b>", parse);
								Text.Flush();
								magnus.flags["Teach"] = Magnus.Teaching.Wait;
								world.TimeStep({hour: 1});
							}
						}
						else if(magnus.flags["Teach"] == Magnus.Teaching.Wait) {
							if(player.jobs["Scholar"].level >= 3) {
								Text.Add("You tell him that you are ready to accept his teachings. This time, you manage to hang on to his words, and somehow remain alert throughout the ordeal. The magician looks encouraged by your intense focus.", parse);
								Text.NL();
								
								MagnusScenes.LearnMagic();
								return;
							}
							else {
								Text.Add("<i>“Come back once you’ve learned how to focus properly,”</i> Magnus admonishes you.", parse);
								Text.NL();
								Text.Add("<b>You will need to be at least a level 3 scholar to avoid falling asleep.</b>", parse);
								Text.Flush();
							}
						}
						else {
							// TODO: Variations
							
							Text.Add("<i>“I’m afraid I’ve taught you all I am able, everyone learns differently, and the best way to nurture your talent is to apply it diligently. I am sure you will become a great mage some day, if you just put effort into your studies! The only way I can help you now is to aid you in meditation, and perhaps lend you some reading material once you’ve advanced enough.”</i>", parse);
							Text.Flush();
						}
						
						Gui.NextPrompt(TalkPrompt);
					}, enabled : true,
					tooltip : "Ask Magnus if he could teach you how to use magic."
				});
				options.push({ nameStr : "Sex",
					func : function() {
						Text.Clear();
						if(magnus.flags["Confronted"] == 0) {
							Text.Add("<i>“W-what?”</i> The magician looks at you, bewildered. <i>“I hardly think that would be appropriate!”</i> he stutters, blushing as he goes back to his book, reading with renewed intensity. You smile slightly as you catch him throwing furtive glances in your direction.", parse);
							Text.NL();
							Text.Add("Guess that approach isn’t going to work.", parse);
						}
						else {
							Text.Add("<i>“I- uh, I don’t really feel comfortable about what I did to you, [playername],”</i> Magnus avoids your gaze, blushing. <i>“Perhaps… no, I cannot risk it. Something like that may bring the demon forth again.”</i> You aren’t quite sure what ‘something like that’ entails, but from his expression, you suppose it was naughty.", parse);
							Text.NL();
							Text.Add("Ah well, if you want some rough tentacle fucking, you know just the way to coax it out of him. Perhaps he’ll grow used to the idea sooner or later.", parse);
						}
						Text.Flush();
						
						Gui.NextPrompt(TalkPrompt);
					}, enabled : true,
					tooltip : "Proposition Magnus for a romp in the hay, so to speak."
				});
				if(Scenes.Global.MagicStage1()) {
					options.push({ nameStr : "Gem",
						func : function() {
							Text.Clear();
							Text.Add("Magnus shakes his head as you present him with the gemstone.", parse);
							Text.NL();
							Text.Add("<i>“I’m afraid I cannot help you, [playername]. I’ve never seen something like this before. Perhaps one of the staff at the academy… or maybe the court magician of Rigard could tell you more. It certainly contains magic, but also seems to be a product of alchemy.”</i>", parse);
							Text.Flush();
							
							Gui.NextPrompt(TalkPrompt);
						}, enabled : true,
						tooltip : "Ask Magnus about your gemstone."
					});
					options.push({ nameStr : "Meditate",
						func : MagnusScenes.Meditation, enabled : true,
						tooltip : "Meditate on the nature of the universe with Magnus."
					});
				}
			}
			if(magnus.flags["Sexed"] != 0 && magnus.flags["Confronted"] == 0) {
				options.push({ nameStr : "Confront",
					func : MagnusScenes.Confront, enabled : true,
					tooltip : "Tell him what happened to you while you were meditating."
				});
			}
			
			Gui.SetButtonsFromList(options, true);
		}
		
		TalkPrompt();
	}
}

MagnusScenes.Meditation = function() {
	var parse = {
		playername    : player.name
	};
	parse = player.ParserTags(parse);
	
	Text.Clear();
	Text.Add("You ask Magnus if the two of you can meditate together.", parse);
	Text.NL();
	Text.Add("<i>“Certainly, [playername]!”</i> he replies, putting a marker in his book and setting it down. The two of you sit on the ground and face each other. <i>“Relax your body, and let your mind focus,”</i> Magnus instructs you. <i>“Breathe slowly and rhythmically, close your eyes...”</i>", parse);
	Text.NL();
	Text.Add("Both of you go quiet, breathing slowly in rhythm with each other. Gradually, you feel the din and distractions of the camp around you recede, as the world around you grows smaller and smaller. Finally, only you and Magnus exist, your mind focused and sharp like the edge of a knife.", parse);
	Text.NL();
	Text.Add("On what shall you meditate?", parse);
	Text.Flush();
	
	//[Your quest][Magic][Sex]
	var options = new Array();
	options.push({ nameStr : "Your quest",
		func : function() {
			Text.Clear();
			Text.Add("You dwell on the actions and events that have led you to this point, and how you should proceed next.", parse);
			Text.NL();
			if(jeanne.flags["Met"] == 0)
				Text.Add("All you have seen so far has been connected to the gemstone you carry. The more you find out about it, the better. A magician, or an alchemist, may be able to tell you more, if you find one skilled enough.", parse);
			else if(!Scenes.Global.PortalsOpen())
				Text.Add("You need to find a way to power up the gemstone, and Jeanne seems to have a plan. Following her instructions seems to be the best course of action for now.", parse);
			else
				Text.Add("With the activation of the gemstone, the realms lie open for you to explore. Who knows what you might find if you step through one of the portals? Perhaps something that will aid you in your quest, and prepare you for the inevitable confrontation with Uru.", parse);
			Text.NL();
			Text.Add("<b>Later…</b>", parse);
			Text.NL();
			Text.Add("Gradually, you come to. Magnus is smiling at you as he gives you a hand up.", parse);
			Text.NL();
			Text.Add("<i>“Did you find a revelation?”</i> he asks. You are not really sure if you figured out anything new, but you thank him for his time anyway.", parse);
			Text.Flush();
			
			world.TimeStep({hour : 1});
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Try to figure out what you should do next."
	});
	options.push({ nameStr : "Magic",
		func : function() {
			Text.Clear();
			Text.Add("You try to muster what knowledge you have of magic, and attempt to see how it ties together with the gemstone. Calling on the power within you, you let it flow through your limbs, but do not release it. Rather than the raging current you feel when casting a spell, it is like a calm stream, pulsing gently.", parse);
			Text.NL();
			if(player.summons.length > 0) {
				parse["s"] = player.summons.length > 1 ? "s" : "";
				Text.Add("The gemstone pulses in unison with the flow of power through you, and you can hear the encouraging whispers of your astral companion[s], soothing your troubled heart.", parse);
				Text.NL();
			}
			Text.Add("<b>Later…</b>", parse);
			Text.NL();
			Text.Add("Gradually, you come to. Magnus is smiling at you as he gives you a hand up.", parse);
			Text.NL();
			Text.Add("<i>“I could feel you channeling your power as I meditated,”</i> he tells you. <i>“You are growing stronger every time we meet, [playername]!”</i>", parse);
			Text.Flush();
			
			player.AddSPFraction(1);
			world.TimeStep({hour : 1});
			
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Meditate on the nature of magic and the gemstone."
	});
	options.push({ nameStr : "Sex",
		func : function() {
			Text.Clear();
			var first = magnus.flags["Sexed"] == 0;
			if(first) {
				Text.Add("You find it very difficult to focus on anything productive, finally giving up and letting your mind wander. Thinking back to various sexual encounters and situations you’ve had so far in your travels, you begin to fantasize about the various people you’ve met, imagining them naked and horny.", parse);
				if(player.FirstCock()) {
					parse["isAre"] = player.NumCocks() > 1 ? "are" : "is";
					Text.Add(" Untouched, your [cocks] [isAre] stirring, clamoring for attention.", parse);
				}
				if(player.FirstVag())
					Text.Add(" A wet spot is spreading from your [vag], as it aches with need.", parse);
				Text.NL();
				Text.Add("Eventually, your thoughts wander to Magnus - naturally, since he is sitting right next to you. To be honest, he doesn’t have much going for him. Thin, scraggly and a bit of a nerd, bad eyesight, socially awkward… but what the heck, you still find yourself wondering what he is hiding under those robes.", parse);
				Text.NL();
				Text.Add("Suddenly, you feel heat waft against your body. Drowsy and disoriented, you slowly open your eyes and look around you. You are still in the nomads’ camp, but something is different, wrong. There is an eerie light cast on the surroundings, shifting from shades of purple to deep red. The sky is dim, with neither sun nor stars adorning it, a timeless twilight. Alarmed, you realize that there is no one around besides you and Magnus. No matter the time of day, there is always activity in the camp, but now it seems deserted.", parse);
				Text.NL();
				Text.Add("Moving sluggishly, you crawl over to the magician. He is slumped forward as if in deep sleep, head lolling drunkenly. You reach forward to rouse him, but quickly withdraw your [hand] when his head snaps up. His features are twisted into a strange grimace, somewhere between pain and ecstasy. When he opens his eyelids, there is nothing behind them but a black void.", parse);
				Text.NL();
				Text.Add("<i>One should be careful… of what one wishes for.</i>", parse);
				Text.NL();
				Text.Add("Magnus’ mouth is opening and closing, but the raspy voice is not his, and the movements do not match the words. Something is horribly wrong here. You try to scramble away from the possessed magician, only to find yourself bound where you sit, unable to move. Glancing down, you discover that a number of thick, slimy tentacles have wrapped themselves around your limbs. About a dozen of the writhing, dark purple things hold you down, crawling over your body and almost nonchalantly disrobing you. Tracing them with your eyes, they all seem to flow out from under Magnus’ robes.", parse);
				Text.NL();
				Text.Add("<i>You were wondering what this guy was... packing, weren’t you?</i> The ghastly voice doesn’t sound like it’s coming from anything human, with strange stuttering pauses in the middle of its sentences. One of the tentacles snakes up Magnus’ front, parting his robes and revealing his thin, pale body. Purple veins are spread all over his taut muscles, as if his whole body were a coiled spring ready to explode.", parse);
				Text.NL();
				Text.Add("You gasp as the tentacle moves out of the way, revealing not one, not two, but <i>three</i> bulging cocks sprouting from the magician's crotch. Each is at least ten inches in length, and thicker than a human's would be. Because by now, you are certain that the creature in front of you is not human, at least not anymore. All three of its throbbing members are the same purple color as its tentacles, and covered in thick veins and bumps.", parse);
				Text.NL();
				Text.Add("<i>So… gifted, is he… not?</i> The voice rasps. <i>Granted, he had… help.</i> Magnus’ mouth spreads in a wide grin as the creature chuckles - a low, wheezing sound, as if someone were choking.", parse);
				Text.NL();
				Text.Add("<i>Just… relax, he said?</i> The voice chuckles again. <i>If you… can. Relax… you’ll be getting just what… you wanted.</i> Erasing any doubts about what the betentacled creature meant, its slimy limbs constrict around you, pulling you closer to the possessed magician as it caresses your nude body. You could almost be aroused by the ordeal if it were not so terrifying.", parse);
				Text.NL();
				Text.Add("<i>The fun thing... is, he won’t remember… a thing.</i> You open your mouth to scream, but quick as a snake, a slightly thinner tentacle darts from between Magnus’ lips, thrusting down your throat. Your scream turns to a muffled moan as the tendril probes deeply down your windpipe, your throat-muscles contorting in vain, fighting for air.", parse);
				Text.NL();
				Text.Add("<i>Just be a… good pet, and you may survive the… night.</i> You tremble in fear while the purple vines probe your body, though they thankfully retract from your throat, allowing you to breathe again.", parse);
			}
			else {
				Text.Add("After what happened last time, you’d be insane to try to draw out the demon possessing Magnus… so yeah. You are probably insane. Still, you can’t help but to let your mind stray, this time focusing your thoughts very deliberately on Magnus. His mass of tentacles and trio of demonic cocks spring to mind, and you imagine them wrapping around you, clinging and squeezing, slick to the touch…", parse);
				Text.NL();
				Text.Add("Feeling the familiar heat of the other, ethereal realm, you open your eyes slowly. The sky above is a dim, empty void, the world illuminated by strange flickering lights in shades of red and purple. Magnus - or rather, the creature that is possessing him - is watching you intently, his eyes black portals into the infinite void.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>Returned, have… you? Were we... too gentle?</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>You cannot… save him by doing this... you know.</i>", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>Once again you bring… diversion to our imprisonment. Is it to mock… us?</i>", parse);
				}, 1.0, function() { return true; });
				
				scenes.Get();
				
				Text.Add(" The raspy voice sounds puzzled. It doesn’t look like the creature is interested in your response, however, as it moves quickly into action.", parse);
				Text.NL();
				Text.Add("In short order, your arms and [legs] are tied up by slithering purple tentacles, binding you securely while additional tendrils remove your gear. In the unnatural twilight of the other plane, you don’t feel any wind nor cold, yet you shiver as your body is laid bare before the creature, knowing what it is capable of.", parse);
				Text.NL();
				Text.Add("<i>Now… what to, do with you...?</i>", parse);
			}
			Text.Flush();
			
			Gui.NextPrompt(function() {
				Text.Clear();
				Text.Add("<i>We so seldom… awake. Though his body is frail, this Magnus… is strong... of mind.</i> The demon sounds almost sulky, complaining that it can’t rampage at will. <i>The academy was… fun, it sated… us. We could have stayed… there, made it our nest. But when they threw us out, we could not act, the… host, resisted.</i>", parse);
				Text.NL();
				Text.Add("As it speaks, the creature’s tentacles are wrapping around you, pulling you closer. The thick appendages ooze some kind of slime, leaving sticky patches of goo on your [skin] where they pass.", parse);
				if(player.FirstBreastRow().Size() > 3)
					Text.Add(" The creature seems to give special attention to your [breasts], squeezing them roughly, making your [nips] stand out, puffy and aroused.", parse);
				Text.Add(" You can almost feel the corrupting essence of the creature slipping into you, changing you to the very core. And - perhaps due to its influence - you find that you no longer care if it does.", parse);
				Text.NL();
				if(first)
					Text.Add("<i>We are sure you… can imagine what comes next,</i> the voice mocks you, swatting your [butt] playfully.", parse);
				else if(magnus.flags["Sexed"] < 5)
					Text.Add("<i>You know what… comes next, pet,</i> the voice purrs, caressing your [butt].", parse);
				else
					Text.Add("<i>We had not expected… to find such, a, slut. Coming back over and over… again, wanting to be… used.</i> The voice is triumphant, certain that it has broken you.", parse);
				Text.Add(" Suddenly, the tentacles wrap tighter and tighter around you, binding you securely. You are swiveled around, face inches from Magnus’ throbbing trio of demonic cocks, limbs splayed wide.", parse);
				Text.NL();
				Text.Add("<i>We are not un… grateful to our host. You shall pleasure him.</i> With that, the owner of the raspy voice relentlessly pushes you down on one of Magnus’ members. You can feel its uneven nubs and ridges dragging against the inside of your throat, straining painfully against your limits. The demon doesn’t play around, quickly impaling you on the ten inch erection. Ten? It somehow feels like more, as if the throbbing shaft is growing, seeking its way further down your tortured esophagus even as your lips are pressed against Magnus’ crotch.", parse);
				Text.NL();
				
				Sex.Blowjob(player, magnus);
				player.FuckOral(player.Mouth(), magnus.FirstCock(), 3);
				
				parse["vag"] = player.FirstVag() ? Text.Parse(" your [vag] and", parse) : "";
				Text.Add("As if that wasn’t enough, the roaming tentacles have started to take an interest in your own nethers, roughly probing[vag] your [anus].", parse);
				if(player.FirstCock()) {
					parse["setof"]  = player.NumCocks() > 1 ? " set of" : "";
					parse["s"]      = player.NumCocks() > 1 ? "s" : "";
					parse["notS"]   = player.NumCocks() > 1 ? "" : "s";
					parse["itselfThemselves"] = player.NumCocks() > 1 ? "themselves" : "itself";
					parse["itThem"] = player.NumCocks() > 1 ? "them" : "it";
					Text.Add(" Another[setof] tendril[s] wrap[notS] [itselfThemselves] around your [cocks], squeezing [itThem] painfully.", parse);
				}
				Text.Add(" Wherever the monster violates you, it leaves large gobs of its corrupting slime, which soon coat you inside and out.", parse);
				Text.NL();
				Text.Add("<i>One… down, two to… go.</i> For a blissful instant, you get to draw a deep breath, narrowly saving you from asphyxiation, before you are roughly shoved onto the next cock. You can see - and acutely feel - that they are indeed growing bigger by the second, having bloated to almost twice their original size. A fact that doesn’t even slow the demon in feeding you the entire length of the massive member. And there is still one to go.", parse);
				Text.NL();
				Text.Add("You are about to black out when you get another chance to catch a gasping, sputtering breath, coughing as you grasp at the fleeting lifeline. Way too quickly, you are pushed under the surface again, about thirty inches of demonic dick plunging down your throat, with more to go. The remaining two cocks, lathered in your saliva, sag heavily over your head and down your back, erect but pulled down by their sheer mass.", parse);
				Text.NL();
				Text.Add("It’s impossible, you tell yourself. The head of Magnus’ cock must be pushing inside your stomach by now, completely ignoring the physical limits of your body. Just when you can’t take any more abuse, a shudder runs through the skinny magician’s body, amplified into a great throbbing down your throat. Magnus’ three corrupted shafts twitch in unison as they pour their filthy load into and onto you - more of the thick slime that the tentacles have coated you in.", parse);
				Text.NL();
				if(first) {
					Text.Add("You thrash and rage ineffectually, trying to fight you assailant, but your strength amounts to nothing. Perhaps it is a property of this dimension, or the intoxicating slime coating your body and settling in your stomach, but you can’t seem to budge your restraints even an inch.", parse);
					if(player.Magic())
						Text.Add(" You try to form a spell, but your thoughts are too scattered for the necessary focus.", parse);
				}
				else
					Text.Add("You meekly accept it, gulping down the torrent of demonic cum, knowing that nothing you do can stop the creature from using you.", parse);
				Text.NL();
				parse["s"] = player.FirstVag() ? "s" : "";
				Text.Add("While you have been busy pleasuring Magnus, the monster has been rubbing and probing your remaining orifice[s] with a multitude of its tentacles, some of which are definitely too thick for you to take. Not that you think the demon cares.", parse);
				Text.NL();
				Text.Add("<i>Good… work, pet,</i> it gurgles mirthfully, relenting for a short while to let you catch your breath. After you’ve coughed up what feels like a gallon of the slimy cum, you get a chance to admire Magnus’ impressive members. Grown to their full size - or so you sincerely hope - they stand a good three feet tall, glistening with demonic pre.", parse);
				Text.NL();
				
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>You… seem to be enjoying your… self,</i> the raspy voice gloats. You can almost sense the trap as you open your mouth to throw back a response, but you are quite shaken from the ordeal, and a bit slow on the uptake. Before you have a chance to utter a word, you are deep-throating cock again, your entire body moving like a puppet on its master’s strings.", parse);
					Text.NL();
					parse["vag"] = player.FirstVag() ? Text.Parse(" and your [vag]", parse) : "";
					Text.Add("<i>Do you… enjoy... <b>this?</b></i> the demon asks, sounding half mocking, half genuinely curious, as the tentacles poised at your [anus][vag] shoot forth, plunging inside you with little resistance.", parse);
					Text.NL();
					
					Sex.Anal(magnus, player);
					player.FuckAnal(player.Butt(), magnus.FirstCock(), 5);
					
					if(player.FirstVag()) {
						Sex.Vaginal(magnus, player);
						player.FuckVag(player.FirstVag(), magnus.FirstCock(), 5);
					}
					
					Text.Add("You’d scream, if you could. In pain? Pleasure? The borders are blurring, you can’t even think straight anymore… all you can do is focus on the intense sensations of the multitude of cocks and tentacles roughly penetrating every available hole in your body. The long thick vines writhe and slither inside you, probing deeper and deeper, twisting and turning as they snake their way through your bowels.", parse);
					Text.NL();
					Text.Add("You honestly have no idea how many feet of tentacles the monster shoves inside your [anus], but you feel multiple tendrils working your abused orifice, stretching it wider and wider, pulsing as they explore your insides.", parse);
					if(player.FirstVag()) {
						Text.Add(" The tentacles thrusting into your [vag] find resistance much sooner, poking at the entrance to your uterus.", parse);
						if(player.FirstVag().Pregnant())
							Text.Add(" Finding your womb already occupied, they content themselves with snaking back and forth in your vaginal passage, increasing the thickness of the insertion manyfold.", parse);
						else
							Text.Add(" Your eyes shoot open in shock as you feel a single tendril make its way inside, coiling inside your womb.", parse);
					}
					Text.Add(" You feel so… full. There are no other words for it.", parse);
					Text.NL();
					Text.Add("Dimly, you notice that the cock in your mouth has deposited another load down your throat into your decidedly swelling belly, adding its foul seed to the first batch. It is quickly replaced by another one of the trio. With a sinking feeling, you realize that the demon could probably keep this up indefinitely. Its vigor certainly doesn’t seem to have anything to do with Magnus’ physical strength.", parse);
					Text.NL();
					if(player.FirstCock())
						MagnusScenes.SexSounding();
						parse["s"] = player.FirstVag() ? "s" : "";
						parse["womb"] = player.FirstVag() ? " and womb" : "";
					Text.Add("You pass in and out of consciousness, not sure how long the ordeal lasts. Your swelling stomach tells you that not only the cocks being pumped down your throat are feeding you their demonic cum, the tentacles fucking your other hole[s] are also depositing a seemingly endless amounts of their thick syrup into your bowels[womb].", parse);
					Text.NL();
					
					var cum = player.OrgasmCum(2);
					
					Text.Add("Next time you wake up, there is a large pool of cum beneath you.", parse);
					if(player.FirstCock())
						Text.Add(" Does it belong to you or the monster? A combination of both, probably.", parse);
					Text.Add(" You feel weak, worn out by the demon’s relentless assault. Just when you think you can take no more, you sense a shudder going through the entire creature, culminating in a cascade of thick, demonic semen pumping in from every side, in and on to you.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("<i>Like what... you see?</i> The mocking tone is clear in the demon’s voice. <i>Why not… become more familiar, with, them?</i> Saying so, it shoves your head back down, attempting to force two in at once, stretching your jaw painfully. It somehow manages to fit them in your mouth, but there is no way they are going down your throat. The monster reluctantly pulls you off Magnus’ members, plotting its next move.", parse);
					Text.NL();
					Text.Add("<i>Ah, perhaps this will… fit.</i> You are unceremoniously tumbled around, until your lower end is hovering above the throbbing trio.", parse);
					parse["s"] = player.FirstVag() ? "s" : "";
					if(player.LowerBodyType() == LowerBodyType.Single)
						Text.Add(" The tentacles are wrapping tightly around your lower body, preventing any possible struggle.", parse);
					else
						Text.Add(" Your [legs] are splayed out wide, baring your hole[s] for the inevitable penetration.", parse);
					Text.Add(" Without further ado, the monster lowers you onto Magnus’ waiting cocks.", parse);
					Text.NL();
					parse["s"]    = player.FirstVag() ? "s" : "";
					parse["aThe"] = player.FirstVag() ? "a" : "the";
					parse["notS"] = player.FirstVag() ? "" : "s";
					parse["v"]  = player.FirstVag() ? Text.Parse("[vag] and ", parse) : "";
					parse["itsTheir"] = player.FirstVag() ? "their" : "its";
					parse["itThey"]   = player.FirstVag() ? "they" : "it";
					parse["isAre"]    = player.FirstVag() ? "are" : "is";
					Text.Add("You groan, wincing as [aThe] massive pillar[s] impale[notS] your [v][anus], stretching the orifice[s] far beyond [itsTheir] limit[s]. The excessive amount of slimy goo that the demonic tip[s] leak[notS] makes [itsTheir] penetration somewhat easier, but [itThey] [isAre] still far beyond the capacity of any ordinary human. You can see the bulge on you belly crawling upward slowly as ten, fifteen, twenty inches slip inside. Whenever the monster encounters resistance, the tentacles holding your limbs just pull harder, using brute strength to open you up.", parse);
					if(player.FirstVag())
						Text.Add(" The cock in your [vag] twists and turns, much like the monsters tentacles limbs, rubbing against your crevix.", parse);
					Text.NL();
					
					Sex.Anal(magnus, player);
					player.FuckAnal(player.Butt(), magnus.FirstCock(), 5);
					
					if(player.FirstVag()) {
						Sex.Vaginal(magnus, player);
						player.FuckVag(player.FirstVag(), magnus.FirstCock(), 5);
					}
					
					parse["oneof"] = player.FirstVag() ? "" : " one of";
					parse["s"]     = player.FirstVag() ? "" : "s";
					Text.Add("After a while, the demon seems to grow tired of your screams. One of its tentacles grabs hold of the back of your neck and pushes your head down on[oneof] Magnus’ remaining cock[s], muffling your protests. All you can do is close your eyes and whimper, accepting your abuse.", parse);
					Text.NL();
					Text.Add("Before you know it - your senses are starting to waver a bit - over two thirds of Magnus’ dicks have been swallowed by your holes, stretching you impossibly on every side. In order to fit inside your ravaged body, the shafts have changed, becoming more malleable. Not softening, definitely not, but twisting and bending like the tentacles holding you captive.", parse);
					Text.NL();
					Text.Add("<i>Don’t… pass out on us… pet,</i> the demon rasps. <i>Our host has… earned this. You would, not… deny him this, yes?</i> As if you have a choice in the matter. In a sudden burst of movement, Magnus jerks to his feet, as much a victim to the strings of the demonic puppet master as you are, albeit unknowingly so.", parse);
					Text.NL();
					Text.Add("Thrusting his hips like a man possessed - literally - the scrawny magician starts to fuck you with abandon, pulling in and out of your wrecked body at a blinding speed. You are shaking, writhing against your unrelenting bonds, completely overwhelmed by the demon’s feral lovemaking.", parse);
					Text.NL();
					
					if(player.FirstCock())
						MagnusScenes.SexSounding();
					
					if(player.FirstVag()) {
						if(player.FirstVag().Pregnant())
							Text.Add("<i>Already… bred. Come, back, when you have given birth, pet,</i> the demon rasps. <i>We shall make, you... the mother of our brood, make your belly… swell, crawling with tentacle spawn.</i>", parse);
						else
							Text.Add("<i>You shall… be the willing - yes, yes… willing - vessel for our spawn,</i> the demon gloats as it pounds your [vag], each thrust threatening to invade your almost defenseless womb. <i>We shall fill you up, little thing… yes, bloat your tummy with thousands of tentacle spawn.</i>", parse);
						Text.NL();
					}
					Text.NL();
					Text.Add("Your eyes roll back as the demon cums, pouring massive loads of corrupted semen into your every orifice. Within seconds, your stomach is dangerously swollen, permeated by sticky goop from two directions. ", parse);
					if(player.FirstVag()) {
						if(player.FirstVag().Pregnant())
							Text.Add("The last of Magnus’ members unload inside your [vag], flooding your passage with demonic seed.", parse);
						else
							Text.Add("The last of Magnus’ members unload directly into your womb, flooding it just like the creature promised.", parse);
					}
					else
						Text.Add("Magnus’ remaining cock has been rubbing against your expanding belly the entire time, and now it explodes in a fountain of sperm, coating your entire front and seeping into your [skin].", parse);
					Text.NL();
					Text.Add("The feeling of absolute fullness, a constant pressure in your insides, finally sends you over the edge. Wracked by a powerful orgasm, you pass out, your body spent.", parse);
					Text.NL();
					
					var cum = player.OrgasmCum(2);
					
					Text.Add("You wake some time later, roused by yet another dose of cum from the demon. From your aching bones, you can only assume that it just kept on fucking you, seemingly having no limits to its stamina. You fade in and out of consciousness for the next hour or so, completely at the creature’s mercy.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					parse["s"] = magnus.flags["Sexed"] > 1 ? "s" : "";
					Text.Add("<i>We have… perhaps, been too kind to you,</i> the demon gurgles maliciously, pulling at your body like one would at a toy. If what happened during your previous visit[s] is the creature’s definition of kind, you are in for a <i>really</i> rough ride.", parse);
					Text.NL();
					Text.Add("One of its tentacles - scratch that - four of its tentacles mash against your [anus], lathering themselves in the slimy goop now covering your entire body as they pry for entry. That is familiar enough, you think to yourself, grunting as they inevitably succeed, snaking through your bowels. More and more of the tendrils join the fray, each one stretching your tortured colon farther and farther. If it wasn’t for the demonic magic working on you - either from the creature itself or by this strange ethereal realm - you would have long ago been split in two, torn asunder by the cruel demon.", parse);
					Text.NL();
					
					Sex.Anal(magnus, player);
					player.FuckAnal(player.Butt(), magnus.FirstCock(), 5);
					
					Text.Add("But no such fate awaits you. You are forced to feel every second of it, even as your ravaged body teeters on the brink of oblivion.", parse);
					if(player.FirstVag())
						Text.Add(" Additional tentacles quickly find your remaining hole, eagerly plugging it shut. You moan helplessly as a mass of the slithery tendrils invade your [vag], stretching this part of your body as well.", parse);
					Text.Add(" The writhing vines surging into your [anus] have somehow reached your stomach, meaning that there are feet and feet of tentacles violating you. Your eyes widen, and you wordlessly shake your head, knowing what comes next and begging it to stop, but the demon callously ignores your pleas.", parse);
					Text.NL();
					
					if(player.FirstVag()) {
						Sex.Vaginal(magnus, player);
						player.FuckVag(player.FirstVag(), magnus.FirstCock(), 5);
					}
					
					Text.Add("In a final burst of agonizing movement, the tentacles in your stomach surge upward through your esophagus, flowing out of your gaping maw like dozens of squirming snakes. You can’t breathe, there isn’t any room for even a sip of air to reach your lungs, yet somehow you are not suffocating.", parse);
					Text.NL();
					Text.Add("Yes, there is pain, a burning in your throat, but even that soon fades as the corrupting yet soothing slime the tentacles are coated in cools you down. There are no words to describe this fullness. Every square inch of your insides is stretched taut, bending to the massive pressure exerted by the multitude of demonic tentacles violating your very being.", parse);
					Text.NL();
					
					if(player.FirstCock())
						MagnusScenes.SexSounding();
					
					Text.Add("The demon is moving slowly inside you, its tentacles throbbing and pulsing. Dangling on the hovering mass of vines, impaled by it, you can’t even lift a finger as you are gradually hoisted through the air, twisting and turning until you are face to face with Magnus’ trio of dripping cocks.", parse);
					Text.NL();
					Text.Add("The main trunk of tentacles working your throat withdraw down into your stomach again, leaving a thin layer of tendrils to keep your abused windpipe spread. Your jaw aches from the strain, but the worst is yet to come. Packing them together with one of its tentacles, the demon force-feeds you not one, not two, but all three of Magnus’ immense cocks, jamming them down your recently vacated throat. The switch is so sudden you hardly even have time to catch your breath.", parse);
					Text.NL();
					
					Sex.Blowjob(player, magnus);
					player.FuckOral(player.Mouth(), magnus.FirstCock(), 3);
					
					Text.Add("If being slowly spitroasted by the invasive tentacles was agonizing, the massive throatfucking you are receiving now is torment. You keep telling yourself that this is impossible, but that does little to change your situation. The demon’s raspy voice laughs maliciously as it shoves the thick trio of corrupted cocks down your gullet, the members so long that they easily reach your overcrowded stomach.", parse);
					Text.NL();
					Text.Add("Once it has grown bored of raping your throat, the demon jerks itself off inside your stomach using its tentacles, hissing and chuckling as it brings Magnus to climax. When it comes, it is like a sudden expansion, an explosion of cum originating in your stomach and trying to escape in every direction at the same time.", parse);
					Text.NL();
					
					var cum = player.OrgasmCum(2);
					
					Text.Add("You groan helplessly, pushed far beyond your own limits as the heat spreading through your straining belly triggering your own orgasm. Tugging your body roughly, the tentacled creature pulls you off its cocks, a rapidly rising wall of semen following closely behind the retracting tips. It pulls out of your lips and your [anus] at approximately the same time, first pausing in order to fill up the little remaining space inside you with its corrupted seed.", parse);
					Text.NL();
					parse["v"] = player.FirstVag() ? Text.Parse(", [vag]", parse) : "";
					Text.Add("When it does retract its tentacles, the suppressed demonic cream spews out of your mouth[v] and [anus] in a huge cascade, ceaselessly fountaining out as your body writhes, trying to expel the alien substance.", parse);
				}, 1.0, function() { return !first; });
				
				scenes.Get();
				
				if(player.Butt().capacity.IncreaseStat(60, 5) > 0) {
					Text.NL();
					Text.Add("<b>Your ass feels stretched, forced to accomodate larger insertions.</b>", parse);
				}
				if(player.FirstVag() && player.FirstVag().capacity.IncreaseStat(50, 5) > 0) {
					Text.NL();
					Text.Add("<b>Your vagina feels stretched, forced to accomodate larger insertions.</b>", parse);
				}
				
				Text.NL();
				Text.Add("Finally sated, the betentacled demon discards you on the ground, throwing you aside like a used rag, leaking at the seams.", parse);
				var TFd;
				if(first) {
					Text.Add(" You feel an uneasy rumbling in your belly, but miraculously, the substances the demon poured into you doesn’t seem to have had any effect on you. So far.", parse);
				}
				else {
					Text.Add(" You can feel the roiling pool of cum inside, seeping into your very being and suffusing it with corruption.", parse);
					TFd = Items.Infernum.Use(player, true).changed != TF.Effect.Unchanged;
				}
				Text.NL();
				Text.Add("<i>It’s such a… bind to have been imprisoned in this host. He holds no… thought but that which seeks to further his, knowledge, of magic. Our seduction, doesn’t work… But. If we are drawn forth by… naughty souls such as you, we can… thrive. We will one day be… free.</i>", parse);
				Text.NL();
				Text.Add("The raspy voice echoes, leaving you with an uneasy feeling as consciousness fades.", parse);
				
				MagnusScenes.Impregnate(player, PregnancyHandler.Slot.Vag);
				MagnusScenes.Impregnate(player, PregnancyHandler.Slot.Butt);
				
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("You don’t know how much later it is when you awake, it could be minutes or months. You are back in the regular world, drunk with sleep. Though there doesn’t seem to be any lasting damage or even any trace on your body, every fiber of your being aches, the foul taste in your mouth confirmation that your abuse was no dream.", parse);
					Text.NL();
					Text.Add("Magnus is hovering over you with a concerned look on his face. <i>“You were out there for a while,”</i> he says. ", parse);
					if(magnus.flags["Confronted"] != 0)
						Text.Add("<i>“I-it didn’t come out again, did it? I must seek to further strengthen my resolve.”</i> The magician looks crestfallen.", parse);
					else
						Text.Add("<i>“Really now, in meditation you should contemplate your inner self, not fall asleep!”</i> The magician sounds reproachful, unaware of what you just went through.", parse);
					if(TFd) {
						Text.NL();
						Text.Add("For a moment, he looks troubled, as if he is about to question you about your changed appearance, but he changes his mind. Perhaps he thought it rude to ask.", parse);
					}
					
					magnus.flags["Sexed"]++;
					
					world.TimeStep({hour : 4});
					player.AddLustFraction(-1);
					
					if(first) {
						Text.Flush();
						//[Confront][Say nothing]
						var options = new Array();
						options.push({ nameStr : "Confront",
							func : MagnusScenes.Confront, enabled : true,
							tooltip : "Tell him what happened to you while you were meditating."
						});
						options.push({ nameStr : "Say nothing",
							func : function() {
								Text.Clear();
								Text.Add("You keep silent regarding your experiences, mulling them over silently. You have to consider how you should treat the magician from now on, and if you should confront him about what happened. He is clearly not aware of it himself.", parse);
								Text.Flush();
								Gui.NextPrompt();
							}, enabled : true,
							tooltip : "You are not even sure what you would say to him at this point."
						});
						Gui.SetButtonsFromList(options);
					}
					else {
						Text.NL();
						Text.Add("<i>“Until next time then.”</i> Magnus helps you up before sinking back into his books.", parse);
						Text.Flush();
						Gui.NextPrompt();
					}
				});
			});
		}, enabled : true,
		tooltip : magnus.flags["Sexed"] == 0 ? "Despite - or perhaps because of - knowing what will happen, let your mind wander to thoughts of sexual, depraved acts." : "This is boring, let your mind wander to dirty things. WARNING: Might have consequences."
	});
	Gui.SetButtonsFromList(options);
}

MagnusScenes.SexSounding = function() {
	var parse = {
		setof : player.NumCocks() > 1 ? " set of" : ""
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Text.Add("Spare tentacles are wrapping themselves about your [cocks], squeezing [itThem] as if to coax the milk from your [balls]. Quickly, the monster has set into a jerking rhythm, keeping to the same pace it’s fucking you at. Forming a[setof] tight cocksleeve[s], the tentacles jerk you off, spreading their slimy goo along the length[s] of your shaft[s].", parse);
	Text.NL();
	Text.Add("Another convulsion runs through you as[a] thinner tendril[s] - thin, but not nearly thin enough - probe[notS] [itsTheir] way into your urethra. Quick as a snake, [itThey] travel[notS] up your cock[s] from the inside, triggering pleasure centers you weren’t even sure you had. Before long, the monster is mashing against your prostate, not only through your abused [anus], but also tickling it directly through your rock-hard [cocks].", parse);
	Text.NL();
}

MagnusScenes.Confront = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>“S-surely you must be mistaken!”</i> Magnus looks shocked as you describe your encounter with the demon possessing him. <i>“What is the meaning of this, [playername]?!”</i> He looks very troubled. You ask him what it was that he was meditating about at the time.", parse);
	Text.NL();
	Text.Add("<i>“Oh, I don’t know, I was working on this theorem and… must have dozed off or something, can’t quite remember.”</i> He huffs indignantly. <i>“But for you to sneak in and lift my robes, s-surely that is not appropriate.”</i> The magician must be referring to that you know about the rather unusual genitalia hanging between his legs. His blush confirms it, if nothing else.", parse);
	Text.NL();
	Text.Add("You counter by asking him if he’s always been packing those. <i>“R-really now,”</i> he mutters, his glasses fogging. <i>“Fine. I was not born that way. It happened while I was at the academy, a rather nasty side effect of a failed spell I cast, but I made sure to hide it. More of an embarrassing inconvenience, really.”</i> And that spell was…?", parse);
	Text.NL();
	Text.Add("<i>“I hardly remember now, it was from the Tome of Erodith, a fascinating study on the art of summoning spirits...”</i> The magician falters, a horrified expression dawning on his face. <i>“Oh my,”</i> he says in a small voice. <i>“The spell… didn’t fail, did it?”</i>", parse);
	Text.NL();
	Text.Add("That is one way of putting it.", parse);
	Text.NL();
	Text.Add("<i>“I-I don’t know what to say, [playername], I am so sorry, to have put you through something so horrifying…!”</i> Magnus blabbers, thrust into unfamiliar waters. <i>“I must find a way to banish this demon as soon as possible… but I no longer have the book.”</i> He looks defeated. <i>“Without the Tome of Erodith, there isn’t any way for me to find out what happened… and no recourse to take.”</i>", parse);
	if(party.InParty(kiakai)) {
		Text.NL();
		parse["name"]  = kiakai.name;
		parse["HeShe"] = kiakai.HeShe();
		parse["heshe"] = kiakai.heshe();
		Text.Add("<i>“Perhaps you should seek the guidance of Lady Aria,”</i> [name] pipes in, having remained silent up to this point. [HeShe] looks rather shaken by your story, though [heshe] is loath to miss an opportunity to proselytize.", parse);
		Text.NL();
		Text.Add("<i>“I appreciate the suggestion, but I don’t think coming knocking on the temple door claiming I’m possessed by a demon is going to do anything but get me thrown on the chopping block,”</i> Magnus counters.", parse);
	}
	Text.Flush();
	
	//[Condemn][Comfort][Complain]
	var options = new Array();
	options.push({ nameStr : "Comfort",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Thank you, [playername],”</i> Magnus bows his head gratefully. <i>“Your words are heartening, though not strictly true. If I hadn’t messed with that book, this would never had happened.”</i> The magician sighs, scratching his scraggly beard.", parse);
			Text.NL();
			Text.Add("<i>“It’s easy to say it wasn’t my intention, but that hardly helps the situation. I will try my best to contain this beast, but to truly exorcise it, I will need the Tome of Erodith. And that is surely locked securely in the Academy’s limited sections now.”</i>", parse);
			Text.NL();
			Text.Add("You decide to leave the disheartened mage to his thoughts for now.", parse);
			Text.Flush();
			
			magnus.flags["Confronted"] = Magnus.Confront.Comfort;
	
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "This wasn’t his fault. Well, not his intention anyway."
	});
	options.push({ nameStr : "Complain",
		func : function() {
			Text.Clear();
			Text.Add("<i>“Surely you can’t mean… you liked it?”</i> Magnus looks at you in disbelief. You reply that you most certainly did. Sure, it was a bit rough… but he certainly is ‘gifted’. Can he do that growing thing with his cocks on demand?", parse);
			Text.NL();
			parse["stutterName"] = player.name[0] + "-" + player.name;
			Text.Add("<i>“[stutterName]!”</i> Magnus sputters, shocked. <i>“I- uh- ahem.”</i> He is blushing, fidgeting with his hands and trying to look everywhere but right at you. <i>“I- uh- I would say that I’ve never… been with anyone before, but apparently I have,”</i> he mumbles, clearly discomforted.", parse);
			Text.NL();
			Text.Add("<i>“I… appreciate your attempt to cheer me up - I think? But I can’t have this thing taking over me. I don’t remember a thing of what happened! I might hurt someone.”</i> The magician looks very unhappy.", parse);
			Text.NL();
			Text.Add("<i>“I… will try to control it. Though perhaps if you want I could...”</i> he trails off, blushing fiercely. <i>“A-anyway. I need to get hold of the Tome of Erodith. It is probably locked up deep within the Academy by now.”</i>", parse);
			Text.NL();
			Text.Add("You leave the troubled magician to his thoughts. Perhaps he will be more susceptible to intimate things later, and, if not, you know how to call out the demon now. You find yourself drooling a bit as you ponder the notion.", parse);
			Text.Flush();
			
			magnus.flags["Confronted"] = Magnus.Confront.Complain;
	
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Why would he try to suppress it?"
	});
	options.push({ nameStr : "Condemn",
		func : function() {
			Text.Clear();
			Text.Add("<i>“I am truly sorry,”</i> the magician bows his head, unwilling to look at you. <i>“I promise I will make it up to you, but I need time. I can’t exorcise the demon without the Tome of Erodith, but I can attempt to restrict its influence, now that I know it’s there.”</i>", parse);
			Text.NL();
			Text.Add("<i>“I… can understand if you do not want to talk to me after this,”</i> he mumbles, looking sad.", parse);
			Text.NL();
			Text.Add("Perhaps you will. Perhaps you won’t.", parse);
			Text.Flush();
			
			magnus.flags["Confronted"] = Magnus.Confront.Condemn;
	
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "Berate him for his irresponsible actions."
	});
	Gui.SetButtonsFromList(options);
}

MagnusScenes.LearnMagic = function() {
	var parse = {
		hand : function() { return player.HandDesc(); },
		playername : player.name
	};
	
	Text.Add("Once he has explained the basic terms and concepts behind using magic, he tells you that it is time for a demonstration. He walks off a small distance from the campfire, away from the other nomads.", parse);
	Text.NL();
	Text.Add("<i>“Know that I’m still a mage in training, so I need time and focus to properly use these powers,”</i> he explains. You sit back and wait while he closes his eyes, breathing deeply. Sparks of light begin to dance on his outstretched palms, changing colors and swirling around playfully.", parse);
	Text.NL();
	Text.Add("<i>“Spire!”</i> Magnus shouts, throwing his hands down toward the earth. There is a loud rumbling noise, and a pillar of rock twice his height shoot up into the air, pebbles and clumps of dirt raining down everywhere. He looks pleased with his handiwork, and turns back to you.", parse);
	Text.NL();
	Text.Add("<i>“That was an example of a beginners level elemental spell,”</i> he explains, dusting the debris from his robes. <i>“The elements are the easiest to start with, though there is a step even before that.”</i> He holds out his hand and focuses again, summoning the dancing lights. As he does, you notice that the gem in your pocket is resonating with the lights, pulsing slightly.", parse);
	Text.NL();
	Text.Add("<i>“First, you must gather your own energy and mold it, forming patterns and symbols with it to boost its power. The stronger the magic around you is, the easier you will find this, but it is not a skill everyone can learn. It might take you months of deep meditation before you are able to handle it properly.”</i>", parse);
	Text.NL();
	Text.Add("You think back on the concepts and ideas that Magnus has explained to you, trying to figure out how to apply them. First, you try to close your eyes and breathe, as you saw him do, but after a while your mind wanders when nothing happens. Slightly frustrated, you try again, stretching out your [hand]s in front of you and concentrating.", parse);
	Text.NL();
	Text.Add("<i>“Don’t feel bad about it, it took me weeks before I could even muster the magic to light a candle,”</i> the magician encourages you. You irritably wave him away, intent on making this work. Another ten minutes or so pass before you are just about fed up with this. In frustration, you throw your [hand]s down, rubbing against the gemstone in your pouch by chance. You yelp as you are struck by a small spark, stinging you. The stone falls to the ground, glowing slightly.", parse);
	Text.NL();
	Text.Add("Carefully, you retrieve the gemstone, looking at it curiously. It feels strangely warm in your [hand], as if it has a life of its own. On a whim, you try to focus on gathering magic again, and the dull glow inside the stone intensifies. Seems like you are on to something here.", parse);
	Text.NL();
	Text.Add("With the help of the gem acting as an indicator, you manage to narrow down the exact state of mind needed to focus your energy in a remarkably short amount of time. Happy with your efforts, you pocket the gem and stretch out your [hand]s again. Breathing deeply, you summon powerful forces from within you, your arms tingling as glowing spots of light dance from your fingertips.", parse);
	Text.NL();
	Text.Add("Magnus is gaping at you as the light grows, enveloping your [hand]s. You grin at him, almost feeling like you are showing off. The light grows steadily, and you are beginning to feel a bit weak, as if the act is somehow draining you. The magician shakes himself a bit, suddenly looking a bit concerned.", parse);
	Text.NL();
	Text.Add("<i>“This is amazing, [playername], but you must release it, or you will pass out!”</i> he warns you, hurrying to your side. You follow his intent instructions on how to channel the flow of energy, trying to focus as you feel your strength wane.", parse);
	Text.NL();
	Text.Add("<i>“Surge!”</i> A blast of energy flows from your [hand]s, blasting a small crater in the ground. You weakly flop down on your back, completely drained from the ordeal.", parse);
	Text.NL();
	Text.Add("<i>“Astounding!”</i> Magnus exclaims, eyes shining brightly, <i>“I’ve never seen someone attune themselves so quickly! Just what is that stone…?”</i>", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("You eventually disentangle yourself from the enthusiastic mage, explaining that you have things to do, and that you could probably use a few hours of sleep. Magnus reluctantly lets you go, but hands you a few scrolls before you leave.", parse);
		Text.NL();
		Text.Add("<i>“To further your studies,”</i> he explains. <i>“With such talent, I’m sure you will surpass me in no time!”</i> The scrolls seem to line out a few basic spells, and with the aid of Magnus, you manage to decipher them.", parse);
		Text.NL();
		Text.Add("<b>Unlocked the Mage job.</b><br>", parse);
		Text.Add("<b>Unlocked the Mystic job.</b><br>", parse);
		Text.Add("<b>Unlocked the Healer job.</b><br>", parse);
		Text.NL();
		Text.Add("You thank him for his help, and set out on your journey, a new power at your beck and call.", parse);
		Text.Flush();
		
		world.TimeStep({hour: 3});
		player.AddSPFraction(-1);
		
		gameCache.flags["LearnedMagic"] = 1;
		magnus.flags["Teach"] = Magnus.Teaching.Done;
		
		Gui.NextPrompt();
	});
}

MagnusScenes.Desc = function() {
	var parse = {
		litExtinguished : world.time.hour >= 19 ? "lit" : "extinguished"
	};
	
	if(magnus.flags["Met"] == 0) {
		Text.Add("Near the [litExtinguished] campfire, you see a thin and nervous-looking young man. He is carrying slightly tattered robes and a pair of thick glasses, and seems to be embroiled in studying a heavy tome. The man hardly seems to register anything going on around him, so absorbed is he in the book.", parse);
	}
	else {
		Text.Add("Magnus the apprentice mage is poring over some old book, probably trying to find some secret knowledge in the strange, squiggly symbols covering its pages. As usual, he is deeply focused on his studies, and you doubt even an attack on the camp would distract his reverie.", parse);
	}
	Text.NL();
}

export { Magnus, MagnusScenes };
