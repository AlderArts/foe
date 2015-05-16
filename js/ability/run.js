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
Abilities.Run.castTree.push(function(ability, encounter, caster) {
	// TODO: Make more flavor text	
	Text.Add("You try to run away!");
	Text.NL();
	
	// TODO: random chance on success
	Text.Flush();
	encounter.onRun();
});
