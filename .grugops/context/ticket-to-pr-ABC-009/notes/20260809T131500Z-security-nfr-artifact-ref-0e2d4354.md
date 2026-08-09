---
id: 20260809T131500Z-security-nfr-artifact-ref-0e2d4354
kind: artifact-ref
by: security-nfr
at: 2026-08-09T13:15:00Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - EPIC-001
  - NFR-001
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - .grugops/queue/done/ticket-to-pr-ABC-009-sec
supersedes: 
---

# What this subtask produced, and where it is

Trace ids: **`ABC-009`** → **`EPIC-001`** → feature `—` → **`NFR-001`**. Branch
`grugops/ticket-to-pr-ABC-009` (worked on, not created — it already carried BA/PM's correction, the
Orchestrator's pull, the Engineer's fix at `8f540cf`, the timestamp correction at `a62485f`, QE's
hardening at `15cf580` and the routing note at `cff45ee`). Task `ticket-to-pr-ABC-009`, subtask
`sec-abc009-nfr`, Workflow 04.

## Code — NOTHING. Zero production lines, zero test lines.

`src/moves.ts` is **byte-identical** to `8f540cf` — md5 `0e247853ab2c05887c76105ff83d8621`, the
digest the Engineer published and QE re-verified — and `git diff 8f540cf -- src/moves.ts` is
**empty**. No file under `src/` was touched by this role at any point. Every mutation, patch, export
and counter this gate used lived in **copies outside the repository**.

## STATE files edited — four

- **`plans/nfr-catalog.md`** — the `NFR-001` row, which is this role's to own. **Exactly 2 lines
  changed of 545** (this file's single `_Updated:` header and that row). **NO TARGET MOVED, verified
  by hashing rather than asserted:** `NFR-001`'s **Target** cell (`e2f4aea108b09be1eed54c5107a94419`)
  and **Applies-to** cell (`4db7ab70934809c369d4389b9845db86`) are byte-identical before and after,
  its **ID** and **Category** cells are unchanged, and **`NFR-002` through `NFR-007` are byte-identical
  line for line** (all six md5s re-checked). **7 raw fields per table row before and after.**
- **`plans/traceability.md`** — **one row (`ABC-009`), three cells**: `NFRs`, `UAT`, `Status`, plus
  one prepended `_Updated:` line. The edit was made at **field level** so a cell count could not
  silently change, and **every added string was asserted to contain no literal `|` before writing**.
  Verified before and after: 30 table lines, `ABC-009` at **12 raw fields (10 cells)** against the
  header's 10, and **zero rows whose field count changed**.
- **`plans/board.md`** — the `In Security/NFR → Ready for UAT` move, the one board move this role
  owns. `In Security/NFR` **1/2 → 0/2** (header updated, the `ABC-009` line item removed, an EMPTIED
  record added), `Ready for UAT` **0/4 → 1/4** (header updated, the line item added, an ENTERED
  record added), plus one prepended `_Updated:` line. **Every one of the 12 columns had its header
  count re-verified against its line-item count — 0 wrong.** No other column touched.
- **`plans/tickets/ABC-009-legalmoves-position-mutation.md`** — frontmatter `status`/`column` to
  `ready-for-uat` / `Ready for UAT`, and a new **`## Security / NFR`** section appended. **Nothing
  above it was edited** — the whole diff is **237 insertions and exactly 2 deletions**, and the two
  deletions are the two frontmatter lines. `## Acceptance` is **byte-identical**, verified by hashing
  the `## Acceptance`→`## Dependencies` span before and after
  (`c62bd47a25cdb498253dbd1d4f89c5d6` both times).

## NOT edited, deliberately

`plans/tickets/ABC-022-*.md`, `ABC-010`, `ABC-011`, `ABC-013`, `plans/epics/EPIC-001*`,
`plans/metrics.md`, every `memory-bank/` file, and **every file under `src/`**. The `## Acceptance`
criteria were **not** touched — `G-1` and `G-2` are routed to BA/PM and closing a gap in one
artifact by editing another is the inversion `ABC-018`'s correction rejected. The
**`plans/traceability.md` rendering defect in rows `ABC-011` and `ABC-015`** (13 raw fields against
the header's 12, an unescaped `|` in a quoted shell pipeline) is **flagged and deliberately NOT
fixed** — the Orchestrator already ruled it out of this ticket's scope, and coding rules 9 and 12
say flag rather than repair. Re-verified after this role's edit: still exactly those two rows.

## Board and queue

- **Board move: `In Security/NFR → Ready for UAT`**, the one this role owns, on a **PASS WITH RISKS**
  verdict. `In Security/NFR` 1/2 → 0/2, `Ready for UAT` 0/4 → 1/4; no limit approached, no override
  taken, no written reason owed.
- Queue: `pending/ticket-to-pr-ABC-009-sec.md` → `claimed/ticket-to-pr-ABC-009-sec/` →
  `done/ticket-to-pr-ABC-009-sec/`, claimed **by hand** because `scripts/claim.js` is absent from
  both the repo and the kit — re-checked at the source rather than inherited from the subtask brief
  or the six prior records that say so. The registry record is `claim.md` inside the claim directory,
  carrying `task` / `role` / `claimed_at` / `claimed_by` / `method` / `outcome` and an honest note
  that the claim was manual.

## Notes published under this task

- `20260809T131100Z-security-nfr-observation-896727a9` — every gate re-run with exit codes, the
  third independent `A9` run, and the proof that this gate changed nothing.
- `20260809T131200Z-security-nfr-observation-8d8cf32e` — `NFR-001` both clauses on this gate's own
  three-tree instrument, the null controls, and the ±2%-per-cell / ~±1%-aggregate floor correction.
- `20260809T131300Z-security-nfr-observation-b95cd581` — the instrument that CAN resolve the per-cell
  question (count + isolated cost + labelled arithmetic), and the guard-ordering cost and selectivity
  measurements.
- `20260809T131400Z-security-nfr-decision-b67fabe0` — the **PASS WITH RISKS** verdict, the ruling on
  the Engineer's ±1% reasoning, the guard-ordering ruling, the security classification, the ASVS L1
  pass, and the ten risks with owners.
- `20260809T131500Z-security-nfr-artifact-ref-0e2d4354` — this note.
- `20260809T131600Z-security-nfr-claim-0d0fff8f` — the soft results, `confidence: UNKNOWN - verify`.

**Six in total. No `finding` was written** — none is admissible on this task: there is no §14 gate in
this install to issue a `§14-gate#<id>` stamp and `context.human_admission` is `off`, so no
`human:<name>` stamp exists either. **Nothing is self-stamped** — every note above carries an empty
`verified_by`. **No `index.md` or `index.jsonl` was hand-faked**; the renderer that derives them does
not exist here and a hand-written render would be a fabricated artifact.

## Throwaway artifacts, held outside the repository and named so nobody hunts for them

The three-tree `NFR-001` ratio harness (`ratio.mjs`), the counting-tree patcher and counter
(`patch-count.mjs`, `count.mjs`), the guard-ordering patcher (`patch-order.mjs`), the
permutation-invariance probe (`equiv.mjs`), the `generateMoves` cost harness (`cost.mjs`), the direct
`addCastlingMoves` harness (`direct.mjs`), the traceability field-level editor, and the six scratch
trees (`pre`, `post`, `twin`, `count`, and the three `ord-*`) all lived in this session's scratchpad,
**outside the repository**. Every patch asserted its anchor **unique** and its bytes **changed**
before writing, and refused rather than reporting a result otherwise. **Nothing under `src/` was ever
mutated** — `src/moves.ts` still hashes `0e247853ab2c05887c76105ff83d8621`.

## Next hop

The Orchestrator routes the `G-1`/`G-2` criteria text to BA/PM before the ticket leaves for
UAT/release, as its own scheduling note already planned. **This role does not certify its own
output.** **Nothing was merged and nothing was deployed** — a human holds both, and the owner's
standing merge authority is not deploy authority.
