
import { EncounterTable } from '../encountertable';
import { Text } from '../text';
import { Gui } from '../gui';
import { TimeStep } from '../GAME';

let PoetScenes : any = {};

PoetScenes.Entry = function() {
	var parse = {
		
	};
	
	var scenes = new EncounterTable();
	scenes.AddEnc(PoetScenes.ToDragonOrLizard, 1.0, function() { return true; });
	
	Text.Clear();
	Text.Add("Walking along the beaten path, you come across a scrawled note left on the ground. Curious, you bend down and pick it up.<i>", parse);
	Text.NL();
	
	scenes.Get();
	
	Text.NL();
	Text.Add("</i>...What is this?", parse);
	Text.Flush();
	
	TimeStep({minute: 10});
	
	Gui.NextPrompt();
}

PoetScenes.ToDragonOrLizard = function() {
	var parse = {};
	
	Text.Add("To be dragon or lizard, that is the question–<br>", parse);
	Text.Add("Whether ’tis nobler in the mind to suffer<br>", parse);
	Text.Add("The dilemmas of outrageous fortune,<br>", parse);
	Text.Add("Or to take arms against a sea of choices,<br>", parse);
	Text.Add("And by deciding, end them? To TF, to rest–<br>", parse);
	Text.Add("No more; and by choice, to say we stop<br>", parse);
	Text.Add("The heart-ache, and the thousand natural qualms<br>", parse);
	Text.Add("That mind is heir to? ‘Tis a consummation<br>", parse);
	Text.Add("Devoutly to be wished. To pick, to choose,<br>", parse);
	Text.Add("To end, perchance regret; Aye, there’s the rub,<br>", parse);
	Text.Add("For in that transformation, what doubts may come,<br>", parse);
	Text.Add("When we have turned part lizard, part dragon,<br>", parse);
	Text.Add("Must give us pause.", parse);
}

export { PoetScenes };
