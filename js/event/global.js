
let GlobalScenes = {};

GlobalScenes.VisitedRigardGates = function() {
	return miranda.Met();
}

GlobalScenes.VisitedOutlaws = function() {
	return outlaws.flags["Met"] >= Outlaws.Met.Met;
}

GlobalScenes.MetJeanne = function() {
	return jeanne.flags["Met"] != 0;
}

GlobalScenes.DefeatedOrchid = function() {
	return glade.flags["Visit"] >= DryadGlade.Visit.DefeatedOrchid;
}

GlobalScenes.PortalsOpen = function() {
	return gameCache.flags["Portals"] != 0;
}

// Learned from Jeanne/Magnus
GlobalScenes.MagicStage1 = function() {
	return gameCache.flags["LearnedMagic"] != 0;
}

// Learned from Jeanne
GlobalScenes.MagicStage2 = function() {
	return gameCache.flags["LearnedMagic"] >= 3;
}

export { GlobalScenes };
