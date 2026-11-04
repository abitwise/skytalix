---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T02:28:35Z
subtask: qe-ABC-280
role: qe-e2e
ref: .grugops/context/qe-ABC-280/
branch: grugops/ABC-280 (frozen edb9fddd; tip d3080707) — worktree .claude/worktrees/se-ABC-280
width: wrap EVERY test/build/engine/fit run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Hop host ≤ 45 min (one full extract|fit|emit ≈ 5 min is enough; re-run only what you need). No games. Host paths only as placeholders.
---
# QE ABC-280 (tools/tune lands alone) — A8
Read plans/tickets/ABC-280*.md (A1–A8), se-ABC-280 notes (…85c1bab5, …443095be, …bd5e26f5). Re-grade A1 (7 paths; tools/tune byte-equal to 8c03b713), A2 (src/ diff vs main empty → UAT waived), A3 (npm test N+3, skips 0, lint/typecheck/build, dist/ has no tool file), A4 (TUNE_DEEP lane), A5 (B-T1 0 misses on main's table), A6 (two byte-identical emissions; judge the SE's emit-to scratch script deviation — it must call the tool's own emit() unchanged), A7 (path check). Check the tool reads PGN comments unread (no engine labels) and refuses a sha256 mismatch (A1 rows of ABC-239's pin). Verdict PASS / PASS_WITH_GAPS / FAIL.
## Fences
tests and your records on that branch; no src/tools edits. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-280, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.

## Result

QE/E2E, `qe-ABC-280`. **PASS_WITH_GAPS, no blocking gap. A1–A8 are MET on the frozen code tip `edb9fddd`.** Notes (sealed): verdict decision `…cf60119e`, re-grades `…452bfc4a`, data and probes `…5c99e4f4`, gaps `…29cd8440`. Raw files are under `.grugops/context/qe-ABC-280/raw/`.

- **A1:** 7 non-record paths. `tools/tune` equals `8c03b713` byte for byte. `tsconfig.json` and `biome.json` gain one line each, the same as `625b75fe`'s. All four commits carry their `-x` provenance line.
- **A2:** the `src/` diff is empty, and the `src` tree `8adb0a18` is the same as `main`'s. The standing rule's reference form prints nothing on simulated merges at `main` `4e8ab57a` and at `b2ae942b`. **UAT is waived.** The read on the delivered merge is still owed (QE-280-c).
- **A3:** `npm test` gave N = 2 647 at `main` and 2 650 / 2 650 at the tip (+3). Skips are 0 on both; `No findings.`. Lint, typecheck and build exit 0. `dist/` holds 24 files, none from `tools/`.
- **A4:** `TUNE_DEEP` lane 17 / 17, 0 skipped.
- **A5 / A6:** QE made a third run in a scratch clone, through the tool's own CLI (its `emit` stage, not the driver). The pin passed `sha256sum -c`. **0 misses over 1 488 071 keys, worst 0.9583 cp.** No data-stage stop fired: run time 4 min 59 s, peak 1.45 GiB. The emission's sha256 is **`329452a3…5b14`**, byte-identical to the Engineer's two, and `fit.json` is byte-equal to theirs. Manifest `c9d777ef…5934`. Reported, not graded: the file differs from `10581fb5…` only in the header's tool-commit line. **The Engineer's `emit-to.ts` deviation is sound:** it calls `emit()` unchanged and gives the same bytes as the CLI.
- **Probes:**
  - **Comments are read unread.** Lichess comments are skipped without capture, and every label is the game result (P3).
  - **A sha256 mismatch is refused through the CLI** when the file has the pin's exact length: exit 1, nothing written (P1a; P1b is the same for a 1-byte file).
  - **The gate catches an untraced +1 cp term in `evaluate`** (P2, scratch clone only).
- **A7:** `records-path-check.js --base main` exits 0.
- **Gaps:** 0 blocking, 0 high, 0 medium.
  - Low:
    - QE-280-a: an unterminated `{` truncates a game without a count.
    - QE-280-b: `NFR-008` headroom. Tip median 9.82 s, `main` 9.73 s; 2 of 8 tip reads were 10.04 and 10.05 s. This ticket is not the cause.
    - QE-280-c: the A2 read on the delivered merge is owed.
  - Information:
    - QE-280-d: a squash or rebase at merge changes the emission's header hash.
    - QE-280-e: the refusal row's name says "exits non-zero", but it tests the function's throw.
    - QE-280-f: A6's driver is judged sound.
    - QE-280-g: the merge into today's `main` conflicts in `plans/traceability.md` (records only; keep both rows).
- **Host:** about 14 min under the lock in total: gates, the full run, the probes and 8 + 8 `npm test` rounds. Nothing is left running, and the scratch clone is outside the tree.
- **Next:**
  - **Orchestrator:** move the board In Review → Done, with a Done note recording the waiver and this verdict. Merge is the human's: prefer a merge commit or a fast-forward, and keep both `plans/traceability.md` rows. Then read QE-280-c on the delivered merge.
  - **Security/NFR:** QE-280-b.
