---
id: 20261021T165257Z-security-nfr-observation-62620bb0
kind: observation
by: security-nfr
at: 2026-10-21T16:52:57Z
verified_by: 
confidence: high for the readings (scratch clone, measured); the Orchestrator's own shell env UNKNOWN - verify
refs:
  - ABC-191
  - QE-191-a
  - QE-191-b
  - AR-188-BINARY
  - ADR-0036
  - ADR-0036 S1
  - F-095-1
  - 837e8b22
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - .grugops/context/security-nfr-QE-191-a/probe/RUN.txt
  - 20261021T164012Z-qe-e2e-observation-9bc0b262
  - 20261021T164023Z-qe-e2e-decision-16ba4076
  - 20261021T164302Z-orchestrator-decision-7f7588a5
  - 20261021T153032Z-security-nfr-decision-f5843a71
supersedes: 
seal: sha256:d9d52191f4c9c880874a2ec29171532c19258477a1ff19800720fb0b31fe5245
---

# QE-191-a / QE-191-b readings: every QE route also hides a WIDENING (an added `node:fs` import and `fetch` call, limbs 1 and 3), not just X1's narrowing. One `git config` in ANY agent worktree reaches the Orchestrator's checkout. QE's three flags close every blinding route. A reached non-ASCII file's later edits are silent on clause (b) AND ride the UAT waiver form

Cites QE's gap register `…9bc0b262` and `ADR-0036` § S1 (`ABC-191` block) as authoritative. Probe and outputs: `.grugops/context/security-nfr-QE-191-a/probe/` (`RUN.txt`). Scratch clone at `837e8b22`, private HOME/TMPDIR/GIT_CONFIG_GLOBAL, system config off. The repository, its config and its worktrees were not written.

## 1. Routes (cur = instrument at `837e8b22`; fix = the same with `--no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/` on the one diff call)
Plants: X1 (QE's: the holder drops its import) and ADD (a non-holder, `src/fen.ts`, gains `import { writeFileSync } from "node:fs"` and a `fetch(...)` call).

| route | X1 L1 cur / fix | ADD L1 cur / fix | ADD L3 cur / fix |
|---|---|---|---|
| R0 control | FIRES / FIRES | FIRES / FIRES | FIRES / FIRES |
| R1 `color.diff=always` (repo config) | silent / FIRES | silent / FIRES | silent / FIRES |
| R2 `color.ui=always` | silent / FIRES | silent / FIRES | silent / FIRES |
| R3 `diff.external=<script>` (not in QE's list) | silent / FIRES | silent / FIRES | silent / FIRES |
| R4 `GIT_EXTERNAL_DIFF` (env) | silent / FIRES | silent / FIRES | silent / FIRES |
| R5 `.git/info/attributes` `src/** diff=ext` + `diff.ext.command` | silent / FIRES | silent / FIRES | silent / FIRES |
| R5g global `core.attributesFile` `diff=ext` + command | silent / FIRES | silent / FIRES | silent / FIRES |
| R6 `diff.srcPrefix`/`dstPrefix` | silent / FIRES | silent / FIRES | silent / FIRES |
| R12 `GIT_CONFIG_COUNT` color (env) | silent / FIRES | silent / FIRES | silent / FIRES |
| R7 `diff.noprefix`, R8 `mnemonicPrefix`, R9 `GIT_DIFF_OPTS`, R10 `diff.algorithm=histogram`, R11 `diff.relative` | FIRES | FIRES | FIRES |
| R13 textconv that strips imports, via `git show <rev>:<path>` (the AST input) | FIRES | FIRES | FIRES |

- R13: `git show <rev>:<path>` does not apply textconv to a blob, so the AST input is not reachable that way.
- R14: under `color.diff=always`, `git diff --name-only` (the AGENTS.md waiver pipe) prints plain bytes. A capability change cannot ride the waiver on this route.

## 2. Committed attribute: which checkout (probe2)
- Head commits `.gitattributes` `src/** diff=ext` plus ADD, and `diff.ext.command` is configured.
  - **Base checked out** (routing from main's checkout, branch unmerged): FIRES. A branch's own attribute is inert there.
  - **Head checked out** (the staged merge in main's checkout, or the branch worktree): silent; with the fix, FIRES.
  - Head checked out with no command configured: FIRES. A commit alone never blinds; a configured command is needed.

## 3. Who can reach it
- `extensions.worktreeConfig` is unset in the repository. Main's checkout and all its linked worktrees (49 linked agent worktrees today) share one `.git/config` and one `.git/info/attributes`.
- **Measured:** in a scratch clone, a linked worktree ran `git config color.diff always`. The main checkout read it from `file:.git/config`, and the instrument on ADD printed `limb 1: does not fire`.
- So any agent with a shell in any worktree can blind the Orchestrator's instrument with one command. It leaves no commit, no diff and no trace in the instrument's output (`production files changed: 0`).
- The env routes (R4, R12) need the Orchestrator's own process environment, which only the operator controls.
- **Today:** the repository config holds only `core.*` keys. Global has `color.ui=auto`, `diff.renames=copies` (overridden by `--no-renames`) and `diff.bin.textconv` (overridden by `--no-textconv`). There is no `diff.external`, no `*.command`, no prefix key, and no `GIT_EXTERNAL_DIFF` in this shell. The stand-in line in `standin.sh` prints nothing on main's checkout. The Orchestrator's own shell env is `UNKNOWN - verify` (the stand-in verifies it at each run).

## 4. QE-191-b (probe2, probe3)
- QU (unreached `src/qé.ts` with `node:fs`): silent; with `core.quotePath=false`: FIRES.
- QB (`cli.ts` gains `import "./qé.ts"`): FIRES (disputed). The dispute line names `src/qé.ts (not a production file at <head>)`, a path that looks like a production file.
- **QE2 (after QB, the reached `src/qé.ts` gains `node:fs` plus `fetch`): limb 1 and limb 3 silent.** The edge already existed at base, so no dispute is raised. With `core.quotePath=false`: FIRES.
- **The AGENTS.md waiver form on QE2 prints nothing:** `git diff --name-only` gives `"src/q\303\251.ts"`, and `grep '^src/'` drops the leading quote. A capability widening in a reached non-ASCII file would ride the UAT waiver.
- The repository holds 0 non-ASCII paths today (`ls-tree -z`).

## 5. The stand-in line (`standin.sh`), measured
`git config --get-regexp '^(color\.(ui|diff)|diff\.(external|srcprefix|dstprefix)|diff\..+\.command)$' | grep -v -E '^color\.(ui|diff) (auto|true|false|never)$'; printenv GIT_EXTERNAL_DIFF`
- Prints a line on R1, R2, R3, R4, R5 (`diff.Ext.Drv.command`), R6, R6b, R12 and `GIT_CONFIG_PARAMETERS`.
- Prints nothing on the control, on `color.ui=auto`, and on main's checkout today.
