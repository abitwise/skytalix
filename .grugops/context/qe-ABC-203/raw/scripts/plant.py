import json, subprocess, sys, os, shutil, filecmp
S = sys.argv[1]; T = f"{S}/plants/tree"
PLANTS = {
 "P1_write_on_quit": ("src/cli.ts", "if (outcome.reason !== null) {", "if (true) {"),
 "P2_w_not_wx": ("src/pgn-file.ts", 'openSync(path, "wx")', 'openSync(path, "w")'),
 "P6_write_before_loop": ("src/cli.ts", "const startedAt = new Date();", "const startedAt = new Date(); writePgnFile(startedAt, \"\");"),
 "P7_message_not_code": ("src/cli.ts", "`PGN not saved: ${saved.code}\\n`", "`PGN not saved: ${saved.code} ${String(saved)}\\n`"),
 "X1_no_unlink_on_failure": ("src/pgn-file.ts", "    unlinkSync(path);\n", "    \n"),
 "X2_throw_after_failure_line": ("src/cli.ts", "else process.stderr.write(`PGN not saved: ${saved.code}\\n`);", "else { process.stderr.write(`PGN not saved: ${saved.code}\\n`); throw new Error(\"x\"); }"),
 "X3_screen_dropped_on_failure": ("src/cli.ts", "    if (outcome.reason !== null) {\n      const text", "    if (outcome.reason !== null) {\n      if (!require_ok()) {}\n      const text"),
}
only = sys.argv[2:] or list(PLANTS)
results = {}
for name in only:
    path, old, new = PLANTS[name]
    f = f"{T}/{path}"; src = open(f).read()
    assert src.count(old) == 1, (name, src.count(old))
    open(f, "w").write(src.replace(old, new))
    r = subprocess.run(["npx", "vitest", "run", "src/pgn.test.ts", "src/cli.test.ts", "--reporter=json"], cwd=T, capture_output=True, text=True, env={**os.environ, "NODE_OPTIONS": "--max-old-space-size=128"})
    shutil.copy(f"{S}/plants/src.orig/{path.split('/')[-1]}", f)
    assert filecmp.cmp(f, f"{S}/plants/src.orig/{path.split('/')[-1]}", shallow=False)
    try:
        j = json.loads(r.stdout)
        red = [a["fullName"] for s in j["testResults"] for a in s["assertionResults"] if a["status"] == "failed"]
        results[name] = {"total": j["numTotalTests"], "failed": j["numFailedTests"], "red": red, "suiteErr": [s.get("message","")[:120] for s in j["testResults"] if s["status"]=="failed" and not s["assertionResults"]]}
    except Exception as e:
        results[name] = {"error": str(e), "stderr": r.stderr[-500:]}
    print(name, json.dumps(results[name], indent=1)[:1500], flush=True)
json.dump(results, open(f"{S}/plants/results.json", "w"), indent=1)
