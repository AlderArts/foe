
import { Event, Link } from '../../event';
import { EncounterTable } from '../../encountertable';
import { Text } from '../../text';
import { MoveToLocation } from '../../GAME';
import { Gui } from '../../gui';
import { RigardFlags } from './rigard-flags';

let ResidentialLoc = {
	street   : new Event("Residential street"), // Will also contain gate to slums
	tavern   : new Event("Maidens' bane"),
	miranda  : new Event("Miranda's house"),
	mDungeon : new Event("Miranda's dungeon")
};

//
// Residential area
//
ResidentialLoc.street.description = function() {
	let rigard = GAME().rigard;

	Text.Add("The common residential area is clearly a shadier part of the town. The closely spaced buildings here are shabbier than you would see elsewhere, hardly letting you see the sky for all the laundry hanging out on display for all to see.");
	Text.NL();
	
	if(rigard.Krawitz["Q"] == RigardFlags.KrawitzQ.HuntingTerry) {
		Text.Add("Though many residents are still going about their normal business, even here, the lockdown has caused disruptions. There's a sizable group of residents standing near the gate, trying in vain to get past the guards and arguing quite vehemently as they try and make their case. An even larger group is watching the argument; some simply for entertainment, undoubtedly, but most of them are glaring at the guards.");
		Text.NL();
		Text.Add("It's not a very likely hiding place, but there's enough nooks, crannies and people here that a bold or desperate thief could try and conceal themselves.");
		Text.NL();
	}
}

ResidentialLoc.street.enc = new EncounterTable();
ResidentialLoc.street.enc.AddEnc(function() { return Scenes.Rigard.Chatter;});
ResidentialLoc.street.enc.AddEnc(function() { return Scenes.Rigard.Chatter2;});
ResidentialLoc.street.enc.AddEnc(function() { return Scenes.Rigard.CityHistory;}, 1.0, function() {
	let rigard = GAME().rigard;
	return rigard.flags["CityHistory"] == 0;
});
ResidentialLoc.street.enc.AddEnc(function() { return Scenes.Terry.ExploreResidential; }, 1000000.0, function() {
	let rigard = GAME().rigard;
	return rigard.Krawitz["Q"] == RigardFlags.KrawitzQ.HuntingTerry;
});
ResidentialLoc.street.enc.AddEnc(function() { return Scenes.Lei.GuardStalking; }, 3.0, function() { return Scenes.Lei.GuardStalkingApplicable(); });
ResidentialLoc.street.onEntry = function() {
	
	// TODO
	// During nighttime, sometimes groups of bandits will try to attack!
	/*
	if(!(WorldTime().hour >= 6 && WorldTime().hour < 22)) // Nighttime
	{
		if(Math.random() < 0.2) {
			Text.Add("You come across a group of bandits!");
			
			Gui.NextPrompt(function() {
				var enemy = new Party();
				var numE = Rand(2)+2;
				for(var i = 0; i < numE; i++)
					enemy.AddMember(new StreetUrchin());
				var enc = new Encounter(enemy);
				enc.Start();
			});
			return;
		}
	}
	*/
	if(Math.random() < 0.15)
		Scenes.Rigard.Chatter(true);
	else if(Math.random() < 0.3)
		Scenes.Rigard.Chatter2(true);
	else
		Gui.PrintDefaultOptions();
}

ResidentialLoc.street.links.push(new Link(
	"Gate", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Gate, {minute: 10});
	}
));
ResidentialLoc.street.links.push(new Link(
	"Residential", true, false
));
ResidentialLoc.street.links.push(new Link(
	"Merchants", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.ShopStreet.street, {minute: 20});
	}
));
ResidentialLoc.street.links.push(new Link(
	"Plaza", true, true,
	null,
	function() {
		MoveToLocation(world.loc.Rigard.Plaza, {minute: 10});
	}
));

ResidentialLoc.street.links.push(new Link(
	"Slums", true, function() {
		let rigard = GAME().rigard;
		return !rigard.UnderLockdown();
	},
	null,
	function() {
		let rigard = GAME().rigard;
		if(rigard.Krawitz["Q"] == RigardFlags.KrawitzQ.HeistDone)
			Scenes.Rigard.Lockdown();
		else
			MoveToLocation(world.loc.Rigard.Slums.gate, {minute: 10});
	}
));
ResidentialLoc.street.links.push(new Link(
	"Brothel", true, function() { return Scenes.Brothel.IsOpen(); },
	function() {
		Text.Add("A rather discreet sign on a large nearby building invites you to the brothel ‘The Shadow Lady’. The facade is richer than the regular houses of the district, and the establishment is bustling with activity.");
		Text.NL();
	},
	function() {
		MoveToLocation(world.loc.Rigard.Brothel.brothel, {minute: 5});
	}
));
ResidentialLoc.street.links.push(new Link(
	"Miranda's", true, function() {
		let miranda = GAME().miranda;
		let party : Party = GAME().party;
		return party.InParty(miranda);
	},
	null,
	function() {
		MoveToLocation(ResidentialLoc.miranda);
	}
));

export { ResidentialLoc };
