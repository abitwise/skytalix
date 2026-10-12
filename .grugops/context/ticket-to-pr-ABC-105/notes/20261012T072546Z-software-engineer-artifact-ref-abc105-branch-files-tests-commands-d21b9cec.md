---
id: 20261012T072546Z-software-engineer-artifact-ref-abc105-branch-files-tests-commands-d21b9cec
kind: artifact-ref
by: software-engineer
task: ticket-to-pr-ABC-105
at: 2026-10-12T07:25:46Z
verified_by:
confidence: high
refs:
  - ABC-105
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A7
  - A8
  - A9
  - N8-LANE
  - tools/grugops/qe-hop-integrity.js
  - tools/grugops/qe-hop-integrity.test.ts
  - .grugops/qe-cutover-2026-08-17.txt
  - memory-bank/40-contributing.md
supersedes:
---

# `ABC-105` delivered: branch, files, tests, gate commands

This is a hand-authored, unsealed note with no stamp, per `AGENTS.md`.

**Branch.** `grugops/ABC-105-qe-hop-integrity` was cut from `main` `aeeba067`. The brief's base was
`d64f6d73`, and `aeeba067` is the Orchestrator's pull commit on top of it. `git diff --stat d64f6d73 aeeba067`
touches only `plans/board.md` (the pull, outside `## Done`; the `## Done` md5 is identical) and the queue
file. The code commit is `ada10423`. Worktree: `../wt-ticket-to-pr-ABC-105`, with `node_modules` symlinked
in. Nothing is merged or pushed.

**Files** (`git diff --numstat aeeba067 ada10423`, notes excluded):
- `tools/grugops/qe-hop-integrity.js`, new: the tool.
- `tools/grugops/qe-hop-integrity.test.ts`, new: 28 tests, 0 spawns.
- `.grugops/qe-cutover-2026-08-17.txt`, new: 4 `#` lines and 38 ids. The id lines are 304 B.
- `memory-bank/40-contributing.md`, § Conventions: the `A7` paragraph.
- `tsconfig.json` (`allowJs`, +1 include) and `biome.json` (+1 include), per note `…d53d8ab6`.
- **0 files under `src/`. `AGENTS.md` is untouched, and `wc -c AGENTS.md` reads 24545.**

**One-off snapshot generation (run once, never again).** The tool has no mode that writes the file:
```
git show 9998a544:plans/board.md | node --input-type=module -e '
import { parseDone } from "./tools/grugops/qe-hop-integrity.js";
let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => {
  process.stdout.write([<4 "#" header lines>, ...parseDone(s), ""].join("\n")); });' \
  > .grugops/qe-cutover-2026-08-17.txt
```
Its sorted ids equal QE's pre-cutover row in `…298a669e` exactly.

**Tests:** `tools/grugops/qe-hop-integrity.test.ts`, **28 tests**. `npx vitest run
tools/grugops/qe-hop-integrity.test.ts` gives 28 passed. They cover:
- Test note 5: the snapshot pin;
- `A1`, `A2` (×2, plus the exact-reading clause), `A3` (the trap exists, then 0 → 1), `A9` (`ABC-072` 0,
  `ABC-073` 1 → 0 with a grandfathered id): real notes;
- `A4`: the partition and the count lines; 1 → 0 when every row is grandfathered; a `parseDone` shape test;
- `A5` (×3, synthetic);
- `A6`: a 0 baseline; 3 malformed shapes, each 0 → 1; the `--ticket` domain, 0 → 1; missing board, missing
  snapshot and unreadable note, each 2; symlink refusal, 2;
- Test note 3: 7 refused argument vectors, each 2.

**Mutation check** (temporary edits, restored with `cmp` 0):
- A refs-only rule turns 5 tests red, `A3` among them.
- An exact-element refs rule turns 3 red, `A2`'s `ABC-076` among them.

**Gates at `ada10423`**, `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`:
- The chain exits 0.
- Biome checked 109 files with no fixes.
- **57 files, 1771 tests passed**: the 56 / 1743 baseline plus 1 file / 28 tests.
- `.test-results/last-run.json` has `success: true`, 0 failed, 0 pending, 0 todo.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` prints `No findings.` and
  exits 0.
- **The brief's literal form `node tools/grugops/test-skip-integrity.js --skip-count 0` exits 2**
  (`cannot read the registry file: 0`): it omits the registry path. The `AGENTS.md` form is the one recorded.
- `npx tsc --noEmit --listFiles` reads `qe-hop-integrity.js` and `.test.ts`, and no other `.js` outside
  `node_modules`.

**No timing was read.** QE reads the `N8-LANE` narrow-set cost.
