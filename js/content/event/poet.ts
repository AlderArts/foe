
import { TimeStep } from "../../engine/GAME";
import { EncounterTable } from "../../engine/navigation/encountertable";
import { Text } from "../../engine/parser/text";
import { Gui } from "../../gui/gui";

export namespace PoetScenes {

	export function Entry() {
		const scenes = new EncounterTable();
		scenes.AddEnc(PoetScenes.ToDragonOrLizard, 1.0, () => true);

		Text.Clear();
		Text.Add(`Walking along the beaten path, you come across a scrawled note left on the ground. Curious, you bend down and pick it up.<i>`);
		Text.NL();

		scenes.Get();

		Text.NL();
		Text.Add(`</i>...What is this?`);
		Text.Flush();

		TimeStep({minute: 10});

		Gui.NextPrompt();
	}

	export function ToDragonOrLizard() {
		Text.Out(`To be dragon or lizard, that is the question–
		Whether ’tis nobler in the mind to suffer
		The dilemmas of outrageous fortune,
		Or to take arms against a sea of choices,
		And by deciding, end them? To TF, to rest–
		No more; and by choice, to say we stop
		The heart-ache, and the thousand natural qualms
		That mind is heir to? ‘Tis a consummation
		Devoutly to be wished. To pick, to choose,
		To end, perchance regret; Aye, there’s the rub,
		For in that transformation, what doubts may come,
		When we have turned part lizard, part dragon,
		Must give us pause.`);
	}
}
