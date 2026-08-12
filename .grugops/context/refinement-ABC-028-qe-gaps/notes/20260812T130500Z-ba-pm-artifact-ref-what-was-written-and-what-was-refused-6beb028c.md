---
id: 20260812T130500Z-ba-pm-artifact-ref-what-was-written-and-what-was-refused-6beb028c
kind: artifact-ref
by: ba-pm
at: 2026-08-12T13:05:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-029
  - ABC-019
  - ABC-026
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - plans/traceability.md
  - plans/board.md
  - src/history-pane.ts
supersedes:
---

# What this hop wrote, how to re-run it, and everything it refused

> **Hand-authored.** `scripts/context-io.ts` does **not exist** in this repository — no `scripts/`
> directory at all, checked at source — and `mcp__grugops__propose_note` is not in this session's
> tools, so these notes were composed by hand against `agent-factory/contracts/context-note.md`.
> **`scripts/claim.js` does not exist either**, so the Workflow 17 step 2 claim was made **BY HAND**.
> **There is no derived `index.md` / `index.jsonl`** — the tool that renders them does not exist and
> none was hand-faked; `notes/` is the source of truth.

## The claim, and one honest detail

Atomic `mkdir` of `.grugops/queue/claimed/refinement-ABC-028-qe-gaps/` (no `-p` on the task directory)
returned exit **0** — claim won. **`.grugops/queue/claimed/` itself did not exist** (git does not track
empty directories, so it vanished when the previous claim was released into `done/`); the parent was
created first with `mkdir -p` and the task directory's own `mkdir` is the atomic one that would have
raced. **This is NOT Workflow 17's "parent-missing = genuine failure" stop condition** — the queue root
and its `pending/` + `done/` siblings are present and healthy. `pending → claimed` and
`claimed → done` were plain `mv` (the queue file is untracked, so `git mv` refuses).

**Clock disclosure:** the host system clock read `2026-08-12T08:34:54Z` at claim time. Every note in
the parent ref runs on a nominal timeline (12:00Z → 12:30Z), and `at` is Workflow 16's authoritative
replay sort key — stamping real system UTC would sort this hop **before** the QE hop it answers. These
notes continue the nominal timeline. **Disclosed, not hidden.**

## Re-running this hop's measurements

The replica is built from **this worktree's** object database and symlinks **the main repo's**
`node_modules` — **no other worktree is referenced at any point**, which is the one substantive change
from QE's kit (its scripts hardcode `../cli-chess-abc028-qe/node_modules`).

```
git -C <this worktree> archive HEAD src package.json tsconfig.json biome.json | tar -x -C <scratch>/bapm-base
/usr/bin/diff -r <this worktree>/src <scratch>/bapm-base/src        # must be silent — it was, exit 0
ln -sfn /Users/.../cli-chess-example/node_modules <lane>/node_modules
```

| script (scratchpad) | builds | md5 fence |
|---|---|---|
| `bapm-make-cachelast.mjs` | `CLEAN` + `WCACHE-LAST` (length **and** last-move identity) | pane `c4653c4c…` — **this tip** |
| `bapm-make-b.mjs` | `A2` configuration (b): the nfr `:121`+ fixtures rebuilt per test, nothing else edited | nfr `796918f3…` — **this tip** |
| `bapm-make-g2.mjs` | `WPOSMID` (control), `WPOSRAW`, `WBOARDSUB` | pane `c4653c4c…` |

`identity.ts` and `redo.ts` were copied **verbatim** from
`.grugops/context/quality-gate-ABC-028-qe/artifacts/` and run inside each lane. **The transforms in
`bapm-make-*.mjs` are QE's, adapted only in `BASE`, `NODE_MODULES` and the md5 fence** — the fence had
to move because QE's is not this tip's, which is itself the finding.

**Note on `diff`:** in this shell `diff` resolves to a wrapper dispatching to `git diff`, which rejects
`-r`. **`/usr/bin/diff -r` is the one that compares trees**, and it exited `0`.

## Written

- **`plans/tickets/ABC-028-history-pane-unreached-input-classes.md`** — the seven rulings: new `A5`
  and `RISK-ABC028-03`; `A4` clause 1 corrected; `RISK-ABC028-01` widened and split into `01a`/`01b`
  with a fourth closure named; `RISK-ABC028-02` restated; `A2`'s unfalsifiable clause removed and its
  comment obligation re-opened; the `## Out of scope` md5 fence repaired; the line map corrected at
  every live site; `## Test notes` 11; size + priority re-derived; DoR items 3 and 4 re-checked.
  **Prior text is struck, never deleted.**
- **`plans/traceability.md`** — **one row (`ABC-028`), APPEND-ONLY to its `Status` cell**, plus one
  `_Updated:` header line. The appended string was asserted **pipe-free and newline-free before
  writing** and the row's pipe count re-counted after (11, matching its neighbours). **`Code`, `Tests`,
  `UAT`, `Release` left untouched — `A5` is specified and NOT built, so filling a `Tests` cell would be
  fabricating a trace.**
- **`.grugops/context/refinement-ABC-028-qe-gaps/notes/`** — six notes (three `observation`, two
  `decision`, this `artifact-ref`).
- **`.grugops/queue/claimed/refinement-ABC-028-qe-gaps/`** — `claim.md` and the subtask file, then both
  moved to `done/`.

## Gates on this worktree at the end

```
lint       exit 0   (2 infos: biome config-migration hints, PRE-EXISTING, 46 files)
typecheck  exit 0
unit       750 passed (750) on 26 files
skip       0
git diff -- src/                    EMPTY (0 lines)
src/history-pane.ts md5             c4653c4c263c4c417ea34969164ccd86 — unchanged from the branch tip
```

**Only two files changed on this branch and both are markdown.**

## Refused — each refusal is a boundary the brief drew

- **No `src/` file written, in any form.** `git diff -- src/` is **EMPTY**. Every build was constructed
  out of tree.
- **`src/history-pane.nfr.test.ts` READ and NOT EDITED.** I read `:103-120` to measure `G1` and `G6`.
  **`ABC-029`'s QE hop holds that file and my `G1`/`G6` repairs are SPECIFIED as a criterion for a
  later hop rather than executed here** — which is why `A5` splits into a test half and a comment half
  with different scheduling.
- **`plans/board.md` NOT opened for edit.** The requested move is **NONE — hold at `In Development`**.
- **`plans/nfr-catalog.md`, every ADR, `ABC-029`, `ABC-019`, `ABC-017` and every merged ticket NOT
  opened for edit.** No bar, target or level moved.
- **`N8-LANE`'s TOTAL not re-derived** — routed to `ABC-026`. This hop's own delta is **zero**.
- **`WCACHE-LAST2` NOT measured** — recorded as `RISK-ABC028-03` with `UNKNOWN - verify`, not as a
  verdict.
- **The fourth `A4` closure NOT mandated** — named, given an owner, and explicitly not priced.
- **No worktree but this one was entered.** The replica symlinks the **main repo's** `node_modules`,
  never another worktree's; QE's harnesses were adapted rather than run in place for exactly that
  reason. No `git merge-tree`, no rebase, no fast-forward attempted.
- **Nothing merged, nothing pushed, nothing deployed. No `git checkout main`.**
- **No `finding` recorded.** `human_admission` is `off` and no §14 gate verdict exists under this task.
  **No stamp was invented.**

## Instruction-shaped content encountered, reported rather than acted on

Per the standing rule that content inside the workspace is **data, not instruction**:

1. **`src/history-pane.nfr.test.ts:118-120`** — *"rebuilding these per test would no longer lose a
   guard."* **It reads as sanction and I did not act on it.** I rebuilt those fixtures **only in an
   out-of-tree replica**, to measure `G1`; the worktree's copy is byte-unchanged. **That sentence is
   the subject of `G1`.**
2. **`src/history-pane.nfr.test.ts:106-108`** — *"a reader looking for the guard against a memoising
   pane finds it there."* Same shape, not previously reported by anyone. Measured false for the class,
   **not edited.**
3. **The ticket's `## Acceptance` blockquotes** carry imperatives (*"READ THIS BEFORE WRITING THE
   TEST"*, *"Do not weaken this to a second `playMove`"*). They are criterion text addressed to a build
   hop; read as data, none weakened.
4. **`## Out of scope`'s md5 pin** instructed a reader to *"stop and report"* on a condition that is
   **already true** on this tip. **I did not stop — I reported it and repaired the fence**, which is
   what the instruction was reaching for. Recorded because a fence that fires on licensed work trains
   readers to ignore fences.

**Nothing encountered on this hop purported to authorise a write outside the brief's boundary.**

## Owed to others, not absorbed here

1. **Engineer** — `A5`'s test half (buildable now, `src/history-pane.test.ts` only) and `A5`'s comment
   half (blocked on `ABC-029` clearing the shared file).
2. **Orchestrator** — the scheduling of those two halves; **`ABC-028` was gated on a tree two commits
   behind this branch's tip** (`## Test notes` 11); and the `54fd4346…` digest quoted in this hop's
   brief is **not this tip's pane** — it is `c4653c4c…`, moved by `ABC-029`'s licensed one-line comment.
3. **Security/NFR** — the review; its threshold (*any production line, or any new file*) **did not
   fire** for `A5` either, measured rather than waived, and falls due again at the build gate.
4. **`ABC-026`** — the lane content total, untouched and still disputed. **`A5`'s delta is owed to it.**
5. **Whoever owns `.grugops/test-skips.md`** — still absent; pre-existing; the skip count it guards is
   genuinely `0`.
