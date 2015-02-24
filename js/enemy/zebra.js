/*
 * 
 * Zebra Shaman
 * 
 */

Scenes.ZebraShaman = {};

function ZebraShaman(levelbonus) {
	Entity.call(this);
	
	this.avatar.combat     = Images.zebra;
	this.name              = "Shaman";
	this.monsterName       = "the zebra shaman";
	this.MonsterName       = "The zebra shaman";
	this.body.DefMale();
	this.FirstCock().thickness.base = 7;
	this.FirstCock().length.base = 35;
	this.Balls().size.base = 6;
	
	this.maxHp.base        = 250;
	this.maxSp.base        = 150;
	this.maxLust.base      = 80;
	// Main stats
	this.strength.base     = 20;
	this.stamina.base      = 30;
	this.dexterity.base    = 16;
	this.intelligence.base = 30;
	this.spirit.base       = 35;
	this.libido.base       = 16;
	this.charisma.base     = 18;
	
	this.level             = 6 + Math.floor(Math.random() * 4);
	this.sexlevel          = 2;
	if(levelbonus)
		this.level += levelbonus;
	
	this.combatExp         = 6 + this.level;
	this.coinDrop          = 8 + this.level * 4;
	//TODO
	this.body.SetRace(Race.horse);
	this.body.SetBodyColor(Color.gray);
	
	this.body.SetEyeColor(Color.blue);
	
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.horse, Color.black);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
ZebraShaman.prototype = new Entity();
ZebraShaman.prototype.constructor = ZebraShaman;

ZebraShaman.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.05) drops.push({ it: Items.Equinium });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseCum });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseHair });
	if(Math.random() < 0.5)  drops.push({ it: Items.HorseShoe });
	return drops;
}

ZebraShaman.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.Add(this.name + " acts!");
	Text.NL();
	Text.Flush();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var choice = Math.random();
	if(choice < 0.2 && Abilities.Black.Thorn.enabledCondition(encounter, this))
		Abilities.Black.Thorn.Use(encounter, this, t);
	else if(choice < 0.4 && Abilities.Black.Spray.enabledCondition(encounter, this))
		Abilities.Black.Spray.Use(encounter, this, t);
	else if(choice < 0.6 && Abilities.Black.Spire.enabledCondition(encounter, this))
		Abilities.Black.Spire.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Black.Venom.enabledCondition(encounter, this))
		Abilities.Black.Venom.Use(encounter, this, t);
	else
		Abilities.Attack.Use(encounter, this, t);
}

Scenes.ZebraShaman.LoneEnc = function(levelbonus) {
 	var enemy = new Party();
 	var zebra = new ZebraShaman(levelbonus);
	enemy.AddMember(zebra);
	var enc = new Encounter(enemy);
	enc.zebra = zebra;
	
	enc.onEncounter = Scenes.ZebraShaman.Encounter;
	enc.onVictory   = Scenes.ZebraShaman.OnWin;
	/* TODO
	enc.onLoss = ...
	*/
	return enc;
}

Scenes.ZebraShaman.Encounter = function() {
	var enc = this;
	
	var parse = {
		weapon : player.WeaponDesc()
	};
	
	parse["comp"] = party.Num() == 2 ? party.Get(1).name : "your companions";
	parse["c"]    = party.Num()  > 1 ? Text.Parse(" and [comp]", parse) : "";
	
	Text.Clear();
	Text.Add("After wandering the rugged, uneven landscape without finding anything of note, you[c] decide it would be best to find a good spot to rest and recuperate before continuing. To get your bearings, you climb a hill to survey the environment. To your luck, you spot a watering hole located just at the bottom of a rather steep cliff nearby.", parse);
	Text.NL();
	Text.Add("You make your way down carefully so as to not lose your footing, eventually arriving at the basin of the pool. Kneeling down, you place a hand in the water. The cool sensation is enough to send a delightful shiver down your spine. You splash some of the cold water on your face to reinvigorate yourself, as well as to wash off some of the dirt and grime you may have picked up on your journey. Cupping your hands, you scoop up some water and bring it to your lips. Tilting your head back, you let it pour down your throat and quench your thirst. You drink down several more gulps of the cool liquid when, suddenly, you’re struck with a sense of dizziness. Uh oh, was there something in the water?", parse);
	Text.NL();
	Text.Add("Slowly, your mind and sight grow fuzzier, and your body grows limp. ", parse);
	if(party.Num() > 1) {
		parse["s"] = party.Num() == 2 ? "s" : "";
		parse["hisher"] = party.Num() == 2 ? party.get(1).hisher() : "their";
		Text.Add("Even [comp] seem[s] to be having some trouble with [hisher] thoughts. ", parse);
	}
	Text.Add("As you struggle to compose yourself, you hear a faint sound in the distance. At first you can’t quite understand what it is, but gradually the sound grows louder and louder. Soon you can clearly hear the sound of chanting. Looking up, you can just barely make out a figure standing before you, quite possibly the source of your current predicament.", parse);
	Text.NL();
	Text.Add("Quickly, you throw yourself to your feet with what strength you still possess and shake your head furiously, throwing some slaps in there for good measure. It does the trick. The fog the chanter puts your mind into slowly dissipates, and you get your first good glimpse at your would-be manipulator.", parse);
	Text.NL();
	Text.Add("Standing before you <i>on</i> the water is a zebra-morph, clearly a magic user by the look of things. He is cloaked in an open leather robe marked with tribal symbols and a simple loincloth to conceal his genitalia. He wears a simple rope belt around his waist which holds several small pouches, and another much larger pouch rests on his left hip held up by a shoulder strap. From the sounds it produces you get the feeling it’s stocked full of bottles, possibly filled with various concoctions.", parse);
	Text.NL();
	Text.Add("His face and body are covered in piercings and jewelry, the most notable of which is the gold nose ring that is encrusted with an ornate pattern. In his right hand he holds a rather long wooden staff tipped with a green gem that gives off an eerie glow.", parse);
	Text.NL();
	Text.Add("You step back and raise your [weapon], ready to fight. Seeing this unexpected turn of events, the zebra morph also readies his staff and prepares himself for battle.", parse);
	Text.NL();
	Text.Add("You’re fighting a Zebra Shaman!", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		enc.PrepCombat();
	});
}

Scenes.ZebraShaman.OnWin = function() {
	var enc = this;
	var zebra = enc.zebra;
	SetGameState(GameState.Event);
	
	var parse = {
		weapon : player.WeaponDesc()
	};
	
	Gui.Callstack.push(function() {
		Text.Clear();
		Text.Add("The shaman collapses to his knees before you, just barely able to keep himself upright with the help of his staff. As you lower your [weapon], the shaman speaks to you. <i>“You’re quite remarkable,”</i> he grunts between labored breaths. <i>“I’ve never encountered such a strong-willed individual who could overcome my mind-bending. I... do want to apologize for my behavior, however. I had no intentions of fighting you.”</i> Oh really? That’s not how it came across to you. If he wasn’t intent on fighting or harming you, then what exactly was he doing?", parse);
		Text.NL();
		parse["scout"] = party.Num() > 1 ? "scouts" : "a scout";
		Text.Add("<i>“I feared that you were [scout] sent by Malice,”</i> he continues, <i>“so I hid myself and cast a spell, hoping to force you back the way you came. What I didn’t count on was your ability to resist my magic so well.”</i> He chuckles to himself. <i>“I’ve never seen anything quite like it.”</i>", parse);
		Text.NL();
		Text.Add("Whatever the case may be, you don’t appreciate his attempts to warp your mind. Still, there really isn’t much to prove at this point. Perhaps it would be best to leave the shaman to himself and continue on your journey.", parse);
		Text.NL();
		Text.Add("Or maybe you can coax him into having a bit of fun with you?", parse);
		Text.Flush();
		
		//[Fuck him] [Ride him] [Leave]
		var options = new Array();
		options.push({ nameStr : "Fuck him",
			func : function() {
				Scenes.ZebraShaman.OnWinFuckHim(enc);
			}, enabled : player.FirstCock(),
			tooltip : "Perhaps you can convince him to have a bit of fun with you? After all, he did assault you… letting you fuck his ass is the least he can do."
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
		Gui.SetButtonsFromList(options, true, function() {
			PrintDefaultOptions(); //TODO
		});
	});
	Encounter.prototype.onVictory.call(enc);
}

Scenes.ZebraShaman.OnWinFuckHim = function(enc) {
	var zebra = enc.zebra;
	
	var lusty = zebra.LustLevel() > 0.5;
	var p1cock = player.BiggestCock();
	
	var parse = {
		clothes : function() { return player.ArmorDesc(); }
	};
	parse = player.ParserTags(parse);
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	Text.Clear();
	Text.Add("After all the trouble he’s put you through, you think it’s only fair that he makes up for it. Approaching the zebra-morph, your eyes dance over his body; he’s quite a handsome fellow, you think to yourself. Placing a hand on his chin, you raise his head and look him in the eyes, asking if he might be up for a little romp with you.", parse);
	Text.NL();
	if(lusty) {
		Text.Add("His cheeks flush a deep crimson and his breathing noticeably increases. <i>“O-oh… you want to… w-with me?”</i> he says, unable to hide his growing arousal. <i>“Well… I think I might have just the thing...”</i> Turning his attention to the satchel by his side, he opens the lid and inspects several bottles. It only takes a moment before he produces a rather large vial of blue liquid. <i>“This potion,”</i> he says as he carefully hands it to you, <i>“is a potent mixture designed to heighten arousal and sensitivity. I only have one vial, so… do you mind sharing?”</i> ", parse);
	}
	else {
		Text.Add("<i>“W-what?!”</i> he stutters, <i>“N-no… I couldn’t possibly do that! I already apologized for my mistake. Just leave me be… please...”</i> It’s pretty clear that he’s not budging. Well, if he’s not game for it, you’ll just have to find a way to coax him into it...", parse);
		Text.NL();
		Text.Add("You stand there and contemplate what you could do when you catch sight of the satchel of potions he carries. That might just be your ticket. Still drained from your assault, he doesn’t do much to stop you when you pull on the shoulder strap and lift his bag away from him. Setting the satchel down carefully, you peruse the contents in the hope that you’ll find what you’re looking for. There must be dozens of bottles and vials in here, all labeled with what you assume to be the shaman’s handwriting.", parse);
		Text.NL();
		if(player.Int() >= 65)
			Text.Add("As you skim through the potions, you locate a vial of vibrant blue liquid. From what you can make out, it seems to be a type of aphrodisiac. Just what you were looking for! Off to your side, the shaman seems to be deducing the your intentions. When you turn to him holding the vial with a dastardly grin on your face, his eyes widen in realization and fear.", parse);
		else
			Text.Add("Unfortunately, you’re unable to decipher the text scrawled on the labels. Without a better idea coming to mind, you inform the shaman of your intentions and tell him to choose a potion that will suit the job. He blushes slightly and averts your gaze. You make it very clear to him that if he doesn't want to pick one, you'll have to do it yourself. Blindly. More importantly, he's going to be the guinea pig. With some reluctance, he pulls out and hands you one of the vials containing a vibrant blue liquid.", parse);
	}
	Text.NL();
	Text.Add("Using your teeth you uncork the vial, releasing an intoxicating aroma into the air. The smell is almost enough to tempt you into drinking some yourself, but you power through the urge and bring the vial to his mouth. Without any force on your part, he downs a good portion of his own brew. Before he has the chance to drink it all, however, you pull it away, saving the rest for yourself. You take a step back and gauge his reaction to make sure everything goes according to plan.", parse);
	Text.NL();
	Text.Add("A minute passes in silence. ", parse);
	if(!lusty)
		Text.Add("The zebra-morph fidgets uncomfortably with a worried look on his face as you watch him intently. ", parse);
	Text.Add("Nothing seems to be happening, and you're growing frustrated. Suddenly, a suppressed moan escapes his lips. His hands slowly trace over his body, pinching and rubbing any sensitive spots he can find - which is quite a lot, judging by his reactions. You look further down and see something clearly stirring in his loins. Without missing a beat, he rips off his clothes revealing his bestial shaft for all to see. He starts masturbating slowly, taking in the sensation of every stroke. He's not even trying to hide his lust at this point.", parse);
	Text.NL();
	Text.Add("As much fun as it would be to watch the show he's putting on for you, you've got better ideas. Eagerly, you drink the last half of his potion. The taste is astoundingly sweet, and it tickles the back of your throat as you gulp it down. Tossing the vial aside, you give the concoction a chance to kick in. Already aroused by the shaman’s erotic display, it isn’t long before you feel a pleasurable shiver run through your body. Soon, your breathing grows heavier, your skin becomes sensitive, and your want for a good fuck has now been replaced by an animalistic need.", parse);
	Text.NL();
	Text.Add("You quickly strip yourself piece by piece, tossing your [clothes] aside with no regard for where they land. With your gear removed, your [cocks] stand at attention, aching with need.", parse);
	if(player.FirstVag())
		Text.Add(" Even your [vag] has become sopping wet, leaking juices down your [leg] like a faucet.", parse);
	Text.NL();
	Text.Add("Now that you’re ready, you turn your attention back to the zebra. The sight would be enough to make you laugh, were you not so debilitatingly aroused. Already lost in a rut, the shaman is on his knees holding himself up with one hand, using the other to furiously pump his throbbing shaft. A small pool of pre has already formed beneath him, dripping unabashedly from his flared tip. From his current position, you have a clear sight of his black rosebud, which twitches invitingly. Licking your lips, you move in to claim your prize.", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("You position yourself behind him, giving you full access to his plump tush. With both hands, you grab his cheeks and stretch them apart to take a gander at his pucker. From the look of things, it doesn't seem like he's very experienced with anal sex. Using a finger, you prod at his back door to assess his tightness; lo and behold, you're unable to push even an inch into him. It seems that he's going to need a bit of help before you can get to the action. Not just for his sake, but for yours as well. You don't have any proper lubricant at your disposal, but that shouldn’t be a problem.", parse);
		Text.NL();
		Text.Add("Letting your tongue loll, you place it at his taint and drag it through his crack and over his pucker before lifting away at base of his tail. It's enough to grab the shaman's attention, forcing a groan from his throat when he feels you do it again, and again, and again. You thoroughly lap at his backside, drinking in his reactions and enjoying every second of it. You almost feel like you could keep at it for hours; however, you've got more important things to do. You align you tongue with his entrance and push your way in. Slowly but surely, his resistance gives up and you manage to slide yourself as far in as you can.", parse);
		Text.NL();
		Text.Add("You need be sure he's ready for you when it's time, so you make sure to coat every inch of his insides thoroughly with your saliva. Twisting and swirling your tongue, you manage to brush over his prostate several times which pushes him even closer to the edge. Speaking of which, he's still trying to get off beneath you, furiously masturbating as you give him a deep rimming.", parse);
		Text.NL();
		Text.Add("Pulling your tongue free, you look to see he's still going at it. Suddenly, a rather naughty idea crosses your mind. Batting his hand away, you let him know that from now on, he's no longer allowed to touch himself without your permission. He lets out a whimper of disappointment, but doesn't fight back. ", parse);
		if(lusty)
			Text.Add("Instead, he takes the opportunity to spread his legs further apart, giving you more access to play with his naughty bits.", parse);
		else
			Text.Add("To make things easier, you tell him to spread his legs to give you more access to his naughty bits. He hesitates for only a moment, but the effects of the potion are enough to overpower his reluctance.", parse);
		Text.Add(" Using your mouth to wet up two fingers, you place them at his moistened rosebud and push your way inside. Thanks to the tongue fucking you gave him earlier, it takes very little effort to bury them to the knuckle. You begin massaging his prostate, drawing circles over and over again with a slight amount of pressure applied. Using your free hand, you slowly stroke his now twitching horse cock.", parse);
		Text.NL();
		Text.Add("It doesn't take more than a minute before the zebra-morph is overcome by the pleasures wrought by your ministrations. He lets out a rather slutty moan as his horsey shaft throbs and shoots out several spurts of his potent seed onto the ground. With your hand, you manage to catch a shot directly into your palm. You bring it to[oneof] your own [cocks] and coat it with the sticky stuff. You shudder as you lube yourself up, the warm feeling of his cum making you hotter than before. It feels too good to stop touching yourself. You eagerly pump your [cock], rocking your hips back and forth as you...", parse);
		Text.NL();
		Text.Add("Wait, no! You can't get off like this! Shaking your head, you manage to focus just enough to get back to the task at hand. It looks like the potion is clouding your judgement somewhat. If you can't get a grip, you'll lose your chance at a good fuck! Before your overwhelming lust can distract you again, you position your well lubed [cockTip] at his hole.", parse);
		Text.NL();
		if(lusty)
			Text.Add("<i>A-are you doing what I think you're doing?</i> The zebra-morph groans. You are indeed, you tell him, slapping his rump with your [cock] a few times to get the point across. <i>“Stop teasing! Just… stick it in already!”</i>", parse);
		else
			Text.Add("<i>“W-wait! I've... I've never...”</i> His voice trails off. A virgin, huh? Rubbing his back softly, you tell him not to worry. He'll probably enjoy it more than he thinks. He gulps audibly and nods his head. <i>“Just... be gentle, okay?”</i>", parse);
		Text.NL();
		Text.Add("It does take some effort on your part, but the impromptu lubrication works well in helping you push past his defenses. Inch by inch, you force your [cock] deeper into his bowels. The zebra-morph merely grunts and moans the deeper you shove yourself into him. Finally, you bottom out. Stopping for a moment to adjust yourself, you feel his anal walls clenching and unclenching around your [cock], trying their best to acclimate to the feeling of being filled. You pull your hips back, letting your [cock] slide back out until only the tip remains. Without warning, you ram yourself in full force, which causes the shaman to produce a loud yelp. You repeat the motion, picking up the pace as you get yourself into a rhythm.", parse);
		Text.NL();
		
		Sex.Anal(player, zebra);
		zebra.FuckAnal(zebra.Butt(), player.FirstCock(), 3);
		player.Fuck(player.FirstCock(), 3);
		
		Text.Add("You can't remember the last time you've had a fuck that felt this good. You lose yourself in pleasure as your hips piston back and forth, pummelling his rear with as much strength as you can muster. His innards are being ravaged by your [cock], and you're too far gone to care how he's faring. The air is filled with nothing but the sounds of your grunting, his moaning, and the lewd sounds of your hips clapping together. Your mind has completely succumbed to the potion's effects and you've entered a rutting state. All you care about is getting your release, and that's just what you'll do.", parse);
		Text.NL();
		Text.Add("Though you haven’t been paying much attention, the shaman has been enjoying the rough treatment you’ve been giving him. He's just as far gone as you, and he <i>needs</i> to be bred properly like the slut he is. Your [cock] has rammed into his prostate countless times and at such a speed that it’s only a matter of time before he climaxes.", parse);
		Text.NL();
		Text.Add("Thanks to your relentless pounding, he lets out a drawn out moan and succumbs to his second orgasm. Though not as powerful as his first, he still manages to shoot a few large strands of cum on the ground. His cock isn’t the only part of him that’s getting off, though; his anal passage squeezes down tight around your [cock], hoping to milk you dry as you fuck him wildly.", parse);
		Text.NL();
		
		var cum = player.OrgasmCum();
		
		Text.Add("At last, you feel your [balls] begin to swell, a telltale sign of your own impending orgasm. With a loud howl you plant your [cock] deeply into his bowels and let out a tidal wave of seed. Glob after glob pours into him, painting his inner walls white and stuffing his stomach with spunk. ", parse);
		if(player.FirstVag())
			Text.Add("Your [vag] also quakes from your orgasm, spraying femspunk all over your [legs] and the ground beneath you. ", parse);
		Text.Add("The orgasm is large and seems to last forever - yet another side effect of the potion - but like all good things, it must come to an end. The effects quickly wear off, giving your mind a sense of clarity once again. Drained of all the pent up semen in your [balls], you pull yourself from the zebra-morph’s abused hole, letting all the trapped jizz you poured into him drain out beneath him.", parse);
		Text.NL();
		Text.Add("After you take a moment to catch your breath, you clean yourself off with the water from the pond before equipping your gear. As you're about to take your leave, you feel a hand on your shoulder. You turn to see the shaman standing beside you. ", parse);
		if(lusty) {
			Text.Add("He wraps his arms around your neck and pulls you into a deep kiss. It catches you by surprise, but you're not one to complain. Your tongues dance in each other's mouths passionately for a bit, but he eventually breaks the kiss. <i>“You know, I’ve never actually done that before...”</i> He admits shyly. So he was a virgin, was he? You ask if you might have been too much for his first time. <i>“Thanks to the potion, it felt incredible from beginning to end. I think I’ll be walking funny for a while, though.”</i> He gives you a peck on the lips and a wink before turning turning away.", parse);
		}
		else {
			Text.Add("He lands a small kiss smack-dab on your cheek. So quickly, in fact, that it catches you off guard. He clears his throat before speaking, <i>“That... um... that wasn't, you know... as bad as I thought it'd be…”</i> He says in a hushed tone, <i>“I guess what I mean is... t-thanks for the good time...”</i> He looks back at you with a sweet smile forming on his face, but quickly turns away to gather his things.", parse);
		}
		Text.NL();
		Text.Add("After he picks up his possessions, you watch him as he makes his way over a nearby hill and disappears out of sight. With everything in order, you make your way out of there as well.", parse);
		Text.Flush();
		
		Gui.NextPrompt();
	});
}

