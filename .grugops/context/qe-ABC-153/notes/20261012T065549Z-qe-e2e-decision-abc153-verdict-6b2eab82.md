---
id: 20261012T065549Z-qe-e2e-decision-abc153-verdict-6b2eab82
kind: decision
by: qe-e2e
at: 2026-10-12T06:55:49Z
verified_by:
confidence: high
refs:
  - ABC-153
  - ABC-145
  - QE-145-a
  - QE-153-a
  - QE-153-b
  - QE-153-c
  - AR-145-CLI-WIRING
  - NFR-008
  - 20261012T064939Z-software-engineer-decision-abc153-fixture-shape-31329840
  - 20261012T064939Z-software-engineer-observation-abc153-criteria-readings-498907f2
  - 20261012T065549Z-qe-e2e-observation-abc153-readings-cfba105e
  - 20261012T065549Z-qe-e2e-observation-abc153-plants-3d6ce640
  - 20261012T065549Z-qe-e2e-observation-abc153-gap-register-e88108db
  - 20261012T065549Z-qe-e2e-artifact-ref-abc153-commands-6cf5acc6
supersedes:
---

# QE `ABC-153`: PASS_WITH_GAPS. `A1`–`A4` MET on QE's own readings; one LOW and two INFO gaps, none blocking

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install).

| item | value |
|---|---|
| subtask | `qe-ABC-153` |
| reviewed | `grugops/ABC-153-book-sha256-every-file`, tip `fe6add38`, code `917df052`, base `21980135` |
| QE branch | `grugops/qe-ABC-153` off `fe6add38` (worktree `../wt-qe-ABC-153`) |
| agreement | every SE reading (`…498907f2`) matches QE's own |

## Per criterion (detail `…cfba105e`)

- **`A1` MET.** 5 distinct expected hashes (asserted; QE's own byte reading agrees); each file altered by exactly one
  byte, length kept, still compiles under `writeBook`; per file: refused, 3 of 3, no output. Lane 19/19.
- **`A2` MET.** The unaltered control writes.
- **`A3` MET.** QE's eight readings: unmutated green/green; `M05` green → red; `M-SWAP` green → red; `M06` red/red.
- **`A4` MET.** Code range: 1 path, 0 new files; tip adds only record paths. `cmp` 0 on lines 1–274, base 304–314 =
  head 316–326, `fixture()` 68–75; all hunks inside the `A1/A2` `it` body. `compile.ts` and `book.json` `cmp` 0.
  0 spawns. `npm test` 56/1743 at base and at head, 0 pending, 0 todo.
- **Gates:** lint, typecheck, build, `npm test` exit 0; integrity `No findings.`

## Break-the-test (detail `…3d6ce640`)

Head catches: last-file-only, skip `c.tsv` (base missed it), partial output before the throw, refusal without the
actual hash, empty `SOURCE_FILES` (size assertion), a missing restore (fails loud on the next file), a row
collision (size assertion), a no-op alteration. Head misses: a prefix compare (`QE-153-a`, LOW) and a
case-insensitive compare (`QE-153-b`, INFO, equivalent).

## Why PASS_WITH_GAPS

Every criterion is met and the gap `QE-145-a` that the ticket was cut for is closed (`M05`, `M-SWAP`, `Q-SKIPC` all
turn red on the head test only). `QE-153-a` is a further narrowing the ticket did not ask about; it does not make
anything shipped wrong (`book.json` `cmp` 0; `ABC-145` `A4` proved the check on real bytes).

## UAT waiver (measured)

`git diff --name-only 917df052~1 917df052 | grep -v '\.test\.ts$' | grep '^src/'` is **empty**; so is the
`21980135..fe6add38` form. Stricter still: base..tip touches no non-test path outside `.grugops/context/` and
`plans/`. **The zero-production-lines waiver applies by its rule, honestly** (unlike `ABC-145`, no `tools/` code
changed either). Applying it is the Orchestrator's.

## Exit

- **Recommended:** `In Review` → onward (UAT waived by measurement) toward merge. The board move is the Orchestrator's.
- **Optional follow-up:** `QE-153-a` to BA/PM (cut or accept).
- QE touched no `src/`, `tools/`, `data/` or `plans/board.md`; every plant was in scratch; nothing merged or pushed;
  no timing taken.
