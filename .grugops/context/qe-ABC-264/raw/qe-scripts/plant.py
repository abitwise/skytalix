# qe-ABC-264 plants: apply one plant to <tree>/src (a scratch copy of head 358b5f4a). usage: plant.py <srcDir> <id>
import sys, re
src, pid = sys.argv[1], sys.argv[2]
def sub(fname, old, new, count=1):
    p = f"{src}/{fname}"; s = open(p).read()
    assert s.count(old) == count, (pid, fname, s.count(old))
    open(p, "w").write(s.replace(old, new)); print(f"{pid}: {fname}: {old!r} -> {new!r}"[:300])
def move_gate(fname, sw, dep, probe_line):
    p = f"{src}/{fname}"; s = open(p).read()
    block = (f"  // Reverse futility (`ABC-264`): a static guess, so beta and never the evaluation; nothing stored.\n"
             f"  if (\n    {sw}.reverseFutility &&\n    alpha + 1 === beta &&\n    reverseFutilityCut(position, {dep}, ply, beta)\n  ) {{\n    return beta;\n  }}\n\n")
    assert s.count(block) == 1 and s.count(probe_line) == 1, (pid, s.count(block), s.count(probe_line))
    s = s.replace(block, "").replace(probe_line, block + probe_line)
    open(p, "w").write(s); print(f"{pid}: {fname}: gate moved above {probe_line.strip()!r}")
if pid == "QP1": sub("search.ts", "if (beta >= MATE_FLOOR || beta <= 0 - MATE_FLOOR) return false;", "if (beta > MATE_FLOOR || beta < 0 - MATE_FLOOR) return false;")
elif pid == "QP2": sub("search.ts", "if (beta >= MATE_FLOOR || beta <= 0 - MATE_FLOOR) return false;", "if (beta >= MATE_FLOOR) return false;")
elif pid == "QP3": sub("search.ts", "return evaluate(position) - REVERSE_FUTILITY_MARGIN * depth >= beta;", "return evaluate(position) - REVERSE_FUTILITY_MARGIN * depth > beta;")
elif pid == "QP4": move_gate("engine.ts", "budget", "remaining", "  const slot = probeTable(key);\n")
elif pid == "QP5": move_gate("search.ts", "switches", "depth", "  const slot = switches.table ? probeTable(key) : -1;\n")
elif pid == "QP6":
    p = f"{src}/engine.ts"; s = open(p).read()
    i = s.index("export function chooseMoveWithoutReverseFutility("); j = s.index("priorKeys: true,", i)
    s = s[:j] + "priorKeys: false," + s[j + len("priorKeys: true,"):]; open(p, "w").write(s); print("QP6: engine.ts: chooseMoveWithoutReverseFutility priorKeys: false")
elif pid == "QP7": sub("search.ts", "if (ply === 0 || depth > REVERSE_FUTILITY_MAX_DEPTH) return false;", "if (ply <= 1 || depth > REVERSE_FUTILITY_MAX_DEPTH) return false;")
elif pid == "QP8": sub("search.ts", "if (ply === 0 || depth > REVERSE_FUTILITY_MAX_DEPTH) return false;", "if (ply === 0 || depth >= REVERSE_FUTILITY_MAX_DEPTH) return false;")
elif pid == "QF": sub("engine.test.ts", "const makeB = () => createEngine({ budgetMs: 5, now: virtualClock(1) });", "const makeB = () => createEngine({ budgetMs: 3, now: virtualClock(1) });")
else: sys.exit(f"unknown {pid}")
