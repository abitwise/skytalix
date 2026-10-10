// qe-ABC-127 (A2 provenance): is every new row's FEN reproducible from the seed in its `source`?
// Lifts `rng` + `gen` verbatim (as text) out of the build's curate-m3.mjs / curate-wm.mjs, runs them
// with the build's curation oracle helpers, and compares toFen(gen(seed)) with the committed FEN.
// No engine is loaded (selection is engine-dependent; the placement is not).
// Usage (worktree root): node .grugops/context/qe-ABC-127/probe/seed-repro.mjs <corpus.ts>
import { readFileSync } from "node:fs";
const C = ".grugops/context/ticket-to-pr-ABC-127/probe/curation";
const O = await import(`${process.cwd()}/${C}/oracle.mjs`);
const lift = (file) => {
  const t = readFileSync(`${C}/${file}`, "utf8");
  const body = t.slice(t.indexOf("function rng("), t.indexOf("\nfor (let seed"));
  return new Function(...Object.keys(O), `${body}; return gen;`)(...Object.values(O));
};
const gen = { "mate-in-3": lift("curate-m3.mjs"), "win-material": lift("curate-wm.mjs") };
const text = readFileSync(process.argv[2], "utf8");
let ok = 0, n = 0;
for (const m of text.matchAll(/\{ name: "[^"]+", fen: "([^"]+)", kind: "(mate-in-3|win-material)",[^\n]*tags:[^\n]*seed (\d+)` \}/g)) {
  n++;
  const pos = gen[m[2]](Number(m[3]));
  const fen = pos ? O.toFen(pos) : "null";
  const same = fen.split(" ").slice(0, 2).join(" ") === m[1].split(" ").slice(0, 2).join(" ");
  if (same) ok++;
  console.log(`${same ? "REPRODUCED" : "DIFFERS"}\t${m[2]}\tseed ${m[3]}\t${m[1]}${same ? "" : `\tgen ${fen}`}`);
}
console.log(`SEEDS reproduced ${ok}/${n}`);
