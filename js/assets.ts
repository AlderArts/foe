let preloader = require('preloader');

import * as _ from 'lodash';
import * as $ from 'jquery';

import { StatusEffect } from './statuseffect';
import { CardItems } from './items/cards';

let Images : any = {};

Images.status = [];

Images.bg           = require('../assets/img/gui/background.jpg');
// Big images
Images.uru          = require('../assets/img/uru.png');
Images.kiakai_full  = require('../assets/img/kiakai.png');
Images.aria         = require('../assets/img/aria.png');

// Avatars
Images.pc_male      = require('../assets/img/male_pc.png');
Images.pc_fem       = require('../assets/img/fem_pc.png');

Images.kiakai       = require('../assets/img/avatar_kiakai.png');
Images.maria        = require('../assets/img/avatar_maria.png');
Images.cveta        = require('../assets/img/cveta.png');
Images.cveta_b      = require('../assets/img/cveta_b.png');
Images.gwendy       = require('../assets/img/avatar_gwendy.png');
Images.miranda      = require('../assets/img/miranda.png');
Images.roa          = require('../assets/img/roa_avatar.png');
Images.sylistraxia  = require('../assets/img/sylistraxia_avatar.png');
Images.lei          = require('../assets/img/lei_avatar.png');
Images.terry        = require('../assets/img/terry.png');
Images.terry_c      = require('../assets/img/terry_c.png');
Images.momo         = require('../assets/img/momo.png');
Images.layla        = require('../assets/img/layla.png');
Images.layla_f      = require('../assets/img/layla_f.png');
Images.uru1         = require('../assets/img/uru1.png');
Images.cassidy      = require('../assets/img/avatar_cass.png');

Images.lagon_r      = require('../assets/img/lagon_r.png');
Images.lagon_b      = require('../assets/img/lagon_b.png');
Images.ophelia_b    = require('../assets/img/ophelia_b.png');

Images.imp          = require('../assets/img/imp.png');
Images.introdemon   = require('../assets/img/introdemon.png');
Images.stallion     = require('../assets/img/stallion.png');
Images.mare         = require('../assets/img/mare.png');
Images.lago_male    = require('../assets/img/lago_male.png');
Images.lago_fem     = require('../assets/img/lago_fem.png');
Images.lago_brute   = require('../assets/img/lago_brute.png');
Images.lago_brain   = require('../assets/img/lago_brain.png');
Images.wildcat_male = require('../assets/img/wildcat_male.png');
Images.wildcat_fem  = require('../assets/img/wildcat_fem.png');
Images.puma_male    = require('../assets/img/puma_m.png');
Images.puma_fem     = require('../assets/img/puma_f.png');
Images.jaguar_male  = require('../assets/img/jaguar_m.png');
Images.jaguar_fem   = require('../assets/img/jaguar_f.png');
Images.lynx_male    = require('../assets/img/lynx_m.png');
Images.lynx_fem     = require('../assets/img/lynx_f.png');
Images.lizard_male  = require('../assets/img/lizard_male.png');
Images.lizard_fem   = require('../assets/img/lizard_fem.png');
Images.mothgirl     = require('../assets/img/moth.png');
Images.wolf         = require('../assets/img/wolf.png');
Images.zebra        = require('../assets/img/zebra.png');
Images.zebra_b      = require('../assets/img/zebra_b.png');
Images.scorp        = require('../assets/img/scorp.png');
Images.naga         = require('../assets/img/naga.png');
Images.drake        = require('../assets/img/drake.png');
Images.gol          = require('../assets/img/gol.png');
Images.catboy       = require('../assets/img/catboy.png');
Images.centaur_mare = require('../assets/img/centaur_mare.png');
Images.old_goat     = require('../assets/img/goat.png');

Images.bandit_male1 = require('../assets/img/bandit_male1.png');
Images.bandit_male2 = require('../assets/img/bandit_male2.png');
Images.bandit_female1 = require('../assets/img/bandit_female1.png');
Images.knight       = require('../assets/img/knight.png');

Images.golemboss    = require('../assets/img/golem.png');
Images.corr_orchid  = require('../assets/img/orchid.png');
Images.corishev     = require('../assets/img/corishev.png');

Images.imgButtonEnabled     = require('../assets/img/gui/big_blue.png');
Images.imgButtonEnabled2    = require('../assets/img/gui/big_green.png');
Images.imgButtonDisabled    = require('../assets/img/gui/big_gray.png');
Images.imgNavButtonEnabled  = require('../assets/img/gui/small_blue.png');
Images.imgNavButtonDisabled = require('../assets/img/gui/small_gray.png');

Images.imgSearchEnabled     = require('../assets/img/gui/search_enabled.png');
Images.imgSearchDisabled    = require('../assets/img/gui/search_disabled.png');
Images.imgWaitEnabled       = require('../assets/img/gui/wait_enabled.png');
Images.imgWaitDisabled      = require('../assets/img/gui/wait_disabled.png');
Images.imgSleepEnabled      = require('../assets/img/gui/sleep_enabled.png');
Images.imgSleepDisabled     = require('../assets/img/gui/sleep_disabled.png');

var LoadImages = function(onComplete : CallableFunction) {
	let loader = preloader({
		xhrImages: false
	});

	//Fill image array
	let imageArray = [];
	for(let image in Images) {
		if(_.isArray(Images[image])) continue;
		imageArray.push(Images[image]);
	}
	LoadCardImages(imageArray);
	LoadStatusImages(imageArray);

	// fetch HTML5 progress element
	let legend : any = $('#progressLabel');

	// Show progress element
	assetsOverlay();

	loader.on('progress', function(progress : number) {
		// update the progress element
		legend.innerHTML = '<span>Loading assets... ' + progress * 100 + '%</span>';
	});
	loader.on('complete', onComplete);

	for(let image of imageArray) {
		loader.add(image);
	}

	loader.load();
}

let assetsOverlay = function() {
	let el = document.getElementById("overlay_assets");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}

let LoadCardImages = function(imageArray : any[]) {
	CardItems.Light[0].Img    = require('../assets/img/cards/L1.png');
	CardItems.Light[1].Img    = require('../assets/img/cards/L2.png');
	CardItems.Light[2].Img    = require('../assets/img/cards/L3.png');
	CardItems.Light[3].Img    = require('../assets/img/cards/L4.png');
	CardItems.Light[4].Img    = require('../assets/img/cards/L5.png');
	CardItems.Darkness[0].Img = require('../assets/img/cards/D1.png');
	CardItems.Darkness[1].Img = require('../assets/img/cards/D2.png');
	CardItems.Darkness[2].Img = require('../assets/img/cards/D3.png');
	CardItems.Darkness[3].Img = require('../assets/img/cards/D4.png');
	CardItems.Darkness[4].Img = require('../assets/img/cards/D5.png');
	CardItems.Shadow[0].Img   = require('../assets/img/cards/S1.png');
	CardItems.Shadow[1].Img   = require('../assets/img/cards/S2.png');
	CardItems.Shadow[2].Img   = require('../assets/img/cards/S3.png');
	CardItems.Shadow[3].Img   = require('../assets/img/cards/S4.png');
	CardItems.Shadow[4].Img   = require('../assets/img/cards/S5.png');

	Images.card_back          = require('../assets/img/cards/back.png');

	let cards = [
		CardItems.Light[0].Img,
		CardItems.Light[1].Img,
		CardItems.Light[2].Img,
		CardItems.Light[3].Img,
		CardItems.Light[4].Img,
		CardItems.Darkness[0].Img,
		CardItems.Darkness[1].Img,
		CardItems.Darkness[2].Img,
		CardItems.Darkness[3].Img,
		CardItems.Darkness[4].Img,
		CardItems.Shadow[0].Img,
		CardItems.Shadow[1].Img,
		CardItems.Shadow[2].Img,
		CardItems.Shadow[3].Img,
		CardItems.Shadow[4].Img,
		Images.card_back
	];

	for(var i = 0; i < cards.length; i++)
		imageArray.push(cards[i]);
}

function LoadStatusImages(imageArray : any[]) {
	for(var i = 0; i < StatusEffect.LAST; i++) {
		Images.status[i]  = "";
	}

	// Status effects
	Images.status[StatusEffect.Burn]     = require('../assets/img/status/burn.png');
	Images.status[StatusEffect.Freeze]   = require('../assets/img/status/freeze.png');
	Images.status[StatusEffect.Numb]     = require('../assets/img/status/numb.png');
	Images.status[StatusEffect.Venom]    = require('../assets/img/status/venom.png');
	Images.status[StatusEffect.Blind]    = require('../assets/img/status/blind.png');
	Images.status[StatusEffect.Siphon]   = require('../assets/img/status/siphon.png');
	Images.status[StatusEffect.Sleep]    = require('../assets/img/status/sleep.png');
	Images.status[StatusEffect.Bleed]    = require('../assets/img/status/bleed.png');
	Images.status[StatusEffect.Haste]    = require('../assets/img/status/haste.png');
	Images.status[StatusEffect.Slow]     = require('../assets/img/status/slow.png');
	Images.status[StatusEffect.Horny]    = require('../assets/img/status/horny.png');
	Images.status[StatusEffect.Aroused]  = require('../assets/img/status/aroused.png');
	Images.status[StatusEffect.Limp]     = require('../assets/img/status/limp.png');
	Images.status[StatusEffect.Decoy]    = require('../assets/img/status/decoy.png');
	Images.status[StatusEffect.Counter]  = require('../assets/img/status/counter.png');
	Images.status[StatusEffect.Full]     = require('../assets/img/status/full.png');
	Images.status[StatusEffect.Confuse]  = require('../assets/img/status/confuse.png');
	Images.status[StatusEffect.Weakness] = require('../assets/img/status/weakness.png');
	Images.status[StatusEffect.Buff]     = require('../assets/img/status/buff.png');
	Images.status[StatusEffect.Curse]    = require('../assets/img/status/curse.png');
	
	for(var i = 0; i < StatusEffect.LAST; i++) {
		if(Images.status[i] == "") continue;
		imageArray.push(Images.status[i]);
	}
}

export { Images, LoadImages, assetsOverlay };
