# tip.py <tree> <orig> : the arch-ABC-302 tip sketch. Forms: R1 S, R2 S, R3 W, R4 S, R5 S, R6 W, R7 W, R8 S (full row to
# uci-session's ENGINE_DEEP), R9 S (option ii). Moved bodies are cut from the originals byte-for-byte.
import sys
P, O = sys.argv[1], sys.argv[2]
def rd(name): return open(f"{O}/{name}.test.ts.orig").read()
def wr(name, s): open(f"{P}/src/{name}.test.ts", "w").write(s)
def cut(s, header, indent="  "):
    """The it() block starting at `header` through its closing line (indent + '});' or '}, N);')."""
    a = s.index(header); assert s.count(header) == 1, header[:60]
    i = a
    while True:
        j = s.index("\n", i) + 1
        line = s[j:s.index("\n", j)]
        if line.startswith(indent + "});") or (line.startswith(indent + "}, ") and line.endswith(");")):
            end = s.index("\n", j) + 1
            return a, end
        i = j
def body(s, header, indent="  "):
    a, e = cut(s, header, indent); return s[a:e]

# ---- R1 (S): remnant in place, full row in a nested RUN_DEEP describe
s = rd("search.null-move")
H1 = '  it("search() to depth 4 and chooseMove deepened to 4: every null move is made out of check, with three or more pieces", () => {'
a, e = cut(s, H1); row = s[a:e]
D1 = "A2 — the instrumented search makes 0 null moves in check, and 0 below three non-pawn pieces"
rem1 = '''  // ABC-302 (secnfr-nfr008-1104, arch-ABC-302): the in-check root and position-5 stay in the default lane; the six roots run under SEARCH_DEEP=1.
  it("the in-check root and position-5, search() to depth 4 and chooseMove deepened to 4: every null move is made out of check, with three or more pieces", () => {
    const made: Position[] = [];
    for (const fen of [IN_CHECK_ROOT, fenOf("position-5")]) {
      made.push(...nullMovesDuring(() => search(parseFen(fen), 4)));
      made.push(...nullMovesDuring(() => deepenTo(chooseMove, fen, 4)));
    }
    expect(made.length).toBeGreaterThan(100);
    expect(made.filter((position) => isInCheck(position)).map((p) => toFen(p))).toEqual([]);
    expect(made.filter((position) => nonPawnPieces(position) < 3).map((p) => toFen(p))).toEqual([]);
  });

  if (RUN_DEEP) {
    describe("''' + D1 + ''' [deep, SEARCH_DEEP=1]", () => {
''' + "".join("    " + l if l.strip() else l for l in row.splitlines(True)) + '''    });
  }
'''
s = s[:a] + rem1 + s[e:]
wr("search.null-move", s)

# ---- R3 (W): the row moves whole into a nested RUN_DEEP describe; no remnant
s = rd("search.futility")
H3 = '  it("the rule changes the work: search() at depth 4 and chooseMove deepened to 4 on position-6 visit fewer nodes than their doors", () => {'
a, e = cut(s, H3); row = s[a:e]
D3 = "the doors — searchWithoutFutility and chooseMoveWithoutFutility turn futility off, as every older door does"
s = s[:a] + '''  // ABC-302 (secnfr-nfr008-1104, arch-ABC-302): form W, the row runs under SEARCH_DEEP=1 only.
  if (RUN_DEEP) {
    describe("''' + D3 + ''' [deep, SEARCH_DEEP=1]", () => {
''' + "".join("    " + l if l.strip() else l for l in row.splitlines(True)) + '''    });
  }
''' + s[e:]
wr("search.futility", s)

# ---- R4 (S): remnant at depth 1 in place; full row in a describe after RUN_DEEP's declaration
s = rd("zobrist")
H4 = '  it("holds at every node within 2 plies of every perft position", () => {'
a, e = cut(s, H4); row = s[a:e]
D4 = "ABC-075 property — the ep component tracks the ep FIELD, not availability (ADR-0020)"
rem4 = '''  // ABC-302 (secnfr-nfr008-1104, arch-ABC-302): one ply stays in the default lane; two plies run under ZOBRIST_DEEP=1.
  it("holds at every node 1 ply from every perft position", () => {
    let checked = 0;
    let carried = 0;
    for (const [, fen] of PERFT_POSITIONS) {
      const walked = checkEpComponent(parseFen(fen), 1);
      checked += walked.checked;
      carried += walked.ep;
    }
    expect(checked).toBeGreaterThan(0);
    expect(carried).toBeGreaterThan(0);
    expect(checked - carried).toBeGreaterThan(0);
  });
'''
s = s[:a] + rem4 + s[e:]
anchor = 'const RUN_DEEP = process.env.ZOBRIST_DEEP === "1";\n'
assert s.count(anchor) == 1
s = s.replace(anchor, anchor + '''
if (RUN_DEEP) {
  describe("''' + D4 + ''' [deep, ZOBRIST_DEEP=1]", () => {
''' + "".join("  " + l if l.strip() else l for l in row.splitlines(True)) + '''  });
}
''')
wr("zobrist", s)

# ---- R5 (S): remnant on a 10 000 ms counting clock in place; full row in a sibling RUN_DEEP describe
s = rd("engine")
H5 = '  it("on an infinite budget, maxDepth 1000 returns within the same consultation count", () => {'
a, e = cut(s, H5); row = s[a:e]
D5 = "ABC-170 A5 — the limits only shorten; the ceiling still holds"
cc_a = s.index("  /** Counts every consultation, and throws past a fuse, as `RF-1`'s clock does. */")
cc = s[cc_a:a]
rem5 = '''  // ABC-302 (secnfr-nfr008-1104, arch-ABC-302): a 10 000 ms counting clock stays in the default lane; 2 500 runs under ENGINE_DEEP=1.
  it("on an infinite budget and a 10 000 ms counting clock, maxDepth 1000 returns within the same consultation count", () => {
    const without = countingClock(10_000, 64);
    const withCap = countingClock(10_000, 64);
    const startpos = () => parseFen(fenOf("startpos"));
    const a = chooseMove(startpos(), { budgetMs: Number.POSITIVE_INFINITY, now: without.now });
    const b = chooseMove(startpos(), {
      budgetMs: Number.POSITIVE_INFINITY,
      now: withCap.now,
      maxDepth: 1000,
    });
    expect(without.consultations).toBeGreaterThan(2);
    expect(withCap.consultations).toBe(without.consultations);
    expect(b).toEqual(a);
  });
'''
s = s[:a] + rem5 + s[e:]
# after the describe's end: find the describe and its closing "});\n" at column 0 after the sibling
d_a = s.index('describe("' + D5 + '", () => {')
d_e = s.index("\n});\n", d_a) + len("\n});\n")
s = s[:d_e] + '''
if (RUN_DEEP) {
  describe("''' + D5 + ''' [deep, ENGINE_DEEP=1]", () => {
''' + "".join("  " + l if l.strip() else l for l in cc.splitlines(True)) + "".join("  " + l if l.strip() else l for l in row.splitlines(True)) + '''  });
}
''' + s[d_e:]
wr("engine", s)

# ---- R6 (W) and R7 (W): each whole describe moves under RUN_DEEP with " [deep]"
s = rd("levels")
for title in ['A7 — seeded, in deterministic mode', 'ABC-174 A3 — the default plays as the engine: chooseMove at 4 000 ms (ABC-228, ADR-0053 d10)']:
    d_a = s.index('describe("' + title + '", () => {'); assert s.count('describe("' + title + '", () => {') == 1
    d_e = s.index("\n});\n", d_a) + len("\n});\n")
    block = s[d_a:d_e].replace('describe("' + title + '", () => {', 'describe("' + title + ' [deep]", () => {', 1)
    s = s[:d_a] + "// ABC-302 (secnfr-nfr008-1104, arch-ABC-302): form W, the describe runs under ENGINE_DEEP=1 only.\nif (RUN_DEEP) {\n" + "".join("  " + l if l.strip() else l for l in block.splitlines(True)) + "}\n" + s[d_e:]
wr("levels", s)

# ---- R2 (S) uci-session; R8's full row also lands here, both at the end, after RUN_ENGINE_DEEP
u = rd("uci-session")
H2 = '''  it("A5: the CLI level seam's injected list equals UCI's, key for key, and both play d8e8", async () => {'''
a, e = cut(u, H2); row2 = u[a:e]
rem2 = '''  // ABC-302 (secnfr-nfr008-1104, arch-ABC-302): a 500 ms step (depth 8) stays in the default lane; 100 runs under ENGINE_DEEP=1.
  it("A5 (slice): on a 500 ms virtual step, the CLI level seam's injected list equals UCI's, key for key, and both play d8e8", async () => {
    const game = gameOf(FEN);
    const seam = createLevelSeam(DEFAULT_LEVEL, { seed: 1, now: virtualClock(500) }, repetitionKeyHistory);
    const cli = coordinateOf(await seam(game));
    const fromCli = lastHanded();
    const { perLine } = talk([`position fen ${FEN} moves ${MOVES}`, "go"], 500);
    expect(lastHanded()).toEqual(fromCli);
    expect(fromCli).toHaveLength(7);
    expect(cli).toBe("d8e8");
    expect(perLine[1]?.at(-1)).toBe("bestmove d8e8");
    expect(parseInfo(perLine[1]?.[0]).score).toBe("cp 0");
  });
'''
u = u[:a] + rem2 + u[e:]
c = rd("cli")
H8 = '''  it("A4: with repetitionKeyHistory injected the default level plays d8e8 at exactly 0; base does not", async () => {'''
a8, e8 = cut(c, H8); row8 = c[a8:e8]
rem8 = '''  // ABC-302 (secnfr-nfr008-1104, arch-ABC-302): a 500 ms step (depth 8) stays here; the 100 ms row runs in src/uci-session.test.ts under ENGINE_DEEP=1.
  it("A4 (slice): on a 500 ms virtual step, with repetitionKeyHistory injected the default level plays d8e8 at exactly 0; base does not", async () => {
    const game = gameOf(FEN);
    const at500 = (list: typeof keyHistory) =>
      chooseMove(parseFen(toFen(game.position)), {
        budgetMs: LEVELS[DEFAULT_LEVEL].budgetMs,
        now: virtualClock(500),
        priorKeys: trimPriorKeys(list(game), game.position.halfmoveClock),
      });
    const seam = createLevelSeam(DEFAULT_LEVEL, { seed: 1, now: virtualClock(500) }, repetitionKeyHistory);
    expect(labelOf(await seam(game))).toBe("d8e8");
    const direct = at500(repetitionKeyHistory);
    expect(direct && { move: labelOf(direct.move), score: direct.score }).toEqual({ move: "d8e8", score: 0 });
    expect(direct?.depth).toBeGreaterThanOrEqual(5);
    expect(at500(keyHistory)?.score).not.toBe(0);
  });
'''
c = c[:a8] + rem8 + c[e8:]
wr("cli", c)
D2 = "ABC-241 A4, A5 — UCI: the prior keys are repetition keys"
D8 = "ABC-241 A4, A7 — the CLI: a third occurrence through an uncapturable ep square"
u += '''
// ABC-302 (secnfr-nfr008-1104, arch-ABC-302): two full rows, each under ENGINE_DEEP=1 only. The second is
// src/cli.test.ts's ABC-241 A4 row; this file's engine spy calls through, and each describe here installs no stub.
if (RUN_ENGINE_DEEP) {
  describe("''' + D2 + ''' [deep, ENGINE_DEEP=1]", () => {
    const FEN = "4k3/7p/8/8/8/8/8/Q3K3 b - - 0 1";
    const MOVES = "h7h5 a1a2 e8d8 a2a1 d8e8 a1a2 e8d8 a2a1";
    const STEP_MS = 100;
    const lastHanded = () => vi.mocked(chooseMove).mock.calls.at(-1)?.[1].priorKeys;
    const gameOf = (fen: string) => {
      const game = newGame(fen);
      for (const text of MOVES.split(" ")) {
        const move = legalMoves(game.position).find((m) => coordinateOf(m) === text);
        if (move === undefined) throw new Error(`fixture: ${text} is not legal`);
        playMove(game, move);
      }
      return game;
    };

''' + "".join("  " + l if l.strip() else l for l in row2.splitlines(True)) + '''  });

  describe("''' + D8 + ''' [deep, ENGINE_DEEP=1]", () => {
    const FEN = "4k3/7p/8/8/8/8/8/Q3K3 b - - 0 1";
    const MOVES = "h7h5 a1a2 e8d8 a2a1 d8e8 a1a2 e8d8 a2a1";
    const STEP_MS = 100;
    const labelOf = (move: { from: number; to: number }) =>
      `${squareName(move.from)}${squareName(move.to)}`;
    const gameOf = (fen: string) => {
      const game = newGame(fen);
      for (const text of MOVES.split(" ")) {
        const move = legalMoves(game.position).find((m) => labelOf(m) === text);
        if (move === undefined) throw new Error(`fixture: ${text} is not legal`);
        playMove(game, move);
      }
      return game;
    };
    const seamOf = (injected: typeof keyHistory) =>
      createLevelSeam(DEFAULT_LEVEL, { seed: 1, now: virtualClock(STEP_MS) }, injected);
    const scoreWith = (game: ReturnType<typeof gameOf>, list: typeof keyHistory) =>
      chooseMove(parseFen(toFen(game.position)), {
        budgetMs: LEVELS[DEFAULT_LEVEL].budgetMs,
        now: virtualClock(STEP_MS),
        priorKeys: trimPriorKeys(list(game), game.position.halfmoveClock),
      });

''' + "".join("  " + l if l.strip() else l for l in row8.splitlines(True)) + '''  });
}
'''
wr("uci-session", u)

# ---- R9 (S, option ii): the file gains ENGINE_DEEP's constant; remnant on 2 x ITERATIONS passes; full row deep
s = rd("engine.capacity")
H9 = '''  it("ends every line at ply 128 with a leaf's score once the deepening passes it: no node or key past it", () => {'''
a, e = cut(s, H9); row9 = s[a:e]
D9 = "ABC-122 A8: src/engine.ts's KEY_ARRAY_CAPACITY guard, reached through chooseMove()"
rem9 = row9.replace(H9, '''  // ABC-302 (secnfr-nfr008-1104, arch-ABC-302): a clock spent after 2 x ITERATIONS root passes stays in the default lane; PASSES runs under ENGINE_DEEP=1.
  it("on a clock spent after 2 x ITERATIONS (260) root passes, ends every line at ply 128 with a leaf's score: no node or key past it", () => {''', 1)
rem9 = rem9.replace("spy.iterationStarts.length < PASSES ? 0", "spy.iterationStarts.length < 2 * ITERATIONS ? 0", 1)
assert "2 * ITERATIONS ? 0" in rem9
s = s[:a] + rem9 + s[e:]
anchor = 'const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";\n'
s = s.replace(anchor, '/** `ABC-302` (`arch-ABC-302`, option ii): the existing `ENGINE_DEEP` variable; unset, the full row is not defined. */\nconst RUN_DEEP = process.env.ENGINE_DEEP === "1";\n\n' + anchor, 1)
s = s.rstrip("\n") + '''

if (RUN_DEEP) {
  describe("''' + D9 + ''' [deep, ENGINE_DEEP=1]", () => {
''' + "".join("  " + l if l.strip() else l for l in row9.splitlines(True)) + '''  });
}
'''
wr("engine.capacity", s)
print("tip sketch written")
