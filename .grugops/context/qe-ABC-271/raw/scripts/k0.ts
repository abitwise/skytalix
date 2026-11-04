// qe-ABC-271 K0 independent re-read, one process per tree pair: the seven frozen rows on H and on B (main's copy), each
// against fixtures.json's k0 and H against B (nodes, score, move); then a break attempt where the E4a loop runs:
// search() at depth 7 on the 56 frozen rows and their mirrors (112), H against B, nodes / score / move identical.
// usage: node k0.ts <S> <fixtures.json>
import { readFileSync } from "node:fs";
const [S, fx] = process.argv.slice(2);
const FX = JSON.parse(readFileSync(fx, "utf8"));
const L = async (k: string) => ({ k, e: await import(`${S}/${k}/src/engine.ts`), s: await import(`${S}/${k}/src/search.ts`),
  f: await import(`${S}/${k}/src/fen.ts`), m: await import(`${S}/${k}/src/evaluate.mirror-corpus.ts`) });
const arms = [await L("H"), await L("B")];
const FEN: Record<string, string> = { kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  pos6: "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10" };
const mv = (m: any) => (m ? `${m.from}-${m.to}${m.promotion ?? ""}` : "-");
let fail = 0; const lines: string[] = [];
const rows: [string, string, number][] = [["kiwipete", "chooseMove", 8], ["kiwipete", "chooseMove", 9], ["pos6", "chooseMove", 8], ["pos6", "chooseMove", 9], ["pos6", "chooseMove", 10], ["kiwipete", "search", 8], ["pos6", "search", 8]];
for (const [b, how, d] of rows) {
  const r = arms.map((a) => { const p = a.f.parseFen(FEN[b]); const x: any = how === "search" ? a.s.search(p, d) : a.e.chooseMove(p, { budgetMs: 1e9, now: () => 0, maxDepth: d }); return `${x.nodes}/${x.score}/${mv(x.move)}`; });
  const key = `${b}_${how}_d${d}`, frozen = FX.k0[key];
  const ok = r[0] === r[1] && Number(r[0].split("/")[0]) === frozen;
  if (!ok) fail++;
  lines.push(`${key} frozen=${frozen} H=${r[0]} B=${r[1]} ${ok ? "OK" : "MISMATCH"}`);
}
let n = 0, diff = 0, nodesH = 0;
for (const row of [...FX.k1c, ...FX.k1a]) for (const mirror of [false, true]) {
  const r = arms.map((a) => { let p = a.f.parseFen(row.fen); if (mirror) p = a.m.mirrorPosition(p); const x: any = a.s.search(p, 7); return `${x.nodes}/${x.score}/${mv(x.move)}`; });
  n++; nodesH += Number(r[0].split("/")[0]); if (r[0] !== r[1]) { diff++; lines.push(`search d7 ${row.id}${mirror ? "-mirror" : ""} H=${r[0]} B=${r[1]} MISMATCH`); }
}
fail += diff;
lines.push(`search d7 frozen rows: ${n} positions, ${diff} differ, ${nodesH} nodes on H`);
console.log(lines.join("\n"));
console.log(fail === 0 ? "K0 OK" : `K0 FAIL ${fail}`);
