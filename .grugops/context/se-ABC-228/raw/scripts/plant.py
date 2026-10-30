# Planted faults for ABC-228: apply one, run the target test file via `npm test -- <file>`, record reds, restore.
import json, shutil, subprocess, sys
W = sys.argv[1]
OUT = sys.argv[2]
PLANTS = [
    ("F1 evasions searched out of check", "src/quiescence.ts",
     "if (rules.evasions && qply < QUIESCENCE_MAX_PLY && isInCheck(position)) {",
     "if (rules.evasions && qply < QUIESCENCE_MAX_PLY) {"),
    ("F2 stand pat kept in check", "src/quiescence.ts",
     "    best = Number.NEGATIVE_INFINITY;\n  } else {",
     "    best = evaluate(position);\n    if (best >= beta) return best;\n    if (best > alpha) alpha = best;\n  } else {"),
    ("F3 mate scored without check (stalemate)", "src/quiescence.ts",
     "if (rules.evasions && qply < QUIESCENCE_MAX_PLY && isInCheck(position)) {",
     "if (rules.evasions && qply < QUIESCENCE_MAX_PLY && (isInCheck(position) || legalMoves(position).length === 0)) {"),
    ("F4 evasions past the cap", "src/quiescence.ts",
     "if (rules.evasions && qply < QUIESCENCE_MAX_PLY && isInCheck(position)) {",
     "if (rules.evasions && qply < QUIESCENCE_MAX_PLY + 1 && isInCheck(position)) {"),
    ("F5 mate distance drops the leaf ply", "src/quiescence.ts",
     "return 0 - (MATE_SCORE - (ply + qply));",
     "return 0 - (MATE_SCORE - qply);"),
    ("F6 mate score of the wrong sign", "src/quiescence.ts",
     "return 0 - (MATE_SCORE - (ply + qply));",
     "return MATE_SCORE - (ply + qply);"),
    ("F7 engine leaf passes ply 0", "src/engine.ts",
     "return quiesce(position, alpha, beta, 0, ply, rules, budget.visit);",
     "return quiesce(position, alpha, beta, 0, 0, rules, budget.visit);"),
    ("F8 chooseMove switch off", "src/engine.ts",
     "    priorKeys: true,\n    quiescenceEvasions: true,",
     "    priorKeys: true,\n    quiescenceEvasions: false,"),
    ("F9 search door switch on", "src/search.ts",
     "    nullMove: true,\n    quiescenceEvasions: false,",
     "    nullMove: true,\n    quiescenceEvasions: true,"),
    ("F10 evasions unordered", "src/quiescence.ts",
     "  // Stable sort: equal keys keep generation order, so the count is deterministic.\n  orderCaptures(moves);",
     "  // Stable sort: equal keys keep generation order, so the count is deterministic.\n  if (best !== Number.NEGATIVE_INFINITY) orderCaptures(moves);"),
]
results = []
for name, rel, old, new in PLANTS:
    path = f"{W}/{rel}"
    orig = open(path).read()
    assert orig.count(old) == 1, (name, orig.count(old))
    open(path, "w").write(orig.replace(old, new))
    try:
        r = subprocess.run(["npm", "test", "--", "src/quiescence.test.ts", "src/search.null-move.test.ts", "src/engine.test.ts", "src/search.test.ts"],
                           cwd=W, capture_output=True, text=True, timeout=600)
        out = r.stdout + r.stderr
        fails = sorted({l.strip()[len("FAIL  "):] if l.strip().startswith("FAIL  ") else l.strip()[5:] for l in out.splitlines() if l.strip().startswith("FAIL ") and " > " in l})
        tests = [l.strip() for l in out.splitlines() if l.strip().startswith("Tests ")]
        results.append({"plant": name, "exit": r.returncode, "tests": tests[-1] if tests else "?", "red": fails})
    finally:
        open(path, "w").write(orig)
    print(json.dumps(results[-1]), flush=True)
json.dump(results, open(OUT, "w"), indent=1)
