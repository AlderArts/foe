/*
 * Set up boss stats
 */

function BossEntity() {
	Entity.call(this);
	
	//this.elementDef.dmg[Element.pNature] = 0;
}
BossEntity.prototype = new Entity();
BossEntity.prototype.constructor = BossEntity;

BossEntity.prototype.PoisonResist = function() {
	return 1;
}
BossEntity.prototype.BurnResist = function() {
	return 1;
}
