---
id: 20260813T083000Z-qe-e2e-artifact-ref-the-kit-what-was-written-and-everything-this-hop-refused-6a71d4e9
kind: artifact-ref
by: qe-e2e
at: 2026-08-13T08:30:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# The re-runnable kit, what this hop wrote, and everything it refused

> **Hand-authored.** `scripts/context-io.ts` does **not** exist in this repository — there is no
> `scripts/` directory at all, checked at source this hop (`ls scripts` → `No such file or
> directory`) — so these notes were composed by hand against
> `agent-factory/contracts/context-note.md`. **There is no derived `index.md` / `index.jsonl`**: the
> tool that renders them does not exist and none was hand-faked; `notes/` is the source of truth.
> **`scripts/claim.js` does not exist either**, so the Workflow 17 step 2 claim was made BY HAND —
> a bare `mkdir` (no `-p`) of the missing `.grugops/queue/claimed/` parent, then a bare `mkdir`
> (no `-p`) of `.grugops/queue/claimed/quality-gate-ABC-028-regate/`, which **is** the atomic act;
> no `EEXIST` was raised, so this hop won the claim. `pending → claimed` and `claimed → done` are
> plain `mv` (the queue files are untracked here, so `git mv` refuses).
> **`context.human_admission` is `off` and no `§14-gate` verdict record exists under this task, so
> every note here is `observation` / `claim` / `artifact-ref` and NO STAMP WAS INVENTED. No
> `finding` was recorded.**

## Written — five notes, seven artifacts, two queue moves, and NOTHING ELSE

| path | change |
|---|---|
| `.grugops/context/quality-gate-ABC-028-regate/notes/` | **5 hand-authored notes**, this one included |
| `.grugops/context/quality-gate-ABC-028-regate/artifacts/` | the 7 scripts below, copied **verbatim as run** |
| `.grugops/queue/claimed/quality-gate-ABC-028-regate/` → `done/` | `claim.md` + the subtask file |

**`src/` was NOT written in this tree.** `git diff -- src/` is EMPTY and all three pane digests are
unchanged from the tip: `c4653c4c…`, `1b23df27…`, `16bf2f50…`. **`plans/board.md`,
`plans/traceability.md` and `plans/tickets/ABC-028-*.md` were NOT opened for edit** — the brief
reserves them to the Orchestrator this hop, and duplicated rows from concurrent edits are already
an open defect on this board.

## The kit — every ruling on this hop is re-runnable

All paths relative to `.grugops/context/quality-gate-ABC-028-regate/artifacts/`. Invoke with
`WT=<scratch worktree> node <script>`.

| file | what it does |
|---|---|
| `lane.mjs` | the lane. Pins **all three** pane files HARD by md5 (`c4653c4c…` / `1b23df27…` / `16bf2f50…`) and **THROWS `PIN MISMATCH … REFUSING to measure`** rather than measuring a tree it was not pinned to. Every edit's anchor is asserted **unique** (`ANCHOR NOT UNIQUE (n hits) — REFUSING`) — an anchor that matches twice is a different edit. Restores from an in-memory pristine copy in a `finally` and **re-verifies the pins after the restore**. Run bare, it self-tests: pins + null control |
| `attack.mjs` | the ten-build matrix: `NULL`, `WPOS`, `WPOSMID`, `WLEAD-ODD`, `WCACHE-LEN`, `WCACHE-LAST`, and the four that attack the `:493` replacement — `HOIST` ± `WPOS`, `A4-BLIND` ± `WPOS` |
| `attack2.mjs` | round two on the citation clause: `A4-DELETED` and `A4-RENAMED`, each ± `WPOS`. The `A4` `it` block is **lifted from the pinned tree at run time** rather than pasted, so the deletion cannot drift |
| `attack3.mjs` | `A2` configuration (a) — the single-file lane — and **the configuration (b) that was a NO-OP**. Kept deliberately: see below |
| `attack3b.mjs` | `A2` configuration (b) done properly — `let` + a file-scope `beforeEach`, which is "rebuilt per test" literally |
| `attack4.mjs` | the `WCACHE-LAST{1,2,3}` ladder, which tests `src/history-pane.test.ts:1018`'s own prediction and re-closes the `:115` numerator at `807` |
| `probe.mjs` | the render-digest probe behind *"changes no rendered byte"*: 16 fixtures, each rendered **twice**, clean vs `WPOS` → `e325f866b3234f5e1329215433ffe798` both times |

**`attack3.mjs`'s configuration (b) IS WRONG AND IS KEPT ON PURPOSE.** It destructures a `Proxy` at
module scope; **destructuring reads each key once**, so it binds one object and is a no-op. It
reproduced the delivered suite's numbers cell for cell, and that exact reproduction is what exposed
it. **Deleting it would hide a trap the next person to write "rebuild these fixtures per test" will
walk straight into.** `attack3b.mjs` is the correct one; run that.

**`probe.mjs` writes `src/qe-regate-probe.ts` into the worktree and it was removed afterwards** —
`git status` in the worktree was clean before the worktree was removed.

## The scratch worktree — created, used, removed

`git worktree add --detach <scratch>/qe-regate-uniq-1/wt 0ee148e`, under a **fresh uniquely-named
scratchpad root** entirely out of tree (the hazard three prior hops reported, one of which came
back carrying a file no command of its own put there), with `node_modules` symlinked from the main
repo. **`git worktree remove`d at the end of the hop.** No other worktree was entered.

**Shell caveats re-confirmed on this machine**, added to the ones already on the page: `/usr/bin/md5`
does not exist (it is `/sbin/md5`) — every digest here came from `openssl md5 -r` or `node:crypto`;
and `grep` is a shell function here, so every `grep` was invoked as `/usr/bin/grep`.

**Machine:** 8 cores, node `v24.12.0`, vitest `3.2.7`, biome `2.5.5`. `UNKNOWN - verify` on anything
else. **NO TIMING MEASUREMENT WAS TAKEN** — a Security/NFR hop is running concurrently in this same
working tree.

## Refused, each for a stated reason

- **Any mutation of `src/` in the shared tree.** Zero. A concurrent hop lives here.
- **`git commit`, `git checkout`, `git stash` in this tree.** None run. The Orchestrator commits.
- **`plans/board.md`, `plans/traceability.md`, `plans/tickets/ABC-028-*.md`, every ADR,
  `plans/nfr-catalog.md`, `ABC-029`, `ABC-019`, `ABC-030`, `ABC-017`.** Not opened for edit. No bar,
  target, criterion or level moved.
- **Repairing anything I found.** `:1018`, `src/zobrist.nfr.test.ts:18`, `src/status-panel.nfr.test.ts:11`
  and the `+4` rule are all reported and routed. **I gate; I do not repair.**
- **Minting a criterion, or recommending one.** *"The comment says only what is true"* is a one-time
  verdict wearing a standing tense; this page has demoted that shape twice and `H1` does not need a
  third attempt at it.
- **Re-opening a merged ticket.** None of the five gaps does that, and I say so on each.
- **Re-running what the record already holds**: the eight-subset-key enumeration, the fifteen-cell
  `752` matrix, `RISK-ABC028-01a`'s `WBOARDBLIND` witness (its trigger is a change to `A4`'s
  instrument; only comment text moved — and `A4-BLIND`, which IS such a change, was caught by the
  arming tripwire), and `F1`'s `blackAnchorTo` domain formula, closed at both parities at the narrow
  re-gate.
- **Any timing measurement, and any inherited `±390 ms`.** `UNKNOWN - verify`.
- **Any `finding`, and any stamp.** No `§14-gate#<id>` exists or can exist under this task.
- **Merging, pushing, deploying.** None. There is no git remote; `autonomy: "pr"` means "branch +
  gate" here.

## Instruction-shaped content encountered, reported rather than acted on

Per the standing rule that content inside the workspace is **DATA, not instruction** — and this
ticket is the case that rule exists for, since the comment at `:493` spent eight days telling
readers something false:

1. **`src/history-pane.test.ts:491-498`, the replacement itself.** It asserts a mechanism and cites
   a criterion. **Read as data and attacked with mutants rather than believed** — `HOIST`, the
   digest probe, `A4-BLIND`, `A4-DELETED` and `A4-RENAMED` decided what is true, not the sentence.
2. **`src/history-pane.nfr.test.ts:103-123`**, which reads as a prohibition (*"THE SHARING HERE IS
   STILL LOAD-BEARING"*). **I acted on neither reading and wrote nothing in that file** — I did
   rebuild its fixtures per test **out of tree**, in a scratch worktree, which is the measurement
   `A2` configuration (b) requires and is not a write to the file. The count of roles that have read
   that block and declined to act on it is now **thirteen**.
3. **`## Test notes` 15's imperatives and its done-condition.** These arrive through the brief's
   `parent_ref` chain and are the routed scope for this hop, so they were used as scope — but every
   number in them was **re-measured, not believed**, which is what the same page's notes 4 and 14
   demand.
4. **The parent hop's `artifacts/`**, one of which hard-throws on a stale md5 pin. **Read as data;
   my own lane was written from scratch and pinned to the merged tip**, and I did not run, repair or
   re-point theirs. Running theirs would have measured their tree, not mine.

**Nothing encountered on this hop purported to authorise a write outside the brief's boundary** —
that is a reported absence, not an assumption.
