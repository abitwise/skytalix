---
id: 20260807T121500Z-security-nfr-decision-373e915b
kind: decision
by: security-nfr
at: 2026-08-07T12:15:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-014
  - ABC-014
  - ABC-015
  - ABC-018
  - EPIC-004
  - EPIC-006
  - RISK-005
  - NFR-002
  - plans/nfr-catalog.md
  - plans/board.md
  - plans/traceability.md
  - src/render.ts
supersedes: 
---

# The four accepted risks, each with a named owner — and what this gate refused to do

`security.block_on` is `high`. **No required fix is outstanding and nothing blocks.** Four accepted
risks are recorded, and an accepted risk without a named owner is a finding nobody fixes, so each
carries an owner **and a place**.

## The four

| # | Risk | Severity | Owner | Place |
|---|---|---|---|---|
| 1 | **The prototype-chain gadget.** `GLYPHS[mode]` (`:118`) and `glyphs[pieceType(piece)]` (`:139`) are unguarded prototype lookups; under an already-polluted `Object.prototype` a non-union mode, or a board byte with `(b & 7) === 7`, injects attacker data into the frame **including ESC** and breaks the 18-character geometry | **LOW** | Architect/Design | `ABC-018` / `EPIC-006` |
| 2 | **An out-of-domain board byte throws an uncaught `TypeError` with no context** — no square, no byte value, no module name | **LOW** | Architect/Design | `ABC-018` |
| 3 | **A non-`"white-bottom"` orientation silently renders BLACK-bottom** rather than throwing — a wrong board that looks plausible, which is the exact failure class acceptance criterion 2 exists to prevent | **LOW** | `ABC-015` / `EPIC-006` (they own the value) | `ABC-018` |
| 4 | **Every figure is one machine and one Node version** (Apple M3 / v24.12.0 / darwin-arm64) | **LOW** | Security/NFR | `EPIC-004`'s already-scheduled non-M3 spike (`RISK-002`'s mitigation) |

### Why each is LOW rather than higher

**(1)** is a *gadget*, not a *sink*. Its precondition is that `Object.prototype` is already
polluted — a position from which most of a single-process Node application is already reachable —
and **no pollution sink exists anywhere in `src/`**, verified with comments stripped. Both real
modes are immune (own properties shadow the pollution; verified against a live-pollution control).
Under ASVS L1 no requirement is *failed*: V2.2.1 is **not engaged**, because the module has zero
importers and no user-input path exists. The severity would move if `EPIC-006` ever passed an
unvalidated flag string as `mode` **and** a pollution sink appeared; both are named here so neither
has to be re-derived.

**(2)** The *decision* to throw is right and **is not re-opened**: the ticket's `## Out of scope`
puts position validity on `ABC-009`/`ABC-010`, AGENTS.md rule 8 forbids handling a scenario that
cannot occur, and nothing in merged `src/` can produce such a byte. QE already pinned the behaviour
with a characterization test — the correct response. What is carried forward is narrower and is
`ABC-018`'s: that is where an uncaught throw out of a render call meets a **half-drawn terminal**
with the cursor parked mid-frame, and where a caller may want the failure to be diagnosable.

**(3)** is deliberate and cheap: `orientation === "white-bottom"` is one comparison against a
two-member union, it is what AGENTS.md rules 6 and 7 ask for, and adding a runtime guard here would
be handling an impossible scenario for every compiling caller. It is recorded because the *silent*
failure mode is the dangerous half — a left-right mirrored board in which the king and queen swap
files is precisely the "looks plausible and is wrong" defect the ticket's own criterion 2 was
written against — and because the owner of the value is not this module.

**(4)** is this project's standing marker and is unchanged.

## An auditor MAY override a default severity; this one did not

`security.block_on: high` and the ASVS default-severity rule (L1 fail → high) are the gate's teeth.
**No default severity was overridden here, in either direction.** Nothing was demoted to keep the
gate green, and nothing was inflated to look thorough. The one requirement that could have been an
L1 fail — V2.2.1 — is recorded as **NOT ENGAGED**, with the measured reason (zero importers, no
entry point) and with the counterfactual under which it becomes HIGH and blocks.

## What this gate REFUSED to do, each with its reason

- **No production code was changed and no test was added.** `src/render.ts` md5
  `733bc67fec523a7f41016bea2b026e1d`, identical to the Engineer's and QE's published figure, and
  `git diff HEAD -- src/` is empty. No defect was found that warranted a fix, and this gate does not
  add tests to a suite QE has already broken 26 mutants against.
- **No wall-clock assertion was added.** This project's standing rule.
- **The prototype-gadget was NOT pinned by a test.** Pinning it would mean asserting behaviour under
  a deliberately polluted global — a test that damages the process it runs in, for a scenario with
  no reachable precondition. It is recorded here instead, where a reader of `ABC-018` will find it.
- **The three EPIC-002 contracts were not re-opened** (`[A4]` character shading, `[A1]`/`2b` the
  glyph mode as a parameter, `4a` the constant-geometry value), nor was the Engineer's layout split,
  nor QE's seven-place shading-character cost. None is a security or NFR question.
- **The self-healing snapshot net was NOT re-routed.** The Orchestrator already routed it to the
  `AGENTS.md` Scribe with a stated reason, and QE's experiment was not re-run destructively — it
  would dirty a tracked file in a tree this gate is working in, for a result already derived twice.
- **`plans/metrics.md` was not swept** (its header names the daily sweep and the retro as its
  owners), **`coverage/` was not deleted** (AGENTS.md rule 12 — flagged, not deleted; it remains a
  stale tracked artifact last written at `ABC-007`), and **no ticket prose was edited**.
- **The `ABC-014` ticket file's frontmatter was left alone.** It still reads
  `status: in-development` / `column: In Development` while the board says otherwise. **The Engineer
  flagged it, QE flagged it, and this is the third flag.** Ticket frontmatter is board state and the
  Orchestrator moves it; `plans/board.md` is the state of record. Three flags and no fix is itself
  the signal — owner Orchestrator, next board-touching task, exactly as the `ABC-012` drift the
  Orchestrator flagged in this same context folder.
- **`ABC-009`, `ABC-010` and `ABC-022` are carried, not fixed**, as every ticket in this wave
  carried them.
- **Nothing was merged and nothing was deployed.** The owner's standing merge authority is approval
  to merge work that **PASSED**, and it is not deploy approval; per `ADR-0007` this project deploys
  nowhere at all. A human holds both.

## What this gate DID write, and why those files are this role's

- **`plans/nfr-catalog.md`** — `NFR-002`'s row gains the measured board-scan compute half, and the
  section's unknowns table closes that row. Both the Engineer and QE flagged this as owed to this
  role and deliberately did not take it; that division is correct and the debt is now paid.
  **Exactly 3 lines changed** (the header, the `NFR-002` row, the unknowns-table row).
  **`NFR-001` and `NFR-003`–`NFR-007` are byte-identical, and `NFR-002`'s target cell is
  byte-identical — no target moved.** Verified by hashing the cells before and after, not asserted.
- **`plans/traceability.md`** — exactly one row (`ABC-014`), three cells: `NFRs`, `UAT` and
  `Status`. The diff is one line.
- **`plans/board.md`** — the `In Security/NFR → Ready for UAT` move, which is the one exit this role
  owns. `In Security/NFR` 1/2 → 0/2, `Ready for UAT` 0/4 → 1/4. No limit approached, no override
  taken.

## UAT is recorded as DEFERRED, explicitly NOT passed

`src/render.ts` has **zero importers**, returns a frame as a value, writes nothing and prompts for
nothing, and `AGENTS.md`'s `Dev / run` is `UNKNOWN - verify` because there is no CLI entry point.
**There is no surface a human can exercise, so a UAT pass would be a fabrication.** The cell is
filled with the deferral and its reason rather than left blank, so nobody reads the blank as an
omission. `ABC-018` is the first ticket that puts this frame in front of a human; `EPIC-006` owns
the runnable game. Same posture this column recorded on `ABC-012`.

## `compliance_regime` is `[]`

No Compliance Officer hand-off is owed. Recorded because Section 13 makes that hand-off mandatory
when a regime IS set, and a silent omission would look the same as a missed hand-off.
