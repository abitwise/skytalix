import sys
P, O = sys.argv[1], sys.argv[2]
def ins(name, anchor, code, after=True):
    path = f"{P}/src/{name}.test.ts"
    s = open(f"{O}/{name}.test.ts.orig").read()
    assert s.count(anchor) == 1, (name, anchor)
    s = s.replace(anchor, anchor + code if after else code + anchor)
    open(path, "w").write(s)
OUT = O
# R1: per reading, both choosers
ins("search.null-move", "  const READINGS = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];\n", f'''
  it("PROBE281 R1 per reading", async () => {{
    const fs = await import("node:fs");
    const rows: string[] = [];
    for (const at of Array.from({{ length: 28 }}, (_, i) => i + 3)) {{
      for (const [tag, ch] of [["notaper", chooseMoveWithoutTaper], ["shipped", chooseMove]] as const) {{
        const t0 = performance.now();
        const r = sweep(fenOf("position-6"), [at], ch);
        const ms = performance.now() - t0;
        rows.push(`${{tag}}\\t${{at}}\\t${{r.insideNull}}\\t${{r.mutated.length}}\\t${{ms.toFixed(2)}}`);
      }}
    }}
    fs.writeFileSync(process.env.PROBE_OUT as string, rows.join("\\n") + "\\n");
  }});
''')
# R2: per position
ins("engine", '''  it("A4: an empty list is node-equal to an absent one over the endgames and the thirty", () => {''', f'''  it("PROBE281 R2 per position", async () => {{
    const fs = await import("node:fs");
    const rows: string[] = [];
    const corpus = [
      ...ENDGAME_CORPUS.map(({{ name, fen }}) => ({{ name, position: parseFen(fen) }})),
      ...thirtyPositions(),
    ];
    for (const {{ name, position }} of corpus) {{
      const fen = toFen(position);
      const t0 = performance.now();
      const absent = chooseMove(parseFen(fen), {{ budgetMs: 5, now: tickingClock(1) }});
      const empty = chooseMove(parseFen(fen), {{ budgetMs: 5, now: tickingClock(1), priorKeys: [] }});
      const ms = performance.now() - t0;
      const eq = JSON.stringify(figures(empty)) === JSON.stringify(figures(absent));
      rows.push(`${{name}}\\t${{eq ? "equal" : "DIFF"}}\\t${{ms.toFixed(2)}}`);
    }}
    fs.writeFileSync(process.env.PROBE_OUT as string, rows.join("\\n") + "\\n");
  }});

''', after=False)
ins("levels", '''describe("A9 — different seeds actually differ", () => {\n''', f'''  it("PROBE281 R3 per seed", async () => {{
    const fs = await import("node:fs");
    const rows: string[] = [];
    for (const seed of [1, 2, 3, 4, 5]) {{
      const t0 = performance.now();
      const choices = playAll(easiest, seed, THIRTY);
      const ms = performance.now() - t0;
      const draws = seededRandom(seed);
      let firstBad = -1;
      const kinds: string[] = [];
      choices.forEach((choice, k) => {{
        kinds.push(choice.kind === "engine" ? "e" : "b");
        if (firstBad < 0 && (choice.kind !== "engine") !== (draws() < easiest.blunderRate)) firstBad = k;
      }});
      rows.push(`${{seed}}\\t${{ms.toFixed(1)}}\\t${{firstBad}}\\t${{kinds.join("")}}`);
    }}
    fs.writeFileSync(process.env.PROBE_OUT as string, rows.join("\\n") + "\\n");
  }});
''')
