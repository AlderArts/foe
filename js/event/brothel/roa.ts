/*
 * 
 * Define Roa
 * 
 */

import { Entity } from '../../entity';
import { GetDEBUG } from '../../../app';
import { Images } from '../../assets';
import { Race } from '../../body/race';
import { Text } from '../../text';
import { Gui } from '../../gui';
import { RoaFlags } from './roa-flags';
import { NAV, GAME } from '../../GAME';

export class Roa extends Entity {
	constructor(storage? : any) {
		super();

		this.ID = "roa";
		
		// Character stats
		this.name = "Roa";
		
		this.avatar.combat = Images.roa;
		
		this.maxHp.base        = 30;
		this.maxSp.base        = 40;
		this.maxLust.base      = 20;
		// Main stats
		this.strength.base     = 10;
		this.stamina.base      = 11;
		this.dexterity.base    = 22;
		this.intelligence.base = 17;
		this.spirit.base       = 19;
		this.libido.base       = 18;
		this.charisma.base     = 16;
		
		this.level = 1;
		this.sexlevel = 1;
		
		this.body.DefMale();
		this.FirstBreastRow().size.base = 2;
		this.Butt().buttSize.base = 3;
		this.Butt().virgin = false;
		this.body.SetRace(Race.Rabbit);
		
		this.SetLevelBonus();
		this.RestFull();
		
		this.flags["Met"]   = RoaFlags.Met.NotMet;
		this.flags["Lagon"] = RoaFlags.Lagon.No;
		this.flags["sFuck"] = 0; //strapon fuck
		this.flags["snug"]  = 0; //snuggle

		if(storage) this.FromStorage(storage);
	}

	//TODO
	Cost() {
		return 100;
	}

	Met() {
		return this.flags["Met"] >= RoaFlags.Met.Met;
	}

	//TODO (Met flag?)
	Recruited() {
		return false;
	}

	FromStorage(storage : any) {
		this.LoadPersonalityStats(storage);
		
		// Load flags
		this.LoadFlags(storage);
		this.LoadSexFlags(storage);
	}

	ToStorage() {
		let storage : any = {};
		
		this.SavePersonalityStats(storage);
		
		this.SaveFlags(storage);
		this.SaveSexFlags(storage);
		
		return storage;
	}

	// Schedule //TODO
	IsAtLocation(location? : any) {
		return true;
	}

	// Party interaction //TODO
	Interact() {
		let roa = GAME().roa;
		Text.Clear();
		Text.Add("Rawr Imma bunny.");
		
		
		if(GetDEBUG()) {
			Text.NL();
			Text.Add("DEBUG: relation: " + roa.relation.Get(), null, 'bold');
			Text.NL();
			Text.Add("DEBUG: subDom: " + roa.subDom.Get(), null, 'bold');
			Text.NL();
			Text.Add("DEBUG: slut: " + roa.slut.Get(), null, 'bold');
			Text.NL();
		}
		
		Text.Flush();
		Gui.NextPrompt(NAV().PartyInteraction);
	}

}
