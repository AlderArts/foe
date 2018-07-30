
function Stat(base, growth, growthStep) {
	this.base   = base || 0; // Base stat, increased by levelling and TFs
	this.bonus  = 0; // Bonuses got by equipment/auras/perks etc
	this.level  = 0; // Bonuses got from levels
	this.temp   = 0; // Bonuses or penalties that are cleared after end of each combat
	this.cheat  = 0; // Bonuses got by DEBUG flag etc
	this.growth = growth || 1;
	this.growthStep = growthStep || 0.1;
	this.growthBase = this.growth;
	this.debug  = null;
}
Stat.growthPerPoint = 0.1;
Stat.growthPointsPerLevel = 3;

Stat.prototype.Get = function() { return this.base + this.bonus + this.level + this.temp + this.cheat; }
Stat.prototype.Clear = function() { this.bonus = 0; this.temp = 0; }
Stat.prototype.GrowthRank = function() { return Math.round(((this.growth-this.growthBase) / this.growthStep) + 1, -1); }
// Changes _ONE_ stat, closing in on the ideal
// Cap the change to a maximum value
// Returns the applied difference, unless the diff is zero
Stat.prototype.IdealStat = function(ideal, maxChange, fraction) {
	ideal = ideal || 0;
	maxChange = maxChange || 1;
	var diff = ideal - this.base;
	if(diff < 0) maxChange *= -1;
	diff = (Math.abs(diff) <= Math.abs(maxChange)) ? diff : maxChange;
	
	var old = this.base;
	this.base += diff;
	if(DEBUG && this.debug) {
		Text.NL();
		if(diff > 0)
			Text.Add("DEBUG: " + this.debug() + " " + old + " -> " + this.base + " (ideal: " + ideal + ")", null, "blue bold");
		else if(diff == 0)
			Text.Add("DEBUG: " + this.debug() + " " + old + " capped (ideal: " + ideal + ")", null, "bold");
		else
			Text.Add("DEBUG: " + this.debug() + " " + old + " -> " + this.base + " (ideal: " + ideal + ")", null, "red bold");
		Text.NL();
		Text.Flush();
	}
	if(fraction)
		return this.base - old;
	else
		return Math.floor(this.base) - Math.floor(old);
}
// Changes _ONE_ stat, closing in on the ideal (ONLY INC)
// Cap the change to a maximum value
// Returns the applied difference (positive), unless the diff is zero
Stat.prototype.IncreaseStat = function(ideal, maxChange, fraction) {
	ideal = ideal || 0;
	maxChange = maxChange || 1;
	var diff = ideal - this.base;
	if(diff < 0) return null;
	diff = (diff <= maxChange) ? diff : maxChange;
	
	var old = this.base;
	this.base += diff;
	if(DEBUG && this.debug) {
		Text.NL();
		if(diff == 0)
			Text.Add("DEBUG: " + this.debug() + " " + old + " capped (ideal: " + ideal + ")", null, "black bold");
		else
			Text.Add("DEBUG: " + this.debug() + " " + old + " -> " + this.base + " (max: " + ideal + ")", null, "blue bold");
		Text.NL();
		Text.Flush();
	}
	if(fraction)
		return this.base - old;
	else
		return Math.floor(this.base) - Math.floor(old);
}
// Changes _ONE_ stat, closing in on the ideal (ONLY DEC)
// Cap the change to a maximum value
// Returns the applied difference (positive), unless the diff is zero
Stat.prototype.DecreaseStat = function(ideal, maxChange, fraction) {
	ideal = ideal || 0;
	maxChange = maxChange || 1;
	var diff = this.base - ideal;
	if(diff < 0) return null; 
	diff = (diff <= maxChange) ? diff : maxChange;
	
	var old = this.base;
	this.base -= diff;
	if(DEBUG && this.debug) {
		Text.NL();
		if(diff == 0)
			Text.Add("DEBUG: " + this.debug() + " " + old + " capped (ideal: " + ideal + ")", null, "black bold");
		else
			Text.Add("DEBUG: " + this.debug() + " " + old + " -> " + this.base + " (min: " + ideal + ")", null, "red bold");
		Text.NL();
		Text.Flush();
	}
	if(fraction)
		return this.base - old;
	else
		return Math.floor(this.base) - Math.floor(old);
}
