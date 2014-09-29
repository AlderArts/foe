// World template

world = {
	// Prototype initialization
	loc           : {},
	EntityStorage : new Array(),
	SaveSpots     : {}
}

// Update function (for animations and transitions)
world.Update = function(frametime) {
	/*
	var xDir = 0;
	var yDir = 0;
	
	if(Input.keyinput[LEFT_ARROW])  xDir--;
	if(Input.keyinput[RIGHT_ARROW]) xDir++;
	if(Input.keyinput[UP_ARROW])    yDir--;
	if(Input.keyinput[DOWN_ARROW])  yDir++;
	
	this.x += xDir * frametime * 200;
	this.y += yDir * frametime * 200;
	*/
}

// Update function (for internal game time)
world.TimeStep = function(step) {
	this.time.Inc(step);
	
	for(var i = 0; i < this.EntityStorage.length; i++)
		if(this.EntityStorage[i].Update) this.EntityStorage[i].Update(step);
}

// Update function (for internal game time)
world.StepToHour = function(hour, minute) {
	hour   = hour   || 0;
	minute = minute || 0;
	var step = {
		hour   : hour   - this.time.hour,
		minute : minute - this.time.minute
	};
	
	if(step.minute < 0) {
		step.minute += 60;
		step.hour--;
	}
	if(step.hour   < 0)
		step.hour   += 24;
	
	world.TimeStep(step);
}

world.HandleTimers = function() {
	for(var i = 0; i < this.EntityStorage.length; i++) {
		if(this.EntityStorage[i].HandleTimers && this.EntityStorage[i].HandleTimers())
			return true;
	}
	return false;
}
	
// Render function
world.Render = function() {
	
}

//TODO
world.TreeFarDesc = function() {
	return "As always, you can see the immense tree at the center of the island towering in the distance, though you are so far away that the great canopy isn't obscuring the sky above.";
}
