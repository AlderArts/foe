let worldTime : any = null;

export function InitWorldTime(time : any) {
    worldTime = time;
}

export function WorldTime() {
    return worldTime;
}
