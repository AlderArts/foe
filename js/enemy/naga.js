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
	if(Math.random() < 0.1)
	    this.Butt().virgin = false;
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

world.loc.Desert.Drylands.enc.AddEnc(function() {
	var enemy = new Party();
	var enc = new Encounter(enemy);
	
	enc.naga = new Naga();
	
	enemy.AddMember(enc.naga);
	
	enc.onEncounter = Scenes.Naga.DesertEncounter;
	enc.onLoss      = Scenes.Naga.DesertLoss;
	// TODO activate win scene
	//enc.onVictory   = Scenes.Naga.DesertWinPrompt;
	
	return enc;
}, 1.0);

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
	Text.Add("<i>“You went and tired yourself out! I told you it would be easier if you didn’t resist. Don’t worry though, I won’t hurt you… much...”</i> the naga says with a lusty chuckle as she slithers toward your prone form[c]. Your eyes are drawn to her crotch and impressive genitals. Her pulsating pair of enormous cocks throb and her reptilian slit oozes, its juices dripping to the sand. She coils her tail around you and squeezes just tightly enough to avoid hurting you as she lifts you off the ground, raising your face to hers.", parse);
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
	
	if(player.FirstVag() && player.LowerBodyType() != LowerBodyType.Single) {
		Scenes.Naga.DesertLossGetDPd(enc);
	}
	else {
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
	
	Text.Add("Still wrapped tightly within the naga’s coils, you feel your body being turned upside-down. Her upper shaft brushes against the side of your face, and instinctively your lips part and you wrap your hands around the thick erection presented to you, guiding the head into your welcoming mouth. You do your best to coat it in saliva, knowing that your only task is to prepare it for the main course to come.", parse);
	Text.NL();
	Text.Add("Your serpentine mistress takes hold of your legs with her hands, spreading them as she lifts your [vagDesc] to her lips. She takes a few exploratory licks inside, using some of her tongue’s excess length to prod your [clitDesc] for good measure. You moan as her slim tongue pleasures and tickles at your vaginal walls, managing to find all of your most sensitive places.", parse);
	Text.NL();
	Text.Add("Satisfied that your [vagDesc] is soaked with your own secretions, she pulls away, simultaneously drawing her hips away and presenting you her lower member. You greedily welcome her second cock into your empty maw, slathering it in as much saliva as you can manage.", parse);
	Text.NL();
	Text.Add("The naga pulls you closer, and begins to probe around your [anusDesc] with her tongue. She spits on the entrance and pushes one of her fingers through to allow her thin tongue inside. The snake-tongue is drenched in drool, and you realize that the naga is pushing so much saliva into you that she could have filled your mouth several times over. You relax your [anusDesc] at the warmth and wetness inside you, and delight in the feeling of letting it coat and lubricate your passages.", parse);
	Text.NL();
	Text.Add("<i>“Alright, it’s time for the main course.”</i> You barely register your scaled lover’s words as she turns you upright and rests your back on her tail, before aligning you with her monstrous, saliva-slicked members. Your [breastDesc] are on full display, and the naga licks her lips, clearly enjoying the sight of your naked, subservient form.  Her hands find your hips as she draws her tail closer, bringing your [vagDesc] and [anusDesc] to rest against the heads of their partners. The heat from her genitals alone is enough to make you squirm and moan.", parse);
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
	
	Text.Add("<i>“Fuck, you’re so tight, pet. That’s alright, we’ll fix that.”</i> The naga flashes you a wicked grin, then presses her lips to yours. Her tongue slips in your mouth, and pleasant as it is to feel it swirling and wrapping around yours, it proves to be a fleeting distraction. Moments later the snake-lady thrusts her hips forward in a short but powerful motion, embedding the first three inches of her throbbing cocks inside you.", parse);
	Text.NL();
	Text.Add("Your scream of surprise and pleasure is muffled by the continuing kiss, but you swear you can feel the naga’s lips twist into more of a grin, even without breaking the lip-lock. The tongue inside your mouth slithers in deeper, now completely wrapped around your tongue and constricting it rhythmically. You feel the fingers on your hips grip tighter, and you know your mistress’ second thrust is coming. Steeling yourself as well as you can, you try to relax and let her in.", parse);
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
			Text.Add("Hot spunk lands wetly on your midriff, and you enjoy the sensation almost as much as much as the orgasm itself. ", parse);
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
		Text.Add("The snake alternates between tweaking and softly biting your [nipsDesc] while dragging  her claw-like nails softly along your chest. Her scratching draws no blood, but does serve to further cement your current position as submissive prey.", parse);
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
	Text.Add("<i>“Now that you’re warmed up, I can go again without worrying about breaking you.”</i> the naga laughs, smiling at you wickedly as she flips you over to lie face-down on her tail. You thought she was done after the ridiculous amount of cum she just shot, but it seems the snake’s reserves are quite deep. She lines up her still rock-hard cocks at the opposite holes of those they just penetrated, and now takes no time before inserting their heads into your [anusDesc] and [vagDesc].", parse);
	Text.NL();
	Text.Add("Your serpent-mistress gives your [buttDesc] a firm slap, the sound echoing who knows how far out into the desert, and begins your second reaming, immediately fucking you with smooth and powerful thrusts. Your insides once again feel that blissful fullness, and you moan as you receive another firm spank. The naga clutches at your asscheeks, playing with them as she did with your breasts. You close your eyes and begin to lose yourself once again to the pleasure, when suddenly you feel something in your mouth.", parse);
	Text.NL();
	Text.Add("The tip of the snake’s long tail is pushing its way into your mouth, pressing your tongue down and poking at the back of your throat. The naga forces a length of her tail into your throat and begins to slide it in and out in time with her cunt- and ass-destroyers. Effectively being triple penetrated now in this two-member gangbang, you lose control, your body shaking as another orgasm begins.", parse);
	Text.NL();
	
	var cum = player.OrgasmCum();
	
	Text.Add("You feel your [anusDesc] and [vagDesc]’s muscles spasm and clench, beginning to milk the enormous invaders for all they’re worth. You don’t want a cumbath this time, you want to be <b>filled</b> with your mistress’ seed. As she once again picks up the pace, thrusting fast and deep, hilting with an audible slap of flesh on flesh at the end of each, you feel the thick shafts inside you throb faster. The naga is close as well, and she kneads and slaps your [buttDesc] savagely between thrusts, clearly getting off even more on her dominance.", parse);
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
	Text.Add("You feel yourself lifting subtly, gently away from the section of tail supporting you as the naga’s orgasm finally runs its course. She gives you one last celebratory swat on the ass as she slides her prodigious peckers out of your orifices, and lowers you onto the soft sand below. <i>“That was fun, slut. Come again, any time...”</i> she says with a parting wink, before slithering away into the desert, leaving you naked and your savaged holes leaking cum.", parse);
	Text.NL();
	
	parse["c"] = party.Num() > 1 ? Text.Parse(" with [comp]", parse) : "";
	
	Text.Add("You pass out, waking hours later[c].", parse);
	Text.Flush();
	
	world.TimeStep({hour: 2});
	
	Gui.NextPrompt(enc.finalize);
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
