# SCRATCH PROBE (arch-ABC-292-probe; arch-ABC-291-probe's, this line changed): adds hit and miss counters to the memo of a patched copy, for PR10's count only.
# The `count` copy is never timed. Usage: python3 patch_count.py <copy root>.
import sys, pathlib
ev = pathlib.Path(sys.argv[1]) / "src/evaluate.ts"
t = ev.read_text()
def sub(text, old, new):
    if text.count(old) != 1: raise SystemExit(f"no single match: {old[:70]!r}")
    return text.replace(old, new)
t = sub(t, "  const slot = slotWord & PAWN_CACHE_INDEX_MASK;\n  if (pawnCacheWhite[slot] === whiteMask && pawnCacheBlack[slot] === blackMask) {\n    whitePassersPart",
        "  const slot = slotWord & PAWN_CACHE_INDEX_MASK;\n  if (pawnCacheWhite[slot] === whiteMask && pawnCacheBlack[slot] === blackMask) {\n    probeHits++;\n    whitePassersPart")
t = sub(t, "  const structure = pawnStructure(board);\n  pawnCacheWhite[slot] = whiteMask;\n",
        "  probeMisses++;\n  const structure = pawnStructure(board);\n  pawnCacheWhite[slot] = whiteMask;\n")
t = sub(t, "/** TEST-ONLY. Empties the pawn memo,",
        "let probeHits = 0;\nlet probeMisses = 0;\nexport function probeCounts(): { hits: number; misses: number } {\n  return { hits: probeHits, misses: probeMisses };\n}\n\n/** TEST-ONLY. Empties the pawn memo,")
ev.write_text(t)
print("counted", ev)
