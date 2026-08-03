---
id: 20260803T200000Z-security-nfr-decision-6a3996d5
kind: decision
by: security-nfr
at: 2026-08-03T20:00:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-009
  - ABC-010
  - ABC-012
  - ABC-020
  - EPIC-001
  - EPIC-004
  - EPIC-006
  - NFR-005
  - NFR-001
  - ADR-0005
  - plans/tickets/ABC-011-zobrist-en-passant-hashing.md
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - src/zobrist.ts
  - src/legal.ts
  - src/zobrist.nfr.test.ts
  - 20260803T124000Z-security-nfr-decision-7b3ac914
  - 20260803T160000Z-qe-e2e-decision-69ddf1ff
  - 20260803T161000Z-qe-e2e-claim-e471a730
supersedes: 
---

# VERDICT: PASS. `In Security/NFR` → `Ready for UAT`. The MEDIUM is closed; the interrupted run's verdict is upheld on this run's evidence, with corrections

The second risk/NFR gate on `ABC-011`, and the exit this role owns, taken on a **PASS**. Gate run
against `security.asvs_level: L1` and `security.block_on: high`. **No security finding at any
severity and nothing at or near `high`, so nothing blocks. No required fix is outstanding. Four
accepted risks ride with the pass, each carrying a named owner.** No production code was changed at
this gate.

## First: this run completed an interrupted one, and that is not a footnote

A first attempt at this subtask was cut off mid-flight. What it left on disk was **not admissible**:
`plans/board.md`, `plans/nfr-catalog.md`, `plans/traceability.md` and `src/zobrist.nfr.test.ts`
modified and uncommitted; the board already moved `In Security/NFR` → `Ready for UAT` with a PASS
and a long figure-carrying comment; **no typed note published at all**; and the queue subtask still
sitting in `claimed/`. The board asserted a verdict the shared verified context did not back. Under
"no published notes, no advance" that state cannot stand, and the project owner has already declined
to merge this ticket once — an unbacked PASS is exactly what must not slip through.

**I had two legitimate outcomes and I took the first only after earning it.** I treated that run's
board comment and catalog prose as **evidence to be checked, not as my conclusions**. I have no
access to its trajectory and inherited none of its claims on trust. Every load-bearing number was
re-derived here, on this run's own scripts, in this run's own processes.

**Its uncommitted prose was REVERTED rather than patched.** It was never committed, so it is not part
of the audit trail, and editing its numbers into place would have left a record that looked like mine
but was not. The three plan files were returned to `HEAD` and rewritten from my own measurements. The
one thing I kept from that run is the `src/zobrist.nfr.test.ts` comment edit — kept because I checked
it, not because I found it (see below).

**A note-count correction, since I am being asked to stand behind a record:** the queued subtask file
and that run's `claim.md` both say the `ref:` folder holds **seventeen** notes across four roles. It
holds **31**, across **five** roles. I read all 31 before gating.

## The result in this role's own vocabulary

`PASS_WITH_RISKS`: the gate returns **PASS**, with four accepted risks each carrying a named owner.
None is at `high`. Nothing was merged and nothing was deployed — a human holds both.

## Why PASS, stated so it can be argued with

The single question this pass exists to answer is whether the MEDIUM purity defect the owner declined
to merge is actually closed. **It is, and I closed it on my own instrument rather than accepting two
prior roles' word for it.**

- **All 13 known reproductions** — QE's three, the Engineer's fourth, the design hop's two pure-but-
  wrong pair, QE's four G19/G22 FENs, this file's own two NFR probes, and the valid-capture control —
  answer `false` and are **byte-pure** through `zobristKey`.
- **336,000 adversarial inputs of my own construction: 0 impure, 0 throws.** Six board shapes
  (plain / off-board junk / kingless / many-kings / all-pawns / dense) × 139 `epSquare` values
  including `NO_SQUARE`, every on- and off-board index, −2 / −16 / −256 / −999 / 128 / 256 / 999,
  `NaN`, `Infinity` and fractional, both sides to move.
- **The instrument is non-vacuous, and by the strongest control available.** Not a synthetic
  guard-stripped tree but **the real pre-guard tree `584defa` — the code the owner declined to
  merge**. On the identical population it reads **14,341 impurities** and is impure on **6 of the
  same 13** reproductions. 0 against 14,341 is the result; 0 on its own would have been worth nothing.
- **Single-guard controls confirm the design hop's disjointness reading rather than repeat it:**
  guard (a) deleted alone → still 0 impure (it buys the ANSWER); guard (b) deleted alone → impure on
  5 of the 13 (it buys PURITY).
- **And the closure is not only empirical.** Guard (b) establishes exactly the precondition
  `undoSpecial`'s unconditional write assumes and does not state. Guard (a) establishes the
  destination is empty **and** rejects every out-of-array target, because `board[oob]` on a
  `Uint8Array` is `undefined` and `undefined !== EMPTY`. Where both hold, the make/unmake round-trip
  is exact regardless of board legality.

**Confidence: HIGH, with its bound named.** This is 336,000 inputs plus a structural precondition
argument, not a theorem. A shape absent from my generator would escape it. That bound is accepted
risk 4 below, with an owner.

`NFR-005` — acceptance criterion 7 and the whole of what this column adjudicates — is **MET on both
halves**, re-measured independently. A FAIL here would send correct production code back to a column
where the only available change is to tests, and the tests are already right.

## The two things QE handed this column, and how I ruled on each

**1. Z1 and Z4 are CLOSED — QE's report is confirmed by running it.** Both are killed by
`src/zobrist.nfr.test.ts`'s spied zero-call assertion: one test, both mutants. I applied each to the
repository's own `src/` and watched the failure rather than reasoning about it. **This project can
stop carrying those two open items.**

**2. The two cost-shaped equivalent mutants are DELIBERATELY NOT PINNED, and I own the decline.**
Deleting `hasLegalEnPassant`'s own `NO_SQUARE` early return, and moving both guards inside the
`EP_CAPTURE_SIDES` loop. My reasons, in the order they carry weight:

- **Neither moves a stated bar.** `NFR-005`'s sub-bar is a call-count bar on the no-ep path. I
  measured that **no spied call count distinguishes either mutant — 0 of 9 call shapes**, at the
  predicate and through `zobristKey` (`makeMove`, `unmakeMove`, `isSquareAttackedBy` identical
  everywhere). The instrument `src/zobrist.nfr.test.ts` exists for **cannot be pointed at them**.
- **The early-return deletion costs structurally ZERO in production.** `zobristKey` is the **only**
  production caller of the predicate — I grepped for it rather than assuming — and its own
  `epSquare !== NO_SQUARE` guard short-circuits, so a no-ep node never enters the callee. The call
  shape on which that deletion costs anything does not occur in this codebase.
- **My instrument cannot resolve the rest.** It reads +0.9 to +2.9 ns on cells where the deletion's
  delta is *structurally zero*, so the +1.7 ns it reads on the shape that matters is not
  distinguishable from its own cross-tree floor. The loop-move reads ~0 on reachable shapes and about
  +3.1 ns on the invalid class, which has **0 of 518,474** reachable nodes.
- **The one instrument that could see them destroys what it measures.** A Proxy counting board reads
  **throws outright** on this code — `TypeError: this is not a typed array`, from `kingSquareOf`'s
  `board.indexOf` — so it does not run at all without a function-binding shim. Shimmed it costs
  **11.1–13.6x**, and its mere presence in the process inflates the *un-instrumented* readings by
  **2.0–3.0x**.

**Pinning a cost no instrument here can resolve would be pinning noise**, and this role's hard limit
is to find real risk and not gold-plate. This is the honest opposite of the `ABC-020` precedent, and
I weighed it rather than invoking it by reflex: that precedent pins **stated bars** that mutations
silently broke. These two mutations break no stated bar. **Accepted risk 2, owner Security/NFR at
`EPIC-004`**, when a search exists and a per-node budget makes 0.05% worth an assertion.

## The uncommitted edit to `src/zobrist.nfr.test.ts`: KEPT, checked, one sentence withdrawn

It arrived with no note explaining it. A half-finished edit to the file that pins this repo's NFR bars
is not something to carry silently, so I decided it rather than shipping it.

- **It is comment-only**, proved mechanically: both revisions stripped of comments are md5-identical.
  Zero assertion, import or fixture lines changed.
- **Its four-combination deletion table is CORRECT**, re-derived here on that file's own two probe
  FENs: early return gone with both guards present → `false`, board untouched; + guard (a) gone →
  `false`, untouched; + guard (b) gone → `false`, untouched; **+ both guards gone → the stray pawn
  returns on off-board square 15 and both cases fail.** The last row I proved by applying that mutant
  to the repository's own `src/` and watching the two assertions fail.
- **So the block is a genuine three-deletion regression guard and is kept, not dropped.** It is still
  the only thing in this repository that fails when the last of those three defences goes.
- **One sentence is withdrawn as unsupportable and corrected.** It quoted "about +1.6 ns" for the
  direct no-ep call. That does not survive its own null control, for the reason above. The corrected
  comment quotes **no** figure and states the structural fact instead — which is stronger.

## ASVS L1: judged, not re-run row by row, and that is a decision with a reason

The production delta since this column's own first pass is **four executable lines** in one pure
function (`src/legal.ts`: hoist `captured`, two board-read guards) plus a doc-comment-only edit to
`src/zobrist.ts`. I worked the 70-row L1 tier row by row on the first pass and the diff adds no
surface. **Re-running all 70 would pad this report and buy nothing; a gate that pads is a gate nobody
reads.** What the diff *can* move, I re-checked: no import added or widened, `package.json`/lockfile
diff empty with zero runtime dependencies, no `eval` / `vm` / `child_process` / `fs` / `http` /
`fetch` / `process.env` anywhere in `src/`, no secret-shaped string in the diff.

- **V2.1.1 / V2.2.1** — the row that genuinely connects — moves in the **good** direction: the
  library no longer corrupts a caller's position on a semantically-inconsistent FEN. The underlying
  FEN semantic-validation gap is unchanged and still **`ABC-010`'s**.
- **V1.4.1 stays NOT-APPLICABLE.** The two new reads can address out-of-array indices; on a
  `Uint8Array` that returns `undefined` and is not a memory-safety issue. It is an L2 row in any case.
- **V15.1.1 / V15.2.1's severity override to `low`** recorded at the first pass stands unchanged.
  Owner: Architect/Design at `EPIC-006`.
- **V13.4.1 stays DEFERRED, not passed.** Nothing is deployed or packaged until `EPIC-006`.

## Four accepted risks, each with a named owner

1. **Every timing figure on this ticket is one machine** (Apple M3 / Node v24.12.0 / darwin-arm64)
   and `UNKNOWN - verify` anywhere else. **Owner: `EPIC-004`'s non-M3 spike**, which already carries
   the identical obligation for `NFR-005`'s depth-7 PROVISIONAL marker.
2. **Two behaviour-equivalent cost mutants are unpinned, deliberately**, because no instrument this
   project has can resolve them. **Owner: Security/NFR at `EPIC-004`.**
3. **The amortized per-node figure is measured on a perft-table population, not a search's node
   distribution**, and stays `UNKNOWN - verify` until a search exists. I did not re-derive it — three
   runs agree and a fourth buys nothing this gate needs. **Owner: `EPIC-004`.**
4. **Purity closure is 336,000 inputs plus a structural argument, not a proof.** **Owner: QE/E2E**, at
   the next change to this predicate.

**The first pass's accepted risk "`zobristKey` permanently corrupts a semantically-inconsistent ep
position" is GONE from this list rather than reworded.** It is the MEDIUM, and it is closed.

Still carried, not fixed, and named so nobody thinks this gate absorbed them: **`ABC-009` and
`ABC-010`**; and **`generateMoves` offering an en-passant capture onto the mover's own piece**, which
is still owned by nobody until BA/PM acts — now three gates in a row saying so.

## Board move I own

`plans/board.md`: **ABC-011 `In Security/NFR` → `Ready for UAT`.** In Security/NFR 1/2 → 0/2, Ready
for UAT 0/4 → 1/4. **No limit approached, no override taken, no written reason owed.** The ticket's
front matter was moved to `ready-for-uat` / `Ready for UAT` in the same step — it had been left
disagreeing with the board by the interrupted run.

UAT is recorded as **DEFERRED to `EPIC-006`, not passed** — no runnable game exists, so there is no
surface a human can exercise and marking one passed would be a fabrication. `ADR-0005` is still
`proposed`; **no agent may mark it `accepted` and this gate did not.** **No PR — this repo has no git
remote. Nothing was merged and nothing was deployed.**
