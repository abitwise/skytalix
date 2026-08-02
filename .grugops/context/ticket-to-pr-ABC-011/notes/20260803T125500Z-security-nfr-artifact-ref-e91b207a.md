---
id: 20260803T125500Z-security-nfr-artifact-ref-e91b207a
kind: artifact-ref
by: security-nfr
at: 2026-08-03T12:55:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - EPIC-001
  - EPIC-006
  - NFR-005
  - src/zobrist.nfr.test.ts
  - src/zobrist.ts
  - src/legal.ts
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - plans/tickets/ABC-011-zobrist-en-passant-hashing.md
supersedes: 
---

# What this gate produced and where each piece lives

Everything is on branch `grugops/ticket-to-pr-ABC-011`, on top of QE's `6c6b6d6`. **No PR exists —
this repo has NO git remote** (`git remote` is empty), so there is nowhere to push and no pull
request to open. No link was invented. **A human holds merge and deploy; nothing was merged and
nothing was deployed.**

## Verdict

**PASS** (`PASS_WITH_RISKS` in this role's vocabulary), against `security.asvs_level: L1` and
`security.block_on: high`. **No security finding at any severity; nothing at or near `high`.**
Three accepted risks, each with a named owner. **No required fixes.**

## The one file added — no production code touched

`src/legal.ts` and `src/zobrist.ts` are **byte-identical to `6c6b6d6`.** The repository's own `src/`
was mutated transiently three times to prove the new assertions fail, with both files backed up and
restored; `git status` afterwards showed only the new untracked test file.

- **`src/zobrist.nfr.test.ts`** — NEW file, 4 assertions in 2 `describe` blocks. Pins `NFR-005`'s
  no-ep sub-bar, which no other test in this repo can fail. In its own file on the
  `src/gameend.nfr.test.ts` (ABC-020) precedent: a `vi.mock` factory is hoisted to file scope, so
  putting these in `src/zobrist.test.ts` would re-route the module graph for all 13 tests there to
  buy 4 assertions. Here it re-routes nothing else.

Suite **189 → 193**, skip count **0**. Deterministic by construction — fixed FENs, fixed seed, no
clocks, no randomness — so no flaky risk introduced. **No wall-clock assertion anywhere**: those are
machine-dependent and live in `plans/nfr-catalog.md` with their machine, which is the discipline
`src/gameend.nfr.test.ts` states in its own header.

Each assertion was **proven to fail**, not assumed to, by applying each mutant to `src/` and running
it: `Z1` and `Z4` die on the call-count assertion, `L11` on both probe cases. The second probe FEN
(`4K3/8/8/8/8/k7/p7/R7 b - - 0 1`) is this gate's own construction and is the case where the
byte-identity assertion is the **only** one that bites.

## The board, the ticket, the trace and the catalog

- **`plans/board.md`** — `ABC-011` moved **`In Security/NFR` → `Ready for UAT`**. In Security/NFR
  1/2 → 0/2, Ready for UAT 0/4 → 1/4; no limit approached, no override taken. Header updated, exit
  comment written under `## In Security/NFR`, entry comment under `## Ready for UAT`, live ticket row
  moved. UAT recorded as **DEFERRED to `EPIC-006`**, with what a human should exercise once a
  runnable game exists.
- **`plans/tickets/ABC-011-…md`** — front matter `status: ready-for-uat` / `column: Ready for UAT`;
  the move recorded in `## Definition of Ready` beside the dev and QE hops', carrying the full
  `NFR-005` table, the sub-bar reasoning, the ASVS L1 result and both defect rulings.
- **`plans/traceability.md`** — `ABC-011`'s row updated **in place** (NFRs / Tests / UAT / Status),
  prior text kept behind `Previously:` markers. **No row appended** — one row per ticket is this
  file's own format rule. The **UAT cell is filled for the first time** and reads "UAT deferred —
  EPIC-006" so the gap stays visible rather than being quietly marked passed.
- **`plans/nfr-catalog.md`** — `NFR-005`'s row gains this gate's independent figures and **one
  correction, which is the deliverable the task asked for**: the "not made slower at all" sub-bar is
  a **CALL-COUNT bar, not a timing bar**, and the row did not say so. No wall-clock run can settle
  "at all" — this gate's own no-ep timings sit at 1.003–1.007x, inside noise in both directions. The
  row now carries the structural argument, the spied counts, and the fact that
  `src/zobrist.nfr.test.ts` pins it. **No target moved**; the depth-in-budget target, both levels,
  the PROVISIONAL marker, the amortized row, the allocation figure and every node-rate diagnostic are
  byte-identical, and NFR-001/002/003 are untouched. This is the fourth denominator correction of
  this class the file has had to make, and it is labelled as such.
- **`AGENTS.md`** — **deliberately unchanged.** No command changed, no command was added, and no
  `UNKNOWN - verify` slot became knowable. The skip-count capture command was run exactly as written
  and returned `0`. Editing it to look busy would be the fabrication its own header warns about.

## The reasoning and the measurements

- `…/20260803T124000Z-security-nfr-decision-7b3ac914.md` — the **PASS** verdict: the `NFR-005` table
  with its bar column and the cross-check against both prior hops, why wall clock cannot adjudicate
  the sub-bar, the decision to **pin** rule 1 and how the ABC-020 precedent was weighed rather than
  copied, the off-board write ruled **correctness not memory-safety** with the measurement behind it,
  QE's new defect ruled **MEDIUM / does not block**, the security result, and the board move.
- `…/20260803T124500Z-security-nfr-observation-a2f19d63.md` — the raw record: gates, the per-call
  cost table, the spy counts, the mutant-by-mutant kill table with the exact assertion messages, both
  defect mechanisms traced, the typed-array bounds probe, the **ASVS L1 sweep with its 70-row
  breakdown** and the four rows named rather than dismissed, purity, and the harness.
- `…/20260803T125000Z-security-nfr-claim-c48d7f05.md` — the **three accepted risks with their named
  owners** and four things this gate could not settle, at `confidence: UNKNOWN - verify`.

## The harness — NOT in the repository, deliberately

Six throwaway scripts in the session scratchpad, plus a `git archive` extract of `4c6ed7d` and a
mutation copy of `src/`: `secbench.ts`, `spy/shim.ts` + `spy/zobrist.ts` + `spy/walk.ts`,
`mut/offboard.ts`, `mut/probe15.ts`, `defect.ts`. They import the repo by absolute path. **Not
committed** — the same posture every measurement on this project has taken; every number is
transcribed into the observation note with its machine, so nothing depends on them surviving.

## Substrate

Recorded rather than glossed, as every prior task here has: this install has **no `scripts/`
directory at all** — no `scripts/claim.js` and no `scripts/context-io.ts` /
`mcp__grugops__propose_note`. The queue file was moved `pending/` →
`claimed/ticket-to-pr-ABC-011-sec/` → `done/ticket-to-pr-ABC-011-sec/` **by hand**, with a `claim.md`
registry record written by hand alongside it, and these four notes were **hand-written** into
`notes/` in the schema's exact shape. **No `finding` was written — none is admissible without a §14
gate to issue a stamp, and `context.human_admission` is `off` so no `human:<name>` stamp is available
either — and nothing was self-stamped.** The kinds used are `decision`, `observation`, `claim` and
`artifact-ref`. There is no `index.md` / `index.jsonl` render because the renderer does not exist
here.

**One consequence stated plainly rather than hidden:** this role's `Output (file + format)` calls for
required fixes and accepted risks to publish as `finding`/`observation` notes. Half of that is
unavailable on this substrate, so every result that would have carried a `finding` kind is published
as an `observation` or a `claim` instead. The degraded kind changes the note's **admission class**
only — never the severity, the ownership, or the blocking decision, all of which are stated in full
in the note bodies.
