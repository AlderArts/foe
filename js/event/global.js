
Scenes.Global = {};

Scenes.Global.VisitedRigardGates = function() {
	return miranda.Met();
}

Scenes.Global.PortalsOpen = function() {
	return gameCache.flags["Portals"] != 0;
}

// Learned from Jeanne/Magnus
Scenes.Global.MagicStage1 = function() {
	return gameCache.flags["LearnedMagic"] != 0;
}

// Learned from Jeanne
Scenes.Global.MagicStage2 = function() {
	return gameCache.flags["LearnedMagic"] >= 3;
}
