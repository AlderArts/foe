let preloader = require('preloader');

import { StatusEffect } from './statuseffect';
import { Items } from './item';

var Images = {};

Images.bg           = "assets/img/gui/background.jpg";

Images.pc_male      = "assets/img/male_pc.png";
Images.pc_fem       = "assets/img/fem_pc.png";

Images.kiakai       = "assets/img/avatar_kiakai.png";
Images.maria        = "assets/img/avatar_maria.png";
Images.cveta        = "assets/img/cveta.png";
Images.cveta_b      = "assets/img/cveta_b.png";
Images.gwendy       = "assets/img/avatar_gwendy.png";
Images.miranda      = "assets/img/miranda.png";
Images.roa          = "assets/img/roa_avatar.png";
Images.sylistraxia  = "assets/img/sylistraxia_avatar.png";
Images.lei          = "assets/img/lei_avatar.png";
Images.terry        = "assets/img/terry.png";
Images.terry_c      = "assets/img/terry_c.png";
Images.momo         = "assets/img/momo.png";
Images.layla        = "assets/img/layla.png";
Images.layla_f      = "assets/img/layla_f.png";
Images.uru1         = "assets/img/uru1.png";
Images.cassidy      = "assets/img/avatar_cass.png";

Images.lagon_r      = "assets/img/lagon_r.png";
Images.lagon_b      = "assets/img/lagon_b.png";
Images.ophelia_b    = "assets/img/ophelia_b.png";

Images.imp          = "assets/img/imp.png";
Images.introdemon   = "assets/img/introdemon.png";
Images.stallion     = "assets/img/stallion.png";
Images.mare         = "assets/img/mare.png";
Images.lago_male    = "assets/img/lago_male.png";
Images.lago_fem     = "assets/img/lago_fem.png";
Images.lago_brute   = "assets/img/lago_brute.png";
Images.lago_brain   = "assets/img/lago_brain.png";
Images.wildcat_male = "assets/img/wildcat_male.png";
Images.wildcat_fem  = "assets/img/wildcat_fem.png";
Images.puma_male    = "assets/img/puma_m.png";
Images.puma_fem     = "assets/img/puma_f.png";
Images.jaguar_male  = "assets/img/jaguar_m.png";
Images.jaguar_fem   = "assets/img/jaguar_f.png";
Images.lynx_male    = "assets/img/lynx_m.png";
Images.lynx_fem     = "assets/img/lynx_f.png";
Images.lizard_male  = "assets/img/lizard_male.png";
Images.lizard_fem   = "assets/img/lizard_fem.png";
Images.mothgirl     = "assets/img/moth.png";
Images.wolf         = "assets/img/wolf.png";
Images.zebra        = "assets/img/zebra.png";
Images.zebra_b      = "assets/img/zebra_b.png";
Images.scorp        = "assets/img/scorp.png";
Images.naga         = "assets/img/naga.png";
Images.drake        = "assets/img/drake.png";
Images.gol          = "assets/img/gol.png";
Images.catboy       = "assets/img/catboy.png";
Images.centaur_mare = "assets/img/centaur_mare.png";
Images.old_goat     = "assets/img/goat.png";

Images.bandit_male1 = "assets/img/bandit_male1.png";
Images.bandit_male2 = "assets/img/bandit_male2.png";
Images.bandit_female1 = "assets/img/bandit_female1.png";
Images.knight       = "assets/img/knight.png";

Images.golemboss    = "assets/img/golem.png";
Images.corr_orchid  = "assets/img/orchid.png";
Images.corishev     = "assets/img/corishev.png";

Images.imgButtonEnabled     = "assets/img/gui/big_blue.png";
Images.imgButtonEnabled2    = "assets/img/gui/big_green.png";
Images.imgButtonDisabled    = "assets/img/gui/big_gray.png";
Images.imgNavButtonEnabled  = "assets/img/gui/small_blue.png";
Images.imgNavButtonDisabled = "assets/img/gui/small_gray.png";

Images.imgSearchEnabled     = "assets/img/gui/search_enabled.png";
Images.imgSearchDisabled    = "assets/img/gui/search_disabled.png";
Images.imgWaitEnabled       = "assets/img/gui/wait_enabled.png";
Images.imgWaitDisabled      = "assets/img/gui/wait_disabled.png";
Images.imgSleepEnabled      = "assets/img/gui/sleep_enabled.png";
Images.imgSleepDisabled     = "assets/img/gui/sleep_disabled.png";

var LoadImages = function(onComplete) {
	let loader = preloader({
		xhrImages: false
	});

	//Fill image array
	var imageArray = [];
	for(var image in Images)
		imageArray.push(Images[image]);
	LoadCardImages(imageArray);
	LoadStatusImages(imageArray);

	// fetch HTML5 progress element
	var legend = document.getElementById('progressLabel');

	// Show progress element
	assetsOverlay();

	loader.on('progress', function(progress) {
		// update the progress element
		legend.innerHTML = '<span>Loading assets... ' + progress * 100 + '%</span>';
	});
	loader.on('complete', onComplete);

	for(var image of imageArray) {
		loader.add(image);
	}

	loader.load();
}

var assetsOverlay = function() {
	var el = document.getElementById("overlay_assets");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}

let LoadCardImages = function(imageArray) {
	Items.Cards.Light[0].Img    = "assets/img/cards/L1.png";
	Items.Cards.Light[1].Img    = "assets/img/cards/L2.png";
	Items.Cards.Light[2].Img    = "assets/img/cards/L3.png";
	Items.Cards.Light[3].Img    = "assets/img/cards/L4.png";
	Items.Cards.Light[4].Img    = "assets/img/cards/L5.png";
	Items.Cards.Darkness[0].Img = "assets/img/cards/D1.png";
	Items.Cards.Darkness[1].Img = "assets/img/cards/D2.png";
	Items.Cards.Darkness[2].Img = "assets/img/cards/D3.png";
	Items.Cards.Darkness[3].Img = "assets/img/cards/D4.png";
	Items.Cards.Darkness[4].Img = "assets/img/cards/D5.png";
	Items.Cards.Shadow[0].Img   = "assets/img/cards/S1.png";
	Items.Cards.Shadow[1].Img   = "assets/img/cards/S2.png";
	Items.Cards.Shadow[2].Img   = "assets/img/cards/S3.png";
	Items.Cards.Shadow[3].Img   = "assets/img/cards/S4.png";
	Items.Cards.Shadow[4].Img   = "assets/img/cards/S5.png";

	Images.card_back            = "assets/img/cards/back.png";

	var cards = [
		Items.Cards.Light[0].Img,
		Items.Cards.Light[1].Img,
		Items.Cards.Light[2].Img,
		Items.Cards.Light[3].Img,
		Items.Cards.Light[4].Img,
		Items.Cards.Darkness[0].Img,
		Items.Cards.Darkness[1].Img,
		Items.Cards.Darkness[2].Img,
		Items.Cards.Darkness[3].Img,
		Items.Cards.Darkness[4].Img,
		Items.Cards.Shadow[0].Img,
		Items.Cards.Shadow[1].Img,
		Items.Cards.Shadow[2].Img,
		Items.Cards.Shadow[3].Img,
		Items.Cards.Shadow[4].Img,
		Images.card_back
	];

	for(var i = 0; i < cards.length; i++)
		imageArray.push(cards[i]);
}

function LoadStatusImages(imageArray) {
	Images.status = [];
	for(var i = 0; i < StatusEffect.LAST; i++) {
		Images.status[i]  = "";
	}

	// Status effects
	Images.status[StatusEffect.Burn]     = "assets/img/status/burn.png";
	Images.status[StatusEffect.Freeze]   = "assets/img/status/freeze.png";
	Images.status[StatusEffect.Numb]     = "assets/img/status/numb.png";
	Images.status[StatusEffect.Venom]    = "assets/img/status/venom.png";
	Images.status[StatusEffect.Blind]    = "assets/img/status/blind.png";
	Images.status[StatusEffect.Siphon]   = "assets/img/status/siphon.png";
	Images.status[StatusEffect.Sleep]    = "assets/img/status/sleep.png";
	Images.status[StatusEffect.Bleed]    = "assets/img/status/bleed.png";
	Images.status[StatusEffect.Haste]    = "assets/img/status/haste.png";
	Images.status[StatusEffect.Slow]     = "assets/img/status/slow.png";
	Images.status[StatusEffect.Horny]    = "assets/img/status/horny.png";
	Images.status[StatusEffect.Aroused]  = "assets/img/status/aroused.png";
	Images.status[StatusEffect.Limp]     = "assets/img/status/limp.png";
	Images.status[StatusEffect.Decoy]    = "assets/img/status/decoy.png";
	Images.status[StatusEffect.Counter]  = "assets/img/status/counter.png";
	Images.status[StatusEffect.Full]     = "assets/img/status/full.png";
	Images.status[StatusEffect.Confuse]  = "assets/img/status/confuse.png";
	Images.status[StatusEffect.Weakness] = "assets/img/status/weakness.png";
	Images.status[StatusEffect.Buff]     = "assets/img/status/buff.png";
	Images.status[StatusEffect.Curse]    = "assets/img/status/curse.png";
	
	for(var i = 0; i < StatusEffect.LAST; i++) {
		if(Images.status[i] == "") continue;
		imageArray.push(Images.status[i]);
	}
}

export { Images, LoadImages };
