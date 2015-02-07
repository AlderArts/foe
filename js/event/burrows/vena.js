/*
 * 
 * Define Vena
 * 
 */

Scenes.Vena = {};

function Vena(storage) {
	Entity.call(this);
	
	this.name              = "Vena";
	
	this.body.DefFemale();
	
	//TODO hermification
	
	this.Butt().virgin = false;
	this.FirstVag().virgin = false;
	this.Butt().buttSize.base = 15;
	
	this.body.SetRace(Race.rabbit);
	
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.rabbit, Color.white);
	
	this.body.SetBodyColor(Color.white);
	
	this.body.SetEyeColor(Color.blue);
	
	this.flags["Met"] = 0; // bitmask
	this.flags["Sex"] = 0; // bitmask
	
	if(storage) this.FromStorage(storage);
}
Vena.prototype = new Entity();
Vena.prototype.constructor = Vena;

Vena.Met = {
	PitFirst : 1,
	Restored : 2
}

Vena.Sex = {
	Fucked   : 1,
	FuckedBy : 2,
	Forced   : 4
}

Vena.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Vena.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

//TODO
Scenes.Vena.RestoreEntrypoint = function(fight) {
	var parse = {
		playername : player.name
	};
	
	vena.flags["Met"] |= Vena.Met.Restored;
	
	ophelia.relation.IncreaseStat(100, 25);
	party.location = world.loc.Burrows.Pit;
	
	Text.Add("There’s an air of anticipation as your party reaches the Pit. Ophelia is in front, smiling giddily and cradling the scepter to her breast, and at least a dozen guards follow behind her. Gradually, the moans and groans of the orgy recede, bunnies pausing mid-coitus as everyone’s attention focuses on you. The procession makes its way down into the center of the Pit, Ophelia stopping and drawing a nervous breath before approaching her mother.", parse);
	Text.NL();
	Text.Add("Vena is, for once, not being fucked by a half dozen of her children. The pregnant matriarch lies curled up in a ball, snuggling peacefully with her latest partners as she takes a much needed nap. The alchemist looks a bit apprehensive as she gently rouses her mother from her slumber, softly caressing her cheek.", parse);
	Text.NL();
	Text.Add("<i>“Finally, I can return you to your old self, mother,”</i> Ophelia whispers fondly, awkwardly patting the matriarch before rising to her feet. Turning to face the captivated audience, the alchemist takes tone and addresses her people. ", parse);
	var comp = party.Num() == 2 ? party.Get(1).name : player.mfTrue("his", "her") + " friends";
	parse["c"] = party.Num() > 1 ? Text.Parse(" and " + comp, parse) : "";
	if(fight) {
		Text.Add("<i>“Brothers and sisters! Lagon’s tyranny is at an end; he’s been brought low through the heroic efforts of [playername][c]. No longer will father’s hateful ambition drive us forward!”</i> The confused rabbits titter nervously among themselves. Surely this is some sort of test; nobody can defeat Lagon…", parse);
		Text.NL();
		Text.Add("<i>“My guards will testify to the truth of this; father has been defeated. And an even grander prize is this!”</i> Ophelia triumphantly raises the scepter over her head.", parse);
	}
	else {
		parse["s"] = party.Num() > 1 ? "s" : "";
		Text.Add("<i>“Brothers and sisters! At my side stands [playername][c], the one[s] who defeated my father! I’ve done my best to lead our people in his absence, but it’s a task outside my capabilities. Thankfully, [playername] has brought us another prize,”</i> Ophelia proclaims, triumphantly raising the scepter over her head.", parse);
	}
	Text.Add(" <i>“With this, Vena can be cured, and things can go back to how they were before!”</i>", parse);
	Text.NL();
	Text.Add("You shift uncomfortably under the unblinking stares of the lagomorphs. Something in your gut tells you that more than a few of them would have been just fine with the old order of things, and the only thing keeping them back is the fact that the undefeated Lagon fell to your hand. You really hope this is going to work.", parse);
	Text.NL();
	Text.Add("<i>“Lagon… gone?”</i> Vena asks, her voice wavering, tears in her eyes as she tries to process the concept. <i>“M-my mate...”</i> Ophelia hugs her, trying to calm her down.", parse);
	Text.NL();
	Text.Add("<i>“Don’t worry, mother. He won’t hurt you anymore.”</i> Catching the anguished note in Vena’s voice, the alchemist hurries to add: <i>“He’s alive and well.”</i> She sounds a little less sure of herself as she disentangles herself from her mother and turns to face you. <i>“W-we did the right thing, didn’t we?”</i> she asks in a small voice.", parse);
	Text.NL();
	Text.Add("You nod resolutely; this was the only way, and Lagon got what he had coming. Now would be a good time to work the scepter’s magic, unless you want another rebellion on your hands. <i>“R-right.”</i> Ophelia gulps, kneeling before the lagomorph matriarch, touching the stone fastened in the scepter to Vena’s forehead. ", parse);
	if(fight)
		Text.Add("<i>“It’s more difficult than with father,”</i> Ophelia scowls in concentration. <i>“Breaking is easier than mending.”</i>", parse);
	else
		Text.Add("<i>“I’ve studied the scroll a thousand times, but actually doing it is different,”</i> Ophelia scowls in concentration.", parse);
	Text.NL();
	Text.Add("You can almost see the memories flit by in Vena’s eyes as the foggy haze on her mind slowly lifts, the stone counteracting the effects of the alchemy. Gradually, the matriarch’s gaze grows clearer and steadier as the scepter works its magic. Ophelia’s eyes are shut in silent prayer as her hands flit over the rod, pressing and turning spots on it in an intricate pattern. Finally, she lets it drop to her side, looking up at her mother apprehensively.", parse);
	Text.NL();
	Text.Add("Vena slowly gets up on her feet and looks around herself in wonder, studying her powerful body and patting her pregnant belly, her gaze wandering over the silent crowd. Realization finally comes when she looks down at her anxious daughter, and her eyes fill with tears. <i>“O-Ophelia, my dear daughter...”</i>", parse);
	Text.NL();
	Text.Add("<i>“Mother!”</i> the lagomorph wails, throwing herself into Vena’s arms, hugging her tightly. A cheer goes up from the surrounding lagomorphs, the tension in the cavern finally cleared. You let out a relieved sigh, relaxing a bit.", parse);
	Text.NL();
	Text.Add("Mother and daughter are gushing over each other, reunited at last after being separated by the veil of alchemy for so long.", parse);
	Text.NL();
	Text.Add("<i>“Tell me everything,”</i> Vena settles down, putting the much smaller rabbit in her lap. The alchemist starts to hastily tell her the tale of how Lagon drugged her and put her here in order to usurp control over the burrows, how he forced Ophelia to further transform Vena in order to breed his army. She is crying freely, blubbering about how sorry she is, how this was all her fault, but Vena hushes her, caressing her hair gently.", parse);
	Text.NL();
	Text.Add("<i>“I know you were not to blame, dear one,”</i> she reassures her gently. <i>“Oh my daughter, the things you’ve had to endure… how could you ever forgive me...”</i>", parse);
	Text.NL();
	Text.Add("<i>“Just having you back is enough,”</i> Ophelia sniffles as she snuggles close, wearing a happy smile. The matriarch waves you closer, patting her daugher on the head.", parse);
	Text.NL();
	Text.Add("<i>“You must be [playername],”</i> she smiles warmly, greeting you. <i>“I don’t know how I could repay you for what you’ve done...”</i> ", parse);
	if(vena.flags["Sex"] != 0)
		Text.Add("Well, you’re sure you can discuss it later. This isn’t exactly the first time you’ve met, so to speak. <i>“Yes, the memories are coming back to me,”</i> she smiles at you fondly. <i>“I’m sure we can pick it up at a more appropriate time, but there are other matters at hand.”</i>", parse);
	else
		Text.Add("You can discuss it later, and perhaps in a better place. <i>“You are of course right, there is an urgent matter to take care of before anything else.”</i>", parse);
	Text.NL();
	Text.Add("Vena turns to her daughter, wiping the tears from her fuzzy cheek. <i>“Ophelia, what of your father?”</i> Suddenly apprehensive, the alchemist lowers her gaze.", parse);
	Text.NL();
	Text.Add("<i>“Even weakened as he is, I- I’m afraid of him. He’s chained up in his throne room for now, but I don’t know what we’ll do with him...”</i> She looks up sadly. <i>“Things can’t return to how they were before, can they?”</i>", parse);
	Text.NL();
	Text.Add("<i>“No, daughter, they can’t,”</i> Vena agrees, shaking her head. Steeling herself, she gets up. <i>“Better get this over with. I think my other children can handle themselves for a while.”</i> Sure enough, the cheery mood in the Pit has lit a new fire in the orgy. The matriarch waves for you to follow her, her daughter hanging on to her arm and her guards close in tow as she heads toward the throne room.", parse);
	Text.Flush();
	
	world.TimeStep({hour: 1});
	Gui.NextPrompt(function() {
		party.location = world.loc.Burrows.Throne;
		
		Text.Clear();
		Text.Add("As you walk, Vena asks terse questions to you and Ophelia, slowly filling herself in on the going-ons in the burrows in her mental absence. Her expression grows grimmer and more determined by the minute. <i>“My mate has a lot to answer for, it seems.”</i>", parse);
		Text.NL();
		Text.Add("Your party finally arrives in the throne room, the eyes of the harem turning to watch you incredulously as Vena strides into the hall. With her new amazonian frame, she strikes quite an impressive figure only accentuated by the massive behemoth hanging between her legs, which draws the hungry eyes of her sons and daughters.", parse);
		Text.NL();
		Text.Add("<i>“Time enough for that later, children,”</i> she waves them away dismissively. <i>“Where is my mate?”</i> One of her sons wordlessly points toward one of the walls, where Lagon is chained. Gathering herself, the lagomorph matriarch walks up to the fallen king. She stands over him; the hulking amazon regarding her mate’s diminished form.", parse);
		Text.NL();
		Text.Add("<i>“Did it have to come to this, love?”</i> she asks sadly. <i>“I often tried to dissuade you of your hubris… why, <b>why</b> could you not have been content with what you had?”</i> Slowly, Lagon raises his head, staring defiantly at Vena.", parse);
		Text.NL();
		Text.Add("<i>“So they’ve managed to drag you back? It seems like my rebellious daughter’s alchemy isn’t what it’s cracked up to be.”</i> He chuckles harshly. <i>“You’re taking the words right out of my mouth.”</i> The broken king turns his gaze toward Ophelia. <i>“Both of you should have stayed put and be content with your lot. You’d never have to worry again, just let go of everything and be my loyal, diligent breeding sluts. Instead, you betrayed me.”</i> His eyes are filled with fury and the alchemist takes a fearful step back, despite the metal chains restraining his body.", parse);
		Text.NL();
		Text.Add("<i>“<b>You</b> betrayed <b>me</b> in pursuit of your mad ambition,”</i> Vena snaps back. <i>“Face it, it’s <b>over</b>. I’ll make sure you never get a chance to rise again.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Oh, and how do you plan to do that? By taking my place? My way is the only way to lead our kind to glory.”</i> Lagon laughs as the matriarch recoils from him, shaken by his words. <i>“It’s still not too late to cower down and return to the Pit, let go of all your worries and let your king rule you again. You know your body craves it.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Mother...”</i> Ophelia grabs Vena’s hand, offering her comfort and strength. Slowly, the amazonian lagomorph recovers her composure.", parse);
		Text.NL();
		Text.Add("<i>“No. Your words are foul poison and I’ll no longer listen to them. You’re no longer the man I loved. You’ve become nothing more than a twisted and spiteful beast.”</i> As the words spill out, her voice grows stronger and more confident. <i>“You’re so worried with your quest for power that you have all but forgotten what really matters. Your family.”</i>", parse);
		Text.NL();
		Text.Add("Lagon bursts out laughing, hysterically. <i>”Family!? Always the simpleton Vena, you could never see what’s beyond the here and now. Always getting in my way. Don’t you see? Our future is on the surface, and the others would never accept our ascension. They would send armies to crush us, unless we crush them first! Are you so stupid you cannot even see this much!?”</i> he asks enraged.", parse);
		Text.NL();
		Text.Add("The lapin recoils at his words, but she easily regains her composure this time. For a moment you catch a glimpse of tears forming in Vena’s eyes as she looks overcome with sadness. But it quickly disappears as her expression turns to one of pity.", parse);
		Text.NL();
		Text.Add("<i>”Your ambition ends here and now, dear; no longer shall our kind strive for mastery over the lands above. You shall remain in chains until I decide what to do with you. Take him away.”</i> Before the stunned Lagon has a chance to respond, she turns her back to him, returning to your side with Ophelia. With a tired expression on her face, the lagomorph matriarch takes her place on her throne as guards drag her mate away.", parse);
		Text.NL();
		Text.Add("<i>“What now, mother?”</i> Ophelia asks, her voice rife with uncertainty.", parse);
		Text.NL();
		Text.Add("<i>“Now, my daughter, we right the wrongs that Lagon has wrought. We rule.”</i> The matriarch turns her eyes to you. <i>“Champion, I don’t know how I can thank you for what you’ve done. You may keep the scepter; I think it will do more good in your hands than in ours. If there’s something you need from us, ask it; if there’s something you need from Lagon’s hoard, it’s yours to take.”</i> She regales you with a smile. <i>“We truly are indebted to you.”</i> Growing more grim, the matriarch adds: <i>“There’s also the matter of my mate. As you were instrumental in his downfall, I’d like to hear your opinion of what should be done with him.”</i>", parse);
		Text.NL();
		Text.Add("<i>“Now, if you'll excuse me, there is much to be done.”</i>", parse);
		Text.NL();
		Text.Add("You leave the lagomorphs to their business, promising that you’ll return once things have quieted down.", parse);
		Text.Flush();
		
		world.TimeStep({hour: 1});
		
		Gui.NextPrompt();
	});
}
