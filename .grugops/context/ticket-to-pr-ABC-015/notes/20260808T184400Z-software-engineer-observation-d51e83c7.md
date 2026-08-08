---
id: 20260808T184400Z-software-engineer-observation-d51e83c7
kind: observation
by: software-engineer
at: 2026-08-08T18:44:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-015
  - ABC-015
  - NFR-007
  - src/glyph-mode.ts
  - src/glyph-mode.nfr.test.ts
  - plans/nfr-catalog.md
  - AGENTS.md
supersedes: 
---

# The gates as they ran, the NFR bar as it was met, and what is NOT claimed about either

## The four mandatory gates, verbatim

`quality.mandatory_gates` is `["lint", "typecheck", "unit", "build"]`, `gate_enforcement` is
`blocking`, `self_fix_attempts` is `2`.

| Gate | Command | Result |
|---|---|---|
| lint | `npm run lint` (`biome check .`) | **exit 1 first, exit 0 after one autofix pass** |
| typecheck | `npm run typecheck` (`tsc --noEmit`) | exit 0 |
| unit | `npm test` (`vitest run`) | exit 0 — **271 passed / 271, 13 files** |
| build | `npm run build` (`tsc --noEmit`) | exit 0 |

**The lint failure is reported rather than smoothed.** `biome check .` failed with one error, and the
error was **formatting only**, on `src/glyph-mode.test.ts`. `quality.lint.autofix` is `true` and
`AGENTS.md` documents `npx biome check --write <path>`; it was run on the three new files, fixed one,
and the gate then passed. **That is self-fix attempt 1 of 2 and one attempt remains unused.** The two
remaining `infos` in the lint output are a pre-existing `biome migrate` config notice about
`biome.json`, which this subtask did not touch.

**Test-integrity:** skipped-test count **0**, captured with the exact `AGENTS.md` command
(`npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`). `quality.test_integrity`
is `warn`; there is nothing to warn about.

**Suite growth, checked by arithmetic on this run rather than inherited from `ABC-014`'s note:** the
thirteen per-file counts sum to 271, and removing this ticket's two files (15 + 3) leaves **253 on 11
files** — which is what `ABC-014`'s QE record says the suite stood at. The two figures agree.

**Coverage:** `src/glyph-mode.ts` is at **100% statements / branches / functions / lines**. Note that
the `--coverage` run rewrote the repository's tracked `coverage/` directory; it was restored with
`git checkout -- coverage/` and the stray new file removed. See the flag at the end.

## `NFR-007`'s bar: met, and PINNED rather than merely met

The bar is *"zero filesystem and zero process operations; it reads `process.stdout.isTTY` and
`process.env` only"*. It is structural, not timed — and **no wall-clock assertion was added**, per
this project's standing rule that microseconds live in `plans/nfr-catalog.md` with the machine that
measured them. The ticket names no µs bar and none was invented.

`src/glyph-mode.nfr.test.ts` spies `node:fs` (`readFileSync`, `existsSync`, `statSync`,
`readdirSync`) and `node:child_process` (`execSync`, `execFileSync`, `spawnSync`, `spawn`) and
asserts **zero** calls across every selection path plus the session accessor, with a third test as
the control so the first two cannot pass vacuously.

**It exists because a measurement is not a guard** — the lesson `plans/nfr-catalog.md` records
against `NFR-001` and `NFR-005`, both times after behaviour-equivalent mutations left the whole suite
green. The same hole was open here: every acceptance test stays green if a future author "improves"
detection by shelling out to `locale` or reading `/etc/locale.conf`, because neither changes a
returned value. Both mutants were written and both die only to this file.

## What is NOT claimed

**This is not a §14 gate verdict and it is not dressed up as one.** This install has no
`scripts/`, so there is no §14 gate to issue a `§14-gate#<id>` stamp, and `context.human_admission`
is `off`, so no `human:<name>` stamp is available either. **No `finding` is written anywhere in this
subtask and nothing is self-stamped.** These are commands this role ran and their real output; the
gate that adjudicates them is Security/NFR's, still ahead.

**The zero-I/O bar is asserted for this module, not for the cold-start window it sits inside.**
`NFR-007`'s actual target — `npx` to first board in under 2 s — remains `UNKNOWN - verify` in the
catalog and is `EPIC-006`'s to measure; nothing here discharges it, and `plans/nfr-catalog.md` was
deliberately not edited.

## Flagged, not fixed — neither is this subtask's

1. **The tracked `coverage/` directory is stale by two merged tickets** — it has no `render.ts.html`
   (`ABC-014`) and no `history.ts.html` (`ABC-012`), which is also the precedent that engineers here
   do not regenerate it. Restored byte-identically rather than refreshed.
2. **`plans/traceability.md`'s `ABC-015` row has eleven cells against a ten-column header**, and it
   did **before** this subtask edited it (checked at `HEAD`). The cause is a raw unescaped `|` inside
   a TypeScript union type quoted in the `Status` cell. Left as written — escaping it means editing
   another role's recorded audit text — and this subtask's edits kept the count at eleven rather than
   making it worse. Owner: the board sweep, alongside `ABC-012`'s stale ticket frontmatter.
