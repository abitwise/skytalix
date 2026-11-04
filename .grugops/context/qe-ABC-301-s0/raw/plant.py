# qe-ABC-301-s0 P2 plants on the scratch copy G. usage: python3 plant.py <G root> <id>. Prints the planted paths, one per line.
import sys,os
root,mid=sys.argv[1],sys.argv[2]
CALL='import { pawnStructureForTest } from "%s/evaluate.ts";\nexport const f = (p: never) => pawnStructureForTest(p, false);\n'
def w(path,text):
    p=os.path.join(root,path); os.makedirs(os.path.dirname(p),exist_ok=True); open(p,"w").write(text); print(path)
def a(path,text):
    p=os.path.join(root,path); s=open(p).read(); open(p,"w").write(s+text); print(path)
if mid=="P-src-deep": w("src/aa/bb/deep.ts",CALL%"../..")
elif mid=="P-src-helper": w("src/evaluate.helper-fixture.ts",CALL%".")
elif mid=="P-src-mjs": w("src/zz.mjs",'import { passerTermsForTest } from "./evaluate.ts";\nexport const f = (p) => passerTermsForTest(p);\n')
elif mid=="P-src-js": w("src/zz.js",'import { passerTermsForTest } from "./evaluate.ts";\nexport const f = (p) => passerTermsForTest(p);\n')
elif mid=="P-src-mts": w("src/zz.mts",'import { passerTermsForTest } from "./evaluate.ts";\nexport const f = (p: never) => passerTermsForTest(p);\n')
elif mid=="P-tools-py": w("tools/zz/a.py","# calls passerTermsForTest\n")
elif mid=="P-tools-test": w("tools/zz/a.test.ts","// pawnStructureForTest\n")
elif mid=="P-spike": w("spike/a.ts",CALL%"../src")
elif mid=="P-config": a("vitest.config.ts","// passerTermsForTest\n")
elif mid=="P-package": 
    p=os.path.join(root,"package.json"); s=open(p).read(); open(p,"w").write(s.replace('"scripts": {','"scripts": {\n    "zz": "node -e passerTermsForTest",')); print("package.json")
elif mid=="P-evaluate-call": a("src/evaluate.ts","export function zz(p: Position) { return passerTermsForTest(p); }\n")
elif mid=="P-root-script": w("zz.sh","node -e 'import(\"./src/evaluate.ts\").then(e => e.passerTermsForTest)'\n")
elif mid=="P-root-mjs": w("zz.mjs",'import { pawnStructureForTest } from "./src/evaluate.ts";\nexport const f = pawnStructureForTest;\n')
elif mid=="P-github": w(".github/workflows/zz.yml","run: node -e passerTermsForTest\n")
elif mid=="P-alias":
    a("src/evaluate.ts","export const seamAlias = passerTermsForTest;\n"); w("src/zz.ts",'import { seamAlias } from "./evaluate.ts";\nexport const f = seamAlias;\n')
elif mid=="P-dynamic": w("src/zz.ts",'import * as E from "./evaluate.ts";\nconst k = "passerTerms" + "ForTest";\nexport const f = (E as never)[k];\n')
else: raise SystemExit(mid)
