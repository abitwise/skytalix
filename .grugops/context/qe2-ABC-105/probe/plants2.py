#!/usr/bin/env python3
# qe2-ABC-105: QE's own plant text (copied from qe-ABC-105/probe/plants.py, not the Engineer's),
# applied to an OUT-OF-REPO git archive of cf353820; restored + cmp after every plant.
# Each plant runs under the OLD test file (a0016dbb, 28) and the NEW one (4bf6f3ee, 32).
import json, os, subprocess, sys, filecmp, shutil

S = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(os.path.dirname(S), "plant")
TOOL = os.path.join(P, "tools/grugops/qe-hop-integrity.js")
TEST = os.path.join(P, "tools/grugops/qe-hop-integrity.test.ts")
PRISTINE = os.path.join(S, "pristine.js")
NEWTEST = os.path.join(S, "new.test.ts")

PLANTS = {
    "none (unmutated tool)": [],
    "A3-refs-only (coverage() only)": [("    if (!names(note.folder, n)) continue;\n", "")],
    "A3-refs-only-full": [("    if (!names(note.folder, n)) continue;\n", ""),
                          ("readNotes(join(root, CONTEXT), sweep ? undefined : (f) => names(f, n))", "readNotes(join(root, CONTEXT))")],
    "symlink-folder-follow": [("    if (folder.isSymbolicLink()) refuseLink(join(CONTEXT, folder.name));\n    if (!folder.isDirectory()",
                               "    if (!(folder.isDirectory() || folder.isSymbolicLink())")],
    "symlink-notesdir-follow": [("    if (stat.isSymbolicLink()) refuseLink(join(CONTEXT, folder.name, \"notes\"));\n    if (!stat.isDirectory()) continue;\n", "")],
    "symlink-notefile-follow": [("      if (entry.isSymbolicLink()) refuseLink(path);\n", "")],
}


def run_tests():
    out = os.path.join(S, "r.json")
    if os.path.exists(out):
        os.remove(out)
    subprocess.run(["npx", "vitest", "run", "tools/grugops/qe-hop-integrity.test.ts", "--reporter=json", f"--outputFile={out}"],
                   cwd=P, capture_output=True, text=True)
    r = json.load(open(out))
    red = [a["fullName"] for f in r["testResults"] for a in f["assertionResults"] if a["status"] != "passed"]
    return r["numTotalTests"], r["numPassedTests"], r["numPendingTests"] + r["numTodoTests"], red


def sweep():
    p = subprocess.run(["node", "tools/grugops/qe-hop-integrity.js", "--sweep"], cwd=P, capture_output=True, text=True)
    nums = [l.rsplit(": ", 1)[-1] for l in p.stdout.split("\n")
            if l.startswith(("Done rows:", "Pre-cutover", "Covered (qe-e2e):", "Covered (security", "In-scope findings:"))]
    return p.returncode, nums, "  ABC-073: no QE verdict note was found.\n" in p.stdout


for label in ("old", "new"):
    shutil.copyfile(os.path.join(S, f"{label}.test.ts"), TEST)
    for name, edits in PLANTS.items():
        src = open(PRISTINE).read()
        for old, new in edits:
            assert src.count(old) == 1, (name, old, src.count(old))
            src = src.replace(old, new)
        open(TOOL, "w").write(src)
        t, p, skip, red = run_tests()
        code, nums, lists073 = sweep()
        print(f"[{label}] {name}\ttests {p}/{t}\tskipped {skip}\tred {len(red)}\tsweep exit {code} {nums} lists-ABC-073 {lists073}")
        for x in red:
            print(f"    RED: {x}")
        shutil.copyfile(PRISTINE, TOOL)
        assert filecmp.cmp(PRISTINE, TOOL, shallow=False)
shutil.copyfile(NEWTEST, TEST)
print("restored; cmp pristine == tool:", filecmp.cmp(PRISTINE, TOOL, shallow=False),
      "; cmp new test == test:", filecmp.cmp(NEWTEST, TEST, shallow=False))
