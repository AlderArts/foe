

var Images = {};

Images.bg           = "data/paper.jpg";

Images.pc_male      = "data/male_pc.png";
Images.pc_fem       = "data/fem_pc.png";

Images.kiakai       = "data/avatar_kiakai.png";
Images.maria        = "data/avatar_maria.png";
Images.gwendy       = "data/avatar_gwendy.png";
Images.miranda      = "data/miranda_avatar.png";
Images.roa          = "data/roa_avatar.png";
Images.sylistraxia  = "data/sylistraxia_avatar.png";
Images.lei          = "data/lei_avatar.png";

Images.imp          = "data/imp.png";
Images.introdemon   = "data/introdemon.png";
Images.stallion     = "data/stallion.png";
Images.mare         = "data/mare.png";
Images.lago_male    = "data/lago_male.png";
Images.lago_fem     = "data/lago_fem.png";
Images.lago_brute   = "data/lago_brute.png";
Images.lago_brain   = "data/lago_brain.png";
Images.wildcat_male = "data/wildcat_male.png";
Images.wildcat_fem  = "data/wildcat_fem.png";
Images.lizard_male  = "data/lizard_male.png";
Images.lizard_fem   = "data/lizard_fem.png";
Images.mothgirl     = "data/moth.png";
Images.wolf         = "data/wolf.png";
Images.scorp        = "data/scorp.png";
Images.drake        = "data/drake.png";

Images.bandit_male1 = "data/bandit_male1.png";
Images.bandit_male2 = "data/bandit_male2.png";

Images.golemboss    = "data/golem.png";




Images.imgButtonEnabled     = "data/gui/button_big_enabled.png";
Images.imgButtonEnabled2    = "data/gui/button_big_enabled2.png";
Images.imgButtonDisabled    = "data/gui/button_big_disabled.png";
Images.imgNavButtonEnabled  = "data/gui/button_small_enabled.png";
Images.imgNavButtonDisabled = "data/gui/button_small_disabled.png";

Images.imgSearchEnabled     = "data/gui/search_enabled.png";
Images.imgSearchDisabled    = "data/gui/search_disabled.png";
Images.imgWaitEnabled       = "data/gui/wait_enabled.png";
Images.imgWaitDisabled      = "data/gui/wait_disabled.png";
Images.imgSleepEnabled      = "data/gui/sleep_enabled.png";
Images.imgSleepDisabled     = "data/gui/sleep_disabled.png";

function LoadImages() {
	LoadCardImages();
	
	LoadStatusImages();
	
	SplashScreen();
}
