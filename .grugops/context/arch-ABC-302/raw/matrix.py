import sys
S = sys.argv[1]
ROWS = {
 "R1": "every null move is made out of check, with three or more pieces",
 "R2": "A5: the CLI level seam's injected list equals UCI's, key for key, and both play d8e8",
 "R3": "the rule changes the work: search() at depth 4 and chooseMove deepened to 4",
 "R4": "holds at every node within 2 plies of every perft position",
 "R5": "on an infinite budget, maxDepth 1000 returns within the same consultation count",
 "R6": "a fixed seed gives identical blunder decisions across runs",
 "R7": "move, depth and nodes are equal on 30 of 30 positions, for each of two seeds",
 "R8": "A4: with repetitionKeyHistory injected the default level plays d8e8 at exactly 0; base does not",
 "R9": "ends every line at ply 128 with a leaf's score once the deepening passes it",
}
REM = {
 "R1~": "the in-check root and position-5, search() to depth 4",
 "R2~": "A5 (slice): on a 500 ms virtual step",
 "R4~": "holds at every node 1 ply from every perft position",
 "R5~": "on an infinite budget and a 10 000 ms counting clock",
 "R8~": "A4 (slice): on a 500 ms virtual step",
 "R9~": "on a clock spent after 2 x ITERATIONS (260) root passes",
}
HOLD = {
 "A10": "A10 — the seed is threaded, not global",
 "QE087d": "QE-087-d (slice)",
 "lvA6": "A6 — the default level at rate 0 returns",
 "QE087a": "QE-087-a — the seed never reaches the engine",
 "fut-lit": "both recursions test the node once, with the entry window",
 "QE268b": "QE-268-b — a futile node returns the best score",
 "cliA7": "A7: the move the search scores 0 is the move after which gameStatusOf reports",
 "uciA4": "UCI: the prior keys are repetition keys A4: the move that makes the third occurrence",
 "249": "ABC-249 — a pre-root repetition met four plies deep",
}
def tags(k):
    out = []
    for r, t in {**ROWS, **REM, **HOLD}.items():
        if t in k: out.append(r)
    return out
def load(p, m):
    ls = open(f"{S}/out/{p}-{m}.sum").read().splitlines()
    return [l.split("\t", 1)[1] for l in ls if l.startswith(("KILL", "FILEFAIL"))]
ids = "M1 M2 M2s M3 M3s M4 M4z M5 M5c M6 M6t M7 M7n M8d M9 M9r F230 QSEAMRAW QPRIOROFF QMATCH3 QTRIM1 REP0 S241M1 QMATCH1 UNTRIM S241M6 QUCINOKEYS".split()
print("mutant\tbase_n\tbase_tagged\ttip_n\ttip_tagged\tcli_tip_killers")
for m in ids:
    b, t = load("base", m), load("tip", m)
    bt = sorted({x for k in b for x in tags(k)}); tt = sorted({x for k in t for x in tags(k)})
    cli = [k.split("::",1)[1][:60] for k in t if k.startswith("cli.test.ts")]
    print(f"{m}\t{len(b)}\t{','.join(bt)}\t{len(t)}\t{','.join(tt)}\t{' | '.join(cli) if m in ('F230','QSEAMRAW','QPRIOROFF','QMATCH3','QTRIM1') else ''}")
