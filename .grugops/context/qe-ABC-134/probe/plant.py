# QE ABC-134 mutant planter: rewrites makeRenderSeam's returned arrow into a block body that runs MUT first.
# Usage: plant.py <orig render-seam.ts> <out> <mut-js-statement>
import sys
src = open(sys.argv[1]).read()
old = "  return (history, status, thinking, messages) =>\n    assembleFrame("
assert src.count(old) == 1
new = "  return (history, status, thinking, messages) => {\n    " + sys.argv[3] + "\n    return assembleFrame("
src = src.replace(old, new)
old2 = "      mode,\n    );\n}"
assert src.count(old2) == 1
src = src.replace(old2, "      mode,\n    );\n  };\n}")
open(sys.argv[2], "w").write(src)
