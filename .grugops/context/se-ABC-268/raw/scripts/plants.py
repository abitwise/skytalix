# se-ABC-268 planted defects: apply one, run the futility file (default lane), record red/green, revert.
import json, subprocess, sys, os
W = "/home/olger/projects/public/skytalix/.claude/worktrees/se-ABC-268"
S = "/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad"
L = S + "/host-test.lock"
PLANTS = [
  ("margin-compare-off-by-one (<= -> <)", "src/search.ts", "FUTILITY_MARGIN[depth] as number) <= alphaIn;", "FUTILITY_MARGIN[depth] as number) < alphaIn;"),
  ("margin-value-off-by-one (350 -> 351)", "src/search.ts", "= [0, 150, 350, 550];", "= [0, 150, 351, 550];"),
  ("margin-index-off-by-one (M[depth-1])", "src/search.ts", "(FUTILITY_MARGIN[depth] as number) <= alphaIn", "(FUTILITY_MARGIN[depth - 1] as number) <= alphaIn"),
  ("guard-root dropped", "src/search.ts", "if (ply === 0 || alphaIn + 1 !== beta) return false;", "if (alphaIn + 1 !== beta) return false;"),
  ("guard-null-window dropped", "src/search.ts", "if (ply === 0 || alphaIn + 1 !== beta) return false;", "if (ply === 0) return false;"),
  ("guard-depth-0 dropped", "src/search.ts", "if (depth < 1 || depth > 3) return false;", "if (depth > 3) return false;"),
  ("guard-depth-4: range widened to 4 with a 750 margin", "src/search.ts", "if (depth < 1 || depth > 3) return false;", "if (depth < 1 || depth > 4) return false;\n  const _m4 = [0, 150, 350, 550, 750];\n  if (!isInCheck(position) && depth === 4 && alphaIn < MATE_FLOOR && alphaIn > 0 - MATE_FLOOR && beta < MATE_FLOOR && beta > 0 - MATE_FLOOR) return evaluate(position) + (_m4[4] as number) <= alphaIn;"),
  ("guard-alpha-band dropped", "src/search.ts", "  if (alphaIn >= MATE_FLOOR || alphaIn <= 0 - MATE_FLOOR) return false;\n", ""),
  ("guard-beta-band dropped", "src/search.ts", "  if (beta >= MATE_FLOOR || beta <= 0 - MATE_FLOOR) return false;\n", ""),
  ("guard-in-check dropped", "src/search.ts", "  if (isInCheck(position)) return false;\n  return evaluate(position) + (FUTILITY_MARGIN", "  return evaluate(position) + (FUTILITY_MARGIN"),
  ("guard-band edge (> instead of >=)", "src/search.ts", "if (alphaIn >= MATE_FLOOR || alphaIn <= 0 - MATE_FLOOR) return false;", "if (alphaIn > MATE_FLOOR || alphaIn < 0 - MATE_FLOOR) return false;"),
  ("move-index-0 clause dropped", "src/search.ts", "  if (index < 1) return false;\n", ""),
  ("move-capture clause dropped", "src/search.ts", "if (move.captured !== EMPTY || move.promotion !== EMPTY) return false;", "if (move.promotion !== EMPTY) return false;"),
  ("move-promotion clause dropped", "src/search.ts", "if (move.captured !== EMPTY || move.promotion !== EMPTY) return false;", "if (move.captured !== EMPTY) return false;"),
  ("move-gives-check clause dropped", "src/search.ts", "  return !givesCheck(position, move);\n}", "  return true;\n}"),
  ("wiring: search.ts skip without advancing the index", "src/search.ts", "    if (futile && futileMove(position, move, index)) {\n      index++;\n      continue;", "    if (futile && futileMove(position, move, index)) {\n      continue;"),
  ("wiring: engine.ts current alpha in place of the entry window", "src/engine.ts", "futilityNode(position, remaining, ply, alphaIn, beta)", "futilityNode(position, remaining, ply, alpha, beta)"),
  ("wiring: engine.ts switch unwired (rule never tested)", "src/engine.ts", "const futile = budget.futility && futilityNode(position, remaining, ply, alphaIn, beta);", "const futile = false && budget.futility && futilityNode(position, remaining, ply, alphaIn, beta);"),
  ("wiring: engine.ts remaining - 1", "src/engine.ts", "futilityNode(position, remaining, ply, alphaIn, beta)", "futilityNode(position, remaining - 1, ply, alphaIn, beta)"),
  ("door: searchWithoutFutility futility true", "src/search.ts", "    quietPromotions: true,\n    futility: false,\n  });", "    quietPromotions: true,\n    futility: true,\n  });"),
  ("door: older door chooseMoveWithoutNullMove futility true", "src/engine.ts", "    nullMove: false,\n    priorKeys: false,\n    quiescenceEvasions: false,\n    quietPromotions: false,\n    futility: false,\n  });\n}\n\n/**\n * TEST-ONLY. `chooseMove` with the `ABC-121`", "    nullMove: false,\n    priorKeys: false,\n    quiescenceEvasions: false,\n    quietPromotions: false,\n    futility: true,\n  });\n}\n\n/**\n * TEST-ONLY. `chooseMove` with the `ABC-121`"),
]
only = sys.argv[1:] 
out = []
for i, (name, path, old, new) in enumerate(PLANTS):
    if only and str(i) not in only: continue
    p = os.path.join(W, path)
    src = open(p).read()
    if src.count(old) != 1:
        out.append(f"P{i} {name}: SETUP ERROR count={src.count(old)}"); print(out[-1], flush=True); continue
    open(p, "w").write(src.replace(old, new))
    try:
        rj = f"{S}/se268out/plant-{i}.json"
        cmd = ["flock", L, "timeout", "300", "env", "NODE_OPTIONS=--max-old-space-size=128", "./node_modules/.bin/vitest", "run",
               "src/search.futility.test.ts", "src/search.null-move.test.ts", "src/quiescence.test.ts",
               "--reporter=json", f"--outputFile={rj}"]
        r = subprocess.run(cmd, cwd=W, capture_output=True, text=True)
        try:
            d = json.load(open(rj))
            fails = [a["fullName"] for t in d["testResults"] for a in t["assertionResults"] if a["status"] == "failed"]
            line = f"P{i} {name}: exit {r.returncode}; {d['numFailedTests']} failed / {d['numTotalTests']}; " + ("RED" if fails else ("NO TESTS RAN" if d["numTotalTests"] == 0 else "GREEN (not caught)"))
            out.append(line); print(line, flush=True)
            for f in fails[:6]: print("    - " + f[:200], flush=True)
        except Exception as e:
            out.append(f"P{i} {name}: exit {r.returncode}; no json ({e}); stderr {r.stderr[-300:]}"); print(out[-1], flush=True)
    finally:
        open(p, "w").write(src)
print("restored; git diff below")
print(subprocess.run(["git", "status", "--short", "src"], cwd=W, capture_output=True, text=True).stdout)
