
import { Items } from './items';
import { GetDEBUG } from '../app';
import { VaughnScenes } from './event/outlaws/vaughn-scenes';
import { VaughnFlags } from './event/outlaws/vaughn-flags';
import { CaleFlags } from './event/nomads/cale-flags';
import { TerryFlags } from './event/terry-flags';
import { isFunction } from './utility';
import { Text } from './text';
import { Gui } from './gui';
import { GlobalScenes } from './event/global';
import { GAME } from './GAME';
import { TwinsFlags } from './event/royals/twins-flags';
import { AlchemyItems } from './items/alchemy';
import { Burrows } from './loc/burrows';
import { AscheScenes } from './event/asche';
import { Lei } from './event/royals/lei';
import { LeiScenes } from './event/royals/lei-scenes';
import { RigardFlags } from './loc/rigard/rigard-flags';
import { DryadGladeFlags } from './loc/glade-flags';

export class Quest {
	name : any;
	desc : any;
	active : any;
	list : any[];

	constructor(opts? : any) {
		opts = opts || {};
		this.name   = opts.name   || "FAIL";
		this.desc   = opts.desc   || "NO DESC";
		this.active = opts.active || function() { return Quests.Type.NotStarted; };
		this.list   = opts.list   || [];
	}
	
	Print() {
		var name = isFunction(this.name) ? this.name() : this.name;
		Text.Add("<b>"+name+"</b>");
		Text.NL();
		var desc = isFunction(this.desc) ? this.desc() : this.desc;
		Text.Add(desc);
		Text.NL();
		var list = this.list;
		if(list.length > 0) {
			Text.Add("<ul>");
			for(var i=0,j=list.length; i<j; ++i) {
				var item = list[i];
				item.Print();
			}
			Text.Add("</ul>");
		}
	}
	Active() {
		return this.active(this) & Quests.curType;
	}

};

export class QuestItem {
	desc : any;
	active : any;
	constructor(opts? : any) {
		opts = opts || {};
		this.desc   = opts.desc   || "NO DESC";
		this.active = opts.active;
	}
	
	Print() {
		var active = this.Active();
		if((active & Quests.Type.Visible) || GetDEBUG()) {
			Text.Add("<li>");
			if(active & Quests.Type.Completed)
				Text.Add("<del>");
			if(active & Quests.Type.Failed)
				Text.Add("<font color ='red'><del>");
			
			var desc = isFunction(this.desc) ? this.desc() : this.desc;
			if(isFunction(desc))
				desc();
			else
				Text.Add(desc);
			
			if(active & Quests.Type.Completed)
				Text.Add("</del>");
			if(active & Quests.Type.Failed)
				Text.Add("</del></font>");
			Text.Add("</li>");
		}
	}
	Active() {
		return this.active ? this.active() : Quests.Type.Visible;
	}
};


let Quests : any = {
	Type : {
		NotStarted : 0,
		Visible    : 1,
		Completed  : 2,
		All        : 3,
		Failed     : 4
	}
};

Quests.quests  = [];
Quests.curType = Quests.Type.Visible;

Quests.Print = function(SetExploreButtons : any) {
	var numQs = 0;
	for(var i=0, j=Quests.quests.length; i<j; ++i) {
		var q = Quests.quests[i];
		var active = q.Active();
		if(active || GetDEBUG()) {
			numQs++;
			Text.Add("<hr>");
			if(!active)
				Text.Add("<font color ='gray'>");
			
			q.Print();
			
			if(!active)
				Text.Add("</font>");
		}
	}
	if(numQs > 0)
		Text.Add("<hr>");
	else {
		Text.Add("No active quests.", null, "bold");
	}
	Text.Flush();
	
	var options = new Array();
	options.push({ nameStr : "Active",
		func : function() {
			Text.Clear();
			Quests.curType = Quests.Type.Visible;
			Quests.Print(SetExploreButtons);
		}, enabled : Quests.curType != Quests.Type.Visible
	});
	options.push({ nameStr : "Completed",
		func : function() {
			Text.Clear();
			Quests.curType = Quests.Type.Completed;
			Quests.Print(SetExploreButtons);
		}, enabled : Quests.curType != Quests.Type.Completed
	});
	options.push({ nameStr : "All",
		func : function() {
			Text.Clear();
			Quests.curType = Quests.Type.All;
			Quests.Print(SetExploreButtons);
		}, enabled : Quests.curType != Quests.Type.All
	});
	Gui.SetButtonsFromList(options, false, null);
	
	SetExploreButtons();
}


/*************************
 * Actual list of quests *
 *************************/


// MAIN QUESTS

Quests.quests.push(new Quest({
	name: "Dark Agenda",
	desc: function() {
		return "Prepare Eden against the coming of Uru.";
	},
	active: function() {
		var status = Quests.Type.NotStarted;
		status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				if((GAME().rosalin.flags["Met"] == 0 ||
				    GlobalScenes.MagicStage1()) &&
				    GAME().jeanne.flags["Met"] == 0)
					return "Find someone to help you figure out what the gem does.";
				else
					return "Talk with the court magician about the gem and figure out what it does.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().jeanne.flags["Met"] != 0)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Seek the aid of Mother Tree in the Dryad's Glade, deep within the forest.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				if(GAME().jeanne.flags["Met"] != 0)
					status |= Quests.Type.Visible;
				if(GAME().glade.flags["Visit"] >= DryadGladeFlags.Visit.DefeatedOrchid)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Meet Jeanne at the mound near the Crossroads in order to activate the gem.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				if(GAME().glade.flags["Visit"] >= DryadGladeFlags.Visit.DefeatedOrchid)
					status |= Quests.Type.Visible;
				//TODO
				return status;
			}
		})
	]
}));


Quests.quests.push(new Quest({
	name: function() {
		return "The Nomads";
	},
	desc: function() {
		return "Explore the nomads' camp and talk to it's inhabitants.";
	},
	active: function(quest : Quest) {
		var complete = true;
		for(var i=0, j=quest.list.length; i<j; ++i)
			complete = complete && (quest.list[i].Active() & Quests.Type.Completed) != 0;
		var status = Quests.Type.NotStarted;
		if(complete)
			status |= Quests.Type.Completed;
		else
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				return "Talk to the leader of the nomads.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().chief.flags["Met"] != 0)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Approach the strange alchemist.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().rosalin.flags["Met"] != 0)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Perhaps you should check up on that wolf again...";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				if(GAME().rosalin.flags["Met"] != 0)
					status |= Quests.Type.Visible;
				if(GAME().cale.flags["Met2"] != CaleFlags.Met2.NotMet)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Approach the hunter.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().estevan.flags["Met"] != 0)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Approach the magician.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().magnus.flags["Met"] != 0)
					status |= Quests.Type.Completed;
				return status;
			}
		})
		/*, //TODO Patchwork
		new QuestItem({
			desc: function() {
				return "Approach shopkeeper.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().patchwork.flags["Met"] != 0)
					status |= Quests.Type.Completed;
				return status;
			}
		})
		*/
	]
}));


Quests.quests.push(new Quest({
	name: "Big City",
	desc: function() {
		if(GAME().rigard.Access())
			return "Get access to the royal grounds.";
		else
			return "Find a way inside the city of Rigard. You'll need to get a pass to enter... only question is how to get one.";
	},
	active: function() {
		let rigard = GAME().rigard;
		var status = Quests.Type.NotStarted;
		if(rigard.RoyalAccess())
			status |= Quests.Type.Completed;
		else if(GlobalScenes.VisitedRigardGates())
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				if(GAME().rigard.Access())
					return "Get inside the outer walls.";
				else
					return "Get a pass to the city. You could probably get one by gaining the trust of one of the farmers of the plains. Miranda, the guardswoman, is probably also able to help you get one. If all else fails, you've heard that the outlaws in the forest have infiltrated the city... there must be some sort of secret entrance.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().rigard.Access())
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Find a way to get past the inner walls.";
			},
			active: function() {
				let rigard = GAME().rigard;
				var status = Quests.Type.NotStarted;
				if(rigard.Access())
					status |= Quests.Type.Visible;
				if(rigard.RoyalAccess())
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));



Quests.quests.push(new Quest({
	name: function() {
		return "Seeking Favor";
	},
	desc: function() {
		return "Investigate the noble couple you saw sneaking out of the inner district. You probably ought to figure out why they were followed.";
	},
	active: function() {
		let rigard = GAME().rigard;
		var status = Quests.Type.NotStarted;
		if(rigard.RoyalAccess())
			status |= Quests.Type.Completed;
		else if(rigard.flags["RoyalAccessTalk"] >= 1)
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				return "Investigate what became of the noble couple and their stalker. Perhaps seek them at the inn?";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				if(GAME().twins.flags["Met"] >= TwinsFlags.Met.Met)
					status |= Quests.Type.Completed;
				status |= Quests.Type.Visible;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Heed the noble couple's request by humiliating Lord Krawitz.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				if(GAME().twins.flags["Met"] >= TwinsFlags.Met.Met)
					status |= Quests.Type.Visible;
				if(GAME().rigard.RoyalAccess())
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));


Quests.quests.push(new Quest({
	name: function() {
		return "Shifting the Blame";
	},
	desc: function() {
		return "Crap, they are on to you. If you don't want to spend the rest of your short life in a cell, you'd better help Miranda catch the thief called the 'Masked Fox'. Before you do, you're not likely to get out of Rigard.";
	},
	active: function() {
		let rigard = GAME().rigard;
		var status = Quests.Type.NotStarted;
		if(rigard.Krawitz["Q"] >= RigardFlags.KrawitzQ.CaughtTerry)
			status |= Quests.Type.Completed;
		else if(rigard.Krawitz["Q"] == RigardFlags.KrawitzQ.HuntingTerry)
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				return "Find the thief.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().terry.flags["Met"] >= TerryFlags.Met.Found)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Catch the thief.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().terry.flags["Met"] >= TerryFlags.Met.Caught)
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));


// SIDE QUESTS

Quests.quests.push(new Quest({
	name: function() {
		return "A Guilty Conscience";
	},
	desc: function() {
		return "You are feeling a bit guilty about the fox currently imprisoned due to your actions. Who knows, he could end up being executed over this, given how the Royal Guard regards morphs in Rigard.";
	},
	active: function() {
		var status = Quests.Type.NotStarted;
		if(GAME().terry.flags["Saved"] >= TerryFlags.Saved.Saved)
			status |= Quests.Type.Completed;
		else if(GAME().rigard.Krawitz["Q"] >= RigardFlags.KrawitzQ.CaughtTerry)
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				return "Ask around about what's happened to the thief. Who'd have the authority to release him from custody?";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().terry.flags["Saved"] >= TerryFlags.Saved.TalkedTwins1)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Return to the twins after they have made their arrangements.";
			},
			active: function() {
				let terry = GAME().terry;
				var status = Quests.Type.NotStarted;
				if(terry.flags["Saved"] >= TerryFlags.Saved.TalkedTwins1)
					status |= Quests.Type.Visible;
				if(terry.flags["Saved"] >= TerryFlags.Saved.TalkedTwins2)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Take custody of the thief from the jail in the royal grounds. It'll be quite interesting to see what effects the collar has...";
			},
			active: function() {
				let terry = GAME().terry;
				var status = Quests.Type.NotStarted;
				if(terry.flags["Saved"] >= TerryFlags.Saved.TalkedTwins2)
					status |= Quests.Type.Visible;
				if(terry.flags["Saved"] >= TerryFlags.Saved.Saved)
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));


Quests.quests.push(new Quest({
	name: function() {
		return "Mixin' it up!";
	},
	desc: function() {
		return "Learn about alchemy from Rosalin.";
	},
	active: function() {
		let rosalin = GAME().rosalin;
		var status = Quests.Type.NotStarted;
		if(rosalin.flags["AlQuest"] >= 2)
			status |= Quests.Type.Completed;
		else if(rosalin.flags["Met"] != 0)
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				var parse = GAME().rosalin.ParserPronouns();
				return Text.Parse("Ask Rosalin if [heshe] could teach you the secrets of [hisher] trade.", parse);
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().rosalin.flags["AlQuest"] >= 1)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Retrieve the items that Rosalin requested. You should be able to find them from the lagomorphs near the crossroads. The alchemist asked for <b>lettuce, carrot juice and a rabbit foot charm.</b>";
			},
			active: function() {
				var item = AlchemyItems.Leporine;
				var enabled = true;
				for(var j = 0; j < item.recipe.length; j++) {
					var component = item.recipe[j];
					enabled = enabled && (GAME().party.inventory.QueryNum(component.it) >= (component.num || 1));
				}
				
				let rosalin = GAME().rosalin;
				var status = Quests.Type.NotStarted;
				if(rosalin.flags["AlQuest"] >= 1)
					status |= Quests.Type.Visible;
				if(rosalin.flags["AlQuest"] >= 2 || enabled)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Return the items to Rosalin and learn how to do alchemy.";
			},
			active: function() {
				let rosalin = GAME().rosalin;
				var status = Quests.Type.NotStarted;
				if(rosalin.flags["AlQuest"] >= 1)
					status |= Quests.Type.Visible;
				if(rosalin.flags["AlQuest"] >= 2)
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));

Quests.quests.push(new Quest({
	name: function() {
		return "Breeding Bunnies";
	},
	desc: function() {
		return "Help Ophelia with her alchemical experiments in the Burrows. You are not sure this is really a good idea, but Lagon promised to pay you handsomely for your services.";
	},
	active: function() {
		let burrows = GAME().burrows;
		var status = Quests.Type.NotStarted;
		if(burrows.flags["Access"] >= Burrows.AccessFlags.Stage3)
			status |= Quests.Type.Completed;
		else if(burrows.flags["Access"] >= Burrows.AccessFlags.Visited)
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				var num = GAME().party.Inv().QueryNum(Items.Quest.Cactoid);
				num = num || 0;
				if(GAME().burrows.BruteActive())
					return "Bring Ophelia cactoids from the desert: 3/3.";
				else
					return Text.Parse("Bring Ophelia cactoids from the desert: [num]/3.", { num: num });
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().burrows.BruteActive())
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				var num = GAME().party.Inv().QueryNum(Items.Quest.GolHusk);
				num = num || 0;
				if(GAME().burrows.HermActive())
					return "Bring Ophelia Gol husks from the forest: 3/3.";
				else
					return Text.Parse("Bring Ophelia Gol husks from the forest: [num]/3.", { num: num });
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().burrows.HermActive())
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				var num = GAME().party.Inv().QueryNum(Items.Quest.RedAlgae);
				num = num || 0;
				if(GAME().burrows.BrainyActive())
					return "Bring Ophelia red algae from the lake: 3/3.";
				else
					return Text.Parse("Bring Ophelia red algae from the lake: [num]/3.", { num: num });
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().burrows.BrainyActive())
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));

Quests.quests.push(new Quest({
	name: function() {
		return "Search for the Scepter";
	},
	desc: function() {
		return "Ophelia has asked you to search for Lagon's scepter, possibly the only thing that can help her mother.";
	},
	active: function() {
		let burrows = GAME().burrows;
		var status = Quests.Type.NotStarted;
		if(burrows.flags["Access"] >= Burrows.AccessFlags.QuestlineComplete)
			status |= Quests.Type.Completed;
		else if(burrows.flags["Access"] >= Burrows.AccessFlags.Stage3)
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() { //TODO Roa met flag
				return "Find Ophelia's brother, Roa. Your best lead seems to be looking for whorehouses...";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().burrows.flags["Access"] >= Burrows.AccessFlags.Stage4)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return GAME().rigard.flags["Scepter"] == 0 ? "Follow the merchant lead, trail the caravan along the King's Road." : "Follow the merchant lead, probably best to check the merchant street.";
			},
			active: function() {
				let burrows = GAME().burrows;
				var status = Quests.Type.NotStarted;
				if(burrows.flags["Access"] >= Burrows.AccessFlags.Stage4)
					status |= Quests.Type.Visible;
				if(burrows.flags["Access"] >= Burrows.AccessFlags.Stage5)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Return the scepter to the Burrows.";
			},
			active: function() {
				let burrows = GAME().burrows;
				var status = Quests.Type.NotStarted;
				if(burrows.flags["Access"] >= Burrows.AccessFlags.Stage5)
					status |= Quests.Type.Visible;
				if(burrows.flags["Access"] >= Burrows.AccessFlags.QuestlineComplete)
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));


Quests.quests.push(new Quest({
	name: function() {
		return "Helping Aquilius";
	},
	desc: function() {
		return "Help Aquilius gather herbs from the forest.";
	},
	active: function() {
		var status = Quests.Type.NotStarted;
		if(GAME().aquilius.OnHerbsQuest())
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				return "Gather herbs from the forest for Aquilius. You should be able to find them pretty close to the Outlaws’ camp.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().aquilius.OnHerbsQuestFinished())
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				let aquilius = GAME().aquilius;
				var item = aquilius.herbIngredient ? aquilius.herbIngredient.sDesc() : "<b>ERROR</b>";
				return "In addition, Aquilius asked for some " + item + ". While not strictly necessary, you’re sure the old surgeon would appreciate you getting that as well.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().party.Inv().QueryNum(GAME().aquilius.herbIngredient))
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Return the herbs to Aquilius in the infirmary.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				return status;
			}
		})
	]
}));


Quests.quests.push(new Quest({
	name: function() {
		return "Fresh Ginseng";
	},
	desc: function() {
		return "Help Asche find some fresh Ginseng.";
	},
	active: function() {
		var status = Quests.Type.NotStarted;
		if(AscheScenes.Tasks.Ginseng.IsCompleted()) {
			if(AscheScenes.Tasks.Ginseng.IsSuccess())
				status |= Quests.Type.Completed;
			else if(AscheScenes.Tasks.Ginseng.IsFail())
				status |= Quests.Type.Failed;
		}
		else if(AscheScenes.Tasks.Ginseng.IsOn())
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				return "Go to the Highlands on the other side of the plains and search for fresh Ginseng.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(AscheScenes.Tasks.Ginseng.IsSuccess())
					status |= Quests.Type.Completed;
				else if(AscheScenes.Tasks.Ginseng.IsFail())
					status |= Quests.Type.Failed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Return to Asche in her shop in Rigard.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(AscheScenes.Tasks.Ginseng.IsCompleted())
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));


Quests.quests.push(new Quest({
	name: function() {
		return "Nightshade";
	},
	desc: function() {
		return "Help Asche find some nightshade.";
	},
	active: function() {
		var status = Quests.Type.NotStarted;
		if(AscheScenes.Tasks.Nightshade.IsCompleted())
			status |= Quests.Type.Completed;
		else if(AscheScenes.Tasks.Nightshade.IsOn())
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				return "Maybe find someone knowledgeable of forest herbs and ask them where one could find nightshade?";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(AscheScenes.Tasks.Nightshade.HasHelpFromAquilius())
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Go to the Forest and find some nightshade.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(AscheScenes.Tasks.Nightshade.IsSuccess())
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Return to Asche in her shop in Rigard.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(AscheScenes.Tasks.Nightshade.IsCompleted())
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));

Quests.quests.push(new Quest({
	name: function() {
		return "Spring Time For Asche";
	},
	desc: function() {
		return "Asche would like you to investigate a highland spring and collect some water for her.";
	},
	active: function() {
		var status = Quests.Type.NotStarted;
		if(AscheScenes.Tasks.Spring.IsCompleted())
			status |= Quests.Type.Completed;
		else if(AscheScenes.Tasks.Spring.IsOn())
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				return "Find the spring in the highlands and collect a sample of its waters.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(AscheScenes.Tasks.Spring.IsSuccess())
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Return to Asche in Rigard with the vial.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(AscheScenes.Tasks.Spring.IsCompleted())
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));

Quests.quests.push(new Quest({
	name: function() {
		return "Tools of the Trade";
	},
	desc: function() {
		return "Deliver thieves' tools to Elodie, the outlaw contact in Rigard.";
	},
	active: function() {
		var status = Quests.Type.NotStarted;
		if(VaughnScenes.Tasks.Lockpicks.Completed())
			status |= Quests.Type.Completed;
		else if(GAME().vaughn.flags["Met"] >= VaughnFlags.Met.OnTaskLockpicks)
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				return "Meet with Elodie in the castle grounds and deliver Vaughn's tools to her.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().vaughn.flags["Met"] >= VaughnFlags.Met.LockpicksElodie)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Return to Vaughn and report.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(VaughnScenes.Tasks.Lockpicks.Completed())
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));

Quests.quests.push(new Quest({
	name: function() {
		return "The Snitch";
	},
	desc: function() {
		return "Deal with the crooked guardsman that has been giving the outlaws trouble.";
	},
	active: function() {
		var status = Quests.Type.NotStarted;
		if(VaughnScenes.Tasks.Snitch.Completed())
			status |= Quests.Type.Completed;
		else if(GAME().vaughn.flags["Met"] >= VaughnFlags.Met.OnTaskSnitch)
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				return "Find a way to deal with the crooked guardsman, Terrell. Vaughn has given you some incriminating evidence that he wants you to plant in the City Watch barracks in Rigard.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().vaughn.flags["Met"] >= VaughnFlags.Met.SnitchMirandaSuccess)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Return to Vaughn and report.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(VaughnScenes.Tasks.Snitch.Completed())
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));

Quests.quests.push(new Quest({
	name: function() {
		return "The Lady is Indisposed";
	},
	desc: function() {
		return "Make sure the Lady Heydrich doesn't appear in court.";
	},
	active: function() {
		let vaughn = GAME().vaughn;
		var status = Quests.Type.NotStarted;
		
		if(VaughnScenes.Tasks.Poisoning.Completed() && !(vaughn.flags["T3"] & VaughnFlags.Poisoning.Success))
			status |= Quests.Type.Failed;
		else if(VaughnScenes.Tasks.Poisoning.Completed())
			status |= Quests.Type.Completed;
		else if(vaughn.flags["Met"] >= VaughnFlags.Met.OnTaskPoisoning)
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				var poison = GAME().vaughn.flags["T3"] & VaughnFlags.Poisoning.Aphrodisiac ? "aphrodisiac" : "poison";
				return "Somehow feed Lady Heydrich the " + poison + ". She can be found in the Lady's Blessing inn in Rigard.";
			},
			active: function() {
				let vaughn = GAME().vaughn;
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if((vaughn.flags["Met"] >= VaughnFlags.Met.PoisoningFail) && !(vaughn.flags["T3"] & VaughnFlags.Poisoning.Success))
					status |= Quests.Type.Failed;
				else if(vaughn.flags["Met"] >= VaughnFlags.Met.PoisoningFail)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Return to Vaughn and report.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(VaughnScenes.Tasks.Poisoning.Completed())
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));

Quests.quests.push(new Quest({
	name: function() {
		return "Escort Service";
	},
	desc: function() {
		return "Follow Lei's directions and perform a job for Ventor Orellos.";
	},
	active: function() {
		var status = Quests.Type.NotStarted;
		if(LeiScenes.Tasks.Escort.Completed())
			status |= Quests.Type.Completed;
		else if(GAME().lei.flags["Met"] >= Lei.Met.OnTaskEscort)
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				return "Meet with Ventor Orellos at his mansion near the Plaza in Rigard between ten and seventeen. According to Lei, he has a job for you.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().lei.flags["Met"] >= Lei.Met.EscortFinished)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Return to Lei and report.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(LeiScenes.Tasks.Escort.Completed())
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));

//TODO Krawitz(?), Burrows, Gwendy

/*
 * : 

Quests.quests.push(new Quest({
	name: function() {
		return "Seeking favor";
	},
	desc: function() {
		return "Investigate the noble couple you saw sneaking out of the inner district. You probably ought to figure out why they were followed.";
	},
	active: function() {
		let rigard = GAME().rigard;
		var status = Quests.Type.NotStarted;
		if(rigard.RoyalAccess())
			status |= Quests.Type.Completed;
		else if(rigard.flags["RoyalAccessTalk"] >= 1)
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				if(GAME().rigard.Access())
					return "";
				else
					return "";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(GAME().rigard.Access())
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));

 */

export { Quests };
