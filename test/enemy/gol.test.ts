import * as _ from "lodash";

import { expect } from "chai";
import { GolQueen, GolScenes } from "../../js/enemy/gol";
import { CacheToGame } from "../../js/gamecache";
import { Gui } from "../../js/gui";

describe("GolQueen", () => {
	it("can be instantiated", () => {
		const gol = new GolQueen();
		expect(gol.ID).to.equal("gol");
		expect(gol.name).to.equal("Gol Queen");
	});

	it("has required drops", () => {
		const gol = new GolQueen();
		const drops = gol.DropTable();

		expect(_.some(drops, (obj) => obj.it.id === "quest3")).to.equal(true); // Lagon's Scepter
		expect(_.some(drops, (obj) => obj.it.id === "dag1")).to.equal(true); // GolClaw
	});
});
/*
describe("GolScenes", () => {
	it("search for scepter", () => {
		Gui.Init();
		CacheToGame();
		GolScenes.SearchForScepter();
	});
});
*/
