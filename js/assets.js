

var Images = {};

Images.bg           = "data/paper.jpg";

Images.pc_male      = "data/male_pc.png";
Images.pc_fem       = "data/fem_pc.png";

Images.kiakai       = "data/avatar_kiakai.png";
Images.maria        = "data/avatar_maria.png";
Images.cveta        = "data/cveta.png";
Images.cveta_b      = "data/cveta_b.png";
Images.gwendy       = "data/avatar_gwendy.png";
Images.miranda      = "data/miranda.png";
Images.roa          = "data/roa_avatar.png";
Images.sylistraxia  = "data/sylistraxia_avatar.png";
Images.lei          = "data/lei_avatar.png";
Images.terry        = "data/terry.png";
Images.terry_c      = "data/terry_c.png";
Images.momo         = "data/momo.png";
Images.layla        = "data/layla.png";
Images.layla_f      = "data/layla_f.png";
Images.uru1         = "data/uru1.png";

Images.lagon_r      = "data/lagon_r.png";
Images.lagon_b      = "data/lagon_b.png";
Images.ophelia_b    = "data/ophelia_b.png";

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
Images.puma_male    = "data/puma_m.png";
Images.puma_fem     = "data/puma_f.png";
Images.jaguar_male  = "data/jaguar_m.png";
Images.jaguar_fem   = "data/jaguar_f.png";
Images.lynx_male    = "data/lynx_m.png";
Images.lynx_fem     = "data/lynx_f.png";
Images.lizard_male  = "data/lizard_male.png";
Images.lizard_fem   = "data/lizard_fem.png";
Images.mothgirl     = "data/moth.png";
Images.wolf         = "data/wolf.png";
Images.zebra        = "data/zebra.png";
Images.zebra_b      = "data/zebra_b.png";
Images.scorp        = "data/scorp.png";
Images.naga         = "data/naga.png";
Images.drake        = "data/drake.png";
Images.gol          = "data/gol.png";

Images.bandit_male1 = "data/bandit_male1.png";
Images.bandit_male2 = "data/bandit_male2.png";
Images.bandit_female1 = "data/bandit_female1.png";
Images.knight       = "data/knight.png";

Images.golemboss    = "data/golem.png";
Images.corr_orchid  = "data/orchid.png";
Images.corishev     = "data/corishev.png";

Images.imgButtonEnabled     = "data/gui/big_blue.png";
Images.imgButtonEnabled2    = "data/gui/big_green.png";
Images.imgButtonDisabled    = "data/gui/big_gray.png";
Images.imgNavButtonEnabled  = "data/gui/small_blue.png";
Images.imgNavButtonDisabled = "data/gui/small_gray.png";

Images.imgSearchEnabled     = "data/gui/search_enabled.png";
Images.imgSearchDisabled    = "data/gui/search_disabled.png";
Images.imgWaitEnabled       = "data/gui/wait_enabled.png";
Images.imgWaitDisabled      = "data/gui/wait_disabled.png";
Images.imgSleepEnabled      = "data/gui/sleep_enabled.png";
Images.imgSleepDisabled     = "data/gui/sleep_disabled.png";

function LoadImages() {
	//Fill image array
	var imageArray = [];
	for(var image in Images)
		imageArray.push(Images[image]);
	LoadCardImages(imageArray);
	LoadStatusImages(imageArray);
	
	// fetch HTML5 progress element
	var progress = document.getElementById('progressDiv');
	progress.setAttribute('max', imageArray.length);
	progress.setAttribute('value', 0);
	
	var legend = document.getElementById('progressLabel');
	
	// Show progress element
	assetsOverlay();
	
	// instantiate the pre-loader with an onProgress and onComplete handler
	new preLoader(imageArray, {
	    onProgress: function(img, imageEl, index) {
	        // fires every time an image is done or errors. 
	        // imageEl will be falsy if error
	        //console.log('just ' +  (!imageEl ? 'failed: ' : 'loaded: ') + img);
	        
	        var percent = Math.floor((100 / this.queue.length) * this.completed.length);
	        
	        // update the progress element
	        legend.innerHTML = '<span>' + index + ' / ' + this.queue.length + ' ('+percent+'%)</span>';
	        progress.value = index;
	        
	        // can access any propery of this
	        //console.log(this.completed.length + this.errors.length + ' / ' + this.queue.length + ' done');
	    }, 
	    onComplete: function(loaded, errors) {
	        // fires when whole list is done. cache is primed.
	        //console.log('done', loaded);
	        
			assetsOverlay();
			
			// Go to credits screen
			SplashScreen();
			// Render first frame
			setTimeout(Render, 100);
	        
	        if(errors) {
	            console.log('the following failed', errors);
	        }
	    }
	});
}

function assetsOverlay() {
	var el = document.getElementById("overlay_assets");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}
