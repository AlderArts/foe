
export class Link {
	public name: any;
	public visibleCondition: any;
	public enabledCondition: any;
	public print: any;
	public func: CallableFunction;
    public tooltip: any;
    public image: any;

	constructor(name: any, visibleCondition: any, enabledCondition: any, print?: any, func?: CallableFunction, tooltip?: any) {
		// String or function that returns string
		this.name = name;
		// This can be set to true, or to a function
		// Both enabled and visible must be true for the option to be shown and active
		this.visibleCondition = visibleCondition;
		this.enabledCondition = enabledCondition;
		// This is called when the location is printed (can be an unconditional string)
		this.print = print;
		// This function is called when the player choses the option
		this.func = func;
		this.tooltip = tooltip;
	}
}
