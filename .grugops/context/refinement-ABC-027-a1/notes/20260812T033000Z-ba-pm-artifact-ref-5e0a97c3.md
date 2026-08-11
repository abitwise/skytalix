---
id: 20260812T033000Z-ba-pm-artifact-ref-5e0a97c3
kind: artifact-ref
by: ba-pm
at: 2026-08-12T03:30:00Z
verified_by:
confidence: high
refs:
  - refinement-ABC-027-a1
  - abc027-fail-2026-08-12
  - security-nfr-ABC-027
  - quality-gate-ABC-027-qe
  - ABC-027
  - ADR-0010
  - plans/tickets/ABC-027-frame-writer-clears-each-row.md
  - src/frame.ts
  - src/frame.test.ts
  - 20260812T030000Z-ba-pm-observation-d41f7a92
  - 20260812T031500Z-ba-pm-decision-8c62e0b4
supersedes:
---

# What this hop read, ran and wrote — and the exhaustive list of what it did NOT write

> **Hand-authored** — `scripts/context-io.ts` absent from this repository (no `scripts/` directory)
> and from the kit at `/Users/olgeroeselg/.grugops/agent-factory/`; `mcp__grugops__propose_note` not in
> this session's tools. **No `finding` in this task's notes.** Pointer note; the substance is in the
> `observation` (measurements) and the `decision` (dispositions).

## Claim

`.grugops/queue/claimed/refinement-ABC-027-a1/` — created by an atomic `mkdir` per Workflow 17. The
`claimed/` parent already existed (QE's claim is beside it). `scripts/claim.js` does not exist here,
so the claim record `claim.md` (`task` / `by` / `at`) was written by hand and
`pending/refinement-ABC-027-a1.md` was moved into it by `mv` — the atomic rename the workflow
specifies.

## Read, in the order the brief set

1. `.grugops/queue/pending/refinement-ABC-027-a1.md` — the brief
2. `.grugops/context/abc027-fail-2026-08-12/notes/` — the Orchestrator's acceptance of the FAIL
3. `.grugops/context/security-nfr-ABC-027/notes/` — **five** notes, including the primitive isolated
   with two controls at a 10-column window, `RF-1` measured rather than proposed, and `AR-1`
4. `A1` and the whole of `plans/tickets/ABC-027-frame-writer-clears-each-row.md`
5. `.grugops/context/quality-gate-ABC-027-qe/notes/` — **four** notes: the 14-mutant campaign, the
   attribution putting 9 of 14 kills on `A1`, the margin `claim`, the flag-3 routing
6. `agent-factory/roles/ba-pm.md`, `agent-factory/workflows/16-context-read-write.md`,
   `agent-factory/workflows/17-task-claim.md`, `AGENTS.md` (kit, read-only)
7. `src/frame.ts` (full) and `src/frame.test.ts` — the screen model `:172-262`, the four in-place
   assertion sites `:369-438`, `A6` at `:752-791`, the `ABC-027` block `:809-999`
8. `plans/board.md` and `plans/traceability.md` — **read only**, for the `ABC-027` rows

## Ran — every number in these notes came from one of these

| what | how |
|---|---|
| baseline | `npm test` in the worktree → **681/681 on 22 files** |
| the three emissions counted | `<scratchpad>/a1/count.mjs` — dynamic-imports the DELIVERED modules by relative path under Node 24 type stripping, takes the **delivered** emission from the real `beginFrameSession` and constructs merged and `RF-1`; asserts eleven identities rather than printing for the eye |
| what `RF-1` moves | `RF-1` applied to the copy's `src/frame.ts` by unique-anchor replacement, suite otherwise untouched → **3 failed / 29 passed** |
| the new `A1` witnessed | nine writer variants substituted at the same anchor, each run as `npx vitest run src/frame.test.ts -t "A1 "` |
| `M2`'s count collision | arithmetic on both emissions over a synthetic 23-row frame, all four counts compared |
| the model repair | applied, reverted, and applied against the delivered writer, in two separate copies |
| full gates on the candidate | `npx vitest run` → **682/682 on 22 files**; `npx tsc --noEmit` → 0; `npx biome check` on both files → clean |

**Both harness trees are `<scratchpad>/a1` and `<scratchpad>/a1b`**, each a copy of this worktree's
`src/` verified byte-identical by `/usr/bin/diff -r` before use, with `package.json`, `tsconfig.json`
and `biome.json` copied and `node_modules` symlinked. Scratchpad root:
`/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/83d698c3-dcd1-4fea-848e-c8c0d7d9cbe9/scratchpad`.
The harness files are **not durable**; what is durable is the construction above, which is what a
re-run needs.

Machine: **Apple M3 (Mac15,13) / Darwin 25.5.0 arm64 / Node v24.12.0 / vitest 3.2.7** —
`UNKNOWN - verify` on other hardware, though nothing here is a timing.

## Written — inside the repository, exhaustively

- `plans/tickets/ABC-027-frame-writer-clears-each-row.md` — the repair. `A1` re-derived; `A7` added;
  measured "does not move" evidence appended to `A2`–`A6`; the trailing-erase note re-argued in
  `## Scope`; `## Problem`'s `+66` re-derived to `+69` with attribution; `src/frame.ts:66-73` added to
  scope as an owed comment edit; the assertion-site table re-measured; `NFR-002`'s figures updated
  with the gate's headroom; `S`/`P1` re-derived; the DoR re-run on four items only; flag 3 reworded
  and flag 4 added; the dangling `(A7)` reference repointed; `## Source` extended.
- These three notes, and the queue records under `.grugops/queue/claimed/refinement-ABC-027-a1/`.

## NOT written, exhaustively

- **`src/` — ZERO bytes.** `git status --porcelain src/` = 0 lines at the start and at the end.
  Every writer variant and every model repair was applied to an out-of-tree copy.
- **`plans/board.md`** — the Orchestrator's. **No column change is requested**; the reasoning is in
  the `decision` note.
- **`plans/traceability.md`** — deliberately not edited. Its `ABC-027` NFR cell carries
  `+66 … (H − 1) × 3, 425 → 491`, which is true of the code that exists **today**; editing it before
  `RF-1` lands would make the trace describe a build that does not exist. **Owed at the `RF-1` hop and
  named in the ticket's `## Test notes`.**
- **`plans/nfr-catalog.md`** — not touched, no bar created, moved, loosened or re-derived, and none is
  owed. No wall-clock assertion exists or was proposed.
- **`ABC-016`, `ABC-017`, `ABC-019` tickets and branches** — not edited, not read for content, no
  channel opened and nothing relayed. Agents are live on two.
- **`memory-bank/50-decisions/`** — `ADR-0009` and `ADR-0010` NOT re-opened, NOT edited, NOT
  re-litigated. `ADR-0010`'s `+66` is left standing as correct for the shape it costed.
- **`plans/epics/`** — epic `4b`'s wording flag stays carried, untouched.
- **No criterion relaxed, weakened, deleted or renumbered.** `A1` kept all four counts and the
  byte-exact text; `A2`–`A6` are unchanged in substance.
- **No constant-frame-width criterion**, on this ticket or anywhere. `A7` was checked against the
  prohibition explicitly rather than assumed clear.
- **No `finding`, no verification stamp, no §14 gate verdict record.** That machinery does not exist
  in this repository and self-attesting one would be the fabrication Workflow 16 forbids.
- **Nothing merged, nothing pushed, nothing deployed. `main` was never checked out.** The worktree is
  clean apart from the ticket and these notes, and **681/681 green** as I leave it.
