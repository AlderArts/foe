/*
 * 
 * Transformations namespace
 * 
 */

import { Item, ItemType } from './item';

let TF = {};

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
	if(!_.isNumber(count))
		count = 1;
	
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
	var all = false;
	if(count < 0)
		all = true;
	else if(!_.isNumber(count))
		count = 1;
	
	for(var i = 0; i < slots.length; i++) {
		var app = slots[i];
		if(app.type == type) {
			if(all)
				app.count = 0;
			else
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
	ideal = ideal || 0;
	
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
 * TF ITEMS
 * 
 * 'this' is an Item
 */
function TFItem(id, name) {
	Item.call(this, id, name, ItemType.Potion);
	this.Use     = TF.UseItem;
	this.useStr  = TF.UseItemDesc;
	this.effects = [];
	this.isTF    = true;
}
TFItem.prototype = new Item("_tf");
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

TF.ItemEffects.SetTongue = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { Poss: target.Possessive(), str: opts.str };
	var odds    = opts.odds || 1;
	var head    = target.body.head;
	if(Math.random() < odds) {
		changed = TF.SetRaceOne(head.mouth.tongue, opts.race);
		if(changed != TF.Effect.Unchanged) {
			Text.Add("[Poss] tongue turns into [str]!", parse);
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

// odds, value
TF.ItemEffects.SetCover = function(target, opts) {
	var odds  = opts.odds  || 1;
	var value = opts.value || Genitalia.Cover.NoCover;
	
	if(!target.FirstCock()) return TF.Effect.Unchanged;
	
	var gen = target.Genitalia();
	if(Math.random() < odds) {
		if(gen.cover != value) {
			var parse = {
				Poss: target.Possessive(),
				poss: target.possessive(),
				cocks: target.MultiCockDesc(),
				notS: target.NumCocks() > 1 ? "" : "s",
				is: target.NumCocks() > 1 ? "are" : "is"
			};
			if(value == Genitalia.Cover.NoCover) {
				if(gen.cover == Genitalia.Cover.Sheath)
					Text.Add("The sheath protecting [poss] [cocks] disappears!", parse);
				else if(gen.cover == Genitalia.Cover.Slit)
					Text.Add("[Poss] genital slit slowly closes up, pushing [poss] [cocks] into the open!", parse);
			}
			else if(value == Genitalia.Cover.Sheath) {
				if(gen.cover == Genitalia.Cover.NoCover)
					Text.Add("[Poss] [cocks] grow[notS] a sheath!", parse);
				else if(gen.cover == Genitalia.Cover.Slit)
					Text.Add("[Poss] genital slit coarsens into a sheath, covering [poss] [cocks]!", parse);
			}
			else if(value == Genitalia.Cover.Slit) {
				if(gen.cover == Genitalia.Cover.NoCover)
					Text.Add("[Poss] [cocks] [is] enveloped in a protective genital slit!", parse);
				else if(gen.cover == Genitalia.Cover.Sheath)
					Text.Add("[Poss] sheath morphs into a protective genital slit, covering [poss] [cocks]!", parse);
			}
			gen.SetCover(value);
			Text.NL();
			Text.Flush();
			
			return TF.Effect.Changed;
		}
	}
	return TF.Effect.Unchanged;
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
	var tail    = target.HasTail();
	var parse   = { name: target.NameDesc(), Poss: target.Possessive(), count: Text.NumToText(opts.count), hisher: target.hisher() };
	parse["s"] = tail && tail.count > 1 ? "s" : "";
	var odds    = opts.odds || 1;
	if(Math.random() < odds) {
		changed = TF.RemoveAppendage(target.Back(), AppendageType.tail, opts.count);
		switch(changed) {
			case TF.Effect.Changed:
				Text.Add("[name] lose [count] of [hisher] tails!", parse);
				Text.NL();
				break;
			case TF.Effect.Removed:
				Text.Add("[name] lose all trace of [hisher] tail[s]!", parse);
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

// odds, race, str, color, count
TF.ItemEffects.SetAbdomen = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { name: target.NameDesc(), Poss: target.Possessive(), s: target == player ? "" : "s", str: opts.str };
	
	var odds    = opts.odds  || 1;
	var count   = opts.count || 2;
	if(Math.random() < odds) {
		changed = TF.SetAppendage(target.Back(), AppendageType.abdomen, opts.race, opts.color, count);
		switch(changed) {
			case TF.Effect.Changed:
				Text.Add("[Poss] abdomen changes, turning into [str]!", parse);
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
TF.ItemEffects.RemAbdomen = function(target, opts) {
	var changed = TF.Effect.Unchanged;
	var parse   = { name: target.NameDesc(), Poss: target.Possessive(), count: Text.NumToText(opts.count), hisher: target.hisher() };
	var odds    = opts.odds || 1;
	if(Math.random() < odds) {
		changed = TF.RemoveAppendage(target.Back(), AppendageType.abdomen, opts.count);
		switch(changed) {
			case TF.Effect.Changed:
				Text.Add("[name] lose [count] of [hisher] abdomen!", parse);
				Text.NL();
				break;
			case TF.Effect.Removed:
				Text.Add("[name] lose all trace of [hisher] abdomen!", parse);
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
	var ideal   = opts.ideal || 2;
	if(Math.random() < odds) {
		changed = TF.SetBalls(target.body.balls, ideal, count);
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
	var count   = opts.count || 2;
	var ideal   = opts.ideal;
	if(Math.random() < odds) {
		changed = TF.RemBalls(target.body.balls, ideal, count);
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
TF.ItemEffects.IncBallSize = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { Poss: target.Possessive() };
	if(Math.random() < odds &&
		target.Balls().size.IncreaseStat(opts.ideal, opts.max)) {
		if(!target.HasBalls()) return;
		Text.Add("[Poss] balls have grown in size!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, ideal, max
TF.ItemEffects.DecBallSize = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { Poss: target.Possessive() };
	if(Math.random() < odds &&
		target.Balls().size.DecreaseStat(opts.ideal, opts.max)) {
		if(!target.HasBalls()) return;
		Text.Add("[Poss] balls have shrunk in size!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, rangeMin, rangeMax, max
TF.ItemEffects.IdealBallSize = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { Poss: target.Possessive() };
	if(Math.random() < odds) {
		var ideal = _.random(opts.rangeMin || 0, opts.rangeMax || 0, true);
		var diff = target.Balls().size.IdealStat(ideal, opts.max);
		if(!target.HasBalls()) return;
		if(diff > 0) {
			Text.Add("[Poss] balls have grown in size!", parse);
			Text.NL();
		}
		else if(diff < 0) {
			Text.Add("[Poss] balls have shrunk in size!", parse);
			Text.NL();
		}
	}
	Text.Flush();
}

// odds, ideal, max, female
TF.ItemEffects.IncBreastSize = function(target, opts) {
	var parse = { Poss: target.Possessive() };
	
	var odds  = opts.odds || 1;
	var multi = opts.multi;
	if(opts.female) {
		if(!target.FirstVag()) return;
	}
	_.each(target.AllBreastRows(), function(breasts) {
		if(Math.random() < odds) {
			var diff = breasts.size.IncreaseStat(opts.ideal, opts.max);
			if(diff) {
				Text.Add("[Poss] breasts grows bigger!", parse);
				Text.NL();
				if(!multi) return false;
			}
		}
	});
	Text.Flush();
}
// odds, ideal, max
TF.ItemEffects.DecBreastSize = function(target, opts) {
	var parse = { Poss: target.Possessive() };
	
	var odds  = opts.odds || 1;
	var multi = opts.multi;
	_.each(target.AllBreastRows(), function(breasts) {
		if(Math.random() < odds) {
			var diff = breasts.size.DecreaseStat(opts.ideal, opts.max);
			if(diff) {
				Text.Add("[Poss] breasts become smaller!", parse);
				Text.NL();
				if(!multi) return false;
			}
		}
	});
	Text.Flush();
}
// odds, ideal, max, female
TF.ItemEffects.SetIdealBreastSize = function(target, opts) {
	var parse = { Poss: target.Possessive() };
	
	var odds  = opts.odds || 1;
	var multi = opts.multi;
	if(opts.female) {
		if(!target.FirstVag()) return;
	}
	_.each(target.AllBreastRows(), function(breasts) {
		if(Math.random() < odds) {
			var diff = breasts.size.IdealStat(opts.ideal, opts.max);
			if(diff > 0) {
				Text.Add("[Poss] breasts grows bigger!", parse);
				Text.NL();
				if(!multi) return false;
			}
			else if(diff < 0) {
				Text.Add("[Poss] breasts become smaller!", parse);
				Text.NL();
				if(!multi) return false;
			}
		}
	});
	Text.Flush();
}

// odds, ideal, max
TF.ItemEffects.IncCockLen = function(target, opts) {
	var parse = { Poss: target.Possessive() };
	
	var odds  = opts.odds || 1;
	var multi = opts.multi;
	_.each(target.AllCocks(), function(cock) {
		if(Math.random() < odds) {
			var diff = cock.length.IncreaseStat(opts.ideal, opts.max);
			if(diff) {
				Text.Add("[Poss] cock grows longer!", parse);
				Text.NL();
				if(!multi) return false;
			}
		}
	});
	Text.Flush();
}
// odds, ideal, max
TF.ItemEffects.DecCockLen = function(target, opts) {
	var parse = { Poss: target.Possessive() };
	
	var odds  = opts.odds || 1;
	var multi = opts.multi;
	_.each(target.AllCocks(), function(cock) {
		if(Math.random() < odds) {
			var diff = cock.length.DecreaseStat(opts.ideal, opts.max);
			if(diff) {
				Text.Add("[Poss] cock becomes shorter!", parse);
				Text.NL();
				if(!multi) return false;
			}
		}
	});
	Text.Flush();
}
// odds, ideal, max
TF.ItemEffects.SetIdealCockLen = function(target, opts) {
	var parse = { Poss: target.Possessive() };
	
	var odds  = opts.odds || 1;
	var multi = opts.multi;
	_.each(target.AllCocks(), function(cock) {
		if(Math.random() < odds) {
			var diff = cock.length.IdealStat(opts.ideal, opts.max);
			if(diff > 0) {
				Text.Add("[Poss] cock grows longer!", parse);
				Text.NL();
				if(!multi) return false;
			}
			else if(diff < 0) {
				Text.Add("[Poss] cock becomes shorter!", parse);
				Text.NL();
				if(!multi) return false;
			}
		}
	});
	Text.Flush();
}

// odds, ideal, max
TF.ItemEffects.IncCockThk = function(target, opts) {
	var parse = { Poss: target.Possessive() };
	
	var odds  = opts.odds || 1;
	var multi = opts.multi;
	_.each(target.AllCocks(), function(cock) {
		if(Math.random() < odds) {
			var diff = cock.thickness.IncreaseStat(opts.ideal, opts.max);
			if(diff) {
				Text.Add("[Poss] cock grows thicker!", parse);
				Text.NL();
				if(!multi) return false;
			}
		}
	});
	Text.Flush();
}
// odds, ideal, max
TF.ItemEffects.DecCockThk = function(target, opts) {
	var parse = { Poss: target.Possessive() };
	
	var odds  = opts.odds || 1;
	var multi = opts.multi;
	_.each(target.AllCocks(), function(cock) {
		if(Math.random() < odds) {
			var diff = cock.thickness.DecreaseStat(opts.ideal, opts.max);
			if(diff) {
				Text.Add("[Poss] cock grows thinner!", parse);
				Text.NL();
				if(!multi) return false;
			}
		}
	});
	Text.Flush();
}
// odds, ideal, max
TF.ItemEffects.SetIdealCockThk = function(target, opts) {
	var parse = { Poss: target.Possessive() };
	
	var odds  = opts.odds || 1;
	var multi = opts.multi;
	_.each(target.AllCocks(), function(cock) {
		if(Math.random() < odds) {
			var diff = cock.thickness.IdealStat(opts.ideal, opts.max);
			if(diff > 0) {
				Text.Add("[Poss] cock grows thicker!", parse);
				Text.NL();
				if(!multi) return false;
			}
			else if(diff < 0) {
				Text.Add("[Poss] cock grows thinner!", parse);
				Text.NL();
				if(!multi) return false;
			}
		}
	});
	Text.Flush();
}

// odds, ideal, max, female
TF.ItemEffects.IncFem = function(target, opts) {
	var odds  = opts.odds || 1;
	var female = target.FirstVag();
	if(opts.female && !female) return;
	var parse = { name: target.NameDesc(), notS: target.plural() ? "" : "s" };
	if(Math.random() < odds &&
		target.body.femininity.IncreaseStat(opts.ideal, opts.max, true)) {
		Text.Add("[name] become[notS] more feminine!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, ideal, max, male
TF.ItemEffects.DecFem = function(target, opts) {
	var odds  = opts.odds || 1;
	var female = target.FirstVag();
	if(opts.male && female) return;
	var parse = { name: target.NameDesc(), notS: target.plural() ? "" : "s" };
	if(Math.random() < odds &&
		target.body.femininity.DecreaseStat(opts.ideal, opts.max, true)) {
		Text.Add("[name] become[notS] more masculine!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, rangeMin, rangeMax, max
TF.ItemEffects.IdealFem = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), notS: target.plural() ? "" : "s" };
	if(Math.random() < odds) {
		var ideal = _.random(opts.rangeMin || 0, opts.rangeMax || 0, true);
		var diff = target.body.femininity.IdealStat(ideal, opts.max, true);
		if(diff > 0) {
			Text.Add("[name] become[notS] more feminine!", parse);
			Text.NL();
		}
		else if(diff < 0) {
			Text.Add("[name] become[notS] more masculine!", parse);
			Text.NL();
		}
	}
	Text.Flush();
}

// odds, ideal, max
TF.ItemEffects.IncTone = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), notS: target.plural() ? "" : "s" };
	if(Math.random() < odds &&
		target.body.muscleTone.IncreaseStat(opts.ideal, opts.max, true)) {
		Text.Add("[name] become[notS] more muscular!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, ideal, min
TF.ItemEffects.DecTone = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), notS: target.plural() ? "" : "s" };
	if(Math.random() < odds &&
		target.body.muscleTone.DecreaseStat(opts.ideal, opts.max, true)) {
		Text.Add("[name] become[notS] less muscular!", parse);
		Text.NL();
	}
	Text.Flush();
}

// odds, rangeMin, rangeMax, max
TF.ItemEffects.IdealTone = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { name: target.NameDesc(), notS: target.plural() ? "" : "s" };
	if(Math.random() < odds) {
		var ideal = _.random(opts.rangeMin || 0, opts.rangeMax || 0, true);
		var diff = target.body.muscleTone.IdealStat(ideal, opts.max, true);
		if(diff > 0) {
			Text.Add("[name] become[notS] more muscular!", parse);
			Text.NL();
		}
		else if(diff < 0) {
			Text.Add("[name] become[notS] less muscular!", parse);
			Text.NL();
		}
	}
	Text.Flush();
}


// odds, ideal, max
TF.ItemEffects.IncHips = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { Poss: target.Possessive() };
	if(Math.random() < odds &&
		target.body.torso.hipSize.IncreaseStat(opts.ideal, opts.max)) {
		Text.Add("[Poss] hips widen!", parse);
		Text.NL();
	}
	Text.Flush();
}
// odds, ideal, min
TF.ItemEffects.DecHips = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { Poss: target.Possessive() };
	if(Math.random() < odds &&
		target.body.torso.hipSize.DecreaseStat(opts.ideal, opts.max)) {
		Text.Add("[Poss] hips narrow!", parse);
		Text.NL();
	}
	Text.Flush();
}
// odds, rangeMin, rangeMax, max
TF.ItemEffects.IdealHips = function(target, opts) {
	var odds  = opts.odds || 1;
	var parse = { Poss: target.Possessive() };
	if(Math.random() < odds) {
		var ideal = _.random(opts.rangeMin || 0, opts.rangeMax || 0, true);
		var diff = target.body.torso.hipSize.IdealStat(ideal, opts.max);
		if(diff > 0) {
			Text.Add("[Poss] hips widen!", parse);
			Text.NL();
		}
		else if(diff < 0) {
			Text.Add("[Poss] hips narrow!", parse);
			Text.NL();
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

export { TF, TFItem };
