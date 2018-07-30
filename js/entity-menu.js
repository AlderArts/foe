
Entity.prototype.InteractDefault = function(options, switchSpot, enableEquip, enableStats, enableJob, enableSwitch) {
	var that = this;
	options.push({ nameStr: "Equip",
		func : function() {
			that.EquipPrompt(that.Interact);
		}, enabled : enableEquip
	});
	options.push({ nameStr: that.pendingStatPoints != 0 ? "Level up" : "Stats",
		func : function() {
			that.LevelUpPrompt(that.Interact);
		}, enabled : enableStats,
		image : that.pendingStatPoints != 0 ? Images.imgButtonEnabled2 : null
	});
	options.push({ nameStr: "Job",
		func : function() {
			that.JobPrompt(that.Interact);
		}, enabled : enableJob
	});
	if(switchSpot) {
		options.push({ nameStr: party.InParty(that) ? "Switch out" : "Switch in",
			func : function() {
				party.SwitchPrompt(that);
			}, enabled : enableSwitch,
			tooltip: party.InParty(that) ? "Send to reserve." : "Switch into active party."
		});
	}
}

Entity.prototype.LevelUpPrompt = function(backFunc) {
	Text.Clear();

	Text.Add("[name] has [points] stat points pending.",
		{name: this.name, points: this.pendingStatPoints != 0 ? Text.Bold(this.pendingStatPoints) : "no"});

	Text.NL();

	this.SetLevelBonus();

	Text.Add("<table class='party' style='width:50%'>");
	Text.Add("<tr><td><b>Level:</b></td><td>"     + Math.floor(this.level) + "</td></tr>");
	Text.Add("<tr><td><b>Exp:</b></td><td>"       + Math.floor(this.experience) + "/" + Math.floor(this.expToLevel) + "</td></tr>");
	Text.Add("<tr><td><b>Sex level:</b></td><td>" + Math.floor(this.sexlevel) + "</td></tr>");
	Text.Add("<tr><td><b>S.Exp:</b></td><td>"     + Math.floor(this.sexperience) + "/" + Math.floor(this.sexpToLevel) + "</td></tr>");
	if(this.currentJob) {
		var jd  = this.jobs[this.currentJob.name];
		if(jd) {
			var parse = {
				job        : jd.job.Short(this),
				lvl        : jd.level,
				maxlvl     : jd.job.levels.length + 1
			};

			// Check for maxed out job
			var master   = jd.job.Master(this);
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
	Text.Add("<tr><td><b>HP:</b></td><td>"           + Math.floor(this.HP())   + " (Rank " + this.maxHp.GrowthRank() + ")</td></tr>");
	Text.Add("<tr><td><b>SP:</b></td><td>"           + Math.floor(this.SP())   + " (Rank " + this.maxSp.GrowthRank() + ")</td></tr>");
	Text.Add("<tr><td><b>Lust:</b></td><td>"         + Math.floor(this.Lust()) + " (Rank " + this.maxLust.GrowthRank() + ")</td></tr>");
	Text.Add("<tr><td><b>Strength:</b></td><td>"     + Math.floor(this.Str())  + " (Rank " + this.strength.GrowthRank() + ")</td></tr>");
	Text.Add("<tr><td><b>Stamina:</b></td><td>"      + Math.floor(this.Sta())  + " (Rank " + this.stamina.GrowthRank() + ")</td></tr>");
	Text.Add("<tr><td><b>Dexterity:</b></td><td>"    + Math.floor(this.Dex())  + " (Rank " + this.dexterity.GrowthRank() + ")</td></tr>");
	Text.Add("<tr><td><b>Intelligence:</b></td><td>" + Math.floor(this.Int())  + " (Rank " + this.intelligence.GrowthRank() + ")</td></tr>");
	Text.Add("<tr><td><b>Spirit:</b></td><td>"       + Math.floor(this.Spi())  + " (Rank " + this.spirit.GrowthRank() + ")</td></tr>");
	Text.Add("<tr><td><b>Libido:</b></td><td>"       + Math.floor(this.Lib())  + " (Rank " + this.libido.GrowthRank() + ")</td></tr>");
	Text.Add("<tr><td><b>Charisma:</b></td><td>"     + Math.floor(this.Cha())  + " (Rank " + this.charisma.GrowthRank() + ")</td></tr>");

	Text.Add("</table>");
	Text.NL();

	if(this.currentJob) {
		Text.Add("Job abilities:<br>", null, 'bold');
		var abSet = this.currentJob.abilities;

		for(var i = 0; i < abSet.AbilitySet.length; i++) {
			var ability = abSet.AbilitySet[i];
			Text.Add("[ability] ([cost]): [desc]<br>",
				{ability: ability.name, cost: ability.CostStr(), desc: ability.Short()});
		}
		Text.Add("<br>");
	}
	Text.Add("Known abilities:<br>", null, 'bold');
	for(var set in this.abilities) {
		var abSet = this.abilities[set];

		for(var i = 0; i < abSet.AbilitySet.length; i++) {
			var ability = abSet.AbilitySet[i];
			Text.Add("[ability] ([cost]): [desc]<br>",
				{ability: ability.name, cost: ability.CostStr(), desc: ability.Short()});
		}
	}

	Text.Flush();

	var that = this;

	if(this.pendingStatPoints <= 0) {
		Gui.NextPrompt(backFunc);
		return;
	}

	var options = new Array();
	options.push({ nameStr: "Strength",
		func : function() {
			that.strength.growth += Stat.growthPerPoint;
			that.pendingStatPoints--;
			that.LevelUpPrompt(backFunc);
		}, enabled : true,
		tooltip : "A person with high <b>strength</b> can deal a massive amount of physical damage."
	});
	options.push({ nameStr: "Stamina",
		func : function() {
			that.stamina.growth += Stat.growthPerPoint;
			that.pendingStatPoints--;
			that.LevelUpPrompt(backFunc);
		}, enabled : true,
		tooltip : "A person with high <b>stamina</b> can take a large amount of punishment. It's most effective against physical attacks, but affects other types of defence as well."
	});
	options.push({ nameStr: "Dexterity",
		func : function() {
			that.dexterity.growth += Stat.growthPerPoint;
			that.pendingStatPoints--;
			that.LevelUpPrompt(backFunc);
		}, enabled : true,
		tooltip : "A person with high <b>dexterity</b> can deftly evade enemy attacks, and is better at landing their blows. The swifter a person is, the quicker they are to act."
	});
	options.push({ nameStr: "Intelligence",
		func : function() {
			that.intelligence.growth += Stat.growthPerPoint;
			that.pendingStatPoints--;
			that.LevelUpPrompt(backFunc);
		}, enabled : true,
		tooltip : "Someone with high <b>intelligence</b> is very sharp, and can deal a massive amount of damage with spells. They are also able to act more quickly, as they don't have to spend as much time thinking up their battle plan."
	});
	options.push({ nameStr: "Spirit",
		func : function() {
			that.spirit.growth += Stat.growthPerPoint;
			that.pendingStatPoints--;
			that.LevelUpPrompt(backFunc);
		}, enabled : true,
		tooltip : "A person with high <b>spirit</b> is very stoic - a pillar of willpower. They can take large amounts of magical damage before they fall."
	});
	options.push({ nameStr: "Libido",
		func : function() {
			that.libido.growth += Stat.growthPerPoint;
			that.pendingStatPoints--;
			that.LevelUpPrompt(backFunc);
		}, enabled : true,
		tooltip : "Someone with high <b>libido</b> is a highly experienced in the sexual arts, and can deal high damage with lust attacks. However, it also makes their lust rise faster."
	});
	options.push({ nameStr: "Charisma",
		func : function() {
			that.charisma.growth += Stat.growthPerPoint;
			that.pendingStatPoints--;
			that.LevelUpPrompt(backFunc);
		}, enabled : true,
		tooltip : "Someone with high <b>charisma</b> has a way with other people, affecting many parts of battle. The most apparent effect is that their lust attacks are more appealing, but it's also useful in other situations."
	});
	Gui.SetButtonsFromList(options, true, backFunc);
}

Entity.prototype.EquipPrompt = function(backfunc) {
	var that = this;
	var parse = {
		name    : that.NameDesc(),
		isAre   : that.is(),
		HeShe   : function() { return that.HeShe(); },
		heshe   : function() { return that.heshe(); },
		HisHer  : function() { return that.HisHer(); },
		hisher  : function() { return that.hisher(); },
		himher  : function() { return that.himher(); },
		hishers : function() { return that.hishers(); },
		es      : function() { return that.plural() ? "" : "es"; }
	};

	var equipFunc = function() {
		Text.Clear();

		var slotFunc = function(slotname, slot) {
			//Text.AddDiv("<hr>");
			Text.AddDiv(slotname, null, "itemTypeHeader");
			//Text.AddDiv("<hr>");
			if(slot) {
				Text.AddDiv(slot.name, null, "itemSubtypeHeader");
				Text.AddDiv(slot.Short(), null, "itemName");
			}
			else
				Text.AddDiv("None", null, "itemSubtypeHeader");
		}

		Text.Add("[name] [isAre] currently equipped with:", parse);
		Text.NL();
		slotFunc("Weapon", that.weaponSlot);
		slotFunc("Top armor", that.topArmorSlot);
		slotFunc("Bottom armor", that.botArmorSlot);
		slotFunc("Accessory", that.acc1Slot);
		slotFunc("Accessory", that.acc2Slot);
		slotFunc("Toy", that.strapOn);
		Text.Flush();

		var slotFunc2 = function(slotname, slot) {
			Text.AddDiv(slotname, null, "itemTypeHeader");
			Text.AddDiv("<hr>");
			Text.Add("[name] [isAre] currently equipped with:", parse);
			Text.AddDiv("<hr>");
			if(slot)
				slot.ShowEquipStats();
			else
				Text.AddDiv("None", null, "itemSubtypeHeader");
		}

		var options = new Array();
		options.push({ nameStr : "Weapon",
			func : function() {
				Text.Clear();
				slotFunc2("Weapon", that.weaponSlot);
				Text.AddDiv("<hr>");
				Text.Add("<i>What weapon do[es] [heshe] equip?</i>", parse);
				Text.AddDiv("<hr>");
				Text.Flush();
				party.inventory.ShowEquippable(that, ItemType.Weapon, equipFunc);
			}, enabled : true,
			tooltip : ""
		});
		options.push({ nameStr : "Top",
			func : function() {
				Text.Clear();
				slotFunc2("Top armor", that.topArmorSlot);
				Text.AddDiv("<hr>");
				Text.Add("<i>What primary armor do[es] [heshe] equip?</i>", parse);
				Text.AddDiv("<hr>");
				Text.Flush();
				party.inventory.ShowEquippable(that, ItemSubtype.TopArmor, equipFunc);
			}, enabled : true,
			tooltip : ""
		});
		var enabled = that.topArmorSlot ? (that.topArmorSlot.subtype != ItemSubtype.FullArmor) : true;
		options.push({ nameStr : "Bottom",
			func : function() {
				Text.Clear();
				slotFunc2("Bottom armor", that.botArmorSlot);
				Text.AddDiv("<hr>");
				Text.Add("<i>What secondary armor do[es] [heshe] equip?</i>", parse);
				Text.AddDiv("<hr>");
				Text.Flush();
				party.inventory.ShowEquippable(that, ItemSubtype.BotArmor, equipFunc);
			}, enabled : enabled,
			tooltip : ""
		});
		options.push({ nameStr : "Acc.1",
			func : function() {
				Text.Clear();
				slotFunc2("Accessory", that.acc1Slot);
				Text.AddDiv("<hr>");
				Text.Add("<i>What primary accessory do[es] [heshe] equip?</i>", parse);
				Text.AddDiv("<hr>");
				Text.Flush();
				party.inventory.ShowEquippable(that, ItemSubtype.Acc1, equipFunc);
			}, enabled : true,
			tooltip : ""
		});
		options.push({ nameStr : "Acc.2",
			func : function() {
				Text.Clear();
				slotFunc2("Accessory", that.acc2Slot);
				Text.AddDiv("<hr>");
				Text.Add("<i>What secondary accessory do[es] [heshe] equip?</i>", parse);
				Text.AddDiv("<hr>");
				Text.Flush();
				party.inventory.ShowEquippable(that, ItemSubtype.Acc2, equipFunc);
			}, enabled : true,
			tooltip : ""
		});
		options.push({ nameStr : "Toy",
			func : function() {
				Text.Clear();
				slotFunc2("Toy", that.strapOn);
				Text.AddDiv("<hr>");
				Text.Add("<i>What strapon do[es] [heshe] equip?</i>", parse);
				Text.AddDiv("<hr>");
				Text.Flush();
				party.inventory.ShowEquippable(that, ItemSubtype.StrapOn, equipFunc);
			}, enabled : true,
			tooltip : ""
		});
		Gui.SetButtonsFromList(options, true, backfunc);
	}
	equipFunc();
}

Entity.prototype.JobPrompt = function(backfunc) {
	var that = this;
	Text.Clear();
	// Fallback for bugs
	if(this.currentJob == null) {
		Text.Add("ERROR, NO ACTIVE JOB");
		Text.Flush();
		Gui.NextPrompt(backfunc);
		return;
	}

	var jd  = this.jobs[this.currentJob.name];
	if(jd == null) {
		Text.Add("ERROR, NO JOB DESCRIPTOR");
		Text.Flush();
		Gui.NextPrompt(backfunc);
		return;
	}

	var parse = {
		name       : this.NameDesc(),
		has        : this.has(),
		Possessive : this.Possessive(),
		job        : jd.job.Short(this),
		lvl        : jd.level,
		maxlvl     : jd.job.levels.length + 1
	};

	// Check for maxed out job
	var master   = jd.job.Master(this);
	var toLevel;
	if(!master) {
		var newLevel = jd.job.levels[jd.level-1];
		toLevel      = newLevel.expToLevel * jd.mult;
	}

	Text.Add("[Possessive] current job is a level [lvl]/[maxlvl] <b>[job]</b>.", parse);
	Text.NL();
	if(jd.job.Long) {
		Text.Add(jd.job.Long(this));
		Text.NL();
	}
	if(master)
		Text.Add("[name] [has] mastered this job.", parse);
	else
		Text.Add("Exp: " + Math.floor(jd.experience) + "/" + Math.floor(toLevel));
	Text.NL();
	Text.Add("Available jobs:<br>");

	var options = [];

	for(var jobName in this.jobs) {
		var jd = this.jobs[jobName];

		if(!jd.job.Unlocked(this)) continue;

		parse.job = jd.job.Short(this);
		parse.lvl = jd.level;
		// Check for maxed out job
		var master   = jd.job.Master(this);
		var toLevel;
		if(!master) {
			var newLevel = jd.job.levels[jd.level-1];
			toLevel      = newLevel.expToLevel * jd.mult;
		}

		if(jd.job.Available(this)) {
			if(master)
				Text.Add("[job] <b>(MASTER)</b><br>", parse);
			else
				Text.Add("[job]: level [lvl] (exp " + Math.floor(jd.experience) + "/" + Math.floor(toLevel) + ")<br>", parse);
		}
		else
		{
			Text.Add("[job]: Requires", parse);
			for(var i = 0; i < jd.job.preqs.length; i++) {
				var preq = jd.job.preqs[i];
				var job  = preq.job;
				var lvl  = preq.lvl || 1;
				Text.Add(" [job2] lvl [lvl2]", {job2: job.Short(this), lvl2: lvl});
			}
			Text.Add(".<br>");
		}

		options.push({ nameStr : jd.job.Short(this),
			func : function(obj) {
				parse.job = obj.Short(this);
				Text.Clear();
				Text.Add("[Possessive] current job is <b>[job]</b>.", parse);
				Text.NL();
				Text.Flush();

				that.currentJob = obj;

				Gui.NextPrompt(backfunc);
			}, enabled : jd.job.Available(this),
			obj : jd.job,
			tooltip : jd.job.Long ? jd.job.Long(this) : ""
		});
	}

	Text.Flush();

	Gui.SetButtonsFromList(options, true, backfunc);
}
