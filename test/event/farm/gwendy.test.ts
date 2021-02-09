import * as _ from "lodash";

import { expect } from "chai";
import { GwendyScenes } from "../../../js/content/event/farm/gwendy-scenes";
import { Cock } from "../../../js/engine/entity/body/cock";
import { Race } from "../../../js/engine/entity/body/race";
import { Entity } from "../../../js/engine/entity/entity";

describe("GwendyScenes", () => {
	it("ddildo odds verification", () => {
		const maxValue = 100;

		let hits = 0;
		for (let i = 0; i < maxValue; ++i) {
			if (GwendyScenes._DDildoOdds(49, true)) {
				hits++;
			}
		}
		expect(hits).to.equal(0);

		hits = 0;
		for (let i = 0; i < maxValue; ++i) {
			if (GwendyScenes._DDildoOdds(50, true)) {
				hits++;
			}
		}
		expect(hits).to.be.greaterThan(20).and.be.lessThan(80);

		hits = 0;
		for (let i = 0; i < maxValue; ++i) {
			if (GwendyScenes._DDildoOdds(75, true)) {
				hits++;
			}
		}
		expect(hits).to.be.greaterThan(50).and.be.lessThan(100);

		hits = 0;
		for (let i = 0; i < maxValue; ++i) {
			if (GwendyScenes._DDildoOdds(100, true)) {
				hits++;
			}
		}
		expect(hits).to.equal(maxValue);

		hits = 0;
		for (let i = 0; i < maxValue; ++i) {
			if (GwendyScenes._DDildoOdds(0, false)) {
				hits++;
			}
		}
		expect(hits).to.equal(maxValue);

		hits = 0;
		for (let i = 0; i < maxValue; ++i) {
			if (GwendyScenes._DDildoOdds(50, false)) {
				hits++;
			}
		}
		expect(hits).to.equal(maxValue);
	});

	it("get horsecock bigcock works", () => {
		const ent = new Entity();
		// Body empty
		{
			const { cock, bigcock, horsecock } = GwendyScenes._GetHorsecockBigcock(ent);
			expect(cock).to.equal(undefined);
			expect(bigcock).to.equal(undefined);
			expect(horsecock).to.equal(undefined);
		}

		ent.body.DefMale();
		{
			const { cock, bigcock, horsecock } = GwendyScenes._GetHorsecockBigcock(ent);
			expect(cock).to.not.equal(undefined);
			expect(bigcock).to.equal(undefined);
			expect(horsecock).to.equal(undefined);
		}

		ent.FirstCock().length.base = 27;
		ent.body.SetRace(Race.Horse);
		{
			const { cock, bigcock, horsecock } = GwendyScenes._GetHorsecockBigcock(ent);
			expect(cock).to.not.equal(undefined);
			expect(bigcock).to.equal(undefined);
			expect(horsecock).to.equal(true);
		}

		ent.FirstCock().length.base = 28;
		{
			const { cock, bigcock, horsecock } = GwendyScenes._GetHorsecockBigcock(ent);
			expect(cock).to.not.equal(undefined);
			expect(bigcock).to.equal(true);
			expect(horsecock).to.equal(true);
		}

		ent.body.SetRace(Race.Human);
		{
			const { cock, bigcock, horsecock } = GwendyScenes._GetHorsecockBigcock(ent);
			expect(cock).to.not.equal(undefined);
			expect(bigcock).to.equal(true);
			expect(horsecock).to.equal(undefined);
		}

		const horseCock = new Cock(Race.Horse);
		ent.AllCocks().push(horseCock);
		{
			const { cock, bigcock, horsecock } = GwendyScenes._GetHorsecockBigcock(ent);
			expect(cock).to.not.equal(undefined);
			expect(bigcock).to.equal(undefined);
			expect(horsecock).to.equal(true);
		}

		const horseCock2 = new Cock(Race.Horse);
		horseCock2.length.base = 30;
		ent.AllCocks().push(horseCock2);
		{
			const { cock, bigcock, horsecock } = GwendyScenes._GetHorsecockBigcock(ent);
			expect(cock).to.not.equal(undefined);
			expect(bigcock).to.equal(true);
			expect(horsecock).to.equal(true);
		}
	});
});
