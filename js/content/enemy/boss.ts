/*
 * Set up boss stats
 */

import { StatusEffect } from "../../engine/combat/statuseffect";
import { Entity } from "../../engine/entity/entity";

export class BossEntity extends Entity {
	constructor() {
		super();

		// Status resistance
		for (let i = 0; i < StatusEffect.LAST; i++) {
			this.statusDef[i] = 1;
		}
	}
}
