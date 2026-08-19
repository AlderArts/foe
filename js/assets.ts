import preloader from "preloader";

import $ from "jquery";
import * as _ from "lodash";

import { CardItems } from "./engine/cavalcade/cards";
import { StatusEffect } from "./engine/combat/statuseffect";

// Background
import bg from "../assets/img/gui/background.jpg";
// Big images
import uru from "../assets/img/uru.png";
import kiakaiFull from "../assets/img/kiakai.png";
import aria from "../assets/img/aria.png";

// Avatars
import pcMale from "../assets/img/male_pc.png";
import pcFem from "../assets/img/fem_pc.png";

import kiakai from "../assets/img/avatar_kiakai.png";
import maria from "../assets/img/avatar_maria.png";
import cveta from "../assets/img/cveta.png";
import cvetaB from "../assets/img/cveta_b.png";
import gwendy from "../assets/img/avatar_gwendy.png";
import miranda from "../assets/img/miranda.png";
import roa from "../assets/img/roa_avatar.png";
import sylistraxia from "../assets/img/sylistraxia_avatar.png";
import lei from "../assets/img/lei_avatar.png";
import terry from "../assets/img/terry.png";
import terryC from "../assets/img/terry_c.png";
import momo from "../assets/img/momo.png";
import layla from "../assets/img/layla.png";
import laylaF from "../assets/img/layla_f.png";
import uru1 from "../assets/img/uru1.png";
import cassidy from "../assets/img/avatar_cass.png";

import lagonR from "../assets/img/lagon_r.png";
import lagonB from "../assets/img/lagon_b.png";
import opheliaB from "../assets/img/ophelia_b.png";

import imp from "../assets/img/imp.png";
import introdemon from "../assets/img/introdemon.png";
import stallion from "../assets/img/stallion.png";
import mare from "../assets/img/mare.png";
import lagoMale from "../assets/img/lago_male.png";
import lagoFem from "../assets/img/lago_fem.png";
import lagoBrute from "../assets/img/lago_brute.png";
import lagoBrain from "../assets/img/lago_brain.png";
import wildcatMale from "../assets/img/wildcat_male.png";
import wildcatFem from "../assets/img/wildcat_fem.png";
import pumaMale from "../assets/img/puma_m.png";
import pumaFem from "../assets/img/puma_f.png";
import jaguarMale from "../assets/img/jaguar_m.png";
import jaguarFem from "../assets/img/jaguar_f.png";
import lynxMale from "../assets/img/lynx_m.png";
import lynxFem from "../assets/img/lynx_f.png";
import lizardMale from "../assets/img/lizard_male.png";
import lizardFem from "../assets/img/lizard_fem.png";
import mothgirl from "../assets/img/moth.png";
import wolf from "../assets/img/wolf.png";
import zebra from "../assets/img/zebra.png";
import zebraB from "../assets/img/zebra_b.png";
import scorp from "../assets/img/scorp.png";
import naga from "../assets/img/naga.png";
import drake from "../assets/img/drake.png";
import gol from "../assets/img/gol.png";
import catboy from "../assets/img/catboy.png";
import centaurMare from "../assets/img/centaur_mare.png";
import oldGoat from "../assets/img/goat.png";

import banditMale1 from "../assets/img/bandit_male1.png";
import banditMale2 from "../assets/img/bandit_male2.png";
import banditFemale1 from "../assets/img/bandit_female1.png";
import knight from "../assets/img/knight.png";

import golemboss from "../assets/img/golem.png";
import corrOrchid from "../assets/img/orchid.png";
import corishev from "../assets/img/corishev.png";

import imgButtonEnabled from "../assets/img/gui/big_blue.png";
import imgButtonEnabled2 from "../assets/img/gui/big_green.png";
import imgButtonDisabled from "../assets/img/gui/big_gray.png";
import imgNavButtonEnabled from "../assets/img/gui/small_blue.png";
import imgNavButtonDisabled from "../assets/img/gui/small_gray.png";

import imgSearchEnabled from "../assets/img/gui/search_enabled.png";
import imgSearchDisabled from "../assets/img/gui/search_disabled.png";
import imgWaitEnabled from "../assets/img/gui/wait_enabled.png";
import imgWaitDisabled from "../assets/img/gui/wait_disabled.png";
import imgSleepEnabled from "../assets/img/gui/sleep_enabled.png";
import imgSleepDisabled from "../assets/img/gui/sleep_disabled.png";

// Cards
import cardL1 from "../assets/img/cards/L1.png";
import cardL2 from "../assets/img/cards/L2.png";
import cardL3 from "../assets/img/cards/L3.png";
import cardL4 from "../assets/img/cards/L4.png";
import cardL5 from "../assets/img/cards/L5.png";
import cardD1 from "../assets/img/cards/D1.png";
import cardD2 from "../assets/img/cards/D2.png";
import cardD3 from "../assets/img/cards/D3.png";
import cardD4 from "../assets/img/cards/D4.png";
import cardD5 from "../assets/img/cards/D5.png";
import cardS1 from "../assets/img/cards/S1.png";
import cardS2 from "../assets/img/cards/S2.png";
import cardS3 from "../assets/img/cards/S3.png";
import cardS4 from "../assets/img/cards/S4.png";
import cardS5 from "../assets/img/cards/S5.png";
import cardBack from "../assets/img/cards/back.png";

// Status effects
import statusBurn from "../assets/img/status/burn.png";
import statusFreeze from "../assets/img/status/freeze.png";
import statusNumb from "../assets/img/status/numb.png";
import statusVenom from "../assets/img/status/venom.png";
import statusBlind from "../assets/img/status/blind.png";
import statusSiphon from "../assets/img/status/siphon.png";
import statusSleep from "../assets/img/status/sleep.png";
import statusBleed from "../assets/img/status/bleed.png";
import statusHaste from "../assets/img/status/haste.png";
import statusSlow from "../assets/img/status/slow.png";
import statusHorny from "../assets/img/status/horny.png";
import statusAroused from "../assets/img/status/aroused.png";
import statusLimp from "../assets/img/status/limp.png";
import statusDecoy from "../assets/img/status/decoy.png";
import statusCounter from "../assets/img/status/counter.png";
import statusFull from "../assets/img/status/full.png";
import statusConfuse from "../assets/img/status/confuse.png";
import statusWeakness from "../assets/img/status/weakness.png";
import statusBuff from "../assets/img/status/buff.png";
import statusCurse from "../assets/img/status/curse.png";

const Images: any = {};

Images.status = [];

Images.bg           = bg;
// Big images
Images.uru          = uru;
Images.kiakai_full  = kiakaiFull;
Images.aria         = aria;

// Avatars
Images.pc_male      = pcMale;
Images.pc_fem       = pcFem;

Images.kiakai       = kiakai;
Images.maria        = maria;
Images.cveta        = cveta;
Images.cveta_b      = cvetaB;
Images.gwendy       = gwendy;
Images.miranda      = miranda;
Images.roa          = roa;
Images.sylistraxia  = sylistraxia;
Images.lei          = lei;
Images.terry        = terry;
Images.terry_c      = terryC;
Images.momo         = momo;
Images.layla        = layla;
Images.layla_f      = laylaF;
Images.uru1         = uru1;
Images.cassidy      = cassidy;

Images.lagon_r      = lagonR;
Images.lagon_b      = lagonB;
Images.ophelia_b    = opheliaB;

Images.imp          = imp;
Images.introdemon   = introdemon;
Images.stallion     = stallion;
Images.mare         = mare;
Images.lago_male    = lagoMale;
Images.lago_fem     = lagoFem;
Images.lago_brute   = lagoBrute;
Images.lago_brain   = lagoBrain;
Images.wildcat_male = wildcatMale;
Images.wildcat_fem  = wildcatFem;
Images.puma_male    = pumaMale;
Images.puma_fem     = pumaFem;
Images.jaguar_male  = jaguarMale;
Images.jaguar_fem   = jaguarFem;
Images.lynx_male    = lynxMale;
Images.lynx_fem     = lynxFem;
Images.lizard_male  = lizardMale;
Images.lizard_fem   = lizardFem;
Images.mothgirl     = mothgirl;
Images.wolf         = wolf;
Images.zebra        = zebra;
Images.zebra_b      = zebraB;
Images.scorp        = scorp;
Images.naga         = naga;
Images.drake        = drake;
Images.gol          = gol;
Images.catboy       = catboy;
Images.centaur_mare = centaurMare;
Images.old_goat     = oldGoat;

Images.bandit_male1 = banditMale1;
Images.bandit_male2 = banditMale2;
Images.bandit_female1 = banditFemale1;
Images.knight       = knight;

Images.golemboss    = golemboss;
Images.corr_orchid  = corrOrchid;
Images.corishev     = corishev;

Images.imgButtonEnabled     = imgButtonEnabled;
Images.imgButtonEnabled2    = imgButtonEnabled2;
Images.imgButtonDisabled    = imgButtonDisabled;
Images.imgNavButtonEnabled  = imgNavButtonEnabled;
Images.imgNavButtonDisabled = imgNavButtonDisabled;

Images.imgSearchEnabled     = imgSearchEnabled;
Images.imgSearchDisabled    = imgSearchDisabled;
Images.imgWaitEnabled       = imgWaitEnabled;
Images.imgWaitDisabled      = imgWaitDisabled;
Images.imgSleepEnabled      = imgSleepEnabled;
Images.imgSleepDisabled     = imgSleepDisabled;

const LoadImages = (onComplete: CallableFunction) => {
	const loader = preloader({
		xhrImages: false,
	});

	// Fill image array
	const imageArray = [];
	for (const image in Images) {
		if (_.isArray(Images[image])) { continue; }
		imageArray.push(Images[image]);
	}
	LoadCardImages(imageArray);
	LoadStatusImages(imageArray);

	// fetch HTML5 progress element
	const legend: any = $("#progressLabel");

	// Show progress element
	assetsOverlay();

	loader.on("progress", (progress: number) => {
		// update the progress element
		legend.innerHTML = "<span>Loading assets... " + progress * 100 + "%</span>";
	});
	loader.on("complete", onComplete);

	for (const image of imageArray) {
		loader.add(image);
	}

	loader.load();
};

const assetsOverlay = () => {
	const el = document.getElementById("overlay_assets");
	el.style.visibility = (el.style.visibility === "visible") ? "hidden" : "visible";
};

const LoadCardImages = (imageArray: any[]) => {
	CardItems.Light[0].Img    = cardL1;
	CardItems.Light[1].Img    = cardL2;
	CardItems.Light[2].Img    = cardL3;
	CardItems.Light[3].Img    = cardL4;
	CardItems.Light[4].Img    = cardL5;
	CardItems.Darkness[0].Img = cardD1;
	CardItems.Darkness[1].Img = cardD2;
	CardItems.Darkness[2].Img = cardD3;
	CardItems.Darkness[3].Img = cardD4;
	CardItems.Darkness[4].Img = cardD5;
	CardItems.Shadow[0].Img   = cardS1;
	CardItems.Shadow[1].Img   = cardS2;
	CardItems.Shadow[2].Img   = cardS3;
	CardItems.Shadow[3].Img   = cardS4;
	CardItems.Shadow[4].Img   = cardS5;

	Images.card_back          = cardBack;

	const cards = [
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
		Images.card_back,
	];

	for (const card of cards) {
		imageArray.push(card);
	}
};

function LoadStatusImages(imageArray: any[]) {
	for (let i = 0; i < StatusEffect.LAST; i++) {
		Images.status[i]  = "";
	}

	// Status effects
	Images.status[StatusEffect.Burn]     = statusBurn;
	Images.status[StatusEffect.Freeze]   = statusFreeze;
	Images.status[StatusEffect.Numb]     = statusNumb;
	Images.status[StatusEffect.Venom]    = statusVenom;
	Images.status[StatusEffect.Blind]    = statusBlind;
	Images.status[StatusEffect.Siphon]   = statusSiphon;
	Images.status[StatusEffect.Sleep]    = statusSleep;
	Images.status[StatusEffect.Bleed]    = statusBleed;
	Images.status[StatusEffect.Haste]    = statusHaste;
	Images.status[StatusEffect.Slow]     = statusSlow;
	Images.status[StatusEffect.Horny]    = statusHorny;
	Images.status[StatusEffect.Aroused]  = statusAroused;
	Images.status[StatusEffect.Limp]     = statusLimp;
	Images.status[StatusEffect.Decoy]    = statusDecoy;
	Images.status[StatusEffect.Counter]  = statusCounter;
	Images.status[StatusEffect.Full]     = statusFull;
	Images.status[StatusEffect.Confuse]  = statusConfuse;
	Images.status[StatusEffect.Weakness] = statusWeakness;
	Images.status[StatusEffect.Buff]     = statusBuff;
	Images.status[StatusEffect.Curse]    = statusCurse;

	for (let i = 0; i < StatusEffect.LAST; i++) {
		if (Images.status[i] === "") { continue; }
		imageArray.push(Images.status[i]);
	}
}

export { Images, LoadImages, assetsOverlay };
