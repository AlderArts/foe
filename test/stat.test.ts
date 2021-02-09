import { expect } from "chai";
import { SetDEBUG } from "../app";
import { Stat } from "../js/engine/entity/stat";

describe("Stat", () => {
	it("is initialized as 0", () => {
		const stat = new Stat();
		expect(stat.Get()).to.equal(0);
	});

	it("is incrementable", () => {
		const stat = new Stat();
		stat.IncreaseStat(5, 100);
		expect(stat.Get()).to.equal(5);
		stat.IncreaseStat(10, 100);
		expect(stat.Get()).to.equal(10);
		stat.IncreaseStat(15, 100);
		expect(stat.Get()).to.equal(15);
	});

	it("is incrementable, blocked by max", () => {
		const stat = new Stat();
		stat.IncreaseStat(100, 10);
		expect(stat.Get()).to.equal(10);
		stat.IncreaseStat(10, 10);
		expect(stat.Get()).to.equal(10);
	});

	it("is decrementable", () => {
		const stat = new Stat(100);
		stat.DecreaseStat(95, 100);
		expect(stat.Get()).to.equal(95);
		stat.DecreaseStat(0, 5);
		expect(stat.Get()).to.equal(90);
		stat.DecreaseStat(0, 5);
		expect(stat.Get()).to.equal(85);
	});

	it("is decrementable, blocked by min", () => {
		const stat = new Stat(100);
		stat.DecreaseStat(0, 10);
		expect(stat.Get()).to.equal(90);
		stat.DecreaseStat(90, 10);
		expect(stat.Get()).to.equal(90);
	});

	it("can be debugged", () => {
		SetDEBUG(true);
		const stat = new Stat(0);
		stat.debug = () => "debug";
		stat.IncreaseStat(5, 100);
		stat.IncreaseStat(5, 5);
		stat.IncreaseStat(2, 5);
		expect(stat.Get()).to.equal(5);
		stat.DecreaseStat(5, 100);
		stat.DecreaseStat(2, 5);
		expect(stat.Get()).to.equal(2);
		stat.IdealStat(50, 100);
		expect(stat.Get()).to.equal(50);
		stat.IdealStat(50, 100);
		expect(stat.Get()).to.equal(50);
		stat.IdealStat(0, 100);
		expect(stat.Get()).to.equal(0);
	});

	it("can clear bonus and temp", () => {
		const stat = new Stat();
		stat.bonus = 5;
		stat.temp = 2;
		expect(stat.Get()).to.equal(7);
		stat.Clear();
		expect(stat.Get()).to.equal(0);
	});
});
