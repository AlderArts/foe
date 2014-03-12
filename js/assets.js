

var Images = {};

Images.bg           = new Image();

Images.pc_male      = new Image();
Images.pc_fem       = new Image();

Images.kiakai       = new Image();
Images.maria        = new Image();
Images.gwendy       = new Image();
Images.miranda      = new Image();
Images.roa          = new Image();
Images.sylistraxia  = new Image();
Images.lei          = new Image();

Images.imp          = new Image();
Images.introdemon   = new Image();
Images.stallion     = new Image();
Images.mare         = new Image();
Images.lago_male    = new Image();
Images.lago_fem     = new Image();
Images.lago_brute   = new Image();
Images.lago_brain   = new Image();
Images.wildcat_male = new Image();
Images.wildcat_fem  = new Image();
Images.lizard_male  = new Image();
Images.lizard_fem   = new Image();
Images.mothgirl     = new Image();
Images.wolf         = new Image();
Images.scorp        = new Image();
Images.drake        = new Image();

Images.bandit_male1 = new Image();
Images.bandit_male2 = new Image();

Images.golemboss    = new Image();

var NUM_ASSETS = 0;

function LoadImages() {
	assetsOverlay();
	
	var count = 0;
	
	var ready = function() { count++; };
	LoadImage(Images.bg,      "data/paper.jpg", ready);
	LoadImage(Images.pc_male, "data/male_pc.png", ready);
	LoadImage(Images.pc_fem,  "data/fem_pc.png", ready);
	
	LoadImage(Images.kiakai,       "data/avatar_kiakai.png", ready);
	LoadImage(Images.maria,        "data/avatar_maria.png", ready);
	LoadImage(Images.gwendy,       "data/avatar_gwendy.png", ready);
	LoadImage(Images.miranda,      "data/miranda_avatar.png", ready);
	LoadImage(Images.roa,          "data/roa_avatar.png", ready);
	LoadImage(Images.sylistraxia,  "data/sylistraxia_avatar.png", ready);
	LoadImage(Images.lei,          "data/lei_avatar.png", ready);
	
	LoadImage(Images.imp,          "data/imp.png", ready);
	LoadImage(Images.introdemon,   "data/introdemon.png", ready);
	LoadImage(Images.stallion,     "data/stallion.png", ready);
	LoadImage(Images.mare,         "data/mare.png", ready);
	LoadImage(Images.lago_male,    "data/lago_male.png", ready);
	LoadImage(Images.lago_fem,     "data/lago_fem.png", ready);
	LoadImage(Images.lago_brute,   "data/lago_brute.png", ready);
	LoadImage(Images.lago_brain,   "data/lago_brain.png", ready);
	LoadImage(Images.wildcat_male, "data/wildcat_male.png", ready);
	LoadImage(Images.wildcat_fem,  "data/wildcat_fem.png", ready);
	LoadImage(Images.lizard_male,  "data/lizard_male.png", ready);
	LoadImage(Images.lizard_fem,   "data/lizard_fem.png", ready);
	LoadImage(Images.mothgirl,     "data/moth.png", ready);
	LoadImage(Images.wolf,         "data/wolf.png", ready);
	LoadImage(Images.scorp,        "data/scorp.png", ready);
	LoadImage(Images.drake,        "data/drake.png", ready);
	
	LoadImage(Images.bandit_male1, "data/bandit_male1.png", ready);
	LoadImage(Images.bandit_male2, "data/bandit_male2.png", ready);
	
	LoadImage(Images.golemboss,    "data/golem.png", ready);
	
	LoadImage(Input.imgButtonEnabled,     "data/gui/button_big_enabled.png", ready);
	LoadImage(Input.imgButtonEnabled2,    "data/gui/button_big_enabled2.png", ready);
	LoadImage(Input.imgButtonDisabled,    "data/gui/button_big_disabled.png", ready);
	LoadImage(Input.imgNavButtonEnabled,  "data/gui/button_small_enabled.png", ready);
	LoadImage(Input.imgNavButtonDisabled, "data/gui/button_small_disabled.png", ready);
	
	LoadImage(Input.imgSearchEnabled,  "data/gui/search_enabled.png", ready);
	LoadImage(Input.imgSearchDisabled, "data/gui/search_disabled.png", ready);
	LoadImage(Input.imgWaitEnabled,    "data/gui/wait_enabled.png", ready);
	LoadImage(Input.imgWaitDisabled,   "data/gui/wait_disabled.png", ready);
	LoadImage(Input.imgSleepEnabled,   "data/gui/sleep_enabled.png", ready);
	LoadImage(Input.imgSleepDisabled,  "data/gui/sleep_disabled.png", ready);
	
	LoadCardImages(ready);
	
	LoadStatusImages(ready);
	
	var loaderFunc = setInterval(function() {
		var el = document.getElementById("progressDiv");
		el.innerHTML = "Loading assets: " + count + "/" + NUM_ASSETS;
		
		if(count == NUM_ASSETS) {
			clearInterval(loaderFunc);
    		assetsOverlay();
    		
			// Go to credits screen
			SplashScreen();
			// Render first frame
			setTimeout(Render, 100);
		}
	}, 100);
}

function assetsOverlay() {
	var el = document.getElementById("overlay_assets");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}

LoadImage = function(image, src, func) {
	NUM_ASSETS++;
	image.src    = src;
	image.onload = func;
}
