# qe-ABC-305: reads the lanes' JSON reports. Usage: python3 -I report-read.py <lanes out dir>
import json,os,re,sys
O=sys.argv[1]
def J(n):
    p=f"{O}/{n}.json"
    if not os.path.getsize(p): raise SystemExit(n+" EMPTY")
    return json.load(open(p))
def rows(j):
    return {(re.sub(r".*/(src|tools)/",r"\1/",f["name"]),t["fullName"]):t for f in j["testResults"] for t in f["assertionResults"]}
tip=rows(J("tip-last-run")); main=rows(J("main-last-run"))
print("A4 tip rows",len(tip),"main rows",len(main))
new=[k for k in tip if k not in main]; gone=[k for k in main if k not in tip]
print("A4 in tip not main:",len(new)); [print("  +",k[0],"::",k[1][:130]) for k in new]
print("A4 in main not tip:",len(gone)); [print("  -",k[0],"::",k[1][:130]) for k in gone]
print("A4 rows not passed: tip",sum(t["status"]!="passed" for t in tip.values()),"main",sum(t["status"]!="passed" for t in main.values()))
print("A4 files equal:",{k[0] for k in tip}=={k[0] for k in main})
def count(rs,f): return sum(1 for k in rs if k[0]==f)
for n,f in (("tune","tools/tune/tune.test.ts"),("passer","src/evaluate.passer.test.ts"),("book","src/book.test.ts"),("qehop","tools/grugops/qe-hop-integrity.test.ts"),("cli-flag","src/cli.test.ts"),("cli-noflag","src/cli.test.ts"),("king","src/evaluate.king-mobility.test.ts"),("uci","src/uci-session.test.ts"),("clireal","src/cli.real-engine.test.ts")):
    j=J(n); r=rows(j); st={}
    for t in r.values(): st[t["status"]]=st.get(t["status"],0)+1
    d=sum("[deep" in k[1] for k in r)
    print(f"lane {n}: files {len(j['testResults'])} numTotal {j['numTotalTests']} passed {j['numPassedTests']} failed {j['numFailedTests']} pending {j['numPendingTests']} todo {j['numTodoTests']} statuses {st}; rows naming [deep {d}; same file in default lane {count(tip,f)}")
c1=set(rows(J("cli-flag")));c2=set(rows(J("cli-noflag")));print("cli rows flag on vs off identical:",c1==c2,"and equal to default lane's:",c1=={k for k in tip if k[0]=="src/cli.test.ts"})
k1=set(rows(J("king")));print("king rows with ENGINE_DEEP equal default lane's:",k1=={k for k in tip if k[0]=="src/evaluate.king-mobility.test.ts"})
print("A7 rows:")
pat=[("P1",tip,r"ABC-301 P1"),("P2",tip,r"QE-271-g"),("P3",rows(J("tune")),r"ABC-301 QE-271-i"),("twins",tip,r"phase-24 twin bites"),("QE-301 bound",rows(J("tune")),r"ABC-301: ")]
for n,rs,p in pat:
    for k,t in rs.items():
        if re.search(p,k[1]): print(f"  {n} {t['status']} {k[0]} :: {k[1][:150]}")
j=J("line23-json"); r=rows(j); print("line23 report: passed",j["numPassedTests"],"failed",j["numFailedTests"],"pending",j["numPendingTests"],"total",j["numTotalTests"]); [print("  ",t["status"],k[1][:120]) for k,t in r.items() if t["status"]=="passed"]
