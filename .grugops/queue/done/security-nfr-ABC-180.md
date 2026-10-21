---
subtask: security-nfr-ABC-180
role: security-nfr
ticket: plans/tickets/ABC-180-a-decoy-book-in-a7s-neutral-cwd-reds-a-cwd-first-read-with-a-module-fallback.md
ref: .grugops/context/qe-ABC-180/
branch: grugops/qe-ABC-180 @ c0a7225f (over SE acb52edf/d9c3cca3; base ccccc6bb); QE worktree ../wt-qe-ABC-180 (read only)
width: 3 (beside qe-ABC-163 and arch-ABC-163-adr)
---

# Security/NFR: AR-162-FALLBACK close, and QE-180 G-1/G-2

QE (`…f88e0845`) found AR-162-FALLBACK's written close condition met: P6f is green at base and red at head, at the labelled stderr check. But QE found a new surviving build:
- **G-1 (low):** P6g reads the cwd book only when it parses as JSON, and otherwise falls back silently. It is green at both base and head.
  - QE tried a fix in scratch: a valid-book decoy whose only reply to 1. e4 is `b7b5`, the one legal reply the delivered book lacks. It kills P6b, P6f and P6g at `:523`.
  - The cost: the fixed stderr message and the PD guard are lost.
- **G-2 (low):** nothing pins the decoy write before the child spawns.
- **G-3 (info):** an override at a different path survives.

The plant evidence is in `…91bdbc2a`.

## Decide
1. **AR-162-FALLBACK.** Close it as written. Or close it and carry P6g/G-2 as a narrower named residual, with an owner, a trigger and a close condition. Or keep it open. The Orchestrator owns AR-162-FALLBACK and follows your ruling. Promotion-trigger reading on record: `…6d15cdc3`.
2. **G-1 and G-2.** Accept each as a risk, or recommend a BA/PM cut naming the fix shape. Weigh QE's valid-book decoy against what it gives up.
3. **Security surface.** Confirm the change is test-only (`src/cli.real-engine.test.ts`) and that the decoy write raises no new temp-file concern.

## Fences
- Records only, plus the risk record wherever AR-162-FALLBACK lives (the ABC-095/ABC-162 pages, your earlier `…06c147db`).
- No `src/`, `AGENTS.md`, board or worktree edits. No timing. Never push or merge.

## Publish
- Seal notes with the plugin writer (task `security-nfr-ABC-180`).
- Write `.grugops/queue/done/security-nfr-ABC-180.md` (brief + `## Result`: verdict, rulings, trace row) and `.claim.md`, uncommitted on main.

## Result (security-nfr, 2026-10-21 09:26Z): **PASS_WITH_RISKS**. Records only, uncommitted on `main`

- **Notes** (task `security-nfr-ABC-180`). Both were sealed by `context-io.js` `admitAndAppend` (grugops 2.1.0 plugin cache) and read back by `readContext`:
  - `20261021T092500Z-security-nfr-observation-d9d72d63`: readings;
  - `20261021T092600Z-security-nfr-decision-1b032e3f`: the rulings.
- **Risk record:** a dated addendum at the end of the `ABC-095` page's `## Security/NFR` section, where `AR-162-FALLBACK` was recorded.
- **Untouched:** no `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or worktree edits. No test lane was run, no timing was taken, nothing was pushed or merged.

### 1. `AR-162-FALLBACK`: **CLOSED as written**
- **The condition is met** (`…06c147db` § 1). QE read P6f base 11/11 green → head 10/11, with the only red `A7` at the labelled stderr check `:534`. P6b, P6c and P6e still red at head (`…91bdbc2a`).
- **Why it is not held open on P6g:** that would move the goalposts. No fixed decoy can close the validate-then-fallback family, so a risk held open on it could never close.
- **Trigger reading:** I concur with the Orchestrator's `…6d15cdc3`. `ABC-168`'s pull fires the trigger; `ABC-161`'s does not.
- **The Orchestrator records the close.**

### 2. New residual **`AR-180-VALIDATED`** (LOW; owner the Orchestrator). It holds G-1 and G-2
- **What it is:**
  - **(G-1)** P6g passes, at any validation depth: a cwd read used only when the file validates, with a silent module-URL fallback;
  - **(G-2)** the decoy-before-spawn order is unpinned, so TMO survives.
- **Severity:** LOW at the tip, because `V5.3.2` [L1] is met. P6g landing would FAIL `V5.3.2` [L1], which is HIGH and blocks.
- **Compensating controls:**
  - Ruling 2 routes every `src/book-file.ts` edit here;
  - clause (b) limb 1 fires on any new `from "node:` import;
  - S3 item 2 reads the holder by hand;
  - `A7` kills P6b, P6c, P6e and P6f.
- **Promotion trigger:** a `src/book-file.ts` edit, or a packaging, `bin` or launch-path ticket (`ABC-168` included). When it fires, two things are owed before that ticket merges:
  - **(a)** `ABC-163` merged, or Ruling 2 applied by hand, plus an explicit gate read for a cwd or validate-then-fallback book read on every production read reachable from the new launch path;
  - **(b)** the G-2 pin, as an XS test-only rider.
- **Closes when:**
  - **(i)** `AR-095-L1UNIT` closes: `ABC-163` merges, and QE reads its `A1` (P2b, P2c) and `A2` FIRE;
  - **and (ii)** the G-2 pin lands, with QE reading TMO red at head with P6f planted.
- **After the close, P6g is still seen by no test.** That is accepted as the designed control for the family: holder routing plus the gate's hand read.

### 3. Dispositions
- **G-1: ACCEPTED** (inside `AR-180-VALIDATED`). **No BA/PM cut for QE's valid-book decoy (VD).**
  - VD gives up the labelled stderr signal that the close rests on, and the PD guard.
  - It ties the kill to the delivered book's contents (`b7b5` must stay absent).
  - An override that validates one level deeper still skips it.
  - It is the non-stderr discriminator I ruled gold-plating at L1.
- **G-2: ACCEPTED** (inside `AR-180-VALIDATED`). No standalone cut now. The fix is owed on the promotion trigger, or by the first ticket that edits `A7`'s `beforeAll` or its `it`.
  - **Fix shape:** on the line directly before the `booked` spawn, capture `existsSync(join(neutral, BOOK_PATH))`. Assert it `true` in `A7`, with a message naming `AR-162-FALLBACK`. Add a comment saying the write must precede the spawn. That is 0 spawns and 0 tests.
- **G-3: INFO, no action.** Ruling 2 routes it.

### 4. Security surface
- **Test-only.**
  - The diff `ccccc6bb..d9c3cca3` touches `src/cli.real-engine.test.ts` plus SE notes, and nothing else.
  - The waiver form is empty.
  - `src/book-file.ts` is unchanged, and Ruling 2 does not fire.
  - Nothing on `main` since `ccccc6bb` touches the test file, `src/book-file.ts` or `data/`.
- **The decoy write raises no new temp-file concern at L1.** I measured this in scratch with a private `TMPDIR`:
  - `neutral` is 0700, assigned before the write;
  - the bytes are a fixed 35-byte literal;
  - the exact-path recursive `rmSync` removes the whole tree and does not follow a planted symlink;
  - cleanup still runs if the write throws.

  This agrees with QE `A3`: 0 leftovers.
- **`NFR-008`:** 0 / 0 / 0; `CLI_DEEP` 11 tests and 6 children, both equal to base. **Logging:** unchanged.

### Accepted risks after this gate
- `AR-180-VALIDATED` (LOW, the Orchestrator; new);
- `AR-095-READ` (LOW, Security/NFR);
- `AR-095-L1UNIT` (LOW, the Orchestrator; closing via `ABC-163`).

**Required fixes before merge:** none.

### Board
`ABC-180` leaves `In Security/NFR` with PASS_WITH_RISKS. UAT is waived: 0 production lines, as QE measured. The Orchestrator makes the move, records the `AR-162-FALLBACK` close, and opens `AR-180-VALIDATED`.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)
| ABC-180 (Security/NFR) | test-only (1 file, 0 prod lines; Ruling 2 silent); decoy written inside mkdtemp 0700, exact-path rmSync, no symlink follow (measured): no L1 temp concern; security-nfr-ABC-180 …1b032e3f / …d9d72d63 | AR-162-FALLBACK CLOSED (P6f base green → head red at labelled stderr :534; P6b/c/e hold) → AR-180-VALIDATED (LOW, owner Orchestrator: G-1 P6g validate-then-fallback, G-2 decoy order; closes on AR-095-L1UNIT close + G-2 pin with TMO red) | grugops/ABC-180 @ acb52edf (notes d9c3cca3); QE grugops/qe-ABC-180 @ c0a7225f | src/cli.real-engine.test.ts | NFR-008 0/0/0; CLI_DEEP 11 & 6 children = base; no timing | Security/NFR PASS_WITH_RISKS: no required fixes; G-1 and G-2 accepted, no BA/PM cut now (VD rejected: loses stderr signal + PD guard, book-coupled, beaten one level deeper) |
