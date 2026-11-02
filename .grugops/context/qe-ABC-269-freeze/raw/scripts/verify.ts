// QE qe-ABC-269-freeze: reads the COMMITTED fixture and checks every stated property on main.
const W = "/home/olger/projects/public/skytalix/.claude/worktrees/qe-ABC-269-freeze/src/";
const F = await import(W + "evaluate.taper-corpus.ts");
const { parseFen, toFen } = await import(W + "fen.ts");
const { evaluate, isPassedPawn } = await import(W + "evaluate.ts");
const { buildCorpus, mirrorPosition } = await import(W + "evaluate.mirror-corpus.ts");
const PW = [0, 0, 1, 1, 2, 4, 0];
const phase = (p: any) => { let s = 0; for (let q = 0; q < 128; q++) if (!(q & 0x88) && p.board[q]) s += PW[p.board[q] & 7]; return s; };
const sq = (n: string) => (Number(n[1]) - 1) * 16 + (n.charCodeAt(0) - 97);
const diff = (a: any, b: any) => { const d: number[] = []; for (let q = 0; q < 128; q++) if (!(q & 0x88) && a.board[q] !== b.board[q]) d.push(q); return d; };
let fails = 0; const ok = (c: boolean, m: string) => { if (!c) { fails++; console.log("FAIL", m); } };
const M = F.TAPER_MIRROR_POSITIONS;
ok(M.length >= 15, "mirror >= 15");
const phases = new Set(M.map((m: any) => Math.min(24, m.rawPhase)));
for (let w = 0; w <= 24; w++) ok(phases.has(w), "phase " + w + " covered");
ok(new Set(M.map((m: any) => m.id)).size === M.length, "mirror ids unique");
for (const m of M) { const p = parseFen(m.fen); ok(phase(p) === m.rawPhase, "rawPhase " + m.id); ok(toFen(p) === m.fen, "canonical " + m.id); ok(Object.is(evaluate(p), evaluate(mirrorPosition(p))), "main mirror " + m.id); }
ok(M.filter((m: any) => m.rawPhase >= 24).length === 3, "three rows at raw phase >= 24");
for (const k of [...F.TAPER_KP_ENDINGS, ...F.TAPER_KP_SHELTER_STRESS]) {
  const c = parseFen(k.centreFen), e = parseFen(k.cornerFen);
  ok(phase(c) === 0 && phase(e) === 0, "kp phase " + k.id);
  const d = diff(c, e); const K = k.walkingKing === "white" ? 6 : 14;
  ok(d.length === 2 && d.includes(sq(k.centreSquare)) && d.includes(sq(k.cornerSquare)) && c.board[sq(k.centreSquare)] === K && e.board[sq(k.cornerSquare)] === K, "kp differs only by the king " + k.id);
  ok(c.blackToMove === e.blackToMove, "kp same side to move " + k.id);
  const side = (p: any, v: number) => ((k.walkingKing === "black") !== p.blackToMove ? 0 - v : v);
  ok(side(c, evaluate(c)) - side(e, evaluate(e)) === k.mainCentreMinusCorner, "kp main reading " + k.id);
}
ok(F.TAPER_KP_ENDINGS.length === 6, "6 graded endings");
for (const p of F.TAPER_PASSER_PAIRS) {
  const a = parseFen(p.withPasserFen), b = parseFen(p.withoutPasserFen);
  const d = diff(a, b); ok(d.length === 1 && d[0] === sq(p.square), "pair differs by the passer only " + p.id);
  ok(phase(a) === p.rawPhase && phase(b) === p.rawPhase, "pair phase " + p.id);
  ok(isPassedPawn(a.board, sq(p.square)), "passed " + p.id);
  ok(a.board[sq("a8")] === 6 && a.board[sq("h1")] === 14, "kings a8/h1 " + p.id);
  const own = p.passer === "white" ? (sq(p.square) >> 4) + 1 : 8 - (sq(p.square) >> 4); ok(own === p.ownRank, "ownRank " + p.id);
  ok([0, 5, 10, 20, 35, 60, 100, 0][p.ownRank - 1] === p.baseBonus, "baseBonus " + p.id);
}
ok(F.TAPER_PASSER_PAIRS.length === 36, "36 pairs");
for (const r of F.TAPER_DOOR_CORPUS) ok(Object.is(evaluate(parseFen(r.fen)), r.main), "door " + r.fen);
const g3 = buildCorpus(); ok(g3.length === 184 && F.G3_CORPUS_MAIN_EVALUATE.length === 184, "g3 184");
g3.forEach((c: any, i: number) => ok(Object.is(evaluate(c.position), F.G3_CORPUS_MAIN_EVALUATE[i]), "g3 " + i));
console.log(`verify: ${fails} failures; mirror ${M.length}, kp ${F.TAPER_KP_ENDINGS.length}+${F.TAPER_KP_SHELTER_STRESS.length}, pairs ${F.TAPER_PASSER_PAIRS.length}, door ${F.TAPER_DOOR_CORPUS.length}, g3 ${F.G3_CORPUS_MAIN_EVALUATE.length}`);
process.exit(fails ? 1 : 0);
