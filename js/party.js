/*
 * 
 * Container class that handles party members
 * Used for combat
 * 
 */
function Party(storage) {
	this.members = [];
	this.reserve = [];
	this.coin = 0;
	this.location = null;
	this.inventory = new Inventory();
	
	if(storage) this.FromStorage(storage);
}

Party.prototype.ToStorage = function() {
	var storage = {};
	storage["members"] = [];
	storage["reserve"] = [];
	
	if(this.InParty(player, true)) storage["members"].push("player");
	if(this.InParty(kiakai, true)) storage["members"].push("kiakai");
	
	if(this.InReserve(kiakai)) storage["reserve"].push("kiakai");
	
	storage["coin"] = this.coin;
	storage["loc"] = this.location.SaveSpot;
	storage["inv"] = this.inventory.ToStorage();
	
	return storage;
}

Party.prototype.FromStorage = function(storage) {
	if(!storage) return;
	if(storage["members"]) {
		if(storage["members"].indexOf("player") != -1) this.AddMember(player);
		if(storage["members"].indexOf("kiakai") != -1) this.AddMember(kiakai);
	}
	if(storage["reserve"]) {
		if(storage["reserve"].indexOf("kiakai") != -1) this.AddReserve(kiakai);
	}
	
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

Party.prototype.Alone = function() {
	return (this.members.length == 1);
}

Party.prototype.Two = function() {
	return (this.members.length == 2);
}

Party.prototype.InParty = function(member, onlyActive) {
	var idx = this.members.indexOf(member); // Find the index
	if(idx!=-1) return true;
	
	if(!onlyActive) {
		idx = this.reserve.indexOf(member);
		return (idx!=-1);
	}
	return false;
}

Party.prototype.GetActiveParty = function() {
	var ret = [];
	for(var i = 0; i < this.members.length; ++i)
		ret.push(this.members[i]);
	return ret;
}
Party.prototype.ClearActiveParty = function() {
	while(this.members.length > 1)
		this.SwitchOut(this.members[1]);
}
Party.prototype.SwitchInActiveParty = function(arr) {
	this.ClearActiveParty();
	for(var i = 0; i < arr.length; ++i) {
		this.SwitchIn(arr[i]);
	}
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
Party.prototype.GetRandom = function(includePlayer) {
	var len = this.members.length + this.reserve.length;
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

Party.prototype.AddMember = function(member) {
	var idx = this.members.indexOf(member); // Find the index
	if(idx==-1) {
		if(this.members.length >= 4)
			this.reserve.push(member);
		else
			this.members.push(member); // Only add if not already added
	}
	if(this == party) member.DebugMode(DEBUG);
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
	var active = this.InParty(member, true);
	var that = this;
	Text.Clear();
	Text.AddOutput("Switch [name] with who?", parse);
	
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

Party.prototype.Interact = function(preventClear) {
	if(!preventClear)
		Text.Clear();
	
	Text.AddOutput("PlaceHolder: Party");
	SetGameState(GameState.Game);
	var list = new Array();
	
	// Interacting with self opens options for masturbation etc
	for(var i = 0; i < this.members.length; i++) {
		var member = this.members[i];
		list.push({nameStr: member.name, func: member.Interact, enabled: true, image: Input.imgButtonEnabled2});
	}
	// Add reserve too
	for(var i = 0; i < this.reserve.length; i++) {
		var member = this.reserve[i];
		list.push({nameStr: member.name, func: member.Interact, enabled: true});
	}
	// Don't sort, use same order as in menu
	//list.sort( function(a, b) { return a.nameStr > b.nameStr; } );
	
	Gui.SetButtonsFromList(list, false, false, GameState.Event);
}

Party.prototype.ShowAbilities = function() {
	var list = [];
	var that = this;
	
	var ents = [];
	for(var i = 0; i < this.members.length; i++)
		ents.push(this.members[i]);
	for(var i = 0; i < this.reserve.length; i++)
		ents.push(this.reserve[i]);
	
	// Go through each member, add available abilities to list
	for(var i = 0; i < ents.length; i++) {
		var entity = ents[i];
		var abilities = entity.abilities;
		
		var pushAbilities = function(coll, jobAbilities) {
			for(var ab = 0; ab < coll.AbilitySet.length; ab++) {
				var ability = coll.AbilitySet[ab];
				if(jobAbilities && jobAbilities.HasAbility(ability)) continue;
		
				if(ability.CastInternalOOC) {
					var en = ability.enabledCondition(null, entity);
					
					Text.AddOutput("[name] can use [ability] for [cost]: [desc]<br/>",
						{name: Text.BoldColor(entity.name), ability: ability.name, cost: ability.CostStr(), desc: ability.Short()});
					
					list.push({
						nameStr : ability.name,
						enabled : en,
						obj     : { caster: entity, skill : ability },
						func    : function(obj) {
							Text.Clear();
							Text.AddOutput("Who will [name] cast [ability] on?",
								{name: obj.caster.name, ability: obj.skill.name});
							Text.Newline();
							
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
		for(coll in abilities)
			pushAbilities(abilities[coll], jobAbilities);
	}
	
	Gui.SetButtonsFromList(list);
}
