import { expect } from "chai";
import { Entity } from "../js/entity";

describe("Entity", () => {
	it("test test", () => {
		const ent = new Entity();
		expect(ent.name !== undefined).to.be.true;
	});
});
