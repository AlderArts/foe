import { Gui } from './gui';
import { isOnline } from './gamestate';
import { Text } from './text';
import { SetGameCache, GameCache } from './GAME';
import { loadfileOverlay } from './fileoverlay';

let Saver = {}

Saver.slots = 12;

Saver.SavePrompt = function(backFunc) {
	Text.Clear();

	Text.Add("Save game:");
	Text.NL();

	var options = new Array();
	for(var i=0; i<Saver.slots; i++) {
		Text.Add("Game " + i + ": ");
		var name = localStorage["save" + i];
		if(name) {
			Text.Add(name);
			options.push({ nameStr : "Game " + i,
				func : function(obj) {
					var prmpt = prompt("This will overwrite save slot " + obj + ", continue? \n\n Comment:");
					if(prmpt != null) Saver.SaveGame(obj, prmpt);
				}, enabled : true, obj : i
			});
		}
		else {
			Text.Add("EMPTY");
			options.push({ nameStr : "Game " + i,
				func : function(obj) {
					var prmpt = prompt("This will save to slot " + obj + ", continue? \n\n Comment:");
					if(prmpt != null) Saver.SaveGame(obj, prmpt);
				}, enabled : true, obj : i
			});
		}
		Text.NL();
	}
	Gui.SetButtonsFromList(options, true, backFunc);

	Text.NL();
	if (Saver.HasSaves()) {
		var storageLength = 0;
		for (var key in localStorage) {
			if (localStorage.hasOwnProperty(key) && localStorage[key].length) {
				storageLength += localStorage[key].length;
			}
		}
		Text.Add("localStorage usage: " + ((storageLength * 16) / (8 * 1024)).toFixed(2) + 'kB');
	}
	Text.Flush();
}

Saver.SaveGame = function(slot, comment) {
	GameToCache();
	var seen = [];
	var saveData = JSON.stringify(GameCache(), function(key, value) {
		if (typeof value === "object" && value !== null) {
			if (seen.indexOf(value) !== -1) {
				console.error("Circular reference found in the gameCache!\n" + key + ":", value);
				return;
			}
			seen.push(value);
		}
		return value;
	});

	var saveName = GameCache().name;
	if (comment) {
		saveName += " :: Comment: " + comment;
	}

	localStorage["saveDataLZ" + slot] = LZString.compressToUTF16(saveData);
	localStorage["save" + slot] = saveName;
	// Clear out legacy storage.
	delete localStorage["savedata" + slot];

	Saver.SavePrompt();
}

Saver.SaveToFile = function() {
	var filename;
	if(GenerateFile.canSaveOffline) {
		filename = prompt("SAVE TO FILE MIGHT NOT WORK IN OFFLINE MODE!\n\n Enter name of save file.");
	}
	else {
		filename = prompt("SAVE TO FILE WILL NOT WORK IN OFFLINE MODE!\n\n Enter name of save file.");
	}
	if(filename && filename != "") {
		GameToCache();
		var seen = [];
		GenerateFile({filename: filename, content: JSON.stringify(GameCache(),
			function(key, val) {
				if (typeof val == "object") {
					if (seen.indexOf(val) >= 0)
						return;
					seen.push(val);
				}
				return val;
			})
		});
	}
	else {
		Text.NL();
		Text.Add("No file saved: Enter a filename!", null, 'bold');
		Text.Flush();
	}
}

// Returns true if there are any saves
Saver.HasSaves = function() {
	if(!isOnline()) return false;
	for(var i=0; i<Saver.slots; i++)
		if(Saver.SaveHeader(i)) return true;
	return false;
}

Saver.LoadPrompt = function(backFunc) {
	Text.Clear();

	Text.Add("Load game:");
	Text.NL();

	var options = new Array();
	for(var i=0; i<Saver.slots; i++) {
		Text.Add("Game " + i + ": ");
		var name = localStorage["save" + i];
		if(name)
			Text.Add(name);
		else
			Text.Add("EMPTY");
		Text.NL();
		options.push({ nameStr : "Game " + i,
			func : Saver.LoadGame, enabled : Saver.SaveHeader(i), obj : i
		});
	}
	Gui.SetButtonsFromList(options, true, backFunc);

	Text.NL();
	if (Saver.HasSaves()) {
		var storageLength = 0;
		for (var key in localStorage) {
			if (localStorage.hasOwnProperty(key) && localStorage[key].length) {
				storageLength += localStorage[key].length;
			}
		}
		Text.Add("localStorage usage: " + ((storageLength * 16) / (8 * 1024)).toFixed(2) + 'kB');
	}
	Text.Flush();
}

Saver.LoadGame = function(slot) {
	if (localStorage["saveDataLZ" + slot]) {
		var saveData = LZString.decompressFromUTF16(localStorage["saveDataLZ" + slot]);
		SetGameCache(JSON.parse(saveData));
	} else {
		// Load from legacy storage.
		SetGameCache(JSON.parse(localStorage["savedata" + slot]));
	}

	CacheToGame();
	Gui.PrintDefaultOptions();
}

Saver.SaveHeader = function(nr) {
	return localStorage["save" + nr];
}

Saver.DeleteSave = function(nr) {
	delete localStorage["save" + nr];
	delete localStorage["savedata" + nr];
}

Saver.Clear = function() {
	//localStorage.clear();
	var conf = confirm("This will remove all local saves and settings, do you really want to continue?");
	if(conf == true) {
		for(var i=0; i<Saver.slots; i++) {
			delete localStorage["save" + i];
			delete localStorage["savedata" + i];
		}
	}
}

Saver.OnLoadFromFileClick = function() {

	var files = document.getElementById('loadFileFiles').files;
	if (!files.length) {
		alert('Please select a file!');
		return;
	}

	loadfileOverlay();

	var file = files[0];

	Saver.LoadFromFile(file);
}

// Takes a File as argument
Saver.LoadFromFile = function(file) {
	if(!file) return;

	var reader = new FileReader();

	reader.onload = function(e) {
		SetGameCache(JSON.parse(e.target.result));
		CacheToGame();
		Gui.PrintDefaultOptions();
		Gui.Render();
	}

	reader.readAsText(file);
}

export { Saver };
