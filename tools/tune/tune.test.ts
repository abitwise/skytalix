/**
 * `ABC-239` — the tuner's tests (`ADR-0067` d10 and § Addendum's test strategy). Outside the default
 * lane (`NFR-008`): `TUNE_DEEP=1` registers the rows, on the `PERFT_DEEP` precedent; unset, only the
 * source row below runs.
 *
 *   TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune
 *
 * Every fixture game is written here: the own games and the Lichess-shaped games are played by the
 * engine itself at depth 1 from fixed starts, so they are this project's own and need no licence.
 * The `.pgn.zst` fixture is compressed from them at run time with `node:zlib`.
 */
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const RUN_DEEP = process.env.TUNE_DEEP === "1";
const HERE = new URL(".", import.meta.url);

describe("ABC-239 — tools/tune's source pins", () => {
  it("imports no TEST-ONLY export of src/ (ADR-0067 d8, S3) and makes no network call (d9)", () => {
    const sources = readdirSync(HERE)
      .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))
      .map((f) => readFileSync(new URL(f, HERE), "utf8"));
    expect(sources.length).toBeGreaterThanOrEqual(3);
    for (const s of sources) {
      expect(s).not.toMatch(/ForTest\b|withParametersForTest|VALUE_TABLES_FOR_TEST/);
      expect(s).not.toMatch(/node:(https?|net|dns|tls)\b|\bfetch\(/);
    }
  });
});

if (RUN_DEEP) {
  const { copyFileSync, existsSync, mkdirSync, mkdtempSync, writeFileSync } = await import(
    "node:fs"
  );
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const { createHash } = await import("node:crypto");
  const { zstdCompressSync } = await import("node:zlib");
  const { makeMove } = await import("../../src/apply.ts");
  const { evaluate } = await import("../../src/evaluate.ts");
  const { buildCorpus } = await import("../../src/evaluate.mirror-corpus.ts");
  const { parseFen, toFen } = await import("../../src/fen.ts");
  const { legalMoves } = await import("../../src/legal.ts");
  const { toSan } = await import("../../src/san.ts");
  const { search } = await import("../../src/search.ts");
  const T = await import("./tune.ts");
  const { gamesOf, lexMovetext, streamZstGames } = await import("./pgn.ts");
  const { gateMiss, SHIPPED, tableOf, trace } = await import("./tracer.ts");

  const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const RESULTS = ["1-0", "0-1", "1/2-1/2"];
  const sha = (b: Buffer | string): string => createHash("sha256").update(b).digest("hex");
  const tmp = (): string => mkdtempSync(join(tmpdir(), "tune-test-"));

  /** A game played by the engine at depth 1, after `lead` (indexes into the SAN-sorted legal list). */
  const play = (fen: string, plies: number, lead: readonly number[] = []): string[] => {
    const p = parseFen(fen);
    const sans: string[] = [];
    for (let i = 0; i < plies; i++) {
      const legal = legalMoves(p);
      if (legal.length === 0) break;
      let move = search(p, 1).move;
      if (i < lead.length) {
        const sorted = [...legal].sort((a, b) =>
          toSan(p, a, legal) < toSan(p, b, legal) ? -1 : 1,
        );
        move = sorted[(lead[i] as number) % sorted.length] ?? null;
      }
      if (move === null) break;
      sans.push(toSan(p, move, legal));
      makeMove(p, move);
    }
    return sans;
  };

  /** Move text with numbers; `comment(i)` follows ply i when it returns a string. */
  const movetext = (
    sans: readonly string[],
    result: string,
    comment: (i: number) => string | null,
  ): string =>
    `${sans
      .map((s, i) => {
        const c = comment(i);
        return `${i % 2 === 0 ? `${i / 2 + 1}. ` : ""}${s}${c === null ? "" : ` {${c}}`}`;
      })
      .join(" ")} ${result}`;

  const ownPgn = (fen: string, sans: readonly string[], result: string, book: number): string =>
    `[Event "?"]\n[White "skytalix"]\n[Black "base"]\n[Result "${result}"]\n[FEN "${fen}"]\n[SetUp "1"]\n\n${movetext(
      sans,
      result,
      (i) => (i < book ? null : "+0.10/5 0.10s"),
    )}\n\n`;

  const LICHESS_TAGS: Record<string, string> = {
    Event: "Rated Blitz game",
    Site: "https://lichess.org/xxxxxxxx",
    White: "w",
    Black: "b",
    WhiteElo: "2100",
    BlackElo: "2050",
    TimeControl: "180+0",
    Termination: "Normal",
  };
  /** A Lichess-shaped game: no Round and no Date tag (the export's known issue). */
  const lichessPgn = (
    sans: readonly string[],
    result: string,
    tags: Record<string, string | null> = {},
    comment: (i: number) => string | null = () => null,
  ): string => {
    const all: Record<string, string | null> = { ...LICHESS_TAGS, Result: result, ...tags };
    const head = Object.entries(all)
      .filter(([, v]) => v !== null)
      .map(([k, v]) => `[${k} "${v}"]`)
      .join("\n");
    return `${head}\n\n${movetext(sans, result, comment)}\n\n`;
  };

  // ---- the fixture: 30 own games from the rating openings, 24 Lichess-shaped games ----
  const OPENINGS = readFileSync(new URL("../rating/openings.epd", HERE), "utf8")
    .trim()
    .split("\n")
    .slice(0, 30)
    .map((epd) => `${epd} 0 1`);
  const OWN_TEXT = OPENINGS.map((fen, g) =>
    ownPgn(fen, play(fen, 70), RESULTS[g % 3] as string, 2),
  ).join("");
  const LI_GAMES = Array.from({ length: 24 }, (_, g) => ({
    sans: play(START, 70, [g % 20, Math.floor(g / 20) + 1, g % 7]),
    result: RESULTS[(g + 1) % 3] as string,
  }));
  const EVAL_COMMENT = (i: number): string | null =>
    i % 3 === 0
      ? " [%eval 0.24] "
      : i % 3 === 1
        ? " [%clk 0:02:59] "
        : "Blunder. Qd8 was best. M3 [%eval #-3]";

  interface Fixture {
    root: string;
    zst: string;
    pin: { sha256: string; bytes: number };
  }
  const fixture = (lichessText: string): Fixture => {
    const root = tmp();
    writeFileSync(join(root, "own.pgn"), OWN_TEXT);
    const zst = join(root, "li.pgn.zst");
    const bytes = zstdCompressSync(Buffer.from(lichessText));
    writeFileSync(zst, bytes);
    return { root, zst, pin: { sha256: sha(bytes), bytes: bytes.length } };
  };
  const run = async (fx: Fixture, withLichess = true, ownPgns = ["own.pgn"]) => {
    const outDir = join(tmp(), "out");
    const info = await T.extract({
      ownPgns,
      root: fx.root,
      ...(withLichess ? { lichess: { path: fx.zst, pin: fx.pin, min: 0 } } : {}),
      outDir,
    });
    const rows = readFileSync(join(outDir, "rows.jsonl"), "utf8")
      .trim()
      .split("\n")
      .map((l) => JSON.parse(l) as import("./tune.ts").Row);
    return { outDir, info, rows, counts: info.counts as Record<string, number> };
  };
  const plainText = LI_GAMES.map((g) => lichessPgn(g.sans, g.result)).join("");

  describe("ABC-239 identity gate (ADR-0067 d5, B-T1) [deep, TUNE_DEEP=1]", () => {
    it("the traced model is evaluate within 1 cp, exact at phase 24, over G3's 184 at the shipped table", () => {
      let worst = 0;
      const misses = buildCorpus().filter(({ position }) => {
        const ev = evaluate(position);
        const g = gateMiss(trace(position), position.blackToMove ? 0 - ev : ev, SHIPPED);
        worst = Math.max(worst, g.d);
        return g.miss;
      });
      expect(misses.map((c) => c.name)).toEqual([]);
      expect(worst).toBeLessThan(1);
    });

    it("extract gates every kept row: the fixture's rows pass with 0 misses", async () => {
      const r = await run(fixture(plainText));
      expect(r.counts["gate.checked"]).toBe(r.rows.length);
      expect(r.info.gateWorst as number).toBeLessThan(1);
    });
  });

  describe("ABC-239 the reader (§ Addendum test strategy) [deep, TUNE_DEEP=1]", () => {
    it("comment blindness: [%eval], [%clk] and free text give rows byte-identical to the stripped game", async () => {
      const commented = LI_GAMES.map((g) => lichessPgn(g.sans, g.result, {}, EVAL_COMMENT)).join(
        "",
      );
      expect(commented).toContain("[%eval");
      expect(commented).toContain("[%clk");
      const a = await run(fixture(commented));
      const b = await run(fixture(plainText));
      expect(a.counts["rows.lichess"]).toBeGreaterThan(0);
      expect(readFileSync(join(a.outDir, "rows.jsonl"))).toEqual(
        readFileSync(join(b.outDir, "rows.jsonl")),
      );
    });

    it("the export's known issue: no Round or Date tag, and no black move numbers after comments, parses", () => {
      const text = `[Event "Rated Blitz game"]\n[White "w"]\n[Black "b"]\n[Result "1-0"]\n[WhiteElo "2100"]\n[BlackElo "2100"]\n[TimeControl "300+3"]\n[Termination "Normal"]\n\n1. e4 { [%eval 0.2] } e5 { [%eval 0.3] } 2. Nf3 { x } Nc6?! 3. Bb5 a6 1-0\n`;
      const [game] = gamesOf(text);
      expect(game?.tags.has("Round")).toBe(false);
      expect(game?.tags.has("Date")).toBe(false);
      expect(T.lichessTagFilter(game?.tags ?? new Map())).toBeNull();
      expect(lexMovetext(game?.movetext ?? "", false)).toEqual({
        sans: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6"],
        comments: null,
      });
    });

    it("filter counts: one game per drop reason; a replay drop over 0.1 % is the data-stage STOP", async () => {
      const g = LI_GAMES[0] as { sans: string[]; result: string };
      const drops = [
        lichessPgn(g.sans, g.result, { Event: "Casual Blitz game" }),
        lichessPgn(g.sans, g.result, { TimeControl: "60+0" }),
        lichessPgn(g.sans, g.result, { WhiteElo: "1999" }),
        lichessPgn(g.sans, g.result, { BlackElo: "2400", WhiteElo: "2150" }),
        lichessPgn(g.sans, g.result, { Termination: "Time forfeit" }),
        lichessPgn(g.sans, "*"),
        lichessPgn(g.sans, g.result, { WhiteTitle: "BOT" }),
        lichessPgn(["e4", "e5", "Ke3"], g.result),
        lichessPgn(g.sans, g.result),
      ].join("");
      const fx = fixture(plainText + drops);
      const outDir = tmp();
      await expect(
        T.extract({
          ownPgns: ["own.pgn"],
          root: fx.root,
          lichess: { path: fx.zst, pin: fx.pin, min: 0 },
          outDir,
        }),
      ).rejects.toThrow(/DATA-STAGE STOP to Architect\/Design: the reader dropped 1 of 26/);
      const stop = JSON.parse(readFileSync(join(outDir, "extract.stop.json"), "utf8"));
      expect(existsSync(join(outDir, "rows.jsonl"))).toBe(false);
      expect(stop.counts).toMatchObject({
        "li.games.read": 33,
        "li.g1.event": 1,
        "li.g2.timecontrol": 1,
        "li.g3.elo": 2,
        "li.g4.termination": 1,
        "li.g5.result": 1,
        "li.g6.bot": 1,
        "li.g7.reachReplay": 26,
        "li.g7.replay": 1,
        "li.g8.duplicate": 1,
        "li.games.kept": 24,
      });
    });

    it("the sha256 refusal: a byte-changed copy exits non-zero and writes nothing", async () => {
      const fx = fixture(plainText);
      const changed = join(fx.root, "changed.pgn.zst");
      copyFileSync(fx.zst, changed);
      const bytes = readFileSync(changed);
      bytes[bytes.length - 1] = (bytes[bytes.length - 1] as number) ^ 1;
      writeFileSync(changed, bytes);
      const outDir = join(tmp(), "out");
      await expect(
        T.extract({
          ownPgns: ["own.pgn"],
          root: fx.root,
          lichess: { path: changed, pin: fx.pin, min: 0 },
          outDir,
        }),
      ).rejects.toThrow(/Lichess file refused/);
      expect(existsSync(outDir)).toBe(false);
    });

    it("leakage runs one way: a Lichess key equal to an own-validation key leaves the Lichess rows; validation is unchanged", async () => {
      // An own validation game from a 4-ply start, and a Lichess game that plays the same moves.
      let lead: string[] = [];
      let fen = "";
      for (let k = 0; ; k++) {
        lead = play(START, 4, [k, k * 5 + 2, k * 3 + 1, k + 4]);
        const p = parseFen(START);
        for (const s of lead) {
          const legal = legalMoves(p);
          makeMove(p, legal.find((m) => toSan(p, m, legal) === s) as (typeof legal)[number]);
        }
        fen = toFen(p);
        if (T.isOuterVal(fen)) break;
      }
      const rest = play(fen, 90);
      const root = tmp();
      writeFileSync(join(root, "val.pgn"), ownPgn(fen, rest, "1-0", 0));
      const zstBytes = zstdCompressSync(Buffer.from(lichessPgn([...lead, ...rest], "1-0")));
      const zst = join(root, "li.pgn.zst");
      writeFileSync(zst, zstBytes);
      const fx = { root, zst, pin: { sha256: sha(zstBytes), bytes: zstBytes.length } };
      const own = await run(fx, false, ["val.pgn"]);
      const both = await run(fx, true, ["val.pgn"]);
      const valKeys = new Set(own.rows.filter((r) => r.s === 1).map((r) => r.k));
      expect(valKeys.size).toBeGreaterThan(0);
      expect(both.counts["li.p7.leakage"]).toBeGreaterThan(0);
      expect(both.rows.filter((r) => r.s === 2 && valKeys.has(r.k))).toEqual([]);
      expect(both.rows.filter((r) => r.s !== 2)).toEqual(own.rows);
    });

    it("the zstd stream: a .pgn.zst fixture streams back every game, tags and moves intact", async () => {
      const fx = fixture(plainText);
      const games: import("./pgn.ts").Game[] = [];
      await streamZstGames(fx.zst, (g) => games.push(g));
      expect(games).toHaveLength(LI_GAMES.length);
      games.forEach((g, i) => {
        expect(g.tags.get("Event")).toBe("Rated Blitz game");
        expect(lexMovetext(g.movetext, false).sans).toEqual(LI_GAMES[i]?.sans);
      });
    });
  });

  describe("ABC-239 split, determinism and emission (ADR-0067 d9, d7, B-T2, B-T3) [deep, TUNE_DEEP=1]", () => {
    it("the split is disjoint: no key is both own training and own validation; inner rows are training", async () => {
      const r = await run(fixture(plainText));
      const train = new Set(r.rows.filter((x) => x.s === 0).map((x) => x.k));
      const val = r.rows.filter((x) => x.s === 1);
      expect(train.size).toBeGreaterThan(0);
      expect(val.length).toBeGreaterThan(0);
      expect(val.filter((x) => train.has(x.k))).toEqual([]);
      expect(r.rows.filter((x) => x.inner && x.s !== 0)).toEqual([]);
      expect(r.counts["own.openings.val"]).toBe(OPENINGS.filter(T.isOuterVal).length);
    });

    it("extract + fit + emit twice give one byte-identical file, and the file round-trips to the fitted table", async () => {
      const fx = fixture(plainText);
      const outputs: string[] = [];
      let last = "";
      for (let k = 0; k < 2; k++) {
        const r = await run(fx);
        await T.fitData(r.outDir);
        const target = join(r.outDir, "evaluate-params.ts");
        T.emit(r.outDir, target, "0000000000000000000000000000000000000000");
        outputs.push(readFileSync(target, "utf8"));
        last = r.outDir;
      }
      expect(outputs[1]).toBe(outputs[0]);
      const fitted = JSON.parse(readFileSync(join(last, "fit.json"), "utf8"));
      const dir = join(tmp(), "emitted");
      mkdirSync(dir);
      writeFileSync(join(dir, "evaluate-params.ts"), outputs[0] as string);
      const imported = await import(join(dir, "evaluate-params.ts"));
      const table = tableOf(imported);
      expect({
        mg: Array.from(table.mg),
        eg: Array.from(table.eg),
        wmg: table.wmg,
        weg: table.weg,
        cap: table.cap,
      }).toEqual(fitted.table);
      const names = [
        "MATERIAL",
        "PST",
        "PASSED",
        "DOUBLED",
        "ISOLATED",
        "KING_SHELTER_MISSING",
        "KING_FILE_HALF_OPEN",
        "KING_FILE_OPEN",
        "MOBILITY_WEIGHT",
        "MOBILITY_CAP",
      ];
      const values = JSON.stringify(names.map((n) => [n, imported[n]]));
      expect(outputs[0]).toContain(`values sha256 ${sha(values)}`);
      // Material and the phase constants are frozen (d6).
      expect(imported.MATERIAL).toEqual({
        mg: [0, 100, 325, 325, 500, 900, 0],
        eg: [0, 100, 325, 325, 500, 900, 0],
      });
      expect(imported.MOBILITY_CAP).toEqual({ mg: 100, eg: 100 });
    });
  });
}
