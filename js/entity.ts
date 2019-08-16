
// Basic game entity
// Enemies and player inherit from Entity
import * as _ from "lodash";

import { GetDEBUG } from "../app";
import { Abilities } from "./abilities";
import { AbilityCollection } from "./ability";
import { GetAggroEntry } from "./ability/default";
import { AppendageType } from "./body/appendage";
import { LowerBodyType } from "./body/body";
import { Body } from "./body/body";
import { BodyPartType } from "./body/bodypart";
import { NippleType } from "./body/breasts";
import { Butt } from "./body/butt";
import { Cock } from "./body/cock";
import { Color } from "./body/color";
import { Gender } from "./body/gender";
import { Orifice } from "./body/orifice";
import { Race, RaceDesc, RaceScore } from "./body/race";
import { Vagina } from "./body/vagina";
import { CurEncounter } from "./combat-data";
import { DamageType, Element } from "./damagetype";
import { EntityDict } from "./entity-dict";
import { EntityMenu } from "./entity-menu";
import { GAME } from "./GAME";
import { Gui } from "./gui";
import { Item, ItemIds } from "./item";
import { Jobs } from "./job";
import { LactationHandler } from "./lactation";
import { Perk, PerkIds } from "./perks";
import { PregnancyHandler, Womb } from "./pregnancy";
import { Stat } from "./stat";
import { StatusEffect } from "./statuseffect";
import { StatusList } from "./statuslist";
import { Text } from "./text";
import { Time } from "./time";
import { Unit } from "./utility";

export enum DrunkLevel {
	Sober   = 0.25,
	Tipsy   = 0.50,
	Sloshed = 0.75,
	Drunk   = 1.00,
}

export enum TargetStrategy {
	None      = 0, // Not used
	NearDeath = 1,
	LowHp     = 2,
	LowAbsHp  = 4,
	HighHp    = 8,
	HighAbsHp = 16,
	Leader    = 32,
	SPHunt    = 64,
	LPHunt    = 128,
}

// TODO: Should have shared features, such as combat stats. Body representation
export class Entity {

	public static IdToEntity = EntityDict.IdToEntity;
	public name: string;
	public monsterName: string;
	public MonsterName: string;
	public groupName: string;
	public GroupName: string;
	public uniqueName: string;
	public ID: string;
	public title: string[];
	public avatar: any;

	public combatExp: number;
	public coinDrop: number;
	public abilities: any;
	public recipes: Item[];
	public alchemyLevel: number;
	public jobs: any;
	public currentJob: any;
	public experience: number;
	public level: number;
	public pendingStatPoints: number;
	public expToLevel: number;
	public sexperience: number;
	public sexlevel: number;
	public sexpToLevel: number;

	public ExpToLevel  = 15;
	public SexpToLevel = 30;

	public curHp: number;
	public maxHp: Stat;
	public curSp: number;
	public maxSp: Stat;
	public curLust: number;
	public maxLust: Stat;

	public strength: Stat;
	public stamina: Stat;
	public dexterity: Stat;
	public intelligence: Stat;
	public spirit: Stat;
	public libido: Stat;
	public charisma: Stat;

	public weaponSlot: Item;
	public topArmorSlot: Item;
	public botArmorSlot: Item;
	public acc1Slot: Item;
	public acc2Slot: Item;

	public strapOn: any;

	public elementAtk: DamageType;
	public elementDef: DamageType;

	public atkMod: number;
	public defMod: number;

	public combatStatus: StatusList;
	public statusDef: any[];
	public statusDefGear: any[];
	public statusWear: any[];

	public body: Body;
	public drunkLevel: number;
	public pregHandler: PregnancyHandler;
	public lactHandler: LactationHandler;
	public flags: any;
	public sex: any;
	public perks: Perk[];
	public aggro: any[];
	public subDom: Stat;
	public slut: Stat;
	public relation: Stat;

	public location: any;

	/* ENTITY MENU */
	public InteractDefault = EntityMenu.InteractDefault;
	public LevelUpPrompt = EntityMenu.LevelUpPrompt;
	public EquipPrompt = EntityMenu.EquipPrompt;
	public JobPrompt = EntityMenu.JobPrompt;

	/* ENTITY DICT */
	public UniqueId = EntityDict.UniqueId;

	constructor() {
		// Names and grammar
		this.name         = "ENTITY";
		this.monsterName  = undefined;
		this.MonsterName  = undefined;
		this.groupName    = undefined;
		this.GroupName    = undefined;
		this.ID           = undefined;
		// Titles are achieved by performing feats or by achieving great strength
		this.title        = new Array();

		this.avatar       = {};

		// Combat
		this.combatExp    = 0;
		this.coinDrop     = 0;

		// TODO: Save/Load
		this.abilities             = {};
		this.abilities.Skills  = new AbilityCollection("Skills");
		this.abilities.Spells  = new AbilityCollection("Spells");
		this.abilities.Support = new AbilityCollection("Support");
		this.abilities.Seduce  = new AbilityCollection("Seduce");
		this.abilities.Special = new AbilityCollection("SPECIAL");

		// Alchemy stuff
		this.recipes      = [];
		this.alchemyLevel = 0;

		// Jobs //TODO: Save/load
		this.jobs         = {};
		this.currentJob   = null;

		// Experience
		// Experience is gained by defeating enemies and completing quests
		// Enough experience will increase level
		// Levels reward perks, skills and stats bonuses
		this.experience        = 0;
		this.level             = 1;
		this.pendingStatPoints = 0;
		this.expToLevel        = this.ExpToLevel;
		// Sexperience is gained by having sex
		// Sex leves reward sex perks and skills, and affect sexual based bonuses
		this.sexperience  = 0;
		this.sexlevel     = 1;
		this.sexpToLevel  = this.SexpToLevel;

		// Base stats
		const that = this;

		// Health stat and functions
		this.curHp        = 0;
		this.maxHp        = new Stat(10, 10, 5);
		this.maxHp.debug = function() { return that.name + ".maxHp"; };
		// SP
		this.curSp        = 0;
		this.maxSp        = new Stat(10, 5, 5);
		this.maxSp.debug = function() { return that.name + ".maxSp"; };

		// Lust stat and functions
		this.curLust      = 0;
		this.maxLust      = new Stat(10, 5, 5);
		this.maxLust.debug = function() { return that.name + ".maxLust"; };

		// Main stats
		this.strength     = new Stat(0, 1, 0.1);
		this.strength.debug = function() { return that.name + ".strength"; };
		this.stamina      = new Stat(0, 1, 0.1);
		this.stamina.debug = function() { return that.name + ".stamina"; };
		this.dexterity    = new Stat(0, 1, 0.1);
		this.dexterity.debug = function() { return that.name + ".dexterity"; };
		this.intelligence = new Stat(0, 1, 0.1);
		this.intelligence.debug = function() { return that.name + ".intelligence"; };
		this.spirit       = new Stat(0, 1, 0.1);
		this.spirit.debug = function() { return that.name + ".spirit"; };
		this.libido       = new Stat(0, 1, 0.1);
		this.libido.debug = function() { return that.name + ".libido"; };
		this.charisma     = new Stat(0, 1, 0.1);
		this.charisma.debug = function() { return that.name + ".charisma"; };

		// Equipment
		this.weaponSlot   = null;
		this.topArmorSlot = null;
		this.botArmorSlot = null;
		this.acc1Slot     = null;
		this.acc2Slot     = null;

		this.strapOn      = null;

		this.elementAtk   = new DamageType();
		this.elementDef   = new DamageType();

		this.combatStatus = new StatusList();
		this.statusDef    = [];
		this.statusDefGear = [];
		this.statusWear   = [];

		// Body representation
		this.body         = new Body(this);

		this.drunkLevel   = 0.0;

		this.pregHandler  = new PregnancyHandler(this);
		this.lactHandler  = new LactationHandler(this);

		// Set hp and sp to full, clear lust to min level
		this.Equip();
		this.SetLevelBonus();
		this.RestFull();

		this.flags = {};
		this.sex = {
			rBlow : 0,
			gBlow : 0,
			rCunn : 0,
			gCunn : 0,
			rAnal : 0,
			gAnal : 0,
			rVag  : 0,
			gVag  : 0,
			sired : 0,
			birth : 0,
		};

		this.perks   = [];
		this.aggro   = [];

		// Personality stats
		this.subDom   = new Stat(0); // sub = low, dom = high
		this.subDom.debug = function() { return that.name + ".subDom"; };
		this.slut     = new Stat(0);
		this.slut.debug = function() { return that.name + ".slut"; };
		this.relation = new Stat(0);
		this.relation.debug = function() { return that.name + ".relation"; };
	}

	public SetLevelBonus() {
		this.maxHp.level        = this.level * this.maxHp.growth;
		this.maxSp.level        = this.level * this.maxSp.growth;
		this.maxLust.level      = this.level * this.maxLust.growth;
		this.strength.level     = this.level * this.strength.growth;
		this.stamina.level      = this.level * this.stamina.growth;
		this.dexterity.level    = this.level * this.dexterity.growth;
		this.intelligence.level = this.level * this.intelligence.growth;
		this.spirit.level       = this.level * this.spirit.growth;
		this.libido.level       = this.level * this.libido.growth;
		this.charisma.level     = this.level * this.charisma.growth;
	}

	public HasPerk(perk: Perk) {
		for (let i = 0; i < this.perks.length; ++i) {
			if (this.perks[i] == perk) {
				return true;
			}
		}
		return false;
	}

	public AddPerk(perk: Perk) {
		for (let i = 0; i < this.perks.length; ++i) {
			if (this.perks[i] == perk) {
				return;
			}
		}
		this.perks.push(perk);
	}

	public KnowsRecipe(item: Item) {
		const idx = this.recipes.indexOf(item); // Find the index
		return (idx != -1);
	}

	public AddAlchemy(item: Item) {
		const idx = this.recipes.indexOf(item); // Find the index
		if (idx == -1) {
			this.recipes.push(item);
		}
	}

	public Equip() {
		this.maxHp.bonus        = 0;
		this.maxSp.bonus        = 0;
		this.maxLust.bonus      = 0;
		this.strength.bonus     = 0;
		this.stamina.bonus      = 0;
		this.dexterity.bonus    = 0;
		this.intelligence.bonus = 0;
		this.spirit.bonus       = 0;
		this.libido.bonus       = 0;
		this.charisma.bonus     = 0;

		this.atkMod = 1;
		this.defMod = 1;

		this.elementAtk = new DamageType();
		if (!this.weaponSlot) { this.elementAtk.dmg[Element.pBlunt] = 1; }
		this.elementDef = new DamageType();

		this.statusDefGear = [];

		if (this.weaponSlot   && this.weaponSlot.Equip) {   this.weaponSlot.Equip(this); }
		if (this.topArmorSlot && this.topArmorSlot.Equip) { this.topArmorSlot.Equip(this); }
		if (this.botArmorSlot && this.botArmorSlot.Equip) { this.botArmorSlot.Equip(this); }
		if (this.acc1Slot     && this.acc1Slot.Equip) {     this.acc1Slot.Equip(this); }
		if (this.acc2Slot     && this.acc2Slot.Equip) {     this.acc2Slot.Equip(this); }

		this.BalanceStats();
	}

	public Strip() {
		// Remove all equipment (discards it completely and destroys it)
		this.weaponSlot   = null;
		this.topArmorSlot = null;
		this.botArmorSlot = null;
		this.acc1Slot     = null;
		this.acc2Slot     = null;

		this.strapOn      = null;
	}

	public ItemUsable(item: Item) {
		if (item.isTF) {
			return false;
		}
		return true;
	}

	public ItemUse(item: Item, backPrompt: any) {
		return {grab : false, consume : true};
	}

	public Strapon() {
		return this.strapOn;
	}

	public AddExp(exp: number, reserve?: boolean) {
		const buff = this.combatStatus.stats[StatusEffect.Full];
		if (buff && buff.exp) {
			exp = Math.ceil(buff.exp * exp);
		}

		if (GetDEBUG()) {
			Text.NL();
			Text.Add("[reserve][name] gains [x] xp.", {reserve: reserve ? "RESERVE: " : "", name: this.name, x: exp}, "bold");
			Text.NL();
			Text.Flush();
		}

		this.experience += exp;
		if (this.currentJob) {
			this.currentJob.AddExp(this, exp, reserve);
		}

		// Check for level up
		while (this.experience >= this.expToLevel) {
			this.experience        -= this.expToLevel;
			this.expToLevel         = Math.floor(this.expToLevel * 1.2);
			this.level++;
			this.pendingStatPoints += Stat.growthPointsPerLevel;

			this.SetLevelBonus();

			if (GetDEBUG()) {
				Text.NL();
				Text.Add("[reserve][name] gains a level! Now at [x].", {reserve: reserve ? "RESERVE: " : "", name: this.name, x: this.level}, "bold");
				Text.NL();
				Text.Flush();
			}
		}
	}

	public AddSexExp(sexp: number) {
		if (GetDEBUG()) {
			Text.NL();
			Text.Add("[name] gains [x] sex exp.", {name: this.name, x: sexp}, "bold");
			Text.NL();
			Text.Flush();
		}

		this.sexperience += sexp;
		// Check for level up
		while (this.sexperience >= this.sexpToLevel) {
			this.sexperience       -= this.sexpToLevel;
			this.sexpToLevel        = Math.floor(this.sexpToLevel * 2);
			this.sexlevel++;
			// this.pendingStatPoints += 5;

			if (GetDEBUG()) {
				Text.NL();
				Text.Add("[name] gains a sex level! Now at [x].", {name: this.name, x: this.sexlevel}, "bold");
				Text.NL();
				Text.Flush();
			}
		}
	}

	public SetExpToLevel() {
		this.sexpToLevel  = this.SexpToLevel;
		this.expToLevel   = this.ExpToLevel;
		for (let i = 1; i < this.level; i++) {
			this.expToLevel  = Math.floor(this.expToLevel * 1.2);
		}
		for (let i = 1; i < this.sexlevel; i++) {
			this.sexpToLevel = Math.floor(this.sexpToLevel * 2);
		}
	}

	public IsAtLocation(location: any) {
		return (this.location == location);
	}

	// Should return an array of drops (if any) in the form of {it: Item, num: amount}
	public DropTable(): any[] {
		return [];
	}

	public Update(step?: number) {
		if (step) {
			const time = new Time();
			time.Inc(step);

			const hours = time.ToHours();

			this.AddLustOverTime(hours);
			this.AccumulateCumOverTime(hours);
			this.LactationOverTime(hours);
			this.PregnancyOverTime(hours);
			this.HandleDrunknessOverTime(hours);
			this.HandleStretchOverTime(hours);

			this.combatStatus.Update(this, hours);
		}
	}

	public HandleStretchOverTime(hours: number) {
		this.body.HandleStretchOverTime(hours);
	}

	// TODO
	public AccumulateCumOverTime(hours: number) {
		const balls = this.Balls();

		const inc = balls.cumProduction.Get() * hours;

		// Max out
		balls.cum.IncreaseStat(balls.CumCap(), inc);
	}

	public MilkDrained() {
		this.lactHandler.MilkDrained();
		// TODO Output
	}
	public MilkFull() {
		this.lactHandler.MilkFull();
	}
	public MilkDrain(drain: number) {
		return this.LactHandler().MilkDrain(drain);
	}
	public MilkDrainFraction(fraction: number) {
		return this.LactHandler().MilkDrainFraction(fraction);
	}

	public LactHandler() {
		return this.lactHandler;
	}

	public LactationOverTime(hours: number) {
		this.lactHandler.Update(hours);
	}

	public PregHandler() {
		return this.pregHandler;
	}

	public PregnancyOverTime(hours: number) {
		this.pregHandler.Update(hours);
	}

	public PregnancyProgess(womb: Womb, slot: number, oldProgress: number, progress: number) {
	}

	public PregnancyTrigger(womb: Womb, slot: number) {
		// Use unshift instead of push to make sure pregnancy doesn't interfere with scene progression
		Gui.Callstack.unshift(function() {
			womb.pregnant = false;

			if (GetDEBUG()) {
				const parse: any = {
					name : this.name,
				};

				Text.Clear();
				Text.Add("PLACEHOLDER: [name] gave birth.", parse);
				Text.NL();
				Text.Flush();
				Gui.NextPrompt();
			}
		});
	}

	public CanGiveBirth() {
		return true;
	}

	public DrunkRecoveryRate() {
		let sta = this.Sta();
		if (sta < Math.E) { sta = Math.E; }
		return Math.log(sta) / 25;
	}
	public HandleDrunknessOverTime(hours: number, suppressText?: boolean) {
		const oldLevel = this.drunkLevel;
		this.drunkLevel -= this.DrunkRecoveryRate() * hours;
		if (this.drunkLevel < 0) { this.drunkLevel = 0; }
	}
	public Drunk() {
		return this.drunkLevel;
	}
	public DrunkStr() {
		const parse: any = {
			name : this.NameDesc(),
			isAre : this.is(),
		};
		if (this.drunkLevel > DrunkLevel.Drunk) {
			return Text.Parse("[name] [isAre] passed out, dead drunk.", parse);
		}
		if (this.drunkLevel > DrunkLevel.Sloshed) {
			return Text.Parse("[name] [isAre] reeling, quite drunk.", parse);
		}
		if (this.drunkLevel > DrunkLevel.Tipsy) {
			return Text.Parse("[name] [isAre] tipsy, wobbling slighty.", parse);
		}
		if (this.drunkLevel > DrunkLevel.Sober) {
			return Text.Parse("[name] [isAre] feeling a bit tipsy.", parse);
		}
		return false;
	}
	public Drink(drink: number, suppressText: boolean) {
		let sta = this.Sta();
		if (sta < Math.E) { sta = Math.E; }
		const oldLevel = this.drunkLevel;
		this.drunkLevel += drink / Math.log(sta);
	}
	// TODO: Implement for companions
	public InnPrompt() {
		Text.Clear();
		Text.Add("[PLACEHOLDER]");
		Text.NL();
		Text.Flush();
		Gui.NextPrompt();
	}

	public SetEyeColor(color: Color) {
		this.body.head.eyes.color = color;
	}
	public SetHairColor(color: Color) {
		this.body.head.hair.color = color;
	}
	public SetSkinColor(color: Color) {
		this.body.torso.color = color;
	}

	public DebugMode(debug: boolean) {
		const value = debug ? 50 : 0;

		this.maxHp.cheat        = value * 10;
		this.maxSp.cheat        = value * 10;
		this.maxLust.cheat      = value * 10;
		this.strength.cheat     = value;
		this.stamina.cheat      = value;
		this.dexterity.cheat    = value;
		this.intelligence.cheat = value;
		this.spirit.cheat       = value;
		this.libido.cheat       = value;
		this.charisma.cheat     = value;

		this.Equip();
		if (debug) {
			this.RestFull();
		}
	}

	/* COMBAT RELATED FUNTIONS */
	public Act(encounter: any, activeChar: any) {
		// TODO: Very TEMP
		Text.Add(this.name + " acts! Rawr!");
		Text.NL();
		Text.Flush();

		// Pick a random target
		const t = this.GetSingleTarget(encounter, activeChar);

		Abilities.Attack.Use(encounter, this, t);
	}

	// TODO Structure
	public FinishCastInternal(ability: any, encounter: any, caster: any, targets: any) {
		Text.Flush();

		Gui.NextPrompt(function() {
			if (encounter) {
				encounter.CombatTick();
			} else {
				Gui.PrintDefaultOptions();
			}
		});
	}

	// Can be overrided to allow for selective cancellation
	public CanBeInterrupted(ability: any, encounter: any, caster: any, result: any) {
		return true;
	}

	public GetCombatEntry(encounter: any) {
		const ent = this;
		let found: any;
		_.each(encounter.combatOrder, function(it) {
			if (it.entity == ent) {
				found = it;
				return false;
			}
		});
		return found;
	}

	public GetPartyTarget(encounter: any, activeChar: any, ally?: any) {
		let isEnemy = activeChar.isEnemy;
		const confuse = activeChar.entity.combatStatus.stats[StatusEffect.Confuse];
		if (confuse) {
			isEnemy = !isEnemy;
		}
		if (ally) {
			isEnemy = !isEnemy;
		}

		if (isEnemy) {
			return GAME().party;
		} else {
			return encounter.enemy;
		}
	}

	public GetSingleTarget(encounter: any, activeChar: any, strategy?: TargetStrategy, ally?: boolean) {
		let isEnemy = activeChar.isEnemy;
		const confuse = activeChar.entity.combatStatus.stats[StatusEffect.Confuse];
		if (confuse) {
			isEnemy = !isEnemy;
		}
		if (ally) {
			isEnemy = !isEnemy;
		}

		// Fetch all potential targets
		let targets;
		if (isEnemy) {
			targets = encounter.GetLivePartyArray();
		} else {
			targets = encounter.GetLiveEnemyArray();
		}

		strategy = strategy || TargetStrategy.None;

		let aggro;
		if (ally) {
			// cleanup
			activeChar.aggroAllies = _.reject(activeChar.aggroAllies, function(it) {
				return it.entity.Incapacitated();
			});

			// adding new aggro targets
			_.each(targets, function(t) {
				if (!GetAggroEntry(activeChar, t)) {
					activeChar.aggroAllies.push({entity: t, aggro: 1});
				}
			});

			// make a temporary aggro array
			aggro = _.clone(activeChar.aggroAllies);
		} else {
			// cleanup
			activeChar.aggro = _.reject(activeChar.aggro, function(it) {
				return it.entity.Incapacitated();
			});

			// adding new aggro targets
			_.each(targets, function(t) {
				if (!GetAggroEntry(activeChar, t)) {
					activeChar.aggro.push({entity: t, aggro: 1});
				}
			});

			// make a temporary aggro array
			aggro = _.clone(activeChar.aggro);
		}

		// Strategies
		if (strategy & TargetStrategy.NearDeath) {
			_.each(aggro, function(a) {
				let hp  = 1 - a.entity.HPLevel();
				hp *= hp;
				a.aggro *= hp;
			});
		}
		if (strategy & TargetStrategy.LowHp) {
			_.each(aggro, function(a) {
				const hp  = 1 - a.entity.HPLevel();
				a.aggro *= hp;
			});
		}
		if (strategy & TargetStrategy.HighHp) {
			_.each(aggro, function(a) {
				const hp  = a.entity.HPLevel();
				a.aggro *= hp;
			});
		}

		// Normalize hp
		const min = _.minBy(aggro.length, function(a: any) {
			return a.entity.curHp;
		});
		const max = _.maxBy(aggro.length, function(a: any) {
			return a.entity.curHp;
		});

		const span = max - min;
		if (strategy & TargetStrategy.LowAbsHp) {
			_.each(aggro, function(a) {
				let hp = (a.entity.curHp - min) / span;
				hp  = 1 - hp;
				a.aggro *= hp;
			});
		}
		if (strategy & TargetStrategy.HighAbsHp) {
			_.each(aggro, function(a) {
				const hp = (a.entity.curHp - min) / span;
				a.aggro *= hp;
			});
		}

		if (strategy & TargetStrategy.Leader) { // Test, this might be wrong
			if (aggro.length > 0) {
				aggro[0].aggro *= 5;
			}
		}
		if (strategy & TargetStrategy.SPHunt) {
			for (let i = 0; i < aggro.length; i++) {
				const sp = Math.log(aggro[i].entity.SP());
				aggro[i].aggro *= sp;
			}
		}
		if (strategy & TargetStrategy.LPHunt) {
			for (let i = 0; i < aggro.length; i++) {
				const lp = Math.log(aggro[i].entity.Lust());
				aggro[i].aggro *= lp;
			}
		}

		// TODO: more complex targetting
		/*
		if(strategy & TargetStrategy.None) {
			let val = this.effect.statusDef[i];
			val
				let mod = "+";
				if(val < 0) mod = "-";
		}val*100 + ""% + mod
		*/

		// Weigthed random selection
		const sum = _.sumBy(aggro, function(a: any) {
			return a.aggro;
		});

		// Pick a target
		let step = Math.random() * sum;

		for (let i = 0; i < aggro.length; i++) {
			step -= aggro[i].aggro;
			if (step <= 0.0) { return aggro[i].entity; }
		}

		return _.sample(aggro).entity;
	}

	// STATS
	public HP() {
		const buff = this.combatStatus.stats[StatusEffect.Buff];
		const mod = (buff && buff.HP) ? buff.HP : 1;
		return Math.ceil((this.maxHp.Get() + Math.pow((this.strength.Get() + this.stamina.Get()) / 2, 1.3)) * mod);
	}

	public SP() {
		const buff = this.combatStatus.stats[StatusEffect.Buff];
		const mod = (buff && buff.SP) ? buff.SP : 1;
		return Math.ceil((this.maxSp.Get() + Math.pow((this.spirit.Get() + this.intelligence.Get() + this.stamina.Get()) / 3, 1.3)) * mod);
	}

	public Lust() {
		const buff = this.combatStatus.stats[StatusEffect.Buff];
		const mod = (buff && buff.LP) ? buff.LP : 1;
		return Math.ceil((this.maxLust.Get() + Math.pow(this.libido.Get(), 1.3)) * mod);
	}

	public MinLust() {
		return 0; // TODO: Implement
	}

	// STATS
	public Str() {
		const buff = this.combatStatus.stats[StatusEffect.Buff];
		if (buff && buff.Str) {
			return this.strength.Get() * buff.Str;
		} else {
			return this.strength.Get();
		}
	}
	public Sta() {
		const buff = this.combatStatus.stats[StatusEffect.Buff];
		if (buff && buff.Sta) {
			return this.stamina.Get() * buff.Sta;
		} else {
			return this.stamina.Get();
		}
	}
	public Dex() {
		const buff = this.combatStatus.stats[StatusEffect.Buff];
		if (buff && buff.Dex) {
			return this.dexterity.Get() * buff.Dex;
		} else {
			return this.dexterity.Get();
		}
	}
	public Int() {
		const buff = this.combatStatus.stats[StatusEffect.Buff];
		if (buff && buff.Int) {
			return this.intelligence.Get() * buff.Int;
		} else {
			return this.intelligence.Get();
		}
	}
	public Spi() {
		const buff = this.combatStatus.stats[StatusEffect.Buff];
		if (buff && buff.Spi) {
			return this.spirit.Get() * buff.Spi;
		} else {
			return this.spirit.Get();
		}
	}
	public Lib() {
		const buff = this.combatStatus.stats[StatusEffect.Buff];
		if (buff && buff.Lib) {
			return this.libido.Get() * buff.Lib;
		} else {
			return this.libido.Get();
		}
	}
	public Cha() {
		const buff = this.combatStatus.stats[StatusEffect.Buff];
		if (buff && buff.Cha) {
			return this.charisma.Get() * buff.Cha;
		} else {
			return this.charisma.Get();
		}
	}

	// TODO: Certain status effects like paralyze should also count as incapacitated
	public Incapacitated() {
		return this.curHp <= 0; // || this.curLust >= this.Lust();
	}
	public Inhibited() {
		if (this.combatStatus.stats[StatusEffect.Freeze]  != null) { return true; }
		if (this.combatStatus.stats[StatusEffect.Numb]    != null) { return true; }
		if (this.combatStatus.stats[StatusEffect.Petrify] != null) { return true; }
		if (this.combatStatus.stats[StatusEffect.Blind]   != null) { return true; }
		if (this.combatStatus.stats[StatusEffect.Sleep]   != null) { return true; }
		if (this.combatStatus.stats[StatusEffect.Enrage]  != null) { return true; }
		if (this.combatStatus.stats[StatusEffect.Fatigue] != null) { return true; }
		if (this.combatStatus.stats[StatusEffect.Limp]    != null) { return true; }

		return false;
	}

	public AddHPFraction(fraction: number) {
		fraction = fraction || 0;
		const old = this.curHp;
		this.curHp += fraction * this.HP();
		if (this.curHp > this.HP()) { this.curHp = this.HP(); }
		if (this.curHp < 0) {
			this.curHp = 0;
			if (CurEncounter()) {
				CurEncounter().OnIncapacitate(this);
			}
		}

		if (fraction > 0 && this.combatStatus.stats[StatusEffect.Bleed]) {
			this.combatStatus.stats[StatusEffect.Bleed] = null;
		}
		return this.curHp - old;
	}
	public AddSPFraction(fraction: number) {
		fraction = fraction || 0;
		const old = this.curSp;
		this.curSp += fraction * this.SP();
		if (this.curSp > this.SP()) { this.curSp = this.SP(); }
		if (this.curSp < 0) { this.curSp = 0; }
		return this.curSp - old;
	}
	public AddLustFraction(fraction: number) { // 0..1
		fraction = fraction || 0;
		const old = this.curLust;
		this.curLust += fraction * this.Lust();
		if (this.curLust > this.Lust()) { this.curLust = this.Lust(); }
		if (this.curLust < 0) { this.curLust = 0; }
		return this.curLust - old;
	}

	public PhysDmgHP(encounter: any, caster: any, val: number) {
		const parse: any = {
			possessive : this.possessive(),
		};
		const ent = this;

		// Healing
		if (val >= 0) { return true; }

		// Check for sleep
		if (this.combatStatus.stats[StatusEffect.Sleep] != null) {
			this.combatStatus.stats[StatusEffect.Sleep] = null;
		}
		// Check for confuse
		if (this.combatStatus.stats[StatusEffect.Confuse] != null) {
			this.combatStatus.stats[StatusEffect.Confuse].OnFade(encounter, this);
		}

		// Check for counter
		if (this.combatStatus.stats[StatusEffect.Counter] != null) {
			const onhit = this.combatStatus.stats[StatusEffect.Counter].OnHit;

			this.combatStatus.stats[StatusEffect.Counter].hits--;
			if (this.combatStatus.stats[StatusEffect.Counter].hits <= 0) {
				this.combatStatus.stats[StatusEffect.Counter] = null;
			}

			let ret;
			if (onhit) {
				ret = onhit(encounter, this, caster, val);
			}

			return ret;
		}
		// Check for decoy
		const decoy = this.combatStatus.stats[StatusEffect.Decoy];
		if (decoy != null) {
			const num  = decoy.copies;
			const toHit = 1 / (num + 1);
			if (Math.random() < toHit) {
				return true;
			}

			const func = decoy.func || function() {
				parse.oneof = num > 1 ? " one of" : "";
				parse.copy  = num > 1 ? "copies" : "copy";
				Text.Add("The attack is absorbed by[oneof] [possessive] [copy]!", parse);
				Text.NL();
				ent.combatStatus.stats[StatusEffect.Decoy].copies--;
				if (ent.combatStatus.stats[StatusEffect.Decoy].copies <= 0) {
					ent.combatStatus.stats[StatusEffect.Decoy] = null;
				}
				Text.Flush();
				return false;
			};
			return func(caster, val);
		}

		return true;
	}
	public AddHPAbs(val: number) {
		val = val || 0;
		const old = this.curHp;
		this.curHp += val;
		if (this.curHp > this.HP()) { this.curHp = this.HP(); }
		if (this.curHp < 0) {
			this.curHp = 0;
			if (CurEncounter()) {
				CurEncounter().OnIncapacitate(this);
			}
		}

		if (val > 0 && this.combatStatus.stats[StatusEffect.Bleed]) {
			this.combatStatus.stats[StatusEffect.Bleed] = null;
		}
		return this.curHp - old;
	}
	public AddSPAbs(val: number) {
		val = val || 0;
		const old = this.curSp;
		this.curSp += val;
		if (this.curSp > this.SP()) { this.curSp = this.SP(); }
		if (this.curSp < 0) { this.curSp = 0; }
		return this.curSp - old;
	}
	public AddLustAbs(val: number) {
		val = val || 0;
		const old = this.curLust;
		this.curLust += val;
		if (this.curLust > this.Lust()) { this.curLust = this.Lust(); }
		if (this.curLust < 0) { this.curLust = 0; }
		return this.curLust - old;
	}

	public RestFull() {
		this.curHp = this.HP();
		this.curSp = this.SP();
		this.curLust = this.MinLust();

		// this.combatStatus.Clear();
	}

	public Sleep() {
		this.curHp = this.HP();
		this.curSp = this.SP();
	}

	// HP function (returns range 0..1)
	public HPLevel() {
		return this.curHp / this.HP();
	}

	// SP function (returns range 0..1)
	public SPLevel() {
		return this.curSp / this.SP();
	}

	// Lust function (returns range 0..1)
	public LustLevel() {
		return this.curLust / this.Lust();
	}

	// Clear combat effects, called at end of encounters
	public ClearCombatBonuses() {
		this.maxHp.temp        = 0;
		this.maxSp.temp        = 0;
		this.maxLust.temp      = 0;
		this.strength.temp     = 0;
		this.stamina.temp      = 0;
		this.dexterity.temp    = 0;
		this.intelligence.temp = 0;
		this.spirit.temp       = 0;
		this.libido.temp       = 0;
		this.charisma.temp     = 0;

		this.BalanceStats();

		this.statusWear = [];
	}

	// Balance mana, lust and hp
	public BalanceStats() {
		if (this.curHp < 0) {
			this.curHp = 0;
		} else if (this.curHp > this.HP()) {
			this.curHp = this.HP();
 }

		if (this.curSp < 0) {
			this.curSp = 0;
		} else if (this.curSp > this.SP()) {
			this.curSp = this.SP();
 }

		if (this.curLust < 0) {
			this.curLust = 0;
		} else if (this.curLust > this.Lust()) {
			this.curLust = this.Lust();
 }
	}

	public AddLustOverTime(hours: number) {
		// TODO: Function
		let lustRate = this.libido.Get() / this.spirit.Get();
		lustRate /= 48;
		const slutFactor = ((this.slut.Get() / 100) + 1);

		this.AddLustFraction(hours * lustRate * slutFactor);
	}

	public LustCombatEfficiencyLevel() {
		let lustFactor = (this.LustLevel() - 0.5) * 2;
		if (lustFactor < 0) { lustFactor = 0; }
		// linear for now
		return 1.0 - 0.25 * lustFactor;
	}

	public LustCombatTurnLossChance() {
		let lustFactor = this.LustLevel() - 0.5;
		if (lustFactor < 0) { lustFactor = 0; }
		return lustFactor; // linear for now
	}

	public Initiative() {
		let ini = Math.sqrt(2 * this.Dex() + this.Int());
		const haste = this.combatStatus.stats[StatusEffect.Haste];
		if (haste) { ini *= haste.factor; }
		const slow  = this.combatStatus.stats[StatusEffect.Slow];
		if (slow) {  ini /= slow.factor; }
		return ini;
	}

	// Combat functions (calculated)
	public PAttack() {
		// Stat based
		const atkStat = (this.Str() * 3 + this.Sta() + this.Dex()) / 2;
		// Weapon strength based
		const atkWep = this.atkMod;

		// Currently range the attack between 0.9 and 1.1
		const atkRand = _.random(0.9, 1.1);

		return atkStat * atkWep * atkRand;
	}

	// TODO: Add perk/elemental/special effects
	public PDefense() {
		// Stat based
		let defStat = this.Sta() * 3 + this.Spi();
		if (defStat < 0) { defStat = 0; }
		// Defense based on armor
		const defArmor = this.defMod;
		// Reduce effect of armor due to armor penetration (TODO)

		// Currently range the attack between 0.9 and 1.1
		const defRand = _.random(0.9, 1.1);

		// Combine the result
		return defStat * defArmor * defRand;
	}

	// TODO temp
	public PHit() {
		let hitStat = 3 * this.Dex() + this.Int() + this.Cha();

		const blind = this.combatStatus.stats[StatusEffect.Blind];
		if (blind) {
			hitStat *= (1 - blind.str);
		}

		return hitStat;
	}

	// TODO temp
	public PEvade(attack?: number) {
		const evadeStat = 3 * this.Dex() + this.Int() + this.Cha();

		return evadeStat;
	}

	// TODO temp
	public MAttack() {
		const magStat = (3 * this.Int() + this.Spi() + this.Cha()) / 2;

		const magRand = _.random(0.9, 1.1);

		return magStat * magRand;
	}

	// TODO temp
	public MDefense() {
		let magDef = this.Sta() + 3 * this.Spi();
		if (magDef < 0) { magDef = 0; }

		const magRand = _.random(0.9, 1.1);

		return magDef * magRand;
	}

	public MHit() {
		const hitStat = 3 * this.Int() + this.Spi() + this.Cha();

		return hitStat;
	}

	// TODO temp
	public MEvade(attack?: number) {
		const evadeStat = 3 * this.Spi() + this.Int() + this.Dex();

		return evadeStat;
	}

	public LAttack() {
		// Stat based
		const sedStat = (this.Dex() + 2 * this.Lib() + 2 * this.Cha()) / 2;
		/*
		let sedLust = this.LustLevel();
		*/
		// Armor sluttiness based (TODO)
		const sedArmor = 1;

		// Currently range the attack between 0.9 and 1.1
		const sedRand = _.random(0.9, 1.1);

		return sedStat /* * sedLust*/ * sedArmor * sedRand;
	}

	public LDefense() {
		// Stat based
		let comStat = 2 * this.Sta() + this.Spi() + this.Cha();
		if (comStat < 0) { comStat = 0; }

		// Lust and libido based
	// 	let comLust = this.libido.Get() + this.LustLevel();

		// Currently range the attack between 0.9 and 1.1
		const comRand = _.random(0.9, 1.1);

		return comStat /* * comLust*/ * comRand;
	}

	// TODO temp
	public LHit() {
		const hitStat = 3 * this.Lib() + 2 * this.Cha();

		return hitStat;
	}

	// TODO temp
	public LEvade(attack?: number) {
		let evadeStat = 3 * this.Spi() + this.Sta() + this.Int();

		const blind = this.combatStatus.stats[StatusEffect.Blind];
		if (blind) {
			evadeStat *= (1 + blind.str);
		}

		return evadeStat;
	}

	public Resistance(type: number) {
		const res   = this.statusDef[type]     || 0;
		const gear  = this.statusDefGear[type] || 0;
		const wear  = this.statusWear[type]    || 0;
		const curse = this.combatStatus.stats[StatusEffect.Curse];
		let total = res + gear - wear;
		if (curse) {
			total -= curse.str;
		}
		// TODO other factors
		return total;
	}

	public AddResistanceWear(type: number, wear?: number) {
		wear = wear || 0;
		if (this.statusWear[type]) {
			this.statusWear[type] += wear;
		} else {
			this.statusWear[type] = wear;
		}
	}

	/* ENTITY SAVE */

	public SaveSexFlags(storage: any) {
		const sex: any = {};
		if (this.sex.rBlow != 0) { sex.rBlow = this.sex.rBlow; }
		if (this.sex.gBlow != 0) { sex.gBlow = this.sex.gBlow; }
		if (this.sex.rCunn != 0) { sex.rCunn = this.sex.rCunn; }
		if (this.sex.gCunn != 0) { sex.gCunn = this.sex.gCunn; }
		if (this.sex.rAnal != 0) { sex.rAnal = this.sex.rAnal; }
		if (this.sex.gAnal != 0) { sex.gAnal = this.sex.gAnal; }
		if (this.sex.rVag  != 0) { sex.rVag  = this.sex.rVag; }
		if (this.sex.gVag  != 0) { sex.gVag  = this.sex.gVag; }
		if (this.sex.sired != 0) { sex.sired = this.sex.sired; }
		if (this.sex.birth != 0) { sex.birth = this.sex.birth; }
		storage.sex = sex;
	}

	public SaveCombatStats(storage: any) {
		storage.name     = this.name;
		storage.exp      = this.experience.toFixed();
		storage.points   = this.pendingStatPoints.toFixed();
		storage.exp2lvl  = this.expToLevel.toFixed();
		storage.lvl      = this.level.toFixed();
		storage.sexp     = this.sexperience.toFixed();
		storage.sxp2lvl  = this.sexpToLevel.toFixed();
		storage.slvl     = this.sexlevel.toFixed();
		storage.alvl     = this.alchemyLevel.toFixed();
		storage.curHp    = this.curHp.toFixed(1);
		storage.maxHp    = this.maxHp.base.toFixed(1);
		storage.curSp    = this.curSp.toFixed(1);
		storage.maxSp    = this.maxSp.base.toFixed(1);
		storage.curLust  = this.curLust.toFixed(1);
		storage.maxLust  = this.maxLust.base.toFixed(1);
		// Main stats
		storage.str      = this.strength.base.toFixed(1);
		storage.sta      = this.stamina.base.toFixed(1);
		storage.dex      = this.dexterity.base.toFixed(1);
		storage.inte     = this.intelligence.base.toFixed(1);
		storage.spi      = this.spirit.base.toFixed(1);
		storage.lib      = this.libido.base.toFixed(1);
		storage.cha      = this.charisma.base.toFixed(1);
		// Growth
		storage.maxHpG   = this.maxHp.growth.toFixed(1);
		storage.maxSpG   = this.maxSp.growth.toFixed(1);
		storage.maxLustG = this.maxLust.growth.toFixed(1);
		storage.strG     = this.strength.growth.toFixed(1);
		storage.staG     = this.stamina.growth.toFixed(1);
		storage.dexG     = this.dexterity.growth.toFixed(1);
		storage.inteG    = this.intelligence.growth.toFixed(1);
		storage.spiG     = this.spirit.growth.toFixed(1);
		storage.libG     = this.libido.growth.toFixed(1);
		storage.chaG     = this.charisma.growth.toFixed(1);

		if (this.monsterName) { storage.mName = this.monsterName; }
		if (this.MonsterName) { storage.MName = this.MonsterName; }

		this.SaveStatusEffects(storage);
	}

	public SaveStatusEffects(storage: any) {
		const s = this.combatStatus.ToStorage();
		if (s) {
			storage.stat = s;
		}
	}

	public SavePersonalityStats(storage: any) {
		// Personality stats
		if (this.subDom.base   != 0) { storage.subDom = this.subDom.base.toFixed(); }
		if (this.slut.base     != 0) { storage.slut   = this.slut.base.toFixed(); }
		if (this.relation.base != 0) { storage.rel    = this.relation.base.toFixed(); }
		if (this.drunkLevel    != 0) { storage.drunk  = this.drunkLevel.toFixed(2); }
	}

	public SaveFlags(storage: any) {
		const flags: any = {};
		for (const flag in this.flags) {
			if (this.flags[flag] != 0) {
				flags[flag] = this.flags[flag];
			}
		}
		storage.flags = flags;
	}

	public SavePerks(storage: any) {
		const perks = [];
		for (let i = 0; i < this.perks.length; ++i) {
			perks.push(this.perks[i].id);
		}
		storage.perks = perks;
	}

	public SaveRecipes(storage: any) {
		if (this.recipes) {
			storage.recipes = [];
			for (let i = 0; i < this.recipes.length; i++) {
				storage.recipes.push(this.recipes[i].id);
			}
		}
	}

	public SaveJobs(storage: any) {
		storage.jobs = {};
		for (const job in this.jobs) {
			const jd = this.jobs[job];
			const jobStorage = jd.ToStorage();
			if (jobStorage) {
				storage.jobs[job] = jobStorage;
			}
		}
		if (this.currentJob) {
			storage.curJob = this.currentJob.name;
		}
	}

	public SaveEquipment(storage: any) {
		// Equipment
		if (this.weaponSlot) {   storage.wep    = this.weaponSlot.id; }
		if (this.topArmorSlot) { storage.toparm = this.topArmorSlot.id; }
		if (this.botArmorSlot) { storage.botarm = this.botArmorSlot.id; }
		if (this.acc1Slot) {     storage.acc1   = this.acc1Slot.id; }
		if (this.acc2Slot) {     storage.acc2   = this.acc2Slot.id; }

		if (this.strapOn) {      storage.toy    = this.strapOn.id; }
	}

	public SavePregnancy(storage: any) {
		storage.preg = this.pregHandler.ToStorage();
	}

	public SaveLactation(storage: any) {
		storage.lact = this.lactHandler.ToStorage();
	}

	// Only saves some stats from body
	/*
	* opts: cock
	*       balls
	*       vag
	*       ass
	*       breasts
	*       full
	*/
	public SaveBodyPartial(storage: any, opts: any) {
		storage.body = this.body.ToStoragePartial(opts);
	}

	// Convert to a format easy to write to/from memory
	public ToStorage() {
		const storage: any = {};

		storage.body = this.body.ToStorage();

		this.SaveCombatStats(storage);
		this.SavePersonalityStats(storage);
		this.SaveRecipes(storage);
		this.SaveJobs(storage);
		this.SaveEquipment(storage);
		this.SavePregnancy(storage);
		this.SaveLactation(storage);

		this.SaveFlags(storage);
		this.SaveSexFlags(storage);
		this.SavePerks(storage);

		return storage;
	}

	public LoadCombatStats(storage: any) {
		this.name              = storage.name  || this.name;
		this.monsterName       = storage.mName || this.monsterName;
		this.MonsterName       = storage.MName || this.MonsterName;

		this.experience        = !isNaN(parseInt(storage.exp))     ? parseInt(storage.exp) : this.experience;
		this.level             = !isNaN(parseInt(storage.lvl))     ? parseInt(storage.lvl) : this.level;
		this.pendingStatPoints = !isNaN(parseInt(storage.points))  ? parseInt(storage.points) : this.pendingStatPoints;
		this.expToLevel        = !isNaN(parseInt(storage.exp2lvl)) ? parseInt(storage.exp2lvl) : this.expToLevel;
		this.sexperience       = !isNaN(parseInt(storage.sexp))    ? parseInt(storage.sexp) : this.sexperience;
		this.sexpToLevel       = !isNaN(parseInt(storage.sxp2lvl)) ? parseInt(storage.sxp2lvl) : this.sexpToLevel;
		this.sexlevel          = !isNaN(parseInt(storage.slvl))    ? parseInt(storage.slvl) : this.sexlevel;
		this.alchemyLevel      = !isNaN(parseInt(storage.alvl))    ? parseInt(storage.alvl) : this.alchemyLevel;
		this.curHp             = !isNaN(parseFloat(storage.curHp))   ? parseFloat(storage.curHp) : this.curHp;
		this.maxHp.base        = !isNaN(parseFloat(storage.maxHp))   ? parseFloat(storage.maxHp) : this.maxHp.base;
		this.curSp             = !isNaN(parseFloat(storage.curSp))   ? parseFloat(storage.curSp) : this.curSp;
		this.maxSp.base        = !isNaN(parseFloat(storage.maxSp))   ? parseFloat(storage.maxSp) : this.maxSp.base;
		this.curLust           = !isNaN(parseFloat(storage.curLust)) ? parseFloat(storage.curLust) : this.curLust;
		this.maxLust.base      = !isNaN(parseFloat(storage.maxLust)) ? parseFloat(storage.maxLust) : this.maxLust.base;
		// Main stats
		this.strength.base     = !isNaN(parseFloat(storage.str))     ? parseFloat(storage.str) : this.strength.base;
		this.stamina.base      = !isNaN(parseFloat(storage.sta))     ? parseFloat(storage.sta) : this.stamina.base;
		this.dexterity.base    = !isNaN(parseFloat(storage.dex))     ? parseFloat(storage.dex) : this.dexterity.base;
		this.intelligence.base = !isNaN(parseFloat(storage.inte))    ? parseFloat(storage.inte) : this.intelligence.base;
		this.spirit.base       = !isNaN(parseFloat(storage.spi))     ? parseFloat(storage.spi) : this.spirit.base;
		this.libido.base       = !isNaN(parseFloat(storage.lib))     ? parseFloat(storage.lib) : this.libido.base;
		this.charisma.base     = !isNaN(parseFloat(storage.cha))     ? parseFloat(storage.cha) : this.charisma.base;
		// Growth
		this.maxHp.growth        = !isNaN(parseFloat(storage.maxHpG))   ? parseFloat(storage.maxHpG) : this.maxHp.growth;
		this.maxSp.growth        = !isNaN(parseFloat(storage.maxSpG))   ? parseFloat(storage.maxSpG) : this.maxSp.growth;
		this.maxLust.growth      = !isNaN(parseFloat(storage.maxLustG)) ? parseFloat(storage.maxLustG) : this.maxLust.growth;
		this.strength.growth     = !isNaN(parseFloat(storage.strG))     ? parseFloat(storage.strG) : this.strength.growth;
		this.stamina.growth      = !isNaN(parseFloat(storage.staG))     ? parseFloat(storage.staG) : this.stamina.growth;
		this.dexterity.growth    = !isNaN(parseFloat(storage.dexG))     ? parseFloat(storage.dexG) : this.dexterity.growth;
		this.intelligence.growth = !isNaN(parseFloat(storage.inteG))    ? parseFloat(storage.inteG) : this.intelligence.growth;
		this.spirit.growth       = !isNaN(parseFloat(storage.spiG))     ? parseFloat(storage.spiG) : this.spirit.growth;
		this.libido.growth       = !isNaN(parseFloat(storage.libG))     ? parseFloat(storage.libG) : this.libido.growth;
		this.charisma.growth     = !isNaN(parseFloat(storage.chaG))     ? parseFloat(storage.chaG) : this.charisma.growth;

		this.LoadStatusEffects(storage);
	}

	public LoadStatusEffects(storage: any) {
		if (storage.stat) {
			this.combatStatus.FromStorage(storage.stat);
		}
	}

	public LoadPersonalityStats(storage: any) {
		// Personality stats
		this.subDom.base         = parseInt(storage.subDom)  || this.subDom.base;
		this.slut.base           = parseInt(storage.slut)    || this.slut.base;
		this.relation.base       = parseInt(storage.rel)     || this.relation.base;
		this.drunkLevel          = parseFloat(storage.drunk) || this.drunkLevel;
	}

	public LoadRecipes(storage: any) {
		if (storage.recipes) {
			this.recipes = [];
			for (let i = 0; i < storage.recipes.length; i++) {
				this.recipes.push(ItemIds[storage.recipes[i]]);
			}
		}
	}

	public LoadJobs(storage: any) {
		if (storage.jobs) {
			for (const job in this.jobs) {
				const jd = this.jobs[job];
				jd.FromStorage(storage.jobs[jd.job.name]);
			}
		}
		if (storage.curJob) {
			this.currentJob = Jobs[storage.curJob];
		}
	}

	public LoadEquipment(storage: any) {
		if (storage.wep) {    this.weaponSlot   = ItemIds[storage.wep]; }
		if (storage.toparm) { this.topArmorSlot = ItemIds[storage.toparm]; }
		if (storage.botarm) { this.botArmorSlot = ItemIds[storage.botarm]; }
		if (storage.acc1) {   this.acc1Slot     = ItemIds[storage.acc1]; }
		if (storage.acc2) {   this.acc2Slot     = ItemIds[storage.acc2]; }

		if (storage.toy) {    this.strapOn      = ItemIds[storage.toy]; }
	}

	public LoadFlags(storage: any) {
		for (const flag in storage.flags) {
			this.flags[flag] = parseInt(storage.flags[flag]);
		}
	}

	public LoadSexFlags(storage: any) {
		for (const flag in storage.sex) {
			this.sex[flag] = parseInt(storage.sex[flag]);
		}
	}

	public LoadPerks(storage: any) {
		if (storage.perks) {
			this.perks = [];
			for (let i = 0; i < storage.perks.length; i++) {
				this.perks.push(PerkIds[storage.perks[i]]);
			}
		}
	}

	public LoadPregnancy(storage: any) {
		this.pregHandler.FromStorage(storage.preg);
	}

	public LoadLactation(storage: any) {
		this.lactHandler.FromStorage(storage.lact);
	}

	public FromStorage(storage: any) {
		storage = storage || {};

		if (storage.body) {
			this.body = new Body(this);
			this.body.FromStorage(storage.body);
		}
		this.LoadPregnancy(storage);
		this.LoadLactation(storage);

		// Load flags
		this.LoadFlags(storage);
		this.LoadSexFlags(storage);
		this.LoadCombatStats(storage);
		this.LoadPersonalityStats(storage);

		this.LoadRecipes(storage);
		this.LoadJobs(storage);
		this.LoadEquipment(storage);
		this.LoadPerks(storage);

		this.RecallAbilities(); // TODO: Implement for special abilitiy sources (flag dependent)
		this.SetLevelBonus();
		this.Equip();
	}

	public RecallAbilities() {
		for (const job in this.jobs) {
			const jd = this.jobs[job];
			for (let i = 0; i < jd.level - 1; i++) {
				if (i >= jd.job.levels.length) { break; }
				const skills = jd.job.levels[i].skills;
				// Teach new skills
				if (skills) {
					// [ { ab: Ablities.Black.Fireball, set: "Spells" }, ... ]
					for (let j = 0; j < skills.length; j++) {
						const sd      = skills[j];
						const ability = sd.ab;
						const set     = sd.set;
						this.abilities[set].AddAbility(ability);
					}
				}
			}
		}
	}

	/* ENTITY DESC */
	public PrintDescription(partial?: boolean) {
		let parse: any = {
			name     : this.NameDesc(),
			possesive: this.possessive(),
			weigth   : Math.floor(this.body.weigth.Get() * 2),
			race     : this.body.RaceStr(),
			gender   : this.body.GenderStr(),
			skinDesc : this.body.SkinDesc(),
			faceDesc : this.body.FaceDescLong(),
			eyeCount : Text.NumToText(this.body.head.eyes.count.Get()),
			eyeColor : Color.Desc(this.body.head.eyes.color),
			eyeS     : this.body.head.eyes.count.Get() == 1 ? "" : "s",
			hairDesc : this.body.head.hair.Long(),
			buttDesc : this.Butt().Long(),
			hipsDesc : this.HipsDesc(),
			anusDesc : this.Butt().AnalLong(),
			ballsDesc: this.Balls().Long(),
			has      : this.has(),
			is       : this.is(),
			larmor   : this.LowerArmorDescLong(),
		};
		parse = this.ParserTags(parse);
		parse = this.ParserPronouns(parse);
		const height = Math.floor(Unit.CmToInch(this.body.height.Get()));
		const height_feet = Math.floor(height / 12);
		const height_inches = Math.floor(height % 12);
		parse.height = height_feet + " feet";
		if (height_inches > 0) {
			parse.height += " and " + height_inches + " inch";
			if (height_inches > 1) {
				parse.height += "es";
			}
		}

		Text.Add("[name] [is] a [gender] [race], [height] tall and weighing around [weigth]lb. [HeShe] [has] [skinDesc]. ", parse);
		Text.Add("[HeShe] [is] wearing [armor].", parse);
		if (this.LowerArmor()) { Text.Add(" [HeShe] [is] wearing [larmor].", parse); }
		if (this.Weapon()) { Text.Add(" [HeShe] [is] wielding [weapon].", parse); }
		// TODO Body appearance, skin color
		Text.NL();
		Text.Add("[HeShe] [has] [faceDesc]. [HisHer] [eyeCount] [eyeColor] [eye][eyeS] observe the surroundings. ", parse);
		Text.Add("A pair of [ears] sticks out from [possesive] [hairDesc]. ", parse);

		for (let i = 0; i < this.body.head.appendages.length; i++) {
			const a = this.body.head.appendages[i];
			parse.appDesc = a.Long();
			Text.Add("On [hisher] head, [heshe] [has] a [appDesc]. ", parse);
		}

		Text.NL();
		let bs = false;
		// Back slots
		for (let i = 0; i < this.body.backSlots.length; i++) {
			const b = this.body.backSlots[i];
			parse.appDesc = b.Long();
			Text.Add("On [hisher] back, [heshe] [has] a [appDesc]. ", parse);
			bs = true;
		}
		if (bs) { Text.NL(); }

		// TODO: Arms/Legs
		if (this.body.legs.count == 2) {
			Text.Add("[name] [has] arms. [name] [has] [legs], ending in [feet].", parse);
		} else if (this.body.legs.count > 2) {
			parse.num = Text.NumToText(this.body.legs.count);
			parse.race = this.body.legs.race.qShort();
			Text.Add("[name] [has] arms and [num] [race] legs.", parse);
		} else {
			parse.race = this.body.legs.race.qShort();
			Text.Add("[name] [has] arms and [race] lower body.", parse);
		}
		Text.NL();

		// TODO: Hips/butt
		Text.Add("[name] [has] [hipsDesc], and [buttDesc].", parse);
		Text.NL();

		// TODO: Breasts
		const breasts = this.body.breasts;
		if (breasts.length == 1) {
			parse.breastDesc = breasts[0].Long();
			Text.Add("[HeShe] [has] [breastDesc].", parse);
		} else if (breasts.length > 1) {
			const breast = breasts[0];
			const breastDesc = breast.Desc();
			parse.breastDesc = breasts[0].Short();
			parse.breastSize = breastDesc.size;
			Text.Add("Multiple rows of " + breast.nounPlural() + " sprout from [hisher] chest. [HisHer] first pair of [breastDesc] are [breastSize] in circumference.", parse);
			for (let i = 1; i < breasts.length; i++) {
				Text.Add("<br>Another two breasts.");
			}
		} else {
			Text.Add("[name] have a featureless smooth chest.", parse);
		}
		if (breasts.length > 0) {
			this.LactationDesc(parse);
		}
		Text.NL();

		// Genetalia
		const cocks = this.body.cock;
		const vags = this.body.vagina;

		if (cocks.length == 1) {
			const cock = cocks[0];
			parse.cockDesc = cock.aLong();
			Text.Add("[name] [has] [cockDesc].", parse);
		} else if (cocks.length > 1) {
			const cock = cocks[0];
			parse.cockDesc = cock.aLong();
			parse.numCocks = Text.NumToText(cocks.length);
			Text.Add("[name] [has] a brace of [numCocks] " + cock.nounPlural() + ".", parse);
			for (let i = 0; i < cocks.length; i++) {
				const cock = cocks[i];
				parse.cockDesc = cock.aLong();
				Text.NL();
				Text.Add("[name] [has] [cockDesc].", parse);
			}
		}
		if (cocks[0]) {
			Text.NL();
		}

		// TODO: balls
		if (this.HasBalls()) {
			if (cocks.length > 0 || vags.length > 0) {
				Text.Add("Beneath [hisher] other genitalia, [ballsDesc] hang.", parse);
			} else {
				// Weird, no genetalia, just balls
				Text.Add("Strangely, [ballsDesc] hang from [hisher] otherwise flat crotch.", parse);
			}
			Text.NL();
		} else if (cocks.length == 0 && vags.length == 0) {
			// Genderless, no balls
			Text.Add("[name] [has] a smooth, featureless crotch.", parse);
			Text.NL();
		}

		// TODO: vagina
		if (vags.length == 1) {
			const vag = vags[0];
			const vagDesc = vag.Desc();
			Text.Add("[name] [has] " + vagDesc.a + " " + vagDesc.adj + " " + vag.noun() + ".", parse);
		} else if (vags.length > 1) {
			const vag = vags[0];
			Text.Add("[name] [has] multiple " + vag.nounPlural() + ". [HisHer] first " + vag.noun() + " is slutty.<br>", parse);
			for (let i = 1; i < vags.length; i++) {
				Text.Add("<br>Another of [hisher] " + vag.nounPlural() + " is slutty.", parse);
			}
		}
		if (vags[0]) {
			Text.NL();
		}

		if (partial) {
			return;
		}

		// TODO TEMP
		const balls = this.Balls();
		Text.Add("Cum: " + balls.cum.Get().toFixed(2) + " / " + balls.CumCap().toFixed(2));
		Text.NL();
		Text.Add("Milk: " + this.Milk().toFixed(2) + " / " + this.MilkCap().toFixed(2));
		Text.NL();

		// TODO: Pregnancy
		let womb = this.pregHandler.Womb({slot: PregnancyHandler.Slot.Vag});
		if (womb && womb.pregnant) {
			parse.proc = (womb.progress * 100).toFixed(1);
			parse.hour = womb.hoursToBirth.toFixed(1);
			Text.Add("[name] [is] pregnant. Current progress, [proc]%. [hour] hours to term.", parse);
			Text.NL();
		}

		womb = this.pregHandler.Womb({slot: PregnancyHandler.Slot.Butt});
		if (womb && womb.pregnant) {
			parse.proc = (womb.progress * 100).toFixed(1);
			parse.hour = womb.hoursToBirth.toFixed(1);
			Text.Add("[name] [is] butt-pregnant. Current progress, [proc]%. [hour] hours to term.", parse);
			Text.NL();
		}

		// TODO: Ass
		Text.Add("[name] [has] [anusDesc].", parse);

		if (GetDEBUG()) {
			Text.NL();
			Text.Add("DEBUG: relation: " + this.relation.Get(), null, "bold");
			Text.NL();
			Text.Add("DEBUG: subDom: " + this.subDom.Get(), null, "bold");
			Text.NL();
			Text.Add("DEBUG: slut: " + this.slut.Get(), null, "bold");
			Text.NL();
		}

		const drunk = this.DrunkStr();
		if (drunk) {
			Text.NL();
			Text.Add(drunk);
		}

		Text.Flush();
	}

	// TODO: affect with lust/perks?
	public SubDom() {
		return this.subDom.Get();
	}
	public Relation() {
		return this.relation.Get();
	}
	public Slut() {
		return this.slut.Get();
	}

	public Gender() {
		return this.body.Gender();
	}
	public Race() {
		return this.body.torso.race;
	}

	public MuscleTone() {
		return this.body.muscleTone.Get();
	}
	public BodyMass() {
		return this.body.bodyMass.Get();
	}

	public Height() {
		return this.body.height.Get();
	}
	public Weigth() {
		return this.body.weigth.Get();
	}

	public Humanity() {
		const racescore = new RaceScore(this.body);
		const humanScore = new RaceScore();
		humanScore.score[Race.Human.id] = 1;
		return racescore.Compare(humanScore);
	}
	public RaceCompare(race: RaceDesc) {
		const racescore = new RaceScore(this.body);
		return racescore.SumScore(race);
	}
	public Femininity() {
		return this.body.femininity.Get();
	}
	public FaceDesc() {
		return this.body.FaceDesc();
	}
	public SkinDesc() {
		return this.body.SkinDesc();
	}
	public SkinType() {
		return this.body.torso.race;
	}
	public LipsDesc() {
		return this.body.LipsDesc();
	}
	public TongueDesc() {
		return this.body.TongueDesc();
	}
	public TongueTipDesc() {
		return this.body.TongueTipDesc();
	}
	public LongTongue() {
		return this.body.LongTongue();
	}
	public Hair() {
		return this.body.head.hair;
	}
	public HasHair() {
		return this.body.head.hair.Bald() == false;
	}
	public HasLongHair() {
		return this.body.head.hair.Bald() == false; // TODO
	}
	public Face() {
		return this.body.head;
	}
	public Mouth() {
		return this.body.head.mouth;
	}
	public Tongue() {
		return this.body.head.mouth.tongue;
	}
	public Eyes() {
		return this.body.head.eyes;
	}
	public EyeDesc() {
		return this.body.EyeDesc();
	}
	public Ears() {
		return this.body.head.ears;
	}
	public EarDesc(plural?: boolean) {
		return this.body.EarDesc(plural);
	}
	public HasFlexibleEars() {
		return this.body.HasFlexibleEars();
	}
	public HasMuzzle() {
		return this.body.HasMuzzle();
	}
	public HasLongSnout() {
		return this.body.HasLongSnout();
	}
	public Arms() {
		return this.body.arms;
	}
	public MultiArm() {
		return this.body.arms.count > 2;
	}
	public Legs() {
		return this.body.legs;
	}
	public LowerBodyType() {
		if     (this.body.legs.count <  2) { return LowerBodyType.Single; } else if (this.body.legs.count == 2) { return LowerBodyType.Humanoid; } else {                               return LowerBodyType.Taur; }
	}
	public NumLegs() {
		return this.body.legs.count;
	}
	public Humanoid() {
		return this.LowerBodyType() == LowerBodyType.Humanoid;
	}
	public HasLegs() {
		return (this.body.legs.count >= 2);
	}
	public IsNaga() {
		return (this.body.legs.count < 2) &&
			(this.body.legs.race.isRace(Race.Snake));
	}
	public IsTaur() {
		return this.LowerBodyType() == LowerBodyType.Taur;
	}
	public IsGoo() {
		return (this.body.legs.race.isRace(Race.Goo));
	}
	public IsFlexible() {
		return this.body.IsFlexible(); // TODO Perks
	}
	public Butt() {
		return this.body.ass;
	}
	public HasBalls() {
		return this.Balls().count.Get() > 0;
	}
	public Balls() {
		return this.body.balls;
	}
	public BallsDesc() {
		return this.Balls().Short();
	}
	public Virility() {
		return this.body.balls.fertility.Get();
	}
	public HasFur() {
		return this.body.HasFur();
	}
	public HasSkin() {
		return this.body.HasSkin();
	}
	public HasScales() {
		return this.body.HasScales();
	}

	public LactationDesc(parse: any) {

	}
	public StomachDesc() {
		const bellysize = this.pregHandler.BellySize();
		return this.body.StomachDesc(bellysize);
	}
	public HipDesc() {
		return this.body.HipsDesc();
	}
	public HipsDesc() {
		return this.body.HipsDesc(true);
	}
	public HipSize() {
		return this.body.HipSize();
	}
	// TODO
	public ArmDesc() {
		return this.body.ArmDesc();
	}
	public HandDesc() {
		return this.body.HandDesc();
	}
	public PalmDesc() {
		return this.body.PalmDesc();
	}
	public LegDesc() {
		return this.body.LegDesc();
	}
	public LegsDesc() {
		return this.body.LegsDesc();
	}
	public ThighDesc() {
		return this.body.ThighDesc();
	}
	public ThighsDesc() {
		return this.body.ThighsDesc();
	}
	public KneeDesc() {
		return this.body.KneesDesc();
	}
	public KneesDesc() {
		return this.body.KneesDesc(true);
	}
	public FeetDesc() {
		return this.body.FeetDesc();
	}
	public FootDesc() {
		return this.body.FootDesc();
	}
	public Appendages() {
		return this.body.head.appendages;
	}
	public HasNightvision() {
		return this.body.HasNightvision();
	}
	public HasHorns() {
		for (let i = 0; i < this.body.head.appendages.length; i++) {
			if (this.body.head.appendages[i].type == AppendageType.horn) {
				return this.body.head.appendages[i];
		}
			}
		return null;
	}
	public HasAntenna() {
		for (let i = 0; i < this.body.head.appendages.length; i++) {
			if (this.body.head.appendages[i].type == AppendageType.antenna) {
				return this.body.head.appendages[i];
			}
		}
		return null;
	}
	public Back() {
		return this.body.backSlots;
	}
	public HasTail() {
		for (let i = 0; i < this.body.backSlots.length; i++) {
			if (this.body.backSlots[i].type == AppendageType.tail) {
				return this.body.backSlots[i];
		}
			}
		return null;
	}
	public HasPrehensileTail() {
		let found = false;
		for (let i = 0; i < this.body.backSlots.length; i++) {
			if (this.body.backSlots[i].type == AppendageType.tail) {
				found = found || this.body.backSlots[i].Prehensile();
		}
			}
		return found;
	}
	public HasWings() {
		for (let i = 0; i < this.body.backSlots.length; i++) {
			if (this.body.backSlots[i].type == AppendageType.wing) {
				return this.body.backSlots[i];
			}
		}
		return null;
	}
	public NumAttributes(race: RaceDesc) {
		return this.body.NumAttributes(race);
	}

	// TODO
	public Weapon() {
		return this.weaponSlot;
	}
	// TODO
	public WeaponDesc() {
		return this.weaponSlot ? this.weaponSlot.sDesc() : "stick";
	}
	// TODO
	public WeaponDescLong() {
		return this.weaponSlot ? this.weaponSlot.lDesc() : "a stick";
	}
	// TODO
	public Armor() {
		return this.topArmorSlot;
	}
	// TODO
	public LowerArmor() {
		return this.botArmorSlot;
	}
	// TODO
	public LowerArmorDesc() {
		return this.botArmorSlot ? this.botArmorSlot.sDesc() : this.ArmorDesc();
	}
	// TODO
	public LowerArmorDescLong() {
		return this.botArmorSlot ? this.botArmorSlot.lDesc() : this.ArmorDescLong();
	}
	// TODO
	public ArmorDesc() {
		return this.topArmorSlot ? this.topArmorSlot.sDesc() : "comfortable clothes";
	}
	public ArmorDescLong() {
		return this.topArmorSlot ? this.topArmorSlot.lDesc() : "a set of comfortable clothes";
	}
	public Accessories() {
		return [this.acc1Slot, this.acc2Slot];
	}

	/* ENTITY GRAMMAR */

	public nameDesc() {
		return this.monsterName || this.name;
	}
	public NameDesc() {
		return this.MonsterName || this.name;
	}
	public possessive() {
		const name = this.monsterName || this.name || "the entity";
		const letter = name[name.length - 1];
		const s = (letter == "s" || letter == "x") ? "'" : "'s";
		return name + s;
	}
	public Possessive() {
		const name = this.MonsterName || this.name || "The entity";
		const letter = name[name.length - 1];
		const s = (letter == "s" || letter == "x") ? "'" : "'s";
		return name + s;
	}
	public possessivePlural() {
		const name = this.groupName || this.name || "the entities";
		return name + "'";
	}
	public PossessivePlural() {
		const name = this.GroupName || this.name || "The entities";
		return name + "'";
	}
	public heshe(forcegender?: Gender): string {
		const gender = forcegender ? forcegender : this.body.Gender();
		if (gender == Gender.male) { return "he"; } else if (gender == Gender.female) { return "she"; } else if (gender == Gender.herm) { return "she"; } else { return "they"; }
	}
	public HeShe(forcegender?: Gender): string {
		const gender = forcegender ? forcegender : this.body.Gender();
		if (gender == Gender.male) { return "He"; } else if (gender == Gender.female) { return "She"; } else if (gender == Gender.herm) { return "She"; } else { return "They"; }
	}
	public himher(forcegender?: Gender): string {
		const gender = forcegender ? forcegender : this.body.Gender();
		if (gender == Gender.male) { return "him"; } else if (gender == Gender.female) { return "her"; } else if (gender == Gender.herm) { return "her"; } else { return "them"; }
	}
	public HimHer(forcegender?: Gender): string {
		const gender = forcegender ? forcegender : this.body.Gender();
		if (gender == Gender.male) { return "Him"; } else if (gender == Gender.female) { return "Her"; } else if (gender == Gender.herm) { return "Her"; } else { return "Them"; }
	}
	public hisher(forcegender?: Gender): string {
		const gender = forcegender ? forcegender : this.body.Gender();
		if (gender == Gender.male) { return "his"; } else if (gender == Gender.female) { return "her"; } else if (gender == Gender.herm) { return "her"; } else { return "their"; }
	}
	public HisHer(forcegender?: Gender): string {
		const gender = forcegender ? forcegender : this.body.Gender();
		if (gender == Gender.male) { return "His"; } else if (gender == Gender.female) { return "Her"; } else if (gender == Gender.herm) { return "Her"; } else { return "Their"; }
	}
	public hishers(forcegender?: Gender): string {
		const gender = forcegender ? forcegender : this.body.Gender();
		if (gender == Gender.male) { return "his"; } else if (gender == Gender.female) { return "hers"; } else if (gender == Gender.herm) { return "hers"; } else { return "theirs"; }
	}
	public has(): string {
		if (this.body.Gender() == Gender.none) { return "have"; }
		return "has";
	}
	public is(): string {
		if (this.body.Gender() == Gender.none) { return "are"; }
		return "is";
	}
	public plural() {
		return (this.body.Gender() == Gender.none);
	}
	// TODO femininity from other things (breasts etc)
	public mfFem(male: any, female: any) {
		return this.body.femininity.Get() > 0 ? female : male;
	}
	public mfTrue(male: any, female: any) {
		return (this.body.Gender() == Gender.male) ? male : female;
	}

	public ParserPronouns(parse?: any, prefix?: string, postfix?: string, forcegender?: Gender) {
		parse   = parse   || {};
		prefix  = prefix  || "";
		postfix = postfix || "";
		parse[prefix + "HeShe" + postfix]   = this.HeShe(forcegender);
		parse[prefix + "heshe" + postfix]   = this.heshe(forcegender);
		parse[prefix + "HisHer" + postfix]  = this.HisHer(forcegender);
		parse[prefix + "hisher" + postfix]  = this.hisher(forcegender);
		parse[prefix + "HimHer" + postfix]  = this.HimHer(forcegender);
		parse[prefix + "himher" + postfix]  = this.himher(forcegender);
		parse[prefix + "hishers" + postfix] = this.hishers(forcegender);
		return parse;
	}

	public ParserTags(parse?: any, prefix?: string, p1cock?: Cock) {
		const ent = this;
		parse  = parse  || {};
		prefix = prefix || "";

		p1cock = p1cock || ent.BiggestCock(null, true);

		parse[prefix + "cocks"]     = function() { return ent.MultiCockDesc(); };
		parse[prefix + "cock"]      = function() { return p1cock.Short(); };
		parse[prefix + "cockTip"]   = function() { return p1cock.TipShort(); };
		parse[prefix + "knot"]      = function() { return p1cock.KnotShort(); };
		parse[prefix + "balls"]     = function() { return ent.BallsDesc(); };
		parse[prefix + "butt"]      = function() { return ent.Butt().Short(); };
		parse[prefix + "anus"]      = function() { return ent.Butt().AnalShort(); };
		parse[prefix + "vag"]       = function() { return ent.FirstVag() ? ent.FirstVag().Short() : "crotch"; };
		parse[prefix + "clit"]      = function() { return ent.FirstVag().ClitShort(); };
		parse[prefix + "breasts"]   = function() { return ent.FirstBreastRow().Short(); };
		parse[prefix + "nip"]       = function() { return ent.FirstBreastRow().NipShort(); };
		parse[prefix + "nips"]      = function() { return ent.FirstBreastRow().NipsShort(); };
		parse[prefix + "tongue"]    = function() { return ent.TongueDesc(); };
		parse[prefix + "tongueTip"] = function() { return ent.TongueTipDesc(); };
		parse[prefix + "skin"]      = function() { return ent.SkinDesc(); };
		parse[prefix + "hair"]      = function() { return ent.Hair().Short(); };
		parse[prefix + "face"]      = function() { return ent.FaceDesc(); };
		parse[prefix + "ear"]       = function() { return ent.EarDesc(); };
		parse[prefix + "ears"]      = function() { return ent.EarDesc(true); };
		parse[prefix + "eye"]       = function() { return ent.EyeDesc(); };
		parse[prefix + "eyes"]      = function() { return ent.EyeDesc() + "s"; };
		parse[prefix + "hand"]      = function() { return ent.HandDesc(); };
		parse[prefix + "palm"]      = function() { return ent.PalmDesc(); };
		parse[prefix + "hip"]       = function() { return ent.HipDesc(); };
		parse[prefix + "hips"]      = function() { return ent.HipsDesc(); };
		parse[prefix + "thigh"]     = function() { return ent.ThighDesc(); };
		parse[prefix + "thighs"]    = function() { return ent.ThighsDesc(); };
		parse[prefix + "legs"]      = function() { return ent.LegsDesc(); };
		parse[prefix + "leg"]       = function() { return ent.LegDesc(); };
		parse[prefix + "knee"]      = function() { return ent.KneeDesc(); };
		parse[prefix + "knees"]     = function() { return ent.KneesDesc(); };
		parse[prefix + "foot"]      = function() { return ent.FootDesc(); };
		parse[prefix + "feet"]      = function() { return ent.FeetDesc(); };
		parse[prefix + "belly"]     = function() { return ent.StomachDesc(); };
		parse[prefix + "tail"]      = function() { const tail = ent.HasTail(); return tail ? tail.Short() : ""; };
		parse[prefix + "wings"]     = function() { const wings = ent.HasWings(); return wings ? wings.Short() : ""; };
		parse[prefix + "horns"]     = function() { const horns = ent.HasHorns(); return horns ? horns.Short() : ""; };

		parse[prefix + "weapon"]    = function() { return ent.WeaponDesc(); };
		parse[prefix + "armor"]     = function() { return ent.ArmorDesc(); };
		parse[prefix + "botarmor"]  = function() { return ent.LowerArmorDesc(); };
		return parse;
	}

	public toString() {
		return this.name;
	}

	public Appearance() {
		return this.NameDesc()
		+ " is a "
		+ this.body.GenderStr() + " "
		+ this.body.RaceStr() + ".";
	}

	/* ENTITY SEX */
	public Genitalia() {
		return this.body.gen;
	}

	// TODO: affect with things such as stretch, lust, perks etc
	public VagCap() {
		return this.FirstVag().capacity.Get();
	}
	public OralCap() {
		return this.Mouth().capacity.Get();
	}
	public AnalCap() {
		return this.Butt().capacity.Get();
	}

	public ResetVirgin() {
		this.Butt().virgin = true;
		const vags = this.AllVags();
		for (let i = 0; i < vags.length; i++) {
			vags[i].virgin = true;
		}
	}

	// Convenience functions, cock
	public NumCocks() {
		return this.body.cock.length;
	}
	public FirstCock() {
		return this.body.cock[0];
	}
	public FirstClitCockIdx() {
		for (let i = 0, j = this.body.cock.length; i < j; i++) {
			const c = this.body.cock[i];
			if (c.vag) {
				return i;
			}
		}
		return -1;
	}
	public BiggestCock(cocks?: Cock[], incStrapon?: boolean) {
		cocks = cocks || this.body.cock;
		let c = cocks[0];
		if (c) {
			let cSize = cocks[0].length.Get() * cocks[0].thickness.Get();
			for (let i = 1, j = cocks.length; i < j; i++) {
				const newSize = cocks[i].length.Get() * cocks[i].thickness.Get();
				if (newSize > cSize) {
					cSize = newSize;
					c = cocks[i];
				}
			}
		}
		if (c) {
			return c;
		} else if (incStrapon && this.strapOn) {
			return this.strapOn.cock;
 }
	}
	public CocksThatFit(orifice?: Orifice, onlyRealCocks?: boolean, extension?: any) {
		const ret = [];
		for (let i = 0, j = this.body.cock.length; i < j; i++) {
			const c = this.body.cock[i];
			if (!orifice || orifice.Fits(c, extension)) {
				ret.push(c);
			}
		}
		if (ret.length == 0 && !onlyRealCocks && this.strapOn) {
			const c: Cock = this.strapOn.cock;
			if (!orifice || orifice.Fits(c, extension)) {
				ret.push(c);
			}
		}
		return ret;
	}
	public AllCocksCopy() {
		const ret = [];
		for (let i = 0, j = this.body.cock.length; i < j; i++) {
			const c = this.body.cock[i];
			ret.push(c);
		}
		return ret;
	}
	public AllCocks() {
		return this.body.cock;
	}
	// TODO: Race too
	public MultiCockDesc(cocks?: Cock[]) {
		cocks = cocks || this.body.cock;
		if (cocks.length == 0) {
			if (this.strapOn) {
				return this.strapOn.cock.Short();
			} else {
				return "[NO COCKS]";
			}
		} else if (cocks.length == 1) {
			return cocks[0].Short();
 } else {
			return Text.Quantify(cocks.length) + " of " + cocks[0].Desc().adj + " " + cocks[0].nounPlural();
 }
	}

	// Convenience functions, vag
	public NumVags() {
		return this.body.vagina.length;
	}
	public FirstVag() {
		return this.body.vagina[0];
	}
	public VagsThatFit(capacity: number) {
		const ret: Vagina[] = [];
		for (let i = 0; i < this.body.vagina.length; i++) {
			const vag = this.body.vagina[i];
			const size = vag.capacity.Get();
			if (size >= capacity) {
				ret.push(vag);
			}
		}
		return ret;
	}
	public AllVags() {
		return this.body.vagina;
	}
	public UnfertilezedWomb() {
		const ret: Womb[] = [];
		for (let i = 0, j = this.body.vagina.length; i < j; i++) {
			const womb = this.body.vagina[i].womb;
			if (womb.pregnant == false) {
				ret.push(womb);
			}
		}
		return ret;
	}

	// Convenience functions, breasts
	public NumBreastRows() {
		return this.body.breasts.length;
	}
	public FirstBreastRow() {
		return this.body.breasts[0];
	}
	public AllBreastRows() {
		return this.body.breasts;
	}
	public BiggestBreasts() {
		const breasts = this.body.breasts;
		let c = breasts[0];
		let cSize = breasts[0].Size();
		for (let i = 1, j = breasts.length; i < j; i++) {
			const newSize = breasts[i].Size();
			if (newSize > cSize) {
				cSize = newSize;
				c = breasts[i];
			}
		}
		return c;
	}
	public SmallestBreasts() {
		const breasts = this.body.breasts;
		let c = breasts[0];
		let cSize = breasts[0].Size();
		for (let i = 1, j = breasts.length; i < j; i++) {
			const newSize = breasts[i].Size();
			if (newSize < cSize) {
				cSize = newSize;
				c = breasts[i];
			}
		}
		return c;
	}
	public BiggestNips() {
		const breasts = this.body.breasts;
		let c = breasts[0];
		let cSize = breasts[0].NipSize();
		for (let i = 1, j = breasts.length; i < j; i++) {
			const newSize = breasts[i].NipSize();
			if (newSize > cSize) {
				cSize = newSize;
				c = breasts[i];
			}
		}
		return c;
	}
	public SmallestNips() {
		const breasts = this.body.breasts;
		let c = breasts[0];
		let cSize = breasts[0].NipSize();
		for (let i = 1, j = breasts.length; i < j; i++) {
			const newSize = breasts[i].NipSize();
			if (newSize < cSize) {
				cSize = newSize;
				c = breasts[i];
			}
		}
		return c;
	}
	public NipplesThatFitLen(capacity: number) {
		const ret = new Array();
		for (let i = 0, j = this.body.breasts.length; i < j; i++) {
			const row = this.body.breasts[i];
			if (row.nippleType == NippleType.lipple ||
				row.nippleType == NippleType.cunt) {
				if (row.NipSize() >= capacity) {
					ret.push(row);
				}
			}
		}
		return ret;
	}

	public AllOrfices(capacity?: number) {
		capacity = capacity || 0;
		const ret = new Array();

		const vags = this.VagsThatFit(capacity);
		for (let i = 0, j = vags.length; i < j; i++) {
			ret.push({type: BodyPartType.vagina, obj: vags[i]});
		}
		const nips = this.NipplesThatFitLen(capacity);
		for (let i = 0, j = nips.length; i < j; i++) {
			ret.push({type: BodyPartType.nipple, obj: nips[i]});
		}
		if (this.body.ass.capacity.Get() >= capacity) {
			ret.push({type: BodyPartType.ass, obj: this.body.ass});
		}
		if (this.body.head.mouth.capacity.Get() >= capacity) {
			ret.push({type: BodyPartType.mouth, obj: this.body.head.mouth});
		}

		return ret;
	}

	public AllPenetrators(orifice: Orifice) {
		const ret = new Array();

		const cocks = this.CocksThatFit(orifice);
		for (let i = 0, j = cocks.length; i < j; i++) {
			ret.push({type: BodyPartType.cock, obj: cocks[i]});
		}
		// TODO: Tongue, Nipple-cock, Clitcock

		return ret;
	}

	public Fuck(cock: Cock, expMult?: number) {
		expMult = expMult || 1;
		this.AddSexExp(expMult);
		// TODO: Stretch
	}

	// Fuck entitys mouth (vag, cock)
	public FuckOral(mouth: any, cock: Cock, expMult?: number) {
		expMult = expMult || 1;
		this.AddSexExp(expMult);
		// TODO: Stretch
	}

	// Fuck entitys anus (anus, cock)
	public FuckAnal(butt: Butt, cock?: Cock, expMult?: number) {
		const parse: any = {
			name   : this.NameDesc(),
			has    : this.has(),
			hisher : this.hisher(),
		};
		expMult = expMult || 1;
		if (butt.virgin) {
			butt.virgin = false;
			Text.Add("<b>[name] [has] lost [hisher] anal virginity.</b>", parse);
			Text.NL();
			this.AddSexExp(5 * expMult);
		} else {
			this.AddSexExp(expMult);
		}

		if (cock) {
			butt.StretchOrifice(this, cock, false);
		}
		Text.Flush();
	}

	// Fuck entitys vagina (vag, cock)
	public FuckVag(vag: Vagina, cock?: Cock, expMult?: number) {
		const parse: any = {
			name   : this.NameDesc(),
			has    : this.has(),
			hisher : this.hisher(),
		};
		expMult = expMult || 1;
		if (vag.virgin) {
			vag.virgin = false;
			Text.Add("<b>[name] [has] lost [hisher] virginity.</b>", parse);
			Text.NL();
			this.AddSexExp(5 * expMult);
		} else {
			this.AddSexExp(expMult);
		}

		if (cock) {
			vag.StretchOrifice(this, cock, false);
		}
		Text.Flush();
	}

	public Sexed() {
		if (this.flags.Sexed && this.flags.Sexed != 0) {
			return true;
		}
		for (const flag in this.sex) {
			if (this.sex[flag] != 0) {
				return true;
		}
			}
		return false;
	}

	public RestoreCum(quantity?: number) {
		quantity = quantity || 1;
		const balls = this.Balls();
		return balls.cum.IncreaseStat(balls.CumCap(), quantity);
	}
	// TODO
	public Cum() {
		return this.Balls().cum.Get();
	}
	public CumOutput(mult?: number) {
		mult = mult || 1;
		const balls = this.Balls();
		let cum = mult * balls.CumCap() / 4;
		cum *= this.LustLevel() + 0.5;

		cum = Math.min(cum, this.Cum());
		return cum;
	}
	// TODO test
	public OrgasmCum(mult?: number) {
		mult = mult || 1;
		const balls = this.Balls();
		const cumQ  = this.CumOutput(mult);

		this.AddLustFraction(-1);

		balls.cum.DecreaseStat(0, cumQ);
		if (GetDEBUG()) {
			Text.NL();
			Text.Add("<b>[name] came ([cum]).</b>", {name: this.NameDesc(), cum: cumQ.toFixed(2)});
			Text.NL();
			Text.Flush();
		}
		return cumQ;
	}
	public Lactation() {
		return this.lactHandler.Lactation();
	}
	public Milk() {
		return this.lactHandler.milk.Get();
	}
	public MilkCap() {
		return this.lactHandler.MilkCap();
	}
	public LactationProgress(oldMilk: number, newMilk: number, lactationRate: number) {
		// Placeholder, implement in each entity if applicable
	}
}
