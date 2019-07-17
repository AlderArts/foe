/*
 * Set up boss stats
 */

import { Entity } from '../entity';
import { StatusEffect } from '../statuseffect';

function BossEntity() {
	Entity.call(this);
	
	// Status resistance
	for(var i = 0; i < StatusEffect.LAST; i++) {
		this.statusDef[i] = 1;
	}
}
BossEntity.prototype = new Entity();
BossEntity.prototype.constructor = BossEntity;

export { BossEntity };
