/*
 * 
 * Define Ophelia
 * 
 */

import { Entity } from '../../entity';
import { BossEntity } from '../../enemy/boss';
import { Race } from '../../body/race';
import { TF } from '../../tf';
import { AppendageType } from '../../body/appendage';
import { Color } from '../../body/color';
import { Time } from '../../time';
import { WorldTime, GAME, WORLD } from '../../GAME';
import { Images } from '../../assets';
import { AlchemySpecial } from '../../items/alchemyspecial';
import { AlchemyItems } from '../../items/alchemy';
import { Abilities } from '../../abilities';
import { OpheliaFlags } from './ophelia-flags';

export class Ophelia extends Entity {
	burrowsCountdown : Time;

	constructor(storage? : any) {
		super();

		this.ID = "ophelia";
		
		this.name              = "Ophelia";
		this.body.DefFemale();
		
		this.Butt().virgin = false;
		this.FirstVag().virgin = false;
		
		this.body.SetRace(Race.Rabbit);
		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Rabbit, Color.white);
		this.body.SetBodyColor(Color.white);
		this.body.SetEyeColor(Color.blue);
		
		this.flags["Met"]  = 0; // note, bitmask OpheliaFlags.Met
		this.flags["Talk"] = 0; // note, bitmask OpheliaFlags.Talk
		this.flags["rotRExp"] = 0;
		this.flags["rotRSex"] = 0;
		this.burrowsCountdown = new Time();
		
		if(storage) this.FromStorage(storage);
	}

	FromStorage(storage : any) {
		this.LoadPersonalityStats(storage);
		this.LoadFlags(storage);
		
		this.burrowsCountdown.FromStorage(storage.Btime);
	}

	ToStorage() {
		let storage : any = {};
		
		this.SavePersonalityStats(storage);
		this.SaveFlags(storage);
		
		storage.Btime = this.burrowsCountdown.ToStorage();
		
		return storage;
	}

	Update(step : number) {
		super.Update(step);
		this.burrowsCountdown.Dec(step);
	}

	Recruited() {
		return this.flags["Met"] & OpheliaFlags.Met.Recruited;
	}
	Broken() {
		return this.flags["Met"] & OpheliaFlags.Met.Broken;
	}
	//TODO account for Roa
	InParty() {
		return this.flags["Met"] & OpheliaFlags.Met.InParty;
	}
	InPartyAndBroken() {
		return this.Broken() && this.InParty();
	}
	CountdownExpired() {
		return this.burrowsCountdown.Expired();
	}

	IsAtLocation(location : any) {
		location = location || GAME().party.location;
		if(location == WORLD().loc.Burrows.Lab) {
			if(this.Recruited()) return false;
			if(this.Broken())    return false;
			return WorldTime().hour >= 8 && WorldTime().hour < 22;
		}
		return false;
	}

}

//For final fight
export class OpheliaBrute extends BossEntity {
	constructor() {
		super();
		
		this.name              = "Ophelia";
		
		this.avatar.combat     = Images.ophelia_b;
		
		this.maxHp.base        = 3000;
		this.maxSp.base        = 700;
		this.maxLust.base      = 300;
		// Main stats
		this.strength.base     = 100;
		this.stamina.base      = 100;
		this.dexterity.base    = 110;
		this.intelligence.base = 70;
		this.spirit.base       = 60;
		this.libido.base       = 70;
		this.charisma.base     = 70;
		
		this.level             = 15;
		this.sexlevel          = 4;
		
		this.combatExp         = 400;
		this.coinDrop          = 800;
		
		this.body.DefFemale();
		
		this.Butt().buttSize.base = 4;
		
		this.body.SetRace(Race.Rabbit);
		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Rabbit, Color.white);
		this.body.SetBodyColor(Color.white);
		this.body.SetEyeColor(Color.red);

		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}

	DropTable() {
		let drops = [];
		drops.push({ it: AlchemyItems.Leporine });
		drops.push({ it: AlchemySpecial.EquiniumPlus });
		drops.push({ it: AlchemyItems.Estros });
		drops.push({ it: AlchemyItems.GestariumPlus });
		return drops;
	}

	//TODO
	Act(encounter : any, activeChar : any) {
		// Pick a random target
		let targets = this.GetPartyTarget(encounter, activeChar);
		let t = this.GetSingleTarget(encounter, activeChar);

		let parseVars = {
			name   : this.name,
			hisher : this.hisher(),
			tName  : t.name
		};

		let choice = Math.random();
		if(choice < 0.2 && Abilities.Physical.Bash.enabledCondition(encounter, this))
			Abilities.Physical.Bash.Use(encounter, this, t);
		else if(choice < 0.4 && Abilities.Physical.Frenzy.enabledCondition(encounter, this))
			Abilities.Physical.Frenzy.Use(encounter, this, t);
		else if(choice < 0.6 && Abilities.Physical.CrushingStrike.enabledCondition(encounter, this))
			Abilities.Physical.CrushingStrike.Use(encounter, this, t);
		else if(choice < 0.8 && Abilities.Physical.GrandSlam.enabledCondition(encounter, this))
			Abilities.Physical.GrandSlam.Use(encounter, this, targets);
		else
			Abilities.Attack.Use(encounter, this, t);
	}

}
