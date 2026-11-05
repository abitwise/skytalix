# plants.py <repo-worktree> <scratch> [load] : ABC-105's and ABC-154's plants on the file that alone imports the tool, at base and tip.
# Plant text is loaded, not retyped: plants4.py's prefix and plants6.py's dicts, as qe-ABC-154 did. The random-half plants are left out:
# they read differently on each run, so a kill set means nothing. The caller holds the lock and the core.
import ast, hashlib, json, os, re, subprocess, sys
REPO, S = sys.argv[1], sys.argv[2]
MODE = sys.argv[3] if len(sys.argv) > 3 else "run"
REL_TOOL, REL_TEST = "tools/grugops/qe-hop-integrity.js", "tools/grugops/qe-hop-integrity.test.ts"
ctx = f"{REPO}/.grugops/context"
src4 = open(f"{ctx}/qe4-ABC-105/probe/plants4.py").read()
pre = src4[:src4.index("PAIRS = {")]
ns = {"__name__": "plants4"}
argv, sys.argv = sys.argv, ["plants4.py", REPO, f"{S}/tip"]
exec(compile(pre, "plants4-prefix", "exec"), ns)
sys.argv = argv
RECORDED, Q4_TOOL, Q4_TEST = ns["RECORDED"], ns["Q4_TOOL"], ns["Q4_TEST"]
RECORDED.pop("none (unmutated tool)", None)
tree6 = ast.parse(open(f"{ctx}/qe-ABC-154/probe/plants6.py").read())
ns6 = {"Q4": {k: ns[k] for k in ("LOOP", "MEMO_A_READ")}, "LOOP": ns["LOOP"], "MEMO_A_READ": ns["MEMO_A_READ"]}
for node in ast.walk(tree6):
    if isinstance(node, ast.Assign) and isinstance(node.targets[0], ast.Name) and node.targets[0].id in ("FM", "MD", "HASH", "Q5_TOOL", "Q5_TEST", "Q5_EXTRA"):
        exec(compile(ast.Module([node], []), "plants6", "exec"), ns6)
Q5_TOOL = {k: v for k, v in ns6["Q5_TOOL"].items() if "random" not in k}
Q5_TEST, Q5_EXTRA = ns6["Q5_TEST"], ns6["Q5_EXTRA"]
OWN_TOOL = {  # ADR-0046 § Dated 2026-11-05 (arch-ABC-307)
  "MQ2": [("    if (!names(note.folder, n)) continue;\n", "")],
  "MQ3": [("          coveredSubstitute: of(SUBSTITUTE).length,\n", "          coveredSubstitute: of(SUBSTITUTE).length + 1,\n")],
  # A sentinel, not a mutant: any unfiltered readNotes of the real tree throws. Base goes red; the tip must read 0 red (the page's A5).
  "A5R": [("  const notes = [];\n", '  const notes = [];\n  if (!folderFilter && !contextDir.includes("qe-hop-")) throw new Error("A5R");\n')],
}
FILT = '      return !folder || (NAMED(folder) && (part === undefined || part === "notes"));\n'
READN = '    const named = readNotes(join(ROOT, ".grugops/context"), NAMED);\n'
TIP_TEST = {  # q4b, re-anchored at the tip on what the remnants read in place of the two memos
  "q4b-tip-named-read-empty": [(READN, "    const named: ReturnType<typeof readNotes> = [];\n")],
  "q4b-tip-copied-root-empty": [(FILT, "      return !folder;\n")],
  "q4b-tip-both-empty (two faults)": [(READN, "    const named: ReturnType<typeof readNotes> = [];\n"), (FILT, "      return !folder;\n")],
}
TOOLP = {**RECORDED, **Q4_TOOL, **Q5_TOOL, **Q5_EXTRA, **OWN_TOOL}
TESTP = {**Q4_TEST, **Q5_TEST}
if MODE == "load":
    blob = json.dumps({"tool": TOOLP, "test": TESTP, "tip_test": TIP_TEST}, sort_keys=True, ensure_ascii=False, indent=0)
    print(f"tool plants {len(TOOLP)} (recorded {len(RECORDED)}, q4 {len(Q4_TOOL)}, q5 {len(Q5_TOOL)}, q5x {len(Q5_EXTRA)}, own {len(OWN_TOOL)}); test plants {len(TESTP)}; tip test plants {len(TIP_TEST)}; sha256 {hashlib.sha256(blob.encode()).hexdigest()}")
    tool = open(f"{S}/orig/{REL_TOOL.replace('/', '__')}").read()
    test_b = open(f"{S}/base/{REL_TEST}").read(); test_t = open(f"{S}/tip/{REL_TEST}").read()
    na = [k for k, e in TOOLP.items() if any(tool.count(o) != 1 for o, _ in e)]
    print("tool plants n/a:", na)
    print("test plants n/a at base:", [k for k, e in TESTP.items() if any(test_b.count(o) != 1 for o, _ in e)])
    print("test plants n/a at tip:", [k for k, e in TESTP.items() if any(test_t.count(o) != 1 for o, _ in e)])
    print("tip plants n/a:", [k for k, e in TIP_TEST.items() if any(test_t.count(o) != 1 for o, _ in e)])
    sys.exit(0)
def run(tree, deep, name):
    out = f"{S}/out/plant.json"
    for attempt in (1, 2):
        if os.path.exists(out): os.remove(out)
        env = dict(os.environ, VITEST_MAX_WORKERS="1", NO_COLOR="1", NODE_OPTIONS="--max-old-space-size=400")
        env.pop("ENGINE_DEEP", None)
        if deep: env["ENGINE_DEEP"] = "1"
        subprocess.run(["npx", "vitest", "run", REL_TEST, "--reporter=json", f"--outputFile={out}"], cwd=f"{S}/{tree}", capture_output=True, text=True, env=env)
        if os.path.exists(out) and os.path.getsize(out) > 0: break
    else:
        return None
    r = json.load(open(out))
    red = sorted(a["fullName"] for f in r["testResults"] for a in f["assertionResults"] if a["status"] == "failed")
    suite = [f["name"] for f in r["testResults"] if f.get("status") == "failed" and not any(a["status"] == "failed" for a in f["assertionResults"])]
    if suite: red.append("SUITE-ERROR")
    return r["numTotalTests"], red
TRIO = {"Q1": "--sweep lists ABC-073 as a finding", "Q2": "coverage() over EVERY real note", "Q3": "prints each count line and every finding by id"}
REM = {"Q1~": "--sweep on a copy of the named folders", "Q2~": "coverage() over the named folders' real notes", "Q3~": "on a copy of the named folders: prints each count line"}
def tag(names, table): return ",".join(k for k, t in table.items() if any(t in n for n in names)) or "-"
def put(tree, rel, text): open(f"{S}/{tree}/{rel}", "w").write(text)
def apply(text, edits):
    for o, n in edits:
        if text.count(o) != 1: return None
        text = text.replace(o, n)
    return text
tool0 = open(f"{S}/orig/{REL_TOOL.replace('/', '__')}").read()
tb0, tt0 = open(f"{S}/base/{REL_TEST}").read(), open(f"{S}/tip/{REL_TEST}").read()
rows = []
print("plant\tbase_red\tbase_trio\ttip_red\ttip_remnants\tdeep_red\tdeep_rows")
def one(name, tb, tt, tool_b, tool_t, deep_too=True):
    base = None
    if tb is not None and tool_b is not None:
        put("base", REL_TEST, tb); put("base", REL_TOOL, tool_b)
        base = run("base", False, name)
        put("base", REL_TEST, tb0); put("base", REL_TOOL, tool0)
    tip = dp = None
    if tt is not None and tool_t is not None:
        put("tip", REL_TEST, tt); put("tip", REL_TOOL, tool_t)
        tip = run("tip", False, name)
        trio_killed = base is None or any(t in n for t in TRIO.values() for n in base[1])
        if deep_too and trio_killed: dp = run("tip", True, name)
        put("tip", REL_TEST, tt0); put("tip", REL_TOOL, tool0)
    f = lambda x: "n/a" if x is None else str(len(x[1]))
    bt = "-" if base is None else tag(base[1], TRIO)
    tr = "-" if tip is None else tag(tip[1], REM)
    dr = "-" if dp is None else ",".join(k for k, t in TRIO.items() if any(t in n and "[deep" in n for n in dp[1])) or "-"
    print(f"{name}\t{f(base)}\t{bt}\t{f(tip)}\t{tr}\t{f(dp) if dp else 'n/r'}\t{dr}", flush=True)
for name, edits in TOOLP.items():
    planted = apply(tool0, edits)
    one(name, tb0, tt0, planted, planted)
for name, edits in TESTP.items():
    one(name, apply(tb0, edits), None, tool0, None)
    t = apply(tt0, edits)
    if t is not None:  # the memos stay under the constant, so the plant reaches only the deep rows
        put("tip", REL_TEST, t); dp = run("tip", True, name); dd = run("tip", False, name); put("tip", REL_TEST, tt0)
        print(f"{name} [tip]\tn/a\t-\t{len(dd[1]) if dd else 'UNREAD'}\t{tag(dd[1], REM) if dd else '-'}\t{len(dp[1]) if dp else 'UNREAD'}\t{','.join(k for k, v in TRIO.items() if dp and any(v in n and '[deep' in n for n in dp[1])) or '-'}", flush=True)
for name, edits in TIP_TEST.items():
    one(name, None, apply(tt0, edits), None, tool0, deep_too=False)
assert open(f"{S}/tip/{REL_TEST}").read() == tt0 and open(f"{S}/base/{REL_TEST}").read() == tb0
assert open(f"{S}/tip/{REL_TOOL}").read() == tool0 and open(f"{S}/base/{REL_TOOL}").read() == tool0
print("restored")
