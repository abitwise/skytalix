#!/usr/bin/env python3
# qe-ABC-154: QE's own re-plant of ABC-154, in an OUT-OF-REPO `git archive beb0991c` tree (scratchpad). Only the two
# files under test are swapped in; they are restored and compared after every plant.
#   BASE pair = test + tool at main 69a1f4b4 (blobs 8c326845 / 4e352175 = 8fd0c233's = QE4's "new" pair).
#   HEAD pair = test + tool at 0f8036f9 (blobs bf0ea7d5 / cc0f4157; beb0991c holds the same).
#
# HOW THE PLANT TEXT IS LOADED (not retyped, and NOT the SE's way):
#   QE4's plants4.py (blob 29917268: added in 5843e282, the same at 69a1f4b4 and beb0991c) is executed VERBATIM up to
#   its `PAIRS = ` line, with argv set as QE4 ran it. That prefix holds QE4's
#   own loader for the 23 recorded dicts (ast.literal_eval over QE's, QE2's and fix's probes at cfcd59af) and its own 9
#   plant definitions, so the dicts are exactly the objects QE4's process applied. The SE's plants5.py loader (ast-parse
#   the assignments, exec them) is then executed the same way and compared with these, plant by plant (mode `load`).
#
# usage: python3 -I plants6.py <repo> <scratch-plant-tree> load|plants|own|reads|sweep
import ast, hashlib, json, os, re, subprocess, sys

REPO, P, MODE = sys.argv[1], sys.argv[2], sys.argv[3]
REL_TOOL, REL_TEST = "tools/grugops/qe-hop-integrity.js", "tools/grugops/qe-hop-integrity.test.ts"
TOOL, TEST = os.path.join(P, REL_TOOL), os.path.join(P, REL_TEST)
OUTJ = os.path.join(P, "..", "r6.json")


def show(rev, path):
    return subprocess.run(["git", "show", f"{rev}:{path}"], cwd=REPO, capture_output=True, text=True, check=True).stdout


def exec_prefix(rev, path, argv0):
    src = show(rev, path)
    ns = {"__name__": f"prefix:{argv0}"}
    saved = sys.argv
    sys.argv = [argv0, REPO, P, "plants"]
    try:
        exec(compile(src[: src.index("\nPAIRS = ")], argv0, "exec"), ns)
    finally:
        sys.argv = saved
    return ns


Q4 = exec_prefix("beb0991c", ".grugops/context/qe4-ABC-105/probe/plants4.py", "plants4.py")
RECORDED, Q4_TOOL, Q4_TEST = Q4["RECORDED"], Q4["Q4_TOOL"], Q4["Q4_TEST"]
ALL32 = list(RECORDED.items()) + list(Q4_TOOL.items()) + list(Q4_TEST.items())
assert len(ALL32) == 32, len(ALL32)

PAIRS = {"base": (show("69a1f4b4", REL_TEST), show("69a1f4b4", REL_TOOL)),
         "head": (show("0f8036f9", REL_TEST), show("0f8036f9", REL_TOOL))}

# ---- QE's own plants (brief item 2) --------------------------------------------------------------------------
FM = "      const fm = parseFrontMatter(text);\n"
MD = '      if (!entry.name.endsWith(".md")) continue;\n'
HASH = "[...entry.name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7) & 1"
Q5_TOOL = {
    "q5-readNotes-drops-by-secnfr (every read)": [(FM, FM + '      if (fm.by === "security-nfr") continue;\n')],
    "q5-readNotes-drops-by-secnfr (unfiltered only)": [(FM, FM + '      if (!folderFilter && fm.by === "security-nfr") continue;\n')],
    "q5-readNotes-drops-hash-half (every read)": [(MD, MD + f"      if ({HASH}) continue;\n")],
    "q5-readNotes-drops-hash-half (unfiltered only)": [(MD, MD + f"      if (!folderFilter && ({HASH})) continue;\n")],
    "q5-readNotes-drops-random-half (unfiltered only) #1": [(MD, MD + "      if (!folderFilter && Math.random() < 0.5) continue;\n")],
    "q5-readNotes-drops-random-half (unfiltered only) #2": [(MD, MD + "      if (!folderFilter && Math.random() < 0.5) continue;\n")],
    "q5-readNotes-drops-random-half (unfiltered only) #3": [(MD, MD + "      if (!folderFilter && Math.random() < 0.5) continue;\n")],
}
MEMO_A_READ = Q4["MEMO_A_READ"]
Q5_TEST = {
    "q5-allNotes-memo-one-folder quality-gate-ABC-031-qe-2026-08-17": [
        (MEMO_A_READ, MEMO_A_READ.replace('")));', '"), (f) => f === "quality-gate-ABC-031-qe-2026-08-17"));'))],
    "q5-allNotes-memo-one-folder secnfr-ABC-072": [
        (MEMO_A_READ, MEMO_A_READ.replace('")));', '"), (f) => f === "secnfr-ABC-072"));'))],
}
# ---- removing ABC-154's new assertions, one at a time (head test only) ------------------------------------------
A3_C = "    // ABC-154: positive control, so an empty or thinned read cannot pass the two finding checks below.\n"
A3_031 = '    expect(coverage("ABC-031", all, snapshotIds).status).toBe("covered (qe-e2e)");\n'
A3_072 = ('    expect(coverage("ABC-072", all, snapshotIds).status).toBe(\n'
          '      "covered (security-nfr substitute — docs-only rule)",\n    );\n')
A9_C = "    // ABC-154: positive control on the plain sweep's own whole-tree read.\n"
A9_031 = '    expect(r.stdout).not.toContain("  ABC-031: no QE verdict note was found.");\n'
A9_072 = '    expect(r.stdout).not.toContain("  ABC-072: no QE verdict note was found.");\n'
REMOVALS = {
    "head (all 4 new expects)": [],
    "minus A3 pair (allNotes control)": [(A3_C + A3_031 + A3_072, "")],
    "minus A9 pair (plainSweep control)": [(A9_C + A9_031 + A9_072, "")],
    "minus A3 ABC-031": [(A3_031, "")],
    "minus A3 ABC-072": [(A3_072, "")],
    "minus A9 ABC-031": [(A9_031, "")],
    "minus A9 ABC-072": [(A9_072, "")],
}


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


def one(label, name, test, tool):
    write(TEST, test)
    write(TOOL, tool)
    t, p, skip, red = run_tests()
    code, nums, l073 = sweep_nums()
    print(f"[{label}] {name}\ttests {p}/{t}\tskipped {skip}\tred {len(red)}\tsweep exit {code} {nums} lists-ABC-073 {l073}")
    for x in red:
        print(f"    RED: {x}")
    sys.stdout.flush()


def sha(o):
    return hashlib.sha256(json.dumps(o, ensure_ascii=False).encode()).hexdigest()[:16]


if MODE == "load":
    for rev in ("5843e282", "69a1f4b4", "beb0991c"):  # 5843e282 added plants4.py
        print(f"plants4.py blob at {rev}: {subprocess.run(['git', 'rev-parse', f'{rev}:.grugops/context/qe4-ABC-105/probe/plants4.py'], cwd=REPO, capture_output=True, text=True).stdout.strip()}")
    print(f"QE4 prefix loads {len(RECORDED)} recorded (incl. none) + {len(Q4_TOOL)} tool + {len(Q4_TEST)} test = {len(ALL32)} plants")
    print("recorded names (QE4 order):", ", ".join(RECORDED))
    SE = exec_prefix("beb0991c", ".grugops/context/ticket-to-pr-ABC-154/probe/plants5.py", "plants5.py")
    se_all = list(SE["RECORDED"].items()) + list(SE["Q4_TOOL"].items()) + list(SE["Q4_TEST"].items())
    same = 0
    for (n4, e4), (n5, e5) in zip(ALL32, se_all):
        eq = n4 == n5 and e4 == e5
        same += eq
        print(f"{'SAME' if eq else 'DIFF'}\t{sha(e4)}\t{sha(e5)}\t{n4}")
    print(f"SE plants5.py load == QE4 plants4.py verbatim-prefix load: {same} of {len(ALL32)} plants (names, order, edit text)")
elif MODE == "plants":
    print("recorded plants loaded:", len(RECORDED), "(incl. none); plants4.py plants:", len(Q4_TOOL) + len(Q4_TEST))
    for label in ("base", "head"):
        test, tool = PAIRS[label]
        for name, edits in ALL32:
            is_test = name in Q4_TEST
            planted = apply(test if is_test else tool, edits)
            if planted is None:
                print(f"[{label}] {name}\tn/a (plant text matches 0 or >1 times in this pair)")
                continue
            one(label, name, planted if is_test else test, tool if is_test else planted)
            restore(label)
elif MODE == "own":
    for label in ("base", "head"):
        test, tool = PAIRS[label]
        for name, edits in list(Q5_TOOL.items()) + list(Q5_TEST.items()):
            is_test = name in Q5_TEST
            planted = apply(test if is_test else tool, edits)
            if planted is None:
                print(f"[{label}] {name}\tn/a (plant text matches 0 or >1 times in this pair)")
                continue
            one(label, name, planted if is_test else test, tool if is_test else planted)
            restore(label)
    # the removal matrix: each removal variant of the head test, against the A1 plants and QE's own plants
    test, tool = PAIRS["head"]
    faults = {"none": ([], [])}
    for n in ("q4a-readNotes-unfiltered-drops-secnfr", "q4a-readNotes-unfiltered-drops-quality-gate"):
        faults[n] = (Q4_TOOL[n], [])
    for n in ("q4b-allNotes-memo-empty", "q4b-plainSweep-memo-empty-notes", "q4b-both-memos-empty (two faults)"):
        faults[n] = ([], Q4_TEST[n])
    for n in ("q5-readNotes-drops-by-secnfr (unfiltered only)", "q5-readNotes-drops-hash-half (unfiltered only)"):
        faults[n] = (Q5_TOOL[n], [])
    for n, e in Q5_TEST.items():
        faults[n] = ([], e)
    for rname, redits in REMOVALS.items():
        rtest = apply(test, redits) if redits else test
        assert rtest is not None, rname
        for fname, (tool_e, test_e) in faults.items():
            ptool = apply(tool, tool_e) if tool_e else tool
            ptest = apply(rtest, test_e) if test_e else rtest
            assert ptool is not None and ptest is not None, (rname, fname)
            one(f"rm:{rname}", fname, ptest, ptool)
            restore("head")
elif MODE == "extra":
    # the two-point control's residual: an unfiltered-only drop that SPARES the two control folders
    LOOP = Q4["LOOP"]
    Q5_EXTRA = {
        "q5x-readNotes-unfiltered-drops-qe-folders": [(LOOP, LOOP.replace(") continue;", ' || (!folderFilter && folder.name.startsWith("qe-"))) continue;'))],
        "q5x-readNotes-unfiltered-drops-qe-and-qe2-qe3-qe4": [(LOOP, LOOP.replace(") continue;", ' || (!folderFilter && /^qe\\d?-/.test(folder.name))) continue;'))],
        # isolating the real-tree checks: the same drop, sparing A6's synthetic qe-ABC-200 folder (tuned to the test ON PURPOSE)
        "q5x-readNotes-unfiltered-drops-qe-folders-real-tree-only": [(LOOP, LOOP.replace(") continue;", ' || (!folderFilter && /^qe\\d?-/.test(folder.name) && folder.name !== "qe-ABC-200")) continue;'))],
        "q5x-readNotes-unfiltered-drops-quality-gate-except-ABC-031 (real tree)": [(LOOP, LOOP.replace(") continue;", ' || (!folderFilter && folder.name.startsWith("quality-gate-") && !folder.name.startsWith("quality-gate-ABC-031"))) continue;'))],
    }
    for label in ("base", "head"):
        test, tool = PAIRS[label]
        for name, edits in Q5_EXTRA.items():
            planted = apply(tool, edits)
            if planted is None:
                print(f"[{label}] {name}\tn/a (plant text matches 0 or >1 times in this pair)")
                continue
            one(label, name, test, planted)
            restore(label)
elif MODE == "reads":
    log = os.path.join(P, "..", "reads6.log")
    real = os.path.realpath(os.path.join(P, ".grugops/context"))
    total = int(subprocess.run(f"find '{real}' -path '*/notes/*.md' | wc -l", shell=True, capture_output=True, text=True).stdout)
    imp = 'import { lstatSync, readdirSync, readFileSync, realpathSync } from "node:fs";'
    hooks = [
        (imp, imp.replace("{ lstatSync", "{ appendFileSync, lstatSync")),
        ("  const notes = [];\n", "  const notes = [];\n  let qe5Files = 0;\n"),
        ('        text = readFileSync(join(notesDir, entry.name), "utf8");\n',
         '        text = readFileSync(join(notesDir, entry.name), "utf8");\n        qe5Files++;\n'),
        ("  return notes.sort((a, b) => (a.path < b.path ? -1 : 1));\n",
         '  appendFileSync(process.env.QE5_LOG, `${folderFilter ? "filtered" : "unfiltered"}\\t${realpathSync(contextDir)}\\t${qe5Files}\\t${notes.length}\\n`);\n'
         "  return notes.sort((a, b) => (a.path < b.path ? -1 : 1));\n"),
    ]
    print(f"real notes tree: {total} note files (find -path '*/notes/*.md')")
    for label in ("base", "head"):
        test, tool = PAIRS[label]
        inst = apply(tool, hooks)
        assert inst is not None, label
        write(TEST, test)
        write(TOOL, inst)
        if os.path.exists(log):
            os.remove(log)
        t, p, skip, red = run_tests(dict(os.environ, QE5_LOG=log))
        rows = [l.split("\t") for l in open(log).read().splitlines()]
        whole = [r for r in rows if r[0] == "unfiltered" and r[1] == real]
        filt = [r for r in rows if r[0] == "filtered" and r[1] == real]
        synth = [r for r in rows if r[1] != real]
        files_real = sum(int(r[2]) for r in whole + filt)
        print(f"[{label}] tests {p}/{t} red {len(red)} | completed readNotes calls {len(rows)}: unfiltered on the real tree "
              f"{len(whole)} (notes returned {[int(r[3]) for r in whole]}), filtered on the real tree {len(filt)}, other trees "
              f"{len(synth)} | real note files read {files_real} = {files_real / total:.3f} x the tree")
        restore(label)
elif MODE == "sweep":
    outdir = os.path.join(P, "..", "sweep6")
    os.makedirs(outdir, exist_ok=True)
    for label in ("base", "head"):
        restore(label)
        for tag, args in (("plain", ("--sweep",)), ("json", ("--sweep", "--json"))):
            p = sweep(args)
            write(os.path.join(outdir, f"{label}.{tag}.stdout"), p.stdout)
            write(os.path.join(outdir, f"{label}.{tag}.stderr"), p.stderr)
            print(f"[{label}] {' '.join(args)}: exit {p.returncode}, stdout {len(p.stdout.encode())} B sha256 "
                  f"{hashlib.sha256(p.stdout.encode()).hexdigest()[:16]}, stderr {len(p.stderr.encode())} B")
restore("head")
print("restored to the head pair; tool == 0f8036f9:", open(TOOL).read() == PAIRS["head"][1],
      "; test == 0f8036f9:", open(TEST).read() == PAIRS["head"][0])
