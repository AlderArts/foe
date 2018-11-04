// Universal constants
const frametime = 0.050; // Used for time updates
const windowWidth  = 1260;
const windowHeight = 700;

const APP_NAME = "Fall of Eden";
const VERSION_MAJOR = 0;
const VERSION_MINOR = 4;
const VERSION_SUBSCRIPT = 24;
const VERSION_NAME = "Lactation bugfix";

const SAVE_VERSION = 29;
// Save version 1: Initial
// Save version 2: Added inventory
// Save version 3: Fixed clitcock restoration + height, weigth
// Save version 4: Fixed kiakai race
// Save version 5: Growth added to stats
// Save version 6: Changed Kiakai attitude
// Save version 7: Added Rosalin, moved a bunch of save flags
// Save version 8: Fixed weird Fera bug
// Save version 9: Adjusted breast sizes
// Save version 10: Rosalin eyes
// Save version 11: Jobs
// Save version 12: Job fix "Figther"
// Save version 13: Krawitz
// Save version 14: Miranda herm fix
// Save version 15: Twins met flag
// Save version 16: Jeanne met flag
// Save version 17: Terry gender fix
// Save version 18: Terry & Miranda exp to level fix
// Save version 19: Terry & Miranda exp to level fix
// Save version 20: Boss drops
// Save version 21: Capacity rewrite
// Save version 22: Terry save format
// Save version 23: Outlaws restructuring
// Save version 24: Farm restructuring
// Save version 25: Layla level pacing
// Save version 26: Uru intro flags
// Save version 27: Outlaws flags
// Save version 28: Lei flags fix
// Save version 29: Cleared some unused flags from Lagon

const VERSION_STRING = APP_NAME + " " + VERSION_MAJOR + "." + VERSION_MINOR + "." + VERSION_SUBSCRIPT + ": " + VERSION_NAME;

const HEADER_FONT  = "bold 30pt Calibri";
const BUTTON_FONT  = "bold 14pt Tahoma, 'Droid Sans', sans-serif";
const SMALL_FONT   = "16pt Calibri";
const DEFAULT_FONT = "20pt Calibri";
const LARGE_FONT   = "26pt Calibri";

const Unit = {
	metric   : 0,
	american : 1
}

var MEASUREUNIT = Unit.metric;
//var MEASUREUNIT = Unit.american; TODO

var DEBUG = false;

var RENDER_PICTURES = true;
