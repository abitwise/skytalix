// qe-ABC-229 Q-SET gate on the delivered head. (1) The src table Q_SET_PROMOTIONS in src/quiescence.test.ts equals the
// frozen fixture (fen, static, old, new) row for row, read mechanically from the source text. (2) Head's quiesce under
// the shipped rules and under the pre-ABC-229 rules equals the frozen values, QE's plain-negamax reference (written
// for qe-ABC-229-qset, rebuilt here on the head tree), and base's shipped quiesce. (3) QP-7 at ply 5 = 29 994. (4) The
// INFO row through search() at depth 8: 902 shipped, 186 on the door. No clock.
// usage: node qset-head.mjs <baseTree> <headTree> <frozen.json>
import { readFileSync } from "node:fs";
const [B, H, FROZEN] = process.argv.slice(2);
const { parseFen } = await import(`${H}/src/fen.ts`);
const { evaluate } = await import(`${H}/src/evaluate.ts`);
const { isInCheck, legalMoves, legalCaptures } = await import(`${H}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${H}/src/apply.ts`);
const qh = await import(`${H}/src/quiescence.ts`);
const sh = await import(`${H}/src/search.ts`);
const qb = await import(`${B}/src/quiescence.ts`);
const { parseFen: parseFenB } = await import(`${B}/src/fen.ts`);
const M = qh.MATE_SCORE, CAP = qh.QUIESCENCE_MAX_PLY, QUEEN = 5;
const SHIPPED = { evasions: true, quietPromotions: true };
const PRE229 = { evasions: true, quietPromotions: false };
function ref(p, qply, ply, newRule) {
  if (isInCheck(p) && qply < CAP) {
    const all = legalMoves(p);
    if (all.length === 0) return -(M - (ply + qply));
    let best = -Infinity;
    for (const m of all) { const u = makeMove(p, m); const v = -ref(p, qply + 1, ply, newRule); unmakeMove(p, m, u); if (v > best) best = v; }
    return best;
  }
  const stand = evaluate(p);
  if (qply >= CAP) return stand;
  let best = stand;
  const moves = legalCaptures(p);
  if (newRule) moves.push(...legalMoves(p).filter((m) => m.promotion === QUEEN && m.captured === 0));
  for (const m of moves) { const u = makeMove(p, m); const v = -ref(p, qply + 1, ply, newRule); unmakeMove(p, m, u); if (v > best) best = v; }
  return best;
}
const q = (fen, rules, ply = 0) => qh.quiesce(parseFen(fen), -Infinity, Infinity, 0, ply, rules, () => {});
const frozen = JSON.parse(readFileSync(FROZEN, "utf8")).rows;
const src = readFileSync(`${H}/src/quiescence.test.ts`, "utf8");
const block = src.slice(src.indexOf("const Q_SET_PROMOTIONS"), src.indexOf("const qpRow"));
const num = (s) => (s.trim() === "MATE_SCORE - 1" ? M - 1 : Number(s.trim().replace(/_/g, "")));
const srcRows = [...block.matchAll(/id: "(QP-\d)",[\s\S]*?fen: "([^"]+)",\s*stat: ([^,]+),\s*old: ([^,]+),\s*new: ([^,]+),\s*safe: (true|false)/g)].map((m) => ({ id: m[1], fen: m[2], stat: num(m[3]), old: num(m[4]), new: num(m[5]), safe: m[6] === "true" }));
let fails = 0, checks = 0;
const check = (name, ok) => { checks++; if (!ok) fails++; console.log(`${ok ? "PASS" : "FAIL"} ${name}`); };
check(`src table has 9 rows (read ${srcRows.length})`, srcRows.length === 9);
for (const f of frozen) {
  const id = f.id.split(" ")[0];
  const s = srcRows.find((r) => r.id === id);
  check(`${id} src row present`, !!s);
  if (s) check(`${id} src = frozen (fen ${s.fen === f.fen}, static ${s.stat}/${f.static}, old ${s.old}/${f.old}, new ${s.new}/${f.new})`, s.fen === f.fen && s.stat === f.static && s.old === f.old && s.new === f.new);
  const st = evaluate(parseFen(f.fen)), hs = q(f.fen, SHIPPED), ho = q(f.fen, PRE229);
  const rn = ref(parseFen(f.fen), 0, 0, true), ro = ref(parseFen(f.fen), 0, 0, false);
  const bo = qb.quiesce(parseFenB(f.fen), -Infinity, Infinity, 0, 0, { evasions: true }, () => {});
  console.log(`  ${id} static ${st} head-shipped ${hs} head-pre229 ${ho} ref-new ${rn} ref-old ${ro} base-shipped ${bo}`);
  check(`${id} static = frozen`, st === f.static);
  check(`${id} head shipped = frozen new = QE ref new`, hs === f.new && rn === f.new);
  check(`${id} head pre-229 = frozen old = QE ref old = base shipped`, ho === f.old && ro === f.old && bo === f.old);
  if (s?.safe) check(`${id} safe: new >= static + 600 and old = static`, hs >= st + 600 && ho === st);
}
check(`QP-7 at ply 5 = 29994 (read ${q("k7/2P5/1K6/8/8/8/8/8 w - - 0 1", SHIPPED, 5)})`, q("k7/2P5/1K6/8/8/8/8/8 w - - 0 1", SHIPPED, 5) === 29994);
const KPK = "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1";
const a = sh.search(parseFen(KPK), 8), d = sh.searchWithoutQuietPromotions(parseFen(KPK), 8);
check(`INFO kpk-b6c6 d8: search ${a.score} (902), door ${d.score} (186)`, a.score === 902 && d.score === 186);
console.log(`checks ${checks} fails ${fails}`);
