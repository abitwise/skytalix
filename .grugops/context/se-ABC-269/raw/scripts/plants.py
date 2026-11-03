# se-ABC-269 planted defects: each applied alone to the worktree, the named test files run, then reverted (git checkout).
import subprocess, sys, json
W = sys.argv[1]; L = sys.argv[2]
P = [
 ("P1 full-form blend (trunc((mg*w+eg*(D-w))/D))", "src/evaluate.ts",
  "  return mg + Math.trunc((egDelta * (PHASE_SPAN - w)) / PHASE_SPAN);",
  "  return Math.trunc((mg * w + (mg + egDelta) * (PHASE_SPAN - w)) / PHASE_SPAN);", ["src/evaluate.taper.test.ts"]),
 ("P2 Math.floor for trunc", "src/evaluate.ts",
  "  return mg + Math.trunc((egDelta * (PHASE_SPAN - w)) / PHASE_SPAN);",
  "  return mg + Math.floor((egDelta * (PHASE_SPAN - w)) / PHASE_SPAN);", ["src/evaluate.taper.test.ts"]),
 ("P3 no clamp to 24", "src/evaluate.ts",
  "  let w = (phase > 24 ? 24 : phase) - PHASE_EG;", "  let w = phase - PHASE_EG;\n  if (w > 99) w = 99;", ["src/evaluate.taper.test.ts"]),
 ("P4 king eg table one cell +1 (e4)", "src/evaluate-params.ts",
  "     -5, 10, 25, 40, 40, 25, 10, -5,\n    -20, -5, 10, 25, 25, 10, -5,-20,\n    -35",
  "     -5, 10, 25, 40, 41, 25, 10, -5,\n    -20, -5, 10, 25, 25, 10, -5,-20,\n    -35", ["src/evaluate.taper.test.ts"]),
 ("P5 passer eg = mg (no passer taper)", "src/evaluate-params.ts",
  "  eg: [0, 10, 20, 40, 70, 120, 200, 0],", "  eg: [0, 5, 10, 20, 35, 60, 100, 0],", ["src/evaluate.taper.test.ts"]),
 ("P6 searchWithoutTaper turns taper on", "src/search.ts",
  "    futility: true,\n    taper: false,\n  });", "    futility: true,\n    taper: true,\n  });", ["src/evaluate.taper.test.ts"]),
 ("P7 stand pat always tapered", "src/quiescence.ts",
  "rules.taper === true ? evaluate(position) : evaluateWithoutTaper(position)", "evaluate(position)", ["src/evaluate.taper.test.ts"]),
 ("P8 memo hit leaves the passed eg part stale", "src/evaluate.ts",
  "    passedEgPart = pawnCachePassedEg[slot] as number;\n", "", ["src/evaluate.pawns.test.ts", "src/evaluate.taper.test.ts"]),
 ("P9 king delta sign not flipped for black", "src/evaluate.ts",
  "        egDelta += black ? -delta : delta;", "        egDelta += delta;", ["src/evaluate.taper.test.ts"]),
 ("P10 queen phase weight 4 -> 3", "src/evaluate-params.ts",
  "export const PHASE_WEIGHT: readonly number[] = [0, 0, 1, 1, 2, 4, 0];", "export const PHASE_WEIGHT: readonly number[] = [0, 0, 1, 1, 2, 3, 0];", ["src/evaluate.taper.test.ts"]),
]
out = []
for name, f, old, new, tests in P:
    path = f"{W}/{f}"; s = open(path).read()
    n = s.count(old)
    if n < 1: out.append({"plant": name, "applied": False}); continue
    open(path, "w").write(s.replace(old, new, 1))
    try:
        env = "NODE_OPTIONS=--max-old-space-size=128" if len(tests) > 1 else "NODE_OPTIONS=--max-old-space-size=400"
        r = subprocess.run(f"cd {W} && {env} flock {L} timeout 300 npx vitest run {' '.join(tests)} 2>&1 | grep -E 'Tests |FAIL ' | head -6", shell=True, capture_output=True, text=True)
        lines = r.stdout.strip().split("\n")
        out.append({"plant": name, "applied": True, "tests": lines[-1].strip() if lines else "", "first_red": next((l.strip() for l in lines if "FAIL" in l), "")[:220]})
    finally:
        subprocess.run(["git", "-C", W, "checkout", "--", f])
    print(json.dumps(out[-1]), flush=True)
