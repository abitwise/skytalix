---
subtask: bapm-ABC-175-heap
role: ba-pm
tickets: [ABC-175]
ref: .grugops/context/bapm-ABC-175-heap/
---

# BA/PM: ABC-175 page amendment for the heap prefix and the A0 re-take (records only)

## Problem
`secnfr-ABC-174-a0` (route V, F_hi 1.047, A0 commit `ed88329c`; done file `.grugops/queue/done/secnfr-ABC-174-a0.md`, note `.grugops/context/secnfr-ABC-174-a0/notes/…-e4b8d062.md`) found that on the ABC-175 run tree (`grugops/ABC-174` @ `f6b63c1c`, carrying ABC-173's heap guard per ADR-0008 addendum / NFR-010) the verdict command and the A1 `-t "3v4"` probe have no `NODE_OPTIONS=--max-old-space-size=…` prefix, and the guard refuses an unprefixed one-file run (exit 1, no test runs). Probable form: `caffeinate -i env LADDER_DEEP=verdict NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose`. Whether 180 verdict games fit in that heap is UNKNOWN — no OOM probe is in scope here; an OOM on the night goes to the owner (ABC-173 Q4).

## Do
Amend `plans/tickets/ABC-175-*.md` only:
1. § Scope 2 (`:37`) and A1's probe (`:92`): the commands carry the heap prefix. **Use the exact form the Architect hop `arch-ABC-175-heap` writes** (running in parallel; read its done file `.grugops/queue/done/arch-ABC-175-heap.md` when present). If absent when you finish, use the probable form above, mark it "pending Architect ruling", and say so.
2. A1: record the A0 re-take as done — A0 commit `ed88329c` (records-only on `f6b63c1c`), route V, F_hi 1.047; new staleness inputs (vitest.config.ts md5 `326bc5ca578a29c48102e0192b4bfe5a`, ladder.test.ts md5 `bba67b75565b4f4a2e8d231e8bcd6b2e`, node v26.11.1, vitest/4.1.11) replacing the eb216351 values; the "A0 is STALE" bullet becomes history, dated.
3. Re-score DoR. Add an OOM-on-the-night line pointing to ABC-173 Q4 (owner decides).

## Fences
That ticket page and your notes only. No `src/`, ADRs, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`. Leave uncommitted. Never push or merge.

## Publish
Notes under `ref:` (`kind: decision`); `.grugops/queue/done/bapm-ABC-175-heap.md` (brief + `## Result`) and `.claim.md`, uncommitted.

## Result

**done_at 2026-10-19T22:43Z. Amended. DoR 10/10.** Records only, on `plans/tickets/ABC-175-abc-085-verdict-re-take-on-abc-174s-qe-passed-branch-route-v.md`
(+83/−19), uncommitted on main's working tree. Nothing was run or timed, and nothing was pushed or merged.

### The commands (copied verbatim from `.grugops/queue/done/arch-ABC-175-heap.md`; not the fallback)

- Verdict (§ Scope 2):
  `caffeinate -i env LADDER_DEEP=verdict NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose`
- Pre-flight (`A1`):
  `LADDER_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose -t "3v4" > <scratch>.txt 2>&1`
- Both strings matched the Architect's done file under `grep -F`. They are byte-equal to the probable form, and no
  "pending Architect ruling" marker was needed.
- `A1` gains one check: the flag must equal the one `A0` read, exactly 400 (Architect H3).

### Page edits

- **Header:** a dated amendment blockquote.
- **§ Scope 2:** the verdict command, plus a dated amendment line citing H1–H5, `ADR-0045` § ADDENDUM 2026-10-20 and
  `ADR-0038` § ADDENDUM 3.
- **`A1`, `A0`:** the reading in force is now `ed88329c` (`f6b63c1c` is equivalent), route V, `F_hi` 1.047.
  - The new staleness inputs replace the `eb216351` values: `vitest.config.ts` `326bc5ca578a29c48102e0192b4bfe5a`,
    `src/ladder.test.ts` `bba67b75565b4f4a2e8d231e8bcd6b2e`, `v26.11.1` and `vitest/4.1.11 darwin-arm64 node-v26.11.1`.
  - The "STALE" bullet is now dated history: the 2026-10-19 cut, closed 2026-10-20 by the re-take.
- **`A1` probe:** the prefixed command. The probe runs under the run tree's guard, and its exit 0 is the cap's
  admission check (H4).
- **§ Dependencies:** the `A0` re-take is marked met.
- **§ Security / NFR triggers:** a new heap line under `NFR-010`.
  - The target is ONE-FILE 496 MiB per isolate, summing to 992 MiB, within 1984 MiB.
  - Whether 180 games fit is `UNKNOWN - verify`.
  - The page schedules no pre-probe. That is the owner's call under `OQ-175-H1`, and the recommendation is none.
  - **An out-of-memory error on the night goes to `A4`:** no score, no restart, and the owner decides under
    `ABC-173` Q4. The report names whether `heap out of memory` or `Worker exited unexpectedly` appeared.
- **§ DoR:** re-scored **10/10** at `main` `a76b006e`. The 2026-10-19 table is kept as superseded.
  - **Recommendation:** `Backlog → Ready` now, because `ABC-174` is Ready for UAT. The move belongs to the
    Orchestrator, and the frontmatter is unchanged.

### Notes (hand-authored, unsealed; there is no `scripts/context-io.*` on this install)

- `.grugops/context/bapm-ABC-175-heap/notes/20261019T224200Z-ba-pm-decision-abc175-heap-prefix-from-architect-a0-retake-recorded-dor-10-of-10-6e2b91d4.md`
  (decision)

### For the Orchestrator

- **Commit:** this page diff, plus this done file, its claim and the note. The Architect's records are already in
  `a76b006e`.
- **Owner owed before the night:**
  - his go for the night;
  - `OQ-175-H1`, where the recommended answer, no pre-probe, needs no new word.
- **Trace row (to append to `plans/traceability.md`):**

| ABC-175 | page amendment: heap prefix + A0 re-take recorded | bapm-ABC-175-heap | plans/tickets/ABC-175-… (§ Scope 2, A1, Dependencies, Security/NFR, DoR) | commands verbatim from arch-ABC-175-heap (flag 400); A0 = `ed88329c` | DoR 10/10 | records only; OOM on the night → A4 + ABC-173 Q4 (owner); OQ-175-H1 open (no pre-probe recommended) |
