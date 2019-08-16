import { Gui } from "../gui";
import { Text } from "../text";

const PortalOpeningScenes: any = {};

PortalOpeningScenes.Intro = () => {
	const parse: any = {

	};

	// TODO
	Text.Clear();
	Text.Add("THIS IS THE END OF CURRENT MAIN STORY CONTENT, COME BACK LATER.", parse, "bold");
	Text.Flush();

	Gui.NextPrompt();
};

export { PortalOpeningScenes };
