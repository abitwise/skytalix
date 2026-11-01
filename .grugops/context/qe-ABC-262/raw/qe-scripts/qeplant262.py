# qe-ABC-262 own plants for the black-to-move rows. usage: qeplant262.py <tree> <id>. Rewrites a plant tree only, never the worktree.
import sys
t, pid = sys.argv[1], sys.argv[2]
def edit(rel, a, b):
    p = f"{t}/{rel}"; s = open(p).read()
    assert s.count(a) == 1, (pid, rel, a[:70], s.count(a))
    open(p, "w").write(s.replace(a, b))
GUARD = "      (inCheck || pinStamp[from] === epoch) &&\n"
PUSH = "      continue;\n    }\n    moves.push(move);\n  }\n\n  return moves;\n}"
if pid == "QBe":  # QB without the epoch-0 alias: black in check skips the test, and the pin operand is read only out of check
    edit("src/legal.ts", GUARD, "      ((inCheck && !moverIsBlack) || (!inCheck && pinStamp[from] === epoch)) && // PLANT QBe\n")
elif pid == "QKb":  # black in check drops every quiet queen promotion, legal or not (white untouched)
    edit("src/legal.ts", PUSH, PUSH.replace("    moves.push(move);", "    if (inCheck && moverIsBlack) continue; // PLANT QKb\n    moves.push(move);"))
else:
    raise SystemExit("unknown plant " + pid)
print("planted", pid)
