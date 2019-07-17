
import { Scenes } from '../event';

Scenes.PortalOpening = {};

Scenes.PortalOpening.Intro = function() {
	var parse = {
		
	};
	
	//TODO
	Text.Clear();
	Text.Add("THIS IS THE END OF CURRENT MAIN STORY CONTENT, COME BACK LATER.", parse, 'bold');
	Text.Flush();
	
	Gui.NextPrompt();
}
