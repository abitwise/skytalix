# matrix.py <out-dir> <id>... : per mutant, the base and tip default-lane killers, tagged. An UNREAD or short report prints UNREAD, never 0.
import sys
O = sys.argv[1]; ids = sys.argv[2:]
ROWS = {"Q1": "--sweep lists ABC-073 as a finding", "Q2": "coverage() over EVERY real note", "Q3": "prints each count line and every finding by id",
 "L1": "A8′ — the seam built for each level moves exactly", "L2": "A4: with a legal ep capture available the same line is not a draw",
 "L3": "A7: the move the search scores 0 is the move after which gameStatusOf", "C1": "two sessions on the same seededRandom(k)",
 "C2": "a bare go searches 30 000 ms", "B1": "ten seeds, one pick each"}
REM = {"L1~": "A8′ (sample)", "L2~": "A4 (no search)", "L3~": "A7 (no search)", "C1~": "two sessions on seededRandom(2), over the first two gos",
 "C2~": "a bare go hands the engine 30 000 ms", "B1~": "seeds 1 to 7, one pick each"}
HOLD = {"cliR8~": "A4 (slice): on a 500 ms virtual step", "uciR2~": "A5 (slice): on a 500 ms virtual step", "cli230A1": "ABC-230 A1, A3 — the CLI's level seam",
 "uciA4": "UCI: the prior keys are repetition keys A4: the move that makes the third occurrence", "A11": "isready that arrives mid-search is answered once",
 "249": "ABC-249 — a pre-root repetition met four plies deep"}
def load(tag):
    try: ls = open(f"{O}/{tag}.sum").read().splitlines()
    except FileNotFoundError: return None
    if not ls or not ls[0].startswith("total 2709 "): return None
    return [("SUITE-ERROR " if l.startswith("FILEFAIL") else "") + l.split("\t", 2)[1] for l in ls[1:] if l.startswith(("KILL", "FILEFAIL"))]
def tags(ks, t): return ",".join(k for k, v in t.items() if any(v in x for x in ks)) or "-"
print("mutant\tbase_n\tbase_rows\ttip_n\ttip_remnants\ttip_holders\tsuite_errors")
for m in ids:
    b, t = load(f"base-{m}"), load(f"tip-{m}")
    if b is None or t is None:
        print(f"{m}\tUNREAD"); continue
    print(f"{m}\t{len(b)}\t{tags(b, ROWS)}\t{len(t)}\t{tags(t, REM)}\t{tags(t, HOLD)}\t{sum(x.startswith('SUITE-ERROR') for x in b + t)}")
