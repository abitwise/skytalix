#!/usr/bin/env python3
# fix2-ABC-105: every recorded plant, re-run against the OLD pair (test file at db1cfb6c, tool at
# 60415a8a) and the NEW pair (test file and tool at the fix2 code commit), in an OUT-OF-REPO
# `git archive` tree. The plant text is NOT retyped. It is loaded verbatim (ast.literal_eval of the
# PLANTS dict) from QE's qe-ABC-105/probe/plants.py, QE2's qe2-ABC-105/probe/plants2.py and the
# Engineer's fix-ABC-105/probe/plants.py, as committed at 48a78f08. If two files hold the same name
# with different text, both run. The tool is restored and checked with cmp after every plant.
# Then a separate pass, `reads`, instruments readNotes to count the WHOLE-TREE reads of the real notes
# (no folder filter, contextDir == <plant>/.grugops/context) for one run of each test file.
#
# usage: plants3.py <repo-worktree> <scratch-dir> <new-commit>
import ast, filecmp, json, os, re, shutil, subprocess, sys

REPO, SCRATCH, NEW = sys.argv[1], sys.argv[2], sys.argv[3]
P = os.path.join(SCRATCH, "plant")
TOOL = os.path.join(P, "tools/grugops/qe-hop-integrity.js")
TEST = os.path.join(P, "tools/grugops/qe-hop-integrity.test.ts")
REL_TOOL, REL_TEST = "tools/grugops/qe-hop-integrity.js", "tools/grugops/qe-hop-integrity.test.ts"


def show(rev, path):
    return subprocess.run(["git", "show", f"{rev}:{path}"], cwd=REPO, capture_output=True, text=True, check=True).stdout


def plants_of(path):
    src = show("48a78f08", path)
    m = re.search(r"^PLANTS = (\{.*?^\})\n", src, re.S | re.M)
    return ast.literal_eval(m.group(1))


PLANTS = {"none (unmutated tool)": []}
for source in ("qe-ABC-105/probe/plants.py", "qe2-ABC-105/probe/plants2.py", "fix-ABC-105/probe/plants.py"):
    for name, edits in plants_of(f".grugops/context/{source}").items():
        if name in PLANTS and PLANTS[name] != edits:
            name = f"{name} [{source.split('/')[0]}]"
        PLANTS.setdefault(name, edits)

PAIRS = {
    "old": (show("db1cfb6c", REL_TEST), show("60415a8a", REL_TOOL)),
    "new": (show(NEW, REL_TEST), show(NEW, REL_TOOL)),
}


def run_tests(env=None):
    out = os.path.join(SCRATCH, "r.json")
    if os.path.exists(out):
        os.remove(out)
    subprocess.run(["npx", "vitest", "run", REL_TEST, "--reporter=json", f"--outputFile={out}"],
                   cwd=P, capture_output=True, text=True, env=env)
    r = json.load(open(out))
    red = [a["fullName"] for f in r["testResults"] for a in f["assertionResults"] if a["status"] != "passed"]
    return r["numTotalTests"], r["numPassedTests"], r["numPendingTests"] + r["numTodoTests"], red


def sweep():
    p = subprocess.run(["node", REL_TOOL, "--sweep"], cwd=P, capture_output=True, text=True)
    nums = [l.rsplit(": ", 1)[-1] for l in p.stdout.split("\n")
            if l.startswith(("Done rows:", "Pre-cutover", "Covered (qe-e2e):", "Covered (security", "In-scope findings:"))]
    return p.returncode, "/".join(nums), "  ABC-073: no QE verdict note was found.\n" in p.stdout


def write(path, text):
    with open(path, "w") as f:
        f.write(text)


mode = sys.argv[4] if len(sys.argv) > 4 else "plants"
if mode == "plants":
    for label, (test, tool) in PAIRS.items():
        write(TEST, test)
        for name, edits in PLANTS.items():
            src = tool
            for old, new in edits:
                assert src.count(old) == 1, (label, name, old, src.count(old))
                src = src.replace(old, new)
            write(TOOL, src)
            t, p, skip, red = run_tests()
            code, nums, lists073 = sweep()
            print(f"[{label}] {name}\ttests {p}/{t}\tskipped {skip}\tred {len(red)}\tsweep exit {code} {nums} lists-ABC-073 {lists073}")
            for x in red:
                print(f"    RED: {x}")
            write(TOOL, tool)
            assert open(TOOL).read() == tool
    print("plants applied:", len(PLANTS), "(incl. none)")
else:  # reads
    log = os.path.join(SCRATCH, "reads.log")
    real = os.path.join(P, ".grugops/context")
    hook_old = "export function readNotes(contextDir, folderFilter) {\n"
    hook_new = hook_old + "  if (!folderFilter) appendFileSync(process.env.READ_LOG, `${contextDir}\\n`);\n"
    imp_old = 'import { lstatSync, readdirSync, readFileSync, realpathSync } from "node:fs";'
    imp_new = 'import { appendFileSync, lstatSync, readdirSync, readFileSync, realpathSync } from "node:fs";'
    for label, (test, tool) in PAIRS.items():
        write(TEST, test)
        assert tool.count(hook_old) == 1 and tool.count(imp_old) == 1
        write(TOOL, tool.replace(imp_old, imp_new).replace(hook_old, hook_new))
        if os.path.exists(log):
            os.remove(log)
        t, p, skip, red = run_tests(dict(os.environ, READ_LOG=log))
        lines = open(log).read().splitlines() if os.path.exists(log) else []
        whole_real = sum(1 for l in lines if os.path.realpath(l) == os.path.realpath(real))
        print(f"[{label}] tests {p}/{t} red {len(red)}\tunfiltered readNotes calls {len(lines)}\t"
              f"of which WHOLE-TREE reads of the real notes {whole_real}\t(the rest are synthetic temp trees)")
        write(TOOL, tool)
        assert open(TOOL).read() == tool
    write(TEST, PAIRS["new"][0])
    write(TOOL, PAIRS["new"][1])
print("restored to new pair; cmp tool:", open(TOOL).read() == PAIRS["new"][1], "; cmp test:", open(TEST).read() == PAIRS["new"][0])
