import sys, shutil
P, O, m = sys.argv[1], sys.argv[2], sys.argv[3]
shutil.copy(f"{O}/engine.ts.orig", f"{P}/src/engine.ts")
shutil.copy(f"{O}/levels.ts.orig", f"{P}/src/levels.ts")
def sub(path, old, new):
    s = open(path).read()
    assert s.count(old) == 1, (m, old[:60], s.count(old))
    open(path, "w").write(s.replace(old, new))
E, L = f"{P}/src/engine.ts", f"{P}/src/levels.ts"
if m == "M1":  # ADR-0050 plant: the null move is not unmade on abort (no finally)
    sub(E, "      try {\n        keys[ply + 1] = zobristKeyAfterNullMove(key, nullUndo);",
           "      {\n        keys[ply + 1] = zobristKeyAfterNullMove(key, nullUndo);")
    sub(E, "      } finally {\n        unmakeNullMove(position, nullUndo);\n      }",
           "      }\n      unmakeNullMove(position, nullUndo);")
elif m == "M2":  # an empty prior-key list is read unlike an absent one: the table is not cleared
    sub(E, "  budget.keys[0] = zobristKey(position);\n  clearTable();",
           "  budget.keys[0] = zobristKey(position);\n  if (options.priorKeys?.length !== 0) clearTable();")
elif m == "M3a":  # the seed is ignored: one fixed generator
    sub(L, "const random = seededRandom(options.seed);", "const random = seededRandom(0);")
elif m == "M3b":  # an extra draw per move (QE-087-d)
    sub(L, "    if (random() >= level.blunderRate) {", "    random();\n    if (random() >= level.blunderRate) {")
elif m == "restore":
    pass
print("applied", m)
if m == "M3c":  # M5b shape: an extra draw on a blunder move, after the decision
    sub(L, "    // One list per blunder call: each child's root", "    random();\n    // One list per blunder call: each child's root")
elif m == "M3d":  # an extra draw on an engine move, after the decision
    sub(L, "      if (choice === null) return null;\n      const { move, depth, nodes, elapsedMs } = choice;",
           "      random();\n      if (choice === null) return null;\n      const { move, depth, nodes, elapsedMs } = choice;")
if m in ("M3c", "M3d"): print("applied", m)
if m == "M2c":  # an empty list switches the null move off (door-like), absent keeps it
    sub(E, "    prior: heuristics.priorKeys ? (options.priorKeys ?? NO_PRIOR_KEYS) : NO_PRIOR_KEYS,\n    ...heuristics,\n",
           "    prior: heuristics.priorKeys ? (options.priorKeys ?? NO_PRIOR_KEYS) : NO_PRIOR_KEYS,\n    ...heuristics,\n    ...(options.priorKeys?.length === 0 ? { nullMove: false } : {}),\n")
    print("applied", m)
