#!/usr/bin/env python3
# QE plants for ABC-105, applied in an OUT-OF-REPO copy (scratchpad/plant), restored + cmp after each.
import json, os, subprocess, sys, filecmp, shutil

S = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(S, "plant")
TOOL = os.path.join(P, "tools/grugops/qe-hop-integrity.js")
PRISTINE = os.path.join(S, "pristine.js")

PLANTS = {
    "A3-refs-only-full": [("    if (!names(note.folder, n)) continue;\n", ""),
                          ("readNotes(join(root, CONTEXT), sweep ? undefined : (f) => names(f, n))", "readNotes(join(root, CONTEXT))")],
    "ticket-filter-removed-only": [("readNotes(join(root, CONTEXT), sweep ? undefined : (f) => names(f, n))", "readNotes(join(root, CONTEXT))")],
    "A3-refs-only": [("    if (!names(note.folder, n)) continue;\n", "")],
    "A3-exact-refs": [("if (!note.refs.some((r) => names(r, n))) continue;",
                       "if (!note.refs.some((r) => r === id)) continue;")],
    "folder-substring": [("    if (!names(note.folder, n)) continue;\n",
                          "    if (!note.folder.toLowerCase().replace(/-/g, \"\").includes(id.toLowerCase().replace(\"-\", \"\"))) continue;\n")],
    "accept-observation": [('if (note.malformed || note.kind !== "decision") continue;',
                            'if (note.malformed || (note.kind !== "decision" && note.kind !== "observation")) continue;')],
    "accept-own-t2p": [('    if (note.folder.toLowerCase().startsWith("ticket-to-pr-")) continue; // T\'s own t2p folder\n', "")],
    "symlink-folder-follow": [("    if (folder.isSymbolicLink()) refuseLink(join(CONTEXT, folder.name));\n    if (!folder.isDirectory()",
                               "    if (!(folder.isDirectory() || folder.isSymbolicLink())")],
    "symlink-notesdir-follow": [("    if (stat.isSymbolicLink()) refuseLink(join(CONTEXT, folder.name, \"notes\"));\n    if (!stat.isDirectory()) continue;\n", "")],
    "symlink-notefile-follow": [("      if (entry.isSymbolicLink()) refuseLink(path);\n", "")],
    "naive-done-all-hits": [("    const m = /^- \\[(ABC-\\d+)\\]/.exec(line);\n    if (m?.[1]) ids.push(m[1]);\n",
                             "    for (const m of line.matchAll(/ABC-\\d+/g)) ids.push(m[0]);\n")],
    "naive-done-distinct": [("    const m = /^- \\[(ABC-\\d+)\\]/.exec(line);\n    if (m?.[1]) ids.push(m[1]);\n",
                             "    for (const m of line.matchAll(/ABC-\\d+/g)) if (!ids.includes(m[0])) ids.push(m[0]);\n")],
    "silent-0-missing-board": [("      board = readFileSync(join(root, BOARD), \"utf8\");\n    } catch {\n      throw new Error(`cannot read the board file ${BOARD}.`);",
                                "      board = readFileSync(join(root, BOARD), \"utf8\");\n    } catch {\n      board = \"## Done\\n\";")],
    "silent-0-missing-snapshot": [("    } catch {\n      throw new Error(`cannot read the cutover snapshot ${SNAPSHOT}.`);",
                                   "    } catch {\n      snapshot = \"\";")],
    "flag-force-accepted": [('    else if (a === "--json") json = true;\n',
                             '    else if (a === "--json") json = true;\n    else if (a === "--force") {}\n')],
    "flag-snapshot-accepted": [('    else if (a === "--json") json = true;\n',
                                '    else if (a === "--json") json = true;\n    else if (a === "--snapshot") i++;\n')],
    "any-author": [('    if (note.by === "qe-e2e") qe.push(note.path);', '    if (note.by !== "security-nfr") qe.push(note.path);')],
    "malformed-ignored": [("  const malformed = notes.filter((note) => note.malformed);", "  const malformed = [];")],
    "unreadable-note-skipped": [("        throw new Error(`cannot read the note ${path}`);", "        continue;")],
    "t2p-check-any-folder-substring": [('note.folder.toLowerCase().startsWith("ticket-to-pr-")', 'note.folder.toLowerCase().includes("ticket-to-pr-") && false')],
}


def run_tests():
    out = os.path.join(S, "plant-result.json")
    if os.path.exists(out):
        os.remove(out)
    subprocess.run(["npx", "vitest", "run", "tools/grugops/qe-hop-integrity.test.ts", "--reporter=json", f"--outputFile={out}"],
                   cwd=P, capture_output=True, text=True)
    r = json.load(open(out))
    red = [a["fullName"] for f in r["testResults"] for a in f["assertionResults"] if a["status"] != "passed"]
    return r["numTotalTests"], r["numPassedTests"], red


def cli(*args):
    p = subprocess.run(["node", "tools/grugops/qe-hop-integrity.js", *args], cwd=P, capture_output=True, text=True)
    return p.returncode, p.stdout


only = sys.argv[1:]
for name, edits in PLANTS.items():
    if only and name not in only:
        continue
    src = open(PRISTINE).read()
    for old, new in edits:
        if src.count(old) != 1:
            print(f"{name}\tPLANT-NOT-APPLIED ({src.count(old)} matches)")
            break
        src = src.replace(old, new)
    else:
        open(TOOL, "w").write(src)
        total, passed, red = run_tests()
        code, out = cli("--sweep")
        line = " / ".join(l.split(": ")[-1] for l in out.split("\n") if l.split(":")[0] in ("Done rows", "Covered (qe-e2e)", "In-scope findings") or l.startswith("Pre-cutover") or l.startswith("Covered (security"))
        print(f"{name}\ttests {passed}/{total}\tred {len(red)}\tsweep exit {code} [{line}]")
        for t in red:
            print(f"    RED: {t}")
    shutil.copyfile(PRISTINE, TOOL)
    assert filecmp.cmp(PRISTINE, TOOL, shallow=False)
total, passed, red = run_tests()
print(f"restored: tests {passed}/{total} red {len(red)}; cmp pristine == tool: {filecmp.cmp(PRISTINE, TOOL, shallow=False)}")
