const wt = process.argv[2];
const { parseFen, toFen, FenError } = await import(`${wt}/src/fen.ts`);
const { legalMoves } = await import(`${wt}/src/legal.ts`);
const cases = [
  "4k3/8/8/8/8/8/8/K7 w KQ - 0 1",
  "4k3/8/8/8/8/8/8/4K3 w K - 0 1",
  "4k3/8/4Q3/8/8/8/8/4K3 w - - 0 1",
  "4k3/8/8/8/8/8/8/P3K3 w - - 0 1",
  `4k3/8/8/8/8/8/8/4K3 w - - ${"9".repeat(400)} 1`,
  "4k3/8/8/8/8/8/8/4K3 w - - 0 1000000000000000000000",
];
for (const f of cases) {
  try { const p = parseFen(f); const out = toFen(p); let rt = "ok"; try { parseFen(out); } catch (e) { rt = `re-parse throws`; }
    console.log(`ACCEPTED legal=${legalMoves(parseFen(f)).length} toFen tail="${out.split(" ").slice(4).join(" ").slice(0,30)}" ${rt} :: ${f.slice(0,40)}`);
  } catch (e) { console.log(`REJECTED ${e.constructor.name}: ${e.message} :: ${f.slice(0,40)}`); }
}
for (const v of [null, undefined, 42, {}, []]) { try { parseFen(v); console.log("accepted", v); } catch (e) { console.log(`${JSON.stringify(v)} -> ${e.constructor.name} instanceof FenError=${e instanceof FenError}`); } }
