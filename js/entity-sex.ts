/*
 * New Sex functions
 */
export namespace Sex {
	export function Cunnilingus(giver : any, reciever : any) {
		if(giver)    giver.sex.gCunn++;
		if(reciever) reciever.sex.rCunn++;
	}
	export function Blowjob(giver : any, reciever : any) {
		if(giver)    giver.sex.gBlow++;
		if(reciever) reciever.sex.rBlow++;
	}
	export function Vaginal(giver : any, reciever : any) {
		if(giver)    giver.sex.gVag++;
		if(reciever) reciever.sex.rVag++;
	}
	export function Anal(giver : any, reciever : any) {
		if(giver)    giver.sex.gAnal++;
		if(reciever) reciever.sex.rAnal++;
	}
	export function Preg(father : any, mother : any, num? : number) {
		num = num || 1;
		if(father) father.sex.sired += num;
		if(mother) mother.sex.birth += num;
	}	
};
