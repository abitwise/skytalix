---
id: 20261110T140059Z-software-engineer-observation-39f127ea
kind: observation
by: software-engineer
at: 2026-11-10T14:00:59Z
verified_by: 
confidence: high: every check above was run by SE after the last code edit
refs:
  - se-ABC-315-fix
  - ABC-315
  - grugops/ABC-315
  - 2abb1744
  - R1
  - G1
  - G2
  - src/cli.ts
  - src/uci.ts
  - src/version.test.ts
  - memory-bank/90-agents-md-command-log.md
  - sec-ABC-315/20261110T135731Z-security-nfr-decision-0088bc3b
  - qe-ABC-315/20261110T135825Z-qe-e2e-decision-eda9d104
supersedes: 
seal: sha256:cc6fecf53407bccf3109098c9f86b746ba9968b86b1d5bc8a5aec411bf8140ff
---

# se-ABC-315-fix: R1, G1, G2 applied on grugops/ABC-315 at 2abb1744

Merged first, each with --no-ff: grugops/qe-ABC-315 (0a392feb) and grugops/sec-ABC-315 (962a5330).

## Changes (commit 2abb1744)
- **R1 (Security 0088bc3b).** src/cli.ts: the `if (parsed.version)` arm and its comment moved inside the existing `try` as its first statement, so the existing catch writes INTERNAL_ERROR and sets 70. src/uci.ts: inside `if (versionOnly)`, after the EPIPE arm, the write is wrapped in try/catch: the fixed INTERNAL_ERROR line on stderr and `process.exitCode = INTERNAL_ERROR_EXIT_CODE`, then return. src/version-file.ts is unchanged.
- **G1 (QE eda9d104).** QE's sentence appended verbatim to the ABC-315 paragraph of memory-bank/90-agents-md-command-log.md. AGENTS.md is untouched.
- **G2 (QE eda9d104).** One zero-spawn row in src/version.test.ts reads src/uci.ts as text. In the `if (versionOnly) {` block it asserts: `sink.on("error"` before the version write, the non-EPIPE re-throw between them, and exactly one `sink.write(`. It carries the same biome-ignore for noTemplateCurlyInString that src/cli.test.ts uses.

## Checks, run by SE after the last code edit
- G2 red-green: with the EPIPE arm removed from src/uci.ts the row fails (`expected -1 to be greater than or equal to 0`), 1 failed and 4 passed. Restored: 5 out of 5 pass.
- R1 by hand, on a scratch copy of src/ outside the repository with no package.json: `node src/cli.ts --version` printed the cli INTERNAL_ERROR line, exit 70. `node src/uci.ts --version` printed `internal error: a bug ended this session`, exit 70. Neither printed a stack or a path. With package.json copied in, both printed `skytalix 1.0.0`, exit 0.
- Each check ran alone under the host lock: typecheck exit 0; lint (biome check .) exit 0; build exit 0; npm test exit 0, 72 files, 2740 passed (2739 + the G2 row), 0 skipped, 0 failed.
- `printf 'uci\nisready\nquit\n' | bin/skytalix-uci` exit 0. Its output is cmp-identical to main's src/uci.ts with the same input. `bin/skytalix-uci --version` printed `skytalix 1.0.0`, exit 0.
- `node tools/grugops/records-path-check.js --base main --head grugops/ABC-315` reported clean.

Not checked: no spawn row pins the missing-package.json case (Security welcomed one but did not require it), and the Windows .cmd launcher was not run.
