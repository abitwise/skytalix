---
subtask: qe-ABC-213
role: qe-e2e
ticket: plans/tickets/ABC-213-a-failed-pgn-save-reports-its-first-error-code-even-when-the-cleanup-also-fails-and-leaves-no-partial-file.md
ref: .grugops/context/qe-ABC-213/
branch: grugops/ABC-213 (e71c8901), worktree ../wt-ABC-213 (exists)
width: 1 of 2 — host on battery; NO timing figures are readings this hop
---

# QE gate for ABC-213

## Do
- In ../wt-ABC-213: merge current main first (report the sha; stop on any conflict outside records). Own npm ci.
- Run every criterion on the page at that merge; re-plant the page's named breakages where it names them. Gates: lint, typecheck, build, npm test (+ .test-results/last-run.json), skip capture, qe-hop-integrity.js --ticket ABC-213.
- Any timing-sensitive item: do not take a reading on this host now (battery, another QE hop beside you) — name it as owed, not a gap.
- Merge timing: ABC-213 merges only after qe-timing-ABC-203 reports (page § DoR row 5). Your verdict does not wait for it.
- Verdict PASS / PASS_WITH_GAPS / FAIL with severities; UAT: say whether the waiver form applies.

## Fences
- Only ../wt-ABC-213 and /private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe213/. Dated ## QE addendum on the page. No src/ edits. Never push, force, amend or rebase; never merge into main; don't touch the remote or plans/board.md.

## Publish
- Commit on the branch. Seal notes (task qe-ABC-213), at from date -u. ## Result + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**`PASS_WITH_GAPS`.** Branch `grugops/ABC-213` in `../wt-ABC-213` (own `npm ci --ignore-scripts`, Node 26.11.1).
**Merge `3dc70e20`** = `e71c8901` + `main` `adf6af38` (merge, no conflict, and `main` brought no `src/` or other
non-record path). **Tip `e46db08e`** holds the notes, `raw/` and a dated `## QE addendum` on the page. Not pushed and
not merged. No `src/` edit. **No timing reading was taken** (battery, and the sibling hop in `../wt-ABC-214`).

- **A1–A7: all MET.** A1 ×2, A2 ×2 and A3 are green. A6 holds: one hunk in the cleanup branch, 1 import with the same
  five bindings, 1 export, and `cli.ts`/`pgn.ts` show a 0-line diff. A7 holds: 1 `spawnSync(` site, the `ABC-203`
  rows are unedited, and the `cli.test.ts` one-file-per-child guard is green.
- **A4 plants**, re-planted on scratch copies, never `src/`: X1 reds `A2` ×2 (and `A1` ×2 and `A3`), X3 and X4 each
  red `A1` ×2, and X5 reds `A3`.
- **A5 by hand:** base `dfaa4cdc` gives exit 70, as recorded. Head gives **exit 0** with stderr exactly
  `PGN not saved: EFBIG\n`, and its full stdout equals the control's (sha256 `a2f144e4…`, 516 B). The control is
  unchanged: `EFBIG`, exit 0, 0 files.
- **Gates:**
  - lint, typecheck and build 0;
  - `npm test` 62 files, 2044/2044, success (`last-run.json` agrees, pending 0, todo 0);
  - skips 0, and `test-skip-integrity.js` gives `No findings.`;
  - `qe-hop-integrity.js --ticket ABC-213` exit 0, "covered (qe-e2e)" by `…aceaddaf`. Before the note it was exit 1,
    as expected.
- **Findings:**
  - QE-213-a **LOW**: the cleanup's "the one path this call created" is pinned only at the first candidate. Plant
    Q7 (unlink `games/<stem>.pgn`) passes the whole lane at 2044/2044. On a fault at `-2` it would delete the earlier
    game. Head is correct, and a probe row reds Q7 at 0 spawns and 0 files.
  - -b **INFO**: the write-then-close first code is unpinned (Q6 is green lane-wide).
  - -c **INFO**: the rethrow of a codeless first failure is unpinned (Q8 is green lane-wide).
  - -d **INFO**: the `pgn-file.ts` header (lines 15–16) still says "is removed". It rides with the D4 line.
  - -e **INFO**: a double fault leaves the partial file while the player sees `PGN not saved`. This is the ruled
    behaviour.
- **UAT:** the waiver does **not** apply, because the reference measurement lists `src/pgn-file.ts`. This verdict
  signs UAT under `…5aaf7cec` item 2.
- **Owed, not gaps:**
  - the writer child's CPU, median of 5 at base and at head (0 by construction, not read);
  - the (b′) in-process cost, for Security/NFR;
  - `qe-timing-ABC-203` before the merge (DoR row 5);
  - the `ADR-0047` D4 dated line (Architect/Design);
  - `CLI_DEEP`, which was not run: it is not in this brief, and `cli.ts` is byte-identical.
- **Notes** (in `../wt-ABC-213/.grugops/context/qe-ABC-213/notes/`, seals read back): `…cd83ece0` (readings),
  `…1bb1938c` (plants) and the decision `…aceaddaf`. The evidence is in `raw/`.

**Trace row** (for the Orchestrator):

| ABC-213 (qe-ABC-213) | QE: A1–A7 MET at merge 3dc70e20; A5 by hand base exit 70 → head exit 0, stderr `PGN not saved: EFBIG`, full stdout = control (sha256 a2f144e4…, 516 B); control unchanged | EPIC-006 | PGN export (ABC-203, ADR-0047) | ADR-0036 Ruling 2 → In Security/NFR (closes AR-203-UNLINK); N8-SPAWN 0; writer-child CPU + (b′) in-process cost OWED (no timing this hop); QE-213-a LOW, -b/-c/-d/-e INFO | grugops/ABC-213 @ e46db08e (merge 3dc70e20)<br>src/pgn-file.ts (cleanup guard), src/pgn.test.ts (A1–A3 rig b′)<br>.grugops/context/qe-ABC-213/notes/ (3) + raw/; ABC-213 page ## QE addendum | plants X1/X3/X4/X5 red their rows; QE plants Q6/Q7/Q8 green lane-wide (2044/2044), each red by a probe row; lint/typecheck/build 0; npm test 62/2044 success; skips 0 No findings.; qe-hop-integrity covered | waiver does NOT apply (src/pgn-file.ts); signs UAT under …5aaf7cec item 2 (PASS_WITH_GAPS, no blocking gap) | merge after qe-timing-ABC-203 reports (DoR row 5) | In Review → In Security/NFR |
