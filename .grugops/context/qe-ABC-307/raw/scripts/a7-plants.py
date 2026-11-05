# a7-plants.py <repo-worktree> <scratch> <lock> : ABC-307's trio plants, F2, F3 (with own's three random-half plants), A5's sentinel and F4, on scratch trees only.
# Plant text is loaded through arch-ABC-307-reads' raw/plants.py prefix and plants6.py's own Q5_TOOL, not retyped. Each vitest run takes the host lock on its own, core 0, one worker.
# base = the test file at base, default lane; tip = at the tip, default lane; head = at the tip, ENGINE_DEEP=1. One JSON object per read goes to <scratch>/out/plants.jsonl, names only.
import ast, json, os, subprocess, sys
REPO, S, LOCK = sys.argv[1:4]
src = open(f"{REPO}/.grugops/context/arch-ABC-307-reads/raw/plants.py").read()
pre = src[:src.index('if MODE == "load":')]
sys.argv = ["plants.py", REPO, S, "load"]
ns = {"__name__": "plants"}
exec(compile(pre, "plants-prefix", "exec"), ns)
TOOLP, TESTP, TIP_TEST = ns["TOOLP"], ns["TESTP"], ns["TIP_TEST"]
REL_TOOL, REL_TEST = ns["REL_TOOL"], ns["REL_TEST"]
RANDOM = {k: v for k, v in ns["ns6"]["Q5_TOOL"].items() if "random" in k}
assert len(RANDOM) == 3 and len({json.dumps(v) for v in RANDOM.values()}) == 1
tool0 = open(f"{S}/orig/{REL_TOOL.replace('/', '__')}").read()
tb0, tt0 = open(f"{S}/base/{REL_TEST}").read(), open(f"{S}/tip/{REL_TEST}").read()
LOG = open(f"{S}/out/plants.jsonl", "a")
TOTAL = {("base", False): 32, ("tip", False): 32, ("tip", True): 36}
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
        subprocess.run(["flock", LOCK, "taskset", "-c", "0", "npx", "vitest", "run", REL_TEST, "--reporter=json", f"--outputFile={out}"], cwd=f"{S}/{tree}", capture_output=True, text=True, env=env)
        if os.path.exists(out) and os.path.getsize(out) > 0: break
    else:
        return None
    r = json.load(open(out))
    red = sorted(a["fullName"] for f in r["testResults"] for a in f["assertionResults"] if a["status"] == "failed")
    suite = any(f.get("status") == "failed" and not any(a["status"] == "failed" for a in f["assertionResults"]) for f in r["testResults"])
    if suite: red.append("SUITE-ERROR")
    if r["numTotalTests"] != TOTAL[(tree, deep)] and not suite: return None
    return {"total": r["numTotalTests"], "passed": r["numPassedTests"], "skipped": r["numPendingTests"] + r["numTodoTests"], "red": red}
def emit(name, side, res, draw=None):
    LOG.write(json.dumps({"plant": name, "side": side, "draw": draw, "read": res}, ensure_ascii=False) + "\n"); LOG.flush()
    print(name, side, draw if draw is not None else "", "UNREAD" if res is None else f"{res['passed']}/{res['total']} red {len(res['red'])}", flush=True)
def read(name, tb, tt, tool, sides=("base", "tip", "head"), draw=None):
    if "base" in sides:
        put("base", REL_TEST, tb); put("base", REL_TOOL, tool); emit(name, "base", run("base", False), draw); put("base", REL_TEST, tb0); put("base", REL_TOOL, tool0)
    if "tip" in sides or "head" in sides:
        put("tip", REL_TEST, tt); put("tip", REL_TOOL, tool)
        if "tip" in sides: emit(name, "tip", run("tip", False), draw)
        if "head" in sides: emit(name, "head", run("tip", True), draw)
        put("tip", REL_TEST, tt0); put("tip", REL_TOOL, tool0)
read("control (unmutated)", tb0, tt0, tool0)
for name, edits in TOOLP.items():
    p = apply(tool0, edits)
    if p is None: print(name, "n/a", flush=True); emit(name, "n/a", None); continue
    read(name, tb0, tt0, p)
for name, edits in TESTP.items():
    tb, tt = apply(tb0, edits), apply(tt0, edits)
    if tb is None or tt is None: emit(name, "n/a", None); continue
    read(name, tb, tt, tool0)
for name, edits in TIP_TEST.items():
    tt = apply(tt0, edits); assert tt is not None, name
    read(name, tb0, tt, tool0, sides=("tip",))
def random_draws(n, sides):
    for name, edits in RANDOM.items():
        p = apply(tool0, edits); assert p is not None, name
        for d in range(n): read(name, tb0, tt0, p, sides=sides, draw=d)
if "--top-up" in os.environ.get("A7_MODE", ""):
    random_draws(5, ("head",))
else:
    random_draws(5, ("base", "head"))
    # F4: whole-tree readNotes calls, ABC-154 A4's method (plants6.py `reads` mode), as se-ABC-307's f234.py read it
    imp = 'import { lstatSync, readdirSync, readFileSync, realpathSync } from "node:fs";'
    hooks = [(imp, imp.replace("{ lstatSync", "{ appendFileSync, lstatSync")),
             ("  return notes.sort((a, b) => (a.path < b.path ? -1 : 1));\n", '  appendFileSync(process.env.QE5_LOG, `${folderFilter ? "filtered" : "unfiltered"}\\t${realpathSync(contextDir)}\\t${notes.length}\\n`);\n  return notes.sort((a, b) => (a.path < b.path ? -1 : 1));\n')]
    inst = apply(tool0, hooks); assert inst is not None
    log = f"{S}/out/reads.log"; real = os.path.realpath(f"{S}/tip/.grugops/context")
    put("tip", REL_TOOL, inst)
    for label, deep in (("default", False), ("ENGINE_DEEP", True)):
        if os.path.exists(log): os.remove(log)
        r = run("tip", deep, {"QE5_LOG": log})
        rows = [l.split("\t") for l in open(log).read().splitlines()] if os.path.exists(log) and os.path.getsize(log) else []
        whole = [x for x in rows if x[0] == "unfiltered" and x[1] == real]
        print(f"F4 {label}: tests {r and r['passed']}/{r and r['total']} skipped {r and r['skipped']} red {r and len(r['red'])}; readNotes calls {len(rows)}; unfiltered on the real tree {len(whole)} (notes {[int(x[2]) for x in whole]})", flush=True)
    put("tip", REL_TOOL, tool0)
assert open(f"{S}/tip/{REL_TEST}").read() == tt0 and open(f"{S}/base/{REL_TEST}").read() == tb0
assert open(f"{S}/tip/{REL_TOOL}").read() == tool0 and open(f"{S}/base/{REL_TOOL}").read() == tool0
print("restored")
