

//
// Sliken Delights
//

Scenes.Rigard.ClothShop = {};
Scenes.Rigard.ClothShop.IsOpen = function() {
	return (world.time.hour >= 9 && world.time.hour < 20) && !rigard.UnderLockdown();
}

world.loc.Rigard.ShopStreet.ClothShop.onEntry = function() {
	var parse = {};
	
	if(party.Two())
		parse["comp"] = " and " + party.Get(1).name;
	else if(!party.Alone())
		parse["comp"] = " and your companions";
	else
		parse["comp"] = "";
	
	if(rigard.flags["TailorMet"] == 0) {
		rigard.flags["TailorMet"] = 1;
		Text.Clear();
		Text.AddOutput("You[comp] walk past the two guards stationed at the intricately crafted wooden doors of the Silken Delights clothing store. Once inside, you are amazed by what you see. There are red velvet drapes along the walls, red velvet curtains on the windows, and some very expensive looking paintings hanging on the walls.", parse);
		Text.Newline();
		Text.AddOutput("There are beautiful dresses in the windows facing the street, and many tall racks of countless other types of clothes lining the large and well decorated store interior. The counter is straight ahead from the door, and draped with the same red velvet as the walls and windows. The long racks of clothes stretch down a hallway to the left as well, where you can see large shelves of shoes and four large stalls along the back wall which you assume are fitting rooms for customers.", parse);
		Text.Newline();
		Text.AddOutput("The whole store is amazingly clean, with no sign of dirt or dust anywhere. There are numerous customers in the store, most that you can see are nobles. As you[comp] walk down the main aisle toward the counter you see a tall, full-figured woman in a long, flowing blue dress with long and curly blonde hair, measuring something on the counter with a large wooden ruler. As you[comp] approach, she turns her head to both sides as if looking for something.", parse);
		Text.Newline();
		Text.AddOutput("<i>“<b>Fera!</b>”</i> she yells. A few seconds later, you see a short figure with brown hair carrying a pile of clothes rushing down the fitting room hallway, heading around the corner toward the counter.", parse);
		Text.Newline();
		Text.AddOutput("As she passes you[comp], you get a good look at her and are surprised by what you see. Fera appears to be a very cute catgirl. She has brown fur with white spots, large catlike ears on her head, and you can see her tail poking out through a slit in the back of her short pink dress as she rushes past you[comp]. She places the pile of clothes she was carrying on the counter next to the blonde woman.", parse);
		Text.Newline();
		Text.AddOutput("The woman stops measuring and whacks the catgirl over the head with her ruler. <i>“What took so long?”</i> she demands angrily.", parse);
		Text.Newline();
		Text.AddOutput("<i>“I'm very sorry Miss Nexelle,”</i> Fera quickly apologizes as she rubs her head.", parse);
		Text.Newline();
		Text.AddOutput("<i>“Now go get the rest,”</i> the woman, presumably the owner of the shop, orders.", parse);
		Text.Newline();
		Text.AddOutput("<i>“Right away, Miss Nexelle,”</i> the catgirl says as she turns around and runs back the way she came. The woman takes a garment from the new pile and begins measuring it. You[comp] walk past the hat racks and arrive at the counter, and the woman appears to not even notice you. When you try to get her attention, she does not even look up as she speaks. <i>“If you are not going to make a purchase, then please do not interrupt my work. If you have basic questions or need assistance trying on something, Fera can assist you.”</i>", parse);
		
		Gui.NextPrompt();
	}
	else
		PrintDefaultOptions();
}

world.loc.Rigard.ShopStreet.ClothShop.description = function() {
	var parse = {};
	Text.AddOutput("The Silken Wonders clothing shop is clearly a high-end establishment, with two private guards, red velvet curtains and expensive-looking paintings all over. The counter is straight ahead from the door, and draped with the same red velvet as the walls and windows. Long racks of clothes stretch down a hallway to the left where you can see large shelves of shoes and four large stalls along the back wall which you assume are fitting rooms for customers. The whole store is amazingly clean, with no dirt or dust anywhere. There are hat racks by the counter with all sorts of fancy looking hats.", parse);
	Text.Newline();
	/*
    	if(world.time.hour >= 20 || world.time.hour < 9) {
    		Text.AddOutput("The shop is currently closed, and you are asked to leave.", parse);
    		Gui.NextPrompt(function() {
    			MoveToLocation(world.loc.Rigard.ShopStreet.street, {minute: 5});
    		});
    	}
	*/
}

/*
world.loc.Rigard.ShopStreet.ClothShop.enc = new EncounterTable();
world.loc.Rigard.ShopStreet.ClothShop.enc.AddEnc(function() { return Scenes.Rigard.Plaza.LetterDelivery; }, 1.0, function() { return (world.time.hour >= 6 && world.time.hour < 21); });
world.loc.Rigard.ShopStreet.ClothShop.enc.AddEnc(function() { return Scenes.Rigard.Plaza.StatueInfo; }, 1.0, function() { return (world.time.hour >= 6 && world.time.hour < 21) && (rigard.flags["TalkedStatue"] == 0 || (party.InParty(kiakai) && kiakai.flags["TalkedStatue"] == 0)); });
*/

world.loc.Rigard.ShopStreet.ClothShop.events.push(new Link(
	"Nexelle", true, true,
	function() {
		
		var tailorRand = ["the tailor", "the owner", "Miss Nexelle"];
		var parse = {
			tailorName : function() { return tailorRand[Math.floor(Math.random() * tailorRand.length)]; }
		};
		
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.AddOutput("You see [tailorName] sitting at the counter, cutting some fabric.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.AddOutput("You can see [tailorName] measuring a garment on the counter.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.AddOutput("You see [tailorName] hanging up some new dresses.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.AddOutput("You can see [tailorName] rearranging some shoes on the shelves back by the fitting rooms.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.AddOutput("You see [tailorName] placing some new hats on the racks by the counter.", parse);
		}, 1.0, function() { return true; });
		scenes.Get();
		
		Text.Newline();
	},
	function() {
		var nexellePrompt = function() {
			if(!Scenes.Rigard.ClothShop.IsOpen()) {
				Text.AddOutput("The shop is closing, and you are asked to leave.");
				Gui.NextPrompt(function() {
					MoveToLocation(world.loc.Rigard.ShopStreet.street);
				});
				return;
			}
			
			var parse = {
				sirmadam : player.body.Gender() == Gender.male ? "sir" : "madam"
			};
			Text.Clear();
			Text.AddOutput("You go over to the tailor and try to speak with her.", parse);
			Text.Newline();
			Text.AddOutput("Miss Nexelle is clearly the owner of the store, and is an assertive and particularly beautiful woman. She has long, curly blonde hair that occasionally covers half her face and one of her brown eyes. She is wearing a long blue dress, one of the finest you have ever seen, made from dyed silk with little frills along the edges. The fine dress helps show off her slim waist and impressive figure, and even more impressive chest. Her dress is cut low around her neck, so that her cleavage is clearly visible.", parse);
			Text.Newline();
			Text.AddOutput("She looks at you as you approach her.", parse);
			Text.Newline();
			
			var human = new RaceScore();
			human.score[Race.human] = 1;
			var humanScore = human.Compare(new RaceScore(player.body));
			
			if(humanScore > 0.9 || player.charisma.Get() >= 50)
				Text.AddOutput("<i>“Oh, hello, [sirmadam], I am Miss Elaine Nexelle, proprietor of Silken Delights, where we have the finest selection of apparel in Rigard. If you have any questions regarding any of our finer apparel, I would be happy to help you make a selection...”</i> she says with a smile.", parse);
			else if(humanScore > 0.5)
				Text.AddOutput("<i>“Yes? Do you need something?”</i> she asks without pausing in her work.", parse);
			else
				Text.AddOutput("You can feel her cold stare as you walk over. <i>“The bargain clothes are over by the door, thats probably what you want. If you need help you should go find Fera, and remember, if you damage anything, you buy it. If you can't afford it, I'll make you work it off,”</i> she says coldly before resuming her work.", parse);

			//[Nexelle][Store][Guards][City][Fera][Fera's mom]
			var options = new Array();
			
			options.push({ nameStr : "Buy",
				func : function() {
					rigard.ClothShop.Buy(nexellePrompt);
				}, enabled : true
			});
			options.push({ nameStr : "Sell",
				func : function() {
					rigard.ClothShop.Sell(nexellePrompt);
				}, enabled : true
			});
			options.push({ nameStr : "Nexelle",
				func : function() {
					Text.Clear();
					Text.AddOutput("You ask Miss Nexelle about herself.", parse);
					Text.Newline();
					Text.AddOutput("She stops working and looks up as she sighs deeply. <i>“I really used to be someone in Rigard, back before the Merchant Guild was broken up. My family, being one of the three most influential merchant families, had a lot of power in the guild.  Fortunately, I had saved plenty of money and had built up some connections in high places so I can still afford to buy high quality materials for my shop, keep all of my equipment, and keep my guards.”</i>", parse);
				}, enabled : true,
				tooltip : "Ask the tailor about herself."
			});
			options.push({ nameStr : "Store",
				func : function() {
					Text.Clear();
					Text.AddOutput("You ask the tailor to tell you about her store.", parse);
					Text.Newline();
					Text.AddOutput("<i>“We have the finest clothing in the city, from silk and satin to wool and leather. I buy the finest materials and make everything we sell myself and I personally guarantee the quality of our goods. My mother and grandmother ran this shop before me, and it has been in our family since even before that. If you have the money, this is the place to shop for fashionable clothing, as it has been for over a century.”</i> She smiles, clearly proud of her establishment.", parse);
				}, enabled : true,
				tooltip : "Ask her about the store."
			});
			options.push({ nameStr : "Guards",
				func : function() {
					Text.Clear();
					Text.AddOutput("You ask Miss Nexelle about the guards she has outside her store.", parse);
					Text.Newline();
					Text.AddOutput("<i>“John and Laura have worked here for years, they worked here back when my mother ran the shop, before she died five years ago. I believe good security is important to a successful business, so I kept them on.”</i> The tailor flips her hair and scratches her head a bit. <i>“I seem to recall mother saying they used to be part of some mercenary group before they started here.”</i>", parse);
				}, enabled : true,
				tooltip : "Ask her about the two guards outside the store."
			});
			options.push({ nameStr : "City",
				func : function() {
					Text.Clear();
					Text.AddOutput("You ask the tailor to tell you about the city.", parse);
					Text.Newline();
					Text.AddOutput("<i>“Rigard is a nice place, but I wish the Merchants' Guild was still around. Otherwise, the city is very good for my business. The residents of the city who shop here have very good taste and plenty of money. I'd avoid any of the less reputable areas of the city though. I've heard some terrible stories about people getting abducted around there.”</i> She says.", parse);
				}, enabled : true,
				tooltip : "Ask her what she thinks of Rigard."
			});
			options.push({ nameStr : "Fera",
				func : function() {
					Text.Clear();
					Text.AddOutput("You ask her about the cute catgirl that works for her.", parse);
					Text.Newline();
					Text.AddOutput("She rolls her eyes. <i>“Fera and her mother worked here for many years. Her mother was an excellent seamstress. Though not nearly as good as me, of course.”</i> She smiles awkwardly and flips her hair away from her face. <i>“When her mother disappeared years ago, I decided that I owed it to her to take care of Fera. She can only do basic sewing and is very clumsy, so I don't pay her much, but I let her live with me, feed her, and clothe her.”</i>", parse);
					Text.Newline();
					Text.AddOutput("She looks up as she says, <i>“I only hit her to discourage her clumsiness. Her blundering damages merchandise and costs me money.”</i>", parse);
					if(fera.flags["Mom"] == 0)
						fera.flags["Mom"] = 1;
				}, enabled : true,
				tooltip : "Ask about Fera."
			});
			if(fera.flags["Mom"] == 2) {
				options.push({ nameStr : "Fera's mom",
					func : function() {
						Text.Clear();
						
						if(player.FirstVag())									
							Text.AddOutput("You tell Miss Nexelle how sad and lonely Fera seems to be, and ask her about Fera's mother. She stops working and stays silent for a moment. When it finally comes, her response is uncharacteristically short. <i>“I miss her too, you know...”</i> she says quietly.", parse);
						else
							Text.AddOutput("You ask Miss Nexelle about Fera's mother, but she just ignores you and continues with her work.", parse);
						
						fera.flags["Mom"] = 3;
						Gui.NextPrompt(nexellePrompt);
					}, enabled : true,
					tooltip : "Talk to her about Fera's mother."
				});
			}
			Gui.SetButtonsFromList(options, true, PrintDefaultOptions);
		}
		nexellePrompt();
	}
));

world.loc.Rigard.ShopStreet.ClothShop.events.push(new Link(
	"Fera", true, function() { return fera.timeout.Expired(); },
	function() {
		var parse = {};
		// FERA
		var scenes = new EncounterTable();
		scenes.AddEnc(function() {
			Text.AddOutput("You see Fera sweeping the floors between the clothing racks.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.AddOutput("You see Fera wiping off the velvet covered counter.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.AddOutput("You see Fera run down the aisle carrying a large pile of clothes.", parse);
		}, 1.0, function() { return true; });
		scenes.AddEnc(function() {
			Text.AddOutput("You can see the cute catgirl organizing some robes on the racks.", parse);
		}, 1.0, function() { return true; });
		/*
		scenes.AddEnc(function() {
			Text.AddOutput("You cannot see Fera, perhaps Miss Nexelle sent her out on an errand.", parse);
			// TODO: TIMER
			// #disable ferachat for this visit/an hour
		}, 1.0, function() { return true; });
		*/
		scenes.Get();
		
		Text.Newline();
	},
	function() { Scenes.Fera.Interact(); }
));

world.loc.Rigard.ShopStreet.ClothShop.events.push(new Link(
	"Leave", true, true, null,
	function() {
		MoveToLocation(world.loc.Rigard.ShopStreet.street, {minute: 5});
	}
));

world.loc.Rigard.ShopStreet.ClothShop.endDescription = function() {
	var parse = {};
	
	if(world.time.hour >= 9 && world.time.hour < 12)
			Text.AddOutput("It is still early but there are a few customers currently in the clothing store.", parse);
	if(world.time.hour >= 12 && world.time.hour < 17)
		Text.AddOutput("It is currently prime business hours, and the shop is filled with customers.", parse);
	if(world.time.hour >= 17 && world.time.hour < 20)
		Text.AddOutput("It is now fairly late and the shop is almost deserted.", parse);
	Text.Newline();
	
	if(party.Two()) {
		Text.AddOutput("[p1name] walks around while you look around.", { p1name : party.Get(1).name });
		Text.Newline();
	}
	else if(!party.Alone()) {
		Text.AddOutput("Your companions walk around and look through all the clothes while you shop.", parse);
		Text.Newline();
	}
}
