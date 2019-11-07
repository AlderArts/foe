import * as _ from "lodash";

import { expect } from "chai";
import { GolQueen, GolScenes } from "../../js/enemy/gol";
import { CacheToGame } from "../../js/gamecache";
import { Gui } from "../../js/gui";

describe("GolQueen", () => {
	it("init", () => {
		const gol = new GolQueen();
		expect(gol.ID).to.equal("gol");
		expect(gol.name).to.equal("Gol Queen");
	});

	it("has drops", () => {
		const gol = new GolQueen();
		const drops = gol.DropTable();

		expect(_.some(drops, (obj) => {return obj.it.id === "quest3";})).to.be.true; // Lagon's Scepter
		expect(_.some(drops, (obj) => {return obj.it.id === "dag1";})).to.be.true; // GolClaw
	});
});

describe("GolScenes", () => {
	it("search for scepter", () => {
		Gui.Init();
		CacheToGame();
		GolScenes.SearchForScepter();
	});
});
