/*
 *
 * Transformations namespace
 *
 */

import * as _ from "lodash";

import { Appendage, AppendageType } from "./body/appendage";
import { Balls } from "./body/balls";
import { Genitalia } from "./body/genitalia";
import { RaceDesc } from "./body/race";
import { Entity } from "./entity";
import { GAME } from "./GAME";
import { Item, ItemType } from "./item";
import { Text } from "./text";
import { Rand } from "./utility";

export namespace TF {
	export enum Effect {
		Unchanged = 0,
		Changed   = 1,
		Added     = 2,
		Removed   = 3,
	}

	// Change of bodyparts, return if something was changed
	export function SetRaceOne(bodypart: any, race: RaceDesc, ret?: any) {
		ret = ret || {};
		let changed = Effect.Unchanged;
		if (_.isArray(bodypart)) {
			const list = [];
			for (const bp of bodypart) {
				if (bp.race !== race) {
					list.push(bp);
				}
			}
			if (list.length > 0) {
				changed = Effect.Changed;
				const idx = Rand(list.length);
				list[idx].race = race;
				ret.bodypart   = list[idx];
			}
		} else {
			changed       = (bodypart.race !== race) ? Effect.Changed : Effect.Unchanged;
			bodypart.race = race;
			ret.bodypart  = bodypart;
		}
		return changed;
	}

	export function SetRaceAll(bodypart: any, race: RaceDesc) {
		let changed: any = Effect.Unchanged;
		if (_.isArray(bodypart)) {
			const list = [];
			for (const bp of bodypart) {
				if (bp.race !== race) {
					list.push(bp);
				}
			}
			for (const bp of list) {
				changed = true;
				bp.race = race;
			}
		} else {
			changed       = (bodypart.race !== race) ? Effect.Changed : Effect.Unchanged;
			bodypart.race = race;
		}
		return changed;
	}

	// Will create a new appendage or replace an old one
	export function SetAppendage(slots: any, type: any, race: RaceDesc, color: any, count?: number) {
		if (!_.isNumber(count)) {
			count = 1;
		}

		for (const app of slots) {
			if (app.type === type) {
				const changed    =
				   ((app.race  !== race)  ||
					(app.count !== count) ||
					(app.color !== color)) ? Effect.Changed : Effect.Unchanged;
				app.race  = race;
				app.color = color;
				app.count = count;
				return changed;
			}
		}
		// No app of correct type found, add new
		slots.push(new Appendage(type, race, color, count));

		return Effect.Added;
	}

	export function RemoveAppendage(slots: any, type: any, count: number) {
		let all = false;
		if (count < 0) {
			all = true;
		} else if (!_.isNumber(count)) {
			count = 1;
 		}

		for (let i = 0; i < slots.length; i++) {
			const app = slots[i];
			if (app.type === type) {
				if (all) {
					app.count = 0;
				} else {
					app.count -= count;
				}
				if (app.count > 0) {
					return Effect.Changed;
				} else {
					slots.splice(i, 1);
					return Effect.Removed;
				}
			}
		}
		return Effect.Unchanged;
	}

	export function SetBalls(balls: Balls, ideal?: number, count?: number) {
		count = count || 2;
		ideal = ideal || 2;

		const orig = balls.count.Get();
		const res = balls.count.IncreaseStat(ideal, count);
		if (res > 0) {
			if (orig === 0) {
				return Effect.Added;
			} else {
				return Effect.Changed;
			}
		} else {
			return Effect.Unchanged;
		}
	}

	export function RemBalls(balls: Balls, ideal?: number, count?: number) {
		count = count || 2;
		ideal = ideal || 0;

		const res = balls.count.DecreaseStat(ideal, count);
		if (res !== 0) {
			if (balls.count.Get() === 0) {
				return Effect.Removed;
			} else {
				return Effect.Changed;
			}
		} else {
			return Effect.Unchanged;
		}
	}

	/* ITEM EFFECTS */

	export function UseItem(target: Entity, suppressUse?: boolean) {
		let changed = Effect.Unchanged;
		if (!suppressUse && this.useStr) {
			this.useStr(target);
		}
		for (const effect of this.effects) {
			if (effect.func) {
				const ret = effect.func(target, effect.opts);
				if (ret !== Effect.Unchanged) {
					changed = ret;
				}
			}
		}
		return {consume: true, changed};
	}

	export function UseItemDesc(target: Entity) {
		const parse: any = { name: target.NameDesc(), s: target === GAME().player ? "" : "s", item: this.name };
		Text.Add("[name] chug[s] down a bottle of [item].", parse);
		Text.NL();
		Text.Flush();
	}

	/* opts
	*
	* .odds : 0..1
	* .race : Race.X
	* .str  : ex: "an equine cock"
	*/
	export namespace ItemEffects {

		// odds, race, str
		export function SetBody(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { Poss: target.Possessive(), str: opts.str };
			const odds    = opts.odds || 1;
			const body    = target.body.torso;
			if (Math.random() < odds) {
				changed = TF.SetRaceOne(body, opts.race);
				if (changed !== Effect.Unchanged) {
					Text.Add("[Poss] body turns into [str]!", parse);
					Text.NL();
				}
			}
			Text.Flush();
			return changed;
		}

		export function SetFace(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { Poss: target.Possessive(), str: opts.str };
			const odds    = opts.odds || 1;
			const head    = target.body.head;
			if (Math.random() < odds) {
				changed = TF.SetRaceOne(head, opts.race);
				if (changed !== Effect.Unchanged) {
					Text.Add("[Poss] face turns into [str]!", parse);
					Text.NL();
				}
			}
			Text.Flush();
			return changed;
		}

		export function SetTongue(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { Poss: target.Possessive(), str: opts.str };
			const odds    = opts.odds || 1;
			const head    = target.body.head;
			if (Math.random() < odds) {
				changed = TF.SetRaceOne(head.mouth.tongue, opts.race);
				if (changed !== Effect.Unchanged) {
					Text.Add("[Poss] tongue turns into [str]!", parse);
					Text.NL();
				}
			}
			Text.Flush();
			return changed;
		}

		// odds, race, str
		export function SetArms(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { Poss: target.Possessive(), str: opts.str };
			const odds    = opts.odds || 1;
			const body    = target.body.arms;
			if (Math.random() < odds) {
				changed = TF.SetRaceOne(body, opts.race);
				if (changed !== Effect.Unchanged) {
					Text.Add("[Poss] arms turns into [str]!", parse);
					Text.NL();
				}
			}
			Text.Flush();
			return changed;
		}

		// odds, race, str, count
		export function SetLegs(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { Poss: target.Possessive(), str: opts.str };
			const odds    = opts.odds || 1;
			const count   = opts.count || 2;
			const legs    = target.body.legs;
			if (legs.count >= 2 && Math.random() < odds) {
				changed = TF.SetRaceOne(legs, opts.race);
				if (changed !== Effect.Unchanged) {
					Text.Add("[Poss] legs turns into [str]!", parse);
					Text.NL();
				}
			}
			Text.Flush();
			return changed;
		}

		// odds, race, str
		export function SetCock(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { poss: target.possessive(), Poss: target.Possessive(), str: opts.str };
			const odds    = opts.odds || 1;
			const cocks   = target.AllCocks();
			if (Math.random() < odds) {
				changed = TF.SetRaceOne(cocks, opts.race);
				if (changed !== Effect.Unchanged) {
					if (cocks.length > 1) {
						Text.Add("One of [poss] cocks turns into [str]!", parse);
					} else {
						Text.Add("[Poss] cock turns into [str]!", parse);
					}
					Text.NL();
				}
			}
			Text.Flush();
			return changed;
		}

		// odds, race, str
		export function SetEars(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { Poss: target.Possessive(), str: opts.str };
			const odds    = opts.odds || 1;
			const ears    = target.Ears();
			if (Math.random() < odds) {
				changed = TF.SetRaceOne(ears, opts.race);
				if (changed !== Effect.Unchanged) {
					Text.Add("[Poss] ears turn into [str]!", parse);
					Text.NL();
				}
			}
			Text.Flush();
			return changed;
		}

		// odds, value, num
		export function SetKnot(target: Entity, opts: any) {
			const parse: any = { Poss: target.Possessive(), poss: target.possessive() };
			const odds  = opts.odds || 1;
			let num   = opts.num || 1;
			for (const cock of target.AllCocks()) {
				if (Math.random() < odds) {
					parse.cockDesc = cock.Short();
					if (opts.value) {
						if (cock.knot === 0) {
							cock.knot = 1;
							Text.Add("[Poss] [cockDesc] grows a knot!", parse);
							Text.NL();
							num--;
						}
					} else {
						if (cock.knot === 1) {
							cock.knot = 0;
							Text.Add("The knot on [poss] [cockDesc] disappears!", parse);
							Text.NL();
							num--;
						}
					}
					if (num <= 0) { break; }
				}
			}
			Text.Flush();
		}

		// odds, value
		export function SetCover(target: Entity, opts: any) {
			const odds  = opts.odds  || 1;
			const value = opts.value || Genitalia.Cover.NoCover;

			if (!target.FirstCock()) { return Effect.Unchanged; }

			const gen = target.Genitalia();
			if (Math.random() < odds) {
				if (gen.cover !== value) {
					const parse: any = {
						Poss: target.Possessive(),
						poss: target.possessive(),
						cocks: target.MultiCockDesc(),
						notS: target.NumCocks() > 1 ? "" : "s",
						is: target.NumCocks() > 1 ? "are" : "is",
					};
					if (value === Genitalia.Cover.NoCover) {
						if (gen.cover === Genitalia.Cover.Sheath) {
							Text.Add("The sheath protecting [poss] [cocks] disappears!", parse);
						} else if (gen.cover === Genitalia.Cover.Slit) {
							Text.Add("[Poss] genital slit slowly closes up, pushing [poss] [cocks] into the open!", parse);
 }
					} else if (value === Genitalia.Cover.Sheath) {
						if (gen.cover === Genitalia.Cover.NoCover) {
							Text.Add("[Poss] [cocks] grow[notS] a sheath!", parse);
						} else if (gen.cover === Genitalia.Cover.Slit) {
							Text.Add("[Poss] genital slit coarsens into a sheath, covering [poss] [cocks]!", parse);
 }
					} else if (value === Genitalia.Cover.Slit) {
						if (gen.cover === Genitalia.Cover.NoCover) {
							Text.Add("[Poss] [cocks] [is] enveloped in a protective genital slit!", parse);
						} else if (gen.cover === Genitalia.Cover.Sheath) {
							Text.Add("[Poss] sheath morphs into a protective genital slit, covering [poss] [cocks]!", parse);
 }
					}
					gen.SetCover(value);
					Text.NL();
					Text.Flush();

					return Effect.Changed;
				}
			}
			return Effect.Unchanged;
		}

		// odds, race, str, color
		export function SetTail(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { name: target.NameDesc(), Poss: target.Possessive(), s: target === GAME().player ? "" : "s", str: opts.str };

			const odds    = opts.odds || 1;
			if (Math.random() < odds) {
				changed = SetAppendage(target.Back(), AppendageType.tail, opts.race, opts.color);
				switch (changed) {
					case Effect.Changed:
						Text.Add("[Poss] tail changes, turning into [str]!", parse);
						Text.NL();
						break;
					case Effect.Added:
						Text.Add("[name] suddenly grow[s] [str]!", parse);
						Text.NL();
						break;
				}
			}
			Text.Flush();
			return changed;
		}

		// odds, count
		export function RemTail(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const tail    = target.HasTail();
			const parse: any = { name: target.NameDesc(), Poss: target.Possessive(), count: Text.NumToText(opts.count), hisher: target.hisher() };
			parse.s = tail && tail.count > 1 ? "s" : "";
			const odds    = opts.odds || 1;
			if (Math.random() < odds) {
				changed = TF.RemoveAppendage(target.Back(), AppendageType.tail, opts.count);
				switch (changed) {
					case Effect.Changed:
						Text.Add("[name] lose [count] of [hisher] tails!", parse);
						Text.NL();
						break;
					case Effect.Removed:
						Text.Add("[name] lose all trace of [hisher] tail[s]!", parse);
						Text.NL();
						break;
				}
			}
			Text.Flush();
			return changed;
		}

		// odds, race, str, color, count
		export function SetHorn(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { name: target.NameDesc(), Poss: target.Possessive(), s: target === GAME().player ? "" : "s", str: opts.str };

			const odds    = opts.odds || 1;
			if (Math.random() < odds) {
				changed = TF.SetAppendage(target.Appendages(), AppendageType.horn, opts.race, opts.color, opts.count);
				switch (changed) {
					case Effect.Changed:
						Text.Add("[Poss] horns change, turning into [str]!", parse);
						Text.NL();
						break;
					case Effect.Added:
						Text.Add("[name] suddenly grow[s] [str]!", parse);
						Text.NL();
						break;
				}
			}
			Text.Flush();
			return changed;
		}

		// odds, count
		export function RemHorn(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { name: target.NameDesc(), Poss: target.Possessive(), count: Text.NumToText(opts.count), hisher: target.hisher() };
			const odds    = opts.odds || 1;
			if (Math.random() < odds) {
				changed = TF.RemoveAppendage(target.Appendages(), AppendageType.horn, opts.count);
				switch (changed) {
					case Effect.Changed:
						Text.Add("[name] lose [count] of [hisher] horns!", parse);
						Text.NL();
						break;
					case Effect.Removed:
						Text.Add("[name] lose all trace of [hisher] horns!", parse);
						Text.NL();
						break;
				}
			}
			Text.Flush();
			return changed;
		}

		// odds, race, str, color, count
		export function SetAntenna(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { name: target.NameDesc(), Poss: target.Possessive(), s: target === GAME().player ? "" : "s", str: opts.str };

			const odds    = opts.odds  || 1;
			const count   = opts.count || 2;
			if (Math.random() < odds) {
				changed = TF.SetAppendage(target.Appendages(), AppendageType.antenna, opts.race, opts.color, count);
				switch (changed) {
					case Effect.Changed:
						Text.Add("[Poss] antenna change, turning into [str]!", parse);
						Text.NL();
						break;
					case Effect.Added:
						Text.Add("[name] suddenly grow[s] [str]!", parse);
						Text.NL();
						break;
				}
			}
			Text.Flush();
			return changed;
		}

		// odds, count
		export function RemAntenna(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { name: target.NameDesc(), Poss: target.Possessive(), count: Text.NumToText(opts.count), hisher: target.hisher() };
			const odds    = opts.odds || 1;
			if (Math.random() < odds) {
				changed = TF.RemoveAppendage(target.Appendages(), AppendageType.antenna, opts.count);
				switch (changed) {
					case Effect.Changed:
						Text.Add("[name] lose [count] of [hisher] antenna!", parse);
						Text.NL();
						break;
					case Effect.Removed:
						Text.Add("[name] lose all trace of [hisher] antenna!", parse);
						Text.NL();
						break;
				}
			}
			Text.Flush();
			return changed;
		}

		// odds, race, str, color, count
		export function SetWings(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { name: target.NameDesc(), Poss: target.Possessive(), s: target === GAME().player ? "" : "s", str: opts.str };

			const odds    = opts.odds  || 1;
			const count   = opts.count || 2;
			if (Math.random() < odds) {
				changed = TF.SetAppendage(target.Back(), AppendageType.wing, opts.race, opts.color, count);
				switch (changed) {
					case Effect.Changed:
						Text.Add("[Poss] wings change, turning into [str]!", parse);
						Text.NL();
						break;
					case Effect.Added:
						Text.Add("[name] suddenly grow[s] [str]!", parse);
						Text.NL();
						break;
				}
			}
			Text.Flush();
			return changed;
		}

		// odds, count
		export function RemWings(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { name: target.NameDesc(), Poss: target.Possessive(), count: Text.NumToText(opts.count), hisher: target.hisher() };
			const odds    = opts.odds || 1;
			if (Math.random() < odds) {
				changed = TF.RemoveAppendage(target.Back(), AppendageType.wing, opts.count);
				switch (changed) {
					case Effect.Changed:
						Text.Add("[name] lose [count] of [hisher] wings!", parse);
						Text.NL();
						break;
					case Effect.Removed:
						Text.Add("[name] lose all trace of [hisher] wings!", parse);
						Text.NL();
						break;
				}
			}
			Text.Flush();
			return changed;
		}

		// odds, race, str, color, count
		export function SetAbdomen(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { name: target.NameDesc(), Poss: target.Possessive(), s: target === GAME().player ? "" : "s", str: opts.str };

			const odds    = opts.odds  || 1;
			const count   = opts.count || 2;
			if (Math.random() < odds) {
				changed = TF.SetAppendage(target.Back(), AppendageType.abdomen, opts.race, opts.color, count);
				switch (changed) {
					case Effect.Changed:
						Text.Add("[Poss] abdomen changes, turning into [str]!", parse);
						Text.NL();
						break;
					case Effect.Added:
						Text.Add("[name] suddenly grow[s] [str]!", parse);
						Text.NL();
						break;
				}
			}
			Text.Flush();
			return changed;
		}

		// odds, count
		export function RemAbdomen(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { name: target.NameDesc(), Poss: target.Possessive(), count: Text.NumToText(opts.count), hisher: target.hisher() };
			const odds    = opts.odds || 1;
			if (Math.random() < odds) {
				changed = TF.RemoveAppendage(target.Back(), AppendageType.abdomen, opts.count);
				switch (changed) {
					case Effect.Changed:
						Text.Add("[name] lose [count] of [hisher] abdomen!", parse);
						Text.NL();
						break;
					case Effect.Removed:
						Text.Add("[name] lose all trace of [hisher] abdomen!", parse);
						Text.NL();
						break;
				}
			}
			Text.Flush();
			return changed;
		}

		// odds, race, color, ideal, count
		export function SetBalls(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { name: target.NameDesc(), s: target === GAME().player ? "" : "s", count: Text.NumToText(opts.count), ballsDesc() { return target.BallsDesc(); } };
			const odds    = opts.odds  || 1;
			const count   = opts.count || 2;
			const ideal   = opts.ideal || 2;
			if (Math.random() < odds) {
				changed = TF.SetBalls(target.body.balls, ideal, count);
				switch (changed) {
					case Effect.Changed:
						Text.Add("[name] grow[s] an extra [count] testicles!", parse);
						Text.NL();
						break;
					case Effect.Added:
						Text.Add("[name] suddenly grow[s] a [ballsDesc]!", parse);
						Text.NL();
						break;
				}
			}
			Text.Flush();
			return changed;
		}

		// odds, ideal, count
		export function RemBalls(target: Entity, opts: any) {
			let changed = Effect.Unchanged;
			const parse   = { name: target.NameDesc(), count: Text.NumToText(opts.count), hisher: target.hisher(), ballsDesc: target.BallsDesc() };
			const odds    = opts.odds || 1;
			const count   = opts.count || 2;
			const ideal   = opts.ideal;
			if (Math.random() < odds) {
				changed = TF.RemBalls(target.body.balls, ideal, count);
				switch (changed) {
					case Effect.Changed:
						Text.Add("[name] lose [count] of [hisher] testicles!", parse);
						Text.NL();
						break;
					case Effect.Removed:
						Text.Add("[name] lose all trace of [hisher] [ballsDesc]!", parse);
						Text.NL();
						break;
				}
			}
			Text.Flush();
			return changed;
		}

		// odds, ideal, max
		export function IncBallSize(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { Poss: target.Possessive() };
			if (Math.random() < odds &&
				target.Balls().size.IncreaseStat(opts.ideal, opts.max)) {
				if (!target.HasBalls()) { return; }
				Text.Add("[Poss] balls have grown in size!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, ideal, max
		export function DecBallSize(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { Poss: target.Possessive() };
			if (Math.random() < odds &&
				target.Balls().size.DecreaseStat(opts.ideal, opts.max)) {
				if (!target.HasBalls()) { return; }
				Text.Add("[Poss] balls have shrunk in size!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, rangeMin, rangeMax, max
		export function IdealBallSize(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { Poss: target.Possessive() };
			if (Math.random() < odds) {
				const ideal = _.random(opts.rangeMin || 0, opts.rangeMax || 0, true);
				const diff = target.Balls().size.IdealStat(ideal, opts.max);
				if (!target.HasBalls()) { return; }
				if (diff > 0) {
					Text.Add("[Poss] balls have grown in size!", parse);
					Text.NL();
				} else if (diff < 0) {
					Text.Add("[Poss] balls have shrunk in size!", parse);
					Text.NL();
				}
			}
			Text.Flush();
		}

		// odds, ideal, max, female
		export function IncBreastSize(target: Entity, opts: any) {
			const parse: any = { Poss: target.Possessive() };

			const odds  = opts.odds || 1;
			const multi = opts.multi;
			if (opts.female) {
				if (!target.FirstVag()) { return; }
			}
			_.each(target.AllBreastRows(), (breasts) => {
				if (Math.random() < odds) {
					const diff = breasts.size.IncreaseStat(opts.ideal, opts.max);
					if (diff) {
						Text.Add("[Poss] breasts grows bigger!", parse);
						Text.NL();
						if (!multi) { return false; }
					}
				}
			});
			Text.Flush();
		}
		// odds, ideal, max
		export function DecBreastSize(target: Entity, opts: any) {
			const parse: any = { Poss: target.Possessive() };

			const odds  = opts.odds || 1;
			const multi = opts.multi;
			_.each(target.AllBreastRows(), (breasts) => {
				if (Math.random() < odds) {
					const diff = breasts.size.DecreaseStat(opts.ideal, opts.max);
					if (diff) {
						Text.Add("[Poss] breasts become smaller!", parse);
						Text.NL();
						if (!multi) { return false; }
					}
				}
			});
			Text.Flush();
		}
		// odds, ideal, max, female
		export function SetIdealBreastSize(target: Entity, opts: any) {
			const parse: any = { Poss: target.Possessive() };

			const odds  = opts.odds || 1;
			const multi = opts.multi;
			if (opts.female) {
				if (!target.FirstVag()) { return; }
			}
			_.each(target.AllBreastRows(), (breasts) => {
				if (Math.random() < odds) {
					const diff = breasts.size.IdealStat(opts.ideal, opts.max);
					if (diff > 0) {
						Text.Add("[Poss] breasts grows bigger!", parse);
						Text.NL();
						if (!multi) { return false; }
					} else if (diff < 0) {
						Text.Add("[Poss] breasts become smaller!", parse);
						Text.NL();
						if (!multi) { return false; }
					}
				}
			});
			Text.Flush();
		}

		// odds, ideal, max
		export function IncCockLen(target: Entity, opts: any) {
			const parse: any = { Poss: target.Possessive() };

			const odds  = opts.odds || 1;
			const multi = opts.multi;
			_.each(target.AllCocks(), (cock) => {
				if (Math.random() < odds) {
					const diff = cock.length.IncreaseStat(opts.ideal, opts.max);
					if (diff) {
						Text.Add("[Poss] cock grows longer!", parse);
						Text.NL();
						if (!multi) { return false; }
					}
				}
			});
			Text.Flush();
		}
		// odds, ideal, max
		export function DecCockLen(target: Entity, opts: any) {
			const parse: any = { Poss: target.Possessive() };

			const odds  = opts.odds || 1;
			const multi = opts.multi;
			_.each(target.AllCocks(), (cock) => {
				if (Math.random() < odds) {
					const diff = cock.length.DecreaseStat(opts.ideal, opts.max);
					if (diff) {
						Text.Add("[Poss] cock becomes shorter!", parse);
						Text.NL();
						if (!multi) { return false; }
					}
				}
			});
			Text.Flush();
		}
		// odds, ideal, max
		export function SetIdealCockLen(target: Entity, opts: any) {
			const parse: any = { Poss: target.Possessive() };

			const odds  = opts.odds || 1;
			const multi = opts.multi;
			_.each(target.AllCocks(), (cock) => {
				if (Math.random() < odds) {
					const diff = cock.length.IdealStat(opts.ideal, opts.max);
					if (diff > 0) {
						Text.Add("[Poss] cock grows longer!", parse);
						Text.NL();
						if (!multi) { return false; }
					} else if (diff < 0) {
						Text.Add("[Poss] cock becomes shorter!", parse);
						Text.NL();
						if (!multi) { return false; }
					}
				}
			});
			Text.Flush();
		}

		// odds, ideal, max
		export function IncCockThk(target: Entity, opts: any) {
			const parse: any = { Poss: target.Possessive() };

			const odds  = opts.odds || 1;
			const multi = opts.multi;
			_.each(target.AllCocks(), (cock) => {
				if (Math.random() < odds) {
					const diff = cock.thickness.IncreaseStat(opts.ideal, opts.max);
					if (diff) {
						Text.Add("[Poss] cock grows thicker!", parse);
						Text.NL();
						if (!multi) { return false; }
					}
				}
			});
			Text.Flush();
		}
		// odds, ideal, max
		export function DecCockThk(target: Entity, opts: any) {
			const parse: any = { Poss: target.Possessive() };

			const odds  = opts.odds || 1;
			const multi = opts.multi;
			_.each(target.AllCocks(), (cock) => {
				if (Math.random() < odds) {
					const diff = cock.thickness.DecreaseStat(opts.ideal, opts.max);
					if (diff) {
						Text.Add("[Poss] cock grows thinner!", parse);
						Text.NL();
						if (!multi) { return false; }
					}
				}
			});
			Text.Flush();
		}
		// odds, ideal, max
		export function SetIdealCockThk(target: Entity, opts: any) {
			const parse: any = { Poss: target.Possessive() };

			const odds  = opts.odds || 1;
			const multi = opts.multi;
			_.each(target.AllCocks(), (cock) => {
				if (Math.random() < odds) {
					const diff = cock.thickness.IdealStat(opts.ideal, opts.max);
					if (diff > 0) {
						Text.Add("[Poss] cock grows thicker!", parse);
						Text.NL();
						if (!multi) { return false; }
					} else if (diff < 0) {
						Text.Add("[Poss] cock grows thinner!", parse);
						Text.NL();
						if (!multi) { return false; }
					}
				}
			});
			Text.Flush();
		}

		// odds, ideal, max, female
		export function IncFem(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const female = target.FirstVag();
			if (opts.female && !female) { return; }
			const parse: any = { name: target.NameDesc(), notS: target.plural() ? "" : "s" };
			if (Math.random() < odds &&
				target.body.femininity.IncreaseStat(opts.ideal, opts.max, true)) {
				Text.Add("[name] become[notS] more feminine!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, ideal, max, male
		export function DecFem(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const female = target.FirstVag();
			if (opts.male && female) { return; }
			const parse: any = { name: target.NameDesc(), notS: target.plural() ? "" : "s" };
			if (Math.random() < odds &&
				target.body.femininity.DecreaseStat(opts.ideal, opts.max, true)) {
				Text.Add("[name] become[notS] more masculine!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, rangeMin, rangeMax, max
		export function IdealFem(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), notS: target.plural() ? "" : "s" };
			if (Math.random() < odds) {
				const ideal = _.random(opts.rangeMin || 0, opts.rangeMax || 0, true);
				const diff = target.body.femininity.IdealStat(ideal, opts.max, true);
				if (diff > 0) {
					Text.Add("[name] become[notS] more feminine!", parse);
					Text.NL();
				} else if (diff < 0) {
					Text.Add("[name] become[notS] more masculine!", parse);
					Text.NL();
				}
			}
			Text.Flush();
		}

		// odds, ideal, max
		export function IncTone(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), notS: target.plural() ? "" : "s" };
			if (Math.random() < odds &&
				target.body.muscleTone.IncreaseStat(opts.ideal, opts.max, true)) {
				Text.Add("[name] become[notS] more muscular!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, ideal, min
		export function DecTone(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), notS: target.plural() ? "" : "s" };
			if (Math.random() < odds &&
				target.body.muscleTone.DecreaseStat(opts.ideal, opts.max, true)) {
				Text.Add("[name] become[notS] less muscular!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, rangeMin, rangeMax, max
		export function IdealTone(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), notS: target.plural() ? "" : "s" };
			if (Math.random() < odds) {
				const ideal = _.random(opts.rangeMin || 0, opts.rangeMax || 0, true);
				const diff = target.body.muscleTone.IdealStat(ideal, opts.max, true);
				if (diff > 0) {
					Text.Add("[name] become[notS] more muscular!", parse);
					Text.NL();
				} else if (diff < 0) {
					Text.Add("[name] become[notS] less muscular!", parse);
					Text.NL();
				}
			}
			Text.Flush();
		}

		// odds, ideal, max
		export function IncHips(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { Poss: target.Possessive() };
			if (Math.random() < odds &&
				target.body.torso.hipSize.IncreaseStat(opts.ideal, opts.max)) {
				Text.Add("[Poss] hips widen!", parse);
				Text.NL();
			}
			Text.Flush();
		}
		// odds, ideal, min
		export function DecHips(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { Poss: target.Possessive() };
			if (Math.random() < odds &&
				target.body.torso.hipSize.DecreaseStat(opts.ideal, opts.max)) {
				Text.Add("[Poss] hips narrow!", parse);
				Text.NL();
			}
			Text.Flush();
		}
		// odds, rangeMin, rangeMax, max
		export function IdealHips(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { Poss: target.Possessive() };
			if (Math.random() < odds) {
				const ideal = _.random(opts.rangeMin || 0, opts.rangeMax || 0, true);
				const diff = target.body.torso.hipSize.IdealStat(ideal, opts.max);
				if (diff > 0) {
					Text.Add("[Poss] hips widen!", parse);
					Text.NL();
				} else if (diff < 0) {
					Text.Add("[Poss] hips narrow!", parse);
					Text.NL();
				}
			}
			Text.Flush();
		}

		// INC STATS

		// odds, ideal, max
		export function IncStr(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), is: target.is() };
			if (Math.random() < odds &&
				target.strength.IncreaseStat(opts.ideal, opts.max)) {
				Text.Add("[name] [is] suddenly a bit stronger!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, ideal, max
		export function IncSta(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), is: target.is() };
			if (Math.random() < odds &&
				target.stamina.IncreaseStat(opts.ideal, opts.max)) {
				Text.Add("[name] [is] suddenly a bit tougher!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, ideal, max
		export function IncDex(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), is: target.is() };
			if (Math.random() < odds &&
				target.dexterity.IncreaseStat(opts.ideal, opts.max)) {
				Text.Add("[name] [is] suddenly a bit swifter!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, ideal, max
		export function IncInt(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), is: target.is() };
			if (Math.random() < odds &&
				target.intelligence.IncreaseStat(opts.ideal, opts.max)) {
				Text.Add("[name] [is] suddenly a bit smarter!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, ideal, max
		export function IncSpi(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), is: target.is() };
			if (Math.random() < odds &&
				target.spirit.IncreaseStat(opts.ideal, opts.max)) {
				Text.Add("[name] [is] suddenly a bit more stoic!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, ideal, max
		export function IncLib(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), is: target.is() };
			if (Math.random() < odds &&
				target.libido.IncreaseStat(opts.ideal, opts.max)) {
				Text.Add("[name] [is] suddenly a bit hornier!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, ideal, max
		export function IncCha(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), is: target.is() };
			if (Math.random() < odds &&
				target.charisma.IncreaseStat(opts.ideal, opts.max)) {
				Text.Add("[name] [is] suddenly a bit more charming!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// DEC STATS

		// odds, ideal, max
		export function DecStr(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), is: target.is() };
			if (Math.random() < odds &&
				target.strength.DecreaseStat(opts.ideal, opts.max)) {
				Text.Add("[name] [is] suddenly a bit weaker!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, ideal, max
		export function DecSta(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), is: target.is() };
			if (Math.random() < odds &&
				target.stamina.DecreaseStat(opts.ideal, opts.max)) {
				Text.Add("[name] [is] suddenly a bit less tough!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, ideal, max
		export function DecDex(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), is: target.is() };
			if (Math.random() < odds &&
				target.dexterity.DecreaseStat(opts.ideal, opts.max)) {
				Text.Add("[name] [is] suddenly a bit clumsier!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, ideal, max
		export function DecInt(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), is: target.is() };
			if (Math.random() < odds &&
				target.intelligence.DecreaseStat(opts.ideal, opts.max)) {
				Text.Add("[name] [is] suddenly a bit dumber!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, ideal, max
		export function DecSpi(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), is: target.is() };
			if (Math.random() < odds &&
				target.spirit.DecreaseStat(opts.ideal, opts.max)) {
				Text.Add("[name] [is] suddenly a bit less stoic!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, ideal, max
		export function DecLib(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), is: target.is() };
			if (Math.random() < odds &&
				target.libido.DecreaseStat(opts.ideal, opts.max)) {
				Text.Add("[name] [is] suddenly a bit more composed!", parse);
				Text.NL();
			}
			Text.Flush();
		}

		// odds, ideal, max
		export function DecCha(target: Entity, opts: any) {
			const odds  = opts.odds || 1;
			const parse: any = { name: target.NameDesc(), is: target.is() };
			if (Math.random() < odds &&
				target.charisma.DecreaseStat(opts.ideal, opts.max)) {
				Text.Add("[name] [is] suddenly a bit less charming!", parse);
				Text.NL();
			}
			Text.Flush();
		}

	}
}

/*
 * TF ITEMS
 *
 * 'this' is an Item
 */
export class TFItem extends Item {
	public useStr: any;
	public effects: any[];
	constructor(id: string, name: string) {
		super(id, name, ItemType.Potion);
		this.Use     = TF.UseItem;
		this.useStr  = TF.UseItemDesc;
		this.effects = [];
		this.isTF    = true;
	}

	public PushEffect(func: any, opts?: any) {
		this.effects.push({ func, opts});
	}

}
