import sys, glob, os
S = sys.argv[1]; prefix = sys.argv[2]; ids = sys.argv[3:]
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
def tag(k):
    for r, t in ROWS.items():
        if t in k and "[deep" not in k: return r
    return None
for m in ids:
    f = f"{S}/out/{prefix}-{m}.sum"
    lines = open(f).read().splitlines()
    kills = [l.split("\t",1)[1] for l in lines if l.startswith("KILL") or l.startswith("FILEFAIL")]
    rows = sorted({tag(k) for k in kills if tag(k)})
    others = [k for k in kills if not tag(k)]
    print(f"== {m}: {len(kills)} killers; rows {rows}; others {len(others)}")
    for k in others[:int(os.environ.get('N','6'))]: print("     ", k[:170])
