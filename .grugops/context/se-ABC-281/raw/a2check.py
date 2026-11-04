import subprocess, re, sys
W=sys.argv[1]
def get(rev,f): return subprocess.run(["git","-C",W,"show",f"{rev}:{f}"],capture_output=True,text=True).stdout
def body(src, header, ind):
    lines=src.split("\n"); i=[k for k,l in enumerate(lines) if l.strip()==header.strip()]
    assert len(i)==1,(header,len(i)); i=i[0]
    close=" "*ind+"});"
    j=next(k for k in range(i+1,len(lines)) if lines[k]==close)
    return lines[i+1:j]
rows=[("src/search.null-move.test.ts",'it("position-6, the even readings 4 to 24: 0 mutated roots, and aborts landing inside a null subtree", () => {',2,'it("position-6, the even readings 4 to 24: 0 mutated roots, and aborts landing inside a null subtree [deep, SEARCH_DEEP=1]", () => {',6),
("src/engine.test.ts",'it("A4: an empty list is node-equal to an absent one over the endgames and the thirty", () => {',2,'it("A4: an empty list is node-equal to an absent one over the endgames and the thirty", () => {',4),
("src/levels.test.ts",'it("≥ 5 seeds over the same ≥ 30 positions give ≥ 2 distinct blunder-decision sequences", () => {',2,'it("≥ 5 seeds over the same ≥ 30 positions give ≥ 2 distinct blunder-decision sequences", () => {',4)]
for f,bh,bi,th,ti in rows:
    b=body(get("main",f),bh,bi); t=body(open(f"{W}/{f}").read(),th,ti)
    d=ti-bi
    exact=[l[d:] if l.strip() else l for l in t]==b
    norm=re.sub(r"\s+","","".join(b))==re.sub(r"\s+","","".join(t))
    print(f"{f}: base body {len(b)} lines, tip {len(t)}; identical after removing {d}-space indent: {exact}; identical modulo whitespace: {norm}")
