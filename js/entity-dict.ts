import { GAME } from "./GAME";

const EntityDict = {
	UniqueId() {
		return this.ID;
	},

	IdToEntity(id: string) {
		if (id === "player") { return GAME().player; }
		if (id === "kiakai") { return GAME().kiakai; }
		if (id === "miranda") { return GAME().miranda; }
		if (id === "terry") { return GAME().terry; }
		if (id === "momo") { return GAME().momo; }
		if (id === "lei") { return GAME().lei; }
		if (id === "rumi") { return GAME().twins.rumi; }
		if (id === "rani") { return GAME().twins.rani; }
		if (id === "room69") { return GAME().room69; }
		if (id === "chief") { return GAME().chief; }
		if (id === "rosalin") { return GAME().rosalin; }
		if (id === "cale") { return GAME().cale; }
		if (id === "estevan") { return GAME().estevan; }
		if (id === "magnus") { return GAME().magnus; }
		if (id === "patchwork") { return GAME().patchwork; }
		if (id === "lagon") { return GAME().lagon; }
		if (id === "ophelia") { return GAME().ophelia; }
		if (id === "vena") { return GAME().vena; }
		if (id === "roa") { return GAME().roa; }
		if (id === "gwendy") { return GAME().gwendy; }
		if (id === "danie") { return GAME().danie; }
		if (id === "adrian") { return GAME().adrian; }
		if (id === "layla") { return GAME().layla; }
		if (id === "aquilius") { return GAME().aquilius; }
		if (id === "maria") { return GAME().maria; }
		if (id === "cveta") { return GAME().cveta; }
		if (id === "vaughn") { return GAME().vaughn; }
		if (id === "fera") { return GAME().fera; }
		if (id === "asche") { return GAME().asche; }
		if (id === "jeanne") { return GAME().jeanne; }
		if (id === "golem") { return GAME().golem; }
		if (id === "orchid") { return GAME().orchid; }
		if (id === "ravenmother") { return GAME().ravenmother; }
		if (id === "uru") { return GAME().uru; }
		if (id === "lucille") { return GAME().lucille; }
		if (id === "belinda") { return GAME().belinda; }
		if (id === "aria") { return GAME().aria; }
		if (id === "ches") { return GAME().ches; }
		if (id === "sylistraxia") { return GAME().sylistraxia; }
		return null;
	},
};

export { EntityDict };
