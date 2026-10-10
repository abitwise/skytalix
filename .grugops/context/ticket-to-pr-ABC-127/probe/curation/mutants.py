import subprocess, shutil, os, sys
SP=os.environ['SP']; C='src/puzzle-corpus.ts'
orig=open(SP+'/corpus.keep').read()
mut=[
 ('m3 accept gains a non-mating move', '"a1a6", "a1f6", "c1c6"]', '"a1a6", "a1f6", "c1c6", "a1a2"]', '1', 'ABC-127 A2'),
 ('m3 accept loses a mating move', '"a1a6", "a1f6", "c1c6"]', '"a1a6", "a1f6"]', '1', 'ABC-127 A2'),
 ('m3 row that mates in 2', 'fen: "8/7K/8/8/1k6/8/8/q1r2N2 b - - 0 1", kind: "mate-in-3", accept: ["a1a6", "a1f6", "c1c6"]', 'fen: "7k/8/5K2/8/8/8/8/R7 w - - 0 1", kind: "mate-in-3", accept: ["f6f7", "f6g6"]', '1', 'ABC-127 A2'),
 ('wm accept loses one of two best', 'accept: ["g6g7", "g6h6"]', 'accept: ["g6g7"]', '1', 'ABC-127 A2'),
 ('ABC-084 wm row accept widened', 'accept: ["d5e7"], source: `${WIN} +9`', 'accept: ["d5e7", "d5e3"], source: `${WIN} +9`', '1', 'ABC-127 A2'),
 ('quiet-key on a capture key', 'accept: ["d5g8"], tags: ["quiescence"]', 'accept: ["d5g8"], tags: ["quiescence", "quiet-key"]', '', 'quiet-key'),
 ('new row is a colour mirror', 'fen: "1K6/8/7R/3q4/k7/2p3N1/8/8 b - - 0 1"', 'fen: "8/8/K1P3n1/3Q4/7r/8/1k6/8 w - - 0 1"', '', 'colour mirror'),
 ('only 3 black-to-move win rows', None, None, '', 'harder rows'),
]
for name, old, new, deep, filt in mut:
    s=orig
    if old is None:
        # drop four black-to-move win-material rows' tags -> they stop counting as new rows; A1 shape red
        import re
        lines=s.split('\n'); n=0
        for i,l in enumerate(lines):
            if 'kind: "win-material"' in l and ' b - - 0 1' in l and 'tags:' in l and n<4:
                lines[i]=re.sub(r', tags: \[[^\]]*\]','',l); n+=1
        s='\n'.join(lines)
    else:
        assert s.count(old)==1, name
        s=s.replace(old,new)
    open(C,'w').write(s)
    env=dict(os.environ); env.pop('PUZZLE_DEEP',None)
    if deep: env['PUZZLE_DEEP']=deep
    r=subprocess.run(['npx','vitest','run','src/puzzle-suite.test.ts','-t',filt],capture_output=True,text=True,env=env)
    out=r.stdout+r.stderr
    t=[l.strip() for l in out.split('\n') if 'Tests ' in l]
    print(f'{name:40} exit {r.returncode} {t[-1] if t else ""}')
open(C,'w').write(orig)
