// QE probe for ABC-102 (`undo`) — NOT part of the test lane (`.grugops/**` is excluded from vitest,
// biome and tsc). Run from the worktree root: `node .grugops/context/qe-ABC-102/probes/loop-probe.ts`.
//
// Drives the MERGED loop (`runTurnLoop`) with the DELIVERED reader (`createLineInputSeam` over a
// stream, so the real `createPromptLineResolver` and the real line terminators are in play), the
// DELIVERED render seam (`makeRenderSeam`) and — where the scenario does not need a fixed reply —
// the DELIVERED engine (`createEngine`) at a short budget. A snapshot is taken at every prompt:
// the FEN, the move list, the key list, the repetition counts, and the status / messages / rows of
// the frame the player is looking at. Every snapshot is checked against a FRESH replay of its move
// list from the initial FEN, entry for entry.

import assert from "node:assert/strict";
import { PassThrough } from "node:stream";
import { classifyCommand, helpMessages, resolvePromptLine } from "../../../../src/command-input.ts";
import { parseCoordinateMove } from "../../../../src/coordinate-move.ts";
import { createEngine } from "../../../../src/engine.ts";
import { toFen } from "../../../../src/fen.ts";
import { MESSAGE_ROWS, PROMPT_ROWS } from "../../../../src/frame.ts";
import type { GameStatus } from "../../../../src/gameend.ts";
import {
  type GameHistory,
  gameStatusOf,
  keyHistory,
  newGame,
  playMove,
  repetitionCounts,
} from "../../../../src/history.ts";
import { createLineInputSeam } from "../../../../src/line-input.ts";
import { legalMoves } from "../../../../src/legal.ts";
import { resolveMoveInput } from "../../../../src/move-input.ts";
import type { Move } from "../../../../src/moves.ts";
import type { GlyphMode, Orientation } from "../../../../src/render.ts";
import { makeRenderSeam } from "../../../../src/render-seam.ts";
import { toSan } from "../../../../src/san.ts";
import type { EngineSeam, LoopOutcome } from "../../../../src/turn-loop.ts";
import { runTurnLoop } from "../../../../src/turn-loop.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const SHUFFLE_FEN = "6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 0 1";
const SHUFFLE_CYCLE = ["g1h1", "a5b6", "h1g1", "b6a5"];

let checks = 0;
let failures = 0;
const log: string[] = [];
function check(name: string, fn: () => void): void {
  checks++;
  try {
    fn();
    log.push(`ok   ${name}`);
  } catch (error) {
    failures++;
    log.push(`FAIL ${name}\n     ${String((error as Error).message).split("\n").join("\n     ")}`);
  }
}

function played(fen: string, lines: readonly string[]): GameHistory {
  const history = newGame(fen);
  for (const line of lines) {
    const parsed = parseCoordinateMove(history.position, line);
    assert.equal(parsed.outcome, "move", `fixture move ${line}`);
    playMove(history, (parsed as { move: Move }).move);
  }
  return history;
}

function scripted(replies: readonly string[]): EngineSeam {
  let next = 0;
  return async (history) => {
    const parsed = parseCoordinateMove(history.position, replies[next++] as string);
    assert.equal(parsed.outcome, "move", "scripted reply");
    return (parsed as { move: Move }).move;
  };
}

interface Snapshot {
  readonly line: string | null; // the line about to be submitted at this prompt
  readonly plies: number;
  readonly fen: string;
  readonly moves: readonly Move[];
  readonly status: GameStatus;
  readonly messages: readonly string[];
  readonly rows: readonly string[];
}

interface Session {
  readonly prompts: Snapshot[];
  readonly outcome: LoopOutcome;
  readonly sinkText: string;
  readonly engineCalls: number;
}

/** A replay of `moves` from `fen` must match `history` in every derived field. */
function assertMatchesFreshReplay(history: GameHistory, initialFen: string, status: GameStatus): void {
  const fresh = newGame(initialFen);
  for (const move of history.moves) playMove(fresh, move);
  assert.equal(toFen(history.position), toFen(fresh.position), "FEN vs fresh replay");
  assert.deepEqual(keyHistory(history), keyHistory(fresh), "key list vs fresh replay");
  assert.equal(keyHistory(history).length, history.moves.length + 1, "keys = plies + 1");
  assert.deepEqual(
    [...repetitionCounts(history).entries()],
    [...repetitionCounts(fresh).entries()],
    "repetition counts vs fresh replay, entry for entry",
  );
  assert.deepEqual(status, gameStatusOf(fresh), "frame status vs fresh replay's status");
}

async function session(options: {
  history: GameHistory;
  initialFen: string;
  humanColour: "white" | "black";
  engine: EngineSeam;
  lines: readonly string[]; // each WITHOUT terminator unless it carries its own (`raw:` prefix)
  mode?: GlyphMode;
  orientation?: Orientation;
}): Promise<Session> {
  const { history } = options;
  const source = new PassThrough();
  let promptText = "";
  const real = createLineInputSeam({ source, output: { write: (t) => void (promptText += t) } });
  const render = makeRenderSeam(options.mode ?? "unicode", options.orientation ?? "white-bottom");
  let lastFrame: { status: GameStatus; messages: readonly string[]; rows: readonly string[] } | undefined;
  const prompts: Snapshot[] = [];
  let next = 0;
  let engineCalls = 0;
  let sinkText = "";
  const outcome = await runTurnLoop({
    history,
    humanColour: options.humanColour,
    render: (h, status, thinking, messages) => {
      const rows = render(h, status, thinking, messages);
      lastFrame = { status, messages: [...messages], rows };
      return rows;
    },
    input: async (h) => {
      const line = options.lines[next++];
      assert.ok(lastFrame !== undefined);
      prompts.push({
        line: line ?? null,
        plies: h.moves.length,
        fen: toFen(h.position),
        moves: [...h.moves],
        status: lastFrame.status,
        messages: lastFrame.messages,
        rows: lastFrame.rows,
      });
      assertMatchesFreshReplay(h, options.initialFen, lastFrame.status);
      if (line === undefined) source.end();
      else if (line.startsWith("raw:")) source.write(line.slice(4));
      else source.write(`${line}\n`);
      return real(h);
    },
    engine: async (h) => {
      engineCalls++;
      return options.engine(h);
    },
    sink: { write: (text) => void (sinkText += text) },
  });
  return { prompts, outcome, sinkText, engineCalls };
}

const realEngine = createEngine({ budgetMs: 120 });

/** The message region of a frame: the MESSAGE_ROWS rows above the reserved prompt row. */
function regionOf(rows: readonly string[]): string[] {
  return rows.slice(rows.length - PROMPT_ROWS - MESSAGE_ROWS, rows.length - PROMPT_ROWS);
}

function assertUndone(prompts: Snapshot[], at: number): void {
  // prompts[at] submitted `undo` and it took effect; prompts[at + 1] is the state after it.
  const before = prompts[at] as Snapshot;
  const after = prompts[at + 1] as Snapshot;
  assert.equal(after.plies, before.plies - 2, "exactly two plies gone");
  assert.deepEqual(after.moves, before.moves.slice(0, -2), "the LAST two plies, not two others");
  // The FEN captured at the prompt where the human made the move now taken back:
  const where = prompts.findLastIndex(
    (p, i) => i < at && p.plies === after.plies && p.moves.every((m, k) => m === after.moves[k]),
  );
  if (where >= 0) assert.equal(after.fen, (prompts[where] as Snapshot).fen, "byte-identical FEN");
  assert.deepEqual(after.messages, [], "ruling 7: a successful undo says nothing");
  assert.equal(after.status.result, "in-progress");
}

function assertRefused(prompts: Snapshot[], at: number): void {
  const before = prompts[at] as Snapshot;
  const after = prompts[at + 1] as Snapshot;
  assert.equal(after.plies, before.plies, "move list unchanged");
  assert.equal(after.fen, before.fen, "FEN byte-identical");
  assert.deepEqual(after.moves, before.moves);
  assert.deepEqual(after.messages, ["nothing to undo"], "the ruling-3 refusal, one item");
  assert.ok(regionOf(after.rows).join(" ").includes("nothing to undo"), "refusal visible in the frame");
  assert.ok(!regionOf(after.rows).join(" ").includes("(+"), "refusal not hidden");
}

function assertHelpFits(snapshot: Snapshot, label: string): void {
  const region = regionOf(snapshot.rows);
  assert.deepEqual(snapshot.messages, helpMessages(), `${label}: help messages on the frame`);
  assert.ok(!region.join("\n").includes("(+"), `${label}: hidden count 0 — got ${JSON.stringify(region)}`);
  for (const token of helpMessages()) assert.ok(region.join(" ").includes(token), `${label}: ${token} shown`);
}

const summary: Record<string, unknown> = {};

// ---------------------------------------------------------------------------------------------
// S1 — human White, the REAL engine: 0-ply refusal, help at the start, undo after an engine reply,
// undo repeated to the floor, help mid-game.
// ---------------------------------------------------------------------------------------------
{
  const lines = [
    "undo", // 0: ply 0 → refused
    "help", // 1: ply 0, start position (refusal frame showing)
    "g1f3", // 2: ply 0 → engine replies → ply 2
    "undo", // 3: ply 2 → 0 (after an engine reply)
    "undo", // 4: ply 0 → refused
    "g1f3", // 5
    "b1c3", // 6
    "g2g3", // 7
    "help", // 8: ply 6, mid-game
    "undo", // 9: 6 → 4
    "undo", // 10: 4 → 2
    "undo", // 11: 2 → 0
    "undo", // 12: refused at the floor
  ];
  const s = await session({
    history: newGame(START_FEN),
    initialFen: START_FEN,
    humanColour: "white",
    engine: realEngine,
    lines,
  });
  const p = s.prompts;
  summary.S1 = { plies: p.map((x) => x.plies), engineCalls: s.engineCalls, outcome: s.outcome };
  check("S1 shape: plies at each prompt", () =>
    assert.deepEqual(p.map((x) => x.plies), [0, 0, 0, 2, 0, 0, 2, 4, 6, 6, 4, 2, 0, 0]),
  );
  check("S1 0-ply undo refused, nothing changed, next frame carries the refusal", () => assertRefused(p, 0));
  check("S1 help at the start position (real frame, unicode, white-bottom): hidden 0", () =>
    assertHelpFits(p[2] as Snapshot, "start"),
  );
  check("S1 undo after a REAL engine reply: 2 → 0, FEN = start, counts = fresh", () => {
    assertUndone(p, 3);
    assert.equal((p[4] as Snapshot).fen, START_FEN);
  });
  check("S1 undo at 0 after a successful undo: refused", () => assertRefused(p, 4));
  check("S1 help mid-game at ply 6 (real frame): hidden 0", () => assertHelpFits(p[9] as Snapshot, "mid"));
  check("S1 undo ×3 from ply 6: each exactly two plies, lands on START_FEN", () => {
    assertUndone(p, 9);
    assertUndone(p, 10);
    assertUndone(p, 11);
    assert.equal((p[12] as Snapshot).fen, START_FEN);
    assert.equal((p[12] as Snapshot).moves.length, 0);
  });
  check("S1 fourth undo at the floor: refused", () => assertRefused(p, 12));
  check("S1 the engine was asked exactly 4 times (one per human move, none per undo)", () =>
    assert.equal(s.engineCalls, 4),
  );
  check("S1 ended on EOF, no result", () => assert.deepEqual(s.outcome, { result: null, reason: null, exitCode: 0 }));
}

// ---------------------------------------------------------------------------------------------
// S2 — human Black, the REAL engine: 1-ply refusal (engine opened), undo at 3 plies lands on 1,
// and the engine does NOT move again after the take-back (it is the human's move).
// ---------------------------------------------------------------------------------------------
{
  const lines = [
    "undo", // 0: ply 1 → refused
    "help", // 1: ply 1, Black's narrowest prompt
    "g8f6", // 2: → 3
    "undo", // 3: 3 → 1
    "undo", // 4: refused at 1
    "g8f6", // 5
    "b8c6", // 6
    "undo", // 7: 5 → 3
    "undo", // 8: 3 → 1
    "undo", // 9: refused at the floor
  ];
  const s = await session({
    history: newGame(START_FEN),
    initialFen: START_FEN,
    humanColour: "black",
    engine: realEngine,
    lines,
    orientation: "black-bottom",
  });
  const p = s.prompts;
  summary.S2 = { plies: p.map((x) => x.plies), engineCalls: s.engineCalls };
  check("S2 shape: plies at each prompt", () =>
    assert.deepEqual(p.map((x) => x.plies), [1, 1, 1, 3, 1, 1, 3, 5, 3, 1, 1]),
  );
  check("S2 1-ply undo (human Black, engine opened): refused, nothing changed", () => assertRefused(p, 0));
  check("S2 help at Black's first prompt (black-bottom): hidden 0", () => assertHelpFits(p[2] as Snapshot, "black ply1"));
  check("S2 undo at 3 plies: → 1, the engine's opening move is the SAME object, FEN byte-identical", () => {
    assertUndone(p, 3);
    assert.equal((p[4] as Snapshot).moves[0], (p[0] as Snapshot).moves[0]);
    assert.equal((p[4] as Snapshot).fen, (p[0] as Snapshot).fen);
  });
  check("S2 undo at 1 after a take-back: refused", () => assertRefused(p, 4));
  check("S2 undo ×2 from 5 to the floor, third refused", () => {
    assertUndone(p, 7);
    assertUndone(p, 8);
    assertRefused(p, 9);
  });
  check("S2 the engine moved 1 + 3 times — never after a take-back", () => assert.equal(s.engineCalls, 4));
}

// ---------------------------------------------------------------------------------------------
// S3 — a claimable draw is on offer (threefold), human White, scripted engine. `undo` withdraws the
// claim; a `claim` then is REFUSED; replaying the cycle restores it; the claim then draws.
// ---------------------------------------------------------------------------------------------
{
  const history = played(SHUFFLE_FEN, [...SHUFFLE_CYCLE, ...SHUFFLE_CYCLE]);
  const lines = ["help", "undo", "claim", "h1g1", "claim"];
  const s = await session({
    history,
    initialFen: SHUFFLE_FEN,
    humanColour: "white",
    engine: scripted(["b6a5"]),
    lines,
  });
  const p = s.prompts;
  summary.S3 = { plies: p.map((x) => x.plies), outcome: s.outcome, claimMsgs: p[3]?.messages };
  check("S3 given: the first frame carries a claim (fixture live)", () =>
    assert.ok((p[0] as Snapshot).status.claimable !== undefined),
  );
  check("S3 help with a claim on offer (real frame): hidden 0", () => assertHelpFits(p[1] as Snapshot, "claimable"));
  check("S3 undo on the claimable position: 8 → 6, next frame's claimable undefined", () => {
    assertUndone(p, 1);
    assert.equal((p[2] as Snapshot).status.claimable, undefined);
  });
  check("S3 claim after undo is refused (non-terminal, a message), state unchanged", () => {
    assert.equal((p[3] as Snapshot).plies, 6);
    assert.ok((p[3] as Snapshot).messages.length > 0);
    assert.equal((p[3] as Snapshot).status.claimable, undefined);
  });
  check("S3 replaying the undone plies restores the claim, and claiming then draws by threefold", () => {
    assert.equal((p[4] as Snapshot).plies, 8);
    assert.ok((p[4] as Snapshot).status.claimable !== undefined);
    assert.deepEqual(s.outcome, { result: "draw", reason: "threefold-repetition", exitCode: 0 });
  });
}

// ---------------------------------------------------------------------------------------------
// S4 — after `new` (real engine, White): `new` → 0, `undo` refused, play on, `undo` → 0.
// ---------------------------------------------------------------------------------------------
{
  const lines = ["g1f3", "b1c3", "new", "undo", "g1f3", "undo", "undo"];
  const s = await session({
    history: newGame(START_FEN),
    initialFen: START_FEN,
    humanColour: "white",
    engine: realEngine,
    lines,
  });
  const p = s.prompts;
  summary.S4 = { plies: p.map((x) => x.plies) };
  check("S4 shape", () => assert.deepEqual(p.map((x) => x.plies), [0, 2, 4, 0, 0, 2, 0, 0]));
  check("S4 undo right after `new`: refused", () => assertRefused(p, 3));
  check("S4 undo after new + one exchange: → 0 = START_FEN, then refused", () => {
    assertUndone(p, 5);
    assert.equal((p[6] as Snapshot).fen, START_FEN);
    assertRefused(p, 6);
  });
}

// ---------------------------------------------------------------------------------------------
// S5 — `quit` → cancel by `undo` (real engine, White), both on the take-back and on the refusal.
// ---------------------------------------------------------------------------------------------
{
  const lines = ["g1f3", "quit", "undo", "quit", "undo", "quit", "board", "quit", "quit"];
  const s = await session({
    history: newGame(START_FEN),
    initialFen: START_FEN,
    humanColour: "white",
    engine: realEngine,
    lines,
  });
  const p = s.prompts;
  summary.S5 = { plies: p.map((x) => x.plies), msgs: p.map((x) => x.messages), outcome: s.outcome };
  check("S5 shape: quit/undo/quit never exits early", () =>
    assert.deepEqual(p.map((x) => x.plies), [0, 2, 2, 0, 0, 0, 0, 0, 0]),
  );
  check("S5 quit (armed) → undo takes back 2 → frame messages [] (not a quit)", () => {
    assert.deepEqual((p[2] as Snapshot).messages, ["quit again to end"]);
    assertUndone(p, 2);
  });
  check("S5 quit after undo asks AGAIN (the flag was cleared by undo)", () =>
    assert.deepEqual((p[4] as Snapshot).messages, ["quit again to end"]),
  );
  check("S5 quit → REFUSED undo (ply 0) also clears the flag; quit asks again", () => {
    assertRefused(p, 4);
    assert.deepEqual((p[6] as Snapshot).messages, ["quit again to end"]);
  });
  check("S5 quit quit ends the session (exit 0, no result, the notice)", () => {
    assert.deepEqual(s.outcome, { result: null, reason: null, exitCode: 0 });
    assert.ok(s.sinkText.endsWith("quit\n"));
  });
}

// ---------------------------------------------------------------------------------------------
// S6 — the state a replay must restore: castling rights (undo of O-O) and an en-passant square
// (undo of an e.p. capture). Scripted engine, human White.
// ---------------------------------------------------------------------------------------------
{
  const s = await session({
    history: played(START_FEN, ["e2e4", "e7e5", "g1f3", "b8c6", "f1c4", "g8f6"]),
    initialFen: START_FEN,
    humanColour: "white",
    engine: scripted(["f8c5"]),
    lines: ["e1g1", "undo"],
  });
  const p = s.prompts;
  check("S6a undo of O-O restores KQkq and the halfmove/fullmove counters byte-for-byte", () => {
    assertUndone(p, 1);
    assert.equal((p[2] as Snapshot).fen, (p[0] as Snapshot).fen);
    assert.match((p[2] as Snapshot).fen, / w KQkq /);
  });
  const t = await session({
    history: played(START_FEN, ["e2e4", "a7a6", "e4e5", "d7d5"]),
    initialFen: START_FEN,
    humanColour: "white",
    engine: scripted(["a6a5"]),
    lines: ["e5d6", "undo"],
  });
  const q = t.prompts;
  summary.S6 = { castleFen: p[2]?.fen, epBefore: q[0]?.fen, epAfter: q[2]?.fen };
  check("S6b undo of an en-passant capture restores the pawn AND the e.p. square byte-for-byte", () => {
    assertUndone(q, 1);
    assert.equal((q[2] as Snapshot).fen, (q[0] as Snapshot).fen);
    assert.match((q[0] as Snapshot).fen, / d6 /);
  });
}

// ---------------------------------------------------------------------------------------------
// S7 — classification edges THROUGH THE DELIVERED READER (real terminators), at ply 2.
// ---------------------------------------------------------------------------------------------
{
  const variants: Array<[string, "undo" | "not"]> = [
    ["raw:UNDO\n", "undo"],
    ["raw: undo \n", "undo"],
    ["raw:undo\t\n", "undo"],
    ["raw:undo\r\n", "undo"],
    ["raw:\tUnDo\r\n", "undo"],
    ["raw:undo2\n", "not"],
    ["raw:un do\n", "not"],
    ["raw:undo 2\n", "not"],
    ["raw:und\n", "not"],
    ["raw:undoo\n", "not"],
    ["raw:u\n", "not"],
    ["raw:undo!\n", "not"],
  ];
  const results: Record<string, unknown> = {};
  for (const [line, expected] of variants) {
    const s = await session({
      history: played(START_FEN, ["e2e4", "e7e5"]),
      initialFen: START_FEN,
      humanColour: "white",
      engine: scripted([]),
      lines: [line],
    });
    const p = s.prompts;
    results[JSON.stringify(line.slice(4))] = { plies: p[1]?.plies, messages: p[1]?.messages };
    check(`S7 ${JSON.stringify(line.slice(4))} → ${expected}`, () => {
      if (expected === "undo") assertUndone(p, 0);
      else {
        assert.equal((p[1] as Snapshot).plies, 2, "not taken back");
        assert.equal((p[1] as Snapshot).fen, (p[0] as Snapshot).fen);
        assert.notDeepEqual((p[1] as Snapshot).messages, ["nothing to undo"]);
        assert.ok((p[1] as Snapshot).messages.length > 0, "a rejection message (fell through)");
      }
    });
  }
  summary.S7 = results;
}

// ---------------------------------------------------------------------------------------------
// S8 — collisions: no legal move's SAN folds to a table token, and `undo` / its near-misses never
// parse as a move, over every position the sessions above visit plus a promotion-rich one.
// ---------------------------------------------------------------------------------------------
{
  const positions = [
    newGame(START_FEN),
    played(START_FEN, ["e2e4", "e7e5", "g1f3", "b8c6", "f1c4", "g8f6"]),
    played(START_FEN, ["e2e4", "a7a6", "e4e5", "d7d5"]),
    played(SHUFFLE_FEN, SHUFFLE_CYCLE),
    newGame("1n2k3/P6P/8/8/8/8/p6p/1N2K3 w - - 0 1"),
    newGame("1n2k3/P6P/8/8/8/8/p6p/1N2K3 b - - 0 1"),
  ];
  const tokens = new Set(helpMessages());
  let sans = 0;
  for (const h of positions) {
    const legal = legalMoves(h.position);
    for (const move of legal) {
      const san = toSan(h.position, move, legal);
      sans++;
      check(`S8 SAN ${san} is not a command`, () => {
        assert.equal(classifyCommand(san), undefined);
        assert.ok(!tokens.has(san.toLowerCase()));
      });
    }
    for (const line of ["undo", "UNDO", "undo2", "un do", "u", "und"]) {
      const out = resolveMoveInput(h, line);
      check(`S8 resolveMoveInput(${JSON.stringify(line)}) @ ${toFen(h.position)} is not a move`, () =>
        assert.notEqual(out.kind, "move"),
      );
    }
  }
  // The table order and classify-first: the take-back branch for `undo` precedes `new`'s.
  check("S8 help order (= table order) is help board quit claim resign new undo", () =>
    assert.deepEqual(helpMessages(), ["help", "board", "quit", "claim", "resign", "new", "undo"]),
  );
  check("S8 `new` still takes back ALL plies at ply 6 (undo's branch did not capture it)", () =>
    assert.deepEqual(resolvePromptLine(positions[1] as GameHistory, "new"), {
      kind: "take-back",
      plies: 6,
      messages: [],
    }),
  );
  summary.S8 = { positions: positions.length, sansChecked: sans };
}

// ---------------------------------------------------------------------------------------------
// S9 — `help` on the REAL frame, every glyph mode × orientation, at the start position, Black's
// first prompt, mid-game and the claimable position.
// ---------------------------------------------------------------------------------------------
{
  const cases: Array<[string, GameHistory]> = [
    ["start", newGame(START_FEN)],
    ["ply1", played(START_FEN, ["e2e4"])],
    ["ply6", played(START_FEN, ["e2e4", "e7e5", "g1f3", "b8c6", "f1c4", "g8f6"])],
    ["claimable", played(SHUFFLE_FEN, [...SHUFFLE_CYCLE, ...SHUFFLE_CYCLE])],
  ];
  const regions: Record<string, unknown> = {};
  for (const mode of ["unicode", "ascii"] as const) {
    for (const orientation of ["white-bottom", "black-bottom"] as const) {
      for (const [name, h] of cases) {
        const rows = makeRenderSeam(mode, orientation)(h, gameStatusOf(h), false, helpMessages());
        const region = regionOf(rows);
        const label = `${mode}/${orientation}/${name}`;
        regions[label] = { width: Math.max(...rows.map((r) => [...r].length)), region };
        check(`S9 help hidden 0 on the real frame: ${label}`, () => {
          assert.ok(!region.join("\n").includes("(+"), JSON.stringify(region));
          for (const token of helpMessages()) assert.ok(region.join(" ").includes(token), token);
        });
      }
    }
  }
  summary.S9 = regions;
}

console.log(log.join("\n"));
console.log(`\n${checks - failures}/${checks} checks passed, ${failures} failed`);
console.log(JSON.stringify(summary, (_k, v) => (typeof v === "bigint" ? v.toString() : v), 1));
process.exitCode = failures === 0 ? 0 : 1;
