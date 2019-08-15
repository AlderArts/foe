/*
 * Set up boss stats
 */

import { Entity } from '../entity';
import { StatusEffect } from '../statuseffect';

export class BossEntity extends Entity {
	constructor() {
		super();

		// Status resistance
		for(let i = 0; i < StatusEffect.LAST; i++) {
			this.statusDef[i] = 1;
		}
	}
}
