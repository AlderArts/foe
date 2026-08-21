import * as _ from "lodash";

import { Images } from "../../assets";
import { Gui } from "../../gui/gui";
import { GAME } from "../GAME";
import { Item, ItemSubtype, ItemType } from "../inventory/item";
import { IChoice } from "../navigation/link";
import { IParse, Text } from "../parser/text";
import { Job } from "./job";
import { Stat } from "./stat";

const EntityMenu = {
	InteractDefault(options: IChoice[], switchSpot: boolean, enableEquip: boolean, enableStats: boolean, enableJob: boolean, enableSwitch: boolean) {
		options.push({ nameStr: "Equip",
			func: () => {
				this.EquipPrompt(this.Interact);
			}, enabled : enableEquip,
		});
		options.push({ nameStr: this.pendingStatPoints !== 0 ? "Level up" : "Stats",
			func: () => {
				this.LevelUpPrompt(this.Interact);
			}, enabled : enableStats,
			image : this.pendingStatPoints !== 0 ? Images.imgButtonEnabled2 : undefined,
		});
		options.push({ nameStr: "Job",
			func: () => {
				this.JobPrompt(this.Interact);
			}, enabled : enableJob,
		});
		if (switchSpot) {
			const party = GAME().party;
			options.push({ nameStr: party.InParty(this) ? "Switch out" : "Switch in",
				func: () => {
					party.SwitchPrompt(this);
				}, enabled : enableSwitch,
				tooltip: party.InParty(this) ? "Send to reserve." : "Switch into active party.",
			});
		}
	},

	LevelUpPrompt(backFunc: CallableFunction) {
		Text.Clear();

		Text.Add("[name] has [points] stat points pending.",
			{name: this.name, points: this.pendingStatPoints !== 0 ? Text.Bold(this.pendingStatPoints) : "no"});

		Text.NL();

		this.SetLevelBonus();

		Text.Add("<table class='party' style='width:50%'>");
		Text.Add("<tr><td><b>Level:</b></td><td>"     + Math.floor(this.level) + "</td></tr>");
		Text.Add("<tr><td><b>Exp:</b></td><td>"       + Math.floor(this.experience) + "/" + Math.floor(this.expToLevel) + "</td></tr>");
		Text.Add("<tr><td><b>Sex level:</b></td><td>" + Math.floor(this.sexlevel) + "</td></tr>");
		Text.Add("<tr><td><b>S.Exp:</b></td><td>"     + Math.floor(this.sexperience) + "/" + Math.floor(this.sexpToLevel) + "</td></tr>");
		if (this.currentJob) {
			const jd  = this.jobs[this.currentJob.name];
			if (jd) {
				const parse: IParse = {
					job        : jd.job.Short(this),
					lvl        : jd.level,
					maxlvl     : jd.job.levels.length + 1,
				};

				// Check for maxed out job
				const master   = jd.job.Master(this);
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

		if (this.currentJob) {
			Text.Add("Job abilities:<br>", undefined, "bold");
			const abSet = this.currentJob.abilities;

			for (const ability of abSet.AbilitySet) {
				Text.Add("[ability] ([cost]): [desc]<br>",
					{ability: ability.name, cost: ability.CostStr(), desc: ability.Short()});
			}
			Text.Add("<br>");
		}
		Text.Add("Known abilities:<br>", undefined, "bold");
		_.forIn(this.abilities, (abSet, _key) => {
			for (const ability of abSet.AbilitySet) {
				Text.Add("[ability] ([cost]): [desc]<br>",
					{ability: ability.name, cost: ability.CostStr(), desc: ability.Short()});
			}
		});

		Text.Flush();

		if (this.pendingStatPoints <= 0) {
			Gui.NextPrompt(backFunc);
			return;
		}

		const options: IChoice[] = [];
		options.push({ nameStr: "Strength",
			func: () => {
				this.strength.growth += Stat.growthPerPoint;
				this.pendingStatPoints--;
				this.LevelUpPrompt(backFunc);
			}, enabled : true,
			tooltip : "A person with high <b>strength</b> can deal a massive amount of physical damage.",
		});
		options.push({ nameStr: "Stamina",
			func: () => {
				this.stamina.growth += Stat.growthPerPoint;
				this.pendingStatPoints--;
				this.LevelUpPrompt(backFunc);
			}, enabled : true,
			tooltip : "A person with high <b>stamina</b> can take a large amount of punishment. It's most effective against physical attacks, but affects other types of defence as well.",
		});
		options.push({ nameStr: "Dexterity",
			func: () => {
				this.dexterity.growth += Stat.growthPerPoint;
				this.pendingStatPoints--;
				this.LevelUpPrompt(backFunc);
			}, enabled : true,
			tooltip : "A person with high <b>dexterity</b> can deftly evade enemy attacks, and is better at landing their blows. The swifter a person is, the quicker they are to act.",
		});
		options.push({ nameStr: "Intelligence",
			func: () => {
				this.intelligence.growth += Stat.growthPerPoint;
				this.pendingStatPoints--;
				this.LevelUpPrompt(backFunc);
			}, enabled : true,
			tooltip : "Someone with high <b>intelligence</b> is very sharp, and can deal a massive amount of damage with spells. They are also able to act more quickly, as they don't have to spend as much time thinking up their battle plan.",
		});
		options.push({ nameStr: "Spirit",
			func: () => {
				this.spirit.growth += Stat.growthPerPoint;
				this.pendingStatPoints--;
				this.LevelUpPrompt(backFunc);
			}, enabled : true,
			tooltip : "A person with high <b>spirit</b> is very stoic - a pillar of willpower. They can take large amounts of magical damage before they fall.",
		});
		options.push({ nameStr: "Libido",
			func: () => {
				this.libido.growth += Stat.growthPerPoint;
				this.pendingStatPoints--;
				this.LevelUpPrompt(backFunc);
			}, enabled : true,
			tooltip : "Someone with high <b>libido</b> is a highly experienced in the sexual arts, and can deal high damage with lust attacks. However, it also makes their lust rise faster.",
		});
		options.push({ nameStr: "Charisma",
			func: () => {
				this.charisma.growth += Stat.growthPerPoint;
				this.pendingStatPoints--;
				this.LevelUpPrompt(backFunc);
			}, enabled : true,
			tooltip : "Someone with high <b>charisma</b> has a way with other people, affecting many parts of battle. The most apparent effect is that their lust attacks are more appealing, but it's also useful in other situations.",
		});
		Gui.SetButtonsFromList(options, true, backFunc);
	},

	EquipPrompt(backfunc: CallableFunction) {
		const party = GAME().party;
		const parse: IParse = {
			name    : this.NameDesc(),
			isAre   : this.is(),
			HeShe	:() => { return this.HeShe(); },
			heshe	:() => { return this.heshe(); },
			HisHer	:() => { return this.HisHer(); },
			hisher	:() => { return this.hisher(); },
			himher	:() => { return this.himher(); },
			hishers	:() => { return this.hishers(); },
			es		:() => { return this.plural() ? "" : "es"; },
		};

		const equipFunc = () => {
			Text.Clear();

			const slotFunc = (slotname: string, slot: Item) => {
				// Text.AddDiv("<hr>");
				Text.AddDiv(slotname, undefined, "itemTypeHeader");
				// Text.AddDiv("<hr>");
				if (slot) {
					Text.AddDiv(slot.name, undefined, "itemSubtypeHeader");
					Text.AddDiv(slot.Short(), undefined, "itemName");
				} else {
					Text.AddDiv("None", undefined, "itemSubtypeHeader");
				}
			};

			Text.Add("[name] [isAre] currently equipped with:", parse);
			Text.NL();
			slotFunc("Weapon", this.weaponSlot);
			slotFunc("Top armor", this.topArmorSlot);
			slotFunc("Bottom armor", this.botArmorSlot);
			slotFunc("Accessory", this.acc1Slot);
			slotFunc("Accessory", this.acc2Slot);
			slotFunc("Toy", this.strapOn);
			Text.Flush();

			const slotFunc2 = (slotname: string, slot?: Item) => {
				Text.AddDiv(slotname, undefined, "itemTypeHeader");
				Text.AddDiv("<hr>");
				Text.Add("[name] [isAre] currently equipped with:", parse);
				Text.AddDiv("<hr>");
				if (slot) {
					slot.ShowEquipStats();
				} else {
					Text.AddDiv("None", undefined, "itemSubtypeHeader");
				}
			};

			const options: IChoice[] = [];
			options.push({ nameStr : "Weapon",
				func: () => {
					Text.Clear();
					slotFunc2("Weapon", this.weaponSlot);
					Text.AddDiv("<hr>");
					Text.Add("<i>What weapon do[es] [heshe] equip?</i>", parse);
					Text.AddDiv("<hr>");
					Text.Flush();
					party.inventory.ShowEquippable(this, ItemType.Weapon, equipFunc);
				}, enabled : true,
				tooltip : "",
			});
			options.push({ nameStr : "Top",
				func: () => {
					Text.Clear();
					slotFunc2("Top armor", this.topArmorSlot);
					Text.AddDiv("<hr>");
					Text.Add("<i>What primary armor do[es] [heshe] equip?</i>", parse);
					Text.AddDiv("<hr>");
					Text.Flush();
					party.inventory.ShowEquippable(this, ItemSubtype.TopArmor, equipFunc);
				}, enabled : true,
				tooltip : "",
			});
			const enabled = this.topArmorSlot ? (this.topArmorSlot.subtype !== ItemSubtype.FullArmor) : true;
			options.push({ nameStr : "Bottom",
				func: () => {
					Text.Clear();
					slotFunc2("Bottom armor", this.botArmorSlot);
					Text.AddDiv("<hr>");
					Text.Add("<i>What secondary armor do[es] [heshe] equip?</i>", parse);
					Text.AddDiv("<hr>");
					Text.Flush();
					party.inventory.ShowEquippable(this, ItemSubtype.BotArmor, equipFunc);
				}, enabled,
				tooltip : "",
			});
			options.push({ nameStr : "Acc.1",
				func: () => {
					Text.Clear();
					slotFunc2("Accessory", this.acc1Slot);
					Text.AddDiv("<hr>");
					Text.Add("<i>What primary accessory do[es] [heshe] equip?</i>", parse);
					Text.AddDiv("<hr>");
					Text.Flush();
					party.inventory.ShowEquippable(this, ItemSubtype.Acc1, equipFunc);
				}, enabled : true,
				tooltip : "",
			});
			options.push({ nameStr : "Acc.2",
				func: () => {
					Text.Clear();
					slotFunc2("Accessory", this.acc2Slot);
					Text.AddDiv("<hr>");
					Text.Add("<i>What secondary accessory do[es] [heshe] equip?</i>", parse);
					Text.AddDiv("<hr>");
					Text.Flush();
					party.inventory.ShowEquippable(this, ItemSubtype.Acc2, equipFunc);
				}, enabled : true,
				tooltip : "",
			});
			options.push({ nameStr : "Toy",
				func: () => {
					Text.Clear();
					slotFunc2("Toy", this.strapOn);
					Text.AddDiv("<hr>");
					Text.Add("<i>What strap-on do[es] [heshe] equip?</i>", parse);
					Text.AddDiv("<hr>");
					Text.Flush();
					party.inventory.ShowEquippable(this, ItemSubtype.StrapOn, equipFunc);
				}, enabled : true,
				tooltip : "",
			});
			Gui.SetButtonsFromList(options, true, backfunc);
		};
		equipFunc();
	},

	JobPrompt(backfunc: CallableFunction) {
		Text.Clear();
		// Fallback for bugs
		if (this.currentJob === undefined) {
			Text.Add("ERROR, NO ACTIVE JOB");
			Text.Flush();
			Gui.NextPrompt(backfunc);
			return;
		}

		const jd  = this.jobs[this.currentJob.name];
		if (jd === undefined) {
			Text.Add("ERROR, NO JOB DESCRIPTOR");
			Text.Flush();
			Gui.NextPrompt(backfunc);
			return;
		}

		const parse: IParse = {
			name       : this.NameDesc(),
			has        : this.has(),
			Possessive : this.Possessive(),
			job        : jd.job.Short(this),
			lvl        : jd.level,
			maxlvl     : jd.job.levels.length + 1,
		};

		// Check for maxed out job
		const master   = jd.job.Master(this);
		let toLevel;
		if (!master) {
			const newLevel = jd.job.levels[jd.level - 1];
			toLevel      = newLevel.expToLevel * jd.mult;
		}

		Text.Add("[Possessive] current job is a level [lvl]/[maxlvl] <b>[job]</b>.", parse);
		Text.NL();
		if (jd.job.Long) {
			Text.Add(jd.job.Long(this));
			Text.NL();
		}
		if (master) {
			Text.Add("[name] [has] mastered this job.", parse);
		} else {
			Text.Add("Exp: " + Math.floor(jd.experience) + "/" + Math.floor(toLevel));
		}
		Text.NL();
		Text.Add("Available jobs:<br>");

		const options: IChoice[] = [];

		_.forIn (this.jobs, (jd, _key) => {
			if (!jd.job.Unlocked(this)) { return; }

			parse.job = jd.job.Short(this);
			parse.lvl = jd.level;
			// Check for maxed out job
			const master   = jd.job.Master(this);
			let toLevel;
			if (!master) {
				const newLevel = jd.job.levels[jd.level - 1];
				toLevel      = newLevel.expToLevel * jd.mult;
			}

			if (jd.job.Available(this)) {
				if (master) {
					Text.Add("[job] <b>(MASTER)</b><br>", parse);
				} else {
					Text.Add("[job]: level [lvl] (exp " + Math.floor(jd.experience) + "/" + Math.floor(toLevel) + ")<br>", parse);
				}
			} else {
				Text.Add("[job]: Requires", parse);
				for (const preq of jd.job.preqs) {
					const job  = preq.job;
					const lvl  = preq.lvl || 1;
					Text.Add(" [job2] lvl [lvl2]", {job2: job.Short(this), lvl2: lvl});
				}
				Text.Add(".<br>");
			}

			options.push({ nameStr : jd.job.Short(this),
				func: (obj: Job) => {
					parse.job = obj.Short(this);
					Text.Clear();
					Text.Add("[Possessive] current job is <b>[job]</b>.", parse);
					Text.NL();
					Text.Flush();

					this.currentJob = obj;

					Gui.NextPrompt(backfunc);
				}, enabled : jd.job.Available(this),
				obj : jd.job,
				tooltip : jd.job.Long ? jd.job.Long(this) : "",
			});
		});

		Text.Flush();

		Gui.SetButtonsFromList(options, true, backfunc);
	},
};

export { EntityMenu };
