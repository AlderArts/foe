/*
 * 
 * Default body definitions and convenience functions
 * 
 */

BodyTypeFemale = {
	Average  : 0,
	Slim     : 1,
	Curvy    : 2,
	Tomboy   : 3,
	Cuntboy  : 4
};

Body.prototype.DefFemale = function(bodytype) {
	bodytype = bodytype || BodyTypeFemale.Average;
	
	switch(bodytype)
	{
	case BodyTypeFemale.Slim:
		this.femininity.base = 0.4;
		this.weigth.base = 55;
		this.height.base = 170;
		this.muscleTone.base = -0.2;
		this.breasts[0].size.base = 6;
		this.ass.buttSize.base = 3;
		this.torso.hipSize.base = 1;
		break;
		
	case BodyTypeFemale.Curvy:
		this.femininity.base = 0.8;
		this.weigth.base = 68;
		this.height.base = 175;
		this.muscleTone.base = 0.1;
		this.breasts[0].size.base = 13;
		this.ass.buttSize.base = 8;
		this.torso.hipSize.base = 8;
		break;
		
	case BodyTypeFemale.Tomboy:
		this.femininity.base = 0;
		this.weigth.base = 55;
		this.height.base = 165;
		this.muscleTone.base = 0.1;
		this.breasts[0].size.base = 3;
		this.ass.buttSize.base = 3;
		this.torso.hipSize.base = 3;
		break;
		
	case BodyTypeFemale.Cuntboy:
		this.femininity.base = -0.3;
		this.weigth.base = 65;
		this.height.base = 170;
		this.muscleTone.base = 0.3;
		this.breasts[0].size.base = 2;
		this.ass.buttSize.base = 2;
		this.torso.hipSize.base = 2;
		break;
		
	case BodyTypeFemale.Average:
	default:
		this.femininity.base = 0.6;
		this.weigth.base = 60;
		this.height.base = 170;
		this.muscleTone.base = 0;
		this.breasts[0].size.base = 9;
		this.ass.buttSize.base = 5;
		this.torso.hipSize.base = 4;
		break;
	}
	
	this.vagina.push(new Vagina());
}

BodyTypeMale = {
	Average  : 0,
	Thin     : 1,
	Muscular : 2,
	Girly    : 3,
	FemmeBoy : 4,
	Shemale  : 5
};

Body.prototype.DefMale = function(bodytype) {
	bodytype = bodytype || BodyTypeMale.Average;
	
	switch(bodytype)
	{
	case BodyTypeMale.Thin:
		this.femininity.base = -0.4;
		this.weigth.base = 62;
		this.height.base = 180;
		this.muscleTone.base = 0.2;
		this.breasts[0].size.base = 1;
		this.ass.buttSize.base = 1;
		this.torso.hipSize.base = 1;
		break;
		
	case BodyTypeMale.Muscular:
		this.femininity.base = -0.8;
		this.weigth.base = 80;
		this.height.base = 188;
		this.muscleTone.base = 0.8;
		this.breasts[0].size.base = 1;
		this.ass.buttSize.base = 1;
		this.torso.hipSize.base = 2;
		break;
		
	case BodyTypeMale.Girly:
		this.femininity.base = 0;
		this.weigth.base = 60;
		this.height.base = 170;
		this.muscleTone.base = -0.3;
		this.breasts[0].size.base = 3;
		this.ass.buttSize.base = 3;
		this.torso.hipSize.base = 5;
		break;
		
	case BodyTypeMale.FemmeBoy:
		this.femininity.base = 0.3;
		this.weigth.base = 60;
		this.height.base = 170;
		this.muscleTone.base = -0.5;
		this.breasts[0].size.base = 4;
		this.ass.buttSize.base = 5;
		this.torso.hipSize.base = 7;
		break;
		
	case BodyTypeMale.Shemale:
		this.femininity.base = 0.5;
		this.weigth.base = 65;
		this.height.base = 175;
		this.muscleTone.base = -0.1;
		this.breasts[0].size.base = 12;
		this.ass.buttSize.base = 7;
		this.torso.hipSize.base = 9;
		break;
		
	case BodyTypeMale.Average:
	default:
		
		this.femininity.base = -0.6;
		this.weigth.base = 72;
		this.height.base = 181;
		this.muscleTone.base = 0.3;
		this.breasts[0].size.base = 1;
		this.ass.buttSize.base = 2;
		this.torso.hipSize.base = 2;
		break;
	}
	
	this.cock.push(new Cock());
	this.balls.count.base = 2;
}

Body.prototype.DefHerm = function(balls) {
	this.femininity.base = 0.3;
	this.vagina.push(new Vagina());
	this.cock.push(new Cock());
	this.breasts[0].size.base = 7.5;
	this.ass.buttSize.base = 4;
	if(balls)
		this.balls.count.base = 2;
}


Body.prototype.SetRace = function(race) {
	// Default
	race = race || Race.human;
	
	// Head
	this.head.race = race;
	this.head.mouth.tongue.race = race;
	this.head.hair.race = race;
	this.head.eyes.race = race;
	this.head.ears.race = race;
	// Skip appendages array
	
	// Torso
	this.torso.race = race;
	// Skip backSlots array
	
	// Genetalia
	for(var i=0,j=this.cock.length; i<j; i++) {
		switch(race) {
			case Race.horse:
			case Race.cow:
			case Race.sheep:
			case Race.goat:
			case Race.cat:
			case Race.dog:
			case Race.fox:
			case Race.wolf:
			case Race.rabbit:
			case Race.ferret:
				this.cock[i].sheath = true;
			default: break;
		}
		
		switch(race) {
			case Race.dog:
			case Race.fox:
			case Race.wolf:
				this.cock[i].knot = true;
			default: break;
		}
		
		this.cock[i].race = race;
	}
	this.balls.race = race;
	for(var i=0,j=this.vagina.length; i<j; i++)
		this.vagina[i].race = race;
	for(var i=0,j=this.breasts.length; i<j; i++)
		this.breasts[i].race = race;
		
	this.arms.race = race;
	this.legs.race = race;
}

Body.prototype.SetBodyColor = function(color) {
	color = color || Color.white;
	
	// Head
	this.head.color = color;
	// Skip tongue
	// Skip hair
	// Skip eyes
	this.head.ears.color = color;
	// Skip appendages array
	
	// Torso
	this.torso.color = color;
	for(var i=0,j=this.backSlots.length; i<j; i++)
		this.backSlots[i].color = color;
	
	// Genetalia
	for(var i=0,j=this.cock.length; i<j; i++)
		this.cock[i].color = color;
	this.balls.color = color;
	// Skip vagina
	for(var i=0,j=this.breasts.length; i<j; i++)
		this.breasts[i].color = color;
	for(var i=0,j=this.arms.length; i<j; i++)
		this.arms[i].color = color;
	for(var i=0,j=this.legs.length; i<j; i++)
		this.legs[i].color = color;
}

Body.prototype.SetHairColor = function(color) {
	color = color || Color.white;
	this.head.hair.color = color;
	this.pubes.color = color;
}

Body.prototype.SetEyeColor = function(color) {
	color = color || Color.white;
	this.head.eyes.color = color;
}
