---
id: 20260812T110900Z-ba-pm-artifact-ref-what-was-written-refused-and-requested-1e6c5910
kind: artifact-ref
by: ba-pm
at: 2026-08-12T11:09:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-026
  - ABC-029
  - RISK-ABC028-02
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - plans/traceability.md
  - plans/board.md
supersedes:
---

# Everything written, everything refused, and the one board move requested

> **Hand-authored.** `scripts/context-io.ts` does **not** exist in this repository or in the kit
> root — re-checked at source this hop (`ls scripts/` → "No such file or directory"), and
> `mcp__grugops__propose_note` is not in this session's tools. **`scripts/claim.js` does not exist
> either**, so the Workflow 17 step 2 claim was made **BY HAND**: a bare `mkdir` (no `-p`) of
> `.grugops/queue/claimed/refinement-ABC-028-a2/`, which exits 0 for the first writer and `EEXIST`
> for a second — **it returned success on the first attempt**, so the claim is held exactly once.
> The pending → claimed transition was a plain `mv` (`git mv` refused: the queue file is untracked).
> **There is no derived `index.md` / `index.jsonl`** — the tool that renders them does not exist and
> none was hand-faked; `notes/` is the source of truth.

## Written — TWO FILES, both under `plans/`, ZERO lines under `src/`

**`plans/tickets/ABC-028-history-pane-unreached-input-classes.md`** — `+379 / −29`. Ten regions:

1. **Front matter** — `status: backlog` → `in-development`, `column: Backlog` → `In Development`.
2. **A dated `[AMENDED]` header block** recording this hop.
3. **The header risk table's `RISK-ABC017-01` row** — the `WCACHE-LEN` correction and the CALL COUNT
   mechanism, at the highest-traffic point on the page.
4. **`## Scope`** — the stale `:106-112` pointer, with the line-map correction blockquote.
5. **The `FLAGGED, NOT EDITED` blockquote in `## Acceptance`** — marked RESOLVED, **kept verbatim**
   so the correction can be audited against what was predicted.
6. **`A1`'s block** — the second site of the false sentence, plus the mechanism as a full blockquote.
7. **`A2`** — **REWRITTEN**, with the ruling, the kept/added/removed count, the three priced
   refusals, and **the prior text preserved verbatim below it, struck through, not deleted.**
8. **`RISK-ABC028-02`** — new, immediately after `A2`.
9. **`A4`** — the lane figures (`748`/`747` → `750`/`749`) and **`RISK-ABC028-01` widened**, with its
   standing obligation extended to the `DataView` witness.
10. **`### Size and priority RE-DERIVED …`**, **`### DoR item 4 RE-CHECKED …`** and **the requested
    board move**, appended at the end.

**`plans/traceability.md`** — **ONE row edited (`ABC-028`), APPEND-ONLY to its `Status` cell**, plus
one `_Updated:` header line. **Verified mechanically before and after:** table lines **39 → 39**;
exactly **one** row starting `| ABC-028 `; that row's unescaped pipe count **11 → 11**; the pre-edit
row text still a **PREFIX** of the new one; the **other 38 table rows byte-identical by md5**
(`edc2a5727b24069fda07f9c3593e673f` before and after); the appended string asserted **pipe-free and
newline-free** before writing. **`UAT` and `Release` deliberately LEFT EMPTY** — this ticket has not
been reviewed or gated, and filling either would fabricate a trace.

## Gates re-run after the change — docs-only, and the baseline is intact

```
lint       exit 0   (2 infos — biome config-migration hints, PRE-EXISTING, 46 files)
typecheck  exit 0
unit       750 passed (750) on 26 files
skip       0
git diff over src/   EMPTY
src/history-pane.ts        md5 54fd4346dcc1a0060c4e66ae0149265d  unchanged
src/history-pane.nfr.test.ts md5 65f4f29ac930d7a7f432e14f2eef47f9  unchanged
```

## Refused — each refusal is a boundary the brief drew

- **`src/` NOT written in any form.** Zero lines. `git diff -- src/` is empty.
- **`src/history-pane.nfr.test.ts` NOT opened for edit** — **`ABC-029` is being built CONCURRENTLY in
  another worktree and its build edits that file.** I read this worktree's own copy to correct the
  line map; **their worktree holds a separate copy and nothing I did can reach it.**
- **`plans/board.md` NOT opened for edit.** The move below is **requested, not taken.**
- **`plans/nfr-catalog.md` and every ADR NOT opened. No bar, target or level moved.**
- **`N8-LANE`'s TOTAL NOT re-derived** — routed to `ABC-026` by the Orchestrator, which exists for
  exactly it. Three readings were published by the build hop and none picked; I picked none either.
  `ADR-0008`'s ratified clauses hold, so nothing binding is breached.
- **The three corrections NOT re-measured** — measured by a hop whose boundaries the Orchestrator
  verified. My job was placement and wording.
- **`ABC-029`, `ABC-019`, `ABC-017` and every merged ticket NOT opened for edit.**
- **`../cli-chess-ABC-019`, `../cli-chess-ABC-028`, `../cli-chess-ABC-029` and
  `../cli-chess-ABC-029-build` NEVER entered.**
- **No criterion renumbered or deleted.** `A2`'s prior text is **struck through and preserved**, not
  removed; `A1`, `A3` and `A4`'s properties are untouched.
- **Nothing merged, nothing pushed, nothing deployed. No `git checkout main`.** No commit was made —
  the working tree carries the change for the Orchestrator to commit or route.

## Requested — ONE board move, and it is the Orchestrator's

**`ABC-028`: `In Development` → `In Review`.**

**All four criteria are MET at zero production lines.** `A1`, `A3` and `A4` were met at the build
hop; **`A2` is MET under the repaired wording, and the repair adds no build work.** Gates on the
branch tip: lint 0, typecheck 0, 750/750 on 26 files, skip 0.

**THIS ROUTES FORWARD TO QE, NOT BACK TO THE ENGINEER.** The `In Review` exit is QE/E2E's and this
hop does not claim it. Board WIP: `In Review` reads `0/3`, so the move does not breach its limit.

## Owed to others, not absorbed here

1. **Orchestrator** — the board move above; and the record that **`ABC-028`'s front matter disagreed
   with the board in EVERY commit on this branch**, because the build hop's change was uncommitted
   in another worktree and never landed. I moved the front matter to agree with the board **today**;
   the `In Review` advance is the board owner's.
2. **QE/E2E** — the `In Review` exit, and the red-before-green reproduction the build hop's own note
   says it did not certify as complete (*"twelve is not certified as the complete set of wrong
   builds"*).
3. **`ABC-026`** — the lane content total, over 650 ms by a from-scratch measurement and over
   **before** this ticket ran.
4. **Whoever next touches `ABC-028` `A1`** — `RISK-ABC028-02`'s standing obligation: deleting,
   weakening or relocating `A1` requires correcting `src/history-pane.nfr.test.ts:102-120` in the
   same change, because that comment asserts `A1` exists.
