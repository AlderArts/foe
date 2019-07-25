
let curEncounter      = null;
let enemyParty        = null;
let currentActiveChar = null;

export function SetCurEncounter(enc) {
    curEncounter = enc;
}
export function SetEnemyParty(p) {
    enemyParty = p;
}
export function SetCurrentActiveChar(c) {
    currentActiveChar = c;
}

export function CurEncounter() {
    return curEncounter;
}
export function EnemyParty() {
    return enemyParty;
}
export function CurrentActiveChar() {
    return currentActiveChar;
}
