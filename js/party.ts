/*
 *
 * Container class that handles party members
 * Used for combat
 *
 */

import * as _ from "lodash";

import { GetDEBUG } from "../app";
import { Images } from "./assets";
import { Entity } from "./entity";
import { GAME, WORLD } from "./GAME";
import { GameState, SetGameState } from "./gamestate";
import { Gui } from "./gui";
import { Inventory } from "./inventory";
import { ILocation } from "./location";
import { Text } from "./text";

export class Party {
	public members: Entity[];
	public reserve: Entity[];
	public saved: Entity[];
	public temp: Entity[];
	public coin: number;
	public location: ILocation;
	public inventory: Inventory;

	constructor(storage?: any) {
		this.members = [];
		this.reserve = [];
		this.saved   = [];
		this.temp    = [];
		this.coin = 0;
		this.inventory = new Inventory();

		if (storage) { this.FromStorage(storage); }
	}

	public SaveMember(storage: any, entity: Entity) {
		const str = entity.ID;
		if (this.InParty(entity)) {   storage.members.push(str); }
		if (this.InReserve(entity)) { storage.reserve.push(str); }
		if (this.InSaved(entity)) {   storage.saved.push(str); }
		if (this.InTemp(entity)) {    storage.temp.push(str); }
	}

	public ToStorage() {
		const storage: any = {};
		storage.members = [];
		storage.reserve = [];
		storage.saved   = [];
		storage.temp    = [];

		this.SaveMember(storage, GAME().player);
		this.SaveMember(storage, GAME().kiakai);
		this.SaveMember(storage, GAME().miranda);
		this.SaveMember(storage, GAME().terry);
		this.SaveMember(storage, GAME().layla);
		this.SaveMember(storage, GAME().lei);
		this.SaveMember(storage, GAME().cveta);
		this.SaveMember(storage, GAME().gwendy);

		storage.coin = this.coin;
		storage.loc  = this.location.SaveSpot;
		storage.inv  = this.inventory.ToStorage();

		return storage;
	}

	public LoadMember(storage: any, entity: Entity) {
		const str = entity.ID;
		if (storage.members.indexOf(str) !== -1) { this.AddMember(entity); }
		if (storage.reserve.indexOf(str) !== -1) { this.AddReserve(entity); }
		if (storage.saved.indexOf(str)   !== -1) { this.saved.push(entity); }
		if (storage.temp.indexOf(str)    !== -1) { this.temp.push(entity); }
	}

	public FromStorage(storage: any) {
		if (!storage) { return; }
		storage.members = storage.members || [];
		storage.reserve = storage.reserve || [];
		storage.saved   = storage.saved   || [];
		storage.temp    = storage.temp    || [];

		this.LoadMember(storage, GAME().player);
		this.LoadMember(storage, GAME().kiakai);
		this.LoadMember(storage, GAME().miranda);
		this.LoadMember(storage, GAME().terry);
		this.LoadMember(storage, GAME().layla);
		this.LoadMember(storage, GAME().lei);
		this.LoadMember(storage, GAME().cveta);
		this.LoadMember(storage, GAME().gwendy);

		this.coin = parseInt(storage.coin, 10) || this.coin;
		this.location = WORLD().SaveSpots[storage.loc];
		this.inventory.FromStorage(storage.inv || []);
	}

	public Num(): number {
		return this.members.length;
	}

	public NumTotal(): number {
		return this.members.length + this.reserve.length;
	}

	public NumSaved(): number {
		return this.saved.length;
	}

	public Alone(): boolean {
		return (this.members.length === 1);
	}

	public Two(): boolean {
		return (this.members.length === 2);
	}

	public InParty(member: Entity, reserve?: boolean) {
		let idx = this.members.indexOf(member); // Find the index
		if (idx !== -1) { return true; }

		if (reserve) {
			idx = this.reserve.indexOf(member);
			return (idx !== -1);
		}
		return false;
	}

	public Inv(): Inventory {
		return this.inventory;
	}

	public SaveActiveParty() {
		this.temp = [];
		this.saved = [];
		for (const member of this.members) {
			this.saved.push(member);
		}
	}

	public ClearActiveParty() {
		while (this.members.length > 0) {
			this.SwitchOut(this.members[0]);
		}
	}
	public LoadActiveParty() {
		this.ClearActiveParty();
		for (const saved of this.saved) {
			this.SwitchIn(saved);
		}
		this.saved = [];
		for (const temp of this.temp) {
			this.RemoveMember(temp);
		}
		this.temp = [];
	}
	// From "Total"
	public Get(num: number): Entity {
		if (num < this.members.length) { return this.members[num]; } else {
			num -= this.members.length;
			if (num < this.reserve.length) { return this.reserve[num]; } else { return undefined; }
		}
	}
	public CloneParty(reserve?: boolean) {
		const ret: Entity[] = [];
		_.each(this.members, (m) => {
			ret.push(m);
		});
		if (reserve) {
			_.each(this.reserve, (m) => {
				ret.push(m);
			});
		}
		return ret;
	}
	public GetInParty(num: number): Entity {
		if (num < this.members.length) { return this.members[num]; }
	}
	public GetSlot(member: Entity): number {
		for (let i = 0; i < this.members.length; ++i) {
			if (this.members[i] === member) { return i; }
		}
		for (let i = 0; i < this.reserve.length; ++i) {
			if (this.reserve[i] === member) { return i + this.members.length; }
		}
		return -1;
	}
	public GetRandom(incReserve?: boolean, includePlayer?: boolean): Entity {
		let len = this.members.length;
		if (incReserve) {
			len += this.reserve.length;
		}
		if (!includePlayer) {
			len--;
			if (len <= 0) { return undefined; }
		}
		let num = Math.random() * len;
		num = Math.floor(num);
		// Assume player is always first pos
		if (!includePlayer) { num++; }

		return this.Get(num);
	}

	public InReserve(member: Entity): boolean {
		const idx = this.reserve.indexOf(member); // Find the index
		return (idx !== -1);
	}
	public InSaved(member: Entity): boolean {
		const idx = this.saved.indexOf(member); // Find the index
		return (idx !== -1);
	}
	public InTemp(member: Entity): boolean {
		const idx = this.temp.indexOf(member); // Find the index
		return (idx !== -1);
	}

	public AddMember(member: Entity, temporary?: boolean) {
		const idx = this.members.indexOf(member); // Find the index
		if (idx === -1) {
			if (this.members.length >= 4) {
				this.AddReserve(member);
			} else {
				this.members.push(member);
			} // Only add if not already added
		}
		if (this === GAME().party) { member.DebugMode(GetDEBUG()); }
		if (temporary) { this.temp.push(member); }
	}

	public AddReserve(member: Entity) {
		const idx = this.reserve.indexOf(member); // Find the index
		if (idx === -1) { this.reserve.push(member); } // Only add if not already added
		if (this === GAME().party) { member.DebugMode(GetDEBUG()); }
	}

	public RemoveMember(member: Entity) {
		let idx = this.members.indexOf(member);  // Find the index
		if (idx !== -1) { this.members.splice(idx, 1); } // Remove it if really found!
		idx = this.reserve.indexOf(member);  // Find the index
		if (idx !== -1) { this.reserve.splice(idx, 1); } // Remove it if really found!
		if (this === GAME().party) { member.DebugMode(false); }
	}

	public SwitchPrompt(member: Entity) {
		const parse: any = {
			name:   member.name,
			himher: member.himher(),
			HeShe:  member.HeShe(),
		};
		const active = this.InParty(member);
		const that = this;
		Text.Clear();
		Text.Add("Switch [name] with who?", parse);
		Text.Flush();

		if (active) {
			const options = [];
			options.push({ nameStr : "---",
				func() {
					that.SwitchOut(member);
					Gui.PrintDefaultOptions();
				}, enabled : true,
				tooltip: Text.Parse("Send [name] to the reserve.", parse),
			});
			for (const e of this.reserve) {
				parse.name2 = e.name;
				options.push({ nameStr : e.name,
					obj  : e,
					func(obj: Entity) {
						that.SwitchOut(member);
						that.SwitchIn(obj);
						Gui.PrintDefaultOptions();
					}, enabled : true,
					tooltip: Text.Parse("Switch [name] to the reserve, replacing [himher] with [name2].", parse),
				});
			}
			if (options.length === 1) {
				that.SwitchOut(member);
				Gui.PrintDefaultOptions();
			} else {
				Gui.SetButtonsFromList(options);
			}
		} else {
			const options = [];
			let i = 0;
			for (const e of this.members) {
				options.push({ nameStr : e.name,
					obj  : e,
					func(obj: Entity) {
						that.SwitchOut(obj);
						that.SwitchIn(member);
						Gui.PrintDefaultOptions();
					}, enabled : i !== 0,
					tooltip: Text.Parse("Switch [name] into the active party, replacing [name2].", parse),
				});
				i++;
			}
			if (options.length === 1) {
				that.SwitchIn(member);
				Gui.PrintDefaultOptions();
			} else {
				if (options.length < 4) {
					options.push({ nameStr : "+++",
						func() {
							that.SwitchIn(member);
							Gui.PrintDefaultOptions();
						}, enabled : true,
						tooltip: Text.Parse("Bring [name] into the active party.", parse),
					});
				}
				Gui.SetButtonsFromList(options);
			}
		}
	}

	public SwitchIn(member: Entity) {
		this.RemoveMember(member);
		this.AddMember(member);
	}

	public SwitchOut(member: Entity) {
		this.RemoveMember(member);
		this.AddReserve(member);
	}

	public RestFull() {
		for (const member of this.members) {
			member.RestFull();
		}
		for (const member of this.reserve) {
			member.RestFull();
		}
	}

	public Sleep() {
		for (const member of this.members) {
			member.Sleep();
		}
		for (const member of this.reserve) {
			member.Sleep();
		}
	}

	public Interact(preventClear?: boolean, switchSpot?: boolean, back?: CallableFunction) {
		const parse: any = {

		};

		if (!preventClear) {
			Text.Clear();
		}

		SetGameState(GameState.Game, Gui);
		const list = new Array();

		// Interacting with self opens options for masturbation etc
		Text.Add("<table class='party' style='width:[w]%'>", {w: this.members.length > 1 ? "100" : "50"});
		Text.Add("<tr>");
		let i = 0;
		for (const member of this.members) {
			Text.Add("<td>");
			Text.Add("<p><center style='font-size: x-large'><b>" + member.name + "</b></center></p>");
			Text.Add("<table class='party' style='width:100%'>");
			Text.Add("<tr><td><b>HP:</b></td><td>" + Math.floor(member.curHp) + "/" + Math.floor(member.HP()) + "</td></tr>", parse);
			Text.Add("<tr><td><b>SP:</b></td><td>" + Math.floor(member.curSp) + "/" + Math.floor(member.SP()) + "</td></tr>", parse);
			Text.Add("<tr><td><b>Lust:</b></td><td>" + Math.floor(member.curLust) + "/" + Math.floor(member.Lust()) + "</td></tr>", parse);
			Text.Add("<tr><td><b>Level:</b></td><td>" + member.level + "</td></tr>", parse);
			Text.Add("<tr><td><b>Exp:</b></td><td>"       + Math.floor(member.experience) + "/" + Math.floor(member.expToLevel) + "</td></tr>");
			Text.Add("<tr><td><b>SexLevel:</b></td><td>" + member.sexlevel + "</td></tr>", parse);
			Text.Add("<tr><td><b>S.Exp:</b></td><td>"     + Math.floor(member.sexperience) + "/" + Math.floor(member.sexpToLevel) + "</td></tr>");
			if (member.currentJob) {
					const jd  = member.jobs[member.currentJob.name];
					if (jd) {
						const parse: any = {
							job        : jd.job.Short(this),
							lvl        : jd.level,
							maxlvl     : jd.job.levels.length + 1,
						};

						// Check for maxed out job
						const master   = jd.job.Master(member);
						let toLevel;
						if (!master) {
							const newLevel = jd.job.levels[jd.level - 1];
							toLevel      = newLevel.expToLevel * jd.mult;
						}

						Text.Add("<tr><td><b>Job:</b></td><td>");
						if (master) {
							Text.Add("<b>(MASTER) [job]</b></td></tr>", parse);
						} else {
							Text.Add("[job] level [lvl]/[maxlvl] (exp " + Math.floor(jd.experience) + "/" + Math.floor(toLevel) + ")</td></tr>", parse);
						}
					}
				}
			Text.Add("<tr><td><b>Strength:</b></td><td>"     + Math.floor(member.Str()) + "</td></tr>");
			Text.Add("<tr><td><b>Stamina:</b></td><td>"      + Math.floor(member.Sta()) + "</td></tr>");
			Text.Add("<tr><td><b>Dexterity:</b></td><td>"    + Math.floor(member.Dex()) + "</td></tr>");
			Text.Add("<tr><td><b>Intelligence:</b></td><td>" + Math.floor(member.Int()) + "</td></tr>");
			Text.Add("<tr><td><b>Spirit:</b></td><td>"       + Math.floor(member.Spi()) + "</td></tr>");
			Text.Add("<tr><td><b>Libido:</b></td><td>"       + Math.floor(member.Lib()) + "</td></tr>");
			Text.Add("<tr><td><b>Charisma:</b></td><td>"     + Math.floor(member.Cha()) + "</td></tr>");
			Text.Add("</table>");
			Text.Add("</td>");
			if (i === 1) {
				Text.Add("</tr><tr>");
			}

			list.push({
				nameStr: member.name,
				func: member.Interact,
				obj: switchSpot,
				enabled: true,
				image: Images.imgButtonEnabled2,
			});
			i++;
		}
		Text.Add("</tr>");
		Text.Add("</table>");
		if (switchSpot) {
			// Add reserve too
			for (const member of this.reserve) {
				list.push({
					nameStr: member.name,
					func: member.Interact,
					obj: switchSpot,
					enabled: true,
				});
			}
		}
		// Don't sort, use same order as in menu
		// list.sort( function(a, b) { return a.nameStr > b.nameStr; } );

		Gui.SetButtonsFromList(list, back !== undefined, back, GameState.Event);

		Text.Flush();
	}

	public ShowAbilities() {
		const list: any[] = [];
		const that = this;

		const ents = [];
		for (const member of this.members) {
			ents.push(member);
		}

		// Go through each member, add available abilities to list
		for (const entity of ents) {
			const abilities = entity.abilities;

			const pushAbilities = (coll: any, jobAbilities?: any) => {
				for (const ability of coll.AbilitySet) {
					if (jobAbilities && jobAbilities.HasAbility(ability)) { continue; }

					if (ability.OOC) {
						const en = ability.enabledCondition(undefined, entity);

						Text.Add("[name] can use [ability] for [cost]: [desc]<br>",
							{name: Text.Bold(entity.name), ability: ability.name, cost: ability.CostStr(), desc: ability.Short()});

						list.push({
							nameStr : ability.name,
							enabled : en,
							obj     : { caster: entity, skill : ability },
							func(obj: any) {
								Text.Clear();
								Text.Add("Who will [name] cast [ability] on?",
									{name: obj.caster.name, ability: obj.skill.name});
								Text.NL();
								Text.Flush();

								const target = new Array();
								for (let i = 0, j = that.members.length; i < j; i++) {
									const t = that.members[i];
									target.push({
										nameStr : t.name,
										func(t: Entity) {
											obj.skill.UseOutOfCombat(obj.caster, t);
										},
										enabled : true,
										obj     : t,
									});
								}

								Gui.SetButtonsFromList(target, true, Party.prototype.ShowAbilities);
							},
						});
					}
				}
			};
			const jobAbilities = entity.currentJob ? entity.currentJob.abilities : undefined;
			if (jobAbilities) {
				pushAbilities(jobAbilities);
			}
			_.forIn(abilities, (value, key) => {
				pushAbilities(value, jobAbilities);
			});
		}
		Text.Flush();

		Gui.SetButtonsFromList(list);
	}

}
