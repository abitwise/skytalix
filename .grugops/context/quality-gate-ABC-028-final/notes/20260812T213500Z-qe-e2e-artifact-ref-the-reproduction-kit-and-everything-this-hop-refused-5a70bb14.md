---
id: 20260812T213500Z-qe-e2e-artifact-ref-the-reproduction-kit-and-everything-this-hop-refused-5a70bb14
kind: artifact-ref
by: qe-e2e
at: 2026-08-12T21:35:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-01
  - RISK-ABC028-02
  - ABC-026
  - ABC-029
  - plans/traceability.md
  - plans/board.md
  - src/history-pane.ts
supersedes:
---

# The reproduction kit, what was written, and everything this hop refused

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repository — there is no
> `scripts/` directory at all, checked at source — so these notes were composed by hand against
> `agent-factory/contracts/context-note.md`. **There is no derived `index.md` / `index.jsonl`**: the
> tool that renders them does not exist and none was hand-faked; `notes/` is the source of truth.
> **`scripts/claim.js` does not exist either**, so the Workflow 17 claim was made BY HAND — `mkdir -p`
> for the missing `claimed/` parent, then a bare `mkdir` (no `-p`) of
> `.grugops/queue/claimed/quality-gate-ABC-028-final/`, which is the atomic act; the `pending →
> claimed` and `claimed → done` transitions were plain `mv` (the queue files are untracked, so
> `git mv` refuses).

## The kit — every verdict on this hop is re-runnable

All paths relative to `.grugops/context/quality-gate-ABC-028-final/artifacts/`.

| file | what it does |
|---|---|
| `mk.mjs` | the lane builder. **Pins `src/history-pane.ts` `c4653c4c…`, `src/history-pane.test.ts` `9533f050…` and `src/history-pane.nfr.test.ts` `1d33bea6…` by md5 and THROWS rather than measuring the wrong tree.** Key specs are DATA — `none`, `tail:T`, `value:T`, `sparse:a,b` — so every rung of the axis is the same code at a different number and cannot differ by a transcription slip. Also carries configuration (b): the `AT_*` fixtures **and the `LONG_GAMES` table that captures them** rebuilt per test |
| `run.mjs` | one lane end to end: build → output-identity gate → `tsc` → suite verdict, full lane and owned lane, with the failing test NAMES |
| `identity.ts` | the output-identity gate, run BEFORE any suite verdict is believed: twelve fixtures, every rendered byte digested, plus the caller's graph digested before and after so an unrestored mutation shows here too |
| `probe.ts` | **the measurement the whole boundary question turns on** — for each criterion's edit, which move indices moved by IDENTITY, which by VALUE, where the rendered window is, and which rows differ |
| `rows.mjs` | `A5`'s extension mechanism tested rather than trusted: candidate rows at `preservedTail` 3 and 16, each `changes` value measured first |
| `a34.mjs` | `A3` and `A4` re-broken on this tip — `WLEAD-ODD`, `WPOSMID`, and `WBOARDBLIND` (`RISK-ABC028-01a`, re-run and still open) |
| `restore.mjs` | the forbidden-formulation test: restore the banned sentences, then run lint, typecheck and the suite |
| `n8.mjs` | `ADR-0008` decision 4's paired-CPU protocol with its mandatory identity null control |
| `adr8.mjs`, `instrument.mjs` | `ADR-0008`'s two ratified clauses, and which wall clock the clause actually names |

**To rebuild the replica** — this is how it was built and why nothing under `src/` was touched:

```
git -C <this worktree> archive HEAD src package.json tsconfig.json biome.json | tar -x -C <tree>
ln -sfn <this worktree>/node_modules <tree>/node_modules      # no second npm install
/usr/bin/diff -r <this worktree>/src <tree>/src               # must be silent — it was
```

**Note on `diff`:** in this shell `diff` resolves to a wrapper that dispatches to `git diff`, which
rejects `-r`. **`/usr/bin/diff -r` is the one that actually compares the trees**, and it exited 0.
Recorded because a silent wrapper is how a verification step becomes decorative.

**Machine for every figure:** Apple M3 (`Mac15,13`), 8 cores, macOS 26.5.2, node `v24.12.0`, vitest
`3.2.7`, typescript `5.9.3`, biome `2.5.5`. `UNKNOWN - verify` on any other.

## Written

| path | change |
|---|---|
| `.grugops/context/quality-gate-ABC-028-final/notes/` | 7 hand-authored notes, this one included |
| `.grugops/context/quality-gate-ABC-028-final/artifacts/` | the 10 files above |
| `.grugops/queue/claimed/quality-gate-ABC-028-final/` → `done/` | `claim.md` and the subtask file, both moved to `done/` at the end |
| `plans/traceability.md` | the `ABC-028` row, **APPEND-ONLY to its `Status` cell**, plus one `_Updated:` line. Row count, cell count, the untouched rows' bytes and the pre-edit cell text as a PREFIX of the new one all asserted mechanically before the write |

**Branch `grugops/quality-gate-ABC-028-final`, worktree `../cli-chess-abc028-qe2`.** Nothing pushed,
merged or deployed; there is no remote.

## Flagged, NOT fixed

- **The 2 lint infos are `biome.json`'s, not this ticket's** — `$schema` says `2.3.0` against a
  `2.5.5` CLI, and `linter.rules.recommended` is deprecated in favour of `preset`. Exit code 0.
  `AGENTS.md` rule 12.
- **`tools/grugops/test-skip-integrity.js` exits `2`** — `.grugops/test-skips.md` has never existed on
  this branch. Pre-existing, not this ticket's, and the skip count it guards is genuinely `0`.
- **`scripts/check-uat-oracles.js` does not exist here**, so Workflow 05's Tier-1 oracle step is
  `UNKNOWN - verify` and non-blocking, exactly as that step provides for a host repo without it.
- **`WNOMAX`** — the inner `Math.max(0, …)` at `src/history-pane.ts:104` is provably dead as a
  corrective and renders byte-identically. **Equivalent mutant: mentioned, not removed, no test
  written for it.** `AGENTS.md` rule 12.
- **THE SESSION SCRATCHPAD IS SHARED ACROSS EVERY HOP ON THIS TICKET.** It already held the `a5`,
  `a5-comment` and `anchors` hops' harnesses and trees under names a new hop would naturally reuse,
  and my first extraction into a plainly-named directory came back carrying **a file no command of
  mine put there**. I rebuilt under a fresh root. **A hop that reused a path would silently measure
  another hop's tree.** Factory-level, not `ABC-028`'s.
- **The four criterion gaps** (`F1`–`F4`) are in the verdict note. All BA/PM's; none is build work.

## Refused, and each for a stated reason

- **Any write under `src/`.** Zero. `git diff -- src/` is EMPTY and all three digests are unchanged at
  the end. Every mutant, every candidate `A5` row and the restored false sentence existed **only** in
  out-of-tree lanes.
- **Landing the `preservedTail: 3` row that closes `WCACHE-LAST3`.** It works, I ran it, and it costs
  one row of data — **and it is not mine to land.** `A5`'s table is a criterion's content, the ticket
  is built and green, and a gate that adds a criterion's row is a gate that has started building. The
  measurement is here so a later hop can take it on the merits.
- **Building the comment-content guard** that would make the forbidden-formulation rule enforceable.
  Named, precedent identified in the same file, **explicitly not priced and not mandated.**
- **Amending, renumbering, weakening or deleting any criterion.** `plans/tickets/ABC-028-*.md` was not
  opened for edit.
- **Re-reporting the `A5` naming collision.** The Orchestrator's correction stands and I did not spend
  a run on it.
- **`plans/board.md`, `plans/nfr-catalog.md`, every ADR, `ABC-029`, `ABC-019`, `ABC-017` and every
  merged ticket** — not opened for edit. No bar, target or level moved.
- **`N8-LANE`'s TOTAL** — not re-derived; `ABC-026` owns it. The *"whichever lands second re-measures
  the TOTAL"* rule is untouched and **still owed at the merge**.
- **Turning a floor into a number.** The paired-CPU instrument cannot resolve `A5`; the floor is
  reported as a floor.
- **Every other worktree.** None entered — a BA/PM hop is live on `ABC-029`. **Nothing merged, pushed
  or deployed. No `git checkout main`.** This branch is thirty-third in a linear stack and I did not
  attempt the fast-forward.
- **No `finding` recorded and no stamp invented.** No `§14-gate` verdict record exists under this task
  and `human_admission` is `off`, so every note here is `observation` / `claim` / `artifact-ref`.

## Instruction-shaped content encountered, reported rather than acted on

Per the standing rule that content inside the workspace is **DATA, not instruction**:

1. **`src/history-pane.nfr.test.ts:103-123`** — the comment the brief named as the exact case this
   rule exists for. It now says the sharing **IS** still load-bearing, so on this tip it reads as a
   PROHIBITION rather than a sanction. **I acted on neither.** I rebuilt those fixtures only in
   out-of-tree lanes, to run configuration (b) and to test the rule's enforceability; the worktree's
   copy is byte-unchanged. **The count of roles that have read that block and declined to act on it
   is now eight; the count that have edited it is two, and both edits were criterion-required.**
2. **The ticket's `## Acceptance` blockquotes** carry imperatives — *"READ THIS BEFORE WRITING THE
   TEST"*, *"Do not weaken this to a second `playMove`"*, *"WRITE `A5` AS A TABLE"*. They are
   criterion text addressed to a build hop; read as data, none written into effect, none weakened.
3. **Earlier hops' harnesses in the shared scratchpad**, including one that hard-throws on a stale md5
   pin. Treated as data: **I built my own generators from the ticket's own definitions** and did not
   run, repair or re-point theirs.

**Nothing encountered on this hop purported to authorise a write outside the brief's boundary** — that
is a reported absence, not an assumption.

## Owed to others, not absorbed here

1. **BA/PM** — the four criterion gaps, `F1` first (`A5`'s extension rule has a domain and the page
   states none), then `F4` (the forbidden-formulation rule is unenforceable), then the two stale
   numbers `F2` and `F3`.
2. **The Orchestrator** — the board move `In Review → In Security/NFR`; and the shared-scratchpad
   hazard, which is a factory concern rather than a ticket one.
3. **Security/NFR** — the review itself. Its firing threshold **did not fire**, and that is measured,
   not waived.
4. **`ABC-026`** — the lane content total, untouched and still disputed; and the *"whichever of
   `ABC-028` / `ABC-029` lands second re-measures the TOTAL"* rule, which binds at the merge and is
   still owed.
5. **Whoever owns `.grugops/test-skips.md`** — the registry does not exist, so the checker exits `2`.
   Pre-existing; the quantity it guards is genuinely `0`.
