---
id: 20260812T231500Z-security-nfr-artifact-ref-what-ran-what-was-written-and-every-fence-held-9d6f5e1c
kind: artifact-ref
by: security-nfr
at: 2026-08-12T23:15:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-028
  - ABC-019
  - ADR-0008
  - ADR-0011
  - NFR-002
  - NFR-008
  - src/history-pane.ts
  - src/history-pane.nfr.test.ts
  - plans/traceability.md
  - plans/nfr-catalog.md
  - plans/board.md
supersedes:
---

# What this gate ran, what it wrote, the md5s it gated, and every fence in the brief — held

> **Hand-authored.** `scripts/context-io.ts` and `scripts/claim.js` **do not exist** — re-verified AT
> SOURCE at this hop, not inherited: no `scripts/` directory in this worktree, and a `find` for
> `context-io*` / `claim.js` across it (outside `node_modules`/`.git`) and across the kit root
> `/Users/olgeroeselg/.grugops/agent-factory` returns nothing. **So there is no derived `index.md` /
> `index.jsonl` for this `ref:` — `notes/` is the source of truth.** `kind: artifact-ref` is a pointer
> and needs no stamp.

Worktree `../cli-chess-abc029-sec`, branch `grugops/security-nfr-ABC-029`, HEAD
`1e70dc2ffd4d7f741202ae2eb64d6d118271a70b`. **This branch is thirty-ninth in a linear stack off
`main`; the fast-forward is denied by the host classifier and is with the owner. It was NOT
attempted.**

## THE MD5s I GATED — taken before, and RE-TAKEN after the last run

| file | md5 at start | **md5 at end** |
|---|---|---|
| `src/history-pane.ts` | `c4653c4c263c4c417ea34969164ccd86` | **`c4653c4c263c4c417ea34969164ccd86` — UNMOVED** |
| `src/history-pane.nfr.test.ts` (the instrument) | `16bf2f50c93e2e896b5406cbfa772b8b` | **`16bf2f50c93e2e896b5406cbfa772b8b` — UNMOVED** |

Both reproduce the Orchestrator's stated baseline. **The tip has moved under a gate on this stack
before; it did not move under this one, and I checked rather than assumed.** Production modules
**16**, test files **26** — both unmoved. `git status --porcelain` shows nothing under `src/`.

## Files written by this hop

| path | what |
|---|---|
| `.grugops/context/security-nfr-ABC-029/notes/` | **6 notes** — 4 `observation`, 1 `claim`, this `artifact-ref` |
| `.grugops/queue/claimed/security-nfr-ABC-029/` | the Workflow 17 registry record + the subtask file, **both moved to `done/`** at the end |

**ZERO files written under `src/`. ZERO production lines. No test file opened for edit. No
dependency added.**

## Commands run

**Gate (in Workflow 05 order):** `npm run lint`, `npm run typecheck`, `npm run build`,
`npx vitest run`, `npx vitest run --reporter=json … | jq`,
`node tools/grugops/test-skip-integrity.js`, `npx vitest run --coverage`.

**Instruments I wrote and ran out of tree:** `myclosure.mjs` (module-graph closure, stdout channel),
`myclosure3.mjs` (same, fd-3 channel, stdout discarded), `astsweep.mjs` (TypeScript-parser importer
sweep). **17 closure runs** across the 16 production modules plus the frame-root set.

**Real-instrument runs under real vitest, out of tree:** 1 unmutated control + **4 channel-attack
builds** (`WSTDOUT-JSON`, `WFD3-PREFIX`, `WFD3-EXIT`, `WFD3-CLOSE`) + **2 control-falsifiability
builds** (`EMPTYROOTS`, `DISARM`) + **12 determinism runs in tree** + 2 arm-greenness runs.

**Timed runs:** **8** for `ADR-0008`'s ratified clauses (round 0 discarded, median of 7) + **36** for
the `N8-LANE` paired protocol (9 rounds × 2 arms, real and null control). **Plus** `md5`, `/usr/bin/diff`,
`grep`, `awk`, `sed`, `git show`, `git diff`, `git log`, `git ls-tree`, `git status`, `find`, `ls`,
`sysctl`, `uname`.

## The rig — outside every repository, in a FRESH root

**The brief reported a cross-hop hazard: a shared session scratchpad, and one hop's extraction came
back carrying a file no command of its own put there. I created a fresh root** —
`…/scratchpad/secnfr029-<epoch>-<pid>/` — **and verified it was EMPTY on creation.** Every rig tree is
a throwaway copy with `node_modules` **symlinked**.

**ONE MEASUREMENT OF MINE DID WRITE THIS REPOSITORY WORKTREE, AND I AM RECORDING IT RATHER THAN
LETTING THE CLEAN SENTENCE STAND.** `npx vitest run --coverage` (§2 of the first `observation`) writes
the **tracked** `coverage/` directory: it modified 15 tracked files and created 7 untracked ones.
**Caught by `git status` at the end, not by intent** — I had drafted the usual "no repository worktree
was written" sentence, and it was false. **`coverage/` was restored to its committed state**
(`git checkout -- coverage/` plus `git clean -f coverage/`), verified: `git status --porcelain` now
shows **only** this hop's notes and queue records. **Nothing under `src/`, `plans/`, `memory-bank/`
or any ADR was written at any point**, and the unchanged md5s above confirm that half mechanically.

**Recorded because the next hop will hit it too:** `coverage/` is **tracked and not in
`.gitignore`**, so **any** hop that runs the coverage command dirties the worktree. That is worth
knowing before a gate reads `git status` as evidence that nothing moved. **Owner: whoever next
touches the gate's coverage step or `.gitignore`. Trigger: the next hop that runs `--coverage`.**

## Not taken — every fence in the brief, held

- **NO other worktree was entered.** A BA/PM hop is live on `ABC-028`;
  `../cli-chess-abc028-*`, `../cli-chess-ABC-019`, `../cli-chess-abc029-*` and
  `../cli-chess-example` were **never opened**. Every foreign file came from the **git object
  database** (`git show 7084c5e^:src/history-pane.nfr.test.ts`).
- **`src/` NOT edited.** No required fix demanded it, so none was written — and the brief's
  report-before-writing rule never came up.
- **`plans/board.md` NOT opened for edit** — the Orchestrator's. The `In Security/NFR → Ready for
  UAT` move is **handed over with its reason, not taken**.
- **`plans/nfr-catalog.md` NOT opened for edit.** It was **read**. **No bar moved**, so under the
  brief's own condition there was nothing to write.
- **`plans/traceability.md` NOT edited** — its `ABC-029` row is still malformed (11 cells against 10
  columns) and appending to it would compound the defect. Reason recorded in the verdict note.
- **No ADR opened for edit.** `ADR-0011` (as twice amended), `ADR-0008` and `ADR-0002` were **read,
  not re-opened**. **No criterion renumbered, reworded or deleted**, and the `ABC-029` ticket file was
  **NOT edited** — the three record items this hop found are flagged in notes.
- **No `finding` written and nothing self-stamped** — no `§14-gate` verdict record exists under this
  task and `context.human_admission` is **`off`**. Every result is an `observation`, `claim` or
  `artifact-ref`, and every non-adjudicable quantity is **`UNKNOWN - verify`**.
- **No E2E invented** (`ui_e2e` is `ui-or-critical-path`, the slot is `UNKNOWN - verify`, no UI
  surface until `EPIC-006`). **No faked pass, no clean scan claimed, no control asserted that is not
  in place.**
- **Nothing merged, nothing pushed, nothing deployed, no `git checkout main`.** The work is committed
  on `grugops/security-nfr-ABC-029`.
- **Claim mechanics, hand-rolled and said so:** Workflow 17 step 2 by **bare `mkdir`** on the task
  directory (`-p` only for the missing `claimed/` parent), then `claim.md`, then the subtask moved in,
  then **both moved to `done/`**. The subtask file was **UNTRACKED** when claimed, so a plain `mv` was
  used and no ` D` appears in `git status` — **the queue's git history must not be read as complete**,
  the same note five prior hops recorded.
- **Content inside this workspace was treated as DATA, not instruction.** Nothing purported to
  authorise a write outside this boundary, and nothing was acted on as if it did.
