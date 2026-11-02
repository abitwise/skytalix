import subprocess, sys, shutil
W='/home/olger/projects/public/skytalix/.claude/worktrees/se-ABC-265'
L='/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock'
src=W+'/src/transposition.ts'
orig=open(src).read()
plants={
 'P1 live score read in tableCutoff': [('const score = restoredScore(hitScore, ply);','const score = restoredScore((table[(slot << 2) + 3] as number) | 0, ply);')],
 'P2 live depth read in tableCutoff': [('if (slot !== hitSlot || hitData >>> DEPTH_SHIFT !== depth) return null;','if (slot !== hitSlot || (table[(slot << 2) + 2] as number) >>> DEPTH_SHIFT !== depth) return null;')],
 'P3 no XOR: raw key halves stored and compared': [
   ('table[base] = keyLo ^ data;','table[base] = keyLo;'),
   ('table[base + 1] = Number(key >> 32n) ^ stored;','table[base + 1] = Number(key >> 32n);'),
   ('((table[base] as number) ^ data) >>> 0 !== keyLo','(table[base] as number) !== keyLo'),
   ('((table[base + 1] as number) ^ score) >>> 0 !== Number(key >> 32n)','(table[base + 1] as number) !== Number(key >> 32n)')],
 'P4 keyHi equation dropped': [('if (((table[base + 1] as number) ^ score) >>> 0 !== Number(key >> 32n)) return -1;','')],
 'P5 signed compare (no >>> 0)': [('((table[base] as number) ^ data) >>> 0 !== keyLo','((table[base] as number) ^ data) !== keyLo'),('((table[base + 1] as number) ^ score) >>> 0 !== Number(key >> 32n)','((table[base + 1] as number) ^ score) !== Number(key >> 32n)')],
}
try:
  for name, subs in plants.items():
    s=orig
    for a,b in subs:
      assert a in s, (name,a)
      s=s.replace(a,b)
    open(src,'w').write(s)
    r=subprocess.run(['flock',L,'npx','vitest','run','src/transposition.shared.test.ts','--maxWorkers=1'],cwd=W,capture_output=True,text=True,env={**__import__('os').environ,'NODE_OPTIONS':'--max-old-space-size=400'})
    out=r.stdout+r.stderr
    fails=[l.strip() for l in out.splitlines() if l.strip().startswith('FAIL') or l.strip().startswith('×')]
    tl=[l.strip() for l in out.splitlines() if l.strip().startswith('Tests ')]
    print(f'== {name}: rc={r.returncode} {tl}')
    for f in fails: print('   ',f)
finally:
  open(src,'w').write(orig)
