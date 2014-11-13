/*
 * 
 * Define Patchwork
 * 
 */
function Patchwork(storage) {
	Entity.call(this);
	
	
	/*
	 * Set up patchworks shop
	 */
	this.Shop = new Shop();
	this.Shop.AddItem(Items.Equinium, 5);
	//this.Shop.AddItem(Items.HorseHair, 5);
	this.Shop.AddItem(Items.HorseShoe, 5);
	//this.Shop.AddItem(Items.HorseCum, 5);
	
	this.Shop.AddItem(Items.Leporine, 5);
	this.Shop.AddItem(Items.RabbitFoot, 5);
	//this.Shop.AddItem(Items.CarrotJuice, 5);
	//this.Shop.AddItem(Items.Lettuce, 5);
	
	this.Shop.AddItem(Items.Felinix, 5);
	//this.Shop.AddItem(Items.Whiskers, 5);
	this.Shop.AddItem(Items.HairBall, 5);
	//this.Shop.AddItem(Items.CatClaw, 5);
	
	this.Shop.AddItem(Items.CowBell, 5);
	
	this.Shop.AddItem(Items.DogBiscuit, 5);
	
	this.Shop.AddItem(Items.Trinket, 5);
	this.Shop.AddItem(Items.Feather, 5);
	this.Shop.AddItem(Items.FruitSeed, 5);
	
	this.Shop.AddItem(Items.Hummus, 5);
	
	//this.Shop.AddItem(Items.Toys.SmallDildo, 5);
	
	
	if(storage) this.FromStorage(storage);
}
Patchwork.prototype = new Entity();
Patchwork.prototype.constructor = Patchwork;

Scenes.Patchwork = {};

Scenes.Patchwork.Interact = function() {
	var that = patchwork;
	
	Text.Clear();
	Text.AddOutput("You approach the odd peddler.");
	
	
	if(DEBUG) {
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: relation: " + patchwork.relation.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: subDom: " + patchwork.subDom.Get()));
		Text.Newline();
		Text.AddOutput(Text.BoldColor("DEBUG: slut: " + patchwork.slut.Get()));
		Text.Newline();
	}
	
	var options = new Array();
	
	options.push({ nameStr : "Talk",
		func : function() {
			Text.Clear();
			Text.AddOutput("[Placeholder] I'ma shopkeeper.");
		}, enabled : true
	});
	options.push({ nameStr : "Buy",
		func : function() {
			patchwork.Shop.Buy(Scenes.Patchwork.Interact);
		}, enabled : true
	});
	options.push({ nameStr : "Sell",
		func : function() {
			patchwork.Shop.Sell(Scenes.Patchwork.Interact);
		}, enabled : true
	});
	
	Gui.SetButtonsFromList(options, true, PrintDefaultOptions);
}


world.loc.Plains.Nomads.Fireplace.events.push(new Link(
	"Patchwork", function() { return (world.time.hour >= 8 && world.time.hour < 24); }, true,
	function() {
		if(!(world.time.hour >= 8 && world.time.hour < 24)) return;
		
		Text.Add("A strange individual wearing a patchwork robe has set up shop close to the fireplace. ");
		Text.NL();
	},
	Scenes.Patchwork.Interact
));