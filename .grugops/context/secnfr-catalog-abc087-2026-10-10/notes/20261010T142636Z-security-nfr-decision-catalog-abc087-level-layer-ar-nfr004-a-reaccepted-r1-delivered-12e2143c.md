---
id: 20261010T142636Z-security-nfr-decision-catalog-abc087-level-layer-ar-nfr004-a-reaccepted-r1-delivered-12e2143c
kind: decision
by: security-nfr
at: 2026-10-10T14:26:36Z
verified_by:
confidence: high
refs:
  - ABC-087
  - ABC-101
  - ABC-085
  - EPIC-006
  - NFR-004
  - AR-NFR004-A
  - RF-1
  - R1
  - QE-087-c
  - RR-LEVEL1-REALCLOCK
  - RISK-003
  - ADR-0035
  - plans/nfr-catalog.md
  - plans/traceability.md
  - src/levels.ts
  - src/levels.test.ts
  - .grugops/queue/pending/secnfr-catalog-abc087-2026-10-10.md
  - .grugops/context/secnfr-ABC-087/notes/20261010T130030Z-security-nfr-decision-abc087-pass-with-risks-nfr004-ruled-per-move-played-ar-nfr004-a-reaccepted-clamp-pin-owed-3f1974f5.md
  - .grugops/context/secnfr-ABC-087/notes/20261010T125954Z-security-nfr-observation-abc087-nfr004-level3-12ms-ceiling-5006ms-floor-589ms-clamp-pin-10ms-231d41c8.md
  - .grugops/context/ticket-to-pr-ABC-087/notes/20261010T130840Z-software-engineer-observation-abc087-r1-clamp-pin-qe087d-draw-pin-14ec8ea7.md
  - .grugops/context/wave-2026-09-25/notes/20261010T141247Z-orchestrator-decision-owner-word-uat-q4-5c8e2a17.md
  - .grugops/context/bapm-followups-2026-10-10/notes/20261010T141840Z-ba-pm-decision-five-followups-rebased-abc087-a2-after-owner-acceptance-f9ef24db.md
  - .grugops/context/secnfr-catalog-2026-10-10/notes/20261010T132352Z-security-nfr-decision-catalog-abc074-m3-only-risk003-0p8x-nfr003-no-tab-8f6351d1.md
supersedes:
---

# Catalog after the `ABC-087` merge: `AR-NFR004-A` re-acceptance and the `NFR-004` level-layer wording are transcribed into `plans/nfr-catalog.md`. The clamp pin owed as `R1` is DELIVERED (`1160b063`), and `M4` was re-planted here and turns it red. `A2`'s ±20 % is recorded as an injected-clock property. **No level, bar, target or measured figure moved. No table row was touched.**

This note is hand-authored and unsealed. It is a `decision`, not a stamp: the install has no sanctioned
writer, and `human_admission` is `off`.
- **Branch:** `grugops/secnfr-catalog-abc087-2026-10-10`, cut from the wave tip `5a4c53c2`.
- **What owed this hop:** decision `secnfr-ABC-087` `…3f1974f5` (§ "Proposed `NFR-004` catalog wording" and
  § "`AR-NFR004-A` — re-accepted at this hop"), once `ABC-087` merged. It merged as `b696d8e8`, accepted by the
  owner (`…owner-word-uat-q4-5c8e2a17` item 2).

## What changed in `plans/nfr-catalog.md` (73 lines added, 1 removed, `NFR-004` section and header only)

1. **Header:** a new `_Updated:_` line at the top, the newest of the dated update lines.
2. **`AR-NFR004-A` (CLAUSE A):** the re-acceptance block is inserted directly under the risk's blockquote.
   - It is transcribed verbatim from `…3f1974f5`: level 3 = `DEFAULT_BUDGET_MS`, 24/30 over, max +12 ms
     (0.40 %), median +2 ms, the ceiling residual 5 000–5 015 ms, and the +90 ms first-call reading held
     outside.
   - A lead-in states that this is the risk's own discharge route ("re-accepts this risk in writing with its
     number"). The row is not edited.
   - Two read-at-transcription bullets follow:
     - the live-exposure sentence still holds at `5a4c53c2` (`src/cli.ts:175`; no production importer of
       `levels.ts`);
     - the figures are on Node v26.11.0, off the reference runtime. The re-acceptance does not re-base it.
3. **New sub-section "THE LEVEL LAYER (`ABC-087`)", after CLAUSE B and before the fence.**
   - The proposed wording is transcribed verbatim, followed by three numbered notes:
     - (1) `R1` is delivered;
     - (2) `A2`'s ±20 % is an injected-clock property (BA/PM `…f9ef24db` item 5). This is wording, not a bar;
     - (3) what did not change: the runtime, `R1`'s escalation cannot fire, and ruling 7 stays with
       `EPIC-006`/`ABC-101`.
4. **The fence's `Verified by` paragraph:** a dated sentence is appended, so the paragraph is one line
   replaced. **The cell is NOT moved.**
   - `secnfr-ABC-087` ruled on the M3, but on Node v26.11.0, and its own proposal kept the cell out of scope.
   - Whether a v26.11.0 ruling counts as "on the M3 reference" waits on the open re-basing question (the
     `ABC-074` section). The trigger stands.

## The clamp pin: what was owed and what was delivered

| | `R1` as ruled (`…3f1974f5`) | as delivered (`1160b063`, in `b696d8e8`) |
|---|---|---|
| level | `{ budgetMs: 20 000, blunderRate: 1 }` | same |
| position | a 5-move position | `6k1/8/8/8/8/8/1R6/6K1 b - - 0 1` (5 legal moves) |
| clock | `virtualClock(250)` | same |
| assertion | `elapsedMs ≤ HARD_CEILING_MS + 4·step` | same, plus `kind !== "engine"` |
| lane | default (~10 ms) or `ENGINE_DEEP` | default, ~6 ms (Engineer) |
| `M4` red | 20 750 (out of tree) | 20 750 (Engineer, `…14ec8ea7`) |

**Re-planted at this hop, out of tree.**
- **Setup:** a `git archive 5a4c53c2` copy in a private scratchpad, with `node_modules` symlinked, running
  `npx vitest run src/levels.test.ts`.

| tree | load1 | result |
|---|---|---|
| pristine | 5.79 | exit 0, 22/22 passed |
| `M4`: `src/levels.ts:123` `Math.min(level.budgetMs, HARD_CEILING_MS)` → `level.budgetMs` | 7.73 | exit 1, **1 failed / 22**. The failure is the `R1` row only: *"expected 20750 to be less than or equal to 6000"* |

- **The ruling's pin is the one `ABC-087` delivered. Nothing of `R1` is still owed.**
- No QE note reviews `1160b063` by name, because QE's `qe-ABC-087` notes predate it (12:38Z vs 13:08Z).
  The row is in the tree the owner accepted.
- **Recorded, not graded.** The re-plant above is an independent read of the row. Whether a test-only row
  added after QE's verdict owed a QE read is the Orchestrator's routing call, not this hop's.

## Verified

- **Row hashes** (`sha256` of each `^| NFR-00n |` line, first 16 hex characters). They are identical before
  and after:

  | row | hash |
  |---|---|
  | `NFR-001` | `fcae7ccf6fc83510` |
  | `NFR-002` | `75fcc5e290f0287e` |
  | `NFR-003` | `b4e0d7f26ba6029b` |
  | `NFR-004` | `053ba48a4413610b` |
  | `NFR-005` | `00e245dbd69d0e88` |
  | `NFR-006` | `850ba1371d0d3fba` |
  | `NFR-007` | `a6121cbd598a8313` |
  | `NFR-008` | `080ba0173ba2d7fc` |
  | `NFR-009` | `5ab79753452d6780` |

  - The eight-row hash (`^\| NFR-00[1-8] \|`) is `d7ee3487…8b84f`, unchanged from `…8f6351d1`'s "after".
  - The nine-row hash is `191bbf02…7171e`, unchanged.
  - There are 66 `|` table lines before and after.
- **Untouched, as fenced:**
  - `RISK-003` is untouched. Its 0.8x figure stays `UNKNOWN - verify` until the gate re-runs on `ABC-131`'s
    build, which is being built in parallel and is not pre-empted.
  - `NFR-005`'s `PROVISIONAL` marker is untouched (the owner question is open).
  - `NFR-008` is untouched.
  - `ADR-0035` is not applied.
- **Not touched:** no `src/`, `plans/board.md`, ADR, ticket page or `AGENTS.md` byte.
- **Measured at this hop:** only the `M4` re-plant above. Every catalog figure is cited from a committed note.

## Handed on (each with an owner)

- **Olger Oeselg, via the Orchestrator. One question, carried and not new:** re-base the reference runtime
  (Node v24.12.0 → v26.11.0)?
  - It now gates the `NFR-004` `Verified by` cell as well as `NFR-008`'s named reference.
  - Architect/Design owns the protocol; the owner owns the level. LOW.
- **Security/NFR:** the `NFR-004` `Verified by` cell moves at the first `NFR-004` ruling on the reference
  machine and runtime. If the owner re-bases to v26.11.0, `secnfr-ABC-087`'s readings may serve, and that
  hop says so.
- **BA/PM, at `ABC-101`'s next refinement:** state the budget's clock (`RR-LEVEL1-REALCLOCK`). This is
  unchanged from `…f9ef24db` item 5.
- **Orchestrator:** none of this moves a board column. `ABC-087` stays `Done`.
