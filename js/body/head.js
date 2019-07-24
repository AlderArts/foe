
import { Hair } from './hair';
import { BodyPart } from './bodypart';
import { Stat } from '../stat';
import { RaceDesc } from './race';
import { Appendage } from './appendage';

function Head() {
	BodyPart.call(this);
	
	this.mouth = {
		capacity     : new Stat(30),
		tongue       : new BodyPart()
	}
	this.hair = new Hair();
	this.eyes = new BodyPart();
	this.eyes.count = new Stat(2);
	this.ears = new BodyPart();
	// Appendages (antenna etc)
	this.appendages = [];
}
Head.prototype = new BodyPart();
Head.prototype.constructor = Head;


Head.prototype.ToStorage = function() {
	var storage = {
		race : this.race.id.toFixed(),
		col  : this.color.toFixed()
	};
	storage.mouth = {
		cap  : this.mouth.capacity.base.toFixed(2),
		ton  : {race : this.mouth.tongue.race.id.toFixed(), col : this.mouth.tongue.color.toFixed()}
	};
	storage.hair = this.hair.ToStorage();
	storage.eyes = {
		race  : this.eyes.race.id.toFixed(),
		col   : this.eyes.color.toFixed(),
		count : this.eyes.count.base.toFixed()
	};
	storage.ears = {
		race : this.ears.race.id.toFixed(),
		col  : this.ears.color.toFixed()
	};
	if(this.appendages.length > 0) {
		storage.app = new Array();
		for(var i = 0; i < this.appendages.length; i++) {
			storage.app.push(this.appendages[i].ToStorage());
		}
	}
	
	return storage;
}

Head.prototype.FromStorage = function(storage) {
	storage = storage || {};
	
	this.race   = (storage.race === undefined) ? this.race : RaceDesc.IdToRace[parseInt(storage.race)];
	this.color  = (storage.col === undefined) ? this.color : parseInt(storage.col);
	
	if(storage.mouth) {
		this.mouth.tongue.race       = (storage.mouth.ton.race === undefined) ? this.mouth.tongue.race : RaceDesc.IdToRace[parseInt(storage.mouth.ton.race)];
		this.mouth.tongue.color      = (storage.mouth.ton.col === undefined) ? this.mouth.tongue.color : parseInt(storage.mouth.ton.col);
		this.mouth.capacity.base     = (storage.mouth.cap === undefined) ? this.mouth.capacity.base : parseFloat(storage.mouth.cap);
	}
	if(storage.hair) {
		this.hair.FromStorage(storage.hair);
	}
	if(storage.eyes) {
		this.eyes.race        = (storage.eyes.race === undefined) ? this.eyes.race : RaceDesc.IdToRace[parseInt(storage.eyes.race)];
		this.eyes.color       = (storage.eyes.col === undefined) ? this.eyes.color : parseInt(storage.eyes.col);
		this.eyes.count.base  = (storage.eyes.count === undefined) ? this.eyes.count.base : parseInt(storage.eyes.count);
	}
	if(storage.ears) {
		this.ears.race        = (storage.ears.race === undefined) ? this.ears.race : RaceDesc.IdToRace[parseInt(storage.ears.race)];
		this.ears.color       = (storage.ears.col === undefined) ? this.ears.color : parseInt(storage.ears.col);
	}
	
	if(storage.app) {
		this.appendages = new Array();
		for(var i = 0; i < storage.app.length; i++) {
			var newApp = new Appendage();
			newApp.FromStorage(storage.app[i]);
			this.appendages.push(newApp);
		}
	}
}

Head.prototype.SetRace = function(race) {
	this.race              = race;
	this.mouth.tongue.race = race;
	this.eyes.race         = race;
	this.ears.race         = race;
}

Head.prototype.NumAttributes = function(race) {
	var sum = 0;
	if(this.race == race)              sum++;
	if(this.mouth.tongue.race == race) sum++;
	if(this.eyes.race == race)         sum++;
	if(this.ears.race == race)         sum++;
	for(var i = 0; i < this.appendages.length; i++)
		if(this.appendages[i].race == race) sum++;
	return sum;
}

export { Head };
