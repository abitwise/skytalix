# usage: python3 plant.py <spec.py>   spec defines NAME, CMD, EDITS=[(file, old, new), ...], optional REV
import subprocess,os,sys
S=os.environ["S"]; W=os.environ["W"]
spec={}; exec(open(sys.argv[1]).read(),spec)
d=subprocess.check_output([S+"/bin/mkcopy.sh",spec["NAME"],spec.get("REV","HEAD")],text=True).strip()
for f,o,n in spec["EDITS"]:
    p=d+"/"+f; s=open(p).read(); c=s.count(o)
    assert c==1,(f,c,o[:80]); open(p,"w").write(s.replace(o,n))
out=[f"===== PLANT {spec['NAME']}  (copy {d}, rev {spec.get('REV','HEAD')})"]
for f in sorted({e[0] for e in spec["EDITS"]}):
    out.append(subprocess.run(["/usr/bin/diff","-u",f"{W}/{f}",f"{d}/{f}"],capture_output=True,text=True).stdout)
r=subprocess.run(f"cd {d} && {spec['CMD']} 2>&1",shell=True,capture_output=True,text=True)
lines=r.stdout.splitlines()
keep=[l for l in lines if any(k in l for k in ("AssertionError","Error:","Tests  ","Test Files","FAIL ","×","expected","TypeError"))]
out.append("CMD: "+spec["CMD"]); out.append("\n".join(keep[:40])); out.append(f"exit {r.returncode}")
txt="\n".join(out); print(txt)
os.makedirs(S+"/plant-log",exist_ok=True); open(S+"/plant-log/"+spec["NAME"]+".txt","w").write(r.stdout+"\n----\n"+txt)
