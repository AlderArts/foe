/*
 * 
 * Krawitz's Estate (located in Rigard plaza)
 * 
 */

world.loc.Rigard.Krawitz =
{
	street    : new Event("Krawitz's Estate"),
	servants  : new Event("Servants' Quarters"),
	grounds   : new Event("Grounds"),
	bathhouse : new Event("Bathhouse"),
	Mansion   :
	{
		hall      : new Event("Mansion"),
		study     : new Event("Study"),
		kitchen   : new Event("Kitchen"),
		storeroom : new Event("Storeroom")
	}
}



//
// Mansion
//
world.loc.Rigard.Krawitz.street.description = function() {
	Text.AddOutput("You are in front of Krawitz's estate.<br/>");
}

world.loc.Rigard.Krawitz.street.links.push(new Link(
	"Plaza", true, true,
	function() {
		Text.AddOutput("Go back to plaza?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Plaza, {minute: 10});
	}
));
world.loc.Rigard.Krawitz.street.links.push(new Link(
	"Back street", true, true,
	function() {
		Text.AddOutput("Enter the servants' quarters through the back entrance?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.servants);
	}
));
world.loc.Rigard.Krawitz.street.links.push(new Link(
	"Grounds", true, false,
	function() {
		Text.AddOutput("Enter the main grounds?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.grounds);
	}
));

world.loc.Rigard.Krawitz.street.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}

//
// Servants
//
world.loc.Rigard.Krawitz.servants.description = function() {
	Text.AddOutput("You are in the servants' quarters of Krawitz's estate.<br/>");
}

world.loc.Rigard.Krawitz.servants.links.push(new Link(
	"Leave", true, true,
	function() {
		Text.AddOutput("Leave the mansion?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.street);
	}
));
world.loc.Rigard.Krawitz.servants.links.push(new Link(
	"Grounds", true, true,
	function() {
		Text.AddOutput("Enter the main grounds?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.grounds);
	}
));

world.loc.Rigard.Krawitz.servants.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}


//
// Grounds
//
world.loc.Rigard.Krawitz.grounds.description = function() {
	Text.AddOutput("You are in the main grounds of Krawitz's estate.<br/>");
}

world.loc.Rigard.Krawitz.grounds.links.push(new Link(
	"Leave", true, true,
	function() {
		Text.AddOutput("Leave the mansion?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.street);
	}
));
world.loc.Rigard.Krawitz.grounds.links.push(new Link(
	"Servants'", true, true,
	function() {
		Text.AddOutput("Go to the servants' quarters?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.servants);
	}
));
world.loc.Rigard.Krawitz.grounds.links.push(new Link(
	"Mansion", true, true,
	function() {
		Text.AddOutput("Enter the main building?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.hall);
	}
));
world.loc.Rigard.Krawitz.grounds.links.push(new Link(
	"Bathhouse", true, true,
	function() {
		Text.AddOutput("Go to the bathhouse?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.bathhouse);
	}
));

world.loc.Rigard.Krawitz.grounds.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}


//
// Bathhouse
//
world.loc.Rigard.Krawitz.bathhouse.description = function() {
	Text.AddOutput("You are in the bathhouse of Krawitz's estate.<br/>");
}

world.loc.Rigard.Krawitz.bathhouse.links.push(new Link(
	"Grounds", true, true,
	function() {
		Text.AddOutput("Go outside?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.grounds);
	}
));
world.loc.Rigard.Krawitz.bathhouse.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}


//
// Mansion: Hall
//
world.loc.Rigard.Krawitz.Mansion.hall.description = function() {
	Text.AddOutput("You are in the main building of Krawitz's estate.<br/>");
}

world.loc.Rigard.Krawitz.Mansion.hall.links.push(new Link(
	"Grounds", true, true,
	function() {
		Text.AddOutput("Go outside?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.grounds);
	}
));
world.loc.Rigard.Krawitz.Mansion.hall.links.push(new Link(
	"Kitchen", true, true,
	function() {
		Text.AddOutput("Go to the kitchen?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.kitchen);
	}
));
world.loc.Rigard.Krawitz.Mansion.hall.links.push(new Link(
	"Storeroom", true, true,
	function() {
		Text.AddOutput("Go to the storeroom?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.storeroom);
	}
));
world.loc.Rigard.Krawitz.Mansion.hall.links.push(new Link(
	"Study", true, true,
	function() {
		Text.AddOutput("Go to the study?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.study);
	}
));

world.loc.Rigard.Krawitz.Mansion.hall.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}

//
// Mansion: Kitchen
//
world.loc.Rigard.Krawitz.Mansion.kitchen.description = function() {
	Text.AddOutput("You are in the kitchen of Krawitz's estate.<br/>");
}

world.loc.Rigard.Krawitz.Mansion.kitchen.links.push(new Link(
	"Hall", true, true,
	function() {
		Text.AddOutput("Return to the hallway?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.hall);
	}
));
world.loc.Rigard.Krawitz.Mansion.kitchen.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}

//
// Mansion: Storeroom
//
world.loc.Rigard.Krawitz.Mansion.storeroom.description = function() {
	Text.AddOutput("You are in the storeroom of Krawitz's estate.<br/>");
}

world.loc.Rigard.Krawitz.Mansion.storeroom.links.push(new Link(
	"Hall", true, true,
	function() {
		Text.AddOutput("Return to the hallway?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.hall);
	}
));
world.loc.Rigard.Krawitz.Mansion.storeroom.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}

//
// Mansion: Study
//
world.loc.Rigard.Krawitz.Mansion.study.description = function() {
	Text.AddOutput("You are in the study of Krawitz's estate.<br/>");
}

world.loc.Rigard.Krawitz.Mansion.study.links.push(new Link(
	"Hall", true, true,
	function() {
		Text.AddOutput("Return to the hallway?<br/>");
	},
	function() {
		MoveToLocation(world.loc.Rigard.Krawitz.Mansion.hall);
	}
));
world.loc.Rigard.Krawitz.Mansion.study.endDescription = function() {
	Text.AddOutput("What you do?<br/>");
}


