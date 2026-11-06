import subprocess,sys,os,shutil
S=sys.argv[1];L=sys.argv[2]
M=[("white stop-attack rank guard","            (rank <= 4 &&\n","            (rank <= 3 &&\n"),("black stop-attack rank guard","            (rank >= 3 &&\n","            (rank >= 4 &&\n"),]
Z=[("x","y","z"),
("white stop-attack rank guard","            (rank <= 4 &&\n","            (rank <= 3 &&\n"),
("black rear left compare","          (left === 0 || left < rank) &&\n","          (left === 0 || left <= rank) &&\n"),
("white rear right compare","          (right === 0 || right > rank) &&\n","          (right === 0 || right >= rank) &&\n"),
("black connected rank not flipped","blackConnected += PACKED_CONNECTED[7 - rank] as number;","blackConnected += PACKED_CONNECTED[rank] as number;"),
("taper door adds part","whiteMinusBlack(position, true, true, false, false, 0)","whiteMinusBlack(position, true, true, false, true, 0)"),
("off door adds part","whiteMinusBlack(position, true, true, true, false, phase)","whiteMinusBlack(position, true, true, true, true, phase)"),
("shape sign","    whiteConnected + whitePhalanx - whiteBackward - (blackConnected + blackPhalanx - blackBackward);","    whiteConnected + whitePhalanx + whiteBackward - (blackConnected + blackPhalanx + blackBackward);"),
]
ev=f"{S}/mut/src/evaluate.ts"; orig=open(ev).read()
for name,a,b in M:
    assert a in orig,name
    open(ev,'w').write(orig.replace(a,b,1))
    r=subprocess.run(["flock",L,"env","NODE_OPTIONS=--max-old-space-size=400","npx","vitest","run","src/evaluate.pawns.test.ts"],cwd=f"{S}/mut",capture_output=True,text=True)
    import re
    out=re.sub(r'\x1b\[[0-9;]*m','',r.stdout)
    print(name,"rc",r.returncode,[l.strip() for l in out.splitlines() if l.strip().startswith('Tests')])
open(ev,'w').write(orig)
