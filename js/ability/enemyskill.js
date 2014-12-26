
Abilities.EnemySkill = {};

Abilities.EnemySkill.Sting = new AttackPhysical();
Abilities.EnemySkill.Sting.name = "Sting";
Abilities.EnemySkill.Sting.Short = function() { return "Tail attack with chance of poisoning the target."; }
Abilities.EnemySkill.Sting.cost = { hp: null, sp: 10, lp: null};
Abilities.EnemySkill.Sting.atkMod = 1.2;
Abilities.EnemySkill.Sting.hitMod = 0.8;
Abilities.EnemySkill.Sting.damageType.pPierce = 1;
Abilities.EnemySkill.Sting.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), y : caster.plural() ? "y" : "ies", s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("[name] read[y] [hisher] stinger, aiming it at [tName]!", parse);
	Text.Newline();
}
Abilities.EnemySkill.Sting.OnHit = function(encounter, caster, target, dmg) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : target.himher(), hisher : caster.hisher(), es : caster.plural() ? "" : "es", notS : caster.plural() ? "s" : "", tName : target.nameDesc() };
	
	Text.AddOutput("[name] sting[notS] [tName] for " + Text.BoldColor(dmg, "#800000") + " damage!", parse);
	Text.Newline();
}
Abilities.EnemySkill.Sting.TargetEffect = function(encounter, caster, target) {
	var parse = { target : target.NameDesc(), has : target.has(), s : target.plural() ? "" : "s" };
	if(Status.Venom(target, { hit : 0.6, turns : 3, turnsR : 3, str : 1, dmg : 0.15 })) {
		Text.AddOutput("[target] [has] been poisoned! ", parse);
	}
}

Abilities.EnemySkill.TSnare = new AttackPhysical();
Abilities.EnemySkill.TSnare.name = "T.Snare";
Abilities.EnemySkill.TSnare.Short = function() { return "Slows down the target and raises lust."; }
Abilities.EnemySkill.TSnare.cost = { hp: null, sp: 20, lp: null};
Abilities.EnemySkill.TSnare.damageType.pLust = 0.1;
Abilities.EnemySkill.TSnare.OnCast = function(encounter, caster, target) {
	var parse = { Caster : caster.NameDesc(), notS : caster.plural() ? "" : "s", hisher : caster.hisher(), target : target.nameDesc(), thimher : target.himher() };
	Text.AddOutput("[Caster] send[notS] [hisher] tentacles rushing toward [target], wrapping around [thimher]. ", parse);
}
Abilities.EnemySkill.TSnare.OnHit = function(encounter, caster, target, dmg) {
	var parse = { target : target.nameDesc(), thisher : target.hisher() };
	if(Status.Slow(target, { hit : 0.6, factor : 2, turns : 3, turnsR : 3 })) {
		Text.AddOutput("The tentacles successfully snare [target], restricting [thisher] movements!", parse);
	}
	Text.Newline();
}
Abilities.EnemySkill.TSnare.OnAbsorb = Abilities.EnemySkill.TSnare.OnHit;
Abilities.EnemySkill.TSnare.OnMiss = function(encounter, caster, target) {
	var parse = { Target : target.NameDesc(), tnotS : target.plural() ? "" : "s" };
	Text.AddOutput("[Target] only narrowly avoid[tnotS] getting caught by the vines!", parse);
	Text.Newline();
}

Abilities.EnemySkill.TSpray = new AttackPhysical();
Abilities.EnemySkill.TSpray.name = "T.Spray";
Abilities.EnemySkill.TSpray.Short = function() { return "Sprays the targets in sticky tentacle seed. Raises lust."; }
Abilities.EnemySkill.TSpray.cost = { hp: null, sp: 40, lp: null};
Abilities.EnemySkill.TSpray.damageType.pLust = 0.1;
Abilities.EnemySkill.TSpray.targetMode = TargetMode.Enemies;
Abilities.EnemySkill.TSpray.OnCast = function(encounter, caster, target) {
	var parse = { Caster : caster.NameDesc(), notEs : caster.plural() ? "" : "es", hisher : caster.hisher(), s : target.length > 1 ? "s" : "" };
	Text.AddOutput("[Caster] brandish[notEs] [hisher] tentacles, pointing them toward [hisher] foe[s]. In a great fountain, sticky strands of cum splatter from the cock-like tentacles!", parse);
	Text.Newline();
}
Abilities.EnemySkill.TSpray.OnHit = function(encounter, caster, target, dmg) {
	var parse = { Target : target.NameDesc(), tnotS : target.plural() ? "" : "s"};
	Text.AddOutput("[Target] take[tnotS] the full brunt of the spray, gaining a thick coating of tentacle spunk!", parse);
	Text.Newline();
	target.AddLustFraction(0.2);
}
Abilities.EnemySkill.TSpray.OnAbsorb = Abilities.EnemySkill.TSpray.OnHit;
Abilities.EnemySkill.TSpray.OnMiss = function(encounter, caster, target) {
	var parse = { Target : target.NameDesc(), tnotS : target.plural() ? "" : "s" };
	Text.AddOutput("[Target] manage[tnotS] to avoid getting hit by the blast!", parse);
	Text.Newline();
}

Abilities.EnemySkill.TVenom = new AttackPhysical();
Abilities.EnemySkill.TVenom.name = "T.Venom";
Abilities.EnemySkill.TVenom.Short = function() { return "Sprays one target in poisonous goop."; }
Abilities.EnemySkill.TVenom.cost = { hp: null, sp: 20, lp: null};
Abilities.EnemySkill.TVenom.hitMod = 0.8;
Abilities.EnemySkill.TVenom.damageType.pLust = 0.3;
Abilities.EnemySkill.TVenom.OnCast = function(encounter, caster, target) {
	var parse = { Caster : caster.NameDesc(), notS : caster.plural() ? "" : "s", hisher : caster.hisher(), target : target.nameDesc(), thimher : target.himher() };
	Text.AddOutput("[Caster] direct[notS] [hisher] tentacles toward [target], spraying a long gout of toxic goop toward [thimher]! ", parse);
}
Abilities.EnemySkill.TVenom.OnHit = function(encounter, caster, target, dmg) {
	var parse = { Target : target.NameDesc(), tnotS : target.plural() ? "" : "s", theshe : target.heshe() };
	
	Text.AddOutput("[Target] cough[tnotS] and sputter[tnotS] as [theshe] is hit by the poisonous liquid!", parse);
	Text.Newline();
}
Abilities.EnemySkill.TVenom.OnMiss = function(encounter, caster, target) {
	var parse = { Target : target.NameDesc(), tnotS : target.plural() ? "" : "s" };
	Text.AddOutput("[Target] narrowly avoid[tnotS] the blast, escaping unharmed!", parse);
	Text.Newline();
}
Abilities.EnemySkill.TVenom.TargetEffect = function(encounter, caster, target) {
	var parse = { target : target.NameDesc(), has : target.has(), s : target.plural() ? "" : "s" };
	if(Status.Venom(target, { hit : 0.6, turns : 3, turnsR : 3, str : 1, dmg : 0.15 })) {
		Text.AddOutput("[target] [has] been poisoned! ", parse);
	}
}

Abilities.EnemySkill.TRavage = new AttackPhysical();
Abilities.EnemySkill.TRavage.name = "T.Ravage";
Abilities.EnemySkill.TRavage.Short = function() { return "Grasps the enemy and constricts them, dealing damage and raising lust."; }
Abilities.EnemySkill.TRavage.cost = { hp: null, sp: 25, lp: null};
Abilities.EnemySkill.TRavage.damageType.pBlunt = 0.5;
Abilities.EnemySkill.TRavage.damageType.pLust = 0.5;
Abilities.EnemySkill.TRavage.OnCast = function(encounter, caster, target) {
	var parse = { Caster : caster.NameDesc(), notS : caster.plural() ? "" : "s", hisher : caster.hisher(), target : target.nameDesc(), thimher : target.himher() };
	Text.AddOutput("[Caster] send[notS] [hisher] tentacles rushing toward [target], aiming to catch [thimher]! ", parse);
}
Abilities.EnemySkill.TRavage.OnHit = function(encounter, caster, target, dmg) {
	var parse = { Target : target.NameDesc(), thisher : target.hisher(), theshe : target.heshe(), tyIes : target.plural() ? "y" : "ies", thimher : target.himher(), tpossessive : target.possessive(), tnotS : target.plural() ? "" : "s", possessive : caster.possessive() };
	Text.Add("[Target] can’t avoid the squirming mass of tentacles that quickly wrap around [thisher] body, and [theshe] cr[tyIes] out as the viny tendrils violate [thimher]. Somehow, the snakey tentacles manage to find their way past [tpossessive] defenses, ravaging [thimher]!", parse);
	Text.NL();
	Text.Add("[Target] only manage[tnotS] to barely break [possessive] hold on [thimher], but not before the tentacles have gotten real close and personal.", parse);
	Text.NL();
	Text.Add("[Target] take[tnotS] " + Text.BoldColor(dmg, "#800000") + " damage!", parse);
	Text.NL();
	Text.Flush();
	target.AddLustFraction(0.3);
}
Abilities.EnemySkill.TRavage.OnMiss = function(encounter, caster, target) {
	var parse = { target : target.nameDesc(), thimher : target.himher() };
	Text.AddOutput("The tentacles narrowly miss [target], merely grazing [thimher].", parse);
	Text.Newline();
}

Abilities.EnemySkill.TWhip = new AttackPhysical();
Abilities.EnemySkill.TWhip.name = "T.Whip";
Abilities.EnemySkill.TWhip.Short = function() { return "Standard attack. Whips target for blunt damage."; }
Abilities.EnemySkill.TWhip.cost = { hp: null, sp: null, lp: null};
Abilities.EnemySkill.TWhip.damageType.pBlunt = 1;
Abilities.EnemySkill.TWhip.damageType.pLust = 0.5;
Abilities.EnemySkill.TWhip.OnCast = function(encounter, caster, target) {
	var parse = { Caster : caster.NameDesc(), notEs : caster.plural() ? "" : "es", hisher : caster.hisher(), target : target.nameDesc() };
	Text.AddOutput("[Caster] thrash[notEs] out with [hisher] tentacles, slashing [target]! ", parse);
}
Abilities.EnemySkill.TWhip.OnHit = function(encounter, caster, target, dmg) {
	var parse = { Target : target.NameDesc(), tis : target.is(), tnotS : target.plural() ? "" : "s" };
	Text.AddOutput("[Target] [tis] unable to avoid the blow, and stagger[tnotS] back as it hits, dealing " + Text.BoldColor(dmg, "#800000") + " damage!", parse);
	Text.Newline();
	target.AddLustFraction(0.3);
}
Abilities.EnemySkill.TWhip.OnMiss = function(encounter, caster, target) {
	var parse = { target : target.nameDesc() };
	Text.AddOutput("The tentacles narrowly miss [target], hitting empty air!", parse);
	Text.Newline();
}

Abilities.EnemySkill.TViolate = new AttackPhysical();
Abilities.EnemySkill.TViolate.name = "T.Violate";
Abilities.EnemySkill.TViolate.Short = function() { return "Orchid's violate attack."; }
Abilities.EnemySkill.TViolate.cost = { hp: null, sp: null, lp: null};
Abilities.EnemySkill.TViolate.damageType.pBlunt = 0.5;
Abilities.EnemySkill.TViolate.damageType.pLust = 1;
Abilities.EnemySkill.TViolate.hitMod = 2;
Abilities.EnemySkill.TViolate.OnCast = function(encounter, caster, target) {
	var parse = { target : target.nameDesc() };
	Text.AddOutput("Orchid grins lewdly as she lashes out with her tentacles, aiming for [target]! ", parse);
}
Abilities.EnemySkill.TViolate.OnHit = function(encounter, caster, target, dmg) {
	var parse = { Target : target.NameDesc(), target : target.nameDesc(), tis : target.is(), tnotS : target.plural() ? "" : "s", thisher : target.hisher(), thimher : target.himher(), tpossessive : target.possessive(), tarmorDesc : target.ArmorDesc() };
	Text.Add("[Target] [tis] very aroused, and [thisher] reaction is dulled. The dryad laughs triumphantly as she strings [target] up in the air, her tentacles worming their way inside [tpossessive] [tarmorDesc]!", parse);
	Text.NL();
	if(target == player) {
		parse["vagDesc"]  = function() { return player.FirstVag().Short(); }
		parse["anusDesc"] = function() { return player.Butt().AnalShort(); }
		parse["vag"] = player.FirstVag() ? Text.Parse(" [vagDesc] and", parse) : "";
		Text.Add("You gasp as multiple plant-cocks press their way inside your[vag] [anusDesc]. A bad move it turns out, as additional ones shove their way inside your throat.", parse);
		Text.NL();
		
		if(player.FirstVag()) {
			Sex.Vaginal(orchid, player);
			player.FuckVag(player.FirstVag(), orchid.FirstCock(), 2);
			orchid.Fuck(orchid.FirstCock(), 2);
		}
		Sex.Anal(orchid, player);
		player.FuckAnal(player.Butt(), orchid.FirstCock(), 2);
		orchid.Fuck(orchid.FirstCock(), 2);
		
		Sex.Blowjob(player, orchid);
		player.FuckOral(player.Mouth(), orchid.FirstCock(), 2);
		orchid.Fuck(orchid.FirstCock(), 2);
		
		Text.NL();
		Text.Add("You groan as your body protests against the massive strain of a dozen tentacles violently raping your every hole. The intense pressure quickly pushes you over the edge, and you feel your energy drain even as Orchid pumps her seed into you.", parse);
	}
	else {
		Text.Add("You scamper to [tpossessive] aid, feebly trying to pull the tentacles away from [thimher], but the dryad is strong. [Target] gargles as [thisher] throat is violated, yet more tentacles seeking [thisher] crotch.", parse);
		Text.NL();
		Text.Add("[Target] climaxes loudly, struggling helplessly against the invasive tentacles. Orchid laughs as she pumps [target] full of her seed, making a mess of your companion.", parse);
	}
	Text.NL();
	Text.Add("<i>“That was merely a taste of what is to come,”</i> the corrupted dryad purrs as she discards [target] on the ground.", parse);
	Text.NL();
	
	var dmg = Math.floor(target.curLust);
	target.AddHPAbs(-dmg);
	
	Text.Add("[Target] take[tnotS] " + Text.BoldColor(dmg, "#800000") + " damage!", parse);
	Text.NL();
	
	Text.Flush();
	
	var cum = target.OrgasmCum();
}
Abilities.EnemySkill.TViolate.OnAbsorb = Abilities.EnemySkill.TViolate.OnHit;
Abilities.EnemySkill.TViolate.OnMiss = function(encounter, caster, target) {
	var parse = { target : target.nameDesc(), tis : target.is(), theshe : target.heshe(), tnotS : target.plural() ? "" : "s" };
	Text.AddOutput("Even though [target] [tis] greatly aroused, [theshe] somehow manage[tnotS] to evade getting tangled up in the tentacles.", parse);
	Text.Newline();
}

Abilities.EnemySkill.GolLustyPheromones = new TeaseSkill();
Abilities.EnemySkill.GolLustyPheromones.name = "L.Pheromones";
Abilities.EnemySkill.GolLustyPheromones.Short = function() { return "Attack with lusty pheromones."; }
Abilities.EnemySkill.GolLustyPheromones.OnCast = function(encounter, caster, target) {
	var parse = { Possessive : caster.Possessive(), name : caster.NameDesc(), heshe : caster.heshe(), himher : caster.himher(), hisher : caster.hisher(), y : caster.plural() ? "y" : "ies", s : caster.plural() ? "" : "s", tName : target.nameDesc() };
	Text.AddOutput("The Gol reaches down to just below the joint of her humanoid upper body and mantis-like lower form where an immense, juicy-looking pussy lies. She hooks her fingers into either side of it, panting at the sensation, and pulls it open, allowing you gaze into the simmering, pink depths. It's easily big enough to swallow your arm, but far more alarming is the scent it exudes - sweet and enticing.", parse);
	Text.Newline();
	caster.AddLustFraction(0.1);
}
Abilities.EnemySkill.GolLustyPheromones.OnHit = function(encounter, caster, target, dmg) {
	var parse = { notEs : caster.plural() ? "es" : "", Name : target.NameDesc(), hisher : target.hisher() };
	
	Text.AddOutput("[Name] blush[notEs] as [hisher] head swims with thoughts of naked trysts under the stars, overwhelmed by the Gol’s pheromones.", parse);
	Text.Newline();
}
Abilities.EnemySkill.GolLustyPheromones.OnMiss = function(encounter, caster, target) {
	var parse = { notS : caster.plural() ? "s" : "", Name : target.NameDesc(), hisher : target.hisher() };
	
	Text.AddOutput("[Name] hold[notS] [hisher] breath to avoid as much of it as possible. Frowning, the Gol releases her netherlips.", parse);
	Text.Newline();
}


Abilities.EnemySkill.GolCuntDash = new AttackPhysical();
Abilities.EnemySkill.GolCuntDash.name = "C.Dash";
Abilities.EnemySkill.GolCuntDash.Short = function() { return "Cunt dash!"; }
Abilities.EnemySkill.GolCuntDash.cost = { hp: null, sp: 50, lp: null};
Abilities.EnemySkill.GolCuntDash.atkMod = 1.3;
Abilities.EnemySkill.GolCuntDash.hitMod = 0.8;
Abilities.EnemySkill.GolCuntDash.damageType.pBlunt = 1;
Abilities.EnemySkill.GolCuntDash.damageType.pLust = 0.5;
Abilities.EnemySkill.GolCuntDash.OnCast = function(encounter, caster, target) {
	var parse = { name : target.nameDesc() };
	Text.AddOutput("Without warning, the Gol launches herself forward, legs clattering as she approaches [name] with blinding speed. ", parse);
	
	caster.AddLustFraction(0.1);
}
Abilities.EnemySkill.GolCuntDash.OnHit = function(encounter, caster, target, dmg) {
	var parse = { Name : target.NameDesc(), name : target.nameDesc(), notS : target.plural() ? "s" : "", poss : target.possessive() };
	parse = target.ParserPronouns(parse);
	
	Text.AddOutput("[Name] react[notS] a little too late to dive out the way, but [heshe] manage[notS] to duck low in an attempt to slip under her scythes… just not low enough. Her oncoming crotch and abdomen smack into [name], and her fragrant pussy drags across [poss] face and slimes it with a thick coat of her vaginal juices. The chitin of her underbelly is quite soft on [poss] cheek, almost like a pleasant caress.", parse);
	Text.Newline();
	Text.AddOutput("The Gol queen bashes [name] for " + Text.BoldColor(dmg, "#800000") + " damage, staggering [himher]!", parse);
	Text.Newline();
	Text.AddOutput("When she finishes charging past, [name] blink[notS] in a daze and stagger to [hisher] feet, uncomfortably warm in all the wrong places.", parse);
	Text.Newline();
}
Abilities.EnemySkill.GolCuntDash.OnMiss = function(encounter, caster, target) {
	var parse = { himher : target.himher(), notEs : target.plural() ? "" : "es", Name : target.NameDesc() };
	
	Text.AddOutput("[Name] barely toss[notEs] [himher]self out of the way in time!", parse);
	Text.Newline();
}


Abilities.EnemySkill.GolPollen = new AttackPhysical();
Abilities.EnemySkill.GolPollen.name = "S.Pollen";
Abilities.EnemySkill.GolPollen.Short = function() { return "Submission pollen."; }
Abilities.EnemySkill.GolPollen.cost = { hp: null, sp: null, lp: 250 };
Abilities.EnemySkill.GolPollen.atkMod = 0;
Abilities.EnemySkill.GolPollen.hitMod = 0.8;
Abilities.EnemySkill.GolPollen.targetMode = TargetMode.Enemies;
Abilities.EnemySkill.GolPollen.OnCast = function(encounter, caster, target) {
	var parse = {};
	Text.AddOutput("Sighing, the Gol runs her hands through her shimmering black hair in frustration. After her fingers' first pass, she repeats the action, then does it again. And again. Soon the air around her seems slightly foggy, and your nose itches. A sneeze wracks your body as she continues the motion, filling the air with... something. You can't say what, but it's making you sneeze, and causing your nose to get itchy and irritable. The insectile beauty seems taller and more imposing after each involuntary spasm of your body. Her breasts appear larger, her pussy more inviting, and her face more charmingly human. For a monster, she wouldn't be a bad one to settle down with.", parse);
	Text.Newline();
}
Abilities.EnemySkill.GolPollen.OnHit = function(encounter, caster, target) {
	var parse = { Name : target.NameDesc(), is : target.is() };
	target.AddLustFraction(0.2);
	
	if(Status.Slow(target, { hit : 0.6, factor : 2, turns : 1, turnsR : 3 })) {
		Text.AddOutput("[Name] [is] slowed! ", parse);
	}
	if(Status.Horny(target, { hit : 0.6, str : 1, dmg : 0.1, turns : 1, turnsR : 3 })) {
		Text.Newline();
		Text.AddOutput("[Name] [is] horny! ", parse);
	}
	if(Status.Sleep(target, { hit : 0.5, turns : 1, turnsR : 3 })) {
		Text.Newline();
		Text.AddOutput("[Name] [is] drowsy! ", parse);
	}
	if(Status.Confuse(target, { hit : 0.3, turns : 1, turnsR : 3 })) {
		Text.Newline();
		Text.AddOutput("[Name] [is] confused! ", parse);
	}
}
Abilities.EnemySkill.GolPollen.OnMiss = null;
