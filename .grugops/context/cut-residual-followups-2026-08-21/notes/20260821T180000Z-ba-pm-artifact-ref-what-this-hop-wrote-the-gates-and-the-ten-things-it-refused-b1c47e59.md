---
id: 20260821T180000Z-ba-pm-artifact-ref-what-this-hop-wrote-the-gates-and-the-ten-things-it-refused-b1c47e59
kind: artifact-ref
by: ba-pm
at: 2026-08-21T18:00:00Z
verified_by:
confidence: high
refs:
  - ABC-116
  - ABC-117
  - ABC-115
  - ABC-114
  - ADR-0017
  - N8-SPAWN
  - NFR-008
supersedes:
---

# WHAT THIS HOP WROTE, WHAT IT VERIFIED BY HASHING, AND THE TEN THINGS IT REFUSED

## Written — five paths, none of them under `src/`

- `plans/tickets/ABC-116-record-the-t2-re-measure-trigger-where-a-hop-will-meet-it.md` — **new, 283
  lines**, `XS`/`P2`, DoR 9/10 ⚠️x1, six criteria.
- `plans/tickets/ABC-117-that-exit-one-is-an-unhandled-exception-not-the-usage-code.md` — **new, 313
  lines**, `XS`/`P3`, DoR 9/10 ⚠️x1, seven criteria.
- `plans/board.md` — **one header paragraph and two `Backlog` rows APPENDED.** No column moved, no
  count changed, no WIP limit touched, no existing line edited.
- `plans/traceability.md` — **one header paragraph and two rows APPENDED**, nothing touched in place.
  Both rows re-split from disk after the write on **unescaped** pipes only: **12 pipe-fields, two
  empty edges, 10 cells** each.
- `.grugops/context/cut-residual-followups-2026-08-21/notes/` — this note plus one `observation` and
  one `decision`.

**Median ticket length 298 lines, against `AGENTS.md` `## Process rules` 2's ≤ 300 budget.** Reported
because that rule has a control attached, not because it is comfortable — 313 is the closer call.

## Untouched, and VERIFIED rather than asserted

- **`plans/nfr-catalog.md` NOT OPENED FOR WRITING.** The eight rows `NFR-001`–`NFR-008` hashed
  **before and after** this hop:
  `63f667958eeabcaa884d45b18b513c7bbe9855266c4959dfd16f87b0802eca31`, **8 matched lines, unchanged.**
  **Hashed, not promised**, exactly as the fence demands. **No target, bar, level, floor, account,
  instrument, statistic, null control or `UNKNOWN - verify` marker moved anywhere in that file.**
- **`AGENTS.md` NOT OPENED FOR WRITING** — `ABC-109` is live against it under a byte cap.
  `ADR-0017`'s owed one-sentence edit there is **not duplicated**, and `ABC-116` disclaims the
  overlap on its own page: that sentence is about the `## Test` lane inventory, and `ABC-116` writes
  no lane.
- **`src/` is BYTE-IDENTICAL.** `git diff --numstat main...HEAD -- src/` **empty**;
  `git status --porcelain -- src/` **empty**. **Zero files, zero production lines, zero test lines.**
- **`memory-bank/`, `ADR-0016`, `ADR-0017`, every other ticket page and every existing context note:
  zero bytes.**
- **`ABC-115` NOT moved, NOT signed, NOT mentioned as accepted.** It stays `Ready for UAT`,
  **unsigned**. **No board column moved and no ticket was pulled** — those are the Orchestrator's.

## Gates at the branch tip (`grugops/cut-residual-followups`, off `main` @ `fcf12c1`)

| gate | command | result |
| --- | --- | --- |
| lint | `npm run lint` | exit 0 — `Checked 73 files in 90ms. No fixes applied.` |
| typecheck | `npm run typecheck` | exit 0 — `tsc --noEmit`, no output |
| build | `npm run build` | exit 0 — `tsc --noEmit`, no output |
| unit | `npx vitest run --dir src` | exit 0 — **40 files / 1213 passed / skip 0**, 3.90 s |

Skip count **0** via the recorded capture; `node tools/grugops/test-skip-integrity.js
.grugops/test-skips.md --skip-count 0` → `No findings.`, exit 0. **Identical to the `fcf12c1`
baseline — this hop changed no code, and the run is recorded to show that rather than to claim
credit for it.** `.grugops/test-skips.md` was **read and never written**; it is human-owned.

## The one edit owed elsewhere, and it is NOT MADE

**A one-line forward pointer in `plans/nfr-catalog.md`** from the `N8-SPAWN` account block (≈ line
1147) to the `T1`/`T2` subsection (≈ line 1508), so a checker reading the account meets the triggers.
**Owner: Architect/Design**, who owns that row, owns the account, and whose `G-QE115-3` section
reserves restatement in that file to that role. It moves no bar — and the pen is still not BA/PM's.

## The third thing — NAMED AND LEFT UNCUT

**`ABC-114`'s pre-registered `P1` promotion trigger — *"a fifth false sentence found in the same two
files"* — appears to have fired**, since `ABC-117`'s S8 is a false sentence in `src/cli.test.ts`,
one of that ticket's two files. **Whether to re-score `ABC-114` from `P2` is named here and NOT
taken.** Stated with its doubt: `ABC-114`'s sites mis-price **guards**; S8 mis-states a
**mechanism** — same genus, arguably a different species. **The Orchestrator's to route.**

## Refused, and why

1. **Refused to cut a third ticket.** The brief says exactly two and the owner authorised two. The
   third thing is named above and left.
2. **Refused to re-score `ABC-114`**, even though I believe its own trigger fired — that is a third
   page and a decision outside this hop's fence.
3. **Refused to make the `plans/nfr-catalog.md` pointer edit** I argued is owed. Named with its
   owner instead.
4. **Refused to do `ABC-117`'s work at this hop.** Correcting the seven sites now would put author,
   adjudicator and ticket-writer in one agent — the conflict `ABC-114` `A7` exists to preserve — and
   it would make the ticket a record of work already done.
5. **Refused to accept the proposed carrier for `T2`.** The kit gate checklist is read-only,
   machine-generated and about ASVS; a line written there breaks the kit fence and is regenerated
   away. **Refused on impossibility, not on preference**, and the measurement is in the observation
   note.
6. **Refused to design or cost any mechanism for `N8-SPAWN`'s time clauses.** `ADR-0017` decision 1
   rules them non-mechanical by design; `ABC-116` builds nothing and `## Out of scope` forbids it.
   **Re-arguing the gap is explicitly not how that ruling is overturned.**
7. **Refused to cut the product change `ABC-117` implies.** Named, sized `S`, shape-forced, and left
   to the Orchestrator — it re-opens an accepted residual and needs the owner's word.
8. **Refused to touch any CLAIM-A site.** On the argument-refusal path `1` genuinely IS
   `USAGE_EXIT_CODE`; correcting one of those five would re-open `ABC-115`. They are named on the
   ticket page so nobody "fixes" one.
9. **Refused to inherit a number.** Both of `ABC-117`'s load-bearing readings were re-run here
   against the delivered build and outside it, and the two zero counts that decide the mechanism are
   mine and are not in the upstream note. `ADR-0017`'s mutant figure is carried as **the ADR's**, and
   `ABC-116` `A2` requires the delivering hop to re-measure rather than copy it.
10. **Refused to emit any `finding` or any `§14-gate#` stamp.** `context.human_admission` is `off`
    and no sanctioned writer exists on this install; these are `observation` / `decision` /
    `artifact-ref`, **hand-authored**. **Nothing here is stamped and nothing here is a human's
    acceptance.**

Nothing merged, nothing deployed, nothing self-signed. Committed on
`grugops/cut-residual-followups`; `main` was never checked out for writing.
