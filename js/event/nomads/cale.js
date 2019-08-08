/*
 * 
 * Define Cale
 * 
 */
import { Entity } from '../../entity';
import { Shop } from '../../shop';
import { IngredientItems } from '../../items/ingredients';
import { Race } from '../../body/race';
import { Color } from '../../body/color';
import { AppendageType } from '../../body/appendage';
import { TF } from '../../tf';
import { WorldTime, GAME } from '../../GAME';
import { CaleFlags } from './cale-flags';

function Cale(storage) {
	Entity.call(this);
	this.ID = "cale";
	
	// Character stats
	this.name = "Wolfie";
	
	this.shop = new Shop();
	
	this.body.DefMale();
	this.body.SetRace(Race.Wolf);
	this.SetSkinColor(Color.gray);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.Wolf, Color.gray);
	this.FirstCock().length.base = 20;
	this.FirstCock().thickness.base = 4;
	
	this.flags["Met"]      = CaleFlags.Met.NotMet;
	this.flags["Met2"]     = 0;
	this.flags["Sexed"]    = 0;
	this.flags["Rogue"]    = 0;
	this.flags["sneakAtk"] = 0;
	this.flags["trickBJ"]  = 0;
	
	this.flags["xOut"]     = 0;
	this.flags["xedOut"]   = 0;
	this.flags["cLoss"]    = 0; // cavalcade loss
	this.flags["cCheat"]   = 0; // cavalcade cheat
	this.flags["eBlow"]    = 0;
	
	this.flags["rotPast"]  = 0;
	this.flags["maxPast"]  = 0;
	this.flags["rosPast"]  = 0;
	
	// Shop
	this.flags["shop"]     = 0;
	this.shopItems = [];
	this.shopItems.push(IngredientItems.HorseHair);
	this.shopItems.push(IngredientItems.HorseShoe);
	this.shopItems.push(IngredientItems.HorseCum);
	this.shopItems.push(IngredientItems.RabbitFoot);
	this.shopItems.push(IngredientItems.CarrotJuice);
	this.shopItems.push(IngredientItems.Lettuce);
	this.shopItems.push(IngredientItems.Whiskers);
	this.shopItems.push(IngredientItems.HairBall);
	this.shopItems.push(IngredientItems.CatClaw);
	this.shopItems.push(IngredientItems.SnakeOil);
	this.shopItems.push(IngredientItems.LizardScale);
	this.shopItems.push(IngredientItems.LizardEgg);
	this.shopItems.push(IngredientItems.GoatMilk);
	this.shopItems.push(IngredientItems.SheepMilk);
	this.shopItems.push(IngredientItems.Ramshorn);
	this.shopItems.push(IngredientItems.CowMilk);
	this.shopItems.push(IngredientItems.CowBell);
	this.shopItems.push(IngredientItems.FreshGrass);
	this.shopItems.push(IngredientItems.CanisRoot);
	this.shopItems.push(IngredientItems.DogBone);
	this.shopItems.push(IngredientItems.DogBiscuit);
	this.shopItems.push(IngredientItems.WolfFang);
	this.shopItems.push(IngredientItems.Wolfsbane);
	this.shopItems.push(IngredientItems.FoxBerries);
	this.shopItems.push(IngredientItems.Foxglove);
	this.shopItems.push(IngredientItems.BlackGem);
	this.shopItems.push(IngredientItems.Hummus);
	this.shopItems.push(IngredientItems.SpringWater);
	this.shopItems.push(IngredientItems.Feather);
	this.shopItems.push(IngredientItems.Trinket);
	this.shopItems.push(IngredientItems.FruitSeed);
	this.shopItems.push(IngredientItems.MFluff);
	this.shopItems.push(IngredientItems.MDust);
	this.shopItems.push(IngredientItems.Stinger);
	this.shopItems.push(IngredientItems.SVenom);
	this.shopItems.push(IngredientItems.SClaw);
	this.shopItems.push(IngredientItems.TreeBark);
	this.shopItems.push(IngredientItems.AntlerChip);
	this.shopItems.push(IngredientItems.GoatFleece);
	this.shopItems.push(IngredientItems.FlowerPetal);
	this.shopItems.push(IngredientItems.RawHoney);
	this.shopItems.push(IngredientItems.BeeChitin);
	//TODO: More item ingredientss
	
	this.SetLevelBonus();
	this.RestFull();
	
	if(storage) this.FromStorage(storage);
	
	if(this.Slut() >= 60) {
		this.Butt().capacity.base = 15;
	}
	else {
		this.Butt().capacity.base = 5;
	}
}
Cale.prototype = new Entity();
Cale.prototype.constructor = Cale;

Cale.prototype.Met = function() {
	return this.flags["Met2"] >= CaleFlags.Met2.Talked;
}

Cale.prototype.Buttslut = function() {
	return this.flags["Met2"] >= CaleFlags.Met2.Goop;
}

Cale.prototype.FromStorage = function(storage) {
	this.Butt().virgin       = parseInt(storage.virgin) == 1;
	
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
	
	if(this.flags["Met2"] != CaleFlags.Met2.NotMet)
		this.name = "Cale";
}

Cale.prototype.ToStorage = function() {
	var storage = {
		virgin : this.Butt().virgin ? 1 : 0
	};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	this.SaveSexFlags(storage);
	
	return storage;
}

// Schedule
Cale.prototype.IsAtLocation = function(location) {
	location = location || GAME().party.location;
	if(location == world.loc.Plains.Nomads.Fireplace)
		return cale.flags["Met"] != 0 && (WorldTime().hour >= 15 || WorldTime().hour < 3);
	return false;
}


export { Cale };
