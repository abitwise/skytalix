// qe-ABC-228 Q-SET review: every row (the SE's 12 and QE's 6) read on a tree with QE's own brute-force reference.
// usage: node qset-read.mjs <headTree>
const T = process.argv[2];
const { parseFen } = await import(`${T}/src/fen.ts`);
const { evaluate } = await import(`${T}/src/evaluate.ts`);
const { isInCheck, legalMoves, legalCaptures } = await import(`${T}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${T}/src/apply.ts`);
const { squareName } = await import(`${T}/src/position.ts`);
const q = await import(`${T}/src/quiescence.ts`);
const s = await import(`${T}/src/search.ts`);
const e = await import(`${T}/src/engine.ts`);
const M = q.MATE_SCORE;
const CAP = q.QUIESCENCE_MAX_PLY;
const ON = { evasions: true };
const OFF = { evasions: false };
const lab = (m) => (m ? `${squareName(m.from)}${squareName(m.to)}${["", "", "n", "b", "r", "q"][m.promotion] ?? ""}` : "none");

// QE's reference, written for this review (not the SE's): plain negamax, no window, no ordering, no cutoff.
function qeRef(p, qply, ply) {
  const inCheck = isInCheck(p);
  if (inCheck && qply < CAP) {
    const all = legalMoves(p);
    if (all.length === 0) return -(M - (ply + qply));
    let best = -Infinity;
    for (const m of all) {
      const u = makeMove(p, m);
      best = Math.max(best, -qeRef(p, qply + 1, ply));
      unmakeMove(p, m, u);
    }
    return best;
  }
  const stand = evaluate(p);
  if (qply >= CAP) return stand;
  let best = stand;
  for (const m of legalCaptures(p)) {
    const u = makeMove(p, m);
    best = Math.max(best, -qeRef(p, qply + 1, ply));
    unmakeMove(p, m, u);
  }
  return best;
}
// v2: the pre-ticket rule as plain negamax (stand pat, then captures, check ignored), so `off` is predicted exactly.
// v1's predicate "off = static" was QE's error: the pre-ticket rule also searches captures, a capture evasion included.
function preRef(p, qply) {
  const stand = evaluate(p);
  if (qply >= CAP) return stand;
  let best = stand;
  for (const m of legalCaptures(p)) {
    const u = makeMove(p, m);
    best = Math.max(best, -preRef(p, qply + 1));
    unmakeMove(p, m, u);
  }
  return best;
}
const qAt = (fen, rules, ply = 0, qply = 0) => q.quiesce(parseFen(fen), -Infinity, Infinity, qply, ply, rules, () => {});
const isMate = (v) => Math.abs(v) >= M - 1000;

const ROWS = [
  // the SE's 12 (src/quiescence.test.ts at 9bd3c519)
  { id: "SE-C1 Q2 quiet king evasions only", kind: "check", fen: "4k3/8/8/8/8/8/4R3/4K3 b - - 0 1", pin: -536 },
  { id: "SE-C2 interposition Bf1", kind: "check", fen: "6k1/5ppp/8/8/2B5/8/5PPP/r5K1 w - - 0 1" },
  { id: "SE-C3 capture of the checker", kind: "check", fen: "4k3/8/8/8/8/8/3q4/3QK3 w - - 0 1" },
  { id: "SE-C4 evasion loses material", kind: "check", fen: "4k3/8/8/8/8/8/8/Q3K2r w - - 0 1", pin: -544 },
  { id: "SE-C5 double check", kind: "check", fen: "4k3/8/8/rB6/8/8/8/4R1K1 b - - 0 1" },
  { id: "SE-C6 promotion blocks", kind: "check", fen: "K6r/4P3/8/8/8/8/8/k7 w - - 0 1" },
  { id: "SE-M1 Q1 Qxf7", kind: "mate", fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4", pin: M - 1 },
  { id: "SE-M2 two-capture exchange", kind: "mate", fen: "5r1k/6pp/3q4/8/8/8/5RPP/5RK1 w - - 0 1", pin: M - 3 },
  { id: "SE-M3 capturing promotion", kind: "mate", fen: "k2r4/ppP5/8/8/8/8/8/7K w - - 0 1", pin: M - 1 },
  { id: "SE-M4 en passant", kind: "mate", fen: "3rkr2/5p2/1N6/3pP3/8/8/8/4R2K w - d6 0 2", pin: M - 1 },
  { id: "SE-M5 exactly one evasion, not mate", kind: "one", fen: "4n1k1/5pp1/8/8/8/8/5PPP/4R1K1 w - - 0 1" },
  { id: "SE-M6 through search() d1", kind: "search", fen: "6k1/2n2ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1", pin: M - 3, move: "d1d8" },
  // QE's 6 (PREREG 20261030T072548Z-qe-e2e-decision-06163ef3)
  { id: "QE-C1 knight check, pawn takes the checker", kind: "check", fen: "4k3/2p5/3N4/8/8/8/8/4K3 b - - 0 1" },
  { id: "QE-C2 pawn check, en-passant evasion", kind: "check", fen: "4k3/8/8/3pP3/4K3/8/8/8 w - d6 0 1" },
  { id: "QE-C3 capturing promotion takes the checker", kind: "check", fen: "3r3k/4P3/8/8/8/8/8/3K4 w - - 0 1" },
  { id: "QE-M1 mated in quiescence, negative sign", kind: "mate", fen: "1R4k1/5ppp/8/8/8/8/7K/3r4 b - - 0 1", pin: -(M - 2), searchDepths: [1, 2, 3] },
  { id: "QE-M2 smothered, knight capture", kind: "mate", fen: "6rk/5bpp/8/6N1/8/8/8/6K1 w - - 0 1", pin: M - 1, ply5: M - 6 },
  { id: "QE-M3 direct call on a checkmated node", kind: "mated", fen: "4R1k1/5ppp/8/8/8/8/8/6K1 b - - 0 1", pin: -M, ply3: -(M - 3) },
  // post-PREREG INFO rows (added after v1 showed SE-C3/QE-C1/QE-C2 do not discriminate).
  // v2a's first board (Qd1, no Rf1) was mis-described by QE: Qxf2 is not a legal move there (d1-f2 is no queen line),
  // so every evasion is a king move into Nxd1, the same kind as SE-C4. It is kept as read, under its true kind.
  { id: "QE-C4a (INFO, post-PREREG) fork: every evasion is a king move, Nxd1 follows", kind: "check", fen: "5rk1/6pp/8/8/8/8/PPP2n2/3Q3K w - - 0 1", mustDiscriminate: true },
  // Nf2+ forks Kh1 and Qd1; Rxf2 (Rxf2 recaptures) is the best evasion and is below the static score, so the
  // pre-ticket rule (stand pat) and the evasion rule must differ on a capture-of-the-checker row.
  { id: "QE-C4 (INFO, post-PREREG) taking the checker is best and still loses material", kind: "check", fen: "5rk1/6pp/8/8/8/8/PPP2n2/3Q1R1K w - - 0 1", mustDiscriminate: true },
];

let fails = 0;
const verdict = (ok, why) => {
  if (!ok) fails++;
  return ok ? "PASS" : `FAIL(${why})`;
};
for (const r of ROWS) {
  const p = parseFen(r.fen);
  const stat = evaluate(p);
  const on = qAt(r.fen, ON);
  const off = qAt(r.fen, OFF);
  const ref = qeRef(parseFen(r.fen), 0, 0);
  const out = { id: r.id, check: isInCheck(p), legal: legalMoves(p).length, static: stat, on, off, qeRef: ref };
  const checks = [];
  checks.push(["on = QE ref", on === ref]);
  if (r.kind === "check") {
    out.preRef = preRef(parseFen(r.fen), 0);
    out.discriminates = on !== off;
    checks.push(["in check", isInCheck(p)], ["on != static", on !== stat], ["off = pre-ticket ref", off === out.preRef]);
    if (r.mustDiscriminate) checks.push(["on != off", on !== off]);
    // the best evasion's quiescence score one ply deeper
    let best = -Infinity;
    for (const m of legalMoves(p)) {
      const u = makeMove(p, m);
      best = Math.max(best, -q.quiesce(p, -Infinity, Infinity, 1, 0, ON, () => {}));
      unmakeMove(p, m, u);
    }
    out.bestEvasion = best;
    checks.push(["on = best evasion", on === best]);
    // never static below the cap
    let never = true;
    for (let qp = 0; qp < CAP; qp++) if (qAt(r.fen, ON, 0, qp) === stat) never = false;
    checks.push(["never static qply 0..7", never]);
  }
  if (r.kind === "mate") {
    checks.push(["not in check at root", !isInCheck(p) || r.pin < 0], ["off not mate", !isMate(off)]);
    if (r.ply5 !== undefined) {
      out.ply5 = qAt(r.fen, ON, 5);
      checks.push(["ply 5", out.ply5 === r.ply5]);
    } else if (r.pin > 0) {
      out.ply5 = qAt(r.fen, ON, 5);
      checks.push(["ply 5 = pin - 5", out.ply5 === r.pin - 5]);
    }
  }
  if (r.kind === "mated") {
    out.ply3 = qAt(r.fen, ON, 3);
    out.cap = qAt(r.fen, ON, 0, CAP);
    checks.push(["ply 3", out.ply3 === r.ply3], ["cap stands pat", out.cap === stat], ["off = static", off === stat]);
  }
  if (r.kind === "one") checks.push(["not mate", !isMate(on)]);
  if (r.pin !== undefined && r.kind !== "search") checks.push([`pin ${r.pin}`, on === r.pin]);
  if (r.kind === "search") {
    const sr = s.search(parseFen(r.fen), 1);
    const door = s.searchWithoutQuiescenceEvasions(parseFen(r.fen), 1);
    out.search1 = [sr.score, lab(sr.move)];
    out.door1 = door.score;
    checks.push(["search d1 = pin", sr.score === r.pin], ["move", lab(sr.move) === r.move], ["door not mate", !isMate(door.score)]);
  }
  if (r.searchDepths) {
    out.search = r.searchDepths.map((d) => s.search(parseFen(r.fen), d).score);
    out.choose = r.searchDepths.map((d) => e.chooseMove(parseFen(r.fen), { budgetMs: 1000, now: () => 0, maxDepth: d }).score);
    out.door = r.searchDepths.map((d) => s.searchWithoutQuiescenceEvasions(parseFen(r.fen), d).score);
    checks.push(["search d1..3 = pin", out.search.every((v) => v === r.pin)], ["chooseMove to d1..3 = pin", out.choose.every((v) => v === r.pin)]);
  }
  out.checks = checks.map(([n, ok]) => `${n}:${verdict(ok, n)}`).join(" ");
  console.log(JSON.stringify(out));
}
console.log(fails === 0 ? "Q-SET REVIEW: ALL PASS" : `Q-SET REVIEW: ${fails} FAILED CHECKS`);
