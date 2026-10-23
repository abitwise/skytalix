#!/usr/bin/env python3
# security-nfr-timing-2026-10-23 part (2) ABC-201 readout. Usage: python3 -I readout201.py <attempt dir>
# A3: pin N = the newline count of frame 0 from child 1's raw stdout (the newlines before the first line that starts with "> ",
# the game's prompt); re-derive every child's frame0Ms as the first stdout mark whose cumulative newlines >= N. States: MET = all
# 10 children reached frame 0 (exit 0, not timed out) and max < 2000 ms; NOT MET = any child >= 2000 ms; UNRESOLVED = any child
# never reached frame 0, or the host was not held (not AC / load1 > 8 / a foreign vitest on any st() line from pre-a3 to post-a3).
# Thermal is kept and flagged. A2: exit 0; stderr 0 bytes; the last frame's move list holds exactly 2 plies; "input ended" once,
# after that frame.
import json, re, statistics, sys
A = sys.argv[1]
rows = [json.loads(l) for l in open(f"{A}/a3/a3.jsonl")]
raw1 = open(f"{A}/a3/child-1.stdout", "rb").read()
lines1 = raw1.split(b"\n")
N = next(i for i, l in enumerate(lines1) if l.startswith(b"> "))
print(f"A3 frame-0 pin from child 1: {N} newlines before the first '> ' line (FRAME_NL used to close stdin: {rows[0]['frameNl']})")
print("child 1 raw stdout (repr, every line):")
for i, l in enumerate(lines1): print(f"  {i+1:2d} {l!r}")
st = [l.rstrip("\n").split("\t") for l in open(f"{A}/st.tsv")]
win = False; held = True; therm = []
for r in st:
    if r[0] == "pre-a3": win = True
    if win:
        pw = r[2]; l1 = float(r[3].split()[1]); th = r[4].split()[1]; vt = int(r[5].split()[1])
        therm.append(th)
        if pw != "power 'AC Power'" or l1 > 8 or vt != 0: held = False; print("  HOST NOT HELD at", r)
    if r[0] == "post-a3": win = False
print(f"host held over A3 (AC, load1 <= 8, 0 vitest on every st line pre-a3..post-a3): {held}; thermal values {sorted(set(therm))} (kept, flagged if not 0)")
f0 = []
ok = True
print("child\texit\ttimedOut\tstderrB\tnewlines\tfirstByteMs\tframe0Ms(pinned)\tframe0Ms(driver)\texitMs\tload1_before\tthermal_before")
for r, s in zip(rows, [x for x in st if x[0].startswith("a3-child-")]):
    m = next((t for t, b, n in r["marks"] if n >= N), None)
    reached = m is not None and r["exit"] == 0 and not r["timedOut"]
    ok = ok and reached
    if m is not None: f0.append(m)
    print(f"{r['child']}\t{r['exit']}\t{r['timedOut']}\t{r['stderrBytes']}\t{r['newlinesTotal']}\t{r['firstByteMs']:.1f}\t{m if m is None else f'{m:.1f}'}\t{r['frame0Ms'] if r['frame0Ms'] is None else round(r['frame0Ms'],1)}\t{r['exitMs']:.1f}\t{s[3].split()[1]}\t{s[4].split()[1]}")
print(f"n {len(rows)}; reached {len(f0)}")
if f0:
    print(f"A3 spawn-to-frame-0 ms: min {min(f0):.1f} / median {statistics.median(f0):.1f} / max {max(f0):.1f}; FIRST launch after install (child 1): {f0[0]:.1f}")
    print(f"A3 without child 1 (reported only): min {min(f0[1:]):.1f} / median {statistics.median(f0[1:]):.1f} / max {max(f0[1:]):.1f}")
if not ok or len(f0) != len(rows) or len(rows) < 10 or not held:
    state = "UNRESOLVED"
elif max(f0) >= 2000:
    state = "NOT MET"
else:
    state = "MET"
if f0 and max(f0) >= 2000: state = "NOT MET"
print(f"A3 STATE (NFR-007 < 2000 ms, max of n >= 10, first launch counted): {state}")
# A2
rc = open(f"{A}/a2-rc.txt").read().strip(); err = open(f"{A}/a2.stderr", "rb").read(); out = open(f"{A}/a2.stdout", "rb").read().decode("utf-8")
print(f"\nA2 {rc}; stderr bytes {len(err)}" + (f"; stderr raw {err!r}" if err else ""))
print("A2 raw stdout (repr, every line):")
for i, l in enumerate(out.split("\n")): print(f"  {i+1:2d} {l!r}")
ie = out.count("input ended")
frames = [m.start() for m in re.finditer(r"(?m)^(?:> )*8 [.:]", out)]
last = out[frames[-1]:] if frames else ""
rows_ml = re.findall(r"(?m)^ *\d+\. .*$", last.split("> input ended")[0])
moves = " | ".join(r.rstrip() for r in rows_ml) if rows_ml else None
plies = sum(len([t for t in r.split() if not re.fullmatch(r"\d+\.+", t)]) for r in rows_ml) if rows_ml else None
after = out.rfind("input ended") > frames[-1] if frames else False
print(f"A2 frames {len(frames)}; last frame move-list line {moves!r}; plies {plies}; 'input ended' count {ie}; after the last frame {after}")
a2 = rc == "A2 exit 0" and len(err) == 0 and plies == 2 and ie == 1 and after
print(f"A2 STATE: {'MET' if a2 else 'NOT MET'}")
