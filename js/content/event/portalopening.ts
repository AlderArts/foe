import { IParse, Text } from "../../engine/parser/text";
import { Gui } from "../../gui/gui";

export namespace PortalOpeningScenes {

	export function Intro() {
		const parse: IParse = {

		};

		// TODO
		Text.Clear();
		Text.Add("THIS IS THE END OF CURRENT MAIN STORY CONTENT, COME BACK LATER.", parse, "bold");
		Text.Flush();

		Gui.NextPrompt();
	}

}
