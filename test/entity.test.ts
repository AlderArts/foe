import { describe, expect, it } from "vitest";
import { Entity } from "../js/engine/entity/entity";

describe("Entity", () => {
	it("has Parser", () => {
		const ent = new Entity();
		const ep = ent.Parser;

		const text = `${ep.name}, pronouns: ${ep.heshe}/${ep.hisher}/${ep.himher}.`;
		expect(text).to.equal("ENTITY, pronouns: they/their/them.");
	});
});
