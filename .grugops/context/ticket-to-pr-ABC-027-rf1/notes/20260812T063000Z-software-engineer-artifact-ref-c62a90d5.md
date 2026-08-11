---
id: 20260812T063000Z-software-engineer-artifact-ref-c62a90d5
kind: artifact-ref
by: software-engineer
at: 2026-08-12T06:30:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-027-rf1
  - abc027-rf1-2026-08-12
  - refinement-ABC-027-a1
  - security-nfr-ABC-027
  - ABC-027
  - src/frame.ts
  - src/frame.test.ts
  - plans/traceability.md
  - 20260812T060000Z-software-engineer-observation-3f8c2a71
  - 20260812T061500Z-software-engineer-decision-9d4b1e08
supersedes:
---

# What this hop read, ran and wrote — and the exhaustive list of what it did NOT write

> **Hand-authored** — `scripts/context-io.ts` absent from this repository (no `scripts/` directory)
> and from the kit at `/Users/olgeroeselg/.grugops/agent-factory/`; `mcp__grugops__propose_note` not
> in this session's tools. **No `finding` in this task's notes.** Pointer note; the substance is in
> the `observation` (measurements) and the `decision` (dispositions).

## Claim

`.grugops/queue/claimed/ticket-to-pr-ABC-027-rf1/` — created by an atomic `mkdir` per Workflow 17,
which **won** (the `claimed/` parent already existed; QE's and BA/PM's claims are beside it).
`scripts/claim.js` does not exist here, so the now-running registry record `claim.md`
(`task` / `by` / `at`) was written by hand and `pending/ticket-to-pr-ABC-027-rf1.md` was moved into
it by `mv` — the atomic rename the workflow specifies.

## Read, in the order the brief set

1. `.grugops/queue/pending/ticket-to-pr-ABC-027-rf1.md` — the brief
2. `.grugops/context/abc027-rf1-2026-08-12/notes/` — the Orchestrator's **`failed-attempt`**: its own
   prescribed three-number repair would have WEAKENED `A1`
3. `.grugops/context/refinement-ABC-027-a1/notes/` — BA/PM's three
4. `.grugops/context/security-nfr-ABC-027/notes/` — the gate's five, including the real-terminal
   measurement and the primitive with its two controls
5. `plans/tickets/ABC-027-frame-writer-clears-each-row.md` — the amended ticket, in full; exact
   wording taken from it
6. `agent-factory/roles/software-engineer.md`, `agent-factory/workflows/16-context-read-write.md`,
   `agent-factory/workflows/17-task-claim.md`, `AGENTS.md` (kit, read-only)
7. `src/frame.ts` (full) and `src/frame.test.ts` (the helpers `:1-165`, the screen model `:167-262`,
   the assertion sites `:369-438`, `A6` at `:752-791`, the `ABC-027` block `:809-999`)
8. `git diff main...HEAD -- src/frame.ts`, to establish what the cut hop had already discharged —
   **this is what turned up the `:27-29` correction**

## Ran — every number in these notes came from one of these

| what | how |
|---|---|
| baseline | `npm test` in the worktree → **716/716 on 24 files**; skip 0 via `--reporter=json` + `jq`; file count by `ls src/*.test.ts \| wc -l` |
| rebase verified | `git merge-base --is-ancestor main HEAD` (true) and `git log main --grep=ABC-016` |
| the four emissions counted | `<scratchpad>/rf1/matrix.mjs` — dynamic-imports the modules under Node 24 type stripping, takes the `RF-1` emission from the **real** `beginFrameSession`, constructs delivered / `M2` / merged from the SAME frame, and evaluates each of `A1`'s **seven** assertions independently → a pass/fail matrix rather than a red/green verdict |
| `A1` witnessed per writer | `<scratchpad>/rf1/witness.mjs` — four writers substituted at the same unique anchor (uniqueness asserted before any write), each `npx vitest run src/frame.test.ts -t "A1 "` |
| **the clause isolated** | `<scratchpad>/rf1/isolate.mjs` (`toBe` removed) and `<scratchpad>/rf1/clause-only.mjs` (`toBe` **and** all four counts removed, then each half of the clause alone) — edits scoped to the `A1` block only, because two assertion lines appear verbatim in the `ABC-018` test above |
| the model repair + `A7` | `<scratchpad>/rf1/model.mjs` — repair reverted with `RF-1` in place, and repair kept with the delivered writer restored, full suite each time |
| the h-file failure text | delivered writer restored, `-t "uses IN PLACE at the"` |
| gates | `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, all in the worktree on the shipped tree |

**The harness tree is `<scratchpad>/rf1`**, a copy of this worktree's `src/` with `package.json`,
`tsconfig.json` and `biome.json` copied and `node_modules` symlinked, verified byte-identical by
`/usr/bin/diff -r` **before** use and **again after every substitution run** — exit 0 both times.
Every script restores what it edited and asserts the restore; each printed `restored: true`.
Scratchpad root:
`/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/83d698c3-dcd1-4fea-848e-c8c0d7d9cbe9/scratchpad`.
**The harness files are not durable**; what is durable is the construction above, which is what a
re-run needs.

Machine: **Apple M3 (Mac15,13) / Darwin 25.5.0 arm64 / Node v24.12.0 / vitest 3.2.7 / biome 2.5.5** —
`UNKNOWN - verify` on other hardware, though nothing here is a timing.

## Written — inside the repository, exhaustively

- **`src/frame.ts`** (+20/−8 against this hop's start): the in-place writer expression; the
  `ERASE_TO_END_OF_LINE` doc comment at `:66-73` (both false sentences rewritten, the column-0
  placement and the gate's measurement recorded, the `H`-th erase's redundancy recorded as a kept
  decision); and one clause added to the header block at `:27-32` — **which was NOT false, see the
  `decision` note.**
- **`src/frame.test.ts`**: the screen model's `eraseFrom()` derived column taken by **both** erase
  helpers; the model's assumption block marked to say which one statement is measured and that the
  other three are not promoted by association; assertion sites `:389`, `:391` (masked) and `:436`
  with their comments; `A1`'s five assertions re-derived **plus the two column-0 assertions**; and
  **`A7` added**. **No test file added — 24 before, 24 after.**
- **`plans/traceability.md`**: the `+66` / `(H − 1) × 3` / 425 → 491 figure re-derived to
  `+69` / `H × 3` / 425 → **494**; the Code cell's superseded expression marked as the record of what
  was delivered rather than a description of the build; the Tests cell's count 32 → 33; and the
  `RF-1` hop's status paragraph. **The gates' historical measurements were left exactly as measured
  and marked as taken on the `+66` shape.**
- These three notes and the queue records under `.grugops/queue/claimed/ticket-to-pr-ABC-027-rf1/`.

**No commit hash appears in `plans/traceability.md` for this hop, deliberately: the row is inside the
commit that would name it, and a hash written before that commit exists is a fabricated trace.** The
branch is `grugops/ABC-027-frame-clearing`.

## NOT written, exhaustively

- **`plans/board.md`** — the Orchestrator's. **`In Development` → `In Review` is REQUESTED** in the
  `decision` note, not written.
- **`plans/tickets/ABC-027-frame-writer-clears-each-row.md`** — not edited. The criteria are BA/PM's;
  this hop builds against them. The `:27-29` correction is **reported**, not applied to the ticket.
- **`plans/nfr-catalog.md`** — not touched, no bar created, moved, loosened or re-derived, and none
  is owed. No wall-clock assertion exists or was added.
- **`src/status-panel.ts`, `src/status-panel.test.ts`, `src/status-panel.nfr.test.ts`, any
  history-pane module, any turn-loop module** — **NOT touched**, verified by
  `git status --porcelain` over those paths returning 0 lines. Agents are live on `ABC-017` and on an
  ADR hop; **no channel was opened and nothing was relayed.**
- **Every other file under `src/`** — untouched. `git status --porcelain` for this hop is exactly
  four entries: `src/frame.ts`, `src/frame.test.ts`, `plans/traceability.md`, and the queue records.
- **`memory-bank/50-decisions/`** — `ADR-0009` and `ADR-0010` NOT re-opened, NOT edited, NOT
  re-litigated.
- **`ABC-016`, `ABC-017`, `ABC-019` tickets and branches** — not edited, not read for content, no
  channel opened.
- **No criterion relaxed, weakened, deleted or renumbered.** `A1` kept all four counts and the
  byte-exact text and gained two assertions; `A2`–`A6` are untouched and green.
- **No constant-frame-width criterion**, and `A7` was checked against the prohibition explicitly.
- **No `finding`, no verification stamp, no §14 gate verdict record.** That machinery does not exist
  in this repository and self-attesting one would be the fabrication Workflow 16 forbids.
- **Nothing merged, nothing pushed, nothing deployed. `main` was never checked out.**

## Gate results, exactly as they ran

**`717/717 on 24 test files`, skip 0** · lint **exit 0** (43 files, 0 errors, 2 pre-existing
`biome.json` deprecation infos) · typecheck **exit 0** · build **exit 0** · **zero test files added,
counted**. One lint error was mine (a three-line `toContain` the formatter wanted on one line),
caught by the gate, fixed, re-run clean — recorded rather than smoothed.
