# se-ABC-269-cut planted defects (decision a0468a78 P5): each applied ALONE to an isolated copy ($C/plant),
# the named test files run under the host lock, the file restored from the clean worktree copy.
import subprocess, sys, json, shutil
P, W, L = sys.argv[1], sys.argv[2], sys.argv[3]
PLANTS = [
 ("1 phaseAfterMove without its promotion term", "src/evaluate.ts",
  "    phase - (PHASE_WEIGHT[move.captured & 7] as number) + (PHASE_WEIGHT[move.promotion] as number)\n",
  "    phase - (PHASE_WEIGHT[move.captured & 7] as number)\n", True),
 ("2 phaseAfterMove without its capture term", "src/evaluate.ts",
  "    phase - (PHASE_WEIGHT[move.captured & 7] as number) + (PHASE_WEIGHT[move.promotion] as number)\n",
  "    phase + (PHASE_WEIGHT[move.promotion] as number)\n", True),
 ("3 tapered stand pat reads the self-walking evaluate(position)", "src/quiescence.ts",
  "rules.taper === true ? evaluateAtPhase(position, phase) : evaluateWithoutTaper(position);",
  "rules.taper === true ? evaluate(position) : evaluateWithoutTaper(position);", False),
 ("4 post-walk king delta unsigned for black", "src/evaluate.ts",
  "    egDelta -= KING_EG_DELTA[(blackKing >> 4) * 8 + (blackKing & 7)] as number;",
  "    egDelta += KING_EG_DELTA[(blackKing >> 4) * 8 + (blackKing & 7)] as number;", False),
]
out = []
for name, f, old, new, b0 in PLANTS:
    path = f"{P}/{f}"; s = open(path).read()
    if s.count(old) != 1: out.append({"plant": name, "applied": False}); continue
    s2 = s.replace(old, new)
    if f == "src/quiescence.ts":
        s2 = s2.replace('import { evaluateAtPhase,', 'import { evaluate, evaluateAtPhase,')
    open(path, "w").write(s2)
    try:
        r = subprocess.run(f"cd {P} && NODE_OPTIONS=--max-old-space-size=400 flock {L} timeout 600 npx vitest run src/evaluate.taper.test.ts 2>&1 | grep -E 'Tests |✗|×' | head -12", shell=True, capture_output=True, text=True)
        lines = [l.strip() for l in r.stdout.strip().split("\n") if l.strip()]
        rec = {"plant": name, "applied": True, "tests": next((l for l in lines if l.startswith("Tests")), ""), "red_rows": [l[:160] for l in lines if not l.startswith("Tests")][:8]}
        if b0:
            r2 = subprocess.run(f"cd {P} && flock {L} timeout 1200 node {P}/../b0one.ts {P}", shell=True, capture_output=True, text=True)
            rec["b0"] = r2.stdout.strip()[-300:] or r2.stderr.strip()[-300:]
        out.append(rec)
    finally:
        shutil.copyfile(f"{W}/{f}", path)
for o in out: print(json.dumps(o, ensure_ascii=False))
