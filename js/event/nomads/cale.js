/*
 * 
 * Define Cale
 * 
 */
import { Entity } from '../../entity';
import { Shop } from '../../shop';

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
	
	this.flags["Met"]      = Cale.Met.NotMet;
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
	this.shopItems.push(Items.HorseHair);
	this.shopItems.push(Items.HorseShoe);
	this.shopItems.push(Items.HorseCum);
	this.shopItems.push(Items.RabbitFoot);
	this.shopItems.push(Items.CarrotJuice);
	this.shopItems.push(Items.Lettuce);
	this.shopItems.push(Items.Whiskers);
	this.shopItems.push(Items.HairBall);
	this.shopItems.push(Items.CatClaw);
	this.shopItems.push(Items.SnakeOil);
	this.shopItems.push(Items.LizardScale);
	this.shopItems.push(Items.LizardEgg);
	this.shopItems.push(Items.GoatMilk);
	this.shopItems.push(Items.SheepMilk);
	this.shopItems.push(Items.Ramshorn);
	this.shopItems.push(Items.CowMilk);
	this.shopItems.push(Items.CowBell);
	this.shopItems.push(Items.FreshGrass);
	this.shopItems.push(Items.CanisRoot);
	this.shopItems.push(Items.DogBone);
	this.shopItems.push(Items.DogBiscuit);
	this.shopItems.push(Items.WolfFang);
	this.shopItems.push(Items.Wolfsbane);
	this.shopItems.push(Items.FoxBerries);
	this.shopItems.push(Items.Foxglove);
	this.shopItems.push(Items.BlackGem);
	this.shopItems.push(Items.Hummus);
	this.shopItems.push(Items.SpringWater);
	this.shopItems.push(Items.Feather);
	this.shopItems.push(Items.Trinket);
	this.shopItems.push(Items.FruitSeed);
	this.shopItems.push(Items.MFluff);
	this.shopItems.push(Items.MDust);
	this.shopItems.push(Items.Stinger);
	this.shopItems.push(Items.SVenom);
	this.shopItems.push(Items.SClaw);
	this.shopItems.push(Items.TreeBark);
	this.shopItems.push(Items.AntlerChip);
	this.shopItems.push(Items.GoatFleece);
	this.shopItems.push(Items.FlowerPetal);
	this.shopItems.push(Items.RawHoney);
	this.shopItems.push(Items.BeeChitin);
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

Cale.Met = {
	NotMet : 0,
	First  : 1,
	YouTookRosalin  : 1,
	CaleTookRosalin : 2,
	SharedGotFucked : 3,
	SharedFuckedHim : 4,
	SharedOnlyRosie : 5
};
Cale.Met2 = {
	NotMet     : 0,
	Talked     : 1,
	TalkedSlut : 2,
	Goop       : 3
}
Cale.Rogue = {
	Locked : 0,
	First  : 1,
	Ret    : 2,
	Taught : 3
}

Cale.prototype.Met = function() {
	return this.flags["Met2"] >= Cale.Met2.Talked;
}

Cale.prototype.Buttslut = function() {
	return this.flags["Met2"] >= Cale.Met2.Goop;
}

Cale.prototype.FromStorage = function(storage) {
	this.Butt().virgin       = parseInt(storage.virgin) == 1;
	
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
	this.LoadSexFlags(storage);
	
	if(this.flags["Met2"] != Cale.Met2.NotMet)
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
	location = location || party.location;
	if(location == world.loc.Plains.Nomads.Fireplace)
		return cale.flags["Met"] != 0 && (world.time.hour >= 15 || world.time.hour < 3);
	return false;
}


export { Cale };
