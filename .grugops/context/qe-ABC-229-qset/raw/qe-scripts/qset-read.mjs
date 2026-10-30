// qe-ABC-229-qset: read QE's quiet-promotion Q-SET candidates on the base tree (main a649fbc4) with QE's own
// plain-negamax references for the OLD rule (shipped: evasions on, captures only out of check) and the NEW rule
// (ADR-0053 d5: out of check, captures plus quiet promotions TO A QUEEN), and on an ORACLE tree (base + QE's
// scratch-only patch of d5, alpha-beta, the real recursion). No clock: quiesce and fixed-depth search() only.
// usage: node qset-read.mjs <baseTree> <oracleTree>
const [B, O] = process.argv.slice(2);
const { parseFen } = await import(`${B}/src/fen.ts`);
const { evaluate } = await import(`${B}/src/evaluate.ts`);
const { isInCheck, legalMoves, legalCaptures } = await import(`${B}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${B}/src/apply.ts`);
const { squareName } = await import(`${B}/src/position.ts`);
const qb = await import(`${B}/src/quiescence.ts`);
const sb = await import(`${B}/src/search.ts`);
const qo = await import(`${O}/src/quiescence.ts`);
const so = await import(`${O}/src/search.ts`);
const { parseFen: parseFenO } = await import(`${O}/src/fen.ts`);
const M = qb.MATE_SCORE;
const CAP = qb.QUIESCENCE_MAX_PLY;
const QUEEN = 5;
const lab = (m) => `${squareName(m.from)}${squareName(m.to)}${["", "", "n", "b", "r", "q"][m.promotion] ?? ""}`;
const quietQ = (p) => legalMoves(p).filter((m) => m.promotion === QUEEN && m.captured === 0);

// QE's reference: plain negamax, no window, no ordering. newRule adds quiet queen promotions out of check.
// Returns [value, best line]; ties keep the first move in generation order (captures, then quiet promotions).
function ref(p, qply, ply, newRule) {
  if (isInCheck(p) && qply < CAP) {
    const all = legalMoves(p);
    if (all.length === 0) return [-(M - (ply + qply)), []];
    let best = -Infinity, line = [];
    for (const m of all) {
      const u = makeMove(p, m);
      const [v, l] = ref(p, qply + 1, ply, newRule);
      unmakeMove(p, m, u);
      if (-v > best) { best = -v; line = [lab(m), ...l]; }
    }
    return [best, line];
  }
  const stand = evaluate(p);
  if (qply >= CAP) return [stand, []];
  let best = stand, line = [];
  const moves = legalCaptures(p);
  if (newRule) moves.push(...quietQ(p));
  for (const m of moves) {
    const u = makeMove(p, m);
    const [v, l] = ref(p, qply + 1, ply, newRule);
    unmakeMove(p, m, u);
    if (-v > best) { best = -v; line = [lab(m), ...l]; }
  }
  return [best, line];
}
const OLD = { evasions: true };
const NEW = { evasions: true, quietPromotions: true };
const PRE228 = { evasions: false };
const qB = (fen, rules, ply = 0, qply = 0) => qb.quiesce(parseFen(fen), -Infinity, Infinity, qply, ply, rules, () => {});
const qO = (fen, rules, ply = 0, qply = 0) => qo.quiesce(parseFenO(fen), -Infinity, Infinity, qply, ply, rules, () => {});

const ROWS = JSON.parse((await import("node:fs")).readFileSync(new URL("../qset/qset-229.json", import.meta.url), "utf8")).rows;

let fails = 0;
const out = [];
for (const r of ROWS) {
  const p = parseFen(r.fen);
  const row = {
    id: r.id, kind: r.kind, fen: r.fen,
    inCheck: isInCheck(p), legal: legalMoves(p).length,
    quietQueenPromotions: quietQ(p).map(lab),
    captures: legalCaptures(p).map(lab),
    static: evaluate(p),
  };
  const [newRef, newLine] = ref(parseFen(r.fen), 0, 0, true);
  const [oldRef, oldLine] = ref(parseFen(r.fen), 0, 0, false);
  row.oldShipped = qB(r.fen, OLD); // base quiesce, the shipped rule = the future door's quiesce
  row.oldRef = oldRef; row.oldLine = oldLine;
  row.newOracle = qO(r.fen, NEW);
  row.newRef = newRef; row.newLine = newLine;
  row.oracleOldRules = qO(r.fen, OLD); // the oracle tree with quietPromotions off = base, node for node in value
  row.pre228 = qB(r.fen, PRE228);
  row.separates = row.newRef !== row.oldRef;
  const checks = [
    ["old: shipped quiesce = QE old ref", row.oldShipped === oldRef],
    ["new: oracle quiesce = QE new ref", row.newOracle === newRef],
    ["oracle with quietPromotions off = base shipped", row.oracleOldRules === row.oldShipped],
  ];
  if (r.expect) {
    const e = r.expect;
    if (e.new !== undefined) checks.push([`new = ${e.new}`, newRef === e.new]);
    if (e.old !== undefined) checks.push([`old = ${e.old === "static" ? "static" : e.old}`, oldRef === (e.old === "static" ? row.static : e.old)]);
    if (e.newIsStatic) checks.push(["new = static", newRef === row.static]);
    if (e.oldIsStatic) checks.push(["old = static", oldRef === row.static]);
    if (e.safe) checks.push(["new >= static + 600", newRef >= row.static + 600]);
    if (e.separates !== undefined) checks.push([`separates = ${e.separates}`, row.separates === e.separates]);
    if (e.inCheck !== undefined) checks.push([`in check = ${e.inCheck}`, row.inCheck === e.inCheck]);
    if (e.hasQuietQ !== undefined) checks.push([`quiet Q promotion at root = ${e.hasQuietQ}`, (row.quietQueenPromotions.length > 0) === e.hasQuietQ]);
  }
  if (r.ply5) {
    row.newRefPly5 = ref(parseFen(r.fen), 0, 5, true)[0];
    row.newOraclePly5 = qO(r.fen, NEW, 5);
    checks.push(["ply 5 oracle = ref", row.newOraclePly5 === row.newRefPly5]);
  }
  if (r.searchDepths) {
    row.search = {};
    for (const d of r.searchDepths) {
      const b = sb.search(parseFen(r.fen), d), o = so.search(parseFenO(r.fen), d);
      row.search[`d${d}`] = { old: [b.score, b.move ? lab(b.move) : "none", b.nodes], new: [o.score, o.move ? lab(o.move) : "none", o.nodes] };
    }
  }
  row.checks = checks.map(([n, ok]) => `${ok ? "PASS" : "FAIL"} ${n}`);
  fails += checks.filter(([, ok]) => !ok).length;
  out.push(row);
}
for (const row of out) console.log(JSON.stringify(row));
console.log(`fails: ${fails}`);
