/*
 * 
 * Highlands area, connects to the mountains and to the dragons' den.
 * Good hunting grounds
 * 
 */

// Create namespace
world.loc.Highlands = {
	Hills         : new Event("Hills")
}

//
// Hills, main hunting grounds
//
world.loc.Highlands.Hills.description = function() {
	Text.AddOutput("This place looks hilly. Looks good for hunting.<br/>");
}

world.loc.Highlands.Hills.links.push(new Link(
	"Crossroads", true, true,
	function() {
		Text.AddOutput("Behind you is the way back to the crossroads.<br/>");
	},
	function() {
		MoveToLocation(world.loc.Plains.Crossroads, {minute: 15});
	}
));
world.loc.Highlands.Hills.links.push(new Link(
	"Den entrance", true, true,
	function() {
		Text.AddOutput("A sheer cliffside rise in the distance. Somehow, it gives off an ominous feeling. ");
	},
	function() {
		MoveToLocation(world.loc.DragonDen.Entry, {minute: 15});
	}
));

world.loc.Highlands.Hills.enc = new EncounterTable();

world.loc.Highlands.Hills.enc.AddEnc(function() {
 	var enemy = new Party();
 	var r = Math.random();
 	if(r < 0.2) {
		enemy.AddMember(new Puma(Gender.herm));
		enemy.AddMember(new Puma(Gender.male));
		enemy.AddMember(new Puma(Gender.female));
	}
	else if(r < 0.4) {
		enemy.AddMember(new Puma(Gender.male));
		enemy.AddMember(new Puma(Gender.female));
		enemy.AddMember(new Puma(Gender.female));
		enemy.AddMember(new Puma(Gender.female));
	}
	else {
		enemy.AddMember(new Puma(Gender.Rand([3,4,1])));
		for(var i = 0; i < 3; i++) {
			if(Math.random() < 0.2)
				enemy.AddMember(new Puma(Gender.Rand([3,4,1])));
		}
	}
	var enc = new Encounter(enemy);
	
	enc.onEncounter = Scenes.Felines.Intro;
	enc.onVictory   = Scenes.Felines.WinPrompt;
	enc.onLoss      = Scenes.Felines.LossRegular;
	/*
	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	return enc;
}, 0.5);

world.loc.Highlands.Hills.enc.AddEnc(function() {
 	var enemy = new Party();
 	var r = Math.random();
 	if(r < 0.2) {
		enemy.AddMember(new Lynx(Gender.herm));
		enemy.AddMember(new Lynx(Gender.male));
		enemy.AddMember(new Lynx(Gender.female));
	}
	else if(r < 0.4) {
		enemy.AddMember(new Lynx(Gender.male));
		enemy.AddMember(new Lynx(Gender.female));
		enemy.AddMember(new Lynx(Gender.female));
		enemy.AddMember(new Lynx(Gender.female));
	}
	else {
		enemy.AddMember(new Lynx(Gender.Rand([3,4,1])));
		for(var i = 0; i < 3; i++) {
			if(Math.random() < 0.2)
				enemy.AddMember(new Lynx(Gender.Rand([3,4,1])));
		}
	}
	var enc = new Encounter(enemy);
	
	enc.onEncounter = Scenes.Felines.Intro;
	enc.onVictory   = Scenes.Felines.WinPrompt;
	enc.onLoss      = Scenes.Felines.LossRegular;
	/*
	enc.canRun = false;
	enc.onEncounter = ...
	enc.onLoss = ...
	enc.onVictory = ...
	enc.VictoryCondition = ...
	*/
	return enc;
}, 0.5);

world.loc.Highlands.Hills.enc.AddEnc(function() {
	return Scenes.Momo.MomoEnc;
}, 1.0, function() { return momo.Wandering(); });

world.loc.Highlands.Hills.endDescription = function() {
	Text.AddOutput("What do you do?<br/>");
}
