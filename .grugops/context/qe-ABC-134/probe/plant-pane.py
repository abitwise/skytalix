# QE ABC-134 A2 mutant planter for history-pane.ts. Usage: plant-pane.py <orig> <out> <extra-import-line> <statements>
import sys
src = open(sys.argv[1]).read()
a = 'import { toSan } from "./san.ts";\n'; b = "  const moves = history.moves;\n"
assert src.count(a) == 1 and src.count(b) == 1
src = src.replace(a, a + sys.argv[3] + "\n").replace(b, b + "  " + sys.argv[4] + "\n")
open(sys.argv[2], "w").write(src)
