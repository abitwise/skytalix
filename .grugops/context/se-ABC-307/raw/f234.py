# f234.py <repo-worktree> <scratch> <lock> : ABC-307's F2, F3, F4 and A5's sentinel, on scratch trees only. Plants are loaded through
# arch-ABC-307-reads' raw/plants.py prefix, so nothing is retyped: plants4.py's and plants6.py's dicts, the random-half plants left out.
# Each vitest run takes the host lock on its own. base = default lane at base; tip = default lane at the tip; head = the tip under ENGINE_DEEP=1.
import json, os, re, subprocess, sys
REPO, S, LOCK = sys.argv[1:4]
src = open(f"{REPO}/.grugops/context/arch-ABC-307-reads/raw/plants.py").read()
pre = src[:src.index('if MODE == "load":')]
sys.argv = ["plants.py", REPO, S, "load"]
ns = {"__name__": "plants"}
exec(compile(pre, "plants-prefix", "exec"), ns)
TOOLP, TESTP, TIP_TEST = ns["TOOLP"], ns["TESTP"], ns["TIP_TEST"]
REL_TOOL, REL_TEST = ns["REL_TOOL"], ns["REL_TEST"]
tool0 = open(f"{S}/orig/{REL_TOOL.replace('/', '__')}").read()
tb0, tt0 = open(f"{S}/base/{REL_TEST}").read(), open(f"{S}/tip/{REL_TEST}").read()
def put(tree, rel, text): open(f"{S}/{tree}/{rel}", "w").write(text)
def apply(text, edits):
    for o, n in edits:
        if text.count(o) != 1: return None
        text = text.replace(o, n)
    return text
def run(tree, deep, extra=None):
    out = f"{S}/out/plant.json"
    for _ in (1, 2):
        if os.path.exists(out): os.remove(out)
        env = dict(os.environ, VITEST_MAX_WORKERS="1", NO_COLOR="1", NODE_OPTIONS="--max-old-space-size=400", **(extra or {}))
        env.pop("ENGINE_DEEP", None)
        if deep: env["ENGINE_DEEP"] = "1"
        subprocess.run(["flock", LOCK, "npx", "vitest", "run", REL_TEST, "--reporter=json", f"--outputFile={out}"], cwd=f"{S}/{tree}", capture_output=True, text=True, env=env)
        if os.path.exists(out) and os.path.getsize(out) > 0: break
    else:
        return None
    r = json.load(open(out))
    red = sorted(a["fullName"] for f in r["testResults"] for a in f["assertionResults"] if a["status"] == "failed")
    if any(f.get("status") == "failed" and not any(a["status"] == "failed" for a in f["assertionResults"]) for f in r["testResults"]): red.append("SUITE-ERROR")
    return r["numTotalTests"], r["numPassedTests"], r["numPendingTests"] + r["numTodoTests"], red
norm = lambda n: n.replace(" [deep, ENGINE_DEEP=1]", "")
F1 = "AR-154-TWO-POINT-CONTROL F1"
print("plant\tbase_red\ttip_default_red\thead_red\tF1_red\thead_covers_base\tmissing")
print("control", *[(x[:3], len(x[3])) if x else "UNREAD" for x in (run("base", False), run("tip", False), run("tip", True))], sep="\t", flush=True)
bad = 0
def row(name, tb, tt, tool):
    global bad
    put("base", REL_TEST, tb); put("base", REL_TOOL, tool); b = run("base", False); put("base", REL_TEST, tb0); put("base", REL_TOOL, tool0)
    put("tip", REL_TEST, tt); put("tip", REL_TOOL, tool); t = run("tip", False); h = run("tip", True); put("tip", REL_TEST, tt0); put("tip", REL_TOOL, tool0)
    if not (b and t and h): print(f"{name}\tUNREAD", flush=True); bad += 1; return
    hs = {norm(n) for n in h[3]}
    miss = sorted({norm(n) for n in b[3]} - hs)
    bad += bool(miss)
    print(f"{name}\t{len(b[3])}\t{len(t[3])}\t{len(h[3])}\t{sum(F1 in n for n in h[3])}\t{not miss}\t{' | '.join(miss)}", flush=True)
for name, edits in TOOLP.items():
    p = apply(tool0, edits)
    row(name, tb0, tt0, p) if p is not None else print(f"{name}\tn/a", flush=True)
for name, edits in TESTP.items():
    tb, tt = apply(tb0, edits), apply(tt0, edits)
    if tb is None or tt is None: print(f"{name}\tn/a base {tb is None} tip {tt is None}", flush=True); continue
    row(name, tb, tt, tool0)
print("plants where head does not cover base, or unread:", bad, flush=True)
# F4: whole-tree readNotes calls, ABC-154 A4's method (plants6.py `reads` mode), on the tip's scratch tree
imp = 'import { lstatSync, readdirSync, readFileSync, realpathSync } from "node:fs";'
hooks = [(imp, imp.replace("{ lstatSync", "{ appendFileSync, lstatSync")),
         ("  return notes.sort((a, b) => (a.path < b.path ? -1 : 1));\n", '  appendFileSync(process.env.QE5_LOG, `${folderFilter ? "filtered" : "unfiltered"}\\t${realpathSync(contextDir)}\\t${notes.length}\\n`);\n  return notes.sort((a, b) => (a.path < b.path ? -1 : 1));\n')]
inst = apply(tool0, hooks); assert inst is not None
log = f"{S}/out/reads.log"; real = os.path.realpath(f"{S}/tip/.grugops/context")
put("tip", REL_TOOL, inst)
for label, deep in (("default", False), ("ENGINE_DEEP", True)):
    if os.path.exists(log): os.remove(log)
    r = run("tip", deep, {"QE5_LOG": log})
    rows = [l.split("\t") for l in open(log).read().splitlines()]
    whole = [x for x in rows if x[0] == "unfiltered" and x[1] == real]
    print(f"F4 {label}: tests {r[1]}/{r[0]} skipped {r[2]} red {len(r[3])}; readNotes calls {len(rows)}; unfiltered on the real tree {len(whole)} (notes {[int(x[2]) for x in whole]})", flush=True)
put("tip", REL_TOOL, tool0)
assert open(f"{S}/tip/{REL_TEST}").read() == tt0 and open(f"{S}/base/{REL_TEST}").read() == tb0
assert open(f"{S}/tip/{REL_TOOL}").read() == tool0 and open(f"{S}/base/{REL_TOOL}").read() == tool0
print("restored")
