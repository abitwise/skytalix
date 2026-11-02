# qe-ABC-265 plants: apply one QE plant to <srcDir>/transposition.ts (a scratch copy of head e5694864, never src/).
# usage: plant.py <srcDir> <id>
import sys
src, pid = sys.argv[1], sys.argv[2]
P = f"{src}/transposition.ts"

def sub(old, new, count=1):
    s = open(P).read()
    assert s.count(old) == count, (pid, s.count(old), old)
    open(P, "w").write(s.replace(old, new))
    print(f"{pid}: {old!r} -> {new!r}"[:400])

# QP1 the per-search clear does not zero: the re-clear keeps every stale entry.
if pid == "QP1": sub("  table.fill(0);\n", "  // QP1: no fill\n")
# QP2 wrong slot index, consistent in probe and store: the slot is taken from keyHi, not keyLo.
elif pid == "QP2":
    sub("  const keyLo = Number(key & LOW_HALF);\n  const slot = keyLo & INDEX_MASK;\n",
        "  const keyLo = Number(key & LOW_HALF);\n  const slot = Number(key >> 32n) & INDEX_MASK;\n")
    sub("  const base = (keyLo & INDEX_MASK) << 2;\n", "  const base = (Number(key >> 32n) & INDEX_MASK) << 2;\n")
# QP3 wrong slot base: a stride of 2 words, so adjacent slots overlap (probe, store and entryMove alike).
elif pid == "QP3":
    sub("  const base = slot << 2;\n", "  const base = slot << 1;\n")
    sub("  const base = (keyLo & INDEX_MASK) << 2;\n", "  const base = (keyLo & INDEX_MASK) << 1;\n")
    sub("table[(slot << 2) + 2]", "table[(slot << 1) + 2]")
# QP4 a hit on a zero data word: the empty-slot test is dropped (the XOR equations alone decide).
elif pid == "QP4": sub("if (data === 0 || ((table[base]", "if (((table[base]")
# QP5 the verified copy is not refreshed by a hit's score: tableCutoff reads the previous hit's score.
elif pid == "QP5": sub("  hitScore = score | 0;\n", "  // QP5: hitScore not refreshed\n")
# QP6 the hash move from the verified copy (the amendment's REJECTED alternative), not a live read of word 2.
elif pid == "QP6": sub("  const packed = (table[(slot << 2) + 2] as number) & MOVE_BITS;\n", "  const packed = (slot === hitSlot ? hitData : (table[(slot << 2) + 2] as number)) & MOVE_BITS;\n")
# QP7 the defensive slot guard in tableCutoff dropped (expected equivalent at both call sites).
elif pid == "QP7": sub("if (slot !== hitSlot || hitData >>> DEPTH_SHIFT !== depth) return null;", "if (hitData >>> DEPTH_SHIFT !== depth) return null;")
# QP8 the clear zeroes word 2 of each slot only (the amendment PERMITS this; expected value-equal).
elif pid == "QP8": sub("  table.fill(0);\n", "  for (let i = 2; i < table.length; i += 4) table[i] = 0;\n")
# QP9 the score word read back unsigned (no `| 0`): a negative stored score becomes a large positive one.
elif pid == "QP9": sub("  hitScore = score | 0;\n", "  hitScore = score;\n")
# QP10 clearTable does not reset the copy's slot (expected equivalent: every cutoff follows a hit).
elif pid == "QP10": sub("export function clearTable(): void {\n  hitSlot = -1;\n", "export function clearTable(): void {\n")
else: sys.exit(f"unknown {pid}")
