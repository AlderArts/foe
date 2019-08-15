/*
 * 
 * Intro demon
 * 
 */

import { BossEntity } from './boss';
import { Images } from '../assets';
import { Body } from '../body/body';
import { Race } from '../body/race';
import { Color } from '../body/color';
import { Text } from '../text';
import { Gui } from '../gui';
import { Rand } from '../utility';
import { Imp } from './imp';
import { GAME } from '../GAME';

export class IntroDemon extends BossEntity {
	turnCounter : number;

	constructor() {
		super();
		
		this.avatar.combat     = Images.introdemon;
		
		this.name              = "Demon";
		this.monsterName       = "the demon";
		this.MonsterName       = "The demon";
		this.maxHp.base        = 1000;
		this.maxSp.base        = 1000;
		this.maxLust.base      = 400;
		// Main stats
		this.strength.base     = 100;
		this.stamina.base      = 150;
		this.dexterity.base    = -40;
		this.intelligence.base = 5;
		this.spirit.base       = 80;
		this.libido.base       = 50;
		this.charisma.base     = 50;
		
		this.level             = 35;
		this.sexlevel          = 25;
		
		this.combatExp         = 0;
		this.coinDrop          = 0;
		
		this.body              = new Body(this);
		
		this.body.DefMale();
		
		this.body.SetRace(Race.Demon);
		
		this.body.SetBodyColor(Color.red);
		
		this.body.SetEyeColor(Color.yellow);
		
		this.turnCounter = 0;

		// Set hp and mana to full
		this.SetLevelBonus();
		this.RestFull();
	}
	
	Act(encounter : any, activeChar : any) {
		// TODO: More actions (rand 'em)
		
		this.turnCounter++;
		
		let enemies = encounter.GetLiveEnemyArray();

		// Kill off an imp now and then (cannot end the fight)
		if(this.turnCounter % 6 == 0 && enemies.length > 2) {
			Text.Add("<b>AM I MAKING IT TOO HARD FOR YOU, PET?</b> the demon quips. In a swift motion, he grabs one of the imps by one leg, throwing the screaming creature into his waiting maw, crushing it in a shower of blood.");
			enemies[enemies.length - 1].curHp = 0;
		}
		else {
			let r = Rand(7);
			if(r == 0) { // Boost imp
				Text.Add("As you fight, the demon has been idly scratching the ground, forming an intricate design with its clawed finger. With a menacing grin, the demon flicks his finger in the direction of one of the imps. The tiny creature screams as a surge of magic energy originating from the mark hits it. A strange light enters his eyes, it seems he has powered up. In more ways than one, you realize, as you notice his swelling member, growing to an obscene size for his body.");
				// Pick a random imp
				let t = enemies[Rand(enemies.length - 1) + 1];
				t.maxHp.bonus = 20;
				t.maxSp.bonus = 20;
				t.strength.bonus = 4;
				t.libido.bonus = 20;
				t.RestFull();
				t.curLust += 10;
				t.FirstCock().thickness.bonus = 2;
				t.FirstCock().length.bonus = 10;
				t.name = "Buffed imp";
			}
			else if(r == 1) { // Banter
				Text.Add("<b>FIGHTING ME WILL DO YOU NO GOOD YOU KNOW,</b> the demon laughs.");
			}
			else if(r == 2 && encounter.enemy.members.length < 4) { // Summon imp (if less than four imps)
				Text.Add("<b>...I GROW BORED,</b> the demon snaps his fingers and another imp materializes in a puff of smoke, running up to join the others.");
				let newImp = new Imp();
				encounter.enemy.AddMember(newImp);
				
				let ent : any = {
					entity     : newImp,
					isEnemy    : true,
					initiative : 0,
					aggro      : []};
				encounter.GenerateUniqueName(newImp);
				
				encounter.combatOrder.push(ent);
				ent.entity.GetSingleTarget(encounter, ent);
			}
			else if(r == 3 || r == 4) { // Lust attack
				Text.Add("As you fight, the demon has been idly scratching the ground, forming an intricate design with its clawed finger. With a menacing grin, the demon flicks his finger in your direction, causing a stream of red magical energy to surge forward from the mark, hitting you squarely in the chest. You grunt as your body is filled with raging heat, greatly arousing you.");
				GAME().player.AddLustAbs(20);
			}
			else { // Banter
				Text.Add("The demon chuckles evilly, amused by your resistance.");
			}
		}
		
		Text.Flush();
		Gui.NextPrompt(function() {
			encounter.CombatTick();
		});
	}

}
