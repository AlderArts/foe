/*
 * 
 * Define Lagon
 * 
 */

import { Entity } from '../../entity';
import { BossEntity } from '../../enemy/boss';
import { Gender } from '../../body/gender';
import { Race } from '../../body/race';
import { AppendageType } from '../../body/appendage';
import { Color } from '../../body/color';
import { TF } from '../../tf';
import { Images } from '../../assets';
import { EncounterTable } from '../../encountertable';
import { Abilities } from '../../abilities';
import { Lagomorph, LagomorphBrute, LagomorphWizard, LagomorphElite, LagomorphAlpha } from '../../enemy/rabbit';
import { AccItems } from '../../items/accessories';
import { QuestItems } from '../../items/quest';
import { Text } from '../../text';
import { Gui } from '../../gui';
import { WORLD, GAME } from '../../GAME';
import { AlchemyItems } from '../../items/alchemy';
import { Party } from '../../party';

export class Lagon extends Entity {
	constructor(storage? : any) {
		super();

		this.ID = "lagon";
		
		this.name = "Lagon";
		
		this.sexlevel          = 8;
		this.SetExpToLevel();
		
		this.body.DefMale();
		
		this.FirstCock().thickness.base = 7;
		this.FirstCock().length.base = 34;
		this.Balls().size.base = 6;
		
		this.Butt().buttSize.base = 2;
		
		this.body.SetRace(Race.Rabbit);
		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Rabbit, Color.white);
		this.body.SetBodyColor(Color.white);
		this.body.SetEyeColor(Color.blue);
		
		this.flags["Usurp"] = 0; // bitmask
		this.flags["JSex"]  = 0; // bitmask
		this.flags["Talk"]  = 0; // bitmask
		
		if(storage) this.FromStorage(storage);
	}
	
	FromStorage(storage : any) {
		this.LoadPersonalityStats(storage);
		this.body.FromStorage(storage.body);
		
		// Load flags
		this.LoadFlags(storage);
		this.LoadSexFlags(storage);
	}

	ToStorage() {
		var storage = {};
		
		this.SavePersonalityStats(storage);
		this.SaveBodyPartial(storage, {ass: true});
		
		this.SaveFlags(storage);
		this.SaveSexFlags(storage);
		
		return storage;
	}

	Update(step : number) {
		super.Update(step);
	}

	// Schedule TODO
	IsAtLocation(location : any) {
		let party : Party = GAME().party;
		let burrows = GAME().burrows;
		let world = WORLD();
		//if(burrows.LagonChained()) //Slave
		location = location || party.location;
		if(burrows.LagonChained()) {
			if(burrows.LagonJudged()) return (location == world.loc.Burrows.Throne);
			else return false;
		}
		else
		//if(WorldTime().hour >= 9 && WorldTime().hour < 20)
			return (location == world.loc.Burrows.Throne);
		/*else
			return (location == world.loc.Burrows.Pit);*/
	}

	JailSexed() {
		return this.flags["JSex"] != 0;
	}

}

//For first fights
export class LagonRegular extends BossEntity {
	tougher : boolean;

	constructor(tougher : boolean) {
		super();
		
		this.tougher           = tougher; //use for AI + stats
		
		this.name              = "Lagon";
		
		this.avatar.combat     = Images.lagon_r;
		//TODO tougher
		this.maxHp.base        = tougher ? 2000 : 1600;
		this.maxSp.base        = tougher ?  500 :  300;
		this.maxLust.base      = tougher ?  500 :  300;
		// Main stats
		this.strength.base     = tougher ? 100 :  80;
		this.stamina.base      = tougher ? 120 : 100;
		this.dexterity.base    = tougher ? 150 : 120;
		this.intelligence.base = tougher ?  90 :  80;
		this.spirit.base       = tougher ? 100 :  80;
		this.libido.base       = tougher ? 100 :  80;
		this.charisma.base     = tougher ?  80 :  70;
		
		this.level             = tougher ?  22 :  16;
		this.sexlevel          = 8;
		
		this.combatExp         = tougher ? 200 : 150;
		this.coinDrop          = tougher ? 500 : 300;
		
		this.body.DefMale();
		
		this.FirstCock().thickness.base = 7;
		this.FirstCock().length.base = 38;
		this.Balls().size.base = 6;
		
		this.Butt().buttSize.base = 2;
		
		this.body.SetRace(Race.Rabbit);
		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Rabbit, Color.white);
		this.body.SetBodyColor(Color.white);
		this.body.SetEyeColor(Color.blue);

		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}

	DropTable() {
		var drops = [];
		drops.push({ it: AlchemyItems.Leporine });
		if(this.tougher)
			drops.push({ it: AlchemyItems.Leporine });
		return drops;
	}

	PhysDmgHP(encounter : any, caster : Entity, val : number) {
		var parse : any = {
			poss : caster.possessive()
		};
		
		if(Math.random() < 0.1) {
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Before [poss] blow connects, a wall of bunnies interpose themselves, absorbing the damage for their king!", parse);
				Text.NL();
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Numerous bunnies throw themselves in the way of [poss] incoming attack, shielding their king!", parse);
				Text.NL();
			}, 1.0, function() { return true; });
			
			scenes.Get();
			Text.Flush();
			
			return false;
		}
		else
			return super.PhysDmgHP(encounter, caster, val);
	}

	//TODO
	Act(enc : any, activeChar : any) {
		let player = GAME().player;
		// Pick a random target
		var t = this.GetSingleTarget(enc, activeChar);

		var parse : any = {
			name   : this.name,
			hisher : this.hisher(),
			tName  : t.name,
			phisher : player.mfFem("his", "her")
		};

		var tougher = this.tougher;
		var enemy  = enc.enemy;
		var fallen = [];
		for(var i = 1; i < enemy.members.length; i++) {
			if(enemy.members[i].Incapacitated())
				fallen.push(enemy.members[i]);
		}
		if(fallen.length > 0 && Math.random() < 0.5) {
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("<i>“Come to me, my children!”</i> Lagon shouts, rallying additional troops to his side.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“The one to bring the rebel down gets to be second in line after I bang [phisher] brains out!”</i> With that, more bunnies rally to Lagon’s side.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("<i>“Rally to your king, my children!”</i> Lagon calls out, summoning more rabbits to his side.", parse);
			}, 1.0, function() { return true; });

			scenes.Get();
			Text.NL();
			Text.Flush();
			
			for(var i = 0; i < fallen.length; i++) {
				enemy.SwitchOut(fallen[i]);
				var entity;
				if(tougher) {
					var r = Math.random();
					if(r < 0.3)
						entity = new LagomorphBrute();
					else if(r < 0.6)
						entity = new LagomorphWizard();
					else
						entity = new LagomorphElite(Gender.Random());
				}
				else {
					if(Math.random() < 0.5)
						entity = new LagomorphAlpha(Gender.Random());
					else
						entity = new Lagomorph(Gender.Random());
				}
				enemy.AddMember(entity);
				
				var ent : any = {
					entity     : entity,
					isEnemy    : true,
					initiative : 0,
					aggro      : []};
				enc.GenerateUniqueName(entity);
				
				enc.combatOrder.push(ent);
				ent.entity.GetSingleTarget(enc, ent);
			}
		}

		var choice = Math.random();
		if(choice < 0.2 && Abilities.Physical.DirtyBlow.enabledCondition(enc, this))
			Abilities.Physical.DirtyBlow.Use(enc, this, t);
		else if(choice < 0.4 && Abilities.Physical.FocusStrike.enabledCondition(enc, this))
			Abilities.Physical.FocusStrike.Use(enc, this, t);
		else if(choice < 0.6 && Abilities.Physical.TAttack.enabledCondition(enc, this))
			Abilities.Physical.TAttack.Use(enc, this, t);
		else if(choice < 0.8 && Abilities.Physical.DAttack.enabledCondition(enc, this))
			Abilities.Physical.DAttack.Use(enc, this, t);
		else
			Abilities.Attack.Use(enc, this, t);
	}
}

//For final fight
export class LagonBrute extends BossEntity {
	turns : number;

	constructor(scepter : boolean) {
		super();
		
		this.turns = 0;
		
		this.name              = "Lagon";
		
		this.avatar.combat     = Images.lagon_b;
		//TODO scepter
		this.maxHp.base        = 4000;
		this.maxSp.base        = 700;
		this.maxLust.base      = scepter ?  300 :  500;
		// Main stats
		this.strength.base     = scepter ? 140 : 180;
		this.stamina.base      = scepter ? 130 : 150;
		this.dexterity.base    = scepter ?  80 : 100;
		this.intelligence.base = scepter ?  40 :  60;
		this.spirit.base       = scepter ?  60 :  80;
		this.libido.base       = scepter ?  80 : 100;
		this.charisma.base     = scepter ?  50 :  60;
		
		this.level             = scepter ? 22 : 24;
		this.sexlevel          = 8;
		
		this.combatExp         = scepter ? 400 :  500;
		this.coinDrop          = scepter ? 800 : 1000;
		
		this.body.DefMale();
		
		this.FirstCock().thickness.base = 11;
		this.FirstCock().length.base = 60;
		this.Balls().size.base = 10;
		
		this.Butt().buttSize.base = 2;
		
		this.body.SetRace(Race.Rabbit);
		TF.SetAppendage(this.Back(), AppendageType.tail, Race.Rabbit, Color.white);
		this.body.SetBodyColor(Color.white);
		this.body.SetEyeColor(Color.red);

		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}

	DropTable() {
		var drops = [];
		drops.push({ it: AlchemyItems.Leporine });
		drops.push({ it: AlchemyItems.Testos });
		drops.push({ it: AlchemyItems.Virilium });
		drops.push({ it: AccItems.LagonCrown });
		return drops;
	}

	//TODO
	Act(encounter : any, activeChar : any) {
		let party : Party = GAME().party;
		// Pick a random target
		var targets = this.GetPartyTarget(encounter, activeChar);
		var t = this.GetSingleTarget(encounter, activeChar);

		var parse : any = {
			
		};

		var first = this.turns == 0;
		this.turns++;
		var scepter = party.Inv().QueryNum(QuestItems.Scepter);
		
		if(scepter) {
			if(first) {
				Text.Add("Lagon is just about to jump on you when Ophelia gives out a triumphant yelp. The big brute growls, clutching at his head. Whatever she’s doing with the scepter, it seems to be doing something.", parse);
				Text.Flush();
				
				this.AddHPAbs(-1000);
				this.AddSPAbs(-300);
				
				Gui.NextPrompt(function() {
					encounter.CombatTick();
				});
				return;
			}
			else if(Math.random() < 0.1) {
				var scenes = new EncounterTable();
				scenes.AddEnc(function() {
					Text.Add("<i>“T-there, I have it!”</i> Ophelia yelps as she manages to fiddle the rod again, causing Lagon to shake his head in confusion.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("Just as he’s about to make his move, something distracts the king from his target. The beast throws his eyes around the hall, trying to figure out what’s going on.", parse);
				}, 1.0, function() { return true; });
				scenes.AddEnc(function() {
					Text.Add("Lagon clutches his head as the scepter works its magic, distracted from his foes for a moment.", parse);
				}, 1.0, function() { return true; });
				
				scenes.Get();
				Text.Flush();
				
				this.AddHPAbs(-100);
				this.AddSPAbs(-30);
				
				Gui.NextPrompt(function() {
					encounter.CombatTick();
				});
				return;
			}
		}
		
		var choice = Math.random();
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
