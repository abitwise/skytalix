const isB = (p) => (p & 8) !== 0;
const mix = (p) => ((p * 31) ^ (p >> 3) ^ (p << 5)) & 1023;
function hot(a) { let c = 0; for (let i = 0; i < a.length; i++) { const v = a[i]; if (isB(v)) c += mix(v); else c -= mix(v + 1); } return c; }
const a = new Uint8Array(4096); for (let i = 0; i < a.length; i++) a[i] = (i * 7919) & 15;
let s = 0; const t = Date.now(); while (Date.now() - t < 1500) s += hot(a);
console.log(s !== 0);
