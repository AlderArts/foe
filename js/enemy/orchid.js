/*
 * 
 * Dryad boss
 * 
 */

import { BossEntity } from './boss';
import { Images } from '../assets';
import { Element } from '../damagetype';
import { Body } from '../body/body';
import { Race } from '../body/race';
import { CockType } from '../body/cock';
import { Color } from '../body/color';
import { WeaponsItems } from '../items/weapons';
import { ArmorItems } from '../items/armor';
import { IngredientItems } from '../items/ingredients';
import { Text } from '../text';
import { EncounterTable } from '../encountertable';
import { Abilities } from '../abilities';

function OrchidBoss(storage) {
	BossEntity.call(this);
	this.ID = "orchid";
	
	this.avatar.combat     = Images.corr_orchid;
	
	this.name              = "Orchid";
	this.monsterName       = "the corrupted dryad";
	this.MonsterName       = "The corrupted dryad";
	
	// TODO Stats
	
	this.maxHp.base        = 1500;
	this.maxSp.base        = 500;
	this.maxLust.base      = 500;
	// Main stats
	this.strength.base     = 20;
	this.stamina.base      = 50;
	this.dexterity.base    = 35;
	this.intelligence.base = 30;
	this.spirit.base       = 40;
	this.libido.base       = 80;
	this.charisma.base     = 50;
	
	this.level             = 12;
	this.sexlevel          = 6;
	
	this.combatExp         = 300;
	this.coinDrop          = 1000;
	
	this.elementDef.dmg[Element.mFire]   =  -1;
	this.elementDef.dmg[Element.mNature] = 0.5;
	
	this.body              = new Body(this);
	
	this.body.DefHerm();
	
	this.body.SetRace(Race.Dryad);
	this.body.SetBodyColor(Color.green);
	this.body.SetHairColor(Color.green);	
	this.body.SetEyeColor(Color.black);
	this.FirstCock().race = Race.Plant;
	this.FirstCock().type = CockType.tentacle;
	this.FirstCock().length.base = 400;
	this.FirstCock().thickness.base = 10;
	
	// Set hp and mana to full
	this.SetLevelBonus();
	this.RestFull();
	
	this.flags["Talk"] = 0; //Bitmask

	if(storage) this.FromStorage(storage);
}
OrchidBoss.prototype = new BossEntity();
OrchidBoss.prototype.constructor = OrchidBoss;

//TODO
OrchidBoss.prototype.DropTable = function() {
	var drops = [];
	drops.push({ it: WeaponsItems.VineWhip });
	drops.push({ it: ArmorItems.VinePanties });
	drops.push({ it: ArmorItems.VineBra });
	drops.push({ it: AlchemyItems.Estros });
	
	if(Math.random() < 0.3) drops.push({ it: IngredientItems.Foxglove });
	if(Math.random() < 0.3) drops.push({ it: IngredientItems.Wolfsbane });
	if(Math.random() < 0.5) drops.push({ it: IngredientItems.FlowerPetal });
	if(Math.random() < 0.2) drops.push({ it: IngredientItems.TreeBark });
	if(Math.random() < 0.2) drops.push({ it: IngredientItems.SpringWater });
	if(Math.random() < 0.2) drops.push({ it: AlchemyItems.Gestarium });
	
	return drops;
}

OrchidBoss.prototype.FromStorage = function(storage) {
	// Personality stats
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

OrchidBoss.prototype.ToStorage = function() {
	var storage = {};
	this.SavePersonalityStats(storage);
	this.SaveFlags(storage);
	
	return storage;
}

OrchidBoss.prototype.Act = function(encounter, activeChar) {
	Text.Add("Orchid squirms and sways her hips.");
	Text.NL();
	var scenes = new EncounterTable();
	scenes.AddEnc(function() {
		Text.Add("<i>“Wouldn’t it be easier to just give in?”</i>");
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“You know you’ll lose in the end… why even fight it?”</i>");
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“I can’t wait to use these tentacles on you...”</i>");
	}, 1.0, function() { return true; });
	scenes.AddEnc(function() {
		Text.Add("<i>“I’ve got so much cum packed up, just for you!”</i>");
	}, 1.0, function() { return true; });
	
	scenes.Get();
	Text.NL();
	
	Text.Flush();
	
	// Pick a random target
	var t = this.GetSingleTarget(encounter, activeChar);
	var highlust = null;
	for(var i = 0; i < party.Num(); i++) {
		var c = party.Get(i);
		if(c.Incapacitated()) continue;
		
		if(c.LustLevel() >= 0.9) {
			highlust = c;
			break;
		}
	}
	
	var choice = Math.random();
	
	if(highlust) { // Violate
		Abilities.EnemySkill.TViolate.Use(encounter, this, highlust);
	}
	else if(choice < 0.1 && Abilities.EnemySkill.TSnare.enabledCondition(encounter, this))
		Abilities.EnemySkill.TSnare.Use(encounter, this, t);
	else if(choice < 0.2 && Abilities.EnemySkill.TSpray.enabledCondition(encounter, this))
		Abilities.EnemySkill.TSpray.Use(encounter, this, party);
	else if(choice < 0.3 && Abilities.EnemySkill.TVenom.enabledCondition(encounter, this))
		Abilities.EnemySkill.TVenom.Use(encounter, this, t);
	else if(choice < 0.4 && Abilities.EnemySkill.TRavage.enabledCondition(encounter, this))
		Abilities.EnemySkill.TRavage.Use(encounter, this, t);
	else if(choice < 0.6) { // Tease
		var parse = {
			
		};
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.Add("Orchid dances back lithely, quickly escaping your reach. Her tentacles writhe and thresh about, dragging the helpless centauress close to the corrupted dryad.", parse);
			Text.NL();
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Seemingly without effort, Orchid hoists the larger deertaur into the air, roughly impaling her every hole with multiple tentacles. The four-footed forest creature moans around the plant-cocks shoved down her throat, her eyes rolling into the back of her head as the tentacles pump her full of corrupted cum, bloating her stomach.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("A large mass of plant-cocks coil together, forming a formidable tower, as thick as the corrupted dryad’s waist. Flashing you an evil grin, Orchid slams the centaur down on top of it, impaling her on at least three feet of the horse-sized plant-dildo.", parse);
				Text.NL();
				Text.Add("The doe is unable to do anything but moan as the mass of tentacles strains against her already considerable limits, struggling pitifully as she orgasms.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Stringing the doe up with her limbs spread wide, Orchid lets out a throaty moan as she unloads a massive amount of semen on the centaur, painting her white with a one-man tentacle cum shower.", parse);
			}, 1.0, function() { return true; });
			scenes.Get();
			
			Text.NL();
			Text.Add("<i>“You are next!”</i> Orchid taunts, carelessly discarding the spent doe in a sticky heap.", parse);
			Text.NL();
			
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.Add("Orchid smiles wickedly at you as she makes a large bound, jumping up beside her mother in the roots of the huge tree. <i>“See how they struggle, mommy. Can’t you help me convince them how good it will feel when I fuck them?”</i> she asks sweetly, rubbing the older dryad’s skin with her tentacles.", parse);
			Text.NL();
			encounter.stage = encounter.stage || 0;
			if(encounter.stage == 0) {
				Text.Add("<i>“D-daughter, you know not what you do!”</i> Mother Tree gasps feebly.", parse);
				Text.NL();
				Text.Add("<i>“Oh, I know exactly what I’m doing!”</i> the dryad replies merrily.", parse);
			}
			else if(encounter.stage == 1)
				Text.Add("<i>“O-Orchid… what has… happened to you?”</i> Mother Tree moans, trying to fight the tentacles still thrusting inside her.", parse);
			else
				Text.Add("<i>“Y-yes! Fuck me!”</i> Mother tree moans, completely lost in pleasure.", parse);
			Text.NL();
			Text.Add("Orchid laughs maniacally as she lets her plant-cocks violate the brown-skinned milf, stretching her well beyond her limits. The voluptuous dryad cries out as she orgasms, sap spraying everywhere from her overstuffed cunny and almond nipples.", parse);
			Text.NL();
			Text.Add("<i>“Give in, and your pleasure shall be this a hundredfold!”</i> the dryad moans sultrily.", parse);
			Text.NL();
			encounter.stage++;
		}, 1.0, function() { return true; });
		
		scenes.Get();
		
		for(var i = 0; i < party.Num(); i++) {
			var c = party.Get(i);
			if(c.Incapacitated()) continue;
			c.AddLustFraction(0.2);
		}
		Text.Flush();
	}
	else
		Abilities.EnemySkill.TWhip.Use(encounter, this, t);
}

export { OrchidBoss };
