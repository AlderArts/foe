/*
 * 
 * Transformations namespace
 * 
 */

TF = {};

TF.Effect = {
	Unchanged : 0,
	Changed   : 1,
	Added     : 2,
	Removed   : 3
}

// Change of bodyparts, return if something was changed
TF.SetRaceOne = function(bodypart, race, ret) {
	ret = ret || {};
	var changed = TF.Effect.Unchanged;
	if(Array.isArray(bodypart)) {
		var list = [];
		for(var i = 0; i < bodypart.length; i++) {
			if(bodypart[i].race != race)
				list.push(bodypart[i]);
		}
		if(list.length > 0) {
			changed = TF.Effect.Changed;
			var idx = Rand(list.length);
			list[idx].race = race;
			ret.bodypart   = list[idx];
		}
	}
	else {
		changed       = (bodypart.race != race) ? TF.Effect.Changed : TF.Effect.Unchanged;
		bodypart.race = race;
		ret.bodypart  = bodypart;
	}
	return changed;
}

TF.SetRaceAll = function(bodypart, race) {
	var changed = TF.Effect.Unchanged;
	if(Array.isArray(bodypart)) {
		var list = [];
		for(var i = 0; i < bodypart.length; i++) {
			if(bodypart[i].race != race)
				list.push(bodypart[i]);
		}
		for(var i = 0; i < list.length; i++) {
			changed      = true;
			list[i].race = race;
		}
	}
	else {
		changed       = (bodypart.race != race) ? TF.Effect.Changed : TF.Effect.Unchanged;
		bodypart.race = race;
	}
	return changed;
}



// Will create a new appendage or replace an old one
TF.SetAppendage = function(slots, type, race, color, count) {
	count = count || 1;
	
	for(var i = 0; i < slots.length; i++) {
		var app = slots[i];
		if(app.type == type) {
			var changed    = 
			   ((app.race  != race)  || 
				(app.count != count) ||
				(app.color != color)) ? TF.Effect.Changed : TF.Effect.Unchanged;
			app.race  = race;
			app.color = color;
			app.count = count;
			return changed;
		}
	}
	// No app of correct type found, add new
	slots.push(new Appendage(type, race, color, count));
	
	return TF.Effect.Added;
}

TF.RemoveAppendage = function(slots, type, count) {
	count = count || 1;
	for(var i = 0; i < slots.length; i++) {
		var app = slots[i];
		if(app.type == type) {
			app.count -= count;
			if(app.count > 0)
				return TF.Effect.Changed;
			else {
				slots.remove(i);
				return TF.Effect.Removed;
			}
		}
	}
	return TF.Effect.Unchanged;
}

TF.SetBalls = function(balls, ideal, count) {
	count = count || 2;
	ideal = ideal || 2;
	
	var orig = balls.count.Get();
	var res = balls.count.IncreaseStat(ideal, count);
	if(res > 0) {
		if(orig == 0)
			return TF.Effect.Added;
		else
			return TF.Effect.Changed;
	}
	else
		return TF.Effect.Unchanged;
}

TF.RemBalls = function(balls, ideal, count) {
	count = count || 2;
	ideal = ideal || 2;
	
	var res = balls.count.DecreaseStat(ideal, count);
	if(res != 0) {
		if(balls.count.Get() == 0)
			return TF.Effect.Removed;
		else
			return TF.Effect.Changed;
	}
	else
		return TF.Effect.Unchanged;
}

/*
Race = {
	human  : 0,
	horse  : 1,
	cat    : 2,
	dog    : 3,
	fox    : 4,
	lizard : 5,
	rabbit : 6,
	demon  : 7,
	dragon : 8,
	dryad  : 9,
	elf    : 10,
	satyr  : 11,
	sheep  : 12,
	goat   : 13,
	cow    : 14,
	wolf   : 15
}
 */
function RaceScore(body) {
	this.score = [];
	// Init
	for(var race = 0; race < Race.numRaces; race++)
		this.score[race] = 0;
	
	this.len = 1;
	
	// If init values
	if(body)
	{
		// Generic attributes
		this.score[body.head.race]++;
		this.score[body.head.mouth.tongue.race]++;
		this.score[body.head.eyes.race]++;
		this.score[body.head.ears.race]++;
		this.score[body.torso.race]++;
		this.score[body.arms.race]++;
		this.score[body.legs.race]++;
		
		for(var i = 0; i < body.cock.length; i++)
			this.score[body.cock[i].race]++;
		if(body.balls.count.Get() > 0) this.score[body.balls.race]++;
		for(var i = 0; i < body.backSlots.length; i++)
			this.score[body.backSlots[i].race]++;
		for(var i = 0; i < body.head.appendages.length; i++)
			this.score[body.head.appendages[i].race]++;
		
		// Specific attributes
		// KNOT (CANID)
		for(var i = 0; i < body.cock.length; i++) {
			if(body.cock[i].knot) {
				this.score[Race.dog]++;
				this.score[Race.fox]++;
				this.score[Race.wolf]++;
			}
		}
		//IF 2 COCKS
		if(body.cock.length == 2) {
			this.score[Race.lizard]++;
		}
		
		// Human-ish looks
		if(body.arms.count == 2) this.score[Race.human] += 2;
		if(body.legs.count == 2) this.score[Race.human] += 2;
		
		this.len = 0;
		// EQUALIZE
		for(var race = 0; race < Race.numRaces; race++)
			this.len += Math.pow(this.score[race], 2);
		this.len = Math.sqrt(this.len);
	}
}

// Produces a value between 0 and 1 for how similar the vectors are
RaceScore.prototype.Compare = function(racescore) {
	var dot = 0;
	for(var race = 0; race < Race.numRaces; race++) {
		dot += this.score[race] * racescore.score[race];
	};
	// Euclidian dot product
	return dot / (this.len * racescore.len);
}

RaceScore.prototype.Sorted = function() {
	var copiedScore = [];
	var sorted = [];
	for(var i = 0; i < Race.numRaces; i++)
		copiedScore[i] = this.score[i];
	
	for(var num = 0; num < Race.numRaces; num++) {	
		var highest    = -1;
		var highestIdx =  0;
		for(var i = 0; i < Race.numRaces; i++) {
			if(copiedScore[i] > highest) {
				highest    = copiedScore[i];
				highestIdx = i;
			}
		}
		
		sorted[num] = highestIdx;
		copiedScore[highestIdx] = -1;
	}
	
	return sorted;
}

/*
 * TF ITEMS
 * 
 * 'this' is an Item
 */
function TFItem(id, name) {
	Item.call(this, id, name);
	this.Use     = TF.UseItem;
	this.useStr  = TF.UseItemDesc;
	this.effects = [];
	this.isTF    = true;
}
TFItem.prototype = new Item();
TFItem.prototype.constructor = TFItem;

TFItem.prototype.PushEffect = function(func, opts) {
	this.effects.push({ func: func, opts: opts});
}

TF.UseItem = function(target, suppressUse) {
	var changed = TF.Effect.Unchanged;
	if(!suppressUse && this.useStr)
		this.useStr(target);
	for(var i = 0; i < this.effects.length; i++) {
		var effect = this.effects[i];
		if(effect.func) {
			var ret = effect.func(target, effect.opts);
			if(ret != TF.Effect.Unchanged)
				changed = ret;
		}
	}
	return {consume: true, changed: changed};
}

TF.UseItemDesc = function(target) {
	var parse = { name: target.NameDesc(), s: target == player ? "" : "s", item: this.name };
	Text.Add("[name] chug[s] down a bottle of [item].", parse);
	Text.NL();
	Text.Flush();
}

TF.ItemEffects = {};

/* opts
 * 
 * .odds : 0..1
 * .race : Race.X
 * .str  : ex: "an equine cock"
 */

// odds, race, str
TF.ItemEffects.SetBody = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { Poss: target.Possessive(), str: opts.str };
	var odds    = opts.odds || 1;
	var body    = target.body.torso;
	if(Math.random() < odds) {
		changed = TF.SetRaceOne(body, opts.race);
		if(changed != TF.Effect.Unchanged) {
			Text.Add("[Poss] body turns into [str]!", parse);
			Text.NL();
		}
	}
	Text.Flush();
	return changed;
}

TF.ItemEffects.SetFace = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { Poss: target.Possessive(), str: opts.str };
	var odds    = opts.odds || 1;
	var head    = target.body.head;
	if(Math.random() < odds) {
		changed = TF.SetRaceOne(head, opts.race);
		if(changed != TF.Effect.Unchanged) {
			Text.Add("[Poss] face turns into [str]!", parse);
			Text.NL();
		}
	}
	Text.Flush();
	return changed;
}

// odds, race, str
TF.ItemEffects.SetArms = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { Poss: target.Possessive(), str: opts.str };
	var odds    = opts.odds || 1;
	var body    = target.body.arms;
	if(Math.random() < odds) {
		changed = TF.SetRaceOne(body, opts.race);
		if(changed != TF.Effect.Unchanged) {
			Text.Add("[Poss] arms turns into [str]!", parse);
			Text.NL();
		}
	}
	Text.Flush();
	return changed;
}

// odds, race, str, count
TF.ItemEffects.SetLegs = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { Poss: target.Possessive(), str: opts.str };
	var odds    = opts.odds || 1;
	var count   = opts.count || 2;
	var legs    = target.body.legs;
	if(legs.count >= 2 && Math.random() < odds) {
		changed = TF.SetRaceOne(legs, opts.race);
		if(changed != TF.Effect.Unchanged) {
			Text.Add("[Poss] legs turns into [str]!", parse);
			Text.NL();
		}
	}
	Text.Flush();
	return changed;
}

// odds, race, str
TF.ItemEffects.SetCock = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { poss: target.possessive(), Poss: target.Possessive(), str: opts.str };
	var odds    = opts.odds || 1;
	var cocks   = target.AllCocks();
	if(Math.random() < odds) {
		changed = TF.SetRaceOne(cocks, opts.race);
		if(changed != TF.Effect.Unchanged) {
			if(cocks.length > 1)
				Text.Add("One of [poss] cocks turns into [str]!", parse);
			else
				Text.Add("[Poss] cock turns into [str]!", parse);
			Text.NL();
		}
	}
	Text.Flush();
	return changed;
}

// odds, race, str
TF.ItemEffects.SetEars = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { Poss: target.Possessive(), str: opts.str };
	var odds    = opts.odds || 1;
	var ears    = target.Ears();
	if(Math.random() < odds) {
		changed = TF.SetRaceOne(ears, opts.race);
		if(changed != TF.Effect.Unchanged) {
			Text.Add("[Poss] ears turn into [str]!", parse);
			Text.NL();
		}
	}
	Text.Flush();
	return changed;
}

// odds, value, num
TF.ItemEffects.SetKnot = function(target, opts) {
	var parse = { Poss: target.Possessive(), poss: target.possessive() };
	var odds  = opts.odds || 1;
	var num   = opts.num || 1;
	var cocks = target.AllCocks();
	for(var i = 0; i < cocks.length; i++) {
		if(Math.random() < odds) {
			parse["cockDesc"] = cocks[i].Short();
			if(opts.value) {
				if(cocks[i].knot == 0) {
					cocks[i].knot = 1;
					Text.Add("[Poss] [cockDesc] grows a knot!", parse);
					Text.NL();
					num--;
				}
			}
			else {
				if(cocks[i].knot == 1) {
					cocks[i].knot = 0;
					Text.Add("The knot on [poss] [cockDesc] disappears!", parse);
					Text.NL();
					num--;
				}
			}
			if(num <= 0) break;
		}
	}
	Text.Flush();
}

// odds, value, num
TF.ItemEffects.SetSheath = function(target, opts) {
	var parse = { Poss: target.Possessive(), poss: target.possessive() };
	var odds  = opts.odds || 1;
	var num   = opts.num || 1;
	var cocks = target.AllCocks();
	for(var i = 0; i < cocks.length; i++) {
		if(Math.random() < odds) {
			parse["cockDesc"] = cocks[i].Short();
			if(opts.value) {
				if(cocks[i].sheath == 0) {
					cocks[i].sheath = 1;
					Text.Add("[Poss] [cockDesc] grows a sheath!", parse);
					Text.NL();
					num--;
				}
			}
			else {
				if(cocks[i].sheath == 1) {
					cocks[i].sheath = 0;
					Text.Add("The sheath protecting [poss] [cockDesc] disappears!", parse);
					Text.NL();
					num--;
				}
			}
			if(num <= 0) break;
		}
	}
	Text.Flush();
}

// odds, race, str, color
TF.ItemEffects.SetTail = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { name: target.NameDesc(), Poss: target.Possessive(), s: target == player ? "" : "s", str: opts.str };
	
	var odds    = opts.odds || 1;
	if(Math.random() < odds) {
		changed = TF.SetAppendage(target.Back(), AppendageType.tail, opts.race, opts.color);
		switch(changed) {
			case TF.Effect.Changed:
				Text.Add("[Poss] tail changes, turning into [str]!", parse);
				Text.NL();
				break;
			case TF.Effect.Added:
				Text.Add("[name] suddenly grow[s] [str]!", parse);
				Text.NL();
				break;
		}
	}
	Text.Flush();
	return changed;
}

// odds, count
TF.ItemEffects.RemTail = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { name: target.NameDesc(), Poss: target.Possessive(), count: Text.NumToText(opts.count), hisher: target.hisher() };
	var odds    = opts.odds || 1;
	if(Math.random() < odds) {
		changed = TF.RemoveAppendage(target.Back(), AppendageType.tail, opts.count);
		switch(changed) {
			case TF.Effect.Changed:
				Text.Add("[name] lose [count] of [hisher] tails!", parse);
				Text.NL();
				break;
			case TF.Effect.Removed:
				Text.Add("[name] lose all trace of [hisher] tail!", parse);
				Text.NL();
				break;
		}
	}
	Text.Flush();
	return changed;
}

// odds, race, str, color, count
TF.ItemEffects.SetHorn = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { name: target.NameDesc(), Poss: target.Possessive(), s: target == player ? "" : "s", str: opts.str };
	
	var odds    = opts.odds || 1;
	if(Math.random() < odds) {
		changed = TF.SetAppendage(target.Appendages(), AppendageType.horn, opts.race, opts.color, opts.count);
		switch(changed) {
			case TF.Effect.Changed:
				Text.Add("[Poss] horns change, turning into [str]!", parse);
				Text.NL();
				break;
			case TF.Effect.Added:
				Text.Add("[name] suddenly grow[s] [str]!", parse);
				Text.NL();
				break;
		}
	}
	Text.Flush();
	return changed;
}

// odds, count
TF.ItemEffects.RemHorn = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { name: target.NameDesc(), Poss: target.Possessive(), count: Text.NumToText(opts.count), hisher: target.hisher() };
	var odds    = opts.odds || 1;
	if(Math.random() < odds) {
		changed = TF.RemoveAppendage(target.Appendages(), AppendageType.horn, opts.count);
		switch(changed) {
			case TF.Effect.Changed:
				Text.Add("[name] lose [count] of [hisher] horns!", parse);
				Text.NL();
				break;
			case TF.Effect.Removed:
				Text.Add("[name] lose all trace of [hisher] horns!", parse);
				Text.NL();
				break;
		}
	}
	Text.Flush();
	return changed;
}

// odds, race, str, color, count
TF.ItemEffects.SetAntenna = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { name: target.NameDesc(), Poss: target.Possessive(), s: target == player ? "" : "s", str: opts.str };
	
	var odds    = opts.odds  || 1;
	var count   = opts.count || 2;
	if(Math.random() < odds) {
		changed = TF.SetAppendage(target.Appendages(), AppendageType.antenna, opts.race, opts.color, count);
		switch(changed) {
			case TF.Effect.Changed:
				Text.Add("[Poss] antenna change, turning into [str]!", parse);
				Text.NL();
				break;
			case TF.Effect.Added:
				Text.Add("[name] suddenly grow[s] [str]!", parse);
				Text.NL();
				break;
		}
	}
	Text.Flush();
	return changed;
}

// odds, count
TF.ItemEffects.RemAntenna = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { name: target.NameDesc(), Poss: target.Possessive(), count: Text.NumToText(opts.count), hisher: target.hisher() };
	var odds    = opts.odds || 1;
	if(Math.random() < odds) {
		changed = TF.RemoveAppendage(target.Appendages(), AppendageType.antenna, opts.count);
		switch(changed) {
			case TF.Effect.Changed:
				Text.Add("[name] lose [count] of [hisher] antenna!", parse);
				Text.NL();
				break;
			case TF.Effect.Removed:
				Text.Add("[name] lose all trace of [hisher] antenna!", parse);
				Text.NL();
				break;
		}
	}
	Text.Flush();
	return changed;
}

// odds, race, str, color, count
TF.ItemEffects.SetWings = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { name: target.NameDesc(), Poss: target.Possessive(), s: target == player ? "" : "s", str: opts.str };
	
	var odds    = opts.odds  || 1;
	var count   = opts.count || 2;
	if(Math.random() < odds) {
		changed = TF.SetAppendage(target.Back(), AppendageType.wing, opts.race, opts.color, count);
		switch(changed) {
			case TF.Effect.Changed:
				Text.Add("[Poss] wings change, turning into [str]!", parse);
				Text.NL();
				break;
			case TF.Effect.Added:
				Text.Add("[name] suddenly grow[s] [str]!", parse);
				Text.NL();
				break;
		}
	}
	Text.Flush();
	return changed;
}

// odds, count
TF.ItemEffects.RemWings = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { name: target.NameDesc(), Poss: target.Possessive(), count: Text.NumToText(opts.count), hisher: target.hisher() };
	var odds    = opts.odds || 1;
	if(Math.random() < odds) {
		changed = TF.RemoveAppendage(target.Back(), AppendageType.wing, opts.count);
		switch(changed) {
			case TF.Effect.Changed:
				Text.Add("[name] lose [count] of [hisher] wings!", parse);
				Text.NL();
				break;
			case TF.Effect.Removed:
				Text.Add("[name] lose all trace of [hisher] wings!", parse);
				Text.NL();
				break;
		}
	}
	Text.Flush();
	return changed;
}

// odds, race, color, ideal, count
TF.ItemEffects.SetBalls = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { name: target.NameDesc(), s: target == player ? "" : "s", count: Text.NumToText(opts.count), ballsDesc: function() { return target.BallsDesc(); } };
	var odds    = opts.odds  || 1;
	var count   = opts.count || 2;
	if(Math.random() < odds) {
		changed = TF.SetBalls(target.body.balls, opts.ideal, count);
		switch(changed) {
			case TF.Effect.Changed:
				Text.Add("[name] grow[s] an extra [count] testicles!", parse);
				Text.NL();
				break;
			case TF.Effect.Added:
				Text.Add("[name] suddenly grow[s] a [ballsDesc]!", parse);
				Text.NL();
				break;
		}
	}
	Text.Flush();
	return changed;
}

// odds, ideal, count
TF.ItemEffects.RemBalls = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { name: target.NameDesc(), count: Text.NumToText(opts.count), hisher: target.hisher(), ballsDesc: target.BallsDesc() };
	var odds    = opts.odds || 1;
	if(Math.random() < odds) {
		changed = TF.RemoveAppendage(target.body.balls, opts.ideal, opts.count);
		switch(changed) {
			case TF.Effect.Changed:
				Text.Add("[name] lose [count] of [hisher] testicles!", parse);
				Text.NL();
				break;
			case TF.Effect.Removed:
				Text.Add("[name] lose all trace of [hisher] [ballsDesc]!", parse);
				Text.NL();
				break;
		}
	}
	Text.Flush();
	return changed;
}

// odds, ideal, max
TF.ItemEffects.SetIdealCockLen = function(target, opts) {
	var parse = { Poss: target.Possessive() };
	
	var odds  = opts.odds || 1;
	var cocks = target.AllCocks();
	for(var i = 0; i < cocks.length; i++) {
		if(Math.random() < odds) {
			var diff = cocks[i].length.IdealStat(opts.ideal, opts.max);
			if(diff) {
				Text.Add("[Poss] cock length changes " + diff + "cm.", parse);
				Text.NL();
				break;
			}
		}
	}
	Text.Flush();
}

// odds, ideal, max
TF.ItemEffects.SetIdealCockThk = function(target, opts) {
	var parse = { Poss: target.Possessive() };
	
	var odds  = opts.odds || 1;
	var cocks = target.AllCocks();
	for(var i = 0; i < cocks.length; i++) {
		if(Math.random() < odds) {
			var diff = cocks[i].thickness.IdealStat(opts.ideal, opts.max);
			if(diff) {
				Text.Add("[Poss] cock thickness changes " + diff + "cm.", parse);
				Text.NL();
				break;
			}
		}
	}
	Text.Flush();
}

// INC STATS

// odds, ideal, max
TF.ItemEffects.IncStr = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), is: target.is() };
		if(Math.random() < odds &&
	target.strength.IncreaseStat(opts.ideal, opts.max)) {
		Text.Add("[name] [is] suddenly a bit stronger!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, ideal, max
TF.ItemEffects.IncSta = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), is: target.is() };
		if(Math.random() < odds &&
	target.stamina.IncreaseStat(opts.ideal, opts.max)) {
		Text.Add("[name] [is] suddenly a bit tougher!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, ideal, max
TF.ItemEffects.IncDex = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), is: target.is() };
		if(Math.random() < odds &&
	target.dexterity.IncreaseStat(opts.ideal, opts.max)) {
		Text.Add("[name] [is] suddenly a bit swifter!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, ideal, max
TF.ItemEffects.IncInt = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), is: target.is() };
		if(Math.random() < odds &&
	target.intelligence.IncreaseStat(opts.ideal, opts.max)) {
		Text.Add("[name] [is] suddenly a bit smarter!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, ideal, max
TF.ItemEffects.IncSpi = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), is: target.is() };
		if(Math.random() < odds &&
	target.spirit.IncreaseStat(opts.ideal, opts.max)) {
		Text.Add("[name] [is] suddenly a bit more stoic!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, ideal, max
TF.ItemEffects.IncLib = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), is: target.is() };
		if(Math.random() < odds &&
	target.libido.IncreaseStat(opts.ideal, opts.max)) {
		Text.Add("[name] [is] suddenly a bit hornier!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, ideal, max
TF.ItemEffects.IncCha = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), is: target.is() };
		if(Math.random() < odds &&
	target.charisma.IncreaseStat(opts.ideal, opts.max)) {
		Text.Add("[name] [is] suddenly a bit more charming!", parse);
		Text.NL();
	}
	Text.Flush();
}

// DEC STATS

// odds, ideal, max
TF.ItemEffects.DecStr = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), is: target.is() };
		if(Math.random() < odds &&
	target.strength.DecreaseStat(opts.ideal, opts.max)) {
		Text.Add("[name] [is] suddenly a bit weaker!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, ideal, max
TF.ItemEffects.DecSta = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), is: target.is() };
		if(Math.random() < odds &&
	target.stamina.DecreaseStat(opts.ideal, opts.max)) {
		Text.Add("[name] [is] suddenly a bit less tough!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, ideal, max
TF.ItemEffects.DecDex = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), is: target.is() };
		if(Math.random() < odds &&
	target.dexterity.DecreaseStat(opts.ideal, opts.max)) {
		Text.Add("[name] [is] suddenly a bit clumsier!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, ideal, max
TF.ItemEffects.DecInt = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), is: target.is() };
		if(Math.random() < odds &&
	target.intelligence.DecreaseStat(opts.ideal, opts.max)) {
		Text.Add("[name] [is] suddenly a bit dumber!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, ideal, max
TF.ItemEffects.DecSpi = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), is: target.is() };
		if(Math.random() < odds &&
	target.spirit.DecreaseStat(opts.ideal, opts.max)) {
		Text.Add("[name] [is] suddenly a bit less stoic!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, ideal, max
TF.ItemEffects.DecLib = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), is: target.is() };
		if(Math.random() < odds &&
	target.libido.DecreaseStat(opts.ideal, opts.max)) {
		Text.Add("[name] [is] suddenly a bit more composed!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, ideal, max
TF.ItemEffects.DecCha = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), is: target.is() };
		if(Math.random() < odds &&
	target.charisma.DecreaseStat(opts.ideal, opts.max)) {
		Text.Add("[name] [is] suddenly a bit less charming!", parse);
		Text.NL();
	}
	Text.Flush();
}