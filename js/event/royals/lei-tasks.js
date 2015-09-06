
Scenes.Lei.Tasks = {};

Scenes.Lei.Tasks.OnTask = function() { //TODO add tasks
	return Scenes.Lei.Tasks.Escort.OnTask();
}

Scenes.Lei.Tasks.AnyTaskAvailable = function() { //TODO add tasks
	return Scenes.Lei.Tasks.Escort.Available();
}

Scenes.Lei.Tasks.StartTask = function() { //TODO add tasks
	if(Scenes.Lei.Tasks.Escort.Available())
		Scenes.Lei.Tasks.Escort.Start();
}

Scenes.Lei.Tasks.TaskPrompt = function() {
	var parse = {
		
	};
	
	Text.Clear();
	Text.Add("You ask Lei if he has any contracts for you.", parse);
	Text.NL();
	if(Scenes.Lei.Tasks.Escort.OnTask()) {
		Scenes.Lei.Tasks.Escort.OnTaskText();
	}
	//TODO add tasks
	else if(lei.Annoyance() > 0) {
		Text.Add("<i>“You botched the last job I gave you, so why should I give you any more?”</i> Lei demands. <i>“When you make such gross errors, it’s not only your reputation that suffers, but mine as well, as I made the apparent mistake in recommending you.”</i> He turns away from you in annoyance.", parse);
		Text.NL();
		Text.Add("Perhaps you could prove that your abilities are worthy of his trust by winning one or two spars against him.", parse);
	}
	else if(Scenes.Lei.Tasks.AnyTaskAvailable()) {
		Scenes.Lei.Tasks.StartTask();
	}
	else {
		Text.Add("<i>“I have nothing for you right now,”</i> Lei says. <i>“Perhaps if you check back at a later time.”</i>", parse);
	}
	Text.Flush();
}


Scenes.Lei.Tasks.Escort = {};
Scenes.Lei.Tasks.Escort.Available = function() {
	if(lei.flags["Met"] >= Lei.Met.OnTaskEscort) return false;
	return true;
}
Scenes.Lei.Tasks.Escort.Eligable = function() {
	return player.level >= 6;
}
Scenes.Lei.Tasks.Escort.OnTask = function() {
	return lei.flags["Met"] == Lei.Met.OnTaskEscort;
}
Scenes.Lei.Tasks.Escort.OnTaskText = function() {
	var parse = {
		
	};
	
	if(lei.taskTimer.Expired()) { // aka missed it
		Text.Add("<i>“Since you’re asking now, despite the fact that you were supposed to meet with the contractor between ten and seventeen, I can only assume you missed it.”</i> Lei scowls at you. <i>“Your first job and you embarrass me already.”</i>", parse);
		Text.NL();
		Text.Add("<i>“At least try not to compound your failure. Speak with Ventor Orellos and see if he still needs you, or if you can make it up to him. Beg on your knees if you have to.”</i>", parse);
		Text.NL();
		Text.Add("You nod, and retreat before his glare.", parse);
		
		lei.annoyance.IncreaseStat(1, 1);
	}
	else {
		parse["date"] = lei.taskTimer.ToHours() <= 17 ? "today" : "tomorrow";
		Text.Add("<i>“I’ve already told you your task,”</i> Lei says, looking mildly annoyed. <i>“Report to Ventor Orellos between ten and seventeen [date] and guard him while he collects money. Very simple.”</i>", parse);
		Text.NL();
		Text.Add("Right. You tell him you just wanted to double-check the details, and thank him for the reminder.", parse);
	}
	Text.Flush();
	Scenes.Lei.InnPrompt();
}

Scenes.Lei.Tasks.Escort.Completed = function() {
	return lei.flags["Met"] >= Lei.Met.CompletedTaskEscort;
}

Scenes.Lei.Tasks.Escort.Coin = function() {
	//TODO
	return 150;
}

Scenes.Lei.Tasks.Escort.Start = function() {
	var parse = {
		coin : Text.NumToText(Scenes.Lei.Tasks.Escort.Coin())
	};
	
	if(Scenes.Lei.Tasks.Escort.Eligable()) {
		Text.Add("<i>“In fact, I do. A contact brought a small task for me. I could not take it on, but I informed her that I had someone in mind for it. It’s suitable for a first job.”</i>", parse);
		Text.NL();
		Text.Add("You idly ask if you’re going to have to kill rats in someone’s basement.", parse);
		Text.NL();
		Text.Add("Lei rolls his eyes. <i>“No, nothing so silly as that. Instead, you will be doing simple escort work,”</i> he explains. <i>“It is not glamorous, but little paying work is. There is always some fool volunteering for any job involving glory, and if there is a volunteer, why pay?”</i> You idly wonder if Aria plans to pay you...", parse);
		Text.NL();
		Text.Add("<i>“You are to meet the merchant Ventor Orellos at his home in the Plaza between ten and seventeen tomorrow, and accompany him as he collects his share of the profits from several establishments.”</i>", parse);
		Text.NL();
		Text.Add("<i>“I have been advised that the proceeds may amount to a significant sum of money, so it would not be surprising if he were attacked if anyone learns of his errand. Your pay upon the completion of the job will be [coin] coins.”</i>", parse);
		Text.NL();
		Text.Add("Does he have any more information?", parse);
		Text.NL();
		Text.Add("<i>“No,”</i> Lei replies. <i>“I do not believe any more is essential, though Ventor may have additional details for you when you meet him.”</i>", parse);
		Text.NL();
		Text.Add("You nod in acceptance. It seems straightforward enough.", parse);
		Text.NL();
		Text.Add("<b>You should meet Ventor Orellos at his home in the Plaza between ten and seventeen tomorrow for an escort job. Don’t be late!</b>", parse);
		
		lei.flags["Met"] = Lei.Met.OnTaskEscort;
		
		var step = world.time.TimeToHour(17);
		lei.taskTimer = new Time(0, 0, step.hour < 12 ? 1 : 0, step.hour, step.minute);
	}
	else {
		Text.Add("He looks you over critically, his eyes roving over your body. <i>“I do not believe you are yet strong enough for any of the contracts I have. You will have to train a little more before I am comfortable recommending you to anyone.”</i>", parse);
		Text.NL();
		Text.Add("You purse your lips, but nod in acceptance. Looks like you’ll have to practice some more first.", parse);
		Text.NL();
		Text.Add("<b>This job requires level 6 to unlock.</b>", parse);
	}
	Text.Flush();
	Scenes.Lei.InnPrompt();
}

/*
Scenes.Lei.Tasks.Escort = {};
Scenes.Lei.Tasks.Escort.Available = function() {
	if(lei.flags["Met"] >= Lei.Met.OnTaskEscort) return false;
	return true;
}
Scenes.Lei.Tasks.Escort.Eligable = function() {
	return player.level >= 6;
}
Scenes.Lei.Tasks.Escort.OnTask = function() {
	return lei.flags["Met"] == Lei.Met.OnTaskEscort;
}
Scenes.Lei.Tasks.Escort.OnTaskText = function() {
	var parse = {
		
	};
	
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.Flush();
}
Scenes.Lei.Tasks.Escort.Completed = function() {
	return lei.flags["Met"] >= Lei.Met.CompletedTaskEscort;
}

Scenes.Lei.Tasks.Escort.Start = function() {
	var parse = {
		
	};
	
	if(Scenes.Lei.Tasks.Escort.Eligable()) {
		Text.Add("", parse);
		Text.NL();
		Text.Add("", parse);
		Text.NL();
		Text.Add("", parse);
	}
	else {
		Text.Add("", parse);
		Text.NL();
		Text.Add("", parse);
	}
	Text.Flush();
	Gui.NextPrompt();
}
 */