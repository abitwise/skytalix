import sys
root, frm, to = sys.argv[1], sys.argv[2], sys.argv[3]
p = root + "/src/engine.ts"
s = open(p).read()
assert s.count(frm) == 1, s.count(frm)
open(p, "w").write(s.replace(frm, to))
