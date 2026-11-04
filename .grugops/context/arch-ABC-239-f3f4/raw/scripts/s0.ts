// arch-ABC-239-f3f4 S0: a generated table deep-equals the real module's exports.
// usage: node s0.ts <generated.ts> <real.ts>
import { isDeepStrictEqual } from "node:util";
const [g, r] = process.argv.slice(2) as [string, string];
const G = await import(g);
const R = await import(r);
const a = JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(G))));
const b = JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(R))));
console.log(`S0 ${g.split("/").pop()} vs ${r.split("/").pop()}: keys ${Object.keys(a).length}/${Object.keys(b).length} deepEqual ${isDeepStrictEqual(a, b)}`);
