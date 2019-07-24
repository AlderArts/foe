import { GetDEBUG } from '../app';
import { Text } from './text';
import { Color } from './body/color';
import { Unit } from './utility';
import { PregnancyHandler } from './pregnancy';

let EntityDesc = {
	PrintDescription : function(partial) {
		
		var parse = {
			name     : this.NameDesc(),
			possesive: this.possessive(),
			weigth   : Math.floor(this.body.weigth.Get() * 2),
			race     : this.body.RaceStr(),
			gender   : this.body.GenderStr(),
			skinDesc : this.body.SkinDesc(),
			faceDesc : this.body.FaceDescLong(),
			eyeCount : Text.NumToText(this.body.head.eyes.count.Get()),
			eyeColor : Color.Desc(this.body.head.eyes.color),
			eyeS     : this.body.head.eyes.count.Get() == 1 ? "" : "s",
			hairDesc : this.body.head.hair.Long(),
			buttDesc : this.Butt().Long(),
			hipsDesc : this.HipsDesc(),
			anusDesc : this.Butt().AnalLong(),
			ballsDesc: this.Balls().Long(),
			has      : this.has(),
			is       : this.is(),
			larmor   : this.LowerArmorDescLong()
		};
		parse = this.ParserTags(parse);
		parse = this.ParserPronouns(parse);
		var height = Math.floor(Unit.CmToInch(this.body.height.Get()));
		var height_feet = Math.floor(height / 12);
		var height_inches = Math.floor(height % 12);
		parse["height"] = height_feet + " feet";
		if(height_inches > 0) {
			parse["height"] += " and " + height_inches + " inch";
			if(height_inches > 1) {
				parse["height"] += "es";
			}
		}
		
		Text.Add("[name] [is] a [gender] [race], [height] tall and weighing around [weigth]lb. [HeShe] [has] [skinDesc]. ", parse);
		Text.Add("[HeShe] [is] wearing [armor].", parse);
		if(this.LowerArmor()) Text.Add(" [HeShe] [is] wearing [larmor].", parse);
		if(this.Weapon()) Text.Add(" [HeShe] [is] wielding [weapon].", parse);
		// TODO Body appearance, skin color
		Text.NL();
		Text.Add("[HeShe] [has] [faceDesc]. [HisHer] [eyeCount] [eyeColor] [eye][eyeS] observe the surroundings. ", parse);
		Text.Add("A pair of [ears] sticks out from [possesive] [hairDesc]. ", parse);
		
		for(var i = 0; i < this.body.head.appendages.length; i++) {
			var a = this.body.head.appendages[i];
			parse.appDesc = a.Long();
			Text.Add("On [hisher] head, [heshe] [has] a [appDesc]. ", parse);
		}
		
		Text.NL();
		var bs = false;
		// Back slots
		for(var i = 0; i < this.body.backSlots.length; i++) {
			var b = this.body.backSlots[i];
			parse.appDesc = b.Long();
			Text.Add("On [hisher] back, [heshe] [has] a [appDesc]. ", parse);
			bs = true;
		}
		if(bs) Text.NL();
		
		// TODO: Arms/Legs
		if(this.body.legs.count == 2) {
			Text.Add("[name] [has] arms. [name] [has] [legs], ending in [feet].", parse);
		}
		else if(this.body.legs.count > 2) {
			parse["num"] = Text.NumToText(this.body.legs.count);
			parse["race"] = this.body.legs.race.qShort();
			Text.Add("[name] [has] arms and [num] [race] legs.", parse);
		}
		else {
			parse["race"] = this.body.legs.race.qShort();
			Text.Add("[name] [has] arms and [race] lower body.", parse);
		}
		Text.NL();
		
		// TODO: Hips/butt
		Text.Add("[name] [has] [hipsDesc], and [buttDesc].", parse);
		Text.NL();
		
		// TODO: Breasts
		var breasts = this.body.breasts;
		if(breasts.length == 1) {
			parse.breastDesc = breasts[0].Long();
			Text.Add("[HeShe] [has] [breastDesc].", parse);
		}
		else if(breasts.length > 1) {
			var breast = breasts[0];
			var breastDesc = breast.Desc();
			parse.breastDesc = breasts[0].Short();
			parse.breastSize = breastDesc.size;
			Text.Add("Multiple rows of " + breast.nounPlural() + " sprout from [hisher] chest. [HisHer] first pair of [breastDesc] are [breastSize] in circumference.", parse);
			for(var i = 1; i < breasts.length; i++) {
				Text.Add("<br>Another two breasts.");
			}
		}
		else {
			Text.Add("[name] have a featureless smooth chest.", parse);
		}
		if(breasts.length > 0)
			this.LactationDesc(parse);
		Text.NL();
		
		// Genetalia
		var cocks = this.body.cock;
		var vags = this.body.vagina;
		
		if(cocks.length == 1) {
			var cock = cocks[0];
			parse.cockDesc = cock.aLong();
			Text.Add("[name] [has] [cockDesc].", parse);
		}
		else if(cocks.length > 1) {
			var cock = cocks[0];
			parse.cockDesc = cock.aLong();
			parse.numCocks = Text.NumToText(cocks.length);
			Text.Add("[name] [has] a brace of [numCocks] " + cock.nounPlural() + ".", parse);
			for(var i = 0; i < cocks.length; i++) {
				var cock = cocks[i];
				parse.cockDesc = cock.aLong();
				Text.NL();
				Text.Add("[name] [has] [cockDesc].", parse);
			}
		}
		if(cocks[0])
			Text.NL();
		
		// TODO: balls
		if(this.HasBalls())
		{
			if(cocks.length > 0 || vags.length > 0) {
				Text.Add("Beneath [hisher] other genitalia, [ballsDesc] hang.", parse);
			}
			else {
				// Weird, no genetalia, just balls
				Text.Add("Strangely, [ballsDesc] hang from [hisher] otherwise flat crotch.", parse);
			}
			Text.NL();
		}
		else if(cocks.length == 0 && vags.length == 0) {
			// Genderless, no balls
			Text.Add("[name] [has] a smooth, featureless crotch.", parse);
			Text.NL();
		}
		
		// TODO: vagina
		if(vags.length == 1) {
			var vag = vags[0];
			var vagDesc = vag.Desc();
			Text.Add("[name] [has] " + vagDesc.a + " " + vagDesc.adj + " " + vag.noun() + ".", parse);
		}
		else if(vags.length > 1) {
			var vag = vags[0];
			Text.Add("[name] [has] multiple " + vag.nounPlural() + ". [HisHer] first " + vag.noun() + " is slutty.<br>", parse);
			for(var i = 1; i < vags.length; i++) {
				Text.Add("<br>Another of [hisher] " + vag.nounPlural() + " is slutty.", parse);
			}
		}
		if(vags[0])
			Text.NL();
		
		if(partial) {
			return;
		}
		
		// TODO TEMP
		var balls = this.Balls();
		Text.Add("Cum: " + balls.cum.Get().toFixed(2) + " / " + balls.CumCap().toFixed(2));
		Text.NL();
		Text.Add("Milk: " + this.Milk().toFixed(2) + " / " + this.MilkCap().toFixed(2));
		Text.NL();
		
		// TODO: Pregnancy
		var womb = this.pregHandler.Womb({slot: PregnancyHandler.Slot.Vag});
		if(womb && womb.pregnant) {
			parse["proc"] = (womb.progress * 100).toFixed(1);
			parse["hour"] = womb.hoursToBirth.toFixed(1);
			Text.Add("[name] [is] pregnant. Current progress, [proc]%. [hour] hours to term.", parse);
			Text.NL();
		}
		
		womb = this.pregHandler.Womb({slot: PregnancyHandler.Slot.Butt});
		if(womb && womb.pregnant) {
			parse["proc"] = (womb.progress * 100).toFixed(1);
			parse["hour"] = womb.hoursToBirth.toFixed(1);
			Text.Add("[name] [is] butt-pregnant. Current progress, [proc]%. [hour] hours to term.", parse);
			Text.NL();
		}
		
		// TODO: Ass
		Text.Add("[name] [has] [anusDesc].", parse);
		
		if(GetDEBUG()) {
			Text.NL();
			Text.Add("DEBUG: relation: " + this.relation.Get(), null, 'bold');
			Text.NL();
			Text.Add("DEBUG: subDom: " + this.subDom.Get(), null, 'bold');
			Text.NL();
			Text.Add("DEBUG: slut: " + this.slut.Get(), null, 'bold');
			Text.NL();
		}
		
		var drunk = this.DrunkStr();
		if(drunk) {
			Text.NL();
			Text.Add(drunk);
		}
		
		Text.Flush();
	},
}

let LowerBodyType = {
	Single   : 0,
	Humanoid : 1,
	Taur     : 2
};

export { LowerBodyType, EntityDesc };
