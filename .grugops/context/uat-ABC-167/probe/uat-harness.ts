// UAT ABC-167: a throwaway acceptance harness for the capability-free UCI session. It is an
// authoring aid, not a committed spec. This repository has no browser e2e lane and ABC-167 has no
// process yet (the `skytalix` binary and stdin/stdout are ABC-168's), so there is no
// uat/*.uat.spec.ts.
//
// Usage:  node uat-harness.ts <tree root>
//   <tree root>  a checkout of grugops/ABC-167 @ 660a0d50 (the session under acceptance), or a
//                scratch copy of it with one deliberate fault (the negative controls)
//
// What it exercises: the PUBLIC API of src/uci-session.ts only (createUciSession, handleLine,
// write). Each scenario is a UCI dialogue: the lines a GUI would send, and the lines the engine
// writes back. The oracle for "is this move legal" is the tree's own perft-proven move generator
// (legal.ts, apply.ts, fen.ts), which ABC-167 does not edit. The oracle for the D4 budget is
// written here from ADR-0044 D4's text, not from the module.
//
// Every session runs on a VIRTUAL clock (ADR-0027, src/virtual-clock.ts). A virtual millisecond
// is not a real one: the `time` an `info` line reports here is a node-count figure. This harness
// takes NO wall-clock reading and prints no real time (N8-LANE stays OWED, R-167-2).
//
// It writes nothing. It prints PASS/FAIL lines, then one summary line per scenario.
// Scenarios, fixtures, clocks and steps were fixed before the first run (see the UAT pack note).
import { pathToFileURL } from "node:url";

const [ROOT] = process.argv.slice(2);
if (!ROOT) throw new Error("usage: uat-harness.ts <tree root>");
const at = (rel: string) => pathToFileURL(`${ROOT}/${rel}`).href;

// biome-ignore lint/suspicious/noExplicitAny: harness
type Any = any;
const { createUciSession }: Any = await import(at("src/uci-session.ts"));
const { parseFen }: Any = await import(at("src/fen.ts"));
const { legalMoves, isInCheck }: Any = await import(at("src/legal.ts"));
const { makeMove }: Any = await import(at("src/apply.ts"));
const { parseCoordinateMove }: Any = await import(at("src/coordinate-move.ts"));
const { squareName }: Any = await import(at("src/position.ts"));
const { virtualClock }: Any = await import(at("src/virtual-clock.ts"));

// --- fixtures (fixed before the first run) ------------------------------------------------------
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const AFTER_E4 = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1";
const KIWIPETE = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const SMOTHERED = "5r1k/6pp/7N/3Q4/8/8/8/6K1 w - - 0 1"; // puzzle-corpus.ts:128, mate in 2, d5g8
const MATED_NEXT = "7k/8/6K1/8/8/8/8/R7 b - - 1 1"; // the page's A8 FEN; only move h8g8
const STALEMATE = "7k/5Q2/6K1/8/8/8/8/8 b - - 0 1"; // the page's A4 FEN
const MATE_IN_1 = "6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1"; // back rank, Ra8# (RUN-0 used kq-corner,
// k7/8/1K6/8/8/8/8/1Q6 w, wrongly taken for a mate in 1: the king on b6 blocks the b-file)
const PROMOTE = "8/P6k/8/8/8/8/8/K7 w - - 0 1"; // a pawn one step from promotion
const CAP = 3000; // LEVELS[DEFAULT_LEVEL].budgetMs, ADR-0044 D4.2
const CEILING = 5000; // HARD_CEILING_MS, ADR-0044 D4.1
const ESC = "\x1b";

// --- the check ledger ---------------------------------------------------------------------------
const tally = new Map<string, { pass: number; fail: number }>();
let scenario = "";
function begin(id: string, title: string) {
  scenario = id;
  tally.set(id, { pass: 0, fail: 0 });
  console.log(`\n== ${id}: ${title}`);
}
function check(label: string, ok: boolean, detail = "") {
  const t = tally.get(scenario) as { pass: number; fail: number };
  if (ok) t.pass++;
  else t.fail++;
  console.log(`${ok ? "PASS" : "FAIL"} ${scenario} ${label}${detail ? ` | ${detail}` : ""}`);
}
function obs(text: string) {
  console.log(`OBS  ${scenario} ${text}`);
}

// --- the GUI side -------------------------------------------------------------------------------
const PROMO: Record<number, string> = { 5: "q", 4: "r", 3: "b", 2: "n" };
const coord = (m: Any) => `${squareName(m.from)}${squareName(m.to)}${PROMO[m.promotion] ?? ""}`;

/** The GUI's own copy of the position: FEN plus moves, through the perft-proven generator. */
function guiPosition(fen: string, moves: readonly string[] = []): Any {
  const p = parseFen(fen);
  for (const text of moves) {
    const parsed = parseCoordinateMove(p, text);
    if (parsed.outcome !== "move") throw new Error(`fixture move ${text} is not legal`);
    makeMove(p, parsed.move);
  }
  return p;
}
const legalSet = (p: Any) => new Set<string>(legalMoves(p).map(coord));

const everyLine: string[] = [];
let goCount = 0;
let bestmoveCount = 0;
let enginePlies = 0;
let nodesTotal = 0;

interface Turn {
  readonly result: string | undefined;
  readonly lines: string[];
  readonly threw: string | null;
}
/** One engine as a GUI sees it: send a line, get the lines it wrote back. */
function engine(step: number) {
  const out: string[] = [];
  const s = createUciSession({ write: (line: string) => out.push(line), now: virtualClock(step) });
  return {
    step,
    out,
    send(line: string): Turn {
      const before = out.length;
      let result: string | undefined;
      let threw: string | null = null;
      try {
        result = s.handleLine(line);
      } catch (error) {
        threw = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      }
      const lines = out.slice(before);
      everyLine.push(...lines);
      if (line.trim().split(/\s+/)[0] === "go") goCount++;
      for (const l of lines) if (l.startsWith("bestmove ")) bestmoveCount++;
      for (const l of lines) {
        const i = parseInfo(l);
        if (i) nodesTotal += i.nodes;
      }
      return { result, lines, threw };
    },
  };
}

const INFO =
  /^info depth (\d+) score (cp -?\d+|mate -?\d+) nodes (\d+) time (\d+) nps (\d+) pv ([a-h][1-8][a-h][1-8][qrbn]?)$/;
function parseInfo(line: string | undefined) {
  const m = INFO.exec(line ?? "");
  if (!m) return null;
  return {
    depth: Number(m[1]),
    score: m[2] as string,
    nodes: Number(m[3]),
    time: Number(m[4]),
    nps: Number(m[5]),
    pv: m[6] as string,
  };
}
const isInfoString = (l: string | undefined) => (l ?? "").startsWith("info string ");
const printable = (l: string) => [...l].every((c) => (c.codePointAt(0) as number) >= 0x20 && c !== "\x7f");

/** ADR-0044 D4, from the ADR's text: the budget G, then the level cap. */
function d4(t: Record<string, number>, black: boolean): number {
  let g: number;
  const clock = black ? t.btime : t.wtime;
  if (t.movetime !== undefined) g = t.movetime;
  else if (clock !== undefined) {
    const inc = (black ? t.binc : t.winc) ?? 0;
    g = Math.max(1, Math.min(clock / (t.movestogo ?? 20) + inc / 2, clock - 50));
  } else g = CEILING;
  return Math.min(g, CAP);
}

/**
 * The shape every searched `go` must have: exactly an `info` line then `bestmove`, the two moves
 * equal, the move legal in the GUI's position, the D3 nps rule, and the 3 000 ms cap (NFR-004).
 */
function searched(label: string, turn: Turn, p: Any, step: number) {
  check(`${label}: no exception`, turn.threw === null, turn.threw ?? "");
  check(`${label}: exactly 2 lines`, turn.lines.length === 2, JSON.stringify(turn.lines));
  const info = parseInfo(turn.lines[0]);
  check(`${label}: line 1 is the D3 info line`, info !== null, turn.lines[0] ?? "");
  const best = /^bestmove (\S+)$/.exec(turn.lines[1] ?? "")?.[1];
  check(`${label}: line 2 is bestmove`, best !== undefined, turn.lines[1] ?? "");
  if (!info || !best) return { info, best };
  check(`${label}: pv = bestmove`, info.pv === best, `${info.pv} vs ${best}`);
  check(`${label}: bestmove legal in the GUI's position`, legalSet(p).has(best), best);
  check(
    `${label}: nps = round(nodes*1000/max(1,time))`,
    info.nps === Math.round((info.nodes * 1000) / Math.max(1, info.time)),
  );
  check(`${label}: time within the 3 000 ms cap (+2 steps)`, info.time <= CAP + 2 * step, `time ${info.time}`);
  enginePlies++;
  return { info, best };
}
function inWindow(label: string, time: number | undefined, g: number, step: number) {
  check(
    `${label}: time in [G, G+2*step] = [${g}, ${g + 2 * step}]`,
    time !== undefined && time >= g && time <= g + 2 * step,
    `time ${time}`,
  );
}
function only(label: string, turn: Turn, expected: readonly string[]) {
  check(`${label}: no exception`, turn.threw === null, turn.threw ?? "");
  check(`${label}: writes exactly ${JSON.stringify(expected)}`, JSON.stringify(turn.lines) === JSON.stringify(expected), JSON.stringify(turn.lines));
}

// ================================================================================================
begin("S1", "the handshake a GUI opens with (A1, A2, A10)");
{
  const e = engine(10);
  const u = e.send("uci");
  only("uci", u, ["id name skytalix", "id author Olger Oeselg", "uciok"]);
  check("uci returns continue", u.result === "continue");
  only("isready", e.send("isready"), ["readyok"]);
  only("isready with a CRLF ending (a Windows GUI)", e.send("isready\r"), ["readyok"]);
  only("isready with surrounding spaces", e.send("  isready  "), ["readyok"]);
  only("ucinewgame", e.send("ucinewgame"), []);
  only("isready after ucinewgame", e.send("isready"), ["readyok"]);
  only("position startpos", e.send("position startpos"), []);
  searched("go movetime 100 after the handshake", e.send("go movetime 100"), guiPosition(START), 10);
  obs("uci writes no option lines: OwnBook and Skill Level are ABC-171's");
}

// ================================================================================================
/** A GUI plays two engines against each other on a clock, as cutechess-cli would. */
function game(tag: string, step: number, base: number, inc: number, maxPlies: number): string {
  const white = engine(step);
  const black = engine(step);
  for (const e of [white, black]) {
    only(`${tag} uci`, e.send("uci"), ["id name skytalix", "id author Olger Oeselg", "uciok"]);
    only(`${tag} isready`, e.send("isready"), ["readyok"]);
    only(`${tag} ucinewgame`, e.send("ucinewgame"), []);
    only(`${tag} isready (2)`, e.send("isready"), ["readyok"]);
  }
  const moves: string[] = [];
  let wtime = base;
  let btime = base;
  let flagged = false;
  let end = `stopped at ${maxPlies} plies`;
  let lowest = base;
  for (let ply = 0; ply < maxPlies; ply++) {
    const p = guiPosition(START, moves);
    const legal = legalSet(p);
    if (legal.size === 0) {
      end = isInCheck(p) ? `${p.blackToMove ? "black" : "white"} is checkmated` : "stalemate";
      break;
    }
    const e = p.blackToMove ? black : white;
    only(`${tag} ply ${ply + 1} position`, e.send(`position startpos${moves.length ? ` moves ${moves.join(" ")}` : ""}`), []);
    const goLine = `go wtime ${wtime} btime ${btime} winc ${inc} binc ${inc}`;
    const turn = e.send(goLine);
    const { info, best } = searched(`${tag} ply ${ply + 1}`, turn, p, step);
    const g = d4({ wtime, btime, winc: inc, binc: inc }, p.blackToMove);
    inWindow(`${tag} ply ${ply + 1} (${goLine})`, info?.time, g, step);
    if (!info || !best || !legal.has(best)) {
      end = `aborted: no legal answer at ply ${ply + 1}`;
      break;
    }
    if (p.blackToMove) btime = btime - info.time + inc;
    else wtime = wtime - info.time + inc;
    lowest = Math.min(lowest, wtime, btime);
    if (wtime <= 0 || btime <= 0) flagged = true;
    moves.push(best);
  }
  check(`${tag}: no side ran out of its (virtual) clock`, !flagged, `lowest remaining ${lowest}`);
  only(`${tag} quit (white)`, white.send("quit"), []);
  only(`${tag} quit (black)`, black.send("quit"), []);
  obs(`${tag}: ${moves.length} plies, ${end}; lowest remaining virtual clock ${lowest}`);
  obs(`${tag}: moves ${moves.join(" ")}`);
  return moves.join(" ");
}
begin("S2", "a GUI game from `position startpos moves ...` on a clock (A3, A5, A10, NFR-004)");
const gameA = game("3+2 on step 100", 100, 180000, 2000, 60);
const gameB = game("10+0.1 on step 10", 10, 10000, 100, 40);

// ================================================================================================
begin("S3", "FEN positions, and moves a GUI sends: castling, en passant, promotion (A3, A9)");
{
  const step = 10;
  const run = (label: string, setup: string, fen: string, moves: string[] = []) => {
    const e = engine(step);
    only(`${label} setup`, e.send(setup), []);
    return searched(label, e.send("go movetime 100"), guiPosition(fen, moves), step);
  };
  run("Kiwipete by FEN", `position fen ${KIWIPETE}`, KIWIPETE);
  const viaFen = run("black to move, by FEN", `position fen ${AFTER_E4}`, AFTER_E4);
  const viaMoves = run("black to move, by moves", "position startpos moves e2e4", START, ["e2e4"]);
  check(
    "the same position as FEN or as moves gets the same answer",
    viaFen.best !== undefined && viaFen.best === viaMoves.best && viaFen.info?.score === viaMoves.info?.score,
    `${viaFen.best} ${viaFen.info?.score} vs ${viaMoves.best} ${viaMoves.info?.score}`,
  );
  run("FEN plus moves with both castlings", `position fen ${KIWIPETE} moves e1g1 e8c8`, KIWIPETE, ["e1g1", "e8c8"]);
  run("en passant in the move list", "position startpos moves e2e4 a7a6 e4e5 d7d5 e5d6", START, ["e2e4", "a7a6", "e4e5", "d7d5", "e5d6"]);
  run("queen promotion in the move list", `position fen ${PROMOTE} moves a7a8q`, PROMOTE, ["a7a8q"]);
  run("knight underpromotion in the move list", `position fen ${PROMOTE} moves a7a8n`, PROMOTE, ["a7a8n"]);
  const promo = run("the engine to move with a promotion on", `position fen ${PROMOTE}`, PROMOTE);
  obs(`with a pawn on a7 the engine answers ${promo.best}`);
  const long = ["e2e4", "e7e5", "g1f3", "b8c6", "f1b5", "a7a6", "b5a4", "g8f6", "e1g1", "f8e7", "f1e1", "b7b5", "a4b3", "d7d6", "c2c3", "e8g8", "h2h3", "c6b8", "d2d4", "b8d7"];
  run("a 20-ply Ruy Lopez move list", `position startpos moves ${long.join(" ")}`, START, long);
}

// ================================================================================================
begin("S4", "go depth / nodes / mate, as a GUI's analysis sends them (A7, A8)");
{
  const s = guiPosition(START);
  const free = engine(10);
  free.send("position startpos");
  const unlimited = searched("go movetime 1000 (the unlimited comparator)", free.send("go movetime 1000"), s, 10);
  check("the comparator reaches depth >= 5, so a depth 4 cap binds", (unlimited.info?.depth ?? 0) >= 5, `depth ${unlimited.info?.depth}`);
  const run = (label: string, setup: string, line: string, p: Any, step: number) => {
    const e = engine(step);
    e.send(setup);
    return searched(label, e.send(line), p, step);
  };
  const d4r = run("go depth 4", "position startpos", "go depth 4", s, 10);
  check("go depth 4 reports depth 4", d4r.info?.depth === 4, `depth ${d4r.info?.depth}`);
  const d1 = run("go depth 1", "position startpos", "go depth 1", s, 10);
  check("go depth 1 reports depth 1", d1.info?.depth === 1, `depth ${d1.info?.depth}`);
  const n = run("go nodes 20000", "position startpos", "go nodes 20000", s, 1);
  check("go nodes 20000 stops at <= 21 024 nodes", (n.info?.nodes ?? Infinity) <= 21024, `nodes ${n.info?.nodes}`);
  const n1 = run("go nodes 1", "position startpos", "go nodes 1", s, 1);
  check("go nodes 1 still plays a depth-1 move", n1.info?.depth === 1, `depth ${n1.info?.depth}`);
  const m2 = run("go mate 2 on the smothered mate", `position fen ${SMOTHERED}`, "go mate 2", guiPosition(SMOTHERED), 10);
  check("go mate 2 reports score mate 2", m2.info?.score === "mate 2", m2.info?.score ?? "");
  check("go mate 2 plays d5g8", m2.best === "d5g8", m2.best ?? "");
  // Fixture self-check (added after RUN-0): the GUI's generator must find a mate in 1 here.
  const mating = legalMoves(guiPosition(MATE_IN_1))
    .map(coord)
    .filter((m: string) => {
      const after = guiPosition(MATE_IN_1, [m]);
      return legalSet(after).size === 0 && isInCheck(after);
    });
  check("fixture: MATE_IN_1 has a mate in 1", mating.length > 0, mating.join(","));
  const m1 = run("go mate 1 on the back rank", `position fen ${MATE_IN_1}`, "go mate 1", guiPosition(MATE_IN_1), 10);
  check("go mate 1 reports score mate 1", m1.info?.score === "mate 1", m1.info?.score ?? "");
  if (m1.best) {
    const after = guiPosition(MATE_IN_1, [m1.best]);
    check("go mate 1's move mates", legalSet(after).size === 0 && isInCheck(after), m1.best);
  }
  const dm = run("go depth 3 mate 5", "position startpos", "go depth 3 mate 5", s, 10);
  check("go depth 3 mate 5 reports depth 3 (the smaller wins)", dm.info?.depth === 3, `depth ${dm.info?.depth}`);
  const md = run("go depth 1 mate 2 on the smothered mate", `position fen ${SMOTHERED}`, "go depth 1 mate 2", guiPosition(SMOTHERED), 10);
  check("go depth 1 mate 2 reports depth 1", md.info?.depth === 1, `depth ${md.info?.depth}`);
  const kd = run("go depth 5 on Kiwipete", `position fen ${KIWIPETE}`, "go depth 5", guiPosition(KIWIPETE), 100);
  check("go depth 5 on Kiwipete reports depth <= 5", (kd.info?.depth ?? 99) <= 5, `depth ${kd.info?.depth}`);
}

// ================================================================================================
begin("S5", "the time controls a GUI sends, all under the 3 s cap (A5, NFR-004)");
{
  const rows: ReadonlyArray<[string, string, boolean, Record<string, number>, number]> = [
    ["fixed 2 s per move", "go movetime 2000", false, { movetime: 2000 }, 100],
    ["fixed 10 s per move (capped)", "go movetime 10000", false, { movetime: 10000 }, 100],
    ["Lichess 3+2, white", "go wtime 180000 btime 180000 winc 2000 binc 2000", false, { wtime: 180000, btime: 180000, winc: 2000, binc: 2000 }, 100],
    ["bullet 1+0, white", "go wtime 60000 btime 60000", false, { wtime: 60000, btime: 60000 }, 100],
    ["classical 40 moves in 90 min", "go wtime 5400000 btime 5400000 movestogo 40", false, { wtime: 5400000, btime: 5400000, movestogo: 40 }, 100],
    ["white low on time (1.5 s)", "go wtime 1500 btime 60000", false, { wtime: 1500, btime: 60000 }, 10],
    ["black low on time (1.5 s), white's clock ignored", "go wtime 60000 btime 1500", true, { wtime: 60000, btime: 1500 }, 10],
    ["increment-heavy, white", "go wtime 2000 btime 2000 winc 1000 binc 1000", false, { wtime: 2000, btime: 2000, winc: 1000, binc: 1000 }, 10],
    ["black takes binc, not winc", "go wtime 2000 btime 2000 winc 1000 binc 0", true, { wtime: 2000, btime: 2000, winc: 1000, binc: 0 }, 10],
    ["two moves to the control", "go wtime 3000 btime 3000 movestogo 2", false, { wtime: 3000, btime: 3000, movestogo: 2 }, 100],
    ["one move to the control (overhead binds)", "go wtime 1000 btime 1000 movestogo 1", false, { wtime: 1000, btime: 1000, movestogo: 1 }, 10],
    ["a fractional clock", "go wtime 1999.5 btime 1999.5", false, { wtime: 1999.5, btime: 1999.5 }, 10],
    ["40 ms left (the 1 ms floor)", "go wtime 40 btime 40", false, { wtime: 40, btime: 40 }, 1],
    ["0 ms left", "go wtime 0 btime 0", false, { wtime: 0, btime: 0 }, 1],
    ["movetime beside a clock", "go wtime 1000 btime 1000 movetime 300", false, { wtime: 1000, btime: 1000, movetime: 300 }, 100],
    ["increments with no clock (bare-go budget)", "go winc 1000 binc 1000", false, { winc: 1000, binc: 1000 }, 100],
    ["an absurd clock", "go wtime 99999999999 btime 99999999999", false, { wtime: 99999999999, btime: 99999999999 }, 100],
  ];
  for (const [label, line, black, tokens, step] of rows) {
    const e = engine(step);
    const fen = black ? AFTER_E4 : START;
    e.send(black ? "position startpos moves e2e4" : "position startpos");
    const { info } = searched(label, e.send(line), guiPosition(fen), step);
    inWindow(label, info?.time, d4(tokens, black), step);
  }
}

// ================================================================================================
begin("S6", "go infinite + stop, and go ponder + ponderhit (A6, A6-d1, A6-e5)");
{
  const step = 100;
  const p = guiPosition(START, ["e2e4"]);
  const e = engine(step);
  e.send("position startpos moves e2e4");
  const g = e.send("go infinite");
  check("go infinite: no exception", g.threw === null);
  check("go infinite writes the info line and no bestmove", g.lines.length === 1 && parseInfo(g.lines[0]) !== null, JSON.stringify(g.lines));
  const info = parseInfo(g.lines[0]);
  inWindow("go infinite", info?.time, CAP, step);
  only("isready while the answer is held", e.send("isready"), ["readyok"]);
  only("an unknown line while held", e.send("foo"), []);
  const s1 = e.send("stop");
  check("stop writes exactly one bestmove = pv", s1.lines.length === 1 && s1.lines[0] === `bestmove ${info?.pv}`, JSON.stringify(s1.lines));
  check("that move is legal", legalSet(p).has(info?.pv ?? ""));
  only("a second stop", e.send("stop"), []);
  searched("a normal go after stop", e.send("go movetime 100"), p, step);

  const q = engine(step);
  q.send("position startpos");
  const pg = q.send("go ponder");
  check("go ponder writes the info line and no bestmove", pg.lines.length === 1 && parseInfo(pg.lines[0]) !== null, JSON.stringify(pg.lines));
  const pinfo = parseInfo(pg.lines[0]);
  inWindow("go ponder", pinfo?.time, CAP, step);
  only("ponderhit", q.send("ponderhit"), [`bestmove ${pinfo?.pv}`]);
  only("a second ponderhit", q.send("ponderhit"), []);

  const r = engine(step);
  r.send("position startpos moves e2e4 e7e5");
  const rg = r.send("go ponder wtime 60000 btime 60000 winc 1000 binc 1000");
  check("go ponder with clocks holds too", rg.lines.length === 1 && parseInfo(rg.lines[0]) !== null, JSON.stringify(rg.lines));
  const rinfo = parseInfo(rg.lines[0]);
  only("ponderhit releases it", r.send("ponderhit"), [`bestmove ${rinfo?.pv}`]);

  const a = engine(step);
  a.send(`position fen ${KIWIPETE}`);
  const ag = a.send("go infinite");
  const ainfo = parseInfo(ag.lines[0]);
  only("analysis: stop on Kiwipete", a.send("stop"), [`bestmove ${ainfo?.pv}`]);
  check("analysis: Kiwipete's held move is legal", legalSet(guiPosition(KIWIPETE)).has(ainfo?.pv ?? ""));
  a.send(`position fen ${SMOTHERED}`);
  const bg = a.send("go infinite");
  const binfo = parseInfo(bg.lines[0]);
  only("analysis: stop on the next position", a.send("stop"), [`bestmove ${binfo?.pv}`]);

  const d = engine(10);
  d.send("position startpos");
  const dg = d.send("go depth 3 infinite");
  check("go depth 3 infinite: depth 3 and held", dg.lines.length === 1 && parseInfo(dg.lines[0])?.depth === 3, JSON.stringify(dg.lines));
  only("stop releases it", d.send("stop"), [`bestmove ${parseInfo(dg.lines[0])?.pv}`]);
}

// ================================================================================================
begin("S7", "a held bestmove is released by position / ucinewgame / quit / go (A6-e1..e4, QE-167-j)");
{
  const step = 100;
  const held = (fen: string) => {
    const e = engine(step);
    e.send(`position fen ${fen}`);
    const g = e.send("go infinite");
    check("held: info line only", g.lines.length === 1, JSON.stringify(g.lines));
    return e;
  };
  {
    const e = held(MATED_NEXT);
    only("position startpos while held", e.send("position startpos"), ["bestmove h8g8"]);
    only("then stop", e.send("stop"), []);
    searched("then go movetime 100 is legal from the start", e.send("go movetime 100"), guiPosition(START), step);
  }
  {
    const e = held(MATED_NEXT);
    only("ucinewgame while held", e.send("ucinewgame"), ["bestmove h8g8"]);
    only("then stop", e.send("stop"), []);
    searched("then go movetime 100 is legal from the start", e.send("go movetime 100"), guiPosition(START), step);
  }
  {
    const e = held(MATED_NEXT);
    const t = e.send("quit");
    check("quit while held returns quit", t.result === "quit", String(t.result));
    only("quit while held", t, ["bestmove h8g8"]);
  }
  {
    const e = held(MATED_NEXT);
    const t = e.send("go movetime 100");
    check("a new go while held: 3 lines", t.lines.length === 3, JSON.stringify(t.lines));
    check("a new go while held: the held bestmove first", t.lines[0] === "bestmove h8g8", t.lines[0] ?? "");
    check("then the new info line", parseInfo(t.lines[1]) !== null, t.lines[1] ?? "");
    check("then the new bestmove, legal", legalSet(guiPosition(MATED_NEXT)).has(/^bestmove (\S+)$/.exec(t.lines[2] ?? "")?.[1] ?? ""), t.lines[2] ?? "");
    only("then stop", e.send("stop"), []);
  }
  {
    const e = held(MATED_NEXT);
    const t = e.send("position fen 8/8/8 w - - 0 1");
    check("a refused position while held: bestmove first, then one info string", t.lines.length === 2 && t.lines[0] === "bestmove h8g8" && isInfoString(t.lines[1]), JSON.stringify(t.lines));
  }
  {
    const e = held(MATED_NEXT);
    only("setoption while held", e.send("setoption name Hash value 64"), []);
    only("isready while held", e.send("isready"), ["readyok"]);
    only("then stop", e.send("stop"), ["bestmove h8g8"]);
  }
}

// ================================================================================================
begin("S8", "bad input never crashes and always answers (A4, A4-a1, A4-a2, A7 value rules, A9, A11)");
{
  const step = 100;
  /** After any line, the engine must still answer isready and give one bestmove per go. */
  const stillAnswers = (label: string, e: ReturnType<typeof engine>, positionHeld: Any | null) => {
    only(`${label} -> isready`, e.send("isready"), ["readyok"]);
    const t = e.send("go movetime 50");
    if (positionHeld === null) only(`${label} -> go answers 0000`, t, ["bestmove 0000"]);
    else searched(`${label} -> go`, t, positionHeld, step);
  };
  const ignored = [
    "setoption name Hash value 64",
    "setoption name OwnBook value false",
    "debug on",
    "register later",
    "foo",
    "",
    "   ",
    "\t",
    "UCI",
    "ISREADY",
    "\x00",
    "\x07uci",
    `foo${ESC}[31m`,
    "uci2",
    "x".repeat(10000),
    `${"foo ".repeat(2500)}`,
    "♔♚",
    "stop",
    "ponderhit",
  ];
  for (const line of ignored) {
    const label = `ignored ${JSON.stringify(line.length > 24 ? `${line.slice(0, 12)}...(${line.length})` : line)}`;
    const e = engine(step);
    e.send("position startpos");
    only(label, e.send(line), []);
    stillAnswers(label, e, guiPosition(START));
  }
  const refused: ReadonlyArray<[string, string | null]> = [
    ["position fen 8/8/8 w - - 0 1", null],
    ["position startpos moves e2e5", "e2e5"],
    [`position startpos moves e2e4${ESC}[31m`, "e2e4[31m"],
    ["position startpos moves a7a5", "a7a5"],
    ["position", null],
    ["position fen", null],
    ["position startpos e2e4", null],
    ["position fen ♔", null],
    [`position fen ${KIWIPETE} moves e1g1 e1g1`, null],
    ["position fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR x KQkq - 0 1", null],
    [`position fen ${"x".repeat(5000)}`, null],
  ];
  for (const [line, echo] of refused) {
    const label = `refused ${JSON.stringify(line.length > 40 ? `${line.slice(0, 20)}...(${line.length})` : line)}`;
    const e = engine(step);
    const t = e.send(line);
    check(`${label}: no exception`, t.threw === null, t.threw ?? "");
    check(`${label}: exactly one info string`, t.lines.length === 1 && isInfoString(t.lines[0]), JSON.stringify(t.lines).slice(0, 200));
    check(`${label}: printable`, t.lines.every(printable));
    if (echo !== null) check(`${label}: echoes the input, ESC removed`, (t.lines[0] ?? "").includes(echo), t.lines[0] ?? "");
    stillAnswers(label, e, null);
    only(`${label} -> position startpos recovers`, e.send("position startpos"), []);
    searched(`${label} -> go after recovery`, e.send("go movetime 50"), guiPosition(START), step);
  }
  // Promotion without a letter: UCI writes the letter, so either reading is acceptable; it must answer.
  {
    const e = engine(step);
    const t = e.send(`position fen ${PROMOTE} moves a7a8`);
    check("a7a8 without a promotion letter: no exception", t.threw === null, t.threw ?? "");
    check("a7a8 without a letter: nothing or one info string", t.lines.length === 0 || (t.lines.length === 1 && isInfoString(t.lines[0])), JSON.stringify(t.lines));
    obs(`a7a8 without a letter is ${t.lines.length === 0 ? "accepted" : `refused: ${t.lines[0]}`}`);
    const g = e.send("go movetime 50");
    check("a7a8 without a letter: the next go writes one bestmove", g.lines.filter((l) => l.startsWith("bestmove ")).length === 1, JSON.stringify(g.lines));
  }
  // Faulty go values: one info string, then a normal answer, with the D4 budget the rest implies.
  const faulty: ReadonlyArray<[string, number, Record<string, number>, number | undefined]> = [
    ["go depth", 1, {}, undefined],
    ["go depth x", 1, {}, undefined],
    ["go depth 0", 1, {}, undefined],
    ["go depth -1", 1, {}, undefined],
    ["go depth 2.5", 1, {}, undefined],
    ["go depth 99999999999999999999", 1, {}, undefined],
    [`go depth ${ESC}[31m`, 1, {}, undefined],
    ["go nodes x", 1, {}, undefined],
    ["go nodes 0", 1, {}, undefined],
    ["go mate 0", 1, {}, undefined],
    ["go mate -2", 1, {}, undefined],
    ["go movetime", 1, {}, undefined],
    ["go movetime abc", 1, {}, undefined],
    ["go movetime 1e2", 1, {}, undefined],
    ["go wtime", 1, {}, undefined],
    ["go wtime 1000 btime 1000 movestogo 0", 1, { wtime: 1000, btime: 1000 }, undefined],
    ["go wtime 1000 btime 1000 movestogo 2.5", 1, { wtime: 1000, btime: 1000 }, undefined],
    ["go depth movetime 100", 1, { movetime: 100 }, undefined],
    ["go movetime depth 3", 1, {}, 3],
    ["go searchmoves e2e4 d2d4", 1, {}, undefined],
    ["go searchmoves e2e4 d2d4 movetime 100", 1, { movetime: 100 }, undefined],
    ["go movetime -5", 0, { movetime: -5 }, undefined],
    ["go wtime -1000 btime -1000", 0, { wtime: -1000, btime: -1000 }, undefined],
    ["go foo bar movetime 100", 0, { movetime: 100 }, undefined],
    ["go movetime 100\r", 0, { movetime: 100 }, undefined],
    ["go\tmovetime\t100", 0, { movetime: 100 }, undefined],
    ["   go   movetime   100   ", 0, { movetime: 100 }, undefined],
  ];
  for (const [line, warnings, tokens, depth] of faulty) {
    const label = JSON.stringify(line);
    const e = engine(step);
    e.send("position startpos");
    const t = e.send(line);
    check(`${label}: no exception`, t.threw === null, t.threw ?? "");
    const strings = t.lines.filter(isInfoString);
    check(`${label}: ${warnings} info string line(s), first`, strings.length === warnings && t.lines.slice(0, warnings).every(isInfoString), JSON.stringify(t.lines));
    check(`${label}: printable`, t.lines.every(printable));
    const rest: Turn = { result: t.result, lines: t.lines.slice(warnings), threw: t.threw };
    const { info } = searched(label, rest, guiPosition(START), step);
    if (depth !== undefined) check(`${label}: depth ${depth}`, info?.depth === depth, `depth ${info?.depth}`);
    // A negative budget gives depth 1 at once, so only a floor is asserted for it.
    // A depth cap ends the search before the clock, so no time window is asserted for it.
    if ((tokens.movetime ?? 1) < 0 || (tokens.wtime ?? 1) < 0) check(`${label}: a depth-1 answer`, info?.depth === 1, `depth ${info?.depth}`);
    else if (depth === undefined) inWindow(label, info?.time, d4(tokens, false), step);
  }
}

// ================================================================================================
begin("S9", "mate and stalemate positions (A4, A8)");
{
  const step = 10;
  const terminal = (label: string, setup: string, p: Any, why: "mate" | "stalemate") => {
    check(`${label}: the GUI agrees it is ${why}`, legalSet(p).size === 0 && isInCheck(p) === (why === "mate"));
    const e = engine(step);
    only(`${label} setup`, e.send(setup), []);
    only(`${label}: go`, e.send("go movetime 100"), ["bestmove 0000"]);
    e.send(setup);
    only(`${label}: go infinite holds 0000`, e.send("go infinite"), []);
    only(`${label}: stop releases it`, e.send("stop"), ["bestmove 0000"]);
  };
  terminal("fool's mate, white mated", "position startpos moves f2f3 e7e5 g2g4 d8h4", guiPosition(START, ["f2f3", "e7e5", "g2g4", "d8h4"]), "mate");
  terminal("back-rank mate, black mated", `position fen ${MATED_NEXT} moves h8g8 a1a8`, guiPosition(MATED_NEXT, ["h8g8", "a1a8"]), "mate");
  terminal("the page's stalemate", `position fen ${STALEMATE}`, guiPosition(STALEMATE), "stalemate");
  {
    const e = engine(step);
    e.send(`position fen ${MATED_NEXT}`);
    const { info, best } = searched("being mated next move", e.send("go movetime 500"), guiPosition(MATED_NEXT), step);
    check("being mated: score mate -1", info?.score === "mate -1", info?.score ?? "");
    check("being mated: the only move h8g8", best === "h8g8", best ?? "");
  }
  {
    const e = engine(step);
    e.send(`position fen ${MATE_IN_1}`);
    const { info, best } = searched("mate in 1 for white", e.send("go movetime 100"), guiPosition(MATE_IN_1), step);
    check("mate in 1: score mate 1", info?.score === "mate 1", info?.score ?? "");
    if (best) {
      const after = guiPosition(MATE_IN_1, [best]);
      check("mate in 1: the move mates", legalSet(after).size === 0 && isInCheck(after), best);
    }
  }
}

// ================================================================================================
begin("S10", "quit (A10)");
{
  const e = engine(10);
  const t = e.send("quit");
  check("quit returns quit", t.result === "quit", String(t.result));
  only("quit with nothing held", t, []);
  const f = engine(10);
  f.send("uci");
  f.send("isready");
  f.send("position startpos moves e2e4");
  f.send("go movetime 100");
  const t2 = f.send("quit");
  check("quit after a finished go returns quit and writes nothing", t2.result === "quit" && t2.lines.length === 0, JSON.stringify(t2.lines));
  const results = ["uci", "isready", "ucinewgame", "position startpos", "go depth 1", "stop", "ponderhit", "setoption name x value y", "foo", ""].map((l) => engine(10).send(l).result);
  check("every other line returns continue", results.every((r) => r === "continue"), JSON.stringify(results));
}

// ================================================================================================
begin("S11", "ucinewgame and a new session start from the start position (A9, A9-h1)");
{
  const step = 10;
  const e = engine(step);
  e.send(`position fen ${KIWIPETE}`);
  only("ucinewgame", e.send("ucinewgame"), []);
  searched("go after ucinewgame is legal from the start", e.send("go movetime 100"), guiPosition(START), step);
  const n = engine(step);
  searched("a new session with no position line", n.send("go movetime 100"), guiPosition(START), step);
  const r = engine(step);
  r.send("position fen 8/8/8 w - - 0 1");
  only("ucinewgame after a refused position", r.send("ucinewgame"), []);
  searched("go after that is legal from the start", r.send("go movetime 100"), guiPosition(START), step);
}

// ================================================================================================
begin("S12", "the same dialogue gives the same answer; a search leaves the position alone");
{
  const step = 10;
  const e = engine(step);
  e.send(`position fen ${KIWIPETE}`);
  const a = e.send("go movetime 100");
  const b = e.send("go movetime 100");
  check("two gos on one held position write identical lines", JSON.stringify(a.lines) === JSON.stringify(b.lines), `${a.lines[1]} / ${b.lines[1]}`);
  const again = game("10+0.1 on step 10, replayed", 10, 10000, 100, 40);
  check("the S2 10+0.1 game replays move for move", again === gameB);
  check("the S2 3+2 game was not empty", gameA.split(" ").length >= 10);
}

// ================================================================================================
begin("S13", "every line written in every scenario (A11 M4, D3 'nothing else is ever written')");
{
  const allowed = /^(id |option |uciok$|readyok$|info |bestmove )/;
  const bad = everyLine.filter((l) => !allowed.test(l));
  check(`all ${everyLine.length} lines start with id/option/uciok/readyok/info/bestmove`, bad.length === 0, JSON.stringify(bad.slice(0, 3)));
  const unprintable = everyLine.filter((l) => !printable(l));
  check("all lines are printable (no C0, no DEL, so no embedded newline)", unprintable.length === 0, JSON.stringify(unprintable.slice(0, 3)));
  check(`one bestmove per go across the run (${goCount} go, ${bestmoveCount} bestmove)`, goCount === bestmoveCount);
}

// --- summary ------------------------------------------------------------------------------------
console.log("\n== summary");
let pass = 0;
let fail = 0;
for (const [id, t] of tally) {
  pass += t.pass;
  fail += t.fail;
  console.log(`${t.fail === 0 ? "PASS" : "FAIL"} ${id} ${t.pass}/${t.pass + t.fail}`);
}
console.log(`TOTAL ${pass}/${pass + fail} checks; ${[...tally.values()].filter((t) => t.fail === 0).length}/${tally.size} scenarios PASS`);
console.log(`engine work: ${enginePlies} searched answers, ${nodesTotal} nodes reported, ${goCount} go lines; 0 child processes; no wall-clock reading`);
