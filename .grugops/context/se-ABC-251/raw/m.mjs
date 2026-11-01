const isB = (p) => (p & 8) !== 0;
function hot(a) { let c = 0; for (let i = 0; i < a.length; i++) { if (isB(a[i])) c += a[i]; else c -= 1; } return c; }
const a = new Uint8Array(4096); for (let i = 0; i < a.length; i++) a[i] = (i * 7919) & 15;
let s = 0; const t = Date.now(); while (Date.now() - t < 1500) s += hot(a);
console.log(s > 0);
