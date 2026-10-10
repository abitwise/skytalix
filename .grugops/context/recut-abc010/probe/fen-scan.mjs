// ABC-010 criterion 9(d) instrument (BA/PM, recut-abc010). Runs every FEN-shaped literal in
// <tree>/src and <tree>/spike through <tree>'s OWN parseFen and prints each rejected literal as
// file:line, the FenError message, and the FEN. Same literal regex and walk as the Architect's
// design-abc010/probe/fen-corpus.mjs. Reads only; writes nothing.  Usage: node fen-scan.mjs <tree>
import { readdirSync, readFileSync, statSync } from "node:fs";
const tree = process.argv[2];
const { parseFen } = await import(`${tree}/src/fen.ts`);
const RE = /([pnbrqkPNBRQK1-8]{1,8}(?:\/[pnbrqkPNBRQK1-8]{1,8}){7})\s+([wb])\s+(\S+)\s+(\S+)\s+(\d+)\s+(\d+)/g;
const files = [];
const walk = (d) => { for (const n of readdirSync(d)) { const f = `${d}/${n}`; if (statSync(f).isDirectory()) { if (n !== "__snapshots__") walk(f); } else if (n.endsWith(".ts") || n.endsWith(".json")) files.push(f); } };
walk(`${tree}/src`); walk(`${tree}/spike`);
let seen = 0; const rejects = []; const byFile = new Map();
for (const f of files) {
  readFileSync(f, "utf8").split("\n").forEach((line, i) => {
    for (const m of line.matchAll(RE)) {
      seen++;
      const fen = m[0].replace(/\s+/g, " ");
      try { parseFen(fen); } catch (e) {
        const rel = f.slice(tree.length + 1);
        byFile.set(rel, (byFile.get(rel) ?? 0) + 1);
        rejects.push(`${rel}:${i + 1}  ${String(e.message).slice(0, 80)}  ::  ${fen.slice(0, 70)}`);
      }
    }
  });
}
console.log(`files scanned ${files.length}; FEN-shaped literals ${seen}; rejected by parseFen ${rejects.length}`);
for (const [f, n] of [...byFile].sort()) console.log(`  by file: ${f} ${n}`);
for (const r of rejects) console.log("  " + r);
