#!/usr/bin/env python3
# ticket-to-pr-ABC-154: every recorded plant (the 23 qe4-ABC-105 loads from QE's, QE2's and fix's probes, "none"
# included) plus the 9 defined in qe4-ABC-105/probe/plants4.py, run against the BASE pair (test file + tool at
# main 69a1f4b4, both cmp 0 to 8fd0c233) and the HEAD pair (the worktree's test file + tool), in an OUT-OF-REPO
# `git archive 69a1f4b4` tree. Plant text is NOT retyped:
#   - the 23 recorded PLANTS dicts are loaded with ast.literal_eval from the probe files as committed at
#     cfcd59af (blob-identical at 69a1f4b4), exactly as plants4.py loads them;
#   - plants4.py's own 9 are string expressions over named constants (READ, LOOP, MEMO_A, ...), which
#     ast.literal_eval cannot read. Their top-level assignment statements are parsed out of plants4.py as
#     committed at 69a1f4b4 and evaluated unedited, in file order. The `reads` mode's instrumentation hooks
#     (hook_fn, hook_rd, imp, ...) are taken from the same file the same way (fix2's / qe4's method).
# Tool and test are restored and compared after every plant.
#
# usage: python3 -I plants5.py <repo-worktree> <scratch-plant-tree> plants [base|head|base,head]
#        python3 -I plants5.py <repo-worktree> <scratch-plant-tree> reads
#        python3 -I plants5.py <repo-worktree> <scratch-plant-tree> sweep
import ast, json, os, re, subprocess, sys

REPO, P, MODE = sys.argv[1], sys.argv[2], sys.argv[3]
WHICH = (sys.argv[4] if len(sys.argv) > 4 else "base,head").split(",")
BASE = "69a1f4b4"
REL_TOOL, REL_TEST = "tools/grugops/qe-hop-integrity.js", "tools/grugops/qe-hop-integrity.test.ts"
TOOL, TEST = os.path.join(P, REL_TOOL), os.path.join(P, REL_TEST)
OUTJ = os.path.join(P, "..", "r.json")


def show(rev, path):
    return subprocess.run(["git", "show", f"{rev}:{path}"], cwd=REPO, capture_output=True, text=True, check=True).stdout


def plants_of(path):
    m = re.search(r"^PLANTS = (\{.*?^\})\n", show("cfcd59af", path), re.S | re.M)
    return ast.literal_eval(m.group(1))


RECORDED = {"none (unmutated tool)": []}
for source in ("qe-ABC-105/probe/plants.py", "qe2-ABC-105/probe/plants2.py", "fix-ABC-105/probe/plants.py"):
    for name, edits in plants_of(f".grugops/context/{source}").items():
        if name in RECORDED and RECORDED[name] != edits:
            name = f"{name} [{source.split('/')[0]}]"
        RECORDED.setdefault(name, edits)

P4 = ast.parse(show(BASE, ".grugops/context/qe4-ABC-105/probe/plants4.py"))
NS = {}


def evaluate(stmts, names):
    for node in stmts:
        if isinstance(node, ast.Assign) and any(isinstance(t, ast.Name) and t.id in names for t in node.targets):
            exec(compile(ast.Module([node], []), "plants4.py", "exec"), NS)


evaluate(P4.body, {"READ", "LOOP", "Q4_TOOL", "MEMO_A", "MEMO_A_READ", "MEMO_S_READ", "Q4_TEST"})
READS_BRANCH = next(n for n in P4.body if isinstance(n, ast.If)).orelse
evaluate(READS_BRANCH, {"hook_fn", "hook_fn_new", "hook_rd", "hook_rd_new", "imp", "imp_new"})
Q4_TOOL, Q4_TEST = NS["Q4_TOOL"], NS["Q4_TEST"]
assert len(RECORDED) == 23 and len(Q4_TOOL) + len(Q4_TEST) == 9, (len(RECORDED), len(Q4_TOOL), len(Q4_TEST))

PAIRS = {"base": (show(BASE, REL_TEST), show(BASE, REL_TOOL)),
         "head": (open(os.path.join(REPO, REL_TEST)).read(), open(os.path.join(REPO, REL_TOOL)).read())}


def write(path, text):
    with open(path, "w") as f:
        f.write(text)


def apply(src, edits):
    for old, new in edits:
        if src.count(old) != 1:
            return None
        src = src.replace(old, new)
    return src


def run_tests(env=None):
    if os.path.exists(OUTJ):
        os.remove(OUTJ)
    subprocess.run(["npx", "vitest", "run", REL_TEST, "--reporter=json", f"--outputFile={OUTJ}"],
                   cwd=P, capture_output=True, text=True, env=env)
    r = json.load(open(OUTJ))
    red = sorted(a["fullName"] for f in r["testResults"] for a in f["assertionResults"] if a["status"] != "passed")
    return r["numTotalTests"], r["numPassedTests"], r["numPendingTests"] + r["numTodoTests"], red


def sweep(args=("--sweep",)):
    return subprocess.run(["node", REL_TOOL, *args], cwd=P, capture_output=True, text=True)


def sweep_nums():
    p = sweep()
    nums = [l.rsplit(": ", 1)[-1] for l in p.stdout.split("\n")
            if l.startswith(("Done rows:", "Pre-cutover", "Covered (qe-e2e):", "Covered (security", "In-scope findings:"))]
    return p.returncode, "/".join(nums), "  ABC-073: no QE verdict note was found.\n" in p.stdout


def restore(label):
    test, tool = PAIRS[label]
    write(TEST, test)
    write(TOOL, tool)
    assert open(TOOL).read() == tool and open(TEST).read() == test, label


if MODE == "plants":
    print("recorded plants loaded:", len(RECORDED), "(incl. none); plants4.py plants:", len(Q4_TOOL) + len(Q4_TEST))
    for label in WHICH:
        test, tool = PAIRS[label]
        for name, edits in list(RECORDED.items()) + list(Q4_TOOL.items()) + list(Q4_TEST.items()):
            is_test = name in Q4_TEST
            planted = apply(test if is_test else tool, edits)
            if planted is None:
                print(f"[{label}] {name}\tn/a (plant text matches 0 or >1 times in this pair)")
                continue
            write(TEST, planted if is_test else test)
            write(TOOL, tool if is_test else planted)
            t, p, skip, red = run_tests()
            code, nums, l073 = sweep_nums()
            print(f"[{label}] {name}\ttests {p}/{t}\tskipped {skip}\tred {len(red)}\tsweep exit {code} {nums} lists-ABC-073 {l073}")
            for x in red:
                print(f"    RED: {x}")
            restore(label)
elif MODE == "reads":
    log = os.path.join(P, "..", "reads.log")
    real = os.path.realpath(os.path.join(P, ".grugops/context"))
    total = int(subprocess.run(f"find '{real}' -path '*/notes/*.md' | wc -l", shell=True, capture_output=True, text=True).stdout)
    edits = [(NS["imp"], NS["imp_new"]), (NS["hook_fn"], NS["hook_fn_new"]), (NS["hook_rd"], NS["hook_rd_new"])]
    print(f"real notes tree holds {total} note files")
    for label in WHICH:
        test, tool = PAIRS[label]
        write(TEST, test)
        write(TOOL, apply(tool, edits))
        if os.path.exists(log):
            os.remove(log)
        t, p, skip, red = run_tests(dict(os.environ, READ_LOG=log))
        rows = [l.split("\t") for l in open(log).read().splitlines()]
        calls = [r for r in rows if r[0] == "CALL"]
        whole = sum(1 for r in calls if r[1] == "unfiltered" and os.path.realpath(r[2]) == real)
        filt = sum(1 for r in calls if r[1] == "filtered" and os.path.realpath(r[2]) == real)
        files = sum(1 for r in rows if r[0] == "FILE" and os.path.realpath(r[1]).startswith(real + os.sep))
        print(f"[{label}] tests {p}/{t} red {len(red)} | readNotes calls {len(calls)}: unfiltered on the real tree {whole}, "
              f"filtered on the real tree {filt}, on synthetic trees {len(calls) - whole - filt} | "
              f"real note files read {files} = {files / total:.3f} x the tree")
        restore(label)
elif MODE == "sweep":
    out = {}
    for label in ("base", "head"):
        restore(label)
        out[label] = (sweep(), sweep(("--sweep", "--json")))
    for i, args in enumerate(("--sweep", "--sweep --json")):
        b, h = out["base"][i], out["head"][i]
        print(f"{args}: base exit {b.returncode}, head exit {h.returncode}, stdout bytes {len(b.stdout.encode())}/"
              f"{len(h.stdout.encode())}, stdout identical {b.stdout == h.stdout}, stderr identical {b.stderr == h.stderr}")
restore("head")
print("restored to the head pair; tool == worktree:", open(TOOL).read() == PAIRS["head"][1],
      "; test == worktree:", open(TEST).read() == PAIRS["head"][0])
