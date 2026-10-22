---
subtask: security-nfr-ABC-199
role: security-nfr
ticket: plans/tickets/ABC-199-two-coverage-heavy-rows-time-out-at-vitests-5-s-default-under-load-lighten-them-and-keep-the-timeout.md
ref: .grugops/context/security-nfr-ABC-199/
branch: grugops/ABC-199 (tip 8c0c5c81; code 3d6856db)
width: 3 (beside qe-ABC-199 and arch-design-ABC-200)
---

# A8: rule whether an N8-LANE CPU reading is owed for ABC-199

## Do
- Read the ABC-199 page (A8, N8-LANE ≤ 650 ms CPU per one-file set), the diff `08d42d01..3d6856db` (two test files, search work only removed), and the SE's census (`…c662ec3c`).
- Rule whether a CPU reading is owed.
  - **If it is not owed,** give the reason, then confirm the diff touches nothing in `src/` outside `*.test.ts`, no `package*.json` and no config.
  - **If it is owed,** say exactly what to measure. Do **not** take it now: the host is reserved for ABC-178's timing hop, and the reading is scheduled after that.
- While you are here, mark two stale catalog cells for correction: `NFR-006` ("not built yet") and `NFR-003` ("no prompt exists"), flagged by BA/PM in `…623c0fed`. Fix them in `plans/nfr-catalog.md` only if that file is yours to edit.

## Fences
- Records only (plus `plans/nfr-catalog.md` if you own it). No vitest or timing runs. Work on `grugops/security-nfr-ABC-199` (worktree `../wt-security-nfr-ABC-199` from `main`). Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sec199/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `security-nfr-ABC-199`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a trace row into this brief, then move it to `done/`.

## Result (security-nfr, 2026-10-22 19:08Z): **PASS**. A8: no `N8-LANE` CPU reading is owed. No required fixes

Records only. No vitest run and no timing were taken. Commit `4a30a223` on `grugops/security-nfr-ABC-199` (worktree `../wt-security-nfr-ABC-199`, from `main` `8bd75e46`). It is not pushed and not merged. This queue record stays uncommitted in main's tree, like `qe-ABC-199`'s claim beside it.

- **A8 ruling: NOT OWED.** `N8-LANE` limits the cost a ticket adds ("the tests a ticket adds … ≤ 650 ms CPU"; a rate limit, not a grant). `ABC-199` adds no row, file, spawn or production line. Its two edits can only cut work, by construction: `MAX_NODES` 20 000 → 6 000 is a lower abort ceiling, and row 2's reference depth goes 3 → 2. The unlimited `go`'s `virtualClock` step 50 → 100 uses up the same budget in half as many 1 024-node clock reads. The SE census sizes the drop at 31.4 % and 46.9 % of base nodes. Precedent: `security-nfr-ABC-162`. Record it as "not read, not owed", never as MET.
  - **Re-open trigger:** the post-`ABC-178` merge-up, with its A5 re-read. If the conflict resolution in `src/uci-session.test.ts` adds or moves anything beyond the two hunks, the ruling is void and returns to Security/NFR. QE owns that check.
  - **If it were owed** (it is not): `ADR-0035` D2 narrow-set CPU on each one-file set, ≤ 650 ms, after `ABC-178`'s timing hop.
- **Diff scope: confirmed.** `08d42d01..3d6856db` touches `src/engine.test.ts` and `src/uci-session.test.ts` only. Nothing in `src/` outside `*.test.ts` changed, and no `package*.json`, config, `tools/` or `AGENTS.md` changed. There are 0 `timeout` `+` lines, and each hunk sits inside its named `describe`. `..8c0c5c81` adds only the SE notes.
- **Catalog (mine to edit, edited):**
  - `NFR-003` `Verified by`: "no prompt exists …" is struck and kept. The prompt is `ABC-037`'s `"> "`, and the I/O half stays `UNKNOWN - verify`.
  - `NFR-006` `Verified by`: "not built yet …" is struck and kept. It now reads MET, 356,526 B against 1,048,576 B, on `ABC-093` `A5`'s instrument, re-read by `wc -c` at `8bd75e46`.
  - 11 rows were hashed before and after, and only those two changed. I added one `_Updated` line and one closing section.
- **Security:** not triggered (test-only, no ASVS L1 item applies).
- **Not done here:** no board or trace edit (the row below is for the Orchestrator to fold in) and no column move. QE's A7 and the merge-up are still owed.
- **Notes** (`.grugops/context/security-nfr-ABC-199/notes/`, sealed by `context-io.js` `admitAndAppend`, read back by `readContext`, index rendered):
  - `20261022T190834Z-security-nfr-observation-911ecf9d` (readings);
  - `20261022T190841Z-security-nfr-decision-3a990437` (ruling and result).

### Trace row
| ABC-199 (security-nfr) | A8 ruled: `N8-LANE` CPU reading NOT OWED (adds no row, file or spawn; the two test-parameter edits only cut search work: census 31.4 % / 46.9 % of base nodes); re-open if the post-ABC-178 merge-up's A5 re-read shows more than the two hunks. Catalog: `NFR-003` stale "no prompt exists" corrected (I/O half stays `UNKNOWN - verify`); `NFR-006` stale "not built yet" corrected to MET 356,526 B / 1 MB | EPIC-007 | — | N8-LANE (not read, not owed); NFR-008 (not re-read, per ticket); NFR-003; NFR-006 MET; ADR-0035; ADR-0014 | `grugops/security-nfr-ABC-199` @ `4a30a223`<br>`plans/nfr-catalog.md`, `.grugops/context/security-nfr-ABC-199/` | records only; no vitest, no timing; reviewed `08d42d01..3d6856db` (2 test files, 0 non-test `src/`, 0 config/package, 0 `timeout` `+` lines) | — | — | PASS (no required fixes); QE A7 + post-ABC-178 merge-up A5/A6 still owed; column moves are the Orchestrator's |
