
Scenes.Vaughn.Tasks = {};

Scenes.Vaughn.Tasks.OnTask = function() {
	return Scenes.Vaughn.Tasks.Lockpicks.OnTask(); //TODO add tasks
}

Scenes.Vaughn.Tasks.AnyTaskAvailable = function() {
	return Scenes.Vaughn.Tasks.Lockpicks.Available(); //TODO add tasks
}

Scenes.Vaughn.Tasks.StartTask = function() { //TODO add tasks
	if(Scenes.Vaughn.Tasks.Lockpicks.Available())
		Scenes.Vaughn.Tasks.Lockpicks.Start();
}

Scenes.Vaughn.Tasks.TaskPrompt = function() {
	var parse = {
		
	};
	
	Text.Clear();
	if(Scenes.Vaughn.Tasks.AnyTaskAvailable()) {
		Text.Add("<i>“So, you’re interested in seeing some action? Young people, full of drive and fire… well, I’m not about to stop you from doing what an operative’s supposed to do.”</i> Vaughn thinks a moment, then smiles. <i>“Just so it happens, there’s something that came up which needs handling, and it has to be done the next day. You interested? Remember, you’ll be on the clock if I hand the assignment to you, so don’t accept responsibility for anything that you’re not willing to see through. You’re still thinking of going out there?”</i>", parse);
		Text.Flush();
		
		//[Yes][No]
		var options = new Array();
		options.push({ nameStr : "Yes",
			tooltip : "Yes, you’ll take it.",
			func : function() {
				Text.Clear();
				Text.Add("<i>“All right, then. Let’s see what the boss-man wants me to hand down to you today…”</i>", parse);
				Text.Flush();
				
				Gui.NextPrompt(Scenes.Vaughn.Tasks.StartTask);
			}, enabled : true
		});
		options.push({ nameStr : "No",
			tooltip : "No, you’re not sure if you can see the task through.",
			func : function() {
				Text.Clear();
				Text.Add("Vaughn nods and shrugs at your words. <i>“Better that you say upfront that you can’t do it, rather than accept the job and get creamed, then leave everyone else to pick up the pieces. It’s no big deal; I’ll just pass along the task to someone who’s in the clear. You get points in my book for being honest about it.”</i>", parse);
				Text.NL();
				Text.Add("Points? Is he keeping score?", parse);
				Text.NL();
				Text.Add("<i>“Might be, might not be,”</i> Vaughn replies with a completely straight face. <i>“Now, was there something else you wanted of me?”</i>", parse);
				Text.Flush();
				
				Scenes.Vaughn.Prompt();
			}, enabled : true
		});
		Gui.SetButtonsFromList(options, false, null);
	}
	else {
		Text.Add("<i>“Hmm.”</i> Vaughn takes his gaze off you and thinks for a moment. <i>“Don’t imagine I’ve got anything for you at the moment; the other operatives pretty much have all our bases covered and the boss-man’s been in a thinking mood, as opposed to a doing one. Maybe you should go out there and move things along - stir up the hive, as they say. That should create all sorts of opportunities for us to get our fingers into some more pies.”</i>", parse);
		Text.NL();
		Text.Add("All right, then. You’ll ask later.", parse);
		Text.NL();
		Text.Add("<i>“Don’t just come calling around these parts,”</i> Vaughn calls out after you as you leave. <i>“I’m just one fellow, you know. Pretty sure there’re other folks in camp who could use a hand or two anytime - just have to ask around until you find them.”</i>", parse);
		Text.Flush();
		
		Scenes.Vaughn.Prompt();
	}
}


Scenes.Vaughn.Tasks.Lockpicks = {};
Scenes.Vaughn.Tasks.Lockpicks.Available = function() {
	//TODO
	return false;
}
Scenes.Vaughn.Tasks.Lockpicks.OnTask = function() {
	//TODO
	return false;
}

Scenes.Vaughn.Tasks.Lockpicks.Start = function() {
	//TODO
}
