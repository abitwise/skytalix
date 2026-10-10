// ABC-010 design hop: the page's acceptance FENs and the round-trip property against the variant-B prototype.
// Usage: node fen-accept-b.mjs <tree>   (<tree>/src/fen.ts = prototype; nothing in the repo changes)
import { readdirSync, readFileSync } from "node:fs";
const tree = process.argv[2];
const { parseFen, toFen, FenError } = await import(`${tree}/src/fen.ts`);
const rows = [
  "4k3/8/8/8/8/8/8/K7 w KQ - 0 1", "4k3/8/8/8/8/8/8/4K3 w K - 0 1", "4k3/8/4Q3/8/8/8/8/4K3 w - - 0 1",
  "4k3/8/8/8/8/8/8/P3K3 w - - 0 1", "4k3/8/8/8/8/8/8/4K3 w - e6 0 1",
  `4k3/8/8/8/8/8/8/4K3 w - - ${"9".repeat(400)} 1`, "4k3/8/8/8/8/8/8/4K3 w - - 0 1000000000000000000000",
  "4k3/8/8/8/8/8/8/4K3 w - - 00 1",
];
for (const f of rows) { try { parseFen(f); console.log(`ACCEPTED :: ${f.slice(0, 44)}`); } catch (e) { console.log(`${e instanceof FenError ? "FenError" : e.constructor.name}: ${e.message} :: ${f.slice(0, 44)}`); } }
for (const v of [null, undefined, 42, {}, []]) { try { parseFen(v); } catch (e) { console.log(`${JSON.stringify(v) ?? "undefined"} -> instanceof FenError=${e instanceof FenError}: ${e.message}`); } }
const RE = /([pnbrqkPNBRQK1-8]{1,8}(?:\/[pnbrqkPNBRQK1-8]{1,8}){7})\s+([wb])\s+(\S+)\s+(\S+)\s+(\d+)\s+(\d+)/g;
let accepted = 0, bad = 0; const seen = new Set();
for (const n of readdirSync(`${tree}/src`).filter((n) => n.endsWith(".ts"))) for (const m of readFileSync(`${tree}/src/${n}`, "utf8").matchAll(RE)) {
  const f = m[0].replace(/\s+/g, " "); if (seen.has(f)) continue; seen.add(f);
  let p; try { p = parseFen(f); } catch { continue; } accepted++;
  const once = toFen(p); let twice; try { twice = toFen(parseFen(once)); } catch (e) { bad++; console.log(`ROUND TRIP THROWS ${f}: ${e.message}`); continue; }
  if (twice !== once) { bad++; console.log(`ROUND TRIP DIFFERS ${f}`); }
}
console.log(`round trip over ${accepted} distinct accepted repo FENs: ${bad} failures`);
