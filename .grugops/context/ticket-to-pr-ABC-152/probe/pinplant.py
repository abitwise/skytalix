import sys,subprocess,os,re
S=os.environ["S"]
name,old,new=sys.argv[1],sys.argv[2],sys.argv[3]
d=subprocess.check_output([S+"/bin/mkcopy.sh","pin-"+name],text=True).strip()
p=d+"/vitest.config.ts"; s=open(p).read()
assert s.count(old)==1,(name,s.count(old)); s=s.replace(old,new); open(p,"w").write(s)
r=subprocess.run(f"cd {d} && /usr/bin/diff -u {os.environ['W']}/vitest.config.ts vitest.config.ts | sed 1,2d; npx vitest run src/cli.test.ts -t 'ABC-144 A7|ABC-152 V3' 2>&1 | grep -E 'AssertionError|Tests  |^ FAIL|^ +×|✓|×'",shell=True,capture_output=True,text=True)
print("=====",name); print(r.stdout)
