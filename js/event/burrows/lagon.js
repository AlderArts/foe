/*
 * 
 * Define Lagon
 * 
 */

Scenes.Lagon = {};



function Lagon(storage) {
	Entity.call(this);
	
	this.sexlevel          = 8;
	
	this.flags["Usurp"] = 0;
	
	if(storage) this.FromStorage(storage);
}
Lagon.prototype = new Entity();
Lagon.prototype.constructor = Lagon;

Lagon.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Lagon.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

Lagon.Usurp = {
	FirstFight : 1,
	Defeated   : 2
}

//For first fights
function LagonRegular(tougher) {
	BossEntity.call(this);
	
	this.tougher           = tougher; //use for AI + stats
	
	this.name              = "Lagon";
	
	this.avatar.combat     = Images.lagon_r;
	
	this.maxHp.base        = 2000;
	this.maxSp.base        = 500;
	this.maxLust.base      = 500;
	// Main stats
	this.strength.base     = 100;
	this.stamina.base      = 120;
	this.dexterity.base    = 150;
	this.intelligence.base = 90;
	this.spirit.base       = 100;
	this.libido.base       = 100;
	this.charisma.base     = 80;
	
	this.level             = 15;
	this.sexlevel          = 8;
	
	this.combatExp         = 200;
	this.coinDrop          = 500;
	
	this.body.DefMale();
	
	this.FirstCock().thickness.base = 7;
	this.FirstCock().length.base = 38;
	this.Balls().size.base = 6;
	
	this.Butt().buttSize.base = 2;
	
	this.body.SetRace(Race.rabbit);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.rabbit, Color.white);
	this.body.SetBodyColor(Color.white);
	this.body.SetEyeColor(Color.blue);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
LagonRegular.prototype = new BossEntity();
LagonRegular.prototype.constructor = LagonRegular;

//TODO
LagonRegular.prototype.DropTable = function() {
	var drops = [];
	drops.push({ it: Items.Leporine });
	return drops;
}

//TODO
LagonRegular.prototype.Act = function(encounter, activeChar) {
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	//TODO Adds
	//if(this.tougher);

	var choice = Math.random();
	if(choice < 0.6)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.DAttack.enabledCondition(encounter, this))
		Abilities.Physical.DAttack.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}

//For final fight
function LagonBrute() {
	BossEntity.call(this);
	
	this.name              = "Lagon";
	
	this.avatar.combat     = Images.lagon_b;
	
	this.maxHp.base        = 4000;
	this.maxSp.base        = 700;
	this.maxLust.base      = 500;
	// Main stats
	this.strength.base     = 180;
	this.stamina.base      = 150;
	this.dexterity.base    = 100;
	this.intelligence.base = 60;
	this.spirit.base       = 80;
	this.libido.base       = 100;
	this.charisma.base     = 60;
	
	this.level             = 20;
	this.sexlevel          = 8;
	
	this.combatExp         = 500;
	this.coinDrop          = 1000;
	
	this.body.DefMale();
	
	this.FirstCock().thickness.base = 11;
	this.FirstCock().length.base = 60;
	this.Balls().size.base = 10;
	
	this.Butt().buttSize.base = 2;
	
	this.body.SetRace(Race.rabbit);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.rabbit, Color.white);
	this.body.SetBodyColor(Color.white);
	this.body.SetEyeColor(Color.red);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
LagonBrute.prototype = new BossEntity();
LagonBrute.prototype.constructor = LagonBrute;

//TODO
LagonBrute.prototype.DropTable = function() {
	var drops = [];
	drops.push({ it: Items.Leporine });
	return drops;
}

//TODO
LagonBrute.prototype.Act = function(encounter, activeChar) {
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.6)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.DAttack.enabledCondition(encounter, this))
		Abilities.Physical.DAttack.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}

//TODO
Scenes.Lagon.InteractRuler = function() {
	var parse = {
		
	};
	parse["stuttername"] = player.name[0] +"-"+ player.name;
	
	Text.Clear();
	Text.Add("PLACEHOLDER", parse);
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	
	//[name]
	var options = new Array();
	/*
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
	if(burrows.flags["Access"] >= Burrows.AccessFlags.Stage3) {
		options.push({ nameStr : "Usurp!",
			func : function() {
				Text.Clear();
				Text.Add("<i>“And what can I do for you today, traveller?”</i> Lagon leisurely regards you with a bored expression. <i>“I believe that you already bought all the needed ingredients to Ophelia; I do not have any further requests for your currently.”</i> He shakes his head. <i>“I feel the girl grows rebellious. Perhaps it’s time to throw her in the Pit together with her mother, as I should have done long ago.”</i>", parse);
				Text.NL();
				Text.Add("He’ll do no such thing. The king’s eyebrows rises in question, as if he doesn’t quite understand what he’s hearing. <i>“I was thinking out loud, not asking for advice, traveller,”</i> he rests his chin on his knuckles, studying you. <i>“Do you presume to tell me what to do? What kind of nonsense has that girl been feeding you?”</i>", parse);
				Text.NL();
				Text.Add("You contemptuously tell him that you can see him for what he is; a savage beast that needs to be put down. Fury fills Lagon’s eyes, but before he can reply, your conversation is interrupted by the arrival of Ophelia, flanked by two guards.", parse);
				Text.NL();
				Text.Add("<i>“Y-you called for me, father?”</i> she falters, her gaze flickering between the two of you, locked in your staredown. The king is the first to break eye contact, casting his furious glare at his daughter.", parse);
				Text.NL();
				Text.Add("<i>“You!”</i> he screams, jumping to his feet, his face dark with rage. <i>“This fucking rebellious bullshit ends now! I’m throwing you into the fucking Pit for the rest of your damned life you sneaky little bitch!”</i> He starts making for her, but you step into his way.", parse);
				Text.NL();
				Text.Add("<i>“[stuttername]... this… please… no...”</i> Ophelia stammers. <i>“You can’t, I told you he’s too strong!”</i> This apparently doesn’t earn her any favors with daddy.", parse);
				Text.NL();
				Text.Add("<i>“Seize her, I’ll deal with her later! You three… take care of this cretin.”</i> Lagon hops back onto his throne as his guards rush to intercept you, his gaze drilling into you. <i>“As for you… when I’m done with you, you’ll be begging for me to throw you in the pit.”</i>", parse);
				Text.NL();
				Text.Add("It’s a fight!", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Scenes.Lagon.Usurp();
				});
			}, enabled : true,
			tooltip : "Lagon’s reign has gone on long enough! Scepter or no scepter, he’s going down!"
		});
	}
	Gui.SetButtonsFromList(options, true);
}



Scenes.Lagon.PitDefianceWin = function() {
	SetGameState(GameState.Event);
	var enc = this;
	var parse = {
		
	};
	enc.finalize = function() {
		Encounter.prototype.onVictory.call(enc);
	};
	
	Text.Clear();
	Text.Add("Lagon falls back, his face a mask of rage. Before you can step in to deliver the final blow, dozens of rabbits flood in your way, showering you in ineffectual punches. You try to throw them out of the way, but they are just too many. With the combined pressure of their bodies, the lagomorph mob pushes you away from their king.", parse);
	Text.NL();
	Text.Add("<i>“Don’t fucking think this is the end!”</i> Lagon roars, similarly restrained as he’s quickly carried from the hall. <i>“I’ll find you, and I’ll fucking <b>murder</b> you, little cretin!”</i> His ranting fades as his subjects retreat, leaving you a brief moment of respite. You are about to give chase when a hand on your shoulders reins you in.", parse);
	Text.NL();
	Text.Add("<i>“Quickly, come with me!”</i> Ophelia urges you, leading toward the exit. She’s very excited, hopping along with a new-found energy in her step. <i>“That was amazing!”</i> the alchemist exclaims, absentmindedly pulling you around a group of bunnies so deep into the carnal act they probably didn’t even notice the fight. <i>“I’ve never seen <b>anyone</b> stand up to father! Well, and come out of it victorious, at least.”</i>", parse);
	Text.NL();
	Text.Add("As you run, Ophelia’s gaze flickers left and right, as if she’s expecting an ambush. <i>“Gotta get out before the honor guard arrives,”</i> she mutters to herself. Why not stand and fight? You should be heading for the throne room, you counter.", parse);
	Text.NL();
	Text.Add("<i>“No, no,”</i> she shakes her head, still not quite understanding what just happened. <i>“He’s hiding his strength, he has to be. He’s trying to trap you! If you follow him, you’ll be thrown in chains!”</i> she keeps muttering to herself, but you decide to humor her for the time being. Lagon isn’t going anywhere.", parse);
	Text.NL();
	Text.Add("As you finally emerge above ground again, the alchemist takes some time to pant and wheeze before turning to face you.", parse);
	Text.NL();
	Text.Add("<i>“I… thanks,”</i> she says, bowing her head. <i>“You really saved me back there. Father’s been getting more and more out of hand… you were right to step in, and I’m grateful for it.”</i> She takes a deep breath, and slumps down on the ground. <i>“It forces my hand, however. I’ve known for a while now that this couldn’t go on, but I don’t have any ways of standing up to father on my own.”</i> Ophelia looks at you with admiration, blushing faintly. <i>“I’m not as strong, nor as brave as you.”</i>", parse);
	Text.NL();
	
	ophelia.relation.IncreaseStat(100, 25);
	ophelia.burrowsCountdown = new Time(0,0,7,0,0); //7 days
	
	Scenes.Ophelia.ScepterRequest(true);
	
	Text.Flush();
	
	lagon.flags["Usurp"] |= Lagon.Usurp.FirstFight;
	
	world.TimeStep({minute: 30});
	party.location = world.loc.Plains.Burrows.Enterance;
	
	Gui.NextPrompt(enc.finalize);
}

Scenes.Lagon.PitDefianceLoss = function() {
	SetGameState(GameState.Event);
	var parse = {
		face : function() { return player.FaceDesc(); },
		tongue : function() { return player.TongueDesc(); },
		anusDesc : function() { return player.Butt().AnalShort(); },
		vagDesc : function() { return player.FirstVag().Short(); },
		cocks : function() { return player.MultiCockDesc(); }
	};
	
	parse["comp"] = party.Num() == 2 ? party.Get(1).name :
	                party.Num() >  2 ? "your companions" : "";
	
	Text.Clear();
	parse["c"] = party.Num() > 1 ? Text.Parse(" and [comp]", parse) : "";
	Text.Add("You fall to the ground, exhausted from the fight. It’s no use… he’s just too strong. The taste of defeat is all the more palpable here, in the middle of the salty lake of cum fueled by hundreds of rutting rabbits. Any hopes of escape are crushed by a horde of bunnies piling up on top of you[c], the combined weight of their bodies keeping you in place.", parse);
	Text.NL();
	Text.Add("<i>“Well, that was amusing for a brief moment,”</i> Lagon chuckles, rolling his shoulders. <i>“But I’m not sure what you hoped to achieve.”</i> He hops over to you, grabbing you roughly by the chin. <i>“Did you consider that in your pitiful rebellion, you tried to deny my daughter her deepest desires? Such an unworthy cause, traveller. See? She’s so much happier without your meddling.”</i>", parse);
	Text.NL();
	Text.Add("The rabbit king forces your head to the side. Two rabbits come into view - Vena and Ophelia, the former ecstatically pounding the latter - both crying out in joyous orgasm. <i>“See how much fun they are having?”</i> he rasps in your ear. <i>“Perhaps if you are a good little slut, I’ll let you join in.”</i> Lagon effortlessly pulls you out from under the heap of bunnies, holding you by the throat in an iron grip.", parse);
	Text.NL();
	Text.Add("<i>“First, however,”</i> he grunts, his words accentuated by a heavy punch to your stomach, <i>“we need to talk about obedience.”</i> You are coughing and gasping for breath as he drops you to the ground. <i>“It’s quite simple,”</i> the royal brute continues unhurriedly as he flips you over on your stomach, making you taste salty cum. <i>“You are now lower than a worm. You’ll obey the wishes of any and all here in the burrows, be it myself or the lowest fuckslut in the Pit. This will be easy, as your orders will be quite simple. For example, <b>suck</b>.”</i>", parse);
	Text.NL();
	Text.Add("Your eyes go wide as Lagon shoves his fifteen inch monstrosity down your throat, a firm hand on your head as he continues his lecture even as he facefucks you. <i>“Now that Vena has reached perfection, I might be generous and let Ophelia experiment on <b>you</b> next.”</i> Your vision is rapidly fading as you choke on the massive shaft, eyes watering...", parse);
	Text.NL();
	
	Sex.Blowjob(player, lagon);
	player.FuckOral(player.Mouth(), lagon.FirstCock(), 3);
	lagon.Fuck(lagon.FirstCock(), 3);
	
	Text.Flush();
	
	world.TimeStep({hour : 1});
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("When you come to again, your [face] is smeared in sticky cum. Your throat feels raw, though blissfully empty, allowing sweet air to fill your lungs. The ordeal has barely just begun, however, as you feel a heavy weight on your back.", parse);
		Text.NL();
		Text.Add("<i>“You know,”</i> Lagon says conversationally as he roughly jams his cock into your protesting ass, <i>“I’ve even considered taking some of my daughter’s potions myself. The one that increases strength and size could be fun, don’t you think? As soon as I do it, I’ll be sure to test it out on you first.”</i>", parse);
		Text.NL();
		
		Sex.Anal(lagon, player);
		player.FuckAnal(player.Butt(), lagon.FirstCock(), 4);
		lagon.Fuck(lagon.FirstCock(), 4);
		
		Text.Add("You bite down your response, trying to keep hold of your sanity while the rabbit king ravages your [anusDesc]. Visions of the brutes created by Ophelia’s alchemy swims into your mind. As big as Lagon’s cock is now - something you’re rather intimately familiar with now - how big would it be once he took something like that? Three feet? Four?", parse);
		Text.NL();
		Text.Add("<i>“I’ve barely even gotten started with you, little bitch,”</i> Lagon growls, his hips a blur as he goes to town on your ass, <i>“and once I’m satisfied, once I’ve put enough loads in you to make your belly swell even larger than Vena’s, then I’ll let the rest of the Pit have you. Hundreds of bunnies fucking you without rest for days on end, and each time one of them cums in you, you’ll be reminded of your mistake; the day that you dared raise your hand against me.”</i>", parse);
		Text.NL();
		if(party.Num() > 1) {
			var p1 = party.Get(1);
			parse["s"]      = party.Num() > 2 ? "s" : "";
			parse["heshe"]  = party.Num() > 2 ? "they" : p1.heshe();
			parse["hisher"] = party.Num() > 2 ? "their" : p1.hisher();
			parse["poss"]   = party.Num() > 2 ? "your companions'" : p1.name;
			Text.Add("<i>“The same goes for your friend[s]; [heshe] too will end [hisher] days here, in the darkness of the pit.”</i> Lagon’s voice is dripping of malice as he speaks of [poss] fate.", parse);
			Text.NL();
		}
		Text.Add("In a last weak effort to defy your tormentor, you raise your head to curse him, to denounce him, but before you can blink the powerful lagomorph has shoved your face back into the jizz-pool.", parse);
		Text.NL();
		Text.Add("Gradually, your senses dull one by one, until all that remains is the taste of cum on your [tongue], the dim silhouettes writhing in carnal bliss, the incessant heat… and the gargantuan rod stretching your back door to its limits. Everything else fades in comparison. The king’s words are too much to handle, and you force yourself to focus on this one cock. Sooner or later, Lagon has to be satisfied, right? And then you will be able to rest...", parse);
		Text.NL();
		Text.Add("Yet no rest is to be had. Even after Lagon has filled you to the brim countless times, even after Vena has done the same, even when Lagon has had a second round… not even then does it stop. Bunny after bunny ravages your every hole, usually several at once, until you’re convinced that the cum leaking from you alone is enough to threaten to fill the Pit.", parse);
		Text.NL();
		if(player.FirstVag()) {
			Text.Add("Your [vagDesc] receives equal treatment to your ass; countless cocks ravage your insides, flooding your womb with virile lagomorph seed. You realize that you will most likely spend the rest of your life just like Vena - constantly pregnant, only getting a short respite from fucking when you give birth.", parse);
			Text.NL();
		}
		if(player.FirstVag()) {
			parse = Text.ParserPlural(parse, player.NumCocks() > 1);
			Text.Add("Your [cocks] [isAre] all but forgotten, though no small amount of the jizz you are bathing in comes from yourself. On Lagon’s orders, none of the other bunnies touch [itThem], though the rabbit king promises that you will get your turn if you behave like a good slut.", parse);
			Text.NL();
		}
		Text.Add("Everything blurs together as the massive orgy around you continues, your own concerns, plans and goals discarded and forever lost. The last words you hear are Lagon calling for someone to bring you a special potion; something that will make you feel even better. You can hardly wait.", parse);
		Text.NL();
		Text.Add("Time passes...", parse);
		Text.Flush();
		
		world.TimeStep({hour : 1});
	
		Gui.NextPrompt(Scenes.Lagon.BadendPit);
	});
}

Scenes.Lagon.BadendPit = function() {
	var parse = {
		
	};
	
	party.location = world.loc.Plains.Burrows.Pit;
	world.TimeStep({season: 1});
	
	Text.Clear();
	Text.Add("Whoever you were before, both physically and mentally, it’s all washed away in the orgasmic wave of ecstasy that is your every waking moment. Everywhere around you, dark shapes writhe in carnal bliss as the endless orgy of the Pit grinds on, with you as one of its central pieces.", parse);
	Text.NL();
	Text.Add("You don’t know how long you’ve been here beside Vena and Ophelia; days and weeks meld together in a mess of pleasure and cum. Much like the matriarch and her daughter, you are almost constantly pregnant, your swollen belly a temple to your dedication to your master. ", parse);
	if(!player.FirstVag())
		Text.Add("A fading memory reminds you that you were not always like this… what a horrible thing to imagine, not being able to serve your king and birth him more children. You shudder at the thought.", parse);
	else
		Text.Add("Your pussy and womb are now the property of Lagon, and whomever he chooses to fill them.", parse);
	Text.NL();
	Text.Add("Your days are filled with endless fucking[, giving, receiving, it no longer matters to you]. All that fills your head is the next blissful orgasm, and the pleasure of knowing that you are <i>needed</i>, you serve a purpose. You and your sisters are to be the mothers of the rulers of Eden; with their rapidly growing numbers, the bunnies will soon be unstoppable.", parse);
	Text.NL();
	Text.Add("News are slow to travel down here, but your master loves to gloat about his exploits. His armies have started moving; not against Rigard, not yet, but the highland tribes are quietly submitting, one by one. Before long, the rabbits will be too many to stop; a tide of fluffy bodies washing over the walls of Rigard and breaking the city with sheer numbers. And you are one of the proud mothers of this unstoppable army.", parse);
	Text.NL();
	Text.Add("Even now, young ones kick in your womb, their growth accelerated by Ophelia’s alchemy. Strong ones too; you suspect that these might carry the brute strain, and may one day stand in the forefront of Lagon’s army. But enough of that. Until you birth your young and can be fertilized again, your duty is to relieve the breeders and be the willing receiver of any cock that wants you.", parse);
	Text.NL();
	parse["comp"] = party.Num() == 2 ? party.Get(1).name :
	                party.Num() >  2 ? "your companions" : "";
	parse["c1"] = party.Num() > 1 ? "," : " and";
	parse["c2"] = party.Num() > 1 ? Text.Parse(", and [comp]", parse) : "";
	Text.Add("Matters of politics, magic and demons are swept from your mind as another one of the bunnies plunges himself into your needy pussy; just one of dozens today. You share a warm look with Ophelia[c1] Vena[c2]. Here in the Pit, you are needed.", parse);
	Text.Flush();
	
	SetGameOverButton();
}


Scenes.Lagon.BadendBrute = function() {
	var scepter = party.Inv().QueryNum(Items.Quest.Scepter);

	SetGameState(GameState.Event);
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("With a great roar, the mad king slams you across the chest, sending you flying though half the hall. The impact dazes you, and you’re only half aware of what’s going on around you. There seem to be a lot of screams… You try to shake the dull pain from your skull and shake your blurry vision.", parse);
	if(party.Num() == 2)
		Text.Add(" Beside you, you dimly see [name] in a similar state.", {name: party.Get(1).name});
	else if(party.Num() > 2)
		Text.Add(" Beside you, you dimly see your companions in similar states.", parse);
	Text.NL();
	Text.Add("The throne room is a scene of chaos; the still bodies of fallen bunnies everywhere. At the heart of the whirlwind of violence is the bestial Lagon, eyes burning with an unnatural flame as he indiscriminately bashes people out of his way left and right, no longer caring about distinguishing between friend and foe.", parse);
	Text.NL();
	Text.Add("Only one person remains standing against the brute - his daughter Ophelia, who stands up on shaking legs. ", parse);
	if(scepter)
		Text.Add("The scepter is gone somewhere, most likely broken and shattered against one of the walls. ", parse);
	Text.Add("<i>“Please, stop this father!”</i> she cries out, begging him.", parse);
	Text.NL();
	Text.Add("Against all odds, her plea seems to be working. Lagon pauses for a moment, a vague look of recognition in his eyes as he looks down on his daughter; a mere ant in front of a hulking giant. He leans down and picks her up in one huge paw, effortlessly lifting the squirming alchemist off the ground.", parse);
	Text.NL();
	Text.Add("<i>“Oph-elia.”</i> The name rings oddly, as if the brute is trying to remember how to form words. A wide, malicious grin spreads on Lagon’s face. For good or ill, the king’s rage has subsided for the moment. <i>“Bring… bitch.”</i> He drops her, and she falls to the ground with a loud thump. Slowly, Ophelia makes her way over to you, her spirit defeated.", parse);
	Text.NL();
	Text.Add("<i>“Please come… we must do as he tells us, or he’ll kill everyone,”</i> she urges you. She’s right. You know from experience just how quickly the beast can move; there’s no use trying to escape.", parse);
	Text.NL();
	Text.Add("Lagon is trying to sit down on his throne as you and Ophelia crawl to his feet, but it ill fits his new frame. He tries to break of the arms of the seat, but it ends up just being uncomfortable. Shrugging, the king kicks the scraps of the chair crashing into a wall. He flops down on the ground, resting on his mound of treasure. When he notices you and Ophelia, he motions you to come to his side.", parse);
	Text.NL();
	Text.Add("It quickly becomes apparent for what reason he’s called you; as you snuggle into the king’s fur, you share a look with Ophelia, only for your view to be blocked as Lagon’s titanic member slowly rises to full erection. Without hesitation, the alchemist leans down and starts caressing the king’s massive balls, which leaves the shaft to you.", parse);
	Text.NL();
	Text.Add("Your hands are trembling as they grasp the massive flesh pillar. Even for his size, Lagon’s cock is of impressive proportions, rising at least four feet from his crotch. The bulbous tip sways far above your head, huge droplets of pre splashing down on you and Ophelia. Fearfully, you trace the veins of the gargantuan shaft, caressing it from top to bottom.", parse);
	Text.NL();
	Text.Add("Lagon grunts appreciatively as you and Ophelia grind your bodies against his member. You can only hope he won’t actually try to use it on you - Vena is probably the only one that could take him as he is now. Either way, your combined efforts seem to bear fruit, as more pre continues to stream down the rigid monolith.", parse);
	Text.NL();
	Text.Add("Both you and Ophelia yelp in surprise as Lagon shifts his weight, getting up on his feet. You scramble to keep your hold on the colossal shaft, ending up hanging underneath it while Ophelia is perched on top of it. There’s little time to try to change your position before the king thrusts forward, trapping you between the floor and fifty inches of thick bunny cock. The alchemist presses her thighs against your side and leans down to kiss you, your bodies forming a tight cavern of flesh that the giant brute can use.", parse);
	Text.NL();
	Text.Add("Lagon’s thrusts grow quicker and quicker as he slides his massive member between your bodies, groaning as he unloads into the cocksleeve formed by his former enemies. The first stream of ejaculate hits you below the chin almost hard enough to knock you out. The following jets sail by just an inch above your face, the tail end of each blast leaving a thick rope of semen plastered across your face. By the time he’s finished both you and Ophelia are drenched in his cum, panting and gasping for breath.", parse);
	Text.NL();
	Text.Add("<i>“T-the Pit,”</i> Ophelia gasps. <i>“We must take him there before he needs to go again.”</i>", parse);
	Text.NL();
	Text.Add("Somehow, the two of you are able to coax the huge beast along with you, though he won’t let you escape from his reach. You move quickly, as both of you are aware of his slowly rising dick, and what he’ll demand of you when he’s ready to go again. As soon as he sees Vena, he discards Ophelia and throws himself at his mate with a lusty roar, dragging you along for the ride.", parse);
	Text.NL();
	Text.Add("Even the lagomorph matriarch gasps when Lagon impales her, her body straining to accommodate his girth. His cock dwarfs even Vena’s, and if she weren’t heavily pregnant, she’d probably have a giant bulge on her stomach. Not forgetting about you, the lagomorph king puts you on top of the matriarch, letting you care for her male parts.", parse);
	Text.NL();
	Text.Add("Time blurs as your life devolves into the fiery passion of body grinding against body. Lagon’s rage seem to have abated now that he’s satisfied, replaced by some of his former intelligence. Enough, at least, to never leave you unattended so that you can escape. You have what feels like countless lovers, often many at the same time, before the king returns to you again, feeding you a number of potions and giving you a shower of jizz.", parse);
	Text.NL();
	Text.Add("After that, things become even more fuzzy as the drugs begin to set in...", parse);
	Text.NL();
	Text.Add("Time passes…", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		world.TimeStep({season : 1});
		party.location = world.loc.Plains.Burrows.Pit;
		
		Text.Clear();
		Text.Add("At first, your new body could barely even take Vena, but the more drugs the bunnies feed you, the easier it becomes, until one day, your master is finally able to fuck you. You cry in pleasure as Lagon’s enormous shafts drills into your flexible pussy, your belly swollen from the numerous loads he’s graced you with.", parse);
		Text.NL();
		Text.Add("This is your life now. Before, there was something else… some grander purpose. You shake your head in lust-addled confusion. What purpose could be higher than this? To care for the king, to be his personal fuck-toy and breeding bitch? Already, you’ve birthed more strong soldiers for Lagon’s armies than you can count, each one quickly growing into a powerful young buck or doe.", parse);
		Text.NL();
		Text.Add("Here, beside your sisters Ophelia and Vena, you are needed.", parse);
		Text.Flush();
		
		SetGameOverButton();
	});
}

Scenes.Lagon.ReturnToBurrowsAfterFight = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("Remembering how your last encounter with the lagomorph king ended, you pause at the cusp of entering the tunnel. You most likely have a fight on your hands if you proceed. Are you ready for this?", parse);
	Text.Flush();
	
	//[Enter][Leave]
	var options = new Array();
	options.push({ nameStr : "Leave",
		func : function() {
			Text.Clear();
			Text.Add("No… not yet.", parse);
			Text.NL();
			Text.Add("While it’s true that Lagon isn’t likely to be a major threat anytime soon, Ophelia is still in there. You wonder how she’s faring; hopefully she’s been able to stay out of trouble so far.", parse);
			if(ophelia.CountdownExpired())
				Text.Add(" It’s been a rather long time though...", parse);
			Text.Flush();
			
			world.TimeStep({minute: 5});
			Gui.NextPrompt();
		}, enabled : true,
		tooltip : "You’re not ready quite yet. Lagon isn’t going anywhere."
	});
	options.push({ nameStr : "Enter",
		func : function() {
			Text.Clear();
			var toolate = ophelia.CountdownExpired();
			
			parse["comp"] = party.Num() == 2 ? party.Get(1).name :
			                party.Num() >  2 ? "your companions" : "";
			parse["c"] = party.Num() > 1 ? Text.Parse(" look at [comp] and", parse) : "";
			Text.Add("Resolute, you[c] stride into the Burrows, expecting the worst. Best be on your guard from this moment on.", parse);
			Text.NL();
			Text.Add("You meet relatively few bunnies on your way in, and those you meet scurry out of your way as soon as they see you. The tunnels reek of fear, making your heart sink further. Figuring your first order of business is to locate Ophelia, you make for her lab.", parse);
			Text.NL();
			if(toolate)
				Text.Add("It looks even worse than you first feared. The place has been sacked, crushed flasks and jars aplenty, and not a living soul around - even her usual test subjects have deserted. It doesn’t look like anyone has been here for quite a while.", parse);
			else
				Text.Add("You’re out of luck though, as the alchemist is not in here. It looks like someone has been rummaging through her stuff in a haste, and her notes are strewn all over the place. A few of her test subjects raise their heads hopefully, but look disappointed that you are not their mistress.", parse);
			Text.Add(" Troubled, you make your way back into the tunnel, only to find the path outside blocked by a wall of armed and rather serious looking bunnies. Those are probably Lagon’s elite guards… either way, they don’t seem to want to attack you immediately, merely herd you in the direction of the throne room.", parse);
			Text.NL();
			Text.Add("Well, that is what you came here for, isn’t it? Keeping a close eye on your ‘escort’, you trek deeper into the underground kingdom, muscles tense. Before long, you reach Lagon’s high seat, and the lagomorph tyrant himself. There are more guards lining the walls of the throne room than when you last visited it, though the regular civilian slut detail is also present.", parse);
			Text.NL();
			if(toolate) {
				Text.Add("Lagon is lounging in his chair, looking rather bored. His expression quickly changes as you enter the hall, and he springs up to greet you, a malicious smile playing on his lips.", parse);
				Text.NL();
				Text.Add("<i>“Ah, the prodigious traitor finally returns,”</i> the rabbit king smirks, spreading his arms invitingly. <i>“If nothing else, you have balls for coming back here, considering how last we parted.”</i> He turns around. <i>“Daughter, aren’t you happy? Soon, your old conspirator will join you in your duties. Familiar faces sure are comforting, are they not?”</i>", parse);
				Text.NL();
				Text.Add("Your heart sinks as you notice Ophelia, chained to the foot of the throne. Of her labcoat, there’s little more than rags left, and her fur is unkempt and soaked with cum. The look of despair on her face deals you another blow to the gut… the alchemist has not had a pleasant time while you were away. You can still see a spark of rebellion flash in her eyes as they meet yours, though it is but a weak flicker.", parse);
				Text.NL();
				Text.Add("Lagon is oblivious to what passed between you, but he’s not about to pass up on a moment to gloat over someone else’s misfortune. <i>“I was rather… vexed, when we last parted. My dear daughter has been oh so helpful in relieving my stress… she’s truly a diligent little slut.”</i> He cracks his knuckles.", parse);
			}
			else {
				Text.Add("Lagon is in the middle of some kind of audience as you walk in. Before him on her knees sits Ophelia, two guards flanking her. The king gives you a wide grin as you approach.", parse);
				Text.NL();
				Text.Add("<i>“Ah, and here we have our other rat, just in time! I was just about to punish my wayward daughter for her rebellion, and in walks its ringleader!”</i>", parse);
				Text.NL();
				Text.Add("<i>“[playername]!”</i> Ophelia gasps. <i>“Did they get you too?”</i> She looks confused as you shake your head resolutely.", parse);
				Text.NL();
				Text.Add("Lagon casually gives his daughter a backhanded slap, violently throwing her to the ground. Unconcerned, he continues to address you as if she never spoke. <i>“Tell me, what is the occasion? Or did you merely want to save me the trouble of hunting you down? Why not make this easy for yourself and give in… once I’m finished with you, the Pit awaits, and all your worries will fade away into endless bliss.”</i>", parse);
			}
			Text.NL();
			Text.Add("In a huge leap, Lagon launches himself into the air, coming down to rest on his throne. <i>“I can tell that you don’t think you’re here to bend the knee… but bend it shall. Bend or break.”</i> At a wave of his hand, the elite guard closes up around you, weapons at the ready.", parse);
			Text.NL();
			Text.Add("<i>“As you will both learn, however, I’m not an impossible master, nor am I unnecessarily cruel. I simply reward obedience… and punish treachery. A king must be resolute in these things, yes?”</i>", parse);
			Text.NL();
			Text.Add("It’s a fight!", parse);
			Text.Flush();
			
			world.TimeStep({minute: 30});
			
			Gui.NextPrompt(Scenes.Lagon.Usurp);
		}, enabled : true,
		tooltip : "The time has come to face off against this so called king."
	});
	Gui.SetButtonsFromList(options, false, null);
}

//TODO
Scenes.Lagon.ReturnToBurrowsAfterScepter = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
}

//TODO
Scenes.Lagon.Usurp = function() {
	var parse = {
		
	};
	
	var enemy = new Party();
	var lagonMob = new LagonRegular(true);
	enemy.AddMember(lagonMob);
	//TODO Adds (new mob type, bunny elite)
	var enc = new Encounter(enemy);
	
	enc.canRun = false;
	enc.VictoryCondition = function() {
		return lagonMob.Incapacitated();
	}
	//TODO Win/Loss
	/*
	enc.onLoss = ...
	enc.onVictory = ...
	*/
	enc.Start();
}
