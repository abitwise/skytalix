# usage: python3 params.py <evaluate-params.ts> S1|S2. S1: fit-shaped E4a eg halves, U 0. S2: U 50 as well.
import re,sys
p,mode=sys.argv[1:3]; s=open(p).read()
if mode=="S1":
    for n,v in (("PASSED_KING_ENEMY","[0, 4, 6, 9, 14, 22, 31, 0]"),("PASSED_KING_OWN","[0, 1, 2, 6, 8, 15, 27, 0]"),("PASSED_FREE","[0, 2, 12, 18, 40, 55, 90, 0]")):
        s,c=re.subn(r"(export const %s: MgEg<readonly number\[\]> = \{\n  mg: \[[^\]]*\],\n  eg: )\[[^\]]*\]"%n, lambda m:m.group(1)+v, s); assert c==1
else:
    a="export const PASSED_UNSTOPPABLE: MgEg<number> = { mg: 0, eg: 0 };"; assert s.count(a)==1; s=s.replace(a,"export const PASSED_UNSTOPPABLE: MgEg<number> = { mg: 0, eg: 50 };")
open(p,"w").write(s)
