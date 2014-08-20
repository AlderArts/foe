/*
 * 
 * Flee
 * 
 */
Abilities.Run = new Ability();
Abilities.Run.name = "Run";
Abilities.Run.Short = function() { return "Run away."; }
Abilities.Run.targetMode = TargetMode.Self;
Abilities.Run.enabledCondition = function(encounter, caster) {
	return encounter.canRun;
}
Abilities.Run.CastInternal = function(encounter, caster) {
	// TODO: Make more flavor text	
	Text.AddOutput("You try to run away!");
	Text.Newline();
	
	// TODO: random chance on success
	
	encounter.onRun();
}
