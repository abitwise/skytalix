export const LOAD_SALT = Math.random();
let calls = 0;
export function next(): number { return ++calls; }
