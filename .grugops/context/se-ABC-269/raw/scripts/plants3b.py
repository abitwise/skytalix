# se-ABC-269 planted defects: each applied alone to the worktree, the named test files run, then reverted (git checkout).
import subprocess, sys, json
W = sys.argv[1]; L = sys.argv[2]
P = [
 ("P3b no upper clamp at all (neither 24 nor D)", "src/evaluate.ts",
  "  let w = (phase > 24 ? 24 : phase) - PHASE_EG;\n  if (w < 0) w = 0;\n  else if (w > PHASE_SPAN) w = PHASE_SPAN;",
  "  let w = phase - PHASE_EG;\n  if (w < 0) w = 0;", ["src/evaluate.taper.test.ts"]),
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
