
let EntityDict = {
	UniqueId : function() {
		return this.ID;
	},

	IdToEntity : function(id) {
		if(id == "player") return player;
		if(id == "kiakai") return kiakai;
		if(id == "miranda") return miranda;
		if(id == "terry") return terry;
		if(id == "momo") return momo;
		if(id == "lei") return lei;
		if(id == "rumi") return twins.rumi;
		if(id == "rani") return twins.rani;
		if(id == "room69") return room69;
		if(id == "chief") return chief;
		if(id == "rosalin") return rosalin;
		if(id == "cale") return cale;
		if(id == "estevan") return estevan;
		if(id == "magnus") return magnus;
		if(id == "patchwork") return patchwork;
		if(id == "lagon") return lagon;
		if(id == "ophelia") return ophelia;
		if(id == "vena") return vena;
		if(id == "roa") return roa;
		if(id == "gwendy") return gwendy;
		if(id == "danie") return danie;
		if(id == "adrian") return adrian;
		if(id == "layla") return layla;
		if(id == "aquilius") return aquilius;
		if(id == "maria") return maria;
		if(id == "cveta") return cveta;
		if(id == "vaughn") return vaughn;
		if(id == "fera") return fera;
		if(id == "asche") return asche;
		if(id == "jeanne") return jeanne;
		if(id == "golem") return golem;
		if(id == "orchid") return orchid;
		if(id == "ravenmother") return ravenmother;
		if(id == "uru") return uru;
		if(id == "lucille") return lucille;
		if(id == "belinda") return belinda;
		if(id == "aria") return aria;
		if(id == "ches") return ches;
		if(id == "sylistraxia") return sylistraxia;
		return null;
	},
};

export { EntityDict };
