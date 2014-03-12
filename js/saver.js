Saver = {}

Saver.slots = 12;

Saver.SavePrompt = function(backFunc) {
	Text.Clear();
	
	Text.AddOutput("Save game:");
	Text.Newline();
	
	var options = new Array();
	for(var i=0; i<Saver.slots; i++) {
		Text.AddOutput("Game " + i + ": ");
		var name = localStorage["save" + i];
		if(name) {
			Text.AddOutput(name);
			options.push({ nameStr : "Game " + i,
				func : function(obj) {
					var conf = confirm("This will overwrite save slot " + obj + ", continue?");
					if(conf == true) Saver.SaveGame(obj);
				}, enabled : true, obj : i
			});
		}
		else {
			Text.AddOutput("EMPTY");
			options.push({ nameStr : "Game " + i,
				func : Saver.SaveGame, enabled : true, obj : i
			});
		}
		Text.Newline();
	}
	Gui.SetButtonsFromList(options, true, backFunc);
	
    Text.Newline();
    if(Saver.HasSaves())
    	Text.AddOutput("DEBUG: localStorage usage: " + JSON.stringify(localStorage).length / 2636625);
}

Saver.SaveGame = function(nr) {
	GameToCache();
	var seen = [];
	localStorage["savedata" + nr] = JSON.stringify(gameCache, function(key, val) {
	   if (typeof val == "object") {
	        if (seen.indexOf(val) >= 0)
	            return;
	        seen.push(val);
	    }
	    return val;
	});
	// TODO: Name, level, time
	localStorage["save" + nr] = gameCache.name;
	Saver.SavePrompt();
}

// Returns true if there are any saves
Saver.HasSaves = function() {
	for(var i=0; i<Saver.slots; i++)
		if(Saver.SaveHeader(i)) return true;
	return false;
}

Saver.LoadPrompt = function(backFunc) {
	Text.Clear();
	
	Text.AddOutput("Load game:");
	Text.Newline();
	
	var options = new Array();
	for(var i=0; i<Saver.slots; i++) {
		Text.AddOutput("Game " + i + ": ");
		var name = localStorage["save" + i];
		if(name)
			Text.AddOutput(name);
		else
			Text.AddOutput("EMPTY");
		Text.Newline();
		options.push({ nameStr : "Game " + i,
			func : Saver.LoadGame, enabled : Saver.SaveHeader(i), obj : i
		});
	}
	Gui.SetButtonsFromList(options, true, backFunc);
	
    Text.Newline();
    if(Saver.HasSaves())
    	Text.AddOutput("DEBUG: localStorage usage: " + JSON.stringify(localStorage).length / 2636625);
}

Saver.LoadGame = function(nr) {
	gameCache = JSON.parse(localStorage["savedata" + nr]);
	CacheToGame();
	PrintDefaultOptions();
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

function loadfileOverlay() {
	var el = document.getElementById("overlay_load");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
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
		gameCache = JSON.parse(e.target.result);
		CacheToGame();
		PrintDefaultOptions();
		Render();
	}
	
	reader.readAsText(file);
}
