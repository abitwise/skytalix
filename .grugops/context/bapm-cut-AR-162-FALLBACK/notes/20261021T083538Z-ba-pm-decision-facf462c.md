---
id: 20261021T083538Z-ba-pm-decision-facf462c
kind: decision
by: ba-pm
at: 2026-10-21T08:35:38Z
verified_by: 
confidence: high (base readings at main e68962d6; QE and Security/NFR measurements cited, not re-taken); trigger reading (a) UNKNOWN - verify
refs:
  - ABC-180
  - ABC-162
  - ABC-095
  - ABC-168
  - ABC-161
  - ABC-172
  - AR-162-FALLBACK
  - AR-095-CWD
  - G-1
  - G-2
  - V5.3.2
  - ADR-0036
  - EPIC-005
  - EPIC-006
  - NFR-008
  - e68962d6
  - 3d05e230
  - f459353e
  - src/cli.real-engine.test.ts
  - src/book-file.ts
  - src/book.ts
  - plans/tickets/ABC-180-a-decoy-book-in-a7s-neutral-cwd-reds-a-cwd-first-read-with-a-module-fallback.md
  - plans/tickets/ABC-162-the-real-engine-book-child-runs-from-the-tree-root-so-a-cwd-relative-book-read-passes.md
  - 20261021T082900Z-security-nfr-decision-06c147db
  - 20261021T082800Z-security-nfr-observation-3ea2c883
  - 20261021T082210Z-qe-e2e-observation-567002e7
  - 20261021T082240Z-qe-e2e-decision-68554c31
supersedes: 
seal: sha256:7ccd4d5fb9391cb5ad251e49476879dc097950e8b4fd906fb8d2e6cbd186f63c
---

# BA/PM cut for `AR-162-FALLBACK` (G-1 and G-2): `ABC-180`, XS, P3, EPIC-005, DoR 10/10, Ready. Read at `main` `e68962d6`

This cut follows Security/NFR's recommendation in `…06c147db` § 2 as ruled. It rests on QE `…567002e7` (plant matrix and decoy probe) and `…68554c31` (verdict), and on Security/NFR `…3ea2c883`. None of those measurements were re-taken. `src/cli.real-engine.test.ts` and `src/book-file.ts` at `e68962d6` are byte-identical to `3d05e230` (`git diff --quiet` rc 0), so they apply to this base unchanged.

## Ticket
`plans/tickets/ABC-180-a-decoy-book-in-a7s-neutral-cwd-reds-a-cwd-first-read-with-a-module-fallback.md`. Test-only, in one file: `src/cli.real-engine.test.ts`.
- **G-1.** In `A7`'s existing `beforeAll`, write bytes that are not UTF-8 JSON at `join(neutral, BOOK_PATH)`, before the spawn. The existing exact-path `removeCopy(neutral)` takes the file with the directory. There are 0 new spawns, tests, `mkdtemp` calls and removal calls.
- **The no-`data/` assertion is swapped.** The new assertions say the decoy is present, differs from the delivered bytes, and does not parse as JSON.
- **G-2.** `expect(booked.stderr, …)` gets a message, and a `//` line directly above it. Both name the `AR-095-CWD` / `AR-162-FALLBACK` detector.
- **Comments.** Three comments that call `neutral` empty or `data/`-less are reworded: `:47-50`, `:443` and `:476-477`.

## Why the decoy must not be a book (stated on the page)
- **Non-JSON bytes red every cwd read form through one fixed signal.** The probe refuses them with `opening book is not valid UTF-8 JSON; …` (`src/book.ts:91-95`), and `A7`'s stderr check catches that.
- **A valid book would read silently.**
  - A copy of the delivered book makes every cwd plant pass.
  - A different book leaves only book membership, which G-2 shows does not discriminate.
- **"Not UTF-8 JSON" is pinned, rather than any non-book**, so that `A2`'s red carries the one message QE measured.
- **Plant PD guards it.** PD swaps the decoy for a copy of the book, and `A1` requires that to red at the does-not-parse assertion.

## Criteria
- **`A1`:** the decoy is present, is not the delivered book, and is not JSON. 11/11 green, and `A7`'s stderr is 0 B with exit 0. PD reds.
- **`A2`:** P6f is green on the base test and red on the head test, at `A7`'s stderr check. P6b, P6c and P6e red on both. The P6f failure output contains `AR-162-FALLBACK`.
- **`A3`:** 0 entries left under `tmpdir()`.
- **`A4`:** `grep -c AR-162-FALLBACK` ≥ 2 (0 at base), placed at the message and the comment.
- **`A5`:** `grep -nE 'no .?data/|holds no|fresh, empty'` exits 1. At base it prints `:48`, `:443` and `:476`.
- **`A6`:** one file; UAT-waiver form empty; counts equal base (CLI_DEEP 11, children 6); `grep -cF` equal for `mkdtempSync(` 2, `removeCopy(` 3, `rmSync(` 1, `spawnReal(` 5.

## Close condition, priority and trigger
- **Close condition.** `AR-162-FALLBACK` closes when QE reads `A2`'s P6f row red at head with the plant, and the P6b, P6c and P6e kills hold. The Orchestrator records it.
- **Priority: `P3`.** It is a missing detective control, not a failing one. `V5.3.2` is met at the tip, and Ruling 2 plus S3 item 2 cover it by hand.
- **Promotion trigger, as Security/NFR ruled.** A ticket that edits `src/book-file.ts`, or `EPIC-006` (packaging/`bin`) being cut or pulled. Either makes `ABC-180` due before that ticket merges, at `P2`.

## Routed to the Orchestrator (owner of `AR-162-FALLBACK`); not a change to the ruling
- **(a) `EPIC-006` is already cut.** Its one open board ticket, `ABC-161`, is three `cli.test.ts` difficulty rows. BA/PM reads the clause as a packaging/`bin` ticket being cut or pulled, so `ABC-161` does not fire it. `UNKNOWN - verify` with Security/NFR.
- **(b) `ABC-168` (EPIC-007) fires neither clause as written.** It imports `book-file.ts` and does not edit it. It does add a `bin` and a process a GUI launches from a cwd the player does not choose. BA/PM recommends treating its pull as firing the trigger.
- **Pointer drift (prose only).** `ABC-168` and `ABC-172` cite `src/cli.real-engine.test.ts:84`, and that line is already the `START_FEN` doc comment. No test reads those pointers.

## Records
- **Written:** the ticket page; `plans/board.md` (one `_Updated:` line, the Ready row, header 3/8 → 4/8).
- **Not written:** `src/`, `AGENTS.md`, `plans/traceability.md` (the trace row is in the done record).
- Next free id: `ABC-181`.
