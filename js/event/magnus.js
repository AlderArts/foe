/*
 * 
 * Define Magnus
 * 
 */
function Magnus(storage) {
	Entity.call(this);
	
	
	this.name         = "Magnus";
	
	this.body.DefMale();
	this.body.SetRace(Race.satyr);
	this.SetSkinColor(Color.olive);
	TF.SetAppendage(this.Back(), AppendageType.horn, Race.satyr, Color.black, 2);
	
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Met"] = 0;
	this.flags["Talked"] = 0;
	this.flags["Teach"] = Magnus.Teaching.None;
	
	if(storage) this.FromStorage(storage);
}
Magnus.prototype = new Entity();
Magnus.prototype.constructor = Magnus;

Magnus.Teaching = {
	None : 0,
	Wait : 1,
	Done : 2
};

Magnus.prototype.FromStorage = function(storage) {
	this.relation.base       = parseFloat(storage.rel)     || this.relation.base;
	
	// Load flags
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
}

Magnus.prototype.ToStorage = function() {
	var storage = {};
	if(this.relation.base != 0) storage.rel    = this.relation.base;
	storage.flags = this.flags;
	
	return storage;
}


Scenes.Magnus = {};

Scenes.Magnus.Interact = function() {
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
		Text.Add("<i>”Yes?”</i> he mutters, somewhat irritated at being pulled out of his reverie. You tell him you were just curious as to what he was so focused on, and who he is for that matter. From all the strange people you’ve seen among the nomads so far, he seems a bit out of place.", parse);
		Text.NL();
		Text.Add("<i>”Oh, I’m a recent arrival,”</i> suddenly mindful of his ragged appearance, the young man puts down the tome and rises to face you, trying in vain to smooth out the wrinkles on his robe. <i>”My name is Magnus,”</i> he introduces himself, stretching out his hand, peering[upDown] at you curiously.", parse);
		Text.NL();
		Text.Add("You somewhat reluctantly shake hands with him, and present yourself.", parse);
		Text.NL();
		Text.Add("<i>”[playername], eh?”</i> He examines you closely, blushing slightly when you raise your eyebrows at his scrutiny. <i>”Ahem!”</i> Magnus coughs uncomfortably, his eyes wandering back to his tome. <i>”Well… I’m a student, of sorts. I study magic.”</i> He waves noncommittally to the large book.", parse);
		Text.NL();
		Text.Add("<i>”As to why I am here… I was recently expelled from the academy.”</i> He looks a bit bewildered and slightly hurt about this. <i>”I never really figured out why, they kicked me out and refused to let me back in. I wandered for quite a while until these fine folk took me in.”</i> He gestures to the nomads’ around the two of you.", parse);
		Text.NL();
		Text.Add("<i>”Ah, as much as I would like to chat with you more, I just think I understood something from my book, I need to check something quickly.”</i> With that, he once again sticks his nose into the dusty old tome, poring over the strange symbols therein. Looks like you are dismissed.", parse);
		
		magnus.flags["Met"] = 1;
		
		Text.Flush();
		
		Gui.NextPrompt();
	}
	else {
		if(DEBUG) {
			Text.NL();
			Text.Add(Text.BoldColor("DEBUG: relation: " + magnus.relation.Get()));
			Text.NL();
		}
		
		Text.Add("You wave at Magnus as you pull up beside the young magician, flopping down on the log. He seems to register that you’re trying to talk to him, and briefly put his book down on his lap.", parse);
		Text.NL();
		if(gameCache.flags["LearnedMagic"] == 0)
			Text.Add("<i>”Yes, [playername]? How can I help you?”</i>", parse);
		else
			Text.Add("<i>”[playername]! Great to see you again, how fares your studies?”</i>", parse);
		Text.Flush();
		
		var TalkPrompt = function() {
			//[Talk][Magic][Sex][Meditate]
			var options = new Array();
			options.push({ nameStr : "Talk",
				func : function() {
					Text.Clear();
					if(magnus.flags["Talked"] == 1) {
						Text.Add("<i>”Truly, you wish to hear my story again?”</i> Magnus seems happy about this, and clears his throat to reiterate his tale. ", parse);
					}
					else {
						Text.Add("<i>”Ah, there isn’t really much to tell,”</i> the young man scratches his scraggly attempt at a beard thoughtfully. ", parse);
					}
					
					Text.Add("<i>”Ah, there isn’t really much to tell,”</i> the young man scratches his scraggly attempt at a beard thoughtfully. <i>”I come from the other side of Eden, beyond the mountains. The power of the kingdom doesn’t reach there, and there are a number of free cities that govern themselves.”</i>", parse);
					Text.NL();
					Text.Add("<i>”The largest center of study on Eden is found there, the Academy of Higher Arts. Though they study all sorts of subjects, my interest has always been in magic. It is such a fickle and playful force, yet more powerful than anything you could imagine if wielded correctly.”</i>", parse);
					Text.NL();
					Text.Add("He goes on to tell you various things about his studies of the art of magic, and you are amazed at how dry and boring he can make conjuring fireballs sound. Despite yourself, you sort of drowse off, shaking yourself in order to not fall asleep.", parse);
					Text.NL();
					Text.Add("<i>”But alas, one day I was not welcome at the academy anymore.”</i> Magnus sighs to himself, despairing at the unfair nature of the world. <i>”I couldn’t even get a rational statement out of my teachers, they just chucked me out on the street and told me to never come back. They seemed almost… afraid. I’m not sure why, I mostly studied and meditated, never harmed a fly.”</i> The apprentice shrugs and gestures to the old tome he is currently reading.", parse);
					Text.NL();
					Text.Add("<i>”This and a few others were books I had borrowed from the library. Since they didn’t seem to want them back, I bought them with me to further my studies. For every page I read, I feel like I know less and less about how the world really works.”</i>", parse);
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
						
						if(magnus.flags["Teach"] == Magnus.Teaching.None) {
							Text.Add("<i>”Ah, does the subject of magic interest you?”</i> Magnus seems to brighten up, no longer the only nerd in the gathering. You nod uncertainly, not really sure what you are getting yourself into.", parse);
							Text.NL();
							Text.Add("Excited, he starts to quickly line out abstract concepts and ideas pertaining to the nature of magic. He scribbles strange symbols on the ground, explaining their origins and meaning.", parse);
							Text.NL();
							
							if(player.jobs["Scholar"].level >= 3) {
								Text.Add("Somehow, you manage to somewhat follow what he is talking about, though you can feel your eyelids drooping dangerously.", parse);
								Text.NL();
								
								Scenes.Magnus.LearnMagic();
								return;
							}
							else {
								Text.Add("Despite your initial enthusiasm, you are unable to keep focused, and find your head dropping as sleep overcomes you. When you come to, Magnus is looking at you disapprovingly, slightly hurt over that you fell asleep during his tira-<i>lecture.</i>", parse);
								Text.NL();
								Text.Add("<i>”Come back once you’ve learned how to focus properly,”</i> Magnus admonishes you.", parse);
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
								
								Scenes.Magnus.LearnMagic();
								return;
							}
							else {
								Text.Add("<i>”Come back once you’ve learned how to focus properly,”</i> Magnus admonishes you.", parse);
								Text.NL();
								Text.Add("<b>You will need to be at least a level 3 scholar to avoid falling asleep.</b>", parse);
								Text.Flush();
							}
						}
						else {
							// TODO: Variations
							
							Text.Add("<i>”I’m afraid I’ve taught you all I am able, everyone learns differently, and the best way to nurture your talent is to apply it diligently. I am sure you will become a great mage some day, if you just put effort into your studies! The only way I can help you now is to aid you in meditation, and perhaps lend you some reading material once you’ve advanced enough.”</i>", parse);
							Text.Flush();
						}
						
						Gui.NextPrompt(TalkPrompt);
					}, enabled : true,
					tooltip : "Ask Magnus if he could teach you how to use magic."
				});
				options.push({ nameStr : "Sex",
					func : function() {
						Text.Clear();
						Text.Add("<i>”W-what?”</i> The magician looks at you, bewildered. <i>”I hardly think that would be appropriate!”</i> he stutters, blushing as he goes back to his book, reading with renewed intensity. You smile slightly as you catch him throwing furtive glances in your direction.", parse);
						Text.NL();
						Text.Add("Guess that approach isn’t going to work.", parse);
						Text.Flush();
						
						Gui.NextPrompt(TalkPrompt);
					}, enabled : true,
					tooltip : "Proposition Magnus for a romp in the hay, so to speak."
				});
				if(gameCache.flags["LearnedMagic"] != 0) {
					options.push({ nameStr : "Gem",
						func : function() {
							Text.Clear();
							Text.Add("Magnus shakes his head as you present him with the gemstone.", parse);
							Text.NL();
							Text.Add("<i>”I’m afraid I cannot help you, [playername]. I’ve never seen something like this before. Perhaps one of the staff at the academy… or maybe the court magician of Rigard could tell you more. It certainly contains magic, but also seems to be a product of alchemy.”</i>", parse);
							Text.Flush();
							
							Gui.NextPrompt(TalkPrompt);
						}, enabled : true,
						tooltip : "Ask Magnus about your gemstone."
					});
					options.push({ nameStr : "Meditate",
						func : function() {
							Text.Clear();
							Text.Add("TODO", parse);
							Text.NL();
							Text.Flush();
							
							world.TimeStep({hour: 1});
							
							Gui.NextPrompt(TalkPrompt);
						}, enabled : false, // TODO: implement
						tooltip : ""
					});
				}
			}
			Gui.SetButtonsFromList(options, true);
		}
		
		TalkPrompt();
	}
}

Scenes.Magnus.LearnMagic = function() {
	var parse = {
		hand : function() { return player.HandDesc(); },
		playername : player.name
	};
	
	Text.Add("Once he has explained the basic terms and concepts behind using magic, he tells you that it is time for a demonstration. He walks off a small distance from the campfire, away from the other nomads.", parse);
	Text.NL();
	Text.Add("<i>”Know that I’m still a mage in training, so I need time and focus to properly use these powers,”</i> he explains. You sit back and wait while he closes his eyes, breathing deeply. Sparks of light begin to dance on his outstretched palms, changing colors and swirling around playfully.", parse);
	Text.NL();
	Text.Add("<i>”Spire!”</i> Magnus shouts, throwing his hands down toward the earth. There is a loud rumbling noise, and a pillar of rock twice his height shoot up into the air, pebbles and clumps of dirt raining down everywhere. He looks pleased with his handiwork, and turns back to you.", parse);
	Text.NL();
	Text.Add("<i>”That was an example of a beginners level elemental spell,”</i> he explains, dusting the debris from his robes. <i>”The elements are the easiest to start with, though there is a step even before that.”</i> He holds out his hand and focuses again, summoning the dancing lights. As he does, you notice that the gem in your pocket is resonating with the lights, pulsing slightly.", parse);
	Text.NL();
	Text.Add("<i>”First, you must gather your own energy and mold it, forming patterns and symbols with it to boost its power. The stronger the magic around you is, the easier you will find this, but it is not a skill everyone can learn. It might take you months of deep meditation before you are able to handle it properly.”</i>", parse);
	Text.NL();
	Text.Add("You think back on the concepts and ideas that Magnus has explained to you, trying to figure out how to apply them. First, you try to close your eyes and breathe, as you saw him do, but after a while your mind wanders when nothing happens. Slightly frustrated, you try again, stretching out your [hand]s in front of you and concentrating.", parse);
	Text.NL();
	Text.Add("<i>”Don’t feel bad about it, it took me weeks before I could even muster the magic to light a candle,”</i> the magician encourages you. You irritably wave him away, intent on making this work. Another ten minutes or so pass before you are just about fed up with this. In frustration, you throw your [hand]s down, rubbing against the gemstone in your pouch by chance. You yelp as you are struck by a small spark, stinging you. The stone falls to the ground, glowing slightly.", parse);
	Text.NL();
	Text.Add("Carefully, you retrieve the gemstone, looking at it curiously. It feels strangely warm in your [hand], as if it has a life of its own. On a whim, you try to focus on gathering magic again, and the dull glow inside the stone intensifies. Seems like you are on to something here.", parse);
	Text.NL();
	Text.Add("With the help of the gem acting as an indicator, you manage to narrow down the exact state of mind needed to focus your energy in a remarkably short amount of time. Happy with your efforts, you pocket the gem and stretch out your [hand]s again. Breathing deeply, you summon powerful forces from within you, your arms tingling as glowing spots of light dance from your fingertips.", parse);
	Text.NL();
	Text.Add("Magnus is gaping at you as the light grows, enveloping your [hand]s. You grin at him, almost feeling like you are showing off. The light grows steadily, and you are beginning to feel a bit weak, as if the act is somehow draining you. The magician shakes himself a bit, suddenly looking a bit concerned.", parse);
	Text.NL();
	Text.Add("<i>”This is amazing, [playername], but you must release it, or you will pass out!”</i> he warns you, hurrying to your side. You follow his intent instructions on how to channel the flow of energy, trying to focus as you feel your strength wane.", parse);
	Text.NL();
	Text.Add("<i>”Surge!”</i> A blast of energy flows from your [hand]s, blasting a small crater in the ground. You weakly flop down on your back, completely drained from the ordeal.", parse);
	Text.NL();
	Text.Add("<i>”Astounding!”</i> Magnus exclaims, eyes shining brightly, <i>”I’ve never seen someone attune themselves so quickly! Just what is that stone…?”</i>", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("You eventually disentangle yourself from the enthusiastic mage, explaining that you have things to do, and that you could probably use a few hours of sleep. Magnus reluctantly lets you go, but hands you a few scrolls before you leave.", parse);
		Text.NL();
		Text.Add("<i>”To further your studies,”</i> he explains. <i>”With such talent, I’m sure you will surpass me in no time!”</i> The scrolls seem to line out a few basic spells, and with the aid of Magnus, you manage to decipher them.", parse);
		Text.NL();
		Text.Add("<b>Unlocked the Mage job.</b><br/>", parse);
		Text.Add("<b>Unlocked the Mystic job.</b><br/>", parse);
		Text.Add("<b>Unlocked the Healer job.</b><br/>", parse);
		Text.NL();
		Text.Add("You thank him for his help, and set out on your journey, a new power at your beck and call.", parse);
		Text.Flush();
		
		world.TimeStep({hour: 3});
		player.AddSPFraction(-1);
		
		gameCache.flags["LearnedMagic"] = 1;
		magnus.flags["Teach"] == Magnus.Teaching.Done;
		
		Gui.NextPrompt();
	});
}

world.loc.Plains.Nomads.Fireplace.events.push(new Link(
	function() {
		return magnus.flags["Met"] == 0 ? "Scholar" : "Magnus";
	}, function() { return (world.time.hour >= 8 && world.time.hour < 22); }, true,
	function() {
		if(!(world.time.hour >= 8 && world.time.hour < 22)) return;
		
		var parse = {
			litExtinguished : world.time.hour >= 19 ? "lit" : "extinguished"
		};
		
		if(magnus.flags["Met"] == 0) {
			Text.Add("Near the[litExtinguished] campfire, you see a thin and nervous-looking young man. He is carrying slightly tattered robes and a pair of thick glasses, and seems to be embroiled in studying a heavy tome. The man hardly seems to register anything going on around him, so absorbed is he in the book.", parse);
		}
		else {
			Text.Add("Magnus the apprentice mage is poring over some old book, probably trying to find some secret knowledge in the strange, squiggly symbols covering its pages. As usual, he is deeply focused on his studies, and you doubt even an attack on the camp would distract his reverie.", parse);
		}
		Text.NL();
		Text.Flush();
	},
	Scenes.Magnus.Interact
));
