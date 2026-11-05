# mutq.py <tree> <orig> <id> : arch-ABC-307-reads' mut.py, unchanged, for every id but QE's order-independent MC1.
# MC1p0 and MC1p1 are ONE form read at both parities. MC1 adds a running session count to the seed, so its kill hangs on which two
# salts the row's sessions land on. This form adds only the count's parity: two consecutive sessions always get salts 0 and 1, in some
# order, and seed 2's first go takes different paths on those two salts (arch-ABC-307-reads raw/mc1-probe.txt: 0 e2e3, 1 b1c3). The
# parity is the mutant's only state, so a row's kill can hang only on it; p0 and p1 start the count at 0 and at 1, which is every order.
import os, subprocess, sys
P, O, m = sys.argv[1], sys.argv[2], sys.argv[3]
HERE = os.path.dirname(os.path.abspath(__file__))
START = {"MC1p0": "0", "MC1p1": "1"}
if m not in START:
    sys.exit(subprocess.run([sys.executable, "-I", f"{HERE}/mut.py", P, O, m]).returncode)
subprocess.run([sys.executable, "-I", f"{HERE}/mut.py", P, O, "restore"], check=True, stdout=subprocess.DEVNULL)
G = "(globalThis as unknown as { __mc1?: number })"
EDITS = [("  const { write, now, random, book } = options;",
          f"  const {{ write, now, random, book }} = options;\n  const mc1Salt = ({G}.__mc1 = ({G}.__mc1 ?? {START[m]}) + 1) & 1;"),
         ("      const seed = Math.floor(random() * 2 ** 32);", "      const seed = Math.floor(random() * 2 ** 32) + mc1Salt;")]
path = f"{P}/src/uci-session.ts"
s = open(path).read()
for old, new in EDITS:
    assert s.count(old) == 1, (m, old[:60], s.count(old))
    s = s.replace(old, new)
open(path, "w").write(s)
print("applied", m)
