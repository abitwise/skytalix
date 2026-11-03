# arch-ABC-234 DIAGNOSTIC (written AFTER batch 1's pay-gate miss; not pre-registered; cannot change the verdict).
# Q1 shape for information only: out of check, quiescence skips a LOSING capture (see < -QCOUNT.margin). Knob PROBE.q1 -> QCOUNT.prune.
import sys
root = sys.argv[1]
def sub(path, old, new, count=1):
    s = open(path).read()
    n = s.count(old)
    if n != count:
        raise SystemExit(f"{path}: expected {count} of {old[:70]!r}, found {n}")
    open(path, "w").write(s.replace(old, new))
qp = root + "/src/quiescence.ts"
sub(qp, "export const QCOUNT = { on: false, margin: 0,", "export const QCOUNT = { prune: false, pmargin: 0, on: false, margin: 0,")
sub(qp, """  for (const move of moves) {
    const qLosing = QCOUNT.on""", """  const inCheckNode = best === Number.NEGATIVE_INFINITY;
  for (const move of moves) {
    if (QCOUNT.prune && !inCheckNode && isLosingCapture(position, move, QCOUNT.pmargin)) continue;
    const qLosing = QCOUNT.on""")
pp = root + "/probe.ts"
sub(pp, """function setCfg(cfg: Record<string, unknown>) {
  Object.assign(PROBE, DEFAULTS, { hist: [0, 0, 0, 0, 0, 0, 0, 0], auditLog: [], fired: 0, seeLog: [], seeFired: 0 }, cfg);
}""", """function setCfg(cfg: Record<string, unknown>) {
  Object.assign(PROBE, DEFAULTS, { hist: [0, 0, 0, 0, 0, 0, 0, 0], auditLog: [], fired: 0, seeLog: [], seeFired: 0 }, cfg);
  QCOUNT.prune = (cfg as any).q1 === 1; QCOUNT.pmargin = Number((cfg as any).q1Margin ?? 0);
}""")
print("patched diag q1")
