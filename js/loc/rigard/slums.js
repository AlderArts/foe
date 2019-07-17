


import { world } from '../../world';
import { Link, Scenes, EncounterTable } from '../../event';



//
// Slums
//
world.loc.Rigard.Slums.gate.description = function() {
	Text.Add("The slum of Rigard is a wretched cesspool of bustling activity at all times of the day. The sprawling ghetto spreads out along the riverfront, crawling along the walls of the city as if trying to get inside. Most houses you see are built of sturdy but cheap wood, intended to weather the cold winters but not designed for comfort or aesthetics.");
	Text.NL();
	Text.Add("The ‘streets’ are mostly mud[winter], battered every day by countless feet. The smell of the docks reach you even here, near the gates to the inner city.", {winter: world.time.season == Season.Winter ? ", a dirty slush at this time of year" : ""});
	Text.NL();
	
	if(miranda.IsAtLocation()) {
		Scenes.Miranda.RigardSlumGatesDesc();
	}
	else {
		var fucked = miranda.flags["gBJ"] + miranda.flags["gAnal"];
		if(fucked > 10)
			Text.Add("You recognize almost every guard manning the gates by this point, and they certainly recognize you, having seen you getting used by Miranda on more than one occasion.");
		else if(fucked > 0 && Math.random() > 0.5)
			Text.Add("Most of the guards manning the gates look unfamiliar to you, though you hear a snicker indicating that someone recognizes you for your exploits. News travels fast, you guess.");
		else
			Text.Add("The guards regard you with rather disinterested looks, lounging at a table beside the gate.");
		Text.NL();
	}
	
	Text.Flush();
}

world.loc.Rigard.Slums.gate.enc = new EncounterTable();
world.loc.Rigard.Slums.gate.enc.AddEnc(function() { return Scenes.Rigard.Chatter;});
world.loc.Rigard.Slums.gate.enc.AddEnc(function() { return Scenes.Rigard.Chatter2;});
world.loc.Rigard.Slums.gate.enc.AddEnc(function() { return Scenes.Rigard.CityHistory;}, 1.0, function() { return rigard.flags["CityHistory"] == 0; });
world.loc.Rigard.Slums.gate.enc.AddEnc(function() { return Scenes.Lei.GuardStalking; }, 3.0, function() { return Scenes.Lei.GuardStalkingApplicable(); });
world.loc.Rigard.Slums.gate.onEntry = function() {
	if(Math.random() < 0.15)
		Scenes.Rigard.Chatter(true);
	else if(Math.random() < 0.3)
		Scenes.Rigard.Chatter2(true);
	else
		PrintDefaultOptions();
}

world.loc.Rigard.Slums.gate.links.push(new Link(
	"Rigard", true, true,
	function() {
		Text.Add("Enter the city? ");
	},
	function() {
		Text.Clear();
		if(miranda.IsAtLocation()) {
			Scenes.Miranda.RigardSlumGatesEnter();
		}
		else {
			if(!rigard.GatesOpen()) {
				Text.Add("One of the guards tells you that the gates are closed for the night, and that you should return at another time. The gates are open between eight in the morning and five in the evening.");
			}
			else if(rigard.Visa()) {
				Text.Add("The guards lazily check your papers before letting you through the gates into the city. They apparently found no issue, or simply didn’t want to bother with searching you, as the process is quick and painless.");
				Text.Flush();
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.Residential.street, {minute: 5});
				});
				return;
			}
			else {
				Text.Add("One of the guards explains that you can’t get through if you don’t have a city issued visa. They don’t seem particularly interested in helping you getting one either.");
			}
			Text.Flush();
			PrintDefaultOptions(true);
		}
	}
));
world.loc.Rigard.Slums.gate.links.push(new Link(
	"Main gate", true, true,
	function() {
		Text.Add("Go to the main gate? ");
	},
	function() {
		MoveToLocation(world.loc.Plains.Gate, {minute: 15});
	}
));
world.loc.Rigard.Slums.gate.links.push(new Link(
	"Tavern", true, true,
	function() {
		Text.Add("Go to the tavern? ");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Tavern.common, {minute: 10});
	}
));
world.loc.Rigard.Slums.gate.links.push(new Link(
	"Lake", true, true,
	function() {
		Text.Add("Go to the lake? ");
	},
	function() {
		MoveToLocation(world.loc.Lake.Shore, {minute: 45});
	}
));

world.loc.Rigard.Slums.gate.events.push(new Link(
	"Miranda", function() { return miranda.IsAtLocation(); }, true,
	null,
	function() {
		Scenes.Miranda.RigardGatesInteract();
	}
));
