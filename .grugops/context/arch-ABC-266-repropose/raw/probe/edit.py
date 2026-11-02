import sys,re
t=sys.argv[1]
p=t+'/src/transposition.ts'; s=open(p).read()
old="  if (slot !== hitSlot || hitData >>> DEPTH_SHIFT !== depth) return null;"
assert old in s
s=s.replace(old,"""  if (slot !== hitSlot) return null;
  // arch-ABC-266-repropose SCRATCH: ADR-0058's rule (stored >= requested) when switched on in this thread
  if (scratchDeeper ? hitData >>> DEPTH_SHIFT < depth : hitData >>> DEPTH_SHIFT !== depth) return null;""")
s=s.replace("let hitSlot = -1;","""let hitSlot = -1;
/** arch-ABC-266-repropose SCRATCH: ADR-0058's deeper-entry rule, per thread; off by default. */
let scratchDeeper = false;
export function scratchSetDeeper(on: boolean): void {
  scratchDeeper = on;
}""",1)
open(p,'w').write(s)
p=t+'/src/engine.ts'; s=open(p).read()
# diversity knobs
anchor="/** The deepening loop behind `chooseMove` and its five doors; they differ in `heuristics` only. */"
assert anchor in s
s=s.replace(anchor,"""/** arch-ABC-266-repropose SCRATCH: helper diversity, per thread; off by default (size 0, seed 0). */
let scratchSkipSize = 0;
let scratchSkipPhase = 0;
let scratchSeed = 0;
export function scratchSetDiversity(skipSize: number, skipPhase: number, seed: number): void {
  scratchSkipSize = skipSize;
  scratchSkipPhase = skipPhase;
  scratchSeed = seed;
}
function scratchShuffle(moves: Move[], iteration: number): void {
  let x = (scratchSeed * 7919 + iteration * 104729) >>> 0 || 1;
  for (let i = moves.length - 1; i > 1; i--) {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
    const j = 1 + (x % i);
    const m = moves[i] as Move;
    moves[i] = moves[j] as Move;
    moves[j] = m;
  }
}
"""+anchor,1)
old="""  const rootMoves = orderMoves(
    moves,
    budget.killers.at(0),
    slot === -1 ? null : entryMove(slot, moves),
  );"""
assert old in s
s=s.replace(old,old+"""
  if (scratchSeed !== 0) scratchShuffle(rootMoves, remaining); // SCRATCH: first move kept, rest permuted""")
old="""    let deeper: Iteration;
    try {"""
assert old in s
s=s.replace(old,"""    // SCRATCH: Stockfish-style skip blocks (pre-2018 SkipSize/SkipPhase), helpers only
    if (scratchSkipSize > 0 && Math.floor((iteration + scratchSkipPhase) / scratchSkipSize) % 2 !== 0) continue;
"""+old,1)
open(p,'w').write(s)
print("ok")
