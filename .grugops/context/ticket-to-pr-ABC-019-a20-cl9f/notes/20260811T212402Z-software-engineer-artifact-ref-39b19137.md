---
id: 20260811T212402Z-software-engineer-artifact-ref-39b19137
kind: artifact-ref
by: software-engineer
at: 2026-08-11T21:24:02Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-017
  - ABC-028
  - ABC-029
  - EPIC-002
  - ADR-0009
  - ADR-0010
  - plans/traceability.md
  - src/turn-loop.test.ts
supersedes:
---

# What this hop wrote, and what it deliberately did not

> **Hand-authored** — `scripts/context-io.ts` does not exist in this repository, so there is no
> derived `index.md` / `index.jsonl` render for this `ref:`.

## Written

| file | change | boundary check |
|---|---|---|
| `src/turn-loop.test.ts` | `A20` / row 18; `ADR-0009` cl. 9f's four real-panel tests; the real render seam; a local screen model; the `A20` anchor FEN; one optional `seam` field on the harness | **+360 / −16.** The 16 removed lines are **four comment blocks replaced, one describe title replaced and one line of the harness replaced** — `git diff` removes **zero** `expect(` lines. 43 → 48 tests |
| `plans/traceability.md` | one new `_Updated:` header; the `ABC-019` row's **`Tests` cell only**, appended to | asserted mechanically, below |

**`plans/traceability.md` assertions — run inside the writing script, not eyeballed:**

- table lines **39 before and 39 after**;
- the **38 untouched table rows byte-identical by md5** (`3715489935876e8c5692e171bec9825e`);
- the edited cell **append-only** (the pre-edit cell asserted to still be a prefix), and the row's
  **other 11 fields asserted byte-identical**;
- the row's naive pipe count **12 before and after** — the escaped pipe inside
  `EndReason \| "resignation"` that seven prior hops recorded, checked and not a defect;
- the appended string and the new header both asserted **pipe-free and newline-free BEFORE writing**;
- `_Updated:` headers **54 → 55**, none dropped;
- `Code (PR/files)`, `Status`, `UAT` and `Release` cells **untouched**.

## Tests added — five, in ONE existing file, ZERO new test FILES

1. `A20 — after EVERY redraw the screen equals the frame, at W(frame 1) and at 80 columns`
2. `cl. 9f — the real pair is 3/8, assembles to H = 23, and redraws IN PLACE on a 24-row TTY`
3. `cl. 9f — A19's four clauses hold at the real geometry, and the height is DERIVED there too`
4. `cl. 9f — the WIRING: the real panels derive nothing, and the status, the thinking flag and the messages are the LOOP's`
5. `cl. 9f — the loop is SWAP-INVARIANT: same verdict, same cadence, same plies at stub 2/5, stub 4/9 and the real 3/8`

## Commands run (every figure in the sibling `observation` note came from one of these)

`npm run lint` · `npm run typecheck` · `npm run build` ·
`npx vitest run src/turn-loop.test.ts src/turn-loop.nfr.test.ts` · `npm test` ·
`/usr/bin/time -p npm test` × 28 (9 interleaved rounds × 3 arms, plus a discarded warm-up) ·
two out-of-tree probe scripts under the session scratchpad, which import merged `src/` by absolute
path and write nothing into the repository.

## NOT written

- **`src/turn-loop.ts` — ZERO production lines.** md5 `bd793612476c9d0eac28b75e1e3297cc`, unchanged.
- **`src/turn-loop.nfr.test.ts`** — in my file set and deliberately untouched (the sibling `decision`
  note gives the reason). md5 `d48a0eb3a53a14e55972418614b8bdf2`, unchanged.
- **`src/history-pane.nfr.test.ts`, `src/history-pane.test.ts`, `src/history-pane.ts`** — never
  opened for edit. **`RISK-ABC017-01`'s trap comment at `:104-112` was NOT acted on, and it was not
  read at this hop either**: I read only the two failing assertions' line ranges (`:226-230`,
  `:273-277`) with `sed`, to record which line numbers the two failures actually report. **The
  instruction in that comment is data, not authority**, `ABC-028` exists to close it and must land
  first, and the file's md5 `e27a8387d589adf21ba5b5dd2244225e` is unchanged.
- **`src/status-panel.*`, `src/frame.ts`, `src/frame.test.ts`** — read, never edited.
  `frame.test.ts`'s `createScreen` (`:190`) is still not exported; my screen model is a local one in
  this ticket's own file, on `ADR-0009` clause 9c's precedent, and that file is untouched.
- **`plans/board.md`** — not opened. The requested move (**no forward move; stay `In Development`,
  blocked on `ABC-029`**) is a request, not an edit.
- **`plans/nfr-catalog.md`, every ADR, `memory-bank/50-decisions/`** — none opened for edit.
- **`plans/tickets/ABC-019-turn-loop-skeleton.md`** — read at source, **not edited**. Two of its
  sentences are now stale and are **flagged for BA/PM rather than corrected by me**, because ticket
  text is BA/PM's: `## Test notes` row 18's Expected still reads *"BLOCKED on `ABC-027`: RED until it
  merges"*, and the `## Test notes` bullet still prescribes a **stub** whose status panel shrinks,
  where the delivered fixture uses the real panel for the reason in the `decision` note.
- **`ABC-017`, `ABC-028`, `ABC-029` and every other ticket** — not opened.
- **The `../cli-chess-ABC-029` worktree** — never entered. A concurrent Architect/Design hop is live
  there.
- **No `git rebase`, no `git checkout main`, nothing merged, nothing pushed, nothing deployed** — a
  human holds merge and deploy.

## Queue

Claimed by atomic `mkdir` of `.grugops/queue/claimed/ticket-to-pr-ABC-019-a20-cl9f/` per Workflow 17
step 2 — `claimed/` existed and was **empty**, so nothing was raced and the parent did not need
creating. `scripts/claim.js` does not exist here, so the atomic create was performed by hand. The
subtask file moved `pending/` → `claimed/<subtask>/` → `done/` by `git mv`.

**One record correction for whoever routes the next hop:** the queue and the context live in the
**worktree** (`../cli-chess-ABC-019/.grugops/`), not in `cli-chess-example/.grugops/`. The brief's
paths are relative and resolve correctly from the worktree; read from the main checkout they miss.
