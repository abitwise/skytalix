---
id: 20260811T215100Z-ba-pm-artifact-ref-what-was-written-2d9f4a06
kind: artifact-ref
by: ba-pm
at: 2026-08-11T21:51:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-028
  - NFR-002
  - ADR-0011
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
  - plans/traceability.md
supersedes:
---

# What this hop wrote, and what it deliberately did not

> **Hand-authored** — there is **no `scripts/` directory in this repository**, so `scripts/context-io.ts`
> does not exist and there is no derived `index.md` / `index.jsonl` render for this `ref:`. Stated so
> the absence is not read as a dropped step.

## Written — TWO files, both documentation, and every boundary claim below is mechanical

| file | change | numstat |
|---|---|---|
| `plans/tickets/ABC-029-production-module-scope-and-load-probe.md` | `A3` written in **one** form; `A1` re-stated and made countable; `A4`'s second half re-pointed at the site that actually carries the defect; **`A5` NEW**; `## Open design question` marked **CLOSED**; `## Test notes` 3 corrected and 8/9/10 added; size and priority re-derived; **DoR re-scored item by item** | **+299 / −24** |
| `plans/traceability.md` | one `_Updated:` header; **one row** (`ABC-029`) appended to **in the `Status` cell only** | **+2 / −1** |

**`plans/traceability.md` assertions — run IN the writing script BEFORE the write, not eyeballed after:**

- the appended string asserted **pipe-free and newline-free before writing**;
- table lines **39 before and 39 after**; no row added or deleted;
- the **38 untouched rows byte-identical by md5** — `1edd5c2cf6f6…`, **the same value the design hop
  recorded**, an independent cross-check;
- the edited row **append-only** — its pre-edit text asserted to still be a **prefix** of the new one;
- its naive pipe count **unchanged at 11**;
- `_Updated:` occurrences **52 → 53**, none dropped;
- `Code (PR/files)`, `Tests`, `UAT` and `Release` cells **untouched** — this hop wrote zero `src/` lines.

> **The script REFUSED its first run and wrote nothing**, because two assertions failed: I had spliced
> the new `_Updated:` header before recomputing the row index, so the byte-identity and append-only
> checks were reading the wrong line. **The bug was mine, the guard caught it, and the file was written
> only after both went green.** Recorded because a guard that has never refused anything is not
> evidence.
>
> **One counting artefact, so nobody re-derives it as a defect:** `grep -c '_Updated:'` returns **52**
> and `grep -o … | wc -l` returns **53**, because `grep -c` counts **lines** and line **8** carries two
> occurrences. That is **pre-existing and not mine**.

## NOT written

- **`src/` — ZERO bytes and zero test lines.** `git diff --stat -- src/` is **empty** and
  `git ls-files --others --exclude-standard -- src/` is **0**. **`src/history-pane.nfr.test.ts` was READ
  and not written**, including the `RISK-ABC017-01` trap at `:104-112` whose instruction I declined —
  the trigger is the **EDIT**, not the read.
- **`plans/board.md`** — **not opened for edit.** The `Backlog → Ready` exit is this role's on paper,
  but the board text is the Orchestrator's. **The ticket front matter still reads `column: Backlog`
  deliberately**, so the two records cannot disagree; it moves when the board does.
- **Every ADR, including `ADR-0011`** — read, none edited, none re-opened. `memory-bank/` is clean in
  `git status`.
- **`plans/nfr-catalog.md`** — **not opened.** No target, bar, level, measured figure or
  `UNKNOWN - verify` marker moved anywhere.
- **`plans/tickets/` — only `ABC-029`'s own page.** `ABC-019`, `ABC-028`, `ABC-017` and every merged
  ticket untouched (`git status --short -- plans/tickets/` lists exactly one file).
- **`../cli-chess-ABC-019`** — **never opened.** The 17-file replica was reconstructed from the git
  object database and every mutation ran on a throwaway copy in the scratch directory. A concurrent
  hop is live there.

## Gates in this worktree, before and after — identical

`npm run typecheck` **0** · `npx vitest run` **744 passed / 744 on 26 files**, skip **0** — measured
**before** any edit and **again after**, unchanged, because the two files written are documentation.

## Queue

Claimed by **atomic `mkdir`** of `.grugops/queue/claimed/refinement-ABC-029-criteria/` per Workflow 17
step 2, **before any work** — `scripts/claim.js` does not exist here, so the atomic create and the
`claim.md` registry record were done by hand. `claimed/` did not exist in this worktree; it was created
with `mkdir -p` and **the leaf create was a single non-recursive `mkdir`**, so the exactly-once
guarantee (`EEXIST` for a second claimant) holds on the leaf. The subtask file was moved
`pending/` → `claimed/<task>/` at claim time and → `done/` at the end, so **the intermediate on-disk
state was observable for the duration of the work.**

## For whoever picks this up next

**`ABC-029`'s DoR is MET at 10 of 10 (9 clean, 1 `⚠️` on INVEST/independent) and the requested board
move is `Backlog → Ready`.** The `decision` note carries the criteria and the item-by-item score; the
`observation` note carries every figure and the harness.

**Read `A5` before building anything.** `ADR-0011`'s *"BASE green on both guards"* was measured on
`ABC-019`'s **17-file** tip; **this ticket's gate runs on a 16-file tree with no `src/turn-loop.ts`**,
and three measured builds satisfy the older criteria while leaving `ABC-019` red — including the one
that reads clause 3 literally and **reds `ABC-029`'s own blocking gate**. **`ABC-028` still lands
FIRST.** Nothing merged, nothing pushed, nothing deployed — a human holds merge and deploy.
