# Insert one line after a unique anchor in src/cli.test.ts of an out-of-tree copy. Usage: plant-one.py <tree> <line>
import sys
p = f"{sys.argv[1]}/src/cli.test.ts"; s = open(p).read()
site = "const startGame = () => newGame(START_FEN);\n"
assert s.count(site) == 1, "anchor not unique"
open(p, "w").write(s.replace(site, site + sys.argv[2] + "\n"))
