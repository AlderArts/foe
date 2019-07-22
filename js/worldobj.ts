
let world : any = null;

export function getWorld() {
    console.log("GET!");
    return world;
}
export function setWorld(w : any) {
    console.log("Set!");
    world = w;
}
