import sys
root, mc, cm = sys.argv[1], sys.argv[2]=="off", sys.argv[3]=="off"
for f, rows in (("src/search.ts",(1223,1250)),("src/engine.ts",(900,928))):
    p=f"{root}/{f}"; L=open(p).read().split("\n")
    for r in rows:
        a,b=r-1,r
        assert L[a].strip()=="moveCount: true,", L[a]
        assert L[b].strip()=="countermove: true,", L[b]
        assert "deltaPruning" in L[b+1]
        if mc: L[a]=L[a].replace("true","false")
        if cm: L[b]=L[b].replace("true","false")
    open(p,"w").write("\n".join(L))
