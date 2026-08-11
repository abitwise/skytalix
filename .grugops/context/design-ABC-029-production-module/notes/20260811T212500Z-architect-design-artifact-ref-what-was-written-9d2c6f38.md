---
id: 20260811T212500Z-architect-design-artifact-ref-what-was-written-9d2c6f38
kind: artifact-ref
by: architect-design
at: 2026-08-11T21:25:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - NFR-002
  - ADR-0011
  - plans/nfr-catalog.md
  - plans/traceability.md
  - memory-bank/50-decisions/ADR-0011-production-module-scope-for-nfr-002.md
supersedes:
---

# What this hop wrote, and what it deliberately did not

> **Hand-authored** — `scripts/context-io.ts` does not exist in this repository, so there is no
> derived `index.md` / `index.jsonl` render for this `ref:`. Stated so the absence is not read as a
> dropped step.

## Written — three files, and every boundary claim below is mechanical

| file | change | boundary check |
|---|---|---|
| `memory-bank/50-decisions/ADR-0011-production-module-scope-for-nfr-002.md` | **NEW.** Status / Context / Decision / Alternatives / Consequences / Rollback, from `ADR-template.md`. `accepted`, four clauses, eight rejected alternatives each with its evidence, the kill ledger, the residual risk with owner and dated expiry | the next free numeric slot: `ADR-0001`–`ADR-0010` existed, `ADR-0011` did not |
| `plans/nfr-catalog.md` | the **ONE note** the row was owed, appended as a subsection at the end of the `NFR-002` section, plus one `_Updated:` header | **+44 / −0 — additions only.** All eight rows `NFR-001`–`NFR-008` **byte-identical**, hashed together (`sha256 63f66795…ca31` before **and** after) **and each row hashed individually**; 8 rows before and after; 46 table lines before and after |
| `plans/traceability.md` | one `_Updated:` header; **one row** (`ABC-029`) appended to **in the `Status` cell only** | asserted in the writing script, below |

**`plans/traceability.md` assertions — run in the writing script, not eyeballed:**

- table lines **39 before and 39 after**; no row added or deleted;
- the **38 untouched rows byte-identical by md5** (`1edd5c2cf6f62b2a4f8f9d9bfeb042c4`) before and after;
- the edited row **append-only** — its pre-edit text asserted to still be a **prefix** of the new one;
- its naive pipe count **unchanged at 11**;
- the appended string asserted **pipe-free and newline-free BEFORE writing**;
- `_Updated:` headers **50 → 51**, none dropped;
- `Code (PR/files)`, `Tests`, `UAT` and `Release` cells **untouched** — this hop wrote zero `src/` lines.

## NOT written

- **`src/` — ZERO bytes, and zero test lines.** `git diff --stat -- src/` is empty; `git status
  --short` lists only the two `plans/` files and the new ADR. **`src/history-pane.nfr.test.ts` was
  READ and not written**, including the `RISK-ABC017-01` trap at `:104-112`, whose instruction I
  declined.
- **`plans/board.md`** — not opened for edit. The `In Design` exit is this role's on paper, but the
  board text is the Orchestrator's and **no column move is taken here**. `ABC-029` is still
  `Backlog`; whether the design hop's completion moves it is the Orchestrator's call once BA/PM has
  re-scored the DoR.
- **`plans/tickets/` — nothing, including `ABC-029`'s own ticket.** Acceptance criteria are BA/PM's;
  editing the ticket would be writing them by the back door. `ABC-019`, `ABC-028`, `ABC-017` and
  every merged ticket untouched.
- **`NFR-002`'s table row** — read, not edited. No target, bar, level, measured figure or
  `UNKNOWN - verify` marker moved **anywhere in the catalog**.
- **`ADR-0002`, `ADR-0008`, `ADR-0009`, `ADR-0010`** — read, none re-opened, none edited.
- **`../cli-chess-ABC-019`** — **never opened.** The 17-file replica was reconstructed from the git
  object database (`git show <branch>:<path>`), which touches no worktree, and every mutation ran on
  a throwaway copy in the scratch directory.

## Gates in this worktree, before and after my edits — identical

`npm run typecheck` **0** · `npx vitest run` **744 passed / 744 on 26 files**, skip 0 — the brief's
baseline, unchanged, because the three files I wrote are documentation. `npm install` was **not**
re-run and no tracked file it owns was touched.

## Queue

Claimed by **atomic `mkdir`** of `.grugops/queue/claimed/design-ABC-029-production-module/` per
Workflow 17 step 2, before any work — `scripts/claim.js` does not exist here, so the atomic create and
the `claim.md` registry record were performed by hand, and `claimed/` did not exist and was created.
The subtask file was moved `pending/` → `claimed/<task>/` → `done/` by rename. **Recorded honestly:
the claim directory was created at the start of the hop, and the subtask file was moved through both
states at the end rather than at each boundary** — the ownership guarantee (exactly one claimant, by
`mkdir` `EEXIST`) held from the first moment, but the intermediate on-disk state was not observable
for the duration of the work.

## For whoever picks this up next

`ADR-0011` is the ruling; this `ref:`'s `decision` note carries **what it leaves BA/PM** (six items,
including that **size `S` holds** because form (a) was not chosen, and that **items 4 and 10 of the
DoR are unblocked but deliberately NOT re-scored here**). The `observation` note carries every figure
and the harness that produced it. **Nothing merged, nothing pushed, nothing deployed — a human holds
merge and deploy.**
