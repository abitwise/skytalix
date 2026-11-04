// qe-ABC-270 K1 (e) independent re-check, one process: ABC-083 A2 (b) / A3 (b) phase-24 twins (ADR-0068 d5).
// On B (main src 4cb84035) and H (the build): phase 24, green, red with the base term zeroed; the old pawn-ending rows'
// readings for the record; same pawn shapes and equal material as the old rows; the four FENs appear as full string
// literals in H's test file (bapm-ABC-239-rulings line). FORWARD PROBE (report, grades nothing): the bite rows zero only
// the BASE pair; read them again with a queen-on pair non-zero (the probe's D5 shape: shelter (0, 0), with the queen (29, 0)).
// usage: node k1e.ts <S>
import { readFileSync } from "node:fs";
const [S] = process.argv.slice(2);
const OLD = { SHELTERED: "6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1", G6: "6k1/5ppp/6P1/8/8/8/5P1P/6K1 w - - 0 1",
  F5: "6k1/5ppp/8/5P2/8/8/6PP/6K1 w - - 0 1", E5: "6k1/5ppp/8/4P3/8/8/6PP/6K1 w - - 0 1" };
const TWIN = { SHELTERED: "rnbq1rk1/3nbppp/8/8/8/8/3NBPPP/RNBQ1RK1 w - - 0 1", G6: "rnbq1rk1/3nbppp/6P1/8/8/8/3NBP1P/RNBQ1RK1 w - - 0 1",
  F5: "rnbq1rk1/3nbppp/8/5P2/8/8/3NB1PP/RNBQ1RK1 w - - 0 1", E5: "rnbq1rk1/3nbppp/8/4P3/8/8/3NB1PP/RNBQ1RK1 w - - 0 1" };
const out: any = {}; let fail = 0; const no = (m: string) => { fail++; (out.bad ??= []).push(m); };
const src = readFileSync(`${S}/H/src/evaluate.king-mobility.test.ts`, "utf8");
// the old row constants as the test file declares them (OLD above must match the file's text)
for (const [k, f] of Object.entries(OLD)) if (!src.includes(`"${f}"`)) out[`oldNotInFile_${k}`] = f;
out.literal = Object.fromEntries(Object.entries(TWIN).map(([k, f]) => [k, (src.match(new RegExp(`"${f.replace(/[/]/g, "\\/")}"`, "g")) ?? []).length]));
for (const [k, n] of Object.entries(out.literal)) if ((n as number) < 1) no(`twin ${k} FEN not a literal in the test file`);
if (/rnbq1rk1\/3nbppp\/[^"]*\$\{|`rnbq1rk1/.test(src)) no("a template-built twin FEN in the test file");
const pawnsOnly = (f: string) => f.split(" ")[0].replace(/[nbrqkNBRQK]/g, "1");
const norm = (b: string) => b.split("/").map((r) => r.replace(/\d+/g, (m) => "1".repeat([...m].reduce((a, c) => a + Number(c), 0)))).join("/");
for (const k of Object.keys(OLD) as (keyof typeof OLD)[]) if (norm(pawnsOnly(OLD[k])) !== norm(pawnsOnly(TWIN[k]))) no(`twin ${k} pawn shape differs from the old row`);
for (const tree of ["B", "H"]) {
  const ev = await import(`${S}/${tree}/src/evaluate.ts`), P = await import(`${S}/${tree}/src/evaluate-params.ts`);
  const { parseFen } = await import(`${S}/${tree}/src/fen.ts`);
  const sc = (f: string, params: any = P) => ev.withParametersForTest(params, () => ev.evaluate(parseFen(f)));
  const z = (name: string, extra: any = {}) => ({ ...P, [name]: { mg: 0, eg: 0 }, ...extra });
  const r: any = { phases: Object.fromEntries(Object.entries(TWIN).map(([k, f]) => [k, ev.phaseOf(parseFen(f))])) };
  r.A2 = { sheltered: sc(TWIN.SHELTERED), g6: sc(TWIN.G6), zeroed: { sheltered: sc(TWIN.SHELTERED, z("KING_SHELTER_MISSING")), g6: sc(TWIN.G6, z("KING_SHELTER_MISSING")) } };
  r.A3 = { f5: sc(TWIN.F5), e5: sc(TWIN.E5), zeroed: { f5: sc(TWIN.F5, z("KING_FILE_HALF_OPEN")), e5: sc(TWIN.E5, z("KING_FILE_HALF_OPEN")) } };
  r.A2.green = r.A2.g6 < r.A2.sheltered; r.A2.redZeroed = r.A2.zeroed.g6 >= r.A2.zeroed.sheltered;
  r.A3.green = r.A3.e5 < r.A3.f5; r.A3.redZeroed = r.A3.zeroed.e5 >= r.A3.zeroed.f5;
  for (const [k, ph] of Object.entries(r.phases)) if (ph !== 24) no(`${tree} twin ${k} phase ${ph}`);
  if (!r.A2.green || !r.A2.redZeroed || !r.A3.green || !r.A3.redZeroed) no(`${tree} twin grade ${JSON.stringify([r.A2.green, r.A2.redZeroed, r.A3.green, r.A3.redZeroed])}`);
  r.old = { A2: { sheltered: sc(OLD.SHELTERED), g6: sc(OLD.G6), g6Zeroed: sc(OLD.G6, z("KING_SHELTER_MISSING")), shelteredZeroed: sc(OLD.SHELTERED, z("KING_SHELTER_MISSING")) },
    A3: { f5: sc(OLD.F5), e5: sc(OLD.E5), e5Zeroed: sc(OLD.E5, z("KING_FILE_HALF_OPEN")), f5Zeroed: sc(OLD.F5, z("KING_FILE_HALF_OPEN")) } };
  if (tree === "H") {
    // forward probe: queen-on shelter mg 29 (D5 shape), base shelter zeroed -> does the A2 bite row still read "red"?
    const q29 = { KING_SHELTER_MISSING_QUEEN: { mg: 29, eg: 0 } };
    const qh = { KING_FILE_HALF_OPEN_QUEEN: { mg: 20, eg: 0 } };
    r.forward = {
      A2_baseZeroed_queenOn29: { sheltered: sc(TWIN.SHELTERED, z("KING_SHELTER_MISSING", q29)), g6: sc(TWIN.G6, z("KING_SHELTER_MISSING", q29)) },
      A3_baseZeroed_queenOnHalfOpen20: { f5: sc(TWIN.F5, z("KING_FILE_HALF_OPEN", qh)), e5: sc(TWIN.E5, z("KING_FILE_HALF_OPEN", qh)) },
    };
    r.forward.A2_biteRowWouldRead = r.forward.A2_baseZeroed_queenOn29.g6 >= r.forward.A2_baseZeroed_queenOn29.sheltered ? "pass (red when zeroed)" : "FAIL (the bite row turns red: the queen-on pair still carries the shelter)";
    r.forward.A3_biteRowWouldRead = r.forward.A3_baseZeroed_queenOnHalfOpen20.e5 >= r.forward.A3_baseZeroed_queenOnHalfOpen20.f5 ? "pass" : "FAIL (the bite row turns red)";
  }
  out[tree] = r;
}
out.fail = fail;
console.log(JSON.stringify(out, null, 1));
console.log(fail === 0 ? "K1e OK" : `K1e FAIL ${fail}`);
