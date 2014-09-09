
Quests = {};
Quests.Type = {
	NotStarted : 0,
	Visible    : 1,
	Completed  : 2,
	All        : 3
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
	Text.Add(Text.BoldColor(name));
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

QuestItem = function(opts) {
	opts = opts || {};
	this.desc   = opts.desc   || "NO DESC";
	this.active = opts.active;
};
QuestItem.prototype.Print = function() {
	var active = this.active ? this.active() : Quests.Type.Visible;
	if(active & Quests.Type.Visible) {
		Text.Add("<li>");
		if(active & Quests.Type.Completed)
			Text.Add("<del>");
		
		var desc = this.desc;
		if(isFunction(desc))
			desc();
		else
			Text.Add(desc);
		
		if(active & Quests.Type.Completed)
			Text.Add("</del>");
		Text.Add("</li>");
	}
}

Quests.quests  = [];
Quests.curType = Quests.Type.Visible;

Quests.Print = function() {
	var numQs = 0;
	for(var i=0, j=Quests.quests.length; i<j; ++i) {
		var q = Quests.quests[i];
		var active = q.active() & Quests.curType;
		if(active) {
			numQs++;
			Text.Add("<hr>");
			q.Print();
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

//TODO Testing
/*
Quests.quests.push(new Quest({
	
}));
Quests.quests.push(new Quest({
	name: function() { return "Completed"; },
	active: function() { return Quests.Type.Completed; }
}));
Quests.quests.push(new Quest({
	name: "Active",
	desc: "Yada",
	active: function() { return Quests.Type.Visible; }
}));
*/

