---
id: 20260820T162500Z-software-engineer-artifact-ref-abc050-what-was-delivered-what-was-refused-and-the-three-things-i-am-handing-back-5e0b17c3
kind: artifact-ref
by: software-engineer
at: 2026-08-20T16:25:00Z
verified_by: ""
confidence: high
refs:
  - ABC-050
  - plans/board.md
  - plans/traceability.md
  - biome.json
  - tsconfig.json
  - vitest.config.ts
  - src/glyph-mode.nfr.test.ts
supersedes: ""
type: artifact-ref
task: ticket-to-pr-ABC-050-2026-08-20
role: software-engineer
ticket: ABC-050
created: 2026-08-20T16:25:00Z
tree: grugops/abc050-lane-runner-guard
---

# The artifact, the fences held, and THREE things handed back to the Orchestrator rather than decided here

## Branch and diff

Branch `grugops/abc050-lane-runner-guard`, base `main` @ `d127ae3`. **NOT merged. NOT pushed
(this repo has no remote). NOT deployed.** Four files, **+38 / −9**:

| file | +/− | what changed |
|---|---|---|
| `biome.json` | +1 / −0 | `"vitest.config.ts"` added to `files.includes`, after `"*.json"` and before the seven `!`-negations `2bef492` added |
| `tsconfig.json` | +1 / −1 | `"vitest.config.ts"` added to `include` |
| `vitest.config.ts` | +12 / −6 | **COMMENT LINES ONLY.** The `NOTE FOR THE NEXT ENGINEER` block (now false because of my own `A1` change) and the `A4` sentence |
| `src/glyph-mode.nfr.test.ts` | +24 / −2 | the `A5` assertion inside `runEverySelectionPath()`, plus the doc comment that says why it is absolute and where it is blind |

Also updated in this hop: `plans/board.md` (`ABC-050` moved `Backlog` -> `In Review`, WIP 1/3 ->
2/3 — this role's own transition, one row) and `plans/traceability.md` (**one row APPENDED**, 10
columns re-asserted from disk after the write, no raw pipe inside a cell, nothing touched in
place).

## Fences — each MEASURED, not asserted

- **ZERO production lines under `src/`.** `git diff --name-only d127ae3 | grep -v '\.test\.ts$' |
  grep '^src/'` returns **EMPTY**. `src/glyph-mode.ts` was read, never opened for writing.
- **ZERO runner options moved.** `pool`, `isolate`, `maxThreads`, `exclude` — the entire
  `defineConfig({...})` body is byte-identical to base. `NFR-008`'s firing threshold never fired,
  so there was no stop-and-report to make on that clause.
- **ZERO lint rules narrowed or suppressed.** `biome.json`'s `linter` block byte-identical; no
  `biome-ignore` anywhere in the diff; no `tsconfig` strictness flag relaxed. The widened scope
  surfaced no findings, so `A3`'s "fix them and report each one" clause has an empty list.
- **`2bef492` NOT reverted, tidied or improved.** Its `exclude` key and its seven `!`-negations
  are untouched; my one `biome.json` line was inserted **above** them.
- **`.grugops/test-skips.md` READ and RUN AGAINST, never written.** Zero rows added.
- **`ADR-0008` and `plans/nfr-catalog.md` NOT opened for writing.**
- **The armed control is NOT committed** and lives outside the repository.
- **No `finding` authored and no `§14-gate#<id>` stamp claimed** — `context.human_admission` is
  `off` and no sanctioned writer exists on this install. These notes are hand-authored
  `observation` / `decision` / `artifact-ref`.

## THREE things handed back rather than decided here

1. **`A3` and `A5` collide on the literal criterion text.** A new `it()` satisfies `A5` and
   breaks `A3`'s "test total identical" by one. I resolved it by putting the assertion inside the
   existing helper so both hold — but the criteria as written are not simultaneously satisfiable
   for any hop that adds a test case, and a later ticket copying this shape should know.
2. **The `ABC-050` ticket page still reads `priority: P2`, `status: backlog`, `column: Backlog`.**
   The Orchestrator's promotion to `P1` lives in his decision note and now in the board row; the
   ticket page front matter was **not** edited — it is BA/PM's page and re-scoring is not this
   role's. Flagged so it does not go unnoticed.
3. **The relayed `A1` base probe exit code was wrong** (`exit 0` in the brief and the decision
   note; **actually exit 1** at `d127ae3`). No verdict changes. Corrected in the measurement note
   in this folder.

## Owed next

**`qe-e2e` hop**, per the 2026-08-17 standing directive — every ticket, no exception, before
`In Review` is left. The **zero-production-lines UAT waiver is AVAILABLE** on the measurement in
the fences above, but applying it is the Orchestrator's call and is not claimed here. **Merge is
the Orchestrator's after QE.**
