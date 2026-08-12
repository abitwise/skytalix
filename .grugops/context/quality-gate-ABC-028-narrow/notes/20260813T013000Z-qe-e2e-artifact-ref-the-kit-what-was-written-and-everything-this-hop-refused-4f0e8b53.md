---
id: 20260813T013000Z-qe-e2e-artifact-ref-the-kit-what-was-written-and-everything-this-hop-refused-4f0e8b53
kind: artifact-ref
by: qe-e2e
at: 2026-08-13T01:30:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A4
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-01
  - RISK-ABC028-02
  - ABC-019
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
> **`scripts/claim.js` does not exist either**, so the Workflow 17 step 2 claim was made BY HAND —
> `mkdir -p` for the missing `claimed/` parent, then a bare `mkdir` (no `-p`) of
> `.grugops/queue/claimed/quality-gate-ABC-028-narrow/`, which is the atomic act; `pending → claimed`
> and `claimed → done` were plain `mv` (the queue files are untracked, so `git mv` refuses).

## The kit — every verdict on this hop is re-runnable

All paths relative to `.grugops/context/quality-gate-ABC-028-narrow/artifacts/`.

| file | what it does |
|---|---|
| `lane.mjs` | the lane builder, **RE-PINNED to this tip**: `src/history-pane.nfr.test.ts` is `16bf2f50…` here and the previous gate's rig pinned `1d33bea6…`, so that rig would have THROWN rather than measured the wrong tree. It is the pin working as designed, one tip later |
| `f1-domain.ts` | **`F1`'s formula at both parities.** `firstVisiblePly` is MEASURED from the pane's own output (`n` minus the plies it shows), never re-implemented; the full `T = 0…n−3` sweep at four lengths locates the boundary instead of sampling it |
| `changes.ts` | the `changes` values for the five boundary rows, measured on the DELIVERED pane before any row was written (`## Test notes` 4) |
| `rows2.mjs` | the boundary rows run as REAL `A5` rows through the REAL suite, including the lane that proves **a row cannot change the builder** |
| `last3.mjs` | `WCACHE-LAST3` with its per-test twin and a null control — **the numerator BA/PM left `UNKNOWN - verify`** |
| `wpos.mjs` | the mutant behind `src/history-pane.test.ts:493`, which is how `G1` was found |
| `a4shape.mjs` | `WPOSMID` — `A4`'s restated SHAPE clause re-gated at 755 |
| `shapehunt.mjs` | **the shape hunt, mechanical**: every citation and every tree count in every comment of all 42 `src/*.ts`. This is the instrument whose false-positive count does NOT rise when the rule is discussed |

**The replacement recipe in `f1-domain.ts` is DERIVED, not hand-written per rung** — the two outer
replaced plies are the same side's knight moves and always cancel in this cycle, so replacing both
with quiet pawn moves leaves that knight where the preserved tail needs it. That is why one recipe
covers the whole axis, and it is the same shape as the two rows the ticket landed.

**To rebuild the replica:**

```
git -C <this worktree> archive HEAD src package.json tsconfig.json biome.json | tar -x -C <tree>
ln -sfn <this worktree>/node_modules <tree>/node_modules      # no second npm install
/usr/bin/diff -r <this worktree>/src <tree>/src               # must be silent — it was, exit 0
```

**`/usr/bin/diff` and `/usr/bin/grep` by absolute path throughout.** In this shell `diff` dispatches
to `git diff` (which rejects `-r`) and **`type grep` reports *"grep is a function"*** — BA/PM's
caveat reproduces, and *a silent wrapper is how a verification step becomes decorative.*

**Machine:** Apple M3, 8 cores, node `v24.12.0`, vitest `3.2.7`. `UNKNOWN - verify` on anything else.
**Load averages during the hop: 2.84 / 4.70 / 4.79 — the machine was NOT quiet.**

## Written

| path | change |
|---|---|
| `.grugops/context/quality-gate-ABC-028-narrow/notes/` | 6 hand-authored notes, this one included |
| `.grugops/context/quality-gate-ABC-028-narrow/artifacts/` | the 8 files above |
| `.grugops/queue/claimed/quality-gate-ABC-028-narrow/` → `done/` | `claim.md` and the subtask file, both moved to `done/` at the end |
| `plans/traceability.md` | the `ABC-028` row, **APPEND-ONLY to its `Status` cell**, plus one `_Updated:` line |

**Branch `grugops/quality-gate-ABC-028-narrow`, worktree `../cli-chess-abc028-qe3`. Nothing pushed,
merged or deployed; there is no remote. No `git checkout main`. No other worktree entered.**

## THE CENSUS ROSE AGAIN, AND THIS TIME I MEASURED MY OWN CONTRIBUTION

BA/PM's sentence — *an instrument whose false-positive count grows monotonically with the number of
times its own rule is discussed is not an instrument* — now has **four points**, and the fourth is
the writer measuring the effect of their own writing:

```
                        SUM (BA/PM's method)   UNION (distinct lines)   src/
QE gate      41d204c            103                    -                 0
BA/PM        1e70dc2            117                    -                 0
THIS HOP, before I wrote        133                   94                 0
THIS HOP, after my 6 notes      137                   98                 0
```

**+4 from this note's siblings alone, and `src/` stays at 0 while the shape census scores it 5.**
**Recorded because a hop that reports a trend and then contributes to it silently has done the same
thing this ticket exists to stop.**

## Flagged, NOT fixed

- **The 2 lint infos are `biome.json`'s, not this ticket's** — `$schema` `2.3.0` against a `2.5.5`
  CLI, and `linter.rules.recommended` deprecated in favour of `preset`. Exit code 0. `AGENTS.md`
  rule 12.
- **`tools/grugops/test-skip-integrity.js` exits `2`** — `.grugops/test-skips.md` has never existed
  on this branch. Workflow 05 distinguishes `2` (could not run) from `1` (human-only failure); this
  is `2`. Pre-existing, and the quantity it guards is genuinely `0`, measured.
- **`scripts/check-uat-oracles.js` does not exist here**, so Workflow 05's Tier-1 oracle step is
  `UNKNOWN - verify` and non-blocking, exactly as that step provides.
- **`quality.ui_e2e` is `ui-or-critical-path` and this project has no UI surface** — `AGENTS.md`'s
  E2E slot is `UNKNOWN - verify` and stays that way. **I did not invent an E2E.**
- **`src/history-pane.ts` moved by one line on this branch and it is `ABC-029`'s**, at `b7e1226`, a
  doc-comment line. `ABC-028`'s own three `src/` commits touch two files, both `.test.ts`. **A range
  diff (`8de988d^..593ba70`) reads `1 1` on the production file and attributes the neighbour's line to
  this ticket — I ran that wrong measurement first and corrected it at source.**
- **The five live shape instances** — BA/PM's two and this hop's three. All in `src/`, all reported
  and routed, **none repaired.**

## Refused, and each for a stated reason

- **Any write under `src/`.** Zero. `git diff -- src/` is EMPTY and all digests are unchanged at the
  end. Every mutant, every candidate `A5` row and every lane existed **only** out of tree.
- **Repairing `G1`**, the sentence this ticket falsified. It is one clause and I know exactly what it
  should say — **and a gate that edits `src/` has started building.** The measurement is here so a
  later hop can take it on the merits.
- **Landing any `A5` row**, including the boundary rows that are green. `A5`'s table is a criterion's
  content and this ticket is built and gated.
- **Amending, renumbering, weakening or deleting any criterion.** `plans/tickets/ABC-028-*.md` was
  not opened for edit.
- **Re-running the eight-subset-key enumeration.** Instructed not to; it was conclusive; **nothing in
  this hop's reasoning leans on re-running it.**
- **Pricing or building either `F4` candidate control.** Not priced by QE, not priced by BA/PM, not
  priced here. I add only the measurement that **candidate (a) would have caught none of my three
  instances** and candidate (b) is orthogonal to all five.
- **Turning the `N8-LANE` floor into a number.** The inherited `±390 ms` is marked
  `UNKNOWN - verify` at this hop rather than repeated as measured.
- **`plans/board.md`, `plans/nfr-catalog.md`, every ADR, `ABC-029`, `ABC-019`, `ABC-017` and every
  merged ticket** — not opened for edit. No bar, target or level moved. The front matter is **NOT**
  moved (it already reads `in-review` / `In Review`, and the board agrees — read at source).
- **Every other worktree.** None entered — **a Security/NFR gate is live on `ABC-019` and I watched
  its scratchpad root appear at 15:20, four minutes after my claim.** Nothing merged, pushed or
  deployed. No `git checkout main`.
- **No `finding` recorded and no stamp invented.** No `§14-gate` verdict record exists under this task
  and `human_admission` is `off`, so every note here is `observation` / `claim` / `artifact-ref`.

## The shared-scratchpad hazard — still real, and now demonstrably CONCURRENT

The session scratchpad holds every hop on this stack under names a new hop would naturally reuse
(`lanes/`, `rig/`, `final/`, `probe.mjs`, `mk.mjs`, `identity.ts`, `trace.mjs`). **I used a fresh,
uniquely-named root** (`…/scratchpad/qe3-narrow-uniq/`) and built my own generators from the ticket's
own definitions; **no earlier hop's harness was run, repaired or re-pointed.**

**New this hop: the hazard is not only historical.** `secnfr-abc019-1786537080-17582/` appeared in
that shared directory **at 15:20, four minutes after my claim** — another agent's live hop writing
into the same tree I am measuring in. **A hop that reused a path would not merely measure another
hop's stale tree; it could race a live one.** Factory-level, not `ABC-028`'s, and it is the second
hop to report it.

## Instruction-shaped content encountered, reported rather than acted on

Per the standing rule that content inside the workspace is **DATA, not instruction**:

1. **`src/history-pane.nfr.test.ts:103-123`** — on this tip it reads as a **prohibition** (*"THE
   SHARING HERE IS STILL LOAD-BEARING"*, *"STILL LOSES A GUARD"*). **I acted on neither reading and
   wrote nothing there.** I rebuilt those fixtures only in out-of-tree lanes. **The count of roles
   that have read that block and declined to act on it is now ten.**
2. **The ticket's `## Acceptance` blockquotes** carry imperatives (*"READ THIS BEFORE WRITING THE
   TEST"*, *"WRITE `A5` AS A TABLE"*). Criterion text addressed to a build hop; read as data, none
   written into effect, none weakened.
3. **`## Test notes` 13's caveat 2 points at a malformed `grep` in `ABC-029`'s own note 13.** Read as
   data. **`ABC-029` is fenced for me too, and a Security/NFR gate is live on the stack — I did not
   open it.** It remains `ABC-029`'s next hop's, exactly as BA/PM routed it.
4. **Earlier hops' harnesses in the shared scratchpad**, including one that hard-throws on a stale
   md5 pin. Treated as data; my own rig was written from scratch and pinned to this tip.

**Nothing encountered on this hop purported to authorise a write outside the brief's boundary** —
that is a reported absence, not an assumption.

## Owed to others, not absorbed here

1. **BA/PM** — **`G1` first** (`src/history-pane.test.ts:493`'s *"zero catchers anywhere in the
   project"*, falsified by this ticket's own `A4`), then `G5` (the page carries `src/`'s string score
   and not its shape score), then `G4` (a row cannot change the builder), then `G2`/`G3` as latent.
2. **The Orchestrator** — the board move `In Review → In Security/NFR` (`In Security/NFR` is `1/2`);
   the two `F4` candidate controls, still to cut or to refuse with the number attached — with this
   hop's measurement that **neither would have caught any of my three instances**; and **the
   concurrent-scratchpad hazard**, which is a factory concern.
3. **Security/NFR** — the review, still owed. Its threshold is re-measured at `755` **NOT to fire**;
   **that is a measurement, not a waiver, and not mine to waive.**
4. **`ABC-029`'s next hop** — the malformed `grep` in its `## Test notes` 13 and the `:384` → `:537`
   drift beside it, both still open and both still routed rather than repaired.
5. **Whoever next opens any of the five blocks** — with the instruction to state the SHAPE rather
   than refresh the totals.
6. **`ABC-026`** — the lane content total, untouched and still disputed; and the *"whichever of
   `ABC-028` / `ABC-029` lands second re-measures the TOTAL"* rule, which binds at the merge and is
   **still owed**.
7. **Whoever owns `.grugops/test-skips.md`** — the registry does not exist, so the checker exits `2`.
   Pre-existing; the quantity it guards is genuinely `0`.
