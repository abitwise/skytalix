---
subtask: qe-ABC-214
role: qe-e2e
ticket: plans/tickets/ABC-214-the-repository-is-licensed-apache-2-0.md
ref: .grugops/context/qe-ABC-214/
branch: grugops/ABC-214 (bb8d4432), worktree ../wt-ABC-214 (exists)
width: 1 of 2 — host on battery; NO timing figures are readings this hop
---

# QE gate for ABC-214

## Do
- In ../wt-ABC-214: merge current main first (report the sha; stop on any conflict outside records). Own npm ci.
- Run every criterion on the page at that merge; re-plant the page's named breakages where it names them. Gates: lint, typecheck, build, npm test (+ .test-results/last-run.json), skip capture, qe-hop-integrity.js --ticket ABC-214.
- Any timing-sensitive item: do not take a reading on this host now (battery, another QE hop beside you) — name it as owed, not a gap.
- Zero executable lines: re-check A1–A10 and the UAT waiver as the SE's note states it (measure over c4acf49f..bb8d4432). ADR-0048 is PROPOSED (owner's); its wording differs from NOTICE by one line break (…e2623df7) — not a QE finding.
- Verdict PASS / PASS_WITH_GAPS / FAIL with severities; UAT: say whether the waiver form applies.

## Fences
- Only ../wt-ABC-214 and /private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe214/. Dated ## QE addendum on the page. No src/ edits. Never push, force, amend or rebase; never merge into main; don't touch the remote or plans/board.md.

## Publish
- Commit on the branch. Seal notes (task qe-ABC-214), at from date -u. ## Result + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**`PASS_WITH_GAPS`** (no blocking gap). Branch `grugops/ABC-214` in `../wt-ABC-214`.

- **Merge:** `306f1083` is `bb8d4432` plus `main` `adf6af38`, with no conflict and records only from `main`.
- **Tip:** `2a9f38cf` (notes and the page's `## QE addendum`). Not pushed, not merged into `main`. No `src/` edit and no ADR edit. `plans/board.md` untouched.
- **A1–A10: all hold** at the merge, re-run by QE:
  - A3's sha and 11358 B hold, and a fresh fetch is byte-identical.
  - A5 holds: exactly the seven identifiers, the base check is identical, and the header block runs from line 1 to 23.
  - A6 holds: the transpile output is identical at `c487d89c`, base, tip and merge, and the two added lines are 21–22, inside the block.
  - A9 holds: six files, base to tip and `main` to merge.
- **Gates:**
  - `npm ci` 0; lint 0; typecheck 0; build 0.
  - `npm test`: 62 files, 2038/2038. `last-run.json` reads success true, pending 0, todo 0.
  - Skip capture `0`, then `No findings.`
  - `qe-hop-integrity.js --ticket ABC-214`: exit 1 before the verdict, as expected. Exit 0 after it, covered by `…719817d2`.
- **Plants:**
  - A8 armed: the whole suite, 1 red (ABC-042 A10) and 2037 green.
  - The four SPDX near-miss spellings each turn the pin red.
  - A6: the `*/` and `*/x` slips break both checks. The early-close `//` variant passes the transpile check and is caught by the line-shape check. A nudged value breaks the transpile check.
  - A5's stop fires against ABC-205 `f3e14a00`.
  - A3's sha breaks on a dropped newline and on CRLF.
  - A4's counts move on `@` and on non-ASCII.
- **Findings:**
  - **QE-214-a, LOW, non-blocking.** The gate pins only `package.json`'s licence. With `LICENSE` and `NOTICE` deleted, the lock reverted and the carve-out lines removed, `npm test` stays 2038/2038 and lint stays 0. This is by test note 6. A guard would be BA/PM's call.
  - **QE-214-b, INFO.** `bb8d4432~1..bb8d4432` alone shows no `src/` file. Measure the waiver over the whole delivery.
  - **QE-214-c, INFO.** ABC-205 moved from `4f650a45` to `f3e14a00`. Its `src/evaluate.ts` is unchanged and `KING_TABLE` is byte-equal, so ADR-0048 decision 4's pre-read holds.
- **UAT:** the waiver form applies: "WAIVED (waived is not accepted)". The 2026-08-17 grep lists `src/evaluate.ts`, and the Q4 measurement (`…5c8e2a17`) holds on both checks (A6).
- **Timing:** none was read (battery, with a second hop running), and none is owed. ABC-214 has no timing criterion.
- **Owed, not QE's:**
  - the owner's acceptance of ADR-0048 before merge;
  - the Security/NFR short hop (`ABC-041` (a));
  - the owner's GitHub licence check after a push, `UNKNOWN - verify`.
- **Notes** (in `../wt-ABC-214/.grugops/context/qe-ABC-214/notes/`, all four read back sealed):
  - observations `…913041ff` (gates), `…c13c32cf` (page checks) and `…09849db8` (plants and gaps);
  - decision `…719817d2` (the verdict).

**Trace row** (for the Orchestrator):

| ABC-214 (qe-ABC-214) | QE: A1–A10 hold at merge 306f1083 (bb8d4432 + main adf6af38); A3 sha = fresh fetch; A5 exactly 7 ids, base check identical; A6 transpile identical c487d89c/base/tip/merge, +2 comment lines 21–22 in block; A9 six files | EPIC-007 (post-close addition) | licence | none moves (A6); ABC-041 (a) → Security/NFR hop owed; QE-214-a LOW (only package.json licence is gate-pinned), -b INFO (measure waiver over delivery), -c INFO (ABC-205 f3e14a00 pre-read holds) | grugops/ABC-214 @ 2a9f38cf (merge 306f1083)<br>.grugops/context/qe-ABC-214/notes/ (4); ABC-214 page ## QE addendum | npm ci 0; lint/typecheck/build 0; npm test 62/2038 success; skips 0 No findings.; qe-hop-integrity covered (…719817d2); plants: A8 armed 1 red/2037, 4 SPDX misspellings red, A6 slips red (early-close // caught by line-shape only), A5 stop fires vs ABC-205, A3/A4 bite; gap plant green | WAIVED (waived is not accepted) — Q4 …5c8e2a17 both checks hold (A6) | — (merge waits on owner ADR-0048) | In Review → In Security/NFR (QE PASS_WITH_GAPS …719817d2) |
