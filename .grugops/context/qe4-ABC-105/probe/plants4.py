#!/usr/bin/env python3
# qe4-ABC-105: every recorded plant (QE, QE2, fix; fix2 defines none of its own, its plants3.py loads the
# same three dicts), re-run against the OLD pair (test file at db1cfb6c + tool at 60415a8a; the tool at
# db1cfb6c is cmp 0 to it) and the NEW pair (test file + tool at 8fd0c233), in an OUT-OF-REPO
# `git archive cfcd59af` tree. The recorded plant text is NOT retyped: each PLANTS dict is loaded verbatim
# (ast.literal_eval) from the probe files as committed at cfcd59af, exactly as fix2's plants3.py did.
# QE4 adds its own plants (Q4_TOOL on the tool, Q4_TEST on the new test file only; the old test file has
# no memo, so a test plant is n/a there). Tool and test are restored and compared after every plant.
#
# usage: python3 -I plants4.py <repo-worktree> <scratch-plant-tree> [plants|reads]
import ast, json, os, re, subprocess, sys

REPO, P = sys.argv[1], sys.argv[2]
MODE = sys.argv[3] if len(sys.argv) > 3 else "plants"
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

READ = "sweep ? undefined : (f) => names(f, n)"
LOOP = "    if (!folder.isDirectory() || (folderFilter && !folderFilter(folder.name))) continue;\n"
Q4_TOOL = {
    # (a) the real read path in main (the only code the notes seam bypasses), broken for --sweep only
    "q4a-main-sweep-read-drops-secnfr": [(READ, 'sweep ? (f) => !f.startsWith("secnfr-") : (f) => names(f, n)')],
    "q4a-main-sweep-read-drops-quality-gate": [(READ, 'sweep ? (f) => !f.startsWith("quality-gate-") : (f) => names(f, n)')],
    # (a) a readNotes bug that fires only on the unfiltered read (shared by plainSweep() AND allNotes())
    "q4a-readNotes-unfiltered-drops-secnfr": [(LOOP, LOOP.replace(") continue;", ' || (!folderFilter && folder.name.startsWith("secnfr-"))) continue;'))],
    "q4a-readNotes-unfiltered-drops-quality-gate": [(LOOP, LOOP.replace(") continue;", ' || (!folderFilter && folder.name.startsWith("quality-gate-"))) continue;'))],
    "q4a-readNotes-unfiltered-empty": [("  const notes = [];\n", "  const notes = [];\n  if (!folderFilter) return notes;\n")],
}
MEMO_A = "let allNotesOnce: ReturnType<typeof readNotes> | undefined;"
MEMO_A_READ = 'const allNotes = () => (allNotesOnce ??= readNotes(join(ROOT, ".grugops/context")));'
MEMO_S_READ = 'const plainSweep = () => (plainSweepOnce ??= run(["--sweep"]));'
Q4_TEST = {
    # (b) a broken memo: the shared value computed from an empty or stale read
    "q4b-allNotes-memo-empty": [(MEMO_A, MEMO_A[:-1] + " = [];")],
    "q4b-allNotes-memo-stale-filtered": [(MEMO_A_READ, MEMO_A_READ.replace('")));', '"), (f) => /abc-?0*(62|73)(?!\\d)/i.test(f)));'))],
    "q4b-plainSweep-memo-empty-notes": [(MEMO_S_READ, MEMO_S_READ.replace('run(["--sweep"])', 'run(["--sweep"], { notes: [] })'))],
    "q4b-both-memos-empty (two faults)": [(MEMO_A, MEMO_A[:-1] + " = [];"),
                                          (MEMO_S_READ, MEMO_S_READ.replace('run(["--sweep"])', 'run(["--sweep"], { notes: [] })'))],
}

PAIRS = {"old": (show("db1cfb6c", REL_TEST), show("60415a8a", REL_TOOL)),
         "new": (show("8fd0c233", REL_TEST), show("8fd0c233", REL_TOOL))}


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


def sweep():
    p = subprocess.run(["node", REL_TOOL, "--sweep"], cwd=P, capture_output=True, text=True)
    nums = [l.rsplit(": ", 1)[-1] for l in p.stdout.split("\n")
            if l.startswith(("Done rows:", "Pre-cutover", "Covered (qe-e2e):", "Covered (security", "In-scope findings:"))]
    return p.returncode, "/".join(nums), "  ABC-073: no QE verdict note was found.\n" in p.stdout


def check_restored(label):
    test, tool = PAIRS[label]
    assert open(TOOL).read() == tool and open(TEST).read() == test, label


if MODE == "plants":
    print("recorded plants loaded:", len(RECORDED), "(incl. none):", ", ".join(RECORDED))
    for label, (test, tool) in PAIRS.items():
        for name, edits in list(RECORDED.items()) + list(Q4_TOOL.items()) + list(Q4_TEST.items()):
            is_test = name in Q4_TEST
            planted = apply(test if is_test else tool, edits)
            if planted is None:
                print(f"[{label}] {name}\tn/a (plant text matches 0 or >1 times in this pair)")
                continue
            write(TEST, planted if is_test else test)
            write(TOOL, tool if is_test else planted)
            t, p, skip, red = run_tests()
            code, nums, l073 = sweep()
            print(f"[{label}] {name}\ttests {p}/{t}\tskipped {skip}\tred {len(red)}\tsweep exit {code} {nums} lists-ABC-073 {l073}")
            for x in red:
                print(f"    RED: {x}")
            write(TEST, test)
            write(TOOL, tool)
            check_restored(label)
else:  # reads: count whole-tree reads of the real notes, two independent ways
    log = os.path.join(P, "..", "reads.log")
    real = os.path.realpath(os.path.join(P, ".grugops/context"))
    total_notes = int(subprocess.run(f"find '{real}' -path '*/notes/*.md' | wc -l", shell=True, capture_output=True, text=True).stdout)
    hook_fn = "export function readNotes(contextDir, folderFilter) {\n"
    hook_fn_new = hook_fn + "  appendFileSync(process.env.READ_LOG, `CALL\\t${folderFilter ? 'filtered' : 'unfiltered'}\\t${contextDir}\\n`);\n"
    hook_rd = '        text = readFileSync(join(notesDir, entry.name), "utf8");\n'
    hook_rd_new = hook_rd + "        appendFileSync(process.env.READ_LOG, `FILE\\t${notesDir}\\n`);\n"
    imp = 'import { lstatSync, readdirSync, readFileSync, realpathSync } from "node:fs";'
    imp_new = imp.replace("{ lstatSync", "{ appendFileSync, lstatSync")
    print(f"real notes tree: {real} holds {total_notes} note files")
    for label, (test, tool) in PAIRS.items():
        inst = apply(tool, [(imp, imp_new), (hook_fn, hook_fn_new), (hook_rd, hook_rd_new)])
        write(TEST, test)
        write(TOOL, inst)
        if os.path.exists(log):
            os.remove(log)
        t, p, skip, red = run_tests(dict(os.environ, READ_LOG=log))
        rows = [l.split("\t") for l in open(log).read().splitlines()]
        calls = [r for r in rows if r[0] == "CALL"]
        whole = sum(1 for r in calls if r[1] == "unfiltered" and os.path.realpath(r[2]) == real)
        filt_real = sum(1 for r in calls if r[1] == "filtered" and os.path.realpath(r[2]) == real)
        files_real = sum(1 for r in rows if r[0] == "FILE" and os.path.realpath(r[1]).startswith(real + os.sep))
        print(f"[{label}] tests {p}/{t} red {len(red)} | readNotes calls {len(calls)}: unfiltered on the real tree {whole}, "
              f"filtered on the real tree {filt_real}, on synthetic trees {len(calls) - whole - filt_real} | "
              f"real note files read {files_real} = {files_real / total_notes:.3f} x the tree")
        write(TOOL, tool)
        check_restored(label)
write(TEST, PAIRS["new"][0])
write(TOOL, PAIRS["new"][1])
print("restored to the new pair; tool == 8fd0c233:", open(TOOL).read() == PAIRS["new"][1], "; test == 8fd0c233:", open(TEST).read() == PAIRS["new"][0])
