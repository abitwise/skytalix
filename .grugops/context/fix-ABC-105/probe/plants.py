import json, os, subprocess, sys, filecmp, shutil
S = os.path.dirname(os.path.abspath(__file__)); P = os.path.join(S, "plant")
TOOL = os.path.join(P, "tools/grugops/qe-hop-integrity.js"); TEST = os.path.join(P, "tools/grugops/qe-hop-integrity.test.ts")
PRISTINE = os.path.join(S, "pristine.js")
PLANTS = {
  "none (unmutated tool)": [],
  "A3-refs-only (coverage() only)": [("    if (!names(note.folder, n)) continue;\n", "")],
  "A3-refs-only-full": [("    if (!names(note.folder, n)) continue;\n", ""),
     ("readNotes(join(root, CONTEXT), sweep ? undefined : (f) => names(f, n))", "readNotes(join(root, CONTEXT))")],
  "symlink-notesdir-follow": [("    if (stat.isSymbolicLink()) refuseLink(join(CONTEXT, folder.name, \"notes\"));\n    if (!stat.isDirectory()) continue;\n", "")],
  "symlink-notesdir-refusal-only": [("    if (stat.isSymbolicLink()) refuseLink(join(CONTEXT, folder.name, \"notes\"));\n", "")],
  "symlink-notefile-follow": [("      if (entry.isSymbolicLink()) refuseLink(path);\n", "")],
}
def run_tests():
    out = os.path.join(S, "r.json")
    if os.path.exists(out): os.remove(out)
    subprocess.run(["npx","vitest","run","tools/grugops/qe-hop-integrity.test.ts","--reporter=json",f"--outputFile={out}"], cwd=P, capture_output=True, text=True)
    r = json.load(open(out))
    red = [a["fullName"] for f in r["testResults"] for a in f["assertionResults"] if a["status"] != "passed"]
    return r["numTotalTests"], r["numPassedTests"], red
for testname in ("old", "new"):
    shutil.copyfile(os.path.join(S, f"{testname}.test.ts"), TEST)
    for name, edits in PLANTS.items():
        src = open(PRISTINE).read()
        for old, new in edits:
            assert src.count(old) == 1, (name, old)
            src = src.replace(old, new)
        open(TOOL, "w").write(src)
        t, p, red = run_tests()
        print(f"[{testname} test file] {name}\ttests {p}/{t}\tred {len(red)}")
        for x in red: print(f"    RED: {x}")
        shutil.copyfile(PRISTINE, TOOL)
        assert filecmp.cmp(PRISTINE, TOOL, shallow=False)
print("restored; cmp pristine == tool:", filecmp.cmp(PRISTINE, TOOL, shallow=False))
