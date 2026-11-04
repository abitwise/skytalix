# Unmutated probe reads (no mutant applied): appends one PROBE302 `it` to scratch copies of the test files.
import sys
P, O = sys.argv[1], sys.argv[2]
def app(name, code, anchor=None):
    s = open(f"{O}/{name}.test.ts.orig").read()
    if anchor is None:
        s = s + "\n" + code
    else:
        assert s.count(anchor) == 1, (name, anchor)
        s = s.replace(anchor, code + anchor)
    open(f"{P}/src/{name}.test.ts", "w").write(s)
W = 'const fs = await import("node:fs"); const rows: string[] = []; const t = () => performance.now();'
END = 'fs.writeFileSync(process.env.PROBE_OUT as string, rows.join("\\n") + "\\n");'
app("search.null-move", f'''
describe("PROBE302 R1", () => {{
  it("PROBE302 R1 per root", async () => {{
    {W}
    const IN_CHECK_ROOT = "r3k2r/p1pp1pb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBqPPP/R3K2R w KQkq - 0 2";
    for (const {{ name, fen }} of [...ROOTS, {{ name: "in-check", fen: IN_CHECK_ROOT }}]) {{
      for (const d of [3, 4]) {{
        let t0 = t(); const s = nullMovesDuring(() => search(parseFen(fen), d)); const ms1 = t() - t0;
        t0 = t(); const c = nullMovesDuring(() => deepenTo(chooseMove, fen, d)); const ms2 = t() - t0;
        rows.push(`${{name}}\\td${{d}}\\tsearch ${{s.length}} ${{ms1.toFixed(1)}}ms\\tchoose ${{c.length}} ${{ms2.toFixed(1)}}ms`);
      }}
    }}
    {END}
  }});
}});
''')
app("search.futility", f'''
describe("PROBE302 R3", () => {{
  it("PROBE302 R3 depth 3 and 4", async () => {{
    {W}
    for (const name of ["position-6", "kiwipete", "startpos"]) {{
      const fen = fenOf(name);
      for (const d of [2, 3, 4]) {{
        let t0 = t();
        const head = search(parseFen(fen), d).nodes; const door = searchWithoutFutility(parseFen(fen), d).nodes;
        const ms1 = t() - t0; t0 = t();
        const hc = deepenTo(chooseMove, fen, d).nodes; const dc = deepenTo(chooseMoveWithoutFutility, fen, d).nodes;
        const ms2 = t() - t0;
        rows.push(`${{name}}\\td${{d}}\\tsearch ${{head}}/${{door}} ${{ms1.toFixed(1)}}ms\\tchoose ${{hc}}/${{dc}} ${{ms2.toFixed(1)}}ms`);
      }}
    }}
    {END}
  }});
}});
''')
app("zobrist", f'''
describe("PROBE302 R4", () => {{
  it("PROBE302 R4 depth 1 and 2", async () => {{
    {W}
    for (const d of [1, 2]) {{
      const t0 = t(); let checked = 0; let carried = 0;
      for (const [, fen] of PERFT_POSITIONS) {{ const w = checkEpComponent(parseFen(fen), d); checked += w.checked; carried += w.ep; }}
      rows.push(`d${{d}}\\tchecked ${{checked}}\\tcarried ${{carried}}\\t${{(t() - t0).toFixed(1)}}ms`);
    }}
    {END}
  }});
}});
''')
app("engine", f'''
  it("PROBE302 R5 steps", async () => {{
    {W}
    for (const step of [2_500, 10_000, 15_000, 20_000, 30_000]) {{
      const without = countingClock(step, 64); const withCap = countingClock(step, 64);
      const startpos = () => parseFen(fenOf("startpos"));
      const t0 = t();
      const a = chooseMove(startpos(), {{ budgetMs: Number.POSITIVE_INFINITY, now: without.now }});
      const b = chooseMove(startpos(), {{ budgetMs: Number.POSITIVE_INFINITY, now: withCap.now, maxDepth: 1000 }});
      rows.push(`step ${{step}}\\tconsult ${{without.consultations}}/${{withCap.consultations}}\\tdepth ${{a?.depth}}/${{b?.depth}}\\tnodes ${{a?.nodes}}\\t${{(t() - t0).toFixed(1)}}ms\\teq ${{JSON.stringify(a) === JSON.stringify(b)}}`);
    }}
    {END}
  }});
''', anchor='''  it("on an infinite budget, maxDepth 1000 returns within the same consultation count", () => {''')

app("levels", f"""
describe("PROBE302 R6 R7", () => {{
  it("PROBE302 R6 R7", async () => {{
    {W}
    for (const n of [5, 10, 15]) {{
      const t0 = t(); const first = decisions(playAll(easiest, 2026, THIRTY.slice(0, n)));
      const again = decisions(playAll(easiest, 2026, THIRTY.slice(0, n)));
      rows.push(`R6 first ${{n}}\\tblunders ${{first.filter((d) => d.startsWith("B:")).length}}\\teq ${{JSON.stringify(first) === JSON.stringify(again)}}\\t${{(t() - t0).toFixed(1)}}ms`);
    }}
    const level = LEVELS[DEFAULT_LEVEL]; const step = level.budgetMs / 3;
    for (const [seed, n] of [[1, 10], [87, 10], [1, 30], [87, 30]] as const) {{
      const t0 = t();
      const fens = THIRTY.slice(0, n);
      const ref = fens.map((fen) => chooseMove(parseFen(fen), {{ budgetMs: 4_000, now: virtualClock(step) }}));
      let eq = 0;
      fens.forEach((fen, i) => {{ const v = createLevel(level, {{ seed, now: virtualClock(step) }})(parseFen(fen)); const r = ref[i];
        if (v && r && v.kind === "engine" && label(v.move) === label(r.move) && v.depth === r.depth && v.nodes === r.nodes) eq++; }});
      const draws = seededRandom(seed); const low = Array.from({{ length: n }}, () => draws()).map((x, i) => [i, x] as const).filter(([, x]) => x < 0.05).map(([i, x]) => `${{i}}:${{x.toFixed(3)}}`);
      rows.push(`R7 seed ${{seed}} first ${{n}}\\teq ${{eq}}\\tdraws<0.05 ${{low.join(",")}}\\t${{(t() - t0).toFixed(1)}}ms`);
    }}
    {END}
  }});
}});
""")
app("engine.capacity", f"""
describe("PROBE302 R9", () => {{
  it("PROBE302 R9 passes", async () => {{
    {W}
    for (const n of [0, 130, 131, 135, 140, 150]) {{
      Object.assign(spy, {{ deepestPly: 0, keyWrites: 0, iterationStarts: [] }});
      const limit = n === 0 ? PASSES : n;
      const now = () => (spy.iterationStarts.length < limit ? 0 : Number.MAX_SAFE_INTEGER);
      const t0 = t();
      const choice = chooseMove(parseFen(START), {{ budgetMs: 1_000, now }});
      const ms = t() - t0;
      rows.push(`limit ${{limit}}\\tpasses ${{spy.iterationStarts.length}}\\tdepth ${{choice?.depth}}\\tdeepest ${{spy.deepestPly}}\\tmaxWrites ${{Math.max(...writesPerIteration())}}\\t${{ms.toFixed(1)}}ms`);
    }}
    const t1 = t(); const leaf = leafScoreAtCapacity(); rows.push(`leaf ${{leaf}} ${{(t() - t1).toFixed(1)}}ms`);
    {END}
  }});
}});
""")
app("uci-session", f"""
  it("PROBE302 R2 coarse", async () => {{
    {W}
    for (const s of [100, 1_000, 2_000, 4_000]) {{
      const t0 = t();
      const game = gameOf(FEN);
      const seam = createLevelSeam(DEFAULT_LEVEL, {{ seed: 1, now: virtualClock(s) }}, repetitionKeyHistory);
      const cli = coordinateOf(await seam(game));
      const fromCli = lastHanded();
      const {{ perLine }} = talk([`position fen ${{FEN}} moves ${{MOVES}}`, "go"], s);
      rows.push(`step ${{s}}\\teq ${{JSON.stringify(lastHanded()?.map(String)) === JSON.stringify(fromCli?.map(String))}}\\tlen ${{fromCli?.length}}\\tcli ${{cli}}\\t${{perLine[1]?.at(-1)}}\\t${{perLine[1]?.[0]}}\\t${{(t() - t0).toFixed(1)}}ms`);
    }}
    {END}
  }});

""", anchor='''  it("A5: the CLI level seam's injected list equals UCI's, key for key, and both play d8e8", async () => {''')
app("cli", f"""
  it("PROBE302 R8 coarse", async () => {{
    {W}
    for (const s of [100, 1_000, 4_000]) {{
      const t0 = t();
      const game = gameOf(FEN);
      const move = labelOf(await createLevelSeam(DEFAULT_LEVEL, {{ seed: 1, now: virtualClock(s) }}, repetitionKeyHistory)(game));
      const ms1 = t() - t0;
      const t1 = t();
      const direct = chooseMove(parseFen(toFen(game.position)), {{ budgetMs: LEVELS[DEFAULT_LEVEL].budgetMs, now: virtualClock(s), priorKeys: trimPriorKeys(repetitionKeyHistory(game), game.position.halfmoveClock) }});
      const hash = chooseMove(parseFen(toFen(game.position)), {{ budgetMs: LEVELS[DEFAULT_LEVEL].budgetMs, now: virtualClock(s), priorKeys: trimPriorKeys(keyHistory(game), game.position.halfmoveClock) }});
      rows.push(`step ${{s}}\\tseam ${{move}} ${{ms1.toFixed(1)}}ms\\tdirect ${{direct && labelOf(direct.move)}} ${{direct?.score}} d${{direct?.depth}}\\thash ${{hash?.score}} d${{hash?.depth}}\\t${{(t() - t1).toFixed(1)}}ms`);
    }}
    {END}
  }});

""", anchor='''  it("A4: with repetitionKeyHistory injected the default level plays d8e8 at exactly 0; base does not", async () => {''')
