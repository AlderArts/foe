/*
 * Set up boss stats
 */

function BossEntity() {
	Entity.call(this);
	
	// Status resistance
	for(var i = 0; i < StatusEffect.LAST; i++) {
		this.statusDef[i] = 1;
	}
}
BossEntity.prototype = new Entity();
BossEntity.prototype.constructor = BossEntity;
