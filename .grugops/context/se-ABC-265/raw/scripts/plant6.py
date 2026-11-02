import subprocess, sys, shutil
W='/home/olger/projects/public/skytalix/.claude/worktrees/se-ABC-265'
L='/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock'
src=W+'/src/transposition.ts'
orig=open(src).read()
plants={
 'P6 store order 0,1,2,3': [('  table[base + 2] = data;\n  table[base + 3] = stored;\n  table[base] = keyLo ^ data;\n  table[base + 1] = Number(key >> 32n) ^ stored;','  table[base] = keyLo ^ data;\n  table[base + 1] = Number(key >> 32n) ^ stored;\n  table[base + 2] = data;\n  table[base + 3] = stored;')],

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
