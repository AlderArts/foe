/*
 * 
 * Naga, lvl 4-6
 * 
 */

function Naga() {
	Entity.call(this);
	
	this.avatar.combat     = Images.naga;
	this.name              = "Naga";
	this.monsterName       = "the naga";
	this.MonsterName       = "The naga";
	this.body.cock.push(new Cock());
	this.body.cock.push(new Cock());
	this.body.vagina.push(new Vagina());
	if(Math.random() < 0.7)
	    this.Butt().virgin = false;
    this.FirstVag().virgin = false;
	this.FirstBreastRow().size.base = 10;
	
	this.maxHp.base        = 100;
	this.maxSp.base        = 40;
	this.maxLust.base      = 65;
	// Main stats
	this.strength.base     = 20;
	this.stamina.base      = 18;
	this.dexterity.base    = 23;
	this.intelligence.base = 21;
	this.spirit.base       = 22;
	this.libido.base       = 24;
	this.charisma.base     = 27;
	
	this.level             = 4;
	if(Math.random() > 0.8) this.level = 6;
	this.sexlevel          = 2;
	
	this.combatExp         = this.level;
	this.coinDrop          = this.level * 4;
	
	this.body.SetRace(Race.snake);
	
	this.body.SetBodyColor(Color.olive);
	
	this.body.SetEyeColor(Color.purple);
	this.body.SetHairColor(Color.blue);

	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
}
Naga.prototype = new Entity();
Naga.prototype.constructor = Naga;

Scenes.Naga = {};

Naga.prototype.DropTable = function() {
	var drops = [];
	if(Math.random() < 0.05) drops.push({ it: Items.Nagazm });
	if(Math.random() < 0.5)  drops.push({ it: Items.SnakeOil });
	if(Math.random() < 0.5)  drops.push({ it: Items.SnakeFang });
	if(Math.random() < 0.5)  drops.push({ it: Items.SnakeSkin });
	return drops;
}

Naga.prototype.Act = function(encounter, activeChar) {
	// TODO: Very TEMP
	Text.AddOutput(this.name + " acts! Hiss!");
	Text.Newline();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);

	var parseVars = {
		name   : this.name,
		hisher : this.hisher(),
		tName  : t.name
	};

	var choice = Math.random();
	if(choice < 0.4)
		Abilities.Attack.Use(encounter, this, t);
	else if(choice < 0.6 && Abilities.Physical.Ensnare.enabledCondition(encounter, this))
		Abilities.Physical.Ensnare.Use(encounter, this, t);
	else if(choice < 0.8 && Abilities.Physical.Pierce.enabledCondition(encounter, this))
		Abilities.Physical.Pierce.Use(encounter, this, t);
	else if(choice < 0.9 && Abilities.Seduction.Distract.enabledCondition(encounter, this))
		Abilities.Seduction.Distract.Use(encounter, this, t);
	else
		Abilities.Seduction.Tease.Use(encounter, this, t);
}

Scenes.Naga.LoneEnc = function() {
	var enemy = new Party();
	var enc = new Encounter(enemy);
	
	enc.naga = new Naga();
	
	enemy.AddMember(enc.naga);
	
	enc.onEncounter = Scenes.Naga.DesertEncounter;
	enc.onLoss      = Scenes.Naga.DesertLoss;
	// TODO activate win scene
	//enc.onVictory   = Scenes.Naga.DesertWinPrompt;
	
	return enc;
}

Scenes.Naga.DesertEncounter = function() {
	var enc  = this;
	var naga = enc.naga;
	var parse = {
		
	};
	
	Text.Clear();
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("You crest yet another sand dune and discover a large rocky outcrop. Spotting a cave entrance, you decide to look inside and seek shelter from the unforgiving desert climate. You reach the cave entrance and peek inside. The cave is dark, but you feel cool air and hear the sound of dripping water.", parse);
		Text.NL();
		Text.Add("<i>“My, my... aren’t you just the sweetest little morsel? I do love it when my prey is courteous enough to come to me.”</i> You spin around to face the source of the sultry feminine voice.", parse);
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("You come across a small oasis surrounded by plantlife, a rare sight in this area. Several wide slabs of sandstone are exposed among the plants, and from a distance you spot something lying on one of them. As you cautiously approach the slab, you see a thick, scaly tail resting on top of it - resembling a snake’s, but much larger. Your foot upsets a nearby stone, and the creature springs to attention, seeking the source of the sound.", parse);
		Text.NL();
		Text.Add("<i>“Oh, hello there, plaything! I suppose I won’t have to hunt tonight, now that my prey has come to me,”</i> a clearly female voice says excitedly. You realize what you’ve stumbled upon is definitely more than a snake.", parse);
	}, 1.0, function() { return world.time.hour >= 6 && world.time.hour < 19; });
	scenes.AddEnc(function() {
		Text.Add("While exploring the sands in the cool night air, you get the feeling you’re being watched. Looking around and seeing nothing, you continue more cautiously, sweeping the sand behind you to cover your tracks, hoping to lose would-be pursuers. A few minutes later, you hear hissing right behind you!", parse);
		Text.NL();
		Text.Add("<i>“Submit, prey!”</i> a domineering, feminine voice commands and you turn to face your would-be attacker.", parse);
	}, 1.0, function() { return world.time.hour < 6 || world.time.hour <= 19; });
	
	scenes.Get();
	
	Text.Add(" Towering over you at roughly eight feet tall is a half-human, half-serpent creature. From the hips up her body is that of a lithe, average-sized human woman, with a thin waist, shapely D-cup breasts proudly on display, and long, slender arms adorned with golden armlets.", parse);
	Text.NL();
	Text.Add("Her skin is pale, with a slight hint of green, and her facial features call to mind images of snakes; she has a flattened nose, vivid, angular magenta eyes, and elongated, pointy ears pierced with golden hoops. You catch a glimpse of a forked tongue as it slips out between her supple lips, licking them hungrily. An unmatched pair of shining emerald gemstones adorn her forehead just below where her long, icy blue hair begins, sweeping back and falling below her shoulders.", parse);
	Text.NL();
	Text.Add("Her human torso gives way to an enormous snake-like lower body, complete with a thick tail in place of legs. Dark green scales cover her from the hips down, parting only to allow her genitals to show. This snake is a hermaphrodite! Her pair of matching massive cocks are already standing at attention at twelve inches of length, and her barely visible slit is dripping with anticipation.", parse);
	Text.NL();
	Text.Add("<i>“This will be much more enjoyable for you if you don’t resist.”</i> The naga’s voice alerts you just in time to dodge her tail as she attacks you!", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		enc.PrepCombat();
	});
}

Scenes.Naga.DesertLoss = function() {
	var enc  = this;
	var naga = enc.naga;
	SetGameState(GameState.Event);
	
	var parse = {
		earDesc       : function() { return player.EarDesc(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		vagDesc       : function() { return player.FirstVag().Short(); }
	};
	
	enc.finalize = function() {
		Encounter.prototype.onLoss.call(enc);
	};
	
	if(party.Num() == 2)
		parse["comp"] = party.Get(1).name;
	else if(party.Num() > 2)
		parse["comp"] = "your companions";
	else
		parse["comp"] = "";
	
	Text.Clear();
	Text.Add("You collapse to the sand with a thud, lacking the energy to resist any further.", parse);
	Text.NL();
	parse["c"] = party.Num() > 1 ? Text.Parse(", completely ignoring [comp]", parse) : "";
	Text.Add("<i>“You went and tired yourself out! I told you it would be easier if you didn’t resist. Don’t worry though, I won’t hurt you… much...”</i> the naga says with a lusty chuckle as she slithers toward your prone form[c]. Your eyes are drawn to her crotch and impressive genitals. Her pulsating pair of enormous cocks throbs and her reptilian slit oozes, its juices dripping to the sand. She coils her tail around you and squeezes just tightly enough to avoid hurting you as she lifts you off the ground, raising your face to hers.", parse);
	Text.NL();
	Text.Add("The naga’s forked tongue tastes your sweat, plays across your lips, and licks at your [earDesc]. She leans over to whisper in your ear: <i>“We’re going to have some fun now… I’m going to use you, but I’m sure you’ll get off in the process.”</i> She giggles and nibbles on your earlobe, her fangs thankfully retracted.", parse);
	Text.NL();
	Text.Add("As she pulls away from your ear, you find your eyes drawn to hers by the sound of her voice, and feel an irresistible urge to gaze deep into her piercing magenta eyes. Any resistance that you might have mustered slips away, leaving only complete obedience.", parse);
	if(player.FirstCock()) {
		parse = Text.ParserPlural(parse, player.NumCocks() > 1);
		Text.Add(" Blood surges to your [multiCockDesc] as you fall under the naga’s spell, and [itThey] throb[notS] in anticipation of the pleasure to come.", parse);
	}
	if(player.FirstVag())
		Text.Add(" You feel your [vagDesc] moisten as you stare into your captor’s eyes, lubricating you liberally for the impending penetration.", parse);
	Text.NL();
	
	//TODO Redo into a proper scene structure
	
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Scenes.Naga.DesertLossGetDPd(enc);
		return true;
	}, 1.0, function() { return player.FirstVag() && player.LowerBodyType() != LowerBodyType.Single; });
	scenes.AddEnc(function() {
		Scenes.Naga.DesertLossUseCock(enc);
		return true;
	}, 1.0, function() { return player.FirstCock(); });
	/*
	scenes.AddEnc(function() {
		Text.Add("", parse);
		Text.NL();
	}, 1.0, function() { return true; });
	*/
	
	var ret = scenes.Get();
	
	
	if(!ret) {
		Text.Add("PLACEHOLDER...");
		Text.Flush();
		Gui.NextPrompt();
	}
}

Scenes.Naga.DesertLossGetDPd = function(enc) {
	var naga = enc.naga;
	SetGameState(GameState.Event);
	
	var parse = {
		earDesc       : function() { return player.EarDesc(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		clitDesc      : function() { return player.FirstVag().ClitShort(); },
		buttDesc      : function() { return player.Butt().Short(); },
		anusDesc      : function() { return player.Butt().AnalShort(); },
		breastDesc    : function() { return player.FirstBreastRow().Short(); },
		nipsDesc      : function() { return player.FirstBreastRow().NipsShort(); },
		nipDesc       : function() { return player.FirstBreastRow().NipShort(); },
		hairDesc      : function() { return player.Hair().Short(); }
	};
	
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	
	if(party.Num() == 2)
		parse["comp"] = party.Get(1).name;
	else if(party.Num() > 2)
		parse["comp"] = "your companions";
	else
		parse["comp"] = "";
	
	Text.Add("Still wrapped tightly within the naga’s coils, you feel your body being turned upside-down. Her upper shaft brushes against the side of your face, and instinctively your lips part and you wrap your hands around the thick erection presented to you, guiding the head into your welcoming mouth. You do your best to coat it in saliva, knowing that your only task is to prepare it for the main course.", parse);
	Text.NL();
	Text.Add("Your serpentine mistress takes hold of your legs with her hands, spreading them as she lifts your [vagDesc] to her lips. She takes a few exploratory licks inside, using some of her tongue’s excess length to prod your [clitDesc] for good measure. You moan as her slim tongue pleasures and tickles at your vaginal walls, managing to find all of your most sensitive places.", parse);
	Text.NL();
	Text.Add("Satisfied that your [vagDesc] is soaked with your own secretions, she pulls away, simultaneously drawing her hips away and presenting you with her lower member. You greedily welcome her second cock into your empty maw, slathering it in as much saliva as you can manage.", parse);
	Text.NL();
	Text.Add("The naga pulls you closer, and begins to probe around your [anusDesc] with her tongue. She spits on the entrance and pushes one of her fingers through to allow her thin tongue inside. The snake-tongue is drenched in drool, and you realize that the naga is pushing so much saliva into you that she could have filled your mouth several times over. You relax your [anusDesc] at the warmth and wetness inside you, and delight in the feeling of letting it coat and lubricate your passages.", parse);
	Text.NL();
	Text.Add("<i>“Alright, it’s time for the main course.”</i> You barely register your scaled lover’s words as she turns you upright and rests your back on her tail, before aligning you with her monstrous, saliva-slicked members. Your [breastDesc] are on full display, and the naga licks her lips, clearly enjoying the sight of your naked, subservient form. Her hands find your hips as she draws her tail closer, bringing your [vagDesc] and [anusDesc] to rest against the heads of their partners. The heat from her genitals alone is enough to make you squirm and moan.", parse);
	Text.NL();
	Text.Add("<i>“Please, <b>fuck me!</b>”</i> you yell, the anticipation of pleasure too great to even show the barest restraint. Right now, you need those cocks inside you more than the most depraved slut.", parse);
	Text.NL();
	Text.Add("The naga leans her upper body down, hands still firmly on your hips. Her face inches away from yours, she replies: <i>“Gladly, pet.”</i> She moves her hips forward, the heads of her twin towering erections pressing harder and harder against your entrances until they finally breach, sending sparks of pleasure racing through your body. Your [vagDesc] lets another spurt of juice out, coating the first few inches of your lover’s first cock, while you can feel a little of her spit leaking out around your anal invader.", parse);
	Text.NL();
	
	Sex.Vaginal(naga, player);
	player.FuckVag(player.FirstVag(), naga.FirstCock(), 3);
	naga.Fuck(naga.FirstCock(), 3);
	
	Sex.Anal(naga, player);
	player.FuckAnal(player.Butt(), naga.FirstCock(), 3);
	naga.Fuck(naga.FirstCock(), 3);
	
	Text.Add("<i>“Fuck, you’re so tight, pet. That’s alright, we’ll fix that.”</i> The naga flashes you a wicked grin, then presses her lips to yours. Her tongue slips into your mouth, and pleasant as it is to feel it swirling and wrapping around yours, it proves to be a fleeting distraction. Moments later the snake-lady thrusts her hips forward in a short but powerful motion, embedding the first three inches of her throbbing cocks inside you.", parse);
	Text.NL();
	Text.Add("Your scream of surprise and pleasure is muffled by the continuing kiss, but you swear you can feel the naga’s lips twist into more of a grin, even without breaking the lip-lock. The tongue inside your mouth slithers in deeper, now completely wrapped around your own and constricting it rhythmically. You feel the fingers on your hips grip tighter, and you know your mistress’s second thrust is coming. Steeling yourself as well as you can, you try to relax and let her in.", parse);
	Text.NL();
	Text.Add("Sure enough, the second thrust comes, just as powerful as the first, but slightly farther, the naga’s thick shafts now a full seven inches inside you. You try again to scream as pleasure wracks your brain, but barely a sound escapes the tightness of the serpent’s mouth pressed to yours. You’re already as full inside as you think your body can handle, and it feels so good that you almost forget that the cocks stuffing you are only halfway in.", parse);
	Text.NL();
	Text.Add("With less time to recover than after the first thrust, the third comes, this one stronger, hard enough to ram the remainder of the naga’s cocks home. Your lover abruptly breaks the kiss as she thrusts this time, so that as you hear the slap of her flesh against yours, anyone within a mile could hear you scream in raw, bestial pleasure. Your eyes roll back in your head momentarily, your holes utterly filled with slowly pulsating naga-cock. Your mistress laughs almost as loud as you scream, giving you but a moment to rest.", parse);
	Text.NL();
	Text.Add("<i>“Ah, pet… so amusing. That was all just preamble, slut.”</i> the naga taunts, as she slowly and steadily begins to pull her hips back. Every inch that her double-dicks vacate feels painfully empty, and your body aches to be filled to the brim again. The naga continues to pull out until only the bulbous heads of her cocks remain inside you.", parse);
	Text.NL();
	Text.Add("<i>The real fun begins… <b>now!</b>”</i> the she-serpent shouts, grabbing your [nipsDesc] and twisting as she thrusts her hips forward once again, this time ramming her cocks in to the hilt in one savage motion. Both you and your lover scream in delight, your raw screams of uncontrolled pleasure creating an excellent harmony with the naga’s dominant exclamation of control and power. Brought over the edge, you cum, your [vagDesc] squirting fem-spunk all over the naga’s bare midriff.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum();
	
	if(player.FirstCock()) {
		Text.Add("Your [multiCockDesc] begin[notS] to spasm, sympathetically climaxing with your [vagDesc]. ", parse);
		if(cum > 6) {
			Text.Add("Seed erupts from your shaft[s], showering the desert sands around you in the evidence of your sensational orgasm. ", parse);
		}
		else if(cum > 3) {
			Text.Add("Thick ropes of jizz arc over your head as your [multiCockDesc] release[notS] [itsTheir] payload[s], some landing in your [hairDesc] as the flow ends. ", parse);
		}
		else {
			Text.Add("Hot spunk lands wetly on your midriff, and you enjoy the sensation almost as much as the orgasm itself. ", parse);
		}
	}
	Text.Add("Very nearly insensate now, the only thing you can do is moan and deeply enjoy the rough fuck you’re receiving. The snake gives you no rest, immediately beginning to pull out and tugging not-so-gently on your nipples. You moan whorishly and arch your back, beginning to lose all muscle control to the throes of pleasure.", parse);
	Text.NL();
	if(player.FirstBreastRow().Size() > 3) {
		Text.Add("The naga switches her focus from your [nipsDesc] to your [breastDesc], grabbing them with her hands as fast as a cobra strikes its prey. Your mistress squeezes roughly, kneading your [breastDesc] vigorously as she enthusiastically plows back into you.", parse);
		if(player.Lactation()) {
			Text.NL();
			parse["milk"] = player.Milk() > 20 ? "your seemingly endless supply of milk" :
			                player.Milk() > 10 ? "numerous mouthfuls" : "all she can";
			//TODO drain milk
			Text.Add("Streamers of warm milk spew from your [nipsDesc]. <i>“Oh! I love the taste of fresh milk. Gets me so hot and bothered...”</i> the naga says, her intentions plain from the way she licks her lips. Bending down and latching her mouth onto your left [nipDesc], she bites down softly and begins to forcibly suckle. She starts viciously milking your left breast for all its sweet cream, never slowing the pace of penetration. Gulping down [milk], she releases your left breast, its load depleted.", parse);
			Text.NL();
			Text.Add("Neither wasting time nor disrupting her rhythm, she turns her attention to your right breast and begins draining it with the same thirsty fervor. Your moans become louder as your right breast is pumped in time with the thick peckers inside you. Your [breastDesc] are soon completely drained of their precious cargo, feeling noticeably lighter.", parse);
			Text.NL();
			Text.Add("<i>“Mmm… delicious...”</i> the naga breathes, her voice husky, a trickle of your milk rolling down her jaw. Her hips stop briefly, shafts hilted inside you, and you feel the already huge erections pulse with further intensity inside you. The moment passes as the serpent resumes plumbing your depths, but you could swear you feel even more full of naga cock than you were a moment ago.", parse);
		}
	}
	else {
		Text.Add("The snake alternates between tweaking and softly biting your [nipsDesc] while dragging her claw-like nails softly along your chest. Her scratching draws no blood, but does serve to further cement your current position as submissive prey.", parse);
	}
	Text.NL();
	if(player.FirstCock()) {
		Text.Add("Your scaled mistress’ hands roam from your chest to your crotch, where your still-sensitive [multiCockDesc] [hasHave] just returned to full-mast. <i>“Here, let me help you out, pet. You’ve already cum from [thisThese] once, so this will feel even better...”</i> She wraps her hands firmly around[oneof] your [multiCockDesc], warmth surging into its hypersensitive flesh. You cry out in agonized pleasure, the stimulation too much for you to bear so soon after cumming. She begins to stroke your trembling shaft in time with her thrusting, and with each stroke you shriek wildly, your hips convulsing as your cock is assaulted by many times the stimulation you can take right now.", parse);
		Text.NL();
	}
	Text.Add("The naga moans and starts to pick up her pace, steadily increasing the frequency of her thrusts. You lose track of time under the sensory onslaught you’re experiencing. At some point you cum again, able to recall the deluge of ecstasy but not at what point it occurs during the savaging you’re taking.", parse);
	Text.NL();
	Text.Add("You finally regain some semblance of consciousness in time to hear your snake-lover begin to moan and grunt with increasing frequency. Her thrusts are becoming more deliberate without slowing down, and you realize that the naga is about to cum. Surprisingly - and agonizingly - the serpent pulls her pair of monstrous cocks out of you completely, the feeling of emptiness momentarily overwhelming you.", parse);
	Text.NL();
	Text.Add("You see the fat shafts throb wildly for a few seconds as she points them at your face and your [breastDesc], stroking them with one hand each to coax out as much jizz as she can. With the most unrestrained sound she’s made so far, the naga unloads her cannons on you, torrents of cum splattering against your [breastDesc] and all over your face, plenty making it into your wide-open mouth. You briefly savor the salty but delicious taste before swallowing submissively, just in time for the next gush of seed to strike, the cum that doesn’t land in your mouth simply piling up on the rest of your face. Your [breastDesc], having no such drainage, simply become covered in layer after layer of hot, sticky snake-cum.", parse);
	Text.NL();
	Text.Add("The naga allows you to briefly revel in the warmth of your cum bath while she catches her own breath. You take the moment to feed yourself more of the cum that landed where your tongue couldn’t reach on your face, even scooping some off of your [breastDesc] when your face is more or less cleaned up.", parse);
	Text.NL();
	Text.Add("<i>“Now that you’re warmed up, I can go again without worrying about breaking you.”</i> The naga laughs, smiling at you wickedly as she flips you over to lie face-down on her tail. You thought she was done after the ridiculous amount of cum she just shot, but it seems the snake’s reserves are quite deep. She lines up her still rock-hard cocks at the opposite holes of those they just penetrated, and now takes no time before inserting their heads into your [anusDesc] and [vagDesc].", parse);
	Text.NL();
	Text.Add("Your serpent-mistress gives your [buttDesc] a firm slap, the sound echoing who knows how far out into the desert, and begins your second reaming, immediately fucking you with smooth and powerful thrusts. Your insides once again feel that blissful fullness, and you moan as you receive another firm spank. The naga clutches at your asscheeks, playing with them as she did with your breasts. You close your eyes and begin to lose yourself once again to the pleasure, when suddenly you feel something in your mouth.", parse);
	Text.NL();
	Text.Add("The tip of the snake’s long tail is pushing its way into your mouth, pressing your tongue down and poking at the back of your throat. The naga forces a length of her tail into your throat and begins to slide it in and out in time with her cunt- and ass-destroyers. Effectively being triple penetrated now in this two-member gangbang, you lose control, your body shaking as another orgasm begins.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum();
	
	Text.Add("You feel your [anusDesc] and [vagDesc]’s muscles spasm and clench, beginning to milk the enormous invaders for all they’re worth. You don’t want a cumbath this time, you want to be <b>filled</b> with your mistress’s seed. As she once again picks up the pace, thrusting fast and deep, hilting with an audible slap of flesh on flesh at the end of each, you feel the thick shafts inside you throb faster. The naga is close as well, and she kneads and slaps your [buttDesc] savagely between thrusts, clearly getting off even more on her dominance.", parse);
	Text.NL();
	Text.Add("In what seems like hours, but is actually less than a minute, the serpentess crosses the edge. She pushes her massive rods into your holes as far as possible and grinds her hips roughly against your ass, as if to push her cocks in further than her body would allow. You feel the embedded erections pulse, becoming significantly thicker periodically as the naga breaks into another shout of utmost pleasure.", parse);
	Text.NL();
	Text.Add("As you begin to feel the warmth of her cum pumping into you, your already feverish orgasm doubles in intensity, and you let out another scream, muffled by the tail that’s been throat-fucking you. Unable to move or speak as you’re pumped full of cum from both your [vagDesc] and [anusDesc], you lose yourself to the satisfaction. You can barely breathe around the snake’s tail, but somehow the sensation of your belly slightly inflating is comforting.", parse);
	Text.NL();
	if(player.FirstCock()) {
		parse["cum"] = cum > 6 ? "torrents" :
		               cum > 3 ? "bursts" : "streams";
		Text.Add("Your [multiCockDesc] [isAre] pinned helplessly between the naga’s tail and her crotch as she continues to mash her hips against your [buttDesc]. The pressure combined with your feminine orgasm’s intensity brings your masculine endowment[s] over the edge again, even after [itsTheir] earlier release and subsequent torment. Your overused [multiCockDesc] release[notS] [cum] of semen down the scaly tail beneath you, but your lover is too engrossed in her orgasm to care.", parse);
		Text.NL();
	}
	Text.Add("You feel yourself being lifted subtly, gently away from the section of tail supporting you as the naga’s orgasm finally runs its course. She gives you one last celebratory swat on the ass as she slides her prodigious peckers out of your orifices, and lowers you onto the soft sand below. <i>“That was fun, slut. Come again, any time...”</i> she says with a parting wink, before slithering away into the desert, leaving you naked and your savaged holes leaking cum.", parse);
	Text.NL();
	
	parse["c"] = party.Num() > 1 ? Text.Parse(" with [comp]", parse) : "";
	
	Text.Add("You pass out, waking hours later[c].", parse);
	Text.Flush();
	
	world.TimeStep({hour: 2});
	
	Gui.NextPrompt(enc.finalize);
}


Scenes.Naga.DesertLossUseCock = function(enc) {
	var naga = enc.naga;
	SetGameState(GameState.Event);
	
	var p1cock = player.BiggestCock();
	var allCocks = player.AllCocksCopy();
	for(var i = 0; i < allCocks.length; i++) {
		if(allCocks[i] == p1cock) {
			allCocks.remove(i);
			break;
		}
	}
	
	var parse = {
		earDesc       : function() { return player.EarDesc(); },
		multiCockDesc : function() { return player.MultiCockDesc(); },
		multiCockDesc2 : function() { return player.MultiCockDesc(allCocks); },
		cockDesc      : function() { return p1cock.Short(); },
		ballsDesc     : function() { return player.BallsDesc(); },
		vagDesc       : function() { return player.FirstVag().Short(); },
		clitDesc      : function() { return player.FirstVag().ClitShort(); },
		buttDesc      : function() { return player.Butt().Short(); },
		anusDesc      : function() { return player.Butt().AnalShort(); },
		breastDesc    : function() { return player.FirstBreastRow().Short(); },
		nipsDesc      : function() { return player.FirstBreastRow().NipsShort(); },
		nipDesc       : function() { return player.FirstBreastRow().NipShort(); },
		hairDesc      : function() { return player.Hair().Short(); },
		legsDesc      : function() { return player.LegsDesc(); }
	};
	
	parse = Text.ParserPlural(parse, player.NumCocks() > 1);
	parse = Text.ParserPlural(parse, player.NumCocks() > 2, "", "2");
	
	if(party.Num() == 2)
		parse["comp"] = party.Get(1).name;
	else if(party.Num() > 2)
		parse["comp"] = "your companions";
	else
		parse["comp"] = "";
	
	Text.Clear();
	parse["themItL"] = player.LowerBodyType() != LowerBodyType.Single ? "them" : "it";
	Text.Add("The naga’s tail slithers over your [legsDesc], pinning [themItL] to the sand under its considerable weight. She swivels her humanoid upper body until her dripping, scaly slit is on display inches from your lips. Droplets of her juice fall into your open mouth, the taste making you flush with warmth. Instinctively, you extend your tongue and raise your head until your lips make contact with the naga’s tight pussy. Her hands treat her bulging erections to a few lazy strokes as you begin your oral ministrations.", parse);
	Text.NL();
	Text.Add("Piercing inside her, your tongue explores, probing her every nook and cranny. The naga’s cunt contracts suddenly as you tongue a bump near the top of her slit, and you know you must have found her clit, or at least its serpentine equivalent. A fresh squirt of her juices enters your mouth, and you gulp it down eagerly, continuing to please the conquering snake as well as you can.", parse);
	Text.NL();
	Text.Add("Meanwhile, the naga begins preparing your [multiCockDesc] to use as she pleases. <i>”We are going to have so much fun, pet… I promise, you’ll enjoy it almost as much as I will.”</i> She takes[oneof] your [multiCockDesc] in her smooth hands and begins to stroke it gently, with slow and steady motions. Her tongue slips from her mouth, soaked in her saliva, and begins to coil around your shaft. Its surface tickles the sensitive flesh of your head, your hips spasming in response, your body attempting to thrust your manhood toward the source of your pleasure, but its attempt fails, your [legsDesc] still pinned by the naga’s lower half.", parse);
	Text.NL();
	Text.Add("The silken hands pleasuring your [cockDesc] slide down to its base, their grip tightening somewhat. You soon realize that she simply moved her hands out of the way for her tongue to snake its way around most of your length, gently squeezing your member with each additional coil added to your [cockDesc]’s fleshy wrapping. The serpent giggles as you squirm in pleasure, moaning into her cunt as you continue to pleasure it.", parse);
	Text.NL();
	Text.Add("The laughter subsides as she brings her mouth down to bear on your already tongue-covered cock, engulfing it in heat and moisture. The first few inches of your [cockDesc] slip easily into her mouth, passage aided by the slippery, exposed underside of her tongue. ", parse);
	if(p1cock.length.Get() < 13) {
		Text.Add("Your shaft fits comfortably within the naga’s mouth, completely enveloped by her extremely flexible tongue.", parse);
	}
	else {
		Text.Add("The head of your manhood makes contact with the back of the naga’s mouth, the entrance to her throat beckoning. You feel her jaw shifting as she changes position slightly, lining her throat up with the remaining length of your [cockDesc]. With one smooth motion she dives forward, taking your entire length into the tight confines of her throat. You cry out in pleasure, the sound muffled by the ocean of pussy you’re drowning in.", parse);
	}
	Text.NL();
	if(player.FirstVag()) {
		Text.Add("With no exposed skin left on your cock, the naga’s hands roam down to your [vagDesc], one hand zeroing in on your [clitDesc] and pinching it gently, tweaking it slightly. Your hips redouble their efforts to grind into the source of stimulus, to no avail. Two fingers from her other hand slip between your folds into your [vagDesc], rubbing your inner walls and probing around for your g-spot. As soon as she finds it, her digits start vigorously rubbing it, prompting your body to quake with feminine bliss.", parse);
		Text.NL();
	}
	if(player.HasBalls()) {
		Text.Add("Satisfied with her current efforts to stimulate your genitals, the naga decides to turn her dextrous hands on your [ballsDesc]. She softly cups your sack, ever so gently caressing your jizz factories. Switching gears, she wraps one hand around the base of your scrotum and tugs gently while lightly dragging the clawed nails of her other hand over its stretched surface. Her ministrations stop just short of causing any pain, and instead cause your [ballsDesc] to surge with intense, animalistic need. You let loose a muffled roar of pleasure, redoubling your oral efforts on the scaly slit before you.", parse);
		Text.NL();
	}
	Text.Add("The sultry serpent’s tongue pulsates far stronger now than it did before she swallowed your [cockDesc]. Rhythmic contractions of the forked appendage begin to milk your meat, waves of pleasurable pressure starting at its base and squeezing their way to the head. The naga begins to pull back, her lips forming a tight seal as she withdraws, the additional constriction almost pushing you over the edge. She continues her tongue’s ministrations as your blowjob intensifies, its coils proving no obstacle to the pleasure of her lips.", parse);
	Text.NL();
	parse["b"] = player.HasBalls() ? Text.Parse(" as pressure builds to unbearable levels in your [ballsDesc]", parse) : "";
	Text.Add("Soon, the majority of your [cockDesc] escapes the naga’s mouth, although still being stimulated by her prehensile penis-licker. You moan as she lowers herself again, returning your shaft to the warmth inside of her with the speed you’d expect from a snake’s bite. Without stopping at the base this time, she blows you with increasing speed, waves of ecstasy from your [cockDesc] wracking your body[b].", parse);
	Text.NL();
	
	var cum = player.OrgasmCum();
	parse["cum"] = cum > 6 ? "explode" :
	               cum > 3 ? "erupt" :
	               "burst";
	Text.Add("You can only take the oral onslaught for so long before you give in, your [multiCockDesc] throbbing wildly as [itThey] [cum][notS]. The serpent’s throat eagerly sucks down your cum as quickly as it escapes your pulsating member. ", parse);
	if(player.NumCocks() > 1)
		Text.Add("Your neglected [multiCockDesc2] unleash[notEs2] [itsTheir2] payload into open air, your spunk landing mostly on the scaly tail still resting on your [legsDesc]. ", parse);
	Text.Add("You keep cumming for what seems like forever, the expert oral skills of the naga coaxing plenty of seed from your loins. The suction coming from the vacuum seal of her mouth doesn’t diminish until the flow of your jizz has entirely abated.", parse);
	if(player.HasBalls())
		Text.Add(" By the end of your orgasm, your [ballsDesc] feel almost painfully empty, drained completely of your spunk.", parse);
	Text.NL();
	Text.Add("The naga withdraws completely from your [cockDesc] as she retracts her absurdly long tongue and lifts her soaked slit away from your now-drenched face. She turns to face you as you lift your torso, a slightly disappointed look in her eyes. <i>”So little stamina, pet!”</i> she pouts melodramatically. <i>”That’s alright, I’m well equipped for situations like this. Don’t worry, this will only hurt for a second...”</i> You catch a mischievous glint in her eyes, the snake’s gaze meeting yours as she brings her mouth down to the base[s] of your shaft[s].", parse);
	Text.NL();
	Text.Add("Your eyes widen as the naga pulls her lips back in a wicked grin, exposing a pair of fangs protruding from her upper jaw. With no further warning, she sinks her fangs into your crotch. You feel searing pain for a split-second, but it subsides immediately, replaced by a warm, tingling sensation as the naga pumps venom into your body. You gasp, losing your breath as your [multiCockDesc] surge[notS] with renewed vigor, swelling beyond [itsTheir] normal limit[s] while bobbing wildly and squirting pre-cum. You realize [itsTheyve] actually grown longer and thicker than [itThey] [wasWere] moments ago! A haze of lust fills your mind as your libido goes into overdrive, as if you hadn’t felt release in months.", parse);
	Text.NL();
	
	var first = gameCache.flags["NagaVenom"] == 0;
	gameCache.flags["NagaVenom"]++;
	
	if(player.HasBalls()) {
		Text.Add("Your [ballsDesc] churn and swell, and you can almost <i>feel</i> them overflowing with fresh spunk, coaxed into creation by the venom flowing through your loins. They begin to ache with fullness, swollen beyond their usual size from the excess load they bear.", parse);
		Text.NL();
	}
	if(player.FirstVag()) {
		Text.Add("Your [vagDesc] spasms, a deluge of lubricating juices flowing from your mostly-neglected cunny. An intense need to be fucked by her pair of enormous erections washes over you, your vaginal walls squeezing uncontrollably at the emptiness inside. You squirm with anticipation, although from her efforts so far, you know the snake has other plans for you.", parse);
		Text.NL();
	}
	Text.Add("<i>”There, isn’t that better?”</i> the naga asks with a wide smile on her lips and a trickle of venom rolling down her cheek. Quivering uncontrollably with artificial aphrodisia and very nearly senseless with pleasure already, you can muster only a shaky nod as a response. <i>”Very good, pet! Now that we’ve taken care of that little problem, it’s time to get down to business...”</i>", parse);
	Text.NL();
	Text.Add("The naga reaches up to your shoulders and grasps them gently, shifting her weight as she slowly pushes your upper body down until your back rests on the sand once again. Her shapely breasts press against your [breastDesc], her cocks smearing pre on your abdomen as they slide unused between your bodies.", parse);
	if(player.FirstBreastRow().Size() > 3) {
		Text.Add(" You moan as your [breastDesc] squeeze against the naga’s, your [nipsDesc] rubbing sensually against hers.", parse);
		if(player.Lactation())
			Text.Add(" The breast-on-breast pressure is enough to cause your [nipsDesc] to squirt some of your milk into the fleshy pillow-fight. Noticing the extra lubrication, the serpent-woman smiles lasciviously and makes extra effort to wriggle her sizable breasts around, spreading your milk all over both of your mounds and all over your torso.", parse);
	}
	Text.NL();
	Text.Add("Your serpent-lover presses her lips to yours, kissing you fervently as her hands align[oneof] your [multiCockDesc] with her practically gushing slit. You return the kiss as well as you can considering your lust-addled state, wanting nothing more than to be used by the half-snake temptress; it isn’t long before you get your wish.", parse);
	Text.NL();
	Text.Add("The naga’s tongue plunges between your lips at the same time as she lowers her scaled pelvis, the saliva-slicked tip of your [cockDesc] parting the lips of her wet, welcoming slit. Her serpentine pussy is unbelievably tight, squeezing your overly-engorged tip greedily as her inner walls begin to undulate. Her tongue explores your mouth at roughly the same pace as she pushes her pussy down, vigorously french-kissing you while inviting your [cockDesc] into the warmth of her cunt, accepting inch after inch of your extra-swollen, throbbing shaft.", parse);
	Text.NL();
	
	Sex.Vaginal(player, naga);
	naga.FuckVag(naga.FirstVag(), p1cock, 4);
	player.Fuck(p1cock, 4);
	
	Text.Add("The inside of the snake’s box is vice-tight around your abnormally-bulging member, and her vaginal walls massage you unrelentingly as her periodic thrusts completely lodge your newly-enlarged maleness into her serpentine love tunnel. Her vaginal muscles go wild, beginning to milk your [cockDesc] thirstily as juices gush out and coat your crotch to a lust-slick shine.", parse);
	Text.NL();
	Text.Add("You moan throatily into the naga’s passionate kiss as you feel another orgasm coming over you, but after over a dozen gigantic waves of pleasure crashing over your entire body, you feel no release. Your [multiCockDesc] pulse[notS] wildly as [itThey] try to climax, your muscles spasming but failing to expel any cum.", parse);
	if(player.HasBalls())
		Text.Add(" Your [ballsDesc] clench painfully, over-filled with semen but helpless to fulfill your body’s need to ejaculate.", parse);
	Text.NL();
	if(first) {
		Text.Add("You feel the naga laughing as she pulls her lips away from yours, taking her time to peel her tongue from yours. Her cheeks flush hotly, her face adopting an expression of wanton, lustful hunger. <i>”Oh, I suppose I should have mentioned,”</i> she explains flatly with an almost malicious, carnal expression on her face. <i>”My venom gives me <b>complete</b> control of your climax, pet. You don’t get to cum until I do.”</i> she continues, licking her lips for good measure. <i>”Don’t worry, though, it only works for a while each time I cum, and it doesn’t neutralize the... <b>other</b> effects of the venom. You’ll be hard for a good, long, time...”</i>", parse);
		Text.NL();
		Text.Add("The naga’s worrying explanation trails off as she leans down to resume the lip-lock, redoubling her vaginal milking and now adding short, powerful thrusts to the sensory onslaught her animalistic cunt is delivering to your [cockDesc].", parse);
	}
	else {
		Text.Add("You feel the naga laughing as she pulls her lips away from yours, her tongue playing over your lips as she retracts it enough to speak. <i>”Yes… you remember this part, don’t you, pet?”</i> You vaguely remember your scaly mistress’s explanation from your last encounter, and you steel yourself for the agonizing buildup to come. You’ll only get to cum whenever she does, and you try to brace yourself for being on edge until then.", parse);
		Text.NL();
		Text.Add("Seeing your understanding, she smiles at you, leaning in close. <i>”Good… I like it when my toys are eager to please me. We’re going to have such a good time making me cum...”</i> she coos, resuming her forceful kiss. Her inner walls ripple, their surfaces gripping your [cockDesc] tightly as she begins to rock her serpentine pelvis up and down.", parse);
		Text.NL();
		Text.Add("You moan lustily as the naga subjects your expanded erection to the ecstatic sensations of her beastly pussy’s milking and her penetrating thrusts simultaneously. You know the pleasure will continue to rise, coming closer and closer to breaking your mind until the snake herself climaxes.", parse);
	}
	if(player.FirstBreastRow().Size() > 3) {
		Text.Add(" Her soft, enticing breasts rub more intensely against your [breastDesc] as she begins moving her torso. ", parse);
		if(player.Lactation())
			Text.Add("Your milk-slicked bodies glide over each other with blissful ease, every square inch of your tit-flesh surging with pleasure at the smooth gliding of the naga’s sizable mounds over yours. ", parse);
		Text.Add("The snake’s mouth muffles your whorish moan as the sensation of your [nipsDesc] rubbing against hers adds yet another stimulus to the list of overwhelming pleasures you’re receiving.", parse);
	}
	Text.NL();
	parse["tightLooseGaping"] = player.Butt().Tightness() < Butt.Tightness.tight ? "tight" :
	                            player.Butt().Tightness() < Butt.Tightness.loose ? "loose" : "gaping";
	Text.Add("You feel a shifting sensation in the sand beneath your legs as you realize the naga is moving her tail. A few seconds later in your ongoing sexual overload, you feel a tickle on your [anusDesc]. Realizing with shock what’s about to happen, you moan into your lover’s lips, half of you pleading for mercy and the other half craving ever more pleasure. As the scaly tip of the naga’s tail breaches your [tightLooseGaping] pucker, your moan turns into a muffled scream.", parse);
	Text.NL();
	Text.Add("The serpentine tail has a relatively thin point, but the scales themselves make the penetration somewhat unique. You can feel each scale at first, the naga sliding her tail in slowly and purposefully, swirling around the tip to feel your inner walls. As her snake tail enters deeper into your anal passage, the thickness increases, becoming far thicker than most cocks in short order.", parse);
	Text.NL();
	Text.Add("The tail twists and turns as the snake-lady continues to use your venom-laced [cockDesc] to stuff herself, her lips and tongue unrelenting in their conquest of your mouth. Suddenly, the tail’s thickness brushes against your prostate, and you experience another agonizing non-climax, your orgasm denied again by her aphrodisiac-toxin. Your [cockDesc] bulges further, throbbing and pulsating within the naga’s obscenely talented cock-milker of a cunt.", parse);
	Text.NL();
	Text.Add("For her part, your serpent-mistress notices your plight, and lifts her face inches away. <i>”Ahh… There we are, pet. I absolutely <b>love</b> to watch you squirm like that, it makes me <b>so</b> hot. I think you’ll get your first reward soon...”</i> she coos, her face a mask of lewd dominance as she licks her lips. She makes eye contact, or at least as much as can be made while your eyes are rolled back in their sockets from your second lack of release.", parse);
	Text.NL();
	Text.Add("<i>”<b>Yes!</b> Just like that! That face is <b>perfect!</b>”</i> she shouts, pulling back into a vertical position and clutching one of her monstrous members in each hand. She picks up her pace, madly hammering your [cockDesc] into her almost torturously tight pussy, and starts to furiously jack off her towering twin cocks. Moments later, you feel your engorged shaft squeezed viciously, and the naga’s slit and shafts all erupt with fluid.", parse);
	Text.NL();
	Text.Add("Geysers of alabaster jizz stream from her massive pricks, most of it soaring over you onto the desert sands with the force of her climax, but some lands on your [breastDesc], covering them in a thick coat of hot, sticky cum. A flood of femcum bursts from the naga’s slit, and as you feel it seep into the skin of your [cockDesc] and crotch. Your body convulses, your denied orgasms coming back to you with a vengeance and bringing you to a furious double-climax.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum(3);
	
	if(player.HasBalls()) {
		Text.Add("Your [ballsDesc] tighten, and you feel the need within them overflow as your climax begins. ", parse);
	}
	Text.Add("Your [cockDesc] swells impossibly within the confines of the naga’s twat, an enormous load of jizz erupting deep into the monstrous passage that is the snake’s vagina. You’re rocked by pleasure many times what you’re used to from cumming, and you lose track of how long your orgasm continues, your body spasming as you shoot a seemingly endless amount of spunk into the sweltering serpent-cunt.", parse);
	if(player.NumCocks() > 1) {
		Text.NL();
		Text.Add("Your other [multiCockDesc2], thus far neglected by the naga, fire[notS2] jets of semen into the air, soaking skin, scales and sand alike with huge globs of your thick cum.", parse);
	}
	else {
		Text.Add(" The pressure on your [ballsDesc] is finally released. Your reservoirs are once again drained and you relish in the comfort of having empty balls this time.", parse);
	}
	Text.NL();
	if(player.FirstVag()) {
		Text.Add("The pleasure surging through your body is so intense that your [vagDesc] reaches its own climax despite its total neglect since the naga started to ride you. Femspunk gushes from your entrance as you feel sparks of pleasure from every nerve in your cunny arcing to your brain.", parse);
		Text.NL();
	}
	if(player.Lactation()) {
		Text.Add("Your [breastDesc] are far from immune to the ecstasy coursing through you, and your hands leap to the overly sensitive, serpent-cum covered flesh of your [nipsDesc] and begin to fondle them out of pure animal instinct. You pinch them with sensuous fervor, causing streams of your own brand of cream to spurt out into the desert air, soaking your upper body and the sand below.", parse);
		Text.NL();
		Text.Add("As your orgasmic spasms dissipate and you regain some degree of motor control, you can’t help but notice that plenty of the milk has mixed with the naga’s cum, and you scoop up a handful, pouring it into your thirsty mouth and savoring the uniquely sexual combination of flavors. The serpent notices and licks her lips, taking great pleasure in your lewd display.", parse);
		Text.NL();
	}
	Text.Add("When you’ve finally ridden out the mind-wracking pleasure of the double orgasm you’ve just been treated to, you notice that the naga hasn’t moved. She’s slowly stroking her still-stiff bitch-breakers and waiting with a licentious grin for realization to dawn on you. Your [cockDesc] is still rock-hard, swollen, and enveloped in the titillating tightness of the snake’s cunt. When she sees the look in your eyes, the naga bursts out in wicked laughter.", parse);
	Text.NL();
	Text.Add("<i>”Oh, you thought we were done?”</i> The naga asks rhetorically, leaning in to whisper in your ear. <i>”We. Are. Just. Getting. Started. <b>Pet.</b>”</i>", parse);
	Text.Flush();
	
	world.TimeStep({hour: 2});
	
	var cocks = player.AllCocks();
	var len = false, thk = false;
	for(var i = 0; i < cocks.length; i++) {
		var inc  = cocks[i].length.IncreaseStat(50, 3);
		var inc2 = cocks[i].thickness.IncreaseStat(12, 1);
		len |= inc;
		thk |= inc2;
	}
	var grown = len || thk;
	
	Gui.NextPrompt(function() {
		Text.Clear();
		Text.Add("<b>Several hours and many, many orgasms later...</b>", parse);
		Text.NL();
		parse["c"] = party.Num() > 1 ? Text.Parse(" with [comp],", parse) : "";
		Text.Add("At some point the naga literally fucked you unconscious. You awaken[c] sore and drained", parse);
		if(grown) {
			Text.Add(". Inspecting yourself and your possessions, you find that the dose of venom you received seems to have had permanent effects: your flagging [multiCockDesc] [hasHave] grown ", parse);
			if(len)
				Text.Add("an inch longer", parse);
			if(len && thk)
				Text.Add(" and ", parse);
			if(thk)
				Text.Add("slightly thicker", parse);
			Text.Add("! You are otherwise unharmed.", parse);
		}
		else {
			Text.Add(", but otherwise unharmed. The effects of the naga’s venom seems to have worn off, your [multiCockDesc] shrinking down to [itsTheir] previous size; still huge, but not as ridiculous as before.", parse);
		}
		Text.Flush();
		
		world.TimeStep({hour: 1});
		
		Gui.NextPrompt(enc.finalize);
	});
}

//TODO
Scenes.Naga.DesertWinPrompt = function() {
	var enc  = this;
	var naga = enc.naga;
	SetGameState(GameState.Event);
	
	var parse = {
		
	};
	
	enc.finalize = function() {
		Encounter.prototype.onVictory.call(enc);
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Flush();
	
	//TODO
	Gui.NextPrompt(enc.finalize);
}
