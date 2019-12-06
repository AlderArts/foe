import { expect } from "chai";
import { Entity } from "../js/entity";

describe("Entity", () => {
	it("has Parser", () => {
		const ent = new Entity();
		const ep = ent.Parser;

		const text = `${ep.name}, pronouns: ${ep.heshe}/${ep.hisher}/${ep.himher}.`;
	});
});
