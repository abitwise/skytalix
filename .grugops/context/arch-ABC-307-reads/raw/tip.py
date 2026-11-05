# tip.py <tree> <orig> : the arch-ABC-307-reads tip sketch. ADR-0046 § Dated 2026-11-05 (arch-ABC-307)'s forms: nine rows S.
# Moved bodies are cut from the originals byte-for-byte, re-indented only. Nothing here reaches the repository.
import sys
P, O = sys.argv[1], sys.argv[2]
def rd(path): return open(f"{O}/{path.replace('/', '__')}").read()
def wr(path, s): open(f"{P}/{path}", "w").write(s)
def cut(s, header, indent="  "):
    assert s.count(header) == 1, header[:70]
    a = s.index(header); i = a
    while True:
        j = s.index("\n", i) + 1
        line = s[j:s.index("\n", j)]
        if line.startswith(indent + "});") or (line.startswith(indent + "}, ") and line.endswith(");")):
            return a, s.index("\n", j) + 1
        i = j
def ind(row, n): return "".join(" " * n + l if l.strip() else l for l in row.splitlines(True))
def sub1(s, old, new):
    assert s.count(old) == 1, old[:70]
    return s.replace(old, new)

CLI, UCI, BOOK, QE = "src/cli.test.ts", "src/uci-session.test.ts", "src/book.test.ts", "tools/grugops/qe-hop-integrity.test.ts"

# ---- src/cli.test.ts: L1, L2, L3 --------------------------------------------------------------------------
c = rd(CLI)
H_L1 = '  it("A8′ — the seam built for each level moves exactly as `createLevel` does, on one seed and one injected clock", async () => {'
a, e = cut(c, H_L1); L1 = c[a:e]
L1r = L1.replace(H_L1, '  it("A8′ (sample) — levels 1 and the default: the seam moves exactly as `createLevel` does, on one seed and one injected clock", async () => {')
L1r = sub1(L1r, "    for (const word of LEVEL_WORDS) {", '    for (const word of ["1", String(DEFAULT_LEVEL)]) {')
c = c[:a] + "  // ABC-307 (secnfr-census-1105, arch-ABC-307): two levels stay here; every level runs in src/uci-session.test.ts under ENGINE_DEEP=1.\n" + L1r + c[e:]
H_L2 = '  it("A4: with a legal ep capture available the same line is not a draw", () => {'
a, e = cut(c, H_L2); L2 = c[a:e]
L2r = '''  it("A4 (no search): with a legal ep capture available the two key lists are equal; on the uncapturable line they are not", () => {
    const twin = gameOf(TWIN);
    expect(repetitionKeyHistory(twin)).toEqual(keyHistory(twin));
    const game = gameOf(FEN);
    expect(repetitionKeyHistory(game)).not.toEqual(keyHistory(game));
  });
'''
c = c[:a] + L2r + c[e:]
H_L3 = '  it("A7: the move the search scores 0 is the move after which gameStatusOf reports the claim", async () => {'
a, e = cut(c, H_L3); L3 = c[a:e]
L3r = L3.replace(H_L3, '  it("A7 (no search): after d8e8, the move A4 (slice) pins, gameStatusOf reports the claim", () => {')
L3r = sub1(L3r, "    const move = await seamOf(repetitionKeyHistory)(game);\n",
  '    const move = legalMoves(game.position).find((m) => labelOf(m) === "d8e8");\n    if (move === undefined) throw new Error("fixture: d8e8 is not legal");\n')
c = c[:a] + L3r + c[e:]
c = sub1(c, "  // `ABC-244` (`ADR-0046` § Addendum 2026-10-30): 100 kept; at 1 000 A4 and A7 lose a mutant.\n  const STEP_MS = 100;\n  const labelOf = (move: { from: number; to: number }) =>\n    `${squareName(move.from)}${squareName(move.to)}`;\n  const gameOf = (fen: string): GameHistory => {",
            "  const labelOf = (move: { from: number; to: number }) =>\n    `${squareName(move.from)}${squareName(move.to)}`;\n  const gameOf = (fen: string): GameHistory => {")
c = sub1(c, """  const seamOf = (injected: typeof keyHistory) =>
    createLevelSeam(DEFAULT_LEVEL, { seed: 1, now: virtualClock(STEP_MS) }, injected);
  const scoreWith = (game: GameHistory, list: typeof keyHistory) =>
    chooseMove(parseFen(toFen(game.position)), {
      budgetMs: LEVELS[DEFAULT_LEVEL].budgetMs,
      now: virtualClock(STEP_MS),
      priorKeys: trimPriorKeys(list(game), game.position.halfmoveClock),
    });

  // ABC-302""", "  // ABC-302")
wr(CLI, c)

# ---- src/uci-session.test.ts: C1, C2 in place; five deep describes at the end -------------------------------
u = rd(UCI)
u = sub1(u, 'import { keyHistory, newGame, playMove, repetitionKeyHistory } from "./history.ts";',
            'import { gameStatusOf, keyHistory, newGame, playMove, repetitionKeyHistory } from "./history.ts";')
H_C1 = '  it("two sessions on the same seededRandom(k) write the same bestmove sequence", () => {'
a, e = cut(u, H_C1); C1 = u[a:e]
C1r = '''  // ABC-307 (secnfr-census-1105, arch-ABC-307): the first two gos stay here; all three, and seed 3, run under ENGINE_DEEP=1.
  it("two sessions on seededRandom(2), over the first two gos (a blunder, then the engine), write the same bestmove sequence", () => {
    const [blunder, engine] = firstDraws(2, 2) as [number, number];
    expect(blunder).toBeLessThan(LEVELS[1].blunderRate);
    expect(engine).toBeGreaterThanOrEqual(LEVELS[1].blunderRate);
    const first = levelOneMoves(2);
    expect(first).toHaveLength(2);
    expect(levelOneMoves(2)).toEqual(first);
  });
'''
u = u[:a] + C1r + u[e:]
# the default describe's helper reads the first two gos; the deep describe repeats the original
a0 = u.index('describe("ABC-171 A7 — the blunder path", () => {')
gs = u.index("  const goes = [", a0); ge = u.index("  ];\n", gs) + 5
GOES = u[gs:ge]
ls = u.index("  /** The bestmove sequence of level 1 under `seededRandom(k)`", a0); le = u.index('  it("precondition: seededRandom(2)', a0)
LOM = u[ls:le]
u = u[:ls] + LOM.replace("    for (const line of goes) {", "    for (const line of goes.slice(0, 4)) {") + u[le:]
H_C2 = '  it("setoption name Skill Level value 7 sets 7: a bare go searches 30 000 ms", () => {'
a, e = cut(u, H_C2); C2 = u[a:e]
C2r = '''  // ABC-307 (secnfr-census-1105, arch-ABC-307): the budget handed stays here; the 30 000 ms search runs under ENGINE_DEEP=1.
  it("setoption name Skill Level value 7 sets 7: a bare go hands the engine 30 000 ms", () => {
    const { handed, setupLines } = budgetAt(["setoption name Skill Level value 7"], "go");
    expect(setupLines).toEqual([[]]);
    expect(handed).toEqual({ budgetMs: 30_000 });
  });
'''
u = u[:a] + C2r + u[e:]
sa = u.index("  /** One fresh session at `level`, step G ÷ 30;"); se = u.index("  /**\n   * `A12`'s budget-read arm", sa)
SEARCH_AT = u[sa:se]
deep = '''
// ABC-307 (secnfr-census-1105, arch-ABC-307): five full rows, each under ENGINE_DEEP=1 only. Three are src/cli.test.ts's;
// this file's engine spy calls through, and each describe here installs no stub.
if (RUN_ENGINE_DEEP) {
  describe("ABC-171 A7 — the blunder path [deep, ENGINE_DEEP=1]", () => {
''' + ind(GOES, 2) + "\n" + ind(LOM, 2) + ind(C1, 2) + '''  });

  describe("ABC-212 A9 — Skill Level reaches 7, and levels 6-7 take the rate-0 path [deep, ENGINE_DEEP=1]", () => {
''' + ind(SEARCH_AT, 2) + ind(C2, 2) + '''  });

  describe("ABC-101 — --difficulty selects a level, and the played engine is that level [deep, ENGINE_DEEP=1]", () => {
    const LEVEL_WORDS = Object.keys(LEVELS);
    const startGame = () => newGame(START_FEN);

''' + ind(L1, 2) + '''  });

  describe("ABC-241 A4, A7 — the CLI: the ep twin and the claim [deep, ENGINE_DEEP=1]", () => {
    const FEN = "4k3/7p/8/8/8/8/8/Q3K3 b - - 0 1";
    const TWIN = "4k3/7p/8/6P1/8/8/8/Q3K3 b - - 0 1";
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

''' + ind(L2, 2) + "\n" + ind(L3, 2) + '''  });
}
'''
wr(UCI, u + deep)

# ---- src/book.test.ts: B1 (k comes from raw/b1-k.mjs, read after the seal; B1_K in the environment) ----------
import os
K = os.environ.get("B1_K", "10")
b = rd(BOOK)
H_B1 = '  it("ten seeds, one pick each, at least 3 distinct replies", () => {'
a, e = cut(b, H_B1); B1 = b[a:e]
B1r = B1.replace(H_B1, f'  it("seeds 1 to {K}, one pick each, at least 3 distinct replies", () => {{')
B1r = sub1(B1r, "    for (let seed = 1; seed <= 10; seed++) {", f"    for (let seed = 1; seed <= {K}; seed++) {{")
# the describe closes right after the row; the deep describe follows it
close = b.index("});\n", e) + 4
b = (b[:a] + "  // ABC-307 (secnfr-census-1105, arch-ABC-307): the seeds that reach three replies stay here; all ten run under ENGINE_DEEP=1.\n" + B1r + b[e:close]
     + '''
// ABC-307 (secnfr-census-1105, arch-ABC-307): reached only by its -t line. ENGINE_DEEP names no engine here.
const RUN_DEEP = process.env.ENGINE_DEEP === "1";
if (RUN_DEEP) {
  describe("ABC-094 A3 — variety after 1. e4 on seeds 1 to 10 [deep, ENGINE_DEEP=1]", () => {
''' + ind(B1, 2) + '''  });
}
''' + b[close:])
wr(BOOK, b)

# ---- tools/grugops/qe-hop-integrity.test.ts: the trio -------------------------------------------------------
q = rd(QE)
q = sub1(q, "  chmodSync,\n  mkdirSync,", "  chmodSync,\n  cpSync,\n  mkdirSync,")
q = sub1(q, 'import { afterEach, describe, expect, it, vi } from "vitest";', 'import { afterAll, afterEach, describe, expect, it, vi } from "vitest";')
q = sub1(q, 'const plainSweep = () => (plainSweepOnce ??= run(["--sweep"]));\n', '''const plainSweep = () => (plainSweepOnce ??= run(["--sweep"]));

// ABC-307 (secnfr-census-1105, arch-ABC-307): the whole-tree reads run under ENGINE_DEEP=1 only. No engine is involved.
const RUN_DEEP = process.env.ENGINE_DEEP === "1";
/** ABC-031's and ABC-072's controls, ABC-062's and ABC-073's traps: the folders the remnants read. */
const NAMED = (folder: string) => /abc-?0*(31|62|66|72|73)(?!\\d)/i.test(folder);
let namedRootOnce: string | undefined;
/** A temp root: the real board and snapshot, and the named folders' real notes. A plain sweep runs on it. */
const namedRoot = () => {
  if (namedRootOnce !== undefined) return namedRootOnce;
  const root = mkdtempSync(join(tmpdir(), "qe-hop-named-"));
  mkdirSync(join(root, "plans"));
  cpSync(join(ROOT, "plans/board.md"), join(root, "plans/board.md"));
  cpSync(SNAPSHOT_FILE, join(root, ".grugops/qe-cutover-2026-08-17.txt"));
  const context = join(ROOT, ".grugops/context");
  cpSync(context, join(root, ".grugops/context"), {
    recursive: true,
    filter: (source) => {
      const [folder, part] = source.slice(context.length + 1).split("/");
      return !folder || (NAMED(folder) && (part === undefined || part === "notes"));
    },
  });
  namedRootOnce = root;
  return root;
};
afterAll(() => {
  if (namedRootOnce !== undefined) rmSync(namedRootOnce, { recursive: true, force: true });
});
''')
# Q2
H_Q2 = '  it("coverage() over EVERY real note (no --ticket folder filter) reads ABC-062 and ABC-073 as findings", () => {'
a, e = cut(q, H_Q2); Q2 = q[a:e]
Q2r = '''  it("coverage() over the named folders' real notes reads ABC-062 and ABC-073 as findings", () => {
    const named = readNotes(join(ROOT, ".grugops/context"), NAMED);
    expect(coverage("ABC-031", named, snapshotIds).status).toBe("covered (qe-e2e)");
    expect(coverage("ABC-072", named, snapshotIds).status).toBe(
      "covered (security-nfr substitute — docs-only rule)",
    );
    expect(coverage("ABC-062", named, minus("ABC-062")).status).toBe("finding");
    expect(snapshotIds).not.toContain("ABC-073");
    expect(coverage("ABC-073", named, snapshotIds).status).toBe("finding");
  });
'''
q = q[:a] + Q2r + q[e:]
close = q.index("});\n", q.index(Q2r) + len(Q2r)) + 4
q = q[:close] + '''
if (RUN_DEEP) {
  describe("ABC-105 A3 — the refs-only false pass is closed (real notes) [deep, ENGINE_DEEP=1]", () => {
''' + ind(Q2, 2) + '''  });
}
''' + q[close:]
# Q1
H_Q1 = '  it("--sweep lists ABC-073 as a finding", () => {'
a, e = cut(q, H_Q1); Q1 = q[a:e]
Q1r = '''  it("--sweep on a copy of the named folders lists ABC-073 as a finding, with its trap in the copy", () => {
    const root = namedRoot();
    const trap = readNotes(join(root, ".grugops/context"), (f) => f === "secnfr-ABC-072");
    expect(trap.some((n) => n.kind === "decision" && n.refs.some((ref) => ref.includes("ABC-073")))).toBe(true);
    const r = run(["--sweep"], { root });
    expect(r.code).toBe(1);
    expect(r.stdout).toContain("  ABC-073: no QE verdict note was found.\\n");
    expect(r.stdout).not.toContain("  ABC-031: no QE verdict note was found.");
    expect(r.stdout).not.toContain("  ABC-072: no QE verdict note was found.");
  });
'''
q = q[:a] + Q1r + q[e:]
close = q.index("});\n", q.index(Q1r) + len(Q1r)) + 4
q = q[:close] + '''
if (RUN_DEEP) {
  describe("ABC-105 A9 — the security-nfr substitute is visible, not silent (real notes) [deep, ENGINE_DEEP=1]", () => {
''' + ind(Q1, 2) + '''  });
}
''' + q[close:]
# Q3
H_Q3 = '  it("prints each count line and every finding by id, exits 1; 0 when every row is grandfathered", () => {'
a, e = cut(q, H_Q3); Q3 = q[a:e]
Q3r = Q3.replace(H_Q3, '  it("on a copy of the named folders: prints each count line and every finding by id, exits 1; 0 when every row is grandfathered", () => {\n    const root = namedRoot();')
Q3r = sub1(Q3r, '    const r = run(["--sweep", "--json"], { notes: allNotes() });', '    const r = run(["--sweep", "--json"], { root });')
Q3r = sub1(Q3r, "    const text = plainSweep();", '    const text = run(["--sweep"], { root });')
Q3r = sub1(Q3r, '    expect(run(["--sweep"], { notes: allNotes(), snapshotIds: parseDone(board) ?? [] }).code).toBe(\n      0,\n    );',
                '    expect(run(["--sweep"], { root, snapshotIds: parseDone(board) ?? [] }).code).toBe(0);')
q = q[:a] + Q3r + q[e:]
close = q.index("});\n", q.index('  it("parses only the line-leading')) + 0
close = q.index("\n});\n", q.index('  it("parses only the line-leading')) + 5
q = q[:close] + '''
if (RUN_DEEP) {
  describe("ABC-105 A4 — the sweep's counts partition the Done rows (real board) [deep, ENGINE_DEEP=1]", () => {
''' + ind(Q3, 2) + '''  });
}
''' + q[close:]
wr(QE, q)
print("tip sketch written, B1_K", K)
