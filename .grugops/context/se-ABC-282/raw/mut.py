# se-ABC-282 mutants, scratch copy only. Usage: python3 mut.py <copy-root>  (runs each mutant against the two files' default rows)
import os, shutil, subprocess, sys
root = sys.argv[1]
E, U = "src/engine.ts", "src/uci-session.ts"
M = [
 ("control", E, "", ""),
 ("no-soft-test", E, "softMs === undefined ? budget.deadline : Math.min(budget.deadline, start + softMs)", "budget.deadline"),
 ("hard-soft-swapped", E, "softMs === undefined ? budget.deadline : Math.min(budget.deadline, start + softMs)", "softMs === undefined ? budget.deadline : Math.max(budget.deadline, start + softMs)"),
 ("no-exactness", E, "incumbentExact = score > alpha;", "incumbentExact = true;"),
 ("no-iteration-reset", E, "    budget.beaten = null;\n    try {", "    try {"),
 ("pass-reset", E, "  let incumbentExact = false;\n", "  let incumbentExact = false;\n  budget.beaten = null;\n"),
 ("any-mode", E, "if (softMs !== undefined) budget.incumbent = best.move;", "budget.incumbent = best.move;"),
 ("incumbent-once", E, "if (softMs !== undefined) budget.incumbent = best.move;", "if (softMs !== undefined && budget.incumbent === null) budget.incumbent = best.move;"),
 ("no-displacement-test", E, "else if (incumbentExact && score > best)", "else if (incumbentExact)"),
 ("never-kept", E, "if (budget.beaten !== null) {", "if (budget.beaten === undefined) {"),
 ("depth-bumped", E, "          partial = true;\n", "          partial = true;\n          reached++;\n"),
 ("partial-false", E, "...(partial ? { partial } : {}),", "partial: partial as true,"),
 ("st-too", U, 'if (timeMode === "uci-clock-mode") softMs', "softMs"),
 ("movetime-too", U, 'if (clock.movetime !== undefined) budget = Math.min(clock.movetime, cap);', 'if (clock.movetime !== undefined) { budget = Math.min(clock.movetime, cap); softMs = budget / ITERATION_GROWTH; }'),
 ("no-hand-in", U, "...(request.softMs === undefined ? {} : { softMs: request.softMs }),", ""),
 ("wrong-depth-line", U, "partial depth ${choice.depth + 1}", "partial depth ${choice.depth}"),
 ("b-moved", U, "const ITERATION_GROWTH = 2.3;", "const ITERATION_GROWTH = 2.5;"),
]
env = dict(os.environ, NODE_OPTIONS="--max-old-space-size=128")
for name, f, a, b in M:
    p = os.path.join(root, f); orig = open(p, encoding="utf8").read()
    if a:
        assert orig.count(a) == 1, name
        open(p, "w", encoding="utf8").write(orig.replace(a, b))
    r = subprocess.run(["npx", "vitest", "run", "src/engine.test.ts", "src/uci-session.test.ts"], cwd=root, env=env, capture_output=True, text=True)
    open(p, "w", encoding="utf8").write(orig)
    tail = [l.strip() for l in r.stdout.splitlines() if "Tests " in l]
    fails = [l.strip()[:110] for l in r.stdout.splitlines() if l.strip().startswith("FAIL")]
    print(name, "rc", r.returncode, tail[-1:] , fails[:3], flush=True)
