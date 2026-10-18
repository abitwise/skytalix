import json, subprocess, sys, os, hashlib
sys.path.insert(0, os.path.dirname(__file__))
from mutants import MUTANTS
WT = "/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-ABC-170"
SCR = os.path.dirname(__file__)
P = os.path.join(WT, "src/engine.ts")
orig = open(P).read()
md5 = lambda s: hashlib.md5(s.encode()).hexdigest()
only = sys.argv[1:]
res = {}
try:
    for mid, desc, edits in MUTANTS:
        if only and mid not in only: continue
        s = orig
        for old, new in edits:
            assert s.count(old) == 1, (mid, old)
            s = s.replace(old, new)
        open(P, "w").write(s)
        out = os.path.join(SCR, f"{mid}.json")
        r = subprocess.run(["npx", "vitest", "run", "--reporter=json", f"--outputFile={out}", "--testTimeout=120000"], cwd=WT, capture_output=True, text=True, env={**os.environ, "ENGINE_DEEP": "", "PERFT_DEEP": "", "CLI_DEEP": "", "SEARCH_DEEP": ""})
        try:
            j = json.load(open(out))
            failed = [f"{os.path.basename(t['name'])} :: {a['fullName']}" for t in j["testResults"] for a in t["assertionResults"] if a["status"] == "failed"]
            fileerr = [os.path.basename(t['name']) + ": " + t.get("message","")[:120] for t in j["testResults"] if t.get("status") == "failed" and not any(a["status"]=="failed" for a in t["assertionResults"])]
            summary = f"{j['numPassedTests']}/{j['numTotalTests']} passed, {j['numFailedTests']} failed"
        except Exception as e:
            failed, fileerr, summary = [], [f"NO JSON: {e}; rc={r.returncode}; {r.stderr[-300:]}"], "ERROR"
        verdict = "KILLED" if (failed or fileerr) else "SURVIVED"
        res[mid] = {"desc": desc, "verdict": verdict, "summary": summary, "failed": failed, "fileerr": fileerr}
        print(mid, verdict, summary, desc, flush=True)
        for f in failed: print("   ", f, flush=True)
        for f in fileerr: print("   FILE", f, flush=True)
finally:
    open(P, "w").write(orig)
    print("restored md5", md5(open(P).read()), "orig", md5(orig))
json.dump(res, open(os.path.join(SCR, "results-" + ("-".join(only) or "all") + ".json"), "w"), indent=1)
