
let NurseryScenes = {};

function Nursery(storage) {
	this.kids = [];
	this.flags = {};
	
	this.flags["Met"] = Nursery.Met.NotVisited;
	
	if(storage) this.FromStorage(storage);
}
Nursery.Met = {
	NotVisited : 0,
	Visited    : 1
};

Nursery.prototype.ToStorage = function() {
	var storage = {};
	if(this.TotalKids() > 0) {
		var kids = [];
		_.each(this.kids, function(kid) {
			kids.push(kid.ToStorage());
		});
		storage.kids = kids;
	}
	var flags = {};
	for(var flag in this.flags) {
		if(this.flags[flag] != 0)
			flags[flag] = this.flags[flag];
	}
	storage.flags = flags;
	
	return storage;
}

Nursery.prototype.FromStorage = function(storage) {
	var that = this;
	storage = storage || {};
	var kids = storage.kids;
	_.each(kids, function(kid) {
		var k = new Nursery.Kid(kid);
		that.kids.push(k);
	});
	for(var flag in storage.flags)
		this.flags[flag] = parseInt(storage.flags[flag]);
}

Nursery.prototype.BirthedBy = function(mother) {
	var ret = [];
	_.each(this.kids, function(kid) {
		if(kid.mother == mother) ret.push(kid);
	});
	return ret;
}
Nursery.prototype.FatheredBy = function(father) {
	var ret = [];
	_.each(this.kids, function(kid) {
		if(kid.father == father) ret.push(kid);
	});
	return ret;
}
Nursery.prototype.TotalKids = function(person) {
	if(person) {
		var num = 0;
		_.each(this.BirthedBy(person), function(kid) {
			num += kid.num;
		});
		_.each(this.FatheredBy(person), function(kid) {
			num += kid.num;
		});
		return num;
	}
	//Default to all
	var num = 0;
	_.each(this.kids, function(kid) {
		num += kid.num;
	});
	return num;
}

Nursery.prototype.AddKid = function(newkid) {
	if(!newkid) return; //Shouldn't happen
	
	var found = false;
	_.each(this.kids, function(kid) {
		if(kid.SameType(newkid)) {
			kid.num += newkid.num;
			found = true;
			return false;
		}
	});
	
	if(!found)
		this.kids.push(newkid);
}


Nursery.Kid = function(storage) {
	this.mother = null;
	this.father = null;
	this.num    = 1;
	this.race   = Race.Human;
	
	if(storage) this.FromStorage(storage);
}

Nursery.Kid.prototype.ToStorage = function() {
	var storage = {};
	if(this.mother) storage.m  = this.mother;
	if(this.father) storage.f  = this.father;
	if(this.num)    storage.nr = this.num.toFixed();
	if(this.race != Race.Human) storage.r = this.race.id.toFixed();
	return storage;
}

Nursery.Kid.prototype.FromStorage = function(storage) {
	storage = storage || {};
	if(storage.m)  this.mother = storage.m;
	if(storage.f)  this.father = storage.f;
	if(storage.nr) this.num    = parseInt(storage.nr);
	this.race = (storage.r === undefined) ? this.race : RaceDesc.IdToRace[parseInt(storage.r)];
}

Nursery.Kid.prototype.SameType = function(kid) {
	if(kid.mother != this.mother) return false;
	if(kid.father != this.father) return false;
	if(kid.race   != this.race)   return false;
	return true;
}

NurseryScenes.PrintPCbirthed = function() {
	var kids = nursery.BirthedBy(player.ID);
	
	var parse = {};
	
	var num = 0;
	if(kids.length > 0) {
		Text.Add("<b>You’ve given birth to:</b>", parse);
		Text.NL();
		_.each(kids, function(kid) {
			parse["Num"]  = _.capitalize(Text.NumToText(kid.num));
			parse["ren"]  = kid.num > 1 ? "ren" : "";
			parse["race"] = kid.race.qShort()
			Text.Add("[Num] [race] child[ren]", parse);
			var father = Entity.IdToEntity(kid.father);
			if(father) {
				Text.Add(", fathered by " + father.name);
			}
			Text.Add(".<br>", parse);
			num += kid.num;
		});
		parse["number"] = Text.NumToText(num);
		parse["ren"]    = num > 1 ? "ren" : "";
		Text.Add("<br>For a total of [number] child[ren].", parse);
		Text.NL();
	}
}

NurseryScenes.PrintPCfathered = function() {
	var kids = nursery.FatheredBy(player.ID);
	
	var num = 0;
	if(kids.length > 0) {
		Text.Add("<b>You’ve fathered:</b>", parse);
		Text.NL();
		_.each(kids, function(kid) {
			parse["Num"]  = _.capitalize(Text.NumToText(kid.num));
			parse["ren"]  = kid.num > 1 ? "ren" : "";
			parse["race"] = kid.race.qShort()
			Text.Add("[Num] [race] child[ren]", parse);
			var mother = Entity.IdToEntity(kid.mother);
			if(mother) {
				Text.Add(", birthed by " + mother.name);
			}
			Text.Add(".<br>", parse);
			num += kid.num;
		});
		parse["number"] = Text.NumToText(num);
		parse["ren"]    = num > 1 ? "ren" : "";
		Text.Add("<br>For a total of [number] child[ren].", parse);
		Text.NL();
	}
}

NurseryScenes.CareBlock = function(womb) {
	var parse = {
		
	};
	
	var num  = womb.litterSize;
	var race = womb.race;
	var egg  = womb.IsEgg();
	
	parse = Text.ParserPlural(parse, num > 1);
	parse["infant"] = egg ? "egg" : "infant";
	parse["ren"]    = num > 1 ? "ren" : "";
	
	var father = Entity.IdToEntity(womb.father);
	var mother = Entity.IdToEntity(womb.mother);
	
	var PCmother = mother == player;
	var PCfather = father == player;
	var yours = PCmother || PCfather;
	parse["your"] = yours ? "your" : "the";
	
	if(!Scenes.Global.PortalsOpen()) { // ACT 1
		
		var first = nursery.flags["Met"] < Nursery.Met.Visited;
		if(nursery.flags["Met"] < Nursery.Met.Visited)
			nursery.flags["Met"] = Nursery.Met.Visited;
		
		var atNomads = party.location == world.loc.Plains.Nomads.Tent;
		party.location = world.loc.Plains.Nomads.Fireplace;
		
		if(first) {
			if(yours) {
				parse["mother"] = PCmother ? "mother" : "father";
				Text.Add("While the fact that you’re a new [mother] now is great,", parse);
			}
			else {
				Text.Add("While having a kid or two running around after you would be great,", parse);
			}
			Text.Add(" the fact that you do have a pressing task at hand isn’t lost on you. You can’t quite go around doing all sorts of dangerous things with an [infant] in tow, and it would make you feel safer to know that if you <i>do</i> have to be out there, at least [your] children will be cared for in your absence.", parse);
			Text.NL();
			Text.Add("Well. The nomads took you in when you first crash-landed on Eden; maybe they’ll have an idea of what to do. They do seem to have a habit of taking in odds and ends, to put it lightly, if there’s any group of people who has a grasp on such situations, it’ll be them.", parse);
			Text.NL();
			Text.Add("With that thought in mind, you ", parse);
			if(atNomads) {
				Text.Add("stick your head out of the tent and start looking around for the Chief.", parse);
			}
			else {
				Text.Add("prepare to make the journey back to the nomads’ camp. Thankfully, it’s not too far away from where you are - a few hours’ travel at worst - and once there, you waste no time in looking for the nomad chief.", parse);
				
				world.TimeStep({hour: 4});
			}
			Text.NL();
			Text.Add("The wrinkled old man is in his usual spot by the fire, his long pipe smoking away, and looks up at you as you approach. His eyes widen a little as he takes in the newborn [infant][s] in your arms, but the mood soon passes and he settles back into his usual grumpy, taciturn self.", parse);
			Text.NL();
			if(player.Gender() == Gender.male) {
				parse["k"] = num > 1 ? "some kids" : "a kid";
				Text.Add("<i>“So,”</i> he says at last. <i>“You went and found some girlie and knocked her up, and now you got [k] on your hands? I suppose you want me to do something about it?”</i>", parse);
			}
			else { //Female
				Text.Add("<i>“So,”</i> he says at last. <i>“You went and got yourself knocked up - well, either that, or something went and knocked you up. Same difference, really. And now that it’s run its course, I suppose you want me to do something about it?”</i>", parse);
			}
			Text.NL();

			var itsComplicated = !yours || (PCfather && player.FirstVag());

			if(itsComplicated) //#if not yours, or (you are a herm and the father)
				Text.Add("Well… technically not the case, but you don’t think you need to worry him about the details. You still need to take care of them, so you decide to just play along for now. Nodding, you confirm his suspicions, wondering how he knew.", parse);
			else
				Text.Add("Why, how did he guess?", parse);
			Text.NL();
			Text.Add("<i>“Hardly anyone ever comes over to just pay their respects these days,”</i> the Chief replies blandly, then sighs, exhaling a large cloud of blue smoke in the process. <i>“All right, then. Little tyke’s not at fault for whatever else goes on in the world. We’ve got a couple of nursemaids who watch the children while those who can’t be doing so themselves are out and about on their day. You can feel free to leave your kids with them at the nursery for the time being.”</i>", parse);
			Text.NL();
			Text.Add("Hey, that’s pretty nice of him. Thanks.", parse);
			Text.NL();
			Text.Add("The Chief shakes his head slowly. <i>“Why do I get the feeling that I’ve just invited you to start popping out as many kids as you can and fill up our nursery to bursting?”</i>", parse);
			Text.NL();
			Text.Add("Surely he must be mistaken. You’re not going to be so irresponsible… are you? It’s not as if you’re a crazed goblin out to populate the world with her ever-growing brood, right?", parse);
			Text.NL();
			parse["l"] = player.HasLegs() ? "" : "... figuratively speaking";
			Text.Add("<i>“Hmph.”</i> The Chief waves you off. <i>“I’ll say it from experience, though - a camp like this is no place to be raised as a youngling. I get the feeling that you ought to, and probably will, get better accommodation for any more kids you have in the future - either that, or keep your legs shut[l]. Your choice, kiddo. Let’s just understand that this is a strictly temporary arrangement, all right? I expect you to take them away once you have somewhere better for them to be raised.</i>", parse);
			Text.NL();
			Text.Add("<i>“Now, if there’s nothing else, I’d like to be able to enjoy the rest of my smoke in peace, please.”</i>", parse);
			Text.NL();
			parse["k"] = yours ? "your offspring" : Text.Parse("the newborn[s]", parse);
			Text.Add("Oh, all right. Leaving the chief behind to brood with his pipe, you head down to the nursery he indicated and briefly introduce yourself to the nursemaids running the place. The harried women take to the idea with about as much enthusiasm as the chief had, but they don’t shirk their duty, either, and accept [k] into their care.There’s a twinge of sadness at seeing them go like this, but it’s better than the alternative.", parse);
		}
		else {
			parse["loc"] = atNomads ? "" : " make the trip back to the nomads’ camp and";
			parse["k"] = yours ? "your offspring" : "them";
			Text.Add("With [your] newborn[s] in tow, you[loc] head out to the nursery, where you hand the [infant][s] to one of the many nursemaids in that section of camp. There’s a twinge of sadness at seeing [k] go like this, but it’s better than the alternative.", parse);
		}
		Text.NL();
		Text.Add("You may have to leave now, but you’ll probably want to come back and visit sometime later.", parse);
	}
	else { //TODO ACT 2
		parse["nc"] = "Moira"; //TODO
		Text.Add("Focusing on your gemstone, you summon a brief burst of power just like [nc] showed you - a brief flash of violet light illuminates the air, and then [your] child[ren] are gone, brought to the nursery in the gemstead where [caretaker] will handle matters from there.", parse);
		Text.NL();
		Text.Add("Well, you’ll be able to visit the nursery at your own leisure, so you probably should stop feeling so guilty now…", parse);
	}
	
	// Add to nursery
	var kid = new Nursery.Kid();
	kid.mother = womb.mother;
	kid.father = womb.father;
	kid.num    = num;
	kid.race   = race;
	
	nursery.AddKid(kid);
	
	Text.Flush();
	Gui.NextPrompt();
}

// Pre gemstead (only available if actually you have kids, and only in act 1)
NurseryScenes.Nomads = function() {
	var num = nursery.TotalKids();
	var parse = {
		ren   : num > 1 ? "ren" : "",
		isAre : num > 1 ? "are" : "is"
	};
	
	party.location = world.loc.Plains.Nomads.Nursery;
	
	Text.Clear();
	Text.Add("Since you’re at the nomads’, you decide to take a moment and visit the child[ren]. It’s but a brief stroll to the nursery, a small group of sturdy tents where a number of matronly-looking women are caring for the camp’s younglings.", parse);
	if(num >= 5)
		Text.Add(" Some of them shoot you exasperated looks at your arrival, but quickly manage to rein it in after realizing that you’re not here to drop off yet another squalling infant for them to care for.", parse);
	Text.NL();
	Text.Add("At length, one of them shows you over to where your child[ren] [isAre], and you sigh, relax a little, and take stock of your offspring.", parse);
	Text.NL();
	
	NurseryScenes.PrintPCbirthed();
	NurseryScenes.PrintPCfathered();
	
	Text.Add("What will you do now?", parse);
	Text.Flush();
	
	//[name]
	var options = new Array();
	/* TODO Interactions
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
		party.location = world.loc.Plains.Nomads.Fireplace;
		PrintDefaultOptions();
	});
}

// TODO Post gemstead

export { Nursery, NurseryScenes };
