/*
 *
 * Container class that handles party members
 * Used for combat
 *
 */
function Party(storage) {
	this.members = [];
	this.reserve = [];
	this.saved   = [];
	this.temp    = [];
	this.coin = 0;
	this.location = null;
	this.inventory = new Inventory();

	if(storage) this.FromStorage(storage);
}

Party.prototype.SaveMember = function(storage, entity) {
	var str = entity.ID;
	if(this.InParty(entity))   storage["members"].push(str);
	if(this.InReserve(entity)) storage["reserve"].push(str);
	if(this.InSaved(entity))   storage["saved"].push(str);
	if(this.InTemp(entity))    storage["temp"].push(str);
}

Party.prototype.ToStorage = function() {
	var storage = {};
	storage["members"] = [];
	storage["reserve"] = [];
	storage["saved"]   = [];
	storage["temp"]    = [];

	this.SaveMember(storage, player);
	this.SaveMember(storage, kiakai);
	this.SaveMember(storage, miranda);
	this.SaveMember(storage, terry);
	this.SaveMember(storage, layla);
	this.SaveMember(storage, lei);
	this.SaveMember(storage, cveta);
	this.SaveMember(storage, gwendy);

	storage["coin"] = this.coin;
	storage["loc"]  = this.location.SaveSpot;
	storage["inv"]  = this.inventory.ToStorage();

	return storage;
}

Party.prototype.LoadMember = function(storage, entity) {
	var str = entity.ID;
	if(storage["members"].indexOf(str) != -1) this.AddMember(entity);
	if(storage["reserve"].indexOf(str) != -1) this.AddReserve(entity);
	if(storage["saved"].indexOf(str)   != -1) this.saved.push(entity);
	if(storage["temp"].indexOf(str)    != -1) this.temp.push(entity);
}

Party.prototype.FromStorage = function(storage) {
	if(!storage) return;
	storage["members"] = storage["members"] || [];
	storage["reserve"] = storage["reserve"] || [];
	storage["saved"]   = storage["saved"]   || [];
	storage["temp"]    = storage["temp"]    || [];

	this.LoadMember(storage, player);
	this.LoadMember(storage, kiakai);
	this.LoadMember(storage, miranda);
	this.LoadMember(storage, terry);
	this.LoadMember(storage, layla);
	this.LoadMember(storage, lei);
	this.LoadMember(storage, cveta);
	this.LoadMember(storage, gwendy);


	this.coin = parseInt(storage["coin"]) || this.coin;
	this.location = world.SaveSpots[storage["loc"]];
	this.inventory.FromStorage(storage["inv"] || []);
}

Party.prototype.Num = function() {
	return this.members.length;
}

Party.prototype.NumTotal = function() {
	return this.members.length + this.reserve.length;
}

Party.prototype.NumSaved = function() {
	return this.saved.length;
}

Party.prototype.Alone = function() {
	return (this.members.length == 1);
}

Party.prototype.Two = function() {
	return (this.members.length == 2);
}

Party.prototype.InParty = function(member, reserve) {
	var idx = this.members.indexOf(member); // Find the index
	if(idx!=-1) return true;

	if(reserve) {
		idx = this.reserve.indexOf(member);
		return (idx!=-1);
	}
	return false;
}

Party.prototype.Inv = function() {
	return this.inventory;
}

Party.prototype.SaveActiveParty = function() {
	this.temp = [];
	this.saved = [];
	for(var i = 0; i < this.members.length; ++i)
		this.saved.push(this.members[i]);
}

Party.prototype.ClearActiveParty = function() {
	while(this.members.length > 0)
		this.SwitchOut(this.members[0]);
}
Party.prototype.LoadActiveParty = function() {
	this.ClearActiveParty();
	for(var i = 0; i < this.saved.length; ++i)
		this.SwitchIn(this.saved[i]);
	this.saved = [];
	for(var i = 0; i < this.temp.length; i++)
		this.RemoveMember(this.temp[i]);
	this.temp = [];
}
// From "Total"
Party.prototype.Get = function(num) {
	if(num < this.members.length) return this.members[num];
	else {
		num -= this.members.length;
		if(num < this.reserve.length) return this.reserve[num];
		else return null;
	}
}
Party.prototype.CloneParty = function(reserve) {
	var ret = [];
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
Party.prototype.GetInParty = function(num) {
	if(num < this.members.length) return this.members[num];
}
Party.prototype.GetSlot = function(member) {
	for(var i=0; i < this.members.length; ++i) {
		if(this.members[i] == member) return i;
	}
	for(var i=0; i < this.reserve.length; ++i) {
		if(this.reserve[i] == member) return i + this.members.length;
	}
	return -1;
}
Party.prototype.GetRandom = function(incReserve, includePlayer) {
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

Party.prototype.InReserve = function(member) {
	var idx = this.reserve.indexOf(member); // Find the index
	return (idx!=-1);
}
Party.prototype.InSaved = function(member) {
	var idx = this.saved.indexOf(member); // Find the index
	return (idx!=-1);
}
Party.prototype.InTemp = function(member) {
	var idx = this.temp.indexOf(member); // Find the index
	return (idx!=-1);
}

Party.prototype.AddMember = function(member, temporary) {
	var idx = this.members.indexOf(member); // Find the index
	if(idx==-1) {
		if(this.members.length >= 4)
			this.AddReserve(member);
		else
			this.members.push(member); // Only add if not already added
	}
	if(this == party) member.DebugMode(DEBUG);
	if(temporary) this.temp.push(member);
}

Party.prototype.AddReserve = function(member) {
	var idx = this.reserve.indexOf(member); // Find the index
	if(idx==-1) this.reserve.push(member); // Only add if not already added
	if(this == party) member.DebugMode(DEBUG);
}

Party.prototype.RemoveMember = function(member) {
	var idx = this.members.indexOf(member);  // Find the index
	if(idx!=-1) this.members.splice(idx, 1); // Remove it if really found!
	var idx = this.reserve.indexOf(member);  // Find the index
	if(idx!=-1) this.reserve.splice(idx, 1); // Remove it if really found!
	if(this == party) member.DebugMode(false);
}

Party.prototype.SwitchPrompt = function(member) {
	var parse = {
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
				PrintDefaultOptions();
			}, enabled : true,
			tooltip: Text.Parse("Send [name] to the reserve.", parse)
		});
		for(var i = 0; i < this.reserve.length; i++) {
			var e = this.reserve[i];
			parse["name2"] = e.name;
			options.push({ nameStr : e.name,
				obj  : e,
				func : function(obj) {
					that.SwitchOut(member);
					that.SwitchIn(obj);
					PrintDefaultOptions();
				}, enabled : true,
				tooltip: Text.Parse("Switch [name] to the reserve, replacing [himher] with [name2].", parse)
			});
		}
		if(options.length == 1) {
			that.SwitchOut(member);
			PrintDefaultOptions();
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
				func : function(obj) {
					that.SwitchOut(obj);
					that.SwitchIn(member);
					PrintDefaultOptions();
				}, enabled : i != 0,
				tooltip: Text.Parse("Switch [name] into the active party, replacing [name2].", parse)
			});
		}
		if(options.length == 1) {
			that.SwitchIn(member);
			PrintDefaultOptions();
		}
		else {
			if(options.length < 4) {
				options.push({ nameStr : "+++",
					func : function() {
						that.SwitchIn(member);
						PrintDefaultOptions();
					}, enabled : true,
					tooltip: Text.Parse("Bring [name] into the active party.", parse)
				});
			}
			Gui.SetButtonsFromList(options);
		}
	}
}

Party.prototype.SwitchIn = function(member) {
	this.RemoveMember(member);
	this.AddMember(member);
}

Party.prototype.SwitchOut = function(member) {
	this.RemoveMember(member);
	this.AddReserve(member);
}

Party.prototype.RestFull = function() {
	for (var i=0; i < this.members.length; i++)
		this.members[i].RestFull();
	for (var i=0; i < this.reserve.length; i++)
		this.reserve[i].RestFull();
}

Party.prototype.Sleep = function() {
	for (var i=0; i < this.members.length; i++)
		this.members[i].Sleep();
	for (var i=0; i < this.reserve.length; i++)
		this.reserve[i].Sleep();
}

Party.prototype.Interact = function(preventClear, switchSpot, back) {
	var parse = {

	};

	if(!preventClear)
		Text.Clear();

	SetGameState(GameState.Game);
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
					var parse = {
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

Party.prototype.ShowAbilities = function() {
	var list = [];
	var that = this;

	var ents = [];
	for(var i = 0; i < this.members.length; i++)
		ents.push(this.members[i]);

	// Go through each member, add available abilities to list
	for(var i = 0; i < ents.length; i++) {
		var entity = ents[i];
		var abilities = entity.abilities;

		var pushAbilities = function(coll, jobAbilities) {
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
						func    : function(obj) {
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
									func    : function(t) {
										obj.skill.UseOutOfCombat(obj.caster, t);
									},
									enabled : true,
									obj     : t
								});
							};

							Gui.SetButtonsFromList(target, true, ShowAbilities);
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
