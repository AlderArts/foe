import { Text } from "../text";
import { Gui } from "../gui";

let PortalOpeningScenes = {};

PortalOpeningScenes.Intro = function() {
	var parse = {
		
	};
	
	//TODO
	Text.Clear();
	Text.Add("THIS IS THE END OF CURRENT MAIN STORY CONTENT, COME BACK LATER.", parse, 'bold');
	Text.Flush();
	
	Gui.NextPrompt();
}

export { PortalOpeningScenes };
