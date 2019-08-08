/*
 *
 * Container class that handles party members
 * Used for combat
 *
 */

import * as _ from 'lodash';

import { Inventory } from './inventory';
import { GetDEBUG } from '../app';
import { Input } from './input';
import { Text } from './text';
import { Gui } from './gui';
import { GAME, WORLD } from './GAME';
import { SetGameState, GameState } from './gamestate';
import { Entity } from './entity';

export class Party {
	members : any[];
	reserve : any[];
	saved : any[];
	temp : any[];
	coin : number;
	location : any;
	inventory : Inventory;

	constructor(storage? : any) {
		this.members = [];
		this.reserve = [];
		this.saved   = [];
		this.temp    = [];
		this.coin = 0;
		this.location = null;
		this.inventory = new Inventory();

		if(storage) this.FromStorage(storage);
	}
		
	SaveMember(storage : any, entity : Entity) {
		let str = entity.ID;
		if(this.InParty(entity))   storage["members"].push(str);
		if(this.InReserve(entity)) storage["reserve"].push(str);
		if(this.InSaved(entity))   storage["saved"].push(str);
		if(this.InTemp(entity))    storage["temp"].push(str);
	}

	ToStorage() {
		let storage : any = {};
		storage["members"] = [];
		storage["reserve"] = [];
		storage["saved"]   = [];
		storage["temp"]    = [];

		this.SaveMember(storage, GAME().player);
		this.SaveMember(storage, GAME().kiakai);
		this.SaveMember(storage, GAME().miranda);
		this.SaveMember(storage, GAME().terry);
		this.SaveMember(storage, GAME().layla);
		this.SaveMember(storage, GAME().lei);
		this.SaveMember(storage, GAME().cveta);
		this.SaveMember(storage, GAME().gwendy);

		storage["coin"] = this.coin;
		storage["loc"]  = this.location.SaveSpot;
		storage["inv"]  = this.inventory.ToStorage();

		return storage;
	}

	LoadMember(storage : any, entity : Entity) {
		var str = entity.ID;
		if(storage["members"].indexOf(str) != -1) this.AddMember(entity);
		if(storage["reserve"].indexOf(str) != -1) this.AddReserve(entity);
		if(storage["saved"].indexOf(str)   != -1) this.saved.push(entity);
		if(storage["temp"].indexOf(str)    != -1) this.temp.push(entity);
	}

	FromStorage(storage : any) {
		if(!storage) return;
		storage["members"] = storage["members"] || [];
		storage["reserve"] = storage["reserve"] || [];
		storage["saved"]   = storage["saved"]   || [];
		storage["temp"]    = storage["temp"]    || [];

		this.LoadMember(storage, GAME().player);
		this.LoadMember(storage, GAME().kiakai);
		this.LoadMember(storage, GAME().miranda);
		this.LoadMember(storage, GAME().terry);
		this.LoadMember(storage, GAME().layla);
		this.LoadMember(storage, GAME().lei);
		this.LoadMember(storage, GAME().cveta);
		this.LoadMember(storage, GAME().gwendy);


		this.coin = parseInt(storage["coin"]) || this.coin;
		this.location = WORLD().SaveSpots[storage["loc"]];
		this.inventory.FromStorage(storage["inv"] || []);
	}

	Num() : number {
		return this.members.length;
	}

	NumTotal() : number {
		return this.members.length + this.reserve.length;
	}

	NumSaved() : number {
		return this.saved.length;
	}

	Alone() : boolean {
		return (this.members.length == 1);
	}

	Two() : boolean {
		return (this.members.length == 2);
	}

	InParty(member : Entity, reserve? : boolean) {
		var idx = this.members.indexOf(member); // Find the index
		if(idx!=-1) return true;

		if(reserve) {
			idx = this.reserve.indexOf(member);
			return (idx!=-1);
		}
		return false;
	}

	Inv() : Inventory {
		return this.inventory;
	}

	SaveActiveParty() {
		this.temp = [];
		this.saved = [];
		for(var i = 0; i < this.members.length; ++i)
			this.saved.push(this.members[i]);
	}

	ClearActiveParty() {
		while(this.members.length > 0)
			this.SwitchOut(this.members[0]);
	}
	LoadActiveParty() {
		this.ClearActiveParty();
		for(var i = 0; i < this.saved.length; ++i)
			this.SwitchIn(this.saved[i]);
		this.saved = [];
		for(var i = 0; i < this.temp.length; i++)
			this.RemoveMember(this.temp[i]);
		this.temp = [];
	}
	// From "Total"
	Get(num : number) : Entity {
		if(num < this.members.length) return this.members[num];
		else {
			num -= this.members.length;
			if(num < this.reserve.length) return this.reserve[num];
			else return null;
		}
	}
	CloneParty(reserve? : boolean) {
		let ret : Entity[] = [];
		_.each(this.members, function(m) {
			ret.push(m);
		});
		if(reserve) {
			_.each(this.reserve, function(m) {
				ret.push(m);
			});
		}
		return ret;
	}
	GetInParty(num : number) : Entity {
		if(num < this.members.length) return this.members[num];
	}
	GetSlot(member : number) : number {
		for(var i=0; i < this.members.length; ++i) {
			if(this.members[i] == member) return i;
		}
		for(var i=0; i < this.reserve.length; ++i) {
			if(this.reserve[i] == member) return i + this.members.length;
		}
		return -1;
	}
	GetRandom(incReserve? : boolean, includePlayer? : boolean) : Entity {
		var len = this.members.length;
		if(incReserve)
			len += this.reserve.length;
		if(!includePlayer) {
			len--;
			if(len <= 0) return null;
		}
		var num = Math.random() * len;
		num = Math.floor(num);
		// Assume player is always first pos
		if(!includePlayer) num++;

		return this.Get(num);
	}

	InReserve(member : Entity) : boolean {
		var idx = this.reserve.indexOf(member); // Find the index
		return (idx!=-1);
	}
	InSaved(member : Entity) : boolean {
		var idx = this.saved.indexOf(member); // Find the index
		return (idx!=-1);
	}
	InTemp(member : Entity) : boolean {
		var idx = this.temp.indexOf(member); // Find the index
		return (idx!=-1);
	}

	AddMember(member : Entity, temporary? : boolean) {
		var idx = this.members.indexOf(member); // Find the index
		if(idx==-1) {
			if(this.members.length >= 4)
				this.AddReserve(member);
			else
				this.members.push(member); // Only add if not already added
		}
		if(this == GAME().party) member.DebugMode(GetDEBUG());
		if(temporary) this.temp.push(member);
	}

	AddReserve(member : Entity) {
		var idx = this.reserve.indexOf(member); // Find the index
		if(idx==-1) this.reserve.push(member); // Only add if not already added
		if(this == GAME().party) member.DebugMode(GetDEBUG());
	}

	RemoveMember(member : Entity) {
		var idx = this.members.indexOf(member);  // Find the index
		if(idx!=-1) this.members.splice(idx, 1); // Remove it if really found!
		var idx = this.reserve.indexOf(member);  // Find the index
		if(idx!=-1) this.reserve.splice(idx, 1); // Remove it if really found!
		if(this == GAME().party) member.DebugMode(false);
	}

	SwitchPrompt(member : Entity) {
		var parse : any = {
			name:   member.name,
			himher: member.himher(),
			HeShe:  member.HeShe()
		};
		var active = this.InParty(member);
		var that = this;
		Text.Clear();
		Text.Add("Switch [name] with who?", parse);
		Text.Flush();

		if(active) {
			var options = [];
			options.push({ nameStr : "---",
				func : function() {
					that.SwitchOut(member);
					Gui.PrintDefaultOptions();
				}, enabled : true,
				tooltip: Text.Parse("Send [name] to the reserve.", parse)
			});
			for(var i = 0; i < this.reserve.length; i++) {
				var e = this.reserve[i];
				parse["name2"] = e.name;
				options.push({ nameStr : e.name,
					obj  : e,
					func : function(obj : Entity) {
						that.SwitchOut(member);
						that.SwitchIn(obj);
						Gui.PrintDefaultOptions();
					}, enabled : true,
					tooltip: Text.Parse("Switch [name] to the reserve, replacing [himher] with [name2].", parse)
				});
			}
			if(options.length == 1) {
				that.SwitchOut(member);
				Gui.PrintDefaultOptions();
			}
			else
				Gui.SetButtonsFromList(options);
		}
		else {
			var options = [];
			for(var i = 0; i < this.members.length; i++) {
				var e = this.members[i];
				options.push({ nameStr : e.name,
					obj  : e,
					func : function(obj : Entity) {
						that.SwitchOut(obj);
						that.SwitchIn(member);
						Gui.PrintDefaultOptions();
					}, enabled : i != 0,
					tooltip: Text.Parse("Switch [name] into the active party, replacing [name2].", parse)
				});
			}
			if(options.length == 1) {
				that.SwitchIn(member);
				Gui.PrintDefaultOptions();
			}
			else {
				if(options.length < 4) {
					options.push({ nameStr : "+++",
						func : function() {
							that.SwitchIn(member);
							Gui.PrintDefaultOptions();
						}, enabled : true,
						tooltip: Text.Parse("Bring [name] into the active party.", parse)
					});
				}
				Gui.SetButtonsFromList(options);
			}
		}
	}

	SwitchIn(member : Entity) {
		this.RemoveMember(member);
		this.AddMember(member);
	}

	SwitchOut(member : Entity) {
		this.RemoveMember(member);
		this.AddReserve(member);
	}

	RestFull() {
		for (var i=0; i < this.members.length; i++)
			this.members[i].RestFull();
		for (var i=0; i < this.reserve.length; i++)
			this.reserve[i].RestFull();
	}

	Sleep() {
		for (var i=0; i < this.members.length; i++)
			this.members[i].Sleep();
		for (var i=0; i < this.reserve.length; i++)
			this.reserve[i].Sleep();
	}

	Interact(preventClear? : boolean, switchSpot? : boolean, back? : any) {
		var parse = {

		};

		if(!preventClear)
			Text.Clear();

		SetGameState(GameState.Game, Gui);
		var list = new Array();

		// Interacting with self opens options for masturbation etc
		Text.Add("<table class='party' style='width:[w]%'>", {w: this.members.length > 1 ? "100" : "50"});
		Text.Add("<tr>");
		for(var i = 0; i < this.members.length; i++) {
			var member = this.members[i];
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
				if(member.currentJob) {
					var jd  = member.jobs[member.currentJob.name];
					if(jd) {
						let parse : any = {
							job        : jd.job.Short(this),
							lvl        : jd.level,
							maxlvl     : jd.job.levels.length + 1
						};

						// Check for maxed out job
						var master   = jd.job.Master(member);
						var toLevel;
						if(!master) {
							var newLevel = jd.job.levels[jd.level-1];
							toLevel      = newLevel.expToLevel * jd.mult;
						}

						Text.Add("<tr><td><b>Job:</b></td><td>");
						if(master)
							Text.Add("<b>(MASTER) [job]</b></td></tr>", parse);
						else
							Text.Add("[job] level [lvl]/[maxlvl] (exp " + Math.floor(jd.experience) + "/" + Math.floor(toLevel) + ")</td></tr>", parse);
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
			if(i == 1)
				Text.Add("</tr><tr>");

			list.push({
				nameStr: member.name,
				func: member.Interact,
				obj: switchSpot,
				enabled: true,
				image: Input.imgButtonEnabled2
			});
		}
		Text.Add("</tr>");
		Text.Add("</table>");
		if(switchSpot) {
			// Add reserve too
			for(var i = 0; i < this.reserve.length; i++) {
				var member = this.reserve[i];
				list.push({
					nameStr: member.name,
					func: member.Interact,
					obj: switchSpot,
					enabled: true
				});
			}
		}
		// Don't sort, use same order as in menu
		//list.sort( function(a, b) { return a.nameStr > b.nameStr; } );

		Gui.SetButtonsFromList(list, back, false, GameState.Event);

		Text.Flush();
	}

	ShowAbilities() {
		var list : any[] = [];
		var that = this;

		var ents = [];
		for(var i = 0; i < this.members.length; i++)
			ents.push(this.members[i]);

		// Go through each member, add available abilities to list
		for(var i = 0; i < ents.length; i++) {
			var entity = ents[i];
			var abilities = entity.abilities;

			var pushAbilities = function(coll : any, jobAbilities? : any) {
				for(var ab = 0; ab < coll.AbilitySet.length; ab++) {
					var ability = coll.AbilitySet[ab];
					if(jobAbilities && jobAbilities.HasAbility(ability)) continue;

					if(ability.OOC) {
						var en = ability.enabledCondition(null, entity);

						Text.Add("[name] can use [ability] for [cost]: [desc]<br>",
							{name: Text.Bold(entity.name), ability: ability.name, cost: ability.CostStr(), desc: ability.Short()});

						list.push({
							nameStr : ability.name,
							enabled : en,
							obj     : { caster: entity, skill : ability },
							func    : function(obj : any) {
								Text.Clear();
								Text.Add("Who will [name] cast [ability] on?",
									{name: obj.caster.name, ability: obj.skill.name});
								Text.NL();
								Text.Flush();

								var target = new Array();
								for(var i=0,j=that.members.length; i<j; i++){
									var t = that.members[i];
									target.push({
										nameStr : t.name,
										func    : function(t : Entity) {
											obj.skill.UseOutOfCombat(obj.caster, t);
										},
										enabled : true,
										obj     : t
									});
								};

								Gui.SetButtonsFromList(target, true, Party.prototype.ShowAbilities);
							}
						});
					}
				}
			}
			var jobAbilities = entity.currentJob ? entity.currentJob.abilities : null;
			if(jobAbilities)
				pushAbilities(jobAbilities);
			for(var coll in abilities)
				pushAbilities(abilities[coll], jobAbilities);
		}
		Text.Flush();

		Gui.SetButtonsFromList(list);
	}

}
