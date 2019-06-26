

// TODO ITEMS

Terry.prototype.ItemUsable = function(item) {
	return true;
}

Terry.prototype.ItemUse = function(item, backPrompt) {
	if(item.isTF) {
		var parse = {
			item : item.sDesc(),
			aItem : item.lDesc(),
			foxvixen : terry.mfPronoun("fox", "vixen")
		};
		parse = terry.ParserPronouns(parse);
		
		if(terry.flags["TF"] & Terry.TF.TriedItem) {
			Text.Add("Terry does as ordered and takes the [item]. [HisHer] collar glows for a moment, but nothing else happens.", parse);
		}
		else {
			Text.Add("You hand Terry [aItem] and tell [himher] to try it. [HeShe] examines the [item] for a moment, before shrugging and moving to take it.", parse);
			Text.NL();
			Text.Add("[HeShe] swallows and you observe a faint, pinkish glow emanating from [hisher] collar, however it quickly fades. After a while, the [foxvixen] shrugs. <i>“So… that was it? I don’t feel any different.”</i>", parse);
			Text.NL();
			Text.Add("Considering what you’ve seen, you can only assume that this has something to do with that collar of [hishers]. It seems like it just isn't going to let you just transform [himher] like that. You'll need to see a specialist about this...", parse);
			Text.NL();
			if(jeanne.flags["Met"] != 0)
				Text.Add("It'd probably be best if you talked to Jeanne; she most likely made the collar, so she should be able to explain what's going on.", parse);
			else
				Text.Add("Given you got this collar from the heirs of the throne in Rigard, the creator of it is probably the Rigard court wizard; talking to him or her may help answer why this just happened.", parse);
		}
		
		terry.flags["TF"] |= Terry.TF.TriedItem;
		
		Text.Flush();
		Gui.NextPrompt(backPrompt);
		
		return {grab : true, consume : true};
	}
	else
		return {grab : false, consume : true};
}

// Need if(terry.flags["TF"] & Terry.TF.TriedItem && !(terry.flags["TF"] & Terry.TF.Rosalin))
Scenes.Terry.RosalinTF = function() {
	var parse = {
		playername : player.name,
		rearsDesc  : function() { return rosalin.EarDesc(true); },
		foxvixen   : terry.mfPronoun("fox", "vixen")
	};
	parse = terry.ParserPronouns(parse);
	parse = rosalin.ParserPronouns(parse, "r");
	
	Text.Clear();
	Text.Add("<i>“Alchemy doesn’t work?”</i> Rosalin’s [rearsDesc] perk in curiosity as [rheshe] studies Terry. The alchemist turns around, quickly whipping together a potion from the ingredients [rheshe] has at hand. <i>“Try this, I want to see it for myself,”</i> [rheshe] urges the [foxvixen], handing [himher] the bottle. Terry looks a bit unsure of about this, but at your nod, [heshe] drinks contents of the offered flask. Just as before, the collar glows pink, and absolutely nothing happens.", parse);
	Text.NL();
	Text.Add("<i>“Hmm,”</i> Rosalin concludes, poking at the offending collar to little effect. <i>“Give me a few minutes, okay?”</i> Terry gulps as the determined alchemist starts pouring ingredients together into a bowl. This one takes significantly longer than the last, and the result is a vile smelling yellow goop.", parse);
	Text.NL();
	Text.Add("<i>“I… I’m supposed to drink that?”</i> Terry falters, shaking [hisher] head fearfully, backing away quickly.", parse);
	Text.NL();
	Text.Add("<i>“For science!”</i> Rosalin proclaims as [rheshe] advances on the poor [foxvixen], catching [himher] off guard and prying open [hisher] mouth, pouring the contents down [hisher] throat before you have a chance to intervene. Terry looks like [heshe] is going to be ill, swaying back and forth in place while smoke pours out of [hisher] mouth, nose and ears. The collar is working overtime, shining so brightly that it almost hurts your eyes. Finally, the reaction seems to wear off. As the smoke settles, you can make out Terry again, unchanged.", parse);
	Text.NL();
	Text.Add("<i>“That is cheating!”</i> Rosalin complains, peeking out from [rhisher] position huddling behind [rhisher] workbench. <i>“That should’ve been enough hair balls to turn a bloody elephant into a housecat!”</i> [rHeShe] turns [rhisher] back on you, throwing ingredients together with newfound fervor, muttering something about magic.", parse);
	Text.NL();
	Text.Add("Terry tugs you away urgently, putting as much distance between you and the alchemist as [heshe] can. <i>“Don’t take me to that crazy person again, okay [playername]?”</i> the thief pleads anxiously, hiding behind you from the vindictive alchemist. <i>“I’m not drinking anything [rheshe] makes, and that’s that!”</i> [HeShe] looks vehement about it; [heshe]’d probably take [hisher] chances with the collar and try to run for it should you force the issue again.", parse);
	Text.Flush();
	
	terry.relation.DecreaseStat(-100, 3);
	world.TimeStep({hour: 1});
	terry.flags["TF"] |= Terry.TF.Rosalin;
	
	Gui.NextPrompt();
}

Scenes.Terry.JeanneTFFirst = function() {
	var parse = {
		foxvixen : terry.mfPronoun("fox", "vixen")
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	Text.Add("You ask Jeanne if she recognizes this collar, pointing at the object in question, sitting secure as always around Terry’s neck.", parse);
	Text.NL();
	Text.Add("<i>“Hmm? Yes, I made it. It is nice, do you not think?”</i> she replies, smiling.", parse);
	Text.NL();
	Text.Add("Yes, she did a wonderful job on it, you assure her. Best to keep her in a good mood for this, after all. You then explain you had a question; you attempted to transform Terry here, but the collar basically stopped the transformation from happening. Is it supposed to do that?", parse);
	Text.NL();
	Text.Add("<i>“Yes, certain transformatives and alchemical substances can interfere with the collar’s magic, something that can have disastrous consequences for the wearer. I have placed an enchantment on it to deal with this kind of risk. If you try to take a transformative while wearing the collar, the collar will nullify all of the item’s transformative properties,”</i> she explains. <i>“If you want to use a transformative, you have to take it off first.”</i>", parse);
	Text.NL();
	Text.Add("Looking at Terry for a moment, you then ask if there is any possible way that you could apply a transformative to Terry without taking the collar off first. ", parse);
	if(terry.Relation() >= 60)
		Text.Add("You trust Terry's loyalty without question, you know [heshe] would never leave you, but the two of you really prefer that [heshe] keeps the collar on.", parse);
	else if(terry.Relation() >= 30)
		Text.Add("Terry's gotten a lot better since you first 'recruited' [himher], but still, you're not entirely certain you'd trust [himher] not to run away if you took the collar off.", parse);
	else
		Text.Add("You have little doubt that if you removed Terry's collar, the [foxvixen] would bolt for freedom, after all.", parse);
	Text.NL();
	Text.Add("<i>“Then I suppose you have a dilemma on your hands,”</i> she states nonchalantly.", parse);
	Text.NL();
	Text.Add("Please, does she have any ideas how to solve this? You're sure someone as smart as her must have some inkling on how to pull it off - you really would appreciate it.", parse);
	Text.NL();
	Text.Add("<i>“Well...”</i> she trails off, tapping her lips. <i>“I can probably come up with something, but it will cost you. I will also need some materials.”</i>", parse);
	Text.NL();
	Text.Add("That's certainly alright with you; it's about what you expected. You thank her for doing this for you, and then ask if there's anything else she needs to tell you about these specialized transformatives.", parse);
	Text.NL();
	Text.Add("<i>“I cannot prepare just any kind of transformative like this, but having some options beats having none, I think. Of course, you could always cave and just remove the collar,”</i> she smiles.", parse);
	Text.NL();
	Text.Add("You tell her that you'll keep that in mind.", parse);
	Text.Flush();
	
	world.TimeStep({minute: 30});
	terry.flags["TF"] |= Terry.TF.Jeanne;
	
	Scenes.Jeanne.Talk();
}

Terry.JeanneTFCost = function() {
	return 50;
}
Scenes.Terry.JeanneTFPrompt = function() {
	var parse = {
		playername : player.name
	};
	parse = terry.ParserPronouns(parse);
	
	//[name]
	var options = new Array();
	
	var AddItem = function(item, scene, name, tooltip, costmult, horseTF) {
		options.push({ nameStr : name || item.name,
			func : function(obj) {
				parse["item"] = obj.str;
				var coin = obj.mult * Terry.JeanneTFCost();
				parse["coin"] = Text.NumToText(coin);
				
				Text.Clear();
				Text.Add("<i>“For that, I will need [item], plus [coin] coins,”</i> she says, showing you a scroll of what she’ll be needing.", parse);
				if(terry.PregHandler().IsPregnant() && item == Items.Testos) {
					Text.NL();
					Text.Add("<i>“Sorry, [playername]. Trying to modify [hisher] womb while [heshe] is still pregnant could have disastrous consequences both for [himher] and the baby. So I am going to have to refuse to do so until Terry has given birth.”</i>", parse);
					Text.NL();
					Text.Add("Jeanne has a point; looks like you’ll have to wait until Terry has [hisher] baby.", parse);
					Text.Flush();
					Scenes.Terry.JeanneTFPrompt();
				}
				else {
					Text.Flush();
					
					var options = new Array();
					options.push({ nameStr : "Craft",
						func : function() {
							world.TimeStep({hour: 1});
							party.coin -= coin;
							party.Inv().RemoveItem(item);
							Scenes.Terry.JeanneTFCraft(obj.item, obj.scene, horseTF);
						}, enabled : party.coin >= coin && party.Inv().QueryNum(item) > 0,
						tooltip : Text.Parse("Craft the potion for [coin] coins.", parse)
					});
					Gui.SetButtonsFromList(options, true, Scenes.Terry.JeanneTFPrompt);
				}
			}, enabled : true,
			obj : {
				str   : item.lDesc(),
				mult  : costmult || 1,
				item  : item,
				scene : scene
			},
			tooltip : tooltip
		});
	};
	
	//TODO items?
	AddItem(Items.Bovia,     Scenes.Terry.JeanneTFGrowBoobs,     "Grow boobs", "", 1);
	AddItem(Items.Lacertium, Scenes.Terry.JeanneTFShrinkBoobs,   "Shrink boobs", "", 1);
	AddItem(Items.Bovia,     Scenes.Terry.JeanneTFStartLactate,  "Lactate+", "", 1);
	AddItem(Items.Lacertium, Scenes.Terry.JeanneTFStopLactate,   "Lactate-", "", 1);
	AddItem(Items.Estros,    Scenes.Terry.JeanneTFGrowVag,       "Add pussy", "", 2);
	AddItem(Items.Testos,    Scenes.Terry.JeanneTFRemVag,        "Rem pussy", "", 1);
	AddItem(Items.Testos,    Scenes.Terry.JeanneTFGrowCock,      "Add cock", "", 2);
	AddItem(Items.Estros,    Scenes.Terry.JeanneTFRemCock,       "Rem cock", "", 1);
	AddItem(Items.Equinium,  Scenes.Terry.JeanneTFGrowHorsecock, "Horsecock", "", 5, true);
	
	Gui.SetButtonsFromList(options, true, Scenes.Jeanne.InteractPrompt);
}

Scenes.Terry.JeanneTFCraft = function(item, scene, horseTF) {
	var parse = {
		playername : player.name,
		lowerArmorDesc : function() { return player.LowerArmorDesc(); },
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		boygirl    : terry.mfPronoun("boy", "girl"),
		boygirl2   : player.mfTrue("boy", "girl"),
		armorDesc  : function() { return terry.ArmorDesc(); },
		terrycock  : function() { return terry.MultiCockDesc(); },
		terrypussy : function() { return terry.FirstVag().Short(); }
	};
	parse = terry.ParserPronouns(parse);
	
	terry.flags["TFd"]++;
	
	Text.Clear();
	Text.Add("Jeanne smiles as she takes the necessary ingredients from you, as well as the coins. <i>“Wait here, I will be right back.”</i>", parse);
	Text.NL();
	Text.Add("The elven mage moves about her room, collecting the materials she’ll need and setting them all up on a clear spot at a table nearby. Jeanne begins by taking the ingredients you’ve given and pouring them all into a bowl. She mixes it until she has worked the mix into an oddly-colored soup. Afterward, she immediately pours the soup into a distill and starts the distilling process with a flick of her finger.", parse);
	Text.NL();
	Text.Add("While waiting for the process to finish, she opens a box nearby and takes out a strange-looking vial. It is about three inches long and one inch thick, ending in a rounded-out tip. She plugs the open vial to the end of the distill and sits back to watch the process conclude.", parse);
	Text.Flush();
	
	//TODO
	Gui.NextPrompt(function() {
		Text.Clear();
		if(horseTF) {
			Text.Add("Once it’s over, she closes the vial and utters something under her breath, making the vial glow briefly. <i>“Sorry, but I cannot really shrink this one, so your [foxvixen] will have to settle for taking a big one this time,”</i> Jeanne explains, handing you the sealed vial.", parse);
		}
		else {
			Text.Add("Once it’s over, she closes the vial and utters something under her breath, making the vial glow and shrink. She tests the seal to make sure it’s solid, then presents it to you. <i>“Here you go.”</i> You accept it, turning it over in your hand. After the magic has done its work, the vial is only a fraction of its former size.", parse);
		}
		
		world.TimeStep({hour : 1});
		
		if(terry.flags["TF"] & Terry.TF.JeanneUsed)
			Text.Add(" You take the capsule and look at Terry.", parse);
		else {
			Text.Add(" You thank her and take the capsule. So… you just feed Terry the capsule? Is that all it takes?", parse);
			Text.NL();
			Text.Add("<i>“Well, if you feed it to [himher] normally the collar will just counteract the transformative again. I did what I could to hide the elements detected by the collar, but the truth is that if the collar detects it, it will still nullify the effects.”</i>", parse);
			Text.NL();
			Text.Add("How are you supposed to give it to [himher] then?", parse);
			Text.NL();
			Text.Add("<i>“Anally,”</i> she says nonchalantly. <i>“That is a suppository, so just shove it in and it will work its magic. Do not worry about the vial itself, the spell on it will dissolve it harmlessly.”</i>", parse);
			Text.NL();
			if(terry.Slut() < 5)
				Text.Add("<i>“What!? I’m not shoving that up my ass!”</i> Terry immediately protests.", parse);
			else if(terry.Slut() < 30)
				Text.Add("<i>“Tch, at least it won’t be as bad as a dick….”</i> Terry mumbles, not thrilled by the idea at all.", parse);
			else {
				Text.Add("<i>“Well, if that’s what it takes, I suppose I’m fine with it. Not like I haven’t taken bigger.”</i>", parse);
				Text.NL();
				Text.Add("<i>“Oh? Would you like me to increase its size? I can make it as big as-”</i> Jeanne starts.", parse);
				Text.NL();
				Text.Add("<i>“Small is fine!”</i> Terry interrupts Jeanne. The elven mage just shrugs.", parse);
			}
			Text.NL();
			Text.Add("You thank Jeanne once again; applying this should be interesting…", parse);
		}
		Text.NL();
		
		terry.flags["TF"] |= Terry.TF.JeanneUsed;
		
		if(terry.Slut() < 5) {
			Text.Add("<i>“Do I really have to?”</i>", parse);
			Text.NL();
			Text.Add("<i>“It’s an order,”</i> you reply. As soon as you say the words, the collar tightens in warning, a faint glow emanating from the enchanted leather.", parse);
			Text.NL();
			Text.Add("Terry sighs in defeat. <i>“I hate this...”</i> [heshe] mumbles. Without further ado, [heshe] begins stripping off [hisher] [armorDesc].", parse);
		}
		else if(terry.Slut() < 30) {
			Text.Add("The [foxvixen] rolls [hisher] eyes, but complies with the unspoken command. [HeShe] strips off [hisher] [armorDesc]. <i>“Let’s just get this over with...”</i>", parse);
		}
		else {
			Text.Add("<i>“Alright, no need to say anything,”</i> [heshe] raises a hand, waving dismissively as [heshe] begins undoing [hisher] [armorDesc].", parse);
		}
		Text.NL();
		Text.Add("You watch patiently as Terry removes the last of [hisher] clothes and folds them carefully, setting them aside. Turning to look at you expectantly, [heshe] says. <i>“I’m ready… now what?”</i>", parse);
		Text.NL();
		if(terry.Relation() + terry.Slut() >= 60) {
			parse["milkdripping"] = terry.Lactation() ? " milk-dripping" : "";
			Text.Add("There’s a definite air of excitement in the [foxvixen]’s body language,[milkdripping] nipples erect through [hisher] fur.", parse);
			if(terry.FirstCock())
				Text.Add(" [HisHer] [terrycock] is jutting out of its sheath, as if in anticipation.", parse);
			if(terry.FirstVag())
				Text.Add(" [HisHer] [terrypussy] is visibly wet, a small stream leaking down the inside of [hisher] thighs.", parse);
			Text.NL();
			Text.Add("Looks like your little [foxvixen] is looking forward to doing some bodywork, you quip, reaching out to affectionately tussle [hisher] ears,", parse);
			Text.NL();
			if(terry.Relation() >= 60) {
				Text.Add("<i>“You can’t expect me to strip in front of my [boygirl2]friend and <b>not</b> get at least a bit antsy,”</i> [heshe] says, flustered and pouting as [heshe] averts [hisher] gaze in embarrassment.", parse);
				Text.NL();
				Text.Add("Smiling at [hisher] confession, you gently lift [hisher] chin and steal a quick kiss, assuring [himher] that’s part of [hisher] considerable charms. [HeShe] smiles at that, tail wagging softly behind.", parse);
			}
			else {
				Text.Add("<i>“So what if I am? It’s your fault I’m like this...”</i> [heshe] mumbles, averting [hisher] gaze with a slight frown.", parse);
				Text.NL();
				Text.Add("You just smirk and shake your head good-naturedly; [hisher] lips may say one thing, but [hisher] body tells the real story, no matter how much the [foxvixen] may want to deny it.", parse);
				Text.NL();
				Text.Add("<i>“That’s not...”</i> [heshe] starts, but quickly falls silent with a resigned sigh. <i>“Look, are you going to get on with it or are you just here to bully me?”</i> [heshe] asks indignantly.", parse);
			}
			Text.NL();
		}
		Text.Add("With one hand on [hisher] hip and the other on [hisher] shoulder, it’s a matter of moments for you to gently spin Terry around and give [himher] a soft push. Effortlessly, the vulpine morph falls forward onto [hisher] knees. Another careful prod and a command is all you need to make [himher] go on fours, tail swept aside around [hisher] hip and buttocks raised slightly for better access to [hisher] tailhole. <i>“O-okay, please be gentle.”</i>", parse);
		Text.NL();
		if(terry.flags["TFd"] > 5)
			Text.Add("Playfully, you chide [himher]; you’re always kind to your special [foxvixen], [heshe] knows that.", parse);
		else
			Text.Add("You assure [himher] that you’ll be as tender as you can.", parse);
		Text.NL();
		Text.Add("Kneeling down for a better view, you admire the shapely, feminine ass now lifted before you. Terry’s tail twitches, and unthinkingly, you move to stroke the long appendage with its soft, fluffy fur. A few caresses of the plush tail, and then it’s back to business. You resume studying Terry’s butt, your gaze drawn to the pronounced love-heart shape of pure gold set against the creamy white of the rest of [hisher] ass cheeks.", parse);
		Text.NL();
		
		if(terry.flags["BM"] == 0) {
			terry.flags["BM"] = 1;
			Text.Add("You can’t resist teasing Terry about [hisher] ‘birthmark’; who’d have thought [heshe] would have something so cute on [hisher] body, nevermind it being there of all places?", parse);
			Text.NL();
			Text.Add("<i>“S-stop teasing me- Ah!”</i> [HeShe] jumps when you touch the patch. <i>“Don’t touch it! It’s embarrassing!”</i> the [foxvixen] protests weakly, cheeks burning so hot that you can feel the heat from this distance.", parse);
			Text.NL();
			Text.Add("Seems like you found a weak spot, you think to yourself. ", parse);
		}
		else {
			var scenes = new EncounterTable();
			scenes.AddEnc(function() {
				Text.Add("Unable to resist yourself, you poke [himher] playfully right in the center of the heart-shape, feeling [hisher] buttflesh giving under the pressure of your finger.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("You gently trail your finger around the heart’s shape, following the lines until you have traced the shape completely.", parse);
			}, 1.0, function() { return true; });
			scenes.AddEnc(function() {
				Text.Add("Struck by an impulse, you bend in closer and plant a soft kiss on the golden-furred patch.", parse);
			}, 1.0, function() { return true; });
			scenes.Get();
			
			Text.NL();
			Text.Add("[HeShe] gasps softly at your touch. <i>“Don’t tease me like that!”</i> [heshe] protests.", parse);
			Text.NL();
			Text.Add("With a soft chuckle at how worked up [heshe] can get over something so small, you offer the [foxvixen] a half-hearted apology, asserting that you just couldn’t resist such a tempting target.", parse);
			Text.NL();
			Text.Add("<i>“Meanie...”</i>", parse);
		}
		Text.NL();
		Text.Add("<i>“This might help,”</i> Jeanne says, handing you a small tube with a clear gel inside. You thank her for the lube as she steps away. Now then… time to get started.", parse);
		Text.NL();
		Text.Add("Applying lube to your fingers, you begin to softly massage Terry’s tailhole, tracing your gel-caked digits around and around [hisher] ring before starting to working your fingertips inside. The [foxvixen]’s tail flutters as [heshe] represses the urge to wave it, whole body shivering from your touch even as [heshe] bites back any sounds of pleasure. As the lube begins to work and more and more of your digit slides inside, you start to pump away, getting [himher] ready for the insertion you’ll be making shortly.", parse);
		if(terry.FirstCock())
			Text.Add(" You have a front-row seat to watch Terry’s [terrycock] grow to full mast, hard and aching to be used.", parse);
		if(terry.FirstVag())
			Text.Add(" From where you are, you can see quite clearly as Terry’s [terrypussy] flushes with arousal, netherlips growing more prominent through [hisher] fur, aroused fluids starting to drip from its folds.", parse);
		Text.NL();
		Text.Add("Looks like [heshe]’s enjoying [himher]self, you say, smiling even as you continue to finger the [foxvixen].", parse);
		Text.NL();
		if(terry.Slut() < 30) {
			Text.Add("<i>“J-just shut it and get this done with!”</i> [heshe] quips back.", parse);
			Text.NL();
			Text.Add("Temper, temper, you chide [himher]. Still, you have other things to do, so you focus your attention on finishing the lubing. Plenty of time to tease Terry later.", parse);
		}
		else {
			Text.Add("<i>“Yeah… it feels nice,”</i> [heshe] admits.", parse);
			if(terry.Relation() >= 60) {
				Text.Add(" <i>“We should continue this later, alone,”</i> [heshe] says, casting a glance at the smiling Jeanne.", parse);
				Text.NL();
				Text.Add("You smirk and inform [himher] that you’ll hold [himher] up to that, leisurely continuing to lube Terry’s asshole.", parse);
			}
		}
		Text.NL();
		Text.Add("Finally, you deem Terry’s tush to be as ready as it’ll ever be. Giving Jeanne back her lube, you reach for the transformative suppository she gave you earlier, align it with Terry’s anus, and start to gently push it against [hisher] pucker.", parse);
		Text.NL();
		
		Gui.Callstack.push(function() {
			Text.NL();
			Text.Add("The [foxvixen] gets up on [hisher], awaiting whatever effect the suppository is supposed to have on [himher]self.", parse);
			Text.Flush();
			
			Gui.NextPrompt(scene);
		});
		
		if(horseTF) {
			Text.Add("<i>“I-it’s too big!”</i> Terry protests as you try to shove the suppository up [hisher] butt.", parse);
			Text.NL();
			Text.Add("You try your best to comfort the [foxvixen] and get [himher] to relax, but it’s no use. Terry is just too tense to take this one, even though you stretched [himher] out just moments ago. If [heshe] doesn’t relax, you’re never getting this inside.", parse);
			Text.NL();
			Text.Add("Sighing, you stop for a moment, considering your options. Finally, an idea pops in your head. This should stretch [himher] nicely. ", parse);
			
			var cocksInAss = player.CocksThatFit(terry.Butt());
			var p1Cock     = player.BiggestCock(cocksInAss);
			
			parse["multiCockDesc"] = function() { return player.MultiCockDesc(); }
			parse["cockDesc"]      = function() { return p1Cock.Short(); }
				
			if(p1Cock) {
				Text.Add("You strip your [lowerArmorDesc], exposing your [multiCockDesc] to air.", parse);
				Text.NL();
				Text.Add("<i>“[playername], what are you…!?”</i> [heshe] suddenly gasps as you nestle your [cockDesc] against [hisher] rosebud. <i>“Here!? You’re going to take me here, of all places?”</i>", parse);
				Text.NL();
				Text.Add("Yes, you have to stretch [himher] out. Besides, it’s not like Jeanne would mind, would she?", parse);
				Text.NL();
				Text.Add("<i>“Do not mind me,”</i> the elven mage replies, taking a seat on a nearby chair, studying the fox intently.", parse);
				Text.NL();
				Text.Add("It’s settled then.", parse);
			}
			else {
				Text.Add("You ask if Jeanne has a strap-on you could use.", parse);
				Text.NL();
				Text.Add("<i>“What!?”</i> Terry protests.", parse);
				Text.NL();
				Text.Add("<i>“Sure,”</i> she replies, walking to a chest nearby.", parse);
				Text.NL();
				Text.Add("<i>“You can’t be serious, [playername]! You’re going to take me? Here of all places?”</i>", parse);
				Text.NL();
				Text.Add("Yes, you have to stretch [himher] out. Besides, it’s not like Jeanne would mind, would she?", parse);
				Text.NL();
				Text.Add("<i>“Do not mind me,”</i> the elven mage replies, taking a seat on a nearby chair, studying the fox intently.", parse);
				Text.NL();
				Text.Add("It’s settled then. You strip off your [lowerArmorDesc] and attach the strap-on, making sure it won’t come loose. Now, about Terry’s butt...", parse);
				p1Cock = Items.StrapOn.PlainStrapon.cock;
			}
			Text.NL();
			
			Scenes.Terry.SexFuckButtEntrypoint(p1Cock, false, function(rough) {
				Text.Add("There, now [heshe]’s all stretched up, you proudly declare, working the tip of the big suppository into [hisher] butt. ", parse);
				if(rough) {
					Text.Add("<i>“That works, I suppose,”</i> Jeanne muses, huffing as she adjusts her gown, unabashedly licking her drenched fingers clean. <i>“Was it really necessary to be that rough, though?”</i> She really shouldn’t be one to talk. While you had your own fun, the court magician has been playing with some toys out of her collection, eyeing Terry lustfully; looks like she really enjoyed the show.", parse);
					Text.NL();
					Text.Add("<i>“[playername],”</i> the [foxvixen] grunts. <i>“Ya big jerk!”</i> [heshe] exclaims, moaning as you manage to insert the first few inches. <i>“Not only did you fuck me in front of - Aah! - her, but did you really have to be so rough!”</i>", parse);
					Text.NL();
					if(terry.Slut() < 60) {
						Text.Add("Yes. With Terry’s cute tush in full display before you… why, asking you to hold back is just asking too much! No, a glorious butt like the one [heshe] has was just made to be fucked raw, and you’re more than happy to oblige!", parse);
						Text.NL();
						Text.Add("<i>“...You...”</i> Terry starts, but doesn’t finish. You can tell the [foxvixen] is embarrassed at your comment. [HeShe]’s really a sucker for compliments, isn’t [heshe]?", parse);
					}
					else {
						Text.Add("Funny, you don’t remember hearing [himher] complain while you were doing it.", parse);
						Text.NL();
						Text.Add("<i>“You - ah! - didn’t give me a chance to.”</i>", parse);
						Text.NL();
						Text.Add("Chuckling, you reply that [heshe]’s right. [HeShe] really couldn’t hope to say otherwise in-between [hisher] moaning about how good it felt - nor [hisher] cries of enjoyment.", parse);
						Text.NL();
						Text.Add("<i>“S-stop it!”</i> Terry protests, cheeks flushing with embarrassment. You can see them redden just a bit, even though [hisher] fur does a good job of hiding it.", parse);
						Text.NL();
						Text.Add("Oh Terry… [heshe]’s just so fun to tease...", parse);
					}
				}
				else {
					Text.Add("<i>“A novel enough technique,”</i> Jeanne muses, idly playing with herself as she watches you.", parse);
					Text.NL();
					Text.Add("<i>“[playername],”</i> the [foxvixen] says with a groan. <i>“You fucked me in front of- Aah!”</i> [heshe] says, moaning as you manage to insert the first few inches.", parse);
					Text.NL();
					if(terry.Slut() < 60) {
						Text.Add("You simply chuckle. It’s not like it was a big deal. You enjoyed yourself, Terry enjoyed [himher]self, and Jeanne got a good show. Think about it; was it really that bad indulging in front of an audience?", parse);
						Text.NL();
						Text.Add("<i>“I-I guess not.”</i>", parse);
						Text.NL();
						Text.Add("You pet the [foxvixen] lightly in response.", parse);
						terry.slut.IncreaseStat(60, 1);
					}
					else {
						Text.Add("You laugh at what [heshe] was about to say. Come on… you know [himher] better than that. It’s not like the [foxvixen] even cares if you do it in public. Once you get [himher] going, there’s just no stopping [himher].", parse);
						Text.NL();
						Text.Add("<i>“...Alright, alright, I get it. No need to rub it in, but do I really need to remind you that it was <b>you</b> who made me this way?”</i>", parse);
						Text.NL();
						Text.Add("Of course not, but you couldn’t help keeping your hands off [himher] either. Maybe it’s [hisher] own fault for being so damn fuckable…", parse);
						Text.NL();
						Text.Add("If Terry didn’t have any fur, you’d think [heshe] was blushing. <i>“Um… I’m not sure how to respond that...”</i>", parse);
						Text.NL();
						Text.Add("No need to dwell on it. You knew [heshe]’d make a great pet, and you’re glad you got [himher] to come with you.", parse);
						terry.relation.IncreaseStat(100, 1);
					}
				}
				if(terry.Relation() >= 60) {
					Text.Add(" <i>“I love you,”</i> [heshe] adds.", parse);
					Text.NL();
					Text.Add("Yes, of course [heshe] does. You love [himher] too, you reply. Now if [heshe]’ll be a good [boygirl] and take all of [hisher] medicine?", parse);
				}
				else {
					Text.NL();
					if(rough)
						Text.Add("<i>“Doesn’t - oh! - make you any less of a jerk,”</i> [heshe] quips.", parse);
					else
						Text.Add("<i>“Doesn’t - oh! - make you any less of a perv, you horndog.”</i> [heshe] quips.", parse);
					Text.NL();
					Text.Add("Maybe so... but right now you need [himher] to be a good [boygirl] and take all of [hisher] medicine.", parse);
				}
				Text.NL();
				Text.Add("Your only reply is a lusty moan as you manage to cram in a few more inches.", parse);
				Text.NL();
				Text.Add("Once you manage to get the other end of the vial past [hisher] sphincter, Terry groans and suddenly clenches [hisher] butt, a couple inches of the suppository escaping from [hisher] used butthole. Seeing no other reasonable way to push this in effectively, you align the tip of your [cockDesc] with the vial and thrust.", parse);
				Text.NL();
				Text.Add("Terry howls in a mixture of pain and pleasure as [hisher] butt is stretched both by the large capsule and your [cockDesc], the magic within the vial finally activating and drilling itself inside Terry’s guts. Success!", parse);
				Text.NL();
				Text.Add("<i>“Owowow! What happened to being gentle!?”</i> the [foxvixen] protests.", parse);
				Text.NL();
				Text.Add("You wouldn’t have had to do this if [heshe] wasn’t being so stubborn about taking the suppository, besides it’s not like [heshe] didn’t enjoy it, you point out.", parse);
				Text.NL();
				Text.Add("Despite having climaxed only moments ago", parse);
				if(terry.FirstVag())
					Text.Add(" [hisher] [terrypussy] is already puffed up in full arousal, wet with [hisher] juices", parse);
				if(terry.FirstVag() && terry.FirstCock())
					Text.Add(", and", parse);
				if(terry.FirstCock())
					Text.Add(" [hisher] [terrycock] is fully erect, dripping pre", parse);
				Text.Add(".", parse);
				Text.NL();
				Text.Add("Terry flushes in embarrassment, averting [hisher] eyes. <i>“You really are a big meanie,”</i> [heshe] pouts.", parse);
				Text.NL();
				parse["armorDesc"] = function() { return player.ArmorDesc(); }
				Text.Add("Extricating your [cockDesc], you pat [himher] gently on the flank and inform [himher] that you’re all done. Having said that, you move to clean up and put your [armorDesc] back on.", parse);
				PrintDefaultOptions();
			});
		}
		else {
			Text.Add("With a groan of arousal, Terry arches [hisher] back in unthinking pleasure as it glides smoothly inside, your fingers following it as deeply as you can fit them. Finally, you are inside [himher] to the knuckle, but you can feel the capsule continue gliding inwards, making course for Terry’s stomach.", parse);
			Text.NL();
			Text.Add("Extricating your digits, you pat the [foxvixen] tenderly on the flank and inform [himher] that you’re all done.", parse);
			PrintDefaultOptions();
		}
	});
}

Scenes.Terry.JeanneTFGrowBoobs = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		terrycock  : function() { return terry.MultiCockDesc(); }
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.Cup() <= Terry.Breasts.Flat) {
		Text.Add("The naked [foxvixen] twitches, looking down in surprise at [hisher] chest as the transformative’s effects begin taking hold. [HisHer] nipples perk up, though who can say if from arousal or the magic, like little cherry-pink nubs through Terry’s fur. Terry groans softly at the sensation, [hisher] formerly flat chest begins to bulk up; fat visibly swelling into being underneath the skin and fur and pushing [hisher] buds outwards. Within moments, what was a flat chest is now sporting a dainty pair of feminine A-cup breasts.", parse);
		Text.NL();
		Text.Add("The [foxvixen] pants, as [heshe] recovers from the transformation. Then [heshe] slowly rises to [hisher] feet, experimentally pinching a nipple and gasping as [heshe] does so. <i>“Sensitive...”</i> [heshe] comments under [hisher] breath.", parse);
		Text.NL();
		Text.Add("Now that’s too tempting to pass up. Without hesitation, your hands reach for your vulpine pet’s new bosom, gently stroking each of the new A-cups in turn, squeezing the plush flesh through its soft fur before caressing [hisher] erect nipples with your thumbs.", parse);
		Text.NL();
		Text.Add("Terry gasps and quickly moves to bat your hands away. <i>“S-stop it!”</i> [heshe] protests weakly.", parse);
		
		terry.flags["breasts"] = Terry.Breasts.Acup;
		terry.SetBreasts();
	}
	else if(terry.Cup() == Terry.Breasts.Acup) {
		Text.Add("A soft whimper escapes Terry’s throat, nipples perking up as [hisher] small bosom quivers before starting to grow. A pleased murmur bubbles from the [foxvixen]’s throat as they swell outwards, stopping only after [heshe] has acquired a perky pair of B-cup breasts.", parse);
		Text.NL();
		Text.Add("Terry is left panting as [hisher] transformation reaches an end. [HeShe] cups [hisher] newly grown breasts, testing them momentarily as [heshe] rises to [hisher] feet.", parse);
		Text.NL();
		Text.Add("Nodding your head appreciatively, you idly compliment Terry on how good [heshe] looks with them. Not so big as to be obtrusive, but definitely enhancing [hisher] womanly charms.", parse);
		Text.NL();
		if(terry.Relation() < 60) {
			Text.Add("<i>“I’m not a girl...”</i> [heshe] protests weakly.", parse);
			Text.NL();
			Text.Add("The breasts [heshe] has certainly don’t make [himher] look very manly - not that [heshe] ever did, of course - but you let the [foxvixen] insist otherwise, for [hisher] peace of mind.", parse);
		}
		else {
			Text.Add("<i>“Um… thanks, I guess...”</i>", parse);
			Text.NL();
			Text.Add("With a smile, you assure [himher] that you’d be happy to help [himher] give them a test run, if ever [heshe] feels like it.", parse);
		}
		
		terry.flags["breasts"] = Terry.Breasts.Bcup;
		terry.SetBreasts();
	}
	else if(terry.Cup() == Terry.Breasts.Bcup) {
		Text.Add("Terry’s head falls back and [heshe] moans softly, bosom quivering as the transformative goes to work. Nipples hard as diamond, jutting blatantly through the fur, you watch as the perky orbs balloon outwards, swelling into plush, proud C-cups, with just the right amount of sag. Terry truly looks like a woman at any casual glance, with an hourglass figure that many women would kill to have.", parse);
		if(terry.FirstCock())
			Text.Add(" Even knowing about the [terrycock] hanging between [hisher] legs, if [heshe] were covered, you doubt anyone would notice it at a first glance in [hisher] usual clothes.", parse);
		Text.NL();
		Text.Add("Terry pants, watching [hisher] own chest rise and fall. [HeShe] cups [hisher] pillowy breasts, testing their weight. Slowly, [heshe] rises to [hisher] feet, [hisher] expression one of confusion. Your eyes meet and you can tell [heshe]’s not too sure about this development.", parse);
		Text.NL();
		Text.Add("Well, you know one way to convince [himher]. Closing the distance between you, your hands reach out and gently cup [hisher] newly amplified bosom. Massaging the pillowing flesh with your fingers, you begin kneading [hisher] nipples and caressing the sensitive titflesh.", parse);
		Text.NL();
		if(terry.Relation() < 30) {
			Text.Add("For a moment, the [foxvixen] pushes [hisher] chest against your hands, as if enjoying your caress, but then [heshe] gasps and quickly jumps back. <i>“Don’t touch them!”</i> [heshe] protests.", parse);
			Text.NL();
			Text.Add("Certainly looked to you like [heshe] was enjoying it, but you hold your peace. You know [heshe]’ll come around and admit the truth eventually; you just need to be patient with [himher] until then.", parse);
		}
		else if(terry.Relation() < 60) {
			Text.Add("Terry’s expression is one of discomfort, but even so, [heshe] doesn’t move away from your touch. Instead, [heshe] just stands there while you inspect [hisher] new growth; a soft sigh of pleasure escaping [himher] as you finish.", parse);
			Text.NL();
			Text.Add("You’re a little disappointed at the lack of reaction, but at least [heshe]’s not actively fighting you away anymore. Little steps lead to big rewards, after all.", parse);
		}
		else {
			Text.Add("Terry moans softly as you caress [hisher] newly grown breasts. [HeShe] thrusts [hisher] chest out to allow you full access. <i>“Do you like them?”</i> [heshe] asks, looking at you expectantly.", parse);
			Text.NL();
			Text.Add("You smile back and playfully kiss [himher] right on the closest nipple, a soft girly squeak of pleasure and surprise escaping Terry’s mouth. You glance up at [himher] and see the [foxvixen] openly grinning, clearly pleased by your approval.", parse);
		}
		terry.flags["breasts"] = Terry.Breasts.Ccup;
		terry.SetBreasts();
	}
	else if(terry.Cup() == Terry.Breasts.Ccup) {
		Text.Add("Terry arches [hisher] back and moans in pleasure, unthinkingly thrusting out [hisher] bosom and emphasizing its sudden growth spurt. Before your eyes, the former C-cups balloon into large, luscious D-cups, looking even larger than they actually are on Terry’s otherwise petite and graceful build.", parse);
		Text.NL();
		Text.Add("Even with the [foxvixen]’s small frame exaggerating every quiver and quake of them, they are truly enticing. Before Terry can think of clambering back to [hisher] feet, you move to touch them. They’re just as soft and inviting as they look; downy fur covering ample flesh that’s got just the right amount of give to it. Yes, groping these is going to be a very enjoyable experience, for both of you.", parse);
		Text.NL();
		Text.Add("Giving them a last appreciative squeeze for luck, you let Terry’s tits go and offer the [foxvixen] a hand. ", parse);
		if(terry.Relation() < 30)
			Text.Add("Terry ignores your offer of help and gets back on [hisher] feet on [hisher] own.", parse);
		else
			Text.Add("Terry takes it, and you help [himher] back to [hisher] feet.", parse);
		Text.Add(" <i>“They’re heavy,”</i> the [foxvixen] idly comments.", parse);
		Text.NL();
		Text.Add("That may be so, you reply, but they most assuredly look great on [himher]; [heshe] really pulls them off well. You think you’d be hard-pressed to find another [foxvixen] anywhere near Rigard who looks as good as [heshe] does.", parse);
		Text.NL();
		if(terry.Relation() < 60)
			Text.Add("Terry looks away, clearly embarrassed by your compliment.", parse);
		else
			Text.Add("Terry looks at you, a soft smile on [hisher] lips.", parse);
		terry.flags["breasts"] = Terry.Breasts.Dcup;
		terry.SetBreasts();
	}
	else {
		Text.Add("Terry gasps and moans, panting as [hisher] tits begin their now familiar ballooning routine, swelling out into heaving E-cups... but then, rather than stopping, they keep on growing! Terry whimpers in panic as they continue to bloat, swelling down and out over [hisher] stomach. Inches passing like seconds, they reach F-cup size, almost as big as [hisher] head, and then they grow into G-cups and are <i>bigger</i> than [hisher] head... just how big is [heshe] going to get...?", parse);
		Text.NL();
		Text.Add("As soon as you pass the thought, however, the [foxvixen]’s boobs stop their dramatic expansion, quivering atop Terry’s chest. And then, even faster than they grew before, they start to shrink, deflating rapidly until Terry is left with [hisher] former D-cup cleavage, much to [hisher] evident relief.", parse);
		Text.NL();
		Text.Add("<i>“Do you not think you have gone far enough, [playername]?”</i> Jeanne comments reproachfully.", parse);
		Text.NL();
		Text.Add("Biting back any possible sarcastic quips, you idly agree and move to help the shivering [foxvixen] to [hisher] feet. You’ll need to remember that [heshe] is as busty as [heshe]’s going to get, otherwise you’ll just be wasting money and ingredients. You ask Terry if [heshe]’s alright.", parse);
		Text.NL();
		Text.Add("[HeShe] nods, hugging [hisher] chest as [heshe] gets over what just happened. <i>“Please. Don’t make me go through that again.”</i>", parse);
		terry.flags["breasts"] = Terry.Breasts.Dcup;
		terry.SetBreasts();
		
		terry.relation.DecreaseStat(0, 3);
	}
	Text.Flush();
	
	Scenes.Jeanne.InteractPrompt();
}

Scenes.Terry.JeanneTFShrinkBoobs = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen")
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.Cup() >= Terry.Breasts.Dcup) {
		Text.Add("Terry gasps, arching [hisher] back with a moan, bosom thrusting unconsciously forward. Before your eyes, the luscious D-cups quiver and then start to dwindle, shrinking in on themselves until Terry has lost a full cup-size, leaving [himher] with a more manageable C-cup bustline.", parse);
		Text.NL();
		Text.Add("The [foxvixen] hefts [hisher] reduced boobs, testing them. <i>“Well, that’s certainly a load off my back,”</i> [heshe] states. <i>“Personally, I was way too big previously. It’s nice to have them be a little smaller again.”</i>", parse);
		Text.NL();
		Text.Add("You nod your head absently, noting that you’re happy that Terry is happier with [hisher] new breasts.", parse);
		
		terry.flags["breasts"] = Terry.Breasts.Ccup;
		terry.SetBreasts();
	}
	else if(terry.Cup() == Terry.Breasts.Ccup) {
		Text.Add("A mewl escapes Terry’s throat as [hisher] C-cups quiver visibly, unconsciously arching [hisher] back and making it more prominent as they shrink. By the time they stop, the [foxvixen] is sporting a new B-cup bustline.", parse);
		Text.NL();
		Text.Add("[HeShe] massages [hisher] boobs experimentally. <i>“I guess smaller breasts are more manageable...”</i> [heshe] mumbles. You get the feeling that [heshe]’s a bit disappointed at [hisher] reduced bust.", parse);
		Text.NL();
		Text.Add("Deciding not to raise the matter directly, you simply give Terry an idle agreement with [hisher] statement. Privately, you’re certain [heshe]’ll get over it soon enough.", parse);
		
		terry.flags["breasts"] = Terry.Breasts.Bcup;
		terry.SetBreasts();
	}
	else if(terry.Cup() == Terry.Breasts.Bcup) {
		Text.Add("The [foxvixen]’s eyes sink closed with a luxuriant groan, B-cups visibly shrinking away and not stopping until [heshe]’s left with a humble A-cup bustline.", parse);
		Text.NL();
		Text.Add("Terry checks out [hisher] perky breasts. <i>“Guess I don’t really have to worry about them sagging anymore now.”</i>", parse);
		Text.NL();
		Text.Add("That’s certainly true, you quip back.", parse);
		
		terry.flags["breasts"] = Terry.Breasts.Acup;
		terry.SetBreasts();
	}
	else if(terry.Cup() == Terry.Breasts.Acup) {
		Text.Add("With a single moan, Terry’s bustline rapidly shrinks away, within seconds leaving [himher] with [hisher] original daintily flat chest.", parse);
		Text.NL();
		Text.Add("<i>“Guess I won’t have to worry so much about protecting my chest now, at least not more than usual,”</i> the [foxvixen] states.", parse);
		if(terry.Lactation())
			Text.Add(" <i>“And I won’t have to worry anymore about draining my breasts,”</i> [heshe] adds.", parse);
		Text.NL();
		Text.Add("That certainly seems to be the case, you agree.", parse);
		
		terry.flags["breasts"] = Terry.Breasts.Flat;
		terry.flags["lact"] = 0;
		terry.SetBreasts();
		terry.SetLactation();
	}
	else {
		Text.Add("Long, silent moments tick by, and not a thing happens. Terry pokes [hisher] chest experimentally and then shrugs, clearly unsure what to say. You feel very foolish; what were you expecting to happen, giving a breast-reducer to someone without breasts to reduce?", parse);
		
		terry.flags["breasts"] = Terry.Breasts.Flat;
		terry.flags["lact"] = 0;
		terry.SetBreasts();
		terry.SetLactation();
	}
	Text.Flush();
	
	Scenes.Jeanne.InteractPrompt();
}

Scenes.Terry.JeanneTFStartLactate = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		terrybreasts : function() { return terry.FirstBreastRow().Short(); }
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.Lactation()) {
		Text.Add("Terry cringes, the [foxvixen]’s lips instinctively curled back over [hisher] teeth in a nervous snarl as [hisher] nipples perk up through the fur, breasts visibly quivering. [HeShe] whimpers, hands reaching up to tenderly cradle [hisher] [terrybreasts], then [heshe] throws [hisher] head back in a primal scream as, out of nowhere, [hisher] teats unleash a cascade of vulpine milk.", parse);
		Text.NL();
		Text.Add("As close as you are, you can do nothing to keep yourself from getting hosed down as Terry becomes a veritable milk-fountain. Fortunately, it’s only temporary, and the streams die away after a few moments, leaving only the white streaks painted over your body and Terry’s swollen-looking nipples as sign of what lurks inside [hisher] breasts.", parse);
		Text.NL();
		Text.Add("The court magician giggles. ", parse);
		if(terry.flags["xLact"] == 0)
			Text.Add("<i>“I suppose that is what you get for trying to make a lactating [foxvixen] lactate; I could get used to watching this,”</i> she teases.", parse);
		else if(terry.flags["xLact"] <= 3)
			Text.Add("<i>“You must really enjoy getting drenched in breast milk, hrm?”</i>  she teases.", parse);
		else if(terry.flags["xLact"] <= 6)
			Text.Add("<i>“I admit this was amusing the first few times, but do you not think [heshe] has had enough?”</i> she comments.", parse);
		else
			Text.Add("<i>“Will you ever learn your lesson?”</i> she asks, rolling her eyes.", parse);
		Text.Add(" Jeanne snaps her fingers, gathering all the milk into a floating white orb and funneling it all into a bottle. She corks the bottle and passes it to you.", parse);
		Text.NL();
		Text.Add("You idly thank Jeanne for her help, and the clean up, before reaching down and helping Terry to [hisher] feet. From the way [heshe] is still gingerly cradling [hisher] bosom, it looks like [heshe]’s still full to capacity.", parse);
		
		terry.flags["xLact"]++;
	}
	else {
		Text.Add("Terry moans softly as [hisher] [terrybreasts] visibly quiver; it almost looks like [hisher] nipples are vibrating, working themselves up fatter and fuller than usual. After a few moments, the [foxvixen]’s chest settles back down again, leaving [himher] with engorged buds. Terry makes a small noise of curiosity, and inquisitively pinches at one; [heshe] lets out a yelp of shock, hand withdrawing as if stung, and allowing you to see the droplet of white milk seeping from the nipple and running down [hisher] tit.", parse);
		Text.NL();
		Text.Add("<i>“I feel so full,”</i> [heshe] comments, hugging [hisher] own chest.", parse);
		Text.NL();
		Text.Add("Curious, you take Terry’s hands by the wrists and gently lift [hisher] arms away, allowing you to move in closer to suckle at one sensitive nipple. Your pet’s milk washes over your tongue, a distinctive taste accompanied by liquid warmth; very nice. Smacking your lips appreciatively, you congratulate Terry on how tasty it is.", parse);
		Text.NL();
		if(terry.Relation() < 30) {
			Text.Add("<i>“How dare you! Don’t touch me!”</i> [heshe] protests, jumping away from you.", parse);
			Text.NL();
			Text.Add("You watch [himher] with feigned indifference, asking how [heshe] expects to drain [himher]self without your help whenever [heshe] gets full. Terry grumbles, ears flattening against [hisher] skull. The [foxvixen] looks down at the floor, but says nothing. [HeShe]’ll get over it.", parse);
		}
		else if(terry.Relation() < 60) {
			Text.Add("<i>“You like it? Good, because you’re gonna help me drain it whenever I’m full!”</i> [heshe] says imperiously.", parse);
			Text.NL();
			Text.Add("You can’t help but smirk at Terry’s attempt at a defiant bark, casually replying that you think you can do that for [himher].", parse);
		}
		else {
			Text.Add("<i>“I’m glad you like it, but I hope you’re aware this means you’ll be adding ‘milk the [foxvixen]’ to your daily tasks,”</i> [heshe] teases with a smirk.", parse);
			Text.NL();
			Text.Add("Grinning back, you assure [himher] that you’ll adjust your schedule accordingly.", parse);
		}
	}
	Text.Flush();
	terry.flags["lact"] = 1;
	terry.SetLactation();
	terry.lactHandler.milk.base = terry.MilkCap();
	
	Scenes.Jeanne.InteractPrompt();
}

Scenes.Terry.JeanneTFStopLactate = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		terrybreasts : function() { return terry.FirstBreastRow().Short(); }
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.Lactation()) {
		Text.Add("Terry’s breasts quiver to the extent [hisher] nipples vibrate, the formerly engorged nubs shrinking down and compacting into their original small, perky selves. Once they have dwindled away, the shuddering of the [foxvixen]’s titflesh vanishes, leaving [hisher] [terrybreasts] the way they were before.", parse);
		Text.NL();
		Text.Add("Terry experimentally pinches one of [hisher] teats, but nothing comes out. <i>“I guess that’s the end of that, then.”</i>", parse);
		Text.NL();
		Text.Add("You nod idly, agreeing that it looks like neither of you will need to deal with fox-milk anymore. Doesn’t look like Terry minds the change very much, either.", parse);
	}
	else {
		Text.Add("The two of you look at Terry’s bosom for a while, but ultimately nothing happens.", parse);
		Text.NL();
		Text.Add("<i>“I guess… it worked?”</i> Terry says, getting up on [hisher] feet.", parse);
		Text.NL();
		Text.Add("<i>“Of course it did,”</i> Jeanne offers. <i>“My potions always work. Just because it did not have any visible effect does not mean it was ineffective.”</i>", parse);
		Text.NL();
		Text.Add("As you stand there, you feel embarrassed. It should have occurred to you in the first place that it would be a waste of time and resources removing lactation from someone who doesn’t lactate in the first place. All you’ve done is made yourself look and feel rather foolish.", parse);
	}
	Text.Flush();
	
	terry.flags["lact"] = 0;
	terry.SetLactation();
	
	Scenes.Jeanne.InteractPrompt();
}

Scenes.Terry.JeanneTFGrowVag = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		tcockDesc  : function() { return terry.MultiCockDesc(); },
		hand       : function() { return terry.HandDesc(); }
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.FirstVag()) {
		Text.Add("Terry gasps, [hisher] hands darting to [hisher] pussy and barely making it before the [foxvixen] cums with a cry. Squirt after squirt of feminine fluids flowing from between [hisher] legs like a perverted cascade.", parse);
		if(terry.HorseCock())
			Text.Add(" [HisHer] equine pecker erupts, bobbing in a lewd fountain almost as messy as [hisher] feminine half.", parse);
		else if(terry.FirstCock())
			Text.Add(" [HisHer] cock spurts rope after rope of seed down to join [hisher] feminine half in sympathetic orgasm.", parse);
		Text.NL();
		Text.Add("The [foxvixen] continues being stuck in perpetual orgasm for a while longer, until [hisher] legs finally give out and [heshe] collapses to [hisher] knees on the puddle of [hisher] own making. A few more spurts of female juices and [heshe] finally stops. <i>“D-damn...”</i>", parse);
		Text.NL();
		Text.Add("[HeShe] can certainly say that again; that looked like one intense orgasm. Still, it seems that the intended effect won’t work anymore; Terry’s only ever going to have the one vagina, it looks like.", parse);
	}
	else {
		Text.Add("Terry groans, holding [hisher] crotch as it heats up, rubbing [hisher] slender thighs together. <i>“Hot! Hot! Hot!”</i> [heshe] cries out, falling to [hisher] knees.", parse);
		Text.NL();
		Text.Add("You quickly move to catch [himher], one arm around [hisher] shoulder, asking if [heshe]’s alright and to let you see what’s happening to [himher]. [HeShe] wriggles and mewls, but eventually you manage to get [himher] on [hisher] back and spread [hisher] legs so that you can see what is happening. Lifting [hisher] [tcockDesc] out of the way, you watch as the flesh underneath [hisher] balls dimples and ripples, a vertical line of pink flesh rising through the fur before suddenly parting, Terry crying out as wet fluid gushes from the new opening.", parse);
		Text.NL();
		Text.Add("Motivated by curiosity, you reach in with a finger, gently running it down the soft, delicate-looking folds of the [foxvixen]’s new netherlips. Terry wriggles and threshes, mewling in pleasure, and you become aware of [hisher] cock jutting eagerly from its sheath... and, more importantly, of a stiff little clitoris just barely peeking out of its hood at the top of Terry’s new pussy.", parse);
		Text.NL();
		Text.Add("You can’t resist touching it, squeezing it gently between forefinger and thumb and rolling it between your digits. This is evidently the last straw for Terry; the [foxvixen] lets out a barking cry of pleasure and veritably gushes femcum from [hisher] new pussy, a great wet squirt of juices splashes against the your [hand]s and the floor, followed by a couple more weak squirts as [heshe] collapses, exhausted for the moment.", parse);
		Text.NL();
		Text.Add("Looking at the great mess that Terry has made, you can’t help shaking your head and quipping that it looks like [hisher] new equipment is working just fine. Out of the corner of your eye, you can see Jeanne smirking before she twitches her fingers, making the fluids roll and seep off of Terry’s body and yours alike, creeping along the floor in a great puddle before rising up and pouring itself into an open bottle that comes floating through the air to meet it.", parse);
		terry.flags["vag"] = Terry.Pussy.Virgin;
	}
	Text.Flush();
	
	terry.SetPussy();
	
	var cum = terry.OrgasmCum();
	
	Scenes.Jeanne.InteractPrompt();
}

Scenes.Terry.JeanneTFRemVag = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		tcockDesc  : function() { return terry.MultiCockDesc(); },
		horse      : terry.HorseCock() ? "horse" : ""
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.FirstVag()) {
		Text.Add("<i>“Ugh!”</i> Terry falls to [hisher] knees, holding [hisher] crotch. Shuddering, [heshe] moans, dropping down on all fours.", parse);
		if(terry.FirstCock())
			Text.Add(" From your vantage point, you can see that Terry’s [horse]cock is already at full mast, throbbing and spewing pre like a faucet.", parse);
		Text.NL();
		Text.Add("You move to kneel behind [himher], lifting [hisher] tail out of the way as you watch the last moments of Terry’s pussy. You can see its netherlips flexing and wrinkling, shudders wracking the [foxvixen]’s body before [heshe] lets out a barking cry as it squeezes shut, fluid spurting wetly between its folds even as they dwindle away, shrinking into [hisher] fur until it is lost forever.", parse);
		Text.NL();
		if(terry.FirstCock()) {
			Text.Add("Terry’s [tcockDesc] visibly bulges before erupting, spraying semen across the floor to join the puddle of feminine fluids already there.", parse);
			Text.NL();
			parse["more"] = terry.sex.birth > 0 ? " any more" : "";
			Text.Add("The [foxvixen] groans, <i>“Guess I don’t have to worry about having[more] babies now.”</i>", parse);
			Text.NL();
			Text.Add("[HeShe] most certainly doesn’t.", parse);
		}
		else {
			Text.Add("The now flat, featureless expanse of Terry’s crotch suddenly bulges alarmingly, fur stretching into three indistinct shapes; one oval, two rounded. Within seconds, they reshape themselves into something clearer; two dangling, dainty balls, much like the ones Terry originally had. The identity of the third shape becomes clear when a throbbing, crimson-fleshed fox prick thrusts its quivering shape out of the opening at its end, spraying semen into the puddle of sexual fluids below the [foxvixen]’s form.", parse);
			Text.NL();
			Text.Add("<i>“Hey there, old buddy,”</i> [heshe] says, touching [hisher] sensitive foxhood.", parse);
			Text.NL();
			Text.Add("You can’t resist asking if Terry wants you to leave the two of them alone to ‘get reacquainted’. [HeShe] just looks at you disdainfully.", parse);
			
			terry.flags["cock"] = Terry.Cock.Regular;
			terry.SetCock();
		}
	}
	else {
		Text.Add("A few moments tick by, and absolutely nothing happens. There’s not even the slightest hint of stirring from the [foxvixen]’s [tcockDesc]. Terry simply gives you a noncommittal shrug, whilst you feel very foolish about using a vagina-removing suppository on someone who doesn’t have a vagina to remove.", parse);
	}
	Text.Flush();
	
	terry.flags["vag"] = Terry.Pussy.None;
	terry.SetPussy();
	
	Scenes.Jeanne.InteractPrompt();
}

Scenes.Terry.JeanneTFGrowCockEntrypoint = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen")
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Add("Terry’s whole body quakes with violent tremors, the [foxvixen] letting out a high-pitched cry as [hisher] legs fail [himher], sending [himher] pitching down onto [hisher] knees. Eyes screwed closed, whimpering, [heshe] rubs frantically at [hisher] loins, just above [hisher] pussy.", parse);
	Text.NL();
	Text.Add("As you watch, the flesh over Terry’s cunt begins to bulge and bloat, swelling into an oval-shaped mass. Finally, [heshe] wraps [hisher] fingers around it and its tip splits apart, revealing something crimson-colored and conical in shape jutting from the interior of what is clearly [hisher] new sheath. Curling [hisher] digits around it, Terry strokes away in an almost trance-like state, coaxing inch after inch of turgid flesh from its depths. Its base begins to swell, bloating into the iconic vulpine knot, engorged and clearly ready to be used to anchor Terry to someone, but after that... nothing else happens.", parse);
}

Scenes.Terry.JeanneTFHorsegasmEntrypoint = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		tcockDesc  : function() { return terry.MultiCockDesc(); },
		tbreastDesc : function() { return terry.FirstBreastRow().Short(); }
		
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Add("Terry immediately falls to [hisher] knees, hands darting to stroke [hisher] already engorged [tcockDesc]. Knot already fully formed, all [heshe] needs is a small touch on [hisher] inflated thickness to send forth a veritable geyser of jism; once [heshe]’s begun, you know there’s just no stopping [himher]. [HisHer] equine endowment never stops spewing gob after gob of cum, even as [heshe] gets the brilliant idea to lean over and take the flared tip of [hisher] horsecock into [hisher] foxy muzzle. In the end, [heshe] winds up blasting [hisher] own face with spunk - not that [heshe]’d care at this point - and though [heshe] does [hisher] best to suckle it all, most of the spent juices wind up on [hisher] body rather than in [hisher] maw.", parse);
	if(terry.FirstVag())
		Text.Add(" Somewhere in [hisher] continuous climax, Terry’s pussy has decided to make its own contribution to the mess by squirting some femcum down below, between the [foxvixen]’s legs.", parse);
	Text.NL();
	Text.Add("You watch as the semen-hose masquerading as a [foxvixen] slowly comes to a halt, [hisher] perversely equine cock slapping wetly against [hisher] [tbreastDesc] and lying slack on [hisher] visibly bulging belly. You slowly scrape a stray bead of jizz off of your cheek and ", parse);
	if(player.Slut() >= 60)
		Text.Add("suck it off your finger, savoring its taste.", parse);
	else
		Text.Add("flick it dismissively aside.", parse);
	Text.Add(" You ask Terry if [heshe] thinks [heshe]’s done now, to which the tired, seed-soaked [foxvixen] simply gives you a dizzy grin and nods sheepishly. Even as you say this, you look over [hisher] now-flaccid horsecock; it doesn’t look to have changed at all.", parse);
}

Scenes.Terry.JeanneTFGrowCock = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		tcockDesc  : function() { return terry.MultiCockDesc(); }
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.flags["cock"] == Terry.Cock.None) {
		Scenes.Terry.JeanneTFGrowCockEntrypoint();
		Text.NL();
		Text.Add("The [foxvixen] pants, fapping like [hisher] life depended on it. <i>“Hah… c-can’t cum!”</i> [heshe] exclaims, desperation apparent in [hisher] voice.", parse);
		Text.NL();
		Text.Add("Instinctively, you close the distance and approach the [foxvixen]. Batting [hisher] hand away, you reach out to gently massage the base of [hisher] new sheath. With soft but insistent strokes, your fingers move up and around. Terry shudders and lets out a deep, sighing moan, and a bulge of flesh suddenly forms at the base of [hisher] sheath. A suspicion of what it is prompts you to keep going, and when the effect repeats itself, thick ropes of pre-cum starting to bubble from [hisher] cock. You’re certain of it: [heshe] now has balls again.", parse);
		Text.NL();
		Text.Add("Without a thought, you lift your hands from the base of Terry’s sheath and give [hisher] new cock a firm pump between your digits.", parse);
		Text.NL();
		Text.Add("Terry cries out in pleasure as your touch brings [himher] to [hisher] climax. [HeShe] instinctively bucks against your grasp as rope after rope of fox-jism spurts from [hisher] newly grown fox-cock. A wet splash comes from underneath the [foxvixen] as [hisher] pussy achieves a sympathetic orgasm.", parse);
		Text.NL();
		Text.Add("Stepping back, you watch as the [foxvixen] collapses onto a puddle of [hisher] own making. [HeShe] sighs in relief. <i>“Ah… I thought I was going to explode.”</i>", parse);
		Text.NL();
		Text.Add("Looking at the sheer mess of Terry’s climax, you can’t resist quipping that you wouldn’t say [heshe] didn’t.", parse);
		
		terry.flags["cock"] = Terry.Cock.Regular;
		terry.SetCock();
	}
	else if(terry.flags["cock"] == Terry.Cock.Regular) {
		Text.Add("Terry immediately falls to [hisher] knees, furiously fapping at [hisher] fox-cock as it reaches its fully engorged state and dripping pre. The knot inflates in record time. Each time [hisher] paws connect with it, [heshe] spews a long strand of fox-cum.", parse);
		if(terry.FirstVag())
			Text.Add(" The [foxvixen]’s pussy reacts in a similar manner, squirting small but constant, gushes of fluids underneath, quickly forming a pool of female-scented arousal.", parse);
		Text.NL();
		Text.Add("The process continues for a short while longer, until Terry’s finished cumming. After [heshe]’s done, [heshe] slowly climbs back to [hisher] feet, still a bit dizzy and wobbly from so many repeated orgasms. <i>“Damn… that was intense.”</i>", parse);
		Text.NL();
		Text.Add("You nod your head in agreement with [hisher] statement, but note that despite all this, Terry’s [tcockDesc] doesn’t look any different. It seems Jeanne’s suppository is only good for restoring a removed cock, not for adding new ones or increasing its size.", parse);
	}
	else { // Horsecock
		Scenes.Terry.JeanneTFHorsegasmEntrypoint();
	}
	Text.Flush();
	
	var cum = terry.OrgasmCum();
	
	Scenes.Jeanne.InteractPrompt();
}

//TODO
Scenes.Terry.JeanneTFRemCock = function() {
	var parse = {
		playername : player.name,
		foxvixen   : terry.mfPronoun("fox", "vixen")
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.FirstCock()) {
		if(terry.HorseCock()) {
			Text.Add("The [foxvixen] arches [hisher] back, eyes screwed shut as [hisher] equine endowment thrusts from [hisher] sheath. It visibly throbs, knot swelling as if tying with some ethereal pussy... and then, with a body-wracking shudder, Terry cums. A great gout of semen sprays from its flared head, splashing messily across the floor, and then its underside bulges before it fires a second shot, and then a third, each as large as the one before.", parse);
			Text.NL();
			Text.Add("After the third shot, however, it stops firing; a steady flow of seed seeps slowly from its head, but nothing else seems to be coming out. Terry wriggles and moans, delirious with the pleasure of the transformative running through [hisher] system. If you let this run its course, you’re going to be stuck here until tomorrow. Considering Terry is in no shape to try and fix this, it seems you’ll have to do something about it yourself.", parse);
			Text.NL();
			Text.Add("Crossing the distance between you both, you seat yourself behind the [foxvixen] and pull [himher] into your lap, reaching around to take hold of the horsecock as it throbs away in [hisher] lap. You can feel that it’s shrunk, shorter and thinner now than it was before.", parse);
			Text.NL();
			Text.Add("Moving your fingers to its inflated knot and gripping the bloated bulge of flesh with your hand, you caress it. Slowly, you massage it against your palm with smooth, even motions. Terry moans like a whore in heat, thick spurts of cum geysering from [hisher] flare, each climactic outburst causing [hisher] bulb to shrink a little bit in your grip until finally it disappears, leaving [himher] with just a normal horsecock.", parse);
			Text.NL();
			Text.Add("Smiling, your hand glides in a long, slow stroke up Terry’s shaft, not stopping until you reach the flared tip. Your digits trace circles around the bulging flesh, rubbing every bump and wrinkle, teasing out great jets of semen that spill down [hisher] length. Looking over Terry’s shoulder confirms what your fingers are telling you: Terry’s dick is shrinking, and quite rapidly, inches vanishing with every spurt of seed.", parse);
			Text.NL();
			Text.Add("Stroke by stroke and spurt by spurt, Terry’s cock keeps dwindling from its former impressive size to something even smaller than [hisher] original vulpine member, just barely big enough to fit outside its sheath now. Moved by impulse, you reach out and gently tuck the now micro-dick away inside of the sheath, one final pathetic spurt of semen erupting from between its fleshy lips as if in weak protest of its fate. Your fingers move to pinch the sheath’s lips shut, rubbing it back into Terry’s loins and feeling it seep away into the flesh of [hisher] crotch, until there’s no longer anything there.", parse);
			Text.NL();
			Text.Add("Terry’s balls remain, dangling lonely in their former space. You move to cup them, fondling and rolling them around in your palm, feeling them shrink smaller and smaller until they have receded totally into Terry’s body, leaving a blank space where [hisher] cock was.", parse);
			Text.NL();
			parse["vag"] = terry.FirstVag() ? Text.Parse(", apart from [hisher] pussy, of course", parse) : "";
			Text.Add("As your [foxvixen] pants heavily for breath, you give [himher] a moment’s respite, then gently wriggle your way out from under [himher] once it looks like [heshe] can support [himher]self. As [heshe] continues catching [hisher] breath, you walk back around to [hisher] front so you can properly examine [hisher] new state. Sure enough, it’s totally smooth and blank[vag].", parse);
		}
		else {
			Text.Add("The [foxvixen] arches [hisher] back, eyes screwed shut as [hisher] vulpine dick thrusts from [hisher] sheath. It visibly throbs, knot swelling as if tying with some ethereal pussy... and then, with a body-wracking shudder, Terry cums, spraying [hisher] usual meager splash of semen across the floor. Instead of going limp, however, it fires off again, and then again, multiple orgasms wracking the vulpine-morph in quick succession.", parse);
			Text.NL();
			Text.Add("But as [heshe] barks and whimpers in pleasure, you can see something surprising happening: Terry’s dick is growing smaller, inch after inch, dwindling down until only the barest nub of a cock is poking out of [hisher] sheath. Then, with one final thigh-spattering splash of semen, it vanishes inside of [hisher] sheath, which seems to melt away into Terry’s body. [HisHer] balls dwindle, as if being sucked into Terry’s pelvis from the inside out, and are likewise gone.", parse);
		}
		
		terry.flags["cock"] = Terry.Cock.None;
		terry.SetCock();
		
		Text.NL();
		Text.Add("Terry rubs [hisher] smoothened crotch, exhaling a sigh as the last tickles of pleasure fade. <i>“Well, I guess I’m a bit less male now...”</i>", parse);
		if(!terry.FirstVag()) {
			Text.NL();
			Text.Add("Your vulpine pet isn’t left a neuter for long; moaning in pleasure, you watch [hisher] now-blank loins beginning to puff and swell, shaping into the unmistakably feminine form of a daintily puffy mons. Pink flesh pushes through the fur in a vertical line, then suddenly peels open in a great squirt of translucent fluid, the ecstatic howl escaping Terry’s lips making you very certain as to what it is.", parse);
			Text.NL();
			Text.Add("Terry has grown [himher]self a brand new pussy to replace [hisher] old cock!", parse);
			
			terry.flags["vag"] = Terry.Pussy.Virgin;
			terry.SetPussy();
		}
		
		var cum = terry.OrgasmCum();
	}
	else {
		parse["lust"] = (terry.LustLevel() >= 0.5 || terry.Slut() >= 60) ? " beyond usual" : "";
		Text.Add("Both you and Terry wait patiently, but nothing happens. There’s simply no alteration in the [foxvixen]. No stirring on [hisher] pussy, not even a tickle of arousal[lust]. After a few moments, Terry simply gives you a noncommittal shrug, whilst you feel very foolish about using a penis-removing suppository on someone who doesn’t have a penis to remove.", parse);
	}
	Text.Flush();
	
	Scenes.Jeanne.InteractPrompt();
}

Scenes.Terry.JeanneTFGrowHorsecock = function() {
	var parse = {
		playername : player.name,
		pheshe     : player.heshe(),
		foxvixen   : terry.mfPronoun("fox", "vixen"),
		paternalMaternal : player.mfTrue("paternal", "maternal")
	};
	parse = terry.ParserPronouns(parse);
	
	Text.Clear();
	if(terry.HorseCock()) {
		Scenes.Terry.JeanneTFHorsegasmEntrypoint();
		
		Text.Flush();
		var cum = terry.OrgasmCum();
		
		Scenes.Jeanne.InteractPrompt();
		return;
	}
	
	if(terry.FirstCock()) {
		Text.Add("Terry groans, falling to [hisher] knees as a dizzy spell threatens to knock [himher] off balance. <i>“T-tight!”</i>", parse);
		Text.NL();
		Text.Add("You watch as the [foxvixen] sits down and spread [hisher] legs to let you watch as [hisher] balls churn. The tip of [hisher] cock pokes out from its sheath as a small rope of cum spews forth, even before [hisher] dick has a chance to grow into a proper erection.", parse);
		Text.NL();
		Text.Add("With the pressure of the seed churning within [hisher] balls, Terry’s member sprouts like lightning into a full-fledged erection, knot swelling out with the need to anchor. The shaft throbs visibly, its base bulging as a great spurt of semen forces its way up and out [hisher] glans, far larger than the last. Looking a little further down, you can see [hisher] balls throbbing in sympathy, almost visibly churning up more and more cum, bloating to twice their original size from the sheer volume of seed crammed into them.", parse);
	}
	else {
		Scenes.Terry.JeanneTFGrowCockEntrypoint();
		
		Text.NL();
		Text.Add("<i>“Huh? Is that it?”</i> the [foxvixen] asks, stopping [hisher] masturbation and sitting down to look at [hisher] turgid cock throb.", parse);
		Text.NL();
		Text.Add("A gob of pre forms on the pointy tip, falling to the ground as Terry groans, <i>“Ugh… I guess it isn’t over...”</i>", parse);
		Text.NL();
		Text.Add("Sitting on [hisher] haunches, the [foxvixen] spreads [hisher] legs, giving you a perfect view of [hisher] foxhood as it throbs. A few drops of pre slide along the erect shaft, down [hisher] knot and onto the floor.", parse);
		Text.NL();
		Text.Add("Before your eyes, the fur at the base of the [foxvixen]’s new cock starts to expand, swelling out and taking the shape of what is unquestionably a new scrotum. They hit the size of Terry’s old balls, but keep on growing, expanding until they are easily twice the size of the [foxvixen]’s original dainty testes. Terry shudders, moaning softly as they almost visibly churn, bulging with frothing new [foxvixen]-seed. The semen inside builds in pressure until it is forcing its way up Terry’s shaft, a bulge visibly traversing its underside before a great ropy strand of seed spews from its tip.", parse);
	}
	Text.NL();
	Text.Add("Terry cries out, [hisher] cock bulging out, veins on display, pumping into [hisher] dick as [heshe] suddenly grows harder than you thought possible.", parse);
	Text.NL();
	Text.Add("Before your eyes, Terry’s shaft begins to bulge, swelling in girth wider and wider, [hisher] knot being absorbed by the growing flesh until it disappears altogether. Only after it has grown so wide does the outward swelling stop, the member pulsating with pent-up need. Terry mewls and shudders, bucking [hisher] hips in unconscious desire, and with each thrust, [hisher] tip grows flatter and flatter. Soon, it’s no longer pointy at all, but blunt and roughly circular; the more you look at it, the more it looks like a horse’s cock, flare and all.", parse);
	Text.NL();
	Text.Add("A cry of ecstasy wrings its way from the [foxvixen]’s throat as a small spurt of semen shoots from [hisher] now flat, flared tip. It splashes almost meekly onto the floor, and then a second spurt erupts, and then a third, meager ropes of seed trailing across the floor.", parse);
	Text.NL();
	Text.Add("The transformative is clearly still at work, however; each spurt of cum makes Terry’s cock grow just a little bit bigger, a little bit fatter. Inch by inch it slowly swells outwards, bloating longer and longer. When the volley of jism ropes finally dwindles away into a seeping trickle, the panting [foxvixen]’s sheath is visibly distended around [hisher] new phallic girth. There’s no question what [heshe]’s now sporting is an equine cock, at least three times its original length and almost three times as thick as it once was. Colored the same bright crimson as Terry’s old cock, the bobbing shaft is incredibly eye-catching, drawing attention with both its color and sheer size.", parse);
	Text.NL();
	Text.Add("The [foxvixen] pants with the effort, [hisher] sheath slowly growing more and more accustomed to the girth of [hisher] new horsecock. <i>“D-damn! It’s not over!”</i> [HeShe] cries out as [hisher] dick slowly changes color, the bright crimson fading into a more subtle pink coloration, dulling out so as to not draw as much attention to [hisher] newly acquired equine endowment. Not that such a huge shaft would go unnoticed when it’s attached to Terry’s dainty body.", parse);
	Text.NL();
	Text.Add("As if in response to your thoughts, the colors of Terry’s cock keep on changing, shifting from its former pearly pink shade to a mottled brown color that is more like something you’d associate with a horse’s dick. It looks like you spoke too soon; this darker color seems to make it stand out even more against Terry’s white and gold fur than it did when it was bright red.", parse);
	Text.NL();
	Text.Add("Before your eyes, the straining flesh of Terry’s sheath begins to grow, creeping forward and stretching wider as it does. Soon, it has enveloped the base of the new horse-like cock, properly sized to fit, and making it match [hisher] body much more smoothly. Looking at the pulsating erection, you feel compelled to touch it and see for yourself how Terry responds.", parse);
	Text.NL();
	Text.Add("Deciding to give in to your curiosity, you circle Terry and seat yourself on the floor behind [himher]. Once comfortable, you unceremoniously pull the [foxvixen] into your lap, one arm curling around [hisher] waist to hold [himher] there and the other hand reaching eagerly into [hisher] lap and the new toy that awaits you there.", parse);
	Text.NL();
	Text.Add("<i>“Ah! Wait!”</i> the [foxvixen] protests as you encircle [hisher] shaft, slowly stroking along its length, milking pre as it leaks like a faucet. You eagerly divert your caress to [hisher] flat tip, rubbing the sensitive glans as Terry cries out in pleasure. Pre continually forms, which you quickly swipe to rub along [hisher] member. <i>“C-can’t cum!”</i>", parse);
	Text.NL();
	Text.Add("As Terry bucks madly into your hand, unthinkingly grinding against you in [hisher] magically-induced rut, you can’t help but rub [hisher] new shaft, trying to help the [foxvixen] achieve release. Strange... there’s some sort of bulge growing down near the base of [hisher] dick...", parse);
	Text.NL();
	Text.Add("Curious, you continue to rub and stroke it, feeling it continuing to bloat outwards in mimicry of the flaring tip, and you realize what it is: the shift from vulpine to equine evidently wasn’t total. Terry’s growing a brand new knot! And quite a knot, at that; as you continue to molest it, it bloats into a monster easily the size of a grapefruit. Fortunately, that seems to be as big as it’s going to get.", parse);
	Text.NL();
	Text.Add("Sperm drools thick and heavy over your stroking fingers as Terry gasps and whimpers, trembling so hard you can feel it. It doesn’t look like [heshe]’s going to last much longer... Abandoning Terry’s cock, your hand reaches for [hisher] newly-bloated balls, which show no sign of shrinking despite the copious amounts of seed leaking from Terry’s new endowment. You caress the bulging orbs with your digits, rolling them into your palm as best you can and fondling them, feeling their liquid contents churn and boil inside.", parse);
	Text.NL();
	Text.Add("That seems to be it, as Terry arches [hisher] back and howls in ecstasy, erupting like a perverse volcano as [hisher] new balls eagerly empty themselves. Great waves of semen, any one of which would have put [hisher] old climaxes to shame, erupt from the flaring tip, vomiting in a fountain of off-white. What feels like minutes slips by before finally Terry’s new dick belches its last hands-filling gobbet of seed and falls limp... well, as limp as it can, with the knot swollen at its base, preventing Terry’s sheath from sucking it back inside.", parse);
	Text.NL();
	Text.Add("With a huge sigh of release, Terry slumps back against you, feeling exhausted due to how spent [heshe] is, head falling down and resting [hisher] chin on [hisher] chest. You adjust the [foxvixen] on your lap, so [heshe] can have some proper rest.", parse);
	Text.NL();
	Text.Add("You glance over at Jeanne, who took the brunt of Terry’s climax. The magician is soaked in the [foxvixen]’s cum, long strands hanging from her hat and dripping down her cleavage. She looks relatively unconcerned, if a little surprised. With a small gesture and a few whispered words, the white goop is swept up by her magic, gathering into a rather large floating blob. Another flick of her wrist and a vial drifts lazily over to the base of the blob, which vanishes inside of it before it caps itself off. She deftly plucks it from the air and stows it away inside of her pocket, clearly intending to make use of it somehow.", parse);
	Text.NL();
	Text.Add("<i>“Well, that was certainly... interesting. Quite a show your little [foxvixen] put on, [playername],”</i> the elven mage comments.", parse);
	Text.NL();
	Text.Add("[HeShe] most certainly did, you reply. ", parse);
	if(player.Slut() >= 60)
		Text.Add("An almost [paternalMaternal] wave of pride fills you at just how much of a show your little pet gave you; you can’t wait to see what [heshe] can do with this new dick after some more training.", parse);
	else
		Text.Add("You wriggle in embarrassment, feeling the guilt of soaking Jeanne washing over you like an icy shower. If this new productivity is going to be staying, sex is going to get a bit more embarrassing in the future.", parse);
	Text.NL();
	Text.Add("It takes the better part of an hour before Terry is well enough to get back on [hisher] feet. [HeShe] examines [hisher] new sheath and balls, both much bigger, and fuller, than [hisher] original set. <i>“Dammit, [playername]. You can’t keep changing and transforming me like I’m some kind of toy,”</i> [heshe] pouts.", parse);
	Text.NL();
	Text.Add("<i>“I did not hear you complain over all the screaming about how good it felt, nor when you were on all fours getting done in the butt by [playername],”</i> Jeanne states nonchalantly. <i>“You also did not protest when [pheshe] brought up the idea.”</i>", parse);
	Text.NL();
	Text.Add("Smiling, you agree to Jeanne’s observations.", parse);
	Text.NL();
	Text.Add("<i>“I… umm...”</i>", parse);
	Text.NL();
	Text.Add("Looks like Terry is at a loss for words. ", parse);
	if(terry.Relation() < 30) {
		Text.Add("With a friendly grin, you give the [foxvixen] a playful clap on the shoulder, assuring [himher] that [heshe]’ll grow to enjoy [hisher] new toy, if [heshe] gives it a chance.", parse);
		Text.NL();
		Text.Add("The [foxvixen] huffs indignantly, looking away.", parse);
	}
	else if(terry.Relation() < 60) {
		Text.Add("Smiling, you close the distance and draw Terry to you, wrapping your arms around [himher] in an affectionate hug. The new cock really looks great on [himher], you assure the [foxvixen].", parse);
		Text.NL();
		Text.Add("<i>“Thanks. It’s… pretty sensitive, I guess. It’ll take some getting used to.”</i>", parse);
		Text.NL();
		Text.Add("That may be, but you’re sure [heshe]’ll get used to it in record time.", parse);
	}
	else {
		Text.Add("You simply can’t resist, Terry’s face lighting up with glee as you pull the [foxvixen] into a warm hug, feeling [himher] melting against you as your lips claim [hishers]. As your bodies tangle, you can feel the new equine dick hanging between [hisher] legs poking against you. Breaking the kiss, you smirk and quip that you have a feeling it won’t be long before Terry starts to enjoy [hisher] new equipment.", parse);
		Text.NL();
		Text.Add("The [foxvixen] grins. <i>“I just hope you’re ready to deal with the responsibility that comes attached with giving me this big cock. I already have an idea about what I’d like it used for,”</i> Terry says, licking [hisher] lips.", parse);
		Text.NL();
		Text.Add("That’s the spirit; [heshe]’s getting the hang of things already. To celebrate, you decide to kiss [himher] again, enjoying the almost purring sound of pleasure that rumbles up [hisher] throat as [heshe] melts against you. After a few pleasant moments, you release the [foxvixen], who actually pouts at being let go.", parse);
	}
	Text.Flush();
	
	terry.flags["cock"] = Terry.Cock.Horse;
	terry.SetCock();
	
	world.TimeStep({hour: 1});
	var cum = terry.OrgasmCum();
	
	Scenes.Jeanne.InteractPrompt();
}
