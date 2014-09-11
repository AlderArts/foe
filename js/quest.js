
Quests = {};
Quests.Type = {
	NotStarted : 0,
	Visible    : 1,
	Completed  : 2,
	All        : 3,
	Failed     : 4
};

Quest = function(opts) {
	opts = opts || {};
	this.name   = opts.name   || "FAIL";
	this.desc   = opts.desc   || "NO DESC";
	this.active = opts.active || function() { return Quests.Type.NotStarted; };
	this.list   = opts.list   || [];
};
Quest.prototype.Print = function() {
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
Quest.prototype.Active = function() {
	return this.active(this) & Quests.curType;
}

QuestItem = function(opts) {
	opts = opts || {};
	this.desc   = opts.desc   || "NO DESC";
	this.active = opts.active;
};
QuestItem.prototype.Print = function() {
	var active = this.Active();
	if((active & Quests.Type.Visible) || DEBUG) {
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
QuestItem.prototype.Active = function() {
	return this.active ? this.active() : Quests.Type.Visible;
}

Quests.quests  = [];
Quests.curType = Quests.Type.Visible;

Quests.Print = function() {
	var numQs = 0;
	for(var i=0, j=Quests.quests.length; i<j; ++i) {
		var q = Quests.quests[i];
		var active = q.Active();
		if(active || DEBUG) {
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
		Text.Add(Text.BoldColor("No active quests."));
	}
	Text.Flush();
	
	var options = new Array();
	options.push({ nameStr : "Active",
		func : function() {
			Text.Clear();
			Quests.curType = Quests.Type.Visible;
			Quests.Print();
		}, enabled : Quests.curType != Quests.Type.Visible
	});
	options.push({ nameStr : "Completed",
		func : function() {
			Text.Clear();
			Quests.curType = Quests.Type.Completed;
			Quests.Print();
		}, enabled : Quests.curType != Quests.Type.Completed
	});
	options.push({ nameStr : "All",
		func : function() {
			Text.Clear();
			Quests.curType = Quests.Type.All;
			Quests.Print();
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
	name: "Dark agenda",
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
				if((rosalin.flags["Met"] == 0 ||
				    gameCache.flags["LearnedMagic"] != 0) &&
				    jeanne.flags["Met"] == 0)
					return "Find someone to help you figure out what the gem does.";
				else
					return "Talk with the court magician about the gem and figure out what it does.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(jeanne.flags["Met"] != 0)
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
				if(jeanne.flags["Met"] != 0)
					status |= Quests.Type.Visible;
				if(glade.flags["Visit"] >= 2)
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
				if(glade.flags["Visit"] >= 2)
					status |= Quests.Type.Visible;
				//TODO
				return status;
			}
		})
	]
}));


Quests.quests.push(new Quest({
	name: function() {
		return "The nomads";
	},
	desc: function() {
		return "Explore the nomads' camp and talk to it's inhabitants.";
	},
	active: function(quest) {
		var complete = true;
		for(var i=0, j=quest.list.length; i<j; ++i)
			complete &= (quest.list[i].Active() & Quests.Type.Completed) != 0;
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
				if(chief.flags["Met"] != 0)
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
				if(rosalin.flags["Met"] != 0)
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
				if(rosalin.flags["Met"] != 0)
					status |= Quests.Type.Visible;
				if(cale.flags["Met2"] != Cale.Met2.NotMet)
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
				if(estevan.flags["Met"] != 0)
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
				if(magnus.flags["Met"] != 0)
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
				if(patchwork.flags["Met"] != 0)
					status |= Quests.Type.Completed;
				return status;
			}
		})
		*/
	]
}));


Quests.quests.push(new Quest({
	name: "Big city",
	desc: function() {
		if(rigard.Access())
			return "Get access to the royal grounds.";
		else
			return "Find a way inside the city of Rigard. You'll need to get a pass to enter... only question is how to get one.";
	},
	active: function() {
		var status = Quests.Type.NotStarted;
		if(rigard.RoyalAccess())
			status |= Quests.Type.Completed;
		else if(miranda.flags["Met"] >= Miranda.Met.Met)
			status |= Quests.Type.Visible;
		return status;
	},
	list: [
		new QuestItem({
			desc: function() {
				if(rigard.Access())
					return "Get inside the outer walls.";
				else
					return "Get a pass to the city. You could probably get one by gaining the trust of one of the farmers of the plains. Miranda, the guardswoman, is probably also able to help you get one. If all else fails, you've heard that the outlaws in the forest have infiltrated the city... there must be some sort of secret entrance.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(rigard.Access())
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Find a way to get past the inner walls.";
			},
			active: function() {
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
		return "Seeking favor";
	},
	desc: function() {
		return "Investigate the noble couple you saw sneaking out of the inner district. You probably ought to figure out why they were followed.";
	},
	active: function() {
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
				if(twins.flags["Met"] >= Twins.Met.Met)
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
				if(twins.flags["Met"] >= Twins.Met.Met)
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
		return "Shifting the blame";
	},
	desc: function() {
		return "Crap, they are on to you. If you don't want to spend the rest of your short life in a cell, you'd better help Miranda catch the thief called the 'Masked Fox'. Before you do, you're not likely to get out of Rigard.";
	},
	active: function() {
		var status = Quests.Type.NotStarted;
		if(rigard.Krawitz["Q"] >= Rigard.KrawitzQ.CaughtTerry)
			status |= Quests.Type.Completed;
		else if(rigard.Krawitz["Q"] == Rigard.KrawitzQ.HuntingTerry)
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
				if(terry.flags["Met"] >= Terry.Met.Found)
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
				if(terry.flags["Met"] >= Terry.Met.Caught)
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));


// SIDE QUESTS

Quests.quests.push(new Quest({
	name: function() {
		return "A guilty conscience";
	},
	desc: function() {
		return "You are feeling a bit guilty about the fox currently imprisoned due to your actions. Who knows, he could end up being executed over this, given how the royal guard regards morphs in Rigard.";
	},
	active: function() {
		var status = Quests.Type.NotStarted;
		if(terry.flags["Saved"] >= Terry.Saved.Saved)
			status |= Quests.Type.Completed;
		else if(rigard.Krawitz["Q"] >= Rigard.KrawitzQ.CaughtTerry)
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
				if(terry.flags["Saved"] >= Terry.Saved.TalkedTwins1)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Return to the twins after they have made their arrangements.";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				if(terry.flags["Saved"] >= Terry.Saved.TalkedTwins1)
					status |= Quests.Type.Visible;
				if(terry.flags["Saved"] >= Terry.Saved.TalkedTwins2)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Take custody of the thief from the jail in the royal grounds. It'll be quite interesting to see what effects the collar has...";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				if(terry.flags["Saved"] >= Terry.Saved.TalkedTwins2)
					status |= Quests.Type.Visible;
				if(terry.flags["Saved"] >= Terry.Saved.Saved)
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
				var parse = rosalin.ParserPronouns();
				return Text.Parse("Ask Rosalin if [heshe] could teach you the secrets of [hisher] trade.", parse);
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(rosalin.flags["AlQuest"] >= 1)
					status |= Quests.Type.Completed;
				return status;
			}
		}),
		new QuestItem({
			desc: function() {
				return "Retrieve the items that Rosalin requested. You should be able to find them from the lagomorphs near the crossroads. The alchemist asked for <b>lettuce, carrot juice and a rabbit foot charm.</b>";
			},
			active: function() {
				var item = Items.Leporine;
				var enabled = true;
				for(var j = 0; j < item.Recipe.length; j++) {
					var component = item.Recipe[j];
					enabled &= (party.inventory.QueryNum(component.it) >= (component.num || 1));
				}
				
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


/*
Quests.quests.push(new Quest({
	name: function() {
		return "Breeding bunnies";
	},
	desc: function() {
		return "Help Ophelia with her alchemical experiments in the Burrows. You are not sure this is really a good idea, but Lagon promised to pay you handsomely for your services.";
	},
	active: function() {
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
				if(rigard.Access())
					return "";
				else
					return "";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(rigard.Access())
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));
*/

//TODO Krawitz(?), Burrows, Gwendy

/*
 * 

Quests.quests.push(new Quest({
	name: function() {
		return "Seeking favor";
	},
	desc: function() {
		return "Investigate the noble couple you saw sneaking out of the inner district. You probably ought to figure out why they were followed.";
	},
	active: function() {
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
				if(rigard.Access())
					return "";
				else
					return "";
			},
			active: function() {
				var status = Quests.Type.NotStarted;
				status |= Quests.Type.Visible;
				if(rigard.Access())
					status |= Quests.Type.Completed;
				return status;
			}
		})
	]
}));

 */