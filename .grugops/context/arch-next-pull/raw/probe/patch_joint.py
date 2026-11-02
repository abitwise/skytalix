# arch-next-pull: scratch probe patch, run AFTER patch_post268.py and patch_233.py (both unchanged). It adds
# ADR-0060 decision 11's history term to the log-table predicate (lmrProbe, shared by BOTH recursions).
# Knobs (all off by default, so every earlier id reads node for node as before):
#   hT (0/1)      the history term on (acts only when hh = 1 and lmr = "log");
#   hLess (int)   plies less for a move whose history value h > 0;
#   hZero (0/1)   a move with h > 0 is not reduced at all (overrides hLess);
#   hMore (int)   plies more for a move with h < 0;
#   hNegCap (int) the cap for a move with h < 0 (0 = the common cap maxR).
# The term is applied after the PV term and before the cap and the child-depth clamp (r <= d - 2).
import sys
root = sys.argv[1]
def sub(path, old, new, count=1):
    s = open(path).read()
    n = s.count(old)
    if n != count:
        raise SystemExit(f"{path}: expected {count} of {old[:70]!r}, found {n}")
    open(path, "w").write(s.replace(old, new))
sp = root + "/src/search.ts"
sub(sp, '  hh: 0, hhIndex: "cft" as "cft" | "ft" | "pt",',
        '  hT: 0, hLess: 1, hZero: 0, hMore: 0, hNegCap: 0,\n  hh: 0, hhIndex: "cft" as "cft" | "ft" | "pt",')
sub(sp, """  if (PROBE.killerLess > 0 && killers.some((k) => sameMove(k, move))) r -= PROBE.killerLess;
  if (PROBE.floorOne && r < 1) r = 1;
  r = Math.min(r, PROBE.maxR, depth - 1 - PROBE.clampMin);""", """  if (PROBE.killerLess > 0 && killers.some((k) => sameMove(k, move))) r -= PROBE.killerLess;
  let cap = PROBE.maxR;
  if (PROBE.hT === 1 && PROBE.hh === 1) {
    const hv = HH[hhIdx(move)] as number;
    if (hv > 0) r = PROBE.hZero === 1 ? 0 : r - PROBE.hLess;
    else if (hv < 0) { r += PROBE.hMore; if (PROBE.hNegCap > 0) cap = PROBE.hNegCap; }
  }
  if (PROBE.floorOne && r < 1) r = 1;
  r = Math.min(r, cap, depth - 1 - PROBE.clampMin);""")
print("patched joint")
