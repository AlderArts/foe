let Rand = function(max : number) {
	var r = Math.floor(Math.random() * max);
	return (r < max) ? r : max - 1;
}

const Unit = {
	CmToInch   : function(cm : number) { return cm / 2.54; },
	InchToFoot : function(inch : number) { return inch / 12; },
	MToFoot    : function(m : number) { return m * 3.28; },
	KgToPound  : function(kg : number) { return kg * 2.2; },
}

/*
	$.generateFile({
		filename	: 'export.txt',
		content		: $('textarea').val(),
		script		: 'download.php'
	});
 */
// Download script, used for save to file. Calls download.php
let GenerateFile : any = function(options? : any) {
	options = options || {};
	options.script = options.script || "download.php";

	if(!options.filename || !options.content){
		throw new Error("Please enter all the required config options!");
	}

	// Creating a 1 by 1 px invisible iframe:

	var iframe = $('<iframe>',{
		width:1,
		height:1,
		frameborder:0,
		css:{
			display:'none'
		}
	}).appendTo('body');

	var formHTML = '<form action="" method="post">'+
		'<input type="hidden" name="filename" />'+
		'<input type="hidden" name="content" />'+
		'</form>';

	// Giving IE a chance to build the DOM in
	// the iframe with a short timeout:

	setTimeout(function(){

		// The body element of the iframe document:

		var body = (iframe.prop('contentDocument') !== undefined) ?
					iframe.prop('contentDocument').body :
					iframe.prop('document').body;	// IE

		body = $(body);

		// Adding the form to the body:
		body.html(formHTML);

		var form = body.find('form');

		form.attr('action',options.script);
		form.find('input[name=filename]').val(options.filename);
		form.find('input[name=content]').val(options.content);

		// Submitting the form to download.php. This will
		// cause the file download dialog box to appear.

		form.submit();
	}, 50);
};
GenerateFile.canSaveOffline = false;

(function(){
	// calling convention for destroying local variables instead of keeping them in global namespace
	var lnk : HTMLAnchorElement;
	try {
		new Blob([JSON.stringify({"obj":"discarded"})],{"type":"application/json"});
		var fl = new File([JSON.stringify({"obj":"discarded"})],"FoE.json",{"type":"application/json"});
		lnk = document.createElement("a");
		if (typeof lnk.hidden !== "boolean" || typeof lnk.href !== "string" || typeof lnk.download !== "string" || typeof lnk.click !== "function") {
			throw 'Anchor element does not support all necessary features';
		}
		var url = URL.createObjectURL(fl);
		URL.revokeObjectURL(url);
		lnk.hidden = true;
		lnk.download = "application/json";
		document.body.appendChild(lnk);
	}
	catch(msg) {
		console.log('Desired features not supported. "Save to file" can only work through server. ', msg);
		return;
	}
	// if no exceptions are thrown, we simply replace the GenerateFile function with this one
	GenerateFile = function(options : any) {
		if(!options.filename || !options.content) {
			throw new Error("Please enter all the required config options!");
		}
		if (lnk.href !== "") {
			// remove any old data from lingering system resources
			URL.revokeObjectURL(lnk.href);
		}
		var fl = new File([options.content], options.filename, {"type":"application/json"});
		lnk.href = URL.createObjectURL(fl);
		lnk.download = options.filename;
		lnk.click();
	}
	GenerateFile.canSaveOffline = true;
})();

export { Unit, GenerateFile, Rand };
