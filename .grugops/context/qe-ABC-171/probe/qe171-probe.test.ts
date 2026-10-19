// qe-ABC-171 probe (scratch copy only; never in the branch). Virtual clock only: no wall time is read.
// Prints readings with console.log and asserts nothing it does not have to, so a reading is a reading.
import { describe, expect, it } from "vitest";
import { createBookProbe } from "./book.ts";
import { HARD_CEILING_MS } from "./engine.ts";
import { parseFen } from "./fen.ts";
import { createLevel, LEVELS, seededRandom } from "./levels.ts";
import { squareName } from "./position.ts";
import { createUciSession } from "./uci-session.ts";
import { virtualClock } from "./virtual-clock.ts";
import { zobristKey } from "./zobrist.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const bytes = (positions: Record<string, unknown>) =>
  new TextEncoder().encode(JSON.stringify({ format: 1, maxPly: 12, positions }));
const hex = (fen: string) => zobristKey(parseFen(fen)).toString(16).padStart(16, "0");
const START_BOOK = () => bytes({ [hex(START_FEN)]: { m: [["e2e4", 1]] } });

function rig(opts: { k?: number; step?: number; read?: () => Uint8Array } = {}) {
  const out: string[] = [];
  const warns: string[] = [];
  const counts = { reads: 0, draws: 0 };
  const gen = seededRandom(opts.k ?? 1);
  const session = createUciSession({
    write: (l) => out.push(l),
    now: virtualClock(opts.step ?? 100),
    random: () => {
      counts.draws++;
      return gen();
    },
    book: createBookProbe({
      read: () => {
        counts.reads++;
        return (opts.read ?? (() => bytes({})))();
      },
      warn: (m) => warns.push(m),
      random: seededRandom(7),
    }),
  });
  const send = (line: string) => {
    const b = out.length;
    session.handleLine(line);
    return out.slice(b);
  };
  return { send, out, warns, counts };
}
const timeOf = (lines: string[]) => Number(/ time (\d+) /.exec(lines.join("\n"))?.[1] ?? Number.NaN);

describe("P1 NFR-004 on the virtual clock: the highest budget the session can pass", () => {
  const rows: Array<[number, string]> = [];
  for (const level of [1, 2, 3, 4, 5])
    for (const go of ["go", "go movetime 100000", "go wtime 600000 btime 600000", "go depth 99", "go infinite"])
      rows.push([level, go]);
  it("every level x every unbounded go: time <= level budget + 2 steps, and < HARD_CEILING_MS", () => {
    let max = 0;
    for (const [level, go] of rows) {
      // k = 1: the first level-1/2 draw takes the engine path (0.694 >= 0.4 and >= 0.2).
      const { send } = rig({ k: 1, step: 100 });
      send(`setoption name Skill Level value ${level}`);
      send("position startpos");
      const lines = [...send(go), ...(go === "go infinite" ? send("stop") : [])];
      const t = timeOf(lines);
      max = Math.max(max, t);
      console.log(`P1 level ${level} | ${go} | time ${t} | budget ${LEVELS[level as 1].budgetMs}`);
      expect(t).toBeLessThanOrEqual(LEVELS[level as 1].budgetMs + 200);
    }
    console.log(`P1 max time over all rows ${max}; HARD_CEILING_MS ${HARD_CEILING_MS}`);
    expect(max).toBeLessThan(HARD_CEILING_MS);
  });
});

describe("P2 the per-go seed oracle (D11: seed = floor(random() * 2^32), a fresh level per go)", () => {
  it("level-1 session bestmoves equal createLevel driven by the same draws", () => {
    for (const k of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const { send } = rig({ k, step: 10 });
      send("setoption name Skill Level value 1");
      const fens = [START_FEN, "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"];
      const got: string[] = [];
      for (const fen of fens) {
        send(`position fen ${fen}`);
        got.push(send("go movetime 1000").at(-1) as string);
      }
      const gen = seededRandom(k);
      const want = fens.map((fen) => {
        const seed = Math.floor(gen() * 2 ** 32);
        const c = createLevel({ budgetMs: 100, blunderRate: 0.4 }, { seed, now: virtualClock(10) })(parseFen(fen));
        return c === null ? "bestmove 0000" : `bestmove ${squareName(c.move.from)}${squareName(c.move.to)}`;
      });
      console.log(`P2 k=${k} session ${got.join(",")} | oracle ${want.join(",")}`);
      expect(got).toEqual(want);
    }
  });
});

describe("P3 a book hit at a blunder level", () => {
  it("lines and random draws", () => {
    const { send, counts } = rig({ read: START_BOOK });
    send("setoption name Skill Level value 1");
    send("position startpos");
    console.log(`P3 lines ${JSON.stringify(send("go movetime 1000"))} draws ${counts.draws}`);
  });
});

describe("P4 dropped limits at level 1", () => {
  for (const go of ["go nodes 100", "go mate 2", "go depth 3 nodes 100 mate 2", "go depth x", "go depth 3 depth 4"]) {
    it(go, () => {
      const { send } = rig({ k: 1, step: 10 });
      send("setoption name Skill Level value 1");
      send("position startpos");
      console.log(`P4 ${go} -> ${JSON.stringify(send(go))}`);
    });
  }
});

describe("P5 setoption edges", () => {
  for (const line of [
    "setoption name OwnBook value TRUE",
    "setoption name OwnBook",
    "setoption name OwnBook value",
    "setoption name Skill Level value 1 2",
    "setoption name Skill Level value 01",
    "setoption name Skill Level value 1.0",
    "setoption name Skill Level value __proto__",
    "setoption name Skill Level value toString",
    "setoption name  SKILL   LEVEL  value 5",
    "setoption name Skill Level value  5 ",
    "setoption name OwnBook value true false",
    "setoption Skill Level value 1",
    "setoption name Skill value 1",
  ]) {
    it(line, () => {
      const { send } = rig({ k: 1 });
      const w = send(line);
      send("position startpos");
      const g = send("go wtime 60000 btime 60000 winc 1000 binc 1000");
      console.log(`P5 ${JSON.stringify(line)} -> ${JSON.stringify(w)} | then go time ${timeOf(g)}`);
    });
  }
});

describe("P6 a bad book: the warning text and where it goes", () => {
  it("read throws", () => {
    const { send, warns, out } = rig({
      read: () => {
        throw new Error("ENOENT secret-path");
      },
    });
    send("isready");
    send("position startpos");
    send("go movetime 100");
    console.log(`P6 warns ${JSON.stringify(warns)} | session lines ${JSON.stringify(out)}`);
  });
});

describe("P7 OwnBook toggled mid-session", () => {
  it("off: search, 0 reads; on: book hit, 1 read", () => {
    const { send, counts } = rig({ read: START_BOOK });
    send("setoption name OwnBook value false");
    send("position startpos");
    const a = send("go movetime 200");
    const r1 = counts.reads;
    send("setoption name OwnBook value true");
    const b = send("go movetime 200");
    console.log(`P7 off ${JSON.stringify(a)} reads ${r1} | on ${JSON.stringify(b)} reads ${counts.reads}`);
    expect(r1).toBe(0);
    expect(b).toEqual(["info string book", "bestmove e2e4"]);
    expect(counts.reads).toBe(1);
  });
});

describe("P8 A6 at levels 2 and 4", () => {
  for (const level of [2, 4]) {
    it(`level ${level}`, () => {
      const { send } = rig({ k: 1 });
      send(`setoption name Skill Level value ${level}`);
      send("position startpos");
      console.log(`P8 level ${level} -> ${JSON.stringify(send("go wtime 60000 btime 60000 winc 1000 binc 1000"))}`);
    });
  }
});
